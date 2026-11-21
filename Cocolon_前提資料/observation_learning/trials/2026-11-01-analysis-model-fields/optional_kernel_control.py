"""Isolated optional-kernel diagnostic; reviewed frozen manifest required.

prepare API NEW_ROOT --expected-api-head SHA --optional-manifest MANIFEST
  --expected-manifest-sha SHA --target TARGET --wheels WHEELS
  --v8-root OLD_FAILED_V8_ROOT --wire24-root WIRE24_ROOT
run API PREPARED_ROOT --expected-api-head SHA

Unfrozen manifests fail closed. This never installs packages. A fresh child
receives only the reviewed target as PYTHONPATH, verifies base ABI/origins and
actual vendor bindings, then loads unchanged a2e once. Original trial helpers
are imported read-only; original prepare/run/generate entry points are not run.
"""
from __future__ import annotations

import argparse
from dataclasses import asdict, replace
import hashlib
import importlib
import importlib.util
from importlib.metadata import distribution, distributions, version
import inspect
import json
import os
from pathlib import Path
import platform
import shutil
import signal
import subprocess
import sys
import threading
import time
import traceback

EXPECTED_API_PREFIX='100c1bb'
V8_HELPER_SHA='e4c7ff11e57b9a5a236401ff075c571bd0eba1be3f94a2bb9a25ecc15af1e05c'
WEIGHTS='a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59'
CONFIG='006ebf7bef859264b3778126f4a0f6512e1b2a7e6049b09dfcf0d56603ede3a9'
WIRE_PACK_SHA='d4d2b7415fce9aa66a035647b7e8be2695a2eceee2601636a28866f8dd55e831'
WIRE_BEFORE_SHA='93dd14889756de4c0c1f39bf62ecf582cf4f03949a8fa0a182eeb0ecfa5f9432'
LIMIT,WARMUP,TIMED=240,90,23
BINDINGS=('causal_conv1d_fn','causal_conv1d_update','chunk_gated_delta_rule','fused_recurrent_gated_delta_rule')
BASE_VERSIONS={'torch':'2.8.0+cu128','triton':'3.4.0','transformers':'5.19.0',
    'peft':'0.21.2','accelerate':'1.15.0','safetensors':'0.8.0'}
OPTIONAL_BASE_VERSIONS={'causal-conv1d':'1.7.0','flash-linear-attention':'0.6.0',
    'fla-core':'0.6.0','einops':'0.8.1'}
CAUSAL_WHEEL_SHA='a1fcd5d022b67ddfc9e1c291f890004c1c081a03d66b532f6eebe31219168e0e'


def canonical(value):
    return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def digest(value):
    return hashlib.sha256(canonical(value).encode('utf-8')).hexdigest()


def read(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def write(path,value):
    path=Path(path);temporary=path.with_name(path.name+'.tmp')
    temporary.write_text(canonical(value)+'\n',encoding='utf-8');temporary.replace(path)


def helper(path):
    assert sha(path)==V8_HELPER_SHA,'old_v8_helper_changed'
    spec=importlib.util.spec_from_file_location('read_only_v8_diagnostic_helpers',path)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    return module


def installed_files(target):
    return {str(path.relative_to(target)):sha(path) for path in sorted(target.rglob('*'))
        if path.is_file() and '__pycache__' not in path.parts and path.suffix!='.pyc'}


def frozen_manifest(path,expected_sha,target,wheels,api_head):
    assert sha(path)==expected_sha,'optional_manifest_changed'
    manifest=read(path)
    assert manifest['schema_version']=='qwen35_optional_runtime_manifest.v1'
    assert manifest['status']=='FROZEN_REVIEWED_RUNTIME','optional_manifest_not_frozen'
    assert len(api_head)==40 and api_head.startswith(EXPECTED_API_PREFIX)
    assert manifest['api_commit']==api_head
    assert Path(manifest['target_root']).resolve()==target
    assert target.is_dir() and wheels.is_dir()
    assert manifest['installed_files'] and installed_files(target)==manifest['installed_files']
    assert manifest['wheels'] and manifest['optional_packages']
    assert {item['distribution']:item['version'] for item in manifest['base']['packages']}==BASE_VERSIONS
    normalized=lambda name:name.lower().replace('_','-')
    optional={normalized(item['distribution']) for item in manifest['optional_packages']}
    assert optional==set(OPTIONAL_BASE_VERSIONS) and not optional.intersection(BASE_VERSIONS)
    assert len(manifest['wheels'])==4 and {normalized(item['distribution']) for item in manifest['wheels']}==optional
    assert {normalized(item.metadata['Name']) for item in distributions(path=[str(target)])}==optional
    for item in manifest['optional_packages']+manifest['wheels']:
        name=normalized(item['distribution']);actual=item['version']
        assert (actual.split('+',1)[0] if name=='causal-conv1d' else actual)==OPTIONAL_BASE_VERSIONS[name]
    for wheel in manifest['wheels']:
        name=wheel['filename'];assert Path(name).name==name
        assert type(wheel['version']) is str and wheel['version']
        assert type(wheel['source_url']) is str and wheel['source_url'].startswith('https://')
        assert sha(wheels/name)==wheel['sha256'],'wheel_artifact_changed'
        if normalized(wheel['distribution'])=='causal-conv1d':assert wheel['sha256']==CAUSAL_WHEEL_SHA
    assert len(manifest['vendor_bindings'])==4 and {binding['binding'] for binding in manifest['vendor_bindings']}==set(BINDINGS)
    assert all(all(type(value) is bool for value in binding.get('required_closure_flags',{}).values()) for binding in manifest['vendor_bindings'])
    assert type(manifest['availability_checks']) is list
    return manifest


def environment_identity(manifest,target,*,with_optional):
    """No model/GPU action: verify imported packages and base Torch ABI."""
    assert platform.python_version()==manifest['base']['python_version']=='3.12.3'
    assert platform.machine()==manifest['base']['machine']=='x86_64'
    result={}
    for item in manifest['base']['packages']:
        module=importlib.import_module(item['module'])
        origin=Path(module.__file__).resolve()
        metadata_root=Path(distribution(item['distribution']).locate_file('')).resolve()
        assert not origin.is_relative_to(target) and not metadata_root.is_relative_to(target)
        assert version(item['distribution'])==item['version']
        assert str(origin)==item['origin'] and sha(origin)==item['origin_sha256']
        assert str(metadata_root)==item['distribution_root']
        result[item['distribution']]=dict(version=item['version'],origin=str(origin),origin_sha256=sha(origin))
    import torch
    assert torch.__version__==manifest['base']['torch_version']=='2.8.0+cu128'
    assert torch.version.cuda==manifest['base']['torch_cuda']=='12.8'
    assert bool(torch._C._GLIBCXX_USE_CXX11_ABI) is manifest['base']['cxx11_abi'] is True
    assert version('triton')==manifest['base']['triton_version']=='3.4.0'
    if with_optional:
        for item in manifest['optional_packages']:
            module=importlib.import_module(item['module']);origin=Path(module.__file__).resolve()
            metadata_root=Path(distribution(item['distribution']).locate_file('')).resolve()
            assert origin.is_relative_to(target) and metadata_root.is_relative_to(target)
            assert version(item['distribution'])==item['version']
            assert str(origin.relative_to(target))==item['origin_relative']
            assert sha(origin)==item['origin_sha256']
            result[item['distribution']]=dict(version=item['version'],origin=str(origin),origin_sha256=sha(origin))
    return result


def vendor_bindings(manifest,target):
    proof=[];objects=[]
    for item in manifest['vendor_bindings']:
        owner=importlib.import_module(item['owner_module'])
        vendor=importlib.import_module(item['vendor_module'])
        owner_origin=Path(owner.__file__).resolve();vendor_origin=Path(vendor.__file__).resolve()
        assert sha(owner_origin)==item['owner_module_sha256']
        assert vendor_origin.is_relative_to(target)
        assert str(vendor_origin.relative_to(target))==item['vendor_origin_relative']
        assert sha(vendor_origin)==item['vendor_module_sha256']
        bound=getattr(owner,item['owner_attribute']);actual=getattr(vendor,item['vendor_attribute'])
        resolved=bound;resolved_flags={}
        assert type(item['resolution_path']) is list
        for step in item['resolution_path']:
            if step=='closure:implementation':
                values=inspect.getclosurevars(resolved).nonlocals
                assert 'implementation' in values
                for key,expected in item.get('required_closure_flags',{}).items():
                    assert values.get(key) is expected,'vendor_closure_flag_changed'
                    resolved_flags[key]=values[key]
                resolved=values['implementation']
            elif step=='__wrapped__':
                resolved=getattr(resolved,'__wrapped__')
            else:raise AssertionError('unreviewed_vendor_resolution_path')
        assert callable(bound) and resolved is actual,'vendor_fast_binding_not_active'
        assert getattr(actual,'__module__',None)==item['callable_module']
        objects.append(bound)
        proof.append(dict(binding=item['binding'],owner_attribute=item['owner_attribute'],vendor_module=item['vendor_module'],
            callable_module=item['callable_module'],vendor_origin=str(vendor_origin),
            vendor_module_sha256=sha(vendor_origin),resolution_path=item['resolution_path'],closure_flags=resolved_flags,exact_vendor_implementation=True))
    for item in manifest['availability_checks']:
        assert getattr(importlib.import_module(item['module']),item['attribute']) is True
    assert len(proof)==4
    return proof,tuple(objects)


def rebuild(v8,service,semantic,pack):
    warm=pack['warmup_row']
    prepared=service.prepare_cumulative_category_units(warm['owner'],warm['snapshot'],prompt_version='selected_material.v7')
    warm_desc=v8.descriptor(semantic,prepared)
    source=pack['v8_source_pack'];prior=pack['v7_source_pack']
    old=v8.reconstruct(service,semantic,prior,source['snapshot'],3)
    new=v8.fresh_v8(semantic,old)
    values=[prepared,old,new]
    for row,child in zip(pack['cases'],values):
        assert v8.canonical(v8.descriptor(semantic,child))==v8.canonical(row['input'])
    assert warm_desc['messages']==pack['cached_warmup_before']['case']['request']['messages']
    assert prepared.request_ref==pack['cached_warmup_before']['case']['response']['request_ref']
    return list(zip(pack['cases'],values))


def prepare(args):
    api,root,target,wheels=args.api,args.root,args.target,args.wheels
    assert not root.exists() and not Path(str(root)+'.zip').exists()
    assert root!=api and api not in root.parents and root!=target and target not in root.parents
    assert all(root!=source and source not in root.parents for source in (args.v8_root,args.wire24_root))
    manifest=frozen_manifest(args.optional_manifest,args.expected_manifest_sha,target,wheels,args.expected_api_head)
    assert sha(args.v8_root/'runner.py')==V8_HELPER_SHA
    v8=helper(args.v8_root/'runner.py')
    source=read(args.v8_root/'pack.json')
    assert sha(args.v8_root/'pack.json')==read(args.v8_root/'prepare.json')['pack_sha256']
    assert sha(args.v8_root/'pack.json')==manifest['inputs']['v8_pack_sha256']
    assert sha(args.v8_root/'pack.json')==read(args.v8_root/'report.json')['pack_sha256']
    assert source['api_commit']==args.expected_api_head
    assert sha(args.wire24_root/'pack.json')==WIRE_PACK_SHA
    assert sha(args.wire24_root/'reused_before.json')==WIRE_BEFORE_SHA
    wire=read(args.wire24_root/'pack.json');before=read(args.wire24_root/'reused_before.json')
    warm=next(item for item in before if item['id']=='AE05')
    assert wire['initial_weights_sha256']==WEIGHTS and wire['initial_config_sha256']==CONFIG
    assert (wire['model'],wire['revision'],wire['pins'])==(source['model'],source['revision'],source['pins'])
    expected_warm=next(item for item in wire['expected'] if item['id']=='AE05')
    assert warm['case']['request']['messages']==expected_warm['messages']
    assert warm['case']['request']['request_ref']==expected_warm['request_ref']
    cached=warm['case']['response']
    assert cached['messages_sha256']==expected_warm['messages_sha256'] and cached['finish_reason']=='stop'
    assert hashlib.sha256(cached['raw'].encode()).hexdigest()==cached['raw_sha256']
    old_report=read(args.v8_root/'report.json')
    assert old_report['status']=='FAILED_PARTIAL_NO_RETRY' and old_report['new_generation']==0
    assert old_report['model_calls_started']==1 and old_report['child_exit']==-14
    old_files={path.name:sha(path) for path in args.v8_root.iterdir() if path.is_file()}
    source_hashes=v8.check_api(api,args.expected_api_head,source['source_hashes'])
    adapter=Path(source['adapter_path']);v8.check_adapter(adapter)
    environment_identity(manifest,target,with_optional=False)
    root.mkdir();shutil.copyfile(__file__,root/'runner.py');shutil.copyfile(args.v8_root/'runner.py',root/'v8_helpers.py')
    shutil.copyfile(args.optional_manifest,root/'optional_manifest.json')
    report=dict(status='PREPARING_CPU_ONLY',model_loads=0,new_generation=0,new_training=0)
    write(root/'report.json',report);failure=None
    try:
        service,semantic,probe=v8.imports(api)
        from transformers import AutoTokenizer
        import httpx
        assert source['adapter_weights_sha256']==WEIGHTS and source['adapter_config_sha256']==CONFIG
        for name in ('model','revision','pins'):assert source[name]==getattr(probe,{'model':'MODEL','revision':'REVISION','pins':'PINS'}[name])
        warm_input=service.prepare_cumulative_category_units(warm['row']['owner'],warm['row']['snapshot'],prompt_version='selected_material.v7')
        assert warm_input.messages()==expected_warm['messages'] and warm_input.request_ref==expected_warm['request_ref']
        assert warm_input.source_guard==warm['case']['request']['source_guard']
        old=v8.reconstruct(service,semantic,read(args.v8_root/'before-v7-pack.json'),source['snapshot'],3)
        new=v8.fresh_v8(semantic,old)
        old_case=next(row for row in source['cases'] if row['id']=='FC03')
        assert v8.canonical(v8.descriptor(semantic,old))==v8.canonical(old_case['before'])
        assert v8.canonical(v8.descriptor(semantic,new))==v8.canonical(old_case['after'])
        tokenizer=AutoTokenizer.from_pretrained(probe.MODEL,revision=probe.REVISION,local_files_only=True,trust_remote_code=False)
        rows=[]
        for key,phase,seconds,child in (('KW00','WARMUP_AE05',90,warm_input),('KW01','TIMED_V7',23,old),('KW02','TIMED_V8',23,new)):
            descriptor=v8.descriptor(semantic,child)
            tokens=tokenizer.apply_chat_template(child.messages(),enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
            body=httpx.Request('POST','https://localhost/v1/chat/completions',json=dict(model=probe.MODEL,messages=child.messages(),temperature=0,max_tokens=2048,stream=False,chat_template_kwargs={'enable_thinking':False})).content
            assert len(tokens)+2048<=8192 and len(body)<=65536
            rows.append(dict(id=key,phase=phase,max_seconds=seconds,input=descriptor,prompt_tokens=len(tokens),
                prompt_token_ids_sha256=digest(tokens),request_body_bytes=len(body),request_body_sha256=hashlib.sha256(body).hexdigest()))
        pack=dict(schema_version='analysis_optional_kernel_control_inputs.v1',api_commit=args.expected_api_head,
            source_hashes=source_hashes,runner_sha256=sha(__file__),helper_sha256=V8_HELPER_SHA,
            adapter_path=str(adapter),adapter_weights_sha256=WEIGHTS,adapter_config_sha256=CONFIG,
            model=probe.MODEL,revision=probe.REVISION,pins=probe.PINS,cases=rows,
            warmup_row=warm['row'],cached_warmup_before=warm,v8_source_pack=source,
            v7_source_pack=read(args.v8_root/'before-v7-pack.json'),old_v8_failure_report=old_report,
            old_v8_source_root=str(args.v8_root),old_v8_file_sha256=old_files,
            wire24_pack_sha256=WIRE_PACK_SHA,wire24_before_sha256=WIRE_BEFORE_SHA,
            optional_manifest_sha256=args.expected_manifest_sha,target_root=str(target),wheel_root=str(wheels),
            limits=dict(max_seconds=240,max_new_generation=3,max_model_loads=1,warmup_seconds=90,timed_seconds=23,max_new_tokens=2048,context_tokens=8192,new_training=0,retry=0),
            normal_adoption=False,next_training_initial_adoption=False,
            interpretation='Known omission diagnostic with isolated optional runtime. Warmup includes model load/first-call JIT; v7 then v8 order and output lengths differ. No general speed multiplier, semantic-quality rate or normal23-second claim.')
        write(root/'pack.json',pack)
        v8.check_api(api,args.expected_api_head,source_hashes);v8.check_adapter(adapter)
        assert {path.name:sha(path) for path in args.v8_root.iterdir() if path.is_file()}==old_files
        report.update(status='PREPARED_CPU_ONLY',pack_sha256=sha(root/'pack.json'))
        write(root/'prepare.json',report)
    except BaseException as error:
        failure=error;report.update(status='FAILED_PREPARATION_NO_RETRY',error_type=type(error).__name__,traceback=traceback.format_exc())
    finally:
        write(root/'report.json',report)
        if failure is not None:print(canonical(dict(status=report['status'],archive=v8.archive(root))))
    if failure is not None:raise failure


def generate(args):
    root,api=args.root,args.api;pack=read(root/'pack.json')
    assert not (root/'generation.json').exists() and sha(root/'pack.json')==args.pack_sha
    assert sha(__file__)==pack['runner_sha256']==sha(root/'runner.py')
    target,wheels=Path(pack['target_root']),Path(pack['wheel_root'])
    assert os.environ.get('PYTHONPATH')==str(target),'fresh_target_pythonpath_required'
    manifest=frozen_manifest(root/'optional_manifest.json',pack['optional_manifest_sha256'],target,wheels,args.expected_api_head)
    report=dict(status='CHECKING_FRESH_RUNTIME_BEFORE_MODEL',cases=[],model_loads_started=0,model_loads=0,model_calls_started=0,new_generation=0,new_training=0,strict_rejections=0,normal_adoption=False)
    started=time.monotonic();stop=threading.Event()
    def checkpoint():report['seconds']=time.monotonic()-started;write(root/'generation.json',report)
    def terminated(signum,_frame):
        stop.set();report.update(status='TERMINATED_PARTIAL_NO_RETRY',signal=signum);checkpoint();raise SystemExit(128+signum)
    signal.signal(signal.SIGTERM,terminated);signal.signal(signal.SIGINT,terminated);checkpoint()
    try:
        report['runtime_identity']=environment_identity(manifest,target,with_optional=True)
        binding_proof,binding_objects=vendor_bindings(manifest,target)
        report.update(vendor_binding_proof=binding_proof,fast_vendor_bindings_verified=True,
            runtime_preflight_seconds=time.monotonic()-started);checkpoint()
        v8=helper(root/'v8_helpers.py')
        v8.check_api(api,args.expected_api_head,pack['source_hashes']);v8.check_adapter(Path(pack['adapter_path']))
        service,semantic,probe=v8.imports(api)
        cases=rebuild(v8,service,semantic,pack)
        warm_started=time.monotonic();warm_end=min(args.deadline-5,warm_started+WARMUP)
        assert warm_end>warm_started
        report.update(status='WARMUP_LOADING_MODEL',model_loads_started=1);checkpoint()
        signal.signal(signal.SIGALRM,signal.SIG_DFL)
        signal.setitimer(signal.ITIMER_REAL,max(0.001,warm_end-time.monotonic()))
        generator=probe.load_generator(pack['adapter_path'],stop,weights_sha256=WEIGHTS,config_sha256=CONFIG)
        report.update(model_loads=1,model_load_seconds=time.monotonic()-warm_started);checkpoint()
        assert vendor_bindings(manifest,target)[1]==binding_objects
        for row,child in cases:
            assert report['model_calls_started']<3 and time.monotonic()<args.deadline-5
            entry=dict(id=row['id'],phase=row['phase'],status='STARTED',expected_fields=row['input']['field_count'])
            report['cases'].append(entry);report['model_calls_started']+=1;checkpoint()
            called=time.monotonic();end=warm_end if row['phase']=='WARMUP_AE05' else min(args.deadline-5,called+TIMED)
            signal.setitimer(signal.ITIMER_REAL,max(0.001,end-time.monotonic()))
            try:raw,finish=generator(child.messages(),end);returned=time.monotonic()
            finally:signal.setitimer(signal.ITIMER_REAL,0)
            report['new_generation']+=1
            response=semantic.AnalysisModelQuotedParentUnitsResponse(child.request_ref,row['input']['messages_sha256'],hashlib.sha256(raw.encode()).hexdigest(),finish,raw)
            (root/(row['id']+'.raw.txt')).write_text(raw,encoding='utf-8');write(root/(row['id']+'.response.json'),asdict(response))
            entry.update(status='RAW_RECEIVED',finish_reason=finish,raw_sha256=response.raw_sha256,
                raw_utf8_bytes=len(raw.encode()),raw_characters=len(raw),generation_seconds=returned-called,
                warmup_wall_seconds=returned-warm_started if row['phase']=='WARMUP_AE05' else None);checkpoint()
            assert finish=='stop' and returned<=end,'incomplete_or_late_raw_preserved_no_retry'
            try:
                packet=semantic._load(raw)
                entry['returned_field_ordinals']=[field['field'] for field in packet['fields']] if type(packet) is dict and type(packet.get('fields')) is list and all(type(field) is dict and type(field.get('field')) is int and field['field']>0 for field in packet['fields']) else None
                bound=replace(child,response=response)
                candidate=semantic.generate_analysis_model_quoted_parent_units(child.request,bound)
                state=semantic.serialize_analysis_model_quoted_parent_units(bound,candidate)
                (root/(row['id']+'.candidate.private.json')).write_text(state,encoding='utf-8')
                with v8.replay_guard(semantic):assert semantic.reload_analysis_model_quoted_parent_units(child,state)==candidate
            except (semantic.AnalysisSemanticError,ValueError,KeyError,TypeError,AttributeError) as error:
                report['strict_rejections']+=1;entry.update(status='STRICT_REJECTED',error_type=type(error).__name__,error=str(error))
            else:entry.update(status='CANDIDATE_PRESERVED',private_non_generating_replay=True,candidate_fields=len(candidate.graph.fields))
            assert asdict(response)==read(root/(row['id']+'.response.json'))
            assert vendor_bindings(manifest,target)[1]==binding_objects
            checkpoint()
        assert report['model_calls_started']==report['new_generation']==3
        v8.check_api(api,args.expected_api_head,pack['source_hashes']);v8.check_adapter(Path(pack['adapter_path']))
        assert installed_files(target)==manifest['installed_files']
        report['status']='COMPLETE_KNOWN_DIAGNOSTIC_PENDING_RAW_REVIEW'
    except BaseException as error:
        report.update(status='FAILED_PARTIAL_NO_RETRY',error_type=type(error).__name__,traceback=traceback.format_exc());raise
    finally:signal.setitimer(signal.ITIMER_REAL,0);stop.set();checkpoint()


def public_summary(report,pack):
    # Deliberately only fixed enums, booleans, counts and hashes. Full timing,
    # module origins, raw text and output sizes stay in the private report.
    return dict(schema_version='analysis_optional_kernel_control_aggregate.v1',status=report['status'],
        api_commit=pack['api_commit'],optional_manifest_sha256=pack['optional_manifest_sha256'],
        model_loads_started=report.get('model_loads_started',0),model_loads=report.get('model_loads',0),
        model_calls_started=report.get('model_calls_started',0),new_generation=report.get('new_generation',0),
        new_training=0,retry=0,normal_adoption=False,next_training_initial_adoption=False,
        fast_vendor_bindings_verified=report.get('fast_vendor_bindings_verified',False),
        interpretation='KNOWN_DIAGNOSTIC_NO_GENERAL_SPEED_OR_QUALITY_RATE',
        cases=[{key:case[key] for key in ('id','phase','status','expected_fields','returned_field_ordinals','candidate_fields','raw_sha256','error_type') if key in case} for case in report.get('cases',[])])


def run(args):
    root,api=args.root,args.api;pack=read(root/'pack.json')
    assert read(root/'report.json')['status']=='PREPARED_CPU_ONLY' and pack['api_commit']==args.expected_api_head
    assert sha(root/'pack.json')==read(root/'prepare.json')['pack_sha256']
    assert sha(__file__)==pack['runner_sha256']==sha(root/'runner.py')
    assert pack['limits']==dict(max_seconds=240,max_new_generation=3,max_model_loads=1,warmup_seconds=90,timed_seconds=23,max_new_tokens=2048,context_tokens=8192,new_training=0,retry=0)
    assert not Path(str(root)+'.zip').exists()
    manifest=frozen_manifest(root/'optional_manifest.json',pack['optional_manifest_sha256'],Path(pack['target_root']),Path(pack['wheel_root']),args.expected_api_head)
    v8=helper(root/'v8_helpers.py');v8.check_api(api,args.expected_api_head,pack['source_hashes']);v8.check_adapter(Path(pack['adapter_path']))
    with (root/'run_started.json').open('x',encoding='utf-8') as output:json.dump(dict(pack_sha256=sha(root/'pack.json'),max_seconds=240),output)
    started=time.monotonic();deadline=started+LIMIT;failure=None;process=None
    report=dict(status='RUNNING_ISOLATED_OPTIONAL_RUNTIME',new_generation=0,new_training=0,normal_adoption=False)
    write(root/'report.json',report)
    try:
        assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True,timeout=5).strip()
        environment=dict(os.environ);environment['PYTHONPATH']=pack['target_root']
        with (root/'generation.log').open('x',encoding='utf-8') as log:
            process=subprocess.Popen([sys.executable,__file__,'_generate',str(api),str(root),'--expected-api-head',args.expected_api_head,'--deadline',str(deadline),'--pack-sha',sha(root/'pack.json')],stdout=log,stderr=subprocess.STDOUT,start_new_session=True,env=environment)
            try:code=process.wait(timeout=max(1,deadline-time.monotonic()-4))
            except subprocess.TimeoutExpired:
                os.killpg(process.pid,signal.SIGTERM)
                try:process.wait(timeout=2)
                except subprocess.TimeoutExpired:os.killpg(process.pid,signal.SIGKILL);process.wait(timeout=1)
                raise TimeoutError('bounded_optional_runtime_expired_no_retry')
        child=read(root/'generation.json');report['child_exit']=code
        assert code==0 and child['status']=='COMPLETE_KNOWN_DIAGNOSTIC_PENDING_RAW_REVIEW'
        report.update(child)
    except BaseException as error:
        failure=error;report.update(status='FAILED_PARTIAL_NO_RETRY',error_type=type(error).__name__,traceback=traceback.format_exc())
    finally:
        if process is not None and process.poll() is None:os.killpg(process.pid,signal.SIGKILL);process.wait(timeout=1)
        if (root/'generation.json').exists():
            child=read(root/'generation.json')
            for key in ('cases','model_loads_started','model_loads','model_calls_started','new_generation','strict_rejections','fast_vendor_bindings_verified','runtime_identity','vendor_binding_proof','runtime_preflight_seconds','model_load_seconds'):
                if key in child:report[key]=child[key]
        report['seconds']=time.monotonic()-started
        try:
            v8.check_api(api,args.expected_api_head,pack['source_hashes']);v8.check_adapter(Path(pack['adapter_path']))
            frozen_manifest(root/'optional_manifest.json',pack['optional_manifest_sha256'],Path(pack['target_root']),Path(pack['wheel_root']),args.expected_api_head)
            old=Path(pack['old_v8_source_root'])
            assert {path.name:sha(path) for path in old.iterdir() if path.is_file()}==pack['old_v8_file_sha256']
            report.update(base_sources_unchanged=True,adapter_unchanged=True,old_failed_v8_root_unchanged=True,optional_target_unchanged=True)
        except BaseException as error:
            report.update(status='FAILED_FINAL_IDENTITY_CHANGED',integrity_error_type=type(error).__name__)
            if failure is None:failure=error
        write(root/'report.json',report);write(root/'aggregate.json',public_summary(report,pack))
        print(canonical(dict(status=report['status'],archive=v8.archive(root))))
    if failure is not None:raise failure


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode',choices=('prepare','run','_generate'))
    parser.add_argument('api',type=Path);parser.add_argument('root',type=Path)
    parser.add_argument('--expected-api-head',required=True)
    for name in ('optional-manifest','target','wheels','v8-root','wire24-root'):parser.add_argument('--'+name,type=Path)
    parser.add_argument('--expected-manifest-sha');parser.add_argument('--deadline',type=float);parser.add_argument('--pack-sha')
    args=parser.parse_args();args.api=args.api.resolve();args.root=args.root.resolve()
    for name in ('optional_manifest','target','wheels','v8_root','wire24_root'):
        value=getattr(args,name)
        if value is not None:setattr(args,name,value.resolve())
    sys.dont_write_bytecode=True
    os.environ.update(HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1',HF_DATASETS_OFFLINE='1')
    if args.mode=='prepare':
        assert all(getattr(args,key) for key in ('optional_manifest','target','wheels','v8_root','wire24_root','expected_manifest_sha'))
        prepare(args)
    elif args.mode=='run':run(args)
    else:
        assert args.deadline and args.pack_sha
        generate(args)


if __name__=='__main__':main()
