# 10/28 — 保存284fからのnamed形式9更新・保存再読込・回答後2件

状態：**一回実行・回収終了／CLOSED_NOT_ADOPTED_NO_RETRY**。[最終結果](../named_reference9_result/README.md)：9更新/save/112 no-grad reload/2生成は完了、意味/本文0/2・新9ba8通常不採用。本fileとplanの以下はGPU前の固定点として凍結し、同一runを再開しない。

## 今回の狙い

前回は新形式を各2回学習後も対象のadaptive lossがBOOK1.557/SHOP1.616で、自由生成では冒頭のvすら正しい版文字列にならず、旧新表記混在と反復で終わった。旧9の学習CEは約.001〜.002。この差は、新しい表現をまだ獲得していないという仮説を支持するが、原因確定や4B能力限界の証明ではない。正解source/意味/全7・8更新/本人向け完成本文は既にあるため、今回は観測会を追加せず、既存の完成教師を使う。

前回保存284fから累積し、学習率5e-5、BOOK/SHOP各3回と旧3代表各1回の9更新へ配分する。LRと配分、開始重みを同時に変えるため単独効果は確定しない。namedを各3回だけ行う6更新案はさらに小さいが旧形式の復習が0となるため、今回はchair初回/訂正とdailyの代表3件を残す。旧3投入は旧9の自由生成回帰合格ではない。

## 変えないものと今回の境界

API `a8be7a9bceed35a9f3cb843f22de05bbd5bc6e18`、named/quoteの選択、全15学習messages/targetと評価入力、canonical教師、生成上限、既存loss、意味/本文/問い/全更新の採否、保存/再読方式は固定する。実rawを補修せず明示named receiverへ渡す。新形式・helper family・外部service・endpoint・依存・API/DTO/DB/RN/Render/Supabase/公開/merge/deploy変更0。

Rule18§11.3は、method familyをevidence architecture/canonical routeとし、その範囲の実装技法を技術判断へ含める。今回の新指示に結び付けた既存方式内の新一回であり、終了したnamed13のreactivationではない。root単独write/実行、別文脈agent2枠がread-onlyで学習案・時間推定・scopeを照合した。独立Pro/Ultra/human受入れとは呼ばない。契約/品質条件/時間枠の変更へ拡張しない。

R1.1分類はDIRECT_PRODUCT_OR_ACCEPTANCE_WORK。未完了条件は、既知BOOK/SHOP回答後で新wireを完結し、全意味/更新と本人本文をCMEEへ渡せないこと。今回の学習と実出力2件がこの不足を直接確認する。成功は同じ既知2件の意味/本文/全更新と保存再読、失敗なら保全して一回を終了する。新管理systemや前段Gateを追加しない。

## 固定する一回

初期adapterは `284f1df77c828982bdb7c2480f3f269b71dc9d69a29ea36b48dc6d25ab807d23`。別の初期値コピーへ複製し、元284f・元d431・前回runを変更しない。optimizer途中再開ではなく新AdamW/LR5e-5/decay0/clip1/seed20261024、旧3は元CE/new2は既存adaptive extra15/gamma2、assistant全文＋EOS、prompt除外。

固定順序：chair01初回→BOOK→SHOP→chair01訂正→BOOK→SHOP→daily01→BOOK→SHOP。計9更新、別保存、新112F32を完全一致/no-gradで再読込後、BOOK/SHOP各1生成だけ。before0/after最大2、温度0、BOOK3712/SHOP3584、context8192、各180秒。

全体600秒（外590＋kill10）、$0.28/hのGPU処理按分最大$0.047。準備/CPU/回収/継続保持/保存/通信/税等は別、請求総額ではない。今回の系列tokenは前回67800→57976だが、系列長二乗和は402477804→402516958でほぼ同じ。実kernelの時間をtoken数へ比例させず、前回556.85秒付近もあり得る保守的感度とし、完走保証はしない。

不変性/context/EOS失敗、OOM/非有限、期限/長さ/意味/本文不採用で終了。追加生成、同条件retry、LR/回数探索、時間枠延長、reader緩和、意味補完、次run自動開始なし。失敗時も新/途中重みと全raw/logをPod外へ回収照合する。GPUは稼働保持、Stop/restart/delete/管理API0。

## CPU確認と原本

同API/同学習・評価bytesであるため、前回のCPU347成功/SQL12対象外・旧15receipt/snapshot/fulloutcome完全一致・合成named2意味/本人本文/全更新/cold2一致は、source/hashを確認して再利用する。今回347件を再実行したとは記録しない。今回新たに、全15の現API実messages一致、実tokenizer/EOS/mask/context、284fコピー112F32有限性、元run/source不変、9更新の回数・順序・入力長をCPUで確認する。model load/forward/学習/生成/SQL0。

CPU実結果、planとsource/hashは本dirのJSON/原本ZIPへ固定する。成功したCPUから一回GPUへ進む範囲内で、実装hash確定だけの再承認往復は増やさない。

今回も既知2件の有限適合確認。新初回4/全15新GPU評価/旧9回帰/動的thread/未知一般化/実service-SQL/本人端末/他core/正式商品受入れは含まない。商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false、STRUCTURE_MAP_DELTA_NONE（モデル学習条件だけ、製品責務/型/wire/readerは不変）。

CPU実測6.691307850秒、model load/forward/学習/生成/SQL0・CUDA未初期化。全15実messages/token/EOS/mask/context不変・112F32有限・固定9順序を確認。CPU原本72057bytes/SHA1a5be34bd4230416ae34635587237e834a51ed03d607cde44f6f5f76a3842c32、10payload＋manifest/11memberをPod外で全CRC/hash/sizeと実行source4同一照合。347成功/旧15完全一致/new2合成cold成功は前回証拠の再利用で、今回再実施ではない。planはこのCPUと実sourceに束縛し、currentな新継続指示を根拠にAUTHORIZED_ONCE_BOUNDへ固定。
