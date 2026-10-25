# 4Bの引用選択とCMEEの位置計算 — 一回18更新の実結果

状態：**接続実装済み・18更新/FIT9完了。意味9/9・本文6/9、条件付き2件保存再読はcall0で終了。** 2026-10-25 JST。

Mashは「接続実装・18更新・全9件成功時の2件保存再読」全体へ「進めていいよ」と明示承認。[全実結果](../../trials/2026-10-25-quote-address-fit18/README.md)を現在の終了原本とする。新GPU試行や第三の自動retryを、この終了planから始めない。

[承認仕様](../../../designs/cmee/v1/01_shared_kernel_and_runtime_contracts.md#cmee-quote-address-offline-proposal)に従い、API[4002b457](https://github.com/MassyuRed/mashos-api/commit/4002b4577838d1ed6671278a19585b61e7ccd10e)の既存preparation/model_candidate_sourceと新testへ明示private quote形式を実装。旧数値形式を既定に保持し、4Bが選んだsource/field/完全引用からCMEEが一意のscalar位置だけを計算する。原rawは新形式のまま保持、candidate_jsonだけnativeへcompileし、意味採用時もrawから同一receiptを再導出する。空/欠落/複数一致/overlap/foreign source/余剰field/形式混在を拒否する。既存意味採用・独立本文reader・公開API/DTO/DB/RN不変。

限定CPUは重複除外197成功。初回195成功、SQL中断2variant追加時32成功/2失敗は初回意味保存と回答更新DTOのbooleanを混同したtest期待で、保存意味IDの存在/不変を確認する期待へ修正し、該当3SQLを再検査して成功した。反復を件数へ加算しない。合成教師9/9とconsumer smoke9/9は実モデル成功件数へ数えない。詳細cpu_validation.json。

固定source1a34c968/API4002b457で実tokenizer9行を確認（maxprompt5045/assistantEOS2339、context8192内、切捨て0）。開始未採用affea8a7、新AdamW/LR5e-5、chair6各1＋daily3各4、assistant全文JSON＋EOSの18更新をPID607814で一回実行。保存/32F32有限/非学習reload/FIT9を1081.492473秒で完了した。途中Work接続断は同じJupyterへ復旧、trainer/モデルの再起動0。

| 実FIT | 意味採用 | 本文 | その他 |
|---|---:|---:|---|
| chair6 | 6/6 | 6/6 | 初回ASK3、訂正各3更新/問いなしを維持 |
| daily3 | 3/3 | 0/3 | 全3 model_surface_not_validated |
| 合計 | 9/9 | 6/9 | 全9の意味＋本文成功条件に未到達 |

daily3のparsed packetは教師とreceptionだけが異なる。01は「あったかいものを食べて、少し落ち着いたのですね。」、02/03は「…少し落ち着けたのですね。」。教師の短い反応「…少し落ち着けてよかったです。」へ届かない。引用・native意味採用は今回全3成功したが、原文の言い直しでは本文を採用しない境界を維持する。全9成功条件に未達のためrun_quote_address_holdout.py/eval_fixture.jsonは未使用、eval_plan未作成、後段新model call/実serviceSQL0。追加更新・同要求再call・LR探索・raw補修・reader緩和0でこの有限試行を閉じる。

新adapter138b9ff7e5b7df59e6da80126a52b309edf9c22a9a860f2c165189a9e453c102を含む保存直後archive41bea5a3…/3,472,720bytes/16member（15検査対象）をPod外照合し、[重みを保管](https://chatgpt.com/library?file_id=libfile_ae60b41c293c81919a5d52aeba59f86c&account_id=personal)。archive内runはFIT前gen0。完了証拠archive b053dbcf…/6,963,640bytes/19member（18検査対象）もPod外size/hash照合済み。重み・32tensor・原raw/consumer/学習/NLL/元runnerを失わず保持する。base全重み/optimizer/RNGは含まず、採用重みへ昇格していない。

| file | 所有する事実 |
|---|---|
| sft_examples.jsonl / train_messages.jsonl | 実行した固定9教師。chair6は旧行bytes不変、daily3はcandidate/本文/根拠順不変のquote投影 |
| dataset_manifest.json / plan.json | source/data hashと承認済み一回18更新/FIT9の凍結条件。planは履歴として保持、再実行しない |
| run_quote_address_fit.py / consume_quote_fit_raw.py | 実行した全文loss/reload/FITと、無補修rawのnative採否 |
| cpu_connection_results.json / cpu_validation.json / cpu_tokenization_results.json | 合成接続、CPU197、実9行tokenizer。実モデルFITと区別 |
| weights_verification.json / runtime_checkpoint.json | 早期重み保全と最終終了/後段未実施への再開導線 |
| run_quote_address_holdout.py / eval_fixture.json | 条件未成立で未使用の別identity2初回用。eval_planなし |
| train_messages.proposed.jsonl / plan.proposed.json / cpu_feasibility.json | 実装承認前の案/一意性78根拠/可逆性の履歴。実行しない |

実環境Codex Work/GPT-6、root華恋が単一実行/統合/反映owner。別文脈agent2枠は実source/全結果のread-only意見で、独立Pro/Ultra/human受入れではない。前回意味7/9→今回9/9、本文6/9のまま。primary=BLOCKER_NARROWED、限定TECHNICAL_CREDITはprivate接続/原raw再導出のCPU検証までで、一般品質/商品合格へ換算しない。STRUCTURE_MAP_DELTA_PRESENTは承認後private wire実装、今回終了記録の追加差分はNONE。

今回の有限教師適合に新観測会は不要。9行は独立9話ではなくchair＋dailyの2話であり、一般化/Piece/Analysisの教材不足は残る。受け取りが未達の原因を更新数不足・教師不足・4B能力限界と断定しない。GPU稼働保持、STOP/再起動/削除/新Pod/charge0。本番/Supabase/Render/RN/merge/deploy変更0、商品0・正式0/3・54.50％据置。
