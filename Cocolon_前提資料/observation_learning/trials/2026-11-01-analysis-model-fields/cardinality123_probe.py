"""One-shot v7 whole-record cardinality diagnostic, using existing local assets.

No training, downloads, production writes, retries, or raw-output repairs.
The shared 60-second model phase includes one load and all three requests.
CPU preparation and private postprocessing are separately measured.
"""
from dataclasses import asdict, replace
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import threading
import time
import traceback
import zipfile

PRIOR = Path('/workspace/analysis-optional-kernel-control-v2-20261105')
API = Path('/workspace/analysis-v8-fieldcount-runtime')
ROOT = Path('/workspace/analysis-cardinality123-20261106')
PROFILE = 'selected_material.v7'


def load(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False)


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write(path, value):
    tmp = path.with_name(path.name + '.tmp')
    tmp.write_text(canonical(value) + '\n', encoding='utf-8')
    tmp.replace(path)


def dependencies():
    prior = read(PRIOR/'pack.json')
    assert sha(PRIOR/'runner.py') == prior['runner_sha256']
    helper = load(PRIOR/'runner.py', 'existing_optional_runtime_reader')
    v8 = helper.helper(PRIOR/'v8_helpers.py')
    manifest = helper.frozen_manifest(PRIOR/'optional_manifest.json', prior['optional_manifest_sha256'],
        Path(prior['target_root']), Path(prior['wheel_root']), prior['api_commit'])
    v8.check_api(API, prior['api_commit'], prior['source_hashes'])
    v8.check_adapter(Path(prior['adapter_path']))
    return prior, helper, v8, manifest


def imports(v8):
    service, semantic, probe = v8.imports(API)
    sys.path.insert(0, str(API/'ai/tests'))
    from test_analysis_cumulative import OWNER, source_snapshot
    return service, semantic, probe, OWNER, source_snapshot


def prepare():
    assert not ROOT.exists() and not Path(str(ROOT)+'.zip').exists()
    started = time.monotonic()
    prior, helper, v8, manifest = dependencies()
    service, semantic, probe, owner, source_snapshot = imports(v8)
    from transformers import AutoTokenizer
    import httpx
    tokenizer = AutoTokenizer.from_pretrained(probe.MODEL, revision=probe.REVISION,
        local_files_only=True, trust_remote_code=False)
    rows = []
    parent = source_snapshot(20)
    for n in (1, 2, 3):
        snapshot = source_snapshot(n)
        assert snapshot['members'] == parent['members'][:n]
        assert {k:v for k,v in snapshot.items() if k!='members'} == {k:v for k,v in parent.items() if k!='members'}
        prepared = service.prepare_cumulative_category_units(owner, snapshot, prompt_version=PROFILE)
        descriptor = v8.descriptor(semantic, prepared)
        tokens = tokenizer.apply_chat_template(prepared.messages(), enable_thinking=False,
            add_generation_prompt=True, tokenize=True, return_dict=False, truncation=False)
        body = httpx.Request('POST', 'https://localhost/v1/chat/completions', json=dict(
            model=probe.MODEL, messages=prepared.messages(), temperature=0, max_tokens=2048,
            stream=False, chat_template_kwargs={'enable_thinking':False})).content
        assert descriptor['field_count']==n and len(tokens)+2048<=8192 and len(body)<=65536
        rows.append(dict(id='N'+str(n), records=n, snapshot=snapshot, input=descriptor,
            prompt_tokens=len(tokens), token_sha256=helper.digest(tokens), request_bytes=len(body),
            request_sha256=hashlib.sha256(body).hexdigest()))
    helper.environment_identity(manifest, Path(prior['target_root']), with_optional=False)
    ROOT.mkdir()
    (ROOT/'runner.py').write_bytes(Path(__file__).read_bytes())
    pack=dict(schema_version='analysis_cardinality123_probe.v1', api_commit=prior['api_commit'],
        source_hashes=prior['source_hashes'], runner_sha256=sha(Path(__file__)),
        prior_pack_sha256=sha(PRIOR/'pack.json'), prior_runner_sha256=sha(PRIOR/'runner.py'),
        manifest_sha256=prior['optional_manifest_sha256'], adapter_path=prior['adapter_path'],
        weights_sha256=helper.WEIGHTS, config_sha256=helper.CONFIG,
        target_root=prior['target_root'], owner=owner, model=probe.MODEL, revision=probe.REVISION,
        profile=PROFILE, cases=rows, limits=dict(model_seconds=60, per_call_seconds=23,
            loads=1, calls=3, max_new_tokens=2048, context_tokens=8192, body_bytes=65536),
        normal_adoption=False, new_training=0, retry=0,
        interpretation='Repeated known B20 fixture prefixes; not independent ordinary-prose quality examples.')
    write(ROOT/'pack.json',pack)
    write(ROOT/'prepare.json',dict(status='PREPARED_CPU_ONLY', seconds=time.monotonic()-started,
        pack_sha256=sha(ROOT/'pack.json'), runner_sha256=sha(ROOT/'runner.py'),
        budgets=[{k:r[k] for k in ('id','records','prompt_tokens','request_bytes')} for r in rows]))
    print(canonical(read(ROOT/'prepare.json')),flush=True)


def generate():
    pack=read(ROOT/'pack.json')
    assert sha(Path(__file__))==pack['runner_sha256']
    prior,helper,v8,manifest=dependencies()
    assert sha(PRIOR/'pack.json')==pack['prior_pack_sha256']
    assert os.environ.get('PYTHONPATH')==pack['target_root']
    service,semantic,probe,owner,source_snapshot=imports(v8)
    helper.environment_identity(manifest,Path(pack['target_root']),with_optional=True)
    _,bindings=helper.vendor_bindings(manifest,Path(pack['target_root']))
    report=dict(status='MODEL_PHASE_STARTING',model_loads_started=0,model_loads=0,
        model_calls_started=0,new_generation=0,new_training=0,cases=[])
    stop=threading.Event()
    started=time.monotonic(); deadline=started+60
    def checkpoint():
        report['model_phase_seconds']=time.monotonic()-started
        write(ROOT/'generation.json',report)
    try:
        report['model_loads_started']=1;checkpoint()
        signal.signal(signal.SIGALRM,signal.SIG_DFL)
        signal.setitimer(signal.ITIMER_REAL,max(.001,deadline-time.monotonic()))
        generator=probe.load_generator(pack['adapter_path'],stop,
            weights_sha256=pack['weights_sha256'],config_sha256=pack['config_sha256'])
        report['model_loads']=1;report['load_seconds']=time.monotonic()-started;checkpoint()
        assert helper.vendor_bindings(manifest,Path(pack['target_root']))[1]==bindings
        for row in pack['cases']:
            prepared=service.prepare_cumulative_category_units(owner,row['snapshot'],prompt_version=PROFILE)
            assert canonical(v8.descriptor(semantic,prepared))==canonical(row['input'])
            end=min(deadline,time.monotonic()+23)
            assert end>time.monotonic()
            entry=dict(id=row['id'],status='STARTED',expected_fields=row['records'])
            report['cases'].append(entry);report['model_calls_started']+=1;checkpoint()
            called=time.monotonic();signal.setitimer(signal.ITIMER_REAL,max(.001,end-called))
            try: raw,finish=generator(prepared.messages(),end)
            finally: signal.setitimer(signal.ITIMER_REAL,0)
            returned=time.monotonic()
            response=semantic.AnalysisModelQuotedParentUnitsResponse(prepared.request_ref,
                helper.digest(prepared.messages()),hashlib.sha256(raw.encode()).hexdigest(),finish,raw)
            (ROOT/(row['id']+'.raw.txt')).write_text(raw,encoding='utf-8')
            write(ROOT/(row['id']+'.response.json'),asdict(response))
            report['new_generation']+=1
            entry.update(status='RAW_RECEIVED',finish_reason=finish,seconds=returned-called,
                raw_sha256=response.raw_sha256,raw_bytes=len(raw.encode()),raw_characters=len(raw))
            checkpoint()
            assert finish=='stop' and returned<=end,'late_or_incomplete_raw_preserved'
            try:
                packet=semantic._load(raw)
                entry['returned_fields']=[f.get('field') for f in packet.get('fields',[])]
                bound=replace(prepared,response=response)
                candidate=semantic.generate_analysis_model_quoted_parent_units(prepared.request,bound)
                state=semantic.serialize_analysis_model_quoted_parent_units(bound,candidate)
                (ROOT/(row['id']+'.candidate.private.json')).write_text(state,encoding='utf-8')
                with v8.replay_guard(semantic):
                    assert semantic.reload_analysis_model_quoted_parent_units(prepared,state)==candidate
                entry.update(status='CANDIDATE_PRESERVED',private_non_generating_replay=True)
            except (semantic.AnalysisSemanticError,KeyError,TypeError,ValueError,AttributeError) as error:
                entry.update(status='STRICT_REJECTED',error_type=type(error).__name__,error=str(error))
            checkpoint()
        report['status']='COMPLETE_PENDING_RAW_REVIEW'
    except BaseException as error:
        report.update(status='FAILED_PARTIAL_NO_RETRY',error_type=type(error).__name__,traceback=traceback.format_exc())
        raise
    finally:
        signal.setitimer(signal.ITIMER_REAL,0);stop.set();checkpoint()


def run():
    pack=read(ROOT/'pack.json')
    assert read(ROOT/'prepare.json')['pack_sha256']==sha(ROOT/'pack.json')
    assert not (ROOT/'run_started.json').exists()
    assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory',
        '--format=csv,noheader'],text=True,timeout=5).strip()
    write(ROOT/'run_started.json',dict(started=True,shared_model_seconds=60,planned_calls=3))
    started=time.monotonic()
    env=dict(os.environ);env['PYTHONPATH']=pack['target_root']
    with (ROOT/'generation.log').open('x') as log:
        process=subprocess.Popen([sys.executable,str(ROOT/'runner.py'),'_generate'],
            env=env,stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
        try:code=process.wait(timeout=90)
        except subprocess.TimeoutExpired:
            os.killpg(process.pid,signal.SIGKILL);code=process.wait(timeout=5)
    report=read(ROOT/'generation.json') if (ROOT/'generation.json').exists() else dict(status='FAILED_BEFORE_MODEL_PHASE')
    report.update(child_exit=code,wall_seconds=time.monotonic()-started,
        primary_outcome='BLOCKER_NARROWED',normal_adoption=False,retry=0)
    if code!=0:report['status']='FAILED_PARTIAL_NO_RETRY'
    prior,helper,v8,manifest=dependencies()
    assert sha(PRIOR/'pack.json')==pack['prior_pack_sha256']
    report.update(source_and_adapter_unchanged=True,
        optional_target_unchanged=helper.installed_files(Path(pack['target_root']))==manifest['installed_files'])
    write(ROOT/'report.json',report)
    write(ROOT/'manifest.json',{str(p.relative_to(ROOT)):dict(bytes=p.stat().st_size,sha256=sha(p))
        for p in sorted(ROOT.rglob('*')) if p.is_file() and p.name!='manifest.json'})
    with zipfile.ZipFile(str(ROOT)+'.zip','x',zipfile.ZIP_DEFLATED) as z:
        for path in sorted(ROOT.rglob('*')):
            if path.is_file():z.write(path,str(path.relative_to(ROOT)))
    print(canonical(report),flush=True)
    if code!=0:raise SystemExit(1)


if __name__=='__main__':
    sys.dont_write_bytecode=True
    os.environ.update(HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1',HF_DATASETS_OFFLINE='1')
    {'prepare':prepare,'run':run,'_generate':generate}[sys.argv[1]]()
