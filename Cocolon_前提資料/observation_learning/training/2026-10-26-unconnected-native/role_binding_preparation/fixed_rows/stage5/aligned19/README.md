# 現在の入力と学習入力を揃える19更新案 — 2026-10-30 JST

状態：Mashが最大45分・前回単価処理按分$0.21（準備等別）・再試行なしの一回を明示承認。実行準備済み。CPU原本は不変。直前の同重み非学習一回は不採用で閉鎖済み。その承認を再利用しない。

## 原因の照合と判断

直前の自由生成はBOOK/SHOPともS1の最外JSONが閉じず、引用群も教師17/18に対して10/14だった。末尾括弧だけの問題ではない。既存19更新で実際に使った`train19.jsonl`と現在の`candidate_train10.jsonl`を照合すると、全10区間で入力指示が異なる。現在の指示での学習は未実行。一方、全10教師の文字列、完全assistant/EOS、新行は従前と同じで、末尾を学習対象から落とすmask不具合は見つからなかった。

推奨は、現在の入力10区間と変更しない旧9件を各1回、同じ完全assistant+EOS CEで学習する一回実験。追加の推論指示探索や教師追加は行わない。入力差は検証すべき原因候補であり、唯一の原因や成功保証ではない。現2題に正しい教師があるため、今回の基本不成立を補う観測会は不要。

## 提案する一回の範囲

- 失敗・不採用の保存9b重みを、この隔離実験の初期値としてのみ使用する。製品採用や閉鎖済み承認の継承ではなく、この用途を含む今回の新承認を受領した。
- 現在の10入力＋元の10教師、変更しない旧9件を各1回、合計19更新。AdamW 5e-5、clip1、seed20261024、112 LoRA/F32、重み付けなし。
- adapter保存後に非学習で再読。新2件を各最大5区間、自分の実直前出力だけで生成し、13pathを機械的に結合して既存CMEE・保存再読へ渡す。失敗rawの修復、教師注入、cap変更は行わない。
- 新2件の意味・本人本文・cold再読が全成功の場合だけ、旧9件を実生成して同じ確認を行う。最大19生成・2モデルload。
- GPU処理最大45分、前回単価$0.28/hで処理按分最大$0.21。準備・回収・保持・保存・通信・税等は別。現在単価の再照会ではない。親2690秒＋kill猶予10秒。一回限り・再試行なし。
- 成功時もrootが全実本文を読む。CPU合格や機械完走を商品受入れへ換算しない。商品0・正式0/3・管理54.50％・candidate_ready=false・automatic_progression=falseを保持。

学習は入力と自由生成の差を確認する最小の19更新に留める。実行しない場合は、現在指示を学んでいない9bのまま、CMEE未達で停止する。失敗・期限・identity不一致は部分重みと全rawを回収して不採用終了し、自動延長しない。新service/依存、通常source/receiver/意味型/API/DB/RN/Render/Supabase、merge/deployは変更しない。

## 全fileの責務

| file | 責務 |
|---|---|
| `proposal.json` | 未承認案の正確な範囲・初期値・19更新順・固定cap・費用上限・source SHA |
| `prompt_source_index.py` | 直前に使用した現在の5区間入力生成・actual chain検査の同一原本 |
| `prepare_aligned19.py` | Jupyter CPUで19件をencode。全10旧入力との差、教師/EOS/mask同一性、実S1入力一致、旧9同一、13path再結合、112有限F32とfrozen identityを確認。model/forward/generation/CMEEなし |
| `run_aligned19_once.py` | 新承認を別`approved_plan.json`で正確なproposal hashへ結び付けない限りモデルをloadしない。承認後の19更新・保存非学習再読・新2→CMEE/cold→条件付き旧9を有限実行 |
| `result_20261030/` | CPU実行後の原本・hash・回収照合を保存する場所。学習/自由生成成功の証拠ではない |

[CPU実原本・回収照合](result_20261030/README.md)。全10入力の差、教師/EOS/mask・旧9不変、215frozenを実確認。CPU合格は自由生成改善や新CMEE成功ではない。

Podには元の教師・入力・実結果・重み・依存を保持する。GPU停止/再起動/削除やRunpod管理画面/API操作は行わない。root華恋が単一writer/executor/judge、補助はread-only照合。実環境はCodex Workで、正式Pro/Ultra/human authorityを申告しない。


今回の承認は`approved_plan.json`にexact proposal SHAと全文を結び付ける。`launch_aligned19_once.py`はfresh OUT/exclusive lock・direct timeout親2690秒＋kill10秒を所有し、既確認runner/source/CPUを変えず一回だけ起動する。proposalとCPU時runtime copyは承認前原本のまま保持する。root単一executor、補助read-only。学習結果・全raw・重み・費用を回収してからこの入口と全体現在地を更新し、次runへ自動進行しない。
