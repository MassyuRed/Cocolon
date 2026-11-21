"""Separate CPU-process replay of saved diagnosis, including four reused outputs."""
from pathlib import Path
from argparse import ArgumentParser
from contextlib import ExitStack
from dataclasses import replace
from unittest.mock import patch
import hashlib,json
import analysis_cumulative_service as service
from cocolon_meaning_experience_engine import MeaningExperienceEngine
from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError,canonical
from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
import cocolon_meaning_experience_engine.cores.analysis.intent_compiler as compiler
import cocolon_meaning_experience_engine.cores.analysis.observed_route_realizer as author

def main():
    a=ArgumentParser(description=__doc__);a.add_argument('--run-dir',type=Path,required=True);a.add_argument('--out',type=Path,required=True);args=a.parse_args()
    p=json.loads((args.run_dir/'semantic_units_actor_predicate_plan.json').read_text());rows=[]
    for condition in p['conditions']:
        for row in p['rows']:
            prefix=args.run_dir/(condition['id']+'_'+row['probe_id']);request=json.loads(prefix.with_suffix('.request.json').read_text());response=AnalysisModelQuotedParentUnitsResponse(**json.loads(prefix.with_suffix('.response.json').read_text()));raw=prefix.with_suffix('.raw.txt').read_bytes()
            prepared=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'])
            assert prepared.messages()==row['messages']==request['messages'] and prepared.request_ref==row['request_ref']==request['request_ref']
            assert request['messages_sha256']==hashlib.sha256(canonical(prepared.messages()).encode()).hexdigest()
            assert response.raw.encode()==raw and response.raw_sha256==hashlib.sha256(raw).hexdigest()
            candidate=prefix.with_suffix('.candidate.json');item=dict(condition=condition['id'],probe_id=row['probe_id'],reused=row['reuse'])
            try:artifact,coverage=service.build_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=replace(prepared,response=response))
            except (AnalysisSemanticError,AnalysisSourceError) as exc:
                assert not candidate.exists();item.update(admission='REJECTED',reason=str(exc))
            else:
                with ExitStack() as stack:
                    for obj,key in ((MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),(author,'realize_analysis_unit_candidates')):stack.enter_context(patch.object(obj,key,side_effect=AssertionError('saved reader must not regenerate')))
                    saved,counts=service.reload_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],candidate.read_text())
                assert artifact==saved and coverage==counts and counts['mapped_count']==0 and counts['unparsed_count']==1
                item.update(admission='RETURNED',candidate_id=artifact.candidate_id,coverage=coverage,serialized_sha256=hashlib.sha256(candidate.read_bytes()).hexdigest())
            rows.append(item)
    assert len(rows)==16
    result=dict(status='SAVED_16_REPLAYED_IN_SEPARATE_CPU_PROCESS',rows=rows,matched_candidates=sum(r['admission']=='RETURNED' for r in rows),rejected_responses=sum(r['admission']=='REJECTED' for r in rows),model_loads=0,new_generations=0,training_updates=0,saved_reader_generate_compiler_author_patched_to_fail=True,quality_credit=0)
    with args.out.open('x') as h:h.write(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(result['status'],result['matched_candidates'],result['rejected_responses'])

if __name__=='__main__':main()
