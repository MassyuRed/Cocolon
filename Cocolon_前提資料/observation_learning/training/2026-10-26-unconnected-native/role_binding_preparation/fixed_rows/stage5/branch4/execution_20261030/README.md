# branch4一回実結果 — 全4計算完了、両経路で誤tokenが優勢

2026-10-30 JST。Mashがa283af4dの具体案へ「進めていいよ。」と承認。source/plan/runner/approvalを固定し、同Jupyterから保存ad8bを診断専用に1回非学習load、BOOK S3/SHOP S2の教師全文と共通prefixを各1回、計4forwardで終了した。承認は消費済み・再試行なしで閉鎖。

| 対象/条件 | 過去の誤token | 正token | 1/2位差 | 誤token確率 |
| --- | --- | --- | ---: | ---: |
| BOOK S3・全文 | 7664・単独1位 | 1293・2位 | 0.75 | 67.8391％ |
| BOOK S3・prefix | 7664・単独1位 | 1293・2位 | 0.75 | 67.8391％ |
| SHOP S2・全文 | 6333・単独1位 | 30812・2位 | 2.875 | 94.5875％ |
| SHOP S2・prefix | 6333・単独1位 | 30812・2位 | 2.875 | 94.5911％ |

全文NLLは2行とも前回fit38保存値へ完全一致。BOOKの競合tokenの経路差はとも0、SHOPはとも−0.125で、どちらもargmaxを変えなかった。全語彙の最大差は0.0625/0.21875で、全数値同一という意味ではない。[全4測定の所見](content_review.md)。低い平均NLLでも重要な初分岐で誤候補が優勢だったという局所不適合を確認した。cache付き生成の再現やS5解消、追加学習回数の十分性・一般品質・商品合格を示すものではない。

非学習load1/4forward完了、eval/nontrainable/use_cache=false、全有限、更新/生成/新CMEE0、旧9未実行、exit0。runner14.90352953702677秒、前回$0.28/h按分$0.0011591634084354156（約$0.0012）、親16.025832931976765秒。上限10分/$0.047内。準備/回収/保持/保存/通信/税等は別、現在単価は未照会。275固定原本/保存ad8b/旧b5e不変、終了後A5000 1MiB/0％で稼働保持。Runpod管理console/API/Stop/restart/delete0。

全14実原本を74055bytesのUTF-8 text containerでJupyterから直接回収。最初の収集は進捗logのCRが改行変換されたため、read_bytes().decode('utf-8')で回収だけを補正した。最終74055bytes/SHA5d660c49f64e1d3524b2e14bf56300df20ed8b7c450c9f591742b13a00c727acと全14memberの元bytes/SHAをPod外照合。モデル/forwardの再試行は0。新重みは作らず、元adapter binaryは前回保全先を維持。

通常受口/意味型/三core/API/DB/RN/Render/Supabase/依存/merge/deploy差分0、STRUCTURE_MAP_DELTA_NONE。前回の新意味/本人本文0/2・saved/cold0を今回評価成功へ変えない。root華恋単一writer/executor/judge、補助read-only、実環境Codex Workで正式Pro/Ultra/human authorityを申告しない。商品0・正式0/3・54.50％・candidate_ready/automatic_progression=false。追加観測会不要。

## 全file地図

| file | 責務 |
| --- | --- |
| [runtime/approved_plan.json](runtime/approved_plan.json) | 実行に使用した不変の承認原本。上位closed版と分離 |
| [runtime/proposal.json](runtime/proposal.json) | 承認された元案・不変 |
| [runtime/run_branch4_once.py](runtime/run_branch4_once.py) | 実4forward runner原bytes |
| [runtime/launch_branch4_once.py](runtime/launch_branch4_once.py) | 実親timeout/lock launcher原bytes |
| [runtime/prepare_branch4.py](runtime/prepare_branch4.py) | 実配置したCPU source原bytes |
| [runtime/bootstrap.json](runtime/bootstrap.json) | 配置元commit/PID/起動時点/全5SHA |
| [runtime/bootstrap.log](runtime/bootstrap.log) | 配置と起動のlog原本 |
| [runtime/launch_once.lock](runtime/launch_once.lock) | launcher一回lock原本 |
| [runtime/process.log](runtime/process.log) | 実load/依存warning/進捗。CRを含む元bytes |
| [runtime/process_exit.json](runtime/process_exit.json) | 親exit0と16.0258秒 |
| [runtime/post_identity.json](runtime/post_identity.json) | 275file不変/重み/GPU/費用の終了後原本 |
| [run/execute_once.lock](run/execute_once.lock) | runner一回lock原本 |
| [run/loaded_tensors.json](run/loaded_tensors.json) | 非学習で読み込んだ全112tensorの照合 |
| [run/run.json](run/run.json) | 4測定/全top10/argmax/同率数/NLL/差と全counter |
| [archive_manifest.json](archive_manifest.json) | 全14member元bytes/SHAとtransport container identity |
| [recovery_receipt.json](recovery_receipt.json) | Jupyter側container hash/sizeと終了後観測 |
| [summary.json](summary.json) | 4測定・実績・診断だけの結論 |
| [content_review.md](content_review.md) | root全4測定の所見と未結論 |
| [verification.json](verification.json) | 回収/全14原本/4forward/前回NLL/重み不変の照合 |
| [README.md](README.md) | 本入口・実結果・全20file地図 |
