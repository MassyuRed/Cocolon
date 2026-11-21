# 現行入力19更新一回の実結果 — 2026-10-30 JST

**不採用・一回閉鎖。意味/本人本文0/2、saved/cold0、旧9NOT_RUN。** 19更新・保存・非学習再読・7生成を実行した。新しい追加学習/再生成/受信緩和/次runは行わない。

Mashの具体案承認を[105c08d2](https://github.com/MassyuRed/Cocolon/commit/105c08d231c3fb993f565197b200a5db8ff6c05e)へ固定し、既CPU合格のrunner/prompt/proposalを変えず、Jupyter直結で一回起動。直接の親timeout2690秒＋kill10秒を確認した。実19forward/19optimizer/112tensor変更・adapter保存1・非学習reload1（計2load）、全7EOS/timeout0。新2の実前段だけで進み、BOOK S2停止・SHOP5段完走後受信拒否。原9bと215frozen不変、GPU保持。rootが全7rawを全文読み、read-only補助と照合。不採用の責任・判断はrootが持ち、補助や機械結果をhuman受入れへ換算しない。

| case | 通過と停止 |
|---|---|
| BOOK | S1構文通過。S2の全10claimが11セル（要求10）で実claim_outer_type。CMEE未到達 |
| SHOP | 全5段shape通過・13path結合1候補。実receipt INVALID_FORMAT/candidate_json=null、semantic_receipt_not_validated。静的には全11subject.bindが配列で、最初の型不一致に合致。さらに引用/更新根拠/bind/日本語本文が未成立 |

[全raw・本文の所見](content_review.md)。両S1のJSONが閉じ、alias3が教師一致、引用は前回10/14から各16へ増えたが、教師17/18のscopeは揃わない。局所的な形式変化を意味・商品改善へ数えず、「subjectだけ直せば成功」ともしない。今回の基本不成立を補う観測会は不要。

処理491.35681426001247秒（8分11.36秒）・前回$0.28/hで按分$0.03821664110911208、親外492.6916159699904秒/exit1。最大45分/$0.21内、準備/回収/保持/保存/通信/税等別、現在単価の再照会ではない。GPUは終了後A5000 1MiB/0％、Stop/restart/delete/Runpod管理画面/API0。

元transport ZIP14603727bytes/51member（50payload＋manifest）、SHA1fc5ca54a129485173d6f3a0d7b191aaaf85075c21e21339e011b03d27633712。全memberのCRC/bytes/SHA、実source/承認/全19更新/全7messages/raw/token metadata/actual chain/SHOP派生候補をPod外照合した。新b5e7936dは全112F32有限、元9bから112tensor変更。新重み完全bytesは[追加重みarchive](https://chatgpt.com/library?file_id=libfile_7bc6a0675d708191a4d84f276b3870f3&account_id=personal)（14200265bytes/SHA bf80ac066c57e64b1d4abd358479cb3c7402d6b2b518bc8d71ed4ca1864aa450）に保持し、その他全50元memberは本ディレクトリへ原bytesで展開保存する。archiveに元4B全重みは含まない。移行には固定base revisionと合わせる。元9bは置換せず、新b5eを製品/次の初期値へ自動採用しない。

上位approved_plan.jsonは消費済み閉鎖版。runtime/approved_plan.jsonは実承認時原本で変更しない。proposal/CPU時原本の未承認表記は当時の履歴。回収コードにGPU情報取得のtimeout10秒・例外記録とpartial ZIP保持を付けたが、学習/生成/受信code・capを変更せず、追加model/CMEE実行なし。

商品0・正式0/3・54.50％・candidate_ready=false・automatic_progression=false。STRUCTURE_MAP_DELTA_NONE：通常source/receiver/意味型/三core/API/DB/RN/Render/Supabase/依存/merge/deploy責務不変。実環境Codex Work、root華恋単一writer/executor/judge、補助read-only、正式Pro/Ultra/human authorityを申告しない。

## 全fileの地図

元51memberから大きなadapter binary1だけを上記追加重みarchiveへ保存し、残50memberを下表へ原bytesで保存。追加のroot報告・weights参照・実command写し7fileと、このREADMEを区別する。

| file | 責務 |
|---|---|
| README.md | 本文/全file地図・不採用閉鎖と保存先 |
| [archive_manifest.json](archive_manifest.json) | 元ZIP全50payloadのbytes/SHAと既存215frozen参照 |
| [content_review.md](content_review.md) | root/補助の全7raw・本文所見、実拒否と静的所見の区別 |
| [inputs/cpu_summary.json](inputs/cpu_summary.json) | 事前CPU準備時の照合/identity原本。今回終了後と区別 |
| [inputs/post_identity.json](inputs/post_identity.json) | 事前CPU準備時の照合/identity原本。今回終了後と区別 |
| [inputs/prepared_cpu.json.gz](inputs/prepared_cpu.json.gz) | 不変のencoded19/labels/order/original eval/215frozen（SHA84d2d641） |
| [inputs/train19.jsonl](inputs/train19.jsonl) | 実学習した現10＋不変旧9の全19messages（SHA57292ff2） |
| [run/FT-BOOK-AFTER-ANSWER_stages.json](run/FT-BOOK-AFTER-ANSWER_stages.json) | caseの実前段による段階records原本 |
| [run/FT-SHOP-AFTER-ANSWER_derived_projection.json](run/FT-SHOP-AFTER-ANSWER_derived_projection.json) | SHOP実5段の13pathを機械的に再結合した未採用候補 |
| [run/FT-SHOP-AFTER-ANSWER_stages.json](run/FT-SHOP-AFTER-ANSWER_stages.json) | caseの実前段による段階records原本 |
| [run/adapter/README.md](run/adapter/README.md) | 学習終了時に保存したadapterのmetadata原本 |
| [run/adapter/adapter_config.json](run/adapter/adapter_config.json) | 学習終了時に保存したadapterのmetadata原本 |
| [run/adapter/weights_reference.json](run/adapter/weights_reference.json) | 新adapterの完全bytesを保持する追加重みarchiveへの参照（不採用） |
| [run/cmee/diagnosis.json](run/cmee/diagnosis.json) | BOOK未到達、SHOP実INVALID_FORMAT receipt・意味/本文拒否、saved/coldなし |
| [run/initial_loaded_tensors.json](run/initial_loaded_tensors.json) | 実load/reloadした112F32有限tensor table |
| [run/reloaded_tensors.json](run/reloaded_tensors.json) | 実load/reloadした112F32有限tensor table |
| [run/run.json](run/run.json) | 実承認/source/counter/19更新・2load・7call・停止/費用原本 |
| [run/stage1_FT-BOOK-AFTER-ANSWER.jsonl](run/stage1_FT-BOOK-AFTER-ANSWER.jsonl) | この一回の未修復raw・出力token IDs・EOS/使用量/秒・model/adapter metadata |
| [run/stage1_FT-BOOK-AFTER-ANSWER.jsonl.messages.json](run/stage1_FT-BOOK-AFTER-ANSWER.jsonl.messages.json) | この実生成へ渡したmessages原本 |
| [run/stage1_FT-SHOP-AFTER-ANSWER.jsonl](run/stage1_FT-SHOP-AFTER-ANSWER.jsonl) | この一回の未修復raw・出力token IDs・EOS/使用量/秒・model/adapter metadata |
| [run/stage1_FT-SHOP-AFTER-ANSWER.jsonl.messages.json](run/stage1_FT-SHOP-AFTER-ANSWER.jsonl.messages.json) | この実生成へ渡したmessages原本 |
| [run/stage2_FT-BOOK-AFTER-ANSWER.jsonl](run/stage2_FT-BOOK-AFTER-ANSWER.jsonl) | この一回の未修復raw・出力token IDs・EOS/使用量/秒・model/adapter metadata |
| [run/stage2_FT-BOOK-AFTER-ANSWER.jsonl.messages.json](run/stage2_FT-BOOK-AFTER-ANSWER.jsonl.messages.json) | この実生成へ渡したmessages原本 |
| [run/stage2_FT-SHOP-AFTER-ANSWER.jsonl](run/stage2_FT-SHOP-AFTER-ANSWER.jsonl) | この一回の未修復raw・出力token IDs・EOS/使用量/秒・model/adapter metadata |
| [run/stage2_FT-SHOP-AFTER-ANSWER.jsonl.messages.json](run/stage2_FT-SHOP-AFTER-ANSWER.jsonl.messages.json) | この実生成へ渡したmessages原本 |
| [run/stage3_FT-SHOP-AFTER-ANSWER.jsonl](run/stage3_FT-SHOP-AFTER-ANSWER.jsonl) | この一回の未修復raw・出力token IDs・EOS/使用量/秒・model/adapter metadata |
| [run/stage3_FT-SHOP-AFTER-ANSWER.jsonl.messages.json](run/stage3_FT-SHOP-AFTER-ANSWER.jsonl.messages.json) | この実生成へ渡したmessages原本 |
| [run/stage4_FT-SHOP-AFTER-ANSWER.jsonl](run/stage4_FT-SHOP-AFTER-ANSWER.jsonl) | この一回の未修復raw・出力token IDs・EOS/使用量/秒・model/adapter metadata |
| [run/stage4_FT-SHOP-AFTER-ANSWER.jsonl.messages.json](run/stage4_FT-SHOP-AFTER-ANSWER.jsonl.messages.json) | この実生成へ渡したmessages原本 |
| [run/stage5_FT-SHOP-AFTER-ANSWER.jsonl](run/stage5_FT-SHOP-AFTER-ANSWER.jsonl) | この一回の未修復raw・出力token IDs・EOS/使用量/秒・model/adapter metadata |
| [run/stage5_FT-SHOP-AFTER-ANSWER.jsonl.messages.json](run/stage5_FT-SHOP-AFTER-ANSWER.jsonl.messages.json) | この実生成へ渡したmessages原本 |
| [run/training.jsonl](run/training.jsonl) | 19更新の順序・loss/gradient・完全assistant+EOS CE原本 |
| [runtime/README.md](runtime/README.md) | CPU準備時に保持した説明/起動/時間/logの原本。GPUの今回結果ではない |
| [runtime/approved_plan.json](runtime/approved_plan.json) | 今回承認時の不変原本（7bb865b9）。上位approved_planの閉鎖版と区別 |
| [runtime/bootstrap.json](runtime/bootstrap.json) | 今回承認source105c08d2を取得し一回launcherを起動した記録 |
| [runtime/bootstrap.log](runtime/bootstrap.log) | 今回承認source105c08d2を取得し一回launcherを起動した記録 |
| [runtime/cpu.log](runtime/cpu.log) | CPU準備時に保持した説明/起動/時間/logの原本。GPUの今回結果ではない |
| [runtime/execute_once.lock](runtime/execute_once.lock) | 今回のexclusive一回lock原本 |
| [runtime/execution.json](runtime/execution.json) | CPU準備時に保持した説明/起動/時間/logの原本。GPUの今回結果ではない |
| [runtime/export_aligned19.py](runtime/export_aligned19.py) | 終了後の全原本回収source。GPU telemetry失敗でも回収を続ける |
| [runtime/export_command.sh](runtime/export_command.sh) | 実際にJupyterへ渡した起動/回収コマンドの原文写し（元ZIP後の追加保存） |
| [runtime/gpu.exit](runtime/gpu.exit) | 今回GPU実行log/exit1/親外492.6916159699904秒 |
| [runtime/gpu.log](runtime/gpu.log) | 今回GPU実行log/exit1/親外492.6916159699904秒 |
| [runtime/gpu_elapsed.json](runtime/gpu_elapsed.json) | 今回GPU実行log/exit1/親外492.6916159699904秒 |
| [runtime/gpu_launch.json](runtime/gpu_launch.json) | direct timeout親2690秒＋kill10秒・承認hash・実引数/PID |
| [runtime/launch_aligned19_once.py](runtime/launch_aligned19_once.py) | exclusive lock・上限付き一回起動source |
| [runtime/launch_command.sh](runtime/launch_command.sh) | 実際にJupyterへ渡した起動/回収コマンドの原文写し（元ZIP後の追加保存） |
| [runtime/post_identity.json](runtime/post_identity.json) | 終了後215frozen/初期9b不変・A5000保持の実確認 |
| [runtime/prepare_aligned19.py](runtime/prepare_aligned19.py) | 実CPU準備sourceの不変写し |
| [runtime/prompt_source_index.py](runtime/prompt_source_index.py) | 学習と推論で同じ現builder・actual chain |
| [runtime/proposal.json](runtime/proposal.json) | CPU準備時から不変の具体案（bcb4459e） |
| [runtime/run_aligned19_once.py](runtime/run_aligned19_once.py) | 19更新/保存非学習再読/新2→条件付き旧9の実source |
| [source/frozen_consume_stage5.py](source/frozen_consume_stage5.py) | 不変の段階shape/13path機械結合/source identity検査 |
| [source/original_eval11.json](source/original_eval11.json) | 不変の元11入力/教師と評価messages |
| [source/original_train11.jsonl](source/original_train11.jsonl) | 不変の元11入力/教師と評価messages |
| [summary.json](summary.json) | 19更新・2load・7生成・0/2・費用・閉鎖の集約 |
| [verification.json](verification.json) | Pod外CRC/全bytes/SHA・実messages/raw/token metadata/actual chain/派生候補の同一性 |
| [weight_verification.json](weight_verification.json) | 新重み全112F32の有限性と旧9bから112tensor変更の全表 |
