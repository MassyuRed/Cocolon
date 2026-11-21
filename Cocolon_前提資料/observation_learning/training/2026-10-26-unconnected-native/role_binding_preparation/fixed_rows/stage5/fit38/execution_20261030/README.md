# fit38実結果 — 38更新・3時点適合測定・新2件不成立

状態：**一回実行終了・不採用閉鎖・再試行なし**。Mashは保存b5eの隔離実験初期値用途、38更新・適合測定・保存再読→新2件→CMEE/保存再読→全成功時のみ旧9、最大45分/$0.21按分（準備等別）を明示承認。承認sourceは`5a333d68ed136483ae910a040a7fce4308ff3f13`、proposal SHA51573dba/実承認SHA5ea2d942。上位[approved_plan](../approved_plan.json)だけを消費済み閉鎖版とし、runtime承認原本は改変しない。

| 実績 | 結果 |
| --- | --- |
| 学習・再読 | 同19行×2、38更新/38 forward、全38有限loss/gradient、2model load、112有限F32を保存・非学習reload |
| 教師条件測定 | 0/19/38保存再読後の各19行、57非学習forward完了。NLLは診断のみ |
| 実生成 | BOOK3段/SHOP5段の8call。7EOS、SHOP S5のみ512token/length/EOSなし |
| 新2の意味/本人本文 | 0/2。両件stage不成立で13path結合/新CMEE receipt/保存/cold呼出し0 |
| 旧9 | 新2全成功の条件不成立によりNOT_RUN。維持を確認したとは言わない |
| 処理 | 928.9340299230535秒＝15分28.93秒、前回$0.28/hによる按分$0.07225042454957083、親外930.2798354179831秒/exit1 |
| 費用の境界 | 45分/$0.21内。現在単価は再照会せず、準備/回収/保持/保存/通信/税等は別 |
| 原本回収 | 56member/55payload、14631408bytes、SHA3916e2e72b1ea8e1bd4261932362ffd4f37838a292c3a42aebf224297589302a。全CRC/bytes/SHAをPod外照合 |
| 新重み | SHAad8b89e8974df9bfe7e804b8f67bbaac59e6cbb37042c3254fb58ffb64230d0a、112/112tensor変更/3,833,856params/F32有限 |
| 不変・保持 | 266frozen/元b5e/config不変、A5000 1MiB/0％で稼働保持。Runpod管理console/API/Stop/restart/delete0 |

| token加重NLL | 開始前 | 19更新後 | 38更新・保存再読後 |
| --- | ---: | ---: | ---: |
| 新10区間 | 0.0968247931 | 0.0860945479 | 0.0560160420 |
| 旧9件 | 0.0010858869 | 0.0008432690 | 0.0011822046 |
| 全19行 | 0.0230753714 | 0.0204239364 | 0.0137765392 |

BOOK/SHOP S5は最終0.338296/0.482219まで下がったが自由生成は未成立。BOOK S3は最終NLLが開始より悪化。平均fit低下を全行改善・自由生成/意味/本文/製品品質の成功へ換算しない。

rootは[全8実rawの全文所見](content_review.md)を作成し、独立read-only照合と一致。両S1は教師JSON値完全一致で17/18引用、BOOK S2とSHOP S3も教師一致。BOOK S3はJSON rootを早く閉じてExtra data、第8関係/重複IDも出した。SHOP S2はsubject型が直ったが否定scope/時点をなお落とし、S4は関係の更新根拠を欠く。S5は日本語本人本文でなく更新行を反復、途中から既にJSON不正で上限打切り。cap延長だけで解決する根拠はない。

全8実chainが自分の実前段値と一致。BOOK S1/S2/S3とSHOP S1/S2は学習時gold prefixと完全一致しており、初破綻を悪い前段だけでは説明できない。SHOP後段にはgold前段との差がある。既存の正しい教師があり、今回の基本不成立に追加観測会不要。raw修復/失敗raw教師化/新教師/prompt/receiver/意味型/cap変更、追加epoch/再試行/延長/自動次run0。新ad8bを製品/次初期値へ自動採用しない。

[追加重みZIP](https://chatgpt.com/library?file_id=libfile_e2b0cd55d6c08191ba3a9ab1d6da4386&account_id=personal)は4member/14201522bytes/SHA06c25a9918ade9a14bb06bb03b4b5e37dbd32a119ebd49bbba8b0d8c5ccb2535。元adapter3fileを完全保存、元4B全重みとoptimizer/RNG再開状態は含まない。他の元55memberはGitHubへ原bytes展開。元transport ZIPは回収照合用で、新しいsource fallback ZIPとして配布しない。

通常受口/意味型/三core/API/DB/RN/Render/Supabase/依存/merge/deploy差分0、STRUCTURE_MAP_DELTA_NONE。root華恋が単一writer/executor/judge、補助read-only、実環境Codex Workで正式Pro/Ultra/human authorityを申告しない。商品0・正式0/3・54.50％・candidate_ready/automatic_progression=false。

## 全64fileの地図

元56memberのうちadapter binary1は完全bytesを追加重みZIPに保持し、同じ位置のweights_reference.jsonから解決する。下表はGitHubへ保存する全64file。CPU事前原本の[全20file地図](../result_20261030/README.md)と[pack source地図](../README.md)も保持する。

| file | 責務 |
| --- | --- |
| [README.md](README.md) | 現在の実結果・判断・全64file地図 |
| [archive_manifest.json](archive_manifest.json) | 元55payloadのpath/bytes/SHAと266frozen参照。binary1はweights参照で回収 |
| [chain_and_teacher_read.json](chain_and_teacher_read.json) | 全8actual-only prompt chain/教師JSON/学習時gold prefixの静的照合 |
| [content_review.md](content_review.md) | root全8rawの全文所見・教師/実前段の差・本人本文未成立 |
| [gpu_export_command.sh](gpu_export_command.sh) | Jupyterで実行した上限付き一回起動/終了後回収commandの写し |
| [gpu_launch_command.sh](gpu_launch_command.sh) | Jupyterで実行した上限付き一回起動/終了後回収commandの写し |
| [inputs/cpu_summary.json](inputs/cpu_summary.json) | CPUで準備済みの不変encoded19/train19/summary/installed source/事前identity |
| [inputs/installed_loss_source.json](inputs/installed_loss_source.json) | CPUで準備済みの不変encoded19/train19/summary/installed source/事前identity |
| [inputs/post_identity.json](inputs/post_identity.json) | CPUで準備済みの不変encoded19/train19/summary/installed source/事前identity |
| [inputs/prepared_cpu.json.gz](inputs/prepared_cpu.json.gz) | CPUで準備済みの不変encoded19/train19/summary/installed source/事前identity |
| [inputs/train19.jsonl](inputs/train19.jsonl) | CPUで準備済みの不変encoded19/train19/summary/installed source/事前identity |
| [run/FT-BOOK-AFTER-ANSWER_stages.json](run/FT-BOOK-AFTER-ANSWER_stages.json) | 該当題の全実messages/raw/段順を束ねた原本 |
| [run/FT-SHOP-AFTER-ANSWER_stages.json](run/FT-SHOP-AFTER-ANSWER_stages.json) | 該当題の全実messages/raw/段順を束ねた原本 |
| [run/adapter/README.md](run/adapter/README.md) | 新追加重みの元model card/config完全bytes |
| [run/adapter/adapter_config.json](run/adapter/adapter_config.json) | 新追加重みの元model card/config完全bytes |
| [run/adapter/weights_reference.json](run/adapter/weights_reference.json) | 元adapter binaryの完全保存先・新ZIP/元member SHA。採用/単独base保持ではない |
| [run/cmee/diagnosis.json](run/cmee/diagnosis.json) | 両stage失敗/新CMEE0/意味本文0/2/coldなし。受信却下ではない |
| [run/initial_loaded_tensors.json](run/initial_loaded_tensors.json) | 実初期/非学習再読の112tensor name/shape/dtype/finite/norm |
| [run/nll_after19_updates.jsonl](run/nll_after19_updates.jsonl) | 同19行の該当checkpointでの非学習NLL原本 |
| [run/nll_after38_saved_reload.jsonl](run/nll_after38_saved_reload.jsonl) | 同19行の該当checkpointでの非学習NLL原本 |
| [run/nll_before_updates.jsonl](run/nll_before_updates.jsonl) | 同19行の該当checkpointでの非学習NLL原本 |
| [run/reloaded_tensors.json](run/reloaded_tensors.json) | 実初期/非学習再読の112tensor name/shape/dtype/finite/norm |
| [run/run.json](run/run.json) | 全上限counter・3測定・8生成・失敗理由・重み/identity/処理時間 |
| [run/stage1_FT-BOOK-AFTER-ANSWER.jsonl](run/stage1_FT-BOOK-AFTER-ANSWER.jsonl) | 該当段の実raw全文/token IDs/usage/EOS/時間/生成重みSHA |
| [run/stage1_FT-BOOK-AFTER-ANSWER.jsonl.messages.json](run/stage1_FT-BOOK-AFTER-ANSWER.jsonl.messages.json) | 該当段へ実際に渡したmessages原本 |
| [run/stage1_FT-SHOP-AFTER-ANSWER.jsonl](run/stage1_FT-SHOP-AFTER-ANSWER.jsonl) | 該当段の実raw全文/token IDs/usage/EOS/時間/生成重みSHA |
| [run/stage1_FT-SHOP-AFTER-ANSWER.jsonl.messages.json](run/stage1_FT-SHOP-AFTER-ANSWER.jsonl.messages.json) | 該当段へ実際に渡したmessages原本 |
| [run/stage2_FT-BOOK-AFTER-ANSWER.jsonl](run/stage2_FT-BOOK-AFTER-ANSWER.jsonl) | 該当段の実raw全文/token IDs/usage/EOS/時間/生成重みSHA |
| [run/stage2_FT-BOOK-AFTER-ANSWER.jsonl.messages.json](run/stage2_FT-BOOK-AFTER-ANSWER.jsonl.messages.json) | 該当段へ実際に渡したmessages原本 |
| [run/stage2_FT-SHOP-AFTER-ANSWER.jsonl](run/stage2_FT-SHOP-AFTER-ANSWER.jsonl) | 該当段の実raw全文/token IDs/usage/EOS/時間/生成重みSHA |
| [run/stage2_FT-SHOP-AFTER-ANSWER.jsonl.messages.json](run/stage2_FT-SHOP-AFTER-ANSWER.jsonl.messages.json) | 該当段へ実際に渡したmessages原本 |
| [run/stage3_FT-BOOK-AFTER-ANSWER.jsonl](run/stage3_FT-BOOK-AFTER-ANSWER.jsonl) | 該当段の実raw全文/token IDs/usage/EOS/時間/生成重みSHA |
| [run/stage3_FT-BOOK-AFTER-ANSWER.jsonl.messages.json](run/stage3_FT-BOOK-AFTER-ANSWER.jsonl.messages.json) | 該当段へ実際に渡したmessages原本 |
| [run/stage3_FT-SHOP-AFTER-ANSWER.jsonl](run/stage3_FT-SHOP-AFTER-ANSWER.jsonl) | 該当段の実raw全文/token IDs/usage/EOS/時間/生成重みSHA |
| [run/stage3_FT-SHOP-AFTER-ANSWER.jsonl.messages.json](run/stage3_FT-SHOP-AFTER-ANSWER.jsonl.messages.json) | 該当段へ実際に渡したmessages原本 |
| [run/stage4_FT-SHOP-AFTER-ANSWER.jsonl](run/stage4_FT-SHOP-AFTER-ANSWER.jsonl) | 該当段の実raw全文/token IDs/usage/EOS/時間/生成重みSHA |
| [run/stage4_FT-SHOP-AFTER-ANSWER.jsonl.messages.json](run/stage4_FT-SHOP-AFTER-ANSWER.jsonl.messages.json) | 該当段へ実際に渡したmessages原本 |
| [run/stage5_FT-SHOP-AFTER-ANSWER.jsonl](run/stage5_FT-SHOP-AFTER-ANSWER.jsonl) | 該当段の実raw全文/token IDs/usage/EOS/時間/生成重みSHA |
| [run/stage5_FT-SHOP-AFTER-ANSWER.jsonl.messages.json](run/stage5_FT-SHOP-AFTER-ANSWER.jsonl.messages.json) | 該当段へ実際に渡したmessages原本 |
| [run/training.jsonl](run/training.jsonl) | 38更新の指定順・完全CE loss/gradient/token数 |
| [runtime/README.md](runtime/README.md) | Podにあった旧CPU準備時の説明原本。現在地は本README |
| [runtime/approved_plan.json](runtime/approved_plan.json) | 実行に使った未閉鎖の承認原本SHA5ea2d942を不変保持。上位planは閉鎖 |
| [runtime/bootstrap.json](runtime/bootstrap.json) | 実行packの元source/proposal/承認/launch/log/exit/elapsed/lock/終了後identity |
| [runtime/bootstrap.log](runtime/bootstrap.log) | 実行packの元source/proposal/承認/launch/log/exit/elapsed/lock/終了後identity |
| [runtime/cpu.log](runtime/cpu.log) | 実行packの元source/proposal/承認/launch/log/exit/elapsed/lock/終了後identity |
| [runtime/execute_once.lock](runtime/execute_once.lock) | 実行packの元source/proposal/承認/launch/log/exit/elapsed/lock/終了後identity |
| [runtime/execution.json](runtime/execution.json) | 実行packの元source/proposal/承認/launch/log/exit/elapsed/lock/終了後identity |
| [runtime/export_fit38.py](runtime/export_fit38.py) | 実行packの元source/proposal/承認/launch/log/exit/elapsed/lock/終了後identity |
| [runtime/gpu.exit](runtime/gpu.exit) | 実行packの元source/proposal/承認/launch/log/exit/elapsed/lock/終了後identity |
| [runtime/gpu.log](runtime/gpu.log) | 実行packの元source/proposal/承認/launch/log/exit/elapsed/lock/終了後identity |
| [runtime/gpu_elapsed.json](runtime/gpu_elapsed.json) | 実行packの元source/proposal/承認/launch/log/exit/elapsed/lock/終了後identity |
| [runtime/gpu_launch.json](runtime/gpu_launch.json) | 実行packの元source/proposal/承認/launch/log/exit/elapsed/lock/終了後identity |
| [runtime/launch_fit38_once.py](runtime/launch_fit38_once.py) | 実行packの元source/proposal/承認/launch/log/exit/elapsed/lock/終了後identity |
| [runtime/post_identity.json](runtime/post_identity.json) | 実行packの元source/proposal/承認/launch/log/exit/elapsed/lock/終了後identity |
| [runtime/prepare_fit38.py](runtime/prepare_fit38.py) | 実行packの元source/proposal/承認/launch/log/exit/elapsed/lock/終了後identity |
| [runtime/prompt_source_index.py](runtime/prompt_source_index.py) | 実行packの元source/proposal/承認/launch/log/exit/elapsed/lock/終了後identity |
| [runtime/proposal.json](runtime/proposal.json) | 実行packの元source/proposal/承認/launch/log/exit/elapsed/lock/終了後identity |
| [runtime/run_fit38_once.py](runtime/run_fit38_once.py) | 実行packの元source/proposal/承認/launch/log/exit/elapsed/lock/終了後identity |
| [source/frozen_consume_stage5.py](source/frozen_consume_stage5.py) | 凍結した旧consumer/元11教師/元11評価の原bytes |
| [source/original_eval11.json](source/original_eval11.json) | 凍結した旧consumer/元11教師/元11評価の原bytes |
| [source/original_train11.jsonl](source/original_train11.jsonl) | 凍結した旧consumer/元11教師/元11評価の原bytes |
| [summary.json](summary.json) | 承認消費/計数/0-19-38適合/費用/判定/保全の要約 |
| [verification.json](verification.json) | 全56member CRC/bytes/SHA・38順/3測定/token/hash/112有限F32照合 |
| [weights_archive_verification.json](weights_archive_verification.json) | 新追加重みZIP4memberのCRC/完全bytes/SHA記録 |
