"""CPU-only verification of recovered originals. Never imports model/receiver code."""
import hashlib
import json
import math
import sys
import zipfile
from pathlib import Path

def digest(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def verify(root, previous, archive):
    root, previous, archive = map(Path, (root, previous, archive))
    m = json.loads((root / 'manifest.json').read_text())
    assert archive.stat().st_size == 2829165
    assert digest(archive) == 'b69f7cb0b9c6e47a120491d4068aeebb0c6bf58ebd52f5bc1049884cd9d34015'
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None
        assert len(z.namelist()) == len(set(z.namelist())) == 202
        assert set(z.namelist()) == {'manifest.json'} | {x['path'] for x in m['files']}
        for f in m['files']:
            b = z.read(f['path'])
            assert len(b) == f['bytes'] and hashlib.sha256(b).hexdigest() == f['sha256']
            assert (root / f['path']).read_bytes() == b
    run = json.loads((root / 'run/run.json').read_text())
    plan = json.loads((root / 'source/plan.json').read_text())
    assert run['plan'] == plan and plan['status'] == 'MASH_EXPLICITLY_APPROVED_ONCE'
    assert digest(root / 'source/plan.json') == '891860cf8b257202803ffd63992ceee94d1c4c3713a58caecbbd707c5233e928'
    expected_source = '943ee425ef7796b92ed9ee56f71fbb241ea2e45f'
    assert run['source_commit'] == expected_source
    for p, h in [('source/run_prior_rows2.py', plan['runner_sha256']),
                 ('source/export_prior_rows2.py', '5db2f418c4cf3b200406f33799d0743a2364dec50509c208d1297adeb3a78a39'),
                 ('cpu/cpu_full.json.gz', plan['cpu_report_sha256']),
                 ('cpu/eval_inputs11.json', plan['eval_inputs_sha256']),
                 ('cpu/prepare_prior_rows2.py', plan['prepare_source_sha256'])]:
        assert digest(root / p) == h, p
    for k, n in [('model_loads_started', 1), ('model_loads_completed', 1),
                 ('optimizer_steps_completed', 0), ('training_forwards_completed', 0),
                 ('model_calls_started', 2), ('model_calls_completed', 2)]:
        assert run[k] == n
    assert run['retry'] is False and run['automatic_progression'] is False
    assert run['adapter_unchanged'] and run['frozen_inputs_unchanged']
    assert run['processing_seconds'] <= 600 and run['process_cost_usd'] <= 0.047
    assert math.isclose(run['process_cost_usd'], run['processing_seconds'] * 0.28 / 3600, rel_tol=1e-14)
    tensors = json.loads((root / 'run/loaded_tensors.json').read_text())
    assert tensors == json.loads((previous / 'run/reloaded_tensors.json').read_text())
    assert len(tensors) == 112 and len({x['name'] for x in tensors}) == 112
    assert all(x['dtype'] == 'torch.float32' and x['finite'] and math.isfinite(x['norm']) for x in tensors)
    assert sum(math.prod(x['shape']) for x in tensors) == 3833856
    frozen = [p for p in (root / 'frozen_originals').rglob('*') if p.is_file()]
    assert len(frozen) == 173
    for p in frozen:
        assert digest(p) == digest(previous / p.relative_to(root)), str(p)
    for ref in m['unchanged_weight_refs']:
        if ref['original_path'].startswith('/workspace/cocolon_rehearsal13_run_20261029/'):
            p = previous / 'run/adapter/adapter_model.safetensors'
        else:
            p = previous / 'frozen_originals' / ref['original_path'].removeprefix('/workspace/')
        assert p.stat().st_size == ref['bytes'] and digest(p) == ref['sha256']
    d = json.loads((root / 'run/cmee/diagnosis.json').read_text())
    assert d['full2'] == {'meaning': 0, 'body': 0} and not d['both_full_success']
    assert all(d[k] == 0 for k in ['new_model_calls', 'training_updates', 'sql_operations', 'product_credit'])
    assert len(run['calls']) == len(d['cases']) == 2
    for call, c, cap, prompt in zip(run['calls'], d['cases'], [3712, 3584], [4152, 4304]):
        p = root / 'run' / call['path']; raw = json.loads(p.read_text())
        assert digest(p) == call['raw_sha256']
        assert call['case_id'] == c['case_id'] == raw['case_id']
        assert call['seconds'] <= 180 and not call['timeout_triggered']
        assert len(raw['output_token_ids']) == raw['output_tokens'] == call['output_tokens'] == cap
        assert raw['input_tokens'] == prompt and prompt + cap <= 8192
        assert not raw['eos_reached'] and not call['eos_reached'] and raw['finish_reason'] == 'length'
        assert raw['raw_utf8_sha256'] == hashlib.sha256(raw['raw_text'].encode()).hexdigest()
        assert raw['revision'] == plan['base_revision'] and raw['adapter_revision'] == plan['adapter_sha256']
        assert c['receipt']['raw_output'] == raw['raw_text'] and c['receipt']['status'] == 'TOKEN_LIMIT'
        md = json.loads(c['receipt']['metadata_json'])
        assert md['adapter_revision'] == raw['adapter_revision'] and md['revision'] == raw['revision']
        assert md['usage'] == raw['usage'] and md['finish_reason'] == raw['finish_reason']
        assert c['receipt_replay_identical'] and not c['meaning_adopted'] and not c['body_available']
        assert c['decision'] == 'REJECT' and c['reason_code'] == 'semantic_receipt_not_validated'
        assert c['cold_file_status'] == 'NO_ADOPTED_SNAPSHOT'
    assert [p.name for p in (root / 'run/cmee').iterdir()] == ['diagnosis.json']
    launch = json.loads((root / 'source/gpu_launch.json').read_text())
    assert launch['launcher_pid'] == 232075 and launch['started_unix'] == 1793267623.5736284
    assert launch['source_commit'] == expected_source
    assert all((root / 'logs' / p).read_bytes() == b'0\n' for p in ['prior-rows2-gpu.exit', 'prior-rows2-cmee.exit'])
    return {'status': 'ALL_ASSERTIONS_PASSED', 'new_model_calls': 0, 'training_updates': 0,
            'new_cmee_executions': 0, 'archive_members': 202, 'archive_payloads': 201,
            'all_crc_size_hash_and_exact_paths': True, 'runtime_plan_and_sources_verified': True,
            'raw_token_ids_usage_finish_identity_receipt_checked': 2,
            'same_112_F32_tensors_as_previous_saved_reload': True, 'parameters': 3833856,
            'frozen_original_files_matched_to_previous_archive': 173,
            'unchanged_weight_refs_matched_to_full_previous_archive': 4,
            'frozen_weight_refs': 3, 'frozen_total': 176,
            'launch_checkpoint_actual_pid': 232075, 'receipt_replay_identical': 2,
            'adopted_snapshots': 0, 'cold_targets': 0, 'cold_pass_count': 0,
            'old9_regenerated': 0, 'product_credit': 0}

if __name__ == '__main__':
    result = verify(*sys.argv[1:4])
    print(json.dumps(result, ensure_ascii=False, indent=2))
