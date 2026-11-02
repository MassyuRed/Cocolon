"""CPU-only plan: preserve CE68 sequence and append two source-authored contrasts."""
from pathlib import Path
from copy import deepcopy
from collections import Counter
import hashlib,json
w=Path('/workspace');prior=w/'analysis-ce68-20261103';combo=w/'analysis-combination2-cpu-v2-20261103';out=w/'analysis-combination70-prepared-20261103'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert not out.exists()
old=json.loads((prior/'semantic_units_ce68_plan.json').read_text());report=json.loads((prior/'result/report.json').read_text())
assert (prior/'run.exit').read_text()=='0' and report['updates_completed']==74 and report['new_calls']==32
m=json.loads((prior/'manifest.json').read_text());assert len(m)==267 and all(sha(prior/n)==h for n,h in m.items())
cm=json.loads((combo/'manifest.json').read_text());assert len(cm)==4 and all(sha(combo/n)==h for n,h in cm.items())
assert sha(combo/'source.json')=='13d59d02644919f86bc2b2c67c62ea7b112bdd2f50b411f217913bcf077ef099'
cr=json.loads((combo/'semantic_units_combination2_cpu.json').read_text())
assert cr['model_loads']==cr['new_generations']==cr['training_updates']==0 and [r['id'] for r in cr['rows']]==['RC01','RC02']
pack=deepcopy(old);pack['status']='ROOT_SYNTHETIC_COMBINATION70_FROM_SAVED89BA_NOT_PRODUCT_ACCEPTANCE'
pack['teachers'] += deepcopy(cr['rows'])
for row in cr['rows']:
 ev=deepcopy(row);ev['probe_id']=ev.pop('id');ev['pre_generation_required']=True;ev['training_use']=True;ev.pop('assistant_target');ev.pop('source_bound_candidate_id');pack['evaluation'].append(ev)
order=[];insertions={15:'RC01',30:'RC02',45:'RC01',60:'RC02'}
for i,key in enumerate(old['plan']['update_order'],1):
 order.append(key)
 if i in insertions:order.append(insertions[i])
assert [x for x in order if not x.startswith('RC')]==old['plan']['update_order'] and order[-14:]==old['plan']['update_order'][-14:]
assert len(order)==78 and len(pack['teachers'])==70 and len(pack['evaluation'])==34
pack['plan'].update(max_updates=78,max_training_forwards=78,max_teacher_measurements=140,max_seconds=900,max_model_loads=3,max_new_generations=36,outer_timeout_term_seconds=890,outer_kill_grace_seconds=10,process_cost_upper_usd=0.145,update_order=order,representation_comparison='CE68 order preserved as subsequence;RC01/RC02 each twice inserted after original positions15/30/45/60;old68 dictionaries unchanged;not unique cause',evaluation_scope='Old32 exact89ba before reused;newRC2 before2 and all34 after;trained rehearsal and seen development,not blind/general acceptance')
pack['source_ce68_plan_sha256']=sha(prior/'semantic_units_ce68_plan.json');pack['source_combination2_cpu_sha256']=sha(combo/'semantic_units_combination2_cpu.json');pack['control_ce68_before_losses']=report['measurements'][0]['losses']
assert pack['teachers'][:68]==old['teachers'] and pack['evaluation'][:32]==old['evaluation']
proof=json.loads((prior/'reused_before.json').read_text());checks=[]
for row in old['evaluation']:
 key=row['probe_id'];base=prior/('before_'+key);req=json.loads(Path(str(base)+'.request.json').read_text());resp=json.loads(Path(str(base)+'.response.json').read_text());raw=Path(str(base)+'.raw.txt').read_bytes()
 assert req['messages']==row['messages'] and req['request_ref']==resp['request_ref']==row['request_ref'] and resp['raw'].encode()==raw and resp['raw_sha256']==hashlib.sha256(raw).hexdigest()
 entry=[x for x in proof if x['probe_id']==key];assert len(entry)==1 and entry[0]['adapter_sha256']==pack['plan']['initial_weights_sha256'] and entry[0]['raw_sha256']==resp['raw_sha256']
 checks.append(dict(probe_id=key,raw_sha256=resp['raw_sha256']))
assert len(checks)==32
out.mkdir();(out/'semantic_units_combination70_plan.json').write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n')
(out/'semantic_units_combination70_cpu.json').write_text(json.dumps(dict(status='CPU_OLD68_AND_CE74_ORDER_IDENTICAL_RC2_ADDED',teachers=70,updates=78,last14_unchanged=True,old68_dictionaries_unchanged=True,reused_before=32,new_before=2,after=34,checks=checks,model_loads=0,new_generations=0,updates_executed=0),ensure_ascii=False,indent=2)+'\n')
print('CPU70: old68 identical;CE74 subsequence;78 updates;before32 matched;RC2 from verifiedCPU;model0')
