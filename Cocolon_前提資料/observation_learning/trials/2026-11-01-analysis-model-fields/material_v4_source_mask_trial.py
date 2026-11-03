"""One bounded source-aware decoding comparison; no training or raw repair."""
from dataclasses import asdict
import hashlib
import html
import importlib.util
import inspect
import json
import os
from pathlib import Path
import shutil
import signal
import statistics
import subprocess
import sys
import threading
import time
import traceback
import zipfile

W = Path('/workspace')
ROOT = W/'analysis-material-v4-source-mask-eos2-20261103'
PRIOR = W/'analysis-material-v4-target4-20261103'
API = W/'analysis-material-v3-api-20261103'
INITIAL = W/'analysis-material-v4-pair8-20261103/train/adapter'
COMMIT = 'ded0586720df0c0d50d8838bcd391a19ca3eead5'
WEIGHTS = 'a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59'
CONFIG = '006ebf7bef859264b3778126f4a0f6512e1b2a7e6049b09dfcf0d56603ede3a9'
PROFILE = 'selected_material.v4'
LIMIT = 600
sys.dont_write_bytecode = True
os.environ.update(HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
sys.path[:0] = [str(W), str(API/'ai/tools'), str(API/'ai/services/ai_inference')]
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
canonical = lambda v: json.dumps(v, ensure_ascii=False, sort_keys=True, separators=(',', ':'))


def write(path, value):
    path = Path(path)
    temp = path.with_suffix(path.suffix+'.tmp')
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n')
    temp.replace(path)


def check():
    assert subprocess.check_output(['git', '-C', str(API), 'rev-parse', 'HEAD'], text=True).strip() == COMMIT
    assert not subprocess.check_output(['git', '-C', str(API), 'status', '--porcelain', '--untracked-files=no'], text=True).strip()
    assert sha(INITIAL/'adapter_model.safetensors') == WEIGHTS
    assert sha(INITIAL/'adapter_config.json') == CONFIG


def previous():
    # Reuse only the final implementation's binding/save helpers, not its run.
    path = W/'material_v4_target4_execution.py'
    assert sha(path) == '946101d4b03b34bfe641b8c3298500e16229b2b48dd7ba86e67d88529127932b'
    spec = importlib.util.spec_from_file_location('source_mask_previous', path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def setup():
    import torch
    from transformers import AutoTokenizer, AutoConfig, GenerationConfig
    from syntax2b import TokenMask
    from material_v4_source_mask import Grammar
    tokenizer = AutoTokenizer.from_pretrained('Qwen/Qwen3.5-4B',
        revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a', local_files_only=True,
        trust_remote_code=False)
    engine = TokenMask(tokenizer)
    config = AutoConfig.from_pretrained('Qwen/Qwen3.5-4B',
        revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a', local_files_only=True,
        trust_remote_code=False)
    try:
        generation = GenerationConfig.from_pretrained('Qwen/Qwen3.5-4B',
            revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a', local_files_only=True)
        origin = 'cached_generation_config'
    except OSError:
        generation = GenerationConfig.from_model_config(config)
        origin = 'cached_model_config_fallback_same_as_loader'
    ids = generation.eos_token_id
    ids = ids if isinstance(ids, list) else [ids]
    assert ids and all(type(i) is int and i in tokenizer.all_special_ids and 0 <= i < engine.size for i in ids)
    engine.eos = ids[0]
    engine.model_eos_ids = ids
    engine.eos_origin = origin
    assert engine.eos not in engine.data
    return torch, tokenizer, engine, Grammar


def replay(tokenizer, engine, grammar, text, *, masks=False):
    ids = tokenizer.encode(text, add_special_tokens=False)
    assert b''.join(engine.data[i] for i in ids).decode('utf-8') == text
    state = grammar.initial_state()
    elapsed = []
    for tid in ids:
        if masks:
            started = time.perf_counter()
            assert engine.allowed(state)[tid] and not engine.allowed(state)[engine.eos]
            elapsed.append(time.perf_counter()-started)
        state = engine.advance(state, tid)
    assert state.complete
    if masks:
        assert engine.allowed(state)[engine.eos]
    return elapsed


def cpu():
    check()
    assert not ROOT.exists(), 'do_not_overwrite_prepared_partial_or_completed_trial'
    ROOT.mkdir()
    started = time.monotonic()
    for name in ('material_v4_source_mask.py', 'material_v4_source_mask_trial.py', 'syntax2b.py'):
        shutil.copy2(W/name, ROOT/name)
    pack = json.loads((PRIOR/'pack.json').read_text())
    own = previous()
    torch, tokenizer, engine, Grammar = setup()
    assert not torch.cuda.is_initialized()
    report = dict(status='CPU_RUNNING_NO_MODEL', teachers=[], baseline=[], checks={},
                  model_loads=0, model_forwards=0, training_updates=0)
    latencies = []
    for index, row in enumerate(pack['teachers']):
        p = own.prepare_input(row)
        assert p.messages() == row['messages'] and p.request_ref == row['request_ref']
        grammar = Grammar(json.loads(p.messages()[1]['content'])['fields'])
        latencies += replay(tokenizer, engine, grammar, row['assistant_target'], masks=index < 2)
        report['teachers'].append(dict(id=row['id'], all_target_tokens_allowed=True))
    rows = pack['evaluation'][:22]
    assert [r['id'] for r in rows][-1] == 'X08'
    before = ROOT/'before'
    before.mkdir()
    shutil.copy2(PRIOR/'before/report.json', before/'report.json')
    for row in rows:
        p = own.prepare_input(row)
        key = row['id']
        req = json.loads((PRIOR/'before'/f'{key}.request.json').read_text())
        assert req['messages'] == row['messages'] == p.messages()
        assert req['request_ref'] == row['request_ref'] == p.request_ref
        assert req['messages_sha256'] == hashlib.sha256(canonical(p.messages()).encode()).hexdigest()
        for path in (PRIOR/'before').glob(key+'.*'):
            shutil.copy2(path, before/path.name)
        raw = (before/f'{key}.raw.txt').read_text()
        grammar = Grammar(json.loads(p.messages()[1]['content'])['fields'])
        state = grammar.initial_state()
        first_rejected = None
        for offset, byte in enumerate(raw.encode()):
            state = state.step(byte)
            if state is None:
                first_rejected = offset
                break
        report['baseline'].append(dict(id=key, first_rejected_byte=first_rejected,
            complete=state.complete if state else False, raw_sha256=sha(before/f'{key}.raw.txt')))
    # Independent lexical boundary probes. No correct meanings enter Grammar.
    source = '私の役割は記録係だった。私は報告を書かなかった。「😀」\\\n'
    grammar = Grammar([dict(field=1, text=source)])
    unit = dict(node_kind='ROLE', parent_quote=None, qualifiers=[], quote='報告', scope_role=None)
    valid = dict(fields=[dict(field=1, units=[unit])])
    replay(tokenizer, engine, grammar, canonical(valid), masks=True)
    # Same lexical source can express an incorrect meaning; the mask must allow it.
    altered = json.loads(canonical(valid))
    altered['fields'][0]['units'][0].update(node_kind='IMMEDIATE_RESULT_OR_AFTERMATH', scope_role='WRITTEN_REASON', parent_quote='記録係だった')
    replay(tokenizer, engine, grammar, canonical(altered))
    for quote in ('😀', '「😀」', '\\', '\n'):
        probe = json.loads(canonical(valid)); probe['fields'][0]['units'][0]['quote'] = quote
        if quote.strip():
            replay(tokenizer, engine, grammar, canonical(probe))
    malformed = [canonical(valid).replace('"quote":"報告"', '"quote":"報告を書いた"'),
        canonical(valid).replace('"field":1,', '"field":1,"field":1,'),
        canonical(valid).replace('"field":1', '"field":2'), canonical(valid)+'{}']
    for text in malformed:
        state = grammar.initial_state().feed(text.encode())
        assert state is None or not state.complete
    boundary = Grammar([dict(field=1, text='原文')])
    initial = boundary.initial_state()
    completed = initial.feed(b'{"fields":[{"field":1,"units":[]}]}')
    assert completed.complete and not engine.allowed(initial)[engine.eos]
    assert engine.allowed(completed)[engine.eos] and engine.advance(completed, engine.eos).complete
    assert not engine.allowed(initial)[tokenizer.eos_token_id]
    if tokenizer.eos_token_id != engine.eos:
        assert not engine.allowed(completed)[tokenizer.eos_token_id]
    # Real HF stop criterion on CPU, no model forward or fake meaning success.
    from transformers.generation.stopping_criteria import EosTokenCriteria
    stopped = EosTokenCriteria(engine.model_eos_ids)
    assert not bool(stopped(torch.tensor([[1]]), None).item())
    assert bool(stopped(torch.tensor([[1, engine.eos]]), None).item())
    report['eos_binding'] = dict(tokenizer_eos=tokenizer.eos_token_id,
        model_eos_ids=engine.model_eos_ids, selected_mask_eos=engine.eos,
        origin=engine.eos_origin, unfinished_forbidden=True, completed_allowed=True,
        installed_hf_stopping_criterion_passed_no_forward=True)
    report['checks'].update(source_external_quote_rejected=True, duplicate_key_rejected=True,
        wrong_field_rejected=True, trailing_root_rejected=True, semantic_error_still_selectable=True,
        quotes_unicode_backslash_preserved=True, no_free_string_fast_path=True)
    report.update(status='CPU_PASSED_NO_MODEL', seconds=time.monotonic()-started,
        tokenizer_mapping_count=engine.token_mapping_checked,
        mask_seconds=dict(samples=len(latencies), mean=statistics.mean(latencies), max=max(latencies)),
        sources={n:sha(ROOT/n) for n in ('material_v4_source_mask.py','material_v4_source_mask_trial.py','syntax2b.py')})
    assert report['seconds'] < 300 and not torch.cuda.is_initialized()
    assert statistics.mean(latencies)*2048 < 20, 'mask_mean_exceeds_20_second_generation_allowance'
    write(ROOT/'cpu.json', report)
    write(ROOT/'plan.json', dict(status='CPU_PREPARED', api_commit=COMMIT, profile=PROFILE,
        evaluation=rows, baseline_root=str(PRIOR/'before'), weights_sha256=WEIGHTS,
        config_sha256=CONFIG, generation_policy='compact_schema_and_field_source_quotes.v1',
        new_generations=22, model_loads=1, training_updates=0, max_seconds=LIMIT,
        request_seconds=60, max_new_tokens=2048, context=8192,
        normal_adoption=False, production_change=False))
    print(json.dumps({k:report[k] for k in ('status','seconds','mask_seconds','sources')}), flush=True)


def run():
    check()
    assert (ROOT/'cpu.json').exists() and not (ROOT/'run.started').exists()
    assert json.loads((ROOT/'cpu.json').read_text())['status'] == 'CPU_PASSED_NO_MODEL'
    (ROOT/'run.started').write_text(str(time.time()))
    started = time.monotonic(); end = started+LIMIT
    def expired(*_): raise TimeoutError('source_mask_trial_deadline')
    signal.signal(signal.SIGALRM, expired); signal.setitimer(signal.ITIMER_REAL, LIMIT)
    signal.signal(signal.SIGINT, expired)
    signal.signal(signal.SIGTERM, expired)
    report = dict(status='RUNNING', policy='compact_schema_and_field_source_quotes.v1',
        generations=[], training_updates=0, model_loads=0, normal_adoption=False)
    directory = ROOT/'guided'; directory.mkdir()
    try:
        from transformers import LogitsProcessorList
        from syntax2b import SyntaxProcessor
        from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse
        import serve_emlis_natural_reply as server
        torch, tokenizer, engine, Grammar = setup()
        active = []
        def factory(messages, count, actual_model_eos):
            actual_ids = actual_model_eos if isinstance(actual_model_eos, list) else [actual_model_eos]
            assert actual_ids == engine.model_eos_ids and engine.eos in actual_ids
            grammar = Grammar(json.loads(messages[1]['content'])['fields'])
            engine.cache.clear(); engine.tensor_cache.clear()
            processor = SyntaxProcessor(engine, count)
            processor.state = grammar.initial_state()
            active[:] = [processor]
            return LogitsProcessorList([processor])
        source = inspect.getsource(server.load_generator)
        old = 'stopping_criteria=StoppingCriteriaList([stopping]))'
        new = 'stopping_criteria=StoppingCriteriaList([stopping]), logits_processor=source_mask_factory(messages, count, model.generation_config.eos_token_id))'
        assert source.count(old) == 1
        namespace = dict(vars(server), source_mask_factory=factory)
        exec(compile(source.replace(old, new), '<explicit-offline-source-mask-loader>', 'exec'), namespace)
        (ROOT/'loader_original.py').write_text(source)
        (ROOT/'loader_guided.py').write_text(source.replace(old,new))
        generator = namespace['load_generator'](str(INITIAL), threading.Event(),
            weights_sha256=WEIGHTS, config_sha256=CONFIG)
        report['model_loads'] = 1
        own = previous()
        plan = json.loads((ROOT/'plan.json').read_text())
        for row in plan['evaluation']:
            key = row['id']; p = own.prepare_input(row)
            assert row['messages'] == p.messages() and row['request_ref'] == p.request_ref
            write(directory/f'{key}.request.json', json.loads((ROOT/'before'/f'{key}.request.json').read_text()))
            t = time.monotonic()
            raw, finish = generator(p.messages(), min(end, t+60))
            processor = active[0]
            response = AnalysisModelQuotedParentUnitsResponse(p.request_ref,
                hashlib.sha256(canonical(p.messages()).encode()).hexdigest(),
                hashlib.sha256(raw.encode()).hexdigest(), finish, raw)
            (directory/f'{key}.raw.txt').write_text(raw)
            write(directory/f'{key}.response.json', asdict(response))
            audit = dict(id=key, seconds=time.monotonic()-t, finish_reason=finish,
                mask_seconds=sum(processor.latencies), mask_calls=len(processor.latencies),
                mask_max_seconds=max(processor.latencies), raw_sha256=sha(directory/f'{key}.raw.txt'))
            grammar = Grammar(json.loads(p.messages()[1]['content'])['fields'])
            state = grammar.initial_state().feed(raw.encode())
            audit['grammar_complete'] = bool(state and state.complete)
            audit.update(own.bind_save(row,p,response,directory,key))
            report['generations'].append(audit)
            write(ROOT/'run.json',report)
            print(json.dumps(audit),flush=True)
        report['status'] = 'COMPLETED'
    except BaseException:
        report.update(status='PARTIAL_FAILED', error=traceback.format_exc())
        raise
    finally:
        signal.setitimer(signal.ITIMER_REAL,0)
        report['seconds'] = time.monotonic()-started
        report['initial_weights_unchanged'] = sha(INITIAL/'adapter_model.safetensors') == WEIGHTS
        report['initial_config_unchanged'] = sha(INITIAL/'adapter_config.json') == CONFIG
        write(ROOT/'run.json',report)
        manifest = {str(p.relative_to(ROOT)):sha(p) for p in sorted(ROOT.rglob('*')) if p.is_file() and p.name!='manifest.json'}
        write(ROOT/'manifest.json',manifest)
        archive = W/'cocolon-analysis-material-v4-source-mask-eos2-20261103.zip'
        with zipfile.ZipFile(archive,'x',compression=zipfile.ZIP_DEFLATED) as z:
            for p in sorted(ROOT.rglob('*')):
                if p.is_file(): z.write(p,p.relative_to(ROOT))
        payload = dict(report=report, archive_bytes=archive.stat().st_size, archive_sha256=sha(archive))
        (W/'source-mask-eos2-review.html').write_text('<meta charset="utf-8"><h1>Analysis source mask comparison</h1><pre>'+html.escape(json.dumps(payload,ensure_ascii=False,indent=2))+'</pre>')


if __name__ == '__main__':
    action = sys.argv[1]
    if action == 'cpu':
        os.environ['CUDA_VISIBLE_DEVICES']=''
        signal.signal(signal.SIGALRM, lambda *_: (_ for _ in ()).throw(TimeoutError('cpu_300_seconds')))
        signal.setitimer(signal.ITIMER_REAL,300)
        cpu()
    elif action == 'run': run()
    else: raise ValueError('unknown_action')
