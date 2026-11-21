"""Capture the completed bounded role18 execution; no model or DB operations."""
import hashlib
import json
from pathlib import Path
import zipfile

BASE = Path('/workspace')
PACK = BASE / 'cocolon_role18_pack_20261029'
RUN = BASE / 'cocolon_joint_role18_run_20261029'
CMEE = BASE / 'cocolon_role18_cmee_20261029'
BUNDLE = BASE / 'cocolon_auxiliary4_20261029'
SOURCE = BASE / 'cocolon_auxiliary_fit8_pack_20261029/cmee_current7b9_root_20261029'
INITIAL = BASE / 'cocolon_auxiliary_fit8_run_20261029/adapter'
OUTPUT = BASE / 'cocolon-role18-weights-and-originals-20261029.zip'


def sha(data):
    return hashlib.sha256(data).hexdigest()


def main():
    run_bytes = (RUN / 'run.json').read_bytes()
    run = json.loads(run_bytes)
    assert run['status'] == 'RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW'
    assert run['optimizer_steps_completed'] == 18 and run['model_calls_completed'] == 11
    assert run['initial_adapter_and_frozen_inputs_unchanged'] is True
    assert (PACK / 'cmee.exit').read_text() == '0'
    diagnosis_bytes = (CMEE / 'diagnosis.json').read_bytes()
    diagnosis = json.loads(diagnosis_bytes)
    assert len(diagnosis['cases']) == 11
    assert diagnosis['full2']['count'] == 2 and diagnosis['old9_after_only']['count'] == 9
    for item in run['calls']:
        assert sha((RUN / item['path']).read_bytes()) == item['raw_sha256']
    for name, digest in run['adapter_sha256'].items():
        assert sha((RUN / 'adapter' / name).read_bytes()) == digest
    roots = {'runtime': PACK, 'run': RUN, 'cmee': CMEE,
             'frozen/archive': BUNDLE / 'archive', 'frozen/support': BUNDLE / 'support',
             'frozen/diagnostic': BUNDLE / 'diagnostic', 'cmee_source': SOURCE,
             'initial_adapter': INITIAL}
    payload = {}
    for prefix, root in roots.items():
        assert root.is_dir()
        for path in sorted(root.rglob('*')):
            if not path.is_file() or '__pycache__' in path.parts or '.ipynb_checkpoints' in path.parts:
                continue
            assert not path.is_symlink()
            payload[prefix + '/' + str(path.relative_to(root))] = path.read_bytes()
    summary = {
        'status': 'ROLE18_EXECUTION_COMPLETE_CONTENT_REVIEW_SEPARATE',
        'source_commit': run['source_commit'], 'api_commit': diagnosis['api_commit'],
        'optimizer_steps_completed': 18, 'model_loads_completed': run['model_loads_completed'],
        'model_calls_completed': 11, 'changed_tensors': run['changed_tensors'],
        'adapter_sha256': run['adapter_sha256'],
        'processing_seconds': run['processing_seconds'], 'process_cost_usd': run['process_cost_usd'],
        'cmee_cpu_seconds': diagnosis['seconds'], 'full2': diagnosis['full2'],
        'old9_after_only': diagnosis['old9_after_only'],
        'complete_diagnosis_sha256': sha(diagnosis_bytes), 'complete_diagnosis_bytes': len(diagnosis_bytes),
        'cases': [{**{k: c.get(k) for k in ['case_id', 'meaning_adopted', 'body_available', 'decision', 'reason_code', 'cold_file_status']},
                   **{k: run['calls'][i].get(k) for k in ['output_tokens', 'eos_reached', 'seconds', 'raw_sha256', 'timeout_triggered']}}
                  for i, c in enumerate(diagnosis['cases'])],
        'normal_activation': False, 'product_credit': 0, 'automatic_progression': False,
        'base_model_and_tokenizer_files_included': False,
        'base_model': 'Qwen/Qwen3.5-4B', 'base_revision': '851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a',
        'optimizer_rng_state_included': False,
    }
    payload['execution_summary.json'] = (json.dumps(summary, ensure_ascii=False, indent=2) + '\n').encode()
    payload['export_role18_final.py'] = Path(__file__).read_bytes()
    manifest = {'stage': 'COMPLETED_EXECUTION_ORIGINALS_NOT_PRODUCT_ACCEPTANCE',
                'files': [{'path': n, 'bytes': len(b), 'sha256': sha(b)} for n, b in payload.items()]}
    with zipfile.ZipFile(OUTPUT, 'x', zipfile.ZIP_DEFLATED) as archive:
        for name, data in payload.items():
            archive.writestr(name, data)
        archive.writestr('manifest.json', json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    assert (RUN / 'run.json').read_bytes() == run_bytes
    assert (CMEE / 'diagnosis.json').read_bytes() == diagnosis_bytes
    print(json.dumps({'archive': OUTPUT.name, 'bytes': OUTPUT.stat().st_size,
                      'sha256': sha(OUTPUT.read_bytes()), 'payloads': len(payload),
                      'full2': summary['full2'], 'old9_after_only': summary['old9_after_only'],
                      'seconds': summary['processing_seconds'], 'usd': summary['process_cost_usd']}, ensure_ascii=False))


if __name__ == '__main__':
    main()
