"""Same68 teachers/order; CPU-only exact before32 reuse for plain CE comparison."""
from pathlib import Path
from copy import deepcopy
import json,hashlib
from collections import Counter
w=Path('/workspace');prior=w/'analysis-scope68-20261103';old=json.loads((prior/'semantic_units_scope68_plan.json').read_text());report=json.loads((prior/'result/report.json').read_text());sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert (prior/'run.exit').read_text()=='0' and report['updates_completed']==74 and report['new_calls']==40
manifest=json.loads((prior/'manifest.json').read_text());assert len(manifest)==264 and all(sha(prior/n)==h for n,h in manifest.items())
pack=deepcopy(old);pack['status']='ROOT_SYNTHETIC_CE68_SAME_DATA_ORDER_FROM_SAVED89BA_NOT_PRODUCT_ACCEPTANCE'
pack['source_scope68_plan_sha256']=sha(prior/'semantic_units_scope68_plan.json');assert pack['source_scope68_plan_sha256']=='ac5c7ea0c5def76c78ea67a4da6bc774ee94ef26752ff724c7211c9d6f1e8d7c'
pack['weighted_counterpart_before_losses']=report['measurements'][0]['losses'];pack['weighted_counterpart_weights_sha256']=report['adapter_sha256']
pack['evaluation']=[dict(row,pre_generation_required=False,evaluation_scope='EXACT_89BA_SAVED_BEFORE32_REUSE_SAME_SEEN_DEVELOPMENT') for row in old['evaluation']]
pack['preexisting_evaluation']=[dict(probe_id=row['probe_id'],source='Original scope68 before89ba source/request/raw/report/manifest exact') for row in old['evaluation']]
pack['plan']['representation_comparison']='Initial89ba;identical68 teachers and74 update order;existing plain full-assistant CE replaces adaptive weighting only;exact saved before32 reused;initial inference load omitted with initial NLL and all dropout guards;one observed comparison,not general causal proof or adoption'
pack['plan'].update(training_objective='EXISTING_UNWEIGHTED_FULL_ASSISTANT_CE_V1',max_seconds=720,max_new_generations=32,max_model_loads=2,outer_timeout_term_seconds=710,outer_kill_grace_seconds=10,process_cost_upper_usd=.116,evaluation_scope='Exact before32 reuse;all32 after newly generated. Same68 teachers/74 update order;only training full-token weighting changed;initial inference load removed. Not blind/general acceptance.')
assert pack['teachers']==old['teachers'] and pack['plan']['update_order']==old['plan']['update_order']
assert len(pack['teachers'])==68 and len(pack['evaluation'])==32 and len(pack['plan']['update_order'])==74
checks=[]
for row in old['evaluation']:
 key=row['probe_id'];base=prior/'result'/('before_'+key) if row['pre_generation_required'] else prior/('before_'+key)
 request=json.loads(Path(str(base)+'.request.json').read_text());response=json.loads(Path(str(base)+'.response.json').read_text());raw=Path(str(base)+'.raw.txt').read_bytes()
 assert request['messages']==row['messages'] and request['request_ref']==response['request_ref']==row['request_ref']
 assert response['raw'].encode()==raw and response['raw_sha256']==hashlib.sha256(raw).hexdigest()
 assert request['messages_sha256']==response['messages_sha256']==hashlib.sha256(json.dumps(row['messages'],ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
 checks.append(dict(probe_id=key,source_prefix=str(base),raw_sha256=response['raw_sha256'],candidate_exists=Path(str(base)+'.candidate.json').exists()))
out=w/'analysis-ce68-prepared-v2-20261103';out.mkdir(exist_ok=False)
for name,value in [('semantic_units_ce68_plan.json',pack),('semantic_units_ce68_cpu.json',dict(status='CPU_SAME68_TARGETS_SAME74_ORDER_BEFORE32_IDENTITY_MATCHED',teachers=68,updates=74,evaluation=32,reused_before=32,source_manifest=264,checks=checks,teacher_tokens=report['token_counts'],fresh_tokenizer_or_strict_rerun=0,reason='Identical source/messages/targets and frozen tokenizer/profile;prior strict/file/tokenizer proof retained,not rerun for its own sake',new_generation=0,model_loads=0,updates_executed=0))]:
 (out/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
print('Same68/same74/order unchanged;before32 identity matched;CPU only')
