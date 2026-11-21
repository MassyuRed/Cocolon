#!/usr/bin/env bash
set -euo pipefail
MODE="${1:-validate}"
TASK_DIR="${COCOLON_4B_DIRECTORY:-/workspace/cocolon_emlis_4b_20261024}"
TASK_PYTHON="${COCOLON_4B_PYTHON:-python}"
if [[ "$MODE" == "fetch" ]]; then
  : "${COCOLON_SOURCE_COMMIT:?固定40文字commitを指定してください}"
  [[ "$COCOLON_SOURCE_COMMIT" =~ ^[0-9a-f]{40}$ ]] || { echo '固定commit不正' >&2; exit 2; }
  [[ ! -e "$TASK_DIR" ]] || { echo '既存directoryへ上書きしません' >&2; exit 2; }
  mkdir -p "$TASK_DIR"
  SOURCE_URL="https://raw.githubusercontent.com/MassyuRed/Cocolon/${COCOLON_SOURCE_COMMIT}/Cocolon_%E5%89%8D%E6%8F%90%E8%B3%87%E6%96%99/observation_learning/training/2026-10-24-emlis-4b-training"
  for file in run_pilot.py diagnose_learning.py export_checkpoint.py verify_cmee.py runpod.sh dataset_manifest.json execution_plan.json README.md; do
    curl --fail --location --retry 1 --connect-timeout 30 --max-time 180 "$SOURCE_URL/$file" -o "$TASK_DIR/$file.download"
    mv "$TASK_DIR/$file.download" "$TASK_DIR/$file"
  done
  "$TASK_PYTHON" - "$TASK_DIR" <<'PY'
import json
from pathlib import Path
import sys
p = Path(sys.argv[1]); m = json.loads((p / 'dataset_manifest.json').read_text())
names = [v['path'] for v in m.get('files', {}).values() if isinstance(v, dict)]
if not names or any(Path(n).name != n or n == 'contract_examples.json' for n in names):
    raise SystemExit('正式dataset未確定。fetchは完了していません')
(p / 'dataset-fetch-list.txt').write_text('\n'.join(names) + '\n')
PY
  while IFS= read -r file; do
    curl --fail --location --retry 1 --connect-timeout 30 --max-time 180 "$SOURCE_URL/$file" -o "$TASK_DIR/$file.download"
    mv "$TASK_DIR/$file.download" "$TASK_DIR/$file"
  done < "$TASK_DIR/dataset-fetch-list.txt"
  echo "$COCOLON_SOURCE_COMMIT" > "$TASK_DIR/SOURCE_COMMIT"
  exec "$TASK_PYTHON" "$TASK_DIR/run_pilot.py" validate --directory "$TASK_DIR"
fi
export HF_HUB_DISABLE_TELEMETRY=1
export TOKENIZERS_PARALLELISM=false
export PYTHONUNBUFFERED=1
# No process termination, service control, dependency installation or GPU start here.
case "$MODE" in
  validate|prepare) exec "$TASK_PYTHON" "$TASK_DIR/run_pilot.py" "$MODE" --directory "$TASK_DIR" ;;
  run)
    echo 'runは有料実行条件を検査します。process期限はPod総課金上限・自動Stopではありません。'
    TASK_LIMIT="$("$TASK_PYTHON" - "$TASK_DIR" <<'PY'
import json
import math
from pathlib import Path
import sys
directory = Path(sys.argv[1]); sys.path.insert(0, str(directory))
from run_pilot import validate_plan
plan = validate_plan(json.loads((directory / 'execution_plan.json').read_text()), paid_run=True)
print(math.ceil(plan['max_seconds']))
PY
)"
    exec timeout --signal=TERM --kill-after=30s "${TASK_LIMIT}s" "$TASK_PYTHON" "$TASK_DIR/run_pilot.py" run --directory "$TASK_DIR" ;;
  diagnose)
    : "${COCOLON_4B_RUN_DIRECTORY:?対象run directoryを指定してください}"
    exec "$TASK_PYTHON" "$TASK_DIR/diagnose_learning.py" --directory "$TASK_DIR" --run-directory "$COCOLON_4B_RUN_DIRECTORY" ;;
  export)
    : "${COCOLON_4B_RUN_DIRECTORY:?対象run directoryを指定してください}"
    exec "$TASK_PYTHON" "$TASK_DIR/export_checkpoint.py" --directory "$TASK_DIR" --run-directory "$COCOLON_4B_RUN_DIRECTORY" ;;
  verify)
    : "${COCOLON_4B_RUN_DIRECTORY:?対象run directoryを指定してください}"
    : "${COCOLON_CMEE_API_ROOT:?固定API checkoutの実pathを指定してください}"
    exec "$TASK_PYTHON" "$TASK_DIR/verify_cmee.py" --directory "$TASK_DIR" --run-directory "$COCOLON_4B_RUN_DIRECTORY" --api-root "$COCOLON_CMEE_API_ROOT" ;;
  *) echo '使用方法: bash runpod.sh fetch|validate|prepare|run|diagnose|verify|export' >&2; exit 2 ;;
esac
