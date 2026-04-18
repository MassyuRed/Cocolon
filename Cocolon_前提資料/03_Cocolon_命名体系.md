---
doc_id: cocolon_naming_lexicon
title: "Cocolon 命名体系"
revision_date: "2026-04-18"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 133
  mashos-api: 247
purpose: "華恋が Emlis / EmlisAI / Piece / Analysis を current code に安全に写像する"
---

# 1. 目的

現状のコードは、**public UI 名**, **project 名**, **app 名**, **internal canonical 名** が層ごとに分かれています。  
今回さらに **Emlis / EmlisAI** が入ったため、語をそのまま文字列置換せず、**語彙ごとの層** を持って読む必要があります。

# 2. current fact

## 2-1. プロジェクト / アプリ / AI 名

- `Cocolon` = 全体プロジェクト名
- `Emlis` = ユーザー向けアプリ名 / app-facing persona
- `EmlisAI` = Input 直後返答を担う backend immediate response engine

## 2-2. Input 直後返答の public surface

current surface は新しい endpoint ではなく、既存の `input_feedback.comment_text` です。  
つまり、visible copy では「入力後コメント」に見えていても、内部 canonical は **EmlisAI immediate response** になっています。

## 2-3. subscription 文言

current Cocolon では `lib/iap/iapRuntimeCatalog.js` が Plus / Premium feature copy を normalize しており、  
EmlisAI の visible copy もここに入っています。  

つまり、EmlisAI は backend engine でありながら、課金文言では public feature としても存在します。

# 3. 命名 lexicon

| 語 | 現在の位置づけ | current code fact | 華恋の解釈ルール |
|---|---|---|---|
| Cocolon | project 名 | repo / 前提資料 / architecture 単位で使う | 全体プロジェクト名として扱う |
| Emlis | app-facing 名 / persona | EmlisAI の一人称 / app 体験文脈で使う | ユーザーに向き合う側の名として扱う |
| EmlisAI | backend immediate response engine | `emotion_submit_service.py` -> `emlis_ai_reply_service.py` で動く | Input 直後返答中枢として扱う |
| 入力後コメント | legacy 見え方 | `input_feedback.comment_text` public field | いまは EmlisAI reply surface として読む |
| Analysis | public UI 名 | `App.js` tab label / `MyWebScreen.js` title | `MyWeb` 領域として読む |
| MyWeb | internal canonical | route / file / API で残存 | public UI 名に戻さず、そのまま internal 名として扱う |
| Piece | public UI 名 + public 概念名 | `App.js` / `NexusScreen.js` / guides / Input copy に出る | 修飾なしなら原則「Piece単体」。`Piece画面` は Nexus surface |
| Nexus | internal system 名 | `MyModelEntryScreen -> NexusScreen`, `lib/nexusApi.js`, `api_nexus.py` | Piece 画面全体システムを指す内部名 |
| ProfileCreate | public UI 名 | `MyModelCreateScreen`, `/account/profile-create` | 固定プロフィール資産 |
| MyModel | legacy 名 | route / file / API canonical に大量残存 | 旧名として扱う。検索対象から外さない |
| Reflection | backend canonical | `reflection_*`, `generated_reflection_*`, `api_mymodel_qna.py` 等に残る | visible copy では Piece に寄せるが、storage/read-side canonical として読む |
| EmotionGeneratedPiece | 華恋用補助用語 | Input 起点 `/emotion/reflection/*` flow | ProfileCreate と分けるための補助用語 |
| EmotionLog | internal 画面/API 名 | `EmotionLogScreen.js`, `/emotion-log/*`, `api_friends.py` | internal 名として使う |
| 感情通知 | public UI 名 | `EmotionLogScreen` / tutorial copy | 実装探索は EmotionLog / friends / emotion-log で行う |

# 4. EmlisAI 関連の解釈ルール

## 4-1. 「EmlisAI を変えたい」
→ **server-owned immediate response system** の変更として解釈する。  

主対象:
- `emotion_submit_service.py`
- `api_emotion_submit.py`
- `api_emotion_reflection.py`
- `emlis_ai_*`
- `emotion_history_search_service.py`
- `api_subscription.py`
- `subscription_bootstrap_store.py`
- `lib/iap/iapRuntimeCatalog.js`

## 4-2. 「入力後コメントを変えたい」
→ 基本的には **EmlisAI** を指す。  
template 文面だけを触る話ではない。  
最初に `emotion_submit_service.py` を開く。

## 4-3. 「Emlis の話し方を変えたい」
→ voice/prompt/style の変更として解釈する。  
主対象:
- `emlis_ai_style_profile_service.py`
- `emlis_ai_reply_service.py`
- `emlis_ai_prompt.py`

## 4-4. 「Emlis が覚えていることを変えたい」
→ history retrieval / continuity の変更として解釈する。  
主対象:
- `emlis_ai_capability.py`
- `emlis_ai_context_service.py`
- `emotion_history_search_service.py`
- `api_input_summary.py`
- `api_myweb_reads.py`
- `today_question_store.py`

## 4-5. 「Plus / Premium の EmlisAI 差分を変えたい」
→ product copy と runtime capability の両方を見る。  
主対象:
- `api_subscription.py`
- `subscription_bootstrap_store.py`
- `lib/iap/iapRuntimeCatalog.js`
- `emlis_ai_capability.py`

# 5. いま絶対に守ること

1. `EmlisAI` を単なる template comment と同一視しない  
2. `comment_text` public contract を消さない  
3. `Emlis`（app-facing persona）と `EmlisAI`（engine）を混同しない  
4. `Piece` / `Nexus` / `MyModel` の既存語彙を潰さない  
5. `ProfileCreate` と `EmotionGeneratedPiece` を混ぜない  

# 6. current snapshot での operational conclusion

- `Emlis` は user-facing 名 / persona
- `EmlisAI` は backend immediate response engine
- `input_feedback.comment_text` は public contract
- `input_feedback.emlis_ai` は additive meta
- `Analysis` は UI 名
- `MyWeb` は internal canonical
- `Piece` は UI 名 / public concept
- `Nexus` は internal system 名
