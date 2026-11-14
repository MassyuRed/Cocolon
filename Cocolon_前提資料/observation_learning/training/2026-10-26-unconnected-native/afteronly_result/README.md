# 10/27 — A5000実学習15更新とCMEE接続の最終結果

状態：**RUN_CLOSED_REJECTED_CANDIDATE。A5000で動作、学習・保存reload・after15は完了。意味/本文3/15、新しい重みは不採用。**

既存の設計/全file地図/最新weeklyと作業ルールを確認し、Mash本人レンタルのA5000へ直接Jupyterで接続して一回を実施した。旧native15の前比較timeout（更新0）の再起動ではない。今回の実行sourceは`9a6c56ed5657e50e31cef50bab0015fc5e6484f9`、APIは`6b043880504912481a6b10d93c9128ec4995b70b`、runnerは`a62d3ed74e76a26c01fe66b9eba32d42631acac170cfd9c8dcb2c7cdf5076552`。

## 比較条件の訂正（10/27継続調査）

旧成功joint12原本を再確認し、chair6は旧numeric candidate/evidenceから今回quote candidate/evidence_quotesへmessages/targetが変わっていた。daily3だけ全文同一。本報告の「旧9の維持にも失敗」は現quote15のうち旧題材9で3/9という結果を指し、同じ入力で9/9→3/9へ低下した証明ではない。忘却・学習率が原因とは未確定。全raw/実採否/重みのbytesと新候補不採用は不変。次の具体案・根拠は[学習owner](../README.md#native15-interleaved30-proposal)と[実条件診断](../interleaved30_preparation/training_diagnosis.json)。

## 実結果

| 確認 | 実測 |
|---|---|
| 学習/生成 | 新before0、同じ凍結15行を15更新、別保存/非学習reload、after15。再試行0 |
| 出力完了 | EOS14/15、JSON解析12/15。timeout/OOM0 |
| CMEE意味/本文 | 3/15。旧9は3/9、新6は0/6 |
| 保存再読 | 採用daily3件のsnapshotを別processのRESUME_ADOPTEDで再開し完成fileと全outcome一致3/3、失敗0 |
| GPU | RTX A5000、peak allocated19.655GiB/reserved23.164GiB |
| 時間/費用 | 処理1190.521865秒、表示$0.28/h按分$0.092596。準備/保持/税等を含む請求総額ではない |
| 固定物 | 旧45779adapter・教材・helper・API source不変、新adapter生成前後不変 |

成功3件は同じdaily言語familyの別identityで、3つの独立未知題材ではない。15行すべて既知教師FIT、BOOK/SHOP回答のpriorは凍結教師採用snapshotである。実モデル初回から動的に進むthread、実service/HTTP/Auth/SQL保存再読、React Native端末確認、未知一般化は今回0。以前のCPU394/SQL6や旧runのFIT9/9を今回の成功へ流用しない。旧9の維持にも失敗したので新adapterを有効化しない。

## 全15件の無補修rawと採否

| case | EOS | receipt | 意味/本文 | 拒否理由 |
|---|---|---|---|---|
| [TRAIN-SERVICE-CHAIR-01-INITIAL](after_TRAIN-SERVICE-CHAIR-01-INITIAL.jsonl) | yes | CANDIDATE_UNREVIEWED | 0/0 | model_surface_reference_invalid |
| [TRAIN-SERVICE-CHAIR-01-CORRECTION](after_TRAIN-SERVICE-CHAIR-01-CORRECTION.jsonl) | yes | CANDIDATE_UNREVIEWED | 0/0 | model_evidence_out_of_scope |
| [TRAIN-SERVICE-CHAIR-02-INITIAL](after_TRAIN-SERVICE-CHAIR-02-INITIAL.jsonl) | yes | CANDIDATE_UNREVIEWED | 0/0 | model_surface_reference_invalid |
| [TRAIN-SERVICE-CHAIR-02-CORRECTION](after_TRAIN-SERVICE-CHAIR-02-CORRECTION.jsonl) | yes | INVALID_EVIDENCE | 0/0 | semantic_receipt_not_validated |
| [TRAIN-SERVICE-CHAIR-03-INITIAL](after_TRAIN-SERVICE-CHAIR-03-INITIAL.jsonl) | yes | CANDIDATE_UNREVIEWED | 0/0 | model_surface_reference_invalid |
| [TRAIN-SERVICE-CHAIR-03-CORRECTION](after_TRAIN-SERVICE-CHAIR-03-CORRECTION.jsonl) | yes | INVALID_EVIDENCE | 0/0 | semantic_receipt_not_validated |
| [TRAIN-DAILY-CALM-01-INITIAL](after_TRAIN-DAILY-CALM-01-INITIAL.jsonl) | yes | CANDIDATE_UNREVIEWED | 1/1 | — |
| [TRAIN-DAILY-CALM-02-INITIAL](after_TRAIN-DAILY-CALM-02-INITIAL.jsonl) | yes | CANDIDATE_UNREVIEWED | 1/1 | — |
| [TRAIN-DAILY-CALM-03-INITIAL](after_TRAIN-DAILY-CALM-03-INITIAL.jsonl) | yes | CANDIDATE_UNREVIEWED | 1/1 | — |
| [FT-BOOK-INITIAL](after_FT-BOOK-INITIAL.jsonl) | yes | CANDIDATE_UNREVIEWED | 0/0 | model_evidence_out_of_scope |
| [FT-BOOK-AFTER-ANSWER](after_FT-BOOK-AFTER-ANSWER.jsonl) | no | TOKEN_LIMIT | 0/0 | semantic_receipt_not_validated |
| [FT-SHOP-INITIAL](after_FT-SHOP-INITIAL.jsonl) | yes | CANDIDATE_UNREVIEWED | 0/0 | model_evidence_out_of_scope |
| [FT-SHOP-AFTER-ANSWER](after_FT-SHOP-AFTER-ANSWER.jsonl) | yes | INVALID_FORMAT | 0/0 | semantic_receipt_not_validated |
| [FT-REPOT-INITIAL](after_FT-REPOT-INITIAL.jsonl) | yes | CANDIDATE_UNREVIEWED | 0/0 | model_claim_axes_not_source_bound |
| [FT-KNIT-INITIAL](after_FT-KNIT-INITIAL.jsonl) | yes | INVALID_FORMAT | 0/0 | semantic_receipt_not_validated |

`CANDIDATE_UNREVIEWED`は引用位置検査後の受領状態で、意味採用済みという意味ではない。[diagnosis/diagnosis.json](diagnosis/diagnosis.json)が実採否/実本文/cold結果を所有する。BOOK回答後は3712token/146.420秒でlengthとなった。180秒timeoutではない。EOS falseだけでrunner全体を止めず、finish_reason=lengthのままCMEEがTOKEN_LIMITとして拒否した。SHOP回答後/KNITはEOSありでもJSON不正である。rawを修復・欠測補完して通していない。

## 入力と実文章の読解

- daily3件：parsed全体が元教師と一致。実本文は「帰ってから、うどんを作って食べたのですね。」「あったかいものを食べて、少し落ち着けてよかったです。」。原文にない空腹等の補完は見当たらない。これは限定例の技術成立で商品合格ではない。
- chair初回3件：意味/問いは保つが、関係IDをclaim参照へ入れ、受け取りに未完の問いとの整合が悪い「喜びの根拠も聞けて…」を追加。訂正01は引用表を縮めたまま旧indexを残す。02/03は教示/共同修理や更新の欠落、引用field誤り・範囲外参照を生じ、03では「一緒に直せたこと自体も、嬉しかった」と未記載の意味を足す。
- BOOK初回：旧beforeの架空「その場は済んだけど」とAI側に気がかりを持たせる文は消え、claim形式と実在引用が局所改善。ただし原文外の日付をabout_time.expressionへ補い、「気がかりの対象は未記載です」と内部説明を受け取りへ露出。回答後はupdate bindingを96個反復して未閉鎖、元気がかり欠落・claim重複・事実と反実的振り返りの取り違え。
- SHOP初回：喜びと置いていかれた本人知覚・問いは保持するが、引用範囲と本文参照、内部説明調に残件。回答後はJSON不正に加え、否定/実現/距離の役割、回答quoteと更新参照が混線。
- REPOT：元入力「叔父に説明してもらい」を本文「叔父に植え替えの手順を説明し」へ反転。引用が実在しても意味忠実とは限らない。claim.kindをrole名にし参照も不整合。
- KNIT：JSON不正、不明の対象を二つの感情から「編み物とそれら」へ変え、整数参照/時点kindを混同。ObservationとReceptionも同一。

根拠file/行/JSON pathは[旧9読解](reading_reviews/old9.json)、[BOOK2読解](reading_reviews/book2.json)、[残り新4読解](reading_reviews/new4.json)。旧9/BOOK読解は実採否実行前の所見として保存し、最終採否は上表とdiagnosisへ統合した。rootが実本文と件数を照合し、別文脈2agentはread-only補助。正式Pro/Ultra/human受入れではない。

## 重みと原本の保全

新adapter SHA256：`278fdc26e56c2cd84b39bec19d484374d4504c656fbd5d1f8112d006e8c6457d`。保存・非学習reload後の32F32 tensor有限性と、after生成前後の不変を確認。旧`45779ad9…`は別保持し、新候補を既定化しない。

[最終archive version1](https://chatgpt.com/library?file_id=libfile_4756727c2f4c81918fb24227734d4269&account_id=personal)：3,654,453bytes、SHA256 `945a26744afaa618bb09fc53a6e0b07bbdfdfbd49d57937849f4d2772e3efe4b`。全50payload+manifestのbytes/hashをPod外で照合し、32F32を実bytesでも有限確認。archiveは追加重みとrun/全raw/凍結教材/plan/source/diagnosis/evidenceを含むが、元4B全重み/optimizer/RNGは含まない。厳密な途中optimizer resumeではない。独立照合でも件数/原本不変/50hash/32finiteが一致した。

[final_recovery.json](final_recovery.json)と[recovery_manifest.json](recovery_manifest.json)に照合を記録。version0とearly_run.json/early_recovery.jsonは204.712517秒/更新15/生成0の保存履歴として維持する。生成終了時の[run.json](run.json)はRAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEWのまま不変、最終判定は[result_summary.json](result_summary.json)のRUN_CLOSED_REJECTED_CANDIDATEが所有する。

## 次の直接課題

今回の新重みは不採用。一回は完了し、同outputの再起動・追加生成・追加学習は行わない。次は、原文束縛を保つclaim/時点/否定/引用/更新参照の学習と、長い構造を最後まで閉じる条件を、旧chair保持と同じ評価単位で切り分ける。今回だけでは学習回数不足/LR/長文構造のどれが主因か確定できない。引用の修復・token上限拡大・名詞ごとの特例・CMEE拒否条件の緩和だけで成功化しない。実サービス接続へ進む前に、新6の意味/本文と旧9互換を成立させる。

API/公開DTO/DB/RN/Render/Supabase/本人DB/merge/deploy差分0。STRUCTURE_MAP_DELTA_NONE、商品0、正式0/3、54.50％、candidate_ready=false、automatic_progression=false。両PRはDraft継続。GPUは保持指示に従って稼働中で、保持料金が続く。
