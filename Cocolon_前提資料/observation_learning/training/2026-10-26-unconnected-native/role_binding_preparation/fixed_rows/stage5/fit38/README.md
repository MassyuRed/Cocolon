# 同じ19行×2周のfit38 — 一回終了・不採用閉鎖

2026-10-30 JST。Mashの明示承認により保存b5eを隔離実験初期値として38更新、3時点の同19行測定（57非学習forward）、保存非学習再読、新2件の実生成8callを一回実施。**新意味/本人本文0/2・保存/cold0、旧9NOT_RUN**。BOOK S3はJSON不正、SHOP S5は更新行反復/日本語本文なし・512token lengthで失敗した。今回承認は消費済み・再試行なしで閉鎖する。

[全実結果・全8rawの全文所見・3時点NLL・全64file地図](execution_20261030/README.md)。[CPU準備の全原本・全20file地図](result_20261030/README.md)は当時の準備証拠として保持する。CPU成功を生成/CMEE成功へ数えない。

## 実績と判断

同19行・教師/gold前段・順/比率・現prompt/完全CE・AdamW5e-5/clip1/seed20261024/112F32 LoRAを変えず2周。38有限loss/gradient・全112tensor変更・2load・保存再読/生成後SHA不変。新10区間token加重NLLは0.0968247931→0.0860945479→0.0560160420へ低下したが、BOOK S3と旧9には最終悪化もある。NLLは診断で、意味/本文や商品受入れの新thresholdにしない。

両S1は教師JSON値と完全一致し17/18引用を全保持、BOOK S2も教師一致。BOOK S3/SHOP S2はgold前段を含む学習時promptと完全一致しても崩れ、実前段との差だけを原因にできない。SHOP後段にはgold前段との差もある。関係終端/否定と時点/更新根拠/日本語の本人本文が残件。両件stage条件前で停止したため、13path結合/新CMEE receipt/保存/coldへの新呼出し0。受信に実際に却下された結果とはしない。旧9の実生成維持は未確認。

処理928.9340299230535秒/$0.07225042454957083按分、親930.2798354179831秒/exit1。承認の45分/$0.21内、前回$0.28/h使用・現在単価未照会、準備/回収/保持/保存/通信/税等別。新ad8b追加重みと全原本を回収・照合・保全し、266frozen/初期b5e/config不変、A5000 1MiB/0％で保持。Runpod管理console/API/Stop/restart/delete0。

raw修復/教師化/新教師/追加prompt/receiver/意味型/cap変更、再試行/追加周回/延長/次run0。現2題の正しい教師は既存で、基本不成立に追加観測会不要。新ad8bを製品/次初期値へ自動採用しない。今回結果だけから4Bの能力上限や38更新の最適性を断定しない。

## sourceと承認の全file地図

| file | 責務 |
| --- | --- |
| README.md | 本入口・実結果・残件と閉鎖状態 |
| approved_plan.json | 今回明示承認のconsumed/closed版。runtimeの実承認原本とは分け再利用を止める |
| proposal.json | exact38更新/57評価forward/2load/最大19生成/45分$0.21の元案SHA51573dba。不変 |
| prepare_fit38.py | stdlibで旧encoded19/全教師/EOS/mask/全行2回/38順/実installedsource/b5e/266不変を確認。model等なし |
| prompt_source_index.py | 直前と同じ5段messages builder/actual前段chain原本。不変 |
| run_fit38_once.py | exact新承認条件、38更新と3NLL測定、保存非学習再読、新2→CMEE/cold→条件付き旧9 |
| launch_fit38_once.py | fresh OUT/exclusive lock、runner直接親timeout2690秒＋kill10秒、一回起動 |
| export_fit38.py | 終了後の全原本/部分・完成重み回収、GPU情報best-effort timeout10秒、ZIP partial保持 |
| result_20261030/README.md | 事前CPU準備の全20file地図（38更新成功の証拠ではない） |
| execution_20261030/README.md | 今回実処理と回収照合・全64file地図 |

実行承認/sourceは5a333d68ed136483ae910a040a7fce4308ff3f13、実承認SHA5ea2d942、元CPU/source fbab342b/proposal51573dba。全source5/proposal/事前CPU原本は不変。root華恋が単一writer/executor/judge、補助read-only。実環境Codex Workで正式Pro/Ultra/human authorityを申告しない。通常source/receiver/意味型/三core/API/DB/RN/Render/Supabase/依存/merge/deploy差分0、STRUCTURE_MAP_DELTA_NONE。商品0・正式0/3・54.50％・candidate_ready/automatic_progression=false。
