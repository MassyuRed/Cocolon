"""Fixed offline Analysis probe: four generations, no retries or training.

Run only under a new explicit GPU execution instruction. No model download,
server, Pod operation or credentials. Existing verified load_generator is used.
"""
import argparse
from dataclasses import asdict, replace
from datetime import datetime, timezone
import gc
import hashlib
import json
import os
from pathlib import Path
import signal
import sys
import threading
import time
import traceback
from unittest.mock import patch
from uuid import UUID

os.environ['HF_HUB_OFFLINE']='1'
os.environ['TRANSFORMERS_OFFLINE']='1'

def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--api-root',required=True,type=Path)
    parser.add_argument('--requests',required=True,type=Path)
    parser.add_argument('--requests-sha256',required=True)
    parser.add_argument('--adapter',required=True,type=Path)
    parser.add_argument('--out',required=True,type=Path)
    args=parser.parse_args()
    if args.out.exists(): parser.error('a new output directory is required; no rerun or overwrite')
    assert sha(args.requests)==args.requests_sha256
    pack=json.loads(args.requests.read_text())
    assert pack['status']=='SYNTHETIC_MECHANISM_PROBE_NOT_TEACHER_OR_BLIND_EVAL'
    assert pack['profile']=='analysis_model_field_kinds.v1'
    assert [q['probe_id'] for q in pack['requests']]==['AF01','AF02']
    for path,expected in pack['api_source_blobs'].items():
        b=(args.api_root/path).read_bytes()
        assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==expected
    loader=args.api_root/'ai/tools/serve_emlis_natural_reply.py'
    b=loader.read_bytes()
    assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()=='722525c2a1f1afe0a5f0902e0bddf5b602db8a1a'
    args.out.mkdir()
    def save(name,value):
        p=args.out/name; temp=p.with_suffix(p.suffix+'.tmp')
        temp.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n');temp.replace(p)
    report={'status':'STARTED','calls':[],'synthetic_only':True,'training':False,'retry':False,
            'max_calls':4,'max_process_seconds':600,'max_request_seconds':23,
            'requests_sha256':args.requests_sha256,'runner_sha256':sha(__file__),
            'started_at':datetime.now(timezone.utc).isoformat()}
    save('report.json',report)
    begin=time.monotonic();deadline=begin+600
    signal.signal(signal.SIGALRM,signal.SIG_DFL);signal.setitimer(signal.ITIMER_REAL,600)
    stop=threading.Event()
    signal.signal(signal.SIGTERM,lambda *_:stop.set())
    signal.signal(signal.SIGINT,lambda *_:stop.set())
    try:
        sys.path[:0]=[str(args.api_root/'ai/tools'),str(args.api_root/'ai/services/ai_inference')]
        from serve_emlis_natural_reply import load_generator,adapter_identity,MODEL,REVISION,PINS
        import analysis_cumulative_service as service
        from analysis_observed_service import private_storage_evidence,_checked_projection
        from cocolon_meaning_experience_engine import MeaningExperienceEngine
        from cocolon_meaning_experience_engine.cores.analysis.observed_route_realizer import ObservedSelfStructureMap
        from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
            AnalysisModelFieldKindsResponse,AnalysisSemanticError,canonical)
        from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
        import torch
        from transformers import AutoTokenizer
        report.update(model=MODEL,revision=REVISION,pins=PINS,adapter_identity=adapter_identity(str(args.adapter)),
                      torch=torch.__version__,cuda=torch.version.cuda,gpu=torch.cuda.get_device_name(0))
        tokenizer=AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
        inputs=[];counts={}
        for q in pack['requests']:
            p=service.prepare_cumulative_model_field_kinds(q['owner'],q['snapshot'])
            messages=p.messages()
            assert messages==q['messages'] and p.request_ref==q['request_ref']
            encoded=tokenizer.apply_chat_template(messages,enable_thinking=False,add_generation_prompt=True,
                tokenize=True,return_dict=True,return_tensors='pt',truncation=False)
            count=encoded['input_ids'].shape[-1]
            assert count+2048<=8192
            counts[q['probe_id']]=count;inputs.append((q,p,messages))
        del tokenizer
        report['input_tokens']=counts;save('report.json',report)
        for condition,adapter in [('base',None),('fit38',str(args.adapter))]:
            if stop.is_set() or time.monotonic()>=deadline: raise RuntimeError('deadline')
            generator=load_generator(adapter,stop)
            for q,p,messages in inputs:
                if stop.is_set() or time.monotonic()>=deadline: raise RuntimeError('deadline')
                assert len(report['calls'])<4
                name=condition+'_'+q['probe_id']
                # Capture full source/request/messages binding BEFORE this call.
                request_ref=p.request_ref
                messages_hash=hashlib.sha256(canonical(messages).encode()).hexdigest()
                save(name+'.request.json',{'request_ref':request_ref,'messages_sha256':messages_hash,
                    'source_guard':p.source_guard,'messages':messages})
                item={'condition':condition,'probe_id':q['probe_id'],'status':'STARTED'}
                report['calls'].append(item);save('report.json',report)
                call_begin=time.monotonic()
                raw,finish=generator(messages,min(deadline,call_begin+23))
                elapsed=time.monotonic()-call_begin
                (args.out/(name+'.raw.txt')).write_text(raw)
                response=AnalysisModelFieldKindsResponse(request_ref,messages_hash,
                    hashlib.sha256(raw.encode()).hexdigest(),finish,raw)
                save(name+'.response.json',asdict(response))
                item.update(status='RETURNED',finish_reason=finish,seconds=elapsed,raw_sha256=response.raw_sha256)
                save('report.json',report)
                try:
                    artifact,coverage=service.build_cumulative_map(q['owner'],q['snapshot'],model_input=replace(p,response=response))
                except (AnalysisSemanticError,AnalysisSourceError) as e:
                    item.update(admission='REJECTED',reason=str(e),artifact_created=False)
                else:
                    item.update(admission='RETURNED',artifact_created=artifact is not None,coverage=coverage)
                    if artifact is not None:
                        projection=artifact.safe_projection(authenticated_owner_scope=q['owner'])
                        text=artifact.safe_text_projection(authenticated_owner_scope=q['owner'])['text']
                        value={'id':str(UUID(artifact.artifact_id[9:])),'projection':projection,'text':text,
                            'coverage':coverage,'private_evidence':private_storage_evidence(artifact)}
                        save(name+'.artifact.json',value)
                        with patch.object(MeaningExperienceEngine,'generate',side_effect=AssertionError('read must not generate')):
                            saved=json.loads((args.out/(name+'.artifact.json')).read_text())
                            assert saved==json.loads(json.dumps(value,ensure_ascii=False))
                            _checked_projection(saved['projection'],saved['id'])
                            service._checked_coverage(saved['coverage'])
                            assert ObservedSelfStructureMap._text_from_visual(saved['projection'])['text']==saved['text']
                        item['file_projection_text_replay']='MATCHED'
                        item['sql_commit_count']=0
                save('report.json',report)
            del generator;gc.collect();torch.cuda.empty_cache();torch.cuda.synchronize()
        report['status']='COMPLETE'
    except BaseException as e:
        report.update(status='FAILED',error_type=type(e).__name__,error=str(e),traceback=traceback.format_exc())
        raise
    finally:
        report.update(process_seconds=time.monotonic()-begin,ended_at=datetime.now(timezone.utc).isoformat())
        save('report.json',report)
        signal.setitimer(signal.ITIMER_REAL,0)

if __name__=='__main__':
    main()
