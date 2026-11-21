# Source identity guidance — 同重み非学習一回の結果

2026-10-30 JST。Mashが6b9b0d42の具体案へ「進めていいよ。」と承認した一回を、source2e3a607199b79d8cf0bde92bece8abf3a3630e99で実行した。

**結果：新2件ともS1でJSON未完結。意味・本人本文0/2、CMEE・保存再読未到達、旧9はNOT_RUN。不採用で閉鎖し、再実行していない。**

非学習1load/112F32有限metadata・全requires_grad=false、学習forward/optimizer/重み保存0、実2call。BOOK311token/EOS、SHOP427token/EOSだが、最外root閉じがないため両件拒否。source ID/欄名とalias/quote分離は実出力で揃ったが、引用10/14と教師17/18の差も残る。構文だけの残件とは扱わない。全rawと判断限界は`content_review.md`。

処理47.405705535秒、親外48.852184686秒、前回$0.28/h単価の処理按分$0.0036871104305。準備・回収・保持・保存・通信・税等別。30分/$0.14枠内。GPU A5000は終了後1MiB/0％で稼働保持。Stop/restart/delete/Runpod管理画面/API0。

## 実装・実行・回収の順序

1. 承認planだけを別execution_20261030へ固定しGitHub読み戻し。prepared runner/promptはCPU確認済みhash不変。
2. 同Jupyterへ直接接続し、fresh pack/run、exclusive lock、親1790秒TERM+kill10秒で一回起動。実S1 messagesはCPU候補とhash一致、前段空・教師注入0。
3. 両S1拒否で各題を停止。全5段/派生packet/新CMEE/saved/cold0、旧9への条件不成立。raw/型/採否/decoder/意味条件/cap修正0。
4. Pod上で207凍結fileと同9b保存重みの不変を再照合。元結果19payload＋archive_manifestの全20memberを一回回収し、CRC/全bytes/SHA・source/plan/実2raw/metadataをPod外で独立照合した。原ZIP70276bytes/SHA8c62c3535dcef7d685d38ee6f0220500592c797c158007ed967d6c46ed86cf42。全20memberをGitHubへ展開保存し、ZIPは回収用中間物として扱う。

## 全file地図

| path | 責務 |
|---|---|
| `run/run.json` | 実一回のsource/plan/counter/call/失敗/時間/費用/閉鎖statusの未修復原本 |
| `run/stage1_*.jsonl`と`*.messages.json`、`run/*_stages.json` | 全2raw/token/EOS/usage・実messages・実stage records。stages_completed=1はrecord数でvalid stage成功ではない |
| `run/loaded_tensors.json`、`run/extra_frozen.json` | 読込112F32有限metadataと207不変file。新weightは作らず、9bは別既存の完全stage5保存原本を保持 |
| `run/cmee/diagnosis.json` | 両S1拒否、新CMEE/saved/cold0、旧9未実行 |
| `runtime/plan.json`と実source2 | 今回承認時の不変plan、同CPU候補のprompt、有限非学習runner |
| `runtime/execute_once.lock/gpu_launch.json/gpu.log/gpu.exit/gpu_elapsed.json/post_identity.json` | exclusive一回/親期限/実log/exit1/親外時間/処理後不変・GPU保持 |
| `runtime/launch_command.sh/export_command.sh` | 実際にJupyterターミナルへ渡した起動・回収文の原文写し。archive外で別途保持 |
| `archive_manifest.json/recovery.json/verification.json` | 全20member/原19payload地図、Pod回収metadata、root独立照合 |
| `summary.json/content_review.md/README.md` | 採否閉鎖、全raw静的読解、今回全責務と限界 |

原重みは9b1901abdb3776b301c3e77b5787e4aa851f6a007ccac29764507de5f72f3818で不変。元4Bの全base重み入り単独モデルを今回保存したという意味ではない。既存教師/CPU/rawの不変hash照合と、新生成が成立しなかった結果を分ける。

## 終了と次の境界

`execution_20261030/plan.json`はclosure付き閉鎖、runtime内planは承認時の不変原本。proposal.jsonは承認前の履歴のまま。今回の一回を再利用しない。新生成・追加学習・次prompt探索・新GPU案・通常有効化へ自動進行しない。現2題の追加観測会は不要。

root華恋単一writer/executor/judge、補助read-only。実環境Codex Workで正式Pro/Ultra/humanを申告しない。STRUCTURE_MAP_DELTA_NONE：通常source/receiver/意味型/三core/API/DB/RN/Render/Supabase/依存/merge/deploy責務差分0。primary=BLOCKER_NARROWED（source/field混同の限定変化を実2件で確認したが構造未成立）、technical/product credit0、正式0/3・54.50％、candidate_ready=false、automatic_progression=false。
