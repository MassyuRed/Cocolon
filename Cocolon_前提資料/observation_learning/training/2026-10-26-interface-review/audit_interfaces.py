"""CPU teacher projection only. No model weights, training, inference or SQL."""
import os
os.environ.update(CUDA_VISIBLE_DEVICES='', HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
import copy, hashlib, json, sys, time
from pathlib import Path
from dataclasses import replace
sys.dont_write_bytecode = True
ROOT = Path('/workspace/cocolon_4b_interface_review_20261026')
PACK = Path('/workspace/cocolon_4b_quote_joint_pack_20261026')
API = Path('/workspace/cocolon_quote_reception_fixed_api_20261025')
LEGACY = Path('/workspace/cocolon_4b_service_binding_legacy_reference_20261025')
WEIGHTS = Path('/workspace/cocolon_4b_quote_joint_fit12_20261026/adapter')
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def wire(v): return json.dumps(v, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False)
def require(v, code):
    if not v: raise ValueError(code)
def main():
    started = time.monotonic()
    require(not (ROOT/'cpu_review.json').exists(), 'result_exists_do_not_repeat')
    sys.path[:0] = [str(API/'ai/services/ai_inference'), str(LEGACY)]
    import run_pilot as helper
    from verify_cmee import reconstruct_request
    import emlis_thread_service as service
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.preparation import prepare_emlis, receive_candidate, _candidate, _compile_quote_candidate, QUOTE_CANDIDATE_SCHEMA
    from cocolon_meaning_experience_engine.model_candidate_source import build_model_messages
    from cocolon_meaning_experience_engine.emlis_semantic_admission import SemanticInput, SemanticNotAdopted, MODEL_PROFILE
    require(Path(service.__file__).resolve().is_relative_to(API), 'foreign_api')
    manifest = json.loads((PACK/'dataset_manifest.json').read_text())
    watched = {PACK/k: v['sha256'] for k,v in manifest['files'].items()}
    watched.update({API/k: v for k,v in manifest['api_source_hashes'].items()})
    watched.update({p: sha(p) for p in WEIGHTS.iterdir() if p.is_file()})
    require(all(sha(p)==v for p,v in watched.items()), 'source_hash_mismatch')
    require(sha(WEIGHTS/'adapter_model.safetensors')=='45779ad97111dd2d91c1f7f1a4b0ca697ef0586c5190cd56b1b7675fe540dab6', 'old_weight_mismatch')
    from transformers import AutoTokenizer
    tokenizer = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION, local_files_only=True, trust_remote_code=False)
    examples = [json.loads(x) for x in (PACK/'sft_examples.jsonl').read_text().splitlines()]
    def consume(req, prior, packet):
        prep = prepare_emlis(req)
        receipt = receive_candidate(prep, request_id=prep.request_id, raw_output=wire(packet), finish_reason='stop')
        result = dict(receipt_status=receipt.status, meaning_adopted=False)
        if receipt.status != 'CANDIDATE_UNREVIEWED': return result
        try:
            engine = MeaningExperienceEngine()
            cp = engine.prepare_emlis_update(req, semantic_input=SemanticInput('FRESH_CANDIDATE', receipt, prior_snapshot_json=prior, semantic_profile=MODEL_PROFILE))
            resumed = replace(req, emlis_thread=replace(req.emlis_thread, prepared_meaning_checkpoint_ref=cp.checkpoint_id))
            out = engine.generate(resumed, semantic_input=SemanticInput('RESUME_ADOPTED', snapshot_json=cp.semantic_snapshot, semantic_profile=MODEL_PROFILE))
            result.update(meaning_adopted=True, meaning_packet=json.loads(cp.semantic_snapshot)['meaning_packet'], body_available=out.artifact is not None,
                surface={k:getattr(out.artifact,k) for k in ('observation','reception','update_note')} if out.artifact else None,
                question_text=out.question.prompt_private if out.question else None, question_disposition=out.question_decision.disposition,
                answer_update=service._json(cp.answer_update), updates=len(cp.answer_update.updates) if cp.answer_update else 0)
        except SemanticNotAdopted as exc:
            result.update(decision=exc.decision, reason_code=exc.reason_code)
        return result
    cases, messages, negatives = [], [], []
    for example in examples:
        req, prior = reconstruct_request(example)
        prep = prepare_emlis(req)
        old = _candidate(example['messages'][-1]['content'])
        canonical = _compile_quote_candidate(prep, old) if 'evidence_quotes' in old else old
        quoted = dict(schema_version=QUOTE_CANDIDATE_SCHEMA, candidate=copy.deepcopy(canonical['candidate']),
            evidence_quotes=[{k:r[k] for k in ('source_id','field_path','quote')} for r in canonical['evidence']])
        require(_compile_quote_candidate(prep, quoted)==canonical, 'lossy_projection')
        msgs = build_model_messages(req, prior, candidate_format=QUOTE_CANDIDATE_SCHEMA)+[dict(role='assistant',content=wire(quoted))]
        encoded, prefix = helper.encode_training(tokenizer, msgs, context=8192)
        completion = len(encoded['input_ids'])-prefix
        require(prefix+2560<=8192 and completion<=2560, 'token_limit')
        require(tokenizer.eos_token_id in encoded['labels'][prefix:], 'missing_eos')
        before, after = consume(req,prior,old), consume(req,prior,quoted)
        keys = ('meaning_packet','surface','question_text','question_disposition','answer_update','updates')
        equal = {k:before.get(k)==after.get(k) for k in keys}
        require(before['meaning_adopted'] and after['meaning_adopted'] and before['body_available'] and after['body_available'] and all(equal.values()), 'meaning_or_surface_drift')
        cases.append(dict(id=example['id'], original_wire='quote' if 'evidence_quotes' in old else 'numeric', quote_rows=len(quoted['evidence_quotes']),
            compiled_equal=True, comparisons=equal, before=before, after=after, prompt_tokens=prefix, assistant_eos_tokens=completion, full_tokens=len(encoded['input_ids'])))
        messages.append(dict(id=example['id'],messages=msgs))
        if len(cases)==2:
            for name in ('missing_rows','out_of_range_reference','missing_quote'):
                bad = copy.deepcopy(quoted)
                if name=='missing_rows': bad['evidence_quotes']=[r for i,r in enumerate(bad['evidence_quotes']) if i not in (6,10,11)]
                elif name=='out_of_range_reference': bad['candidate']['claims'][0]['evidence_indexes']=[999]
                else: bad['evidence_quotes'][0]['quote']='SOURCE_TEXT_NOT_PRESENT'
                result = consume(req,prior,bad)
                require(not result['meaning_adopted'], 'invalid_teacher_admitted')
                negatives.append(dict(name=name,result=result))
    require(len(cases)==9 and all(sha(p)==v for p,v in watched.items()), 'sources_or_count_changed')
    (ROOT/'native_quote_messages.jsonl').write_text(''.join(wire(r)+'\n' for r in messages))
    report = dict(status='CPU_TEACHER_QUOTE_PROJECTION_9_OF_9_NO_MODEL_RUN', scope='TEACHER_ONLY_NOT_MODEL_RAW',
        api_commit='4002b4577838d1ed6671278a19585b61e7ccd10e', cases=cases, negative_controls=negatives,
        source_and_old_weights_unchanged=True, watched_files={str(p):v for p,v in watched.items()},
        model_weights_loaded=False, model_forward_calls=0, training_updates=0, new_generations=0, sql_calls=0,
        gpu_run_authorized=False, model_raw_repaired=False, product_accepted=False, automatic_progression=False,
        runner_sha256=sha(Path(__file__)), seconds=time.monotonic()-started)
    (ROOT/'cpu_review.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(dict(status=report['status'], cases=len(cases), quote_rows=sum(c['quote_rows'] for c in cases), negative_rejected=len(negatives), seconds=report['seconds'])))
if __name__=='__main__': main()
