---
doc_id: cocolon_karen_read_first
title: "華恋用 READ FIRST"
revision_date: "2026-04-18"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 133
  mashos-api: 247
purpose: "華恋が EmlisAI 実装後の全体構造と国家システムを前提に作業できるようにする"
---

# これは何か

この一式は **Mash 向けの説明資料ではなく、華恋が作業前提を引き継ぐための運用資料** です。  
今回の更新では、**EmlisAI の実装が current snapshot に入った後の前提**を固定します。

対象スナップショットは次です。

- `Cocolon` : 133 files
- `mashos-api` : 247 files

重要な更新点は、**Input 直後返答が template 中心から EmlisAI 中心へ変わった**ことです。  
ただし public surface は維持されており、`input_feedback.comment_text` を引き続き source of truth として扱います。

# 最初の読み順

1. `03_Cocolon_命名体系.md`
2. `01_Cocolon_全体構造資料.md`
3. `02_Cocolon_国家システム資料.md`
4. `07_Cocolon_最新スナップショット差分.md`
5. `04_Cocolon_変更テーマ別チェックリスト.md`
6. `05_Cocolon_ルールファイル索引.md`
7. `inventory/focus_map.yaml`
8. 必要な inventory / route map / registry

# 今回の EmlisAI 実装で覚えておく一言

**EmlisAI は frontend 新機能ではなく、Input 直後返答を server-owned に差し替える cross-cutting response system である。**

つまり、見た目だけ直しても完結しません。  
最初に見るべき中枢は `InputScreen.js` ではなく、次の backend 連鎖です。

- `api_emotion_submit.py`
- `emotion_submit_service.py`
- `emlis_ai_reply_service.py`
- `emlis_ai_context_service.py`
- `emlis_ai_world_model_service.py`
- `emlis_ai_style_profile_service.py`
- `input_feedback_text_templates.py`（fallback）

# 作業時の絶対ルール

## 1. EmlisAI は `input_feedback.comment_text` 契約を壊さない

Input surface は今も `input_feedback.comment_text` を読む前提です。  
EmlisAI を変えても、**public response から `comment_text` を消さない**こと。  
増やしてよいのは additive meta（例: `input_feedback.emlis_ai`）だけです。

## 2. EmlisAI は server-owned として扱う

RN は表示専用です。  
EmlisAI の最終 capability 決定、履歴 retrieval、greeting state 判定、reply generation は **server 側で完結** させます。  
client には marketing copy や runtime hint を渡しても、最終判定は渡しません。

## 3. 履歴 retrieval の設計は tier と一緒に見る

今回の実装で固定した体験差分は次です。

- Free: 履歴参照なし
- Plus: 履歴 retrieval 必須
- Premium: retrieval 深度と personalization をさらに上げる

したがって、Input の返答を触る時でも **`api_subscription.py` / `subscription_bootstrap_store.py` / `lib/iap/iapRuntimeCatalog.js`** まで必ず確認します。

## 4. EmlisAI の immediate response path と ASTOR 非同期 path を混同しない

EmlisAI は **保存直後の同期返答**です。  
worker / publish governance / startup snapshot はそのまま重要ですが、EmlisAI 本体は worker family ではありません。  
「derived artifact を作る非同期国家システム」と「今すぐ返す EmlisAI」を別物として読むこと。

## 5. greeting-state は DB 前提を持つ

EmlisAI の時間帯挨拶は `emlis_ai_greeting_state` を前提にします。  
current repo snapshot には DB 本体は入らないため、**Supabase 側のテーブル状態と repo/doc の DDL をズラさない**こと。

## 6. `input_feedback_text_templates.py` は本体ではなく fallback として扱う

今後の改善対象は template 文面の追加ではなく、  
**`emotion_submit_service.py` -> `emlis_ai_reply_service.py` の中枢**です。  
template 側だけを触って品質改善したつもりにならないこと。

# 変更テーマごとの入口

- Input / Home / 入力直後返答  
  → `04_Cocolon_変更テーマ別チェックリスト.md` の `Input / Home` と `EmlisAI immediate response`
- subscription と EmlisAI 価値差分  
  → `Account / Settings / Subscription` と `EmlisAI immediate response`
- contract / additive meta / response shape  
  → `Public API contract`
- greeting / 時間帯挨拶 / state  
  → `EmlisAI immediate response` と `05_Cocolon_ルールファイル索引.md`

# この資料群を更新する時の最低手順

コードを触ったあと、最低でも次は更新します。

1. `07_Cocolon_最新スナップショット差分.md`
2. `inventory/current_snapshot_changed_files.csv`
3. `inventory/focus_map.yaml`
4. `inventory/mashos-api_inventory_full.*`
5. `inventory/backend_route_inventory.csv`
6. `inventory/public_api_registry.csv`
7. EmlisAI の contract / DDL / test を動かしたなら `05_Cocolon_ルールファイル索引.md`

# 現時点の運用注意

今回の repo-synced snapshot では **EmlisAI 本体（service / route / subscription copy）は入っている** 一方、  
greeting-state DDL や一部 contract/test は外部 patch / 外部適用で持つ場合があります。  

したがって、将来の作業時は必ず

- repo snapshot
- Supabase schema 状態
- EmlisAI handoff 文書

をセットで確認してください。
