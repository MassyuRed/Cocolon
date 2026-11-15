"""Fictional live acquisition using unchanged production history owners.

Runs only in the already rented pod. No model load, training, restart, retry,
provider switch or broad environment enumeration. Only the named Analysis key
is used for same-pod authentication and never serialized.
"""
import asyncio
import hashlib
import json
import os
from pathlib import Path
import sys
import time

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / 'ai/services/ai_inference'))
import httpx
import analysis_cumulative_service as service
import analysis_semantic_map as semantic
from analysis_model_source import SelfHostedSemanticAnalysisModelSource

MODEL = 'cocolon-qwen3.5-4b-analysis-semantic-120u'
LOCAL = 'http://127.0.0.1:8000'
OUTPUT = ROOT / 'semantic-history.actual.result.json'


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True,
        separators=(',', ':'), allow_nan=False)


async def main():
    material = json.loads((ROOT / 'semantic-history.actual.input.json').read_text())
    assert material['all_fictional'] is True
    parent = semantic.prepare_semantic_map(material['owner'], material['snapshot'])
    stages = service.prepare_semantic_history_batches(parent)
    assert len(stages) == 2, 'exactly_two_complete_leaves_required'
    # One explicitly named credential, used only for authentication within the
    # same existing pod. No process environment or headers enter the result.
    key = next(line.split('=', 1)[1].strip()
        for line in Path('/workspace/analysis.env').read_text().splitlines()
        if line.startswith('COCOLON_ANALYSIS_MODEL_API_KEY='))
    assert len(key) >= 24
    os.environ['COCOLON_ANALYSIS_OBSERVED_MODE'] = 'development'
    result = dict(all_fictional=True, attempt_consumed=True, model=MODEL,
        max_calls=3, pipeline_seconds=215, provider_restarts=0, training=0,
        request_ref=parent.request_ref,
        input_sha256=hashlib.sha256(canonical(material).encode()).hexdigest(),
        leaf_record_counts=[len(stage.record_refs) for stage in stages],
        acquisitions=[], health_before=None, health_after=None)
    started = time.monotonic()
    with OUTPUT.open('x', encoding='utf-8') as output:
        OUTPUT.chmod(0o600)

        def save():
            output.seek(0)
            output.truncate()
            output.write(canonical(result) + '\n')
            output.flush()

        save()
        async with httpx.AsyncClient(trust_env=False, follow_redirects=False) as client:
            async def health():
                reply = await client.get(LOCAL + '/healthz', timeout=5)
                value = reply.json()
                return dict(status_code=reply.status_code, status=value.get('status'),
                    elapsed_seconds=time.monotonic() - started)

            async def forward(request):
                assert request.url.host == 'same-pod.invalid'
                assert len(result['acquisitions']) < 3
                assert len(request.content) <= 262144
                body = json.loads(request.content)
                assert body['model'] == MODEL and body['max_tokens'] == 4096
                assert body['temperature'] == 0 and body['stream'] is False
                assert body['chat_template_kwargs'] == {'enable_thinking': False}
                row = dict(state='SENT', wire_request=body,
                    started_seconds=time.monotonic() - started)
                result['acquisitions'].append(row)
                save()
                try:
                    reply = await client.post(LOCAL + '/v1/chat/completions',
                        headers={'Authorization': 'Bearer ' + key,
                            'Content-Type': 'application/json', 'Accept-Encoding': 'identity'},
                        content=request.content, timeout=210)
                    assert len(reply.content) <= 262144
                    row.update(state='RECEIVED', status_code=reply.status_code,
                        body=reply.text, elapsed_seconds=time.monotonic() - started)
                    save()
                    return httpx.Response(reply.status_code, content=reply.content)
                except BaseException:
                    row.update(state='FAILED_OR_ACK_UNKNOWN', elapsed_seconds=time.monotonic() - started)
                    save()
                    raise

            try:
                result['health_before'] = await health()
                save()
                assert result['health_before']['status_code'] == 200
                assert result['health_before']['status'] == 'ok'
                # The transport forwards the exact production wire only to
                # LOCAL. The synthetic hostname is never contacted.
                source = SelfHostedSemanticAnalysisModelSource(
                    endpoint='https://same-pod.invalid/v1/chat/completions',
                    model=MODEL, api_key=key, transport=httpx.MockTransport(forward))
                artifact, coverage = await service._semantic_history_map(source, parent)
                result.update(state='GENERATED', coverage=coverage,
                    projection=artifact.safe_projection(authenticated_owner_scope=material['owner']),
                    text=artifact.safe_text_projection(authenticated_owner_scope=material['owner'])['text'],
                    private_evidence=artifact.private_evidence())
            except Exception as exc:
                result.update(state='NOT_GENERATED', failure_type=type(exc).__name__)
                if hasattr(exc, 'status_code'):
                    result['failure_status'] = exc.status_code
                # Only fixed failure codes from the owners; never credentials
                # or unconstrained transport exception text.
                if isinstance(exc, semantic.SemanticMapError):
                    result['failure_code'] = str(exc)
            finally:
                try:
                    result['health_after'] = await health()
                except Exception:
                    result['health_after'] = dict(state='UNAVAILABLE')
                result['elapsed_seconds'] = time.monotonic() - started
                save()
    print(canonical({name: result.get(name) for name in (
        'state', 'coverage', 'leaf_record_counts', 'elapsed_seconds',
        'failure_type', 'failure_status', 'failure_code', 'health_before', 'health_after')}))


asyncio.run(main())
