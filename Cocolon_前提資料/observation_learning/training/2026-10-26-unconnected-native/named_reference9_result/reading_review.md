# named9 — source・prior・教師と実rawの全文確認

対象は既知BOOK/SHOP回答後2件。rootと別文脈read-only agent2枠が、同一のsource/prior/教師・実raw全体を照合した。独立Pro/Ultra・本人の正式Product Readではない。rawの修復、閉じ括弧追加、意味補完、再生成は0。

## 実receiverと静的読解の区別

BOOKは3712token/length/EOSなしでTOKEN_LIMIT、SHOPは3014token/stop/EOSあり・通常JSONとして閉鎖しているがINVALID_FORMAT。両方とも既存意味ownerはREJECT/semantic_receipt_not_validated、意味/本人向け本文0/2。意味内容の審査でUNSUPPORTEDになった結果ではない。採用snapshot0でcold-fileの対象なし。

以下は無補修rawの静的な不足の読解で、受理済み意味へ変換しない。SHOPのnested objectを読むことはrootを書き換えて再受信することではない。

## BOOK

元入力は返却遅延と謝罪、友人の「大丈夫」と残る気がかり。本人回答は、自ら週末返却と言っていたのに遅れると分かった時点で連絡しなかったこと、本は返したこと、「一言伝えておけばよかった」という反実的振り返りと現在も残る気がかり。教師は元4claimを保持して回答6を足す10claim/7relation/全7更新、自然な観測・受け取り・変更説明を要求する。

出力は冒頭 `{"v":{"a":{"claims":...`。vはschema文字列ではなくobject、旧long key/数値参照と新prose/binds/cr/rr/urが混在する。完結claim6は次のとおり。

| 出力ID | 原文・教師との差 |
|---|---|
| late_return | 「自分から週末に返すと言っていた」へ置換し、発言をEVENT化。元の返却遅延ではない |
| late_awareness | 「遅くなると分かった時点で」。時間表現と主節の束縛は未成立 |
| no_contact | 「連絡しなかった」のNEGATEDはある |
| returned | 「本は返した」はある |
| self_statement | 「一言、遅くなるって伝えておけばよかったな」へ誤割当。反実的振り返りを既発言扱い |
| continuing_concern | 「まだ気になっています」の現在はある |

謝罪・友人の大丈夫・元の気がかりがclaimから消え、counterfactual/COUNTERFACTUAL_APPRAISALも欠落。回答語句が前回より出ても、元意味を保持した改善とは扱えない。

prose.bindsは完結68object、そのうち同一update_note binding66回の反復。ur=[missing_explanation]はgap名で出力update名ではない。returned_concernは教師にない関係名。実relations本体・全7更新操作・引用q・本人向けobservation/reception/update_note文字列に未到達。全anchorが回答source直書きでも有効な引用束縛にはならない。末尾は未閉鎖で、抽出した完結fragmentの個数を全体JSON成立へ変換しない。

## SHOP

元入力は友人の開店を知って祝いのメッセージを送り、うれしさと少し置いていかれた感覚があること。回答は以前の二人の店の話、共同準備・約束の否定、友人の側で未来が現実になったという本人知覚、話していた頃から少し離れたような寂しさ。教師は11claim/6relation/18quote、7ADD＋gapのみINVALIDATE_GAPの全8更新を要求する。

今回のrawはEOSと通常JSON閉鎖に到達し、11claim・6relation・引用11・3本文欄が出た。前回のq反復は消えた。これは限定された完結性の改善であり、CMEE採用/本文成立の件数改善ではない。

rootはvだけで、その値にa/c/q/vが入れ子。正しいv/a/q/c rootではない。claimはabout_time/claim_id/evidence_indexes/predicate等の旧名とsubject/timeの新略記が同居、evは数値のまま、time.at_sourceは@s0等でなく@claim名。identity表に回答s1がなく、q.sはsource直書き、q.fは全textで実field名ではない。shared_talkを元入力へ帰属し、関係evはconnector全体の引用にならない。最後のrelation ev=[11]は引用11個の外を指し、scopeもrelation IDでなく数値。

実updatesはADD_felt_distance1件だけ（教師8）。prior=@missing_explanationはidentity未定義、felt_distanceへdistance_linkを誤添付し、必要7ADD/INVALIDATE_GAPを満たさない。proseのupdate_note bindingsにもurがない。

本人向け本文を全読すると、元の祝い・喜びと置いていかれた感覚、共同準備・約束の否定は出る。一方、「友人の方ではもう現実になっていたのですね」「少し離れてしまったのですね」は原文の本人知覚/「ようで」の留保を事実へ強める。「少し」はこの文では保持される。寂しかった過去を「寂しい」と現在化し、本人への短い受け取りが出来事の再掲へ偏る。update_noteは内容の再掲で、全更新の束縛ではない。

## 結論と残件

BOOK学習loss1.509221→1.197449→0.930014、SHOP1.570469→1.277841→1.042610。正解文を与えた誤差の低下と、自由生成/根拠/全更新/本人本文の成立を分ける。前後同一重みで全15を新評価しておらず、旧3代表の学習を旧9回帰成功へ数えない。LR/配分/開始重みを同時変更したため単一因果は確定しない。

新9ba8dccbは通常不採用、284f/d431を保全。新旧表記の混在、原意味保持、全更新と本人知覚・程度・時点を保つ本文が未達。新観測会を必要とする教材不足、または4B能力限界を証明した結果ではない。次は今回原本と既存prompt/教師の新旧表記を比較する。LR/回数の連続試行や新contractへ自動で進まない。
