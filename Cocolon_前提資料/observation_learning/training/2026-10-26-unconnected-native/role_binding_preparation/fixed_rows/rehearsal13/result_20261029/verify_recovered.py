"""Read-only verification of the recovered one-shot originals; no model execution."""
from array import array
import argparse
import gzip
import hashlib
import json
import math
from pathlib import Path
import struct
import zipfile


def sha(data):
    return hashlib.sha256(data).hexdigest()


def tensors(path):
    data = path.read_bytes()
    size = struct.unpack('<Q', data[:8])[0]
    header = json.loads(data[8:8 + size])
    result = {}
    ends = []
    for name, value in header.items():
        if name == '__metadata__':
            continue
        assert value['dtype'] == 'F32'
        lo, hi = value['data_offsets']
        payload = data[8 + size + lo:8 + size + hi]
        assert len(payload) == hi - lo == math.prod(value['shape']) * 4
        floats = array('f'); floats.frombytes(payload)
        assert all(math.isfinite(v) for v in floats)
        result[name] = dict(shape=value['shape'], bytes=payload,
                            norm=math.sqrt(math.fsum(v * v for v in floats)))
        ends.append((lo, hi))
    ends.sort()
    assert ends[0][0] == 0 and all(a[1] == b[0] for a, b in zip(ends, ends[1:]))
    assert ends[-1][1] + 8 + size == len(data)
    return result


def verify(root, archive):
    assert archive.stat().st_size == 60053438
    assert sha(archive.read_bytes()) == '71741059ee92e627ea4183186b554d04ffc245ae857c6fd1bf1654217b6498d9'
    manifest = json.loads((root / 'manifest.json').read_text())
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None
        assert len(z.namelist()) == len(set(z.namelist())) == 248
        assert set(z.namelist()) == {x['path'] for x in manifest['files']} | {'manifest.json'}
        for item in manifest['files']:
            data = z.read(item['path'])
            assert len(data) == item['bytes'] and sha(data) == item['sha256']
            assert (root / item['path']).read_bytes() == data
    run = json.loads((root / 'run/run.json').read_text())
    plan = json.loads((root / 'source/plan.json').read_text())
    cpu = json.loads(gzip.decompress((root / 'cpu/prepared_cpu.json.gz').read_bytes()))
    assert run['source_commit'] == manifest['runtime_source_commit'] == '385114bde2ea0d8904d6a73f9c80bb5af56a654c'
    assert plan['status'] == 'MASH_EXPLICITLY_APPROVED_ONCE' and run['plan'] == plan
    assert run['status'] == 'RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW'
    assert (run['optimizer_steps_completed'], run['training_forwards_completed'],
            run['model_loads_completed'], run['model_calls_completed']) == (13, 13, 2, 11)
    assert run['model_calls_started'] == 11 and run['optimizer_steps_started'] == 13
    assert run['processing_seconds'] <= 2700 and run['process_cost_usd'] <= .21
    assert math.isclose(run['process_cost_usd'], run['processing_seconds'] * .28 / 3600)
    assert run['frozen_inputs_unchanged'] and not run['retry'] and not run['automatic_progression']
    assert len(cpu['frozen']) == 176
    for name, digest in cpu['frozen'].items():
        assert sha((root / 'frozen_originals' / Path(name).relative_to('/workspace')).read_bytes()) == digest
    for name in ('rehearsal13-cpu.exit', 'rehearsal13-gpu.exit', 'rehearsal13-cmee.exit'):
        assert (root / 'logs' / name).read_bytes() == b'0\n'
    training = [json.loads(x) for x in (root / 'run/training.jsonl').read_text().splitlines()]
    assert [x['id'] for x in training] == cpu['order'] == plan['update_order']
    assert [x['step'] for x in training] == list(range(1, 14))
    assert all(math.isfinite(x['loss']) and x['loss'] > 0 and math.isfinite(x['gradient_norm'])
               and x['gradient_norm'] > 0 and x['loss_type'] == 'complete_assistant_plus_eos_ce' for x in training)
    initial = root / 'frozen_originals/cocolon_joint_role18_run_20261029/adapter/adapter_model.safetensors'
    final = root / 'run/adapter/adapter_model.safetensors'
    assert sha(initial.read_bytes()) == manifest['initial_adapter_sha256']
    assert sha(final.read_bytes()) == run['adapter_sha256']['adapter_model.safetensors']
    before, after = tensors(initial), tensors(final)
    assert len(before) == len(after) == 112 and before.keys() == after.keys()
    assert sum(math.prod(x['shape']) for x in after.values()) == 3833856
    assert all(before[n]['bytes'] != after[n]['bytes'] for n in before)
    for filename, values in [('initial_loaded_tensors.json', before), ('reloaded_tensors.json', after)]:
        rows = json.loads((root / 'run' / filename).read_text())
        assert len(rows) == 112
        for row in rows:
            val = values[row['name'].replace('.default.weight', '.weight')]
            assert row['shape'] == val['shape'] and row['dtype'] == 'torch.float32' and row['finite']
            assert math.isclose(row['norm'], val['norm'], rel_tol=2e-6, abs_tol=2e-6)
    partial = [p for p in (root / 'run/adapter').iterdir() if p.name.startswith('.adapter_model.')]
    assert len(partial) == 1 and final.read_bytes().startswith(partial[0].read_bytes())
    diagnosis = json.loads((root / 'run/cmee/diagnosis.json').read_text())
    assert len(diagnosis['cases']) == 11
    assert [c['case_id'] for c in run['calls']] == plan['evaluation_order']
    cases, cold_ids, unchanged = [], [], []
    for call, result in zip(run['calls'], diagnosis['cases']):
        cid = call['case_id']; assert result['case_id'] == cid
        path = root / 'run' / call['path']; assert sha(path.read_bytes()) == call['raw_sha256']
        raw = json.loads(path.read_text())
        assert sha(raw['raw_text'].encode()) == raw['raw_utf8_sha256']
        assert raw['adapter_revision'] == call['adapter_sha256'] == run['adapter_sha256']['adapter_model.safetensors']
        assert raw['model'] == manifest['base_model'] and raw['revision'] == manifest['base_revision']
        assert len(raw['output_token_ids']) == raw['output_tokens'] == call['output_tokens']
        assert result['receipt']['raw_output'] == raw['raw_text'] and result['receipt_replay_identical']
        assert not call['timeout_triggered'] and call['seconds'] <= 180
        if result['meaning_adopted']:
            saved = json.loads((root / 'run/cmee' / (cid + '_saved.json')).read_text())
            cold = json.loads((root / 'run/cmee' / (cid + '_cold.json')).read_text())
            assert cold['status'] == result['cold_file_status'] == 'COLD_FULL_OUTCOME_IDENTICAL'
            assert saved['expected_full_outcome'] == cold['full_outcome'] == result['outcome']
            assert result['body_available'] and result['outcome']['body']['artifact'] is not None
            cold_ids.append(cold['process_id'])
        baseline = root / 'baseline_f493_old9' / ('after_' + cid + '.jsonl')
        if baseline.exists() and json.loads(baseline.read_text())['raw_text'] == raw['raw_text']:
            unchanged.append(cid)
        cases.append(dict(case_id=cid, receipt_status=result['receipt']['status'],
                          meaning=result['meaning_adopted'], body=result['body_available'],
                          cold=result['cold_file_status'], eos=raw['eos_reached'], tokens=raw['output_tokens']))
    assert len(cold_ids) == len(set(cold_ids)) == 9
    assert diagnosis['full2'] == dict(meaning=0, body=0) and diagnosis['old9'] == dict(meaning=9, body=9)
    baseline7 = plan['baseline_success_case_ids']
    successful = [c['case_id'] for c in cases if c['meaning'] and c['body']]
    assert len(baseline7) == 7 and set(baseline7) <= set(successful)
    return dict(status='RECOVERED_ORIGINALS_VERIFIED_NO_MODEL', archive_bytes=archive.stat().st_size,
                archive_sha256=sha(archive.read_bytes()), payloads=247, members=248,
                frozen_files_verified=176, tensor_count=112, tensor_dtype='F32', tensor_parameters=3833856,
                all_tensors_finite=True, changed_tensors=112, loaded_reloaded_tables_verified=True,
                incomplete_save_temporary_file=dict(name=partial[0].name, bytes=partial[0].stat().st_size,
                    sha256=sha(partial[0].read_bytes()), final_prefix_identical=True, used_for_reload=False),
                processing_seconds=run['processing_seconds'], processing_proration_usd=run['process_cost_usd'],
                cmee_cpu_seconds=diagnosis['seconds'], baseline7=baseline7, baseline7_preserved=True,
                old_raw_text_unchanged_ids=unchanged, cases=cases, model_executions=0)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(); parser.add_argument('--root', type=Path, required=True)
    parser.add_argument('--archive', type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(verify(args.root, args.archive), ensure_ascii=False, indent=2))
