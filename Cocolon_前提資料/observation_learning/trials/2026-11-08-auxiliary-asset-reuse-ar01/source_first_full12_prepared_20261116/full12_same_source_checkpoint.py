"""Isolated SQL source checkpoint before any future model acquisition.

Only fictional original inputs are seeded. No response is replayed, no model
source is constructed, and no hosted database/API is contacted. The existing
PGlite PostgreSQL bridge owns dump/restart; production owners derive the guard
and semantic preparation. This does not authorize a future generation.
"""
from __future__ import annotations
import argparse
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys

REPO = Path(os.environ.get('COCOLON_WORK_API_REPO', '/workspace/scratch/8262f97b141c/api')).resolve()
sys.path[:0] = [str(REPO), str(REPO / 'ai/services/ai_inference'), str(REPO / 'ai/tests')]
from test_emlis_q3_application import Q3Database
from test_analysis_interpretation_correction_sources import sql_script
import analysis_semantic_map as semantic
import analysis_cumulative_service as service
import analysis_model_source as model_sources
from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as core

ANALYSIS_MIGRATIONS = (
    '20261003134440_analysis_observed_artifacts.sql',
    '20261004041627_analysis_period_comparison.sql',
    '20261101080144_cumulative_watashi_map.sql',
    '20261107071033_analysis_semantic_map_wire.sql',
    '20261114032520_analysis_interpretation_correction_sources.sql',
    '20261114120000_analysis_if_route_artifacts.sql',
    '20261114123000_analysis_emlis_material_handoff.sql',
    '20261114132000_analysis_map_interpretation_corrections.sql',
    '20261114133000_analysis_map_correction_handoff.sql',
)
SOURCES = (
    'ai/services/ai_inference/analysis_cumulative_service.py',
    'ai/services/ai_inference/analysis_semantic_map.py',
    'ai/services/ai_inference/analysis_model_source.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py',
    'ai/tests/helpers/emlis_q2_postgres.cjs',
)


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def write_new(path, value):
    with path.open('x', encoding='utf-8') as out:
        out.write(canonical(value) + '\n')
    path.chmod(0o600)


def checked_query(db, sql, params=(), role=None):
    result = db.query(sql, params, role)
    assert 'code' not in result, 'isolated_sql_query_failed:' + str(result.get('code'))
    return result['rows']


def snapshot(db, owner):
    return checked_query(db, 'select public.analysis_cumulative_source_snapshot($1) as value',
        [owner], 'service_role')[0]['value']


def close(db):
    db.proc.stdin.close()
    assert db.proc.wait(timeout=10) == 0


def file_id(path):
    return dict(path=str(path), bytes=path.stat().st_size, sha256=sha(path.read_bytes()))


def source_ids():
    return {name: sha((REPO / name).read_bytes()) for name in SOURCES}


def prepared_plan(owner, frozen):
    parent = semantic.prepare_semantic_map(owner, frozen)
    stages = service.prepare_semantic_history_batches(parent)
    assert stages, 'full12_requires_fresh_split_history_not_a_parent_only_probe'
    refs = [ref for stage in stages for ref in stage.record_refs]
    assert refs == [member.saved_record_ref for member in parent.frozen.members]
    assert len(refs) == len(set(refs)) == 12
    plan = dict(parent_request_ref=parent.request_ref, parent_messages_sha256=core.semantic_map_hash(parent.messages()),
        source_guard=parent.source_guard, prompt_version=parent.prompt_version,
        parent_message_bytes=model_sources._semantic_message_bytes(parent), source_records=12,
        leaf_count=len(stages), fresh_model_calls_required=len(stages) + 1,
        reuse_old_receipts=0, leaf_stages=[])
    for stage in stages:
        assert stage.source_guard == frozen['guard'] and model_sources.semantic_analysis_input_fits(stage)
        plan['leaf_stages'].append(dict(request_ref=stage.request_ref, record_refs=list(stage.record_refs),
            messages_sha256=core.semantic_map_hash(stage.messages()),
            message_bytes=model_sources._semantic_message_bytes(stage), messages=stage.messages()))
    return plan


def sql_source_assertions(before, after):
    a = {row['original']['id']: row for row in before['members']}
    b = {row['original']['id']: row for row in after['members']}
    assert a.keys() == b.keys() and len(a) == 12
    for ref in a:
        assert a[ref]['thread'] is b[ref]['thread'] is None
        assert a[ref]['events'] == b[ref]['events'] == []
        for key in ('id', 'memo', 'memo_action', 'category', 'emotions', 'emotion_details'):
            assert a[ref]['original'][key] == b[ref]['original'][key], 'source_column_changed'
        def instant(text):
            value = datetime.fromisoformat(text.replace('Z', '+00:00'))
            return value.replace(tzinfo=timezone.utc) if value.tzinfo is None else value.astimezone(timezone.utc)
        assert instant(a[ref]['original']['created_at']) == instant(b[ref]['original']['created_at'])


def prepare(input_path, root):
    assert not root.exists(), 'one_shot_preacquisition_checkpoint_already_exists'
    material = json.loads(input_path.read_bytes())
    assert material['all_fictional'] is True and len(material['snapshot']['members']) == 12
    assert all(member['thread'] is None and member['events'] == [] for member in material['snapshot']['members'])
    root.mkdir(mode=0o700)
    db = Q3Database()
    try:
        db.migrate()
        for name in ANALYSIS_MIGRATIONS:
            sql_script(db, name)
        owner = material['owner']
        checked_query(db, 'insert into auth.users values ($1)', [owner])
        checked_query(db, 'insert into public.profiles values ($1,$2)', [owner, material['snapshot']['tier']])
        for member in material['snapshot']['members']:
            row = member['original']
            checked_query(db, 'insert into public.emotions values ($1,$2,$3,$4,$5,$6,$7,$8)',
                [row['id'], owner, row['created_at'], row['memo'], row['memo_action'],
                    row['category'], row['emotions'], json.dumps(row['emotion_details'], ensure_ascii=False)])
        frozen = snapshot(db, owner)
        sql_source_assertions(material['snapshot'], frozen)
        plan = prepared_plan(owner, frozen)
        assert checked_query(db, 'select count(*) as n from public.analysis_observed_artifacts')[0]['n'] == 0
        assert checked_query(db, 'select count(*) as n from public.analysis_cumulative_months')[0]['n'] == 0
        captured = dict(all_fictional=True, owner=owner, snapshot=frozen,
            guard_derivation='Actual analysis_cumulative_source_snapshot RPC over isolated PostgreSQL before any model request.')
        write_new(root / 'pre_acquisition.input.json', captured)
        write_new(root / 'pre_acquisition.plan.json', plan)
        dump = db.dump_checkpoint(root / 'pre_acquisition.pglite.gz')
        receipt = dict(state='SQL_PREACQUISITION_CHECKPOINT_CREATED', input=file_id(input_path),
            sql_input=file_id(root / 'pre_acquisition.input.json'), plan=file_id(root / 'pre_acquisition.plan.json'),
            checkpoint=file_id(root / 'pre_acquisition.pglite.gz'), checkpoint_bytes=dump['bytes'],
            source_hashes=source_ids(), sql_guard=frozen['guard'], archived_input_guard=material['snapshot']['guard'],
            guard_same_as_archived_input=material['snapshot']['guard'] == frozen['guard'],
            frozen_period_start=frozen['period_start'], frozen_period_end=frozen['period_end'],
            frozen_as_of=frozen['now'], leaf_count=plan['leaf_count'], fresh_model_calls_required=plan['fresh_model_calls_required'],
            old_model_receipts_reused=0, model_calls=0, hosted_database_calls=0, artifact_rows=0, monthly_rows=0)
        write_new(root / 'pre_acquisition.receipt.json', receipt)
    finally:
        close(db)
    done = subprocess.run([sys.executable, str(Path(__file__).resolve()), 'verify', '--root', str(root)],
        stdin=subprocess.DEVNULL, timeout=60, check=False)
    assert done.returncode == 0, 'separate_process_sql_checkpoint_verification_failed'
    print(canonical(dict(state='PREACQUISITION_READY_NOT_AUTHORIZED_FOR_MODEL', root=str(root),
        leaf_count=plan['leaf_count'], fresh_model_calls_required=plan['fresh_model_calls_required'], model_calls=0)))


def verify(root, receipt_path=None):
    receipt = json.loads((root / 'pre_acquisition.receipt.json').read_bytes())
    assert receipt['source_hashes'] == source_ids(), 'source_changed_after_preparation'
    for name in ('sql_input', 'plan', 'checkpoint'):
        expected = receipt[name]
        basename = {'sql_input':'pre_acquisition.input.json', 'plan':'pre_acquisition.plan.json',
            'checkpoint':'pre_acquisition.pglite.gz'}[name]
        path = root / basename
        actual = file_id(path)
        assert actual['bytes'] == expected['bytes'] and actual['sha256'] == expected['sha256']
    material = json.loads((root / 'pre_acquisition.input.json').read_bytes())
    frozen = material['snapshot']
    plan = json.loads((root / 'pre_acquisition.plan.json').read_bytes())
    db = Q3Database(checkpoint_path=root / 'pre_acquisition.pglite.gz')
    try:
        current = snapshot(db, material['owner'])
        assert current['guard'] == frozen['guard'] == receipt['sql_guard']
        sql_source_assertions(frozen, current)
        assert plan == prepared_plan(material['owner'], frozen)
        assert checked_query(db, 'select count(*) as n from public.analysis_observed_artifacts')[0]['n'] == 0
        assert checked_query(db, 'select count(*) as n from public.analysis_cumulative_months')[0]['n'] == 0
        result = dict(state='SEPARATE_PROCESS_SQL_SOURCE_RESTORED', sql_guard=current['guard'],
            frozen_as_of=frozen['now'], restored_current_as_of=current['now'],
            guard_clock_independent=True, prepared_using_original_frozen_sql_snapshot=True,
            parent_request_ref=plan['parent_request_ref'], same_plan_and_exact_leaf_messages=True,
            leaf_count=plan['leaf_count'], fresh_model_calls_required=plan['fresh_model_calls_required'],
            model_calls=0, artifact_rows=0, monthly_rows=0, hosted_database_calls=0)
        write_new(receipt_path or root / 'pre_acquisition.restart_verified.json', result)
        print(canonical(result))
    finally:
        close(db)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('phase', choices=('prepare', 'verify'))
    parser.add_argument('--root', type=Path, required=True)
    parser.add_argument('--input', type=Path)
    parser.add_argument('--receipt', type=Path, help='New verification receipt path; existing files are never replaced.')
    args = parser.parse_args()
    assert os.environ.get('Q2_PGLITE_MODULE'), 'existing_pglite_dependency_must_be_selected'
    if args.phase == 'prepare':
        assert args.input is not None
        prepare(args.input.resolve(), args.root.resolve())
    else:
        verify(args.root.resolve(), args.receipt.resolve() if args.receipt else None)

if __name__ == '__main__':
    main()
