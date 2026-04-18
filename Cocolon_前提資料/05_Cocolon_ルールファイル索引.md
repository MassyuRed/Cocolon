---
doc_id: cocolon_rule_file_index
title: "Cocolon ルールファイル索引"
revision_date: "2026-04-18"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 133
  mashos-api: 247
purpose: "見落とすと設計誤読しやすい rule file / policy file / behavior file を索引化する（EmlisAI 更新版）"
---

# 1. 先に結論

**rule file がある変更は、画面の見た目より rule / behavior file を先に読む。**  
今回の EmlisAI では特に、`emotion_submit_service.py` と contract policy を先に見ないと誤読しやすいです。

# 2. 文書としての rule files

| path | いつ必須か | 何を防ぐか |
|---|---|---|
| `mashos-api/ai/docs/API_CONTRACT_POLICY.md` | public route / request / response / `input_feedback` shape を触る時 | breaking change / additive-only 違反 |
| `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md` | public mobile-facing route を増減・ rename・置換する時 | route 追加漏れ / 互換漏れ |
| `mashos-api/ai/docs/NATIONAL_ALIGNMENT_AUDIT_PHASE5.md` | RN/API 境界や contract 運用を触る時 | display-only 原則や contract enforcement の見落とし |
| `mashos-api/ai/docs/TUTORIAL_STABILITY_REDESIGN.md` | tutorial の target / overlay / scroll / proxy press を触る時 | 実機差によるズレ / タップ抜け |
| `Cocolon/SUBSCRIPTION_RELEASE_PHASE3.md` | env / release-check / public/private config を触る時 | release env 不整合 |
| `Cocolon/SUBSCRIPTION_RELEASE_PHASE4.md` | live console 確認や store product 設定に触る時 | Apple/Google console 側の live mismatch |
| `mashos-api/ai/docs/iap_subscription_update.md` | IAP runtime / bootstrap / subscription sales copy を触る時 | 片側だけの課金設定変更 |
| `mashos-api/ai/docs/emlis_ai_greeting_state.sql` | greeting-state DB 前提を揃える時 | time-slot 挨拶 state の schema drift |

# 3. コードとしての rule / behavior files

| path | いつ必須か | 何を防ぐか |
|---|---|---|
| `mashos-api/ai/services/ai_inference/api_contract_registry.py` | public route / notes 変更時 | contract registry 更新漏れ |
| `mashos-api/ai/services/ai_inference/middleware_api_contract.py` | public response metadata を触る時 | header contract drift |
| `mashos-api/scripts/check_no_direct_supabase.py` | RN data access を触る時 | RN での direct Supabase / raw fetch 回帰 |
| `mashos-api/ai/tests/contract/*` | route / response / registry / header 変更時 | contract drift の未検出 |
| `mashos-api/ai/services/ai_inference/publish_governance.py` | visible / READY / retention / publish state を触る時 | RN 側だけ直して真因を外す |
| `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` | startup badge / popup / light summary を触る時 | App.js と backend section の不整合 |
| `mashos-api/ai/services/ai_inference/astor_material_snapshots.py` | derived data 材料範囲を触る時 | snapshot 起点の見落とし |
| `mashos-api/ai/services/ai_inference/astor_worker.py` | generate / inspect / refresh / analyze を触る時 | worker fan-out 見落とし |
| `mashos-api/ai/services/ai_inference/generation_lock.py` | 重複実行や enqueue を触る時 | race / duplicate generation |
| `mashos-api/ai/services/ai_inference/emotion_submit_service.py` | 入力直後返答 / EmlisAI の本体を触る時 | route 層だけを見て source of truth を外す |
| `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | reply wording / fallback / meta を触る時 | EmlisAI の責務分散 |
| `mashos-api/ai/services/ai_inference/emlis_ai_capability.py` | Free / Plus / Premium 差分を変える時 | tier 差分の散在 |
| `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py` | 時間帯挨拶 / slot state を触る時 | greeting logic drift |
| `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py` | `input_feedback.emlis_ai` 契約を触る時 | `comment_text` 互換崩壊 |
| `mashos-api/ai/tests/test_emlis_ai_greeting_state_store.py` | greeting slot を触る時 | 時間帯判定の回帰 |

# 4. rule の核 excerpt

## 4-1. API contract policy
EmlisAI を入れても、**`input_feedback.comment_text` は public contract として維持**し、  
増やすのは additive meta に限定する。

## 4-2. direct Supabase / raw fetch guard
RN surface では `supabase.from`, `supabase.rpc`, `supabase.channel`, raw `fetch()` を禁止。  
EmlisAI も server-owned を守る。

## 4-3. EmlisAI behavior rule
- Free は履歴 retrieval なし
- Plus は retrieval 必須
- Premium は personalization 深度を上げる
- `input_feedback_text_templates.py` は fallback
- greeting-state は DB 前提を持つ

# 5. 見落としやすい対応表

| 変更内容 | 先に読むもの |
|---|---|
| Input 直後返答の文面変更 | `emotion_submit_service.py`, `emlis_ai_reply_service.py`, `API_CONTRACT_POLICY.md` |
| 履歴参照量の変更 | `emlis_ai_capability.py`, `emlis_ai_context_service.py`, `emotion_history_search_service.py` |
| greeting の変更 | `emlis_ai_greeting_state_store.py`, `emlis_ai_greeting_state.sql` |
| `input_feedback` shape 変更 | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md`, `api_contract_registry.py`, `tests/contract/*` |
| Plus / Premium 文言変更 | `api_subscription.py`, `subscription_bootstrap_store.py`, `lib/iap/iapRuntimeCatalog.js` |
| startup と EmlisAI を混ぜる変更 | `startup_snapshot_store.py`, `App.js`, `emotion_submit_service.py` |

# 6. いまの注意

今回の current code では、**EmlisAI 本体は repo に入っていても、greeting-state DDL や一部 contract/test は DB / patch 側で管理されることがある**。  
そのため、実装変更時は **repo snapshot だけで完了したと思わず、DB / patch / tests の同期状態**を必ず確認すること。
