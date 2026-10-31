# 10/28 — named9の一回結果：保存再読込まで完了、CMEE採用は0/2

状態：**CLOSED_NOT_ADOPTED_NO_RETRY**。新しい継続指示に基づく一回を終了。前回named13の一回枠を再利用していない。[固定準備・CPU・plan](../named_reference9_preparation/README.md) と最新weekly§88に対応する。

source `bc8d3c471aefb960d81c8a692873ce183dd2d789`、API `a8be7a9bceed35a9f3cb843f22de05bbd5bc6e18`。初期284fの別コピーから、新AdamW/LR5e-5、BOOK/SHOP各3＋旧chair初回/訂正・daily代表各1の9更新。全15学習/評価bytes・実messages・教師・loss・reader/caps不変。別保存9ba8dccb・112F32/3,833,856parameter、112変更、全112の完全一致/no-grad再読込後にBOOK/SHOP各1生成。before0、追加生成/retry0。

| ケース | 出力・終端 | 実receiver→意味owner | 意味/本人本文 |
|---|---|---|---|
| BOOK回答後 | prompt4422→3712、165.335528秒、EOSなし/length、未閉鎖 | TOKEN_LIMIT→REJECT/semantic_receipt_not_validated | 0/0 |
| SHOP回答後 | prompt4586→3014、132.532761秒、EOSあり/stop、通常JSON閉鎖 | INVALID_FORMAT→REJECT/semantic_receipt_not_validated | 0/0 |

計意味/本文0/2、採用snapshot0・cold-file対象なし。SHOPのEOS/JSONと11claim/6relation/3本文欄の出現は前回より完結性が進んだが、root vの入れ子・旧新表記/数値参照混在・引用帰属不正・全8更新中1だけで採用不成立。BOOKは回答語句が出る一方で元意味の消失・role誤割当とupdate_note反復が残る。raw修復や欠落意味補完は0。全source/prior/教師/本人本文/原rawを読んだ [読解記録](reading_review.md) を参照。独立Pro/Ultra/human正式Product Readではない。

GPU処理537.575494392秒・$0.0418114273按分、600秒/$0.047以内、GPU exit0/timeout0。準備/CPU/回収/稼働保持/保存/通信/税等は別で、請求総額ではない。新CPU6.691308秒はmodel0、前回347/旧15完全一致/合成named2 cold証拠はhash照合再利用で再実行ではない。実rawのCMEE CPU1.719454896秒、model load/forward/学習/生成/SQL0。

新重み `9ba8dccb37953000d7b2f2700f796dd89bc75a6e1b9d664199f6dafd024449d8` は通常不採用。元284f・元d431・初期コピー・source不変。実runのpending名とAUTHORIZED_ONCE_BOUND planは実行前/原本として凍結し、最終状態は本README/result_summary.jsonが所有する。閉鎖した同runの再起動・上限延長・reader緩和・新run自動進行なし。

| 保全物 | bytes・SHA256・照合 |
|---|---|
| runtime_originals.zip | 108328、3f5f28e3585ae835e0f86b72b1ad08b09fedcb08d39efc12dabf2d4ad8ccb9b1、24payload＋manifest/25member |
| 追加重み＋全原本 | 14374039、ff812e0708e2bd831796070cdeba4090476d67dfb7e2a200c83ae0ca5939407e、28payload＋manifest/29member |
| CPU原本 | 既存照合済み72057bytes/SHA1a5be34bd4230416ae34635587237e834a51ed03d607cde44f6f5f76a3842c32と入れ子ZIPが完全同一 |

Pod外で全ZIP CRC/member/hash/size、small/full共通payload、raw/run保存SHA・plan、112F32有限/形状/3,833,856parameterと初期284fの同構造を確認。[追加重み原本](https://chatgpt.com/library?file_id=libfile_52309bdfc88881918095f167afe8f12d&account_id=personal) version0を新規保全し、前回284f/c7ba等を置換しない。詳細はexternal_verification.jsonとweight_verification.json。

商品0/正式0/3/54.50％・candidate_ready=false/automatic_progression=false。既知回答後2件の有限適合確認で、全15新評価/旧9回帰/新初回4/動的thread/未知一般化/実service-SQL/本人端末/他core/商品受入れではない。通常app/API/DTO/DB/RN/Render/Supabase/公開/merge/deploy変更0。STRUCTURE_MAP_DELTA_NONE（既存学習条件のみ）。GPU稼働保持、Stop/restart/delete/管理API0。

観測会は現不具合の解決には今は不要。残るのは新旧表記、原意味/全更新と本人知覚・程度・時点の保持。今回原本と既存prompt/教師の比較へ戻り、同じLR/回数調整を自動で追加しない。
