"""Read actual probe projections through current/monthly readers, with mock RPC.

Dates and month references are synthetic fixture metadata, not DB commits.
The real stored projection/text/coverage/identity remain unchanged. This does
not restore the private artifact graph or prove live DB/monthly persistence.
"""
from __future__ import annotations
import argparse
import asyncio
from contextlib import ExitStack
from copy import deepcopy
from datetime import datetime, timedelta, timezone
import hashlib
import json
from pathlib import Path
import subprocess
import sys
from unittest.mock import AsyncMock, patch
from uuid import UUID


def main():
    cli=argparse.ArgumentParser(description=__doc__)
    cli.add_argument('--api',type=Path,required=True)
    cli.add_argument('--root',type=Path,required=True)
    args=cli.parse_args();api=args.api.resolve();root=args.root.resolve()
    pack=json.loads((root/'pack.private.json').read_bytes())
    result=json.loads((root/'result.private.json').read_bytes())
    assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip()==pack['api_commit']
    for path,sha in pack['api_hashes'].items():
        assert hashlib.sha256((api/path).read_bytes()).hexdigest()==sha
    assert result['status']=='COMPLETE_PENDING_REVIEW_NOT_ADOPTED'
    assert pack['ids']==[c['id'] for c in result['cases']]==['N1','N2','N3']
    sys.path[:0]=[str(api/'ai/services/ai_inference')]
    import analysis_cumulative_service as service
    import analysis_model_source as model_source
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import (
        semantic_admission as admission, intent_compiler as compiler,
        observed_route_realizer as author)
    now=datetime.now(timezone(timedelta(hours=9)))
    month=now.date().replace(day=1).isoformat()
    diagnostic_time=now.isoformat()
    checked=[]
    for case in result['cases']:
        owner=case['row']['owner'];snapshot=case['row']['snapshot'];saved=case['cumulative']
        assert saved['status']=='GENERATED_PRIVATE_ONLY'
        projection=deepcopy(saved['projection']);text=saved['text']['text'];coverage=deepcopy(saved['counts'])
        assert saved['text']['projection_of']==projection['projection_of']
        assert saved['text']['accessibility_linear_order']==projection['accessibility_linear_order']
        artifact=projection['projection_of'].split('@',1)[0]
        report_id=str(UUID(artifact.removeprefix('artifact:')))
        current=dict(id=report_id,source_profile=service.PROFILE,report_mode='standard',
            period_start=snapshot['period_start'],period_end=snapshot['period_end'],
            generated_at=diagnostic_time,title='Synthetic saved-reader diagnostic',
            snapshot_month=None,captured_at=None,content_text=text,
            content_json=dict(report_mode='standard',watashiMap=projection,map_context=coverage))
        monthly=dict(deepcopy(current),snapshot_month=month,captured_at=diagnostic_time)
        calls=[]
        async def rpc(name,payload):
            assert name=='analysis_cumulative_read', 'no DB write/source RPC'
            assert payload['p_user_id']==owner and payload['p_id'] in {None,report_id}
            calls.append(deepcopy(payload))
            row=monthly if payload['p_history'] else current
            return dict(items=[deepcopy(row)],subscription_tier='free',matched=True,history_limit=2)
        forbidden=AsyncMock(side_effect=AssertionError('model acquisition forbidden'))
        def block(*_args,**_kwargs):
            raise AssertionError('generation forbidden during saved read')
        async def read():
            direct=[await service.read_maps(owner,report_id=report_id),
                await service.read_maps(owner,report_id=report_id,history=True,month=month)]
            responses=[await service.ensure_map(owner,ensure=False,model_source=forbidden),
                await service.ensure_map(owner,ensure=False,monthly=True,model_source=forbidden)]
            for value in direct:
                row,=value['items']
                assert row['id']==report_id and row['content_text']==text
                assert row['content_json']['watashiMap']==projection
                assert row['content_json']['map_context']==coverage
            for value in responses:
                assert value['report_id']==report_id and not value['refreshed']
                assert value['meta']==projection and value['content_text']==text
                assert value['map_context']==coverage and value['has_visible_content']
            assert responses[0]['snapshot_month'] is None and responses[1]['snapshot_month']==month
            assert responses[1]['history_saved'] is True
        with ExitStack() as stack:
            stack.enter_context(patch.object(service,'_rpc',side_effect=rpc))
            stack.enter_context(patch.object(service,'_model_response',side_effect=block))
            for obj,name in [(service,'build_cumulative_map'),
                    (model_source,'application_analysis_model_source'),
                    (MeaningExperienceEngine,'generate'),
                    (compiler,'compile_observed_graph'),(compiler,'compile_analysis_unit_candidates'),
                    (author,'realize_observed_graph'),(author,'realize_analysis_unit_candidates'),
                    (admission,'generate_analysis_model_observed_actions'),
                    (admission,'generate_analysis_model_quoted_parent_units')]:
                stack.enter_context(patch.object(obj,name,side_effect=block))
            asyncio.run(read())
        forbidden.assert_not_awaited()
        assert len(calls)==4 and [c['p_history'] for c in calls]==[False,True,False,True]
        assert saved['projection']==projection and saved['counts']==coverage
        checked.append(dict(id=case['id'],read_calls=4,source_records=len(snapshot['members']),
            projection_text_coverage_id_exact=True,model_calls=0,db_calls=0))
    output=dict(schema_version='analysis_target_scope_saved_reader_check.v1',cases=checked,
        synthetic_rpc_reads=12,model_calls=0,db_calls=0,normal_adoption=False,
        scope='Real read_maps/ensure_map(ensure=False), current/monthly; mock RPC only.',
        limitations=['Synthetic generated_at/captured_at/month metadata, not actual DB persistence.',
            'Projection DTO read, not private artifact graph restoration.',
            'Static _text_from_visual validation remains active; author generation entrypoints are forbidden.'])
    (root/'saved-reader.private.json').write_text(json.dumps(output,ensure_ascii=False,sort_keys=True)+'\n')
    print(json.dumps(output,ensure_ascii=False,sort_keys=True))


if __name__=='__main__':main()
