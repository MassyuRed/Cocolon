"""Collect saved context comparison without model load or new generation."""
from pathlib import Path
from dataclasses import replace
from contextlib import ExitStack
from unittest.mock import patch
from hashlib import sha256
import json,sys,html
w=Path('/workspace');api=w/'analysis-material-api-20261103';root=w/'analysis-material-context8-20261103'
sys.dont_write_bytecode=True
sys.path[:0]=[str(api/'ai/tools'),str(api/'ai/services/ai_inference')]
import analysis_cumulative_service as service
from cocolon_meaning_experience_engine import MeaningExperienceEngine
from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError
from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
assert (w/'material-context8.run.exit').read_text()=='0'
report=json.loads((root/'report.json').read_text());assert report['new_calls']==8 and report['model_loads']==1 and report['training_updates']==0
probes={r['id']:r for r in json.loads((root/'sources.json').read_text())};rows=[]
for item in report['calls']:
 row=probes[item['id']];profile=item['profile'];key=item['id']+('_category' if profile=='selected_categories.v1' else '_material')
 p=service.prepare_cumulative_category_units(row['owner'],row['snapshot'],prompt_version=profile)
 response=AnalysisModelQuotedParentUnitsResponse(**json.loads((root/(key+'.response.json')).read_text()))
 value=replace(p,response=response);candidate=root/(key+'.candidate.json')
 if not candidate.exists():
  try:service.build_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=value)
  except (AnalysisSemanticError,AnalysisSourceError) as exc:
   assert item['admission']=='REJECTED';rows.append(dict(id=item['id'],profile=profile,admission='REJECTED',reason=str(exc)))
  else:raise AssertionError('saved rejection no longer rejected')
  continue
 artifact,cov=service.build_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=value)
 with ExitStack() as stack:
  for obj,name in [(MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),(author,'realize_analysis_unit_candidates')]:
   stack.enter_context(patch.object(obj,name,side_effect=AssertionError('no saved regeneration/compiler/author')))
  saved,counts=service.reload_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],candidate.read_text())
 assert saved==artifact and cov==counts
 rows.append(dict(id=item['id'],profile=profile,admission='RETURNED',candidate_id=saved.candidate_id,coverage=counts))
assert len(rows)==8
(root/'saved_replay.json').write_text(json.dumps(dict(status='CPU_SAVED_EIGHT_REPLAYED',rows=rows,model_loads=0,new_generations=0,training_updates=0,saved_reader_generation_compiler_author_forbidden=True),ensure_ascii=False,indent=2)+'\n')
files={}
def add(p,name):
 b=p.read_bytes();text=b.decode('utf8');assert text.encode()==b
 files[name]=dict(text=text,bytes=len(b),sha256=sha256(b).hexdigest())
for p in sorted(root.rglob('*')):
 if p.is_file():add(p,'run/'+str(p.relative_to(root)))
for n in ['material_context8_run.py','material_context8_supervisor.py','collect_material_context8.py','material-context8.run.exit','material-context8.run.log','material-context8.supervisor.log','material-context8.finished.json','material-api-tests.log','material-api-tests.exit','material-api-tests-v2.log','material-api-tests-v2.exit','material-api-pytest-install.log']:
 add(w/n,'extra/'+n)
for n in ['ai/services/ai_inference/analysis_cumulative_service.py','ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py','ai/tests/test_analysis_model_quoted_parent_units.py']:
 add(api/n,'api-source/'+n)
data=json.dumps(files,ensure_ascii=False,separators=(',',':'))
(w/'material-context8-evidence.html').write_text('<meta charset=utf-8><textarea aria-label="Context evidence" style="width:98vw;height:94vh">'+html.escape(data)+'</textarea>')
meta=dict(files=len(files),data_bytes=len(data.encode()),data_sha256=sha256(data.encode()).hexdigest(),status=report['status'],seconds=report['process_seconds'],calls=8,model_loads=1,training_updates=0)
(w/'material-context8-collection.json').write_text(json.dumps(meta,indent=2)+'\n')
print(json.dumps(meta))
