"""Replay twelve exact fictional leaves; acquire one larger-context merge."""
import ast
import hashlib
import json
import os
from pathlib import Path
import shutil
import signal
import subprocess
import time
import urllib.request

PREVIOUS_REV = '11200b2011fc787ffe015a4463df447b9366574f'
NEW_API_REV = '8ae18c752aee50c4a968857a5c89e80e2d2915ef'
PREVIOUS_CANDIDATE_SHA = '583a10e8bc25d0bf50e35e53dcfd9407963dc9575e6faac1199c5e5ab30c0c8a'
FULL_MESSAGES_SHA = '1941a809ef1b00d1d95b31aaa4146869c85ca26f5465f8af0c4d056bf6ee2c4d'
PREVIOUS = Path('/workspace/semantic-history-free-unicode-20261115-once')
ROOT = Path('/workspace/semantic-history-merge-context-20261115-once')
SERVE = Path('/workspace/new-fictional-self-piece4b-once-20261109/piece_ordered_server.py')
SERVE_SHA = 'ad3d301d2d1abd9226703dc72e3734eb8da79d8e0cf084d4b0666e97298370be'
EXPECTED_PID = 116491
PREVIOUS_FILES = {
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py': 'f44335db2170e9eb472ce22864b8a80d545240d8b36b7af7c886123cf226e482',
    'ai/services/ai_inference/analysis_cumulative_service.py': '9e6eb77154ace9fb5b20fdd4630d5ab4b44c9d55e91cfd7512a11de67edda49e',
    'ai/services/ai_inference/analysis_model_source.py': '0dd43d7de9fabbf859ab8a3095e078c15afb06c6297c1e953d37008096b5ca37',
    'ai/tools/serve_emlis_natural_reply.py': 'ac6d06376968204c960175e74805087b70d298f4d1a4911c753d802ee3fee132',
}
NEW_FILES = {
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py': 'db9a43f05f0c0dcd963cabb713f3c3bd4740e8f2c016dde8cdf9b17e2434d08c',
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
    end = time.monotonic() + 20
    while time.monotonic() < end:
        try:
            exited = (Path('/proc') / str(pid) / 'stat').read_text().split(') ', 1)[1].startswith('Z ')
        except FileNotFoundError:
            return
        if exited:
            return
        time.sleep(.25)
    try:
        os.kill(pid, signal.SIGKILL)
    except ProcessLookupError:
        return
    end = time.monotonic() + 5
    while time.monotonic() < end:
        try:
            exited = (Path('/proc') / str(pid) / 'stat').read_text().split(') ', 1)[1].startswith('Z ')
        except FileNotFoundError:
            return
        if exited:
            return
        time.sleep(.25)
    raise RuntimeError('provider_did_not_stop')


FORWARD = '''            async def forward(request):
                assert request.url.host == 'same-pod.invalid'
                assert len(result['acquisitions']) < 13
                assert len(request.content) <= 262144
                body = json.loads(request.content)
                assert body['model'] == MODEL and body['max_tokens'] == 4096
                assert body['temperature'] == 0 and body['stream'] is False
                assert body['chat_template_kwargs'] == {'enable_thinking': False}
                number = len(result['acquisitions'])
                old = prior['acquisitions'][number]
                material_body = json.loads(body['messages'][1]['content'])
                kind = material_body['history_stage']['kind']
                if number < 12:
                    assert body == old['wire_request'], 'prior_leaf_wire_changed'
                    assert kind == 'LEAF' and old['state'] == 'RECEIVED' and old['status_code'] == 200
                    row = dict(state='RECEIVED', status_code=200, wire_request=body, body=old['body'],
                        origin='REUSED_PRIOR_EXACT_RESPONSE',
                        reused_from=dict(trial_root=str(PRIOR_ROOT), acquisition=number + 1,
                            api_commit=PRIOR_API_COMMIT, candidate_source_sha256=PRIOR_CANDIDATE_SHA),
                        prior_started_seconds=old['started_seconds'],
                        prior_elapsed_seconds=old['elapsed_seconds'],
                        started_seconds=time.monotonic() - started,
                        elapsed_seconds=time.monotonic() - started)
                    result['acquisitions'].append(row)
                    result['reused_responses'] += 1
                    save()
                    return httpx.Response(200, content=old['body'].encode('utf-8'))
                assert number == 12 and kind == 'MERGE'
                assert old['state'] == 'RECEIVED' and old['status_code'] == 503
                assert result['new_model_calls'] == 0 and result['reused_responses'] == 12
                assert {k: v for k, v in body.items() if k != 'messages'} == {
                    k: v for k, v in old['wire_request'].items() if k != 'messages'}
                assert body['messages'][0] == old['wire_request']['messages'][0]
                assert hashlib.sha256(canonical(body['messages']).encode()).hexdigest() == FULL_MESSAGES_SHA
                assert len(canonical(body['messages']).encode()) == 110242
                original_fields = json.loads(parent.material_json)['fields']
                shown_fields = material_body['fields']
                assert len(shown_fields) == len(original_fields) == 24
                assert [{k: v for k, v in field.items() if k not in {
                    'fragment_scalar_range', 'fragment_is_complete_field', 'semantic_coverage'}}
                    for field in shown_fields] == original_fields
                assert all(field['fragment_scalar_range'] == [0, len(field['text'])]
                    and field['fragment_is_complete_field'] is True
                    and field['semantic_coverage'] == 'UNASSESSED' for field in shown_fields)
                assert material_body['omitted_ranges'] == []
                assert material_body['history_coverage']['full_source_semantic_coverage'] is False
                remaining = 300 - (time.monotonic() - started)
                if remaining <= 0:
                    raise TimeoutError('merge_context_driver_deadline')
                row = dict(state='SENT', wire_request=body, origin='NEW_FULL_CONTEXT_32768_RESPONSE',
                    started_seconds=time.monotonic() - started)
                result['acquisitions'].append(row)
                result['new_model_calls'] += 1
                save()
                try:
                    reply = await client.post(LOCAL + '/v1/chat/completions',
                        headers={'Authorization': 'Bearer ' + key,
                            'Content-Type': 'application/json', 'Accept-Encoding': 'identity'},
                        content=request.content, timeout=min(220, remaining))
                    assert len(reply.content) <= 262144
                    row.update(state='RECEIVED', status_code=reply.status_code,
                        body=reply.text, elapsed_seconds=time.monotonic() - started)
                    save()
                    return httpx.Response(reply.status_code, content=reply.content)
                except BaseException:
                    row.update(state='FAILED_OR_ACK_UNKNOWN', elapsed_seconds=time.monotonic() - started)
                    save()
                    raise
'''


def derive_driver(source, candidate_sha, capacity_proof_sha):
    assert len(capacity_proof_sha) == 64 and set(capacity_proof_sha) <= set('0123456789abcdef')
    assert source.count('pipeline_seconds=840') == 1
    assert source.count('assert len(stages) == 12') == 1
    assert source.count('max_calls=13') == 1
    assert source.count("len(result['acquisitions']) < 13") == 1
    binding = (
        "    prior = json.loads((PRIOR_ROOT / 'semantic-history.actual.result.json').read_text())\n"
        "    assert prior['state'] == 'NOT_GENERATED' and prior['model'] == MODEL\n"
        "    assert prior['input_sha256'] == hashlib.sha256(canonical(material).encode()).hexdigest()\n"
        "    assert prior['request_ref'] == parent.request_ref and prior['leaf_record_counts'] == [1] * 12\n"
        "    assert len(prior['acquisitions']) == 13\n"
        "    assert all(row['state'] == 'RECEIVED' and row['status_code'] == 200\n"
        "        for row in prior['acquisitions'][:12])\n"
        "    assert prior['acquisitions'][12]['status_code'] == 503\n"
        "    assert hashlib.sha256((ROOT / 'full-merge-token-capacity.json').read_bytes()).hexdigest() == CAPACITY_PROOF_SHA\n"
    )
    marker = "    assert len(stages) == 12, 'exactly_twelve_complete_leaves_required'\n"
    assert source.count(marker) == 1
    source = source.replace(marker, marker + binding, 1)
    root_marker = "OUTPUT = ROOT / 'semantic-history.actual.result.json'\n"
    assert source.count(root_marker) == 1
    source = source.replace(root_marker, root_marker
        + 'PRIOR_ROOT = Path(' + repr(str(PREVIOUS)) + ')\n'
        + 'PRIOR_API_COMMIT = ' + repr(PREVIOUS_REV) + '\n'
        + 'API_COMMIT = ' + repr(NEW_API_REV) + '\n'
        + 'FULL_MESSAGES_SHA = ' + repr(FULL_MESSAGES_SHA) + '\n'
        + 'CAPACITY_PROOF_SHA = ' + repr(capacity_proof_sha) + '\n'
        + 'PRIOR_CANDIDATE_SHA = ' + repr(candidate_sha) + '\n', 1)
    source = source.replace('pipeline_seconds=840', 'pipeline_seconds=300', 1)
    result_marker = 'acquisitions=[], health_before=None, health_after=None)'
    assert source.count(result_marker) == 1
    source = source.replace(result_marker,
        'acquisitions=[], health_before=None, health_after=None, new_model_calls=0, '
        'max_new_model_calls=1, reused_responses=0, native_context_tokens=32768, '
        'previous_trial=str(PRIOR_ROOT), candidate_source_sha256=PRIOR_CANDIDATE_SHA, '
        'api_commit=API_COMMIT, full_merge_token_proof=dict(messages_sha256=FULL_MESSAGES_SHA, '
        'input_tokens=24545, reserved_output_tokens=4096, total_tokens=28641, '
        "context_tokens=32768, method='cached_tokenizer_only', "
        "artifact='full-merge-token-capacity.json', artifact_sha256=CAPACITY_PROOF_SHA))", 1)
    nodes = [node for node in ast.walk(ast.parse(source))
        if isinstance(node, ast.AsyncFunctionDef) and node.name == 'forward']
    assert len(nodes) == 1 and nodes[0].col_offset == 12
    lines = source.splitlines(keepends=True)
    lines[nodes[0].lineno - 1:nodes[0].end_lineno] = [FORWARD]
    source = ''.join(lines)
    acquisition = '                artifact, coverage = await service._semantic_history_map(source, parent)'
    assert source.count(acquisition) == 1
    source = source.replace(acquisition,
        '                async with asyncio.timeout(300 - (time.monotonic() - started)):\n'
        '                    artifact, coverage = await service._semantic_history_map(source, parent)\n'
        "                assert result['new_model_calls'] == 1 and result['reused_responses'] == 12\n"
        "                assert len(result['acquisitions']) == 13", 1)
    compile(source, 'semantic_history_merge_context_driver.py', 'exec')
    return source


def main():
    started = time.monotonic()
    assert len(NEW_API_REV) == 40 and set(NEW_API_REV) <= set('0123456789abcdef'), 'published_commit_identity_pending'
    assert all(len(value) == 64 and set(value) <= set('0123456789abcdef')
        for value in NEW_FILES.values()), 'published_source_identity_pending'
    assert not ROOT.exists(), 'one_shot_root_already_exists'
    assert digest(SERVE.read_bytes()) == SERVE_SHA, 'provider_source_changed'
    previous = json.loads((PREVIOUS / 'execution.json').read_text())
    assert previous['api_commit'] == PREVIOUS_REV and previous['original_provider_restored'] is True
    assert previous['restored_pid'] == EXPECTED_PID
    assert previous['training'] == previous['retry'] == 0
    candidate = (PREVIOUS / 'candidate_server.py').read_bytes()
    candidate_sha = digest(candidate)
    assert candidate_sha == previous['candidate_source_sha256'] == PREVIOUS_CANDIDATE_SHA, 'prior_candidate_source_changed'
    compile(candidate, 'candidate_server.py', 'exec')
    for path, expected in PREVIOUS_FILES.items():
        assert digest((PREVIOUS / path).read_bytes()) == expected, 'fixed_previous_source_changed'
    material = json.loads((PREVIOUS / 'semantic-history.actual.input.json').read_text())
    assert material['all_fictional'] is True and len(material['snapshot']['members']) == 12
    assert digest(canonical(material).encode()) == 'baa0c1d1ed2a9970576ec85b0f5cae390f9d71f33dc0044b41ab684242087472'
    capacity_proof = (PREVIOUS / 'full-merge-token-capacity.json').read_bytes()
    proof = json.loads(capacity_proof)
    assert proof['new_model_calls'] == 0 and proof['native_boot_context_verified'] == 16384
    assert proof['full']['input_tokens'] == 24545 and proof['full']['with_output4096'] == 28641
    assert proof['full']['message_bytes'] == 110242 and proof['full']['fits32768'] is True
    capacity_proof_sha = digest(capacity_proof)
    driver = derive_driver((PREVIOUS / 'semantic_history_actual_once.py').read_text(),
        candidate_sha, capacity_proof_sha)
    proc = Path('/proc') / str(EXPECTED_PID)
    argv = [value.decode() for value in (proc / 'cmdline').read_bytes().split(b'\0') if value]
    assert argv[1] == str(SERVE), 'provider_process_changed'
    assert all(value != '--context-tokens' and not value.startswith('--context-tokens=') for value in argv)
    cwd = str((proc / 'cwd').resolve())
    # Same restored process state, kept only in this Pod's memory.
    env = dict(value.decode().split('=', 1) for value in (proc / 'environ').read_bytes().split(b'\0') if value)
    ROOT.mkdir(mode=0o700)
    shutil.copytree(PREVIOUS / 'ai', ROOT / 'ai')
    for path in (p for p in (PREVIOUS / 'ai').rglob('*') if p.is_file() and '__pycache__' not in p.parts):
        assert digest(path.read_bytes()) == digest((ROOT / path.relative_to(PREVIOUS)).read_bytes())
    # Only the existing core and transport byte ceilings change; native and
    # all remaining API source stay byte-identical to the prior execution.
    for path, expected in NEW_FILES.items():
        url = 'https://raw.githubusercontent.com/MassyuRed/mashos-api/' + NEW_API_REV + '/' + path
        with urllib.request.urlopen(url, timeout=20) as response:
            data = response.read(300000)
        assert digest(data) == expected, 'fixed_new_source_mismatch'
        compile(data, path, 'exec')
        (ROOT / path).write_bytes(data)
    shutil.copyfile(PREVIOUS / 'semantic-history.actual.input.json', ROOT / 'semantic-history.actual.input.json')
    (ROOT / 'full-merge-token-capacity.json').write_bytes(capacity_proof)
    assert (ROOT / 'full-merge-token-capacity.json').read_bytes() == capacity_proof
    candidate_path = ROOT / 'candidate_server.py'
    candidate_path.write_bytes(candidate)
    assert digest(candidate_path.read_bytes()) == candidate_sha
    driver_path = ROOT / 'semantic_history_actual_once.py'
    driver_path.write_text(driver)
    state = dict(api_commit=NEW_API_REV, previous_api_commit=PREVIOUS_REV,
        new_api_files=NEW_FILES, state='PREPARED', previous_trial=str(PREVIOUS),
        candidate_source_sha256=candidate_sha, driver_sha256=digest(driver.encode()),
        max_model_calls=1, reused_responses=12, context_tokens=32768,
        outer_seconds=420, acquisition_phase_seconds=330, pipeline_seconds=300,
        prior_pipeline_seconds=516.389, full_merge_messages_sha256=FULL_MESSAGES_SHA,
        full_merge_messages_bytes=110242, full_merge_input_tokens=24545,
        full_merge_with_output_tokens=28641,
        token_capacity_proof_sha256=capacity_proof_sha,
        training=0, retry=0, original_provider_restored=False)
    def save():
        (ROOT / 'execution.json').write_text(canonical(state) + '\n')
    save()
    old_root = '/workspace/semantic-history-20261115-once'
    runtime_env = dict(env, PYTHONPATH=old_root + '/client-runtime-deps', PYTHONDONTWRITEBYTECODE='1')
    smoke = ('import sys,json;from pathlib import Path;sys.path.insert(0,'
        + repr(str(ROOT / 'ai/services/ai_inference'))
        + ');import analysis_cumulative_service as c,analysis_semantic_map as s;m=json.loads(Path('
        + repr(str(ROOT / 'semantic-history.actual.input.json')) + ').read_text());p=s.prepare_semantic_map(m["owner"],m["snapshot"]);'
        + 'assert p.request_ref=="analysis-semantic-request:c2528720f72a5b3c6911364f15008a2c3b5a37278a819929c42370a385fb45bc";'
        + 'assert [len(x.record_refs) for x in c.prepare_semantic_history_batches(p)]==[1]*12')
    subprocess.run([argv[0], '-c', smoke], env=runtime_env, check=True, timeout=20)
    health_wait(3)
    child = None
    original_stopped = False
    def deadline(signum, frame):
        raise TimeoutError('merge_context_deadline_restore_reserved')
    signal.signal(signal.SIGTERM, deadline)
    signal.signal(signal.SIGALRM, deadline)
    # The acquisition phase has 330s including provider load. Stopping the
    # candidate (25s) and restoring the original (45s) retain a 20s margin.
    remaining_acquisition = started + 330 - time.monotonic()
    if remaining_acquisition <= 0:
        raise TimeoutError('merge_context_preparation_deadline')
    signal.setitimer(signal.ITIMER_REAL, remaining_acquisition)
    try:
        state['state'] = 'ACTIVATED'
        save()
        original_stopped = True
        stop(EXPECTED_PID)
        candidate_argv = [argv[0], str(candidate_path)] + argv[2:] + ['--context-tokens', '32768']
        with (ROOT / 'candidate-provider.log').open('xb') as log:
            child = subprocess.Popen(candidate_argv, cwd=cwd, env=env, stdin=subprocess.DEVNULL,
                stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
        state['candidate_pid'] = child.pid
        save()
        health_wait(45)
        with (ROOT / 'driver.log').open('xb') as log:
            completed = subprocess.run([argv[0], str(driver_path)], cwd=ROOT, env=runtime_env,
                stdin=subprocess.DEVNULL, stdout=log, stderr=subprocess.STDOUT,
                timeout=min(310, max(.001, started + 330 - time.monotonic())))
        state.update(state='ACQUISITION_FINISHED', driver_exit=completed.returncode)
        save()
    finally:
        signal.alarm(0)
        signal.signal(signal.SIGTERM, signal.SIG_IGN)
        try:
            if child is not None:
                stop(child.pid)
        finally:
            try:
                if original_stopped:
                    with (ROOT / 'restored-provider.log').open('xb') as log:
                        restored = subprocess.Popen(argv, cwd=cwd, env=env, stdin=subprocess.DEVNULL,
                            stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
                    state['restored_pid'] = restored.pid
                    health_wait(45)
                    state['original_provider_restored'] = True
            finally:
                state['elapsed_seconds'] = time.monotonic() - started
                save()
                assert state['elapsed_seconds'] < 420, 'restore_budget_exceeded'
    print(canonical(state))


if __name__ == '__main__':
    main()
