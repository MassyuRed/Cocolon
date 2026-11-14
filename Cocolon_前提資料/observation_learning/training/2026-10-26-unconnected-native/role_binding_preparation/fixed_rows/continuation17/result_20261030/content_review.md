# continuation17 — 実raw全文とCMEE結果の読取

2026-10-30 JST。root華恋がBOOK8279字・SHOP11124字の未修復raw全文、実receipt、metadata、training17行、保存・再読込tensor表を確認した。補助は同じ原本のread-only照合のみ。追加model/CMEE実行・raw修復0、正式Pro/Ultra/human受入れではない。

## 実判定

| 件 | 生成 | 実CMEE | 意味／本人本文 | 保存・冷再読 |
|---|---|---|---|---|
| BOOK | 3712token、172.516962985秒、EOSなし、length | TOKEN_LIMIT → REJECT / semantic_receipt_not_validated | false / false | NO_ADOPTED_SNAPSHOT |
| SHOP | 3584token、170.277429813秒、EOSなし、length | TOKEN_LIMIT → REJECT / semantic_receipt_not_validated | false / false | NO_ADOPTED_SNAPSHOT |

実際の`cmee/`はdiagnosis.jsonのみ。saved/cold/本人本文は0件で、読むべき成立本文も0件。receipt replay2/2一致をcold成功に換算しない。新2成功条件を満たさず、旧9件の生成はNOT_RUN。履歴FIT9/9を今回の回帰成功として加算しない。

## 静的所見

BOOKではp0宣言はあるが、claimのtime先頭が本来4列のところへclaim IDまで混ぜた5列になる。claim本体の平坦化・異常な入れ子、`[]`の文字列化もある。q_counterfactualは教師の反実仮想の引用から「遅くなると分かった時点で連絡しなかった」へずれる。後段は`@u2`から`@u372`までを文字列内に連番列挙し、末尾`@u3`で打切り。JSON parserはchar6154からの未完了文字列を報告する。正しい7updateや本人向け本文が成立したとは読まない。

SHOPではchar1299の裸の`@s0`でJSONが不正となる。引用表の途中へ主体・role・関係様の配列が混ざり、`["shared_talk","@s1","past_reference","二人で話していた未来"]`や`["answer_joy","@s1","answer_joy","うれしい"]`が各14回現れ、反復途中で打切り。教師の11claims・8updates・本人本文へ正しく配置された出力ではない。

これらはrawの静的所見。実CMEEはTOKEN_LIMITの段階で止まっており、後段意味検査が上記個別箇所を理由に拒否したとは記録しない。入力の説明句や表記差を新たに原因確定したとも扱わない。

## 学習と判断の限界

原11messages不変・BOOK/SHOP各4＋旧9各1の17更新は完了。新2の更新直前CEはBOOK 0.120671749→0.075086042→0.050904904→0.031711400、SHOP 0.151684955→0.111298032→0.078695066→0.054826263。全assistant＋EOS教師文脈でlossが下がったことと、自由生成で完了・意味・本人本文が成立することは別である。これは最終保存重みの独立NLLではなく、次の追加量や原因を証明しない。

新7fcca3ceの112F32 tensorは全有限・全112変更。保存3fileのhash、非学習再読込112表、回収後112tensor、raw全文SHA/token数/receipt metadataを照合した。初期11446641と全182frozenの不変はPod終了後exportでも確認。回収のCRC/bytes/hash検査と、意味・商品受入れを区別する。

**今回の一回はCLOSED_NOT_ADOPTED_NO_RETRY。** この追加各4回の設定で未達と確認した。4B一般の能力上限、教材一般不足、cache不具合とは断定しない。現2題には原材料・正解教師があり、追加観測会は依頼しない。次の有料反復・追加更新・新helperを自動追加しない。商品0／正式0/3／54.50％、candidate_ready=false、automatic_progression=false。
