"""One offline lexical-coverage comparison, using the existing CE training owner."""
from dataclasses import asdict
import copy
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import shutil
import signal
import subprocess
import sys
import threading
import time
import traceback
import zipfile

W=Path('/workspace')
ROOT=W/'analysis-material-v4-lexical8-20261103'
PRIOR=W/'analysis-material-v4-target4-20261103'
UL=W/'analysis-material-v4-target-ul-20261103'
SOURCES=W/'material_v4_lexical8_sources.json'
HELPER=W/'material_v4_target4_execution.py'
HELPER_SHA='946101d4b03b34bfe641b8c3298500e16229b2b48dd7ba86e67d88529127932b'
ORDER=tuple(v for i in range(1,9) for v in (f'L{i:02}',f'N{i:02}'))
SPEECH=('AT04','AT11','AT17','AT24')
LIMIT=900
sys.dont_write_bytecode=True
os.environ['HF_HUB_OFFLINE']='1';os.environ['TRANSFORMERS_OFFLINE']='1'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert sha(HELPER)==HELPER_SHA
spec=importlib.util.spec_from_file_location('existing_target4_helpers',HELPER)
h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
h.ROOT=ROOT;h.UPDATE_ORDER=ORDER
write=h.write


def prepare():
    start=time.monotonic();h.check_api();assert not ROOT.exists(),'do_not_restart_root'
    assert sha(h.INITIAL/'adapter_model.safetensors')==h.WEIGHTS and sha(h.INITIAL/'adapter_config.json')==h.CONFIG
    old=json.loads((PRIOR/'pack.json').read_text());pack=copy.deepcopy(old)
    encoded=json.loads((PRIOR/'encoded.json').read_text())
    sources=json.loads(SOURCES.read_text())['examples']
    assert len(old['teachers'])==90 and len(old['evaluation'])==26 and len(sources)==8
    assert json.loads((UL/'train/report.json').read_text())['updates']==0
    assert json.loads((UL/'report.json').read_text())['initial_unchanged']
    from transformers import AutoTokenizer
    from serve_emlis_natural_reply import MODEL,REVISION
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse
    tokenizer=AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
    original_texts={(m['original']['memo'],m['original']['memo_action']) for row in old['teachers']+old['evaluation'] for m in row['snapshot']['members']}
    new=[]
    for i,source in enumerate(sources,1):
        assert source['id']==f'L{i:02}' and source['training_use'] is True
        assert (source['memo'],source['memo_action']) not in original_texts
        assert not any(word in source['memo']+source['memo_action'] for word in ('模型','展示係','作っ','作ら'))
        snap=copy.deepcopy(old['teachers'][0]['snapshot']);snap['tier']='plus';snap['members']=snap['members'][:1]
        m=snap['members'][0];m['thread']=None;m['events']=[]
        m['original'].update(id=f'00000000-0000-0000-0000-{73000+i:012}',memo=source['memo'],memo_action=source['memo_action'],category=[source['category']],emotions=['平穏'],emotion_details=[])
        row=dict(id=source['id'],owner=old['teachers'][0]['owner'],snapshot=snap,with_action=True,training_use=True,kind='KAREN_SYNTHETIC_LEXICAL_TEACHER',assistant_target=source['assistant_target'])
        p=h.prepare_input(row);row.update(messages=p.messages(),request_ref=p.request_ref)
        prompt=tokenizer.apply_chat_template(p.messages(),enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
        full=tokenizer.apply_chat_template(p.messages()+[dict(role='assistant',content=row['assistant_target'])],enable_thinking=False,add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
        assert full[:len(prompt)]==prompt and len(prompt)+2048<=8192 and len(full)<=8192
        assert tokenizer.decode(full[len(prompt):],skip_special_tokens=False,clean_up_tokenization_spaces=False)==row['assistant_target']+'<|im_end|>\n'
        assert h.canonical(json.loads(row['assistant_target']))==row['assistant_target']
        encoded[row['id']]=dict(input_ids=full,labels=[-100]*len(prompt)+full[len(prompt):],loss_start=len(prompt)-1,logits_positions=len(full)-len(prompt)+1)
        new.append(row)
    # Polarity is the sole source change within each of four pairs.
    for a,b in zip(sources[::2],sources[1::2]):
        fa,fb=json.loads(a['assistant_target'])['fields'],json.loads(b['assistant_target'])['fields']
        ra=[u for f in fa for u in f['units'] if u['node_kind']=='ROLE'];rb=[u for f in fb for u in f['units'] if u['node_kind']=='ROLE']
        assert ra==rb and [f['field'] for f in fa if any(u['node_kind']=='ROLE' for u in f['units'])]==[f['field'] for f in fb if any(u['node_kind']=='ROLE' for u in f['units'])]
    ROOT.mkdir();(ROOT/'teacher_targets').mkdir();(ROOT/'before').mkdir()
    shutil.copyfile(__file__,ROOT/'runner.py');shutil.copyfile(HELPER,ROOT/'existing_binding_helpers.py')
    shutil.copyfile(SOURCES,ROOT/'independent_sources.json');shutil.copyfile(PRIOR/'pack.json',ROOT/'source_pack.json')
    def response(p,raw):return AnalysisModelQuotedParentUnitsResponse(p.request_ref,hashlib.sha256(h.canonical(p.messages()).encode()).hexdigest(),hashlib.sha256(raw.encode()).hexdigest(),'stop',raw)
    checks=[]
    for row in new:
        p=h.prepare_input(row);v=h.bind_save(row,p,response(p,row['assistant_target']),ROOT/'teacher_targets',row['id'])
        assert v['candidate']=='RETURNED' and v['typed']=='RETURNED' and v['typed_nodes']==2
        checks.append(dict(id=row['id'],**v))
    speech=[copy.deepcopy(next(r for r in old['teachers'] if r['id']==key)) for key in SPEECH]
    before=[]
    for row in old['evaluation'][:22]+speech:
        directory=UL/'before' if row['id'] in SPEECH else PRIOR/'before'
        p=h.prepare_input(row);key=row['id'];req=json.loads((directory/(key+'.request.json')).read_text());res=AnalysisModelQuotedParentUnitsResponse(**json.loads((directory/(key+'.response.json')).read_text()))
        assert p.messages()==row['messages']==req['messages'] and p.request_ref==row['request_ref']==res.request_ref
        assert res.messages_sha256==req['messages_sha256']==hashlib.sha256(h.canonical(p.messages()).encode()).hexdigest()
        assert res.raw.encode()==(directory/(key+'.raw.txt')).read_bytes() and res.raw_sha256==hashlib.sha256(res.raw.encode()).hexdigest()
        for suffix in ('.request.json','.response.json','.raw.txt'):shutil.copyfile(directory/(key+suffix),ROOT/'before'/(key+suffix))
        before.append(dict(id=key,**h.bind_save(row,p,res,ROOT/'before',key)))
    assert len(before)==26 and sum(x['typed']=='RETURNED' for x in before)==14
    write(ROOT/'before/report.json',dict(calls=before))
    pack['teachers']+=new;pack['evaluation']+=speech+new
    assert pack['teachers'][:90]==old['teachers'] and len(pack['teachers'])==len(encoded)==98 and len(pack['evaluation'])==38
    pack.update(status='CPU_PREPARED_NO_MODEL',objective='unchanged_mean_CE_lexical_coverage_only',update_order=list(ORDER),measurement_ids=list(ORDER),max_seconds=LIMIT,new_calls=46,model_loads=3,normal_adoption=False,next_training_initial_adoption=False,source_pack_sha256=sha(PRIOR/'pack.json'),new_source_sha256=sha(SOURCES))
    write(ROOT/'pack.json',pack);write(ROOT/'encoded.json',encoded)
    write(ROOT/'cpu.json',dict(status='CPU_PASSED_NO_MODEL',seconds=time.monotonic()-start,new_teachers=8,total_teachers=98,teacher_checks=checks,reused_before=26,before_typed=14,model_loads=0,model_forwards=0,runner_sha256=sha(__file__)))
    write(ROOT/'cpu_manifest.json',{str(p.relative_to(ROOT)):sha(p) for p in ROOT.rglob('*') if p.is_file()})
    print(json.dumps(dict(status=pack['status'],teachers=98,new_teachers=8,updates=16,new_calls=46,model_loads=3)))


def generate(phase,deadline):
    from serve_emlis_natural_reply import load_generator
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse
    pack=json.loads((ROOT/'pack.json').read_text());rows=pack['evaluation'][-8:] if phase=='before' else pack['evaluation']
    assert len(rows)==(8 if phase=='before' else 38)
    directory=ROOT/phase;directory.mkdir(exist_ok=phase=='before')
    report=json.loads((directory/'report.json').read_text()) if phase=='before' else dict(calls=[])
    report.update(status='STARTED',new_model_loads=1)
    expected=dict(weights_sha256=h.WEIGHTS,config_sha256=h.CONFIG) if phase=='before' else json.loads((ROOT/'train/report.json').read_text())
    adapter=h.INITIAL if phase=='before' else ROOT/'train/adapter'
    assert sha(adapter/'adapter_model.safetensors')==expected['weights_sha256'] and sha(adapter/'adapter_config.json')==expected['config_sha256']
    generator=load_generator(str(adapter),threading.Event(),weights_sha256=expected['weights_sha256'],config_sha256=expected['config_sha256'])
    for row in rows:
        assert time.monotonic()<deadline
        p=h.prepare_input(row);key=row['id'];assert p.messages()==row['messages'] and p.request_ref==row['request_ref']
        write(directory/(key+'.request.json'),dict(request_ref=p.request_ref,messages_sha256=hashlib.sha256(h.canonical(p.messages()).encode()).hexdigest(),messages=p.messages()))
        raw,finish=generator(p.messages(),min(deadline,time.monotonic()+45))
        response=AnalysisModelQuotedParentUnitsResponse(p.request_ref,hashlib.sha256(h.canonical(p.messages()).encode()).hexdigest(),hashlib.sha256(raw.encode()).hexdigest(),finish,raw)
        (directory/(key+'.raw.txt')).write_text(raw);write(directory/(key+'.response.json'),asdict(response))
        report['calls'].append(dict(id=key,finish=finish,**h.bind_save(row,p,response,directory,key)));write(directory/'report.json',report)
        assert finish=='stop'
    report['status']='COMPLETE_PENDING_FULL_READ_NOT_ADOPTED';write(directory/'report.json',report)


def run():
    h.check_api();manifest=json.loads((ROOT/'cpu_manifest.json').read_text());assert all(sha(ROOT/n)==v for n,v in manifest.items())
    assert sha(h.INITIAL/'adapter_model.safetensors')==h.WEIGHTS and sha(h.INITIAL/'adapter_config.json')==h.CONFIG
    with (ROOT/'run_started.json').open('x') as f:json.dump(dict(started=time.time(),max_seconds=LIMIT),f)
    assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip()
    start=time.monotonic();deadline=start+LIMIT;report=dict(status='STARTED',stages=[],normal_adoption=False)
    try:
        for phase in ('before','train','after'):
            remaining=int(deadline-time.monotonic())-10;assert remaining>0
            with (ROOT/(phase+'.log')).open('x') as log:
                r=subprocess.run(['timeout','--signal=TERM','--kill-after=10',str(remaining),sys.executable,str(ROOT/'runner.py'),phase,str(deadline)],stdout=log,stderr=subprocess.STDOUT)
            report['stages'].append(dict(phase=phase,exit=r.returncode));write(ROOT/'report.json',report)
            assert r.returncode==0,phase
            if phase=='before':
                calls=json.loads((ROOT/'before/report.json').read_text())['calls'][-8:]
                if all(c['typed']=='RETURNED' for c in calls):
                    report['status']='TEACHERS_ALREADY_REACHED_NO_TRAINING';break
        else:report['status']='COMPLETE_PENDING_ALL_RAW_REVIEW_NOT_ADOPTED'
    except BaseException:
        report.update(status='FAILED_NO_RETRY_NOT_ADOPTED',traceback=traceback.format_exc());raise
    finally:
        report.update(seconds=time.monotonic()-start,initial_unchanged=sha(h.INITIAL/'adapter_model.safetensors')==h.WEIGHTS and sha(h.INITIAL/'adapter_config.json')==h.CONFIG,
                      gpu_after_process=subprocess.check_output(['nvidia-smi','--query-gpu=memory.used,utilization.gpu','--format=csv,noheader'],text=True).strip(),compute_apps=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True))
        write(ROOT/'report.json',report)
        write(ROOT/'manifest.json',{str(p.relative_to(ROOT)):sha(p) for p in ROOT.rglob('*') if p.is_file()})
        archive=W/'cocolon-analysis-material-v4-lexical8-originals-20261103.zip'
        with zipfile.ZipFile(archive,'x',compression=zipfile.ZIP_DEFLATED) as z:
            for p in sorted(ROOT.rglob('*')):
                if p.is_file():z.write(p,str(p.relative_to(ROOT)))
        print(json.dumps(dict(status=report['status'],archive=str(archive),bytes=archive.stat().st_size,sha256=sha(archive))))


if __name__=='__main__':
    action=sys.argv[1]
    if action=='prepare':prepare()
    elif action=='run':run()
    else:
        def interrupted(*_):raise TimeoutError('bounded_trial_deadline')
        signal.signal(signal.SIGTERM,interrupted)
        (h.train_phase(float(sys.argv[2])) if action=='train' else generate(action,float(sys.argv[2])))
