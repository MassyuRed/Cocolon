"""Offline integrity check: python verify_archive.py ARCHIVE.zip."""
import argparse
import hashlib
import json
import struct
import zipfile

parser=argparse.ArgumentParser()
parser.add_argument('archive')
args=parser.parse_args()
data=open(args.archive,'rb').read()
assert len(data)==14841180
assert hashlib.sha256(data).hexdigest()=='39ac2ff058fe65a961b70f8477c2561306ca2daa1029a1bf3bb33f620c0df342'
with zipfile.ZipFile(args.archive) as z:
    assert z.testzip() is None and len(z.namelist())==77
    manifest=json.loads(z.read('manifest.json'))
    assert len(manifest)==76
    for name,value in manifest.items():
        b=z.read(name)
        assert len(b)==value['bytes'] and hashlib.sha256(b).hexdigest()==value['sha256'],name
    run=json.loads(z.read('run/run.json'))
    diagnosis=json.loads(z.read('diagnosis/diagnosis.json'))
    assert run['optimizer_steps_completed']==30 and run['model_calls_completed']==15
    assert diagnosis['source_run_sha256']==hashlib.sha256(z.read('run/run.json')).hexdigest()
    assert run['processing_seconds']<=2700 and run['process_cost_usd']<=.21
    weights=z.read('run/adapter/adapter_model.safetensors')
    header_bytes=struct.unpack('<Q',weights[:8])[0]
    header=json.loads(weights[8:8+header_bytes])
    tensors=[v for k,v in header.items() if k!='__metadata__']
    assert len(tensors)==112 and all(v['dtype']=='F32' for v in tensors)
    parameters=0
    for v in tensors:
        count=1
        for dimension in v['shape']:count*=dimension
        start,end=v['data_offsets'];assert end-start==count*4
        values=struct.iter_unpack('<f',weights[8+header_bytes+start:8+header_bytes+end])
        assert all(float('-inf')<value<float('inf') for (value,) in values)
        parameters+=count
    assert parameters==3833856
    checked=0
    for case in diagnosis['cases']:
        cid=case['case_id']
        assert hashlib.sha256(z.read('run/after_'+cid+'.jsonl')).hexdigest()==case['raw_sha256']
        if not case['meaning_adopted']:continue
        complete=json.loads(z.read('diagnosis/'+cid+'_saved_completed.json'))
        cold=json.loads(z.read('diagnosis/'+cid+'_cold.json'))
        assert complete==case['outcome']==cold['full_outcome']
        assert cold['snapshot_unchanged'] and cold['checkpoint_unchanged']
        assert cold['completed_file_retrieval_no_generation']
        assert cold['new_candidate_calls']==0 and cold['fresh_adoptions']==0
        checked+=1
    assert checked==11
print('Verified: 76 payload hashes/CRC, 112 finite F32 tensors, 15 raw hashes, 11 cold full outcomes. Not product acceptance.')
