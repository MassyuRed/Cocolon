"""One no-training v7 matrix comparison: exact OM6 on a2e versus research6c.

prepare/run API NEW_ROOT; initial/research are bounded child phases only.
The same frozen snapshots/messages/ref reach both adapters once. Six new calls
per adapter, two loads and 240 seconds total; no retry, grammar change or normal
adoption. Storage is the existing isolated mock RPC seam, never production SQL.
Each response is immediately consumed again with zero model calls.
"""
import asyncio
import copy
import gc
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

MODE, api_arg, root_arg = sys.argv[1:4]
API, ROOT = Path(api_arg), Path(root_arg)
COMMIT = '4d744e36a093aac3ad157a448f06ef6be2be59cb'
CPU = Path('/workspace/analysis-actor-ownership-matrix6-cpu-20261105')
TEACHERS_SHA = '15b983c0f35cacb6ec46ea7290bbfb6f66e1634715745e044d6651b01b276b03'
SOURCES_SHA = 'ebf0a7b2d426a94ef7b2d4555f80ca06c87265b06fcbf9dc9f51c89303fe3137'
SEAM = Path('/workspace/actor_ownership_trial.py')
SEAM_SHA = 'dfb10128d30420f1023b653d8f43141b3252b735b9acc52ffba83af343c3cfa7'
LIMIT = 240
ADAPTERS = dict(
    initial=dict(path='/workspace/analysis-material-v4-pair8-20261103/train/adapter',
        weights_sha256='a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59',
        config_sha256='006ebf7bef859264b3778126f4a0f6512e1b2a7e6049b09dfcf0d56603ede3a9'),
    research=dict(path='/workspace/analysis-actor-ownership-balanced48-20261105/train/adapter',
        weights_sha256='6c879a887e3188f4fa2b6e1df573c8648febaac1661dd874f385d72d1edbd6c9',
        config_sha256='1deacb44b87cd363b94fd85fe7f86d5ee671ffe10f6d248405783ecaf45509db'))
sys.dont_write_bytecode = True
os.environ.update(HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert sha(SEAM) == SEAM_SHA
spec = importlib.util.spec_from_file_location('matrix6_probe_seam', SEAM)
seam = importlib.util.module_from_spec(spec)
spec.loader.exec_module(seam)
seam.api, seam.root, seam.mode = API, ROOT, MODE
canonical = seam.admission.canonical
write = seam.write


def check_inputs():
    assert subprocess.check_output(['git', '-C', str(API), 'rev-parse', 'HEAD'], text=True).strip() == COMMIT
    assert not subprocess.check_output(['git', '-C', str(API), 'status', '--porcelain', '--untracked-files=no'], text=True).strip()
    assert sha(CPU/'teachers.json') == TEACHERS_SHA
    assert sha(CPU/'independent_sources.json') == SOURCES_SHA
    for adapter in ADAPTERS.values():
        assert sha(Path(adapter['path'])/'adapter_model.safetensors') == adapter['weights_sha256']
        assert sha(Path(adapter['path'])/'adapter_config.json') == adapter['config_sha256']


def prepare():
    check_inputs()
    assert not ROOT.exists(), 'do_not_restart_or_replace_partial_root'
    cpu_report = json.loads((CPU/'report.json').read_text())
    assert cpu_report['status'] == 'COMPLETE_CPU_ONLY_NOT_TRAINED'
    assert cpu_report['old22_exact'] and cpu_report['teachers_sha256'] == TEACHERS_SHA
    assert cpu_report['new_training'] == cpu_report['new_generation'] == cpu_report['model_loads'] == 0
    teachers = json.loads((CPU/'teachers.json').read_text())
    assert len(teachers['teachers']) == 28 and teachers['update_order'] is teachers['initial_adapter'] is None
    selected = [t for t in teachers['teachers'] if t['id'] in {f'OM{i:02}' for i in range(1, 7)}]
    assert [t['id'] for t in selected] == [f'OM{i:02}' for i in range(1, 7)]
    sources = json.loads((CPU/'independent_sources.json').read_text())['examples']
    assert [r['id'] for r in sources] == [t['id'] for t in selected]
    from serve_emlis_natural_reply import MODEL, REVISION, PINS
    from transformers import AutoTokenizer
    assert {n: version(n) for n in PINS} == PINS == cpu_report['pins']
    assert MODEL == cpu_report['model'] and REVISION == cpu_report['revision']
    tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION,
        local_files_only=True, trust_remote_code=False)
    rows = []
    for teacher, source in zip(selected, sources):
        row = dict(id=teacher['id'], owner=teacher['owner'], snapshot=copy.deepcopy(teacher['snapshot']),
            prompt_version='selected_material.v7',
            provenance='KAREN_INDEPENDENT_SYNTHETIC_DIAGNOSTIC_NOT_TRAINED_NOT_GENERAL_ACCURACY')
        prepared, expected = seam.prepare_row(row)
        assert prepared.messages() == teacher['messages'] and prepared.request_ref == teacher['request_ref']
        prompt = tokenizer.apply_chat_template(expected['messages'], enable_thinking=False,
            add_generation_prompt=True, tokenize=True, return_dict=False, truncation=False)
        assert len(prompt) + 2048 <= 8192
        expected.update(input_tokens=len(prompt), reserved_new_tokens=2048, max_context_tokens=8192)
        rows.append(dict(row=row, expected=expected, assistant_target=teacher['assistant_target'],
            actor_condition=source['actor_condition'], negative=source['negative']))
    ROOT.mkdir()
    shutil.copyfile(__file__, ROOT/'runner.py')
    shutil.copyfile(SEAM, ROOT/'ownership_seam.py')
    shutil.copyfile(CPU/'teachers.json', ROOT/'cpu_teachers.json')
    shutil.copyfile(CPU/'report.json', ROOT/'cpu_report.json')
    shutil.copyfile(CPU/'independent_sources.json', ROOT/'independent_sources.json')
    write(ROOT/'pack.json', dict(status='CPU_PREPARED_NO_MODEL', rows=rows,
        adapters=ADAPTERS, teachers_sha256=TEACHERS_SHA, sources_sha256=SOURCES_SHA,
        seam_sha256=SEAM_SHA, api_commit=COMMIT, prompt_version='selected_material.v7',
        model=MODEL, revision=REVISION, pins=PINS, max_seconds=LIMIT,
        planned_new_generation=12, planned_model_loads=2, new_training=0,
        normal_adoption=False, next_training_initial_adoption=False,
        interpretation='Independent synthetic matrix; not a general accuracy estimate.'))
    write(ROOT/'cpu_manifest.json', {str(p.relative_to(ROOT)): sha(p) for p in ROOT.rglob('*') if p.is_file()})
    print(canonical(dict(status='CPU_PREPARED_NO_MODEL', rows=6, new_training=0,
        new_generation=0, model_loads=0, planned_calls=12, planned_loads=2,
        max_seconds=LIMIT, pack_sha256=sha(ROOT/'pack.json'))))


def phase(deadline):
    check_inputs()
    pack = json.loads((ROOT/'pack.json').read_text())
    assert pack['adapters'] == ADAPTERS and pack['teachers_sha256'] == TEACHERS_SHA
    from serve_emlis_natural_reply import load_generator, MODEL, REVISION, PINS
    assert MODEL == pack['model'] and REVISION == pack['revision']
    assert {n: version(n) for n in PINS} == PINS == pack['pins']
    directory = ROOT/MODE
    directory.mkdir()
    cold_directory = directory/'cold'
    cold_directory.mkdir()
    report = dict(status='STARTED', phase=MODE, cases=[], replay_cases=[],
        new_generation=0, model_calls_started=0, model_loads=0, model_loads_started=1,
        new_training=0, normal_adoption=False, adapter=ADAPTERS[MODE],
        per_call_seconds=23, max_context_tokens=8192, max_new_tokens=2048)
    generator = None
    started = time.monotonic()
    write(ROOT/(MODE+'.json'), report)
    try:
        adapter = ADAPTERS[MODE]
        generator = load_generator(adapter['path'], threading.Event(),
            weights_sha256=adapter['weights_sha256'], config_sha256=adapter['config_sha256'])
        report['model_loads'] = 1
        write(ROOT/(MODE+'.json'), report)

        def bounded_generate(messages, requested_deadline):
            assert report['model_calls_started'] <= 6
            return generator(messages, min(deadline, requested_deadline, time.monotonic()+23))

        for item in pack['rows']:
            assert time.monotonic() < deadline
            seam.root, seam.mode = directory, MODE
            case = asyncio.run(seam.one(item['row'], item['expected'], report=report,
                generator=bounded_generate, deadline=deadline))
            assert case['response']['finish_reason'] == 'stop'
            try:
                case['teacher_json_matches'] = json.loads(case['response']['raw']) == json.loads(item['assistant_target'])
            except ValueError:
                case['teacher_json_matches'] = False
            case['expected_actor_condition'] = item['actor_condition']
            if item['actor_condition'] == 'EXPLICIT_OTHER':
                assert case['status'] != 'SAVED', 'other_actor_must_not_be_adopted_as_self'
            if item['actor_condition'] == 'OMITTED' and case['status'] == 'SAVED':
                assert '誰の行動かは未確定' in case['result']['content_text']
            report['cases'].append(case)
            write(ROOT/(MODE+'.json'), report)
            # Reconsume this exact wire response with no generator. The seam
            # separately forbids generation during saved current/monthly reads.
            cold_report = dict(model_calls_started=0, new_generation=0, model_loads=0)
            seam.root, seam.mode = cold_directory, 'cold-'+MODE
            restored = asyncio.run(seam.one(item['row'], item['expected'], report=cold_report,
                response=case['response']))
            assert cold_report == dict(model_calls_started=0, new_generation=0, model_loads=0)
            # Optional diagnostic metadata is not part of the canonical seam.
            original_case = {k:v for k,v in case.items() if k not in {'teacher_json_matches', 'expected_actor_condition'}}
            seam.compare_replay(original_case, restored)
            assert canonical(original_case.get('candidate')) == canonical(restored.get('candidate'))
            report['replay_cases'].append(dict(id=item['row']['id'], status=restored['status'],
                request_response_identical=True, candidate_graph_text_diagram_identical=True,
                model_calls_started=0, model_loads=0, new_generation=0))
            write(cold_directory/(item['row']['id']+'.case.json'), restored)
            write(ROOT/(MODE+'.json'), report)
        assert len(report['cases']) == len(report['replay_cases']) == 6
        assert report['model_calls_started'] == report['new_generation'] == 6
        report.update(status='COMPLETE_PENDING_ALL_RAW_REVIEW_NOT_ADOPTED',
            saved=sum(c['status']=='SAVED' for c in report['cases']),
            unsupported=sum(c['status']=='UNSUPPORTED' for c in report['cases']),
            rejected=sum(c['status']=='REJECTED' for c in report['cases']),
            teacher_json_matches=sum(c['teacher_json_matches'] for c in report['cases']))
    except BaseException as error:
        report.update(status='FAILED_NO_RETRY_NOT_ADOPTED', error_type=type(error).__name__, traceback=traceback.format_exc())
        raise
    finally:
        report['seconds'] = time.monotonic()-started
        try:
            check_inputs()
            report['source_and_adapters_unchanged'] = True
        except BaseException:
            report.update(status='FAILED_FINAL_INPUT_CHANGED_NOT_ADOPTED', source_and_adapters_unchanged=False)
        write(ROOT/(MODE+'.json'), report)
        generator = None
        gc.collect()
        if report['model_loads']:
            import torch
            torch.cuda.empty_cache()


def checkpoint_accounting(report):
    """Recover observed counters even when a bounded child could not finish."""
    counters = {}
    for part in ('initial', 'research'):
        states, paths, errors = [], [], []
        for path in (ROOT/(part+'.json'), ROOT/part/'live.json'):
            if not path.exists():
                continue
            try:
                state = json.loads(path.read_text())
            except (ValueError, OSError) as error:
                errors.append(dict(path=str(path.relative_to(ROOT)), error_type=type(error).__name__))
            else:
                states.append(state)
                paths.append(str(path.relative_to(ROOT)))
        received = 0
        for path in (ROOT/part).glob('*.response.json'):
            try:
                response = json.loads(path.read_text())['response']
                assert hashlib.sha256(response['raw'].encode()).hexdigest() == response['raw_sha256']
            except (ValueError, KeyError, TypeError, AssertionError, OSError) as error:
                errors.append(dict(path=str(path.relative_to(ROOT)), error_type=type(error).__name__))
            else:
                received += 1
        launched = part in report.get('launched_phases', [])
        final = states[0] if paths and paths[0] == part+'.json' else None
        complete = final is not None and final.get('status') == 'COMPLETE_PENDING_ALL_RAW_REVIEW_NOT_ADOPTED'
        known = bool(states) or not launched
        started = max([s.get('model_calls_started', 0) for s in states]+[received])
        generations = max([s.get('new_generation', 0) for s in states]+[received])
        loads = max([s.get('model_loads', 0) for s in states]+[int(started > 0)])
        load_attempts = max([s.get('model_loads_started', 0) for s in states]+[loads])
        counters[part] = dict(checkpoints=paths, checkpoint_errors=errors,
            checkpoint_status='COMPLETE' if complete else ('PARTIAL' if states or received else
                ('MISSING_AFTER_LAUNCH' if launched else 'NOT_LAUNCHED')),
            counts_are_checkpoint_minima=not complete and launched,
            model_calls_started=started if known else None,
            new_generation=generations if known else None,
            model_loads_started=load_attempts if known else None,
            model_loads=loads if known else None,
            received_raw_files=received,
            completed_cases=max([len(s.get('cases', [])) for s in states]+[0]),
            zero_model_replayed=max([len(s.get('replay_cases', [])) for s in states]+[0]))
    report['phase_checkpoint_accounting'] = counters
    report['counts_are_checkpoint_minima'] = any(c['counts_are_checkpoint_minima'] for c in counters.values())
    for name in ('model_calls_started', 'new_generation', 'model_loads_started', 'model_loads'):
        values = [c[name] for c in counters.values()]
        report[name+'_observed_minimum'] = sum(v for v in values if v is not None)
        report[name] = sum(values) if all(v is not None for v in values) else None
    report['zero_model_replayed'] = sum(c['zero_model_replayed'] for c in counters.values())


def run():
    check_inputs()
    manifest = json.loads((ROOT/'cpu_manifest.json').read_text())
    assert all(sha(ROOT/name) == digest for name,digest in manifest.items())
    assert not subprocess.check_output(['nvidia-smi', '--query-compute-apps=pid,used_memory', '--format=csv,noheader'], text=True).strip()
    with (ROOT/'run_started.json').open('x') as stream:
        json.dump(dict(max_seconds=LIMIT, planned_calls=12, planned_loads=2, new_training=0), stream)
    report = dict(status='STARTED', stages=[], launched_phases=[], new_training=0, new_generation=0,
        model_loads=0, normal_adoption=False, next_training_initial_adoption=False,
        api_commit=COMMIT, teachers_sha256=TEACHERS_SHA, max_seconds=LIMIT)
    started = time.monotonic()
    deadline = started+LIMIT
    try:
        for part in ('initial', 'research'):
            remaining = int(deadline-time.monotonic())-10
            assert remaining > 0
            report['launched_phases'].append(part)
            write(ROOT/'report.json', report)
            with (ROOT/(part+'.log')).open('x') as log:
                result = subprocess.run(['timeout', '--signal=TERM', '--kill-after=5', str(remaining),
                    sys.executable, str(ROOT/'runner.py'), part, str(API), str(ROOT), str(deadline)],
                    stdout=log, stderr=subprocess.STDOUT)
            report['stages'].append(dict(phase=part, exit=result.returncode))
            write(ROOT/'report.json', report)
            assert result.returncode == 0, part
        initial = json.loads((ROOT/'initial.json').read_text())
        research = json.loads((ROOT/'research.json').read_text())
        assert initial['status'] == research['status'] == 'COMPLETE_PENDING_ALL_RAW_REVIEW_NOT_ADOPTED'
        assert len(initial['cases']) == len(research['cases']) == 6
        comparisons = []
        for before, after in zip(initial['cases'], research['cases']):
            assert before['row'] == after['row'] and before['request'] == after['request']
            comparisons.append(dict(id=before['row']['id'], input_identical=True,
                before_status=before['status'], after_status=after['status'],
                before_teacher_json_matches=before['teacher_json_matches'],
                after_teacher_json_matches=after['teacher_json_matches'],
                raw_identical=before['response']['raw'] == after['response']['raw']))
        report.update(status='COMPLETE_PENDING_ALL_RAW_REVIEW_NOT_ADOPTED',
            new_generation=12, model_loads=2, zero_model_replayed=12, comparisons=comparisons,
            before_saved=initial['saved'], after_saved=research['saved'],
            before_teacher_matches=initial['teacher_json_matches'], after_teacher_matches=research['teacher_json_matches'])
    except BaseException as error:
        report.update(status='FAILED_NO_RETRY_NOT_ADOPTED', error_type=type(error).__name__, traceback=traceback.format_exc())
        raise
    finally:
        report['seconds'] = time.monotonic()-started
        checkpoint_accounting(report)
        try:
            check_inputs()
            report['source_and_adapters_unchanged'] = True
        except BaseException:
            report.update(status='FAILED_FINAL_INPUT_CHANGED_NOT_ADOPTED', source_and_adapters_unchanged=False)
        report['gpu_after_process'] = subprocess.check_output(['nvidia-smi', '--query-gpu=memory.used,utilization.gpu', '--format=csv,noheader'], text=True).strip()
        write(ROOT/'report.json', report)
        write(ROOT/'manifest.json', {str(p.relative_to(ROOT)):sha(p) for p in ROOT.rglob('*') if p.is_file()})
        with zipfile.ZipFile(ROOT.with_suffix('.zip'), 'x', compression=zipfile.ZIP_DEFLATED) as archive:
            for path in sorted(ROOT.rglob('*')):
                if path.is_file():
                    archive.write(path, str(path.relative_to(ROOT)))
        print(canonical(report))


if __name__ == '__main__':
    if MODE in ('initial', 'research'):
        def terminated(*_):
            raise TimeoutError('bounded_child_terminated')
        signal.signal(signal.SIGTERM, terminated)
    if MODE == 'prepare': prepare()
    elif MODE == 'run': run()
    elif MODE in ('initial', 'research'): phase(float(sys.argv[4]))
    else: raise ValueError('unknown stage')
