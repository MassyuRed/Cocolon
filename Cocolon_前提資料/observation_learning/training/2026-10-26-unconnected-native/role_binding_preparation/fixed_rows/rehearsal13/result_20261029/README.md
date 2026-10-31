# 承認済み13更新→保存・再読込→11件確認 — 完了・新候補不採用

Mashが[4b3cdc8cの具体案](https://github.com/MassyuRed/Cocolon/blob/4b3cdc8cd096ae7c13e3c28401d49c1e6ee580af/Cocolon_前提資料/observation_learning/training/2026-10-26-unconnected-native/role_binding_preparation/fixed_rows/rehearsal13/README.md)へ「進めていいよ」と明示承認した一回を、同PodのJupyter端末へ直接接続して実行した。最大45分・処理按分$0.21、準備・回収・保持等別の条件は変更していない。**13更新・別保存・非学習再読込・11生成を完走したが、新2件は意味/本人本文0/2のため、新adapter 11446641は不採用として閉鎖する。** 原runのstatusは実行当時の原本として保ち、閉鎖の正本は[summary.json](summary.json)と現在の[plan](../plan.json)である。

| 対象 | 実生成 | 実receipt・意味/本人本文 |
|---|---|---|
| BOOK | 2371token、EOS到達、102.351695秒 | INVALID_FORMAT → REJECT / semantic_receipt_not_validated、0/1 |
| SHOP | 3584token cap、EOSなし、154.835751秒 | TOKEN_LIMIT → 同REJECT、0/1 |
| 凍結旧9 | 全9 EOS、意味/本文9/9 | 元の成功7をID別に全維持。椅子02/03訂正も今回成立 |
| 再現・保存再読 | 全11 receipt replay一致、成立9すべて別process cold全outcome一致 | 新2は採用snapshotがないためcold対象0 |

処理1144.037065561秒（19分4.04秒）、前回同Pod表示$0.28/hによる按分$0.08898066065474801。2700秒/$0.21以内、各生成180秒以内、timeout/retry0、GPU/CMEE/準備のexitは全0。live単価再照会なし。**親process外CMEE CPU90.540611897秒、準備CPU29.907477136秒、回収・保持・保存・通信・税等は別**で、上記を全請求額とはしない。peak allocated17568557056 / reserved24465375232bytes。GPUは保持し、Stop/restart/delete/管理API操作0。

## 承認と実行source

提案4b3cdc8cから、承認status/approvalだけを385114bde2ea0d8904d6a73f9c80bb5af56a654cで更新した。その1file差分・親・全文を確認し、runner/CPU/176frozen/依存/元f493を照合して排他起動した。起動PID210857、launch Unix1793263849.2515597。初期checkpointのPID227145というrootの転記誤りは、実gpu_launch.jsonに合わせて52466cabで訂正し、履歴も保持した。GPU起動は一回のみ。

承認済みplanは[runtime_authorized_plan.json](runtime_authorized_plan.json)、実sourceは[runtime_run_rehearsal13.py](runtime_run_rehearsal13.py)。runner SHA256 `11ade2f87c044c108c3a6d03c6d24e39fc5f9b4ce734ded1b9b24deb273c54e1`、実plan SHA256 `b5a4d05f65a5116d7fd2c33fa42e55ff87fc0a6b194692e3e2af9a3f724bf108`。API受領実装はc920f81a、後続fixture同期7acff074と区別する。Qwen/Qwen3.5-4B revision851bf6e、初期f4932d3a、112F32 trainable、全assistant＋EOS CE/LR5e-5/decay0/clip1/seed20261024、教師・入力・通常receiver不変。13順序と有限loss/gradientは[training.jsonl](training.jsonl)へ固定した。

## 内容の読み取りと限界

root華恋が全11rawと成立9件の観測文・受け止め文・更新注記、問いを全文読了した。補助は原文と分類を独立で読取確認しただけで、モデル・consumer・tests実行、編集、書込は行っていない。[content_review.md](content_review.md)に実分類と静的所見を分けた。

BOOKはEOSへ到達したが、固定列とnamed objectを混在させ、alias宣言・claim・更新・bindが壊れている。SHOPも同混在に加え、観測文の反復で打切りとなった。両件とも実際はreceipt段階の拒否であり、後段の意味検査を通したり修復して採用したりしていない。raw中の本人本文に似た文章をCMEE成立本文に数えない。

旧9は全成立した。椅子02/03訂正は共同修理・喜びの理由の改訂・gap失効の3更新を保持し、旧「全部一人で」を本文へ戻していない。ただし椅子3組は同じ文章のID束縛違いで、全9とも今回学習に含めたFITである。9件を独立した未知事例の一般化や新しい実service一往復と呼ばない。旧教師の「私もうれしい」等もそのまま再現しており、商品品質の改善creditにはしない。

今回示せたのは、固定された旧9への適合・旧成功の維持まで。新全文2件の自律的な形式生成・意味/本人本文成立は未達で、配分だけが原因、4Bの能力限界、教材不足のいずれも断定しない。**追加GPU・更新数調整・同じ形式の反復を自動開始しない。** 次は新2の表現学習が崩れる箇所と教示方法をCPUで検討する段階で、具体的な別方式・次の有料runは未固定・未実行。既存2教師はCMEEで成立しているため、現2題について追加観測会は今は不要。

## 重み・原本の保全

[完全な重み・原本アーカイブ](https://chatgpt.com/library?file_id=libfile_9623b67a65588191926a1bb0a0ea5797&account_id=personal)は60053438bytes、247payload＋manifest＝248member、SHA256 `71741059ee92e627ea4183186b554d04ffc245ae857c6fd1bf1654217b6498d9`。全CRC・member集合・bytes・SHA・176frozen・sourceをPod外で照合し、保管成功を[preservation_receipt.json](preservation_receipt.json)へ記録した。Download APIは失敗を返したが実fileは到着しており、再download0で全hashを照合した。

初期f493と新11446641は112F32/3833856parameter、全有限、全112tensorが変化。initial/reloaded表の全name/shape/dtype/normを実safetensorsと照合した。新重みのfull SHA256は`114466411f36f0eef7a2dceaec7f5190544ac8545eb6b2f6a3d0446b70f90b66`。原directoryに残っていた11272192bytesの保存一時fileも削除せず原本ZIPへ保全し、最終fileのprefixと完全一致する不完全部分コピーであることを区別した。reloadに使ったのは完全15351792bytesの最終fileである。base重みとoptimizer/RNG状態は含まず、同じ途中状態の厳密再開可能とはしない。

[verify_recovered.py](verify_recovered.py)はモデル処理0で実原本を照合するsource、[external_verification.json](external_verification.json)はその成功結果。最初の補助照合はplanのfield名の参照を訂正して再実行しただけで、GPU/CMEEは再実行していない。最初のarchive SHA転記も読取照合時に訂正しており、再回収・原本変更はない。

## このdirectoryの全ファイル地図

[file_manifest.json](file_manifest.json)が各fileの正確なpath/bytes/SHAを列挙する。manifest自身のhashはGit blobと公開後のread-backで照合する。下表は責務の索引である。

| file / family | 責務 |
|---|---|
| README.md / summary.json / content_review.md | 閉鎖判断・費用境界・rootの読了所見 |
| launch_checkpoint.json / gpu_launch.json / launch_command.txt / execute_once.lock | 起動承認・排他・実PID。checkpointは転記訂正履歴あり |
| runtime_authorized_plan.json / runtime_run_rehearsal13.py | 実行時の承認済みplan/source。現在のclosed planとは区別 |
| run.json / training.jsonl | 原status・13更新・2load・11call・新adapter identity・費用の実測 |
| after_*.jsonl（11） | 未修復raw全文、token IDs/finish/base/adapter/usage |
| initial_loaded_tensors.json / reloaded_tensors.json | 全112tensorの読込・非学習再読込表 |
| adapter_config.json / adapter_README.md | 新adapter設定とPEFT保存metadata。重み本体は完全ZIP |
| cmee_originals.zip / cmee_originals_manifest.json | 元diagnosis＋成立9saved/9coldの全19fileをbyte完全保持、全CRC/SHA照合済み |
| cmee_summary.json | 11分類・9本人本文・全replay/coldの閲覧用索引。完全reportはZIP |
| rehearsal13-gpu.log/exit / rehearsal13-cmee.log/exit | GPUと親外CMEEの元ログ・exit |
| export_rehearsal13.py / archive_manifest.json | Jupyter側export sourceと248member元目録 |
| verify_recovered.py / external_verification.json / preservation_receipt.json | Pod外全原本照合・112F32検査・保管receipt |
| file_manifest.json | 上記全ファイルの完全目録。重み非公開 |

通常ModelCandidateSource・native意味型・三core/公開API/DTO/DB/RN/Render/Supabase・merge/deploy・依存の変更0。`STRUCTURE_MAP_DELTA_NONE`。商品credit0、正式受入れ0/3、管理54.50％、candidate_ready=false、automatic_progression=false。実環境はGPT-6 Codex Workで、正式Pro/Ultra/human受入れを称さない。
