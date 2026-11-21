# 現行入力と学習入力を揃える19更新 — 一回完了・不採用閉鎖

2026-10-30 JST。Mashが最大45分・前回単価処理按分$0.21（準備/回収/保持等別）・再試行なしの具体案へ「進めていいよ。」と承認し、Jupyterで一回実行した。**19更新・保存/非学習再読・実7生成、意味/本人本文0/2、saved/cold0、旧9NOT_RUN**。新b5e7936dは保全済みの不採用実験重み、元9bと215frozenは不変。GPU保持。

[全実結果・全raw所見・原本と全file地図](execution_20261030/README.md)。BOOKはS1通過後、S2のclaim11cell/要求10cellで停止。SHOPは5段shape/13path結合まで進んだが、実INVALID_FORMATで拒否。主体型の不一致に加え、引用作用域・更新根拠・bind・本文も未成立。両S1構文の局所変化を意味/商品改善へ数えない。

処理491.35681426001247秒/$0.03821664110911208按分、親外492.6916159699904秒/exit1、上限45分/$0.21内。前回$0.28/hを使用し現在単価は未照会、準備等別。再試行/補修/条件外旧9/受信緩和/追加学習/次run0。現2題の基本不成立に追加観測会不要。次の有料試行や新重みの初期値利用へ自動進行しない。

[CPU準備原本](result_20261030/README.md)は全10指示差と同教師/EOS・旧9不変を確認した当時の履歴。[proposal.json](proposal.json)は承認前原本で不変、[approved_plan.json](approved_plan.json)は今回承認を保持した消費済み閉鎖版、実承認時原本はexecution_20261030/runtime/approved_plan.jsonへ保持。GPU source105c08d2、runner/promptのCPU合格時hash不変。

| file | 責務 |
|---|---|
| proposal.json | 元9bを隔離実験初期値にのみ使う19更新/固定cap/最大45分$0.21/一回案の不変原本 |
| approved_plan.json | 今回のMash承認と消費済み閉鎖（再利用禁止） |
| prompt_source_index.py | 当時の学習と推論で同じ現5段builder/actual chain |
| prepare_aligned19.py | model/forward/生成/CMEEなしのCPU19encoding/教師/EOS/mask/旧9/215frozen確認 |
| run_aligned19_once.py | 承認一致→19更新→保存/非学習再読→新2actual chain→既存受信→全成功時だけ旧9 |
| launch_aligned19_once.py | fresh OUT/exclusive lock/direct timeout2690秒＋kill10秒・一回起動 |
| export_aligned19.py | 全原本・新重み回収、best-effort GPU read/partial ZIP保持。model/consumerなし |
| result_20261030/ | 事前CPU一回の全原本・回収照合 |
| execution_20261030/ | 今回GPU一回の全raw/学習/承認/source/費用/不採用所見/新重み参照と全file地図 |

新重みは完全bytesを保存し、元4B全重みは含まないことを明記。product_credit=0、正式0/3、管理54.50％、candidate_ready/automatic_progression=false。通常source/receiver/API/DB/RN/Render/Supabase/依存/merge/deploy責務差分0、STRUCTURE_MAP_DELTA_NONE。root単一writer/executor/judge、補助read-only、実環境Codex Work。
