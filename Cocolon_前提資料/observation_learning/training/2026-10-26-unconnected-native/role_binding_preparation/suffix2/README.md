# 元全文updates境界〜EOSのsuffix2 — 2026-10-29 JST

現在：一回完了・閉鎖。2更新/2load/11EOS、全文0/2・旧9 7→4/9。新45a101ec不採用。前回boundary_probe4は閉鎖済み。

目的：正しい意味を与えても更新割当・bind・本文・終端が崩れる実測欠陥に直接対応する。元全文BOOK/SHOPのprompt/assistant全文/token列を保ち、labelsのupdates境界以前だけを-100にする。新しい部分JSON課題やgold user欄を増やさず、一般化・他core完成を主張しない。観測学習の目的・用途・Windows/Mac未選定は既存READMEどおり。

## 実装順・条件

1. 全機能原本全文、必読incident/rules、全体設計01/全file地図01A/B/C/current CMEE map、観測学習意図、最新weekly§101/102、元教師/raw/source、fresh PR30=f5ce0751/API PR3=7b9ee073を確認。System Context cache未生成の既存STOPを尊重しfresh原本の直接読取を使用。
2. Jupyterへ直接接続し同Pod vgkm402msgroiu/RTX A5000 24564MiB・使用1MiBを確認。管理画面/API/lifecycle/dependency取得0。
3. CPU3.869429秒で元全文、mask/causal/EOS、元11prompt/context、before11raw、f493/112F32有限とCMEE manifestを確認。BOOK total7300/start6699/監督601/window6698,602、SHOP7777/7066/711/7065,712。共有重みは変わるので上流生成維持の保証はない。
4. source/CPUをGitHub保存・readback後、新OUTPUTへ一回実行。f493起点、BOOK→SHOP各1更新、AdamW LR5e-5/weight_decay0/clip1/seed20261024。別保存後112F32全no-gradで非学習reload。厳密optimizer/RNG途中再開ではない。
5. 無補助全文2＋旧9を各1自由生成、context8192/greedy、旧cap3712/3584/2560・各180秒。最大2load/2update/11call、親1790秒＋kill10秒/総1800秒、処理按分上限$0.14。前回同Pod表示$0.28/h、live単価再照会なし。準備/CPU/回収/保持/保存/通信/税別。完走保証なし。deadline/OOM/nonfinite/identity不一致で終了し原本保全、再試行・上限延長・次GPU自動開始0。
6. 既存CMEEで原rawの意味/本人本文を判定、成立snapshotを別processでcold再読し全outcome同値確認。全raw/更新/typed bind/本人本文を読み、前回全文0/2・旧9 7/9と同条件比較。raw補修/括弧追加/reader緩和なし。
7. 新重み/全原本をPod外回収・CRC/hash/112F32照合して保存し、全機能/観測入口/weekly/01Aへ実結果を差分反映して終了。正式human受入れ/通常有効化/merge/deployへ自動進行しない。

## 原本・責任

cpu_check.json=433850bytes/SHA922b04a180ec1649654aa073a3f998f12efa75c5ca8e8f0456dc5a07c87554bb。source SHA7ff93955dceef2809e270cb62b6e15442a0aeb481ac2eaa6e3fe59edfcaba99f。初回CPUはCMEE結果folderをsource rootと誤指定しmodel0でFileNotFoundError。実rootを既存exportから解決し引数のみ修正、失敗log/exit保持。36787bytes CPU ZIPの全CRC/hash/source一致をPod外確認、download API失敗と実file到着を区別。

既存起点/元bundleはlibfile_e089337060248191a52ee06aad6fc75a v0に保持。新結果は別保存、base全重み/厳密resume stateはarchiveへ含めない。root GPT-6 Codex Workが唯一writer/executor、独立補助read-onlyでsource/mask/EOS/consumer確認、正式Pro/Ultra/human受入れではない。今回Mash「4B学習＋CMEE接続を進めて」の中の限定一回。通常app/API/DTO/DB/RN/Render/Supabase/merge/deploy/lifecycle0、STRUCTURE_MAP_DELTA_NONE。商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false。現2題の追加観測会不要。


## 最終結果

**現在の直接作業（10/29・suffix2閉鎖／新45a1不採用）：** 元全文2本のupdates境界〜EOSだけを2更新し、別保存/112F32非学習reload/無補助全文2＋旧9を全11EOSまで実行。全文意味/本人本文0/2、旧9は7→4/9へ退行し成立4のcold全outcome同値。SHOPのJSON階層/語りかけは局所改善したが更新割当は不変、BOOKは元意味欠落へ後退。処理991.976650秒/$0.077153739458按分、CMEE CPU42.680260秒（準備/CPU/回収/保持等別）。全原本/新重みは回収照合・保存済み。同種の有料loss調整追加は停止。追加GPUなしの可逆carrier CPU比較は全値復元/教師結果2/2同値だが出力token削減2.85/2.94％だけのため不採用。次は全意味値の明示責任を保った固定型行表現等の仕様候補をCPUで比較し、入力を含む実token削減と旧形式の全値復元を確認する。具体仕様/新GPU条件は未固定・未実行、通常契約不変。現2題新観測会不要、GPU保持。

[全原文・全更新・本人本文・過去案照合](result_20261029/reading_review.md)／[閉鎖集計](result_20261029/result_summary.json)／[追加GPUなしの可逆形式比較](carrier_comparison_cpu/README.md)。今回source/CPU/実行条件は上記に履歴として保持。新45a1と旧f493とも商品採用ではない。
