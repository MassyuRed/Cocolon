"""Recover the approved inference-only trial and all frozen source bytes."""
from pathlib import Path
import hashlib,json,zipfile

W=Path('/workspace')
RUN=W/'cocolon_shape2_run_20261029'
CPU=W/'cocolon_shape2_cpu_20261029'
PACK=W/'cocolon_shape2_pack_20261029'
report=json.loads((RUN/'run.json').read_text())
assert report['status'] in ('RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW','STOPPED_NO_RETRY','STOPPED_IDENTITY_UNVERIFIED_NO_RETRY')
if report['status']=='RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW':
    assert report['model_calls_completed']==2
    diagnosis=json.loads((RUN/'cmee/diagnosis.json').read_text())
    assert len(diagnosis['cases'])==2
files={}
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def tree(prefix,root):
    for p in sorted(root.rglob('*')):
        if p.is_file() and '__pycache__' not in p.parts:files[prefix+'/'+str(p.relative_to(root))]=p
tree('run',RUN)
tree('source',PACK)
tree('cpu',CPU)
tree('initial_adapter',W/'cocolon_joint_role18_run_20261029/adapter')
cpu=json.loads((CPU/'cpu_check.json').read_text())
for name,h in cpu['frozen'].items():
    p=Path(name);assert sha(p)==h
    files['frozen_originals/'+str(p.relative_to(W))]=p
for p in sorted((W/'cocolon_fixedrows5_run_20261029').glob('before_*.jsonl')):files['baseline_before/'+p.name]=p
files['baseline_before/diagnosis.json']=W/'cocolon_fixedrows5_run_20261029/before_cmee/diagnosis.json'
for name in ('shape2-gpu.log','shape2-gpu.exit','shape2-cmee.log','shape2-cmee.exit','shape2-cpu.log','shape2-cpu.exit','cocolon-shape2-approved-20261029.zip','cocolon-shape2-cpu-20261029.zip'):
    p=W/name
    if p.is_file():files['logs/'+name]=p
files['source/export_shape2.py']=Path(__file__)
manifest=dict(schema='cocolon.shape2_original_archive.v1',runtime_source_commit='bd2ad8529e8e415e388bfc47f897b790f13f7ebe',proposal_source_commit='fcdfd21134d1654392281c2744a8345f922c69b7',api_runtime_commit='c920f81a2540b23a36d4bd83f9149e29d00ac407',base_model='Qwen/Qwen3.5-4B',base_revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a',initial_adapter_sha256='f4932d3a2bac1d8e78d0bf86579868e29546914512234d31556840eb28a85c19',base_weights_included=False,optimizer_rng_resume_included=False,new_weights_created=False,files=[])
for name,p in files.items():manifest['files'].append(dict(path=name,bytes=p.stat().st_size,sha256=sha(p)))
out=W/'cocolon-shape2-originals-20261029.zip'
with zipfile.ZipFile(out,'x',zipfile.ZIP_DEFLATED) as z:
    for name,p in files.items():z.write(p,name)
    z.writestr('manifest.json',json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
with zipfile.ZipFile(out) as z:
    assert z.testzip() is None
    assert set(z.namelist())==set(files)|{'manifest.json'}
    for f in manifest['files']:
        b=z.read(f['path']);assert len(b)==f['bytes'] and hashlib.sha256(b).hexdigest()==f['sha256']
receipt=dict(archive=out.name,bytes=out.stat().st_size,sha256=sha(out),payload_count=len(files),member_count=len(files)+1,raw_status=report['status'],model_loads_completed=report['model_loads_completed'],model_calls_completed=report['model_calls_completed'],optimizer_steps_completed=report['optimizer_steps_completed'],processing_seconds=report['processing_seconds'],process_cost_usd=report['process_cost_usd'],initial_adapter_unchanged=report.get('initial_adapter_unchanged'),full2=diagnosis['full2'] if report['status']=='RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW' else None)
(W/'shape2-export-receipt.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(receipt,ensure_ascii=False),flush=True)
