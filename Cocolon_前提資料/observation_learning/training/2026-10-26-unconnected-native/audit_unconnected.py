"""One-shot original-source scope audit; no candidate, model, SQL or production write."""
import os
os.environ.update(CUDA_VISIBLE_DEVICES='', HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
import copy, hashlib, json, subprocess, sys, time, urllib.request, urllib.parse
from dataclasses import replace
from pathlib import Path
sys.dont_write_bytecode = True
API = Path('/workspace/cocolon_quote_reception_fixed_api_20261025')
PACK = Path('/workspace/cocolon_4b_quote_joint_pack_20261026')
ROOT = Path('/workspace/cocolon_4b_unconnected_review_20261026')
WEIGHTS = Path('/workspace/cocolon_4b_quote_joint_fit12_20261026/adapter')
COMMIT = '8eeb8e4c5577cc00fab53b3de413a894172ac5e1'
API_COMMIT = '4002b4577838d1ed6671278a19585b61e7ccd10e'
SOURCE_PATH = 'Cocolon_前提資料/observation_learning/training/2026-10-24-emlis-free-pilot/sft_examples.jsonl'
SOURCE_SHA = 'b3115af6a79bb39467517d49f92c94ee7a1019c168f3cf74e078c9960e18bd82'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def require(value, code):
    if not value: raise ValueError(code)
def main():
    started=time.monotonic()
    require(not ROOT.exists(), 'output_exists_do_not_repeat')
    require(subprocess.check_output(['git','-C',str(API),'rev-parse','HEAD'],text=True).strip()==API_COMMIT,'api_head_mismatch')
    require(not subprocess.check_output(['git','-C',str(API),'status','--porcelain','--','ai/services/ai_inference'],text=True).strip(),'api_dirty')
    manifest=json.loads((PACK/'dataset_manifest.json').read_text())
    watched={API/k:v for k,v in manifest['api_source_hashes'].items()}
    watched.update({p:sha(p) for p in WEIGHTS.iterdir() if p.is_file()})
    watched[PACK/'sft_examples.jsonl']=manifest['files']['sft_examples.jsonl']['sha256']
    require(all(sha(p)==v for p,v in watched.items()),'watched_source_mismatch')
    require(sha(WEIGHTS/'adapter_model.safetensors')=='45779ad97111dd2d91c1f7f1a4b0ca697ef0586c5190cd56b1b7675fe540dab6','old_weight_mismatch')
    url='https://raw.githubusercontent.com/MassyuRed/Cocolon/'+COMMIT+'/'+urllib.parse.quote(SOURCE_PATH)
    raw=urllib.request.urlopen(url,timeout=30).read()
    require(len(raw)==44875 and hashlib.sha256(raw).hexdigest()==SOURCE_SHA,'free9_source_mismatch')
    old=[json.loads(line) for line in raw.decode().splitlines()]
    require(len(old)==9,'free9_count_mismatch')
    sys.path.insert(0,str(API/'ai/services/ai_inference'))
    from emlis_ai_current_input_bundle import build_emlis_current_input_bundle
    from cocolon_meaning_experience_engine.contracts import GenerationRequest
    from cocolon_meaning_experience_engine.source_kernel import freeze_text_source
    from cocolon_meaning_experience_engine.emlis_thread_contracts import EmlisThreadInputV1
    from cocolon_meaning_experience_engine.emlis_thread_source import admit_emlis_thread
    from cocolon_meaning_experience_engine.emlis_semantic_admission import _control, _model_source_roles, SemanticNotAdopted
    from cocolon_meaning_experience_engine.preparation import prepare_emlis
    examples=[json.loads(line) for line in (PACK/'sft_examples.jsonl').read_text().splitlines()]
    native=next(e['native_case'] for e in examples if not e['native_case']['answers'])
    initial_control=_control(native['question_control'])
    require(initial_control.pending_question is None and initial_control.issued_count==0
        and not initial_control.asked_target_refs and not initial_control.stop
        and initial_control.question_limit==1,'template_not_initial_control')
    cases=[]
    for example in old:
        card=json.loads(example['messages'][1]['content'])
        original=copy.deepcopy(native['original'])
        original.update(card['source_bundle']['original'])
        request=GenerationRequest('SCOPE-'+example['id'],build_emlis_current_input_bundle(original),original['id'])
        source=freeze_text_source(request)
        control=EmlisThreadInputV1('SCOPE-THREAD-'+example['id'],source.envelope.envelope_id,
            current_round=0,capability_snapshot=native['capability_snapshot'],question_control_context=initial_control)
        request=replace(request,emlis_thread=control)
        material=prepare_emlis(request)
        projected=material.payload()['sources'][0]['original']
        for field,value in card['source_bundle']['original'].items():
            require(projected.get(field)==value,'original_projection_changed_'+field)
        result=dict(id=example['id'],family=example['family'],old_stage=example['stage'],
            source_refs=example['source_refs'],original_source=card['source_bundle']['original'],
            original_only_probe=True,answer_update_executed=False,meaning_candidate_received=False,
            original_fields_preserved=True,synthetic_metadata_fields=sorted(set(original)-set(card['source_bundle']['original'])))
        try:
            roles,markers,corrections,arguments,fields,negations=_model_source_roles(admit_emlis_thread(request),material)
            result.update(original_source_in_scope=True,roles=sorted(roles),marker_roles=sorted(markers))
        except SemanticNotAdopted as exc:
            result.update(original_source_in_scope=False,decision=exc.decision,reason_code=exc.reason_code)
        cases.append(result)
    unsupported=[c['id'] for c in cases if not c['original_source_in_scope']]
    require(set(unsupported)=={'FT-BOOK-INITIAL','FT-BOOK-AFTER-ANSWER','FT-SHOP-INITIAL','FT-SHOP-AFTER-ANSWER','FT-REPOT-INITIAL','FT-KNIT-INITIAL'},'unexpected_scope_result')
    require(all(sha(p)==v for p,v in watched.items()),'watched_source_changed')
    report=dict(status='ORIGINAL_SOURCE_SCOPE_6_ROWS_4_FAMILIES_UNSUPPORTED',api_commit=API_COMMIT,source_commit=COMMIT,
        source_path=SOURCE_PATH,source_sha256=SOURCE_SHA,cases=cases,
        row_count=len(cases),distinct_originals=len({c['original_source']['id'] for c in cases}),
        in_scope_original_rows=sum(c['original_source_in_scope'] for c in cases),unsupported_rows=len(unsupported),
        scope='Original-source gate only. AFTER rows reuse the exact original; no synthetic pending/prior/answer or full semantic/body success.',
        source_and_old_weights_unchanged=True,watched_files={str(p):v for p,v in watched.items()},
        model_weights_loaded=False,model_forward_calls=0,training_updates=0,new_generations=0,sql_calls=0,
        production_changed=False,product_accepted=False,automatic_progression=False,
        runner_sha256=sha(Path(__file__)),seconds=time.monotonic()-started)
    ROOT.mkdir()
    (ROOT/'source_scope_review.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    (ROOT/'original_free9.jsonl').write_bytes(raw)
    (ROOT/'audit_unconnected.py').write_bytes(Path(__file__).read_bytes())
    print(json.dumps({k:report[k] for k in ('status','row_count','distinct_originals','in_scope_original_rows','unsupported_rows','seconds')},ensure_ascii=False))
if __name__=='__main__': main()
