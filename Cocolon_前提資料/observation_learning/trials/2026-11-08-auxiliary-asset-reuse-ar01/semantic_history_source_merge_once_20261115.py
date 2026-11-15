"""Replay twelve exact fictional leaves; acquire one source-only v2 merge."""
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

SOURCE_BASE_REV = '11200b2011fc787ffe015a4463df447b9366574f'
LAST_REV = '8ae18c752aee50c4a968857a5c89e80e2d2915ef'
NEW_API_REV = 'dca20231ad1791c07a5011d6905340c78d4de0b3'
NATIVE_CANDIDATE_SHA = '583a10e8bc25d0bf50e35e53dcfd9407963dc9575e6faac1199c5e5ab30c0c8a'
MERGE_MESSAGES_SHA = '878eb91858f3b95c30185e3f6aa7e858ad023a453b3687380838e2b71ee21610'
MERGE_REQUEST_REF = 'analysis-semantic-stage:fed68c054d69b79d59bcead7082d25222ea94fbc5fa97014d503368110c124c0'
SOURCE_BASE = Path('/workspace/semantic-history-free-unicode-20261115-once')
LAST = Path('/workspace/semantic-history-merge-context-20261115-once')
ROOT = Path('/workspace/semantic-history-source-merge-20261115-once')
SERVE = Path('/workspace/new-fictional-self-piece4b-once-20261109/piece_ordered_server.py')
SERVE_SHA = 'ad3d301d2d1abd9226703dc72e3734eb8da79d8e0cf084d4b0666e97298370be'
EXPECTED_PID = 117095
LAST_FILES = {
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py': 'db9a43f05f0c0dcd963cabb713f3c3bd4740e8f2c016dde8cdf9b17e2434d08c',
    'ai/services/ai_inference/analysis_cumulative_service.py': '9e6eb77154ace9fb5b20fdd4630d5ab4b44c9d55e91cfd7512a11de67edda49e',
    'ai/services/ai_inference/analysis_model_source.py': 'c1106527165bfd6fd67e3ed1506178ba56c6ec16948f207f06c5816ec842cd35',
    'ai/tools/serve_emlis_natural_reply.py': 'ac6d06376968204c960175e74805087b70d298f4d1a4911c753d802ee3fee132',
}
NEW_FILES = {
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py': '42fc2f04421c3a89241a6f940f15845d28439cadb059c5d69afd1af846ac6e56',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py': '138f54c9c8800e970bae69a81e2a696c45f7515687636daae0e5fa8085512f10',
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


PREFLIGHT = r'''import asyncio, hashlib, json, os, sys
from pathlib import Path
root, source_base = Path(sys.argv[1]), Path(sys.argv[2])
api_commit, expected_merge_hash, expected_merge_ref = sys.argv[3:6]
sys.path.insert(0, str(root / 'ai/services/ai_inference'))
import httpx
import analysis_semantic_map as app
import analysis_cumulative_service as service
import analysis_model_source as transport
from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as core
from transformers import AutoTokenizer
def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False)
async def check():
    material = json.loads((root / 'semantic-history.actual.input.json').read_text())
    prior = json.loads((source_base / 'semantic-history.actual.result.json').read_text())
    assert material['all_fictional'] is True and prior['model'] == 'cocolon-qwen3.5-4b-analysis-semantic-120u'
    assert hashlib.sha256(canonical(material).encode()).hexdigest() == prior['input_sha256']
    parent = app.prepare_semantic_map(material['owner'], material['snapshot'])
    assert parent.request_ref == prior['request_ref']
    stages = service.prepare_semantic_history_batches(parent)
    assert len(stages) == 12 and len(prior['acquisitions']) == 13
    cursor = 0
    async def received(request):
        nonlocal cursor
        assert cursor < 12
        row = prior['acquisitions'][cursor]
        assert row['state'] == 'RECEIVED' and row['status_code'] == 200
        assert json.loads(request.content) == row['wire_request']
        cursor += 1
        return httpx.Response(200, content=row['body'].encode('utf-8'))
    source = transport.SelfHostedSemanticAnalysisModelSource(
        endpoint='https://offline-cpu.invalid/v1/chat/completions', model=prior['model'],
        api_key='fictional-cpu-no-network', transport=httpx.MockTransport(received))
    leaves = tuple([(stage, await source(stage)) for stage in stages])
    merge = core.prepare_semantic_merge(parent, leaves)
    body = json.loads(merge.material_json)
    assert cursor == 12 and body['history_stage']['profile'] == 'semantic_map.history_synthesis.v2'
    assert 'leaf_interpretations' not in body and 'scoped_unknowns' not in body
    assert len(body['leaf_receipts']) == 12
    assert all(set(r) == {'leaf_request_ref', 'messages_sha256', 'response_sha256'} for r in body['leaf_receipts'])
    assert all(set(r) == {'field', 'quote', 'scalar_range'} for r in body['leaf_source_index'])
    original = json.loads(parent.material_json)['fields']
    fields = body['fields']
    assert len(fields) == len(original) == 24
    assert [{k: v for k, v in f.items() if k not in {
        'fragment_scalar_range', 'fragment_is_complete_field', 'semantic_coverage'}} for f in fields] == original
    assert all(f['fragment_is_complete_field'] is True and f['fragment_scalar_range'] == [0, len(f['text'])]
        and f['semantic_coverage'] == 'UNASSESSED' for f in fields)
    assert body['omitted_ranges'] == [] and body['history_coverage']['full_source_semantic_coverage'] is False
    assert transport.semantic_analysis_input_fits(merge)
    merge_hash = core.semantic_map_hash(merge.messages())
    assert merge_hash == expected_merge_hash and merge.request_ref == expected_merge_ref
    tokenizer = AutoTokenizer.from_pretrained('Qwen/Qwen3.5-4B',
        revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a',
        local_files_only=True, trust_remote_code=False)
    tokens = tokenizer.apply_chat_template(merge.messages(), enable_thinking=False,
        add_generation_prompt=True, tokenize=True, return_dict=False, truncation=False)
    assert len(tokens) + 4096 <= 32768
    print(canonical(dict(api_commit=api_commit, profile=body['history_stage']['profile'],
        input_sha256=prior['input_sha256'], parent_request_ref=parent.request_ref,
        messages_sha256=merge_hash, merge_request_ref=merge.request_ref,
        message_bytes=transport._semantic_message_bytes(merge),
        input_tokens=len(tokens), reserved_output_tokens=4096, with_output4096=len(tokens) + 4096,
        fits32768=True, context_tokens=32768, field_count=24, complete_field_count=24,
        omitted_ranges=[], full_source_semantic_coverage=False, replayed_exact_receipts=12,
        leaf_source_index_count=len(body['leaf_source_index']), new_model_calls=0,
        model_loaded=False, tokenizer_model='Qwen/Qwen3.5-4B',
        tokenizer_revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a')))
asyncio.run(check())
'''


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
                assert material_body['history_stage']['profile'] == 'semantic_map.history_synthesis.v2'
                assert 'leaf_interpretations' not in material_body and 'scoped_unknowns' not in material_body
                assert len(material_body['leaf_receipts']) == 12
                assert all(set(r) == {'leaf_request_ref', 'messages_sha256', 'response_sha256'}
                    for r in material_body['leaf_receipts'])
                assert all(set(r) == {'field', 'quote', 'scalar_range'} for r in material_body['leaf_source_index'])
                assert hashlib.sha256(canonical(body['messages']).encode()).hexdigest() == MERGE_MESSAGES_SHA
                assert len(canonical(body['messages']).encode()) == capacity_proof['message_bytes']
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
                remaining = 320 - (time.monotonic() - started)
                if remaining <= 0:
                    raise TimeoutError('merge_context_driver_deadline')
                row = dict(state='SENT', wire_request=body, origin='NEW_SOURCE_ONLY_V2_CONTEXT_32768_RESPONSE',
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
        "    assert hashlib.sha256((ROOT / 'source-merge-token-capacity.json').read_bytes()).hexdigest() == CAPACITY_PROOF_SHA\n"
        "    capacity_proof = json.loads((ROOT / 'source-merge-token-capacity.json').read_text())\n"
        "    assert capacity_proof['api_commit'] == API_COMMIT and capacity_proof['messages_sha256'] == MERGE_MESSAGES_SHA\n"
        "    assert capacity_proof['new_model_calls'] == 0 and capacity_proof['model_loaded'] is False\n"
        "    assert capacity_proof['input_tokens'] + 4096 == capacity_proof['with_output4096'] <= 32768\n"
    )
    marker = "    assert len(stages) == 12, 'exactly_twelve_complete_leaves_required'\n"
    assert source.count(marker) == 1
    source = source.replace(marker, marker + binding, 1)
    root_marker = "OUTPUT = ROOT / 'semantic-history.actual.result.json'\n"
    assert source.count(root_marker) == 1
    source = source.replace(root_marker, root_marker
        + 'PRIOR_ROOT = Path(' + repr(str(SOURCE_BASE)) + ')\n'
        + 'PRIOR_API_COMMIT = ' + repr(SOURCE_BASE_REV) + '\n'
        + 'API_COMMIT = ' + repr(NEW_API_REV) + '\n'
        + 'MERGE_MESSAGES_SHA = ' + repr(MERGE_MESSAGES_SHA) + '\n'
        + 'CAPACITY_PROOF_SHA = ' + repr(capacity_proof_sha) + '\n'
        + 'PRIOR_CANDIDATE_SHA = ' + repr(candidate_sha) + '\n', 1)
    source = source.replace('pipeline_seconds=840', 'pipeline_seconds=320', 1)
    result_marker = 'acquisitions=[], health_before=None, health_after=None)'
    assert source.count(result_marker) == 1
    source = source.replace(result_marker,
        'acquisitions=[], health_before=None, health_after=None, new_model_calls=0, '
        'max_new_model_calls=1, reused_responses=0, native_context_tokens=32768, '
        'previous_trial=str(PRIOR_ROOT), candidate_source_sha256=PRIOR_CANDIDATE_SHA, '
        'api_commit=API_COMMIT, source_merge_token_proof=dict(measurement=capacity_proof, '
        "artifact='source-merge-token-capacity.json', artifact_sha256=CAPACITY_PROOF_SHA))", 1)
    nodes = [node for node in ast.walk(ast.parse(source))
        if isinstance(node, ast.AsyncFunctionDef) and node.name == 'forward']
    assert len(nodes) == 1 and nodes[0].col_offset == 12
    lines = source.splitlines(keepends=True)
    lines[nodes[0].lineno - 1:nodes[0].end_lineno] = [FORWARD]
    source = ''.join(lines)
    acquisition = '                artifact, coverage = await service._semantic_history_map(source, parent)'
    assert source.count(acquisition) == 1
    source = source.replace(acquisition,
        '                async with asyncio.timeout(320 - (time.monotonic() - started)):\n'
        '                    artifact, coverage = await service._semantic_history_map(source, parent)\n'
        "                assert result['new_model_calls'] == 1 and result['reused_responses'] == 12\n"
        "                assert len(result['acquisitions']) == 13", 1)
    compile(source, 'semantic_history_source_merge_driver.py', 'exec')
    return source


def main():
    started = time.monotonic()
    assert len(NEW_API_REV) == 40 and set(NEW_API_REV) <= set('0123456789abcdef'), 'published_commit_identity_pending'
    assert all(len(value) == 64 and set(value) <= set('0123456789abcdef')
        for value in NEW_FILES.values()), 'published_source_identity_pending'
    assert len(MERGE_MESSAGES_SHA) == 64 and set(MERGE_MESSAGES_SHA) <= set('0123456789abcdef'), 'merge_payload_identity_pending'
    assert not ROOT.exists(), 'one_shot_root_already_exists'
    assert digest(SERVE.read_bytes()) == SERVE_SHA, 'provider_source_changed'
    source_execution = json.loads((SOURCE_BASE / 'execution.json').read_text())
    last_execution = json.loads((LAST / 'execution.json').read_text())
    assert source_execution['api_commit'] == SOURCE_BASE_REV
    assert last_execution['api_commit'] == LAST_REV and last_execution['original_provider_restored'] is True
    assert last_execution['restored_pid'] == EXPECTED_PID
    assert source_execution['training'] == source_execution['retry'] == 0
    assert last_execution['training'] == last_execution['retry'] == 0
    candidate = (LAST / 'candidate_server.py').read_bytes()
    candidate_sha = digest(candidate)
    assert candidate_sha == last_execution['candidate_source_sha256'] == source_execution['candidate_source_sha256'] == NATIVE_CANDIDATE_SHA
    assert (SOURCE_BASE / 'candidate_server.py').read_bytes() == candidate
    compile(candidate, 'candidate_server.py', 'exec')
    for path, expected in LAST_FILES.items():
        assert digest((LAST / path).read_bytes()) == expected, 'fixed_last_source_changed'
    input_bytes = (SOURCE_BASE / 'semantic-history.actual.input.json').read_bytes()
    assert (LAST / 'semantic-history.actual.input.json').read_bytes() == input_bytes
    material = json.loads(input_bytes)
    assert material['all_fictional'] is True and len(material['snapshot']['members']) == 12
    assert digest(canonical(material).encode()) == 'baa0c1d1ed2a9970576ec85b0f5cae390f9d71f33dc0044b41ab684242087472'
    proc = Path('/proc') / str(EXPECTED_PID)
    argv = [value.decode() for value in (proc / 'cmdline').read_bytes().split(b'\0') if value]
    assert argv[1] == str(SERVE), 'provider_process_changed'
    assert all(value != '--context-tokens' and not value.startswith('--context-tokens=') for value in argv)
    cwd = str((proc / 'cwd').resolve())
    # Same restored process state, kept only in this Pod's memory.
    env = dict(value.decode().split('=', 1) for value in (proc / 'environ').read_bytes().split(b'\0') if value)
    ROOT.mkdir(mode=0o700)
    shutil.copytree(LAST / 'ai', ROOT / 'ai')
    for path in (p for p in (LAST / 'ai').rglob('*') if p.is_file() and '__pycache__' not in p.parts):
        assert digest(path.read_bytes()) == digest((ROOT / path.relative_to(LAST)).read_bytes())
    # Only the core's MERGE boundary and compiler change. Native, transport,
    # weights and all other API source remain those of the last execution.
    for path, expected in NEW_FILES.items():
        url = 'https://raw.githubusercontent.com/MassyuRed/mashos-api/' + NEW_API_REV + '/' + path
        with urllib.request.urlopen(url, timeout=20) as response:
            data = response.read(300000)
        assert digest(data) == expected, 'fixed_new_source_mismatch'
        compile(data, path, 'exec')
        (ROOT / path).write_bytes(data)
    (ROOT / 'semantic-history.actual.input.json').write_bytes(input_bytes)
    candidate_path = ROOT / 'candidate_server.py'
    candidate_path.write_bytes(candidate)
    assert digest(candidate_path.read_bytes()) == candidate_sha
    old_root = '/workspace/semantic-history-20261115-once'
    runtime_env = dict(env, PYTHONPATH=old_root + '/client-runtime-deps', PYTHONDONTWRITEBYTECODE='1')
    cpu_env = dict(runtime_env, CUDA_VISIBLE_DEVICES='', HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
    preflight = subprocess.run([argv[0], '-c', PREFLIGHT, str(ROOT), str(SOURCE_BASE),
        NEW_API_REV, MERGE_MESSAGES_SHA, MERGE_REQUEST_REF], cwd=ROOT, env=cpu_env,
        stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=45)
    (ROOT / 'cpu-preflight.stdout').write_bytes(preflight.stdout)
    (ROOT / 'cpu-preflight.stderr').write_bytes(preflight.stderr)
    assert preflight.returncode == 0, 'source_merge_cpu_preflight_failed'
    capacity_proof = preflight.stdout
    proof = json.loads(capacity_proof)
    assert proof['api_commit'] == NEW_API_REV and proof['messages_sha256'] == MERGE_MESSAGES_SHA
    assert proof['merge_request_ref'] == MERGE_REQUEST_REF and proof['message_bytes'] == 88558
    assert proof['leaf_source_index_count'] == 41
    assert proof['replayed_exact_receipts'] == 12 and proof['new_model_calls'] == 0 and proof['model_loaded'] is False
    assert proof['profile'] == 'semantic_map.history_synthesis.v2'
    assert proof['input_tokens'] + 4096 == proof['with_output4096'] <= 32768 and proof['fits32768'] is True
    (ROOT / 'source-merge-token-capacity.json').write_bytes(capacity_proof)
    capacity_proof_sha = digest(capacity_proof)
    driver = derive_driver((SOURCE_BASE / 'semantic_history_actual_once.py').read_text(),
        candidate_sha, capacity_proof_sha)
    driver_path = ROOT / 'semantic_history_actual_once.py'
    driver_path.write_text(driver)
    state = dict(api_commit=NEW_API_REV, source_base_api_commit=SOURCE_BASE_REV, last_api_commit=LAST_REV,
        new_api_files=NEW_FILES, state='PREPARED', source_base=str(SOURCE_BASE), last_trial=str(LAST),
        candidate_source_sha256=candidate_sha, driver_sha256=digest(driver.encode()),
        max_model_calls=1, reused_responses=12, context_tokens=32768,
        outer_seconds=480, acquisition_phase_seconds=390, pipeline_seconds=320,
        prior_pipeline_seconds=516.389, merge_messages_sha256=MERGE_MESSAGES_SHA,
        merge_request_ref=MERGE_REQUEST_REF, leaf_source_index_count=41,
        merge_message_bytes=proof['message_bytes'], merge_input_tokens=proof['input_tokens'],
        merge_with_output_tokens=proof['with_output4096'],
        token_capacity_proof_sha256=capacity_proof_sha,
        training=0, retry=0, original_provider_restored=False)
    def save():
        (ROOT / 'execution.json').write_text(canonical(state) + '\n')
    save()
    health_wait(3)
    child = None
    original_stopped = False
    def deadline(signum, frame):
        raise TimeoutError('source_merge_deadline_restore_reserved')
    signal.signal(signal.SIGTERM, deadline)
    signal.signal(signal.SIGALRM, deadline)
    # The acquisition phase has 390s including preparation/provider load. Stopping the
    # candidate (25s) and restoring the original (45s) retain a 20s margin.
    remaining_acquisition = started + 390 - time.monotonic()
    if remaining_acquisition <= 0:
        raise TimeoutError('source_merge_preparation_deadline')
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
                timeout=min(330, max(.001, started + 390 - time.monotonic())))
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
                assert state['elapsed_seconds'] < 480, 'restore_budget_exceeded'
    print(canonical(state))


if __name__ == '__main__':
    main()
