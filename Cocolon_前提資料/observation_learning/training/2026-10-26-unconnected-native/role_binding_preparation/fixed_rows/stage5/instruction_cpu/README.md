> **最新（2026-10-30）：承認済み非学習一回を不採用閉鎖。** [全実結果・全file地図](result_20261030/README.md)。1load/学習0/2call、両S1不成立、新2意味/本文0/2、旧9NOT_RUN、40.392秒/$0.003141634910按分、原本保全/同9b不変。指示整理だけでは成立せず、retry/追加GPU0。以下はCPU準備と提案時の履歴で、承認前状態へ戻さない。

# 5区間の指示整合CPU確認・新しい非学習一回案

2026-10-30。開始PR30 `8a47e910641ff00b8810aec43aa775a8f9765ca7`、API PR3 `7acff07421c0cfa458ec6cf75616187379311854`。全体00全文・作業入口/CURRENT_RULES/Rule18・必須incident全文・全体設計01/02と全file地図01Aのrouting/対象map・観測学習意図・最新weekly§122を確認。System Contextは最新cache未生成の既存状態で、fresh原本を直接読む。root単一writer/executor、補助read-only、実環境Codex Workで正式Pro/Ultra/human受入れではない。

## 確認した不整合と最小修正候補

前回の5区間promptは、system冒頭に『出力形式はcocolon.cmee.fixed_rows_comparison.v1です。』を残し、userのreference specにも`root=[format,v,a,q,c]`と全文root開始指定、`Write c.updates before c.prose`、root5/c9のshapeを残していた。一方、区間契約はS1 root4/S2 root3である。reference-only注記も存在していたため、必ず解釈不能とは断定しない。SHOP S2の全文欄混入との因果は未実測。

`prompt_stage_only.py`は最上位配列・該当row型を区間ごとに明示し、旧systemの全文形式指定を除く。全文root/cの構文は原本参照へ分離し、原material/prior/request_ref/profileと全非syntax意味条件をそのまま保持する。JSON構文のminified、文字列内部の空白保持、prose.bindsのlist型、空cell・null・ID/namespace・更新順/対象・自然な本人向け本文・修復禁止は維持する。全13位置のteacher値と出力capを変えない。新しいwire・意味受理・API変更ではない。

`project()`も新しい実messagesから連鎖を照合し、その同じ実recordをhash化する。旧messagesへ差し替えて旧checkerを通す処理はない。raw/同adapter/finish/EOS/usage/token/cap/構造条件と13位置の機械結合は旧と同じ。

## 実CPU結果と限界

| 確認 | 実結果 |
| --- | --- |
| 初版CPU | 4.692029303秒、exit0。元targetと非syntax意味条件の保持を確認 |
| 最終CPU | 4.965198732秒、exit0。minified/binds明示と新実prompt連鎖も含めて確認 |
| 全教師 | 新10区間のtarget＋EOS token列は不変、全13位置再結合2/2が原教師bytesと完全一致 |
| 原材料 | 元material/prior/ref/profile、全非syntax意味条件を10/10保持 |
| 入力長 | gold前段でprompt+cap最大7117/8192。旧実装7286から169減。実modelでは各call直前に別途live検査が必要 |
| 来歴 | 新messagesの全連鎖/実record hash、旧prompt代入拒否2/2 |
| 旧9 | 学習encodingを変更しないことを確認。新重みでの9件生成ではない |
| 新モデル処理 | load/forward/更新/生成/新CMEE0、CUDA未初期化 |

初版成功後のread-only reviewで旧minified指定とprose.binds型明示の不足を見つけ、構文説明を補った最終版を別fresh CPU rootで検査した。初版source/log/reportも残す。CPUを一回だけ実行したと表示せず、両成功と差を区別する。GPUの再試行・追加学習は0。

BOOK S1/SHOP S1の学習promptと前回実promptは全文一致（4467/4619token）。前段gold/actual差だけではS1失敗を説明しない。SHOP S2だけ前段引用差が入り、5147→5121tokenでその他の材料・spec/systemは同じ。新10区間は各1更新、target計4598token、旧9は15421tokenだが、各例mean lossなのでtoken比をgradient比へ換算しない。更新前CEは最終保存重みNLLではない。未習得も残るため、指示修正だけで改善する保証はない。

旧staged_pair9も無視しない。10/28はA/B補助学習後に元全文を生成し0/2、10/29は保存2dfdのA/B自体を診断してstrict1/4・Bはgold Aでも未習得だった。今回はそれらの再起動でも、新たな短課題学習方式でもない。直近9b1901abの5区間のactive syntaxだけを変える非学習比較である。一般化や4B能力上限は断定しない。

CPU原本は29member/28payload、342660bytes、SHA256 `d0cda929777eceb11cef994a9d2414414bb6fb25a18b8adb738a8ba562e2cd8e`。root/補助が全CRC/bytes/SHA、全10prompt/原材料/全非syntax意味条件/target不変・13位置再結合を独立確認。tokenizationはJupyter実保存tokenizerの値で、Codex hostで再tokenizeしたという意味ではない。旧run/182凍結file/保存9b1901ab不変。重み本体は前回の[完全原本](https://chatgpt.com/library?file_id=libfile_cc6b41f4f62c81919cbaec65e51ef379&account_id=personal)に保存済みで今回重複収録しない。

## 新しい個別承認が必要な一回案

**追加学習0、保存9b1901abを非学習1load、修正指示でBOOK/SHOP各最大5call→実5段完成時だけ既存CMEE/cold→新2の意味/本文/cold2/2時だけ旧9を各1call。最大19call、全処理30分/$0.14按分（準備・回収・保持等別）。** 詳細は`proposal.json`。各区間capは旧640/1152/512/512/384、768/1280/384/512/512を維持し、context8192/各180秒/全1800秒・親1790TERM+kill10。新run一回だけ、途中失敗は同題停止、再試行・修復・cap延長・追加学習・次prompt探索なし。

同じ保存重みで指示だけを変え、前回実3rawをbeforeとするため、追加学習量との混同を避ける。新2成功時だけ旧9へ進む。30分は停止上限で、改善保証・必要所要ではない。prompt builder/projectとCPU確認は実装済み、非学習有限runner/launcherは承認後に同範囲で実装・source固定し、実行前にfresh検査する。GPUは未実行、planは`PROPOSED_NOT_APPROVED`。前回の閉鎖済み19更新承認・残時間/予算は流用しない。Rule18§11.3は『明確な費用・期間・運用負担』をstanding delegation外とするため、新しい個別承認後に限る。

現2題には教師があり、追加観測会は今は不要。新2意味/本人本文0/2、旧9新生成NOT_RUN、商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=falseを保持。GPUは稼働保持、管理console/API/Stop/restart/delete0。通常receiver/意味型/三core/API/DB/RN/Render/Supabase/依存/merge/deploy差分0、STRUCTURE_MAP_DELTA_NONE。primary=BLOCKER_NARROWEDは指示不整合の特定だけ、technical/product credit0。

## 全file地図

| ファイル | 責務 |
| --- | --- |
| prompt_stage_only.py | 区間ごとの唯一のactive構文、元意味条件保持、新実messages連鎖の検査/機械結合候補 |
| check_once.py | 最終Jupyter CPUで元教師/全target/EOS/長さ/旧9/新連鎖と旧message代入拒否を確認。モデル0 |
| report.json / initial_report.json | 最終/初版CPU実結果・長さ・sourcehash・限界 |
| cpu_final.log/exit / cpu_initial.log/exit | 両CPUの実stdout/exit0 |
| originals.zip / archive_manifest.json | 初版/最終source・全prompt/teacher/reference spec・比較元raw/入力/encodingの29member地図 |
| verification.json | Pod外rootの全CRC/bytes/SHA/元値/全13位置/全10prompt照合と限界 |
| proposal.json | 保存9b19非学習比較・最大30分/$0.14・条件付き旧9・未承認の限定scope |
| file_manifest.json / proof.jpg | GitHub今回全path/bytes/SHA/owner、Jupyter CPU完了/GPU未実行画面 |
