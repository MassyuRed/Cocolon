# 補助4課題の全raw読解 — 2026-10-29

全4 raw、固定教師4、各userの完全material/priorとgold A条件、run、setup/実CPU確認を照合。補助A/Bはoffline部分投影で、通常receiverへ提出していない。旧全文意味/本文0/2、商品0/正式0/3/54.50％は維持する。run.jsonのRAW_COMPLETE_PENDING表示は凍結し、最終閉鎖はresult_summary.jsonが所有する。

| 課題 | 生成token | EOS | strict JSON | 実所見 |
|---|---:|---|---|---|
| A BOOK | 2272 | あり | 成功 | 意味名と内容・関係端点が誤対応 |
| B BOOK（gold A） | 1024 | なし | 打切り | 時点/関係をADDし、bind参照を反復、本文未到達 |
| A SHOP | 2816 | なし | 打切り | 喜びへ未来の断片を割当、関係をclaim化/重複 |
| B SHOP（gold A） | 747 | あり | 末尾余剰brace | 更新role/根拠/本文bind不整合、喜びと寂しさを本文で落とす |

JSON完結1/4・EOS2/4・文字通りの教師JSON一致0/4。A BOOKのliteral差113には名前表記と配列順も含むため113個の意味誤りや意味scoreとしない。q接頭辞を使わないこと、local update IDの綴りが教師と違うことだけを欠陥としない。全rawは補修していない。

## A BOOK

quote11/claim11/relation6（教師17/10/7）。self_statementへ本人回答の第一文全体を割り当て、late_awarenessへ『本は返したのですが』以後の別内容全体を割り当てる。遅延を認知した事実が本返却後の気掛かりにすり替わる。answer_explains_targetを独立REPORTED_STATEMENT claimにも増やす。counterfactualのmodeがCOUNTERFACTUAL_APPRAISALからASSERTED_AS_WRITTEN、回答時点が過去へ変わる。

relationのaction_linkは元の本返却遅れ→謝罪を本人回答のself_statement引用で支え、concern_contentのfromはcounterfactualでなくreassurance_receivedへ変わる。memo_linkが欠ける。引用文字列そのものが原sourceにあることと、意味role/端点/時点が正しいことを分ける。

## A SHOP

部分rawのperceived_realizationは『開店したと聞いたとき』という時点を内容へし、answer_joyは『二人で話していた未来が』へ誤対応する。喜びそのものを別内容へ変えている。felt_distanceは前部を落とした断片となる。answer_concessionとanswer_explains_targetを独立STATE claimへ増殖。完成したrelation配列の後でanswer_concessionという同名ridを再び出し、別端点/REFERENCEを作る途中で2816上限。parse失敗は打切りであり、実receiver拒否を今回観測したものではない。

## B BOOK — 正解Aを入力した条件付きFIT

question=null、prior=@p0、missing_explanation/UNKNOWNは保持。教師6ADD+1GAPに対し、完成updatesは11ADD+1GAP。元6claimに加え、時点quoteだけのextra_9と4関係statement_concession/awareness_time/returned_concession/concern_contentを独立ADDにする。附属関係を適切な新claimのreplaceへ同時に付けず、answer_explains_targetも欠ける。

observation.crへ関係名/extra_9、reception.crへaction_link/memo_linkを混入。update_note.rrは4関係を繰り返し、73個の完成参照の後で次文字列を出す途中に上限となる。observation/reception/update_noteの本文やurへ未到達。出力上限は教師607tokenより大きい1024であり、単に教師が枠外だったとは扱わない。

## B SHOP — 正解Aを入力した条件付きFIT

EOSは出たがraw末尾の余剰『}』でstrict parserはExtra data。先頭から閉じたobjectの静的読解はできるが、末尾を削って受理/再投入しない。教師7ADD+1GAPに対して12ADD+1GAP。7claimに加え、3関係distance_link/answer_concession/past_reference、否定共有quoteだけのextra_8と時点quoteだけのextra_11を独立ADDにする。answer_explains_targetが欠け、GAPのevは説明q_felt_distanceでなく元気分q_felt_left_behind。reception.rrにclaim no_joint_preparationを混入し、update_note.crはno_promiseだけなのに本文は本人知覚を述べる。

見える本文は、observation『二人で話していた未来について語っていたことがありました。』、receptionは共同準備/約束の否定の回答再掲、update_noteは『…現実になっていたんだな、と感じました。』という一人称回答の再掲。教師が保持するうれしさと寂しさ、あの頃から離れた本人知覚、他者への語りかけが欠ける。文の自然さだけで更新/bind欠陥を無視しない。

## 判定と次の対象

今回の保存2dfdでは短課題自体が未習得であり、全文への転移だけでは既観測の失敗を説明できない。Bはgold Aでも誤るため、A自由生成の誤りだけへ帰属もしない。転移不足が併存しない証明、4B能力の上限、未知一般化評価、CMEE意味採用/商品品質合格ではない。

次は既存の出所付き4教師で、quote/claim/relation/時点証拠/update対象の対応を学ばせる配分案をCPUで具体化する。新しい本文仕様・reader緩和・枠延長・新観測会を今回の欠陥の解決へ先行させない。追加学習・追加生成は未実行、旧runや枠を再利用しない。
