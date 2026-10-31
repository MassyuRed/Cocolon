# continuation17 — 承認済み一回の実結果・原本地図

2026-10-30 JST。**17更新・保存・非学習再読込・新2生成完了、両TOKEN_LIMIT、意味／本人本文0/2。旧9はNOT_RUN。CLOSED_NOT_ADOPTED_NO_RETRY。** 新7fcca3ceは保全した不採用重みで、商品候補へ進めない。

Mashは提案d2b94c365103c0bdfacd0a7de8daeae67ae727b2に「進めていいよ。」と回答。承認commit3928b9571bc5465998c0c528d207177e212aca03を同Jupyterへ取得し、一回lock・PID381733・既存runner08c7bd3eを確認して起動した。初期11446641、原11messages/encoding、全assistant＋EOS、17順序、LR5e-5、cap、既存CMEEの採用条件を変更しなかった。

処理667.297750292秒（11分7.30秒）、外668.865371947秒、exit1。これは新2の未達を確認して旧9をskipした予定どおりの停止で、時間超過や途中学習失敗ではない。2load／17forward・17update／2generation、各生成180秒以内、全2700秒以内。履歴$0.28/hによる処理按分$0.051900936134。同process内CMEE/coldは按分に含み、準備・回収・保持・保存・通信・税等は別、総支払額ではない。live単価再照会なし。

BOOK3712／SHOP3584token、両EOSなし。既存consumerで両TOKEN_LIMIT→REJECT/semantic_receipt_not_validated、snapshot／本人本文／cold file0、receipt replay2一致。rootは全rawを読了した。[本文レビューと限界](content_review.md)。新2成功時だけ旧9へ進む条件により、旧9の現在の保持成否は未確認であり、履歴FIT9/9と分ける。

## 回収・保存

完全ZIP `cocolon-cont17-weights-originals-20261030.zip` は17009656bytes、208member／207payload、SHA `7cd7f4de5317f1151013413995a6132832a6aa35903037d1610b2ab39cb9baf1`。Jupyterから一回ダウンロードし、全CRC/member/bytes/SHA、実行時source/plan/prepared、17順序、2raw全文SHA/token数、実receipt metadata、adapter3fileと112F32有限性をPod外照合した。完全ZIPは保存ID `libfile_9514b319e18881918ed8a8b963a4fa51`、metadataのname/sizeも読戻し一致。署名付きURLは保存しない。

新adapterは `run/adapter/adapter_model.safetensors`、SHA `7fcca3ce034dfdb9162ae31c3a1bec59c8918762d3da07d58b64f8bdf1220981`。112tensor全変更・有限。初期adapter11446641は不変、既存完全ZIP `libfile_9623b67a65588191926a1bb0a0ea5797`を保持。今回ZIPには全run/runtime/cpu実在file、非重みfrozen source/input、post identityと完全member索引を収める。過去の凍結safetensorsとbase modelは重複収録せず、post_identityに除外path/bytes/hashとモデルrevisionを明示する。今回の新しい完全adapterは収録済み。

GitHubには下表の小原本・判断・索引を同一bytesで配置し、weight binaryは完全ZIPが所有する。`archive_manifest.json`のpathはZIP内の元pathであり、GitHub側の配置と同じとは限らない。`file_manifest.json`はGitHub側の全file/bytes/hash/ownerと、完全ZIPの取得情報を対応付ける。

| file / family | 責務 |
|---|---|
| summary.json、content_review.md | 実件数・費用・停止とroot全文読了、不採用判断、証拠の限界 |
| run/run.json、run/training.jsonl | 終了status/理由、17学習順序・CE・勾配、保存identity/呼出/実時間 |
| run/after_FT-BOOK-AFTER-ANSWER.jsonl、run/after_FT-SHOP-AFTER-ANSWER.jsonl | 未修復raw全文・token IDs・finish/EOS・usage・model/adapter revision |
| run/initial_loaded_tensors.json、run/reloaded_tensors.json | 初期・非学習再読込の各112F32 metadata |
| run/adapter/README.md、run/adapter/adapter_config.json | 新保存adapterの設定・付帯原本。weight本体は完全ZIP |
| run/cmee/diagnosis.json | 実2receipt/metadata/replay/採用判定。snapshot/cold fileは実在しない |
| runtime/plan.json、runtime/runtime_cpu_plan.json | 実行時承認原本と準備時の未承認planを区別して保全 |
| runtime/run_continuation17.py、runtime/prepare_cpu.py | 実行した固定source。後から修正していない |
| runtime/gpu_launch.json、runtime/execute_once.lock | 単一起動PID/source/上限と一回lock |
| runtime/gpu.log、runtime/gpu.exit、runtime/gpu_elapsed.json、runtime/launcher.log | 元GPU log・exit1・外時間、launcher原本。空launcherも保持 |
| runtime/cpu.log、runtime/cpu.exit、runtime/cpu_execution.json | 準備CPU一回の元log/exit/実時間 |
| runtime/export_result.py、verify_recovery.py | 終了後の一回回収sourceと独立CPU回収検証source。model/生成/新CMEE0 |
| archive_manifest.json、post_identity.json、verification.json | 完全ZIP全207payload索引、終了後frozen/初期hash、Pod外CRC/bytes/hash/tensor照合の範囲 |
| preservation_receipt.json、file_manifest.json | 永続保存ID/bytes/hashとGitHub配置・ownerの取得地図 |
| proof.jpg、README.md | 実Jupyter終了/GPU保持画面と本file地図 |

GPUは終了後RTX A5000／1MiB／0％で稼働保持。管理console/API、Stop/restart/delete、新契約0。追加試行・retry・raw修復0。現2題の追加観測会は不要、一般教材十分性と4B能力限界は未確定。通常ModelCandidateSource/receiver/意味型/三core/API/DTO/DB/RN/Render/Supabase/依存/merge/deployの構造差分0、STRUCTURE_MAP_DELTA_NONE。商品0／正式0/3／54.50％、candidate_ready=false、automatic_progression=false。実環境Codex Work、root単一writer/executor/judge、補助read-only、正式Pro/Ultra/human受入れは未実施。
