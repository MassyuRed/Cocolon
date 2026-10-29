# 指示表記2点の修正 — CPU完了、追加学習なし2生成の具体案

前回のfixed_rows5は閉鎖済み。新f811は不採用、BOOK/SHOP意味・本人本文0/2、旧9は7→6/9。今回そのrunを再起動せず、元f493へ与える指示だけを調べた。華恋/rootが実行・編集・判断を担当し、補助agentはread-only。実際の環境はCodex Workであり、正式Pro/Ultra/human評価を称さない。

## 確認した不整合と修正

| 箇所 | 修正前 | 派生入力の修正後 |
|---|---|---|
| output_spec.shape.root | [v,a,q,c]。別説明では5要素rootを指定 | [format,v,a,q,c] |
| output_spec.axes_requirementsのsubject例 | subject={bind:OMITTED,entity:null,ev:[]}。別説明ではrowを指定 | subject is the fixed subject row ["OMITTED",[],null] |

before両rawの冒頭は実際に4項目名を出力へ写していた。after BOOKはnamed objectとの混成、SHOPは内部文字列化だった。この表記不整合がどの程度寄与したかは、実4Bで未確認。主因・教材不足・修正成功と断定しない。意味要件の検査を緩めたり、出力rawを直したりしない。

[prepare_shape2.py](prepare_shape2.py)で変更後を逆に戻して元input objectと全一致することを検査。system/material/prior/他output_spec・全教師本文は不変。教師の意味値、引用、名・ID、全更新、bind、本文とEOSを変えない。4列目urの既存規則、priorのnamed表記も維持する。歴史final_v2と前回runの原本は変更しない。

## Jupyter CPU実結果

CPU31.87833088694606秒、モデルload/forward/更新/生成0。[cpu_summary.json](cpu_summary.json)に計数、[external_verification.json](external_verification.json)に回収identity。

| ケース | prompt前→後 | 全assistant＋EOS | prompt＋既存生成cap |
|---|---:|---:|---:|
| BOOK回答後 | 4292→4295 | 2148、不変 | 8007≤8192 |
| SHOP回答後 | 4444→4447 | 2424、不変 | 8031≤8192 |

2教師を実receiverへ渡し、意味/本人本文2/2・元rows/metadataによるreceipt replay・別process cold full outcome2/2一致。rootも両教師の実本人本文を読み、教師対照を実モデルの成功へ換算しない。旧9のtrain/eval bytes・全9の実tokenizer再計数・教師は旧凍結束と一致。f493は112F32全finite・hash一致。既存依存transformers5.19.0/peft0.21.2/accelerate1.15.0/safetensors0.8.0をJupyterで再照合、新依存なし。

完全CPU ZIPは201969bytes、SHA256 8888c0c696159385f67e5323be0635521fda9559421573d8f83d3a781113c411、10memberを回収・保管済み。CRCとmanifest8payloadの全長さ/SHA、manifest外のprepare sourceをcpu_check.frozenとlocal source bytesで照合した。cpu_checkには全encoded/mask/frozen・全outcome、teacher_cmeeには2saved/2coldを保持する。重みやbase modelはこのCPU ZIPに含めない。通常受領/意味型/三core/API/DB/RNの構造差分なし、STRUCTURE_MAP_DELTA_NONE。商品0/正式0/3/54.50％・candidate_ready=false。

## 次の一回の具体案 — 未承認・未実行

この非学習2生成は前回の一回承認に含めず、別の費用確認対象とする。[plan.json](plan.json)はPROPOSED_NOT_APPROVED_NOT_EXECUTED、[runner](run_shape2.py)もこの状態では実行を拒否する。新しいGPUの契約や管理画面操作はしない。

1. 同Pod vgkm402msgroiu/RTX A5000、固定Qwen3.5-4B revision851bf6e、元f493を非学習で1回だけ読む。f811は使わない。全重みrequires_grad=false・112tensor/hashを既存loaderで確認する。
2. 修正済み入力からBOOK→SHOPを各1回、計2生成。追加学習・optimizer・新重み保存は0。greedy/非thinking、context8192、cap3712/3584、意味prefixや文法拘束・補完なし。元raw/token IDs/finish/model/base/adapter metadataを保持する。
3. 実行全体はtimeout590秒＋kill10秒＝最大600秒、各生成180秒。前回同Pod表示$0.28/hによる最大処理按分$0.047、live単価再照会なし。準備/親外CMEE CPU/回収/保持/保存/通信/税等は別。
4. GPU解放後、既存consume_fixed_rows5.pyのphase beforeで新OUTの2rawをそのまま受領する。CPU親外150秒、成立snapshotごとのcold60秒上限。両方の実meaning/body2/2、cold全outcome/replay一致とrootによる全raw/本人本文読了を確認する。CPU教師成功だけでは満たさない。
5. 不成立・timeout・不正形式なら、その結果で閉じる。retry、追加学習、raw修復、旧形式fallback、loss調整、次runは行わない。成功しても通常採用/商品受入れ/本番有効化・service/SQL・merge/deployへ自動進行しない。

旧9は元f493・同一promptのため今回GPUでは再生成しない。CPUの全9不変確認と、前回f493の実7/9を区別し、新しい旧9推論の成功を主張しない。新2件は既知教師FITであり未知一般化ではない。GPUはMashの指示まで保持する。

実行時はこの具体案へのMashの承認を受けてstatusを承認済みへ同期し、source commitとCPU report/eval hash、全frozen/固定依存を再確認する。OUT=/workspace/cocolon_shape2_run_20261029の排他作成が一回lockで、既存OUTを削除/再利用しない。CMEE呼出は既存consumerを使い、receiver/APIの変更は不要。

現2題の正解教師は既存材料で成立しており、追加観測会は今は不要。新材料を増やす前に、この入力不整合の影響を低費用で切り分けることを推奨する。primary outcomeはBLOCKER_NARROWED、実モデル改善・product creditは未確認。
