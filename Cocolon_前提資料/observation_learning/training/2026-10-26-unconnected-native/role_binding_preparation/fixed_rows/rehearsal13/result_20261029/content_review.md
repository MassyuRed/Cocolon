# 全11原文・成立9本文の読了記録

root華恋がraw_text全文、成立したobservation/reception/update_noteと問いを確認した。実CMEE分類はcmee_summary.json、全元receipt/outcomeはcmee_originals.zip、元rawはafter_*.jsonlを参照する。別のreaderにrawを補完させたり、意味検査を緩和したりしていない。

| case ID | 実結果と読了所見 |
|---|---|
| FT-BOOK-AFTER-ANSWER | EOSあり/2371。INVALID_FORMAT→REJECT/semantic_receipt_not_validated。alias列がs0/s1/p0の宣言にならず、未定義@s0/@s1/@p0を使う。claim以降にarray/object/文字列が混在。末尾「少し安心しました」などの未採用proseもある。これらは静的所見でactual意味検査理由ではない |
| FT-SHOP-AFTER-ANSWER | EOSなし/3584cap。TOKEN_LIMIT→同REJECT。alias/qは一部正しいがclaim/relations/unknown/update/bindにobject/array混在。未定義q_answer_concession、unknown追加、更新target_kindや参照の混同、observation反復が見える。実拒否はfinish優先のTOKEN_LIMIT |
| TRAIN-SERVICE-CHAIR-01-INITIAL | 意味/本文/cold成立。椅子修理・再使用・「全部一人で」への喜びを保持し、その個人的意味を問う。raw_textは元f493と同一 |
| TRAIN-SERVICE-CHAIR-01-CORRECTION | 同成立。共同修理と再使用への喜びへ訂正、REVISE2＋INVALIDATE_GAP1、更新注記、最終END。訂正前soloを復活させない |
| TRAIN-SERVICE-CHAIR-02-INITIAL | 同成立。01初回と同文のID違い。原文の「して、」を保持、raw_textは元f493と同一 |
| TRAIN-SERVICE-CHAIR-02-CORRECTION | 元f493では未成立、今回は成立。friend_guidance/joint_repair・joy_ground_revised・gap失効の3更新と正しいprior/source IDを保持。本文は共同修理・捨てずに使える喜び |
| TRAIN-SERVICE-CHAIR-03-INITIAL | 同成立。01初回と同文のID違い。raw_textは元f493と同一 |
| TRAIN-SERVICE-CHAIR-03-CORRECTION | 元f493では未成立、今回は成立。02訂正と同様の3更新、prior/source IDを保持。本文に旧soloなし |
| TRAIN-DAILY-CALM-01-INITIAL | 同成立。帰宅→うどん作り/食事、あたたかい食事と少し落ち着いたことを保持し、問いなしEND |
| TRAIN-DAILY-CALM-02-INITIAL | 同成立。同文のID違い、時間順序/原文の程度を保持、問いなしEND |
| TRAIN-DAILY-CALM-03-INITIAL | 同成立。同文のID違い、時間順序/原文の程度を保持、問いなしEND |

全9成立はそれぞれ保存済snapshotと別process coldの全outcomeが同値、全11は元raw/metadataからのreceipt replay同値。元成功7は椅子01初回/訂正・02初回・03初回・DAILY3で、全IDを維持した。旧9原文は3初回だけ元f493とbyte同一で、残6を同一rawとは記録しない。

全旧9は学習内FITであり、椅子3組やDAILY3組のID違いを独立の未知内容へ数えない。従来教師の「私もうれしい」「よかったです」等の再現を、人間の商品受入れや自然文品質改善へ上乗せしない。新2の成立は0、実service/通常保存/本番への追加接続0。新2未達により一回全体は不採用・追加実行なしで閉鎖する。
