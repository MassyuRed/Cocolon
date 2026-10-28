# 二段階の短課題＋元全文：9更新候補

2026-10-28。current head3336e309/weekly§95の次作業。原15教材を置換せず、BOOK/SHOPそれぞれから補助A（引用・意味・関係）と補助B（前段Aから全更新・本人向け本文）を別派生する。これはoffline学習の部分課題であり、新しいCMEE wire・採用対象・本番経路ではない。

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

CPUで原15行・最終eval不変、4補助系列の実token短縮、prompt maskと全target/EOS、再結合2件exact、元教師の実CMEE/本文/cold証拠のhash一致再利用を確認する。今回追加CMEE/冷再読を行ったとは数えない。GPUはCPU確認後に一回の実行可否を判断する。上限600秒/$0.047処理按分・生成2件各180秒/BOOK3712/SHOP3584、準備/CPU/回収/保持/保存/通信/税等別。再試行・追加生成・次run自動開始・reader緩和・SQL・本番・GPU lifecycle操作なし。

現時点はCPU実行前。source/CPU/実run/採否/保全の事実は確定後に置換更新する。新3a43等の不採用候補から開始せず、旧runの承認/残枠を再利用しない。追加観測会はこの2件の正解不足を埋める目的には不要。

実Codex Work/GPT-6、root単独writer/executor、read-only helperは正式Pro/Ultra/human受入れではない。商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false。STRUCTURE_MAP_DELTA_NONE（既存wire/API/CMEE責務不変）、全file地図にはこの実験source/原本だけを追加する。

| file | 責務 |
|---|---|
| prepare_staged_pair9.py | 原教材からの4補助導出・完全再結合・実CPUtoken/全labels照合 |
| run_staged_pair9.py | 固定9更新・保存・no-grad reload・元入力2生成 |
| consume_named9.py | 無補修の実CMEE受領・意味/本人本文・条件付きcold |
| launch_once.py | 確定source・一回lock・parent timeout |
| export_staged_pair9.py | CPUで重み/原本/APIを回収 |
