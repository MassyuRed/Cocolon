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
  mashos-api: 250
purpose: "見落とすと設計誤読しやすい rule file / policy file / behavior file を索引化する（Home write gate / Piece再定義版）"
---

# 1. 先に結論

**rule file がある変更は、画面の見た目より rule / behavior file を先に読む。**  
current snapshot では特に、

- `emotion_submit_service.py`
- `api_contract_registry.py`
- `PUBLIC_API_REGISTRY.md`
- `api_account_status.py`
- `api_ranking.py`

を先に見ないと、Piece / ProfileCreate / DeepInsight / key semantics を誤読しやすいです。

# 2. 文書としての rule files

| path | いつ必須か | 何を防ぐか |
|---|---|---|
| `mashos-api/ai/docs/API_CONTRACT_POLICY.md` | public route / request / response / `input_feedback` shape / Piece count key を触る時 | breaking change / additive-only 違反 |
| `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md` | public mobile-facing route を増減・停止・置換する時 | route 追加漏れ / route 削除漏れ / orphan file 誤読 |
| `mashos-api/ai/docs/NATIONAL_ALIGNMENT_AUDIT_PHASE5.md` | RN/API 境界や contract 運用を触る時 | display-only 原則や contract enforcement の見落とし |
| `mashos-api/ai/docs/TUTORIAL_STABILITY_REDESIGN.md` | tutorial の target / overlay / proxy press を触る時 | tutorial sandbox と通常 flow の混同 |
| `Cocolon/SUBSCRIPTION_RELEASE_PHASE3.md` | env / release-check / public/private config を触る時 | release env 不整合 |
| `Cocolon/SUBSCRIPTION_RELEASE_PHASE4.md` | live console 確認や store product 設定に触る時 | Apple/Google console 側の live mismatch |
| `mashos-api/ai/docs/iap_subscription_update.md` | IAP runtime / bootstrap / subscription sales copy を触る時 | obsolete ProfileCreate value copy の再混入 |
| `mashos-api/ai/docs/emlis_ai_greeting_state.sql` | greeting-state DB 前提を揃える時 | time-slot 挨拶 state の schema drift |

# 3. コードとしての rule / behavior files

| path | いつ必須か | 何を防ぐか |
|---|---|---|
| `mashos-api/ai/services/ai_inference/api_contract_registry.py` | public route / notes 変更時 | contract registry 更新漏れ |
| `mashos-api/ai/services/ai_inference/middleware_api_contract.py` | public response metadata を触る時 | header contract drift |
| `mashos-api/scripts/check_no_direct_supabase.py` | RN data access を触る時 | RN での direct Supabase / raw fetch 回帰 |
| `mashos-api/ai/tests/contract/*` | route / response / registry / header 変更時 | contract drift の未検出 |
| `mashos-api/ai/services/ai_inference/emotion_submit_service.py` | 入力直後返答 / EmlisAI / Home write gate を触る時 | route 層だけを見て source of truth を外す |
| `mashos-api/ai/services/ai_inference/api_mymodel_create.py` | ProfileCreate を触る時 | Account-only asset と国家システム材料の混同 |
| `mashos-api/ai/services/ai_inference/astor_material_snapshots.py` | self structure / premium reflection / source material を触る時 | ProfileCreate / DeepInsight を材料へ戻す誤り |
| `mashos-api/ai/services/ai_inference/api_nexus.py` | Piece read/social flow を触る時 | current visible flow と legacy discovery route の混同 |
| `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` | `/trending` / `/holders` / qna list を触る時 | unused legacy route と current product flow の混同 |
| `mashos-api/ai/services/ai_inference/api_account_status.py` | Account の Piece数を触る時 | visible semantics と legacy key の混同 |
| `mashos-api/ai/services/ai_inference/api_ranking.py` | Ranking の Piece生成数を触る時 | metric semantics と field name の混同 |
| `mashos-api/ai/services/ai_inference/astor_account_status_store.py` | account status projection を触る時 | `mymodel_questions_total` 意味ズレ |
| `mashos-api/ai/services/ai_inference/astor_ranking_kernel.py` | ranking kernel / board payload を触る時 | board metric と visible copy のズレ |
| `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py` | 時間帯挨拶 / slot state を触る時 | greeting logic drift |

# 4. current rule の核 excerpt

## 4-1. API contract policy
- `input_feedback.comment_text` は public contract として維持する
- Account / Ranking / Piece count の semantics を変えても、key rename は additive / compatible に扱う
- public route を止める時は registry / tests を同時更新する

## 4-2. Home write gate rule
- Home 以外を current live write gate に戻さない
- Piece は current input だけから作る
- ProfileCreate は Account-only asset として読む

## 4-3. Orphan file / live route split rule
- `screens/DeepInsightScreen.js` や `api_deep_insight.py` のように physical file が残っていても、live route / visible flow とは限らない
- `app.py` / `api_contract_registry.py` / `PUBLIC_API_REGISTRY.md` / current frontend flow をセットで判断する

## 4-4. Piece count semantics rule
- current visible meaning は Piece count
- current public key は `mymodel_questions_total` / `questions_total` 等の legacy 名を維持する
- key rename と semantics change を別タスクに分ける

# 5. 見落としやすい対応表

| 変更内容 | 先に読むもの |
|---|---|
| Home write gate の変更 | `emotion_submit_service.py`, `api_today_question.py`, `api_emotion_reflection.py`, `API_CONTRACT_POLICY.md` |
| Piece 仕様変更 | `api_emotion_reflection.py`, `reflection_publish_entitlements.py`, `api_nexus.py`, `api_mymodel_qna.py` |
| ProfileCreate の変更 | `api_mymodel_create.py`, `mymodel_entitlements.py`, `03_Cocolon_命名体系.md` |
| DeepInsight cleanup | `app.py`, `api_contract_registry.py`, `PUBLIC_API_REGISTRY.md`, `tests/contract/*` |
| Piece数 / Ranking 変更 | `api_account_status.py`, `astor_account_status_store.py`, `api_ranking.py`, `astor_ranking_kernel.py`, `API_CONTRACT_POLICY.md` |
| key rename をしたい | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md`, `api_contract_registry.py`, `tests/contract/*` |

# 6. いまの注意

- current snapshot では DeepInsight public route は外れているが physical file cleanup は別論点
- current snapshot では Piece count semantics は更新済みだが key 名は legacy のまま
- current snapshot では ProfileCreate を Account-only asset として読む
- current snapshot では EmlisAI / Home write gate / Piece / Account status / Ranking を横断で見る必要がある
