"""Direct executable captures for source-preserved legacy byte compatibility."""
import os
os.environ.update(CUDA_VISIBLE_DEVICES='',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
import sys,json,itertools
from dataclasses import asdict
from pathlib import Path
base=Path(sys.argv[1]);sys.path[:0]=[str(base/'ai/services/ai_inference'),str(base/'ai/tests'),'/workspace/cocolon_4b_service_runtime_20261025/python']
from test_cmee_emlis_model_daily_calm import daily_request,prepared_daily,outcome
from test_cmee_emlis_model_proposal import initial_result,corrected_result
from cocolon_meaning_experience_engine.model_candidate_source import build_model_messages
from cocolon_meaning_experience_engine.preparation import QUOTE_CANDIDATE_SCHEMA
rows=[]
def capture(name,req,p,out):
 prior=json.loads(p.semantic_snapshot)['prior_snapshot']
 prior=json.dumps(prior,ensure_ascii=False,sort_keys=True,separators=(',',':')) if prior else None
 row={k:getattr(p,k) for k in ('semantic_snapshot','meaning_json','native_bindings_json','surface_proposal_json','question_proposal_json')}
 row.update(id=name,outcome=asdict(out),legacy_messages=build_model_messages(req,prior),quote_messages=build_model_messages(req,prior,candidate_format=QUOTE_CANDIDATE_SCHEMA))
 rows.append(row)
for stage,f in [('initial',initial_result),('corrected',corrected_result)]:
 req,p,out=f();capture('chair-'+stage,req,p,out)
for args in itertools.product(('うどん','雑炊'),('あったかいもの','温かいもの'),('','を'),('ちょっと','少し')):
 req=daily_request(*args);_,p=prepared_daily(req);capture('daily-'+repr(args),req,p,outcome(req,p))
Path(sys.argv[2]).write_text(json.dumps(rows,ensure_ascii=False,sort_keys=True,separators=(',',':'))+'\n')
