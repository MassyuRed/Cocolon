# named prior projection9 — 実raw2件の全読解

入力原文・採用済みprior・全teacher・実rawをrootとread-only補助agentで全文比較した。採否は無補修の実receiverを正とし、以下の静的読解でrawを直したり意味採用へ昇格したりしていない。

## 結果

| 対象 | 実生成 | 実receiver / 意味 | 本文 |
|---|---|---|---|
| BOOK | prompt4382 / 3712token、159.155233秒、EOSなし | TOKEN_LIMIT → REJECT / semantic_receipt_not_validated | 完成本文未到達 |
| SHOP | prompt4534 / 2539token、107.492539秒、EOSあり・通常JSON完結 | INVALID_FORMAT → REJECT / semantic_receipt_not_validated | proseがstringへ崩れ、本人向け観測/受け取り/更新欄は成立せず |

意味/本人本文0/2、採用snapshot0、cold保存再読は対象なし。これは実意味審査でUNSUPPORTEDとなった結果ではない。

## 入力表記修復による限定変化

旧rawにあったabout_time/claim_id/evidence_indexes/predicate/relation_id/surface_proposal/anchor_source_idは、新rawでは両件とも0。compact keyと名前付き参照を使う方向へ変わった。BOOKは旧6claimから10claimとなり、元の返却遅延/謝罪/大丈夫と言われたこと/残る気がかりの4つと、self_statement・反実modalityが見えるようになった。SHOPは11claim/6relationを維持し出力2539tokenへ短縮、EOSに到達した。

ただし、採否・本文成立は改善していない。prompt変更とそのpromptを使った9更新の組合せであり、変更単独の因果効果・一般化を証明しない。

## BOOK

実rootは`{"v":{"a":...,"c":...`という入れ子から始まり、vが版文字列ではない。途中までのclaimにも未成立がある。counterfactualの原文『一言、遅くなるって伝えておけばよかったな』から『一言、』が落ち、continuing_concernは本人の『まだ気になっています』ではなく反実文へ誤割当されている。no_contactのtime.exprは教師と同じだが、time.evがその時点の引用を指さず、行動引用を指している。

prose.bindsのupdate_note.urが、update$idではなくrelation名を487完結文字列まで反復（returned_concession122、answer_explains_target/concern_content/awareness_time各121、その他2）して打切り。これは文字列の静的計数で、487更新を生成した意味ではない。q/relations本体/updates/完成したobservation・reception・update_noteへ到達していない。全7更新は確認できず不採用。

## SHOP

JSONは閉じたがroot keysはvだけ、内側にa/c/q/vが入っている。出力aにはp0/s0だけで回答sourceのaliasがない。全18quoteを原入力@s0へ付け、原source/field内で一意一致するのは7、不一致11（q4、q6〜11、q14〜17）。回答をmemo_action/memoへ誤帰属する。回答7claimのtime.at_sourceも全て@s0、expr=nullで、本人の説明時点と引用時点を保持できていない。

共同準備/約束の否定は、必要な共有否定文全体を根拠にせず短片だけ。felt_distanceは『あの話を一緒にしていた頃から』で切れ、距離の述語・少し・ようでが脱落。updatesはADD0/INVALIDATE_GAP1だけで、全8更新を満たさない。その1件もprior=@s0（source alias）、根拠は元felt_left_behindで、実prior/回答の根拠に結び付かない。

前回の3本文欄objectから、今回はproseが長い一人称stringへ退行。教師のobservation/reception/update_note/bindsが消えた。冒頭は本人の『と感じました』を『と知りました』へ事実化し、同内容を反復する。本人の話を受けたEmlisの応答になっていない。

## 判断と次の境界

入力内の旧新表記混在を除去したことはCPU往復と実rawで確認したが、root階層・引用のsource/field帰属・update参照反復・全更新・本人向け本文は未成立。新b8bcb6f9重みは通常不採用で、追加/途中重みとして保全する。既存284f/d431/旧9ba8は変更しない。

今回の誤りは、既にある正しい教師とrawの違いで説明できる。新観測会が必要な教材不足や4Bの能力限界を証明していない。次に必要なのは、平坦なv/a/q/c、source-bound quote、update$idの既存教師と実出力の差を、学習方法の判断へ戻すこと。同条件9更新や新しい有料runへは進めず、出力を補修するparser・採用条件緩和・追加checkerを増やさない。

商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false。未知入力・旧9新回帰・動的thread・通常service/本人端末・他coreの合格は得ていない。
