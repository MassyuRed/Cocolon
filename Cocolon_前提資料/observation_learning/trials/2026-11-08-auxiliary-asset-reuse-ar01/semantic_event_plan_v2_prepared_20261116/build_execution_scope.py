"""Materialize the exact new unexecuted A9/B9 approval scope."""
import ast
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def build():
    names = ['event_plan_execution.py', 'current_api_sources.zip', 'source_manifest.json',
             'input_cases.json', 'diagnostic_preparation.json', 'full12.input.json',
             'full12_pre_acquisition.plan.json', 'controls.json']
    files = {name: dict(bytes=(ROOT / name).stat().st_size, sha256=sha(ROOT / name)) for name in names}
    manifest = json.loads((ROOT / 'source_manifest.json').read_text())
    native = next(row for row in manifest['sources'] if row['path'] == 'ai/tools/serve_emlis_natural_reply.py')
    plan = json.loads((ROOT / 'full12_pre_acquisition.plan.json').read_text())
    leaves = plan['leaf_count']
    calls = plan['actual_fresh_model_calls_required']
    assert 1 <= leaves <= 12 and calls == leaves + 1
    a8 = json.loads((ROOT.parent / 'A8_actual_20261116/execution.json').read_text())
    assert a8['original_provider_restored'] is True and a8['new_model_calls'] == 4
    assert a8['state'] == 'INCOMPLETE_NOT_ADOPTED'
    assert a8['result_sha256'] == '6f91630aff9d1bf2ec1b6f7c94e8bc835285a1c0e3bc2a9ea50d379b3c499158'
    scope = dict(state='PREPARED_NOT_EXECUTED_REQUIRES_NEW_EXPLICIT_APPROVAL',
        schema='cocolon.analysis.event_plan.execution_scope.v1', profile='semantic_map.event_plan.v2',
        model_alias='cocolon-qwen3.5-4b-analysis-event-plan-v2',
        model='Qwen/Qwen3.5-4B', revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a',
        candidate_native_sha256=native['sha256'], source_git_head=manifest['source_git_head'],
        source_snapshot_note='Complete source bytes from the exact published unadopted candidate commit; no normal activation. Source manifest is exact identity.',
        original_provider_pid=a8['restored_pid'], original_provider_start_ticks=a8['restored_start_ticks'],
        original_model='cocolon-qwen3.5-4b-analysis-semantic-120u',
        original_identity_status='Last A8 restoration record only; exact current proc/argv/env/cwd/source/weights verified before stop.',
        original_adapter=dict(path='/workspace/semantic-resume40-v1/run/adapter',
            weights_sha256='ecbdd0d113cfcdc38a17be4b17c708678c01c5071ae86c8a30ca9a5de5900495',
            config_sha256='4389a598b2815adb1a114053944bfc1214518065d9ce5f2e464baaf8181d6f4c'),
        candidate_adapter=dict(path='/workspace/semantic-alignment17-recovery-20261116-once/fit/adapter',
            weights_sha256='2f33f9bedce06dffa07dad4301650a0ec47c5fc50ffe56994569628ee2b2d47b',
            config_sha256='09ac18caef48bd66914f80f521d3df6034bac4657862d7aaafeab56e30ac8750', updates=34),
        units=dict(A9=dict(root='/workspace/semantic-event-plan-v2-diagnostic-20261116-once',
            max_map_calls=5, max_control_calls=4, max_model_calls=9, work_seconds=1620,
            restore_inclusive_seconds=1800, native_request_seconds=210, once=True, retry=0, training=0),
            B9=dict(root='/workspace/semantic-event-plan-v2-full12-20261116-once',
                source_records=12, fresh_leaves=leaves, fresh_merge=1, max_map_calls=calls,
                max_control_calls=4, max_model_calls=calls+4, work_seconds=900,
                restore_inclusive_seconds=1020, service_pipeline_seconds=840,
                native_request_seconds=210, once=True, retry=0, training=0,
                condition='A9 all five original source/raw/projection/text adequate after root and independent review; actual review bytes required.')),
        generation=dict(enable_thinking=False, max_new_tokens=4096, context_tokens=32768,
            raw_repair=False, forced_close=False, reused_responses=0),
        source_package=dict(files=manifest['source_count'], uncompressed_bytes=manifest['source_bytes']),
        payload_files=files, upload_file_count=len(files)+1,
        payload_total_bytes_excluding_scope=sum(row['bytes'] for row in files.values()),
        controls='Two frozen repository-owned synthetic wire inputs; candidate before/after full response bytes must match. No teacher or semantic acceptance is inferred.',
        trial_provider=dict(host='127.0.0.1', port=18008,
            wrapper='Same execution driver process-local wrapper: published native make_handler exact per-unit cap and loopback listener; native bytes unchanged.',
            ownership='Exact child argv/PID and its listening socket inode checked before authenticated trial requests.'),
        derived_review_transfer=dict(file='A9.independent-meaning-review.json', max_bytes=4096,
            only_if='All five actual A9 source/raw/projection/text adequate under root and independent review.',
            exact_keys=['state','reviewers','A9_result_sha256','raw_sha256_by_case'],
            contents='Only adequate-state label, reviewer roles, actual result SHA and the five actual raw hashes. No raw/body, source text, credential or model output.'),
        preserved='Original default Analysis/IF120u, natural base, Piece arguments/weights; entire original argv/env/cwd restored within same Pod.',
        credential_boundary='Existing credentials/environment used only for same-Pod auth and original-provider restoration. No credential values copied into payload/results.',
        SQL=dict(automatic_save=False, checkpoint_sha256='801ba0683d2aed9a7ba46a8e7eb630b7cc810e1279aee6612cd1a0933e374485',
            old_plan_sha256='75daa8b75e24216293e11aac9eec2025efcda838c18bbae2e9d0e6326b9fedeb',
            input_sha256=files['full12.input.json']['sha256'],
            candidate_plan_sha256=files['full12_pre_acquisition.plan.json']['sha256'],
            next='Only new actual B9 raw, independent full meaning review, exclusive candidate SQL fork, one same-raw save and separate-process non-generating reread; normal rollout separately checked.'),
        authorization='No old A8/B8 or other consumed scope reused. New approval of exact filenames/bytes/roots/limits required before upload/execution.',
        prohibited=['training','retry','new dependencies','new external service','raw semantic repair',
            'normal adoption from technical completion','build','TestFlight','device','live SQL','Render mutation'])
    path = ROOT / 'execution_scope.json'
    path.write_text(json.dumps(scope, ensure_ascii=False, sort_keys=True, indent=2) + '\n')
    return dict(scope_sha256=sha(path), file_count=len(files)+1,
        bytes=sum(row['bytes'] for row in files.values()) + path.stat().st_size,
        scope_bytes=path.stat().st_size, state=scope['state'])


if __name__ == '__main__':
    print(json.dumps(build(), sort_keys=True))
