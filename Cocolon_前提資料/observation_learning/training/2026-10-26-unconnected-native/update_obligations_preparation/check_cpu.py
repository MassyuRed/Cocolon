"""One CPU-only real-input/token comparison; no model, optimizer or generation."""
import argparse
import copy
import hashlib
import importlib.metadata
import importlib.util
import json
import os
from pathlib import Path
import sys
import time

sys.dont_write_bytecode = True

def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module

def dump(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + '\n')

def main(root):
    started = time.monotonic()
    assert os.environ.get('CUDA_VISIBLE_DEVICES') == ''
    assert os.environ.get('HF_HUB_OFFLINE') == os.environ.get('TRANSFORMERS_OFFLINE') == '1'
    result_path = root / 'actual_cpu_check.json'
    assert not result_path.exists(), 'do_not_overwrite_prior_result'
    manifest = json.loads((root / 'restore_payload.json').read_text())
    for item in manifest['files']:
        assert sha(root / item['path']) == item['sha256'], item['path']
    sys.path[:0] = [str(root / 'api/ai/services/ai_inference'), str(root / 'legacy')]
    helper = load('run_pilot', root / 'legacy/run_pilot.py')
    verify = load('verify_cmee', root / 'legacy/verify_cmee.py')
    frozen = load('update_obligations_frozen_cases', root / 'frozen/consume_expanded15_recovery.py')
    assert sha(root / 'legacy/run_pilot.py') == frozen.HELPER_SHA
    assert sha(root / 'legacy/verify_cmee.py') == frozen.VERIFY_SHA
    _, native = frozen.frozen_cases(root / 'frozen', root / 'frozen/sft_examples.jsonl')
    from cocolon_meaning_experience_engine import preparation
    from cocolon_meaning_experience_engine import model_candidate_source as baseline
    candidate = load('cocolon_meaning_experience_engine.update_obligations_candidate', root / 'model_candidate_source.py')
    assert Path(baseline.__file__).is_relative_to(root / 'api')
    from transformers import AutoTokenizer
    import torch
    assert not torch.cuda.is_initialized()
    versions = {name: importlib.metadata.version(name) for name in helper.PINS}
    assert versions == helper.PINS
    tok = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION,
        local_files_only=True, trust_remote_code=False)
    rows = helper.read_jsonl(root / 'frozen/current_train_messages.jsonl')
    cases = json.loads((root / 'frozen/current_eval_inputs.json').read_text())
    assert len(rows) == len(cases) == len(native) == 15
    results, newcases = [], []
    for row, case in zip(rows, cases, strict=True):
        cid = case['case_id']
        assert row['id'] == cid
        request, prior = verify.reconstruct_request({'native_case': native[cid]})
        original_prior = copy.deepcopy(prior)
        old = baseline.build_model_messages(request, prior, candidate_format=preparation.QUOTE_CANDIDATE_SCHEMA)
        new = candidate.build_model_messages(request, prior, candidate_format=preparation.QUOTE_CANDIDATE_SCHEMA)
        assert old == case['messages'], 'baseline_messages_not_reproduced:' + cid
        assert baseline.build_model_messages(request, prior) == candidate.build_model_messages(request, prior), 'legacy_messages_changed'
        assert prior == original_prior, 'native_prior_mutated'
        ob, nb = json.loads(old[1]['content']), json.loads(new[1]['content'])
        expected = copy.deepcopy(ob)
        affected = cid in {'FT-BOOK-AFTER-ANSWER', 'FT-SHOP-AFTER-ANSWER'}
        if affected:
            expected['output_spec']['updates'] = nb['output_spec']['updates']
            assert old != new
        else:
            assert old == new
        assert nb == expected and old[0] == new[0], 'other_input_field_changed:' + cid
        oldids = helper.chat_token_ids(tok, old, generation_prompt=True)
        ids = helper.chat_token_ids(tok, new, generation_prompt=True)
        oldfull = helper.chat_token_ids(tok, old + [row['messages'][-1]], generation_prompt=False)
        full = helper.chat_token_ids(tok, new + [row['messages'][-1]], generation_prompt=False)
        assert oldfull[:len(oldids)] == oldids and full[:len(ids)] == ids
        target = full[len(ids):]
        assert target == oldfull[len(oldids):], 'teacher_target_tokens_changed:' + cid
        assert tok.eos_token_id in target and len(full) <= 8192
        assert len(ids) + case['max_new_tokens'] <= 8192, 'generation_context_exceeded:' + cid
        results.append(dict(case_id=cid, prompt_changed=affected, old_prompt_tokens=len(oldids),
            prompt_tokens=len(ids), token_delta=len(ids)-len(oldids), target_tokens=len(target),
            output_cap=case['max_new_tokens'], prompt_plus_cap=len(ids)+case['max_new_tokens'],
            full_teacher_tokens=len(full), teacher_target_ids_unchanged=True, legacy_messages_unchanged=True,
            saved_prior_unchanged=True, teacher_sha256=hashlib.sha256(row['messages'][-1]['content'].encode()).hexdigest()))
        newcases.append(dict(case, messages=new))
    for item in manifest['files']:
        assert sha(root / item['path']) == item['sha256'], 'source_changed_during_check'
    assert not torch.cuda.is_initialized()
    dump(root / 'eval_inputs.json', newcases)
    report = dict(status='CPU_UPDATE_OBLIGATIONS_INPUT_CHECKED_MODEL_EFFECT_UNMEASURED',
        seconds=time.monotonic()-started, source_api_ref=manifest['source_api_ref'],
        cocolon_source_ref=manifest['cocolon_source_ref'], candidate_sha256=sha(root/'model_candidate_source.py'),
        dependency_versions=versions, python=sys.version.split()[0], torch=torch.__version__,
        case_count=15, changed_prompts=2, unchanged_prompts=13, teacher15_target_ids_unchanged=True,
        legacy15_messages_unchanged=True, full_native_prior_unchanged=True,
        max_prompt_plus_cap=max(r['prompt_plus_cap'] for r in results), context_tokens=8192,
        source_manifest_sha256=sha(root/'restore_payload.json'), cases=results,
        model_loads=0, model_forwards=0, training_updates=0, generations=0, sql_operations=0,
        pytest=0, cuda_initialized=False, product_credit=0, candidate_ready=False, automatic_progression=False)
    dump(result_path, report)
    print(json.dumps({k:v for k,v in report.items() if k!='cases'},ensure_ascii=False),flush=True)

if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--root',type=Path,required=True)
    main(parser.parse_args().root.resolve())
