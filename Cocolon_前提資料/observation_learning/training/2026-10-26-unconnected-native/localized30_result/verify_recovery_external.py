"""External byte/tensor and counter verification; no Torch/model execution."""
import hashlib,json,math,pathlib,struct,sys,zipfile
import numpy as np
src=pathlib.Path(sys.argv[1]);dest=pathlib.Path(sys.argv[2])
dest.mkdir(exist_ok=False)
with zipfile.ZipFile(src) as z:
    assert z.testzip() is None
    manifest=json.loads(z.read('manifest.json'))
    assert len(z.namelist())==len(manifest['files'])+1
    for item in manifest['files']:
        name=item['path'];raw=z.read(name);assert len(raw)==item['bytes'] and hashlib.sha256(raw).hexdigest()==item['sha256'],name
        p=dest/name;assert p.resolve().is_relative_to(dest.resolve());p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(raw)
    (dest/'manifest.json').write_bytes(z.read('manifest.json'))
run=json.loads((dest/'run/run.json').read_text());plan=run['plan']
steps=[json.loads(s) for s in (dest/'run/training.jsonl').read_text().splitlines()]
assert run['optimizer_steps_started']==run['optimizer_steps_completed']==len(steps)==30
assert [s['step'] for s in steps]==list(range(1,31)) and [s['id'] for s in steps]==plan['update_order']
assert all(math.isfinite(s['loss']) and math.isfinite(s['gradient_norm']) and s['gradient_norm']>0 for s in steps)
assert sum(s['selected_tokens'] for s in steps)==396
assert run['base_model_loads_started']==run['base_model_loads_completed']==2
for name in ('initial_loaded_tensors.json','reloaded_tensors.json'):
    ts=json.loads((dest/'run'/name).read_text());assert len(ts)==112 and all(t['dtype']=='torch.float32' and t['finite'] for t in ts)
    assert sum(math.prod(t['shape']) for t in ts)==3833856
assert run['fixed_sources_and_initial109c_unchanged'] is True
adapter=dest/'run/adapter'
for name,h in run['adapter_sha256'].items():assert hashlib.sha256((adapter/name).read_bytes()).hexdigest()==h,name
blob=(adapter/'adapter_model.safetensors').read_bytes();hlen=struct.unpack('<Q',blob[:8])[0];header=json.loads(blob[8:8+hlen]);payload=memoryview(blob)[8+hlen:];total=0;spans=[];names=[]
for name,t in header.items():
    if name=='__metadata__':continue
    assert t['dtype']=='F32';lo,hi=t['data_offsets'];assert hi-lo==4*math.prod(t['shape'])
    values=np.frombuffer(payload[lo:hi],dtype='<f4');assert np.isfinite(values).all(),name
    total+=values.size;spans.append((lo,hi));names.append(name)
assert len(names)==112 and total==3833856 and sorted(spans)[0][0]==0 and sorted(spans)[-1][1]==len(payload)
assert all(a[1]==b[0] for a,b in zip(sorted(spans),sorted(spans)[1:]))
reloaded=json.loads((dest/'run/reloaded_tensors.json').read_text())
for row in reloaded:
    name=row['name'].replace('.default.weight','.weight');assert name in header and row['shape']==header[name]['shape']
records=[]
for call in run['calls']:
    p=dest/'run'/call['path'];assert hashlib.sha256(p.read_bytes()).hexdigest()==call['raw_sha256'];d=json.loads(p.read_text())
    assert d['case_id']==call['case_id'] and d['adapter_revision']==run['adapter_sha256']['adapter_model.safetensors'] and d['eos_reached']==call['eos_reached']
    assert hashlib.sha256(d['raw_text'].encode()).hexdigest()==d['raw_utf8_sha256'];records.append(d)
assert run['model_calls_completed']==len(records)==15 and run['model_calls_started']==15
assert run['processing_seconds']<2700 and run['process_cost_usd']<=.21
diagnosis=json.loads((dest/'diagnosis/diagnosis.json').read_text())
assert diagnosis['new_model_calls']==diagnosis['training_updates']==diagnosis['sql_operations']==0
assert diagnosis['source_run_sha256']==hashlib.sha256((dest/'run/run.json').read_bytes()).hexdigest()
cold_ok=0
for case in diagnosis['cases']:
    if case['meaning_adopted']:
        cold=json.loads((dest/'diagnosis'/(case['case_id']+'_cold.json')).read_text());assert cold['full_outcome']==case['outcome'] and cold['new_candidate_calls']==cold['fresh_adoptions']==0
        assert cold['snapshot_unchanged'] and cold['checkpoint_unchanged'];cold_ok+=1
assert cold_ok==diagnosis['cold_file_checked_count'] and diagnosis['cold_file_failures']==0
proof={'archive_bytes':src.stat().st_size,'archive_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'payloads':len(manifest['files']),'members':len(manifest['files'])+1,'all_payload_size_hash_and_crc_match':True,'ordered_updates':30,'local_token_exposures':396,'finite_saved_f32_tensors':112,'parameters':total,'two_loads_complete':True,'raw_count':len(records),'eos_count':sum(r['eos_reached'] for r in records),'strict_json_count':sum(r['parsed'] is not None for r in records),'meaning_count':diagnosis['meaning_adopted_count'],'body_count':diagnosis['body_available_count'],'cold_equal':cold_ok,'cold_failures':0,'processing_seconds':run['processing_seconds'],'process_cost_usd':run['process_cost_usd'],'adapter_sha256':run['adapter_sha256'],'model_reexecution_for_external_verification':False}
(dest/'external_verification.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n');print(json.dumps(proof,ensure_ascii=False))
