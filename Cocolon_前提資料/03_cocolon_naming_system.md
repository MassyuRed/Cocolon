---
doc_id: cocolon_naming_lexicon
title: "Cocolon 命名体系"
revision_date: "2026-06-04"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
source_snapshot:
  premise: "Cocolon_前提資料(173).zip"
  Cocolon: "Cocolon_9(17).zip"
  mashos-api: "mashos-api_9(27).zip"
file_counts:
  Cocolon: 217
  mashos-api: 797
  total: 1014
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
| わたしマップ / Self Structure | visible は `わたしマップ`、file/route は `screens/SelfStructure*`, `screens/AnalysisSelfStructureScreen.js` | `api_self_structure.py`, `api_self_structure_reports.py`, `astor_self_structure_*`, `watashi_map_service.py` | `api_myprofile.py`, `api_myprofile_reports_read.py`, `astor_myprofile_*` は compat façade。DB は `myprofile_*` が実体 | 場面ごとの役割と行動パターン。latest/history/viewer の内部名は維持 |
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
- visible はユーザー向けには `わたしマップ`。`Self Structure` は internal / file / route 系の保管名として残る
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


# 2026-05-07 差分追記: value observation語彙の扱い

`value observation` は、三大中核構造に並ぶ4つ目の中核ではありません。EmlisAI構造・分析構造・Piece構造が共有する **観測信号 layer** として読む。

| 語彙 | 読み方 | 主owner |
|---|---|---|
| `ValueObservationSignal` | 現在入力から抽出した、source-groundedな価値観測信号 | `value_observation_types.py` |
| `ValueObservationPlan` | signalをどの程度保持するか、過圧縮リスクがあるかを示すplan | `value_observation_types.py` |
| `cocolon_value_observation_service` | 5 signalを汎用ruleで抽出するservice。例文固定返答ではない | `cocolon_value_observation_service.py` |
| `overcompression_risk` | Pieceや長文入力で、言いたい核を短く潰すリスク | `piece_generation_policy.py`, `emotion_piece_generation_service.py` |

命名変更・DB renameではないため、DB physical tableやroute名は変更しない。


# 2026-05-09 差分追記: 今日の問いpersonal naming boundary

| 表示・概念名 | runtime / DB / contract名 | 読み分け |
|---|---|---|
| 既存100問テンプレ | `static_role_probe` | 全ユーザー向けの基礎問い。`today_question_bank` / `today_question_sequence` / `today_question_user_progress` と接続 |
| パーソナル深掘り問い | `personal_followup` | Premium向け追加層。元入力の短い原文アンカーに対して選択式で答える |
| 原文アンカー | `source_anchor` / `source_anchor_snapshot_json` | ユーザー入力に実在する短いliteral text。AI要約をユーザー発言として扱わない |
| personal候補 | `today_question_personal_candidates` | 元入力から抽出された候補。score/status/source_hashを持つ |
| personal問い | `today_question_personal_questions` | 表示可能な質問実体。question_text/choices/source_anchorをsnapshot保存する |
| personal回答 | `today_question_answers.personal_question_id` | 既存answer tableのadditive fieldで保存する |
| DB境界資料 | `08_cocolon_db_rename_boundary.md` | この版では存在する。DB physical name/bridge/rename境界の正本として読む |

# 2026-05-09 差分追記: entry shell / subdirectory 命名境界

RN巨大画面分割後も、Mash様が画面名を指示する時の正本は既存のentry shellです。subdirectory名は内部ownerであり、visible名・route名を置き換えるものではありません。

| 指示語 / visible | entry shell | 分割後internal owner | 読み方 |
|---|---|---|---|
| Home / Input | `screens/InputScreen.js` | `screens/input/*` | routeはInput、visibleはHome。subdirは入力画面内部の責務分割 |
| Analysis | `screens/AnalysisScreen.js` / `screens/AnalysisReportViewerScreen.js` | `screens/analysis/*`, `screens/analysisReport/*` | Analysis routeとreport viewer entryを維持 |
| Piece / Nexus | `screens/PieceScreen.js` / `screens/NexusScreen.js` | `screens/piece/*`, `screens/nexus/*` | Piece route / Nexus surfaceを維持。Nexus語彙はPiece内部surfaceとして読む |
| Account | `screens/AccountScreen.js` | `screens/account/*` | Account routeを維持。account delete ownerはSettingsOtherScreen |
| App root | `App.js` | `navigation/*`, `runtime/*`, `components/GlobalFrameLayout.js` | App.jsはprovider / NavigationContainer entry shell。route名は変更しない |

この分割は名称変更ではないため、`MyWeb` / `MyModel` / DB physical name / legacy façadeの扱いは既存の命名混在方針を優先する。

# 2026-05-09 差分追記: 「Emlisの観測」visible名と内部契約名

入力直後に出るEmlisAI本文のユーザー表示名は `Emlisの観測` として読む。旧visible名の `Emlisからの返答` / `Emlisからの応答` / `Emlisの返答` は、画面表示上は使わない。

| Mash様の言い方 | current visible / route | current runtime owner | legacy / DB側の残り方 | 使い分け |
|---|---|---|---|---|
| Emlisの観測 | `InputFeedbackReplyModal.js` のタイトル / 入力直後モーダル | `emlis_ai_reply_service.py` + multi-perspective service群 + `useInputFeedbackModal.js` | API契約は `input_feedback.comment_text` / `input_feedback.emlis_ai` を維持。`comment_text` はvisible名ではなく互換payload名 | visible名だけ変更する。API/DB keyを一括renameしない。`observation_status=passed` の時だけ表示する |

呼称は `display_name` から作る。観測本文で `あなたは` / `あなたの` / `あなたが` / `あなたに` を通常経路で出さない方針を維持する。

# 2026-05-10 差分追記: Phase8 LimitedComposer語彙は表示名変更ではない

`LimitedComposer`、`EmlisPhraseUnit`、`ObservationProfile`、`SentencePlan`、`LimitedSentenceQualityGuard` は、`Emlisの観測` の内部品質層です。ユーザー表示名や public API 名ではありません。

| 内部語彙 | current owner | 読み方 |
|---|---|---|
| `LimitedComposer` | `emlis_ai_limited_composer_client.py` | B案の自作限定Composer。外部AIではなく、scoped graph内の根拠から本文候補を作る |
| `EmlisPhraseUnit` | `emlis_ai_limited_composer_client.py` | EvidenceSpanから本文化できる短い根拠句を作る内部単位 |
| `ObservationProfile` | `emlis_ai_limited_composer_client.py` / `emlis_ai_limited_sentence_quality_guard.py` | 入力構造型。例: `mixed_positive_anxiety`, `relationship_approach_avoidance`, `reality_escape_tension` |
| `SentencePlan` | `emlis_ai_limited_composer_client.py` | 完成文ではなく、どの根拠句をどの関係で1文にするかの内部計画 |
| `LimitedSentenceQualityGuard` | `emlis_ai_limited_sentence_quality_guard.py` | 日本語破綻・感情ラベル単独行・汎用接続語尾を落とすGuard |

これらは内部構造名であり、`input_feedback.comment_text` / `input_feedback.emlis_ai` / `observation_status` の互換payload名は変更しない。表示名は引き続き `Emlisの観測` と読む。


# 2026-05-11 差分追記: 共通文章生成基盤の名称境界

`cocolon_text_generation_core` / `CocolonTextGenerationCore` は、三大中核の共通品質基盤名です。visible名・public route名・DB physical nameではありません。

| 名称 | 分類 | 変更していないもの |
|---|---|---|
| `CocolonTextGenerationCore` | 共通品質基盤 / package概念名 | Emlis / Piece / Analysis のvisible名ではない |
| `EmlisObservationComposer` | Emlis専用adapter | `Emlisの観測`, `input_feedback.comment_text`, `observation_status` |
| `PieceComposer` | Piece専用adapter | `piece_text`, `reflection`, `mymodel_qna`, preview/publish route |
| `AnalysisComposer` | Analysis専用adapter | `content_json`, `standardReport`, `contentText`, Analysis report route |

旧名称が残る `reflection` / `mymodel_qna` / `mymodel_reflections` は互換・DB境界として扱い、共通Core接続を理由にrenameしない。

# 2026-05-12 差分追記: こころ天気 naming boundary

| 表示・概念名 | runtime / payload名 | 読み分け |
|---|---|---|
| 今のこころ天気 | `current_weather` | `/analysis/home-summary` に追加された本人向けの今日0:00〜現在の観測summary。未来予報ではない |
| こころ天気（日） | `report_type="daily"` | 日単位レポートのvisible名。内部キー `daily` は維持する |
| こころ天気（週） | `report_type="weekly"` | 週単位レポートのvisible名。内部キー `weekly` は維持する |
| こころ天気（月） | `report_type="monthly"` | 月単位レポートのvisible名。内部キー `monthly` は維持する |
| レポートこころ天気 | `content_json.kokoroWeather` | 日/週/月レポートの天気図風UI用payload。正式表示対象の必須payloadとして読む |
| こころ温度 | `temperature.display`, `temperature_high`, `temperature_low` | 感情の良し悪しではなく、熱量・動きの強さを表示する値。表示は `20.3°` で、`℃` は使わない |
| 観測メモあり | `observation_memo` | 注意報ではなく、過去〜現在の揺れ幅・切り替わり・混在が大きかったことを示す観測ラベル |

こころ天気はAnalysisの感情分析側のvisible / presentation layerです。Self Structure / 自己分析のvisible名、DB physical name、public API route、`daily` / `weekly` / `monthly` 内部値はrenameしません。

# 2026-05-13 差分追記: こころ天気正式表示対象の命名境界

`こころ天気` への完全移行では、旧感情分析レポートを「別名で表示する」のではなく、payload成立条件で正式表示対象を判定します。

| 名称 / key | 分類 | 読み方 |
|---|---|---|
| `KOKORO_WEATHER_SCHEMA_VERSION` | backend定数 | 値は `kokoro.weather.v1`。ready / detail / unread の表示対象判定に使う |
| `isKokoroWeatherReportRecord` | frontend判定関数 | report recordがこころ天気として表示可能か判定する。旧本文表示のfallback条件ではない |
| `kokoro_weather_version` / `kokoro_weather_legacy_version` / `standard_kokoro_weather_version` / `standard_report_kokoro_weather_version` | projection alias | content_json全体を持たないready/unread projection rowの表示対象判定用alias |
| `cocolon:kokoroWeatherLatestReport:v1` | frontend cache namespace | 新しいlatest report cache。旧 `cocolon:analysisLatestReport` は通常readしない |
| `Kokoro weather report not found` | API error detail | 旧感情分析レポートや不成立payloadをdetail / weekly-daysで表示しない時の404 detail |

禁止: `kokoroWeather` 判定を理由に、DB physical name、`myweb_reports`、`analysis_reports` bridge、`/analysis/*` route、`daily` / `weekly` / `monthly` 内部値をrenameしない。

## 2026-05-13 差分追記: わたしマップ命名境界

Self Structure / MyProfile 系の visible 名は、ユーザー向けには `わたしマップ` へ寄せる。内部名は維持する。

| 層 | current name | 維持する旧名 / 境界 |
|---|---|---|
| ユーザー向けタブ / 見出し | `わたしマップ` | 旧 `自己分析` はガイド補助・内部説明だけで使う。 |
| 最新概要 | `今のわたしマップ` | `SelfStructureReportGenerateScreen.js` は file名維持。 |
| 中核カード | `役割スイッチ` | type分類ではなく、場面ごとの役割。 |
| 行動パターン | `よく通るルート` | 役割が入った後の選択傾向。 |
| ズレ | `迷いやすい分かれ道` | 自己認識 / 実際 / 理想のズレ。 |
| 詳細本文 | `詳しい自己分析レポート` | content_text / standardReport / deepReport は互換維持。 |
| API route | `/self-structure/*` | public route rename 禁止。 |
| DB physical | `myprofile_reports` | physical rename 禁止。 |
| payload | `content_json.watashiMap` | additive。`selfStructureDeepVisual` は fallback として残す。 |
| mode | `light / standard / deep(structural)` | Free=light、Plus=standard、Premium=deep/structural。 |

こころ天気は感情分析の visible / presentation layer であり、わたしマップは自己分析の visible / presentation layer である。両者を混ぜない。

# 2026-05-15 差分追記: EmlisAI A案到達 Step15〜20 内部名称境界

最新実ファイルで増えた Step15〜20 の名称は、visible名・public route名・DB physical nameではなく、EmlisAI内部のdeveloper / QA / rollout meta名として読む。

| 名称 | 種別 | 読み方 |
|---|---|---|
| `step15_common_core_stabilization` | meta key / Step label | 共通Core安定化結果。Emlisの出力目的を共通Coreへ移す意味ではない |
| `emlis.step16_rollout_metrics.v1` | metrics version | 段階リリース計測の内部version。ユーザー表示名ではない |
| `A-P0` / `step18_ap0_migration_decision` | migration decision | A-1へ進むか、未達Stepへ戻すかの内部判定 |
| `cocolon_emlis_observation_composer.a1.v1` | internal composer model | A案相当Composer model。`Emlisの観測` のvisible名やAPI keyへrenameしない |
| `a2_long_term_quality` / `step20_long_term_quality` | QA meta | 長期品質確認。履歴からユーザーの本心を補完する意味ではない |

`input_feedback.comment_text`、`input_feedback.emlis_ai`、`observation_status`、表示名 `Emlisの観測` は互換名として維持する。

# 2026-05-15 差分追記: 限定Composer / 完全Composer / 完全Composer商品品質版 名称境界

旧来の案名は会話・設計資料上では使わず、現行作業では次の名称で読む。ただし、既存コード内の歴史的なmodel名やtest名を一括renameしない。

| 操作用語 | 実装上の読み方 | rename禁止境界 |
|---|---|---|
| 限定Composer | 現在の自作Composer土台。Evidence / scope / Guard / fail-closedを優先し、今回 Step0-11 で診断・binding・relation・surface・scorecardを拡張した。 | `input_feedback.comment_text`、public route、DB physical nameへrenameしない。 |
| 限定Composer拡張 | 完全Composer初期版へ進む前の足場。SentenceBinding、relation taxonomy、binding-aware Grounding、Gate binding trace、scorecard、E2E表示契約を含む。 | 完全Composerそのものと混同しない。 |
| 完全Composer | 広い通常入力で、根拠を保持したまま自然なEmlisの観測を自作生成する目標構造。 | 外部AIレンタルやローカルLLMの別名ではない。 |
| 完全Composer商品品質版 | 表示到達率・読まれた感・根拠保持・安全性・非テンプレ性を商品品質として満たす最終到達ランク。 | `90%+` は評価基準であり、ファイル名・route名・DB名ではない。 |
| `cocolon_emlis_observation_composer.a1.v1` | 旧資料に残る内部composer model名。 | visible名やpublic response keyへrenameしない。 |

作業時は、旧 `A案` / `B案` を見つけても実ファイルを即renameしない。設計上の読み替えとして、`B案` は限定Composer、`A案相当` は完全Composerへ向かう段階promotionまたは旧内部model名として保管する。

# 2026-05-16 差分追記: 完全Composer初期版の呼称meta境界

最新実ファイルでは、旧 `a_plan_equivalent` / `A-1` 系の物理名・test名を即renameせず、資料・会話・meta上では `完全Composer初期版` として読み替える方針が追加されている。

| 表示・設計上の名前 | 既存実装で見える名前 | 扱い |
|---|---|---|
| 限定Composer | `limited_composer`, `cocolon_limited_composer.v1` | 完全Composer初期版の土台。破棄しない。 |
| 完全Composer初期版 | `a_plan_equivalent`, `A-1`, `complete_initial`, `complete_composer_initial`, `cocolon_emlis_observation_composer.a1.v1` | 内部Composer実装の呼称。DB/API/RN visible名ではない。 |
| 完全Composer商品品質版 | `Product Gate`, `M7`, `High Quality` | 今回の到達点ではない。scorecard上の将来基準。 |
| Emlisの観測 | frontend visible title | ユーザー表示名。Complete Composer初期版になっても変更しない。 |

禁止: `complete_composer_initial`、`a_plan_equivalent`、`A-1`、`cocolon_emlis_observation_composer.a1.v1` を理由に、`input_feedback.comment_text`、`emlis_ai` meta、DB physical name、public route、RN visible名を一括renameしない。

# 2026-05-16 差分追記: 商品品質版接続 Step0-7 名称境界

最新実ファイルでは、完全Composer初期版の上に商品品質版接続用の内部名が追加されています。これらは visible名、public route、DB physical name、response keyではありません。

| 名称 | 見える場所 | 読み方 | rename判断 |
|---|---|---|---|
| `emlis.gate_binding_contract.v2` | Gate diagnostic / Display trace | binding_used契約整理のversion | public response keyへ昇格しない |
| `ProductQualityConnection.Step6` / `Step6_Scorecard_Blind_QA` | product quality scorecard meta | Product Gate判断材料のscorecard段階 | 商品品質版到達宣言ではない |
| `Step7_Release_ladder_connection` | release ladder meta | internal / limited / broader_beta / product_gateの判定meta | rollout実行やpublic release適用ではない |
| `complete_product_quality_scorecard` | diagnostic_summary / meta | machine metrics と Blind QA の集約 | `comment_text` ではない |
| `complete_product_quality_release_ladder` | diagnostic_summary / meta | release ladder guard / criteria | RN表示条件ではない |
| `TonePolicy` / `ToneGuardReport` | `emlis_ai_complete_tone_policy.py` | Surface前のtone制約・検出report | Emlis visible名へrenameしない |
| `desire_fear` | coverage_group | `approach_avoidance` relationを商品品質版coverageとして読むcurrent名 | DB/API名ではない |

禁止: 商品品質版接続を理由に、`Emlisの観測`、`input_feedback.comment_text`、public route、DB physical name、RN modal条件をrenameしない。


# 2026-05-17 差分追記: EmlisAI relation surface naming boundary

`positive_recovery relation_not_expressed` 修正で追加された名称は、すべて EmlisAI 内部Composer / diagnostic meta の名称として読む。ユーザー表示名、public API route、DB physical name、既存response keyのrename対象ではない。

| 名称 | 種別 | 読み方 |
|---|---|---|
| `emlis_ai_relation_surface_contract.py` | backend internal file | Reader / Surface / Self-Repair の relation cue 共有契約。visible名ではない。 |
| `emlis.relation_surface_contract.v1` | internal contract version | relation cue / marker のバージョン。DB名でもAPI名でもない。 |
| `reader_relation_signal_*` | diagnostic field | Readerがrelation cueを検出したかを示すmeta。RN表示条件に使わない。 |
| `self_repair_relation_marker_*` | diagnostic / repair trace field | Self-Repairがdeclared relation markerを付与したかを示すmeta。表示文fallbackではない。 |
| `positive_recovery` | coverage_group | 商品品質版接続のcoverage分類。入力専用runtime分岐名ではない。 |

visible名は引き続き `Emlisの観測`。`input_feedback.comment_text` / `input_feedback.emlis_ai.observation_status` は互換維持する。


# 2026-05-17 差分追記: Observation Diagnostic Lockdown 名称境界

Observation Diagnostic Lockdownで追加された名称は、すべて内部診断名・log prefix・tool名として読む。ユーザー表示名、public API route、DB physical name、既存response keyのrename対象ではありません。

| 名称 | 層 | 読み方 |
|---|---|---|
| `Observation Diagnostic Lockdown` | 診断工程名 | 非表示submitの停止層を本文なしで固定する工程名。表示名ではない。 |
| `emlis_observation_diagnostic_lockdown` | backend log prefix | backend一行診断。env opt-in時だけ出す。 |
| `emlis_observation_frontend_result` | RN log prefix | RN一行診断。env opt-in時だけ出す。 |
| `classification` | 内部分類 | `candidate_missing` など、次修正層を決める内部reason。public statusではない。 |
| `next_action_branch` / `branch_locked` | 内部分岐meta | 次に触る層を固定するためのCLI / compare出力。ユーザー表示ではない。 |

`Emlisの観測` は引き続きvisible名として扱い、`input_feedback.comment_text` / `input_feedback.emlis_ai` は互換維持のpublic response keyとして残す。

# 2026-05-17 差分追記: Reader Relation Surface / limited repair 名称境界

Reader Relation Surface Step0-8で追加・可視化された名称は、すべて EmlisAI backend 内部のReader / limited repair / diagnostic meta名として扱う。ユーザー表示名、public route、DB physical name、既存response keyのrename対象ではありません。

| 名称 | 種別 | 読み方 |
|---|---|---|
| `Reader Relation Surface` | 修正工程名 | Observation Diagnostic Lockdownで分類済みの Reader rejected 原因をbackendで潰す工程名。visible名ではない。 |
| `limited_reader_repair` | composer / diagnostic meta | limited/A1でReader由来reasonを受け取った場合の最小repair状態。public response keyではない。 |
| `previous_rejection_reasons` | composition contract field | 直前attemptのGate / Reader reasonを次attemptへ渡す内部契約。DB columnではない。 |
| `expected_relation_types` | Reader引数 | surface relation contractの期待型。`conflict.e1` のようなedge idとは別物。 |
| `addressee_not_clear` | Reader rejection reason | 宛名契約不一致のreason。RN表示名ではない。 |
| `relation_not_expressed` | Reader rejection reason | relation surfaceが本文上で見えないreason。Gate自体を削除しない。 |
| `relation_marker_key` / `relation_marker_signal_keys` | diagnostic meta | relation surface markerの識別子。観測本文や固定fallback文ではない。 |

visible名は引き続き `Emlisの観測`。`input_feedback.comment_text` / `input_feedback.emlis_ai.observation_status` は互換維持する。

# 2026-05-18 差分追記: ProductGate Measurement Step0-10 名称境界

最新実ファイルでは、`ProductGate Measurement` 系の内部名が追加されています。これは visible名、public route、DB physical name、response keyではありません。`Product Gate` そのものの達成宣言とも分けて読む必要があります。

| 名前 | 層 | 意味 | rename禁止境界 |
|---|---|---|---|
| `ProductGate Measurement` | internal measurement工程名 | 表示/非表示をsubmit単位で分類し、scorecard / release ladder / next action / local report / Exit Gateへ接続する測定工程 | `Product Gate達成` や `商品品質版完成` と同一視しない |
| `display_confirmed` | measurement derived key | backend public passed + frontend joined + modal_opened が揃った表示確認済み状態 | `observation_status=passed` 単独と同義にしない |
| `backend_public_passed` | measurement derived key | backend public statusとcomment_text有無が通った状態 | RN表示確認済みとは呼ばない |
| `scorecard_passed_display_count` | scorecard event count | `display_confirmed=true` の場合だけ1 | backend passedだけで1にしない |
| `measurement_exit_gate_ready` | Exit Gate meta | 測定接続として必要な分類・count・event・reportが揃った状態 | Product Gate ready / public release appliedへrenameしない |
| `blind_qa_input_candidates` | Blind QA meta | read_feelingを人手reviewへ渡すためのmeta-only候補 | comment_text本文やraw入力を入れない |

禁止: ProductGate Measurementを理由に、`Emlisの観測`、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、`/emotion/submit`、DB physical name、RN modal条件をrenameしない。

# 2026-05-20 差分追記: Runtime Surface Quality Step0-12 名称境界

最新実ファイルでは、ProductGate Measurement後に `Runtime Surface Quality` 系の内部名が追加されています。これは表示名でもpublic API名でもありません。

| 名前 | 層 | 意味 | rename禁止境界 |
|---|---|---|---|
| `Runtime Surface Quality` | internal工程名 | 表示されたEmlis観測文のruntime source、surface signature、scorecard surface metrics、coverage、branch、QA、Exit Gateを扱う工程 | `Product Gate達成` や `商品品質版完成` と同一視しない |
| `RuntimeSurfaceSourceLockV1` | diagnostic meta | 表示文ごとに `composer_source` / version / display status を本文なしで固定する | RN表示条件やpublic response keyにしない |
| `SurfaceQualitySignatureV1` | surface measurement meta | connector / predicate / ending / grammar warningをkey列とhashで測る | `comment_text` 本文やraw入力を保存するものではない |
| `Branch Resolver` | next action meta | 次に触る層を runtime / grounding / grammar / surface / tone / QA に分岐する | 原因未分類のままSurfaceやToneを直す口実にしない |
| `Surface Realizer 2.1 Anti-Template` | surface policy | 固定文ではなく部品選択の反復を抑える | 完成文定数や入力専用テンプレを増やさない |
| `Tone Engine 2.1` | tone quality meta | 診断化、命令、慰めすぎ、距離感崩れを検出する | read_feelingを自動採点しない |
| `Exit Gate` | handoff boundary | next branch / blockers / gapsを残す | public release appliedではない |

visible名は引き続き `Emlisの観測`。`input_feedback.comment_text` / `input_feedback.emlis_ai.observation_status` は互換維持する。

# 2026-05-21 差分追記: Observation Reply internal名の読み分け

`mashos-api_16(2).zip` では、EmlisAI 観測返答 Step0-14 により `observation_reply_kind` 系のinternal名が増えています。これらは、Cocolonのvisible名、public route、DB physical name、RN public status enumではありません。

| internal名 | 意味 | 混同してはいけないもの |
|---|---|---|
| `Observation Reply` | EmlisAI観測返答の商品品質実装工程名 | RN表示名やAPI route名ではない |
| `eligible_observation` | 現在入力から対象・状態・関係が取れる観測branch | public `observation_status` ではない |
| `low_information_observation` | 情報不足時に見える範囲の観測と質問を返すbranch | `rejected` / `unavailable` / 新public statusではない |
| `observation_reply_kind` | reply種別を表すinternal / optional meta key | RN表示条件ではない |
| `eligibility_status` | `eligible` / `low_information` の内部判定 | ユーザー向け文言ではない |
| `user_fact_grounding_mode` | `disabled` / `explicit_reference` / `implicit_focus` の内部境界 | サブスク表示文言ではない |
| `unknown_slots` | 低情報時に不足している対象・出来事・関係など | ユーザーへそのまま出すUI labelではない |
| `low_info_receive` / `low_info_known_scope` / `low_info_question` | SentencePlan meta上の低情報role | public `line_role` enumではない |
| `Step14 Exit Gate / Handoff` | 観測返答工程のhandoff-only出口 | Product Gate達成・public releaseではない |

作業時は、`low_information_observation` を見つけてもRN enumへ追加しない。これは backend / diagnostic / scorecard / optional meta の名称であり、RN visible contractは `passed + commentText` のままです。

# 2026-05-21 差分追記: Emlis観測専用辞書 internal名の読み分け

`mashos-api_6(26).zip` では、Emlis観測専用辞書 Phase0-5 により `emlis_observation_structure_dictionary` / `current_input_bundle` / `structure_material` 系のinternal名が増えています。これらは、Cocolonのvisible名、public route、DB physical name、RN public status enumではありません。

| internal名 | 意味 | 混同してはいけないもの |
|---|---|---|
| `emlis_observation_structure_dictionary` | EmlisAIが入力束からrelation / internal question / allowed・forbidden inferenceを作る内部構造辞書 | 既存の `emlis_observation_dictionary` 表面素材辞書、DB table、public API名ではない |
| `EmlisCurrentInputBundle` | `memo` / `memo_action` / `emotion_details` / `category` を内部正規化する型 | public request model renameではない |
| `thought_text` / `action_text` / `emotions` / `categories` | EmlisAI内部の入力束名 | RN payload key / DB column / response keyではない |
| `selected_entry_ids` / `selected_relation_ids` / `structure_question_ids` | 構造辞書が選んだtext-free material | ユーザー表示文や固定返答文ではない |
| `state_text_gap` / `emotion_nesting` / `thought_action_discrepancy` / `category_parallel` / `category_overlap` | Emlis観測専用辞書のrelation候補 | 診断名・人格分類・public statusではない |
| `Phase5_Blind_QA` / `PHASE5_OBSERVATION_STRUCTURE_*` | fixture / rubric / test用の内部名 | Product Gate達成やrelease状態ではない |

作業時は、構造観測辞書のinternal名を理由に `Emlisの観測`、`input_feedback.comment_text`、`/emotion/submit`、DB physical name、RN modal条件をrenameしない。

# 2026-05-22 差分追記: ActionConversion / UnformedSelfInsight internal名の読み分け

`mashos-api_8(23).zip` では、Emlis観測専用辞書 UpdateDesign ActionConversion / UnformedSelfInsight により、構造観測辞書の relation / entry internal名が追加されています。これらは、Cocolonのvisible名、public route、DB physical name、RN public status enum、完成返答文テンプレ名ではありません。

| internal名 | 意味 | 混同してはいけないもの |
|---|---|---|
| `unexpressed_output_stop` | 出したいものが外へ出る前で止まった可能性を扱うrelation | 本音内容、相手原因、public statusではない |
| `self_shape_alignment` | 自分の形や出力を場・相手・状況へ寄せた可能性を扱うrelation | 主体性喪失診断、支配関係断定ではない |
| `action_conversion_history` | したい出力とは別の行動へ変換し履歴化した可能性を扱うrelation | 我慢賛美、自己犠牲診断、完成文ではない |
| `conversion_history_closure` | 変換後の行動履歴の閉じ方が入力根拠から見える場合に扱うrelation | 納得/未完了/疲労などをAI側が決めるラベルではない |
| `unformed_self_insight` | 反応や疑問はあるが自己理解の形へ並びきっていない入口を扱うrelation | low informationだけ、混乱診断、原因探索ではない |
| `word_could_not_say` / `word_aligned_to_context` / `word_gaman` / `word_wakaranai` | 追加input word entry | RN表示文言、DB column、public API keyではない |
| `dictionary_returns_completed_reply` / `completed_reply_from_dictionary` | meta-only contract flag | trueにして辞書から完成返答文を出すためのflagではない |
| `phase6_forbidden_inference_meta_contract` | forbidden inference / meta-only検証名 | public release段階、RN表示条件名ではない |

作業時は、これらのinternal名を理由に `Emlisの観測`、`input_feedback.comment_text`、`/emotion/submit`、DB physical name、RN modal条件をrenameしない。

# 2026-05-25 差分追記: 環境状態出力観測構造 名称境界

`環境状態出力観測構造` は、Cocolonが既に持つ入力構造を「環境ラベル × 状態ラベル × 出力内容」の観測単位として読むための内部設計名である。ユーザー向け表示名、DB physical name、API route名、response key名ではない。

| 名称 | 層 | 読み方 | rename禁止境界 |
|---|---|---|---|
| `環境状態出力観測構造` | internal design name | Cocolon全体の基盤観測構造。EmlisAI専用名ではない。 | visible名、route名、DB名、response keyへ昇格しない。 |
| `cocolon_environment_state_output_observation_structure_design_2026_05_25.md` | premise design doc | Phase0で追加する正本設計資料。 | 実装ファイルやschema実ファイルと混同しない。 |
| `environment_state_output_frame` | internal material候補 | 実装段階で検討する単発観測material名候補。 | 今回のPhase1では実ファイル化しない。public meta keyへ出さない。 |
| `conditional_output_tendency` | internal material候補 | Analysis向けの期間内再出現material候補。 | 1件入力から作らない。性格タイプ名にしない。 |
| `recovery_label_path` | internal material候補 | 状態移動時に一緒に現れたラベル経路のmaterial候補。 | 治療、回復方法、処方として表示しない。 |

作業時は、この構造名を理由に、`memo`、`memo_action`、`emotion_details`、`category`、`created_at`、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、`/emotion/submit`、RN visible title `Emlisの観測`、DB physical nameをrenameしない。


# 2026-05-26 差分追記: EmlisAI ESO surface contract completion 名称境界

EmlisAI Environment State Output Surface Contract Completion は、`environment_state_output_frame` をEmlisAI表示candidateへ使う場合の内部出口整合名である。public表示名、API route、DB physical name、response keyではない。

| 名称 | 層 | 読み方 | rename禁止境界 |
|---|---|---|---|
| `emlis_ai_environment_state_output_surface_contract_completion.py` | backend internal helper | scope marker補完とforbidden surface rejectionのshared helper。 | RN表示名、public response key、schema実ファイル名へ昇格しない。 |
| `EnvironmentStateOutputSurfaceContract` | internal dataclass | connected / single_record_only / scope_marker_required / forbidden_surface_claims を読む契約型。 | public payload modelではない。 |
| `ScopeMarkerCompletionResult` | internal dataclass | completion result meta。applied / skipped / rejection理由を内部に残す。 | public metaへ丸ごと出さない。 |
| `environment_state_output_scope_marker_completion` | composer internal meta | normalize前candidateに補完を適用したかを内部で見る。 | RN表示条件やpublic comment bodyではない。 |
| `environment_state_output_runtime_marker_check_performed` | runtime/public-safe summary flag | runtime gateがmarker確認を行ったことをcode / booleanで残す。 | これ単体でRN表示を開かない。 |

作業時は、これらのinternal名を理由に、`Emlisの観測`、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、`/emotion/submit`、DB physical name、RN modal条件をrenameしない。

# 2026-05-26 差分追記: EmlisAI状態回答と人間的フォロー 名称境界

`emlis_ai_state_answer_human_follow_definition_2026_05_26.md` で追加された名称は、EmlisAI immediate response の出力思想・surface contract設計名として読む。Phase2-10で一部はbackend内部materialとして実装済みだが、ユーザー表示名、public API route、DB physical name、response key、RN表示条件のrename対象ではない。

| 名称 | 層 | 読み方 | 混同してはいけないもの |
|---|---|---|---|
| `状態回答` | EmlisAI出力思想 | 行動指示ではなく、今の自分が何をしている状態かを返すEmlisAI専用の出力方針。 | 診断名、原因断定、行動指示、Analysis傾向文。 |
| `人間的フォロー` | EmlisAI出力思想 | 観測後に、入力内に見える意図・怖さ/負荷・努力・存在をEmlisの感想として受け止める層。 | 人格肯定、絶対味方宣言、慰めテンプレ。 |
| `観測6:フォロー4` | internal ratio policy | 基本のsection role / sentence plan比率目安。固定文字数ではない。`emlis_ai_state_answer_ratio_policy.py` が内部materialとして扱う。 | public設定、UI切替、ユーザー設定名。 |
| `フォロー4` | internal follow要素 | 意図の肯定、怖さ・負荷への理解、努力の受け止め、存在尊重を、主役1 + 補助2 + 余韻1で選ぶ内部要素。`emlis_ai_human_follow_selector.py` が扱う。 | 毎回4項目を表示する固定テンプレ。 |
| `Emlisの限定的反対意見` | 自己否定時の特別境界 | felt state と identity claim を分け、入力内根拠がある場合だけ自己否定内容をそのまま受け取らないEmlisの感想。`emlis_ai_state_answer_special_cases.py` とGateで扱う。 | 人格肯定、絶対否定、医療・心理診断。 |
| `安全日常比喩` | metaphor policy | 構造理解要求時だけ候補化する、自由生成ではない日常寄り比喩material。`emlis_ai_safe_daily_metaphor_material.py` が扱う。 | runtime固定例文、専門比喩、行動指示。 |
| `emlis_state_answer_surface_contract` | backend internal material | 観測層、フォロー層、ratio、special handling、metaphor、surface policyをまとめる内部contract。`emlis_ai_state_answer_surface_contract.py` が実装済み。 | public response key、DB column、json/schema実ファイル。 |
| `emlis_state_answer_composer_role_plan` | Composer internal role plan | 状態回答surface contractをObservation section / Human follow sectionへ渡すPhase7 role plan。 | 完成文テンプレ、RN表示条件、public payload。 |
| `emlis_ai_state_answer_gate_boundary` | Gate internal boundary | forbidden claim / allowed exception / public meta raw非混入を小さいsummaryで扱うPhase8境界。 | public meta raw body、表示率を上げるためのGate緩和。 |

作業時は、これらの名称を理由に `Emlisの観測`、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、`/emotion/submit`、DB physical name、RN modal条件をrenameしない。  
本資料内の例文は、設計意図を説明するためのQA目安であり、runtime固定文・完成文定数・fallback文として扱わない。Phase2-10の実装も、完成文テンプレではなく内部material / role plan / gate / QAとして読む。


# 2026-05-28 Phase15反映: EmlisAI二段受け取り構造 / Daily Reception 名称境界

Phase15名称更新の結論: これらの名称は、Phase0-14で追加されたbackend internal material / Gate / QA / public meta境界を読むための名称であり、RN visible title、API route、DB physical name、public response keyを置き換えない。


`EmlisAI二段受け取り構造` / `Daily Reception` / `受け取り補助辞書` で追加された名称は、EmlisAI immediate response の内部material、内部mode、二段表示契約、Gate / QA名として読む。ユーザー表示名、public API route、DB physical name、public response key、RN表示条件のrename対象ではない。

| 名称 | 層 | 読み方 | 混同してはいけないもの |
|---|---|---|---|
| `見えたこと` | `comment_text` 内section label | 入力内根拠からEmlisが観測として言えること。 | public response key `observation_text`、RN card名、DB column。 |
| `Emlisから` | `comment_text` 内section label | 同じ根拠を見た上で返すEmlisの受け取り・感想。 | public response key `reception_text`、RN card名、固定共感テンプレ。 |
| `two_stage_reception` | backend internal material / contract | 二段表示が必要であること、label、section order、joined comment text契約を示す内部material。 | response shape変更、UI分割、ユーザー設定モード。 |
| `EmlisSharedReceptionEvidence` | backend internal evidence | 観測sectionと受け取りsectionが共有する根拠summary。 | raw memo / memo_action / evidence本文のpublic meta。 |
| `EmlisReceptionAssistanceDictionary` | backend internal dictionary | reaction cue、event hint、reception mode、tone family、follow shape、forbidden inferenceを持つ補助辞書。 | 一般辞書、未知語意味辞書、完成返答文テンプレ集。 |
| `daily_unpleasant_reception` | internal reception mode | 日常の嫌な出来事・怖さ・怒り・不快感を軽く受け取るmode。 | public `observation_status` enum、RN表示種別、ユーザー選択モード。 |
| `daily_positive_reception` | internal reception mode | 日常の嬉しさ・ほっとした変化を軽く受け取るmode。 | public status、Analysis傾向文、固定褒めテンプレ。 |
| `self_denial_support` / `uncertainty_support` | internal reception mode | 自己否定や不安を、自己否定の事実化なしに受け取るmode。 | 診断名、人格分類、絶対肯定文。 |
| `daily_unpleasant_reception_light` | internal ratio preset | daily receptionで観測を軽く、Emlisからを厚くするratio preset。 | UI設定名、public meta key、文字数固定ルール。 |
| `explicit_reaction_receiving` | internal follow key | ユーザーが明示した怖さ・不快・怒りなどの反応を受け取るfollow材料。 | 完成返答文、相手評価同意、攻撃同意。 |
| `two_stage_reception_gate` | backend internal Cross Gate | 二段label、section順序、混線、質問逃げ、event hint感情捏造、bad grammarを止めるGate。 | RN表示条件、public error code、DB field。 |
| `display_quality_case` | test fixture / QA | A/B/非表示ログ1〜3の表示品質QA probe。 | runtime固定文、テンプレ正解集。 |

作業時は、これらの名称を理由に `Emlisの観測`、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、`/emotion/submit`、DB physical name、RN modal条件をrenameしない。`見えたこと` / `Emlisから` は初期実装では既存 `comment_text` 本文内のlabelとして扱い、分離public keyへ昇格しない。


# 2026-05-29 差分追記: EmlisAI TwoStage Composer Surface Connection internal名の読み分け

`mashos-api_10(18).zip` / `Cocolon_10(10).zip` では、Phase16-0〜16-9 により二段受け取り構造をCompleteComposer実表示へ接続するinternal名が増えている。これらは、visible名、public response key、DB physical name、API route、RN production UI名ではない。

| internal名 | 意味 | 混同してはいけないもの |
|---|---|---|
| `EmlisAI TwoStage Composer Surface Connection` | Phase16の実装工程名。二段受け取り構造をCompleteComposer実出力へ接続する。 | 新しい表示名、route名、DB名ではない。 |
| `two_stage_section_surface_plan` | role plan / surface contractから observation / reception の2sectionを復元するCompleteComposer向け内部material。 | public `observation_text` / `reception_text` keyではない。 |
| `two_stage_section_surface_plan_connected` | CompleteComposerClientへsection planが接続済みであるsummary flag。 | RN表示条件やユーザー設定ではない。 |
| `two_stage_section_id` / `two_stage_section_role` | `CompleteSentencePlanLine.meta` 上のsection分類。 | dataclass public field増設やAPI schema変更ではない。 |
| `two_stage_surface_realization` | CompleteSurfaceRealizerが二段joinを適用したかを示す内部summary。本文は含めない。 | `comment_text` の別public bodyやRN parse sourceではない。 |
| `daily_unpleasant_reception_surface_quality` | daily unpleasant向けsurface品質summary。pressure/limit skeleton、質問逃げ、相手評価同意などを避ける診断。 | ユーザー向け品質ラベルやpublic response keyではない。 |
| `phase16_7_unavailable_reason_codes` / `two_stage_unavailable_reason_codes` | Gate / self-repair / CompleteComposerClientで二段未実現理由を切り分ける内部reason code群。 | public `observation_status` enum追加ではない。 |
| `two_stage_complete_surface_realizer_label_missing` | CompleteSurfaceRealizer起因のlabel missing reason。 | Gate緩和理由やRN表示許可理由ではない。 |
| `two_stage_complete_sentence_plan_section_meta_missing` | SentencePlanにsection metaが無い場合のfail-closed reason。 | Python固定文で補完してよい合図ではない。 |
| `Phase16-9 RN regression` | RNが二段本文を既存 `commentText` として保持する契約回帰。 | RN二カードUI、section parse、split key fallbackではない。 |

作業時は、Phase16系internal名を見つけても、`Emlisの観測`、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、`/emotion/submit`、DB physical name、RN modal条件をrenameしない。二段表示は既存public key内の本文shapeであり、`observation_text` / `reception_text` のpublic key追加は今回も行わない。

# 2026-05-30 差分追記: EmlisAI TwoStage Product-Visible Fixture Completion internal名の読み分け

`Cocolon_11(4).zip` / `mashos-api_11(11).zip` では、Phase17-0〜17-10 により、二段受け取り構造の5件fixtureを商品表示到達へ揃えるinternal名が増えている。これらは、visible名、public response key、DB physical name、API route、RN production UI名ではない。

| 名称 | 読み方 | 読み替えてはいけないもの |
|---|---|---|
| `EmlisAI TwoStage Product-Visible Fixture Completion` | Phase17の実装工程名。A/B/ログ1/ログ2/ログ3の5件fixtureを `passed + labelled two-stage comment_text` へ到達させる。 | 新しい商品名、route名、DB名ではない。 |
| `product_visible_fixture_evaluation` | test-only helperがcandidateを分類するmeta-only評価schema。 | public response body、RN表示sourceではない。 |
| `product_visible_surface_policy` | CompleteSurfaceRealizerがmode-specific surface方針を適用したかの内部summary。 | 完成返答テンプレ辞書ではない。 |
| `phase17_internal_role_surface_phrase_bank` | `achievement` 等の内部role語を表示本文へ直出ししないためのrole phrase補完。 | 一般辞書、未知語辞書、固定返答文ではない。 |
| `two_stage_mode_section_budget` | labelled two-stage本文のobservation / reception文数境界をmode別に持つ内部policy。 | UI設定、public schema、ユーザー選択モードではない。 |
| `two_stage_internal_role_label_leak` | 内部role語がsurfaceへ漏れた時のGate reason。 | public `observation_status` enumではない。 |
| `two_stage_relation_skeleton_leak_surface` | relation skeletonが表示本文へ漏れた時のGate reason。 | 表示率目的のGate緩和ではない。 |
| `phase17_6_grounding_relation_binding` | ログ3系effort/pace contextのrelationを根拠と結び直す内部Grounding summary。 | Grounding緩和、unsupported sentence許可ではない。 |
| `phase17_7_self_repair_unavailable_reason` | self-repairへ渡せるreasonとdiagnostic-only reasonを分けるsummary-only meta。 | comment_text本文格納、raw input格納ではない。 |
| `phase17_10_public_contract_prescan` | test helper側でpublic meta body leakを軽量確認するための内部test summary。 | runtime public response keyではない。 |
| `Phase17-9 RN regression` | RNが5件二段本文を既存 `commentText` として保持する契約回帰。 | RN二カードUI、RN section parse、split key fallbackではない。 |

作業時は、Phase17系internal名を見つけても、`Emlisの観測`、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、`/emotion/submit`、DB physical name、RN modal条件をrenameしない。Phase17は「public schemaを増やす工程」ではなく、既存二段本文shapeを5件fixture全体で商品到達させ、悪いsurfaceをfail-closedで止めるbackend内部品質補完である。


# 2026-05-30 差分追記: EmlisAI Product Quality Stabilization Phase18 internal名の読み分け

`Cocolon_12(7).zip` / `mashos-api_12(10).zip` では、Phase18-0〜18-11 により、EmlisAIの商品品質安定化用internal名が増えている。これらは、visible名、public response key、DB physical name、API route、RN production UI名ではない。

| internal名 | 層 | 読み方 | rename禁止境界 |
|---|---|---|---|
| `EmlisAI Product Quality Stabilization Phase18` | 実装工程名 | Phase17の5件fixture到達を維持しつつ、Complete Initial、低情報、daily_unpleasant、meta-only、diagnostic、読感QA、public E2E、RN contractを安定化した工程。 | 新商品名、route名、DB名、RN画面名ではない。 |
| `product_quality_regression_matrix` | test-only helper / meta | Phase18対象のgreen/red基準面とrelease blockerを一覧化する。 | runtime public meta、ユーザー表示、release判定の自動化ではない。 |
| `two_stage_applicability_decision` | backend internal helper | TwoStage requiredを必要なcandidate経路だけに限定する。 | 二段表示のpublic設定、RN parse条件ではない。 |
| `low_information_public_repair_contract` | backend internal repair summary | 低情報入力を安全にpublic repairへ戻す境界。 | safety / scope / AP0 / non-repairable failureのpassed化ではない。 |
| `two_stage_mode_context` | backend internal mode propagation | `reception_mode_id` / `ratio_reason` をsentence line / SurfaceRealizerへ伝搬するsummary。 | case_id固定文、ユーザー設定modeではない。 |
| `meta_only_sanitizer` | backend meta boundary | `surface_policy` 本体や辞書本文をpayloadへ出さずsummary flagsへ落とす。 | public schema名、本文保存先ではない。 |
| `diagnostic_failure_taxonomy` | backend diagnostic taxonomy | 表示不可理由をcanonical classification + legacy aliasで整理する。 | public `observation_status` enum、RN表示条件ではない。 |
| `visible_readability_quality` | backend readability QA | 反復・内部role語・relation skeleton・単純言い換えを検査するmeta-only report。 | 完成文テンプレ、表示本文保存、Gate緩和ではない。 |
| `public_feedback_boundary_check` | test / public boundary check | `/emotion/submit` public responseでraw input / comment_text body / surface_policyを返さない確認。 | public response key追加ではない。 |
| `candidate_status_before_display_gate` / `candidate_generated_before_display_gate` | backend diagnostic summary | 候補生成と表示判定を分けて記録するbodyなしsummary。 | generated candidate本文のpublic保存ではない。 |

作業時は、Phase18系internal名を見つけても、`Emlisの観測`、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、`/emotion/submit`、DB physical name、RN modal条件をrenameしない。Phase18は「public schemaを増やす工程」ではなく、既存二段本文shapeを壊さず、広い既存回帰をfail-closed / meta-only / passed-onlyで安定させるbackend内部品質補完である。
# 2026-06-01 差分追記: EmlisAI Phase20 internal名の読み分け

`mashos-api_5(47).zip` では、EmlisAI Phase20-0〜20-15 により、撤回保持再設計と表示信頼性補強用のinternal名が増えている。これらは、visible名、public response key、DB physical name、API route、RN production UI名ではない。

| 名称 | 種別 | 読み方 | してはいけない読み替え |
|---|---|---|---|
| `response_kind` | backend internal contract | EmlisAI内部の応答種別。normal / low_information / limited / self_denial_safe_state_answer / safety / infraを分ける。 | public `observation_status` enum追加、RN表示条件。 |
| `safety_triage_kind` | backend internal safety分類 | safe / self_denial_safe_state_answer / safety_support_required / safety_blocked_emergencyを分ける。 | emergency safetyのpassed化。 |
| `input_material_bundle` | backend internal material | thought / action / emotion / categoryから見える材料とunknown slotsを読む。 | case語彙router、文字数だけのlow-info判定。 |
| `low_information_observation` | internal response_kind / composer branch | 材料不足入力を無応答にせず、見えている範囲と追加促しに分ける。 | A専用route、固定fallback。 |
| `gate_recovery_loop` | backend internal repair policy | Gate failureを短縮・限定・断定弱化・低情報/安全応答へ回す。 | Gate緩和、固定文注入。 |
| `generic_sentence_plan_surface` | backend internal surface mode | C/D専用完成surfaceではなく、relation / material / tone / boundaryから文を組み立てる。 | C/D専用mode復活、完成文bank。 |
| `response_contract_qa_matrix` | test / QA helper | family単位で品質・fatal条件を見る。 | exact generated text一致を合格条件にする。 |
| `phase20_10_real_device_recheck` | test / real-device regression | A低情報がscope-only blockerで非表示にならないことを固定する。 | 実機ログ本文をruntime条件にする。 |
| `phase20_13_post_final_gate_recovery` | backend internal meta / regression | final pre-return gate後にdisplayable response kindが空白へ戻らないことを確認する内部meta / test名。 | public response key、RN表示条件、Gate緩和。 |
| `post_final_pre_return_gate` | backend recovery context | Gate Recovery後の最終再評価で落ちた通常入力を一回だけ回復対象にするcontext。 | safety emergency / infrastructureのpassed化。 |
| `phase20_15_gate_recovery_surface_binding` | backend internal meta / QA | Gate Recovery surfaceがmaterial slots / relation family / unknown slotsに接続していることを本文なしで示す。 | comment_text本文保存、raw input保存、fixed fallback証明の単独根拠。 |
| `gate_recovery_surface_repetition_qa` | backend QA summary | Gate Recovery surface family / closing familyの反復を検出するQA。 | exact本文一致QA、完成文テンプレbank。 |

作業時は、Phase20系internal名を見つけても、`Emlisの観測`、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、`/emotion/submit`、DB physical name、RN modal条件をrenameしない。


# 2026-06-04 差分追記: User Label Connection Observation v1 internal名の扱い

`mashos-api_11(15).zip` では、`emlis_ai_user_label_connection_*` 系のinternal名が追加されている。これらは名称変更ではなく、Cocolonの記憶ラベル方式をEmlisAIの観測返答へ接続するbackend内部境界である。

| internal名 | 変更してはいけない読み方 |
|---|---|
| `user_label_connection` | public response root keyではない。既存 `input_feedback.emlis_ai` 内のsafe summaryとしてだけ扱う。 |
| `UserLabelPoint` | 1件の入力記録の正規化名。傾向・性格・診断名ではない。 |
| `UserLabelConnectionMaterial` | text-free material。comment_text生成器ではない。 |
| `UserLabelConnectionCandidate` | Gate前のMechanism候補。visible本文ではない。 |
| `UserLabelConnectionGate` | 既存Structure Insight Gateを緩めるものではなく、履歴接続専用Gate。 |
| `UserLabelConnectionSurfacePlan` | 固定完成文ではなく、既存surface生成系へ渡す限定plan。 |
| `limited_visible_surface_connection` | 新RN画面や新public keyではなく、既存 `Emlisの観測` comment_textへの限定接続。 |
| `derived_model_cache_consideration` | cache実装ではなく、将来検討meta。DB schemaや永続化の合図ではない。 |

禁止: `User Label Connection` という名称をRN表示タイトル、API route、DB table/column、subscription UI名、診断・性格分類名へ変換しない。`Emlisの観測`、`input_feedback.comment_text`、`input_feedback.emlis_ai`、`/emotion/submit` route、DB physical nameは変更しない。


# 2026-06-04 差分追記: EmlisAI Product Quality Measurement Phase0-8 internal名の読み分け

`mashos-api_9(27).zip` では、EmlisAI Product Quality Measurement / Blocker Repair Phase0〜8により、商品品質計測とrelease判断用のinternal名が増えている。これらは、visible名、public response key、DB physical name、API route、RN production UI名ではない。

| internal名 | 層 | 読み方 | 混同してはいけないもの |
|---|---|---|---|
| `ProductQualityEventV1` | backend internal QA event | 表示到達、Gate、binding、reason coverage、surface qualityを本文なしで正規化するevent。 | public response schema、DB保存record、RN表示payload。 |
| `MeasurementRunV1` | backend internal QA run material | 必須familyを流した計測summary。 | production runtime job、public artifact、ユーザー向けレポート。 |
| `Contract Freeze` | Phase0 internal inventory | RN/API/DB/public response/Product QA materialの不変境界を固定する。 | contract変更許可、release flag。 |
| `Local Product QA Composer Bootstrap` | Phase1 QA profile | QA時のComposer生成経路が開いているかを判定する。 | 本番rollout flag、`.env`恒久変更。 |
| `Blocker Matrix` | internal blocker triage | blockerをowner area / repair policy / candidate moduleへ接続する。 | ユーザー向け診断、public status enum。 |
| `Generation Repair Design` | internal repair design material | Blocker Matrixから修正trackと実行順を作る。 | 本文生成修正済みの証明、fixed template bank。 |
| `Blind QA Integration` | internal QA integration | ratings-only reviewを統合し、未実施をrelease blockerにする。 | 機械指標score、public review packet。 |
| `ProductReleaseDecisionV1` | internal release decision | Phase11 / scorecard / Blind QA / Matrix / Composer stateを統合して内部release判断を返す。 | rollout適用、public release、product_gate_ready。 |
| `ProductQualityValidationPlanV1` | internal validation plan | 検証順、required validation、acceptance criteriaを固定する。 | テスト実行済み証明、CI artifactそのもの。 |

作業時は、Phase0〜8系internal名を見つけても、`Emlisの観測`、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、`/emotion/submit`、DB physical name、RN modal条件をrenameしない。
