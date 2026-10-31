# named13 — 原source/教師と実rawの全文読解

rootと別文脈read-only agent2枠で、BOOK/SHOPの原source、prior、完成教師、無補修実raw全文、13行学習log、CMEE実診断を照合した。独立Pro/Ultra/human Product Readではなく、商品受入れやcandidate-readyを生成しない。

## 実際の受領・採否

| 回答後 | 実prompt/output | 生成秒 | EOS/JSON完結 | 実receiver→意味admission | 意味/本文 |
|---|---:|---:|---|---|---|
| BOOK | 4422/3712 | 161.626378 | なし/未完結 | TOKEN_LIMIT→REJECT/semantic_receipt_not_validated | 0/0 |
| SHOP | 4586/3584 | 146.500764 | なし/未完結 | 同上 | 0/0 |

元の出力を補修せず明示named receiverへ渡した。`finish_reason=length`の優先によりTOKEN_LIMIT、receiptが採用可能な状態でないため既存意味ownerがREJECTした。意味readerが候補内容を検査してUNSUPPORTEDと判定した結果ではない。以下の内容面は別の静的読解で、JSONを閉じたり並べ直して再採用した証拠ではない。contextは8134/8170≤8192であり、入力切捨て・context超過ではない。

## BOOK

先頭から `{"v":{...` とvをobject化している。正しいvは版文字列で、rootはv/a/q/c。a内へclaimsを入れ、旧long key・数値evidence_indexesと一部のbind/ev/prose略記を混ぜた。

完結しているclaim objectは初回のlate_return/apologize/reassurance_received/remaining_concernの4件だけ。教師10件に対して回答の6意味をclaimへ追加していない。prose.bindsにはupdate_noteの参照objectが117個まで現れ、self_statement/no_contact系57回、remaining_concern/no_contact系55回などを交互に反復して打切られた。urはモデル自身のupdate名ではなくclaim名。実update操作、引用q、本人向けobservation/reception/update_note文字列には到達していない。

回答中の語や役割名がbindingへ現れたことは、回答理解・全7更新・GAP解消・本文成立の証拠ではない。原入力の一部を保持していても、完成した回答後候補を返せていない。

## SHOP

同じくvをobjectにし、その下へa/c/qを入れている。完結したcに見えるのはclaim1/関係1/update1で、教師11/6/8から大きく欠ける。proseは必要なobjectではなく「昔からの友人が店を開いたと知って、お祝いのメッセージを送ったのですね。」という初回actionの一文だけ。回答後の知覚の留保、喜びと寂しさ、非共同準備/非約束、説明と残る経験を本人向けの本文へ統合していない。

qは84個の完結object（固有26組合せ）まで反復する。同じ知覚文をanswer_explains_targetとして原入力source/回答sourceへ交互各24回割り当てる箇所がある。全q.fは実欄でないtext、q.sは@aliasでなく実ID直書き。aに回答source用atomがなく、at_source=opening_knownはsource aliasでなくclaim名、唯一ADDのprior=missing_explanationはsnapshot参照でなくgap名。

存在しないquote名action_link、存在しないclaim celebration_sent、重複quote名を参照する。本人の「以前、その友人と…」を「昔からの友人と…」へ変えた引用や、補足文をFT-SHOP-Oの原入力へ誤帰属した引用もある。文字列上ADD1件が見えても、有効な必要8更新とGAP解消が成立したとは扱わない。

## 学習logと解釈の限界

13更新の対象lossはBOOK1.688519→1.557239、SHOP1.732363→1.615953。旧9の学習lossは約0.0014〜0.0023。いずれも学習時の値で、旧9の新自由生成回帰ではない。今回と旧quote形式では正解系列と表現課題が異なるため、旧runのlossとの単純比較を品質差へ読み替えない。

今回、参照名へ置換するだけでは自由生成で新wire/意味/全更新/自然な本文を再現できなかった。冒頭の構造不正・新旧表記混在・反復があり、上限延長だけで解消する状態とは言えない。4Bの能力限界、一般的なmixed学習の不可能性、receiver/readerのbugを証明した結果でもない。

新284f1df7は通常不採用。採用snapshot0、実生成のcold-file対象なし。CPU合成教師のcold2成功は別の確認範囲として保持する。現不具合の解消に新観測会を必要とする教材不足の証拠はなく、まず既存原本から出力構造・参照・全更新・本文を完結して生成できない点を見直す。同じ有料反復、追加forward/生成、raw補修、reader緩和へ自動進行しない。
