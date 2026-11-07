"""One CPU-only comparison of the quote prior view; never loads a model."""
import argparse, copy, hashlib, importlib.util, json, os, subprocess, sys, time
from pathlib import Path
from types import SimpleNamespace

def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path)
    mod=importlib.util.module_from_spec(spec);sys.modules[name]=mod;spec.loader.exec_module(mod);return mod
def dump(path,value): path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')

def main(pack):
    started=time.monotonic()
    assert os.environ.get('CUDA_VISIBLE_DEVICES')==''
    assert os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1'
    assert not (pack/'actual_cpu_check.json').exists()
    oldapi=Path('/workspace/cocolon_localized30_api_20261027')
    newapi=Path('/workspace/cocolon_prior_quote_api_20261027')
    run=Path('/workspace/cocolon_adaptive30_run_20261027')
    consumer=load('prior_quote_frozen_consumer',run/'consume_adaptive30.py')
    args=SimpleNamespace(run=run,api=oldapi,legacy=Path('/workspace/cocolon_4b_service_binding_legacy_reference_20261025'),examples=Path('/workspace/cocolon_4b_quote_joint_pack_20261026/sft_examples.jsonl'))
    cases,native=consumer.validate_inputs(args)
    _,reconstruct,_,_,prep,build,_=consumer.load_api(args)
    source='ai/services/ai_inference/cocolon_meaning_experience_engine/model_candidate_source.py'
    candidate=load('cocolon_meaning_experience_engine.prior_quote_cpu_candidate',newapi/source)
    old_inventory={str(p.relative_to(oldapi)):sha(p) for p in oldapi.rglob('*') if p.is_file() and '__pycache__' not in p.parts and '.pytest_cache' not in p.parts}
    new_inventory={str(p.relative_to(newapi)):sha(p) for p in newapi.rglob('*') if p.is_file() and '__pycache__' not in p.parts and '.pytest_cache' not in p.parts}
    changed=[p for p in sorted(set(old_inventory)|set(new_inventory)) if old_inventory.get(p)!=new_inventory.get(p)]
    assert changed==[source,'ai/tests/test_cmee_quote_candidate.py'] or changed==['ai/tests/test_cmee_quote_candidate.py',source],changed
    from transformers import AutoTokenizer
    tok=AutoTokenizer.from_pretrained(candidate.MODEL,revision=candidate.REVISION,local_files_only=True,trust_remote_code=False)
    legacy_helper=load('prior_quote_tokenizer_owner',args.legacy/'run_pilot.py')
    rows=consumer.core.read_jsonl(run/'train_messages.jsonl')
    results=[];newcases=[];changed_count=removed=0
    prior_unchanged=True
    for row,case in zip(rows,cases,strict=True):
        req,prior=reconstruct({'native_case':native[case['case_id']]})
        before=copy.deepcopy(prior)
        old=build(req,prior,candidate_format=prep.QUOTE_CANDIDATE_SCHEMA)
        new=candidate.build_model_messages(req,prior,candidate_format=prep.QUOTE_CANDIDATE_SCHEMA)
        assert old==case['messages']==row['messages'][:-1]
        assert candidate.build_model_messages(req,prior)==build(req,prior),'legacy_changed'
        assert before==prior,'saved_prior_mutated'
        ob=json.loads(old[1]['content']);nb=json.loads(new[1]['content']);expected=copy.deepcopy(ob)
        proof_rows=[]
        if expected['prior_adopted_interpretation'] is not None:
            changed_count+=1
            sources={s['source_id']:s for s in ob['material']['sources']}
            for ev in expected['prior_adopted_interpretation']['meaning_packet']['evidence']:
                text=sources[ev['source_id']]['text_fields'][ev['field_path']]
                assert text.count(ev['quote'])==1
                assert text.find(ev['quote'])==ev['start'] and ev['start']+len(ev['quote'])==ev['end']
                proof_rows.append(dict(source_id=ev['source_id'],field_path=ev['field_path'],quote=ev['quote'],original_start=ev['start'],original_end=ev['end'],uniquely_recoverable=True))
                del ev['start'],ev['end'];removed+=2
        else: assert new==old
        assert nb==expected and new[0]==old[0],'other_prompt_change'
        assert ob['material']==nb['material'] and ob['output_spec']==nb['output_spec']
        ids=legacy_helper.chat_token_ids(tok,new,generation_prompt=True)
        oldids=legacy_helper.chat_token_ids(tok,old,generation_prompt=True)
        full=legacy_helper.chat_token_ids(tok,new+[row['messages'][-1]],generation_prompt=False)
        oldfull=legacy_helper.chat_token_ids(tok,row['messages'],generation_prompt=False)
        assert full[:len(ids)]==ids and oldfull[:len(oldids)]==oldids
        target=full[len(ids):]
        assert target==oldfull[len(oldids):]
        assert tok.eos_token_id in target and len(ids)+case['max_new_tokens']<=8192
        results.append(dict(case_id=case['case_id'],prompt_changed=new!=old,old_prompt_tokens=len(oldids),new_prompt_tokens=len(ids),target_tokens=len(target),prompt_plus_cap=len(ids)+case['max_new_tokens'],teacher_content_sha256=hashlib.sha256(row['messages'][-1]['content'].encode()).hexdigest(),original_quote_rows=proof_rows,source_and_output_spec_unchanged=True,saved_prior_unchanged=True,legacy_messages_unchanged=True,target_ids_unchanged=True))
        newcases.append(dict(case,messages=new))
    assert changed_count==5 and removed==60
    dump(pack/'eval_inputs.json',newcases)
    # pytest is absent on this Pod. The prior attempt log is preserved; no dependency is installed.
    # The actual15 input/teacher/prior checks above are direct assertions, not a pytest suite.
    for p,h in old_inventory.items():assert sha(oldapi/p)==h,'original_api_changed'
    payload=dict(status='CPU_PRIOR_QUOTE_INPUT_FIXED_MODEL_EFFECT_UNMEASURED',seconds=time.monotonic()-started,api_predecessor='a4b91b4788b2fb29483a4c77869c91b36402ae9f',changed_api_paths=changed,source_sha256=sha(newapi/source),case_count=15,changed_answer_prompts=5,unchanged_initial_prompts=10,removed_scalar_offsets=60,original_quotes_uniquely_recoverable=30,legacy15_unchanged=True,teacher15_target_ids_unchanged=True,original_api_unchanged=True,original_input_teacher_and_prior_unchanged=True,direct_assertions_passed=True,tokenizer_trust_remote_code=False,pytest_available=False,pytest_suite_executed=False,pytest_attempt_returncode=1,pytest_log_sha256=sha(pack/'pytest.log'),cases=results,model_loads=0,model_forwards=0,training_updates=0,generations=0,production_sql_operations=0,gpu_lifecycle_operations=0,automatic_progression=False,product_credit=0)
    dump(pack/'actual_cpu_check.json',payload)
    print(json.dumps({k:v for k,v in payload.items() if k!='cases'},ensure_ascii=False),flush=True)

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--pack',type=Path,required=True);main(parser.parse_args().pack)
