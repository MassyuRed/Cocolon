"""Four once-only training-seen fit diagnostics; no training or adoption.

prepare/run API NEW_ROOT. Compare exact OT03/OT06 snapshots under v7
on unchanged a2e and saved CE20 b7c. This is not unseen quality evaluation.
"""
import asyncio
import copy
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import threading
import time
from importlib.metadata import version

mode,api_arg,root_arg=sys.argv[1:4]
api,root=Path(api_arg),Path(root_arg)
ce=Path('/workspace/analysis-actor-ownership-ce20-20261105')
seam_path=Path('/workspace/actor_ownership_trial.py')
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert sha(seam_path)=='dfb10128d30420f1023b653d8f43141b3252b735b9acc52ffba83af343c3cfa7'
spec=importlib.util.spec_from_file_location('ownership_seam',seam_path)
seam=importlib.util.module_from_spec(spec);spec.loader.exec_module(seam)
seam.root=root;seam.api=api;seam.mode=mode
admission=seam.admission
COMMIT='4d744e36a093aac3ad157a448f06ef6be2be59cb'
LIMIT=240

def write(p,value):seam.write(p,value)

def prepare():
    assert not root.exists(),'do_not_restart_or_replace_partial_root'
    assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip()==COMMIT
    assert json.loads((ce/'report.json').read_text())['status']=='COMPLETE_PENDING_ALL_RAW_REVIEW_NOT_ADOPTED'
    pack=json.loads((ce/'pack.json').read_text());rows=[]
    for teacher in pack['teachers']:
        if teacher['id'] not in ('OT03','OT06'):continue
        row=dict(id=teacher['id'],owner=teacher['owner'],snapshot=copy.deepcopy(teacher['snapshot']),
            prompt_version='selected_material.v7',provenance='TRAINING_SEEN_FIT_NOT_GENERAL_EVALUATION')
        p,e=seam.prepare_row(row)
        assert p.messages()==teacher['messages'] and p.request_ref==teacher['request_ref']
        rows.append(dict(row=row,expected=e,assistant_target=teacher['assistant_target']))
    assert len(rows)==2
    trained=json.loads((ce/'train/report.json').read_text())
    assert trained['status']=='COMPLETE_NOT_ADOPTED'
    adapters=dict(initial=dict(path=str(seam.ADAPTER),weights_sha256=seam.WEIGHTS,config_sha256=seam.CONFIG),
        trained=dict(path=str(ce/'train/adapter'),weights_sha256=trained['weights_sha256'],config_sha256=trained['config_sha256']))
    for a in adapters.values():
        assert sha(Path(a['path'])/'adapter_model.safetensors')==a['weights_sha256']
        assert sha(Path(a['path'])/'adapter_config.json')==a['config_sha256']
    root.mkdir();shutil.copyfile(__file__,root/'runner.py')
    write(root/'pack.json',dict(rows=rows,adapters=adapters,ce_pack_sha256=sha(ce/'pack.json'),normal_adoption=False))
    print('CPU prepared: exact seen teachers2, training0, planned4generations/2loads/240seconds')

def phase(deadline):
    from serve_emlis_natural_reply import load_generator,PINS
    assert {n:version(n) for n in PINS}==PINS
    pack=json.loads((root/'pack.json').read_text());a=pack['adapters'][mode]
    report=dict(status='STARTED',cases=[],new_generation=0,model_calls_started=0,model_loads=1,new_training=0,normal_adoption=False,mode=mode)
    write(root/(mode+'.json'),report)
    generator=load_generator(a['path'],threading.Event(),weights_sha256=a['weights_sha256'],config_sha256=a['config_sha256'])
    for item in pack['rows']:
        case=asyncio.run(seam.one(item['row'],item['expected'],report=report,generator=generator,deadline=deadline))
        assert case['response']['finish_reason']=='stop'
        try:case['teacher_json_matches']=json.loads(case['response']['raw'])==json.loads(item['assistant_target'])
        except ValueError:case['teacher_json_matches']=False
        report['cases'].append(case);write(root/(mode+'.json'),report)
    report['status']='COMPLETE_TRAINING_SEEN_FIT_NOT_ADOPTED';write(root/(mode+'.json'),report)

def run():
    with (root/'run_started.json').open('x') as f:json.dump(dict(max_seconds=LIMIT),f)
    start=time.monotonic();deadline=start+LIMIT;report=dict(status='STARTED',stages=[],new_training=0,normal_adoption=False)
    try:
        for part in ('initial','trained'):
            remaining=int(deadline-time.monotonic())-5;assert remaining>0
            with (root/(part+'.log')).open('x') as log:
                p=subprocess.run(['timeout','--signal=TERM','--kill-after=5',str(remaining),sys.executable,__file__,part,str(api),str(root),str(deadline)],stdout=log,stderr=subprocess.STDOUT)
            report['stages'].append(dict(phase=part,exit=p.returncode));write(root/'report.json',report)
            assert p.returncode==0,part
        report['status']='COMPLETE_TRAINING_SEEN_FIT_NOT_ADOPTED'
    except BaseException:
        report['status']='FAILED_NO_RETRY_NOT_ADOPTED';raise
    finally:
        report['seconds']=time.monotonic()-start;write(root/'report.json',report)
        print(json.dumps(report))

if __name__=='__main__':
    if mode=='prepare':prepare()
    elif mode=='run':run()
    elif mode in ('initial','trained'):phase(float(sys.argv[4]))
    else:raise ValueError('unknown mode')
