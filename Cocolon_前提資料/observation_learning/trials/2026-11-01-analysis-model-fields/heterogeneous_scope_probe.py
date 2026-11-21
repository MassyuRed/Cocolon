"""One fixed-v10 heterogeneous/ordinary-answer model probe; no training/retry.

Fixtures are complete independently synthetic snapshots from the CPU diagnostic.
Only their source snapshots enter the model: the hand-authored candidate packets
and expectations are never prompt content. Full responses/results stay private.
Run each mode in a separate process. The execution owner must additionally wrap
``generate`` in a 300-second parent subprocess timeout, including loading/consume.
"""
from __future__ import annotations

import argparse
from contextlib import ExitStack
from dataclasses import asdict, replace
import gc
import hashlib
import importlib.util
import json
from pathlib import Path
import signal
import subprocess
import sys
import threading
import time
import traceback
from unittest.mock import patch


IDS = tuple('HC' + str(i).zfill(2) for i in range(1, 11))
PROFILE = 'selected_material.v10'
WEIGHTS = 'a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59'
CONFIG = '006ebf7bef859264b3778126f4a0f6512e1b2a7e6049b09dfcf0d56603ede3a9'
RUNTIME_HELPER = '97275c93fce38340590f49a30dacea1f5eeb592a304d63c12269b32d602f0e7b'
RUNTIME_PACK = '7acc464f1b45916a9d96bf91a27b042b71532456cec667e123d86208cf0c58e3'
MAX_SECONDS, PER_GENERATION_SECONDS = 300, 23


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True,
        separators=(',', ':'), allow_nan=False)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def digest(value):
    return hashlib.sha256(canonical(value).encode()).hexdigest()


def read(path):
    return json.loads(Path(path).read_bytes())


def write(path, value):
    path = Path(path)
    temp = path.with_name(path.name + '.tmp')
    temp.write_text(canonical(value) + '\n', encoding='utf-8')
    temp.replace(path)


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def git_head(api):
    return subprocess.check_output(['git', '-C', str(api), 'rev-parse', 'HEAD'], text=True).strip()


def clean(api):
    assert not subprocess.check_output(['git', '-C', str(api), 'status',
        '--porcelain', '--untracked-files=no'], text=True).strip(), 'dirty_tracked_api'


def without_artifact_id(value):
    # Offline map reconstruction owns a fresh artifact UUID. All other bytes
    # of each public projection and the whole typed graph must remain equal.
    return None if value is None else {k: v for k, v in value.items() if k != 'projection_of'}


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('mode', choices=['prepare', 'generate', 'replay', 'compare'])
    for name in ('api', 'fixtures', 'runtime-pack', 'runtime-helper', 'root'):
        cli.add_argument('--' + name, type=Path, required=True)
    cli.add_argument('--expected-api-commit')
    args = cli.parse_args()
    api, fixtures_path = args.api.resolve(), args.fixtures.resolve()
    runtime_pack, runtime_helper = args.runtime_pack.resolve(), args.runtime_helper.resolve()
    root = args.root.resolve()
    assert sha(runtime_pack) == RUNTIME_PACK, 'runtime_pack_changed'
    assert sha(runtime_helper) == RUNTIME_HELPER, 'runtime_helper_changed'
    oldpack = read(runtime_pack)
    adapter = Path(oldpack['initial_adapter'])
    assert sha(adapter / 'adapter_model.safetensors') == WEIGHTS, 'initial_adapter_changed'
    assert sha(adapter / 'adapter_config.json') == CONFIG, 'initial_config_changed'
    clean(api)
    head = git_head(api)
    if args.expected_api_commit:
        assert head == args.expected_api_commit, 'unexpected_api_commit'
    sys.path[:0] = [str(api / 'ai/services/ai_inference'), str(api / 'ai/tools')]
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import (
        semantic_admission as admission, intent_compiler as compiler,
        observed_route_realizer as author)
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import (
        AnalysisSourceError, freeze_analysis_sources, source_field_text)
    fixture_module = load('heterogeneous_cpu_fixtures', fixtures_path)
    paths = tuple(fixture_module.SOURCE_PATHS) + ('ai/tools/serve_emlis_natural_reply.py',)
    hashes = {path: sha(api / path) for path in paths}

    def prepared(case):
        return service.prepare_cumulative_category_units(case['row']['owner'],
            case['row']['snapshot'], prompt_version=PROFILE)

    def check_input(pack, *, compare=False):
        assert sha(__file__) == pack['runner_sha256'], 'runner_changed'
        assert sha(fixtures_path) == pack['fixtures_sha256'], 'fixtures_changed'
        assert sha(runtime_pack) == RUNTIME_PACK and sha(runtime_helper) == RUNTIME_HELPER
        assert sha(adapter / 'adapter_model.safetensors') == WEIGHTS
        assert sha(adapter / 'adapter_config.json') == CONFIG
        clean(api)
        assert git_head(api) == head and hashes == {path: sha(api / path) for path in paths}
        if not compare:
            assert head == pack['api_commit'] and hashes == pack['api_hashes'], 'api_changed'
        assert pack['ids'] == list(IDS) == [case['id'] for case in pack['cases']]
        assert len(pack['cases']) == pack['max_generations'] == 10
        for case in pack['cases']:
            p = prepared(case)
            assert p.messages() == case['messages'] and p.request_ref == case['request_ref']
            assert p.source_guard == case['source_guard'] and digest(p.messages()) == case['messages_sha256']

    def consume(case, p, response):
        model_input = replace(p, response=response)
        result = dict(id=case['id'], row=case['row'], response=asdict(response),
            messages=p.messages(), request_ref=p.request_ref, source_guard=p.source_guard)
        assert response.request_ref == p.request_ref
        assert response.messages_sha256 == digest(p.messages())
        assert response.raw_sha256 == hashlib.sha256(response.raw.encode()).hexdigest()
        def no_rpc(*_a, **_k):
            raise AssertionError('offline_probe_rpc_forbidden')
        with patch.object(service, '_rpc', side_effect=no_rpc):
            try:
                candidate, counts = service.build_cumulative_quoted_parent_candidates(
                    case['row']['owner'], case['row']['snapshot'], model_input=model_input)
                storage = service.serialize_cumulative_quoted_parent_candidates(
                    case['row']['owner'], case['row']['snapshot'], model_input=model_input,
                    artifact=candidate, coverage=counts)
                result['candidate'] = dict(status='PARSED_PRIVATE_ONLY', counts=counts,
                    artifact=asdict(candidate), storage=storage, storage_sha256=hashlib.sha256(storage.encode()).hexdigest())
                def no_generate(*_a, **_k):
                    raise AssertionError('saved_candidate_generation_forbidden')
                with ExitStack() as stack:
                    for obj, name in ((MeaningExperienceEngine, 'generate'),
                            (compiler, 'compile_analysis_unit_candidates'),
                            (author, 'realize_analysis_unit_candidates')):
                        stack.enter_context(patch.object(obj, name, side_effect=no_generate))
                    restored, restored_counts = service.reload_cumulative_quoted_parent_candidates(
                        case['row']['owner'], case['row']['snapshot'], storage)
                assert restored == candidate and restored_counts == counts
                result['candidate']['saved_non_generation_reload_exact'] = True
            except (AnalysisSourceError, admission.AnalysisSemanticError, ValueError) as error:
                result['candidate'] = dict(status='REJECTED', error_type=type(error).__name__, reason=str(error))
            try:
                artifact, counts = service.build_cumulative_map(case['row']['owner'],
                    case['row']['snapshot'], model_input=model_input)
                result['cumulative'] = dict(status='UNSUPPORTED' if artifact is None else 'GENERATED_PRIVATE_ONLY', counts=counts)
                if artifact is not None:
                    result['cumulative'].update(graph=asdict(artifact.graph),
                        text=artifact.safe_text_projection(authenticated_owner_scope=case['row']['owner']),
                        projection=artifact.safe_projection(authenticated_owner_scope=case['row']['owner']))
                    frozen = freeze_analysis_sources(p.request)
                    sources = {source.envelope.envelope_id: source for source in frozen.sources}
                    for node in artifact.graph.nodes:
                        for evidence in node.evidence_refs:
                            source = sources[evidence.source_envelope_id]
                            assert source.record_ref in node.record_refs
                            text = source_field_text(source, evidence.field_path)
                            literal = text[evidence.scalar_start:evidence.scalar_end]
                            assert hashlib.sha256(text.encode()).hexdigest() == evidence.field_sha256
                            assert hashlib.sha256(literal.encode()).hexdigest() == evidence.literal_sha256
                            assert source.envelope.raw_utf8[evidence.utf8_start:evidence.utf8_end].decode() == literal
                    assert not artifact.graph.edges, 'these source fixtures write no sequence relation'
            except (AnalysisSourceError, admission.AnalysisSemanticError, ValueError) as error:
                result['cumulative'] = dict(status='REJECTED', error_type=type(error).__name__, reason=str(error))
        assert model_input.response == response
        return result

    if args.mode == 'prepare':
        assert not root.exists(), 'new_root_required'
        from transformers import AutoTokenizer
        from serve_emlis_natural_reply import MODEL, REVISION, PINS
        tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION,
            local_files_only=True, trust_remote_code=False)
        specs = fixture_module.fixtures()
        assert [case['id'] for case in specs] == list(IDS)
        cases = []
        for index, spec in enumerate(specs, 1):
            snapshot, _synthetic_units_not_sent = fixture_module.source_fixture(spec, index)
            case = dict(id=spec['id'], purpose=spec['purpose'],
                row=dict(owner=fixture_module.OWNER, snapshot=snapshot))
            p = prepared(case)
            messages = p.messages()
            n = len(tokenizer.apply_chat_template(messages, tokenize=True,
                enable_thinking=False, add_generation_prompt=True,
                truncation=False, return_dict=False))
            assert n + 2048 <= 8192, 'complete_source_exceeds_budget'
            cases.append(dict(case, messages=messages, messages_sha256=digest(messages),
                request_ref=p.request_ref, source_guard=p.source_guard, tokens=n,
                field_count=len(json.loads(messages[1]['content'])['fields'])))
        pack = dict(schema_version='analysis_heterogeneous_scope_fixed_v10_probe.v1',
            status='CPU_PREPARED_NO_MODEL', api_commit=head, api_hashes=hashes,
            ids=list(IDS), profile=PROFILE, model=MODEL, revision=REVISION, pins=PINS,
            runner_sha256=sha(__file__), fixtures_sha256=sha(fixtures_path),
            runtime_helper_sha256=RUNTIME_HELPER, runtime_pack_sha256=RUNTIME_PACK,
            initial_weights_sha256=WEIGHTS, initial_config_sha256=CONFIG,
            training_updates=0, max_generations=10, max_model_loads=1,
            max_seconds=MAX_SECONDS, per_generation_seconds=PER_GENERATION_SECONDS,
            context_tokens=8192, output_tokens=2048, normal_adoption=False, cases=cases)
        check_input(pack)
        root.mkdir(parents=True)
        write(root / 'pack.private.json', pack)
        print(canonical(dict(status=pack['status'], cases=len(cases),
            total_fields=sum(case['field_count'] for case in cases),
            max_input_tokens=max(case['tokens'] for case in cases), pack_sha256=sha(root / 'pack.private.json'))))
        return

    pack = read(root / 'pack.private.json')
    check_input(pack, compare=args.mode == 'compare')
    if args.mode in {'replay', 'compare'}:
        output = root / ('replay.private.json' if args.mode == 'replay' else 'compare.private.json')
        assert not output.exists(), 'new_replay_or_compare_output_required'
        results = read(root / 'result.private.json')
        assert results['status'] == 'COMPLETE_PENDING_REVIEW_NOT_ADOPTED'
        assert [case['id'] for case in results['cases']] == list(IDS)
        assert results['calls_started'] == results['new_generation'] == 10
        checked = []
        for case in results['cases']:
            p = prepared(case)
            response = admission.AnalysisModelQuotedParentUnitsResponse(**case['response'])
            raw_path = root / (case['id'] + '.raw.txt')
            assert raw_path.read_bytes().decode('utf-8') == response.raw and sha(raw_path) == response.raw_sha256
            fresh = consume(case, p, response)
            if args.mode == 'replay':
                assert canonical(fresh['candidate']) == canonical(case['candidate'])
                for key in ('status', 'counts', 'graph', 'reason', 'error_type'):
                    assert canonical(fresh['cumulative'].get(key)) == canonical(case['cumulative'].get(key))
                for key in ('text', 'projection'):
                    assert without_artifact_id(fresh['cumulative'].get(key)) == without_artifact_id(case['cumulative'].get(key))
            checked.append(fresh if args.mode == 'compare' else dict(id=case['id'],
                candidate_storage_exact=True, cumulative_exact_except_new_artifact_uuid=True))
        check_input(pack, compare=args.mode == 'compare')
        write(output, dict(schema_version='analysis_heterogeneous_scope_' + args.mode + '.v1',
            api_commit=head, api_hashes=hashes, generating_api_commit=pack['api_commit'],
            generating_api_hashes=pack['api_hashes'], model_calls=0, model_loads=0,
            updates=0, db_calls=0, raw_unchanged=True, cases=checked))
        print(canonical(dict(mode=args.mode, cases=len(checked), model_calls=0,
            statuses=[dict(id=case['id'], status=case.get('cumulative', {}).get('status')) for case in checked]
                if args.mode == 'compare' else [])))
        return

    assert not (root / 'result.private.json').exists(), 'no_restart'
    helper = load('fixed_runtime_helper', runtime_helper)
    helper.admission = admission
    result = dict(schema_version='analysis_heterogeneous_scope_result.v1', status='STARTED',
        cases=[], calls_started=0, new_generation=0, model_loads_started=0, model_loads=0,
        training_updates=0, normal_adoption=False, api_calls=0, db_calls=0,
        weights_sha256=WEIGHTS, config_sha256=CONFIG)
    write(root / 'result.private.json', result)
    started = time.monotonic()
    deadline = started + MAX_SECONDS
    generator = None
    try:
        helper.check_pins(oldpack)
        vendor, manifest, objects, proof = helper.verify_optional_generation(oldpack)
        from serve_emlis_natural_reply import load_generator
        result['model_loads_started'] = 1
        write(root / 'result.private.json', result)
        generator = load_generator(str(adapter), threading.Event(), weights_sha256=WEIGHTS, config_sha256=CONFIG)
        result['model_loads'] = 1
        result['optional_binding_proof'] = proof
        assert vendor.vendor_bindings(manifest, Path(oldpack['optional_target']))[1] == objects
        for spec in pack['cases']:
            assert time.monotonic() < deadline, 'shared_deadline_exhausted'
            check_input(pack)
            p = prepared(spec)
            result['active_id'] = spec['id']
            result['calls_started'] += 1
            write(root / 'result.private.json', result)
            called = time.monotonic()
            end = min(deadline, called + PER_GENERATION_SECONDS)
            def expired(_signum, _frame):
                raise TimeoutError('generation_deadline_no_retry')
            previous_handler = signal.signal(signal.SIGALRM, expired)
            signal.setitimer(signal.ITIMER_REAL, max(.001, end - called))
            try:
                raw, finish = generator(p.messages(), end)
            finally:
                signal.setitimer(signal.ITIMER_REAL, 0)
                signal.signal(signal.SIGALRM, previous_handler)
            seconds = time.monotonic() - called
            response = admission.AnalysisModelQuotedParentUnitsResponse(p.request_ref,
                digest(p.messages()), hashlib.sha256(raw.encode()).hexdigest(), finish, raw)
            write(root / (spec['id'] + '.response.private.json'), dict(row=spec['row'],
                messages=p.messages(), response=asdict(response)))
            (root / (spec['id'] + '.raw.txt')).write_text(raw, encoding='utf-8')
            result['new_generation'] += 1
            write(root / 'result.private.json', result)
            assert finish == 'stop' and seconds <= PER_GENERATION_SECONDS, 'incomplete_no_retry'
            case = consume(spec, p, response)
            case['generation_seconds'] = seconds
            result['cases'].append(case)
            write(root / 'result.private.json', result)
            print(canonical(dict(id=case['id'], seconds=seconds,
                candidate_status=case['candidate']['status'], status=case['cumulative']['status'])), flush=True)
        assert vendor.installed_files(Path(oldpack['optional_target'])) == manifest['installed_files']
        result.update(status='COMPLETE_PENDING_REVIEW_NOT_ADOPTED', optional_unchanged=True)
    except BaseException:
        result.update(status='FAILED_PARTIAL_NO_RETRY', traceback=traceback.format_exc())
        raise
    finally:
        result['seconds'] = time.monotonic() - started
        write(root / 'result.private.json', result)
        if generator is not None:
            del generator
            gc.collect()
            import torch
            torch.cuda.empty_cache()
        check_input(pack)


if __name__ == '__main__':
    main()
