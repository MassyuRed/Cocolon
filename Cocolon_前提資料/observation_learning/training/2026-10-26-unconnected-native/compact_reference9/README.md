# q/u参照名の無損失短縮：一回終了・新候補不採用

2026-10-28 JST。source664ce89431d31090e26869b3ef66dd687713275d、API7b9ee073de03940ba71587297d8600b2b6094dd1。Jupyterへ直接接続して実行した。最終状態ownerは[result_summary.json](result_summary.json)、rawのRAW_COMPLETE_PENDINGと実行planは凍結原本である。

全15promptと他13教材行bytesを保ち、BOOK/SHOPの教師だけ引用名q.id/evと更新名$id/urをq0…/u0…へ短縮。cid/rid/uid、native role、原文、意味、全更新、本人文は不変。原教材は置換せず別派生を使用した。比較基準は元284f開始の[full_ce9](../full_ce9/README.md)（weekly§93）。直前の元d431対照や新1aefからは継続していない。

実CPU51.926155245秒。教師tokenはBOOK2913→2724、SHOP3238→3013。未変更decoderのdecode・逆変換packet・意味・全更新・本人本文が一致。元/短縮の4教師は実CMEEでGENERATED、各保存後の別PID full outcome cold4/4一致。rawに結び付くreceiptだけが異なるため跨variantのfull outcome完全一致はfalseで、本文や意味の不一致ではない。[CPU照合要約](cpu_equivalence_summary.json)。実model0/CUDA未初期化。同API353成功はhash照合再利用、再実行ではない。

実9更新/112変更/別保存/112F32・3,833,856parameter no-grad reload/2自由生成を518.695366979秒、処理按分$0.040342973で終了。600秒/$0.047内、準備/CPU/回収/保持/保存/通信/税等は別。元helper全文assistant＋EOS CE、9順、LR5e-5、seed、fresh optimizer、生成上限は基準と同じ。

| 実生成 | 形式と受領 | 実CMEE | 本人向け本文 |
|---|---|---|---|
| BOOK | 2731token/126.017713273秒、EOS、全体JSON完結、named decode PASS、CANDIDATE_UNREVIEWED | REJECT/model_evidence_collection_invalid | 根拠3名が同じ時点句に重複。本文は追加/保持/更新の処理説明 |
| SHOP | 3584token/161.859242249秒、EOSなし、Observation途中でTOKEN_LIMIT | REJECT/semantic_receipt_not_validated | 引用の正しいsource/field一致0/14。Reception/update_noteは未到達 |

実意味/本文0/2、snapshot0、実modelのcold再読は対象なし。基準FullCE9の全体JSON完結2/2に対し今回1/2で、時間も短縮しない。実生成は短縮q/u名を一つも使わず、教師の無損失短縮を学習成功へ読み替えない。[全raw読解](reading_review.md)・[実採否](cmee_diagnosis.json)・[静的所見](static_raw_diagnosis.json)。静的欠陥を未到達の実検査理由として報告せず、raw補修・reader緩和は0。

新adapter 3a43df7fd09cbf61bb5e329467f82e393e0e6fd325d7b6a457308e41a20a0228は通常不採用。全原本16,641,896bytes/161payload+manifest/162member、SHA256 43b53b96cda2516c6fbedf7cd7c9ef73fdb655830a3e234b3d2d6b6870e66919。Pod外の全CRC/hash/size・CPU/source6/API・先行BOOK・112F32有限/初期-reload同名同形状を照合。[追加重みと全原本](https://chatgpt.com/library?file_id=libfile_8c15de9185888191a1356804725b85ba&account_id=personal) version0へ保全。元4B全重みを含む単独モデルではない。原d431/284fと旧全候補は保持する。

primary=BLOCKER_NARROWED、商品0/正式Product Read0/3/54.50％、candidate_ready=false/automatic_progression=false。次の一作業は、既存教師の原欄→引用→役割→附属更新→本人向け本文を小さい単位で教え、最後に元の全文packetへ戻す学習手順のCPU候補具体化。未準備・未実行で、追加GPU/同条件反復/別係数/上限延長/次run自動開始はしない。現在の2件には完成教師があり新観測会は現欠陥解消に不要。未知一般化・Piece/Analysisの教材残件は別。

GPU稼働保持、Stop/restart/delete/管理API0、SQL0、通常app/公開API/DTO/DB/RN/Render/Supabase/merge/deploy変更0。STRUCTURE_MAP_DELTA_NONE。実Codex Work/GPT-6、root単独writer/executor。read-only helperは正式Pro/Ultra/human受入れを代替しない。

| file | 責務 |
|---|---|
| compact_teacher.py | q/u参照だけの可逆短縮 |
| prepare_compact9.py | 派生2教師と実CMEE/別PID coldのCPU照合 |
| run_compact9.py | 同全文CE9学習・保存・no-grad再読込・生成2 |
| consume_named9.py | 無補修の実receiver/意味/本文/条件付きcold |
| launch_once.py | tracked source固定・一回lock・590秒parent timeout |
| export_compact9.py | CPUで追加重み/原本/APIを回収 |
| actual_cpu_check.json / prepared_plan.json / runtime_authorized_plan.json | 実CPUと準備/実行時条件 |
| run.json / training.jsonl / after_*.jsonl / cmee_diagnosis.json | 実学習・全raw・実採否 |
| cpu_equivalence_summary.json / static_raw_diagnosis.json / external_verification.json / cpu_external_verification.json | 教師同値、静的所見、Pod外照合 |
| result_summary.json / reading_review.md | 最終閉鎖状態・全件本文読解 |
