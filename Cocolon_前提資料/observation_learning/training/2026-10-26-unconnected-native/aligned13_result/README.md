# 現入力一致＋保存d431からの13更新 — 一回終了・新候補不採用

2026-10-28 JST。**RUN_CLOSED_REJECTED_CANDIDATE**。BOOK/SHOP回答後の意味採用・本文成立は **0/2**。初期d431は不変、新c7ba419cは保全したが通常採用しない。前回非学習probeの原本/不採用を維持し、各一回の承認枠を再利用しない。

## 実行と回収

固定Cocolon source `ba9d910f3292716cdb351da56ae81e1c510f24e7`、未変更API `64c6cb1a41620fd2d7690e0b6f1af30ae0e624a4`、準備/実行planは[aligned13_preparation](../aligned13_preparation/README.md)。現API64の入力へ揃え、保存d431を初期値に旧9各1回・BOOK/SHOP回答後各2回、計13更新。AdamW/LR1e-5・旧9元CE/対象2既存adaptive extra15/gamma2・教師意味/本文/EOS不変。optimizer/RNGの厳密な途中resumeではない。

Jupyterへ直接接続して既存outputと終了コード0/0を確認し、完了していた同じ一回を回収した。再起動・追加学習・追加生成・consumer再実行は行っていない。実行原本run.jsonのpending状態とAUTHORIZED_ONCE_BOUND planは凍結保持し、最終採否は本README/result_summary.jsonが所有する。現在のGitHub mainは8月版であり作業ownerではない。PR30の作業branchからfresh原本を取得した。

| 実項目 | 結果 |
|---|---|
| 学習 | 13/13更新、全112tensor変化 |
| 保存・非学習reload | 新c7ba419cを別保存、112F32再読込照合。学習loadとreloadの2load |
| 自由生成 | BOOK/SHOP回答後各1、計2。before新生成0 |
| 時間・処理按分 | 540.301151837秒（9分00秒）/$0.042023422921、$0.28/h、600秒/$0.047上限内 |
| 費用の区分 | 準備/CPU/回収/保持/保存/通信/税等は別、総請求額ではない |
| 元重み | d431a07ce227c05e81eca5afb9461d91cf8101d50af0d27ec1a81844ce8ac684、不変 |
| 新重み | c7ba419cbfb8c2b1c83b4b27fcc59ab539c1f635515159a6cde6dbf41e23be3b、通常不採用 |
| 未変更CMEE | CPU1.783156086秒、追加モデル/学習/SQL0、意味/本文0/2 |
| cold-file | 採用snapshot0、対象なし。成功件数へ換算しない |

## 採否と実本文の確認

| ケース | 生成/形式 | 実CMEE | 静的読解 |
|---|---|---|---|
| BOOK | 3712token打切り/EOSなし/JSON未完結 | TOKEN_LIMIT→REJECT/semantic_receipt_not_validated | 引用反復と参照ずれ、更新1/必要7、GAP未解消。receptionに説明は残るがupdate_noteは「未記載」のまま |
| SHOP | 2693token/EOS/strict JSON成立 | CANDIDATE_UNREVIEWED→UNSUPPORTED/model_evidence_out_of_scope | 引用位置は受領できても意味参照がずれ、更新1/必要8、GAP未解消。本人の知覚を事実化し反復/不自然な本文 |

[全raw/意味/本文読解](reading_review.md)。raw補修・reader緩和は0。前回と同じAPI64＋d431のprior_quote_probe2（0/2）がbefore比較で、更新義務指示probeとは混ぜない。入力一致と継続初期値の変更を同時に含むため単独因果は未確定。今回も0/2で、現在のquote入力へ学習を揃えることだけでは解消しなかった。

## 原本と追加重みの保全

[runtime_originals.zip](runtime_originals.zip) に実run/112loadとreload/13log/2raw/CMEE/実行source・plan・入力・CPU・履歴/起動logとexit/初期hash/外部重み参照の34payload＋manifest（35member）を無補修保持。116,134bytes、SHA256 `3159c5d2839bd37cdecdc65da74fc69e66329b219612680de11e99f4c418c04d`。展開した関連実原本も本directoryに保存。archive内pathを正本とし、履歴CPUと最終CPUを混同しない。

追加重み込み一式は14,312,508bytes/35member、SHA256 `9f293788ab885e081ae39a14e23179700924a0d0b09eff4e995d8fd95975aee3`。
保全先：`libfile_398ae281441c81918138d6bf43d3ae36` / `cocolon_aligned13_weights_and_runtime_originals_20261028.zip` version0。
Pod外で両ZIPのCRC/全member bytes・SHA256と112F32有限性を確認した。[外部照合](external_verification.json)。元base全重みは同梱しないため単独モデルではない。固定base revision `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a` とconfig/tokenizer/chat templateを併用する。

## 終了境界と次の一手

同じ13更新/上限延長だけの有料反復は行わない。長いpacketの引用・意味・更新対応を自由生成で再現できない原因から学習方法/出力分担を見直す。短い参照形式へ変更する場合は別contract差分を具体化する。今回の基本不具合に新観測会は不要。

既知回答後2件だけの評価で、旧9への学習投入は旧9自由生成回帰の成功ではない。新初回4件/全15新評価/実初回からの動的一往復/未知一般化/実service・SQL/本人端末/Piece・Analysisは未確認。商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false。GPU保持/Stop・restart・delete・管理API0、通常API/DTO/DB/RN/Render/Supabase/merge/deploy変更0。STRUCTURE_MAP_DELTA_NONE（新型・責務・wire・採用条件の変更なし）。

rootはJupyter読取/回収/照合/最終判断/反映を担い、別文脈agentはread-only原本比較。正式な別Pro/Ultra・人手商品受入れではない。全機能00・観測入口・学習owner・01A地図・weekly§85を同期する。
