# 5区間一回実装・実行結果 — 不採用閉鎖

Mashがproposal249a9295の最大45分/$0.21 GPU処理按分案へ「進めていいよ。」と明示承認し、source fa2bdfa76c357e4931bca3bfa30510a5d7c993e4を固定。同Jupyter/RTX A5000でCPU先行後、一回のみ実行した。根拠入口は最新weekly§121、全体00、作業入口/Rule18/必須incident、設計01/02/01AとCMEE mapの既読導線。source差分では通常構造を変えない。

CPU31.464283688秒、model/forward0、19encoding、原2教師完全復元/派生来歴/既存CMEE-cold2/2、旧9保存raw比較9/9、8不正来歴拒否。実装版gold prompt+cap最大7286/8192（study7285とは1違う）。CPU教師はモデル成果に数えない。

GPU一回：19 complete-target CE更新、2load、保存/非学習reload、112F32/3,833,856parameter/全112tensor変更、実生成3。BOOK S1は640tokenでEOSなし、SHOP S1は498tokenでEOS、S2は1276tokenでEOSだがroot1≠期待3。全5段完成0、派生packet/実新CMEE/採用saved/cold0、新2意味・本人本文0/2、旧9NOT_RUN。不採用閉鎖・再試行なし。原raw全文と限界はcontent_review.md。正式0/3・54.50％、商品0据置。

処理453.667464138秒（約7分34秒）、既定$0.28/hによる按分$0.035285247211。外455.094564623秒はruntime/gpu_elapsed.jsonを正本とする。準備・回収・保持・storage/network/tax等は別。GPUは1MiB/0％で稼働保持、Stop/restart/delete0。

完全ZIP229member/228payload、31,667,246bytes、SHA256 4b40bcb4e8afd0e85b27e49e218f5350a2736aa151908efb4e0cc91d57942714。全CRC/bytes/SHA・19順序・全3raw/hash/token/同adapterと112F32をPod外rootが確認。補助も全228payload/19順序/3rawを独立確認。初期11446641と新9b1901abの重み本体を保持。歴史3adapterは既存完全保存を参照して重複収録せず、凍結digestは残す。Pod182file不変、Pod外は収録179fileのbytesを独立照合した。

[重み・完全実行原本](https://chatgpt.com/library?file_id=libfile_cc6b41f4f62c81919cbaec65e51ef379&account_id=personal)。新重みは不採用で次回初期へ自動採用しない。runtime/plan.jsonは実承認時の不変原本、親implementation planはclosure付き閉鎖状態とする。

| ファイル群 | 責務 |
| --- | --- |
| summary.json / content_review.md | 実数・0/2・失敗箇所・全raw読了・判断限界・不採用閉鎖 |
| run/run.json / training.jsonl | 19forward/update・2load・3call・時刻/費用・例外・凍結不変 |
| run/stage*.jsonl / *.messages.json / *_stages.json | 全未補修raw/tokenIDs/usage/実入力とSHOP実S1→S2連鎖 |
| run/cmee/diagnosis.json | 両題stage失敗、実新受口0、saved/coldなし |
| run/initial_loaded_tensors.json / reloaded_tensors.json / adapter/* | 112F32 load/reload表、configと完全ZIP内重みのidentity |
| runtime/consume_stage5.py / prepare_stage5.py / run_stage5_once.py / plan.json | 実行時source3・承認plan不変原本 |
| runtime/launch_once.py / gpu_launch.json / execute_once.lock / gpu.log / gpu.exit / gpu_elapsed.json / launcher.log | 単一起動、親2690TERM+kill10、exit1、原log/外時間 |
| runtime/cpu.log / cpu.exit / post_identity.json / export_result.py | CPU原log/exit0・182凍結検査/保持GPU・終了後回収source |
| cpu_verification.json | CPU19長さ/8拒否/2教師来歴cold/旧9保存raw比較の小結果。full summary/train19/encoding/saved/coldは完全ZIP |
| archive_manifest.json / verification.json / verify_recovery.py / preservation_receipt.json | 完全ZIP全member地図・独立回収/112F32検算・保存identity |
| file_manifest.json / proof.jpg | GitHub今回全path/bytes/SHA/ownerとJupyter完了画面 |

通常source/receiver/意味型/三core/API/DB/RN/Render/Supabase/依存/merge/deploy変更0。STRUCTURE_MAP_DELTA_NONE。root単一writer/executor/judge、補助read-only、Codex Workで正式Pro/Ultra/human検証ではない。追加観測会は現2題で不要。追加GPU/方式変更/再実行を自動開始しない。
