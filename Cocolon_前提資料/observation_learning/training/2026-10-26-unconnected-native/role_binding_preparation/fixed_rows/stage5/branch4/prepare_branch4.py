"""One-off CPU inspection of archived fit38 tokens; no model or GPU import."""
import ast
import gzip
import hashlib
import json
from pathlib import Path

W = Path('/workspace')
CPU = W / 'cocolon_fit38_cpu_20261030'
RUN = W / 'cocolon_fit38_run_20261030'
OUT = W / 'cocolon_fit38_branch4_cpu_20261030'
SELECTED = ['FT-BOOK-AFTER-ANSWER/stage3', 'FT-SHOP-AFTER-ANSWER/stage2']

def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def rows(p):
    return [json.loads(s) for s in Path(p).read_text().splitlines() if s.strip()]

def compact(x):
    return json.dumps(x, ensure_ascii=False, separators=(',', ':'))

def main():
    c = json.loads(gzip.decompress((CPU / 'prepared_cpu.json.gz').read_bytes()))
    train = {r['id']: r for r in rows(CPU / 'train19.jsonl')}
    assert len(train) == 19
    frozen = dict(c['frozen'])
    assert all(sha(p) == h for p, h in frozen.items()), 'frozen_changed'
    for p in [CPU / 'prepared_cpu.json.gz', CPU / 'train19.jsonl', RUN / 'run.json',
              *sorted((RUN / 'adapter').glob('*')),
              RUN / 'FT-BOOK-AFTER-ANSWER_stages.json', RUN / 'FT-SHOP-AFTER-ANSWER_stages.json',
              RUN / 'nll_after38_saved_reload.jsonl']:
        if p.is_file():
            frozen[str(p)] = sha(p)
    assert sha(RUN / 'adapter/adapter_model.safetensors') == 'ad8b89e8974df9bfe7e804b8f67bbaac59e6cbb37042c3254fb58ffb64230d0a'
    records = sum([json.loads((RUN / f'{cid}_stages.json').read_text())
                   for cid in ['FT-BOOK-AFTER-ANSWER', 'FT-SHOP-AFTER-ANSWER']], [])
    results = []
    for r in records:
        cid = r['raw']['case_id']
        e = c['encoded'][cid]
        start = next(i for i, v in enumerate(e['labels']) if v != -100)
        assert all(v == -100 for v in e['labels'][:start])
        assert e['labels'][start:] == e['input_ids'][start:]
        gold_ids = e['labels'][start:]
        actual_ids = r['raw']['output_token_ids']
        token_index = next((i for i, (a, b) in enumerate(zip(gold_ids, actual_ids)) if a != b), min(len(gold_ids), len(actual_ids)))
        gold_text = train[cid]['messages'][-1]['content']
        actual_text = r['raw']['raw_text']
        char_index = next((i for i, (a, b) in enumerate(zip(gold_text, actual_text)) if a != b), min(len(gold_text), len(actual_text)))
        same = r['messages'] == train[cid]['messages'][:-1]
        item = dict(id=cid, teacher_messages_equal_actual=same, teacher_prompt_tokens=start,
                    actual_prompt_tokens=r['raw']['input_tokens'], gold_label_tokens=len(gold_ids),
                    actual_output_tokens=len(actual_ids), first_different_token_index0=token_index,
                    gold_token_id=gold_ids[token_index] if token_index < len(gold_ids) else None,
                    historical_token_id=actual_ids[token_index] if token_index < len(actual_ids) else None,
                    first_different_character_index0=char_index,
                    common_text_tail=gold_text[max(0,char_index-80):char_index],
                    gold_text_next=gold_text[char_index:char_index+100],
                    actual_text_next=actual_text[char_index:char_index+100])
        if cid in SELECTED:
            assert same and start == r['raw']['input_tokens']
            assert token_index > 0 and item['gold_token_id'] != item['historical_token_id']
            item['prediction_position0'] = start + token_index - 1
            item['prefix_input_tokens'] = start + token_index
            item['full_input_tokens'] = len(e['input_ids'])
            item['common_token_prefix_sha256'] = hashlib.sha256(compact(gold_ids[:token_index]).encode()).hexdigest()
        results.append(item)
    nll = rows(RUN / 'nll_after38_saved_reload.jsonl')
    new = [r for r in nll if '/stage' in r['id']]
    def tokens(r):
        return sum(v != -100 for v in c['encoded'][r['id']]['labels'])
    def ce(r):
        return r['nll'] * tokens(r)
    total = sum(ce(r) for r in new)
    s5 = sum(ce(r) for r in new if r['id'].endswith('/stage5'))
    helper = W / 'cocolon_auxiliary4_20261029/support/run_pilot.py'
    source = helper.read_text()
    nodes = ast.parse(source)
    selected_source = {n.name: ast.get_source_segment(source, n) for n in nodes.body
                       if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef)) and
                       n.name in ['teacher_loss', 'chat_token_ids', 'measure_nll', 'evaluate']}
    report = dict(status='CPU_BRANCH4_READY_NO_MODEL', source_predecessor='81284665b5680d0d76725f34c9804938c49409f0',
                  targets=[next(r for r in results if r['id'] == cid) for cid in SELECTED],
                  all_actual_stages=results, new_label_tokens=sum(tokens(r) for r in new),
                  new_total_ce=total, stage5_total_ce=s5, stage5_fraction_of_new_ce=s5/total,
                  frozen_count=len(frozen), frozen_sha256=frozen, helper_sha256=sha(helper),
                  helper_selected_source=selected_source,
                  model_loads=0, model_forwards=0, updates=0, generations=0, new_cmee_calls=0,
                  automatic_progression=False, product_credit=0)
    OUT.mkdir(exist_ok=False)
    (OUT / 'cpu_report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
    print(compact({k: report[k] for k in ['status','targets','stage5_fraction_of_new_ce','frozen_count']}))

if __name__ == '__main__':
    main()
