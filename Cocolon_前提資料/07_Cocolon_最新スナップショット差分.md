---
doc_id: cocolon_current_snapshot_diff
title: "Cocolon 最新スナップショット差分"
revision_date: "2026-04-18"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 133
  mashos-api: 250
purpose: "この session の PR1〜PR5 反映後の repo-synced 差分を華恋向けに要約し、現在どこまで構造変更されたかを固定する"
---

# 1. 差分の要点

今回の current snapshot は、EmlisAI 実装後の土台の上で、さらに次を進めた版です。

- Piece / ProfileCreate の意味分離
- DeepInsight の current live flow 停止
- ProfileCreate / DeepInsight を国家システム材料から外す方針の反映
- legacy question discovery の current visible flow 停止
- Account / Ranking の Piece 数を新意味へ揃える

# 2. repo-synced 変更ファイル数

- `Cocolon`: 12 files
- `mashos-api`: 21 files
- total: 33 files

# 3. repo-synced 変更ファイル一覧

## Cocolon
- `App.js`
- `screens/AccountScreen.js`
- `screens/MyModelScreen.js`
- `lib/iap/iapRuntimeCatalog.js`
- `guide/guidesJa.js`
- `guide/termsJa.js`
- `screens/MyWebScreen.js`
- `screens/DeepInsightScreen.js`
- `lib/nexusApi.js`
- `screens/NexusScreen.js`
- `screens/RankingTopScreen.js`
- `screens/MyModelQuestionsRankingScreen.js`

## mashos-api
- `ai/services/ai_inference/subscription_bootstrap_store.py`
- `ai/services/ai_inference/app.py`
- `ai/services/ai_inference/api_contract_registry.py`
- `ai/docs/PUBLIC_API_REGISTRY.md`
- `ai/tests/contract/test_api_contract_registry.py`
- `ai/services/ai_inference/api_deep_insight.py`
- `ai/services/ai_inference/api_mymodel_create.py`
- `ai/services/ai_inference/astor_material_snapshots.py`
- `ai/services/ai_inference/analysis_engine_adapter.py`
- `ai/services/ai_inference/astor_worker.py`
- `ai/services/analysis_engine/self_structure_engine/signal_extraction.py`
- `ai/services/analysis_engine/self_structure_engine/rules.py`
- `ai/services/analysis_engine/self_structure_engine/fusion.py`
- `ai/services/ai_inference/astor_myprofile_report.py`
- `ai/services/ai_inference/astor_myprofile_persona.py`
- `ai/services/ai_inference/api_nexus.py`
- `ai/services/ai_inference/api_account_status.py`
- `ai/services/ai_inference/astor_account_status_store.py`
- `ai/services/ai_inference/astor_account_status_kernel.py`
- `ai/services/ai_inference/api_ranking.py`
- `ai/services/ai_inference/astor_ranking_kernel.py`

# 4. 今回の差分が意味すること

## 4-1. 進んだこと

- Home を唯一の primary write gate として固定した
- Piece 作成入口を Home 起点へ寄せ、Piece 画面は read/social 面として読む前提を強めた
- ProfileCreate を Account-only asset として読む前提を強めた
- DeepInsight public route を current live flow から外した
- Piece 画面の legacy question discovery UI を current visible flow から閉じた
- Account / Ranking の Piece 数を current visible semantics として扱う整理を進めた

## 4-2. current snapshot で重要な residue

- `screens/DeepInsightScreen.js` と `api_deep_insight.py` は **physical file cleanup pending** として残りうる
- `/mymodel/qna/trending` と `/mymodel/qna/holders` は **legacy public route** として残りうるが current frontend visible flow では未使用
- Piece count / ranking は current visible meaning は新仕様でも、response key は **`mymodel_questions_total` / `questions_total`** など legacy 名を維持する
- PR5 の visible semantics は最新 snapshot では既存 endpoint/store/kernel の更新として入っており、別 helper file を前提にしない

## 4-3. だから今の資料運用はこうなる

- **live flow と orphan file / legacy route / legacy key を分けて読む**
- **Home / EmlisAI / Piece / Account status / Ranking を横断で見る**
- **DeepInsight cleanup と key rename は別タスクとして扱う**

# 5. current operational conclusion

- Home が唯一の primary write gate
- Piece は Input 起点の emotion-generated original reflection のみ
- Piece 画面は Nexus read/social surface
- ProfileCreate は Account-only asset
- DeepInsight は current live flow から外した
- Piece count / ranking は visible semantics を新仕様へ寄せたが key 名は legacy のまま
