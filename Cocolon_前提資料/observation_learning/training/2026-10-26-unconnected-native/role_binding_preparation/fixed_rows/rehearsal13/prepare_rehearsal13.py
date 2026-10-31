"""CPU preparation only: unchanged shape2 pair plus every frozen old teacher."""
import gzip
import hashlib
import importlib.metadata
import importlib.util
import json
import os
from pathlib import Path
import sys
import time

os.environ.update(CUDA_VISIBLE_DEVICES='', HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
sys.dont_write_bytecode = True
W = Path('/workspace')
OUT = W / 'cocolon_rehearsal13_cpu_20261029'
SHAPE = W / 'cocolon_shape2_cpu_20261029'
PACK = W / 'cocolon_fixedrows5_pack_20261029'
FULL = ['FT-BOOK-AFTER-ANSWER', 'FT-SHOP-AFTER-ANSWER']

def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def load(name, p):
    spec = importlib.util.spec_from_file_location(name, p)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module

def write(p, value):
    Path(p).write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + '\n')

def main():
    start = time.monotonic()
    OUT.mkdir(exist_ok=False)
    runner = load('rehearsal13_existing_runner', PACK / 'run_fixed_rows5.py')
    _, _, helper, bound = runner.owners()
    original = json.loads((SHAPE / 'cpu_check.json').read_text())
    assert original['status'] == 'CPU_SHAPE2_PASSED_NO_MODEL'
    assert all(sha(p) == h for p, h in original['frozen'].items())
    assert all(sha(p) == h for p, h in bound.items())
    import torch
    from transformers import AutoTokenizer
    from safetensors.torch import load_file
    assert not torch.cuda.is_initialized()
    dependencies = {n: importlib.metadata.version(n) for n in helper.PINS}
    assert dependencies == helper.PINS
    tokenizer = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION,
                                             local_files_only=True, trust_remote_code=False)
    old_rows = {r['id']: r for r in helper.read_jsonl(runner.BUNDLE / 'archive/runtime/train_messages.jsonl')}
    old_eval = {r['case_id']: r for r in json.loads((runner.DERIVED / 'eval_inputs.json').read_text())}
    full_rows = {r['id']: r for r in helper.read_jsonl(SHAPE / 'train_messages2.jsonl')}
    full_eval = {r['case_id']: r for r in json.loads((SHAPE / 'eval_inputs2.json').read_text())}
    rows = {cid: (full_rows[cid] if cid in FULL else old_rows[cid]) for cid in FULL + runner.OLD}
    evaluations = {cid: (full_eval[cid] if cid in FULL else old_eval[cid]) for cid in rows}
    order = [FULL[0], runner.OLD[0], FULL[1], runner.OLD[1], runner.OLD[2], FULL[0],
             runner.OLD[3], runner.OLD[4], FULL[1], *runner.OLD[5:]]
    assert len(order) == 13
    assert all(order.count(cid) == (2 if cid in FULL else 1) for cid in rows)
    encoded = {}
    counts = []
    old_counts = json.loads((PACK / 'prepared_cpu.json').read_text())['counts']
    for cid, row in rows.items():
        assert row['messages'][:-1] == evaluations[cid]['messages']
        item, prompt = helper.encode_training(tokenizer, row['messages'], context=8192)
        assert item['labels'][:prompt] == [-100] * prompt
        assert item['labels'][prompt:] == item['input_ids'][prompt:]
        assert item['input_ids'][prompt:].count(tokenizer.eos_token_id) == 1
        assert prompt + runner.CAP[cid] <= 8192
        if cid in FULL:
            previous = next(c for c in original['counts'] if c['case_id'] == cid)
            assert item == previous['encoded'] and prompt == previous['prompt_tokens']
        else:
            derived = next(r for r in helper.read_jsonl(runner.DERIVED / 'train_messages.jsonl') if r['id'] == cid)
            assert row == derived
            previous = next(c for c in old_counts if c['case_id'] == cid)
            assert (prompt, len(item['input_ids']), sum(v != -100 for v in item['labels'])) == (
                previous['prompt_tokens'], previous['total_tokens'], previous['supervised'])
        encoded[cid] = item
        counts.append(dict(case_id=cid, prompt_tokens=prompt, total_tokens=len(item['input_ids']),
                           supervised=len(item['input_ids'])-prompt, cap=runner.CAP[cid],
                           scheduled_updates=order.count(cid), messages_unchanged=True))
    (OUT / 'train_messages11.jsonl').write_text(''.join(
        json.dumps(r, ensure_ascii=False, separators=(',', ':'), allow_nan=False)+'\n' for r in rows.values()))
    write(OUT / 'eval_inputs11.json', list(evaluations.values()))
    consumer = load('rehearsal13_existing_consumer', PACK / 'consume_fixed_rows5.py')
    own = consumer.owners(runner.ROOT)
    teacher_results = []
    cold_dir = OUT / 'teacher_cmee'
    cold_dir.mkdir()
    for cid in FULL:
        raw = dict(raw_text=rows[cid]['messages'][-1]['content'], finish_reason='stop',
                   provider='CPU_FROZEN_TEACHER_NOT_MODEL', model=helper.MODEL, revision=helper.REVISION,
                   adapter_revision='cpu_teacher', usage={'prompt_tokens': 0, 'completion_tokens': 0}, seconds=0.)
        result, saved = consumer.read_raw(own, cid, raw)
        assert result['meaning_adopted'] and result['body_available']
        consumer.save_cold(runner.ROOT, own, cid, result, saved, cold_dir)
        previous = next(r for r in original['teacher_cmee'] if r['case_id'] == cid)
        assert result == previous
        teacher_results.append(result)
    weights = load_file(str(runner.INITIAL / 'adapter_model.safetensors'), device='cpu')
    assert len(weights) == 112 and all(t.dtype == torch.float32 and torch.isfinite(t).all() for t in weights.values())
    assert sha(runner.INITIAL / 'adapter_model.safetensors') == runner.INITIAL_SHA
    frozen = {**{str(p): h for p, h in bound.items()}, **original['frozen']}
    for p in (Path(__file__), SHAPE / 'cpu_check.json', OUT / 'train_messages11.jsonl', OUT / 'eval_inputs11.json'):
        frozen[str(p)] = sha(p)
    assert all(sha(p) == h for p, h in frozen.items())
    report = dict(status='CPU_REHEARSAL13_READY_NO_MODEL', source_sha256=sha(__file__),
                  order=order, counts=counts, encoded=encoded, frozen=frozen, teacher_cmee=teacher_results,
                  dependencies=dependencies, initial_adapter_sha256=runner.INITIAL_SHA,
                  old9_bytes_unchanged=True, full2_messages_targets_tokens_unchanged=True,
                  model_loads=0, model_forwards=0, updates=0, generations=0, seconds=time.monotonic()-start,
                  product_credit=0, automatic_progression=False)
    payload = (json.dumps(report, ensure_ascii=False, separators=(',', ':'), allow_nan=False)+'\n').encode()
    (OUT / 'prepared_cpu.json.gz').write_bytes(gzip.compress(payload, mtime=0))
    summary = {k: v for k, v in report.items() if k not in ('encoded', 'frozen', 'teacher_cmee')}
    summary.update(prepared_cpu_sha256=sha(OUT / 'prepared_cpu.json.gz'),
                   prepared_cpu_bytes=(OUT / 'prepared_cpu.json.gz').stat().st_size,
                   teacher_meaning_body_cold_replay='2/2; full outcome identical to shape2 CPU teacher',
                   frozen_count=len(frozen))
    write(OUT / 'cpu_summary.json', summary)
    print(json.dumps(summary, ensure_ascii=False), flush=True)

if __name__ == '__main__':
    main()
