> **最新：§30の新2組4更新・保存freshreload・全34EOSを完了。否定反転/因果補完等が残り6e1c不採用。** [全実結果と次案](../../../weekly_reviews/Cocolon_Weekly_Review_20261031.md#hedge4-actual-20261031)。次は追加学習を止め、否定の同義書換え2種×527d/6e1cの新4生成で切り分ける案。原文2出力は既存原本を使い再生成しない。実行source接続/新GPU生成は次unit。以下のCPU準備と§27〜29は履歴として保持する。

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



<a id="d691-preference28-actual-20261031"></a>
## 28. 本人宛候補を出発点に28更新 — 話者混在は改善、留保破壊が残り不採用

Mashの前回からの続行指示と今回の再開指示に従い、§27の次案を一回実行した。開始PR30 `a786e2f2`／API PR3 `eb5f0a2b`、PR37 `99f925ec`をfresh確認。Karen-Diary／前提・作業規則／全機能現在地全文／全体設計・01A〜C全file地図／Emlis・CMEE current maps／最新weekly／観測学習の目的／前回source・原本を確認。System Contextの最新cache未成立を成功へ戻さず原本を直接読んだ。root単独編集・実行・全30本文判断・保存・GitHub反映、agentはread-only監査。ChatGPT Workの実行を正式な別モデルPro審査・human Product Readへ換算しない。

### 28.1 固定した一回の実行と保全

製品不採用d691を、この隔離実験の初期値と固定参照へ明示選択した。旧8pair／旧12教師／固定28順／SYSTEM・raw JSON／固定base851bf6e／既存pins・BF16・SDPA・全assistant mask／loss・lr1e-5を維持。af44参照cacheは流用せず、d691の新16reference forwardをCPU scalarへ保存。fresh trainable loadで全112値一致後、pair16＋旧12replay＝28optimizer更新／training forward76を実施した。係数／分割backwardの同条件再計測は16pair全て誤差0（事前abs1e-4・rtol0）。学習38.909947秒／180秒、追加・再試行0。後測定16forwardを更新へ加算しない。

新weights `527dd785837f352a5a7d2fdfc32c53522c7ca7eb8bf02968b795c5eed6c77d48`、config `e9be9757d8df57fbc6ff54e0dbac86d9814ccca07b50eb9b4b04e0b1ae10fa18`を別保存。元model／optimizer解放後、fresh base非学習reloadで全112値一致。Pod外でも112F32／3,833,856有限値／旧d691から全112変化／SHAを照合した。旧af44・6dac・d691・55e9の4重みと各configは前後不変。optimizer／RNGの厳密途中再開状態は保存対象外。

全8の参照比DPO marginは正だが、C06／C07の絶対chosen-minus-rejected SUMは依然負。自由生成や商品合格の証拠にしない。peak allocated8.783195GiB／reserved8.964844GiBは今回短い一回だけの実測で、一般入力・本番必要VRAMへ流用しない。

### 28.2 全30返答の読解と同一入力比較

旧12＋pair8＋既使用8の28messagesを維持し、新NR23／24だけを実行前に別題材で固定。NR23の主体の曖昧さを監査で見つけ、GPU開始前に明確化・再hashした。NR21／22を未使用へ戻さず、評価原文の教師転用0。実30生成／全EOS／欠測0／再試行0、各0.772〜1.920秒。greedy／非thinking／各seed42／context8192／max2048／各23秒を保持。token→全文→索引の順で確定し、Pod外で各call原本と全結果を照合。rootとread-only agentが全30本文を読んだ。

旧d691の同20件、前55e9の同28件について全messages・prompt IDs一致を確認した。T04／NR13の本人宛化とT09の現在否定・未納得の区別を維持し、NR07の本人一人称混在を解消した。一方NR03は旧d691の明示否定反転を避けたものの、否定を省略しており厳密保持の成功ではない。主観的な印象の留保を確定へ変える問題は残る。T10の不明の意味ずれ、T06の同語反復、C08の文法・推測話者のずれも残り、新527dは製品不採用。

新NR23は承諾創作なしだが否定部分の省略・指示対象の曖昧さを残す。NR24は本人の複数感情と印象の留保を保ち、日付確定の創作なし。新2件だけを一般入力の品質合格へ広げない。短い受け取り・一部省略・教師文字列不一致だけを不合格理由にしていない。全体の改善を認めつつ、具体的な残件で採用を止めた。

### 28.3 教師のCPU再確認・費用・次の一作業

旧12完成教師＋8pair chosenの計20をCPUで再読。主観的印象を留保付きの本人宛文へ保持する完成教師はこの20にはない。一方T10の不明は既に完成教師へ記載されており、今回のずれを全て教材不足とはしない。coverage不足の仮説と、既教示内容が自由生成で崩れる問題を分離する。単一原因・4B容量不足・DPO一般の無効は確定しない。

実model処理110.609132秒、親待機窓112.338525秒／600秒・exit0。現在表示$0.58/hで親窓按分約$0.01810。準備・待機・回収・CPU整理・記録・保持を含む総時間／請求額は不明。終了時対象GPU processなし／2MiB／利用率1％の取得値、Stop／restart／delete0で稼働保持。

全63memberの未改変Pod原本／30全文・token／新重み・config／固定参照／counter／学習source／予算／保存reload／旧4重み保全／Pod外照合／全件判断／教師coverage／次案を[cocolon-d691-preference28-20261031.zip](https://chatgpt.com/library?file_id=libfile_8718ec640ca081919ae7f8e1b0adb60c&account_id=personal) version0へ保存。7member／14,338,953bytes／SHA256 `c27c19aec2238c82cfd91e5d793d1b022984fc6d3aa08d907a390f744fc1dd78`。同梱Pod原ZIPは63member／14,332,598bytes／SHA `4b011df819ec05c0c1308b09d0b8642a4f051e350c59e0a4f610ce621faf1043`。private個別本文・資格情報を公開GitHubへ転載しない。

次は同じ28更新／同方式周回を増やさず、別題材で留保と既知／不明を保持する最小修正案をCPUで固定する。今回の評価原文や誤答を正解教師にせず、新loss family／補助基盤を増やさない。新しい実4B試行は別unitで判断し、今回の追加GPU0・追加観測会不要。初期値と固定参照を同時変更したため、今回を初期値だけの単独因果比較と呼ばない。

primary BLOCKER_NARROWED。本人宛化の維持・話者混在改善を実本文で確認し、残件を留保・不明・自然さへ絞った。PRODUCT_NOT_CLEAR／正式0/3／54.50％維持。製品source／owner／通常loss／公開DTO／DB／RN／料金／quota／Render／Supabase／配置／main／他中核変更0、STRUCTURE_MAP_DELTA_NONE（隔離実験のみ）。実emotion submit／本番Auth／RN配布／本人端末／新HTTP-SQL保存は未実行。

<a id="hedge2-cpu-20261031"></a>
## 29. 留保・既知/不明の2組をCPUで検証 — 実4Bの4更新案を固定、未実行

Mashの続行指示に従い§28の次作業を完了。開始PR30 `ff75a505`／API PR3 `eb5f0a2b`／PR37 `99f925ec`をfresh確認。全体現在地・最新weekly・観測学習の目的・原source/実結果と作業規則を照合し、前回監査から全体設計/01A〜C全file地図/current maps/作業規則等36pathの全blob同一を確認した。root単独で作成・CPU実行・保存・反映、agentはread-only監査。別モデルPro審査・human Product Readとは分ける。

### 29.1 新2pairと未使用評価の固定

H01は本人の主観的印象を相手の確定行為へ変えない対比、H02は説明未受領の未知を、聞いた説明が不鮮明だったことへ変えない対比。Karen作成の架空草案で、Mash実演/承認済み正解ではない。同じ本人宛の文体と共通文を使い、局所的な意味差を持たせた。旧評価原文やモデル誤答の正解教師転用0。H02は説明受領を明示的に補う誤答であり、T10の微妙な不明の弱化全般を覆ったとはしない。

旧30messagesを保持し、新pair prompt2＋別題材のモデル未使用NR25/26を加えた34評価案を固定。NR23/24は既使用を明記。旧12完成教師＋8pair/凍結評価は変更しない。新2pair各2回の固定4step順、既存lossとsource/hashをCPU実行前に確定した。

### 29.2 実tokenizer・CPU計算で成立した範囲

同Jupyterで一回、実CPU4.808724秒／外側5.577660秒・exit0、120秒上限内。CUDA_VISIBLE_DEVICES空・前後CUDA未初期化、4B重み読込0／GPU更新0／モデル生成0。既存torch2.8.0+cu128／transformers5.19.0／固定tokenizer851bf6eを使用し、新依存0。重みはSHA確認だけでdeserializeしていない。

新2pair両側はprompt367/372token、chosen24/24、rejected23/27token。prefix・全prompt mask・assistant正文＋既存単一im_end改行・終端・context8192/生成枠2048を実tokenizerで照合した。全34promptの長さと、旧30の全messages・prompt IDs完全一致も確認。近い長さを、長さバイアス解消の証明にしない。

新pairの実token長を用いた17語の玩具CPU logitsで、既存DPO+chosenCEの直接勾配と分割係数の最大差0、固定参照grad未接続、余剰最終logit勾配0を確認した。assistant_sumのfloat32計算に対する絶対差1e-6は実行前固定。これは4B forward/学習/返答品質の証拠ではない。

旧af44/6dac/d691/55e9/527dの5重みと各configは前後SHA一致、終了時GPU2MiB/0％。Stop/restart/delete0で稼働保持。GPU処理0でも保持課金は続き、準備/回収/記録を含む総額は不明。

### 29.3 次の実4B一回案と保全

製品不採用527dを、本人宛化・話者混在改善を保持した隔離初期値/固定参照として明示選択する案。新H01/H02各2回＝**4optimizer更新だけ、旧replay0**。旧28更新や旧8pair/12教師の周回追加ではない。少数更新・replayなしは忘却防止を保証しないため、旧30の意味/主体/否定/時点/話者も全文比較する。

次unitの実装順は、固定base/pins/元SYSTEM/raw JSON/527d・config hash確認→新参照4forward→fresh trainable load112一致→固定4step/16training forward→後測定4forward→別adapter保存→元model/optimizer解放→fresh base非学習reload112一致→旧30＋pair2＋新2の34返答を各1回。既存beta.1/chosenCE.1/lr1e-5/clip1/weight_decay0/seed42、分割score abs1e-4/rtol0を保持。GPU有限runnerへの接続・実行は今回未実施。CPU成功や参照値改善で候補を製品採用しない。

実行案は学習180秒/全体600秒/各生成23秒・context8192/max2048/非thinking/greedy/各call seed42、追加/再試行0。34×23秒の最悪時間は総枠を超えるため600秒を優先し、未完は不採用。前回の短い生成実測から完走を保証しない。最後の表示$0.58/hで600秒窓按分上限約$0.09667、準備/回収/保持等別。新2未使用評価はNR25/26だけで、一般品質の合格率へ換算しない。

全2pair良否/34評価案/4順/proposal/実encoded/CPU source・log/全結果/旧5重み不変/判断/次案を[cocolon-hedge2-cpu-20261031.zip](https://chatgpt.com/library?file_id=libfile_708428edc5b48191a6bbf065a4ad5d42&account_id=personal) version0へ保存。4member/26,589bytes/SHA256 `7a9c5976392eff98f4634f485297e310fbefe720fa286bbf8bbb0d4a533690fb`。同梱未改変Pod原ZIPは14member/24,507bytes/SHA `0b364647d635654238b9982b8565dcc1b68696cee65ce87f1f4d2af83dced4d2`。Pod外でもCRC/全input bytes/hash/旧30messages・prompt IDsを再照合。private個別本文・資格情報を公開GitHubへ転載しない。

primary TECHNICAL_CREDIT（2pair/実tokenizer/mask/CPU勾配検証のみ）。PRODUCT_NOT_CLEAR／正式0/3／54.50％、527d不採用を維持。実4B修正/自由生成/保存reloadは未実行。製品source/owner/通常loss/公開DTO/DB/RN/料金/quota/Render/Supabase/配置/main/他中核変更0、STRUCTURE_MAP_DELTA_NONE。実emotion submit/Auth/本人端末/新HTTP-SQLは未確認。追加観測会は現時点不要。

<a id="hedge4-actual-20261031"></a>
## 30. 留保2組の実4更新・34返答 — 否定反転が再発し不採用

Mashの続行指示に従い§29の一回案を実装・実行。fresh PR30 `f128a9f2`／API PR3 `eb5f0a2b`／PR37 `99f925ec`、前提/作業規則/全体現在地/全体設計・01A〜C全file地図/current maps/最新weekly/観測学習の目的/実sourceと原本を確認した。前回以後は既知4文書だけ変更、関連36pathの全blob同一。root単独で編集・実行・全34本文判断・保存・反映、agentはread-only監査。正式な別モデルPro審査やhuman Product Readとは分ける。

### 30.1 新2組だけ4更新・保存freshreload

製品不採用527dを隔離初期値/固定参照に明示選択し、CPU準備済みH01/H02・34cases・4順・encoded・loss・proposalを原bytesで使用。元SYSTEM/raw JSON/固定base851bf6e/既存pins/BF16/SDPA/LoRA112/dropout0を維持した。旧12のencodingは再照合したが、旧replay分岐は削除し、学習へ入れていない。

新参照4forwardを非学習計測・CPU scalar保存→解放→fresh trainable load112一致→新2組各2回の4optimizer step/16training forward/oldreplay0を実行。beta.1/chosenCE.1/lr1e-5/clip1/weight_decay0/seed42、同train/checkpoint/精度/有効autogradの分割score条件は事前abs1e-4/rtol0で、全4step誤差0。学習7.897596秒/180秒、追加更新/再試行0。後測定4forwardを更新へ加算しない。

新weights `6e1cd9bce4ae366161d363c06546cfce127dab423cd7c203efcc0c8166aaf1ff`、config `fe60b5bd0b8bffd7475947ac0cfd5bdd9ee41d24e97ce1b11e3e126f497ba945`を別保存。元model/optimizer解放→fresh base非学習reloadで全112一致。Pod外でも112F32/3,833,856有限値/527dから全112変化とSHAを照合した。旧af44/6dac/d691/55e9/527dの5重みと各config、旧教師・参照JSONは前後不変。厳密なoptimizer/RNG途中再開状態は保存対象外。

### 30.2 全34本文と旧30の比較

旧30＋新pair2＋開始時モデル未使用NR25/26を各1回、実34生成/全EOS/欠測0/再試行0、各0.733〜1.961秒。非thinking/greedy/各seed42/context8192/max2048/各23秒を保持し、生成promptはsystem/userのみ。token→全文→索引を確定し、rootとread-only agentが全34本文を読んだ。旧30の全messagesとprompt IDsはruntime/Pod外で完全一致、本文は23同一・7変化（T06/T10/T12/C01/C06/C08/NR03）。新NR25/26は以後使用済み。

NR03で明示否定を肯定へ変える問題が再発し、旧527dの省略から明確に退行した。印象の留保を確定へ変える問題も残る。H02は説明未受領と棚へ置いたことを未記載の因果で結び、T10は不明を表す述語が欠け文法/意味が成立しない。H01は理由不明を保持するが印象を省略しており、印象の留保を返せた証拠ではない。**新6e1cは製品不採用**。

一方T04/NR07/NR13の本人宛化とT09現在否定は旧本文同一で維持。T06の同語反復を解消し、C01は二つの否定を再び保持した。T12の程度保持、C08の文法も部分改善したが、C08の推測話者移動は残る。新25は因果不明を保ち、新26は未開封/未来の予定を混同しない。短い受取り・一部省略・教師文字列不一致だけを不合格にせず、具体的な意味破壊で採用を止めた。新2件だけを一般品質合格へ広げない。

### 30.3 選好スコアと自由生成の差、保全・次の一作業

H01/H02は学習前から正しい教師文のSUMスコアが誤答文を上回り、その差は学習後さらに広がった。しかし自由生成では対比した誤答とは別の欠陥を生じた。二候補間の選好改善を、自由な返答の意味保持へ換算できないことを実結果で確認した。旧replay0だけを原因とする対照はなく、単一原因・4B容量不足・DPO一般の無効は断定しない。同方式の小規模教師追加/周回を続ける根拠にしない。

model窓85.601440秒、親87.354517秒/600秒・exit0。最後の表示$0.58/hで親窓按分約$0.01407、準備/待機/回収/CPU整理/記録/保持を含む総時間/請求額は不明。終了GPU processなし/2MiB/0％、Stop/restart/delete0で稼働保持。

全68memberの未改変Pod原本/新重みconfig/34全文token/source/予算/参照/4step・forward counter/保存reload/旧5保全/Pod外照合/全件判断/次の対照診断案を[cocolon-hedge4-20261031.zip](https://chatgpt.com/library?file_id=libfile_5658836d6eac8191af949457bec59a03&account_id=personal) version1へ保存。6member/14,345,045bytes/SHA256 `e921dbafba7b2cfde7817547012203880e7e8cfeac2aac920e1bc25a0a7d6f19`。同梱Pod原ZIPは68member/14,338,298bytes/SHA `2031b18f6c3ded1e0186a57d7d971a81021fed7210b1e0f4c7d461ae26bdbda0`。初版記録の同一本文23件に関する説明を、強調した4件を含む総数23件と明確化して同一fileのversion1へ更新。実原本/判断/実行counterは変更0。private個別本文・資格情報を公開GitHubへ転載しない。

次は追加学習を止め、複数対象への否定を意味等価な二つの書き方へ変え、527d/6e1cで切り分ける案。原文2出力は既存原本を再利用し再生成0、新2書換え×2候補の4生成だけで計6出力を比較する。元の残りの本文・材料・SYSTEM・生成条件を保持する。既使用入力由来の診断で、独立した新規品質評価/学習教材ではない。否定構文だけが原因と決めず、主体・留保・補完も全文確認。入力案はprivate束へ固定済み、実行source接続/新GPU生成は次unit・今回0。

次案は追加学習0/全体600秒/新4生成/各23秒、固定base/pins/BF16/SDPA/元SYSTEM/raw JSON/非thinking/greedy/各seed42/context8192/max2048・再試行0。最後の単価で600秒窓按分上限約$0.09667、準備/回収/保持等別。両候補は製品不採用のまま隔離使用し、自動採用/次学習なし。

primary BLOCKER_NARROWED。PRODUCT_NOT_CLEAR／正式0/3／54.50％維持。製品source/owner/通常loss/公開API/DTO/DB/RN/料金/quota/Render/Supabase/本番配置/main/他中核変更0、STRUCTURE_MAP_DELTA_NONE。実emotion submit/Auth/新HTTP-SQL/新RN配布/本人端末は未確認。追加観測会は現時点不要。
