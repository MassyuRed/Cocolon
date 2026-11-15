"""One fictional acquisition; keep credentials and restart state inside this Pod."""
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

REV = 'ccdd0a6cc955efa806929943e0e3d4845a44336c'
OLD = Path('/workspace/semantic-history-20261115-once')
ROOT = Path('/workspace/semantic-history-quote-first-20261115-once')
SERVE = Path('/workspace/new-fictional-self-piece4b-once-20261109/piece_ordered_server.py')
SERVE_SHA = 'ad3d301d2d1abd9226703dc72e3734eb8da79d8e0cf084d4b0666e97298370be'
EXPECTED_PID = 113387
OLD_SCHEMA_AST = 'a9595373b3a80b808ff917d267f00f74e61ae7616042fd1c0dfd687cdb21838a'
FILES = {
 'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py': '2c00361fad3680b30fe8e911e2447c2aaf037db27818c09547030fef9d2838c5',
 'ai/services/ai_inference/analysis_cumulative_service.py': 'ee0ea86abb2da1f2ffd2f0fe3c568e82df6f0f4de2b0d55ce7cb52c6571e320a',
 'ai/services/ai_inference/analysis_model_source.py': '41318fde79278d0ec9ed08cefba089d4bff606d3248884c8bfabf11cac57deed',
 'ai/tools/serve_emlis_natural_reply.py': '73d05dde2f0ec46a6484fb01d0b283b51b92627110425a13d50c850bc672000c',
}


def digest(data):
    return hashlib.sha256(data).hexdigest()


def function_text(source, name):
    nodes = [n for n in ast.parse(source).body
        if isinstance(n, ast.FunctionDef) and n.name == name]
    assert len(nodes) == 1, 'function_identity_invalid'
    return nodes[0], ast.get_source_segment(source, nodes[0])


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
        proc = Path('/proc') / str(pid)
        try:
            exited = proc.joinpath('stat').read_text().split(') ', 1)[1].startswith('Z ')
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
        proc = Path('/proc') / str(pid)
        try:
            exited = proc.joinpath('stat').read_text().split(') ', 1)[1].startswith('Z ')
        except FileNotFoundError:
            return
        if exited:
            return
        time.sleep(.25)
    raise RuntimeError('provider_did_not_stop')


def main():
    assert not ROOT.exists(), 'one_shot_root_already_exists'
    original = SERVE.read_bytes()
    assert digest(original) == SERVE_SHA, 'provider_source_changed'
    proc = Path('/proc') / str(EXPECTED_PID)
    argv = [v.decode() for v in (proc / 'cmdline').read_bytes().split(b'\0') if v]
    assert argv[1] == str(SERVE), 'provider_process_changed'
    cwd = str((proc / 'cwd').resolve())
    # Restored in memory on the same Pod; never serialize or print these values.
    env = dict(v.decode().split('=', 1) for v in (proc / 'environ').read_bytes().split(b'\0') if v)
    source_hashes = {str(p.relative_to(OLD)): digest(p.read_bytes())
        for p in (OLD / 'ai').rglob('*') if p.is_file() and '__pycache__' not in p.parts}
    assert len(source_hashes) == 96
    assert digest(json.dumps(source_hashes, sort_keys=True, separators=(',', ':')).encode()) == '1e1e16054383ca511281dda14255e9c81d2701896e32253cdc8d5f62f5463cb7'
    old_driver = (OLD / 'semantic_history_actual_once.py').read_bytes()
    assert digest(old_driver) == 'de461a25279aaa99bb473a383d3214381754e0c7dd2b5d4c65b64393252491bc'
    material = json.loads((OLD / 'semantic-history.actual.input.json').read_text())
    assert material['all_fictional'] is True
    assert digest(json.dumps(material, ensure_ascii=False, sort_keys=True,
        separators=(',', ':'), allow_nan=False).encode()) == 'baa0c1d1ed2a9970576ec85b0f5cae390f9d71f33dc0044b41ab684242087472'
    ROOT.mkdir(mode=0o700)
    state = {'api_commit': REV, 'state': 'PREPARING', 'max_model_calls': 3,
        'outer_seconds': 900, 'pipeline_seconds': 675, 'training': 0,
        'retry': 0, 'original_provider_restored': False}
    def save():
        (ROOT / 'execution.json').write_text(json.dumps(state, sort_keys=True) + '\n')
    save()
    shutil.copytree(OLD / 'ai', ROOT / 'ai')
    shutil.copyfile(OLD / 'semantic-history.actual.input.json', ROOT / 'semantic-history.actual.input.json')
    for path, expected in FILES.items():
        url = 'https://raw.githubusercontent.com/MassyuRed/mashos-api/' + REV + '/' + path
        with urllib.request.urlopen(url, timeout=20) as response:
            data = response.read(300000)
        assert digest(data) == expected, 'fixed_public_source_mismatch'
        dest = ROOT / path
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
    current = original.decode()
    node, old_schema = function_text(current, 'semantic_output_schema')
    assert digest(ast.dump(ast.parse(old_schema), include_attributes=False).encode()) == OLD_SCHEMA_AST
    new = (ROOT / 'ai/tools/serve_emlis_natural_reply.py').read_text()
    _, helper = function_text(new, '_semantic_sentence_quotes')
    _, schema = function_text(new, 'semantic_output_schema')
    _, unique = function_text(new, '_semantic_unique_json_schema_parser')
    parser_node, old_parser = function_text(current, 'semantic_json_parser')
    _, parser = function_text(new, 'semantic_json_parser')
    lines = current.splitlines(keepends=True)
    replacements = [(node, helper + '\n\n\n' + schema), (parser_node, unique + '\n\n\n' + parser)]
    for target, text in sorted(replacements, key=lambda item: item[0].lineno, reverse=True):
        lines[target.lineno-1:target.end_lineno] = [text + '\n']
    candidate = ''.join(lines)
    compile(candidate, 'candidate_server.py', 'exec')
    candidate_path = ROOT / 'candidate_server.py'
    candidate_path.write_text(candidate)
    state['candidate_source_sha256'] = digest(candidate.encode())
    driver = (OLD / 'semantic_history_actual_once.py').read_text()
    assert driver.count('pipeline_seconds=215') == driver.count('timeout=210)') == 1
    driver = driver.replace('pipeline_seconds=215', 'pipeline_seconds=675').replace('timeout=210)', 'timeout=220)')
    driver_path = ROOT / 'semantic_history_actual_once.py'
    driver_path.write_text(driver)
    runtime_env = dict(env, PYTHONPATH=str(OLD / 'client-runtime-deps'), PYTHONDONTWRITEBYTECODE='1')
    # Import-only check. No model acquisition or credential reading in the driver.
    smoke = ('import sys,json;from pathlib import Path;sys.path.insert(0,' + repr(str(ROOT / 'ai/services/ai_inference'))
        + ');import analysis_cumulative_service as c,analysis_semantic_map as s;m=json.loads(Path('
        + repr(str(ROOT / 'semantic-history.actual.input.json')) + ').read_text());p=s.prepare_semantic_map(m["owner"],m["snapshot"]);'
        + 'assert p.request_ref=="analysis-semantic-request:c2528720f72a5b3c6911364f15008a2c3b5a37278a819929c42370a385fb45bc";'
        + 'assert len(p.request.members)==12;assert [len(x.record_refs) for x in c.prepare_semantic_history_batches(p)]==[8,4]')
    subprocess.run([argv[0], '-c', smoke], env=runtime_env, check=True, timeout=20)
    health_wait(3)
    started = time.monotonic()
    child = None
    original_stopped = False
    def deadline(signum, frame):
        raise TimeoutError('acquisition_deadline_restore_reserved')
    signal.signal(signal.SIGTERM, deadline)
    signal.signal(signal.SIGALRM, deadline)
    signal.alarm(780)
    try:
        state['state'] = 'ACTIVATED'
        save()
        original_stopped = True
        stop(EXPECTED_PID)
        with (ROOT / 'candidate-provider.log').open('xb') as log:
            child = subprocess.Popen([argv[0], str(candidate_path)] + argv[2:], cwd=cwd, env=env,
                stdin=subprocess.DEVNULL, stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
        state['candidate_pid'] = child.pid
        save()
        health_wait(45)
        with (ROOT / 'driver.log').open('xb') as log:
            completed = subprocess.run([argv[0], str(driver_path)], cwd=ROOT, env=runtime_env,
                stdin=subprocess.DEVNULL, stdout=log, stderr=subprocess.STDOUT, timeout=715)
        state.update(state='ACQUISITION_FINISHED', driver_exit=completed.returncode)
        save()
    finally:
        signal.alarm(0)
        signal.signal(signal.SIGTERM, signal.SIG_IGN)
        if child is not None:
            stop(child.pid)
        if original_stopped:
            with (ROOT / 'restored-provider.log').open('xb') as log:
                restored = subprocess.Popen(argv, cwd=cwd, env=env, stdin=subprocess.DEVNULL,
                    stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
            state['restored_pid'] = restored.pid
            health_wait(45)
            state['original_provider_restored'] = True
        state['elapsed_seconds'] = time.monotonic() - started
        save()
    print(json.dumps(state, sort_keys=True))


if __name__ == '__main__':
    main()
