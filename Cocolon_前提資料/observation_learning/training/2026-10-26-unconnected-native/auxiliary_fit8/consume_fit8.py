"""Only the two full actual outputs enter the unchanged named receiver/CMEE."""
import argparse
from dataclasses import replace
import hashlib
import importlib
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import time

os.environ.update(CUDA_VISIBLE_DEVICES='', HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
sys.dont_write_bytecode = True
OLD_CONSUMER = '5597700c11135410e2fa215e6424bed7edfc3e89230eba02223c8e85e10887ca'
API_MANIFEST = 'fcf83dcf42f290b24978090bb4207ed999cf24aa1d6a9b79852d74a90075cc98'
API = '7b9ee073de03940ba71587297d8600b2b6094dd1'
IDS = ['FT-BOOK-AFTER-ANSWER', 'FT-SHOP-AFTER-ANSWER']


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    sys.modules[name] = result
    spec.loader.exec_module(result)
    return result


def owners(bundle, root):
    assert not any(name.startswith('cocolon_meaning_experience_engine') for name in sys.modules), 'fresh_cmee_process_required'
    assert sha(bundle / 'archive/runtime/consume_named9.py') == OLD_CONSUMER
    manifest_path = bundle / 'archive/runtime/api_source_manifest.json'
    assert sha(manifest_path) == API_MANIFEST
    current = json.loads(manifest_path.read_text())
    assert current['api_commit'] == API and len(current['files']) == 5
    for item in current['files']:
        assert sha(root / 'api' / item['path']) == item['sha256'], item['path']
    ledger = json.loads((root / 'restore_payload.json').read_text())
    assert ledger['source_api_ref'] == API
    old = load('fit8_unchanged_consumer', bundle / 'archive/runtime/consume_named9.py')
    result = old.owners(root)
    for module_name in ['preparation', 'model_candidate_source', 'emlis_semantic_admission', 'named_reference_wire']:
        module = importlib.import_module('cocolon_meaning_experience_engine.' + module_name)
        expected = root / 'api/ai/services/ai_inference/cocolon_meaning_experience_engine' / (module_name + '.py')
        assert Path(module.__file__).resolve() == expected.resolve(), module_name
        assert sha(expected) == next(item['sha256'] for item in current['files'] if item['path'].endswith('/' + module_name + '.py'))
    return old, result


def read_raw(v, native, Engine, semantic, prep, cid, raw):
    """Same receive/prepare/generate calls as consume_named9; no repair or fallback."""
    from cocolon_meaning_experience_engine.named_reference_wire import SCHEMA
    request, prior = v.reconstruct_request({'native_case': native[cid]})
    material = prep.prepare_emlis(request)
    receipt = prep.receive_candidate(material, request_id=material.request_id,
        raw_output=raw['raw_text'], finish_reason=raw['finish_reason'], provider=raw['provider'],
        model=raw['model'], revision=raw['revision'], adapter_revision=raw['adapter_revision'],
        usage=raw['usage'], elapsed_seconds=raw['seconds'], candidate_format=SCHEMA)
    item = dict(case_id=cid, receipt=v.json_value(receipt), meaning_adopted=False, body_available=False)
    saved = None
    try:
        checkpoint = Engine().prepare_emlis_update(request, semantic_input=semantic.SemanticInput(
            'FRESH_CANDIDATE', receipt, prior_snapshot_json=prior, semantic_profile=semantic.MODEL_PROFILE))
        resumed = replace(request, emlis_thread=replace(request.emlis_thread, prepared_meaning_checkpoint_ref=checkpoint.checkpoint_id))
        complete = Engine().generate(resumed, semantic_input=semantic.SemanticInput(
            'RESUME_ADOPTED', snapshot_json=checkpoint.semantic_snapshot, semantic_profile=semantic.MODEL_PROFILE))
        item.update(meaning_adopted=True, body_available=complete.artifact is not None,
                    checkpoint=v.json_value(checkpoint), outcome=v.json_value(complete))
        saved = dict(native_case=native[cid], semantic_snapshot=checkpoint.semantic_snapshot,
                     checkpoint_id=checkpoint.checkpoint_id, expected_full_outcome=v.json_value(complete))
    except semantic.SemanticNotAdopted as exc:
        item.update(decision=exc.decision, reason_code=exc.reason_code)
    return item, saved


def main(bundle, root, run, out):
    started = time.monotonic()
    old, (v, native, Engine, semantic, prep) = owners(bundle, root)
    owner = load('fit8_current_runner', Path(__file__).with_name('run_fit8.py'))
    plan, _, _, bound = owner.validate(bundle, True)
    before = sha(run / 'run.json')
    report = json.loads((run / 'run.json').read_text())
    assert report['plan'] == plan and report['status'] == 'RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW'
    assert report['optimizer_steps_completed'] == 8 and report['model_calls_completed'] == 6
    calls = report['full_calls']
    assert len(report['auxiliary_calls']) == 4 and [call['case_id'] for call in calls] == IDS
    assert sha(root / 'restore_payload.json') == json.loads((Path(__file__).with_name('cpu_check.json')).read_text())['current_cmee_manifest_sha256']
    out.mkdir(exist_ok=False)
    result = dict(status='CPU_FIT8_ACTUAL_FULL2', api_commit=API, cases=[], model_calls=0,
                  training_updates=0, sql_operations=0, product_credit=0, automatic_progression=False)
    for call in calls:
        cid = call['case_id']
        path = run / call['path']
        assert path.name == 'after_' + cid + '.jsonl' and sha(path) == call['raw_sha256']
        raw = json.loads(path.read_text())
        assert raw['case_id'] == cid and raw['adapter_revision'] == report['adapter_sha256']['adapter_model.safetensors']
        assert raw['model'] == 'Qwen/Qwen3.5-4B' and raw['revision'] == '851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a'
        assert hashlib.sha256(raw['raw_text'].encode()).hexdigest() == raw['raw_utf8_sha256']
        item, saved = read_raw(v, native, Engine, semantic, prep, cid, raw)
        item.update(raw_sha256=sha(path), cold_file_status='NO_ADOPTED_SNAPSHOT')
        if saved is not None:
            saved_path = out / (cid + '_saved.json')
            cold_path = out / (cid + '_cold.json')
            old.dump(saved_path, saved)
            subprocess.run([sys.executable, '-B', str(bundle / 'archive/runtime/consume_named9.py'),
                '--root', str(root), '--worker', '--saved', str(saved_path), '--saved-sha', sha(saved_path),
                '--out', str(cold_path)], check=True, capture_output=True, text=True, timeout=60)
            got = json.loads(cold_path.read_text())
            assert got['process_id'] != os.getpid() and got['full_outcome'] == saved['expected_full_outcome']
            item['cold_file_status'] = got['status']
        result['cases'].append(item)
        old.dump(out / 'diagnosis.json', result)
    assert sha(run / 'run.json') == before and all(sha(path) == digest for path, digest in bound.items())
    result.update(seconds=time.monotonic() - started,
                  meaning_adopted_count=sum(item['meaning_adopted'] for item in result['cases']),
                  body_available_count=sum(item['body_available'] for item in result['cases']))
    old.dump(out / 'diagnosis.json', result)
    print(json.dumps({key: value for key, value in result.items() if key != 'cases'}), flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--bundle-root', required=True, type=Path)
    parser.add_argument('--cmee-root', required=True, type=Path)
    parser.add_argument('--run', required=True, type=Path)
    parser.add_argument('--out', required=True, type=Path)
    args = parser.parse_args()
    main(args.bundle_root.resolve(), args.cmee_root.resolve(), args.run.resolve(), args.out.resolve())
