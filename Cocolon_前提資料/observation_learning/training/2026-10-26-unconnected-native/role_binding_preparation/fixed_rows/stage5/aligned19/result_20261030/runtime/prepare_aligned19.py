"""Prepare exact current-prompt 19-row experiment on CPU; no model/forward/CMEE."""
import os
os.environ.update(CUDA_VISIBLE_DEVICES='', HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
import gzip
import hashlib
import importlib.metadata
import importlib.util
import json
from pathlib import Path
import sys
import time
sys.dont_write_bytecode = True
import prompt_source_index as syntax

W = Path('/workspace')
HERE = Path(__file__).resolve().parent
OUT = W / 'cocolon_aligned19_cpu_20261030'
OLD = W / 'cocolon_stage5_prepared_20261030'
SOURCE = W / 'cocolon_source_index_cpu_20261030'
INITIAL = W / 'cocolon_stage5_run_20261030/adapter'

def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module

def main():
    start = time.monotonic()
    stage_path = W / 'cocolon_stage5_pack_20261030/consume_stage5.py'
    assert hashlib.sha256(stage_path.read_bytes()).hexdigest() == '92bf81c1ca52a72480753010efc911fc132c74f4208a533853feb70fc5650713', 'frozen_stage_source_changed'
    stage = load('aligned19_frozen_stage_cpu', stage_path)
    plan = json.loads((HERE / 'proposal.json').read_text())
    stage.need(plan['status'] == 'PROPOSED_NEEDS_NEW_MASH_APPROVAL', 'proposal_status')
    stage.need(not OUT.exists(), 'fresh_output_required')
    for name, digest in plan['source_sha256'].items():
        stage.need(stage.sha(HERE / name) == digest, 'source_identity:' + name)
    stage.need(stage.sha(SOURCE / 'candidate_train10.jsonl') == plan['current_train10_sha256'], 'current_messages_changed')
    stage.need(stage.sha(INITIAL / 'adapter_model.safetensors') == plan['initial_adapter_sha256'], 'experimental_initial_changed')
    old = json.loads(gzip.decompress((OLD / 'prepared_cpu.json.gz').read_bytes()))
    frozen = {**old['frozen'], **json.loads((W / 'cocolon_source_index_probe_run_20261030/extra_frozen.json').read_text())}
    stage.need(all(stage.sha(p) == h for p, h in frozen.items()), 'prior_frozen_changed')
    loader = stage.load('aligned19_frozen_loader_cpu', W / 'cocolon_fixedrows5_pack_20261029/run_fixed_rows5.py')
    _, _, helper, bound = loader.owners()
    stage.need({n: importlib.metadata.version(n) for n in helper.PINS} == helper.PINS == old['dependencies'], 'dependency_changed')
    import torch
    from transformers import AutoTokenizer
    stage.need(not torch.cuda.is_initialized(), 'cpu_only')
    tokenizer = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION, local_files_only=True, trust_remote_code=False)
    current = helper.read_jsonl(SOURCE / 'candidate_train10.jsonl')
    trained = helper.read_jsonl(OLD / 'train19.jsonl')
    original = helper.read_jsonl(W / 'cocolon_rehearsal13_cpu_20261029/train_messages11.jsonl')
    original_by_id = {r['id']: r for r in original}
    old_by_id = {r['id']: r for r in trained}
    stage.need(len(current) == 10 and len(trained) == 19, 'row_counts')
    train = current + [old_by_id[cid] for cid in plan['evaluation_order'][2:]]
    stage.need(len(train) == len({r['id'] for r in train}) == 19 and set(plan['update_order']) == {r['id'] for r in train}, 'unique_schedule')
    encoded, counts, teacher_records, alignment = {}, [], {}, []
    for row in train:
        cid = row['id']
        prior = old_by_id[cid]
        stage.need(row['messages'][-1] == prior['messages'][-1], 'teacher_changed:' + cid)
        item, prefix = helper.encode_training(tokenizer, row['messages'], context=8192)
        old_prefix = next(i for i, label in enumerate(old['encoded'][cid]['labels']) if label != -100)
        target = item['input_ids'][prefix:]
        stage.need(target == old['encoded'][cid]['input_ids'][old_prefix:] and item['labels'][prefix:] == target, 'target_or_eos_changed:' + cid)
        stage.need(all(x == -100 for x in item['labels'][:prefix]) and target.count(tokenizer.eos_token_id) == 1, 'loss_mask:' + cid)
        stage.need(tokenizer.decode(target, skip_special_tokens=False, clean_up_tokenization_spaces=False) == row['messages'][-1]['content'] + '<|im_end|>\n', 'complete_suffix:' + cid)
        is_stage = '/stage' in cid
        if is_stage:
            origin, num = cid.rsplit('/stage', 1)
            number = int(num)
            cap = stage.CAPS[origin][number - 1]
            stage.need(row['messages'][:-1] != prior['messages'][:-1], 'expected_untrained_prompt_diff:' + cid)
            records = teacher_records.setdefault(origin, [])
            previous = [dict(stage=r['stage'], values=stage.stage_values(r['raw']['raw_text'], r['stage'])) for r in records]
            base = original_by_id[origin]['messages'][:-1]
            stage.need(row['messages'][:-1] == syntax.build_messages(base, number, previous), 'current_builder_mismatch:' + cid)
            if number == 1:
                live = W / ('cocolon_source_index_probe_run_20261030/stage1_' + origin + '.jsonl.messages.json')
                stage.need(row['messages'][:-1] == json.loads(live.read_text()), 'latest_actual_stage1_mismatch:' + cid)
                frozen[str(live)] = stage.sha(live)
            raw = dict(case_id=cid, raw_text=row['messages'][-1]['content'], raw_utf8_sha256=stage.text_sha(row['messages'][-1]['content']),
                       finish_reason='stop', eos_reached=True, provider='CPU_TEACHER_NOT_MODEL', model=helper.MODEL, revision=helper.REVISION,
                       adapter_revision='CPU_TEACHER_ONLY', input_tokens=prefix, output_tokens=len(target), output_token_ids=target,
                       usage=dict(prompt_tokens=prefix, completion_tokens=len(target)), seconds=0.)
            records.append(dict(case_id=origin, stage=number, messages=row['messages'][:-1], messages_sha256=stage.text_sha(stage.compact(row['messages'][:-1])), raw=raw))
            alignment.append(dict(id=cid, trained_prompt_sha256=stage.text_sha(stage.compact(prior['messages'][:-1])),
                                  current_prompt_sha256=stage.text_sha(stage.compact(row['messages'][:-1])),
                                  teacher_sha256=stage.text_sha(row['messages'][-1]['content']), target_and_eos_identical=True))
        else:
            cap = 2560
            stage.need(row == prior and row == original_by_id[cid] and item == old['encoded'][cid], 'old9_changed:' + cid)
        stage.need(prefix + cap <= 8192, 'generation_context:' + cid)
        encoded[cid] = item
        counts.append(dict(case_id=cid, prompt_tokens=prefix, target_tokens=len(target), total_tokens=len(item['input_ids']), cap=cap, prompt_plus_cap=prefix + cap))
    checks = []
    for cid, records in teacher_records.items():
        projected = syntax.project(stage, cid, original_by_id[cid]['messages'][:-1], records, cpu_teacher=True)
        stage.need(projected['raw_text'] == original_by_id[cid]['messages'][-1]['content'], 'lossless_reassembly:' + cid)
        checks.append(dict(case_id=cid, lossless_thirteen_paths=True, original_teacher_sha256=stage.text_sha(projected['raw_text'])))
    from safetensors.torch import load_file
    tensors = load_file(str(INITIAL / 'adapter_model.safetensors'), device='cpu')
    stage.need(len(tensors) == 112 and all(v.dtype == torch.float32 and torch.isfinite(v).all().item() for v in tensors.values()), 'initial_112_finite_F32')
    frozen.update({str(p): h for p, h in bound.items()})
    for p in [HERE / 'proposal.json', *[HERE / n for n in plan['source_sha256']], SOURCE / 'candidate_train10.jsonl', SOURCE / 'report.json',
              OLD / 'prepared_cpu.json.gz', OLD / 'train19.jsonl', INITIAL / 'adapter_model.safetensors', INITIAL / 'adapter_config.json']:
        frozen[str(p)] = stage.sha(p)
    stage.need(not torch.cuda.is_initialized() and all(stage.sha(p) == h for p, h in frozen.items()), 'final_identity_or_cuda')
    prepared = dict(status='CPU_ALIGNED19_READY_NO_MODEL', encoded=encoded, frozen=frozen, counts=counts, dependencies=helper.PINS,
                    order=plan['update_order'], original_cases=old['original_cases'], teacher_records=teacher_records)
    OUT.mkdir()
    (OUT / 'prepared_cpu.json.gz').write_bytes(gzip.compress((stage.compact(prepared) + '\n').encode(), mtime=0))
    (OUT / 'train19.jsonl').write_text(''.join(stage.compact(row) + '\n' for row in train))
    report = dict(status=prepared['status'], seconds=time.monotonic() - start, source_sha256=plan['source_sha256'],
                  proposal_sha256=stage.sha(HERE / 'proposal.json'), prepared_sha256=stage.sha(OUT / 'prepared_cpu.json.gz'),
                  train19_sha256=stage.sha(OUT / 'train19.jsonl'), counts=counts, alignment=alignment, teacher_checks=checks,
                  old9_rows_and_encoding_unchanged=True, initial_tensors=112, initial_dtype='F32', frozen_files=len(frozen),
                  model_loads=0, model_forwards=0, updates=0, generations=0, new_cmee_calls=0, cuda_initialized=False,
                  candidate_ready=False, automatic_progression=False, product_credit=0)
    stage.write(OUT / 'cpu_summary.json', report)
    print(stage.compact({k: v for k, v in report.items() if k not in ['counts', 'alignment', 'teacher_checks', 'source_sha256']}), flush=True)

if __name__ == '__main__':
    main()
