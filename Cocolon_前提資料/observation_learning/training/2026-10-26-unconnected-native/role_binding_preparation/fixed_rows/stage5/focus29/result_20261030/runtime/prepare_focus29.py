"""Reuse all nineteen teacher rows; current ten twice, old nine once. CPU only."""
import collections
import gzip
import hashlib
import importlib.metadata
import json
from pathlib import Path
import sys
import time

sys.dont_write_bytecode = True
W = Path('/workspace')
HERE = Path(__file__).resolve().parent
PRIOR_CPU = W / 'cocolon_fit38_cpu_20261030'
PRIOR_RUN = W / 'cocolon_fit38_run_20261030'
BRANCH_CPU = W / 'cocolon_fit38_branch4_cpu_20261030'
BRANCH_RUN = W / 'cocolon_fit38_branch4_run_20261030'
BRANCH_PACK = W / 'cocolon_branch4_pack_20261030'
OUT = W / 'cocolon_focus29_cpu_20261030'

def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def compact(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'), allow_nan=False)

def write(p, value):
    p.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False)+'\n')

def main():
    start = time.monotonic()
    plan = json.loads((HERE / 'proposal.json').read_text())
    assert plan['status'] == 'PROPOSED_NEEDS_NEW_MASH_APPROVAL'
    assert not OUT.exists() and not (HERE / 'approved_plan.json').exists()
    assert (plan['max_updates'], plan['max_teacher_evaluation_forwards']) == (29,19)
    assert plan['allocation'] == {'new':2,'old':1}
    assert all(sha(HERE/n) == h for n,h in plan['source_sha256'].items())
    assert sha(PRIOR_CPU / 'prepared_cpu.json.gz') == plan['prior_prepared_sha256']
    assert sha(PRIOR_CPU / 'train19.jsonl') == plan['train19_sha256']
    old = json.loads(gzip.decompress((PRIOR_CPU / 'prepared_cpu.json.gz').read_bytes()))
    assert old['status'] == 'CPU_FIT38_READY_NO_MODEL'
    assert plan['pass_order'] == old['pass_order'] and len(set(old['pass_order'])) == 19
    new = [cid for cid in plan['pass_order'] if '/stage' in cid]
    anchors = [cid for cid in plan['pass_order'] if '/stage' not in cid]
    assert len(new) == 10 and len(anchors) == 9
    order = []
    ai = 0
    for cycle in range(2):
        for number in range(1,6):
            order.extend(cid for cid in new if cid.endswith('/stage'+str(number)))
            if number <= 4 or cycle == 1:
                order.append(anchors[ai])
                ai += 1
    assert order == plan['update_order'] and len(order) == 29 and ai == 9
    assert collections.Counter(order) == {cid:2 if cid in new else 1 for cid in plan['pass_order']}
    assert plan['measurement_phases'] == ['after29_saved_reload']
    assert plan['evaluation_order'] == [c['case_id'] for c in old['original_cases']]
    assert {n:importlib.metadata.version(n) for n in old['dependencies']} == old['dependencies']
    branch_cpu = json.loads((BRANCH_CPU / 'cpu_report.json').read_text())
    assert sha(BRANCH_CPU / 'cpu_report.json') == plan['branch4_report_sha256']
    frozen = dict(branch_cpu['frozen_sha256'])
    assert all(sha(p) == h for p,h in frozen.items())
    branch = json.loads((BRANCH_RUN / 'run.json').read_text())
    assert branch['status'] == 'DIAGNOSIS_COMPLETE_NOT_PRODUCT_ACCEPTANCE'
    assert branch['model_loads_completed'] == 1 and branch['forwards_completed'] == 4
    assert branch['updates'] == branch['generations'] == branch['new_cmee_calls'] == 0
    assert all(m['argmax']['token_id'] == m['historical']['token_id'] and m['gold']['rank'] == 2 for m in branch['measurements'])
    assert sha(PRIOR_RUN / 'adapter/adapter_model.safetensors') == plan['initial_adapter_sha256']
    assert sha(PRIOR_RUN / 'adapter/adapter_config.json') == plan['initial_config_sha256']
    proof = json.loads((PRIOR_RUN / 'reloaded_tensors.json').read_text())
    assert len(proof) == 112 and all(t['finite'] and t['dtype'] == 'torch.float32' for t in proof)
    assert sha(PRIOR_RUN / 'nll_after38_saved_reload.jsonl') == plan['baseline_nll_sha256']
    rows = [json.loads(line) for line in (PRIOR_CPU / 'train19.jsonl').read_text().splitlines() if line.strip()]
    assert len(rows) == 19 and {r['id'] for r in rows} == set(old['encoded']) == set(plan['pass_order'])
    windows = []
    for cid in plan['pass_order']:
        item = old['encoded'][cid]
        ids,labels = item['input_ids'],item['labels']
        first = next(i for i,t in enumerate(labels) if t != -100)
        assert len(ids) == len(labels) and labels[first:] == ids[first:] and 0 < first < len(ids)
        assert all(t == -100 for t in labels[:first])
        windows.append(dict(id=cid, first_target_index=first, loss_start=first-1,
                            logit_positions=len(ids)-first+1, supervised_tokens=len(ids)-first,
                            original_complete_target_and_terminal_tokens_unchanged=True,
                            scheduled_updates=2 if cid in new else 1))
    for directory in [BRANCH_RUN,BRANCH_PACK]:
        for p in directory.rglob('*'):
            if p.is_file() and '__pycache__' not in p.parts:
                frozen[str(p)] = sha(p)
    for p in [BRANCH_CPU/'cpu_report.json', PRIOR_CPU/'cpu_summary.json',
              PRIOR_RUN/'reloaded_tensors.json', HERE/'proposal.json', *[HERE/n for n in plan['source_sha256']]]:
        frozen[str(p)] = sha(p)
    assert all(sha(p) == h for p,h in frozen.items()) and 'torch' not in sys.modules
    prepared = dict(old,status='CPU_FOCUS29_READY_NO_MODEL',order=order,pass_order=plan['pass_order'],frozen=frozen)
    assert prepared['encoded'] == old['encoded'] and prepared['counts'] == old['counts']
    OUT.mkdir()
    (OUT/'prepared_cpu.json.gz').write_bytes(gzip.compress((compact(prepared)+'\n').encode(),mtime=0))
    (OUT/'train19.jsonl').write_bytes((PRIOR_CPU/'train19.jsonl').read_bytes())
    (OUT/'installed_loss_source.json').write_bytes((PRIOR_CPU/'installed_loss_source.json').read_bytes())
    report = dict(status=prepared['status'],seconds=time.monotonic()-start,source_sha256=plan['source_sha256'],
                  proposal_sha256=sha(HERE/'proposal.json'),prepared_sha256=sha(OUT/'prepared_cpu.json.gz'),
                  train19_sha256=sha(OUT/'train19.jsonl'),rows=19,allocation=plan['allocation'],scheduled_updates=29,
                  max_teacher_evaluation_forwards=19,encoded19_unchanged=True,messages_targets_terminal_tokens_masks_unchanged=True,
                  old9_frequency_changed_from_2_to_1=True,windows=windows,
                  installed_loss_source_sha256=plan['installed_loss_source_sha256'],
                  saved_adapter_bytes_unchanged=True,saved_finite112_proof_retained=True,frozen_files=len(frozen),
                  model_loads=0,model_forwards=0,updates=0,generations=0,new_cmee_calls=0,torch_imported=False,
                  candidate_ready=False,automatic_progression=False,product_credit=0)
    write(OUT/'cpu_summary.json',report)
    print(compact({k:v for k,v in report.items() if k not in ['windows','source_sha256']}),flush=True)

if __name__ == '__main__':
    main()
