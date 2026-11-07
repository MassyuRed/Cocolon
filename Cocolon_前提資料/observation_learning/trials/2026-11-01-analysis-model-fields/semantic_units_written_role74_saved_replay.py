"""Fresh CPU replay of all 92 exact responses and saved artifacts; zero model calls."""
from contextlib import ExitStack
from dataclasses import replace
from hashlib import sha256
from pathlib import Path
from unittest.mock import patch
import json,sys

w=Path('/workspace');root=w/'analysis-written-role74-20261103'
api=w/'analysis-written-role-api-v2-20261103'
sys.dont_write_bytecode=True
sys.path[:0]=[str(api/'ai/services/ai_inference')]
import analysis_cumulative_service as service
from cocolon_meaning_experience_engine import MeaningExperienceEngine
from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
    AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError,canonical)
from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError

def main():
    report=json.loads((root/'result/report.json').read_text())
    assert (root/'run.exit').read_text()=='0'
    assert report['status']=='COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
    assert (report['updates_completed'],report['new_calls'],report['measurement_forwards'],report['model_loads'])==(86,50,148,3)
    manifest=json.loads((root/'manifest.json').read_text())
    assert all(sha256((root/n).read_bytes()).hexdigest()==h for n,h in manifest.items())
    after=json.loads((root/'gpu-after.json').read_text())
    assert after['prior_unchanged'] and not after['compute_apps'].strip()
    pack=json.loads((root/'semantic_units_written_role74_plan.json').read_text())
    reused=json.loads((root/'reused_before.json').read_text())
    rows=[]
    for phase in ('before','after'):
        for row in pack['evaluation']:
            probe=row['probe_id'];folder=root/'result' if phase=='after' or row['pre_generation_required'] else root
            prefix=folder/(phase+'_'+probe)
            req=json.loads(prefix.with_suffix('.request.json').read_text())
            res=json.loads(prefix.with_suffix('.response.json').read_text())
            raw=prefix.with_suffix('.raw.txt').read_bytes()
            prepared=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'])
            assert prepared.request_ref==row['request_ref']==req['request_ref']
            assert prepared.messages()==row['messages']==req['messages']
            assert req['messages_sha256']==sha256(canonical(prepared.messages()).encode()).hexdigest()
            assert res['raw'].encode()==raw and res['raw_sha256']==sha256(raw).hexdigest()
            assert res['finish_reason']=='stop'
            value=replace(prepared,response=AnalysisModelQuotedParentUnitsResponse(**res))
            expected=next(c for c in report['calls'] if c['phase']==phase and c['probe_id']==probe) if folder==root/'result' else next(c for c in reused if c['probe_id']==probe)
            item=dict(phase=phase,probe_id=probe,raw_sha256=sha256(raw).hexdigest())
            # Fresh admission is compared with recorded admission; exact saved files are separately restored.
            for kind,build,reload,suffix,compile_name,author_name in [
                ('candidate',service.build_cumulative_quoted_parent_candidates,service.reload_cumulative_quoted_parent_candidates,'.candidate.json','compile_analysis_unit_candidates','realize_analysis_unit_candidates'),
                ('role',service.build_cumulative_written_role_map,service.reload_cumulative_written_role_map,'.role.json','compile_model_written_role_graph','realize_model_written_role_graph')]:
                if kind=='role' and not row['role_vertical']:continue
                admission_key='admission' if kind=='candidate' else 'role_admission'
                reason_key='reason' if kind=='candidate' else 'role_reason'
                saved_file=prefix.with_suffix(suffix)
                try:artifact,coverage=build(row['owner'],row['snapshot'],model_input=value)
                except (AnalysisSemanticError,AnalysisSourceError) as exc:
                    assert expected[admission_key]=='REJECTED' and str(exc)==expected[reason_key]
                    assert not saved_file.exists()
                    item[admission_key]='REJECTED';item[reason_key]=str(exc)
                else:
                    assert expected[admission_key]=='RETURNED' and saved_file.exists()
                    with ExitStack() as stack:
                        # Every Engine/analysis compiler/author entry point is disabled during file restoration.
                        for obj,name in [(MeaningExperienceEngine,'generate'),
                            (compiler,'compile_analysis_unit_candidates'),(compiler,'compile_model_written_role_graph'),
                            (author,'realize_analysis_unit_candidates'),(author,'realize_model_written_role_graph')]:
                            stack.enter_context(patch.object(obj,name,side_effect=AssertionError('forbidden during saved reload')))
                        restored,counts=reload(row['owner'],row['snapshot'],saved_file.read_text())
                    assert restored==artifact and counts==coverage
                    if kind=='candidate':assert coverage['mapped_count']==0 and coverage['unparsed_count']==1
                    item[admission_key]='RETURNED'
                    item[kind+'_file_replay']='MATCHED_NO_ENGINE_BOTH_COMPILERS_BOTH_AUTHORS'
                    item[kind+'_coverage']=coverage
                    item[kind+'_file_sha256']=sha256(saved_file.read_bytes()).hexdigest()
            rows.append(item)
    assert len(rows)==92
    result=dict(status='FRESH_CPU_92_RESPONSE_FILES_REPLAYED',rows=rows,
        matched_candidates=sum(r['admission']=='RETURNED' for r in rows),
        rejected_candidates=sum(r['admission']=='REJECTED' for r in rows),
        matched_roles=sum(r.get('role_admission')=='RETURNED' for r in rows),
        rejected_roles=sum(r.get('role_admission')=='REJECTED' for r in rows),
        model_loads=0,new_generations=0,training_updates=0,
        saved_reload_engine_both_compilers_both_authors_patched_to_fail=True,quality_credit=0)
    dest=w/'written-role74-saved-replay.json'
    with dest.open('x') as f:f.write(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(result['status'],result['matched_candidates'],result['rejected_candidates'],result['matched_roles'],result['rejected_roles'])

if __name__=='__main__':main()
