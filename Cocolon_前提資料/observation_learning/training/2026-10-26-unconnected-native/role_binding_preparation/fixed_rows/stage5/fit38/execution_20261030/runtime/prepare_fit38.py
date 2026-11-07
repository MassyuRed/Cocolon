"""Reuse exact CPU-verified nineteen rows for two passes; stdlib only, no model."""
import sys
sys.dont_write_bytecode = True
import collections
import gzip
import hashlib
import importlib.metadata
import json
from pathlib import Path
import time

W = Path('/workspace')
HERE = Path(__file__).resolve().parent
PRIOR_CPU = W / 'cocolon_aligned19_cpu_20261030'
PRIOR_RUN = W / 'cocolon_aligned19_run_20261030'
PRIOR_PACK = W / 'cocolon_aligned19_pack_20261030'
INITIAL = PRIOR_RUN / 'adapter'
OUT = W / 'cocolon_fit38_cpu_20261030'

def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def compact(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'), allow_nan=False)

def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + '\n')

def main():
    start = time.monotonic()
    plan = json.loads((HERE / 'proposal.json').read_text())
    assert plan['status'] == 'PROPOSED_NEEDS_NEW_MASH_APPROVAL'
    assert not OUT.exists() and not (HERE / 'approved_plan.json').exists()
    assert (plan['epochs'], plan['max_updates'], plan['max_teacher_evaluation_forwards']) == (2, 38, 57)
    for name, digest in plan['source_sha256'].items():
        assert sha(HERE / name) == digest, name
    assert sha(PRIOR_CPU / 'prepared_cpu.json.gz') == plan['prior_prepared_sha256']
    assert sha(PRIOR_CPU / 'train19.jsonl') == plan['train19_sha256']
    old = json.loads(gzip.decompress((PRIOR_CPU / 'prepared_cpu.json.gz').read_bytes()))
    old_summary = json.loads((PRIOR_CPU / 'cpu_summary.json').read_text())
    assert old['status'] == old_summary['status'] == 'CPU_ALIGNED19_READY_NO_MODEL'
    assert all(sha(p) == h for p, h in old['frozen'].items())
    assert plan['pass_order'] == old['order'] and len(set(plan['pass_order'])) == 19
    assert plan['update_order'] == old['order'] * 2
    assert collections.Counter(plan['update_order']) == {cid: 2 for cid in old['order']}
    assert plan['measurement_phases'] == ['before_updates', 'after19_updates', 'after38_saved_reload']
    assert plan['evaluation_order'] == [c['case_id'] for c in old['original_cases']]
    assert {n: importlib.metadata.version(n) for n in old['dependencies']} == old['dependencies']
    rows = [json.loads(line) for line in (PRIOR_CPU / 'train19.jsonl').read_text().splitlines()]
    assert len(rows) == len({r['id'] for r in rows}) == 19
    assert {r['id'] for r in rows} == set(old['encoded']) == set(plan['pass_order'])
    windows = []
    for cid in plan['pass_order']:
        item = old['encoded'][cid]
        ids, labels = item['input_ids'], item['labels']
        first = next(i for i, label in enumerate(labels) if label != -100)
        assert len(ids) == len(labels) and labels[first:] == ids[first:]
        assert all(label == -100 for label in labels[:first]) and 0 < first < len(ids)
        # Pinned model slices hidden states, then causal loss shifts labels once.
        start_index = first - 1
        target_indexes = [i + 1 for i in range(start_index, len(ids) - 1) if labels[i + 1] != -100]
        assert target_indexes == list(range(first, len(ids)))
        windows.append(dict(id=cid, first_target_index=first, loss_start=start_index,
                            logit_positions=len(ids) - start_index, supervised_tokens=len(ids) - first,
                            complete_original_target_and_eos_retained=True))
    prior = json.loads((PRIOR_RUN / 'run.json').read_text())
    assert prior['status'] == 'STOPPED_NOT_ADOPTED_NO_RETRY' and prior['optimizer_steps_completed'] == 19
    assert prior['adapter_sha256']['adapter_model.safetensors'] == plan['initial_adapter_sha256']
    assert sha(INITIAL / 'adapter_model.safetensors') == plan['initial_adapter_sha256']
    assert sha(INITIAL / 'adapter_config.json') == plan['initial_config_sha256']
    tensor_proof = json.loads((PRIOR_RUN / 'reloaded_tensors.json').read_text())
    assert len(tensor_proof) == 112 and all(r['finite'] is True and r['dtype'] == 'torch.float32' for r in tensor_proof)
    source_read = W / 'cocolon-fit38-loss-source-20261030.json'
    source = json.loads(source_read.read_text())
    assert source['transformers_version'] == old['dependencies']['transformers'] == '5.19.0'
    assert not source['torch_imported'] and all(source[k] == 0 for k in ['model_loads', 'model_forwards', 'updates', 'generations', 'new_cmee_calls'])
    assert {p: r['sha256'] for p, r in source['files'].items()} == plan['installed_loss_source_sha256']
    assert all(sha(r['path']) == r['sha256'] for r in source['files'].values())
    frozen = dict(old['frozen'])
    for record in source['files'].values():
        frozen[record['path']] = record['sha256']
    for directory in [PRIOR_RUN, PRIOR_PACK]:
        for p in directory.rglob('*'):
            if p.is_file() and '__pycache__' not in p.parts:
                frozen[str(p)] = sha(p)
    for p in [PRIOR_CPU / 'prepared_cpu.json.gz', PRIOR_CPU / 'train19.jsonl', PRIOR_CPU / 'cpu_summary.json',
              source_read, HERE / 'proposal.json', *[HERE / n for n in plan['source_sha256']]]:
        frozen[str(p)] = sha(p)
    assert all(sha(p) == h for p, h in frozen.items()) and 'torch' not in sys.modules
    prepared = dict(old, status='CPU_FIT38_READY_NO_MODEL', order=plan['update_order'],
                    pass_order=plan['pass_order'], frozen=frozen)
    assert prepared['encoded'] == old['encoded'] and prepared['counts'] == old['counts']
    OUT.mkdir()
    (OUT / 'prepared_cpu.json.gz').write_bytes(gzip.compress((compact(prepared) + '\n').encode(), mtime=0))
    (OUT / 'train19.jsonl').write_bytes((PRIOR_CPU / 'train19.jsonl').read_bytes())
    (OUT / 'installed_loss_source.json').write_bytes(source_read.read_bytes())
    report = dict(status=prepared['status'], seconds=time.monotonic() - start, source_sha256=plan['source_sha256'],
                  proposal_sha256=sha(HERE / 'proposal.json'), prepared_sha256=sha(OUT / 'prepared_cpu.json.gz'),
                  train19_sha256=sha(OUT / 'train19.jsonl'), rows=19, epochs=2, scheduled_updates=38,
                  max_teacher_evaluation_forwards=57, encoded19_unchanged=True, messages_targets_eos_masks_unchanged=True,
                  old9_rows_encoded_and_frequency_ratio_unchanged=True, windows=windows,
                  installed_loss_source_sha256=plan['installed_loss_source_sha256'],
                  saved_adapter_bytes_unchanged=True, saved_finite112_proof_retained=True, frozen_files=len(frozen),
                  model_loads=0, model_forwards=0, updates=0, generations=0, new_cmee_calls=0, torch_imported=False,
                  candidate_ready=False, automatic_progression=False, product_credit=0)
    write(OUT / 'cpu_summary.json', report)
    print(compact({k: v for k, v in report.items() if k not in ['windows', 'source_sha256']}), flush=True)

if __name__ == '__main__':
    main()
