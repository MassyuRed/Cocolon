"""One-shot exact saved-v4 model-to-map comparison; no raw rewrite or model call."""
from contextlib import ExitStack
from dataclasses import asdict, replace
from pathlib import Path
from unittest.mock import AsyncMock, patch
from uuid import UUID
import asyncio
import hashlib
import json
import sys
import time

mode=sys.argv[1]
api=Path(sys.argv[2])
root=Path('/workspace/analysis-model-observed-actions-20261105')
original=Path('/workspace/analysis-role-clause-20261105/input/originals')
sys.path[:0]=[str(api/'ai/services/ai_inference'),str(api/'ai/services'),str(api/'ai/tests')]
import analysis_cumulative_service as service
from cocolon_meaning_experience_engine import MeaningExperienceEngine
from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as admission

started=time.monotonic()
out=root/mode;out.mkdir(exist_ok=False)
rows=json.loads((original/'pack.json').read_text())['evaluation']
summary=dict(mode=mode,bound_responses=0,mapped=0,unsupported=0,rejected=0,
    old_candidate_values_retained=0,old_typed_values_retained=0,old_clause_retained=0,
    ordinary_saved_reads=0,legacy_non_generating_reads=0,graphs_equal_to_normal=0,cases=[])

def no_generation():
    stack=ExitStack()
    names=[(MeaningExperienceEngine,'generate'),(compiler,'compile_observed_graph'),
        (compiler,'compile_model_observed_actions'),(compiler,'compile_analysis_unit_candidates'),
        (compiler,'compile_model_written_role_graph'),(compiler,'compile_model_written_role_action_graph'),
        (compiler,'compile_model_written_role_clause_graph'),(author,'generate_observed_map'),
        (author,'realize_observed_graph'),(author,'realize_analysis_unit_candidates'),
        (author,'realize_model_written_role_graph'),(admission,'generate_analysis_model_observed_actions')]
    for obj,name in names:
        if hasattr(obj,name):stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved regeneration')))
    return stack

for row in rows:
    key=row['id'];owner=row['owner'];snap=row['snapshot']
    prepared=service.prepare_cumulative_category_units(owner,snap,prompt_version='selected_material.v4')
    request=json.loads((original/f'after/{key}.request.json').read_text())
    response=json.loads((original/f'after/{key}.response.json').read_text())
    raw=(original/f'after/{key}.raw.txt').read_text()
    assert prepared.messages()==row['messages']==request['messages']
    assert prepared.request_ref==row['request_ref']==request['request_ref']==response['request_ref']
    assert hashlib.sha256(admission.canonical(prepared.messages()).encode()).hexdigest()==request['messages_sha256']==response['messages_sha256']
    assert response['raw']==raw and hashlib.sha256(raw.encode()).hexdigest()==response['raw_sha256']
    summary['bound_responses']+=1
    value=replace(prepared,response=admission.AnalysisModelQuotedParentUnitsResponse(**response))
    case=dict(id=key,raw_sha256=response['raw_sha256'])
    try:
        artifact,coverage=service.build_cumulative_map(owner,snap,model_input=value)
    except (admission.AnalysisSemanticError,compiler.AnalysisSourceError) as exc:
        summary['rejected']+=1;case.update(status='REJECTED',code=str(exc),error_type=type(exc).__name__)
        artifact=None;coverage=None
    else:
        case.update(status='MAPPED' if artifact else 'UNSUPPORTED',coverage=coverage)
        if artifact:
            summary['mapped']+=1
            node,=artifact.graph.nodes
            assert node.node_kind=='ACTION_OR_NONACTION' and node.proposition.actor=='SELF'
            assert node.modality=='fact' and node.temporal_scope=='past' and artifact.graph.edges==()
            assert coverage['mapped_count']==coverage['unparsed_count']==1
            assert any(g.missing_scope=='SOURCE_SCOPE' for g in artifact.graph.unknown_gaps)
            normal,normal_counts=service.build_cumulative_map(owner,snap)
            assert artifact.graph.nodes==normal.graph.nodes and coverage==normal_counts
            summary['graphs_equal_to_normal']+=int(artifact.graph==normal.graph)
            visual=artifact.safe_projection(authenticated_owner_scope=owner)
            text=artifact.safe_text_projection(authenticated_owner_scope=owner)['text']
            stored=dict(id=str(UUID(artifact.artifact_id[9:])),source_profile=service.PROFILE,report_mode='standard',
                content_json=dict(report_mode='standard',watashiMap=visual,map_context=coverage),content_text=text)
            expected=dict(items=[stored],subscription_tier='free',matched=True,history_limit=2)
            path=out/(key+'.ordinary-row.json');path.write_text(admission.canonical(expected))
            rpc=AsyncMock(return_value=json.loads(path.read_text()))
            with no_generation(),patch.object(service,'_rpc',rpc):
                assert asyncio.run(service.read_maps(owner,report_id=stored['id']))==expected
            assert rpc.call_args.args[1]['p_user_id']==owner
            summary['ordinary_saved_reads']+=1
            case.update(nodes=1,edges=0,saved_wire_equal=True)
            (out/(key+'.projection.json')).write_text(admission.canonical(dict(graph=asdict(artifact.graph),
                text=artifact.safe_text_projection(authenticated_owner_scope=owner),diagram=visual,
                coverage=coverage,private_evidence=service.private_storage_evidence(artifact))))
        else:summary['unsupported']+=1
    summary['cases'].append(case)
    if mode=='after':
        for kind in ('candidate','typed'):
            old=original/f'after/{key}.{kind}.json'
            if not old.exists():continue
            if kind=='candidate':
                a,c=service.build_cumulative_quoted_parent_candidates(owner,snap,model_input=value)
                saved=service.serialize_cumulative_quoted_parent_candidates(owner,snap,model_input=value,artifact=a,coverage=c)
                with no_generation():assert service.reload_cumulative_quoted_parent_candidates(owner,snap,old.read_text())==(a,c)
                summary['old_candidate_values_retained']+=1
            else:
                flags=dict(with_action=row['with_action'])
                a,c=service.build_cumulative_written_role_map(owner,snap,model_input=value,**flags)
                saved=service.serialize_cumulative_written_role_map(owner,snap,model_input=value,artifact=a,coverage=c,**flags)
                with no_generation():assert service.reload_cumulative_written_role_map(owner,snap,old.read_text(),**flags)==(a,c)
                summary['old_typed_values_retained']+=1
            assert json.loads(saved)==json.loads(old.read_text()),(key,kind)
            summary['legacy_non_generating_reads']+=1
        if key=='R08':
            a,c=service.build_cumulative_written_role_map(owner,snap,model_input=value,clause=True)
            saved=service.serialize_cumulative_written_role_map(owner,snap,model_input=value,artifact=a,coverage=c,clause=True)
            old=Path('/workspace/analysis-role-clause-20261105/replay/R08.clause.saved.json')
            assert json.loads(saved)==json.loads(old.read_text())
            with no_generation():assert service.reload_cumulative_written_role_map(owner,snap,old.read_text(),clause=True)==(a,c)
            summary['old_clause_retained']+=1;summary['legacy_non_generating_reads']+=1
    if key=='PV06':
        detail=dict(request=request,response=response,snapshot=snap,case=case)
        if artifact:detail.update(graph=asdict(artifact.graph),text=artifact.safe_text_projection(authenticated_owner_scope=owner),
            diagram=artifact.safe_projection(authenticated_owner_scope=owner),stored=stored)
        (out/'PV06.actual.json').write_text(admission.canonical(detail))

assert summary['bound_responses']==22
if mode=='before':assert summary['rejected']==22 and summary['mapped']==0
else:
    assert summary['old_candidate_values_retained']==20 and summary['old_typed_values_retained']==14
    assert summary['old_clause_retained']==1
    assert next(x for x in summary['cases'] if x['id']=='PV06')['status']=='MAPPED'
summary.update(seconds=time.monotonic()-started,new_training=0,new_generation=0,model_loads=0,
    normal_4b_enabled=False,deployment=False,product_credit=0)
(out/'summary.json').write_text(admission.canonical(summary))
print(json.dumps(summary,ensure_ascii=False,indent=2))
