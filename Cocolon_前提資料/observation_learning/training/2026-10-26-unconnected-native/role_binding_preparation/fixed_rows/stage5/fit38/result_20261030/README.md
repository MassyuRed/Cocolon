# 同19行×2周の実CPU準備 — 2026-10-30 JST

**CPU準備合格、新しい有料実行は未承認。** source fbab342b9a902d1e412571a501aaf76d1d0be3e3をJupyterへpin取得し、proposal/source hashを照合してstdlib CPU一回を実行。実0.371018065023236秒・親0.46587808802723885秒・exit0。tokenizer/model/forward/学習/生成/新CMEE0、torch未import。

以前のprepared SHA84d2d641/train19 SHA57292ff2から、全19encoding/labels/教師/EOS/mask/counts/原evalを不変継承し、同interleaved順を2回、全ID各2回の38更新予定を確認。既存loss窓のshiftを19行すべてで静的確認。Jupyter実installed transformers5.19.0のmodel/loss source hashは旧回収版と同一、数値的full/tail・backward同値試験は行っていない。新prepared SHA60c17f3260cbe1c3a04cb2622d42eb03b68046b5f640dedf32d007d729f24548、proposal SHA51573dba7e31054f7b97258295293d120e34b7e57719284187b31b6fc61e4d4d。

b5e保存重みbytesと既存112有限F32の保存証拠を保持、266frozen不変。A5000 1MiB/0％で保持、model/consumer再実行0、承認JSON不在。b5eを初期値に実model loadしたことや、38更新/57forwardを行ったことを意味しない。

元ZIP198735bytes/15member（14payload＋manifest）、SHAf5dd08d65af99a24a437af3b77a315ec815fd725b2b799b378b585eb81df4c32。Jupyterから直接回収し、全CRC/bytes/SHA、実source、全encoded19/全messages/2周順をPod外照合、read-only補助の読取とも一致。全15原本memberと追加の実command3/verificationをGitHubへ展開保存する。

| file | 責務 |
|---|---|
| README.md | このCPU結果と全file地図 |
| archive_manifest.json | 元14payloadのbytes/SHA一覧 |
| verification.json | Pod外全15member・exact source/encoded19/train19/38順の照合 |
| cpu/prepared_cpu.json.gz | exact encoded19/labels/counts/eval・同19順×2・266frozenの実prepared |
| cpu/train19.jsonl | 元19messagesの原bytes。行の複製/教師変更なし、周回はorderで指定 |
| cpu/cpu_summary.json | 実時間・行順/窓19・source hash/266不変・0model counter |
| cpu/post_identity.json | b5e不変/266不変・GPU保持・新承認不在 |
| cpu/installed_loss_source.json | 実installed5.19.0のhash・対象forward/causal loss source・0model読取 |
| runtime/prepare_fit38.py | 実stdlib CPU準備source |
| runtime/run_fit38_once.py | 新exact承認がなければmodel loadを禁止する38更新/3NLL/実段階生成source |
| runtime/prompt_source_index.py | 不変の現builderとactual chain |
| runtime/launch_fit38_once.py | fresh/exclusive/direct timeout2690+kill10の一回source |
| runtime/export_fit38.py | 有料終了後の全原本/新重み回収source（今回は未実行） |
| runtime/proposal.json | 新未承認案の不変原本 |
| runtime/README.md | CPU準備前の説明写し。現入口と時点を区別 |
| runtime/execution.json, cpu.log | CPU一回のsource/親時間/exit0/log |
| runtime/loss_read_command.sh | 実installed sourceを標準libraryだけで読んだ実command原文 |
| runtime/cpu_launch_command.sh | 実CPU一回の取得/起動command原文 |
| runtime/cpu_export_command.sh | CPU全原本回収command原文 |

[次の具体案・全source責務](../README.md)。既存失敗rawを元教師へ付け直さない。NLLは教師条件の診断で、CMEE/本文/商品合否の代用にしない。前回の意味/本人本文0/2・旧9NOT_RUN・不採用閉鎖を保持。現2題に追加観測会不要、商品0・正式0/3・54.50％、candidate_ready/automatic_progression=false。通常source/受信/意味型/API/DB/RN/Render/Supabase/依存/merge/deploy責務差分0、STRUCTURE_MAP_DELTA_NONE。
