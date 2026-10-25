# Surface12 — 12更新・保存再読込・9件検査の全実結果

2026-10-26 JST。**意味8/9・本文8/9、全9条件未達で終了。条件付き2件保存再読はmodel/SQL0。新e1db重みは保存・未採用。**

Mashがdd3cabb4の新一回「12更新→保存・再読込→9件検査→全件成功時だけ2件保存再読、最大45分/処理按分$0.195（保持等別）」を承認。実行sourceはc86ef0cae18b2c2905a4e043c0d5e4010e7638af、API4002b457、Jupyter直接、PID643003/started1792963395.2611406。一回の12更新/保存/32有限/非学習reload/9生成を1014.356336秒（16分54秒）で完了。旧138b/9教師/prompt/固定12順/LR5e-5/readerを保持し、dailyだけ観測9＋受け取り11＋接続5の連続25tokenを学習した。新AdamWで、optimizer/RNGの厳密途中再開ではない。

## 結果と原文差分

全9JSON/EOS正常、上限2560による打切り0。chair6は初回ASK3/訂正各3更新/REFINEDと全parsed教師を保持。daily01/03はFINALで採用。前回の未完文はrawとして解消し、**全9のsurface_proposalは教師一致**。ただし本文候補一致を意味採用や商品合格へ換算しない。

daily02だけ、return claimのtext・predicate.surface・evidence_quotes[0].quoteが「帰って」から「帰ってから」へ変化。引用自体は実入力内にありquote compileは[0,5)へ成功する。しかし既存意味admissionの帰宅roleは「帰って」[0,3)を切り出すため、接続助詞まで含む範囲をUNSUPPORTED/model_evidence_out_of_scopeで拒否した。出典外創作やJSON不正ではなく、モデルの意味単位と固定CMEEの許容根拠範囲の不一致。残8件は前回boundary12のraw_textと同一で教師parsed一致。

root華恋が全9raw/本文候補/問い/訂正/採否を読み、別文脈agentも全9と実admission sourceを読取確認した。これは正式Pro/Ultra/human Product Readではない。前回boundary12の意味9/9・本文8/9に対し、今回は意味8/9・本文8/9。文末修復の局所結果はあるが全体保持は未成立で、新重みを採用しない。全9条件が偽のため後段eval plan未作成、実service2件はmodel/SQLとも0。閉鎖済み一回を起動し直さず、追加学習/同要求再call/reader緩和/raw補修0で終了した。

## 回収・費用・境界

早期archive3,478,524bytes/18対象hash/32F32有限と、完了training archive3,494,749bytes/21対象をPod外照合。早期/完了adapterは同一e1db3df3、初期138b/旧helper/教師/API不変。recovery bundle3,624,744bytesの4対象はtraining archive・全consumer・launch・gateで、manifestを含め5member。全重み/原raw/consumerは同一保管identity libfile_f2750b499f00819193e481ee48ca0eb7のversion1へ更新保存済み。元4B全重みやoptimizer/RNGは含まず、単独完全モデル保存とはしない。全consumerはconsumer.index.jsonとpartファイルを順にUTF8 byte連結して復元する。

処理按分は1014.356336秒×記録$0.26/h＝約$0.07325907。学習/FIT1800秒/$0.13内、条件付き後段900秒/$0.065未使用。準備/回収/継続保持/保存/税等は別で、請求総額のhard capではない。GPUは保持し、Stop/再起動/削除/新Pod/charge/管理console/GPU一覧/Runpod管理API操作0。

途中入力のbrowser parse1・Python改行SyntaxError1は実行file/child/model効果前。修正後の学習起動は一回。早期archive照合の手入力SHA誤記は原本を再照合して修正し、全18member/32tensor検証成功、再download0。これらをモデル試行の再実行とは数えない。

既存Node v24.22.1/PGlite0.5.8とprivate Python runtime、固定API4002b/cleanをJupyterでread-only確認したが、条件未達なので新SQL起動は0。依存追加/Render/Supabase/本人DB/通常application/公開API/DTO/RN/merge/deploy変更0。

surface25-token NLL平均0.138614719→0.005865229、chair全文0.000944048→0.001161005。対象の異なる旧12token NLLとは直接比較・合算せず、loss低下を品質成功へ換算しない。

今回の残課題に新観測会は不要。既存入力と正しい教師があるため、次は引用・述語をどの単位で区切り、既存CMEEの根拠範囲と合わせるかを扱う。新有料試行・意味admission/readerの変更は未承認。独立2話、一般化未確認、Piece/Analysis完成教師0は継続。

primary_outcome=BLOCKER_NARROWED、STRUCTURE_MAP_DELTA_NONE、商品0/正式0/3/管理54.50％。各細目・全採否はclosure.json/run.json/after_fit.jsonl/consumer原本へ戻る。
