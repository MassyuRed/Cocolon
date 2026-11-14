# named出力型・参照提示修復 — 実raw全文読解（2026-10-28 JST）

実receiverは両件TOKEN_LIMIT→REJECT/semantic_receipt_not_validated、意味/本人本文0/2。以下は原source・採用済みprior・未変更の完成教師・実raw全文の静的比較であり、意味readerのUNSUPPORTED判定や商品受入れではない。raw補修・欠落意味補完は0。root華恋が全2件を読み、別文脈read-only補助もBOOK/SHOPを分担確認した。

## 全体

今回API1739a6bfは説明keyと出力fieldの型の衝突、root見本の順序、原入力/回答/priorと更新参照の提示を直した。既存15教師・他13prompt・material/prior/systemは不変。両rawの冒頭は `v`が正しい版文字列の平坦v/a/q/cへ変わり、原入力s0・回答s1・実snapshot p0も完全一致した。旧long keyへの混在は戻っていない。

| 実出力 | BOOK | SHOP |
|---|---|---|
| prompt/completion | 4379/3712 | 4531/3584 |
| 秒/終了 | 164.097153447/EOSなし・length | 156.905780144/EOSなし・length |
| 完結q行（各source/fieldで一意完全一致） | 10/10 | 12/12 |
| 完結claim/教師 | 10/10、role誤対応あり | 12/11、felt_distance重複 |
| 完結relations/教師 | 7/7、根拠・from/to不正あり | 6/6、根拠scope不足 |
| 実updates配列/本人3本文欄 | 0/0 | 0/0 |

引用位置の静的10/10・12/12は、意味が正しい証明でも正式receipt成功でもない。各qの引用自体は原sourceに存在するが、role/意味との対応が違う。完結JSONも生成されていない。

## BOOK

元入力は返却遅延と謝罪、友人の「大丈夫」と残る気がかり。回答は、自分が週末返却を言っていたのに、遅れると分かった時点で連絡しなかったこと、本は返したが一言伝えておけばという思いがまだ気になる、という説明。

元4claimは保持。前b8bcで未到達だったrelations本体7へ進み、引用のsource/field帰属も正しい。一方、追加6claimの意味対応は退行した。

| role | 今回の実引用・問題 |
|---|---|
| self_statement | 「自分から…連絡しなかったことです」という説明一文全体。発言単位を分けていない |
| late_awareness | 「本は返したのですが」。遅れると分かったことではない |
| no_contact | 「一言…伝えておけばよかったな」と現在の気がかり。実無連絡の原句ではない |
| returned | 「本は返したのですが」。接続語を含めた引用 |
| counterfactual | 「遅くなると分かった時点で連絡しなかったことです」。反実的振返りではない。時点もANSWER_TIMEから過去一般へ退行 |
| continuing_concern | 反実の引用まで含め、現在の「まだ気になっています」を独立保持していない |

action_linkは無関係な回答全文、memo_linkは気がかりの断片だけを根拠へ使う。returned_concessionのfromがcounterfactual、concern_contentのfromがreturnedとなり、教師とは逆。その他の関係も完全な接続scopeを引用できていない。

proseはobject/bindsへ進むが、update_note.urにwritten_links、*_requirements、sources等のprompt metadataを463完結文字列として反復し、最後の文字列途中で打切り。これは更新IDではない。実updates、observation/reception/update_noteの日本語文字列には未到達で、全7更新・本人応答は成立していない。

## SHOP

元入力は昔からの友人の開店を知って祝いのメッセージを送り、うれしい一方で少し置いていかれた気がした、という記録。回答は過去に二人で店の話をしたこと、共同準備・約束はないこと、友人側では二人で話した未来が現実になったと感じたこと、うれしさと当時から少し離れたような寂しさ。

前b8bcの回答sourcealias欠落と11/18引用不一致は解消し、全12引用が正しいsource/fieldに一意一致した。元4claimの本文・軸、shared_talk/共同準備/約束の3claim textも教師と一致する。重複名felt_distanceがq.idとcidの双方にあり、教師11に対し12claimになる。

| role | 今回の実引用・問題 |
|---|---|
| perceived_realization | 「開店したと聞いたとき」という時点句を知覚本体にする。PERSON_PERCEPTIONも失う |
| answer_joy | 「二人で話していた未来が」という名詞句。回答の「うれしい」が欠落 |
| felt_distance | 「友人の方ではもう現実になっていたんだな」。距離の本人知覚ではない |
| answer_sadness | 「あの話を…少し離れてしまったようで」という距離句。寂しさ本体ではない |
| 重複felt_distance | 「寂しかったです」を別の同名claimへ入れる |

両NEGATEDのevは必要な共有否定文全体ではなく各部分句。6関係の根拠にも接続/参照/否定scopeが不足し、binding.rrにはclaim IDのno_joint_preparationを混入する。

proseは前回の一人称stringからobjectに戻るが、bindsしか書かない。最初の3bindingの後でprose objectを閉じ、cのfield位置へ無名objectを続けるため、静的JSON parseはchar8981で既に失敗する。完結binding14個（observation4/reception6/update_note4）を反復。urは完結4配列、各8文字列/一意7IDでadd_felt_distance重複、延べ32参照。実updates/$id定義・INVALIDATE_GAP・本人3本文欄は0。全8更新が出た意味ではない。

## 判定・次の一作業

新41c9d82cは通常不採用。原284f/d431/旧9ba8/b8bcを保持し、今回の実raw/追加重みは別保全する。構文冒頭・sourcealiasの修復は確認できたが、意味対応・全更新・本人本文の完成には到達しない。primary=BLOCKER_NARROWED、商品0/正式0/3/54.50％据置。

同条件GPU反復・上限延長・reader緩和・raw補修へ進めない。SHOPは打切り前にも構文が崩れている。今回の既存教師には必要な意味・引用・全更新・本人本文が既にあり、新観測会を必要とする教材不足とは判断しない。4B能力限界の証明でもない。

次は、既存教師/shapeでupdatesが参照付きproseより後に置かれていることと実ur/binds反復の関係を、元教師を不変保持した可逆な同意味直列化としてCPUで検討する。因果確定・採用・新学習承認ではなく、今回一回の後に残す具体的候補。新run自動開始false。
