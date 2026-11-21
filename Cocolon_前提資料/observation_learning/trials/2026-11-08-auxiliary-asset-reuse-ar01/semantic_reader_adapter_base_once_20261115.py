"""One private, non-adopted adapter/base diagnostic; exactly two POSTs at most."""
import ast
import hashlib
import json
import math
import os
from pathlib import Path
import shutil
import signal
import subprocess
import time
import urllib.request

ROOT = Path('/workspace/semantic-reader-adapter-base-20261115-once')
SOURCE = Path('/workspace/semantic-history-source-merge-20261115-once')
SERVE = Path('/workspace/new-fictional-self-piece4b-once-20261109/piece_ordered_server.py')
SERVE_SHA = 'ad3d301d2d1abd9226703dc72e3734eb8da79d8e0cf084d4b0666e97298370be'
NATIVE_SHA = '583a10e8bc25d0bf50e35e53dcfd9407963dc9575e6faac1199c5e5ab30c0c8a'
API_REV = 'dca20231ad1791c07a5011d6905340c78d4de0b3'
EXPECTED_PID = 117766
ADAPTER_MODEL = 'cocolon-qwen3.5-4b-analysis-semantic-120u'
BASE_MODEL = 'cocolon-qwen3.5-4b-analysis-base-851bf6e-candidate'
WEIGHTS = 'ecbdd0d113cfcdc38a17be4b17c708678c01c5071ae86c8a30ca9a5de5900495'
CONFIG = '4389a598b2815adb1a114053944bfc1214518065d9ce5f2e464baaf8181d6f4c'
INPUT = Path('/workspace/semantic-kernel-preparation-20261115/semantic-reader-diagnostic.input.json')
MESSAGES = Path('/workspace/semantic-kernel-preparation-20261115/semantic-reader-diagnostic.messages.json')
CAPACITY = Path('/workspace/semantic-kernel-preparation-20261115/semantic-reader-diagnostic.capacity.json')
INPUT_FILE_SHA = 'bb642569f2a1920735426905a6c1b5b9168af981770c4362d59a12dc6cf2ae0c'
MESSAGES_FILE_SHA = 'a2d9d7a545df2706f8b207be432e9c2f31ab546578af9c4cc23a50928a461cb9'
MESSAGES_SHA = '722924e92f50be6a9d55014fb35cfdaf736727b231a8e8ea6b5e0d9e666be931'
CAPACITY_SHA = 'b47a6cdf3fb7095e5d2a428f1ee5672a973c275e1f7cc3a028c0905bb4fa0a6c'
DEPS = Path('/workspace/semantic-kernel-deps-compat-20261115')
CACHE = Path('/workspace/semantic-kernel-cache-compat-20261115/triton')
PROOF = Path('/workspace/semantic-kernel-proof-ada-20261115.json')
PROOF_SHA = '28908c29ee066397bcc1a3326eefe41453ce159c11a90eec06f691932fc7675e'
DEPENDENCIES = {'fla-core': '0.4.1', 'einops': '0.8.2', 'causal-conv1d': '1.7.0'}
BASELINES = {'torch': '2.8.0+cu128', 'transformers': '5.19.0', 'triton': '3.4.0'}
PYTHONPATH_SUFFIX_SHA = 'f37f311013760c8286cc1b975f95f55d7407d1d0ab5c478afa62da34a140ac3c'
FILES = {
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py': '42fc2f04421c3a89241a6f940f15845d28439cadb059c5d69afd1af846ac6e56',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py': '138f54c9c8800e970bae69a81e2a696c45f7515687636daae0e5fa8085512f10',
    'ai/services/ai_inference/analysis_cumulative_service.py': '9e6eb77154ace9fb5b20fdd4630d5ab4b44c9d55e91cfd7512a11de67edda49e',
    'ai/services/ai_inference/analysis_model_source.py': 'c1106527165bfd6fd67e3ed1506178ba56c6ec16948f207f06c5816ec842cd35',
}


def digest(data):
    return hashlib.sha256(data).hexdigest()


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False)


def health_wait(seconds):
    end = time.monotonic() + seconds
    while time.monotonic() < end:
        try:
            with urllib.request.urlopen('http://127.0.0.1:8000/healthz', timeout=2) as response:
                if response.status == 200 and json.load(response).get('status') == 'ok':
                    return
        except Exception:
            pass
        time.sleep(1)
    raise RuntimeError('provider_health_unavailable')


def stop(pid):
    try:
        os.kill(pid, signal.SIGTERM)
    except ProcessLookupError:
        return
    for duration, force in ((20, False), (5, True)):
        if force:
            try:
                os.kill(pid, signal.SIGKILL)
            except ProcessLookupError:
                return
        end = time.monotonic() + duration
        while time.monotonic() < end:
            try:
                if (Path('/proc') / str(pid) / 'stat').read_text().split(') ', 1)[1].startswith('Z '):
                    return
            except FileNotFoundError:
                return
            time.sleep(.25)
    raise RuntimeError('provider_did_not_stop')


def patch_native(source):
    def once(old, new):
        nonlocal source
        assert source.count(old) == 1, 'native_patch_identity_changed'
        source = source.replace(old, new, 1)
    once("PIECE_CANDIDATE_FORMAT = 'piece.field_slots.v1'",
        "PIECE_CANDIDATE_FORMAT = 'piece.field_slots.v1'\nANALYSIS_BASE_MODEL = " + repr(BASE_MODEL))
    once('                request = json.loads(self.rfile.read(length))\n                messages = request["messages"]',
        '                request = json.loads(self.rfile.read(length))\n'
        '                analysis_base = request.get("model") == ANALYSIS_BASE_MODEL\n'
        '                if analysis_base:\n'
        '                    if natural:\n'
        '                        raise ValueError\n'
        '                    selected_model = ANALYSIS_BASE_MODEL\n'
        '                messages = request["messages"]')
    once('if natural else generate(messages, end))',
        'if natural else generate(messages, end, profile="analysis_base")\n'
        '                                if analysis_base else generate(messages, end))')
    once('if profile not in (None, "natural", "piece"):',
        'if profile not in (None, "natural", "piece", "analysis_base"):')
    once('            raise ValueError("piece_constraint_unavailable")',
        '            raise ValueError("piece_constraint_unavailable")\n'
        '        if profile == "analysis_base" and (not semantic_json or tokenizer_data is None or not adapter):\n'
        '            raise ValueError("analysis_constraint_unavailable")')
    once('base_inference_context(model) if base_profile and adapter else nullcontext()',
        'base_inference_context(model) if (base_profile or profile == "analysis_base") and adapter else nullcontext()')
    once('max_requests=0 if args.analysis_service else args.max_requests,',
        'max_requests=2 if args.analysis_service else args.max_requests,')
    once('                if not max_requests:\n                    generation_failure(exc)',
        '                generation_failure(exc)')
    compile(source, 'private_adapter_base_candidate.py', 'exec')
    return source


def dependency_tree():
    files = {str(path.relative_to(DEPS)): digest(path.read_bytes()) for path in sorted(DEPS.rglob('*'))
        if path.is_file() and '__pycache__' not in path.parts and path.suffix != '.pyc'}
    assert files and all(not name.split('/')[0].startswith(('torch', 'triton', 'transformers')) for name in files)
    return dict(file_count=len(files), sha256=digest(canonical(files).encode()))


def verify_kernel_proof(env):
    assert len(PROOF_SHA) == 64 and set(PROOF_SHA) <= set('0123456789abcdef'), 'successful_kernel_proof_pending'
    raw = PROOF.read_bytes()
    assert digest(raw) == PROOF_SHA
    proof = json.loads(raw)
    assert proof['schema'] == 'cocolon.analysis.kernel_warm_proof.v1' and proof['state'] == 'PASS'
    assert all(proof[key] is True for key in ('warm_completed', 'finite', 'baseline_unchanged', 'dependency_tree_unchanged'))
    assert proof['model_loaded'] is False and proof['weights_loaded'] is False
    assert proof['new_model_calls'] == proof['training'] == 0
    assert proof['deps_path'] == str(DEPS) and proof['cache_dir'] == str(CACHE)
    assert proof['dependency_versions'] == DEPENDENCIES and proof['baseline_versions'] == BASELINES
    assert proof['messages_sha256'] == MESSAGES_SHA and proof['input_tokens'] == 1752
    assert proof['gpu']['capability'] == [8, 9]
    assert proof['gpu']['name'] == 'NVIDIA RTX 4000 Ada Generation'
    assert proof['pythonpath_suffix_sha256'] == digest(env.get('PYTHONPATH', '').encode()) == PYTHONPATH_SUFFIX_SHA
    assert proof['baseline_sources_before'] == proof['baseline_sources_after']
    for row in proof['baseline_sources_before'].values():
        assert not Path(row['path']).resolve().is_relative_to(DEPS)
        assert digest(Path(row['path']).read_bytes()) == row['sha256']
    assert dependency_tree() == proof['dependency_tree_before'] == proof['dependency_tree_after']
    for name in ('chunk_gated_delta_rule', 'fused_recurrent_gated_delta_rule'):
        row = proof['kernel_imports'][name]
        assert row['dispatch_bound'] is True and row['module'].startswith('fla.ops.gated_delta_rule.')
        assert Path(row['path']).resolve().is_relative_to(DEPS / 'fla')
        assert digest(Path(row['path']).read_bytes()) == row['sha256']
        assert row['reference_module'] == 'transformers.models.qwen3_5.modeling_qwen3_5'
    for name in ('chunk_output', 'chunk_state', 'fused_recurrent_output', 'fused_recurrent_state'):
        row = proof['parity'][name]
        assert row['finite'] is True and row['allclose'] is True and row['tolerance'] == .005
        assert math.isfinite(row['rms_relative_error']) and math.isfinite(row['max_absolute_error'])
    causal = proof['causal_conv1d']
    assert causal['installed'] is True and causal['tested'] is True and causal['version'] == DEPENDENCIES['causal-conv1d']
    assert digest(Path(causal['extension']['path']).read_bytes()) == causal['extension']['sha256']
    for name in ('causal_conv1d_output', 'causal_conv1d_update_output', 'causal_conv1d_update_state'):
        assert proof['parity'][name]['finite'] is True and proof['parity'][name]['allclose'] is True
    assert proof['parity']['causal_conv1d_update_state']['exact_equal'] is True
    assert len(proof['warm_runs']) == 2 and all(row['finite'] is True and row['prefill_tokens'] == 1752
        and row['decode_tokens'] == 1 for row in proof['warm_runs'])
    assert proof['capacity_proof']['sha256'] == CAPACITY_SHA == digest(CAPACITY.read_bytes())
    assert digest(Path(proof['script']['path']).read_bytes()) == proof['script']['sha256']
    for name, default, expected in (('FLA_TRIL_PRECISION', 'ieee', 'ieee'), ('FLA_USE_FAST_OPS', '0', '0'), ('FLA_CI_ENV', '0', '0')):
        assert env.get(name, default) == expected
    return raw


def option(argv, name):
    matches = [i for i, value in enumerate(argv) if value == name or value.startswith(name + '=')]
    assert len(matches) <= 1
    if not matches:
        return None
    i = matches[0]
    return argv[i + 1] if argv[i] == name else argv[i].split('=', 1)[1]


def candidate_args(argv, candidate_path):
    args = [argv[0], str(candidate_path)] + argv[2:]
    for name, value, previous in (('--context-tokens', '32768', (None, '16384')),
        ('--request-seconds', '90', (None, '210')), ('--max-new-tokens', '4096', (None, '4096'))):
        assert option(argv, name) in previous
        indices = [i for i, part in enumerate(args) if part == name or part.startswith(name + '=')]
        if not indices:
            args += [name, value]
        elif args[indices[0]] == name:
            args[indices[0] + 1] = value
        else:
            args[indices[0]] = name + '=' + value
    return args


DRIVER = r'''import asyncio, hashlib, json, os, sys, time
from pathlib import Path
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / 'ai/services/ai_inference'))
import httpx
import analysis_semantic_map as app
import analysis_cumulative_service as service
from analysis_model_source import SelfHostedSemanticAnalysisModelSource
def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False)
async def main():
    material = json.loads((ROOT / 'semantic-reader-diagnostic.input.json').read_text())
    messages = json.loads((ROOT / 'semantic-reader-diagnostic.messages.json').read_text())
    assert material['all_fictional'] is True
    parent = app.prepare_semantic_map(material['owner'], material['snapshot'])
    assert parent.messages() == messages and service.prepare_semantic_history_batches(parent) == ()
    assert hashlib.sha256(canonical(messages).encode()).hexdigest() == '722924e92f50be6a9d55014fb35cfdaf736727b231a8e8ea6b5e0d9e666be931'
    key = next(line.split('=', 1)[1].strip() for line in Path('/workspace/analysis.env').read_text().splitlines()
        if line.startswith('COCOLON_ANALYSIS_MODEL_API_KEY='))
    assert len(key) >= 24
    os.environ['COCOLON_ANALYSIS_OBSERVED_MODE'] = 'development'
    result = dict(state='STARTED_NOT_ADOPTED', all_fictional=True, max_model_calls=2, new_model_calls=0,
        training=0, retry=0, pipeline_seconds=220, request_ref=parent.request_ref,
        input_sha256=hashlib.sha256(canonical(material).encode()).hexdigest(),
        messages_sha256=hashlib.sha256(canonical(messages).encode()).hexdigest(),
        acquisitions=[], conditions=[])
    started = time.monotonic()
    with (ROOT / 'semantic-reader-diagnostic.actual.result.json').open('x', encoding='utf-8') as output:
        def save():
            output.seek(0); output.truncate(); output.write(canonical(result) + '\n'); output.flush()
        save()
        async with httpx.AsyncClient(trust_env=False, follow_redirects=False) as client:
            try:
                async with asyncio.timeout(220):
                    for name, model in (('adapter_120u', 'cocolon-qwen3.5-4b-analysis-semantic-120u'),
                        ('base_disabled_adapter', 'cocolon-qwen3.5-4b-analysis-base-851bf6e-candidate')):
                        condition = dict(name=name, model=model, adapter_enabled=name == 'adapter_120u', state='STARTED')
                        result['conditions'].append(condition); save()
                        condition_posts = 0
                        async def forward(request):
                            nonlocal condition_posts
                            assert condition_posts == 0, 'condition_already_posted'
                            assert request.url.host == 'same-pod.invalid' and result['new_model_calls'] < 2
                            body = json.loads(request.content)
                            assert body['messages'] == messages and body['model'] == model
                            assert body['max_tokens'] == 4096 and body['temperature'] == 0 and body['stream'] is False
                            assert body['chat_template_kwargs'] == {'enable_thinking': False}
                            if result['acquisitions']:
                                assert {k:v for k,v in body.items() if k != 'model'} == {
                                    k:v for k,v in result['acquisitions'][0]['wire_request'].items() if k != 'model'}
                            row = dict(state='SENT', condition=name, model=model, wire_request=body,
                                started_seconds=time.monotonic()-started)
                            condition_posts += 1
                            condition['post_count'] = condition_posts
                            result['acquisitions'].append(row); result['new_model_calls'] += 1; save()
                            try:
                                reply = await client.post('http://127.0.0.1:8000/v1/chat/completions',
                                    headers={'Authorization':'Bearer '+key, 'Content-Type':'application/json',
                                        'Accept-Encoding':'identity'}, content=request.content,
                                    timeout=min(95, max(.001, 220-(time.monotonic()-started))))
                                assert len(reply.content) <= 262144
                                row.update(state='RECEIVED', status_code=reply.status_code, body=reply.text,
                                    elapsed_seconds=time.monotonic()-started); save()
                                return httpx.Response(reply.status_code, content=reply.content)
                            except BaseException:
                                row.update(state='FAILED_OR_ACK_UNKNOWN', elapsed_seconds=time.monotonic()-started); save(); raise
                        try:
                            source = SelfHostedSemanticAnalysisModelSource(endpoint='https://same-pod.invalid/v1/chat/completions',
                                model=model, api_key=key, transport=httpx.MockTransport(forward))
                            artifact, coverage = await service._semantic_history_map(source, parent)
                            condition.update(state='GENERATED', coverage=coverage,
                                projection=artifact.safe_projection(authenticated_owner_scope=material['owner']),
                                text=artifact.safe_text_projection(authenticated_owner_scope=material['owner'])['text'],
                                private_evidence=artifact.private_evidence())
                        except Exception as exc:
                            condition.update(state='NOT_GENERATED', failure_type=type(exc).__name__)
                            if hasattr(exc, 'status_code'): condition['failure_status'] = exc.status_code
                            if isinstance(exc, app.SemanticMapError): condition['failure_code'] = str(exc)
                        save()
                assert result['new_model_calls'] == len(result['acquisitions']) == 2
                result['state'] = 'COMPLETE_NOT_ADOPTED_PENDING_MEANING_REVIEW'
            except BaseException as exc:
                result.update(state='INCOMPLETE_NOT_ADOPTED', failure_type=type(exc).__name__)
                raise
            finally:
                result['elapsed_seconds'] = time.monotonic()-started; save()
    print(canonical({k: result[k] for k in ('state','new_model_calls','elapsed_seconds')}))
asyncio.run(main())
'''


def main():
    started = time.monotonic()
    assert not ROOT.exists(), 'one_shot_root_already_exists'
    assert digest(SERVE.read_bytes()) == SERVE_SHA
    closed = json.loads((SOURCE / 'execution.json').read_text())
    assert closed['api_commit'] == API_REV and closed['original_provider_restored'] is True
    assert closed['restored_pid'] == EXPECTED_PID and closed['candidate_source_sha256'] == NATIVE_SHA
    original = (SOURCE / 'candidate_server.py').read_bytes(); assert digest(original) == NATIVE_SHA
    for path, expected in FILES.items(): assert digest((SOURCE / path).read_bytes()) == expected
    for path, expected in ((INPUT, INPUT_FILE_SHA), (MESSAGES, MESSAGES_FILE_SHA), (CAPACITY, CAPACITY_SHA)):
        assert digest(path.read_bytes()) == expected
    capacity = json.loads(CAPACITY.read_text())
    assert capacity['messages_sha256'] == MESSAGES_SHA and capacity['input_tokens'] == 1752
    assert capacity['new_model_calls'] == 0 and capacity['model_loaded'] is False
    proc = Path('/proc') / str(EXPECTED_PID)
    argv = [v.decode() for v in (proc/'cmdline').read_bytes().split(b'\0') if v]
    assert argv[1] == str(SERVE) and '--analysis-service' in argv and '--semantic-json' in argv
    assert option(argv, '--model-name') == ADAPTER_MODEL
    assert option(argv, '--adapter-weights-sha256') == WEIGHTS and option(argv, '--adapter-config-sha256') == CONFIG
    adapter = Path(option(argv, '--adapter'))
    assert digest((adapter/'adapter_model.safetensors').read_bytes()) == WEIGHTS
    assert digest((adapter/'adapter_config.json').read_bytes()) == CONFIG
    env = dict(v.decode().split('=',1) for v in (proc/'environ').read_bytes().split(b'\0') if v)
    cwd = str((proc/'cwd').resolve())
    proof_raw = verify_kernel_proof(env)
    candidate = patch_native(original.decode())
    ROOT.mkdir(mode=0o700)
    shutil.copytree(SOURCE/'ai', ROOT/'ai')
    for path in (p for p in (SOURCE/'ai').rglob('*') if p.is_file() and '__pycache__' not in p.parts):
        assert digest(path.read_bytes()) == digest((ROOT/path.relative_to(SOURCE)).read_bytes())
    for source, name in ((INPUT,'semantic-reader-diagnostic.input.json'), (MESSAGES,'semantic-reader-diagnostic.messages.json'),
        (CAPACITY,'semantic-reader-diagnostic.capacity.json')): shutil.copyfile(source, ROOT/name)
    (ROOT/'kernel-warm-proof.json').write_bytes(proof_raw)
    candidate_path = ROOT/'private_adapter_base_candidate.py'; candidate_path.write_text(candidate)
    driver_path = ROOT/'semantic_reader_diagnostic_driver.py'; driver_path.write_text(DRIVER)
    compile(DRIVER, str(driver_path), 'exec')
    suffix = env.get('PYTHONPATH','')
    candidate_env = dict(env, PYTHONPATH=str(DEPS)+(os.pathsep+suffix if suffix else ''),
        TRITON_CACHE_DIR=str(CACHE), PYTHONDONTWRITEBYTECODE='1')
    driver_env = dict(env, PYTHONPATH='/workspace/semantic-history-20261115-once/client-runtime-deps', PYTHONDONTWRITEBYTECODE='1')
    state = dict(state='PREPARED_NOT_ADOPTED', api_commit=API_REV, original_native_sha256=NATIVE_SHA,
        private_probe_variant_sha256=digest(candidate.encode()), kernel_proof_sha256=digest(proof_raw),
        messages_sha256=MESSAGES_SHA, capacity_sha256=CAPACITY_SHA, input_tokens=1752,
        adapter_model=ADAPTER_MODEL, base_model=BASE_MODEL, weights_sha256=WEIGHTS, config_sha256=CONFIG,
        max_model_calls=2, training=0, retry=0, native_request_seconds=90, driver_seconds=220,
        acquisition_seconds=300, outer_seconds=420, original_provider_restored=False)
    def save(): (ROOT/'execution.json').write_text(canonical(state)+'\n')
    save()
    def deadline(*args): raise TimeoutError('diagnostic_deadline_restore_reserved')
    signal.signal(signal.SIGALRM, deadline); signal.signal(signal.SIGTERM, deadline)
    remaining = started+300-time.monotonic(); assert remaining > 0
    signal.setitimer(signal.ITIMER_REAL, remaining)
    child = None; original_stopped = False
    try:
        original_stopped = True; stop(EXPECTED_PID)
        with (ROOT/'candidate-provider.log').open('xb') as log:
            child = subprocess.Popen(candidate_args(argv,candidate_path), cwd=cwd, env=candidate_env,
                stdin=subprocess.DEVNULL,stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
        state.update(state='ACTIVATED_NOT_ADOPTED',candidate_pid=child.pid); save(); health_wait(45)
        with (ROOT/'driver.log').open('xb') as log:
            done = subprocess.run([argv[0],str(driver_path)],cwd=ROOT,env=driver_env,stdin=subprocess.DEVNULL,
                stdout=log,stderr=subprocess.STDOUT,timeout=min(230,max(.001,started+300-time.monotonic())))
        state.update(state='DIAGNOSTIC_FINISHED_NOT_ADOPTED',driver_exit=done.returncode); save()
    finally:
        signal.alarm(0); signal.signal(signal.SIGTERM,signal.SIG_IGN)
        try:
            if child is not None: stop(child.pid)
        finally:
            try:
                if original_stopped:
                    with (ROOT/'restored-provider.log').open('xb') as log:
                        restored = subprocess.Popen(argv,cwd=cwd,env=env,stdin=subprocess.DEVNULL,
                            stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
                    state['restored_pid']=restored.pid; health_wait(45); state['original_provider_restored']=True
            finally:
                state['elapsed_seconds']=time.monotonic()-started; save()
                assert state['elapsed_seconds'] < 420, 'restore_budget_exceeded'
    print(canonical(state))


if __name__ == '__main__':
    main()
