"""Restore the existing pinned inference runtime on the new Pod; no model calls."""
import importlib.metadata
import json
import os
from pathlib import Path
import subprocess
import sys
import time

ROOT = Path('/workspace/cocolon_auxiliary4_20261029')
STARTED = time.monotonic()
REPORT = {'status': 'PREPARING_NO_MODEL', 'started_unix': time.time(),
          'max_seconds': 900, 'model_calls': 0, 'optimizer_steps': 0,
          'retry': False, 'automatic_progression': False}

def save():
    REPORT['seconds'] = time.monotonic() - STARTED
    (ROOT / 'setup_report.json').write_text(json.dumps(REPORT, indent=2) + '\n')

def command(args):
    left = 900 - (time.monotonic() - STARTED)
    if left <= 0:
        raise TimeoutError('preparation_deadline_no_retry')
    subprocess.run(args, check=True, timeout=left, env={**os.environ, 'PIP_DISABLE_PIP_VERSION_CHECK': '1'})

if __name__ == '__main__':
    assert os.environ.get('RUNPOD_POD_ID') == 'vgkm402msgroiu'
    assert importlib.metadata.version('torch') == '2.8.0+cu128'
    assert not (ROOT / 'setup_report.json').exists(), 'setup_already_started_no_retry'
    save()
    try:
        command([sys.executable, '-m', 'pip', 'install', 'transformers==5.19.0',
                 'peft==0.21.2', 'accelerate==1.15.0', 'safetensors==0.8.0'])
        command([sys.executable, '-c',
                 "from huggingface_hub import snapshot_download; print(snapshot_download('Qwen/Qwen3.5-4B', revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a', allow_patterns=['*.json','*.safetensors','*.jinja','*.txt','*.model']))"])
        REPORT['status'] = 'SETUP_COMPLETE_NO_MODEL_PENDING_TOKENIZER_CHECK'
    except BaseException as exc:
        REPORT.update(status='SETUP_STOPPED_NO_RETRY', error_type=type(exc).__name__, reason=str(exc))
    finally:
        REPORT['torch'] = importlib.metadata.version('torch')
        REPORT['processing_allocation_usd'] = (time.monotonic() - STARTED) * .28 / 3600
        save()
    print(json.dumps(REPORT), flush=True)
    raise SystemExit(0 if REPORT['status'] == 'SETUP_COMPLETE_NO_MODEL_PENDING_TOKENIZER_CHECK' else 1)
