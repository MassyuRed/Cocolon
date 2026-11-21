"""Bounded 2 x 2 metadata diagnostic; no training, semantic save or adoption.

Usage: python actor_ownership_metadata4_trial.py prepare|run API NEW_ROOT
Run only after a successful prepare on a new root. All four cells are newly
generated once with the unchanged research adapter. Old outputs are references,
never rebound as responses to new inputs. A failed/partial root is not restarted.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import importlib.util
from importlib.metadata import version
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

API_COMMIT = '4d744e36a093aac3ad157a448f06ef6be2be59cb'
LOADER = 'ai/tools/serve_emlis_natural_reply.py'
LOADER_SHA = 'd3b7a04e38769485da995c8323aaaaf4426ff5273fcba6dff578ada85bdb77b6'
ADAPTER = Path('/workspace/analysis-actor-ownership-balanced48-20261105/train/adapter')
WEIGHTS = '6c879a887e3188f4fa2b6e1df573c8648febaac1661dd874f385d72d1edbd6c9'
CONFIG = '1deacb44b87cd363b94fd85fe7f86d5ee671ffe10f6d248405783ecaf45509db'
INPUTS = {
    'ae02': (Path('/workspace/analysis-actor-ownership-balanced48-20261105/after-AE02.response.json'),
        '70525eaadaf423699993c670c0ffe6c41d98b1eb5fcf3711584b3aeed17c166e'),
    'https': (Path('/workspace/analysis-explicit-v7-https-live-20261105.json'),
        '771c19950ba9069e31442b24cf80f7d1b4baaf5430e48cfa9ef155046658ad3d'),
}
MAX_SECONDS = 120
MAX_REQUESTS = 4
PER_REQUEST_SECONDS = 23


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True,
        separators=(',', ':'), allow_nan=False)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def digest(value):
    return hashlib.sha256(canonical(value).encode()).hexdigest()


def write(path, value):
    temporary = path.with_name(path.name + '.tmp')
    temporary.write_text(canonical(value))
    temporary.replace(path)


def check_identity(api):
    assert subprocess.check_output(['git', '-C', str(api), 'rev-parse', 'HEAD'], text=True).strip() == API_COMMIT
    assert not subprocess.check_output(['git', '-C', str(api), 'status', '--porcelain', '--untracked-files=no'], text=True)
    assert sha(api/LOADER) == LOADER_SHA
    for path, expected in INPUTS.values():
        assert sha(path) == expected
    assert sha(ADAPTER/'adapter_model.safetensors') == WEIGHTS
    assert sha(ADAPTER/'adapter_config.json') == CONFIG


def load_probe(api):
    spec = importlib.util.spec_from_file_location('metadata4_existing_probe', api/LOADER)
    probe = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(probe)
    assert {n: version(n) for n in probe.PINS} == probe.PINS
    return probe


def make_cells(ae, live):
    assert live['phase'] == 'COMPLETE' and live['mode'] == 'gpu'
    assert live['adapter_weights_sha256'] == WEIGHTS and live['adapter_config_sha256'] == CONFIG
    assert len(live['cases']) == len(live['model_calls']) == 4
    assert live['cases'][2]['id'] == 'VH03' and live['cases'][2]['model_calls'] == 1
    actual = live['model_calls'][2]
    assert actual['index'] == 3 and actual['phase'] == 'RECEIVED' and actual['finish_reason'] == 'stop'
    old_messages, new_messages = ae['request']['messages'], actual['messages']
    assert len(old_messages) == len(new_messages) == 2
    assert old_messages[0] == new_messages[0] and old_messages[0]['role'] == 'system'
    assert old_messages[1]['role'] == new_messages[1]['role'] == 'user'
    assert ae['request']['prompt_version'] == 'selected_material.v7'
    assert ae['request']['messages_sha256'] == digest(old_messages)
    assert actual['messages_sha256'] == digest(new_messages)
    for response in (ae['response'], actual):
        assert response['finish_reason'] == 'stop'
        assert response['raw_sha256'] == hashlib.sha256(response['raw'].encode()).hexdigest()
    old_user = json.loads(old_messages[1]['content'])
    new_user = json.loads(new_messages[1]['content'])
    assert canonical(old_user) == old_messages[1]['content']
    assert canonical(new_user) == new_messages[1]['content']
    assert len(old_user['records']) == len(new_user['records']) == 1
    assert old_user['analysis_as_of'] != new_user['analysis_as_of']
    assert old_user['records'][0]['emotion_details'] == []
    assert new_user['records'][0]['emotion_details'] == [dict(strength='medium', type='平穏')]
    expected_new = copy.deepcopy(old_user)
    expected_new['analysis_as_of'] = new_user['analysis_as_of']
    expected_new['records'][0]['emotion_details'] = new_user['records'][0]['emotion_details']
    assert expected_new == new_user, 'inputs_differ_beyond_the_two_metadata_factors'
    assert len(old_user['fields']) == 1 and old_user['fields'][0]['field_path'] == 'memo'
    assert old_user['fields'] == new_user['fields']
    assert old_user['records'][0]['recorded_at'] == new_user['records'][0]['recorded_at']
    assert old_user['records'][0]['selected_categories'] == new_user['records'][0]['selected_categories']
    assert old_user['records'][0]['selected_emotions'] == new_user['records'][0]['selected_emotions']
    assert any(p['messages'] == new_messages and p['messages_sha256'] == digest(new_messages)
        for p in live['prepared_inputs'])
    cells = []
    for time_level in (0, 1):
        for details_level in (0, 1):
            source_time = (old_user, new_user)[time_level]
            source_details = (old_user, new_user)[details_level]
            user = copy.deepcopy(old_user)
            user['analysis_as_of'] = source_time['analysis_as_of']
            user['records'][0]['emotion_details'] = copy.deepcopy(source_details['records'][0]['emotion_details'])
            messages = copy.deepcopy(old_messages)
            messages[1]['content'] = canonical(user)
            assert messages[0] == old_messages[0] and user['fields'] == old_user['fields']
            cells.append(dict(id=f'META{time_level}{details_level}',
                factors=dict(analysis_as_of='old' if time_level == 0 else 'new',
                    emotion_details='empty' if details_level == 0 else 'medium'),
                messages=messages, messages_sha256=digest(messages)))
    assert cells[0]['messages'] == old_messages and cells[-1]['messages'] == new_messages
    assert len({c['messages_sha256'] for c in cells}) == 4
    references = dict(ae02_raw_sha256=ae['response']['raw_sha256'],
        vh03_raw_sha256=actual['raw_sha256'],
        ae02_original_request_ref=ae['request']['request_ref'],
        prior_responses_are_not_rebound=True,
        model_input_differences=['analysis_as_of', 'records[0].emotion_details'])
    return cells, references


def prepare(api, root):
    assert not root.exists(), 'do_not_restart_or_replace_partial_root'
    check_identity(api)
    probe = load_probe(api)
    ae, live = (json.loads(INPUTS[k][0].read_text()) for k in ('ae02', 'https'))
    cells, references = make_cells(ae, live)
    from transformers import AutoTokenizer
    tokenizer = AutoTokenizer.from_pretrained(probe.MODEL, revision=probe.REVISION,
        local_files_only=True, trust_remote_code=False)
    for cell in cells:
        tokens = tokenizer.apply_chat_template(cell['messages'], enable_thinking=False,
            add_generation_prompt=True, tokenize=True, return_dict=False, truncation=False)
        assert len(tokens) + 2048 <= 8192
        cell.update(prompt_tokens=len(tokens), prompt_token_ids_sha256=digest(tokens))
    root.mkdir()
    write(root/'report.json', dict(status='PREPARING_CPU_ONLY', new_training=0,
        new_generation=0, model_loads=0, normal_adoption=False))
    shutil.copyfile(__file__, root/'runner.py')
    for label, (path, _) in INPUTS.items():
        shutil.copyfile(path, root/(label+'_source.json'))
    pack = dict(schema_version='analysis_actor_metadata4_model_only.v1',
        api_commit=API_COMMIT, loader_sha256=LOADER_SHA, source_hashes={k:h for k,(_,h) in INPUTS.items()},
        adapter_weights_sha256=WEIGHTS, adapter_config_sha256=CONFIG,
        model=probe.MODEL, revision=probe.REVISION, pins=probe.PINS,
        cells=cells, references=references, new_training=0, normal_adoption=False,
        public_or_database_storage=False, source_response_binding_created=False,
        max_processing_seconds=MAX_SECONDS, per_request_seconds=PER_REQUEST_SECONDS,
        max_new_generation=4, max_model_loads=1,
        interpretation='Known source, crossed metadata; not a held-out semantic quality or storage test.')
    write(root/'pack.json', pack)
    write(root/'report.json', dict(status='PREPARED_MODEL_NOT_RUN', cells=4,
        new_training=0, new_generation=0, model_loads=0, normal_adoption=False,
        max_processing_seconds=MAX_SECONDS, pack_sha256=sha(root/'pack.json')))
    check_identity(api)
    print(canonical(dict(status='PREPARED_MODEL_NOT_RUN', cells=4,
        pack_sha256=sha(root/'pack.json'), new_generation=0, model_loads=0)))


def generate_phase(api, root, deadline, pack_sha):
    assert sha(root/'pack.json') == pack_sha
    assert sha(__file__) == sha(root/'runner.py')
    assert json.loads((root/'run_started.json').read_text())['pack_sha256'] == pack_sha
    assert json.loads((root/'report.json').read_text())['status'] == 'RUNNING_MODEL_ONLY'
    assert not (root/'generation.json').exists(), 'do_not_restart_or_replace_partial_generation'
    check_identity(api)
    pack = json.loads((root/'pack.json').read_text())
    assert len(pack['cells']) == MAX_REQUESTS and pack['normal_adoption'] is False
    probe = load_probe(api)
    stop = threading.Event()
    started = time.monotonic()
    report = dict(status='MODEL_LOADING', cases=[], model_loads_started=1, model_loads=0,
        model_calls_started=0, new_generation=0, stop_count=0, new_training=0,
        normal_adoption=False, model_only=True, semantic_save_performed=False,
        database_or_api_calls=0, adapter_weights_sha256=WEIGHTS,
        adapter_config_sha256=CONFIG, pack_sha256=pack_sha)

    def checkpoint():
        report['seconds'] = time.monotonic() - started
        write(root/'generation.json', report)

    def terminated(signum, _frame):
        stop.set()
        report.update(status='TERMINATED_PARTIAL_NO_RETRY', signal=signum)
        checkpoint()
        raise SystemExit(128 + signum)

    signal.signal(signal.SIGTERM, terminated)
    signal.signal(signal.SIGINT, terminated)
    checkpoint()
    try:
        generator = probe.load_generator(str(ADAPTER), stop,
            weights_sha256=WEIGHTS, config_sha256=CONFIG)
        report.update(model_loads=1, status='GENERATING')
        checkpoint()
        for cell in pack['cells']:
            assert report['model_calls_started'] < MAX_REQUESTS
            assert time.monotonic() < deadline - 3
            assert digest(cell['messages']) == cell['messages_sha256']
            entry = dict(id=cell['id'], factors=cell['factors'],
                messages_sha256=cell['messages_sha256'], phase='STARTED')
            report['cases'].append(entry)
            report['model_calls_started'] += 1
            checkpoint()
            call_start = time.monotonic()
            raw, finish = generator(cell['messages'],
                min(deadline - 3, call_start + PER_REQUEST_SECONDS))
            entry.update(phase='RECEIVED', raw=raw,
                raw_sha256=hashlib.sha256(raw.encode()).hexdigest(),
                finish_reason=finish, seconds=time.monotonic()-call_start)
            report['new_generation'] += 1
            report['stop_count'] += int(finish == 'stop')
            checkpoint()
            assert finish == 'stop', 'nonstop_output_preserved_no_retry'
        assert report['new_generation'] == MAX_REQUESTS
        report.update(status='COMPLETE_MODEL_ONLY_PENDING_MEANING_REVIEW',
            adapter_unchanged=(sha(ADAPTER/'adapter_model.safetensors') == WEIGHTS and
                sha(ADAPTER/'adapter_config.json') == CONFIG))
        assert report['adapter_unchanged']
        check_identity(api)
    except BaseException as error:
        if report['status'] != 'TERMINATED_PARTIAL_NO_RETRY':
            report.update(status='FAILED_PARTIAL_NO_RETRY', error_type=type(error).__name__,
                traceback=traceback.format_exc())
        raise
    finally:
        stop.set()
        checkpoint()


def archive(root):
    target = Path(str(root)+'.zip')
    assert not target.exists(), 'do_not_replace_archive'
    members = [p for p in root.rglob('*') if p.is_file() and p.name != 'manifest.json']
    manifest = {str(p.relative_to(root)):sha(p) for p in members}
    write(root/'manifest.json', manifest)
    with zipfile.ZipFile(target, 'x', compression=zipfile.ZIP_DEFLATED) as out:
        for path in members+[root/'manifest.json']:
            out.write(path, str(path.relative_to(root)))
    with zipfile.ZipFile(target) as out:
        assert out.testzip() is None
    return dict(path=str(target), bytes=target.stat().st_size, sha256=sha(target),
        members=len(members)+1)


def run(api, root):
    assert root.is_dir()
    assert sha(__file__) == sha(root/'runner.py')
    prepared = json.loads((root/'report.json').read_text())
    assert prepared['status'] == 'PREPARED_MODEL_NOT_RUN'
    pack_sha = sha(root/'pack.json')
    assert pack_sha == prepared['pack_sha256']
    check_identity(api)
    with (root/'run_started.json').open('x') as out:
        json.dump(dict(pack_sha256=pack_sha, max_seconds=MAX_SECONDS,
            max_model_loads=1, max_new_generation=4, new_training=0), out)
    started = time.monotonic()
    deadline = started+MAX_SECONDS
    report = dict(status='RUNNING_MODEL_ONLY', max_processing_seconds=MAX_SECONDS,
        new_training=0, normal_adoption=False, model_only=True,
        semantic_save_performed=False, database_or_api_calls=0,
        generated_report='generation.json', pack_sha256=pack_sha)
    write(root/'report.json', report)
    proc = None
    try:
        with (root/'generation.log').open('x') as log:
            proc = subprocess.Popen([sys.executable, __file__, '_generate', str(api), str(root),
                str(deadline), pack_sha], stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
            try:
                code = proc.wait(timeout=max(1, deadline-time.monotonic()-5))
            except subprocess.TimeoutExpired:
                os.killpg(proc.pid, signal.SIGTERM)
                try:
                    proc.wait(timeout=2)
                except subprocess.TimeoutExpired:
                    os.killpg(proc.pid, signal.SIGKILL)
                    proc.wait(timeout=1)
                raise TimeoutError('bounded_model_process_expired_no_retry')
        report['child_exit'] = code
        child = json.loads((root/'generation.json').read_text())
        report.update(new_generation=child['new_generation'], model_calls_started=child['model_calls_started'],
            model_loads=child['model_loads'], model_loads_started=child['model_loads_started'],
            stop_count=child['stop_count'])
        assert code == 0 and child['status'] == 'COMPLETE_MODEL_ONLY_PENDING_MEANING_REVIEW'
        assert child['new_generation'] == child['stop_count'] == MAX_REQUESTS
        assert child['model_loads'] == child['model_loads_started'] == 1
        check_identity(api)
        report['status'] = 'COMPLETE_MODEL_ONLY_PENDING_MEANING_REVIEW'
    except BaseException as error:
        report.update(status='FAILED_PARTIAL_NO_RETRY', error_type=type(error).__name__,
            traceback=traceback.format_exc())
        raise
    finally:
        if proc is not None and proc.poll() is None:
            os.killpg(proc.pid, signal.SIGKILL)
            proc.wait(timeout=1)
        child_path=root/'generation.json'
        if child_path.exists():
            child=json.loads(child_path.read_text())
            for key in ('new_generation','model_calls_started','model_loads','model_loads_started','stop_count'):
                report[key]=child.get(key,0)
        report['seconds']=time.monotonic()-started
        write(root/'report.json',report)
        saved=archive(root)
        print(canonical(dict(report=report,archive=saved)))


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode',choices=('prepare','run','_generate'))
    parser.add_argument('api',type=Path)
    parser.add_argument('root',type=Path)
    parser.add_argument('deadline',nargs='?',type=float)
    parser.add_argument('pack_sha',nargs='?')
    args=parser.parse_args()
    sys.dont_write_bytecode=True
    os.environ.update(HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
    if args.mode=='prepare':
        prepare(args.api,args.root)
    elif args.mode=='run':
        run(args.api,args.root)
    else:
        assert args.deadline is not None and args.pack_sha is not None
        generate_phase(args.api,args.root,args.deadline,args.pack_sha)


if __name__=='__main__':
    main()
