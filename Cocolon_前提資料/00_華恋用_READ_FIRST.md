---
doc_id: cocolon_karen_read_first
title: "華恋用 READ FIRST"
revision_date: "2026-04-28"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 116
  mashos-api: 306
purpose: "華恋がこの資料だけで Cocolon の全体構造と国家システムを復元し、修正時に関連ファイル漏れを防ぐための運用資料"
coverage:
  total_files: 422
  included_in_overall_structure: 422
  included_in_national_system: 422
  excluded_from_main_body: 0
---

# これは何か

この一式は **Mash 向けの説明資料ではなく、華恋が作業前提を引き継ぐための運用資料** です。  
対象スナップショットは **Cocolon_2(27).zip (116 files)** / **mashos-api_5(7).zip (306 files)** の現行ローカル版です。

今回の基準面は次の通りです。

- `01` 系には **Cocolon 構造に関係する全ファイル** を本文で記載する
- `02` 系には **国家システムに関係する全ファイル** を本文で記載する
- `inventory` は作らない
- 図は補助であり、正本は **各ファイルの本文ブロック** とする
- 任意の 1 ファイルを起点に、関係ファイルを本文だけで辿れる状態を目指す
- 三大要素および API current owner 本体化は **2026-04-25 時点で DB rename 前段の完了扱い**。2026-04-26 時点では low / medium / high `pieces` の current bridge view 作成と API read-only 移行まで進んでいる。ただし DB physical rename / drop / legacy contract retirement / 旧名称ファイル削除は未実行である

# まず覚えること

1. **Cocolon は RN と backend が繋がって動く 1 つのアプリ**であり、repo を分けて理解しない  
2. **01/02 は差分メモではなく正本**。今回触ったファイルだけでなく、対象ファイル全件を読む  
3. **public route / request / response / startup / unread / access policy** を触る時は、必ず `05` と `02C` を先に見る  
4. **RN から直接 Supabase / raw fetch を増やさない**。境界は `frontend API boundary` と backend route に置く  
5. **修正開始時は system 単位で見る**。単体ファイルだけで判断しない
6. **三大中核構造** は、現行資料では **EmlisAI構造 / 分析構造 / Piece構造** を指す

# 読み順

1. `03_Cocolon_命名体系.md`
2. `01_Cocolon_全体構造資料.md`
3. `01A_Cocolon_全体構造資料_アプリ基盤とHome系.md`
4. `01B_Cocolon_全体構造資料_Analysis_Piece_EmotionLog_Ranking系.md`
5. `01C_Cocolon_全体構造資料_Account_Subscription_Backend支援系.md`
6. `02_Cocolon_国家システム資料.md`
7. `02A_Cocolon_国家システム資料_Input_Save_Dispatch系.md`
8. `02B_Cocolon_国家システム資料_Snapshot_Worker_Publish_Read系.md`
9. `02C_Cocolon_国家システム資料_契約_境界_検証系.md`
10. `04_Cocolon_変更テーマ別チェックリスト.md`
11. `05_Cocolon_ルールファイル索引.md`
12. `06_Cocolon_ファイル名変更保留台帳.md`
13. `07_Cocolon_最新スナップショット差分.md`

# 今回の資料更新方針

- `01` と `02` は **本文の全件 coverage** を持つ
- repo 分割ではなく **Cocolon の system / flow 分割** で書く
- `manifest.json` には docs 構成・coverage・除外理由を残す
- 除外ファイルは `07` と `manifest` に明記し、未確認のまま落とさない

# 2026-04-25 差分追記

今回の基準面は **Cocolon(108).zip** / **mashos-api(30).zip** / **DB境界v2 SQL結果一式** です。

- latest file count: `Cocolon=116` / `mashos-api=292` / `total=408`
- API側は DB rename 前に必要な current owner 本体化を完了扱いにする
- 旧名称APIファイルは削除対象ではなく、legacy compat façade として残す
- DB physical rename はまだ実行しない。DB境界と候補分類は `08_Cocolon_DB_rename_boundary.md` を読む
- `01` には current Cocolon構造 coverage、`02` には current 国家システム coverage を差分追記済み
- 2026-04-26 時点では low / medium / high `pieces` の bridge view は backend-readonly で作成済み。API側は SELECT-only path のみ current bridge view へ切替済み

# 2026-04-25 版の読み順補正

既存の読み順に加えて、DB / rename retirement に入る前は必ず次も読む。

14. `08_Cocolon_DB_rename_boundary.md`


# 2026-04-26 差分追記: latest bridge/API read-only 境界

この版は `Cocolon_前提資料(8).zip` を基底に、`Cocolon(108).zip` / `mashos-api(30).zip` と、このセッションで確定した DB境界v2 の結果を差分反映したものです。

- latest file count は引き続き `Cocolon=116` / `mashos-api=292` / `total=408`
- `01` 系本文の full coverage 検証: `408/408` 記載済み、欠落 `0`
- `02` 系本文の full coverage 検証: `408/408` 記載済み、欠落 `0`
- DB current bridge view は low 7件 / medium 4件 / high `pieces` 1件まで作成済み
- 作成済み bridge view は `security_invoker=true` かつ backend-readonly
- API側は read-only path のみ current bridge view へ切替済み
- write / update / delete / upsert / insert path は旧物理 table のまま残す
- DB physical rename / drop、semantic JSON rewrite、legacy route / contract retirement、旧名称APIファイル削除は未実行

この段階で削除してよいファイルは **0件** です。削除判断は `06_Cocolon_ファイル名変更保留台帳.md` と `08_Cocolon_DB_rename_boundary.md` の完了条件を満たしてから行います。


# 2026-04-27 差分追記: public contract registry cleanup / smoke完了

今回の基準面は **Cocolon_前提資料(10).zip** を基底に、**Cocolon_5(12).zip** / **mashos-api_5(6).zip** / **01_bridge_view_runtime_smoke_SELECT_ONLY_v2(1).txt** / **endpoint_smoke_write_result(1).json** を照合した版です。

確認済み fact:

- latest file count: `Cocolon=116` / `mashos-api=292` / `total=408`
- `01` 系本文には Cocolon 構造に関係する latest 408 files が全件記載されている
- `02` 系本文には 国家システムに関係する latest 408 files が全件記載されている
- Cocolon source file の内容差分: `0件`
- mashos-api source file の内容差分: `5件`
  - `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md`
  - `mashos-api/ai/services/ai_inference/api_contract_registry.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_log.py`
  - `mashos-api/ai/services/ai_inference/api_nexus.py`
  - `mashos-api/ai/tests/contract/test_api_contract_registry.py`
- DB SQL smoke v2 は `all_bridge_views_exist=true`, `all_row_counts_match_old_physical=true`, `all_views_have_service_role_select=true`, `all_views_have_no_service_role_write_grants=true`, `all_column_name_type_signatures_match_old_physical=true`
- endpoint write smoke は `status=pass`, `hard_502_count=0`, `non_2xx_count=0`, `writes_enabled=true`
- Piece write smoke は、現時点でログインユーザーから見える Piece がなく `q_instance_id` を取得できないため、今回は対象外。Piece が1件以上公開・閲覧可能になった段階で `POST /piece/view` / `POST /piece/resonance` を再確認する

この差分で進んだこと:

- public contract registry に current route 欠落分を追加
- `/friends/*` 互換aliasの一部を deprecated + replacement へ整理
- registry guard test を current route / legacy friends alias retirement 境界に合わせて更新
- route handler / DB / RN source は削除していない

この差分でまだ完了扱いにしないこと:

- DB physical rename / drop
- current bridge view への write 切替
- legacy route handler 削除
- 旧名称APIファイル削除
- `mymodel/qna/*` active legacy named public contract の retire
- Piece write smoke（対象Piece作成後に実施）

# 2026-04-28 差分追記: 新国家システム / 高負荷基盤 / worker・FCM・負荷試験反映

今回の基準面は **Cocolon_前提資料(13).zip** を基底に、**Cocolon_2(27).zip** / **mashos-api_5(7).zip** を照合した版です。

確認済み fact:

- latest file count: `Cocolon=116` / `mashos-api=306` / `total=422`
- `01` 系本文には Cocolon 構造に関係する latest 422 files が全件記載されている
- `02` 系本文には 国家システムに関係する latest 422 files が全件記載されている
- Cocolon source file の内容差分: `1件`
  - `Cocolon/components/EmotionPiecePreviewModal.js`
- mashos-api source file の新規追加: `14件`
- `mashos-api/ai/docs/LOAD_TESTING.md`
- `mashos-api/ai/docs/WORKER_OPERATIONS.md`
- `mashos-api/ai/services/ai_inference/.env.worker.example`
- `mashos-api/ai/services/ai_inference/analysis_capability.py`
- `mashos-api/ai/services/ai_inference/analysis_report_validity_gate.py`
- `mashos-api/ai/services/ai_inference/core_contract_registry.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_quality_gate.py`
- `mashos-api/ai/services/ai_inference/fcm_push_queue.py`
- `mashos-api/ai/services/ai_inference/piece_generation_policy.py`
- `mashos-api/ai/tests/contract/test_new_national_core_analysis_contracts.py`
- `mashos-api/ai/tests/contract/test_new_national_core_emlis_contracts.py`
- `mashos-api/ai/tests/contract/test_new_national_core_piece_contracts.py`
- `mashos-api/scripts/astor_worker_status.py`
- `mashos-api/scripts/cocolon_load_test.py`
- mashos-api source file の内容差分: `21件`
- `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md`
- `mashos-api/ai/services/ai_inference/api_analysis_reports.py`
- `mashos-api/ai/services/ai_inference/api_contract_registry.py`
- `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
- `mashos-api/ai/services/ai_inference/api_emotion_piece.py`
- `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
- `mashos-api/ai/services/ai_inference/api_follow.py`
- `mashos-api/ai/services/ai_inference/api_self_structure.py`
- `mashos-api/ai/services/ai_inference/api_today_question.py`
- `mashos-api/ai/services/ai_inference/astor_job_queue.py`
- `mashos-api/ai/services/ai_inference/astor_self_structure_report.py`
- `mashos-api/ai/services/ai_inference/astor_worker.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_capability.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
- `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
- `mashos-api/ai/services/ai_inference/emotion_piece_generation_service.py`
- `mashos-api/ai/services/ai_inference/emotion_piece_store.py`
- `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
- `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py`
- `mashos-api/ai/services/ai_inference/piece_generation_store.py`

この差分で進んだこと:

- 三大中核構造を `EmlisAI構造` / `分析構造` / `Piece構造` として明記した
- `core_contract_registry.py` により三大中核の internal contract を固定した
- Piece preview/publish は `piece_text` を正式出力、`reflection_text` を互換出力として扱う
- EmlisAI / 分析 / Piece の品質・安全・validity Gate を追加した
- 高負荷時のAPI hot pathを守るため、worker profile / queue stats / stale running復旧 / FCM専用queue / load test手順を追加した
- DB physical rename / drop、legacy route handler削除、旧名称APIファイル削除は引き続き未実行
