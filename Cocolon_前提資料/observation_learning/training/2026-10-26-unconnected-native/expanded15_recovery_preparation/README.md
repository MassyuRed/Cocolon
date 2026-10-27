# 保存済みexpanded30重みの評価再開 — 追加学習0

状態：**実CPU確認済み／Mashが2026-10-27（JST）に本具体案d026の新GPU一回を明示承認、起動前**。元expanded30は30更新/保存後に停止した原本として閉鎖し、旧承認・残時間・outputを再利用しません。

## 今回の一回承認

Mashがcommit d02655837be135f02022e16346fc95488de52bd4の「追加学習0→保存済み重みの非学習再読込→15件確認、最大45分・処理按分$0.21（準備・回収・保持等別）」へ「進めていいよ。」と明示承認。planはstatus/gpu_run_authorized/approval_basisの3fieldだけ変更し、承認反映commitを読戻して--source-commitへ束縛します。旧30更新の承認は再使用しません。

## 必要性と最小範囲

[元の一回](../expanded30_result/README.md)は30更新とweights109c保存まで完了しましたが、PEFTの56名→28suffix短縮をraw集合の検査で拒否し、実非学習reloadと15生成は未実施です。目的は既存の保存重みをそのまま非学習で読み、元の同15件を無補修CMEEへ渡して品質を確認することです。追加更新は0です。これを行わない場合、保存109cの品質・CMEE採用・本文は未測定のままです。

| 項目 | 新しい一回の固定範囲 |
|---|---|
| source | 元training bd5d169ad457fc440bf01d1876cb40d697ce6847とrun/training/runner/plan4hashを束縛。元30順序と保存3hashを開始/終了に照合 |
| 保存重み | 109c3dda16b19d2f110d6f8e2ded07f47e981b9690970ca95b9046780bffb85a。原config/weight bytesを変更しない |
| 実行 | **追加更新0・before0 → 保存adapterの非学習reload → 同15件を各一回生成** |
| 時間・費用 | 読込/生成で最大2700秒・各180秒・最大15call、$0.28/h×45分＝**$0.21処理按分**。準備/CPU/回収/保持/保存/通信/税等別 |
| 環境 | 同Pod bkj4qvnhwtdqc2/A5000、root華恋のみ、Jupyter直接。新Pod・GPU管理操作0 |
| 固定モデル | Qwen/Qwen3.5-4B@851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a、BF16 base・56module/112F32・依存pin維持 |
| 評価 | 元15system/user/eval/凍結教師prior、context8192・旧9 cap2560/新6 cap3712。空assistantから全packet一回、gold prefix/教師置換/JSON修復/reader緩和0 |
| CMEE | 全rawを固定API6b043880へ無補修、採用snapshotだけ別process cold-file、全本文/全更新を読解、原本/重みを回収 |
| 比較 | 保存済み初期1d（意味11/本文9）、continuation dd（11/9）、ordered483d（3/3）の同15raw。新baseline生成0 |
| 停止 | OOM/期限/非有限/identity/例外で停止。自動retry・欠測再生成・自動縮小・別Pod移行・30更新再実行なし |

旧runの残枠を新しい許可へ換算しません。OS強制停止や全15完走を保証しません。既知FIT/凍結priorであり、動的thread・実service/SQL/Auth/RN/本人端末・未知一般化・商品受入れはこの一回に含みません。

## 修正内容

旧runner/保存物を上書きせず、別runnerで設定検査用copyだけを正規化します。元の56完全名か今回観測した厳密28suffixだけを扱い、**固定config/同じQwenクラスのmeta構造**へ解決した集合が厳密56と一致することを要求します。全112key/shape/F32有限/parameter数/保存hash・非学習のno-gradと、実読込後のstate完全一致は維持します。

checkpoint indexには実モデルに未使用のmtp.layers.0のq/k/v/oも含まれます。最初のCPU案はindex全名で60件に一致し安全停止したため、実クラスをaccelerate.init_empty_weights(include_buffers=True)内で構築した**全parameter/bufferがmetaである構造だけ**へ戻しました。実base重みは読み込まず、実forwardも行いません。実構造763module名/528weight module、56対象のshapeを既存固定定義へ照合します。header自体はexpanded30準備で確認済みです。MTPを推測で削除した汎用scannerやreader例外ではありません。

新run.jsonのoptimizer_steps_completedは0、training_origin_updates=30と元run/log/source hashを別fieldで保持します。consumerはこの分離を検査してから従来の採否/cold処理へ進みます。旧STOPを成功へ書き換えません。新runner/plan/consumer・旧helper/source/API6・元4payload・保存adapterを開始前/終了時に照合し、コピー先4payload/consumer/adapterも終了時に照合します。

## Jupyter実CPU結果

[actual_cpu_check.json](actual_cpu_check.json)：**6.428338743979111秒**。CUDA_VISIBLE_DEVICES=''・offline、実4B重み読込/forward/更新/生成0、CUDA未初期化です。

- 元112F32/全shape/有限/3,833,856parameter、保存3hash、元30logと原sourceを照合。元guardの同エラーも再現。
- 実meta構造で28suffix→厳密56。小CPUモデルへ実PEFTで56対象を注入し28suffixへ短縮、保存→非学習reloadで112tensor全値一致・対象56一致・全parameter no-gradを確認。小モデルの確認を実4B reload成功へ換算しません。
- 対象k欠落・過度なup_proj短縮・他層追加・rank/α変更の5例を拒否。
- 実tokenizer15・凍結入力/prior15一致、pending executeが新GPU output作成前に拒否されることを確認。
- 最初のCPU停止source/log/planはhistorical_cpu_attempt1へ保持。修正後と混ぜて初回成功と報告しません。
- **model_reload_4b_tested=false**。保存109cの意味/本文品質、15生成、CMEE採用は未測定のままです。

## 実ファイルと開始前境界

| file | 責任 |
|---|---|
| run_expanded15_recovery.py | 元STOP/30logと109cの束縛、metaでのtarget範囲照合、非学習reload/after15だけ |
| gpu15_recovery.plan.json | optimizer_steps=0、固定元4hash/保存3hash・予算、pending/authorized3field |
| consume_expanded15_recovery.py | 元30更新と新0更新評価を分離確認、無補修CMEE/別process cold-file |
| verify_recovery_cpu.py / actual_cpu_check.json | pending専用CPU回帰・meta構造・小PEFT保存reload・実入力、実4B0 |

pack=/workspace/cocolon_native15_expanded15_recovery_pack_20261027。新output=/workspace/cocolon_native15_expanded15_recovery_run_20261027は不存在。旧outputは閉鎖したまま固定hashで読むだけです。

CPU archive **35,596bytes/SHA256 7a87f2b471cf9d0e84d0a17a99dcf0f8e34190e51e287ae231f9a9ca29b6a2c6**、全16payload＋manifest/17memberをPod外照合。元保存重み/原本と合わせた[全55payloadの保全version0](https://chatgpt.com/library?file_id=libfile_d93ea0ff6e7c819185b62a0e25725850&account_id=personal)にも含めました。base全重み/optimizer/RNG非同梱です。

新有料一回の承認後にだけ、planのstatus/gpu_run_authorized/approval_basis3fieldを変更し、GitHubへ反映・読戻した新commitへ起動を束縛します。今回のCPU準備はRule18§11.3の既存範囲内、新GPUは旧一回と別の判断です。root単一writer/実行owner、補助read-onlyを正式Pro/Ultra/human受入れへ換算しません。環境は確認できるCodex Work/GPT-6系として記録します。

既存教材で評価可能なので、新観測会は今は不要です。製品責務/意味型/wire/CMEE reader/API/DTO/DB/RN/Render/Supabase/本人DB/通常有効化/価格/依存/モデル選定/merge/deploy変更0。STRUCTURE_MAP_DELTA_NONE、限定TECHNICAL_CREDIT、**商品0/正式0/3/54.50％/candidate_ready=false/automatic_progression=false**。GPUは指示まで稼働保持しStop/restart/deleteを行いません。
