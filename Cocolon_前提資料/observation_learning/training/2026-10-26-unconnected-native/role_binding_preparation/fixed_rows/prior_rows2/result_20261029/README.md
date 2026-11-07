# prior rows比較 — 承認済み一回終了、両TOKEN_LIMITで不採用

Mashが提案5c21326cへ「進めていいよ」と明示承認した一回を、同じJupyterへ直接接続して実行した。**保存11446641の非学習1load・追加学習0・BOOK/SHOP各1生成、計326.241692937秒（5分26.24秒）／処理按分$0.025374353895**。最大10分/$0.047内。前回同Pod表示$0.28/h使用、live単価再照会なし。準備CPU4.674842秒、親外CMEE CPU1.625254576秒・回収・保持・保存・通信・税等別。

| 実生成 | 入力token | 出力token | EOS | CMEE | 意味/本人本文 |
|---|---:|---:|---|---|---|
| BOOK | 4152 | 3712cap | なし | TOKEN_LIMIT→REJECT | 不成立 |
| SHOP | 4304 | 3584cap | なし | TOKEN_LIMIT→REJECT | 不成立 |

両意味/本人本文0/2、元receipt replay2件一致。採用snapshot0なので保存再読の対象0、cold成功とは数えない。旧9は再生成せず、履歴FIT9/9を今回へ加算しない。重み全3file・旧176frozen不変、新重み0。今回の候補を**CLOSED_NOT_ADOPTED_NO_RETRY**で閉じ、追加call/更新/次runを行わない。GPUはMashの指示まで稼働保持。

rootは両raw全文を読み、配列への表記変化と、階層/参照の崩れ・反復・spec説明の混入を確認した。[全文読了記録](content_review.md)参照。実際の拒否はfinish優先のTOKEN_LIMITで、静的所見を後段意味検査の実測へ読み替えない。入力priorの表記整合だけではこの2件は成立せず、BOOKは履歴EOS2371からcap未完へ退行。失敗原因全体や4B能力限界は未確定。現2題の追加観測会は不要。

## 単一起動と原本

実行source943ee425は提案からplan status/approvalだけを更新し、runner0dc460a4/CPU13e6c81b/eval8f321412を不変照合した。起動文の改行指定に一度構文エラーがあったが、Python parse前段でdownload/lock/モデル副作用0。起動文の改行だけ訂正し、実GPU launchはPID232075/Unix1793267623.5736284の一回。1load/学習forward0/0更新/2call、各160.811921秒/154.154256秒で180秒内、timeout0、GPU/CMEE exit0。原run statusは当時のRAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEWのまま保持し、回収後の閉鎖をsummary/current planが所有する。

全202member/201payloadのZIP2829165bytes、SHA256 `b69f7cb0b9c6e47a120491d4068aeebb0c6bf58ebd52f5bc1049884cd9d34015` を全CRC/bytes/SHA/厳密pathで照合。173非重みfrozenと3旧重み参照＝176、使用した11446641を含む4重みの完全bytes/SHA、112F32/name/shape/normが前回保存再読込と同一であることもPod外で確認した。[照合](external_verification.json)と[検証source](verify_recovered.py)参照。Download API失敗でも実file到着を確認し、再download0。

[今回の全原本](https://chatgpt.com/library?file_id=libfile_bcb2caa7fdb481918c4a590df598d5e5&account_id=personal)を保存成功、identity適用済み。このZIPはraw/token IDs/CMEE/実行時plan/source/CPU/frozen非重み原本を含む。新重みは作成せず、使用した全4adapterの完全bytesは[既存の重み・原本ZIP](https://chatgpt.com/library?file_id=libfile_9623b67a65588191926a1bb0a0ea5797&account_id=personal)（60053438bytes/248member、SHA71741059ee92e627ea4183186b554d04ffc245ae857c6fd1bf1654217b6498d9）に保持し、今回manifestから正確に参照する。base/optimizer/RNGを含む厳密途中再開checkpointは称さない。[保存receipt](preservation_receipt.json)。

## 全ファイルの責務地図

完全path/bytes/SHA一覧は[file_manifest.json](file_manifest.json)。

| file群 | 責任 |
|---|---|
| README.md / summary.json / content_review.md | 実結果、閉鎖判断、費用、全文読了と判断限界 |
| run.json / before_FT-*.jsonl / loaded_tensors.json | 不変の実run原本、未修復raw/token IDs/usage/finish/identity、112F32表 |
| cmee_diagnosis.json | 実2receipt/replay/採否、snapshot0/cold対象0 |
| runtime_authorized_plan.json / runtime_run_prior_rows2.py | 実行時の承認済みplanと不変runner |
| gpu_launch.json / launch_command.txt / execute_once.lock / launch_checkpoint.json | 実単一起動・PID・初期計数、モデル前構文エラーの区別 |
| prior-rows2-gpu.log/exit / prior-rows2-cmee.log/exit / prior-rows2-launch.log | 原ログと終了code |
| export_prior_rows2.py / archive_manifest.json | Jupyter一回回収sourceと全202memberの索引、既存重みの完全参照 |
| verify_recovered.py / external_verification.json / preservation_receipt.json | CPU読取照合、保存成功と正確なファイルidentity |
| file_manifest.json | このdirectoryの全file索引（self除外） |

root単一writer/executor/judge、補助はread-only。実環境GPT-6 Codex Work、正式Pro/Ultra/human受入れ未実施。通常ModelCandidateSource/receiver/native意味型/三core/公開API/DTO/DB/RN/Render/Supabase・新依存・merge/deploy/lifecycle操作0。STRUCTURE_MAP_DELTA_NONE、primary=BLOCKER_NARROWED、商品0/正式0/3/管理54.50％・candidate_ready=false・automatic_progression=false。
