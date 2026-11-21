"""One private, non-adopted positive-reading diagnostic; at most two adapter POSTs."""
import ast
import hashlib
import json
import math
import os
from pathlib import Path
import shutil
import signal
import subprocess
import time
import urllib.request

ROOT = Path('/workspace/semantic-reader-base-control-20261116-once')
PREVIOUS_POSITIVE = Path('/workspace/semantic-reader-worked-lesson-20261116-once')
LAST_DIAGNOSTIC = Path('/workspace/semantic-reader-adapter-base-20261115-once')
OVERLAY = Path('/workspace/semantic_admission.worked_lesson.py')
OVERLAY_SHA = 'b489a2204dfe53aa0de30e3573d707af877c9eef62d410c710e706fafdcd80fa'
NATIVE_SCHEMA_OVERLAY = Path('/workspace/semantic_output_schema.source_first.py')
NATIVE_SCHEMA_OVERLAY_SHA = '29fe72a2d6adbbf8e9f1520cca3a39f021061445f3424f566f1fbc2a8b27421e'
NATIVE_SCHEMA_PRIOR_SHA = 'b302242ac4e9ea9eef413c5bb2bc29db525280a5006921b55bbde8b4362bdac0'
NATIVE_PARSER_OVERLAY = Path('/workspace/semantic_json_parser.ordinary_coverage.py')
NATIVE_PARSER_OVERLAY_SHA = '661fdf315738719a15a783839861bc8ed1431c750a63a87d5016dbb3ce620c54'
NATIVE_PARSER_PRIOR_SHA = 'b8a25861b097b40d0bc552d876489ce2fb43bf3b77fe740f75cd6fdf7248bf6b'
CORE_PATH = 'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py'
HISTORY_INPUT = Path('/workspace/semantic-history-source-merge-20261115-once/semantic-history.actual.input.json')
HISTORY_INPUT_SHA = '5f362414c7aaba8249862f53892d62951329874474cc8c56a27a3f58a6c3b91c'
SOURCE = Path('/workspace/semantic-history-source-merge-20261115-once')
SERVE = Path('/workspace/new-fictional-self-piece4b-once-20261109/piece_ordered_server.py')
SERVE_SHA = 'ad3d301d2d1abd9226703dc72e3734eb8da79d8e0cf084d4b0666e97298370be'
NATIVE_SHA = '583a10e8bc25d0bf50e35e53dcfd9407963dc9575e6faac1199c5e5ab30c0c8a'
API_REV = 'dca20231ad1791c07a5011d6905340c78d4de0b3'
EXPECTED_PID = 130379
HISTORICAL_SOURCE_RESTORED_PID = 117766
ADAPTER_MODEL = 'cocolon-qwen3.5-4b-analysis-semantic-120u'
BASE_MODEL = 'cocolon-qwen3.5-4b-analysis-base-851bf6e-candidate'
WEIGHTS = 'ecbdd0d113cfcdc38a17be4b17c708678c01c5071ae86c8a30ca9a5de5900495'
CONFIG = '4389a598b2815adb1a114053944bfc1214518065d9ce5f2e464baaf8181d6f4c'
INPUT = Path('/workspace/semantic-kernel-preparation-20261115/semantic-reader-diagnostic.input.json')
MESSAGES = Path('/workspace/semantic-kernel-preparation-20261115/semantic-reader-diagnostic.messages.json')
CAPACITY = Path('/workspace/semantic-kernel-preparation-20261115/semantic-reader-diagnostic.capacity.json')
INPUT_FILE_SHA = 'bb642569f2a1920735426905a6c1b5b9168af981770c4362d59a12dc6cf2ae0c'
MESSAGES_FILE_SHA = 'a2d9d7a545df2706f8b207be432e9c2f31ab546578af9c4cc23a50928a461cb9'
MESSAGES_SHA = '722924e92f50be6a9d55014fb35cfdaf736727b231a8e8ea6b5e0d9e666be931'
CAPACITY_SHA = 'b47a6cdf3fb7095e5d2a428f1ee5672a973c275e1f7cc3a028c0905bb4fa0a6c'
DEPS = Path('/workspace/semantic-kernel-deps-compat-20261115')
CACHE = Path('/workspace/semantic-kernel-cache-compat-20261115/triton')
PROOF = Path('/workspace/semantic-kernel-proof-ada-20261115.json')
PROOF_SHA = '28908c29ee066397bcc1a3326eefe41453ce159c11a90eec06f691932fc7675e'
DEPENDENCIES = {'fla-core': '0.4.1', 'einops': '0.8.2', 'causal-conv1d': '1.7.0'}
BASELINES = {'torch': '2.8.0+cu128', 'transformers': '5.19.0', 'triton': '3.4.0'}
PYTHONPATH_SUFFIX_SHA = 'f37f311013760c8286cc1b975f95f55d7407d1d0ab5c478afa62da34a140ac3c'
FILES = {
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py': '42fc2f04421c3a89241a6f940f15845d28439cadb059c5d69afd1af846ac6e56',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py': '138f54c9c8800e970bae69a81e2a696c45f7515687636daae0e5fa8085512f10',
    'ai/services/ai_inference/analysis_cumulative_service.py': '9e6eb77154ace9fb5b20fdd4630d5ab4b44c9d55e91cfd7512a11de67edda49e',
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
    for duration, force in ((20, False), (5, True)):
        if force:
            try:
                os.kill(pid, signal.SIGKILL)
            except ProcessLookupError:
                return
        end = time.monotonic() + duration
        while time.monotonic() < end:
            try:
                if (Path('/proc') / str(pid) / 'stat').read_text().split(') ', 1)[1].startswith('Z '):
                    return
            except FileNotFoundError:
                return
            time.sleep(.25)
    raise RuntimeError('provider_did_not_stop')


def patch_native(source):
    def once(old, new):
        nonlocal source
        assert source.count(old) == 1, 'native_patch_identity_changed'
        source = source.replace(old, new, 1)
    once("PIECE_CANDIDATE_FORMAT = 'piece.field_slots.v1'",
        "PIECE_CANDIDATE_FORMAT = 'piece.field_slots.v1'\nANALYSIS_BASE_MODEL = " + repr(BASE_MODEL))
    once('                request = json.loads(self.rfile.read(length))\n                messages = request["messages"]',
        '                request = json.loads(self.rfile.read(length))\n'
        '                analysis_base = request.get("model") == ANALYSIS_BASE_MODEL\n'
        '                if analysis_base:\n'
        '                    if natural:\n'
        '                        raise ValueError\n'
        '                    selected_model = ANALYSIS_BASE_MODEL\n'
        '                messages = request["messages"]')
    once('if natural else generate(messages, end))',
        'if natural else generate(messages, end, profile="analysis_base")\n'
        '                                if analysis_base else generate(messages, end))')
    once('if profile not in (None, "natural", "piece"):',
        'if profile not in (None, "natural", "piece", "analysis_base"):')
    once('            raise ValueError("piece_constraint_unavailable")',
        '            raise ValueError("piece_constraint_unavailable")\n'
        '        if profile == "analysis_base" and (not semantic_json or tokenizer_data is None or not adapter):\n'
        '            raise ValueError("analysis_constraint_unavailable")')
    once('base_inference_context(model) if base_profile and adapter else nullcontext()',
        'base_inference_context(model) if (base_profile or profile == "analysis_base") and adapter else nullcontext()')
    once('        with adapter_context, torch.inference_mode():',
        '        with adapter_context, torch.inference_mode():\n'
        '            if profile == "analysis_base":\n'
        '                generation_stage("analysis_base_adapter_disabled")')
    once('max_requests=0 if args.analysis_service else args.max_requests,',
        'max_requests=2 if args.analysis_service else args.max_requests,')
    once('                if not max_requests:\n                    generation_failure(exc)',
        '                generation_failure(exc)')
    parsed = ast.parse(source)
    schema_node = next(node for node in parsed.body if isinstance(node, ast.FunctionDef) and node.name == 'semantic_output_schema')
    prior = ast.get_source_segment(source, schema_node)
    assert digest(prior.encode()) == NATIVE_SCHEMA_PRIOR_SHA, 'native_schema_predecessor_changed'
    overlay = NATIVE_SCHEMA_OVERLAY.read_bytes()
    assert digest(overlay) == NATIVE_SCHEMA_OVERLAY_SHA
    replacement = overlay.decode().rstrip('\n')
    replacement_node = ast.parse(replacement).body
    assert len(replacement_node) == 1 and isinstance(replacement_node[0], ast.FunctionDef) and replacement_node[0].name == 'semantic_output_schema'
    assert source.count(prior) == 1
    source = source.replace(prior, replacement, 1)
    parsed = ast.parse(source)
    parser_node = next(node for node in parsed.body if isinstance(node, ast.FunctionDef) and node.name == 'semantic_json_parser')
    prior_parser = ast.get_source_segment(source, parser_node)
    assert digest(prior_parser.encode()) == NATIVE_PARSER_PRIOR_SHA, 'native_parser_predecessor_changed'
    parser_overlay = NATIVE_PARSER_OVERLAY.read_bytes()
    assert digest(parser_overlay) == NATIVE_PARSER_OVERLAY_SHA
    parser_replacement = parser_overlay.decode().rstrip('\n')
    parser_nodes = ast.parse(parser_replacement).body
    assert len(parser_nodes) == 1 and isinstance(parser_nodes[0], ast.FunctionDef) and parser_nodes[0].name == 'semantic_json_parser'
    assert source.count(prior_parser) == 1
    source = source.replace(prior_parser, parser_replacement, 1)
    compile(source, 'private_positive_candidate.py', 'exec')
    return source


def dependency_tree():
    files = {str(path.relative_to(DEPS)): digest(path.read_bytes()) for path in sorted(DEPS.rglob('*'))
        if path.is_file() and '__pycache__' not in path.parts and path.suffix != '.pyc'}
    assert files and all(not name.split('/')[0].startswith(('torch', 'triton', 'transformers')) for name in files)
    return dict(file_count=len(files), sha256=digest(canonical(files).encode()))


def verify_kernel_proof(env):
    assert len(PROOF_SHA) == 64 and set(PROOF_SHA) <= set('0123456789abcdef'), 'successful_kernel_proof_pending'
    raw = PROOF.read_bytes()
    assert digest(raw) == PROOF_SHA
    proof = json.loads(raw)
    assert proof['schema'] == 'cocolon.analysis.kernel_warm_proof.v1' and proof['state'] == 'PASS'
    assert all(proof[key] is True for key in ('warm_completed', 'finite', 'baseline_unchanged', 'dependency_tree_unchanged'))
    assert proof['model_loaded'] is False and proof['weights_loaded'] is False
    assert proof['new_model_calls'] == proof['training'] == 0
    assert proof['deps_path'] == str(DEPS) and proof['cache_dir'] == str(CACHE)
    assert proof['dependency_versions'] == DEPENDENCIES and proof['baseline_versions'] == BASELINES
    assert proof['messages_sha256'] == MESSAGES_SHA and proof['input_tokens'] == 1752
    assert proof['gpu']['capability'] == [8, 9]
    assert proof['gpu']['name'] == 'NVIDIA RTX 4000 Ada Generation'
    assert proof['pythonpath_suffix_sha256'] == digest(env.get('PYTHONPATH', '').encode()) == PYTHONPATH_SUFFIX_SHA
    assert proof['baseline_sources_before'] == proof['baseline_sources_after']
    for row in proof['baseline_sources_before'].values():
        assert not Path(row['path']).resolve().is_relative_to(DEPS)
        assert digest(Path(row['path']).read_bytes()) == row['sha256']
    assert dependency_tree() == proof['dependency_tree_before'] == proof['dependency_tree_after']
    for name in ('chunk_gated_delta_rule', 'fused_recurrent_gated_delta_rule'):
        row = proof['kernel_imports'][name]
        assert row['dispatch_bound'] is True and row['module'].startswith('fla.ops.gated_delta_rule.')
        assert Path(row['path']).resolve().is_relative_to(DEPS / 'fla')
        assert digest(Path(row['path']).read_bytes()) == row['sha256']
        assert row['reference_module'] == 'transformers.models.qwen3_5.modeling_qwen3_5'
    for name in ('chunk_output', 'chunk_state', 'fused_recurrent_output', 'fused_recurrent_state'):
        row = proof['parity'][name]
        assert row['finite'] is True and row['allclose'] is True and row['tolerance'] == .005
        assert math.isfinite(row['rms_relative_error']) and math.isfinite(row['max_absolute_error'])
    causal = proof['causal_conv1d']
    assert causal['installed'] is True and causal['tested'] is True and causal['version'] == DEPENDENCIES['causal-conv1d']
    assert digest(Path(causal['extension']['path']).read_bytes()) == causal['extension']['sha256']
    for name in ('causal_conv1d_output', 'causal_conv1d_update_output', 'causal_conv1d_update_state'):
        assert proof['parity'][name]['finite'] is True and proof['parity'][name]['allclose'] is True
    assert proof['parity']['causal_conv1d_update_state']['exact_equal'] is True
    assert len(proof['warm_runs']) == 2 and all(row['finite'] is True and row['prefill_tokens'] == 1752
        and row['decode_tokens'] == 1 for row in proof['warm_runs'])
    assert proof['capacity_proof']['sha256'] == CAPACITY_SHA == digest(CAPACITY.read_bytes())
    assert digest(Path(proof['script']['path']).read_bytes()) == proof['script']['sha256']
    for name, default, expected in (('FLA_TRIL_PRECISION', 'ieee', 'ieee'), ('FLA_USE_FAST_OPS', '0', '0'), ('FLA_CI_ENV', '0', '0')):
        assert env.get(name, default) == expected
    return raw


def option(argv, name):
    matches = [i for i, value in enumerate(argv) if value == name or value.startswith(name + '=')]
    assert len(matches) <= 1
    if not matches:
        return None
    i = matches[0]
    return argv[i + 1] if argv[i] == name else argv[i].split('=', 1)[1]


def candidate_args(argv, candidate_path):
    args = [argv[0], str(candidate_path)] + argv[2:]
    for name, value, previous in (('--context-tokens', '32768', (None, '16384')),
        ('--request-seconds', '210', (None, '210')), ('--max-new-tokens', '4096', (None, '4096'))):
        assert option(argv, name) in previous
        indices = [i for i, part in enumerate(args) if part == name or part.startswith(name + '=')]
        if not indices:
            args += [name, value]
        elif args[indices[0]] == name:
            args[indices[0] + 1] = value
        else:
            args[indices[0]] = name + '=' + value
    return args


DRIVER = r'''import asyncio, copy, hashlib, json, os, sys, time
from dataclasses import asdict
from pathlib import Path
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / 'ai/services/ai_inference'))
import httpx
import analysis_semantic_map as app
import analysis_cumulative_service as service
import analysis_model_source as source_owner
from analysis_model_source import SelfHostedSemanticAnalysisModelSource, semantic_analysis_input_fits
from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as core
MODEL = 'cocolon-qwen3.5-4b-analysis-base-851bf6e-candidate'
CORE_SHA = 'b489a2204dfe53aa0de30e3573d707af877c9eef62d410c710e706fafdcd80fa'
PARSER_SHA = '661fdf315738719a15a783839861bc8ed1431c750a63a87d5016dbb3ce620c54'
def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False)
def digest(value):
    return hashlib.sha256(value).hexdigest()
def prepared_conditions():
    assert digest(Path(core.__file__).read_bytes()) == CORE_SHA
    original = json.loads((ROOT / 'original_fixed_two_input.json').read_text())
    full = json.loads((ROOT / 'source_full_twelve_input.json').read_text())
    assert original['all_fictional'] is True and full['all_fictional'] is True
    assert len(original['snapshot']['members']) == 2 and len(full['snapshot']['members']) == 12
    selected = copy.deepcopy(full)
    selected['snapshot']['members'] = [copy.deepcopy(full['snapshot']['members'][i]) for i in (3, 8)]
    selected['snapshot']['guard'] = 'analysis-db-cumulative-v1:' + core.semantic_map_hash(
        dict(owner=selected['owner'], members=selected['snapshot']['members']))
    selected['guard_derivation'] = 'Existing semantic_map_hash over fictional owner and selected exact members; not a measured SQL snapshot guard.'
    expected_guard = 'analysis-db-cumulative-v1:' + core.semantic_map_hash(
        dict(owner=original['owner'], members=original['snapshot']['members']))
    assert original['snapshot']['guard'] == expected_guard
    rows = []
    for name, material, indices in (('book_club_two_day', original, None),
        ('lighting_prior_and_later', selected, [3, 8])):
        assert all(member['thread'] is None and member['events'] == [] for member in material['snapshot']['members'])
        parent = app.prepare_semantic_map(material['owner'], material['snapshot'])
        assert service.prepare_semantic_history_batches(parent) == (), 'diagnostic_requires_history_batches'
        assert semantic_analysis_input_fits(parent), 'diagnostic_input_over_limit'
        messages = parent.messages()
        assert len(json.loads(parent.material_json)['fields']) == 4
        row = dict(name=name, model=MODEL, adapter_enabled=False, state='PREPARED',
            all_fictional=True, source_full_twelve_member_indices=indices,
            material=material, input_sha256=digest(canonical(material).encode()),
            request_ref=parent.request_ref, messages=messages,
            messages_sha256=core.semantic_map_hash(messages), message_bytes=len(canonical(messages).encode()))
        rows.append((row, parent))
    return rows
def preflight():
    from transformers import AutoTokenizer
    tokenizer = AutoTokenizer.from_pretrained('Qwen/Qwen3.5-4B',
        revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a', local_files_only=True, trust_remote_code=False)
    conditions = []
    for row, parent in prepared_conditions():
        tokens = tokenizer.apply_chat_template(row['messages'], enable_thinking=False,
            add_generation_prompt=True, tokenize=True, return_dict=False, truncation=False)
        assert len(tokens) + 4096 <= 32768, 'diagnostic_token_capacity_exceeded'
        row.update(input_tokens=len(tokens), reserved_output_tokens=4096, context_tokens=32768,
            input_plus_output_tokens=len(tokens)+4096)
        conditions.append(row)
    result = dict(state='PREFLIGHT_PASS', source_core_sha256=CORE_SHA, all_fictional=True,
        new_model_calls=0, training=0, conditions=conditions)
    (ROOT / 'positive-reading.preflight.json').write_text(canonical(result)+'\n')
    print(canonical(dict(state=result['state'], conditions=[dict(name=r['name'],
        input_tokens=r['input_tokens'], messages_sha256=r['messages_sha256']) for r in conditions])))
async def main():
    checked = json.loads((ROOT / 'positive-reading.preflight.json').read_text())
    assert checked['state'] == 'PREFLIGHT_PASS' and checked['source_core_sha256'] == CORE_SHA
    conditions = prepared_conditions()
    assert [row for row, _ in conditions] == [{k:v for k,v in row.items() if k not in {
        'input_tokens','reserved_output_tokens','context_tokens','input_plus_output_tokens'}} for row in checked['conditions']]
    assert source_owner.SEMANTIC_HTTP_TIMEOUT_SECONDS == 220
    assert source_owner.SEMANTIC_REQUEST_TIMEOUT_SECONDS == 225
    assert source_owner.SEMANTIC_PIPELINE_TIMEOUT_SECONDS == 840
    key = next(line.split('=', 1)[1].strip() for line in Path('/workspace/analysis.env').read_text().splitlines()
        if line.startswith('COCOLON_ANALYSIS_MODEL_API_KEY='))
    assert len(key) >= 24
    os.environ['COCOLON_ANALYSIS_OBSERVED_MODE'] = 'development'
    result = dict(state='STARTED_NOT_ADOPTED', all_fictional=True, model=MODEL,
        source_core_sha256=CORE_SHA, native_parser_overlay_sha256=PARSER_SHA, max_model_calls=2, new_model_calls=0,
        training=0, retry=0, pipeline_seconds=385, native_request_seconds=210,
        source_http_seconds=220, source_request_seconds=225, acquisitions=[], conditions=[])
    started = time.monotonic()
    with (ROOT / 'positive-reading.actual.result.json').open('x', encoding='utf-8') as output:
        def save():
            output.seek(0); output.truncate(); output.write(canonical(result) + '\n'); output.flush()
        save()
        async with httpx.AsyncClient(trust_env=False, follow_redirects=False) as client:
            try:
                async with asyncio.timeout(385):
                    for index, (original, parent) in enumerate(conditions):
                        condition = dict(checked['conditions'][index], state='STARTED')
                        result['conditions'].append(condition); save()
                        condition_posts = 0
                        async def forward(request):
                            nonlocal condition_posts
                            assert condition_posts == 0, 'condition_already_posted'
                            assert request.url.host == 'same-pod.invalid' and result['new_model_calls'] < 2
                            body = json.loads(request.content)
                            assert body['messages'] == original['messages'] and body['model'] == MODEL
                            assert body['max_tokens'] == 4096 and body['temperature'] == 0 and body['stream'] is False
                            assert body['chat_template_kwargs'] == {'enable_thinking': False}
                            row = dict(state='SENT', condition=original['name'], model=MODEL, wire_request=body,
                                started_seconds=time.monotonic()-started)
                            condition_posts += 1
                            condition['post_count'] = condition_posts
                            result['acquisitions'].append(row); result['new_model_calls'] += 1; save()
                            try:
                                reply = await client.post('http://127.0.0.1:8000/v1/chat/completions',
                                    headers={'Authorization':'Bearer '+key, 'Content-Type':'application/json',
                                        'Accept-Encoding':'identity'}, content=request.content,
                                    timeout=min(220, max(.001, 385-(time.monotonic()-started))))
                                assert len(reply.content) <= 262144
                                row.update(state='RECEIVED', status_code=reply.status_code, body=reply.text,
                                    body_sha256=digest(reply.content), elapsed_seconds=time.monotonic()-started); save()
                                return httpx.Response(reply.status_code, content=reply.content)
                            except BaseException:
                                row.update(state='FAILED_OR_ACK_UNKNOWN', elapsed_seconds=time.monotonic()-started); save(); raise
                        try:
                            source = SelfHostedSemanticAnalysisModelSource(endpoint='https://same-pod.invalid/v1/chat/completions',
                                model=MODEL, api_key=key, transport=httpx.MockTransport(forward))
                            from analysis_model_source import is_semantic_analysis_model_source
                            assert is_semantic_analysis_model_source(source), 'diagnostic_source_profile_changed'
                            artifact, coverage = await service._semantic_history_map(source, parent)
                            condition.update(state='GENERATED', coverage=coverage,
                                projection=artifact.safe_projection(authenticated_owner_scope=original['material']['owner']),
                                text=artifact.safe_text_projection(authenticated_owner_scope=original['material']['owner'])['text'],
                                private_evidence=artifact.private_evidence())
                        except Exception as exc:
                            condition.update(state='NOT_GENERATED', failure_type=type(exc).__name__)
                            if hasattr(exc, 'status_code'): condition['failure_status'] = exc.status_code
                            if isinstance(exc, app.SemanticMapError): condition['failure_code'] = str(exc)
                        save()
                        if result['acquisitions'][-1]['state'] == 'FAILED_OR_ACK_UNKNOWN':
                            raise RuntimeError('diagnostic_transport_failed_stop')
                assert result['new_model_calls'] == len(result['acquisitions']) == 2
                result['state'] = 'COMPLETE_NOT_ADOPTED_PENDING_MEANING_REVIEW'
            except BaseException as exc:
                result.update(state='INCOMPLETE_NOT_ADOPTED', failure_type=type(exc).__name__)
                raise
            finally:
                result['elapsed_seconds'] = time.monotonic()-started; save()
    print(canonical({k: result[k] for k in ('state','new_model_calls','elapsed_seconds')}))
if sys.argv[1:] == ['--preflight']:
    preflight()
else:
    assert not sys.argv[1:]
    asyncio.run(main())
'''

def main():
    started = time.monotonic()
    assert not ROOT.exists(), 'one_shot_root_already_exists'
    assert digest(SERVE.read_bytes()) == SERVE_SHA
    closed = json.loads((SOURCE / 'execution.json').read_text())
    assert closed['api_commit'] == API_REV and closed['original_provider_restored'] is True
    assert closed['restored_pid'] == HISTORICAL_SOURCE_RESTORED_PID and closed['candidate_source_sha256'] == NATIVE_SHA
    last = json.loads((LAST_DIAGNOSTIC / 'execution.json').read_text())
    assert last['api_commit'] == API_REV and last['original_provider_restored'] is True
    assert last['restored_pid'] == 120452 and last['original_native_sha256'] == NATIVE_SHA
    previous = json.loads((PREVIOUS_POSITIVE/'execution.json').read_text())
    assert previous['original_provider_restored'] is True and previous['restored_pid'] == EXPECTED_PID
    assert previous['state'] == 'DIAGNOSTIC_FINISHED_NOT_ADOPTED'
    assert previous['driver_exit'] == 0 and previous['max_model_calls'] == 2
    assert previous['positive_core_sha256'] == 'b489a2204dfe53aa0de30e3573d707af877c9eef62d410c710e706fafdcd80fa'
    assert previous['native_parser_overlay_sha256'] == NATIVE_PARSER_OVERLAY_SHA
    assert previous['native_schema_overlay_sha256'] == NATIVE_SCHEMA_OVERLAY_SHA
    assert previous['private_probe_variant_sha256'] == '7ae06f31b4db9f8b705dddf67e098a8338c94765c78fc3d5d02194eb89eee562'
    assert digest((PREVIOUS_POSITIVE/'private_positive_candidate.py').read_bytes()) == previous['private_probe_variant_sha256']
    assert digest((PREVIOUS_POSITIVE/'positive_reading_driver.py').read_bytes()) == '7d810e2122daaf80f4a5cc7c303ca1b95bb03c3496d08cc79898ea26c1b894f4'
    previous_result_raw = (PREVIOUS_POSITIVE/'positive-reading.actual.result.json').read_bytes()
    assert digest(previous_result_raw) == 'e49505fbfec6cd97bba6510d11ab2f5c8761d699640251ab30add62c656eaabb'
    previous_result = json.loads(previous_result_raw)
    assert previous_result['state'] == 'COMPLETE_NOT_ADOPTED_PENDING_MEANING_REVIEW'
    assert previous_result['new_model_calls'] == len(previous_result['acquisitions']) == 2
    assert previous_result['source_core_sha256'] == 'b489a2204dfe53aa0de30e3573d707af877c9eef62d410c710e706fafdcd80fa'
    assert len(previous_result['conditions']) == 2 and all(c['state'] == 'GENERATED' for c in previous_result['conditions'])
    for row in previous_result['acquisitions']:
        assert row['state'] == 'RECEIVED' and row['status_code'] == 200
        prior_response = json.loads(row['body'])
        assert prior_response['model'] == ADAPTER_MODEL and len(prior_response['choices']) == 1
        assert prior_response['choices'][0]['finish_reason'] == 'stop'
    # A3 was technically complete but rejected on meaning; no acceptance is inherited.
    assert last['driver_exit'] == 0 and last['max_model_calls'] == 2
    last_result = json.loads((LAST_DIAGNOSTIC / 'semantic-reader-diagnostic.actual.result.json').read_text())
    assert last_result['new_model_calls'] == len(last_result['acquisitions']) == 2
    assert digest(OVERLAY.read_bytes()) == OVERLAY_SHA
    assert digest(NATIVE_PARSER_OVERLAY.read_bytes()) == NATIVE_PARSER_OVERLAY_SHA
    assert digest(HISTORY_INPUT.read_bytes()) == HISTORY_INPUT_SHA
    original = (SOURCE / 'candidate_server.py').read_bytes(); assert digest(original) == NATIVE_SHA
    for path, expected in FILES.items(): assert digest((SOURCE / path).read_bytes()) == expected
    for path, expected in ((INPUT, INPUT_FILE_SHA), (MESSAGES, MESSAGES_FILE_SHA), (CAPACITY, CAPACITY_SHA)):
        assert digest(path.read_bytes()) == expected
    capacity = json.loads(CAPACITY.read_text())
    assert capacity['messages_sha256'] == MESSAGES_SHA and capacity['input_tokens'] == 1752
    assert capacity['new_model_calls'] == 0 and capacity['model_loaded'] is False
    proc = Path('/proc') / str(EXPECTED_PID)
    argv = [v.decode() for v in (proc/'cmdline').read_bytes().split(b'\0') if v]
    start_ticks = (proc/'stat').read_text().split(') ', 1)[1].split()[19]
    assert argv[1] == str(SERVE) and '--analysis-service' in argv and '--semantic-json' in argv
    assert option(argv, '--model-name') == ADAPTER_MODEL
    assert option(argv, '--adapter-weights-sha256') == WEIGHTS and option(argv, '--adapter-config-sha256') == CONFIG
    adapter = Path(option(argv, '--adapter'))
    assert digest((adapter/'adapter_model.safetensors').read_bytes()) == WEIGHTS
    assert digest((adapter/'adapter_config.json').read_bytes()) == CONFIG
    env = dict(v.decode().split('=',1) for v in (proc/'environ').read_bytes().split(b'\0') if v)
    cwd = str((proc/'cwd').resolve())
    proof_raw = verify_kernel_proof(env)
    candidate = patch_native(original.decode())
    ROOT.mkdir(mode=0o700)
    shutil.copytree(SOURCE/'ai', ROOT/'ai')
    for path in (p for p in (SOURCE/'ai').rglob('*') if p.is_file() and '__pycache__' not in p.parts):
        assert digest(path.read_bytes()) == digest((ROOT/path.relative_to(SOURCE)).read_bytes())
    shutil.copyfile(OVERLAY, ROOT / CORE_PATH)
    assert digest((ROOT / CORE_PATH).read_bytes()) == OVERLAY_SHA
    shutil.copyfile(INPUT, ROOT / 'original_fixed_two_input.json')
    shutil.copyfile(HISTORY_INPUT, ROOT / 'source_full_twelve_input.json')
    shutil.copyfile(CAPACITY, ROOT / 'kernel-warm-original.capacity.json')
    (ROOT/'kernel-warm-proof.json').write_bytes(proof_raw)
    candidate_path = ROOT/'private_positive_candidate.py'; candidate_path.write_text(candidate)
    driver_path = ROOT/'positive_reading_driver.py'; driver_path.write_text(DRIVER)
    compile(DRIVER, str(driver_path), 'exec')
    suffix = env.get('PYTHONPATH','')
    candidate_env = dict(env, PYTHONPATH=str(DEPS)+(os.pathsep+suffix if suffix else ''),
        TRITON_CACHE_DIR=str(CACHE), PYTHONDONTWRITEBYTECODE='1')
    driver_env = dict(env, PYTHONPATH='/workspace/semantic-history-20261115-once/client-runtime-deps', PYTHONDONTWRITEBYTECODE='1')
    with (ROOT/'preflight.log').open('xb') as log:
        preflight_env = dict(driver_env, CUDA_VISIBLE_DEVICES='', HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
        preflight = subprocess.run([argv[0], str(driver_path), '--preflight'], cwd=ROOT, env=preflight_env,
            stdin=subprocess.DEVNULL, stdout=log, stderr=subprocess.STDOUT, timeout=60)
    assert preflight.returncode == 0, 'positive_reading_preflight_failed'
    preflight_proof = json.loads((ROOT/'positive-reading.preflight.json').read_text())
    assert preflight_proof['state'] == 'PREFLIGHT_PASS' and len(preflight_proof['conditions']) == 2
    old_preflight=json.loads((PREVIOUS_POSITIVE/'positive-reading.preflight.json').read_text())
    for current, prior in zip(preflight_proof['conditions'],old_preflight['conditions']):
        assert all(current[key] == prior[key] for key in ('name','material','messages','messages_sha256','request_ref','input_tokens','input_plus_output_tokens'))
        assert current['adapter_enabled'] is False and prior['adapter_enabled'] is True
    # Only model identity/context selection and shared two-call time allowance differ.

    state = dict(state='PREPARED_NOT_ADOPTED', api_commit=API_REV, original_native_sha256=NATIVE_SHA,
        private_probe_variant_sha256=digest(candidate.encode()), kernel_proof_sha256=digest(proof_raw),
        kernel_warm_messages_sha256=MESSAGES_SHA, kernel_warm_capacity_sha256=CAPACITY_SHA, kernel_warm_input_tokens=1752,
        positive_core_sha256=OVERLAY_SHA, native_schema_overlay_sha256=NATIVE_SCHEMA_OVERLAY_SHA, native_parser_overlay_sha256=NATIVE_PARSER_OVERLAY_SHA, positive_preflight_sha256=digest((ROOT/'positive-reading.preflight.json').read_bytes()),
        source_full_twelve_input_sha256=HISTORY_INPUT_SHA,
        conditions=[dict(name=r['name'], input_tokens=r['input_tokens'], messages_sha256=r['messages_sha256'])
            for r in preflight_proof['conditions']],
        adapter_model=ADAPTER_MODEL, base_model=BASE_MODEL, analysis_adapter_enabled=False, weights_sha256=WEIGHTS, config_sha256=CONFIG,
        max_model_calls=2, training=0, retry=0, native_request_seconds=210, source_http_seconds=220, source_request_seconds=225, driver_seconds=385,
        acquisition_seconds=420, outer_seconds=540, original_provider_restored=False)
    def save(): (ROOT/'execution.json').write_text(canonical(state)+'\n')
    save()
    def deadline(*args): raise TimeoutError('diagnostic_deadline_restore_reserved')
    signal.signal(signal.SIGALRM, deadline); signal.signal(signal.SIGTERM, deadline)
    remaining = started+420-time.monotonic(); assert remaining > 0
    signal.setitimer(signal.ITIMER_REAL, remaining)
    child = None; original_stopped = False
    try:
        assert (proc/'stat').read_text().split(') ', 1)[1].split()[19] == start_ticks
        assert [v.decode() for v in (proc/'cmdline').read_bytes().split(b'\0') if v] == argv
        assert digest(SERVE.read_bytes()) == SERVE_SHA
        original_stopped = True; stop(EXPECTED_PID)
        with (ROOT/'candidate-provider.log').open('xb') as log:
            child = subprocess.Popen(candidate_args(argv,candidate_path), cwd=cwd, env=candidate_env,
                stdin=subprocess.DEVNULL,stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
        state.update(state='ACTIVATED_NOT_ADOPTED',candidate_pid=child.pid); save(); health_wait(45)
        with (ROOT/'driver.log').open('xb') as log:
            done = subprocess.run([argv[0],str(driver_path)],cwd=ROOT,env=driver_env,stdin=subprocess.DEVNULL,
                stdout=log,stderr=subprocess.STDOUT,timeout=min(385,max(.001,started+420-time.monotonic())))
        state.update(state='DIAGNOSTIC_FINISHED_NOT_ADOPTED',driver_exit=done.returncode); save()
    finally:
        signal.alarm(0); signal.signal(signal.SIGTERM,signal.SIG_IGN)
        try:
            if child is not None: stop(child.pid)
        finally:
            try:
                if original_stopped:
                    with (ROOT/'restored-provider.log').open('xb') as log:
                        restored = subprocess.Popen(argv,cwd=cwd,env=env,stdin=subprocess.DEVNULL,
                            stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
                    state['restored_pid']=restored.pid; health_wait(45); state['original_provider_restored']=True
            finally:
                state['elapsed_seconds']=time.monotonic()-started; save()
                assert state['elapsed_seconds'] < 540, 'restore_budget_exceeded'
    print(canonical(state))


if __name__ == '__main__':
    main()
