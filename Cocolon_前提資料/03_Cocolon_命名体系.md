---
doc_id: cocolon_naming_lexicon
title: "Cocolon 命名体系"
revision_date: "2026-05-05"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 123
  mashos-api: 329
purpose: "華恋が Mash の指示語と current code の語彙を安全に写像する"
---

# 1. 基本方針

現状のコードは、**表示名** と **internal canonical 名** がズレる箇所をまだ持っています。  
そのため華恋は、指示語をそのまま文字列置換せず、**表示名 / route 名 / canonical table 名 / legacy 名** の層を分けて読む必要があります。

# 1-2. 前提資料での名称混在保管方針

この資料は、名称混在を「直すべきタスク」として記録するものではありません。  
華恋が作業時に、visible名・route名・runtime owner・DB physical nameを取り違えないための辞書です。

- 資料で保管できる旧名称は、無理にrenameしない。
- 稼働、public API、DB write path、account delete、access policyに影響する場合だけ修正対象にする。
- API接続先の正本は `Cocolon/lib/apiClient.js` の `API_BASE_URL`。
- `App.js` は旧 `EXPO_PUBLIC_MYMODEL_API_URL` を直接読まない。
- `/app/bootstrap` の runtime state は `Cocolon/AppRuntimeContext.js` が正本。

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
| App runtime | `/app/bootstrap` runtime | `AppRuntimeContext.js`, `App.js`, `api_app_bootstrap.py` | feature flag名はbackend env / API payload由来で混在する | 起動時のversion gate / maintenance / feature flag制御 |
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

# 2026-04-28 差分追記: 三大中核構造の語彙固定

今後、Mash様が **三大中核構造** と呼ぶ場合、前提資料上では次の3つを指す。

| 指示語 | current structure name | 主owner / gate | 備考 |
|---|---|---|---|
| 三大中核構造の1つ目 | `EmlisAI構造` | `emlis_ai_reply_service.py`, `emlis_ai_quality_gate.py` | 感情入力直後の即時理解応答。`input_feedback.comment_text` は破壊しない |
| 三大中核構造の2つ目 | `分析構造` | `api_analysis_reports.py`, `api_self_structure.py`, `analysis_report_validity_gate.py` | 感情分析・自己構造分析の本人向け観測成果物 |
| 三大中核構造の3つ目 | `Piece構造` | `api_emotion_piece.py`, `piece_generation_policy.py`, `emotion_piece_store.py` | 感情入力から公開可能なPieceをpreview / confirm / publishする構造 |

旧表現の `Piece生成機構` は、`Piece構造` のうち生成・preview・publish工程を指す。  
旧表現の `EmlisAI` は、構造名として記載する時は `EmlisAI構造` と読む。  
`分析構造` は名称変更なしだが、今回から `analysis_capability.py` と `analysis_report_validity_gate.py` を中核境界として読む。


# 2026-04-29 差分追記: 名称混在は「稼働影響」で分類する

今回から、名称混在は次の3分類で扱う。

| 分類 | 具体例 | 対応 |
|---|---|---|
| 稼働に必要な互換 | legacy route handler、deprecated public contract、旧DB physical write path、compat import alias | 消さない。資料に保管する。削除条件を満たすまで保持する |
| 表示名と内部名のズレ | `Home` visible と `Input` route、`Analysis` visible と `myweb_reports` physical、`Self Structure` visible と `myprofile_reports` physical | 無理にrenameしない。華恋は visible / route / runtime owner / DB physical name を分けて読む |
| 稼働・契約・安全に影響するズレ | RN caller が legacy endpoint を直接叩く、public registry が実routeとずれる、write path が current bridge view に誤って向く、account delete 対象から漏れる | 修正対象にする |

2026-04-29 のローカル確認では、非Piece領域について、即時コード修正が必要な legacy endpoint caller は検出されていない。  
そのため、非Pieceの名称混在はまず資料保管で扱う。

## 2026-04-29 時点の非Piece名称混在の扱い

| 領域 | current visible / public | 残る旧語彙 | 2026-04-29 対応 |
|---|---|---|---|
| Home | `Home` | RN route / screen は `Input` | 保管。変更しない |
| Analysis | `/analysis/*`, `Analysis*` screens | DB physical `myweb_reports`、compat route `/myweb/*` | 保管。`/myweb/*` は deprecated contract として保持 |
| Self Structure | `/self-structure/*` | DB physical `myprofile_reports`、compat route `/myprofile/*` | 保管。`/myprofile/*` は deprecated contract として保持 |
| EmotionLog / Follow | `/emotion-log/*`, `/follow/*` | DB physical `friend_*`、compat route `/friends/*` | 保管。`/friends/*` は deprecated contract として保持 |
| ProfileCreate | `/profile-create/*`, `/account/profile-create` | DB physical `mymodel_create_*` | 保管。ProfileCreate visible名を正とする |
| Subscription | `/subscription/*` | 名称混在は主要論点ではない | release gate / store確認へ回す |
| Account delete | `/account/delete` | 削除対象DBの旧物理名 | 名称変更ではなく削除対象確認として扱う |

Pieceに属する `mymodel_reflections` / `mymodel_qna_*` / `reflection_text` / `/mymodel/qna/*` / `/emotion/reflection/*` は、今回の作業では後回しにする。  
ただし `/mymodel/qna/*` と `/emotion/reflection/*` の public contract は、今回の zip 上では deprecated として保管されている。
