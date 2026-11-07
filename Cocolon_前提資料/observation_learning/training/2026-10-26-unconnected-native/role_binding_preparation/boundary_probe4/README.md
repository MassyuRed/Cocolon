# 正解prefix条件付きの境界診断4回 — 2026-10-29 JST

**現在：一回完了・閉鎖。追加学習0/1load/4suffix生成、条件付き意味/本人本文0/4、EOS2/4・strict JSON1/4。重み不変/f493不採用。**

前回role18の全文BOOK/SHOPはEOSだがstrict JSON不正・意味/本人本文0/2、旧9はafter-only7/9/cold7、新f493不採用で閉鎖した。この結果は変更しない。今回の目的は、局所課題の誤投影ではないことを確認した上で、**正しい意味から更新列を作る段階と、正しい全更新から本文を作る段階のどちらで崩れるか**を切り分け、次の学習を絞ること。全体00/観測学習意図/全体設計01・全file地図01A/B/C/current maps/最新weekly§101と元教師・raw・sourceを確認した。モデル選定・一般観測・三中核の完成判定へ戻らない。

## 確認した差と実行前に固定した条件

最終v2の局所13行はtarget/spec/root階層・参照に明白な誤投影なし。前回raw2件は共通してprose.binds直後にproseを閉じ、本文3fieldを外へ出す。局所ADDはBOOK2/6・SHOP3/7だけをgold意味から教え、全文の自主意味→全更新列への転移を未測定。新局所ADDの更新直前loss1.10〜1.49、END0.742/0.799を、習得済み/原因確定とはしない。rootと独立read-only補助が原bytesで確認した。

| 診断 | 正解として先に与えるもの | モデルが続けて出す部分 | input / cap |
|---|---|---|---|
| BOOK GOLD_MEANING | 正規全文prompt＋正解q/claims/relations等 | unknownsの閉じ記号からupdates全体・prose・閉じまで | 6699 / 832 |
| BOOK GOLD_MEANING_AND_UPDATES | 上記＋全正解ADD/GAPの各内容 | updatesの閉じ記号からprose・閉じまで | 7056 / 448 |
| SHOP GOLD_MEANING | 正規全文prompt＋正解q/claims/relations等 | unknownsの閉じ記号からupdates全体・prose・閉じまで | 7066 / 960 |
| SHOP GOLD_MEANING_AND_UPDATES | 上記＋全正解ADD/GAPの各内容 | updatesの閉じ記号からprose・閉じまで | 7460 / 512 |

prefixは別taskのJSONを再シリアライズせず、凍結full teacherの実token列をそのまま切る。全4境界はmarker先頭より2文字前、間はJSON閉じ記号/区切りだけ。次要素の意味内容・本文・bindを先渡ししない。question=nullは元CORDERでupdatesより前に一度だけあり、後で再出力させない。原教師と評価promptはbyte同一。与えたprefixと生成suffixを別保存し、そのまま連結した候補を既存CMEEへ診断用に通す。後補修・足りない括弧/本文の追加0。

- 保存重みf4932d3a2bac1d8e78d0bf86579868e29546914512234d31556840eb28a85c19、固定Qwen3.5-4B/base851bf6e8。初期afaaを再学習しない。
- 既存expanded owner/helperを使う非学習1load、0update、4自由suffix生成。context8192、greedy、各180秒、処理最大900秒/按分$0.07（親890秒＋kill10秒）。上限内の完了保証なし。
- 費用按分は前回同Pod表示$0.28/hを使う。今回live単価再照会なし。CPU/準備/回収/保持/保存/通信/税等は別。
- Pod vgkm402msgroiu/RTX A5000 24564MiB・実GPU使用1MiBを今回も確認。Jupyter直接接続。管理console/API・新GPU・lifecycle・dependency取得なし。
- 新folder/lockをexclusiveで作り、旧run/枠/lock再利用・retry・上限延長・次GPU自動開始0。deadline/OOM/nonfinite/identity不一致で終了、出た原本を保持する。

## CPU原本と境界

実CPU4.611860721954秒、モデルload/forward/生成0、source/初期afaa/保存f493/元入力/元role18 ownerのhash一致。完全prepared_cpu.jsonは459860bytes/SHA b03a26bd2ae402b89cad6426595fb8b118e45df97c0b2a9cbf9b6acc27900c94。実token列・prefix・期待suffix・全入力hash・capが入る。全prefix＋期待suffixで元教師を復元し、input+capは全8192以内。CPU log/exitとsourceを56206bytes ZIPで回収、全CRC/size/hash・source一致をPod外確認した。ブラウザdownload APIは失敗を返したが実fileは到着し、無変更bytesを照合した。追加download/CPU再実行0。

## 読み方・完了条件

意味条件が不成立/全更新条件が成立なら更新列側へ、全更新条件も不成立なら正しい上流からでも本文階層・bind・閉じ側へ、題材ごとに残件を絞る。両方成立しても「正解を先に与えると末尾を作れた」だけで、自主意味/更新計画/全文採用の改善とはしない。条件が違うため前回全文rawとの改善率を出さない。

全4suffix原本とCPU/CMEE診断を回収し、本人向け本文・全更新・typed bindを読み、原因仮説と確定事実を分けて既存入口/weeklyへ保存した時点で一回終了。今回判定はconditional限定、gold_assisted=true、eligible_for_full_generation_credit=false。正式商品受入れ・通常有効化・学習重み採用へ換算しない。新観測会は現2題には不要。

current Mash「4B学習＋CMEE接続を続けて」の中で選んだ一つの限定診断。root GPT-6 Codex Workが唯一のwriter/executor、補助はread-onlyで、正式Pro/Ultra/human受入れは主張しない。primaryは結果でBLOCKER_NARROWEDを判断し、商品0/正式0/3/54.50％・candidate_ready=false/automatic_progression=falseを保持。通常app/API/DTO/DB/RN/Render/Supabase/merge/deploy変更0、商品構造差分なし（STRUCTURE_MAP_DELTA_NONE）。


## 実行後の最終結果

**現在の直接作業（10/29・境界診断4回完了）：** 保存f493を非学習1load/0updateで正解意味まで・全更新までのprefixから4suffix生成し、条件付き意味/本人本文0/4、EOS2/4・strict JSON1/4。BOOK意味条件はHOLD/更新未束縛、他3は不正形式でREJECT。正しい意味を与えても更新割当が欠け、正しい全更新を与えてもbind反復/参照種類混同・本文/閉じに不備が残ると切分けた。処理120.668072秒/$0.009385294476按分、CMEE CPU1.845805秒（準備/回収/保持等別）。全原本回収・CRC/hash/112F32照合、新重み0/f493不採用。次候補は元全文2本のupdates境界以降〜EOSだけを重点化する2更新で、CPU/起点/評価/費用は未固定・未実行。前回全文0/2・旧after-only7/9/cold7は保持し、条件付き成功を全文成功へ数えない。現2題の新観測会不要、GPU保持。

BOOK意味634/EOS/JSON成立→HOLD model_v3_explanation_updates_not_bound。BOOK全更新448/noEOS・SHOP意味960/noEOSはcap到達、SHOP全更新326/EOSはJSON閉じ不足。後3件→REJECT semantic_receipt_not_validated。上限延長・同じ診断再試行は行わない。全112F32/3,833,856parameterの非学習読込、adapter/frozen前後hash一致、新重み0。原本18payload/86686bytesの全CRC/hash/sizeをPod外照合し、親のCPU/source4fileとresult配下に全bytesを保存。primary=BLOCKER_NARROWED。

[全4原文・意味・本文の読取](result_20261029/reading_review.md)／[終了集計](result_20261029/result_summary.json)／[完全CMEE診断](result_20261029/conditional_cmee.json)／[原本対応](result_20261029/archive_payload_locations.json)。
