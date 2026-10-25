# Balanced12 — 実行中checkpoint（2026-10-26 JST）

Mash承認の固定12更新をsource34c9d67f/API4002b457・初期138b9ff7から一回実行。12/12更新、保存/非学習reloadを確認。最後の読取点486.8秒でFIT9の3完了/4開始、3rawはEOS/parse正常。意味・本文・全9保持の採否は未判定、後段2件は0。これを完了結果と扱わず、同じprocessのrun.jsonから続ける。再起動/追加学習/失敗model再callをしない。

追加重み2009b43ca256f2960c1e2e7fdf1cb55a69b613594f28a5a76f4efdd19b4d0419を早期回収。archive3,477,588bytes/SHA99ea901e79147e7d359c42be227eb8cc75018e0db25a55b3e564ccf4f7b61f27、manifest18対象/32F32有限をPod外照合・永続保存（weights_verification.json）。early runのgeneration0は保存時点の記録で、現実行3完了と混ぜない。元4B全重み/optimizer/RNGは含まない。

実行先/workspace/cocolon_4b_quote_balanced_fit12_20261025、pack/workspace/cocolon_4b_quote_balanced_pack_20261025。launcher616784、開始unix1792940671.5176206。内部1800秒/外側timeout1795秒+kill5秒、条件付き後段900秒、合計最大45分/処理按分$0.195（保持等別）。plan/runtime checkpointは既存quote packが所有する。Jupyter直接で、GPU lifecycle/通常DB/Render/Supabase/RN/merge/deploy操作0。

起動コマンドの改行構文失敗はPythonが全体をparseする段階で発生し、file/model/child effect前に修正。実学習起動は一回。途中Jupyterの白画面/操作transport errorを既存tab再取得で回復したが、学習processは再起動していない。商品0/正式0/3/54.50％、全9raw/consumerの採否は後続完了原本へ更新する。
