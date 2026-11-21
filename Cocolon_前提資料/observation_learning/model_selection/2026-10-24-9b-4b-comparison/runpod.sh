#!/usr/bin/env bash
set -euo pipefail
TASK_DIR=/workspace/cocolon_selection_20261024
MODE="${1:-all}"

save_result() {
  python - "$TASK_DIR" "$1" <<'PY'
from pathlib import Path
import hashlib,json,sys,time
d=Path(sys.argv[1]); code=int(sys.argv[2]); path=d/'latest_selection.json'
errors=[]
def read(name, fallback):
    try: return json.loads((d/name).read_text())
    except FileNotFoundError: return fallback
    except (ValueError,OSError) as exc:
        errors.append({'file':name,'type':type(exc).__name__})
        return fallback
report=read('latest_selection.json', {})
models=report.setdefault('models', {})
for key in ['4b','9b']:
    partial=read(key+'.json', None)
    if partial is not None: models[key]=partial
if code == 0 and (report.get('status') != 'TWELVE_OUTPUTS_COMPLETE_NOT_QUALITY_ACCEPTED'
        or any(models.get(k,{}).get('status') != 'SIX_OUTPUTS_COMPLETE_NOT_QUALITY_ACCEPTED'
               or len(models.get(k,{}).get('outputs',[])) != 6 for k in ['4b','9b'])):
    code=1
if code != 0:
    report['status']='STOPPED_OR_FAILED' if models else 'FAILED_BEFORE_COMPARISON'
attempt=read('wrapper_attempt.json', {})
report.update(wrapper_attempt=attempt, wrapper_exit_code=code, wrapper_finished_unix=time.time(),
    fine_tuning_performed=False, cmee_integration_performed=False,
    production_serving_cost_measured=False, serverless_cold_start_measured=False)
if 'started_unix' in attempt:
    report['wrapper_elapsed_seconds']=report['wrapper_finished_unix']-attempt['started_unix']
report['wrapper_elapsed_is_not_total_pod_billing_time']=True
if (d/'SOURCE_COMMIT').is_file(): report['source_commit']=(d/'SOURCE_COMMIT').read_text().strip()
if errors: report['result_read_errors']=errors
if not models: report['note']='selection.logを確認してください。自動再実行しません。'
data=(json.dumps(report,ensure_ascii=False,indent=2)+'\n').encode()
temp=path.with_suffix('.json.tmp'); temp.write_bytes(data); temp.replace(path)
(d/'latest_selection.json.sha256').write_text(hashlib.sha256(data).hexdigest()+'  latest_selection.json\n')
raise SystemExit(code)
PY
}

if [[ "$MODE" == all ]]; then
  : "${COCOLON_SELECTION_COMMIT:?固定40文字commitを指定してください}"
  [[ "$COCOLON_SELECTION_COMMIT" =~ ^[0-9a-f]{40}$ ]] || exit 2
  mkdir -p "$TASK_DIR"
  python - "$TASK_DIR" <<'PY'
from pathlib import Path
import sys
d = Path(sys.argv[1])
if any((d / name).exists() for name in ['wrapper_attempt.json', 'attempt.json', 'latest_selection.json', '4b.json', '9b.json']):
    raise SystemExit('比較は開始済みです。既存結果を確認し、自動再実行しないでください')
PY
  if [[ "$(realpath "$0")" != "$TASK_DIR/runpod.sh" ]]; then cp "$0" "$TASK_DIR/runpod.sh"; fi
  echo "$COCOLON_SELECTION_COMMIT" > "$TASK_DIR/SOURCE_COMMIT"
  python - "$TASK_DIR" <<'PY'
from pathlib import Path
import json, sys, time
with (Path(sys.argv[1]) / 'wrapper_attempt.json').open('x') as stream:
    json.dump({'started_unix': time.time(), 'scope': 'six inputs, two base models, max12 generations, no training'}, stream)
PY
  echo '追加学習なし。4Bの6回答→9Bの6回答を一回取得します。'
  echo '取得・install・準備・推論は合計30分で終了要求、30秒後に強制終了。Podは手動Stopです。'
  set +e
  timeout --signal=TERM --kill-after=30s 1800s bash "$TASK_DIR/runpod.sh" _execute 2>&1 | tee "$TASK_DIR/selection.log"
  status=${PIPESTATUS[0]}
  set -e
  # Outside the timeout group: recover atomic per-model files even after SIGKILL.
  save_result "$status" || status=$?
  echo "処理終了（code=$status）。再試行せず、latest_selection.jsonをダウンロードしてPodをStopしてください。"
  echo "保存先: $TASK_DIR/latest_selection.json"
  exit "$status"
elif [[ "$MODE" == _execute ]]; then
  python - "$TASK_DIR" <<'PY'
from pathlib import Path
import sys
d=Path(sys.argv[1])
if not (d/'wrapper_attempt.json').is_file(): raise SystemExit('allから実行してください')
with (d/'execution.started').open('x') as stream: stream.write('one execution\n')
PY
  finish() {
    status=$?
    trap - EXIT
    save_result "$status" || status=$?
    exit "$status"
  }
  trap finish EXIT
  trap 'exit 124' TERM HUP
  trap 'exit 130' INT
  COMMIT="$(cat "$TASK_DIR/SOURCE_COMMIT")"
  [[ "$COMMIT" =~ ^[0-9a-f]{40}$ ]] || exit 2
  ROOT="https://raw.githubusercontent.com/MassyuRed/Cocolon/$COMMIT/Cocolon_%E5%89%8D%E6%8F%90%E8%B3%87%E6%96%99/observation_learning/model_selection/2026-10-24-9b-4b-comparison"
  for name in compare.py cases.jsonl; do
    curl --fail --location --retry 1 --connect-timeout 30 --max-time 120 "$ROOT/$name" -o "$TASK_DIR/$name.download"
    mv "$TASK_DIR/$name.download" "$TASK_DIR/$name"
  done
  BASE_PYTHON="$(command -v python)"
  PARENT_SITE="$("$BASE_PYTHON" -c 'import sysconfig; print(sysconfig.get_paths()["purelib"])')"
  "$BASE_PYTHON" -m venv --system-site-packages "$TASK_DIR/venv"
  "$TASK_DIR/venv/bin/python" - "$TASK_DIR" "$PARENT_SITE" <<'PY'
import importlib.metadata as md
import json,site,sys,sysconfig
from pathlib import Path
d=Path(sys.argv[1]); parent=Path(sys.argv[2]).resolve(); target=Path(sysconfig.get_paths()['purelib'])
if parent != target.resolve():
    (target/'cocolon_parent_environment.pth').write_text(str(parent)+'\n')
    site.addsitedir(str(parent))
import torch
names=set()
for dist in md.distributions():
    n=dist.metadata.get('Name','')
    if n.lower() in {'torch','torchvision','torchaudio','triton'} or n.lower().startswith('nvidia-'): names.add(n)
(d/'cuda-constraints.txt').write_text('\n'.join(f'{n}=={md.version(n)}' for n in sorted(names))+'\n')
(d/'base-torch.json').write_text(json.dumps({'torch':torch.__version__,'cuda_build':torch.version.cuda}))
PY
  "$TASK_DIR/venv/bin/python" -m pip install --timeout 60 --retries 1 --constraint "$TASK_DIR/cuda-constraints.txt" \
    'transformers==5.19.0' 'accelerate==1.15.0' 'safetensors==0.8.0'
  "$TASK_DIR/venv/bin/python" - "$TASK_DIR" <<'PY'
import json,sys,torch
from pathlib import Path
base=json.loads((Path(sys.argv[1])/'base-torch.json').read_text())
if base != {'torch':torch.__version__,'cuda_build':torch.version.cuda}: raise SystemExit('既存Torch/CUDAが変わっています')
PY
  if [[ -z "${HF_HOME:-}" ]]; then
    for cache in /workspace/cocolon9b/hf-cache /workspace/hf /workspace/hf_cache /workspace/.cache/huggingface /workspace/hf_home /root/.cache/huggingface; do
      if [[ -f "$cache/hub/models--Qwen--Qwen3.5-9B/snapshots/c202236235762e1c871ad0ccb60c8ee5ba337b9a/config.json" ]]; then export HF_HOME="$cache"; break; fi
    done
  fi
  export HF_HOME="${HF_HOME:-/workspace/.cache/huggingface}"
  export HF_HUB_DISABLE_TELEMETRY=1 TOKENIZERS_PARALLELISM=false PYTHONUNBUFFERED=1
  export HF_HUB_DOWNLOAD_TIMEOUT=60 HF_HUB_ETAG_TIMEOUT=30
  "$TASK_DIR/venv/bin/python" "$TASK_DIR/compare.py" prepare --directory "$TASK_DIR"
  "$TASK_DIR/venv/bin/python" "$TASK_DIR/compare.py" run --directory "$TASK_DIR"
else
  echo '使用方法: bash cocolon_selection.sh all' >&2
  exit 2
fi
