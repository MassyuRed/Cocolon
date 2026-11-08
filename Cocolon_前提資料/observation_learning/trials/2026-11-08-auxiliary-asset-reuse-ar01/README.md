# AR-01 補助経路の活用：実生成チェックポイント

2026-11-08。新しい架空12入力を、現在の natural base 4B に同一条件で生成した。旧評価原文・教師・実ユーザー記録は含まない。API base は `497f7008fec8935885d09d2e430499892189b5bb`。独立した生成補助と、自由文の有限比較を実装・検証中。

## このチェックポイント

- 変更前12生成19.331824秒、最初の補助候補12生成19.510617秒。各12/12 HTTP200・stop。学習0、新model load0、provider retry0。各実行前後で既存Analysis adapter weight/config hashが一致し、server PIDも変わらないことを実行時assertした。
- 役割補助が付いたのはROLE01/02各1件。他10件は元の材料・SYSTEMと同一で、実返答も10/10完全一致。
- **候補v1は不採用。** ROLE01は元から役割を保てており、改善件数にしない。ROLE02は「お前」が残り、原文にない直接見た／知った経緯の説明が増えた。EPI01の「返事はまだない」→「返事が来ている」反転も未解消。
- baseline全文の独立評価は [baseline_human_review.md](baseline_human_review.md)。機械の非衝突判定を自然さや意味全体の合格へ換算しない。
- API局所検証は意味reader75・budget8・application57＝140 PASS、既存provider/Safety26 PASS。source整合・本人権利・保存再読・無再生成等を含む。既存Pydantic非推奨警告1件。

[変更前の全入力・実messages・実応答](baseline_12.json)、[候補v1の全入力・実messages・実応答](candidate_v1_12.json)、[候補source identity](candidate_v1_code_identity.json)を保存する。JSONのCOMPLETE_NOT_ACCEPTANCEは生成工程の終了であり、商品採用・品質合格を表さない。

## 続行位置

補助表現を原文の役割保持へ絞り、乱暴な呼称・未記載の経緯の補完を抑える改修を行い、同入力と別題材の役割対照で再比較する。AR-01・全6境界・準備済み8教材は未完了。Render／DB／RN／公開設定／buildは変更していない。
