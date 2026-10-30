# focus29 — 現10行×2＋旧9行×1、計29更新の未承認案

2026-10-30 JST。直前branch4で、BOOK S3/SHOP S2は教師全文と共通prefixの両方で過去の誤tokenが単独1位だった。新10行の残存CEの83.7528％は最終本文段S5に集中する。一方、旧9行のtoken加重NLLは0.0011822、新10行は0.0560160。ただし旧9の自由生成維持はad8bで未評価であり、この低NLLを維持成功の証拠にしない。学習方式や教師を変えず、現在課題の学習配分を上げる最小の一回案を準備する。2:1の配分は実験選択で、成功・最適性の保証ではない。

今回許可されているのはsource/具体案/CPU準備と記録。新しいGPU学習・生成は未承認/未実行。旧fit38/branch4の閉鎖承認を再利用しない。同JupyterでCPU準備を一回完了し、0.413831007秒/親0.516381192秒/exit0。19行/全messages・target・元終端列・encoded・mask不変、予定29順/19窓・298固定原本/ad8b不変を確認。torch未import、モデル読込/forward/更新/生成/新CMEEは全0。[CPU全17原本・回収照合・全file地図](result_20261030/README.md)。

## 予定する一回の順序

1. 保存ad8bを隔離した実験初期値として読む。商品採用やoptimizer/RNGを含む厳密途中再開ではない。
2. 現10行（BOOK/SHOP S1〜S5）各2回＋旧9行各1回、計29更新。新行の相対順を保持し、旧9を前半4/後半5に分けて挟む。全19教師/messages/encoded/元の終端列/mask、完全CE、112F32 LoRA、AdamW5e-5/clip1/seed20261024を保持する。
3. 重み保存→非学習再読込→同19行の教師条件NLLを一回測る。開始前値は同じad8bの不変fit38記録を再利用し、新たな開始前/中間forwardを加えない。NLLを受入れthresholdにしない。
4. 新2件を自分の実前段だけで各S1〜S5生成する。途中不成立はその題で停止。全段が通った題だけ既存CMEE受信・意味/本人本文・保存再読まで検査する。gold前段を実生成へ供給しない。
5. 新2件の意味/本人本文/保存再読が全成功した場合だけ旧9件を各1回生成・同条件で確認。旧9を確認できなければ維持成功としない。全rawをrootが読む。学習成功/機械成功と商品受入れを分ける。

最大45分・前回$0.28/hで処理按分$0.21（準備/回収/保持/保存/通信/税等別）、親2690秒＋kill10秒、1生成180秒、最大2load/29更新/19測定forward/19生成。時間は打切り上限で、全件完走予測ではない。上限/不一致/例外/非有限は部分重み・原本を回収して停止、再試行/延長/追加周回0。

通常source/受口/意味型/三core/API/DB/RN/Render/Supabase/依存/merge/deployを変更しない。新教師/失敗raw教師化/指示変更/文法補修/合否緩和/新loss/Runpod管理画面/API/Stop/restart/delete0。STRUCTURE_MAP_DELTA_NONE。今回の基本不成立に追加観測会は不要。

## 全file地図

| file | 責務 |
| --- | --- |
| README.md | 本具体案・順序・費用・停止・地図 |
| proposal.json | 新配分29更新・ad8b隔離初期値・上限とsource SHA |
| prepare_focus29.py | stdlibで既存19行と既存275を起点に最終298原本、29順、branch4/112F32証拠を確認。モデルなし |
| run_focus29_once.py | 承認後だけ29更新→保存再読/19NLL→新2→条件付き旧9。旧runnerの評価/受信部分を維持 |
| prompt_source_index.py | 既存と同一bytesの5段指示。変更0 |
| launch_focus29_once.py | exclusive lock・直接親timeout・一回起動 |
| export_focus29.py | 終了後の部分/完成重みと全原本回収。再実行をしない |
| result_20261030/ | CPU実結果・実source/proposal/不変19行/encodedと回収照合。全17fileは同入口へ |

root華恋が単一writer/executor/judge、補助read-only。実環境Codex Workで正式Pro/Ultra/human authorityを申告しない。前回新意味/本人本文0/2・saved/cold0/旧9未実行を維持。商品0・正式0/3・54.50％・candidate_ready/automatic_progression=false。
