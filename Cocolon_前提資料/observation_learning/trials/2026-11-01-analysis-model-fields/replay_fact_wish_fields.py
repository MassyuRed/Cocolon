"""Replay preserved model responses through a pinned local API without generation.

The input remains private. This is a CPU consumer comparison, not a model run,
HTTP/DB integration or a claim about independent language quality.
"""
import argparse
import asyncio
from contextlib import ExitStack
from dataclasses import asdict, replace
import hashlib
import json
from pathlib import Path
import subprocess
import sys
from unittest.mock import AsyncMock, patch
from uuid import UUID


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True,
        separators=(',', ':'), allow_nan=False)


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('api',type=Path)
    parser.add_argument('originals',type=Path)
    parser.add_argument('output',type=Path)
    args=parser.parse_args()
    sys.path.insert(0,str(args.api/'ai/services/ai_inference'))
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as admission
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    before=json.loads((args.originals/'before.json').read_text())
    after=json.loads((args.originals/'after.json').read_text())
    reports=[('before',case) for case in before['cases']]
    reports += [('cached_before',case) for case in before['cached_before_cases']]
    reports += [('after',case) for case in after['cases']]
    results=[]
    normal_generate=MeaningExperienceEngine.generate
    with ExitStack() as stack:
        for owner,name in ((MeaningExperienceEngine,'generate'),
                (compiler,'compile_analysis_unit_candidates'),
                (author,'realize_analysis_unit_candidates')):
            stack.enter_context(patch.object(owner,name,
                side_effect=AssertionError('candidate generation forbidden')))
        stack.enter_context(patch.object(service,'_rpc',
            side_effect=AssertionError('database access forbidden')))
        for phase,case in reports:
            row=case['row']
            prepared=service.prepare_cumulative_category_units(row['owner'],row['snapshot'],
                prompt_version=case['request']['prompt_version'])
            assert prepared.request_ref==case['request']['request_ref']
            assert prepared.source_guard==case['request']['source_guard']
            assert prepared.messages()==case['request']['messages']
            response=admission.AnalysisModelQuotedParentUnitsResponse(**case['response'])
            assert hashlib.sha256(response.raw.encode()).hexdigest()==response.raw_sha256
            assert hashlib.sha256(canonical(prepared.messages()).encode()).hexdigest()==response.messages_sha256
            raw=response.raw
            with patch.object(admission,'generate_analysis_model_quoted_parent_units',
                    side_effect=AssertionError('saved candidate generation forbidden')):
                candidate=admission.reload_analysis_model_quoted_parent_units(prepared,
                    case['candidate']['private_state'])
            assert canonical(asdict(candidate.graph))==canonical(case['candidate']['graph'])
            bound=replace(prepared,response=response)
            artifact,counts=service.build_cumulative_map(row['owner'],row['snapshot'],model_input=bound)
            if case['id']=='E06':
                assert artifact is not None, 'E06 must retain both original fields'
            item=dict(phase=phase,id=case['id'],raw_sha256=response.raw_sha256,
                request_ref=prepared.request_ref,raw_unchanged=response.raw==raw,
                candidate_replay_without_generation=True,counts=counts,
                previous_map_status=case['map']['status'],
                map_status='UNSUPPORTED' if artifact is None else 'GENERATED_PRIVATE_ONLY')
            if artifact is not None:
                graph=asdict(artifact.graph)
                item.update(graph=graph,text=artifact.safe_text_projection(authenticated_owner_scope=row['owner']),
                    projection=artifact.safe_projection(authenticated_owner_scope=row['owner']))
                if case['map']['status']=='GENERATED_PRIVATE_ONLY':
                    assert canonical(graph)==canonical(case['map']['graph'])
                    item['previous_graph_unchanged']=True
                if case['id']=='E06':
                    # Compare this one-record change with the existing whole
                    # source path. Multi-record normal composition is outside
                    # this field proof; its prior model graph is checked above.
                    with patch.object(MeaningExperienceEngine,'generate',normal_generate):
                        normal,normal_counts=service.build_cumulative_map(row['owner'],row['snapshot'])
                    assert normal is not None and artifact.graph==normal.graph and counts==normal_counts
                    item['original_source_graph_unchanged']=True
                    assert len(graph['nodes'])==2 and not graph['edges'] and counts['unparsed_count']==0
                    assert {e['field_path'] for n in graph['nodes'] for e in n['evidence_refs']}=={'memo','memo_action'}
                    saved=dict(id=str(UUID(artifact.artifact_id[9:])),source_profile=service.PROFILE,
                        report_mode='standard',content_text=item['text']['text'],
                        content_json=dict(report_mode='standard',watashiMap=item['projection'],map_context=counts))
                    expected=dict(items=[saved],subscription_tier='free',matched=True,history_limit=2)
                    with ExitStack() as reading:
                        reading.enter_context(patch.object(service,'_rpc',AsyncMock(return_value=expected)))
                        for owner,name in ((compiler,'compile_observed_graph'),
                                (compiler,'compile_model_observed_actions'),
                                (compiler,'_model_complete_observed_plain_wishes'),
                                (author,'realize_observed_graph'),(author,'generate_observed_map')):
                            reading.enter_context(patch.object(owner,name,
                                side_effect=AssertionError('saved map recomputation forbidden')))
                        assert asyncio.run(service.read_maps(row['owner'],report_id=saved['id']))==expected
                    item['mock_saved_reader_without_compiler_or_author']=True
            assert response.raw==raw
            results.append(item)
    args.output.parent.mkdir(parents=True,exist_ok=True)
    output=dict(schema_version='analysis_saved_raw_field_proof_review.v1',
        api_head=subprocess.check_output(['git','-C',str(args.api),'rev-parse','HEAD'],text=True).strip(),
        compiler_sha256=hashlib.sha256(Path(compiler.__file__).read_bytes()).hexdigest(),
        model_loads=0,new_generation=0,updates=0,database_access=0,http_calls=0,
        normal_adoption=False,cases=results,
        scope='Exact preserved original responses; direct CPU consumer and mocked saved reader only.')
    args.output.write_text(canonical(output)+'\n')
    print(canonical(dict(cases=len(results),new_generation=0,
        maps=sum(c['map_status']=='GENERATED_PRIVATE_ONLY' for c in results),
        changed=[dict(phase=c['phase'],id=c['id'],before=c['previous_map_status'],after=c['map_status'])
            for c in results if c['map_status']!=c['previous_map_status']],
        output_sha256=hashlib.sha256(args.output.read_bytes()).hexdigest())))


if __name__=='__main__':main()
