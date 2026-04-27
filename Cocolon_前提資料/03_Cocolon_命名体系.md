---
doc_id: cocolon_naming_lexicon
title: "Cocolon 命名体系"
revision_date: "2026-04-27"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 116
  mashos-api: 292
purpose: "華恋が Mash の指示語と current code の語彙を安全に写像する"
---

# 1. 基本方針

現状のコードは、**表示名** と **internal canonical 名** がズレる箇所をまだ持っています。  
そのため華恋は、指示語をそのまま文字列置換せず、**表示名 / route 名 / canonical table 名 / legacy 名** の層を分けて読む必要があります。

# 2. 現在の tab / visible 名

App.js 上の current fact:

- `Input` route / tab label → `Home`
- `Analysis` route / tab label → `Analysis`
- `Piece` route / tab label → `Piece`
- `RankingTop` route / tab label → `Ranking`
- `Settings` route / tab label → `Settings`
- `Account` は各stack配下の遷移先として残る

# 3. 主要語彙の current mapping

| Mash の言い方 | current visible / route | current runtime owner | legacy / DB 側の残り方 | 使い分け |
|---|---|---|---|---|
| Home | `Input` route, `screens/InputScreen.js` | `api_emotion_submit.py`, `api_home_state.py`, `home_gateway/*`, `api_app_bootstrap.py` | visible は Home、route/screen は Input が残る | 感情入力・notice・today-question・EmotionPiece preview/publish の正面入口 |
| Analysis | `Analysis` route, `screens/Analysis*` | `api_analysis_reads.py`, `api_analysis_reports.py`, `astor_analysis_insight.py` | `api_myweb_*`, `astor_myweb_insight.py` は compat façade。DB は `myweb_reports` が実体 | レポート / analysis 読み取り面 |
| Self Structure | `screens/SelfStructure*`, `screens/AnalysisSelfStructureScreen.js` | `api_self_structure.py`, `api_self_structure_reports.py`, `astor_self_structure_*` | `api_myprofile.py`, `api_myprofile_reports_read.py`, `astor_myprofile_*` は compat façade。DB は `myprofile_*` が実体 | 自己構造 latest/history/viewer |
| Piece | `Piece` route, `screens/Piece*`, `screens/NexusScreen.js`, `screens/Resonance*` | `api_piece_runtime.py`, `api_nexus.py`, `api_emotion_piece.py`, `piece_generation_*`, `piece_generated_*` | `api_mymodel_qna.py`, `api_emotion_reflection.py`, `generated_reflection_*`, `astor_reflection_*` は compat façade。DB は `mymodel_*` が実体 | Piece library / Nexus / Resonance / generated piece |
| EmotionLog / Follow | `screens/EmotionLogScreen.js`, `screens/FollowListScreen.js` | `api_follow.py`, `api_emotion_log.py`, `api_emotion_notification_settings.py`, `astor_emotion_log_feed_*` | `api_friends.py`, `astor_friend_feed_*` は compat façade。DB は `friend_*`, `friendships`, `myprofile_links`, `follow_requests` が混在 | social timeline / follow / notification settings |
| Ranking | `screens/Ranking*`, `screens/PieceResonanceRankingScreen.js` | `api_ranking*.py`, `api_ranking_piece_views.py`, `api_ranking_piece_resonances.py`, `astor_ranking_*` | `api_ranking_mymodel_*` は compat façade。DB/RPC に `mymodel` metrics が残る | 各種ランキング read-side |
| ProfileCreate | `screens/ProfileCreateScreen.js`, `/profile-create/*`, `/account/profile-create` | `api_profile_create.py`, `profile_create_entitlements.py` | table 名や legacy canonical に `mymodel_create_*` が残る | 現在の public 名。プロフィール生成・回答資産 |
| MyModelCreate | public 名としては外れた | `ProfileCreate` current owner に吸収 | `mymodel_create_questions`, `mymodel_create_answers` など DB canonical に残る | current visible 名としては使わない |
| EmotionPiece | Home current emotion から生成される Piece | `api_emotion_piece.py`, `emotion_piece_generation_service.py`, `emotion_piece_store.py`, `EmotionPiecePreviewModal.js` | `api_emotion_reflection.py`, `emotion_reflection_*` は compat façade | Home入力直後の生成Piece preview/publish |

# 4. いま特に混同しやすいもの

## 4-1. Piece / Nexus / MyModel
- visible / RN route は `Piece`
- current screen file は `Piece*`, `Nexus*`, `Resonance*`
- backend current owner は `api_piece_runtime.py` / `api_nexus.py` / `api_emotion_piece.py`
- `MyModel` は DB physical name / legacy route / compat façade に残る

## 4-2. Analysis / MyWeb
- visible / RN route は `Analysis`
- current screen file は `Analysis*`
- backend current owner は `api_analysis_reads.py` / `api_analysis_reports.py`
- `MyWeb` は DB physical name / legacy route / compat façade に残る

## 4-3. Self Structure / MyProfile
- visible は `Self Structure`
- current owner は `api_self_structure.py` / `api_self_structure_reports.py`
- `MyProfile` は DB physical name / legacy route / compat façade に残る

## 4-4. ProfileCreate / MyModelCreate
- current public / visible 名は `ProfileCreate`
- backend table canonical や一部 legacy text には `mymodel_create_*` が残る
- public route は `/profile-create/questions` と `/profile-create/answers`

## 4-5. Home / Input
- visible は `Home`
- tab / route / screen file は `Input`
- backend では `/emotion/submit`, `/home/state`, `/input/summary`, `/global-summary` など複数 route が関わる

# 5. 命名で迷った時の原則

1. visible 名だけを見ない  
2. route 名だけを見ない  
3. table / canonical 名だけを見ない  
4. **01 の file block と 02 の file block の両方で実際のつながりを確認する**

# 2026-04-25 差分追記: current naming map

| system | current public / visible | current runtime owner | legacy compat façade | DB physical name state |
|---|---|---|---|---|
| Analysis | `Analysis*` screens / `/analysis/*` | `api_analysis_reads.py`, `api_analysis_reports.py`, `astor_analysis_insight.py`, `analysis_report_schema.json` | `api_myweb_reads.py`, `api_myweb_reports.py`, `astor_myweb_insight.py`, `myweb_report_schema.json` | `myweb_reports` が実体。`analysis_reports` は backend-readonly bridge view として作成済み。`analysis_results` は既に current physical。 |
| Self Structure | `SelfStructure*` / `/self-structure/*` | `api_self_structure.py`, `api_self_structure_reports.py`, `astor_self_structure_report.py`, `astor_self_structure_persona.py`, `self_structure_section_text_templates.py` | `api_myprofile.py`, `api_myprofile_reports_read.py`, `astor_myprofile_report.py`, `astor_myprofile_persona.py`, `myprofile_section_text_templates.py` | `myprofile_reports`, `myprofile_links`, `myprofile_requests`, `profiles.myprofile_code` が実体。`self_structure_reports` は backend-readonly bridge view として作成済み。 |
| Piece | `Piece*`, `Nexus*`, `Resonance*` / `/piece/*`, `/nexus/*` | `api_piece_runtime.py`, `api_nexus.py`, `api_emotion_piece.py`, `piece_generation_*`, `piece_generated_*`, `piece_publish_entitlements.py`, `piece_text_formatter.py` | `api_mymodel_qna.py`, `api_emotion_reflection.py`, `astor_reflection_*`, `generated_reflection_*`, `reflection_*` | `mymodel_reflections`, `mymodel_qna_*`, `mymodel_create_*` が実体。`pieces`, `piece_metrics`, `piece_reads`, `piece_view_logs`, `piece_resonance_logs`, `profile_create_questions`, `profile_create_answers` は backend-readonly bridge view として作成済み。 |
| EmotionLog / Follow | `EmotionLog`, `Follow` / `/emotion-log/*`, `/follow/*` | `api_follow.py`, `api_emotion_log.py`, `api_emotion_notification_settings.py`, `astor_emotion_log_feed_*` | `api_friends.py`, `astor_friend_feed_*` | `friend_*`, `friendships`, `myprofile_links`, `follow_requests` が混在。`emotion_log_feed`, `emotion_log_feed_summaries`, `emotion_notification_settings` は backend-readonly bridge view として作成済み。request/link family は単純rename不可。 |
| ProfileCreate | `ProfileCreate` / `/profile-create/*` | `api_profile_create.py`, `profile_create_entitlements.py` | `mymodel_entitlements.py` | `mymodel_create_questions`, `mymodel_create_answers` が実体。read-only current bridge view は `profile_create_questions`, `profile_create_answers`。 |

原則: current owner が実行本体、legacy file は compat façade、DB physical name は `08` の分類に従って別段階で扱います。


# 2026-04-26 差分追記: DB current bridge view / API read-only 命名境界

DB physical name は旧名のままですが、API read-only 移行のため current-name bridge view が作成済みです。命名判断では次の層を混同しません。

| phase | current bridge view | old physical source | rows / count | DB state |
|---|---|---|---:|---|
| low | `emotion_notification_settings` | `friend_notification_settings` | 1 | `security_invoker=true`, backend-readonly |
| low | `profile_create_questions` | `mymodel_create_questions` | 20 | `security_invoker=true`, backend-readonly |
| low | `profile_create_answers` | `mymodel_create_answers` | 21 | `security_invoker=true`, backend-readonly |
| low | `piece_metrics` | `mymodel_qna_metrics` | 15 | `security_invoker=true`, backend-readonly |
| low | `piece_reads` | `mymodel_qna_reads` | 35 | `security_invoker=true`, backend-readonly |
| low | `piece_view_logs` | `mymodel_qna_view_logs` | 26 | `security_invoker=true`, backend-readonly |
| low | `piece_resonance_logs` | `mymodel_qna_resonance_logs` | 5 | `security_invoker=true`, backend-readonly |
| medium | `analysis_reports` | `myweb_reports` | 486 | `security_invoker=true`, backend-readonly |
| medium | `self_structure_reports` | `myprofile_reports` | 10 | `security_invoker=true`, backend-readonly |
| medium | `emotion_log_feed` | `friend_emotion_feed` | 3211 | `security_invoker=true`, backend-readonly |
| medium | `emotion_log_feed_summaries` | `friend_feed_summaries` | 1288 | `security_invoker=true`, backend-readonly |
| high | `pieces` | `mymodel_reflections` | 1695 | `security_invoker=true`, backend-readonly |


API側の原則:

- `*_READ_TABLE` / read専用env は current bridge view を指してよい
- write / update / delete / upsert / insert 用 env は旧物理 table のまま
- `pieces` / `analysis_reports` / `self_structure_reports` など current名 view が存在しても、DB physical rename が完了したわけではない
- JSON payload / scalar vocabulary には旧語彙が残るため、semantic rewrite や contract retirement は別工程

代表 env 境界:

| env | value | 用途 |
|---|---|---|
| `COCOLON_PIECES_READ_TABLE` | `pieces` | Piece library read-only |
| `MYMODEL_REFLECTIONS_READ_TABLE` | `pieces` | backward-compatible read env |
| `MYMODEL_REFLECTIONS_TABLE` | `mymodel_reflections` | write/update/delete |
| `COCOLON_ANALYSIS_REPORTS_READ_TABLE` | `analysis_reports` | Analysis read-only |
| `COCOLON_SELF_STRUCTURE_REPORTS_READ_TABLE` | `self_structure_reports` | Self Structure read-only |
| `COCOLON_EMOTION_LOG_FEED_READ_TABLE` | `emotion_log_feed` | EmotionLog feed read-only |
| `COCOLON_EMOTION_LOG_FEED_SUMMARIES_READ_TABLE` | `emotion_log_feed_summaries` | EmotionLog summary read-only |


# 2026-04-27 差分追記: friends alias / current route naming

public contract registry 上では、次の legacy `/friends/*` alias を deprecated とし、current route replacement を明示しました。これは route handler 削除ではなく、contract上の retirement boundary 整理です。

| legacy alias | current replacement |
|---|---|
| `/friends/request` | `/follow/request` |
| `/friends/requests/{request_id}/accept` | `/follow/requests/{request_id}/accept` |
| `/friends/requests/{request_id}/reject` | `/follow/requests/{request_id}/reject` |
| `/friends/requests/{request_id}/cancel` | `/follow/requests/{request_id}/cancel` |
| `/friends/remove` | `/follow/remove` |
| `/friends/notification-settings` | `/emotion-notifications/settings` |
| `/friends/notification-settings/{friend_user_id}` | `/emotion-notifications/settings/{friend_user_id}` |

current route として registry に明示追加されたもの:

- `/account/profile-create`
- `/emotion-log/feed`
- `/emotion-log/unread-status`
- `/emotion-log/unread/read-feed`
- `/emotion-notifications/settings`
- `/emotion-notifications/settings/{friend_user_id}`
- `/nexus/emotion-log`
- `/nexus/emotion-ranking`

命名判断では、visible/current route は `Follow` / `EmotionLog` / `EmotionNotification` / `Nexus` 側を正とし、`Friends` は互換aliasとして読む。
