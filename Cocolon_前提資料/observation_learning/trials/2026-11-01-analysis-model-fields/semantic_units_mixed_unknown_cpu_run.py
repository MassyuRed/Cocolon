from pathlib import Path
from dataclasses import replace
from uuid import UUID
from unittest.mock import patch
import hashlib,json
import analysis_cumulative_service as s
from test_analysis_cumulative import source_snapshot,OWNER
from cocolon_meaning_experience_engine import MeaningExperienceEngine
from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse,canonical
import cocolon_meaning_experience_engine.cores.analysis.intent_compiler as compiler
import cocolon_meaning_experience_engine.cores.analysis.observed_route_realizer as author
w=Path('/workspace');t=w/'analysis-unknown58-20261102';out=w/'analysis-mixed-unknown-cpu-20261102';out.mkdir(exist_ok=False)
old=json.loads((t/'semantic_units_unknown58_plan.json').read_text());count=0
for row in old['teachers']:
 for f in json.loads(row['assistant_target'])['fields']:
  u=f['units']
  if sum(x['scope_role']=='WRITTEN_UNKNOWN' for x in u)>=2 and any(x['node_kind']=='ACTION_OR_NONACTION' and x['parent_quote'] is None for x in u):count+=1
assert count==0
clauses={'A':'私は印刷しなかった','B':'会場が使えるかは分からない','C':'連絡が届いたかも分からない'}
contents={'B':'会場が使えるか','C':'連絡が届いたか'}
rows=[]
for i,order in enumerate([['A','B','C'],['C','A','B']],1):
 snap=source_snapshot(1);memo='。'.join(clauses[k] for k in order)+'。';snap['members'][0]['original'].update(id=str(UUID(int=15000+i)),memo=memo,memo_action='')
 p=s.prepare_cumulative_quoted_parent_units(OWNER,snap);units=[]
 for k in order:
  q=clauses[k]
  if k=='A':units.append(dict(quote=q,node_kind='ACTION_OR_NONACTION',parent_quote=None,scope_role=None,qualifiers=[dict(kind='EXPLICIT_ACTOR',quote='私は'),dict(kind='NEGATION',quote='しなかった')]))
  else:
   units.append(dict(quote=q,node_kind=None,parent_quote=None,scope_role='WRITTEN_UNKNOWN',qualifiers=[dict(kind='EPISTEMIC_EXPRESSION',quote='分からない')]))
   units.append(dict(quote=contents[k],node_kind=None,parent_quote=q,scope_role='UNKNOWN_CONTENT',qualifiers=[]))
 raw=canonical(dict(fields=[dict(field=1,units=units)]));r=AnalysisModelQuotedParentUnitsResponse(p.request_ref,hashlib.sha256(canonical(p.messages()).encode()).hexdigest(),hashlib.sha256(raw.encode()).hexdigest(),'stop',raw);inp=replace(p,response=r)
 a,c=s.build_cumulative_quoted_parent_candidates(OWNER,snap,model_input=inp);saved=s.serialize_cumulative_quoted_parent_candidates(OWNER,snap,model_input=inp,artifact=a,coverage=c)
 with patch.object(MeaningExperienceEngine,'generate',side_effect=AssertionError('no generation')),patch.object(compiler,'compile_analysis_unit_candidates',side_effect=AssertionError('no compile')),patch.object(author,'realize_analysis_unit_candidates',side_effect=AssertionError('no author')):
  again,cc=s.reload_cumulative_quoted_parent_candidates(OWNER,snap,saved)
 assert again==a and cc==c and c['mapped_count']==0 and c['unparsed_count']==1
 assert memo not in {f['text'] for q in old['evaluation'] for f in json.loads(q['messages'][1]['content'])['fields']}
 rows.append(dict(id=f'MX{i:02}',owner=OWNER,snapshot=snap,messages=p.messages(),request_ref=p.request_ref,assistant_target=raw,target_sha256=hashlib.sha256(raw.encode()).hexdigest(),source_bound_candidate_id=a.candidate_id,coverage=c,serialized_sha256=hashlib.sha256(saved.encode()).hexdigest(),save_reload='MATCHED_NO_GENERATION_COMPILATION_AUTHOR'))
(out/'semantic_units_mixed_unknown_cpu.json').write_text(json.dumps(dict(status='ROOT_SYNTHETIC_ONE_TOPIC_TWO_ORDERS_CPU_ONLY_NOT_GPU_PLAN_OR_OUTPUT',source_api_commit='86d19b6d834676a602b036c89357dfed1003bb2b',old58_sha256=hashlib.sha256((t/'semantic_units_unknown58_plan.json').read_bytes()).hexdigest(),old58_action_with_two_unknown_fields=count,rows=rows,model_loads=0,new_generations=0,updates=0,old58_changed=False,receiver_changed=False,limits=['Constructed after seeing HQ03: not blind, not two independent topics.','The absence of mixed teachers is observed, not proven sole cause.','Keeps explicit actor/negation and each unique unknown root/content; no ka+mo temporal qualifier.','CPU representability/replay is not model or product quality.','Reason/temporal relations and broad transfer remain unresolved.']),ensure_ascii=False,indent=2)+'\n')
print('MX2: independent negative action+2unknown roots, strict binding and non-generating replay matched')
