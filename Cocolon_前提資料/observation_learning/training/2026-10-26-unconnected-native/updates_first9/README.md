# 2026-10-28 — 更新定義を本文参照より先にする一回

状態：CPU_READY_GPU_NOT_STARTED。今回のMashの「4B学習＋CMEE接続を進めて」「Jupyterへ直接接続」に結び付く新unit。旧named_output_contract9等は閉鎖・消費済みのまま。実環境はCodex Work/GPT-6、root華恋が単独writer/executor、別文脈read-only補助は正式Pro/Ultra/human受入れを代替しない。

## 目的と最小変更

本人回答後のBOOK/SHOPで全意味・全7/8更新・自然な本人向け本文を、実4B rawから無補修でCMEEへ渡す。前回§90は本文bindingが更新定義より先に置かれ、ur/binds反復で両TOKEN_LIMIT・意味/本文0/2だった。更新を先にすることで反復が減るか確かめる仮説で、因果確定・role誤対応解消の保証ではない。

API7b9ee073（親1739a6bf）のmodel_candidate_source.pyは既存named shapeのc.proseを末尾へ移し、同じ順序を説明に明記する。同family既存positiveを旧順/更新先行の両方で検査し、形の順序も確認する。変更はsource/test2pathのみ。decoder・意味reader・fixture・採用条件・保存prior・通常経路不変。派生教師2件もc.proseだけを末尾へ移す。元15教師を変更せず、parsed JSON/配列/ID/引用/全値を完全一致、対象外13のprompt/targetを同一保持する。

前提資料00全文・恒久incident全文・work rules00/CURRENT/18/09/99、全体設計01/全file地図01Aとcurrent00/01/04、最新weekly§90、観測学習の目的/用途、Karen-Diary指定入口とactual source/test/rawを確認。System Contextは最新cache未生成という現状を維持し、fresh原本を直接読む。対象は通常経路へ未接続のprivate offline境界。

必要性はDIRECT_PRODUCT_OR_ACCEPTANCE_WORK。今回current requestとRule18§11.3の既存method内可逆変更としてLEVEL_2相当、商品/契約/採用条件/費用枠を変えない。正式Pro/Ultra共同判定を生成したとは報告しない。

## CPU実結果

Jupyterへ直接接続、CPU26.858871秒、同7file353成功/失敗0/ERROR0/SKIP0、実SQL12対象外。旧351の条件を保持し、更新先行のnative意味/3本文/全7・8更新/実raw再受領/同snapshot保存再開の2件を追加。対象2のprior投影同値・他13入力/教師不変・派生2教師の意味完全一致/EOS数保持を確認。model load/forward/学習/生成/SQL0、CUDA未初期化。

- BOOK prompt4387/target2913/cap3712、8099/8192。
- SHOP4539/3238/3584、8123/8192。切捨て0。
- 9系列総token57730、長二乗和398780542。600秒以内の完走保証ではない。

CPU初版はEOSを最終tokenと仮定した検査で停止。実templateの終端位置を過剰に仮定せず、元と同数のEOS・同意味教師を保つ検査へ訂正し、旧code/log/exitをfailed_eos_v1として保全。モデル/DB処理前の失敗である。

CPU原本129934bytes/24payload+manifest、SHA256 5ac99dc1e5e3d43684c5aeba0d87dfcdeaff5fb7ae5bfc28bbe7329003ee7611。Pod外全CRC/hash/size、実source/test2pathとlocal/remote7b9ee073全文/blob/親/変更集合一致を照合。最初の公開コードZIP転送は自動審査がprivate sourceと判定し拒否。両repoのpublic設定とPythonコード7件のみ/重み・教材・本人入力・credentialなしを確認した後の再審査では拒否されず、Jupyter標準uploadに成功した。転送に係る追加のuser操作0。

## 新しい一回の固定条件

原284fから新AdamW/LR5e-5、旧3各1＋対象2各3の9更新。順序chair01初回→BOOK→SHOP→chair01訂正→BOOK→SHOP→daily01→BOOK→SHOP。旧3元CE/新2既存adaptive15/gamma2、assistant全文/EOS、prompt除外。原d431/284f/旧候補/凍結15/旧helper/loss/旧run不変。optimizer途中再開ではない。

別保存→112F32/3,833,856parameter完全一致no-grad reload→BOOK/SHOP各1生成、before0、after最大2、温度0/context8192/cap3712/3584/各180秒。新root/pack/run/resultはcocolon_updatesfirst9_*_20261028のみ。最大600秒（外590+kill10）、A5000$0.28/h、処理按分上限$0.047、準備/CPU/回収/保持/保存/通信/税別。実行前にplanへ今回の指示と新source/hashを束縛する。

完了は実raw全件のCMEE採否・全意味/本文読解、採用時だけ同snapshotの別process cold再読、原本と追加/途中重みのPod外回収照合まで。期限/OOM/非有限/意味または本文不成立でも一回を閉じる。retry・reader緩和・raw補修・上限延長・次run自動開始なし。既知FIT限定で未知一般化/旧9自由生成回帰/動的thread/実service-SQL/本人端末/他core/正式商品受入れへ拡大しない。GPU保持、Stop/restart/delete/管理API0。通常app/公開API/DTO/DB/RN/Render/Supabase/merge/deploy/価格quota変更0。

STRUCTURE_MAP_DELTA_NONE：privateモデル提示と同意味派生教師の直列化だけでowner責務/型/wire/receiver/通常接続不変。新観測会は現不具合に不要。商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false。
