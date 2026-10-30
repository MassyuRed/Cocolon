"""Recover originals after any terminal exit. No model import, generation or repair."""
from pathlib import Path
import gzip
import hashlib
import json
import subprocess
import zipfile

W = Path('/workspace')
PACK = W / 'cocolon_focus29_pack_20261030'
RUN = W / 'cocolon_focus29_run_20261030'
CPU = W / 'cocolon_focus29_cpu_20261030'
ARCHIVE = W / 'cocolon-focus29-originals-20261030.zip'

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def encoded(value):
    return (json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + '\n').encode()

def main():
    assert (PACK / 'gpu.exit').is_file(), 'run_must_have_terminated'
    assert not ARCHIVE.exists(), 'recovery_is_single_export'
    cpu = json.loads(gzip.decompress((CPU / 'prepared_cpu.json.gz').read_bytes()))
    changed = [p for p, h in cpu['frozen'].items() if not Path(p).is_file() or sha(Path(p)) != h]
    try:
        gpu = dict(gpu_read_only=subprocess.check_output(['nvidia-smi', '--query-gpu=name,memory.used,utilization.gpu',
                                                          '--format=csv,noheader'], text=True, timeout=10).strip())
    except (OSError, subprocess.SubprocessError) as exc:
        gpu = dict(gpu_read_only=None, gpu_read_error=type(exc).__name__ + ': ' + str(exc))
    post = dict(frozen_files=len(cpu['frozen']), all_frozen_bytes_unchanged=not changed, changed_paths=changed,
                initial_adapter_sha256=sha(W / 'cocolon_fit38_run_20261030/adapter/adapter_model.safetensors'),
                initial_config_sha256=sha(W / 'cocolon_fit38_run_20261030/adapter/adapter_config.json'),
                **gpu, model_rerun=False, retry=False)
    (PACK / 'post_identity.json').write_bytes(encoded(post))
    files = {}
    for prefix, directory in [('run', RUN), ('runtime', PACK), ('inputs', CPU)]:
        if directory.exists():
            for path in sorted(directory.rglob('*')):
                if path.is_file() and '__pycache__' not in path.parts:
                    files[prefix + '/' + str(path.relative_to(directory))] = path
    for label, path in [('frozen_consume_stage5.py', W / 'cocolon_stage5_pack_20261030/consume_stage5.py'),
                        ('original_train11.jsonl', W / 'cocolon_rehearsal13_cpu_20261029/train_messages11.jsonl'),
                        ('original_eval11.json', W / 'cocolon_rehearsal13_cpu_20261029/eval_inputs11.json')]:
        files['source/' + label] = path
    manifest = dict(files=[dict(path=n, bytes=p.stat().st_size, sha256=sha(p)) for n, p in files.items()],
                    prior_frozen=cpu['frozen'], prior_frozen_bytes_reference='Existing immutable CPU/GitHub and prior complete adapter archive; frozen originals not modified.',
                    base_model=dict(model='Qwen/Qwen3.5-4B', revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a',
                                    full_base_weights_included=False),
                    product_credit=0, automatic_progression=False)
    temporary = ARCHIVE.with_suffix('.zip.partial')
    with zipfile.ZipFile(temporary, 'x', zipfile.ZIP_DEFLATED) as archive:
        for name, path in files.items():
            archive.write(path, name)
        archive.writestr('archive_manifest.json', encoded(manifest))
    temporary.rename(ARCHIVE)
    run = json.loads((RUN / 'run.json').read_text()) if (RUN / 'run.json').exists() else {}
    receipt = dict(archive=ARCHIVE.name, bytes=ARCHIVE.stat().st_size, sha256=sha(ARCHIVE), members=len(files) + 1,
                   status=run.get('status', 'RUN_REPORT_MISSING_RECOVERED_WITHOUT_RETRY'),
                   processing_seconds=run.get('processing_seconds'), process_cost_usd=run.get('process_cost_usd'), post_identity=post)
    (W / 'cocolon-focus29-recovery.json').write_bytes(encoded(receipt))
    print(json.dumps(receipt, ensure_ascii=False, indent=2), flush=True)

if __name__ == '__main__':
    main()

