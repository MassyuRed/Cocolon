"""One coherent v5 comparison through the unchanged semantic/typed consumers.

Two independently authored wire examples and the action-negation instruction
agree in v5. Old versions, meaning gates, authors, saved reads and weights stay
unchanged. No teacher updates, output repair, forced answers or normal enablement.
"""
from dataclasses import asdict
import hashlib
import html
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

W=Path('/workspace');ROOT=W/'analysis-material-v5-negscope30-20261103'
API=W/'analysis-material-v5-negscope-api-20261103'
BASE='ded0586720df0c0d50d8838bcd391a19ca3eead5'
PRIOR=W/'analysis-material-v4-morph4-20261103'
OVERLAY=W/'negscope-inputs/overlay_manifest.json'
HELPER=W/'material_v4_target4_execution.py'
OLD_API=W/'analysis-material-v3-api-20261103'
sys.dont_write_bytecode=True
os.environ['HF_HUB_OFFLINE']='1';os.environ['TRANSFORMERS_OFFLINE']='1'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert sha(HELPER)=='946101d4b03b34bfe641b8c3298500e16229b2b48dd7ba86e67d88529127932b'
spec=importlib.util.spec_from_file_location('existing_binding',HELPER)
h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
sys.path[:]=[p for p in sys.path if not p.startswith(str(OLD_API))]
sys.path[:0]=[str(API/'ai/services/ai_inference'),str(API/'ai/tools'),str(API/'ai/tests')]
h.API=API;h.ROOT=ROOT;h.PROFILE='selected_material.v5'
write=h.write


def check_api():
    assert subprocess.check_output(['git','-C',str(API),'rev-parse','HEAD'],text=True).strip()==BASE
    files=json.loads(OVERLAY.read_text())['files']
    assert all(sha(API/name)==value for name,value in files.items())
    changed=subprocess.check_output(['git','-C',str(API),'diff','--name-only'],text=True).splitlines()
    assert sorted(changed)==sorted(name for name in files if '/tests/' not in name)


def prepare_input(row,version):
    import analysis_cumulative_service as service
    return service.prepare_cumulative_category_units(row['owner'],row['snapshot'],prompt_version=version)


def make_response(p,raw,finish='stop'):
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse
    return AnalysisModelQuotedParentUnitsResponse(p.request_ref,hashlib.sha256(h.canonical(p.messages()).encode()).hexdigest(),hashlib.sha256(raw.encode()).hexdigest(),finish,raw)


def render():
    body='<meta charset="utf-8"><pre>'
    for name in ('cpu.json','run_report.json','collection.json'):
        p=ROOT/name
        if p.exists():body+=html.escape(name+'\n'+p.read_text())+'\n'
    body+='</pre>'
    for phase in ('before','after'):
        for p in sorted((ROOT/phase).glob('*.raw.txt')):
            body+='<h2>'+phase+'/'+p.name+'</h2><pre>'+html.escape(p.read_text())+'</pre>'
    (W/'negscope30-review.html').write_text(body)


def prepare():
    start=time.monotonic();check_api();assert not ROOT.exists(),'do_not_restart_root'
    assert sha(h.INITIAL/'adapter_model.safetensors')==h.WEIGHTS and sha(h.INITIAL/'adapter_config.json')==h.CONFIG
    from transformers import AutoTokenizer
    from serve_emlis_natural_reply import MODEL,REVISION
    tok=AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
    rows=json.loads((PRIOR/'pack.json').read_text())['evaluation'];assert len(rows)==30
    ROOT.mkdir();(ROOT/'before').mkdir();(ROOT/'after').mkdir();(ROOT/'teacher_check').mkdir()
    shutil.copyfile(__file__,ROOT/'runner.py');shutil.copyfile(OVERLAY,ROOT/'overlay_manifest.json')
    shutil.copyfile(HELPER,ROOT/'existing_binding_helpers.py')
    checks=[]
    for row in rows:
        key=row['id'];old=prepare_input(row,'selected_material.v4');new=prepare_input(row,'selected_material.v5')
        req=json.loads((PRIOR/'before'/(key+'.request.json')).read_text())
        res=json.loads((PRIOR/'before'/(key+'.response.json')).read_text());raw=(PRIOR/'before'/(key+'.raw.txt')).read_text()
        assert req['messages']==old.messages()==row['messages'] and req['request_ref']==old.request_ref==row['request_ref']==res['request_ref']
        assert res['raw']==raw and res['raw_sha256']==hashlib.sha256(raw.encode()).hexdigest()
        assert res['finish_reason']=='stop' and req['messages_sha256']==res['messages_sha256']
        assert res['messages_sha256']==hashlib.sha256(h.canonical(old.messages()).encode()).hexdigest()
        assert old.request==new.request and old.source_guard==new.source_guard and old.request_ref!=new.request_ref
        assert old.messages()[1]==new.messages()[1]
        prompt=tok.apply_chat_template(new.messages(),enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
        assert len(prompt)+2048<=8192
        for suffix in ('.request.json','.response.json','.raw.txt'):shutil.copyfile(PRIOR/'before'/(key+suffix),ROOT/'before'/(key+suffix))
        baseline=h.bind_save(row,old,make_response(old,raw),ROOT/'before',key)
        for suffix in ('.candidate.json','.typed.json','.projection.json'):
            p=PRIOR/'before'/(key+suffix);q=ROOT/'before'/(key+suffix)
            assert p.exists()==q.exists()
            if p.exists():assert p.read_bytes()==q.read_bytes(),(key,suffix)
        checks.append(dict(id=key,new_prompt_tokens=len(prompt),**baseline))
        row['new_messages']=new.messages();row['new_request_ref']=new.request_ref
    assert sum(c['typed']=='RETURNED' for c in checks)==18
    # A valid short negation remains accepted. The new policy is generation-only.
    for row in rows[-4:]:
        p=prepare_input(row,'selected_material.v5')
        result=h.bind_save(row,p,make_response(p,row['assistant_target']),ROOT/'teacher_check',row['id'])
        assert result['typed']=='RETURNED' and result['typed_nodes']==2
    write(ROOT/'pack.json',dict(rows=rows,base_api=BASE,source_pack_sha256=sha(PRIOR/'pack.json'),weights_sha256=h.WEIGHTS,config_sha256=h.CONFIG,new_calls=30,max_seconds=600,normal_adoption=False))
    write(ROOT/'cpu.json',dict(status='CPU_PASSED_NO_MODEL',seconds=time.monotonic()-start,old_typed=18,old_raw_replays=30,old_artifact_bytes_unchanged=True,teacher_checks=4,model_loads=0,model_forwards=0,checks=checks,runner_sha256=sha(__file__)))
    write(ROOT/'cpu_manifest.json',{str(p.relative_to(ROOT)):sha(p) for p in ROOT.rglob('*') if p.is_file()});render()


def run():
    check_api();manifest=json.loads((ROOT/'cpu_manifest.json').read_text());assert all(sha(ROOT/n)==v for n,v in manifest.items())
    assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid','--format=csv,noheader'],text=True).strip()
    with (ROOT/'run_started.json').open('x') as f:json.dump(dict(started=time.time(),max_seconds=600),f)
    from serve_emlis_natural_reply import load_generator
    start=time.monotonic();deadline=start+600
    def interrupted(*_):raise TimeoutError('bounded_negscope_trial')
    signal.signal(signal.SIGTERM,interrupted);signal.signal(signal.SIGALRM,interrupted);signal.setitimer(signal.ITIMER_REAL,600)
    report=dict(status='STARTED',model_loads=1,training_updates=0,calls=[],normal_adoption=False)
    try:
        rows=json.loads((ROOT/'pack.json').read_text())['rows']
        generator=load_generator(str(h.INITIAL),threading.Event(),weights_sha256=h.WEIGHTS,config_sha256=h.CONFIG)
        for row in rows:
            assert time.monotonic()<deadline
            key=row['id'];p=prepare_input(row,'selected_material.v5')
            assert p.messages()==row['new_messages'] and p.request_ref==row['new_request_ref']
            write(ROOT/'after'/(key+'.request.json'),dict(request_ref=p.request_ref,messages_sha256=hashlib.sha256(h.canonical(p.messages()).encode()).hexdigest(),messages=p.messages()))
            raw,finish=generator(p.messages(),min(deadline,time.monotonic()+45));res=make_response(p,raw,finish)
            (ROOT/'after'/(key+'.raw.txt')).write_text(raw);write(ROOT/'after'/(key+'.response.json'),asdict(res))
            assert finish=='stop'
            report['calls'].append(dict(id=key,finish=finish,**h.bind_save(row,p,res,ROOT/'after',key)))
            write(ROOT/'run_report.json',report);render()
        report['status']='COMPLETE_PENDING_FULL_REVIEW_NOT_ADOPTED'
    except BaseException:report.update(status='FAILED_NO_RETRY_NOT_ADOPTED',traceback=traceback.format_exc());raise
    finally:
        report.update(seconds=time.monotonic()-start,initial_unchanged=sha(h.INITIAL/'adapter_model.safetensors')==h.WEIGHTS and sha(h.INITIAL/'adapter_config.json')==h.CONFIG)
        write(ROOT/'run_report.json',report);render()


def collect():
    """No generation: verify exact saved responses and compare visible projections."""
    check_api();rows=json.loads((ROOT/'pack.json').read_text())['rows'];report=json.loads((ROOT/'run_report.json').read_text())
    results=[]
    for phase,version in (('before','selected_material.v4'),('after','selected_material.v5')):
        directory=ROOT/phase
        for row in rows:
            key=row['id'];rp=directory/(key+'.response.json')
            if not rp.exists():continue
            p=prepare_input(row,version);res=json.loads(rp.read_text());raw=(directory/(key+'.raw.txt')).read_text()
            assert res==asdict(make_response(p,raw,res['finish_reason']))
            saved=[]
            import analysis_cumulative_service as service
            with h.guard_saved():
                for suffix,reader,kwargs in [('.candidate.json',service.reload_cumulative_quoted_parent_candidates,{}),('.typed.json',service.reload_cumulative_written_role_map,dict(with_action=row.get('with_action',False)))]:
                    q=directory/(key+suffix)
                    if q.exists():
                        artifact,coverage=reader(row['owner'],row['snapshot'],q.read_text(),**kwargs);saved.append(suffix)
                        if suffix=='.typed.json':
                            projected=dict(graph=asdict(artifact.graph),text=artifact.safe_text_projection(authenticated_owner_scope=row['owner']),diagram=artifact.safe_projection(authenticated_owner_scope=row['owner']))
                            assert h.canonical(projected)==h.canonical(json.loads((directory/(key+'.projection.json')).read_text()))
            results.append(dict(phase=phase,id=key,saved_replayed=saved))
    comparisons=[]
    for row in rows:
        key=row['id'];a=ROOT/'before'/(key+'.projection.json');b=ROOT/'after'/(key+'.projection.json')
        item=dict(id=key,before_typed=a.exists(),after_typed=b.exists())
        if a.exists() and b.exists():
            old=json.loads(a.read_text());new=json.loads(b.read_text())
            item['graph_equal']=old['graph']==new['graph']
            for v in (old,new):
                for name in ('text','diagram'):v[name].pop('projection_of',None)
            item['visible_equal']=old['text']==new['text'] and old['diagram']==new['diagram']
        comparisons.append(item)
    value=dict(status='COLLECTED_PENDING_SEMANTIC_REVIEW',run_status=report['status'],before_responses=sum(r['phase']=='before' for r in results),new_after_responses=sum(r['phase']=='after' for r in results),responses=len(results),comparisons=comparisons,gpu=subprocess.check_output(['nvidia-smi','--query-gpu=memory.used,utilization.gpu','--format=csv,noheader'],text=True).strip(),compute_apps=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True),saved_results=results)
    write(ROOT/'collection.json',value)
    for name,value_hash in json.loads(OVERLAY.read_text())['files'].items():
        dst=ROOT/'api_overlay'/name;dst.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(API/name,dst);assert sha(dst)==value_hash
    for name in ('negscope-tests.log','negscope-tests.exit','negscope-prepare.log','negscope-prepare.exit','negscope-run.log','negscope-run.exit'):
        p=W/name
        if p.exists():shutil.copyfile(p,ROOT/name)
    write(ROOT/'manifest.json',{str(p.relative_to(ROOT)):dict(bytes=p.stat().st_size,sha256=sha(p)) for p in ROOT.rglob('*') if p.is_file() and p.name!='manifest.json'})
    archive=W/'cocolon-analysis-material-v5-negscope30-20261103.zip'
    with zipfile.ZipFile(archive,'x',zipfile.ZIP_DEFLATED) as z:
        for p in sorted(ROOT.rglob('*')):
            if p.is_file():z.write(p,str(p.relative_to(ROOT)))
    render()
    print(json.dumps(dict(status=value['status'],archive=str(archive),bytes=archive.stat().st_size,sha256=sha(archive))))


if __name__=='__main__':
    {'prepare':prepare,'run':run,'collect':collect}[sys.argv[1]]()
