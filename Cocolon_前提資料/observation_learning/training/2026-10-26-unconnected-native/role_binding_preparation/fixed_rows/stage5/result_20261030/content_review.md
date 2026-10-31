# 全実raw読了・判断

root華恋とread-only補助が全3raw全文を確認。原本補修・再生成・追加学習0。実環境Codex Work、正式Pro/Ultra/human受入れではない。

| 実call | 実出力 | 判断 |
| --- | --- | --- |
| BOOK S1 | 640token、length、EOSなし | 正しいs0/s1/p0 alias3組の後へq0…q128…の長い連番配列を第4行として混入。引用表へ到達せずJSON文字列未完了。stage_not_finishedで同題停止 |
| SHOP S1 | 498token、stop、EOSあり | root4、alias3、引用16。構造だけ通過しactual値をS2入力へ渡した。意味採用ではない |
| SHOP S2 | 1276token、stop、EOSあり | root1（期待3）でstage_arity拒否。唯一要素は6要素でquestion/null・relations・schema様の欄も混入。claim位置27行は4列13／10列11／9列3で、timeとclaimを平坦化。正常な10列claim群ではない |

SHOP S1の16引用は元source/field内に全て一意に存在する。教師18件との差だけで意味不合格としない。静的差はq_extra_8（否定2つの全scope）・q_extra_11（開店したと聞いたとき）の専用引用欠落、q_past_referenceの引用範囲変更、q_perceived_realizationの範囲拡張。SHOP S2に誤って現れた関係6本はfrom==toが6/6で、方向を保持していない。ただしS3以降も完全結合packetも未生成であり、これは静的所見でCMEE意味拒否の実測理由ではない。

19更新・保存・非学習reloadは成立し、112F32の全112tensorが変化した。更新前の各行CEは最終saved weightのNLLではなく、学習・prompt変更の因果分離にもならない。5区間化による完結・意味/本文の改善は成立していない。単なる一括長さだけではなく、第一段alias反復と区間/列境界の逸脱が残る。

CPU対照は原教師2件の全13位置bytes復元、全10前段/原材料/spec/target保持、派生provider/raw/usageのcurrent snapshot receipt保持、cold full outcome一致2/2。prior snapshotの歴史receiptも別保持。CPU sourceが旧9保存rawを既存受口へ渡しprior receipt/checkpoint/full outcomeと等しいことをassertし9/9通過した。補助の最初のCPU束には比較元rawが無く独立再計算とは扱わなかった。最終完全ZIPにはその旧9rawと基準diagnosisも収録した。これは新重みの旧9実生成ではない。

新モデルの全5段完成0、派生packet0、実新CMEE0、意味/本人本文0/2、採用saved/cold0、旧9新生成NOT_RUN。新重みの旧9維持も未確認。商品0、正式0/3、54.50％据置。不採用閉鎖、retry/candidate_ready/automatic_progression=false。新重みを採用初期値へ昇格させない。

現2題には正しい教師があり追加観測会は今は不要。次の読取対象は保存したalias/区間境界と教師/学習入力の対応であり、追加GPU・cap延長・同条件再生成は自動開始しない。未学習一般化・Piece/Analysisの学習教材/受入れは未確認のまま。

準備レビューでsnapshotを再帰走査してreceipt1個を要求する誤りを発見し、prior receiptを保持したまま現snapshot直下のreceipt比較へCPU前に修正。CPU/GPUの再実行なし。補助費用照合でfloat境界.21000000000000002と.21の比較が停止したがDecimalへ修正し承認上限同値を確認した。実課金/原本/実行失敗ではない。GPU実実行は一回exit1、新2不成立を理由に予定どおり閉鎖。
