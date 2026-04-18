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
  mashos-api: 250
purpose: "華恋が Emlis / EmlisAI / Piece / ProfileCreate / DeepInsight / legacy key を current code に安全に写像する"
---

# 1. 目的

現状のコードは、**public UI 名**, **project 名**, **app 名**, **internal canonical 名**, **legacy response key** が層ごとに分かれています。  
今回の session では EmlisAI に加えて、**Piece / ProfileCreate / DeepInsight / mymodel_questions_total** の意味を再整理しました。  
語をそのまま文字列置換せず、**語彙ごとの層** を持って読む必要があります。

# 2. current fact

## 2-1. プロジェクト / アプリ / AI 名

- `Cocolon` = 全体プロジェクト名
- `Emlis` = ユーザー向けアプリ名 / app-facing persona
- `EmlisAI` = Input 直後返答を担う backend immediate response engine

## 2-2. Piece の current meaning

current snapshot の Piece は、**emotion-generated original reflection のみ**です。  
旧 Reflection 全体の総称としては読みません。

## 2-3. ProfileCreate の current meaning

ProfileCreate は **Account 内の孤立プロフィール資産** です。  
内部 canonical / route / storage に `MyModelCreate` が残っていても、Piece の作成元や国家システム材料としては読みません。

## 2-4. DeepInsight の current meaning

DeepInsight は **current live flow から外した legacy/orphan cleanup 対象** です。  
file や helper が残っていても、まず live route / visible flow と切り分けます。

## 2-5. Piece count key の current meaning

current visible semantics では Piece count ですが、public shape / ranking payload では  
**`mymodel_questions_total` / `questions_total`** など legacy key が残ります。  
key 名と意味を分けて扱います。

# 3. 命名 lexicon

| 語 | 現在の位置づけ | current code fact | 華恋の解釈ルール |
|---|---|---|---|
| Cocolon | project 名 | repo / 前提資料 / architecture 単位で使う | 全体プロジェクト名として扱う |
| Emlis | app-facing 名 / persona | EmlisAI の一人称 / app 体験文脈で使う | ユーザーに向き合う側の名として扱う |
| EmlisAI | backend immediate response engine | `emotion_submit_service.py` -> `emlis_ai_reply_service.py` で動く | Input 直後返答中枢として扱う |
| 入力後コメント | legacy 見え方 | `input_feedback.comment_text` public field | いまは EmlisAI reply surface として読む |
| Analysis | public UI 名 | `App.js` tab label / `MyWebScreen.js` title | `MyWeb` 領域として読む |
| MyWeb | internal canonical | route / file / API で残存 | public UI 名に戻さず、そのまま internal 名として扱う |
| Piece | public UI 名 + public 概念名 | Home 起点の preview / publish と Nexus surface に出る | 修飾なしなら原則「emotion-generated original reflection 単体仕様」。`Piece画面` は Nexus surface |
| Nexus | internal system 名 | `MyModelEntryScreen -> NexusScreen`, `lib/nexusApi.js`, `api_nexus.py` | Piece 画面全体システムを指す内部名 |
| ProfileCreate | public UI 名 | `MyModelCreateScreen`, `ProfileCreate` route, `api_mymodel_create.py` | Account-only asset として扱う |
| MyModelCreate | legacy internal canonical | file / route / storage / response 文脈に残る | 旧名として扱う。検索対象から外さない |
| MyModel | legacy 名 | route / file / API canonical に大量残存 | 旧名として扱う。新仕様の基準名にはしない |
| Reflection | backend canonical | `reflection_*`, `generated_reflection_*`, `api_mymodel_qna.py` 等に残る | visible copy では Piece に寄せるが、storage/read-side canonical として読む |
| EmotionGeneratedPiece | 華恋用補助用語 | Input 起点 `/emotion/reflection/*` flow | ProfileCreate と分けるための補助用語 |
| DeepInsight | legacy / orphan cleanup 対象 | public route registration からは外したが file / helper / data は残りうる | file 存在だけで live route と誤読しない |
| mymodel_questions_total | legacy response key | current Account / Ranking で Piece 数の key として残る | key 名と visible semantics を分けて読む |
| EmotionLog | internal 画面/API 名 | `EmotionLogScreen.js`, `/emotion-log/*`, `api_friends.py` | internal 名として使う |
| 感情通知 | public UI 名 | `EmotionLogScreen` / tutorial copy | 実装探索は EmotionLog / friends / emotion-log で行う |

# 4. 解釈ルール

## 4-1. 「Piece を変えたい」
→ **Input 起点の emotion-generated original reflection system** の変更として解釈する。  

主対象:
- `screens/InputScreen.js`
- `components/EmotionReflectionPreviewModal.js`
- `api_emotion_reflection.py`
- `reflection_publish_entitlements.py`
- `emotion_submit_service.py`
- `api_nexus.py`
- `api_mymodel_qna.py`

## 4-2. 「Piece 画面を変えたい」
→ 基本的には **Nexus read/social surface** を指す。  
create source は Home にある。  
`MyModelScreen.js` / `NexusScreen.js` / `lib/nexusApi.js` を先に開く。

## 4-3. 「ProfileCreate を変えたい」
→ **Account-only asset** の変更として解釈する。  
主対象:
- `screens/AccountScreen.js`
- `screens/MyModelCreateScreen.js`
- `api_mymodel_create.py`
- `mymodel_entitlements.py`

## 4-4. 「DeepInsight を変えたい」
→ まず **current live route なのか orphan cleanup なのか** を判定する。  
current snapshot では public route registration から外したので、基本は cleanup / archive / delete 文脈で読む。

## 4-5. 「Piece数を変えたい」
→ key rename ではなく **Piece count semantics** の変更として解釈する。  
主対象:
- `api_account_status.py`
- `astor_account_status_store.py`
- `api_ranking.py`
- `astor_ranking_kernel.py`
- `AccountScreen.js`
- `RankingTopScreen.js`
- `MyModelQuestionsRankingScreen.js`

# 5. いま絶対に守ること

1. `EmlisAI` を template comment と同一視しない  
2. `comment_text` public contract を消さない  
3. `Piece` と `ProfileCreate` を混同しない  
4. `ProfileCreate` と `EmotionGeneratedPiece` を混ぜない  
5. `DeepInsight` file 存在と live route 存在を混同しない  
6. `mymodel_questions_total` の key 名と Piece count の意味を同一視しない

# 6. current snapshot での operational conclusion

- `Emlis` は user-facing 名 / persona
- `EmlisAI` は backend immediate response engine
- `Piece` は Home 起点の emotion-generated original reflection
- `Piece画面` は Nexus read/social surface
- `ProfileCreate` は Account-only asset
- `DeepInsight` は legacy/orphan cleanup 対象
- `mymodel_questions_total` は legacy key だが visible semantics は Piece count
