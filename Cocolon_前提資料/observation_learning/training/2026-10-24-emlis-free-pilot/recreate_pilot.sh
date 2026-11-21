#!/usr/bin/env bash
# One separate recreation of the fixed recipe, then fit diagnosis and adapter export.
set -euo pipefail
TASK_DIR=/workspace/cocolon_emlis_free_20261024
RECIPE_COMMIT=d53f9ef0a906624acaeb519f8c4c6eb153e60e51
RAW_ROOT=https://raw.githubusercontent.com/MassyuRed/Cocolon
PACK_PATH=Cocolon_%E5%89%8D%E6%8F%90%E8%B3%87%E6%96%99/observation_learning/training/2026-10-24-emlis-free-pilot
MODE="${1:-prepare}"

require_empty_run() {
  python - "$TASK_DIR" <<'PY'
from pathlib import Path
import sys
directory = Path(sys.argv[1])
if (directory / 'latest_results.json').exists() or any((directory / 'results').glob('*/adapter/adapter_model.safetensors')):
    raise SystemExit('保存済み結果またはadapterがあります。重複再学習せず、既存成果を確認してください')
if (directory / 'recreation_attempt.json').exists():
    raise SystemExit('この再作成は実行済み／開始済みです。自動再試行せず、logと退避fileを確認してください')
PY
}

if [[ "$MODE" == prepare ]]; then
  : "${COCOLON_RECREATION_COMMIT:?取得元の固定commitを指定してください}"
  [[ "$COCOLON_RECREATION_COMMIT" =~ ^[0-9a-f]{40}$ ]] || exit 2
  require_empty_run
  mkdir -p "$TASK_DIR"
  curl --fail --location --retry 2 --connect-timeout 30 --max-time 180 \
    "$RAW_ROOT/$RECIPE_COMMIT/$PACK_PATH/runpod.sh" -o "$TASK_DIR/original_runpod.sh"
  COCOLON_SOURCE_COMMIT="$RECIPE_COMMIT" bash "$TASK_DIR/original_runpod.sh" prepare
  for file in diagnose_learning.py export_checkpoint.py; do
    curl --fail --location --retry 2 --connect-timeout 30 --max-time 180 \
      "$RAW_ROOT/$COCOLON_RECREATION_COMMIT/$PACK_PATH/$file" -o "$TASK_DIR/$file.download"
    mv "$TASK_DIR/$file.download" "$TASK_DIR/$file"
  done
  if [[ "$(realpath "$0")" != "$TASK_DIR/recreate_pilot.sh" ]]; then
    cp "$0" "$TASK_DIR/recreate_pilot.sh"
  fi
  echo "$COCOLON_RECREATION_COMMIT" > "$TASK_DIR/RECREATION_SOURCE_COMMIT"
  echo '再作成準備OK。まだ学習は始めていません。'
elif [[ "$MODE" == run ]]; then
  for file in original_runpod.sh preflight.json RECREATION_SOURCE_COMMIT diagnose_learning.py export_checkpoint.py; do
    [[ -f "$TASK_DIR/$file" ]] || { echo '先にprepareを完了してください' >&2; exit 2; }
  done
  [[ -x "$TASK_DIR/venv/bin/python" ]] || exit 2
  require_empty_run
  "$TASK_DIR/venv/bin/python" - "$TASK_DIR" <<'PY'
from pathlib import Path
import json, os, socket, sys, time
directory = Path(sys.argv[1])
with (directory / 'recreation_attempt.json').open('x', encoding='utf-8') as stream:
    json.dump({'separate_run': True, 'original_weights_recovered': False,
               'started_unix': time.time(), 'pod_id': os.environ.get('RUNPOD_POD_ID'),
               'hostname': socket.gethostname()}, stream, ensure_ascii=False, indent=2)
PY
  echo '同じ9教材を1epochだけ別runで再作成し、退避→診断→再退避します。'
  echo '全処理は30分で終了要求、30秒後に強制終了。Podは自動Stopされません。'
  set +e
  timeout --signal=TERM --kill-after=30s 1800s bash "$TASK_DIR/recreate_pilot.sh" _execute
  status=$?
  set -e
  echo '処理終了。tar.gzとsha256をダウンロードしてからPodをStopしてください。'
  echo "退避先: $TASK_DIR/cocolon_recreated_checkpoint.tar.gz"
  echo "終了コード: $status（0以外はlogも確認してください。再学習を繰り返さないでください）"
  exit "$status"
elif [[ "$MODE" == _execute ]]; then
  PYTHON="$TASK_DIR/venv/bin/python"
  # Keep nested original/diagnostic timers inside the outer timer's process group.
  # The fixed original script itself remains unchanged.
  timeout() { command timeout --foreground "$@"; }
  export -f timeout
  "$PYTHON" - "$TASK_DIR" <<'PY'
from pathlib import Path
import json, sys, time
directory = Path(sys.argv[1])
if not (directory / 'recreation_attempt.json').is_file():
    raise SystemExit('内部modeはrunからのみ実行します')
with (directory / 'recreation_execution_started.json').open('x', encoding='utf-8') as stream:
    json.dump({'started_unix': time.time(), 'separate_run': True}, stream)
PY
  # Preserve the first archive if diagnosis fails or the process times out.
  finish() {
    status=$?
    trap - EXIT
    "$PYTHON" "$TASK_DIR/export_checkpoint.py" --directory "$TASK_DIR" || {
      echo '退避を完了できませんでした。保存済みtar.gzの有無を確認してください。' >&2
      if [[ "$status" == 0 ]]; then status=1; fi
    }
    exit "$status"
  }
  trap finish EXIT
  trap 'exit 124' TERM HUP
  trap 'exit 130' INT
  bash "$TASK_DIR/original_runpod.sh" run 2>&1 | sed -u \
    -e 's/品質判定はまだです。RunpodのPodをStopしてください。/学習段階完了。続けて重みの退避と診断を行います。/' \
    -e '/^完了・失敗・時間切れのいずれでも、Runpod管理画面でPodをStopしてください。$/d'
  "$PYTHON" "$TASK_DIR/export_checkpoint.py" --directory "$TASK_DIR"
  timeout --signal=TERM --kill-after=30s 900s "$PYTHON" "$TASK_DIR/diagnose_learning.py" \
    --directory "$TASK_DIR" --reference-result "$TASK_DIR/latest_results.json" 2>&1 | tee "$TASK_DIR/recreation-diagnosis.log"
else
  echo '使用方法: bash cocolon_recreate.sh prepare|run' >&2
  exit 2
fi
