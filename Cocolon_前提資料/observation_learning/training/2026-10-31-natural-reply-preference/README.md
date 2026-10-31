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
