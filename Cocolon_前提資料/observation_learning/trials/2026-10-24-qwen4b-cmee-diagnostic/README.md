# 4B実学習とCMEE固定raw接続 — 一回診断（完了・品質未合格）

Mash承認の一回を終了しました。**2教師×1epochの学習・保存adapterの非学習reload・前後各8生成・重み回収と照合・試験Pod停止/削除は完了。実rawのCMEE採用は前後とも0/2です。** 実装と保存の到達を、観測品質・通常接続の完成へ換算しません。

| 実結果 | 到達 |
|---|---|
| モデル | Qwen/Qwen3.5-4B、revision `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a` |
| 固定source | Cocolon27b06f19／API02c0b943、profile emlis_model_proposal.v1 |
| 学習 | 2教師/1epoch/2update。両stepの勾配はfinite・非0。追加学習0 |
| 保存 | adapter3file保存→先退避→非学習reload→同入力after。32tensor有限、after後もhash不変 |
| 生成 | before8/after8、計16。全て正常stop/JSON構文成功、打切り0。意味合格数ではない |
| 教師NLL | 加重 0.25527284→0.24949186。2/2低下。教師適合のみで品質改善率ではない |
| CMEE | FIT初回/訂正後の固定2例だけを実consumerへ接続。before0/2、after0/2。EFREE6は各段階で範囲外・未評価 |
| GPU | 16GB空きなし。許容24GBのRTX3090で完走。peak allocated 14.954GiB、reserved 17.545GiB。16GB適合は未実証 |
| 時間・費用 | run 894.31秒。新規Pod1台/試行1/再実行0。GPU$0.22/h、起動〜停止約31分、単価×観測時間の概算約$0.13（個別明細・税等は未照合）、計画$1/最大2h内 |
| 回収・終了 | 最終24member/adapter32tensorをPod外で全hash/実データ有限性まで照合、永続保存version1。その後試験Podだけを停止・削除。既存8Podは未変更 |

詳しい機械結果は[run_summary.json](run_summary.json)、未修正rawと実採否は[before](before_cmee.json)／[after](after_cmee.json)、sourceと全16本文の所在・比較所見・次候補は[quality_review.json](quality_review.json)。[最新weekly §15](../../../weekly_reviews/Cocolon_Weekly_Review_20261024.md#20261024-approved-4b-gpu-diagnostic)に承認から削除までの経過を保持しました。

## 実出力から残った問題

初回はfield内19/27文字の原文へ406/489からの根拠座標を返し、前後ともP1がINVALID_EVIDENCEで拒否。訂正後は前の意味を残したまま説明文だけを変え、afterでは正しかった「して、」根拠も不一致になりました。conflicts欠落、bindingsのdict化、不正な参照、説明指示の本文混入も残ります。モデル/revision/adapter/messagesは照合済みで、consumerへ別promptを渡した失敗ではありません。

本人→先生の説明や写真の限定訂正を保つ箇所はありますが、自然な受け取りは復唱・三人称の解説に寄っています。afterの一部には「自己表現の達成感」「矛盾した感情」を補う悪化もあります。NLL低下だけでは、この不足を解消できませんでした。

## 次の最小修復候補と再実行の境界

追加epochやモデル再選定を先行しません。既存OUTPUT_SPECの座標を「各field先頭0、Unicode scalar、field[start:end]==quote」へ短く置換し、bindings配列/必須fieldの形を明示する案です。意味schema・採用条件を緩めず、既存2教師messagesとAPI pin/hash/token長を同じ変更単位でCPU確認します。これは未実装で、意味更新・受容の不足も同時に直る保証はありません。訂正promptには165token分しか余裕がなく、追記量は実測で制限します。

この一回の有料承認は終了。新しいGPU起動・追加生成・学習反復・通常有効化はしません。実初回の実問いからの動的一往復、通常service/SQLの同一保存再読、Plus/Premium、Piece/Analysis、本人端末・商品受入れは未成立です。原rawを修正して合格へ変えません。

## 回収原本

最終archive SHA256：`3ef2e2d88391b3eda7c191f23e32ca3591f09251f65fe08a4b211f0194fd3bcd`。adapter本体：`56cf9b8a2f9e8c256b9e6bbedfc9b05efacb71a6fb4d28f53719d12f147b4005`。重み入り原本はprivate owner `libfile_d9425b1c05d8819180c37eee5a67ddd1`（version1、3,365,321bytes）。最初の途中版version0も履歴として残し、最終版と取り違えません。Podの認証token/credential、base weights/cache、account情報は公開記録へ含めません。

STRUCTURE_MAP_DELTA_NONE（学習と既存private consumerの実行結果のみ、API/型/商品経路変更0）。限定TECHNICAL_CREDIT、product_credit=0、PRODUCT_NOT_CLEAR、正式Product Read0/3、candidate_ready=false、automatic_progression=false、全体54.50％据置。
