# 全raw読了 — syntax2b

root華恋がBOOK11186字、SHOP8757字の未修復rawを全文読了した。成立した本人本文は0件。閉じ記号の追加、named復元、意味補修、採用、追加生成はしていない。

BOOK：c[0]は10列claimを1件で閉じる。元のlate_return claimだけで、教師の10claimを保持していない。続くapologize claimがc[1]のconflictsへ入り、c[2]coreは@s0、c[3]questionは[q_reassurance_received]になる。c[4]relationsで完結した22行中、同じ行が18回出現し、次行の途中でcap。列数を守れることと意味配置の正しさは別だった。q_no_contactの引用本文も「遅くなると分かった時点」であり、連絡しなかった行為そのものの引用になっていない。

SHOP：c[0]には10列claim12件があるが、教師は11件。元と回答側でfelt_left_behindを再使用する。answer_joy、felt_distance、answer_sadnessへ開店・未来の引用を誤って対応付け、本人の知覚をASSERTEDへ寄せた箇所がある。後段のrelations/schema/updates/文章はc[1]conflictsの任意JSON内に入り、本来のc[8]proseへ到達していない。文章断片では「私は」「あなたの側」で観測者と本人・友人の方向が混ざり、同じ文を41回反復する。@p0を9回参照するがp0宣言なし。awareness_no_contact等の別題材語彙もある。現SHOP specにもBOOK用説明句があるため、その混入を学習記憶だけが原因だとはしない。

実CMEEの拒否は両TOKEN_LIMIT→REJECT/semantic_receipt_not_validated。これらの静的所見を「実CMEEが引用/更新/本文で拒否した」とは記録しない。raw全体は未完了の型適合prefixで、完全JSON/受領形式/意味/本人本文の成功ではない。receipt replay2は元receiptの同一性だけを示す。snapshot0/cold対象0で、保存再読成功には数えない。

CPUの追加token問題は解消し、実mask遅延も約7秒/件で上限内だった。残るfieldの配置、根拠との対応、完成・反復停止は構文支援だけでは成立しなかった。正解のclaim数・ID・引用・意味値をmaskへ注入しておらず、任意JSON欄も既存型のまま。その範囲を後から狭めて成功扱いにはしない。

この一回は不採用で閉じる。同じ有料反復、cap増加、新helperや即時の再学習・再生成案を足さない。現在の2題には原材料と教師があり、今回の不成立から追加観測会が必要とは判断しない。一般教材の十分性、未知一般化、4B能力限界は未確定。
