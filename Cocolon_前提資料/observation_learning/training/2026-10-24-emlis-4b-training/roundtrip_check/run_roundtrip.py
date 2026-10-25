"""Known-fixture sequential model -> CMEE -> actual prior -> model offline check."""
from pathlib import Path
import copy
import importlib.metadata
import json
import os
import signal
import sys
import tarfile
import time

ADAPTER='9b845eced7738b32eb21cfe9193798a41ae58d6f439aac9a5731c68e96952835'
API='7a4dc32c07f8c8a30609e8345207c6a9c831de23'


def deadline(*_):
    raise TimeoutError('offline_roundtrip_900_second_deadline')


def main(output):
    directory=Path('/workspace/cocolon_4b_unicode_fit32_20261025')
    saved=Path('/workspace/cocolon_4b_reception_fit4_lr5_20261025')
    sys.path.insert(0,str(directory))
    import run_pilot as r
    import verify_cmee as v
    assert r.digest(directory/'run_pilot.py')=='2f659078c05bee6d7b32f50aae8b9eebc03c767d4a3be084bc17e9e3ccc4c10d'
    assert r.digest(directory/'verify_cmee.py')=='6c042267eeaa9dace4a63abd2ae1ad42f2486c722947a08ed3d1daf571a7684b'
    assert r.digest(directory/'train_messages.jsonl')=='32cd574649525c1352d870c8f276ed440a2362722e5026fe472254ce3cedea0e'
    assert r.digest(directory/'sft_examples.jsonl')=='198847f535eed7a3cac8d6f9cd59f8bfe3e53bc9165eb6d3fb32ed6b17ee54d0'
    assert {k:importlib.metadata.version(k) for k in r.PINS}==r.PINS
    assert os.environ['HF_HUB_OFFLINE']==os.environ['TRANSFORMERS_OFFLINE']=='1'
    hashes=r.adapter_hashes(saved/'adapter')
    assert hashes['adapter_model.safetensors']==ADAPTER
    saved_run=json.loads((saved/'run.json').read_text())
    assert saved_run['source_commit']=='9778aedad5e7081e540a5ce5287ea869d3e04aea'
    assert saved_run['adapter_sha256']==hashes and saved_run['optimizer_steps_completed']==4
    with (output/'attempt.json').open('x') as stream:
        json.dump({'source_commit':(output/'SOURCE_COMMIT').read_text().strip(),'retry':False},stream)
    started=time.monotonic()
    report=dict(status='STARTED',source_commit=(output/'SOURCE_COMMIT').read_text().strip(),
        script_sha256=r.digest(__file__),api_commit=API,adapter_sha256=hashes,
        model_calls_started=0,model_calls_completed=0,training_updates=0,optimizer_created=False,
        database_operations=0,pod_lifecycle_operations=0,max_seconds=900,
        scope='Known fictional chair fixture; sequential model2call offline roundtrip. Not service/Auth/SQL/API/RN/device or product acceptance.')
    def save():r.write_json(output/'run.json',report)
    signal.signal(signal.SIGALRM,deadline);signal.signal(signal.SIGTERM,deadline);signal.alarm(900)
    try:
        import torch
        from transformers import AutoTokenizer
        assert torch.cuda.device_count()==1 and 'A4500' in torch.cuda.get_device_name(0)
        assert torch.cuda.mem_get_info()[0]>=14*2**30
        torch.manual_seed(r.SEED);torch.cuda.manual_seed_all(r.SEED)
        v.load_api('/workspace/cocolon_fit4_api_20261025',API)
        from cocolon_meaning_experience_engine.model_candidate_source import build_model_messages
        tokenizer=AutoTokenizer.from_pretrained(r.MODEL,revision=r.REVISION,trust_remote_code=False,local_files_only=True)
        model,stats=r.load_saved_adapter(saved/'adapter',hashes)
        assert not any(p.requires_grad for p in model.parameters())
        report.update(adapter_tensors=stats,trainable_parameters=0)
        examples=r.read_jsonl(directory/'sft_examples.jsonl')
        source_hash=r.digest(directory/'sft_examples.jsonl')
        assert [e['id'] for e in examples]==['FT-CHAIR-INITIAL','FT-CHAIR-AFTER-CORRECTION']
        originals=copy.deepcopy(examples)
        reference=json.loads((saved/'after_cmee.json').read_text())['cases']
        def generate_one(index,messages,name):
            assert [m['role'] for m in messages]==['system','user'] and len(messages)==2
            assert report['model_calls_started']==index and report['model_calls_completed']==index
            input_tokens=len(r.chat_token_ids(tokenizer,messages,generation_prompt=True))
            assert input_tokens==[1995,5018][index]
            r.write_json(output/(name+'_messages.json'),messages)
            report['model_calls_started']+=1;save()
            r.evaluate(model,tokenizer,[{'case_id':'FIT-'+examples[index]['id'],'messages':messages}],
                output/(name+'_raw.jsonl'),dict(max_new_tokens=2048,context_tokens=8192),adapter_revision=ADAPTER)
            rows=r.read_jsonl(output/(name+'_raw.jsonl'))
            assert len(rows)==1 and rows[0]['finish_reason']=='stop' and rows[0]['parse_error'] is None
            report['model_calls_completed']+=1;save()
            return rows[0]
        request0,prior0=v.reconstruct_request(examples[0])
        assert prior0 is None
        messages0=build_model_messages(request0,None)
        raw0=generate_one(0,messages0,'initial')
        first=v.consume_raw(examples[0],raw0,expected_adapter_revision=ADAPTER)
        r.write_json(output/'initial_cmee.json',first)
        assert first['status']=='MEANING_AND_BODY_AVAILABLE' and first['adoption']=='ADOPTED_PROVISIONAL'
        assert first['outcome']['status']=='QUESTION_PENDING'
        pending=examples[1]['native_case']['question_control']['pending_question']
        assert first['question']==pending
        report.update(stage='INITIAL_ADOPTED_REAL_QUESTION_MATCHED',question_matches_scenario=True,
            initial_messages_equal_fixed=messages0==examples[0]['messages'][:-1])
        save()
        # The answer is used only after the actual issued question matches it exactly.
        actual_case=copy.deepcopy(examples[1])
        actual_case['native_case']['prior_snapshot_json']=first['semantic_snapshot']
        request1,actual_prior=v.reconstruct_request(actual_case)
        assert actual_prior==first['semantic_snapshot']
        messages1=build_model_messages(request1,actual_prior)
        assert messages1==actual_case['messages'][:-1]
        report.update(actual_initial_snapshot_used=True,correction_messages_equal_fixed=True)
        save()
        raw1=generate_one(1,messages1,'correction')
        final=v.consume_raw(actual_case,raw1,expected_adapter_revision=ADAPTER)
        r.write_json(output/'correction_cmee.json',final)
        assert final['adoption']=='ADOPTED_PROVISIONAL' and final['status']=='MEANING_AND_BODY_AVAILABLE'
        assert len(raw1['parsed']['candidate']['updates'])==3
        meaning_checks=[]
        for current,expected in zip([first,final],reference,strict=True):
            a=json.loads(current['semantic_snapshot']);b=json.loads(expected['semantic_snapshot'])
            checks={k:a[k]==b[k] for k in ['snapshot_ref','meaning_packet','native_bindings','prior_ref']}
            assert all(checks.values())
            meaning_checks.append(checks)
        assert examples==originals and r.digest(directory/'sft_examples.jsonl')==source_hash
        assert r.adapter_hashes(saved/'adapter')==hashes
        report.update(status='OFFLINE_KNOWN_ROUNDTRIP_COMPLETE_NOT_PRODUCT_ACCEPTED',meaning_count=2,body_count=2,
            correction_updates=3,meaning_checks=meaning_checks,body_matches_fixed=[first['body']==reference[0]['body'],final['body']==reference[1]['body']],
            question_count=1,final_question=final['question'],final_question_decision=final['outcome']['question_decision'],
            adapter_files_unchanged=True,fixture_unchanged=True,raw_substitution=False,teacher_sent=False)
    except BaseException as exc:
        report.update(status='FAILED_NO_RETRY_NO_RAW_SUBSTITUTION',error=repr(exc));raise
    finally:
        signal.alarm(0);report['seconds']=time.monotonic()-started;save()
        files=sorted(p for p in output.iterdir() if p.is_file() and p.name not in ['result.tar.gz','file_manifest.json'])
        r.write_json(output/'file_manifest.json',{p.name:dict(sha256=r.digest(p),bytes=p.stat().st_size) for p in files})
        with tarfile.open(output/'result.tar.gz','w:gz') as tar:
            for p in files+[output/'file_manifest.json']:tar.add(p,arcname=p.name,recursive=False)
        print(json.dumps({k:report.get(k) for k in ['status','model_calls_started','model_calls_completed','meaning_count','body_count','correction_updates','seconds','error']},indent=2),flush=True)
        print('ARCHIVE_SHA256',r.digest(output/'result.tar.gz'),flush=True)


if __name__=='__main__':main(Path(__file__).resolve().parent)
