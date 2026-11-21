"""CPU-only same68 candidate: reallocate three redundant replay slots, not new teachers."""
from pathlib import Path
from copy import deepcopy
from collections import Counter
import hashlib,json
w=Path('/workspace');prior=w/'analysis-ce68-20261103';out=w/'analysis-replay68-prepared-20261103'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
old=json.loads((prior/'semantic_units_ce68_plan.json').read_text());report=json.loads((prior/'result/report.json').read_text())
assert (prior/'run.exit').read_text()=='0' and report['updates_completed']==74 and report['new_calls']==32
m=json.loads((prior/'manifest.json').read_text());assert len(m)==267 and all(sha(prior/n)==h for n,h in m.items())
pack=deepcopy(old);pack['status']='ROOT_SYNTHETIC_REPLAY68_THREE_SLOTS_FROM_SAVED89BA_NOT_PRODUCT_ACCEPTANCE'
pack['source_ce68_plan_sha256']=sha(prior/'semantic_units_ce68_plan.json')
pack['source_ce68_weights_sha256']=report['adapter_sha256']
pack['control_ce68_before_losses']=report['measurements'][0]['losses']
changes=[(35,'SC01','UQ01'),(40,'SC02','BT08'),(55,'SC05','ST07')]
order=list(old['plan']['update_order'])
for step,before,after in changes:
 assert order[step-1]==before
 order[step-1]=after
assert [(i+1,a,b) for i,(a,b) in enumerate(zip(old['plan']['update_order'],order)) if a!=b]==changes
assert pack['teachers']==old['teachers'] and len(order)==74 and len(set(order))==68
assert set(order)=={r['id'] for r in pack['teachers']} and order[-14:]==old['plan']['update_order'][-14:]
counts=Counter(order);assert all(counts[k]==2 for k in ['SC03','SC04','SC06','UQ01','BT08','ST07'])
assert all(counts[k]==1 for k in ['SC01','SC02','SC05'])
pack['plan'].update(update_order=order,representation_comparison='Same89ba,plainCE,same68 teachers;only replay slots35/40/55 reallocated from already-correctSC01/02/05 to UQ01/BT08/ST07;all68 at least once,74updates,last14unchanged;one observed dose/order comparison,not unique cause',evaluation_scope='Same32 seen/nearby development;exact saved89ba before32 reused;new after32;not blind/general acceptance')
assert {k for k in pack['plan'] if pack['plan'][k]!=old['plan'][k]}=={'update_order','representation_comparison','evaluation_scope'}
assert pack['evaluation']==old['evaluation']
pack['replay_slot_changes']=[dict(step=s,before=b,after=a) for s,b,a in changes]
pack['preexisting_evaluation']=[dict(probe_id=row['probe_id'],source='CE68 original exact89ba before32;source/request/raw/report/manifest matched') for row in old['evaluation']]
checks=[];proof=json.loads((prior/'reused_before.json').read_text())
for row in pack['evaluation']:
 assert row['pre_generation_required'] is False
 key=row['probe_id'];base=prior/('before_'+key)
 req=json.loads(Path(str(base)+'.request.json').read_text());resp=json.loads(Path(str(base)+'.response.json').read_text());raw=Path(str(base)+'.raw.txt').read_bytes()
 assert req['messages']==row['messages'] and req['request_ref']==resp['request_ref']==row['request_ref']
 assert resp['raw'].encode()==raw and resp['raw_sha256']==hashlib.sha256(raw).hexdigest()
 assert req['messages_sha256']==resp['messages_sha256']==hashlib.sha256(json.dumps(row['messages'],ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
 entry=[x for x in proof if x['probe_id']==key];assert len(entry)==1 and entry[0]['adapter_sha256']==pack['plan']['initial_weights_sha256'] and entry[0]['raw_sha256']==resp['raw_sha256']
 checks.append(dict(probe_id=key,raw_sha256=resp['raw_sha256']))
assert len(checks)==32
out.mkdir(exist_ok=False)
(out/'semantic_units_replay68_plan.json').write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n')
(out/'semantic_units_replay68_cpu.json').write_text(json.dumps(dict(status='CPU_SAME68_THREE_REPLAY_SLOTS_FIXED_BEFORE32_MATCHED',teachers=68,updates=74,changed_slots=pack['replay_slot_changes'],counts=dict(counts),last14_unchanged=True,all68_at_least_once=True,reused_before=32,source_manifest=267,checks=checks,model_loads=0,new_generations=0,updates_executed=0),ensure_ascii=False,indent=2)+'\n')
print('Same68;only3 replay slots changed;all68>=1;74total;last14 unchanged;before32 exact;CPU only')
