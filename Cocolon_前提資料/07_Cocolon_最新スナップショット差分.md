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
  mashos-api: 247
purpose: "EmlisAI 実装後の repo-synced 差分を華恋向けに要約し、現在どこまで変わったかを固定する"
---

# 1. 差分の要点

今回の current snapshot は、**Input 直後返答を EmlisAI へ差し替える実装** が入った版です。  
visible copy cleanup phase の後に、**backend immediate response path と subscription copy** が進みました。

# 2. repo-synced 変更ファイル数

- `Cocolon`: 1 files
- `mashos-api`: 14 files
- total: 15 files

# 3. repo-synced 変更ファイル一覧

## Cocolon
- `lib/iap/iapRuntimeCatalog.js`

## mashos-api
- `ai/services/ai_inference/api_emotion_reflection.py`
- `ai/services/ai_inference/api_emotion_submit.py`
- `ai/services/ai_inference/api_subscription.py`
- `ai/services/ai_inference/emotion_submit_service.py`
- `ai/services/ai_inference/subscription_bootstrap_store.py`
- `ai/services/ai_inference/emlis_ai_capability.py`
- `ai/services/ai_inference/emlis_ai_context_service.py`
- `ai/services/ai_inference/emlis_ai_greeting_state_store.py`
- `ai/services/ai_inference/emlis_ai_prompt.py`
- `ai/services/ai_inference/emlis_ai_reply_service.py`
- `ai/services/ai_inference/emlis_ai_style_profile_service.py`
- `ai/services/ai_inference/emlis_ai_types.py`
- `ai/services/ai_inference/emlis_ai_world_model_service.py`
- `ai/services/ai_inference/emotion_history_search_service.py`

# 4. 今回の差分が意味すること

## 4-1. 進んだこと
- `input_feedback.comment_text` の source of truth を shared save service 側へ寄せた
- Input 直後返答を EmlisAI immediate response として server-owned 化した
- `/emotion/submit` と `/emotion/reflection/publish` の返答 path を揃えた
- Plus / Premium の EmlisAI 価値差分が subscription bootstrap / IAP runtime copy に入った
- internal helper として `emotion_history_search_service.py` が追加された
- greeting / style / capability / world model / context / reply の EmlisAI モジュール群が追加された

## 4-2. まだ repo-synced で見えないもの
- greeting-state の DB schema は repo 外（Supabase / patch）で先行適用される場合がある
- contract / DDL / test の一部は patch 管理と repo sync がズレうる

## 4-3. だから今の資料運用はこうなる
- **repo inventory は repo-synced current structure を基準に読む**
- **DB / patch 側 prerequisites は handoff と rule files で補足する**
- EmlisAI 本体改善は `emotion_submit_service.py` と `emlis_ai_*` から始める

# 5. current operational conclusion

- EmlisAI は UI 新機能ではなく backend immediate response engine
- `comment_text` は public contract のまま残る
- `input_feedback.emlis_ai` は additive meta
- Free / Plus / Premium の差分は capability + subscription copy の二層で持つ
- EmlisAI は worker family ではなく synchronous path
