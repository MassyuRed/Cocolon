# 13更新後raw2件の静的読解（2026-10-28 JST）

元source/教師は実行時の `runtime/eval_inputs.json` / `runtime/train_messages.jsonl`。生成原文は無補修で、合否は未変更API64の `run/cmee/diagnosis.json` が所有する。以下の静的指摘を、実CMEEが到達して検査した理由へ置換しない。

## BOOK

- 3712token、finish_reason=length、EOSなし、strict JSON未完結。実CMEEはTOKEN_LIMIT→REJECT/semantic_receipt_not_validated。
- 引用配列で「まだ気になっています」を反復し、完結した引用object66個/固有組合せ14個の後も未完結。上限だけ延長しても意味参照の成立は保証されない。
- self_statementが「遅くなると分かった…」、late_awarenessが「本は返した」を指す等、claimと根拠indexがずれる。生成した受け取り文も元の回答欄の引用として混入する。
- updatesはADD1件のみ。教師の6ADD＋INVALIDATE_GAPの7件を再現せず、target_kind=UNKNOWN/target_ref=missing_explanationへ複数replacementを束ねる。
- receptionは「遅くなると分かった時点で連絡しなかった」を概ね保持するが、update_noteは回答後も「気がかりの対象は未記載です。」で、説明追加と整合しない。

## SHOP

- 2693token、finish_reason=stop、EOS到達、strict JSON成立/重複keyなし。実CMEEはCANDIDATE_UNREVIEWED→UNSUPPORTED/model_evidence_out_of_scope。
- 15引用は原欄の文字列として成立するが、perceived_realization index4は原入力の開店・祝福文、felt_distance index5は元の感情文を参照し、本人回答sourceと対応しない。answer_joy index9は未来の現実化、answer_sadness index10は「うれしい」を指す。
- updatesはADD1件/教師8件（7ADD＋GAP解消）。update_noteのupdate_refs=[0,1,2]は実updates1件と合わず、GAP解消もない。
- 「と感じました」を「もう現実になっていたのですね」と事実化し、同内容がobservation/receptionで反復。「寂しかったですと聞けて」も自然な本人向け本文として不成立。

## 次の直接作業

この13更新や出力上限延長だけを再試行しない。既存教師が含む引用・意味・更新の対応を、長いpacketの自由生成で再現できない原因から、学習方法と出力分担を見直す。短い参照形式へ変更するなら既存wire/意味検査との同等性と契約差分を具体化してから扱う。今回rawを補修して成功へ数えず、readerを緩めない。現不具合への新観測会は不要で、未知入力・一般日本語や商品品質が完成したという意味ではない。
