# quote接続・18更新の最終結果

**一回18更新とFIT9は完了。意味9/9・本文6/9のため、条件付き2件保存再読はcall0で終了した。** 2026-10-25 JST。

Mashは「接続実装・18更新・全9件成功時の2件保存再読」へ明示承認した。この有限scopeの実結果を記録する。実装は[API4002b457](https://github.com/MassyuRed/mashos-api/commit/4002b4577838d1ed6671278a19585b61e7ccd10e)、実行sourceは[1a34c968](https://github.com/MassyuRed/Cocolon/commit/1a34c9688228628adfaab8021db572dc2b0aceb0)。後段準備/早期重み保全sourceは[cf316f1](https://github.com/MassyuRed/Cocolon/commit/cf316f1aa9cc6413f6e1ff80293f5f24715c1d0d)。[固定教師・plan・runner・CPU結果](../../training/2026-10-25-emlis-quote-address/README.md)と[最新weekly §42](../../../weekly_reviews/Cocolon_Weekly_Review_20261024.md#20261025-quote-address-approved-implementation)へ戻れる。

| 実FIT | 意味 | 本文 | 問い・更新 |
|---|---:|---:|---|
| chair初回3＋訂正3 | 6/6 | 6/6 | 初回ASK3、訂正各3更新/問いなしを保持 |
| 日常の食事と小さな落ち着き3 | 3/3 | 0/3 | 全3 UNAVAILABLE / model_surface_not_validated |
| 合計 | 9/9 | 6/9 | 全9意味＋本文成功条件は未成立 |

4Bは明示quote形式でsource/field/完全引用を選び、CMEEが一意のUnicode scalar位置を計算する。今回daily3は新wireのreceipt受領・raw再導出・native意味採用を通過した。原rawは書き換えず、引用一致自体を意味や本文の採用と数えていない。旧数値方式のchair6も教師parsed packetと完全一致した。

日常3の教師差は `/candidate/surface_proposal/reception` だけだった。01は「あったかいものを食べて、少し落ち着いたのですね。」、02/03は「あったかいものを食べて、少し落ち着けたのですね。」。教師の「あったかいものを食べて、少し落ち着けてよかったです。」へ届いていない。事実の言い直しで終わる本文を採用しない既存readerの境界を保った。全9の本文・問い・更新をrootが読み、別文脈2agentもread-onlyでgate未成立を確認した。

全9成功条件に未達なので別identity2件の新model call/実serviceSQLは0、eval_plan未作成。未使用holdout source/fixtureは残すが実行しない。追加更新・同要求再call・LR探索・raw補修・reader緩和・重み昇格0で今回の有限試行を閉じる。固定priorのTRAINING_FIT_FIXED_PRIOR_NOT_DYNAMICであり、動的回答往復や保存再読の新成功ではない。

開始未採用affea8a7、新AdamW/LR5e-5、chair6各1＋daily3各4の18更新、assistant全文JSON＋EOS、context8192/input5632/output2560。実tokenizerはmaxprompt5045/assistantEOS2339で切捨て0。保存/32F32有限/非学習reload/FIT新生成9を1081.492473秒で完了。peak allocated16.171474/reserved18.779297GiB。記録単価$0.26h按分$0.07810779は処理分だけで、準備/回収/継続保持/税等を含む請求総額ではない。途中Work接続断は同Jupyterへ復旧し、trainer/モデルの再実行0。

全文NLLはchair11114tokenの0.000937254→0.000883607（4/6低下）、daily4742tokenの0.032743414→0.003126728（3/3低下）。全文平均の改善を受け取り生成の成功へ換算しない。有限教師への生成適合不足は確認したが、更新量不足・教師数不足・4B能力限界を原因と断定する証拠はない。

新adapterは `138b9ff7e5b7df59e6da80126a52b309edf9c22a9a860f2c165189a9e453c102`。保存直後archive41bea5a3…/3,472,720bytes/16member（15検査対象）と32F32有限をPod外照合し、[追加重みを保管](https://chatgpt.com/library?file_id=libfile_ae60b41c293c81919a5d52aeba59f86c&account_id=personal)。内runはFIT前gen0。完了証拠archive b053dbcf…/6,963,640bytes/19member（18検査対象）のsize/hashも全一致、adapterは早期回収物と同一。初回hash転記の期待値誤りはextract前assertで停止し、Pod元表示を32桁ずつ再確認して期待転記だけを修正、実archive bytes不変。全原raw・consumer・学習順・NLL・凍結source・旧重みを保持する。base全重み/optimizer/RNGを含む保存ではなく、候補は未昇格。

| file | 内容 |
|---|---|
| [closure.json](closure.json) | 全9の採否/問い/更新/原raw同一性、教師との差、後段gate不成立、費用/停止境界 |
| [run.json](run.json) | 実18更新/9生成/非学習reload、32tensor、全順序、VRAM/秒数、初期重み不変 |
| [after_fit.jsonl](after_fit.jsonl) | 無補修9原raw。211,275bytes/SHA256 21787a79c2ecf5e1a60b47e5b9590bb18423d263ae88dc927e2b256b8eb5bb5d |
| [training.jsonl](training.jsonl) | 18stepのloss。pass欄は9stepブロック名で、実反復数はrunのtraining_orderが正本 |
| [before_nll.jsonl](before_nll.jsonl) / [after_nll.jsonl](after_nll.jsonl) | 凍結教師全文JSON＋EOSの前後NLL |
| [file_manifest.json](file_manifest.json) | Pod完了archiveの全18検査対象size/hash。大きい重み等は保管archiveと固定packへ戻る |
| [recovery_verification.json](recovery_verification.json) | Pod外回収の全member照合・consumer SHA・転記修正の区別 |
| [consumer.index.json](consumer.index.json) / consumer.part-01.txt〜22.txt | 実consumer1,604,374bytesを22 UTF8 text partsへ無損失分割。index順に区切りなしbytes連結し、元size/SHAを検証後JSON化する |

実consumerは新生成/学習/DB操作0で実rawを一回だけ消費し、既存CMEEの意味/本文採用へ通したもの。合成教師9/9やCPU197成功をこの実model件数に加算しない。raw receiptのraw_outputとafter_fitのraw_textは全9byte同一。

新観測会は今回不要。既存の正解反応への適合不足を、新しい経験の収集で代用しない。9行はchair/dailyの2話であり、一般化とPiece/Analysisの完成教材は不足している。追加学習を決める前に、保存済み出力と既存評価手段で受け取りの分岐を切り分けることが次の検討点で、今回新たな採点やGPU試行は開始しない。

primary=BLOCKER_NARROWED。承認後private接続の限定CPU TECHNICAL_CREDITは保持、本文/一般品質/商品合格は未達。今回終了記録のSTRUCTURE_MAP_DELTA_NONE、実装時PRESENTは既存mapへ反映済み。商品0・正式0/3・54.50％据置。GPU稼働保持、STOP/再起動/削除/新Pod/charge0。本番/Supabase/Render/RN/merge/deploy変更0。
