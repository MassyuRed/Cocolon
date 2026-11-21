"""One bounded beam-width comparison on saved Analysis weights, with no learning."""
from dataclasses import asdict
import copy
import hashlib
import html
import importlib.util
import inspect
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
ROOT=W/'analysis-material-v4-beam2-20261103'
PRIOR=W/'analysis-material-v4-target4-20261103'
API=W/'analysis-material-v3-api-20261103'
INITIAL=W/'analysis-material-v4-pair8-20261103/train/adapter'
COMMIT='ded0586720df0c0d50d8838bcd391a19ca3eead5'
WEIGHTS='a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59'
CONFIG='006ebf7bef859264b3778126f4a0f6512e1b2a7e6049b09dfcf0d56603ede3a9'
HELPER_SHA='946101d4b03b34bfe641b8c3298500e16229b2b48dd7ba86e67d88529127932b'
LIMIT=900
sys.dont_write_bytecode=True
os.environ.update(HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
sys.path[:0]=[str(W),str(API/'ai/tools'),str(API/'ai/services/ai_inference')]
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
canonical=lambda v:json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'))


def write(path,value):
    path=Path(path);temporary=path.with_suffix(path.suffix+'.tmp')
    temporary.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
    temporary.replace(path)


def check():
    assert subprocess.check_output(['git','-C',str(API),'rev-parse','HEAD'],text=True).strip()==COMMIT
    assert not subprocess.check_output(['git','-C',str(API),'status','--porcelain','--untracked-files=no'],text=True).strip()
    assert sha(INITIAL/'adapter_model.safetensors')==WEIGHTS
    assert sha(INITIAL/'adapter_config.json')==CONFIG


def helpers():
    path=W/'material_v4_target4_execution.py'
    assert sha(path)==HELPER_SHA
    spec=importlib.util.spec_from_file_location('beam2_existing_helpers',path)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    return module


def loader_source():
    import serve_emlis_natural_reply as server
    original=inspect.getsource(server.load_generator)
    old='num_beams=1, use_cache=True'
    new='num_beams=2, use_cache=True'
    assert original.count(old)==1
    return server,original,original.replace(old,new)


def cpu():
    check();assert not ROOT.exists(),'do_not_restart_prepared_partial_or_completed_root'
    started=time.monotonic()
    import torch
    from transformers import AutoConfig,AutoTokenizer,GenerationConfig
    from serve_emlis_natural_reply import MODEL,REVISION,PINS
    from importlib.metadata import version
    from beam2_cache_check import check_beam2_cache
    assert {n:version(n) for n in PINS}==PINS
    tokenizer=AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
    config=AutoConfig.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
    generation=GenerationConfig.from_model_config(config)
    assert generation.eos_token_id==248044 and tokenizer.eos_token_id==248046
    # All other generation settings remain unset/default exactly as in loader.
    generation.num_beams=1;generation.do_sample=False
    beam=copy.deepcopy(generation);beam.num_beams=2;beam.validate()
    before_config=generation.to_dict();after_config=beam.to_dict()
    assert {k for k in before_config if before_config[k]!=after_config[k]}=={'num_beams'}
    reorder=check_beam2_cache()
    own=helpers();pack=json.loads((PRIOR/'pack.json').read_text());rows=pack['evaluation'][:22]
    assert len(rows)==22 and rows[-1]['id']=='X08'
    source_report=json.loads((PRIOR/'before/report.json').read_text())['calls']
    assert [x['id'] for x in source_report]==[x['id'] for x in rows]
    report=dict(status='CPU_CHECKING_NO_MODEL',bindings=[],reorder=reorder,
        cached_model_generation_config=before_config,requested_beam_config=after_config,
        tokenizer_eos=tokenizer.eos_token_id,actual_loader_model_eos=generation.eos_token_id,
        model_loads=0,model_forwards=0,training_updates=0)
    import analysis_cumulative_service as service
    for row,receipt in zip(rows,source_report):
        key=row['id'];p=own.prepare_input(row)
        request=json.loads((PRIOR/'before'/f'{key}.request.json').read_text())
        response=json.loads((PRIOR/'before'/f'{key}.response.json').read_text())
        raw=(PRIOR/'before'/f'{key}.raw.txt').read_text()
        assert p.messages()==row['messages']==request['messages']
        assert p.request_ref==row['request_ref']==request['request_ref']==response['request_ref']
        assert request['messages_sha256']==response['messages_sha256']==hashlib.sha256(canonical(p.messages()).encode()).hexdigest()
        assert raw==response['raw'] and hashlib.sha256(raw.encode()).hexdigest()==response['raw_sha256']
        count=len(tokenizer.apply_chat_template(p.messages(),enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False))
        assert count+2048<=8192
        checks=dict(id=key,prompt_tokens=count,response_bytes_unchanged=True)
        with own.guard_saved():
            if receipt['candidate']=='RETURNED':
                service.reload_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],(PRIOR/'before'/f'{key}.candidate.json').read_text())
                checks['candidate_saved_read']='MATCHED'
            if receipt['typed']=='RETURNED':
                artifact,coverage=service.reload_cumulative_written_role_map(row['owner'],row['snapshot'],(PRIOR/'before'/f'{key}.typed.json').read_text(),with_action=row.get('with_action',False))
                expected=json.loads((PRIOR/'before'/f'{key}.projection.json').read_text())
                assert canonical(asdict(artifact.graph))==canonical(expected['graph'])
                assert canonical(artifact.safe_text_projection(authenticated_owner_scope=row['owner']))==canonical(expected['text'])
                assert canonical(artifact.safe_projection(authenticated_owner_scope=row['owner']))==canonical(expected['diagram'])
                checks['typed_saved_read']='MATCHED'
        report['bindings'].append(checks)
    assert not torch.cuda.is_initialized()
    server,original,modified=loader_source();compile(modified,'<beam2-offline-loader>','exec')
    ROOT.mkdir();(ROOT/'before').mkdir()
    for p in (PRIOR/'before').iterdir():
        if p.is_file():shutil.copy2(p,ROOT/'before'/p.name)
    for name in ('material_v4_beam2_trial.py','beam2_cache_check.py'):
        shutil.copy2(W/name,ROOT/name)
    shutil.copy2(W/'material_v4_target4_execution.py',ROOT/'existing_binding_helpers.py')
    (ROOT/'loader_original.py').write_text(original);(ROOT/'loader_beam2.py').write_text(modified)
    report.update(status='CPU_PASSED_NO_MODEL',seconds=time.monotonic()-started,
        sources={n:sha(ROOT/n) for n in ('material_v4_beam2_trial.py','beam2_cache_check.py','existing_binding_helpers.py')},
        loader_original_sha256=sha(ROOT/'loader_original.py'),loader_beam2_sha256=sha(ROOT/'loader_beam2.py'))
    assert report['seconds']<300
    write(ROOT/'cpu.json',report)
    write(ROOT/'plan.json',dict(status='CPU_PREPARED_NO_GPU',api_commit=COMMIT,
        profile='selected_material.v4',weights_sha256=WEIGHTS,config_sha256=CONFIG,
        evaluation=rows,policy='num_beams_2_only_no_source_mask',new_generations=22,
        model_loads=1,training_updates=0,max_seconds=LIMIT,request_seconds=45,
        max_new_tokens=2048,context=8192,normal_adoption=False))
    print(json.dumps(dict(status=report['status'],seconds=report['seconds'],sources=report['sources'],reorder=reorder)),flush=True)


def run():
    check();cpu_report=json.loads((ROOT/'cpu.json').read_text())
    assert cpu_report['status']=='CPU_PASSED_NO_MODEL' and not (ROOT/'run.started').exists()
    for name,digest in cpu_report['sources'].items():assert sha(ROOT/name)==digest
    (ROOT/'run.started').write_text(str(time.time()))
    started=time.monotonic();deadline=started+LIMIT
    def expired(*_):raise TimeoutError('beam2_bounded_deadline')
    for sig in (signal.SIGALRM,signal.SIGINT,signal.SIGTERM):signal.signal(sig,expired)
    signal.setitimer(signal.ITIMER_REAL,LIMIT)
    report=dict(status='RUNNING',policy='num_beams_2_only_no_source_mask',calls=[],
        model_loads=0,training_updates=0,normal_adoption=False)
    directory=ROOT/'beam2';directory.mkdir()
    try:
        import torch
        from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse
        server,original,modified=loader_source()
        assert original==(ROOT/'loader_original.py').read_text() and modified==(ROOT/'loader_beam2.py').read_text()
        namespace=dict(vars(server));exec(compile(modified,'<beam2-offline-loader>','exec'),namespace)
        generator=namespace['load_generator'](str(INITIAL),threading.Event(),weights_sha256=WEIGHTS,config_sha256=CONFIG)
        report['model_loads']=1
        # Record the actual loaded config without changing model settings.
        closed=dict(zip(generator.__code__.co_freevars,[v.cell_contents for v in generator.__closure__]))
        model=closed['model'];assert model.generation_config.eos_token_id==248044
        report['loaded_model_generation_config']=model.generation_config.to_dict()
        report['explicit_generation_change']={'num_beams':{'before':1,'beam2':2}}
        torch.cuda.reset_peak_memory_stats()
        own=helpers();plan=json.loads((ROOT/'plan.json').read_text())
        for row in plan['evaluation']:
            assert time.monotonic()<deadline
            key=row['id'];p=own.prepare_input(row)
            assert p.messages()==row['messages'] and p.request_ref==row['request_ref']
            shutil.copy2(ROOT/'before'/f'{key}.request.json',directory/f'{key}.request.json')
            now=time.monotonic();raw,finish=generator(p.messages(),min(deadline,now+45))
            response=AnalysisModelQuotedParentUnitsResponse(p.request_ref,hashlib.sha256(canonical(p.messages()).encode()).hexdigest(),hashlib.sha256(raw.encode()).hexdigest(),finish,raw)
            (directory/f'{key}.raw.txt').write_text(raw);write(directory/f'{key}.response.json',asdict(response))
            receipt=dict(id=key,seconds=time.monotonic()-now,finish=finish)
            receipt.update(own.bind_save(row,p,response,directory,key))
            report['calls'].append(receipt);write(ROOT/'run.json',report)
            print(json.dumps(receipt),flush=True)
        report.update(status='COMPLETED',peak_allocated_gib=torch.cuda.max_memory_allocated()/2**30,peak_reserved_gib=torch.cuda.max_memory_reserved()/2**30)
    except BaseException:
        report.update(status='PARTIAL_FAILED',error=traceback.format_exc());raise
    finally:
        signal.setitimer(signal.ITIMER_REAL,0)
        report.update(seconds=time.monotonic()-started,initial_weights_unchanged=sha(INITIAL/'adapter_model.safetensors')==WEIGHTS,initial_config_unchanged=sha(INITIAL/'adapter_config.json')==CONFIG)
        write(ROOT/'run.json',report)
        write(ROOT/'manifest.json',{str(p.relative_to(ROOT)):sha(p) for p in sorted(ROOT.rglob('*')) if p.is_file() and p.name!='manifest.json'})
        archive=W/'cocolon-analysis-material-v4-beam2-originals-20261103.zip'
        with zipfile.ZipFile(archive,'x',zipfile.ZIP_DEFLATED) as z:
            for p in sorted(ROOT.rglob('*')):
                if p.is_file():z.write(p,p.relative_to(ROOT))
        summary=dict(report=report,archive_bytes=archive.stat().st_size,archive_sha256=sha(archive))
        (W/'beam2-review.html').write_text('<meta charset="utf-8"><pre>'+html.escape(json.dumps(summary,ensure_ascii=False,indent=2))+'</pre>')


if __name__=='__main__':
    if sys.argv[1]=='cpu':
        os.environ['CUDA_VISIBLE_DEVICES']=''
        signal.signal(signal.SIGALRM,lambda *_:(_ for _ in ()).throw(TimeoutError('cpu_300_seconds')))
        signal.setitimer(signal.ITIMER_REAL,300);cpu()
    elif sys.argv[1]=='run':run()
    else:raise ValueError('unknown_action')
