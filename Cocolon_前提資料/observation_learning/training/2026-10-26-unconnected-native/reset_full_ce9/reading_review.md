# d431開始値対照：全raw・教師・本人向け本文の読解

2026-10-28。source964558b63e1f2a7e8a5fc9617b760ca275975055、API7b9ee073de03940ba71587297d8600b2b6094dd1。rootとread-only helperが両件全文を読んだ。正式human Product Readではない。以下の静的所見を実receiverの判定へ読み替えず、raw補修は0。

## 実結果と対照

全15入力/教師bytes・元helper全文assistant＋EOS CE・9順・LR5e-5・seed・fresh optimizer・生成枠は前回Full CE9と同じ。開始重みだけ284fから元d431へ戻した。9更新・別保存・112F32のno-grad reload・2生成を523.411685174秒、処理按分$0.0407097977で終了。準備/CPU/回収/保持/保存/通信/税等は別。

| 条件 | BOOK | SHOP | 全体JSON完結 | 意味/本文 |
|---|---|---|---|---|
| 前回284f/Full CE9 | EOS、named未定義参照 | EOS、named重複参照 | 2/2 | 0/2・0/2 |
| 今回d431/reset9 | EOS、root閉じ漏れ | 3584tokenで参照反復打切り | 0/2 | 0/2・0/2 |

今回の実receiverはBOOK INVALID_FORMAT、SHOP TOKEN_LIMIT。実CMEEは両REJECT/semantic_receipt_not_validated。意味snapshot0でcold再読は対象なし。新1aef046eは通常不採用。開始値だけの変更で、この固定9更新の根拠・全更新・本人向け本文を成立させられない。旧named13からの持越しだけが原因という仮説は支持されないが、特定の学習行が原因とも4B一般の限界とも断定しない。

## BOOK：役割の混線と回答復唱が残る

2801token/124.166184667秒、EOSあり、rootの閉じbraceがなくJSON全体未完結。形式を直して意味採用した実験は行っていない。

10引用のsource/fieldは実在し、名前は一意。前回の不正fieldは見られない一方、late_awarenessとreturned、no_contactとcontinuing_concernが同じ原文箇所を重複使用する。原4claimは保持するが、late_awarenessは「本は返したのですが」、no_contactは反実の後悔と現在の気がかり全体、counterfactualは実際に連絡しなかった説明へずれる。counterfactualの時点も教師のANSWER_TIMEから過去へ変わる。任意IDの表記差自体を欠陥とはしない。

説明relationはcounterfactual→no_contactとなり、元の気がかりを説明対象へ結ぶ関係ではない。記述上は6ADD＋GAPの7更新でも、returnedのADDがなく、既存remaining_concernのADDが入る。附属relationの対応やGAPの根拠も混線する。件数7だけで全更新を満たしたとは扱わない。

Observationは元入力の再掲。Receptionは一人称の本人回答を反復し、「本は返したのですが。」と不自然に切れる。update_noteも回答を並べ「まだ気になっていますを解釈しました」と終わる。語りかけ・自然な受け取り・今回の回答による読みの更新は未成立で、Mashへ商品確認を戻す品質ではない。

## SHOP：引用の増殖と参照反復で本文へ未到達

3584token/159.412706634秒、EOSなし、出力上限で文字列途中に停止。未変更receiverは長さを優先してTOKEN_LIMITにする。後段の意味検査でUNSUPPORTEDだったとは報告しない。

20引用名・15claim名は一意で、前回の重複IDとは異なる。ただし20引用は15のsource/field/text組に重複し、正しい指定欄にあるものは18。「うれしかったけど」は元memoの表現なのに回答欄へ割り当て、「うれしかったけど、寂しかったです」は原欄に存在しない連結引用である。

本人の一つの知覚を、聞いた時点・二人で話した未来の断片・友人側の現実へ分け、距離の知覚も複数roleに増殖する。time.exprには出来事の時点でなく内容を入れる。二つの否定も、教師が保持する共通の否定作用域全体を根拠にできていない。任意のcid名の違いだけを欠陥に数えない。

relationsの二つ目のevで4参照名が45周、180項目反復し、次の文字列途中で切れる。updates/proseには到達しない。SHOPの本人向け本文を読了・不合格と自己採点したのではなく、本文が生成されていないと区別する。

## 検証・保全・停止

新CPU6.74900014秒、実model load/forward/update/generation0、CUDA未初期化。全15token列とbytes、厳密な9順/57730token/長二乗和398780542、112key/shape/F32/有限性、LoRA設定の同意味（target_modules順だけ差）を確認。同API353成功は照合再利用、再実行ではない。元helperのCPU mock証拠も再利用で今回mock0。

初回CPUはmanifest固定値の転記誤りでPACK作成・model前に停止。修正は原本値への一行のみ。最初のlauncherも文字列改行の構文誤りでlock/runner/model前に停止した。構文確認したtracked launcherへ直した後の実model試行は一回。両失敗source/logを保全し、GPU再試行と区別する。途中画面の更新数/BOOK完了の誤読は原本カウンターで訂正。生成中の空BOOKファイルを読む回収準備1件はJSONDecodeErrorで止まり、実model・raw・採否へ影響0。

全原本16,114,991bytes、149payload＋manifest/150member、SHA256 4467162042edf848fc34415c4f01d1c63c48dab33b3e96f4055891fbe807d111。Pod外の全CRC/hash/size、実source5/API全source、CPU原本一致、earlyBOOK一致、112F32/3,833,856parameter有限・初期/reload同形状を照合。Library libfile_b74941080fec8191b174c5583e26683f version0へ保全。元4B全重みを含む単独モデルarchiveではない。原d431/284f/全旧候補を保持する。

primary=BLOCKER_NARROWED、商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false。GPU保持、Stop/restart/delete/管理API0、SQL0、通常app/公開API/DTO/RN/Render/Supabase/merge/deploy変更0。Supabase project inventoryはACTIVE_HEALTHY、本人row照会0。Renderのworkspace未選択でlive再確認は行わず、過去の配置を今回確認へ昇格しない。

次の最小作業は、既存教師の意味・全更新・本人向け本文を落とさず、長いpacketのquote→role→更新→本文を段階的に学ぶ教材表現案をCPUで具体化すること。未準備・未実行。開始値/LR/回数だけの追加GPU、brace補修、reader緩和、次run自動開始はしない。今回の固定2件には完成教師があり、追加観測会は現欠陥の解消に不要。一般化・Piece/Analysis教材・本人端末の残件は別である。
