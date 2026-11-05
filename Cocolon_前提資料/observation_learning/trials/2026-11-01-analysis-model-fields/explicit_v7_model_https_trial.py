"""Bounded explicit-v7 normal API -> verified localhost TLS -> isolated SQL probe.

Synthetic auth and fresh isolated PostgreSQL only. GPU mode uses the already
saved research candidate, never adopts it, retrains, retries, or exposes a port.
Smoke mode uses one synthetic packet and no model. Checkpoints exclude keys.
"""
from __future__ import annotations

import argparse
import asyncio
from contextlib import contextmanager
from dataclasses import asdict
import gc
import hashlib
import importlib.util
from importlib.metadata import version
import json
import os
from pathlib import Path
import secrets
import signal
import ssl
import subprocess
import sys
import tempfile
import threading
import time
import traceback
from unittest.mock import AsyncMock, patch
from uuid import UUID
from http.server import ThreadingHTTPServer

WEIGHTS = '6c879a887e3188f4fa2b6e1df573c8648febaac1661dd874f385d72d1edbd6c9'
CONFIG = '1deacb44b87cd363b94fd85fe7f86d5ee671ffe10f6d248405783ecaf45509db'
ADAPTER = Path('/workspace/analysis-actor-ownership-balanced48-20261105/train/adapter')
SOURCE_HASHES = {'ai/services/ai_inference/analysis_model_source.py': '00c25f30e0510989984d46f2ef17030c0eba139be6459d36562371f8eb35fd64', 'ai/services/ai_inference/analysis_cumulative_service.py': 'c3b6c1f3af877b098572f5a2443f42763819564d8ce378eaf95b224da071018e'}
CASES = [
    ('VH01', '私の考えを書いた。', '', '生活'),
    ('VH02', '私は私の本を見た。', '', '生活'),
    ('VH03', '私の本を見なかった。', '', '生活'),
    ('VH04', '父は僕の本を見た。', '', '生活'),
]


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--mode', choices=['smoke', 'gpu'], required=True)
    parser.add_argument('--api', type=Path, required=True)
    parser.add_argument('--expected-api-head', required=True)
    parser.add_argument('--root', type=Path, required=True)
    parser.add_argument('--export', type=Path)
    args = parser.parse_args()
    args.root.mkdir(parents=True, exist_ok=False)
    sys.dont_write_bytecode = True
    sys.path[:0] = [str(args.api/'ai/services/ai_inference'), str(args.api/'ai/services'),
        str(args.api/'ai/tests'), str(args.api/'ai/tools'), str(args.api)]
    os.environ.update(HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
    started = time.monotonic()
    stop = threading.Event()
    lock = threading.RLock()
    report = dict(schema_version='analysis_explicit_v7_actual_https_probe.v1', mode=args.mode,
        phase='PREPARING', cases=[], prepared_inputs=[], model_calls=[], http_responses=[],
        new_training=0, model_loads=0, normal_adoption=False, max_seconds=240,
        max_requests=4 if args.mode == 'gpu' else 1,
        authentication='synthetic', database='isolated PostgreSQL WASM',
        network='real loopback HTTPS, temporary per-client trusted CA',
        production_effect=False, private_key_in_report=False,
        explicit_transport_prompt_version='selected_material.v7',
        application_factory_default_unchanged=True, isolated_factory_override=True)

    def checkpoint():
        with lock:
            report['seconds'] = time.monotonic() - started
            raw = json.dumps(report, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False)
            path = args.root/'report.json'
            tmp = path.with_suffix('.tmp')
            tmp.write_text(raw)
            tmp.replace(path)

    checkpoint()
    # A forced deadline does not execute finally; every raw is checkpointed
    # before HTTP delivery, and the start state exists before model loading.
    signal.signal(signal.SIGALRM, signal.SIG_DFL)
    signal.setitimer(signal.ITIMER_REAL, 240)
    server, worker, generator = None, None, None
    try:
        head = subprocess.check_output(['git', '-C', str(args.api), 'rev-parse', 'HEAD'], text=True).strip()
        assert head == args.expected_api_head
        assert not subprocess.check_output(['git', '-C', str(args.api), 'status', '--porcelain', '--untracked-files=no'], text=True)
        assert {p: sha(args.api/p) for p in SOURCE_HASHES} == SOURCE_HASHES
        report.update(api_head=head, source_hashes=SOURCE_HASHES, python=sys.version,
            dependencies={n: version(n) for n in ['fastapi', 'pydantic', 'httpx', 'pytest']})
        import httpx
        import pytest
        from fastapi import FastAPI
        import analysis_cumulative_service as service
        import analysis_model_source as provider
        import api_emotion_submit as auth
        import api_self_structure as api_routes
        import api_self_structure_reports as report_routes
        from test_analysis_cumulative_model_source import sql_source
        from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import digest
        spec = importlib.util.spec_from_file_location('actual_analysis_probe', args.api/'ai/tools/serve_emlis_natural_reply.py')
        probe = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(probe)
        if args.mode == 'gpu':
            assert sha(ADAPTER/'adapter_model.safetensors') == WEIGHTS
            assert sha(ADAPTER/'adapter_config.json') == CONFIG
            assert {n: version(n) for n in probe.PINS} == probe.PINS
            report.update(model=probe.MODEL, revision=probe.REVISION, pins=probe.PINS,
                adapter_weights_sha256=WEIGHTS, adapter_config_sha256=CONFIG)
        checkpoint()
        selected = CASES if args.mode == 'gpu' else CASES[:1]
        key = secrets.token_urlsafe(32)
        model_name = 'analysis-v7-6c879-' + WEIGHTS[:12] if args.mode == 'gpu' else 'analysis-https-smoke'
        contexts = {}

        def tracked_generate(messages, deadline):
            entry = dict(index=len(report['model_calls'])+1, messages=messages,
                messages_sha256=digest(messages), phase='STARTED')
            with lock:
                report['model_calls'].append(entry)
                checkpoint()
            try:
                if args.mode == 'gpu':
                    raw, finish = generator(messages, deadline)
                else:
                    fields = json.loads(messages[1]['content'])['fields']
                    packet = dict(fields=[dict(field=f['field'], units=[dict(quote=text,
                        node_kind='ROLE' if 'の役割は' in text else 'ACTION_OR_NONACTION',
                        parent_quote=None, scope_role=None, qualifiers=[])
                        for text in f['text'].rstrip('。').split('。')]) for f in fields])
                    raw, finish = json.dumps(packet, ensure_ascii=False), 'stop'
            except BaseException as error:
                with lock:
                    entry.update(phase='FAILED', error_type=type(error).__name__)
                    checkpoint()
                raise
            with lock:
                entry.update(phase='RECEIVED', raw=raw, raw_sha256=hashlib.sha256(raw.encode()).hexdigest(),
                    finish_reason=finish)
                checkpoint()
            return raw, finish

        with tempfile.TemporaryDirectory(prefix='analysis-local-tls-') as tls_dir, pytest.MonkeyPatch.context() as mp:
            cert, private_key = Path(tls_dir)/'cert.pem', Path(tls_dir)/'key.pem'
            subprocess.run(['openssl', 'req', '-x509', '-newkey', 'rsa:2048', '-sha256', '-days', '1', '-nodes',
                '-keyout', str(private_key), '-out', str(cert), '-subj', '/CN=localhost',
                '-addext', 'subjectAltName=DNS:localhost,IP:127.0.0.1'],
                check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=15)
            private_key.chmod(0o240)
            base_handler = probe.make_handler(tracked_generate, api_key=key, model_name=model_name,
                deadline=started+240, max_requests=len(selected))
            class Handler(base_handler):
                def reply(self, status, body):
                    with lock:
                        report['http_responses'].append(dict(status=status,
                            model=body.get('model'), finish_reason=(body.get('choices') or [{}])[0].get('finish_reason')))
                        checkpoint()
                    return super().reply(status, body)
            server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
            server_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
            server_context.load_cert_chain(cert, private_key)
            server.socket = server_context.wrap_socket(server.socket, server_side=True)
            assert server.server_address[0] == '127.0.0.1'
            endpoint = f'https://localhost:{server.server_port}/v1/chat/completions'
            client_context = ssl.create_default_context(cafile=str(cert))
            assert client_context.verify_mode == ssl.CERT_REQUIRED and client_context.check_hostname
            report.update(tls_certificate_sha256=sha(cert), tls_hostname_checked=True,
                tls_certificate_required=True, bind_address='127.0.0.1')
            worker = threading.Thread(target=server.serve_forever, daemon=True)
            worker.start()
            async def reject_unknown_ca():
                async with httpx.AsyncClient(trust_env=False, timeout=5) as client:
                    try:
                        await client.post(endpoint, json={})
                    except httpx.ConnectError as error:
                        assert 'CERTIFICATE_VERIFY_FAILED' in str(error)
                    else:
                        raise AssertionError('untrusted TLS certificate was accepted')
            asyncio.run(reject_unknown_ca())
            assert not report['model_calls'] and not report['http_responses']
            report['untrusted_ca_rejected_before_generation'] = True
            # Construct the actual transport explicitly; do not replace its
            # class or force the service's preparation/profile helper.
            real_source = provider.SelfHostedAnalysisModelSource
            configured_source = [None]
            def explicit_factory():
                assert configured_source[0] is not None
                return configured_source[0]
            mp.setattr(provider, 'application_analysis_model_source', explicit_factory)
            mp.setenv('COCOLON_ANALYSIS_OBSERVED_MODE', 'development')
            real_prepare = service.prepare_cumulative_category_units
            def prepare(*pos, **kwargs):
                prepared = real_prepare(*pos, **kwargs)
                assert prepared.prompt_version == 'selected_material.v7'
                messages = prepared.messages()
                item = dict(prompt_version=prepared.prompt_version, owner=prepared.request.authenticated_owner_scope, request_ref=prepared.request_ref,
                    source_guard=prepared.source_guard, messages=messages, messages_sha256=digest(messages))
                with lock:
                    report['prepared_inputs'].append(item)
                    checkpoint()
                return prepared
            mp.setattr(service, 'prepare_cumulative_category_units', prepare)
            app = FastAPI()
            api_routes.register_self_structure_routes(app)
            report_routes.register_self_structure_report_routes(app)
            mp.setattr(auth, '_ensure_supabase_config', lambda:None)
            mp.setattr(auth, 'resolve_user_id_verified_cached', AsyncMock(side_effect=lambda token: contexts.get(token)))
            mp.setattr(auth, '_sb_auth_headers_shared', lambda:{})
            mp.setattr(auth, '_sb_get_shared', AsyncMock(return_value=httpx.Response(401, json={})))
            with contextmanager(sql_source.__wrapped__)(mp) as (db, rpc):
                report['database_process_id'] = db.proc.pid
                for index, (case_id, memo, action, category) in enumerate(selected, 1):
                    owner, record_id = str(UUID(int=9000+index)), str(UUID(int=9100+index))
                    token = 'synthetic-owner-' + str(index)
                    contexts[token] = owner
                    assert 'code' not in db.query('insert into auth.users values ($1)', [owner])
                    assert 'code' not in db.query("insert into public.profiles values ($1,'free')", [owner])
                    assert 'code' not in db.query('insert into public.emotions values ($1,$2,$3,$4,$5,$6,$7,$8)',
                        [record_id, owner, '2026-11-01T01:00:00', memo, action, [category], ['平穏'],
                         json.dumps([dict(type='平穏', strength='medium')])])
                    report['cases'].append(dict(id=case_id, owner=owner, original=dict(id=record_id,
                        memo=memo, memo_action=action, category=[category]), token_label='synthetic auth only',
                        status='PREPARED'))
                checkpoint()
                if args.mode == 'gpu':
                    report['phase'] = 'MODEL_LOADING'
                    checkpoint()
                    generator = probe.load_generator(str(ADAPTER), stop, weights_sha256=WEIGHTS, config_sha256=CONFIG)
                    report['model_loads'] = 1
                report['phase'] = 'REQUESTS'
                checkpoint()
                async def execute():
                    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://synthetic-api') as client:
                        for index, case in enumerate(report['cases'], 1):
                            configured_source[0] = real_source(endpoint=endpoint, model=model_name, api_key=key,
                                transport=httpx.AsyncHTTPTransport(verify=client_context),
                                prompt_version='selected_material.v7')
                            headers = {'Authorization':'Bearer synthetic-owner-'+str(index)}
                            assert provider.analysis_model_prompt_version(configured_source[0]) == 'selected_material.v7'
                            previous = len(report['model_calls'])
                            responses = await asyncio.gather(*(client.get('/self-structure/latest?force=true', headers=headers)
                                for _ in range(3)))
                            payloads = [response.json() for response in responses]
                            assert payloads[0] == payloads[1] == payloads[2]
                            case.update(http_statuses=[r.status_code for r in responses], result=payloads[0],
                                model_calls=len(report['model_calls'])-previous, concurrent_callers=3)
                            assert case['model_calls'] == 1
                            if responses[0].status_code == 200 and payloads[0]['has_visible_content']:
                                case['status'] = 'SAVED'
                                with patch.object(service, 'build_cumulative_map', side_effect=AssertionError('saved read generated')):
                                    current = await client.get('/self-structure/latest', headers=headers)
                                    readonly = await client.get('/self-structure/latest?ensure=false', headers=headers)
                                    monthly = await client.post('/self-structure/monthly/ensure', headers=headers, json={'force':True})
                                saved = [r.json() for r in (current, readonly, monthly)]
                                assert all(r.status_code == 200 for r in (current, readonly, monthly))
                                assert all(r['meta'] == payloads[0]['meta'] and r['content_text'] == payloads[0]['content_text']
                                    and r['report_id'] == payloads[0]['report_id'] and not r['refreshed'] for r in saved)
                                case.update(current=saved[0], readonly=saved[1], monthly=saved[2], saved_read_match=True)
                            else:
                                case['status'] = 'UNSUPPORTED' if responses[0].status_code == 200 else 'REJECTED'
                            case['stored_artifacts'] = db.query('select count(*) as n from public.analysis_observed_artifacts where user_id=$1',
                                [case['owner']])['rows'][0]['n']
                            case['stored_months'] = db.query('select count(*) as n from public.analysis_cumulative_months where user_id=$1',
                                [case['owner']])['rows'][0]['n']
                            assert case['stored_artifacts'] == case['stored_months'] == int(case['status'] == 'SAVED')
                            assert len(report['model_calls']) == previous + case['model_calls']
                            checkpoint()
                asyncio.run(execute())
                assert len(report['model_calls']) == len(selected), 'planned_model_requests_not_reached'
                if args.mode == 'smoke':
                    assert all(c['status'] == 'SAVED' for c in report['cases']), 'smoke_did_not_save'
                assert all(any(p['messages_sha256'] == call['messages_sha256'] for p in report['prepared_inputs'])
                    for call in report['model_calls'])
            report.update(phase='COMPLETE', saved=sum(c['status']=='SAVED' for c in report['cases']),
                rejected=sum(c['status']=='REJECTED' for c in report['cases']),
                unsupported=sum(c['status']=='UNSUPPORTED' for c in report['cases']),
                new_generation=len(report['model_calls']) if args.mode=='gpu' else 0)
            if args.mode == 'gpu':
                report['adapter_unchanged'] = sha(ADAPTER/'adapter_model.safetensors') == WEIGHTS and sha(ADAPTER/'adapter_config.json') == CONFIG
                assert report['adapter_unchanged']
    except BaseException as error:
        report.update(phase='FAILED', error_type=type(error).__name__, traceback=traceback.format_exc())
        raise
    finally:
        stop.set()
        if server is not None:
            if worker is not None: server.shutdown()
            server.server_close()
        if worker is not None: worker.join(timeout=5)
        generator = None
        gc.collect()
        report['source_hashes_after'] = {p:sha(args.api/p) for p in SOURCE_HASHES}
        if report['source_hashes_after'] != SOURCE_HASHES:
            report['phase'] = 'FAILED_SOURCE_CHANGED'
        checkpoint()
        if args.export is not None:
            assert not args.export.exists()
            args.export.write_bytes((args.root/'report.json').read_bytes())
        print(json.dumps({k:v for k,v in report.items() if k not in
            {'cases','prepared_inputs','model_calls','http_responses','traceback'}}, ensure_ascii=False))
        signal.setitimer(signal.ITIMER_REAL, 0)


if __name__ == '__main__':
    main()
