# 現行入力19更新案の実CPU原本 — 2026-10-30 JST

実source commit：f0ec04e22df16e348f8da6621289c71b201d627e。GPU案は未承認のまま。

Jupyter直接CPU一回、6.149962861905806秒、親6.956690767081454秒、exit0。全10入力で実19更新時と指示が異なり、教師target/EOS/mask不変、旧9の行/token列不変を確認。現在builderとの全10一致と直前実S1一致、全2原教師13path lossless再結合、112有限F32、215frozen不変。最大prompt+cap7117、最大学習長6898/8192。新model load/forward/学習/生成/CMEE0。GPUは1MiB/0％で保持、重み9b不変。rootとread-only補助が原本を照合し不一致なし。補助の再tokenize/model/test実行は0。

| file | 責務 |
|---|---|
| cpu/cpu_summary.json | 実時間・全19 token数・旧10/現10のprompt hash・全教師/EOS同一・旧9不変とCPU0 counter |
| cpu/train19.jsonl | 次の提案実行に使う現在10区間＋不変旧9の全19 messages。未学習 |
| cpu/prepared_cpu.json.gz | encoded19、完全labels、凍結215file、固定更新順、原eval11とCPU teacher chainを持つ実prepared原本 |
| cpu/post_identity.json | 初期重み9bと215file不変・GPU保持・承認ファイル不在 |
| runtime/prepare_aligned19.py, run_aligned19_once.py, prompt_source_index.py | 実Jupyterへpin取得した3source。不変原本として保持 |
| runtime/proposal.json, README.md | CPU準備時の未承認案の不変写し。現入口READMEの後続説明と区別 |
| runtime/execution.json, cpu.log | CPU一回のsource commit・親時間・exit0・実log |
| archive_manifest.json | 元ZIP11payloadのbytes/SHA一覧 |
| verification.json | Pod外の全12member CRC/bytes/SHA、実source/encoded/train19の照合 |

元ZIP190335bytes/12member、SHA34d1e31b7222f360a1d33dbddbf2c92b0d92adaa3bebf74af2a353d7a6af6d99。全12memberを展開保存し、binary gzipも原bytesで保持。起動wrapperと回収wrapperに各一回の引用ミスがあり、各body実行前のPython構文解析で停止。修正後のCPU開始一回、モデル再試行0。

[現在の提案・全file地図](../README.md)へ戻る。失敗済み同重みrunの0/2/旧9NOT_RUNと閉鎖承認を保持。ここに新しいモデル自由生成やCMEE証拠はない。現在入力差は原因候補で、19更新の十分性/成功は未確認。現2題の追加観測会不要。商品0・正式0/3・54.50％・candidate_ready=false・automatic_progression=false。
