# 日常family・18更新の有限試行結果

状態：**終了／18更新と保存reload完了／FIT chair6/6・daily0/3／別ID保存再読は未実施**。2026-10-25 JST。

Mash承認の264896ffの範囲で、APIbd356566、凍結教材/source e06d6b4cを用いて一回実行した。旧plan/data/adapterは変更せず保持。新planの再実行、追加更新、LR探索、原rawの補修、reader緩和は行っていない。root華恋が実行・統合・反映owner。別文脈agentは読み取り監査のみで、別モデル/人間の品質受入れではない。

固定Qwen3.5-4B@851bf6e、開始adapter76309b86から既存LoRA32tensorのみ、新AdamW/LR5e-5、全文assistant JSON＋EOS、凍結9行×2pass＝18更新を完走した。9行はchair6＋daily3で独立言語2family。実tokenizerの最大prompt5045、assistant＋EOS2339で固定8192/5632/2560内。before生成0、保存/非学習reload/FIT9を含む1189.6660492941737秒、peak allocated16.171474/reserved18.779297GiB。記録単価$0.26/h按分$0.085920326は、準備/回収/継続保持/税等を含む請求総額ではない。

生成9件はすべてJSON/EOS/stop正常。無補修rawを既存CMEEで消費し、意味/本文6/9。chair初回3＋訂正3は6/6で教師の本文・問い・3更新を保持した。dailyは全3件がreceipt INVALID_EVIDENCEとなり、意味/本文へ未到達。原欄のsliceと一致する根拠は01が2/8、02が2/8、03が1/11だった。全9のteacher-forcing NLLは低下し、加重0.040362249→0.012806319だが、採用成功や独立品質へ読み替えない。

| daily | raw静的比較で確認した未適合 |
|---|---|
| 01 | 帰宅/調理/食事のstart/endと原欄が不一致。warm claimに『ら』を混入。return→eatのKARA関係欠落で3関係。TE/TARA等の根拠欄・引用・索引も誤る。観測は入力の断定文、受け取りは『…ちょっと落ち着いたね。』 |
| 02 | 同じaction座標誤りとwarm claimの『ら』混入。4関係の型/方向は揃うがTE/TARAのquoteを編集生成。観測は断定文、受け取りは『…ちょっと落ち着いたね。』 |
| 03 | claim本文は5件一致するが全claimアンカー不一致、warm/slight_calm等の索引が別根拠へ接続。8行の教師に対し11根拠、重複1組。4関係の型/方向は揃うが原欄・quote・索引が不一致。観測のみ教師文と一致、受け取りは『…ちょっと落ち着いたのですね。』 |

これはrawを読む静的比較であり、consumerが下流の意味・表面検査まで到達して拒否したという記録ではない。『end値だけ直せば成功』とはしない。根拠表/原欄座標/参照、帰宅の両作用域、本人向けの受け取りを一体で学習する未完了が残る。今回の障害に新しい観測会は不要。新規の教師・追加試行は作らず、候補重みは昇格しない。従来のchair成功adapter76309b86を保持する。

FIT全9成功が別ID2件の実service→隔離SQL→保存GET/start再読を始める条件だったため、**holdout call0、今回の実model service保存再読0**で終了した。CPU合成3service/30RPCの保存再読成功は実model成功と分ける。準備したholdout draftは未公開・未実行で、この試行から自動起動しない。

新adapter5f0e51e9fbd5c94ba7bd213b033397dcc0982c19853819c1966afc8ece5613edを保存。step18保存直後archive594de06300c04f0e403cb6b8c68f4fc5e7e1d490fce8b5dae3f7c48b2ed6b205、3,495,824bytes、18memberのsize/hash・32F32有限をPod外照合して保管した。このarchive内runはFIT前gen0で、完了run.jsonのFIT9と時点が異なる。両時点のadapter3file hashは一致。base全重み/optimizer/RNGは含まない。[追加重み](https://chatgpt.com/library?file_id=libfile_9f7b606df43c81918b8d438996e21134&account_id=personal)。

完了evidence archive5e1f2743e16201dfe4c957c11cb601308a6fefc5925e99bb6cafe6c14866812c、237,287bytes、23member（manifest対象22＋manifest自身）をPod外照合。run/原raw9/training/NLL/runtime/tokenizer/consumerを保全した。consumer原本1,415,134bytesはfit_consumer.index.jsonの順に20partをbyte連結すると無損失で復元でき、原hash一致を確認済み。固定教材/plan/helper等の重複原本はsource e06d6b4cのtraining packを参照する。

実行前の監視入力でmultiline貼付が改行連結してSyntaxError1回、完了前のconsumer開始guardがAssertionError1回、exportのtokenizerファイル名取り違えがFileNotFoundError1回あった。いずれも追加学習/モデル呼出し/raw変更0。consumerは完了後一回10.524438623秒で実行した。回収archiveのsize目視転記誤りは未展開で停止し、実statとPod hash一致後に全member検証した。テスト初回のSQLnow比較誤り2件も修正して174全pass、件数内訳は新59＋既存115へ訂正した。

完了後の実画面でA4500/20470MiB/使用1MiBを確認。Podは稼働保持、STOP/再起動/削除/新Pod/charge0。通常app/実Auth/HTTP/RN/本人端末/Render/Supabase/merge/deploy変更0。STRUCTURE_MAP_DELTA_PRESENTは承認済みprivate daily採用範囲と内部版だけ。今回の商品credit0、正式0/3・全体54.50％据置。primary outcome=BLOCKER_NARROWED（新family採用未達）、既存chairの§36TECHNICAL_CREDITは保持。
