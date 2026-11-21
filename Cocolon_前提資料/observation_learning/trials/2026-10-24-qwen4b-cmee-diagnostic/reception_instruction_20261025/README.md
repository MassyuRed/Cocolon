# 受け取り説明の追加候補：実推論で退行し不採用

**候補の実結果：意味1/2、本文0/2。** 直前の学習済み入力版の意味2/2・本文1/2より悪化したため、追加した説明60tokenを採用せず元へ戻した。原rawを補修・置換していない。

source `a4280eeb4d9d7afad989ab4a7a831a65a2dd895c`、API `2fbc0a2ae7e9b72dc8be2e676c2f4a2c3c81380e`、同保存adapter a8baf0…、追加学習/optimizer0。process 159.210806096904秒、初回2055→1088token/訂正5078→1864token、両方JSON/stop。全13member/size/hash・原source bytes・raw SHA256・元adapter3file hash前後不変/32tensor有限性/非学習をPod外照合した。archive `216d146edb5a6d811c5b8a7ce86e9008ac8ce86f251054dc7d606c4b560d424b`。回収側のhashをPod原本とプログラム比較し画面でTrueを確認、再download/再実行0。

| 対象 | 実採否と原因 |
|---|---|
| 初回 | 意味採用、本文不採用。根拠6/6は正常。receptionが本人の喜びとEmlisの反応を一文へ合成し、本文にないusable_againがbindingに残る。既存inverseの文型にも不一致 |
| 訂正後 | INVALID_EVIDENCE、意味/本文なし。根拠10/12一致だが、ev10はstart39>end38かつ原文にない「一緒に直しました、」。ev11も原文にない語順の結合quote。surface検査まで通ったとは数えない |

## 採用する開発版への復元

API `7a4dc32c07f8c8a30609e8345207c6a9c831de23`でmodel_candidate_source.pyを学習時a3e82のexact bytesへ戻した。API全treeもa3e82と一致する。packのmodel messages/teacher/native/prior/mapは32更新時4ad7597のbytesへ一致し、manifestのAPI pin/履歴だけを現commitへ揃えた。CPU69/pack13成功、token1995/5018・切捨て0。

`restored_prompt_replay.json`は以前のunicode_fit32/after.raw2を無改変でCPU再消費した互換性確認。原consumerの全resultと完全一致し、意味2/2・本文1/2を保持した。**新生成ではなく、今回の失敗requestを古い成功rawへ置換したものでもない。** この候補の実推論1/2・0/2は独立に保持する。

全18根拠/意味/参照/訂正3更新が成立した最良版でも、訂正reception第2文「またその椅子に座れるようになったのですね。」が既存有限readerの対象外となる残件がある。これを解決するための追加prompt反復・reader条件緩和・追加32更新は行わない。次は固定prompt/保存a8baf0…を保ち、同訂正例の受け取りで最初に分岐した箇所を調べる。`next_local_difference.json`はbody文字列のCPU比較のみで、token確率/rank/新model実行ではない。

## 保存と未完了

新重みarchiveは`cocolon_4b_checkpoint_20261025-043032-a3fef235.tar.gz`、SHA43954719…、全24memberと32tensorを照合し永続保管（libfile_92793ab0520c81918d3cab3790583684）。本候補の新重みは0。元4B全重み/optimizer/RNGは別途必要。

既知の架空chair2例への適合で、未知評価/動的な実model一往復/service保存再読/通常アプリ/本人端末/一般入力/Piece・Analysis品質の成功ではない。正式0/3・全体54.50％・商品credit0を維持。観測会は今回の形式/接続問題には不要。GPU停止/再起動/削除/新Pod/charge/新依存/本人DB/Private diary/Render/Supabase/merge/deploy0。

両試行planは終了済み、再実行不可へ閉じた。実plan/source/rawは各trialへそのまま保存。表示$0.26/hで本process按分約$0.011499は準備/回収/継続保持/税等を含む請求総額ではない。GPUはMashの明示指示まで稼働保持する。
