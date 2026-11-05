"""Replay the same 22 saved v4 responses through ordinary maps; no generation."""
from contextlib import ExitStack
from dataclasses import asdict, replace
from pathlib import Path
from unittest.mock import AsyncMock, patch
from uuid import UUID
import asyncio, hashlib, json, sys, time

mode,api,root,original=sys.argv[1:5]
api,root,original=map(Path,(api,root,original))
sys.path[:0]=[str(api/'ai/services/ai_inference'),str(api/'ai/services'),str(api/'ai/tests')]
import analysis_cumulative_service as service
from cocolon_meaning_experience_engine import MeaningExperienceEngine
from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as admission

start=time.monotonic();out=root/mode;out.mkdir(exist_ok=False)
rows=json.loads((original/'pack.json').read_text())['evaluation']
result=dict(mode=mode,bound_responses=0,mapped=0,unsupported=0,rejected=0,role_maps=0,
    role_action_maps=0,clause_maps=0,ordinary_saved_reads=0,legacy_reads=0,cases=[])

def no_generation():
    stack=ExitStack()
    for obj,names in ((MeaningExperienceEngine,['generate']),
        (compiler,['compile_observed_graph','compile_model_observed_actions','compile_analysis_unit_candidates',
            'compile_model_written_role_graph','compile_model_written_role_action_graph','compile_model_written_role_clause_graph']),
        (author,['generate_observed_map','realize_observed_graph','realize_model_written_role_graph','realize_analysis_unit_candidates']),
        (admission,['generate_analysis_model_observed_actions'])):
        for name in names:stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved regeneration')))
    return stack

for row in rows:
    key,owner,snap=row['id'],row['owner'],row['snapshot']
    prepared=service.prepare_cumulative_category_units(owner,snap,prompt_version='selected_material.v4')
    request=json.loads((original/f'after/{key}.request.json').read_text())
    response=json.loads((original/f'after/{key}.response.json').read_text())
    raw=(original/f'after/{key}.raw.txt').read_text()
    assert prepared.messages()==row['messages']==request['messages']
    assert prepared.request_ref==row['request_ref']==request['request_ref']==response['request_ref']
    assert admission.digest(prepared.messages())==request['messages_sha256']==response['messages_sha256']
    assert raw==response['raw'] and hashlib.sha256(raw.encode()).hexdigest()==response['raw_sha256']
    result['bound_responses']+=1
    value=replace(prepared,response=admission.AnalysisModelQuotedParentUnitsResponse(**response))
    case=dict(id=key,raw_sha256=response['raw_sha256'])
    detail=dict(snapshot=snap,request=request,response=response)
    try:a,c=service.build_cumulative_map(owner,snap,model_input=value)
    except (admission.AnalysisSemanticError,compiler.AnalysisSourceError) as exc:
        a=None;c=None;case.update(status='REJECTED',code=str(exc));result['rejected']+=1
    else:
        case.update(status='MAPPED' if a else 'UNSUPPORTED',coverage=c)
        if not a:result['unsupported']+=1
        else:
            result['mapped']+=1
            kinds=[n.node_kind for n in a.graph.nodes]
            assert not a.graph.edges and c['mapped_count']==1
            assert all(n.proposition.actor=='SELF' and n.modality=='fact' and n.temporal_scope=='past' for n in a.graph.nodes)
            is_clause=any(n.proposition.role_state=='WRITTEN_PAST_ROLE_CLAUSE' for n in a.graph.nodes)
            result['role_maps']+=int('ROLE' in kinds)
            result['role_action_maps']+=int('ROLE' in kinds and 'ACTION_OR_NONACTION' in kinds)
            result['clause_maps']+=int(is_clause)
            text=a.safe_text_projection(authenticated_owner_scope=owner)['text']
            visual=a.safe_projection(authenticated_owner_scope=owner)
            detail.update(graph=asdict(a.graph),text=text,diagram=visual,coverage=c,
                private_evidence=service.private_storage_evidence(a))
            stored=dict(id=str(UUID(a.artifact_id[9:])),source_profile=service.PROFILE,report_mode='standard',
                content_text=text,content_json=dict(report_mode='standard',watashiMap=visual,map_context=c))
            expected=dict(items=[stored],subscription_tier='free',matched=True,history_limit=2)
            path=out/(key+'.ordinary.json');path.write_text(admission.canonical(expected))
            rpc=AsyncMock(return_value=json.loads(path.read_text()))
            with no_generation(),patch.object(service,'_rpc',rpc):
                assert asyncio.run(service.read_maps(owner,report_id=stored['id']))==expected
            assert rpc.call_args.args[1]['p_user_id']==owner
            result['ordinary_saved_reads']+=1
            case.update(node_kinds=kinds,nodes=len(kinds),edges=0,source_scope=is_clause or any(g.missing_scope=='SOURCE_SCOPE' for g in a.graph.unknown_gaps))
    detail['case']=case
    (out/(key+'.actual.json')).write_text(admission.canonical(detail))
    if mode=='after':
        before=json.loads((root/f'before/{key}.actual.json').read_text())
        if before['case']['status']=='MAPPED':
            assert a is not None,('lost map',key)
            if 'ROLE' not in case['node_kinds']:
                assert admission.canonical(detail['graph'])==admission.canonical(before['graph']) and detail['text']==before['text']
                case['prior_action_graph_text_retained']=True
            else:case['prior_action_map_upgraded_with_role']=True
        for kind in ('candidate','typed'):
            old=original/f'after/{key}.{kind}.json'
            if not old.exists():continue
            if kind=='candidate':
                olda,oldc=service.build_cumulative_quoted_parent_candidates(owner,snap,model_input=value)
                saved=service.serialize_cumulative_quoted_parent_candidates(owner,snap,model_input=value,artifact=olda,coverage=oldc)
                with no_generation():assert service.reload_cumulative_quoted_parent_candidates(owner,snap,old.read_text())==(olda,oldc)
            else:
                flags=dict(with_action=row['with_action'])
                olda,oldc=service.build_cumulative_written_role_map(owner,snap,model_input=value,**flags)
                saved=service.serialize_cumulative_written_role_map(owner,snap,model_input=value,artifact=olda,coverage=oldc,**flags)
                with no_generation():assert service.reload_cumulative_written_role_map(owner,snap,old.read_text(),**flags)==(olda,oldc)
            assert json.loads(saved)==json.loads(old.read_text()),(key,kind)
            result['legacy_reads']+=1
        if key=='R08':
            olda,oldc=service.build_cumulative_written_role_map(owner,snap,model_input=value,clause=True)
            old=original.parents[1]/'replay/R08.clause.saved.json'
            saved=service.serialize_cumulative_written_role_map(owner,snap,model_input=value,artifact=olda,coverage=oldc,clause=True)
            assert json.loads(saved)==json.loads(old.read_text())
            with no_generation():assert service.reload_cumulative_written_role_map(owner,snap,old.read_text(),clause=True)==(olda,oldc)
            result['legacy_reads']+=1
    result['cases'].append(case)
assert result['bound_responses']==22
if mode=='before':assert (result['mapped'],result['unsupported'],result['rejected'])==(13,7,2)
else:assert result['legacy_reads']==35
result.update(seconds=time.monotonic()-start,new_training=0,new_generation=0,model_loads=0,
    normal_4b_enabled=False,deployed=False,product_credit=0)
(out/'summary.json').write_text(admission.canonical(result))
print(json.dumps({k:v for k,v in result.items() if k!='cases'},ensure_ascii=False))
