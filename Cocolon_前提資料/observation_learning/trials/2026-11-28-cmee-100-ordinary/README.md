# 11/28 CMEE通常経路比較の入力と実行コード

架空100ケースの固定原本は `cmee-100-inputs.json.gz.b64`。Base64をデコードし、gzipを展開する。JSONのSHA-256は `e1398931328a5b84a40ef23436aed0820a2f1ec2d9a3bf6eaadb3cab9966812a`。公開されたコード・資料にある素材と架空の記録だけを使う。認証情報、実行出力、保存IDは同梱しない。

この100件と旧実行コードは11/28に得た個別の問題の再照合用です。旧ランナーはケースとプランの組ごとにアカウントを作成したため、本人の記録が続く利用の検証を中断しました。既存の個別出力を累積比較の結果へ繰り入れません。新たに確認する場合は下の隔離経路を使用します。

## 同じ本人の継続利用を隔離環境で比較する

`cmee_longitudinal.py` は、同じ図書館職員をFree・Plus・Premiumでそれぞれ一つの専用アカウントに固定し、同じ架空の7記録を時系列で追加します。`baseline` で2件、`contrast` で6件、`followup` で7件が各人に揃います。締切の余裕、頼まれた範囲を自分で選べるか、実際に何を優先したかを比較します。最後の入力より前の同じJST日には、こころグラフに載る喜び1件と、除外される独立した秘密の記録1件があります。グラフ対象の入力も、感情通知を送らない指定で保存します。Pieceの公開操作はありません。

```bash
python3 cmee_longitudinal.py --day YYYY-MM-DD --plan
```

`--plan` は実際に送る値と順番を表示するだけです。実行時はループバックの隔離API・Supabase・ワーカーを通常経路の版で起動し、推論先も隔離環境に接続します。本番のDB・推論先・通知送信設定を持ち込まず、端末トークンを登録しません。新規の試験用アカウント3人を用意し、通常の購読APIがそれぞれの実効プランを返す状態にします。認証ファイルは各プランをキーに `owner_id`、`email`、`password` を持たせます。メールは `cmee-longitudinal-free@example.invalid`、`cmee-longitudinal-plus@example.invalid`、`cmee-longitudinal-premium@example.invalid` です。隔離Supabaseの公開キーを `CMEE_LOCAL_PUBLISHABLE_KEY` に設定します。

```bash
python3 cmee_longitudinal.py --day YYYY-MM-DD --stage baseline \
  --api http://127.0.0.1:8000 --supabase http://127.0.0.1:54321 \
  --owners /tmp/cmee-owners.json --trace /tmp/cmee-longitudinal.jsonl
```

同じ日付・所有者・出力先で `--stage contrast`、`--stage followup` の順に実行します。最後の入力時刻は対象日の正午JSTです。`contrast` で保存確認した問いに答えるときは、実際の文面を読んでから `--answers` を `followup` に指定します。JSONの配列に `tier`、`lane`（`theme` または `records`）、`question_id`、`question_text`、`answer_text` を入れます。同じIDと文面に対応する未回答の問いのみを受け付けます。問いが出なかった場合や、レビューした回答がない場合は、その段階の実結果として残します。

記録には、普通の本人認証・プラン・履歴・保存した入力と応答、テーマ／記録由来の問い、日・週・月のグラフ、Pieceの非公開版、現在／月次マップ、もしもルートと保存した意向のAPI結果が入ります。応答の本文やマップへの回答反映は記録を読んで判定します。`stage_finished` は入力と記録の収集が最後まで進んだ印です。モデルの品質、未実測の端末PNG・通知到達・ストア操作を合格へ換算しません。書き込み中断で `stage_started` のままの段階は自動再実行しないため、通常履歴と照合して原因を確認します。
