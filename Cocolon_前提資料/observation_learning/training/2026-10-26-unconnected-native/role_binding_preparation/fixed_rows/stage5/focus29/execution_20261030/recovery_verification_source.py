"""Read-only checks of the recovered bounded run; no model execution."""
from pathlib import Path
import collections, gzip, hashlib, importlib.util, json, math, struct, sys, zipfile
import numpy as np

ROOT=Path('context/Cocolon_前提資料')
BASE=ROOT/'observation_learning/training/2026-10-26-unconnected-native/role_binding_preparation/fixed_rows/stage5/focus29'
OUT=BASE/'execution_20261030'
ARCHIVE=Path(sys.argv[1])
RECEIPT=Path('/workspace/scratch/cocolon-focus29-recovery.json')
def sha(b):return hashlib.sha256(b).hexdigest()
def write(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
def jread(p):return json.loads(p.read_bytes())
def lines(p):return [json.loads(s) for s in p.read_text().splitlines() if s.strip()]
def compact(v):return json.dumps(v,ensure_ascii=False,separators=(',',':'),allow_nan=False)

receipt=jread(RECEIPT)
assert ARCHIVE.stat().st_size==receipt['bytes'] and sha(ARCHIVE.read_bytes())==receipt['sha256']
OUT.mkdir(exist_ok=False)
with zipfile.ZipFile(ARCHIVE) as z:
    assert z.testzip() is None and len(z.namelist())==receipt['members']
    manifest=json.loads(z.read('archive_manifest.json'))
    assert set(z.namelist())=={'archive_manifest.json'}|{e['path'] for e in manifest['files']}
    for e in manifest['files']:
        b=z.read(e['path']);assert len(b)==e['bytes'] and sha(b)==e['sha256']
    for name in z.namelist():
        assert '..' not in Path(name).parts and not Path(name).is_absolute()
        p=OUT/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(z.read(name))
(OUT/'recovery_receipt.json').write_bytes(RECEIPT.read_bytes())
plan=jread(OUT/'runtime/proposal.json');approval=jread(OUT/'runtime/approved_plan.json');run=jread(OUT/'run/run.json')
assert approval['status']=='MASH_EXPLICITLY_APPROVED_ONCE' and approval['proposal']==plan
assert sha((OUT/'runtime/proposal.json').read_bytes())==approval['proposal_sha256']
runtime_approval_sha=sha((OUT/'runtime/approved_plan.json').read_bytes())
assert runtime_approval_sha=='7b502e9b867004d915264b49ab53c2c633941f46a028281b0db5cf244e48260c'
closed_approval=jread(BASE/'approved_plan.json')
assert closed_approval['runtime_approval_original_sha256']==runtime_approval_sha
assert closed_approval['runtime_approval_original_commit']==run['source_commit']=='923518fd1c08a0a46faf1c4ee8fc9a866d96edf8'
assert closed_approval['proposal']==plan
for name,h in plan['source_sha256'].items():
    assert sha((OUT/'runtime'/name).read_bytes())==h and (OUT/'runtime'/name).read_bytes()==(BASE/name).read_bytes()
assert run['approval_sha256']==sha((OUT/'runtime/approved_plan.json').read_bytes())
post=jread(OUT/'runtime/post_identity.json')
assert post['all_frozen_bytes_unchanged'] and post['frozen_files']==298
assert post['initial_adapter_sha256']==plan['initial_adapter_sha256']
assert post['initial_config_sha256']==plan['initial_config_sha256']
prepared=json.loads(gzip.decompress((OUT/'inputs/prepared_cpu.json.gz').read_bytes()))
assert prepared['order']==plan['update_order']
assert sha((OUT/'inputs/prepared_cpu.json.gz').read_bytes())==jread(OUT/'inputs/cpu_summary.json')['prepared_sha256']
training=lines(OUT/'run/training.jsonl') if (OUT/'run/training.jsonl').exists() else []
for i,r in enumerate(training,1):
    assert (r['step'],r['id'])==(i,plan['update_order'][i-1])
    assert math.isfinite(r['loss']) and math.isfinite(r['gradient_norm']) and r['gradient_norm']>0
    assert r['target_tokens']==sum(x!=-100 for x in prepared['encoded'][r['id']]['labels'])
assert len(training)==run['optimizer_steps_completed']<=29
before=lines(BASE.parent/'fit38/execution_20261030/run/nll_after38_saved_reload.jsonl')
after=lines(OUT/'run/nll_after29_saved_reload.jsonl') if (OUT/'run/nll_after29_saved_reload.jsonl').exists() else []
def weighted(rows,kind):
    r=[x for x in rows if kind=='all' or ('/stage' in x['id'])==(kind=='new')]
    return sum(x['nll']*x['loss_tokens'] for x in r)/sum(x['loss_tokens'] for x in r) if r else None
if after:
    assert [r['id'] for r in after]==plan['pass_order'] and len(after)==19
    assert all(math.isfinite(r['nll']) and r['loss_tokens']==sum(x!=-100 for x in prepared['encoded'][r['id']]['labels']) for r in after)
    assert run['teacher_evaluation_forwards_completed']==19
nll_comparison=dict(before={k:weighted(before,k) for k in ['new','old','all']},after={k:weighted(after,k) for k in ['new','old','all']},rows=[dict(id=a['id'],before=b['nll'],after=a['nll'],loss_tokens=a['loss_tokens']) for a,b in zip(after,before)])
write(OUT/'nll_comparison.json',nll_comparison)

spec=importlib.util.spec_from_file_location('focus29_frozen_syntax',BASE/'prompt_source_index.py')
syntax=importlib.util.module_from_spec(spec);spec.loader.exec_module(syntax)
teachers={r['id']:r for r in lines(OUT/'inputs/train19.jsonl')}
originals={c['case_id']:c for c in prepared['original_cases']}
chain=[];all_calls=[]
for f in sorted((OUT/'run').glob('*_stages.json')):
    records=jread(f);previous=[]
    for i,r in enumerate(records,1):
        assert r['stage']==i and r['messages']==syntax.build_messages(originals[r['case_id']]['messages'],i,previous)
        assert sha(compact(r['messages']).encode())==r['messages_sha256']
        raw=r['raw'];assert sha(raw['raw_text'].encode())==raw['raw_utf8_sha256']
        assert len(raw['output_token_ids'])==raw['output_tokens']
        assert raw['adapter_revision']==run['adapter_sha256']['adapter_model.safetensors']
        target=teachers[r['case_id']+'/stage'+str(i)]['messages'][-1]['content']
        try:value=json.loads(raw['raw_text']);error=None
        except ValueError as e:value=None;error=str(e)
        chain.append(dict(case_id=r['case_id'],stage=i,actual_previous_chain_exact=True,
                          messages_equal_teacher=teachers[r['case_id']+'/stage'+str(i)]['messages'][:-1]==r['messages'],
                          json_error=error,json_values_equal_teacher=value==json.loads(target),
                          output_tokens=raw['output_tokens'],eos_reached=raw['eos_reached'],finish_reason=raw['finish_reason']))
        if value is not None:previous.append(dict(stage=i,values=value))
        all_calls.append(raw)
assert len(all_calls)<=run['model_calls_completed']<=19
write(OUT/'chain_and_teacher_read.json',chain)

weights=[]
for dirname in ['adapter','partial_adapter']:
    p=OUT/'run'/dirname/'adapter_model.safetensors'
    if not p.exists():continue
    b=p.read_bytes();n=struct.unpack('<Q',b[:8])[0];header=json.loads(b[8:8+n]);payload=b[8+n:]
    table=[]
    for name,t in header.items():
        if name=='__metadata__':continue
        assert t['dtype']=='F32';a,z=t['data_offsets'];arr=np.frombuffer(payload[a:z],dtype='<f4')
        assert arr.size==math.prod(t['shape']) and np.isfinite(arr).all()
        table.append(dict(name=name,shape=t['shape'],dtype='F32',finite=True,bytes=z-a,sha256=sha(payload[a:z])))
    assert len(table)==112 and sum(math.prod(t['shape']) for t in table)==3833856
    v=dict(directory=dirname,sha256=sha(b),bytes=len(b),tensors=112,params=3833856,all_finite_f32=True,table=table)
    write(OUT/(dirname+'_weights_verification.json'),v);weights.append(v)
    dest=Path('/workspace/scratch/cocolon-focus29-weights-20261030.zip')
    assert not dest.exists()
    with zipfile.ZipFile(dest,'x',zipfile.ZIP_DEFLATED) as z:
        for q in sorted(p.parent.iterdir()):
            if q.is_file():z.write(q,'adapter/'+q.name)
        z.write(OUT/(dirname+'_weights_verification.json'),'weights_verification.json')
    with zipfile.ZipFile(dest) as z:assert z.testzip() is None
    weights[-1]['archive']=dict(file=str(dest),bytes=dest.stat().st_size,sha256=sha(dest.read_bytes()))

verification=dict(status='RECOVERED_ORIGINALS_VERIFIED_PENDING_ROOT_CONTENT_REVIEW',archive=receipt,
                  crc_all_passed=True,all_payload_bytes_sha256_match=True,source_approval_plan_exact=True,
                  original_initial_and_298_frozen_unchanged=True,training_rows_checked=len(training),
                  scheduled_update_order_exact=True,nll_rows_checked=len(after),actual_stage_chains_checked=len(chain),
                  weights=[{k:v for k,v in w.items() if k!='table'} for w in weights],retry=False,
                  product_credit=0,automatic_progression=False)
write(OUT/'verification.json',verification)
print(json.dumps(dict(status=run['status'],reason=run.get('reason'),updates=len(training),loads=run['model_loads_completed'],nll_rows=len(after),generations=run['model_calls_completed'],cases=run['cases'],processing_seconds=run.get('processing_seconds'),process_cost_usd=run.get('process_cost_usd'),nll_comparison=nll_comparison,chain=chain,weights=[{k:v for k,v in w.items() if k!='table'} for w in weights]),ensure_ascii=False,indent=2))
