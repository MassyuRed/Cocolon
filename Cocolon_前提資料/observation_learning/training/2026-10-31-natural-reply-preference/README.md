> **最新：§27の実28更新/30EOSまで完了し55e9は品質未達で不採用。** [全実結果と次案](../../../weekly_reviews/Cocolon_Weekly_Review_20261031.md#preference28-actual-20261031)。次はd691を製品不採用のまま隔離初期値/固定参照として明示選択する修正案で、未実行です。以下のCPU準備時点のaf44実行案は履歴として保持し、消費済み試行を再開しません。

# 本人宛のまま事実を保つ対比修正候補

2026-10-31。weekly§25の次作業。今回の単位はCPU教材/計算実装/検証と実行案の具体化。4Bの読込・GPU学習・生成・製品採用は今回実施しない。rootが編集/実行、agentはread-only監査。

## 目的と教材

旧d691はT04の本人宛化を改善した一方、NR03で否定反転、NR07で話者混在、R02で実行補完を生じた。周回を増やすだけではなく、事実を保つ本人宛返答と、同程度の文体で事実を変えた返答の一対を使う。

架空8組C01〜08はKaren作成の実験草案で、Mash実演/承認済み正解ではない。連言否定、行為主体、感情所有、限定同意、過去/現在、未実行予定、語り手、推測留保を各一組で扱う。誤答側は意図的な比較対象で製品本文ではない。今回までのNR評価入力を教師へ流用せず、旧12/R01〜06/旧評価bytesも変更しない。新NR21/22は今はモデル未使用で、教師へ混ぜない。

## 一つの学習案

固定base Qwen/Qwen3.5-4B@851bf6e、既存pinsと元SYSTEM/raw JSONを維持。参照と初期重みは元af44。6dac/d691を継承しない。新TRL/依存/二重base/報酬モデルを増やさず、参照値を先計測しCPU scalarへ保存する。

assistant正文＋既存の単一im_end改行だけのtoken対数尤度SUMをsとする。promptは除外、truncate/padは使わない。対比lossは `-logsigmoid(0.1*((s_chosen-s_rejected)-(s_ref_chosen-s_ref_rejected)))`。chosenの正文meanCEを0.1倍で足す。参照値は固定/detach。rejectedを正解とするCEは使わない。原論文のDPOにchosenCE/旧教師replayを組み合わせた独自の有限候補であり、原論文設定そのものではない。

8pairを各2回の16optimizer step、旧12のmeanCE（係数1）を各1回の12step、合計28step。順序はseed42で一度shuffleしproposed_order.jsonへ固定。pair stepのlossはDPO+0.1chosenCE、replay stepは旧meanCEだけ。AdamW lr1e-5/weight_decay0/clip1/seed42。これらは実験値で品質保証や最適値とはしない。

2branchのgraph同時保持を避け、同じ重みで無勾配のchosen/rejected scoreから係数を確定し、chosen/rejectedを順次backwardして最後に1stepする。係数は `k=beta*sigmoid(-margin)`、chosen `-k-alpha/n_chosen`、rejected `+k`。CPUで直接autogradと一致を確認する。GPUではdropout0/同一重み/同一token列/同じ精度・forward条件でなければ使わない。係数計測とbackwardのscore不一致は停止し、閾値を後付けで緩めない。24GB適合は未実証。

## 実装・実行順

1. 今回CPUでlossの符号・勾配・causal shift・prompt除外・長さ集計・参照detach/JSON往復・分割backwardを確認。既存PodではCUDA_VISIBLE_DEVICESを空にしてCPUだけ使い、固定tokenizerで8pair双方のprefix/全終端/mask/長さと旧12encoded一致を確認する。重みは読まない。
2. 次の実行unitで既存有限runnerへこのlossを最小接続し、元重み・教材/encoded hashと非学習参照16forwardを確認、参照値を固定保存。元modelを解放してaf44 trainableへ新loadし、旧112値一致を確認する。
3. 28step/学習180秒・全体600秒を上限に一回。単一branch分割の一致・有限値・参照不変・更新counterを記録。追加更新/再試行なし。
4. 別adapter保存→元model/optimizer解放→fresh base非学習reloadで全112値一致。新旧重みをPod外に回収する。optimizer/RNGの厳密な途中再開は対象外。
5. 旧教師12＋新pair prompt8＋既使用診断8＋開始時未使用NR21/22の計30件を各1回、元greedy/非thinking/各seed42/context8192/max2048/各23秒。正解/誤答/評価理由は生成promptに入れない。token→全文→索引の順で保存しrootが全文読解する。pair marginの上昇を自由生成や商品合格へ換算しない。
6. 失敗/期限/reload不一致/未完生成/否定主体等の明白な破壊で候補不採用、追加学習を自動開始しない。HTTP/SQL/RN/本番配置・本人端末は別の未完了のままにする。

全体600秒の按分は最後の$0.58/hなら最大約$0.09667、準備/待機/回収/記録/保持を含む総額は不明。今回GPU処理0でもPod保持課金は続く。GPU Stop/restart/deleteは行わない。製品source/DB/RN/料金/quota/契約変更0、STRUCTURE_MAP_DELTA_NONE。

## 根拠と限界

- DPO原論文 Appendix B: https://arxiv.org/html/2305.18290v3 （2026-10-31確認）。sのSUM、参照差を引くsigmoid目的を確認。
- 公式TRL DPO docs: https://huggingface.co/docs/trl/en/dpo_trainer （同日確認）。参照logprobの事前計算・CPU保持という実装方針を確認。TRLをインストール/実行した証拠ではない。

DPOは事実保持を保証せず、この小規模synthetic対比の汎化も未確認。原本の実誤答は教材の失敗型を決める根拠で、モデルの能力不足/容量不足を確定する根拠にはしない。CPU成功と4Bの学習/返答成功を分離する。


## 今回の実結果

CPUの6検査group/実tokenizer確認を4.676453104秒で完了。4B読込/学習/生成0。分割係数と直接autogradの最大勾配差0。実4B forward/VRAM/品質は未検証、finite runner接続は次の作業です。詳細は[weekly§26](../../../weekly_reviews/Cocolon_Weekly_Review_20261031.md#preference8-cpu-20261031)。

全8pair良否/30評価案/28順/実encoded/数式source/CPU検証source/結果/log/旧重み不変/次計画/判断は[cocolon-preference8-cpu-20261031.zip](https://chatgpt.com/library?file_id=libfile_dea813b14bbc8191a3586374dde0e815&account_id=personal) version0へ保存。9member/34,778bytes/SHA256 `7f74424839f76794219cc7a3f1ab9870fc26e8a0cd5ca89dacb9952359fbe375`。未改変Pod原ZIPは14member/20,151bytes/SHA `3b15fa928a63fffe1241e6debbca953ebf5b85eaa126bc4f3910c53cf74335f2`。個別private本文は公開GitHubへ載せない。


<a id="preference28-actual-20261031"></a>
## 27. 対比学習28更新と30返答 — 技術経路は成立、本人語り等が残り不採用

Mashの続行指示により§26の一回案を実装・実行した。fresh PR30 `b9822b5b`/API PR3 `5deece41`、前提/作業規則・全機能現在地全文・最新weekly・観測学習の目的・実sourceを確認。前回以後は文書だけの差分で、設計/01A〜C全file地図/current maps/製品sourceは同一、既監査を再利用。rootが編集/実行/判断/保存、agentはsource/全30本文/数値/既存比較のread-only監査。正式な別モデルPro審査やhuman Product Readとは分ける。

### 27.1 固定参照から実4Bの28更新・保存再読へ

元af44/configを固定し、架空8pair・旧12教師・28順・SYSTEM/raw JSON・既存pins/固定base/BF16/SDPAを保持。評価原文の教師転用0、d691継承0。非学習af44でchosen/rejectedの参照16forwardをCPU scalar保存し、modelを解放してfresh base+trainable af44を読込み全112値一致を確認した。

実28optimizer update＝pair16＋旧教師replay12、training forward76。beta.1+chosen meanCE.1/replay係数1/lr1e-5/weight_decay0/clip1/seed42。分割係数を計るforwardもbackward用と同じtrain/checkpoint/dropout0/精度/autograd有効にそろえ、直後detachしてgraphを保持しない。再計算abs1e-4/rtol0は事前固定、全16pairの実誤差は0。両branchのbackward後だけclip/stepした。学習39.044257秒/180秒、追加/再試行0。後測定16forwardは更新へ加算しない。

全8の参照比DPO marginは正となったが、C06/C07の絶対chosen-minus-rejected SUMは依然負であり「8件とも良い側を選ぶようになった」とは言えない。自由生成・商品成功とも分離する。今回peak allocated8.783195GiB/reserved8.964844GiBはこの短い一回の実測で、一般入力や他環境の必要VRAMへ流用しない。

新weights SHA256 `55e90885c5f7b12a61f2d51320212c29a7bf7cc0a0ecfa65b0374d20cd48a742`、config `c573a074f3b631f21f9c2373eddbe9884e6cd6ba848e32d324be232df858cb93`を別保存。全112tensor変化。model/optimizerを解放してfresh baseへ非学習reload、全112値一致。Pod外でも112F32/3,833,856有限値とSHAを照合した。参照JSONと旧af44/6dac/d691の3重み/configは前後不変。optimizer/RNGの厳密な途中再開checkpointは保存しない。

### 27.2 全30本文の判定

旧教師12＋pair prompt8＋既使用診断8＋開始時モデル未使用NR21/22を各1回、実30生成・全EOS・欠測0/再試行0、約0.484〜1.717秒。正解/誤答/理由は生成promptへ入れず、token→全文→索引の順に保存。rootが全30を読んだ。

NR03は旧全文コピー/前d691の明示否定反転を避けて本人宛に返したが、「その頃からの寂しさ」は元の距離感と時点の扱いがずれた疑いがあり、約束/準備否定を保持した返答とは主張しない。NR04の本人宛化、NR16の父の期待を発言として返す点も部分改善。一方T04は本人語りが残り、NR07は本人「私」の混在、NR13は電車の事実ずれと本人内語が残る。55e9は製品不採用。

T09は旧曖昧さを維持し、確定した怒り持続への反転と数えない。C05の不明の語り手、C08の本人の可能性からEmlisの可能性提示への移動も改善余地。新21の「了承→承知」は同意否定の厳密保持の証明にせず、明確な承諾成立の反転とも断定しない。新22/C04/C07/NR20等の短い受取りを短さだけで落とさない。新2件を一般合格へ広げず、NR21/22は以後使用済み。

### 27.3 既存base8とaf44同8をCPUで直接照合、再生成せず

次の判断にbase対af44の同条件比較を検討したが、§17のbase8と§21のaf44同8に原本があると監査で確認した。原Library version0を取得し、全messages/material一致と同固定revision/BF16/SDPA/SYSTEM/raw JSON/非thinking/greedy/max2048/context8192をsourceから照合。全8組の旧実本文をCPUで対照化し、新たな16生成を行わなかった。旧baseは各call seed再設定とraw token IDsを残していないため、厳密な数値再現・独立token照合を証明したとはしない。

af44はNR01/02の語法/補完やNR08を改善する一方、NR03/04をコピーする。baseにもNR03の意味補完とNR08のコピーがあり、baseへ戻すだけを解決としない。これは既存実績の再読で、新しいbase生成/学習や商品creditに加算しない。

### 27.4 費用・保全・次の一作業

実行窓109.758419秒/600秒、最後の$0.58/hによる窓按分約$0.01768。準備/待機/回収/CPU整理/記録/保持を含むレンタル全体の時間/総請求額は不明。終了時対象processなし/GPU2MiB/0％、GPU Stop/restart/delete0で稼働保持。

全実入力/30本文token/教師/encoded/28順/参照・後測定/step・forwardcounter/新重みconfig/source/固定予算/保存reload/終了/全件判断/旧base原本・af44比較/次案を[cocolon-preference28-20261031.zip](https://chatgpt.com/library?file_id=libfile_b9a56a0aa7f881919644397b132062fb&account_id=personal) version0へ保存。12member/14,437,521bytes/SHA256 `4798fc59c826dc61328a0e0be5b16120b513938900ab4fde7119813f755e9dcc`。同梱の未改変Pod原ZIPは61member/14,344,513bytes/SHA `1aaf632c2b83c63245764448d3d08b12ef33990629954e79d2e12d702e24172d`。個別private本文は公開GitHubへ載せない。

次はT04/NR13本人宛化・T09現在否定が改善していたd691を、製品不採用のまま隔離実験の初期値/固定参照として明示選択する案。既存8pairの否定/主体/話者修正を同28更新の一回枠で適用し、その本人宛化を出発点に事実保持を直す。55e9の周回追加や候補の製品自動採用ではない。初期値と参照の組合せが変わる比較で、初期値だけの単独因果効果や成功保証は主張しない。d691での新しい参照16forwardを計測し、af44参照cacheは流用しない。NR03否定反転の是正とT04/NR13本人宛の維持を同時に確認する。両候補の改善が組み合わさるという未検証の仮説で、DPOによる是正/転移の保証はない。新評価2件は次の実行前に別題材で固定し、21/22を未使用へ戻さない。source/対象hash/予算/保存再読の固定と実行は次unit、今回この案の追加GPU0。追加観測会は現時点不要。

primary TECHNICAL_CREDIT（実4Bの固定参照/分割更新/保存reload経路）。PRODUCT_NOT_CLEAR/正式0/3/54.50％維持。製品source/owner/通常loss/公開DTO/DB/RN/料金/quota/期限/Render/Supabase/配置/main/他中核変更0、STRUCTURE_MAP_DELTA_NONE（隔離した実験のみ）。実emotion submit/本番Auth/RN配布/本人端末/新HTTP-SQL保存は未実行。
