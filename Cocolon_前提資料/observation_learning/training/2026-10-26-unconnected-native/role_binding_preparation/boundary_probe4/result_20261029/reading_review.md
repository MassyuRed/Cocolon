# 境界診断4件の原文・意味・本文の読取 — 2026-10-29 JST

## 結論と範囲

保存f493を非学習で1回読込み、正規全文prompt＋教師の実token prefix2境界×BOOK/SHOPの4suffixを生成した。追加学習0・新重み0、4call完了。**条件付き意味/本人本文は0/4、EOS2/4、strict JSON1/4。** これはgold_assisted診断であり、前回の全文意味/本文0/2・旧after-only7/9/cold7・f493不採用を変更しない。原run.jsonのpending statusは凍結し、result_summary.jsonが一回閉鎖を所有する。

元局所13行のtarget/spec/階層/参照に明白な誤投影は認めなかった。今回の結果により、**自分で生成した意味の誤りだけが下流失敗の原因、とは言えない。正しい意味からの全更新生成、さらに正しい全更新からのbind/本文/終端にも不備が残る。** 一般的な4Bの能力限界、全学習法の不成立、教材不足を確定した実験ではない。

## 原本と条件

source f6f1bb485dc73c11e6669062301893440502d248 / probe4.py SHA1d29016ab5b4dbebbc12cfa20159f2f85ee8dad695d51a46709959d6b0b4aade。CPU459860bytes/SHA b03a26bd2ae402b89cad6426595fb8b118e45df97c0b2a9cbf9b6acc27900c94、実4.611860722秒。元全文教師の実token先頭片を使い、全prefix＋期待suffixが元教師bytesに一致。全actual boundary=requested−2で差は `],` だけ、次の要素の意味内容は混入0。意味条件はunknowns配列、更新条件はupdates配列を閉じる記号からモデルが生成する。question=nullは元位置でprefix内に一度だけある。

与えたprefixと生成suffixを別保存し、生成前に固定したprefixを無変更で先頭へ戻した候補を既存CMEEへ渡す。後から括弧・引用・意味・本文を修復していない。4件とも期待suffixは固定cap内だが、モデルは別内容を反復/省略した。cap延長だけを次の修復へ推奨しない。

## 全4suffix・全更新・本人向け本文

| 条件 | 生成/形式 | 実CMEE | 原文の所見 |
|---|---|---|---|
| BOOK・正解意味まで | 634token/EOS/strict JSON | HOLD/model_v3_explanation_updates_not_bound、意味/本文0 | 教師6ADD＋GAPに対し5ADD＋GAP。late_awareness/no_contactを混載し、その根拠は時点句。q_extra_9はgoldに実在するため未定義引用とはしない。returned/counterfactual/continuing_concernも1ADDへ混載。relation-only ADDと元action_link/memo_linkの再ADDがあり、answer_explains_targetは更新対象にない。本文3欄はいずれも「本人の原入力として保持」「追加された意味」といった内部処理説明になり、当該気がかりへの本人向け受け取りではない |
| BOOK・正解意味＋全更新まで | 448token/TOKEN_LIMIT/noEOS、文字列途中 | REJECT/semantic_receipt_not_validated、意味/本文0 | 正解更新を与えた後でもupdate_note bindを同じ内容で3つ完結反復し、4つ目のur配列途中で打切り。observation/reception/update_note本文へ未到達。bindの終了/本文への遷移が未成立 |
| SHOP・正解意味まで | 960token/TOKEN_LIMIT/noEOS、本文文字列途中 | 同REJECT、意味/本文0 | 教師7ADD＋GAPに対しfelt_distanceのADD1＋GAPのみ。残6追加claimと附属relationの対応が不足。rrへclaim IDが混入。Observationで「具体的に一緒に準備をして、約束して」と否定を反転し、「その時、開店したと聞けて…」を反復。Reception/更新説明へ未到達 |
| SHOP・正解意味＋全更新まで | 326token/EOS、JSON最外root閉じ不足pos10666 | 同REJECT、意味/本文0 | prose内に3本文fieldを置く階層は正しい。ただし最外rootを閉じていない。crにanswer_concession/distance_link/answer_explains_targetというrelation ID、rrにno_joint_preparation/no_promiseというclaim IDが混じる。一人称の原文再述・update_noteの長い列挙が残り、本人へ向けた受け取りではない |

rootが全4suffixと教師/実CMEEを読み、独立read-only補助も全更新/本文/参照を全文比較した。無効JSONの深部所見は静的な読取であり、実CMEEが受領後その理由まで判定したという主張ではない。実拒否理由は表のコードだけ。中間の「BOOKは両条件ともJSON成立」というrootの画面誤読は、片方だけへ訂正した。原raw/実行/採否を変更していない。

## 次の最小直接候補

**元全文教師2本のprompt・assistant全文・token列を保持し、今回のupdates開始境界以降〜EOSだけへlossを置く2更新の候補**へ絞る。新しい部分JSON課題やgold userフィールドを増やさず、今回不成立だった同じ継続箇所を正規全文内で直接教える。今回の正解条件付き診断を製品の生成方式へ移す案ではない。

過去§75のlocalized30はquote形式の固定198位置を相対16倍にし、全文/EOSの正のCEも保持する30更新だった。今回候補はnamed全文2本の連続suffixだけであり、同条件の再実行ではない。ただし実CPUでlabel/causal window/全contextを確認し、起点・量・前後評価・費用を固定する作業はまだ行っていない。2更新が十分とは未確認であり、今回のrun/上限を再利用して開始しない。前回f493の全文2＋旧9と今回条件4の原本を、同じidentityが成立する時だけ次のbefore比較に使える。

新観測会は現2題の欠陥修正には不要。一般化、Piece/Analysisの完成教師、独立未知評価は別の不足として残る。

## 保全・費用・終了

実処理120.668071834秒/前回同Pod表示$0.28/h按分$0.009385294476。今回live単価再照会なし。準備CPU4.611861秒/CMEE CPU1.845805221秒、準備・回収・保持・保存・通信・税等は別。0update/1load/4gen、timeout/OOM/retry0、2件のtoken cap到達は保持。全adapter3fileとfrozen入力は前後一致、新重み作成0。

結果回収ZIP86686bytes/SHA60738af20a88356d73325f42504ed2c0bab0a0c668341443c5be6160960fde76、18payload＋manifest19member。全CRC/size/hash、CPU/source同一、全4prefix＋実suffix、raw/file hash/token cap/adapter revisionをPod外照合。全payload bytesは本result配下と親の既存probe4.py/prepared_cpu.json/cpu.log/cpu.exitで保存する。外部manifestにその対応を残す。使用f493重み/元凍結bundleは既存Library libfile_e089337060248191a52ee06aad6fc75a v0/47,007,311bytes archiveへ保持し、今回重複の重みarchiveは作らない。

primary=BLOCKER_NARROWED。商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false、f493不採用。GPU保持/Stop・restart・delete0、通常app/API/DTO/DB/RN/Render/Supabase/merge/deploy変更0。root GPT-6 Codex Work単一writer/executor、補助は正式Pro/Ultra/human受入れではない。商品構造差分なし（STRUCTURE_MAP_DELTA_NONE）。

