#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-prepare}"
TASK_DIR="/workspace/cocolon_emlis_free_20261024"
mkdir -p "$TASK_DIR"

if [[ "$MODE" != "prepare" && "$MODE" != "run" ]]; then
  echo '使用方法: bash cocolon_pilot.sh prepare|run' >&2
  exit 2
fi

if [[ "$MODE" == "prepare" ]]; then
  : "${COCOLON_SOURCE_COMMIT:?固定commitをCOCOLON_SOURCE_COMMITへ指定してください}"
  if [[ ! "$COCOLON_SOURCE_COMMIT" =~ ^[0-9a-f]{40}$ ]]; then
    echo '固定commitは40文字のSHAで指定してください' >&2
    exit 2
  fi
  SOURCE_URL="https://raw.githubusercontent.com/MassyuRed/Cocolon/${COCOLON_SOURCE_COMMIT}/Cocolon_%E5%89%8D%E6%8F%90%E8%B3%87%E6%96%99/observation_learning/training/2026-10-24-emlis-free-pilot"
  for file in run_pilot.py sft_examples.jsonl train_messages.jsonl eval_inputs.jsonl eval_review.jsonl; do
    curl --fail --location --retry 2 --connect-timeout 30 --max-time 180 "$SOURCE_URL/$file" -o "$TASK_DIR/$file.download"
    mv "$TASK_DIR/$file.download" "$TASK_DIR/$file"
  done
  BASE_PYTHON="$(command -v python)"
  if [[ -x /workspace/cocolon9b/.venv/bin/python ]]; then
    BASE_PYTHON=/workspace/cocolon9b/.venv/bin/python
  fi
  PARENT_SITE="$("$BASE_PYTHON" -c 'import sysconfig; print(sysconfig.get_paths()["purelib"])')"
  "$BASE_PYTHON" -m venv --system-site-packages "$TASK_DIR/venv"
  "$TASK_DIR/venv/bin/python" - "$PARENT_SITE" <<'PY'
from pathlib import Path
import sys
import sysconfig
parent = Path(sys.argv[1]).resolve()
target = Path(sysconfig.get_paths()['purelib'])
if parent != target.resolve():
    (target / 'cocolon_parent_environment.pth').write_text(str(parent) + '\n', encoding='utf-8')
PY
  "$TASK_DIR/venv/bin/python" - "$TASK_DIR" <<'PY'
import importlib.metadata as metadata
import json
from pathlib import Path
import sys
directory = Path(sys.argv[1])
import torch
names = set()
for distribution in metadata.distributions():
    name = distribution.metadata.get('Name', '')
    if name.lower() in {'torch', 'torchvision', 'torchaudio', 'triton'} or name.lower().startswith('nvidia-'):
        names.add(name)
pins = [f'{name}=={metadata.version(name)}' for name in sorted(names)]
(directory / 'cuda-constraints.txt').write_text('\n'.join(sorted(set(pins))) + '\n', encoding='utf-8')
(directory / 'base-torch.json').write_text(json.dumps({'torch': torch.__version__, 'cuda_build': torch.version.cuda}), encoding='utf-8')
print('既存Torchを維持します:', torch.__version__, 'CUDA build:', torch.version.cuda)
PY
  "$TASK_DIR/venv/bin/python" -m pip install --timeout 60 --retries 1 --constraint "$TASK_DIR/cuda-constraints.txt" \
    'transformers==5.19.0' 'peft==0.21.2' 'accelerate==1.15.0' 'safetensors==0.8.0'
  "$TASK_DIR/venv/bin/python" - "$TASK_DIR" <<'PY'
import json
from pathlib import Path
import sys
import torch
base = json.loads((Path(sys.argv[1]) / 'base-torch.json').read_text())
if base != {'torch': torch.__version__, 'cuda_build': torch.version.cuda}:
    raise SystemExit('既存TorchとCUDA buildが変わっています。中止します')
PY
  "$TASK_DIR/venv/bin/python" -m pip freeze > "$TASK_DIR/resolved-packages.txt"
  echo "$COCOLON_SOURCE_COMMIT" > "$TASK_DIR/SOURCE_COMMIT"
fi

if [[ ! -x "$TASK_DIR/venv/bin/python" || ! -f "$TASK_DIR/SOURCE_COMMIT" ]]; then
  echo '先にprepareを実行してください' >&2
  exit 2
fi

# Reuse a known existing cache; do not copy the 9B checkpoint into a second cache.
if [[ -z "${HF_HOME:-}" ]]; then
  for cache in /workspace/cocolon9b/hf-cache /workspace/hf /workspace/hf_cache /workspace/.cache/huggingface /workspace/hf_home /root/.cache/huggingface; do
    if [[ -f "$cache/hub/models--Qwen--Qwen3.5-9B/snapshots/c202236235762e1c871ad0ccb60c8ee5ba337b9a/config.json" ]]; then
      export HF_HOME="$cache"
      break
    fi
  done
fi
export HF_HOME="${HF_HOME:-/workspace/.cache/huggingface}"
export HF_HUB_DISABLE_TELEMETRY=1
export TOKENIZERS_PARALLELISM=false
export PYTHONUNBUFFERED=1

if [[ "$MODE" == "prepare" ]]; then
  "$TASK_DIR/venv/bin/python" "$TASK_DIR/run_pilot.py" prepare --directory "$TASK_DIR" 2>&1 | tee "$TASK_DIR/prepare.log"
else
  if [[ ! -f "$TASK_DIR/preflight.json" ]]; then
    echo '準備確認OKが出るまでrunを実行しないでください' >&2
    exit 2
  fi
  echo '学習前6回答 → 9教材を1epoch学習 → 学習後6回答を実行します。'
  echo '処理は1時間で終了要求、30秒後に強制終了します。Podは自動Stopされません。'
  set +e
  timeout --signal=TERM --kill-after=30s 3600s "$TASK_DIR/venv/bin/python" "$TASK_DIR/run_pilot.py" run --directory "$TASK_DIR" 2>&1 | tee "$TASK_DIR/latest-run.log"
  status=${PIPESTATUS[0]}
  set -e
  echo '完了・失敗・時間切れのいずれでも、Runpod管理画面でPodをStopしてください。'
  exit "$status"
fi
