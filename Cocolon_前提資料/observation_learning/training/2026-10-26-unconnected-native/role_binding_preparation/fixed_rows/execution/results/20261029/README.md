# 承認済みfixed rows一回 — 新重み不採用で終了

Mashがbadea42e具体案へ「進めていいよ」と明示承認した一回。華恋/rootがJupyterへ直接接続し、限定受領実装、CPU検査、before2、条件成立に伴う5更新、別保存/非学習reload、after11、CMEE/cold、原本回収を完了した。API runtime c920f81a、runner/consumer c6ef6555。実run原本のstatusはRAW_COMPLETE_PENDING_AFTER_CMEE_AND_CONTENT_REVIEWのまま保持し、回収後の判定は[summary.json](summary.json)のCLOSED_NOT_ADOPTED_NO_RETRYとする。

## 結果

| 対象 | 生成 | 実CMEE意味/本文 | 判定 |
|---|---|---|---|
| before BOOK | 3712token cap・EOSなし | 0/1 | TOKEN_LIMIT |
| before SHOP | 3584token cap・EOSなし | 0/1 | TOKEN_LIMIT |
| after BOOK | 1473token・EOS | 0/1 | INVALID_FORMAT |
| after SHOP | 3101token・EOS | 0/1 | INVALID_FORMAT |
| after旧9 | 全9 EOS | 6/9 | 旧成功7を保持できず |

旧成功で失ったのはTRAIN-SERVICE-CHAIR-01-CORRECTION。旧成功7→今回6であり、集計だけで保持成功とは扱わない。各caseのreceipt/decision/reasonと成立6件の本人向け本文はsummaryに収録。成立6件は別processで保存snapshotを再読しfull outcome完全一致、元raw/metadataを使うreceipt replayも一致した。

| after case | 意味/本文 | 理由 |
|---|---|---|
| CHAIR01 INITIAL | 成立 | cold/replay一致 |
| CHAIR01 CORRECTION | 不成立・旧成功喪失 | model_update_coverage_invalid |
| CHAIR02 INITIAL | 成立 | cold/replay一致 |
| CHAIR02 CORRECTION | 不成立 | model_update_not_prior_or_source_bound |
| CHAIR03 INITIAL | 成立 | cold/replay一致 |
| CHAIR03 CORRECTION | 不成立 | model_update_coverage_invalid |
| DAILY01/02/03 INITIAL | 各成立 | 各cold/replay一致 |

## rootによる原本・本人本文の確認

全13rawと成立6件のobservation/reception/update_noteをroot自身が読み、未採用候補と生成済み本文を区別した。

- before両件は出力仕様を写し、@p/@s名を連番で反復してcap終了。本文候補まで到達しない。
- after BOOKはJSONとしては読めるが、必要な5要素rootではなく10要素。alias/quoteがflattenされ、candidateはnamed objectのままで固定列になっていない。s1/回答根拠が欠け、updatesの重複名や不正target、自由なsection名も見える。raw本文の「返す約束を破ったこと」への訂正は原文にない。いずれも受領拒否済みで、意味/本文として採用しない。
- after SHOPはaliasとquote/candidateがJSON文字列へ混ざり、閉じない文字列中の末尾改行でInvalid control character（position9360）。形式の修復・切出し・旧形式fallbackは行わない。見えているobservation/receptionは同文反復、update_noteは空であり、これも本人本文の成立ではない。
- CHAIR01訂正はREVISE2本だけになり、必要なINVALIDATE_GAPが欠落。surfaceのupdate_refsは存在しないindex2も参照する。CHAIR03訂正も1更新だけでtarget kind/refが混成している。機械判定理由を補助する観察であり、rawを直して成功へ付け替えない。
- 成立した椅子初回3件は「私もうれしいです」を含み、日常3件は原文の温かい食事/少し落ち着いたことを返す。これは今回の機械的成立の記録で、人間の観測品質・商品受入れ済みとはしない。

今回だけで教材不足の原因を断定しない。既存2教師はCPUで厳密形式・意味・本文が成立しており、現2題の追加観測会は不要。次の直接課題は、既存教師の形式指示と生成の混成箇所をCPUで分離し、旧成功7の訂正更新保持を含む学習案を検討すること。新GPU/条件変更/再試行は実行していない。

## 処理・検査

2load・学習forward/update5・13生成、112tensor変更。処理1265.8722353549674秒（約21分6秒）、前回同Pod表示$0.28/hによる按分$0.09845672941649748。承認上限2400秒/$0.19以内。live単価再照会なし。準備/回収/保持/保存/通信/税等は別。GPU RTX A5000、peak allocated17581682176/reserved24182259712 bytes、解放後allocated17039360 bytes。

CPU受領統合35.844613251974806秒、最終入力準備4.061125983018428秒、after CMEE62.10978671303019秒。before CMEE1.6880356459878385秒は親処理に含む。CPU教師2の全値/意味/本文/cold/replayと旧9全receipt/fulloutcomeは旧rootと一致。欠落/不正時点/bind/quote/update/alias/arity等の各変異を補完しない。standard unittest5成功（subtestは加算しない）。CPU初回の比較参照outcome.body.artifactの誤りはモデル処理0で修正し、初回原本を別保持。

API c920f81aの初回既存CIは主要1634成功・現owner identity fixture1失敗。ソース変更に伴うruntime identityだけを7acff074で同期し、[既存CI](https://github.com/MassyuRed/mashos-api/actions/runs/40826863964)は1634 passed/12020 subtests passedと別1 passed・194 deselectedで成功。実行runtimeはc920f81aであり、後続fixtureだけを適用した実GPUとは称さない。

## 重みと原本

新adapter SHA256 f811314b0d93398b386e5fbd2f28ad24c01cc7b9c10dae275eaae920fbbb4b0bは不採用。比較起点f493は保全し、通常商品採用へ昇格しない。全112F32（3,833,856parameter）をbytesから走査し全finite・名前/shape一致・全112変化と保存/非学習reloadのidentityを確認した。学習5件の完全encoded/mask、派生11件train/eval bytesと承認済みfinal_v2、旧9の全token countsも原本と一致。回収後に旧9全件をtokenizerで再計算したという意味ではない。

回収ZIP cocolon-fixedrows5-weights-originals-20261029.zip は33176759bytes、SHA256 66c4d8b22ec18a339b439ae0b27371107b2a91291e4c5cc2d6b7aa47e2b720c8、payload358＋manifest1。Jupyter作成時と回収後に全memberのCRC/長さ/SHA一致を確認し保管済み。[archive_receipt.json](archive_receipt.json)にidentityを記録する。新旧adapter、13raw/token IDs、5更新log、入力token/mask、CPU初回/修正後、CMEE receipt/意味/全outcome、成立snapshot/cold、実行sourceと全readerを含む。base model重み・optimizer/RNGは含まず、厳密な学習再開archiveではない。

実GPU後の実行source改変0。通常API/DB/RN/Render/Supabase/通常ModelCandidateSource有効化/merge/deployは変更0。受領実装の構造差分は該当mapへ同期。商品0、正式0/3、54.50％、candidate_ready=false、automatic_progression=false。retryなし。GPU保持、Stop/restart/deleteなし。
