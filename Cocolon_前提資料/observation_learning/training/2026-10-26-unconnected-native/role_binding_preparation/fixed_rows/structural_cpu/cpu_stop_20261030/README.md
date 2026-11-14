# 構文制約方式の承認済み一回 — CPU停止・GPU未実行

2026-10-30 JST。status=CLOSED_CPU_FAILED_GPU_NOT_STARTED_NO_RETRY。

Mashの「進めていいよ。」に基づき、d3ece5f2のsyntax2_proposal.mdのCPU実装・検証を一回実施した。実行sourceはe22f1101c730465f2362f734fe8cdfcc38f7f9f8。Jupyterへ直接接続し、source2本とplanのSHAを確認して配置した。CPUはexit1。TokenMask構築時に、BPE本体のvocab外かつ非specialの追加token12個に対するbyte対応が未実装だったため、non_model_added_token_requires_explicit_byte_proofで停止した。華恋の実装不足であり、材料不足・4Bの能力限界・意味生成失敗の実測ではない。

| 段階 | 今回の事実 |
|---|---|
| CPU実行 | 一回、exit1、再実行0 |
| 停止箇所 | syntax2.py:208、TokenMask構築中 |
| 実tokenizer | ByteLevel/BPE、len248077、EOS248046、added_tokens33 |
| 未対応の非special追加token | ID248058〜248069、12個 |
| 全教師prefix・raw最初不正token・教師外変異・Unicode/EOS | NOT_REACHED |
| installed LogitsProcessor接続・CMEE正負対照・速度条件 | NOT_REACHED |
| CPU構築60秒/全CPU300秒/平均mask換算20秒の合格 | 未確認。失敗時の全CPU経過秒は保存されていない |
| model load/forward/追加学習/生成/CMEE | 全て0 |
| raw/receipt/成立snapshot/cold再読 | 今回は未生成・未実行。新しい0/2として数えない |
| 保存済み11446641・入力 | 回収metadataの全3adapter hashと入力2hashを承認plan/GitHub原本へ一致照合 |
| GPU | A5000 24564MiB、使用1MiB/0％を実確認、稼働保持 |
| retry/次run/管理console・API/Stop/restart/delete | 全て0 |

追加tokenは `<tool_call>`、`</tool_call>`、`<|fim_prefix|>`、`<|fim_middle|>`、`<|fim_suffix|>`、`<|fim_pad|>`、`<|repo_name|>`、`<|file_sep|>`、`<tool_response>`、`</tool_response>`、`<think>`、`</think>`。12個ともspecial/normalized/lstrip/rstrip/single_word=false。special扱いで消したり、置換文字からbyteを推測して通してはいない。

事前のローカル補助検査ではparserのliteral内空白と試験のformat判定を修正し、元教師のbyte prefix・仮vocabのmask/状態一致を確認した。それらを実tokenizerのCPU合格へ代用しない。実装e22の失敗を保存したまま閉じ、修正・再CPU・GPUは行っていない。事前のtokenizer metadata読取0.882143秒と前回保存raw比較0.011652405秒は、この失敗したCPU一式の時間ではない。

## 全ファイルの責務

- [failure.json](failure.json)：停止metadata、実環境、12token、入力/重み/source hash、副作用0、GPU保持。
- [cpu.log](cpu.log)・[cpu.exit](cpu.exit)：未修復tracebackと終了値1。
- [runtime_plan.json](runtime_plan.json)：実行時の条件付き承認plan原本。cpu_report_sha256=nullのまま。現在の閉鎖は上位plan.jsonが所有。
- [archive_manifest.json](archive_manifest.json)：Jupyter ZIP内6payloadの全path/bytes/SHA。
- [originals.zip](originals.zip)：7member/6payload、15818bytes、SHA256 `5505d0749f18c5d01613c6077d5a66e463e378c95f263cf46cdf0e94bbb74c63`。source2本・runtime plan・log・exit・failure・manifestの完全原本。
- [verification.json](verification.json)：全CRC/member/bytes/SHA、source2本と原入力2本、adapter metadata/承認planの照合範囲。
- [proof.jpg](proof.jpg)：Jupyter画面の停止結果・モデル0・不変hash・GPU保持・ZIP identity。
- [../syntax2.py](../syntax2.py)：今回失敗したbyte grammar/token mask/CPU試験source。修正せず保存。
- [../run_syntax2.py](../run_syntax2.py)：今回未実行の非学習runner。CPU成功reportなしでは進めない。

CPU上限には外側timeout290秒＋kill10秒を設定したが、時間上限内合格は未成立。GPU処理按分0、準備・回収・保持等は別。既存GPU最後の§111の意味/本人本文0/2と旧9の履歴FIT9/9は不変、新重み0。既存完全重みarchiveのidentityは引き続きlibfile_9623b67a65588191926a1bb0a0ea5797で、今回のZIPに重みは含めない。

primary=BLOCKER_NARROWED。TECHNICAL_CREDIT=0、PRODUCT_CREDIT=0、正式0/3、54.50％、candidate_ready=false、automatic_progression=false。root単一writer/executor/judge、補助read-only、実環境GPT-6 Codex Work。正式Pro/Ultra/human受入れは称さない。通常ModelCandidateSource/receiver/意味型/三core/API/DTO/DB/RN/Render/Supabase/依存/merge/deployの変更0、STRUCTURE_MAP_DELTA_NONE。

次の一案は[追加tokenのbyte対応だけを補う新しい一回](../added_tokens_proposal.md)。未承認・未実装・未実行。今回の一回はCPU不成立時終了という承認条件に従い閉鎖する。
