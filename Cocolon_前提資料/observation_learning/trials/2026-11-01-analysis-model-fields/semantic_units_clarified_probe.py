"""Explicit Analysis unit probe: two new base calls with clarified instructions, original outputs, no training."""
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

os.environ['HF_HUB_OFFLINE'] = '1'
os.environ['TRANSFORMERS_OFFLINE'] = '1'


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
    if args.out.exists(): parser.error('new output directory required; no overwrite or rerun')
    assert sha(args.requests)==args.requests_sha256
    pack=json.loads(args.requests.read_text())
    assert pack['status']=='SYNTHETIC_MECHANISM_PROBE_NOT_TEACHER_OR_BLIND_EVAL'
    assert pack['profile']=='analysis_model_units.v1'
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
        temp.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n'); temp.replace(p)
    report=dict(status='STARTED',calls=[],synthetic_only=True,training=False,retry=False,
        max_calls=2,max_process_seconds=300,max_request_seconds=23,
        requests_sha256=args.requests_sha256,runner_sha256=sha(__file__),
        started_at=datetime.now(timezone.utc).isoformat())
    save('report.json',report)
    begin=time.monotonic(); deadline=begin+300
    signal.signal(signal.SIGALRM,signal.SIG_DFL); signal.setitimer(signal.ITIMER_REAL,300)
    stop=threading.Event()
    signal.signal(signal.SIGTERM,lambda *_:stop.set())
    signal.signal(signal.SIGINT,lambda *_:stop.set())
    try:
        sys.path[:0]=[str(args.api_root/'ai/tools'),str(args.api_root/'ai/services/ai_inference')]
        from serve_emlis_natural_reply import load_generator,adapter_identity,MODEL,REVISION,PINS
        from cocolon_meaning_experience_engine import MeaningExperienceEngine
        from cocolon_meaning_experience_engine.cores.analysis import intent_compiler,observed_route_realizer
        from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
            AnalysisModelUnitsResponse,AnalysisSemanticError,canonical)
        from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
        import analysis_cumulative_service as service
        import torch
        from transformers import AutoTokenizer
        report.update(model=MODEL,revision=REVISION,pins=PINS,adapter_identity=adapter_identity(str(args.adapter)),
            torch=torch.__version__,cuda=torch.version.cuda,gpu=torch.cuda.get_device_name(0))
        tokenizer=AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
        inputs=[]; counts={}
        for q in pack['requests']:
            p=service.prepare_cumulative_model_units(q['owner'],q['snapshot'],instruction_version=pack['instruction_version'])
            messages=p.messages()
            assert messages==q['messages'] and p.request_ref==q['request_ref']
            encoded=tokenizer.apply_chat_template(messages,enable_thinking=False,add_generation_prompt=True,
                tokenize=True,return_dict=True,return_tensors='pt',truncation=False)
            count=encoded['input_ids'].shape[-1]
            assert count+2048<=8192
            counts[q['probe_id']]=count; inputs.append((q,p,messages))
        del tokenizer
        report['input_tokens']=counts; save('report.json',report)
        for condition,adapter in [('base_clarified',None)]:
            if stop.is_set() or time.monotonic()>=deadline: raise RuntimeError('deadline')
            generator=load_generator(adapter,stop)
            for q,p,messages in inputs:
                if stop.is_set() or time.monotonic()>=deadline: raise RuntimeError('deadline')
                assert len(report['calls'])<2
                name=condition+'_'+q['probe_id']
                ref=p.request_ref; sent_hash=hashlib.sha256(canonical(messages).encode()).hexdigest()
                save(name+'.request.json',dict(request_ref=ref,messages_sha256=sent_hash,
                    source_guard=p.source_guard,messages=messages))
                item=dict(condition=condition,probe_id=q['probe_id'],status='STARTED')
                report['calls'].append(item); save('report.json',report)
                start=time.monotonic(); raw,finish=generator(messages,min(deadline,start+23))
                elapsed=time.monotonic()-start
                (args.out/(name+'.raw.txt')).write_text(raw)
                response=AnalysisModelUnitsResponse(ref,sent_hash,hashlib.sha256(raw.encode()).hexdigest(),finish,raw)
                save(name+'.response.json',asdict(response))
                item.update(status='RETURNED',finish_reason=finish,seconds=elapsed,raw_sha256=response.raw_sha256)
                save('report.json',report)
                try:
                    bound=replace(p,response=response)
                    artifact,coverage=service.build_cumulative_unit_candidates(q['owner'],q['snapshot'],model_input=bound)
                except (AnalysisSemanticError,AnalysisSourceError) as exc:
                    item.update(admission='REJECTED',reason=str(exc),artifact_created=False)
                else:
                    item.update(admission='RETURNED',artifact_created=True,coverage=coverage,
                        units=sum(len(f.units) for f in artifact.graph.fields))
                    path=args.out/(name+'.candidate.json')
                    path.write_text(service.serialize_cumulative_unit_candidates(q['owner'],q['snapshot'],
                        model_input=bound,artifact=artifact,coverage=coverage))
                    with patch.object(MeaningExperienceEngine,'generate',side_effect=AssertionError('no generation')), \
                         patch.object(intent_compiler,'compile_analysis_unit_candidates',side_effect=AssertionError('no compiler')), \
                         patch.object(observed_route_realizer,'realize_analysis_unit_candidates',side_effect=AssertionError('no author')):
                        restored,counts=service.reload_cumulative_unit_candidates(q['owner'],q['snapshot'],path.read_text(),instruction_version=pack['instruction_version'])
                    assert restored==artifact and counts==coverage
                    item.update(file_replay='MATCHED',candidate_id=artifact.candidate_id,sql_commit_count=0)
                save('report.json',report)
            del generator; gc.collect(); torch.cuda.empty_cache(); torch.cuda.synchronize()
        report['status']='COMPLETE'
    except BaseException as exc:
        report.update(status='FAILED',error_type=type(exc).__name__,error=str(exc),traceback=traceback.format_exc())
        raise
    finally:
        report.update(process_seconds=time.monotonic()-begin,ended_at=datetime.now(timezone.utc).isoformat())
        save('report.json',report); signal.setitimer(signal.ITIMER_REAL,0)


if __name__=='__main__':
    main()
