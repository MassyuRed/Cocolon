---
doc_id: cocolon_naming_lexicon
title: "Cocolon 命名体系"
revision_date: "2026-04-19"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 140
  mashos-api: 265
purpose: "華恋が Mash の指示語と current code の語彙を安全に写像する"
---

# 1. 基本方針

現状のコードは、**表示名** と **internal canonical 名** がズレる箇所をまだ持っています。  
そのため華恋は、指示語をそのまま文字列置換せず、**表示名 / route 名 / canonical table 名 / legacy 名** の層を分けて読む必要があります。

# 2. 現在の tab / visible 名

App.js 上の current fact:

- `Input` tab label → `Home`
- `MyWeb` tab label → `Analysis`
- `MyModel` / `MyProfile` tab label → `Piece`
- `RankingTop` tab label → `Ranking`
- `Account` tab label → `Account`

# 3. 主要語彙の current mapping

| Mash の言い方 | current visible / route | canonical / backend 側の残り方 | 使い分け |
|---|---|---|---|
| Home | `Input` tab, `screens/InputScreen.js` | `api_emotion_submit.py`, `api_home_state.py`, `home_gateway/*` | 感情入力・notice・today-question・reflection preview/publish の正面入口 |
| Analysis | `MyWeb` tab, `screens/MyWeb*` | `api_myweb_*`, `astor_myweb_*` | レポート / analysis 読み取り面 |
| Self Structure | `screens/SelfStructure*`, `screens/MyWebSelfStructureScreen.js` | `api_myprofile.py`, `api_myprofile_reports_read.py`, `astor_myprofile_*` | 自己構造 latest/history/viewer |
| Piece | `MyModel` / `MyProfile` visible, `screens/MyModel*`, `screens/NexusScreen.js` | `api_mymodel_qna.py`, `generated_reflection_*`, `astor_reflection_*` | reflection / qna / discovery / resonance |
| EmotionLog | `screens/EmotionLogScreen.js` | `api_friends.py`, `astor_friend_feed_*` | social timeline / follow |
| Ranking | `screens/Ranking*` | `api_ranking*.py`, `astor_ranking_*` | 各種ランキング read-side |
| ProfileCreate | `screens/ProfileCreateScreen.js`, `/profile-create/*`, `/account/profile-create` | table 名や legacy canonical に `mymodel_create_*` が残る | 現在の public 名。国家システム外のプロフィール資産 |
| MyModelCreate | public 名としては外れた | `mymodel_create_questions`, `mymodel_create_answers` など canonical table 名や一部説明文に残る | current visible 名としては使わない |
| EmotionGeneratedPiece | Home current emotion から生成される Piece | `api_emotion_reflection.py`, `emotion_reflection_store.py` | 華恋用補助語。official route 名ではない |

# 4. いま特に混同しやすいもの

## 4-1. Piece / Nexus / MyModel
- visible では `Piece`
- screen file 名には `MyModel*` と `Nexus*` が混在
- backend read/write は `api_mymodel_qna.py` と reflection runtime に残る

## 4-2. ProfileCreate / MyModelCreate
- current public / visible 名は `ProfileCreate`
- backend table canonical や 일부 legacy text には `mymodel_create_*` が残る
- public route は `/profile-create/questions` と `/profile-create/answers`

## 4-3. Home / Input
- visible は `Home`
- tab / route / screen file は `Input`
- backend では `/emotion/submit`, `/home/state`, `/input/summary`, `/global-summary` など複数 route が関わる

# 5. 命名で迷った時の原則

1. visible 名だけを見ない  
2. route 名だけを見ない  
3. table / canonical 名だけを見ない  
4. **01 の file block と 02 の file block の両方で実際のつながりを確認する**
