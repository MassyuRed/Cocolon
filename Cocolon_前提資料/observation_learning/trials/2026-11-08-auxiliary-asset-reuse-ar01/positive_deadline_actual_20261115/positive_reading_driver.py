import asyncio, copy, hashlib, json, os, sys, time
from dataclasses import asdict
from pathlib import Path
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / 'ai/services/ai_inference'))
import httpx
import analysis_semantic_map as app
import analysis_cumulative_service as service
from analysis_model_source import SelfHostedSemanticAnalysisModelSource, semantic_analysis_input_fits
from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as core
MODEL = 'cocolon-qwen3.5-4b-analysis-semantic-120u'
CORE_SHA = '398736519a1a560e4d2498f2131fb9b0432ba190e3343d6499dbaa2a1c838a69'
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
        row = dict(name=name, model=MODEL, adapter_enabled=True, state='PREPARED',
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
    key = next(line.split('=', 1)[1].strip() for line in Path('/workspace/analysis.env').read_text().splitlines()
        if line.startswith('COCOLON_ANALYSIS_MODEL_API_KEY='))
    assert len(key) >= 24
    os.environ['COCOLON_ANALYSIS_OBSERVED_MODE'] = 'development'
    result = dict(state='STARTED_NOT_ADOPTED', all_fictional=True, model=MODEL,
        source_core_sha256=CORE_SHA, max_model_calls=2, new_model_calls=0,
        training=0, retry=0, pipeline_seconds=220, acquisitions=[], conditions=[])
    started = time.monotonic()
    with (ROOT / 'positive-reading.actual.result.json').open('x', encoding='utf-8') as output:
        def save():
            output.seek(0); output.truncate(); output.write(canonical(result) + '\n'); output.flush()
        save()
        async with httpx.AsyncClient(trust_env=False, follow_redirects=False) as client:
            try:
                async with asyncio.timeout(220):
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
                                    timeout=min(95, max(.001, 220-(time.monotonic()-started))))
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
