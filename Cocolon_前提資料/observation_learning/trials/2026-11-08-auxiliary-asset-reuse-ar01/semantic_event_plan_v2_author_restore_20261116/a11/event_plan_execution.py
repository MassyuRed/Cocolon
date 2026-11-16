"""A9/B9 local preparation: no training, automatic retry or SQL finalization.

Launch only under a new explicit approval of the exact scope bytes. Existing
credentials and complete provider environment remain inside the same Pod.
B9 additionally requires an actual independent full A9 meaning review.
"""
import argparse
import asyncio
import hashlib
import json
import os
from pathlib import Path
import runpy
import shutil
import signal
import subprocess
import sys

if sys.flags.optimize:
    raise RuntimeError('unoptimized_python_required_for_bound_execution')
import time
import urllib.request
import zipfile

sys.dont_write_bytecode = True
PAYLOAD = Path(__file__).resolve().parent
SCOPE_FILE = PAYLOAD / 'execution_scope.json'
ROOTS = {'A9': Path('/workspace/semantic-event-plan-v2-diagnostic-a11-20261116-once'),
         'B9': Path('/workspace/semantic-event-plan-v2-full12-b11-20261116-once')}
PROFILE = 'semantic_map.event_plan.v2'
MODEL = 'cocolon-qwen3.5-4b-analysis-event-plan-v2'
HELPER = Path('/workspace/semantic_reader_base_control_once.py')
HELPER_SHA = 'f40a84cccdcd87bf65b6b2f4b221dca58ccf3bd13b2302dee6ff47d2e98fbb41'
CLIENT = Path('/workspace/semantic-history-20261115-once/client-runtime-deps')
CLIENT_SHA = '07c2ac87f67cdcc531966906085813fe125b8efbda81d2ab7907d0c200de1b41'
INFERENCE = 'ai/services/ai_inference'
NATIVE = 'ai/tools/serve_emlis_natural_reply.py'
TRIAL_HOST = '127.0.0.1'
TRIAL_PORT = 18008


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False)


def digest(value):
    return hashlib.sha256(value).hexdigest()


def sha(path):
    return digest(Path(path).read_bytes())


def write(path, value):
    Path(path).write_text(canonical(value) + '\n', encoding='utf-8')


def option(argv, name):
    positions = [i for i, p in enumerate(argv) if p == name or p.startswith(name + '=')]
    assert len(positions) <= 1
    if not positions:
        return None
    i = positions[0]
    return argv[i + 1] if argv[i] == name else argv[i].split('=', 1)[1]


def candidate_args(argv, native, scope):
    """Keep default Analysis/IF and natural/Piece arguments unchanged."""
    result = [argv[0], str(native), *argv[2:]]
    for name in ('--event-plan-model', '--event-plan-adapter',
                 '--event-plan-adapter-weights-sha256', '--event-plan-adapter-config-sha256'):
        assert option(argv, name) is None, 'original_event_plan_must_be_absent'
    for name, value in (('--port', str(TRIAL_PORT)), ('--context-tokens', '32768'), ('--max-new-tokens', '4096'),
                        ('--request-seconds', '210')):
        positions = [i for i, p in enumerate(result) if p == name or p.startswith(name + '=')]
        if not positions:
            result.extend([name, value])
        elif result[positions[0]] == name:
            result[positions[0] + 1] = value
        else:
            result[positions[0]] = name + '=' + value
    adapter = scope['candidate_adapter']
    result.extend(['--event-plan-model', MODEL, '--event-plan-adapter', adapter['path'],
        '--event-plan-adapter-weights-sha256', adapter['weights_sha256'],
        '--event-plan-adapter-config-sha256', adapter['config_sha256']])
    for name in ('--model-name', '--adapter', '--adapter-weights-sha256',
                 '--adapter-config-sha256', '--natural-reply-model', '--piece-adapter',
                 '--piece-adapter-weights-sha256', '--piece-adapter-config-sha256'):
        assert option(result, name) == option(argv, name)
    assert '--analysis-service' in result and '--semantic-json' in result
    assert option(result, '--max-requests') is None and option(result, '--semantic-thinking-tokens') is None
    return result


def scope_read(expected):
    assert sha(SCOPE_FILE) == expected, 'exact_new_scope_mismatch'
    scope = json.loads(SCOPE_FILE.read_text())
    assert scope['state'] == 'PREPARED_NOT_EXECUTED_REQUIRES_NEW_EXPLICIT_APPROVAL'
    assert scope['profile'] == PROFILE and scope['model_alias'] == MODEL
    for name, row in scope['payload_files'].items():
        p = PAYLOAD / name
        assert p.is_file() and p.stat().st_size == row['bytes'] and sha(p) == row['sha256']
    return scope


def install_sources(root, scope):
    manifest = json.loads((PAYLOAD / 'source_manifest.json').read_text())
    entries = manifest['sources']
    if isinstance(entries, list):
        entries = {row['path']: row for row in entries}
    with zipfile.ZipFile(PAYLOAD / 'current_api_sources.zip') as archive:
        assert set(archive.namelist()) == set(entries)
        for name, row in entries.items():
            assert not Path(name).is_absolute() and '..' not in Path(name).parts
            raw = archive.read(name)
            assert len(raw) == row['bytes'] and digest(raw) == row['sha256']
            path = root / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(raw)
    assert sha(root / NATIVE) == scope['candidate_native_sha256']


def material(root, unit):
    sys.path.insert(0, str(root / INFERENCE))
    import analysis_semantic_map as app
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as core
    if unit == 'A9':
        cases = json.loads((PAYLOAD / 'input_cases.json').read_text())['cases']
        proof = json.loads((PAYLOAD / 'diagnostic_preparation.json').read_text())
        rows = []
        for row, expected in zip(cases, proof['cases'], strict=True):
            assert row['id'] == expected['id']
            prepared = app.prepare_semantic_map(row['owner'], row['snapshot'], prompt_version=PROFILE)
            assert prepared.request_ref == expected['request_ref']
            assert prepared.messages() == expected['messages']
            assert core.semantic_map_hash(prepared.messages()) == expected['messages_sha256']
            rows.append((row, prepared))
        assert len(rows) == 5
        return app, core, rows
    source = json.loads((PAYLOAD / 'full12.input.json').read_text())
    assert source['all_fictional'] is True and len(source['snapshot']['members']) == 12
    parent = app.prepare_semantic_map(source['owner'], source['snapshot'], prompt_version=PROFILE)
    stages = service.prepare_semantic_history_batches(parent)
    proof = json.loads((PAYLOAD / 'full12_pre_acquisition.plan.json').read_text())
    assert parent.request_ref == proof['parent_request_ref'] and parent.source_guard == proof['source_guard']
    assert parent.prompt_version == proof['prompt_version'] == PROFILE
    assert [s.request_ref for s in stages] == [s['request_ref'] for s in proof['leaf_stages']]
    assert [core.semantic_map_hash(s.messages()) for s in stages] == [s['messages_sha256'] for s in proof['leaf_stages']]
    assert 1 <= len(stages) == proof['leaf_count'] <= 12
    assert proof['actual_fresh_model_calls_required'] == len(stages) + 1
    assert sum(len(s.record_refs) for s in stages) == 12
    return app, core, (source, parent, stages)


def provider(root, unit, scope):
    """Run the published native behind a finite loopback-only trial wrapper.

    Wrapper settings are process-local; native source and normal defaults are
    unchanged. Provider args and credentials never leave this Pod.
    """
    assert sha(root / NATIVE) == scope['candidate_native_sha256']
    native = runpy.run_path(str(root / NATIVE))
    main = native['main']
    namespace = main.__globals__
    original_handler = namespace['make_handler']
    original_server = namespace['ThreadingHTTPServer']
    limit = scope['units'][unit]['max_model_calls']
    def bounded_handler(*args, **kwargs):
        assert kwargs['max_requests'] == 0
        kwargs['max_requests'] = limit
        return original_handler(*args, **kwargs)
    def loopback_server(address, handler):
        assert address == ('0.0.0.0', TRIAL_PORT)
        return original_server((TRIAL_HOST, TRIAL_PORT), handler)
    namespace['make_handler'] = bounded_handler
    namespace['ThreadingHTTPServer'] = loopback_server
    args = json.loads((root / 'provider.argv.json').read_text())
    assert args[1] == str(root / NATIVE) and option(args, '--port') == str(TRIAL_PORT)
    assert option(args, '--event-plan-model') == MODEL
    sys.argv = args[1:]
    main()


def trial_health_wait(child, expected_argv, seconds):
    end = time.monotonic() + seconds
    while time.monotonic() < end:
        assert child.poll() is None, 'candidate_provider_exited'
        proc = Path('/proc') / str(child.pid)
        observed = [v.decode() for v in (proc / 'cmdline').read_bytes().split(b'\0') if v]
        # A live child can briefly expose an empty cmdline during exec. It is
        # not ready: wait inside the same deadline without touching its socket.
        if not observed:
            time.sleep(min(0.05, max(0, end - time.monotonic())))
            continue
        assert observed == expected_argv, ('candidate_provider_argv_changed_nonempty:'
            + str(len(observed)) + ':' + digest(canonical(observed).encode()))
        sockets = set()
        for descriptor in (proc / 'fd').iterdir():
            try:
                target = descriptor.readlink().name
            except FileNotFoundError:
                continue
            if target.startswith('socket:['):
                sockets.add(target[8:-1])
        endpoint = '0100007F:' + format(TRIAL_PORT, '04X')
        owned = any(row[1] == endpoint and row[3] == '0A' and row[9] in sockets
                    for line in Path('/proc/net/tcp').read_text().splitlines()[1:]
                    if len(row := line.split()) > 9)
        if not owned:
            time.sleep(1)
            continue
        try:
            with urllib.request.urlopen(f'http://{TRIAL_HOST}:{TRIAL_PORT}/healthz', timeout=2) as response:
                if response.status == 200 and json.load(response).get('status') == 'ok':
                    assert child.poll() is None
                    return
        except (OSError, ValueError):
            pass
        time.sleep(1)
    raise RuntimeError('candidate_provider_health_unavailable')


def preflight(root, unit, scope):
    app, core, values = material(root, unit)
    limits = scope['units'][unit]
    map_calls = len(values) if unit == 'A9' else len(values[2]) + 1
    assert limits['max_map_calls'] == map_calls
    assert limits['max_control_calls'] == 4 and limits['max_model_calls'] == map_calls + 4
    if unit == 'B9':
        assert limits['fresh_leaves'] == len(values[2]) and limits['fresh_merge'] == 1
    from transformers import AutoTokenizer
    tok = AutoTokenizer.from_pretrained(scope['model'], revision=scope['revision'],
        local_files_only=True, trust_remote_code=False)
    native = runpy.run_path(str(root / NATIVE))
    prepared_rows = [p for _, p in values] if unit == 'A9' else list(values[2])
    counts = []
    for prepared in prepared_rows:
        messages = prepared.messages()
        ids = tok.apply_chat_template(messages, enable_thinking=False,
            add_generation_prompt=True, tokenize=True, return_dict=False, truncation=False)
        assert len(ids) + 4096 <= 32768
        schema = native['semantic_output_schema'](messages)
        assert schema['properties']['schema_version']['enum'] == [native['EVENT_PLAN_V2_SCHEMA']]
        counts.append(dict(request_ref=prepared.request_ref, messages_sha256=core.semantic_map_hash(messages),
            input_tokens=len(ids), reserved_output_tokens=4096, context_tokens=32768,
            input_plus_output_tokens=len(ids) + 4096))
    result = dict(state='PREFLIGHT_PASS_NOT_MODEL_QUALITY', unit=unit, profile=PROFILE,
        model_loaded=False, new_model_calls=0, training=0, rows=counts,
        model_alias=MODEL, enable_thinking=False, source_guard=values[1].source_guard if unit == 'B9' else None)
    if unit == 'B9':
        source, parent, stages = values
        result.update(parent_request_ref=parent.request_ref, leaves=counts,
            raw_input_file_sha256=sha(PAYLOAD / 'full12.input.json'),
            input_sha256=digest(canonical(source).encode()), fresh_leaf_count=len(stages),
            fresh_model_calls_required=len(stages) + 1, reused_responses=0,
            merge_capacity='Actual fresh MERGE checked before POST, no fabricated receipts.')
    write(root / ('preflight.json' if unit == 'A9' else 'full12-sql.preflight.json'), result)


async def acquire(root, unit, scope, seconds):
    app, core, values = material(root, unit)
    import httpx
    from analysis_model_source import SelfHostedSemanticAnalysisModelSource
    import analysis_model_source as source_owner
    import analysis_cumulative_service as service
    end = time.monotonic() + seconds
    result_file = root / ('after.result.json' if unit == 'A9' else 'full12-sql.actual.result.json')
    result = dict(state='STARTED_NOT_ADOPTED', unit=unit, profile=PROFILE, model=MODEL,
        training=0, retry=0, sql_save=0, non_generation_sql_reread=0,
        normal_adoption=False, meaning_review='PENDING_INDEPENDENT_SOURCE_REVIEW',
        new_model_calls=0, fresh_model_calls=0, reused_responses=0,
        max_model_calls=scope['units'][unit]['max_model_calls'], map_calls=0, controls=[], calls=[], acquisitions=[])
    started = time.monotonic()
    def save():
        result['elapsed_seconds'] = time.monotonic() - started
        write(result_file, result)
    save()
    def expired(*unused):
        raise TimeoutError('event_plan_child_deadline')
    signal.signal(signal.SIGALRM, expired)
    signal.signal(signal.SIGTERM, expired)
    signal.setitimer(signal.ITIMER_REAL, seconds)
    controls = json.loads((PAYLOAD / 'controls.json').read_text())['cases']
    assert len(controls) == 2 and {c['auth_scope'] for c in controls} == {'natural', 'analysis'}
    async with httpx.AsyncClient(trust_env=False, follow_redirects=False) as client:
        async def post(body, auth_scope, row, *, wire_bytes=None):
            assert result['new_model_calls'] < result['max_model_calls']
            remaining = end - time.monotonic() - 5
            assert remaining > 0
            env_name = 'EMLIS_NATURAL_REPLY_API_KEY' if auth_scope == 'natural' else 'COCOLON_ANALYSIS_MODEL_API_KEY'
            key = os.environ[env_name]
            assert len(key) >= 24
            raw = canonical(body).encode() if wire_bytes is None else wire_bytes
            assert type(raw) is bytes and json.loads(raw) == body
            assert len(raw) <= (65536 if auth_scope == 'natural' else 262144)
            result['new_model_calls'] += 1
            row.update(state='SENT', wire_request=body, wire_request_sha256=digest(raw))
            save()
            call_started = time.monotonic()
            reply = await client.post(f'http://{TRIAL_HOST}:{TRIAL_PORT}/v1/chat/completions',
                headers={'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json',
                         'Accept-Encoding': 'identity'}, content=raw, timeout=min(220, remaining))
            assert len(reply.content) <= 262144
            row.update(state='RECEIVED', status_code=reply.status_code, body=reply.text,
                body_sha256=digest(reply.content), seconds=time.monotonic() - call_started,
                elapsed_seconds=time.monotonic() - started)
            save()
            return reply

        async def control_phase(phase):
            for control in controls:
                body = json.loads(control['wire_json'])
                row = dict(phase=phase, id=control['case_id'])
                result['controls'].append(row)
                reply = await post(body, control['auth_scope'], row)
                data = reply.json()
                assert reply.status_code == 200 and data['choices'][0]['finish_reason'] == 'stop'
                if phase == 'after':
                    before = next(x for x in result['controls'] if x['phase'] == 'before' and x['id'] == row['id'])
                    assert row['body_sha256'] == before['body_sha256'] and row['body'] == before['body']
        try:
            await control_phase('before')
            if unit == 'A9':
                for row, prepared in values:
                    call = dict(id=row['id'], request_ref=prepared.request_ref, messages=prepared.messages(),
                        messages_sha256=core.semantic_map_hash(prepared.messages()), baseline=row['baseline'])
                    result['calls'].append(call)
                    body = dict(model=MODEL, messages=prepared.messages(), temperature=0, max_tokens=4096,
                        stream=False, chat_template_kwargs={'enable_thinking': False})
                    result['map_calls'] += 1
                    reply = await post(body, 'analysis', call)
                    data = reply.json()
                    assert reply.status_code == 200 and data['model'] == MODEL
                    choice = data['choices'][0]
                    raw, finish = choice['message']['content'], choice['finish_reason']
                    call.update(raw=raw, raw_sha256=digest(raw.encode()), finish_reason=finish)
                    assert finish == 'stop'
                    response = core.AnalysisModelQuotedParentUnitsResponse(prepared.request_ref,
                        core.semantic_map_hash(prepared.messages()), digest(raw.encode()), finish, raw)
                    artifact, coverage = app.build_semantic_map(prepared, response)
                    call.update(admission='GENERATED', coverage=coverage,
                        projection=artifact.safe_projection(authenticated_owner_scope=row['owner']),
                        text=artifact.safe_text_projection(authenticated_owner_scope=row['owner'])['text'],
                        private_evidence=artifact.private_evidence())
                    save()
                assert result['map_calls'] == 5
            else:
                source, parent, stages = values
                proof = json.loads((root / 'full12-sql.preflight.json').read_text())
                result.update(all_fictional=True, source_guard=parent.source_guard, prompt_version=PROFILE,
                    request_ref=parent.request_ref, source_count=12,
                    raw_input_file_sha256=sha(PAYLOAD / 'full12.input.json'),
                    input_sha256=digest(canonical(source).encode()),
                    candidate_core_sha256=sha(root / INFERENCE / 'cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py'),
                    pre_acquisition_plan_sha256=sha(PAYLOAD / 'full12_pre_acquisition.plan.json'),
                    candidate_preparation_sha256=sha(PAYLOAD / 'diagnostic_preparation.json'),
                    candidate_plan_sha256=sha(PAYLOAD / 'full12_pre_acquisition.plan.json'))
                assert source_owner.SEMANTIC_PIPELINE_TIMEOUT_SECONDS == 840
                from transformers import AutoTokenizer
                tok = AutoTokenizer.from_pretrained(scope['model'], revision=scope['revision'],
                    local_files_only=True, trust_remote_code=False)
                async def forward(request):
                    ordinal = len(result['acquisitions'])
                    assert request.url.host == 'same-pod.invalid' and request.method == 'POST'
                    assert ordinal < len(stages) + 1
                    body = json.loads(request.content)
                    assert body['model'] == MODEL and body['max_tokens'] == 4096
                    if ordinal < len(stages):
                        assert body['messages'] == stages[ordinal].messages()
                        kind = 'LEAF'
                    else:
                        assert len(json.loads(body['messages'][1]['content'])['leaf_receipts']) == len(stages)
                        kind = 'MERGE'
                    ids = tok.apply_chat_template(body['messages'], enable_thinking=False,
                        add_generation_prompt=True, tokenize=True, return_dict=False, truncation=False)
                    assert len(ids) + 4096 <= 32768
                    row = dict(ordinal=ordinal + 1, stage_kind=kind,
                        messages_sha256=core.semantic_map_hash(body['messages']),
                        input_tokens=len(ids), reserved_output_tokens=4096, context_tokens=32768,
                        input_plus_output_tokens=len(ids) + 4096)
                    result['acquisitions'].append(row)
                    result['map_calls'] += 1
                    result['fresh_model_calls'] += 1
                    reply = await post(body, 'analysis', row, wire_bytes=request.content)
                    return httpx.Response(reply.status_code, content=reply.content)
                model_source = SelfHostedSemanticAnalysisModelSource(
                    endpoint='https://same-pod.invalid/v1/chat/completions', model=MODEL,
                    api_key=os.environ['COCOLON_ANALYSIS_MODEL_API_KEY'],
                    semantic_prompt_version=PROFILE, transport=httpx.MockTransport(forward))
                artifact, coverage = await service._semantic_history_map(model_source, parent)
                assert result['map_calls'] == len(stages) + 1 == scope['units'][unit]['max_map_calls']
                result.update(artifact_id=artifact.artifact_id, coverage=coverage,
                    projection=artifact.safe_projection(authenticated_owner_scope=source['owner']),
                    text=artifact.safe_text_projection(authenticated_owner_scope=source['owner'])['text'],
                    private_evidence=artifact.private_evidence())
            await control_phase('after')
            result['state'] = 'COMPLETE_NOT_ADOPTED_PENDING_MEANING_REVIEW' if unit == 'A9' else 'GENERATED'
        except BaseException as exc:
            result.update(state='INCOMPLETE_NOT_ADOPTED', failure_type=type(exc).__name__)
            if isinstance(exc, app.SemanticMapError):
                result['failure_code'] = str(exc)
            raise
        finally:
            save()
            signal.setitimer(signal.ITIMER_REAL, 0)


def continuity(unit, scope):
    if unit == 'A9':
        return scope['original_provider_pid'], scope['original_provider_start_ticks']
    root = ROOTS['A9']
    execution = json.loads((root / 'execution.json').read_text())
    actual = json.loads((root / 'after.result.json').read_text())
    review_path = PAYLOAD / 'A9.independent-meaning-review.json'
    review_bytes = review_path.read_bytes()
    assert 0 < len(review_bytes) <= 4096
    review = json.loads(review_bytes)
    assert type(review) is dict and set(review) == {
        'state', 'reviewers', 'A9_result_sha256', 'raw_sha256_by_case'}
    assert execution['scope_sha256'] == sha(SCOPE_FILE)
    assert execution['driver_sha256'] == sha(__file__)
    assert execution['candidate_native_sha256'] == scope['candidate_native_sha256']
    assert execution['candidate'] == scope['candidate_adapter']
    assert execution['state'] == 'COMPLETE_NOT_ADOPTED_PENDING_MEANING_REVIEW'
    assert execution['original_provider_restored'] is True and execution['new_model_calls'] == 9
    assert actual['state'] == 'COMPLETE_NOT_ADOPTED_PENDING_MEANING_REVIEW' and len(actual['calls']) == 5
    assert actual['profile'] == PROFILE and actual['model'] == MODEL
    assert execution['result_sha256'] == sha(root / 'after.result.json')
    expected = json.loads((PAYLOAD / 'diagnostic_preparation.json').read_text())['cases']
    for call, prepared in zip(actual['calls'], expected, strict=True):
        assert call['id'] == prepared['id'] and call['request_ref'] == prepared['request_ref']
        assert call['messages'] == prepared['messages'] and call['messages_sha256'] == prepared['messages_sha256']
        assert call['finish_reason'] == 'stop' and call['admission'] == 'GENERATED'
        assert digest(call['raw'].encode()) == call['raw_sha256']
    assert review['state'] == 'ALL_FIVE_SOURCE_RAW_PROJECTION_TEXT_ADEQUATE'
    assert review['reviewers'] == ['root', 'independent'] and review['A9_result_sha256'] == execution['result_sha256']
    assert review['raw_sha256_by_case'] == {c['id']: c['raw_sha256'] for c in actual['calls']}
    return execution['restored_pid'], execution['restored_start_ticks']


def main(unit, scope_sha):
    started = time.monotonic()
    scope = scope_read(scope_sha)
    root = ROOTS[unit]
    assert not root.exists(), 'new_single_use_root_already_exists'
    pid, ticks = continuity(unit, scope)
    assert sha(HELPER) == HELPER_SHA
    helper = runpy.run_path(str(HELPER))
    proc = Path('/proc') / str(pid)
    assert (proc / 'stat').read_text().split(') ', 1)[1].split()[19] == ticks
    argv = [v.decode() for v in (proc / 'cmdline').read_bytes().split(b'\0') if v]
    assert argv[1] == str(helper['SERVE']) and sha(helper['SERVE']) == helper['SERVE_SHA']
    initial = scope['original_adapter']
    assert option(argv, '--model-name') == scope['original_model']
    for name, expected in (('--adapter', initial['path']), ('--adapter-weights-sha256', initial['weights_sha256']),
                           ('--adapter-config-sha256', initial['config_sha256'])):
        assert option(argv, name) == expected
    env = dict(v.decode().split('=', 1) for v in (proc / 'environ').read_bytes().split(b'\0') if v)
    cwd = str((proc / 'cwd').resolve())
    proof = helper['verify_kernel_proof'](env)
    files = {str(p.relative_to(CLIENT)): sha(p) for p in sorted(CLIENT.rglob('*'))
        if p.is_file() and '__pycache__' not in p.parts and p.suffix != '.pyc'}
    assert len(files) == 408 and digest(canonical(files).encode()) == CLIENT_SHA
    for adapter in (initial, scope['candidate_adapter']):
        assert sha(Path(adapter['path']) / 'adapter_model.safetensors') == adapter['weights_sha256']
        assert sha(Path(adapter['path']) / 'adapter_config.json') == adapter['config_sha256']
    root.mkdir(mode=0o700)
    install_sources(root, scope)
    write(root / 'scope.json', scope)
    (root / 'kernel-proof.json').write_bytes(proof)
    command = [argv[0], str(Path(__file__).resolve()), '--unit', unit, '--scope-sha', scope_sha]
    common = str(CLIENT) + (os.pathsep + env['PYTHONPATH'] if env.get('PYTHONPATH') else '')
    cpu_env = dict(env, PYTHONPATH=common, CUDA_VISIBLE_DEVICES='', PYTHONDONTWRITEBYTECODE='1',
        HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
    driver_env = dict(cpu_env)
    provider_env = dict(env, PYTHONPATH=str(helper['DEPS']) + os.pathsep + common,
        TRITON_CACHE_DIR=str(helper['CACHE']), PYTHONDONTWRITEBYTECODE='1',
        HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
    with (root / 'preflight.log').open('xb') as log:
        checked = subprocess.run(command + ['--phase', 'preflight'], cwd=root, env=cpu_env,
            stdin=subprocess.DEVNULL, stdout=log, stderr=subprocess.STDOUT, timeout=80)
    assert checked.returncode == 0, 'preflight_failed_before_provider_stop'
    candidate = candidate_args(argv, root / NATIVE, scope)
    write(root / 'provider.argv.json', candidate)
    limits = scope['units'][unit]
    state = dict(state='PREPARED_NOT_ADOPTED', unit=unit, scope_sha256=scope_sha,
        driver_sha256=sha(__file__), original_provider_pid=pid, original_start_ticks=ticks,
        candidate_native_sha256=scope['candidate_native_sha256'], profile=PROFILE,
        candidate=scope['candidate_adapter'], training=0, retry=0, new_model_calls=0,
        max_model_calls=limits['max_model_calls'], original_provider_restored=False)
    def save():
        state['elapsed_seconds'] = time.monotonic() - started
        write(root / 'execution.json', state)
    def expired(*unused):
        raise TimeoutError('event_plan_work_deadline_restore_reserved')
    signal.signal(signal.SIGALRM, expired)
    signal.signal(signal.SIGTERM, expired)
    remaining = started + limits['work_seconds'] - time.monotonic()
    assert remaining > 5
    signal.setitimer(signal.ITIMER_REAL, remaining)
    child = None
    stopped = False
    save()
    try:
        assert (proc / 'stat').read_text().split(') ', 1)[1].split()[19] == ticks
        assert [v.decode() for v in (proc / 'cmdline').read_bytes().split(b'\0') if v] == argv
        assert dict(v.decode().split('=', 1) for v in (proc / 'environ').read_bytes().split(b'\0') if v) == env
        stopped = True
        helper['stop'](pid)
        with (root / 'candidate-provider.log').open('xb') as log:
            provider_command = command + ['--phase', 'provider']
            child = subprocess.Popen(provider_command, cwd=cwd, env=provider_env, stdin=subprocess.DEVNULL,
                stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
        trial_health_wait(child, provider_command, 60)
        state['candidate_pid'] = child.pid
        state['candidate_start_ticks'] = (Path('/proc') / str(child.pid) / 'stat').read_text().split(') ', 1)[1].split()[19]
        save()
        remaining = started + limits['work_seconds'] - time.monotonic() - 5
        assert remaining > 0
        with (root / 'driver.log').open('xb') as log:
            done = subprocess.run(command + ['--phase', 'acquire', '--seconds', str(remaining)],
                cwd=root, env=driver_env, stdin=subprocess.DEVNULL, stdout=log,
                stderr=subprocess.STDOUT, timeout=remaining + 1, start_new_session=True)
        state['driver_exit'] = done.returncode
        path = root / ('after.result.json' if unit == 'A9' else 'full12-sql.actual.result.json')
        result = json.loads(path.read_text())
        state.update(state=result['state'], new_model_calls=result['new_model_calls'], result_sha256=sha(path))
        save()
    finally:
        signal.alarm(0)
        signal.signal(signal.SIGTERM, signal.SIG_IGN)
        try:
            if child is not None:
                helper['stop'](child.pid)
        finally:
            if stopped:
                with (root / 'restored-provider.log').open('xb') as log:
                    restored = subprocess.Popen(argv, cwd=cwd, env=env, stdin=subprocess.DEVNULL,
                        stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
                state['restored_pid'] = restored.pid
                helper['health_wait'](60)
                fresh = Path('/proc') / str(restored.pid)
                assert [v.decode() for v in (fresh / 'cmdline').read_bytes().split(b'\0') if v] == argv
                assert dict(v.decode().split('=', 1) for v in (fresh / 'environ').read_bytes().split(b'\0') if v) == env
                assert str((fresh / 'cwd').resolve()) == cwd
                state['restored_start_ticks'] = (fresh / 'stat').read_text().split(') ', 1)[1].split()[19]
                for adapter in (initial, scope['candidate_adapter']):
                    assert sha(Path(adapter['path']) / 'adapter_model.safetensors') == adapter['weights_sha256']
                    assert sha(Path(adapter['path']) / 'adapter_config.json') == adapter['config_sha256']
                state['original_provider_restored'] = True
            save()
            assert state['elapsed_seconds'] < limits['restore_inclusive_seconds'], 'restore_budget_exceeded'
    print(canonical({k: state.get(k) for k in ('state', 'new_model_calls', 'elapsed_seconds', 'original_provider_restored', 'restored_pid')}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--unit', choices=['A9', 'B9'], required=True)
    parser.add_argument('--scope-sha', required=True)
    parser.add_argument('--phase', choices=['preflight', 'provider', 'acquire'])
    parser.add_argument('--seconds', type=float)
    args = parser.parse_args()
    if args.phase:
        current_scope = scope_read(args.scope_sha)
        root = ROOTS[args.unit]
        assert root.is_dir()
        if args.phase == 'preflight':
            preflight(root, args.unit, current_scope)
        elif args.phase == 'provider':
            provider(root, args.unit, current_scope)
        else:
            assert args.seconds and 0 < args.seconds <= current_scope['units'][args.unit]['work_seconds']
            asyncio.run(acquire(root, args.unit, current_scope, args.seconds))
    else:
        main(args.unit, args.scope_sha)
