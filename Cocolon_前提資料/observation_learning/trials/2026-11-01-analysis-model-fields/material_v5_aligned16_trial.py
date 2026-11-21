"""CPU-UNVALIDATED draft: align sixteen existing teachers to material.v5.

Execution was not started: the Work environment became unavailable. Before any
GPU use, run prepare, review its complete outputs, and preserve a fixed runner.
Only six independent-action NEGATION quotes change in a derived training set.
The ninety original teachers, evaluation raw, semantic gates and authors stay
unchanged. No normal enablement or automatic adoption.
"""
from dataclasses import asdict
import copy
import hashlib
import html
import importlib.util
import json
from pathlib import Path
import shutil
import signal
import subprocess
import sys
import threading
import time
import traceback
import zipfile

W=Path('/workspace');ROOT=W/'analysis-material-v5-aligned16-20261103'
PRIOR=W/'analysis-material-v5-negscope30-20261103'
SOURCE=W/'analysis-material-v4-target4-20261103/pack.json'
SOURCE_SHA='0da3ab47c753c71baa2c51478817009ea36d129330c6d15bc58c683e5802ee08'
BASE_RUNNER=W/'material_v5_negscope_trial.py'
BASE_RUNNER_SHA='d2090f2c9fc5ee4f930b05338124673b33a2edb0cd584c8da9864727d0d530e4'
ORDER=('N01','N02','AT04','C02','N03','RU01','N04','AT11','N05','C04','N06','AT17','N07','RU02','N08','AT24')
NEG_CHANGES={**{k:('しなかった','メモしなかった') for k in ('N03','N04','N07','N08')},**{k:('なかった','書かなかった') for k in ('C02','C04')}}
LIMIT=900
sys.dont_write_bytecode=True
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert sha(BASE_RUNNER)==BASE_RUNNER_SHA
spec=importlib.util.spec_from_file_location('previous_v5_binding',BASE_RUNNER)
v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)
h=v.h;h.ROOT=ROOT;h.PROFILE='selected_material.v5';write=h.write


def check():
    v.check_api()
    if (ROOT/'cpu.json').exists():
        assert sha(__file__)==json.loads((ROOT/'cpu.json').read_text())['runner_sha256']
    assert sha(SOURCE)==SOURCE_SHA
    assert sha(h.INITIAL/'adapter_model.safetensors')==h.WEIGHTS
    assert sha(h.INITIAL/'adapter_config.json')==h.CONFIG


def prepare_input(row):
    return v.prepare_input(row,'selected_material.v5')


def visible(projection):
    value={name:copy.deepcopy(projection[name]) for name in ('text','diagram')}
    for name in value:value[name].pop('projection_of',None)
    return value


def render():
    state={}
    for name in ('cpu.json','run_report.json','train/report.json','after/report.json','collection.json'):
        p=ROOT/name
        if p.exists():state[name]=json.loads(p.read_text())
    (W/'aligned16-progress.html').write_text('<meta charset="utf-8"><pre>'+html.escape(json.dumps(state,ensure_ascii=False,indent=2))+'</pre>')


def prepare():
    start=time.monotonic();check();assert not ROOT.exists(),'do_not_restart_root'
    from transformers import AutoTokenizer
    from serve_emlis_natural_reply import MODEL,REVISION,PINS
    from importlib.metadata import version
    assert {name:version(name) for name in PINS}==PINS
    tokenizer=AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
    original=json.loads(SOURCE.read_text());assert len(original['teachers'])==90
    by_id={r['id']:r for r in original['teachers']};assert len(by_id)==90 and set(ORDER)<=set(by_id)
    ROOT.mkdir();(ROOT/'teacher_targets').mkdir();(ROOT/'before').mkdir();(ROOT/'after').mkdir()
    for source,name in [(SOURCE,'source90_pack.json'),(BASE_RUNNER,'previous_v5_runner.py'),(W/'material_v4_target4_execution.py','existing_binding_helpers.py'),(v.OVERLAY,'overlay_manifest.json'),(Path(__file__),'runner.py')]:
        shutil.copyfile(source,ROOT/name)
    teachers=[];encoded={};audit=[];changes=[]
    for key in ORDER:
        row=copy.deepcopy(by_id[key]);old_target=row['assistant_target'];target=json.loads(old_target)
        old=v.prepare_input(row,'selected_material.v4')
        assert old.messages()==row['messages'] and old.request_ref==row['request_ref']
        changed=0
        if key in NEG_CHANGES:
            prior,following=NEG_CHANGES[key]
            for field in target['fields']:
                for unit in field['units']:
                    if unit['node_kind']=='ACTION_OR_NONACTION' and unit['parent_quote'] is None:
                        for qualifier in unit['qualifiers']:
                            if qualifier['kind']=='NEGATION':
                                assert qualifier['quote']==prior and following in unit['quote']
                                qualifier['quote']=following;changed+=1
            assert changed==1
        row['assistant_target']=h.canonical(target)
        restored=copy.deepcopy(target)
        if changed:
            prior,following=NEG_CHANGES[key]
            for field in restored['fields']:
                for unit in field['units']:
                    if unit['node_kind']=='ACTION_OR_NONACTION' and unit['parent_quote'] is None:
                        for qualifier in unit['qualifiers']:
                            if qualifier['kind']=='NEGATION':
                                assert qualifier['quote']==following
                                qualifier['quote']=prior
        assert h.canonical(restored)==old_target
        p=prepare_input(row);assert p.request==old.request and p.source_guard==old.source_guard
        row.update(messages=p.messages(),request_ref=p.request_ref)
        prompt=tokenizer.apply_chat_template(p.messages(),enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
        full=tokenizer.apply_chat_template(p.messages()+[dict(role='assistant',content=row['assistant_target'])],enable_thinking=False,add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
        assert full[:len(prompt)]==prompt and len(prompt)<len(full)<=8192 and len(prompt)+2048<=8192
        assert tokenizer.decode(full[len(prompt):],skip_special_tokens=False,clean_up_tokenization_spaces=False)==row['assistant_target']+'<|im_end|>\n'
        encoded[key]=dict(input_ids=full,labels=[-100]*len(prompt)+full[len(prompt):],loss_start=len(prompt)-1,logits_positions=len(full)-len(prompt)+1)
        receipt=h.bind_save(row,p,v.make_response(p,row['assistant_target']),ROOT/'teacher_targets',key)
        assert receipt['candidate']=='RETURNED'
        if key.startswith(('N','C')):assert receipt['typed']=='RETURNED' and receipt['typed_nodes']==2
        audit.append(dict(id=key,prompt_tokens=len(prompt),target_tokens=len(full)-len(prompt),**receipt))
        changes.append(dict(id=key,original_target_sha256=hashlib.sha256(old_target.encode()).hexdigest(),derived_target_sha256=hashlib.sha256(row['assistant_target'].encode()).hexdigest(),changed_negation_quotes=changed))
        teachers.append(row)
    assert sum(c['changed_negation_quotes'] for c in changes)==6 and len(encoded)==16
    assert json.loads(SOURCE.read_text())==original
    baseline=[];evaluation=[];prior_pack=json.loads((PRIOR/'pack.json').read_text());assert len(prior_pack['rows'])==30
    for original_row in prior_pack['rows']:
        row=copy.deepcopy(original_row);key=row['id'];p=prepare_input(row)
        req=json.loads((PRIOR/'after'/(key+'.request.json')).read_text())
        res=json.loads((PRIOR/'after'/(key+'.response.json')).read_text())
        raw=(PRIOR/'after'/(key+'.raw.txt')).read_text()
        assert req['messages']==p.messages()==row['new_messages'] and req['request_ref']==p.request_ref==row['new_request_ref']
        assert res==asdict(v.make_response(p,raw,res['finish_reason'])) and res['finish_reason']=='stop'
        assert req['messages_sha256']==res['messages_sha256']
        for suffix in ('.request.json','.response.json','.raw.txt'):
            shutil.copyfile(PRIOR/'after'/(key+suffix),ROOT/'before'/(key+suffix))
        receipt=h.bind_save(row,p,v.make_response(p,raw),ROOT/'before',key)
        for suffix in ('.candidate.json','.typed.json','.projection.json'):
            a=PRIOR/'after'/(key+suffix);b=ROOT/'before'/(key+suffix);assert a.exists()==b.exists()
            if a.exists():assert a.read_bytes()==b.read_bytes(),(key,suffix)
        row.update(messages=p.messages(),request_ref=p.request_ref);row.pop('new_messages');row.pop('new_request_ref')
        baseline.append(dict(id=key,**receipt));evaluation.append(row)
    assert sum(r['typed']=='RETURNED' for r in baseline)==18
    assert sum(r['candidate']=='RETURNED' for r in baseline)==29
    write(ROOT/'pack.json',dict(teachers=teachers,evaluation=evaluation,seed=20261113,learning_rate=1e-5,update_order=list(ORDER),measurement_ids=list(ORDER),source90_sha256=SOURCE_SHA,profile='selected_material.v5',initial_weights_sha256=h.WEIGHTS,initial_config_sha256=h.CONFIG,new_calls=30,model_loads=2,max_seconds=LIMIT,normal_adoption=False))
    write(ROOT/'encoded.json',encoded);write(ROOT/'target_changes.json',changes);write(ROOT/'teacher_audit.json',audit)
    write(ROOT/'before/report.json',dict(calls=baseline,reused_responses=30))
    write(ROOT/'cpu.json',dict(status='CPU_PASSED_NO_MODEL',seconds=time.monotonic()-start,teachers_selected=16,original_teacher_pool=90,derived_negation_changes=6,original90_unchanged=True,baseline_bytes_unchanged=True,before_typed=18,before_candidate=29,model_loads=0,model_forwards=0,runner_sha256=sha(__file__)))
    write(ROOT/'cpu_manifest.json',{str(p.relative_to(ROOT)):sha(p) for p in ROOT.rglob('*') if p.is_file()});render()


def deadline_signal(deadline):
    def expired(*_):raise TimeoutError('aligned16_bounded_deadline')
    for sig in (signal.SIGALRM,signal.SIGTERM):signal.signal(sig,expired)
    signal.setitimer(signal.ITIMER_REAL,max(.001,deadline-time.monotonic()))


def after(deadline):
    from serve_emlis_natural_reply import load_generator
    check();deadline_signal(deadline)
    trained=json.loads((ROOT/'train/report.json').read_text());assert trained['status']=='COMPLETE_NOT_ADOPTED'
    adapter=ROOT/'train/adapter'
    assert sha(adapter/'adapter_model.safetensors')==trained['weights_sha256'] and sha(adapter/'adapter_config.json')==trained['config_sha256']
    report=dict(status='STARTED',calls=[],model_loads=1)
    try:
        generator=load_generator(str(adapter),threading.Event(),weights_sha256=trained['weights_sha256'],config_sha256=trained['config_sha256'])
        for row in json.loads((ROOT/'pack.json').read_text())['evaluation']:
            assert time.monotonic()<deadline
            key=row['id'];p=prepare_input(row);assert p.messages()==row['messages'] and p.request_ref==row['request_ref']
            write(ROOT/'after'/(key+'.request.json'),dict(request_ref=p.request_ref,messages_sha256=hashlib.sha256(h.canonical(p.messages()).encode()).hexdigest(),messages=p.messages()))
            raw,finish=generator(p.messages(),min(deadline,time.monotonic()+45));res=v.make_response(p,raw,finish)
            (ROOT/'after'/(key+'.raw.txt')).write_text(raw);write(ROOT/'after'/(key+'.response.json'),asdict(res));assert finish=='stop'
            report['calls'].append(dict(id=key,finish=finish,**h.bind_save(row,p,res,ROOT/'after',key)))
            write(ROOT/'after/report.json',report);render()
        report['status']='COMPLETE_PENDING_SEMANTIC_REVIEW'
    finally:write(ROOT/'after/report.json',report);render()


def run():
    check();assert all(sha(ROOT/n)==d for n,d in json.loads((ROOT/'cpu_manifest.json').read_text()).items())
    assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid','--format=csv,noheader'],text=True).strip()
    with (ROOT/'run_started.json').open('x') as f:json.dump(dict(started=time.time(),max_seconds=LIMIT),f)
    start=time.monotonic();deadline=start+LIMIT;report=dict(status='STARTED',stages=[],normal_adoption=False)
    try:
        for phase in ('train','after'):
            with (ROOT/(phase+'.log')).open('w') as log:
                completed=subprocess.run([sys.executable,__file__,phase,str(deadline)],stdout=log,stderr=subprocess.STDOUT,timeout=max(.001,deadline-time.monotonic())+30)
            report['stages'].append(dict(phase=phase,exit=completed.returncode));write(ROOT/'run_report.json',report);assert completed.returncode==0,phase
        report['status']='COMPLETE_PENDING_FULL_REVIEW_NOT_ADOPTED'
    except BaseException:
        report.update(status='FAILED_NO_RETRY_NOT_ADOPTED',traceback=traceback.format_exc());raise
    finally:
        report.update(seconds=time.monotonic()-start,initial_unchanged=sha(h.INITIAL/'adapter_model.safetensors')==h.WEIGHTS and sha(h.INITIAL/'adapter_config.json')==h.CONFIG,source90_unchanged=sha(SOURCE)==SOURCE_SHA)
        write(ROOT/'run_report.json',report);render()


def collect():
    check();rows=json.loads((ROOT/'pack.json').read_text())['evaluation']
    report=json.loads((ROOT/'run_report.json').read_text());saved=[]
    import analysis_cumulative_service as service
    for phase in ('before','after'):
        directory=ROOT/phase
        for row in rows:
            key=row['id'];rp=directory/(key+'.response.json')
            if not rp.exists():continue
            p=prepare_input(row);res=json.loads(rp.read_text());raw=(directory/(key+'.raw.txt')).read_text()
            req=json.loads((directory/(key+'.request.json')).read_text())
            assert res==asdict(v.make_response(p,raw,res['finish_reason'])) and req['messages']==p.messages() and req['request_ref']==p.request_ref and req['messages_sha256']==res['messages_sha256']
            replayed=[]
            with h.guard_saved():
                for suffix,reader,kwargs in [('.candidate.json',service.reload_cumulative_quoted_parent_candidates,{}),('.typed.json',service.reload_cumulative_written_role_map,dict(with_action=row.get('with_action',False)))]:
                    q=directory/(key+suffix)
                    if q.exists():
                        artifact,coverage=reader(row['owner'],row['snapshot'],q.read_text(),**kwargs);replayed.append(suffix)
                        if suffix=='.typed.json':
                            projection=dict(graph=asdict(artifact.graph),text=artifact.safe_text_projection(authenticated_owner_scope=row['owner']),diagram=artifact.safe_projection(authenticated_owner_scope=row['owner']))
                            assert h.canonical(projection)==h.canonical(json.loads((directory/(key+'.projection.json')).read_text()))
            saved.append(dict(phase=phase,id=key,finish=res['finish_reason'],replayed=replayed))
    comparisons=[]
    for row in rows:
        key=row['id'];a=ROOT/'before'/(key+'.projection.json');b=ROOT/'after'/(key+'.projection.json')
        item=dict(id=key,before_typed=a.exists(),after_typed=b.exists())
        if a.exists() and b.exists():
            old=json.loads(a.read_text());new=json.loads(b.read_text())
            item.update(graph_equal=old['graph']==new['graph'],visible_equal=visible(old)==visible(new))
        comparisons.append(item)
    value=dict(status='COLLECTED_PENDING_SEMANTIC_REVIEW',run_status=report['status'],before_responses=sum(s['phase']=='before' for s in saved),new_after_responses=sum(s['phase']=='after' for s in saved),saved=saved,comparisons=comparisons,gpu=subprocess.check_output(['nvidia-smi','--query-gpu=memory.used,utilization.gpu','--format=csv,noheader'],text=True).strip(),compute_apps=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip())
    write(ROOT/'collection.json',value)
    for name,digest in json.loads(v.OVERLAY.read_text())['files'].items():
        dst=ROOT/'api_overlay'/name;dst.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(v.API/name,dst);assert sha(dst)==digest
    write(ROOT/'manifest.json',{str(p.relative_to(ROOT)):dict(bytes=p.stat().st_size,sha256=sha(p)) for p in ROOT.rglob('*') if p.is_file() and p.name!='manifest.json'})
    archive=W/'cocolon-analysis-material-v5-aligned16-20261103.zip'
    with zipfile.ZipFile(archive,'x',zipfile.ZIP_DEFLATED) as z:
        for p in sorted(ROOT.rglob('*')):
            if p.is_file():z.write(p,str(p.relative_to(ROOT)))
    render();print(json.dumps(dict(archive=str(archive),bytes=archive.stat().st_size,sha256=sha(archive),status=value['status'])))


if __name__=='__main__':
    phase=sys.argv[1]
    if phase=='train':check();deadline_signal(float(sys.argv[2]));h.train_phase(float(sys.argv[2]))
    elif phase=='after':after(float(sys.argv[2]))
    else:{'prepare':prepare,'run':run,'collect':collect}[phase]()
