# 10/28 — named接続・CPU成功、13更新一回の実生成は0/2で新重み不採用

状態：**ONCE_COMPLETED_NOT_ADOPTED_NO_RETRY**。Mashが起案67910d91へ明示承認した接続実装→CPU→成功時の13更新/save/reload/BOOK・SHOP各1生成を一回終了した。今回の承認枠は消費済み。実行前の [固定pack](../named_reference_preparation/execution/README.md) とplanは当時の原本で、再起動しない。

## 到達点と実結果

- **private接続とCPU確認は完了。** APIa8be7a9bの4source＋新test1。明示named形式・実raw保存/同rawとformatからreceipt再導出・source由来BOOK/SHOP説明回答guard。旧default/15receipt/保存snapshot/fulloutcome完全一致、合成named2のnative意味/本人本文/全7・8更新同値と別process cold2一致。最終347成功/FAIL0/SKIP0、SQL12対象外。
- **実4Bの品質は未達。** d431から13更新、別保存284f1df7/112F32、112一致/no-grad reload、自由生成2件を完了。両件EOSなし・長さ上限でJSON未完結、実receiver TOKEN_LIMIT→REJECT/semantic_receipt_not_validated。意味/本文0/2、採用snapshot0、実生成cold対象なし。
- 原d431は不変、新284f1df7は保全して通常不採用。追加のretry/学習/生成/raw補修/reader緩和/上限延長なし。GPUは稼働保持、Stop/restart/delete/管理API0。通常app/API/DTO/DB/RN/Render/Supabase/公開/merge/deploy変更0。

| 回答後 | prompt | 出力上限/実出力 | EOS | 意味/本文 | 主な静的所見（実拒否理由と別） |
|---|---:|---:|---|---|---|
| BOOK | 4422 | 3712/3712 | なし | 0/0 | vをobject化、旧long key/数値参照混在、update_note binding反復、完成本文なし |
| SHOP | 4586 | 3584/3584 | なし | 0/0 | vをobject化、q反復とsource/欄/alias不一致、claim/全更新不足、proseが初回action一文 |

[全文読解と教師/source比較](reading_review.md)。意味admissionが候補内容を精査してUNSUPPORTEDにした結果ではない。両rawを補修して意味成功へ昇格していない。context8134/8170≤8192、切捨て0、timeout0、旧9の新自由生成/新初回4/全15新評価/動的thread/未知一般化/実service-SQL/本人端末/他coreは未確認。

## 実行と費用

実行source Cocolon `3786df216a0d5183de31356734d6109f52f22927`、API `a8be7a9bceed35a9f3cb843f22de05bbd5bc6e18`、元base Qwen3.5-4B revision `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a`。Pod94a06hhxu51uy4/A5000、Jupyterへ直接接続した。旧9各1＋named回答後2各2の13更新、新AdamW/LR1e-5/decay0/clip1/seed20261024、旧9CE/新2既存adaptive15/gamma2、全assistant/EOS・prompt除外。元teacher15不変、他13prompt/target不変。元d431から開始し前回c7baを初期値にしていない。

GPU処理 **556.846751533秒（9分16.85秒）**、記録$0.28/hの按分 **$0.0433103029**。承認上限600秒/$0.047内。準備/CPU/回収/継続保持/保存/通信/税等は別で、請求総額ではない。外590秒＋kill10、各生成180秒以内。実生成はBOOK161.626378秒、SHOP146.500764秒。GPU exit0、追加attempt0。CMEE CPU1.793620497秒、追加model/更新/生成/SQL0。

新重みSHA256 `284f1df77c828982bdb7c2480f3f269b71dc9d69a29ea36b48dc6d25ab807d23`。112tensorすべてF32有限/3,833,856parameters、112変更・保存/再読一致を確認。元d431 `d431a07ce227c05e81eca5afb9461d91cf8101d50af0d27ec1a81844ce8ac684` とsource不変。追加重みは元base全重みを含む単独モデルではなく、移行時には固定base/config/tokenizerも必要。

## 原本・重みの保全

`runtime_originals.zip` は133,322bytes、SHA256 `26640cd4d6329d43956f800454fff4c1d8146b30a31f2db77ba5f8b86089bdf0`、32payload＋manifest/33member。run/13行学習/112load・reload/無補修raw2/CMEE実診断/CPUsource・plan・runner/終了logを含む。runのRAW_COMPLETE_PENDING_CMEE_AND_BODY_REVIEWはその時点の原本のまま凍結し、最終不採用を本README/summaryへ分離した。

[追加重みと原本一式](https://chatgpt.com/library?file_id=libfile_14be2da0d6588191b85c397de5baad0a&account_id=personal) は14,781,111bytes、36payload＋manifest/37member、SHA256 `0dfbbf4a21fd0031feecffea426be5e3d4f94e7cdb1dbdf545dfa1159177c2f4`。Library version0へ保全。実GPU原本・重み・CPU原本ZIP459970bytesを同梱。両ZIP全CRC/member hash/size、CPU inner ZIP同一、112F32全parameter有限性をPod外でも照合した。前回d431/c7baの保全先は置換しない。

新観測会は今回の形式・参照・全更新の不成立を直すためには不要。次は既存原本から、出力構造と本文を完結して生成できない不足を見直す。時間枠延長だけの追加有料試行へ進まない。新wireのCPU成立と実4Bの0/2を混同せず、4Bの能力限界とも結論しない。

root単独書込/実行、別文脈agentはread-only照合。独立Pro/Ultra・正式human Product Readとは呼ばない。商品0/正式0/3/全体54.50％、candidate_ready=false/automatic_progression=false。STRUCTURE_MAP_DELTA_NONE（今回の実行/回収自体は構造変更なし。承認後接続APIa8be7a9bは直前checkpointのSTRUCTURE_MAP_DELTA_PRESENT）。
