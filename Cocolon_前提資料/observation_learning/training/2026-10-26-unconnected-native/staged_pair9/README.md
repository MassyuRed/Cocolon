# 二段階の短課題＋元全文：一回終了・新候補不採用

2026-10-28。source76d264dfde4a940cfc00518add649574da2f935d/API7b9ee073、weekly§96。最終状態は[result_summary.json](result_summary.json)、実runとplanは凍結原本。[全raw読解](reading_review.md)。原15教材を置換せず、BOOK/SHOPそれぞれから補助A（引用・意味・関係）と補助B（前段Aから全更新・本人向け本文）を別派生する。これはoffline学習の部分課題であり、新しいCMEE wire・採用対象・本番経路ではない。

原material全体・prior_adopted_interpretation・request_ref・semantic_profileを保持。補助課題だけsystem、出力format、課題別specを変更する。Bには正解Aを前段の意味として渡すが、正解Bのquestion/updates/proseは渡さない。元の問い・回答・知覚・否定・時点・native ID・関係方向・附属更新・本人向け本文と全bindを保持する。A+Bを再結合すると元教師の全bytesへ戻る。q/u名は元教師の記述名を使い、前回compact教師は使わない。

| 更新 | 教材 |
|---:|---|
| 1 | 既存CHAIR初回 |
| 2・3 | BOOK／SHOPの補助A |
| 4 | 既存CHAIR訂正 |
| 5・6 | BOOK／SHOPの補助B |
| 7 | 既存DAILY初回 |
| 8・9 | 元BOOK／SHOPの全文教師 |

全9更新/9forward、各new case3更新。原284f開始、元helper全文assistant＋EOS CE、LR5e-5、seed/fresh optimizer、112対象を保持する。原15教材・最終評価15件とその2件生成入力・API7b9・receiver/意味/本文条件は不変。補助4行を別追加した19行から上記9行を選ぶ。

4段階を両ケースで教える13forward案より形式・実行量を小さくする。長い全文へloss maskだけを変えず、学ぶtargetと系列全体を短くする。B入力は前段Aを添えるため元入力より長く、全入力が短いとは呼ばない。ただし最終全文の露出は各3回から1回に減り、Bは正しいAを条件に学ぶため、自由生成への転移・補助形式の混入は未確認。CPU再構成成功を4B品質成功へ換算しない。

CPUで原15行・最終eval不変、4補助系列の実token短縮、prompt maskと全target/EOS、再結合2件exact、元教師の実CMEE/本文/cold証拠のhash一致再利用を確認する。今回追加CMEE/冷再読を行ったとは数えない。実CPU確認後、同条件の一回を実行した。上限600秒/$0.047処理按分・生成2件各180秒/BOOK3712/SHOP3584、準備/CPU/回収/保持/保存/通信/税等別。再試行・追加生成・次run自動開始・reader緩和・SQL・本番・GPU lifecycle操作なし。

実CPU6.918286秒/model0、4補助系列5945/5814/6312/6250token（元7300/7777）、原15行/eval不変・2再結合exact。Bの入力だけは元より長い。9順の系列合計57730→51897、長二乗和398780542→319286549。同API353と元教師のCMEE/本文/cold2はhash照合再利用で今回新admission/cold0。実9更新/112変更/別保存/112F32 no-grad reload/元入力2自由生成は509.436694379秒/$0.039622854処理按分で終了。BOOK3322token/EOS/全体JSON、receiver CANDIDATE_UNREVIEWED→REJECT/model_evidence_collection_invalid。SHOP3584token/EOSなし、更新配列の途中でTOKEN_LIMIT→REJECT/semantic_receipt_not_validated。意味/本人本文0/2・snapshot0/cold対象なし。SHOP原欄一致は0/14→18/18へ改善するが、役割・関係の混同/旧意味再ADDが残り、prose未到達。BOOKの本文は一人称回答の再掲。新2dfd7dbdは通常不採用。新3a43等の不採用候補から開始せず、旧runの承認/残枠を再利用しない。追加観測会はこの2件の正解不足を埋める目的には不要。

実Codex Work/GPT-6、root単独writer/executor、read-only helperは正式Pro/Ultra/human受入れではない。商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false。STRUCTURE_MAP_DELTA_NONE（既存wire/API/CMEE責務不変）、全file地図にはこの実験source/原本だけを追加する。

| file | 責務 |
|---|---|
| prepare_staged_pair9.py | 原教材からの4補助導出・完全再結合・実CPUtoken/全labels照合 |
| run_staged_pair9.py | 固定9更新・保存・no-grad reload・元入力2生成 |
| consume_named9.py | 無補修の実CMEE受領・意味/本人本文・条件付きcold |
| launch_once.py | 確定source・一回lock・parent timeout |
| export_staged_pair9.py | CPUで重み/原本/APIを回収 |


全原本16,150,601bytes/152payload+manifest/153member、SHA256 25251908388caf414868f30867862c5288ff2c2606fdfbe0c2ee959f3c35b7bf。Pod外の全CRC/hash/size・CPU/source5/API・先行BOOK・112F32有限/同形状/9順を照合。[追加重み・全原本](https://chatgpt.com/library?file_id=libfile_cf473b4d4d708191821345dd2db43674&account_id=personal) version0へ保全。base4B全重みを含む単独モデルではない。

primary=BLOCKER_NARROWED。次候補は追加学習の前に、保存2dfdで今回固定済みの補助A/B4入力を非学習診断し、短課題自体の未習得と全文転移不足を切り分けること。入力/教師は保存済み、追加model callは未実行・自動開始しない。新観測会は現2件の正解不足を補う目的には不要。GPU保持、SQL/本番/公開API/DTO/DB/RN/Render/Supabase/merge/deploy/GPU lifecycle変更0。

| 記録file | 実責務 |
|---|---|
| auxiliary_train_messages.jsonl | 実際に使った補助4行。原15行は不変 |
| actual_cpu_check.json / projection_proof.json / cpu_external_verification.json | 実token/再構成/既存証拠再利用/Pod外照合 |
| prepared_plan.json / runtime_authorized_plan.json | CPU確認時と実行時の固定条件 |
| run.json / training.jsonl / after_*.jsonl / cmee_diagnosis.json | 実学習/全raw/未変更CMEE採否 |
| static_raw_diagnosis.json / external_verification.json | 静的所見と全原本/112F32照合 |
| result_summary.json / reading_review.md | 最終閉鎖・全件本文読解・次候補 |


## 2026-10-29 — 保存2dfdの補助4入力診断を準備

Mashの新しい続行指示と新Podを対象とし、weekly§96の既存次候補だけを実行単位にした。旧run/plan/lock/残予算を再利用しない。新Pod vgkm402msgroiu / short_gold_bonobo / NVIDIA RTX A5000 24564MiB、表示$0.28/h、torch2.8.0+cu128。Runpodは既存ログイン状態で開き、再ログイン操作0。Jupyter直接接続・nvidia-smiと空workspace/元baseなし/必要4依存なしを確認。保存archiveの全153member CRC、152payload hash/sizeと保存2dfdをPod外で照合した。

追加学習0、保存2dfdを非学習1読込、固定済みA-BOOK/B-BOOK/A-SHOP/B-SHOPの4call。A出力上限2816/B1024、context8192・greedy・各180秒/全処理600秒/$0.047、準備は別900秒。900+600秒のGPU表示単価按分は最大約$0.11667であり、保持/保存/回収/通信/税等を含む総請求上限ではない。Bはgold A条件付きFIT、部分投影なのでCMEE採用数には加算しない。raw/token IDs/EOS/時間/教師とのJSON差と全文読解で切り分ける。期限/OOM/非有限/identity不一致では停止、再試行/追加生成/学習/次run自動開始なし。現2件の完成教師はあり追加観測会不要。

新規sourceはrun_auxiliary_diagnostic.py（非学習4call）、setup_auxiliary_diagnostic.py（既存4依存と固定baseの新Pod復元）、prepared_auxiliary_diagnostic.json（無効の準備原本）、auxiliary_diagnostic_cpu_check.json（静的CPU実結果）、runtime_authorized_auxiliary_diagnostic.json（今回指示に限定した新実行条件）。固定helper3は元pathから同一bytesを利用。preparedの拒否確認・CPU静的13file照合・no training AST/import成功、実tokenizer/モデル診断は準備後に行う。実行担当はCodex Work/GPT-6 root一人、補助agentは正式Pro/Ultra/human受入れではない。通常app/reader/wire/API/DB/RN/Render/Supabase差分0、STRUCTURE_MAP_DELTA_NONE、旧意味/本文0/2・商品0・正式0/3・54.50％を保持。
