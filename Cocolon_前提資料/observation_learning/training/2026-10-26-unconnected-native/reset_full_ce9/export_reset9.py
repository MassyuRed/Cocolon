"""Recover the completed/failed once-run and portable weights, without GPU use."""
from pathlib import Path
import hashlib,json,os,zipfile
os.environ.update(CUDA_VISIBLE_DEVICES='',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
ROOT=Path('/workspace/cocolon_fullce9_root_20261028')
PACK=Path('/workspace/cocolon_reset9_pack_20261028')
RUN=Path('/workspace/cocolon_reset9_run_20261028')
OUT=Path('/workspace/cocolon_reset9_result_20261028')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def dump(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
assert Path('/workspace/cocolon_reset9_gpu.exit').exists()
OUT.mkdir(exist_ok=False)
# Preserve the exact source exercised on this Pod alongside its manifest.
for f in json.loads((ROOT/'restore_payload.json').read_text())['files']:
    if f['path'].startswith('api/'):
        target=OUT/'source'/f['path'];target.parent.mkdir(parents=True,exist_ok=True)
        target.write_bytes((ROOT/f['path']).read_bytes())
report=json.loads((RUN/'run.json').read_text())
assert sha(ROOT/'adapter/adapter_model.safetensors')=='d431a07ce227c05e81eca5afb9461d91cf8101d50af0d27ec1a81844ce8ac684'
manifest=json.loads((ROOT/'restore_payload.json').read_text())
for f in manifest['files']:assert sha(ROOT/f['path'])==f['sha256'],f['path']
import torch
from safetensors.torch import load_file
assert not torch.cuda.is_initialized()
weights=[]
initial=ROOT/'adapter/adapter_model.safetensors'
assert sha(initial)=='d431a07ce227c05e81eca5afb9461d91cf8101d50af0d27ec1a81844ce8ac684'
assert sha(Path('/workspace/cocolon_named9_initial_20261028/adapter_model.safetensors'))=='284f1df77c828982bdb7c2480f3f269b71dc9d69a29ea36b48dc6d25ab807d23'
old=load_file(str(initial),device='cpu')
assert len(old)==112
for p in sorted(RUN.glob('*/adapter_model.safetensors')):
    values=load_file(str(p),device='cpu')
    assert set(values)==set(old) and len(values)==112
    checks=[dict(name=n,shape=list(t.shape),dtype=str(t.dtype),finite=bool(torch.isfinite(t).all().item()),changed_from_d431=not torch.equal(t,old[n])) for n,t in sorted(values.items())]
    assert all(x['finite'] and x['dtype']=='torch.float32' for x in checks)
    weights.append(dict(path=str(p.relative_to(RUN)),sha256=sha(p),bytes=p.stat().st_size,tensors=checks,count=len(checks)))
dump(OUT/'weight_verification.json',dict(weights=weights,initial_d431_unchanged=True,initial_284f_unchanged=True,source_manifest_unchanged=True,cuda_initialized=False,model_loads=0,training_updates=0,generations=0,sql_operations=0))
files={}
for prefix,root in [('run',RUN),('runtime',PACK),('result',OUT)]:
    for p in root.rglob('*'):
        if p.is_file() and '__pycache__' not in str(p) and not p.name.endswith('.tmp'):
            if prefix=='runtime' and (p.name=='old_baseline.json' or 'teacher_cold' in p.parts):continue
            files[prefix+'/'+str(p.relative_to(root))]=p
for n in ('cocolon_reset9_gpu.log','cocolon_reset9_gpu.exit'):
    files['logs/'+n]=Path('/workspace')/n
files['runtime/restore_payload.json']=ROOT/'restore_payload.json'
for n in ('cocolon_reset9_cpu.log',):
    files['logs/'+n]=Path('/workspace')/n
files['runtime/export_reset9.py']=Path(__file__)
def archive(path,selected):
    records=[dict(path=n,bytes=p.stat().st_size,sha256=sha(p)) for n,p in selected.items()]
    with zipfile.ZipFile(path,'w',zipfile.ZIP_DEFLATED) as z:
        for n,p in selected.items():z.write(p,n)
        z.writestr('manifest.json',json.dumps(records,ensure_ascii=False,indent=2)+'\n')
    return dict(path=path.name,bytes=path.stat().st_size,sha256=sha(path),payloads=len(records),members=len(records)+1)
small={n:p for n,p in files.items() if '/adapter/' not in n and '/partial_adapter/' not in n}
small_spec=archive(Path('/workspace/cocolon_reset9_runtime_originals.zip'),small)
full=dict(files)
full['cpu/cpu_originals.zip']=Path('/workspace/cocolon_reset9_cpu_originals.zip')
full_spec=archive(Path('/workspace/cocolon_reset9_weights_and_originals.zip'),full)
dump(OUT/'export_summary.json',dict(run_status=report['status'],processing_seconds=report.get('processing_seconds'),process_cost_usd=report.get('process_cost_usd'),small=small_spec,full=full_spec,weight_count=len(weights),gpu_lifecycle_operations=0,automatic_progression=False))
print(json.dumps(json.loads((OUT/'export_summary.json').read_text())),flush=True)



