# 全2 rawの本文読取と静的所見 — 2026-10-30 JST

root華恋とread-only補助が両S1 rawを全文読了。本人向け完成本文は0で、MashへProduct Read候補を提示しない。rawの括弧追加・補修・再生成・consumer再実行は0。

| case | 今回の実出力 | 成立しなかったこと |
|---|---|---|
| BOOK | EOS311token、source2＋priorのalias3を実identityで宣言。alias/quoteを別配列にし、全10quoteが正しいsource/fieldに一意に存在 | 最外root閉じがなくJSON不成立（char834）。教師17quoteに対して10quote。作用域・関係の完全引用群が揃っていない。意味/本文0、S2以降未実行 |
| SHOP | EOS427token、正しい3identity。別配列の14quoteが正しいsource/fieldに一意に存在 | 最外root閉じがなくJSON不成立（char1128）。教師18quoteに対して14quote。完全否定/譲歩等の必要引用群が揃っていない。snapshot aliasはs2で、指示の@p0との差もある。S2以降の効果は未確認 |

直前の指示整合runではBOOKは意味role名をactual identityへ入れ、補足fieldをmemo等へ誤配し、両件でalias/quoteが混在していた。今回はこの混同が実2出力で現れなくなった。一方、両件ともJSON全体が未完結で、教師の必要引用群との差が残る。これは限定的な出力変化であり、意味採用・本文・商品品質の改善ではない。

verificationの子配列読取は、raw内に既に完結している4つの子値をそのまま読む静的inspectionである。raw全体を修復せず、修復packetを作らず、採用判定/CMEEへ渡していない。実拒否理由はJSONDecodeErrorのまま保持する。『括弧だけを足せば成功』『4Bでは不可能』『教材不足』とは判断しない。

元の2教師には正しいsource対応と必要引用があるため、今回の基本不成立を補う新観測会は不要。次は既存の正解/学習targetと実自由生成に残る末尾構文・引用被覆を照合する判断へ戻るが、新prompt探索/追加学習/次の有料runを自動開始しない。旧9維持は今回未確認。
