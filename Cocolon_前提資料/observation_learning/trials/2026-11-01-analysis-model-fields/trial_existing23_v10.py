"""One bounded existing23/v10 research trial; prepare never loads a model.

After explicit review, run uses one training load, 23 updates and 20 fixed NLL
forwards, then one generation load and exactly HC01..10 plus four fixed v10
retention controls. No new before inference, retry, adoption, quantization or
changed optimizer/mask is permitted. Training code follows fact_wish_contrast.
The execution owner must additionally wrap run in a 900-second parent timeout.

prepare arguments require reviewed manifest SHA values. The control manifest
schema is analysis_fixed_v10_retention_controls.v1, VERIFIED_PRIVATE_BASELINE,
profile selected_material.v10, ids CONTROL_IDS, source_bundle_sha256, descriptors
source_manifest/pack/result ({path,sha256}), response_files/raw_files by id, and
bindings by id ({row_sha256,request_sha256,response_sha256,request_ref,
messages_sha256,source_guard,raw_sha256}). Historical row.prompt_version metadata
stays unchanged; the original request.prompt_version is authoritative.
"""
from __future__ import annotations

import argparse
from contextlib import ExitStack
from copy import deepcopy
from dataclasses import asdict, replace
import gc
import hashlib
import importlib.util
from importlib.metadata import version
import json
import os
from pathlib import Path
import random
import signal
import subprocess
import sys
import threading
import time
import traceback
from unittest.mock import patch


API_COMMIT = 'c1502415cc5d0e4fb9ff1fd5e1fcbe7a1af848b9'
PROFILE = 'selected_material.v10'
WEIGHTS = 'a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59'
CONFIG = '006ebf7bef859264b3778126f4a0f6512e1b2a7e6049b09dfcf0d56603ede3a9'
ORIGINAL = '7acc464f1b45916a9d96bf91a27b042b71532456cec667e123d86208cf0c58e3'
OLD86 = '30afde6a0735aac0b5f23e737b2b80c72e7dd65ba0cdbe4bc791886473f4bbf1'
OLD_ENCODED = 'd439ff2017914fc53acf5b41240c88d9421d64edbe36964758f59d492008919b'
HELPER = '97275c93fce38340590f49a30dacea1f5eeb592a304d63c12269b32d602f0e7b'
PREPARED = {'pack.private.json': 'e5786aff296699ded23935393b93c20394dcff309c517412265996d1ac244d86',
    'encoded.private.json': 'a3db8d365016ddab4843a8467573ea0caf8a4e1b07f6038bfbd6607a582ccd43',
    'audit.private.json': '2a87e8a070aedeea359a8aab5d4eb5d2be8d12c2152fd4ff5b7fe8353c15a77f'}
HC_PACK = '5716d011e818586ea1f87cef1116fe33b3b265fe5a47b9eac2f5ad4470e1cf55'
HC_RESULT = '6dc7f60b21e29c0219655dd37f29d83b1a6ec2095a85dbd39e98b32fc70aa29d'
CONTROL_BUNDLE = '27906586bedbfa694144989fb3a99967e4cd3b940659fa9e870785d9f940b35f'
CONTROL_MANIFEST = 'c92b0267b3ad3a56536fb9a65ef51c3e03b083ef0c6e931bda76f5cb322fb071'
CONTROL_PACK = 'ebe1f2a40ffedfae8db7af1387613eaf40b1e669e103fa8a57138918f8dd1b5a'
CONTROL_RESULT = 'd9b5554608d038b8dc51a01b307d0a03ece103add2b5ee64a535df9e945a707f'
HC_IDS = [f'HC{i:02d}' for i in range(1, 11)]
CONTROL_IDS = ['AE05', 'AP07_v7', 'AP08_v7', 'OP02_v7']
TEACHER_IDS = ['T01', 'T02', 'N01', 'N08', 'SC01', 'OA01', 'RU01', 'RB01', 'RB02', 'RU02',
    'AT04', 'AT12', 'AT19', 'AT29', 'BT08', *(f'F{i:02d}' for i in range(1, 9))]
NLL_IDS = ['AT04', 'AT12', 'AT19', 'AT29', 'BT08', 'F02', 'F03', 'F04', 'F05', 'T01']
LIMITS = dict(seconds=900, updates=23, nll_forwards=20, model_loads=2,
    new_generation=14, per_generation_seconds=23, context_tokens=8192, output_tokens=2048)
API = ROOT = service = admission = TRIAL_MANIFEST = None


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def digest(value):
    return hashlib.sha256(canonical(value).encode('utf-8')).hexdigest()


def unique_object(pairs):
    value = {}
    for key, item in pairs:
        assert key not in value, 'duplicate_json_key'
        value[key] = item
    return value


def read(path):
    return json.loads(Path(path).read_bytes(), object_pairs_hook=unique_object)


def write(path, value):
    path = Path(path)
    temporary = path.with_name(path.name + '.tmp')
    temporary.write_text(canonical(value) + '\n', encoding='utf-8')
    temporary.replace(path)


def deadline_check(deadline):
    assert time.monotonic() < deadline, 'shared_deadline_exhausted_no_retry'


def forbidden(*_args, **_kwargs):
    raise AssertionError('offline_trial_database_or_provider_forbidden')


def bind_api(api):
    global API, service, admission
    API = Path(api).resolve()
    sys.dont_write_bytecode = True
    sys.path[:0] = [str(API / 'ai/services/ai_inference'), str(API / 'ai/tools')]
    import analysis_cumulative_service
    from cocolon_meaning_experience_engine.cores.analysis import semantic_admission
    service, admission = analysis_cumulative_service, semantic_admission


def check_api(pack):
    assert subprocess.check_output(['git', '-C', str(API), 'rev-parse', 'HEAD'], text=True).strip() == API_COMMIT == pack['api_commit']
    assert not subprocess.check_output(['git', '-C', str(API), 'status', '--porcelain',
        '--untracked-files=no'], text=True).strip(), 'tracked_api_dirty'
    for relative, expected in pack['api_hashes'].items():
        path = (API / relative).resolve()
        assert path.is_relative_to(API) and sha(path) == expected, 'api_source_changed'


def check_pins(pack):
    from serve_emlis_natural_reply import MODEL, REVISION, PINS
    assert pack['model'] == MODEL and pack['revision'] == REVISION
    assert pack['pins'] == PINS and {name: version(name) for name in PINS} == PINS
    assert os.environ.get('HF_HUB_OFFLINE') == os.environ.get('TRANSFORMERS_OFFLINE') == '1'


def check_initial(pack):
    initial = Path(pack['initial_adapter'])
    assert pack['initial_weights_sha256'] == WEIGHTS and pack['initial_config_sha256'] == CONFIG
    assert sha(initial / 'adapter_model.safetensors') == WEIGHTS
    assert sha(initial / 'adapter_config.json') == CONFIG
    return initial


def prepared_input(case):
    p = service.prepare_cumulative_category_units(case['row']['owner'], case['row']['snapshot'],
        prompt_version=case['profile'])
    request = dict(prompt_version=p.prompt_version, request_ref=p.request_ref,
        source_guard=p.source_guard, messages=p.messages(), messages_sha256=digest(p.messages()))
    assert request == case['request'], 'saved_input_binding_changed'
    return p


def no_candidate_generation():
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    stack = ExitStack()
    for obj, name in ((MeaningExperienceEngine, 'generate'),
            (compiler, 'compile_analysis_unit_candidates'), (author, 'realize_analysis_unit_candidates'),
            (admission, 'generate_analysis_model_quoted_parent_units')):
        stack.enter_context(patch.object(obj, name, side_effect=forbidden))
    return stack


def consume(case, response):
    p = prepared_input(case)
    assert response.request_ref == p.request_ref and response.messages_sha256 == digest(p.messages())
    assert hashlib.sha256(response.raw.encode('utf-8')).hexdigest() == response.raw_sha256
    bound = replace(p, response=response)
    out = dict(id=case['id'], profile=case['profile'], row=case['row'], request=case['request'],
        response=asdict(response), model_calls=0, db_calls=0, normal_adoption=False)
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import (
        AnalysisSourceError, freeze_analysis_sources, source_field_text)
    import analysis_model_source
    with ExitStack() as stack:
        for obj, name in ((service, '_rpc'), (service, '_model_response'),
                (analysis_model_source, 'application_analysis_model_source')):
            stack.enter_context(patch.object(obj, name, side_effect=forbidden))
        try:
            candidate, coverage = service.build_cumulative_quoted_parent_candidates(
                case['row']['owner'], case['row']['snapshot'], model_input=bound)
            saved = service.serialize_cumulative_quoted_parent_candidates(case['row']['owner'],
                case['row']['snapshot'], model_input=bound, artifact=candidate, coverage=coverage)
            with no_candidate_generation():
                restored, counts = service.reload_cumulative_quoted_parent_candidates(
                    case['row']['owner'], case['row']['snapshot'], saved)
            assert restored == candidate and counts == coverage
            out['candidate'] = dict(status='PARSED_PRIVATE_ONLY', storage=saved,
                coverage=coverage, non_generation_reload_exact=True)
        except (AnalysisSourceError, admission.AnalysisSemanticError, ValueError) as error:
            out['candidate'] = dict(status='REJECTED', error_type=type(error).__name__, reason=str(error))
        try:
            artifact, counts = service.build_cumulative_map(case['row']['owner'],
                case['row']['snapshot'], model_input=bound)
            out['cumulative'] = dict(status='UNSUPPORTED' if artifact is None else 'GENERATED_PRIVATE_ONLY', counts=counts)
            if artifact is not None:
                owner = case['row']['owner']
                out['cumulative'].update(graph=asdict(artifact.graph),
                    text=artifact.safe_text_projection(authenticated_owner_scope=owner),
                    projection=artifact.safe_projection(authenticated_owner_scope=owner))
                sources = {s.envelope.envelope_id: s for s in freeze_analysis_sources(p.request).sources}
                for node in artifact.graph.nodes:
                    for e in node.evidence_refs:
                        source = sources[e.source_envelope_id]
                        field = source_field_text(source, e.field_path)
                        literal = field[e.scalar_start:e.scalar_end]
                        assert source.record_ref in node.record_refs
                        assert hashlib.sha256(field.encode('utf-8')).hexdigest() == e.field_sha256
                        assert hashlib.sha256(literal.encode('utf-8')).hexdigest() == e.literal_sha256
                        assert source.envelope.raw_utf8[e.utf8_start:e.utf8_end].decode('utf-8') == literal
        except (AnalysisSourceError, admission.AnalysisSemanticError, ValueError) as error:
            out['cumulative'] = dict(status='REJECTED', error_type=type(error).__name__, reason=str(error))
    assert bound.response == response
    return out


def prepare(args):
    global ROOT
    ROOT = args.root.resolve()
    assert not ROOT.exists(), 'new_trial_root_required'
    inputs = {}

    def remember(path, expected):
        path = Path(path).resolve()
        assert sha(path) == expected, 'immutable_input_changed:' + str(path)
        inputs[str(path)] = expected
        return path

    def manifest(base, name, expected):
        base = Path(base).resolve()
        path = remember(base / name, expected)
        values = read(path)
        assert values
        for relative, entry in values.items():
            target = (base / relative).resolve()
            assert target.is_relative_to(base), 'manifest_path_escape'
            remember(target, entry['sha256'] if isinstance(entry, dict) else entry)
        return values

    newroot, oldroot, hcroot = args.prepared_root.resolve(), args.original_root.resolve(), args.hc_root.resolve()
    new_manifest = manifest(newroot, 'manifest.private.json', args.prepared_manifest_sha256)
    assert new_manifest == PREPARED
    old_manifest = manifest(oldroot, 'cpu_manifest.json', args.original_manifest_sha256)
    original_path = remember(oldroot / 'pack.json', ORIGINAL)
    remember(oldroot / 'original_pack.json', OLD86)
    remember(oldroot / 'old_encoded.json', OLD_ENCODED)
    remember(oldroot / 'runner.py', HELPER)
    assert old_manifest['pack.json'] == ORIGINAL and old_manifest['old_encoded.json'] == OLD_ENCODED
    original, new, encoded = read(original_path), read(newroot / 'pack.private.json'), read(newroot / 'encoded.private.json')
    assert new['schema_version'] == 'analysis_existing23_v10_cpu_pack.v1' and new['status'] == 'CPU_PREPARED_NOT_ADOPTED'
    assert new['profile'] == PROFILE and new['original_pack_sha256'] == ORIGINAL
    assert new['teacher_ids'] == [r['id'] for r in new['teachers']] == TEACHER_IDS
    assert [r['id'] for r in original['teachers']] == TEACHER_IDS
    assert new['encoded_sha256'] == digest(encoded) and set(encoded) == set(TEACHER_IDS)
    assert new['training_updates'] == new['model_calls'] == new['new_teachers'] == new['evaluation_rows_used'] == 0
    assert not new['normal_adoption'] and not new['next_training_initial_adoption']
    assert len(original['update_order']) == len(set(original['update_order'])) == 23
    assert set(original['update_order']) == set(TEACHER_IDS) and original['nll_ids'] == NLL_IDS
    assert original['seed'] == 20261114 and original['learning_rate'] == 1e-5
    check_api(new); check_pins(new); check_initial(new)

    controls_path = remember(args.controls_manifest, args.controls_manifest_sha256)
    controls = read(controls_path)
    assert controls['schema_version'] == 'analysis_fixed_v10_retention_controls.v1'
    assert controls['status'] == 'VERIFIED_PRIVATE_BASELINE' and controls['profile'] == PROFILE
    assert controls['ids'] == CONTROL_IDS and controls['source_bundle_sha256'] == CONTROL_BUNDLE
    def descriptor(entry, expected=None):
        path = Path(entry['path'])
        if not path.is_absolute():
            path = (controls_path.parent/path).resolve()
            assert path.is_relative_to(controls_path.parent), 'control_manifest_path_escape'
        path = remember(path, entry['sha256'])
        if expected is not None:
            assert entry['sha256'] == expected
        return path
    source_manifest = read(descriptor(controls['source_manifest'], CONTROL_MANIFEST))
    control_pack_path = descriptor(controls['pack'], CONTROL_PACK)
    control_result_path = descriptor(controls['result'], CONTROL_RESULT)
    control_pack, control_result = read(control_pack_path), read(control_result_path)
    for name, path in (('pack.private.json', control_pack_path), ('result.private.json', control_result_path)):
        assert source_manifest[name]['sha256'] == sha(path) and source_manifest[name]['bytes'] == path.stat().st_size
    assert control_pack['profile'] == PROFILE and control_pack['initial_weights_sha256'] == WEIGHTS
    assert control_pack['initial_config_sha256'] == CONFIG
    assert control_result['status'] == 'COMPLETE_PENDING_REVIEW_NOT_ADOPTED'
    assert control_result['weights_sha256'] == WEIGHTS and control_result['config_sha256'] == CONFIG
    assert control_result['new_generation'] == control_result['calls_started'] == 10
    assert control_result['model_loads'] == control_result['model_loads_started'] == 1
    assert control_result['training_updates'] == control_result['api_calls'] == control_result['db_calls'] == 0
    assert control_pack['model'] == new['model'] and control_pack['revision'] == new['revision'] and control_pack['pins'] == new['pins']
    assert set(controls['raw_files']) == set(controls['response_files']) == set(controls['bindings']) == set(CONTROL_IDS)
    hcpack = read(remember(hcroot / 'pack.private.json', HC_PACK))
    hcresult = read(remember(hcroot / 'result.private.json', HC_RESULT))
    assert hcpack['ids'] == [r['id'] for r in hcresult['cases']] == HC_IDS
    assert hcpack['profile'] == PROFILE and hcpack['initial_weights_sha256'] == WEIGHTS and hcpack['initial_config_sha256'] == CONFIG
    assert hcpack['model'] == new['model'] and hcpack['revision'] == new['revision'] and hcpack['pins'] == new['pins']
    assert hcresult['status'] == 'COMPLETE_PENDING_REVIEW_NOT_ADOPTED'
    assert hcresult['new_generation'] == hcresult['calls_started'] == 10 and hcresult['model_loads'] == 1
    assert hcresult['training_updates'] == hcresult['db_calls'] == hcresult['api_calls'] == 0
    evaluation = []
    for key in HC_IDS + CONTROL_IDS:
        is_control = key in CONTROL_IDS
        pack = control_pack if is_control else hcpack
        result = control_result if is_control else hcresult
        spec, = [r for r in pack['cases'] if r['id'] == key]
        saved, = [r for r in result['cases'] if r['id'] == key]
        assert saved['row'] == spec['row'] and 'assistant_target' not in saved['row']
        request = (saved['request'] if is_control else dict(prompt_version=PROFILE,
            request_ref=saved['request_ref'], source_guard=saved['source_guard'],
            messages=saved['messages'], messages_sha256=digest(saved['messages'])))
        assert request['prompt_version'] == PROFILE and request['messages'] == spec['messages']
        assert request['request_ref'] == spec['request_ref']
        response = saved['response']
        assert response['request_ref'] == request['request_ref'] and response['messages_sha256'] == digest(request['messages'])
        if is_control:
            raw_path = descriptor(controls['raw_files'][key])
            response_path = descriptor(controls['response_files'][key])
            for name, path in ((key + '.raw.txt', raw_path), (key + '.response.private.json', response_path)):
                assert source_manifest[name]['sha256'] == sha(path) and source_manifest[name]['bytes'] == path.stat().st_size
            expected_bindings = dict(row_sha256=digest(saved['row']), request_sha256=digest(request),
                response_sha256=digest(response), request_ref=request['request_ref'],
                messages_sha256=request['messages_sha256'], source_guard=request['source_guard'], raw_sha256=response['raw_sha256'])
            assert controls['bindings'][key] == expected_bindings
        else:
            raw_path = remember(hcroot / (key + '.raw.txt'), response['raw_sha256'])
            response_path = hcroot / (key + '.response.private.json')
            remember(response_path, sha(response_path))
        assert raw_path.read_bytes() == response['raw'].encode('utf-8') and sha(raw_path) == response['raw_sha256']
        assert response['finish_reason'] == 'stop'
        assert read(response_path) == dict(row=saved['row'], messages=request['messages'], response=response)
        case = dict(id=key, row=deepcopy(saved['row']), profile=PROFILE, request=deepcopy(request),
            baseline_response=deepcopy(response), group='FIXED_V10_RETENTION_CONTROL' if is_control else 'KNOWN_HC_DEVELOPMENT')
        prepared_input(case)
        evaluation.append(case)

    from transformers import AutoTokenizer
    tokenizer = AutoTokenizer.from_pretrained(new['model'], revision=new['revision'], local_files_only=True, trust_remote_code=False)
    audits = []
    for old, row in zip(original['teachers'], new['teachers']):
        assert row['original_row_sha256'] == digest(old)
        assert row['original_target_sha256'] == hashlib.sha256(old['assistant_target'].encode('utf-8')).hexdigest()
        for name, value in old.items():
            if name not in {'messages', 'request_ref', 'prompt_version'}:
                assert row[name] == value, 'teacher_body_or_role_changed'
        assert row['prompt_version'] == PROFILE
        p = service.prepare_cumulative_category_units(row['owner'], row['snapshot'], prompt_version=PROFILE)
        assert p.messages() == row['messages'] and p.request_ref == row['request_ref'] and p.source_guard == row['source_guard']
        prompt = tokenizer.apply_chat_template(p.messages(), enable_thinking=False, add_generation_prompt=True,
            tokenize=True, return_dict=False, truncation=False)
        full = tokenizer.apply_chat_template(p.messages() + [dict(role='assistant', content=row['assistant_target'])],
            enable_thinking=False, add_generation_prompt=False, tokenize=True, return_dict=False, truncation=False)
        item = encoded[row['id']]
        assert full[:len(prompt)] == prompt and item['input_ids'] == full
        assert item['labels'] == [-100] * len(prompt) + full[len(prompt):]
        assert item['loss_start'] == len(prompt)-1 and item['logits_positions'] == len(full)-len(prompt)+1
        assert len(prompt)+2048 <= 8192 and len(full) <= 8192 and 0 < len(full)-len(prompt) <= 2048
        assert tokenizer.decode(full[len(prompt):], skip_special_tokens=False,
            clean_up_tokenization_spaces=False) == row['assistant_target'] + '<|im_end|>\n'
        response = admission.AnalysisModelQuotedParentUnitsResponse(p.request_ref, digest(p.messages()),
            row['original_target_sha256'], 'stop', row['assistant_target'])
        teacher_case = dict(id=row['id'], row=dict(owner=row['owner'], snapshot=row['snapshot']), profile=PROFILE,
            request=dict(prompt_version=PROFILE, request_ref=p.request_ref, source_guard=p.source_guard,
                messages=p.messages(), messages_sha256=digest(p.messages())))
        outcome = consume(teacher_case, response)
        assert outcome['candidate']['status'] == 'PARSED_PRIVATE_ONLY'
        audits.append(dict(id=row['id'], target_sha256=row['original_target_sha256'], encoded_sha256=digest(item),
            all_original_teacher_fields_preserved=True, prefix_eos_mask_budget=True, strict_reload=True))
    baselines = []
    for case in evaluation:
        tokens = tokenizer.apply_chat_template(case['request']['messages'], enable_thinking=False,
            add_generation_prompt=True, tokenize=True, return_dict=False, truncation=False)
        assert len(tokens)+2048 <= 8192
        case['input_tokens'] = len(tokens)
        before = consume(case, admission.AnalysisModelQuotedParentUnitsResponse(**case['baseline_response']))
        if case['id'] in CONTROL_IDS:
            assert before['cumulative']['status'] == 'GENERATED_PRIVATE_ONLY', 'control_baseline_not_supported'
        baselines.append(before)
    trial = dict(schema_version='analysis_existing23_v10_bounded_trial.v1', status='CPU_PREPARED_NOT_ADOPTED',
        api_commit=API_COMMIT, api_hashes=new['api_hashes'], initial_adapter=new['initial_adapter'],
        initial_weights_sha256=WEIGHTS, initial_config_sha256=CONFIG, model=new['model'], revision=new['revision'], pins=new['pins'],
        seed=original['seed'], learning_rate=original['learning_rate'], update_order=original['update_order'], nll_ids=NLL_IDS,
        teacher_ids=TEACHER_IDS, evaluation=evaluation, after_ids=HC_IDS+CONTROL_IDS, limits=LIMITS,
        optional_target=original['optional_target'], runtime_pack=str(original_path), runtime_helper=str(oldroot/'runner.py'),
        external_inputs=inputs, runner_sha256=sha(__file__), normal_adoption=False, next_training_initial_adoption=False,
        baseline_model_calls=0, new_teachers=0, evaluation_rows_used_for_training=0)
    check_api(trial); check_initial(trial)
    assert all(sha(path) == expected for path, expected in inputs.items())
    ROOT.mkdir(parents=True)
    write(ROOT/'pack.private.json', trial); write(ROOT/'encoded.private.json', encoded)
    write(ROOT/'teacher-audit.private.json', audits); write(ROOT/'before.private.json', dict(cases=baselines, model_calls=0, db_calls=0))
    write(ROOT/'cpu-manifest.private.json', {p.name: sha(p) for p in ROOT.iterdir() if p.is_file()})
    print(canonical(dict(status=trial['status'], teachers=23, evaluation=14, baseline_model_calls=0,
        pack_sha256=sha(ROOT/'pack.private.json'), manifest_sha256=sha(ROOT/'cpu-manifest.private.json'))))


def checked_pack():
    assert TRIAL_MANIFEST and sha(ROOT/'cpu-manifest.private.json') == TRIAL_MANIFEST, 'reviewed_trial_manifest_changed'
    pack = read(ROOT/'pack.private.json')
    assert pack['schema_version'] == 'analysis_existing23_v10_bounded_trial.v1'
    assert pack['limits'] == LIMITS and pack['after_ids'] == HC_IDS+CONTROL_IDS
    assert pack['teacher_ids'] == TEACHER_IDS and pack['nll_ids'] == NLL_IDS
    assert len(pack['update_order']) == len(set(pack['update_order'])) == 23 and set(pack['update_order']) == set(TEACHER_IDS)
    assert pack['seed'] == 20261114 and pack['learning_rate'] == 1e-5
    assert pack['runner_sha256'] == sha(__file__)
    assert pack['normal_adoption'] is pack['next_training_initial_adoption'] is False
    for name, expected in read(ROOT/'cpu-manifest.private.json').items():
        path = (ROOT/name).resolve()
        assert path.is_relative_to(ROOT) and sha(path) == expected
    for path, expected in pack['external_inputs'].items():
        assert sha(path) == expected, 'original_input_changed'
    check_api(pack); check_pins(pack); check_initial(pack)
    return pack


def start_phase(name, deadline):
    assert read(ROOT/'run-started.private.json')['deadline'] == deadline
    deadline_check(deadline)
    with (ROOT/(name+'-started.private.json')).open('x', encoding='utf-8') as stream:
        stream.write(canonical(dict(deadline=deadline, retry=False))+'\n')


def train(deadline):
    pack = checked_pack(); start_phase('train', deadline)
    import torch
    import torch.nn.functional as F
    from transformers import Qwen3_5ForConditionalGeneration
    from peft import PeftModel, get_peft_model_state_dict
    from safetensors.torch import load_file
    encoded = read(ROOT/'encoded.private.json')
    assert set(encoded) == set(TEACHER_IDS)
    for item in encoded.values():
        start = item['loss_start']+1
        assert 0 < start < len(item['input_ids']) <= 8192
        assert len(item['labels']) == len(item['input_ids'])
        assert item['labels'][:start] == [-100]*start and item['labels'][start:] == item['input_ids'][start:]
        assert 0 < len(item['input_ids'])-start <= 2048 and item['logits_positions'] == len(item['input_ids'])-start+1
    directory = ROOT/'train'; directory.mkdir()
    report = dict(status='STARTED', model_loads_started=1, model_loads=0, updates=0,
        measurement_forwards=0, steps=[], measurements=[], normal_adoption=False, next_training_initial_adoption=False)
    write(directory/'report.json', report)
    random.seed(pack['seed']); torch.manual_seed(pack['seed']); torch.cuda.manual_seed_all(pack['seed'])
    model = optimizer = None
    try:
        assert torch.cuda.is_available() and torch.cuda.device_count() == 1
        model = Qwen3_5ForConditionalGeneration.from_pretrained(pack['model'], revision=pack['revision'],
            dtype=torch.bfloat16, device_map={'': 0}, attn_implementation='sdpa', local_files_only=True, trust_remote_code=False)
        model = PeftModel.from_pretrained(model, check_initial(pack), is_trainable=True, local_files_only=True)
        report['model_loads'] = 1; write(directory/'report.json', report)
        saved = load_file(Path(pack['initial_adapter'])/'adapter_model.safetensors')
        loaded = get_peft_model_state_dict(model)
        assert len(saved) == len(loaded) == 112 and all(torch.equal(saved[k], loaded[k].detach().cpu()) for k in saved)
        del saved, loaded
        parameters = [p for p in model.parameters() if p.requires_grad]
        assert len(parameters) == 112 and sum(p.numel() for p in parameters) == 3833856
        assert all(m.p == 0 for m in model.modules() if isinstance(m, torch.nn.Dropout))
        assert getattr(getattr(model.config, 'text_config', model.config), 'attention_dropout', None) == 0
        torch.cuda.reset_peak_memory_stats(); model.config.use_cache = False
        model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant': False})
        model.enable_input_require_grads()
        def loss(item):
            ids = torch.tensor([item['input_ids']], dtype=torch.long, device='cuda:0')
            out = model(input_ids=ids, attention_mask=torch.ones_like(ids), logits_to_keep=item['logits_positions'], use_cache=False)
            gold = torch.tensor(item['labels'][item['loss_start']+1:], dtype=torch.long, device='cuda:0')
            assert out.logits.shape[:2] == (1, item['logits_positions']) and (gold >= 0).all()
            return F.cross_entropy(out.logits[0, :-1, :].float(), gold)
        def measure(phase):
            model.eval(); values = {}
            with torch.no_grad():
                for key in NLL_IDS:
                    deadline_check(deadline); value = loss(encoded[key]); assert torch.isfinite(value)
                    values[key] = float(value); report['measurement_forwards'] += 1
                    write(directory/'report.json', report)
            report['measurements'].append(dict(phase=phase, losses=values, mean=sum(values.values())/len(values)))
            write(directory/'report.json', report)
        measure('before')
        optimizer = torch.optim.AdamW(parameters, lr=pack['learning_rate'], weight_decay=0.)
        model.train()
        for step, key in enumerate(pack['update_order'], 1):
            deadline_check(deadline); optimizer.zero_grad(set_to_none=True)
            value = loss(encoded[key]); assert torch.isfinite(value); value.backward()
            assert all(p.grad is None or torch.isfinite(p.grad).all() for p in parameters)
            norm = torch.nn.utils.clip_grad_norm_(parameters, 1.); assert torch.isfinite(norm)
            optimizer.step(); report['updates'] = step
            report['steps'].append(dict(step=step, id=key, loss=float(value.detach()), gradient_norm=float(norm)))
            write(directory/'report.json', report)
        optimizer.zero_grad(set_to_none=True); optimizer = None
        measure('after')
        assert report['updates'] == 23 and report['measurement_forwards'] == 20
        deadline_check(deadline); model.save_pretrained(directory/'adapter', safe_serialization=True)
        saved = load_file(directory/'adapter/adapter_model.safetensors'); actual = get_peft_model_state_dict(model)
        assert len(saved) == len(actual) == 112 and all(torch.isfinite(t).all() and torch.equal(t, actual[k].detach().cpu()) for k, t in saved.items())
        report.update(status='COMPLETE_NOT_ADOPTED', weights_sha256=sha(directory/'adapter/adapter_model.safetensors'),
            config_sha256=sha(directory/'adapter/adapter_config.json'), peak_allocated_gib=torch.cuda.max_memory_allocated()/2**30,
            peak_reserved_gib=torch.cuda.max_memory_reserved()/2**30)
    except BaseException:
        report.update(status='FAILED_PARTIAL_NO_RETRY_NOT_ADOPTED', traceback=traceback.format_exc()); raise
    finally:
        try:
            if model is not None and report['status'] != 'COMPLETE_NOT_ADOPTED':
                model.save_pretrained(directory/'partial_adapter', safe_serialization=True)
        except BaseException:
            report['partial_save_error'] = traceback.format_exc()
        write(directory/'report.json', report)
        check_initial(pack)


def after(deadline):
    pack = checked_pack(); start_phase('after', deadline)
    trained = read(ROOT/'train/report.json')
    assert trained['status'] == 'COMPLETE_NOT_ADOPTED' and trained['updates'] == 23 and trained['measurement_forwards'] == 20
    adapter = ROOT/'train/adapter'
    assert sha(adapter/'adapter_model.safetensors') == trained['weights_sha256']
    assert sha(adapter/'adapter_config.json') == trained['config_sha256']
    helper_path = Path(pack['runtime_helper']); assert sha(helper_path) == HELPER
    spec = importlib.util.spec_from_file_location('verified_fact_wish_optional_helper', helper_path)
    helper = importlib.util.module_from_spec(spec); spec.loader.exec_module(helper)
    vendor, manifest, objects, proof = helper.verify_optional_generation(read(pack['runtime_pack']))
    from serve_emlis_natural_reply import load_generator
    report = dict(status='STARTED', model_loads_started=1, model_loads=0,
        calls_started=0, new_generation=0, cases=[], optional_binding_proof=proof,
        normal_adoption=False, next_training_initial_adoption=False)
    write(ROOT/'after.private.json', report)
    generator = None
    try:
        generator = load_generator(str(adapter), threading.Event(), weights_sha256=trained['weights_sha256'], config_sha256=trained['config_sha256'])
        report['model_loads'] = 1; write(ROOT/'after.private.json', report)
        assert vendor.vendor_bindings(manifest, Path(pack['optional_target']))[1] == objects
        baselines = {case['id']: case for case in read(ROOT/'before.private.json')['cases']}
        for case in pack['evaluation']:
            deadline_check(deadline); check_api(pack)
            p = prepared_input(case)
            report['active_id'] = case['id']; report['calls_started'] += 1
            assert report['calls_started'] <= 14; write(ROOT/'after.private.json', report)
            write(ROOT/('after-'+case['id']+'.request.private.json'), dict(row=case['row'], request=case['request']))
            called = time.monotonic(); end = min(deadline, called+23)
            signal.signal(signal.SIGALRM, signal.SIG_DFL); signal.setitimer(signal.ITIMER_REAL, max(.001, end-called))
            try:
                raw, finish = generator(p.messages(), end)
            finally:
                signal.setitimer(signal.ITIMER_REAL, 0)
            elapsed = time.monotonic()-called
            response = admission.AnalysisModelQuotedParentUnitsResponse(p.request_ref,
                digest(p.messages()), hashlib.sha256(raw.encode('utf-8')).hexdigest(), finish, raw)
            (ROOT/('after-'+case['id']+'.raw.txt')).write_bytes(raw.encode('utf-8'))
            write(ROOT/('after-'+case['id']+'.response.private.json'), dict(row=case['row'], request=case['request'], response=asdict(response)))
            report['new_generation'] += 1; write(ROOT/'after.private.json', report)
            assert finish == 'stop' and elapsed <= 23, 'incomplete_raw_preserved_no_retry'
            outcome = consume(case, response); outcome['generation_seconds'] = elapsed
            before = baselines[case['id']]['cumulative']; fresh = outcome['cumulative']
            def semantic(value):
                return {key: ({k: v for k, v in item.items() if k != 'projection_of'}
                    if key in {'text', 'projection'} else item) for key, item in value.items()}
            outcome['comparison'] = dict(baseline_status=before['status'], status=fresh['status'],
                cumulative_exact_except_artifact_uuid=canonical(semantic(before)) == canonical(semantic(fresh)),
                fixed_retention_control=case['id'] in CONTROL_IDS)
            report['cases'].append(outcome); write(ROOT/'after.private.json', report)
            print(canonical(dict(id=case['id'], seconds=elapsed, candidate=outcome['candidate']['status'], status=fresh['status'])), flush=True)
        assert report['calls_started'] == report['new_generation'] == len(report['cases']) == 14
        assert vendor.installed_files(Path(pack['optional_target'])) == manifest['installed_files']
        assert vendor.vendor_bindings(manifest, Path(pack['optional_target']))[1] == objects
        report.update(status='COMPLETE_PENDING_ALL_RAW_REVIEW_NOT_ADOPTED', optional_target_unchanged=True)
    except BaseException:
        report.update(status='FAILED_PARTIAL_NO_RETRY_NOT_ADOPTED', traceback=traceback.format_exc()); raise
    finally:
        write(ROOT/'after.private.json', report)
        if generator is not None:
            del generator; gc.collect()
            import torch
            torch.cuda.empty_cache()
        check_initial(pack)
        assert sha(adapter/'adapter_model.safetensors') == trained['weights_sha256']
        assert sha(adapter/'adapter_config.json') == trained['config_sha256']


def run():
    started = time.monotonic(); deadline = started+900
    pack = checked_pack()
    with (ROOT/'run-started.private.json').open('x', encoding='utf-8') as stream:
        stream.write(canonical(dict(deadline=deadline, retry=False, max_seconds=900,
            cpu_manifest_sha256=TRIAL_MANIFEST))+'\n')
    report = dict(status='STARTED', stages=[], model_loads_started=0, new_generation=0,
        calls_started=0, updates=0, measurement_forwards=0, normal_adoption=False,
        next_training_initial_adoption=False, db_calls=0, retry=False)
    write(ROOT/'run.private.json', report)
    failure = None
    def refresh_counts():
        paths = {'train': ROOT/'train/report.json', 'after': ROOT/'after.private.json'}
        stages = [read(path) for path in paths.values() if path.exists()]
        report['unreported_started_stages'] = [name for name, path in paths.items()
            if (ROOT/(name+'-started.private.json')).exists() and not path.exists()]
        report['counter_complete'] = not report['unreported_started_stages']
        report['counter_scope'] = 'Persisted stage counters; any unreported started stage has unknown counts.'
        for key in ('model_loads_started', 'new_generation', 'calls_started', 'updates', 'measurement_forwards'):
            report[key] = sum(stage.get(key, 0) for stage in stages)
        assert report['model_loads_started'] <= 2 and report['new_generation'] <= 14 and report['calls_started'] <= 14
        assert report['updates'] <= 23 and report['measurement_forwards'] <= 20
    try:
        assert not subprocess.check_output(['nvidia-smi', '--query-compute-apps=pid,used_memory',
            '--format=csv,noheader'], text=True, timeout=2).strip(), 'gpu_process_already_running'
        for phase in ('_train', '_after'):
            deadline_check(deadline); remaining = deadline-time.monotonic()-5
            assert remaining > 0
            environment = dict(os.environ)
            if phase == '_train': environment.pop('PYTHONPATH', None)
            else: environment['PYTHONPATH'] = pack['optional_target']
            report['active_phase'] = phase; write(ROOT/'run.private.json', report)
            with (ROOT/(phase[1:]+'.log')).open('x', encoding='utf-8') as log:
                process = subprocess.Popen([sys.executable, str(Path(__file__).resolve()), phase,
                    '--api', str(API), '--root', str(ROOT), '--deadline', str(deadline)],
                    stdout=log, stderr=subprocess.STDOUT, env=environment, start_new_session=True)
                try:
                    code = process.wait(timeout=remaining)
                except BaseException:
                    try: os.killpg(process.pid, signal.SIGTERM)
                    except ProcessLookupError: pass
                    try: process.wait(timeout=1)
                    except subprocess.TimeoutExpired:
                        try: os.killpg(process.pid, signal.SIGKILL)
                        except ProcessLookupError: pass
                        process.wait(timeout=1)
                    report['stages'].append(dict(phase=phase, exit=process.returncode, interrupted=True))
                    raise
            report['stages'].append(dict(phase=phase, exit=code))
            refresh_counts()
            write(ROOT/'run.private.json', report)
            assert code == 0, 'phase_failed_no_retry'
        assert report['model_loads_started'] == 2 and report['new_generation'] == report['calls_started'] == 14
        assert report['updates'] == 23 and report['measurement_forwards'] == 20
        report['status'] = 'COMPLETE_PENDING_ALL_RAW_REVIEW_NOT_ADOPTED'
    except BaseException as error:
        failure = error; report.update(status='FAILED_PARTIAL_NO_RETRY_NOT_ADOPTED', traceback=traceback.format_exc())
    finally:
        try:
            refresh_counts()
        except BaseException as error:
            report['status'] = 'FAILED_COUNTERS_NOT_ADOPTED'; report['counter_error'] = type(error).__name__
            if failure is None: failure = error
        report['seconds'] = time.monotonic()-started
        try:
            checked_pack(); report['originals_api_initial_weights_unchanged'] = True
        except BaseException as error:
            report['status'] = 'FAILED_FINAL_IDENTITY_NOT_ADOPTED'; report['identity_error'] = type(error).__name__
            if failure is None: failure = error
        try:
            report['gpu_after_compute_apps'] = subprocess.check_output(['nvidia-smi',
                '--query-compute-apps=pid,used_memory', '--format=csv,noheader'], text=True, timeout=2).strip()
            report['gpu_after_memory_utilization'] = subprocess.check_output(['nvidia-smi',
                '--query-gpu=memory.used,utilization.gpu', '--format=csv,noheader'], text=True, timeout=2).strip()
            assert not report['gpu_after_compute_apps'], 'gpu_process_remained_after_cleanup'
            report['gpu_cleanup_verified'] = True
        except BaseException as error:
            report['status'] = 'FAILED_GPU_STATE_NOT_ADOPTED'; report['gpu_cleanup_error'] = type(error).__name__
            if failure is None: failure = error
        report['seconds'] = time.monotonic()-started
        write(ROOT/'run.private.json', report)
        write(ROOT/'result-manifest.private.json', {str(p.relative_to(ROOT)): sha(p) for p in sorted(ROOT.rglob('*'))
            if p.is_file() and p.name != 'result-manifest.private.json'})
        print(canonical(dict(status=report['status'], seconds=report['seconds'], updates=report['updates'],
            new_generation=report['new_generation'], model_loads_started=report['model_loads_started'])))
    if failure is not None: raise failure


def main():
    global ROOT, TRIAL_MANIFEST
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('mode', choices=('prepare', 'run', '_train', '_after'))
    cli.add_argument('--api', type=Path, required=True); cli.add_argument('--root', type=Path, required=True)
    cli.add_argument('--prepared-root', type=Path); cli.add_argument('--prepared-manifest-sha256')
    cli.add_argument('--original-root', type=Path); cli.add_argument('--original-manifest-sha256')
    cli.add_argument('--hc-root', type=Path); cli.add_argument('--controls-manifest', type=Path)
    cli.add_argument('--controls-manifest-sha256'); cli.add_argument('--deadline', type=float)
    cli.add_argument('--trial-manifest-sha256')
    args = cli.parse_args(); ROOT = args.root.resolve(); bind_api(args.api)
    if args.mode == 'prepare':
        assert all(getattr(args, key) is not None for key in ('prepared_root', 'prepared_manifest_sha256',
            'original_root', 'original_manifest_sha256', 'hc_root', 'controls_manifest', 'controls_manifest_sha256'))
        prepare(args)
    elif args.mode == 'run':
        assert args.trial_manifest_sha256, 'reviewed_trial_manifest_hash_required'
        TRIAL_MANIFEST = args.trial_manifest_sha256
        run()
    else:
        assert args.deadline is not None
        TRIAL_MANIFEST = read(ROOT/'run-started.private.json')['cpu_manifest_sha256']
        (train if args.mode == '_train' else after)(args.deadline)


if __name__ == '__main__': main()
