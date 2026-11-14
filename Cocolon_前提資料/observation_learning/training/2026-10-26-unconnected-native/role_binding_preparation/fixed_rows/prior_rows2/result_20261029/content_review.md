# 原文全文読了と判断の範囲

rootはBOOK 9279字/3712token、SHOP 11065字/3584tokenの未修復rawを全文読了した。read-only補助も両raw・元receipt・rehearsal13の同2件を独立に読んだ。本人本文は成立0で読了対象0。正式Pro/Ultra/human受入れではない。

| 対象 | rehearsal13履歴 | 今回の実結果 |
|---|---|---|
| BOOK | EOS2371、INVALID_FORMAT | 3712cap、EOSなし、TOKEN_LIMIT |
| SHOP | 3584cap、EOSなし、TOKEN_LIMIT | 3584cap、EOSなし、TOKEN_LIMIT |

実際のCMEEはfinishを先に評価し、両TOKEN_LIMIT→REJECT/semantic_receipt_not_validated。意味・本人本文0/2、元raw/metadataからのreceipt replayは2件一致。採用snapshotがないので保存後cold対象0、cold成功2件と数えない。後段意味検査が以下の個別内容を理由に拒否したとはしない。

静的読取ではnamed objectの表記が消え配列側へ変化したが、claim/time/mode/polarity/relationの階層・列順・参照が成立していない。BOOKはs0/s1を宣言する一方p0が欠落し、no_contact引用が「遅くなると分かった時点」に誤対応。旧意味の再ADD、未宣言@p1等の参照と本文領域の同文反復が残る。BOOKの終端到達は履歴EOSからcapへ退行した。

SHOPはq6/q10等の引用重複、本人の知覚のASSERTED化、更新行の混成とbind領域反復がある。SHOP中にBOOK専用の英語説明句「awareness/no contact, returned book, counterfactual regret and current concern」が現れ、本人原文でないspec説明のコピーを確認した。機械修復や引用補充で成立へ変換しない。

この固定2件では、priorの入力表記だけを揃えても全文成立しなかった。形式干渉の主因性、全失敗原因、4B能力限界、未知一般化や教材不足を証明したとはしない。旧9は再生成0で、履歴FIT9/9を今回の成功数へ足さない。新重み0、保存11446641の不採用状態は継続。

現2題の原材料・正しい2教師は既にあり、今回の欠落は新しい観測会で穴埋めする段階ではない。今後のCPU検討は固定列の教え方・階層/引用/更新/本人本文の対応へ戻る。有料再実行、追加学習、出力上限引上げ、受領緩和を自動で進めない。
