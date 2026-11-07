# syntax2b — CPU全通過、実2生成は両TOKEN_LIMITで不採用・閉鎖

2026-10-30 JST。status=CLOSED_NOT_ADOPTED_NO_RETRY。Mashの「『4B学習＋CMEE接続』を続けて。」を、直前に提示した92a83d97の追加token12個対応案・同費用上限への継続指示として実施した新しい一回。旧syntax2のCPU失敗は閉鎖したまま、修正していない。

Jupyterへ直接接続し、12個の非special追加tokenのbytesを既存ByteLevel逆変換から確定、実decoder/backendの単独と全256byte前後連結6144組を一致照合した。teacher全prefix、教師外型適合変異、Unicode/escape/EOS、既存raw先頭不正token、実LogitsProcessor、同metadataのCMEE正対照2と負対照2、速度条件が全通過。CPU内23.594040824秒、外側全体24.631754788秒、構築4.123060749秒。GPUを使ったモデル処理はこのCPU段階で0。

| 実GPU結果 | BOOK | SHOP |
|---|---:|---:|
| 生成token数／上限 | 3712/3712 | 3584/3584 |
| 生成秒 | 163.017517140 | 156.697405153 |
| EOS／完全root | false／false | false／false |
| mask累計秒 | 6.972995108 | 6.673568621 |
| 実receipt | TOKEN_LIMIT | TOKEN_LIMIT |
| 意味／本人本文 | 不採用／未成立 | 不採用／未成立 |
| 元receipt replay | 一致 | 一致 |
| 保存snapshot／cold対象 | 0／0 | 0／0 |

GPUは非学習1load・0更新・各1生成の2call。処理332.789460207秒、按分$0.025883624683、外側全体334.034123767秒で、最大600秒/$0.047内。CPU準備・親外CMEE1.687247491秒（保存された外側計測1.775813142秒）・回収・保持等は別。live単価再照会なし、履歴$0.28/hによる按分。timeout0、GPU/CMEE exit0。終了値0は生成処理が終わった意味で、品質合格ではない。

## 本文・構造の読了と判断

rootが両rawの全文を読んだ。形式制約の許す未完了prefixであって、全文JSON成功ではない。BOOKは10列のclaimを1件で閉じ（教師10件）、次のclaimをconflictsへ入れ、coreを@s0、questionを引用名listにして、relationsで同じ行を18回反復する。SHOPはclaim12件（教師11件）の後、任意JSONを許すconflicts内へ後段の関係・更新・文章を置き、同じ文章を41回反復する。SHOPのこの文章断片はprose欄の成立本人本文ではない。

型と列数だけでは、正しいfield配置・引用と意味の対応・更新・反復停止を回復できなかった。既存contractで任意JSONを許す欄へ入ること自体はmask違反ではない。正解件数や意味値をmaskへ強制して回避していない。実CMEEはfinish優先のTOKEN_LIMIT→REJECT/semantic_receipt_not_validatedで、上の静的所見を後段意味検査の実測拒否理由へ書き換えない。採用snapshot0なので、保存再読の成功は0件。再読対象0を成功へ数えない。

初期のclaim行の型を保つprefixは観測できたが、完成した候補の採用には届かず、今回方式は不採用。元の保存11446641・入力2本・旧frozenは不変、新重み0、旧9再生成0。旧9 FIT9/9は履歴。材料不足や4B能力限界を断定する根拠ではなく、現2題に追加観測会を依頼しない。同じprompt/cap/grammarの有料反復や別helperの追加へ自動で進めず、教示と実出力のfield・引用・意味・更新の対応へ戻る。新しいGPU案は今回作成しない。

## 全ファイルの責務

- [summary.json](summary.json)・[content_review.md](content_review.md)：一回の実績、閉鎖、全raw読了、実拒否と静的所見の区別。
- [run.json](run.json)・[before_FT-BOOK-AFTER-ANSWER.jsonl](before_FT-BOOK-AFTER-ANSWER.jsonl)・[before_FT-SHOP-AFTER-ANSWER.jsonl](before_FT-SHOP-AFTER-ANSWER.jsonl)：未修復raw、token IDs、finish、秒、mask実測、1load/2call/0更新の実記録。元runのRAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEWは改変せず、回収後の閉鎖はsummaryと上位plan2b.jsonが所有。
- [loaded_tensors.json](loaded_tensors.json)・[post_identity.json](post_identity.json)：load時112tensor metadataと、終了後の入力2/adapter3hash・GPU保持・新重み0。
- [cmee_diagnosis.json](cmee_diagnosis.json)：実receipt2、replay一致、意味/本文0/2、snapshot0。形成snapshot/coldファイルは存在しない。
- [cpu.json](cpu.json)・[cpu_elapsed.json](cpu_elapsed.json)・[cpu_launch.json](cpu_launch.json)・[cpu.log](cpu.log)・[cpu.exit](cpu.exit)：新sourceのCPU一回の全条件・内外時間・起動・原ログ。
- [runtime_cpu_plan.json](runtime_cpu_plan.json)・[runtime_authorized_plan.json](runtime_authorized_plan.json)：実行時の条件付きCPU planと、成功report hashを結んだGPU承認plan原本。
- [gpu_launch.json](gpu_launch.json)・[gpu_elapsed.json](gpu_elapsed.json)・[gpu.log](gpu.log)・[gpu.exit](gpu.exit)：GPU単一起動PID380706、590秒＋kill10秒上限、外側時間と原ログ。
- [cmee_execution.json](cmee_execution.json)・[cmee.log](cmee.log)・[cmee.exit](cmee.exit)：既存consumerのCPU一回、モデル/SQL追加0の起動・原ログ。
- [raw_reading.json](raw_reading.json)：未完了rawの完全memberだけを読んだ列・field・反復計数と、未完了prefix状態。補修/採用/新モデル処理0。
- [cpu_originals_manifest.json](cpu_originals_manifest.json)・[cpu_originals.zip](cpu_originals.zip)：9member/8payloadの完全CPU原本。source2本とCPU時planを含む。
- [archive_manifest.json](archive_manifest.json)・[originals.zip](originals.zip)：20member/19payload、57520bytes、SHA256 `189ef7485c92f83d974210b6b9742dad3e5025301ff26bea78c2b555386f2043` の全実行原本。ZIP内のJupyter途中checkpointは同一runの古い写しであり、最終状態や別runの根拠にしない。
- [verification.json](verification.json)・[proof.jpg](proof.jpg)：全CRC/member/bytes/SHA・source2本/plan/report・入力重み照合の範囲と、Jupyter実結果画面。
- [../syntax2b.py](../syntax2b.py)・[../run_syntax2b.py](../run_syntax2b.py)・[../plan2b.json](../plan2b.json)：今回source、未学習runner、一回閉鎖条件。CPU source=d87fd8ec、実GPU承認source=8842ef2b。旧syntax2/plan.jsonは不変。

CPU/GPU/CMEEは各一回、再download/再実行/追加生成0。GPUは稼働保持、管理console/API・Stop/restart/delete0。既存完全重みarchive libfile_9623b67a65588191926a1bb0a0ea5797を保持し、今回ZIPに重み本体は追加していない。

primary=BLOCKER_NARROWED、product_credit=0、正式0/3、54.50％、candidate_ready=false、automatic_progression=false。構文支援の限定CPU/実行事実を商品品質creditへ換算しない。root単一writer/executor/judge、補助read-only、実環境GPT-6 Codex Work、正式Pro/Ultra/human受入れ未実施。通常ModelCandidateSource/receiver/意味型/三core/API/DTO/DB/RN/Render/Supabase/新依存/merge/deployの構造差分0、STRUCTURE_MAP_DELTA_NONE。
