---
doc_id: cocolon_file_rename_backlog
title: "Cocolon ファイル名変更保留台帳"
revision_date: "2026-04-18"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 133
  mashos-api: 247
purpose: "visible copy cleanup の後に行う file/route/API rename phase の判断を保留管理する（EmlisAI 更新版）"
---

# 1. 位置づけ

今回の current snapshot では、EmlisAI 実装が入っています。  
ただし、**EmlisAI は新規内部系統名として十分明快であり、rename phase の主対象ではありません。**

# 2. status 定義

- `later`
- `defer`
- `redefine_before_rename`
- `do_not_rename_now`
- `keep_internal_name`

# 3. EmlisAI 関連の backlog

| path | current fact | status | future candidate | reason |
|---|---|---|---|---|
| `ai/services/ai_inference/emlis_ai_capability.py` | tier -> capability の単一解決点 | keep_internal_name | そのまま維持可 | 役割名が明快 |
| `ai/services/ai_inference/emlis_ai_context_service.py` | 履歴 / 集計 / greeting state 収集中枢 | keep_internal_name | そのまま維持可 | context service として十分明快 |
| `ai/services/ai_inference/emlis_ai_reply_service.py` | immediate response 生成中枢 | keep_internal_name | そのまま維持可 | reply service として明快 |
| `ai/services/ai_inference/emlis_ai_world_model_service.py` | facts / hypotheses 構築 | keep_internal_name | そのまま維持可 | world model 役割が明確 |
| `ai/services/ai_inference/emotion_history_search_service.py` | EmlisAI 向け内部検索 helper | keep_internal_name | そのまま維持可 | route self-call を避けるための service 名として明快 |
| `ai/services/ai_inference/emlis_ai_greeting_state_store.py` | 時間帯挨拶 state 管理 | keep_internal_name | そのまま維持可 | DB 前提と役割が直結している |
| `ai/services/ai_inference/emotion_submit_service.py` | 入力保存 + EmlisAI 単一注入点 | do_not_rename_now | なし | save service canonical を崩すと既存 route 連鎖に波及 |
| `ai/services/ai_inference/api_emotion_submit.py` | `/emotion/submit` canonical public route | do_not_rename_now | なし | public API contract 直結 |
| `ai/services/ai_inference/api_emotion_reflection.py` | EmotionGeneratedPiece publish canonical route | do_not_rename_now | なし | public API contract 直結 |
| `ai/services/ai_inference/api_subscription.py` | bootstrap / me / update の canonical public route | do_not_rename_now | なし | public API contract 直結 |
| `Cocolon/lib/iap/iapRuntimeCatalog.js` | Plus / Premium の plan copy normalize 層 | keep_internal_name | そのまま維持可 | runtime catalog として明快 |

# 4. 今後の rename phase の原則

1. **Emlis / EmlisAI の語は public copy と internal name を分けて読む**
2. **public route / storage canonical に直結するものは今は rename しない**
3. **EmlisAI 系新規ファイルは keep_internal_name を基本とする**
4. **visible copy と file rename を分ける**
5. **subscription copy 改修と API canonical rename を混ぜない**

# 5. current operational note

今回の EmlisAI 実装は rename phase ではなく、  
**Input 直後返答の中枢差し替え phase** として扱うのが正しいです。
