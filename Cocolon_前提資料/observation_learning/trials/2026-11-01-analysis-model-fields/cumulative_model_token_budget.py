"""Measure existing full cumulative synthetic fixtures with the real tokenizer.

No model load, generation, API call, network request, truncation, or batching.
Usage: python cumulative_model_token_budget.py API NEW_ROOT --expected-api-head SHA
"""
from __future__ import annotations

import argparse
from dataclasses import asdict
import hashlib
from importlib.metadata import version
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time

COUNTS = (1, 20, 50, 100, 201)
PROFILES = ('selected_material.v4', 'selected_material.v7')
RESERVED_NEW_TOKENS = 2048
CONTEXT_TOKENS = 8192
PROBE_HTTP_BODY_LIMIT = 65536
SOURCE_PATHS = (
    'ai/tests/test_analysis_cumulative.py',
    'ai/services/ai_inference/analysis_cumulative_service.py',
    'ai/services/ai_inference/analysis_model_source.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
    'ai/tools/serve_emlis_natural_reply.py',
)


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True,
        separators=(',', ':'), allow_nan=False)


def sha_bytes(value):
    return hashlib.sha256(value).hexdigest()


def sha(path):
    return sha_bytes(Path(path).read_bytes())


def git(api, *args):
    return subprocess.check_output(['git', '-C', str(api), *args], text=True).strip()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('api', type=Path)
    parser.add_argument('root', type=Path)
    parser.add_argument('--expected-api-head', required=True)
    args = parser.parse_args()
    args.api = args.api.resolve()
    args.root = args.root.resolve()
    assert not args.root.exists(), 'do_not_restart_or_replace_partial_root'
    sys.dont_write_bytecode = True
    os.environ.update(HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1', HF_DATASETS_OFFLINE='1')
    sys.path[:0] = [str(args.api/'ai/services/ai_inference'),
        str(args.api/'ai/services'), str(args.api/'ai/tests'), str(args.api/'ai/tools'),
        str(args.api)]
    assert git(args.api, 'rev-parse', 'HEAD') == args.expected_api_head
    assert not git(args.api, 'status', '--porcelain', '--untracked-files=no')
    source_hashes = {p:sha(args.api/p) for p in SOURCE_PATHS}
    probe_source = (args.api/'ai/tools/serve_emlis_natural_reply.py').read_text()
    assert 'if count + 2048 > 8192' in probe_source
    assert 'if not 0 < length <= 65536' in probe_source
    import httpx
    from transformers import AutoTokenizer
    from test_analysis_cumulative import source_snapshot, OWNER
    from analysis_cumulative_service import prepare_cumulative_category_units
    from serve_emlis_natural_reply import MODEL, REVISION, PINS
    assert {n:version(n) for n in PINS} == PINS
    tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION,
        local_files_only=True, trust_remote_code=False)
    args.root.mkdir()
    shutil.copyfile(__file__, args.root/'runner.py')
    started = time.monotonic()
    report = dict(schema_version='analysis_cumulative_token_budget.v1',
        status='STARTED_CPU_ONLY', api_commit=args.expected_api_head,
        source_hashes=source_hashes, runner_sha256=sha(__file__), model=MODEL,
        revision=REVISION, pins=PINS, tokenizer_only=True,
        model_loads=0, new_generation=0, new_training=0, network_requests=0,
        api_writes=0, database_access=0, normal_adoption=False,
        fixture='test_analysis_cumulative.source_snapshot(count)',
        fixture_scope='complete independent synthetic fixtures; fixture clock/guard, not a real DB snapshot',
        counts=list(COUNTS), profiles=list(PROFILES), context_tokens=CONTEXT_TOKENS,
        reserved_new_tokens=RESERVED_NEW_TOKENS,
        probe_http_body_limit_bytes=PROBE_HTTP_BODY_LIMIT, rows=[])

    def checkpoint():
        report['seconds'] = time.monotonic()-started
        temporary = args.root/'report.tmp'
        temporary.write_text(canonical(report)+'\n')
        temporary.replace(args.root/'report.json')

    checkpoint()
    try:
        # These are complete independently created fixtures. Do not slice a
        # larger source collection, modify its guard, or remove old records.
        snapshots = {count:source_snapshot(count) for count in COUNTS}
        fixture_hashes = {count:sha_bytes(canonical(snapshot).encode())
            for count,snapshot in snapshots.items()}
        for count in COUNTS:
            snapshot = snapshots[count]
            assert len(snapshot['members']) == count
            expected_records = tuple(row['original']['id'] for row in snapshot['members'])
            for profile in PROFILES:
                prepared = prepare_cumulative_category_units(OWNER, snapshot, prompt_version=profile)
                assert tuple(row.saved_record_ref for row in prepared.request.members) == expected_records
                assert len(prepared.request.members) == count
                messages = prepared.messages()
                user = json.loads(messages[1]['content'])
                assert len(user['fields']) == count
                # Match the generator's exact real-tokenizer path; all input
                # tokens are retained, even when the result exceeds context.
                tokens = tokenizer.apply_chat_template(messages, enable_thinking=False,
                    add_generation_prompt=True, tokenize=True, return_dict=False,
                    truncation=False)
                payload = dict(model='analysis-cumulative-token-budget', messages=messages,
                    temperature=0, max_tokens=RESERVED_NEW_TOKENS, stream=False,
                    chat_template_kwargs={'enable_thinking':False})
                # Constructing an httpx request performs no socket/API call.
                request_body = httpx.Request('POST',
                    'https://localhost/v1/chat/completions', json=payload).content
                report['rows'].append(dict(source_count=count, prompt_version=profile,
                    fixture_sha256=fixture_hashes[count], request_ref=prepared.request_ref,
                    request_sha256=sha_bytes(canonical(asdict(prepared.request)).encode()),
                    messages_sha256=sha_bytes(canonical(messages).encode()),
                    fields_sent=len(user['fields']), all_fixture_records_sent=True,
                    prompt_tokens=len(tokens), total_reserved_tokens=len(tokens)+RESERVED_NEW_TOKENS,
                    fits_context=len(tokens)+RESERVED_NEW_TOKENS<=CONTEXT_TOKENS,
                    remaining_context_tokens=CONTEXT_TOKENS-len(tokens)-RESERVED_NEW_TOKENS,
                    request_body_bytes=len(request_body),
                    fits_probe_http_body=len(request_body)<=PROBE_HTTP_BODY_LIMIT,
                    request_body_sha256=sha_bytes(request_body), truncated=False))
                checkpoint()
        assert {count:sha_bytes(canonical(snapshot).encode())
            for count,snapshot in snapshots.items()} == fixture_hashes
        assert git(args.api, 'rev-parse', 'HEAD') == args.expected_api_head
        assert not git(args.api, 'status', '--porcelain', '--untracked-files=no')
        assert {p:sha(args.api/p) for p in SOURCE_PATHS} == source_hashes
        report.update(status='COMPLETE_CPU_ONLY_NO_MODEL', source_hashes_unchanged=True,
            fixture_snapshots_unchanged=True,
            interpretation='Input/request budget only; no output quality, batching, throughput or production success claim.')
    except BaseException as error:
        report.update(status='FAILED_CPU_ONLY', error_type=type(error).__name__)
        checkpoint()
        raise
    checkpoint()
    manifest = {str(p.relative_to(args.root)):sha(p)
        for p in args.root.rglob('*') if p.is_file()}
    (args.root/'manifest.json').write_text(canonical(manifest)+'\n')
    print(canonical(report))


if __name__ == '__main__':
    main()
