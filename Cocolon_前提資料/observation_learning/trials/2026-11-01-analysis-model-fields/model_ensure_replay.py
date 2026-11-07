"""Replay original v4 responses through ensure; RPC storage is isolated/mock.

Original timestamps/request/messages are never rebound. Real SQL lifecycle is
tested independently with synthetic responses in test_analysis_cumulative_model_source.
"""
import asyncio
from contextlib import ExitStack
from dataclasses import asdict
import hashlib
import json
from pathlib import Path
import sys
import time
from unittest.mock import patch
from uuid import UUID

api, original, previous, output = map(Path, sys.argv[1:5])
sys.path[:0] = [str(api/'ai/services/ai_inference'),str(api/'ai/services'),str(api/'ai/tests')]
from fastapi import HTTPException
import analysis_cumulative_service as service
from cocolon_meaning_experience_engine import MeaningExperienceEngine
from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as admission
from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author


def no_generation():
    stack = ExitStack()
    for obj,names in ((service,['build_cumulative_map','prepare_cumulative_category_units']),
        (MeaningExperienceEngine,['generate']),
        (compiler,['compile_observed_graph','compile_model_observed_actions','compile_model_written_role_graph',
            'compile_model_written_role_action_graph','compile_model_written_role_clause_graph']),
        (author,['realize_observed_graph']), (admission,['generate_analysis_model_observed_actions'])):
        for name in names: stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved generation')))
    return stack


async def replay(row):
    key, owner, snapshot = row['id'], row['owner'], row['snapshot']
    request = json.loads((original/f'after/{key}.request.json').read_text())
    response = json.loads((original/f'after/{key}.response.json').read_text())
    raw = (original/f'after/{key}.raw.txt').read_text()
    assert raw == response['raw'] and hashlib.sha256(raw.encode()).hexdigest() == response['raw_sha256']
    saved, calls, received = [], [], []
    async def source(prepared):
        assert prepared.response is None
        assert prepared.request_ref == row['request_ref'] == request['request_ref'] == response['request_ref']
        assert prepared.messages() == row['messages'] == request['messages']
        assert admission.digest(prepared.messages()) == request['messages_sha256'] == response['messages_sha256']
        received.append(prepared.request_ref)
        return admission.AnalysisModelQuotedParentUnitsResponse(**response)
    async def forbidden(prepared): raise AssertionError('saved source acquisition')
    async def rpc(name,payload):
        assert payload['p_user_id'] == owner
        calls.append(dict(name=name,payload=payload))
        if name == 'analysis_cumulative_read':
            rows = json.loads(admission.canonical(saved))
            if payload['p_id'] is not None: rows = [r for r in rows if r['id'] == payload['p_id']]
            if not payload['p_history']:
                for r in rows: r.update(snapshot_month=None,captured_at=None)
            return dict(items=rows,subscription_tier='free',matched=True,history_limit=2)
        if name == 'analysis_cumulative_source_snapshot': return snapshot
        assert name == 'analysis_cumulative_commit' and payload['p_guard'] == snapshot['guard']
        if 'p_existing_id' in payload:
            assert payload['p_existing_id'] == saved[0]['id']
            return saved[0]['id']
        from datetime import datetime,timedelta,timezone
        rid = str(UUID(payload['p_artifact_id'][9:]))
        saved.append(dict(id=rid,source_profile='cumulative.v1',report_mode='standard',report_type='latest',
            title='わたしマップ',period_start=payload['p_start'],period_end=payload['p_end'],
            generated_at=snapshot['now'],snapshot_month=datetime.now(timezone(timedelta(hours=9))).date().replace(day=1).isoformat(),
            captured_at=snapshot['now'],content_text=payload['p_text'],content_json=dict(report_mode='standard',
                watashiMap=payload['p_projection'],map_context=payload['p_private_evidence']['coverage'])))
        assert payload['p_private_evidence']['source_record_refs'] == [x['original']['id'] for x in snapshot['members']]
        assert 'raw_sha256' not in admission.canonical(payload['p_private_evidence'])
        return rid
    detail = dict(id=key,snapshot=snapshot,request=request,response=response)
    with patch.object(service,'_rpc',rpc), patch.object(service,'observed_mode',return_value='development'):
        try: result = await service.ensure_map(owner,model_source=source)
        except HTTPException as exc:
            assert exc.status_code == 422 and not saved
            detail.update(status='REJECTED',error=dict(status_code=exc.status_code,detail=exc.detail))
        else:
            detail.update(status='SAVED' if result['has_visible_content'] else 'UNSUPPORTED',result=result)
            if saved:
                baseline = json.loads((previous/f'{key}.actual.json').read_text())
                expected = baseline['diagram']
                actual = dict(result['meta'],projection_of=expected['projection_of'])
                assert actual == expected and result['content_text'] == baseline['text']
                assert result['map_context'] == baseline['coverage']
                with no_generation():
                    reread = await service.ensure_map(owner,model_source=forbidden)
                    monthly = await service.ensure_map(owner,monthly=True,force=True,model_source=forbidden)
                    readonly = await service.ensure_map(owner,ensure=False,force=True,model_source=forbidden)
                for x in (reread,monthly,readonly):
                    assert x['meta'] == result['meta'] and x['content_text'] == result['content_text']
                    assert x['report_id'] == result['report_id'] and not x['refreshed']
                detail.update(reread=reread,monthly=monthly,readonly=readonly,saved_rows=saved)
    assert len(received) == 1 and raw == (original/f'after/{key}.raw.txt').read_text()
    detail.update(source_calls=len(received),rpc_calls=calls)
    return detail


started = time.monotonic()
rows = json.loads((original/'pack.json').read_text())['evaluation']
cases = [asyncio.run(replay(row)) for row in rows]
summary = dict(bound_responses=len(cases),saved=sum(x['status']=='SAVED' for x in cases),
    unsupported=sum(x['status']=='UNSUPPORTED' for x in cases),rejected=sum(x['status']=='REJECTED' for x in cases),
    non_generation_current_monthly_readonly=sum('monthly' in x for x in cases),
    seconds=time.monotonic()-started,new_generation=0,new_training=0,model_loads=0,
    scope='original 22 response bindings; real ensure/build/read validators; mock isolated RPC persistence',
    sql_evidence='independent synthetic responses in test_analysis_cumulative_model_source',
    normal_4b_enabled=False,deployed=False,product_credit=0)
assert (summary['bound_responses'],summary['saved'],summary['unsupported'],summary['rejected']) == (22,16,4,2)
output.write_text(admission.canonical(dict(summary=summary,cases=cases)))
print(json.dumps(summary,ensure_ascii=False))
