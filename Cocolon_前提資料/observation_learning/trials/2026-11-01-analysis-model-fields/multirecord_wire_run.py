"""One private, bounded multirecord-wire trial; never a product entry point.

CLI: run API PREPARED_ROOT; internal before/train/after phases also take the
single parent's monotonic DEADLINE. Preparation and explicit human review are
separate. No retry, raw repair, production API/DB calls, or automatic adoption.

Training, process bounds, and partial-save/archive patterns reuse the verified
actor-balanced48/CE20 execution runners. Only the prepared 24-update curriculum
and fixed 2-before/14-after diagnostic selection differ.
"""
from __future__ import annotations

import argparse
from contextlib import ExitStack
from dataclasses import asdict, replace
import gc
import hashlib
import importlib.util
from importlib.metadata import version
import json
import os
from pathlib import Path
import random
import shutil
import signal
import subprocess
import sys
import threading
import time
import traceback
from unittest.mock import patch
import zipfile

WEIGHTS = 'a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59'
CONFIG = '006ebf7bef859264b3778126f4a0f6512e1b2a7e6049b09dfcf0d56603ede3a9'
SOURCE_PACK_SHA = '30afde6a0735aac0b5f23e737b2b80c72e7dd65ba0cdbe4bc791886473f4bbf1'
OLD_ENCODED_SHA = 'd439ff2017914fc53acf5b41240c88d9421d64edbe36964758f59d492008919b'
EXPECTED_LIMITS = dict(max_seconds=900, max_train_updates=24,
    max_new_generation=16, max_model_loads=3, per_generation_seconds=23,
    output_tokens=2048, context_tokens=8192, max_measurement_forwards=20)
NLL_IDS = ['T01', 'T02', 'N01', 'N02', 'MW01', 'MW02', 'MW03', 'MW04', 'MW05', 'MW06']
API = ROOT = None
admission = None


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True,
        separators=(',', ':'), allow_nan=False)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def digest(value):
    return hashlib.sha256(canonical(value).encode('utf-8')).hexdigest()


def write(path, value):
    path = Path(path)
    temporary = path.with_suffix(path.suffix+'.tmp')
    temporary.write_text(canonical(value)+'\n', encoding='utf-8')
    temporary.replace(path)


def read(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def check_deadline(deadline):
    if time.monotonic() >= deadline:
        raise TimeoutError('multirecord_wire_deadline')


def check_api(pack):
    assert subprocess.check_output(['git', '-C', str(API), 'rev-parse', 'HEAD'],
        text=True).strip() == pack['api_commit'], 'api_head_changed'
    assert not subprocess.check_output(['git', '-C', str(API), 'status',
        '--porcelain', '--untracked-files=no'], text=True).strip(), 'api_not_clean'
    assert type(pack['source_hashes']) is dict and pack['source_hashes']
    for relative, expected in pack['source_hashes'].items():
        path = (API/relative).resolve()
        assert path.is_relative_to(API) and sha(path) == expected, 'api_source_changed'


def check_initial(pack):
    initial = Path(pack['initial_adapter'])
    assert pack['initial_weights_sha256'] == WEIGHTS and pack['initial_config_sha256'] == CONFIG
    assert sha(initial/'adapter_model.safetensors') == WEIGHTS, 'initial_weights_changed'
    assert sha(initial/'adapter_config.json') == CONFIG, 'initial_config_changed'
    return initial


def check_originals(pack):
    assert pack['source_pack_sha256'] == SOURCE_PACK_SHA and pack['old_encoded_sha256'] == OLD_ENCODED_SHA
    assert sha(ROOT/'original_pack.json') == pack['source_pack_sha256'], 'original_pack_changed'
    assert sha(ROOT/'old_encoded.json') == pack['old_encoded_sha256'], 'original_encoded_changed'
    assert sha(ROOT/'private_inputs.json') == pack['private_inputs_sha256'], 'private_baselines_changed'


def check_prepared():
    pack = read(ROOT/'pack.json')
    assert pack['status'] == 'CPU_PREPARED_NO_MODEL'
    assert type(pack['schema_version']) is str and pack['schema_version']
    assert pack['limits'] == EXPECTED_LIMITS, 'trial_limits_changed'
    assert all(type(value) is int for value in pack['limits'].values())
    assert pack['normal_adoption'] is False and pack['next_training_initial_adoption'] is False
    assert pack['seed'] == 20261111 and pack['learning_rate'] == 1e-5
    order = pack['update_order']
    assert type(order) is list and len(order) == len(set(order)) == 24
    assert order[-6:] == [f'MW{i:02}' for i in range(1, 7)]
    original_pack = read(ROOT/'original_pack.json')
    assert len(original_pack['teachers']) == 86 and order[:18] == original_pack['update_order']
    assert pack['before_ids'] == ['HN01', 'HX01']
    assert pack['nll_ids'] == NLL_IDS
    assert len(pack['after_ids']) == len(set(pack['after_ids'])) == 14
    rows = pack['evaluation']
    assert len(rows) == 14 and [row['id'] for row in rows] == pack['after_ids']
    assert set(pack['before_ids']) <= set(pack['after_ids'])
    assert len(pack['expected']) == 14 and {row['id'] for row in pack['expected']} == set(pack['after_ids'])
    assert len(pack['teachers']) == 24 and {row['id'] for row in pack['teachers']} == set(order)
    manifest = read(ROOT/'cpu_manifest.json')
    assert type(manifest) is dict and manifest
    for relative, expected in manifest.items():
        path = (ROOT/relative).resolve()
        assert path.is_relative_to(ROOT) and sha(path) == expected, 'prepared_artifact_changed'
    check_api(pack)
    check_initial(pack)
    check_originals(pack)
    return pack


def check_pins(pack):
    from serve_emlis_natural_reply import MODEL, REVISION, PINS
    assert pack['model'] == MODEL and pack['revision'] == REVISION
    assert pack['pins'] == PINS and {name: version(name) for name in PINS} == PINS


def load_prepare_module():
    spec = importlib.util.spec_from_file_location('multirecord_wire_private_prepare', ROOT/'prepare.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def no_candidate_generation():
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    stack = ExitStack()
    for owner, name in ((MeaningExperienceEngine, 'generate'),
            (compiler, 'compile_analysis_unit_candidates'),
            (author, 'realize_analysis_unit_candidates'),
            (admission, 'generate_analysis_model_quoted_parent_units')):
        stack.enter_context(patch.object(owner, name,
            side_effect=AssertionError('saved_candidate_generation_forbidden')))
    return stack


def expected_input(prepared, expected):
    messages = prepared.messages()
    assert prepared.request_ref == expected['request_ref']
    assert prepared.source_guard == expected['source_guard']
    assert prepared.prompt_version == expected.get('prompt_version', expected.get('profile'))
    assert messages == expected['messages'] and digest(messages) == expected['messages_sha256']
    return messages


def consume(prepared, response, *, row, request):
    """Read original raw through current strict owners; never repair/relabel it."""
    result = dict(id=row['id'], row=row, request=request, response=asdict(response),
        api_calls=0, database_access=0, normal_adoption=False,
        next_training_initial_adoption=False)
    try:
        raw_packet = admission._load(response.raw)
        result['wire'] = dict(expected_fields=len(json.loads(request['messages'][1]['content'])['fields']),
            returned_field_ordinals=[field.get('field') for field in raw_packet.get('fields', [])]
            if type(raw_packet) is dict and type(raw_packet.get('fields')) is list
            and all(type(field) is dict and type(field.get('field')) is int
                for field in raw_packet['fields']) else None)
    except (ValueError, KeyError, TypeError, AttributeError):
        result['wire'] = dict(expected_fields=len(json.loads(request['messages'][1]['content'])['fields']),
            returned_field_ordinals=None)
    bound = replace(prepared, response=response)
    raw_before = response.raw
    try:
        candidate = admission.generate_analysis_model_quoted_parent_units(prepared.request, bound)
        saved = admission.serialize_analysis_model_quoted_parent_units(bound, candidate)
        with no_candidate_generation():
            assert admission.reload_analysis_model_quoted_parent_units(prepared, saved) == candidate
        result['candidate'] = dict(status='PRESERVED', private_state=saved,
            graph=asdict(candidate.graph), text=candidate.text,
            diagram=json.loads(candidate.diagram_json), non_generating_replay=True)
    except (admission.AnalysisSemanticError, ValueError) as error:
        result['candidate'] = dict(status='REJECTED', error_type=type(error).__name__, reason=str(error))
    try:
        artifact, mapped, unread = admission.generate_analysis_model_observed_actions(
            prepared.request, bound, with_record_counts=True)
        coverage = dict(source_count=len(prepared.request.members),
            processed_count=len(prepared.request.members), mapped_count=mapped,
            unparsed_count=unread, excluded_count=0)
        if artifact is None:
            result['map'] = dict(status='UNSUPPORTED', coverage=coverage)
        else:
            result['map'] = dict(status='GENERATED_PRIVATE_ONLY', coverage=coverage,
                artifact_id=artifact.artifact_id, graph=asdict(artifact.graph),
                source_set_ref=artifact.source_set_ref,
                source_members=[asdict(member) for member in artifact.source_members],
                text=artifact.safe_text_projection(authenticated_owner_scope=row['owner']),
                projection=artifact.safe_projection(authenticated_owner_scope=row['owner']))
    except (admission.AnalysisSemanticError, ValueError) as error:
        result['map'] = dict(status='REJECTED', error_type=type(error).__name__, reason=str(error))
    assert response.raw == raw_before and hashlib.sha256(response.raw.encode('utf-8')).hexdigest() == response.raw_sha256
    result['raw_unchanged'] = True
    result['scope'] = 'Direct offline candidate/map evaluation for this exact prepared request; no saved artifact or full-parent composition claim.'
    return result


def generate_phase(phase, deadline):
    pack = check_prepared()
    check_pins(pack)
    check_deadline(deadline)
    from serve_emlis_natural_reply import load_generator
    module = load_prepare_module()
    by_id = {row['id']: row for row in pack['evaluation']}
    expected = {row['id']: row for row in pack['expected']}
    ids = pack['before_ids'] if phase == 'before' else pack['after_ids']
    adapter = check_initial(pack) if phase == 'before' else ROOT/'train/adapter'
    weights = dict(weights_sha256=WEIGHTS, config_sha256=CONFIG) if phase == 'before' else read(ROOT/'train/report.json')
    if phase == 'after':
        assert weights['status'] == 'COMPLETE_NOT_ADOPTED' and weights['updates'] == 24
    assert sha(adapter/'adapter_model.safetensors') == weights['weights_sha256']
    assert sha(adapter/'adapter_config.json') == weights['config_sha256']
    report = dict(status='STARTED', phase=phase, cases=[], model_loads_started=1,
        model_loads=0, model_calls_started=0, new_generation=0, normal_adoption=False,
        next_training_initial_adoption=False, weights_sha256=weights['weights_sha256'],
        config_sha256=weights['config_sha256'], api_calls=0, database_access=0,
        per_generation_seconds=23,
        per_generation_deadline_scope='Loader stopping deadline; a blocked CUDA forward is ultimately bounded by the shared subprocess budget.')
    path = ROOT/(phase+'.json')
    assert not path.exists(), 'phase_must_not_restart'
    write(path, report)
    generator = None
    try:
        generator = load_generator(str(adapter), threading.Event(),
            weights_sha256=weights['weights_sha256'], config_sha256=weights['config_sha256'])
        report['model_loads'] = 1
        write(path, report)
        for key in ids:
            check_deadline(deadline)
            check_api(pack)
            row = by_id[key]
            prepared, fresh = module.prepare_row(row)
            assert fresh == {field: expected[key][field] for field in fresh}, 'prepared_binding_changed'
            messages = expected_input(prepared, expected[key])
            request = dict(request_ref=prepared.request_ref, messages=messages,
                messages_sha256=digest(messages), source_guard=prepared.source_guard,
                prompt_version=prepared.prompt_version)
            write(ROOT/(phase+'-'+key+'.request.json'), dict(row=row, request=request))
            report['active_id'] = key
            report['model_calls_started'] += 1
            assert report['model_calls_started'] <= len(ids)
            write(path, report)
            called_at = time.monotonic()
            raw, finish = generator(messages, min(deadline,
                called_at+pack['limits']['per_generation_seconds']))
            returned_at = time.monotonic()
            received = admission.AnalysisModelQuotedParentUnitsResponse(prepared.request_ref,
                digest(messages), hashlib.sha256(raw.encode('utf-8')).hexdigest(), finish, raw)
            report['new_generation'] += 1
            # Preserve every returned raw before any parsing or strict admission.
            (ROOT/(phase+'-'+key+'.raw.txt')).write_text(raw, encoding='utf-8')
            write(ROOT/(phase+'-'+key+'.response.json'),
                dict(row=row, request=request, response=asdict(received)))
            write(path, report)
            case = consume(prepared, received, row=row, request=request)
            case['generation_seconds'] = returned_at-called_at
            case['evaluation_seconds'] = time.monotonic()-returned_at
            report['cases'].append(case)
            write(path, report)
        assert report['model_calls_started'] == report['new_generation'] == len(ids)
        assert sha(adapter/'adapter_model.safetensors') == weights['weights_sha256']
        assert sha(adapter/'adapter_config.json') == weights['config_sha256']
        check_api(pack)
        check_initial(pack)
        report['status'] = 'COMPLETE_PENDING_RAW_REVIEW_NOT_ADOPTED'
    except BaseException as error:
        report.update(status='FAILED_PARTIAL_NO_RETRY_NOT_ADOPTED', error_type=type(error).__name__,
            traceback=traceback.format_exc())
        raise
    finally:
        write(path, report)
        if generator is not None:
            del generator
            gc.collect()
            import torch
            torch.cuda.empty_cache()


def train_phase(deadline):
    pack = check_prepared()
    check_pins(pack)
    check_deadline(deadline)
    initial = check_initial(pack)
    import torch
    import torch.nn.functional as F
    from transformers import Qwen3_5ForConditionalGeneration
    from peft import PeftModel, get_peft_model_state_dict
    from safetensors.torch import load_file
    encoded = read(ROOT/'encoded.json')
    assert len(encoded) == 24 and set(encoded) == set(pack['update_order'])
    old_encoded = read(ROOT/'old_encoded.json')
    assert len(old_encoded) == 86
    assert all(encoded[key] == old_encoded[key] for key in pack['update_order'][:18]), 'old18_encoding_changed'
    for item in encoded.values():
        start = item['loss_start']+1
        assert 0 < start < len(item['input_ids']) <= 8192
        assert len(item['input_ids']) == len(item['labels'])
        assert item['labels'][:start] == [-100]*start
        assert item['labels'][start:] == item['input_ids'][start:]
        assert 0 < len(item['input_ids'])-start <= 2048
        assert item['logits_positions'] == len(item['input_ids'])-start+1
    directory = ROOT/'train'
    directory.mkdir()
    report = dict(status='STARTED', model_loads_started=1, model_loads=0,
        updates=0, measurement_forwards=0, steps=[], measurements=[],
        normal_adoption=False, next_training_initial_adoption=False,
        nll_ids=NLL_IDS,
        nll_scope='Ten fixed diagnostic samples only; no full-old18 loss retention or semantic-quality claim.')
    write(directory/'report.json', report)
    random.seed(pack['seed'])
    torch.manual_seed(pack['seed'])
    torch.cuda.manual_seed_all(pack['seed'])
    model = optimizer = None
    try:
        model = Qwen3_5ForConditionalGeneration.from_pretrained(pack['model'],
            revision=pack['revision'], dtype=torch.bfloat16, device_map={'': 0},
            attn_implementation='sdpa', local_files_only=True, trust_remote_code=False)
        model = PeftModel.from_pretrained(model, initial, is_trainable=True, local_files_only=True)
        report['model_loads'] = 1
        write(directory/'report.json', report)
        saved = load_file(initial/'adapter_model.safetensors')
        loaded = get_peft_model_state_dict(model)
        assert len(saved) == len(loaded) == 112
        assert all(torch.equal(saved[key], loaded[key].detach().cpu()) for key in saved)
        del saved, loaded
        trainable = [parameter for parameter in model.parameters() if parameter.requires_grad]
        assert len(trainable) == 112 and sum(parameter.numel() for parameter in trainable) == 3833856
        assert all(module.p == 0 for module in model.modules() if isinstance(module, torch.nn.Dropout))
        assert getattr(getattr(model.config, 'text_config', model.config), 'attention_dropout', None) == 0
        torch.cuda.reset_peak_memory_stats()
        model.config.use_cache = False
        model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant': False})
        model.enable_input_require_grads()

        def loss(item):
            ids = torch.tensor([item['input_ids']], dtype=torch.long, device='cuda:0')
            output = model(input_ids=ids, attention_mask=torch.ones_like(ids),
                logits_to_keep=item['logits_positions'], use_cache=False)
            gold = torch.tensor(item['labels'][item['loss_start']+1:], dtype=torch.long, device='cuda:0')
            assert output.logits.shape[:2] == (1, item['logits_positions']) and (gold >= 0).all()
            return F.cross_entropy(output.logits[0, :-1, :].float(), gold)

        def measure(phase):
            model.eval()
            values = {}
            with torch.no_grad():
                for key in pack['nll_ids']:
                    check_deadline(deadline)
                    value = loss(encoded[key])
                    assert torch.isfinite(value)
                    values[key] = float(value)
                    report['measurement_forwards'] += 1
                    write(directory/'report.json', report)
            report['measurements'].append(dict(phase=phase, losses=values,
                mean=sum(values.values())/len(values),
                scope='Ten fixed diagnostic samples only; sample mean, no full-old18 retention or semantic-quality claim.'))
            write(directory/'report.json', report)

        measure('before')
        optimizer = torch.optim.AdamW(trainable, lr=pack['learning_rate'], weight_decay=0.)
        model.train()
        for step, key in enumerate(pack['update_order'], 1):
            check_deadline(deadline)
            optimizer.zero_grad(set_to_none=True)
            value = loss(encoded[key])
            assert torch.isfinite(value)
            value.backward()
            assert all(parameter.grad is None or torch.isfinite(parameter.grad).all() for parameter in trainable)
            norm = torch.nn.utils.clip_grad_norm_(trainable, 1.)
            assert torch.isfinite(norm)
            optimizer.step()
            report['updates'] = step
            report['steps'].append(dict(step=step, id=key, loss=float(value.detach()), gradient_norm=float(norm)))
            write(directory/'report.json', report)
        optimizer.zero_grad(set_to_none=True)
        optimizer = None
        measure('after')
        assert report['updates'] == 24 and report['measurement_forwards'] == 20
        model.save_pretrained(directory/'adapter', safe_serialization=True)
        saved = load_file(directory/'adapter/adapter_model.safetensors')
        actual = get_peft_model_state_dict(model)
        assert len(saved) == len(actual) == 112
        assert all(torch.isfinite(tensor).all() and torch.equal(tensor, actual[key].detach().cpu())
            for key, tensor in saved.items())
        report.update(status='COMPLETE_NOT_ADOPTED',
            peak_allocated_gib=torch.cuda.max_memory_allocated()/2**30,
            peak_reserved_gib=torch.cuda.max_memory_reserved()/2**30,
            weights_sha256=sha(directory/'adapter/adapter_model.safetensors'),
            config_sha256=sha(directory/'adapter/adapter_config.json'))
        check_api(pack)
        check_initial(pack)
    except BaseException as error:
        report.update(status='FAILED_PARTIAL_NO_RETRY_NOT_ADOPTED', error_type=type(error).__name__,
            traceback=traceback.format_exc())
        raise
    finally:
        try:
            if model is not None and report['status'] != 'COMPLETE_NOT_ADOPTED':
                model.save_pretrained(directory/'partial_adapter', safe_serialization=True)
        except BaseException:
            report['partial_save_error'] = traceback.format_exc()
        finally:
            write(directory/'report.json', report)


def run():
    pack = check_prepared()
    archive = ROOT.with_name(ROOT.name+'.zip')
    assert not archive.exists(), 'do_not_replace_archive'
    with (ROOT/'run_started.json').open('x', encoding='utf-8') as output:
        json.dump(dict(started=time.time(), max_seconds=900, retry_allowed=False), output)
    started = time.monotonic()
    deadline = started+900
    report = dict(status='STARTED', stages=[], api_commit=pack['api_commit'],
        model_loads_started=0, model_calls_started=0, new_generation=0,
        updates=0, measurement_forwards=0,
        normal_adoption=False, next_training_initial_adoption=False,
        api_calls=0, database_access=0, retry_allowed=False,
        interpretation='Wire completeness and exact-source comparison; field count or seen-teacher fit is not semantic quality.')
    failure = None
    try:
        assert not subprocess.check_output(['nvidia-smi', '--query-compute-apps=pid,used_memory',
            '--format=csv,noheader'], text=True).strip(), 'gpu_process_already_running'
        target = ROOT/'execution_runner.py'
        if Path(__file__).resolve() != target.resolve():
            shutil.copyfile(__file__, target)
        for phase in ('before', 'train', 'after'):
            check_deadline(deadline)
            remaining = int(deadline-time.monotonic())-10
            assert remaining > 0
            with (ROOT/(phase+'.log')).open('x', encoding='utf-8') as log:
                result = subprocess.run(['timeout', '--signal=TERM', '--kill-after=10',
                    str(remaining), sys.executable, str(target), phase, str(API), str(ROOT),
                    str(deadline)], stdout=log, stderr=subprocess.STDOUT)
            report['stages'].append(dict(phase=phase, exit=result.returncode))
            stage_path = ROOT/('train/report.json' if phase == 'train' else phase+'.json')
            if stage_path.exists():
                stage = read(stage_path)
                report['model_loads_started'] += stage.get('model_loads_started', 0)
                report['model_calls_started'] += stage.get('model_calls_started', 0)
                report['new_generation'] += stage.get('new_generation', 0)
                report['updates'] += stage.get('updates', 0)
                report['measurement_forwards'] += stage.get('measurement_forwards', 0)
            assert report['model_loads_started'] <= 3 and report['model_calls_started'] <= 16
            assert report['new_generation'] <= 16 and report['updates'] <= 24
            assert report['measurement_forwards'] <= 20
            write(ROOT/'report.json', report)
            assert result.returncode == 0, 'phase_failed_'+phase
        assert report['model_loads_started'] == 3 and report['model_calls_started'] == report['new_generation'] == 16
        assert report['updates'] == 24
        assert report['measurement_forwards'] == 20
        check_api(pack)
        check_initial(pack)
        report['status'] = 'COMPLETE_PENDING_ALL_RAW_REVIEW_NOT_ADOPTED'
    except BaseException as error:
        failure = error
        report.update(status='FAILED_PARTIAL_NO_RETRY_NOT_ADOPTED', error_type=type(error).__name__,
            traceback=traceback.format_exc())
    finally:
        report['seconds'] = time.monotonic()-started
        try:
            check_api(pack)
            check_initial(pack)
            check_originals(pack)
            manifest = read(ROOT/'cpu_manifest.json')
            assert all(sha(ROOT/name) == expected for name, expected in manifest.items())
            report.update(source_hashes_unchanged=True, initial_unchanged=True,
                api_head_unchanged=True, old_pack_unchanged=True, old_encoded_unchanged=True,
                private_baselines_unchanged=True, prepared_files_unchanged=True)
        except BaseException as error:
            report.update(status='FAILED_FINAL_IDENTITY_CHANGED_NOT_ADOPTED',
                identity_error_type=type(error).__name__)
            if failure is None:
                failure = error
        try:
            report['gpu_after_process'] = subprocess.check_output(['nvidia-smi',
                '--query-gpu=memory.used,utilization.gpu', '--format=csv,noheader'], text=True).strip()
        except BaseException as error:
            report['gpu_query_error_type'] = type(error).__name__
        write(ROOT/'report.json', report)
        aggregate = dict(schema_version='analysis_multirecord_wire_aggregate.v1',
            status=report['status'], api_commit=pack['api_commit'],
            new_generation=report['new_generation'], model_loads_started=report['model_loads_started'],
            model_calls_started=report['model_calls_started'],
            updates=report['updates'], normal_adoption=False, next_training_initial_adoption=False,
            measurement_forwards=report['measurement_forwards'], nll_samples=10,
            nll_scope='Fixed diagnostic sample only; no full-old18 loss retention or semantic-quality claim.',
            meaning_quality_claim=False, saved_maps=0, api_calls=0, database_access=0,
            review_status='PENDING_ALL_RAW_REVIEW', cases=[])
        for phase in ('before', 'after'):
            path = ROOT/(phase+'.json')
            if path.exists():
                for case in read(path).get('cases', []):
                    aggregate['cases'].append(dict(id=case['id'], phase=phase,
                        expected_fields=case['wire']['expected_fields'],
                        returned_field_ordinals=case['wire']['returned_field_ordinals'],
                        finish_reason=case['response']['finish_reason']
                            if case['response']['finish_reason'] in {'stop', 'length'} else 'INVALID',
                        candidate_status=case['candidate']['status'], map_status=case['map']['status']))
        write(ROOT/'aggregate.json', aggregate)
        write(ROOT/'manifest.json', {str(path.relative_to(ROOT)): sha(path)
            for path in sorted(ROOT.rglob('*')) if path.is_file()})
        with zipfile.ZipFile(archive, 'x', compression=zipfile.ZIP_DEFLATED) as output:
            for path in sorted(ROOT.rglob('*')):
                if path.is_file():
                    output.write(path, str(path.relative_to(ROOT)))
        print(canonical(dict(status=report['status'], archive=str(archive), archive_sha256=sha(archive),
            new_generation=report['new_generation'], updates=report['updates'], seconds=report['seconds'])))
    if failure is not None:
        raise failure


def main():
    global API, ROOT, admission
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=('run', 'before', 'train', 'after'))
    parser.add_argument('api', type=Path)
    parser.add_argument('root', type=Path)
    parser.add_argument('deadline', nargs='?', type=float)
    args = parser.parse_args()
    API, ROOT = args.api.resolve(), args.root.resolve()
    sys.dont_write_bytecode = True
    os.environ.update(HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1', HF_DATASETS_OFFLINE='1')
    sys.path[:0] = [str(API/'ai/services/ai_inference'), str(API/'ai/services'), str(API/'ai/tools')]
    from cocolon_meaning_experience_engine.cores.analysis import semantic_admission
    admission = semantic_admission
    if args.mode == 'run':
        assert args.deadline is None
        run()
    else:
        assert args.deadline is not None
        def terminated(*_args):
            raise TimeoutError('bounded_multirecord_wire_child_terminated')
        signal.signal(signal.SIGTERM, terminated)
        if args.mode == 'train':
            train_phase(args.deadline)
        else:
            generate_phase(args.mode, args.deadline)


if __name__ == '__main__':
    main()
