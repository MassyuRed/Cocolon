# 10/27 — 混在30更新とCMEE接続の最終結果

**RUN_CLOSED_REJECTED_CANDIDATE。承認済み一回は完了。意味11/15・本文9/15へ改善したが、新6件の本文は0/6のため新重みを通常利用へ採用しない。**

Mashが084b79b1の「同じ15教材を混ぜて30更新→保存・再読込→15件確認、最大45分/$0.21処理按分（準備/回収/保持等別）」へ「いいよ、進めて。」と明示承認。実行sourceは`e107b09535bfcf656cb97100a7434c66ca2c3740`、API`6b043880504912481a6b10d93c9128ec4995b70b`。同A5000のPID21603で--executeを一度だけ起動した。root華恋が単一実行/writer、read-only2agentは技術読解補助で、正式Pro/Ultra/human受入れではない。

## 実結果と前回の同quote15比較

| 確認 | 前回15更新/278fdc26 | 今回混在30更新/1d218763 |
|---|---:|---:|
| 更新/after生成 | 15 / 15 | 30 / 15 |
| EOS / JSON解析 | 14 / 12 | 15 / 15 |
| CMEE意味採用 | 3/15 | 11/15 |
| CMEE本文成立 | 3/15 | 9/15 |
| 旧題材9の意味/本文 | 3/9・3/9 | 9/9・9/9 |
| 新題材6の意味/本文 | 0/6・0/6 | 2/6・0/6 |
| 採用snapshot cold-file | 3/3 | 11/11、失敗0 |

今回cold11は本文9件と、意味は採用したが本文がないSHOP初回/REPOTの2件を含む。本文11件完成とは数えない。全15は既知教師FIT・元言語6familyで、本文成功9は椅子/日常の2familyを別identityで確認したもの。after回答priorは凍結教師由来で、実モデル初回のsnapshotから動的に進めた一往復ではない。未知評価/実service・HTTP/Auth/SQL保存再読/RN本人端末/商品受入れは今回0。

旧numeric成功9/9は今回quote15のbefore成功へ流用しない。今回の比較相手は直前278fdc26の同quote15/raw/APIである。初期45779・教師15・prompt/eval・seed・LR5e-5・全文assistant+EOS・32LoRA・生成cap・採用readerを保ち、更新回数と混在順序を変更した。改善を順序/回数のどちらか一要素へ帰属させない。新しい未学習45779のquote-beforeは生成していない。

処理1412.657366秒（約23分33秒）、表示$0.28/h按分$0.109873。これは準備/回収/保持/保存/通信/税等を含む請求総額ではない。2700秒/1生成180秒/最大15callを守り、timeout/OOM/再試行/追加生成0。peak allocated19.655GiB/reserved23.164GiB。CPU診断100.641017秒、追加model/SQL0。

## 全15件の実採否

| case | receipt | 意味/本文 | 理由 |
|---|---|---|---|
| [TRAIN-SERVICE-CHAIR-01-INITIAL](after_TRAIN-SERVICE-CHAIR-01-INITIAL.jsonl) | CANDIDATE_UNREVIEWED | 1/1 | — |
| [TRAIN-SERVICE-CHAIR-01-CORRECTION](after_TRAIN-SERVICE-CHAIR-01-CORRECTION.jsonl) | CANDIDATE_UNREVIEWED | 1/1 | — |
| [TRAIN-SERVICE-CHAIR-02-INITIAL](after_TRAIN-SERVICE-CHAIR-02-INITIAL.jsonl) | CANDIDATE_UNREVIEWED | 1/1 | — |
| [TRAIN-SERVICE-CHAIR-02-CORRECTION](after_TRAIN-SERVICE-CHAIR-02-CORRECTION.jsonl) | CANDIDATE_UNREVIEWED | 1/1 | — |
| [TRAIN-SERVICE-CHAIR-03-INITIAL](after_TRAIN-SERVICE-CHAIR-03-INITIAL.jsonl) | CANDIDATE_UNREVIEWED | 1/1 | — |
| [TRAIN-SERVICE-CHAIR-03-CORRECTION](after_TRAIN-SERVICE-CHAIR-03-CORRECTION.jsonl) | CANDIDATE_UNREVIEWED | 1/1 | — |
| [TRAIN-DAILY-CALM-01-INITIAL](after_TRAIN-DAILY-CALM-01-INITIAL.jsonl) | CANDIDATE_UNREVIEWED | 1/1 | — |
| [TRAIN-DAILY-CALM-02-INITIAL](after_TRAIN-DAILY-CALM-02-INITIAL.jsonl) | CANDIDATE_UNREVIEWED | 1/1 | — |
| [TRAIN-DAILY-CALM-03-INITIAL](after_TRAIN-DAILY-CALM-03-INITIAL.jsonl) | CANDIDATE_UNREVIEWED | 1/1 | — |
| [FT-BOOK-INITIAL](after_FT-BOOK-INITIAL.jsonl) | CANDIDATE_UNREVIEWED | 0/0 | model_v3_unknown_not_source_bound |
| [FT-BOOK-AFTER-ANSWER](after_FT-BOOK-AFTER-ANSWER.jsonl) | INVALID_EVIDENCE | 0/0 | semantic_receipt_not_validated |
| [FT-SHOP-INITIAL](after_FT-SHOP-INITIAL.jsonl) | CANDIDATE_UNREVIEWED | 1/0 | model_surface_not_validated |
| [FT-SHOP-AFTER-ANSWER](after_FT-SHOP-AFTER-ANSWER.jsonl) | CANDIDATE_UNREVIEWED | 0/0 | model_evidence_collection_invalid |
| [FT-REPOT-INITIAL](after_FT-REPOT-INITIAL.jsonl) | CANDIDATE_UNREVIEWED | 1/0 | model_surface_not_validated |
| [FT-KNIT-INITIAL](after_FT-KNIT-INITIAL.jsonl) | CANDIDATE_UNREVIEWED | 0/0 | model_evidence_out_of_scope |

[diagnosis/diagnosis.json](diagnosis/diagnosis.json)が無補修rawからの実receipt/意味/本文/問い/cold-fileを所有する。受領CANDIDATE_UNREVIEWEDは意味採用済みの意味ではない。SHOP初回/REPOTは意味採用後に独立本文検査でmodel_surface_not_validatedとなった。BOOK回答後の受領はINVALID_EVIDENCE、意味不採用である。

## 実文章と意味の読解

旧9件のparsed全体はquote教師に9/9一致した。椅子初回のrelation IDをclaim_refsへ入れる誤り、訂正時の根拠表9→12欠落/範囲外参照、共同修理/喜びの欠落と未記載の喜びの補完が解消。日常3件は前回と全文維持した。実CMEE本文9件はraw提案の本文と一致、椅子初回ASK3・訂正END3・日常END3を確認。ただし初回の喜び語の反復、訂正noteの硬さは教師由来の文体残件で、正式商品合格とはしない。

新6件はJSON完了と意味構造の局所改善があっても、本人向け本文が成立していない。

- BOOK初回：claims/relations/6引用は教師一致で日付補完は消えたが、unknownの束縛不成立。本文は原文にない安心を断定し、観測/受け取りにも問いを混入。
- BOOK回答後：96反復が消え、2876token/EOS/JSON完了、元気がかり・回答sourceは復旧。一方、no_contactへ反実的な振り返りを割り当て、架空結合引用5件・配列外index17・ADD1件とupdate_refs0..3が不整合。Receptionと更新説明も原文再掲になった。
- SHOP初回：意味/6引用は教師一致で意味採用。本文は喜びを落とし、「开店」表記と薄い受け取りが残り本文不成立。
- SHOP回答後：JSONを閉じ回答sourceを修復したが、約束否定・本人知覚・距離の役割が混線。ADD1件とupdate_refs0..7、根拠範囲外参照が不整合。回答の長い再掲で自然な受け取りになっていない。
- REPOT：意味/引用/表面bindingは教師一致で意味採用し、kind/参照は改善。しかし「説明してもらい、聞いた」を本文で「叔父に説明し、最後まで聞かせた」へ二重反転した。Receptionの安心への応答は局所改善したが、本文全体は不成立。
- KNIT：JSON、時点、文字列参照、関係0、二感情の不明保持は改善。しかし根拠作用域不成立で意味不採用。Receptionへsystem指示文の140文字をそのまま出し、本人への応答になっていない。

根拠file/行/JSONpathと比較は[旧9読解](reading_reviews/old9.json)・[新6読解](reading_reviews/new6.json)。読解時点の採否nullと、最終diagnosisによる採否を混同しない。rootが実本文/全15rawを読み、低品質の確認をMashへ戻さない。不成立はraw補修/教師代入/採用条件緩和で成功化していない。

## 保全・再開境界

新adapter SHA256 `1d218763964ce0e1f0e587c754731c5476d70cdd16548020abf330912c518c1b`。実30logのstep1..30/id/row_index/passが固定orderへ一致、各15行2回、loss/grad有限。32F32有限、別保存非学習reloadと生成前後不変、旧45779と固定source不変を確認した。

[最終重み/全原本archive version1](https://chatgpt.com/library?file_id=libfile_5ecbab80168481919b1e4965fd7660fe&account_id=personal)：3,920,475bytes、SHA256 `57b39307cea805ef502c28a84d285e55c2dfbdcf45a13f97c778123fc0c992cb`。全74payload+manifest/75memberのbytes/hash、32F32有限、早期保存と最終重み/30log一致、全rawの受領hash/重み/usage/EOS/case順をPod外照合した。[final_recovery.json](final_recovery.json)／[recovery_manifest.json](recovery_manifest.json)。元4B全重み/optimizer/RNGは非同梱で、厳密なoptimizer途中resumeではない。旧45779/278fdc26と旧Library archiveは別保持。

早期version0は399.591608秒/30更新/生成0の原本として維持する。最終run.jsonのRAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEWは生成終了時の不変原本で、最終判定はresult_summary.json/runtime_checkpoint.jsonのRUN_CLOSED_REJECTED_CANDIDATEが所有する。run.plan.epochs=1は旧plan継承metadataの残りであり、実際のtraining_passes=2/update_order30/実30logを優先し「1epoch」とは報告しない。閉鎖原本を遡及修正しない。

今回の一回は終了し、--execute再起動・追加学習・追加生成は行わない。次の直接課題は、新6の役割/否定/更新全件と、本人へ向けた受け取りを同時に保つ学習条件の見直し。全文平均に埋もれる本文/参照/更新の配分を既存方式で検討する余地はあるが、主因や効果はまだ確定しない。単に回数を足す、JSONを修復する、検査を緩めるだけで進めない。新観測会を先に要求する原因ではない。

primaryは限定TECHNICAL_CREDIT（既知quote9・保存reload/15生成・採用snapshot再読の成立）、商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false。通常API/DTO/DB/RN/Render/Supabase/本人DB/merge/deploy変更0、STRUCTURE_MAP_DELTA_NONE。両PRはDraft継続。GPUは指示どおり停止せず稼働保持し、保持料金が続く。
