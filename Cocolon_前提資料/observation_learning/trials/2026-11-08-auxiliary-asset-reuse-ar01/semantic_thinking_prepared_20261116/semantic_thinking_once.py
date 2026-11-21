"""A7: one bounded, untrained, same-input internal-mode comparison.

Preparation only. A new explicit authorization is required for upload and
execution. Neither an argument nor an existing A6/B6 authorization supplies it.
All original environment values stay in this Pod and are used only to restore
the unchanged provider. There is no training, retry, install or SQL write.
"""
import argparse
import gc
import hashlib
import json
import os
from pathlib import Path
import runpy
import shutil
import signal
import subprocess
import sys
import threading
import time

sys.dont_write_bytecode = True
ROOT = Path('/workspace/semantic-thinking-bounded-20261116-once')
OLD = Path('/workspace/semantic-alignment17-recovery-20261116-once')
PLAN = Path('/workspace/semantic_thinking_plan.json')
NATIVE = Path('/workspace/semantic_thinking_candidate.py')
HELPER = Path('/workspace/semantic_reader_base_control_once.py')
HELPER_SHA = 'f40a84cccdcd87bf65b6b2f4b221dca58ccf3bd13b2302dee6ff47d2e98fbb41'
CLIENT = Path('/workspace/semantic-history-20261115-once/client-runtime-deps')
CLIENT_TREE_SHA = '07c2ac87f67cdcc531966906085813fe125b8efbda81d2ab7907d0c200de1b41'
CORE_PATH = 'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py'
CORE_SHA = 'b489a2204dfe53aa0de30e3573d707af877c9eef62d410c710e706fafdcd80fa'
PLAN_SHA = 'da060a0c2750c2f614caee88c8007002b3aa26c171933a6d9a3a10fb3b53c93f'
MODEL = 'cocolon-qwen3.5-4b-analysis-bounded-thinking'


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def sha(path):
    return digest(Path(path).read_bytes())


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False)


def write(path, value):
    Path(path).write_text(canonical(value) + '\n')


def inputs(root, plan):
    """Reconstruct the five original requests, never their generated answers."""
    sys.path.insert(0, str(root / 'ai/services/ai_inference'))
    import analysis_semantic_map as app
    from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as core
    assert sha(core.__file__) == CORE_SHA
    pack = json.loads((OLD / 'plan.json').read_text())
    actual = json.loads((OLD / 'after.result.json').read_text())
    original = json.loads((OLD / 'A3.actual.result.json').read_text())
    rows = [dict(id=c['name'], owner=c['material']['owner'], snapshot=c['material']['snapshot'])
            for c in original['conditions']]
    rows += pack['heldouts'] + [pack['teachers'][0]]
    assert [r['id'] for r in rows] == plan['case_ids']
    assert [r['id'] for r in actual['calls']] == plan['case_ids']
    prepared = []
    for row, baseline in zip(rows, actual['calls']):
        current = app.prepare_semantic_map(row['owner'], row['snapshot'])
        assert current.request_ref == baseline['request_ref']
        assert current.messages() == baseline['messages']
        assert core.semantic_map_hash(current.messages()) == baseline['messages_sha256']
        assert digest(baseline['raw'].encode()) == baseline['raw_sha256']
        prepared.append((row, current, baseline))
    return app, core, prepared


def validate_originals(plan):
    assert sha(PLAN) == PLAN_SHA
    for name, expected in plan['a6_originals'].items():
        assert sha(OLD / name) == expected
    assert sha(NATIVE) == plan['candidate_native_sha256']
    assert sha(OLD / CORE_PATH) == CORE_SHA
    execution = json.loads((OLD / 'execution.json').read_text())
    assert execution['state'] == 'DIAGNOSTIC_FINISHED_NOT_ADOPTED'
    assert execution['original_provider_restored'] is True
    assert (execution['updates_completed'], execution['new_model_calls'], execution['retry']) == (34, 7, 0)
    assert execution['restored_pid'] == plan['original_provider_pid']
    assert execution['candidate'] == plan['candidate_adapter']
    adapter = plan['candidate_adapter']
    assert sha(Path(adapter['path']) / 'adapter_model.safetensors') == adapter['weights_sha256']
    assert sha(Path(adapter['path']) / 'adapter_config.json') == adapter['config_sha256']


def preflight(plan):
    _, core, rows = inputs(ROOT, plan)
    from transformers import AutoTokenizer
    tok = AutoTokenizer.from_pretrained(plan['model'], revision=plan['revision'],
        local_files_only=True, trust_remote_code=False)
    assert tok.convert_tokens_to_ids('</think>') == 248069
    counts = []
    for row, current, baseline in rows:
        old = tok.apply_chat_template(current.messages(), enable_thinking=False,
            add_generation_prompt=True, tokenize=True, return_dict=False, truncation=False)
        new = tok.apply_chat_template(current.messages(), enable_thinking=True,
            add_generation_prompt=True, tokenize=True, return_dict=False, truncation=False)
        assert tok.decode(old[-6:], skip_special_tokens=False).endswith('<think>\n\n</think>\n\n')
        assert tok.decode(new[-4:], skip_special_tokens=False).endswith('<think>\n')
        assert len(new) + 2048 + 4096 <= 32768
        counts.append(dict(id=row['id'], messages_sha256=core.semantic_map_hash(current.messages()),
            original_input_tokens=len(old), thinking_input_tokens=len(new),
            input_ids_sha256=digest(canonical(new).encode()), baseline_raw_sha256=baseline['raw_sha256']))
    write(ROOT / 'preflight.json', dict(state='PREFLIGHT_PASS_NOT_MODEL_QUALITY',
        model_loads=0, training=0, new_model_calls=0, rows=counts,
        thinking_budget=2048, final_json_budget=4096, context_tokens=32768))


def acquire(plan, seconds):
    started = time.monotonic()
    end = started + seconds
    def expired(*unused):
        raise TimeoutError('bounded_thinking_child_deadline')
    signal.signal(signal.SIGALRM, expired)
    signal.signal(signal.SIGTERM, expired)
    signal.setitimer(signal.ITIMER_REAL, seconds)
    app, core, rows = inputs(ROOT, plan)
    native = runpy.run_path(str(ROOT / 'native.py'))
    adapter = plan['candidate_adapter']
    result = dict(state='STARTED_NOT_ADOPTED', model=MODEL, effective_enable_thinking=True,
        baseline_enable_thinking=False, same_weights_and_messages=True, thinking_tokens=2048,
        final_json_tokens=4096, native_sha256=sha(ROOT / 'native.py'), plan_sha256=PLAN_SHA,
        adapter={k: adapter[k] for k in ('path', 'weights_sha256', 'config_sha256')},
        new_model_calls=0, training=0, retry=0, generation_seconds=0, calls=[],
        transport='DIRECT_CURRENT_NATIVE_NOT_HTTP_OR_PRODUCTION', reasoning_exported=False)
    def save():
        result['elapsed_seconds'] = time.monotonic() - started
        write(ROOT / 'after.result.json', result)
    save()
    generator = None
    try:
        generator = native['load_generator'](adapter['path'], threading.Event(),
            weights_sha256=adapter['weights_sha256'], config_sha256=adapter['config_sha256'],
            max_new_tokens=4096, context_tokens=32768, semantic_json=True, semantic_thinking_tokens=2048)
        for row, current, baseline in rows:
            assert result['new_model_calls'] < 5
            remaining = end - time.monotonic() - 10
            assert remaining > 1, 'bounded_thinking_total_budget_exhausted'
            call = dict(id=row['id'], request_ref=current.request_ref, messages=current.messages(),
                messages_sha256=core.semantic_map_hash(current.messages()),
                baseline_raw_sha256=baseline['raw_sha256'], state='STARTED')
            result['calls'].append(call)
            result['new_model_calls'] += 1
            save()
            begin = time.monotonic()
            try:
                raw, finish = generator(current.messages(), min(end - 10, begin + 300))
            except Exception as exc:
                call.update(state='NOT_GENERATED', failure_type=type(exc).__name__,
                    seconds=time.monotonic() - begin)
                save()
                raise
            elapsed = time.monotonic() - begin
            result['generation_seconds'] += elapsed
            call.update(state='RECEIVED', raw=raw, raw_sha256=digest(raw.encode()), finish_reason=finish,
                seconds=elapsed)
            save()
            if finish != 'stop':
                call.update(admission='NOT_GENERATED', failure_code='NON_STOP_RESPONSE')
                save()
                break
            response = core.AnalysisModelQuotedParentUnitsResponse(current.request_ref,
                core.semantic_map_hash(current.messages()), digest(raw.encode()), finish, raw)
            try:
                artifact, coverage = app.build_semantic_map(current, response)
                call.update(admission='GENERATED', coverage=coverage,
                    projection=artifact.safe_projection(authenticated_owner_scope=row['owner']),
                    text=artifact.safe_text_projection(authenticated_owner_scope=row['owner'])['text'],
                    private_evidence=artifact.private_evidence())
            except app.SemanticMapError as exc:
                call.update(admission='NOT_GENERATED', failure_code=str(exc))
                save()
                break
            save()
        if len(result['calls']) == 5 and all(c.get('admission') == 'GENERATED' for c in result['calls']):
            result['state'] = 'COMPLETE_NOT_ADOPTED_PENDING_MEANING_REVIEW'
        else:
            result['state'] = 'INCOMPLETE_NOT_ADOPTED'
    except BaseException as exc:
        result.update(state='INCOMPLETE_NOT_ADOPTED', failure_type=type(exc).__name__)
        raise
    finally:
        generator = None
        gc.collect()
        save()
        signal.setitimer(signal.ITIMER_REAL, 0)


def main():
    started = time.monotonic()
    assert not ROOT.exists(), 'single_use_root_already_exists'
    plan = json.loads(PLAN.read_text())
    validate_originals(plan)
    assert sha(HELPER) == HELPER_SHA
    helper = runpy.run_path(str(HELPER))
    pid = plan['original_provider_pid']
    proc = Path('/proc') / str(pid)
    argv = [v.decode() for v in (proc / 'cmdline').read_bytes().split(b'\0') if v]
    ticks = (proc / 'stat').read_text().split(') ', 1)[1].split()[19]
    assert str(ticks) == plan['original_provider_start_ticks']
    assert argv[1] == str(helper['SERVE']) and sha(helper['SERVE']) == helper['SERVE_SHA']
    assert helper['option'](argv, '--model-name') == helper['ADAPTER_MODEL']
    initial = plan['original_adapter']
    assert helper['option'](argv, '--adapter-weights-sha256') == initial['weights_sha256']
    assert helper['option'](argv, '--adapter-config-sha256') == initial['config_sha256']
    assert Path(helper['option'](argv, '--adapter')).resolve() == Path(initial['path']).resolve()
    assert sha(Path(initial['path']) / 'adapter_model.safetensors') == initial['weights_sha256']
    assert sha(Path(initial['path']) / 'adapter_config.json') == initial['config_sha256']
    env = dict(v.decode().split('=', 1) for v in (proc / 'environ').read_bytes().split(b'\0') if v)
    cwd = str((proc / 'cwd').resolve())
    proof = helper['verify_kernel_proof'](env)
    files = {str(p.relative_to(CLIENT)): sha(p) for p in sorted(CLIENT.rglob('*'))
        if p.is_file() and '__pycache__' not in p.parts and p.suffix != '.pyc'}
    assert len(files) == 408 and digest(canonical(files).encode()) == CLIENT_TREE_SHA
    ROOT.mkdir(mode=0o700)
    shutil.copytree(OLD / 'ai', ROOT / 'ai', ignore=shutil.ignore_patterns('__pycache__', '*.pyc'))
    for p in (p for p in (ROOT / 'ai').rglob('*') if p.is_file()):
        assert sha(p) == sha(OLD / p.relative_to(ROOT))
    shutil.copyfile(PLAN, ROOT / 'plan.json')
    shutil.copyfile(NATIVE, ROOT / 'native.py')
    shutil.copyfile(Path(__file__).resolve(), ROOT / 'driver.py')
    (ROOT / 'kernel-proof.json').write_bytes(proof)
    common = str(CLIENT) + (os.pathsep + env['PYTHONPATH'] if env.get('PYTHONPATH') else '')
    cpu_env = dict(env, PYTHONPATH=common, CUDA_VISIBLE_DEVICES='',
        PYTHONDONTWRITEBYTECODE='1', HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
    infer_env = dict(cpu_env, PYTHONPATH=str(helper['DEPS']) + os.pathsep + common,
        TRITON_CACHE_DIR=str(helper['CACHE']))
    infer_env.pop('CUDA_VISIBLE_DEVICES', None)
    if 'CUDA_VISIBLE_DEVICES' in env:
        infer_env['CUDA_VISIBLE_DEVICES'] = env['CUDA_VISIBLE_DEVICES']
    command = [argv[0], str(ROOT / 'driver.py')]
    with (ROOT / 'preflight.log').open('xb') as log:
        checked = subprocess.run(command + ['--phase', 'preflight'], cwd=ROOT, env=cpu_env,
            stdin=subprocess.DEVNULL, stdout=log, stderr=subprocess.STDOUT, timeout=80)
    assert checked.returncode == 0, 'thinking_preflight_failed_before_provider_stop'
    state = dict(state='PREPARED_NOT_ADOPTED', plan_sha256=PLAN_SHA, driver_sha256=sha(__file__),
        native_sha256=sha(NATIVE), core_sha256=CORE_SHA, original_provider_pid=pid,
        original_start_ticks=ticks, max_model_calls=5, new_model_calls=0, training=0, retry=0,
        native_request_seconds=300, work_seconds=1620, restore_inclusive_seconds=1800,
        candidate=plan['candidate_adapter'], original_provider_restored=False)
    def save():
        state['elapsed_seconds'] = time.monotonic() - started
        write(ROOT / 'execution.json', state)
    save()
    child = None
    stopped = False
    def expired(*unused):
        raise TimeoutError('thinking_total_deadline_restore_reserved')
    signal.signal(signal.SIGALRM, expired)
    signal.signal(signal.SIGTERM, expired)
    remaining = started + 1620 - time.monotonic()
    assert remaining > 5
    signal.setitimer(signal.ITIMER_REAL, remaining)
    try:
        assert (proc / 'stat').read_text().split(') ', 1)[1].split()[19] == ticks
        assert [v.decode() for v in (proc / 'cmdline').read_bytes().split(b'\0') if v] == argv
        assert dict(v.decode().split('=', 1) for v in (proc / 'environ').read_bytes().split(b'\0') if v) == env
        stopped = True
        helper['stop'](pid)
        remaining = started + 1620 - time.monotonic() - 5
        assert remaining > 5
        with (ROOT / 'after.log').open('xb') as log:
            child = subprocess.Popen(command + ['--phase', 'acquire', '--seconds', str(remaining)],
                cwd=ROOT, env=infer_env, stdin=subprocess.DEVNULL, stdout=log,
                stderr=subprocess.STDOUT, start_new_session=True)
            assert os.getsid(child.pid) == child.pid
            code = child.wait(timeout=remaining + 1)
        child = None
        state['child_exit'] = code
        result = json.loads((ROOT / 'after.result.json').read_text())
        state['new_model_calls'] = result['new_model_calls']
        state['after_sha256'] = sha(ROOT / 'after.result.json')
        state['state'] = ('DIAGNOSTIC_FINISHED_NOT_ADOPTED' if code == 0 and
            result['state'] == 'COMPLETE_NOT_ADOPTED_PENDING_MEANING_REVIEW' else 'DIAGNOSTIC_INCOMPLETE_NOT_ADOPTED')
        save()
    finally:
        signal.alarm(0)
        signal.signal(signal.SIGTERM, signal.SIG_IGN)
        try:
            if child is not None:
                helper['stop'](child.pid)
        finally:
            if stopped:
                with (ROOT / 'restored-provider.log').open('xb') as log:
                    restored = subprocess.Popen(argv, cwd=cwd, env=env, stdin=subprocess.DEVNULL,
                        stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
                state['restored_pid'] = restored.pid
                helper['health_wait'](60)
                restored_proc = Path('/proc') / str(restored.pid)
                assert [v.decode() for v in (restored_proc / 'cmdline').read_bytes().split(b'\0') if v] == argv
                assert dict(v.decode().split('=', 1) for v in (restored_proc / 'environ').read_bytes().split(b'\0') if v) == env
                assert str((restored_proc / 'cwd').resolve()) == cwd
                state['restored_start_ticks'] = (restored_proc / 'stat').read_text().split(') ', 1)[1].split()[19]
                assert sha(Path(initial['path']) / 'adapter_model.safetensors') == initial['weights_sha256']
                assert sha(Path(initial['path']) / 'adapter_config.json') == initial['config_sha256']
                state['original_provider_restored'] = True
            save()
            assert state['elapsed_seconds'] < 1800, 'thinking_restore_budget_exceeded'
    print(canonical({k: state[k] for k in ('state', 'new_model_calls', 'elapsed_seconds', 'original_provider_restored', 'restored_pid')}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--phase', choices=['preflight', 'acquire'])
    parser.add_argument('--seconds', type=float)
    args = parser.parse_args()
    if args.phase:
        plan = json.loads(PLAN.read_text())
        validate_originals(plan)
        if args.phase == 'preflight':
            preflight(plan)
        else:
            assert args.seconds and 1 < args.seconds <= 1620
            acquire(plan, args.seconds)
    else:
        main()
