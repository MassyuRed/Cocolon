# 受け取り6更新の実結果 — 日常3件成立、旧chair保持に失敗して不採用

**6更新・保存/非学習reload・FIT9は完了。意味7/9・本文6/9で全9成功条件は未成立、条件付き2件保存再読はcall0で終了。** 2026-10-25 JST。

| 実FIT | 意味 | 本文 | 前版quote18からの変化 |
|---|---:|---:|---|
| chair初回3＋訂正3 | 4/6 | 3/6 | 旧6/6から退行。採用初回ASK1、意味採用された訂正3件は各3更新 |
| 日常の食事/少し落ち着いた3identity | 3/3 | 3/3 | 旧本文0/3から全3が教師parsed完全一致、問いなし |
| 合計 | 7/9 | 6/9 | 旧意味9/9・本文6/9。総本文数は増えず意味は2件低下 |

[承認済みplan/runner](../../training/2026-10-25-emlis-quote-address/README.md#quote-reception-fit6-approved)。source6cea8816/API4002b457、初期138b9ff7/新AdamW/LR5e-5/既存32LoRA。daily3の受け取り11tokenだけ各2回、chair学習0、全文prompt/teacher/EOSをcontextへ保持した。939.715479秒、前後reception NLL平均0.279111952→0.015793586。loss改善を旧能力保持や商品品質へ換算しない。

## 退行と判定

- chair01初回はjoy_ground.to_claim_idが存在しないappraisal_objectへ変わり、model_relation_direction_or_scope_not_boundで意味HOLD。受け取りにも問いが混入。
- chair01訂正は意味/訂正3更新を保持。教師observation「一緒に椅子を直した」が「直せた」へ変わりmodel_surface_not_validated。受け取り差による失敗とはしない。
- chair03初回は「私なりの」の反復を含み2560tokenで打切り、EOSなし/JSON未完/TOKEN_LIMIT。単なる上限不足や4B一般の能力限界とは断定しない。

rootは全9のsurface/問い/訂正と採否を確認し、別文脈agentも読取で同じgate不成立を確認。8件解析可/1件打切り。daily3は同1話のidentity違いで未知3話ではなく、独立話はchair/dailyの2話。新f1e88e3eは不採用/サービス選択0、初期138b9ff7の3file/旧helper/教師/prompt/raw不変。

全9条件未達のため実modelの別ID2初回/隔離SQL保存・中断再開は0、eval plan未作成/draft未activate。成功時用の合成CPU準備だけSQL30/source2/model0で保存再読2・中断再開1/禁止0が成功した。これは実4Bの証拠ではない。draft/CPU結果は同folderへ準備履歴として保持する。

追加update/LR探索/同要求retry/raw補修/reader緩和0、この一回を閉じ再起動しない。新観測会は今回不要。次は保存差分から日常受け取りと旧chair保持を両立する方式を検討し、新GPU試行を自動開始しない。

## 保全・費用

早期archiveは3,474,577bytes/SHA6c2aaad96bf1090d1cc11d1637095365e69b4183bfdb3464090fef98574d7c25、全16対象/32F32有限をPod外照合して[追加重みを保管](https://chatgpt.com/library?file_id=libfile_5c99cce0e5c48191b628ba37d62be5d0&account_id=personal)。内runは生成0時点。完了archiveは6,966,423bytes/SHA6c7f103a3866daa1f0b7c84c2db16d65fff44a9cc700fd39c278da8babd535c9、全19対象size/hashを回収照合し重みは早期回収と同一。元4B全重み/optimizer/RNGは含まない。

原raw9は221,322bytes/SHAe0b13ce620d1a67300bd971c88877416617226df5420e281973f13590e62a6fd。consumerは1,505,922bytes/index＋24partsへ無損失保存。index順で区切りなし連結しsize/hashを確認する。新生成/学習/DB操作0の実consumer一回だけで、receipt.raw_outputも全9で原rawと同一。

GPU peak allocated10.482319/reserved11.972656GiB。記録単価$0.26/hによる処理按分はUSD 0.06786834。準備/回収/継続保持/保存/税別で請求総額ではない。上限1800秒/$0.13内、後段900秒/$0.065未使用。

実tokenizer前のlocal code組立ては構文誤り1をfile/effect前に修正。後段API共有clone/fetchは旧shallow object欠落で失敗し、旧sourceを変えず独立した固定4002b copy取得で解決。GPU trainer/model再実行0。新依存/インストール0、管理console/GPU一覧/Runpod API0、Jupyter直結だけ、GPU Stop/再起動/削除/新Pod/charge0。

closure.jsonは全9採否/本文/問い/更新/教師差と後段0、run/trainingは実6更新/9生成、after_fitは無補修原raw、before/after_reception_nllは同11tokenの前後各3、manifest/recovery/weightsはPod外照合、consumer index/partsは全実消費結果、conditional draft/CPU準備は未activate経路を所有する。

STRUCTURE_MAP_DELTA_NONE。製品owner/意味/reader/公開API/DB/RN/他core責務不変、商品0・正式0/3・54.50％据置。日常への局所適合を新adapter採用成功へ昇格しない。
