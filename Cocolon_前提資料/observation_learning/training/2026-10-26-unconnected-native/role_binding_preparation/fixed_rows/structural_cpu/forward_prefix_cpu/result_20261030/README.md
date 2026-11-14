# SHOP同一prefixのcache有無比較 — 一回完了

2026-10-30。Mashの直後の「「4B学習＋CMEE接続」を続けて。」を、f5120ba0の一題・最大180秒/$0.014按分案への承認としてa79f2525149cf12ea25fc05241da7e2eb19c269fへ記録し、同Jupyterで一回実行しました。**exit0、34.980309516秒、処理按分$0.002720690740。追加学習・自由生成・新CMEE0。** 準備・回収・保持・保存・通信・税等は別で、総支払額ではありません。

## 結果と判断

| SHOPの保存raw prefix（0始まり） | cached / uncachedの最上位token | 観測token順位 | 1位と2位の差 cached / uncached | 全logit最大差 |
|---|---|---|---|---|
| 292：最初の教師との差 | 両6333 `_no` | 両1位 | 6.375 / 6.25 | 0.359375 |
| 473：最初の型・列違反の直前 | 両15050 `[[` | 両1位 | 0.875 / 1.125 | 0.875 |

同一全入力4739/4920tokenを比較。292の命名差自体を意味誤りとは数えません。292の教師30812 `_extra` は2位/3位、logitは両17.125でした。cachedの2位/3位には同値tieがあります。473ではq行がstringを要求する位置で、両経路とも不適合な `[[` が最上位です。**この保存prefixでcacheを切れば型違反選択が消えるという説明は支持されません。** 全4Bのcache正常性、無cache自由生成の全軌跡、学習量・教材十分性・一般原因は証明していません。BF16差だけをbugとは判定しません。

実generate一回で保存raw[:474]だけを固定再生し、返る全token列の一致を検査しました。1load、core forward開始/完了476（cached474＋uncached2）、固定再生1・474token、generate API1。generateを抜けた後に参照2回を実行し、自由生成/更新/新CMEEは0。peak allocated9.673664/reserved11.193359GiB。外wrapper36.128866059秒、親timeout170＋kill10、retry0です。

両safetensorsは各keys292/473・各248320要素の有限F32。rootとread-only補助が全vectorからargmax・順位・logit・top5・margin・最大/平均絶対差を独立再計算し一致しました。平均差F32は292=0.034228257835、473=0.077544502914（F64平均との差は数e-9の還元差）。source/input/7fcca3ce重みは不変。原run.stageにPENDINGが残っていますが、終端status COMPLETE・比較2件・476完了が成立しており、原本は修復していません。

## 回収と全fileの地図

完全ZIPは18member/17payload、1884361bytes、SHA256 `2f3afb00579d5674f241740011f085e12c380e9e2cec3e1efd4b06ccc61a5d89`。全CRC/bytes/SHA照合済み。保存ID `libfile_01631bb06ca88191aab25f201113af5a`。数値本体はこの完全ZIPを正本とし、重複した大容量blobはGitHubへ置きません。

| path | 責務 |
|---|---|
| README.md | 実結果・判断限界・全file地図 |
| run/run.json | 未修復の全実数値・件数・時間・identity・終端status |
| run/points.json | 二地点の実入力hash/保存raw identity |
| run/loaded_tensors.json | 非学習読込112tensorの照合 |
| ZIP内 run/cached_logits.safetensors、run/uncached_logits.safetensors | 二地点の全248320要素logit、各key292/473。モデル重みではない |
| runtime/plan.json | 実行時の承認済み原本。親plan.jsonは閉鎖状態 |
| runtime/run_cache_prefix_shop.py | 実行source a2fbfa8e、前の提案からbyte変更0 |
| runtime/prefix_points.json、runtime/prepared.json | 固定prefix/配置時3原本hashと承認 |
| runtime/execute_once.lock、runtime/gpu_launch.json | 一回起動/PID383113・承認と上限 |
| runtime/launch_wrapper.py、runtime/launch.log | 親timeout実command/起動原本 |
| runtime/gpu.log、runtime/gpu.exit、runtime/gpu_elapsed.json | 原log/exit0/外36.128866秒 |
| runtime/post_identity.json | raw/adapter全file不変・GPU読取・回収scope |
| archive_manifest.json | 全17payloadの元path/bytes/SHA、ZIP内manifest.jsonと同一 |
| verification.json | Pod外root/補助の独立検算・限界・転記assert停止の区別 |
| preservation_receipt.json | 完全ZIPの保存identity/bytes/hash |
| proof.jpg | Jupyter実完了画面 |

回収時、画面のZIP bytes/SHA/member数をrootが誤転記したため、Codex側の照合assertが抽出前に停止しました。回収済み実bytes/hashとmanifest18member/17payloadへ訂正して全件一致を確認しました。GPU処理の失敗・再実行ではなく、再downloadも0です。

## 現在地と次の対象

前回17更新の新2件は意味/本文0/2、両TOKEN_LIMIT、不採用閉鎖のまま。旧9件はNOT_RUN、履歴FIT9/9を現重みの保持確認へ昇格しません。学習済4Bから意味・本人本文・保存再読が成立するという本来の未完了は残っています。

今回のcache二経路比較は閉鎖し、同種診断や有料反復を追加しません。次に扱う不足は、保存rawで確認した型・列の崩れ、field誤配、反復と、教師文脈CE低下が自由生成へ移っていない点です。まず既存教師/失敗raw/既知の実結果から教示・学習対象の対応をCPUで再検討する範囲で、追加GPU試行案は未作成・未承認。現2題のための新しい観測会は不要ですが、一般用途の教材十分性は未確定です。

全体00/観測入口/weekly§119/01Aを同期。通常ModelCandidateSource/receiver/意味型/三core/API/DTO/DB/RN/Render/Supabase/依存/merge/deployの構造差分0、STRUCTURE_MAP_DELTA_NONE。GPU1MiB/0％で稼働保持、管理console/API/Stop/restart/delete0。root単一writer/executor/judge、補助read-only、実環境Codex Work、正式Pro/Ultra/human受入れではありません。primary=BLOCKER_NARROWED（この二地点のcache単独原因説を狭めた範囲）、TECHNICAL_CREDIT=0、PRODUCT_CREDIT=0、正式0/3・54.50％、candidate_ready=false、automatic_progression=false。
