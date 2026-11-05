"""Four independent synthetic sources, one saved 4B load, no training/retry.

Run live through the ordinary ensure seam, then replay the exact same four
responses with the preceding API in a separate process. RPC storage is mock;
real SQL lifecycle is covered separately by the repository test suite.
"""
import asyncio
from contextlib import ExitStack
from dataclasses import asdict
from datetime import datetime, timedelta, timezone
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

mode, api, root = sys.argv[1:4]
api, root = Path(api), Path(root)
sys.dont_write_bytecode = True
sys.path[:0] = [str(api/'ai/services/ai_inference'),str(api/'ai/services'),str(api/'ai/tools')]
os.environ['HF_HUB_OFFLINE'] = '1'
os.environ['TRANSFORMERS_OFFLINE'] = '1'
import analysis_cumulative_service as service
from fastapi import HTTPException
from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as admission

OWNER = str(UUID(int=1))
ADAPTER = Path('/workspace/analysis-material-v4-pair8-20261103/train/adapter')
WEIGHTS = 'a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59'
CONFIG = '006ebf7bef859264b3778126f4a0f6512e1b2a7e6049b09dfcf0d56603ede3a9'
sha = lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()


def write(path, value):
    tmp = path.with_suffix(path.suffix+'.tmp')
    tmp.write_text(admission.canonical(value))
    tmp.replace(path)


def inputs():
    now = datetime.now(timezone.utc).isoformat()
    specs = [('RD01','私は会合の進行を担当した。その後、私は分担を決めた。','仕事'),
        ('RD02','私は会合の進行を担当しなかった。その後、私は分担を決めなかった。','仕事'),
        ('RD03','僕は受付を担当した。それから、僕は参加を決めておいた。','生活'),
        ('RD04','僕は受付を担当しなかった。僕は参加を決めなかった。','生活')]
    rows = []
    for n,(key,text,category) in enumerate(specs,1):
        member = dict(original=dict(id=str(UUID(int=7100+n)),created_at='2026-11-01T01:00:00',
            memo=text,memo_action='',category=[category],emotions=['平穏'],emotion_details=[]),thread=None,events=[])
        snap = dict(tier='free',now=now,period_start='2026-11-01T01:00:00+00:00',period_end=now,
            members=[member],guard='analysis-db-cumulative-v1:'+admission.digest([OWNER,member]))
        rows.append(dict(id=key,owner=OWNER,snapshot=snap,provenance='Karen independently synthetic; no training target'))
    return rows


def no_generation():
    stack = ExitStack()
    for name in ('build_cumulative_map','prepare_cumulative_category_units'):
        stack.enter_context(patch.object(service,name,side_effect=AssertionError('saved generation')))
    return stack


async def one(row, *, generator=None, response=None, deadline=None):
    owner,snapshot,key = row['owner'],row['snapshot'],row['id']
    result = dict(row=row,rpc_calls=[],source_calls=0)
    stored = []
    async def source(prepared):
        result['source_calls'] += 1
        assert result['source_calls'] == 1
        messages = prepared.messages()
        result['request'] = dict(request_ref=prepared.request_ref,messages=messages,
            messages_sha256=admission.digest(messages),source_guard=prepared.source_guard)
        if generator is not None:
            raw,finish = await asyncio.to_thread(generator,messages,min(deadline,time.monotonic()+45))
            received = admission.AnalysisModelQuotedParentUnitsResponse(prepared.request_ref,
                admission.digest(messages),hashlib.sha256(raw.encode()).hexdigest(),finish,raw)
        else:
            received = admission.AnalysisModelQuotedParentUnitsResponse(**response)
            assert received.request_ref == prepared.request_ref
            assert received.messages_sha256 == admission.digest(messages)
        result['response'] = asdict(received)
        # Preserve each raw and binding before parsing/adopting the proposal.
        write(root/(mode+'-'+key+'.response.json'),dict(row=row,request=result['request'],response=asdict(received)))
        return received
    async def forbidden(_):raise AssertionError('saved model acquisition')
    async def rpc(name,payload):
        assert payload['p_user_id'] == owner
        result['rpc_calls'].append(dict(name=name,payload=payload))
        if name == 'analysis_cumulative_read':
            rows = json.loads(admission.canonical(stored))
            if payload['p_id'] is not None: rows = [x for x in rows if x['id']==payload['p_id']]
            if not payload['p_history']:
                for x in rows:x.update(snapshot_month=None,captured_at=None)
            return dict(items=rows,subscription_tier='free',matched=True,history_limit=2)
        if name == 'analysis_cumulative_source_snapshot':return snapshot
        assert name == 'analysis_cumulative_commit' and payload['p_guard']==snapshot['guard']
        if 'p_existing_id' in payload:return stored[0]['id']
        rid = str(UUID(payload['p_artifact_id'][9:]))
        stored.append(dict(id=rid,source_profile='cumulative.v1',report_mode='standard',report_type='latest',
            title='わたしマップ',period_start=payload['p_start'],period_end=payload['p_end'],generated_at=snapshot['now'],
            snapshot_month=datetime.now(timezone(timedelta(hours=9))).date().replace(day=1).isoformat(),captured_at=snapshot['now'],
            content_text=payload['p_text'],content_json=dict(report_mode='standard',watashiMap=payload['p_projection'],
                map_context=payload['p_private_evidence']['coverage'])))
        assert 'raw_sha256' not in admission.canonical(payload['p_private_evidence'])
        return rid
    with patch.object(service,'_rpc',rpc),patch.object(service,'observed_mode',return_value='development'):
        try:
            dto = await service.ensure_map(owner,model_source=source)
        except HTTPException as exc:
            result.update(status='REJECTED',error=dict(status_code=exc.status_code,detail=exc.detail))
        else:
            result.update(status='SAVED' if dto['has_visible_content'] else 'UNSUPPORTED',result=dto)
            if stored:
                with no_generation():
                    current = await service.ensure_map(owner,model_source=forbidden)
                    monthly = await service.ensure_map(owner,monthly=True,force=True,model_source=forbidden)
                    readonly = await service.ensure_map(owner,ensure=False,model_source=forbidden)
                for reread in (current,monthly,readonly):
                    assert reread['meta']==dto['meta'] and reread['content_text']==dto['content_text']
                    assert reread['report_id']==dto['report_id'] and not reread['refreshed']
                result.update(current=current,monthly=monthly,readonly=readonly)
    assert result['source_calls']==1
    return result


def main():
    assert mode in {'live','before'} and not (root/(mode+'.json')).exists(),'do_not_restart_run'
    started = time.monotonic()
    report = dict(mode=mode,status='RUNNING',cases=[],new_training=0,normal_adoption=False,
        new_generation=0,model_calls_started=0,model_loads=0,
        scope='existing source-proved natural responsibility/decision/order via explicit ensure/build/commit/read; isolated mock RPC persistence')
    generator = None
    try:
        if mode == 'live':
            signal.signal(signal.SIGALRM,lambda *_: (_ for _ in ()).throw(TimeoutError('trial_deadline')))
            signal.setitimer(signal.ITIMER_REAL,600)
            assert sha(ADAPTER/'adapter_model.safetensors')==WEIGHTS and sha(ADAPTER/'adapter_config.json')==CONFIG
            from serve_emlis_natural_reply import load_generator, MODEL, REVISION, PINS
            from importlib.metadata import version
            report.update(model=MODEL,revision=REVISION,pins={n:version(n) for n in PINS},
                weights_sha256=WEIGHTS,config_sha256=CONFIG)
            assert report['pins']==PINS
            rows = inputs()
            write(root/'input.json',rows)
            generator = load_generator(str(ADAPTER),threading.Event(),weights_sha256=WEIGHTS,config_sha256=CONFIG)
            report['model_loads']=1
            for row in rows:
                report['model_calls_started']+=1
                write(root/'live.json',report)
                case = asyncio.run(one(row,generator=generator,deadline=started+600))
                report['cases'].append(case);report['new_generation']+=1
                write(root/'live.json',report)
            report['initial_unchanged']=(sha(ADAPTER/'adapter_model.safetensors')==WEIGHTS and sha(ADAPTER/'adapter_config.json')==CONFIG)
            assert report['initial_unchanged']
        else:
            live = json.loads((root/'live.json').read_text())
            for case in live['cases']:
                report['cases'].append(asyncio.run(one(case['row'],response=case['response'])))
        report['status']='COMPLETE'
    except BaseException as exc:
        report.update(status='FAILED',error_type=type(exc).__name__,traceback=traceback.format_exc())
        raise
    finally:
        report.update(seconds=time.monotonic()-started,
            saved=sum(x['status']=='SAVED' for x in report['cases']),
            two_nodes=sum(len(x.get('result',{}).get('meta',{}).get('nodes',[]))==2 for x in report['cases']))
        write(root/(mode+'.json'),report)
        if generator is not None:
            del generator;gc.collect()
            import torch
            torch.cuda.empty_cache()
        print(json.dumps({k:v for k,v in report.items() if k not in {'cases','traceback'}},ensure_ascii=False))


if __name__=='__main__':main()
