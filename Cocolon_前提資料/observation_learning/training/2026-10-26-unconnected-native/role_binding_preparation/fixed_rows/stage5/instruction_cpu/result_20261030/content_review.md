# 全実rawの内容確認と限界

rootとread-only補助が新2raw・before3rawを全文読了。原rawの閉じ括弧追加、文字列→配列変換、alias補完、field修正、再生成は0。

| 実call | before（同9b・旧指示） | 今回（同9b・修正指示） |
| --- | --- | --- |
| BOOK S1 | 640token、EOSなし、alias表へq連番増殖、引用表未到達 | 339token、EOSあり。raw1155字、parserはchar1155でExpecting comma。最上位が閉じていない。既閉の第3配列へalias2列10行とquote様4列10行を混在し、独立quotes欄を作れていない |
| SHOP S1 | 498token、EOS/strict JSON/root4、alias3/quote16で構造通過 | 303token、EOS/strict JSONだがroot3≠期待4。第3配列19要素は[a,aliases]一組と18文字列で、q行を配列ではなく文字列にし、第四のquotes欄がない |
| SHOP S2 | 1276token/EOSだがroot1≠期待3 | S1停止のためNOT_RUN。before S2と同条件のafter比較ではない |

BOOKではaliasのactual_identity位置へlate_return/apologize等のrole名を入れ、実source IDやprior snapshot IDを出していない。補足回答のquote様行もanswer_text_privateでなくmemo/memo_actionへ誤配する。閉じ括弧だけを足せば解消する問題ではない。SHOPも実identityと原文引用を提供できていない。これらは未修復rawの静的所見で、今回CMEEの意味判定で拒否された理由ではない。実新モデルrawのCMEE受口呼出は0。

第1区間のEOSはbefore1/2→今回2/2だが、構造通過はbefore1/2→今回0/2。短縮/EOS到達を商品品質改善へ変換しない。新しい意味候補の全13位置、本人向け本文、採用snapshot/coldは一件も成立していない。run原本のstages_completed=1は保存したstage record件数で、有効区間成功は両題0である。

両S1の前段候補は空。実messagesはCPU最終builderと一致し、prompt4316/4468、同base/revision・同9b保存重み・同helper/dependency・greedy・同capを保持した。学習0/非学習1load/実2callだけなので、今回の指示整理だけではこの保存モデルのalias/quote構造と原欄束縛を成立させられなかったと判断する。一般的な4B能力上限・必要学習量・教材不足・全ての原因は未確定。旧A/B部分課題自体も未習得だった履歴を無視しない。

新2意味/本人本文0/2、完成derived packet/実新CMEE/saved/cold0、旧9新生成NOT_RUN。旧9の当該重みでの保持も未確認。新しい本人向け本文は0なのでProduct Read候補をMashへ戻さない。原2教師には内容があり、追加観測会は今は依頼しない。

同じpaid試行、cap延長、形式補修、再学習、次prompt探索は自動追加しない。次の読取対象は既存教師/学習入力におけるactual source ID・原欄・alias/quote・roleの対応であり、新しい有料runの承認・案は今回作らない。primary=BLOCKER_NARROWEDは『全文構文指示の除去だけでは不成立』の限定観測、technical/product credit0、正式0/3・54.50％、candidate_ready/automatic_progression=false。
