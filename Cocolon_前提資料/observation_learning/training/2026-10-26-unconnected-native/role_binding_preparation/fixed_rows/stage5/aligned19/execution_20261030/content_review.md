# 全7 raw・本文読取と所見 — 2026-10-30 JST

root華恋が全7rawを全文読み、read-only補助の独立読取・凍結decoder静的照合と一致。モデル/CMEE/consumerの呼直し、raw補修、教師置換、再生成は行っていない。本人向け採用本文0で、MashへProduct Read候補を提示しない。

| case | 実結果 | 最初の不成立と残差 |
|---|---|---|
| BOOK | S1の最外rootは閉じ、教師と同じ3alias/@p0を宣言。16引用は全て正しいsource/field/literalに一意一致。S2で停止 | 10claim全て11cellで、要求10cellに不一致。実stage拒否claim_outer_type。time.evの文字列化、mode/polarity/predの入れ子崩れも残る。CMEE未到達 |
| SHOP | 全5段shape完走、実前段だけで13pathを機械的再結合。CMEEへ渡した1候補のreceiptはINVALID_FORMAT、candidate_json=null、semantic_receipt_not_validated | 全11subject.bindが文字列でなく配列。凍結decoderのsubject_cell_typeに合わないことを静的照合。個別例外名は実receiptに記録されておらず、実拒否名と静的所見を分ける。後段bind・本文も未成立 |

両S1は前回の最外JSON未完結から通過へ進み、alias3が教師一致。引用は前回BOOK10/SHOP14から各16へ増えた。ただし教師17/18とは一致せず、意味・商品品質改善や一般化へ数えない。BOOKはq_extra_9がなく、q_awareness_timeを短い時間句に置換し、本来の完全な非連絡節を短縮。counterfactualも末尾「な」を落とした。SHOPは共同準備・約束の全文否定q_extra_8と開店時点q_extra_11が欠落。他16quoteは教師と一致。全32引用の位置一致はscope保持の十分条件ではない。

SHOP S2は否定2件の証拠を全文否定から部分句へ変え、後半4claimの明示時間句を失った。S3のJSON値は教師と完全一致。S4は8更新の順序・ID・@p0・targetを保持する一方、更新4のevからq_past_reference、更新7からq_answer_concession/q_distance_linkを落とす。更新5/6のreplaceへ他の更新に属するrelationを追加した。

SHOP S5では全3bindのrrが文字列、先頭2urも文字列で、sectionがADD/ADD/update-IDとなる。crにrelation IDが混じる。update_noteは自然な日本語説明でなくupdate ID3個のカンマ列で、本人の共同準備・約束の否定や喜びを受け取る教師本文も失っている。単なるsubject一セルの修正で成功とは判断できない。stage gateは浅いshape確認であり、SHOPの5段完走を受信成功へ換算しない。実CMEEは不正形式を拒否している。

19更新は全て実行され、S1/S2 lossは低いがS5はBOOK0.7333148718/SHOP0.8662253022だった。loss低下・完走・JSON構文通過を意味/本文品質へ置き換えない。現在指示の学習により実自由生成が局所変化したが、完全な引用作用域・入れ子型・更新根拠・本人向け本文の保持には届かなかった。学習の十分性や唯一の原因は確定しない。

全7EOS/timeoutなし、BOOKはS2停止・SHOPは派生候補1を既存受信へ渡したが不採用。意味/本文0/2、saved/cold0、旧9NOT_RUN。条件外の旧9確認、追加学習、cap延長、受信緩和、再試行、次run0。新b5e7936dは不採用実験重みとして保全、元9b/215frozen不変、GPU保持。現2題には必要教師が既存なので、この不成立を補う観測会は不要。商品0・正式0/3・54.50％・candidate_ready/automatic_progression=false。
