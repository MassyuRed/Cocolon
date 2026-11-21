# focus29一回実結果 — 29更新完了、新2件本文不成立・不採用閉鎖

2026-10-30 JST。Mash承認の最大45分/$0.21按分（準備/回収/保持等別）・再試行なしの一回。実source/承認commit `923518fd1c08a0a46faf1c4ee8fc9a866d96edf8`、実承認SHA7b502e9b。先行するブラウザ進捗確認の拒否後も同じバックグラウンドrunが進み、17:54:29.383〜18:07:35.756 JSTに終了した。後続の明示的な同Jupyter再接続/状態確認/原本回収の許可で、終了/exitを確認し、既存exporterで回収した。再起動/再実行は0。

29/29更新、2load、保存非学習再読、同19NLL一回、実前段による新2件×5段=10生成・全10EOSを完了。両件S5はJSONとして完結したがprose rowの形が不成立（BOOK2cell/SHOP1cell、必要4cell）で`prose_type`。新CMEE/保存/cold呼出し0、意味/本人本文0/2、旧9は新2全成功条件不成立でNOT_RUN。`STOPPED_NOT_ADOPTED_NO_RETRY`、exit1。全rawのroot読取と独立read-only照合は[本文判断](content_review.md)。

| token加重NLL | 同ad8b開始値（既存記録） | 29更新・保存再読後 |
| --- | ---: | ---: |
| 新10行 | 0.0560160420 | 0.0343684359 |
| 旧9行 | 0.0011822046 | 0.0006581820 |
| 全19行 | 0.0137765392 | 0.0084008139 |

SHOP S1/S3は悪化し、全行改善ではない。旧9自由生成維持は未評価。NLL低下を意味/自然本文/商品合格へ換算しない。BOOK S2〜4の教師JSON一致も、S1の誤った引用scopeを参照するため意味成立ではない。SHOPの未宣言引用、更新割当、両S5本文の問題を残す。

処理786.372730217秒、前回$0.28/hで按分$0.06116232346（約$0.0612）。親787.706529139秒。現在単価未再照会、準備/回収/保持/保存/通信/税等別。45分/$0.21内。回収時に298frozen/保存ad8b/config不変、A5000 1MiB/0％で稼働保持。Runpod管理console/API/Stop/restart/delete0。

全原本ZIP55member/14665160bytes/SHA `117dab424a63e67d4cadeb4900cbe64b911220e5d34188acbcc7a27dd8d1b13b` をJupyterから直接回収。CRC/全元bytes/SHA/実source・承認/29順/19NLL/全10chainをPod外照合。元binary重み1は下記へ完全保管、他54元memberはGitHubへ原bytes展開（gpu.logのCRも保持）。

[追加重みZIP](https://chatgpt.com/library?file_id=libfile_9f058918928c81919765b7b5e9248a20&account_id=personal)は4member/14208416bytes/SHA `159ee10709c209f09c5b70d783474a9bf2ed08f84b679db89d719199cf374f25`。新ed298856は112有限F32/3,833,856params、実runは全112変更を記録。追加重み/config/model card/独立binary検査のみで、元4B全重み/optimizer/RNG状態は含まない。製品採用や厳密な途中再開ではない。

この一回の承認は消費済み・不採用閉鎖、再試行/次run/初期値自動採用0。既存の正しい教師があり、基本不成立を補う観測会は不要。通常受口/意味型/三core/API/DB/RN/Render/Supabase/依存/merge/deploy変更0、STRUCTURE_MAP_DELTA_NONE。商品0・正式0/3・54.50％・candidate_ready/automatic_progression=false。

## 全66file地図

| file | 責務 |
| --- | --- |
| README.md | 本実結果・判断境界・全file地図 |
| adapter_weights_verification.json | 独立binary読取による112有限F32/shape/各tensor SHA |
| archive_manifest.json | 全54元payloadのbytes/SHA/既存298frozen/固定base identity |
| chain_and_teacher_read.json | 実前段chain・教師messages/JSON値との全10段比較 |
| content_review.md | root全10rawの本文・教師差・未成立判断 |
| inputs/cpu_summary.json | 事前19行不変/29順/298固定とCPU全0 |
| inputs/installed_loss_source.json | 実installed model/loss source証拠 |
| inputs/prepared_cpu.json.gz | 実encoded19/固定298SHA/29順の原binary |
| inputs/train19.jsonl | 実使用した不変19教師 |
| literal_source_checks.json | 全33引用の元source文字列照合。意味成立と区別 |
| nll_comparison.json | 同ad8b既存開始値と保存再読後19行NLLの比較 |
| recovery_actions.json | 実一回起動と回収操作・再接続明示許可・再実行0 |
| recovery_receipt.json | PodでのZIP bytes/SHA/member/終了後identity |
| recovery_verification_source.py | 回収後CPU照合の実source。モデル実行なし |
| run/FT-BOOK-AFTER-ANSWER_stages.json | 当該題の実5段messages/raw/token/実前段記録 |
| run/FT-SHOP-AFTER-ANSWER_stages.json | 当該題の実5段messages/raw/token/実前段記録 |
| run/adapter/README.md | 保存adapterに同梱された元model card |
| run/adapter/adapter_config.json | 保存追加重みのLoRA設定 |
| run/adapter/weights_archive.json | 追加重みの完全保存先/bytes/SHA/元base非同梱・非採用境界 |
| run/cmee/diagnosis.json | S5型検査で停止した新2（結合・CMEE前）・CMEE0/saved-cold0 |
| run/initial_loaded_tensors.json | ad8b初期読込112tensor表 |
| run/nll_after29_saved_reload.jsonl | 保存非学習再読後の同19行NLL一回 |
| run/reloaded_tensors.json | 新保存重み非学習再読112tensor表 |
| run/run.json | 実counter/19NLL/全10call/状態/理由/費用/重みidentity |
| run/stage1_FT-BOOK-AFTER-ANSWER.jsonl | 当該一回生成raw/output IDs/metadata/終了理由 |
| run/stage1_FT-BOOK-AFTER-ANSWER.jsonl.messages.json | 当該一回生成へ渡した全messages原本 |
| run/stage1_FT-SHOP-AFTER-ANSWER.jsonl | 当該一回生成raw/output IDs/metadata/終了理由 |
| run/stage1_FT-SHOP-AFTER-ANSWER.jsonl.messages.json | 当該一回生成へ渡した全messages原本 |
| run/stage2_FT-BOOK-AFTER-ANSWER.jsonl | 当該一回生成raw/output IDs/metadata/終了理由 |
| run/stage2_FT-BOOK-AFTER-ANSWER.jsonl.messages.json | 当該一回生成へ渡した全messages原本 |
| run/stage2_FT-SHOP-AFTER-ANSWER.jsonl | 当該一回生成raw/output IDs/metadata/終了理由 |
| run/stage2_FT-SHOP-AFTER-ANSWER.jsonl.messages.json | 当該一回生成へ渡した全messages原本 |
| run/stage3_FT-BOOK-AFTER-ANSWER.jsonl | 当該一回生成raw/output IDs/metadata/終了理由 |
| run/stage3_FT-BOOK-AFTER-ANSWER.jsonl.messages.json | 当該一回生成へ渡した全messages原本 |
| run/stage3_FT-SHOP-AFTER-ANSWER.jsonl | 当該一回生成raw/output IDs/metadata/終了理由 |
| run/stage3_FT-SHOP-AFTER-ANSWER.jsonl.messages.json | 当該一回生成へ渡した全messages原本 |
| run/stage4_FT-BOOK-AFTER-ANSWER.jsonl | 当該一回生成raw/output IDs/metadata/終了理由 |
| run/stage4_FT-BOOK-AFTER-ANSWER.jsonl.messages.json | 当該一回生成へ渡した全messages原本 |
| run/stage4_FT-SHOP-AFTER-ANSWER.jsonl | 当該一回生成raw/output IDs/metadata/終了理由 |
| run/stage4_FT-SHOP-AFTER-ANSWER.jsonl.messages.json | 当該一回生成へ渡した全messages原本 |
| run/stage5_FT-BOOK-AFTER-ANSWER.jsonl | 当該一回生成raw/output IDs/metadata/終了理由 |
| run/stage5_FT-BOOK-AFTER-ANSWER.jsonl.messages.json | 当該一回生成へ渡した全messages原本 |
| run/stage5_FT-SHOP-AFTER-ANSWER.jsonl | 当該一回生成raw/output IDs/metadata/終了理由 |
| run/stage5_FT-SHOP-AFTER-ANSWER.jsonl.messages.json | 当該一回生成へ渡した全messages原本 |
| run/training.jsonl | 指定29更新の順/loss/gradient/target token |
| runtime/approved_plan.json | SHA7b502e9bの実行時Mash承認原本。消費済み上位版と分離 |
| runtime/cpu.log | 事前CPU原stdout |
| runtime/cpu_execution.json | 事前CPU実source/時間/exit0 |
| runtime/execute_once.lock | 一回起動のexclusive lock原本 |
| runtime/export_focus29.py | 実行packの固定source（役割は上位入口を参照） |
| runtime/gpu.exit | 実子終了code1 |
| runtime/gpu.log | 全stdout/stderr原bytes。CRを保持 |
| runtime/gpu_elapsed.json | 親787.706529秒/exit1/2700秒上限 |
| runtime/gpu_launch.json | timeout実command/PID/承認hash |
| runtime/launch_focus29_once.py | 実行packの固定source（役割は上位入口を参照） |
| runtime/launch_parent.log | 親launcher stdout/stderr原本（空file） |
| runtime/post_identity.json | 既存298/ad8b/config不変・A5000保持状態 |
| runtime/prepare_focus29.py | 実行packの固定source（役割は上位入口を参照） |
| runtime/prompt_source_index.py | 実行packの固定source（役割は上位入口を参照） |
| runtime/proposal.json | 実行時の29更新/最大45分・$0.21按分案 |
| runtime/run_focus29_once.py | 実行packの固定source（役割は上位入口を参照） |
| source/frozen_consume_stage5.py | 不変の既存5段結合/評価境界source |
| source/original_eval11.json | 元11評価入力原本 |
| source/original_train11.jsonl | 元11教師原本 |
| summary.json | 計算/評価/費用/保存/閉鎖の要約 |
| verification.json | CRC/全bytes/SHA/実承認/source/29順/19NLL/chain/保存の照合 |
