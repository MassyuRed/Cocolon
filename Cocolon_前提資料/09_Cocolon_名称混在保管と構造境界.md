---
doc_id: cocolon_name_mixing_structure_boundary
title: "Cocolon 名称混在保管と構造境界"
revision_date: "2026-06-01"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
source_snapshot:
  premise: "Cocolon_前提資料(158).zip"
  Cocolon: "Cocolon_12(9).zip"
  mashos-api: "mashos-api_12(12).zip"
file_counts:
  Cocolon: 217
  mashos-api: 736
  total: 953
purpose: "名称混在を資料で保管し、華恋が作業時に旧名称・current名称・DB物理名・runtime ownerを取り違えないようにする"
---

# 1. この資料の位置づけ

この資料は、**残タスク表ではありません**。  
Cocolonの名称混在を、華恋が作業時に迷わないように保管するための構造境界資料です。

Cocolonでは、次の名前が一致しない箇所があります。

- 画面に出る名前
- navigation route名
- React Native側のファイル名
- backend API handler名
- public route名
- DB physical table名
- legacy façade / compat名
- JSON payload内の旧語彙

これらは、すべてを一括renameすると稼働・契約・DB write pathを壊す可能性があります。  
そのため、この資料では「今すぐ変えるもの」ではなく、**どう読めばよいか**を固定します。

# 2. 名称混在を読む原則

1. 旧名称を見つけても、即renameしない。
2. visible名、route名、runtime owner、DB physical nameを分けて読む。
3. compat façade は、消し忘れではなく互換維持のために存在する場合がある。
4. `08_Cocolon_DB_rename_boundary.md` は存在するため、DB physical nameの確認は `08` を正本として行う。destructive変更はMash様が明示した場合だけ行う。
5. public route / response shape / RN caller に関係する変更は `05_Cocolon_ルールファイル索引` を先に読む。
6. Mash様が名称変更を指示しても、稼働に必要な互換・DB境界まで一括変更しない。
7. 資料で保管すれば作業上問題ないものは、資料で保管する。

# 3. 最新アプリ側の名称境界

| 領域 | current visible / 操作用語 | 実ファイル・runtime owner | legacy / 混在して残る名前 | 作業時の読み方 |
|---|---|---|---|---|
| Home | Home / Input | `Cocolon/screens/InputScreen.js`, `Cocolon/features/home/*`, `api_emotion_submit.py`, `api_home_state.py` | route名 `Input`、emotion reflection系語彙 | Home作業は `01A` と `02A` を読む |
| App runtime | `/app/bootstrap` runtime | `Cocolon/AppRuntimeContext.js`, `Cocolon/App.js`, `api_app_bootstrap.py` | `feature_flags` 内に機能別flagが混在 | feature flag変更は `AppRuntimeContext.js` と消費画面を同時に見る |
| API base URL | Cocolon API接続先 | `Cocolon/lib/apiClient.js` の `API_BASE_URL` | compat env内に旧 `MYMODEL` 語彙が残る可能性 | App.jsで旧envを直接読まない。API接続先の正本は `lib/apiClient.js` |
| Analysis | Analysis | `AnalysisScreen.js`, `SelfStructure*`, `api_analysis_*`, `api_self_structure.py` | `MyWeb` file / route / API名 | Analysis作業は `01B` と `02` / `02C` を読む |
| Piece | Piece | `PieceScreen.js`, `PieceLibraryScreen.js`, `api_emotion_piece.py`, `api_piece_runtime.py` | `MyModel`, `Nexus`, `mymodel_qna`, `reflection` | Piece作業はPiece専用工程。無断でAccount画面へ導線を足さない |
| EmotionLog / social | EmotionLog / follow | `EmotionLogScreen.js`, `FollowListScreen.js`, `api_emotion_log.py`, `api_follow.py` | `friends`, `myprofile_links` | social/read-sideはaccess policyも見る |
| Account / Settings | Account / Settings | `AccountScreen.js`, `SettingsOtherScreen.js`, `api_account_lifecycle.py` | `myprofile` / profile旧語彙 | account deleteはDB削除範囲とlocal cleanupも見る |
| Subscription | Free / Plus / Premium | `SubscriptionContext.js`, `SubscriptionSelectScreen.js`, `api_subscription.py` | IAP runtime / catalog名 | 新規販売停止は `subscription_sales_enabled` を見る |
| DB | DB実体 | 旧物理table + current bridge view | `mymodel_*`, `myweb_*`, `myprofile_*` など | 今回zipではDB destructive変更を扱わない。名称読み分けは `03` / `06` / `09` を使う |

# 4. `/app/bootstrap` runtime map

最新アプリでは、`/app/bootstrap` は `AppRuntimeContext.js` が取得し、次の状態をアプリ全体へ渡します。

| bootstrap項目 | RN側の保持先 | 主な消費先 |
|---|---|---|
| `minimum_supported_version` | `runtime.minimumSupportedVersion` | `App.js` の強制version gate |
| `recommended_version` | `runtime.recommendedVersion` | `App.js` の非強制更新案内 |
| `maintenance_message` | `runtime.maintenanceMessage` | `App.js` のAlert |
| `feature_flags.account_delete_enabled` | `isFeatureEnabled("account_delete_enabled")` | `SettingsOtherScreen.js` |
| `feature_flags.today_question_enabled` | `isFeatureEnabled("today_question_enabled")` | `features/home/useHomeState.js` |
| `feature_flags.today_question_history_enabled` | `isFeatureEnabled("today_question_history_enabled")` | `TodayQuestionHistoryScreen.js` |
| `feature_flags.subscription_sales_enabled` | `isFeatureEnabled("subscription_sales_enabled")` | `SubscriptionSelectScreen.js` |
| `feature_flags.myweb_mock_enabled` | `isFeatureEnabled("myweb_mock_enabled")` | 将来のAnalysis mock境界用。現時点では構造保管 |

# 5. local cleanup / token log の構造

| 対象 | current file | 構造上の意味 |
|---|---|---|
| 退会後local cleanup | `Cocolon/lib/accountLocalCleanup.js` | `input draft`、`selfStructureLatestSeenVersion`、旧 `cocolon:analysisLatestReport:{userId}:*`、新 `cocolon:kokoroWeatherLatestReport:v1:{userId}:*` を対象userId単位で削除する |
| 退会導線 | `Cocolon/screens/SettingsOtherScreen.js` | `account_delete_enabled`、二段階確認、friendly errorを扱う |
| push token log | `Cocolon/lib/pushToken.js` | APNs / FCM token prefix logはdebug buildでのみ出す |

# 6. DB名・legacy名の扱い

DB physical rename / drop は、この資料では判断しません。  
`08_Cocolon_DB_rename_boundary.md` は存在するため、DB実体・bridge view・write path・rename境界は `08` とこの資料を合わせて判断します。destructive変更はMash様が明示した場合だけ扱います。

この資料で保管するのは、DB旧名を見た時に華恋が混乱しないための読み方です。

- DBに旧物理名が残ることは、即バグではない。
- current bridge viewが存在しても、physical rename完了とはみなさない。
- 旧物理tableがwrite targetである場合は、ファイル名だけを先に変えない。
- JSON payloadに旧語彙が残る場合は、置換対象を確認してから扱う。

# 7. 作業時にしてはいけないこと

- 旧名称を見つけたという理由だけでrenameしない。
- legacy façadeを消し忘れと決めつけない。
- public APIの互換を確認せずroute handlerを削除しない。
- DB physical table名を資料上のcurrent名へ読み替えて更新SQLを作らない。
- Account画面にPiece確認導線を勝手に追加しない。
- ユーザーにJWT、curl、PowerShell前提の確認を求めない。

# 8. この資料の使い方

華恋は作業開始時に、次の順で読む。

1. `00_華恋用_READ_FIRST.md`
2. `03_Cocolon_命名体系.md`
3. 本資料 `09_Cocolon_名称混在保管と構造境界_2026-05-10.md`
4. 作業対象に応じて `01A / 01B / 01C`
5. 国家システムに関係する場合は `02 / 02A / 02C`
6. DBに触れるdestructive変更は今回扱わない。名称読み分けは `03` / `06` / `09` を確認する
7. public contract / ruleに触れる場合は `05`

この資料は、タスクを増やすためではなく、**華恋がCocolonのファイルやコード構成を正しく読むため**に使います。


# 2026-05-07 差分追記: value observationは名称変更ではない

`value_observation_*` は、EmlisAI / Analysis / Piece にまたがる観測信号layerであり、DB physical renameやroute名変更ではありません。

- `ValueObservationSignal` は内部meta / signal名であり、visible機能名ではない。
- `overcompression_risk` はPiece品質metaであり、publish routeやDB write pathを変えない。
- この差分でDB physical rename / drop / write path変更は行わない。
- 旧名称やDB境界に関係する判断は、今回も `03` / `06` / `09` の保管方針を優先し、現存資料にないDB資料を前提に destructive SQL を作らない。


# 2026-05-09 差分追記: 名称混在保管の更新

| 名称 | 現在の扱い |
|---|---|
| `今日の問い` | UI上の総称。内部では `static_role_probe` と `personal_followup` の2 originを持つ |
| `static_role_probe` | 既存100問テンプレ。全ユーザー向けの基礎層 |
| `personal_followup` | Premium向けの入力履歴深掘り層。ユーザー固有の原文アンカーに紐づく |
| `source_anchor` | 原文根拠。表示する引用は元入力に実在する短い文字列だけ |
| `Emlis（エムリス）` | Tutorial表示では読み仮名つき。runtime通常表示の `Emlis` とは文脈で読み分ける |
| `friend_emotion_feed` | 感情ログ/通知関連のlegacy physical table名として残る。通知Pushのqueue/direct境界とは別問題 |

`08_Cocolon_DB_rename_boundary.md` はこの前提資料zip内に存在するため、DB実体・bridge view・write path・rename境界を判断する場合は `08` を正本として確認します。

# 2026-05-09 差分追記: 画面分割は名称変更ではない

RN巨大画面分割で追加された `screens/input/*`、`screens/nexus/*`、`screens/analysis/*`、`screens/analysisReport/*`、`screens/account/*`、`screens/piece/*`、`navigation/*`、`runtime/*` は、名称変更やroute変更ではありません。既存entry shellの内部ownerとして読む。

| entry shell | internal owner | 名称境界 |
|---|---|---|
| `App.js` | `navigation/*`, `runtime/*`, `components/GlobalFrameLayout.js` | App root / provider / route正本を保持。route名は変えない |
| `InputScreen.js` | `screens/input/*` | visible Home / route Input を維持 |
| `AnalysisScreen.js` | `screens/analysis/*` | Analysis route / unread keyを維持 |
| `AnalysisReportViewerScreen.js` | `screens/analysisReport/*` | report viewer route / payload shapeを維持 |
| `NexusScreen.js` | `screens/nexus/*` | NexusはPiece surfaceとして維持。Piece/DB名称境界は変えない |
| `PieceScreen.js` | `screens/piece/*` | Piece routeとtutorial fixture境界を維持 |
| `AccountScreen.js` | `screens/account/*` | Account routeを維持。account deleteはSettingsOtherScreen owner |

本番運用監視の `api_client_events.py` / `/ops/client-events` はops境界です。これはDB rename、public content publish、analysis保存、Piece publishとは別のログ境界として読む。

# 2026-05-09 差分追記: Emlisの観測 名称混在境界

`Emlisの観測` はユーザー表示名であり、内部契約名の全面renameではありません。

| 領域 | current visible / 操作用語 | 実ファイル・runtime owner | legacy / 混在して残る名前 | 作業時の読み方 |
|---|---|---|---|---|
| Emlisの観測 | 入力直後モーダル `Emlisの観測` | `InputFeedbackReplyModal.js`, `useInputFeedbackModal.js`, `emlis_ai_reply_service.py`, multi-perspective service群 | `input_feedback.comment_text`, `input_feedback.emlis_ai`, `emlis_ai` meta, 旧テスト名や旧support file名 | 表示名は `Emlisの観測` に寄せる。API/DB/payload名は互換維持。`observation_status=passed` 以外は表示しない |

旧 `Emlisからの返答` / `Emlisからの応答` を画面文言として見つけた場合は修正対象。ただし `comment_text`、`input_feedback`、`emlis_ai` はユーザー表示名ではないため、名称混在として保管する。

# 2026-05-10 差分追記: Phase8品質語彙の名称混在境界

Phase8で追加された語彙は、ユーザー表示名・route名・DB名ではなく、EmlisAI内部の品質制御名です。

| 領域 | current visible / 操作用語 | 実ファイル・runtime owner | legacy / 混在して残る名前 | 作業時の読み方 |
|---|---|---|---|---|
| Phase8品質改善 | `Emlisの観測` の本文品質 | `emlis_ai_limited_composer_client.py`, `emlis_ai_limited_sentence_quality_guard.py`, `emlis_ai_template_echo_guard.py`, `emlis_ai_display_gate.py` | `input_feedback.comment_text`, `emlis_ai` meta, `composer_source=ai_generated`, `cocolon_limited_composer.v1` | 表示名やAPI keyを変更しない。内部品質層として読み、固定文テンプレや外部AI導入と混同しない |

`composer_source="ai_generated"` は、外部LLM生成を意味する表示名ではなく、既存Display Gate上で `rule_rendered` / `fallback` / `static_string` と区別するための内部sourceです。Phase8では `composer_model="cocolon_limited_composer.v1"` と併せて読む。


# 2026-05-11 差分追記: 共通文章生成基盤の名称混在境界

共通文章生成基盤の追加により、`core` / `composer` / `adapter` / `text_generation_core` という内部語彙が増えています。これらは、既存のvisible名・route名・DB物理名のrenameではありません。

| 内部語彙 | 実体 | 混同してはいけないもの |
|---|---|---|
| `text_generation_core` / `core_text_generation` | additive meta key | public response keyの置換名ではない。既存keyへ追加されるmeta |
| `EmlisObservationComposer` | Emlis候補文の共通Core adapter | `Emlisの観測` 表示名を置換しない |
| `PieceComposer` | Piece問い/答えの共通Core adapter | `reflection` / `mymodel_qna` / `piece_text` をrenameしない |
| `AnalysisComposer` | Analysis観測レポート本文の共通Core adapter | `content_json` / `standardReport` / `contentText` をrenameしない |
| `SourceAnchor` / `EvidenceSpanLike` | 根拠の共通型 | DB table名ではない |

旧名称が実ファイルやpayloadに残っていても、互換・DB境界・公開契約として残っている場合は資料で保管する。共通Core接続を理由に一括renameしない。

# 2026-05-12 差分追記: こころ天気 名称混在境界

`こころ天気` は、Analysis visible面の感情分析レポート表示名・UI表現です。内部契約やDB物理名を置き換える名称ではありません。

| 領域 | current visible / 操作用語 | 実ファイル・runtime owner | legacy / 混在して残る名前 | 作業時の読み方 |
|---|---|---|---|---|
| 今のこころ天気 | Analysisトップカード | `KokoroWeatherCurrentCard.js`, `useAnalysisReportActions.js`, `api_analysis_reads.py`, `kokoro_weather_service.py` | `/analysis/home-summary`, `current_weather`, `MyWebHomeSummaryResponse` | visible名は今のこころ天気。payloadは `current_weather` のまま |
| こころ天気（日/週/月） | 感情分析レポートの表示名 | `AnalysisContentFirstScreen.js`, `AnalysisEmotionScreen.js`, `AnalysisReportHistoryScreen.js`, `api_analysis_reports.py` | `daily`, `weekly`, `monthly`, 旧表示の日報/週報/月報 | 表示名だけ更新。内部type値は維持 |
| レポートこころ天気図 | レポート内天気図 / 詳細Modal | `AnalysisReportViewerScreen.js`, `KokoroWeatherForecastStrip.js`, `KokoroWeatherDetailModal.js`, `kokoroWeatherFormatters.js` | `content_json.kokoroWeather` | content_jsonの正式表示対象payload。存在しない旧レポートは表示対象外 |
| 観測メモあり | こころの動きが大きかった観測ラベル | `kokoro_weather_service.py`, `kokoroWeatherFormatters.js` | 注意報/警報ではない | 未来予測・危険通知として扱わない |

禁止: `MyWeb` / `analysis_reports` / `myweb_reports` / `daily` / `weekly` / `monthly` をこころ天気に一括renameしない。自己分析 / Self Structure をこころ天気化しない。

# 2026-05-13 差分追記: 旧感情分析レポート非表示の名称混在境界

旧感情分析レポート非表示は、名称一括renameではありません。旧名称・旧DB名・旧cache prefixが残る場所は、互換またはcleanup境界として読みます。

| 領域 | current visible / 操作用語 | 実ファイル・runtime owner | legacy / 混在して残る名前 | 作業時の読み方 |
|---|---|---|---|---|
| こころ天気正式表示対象 | こころ天気（日/週/月） | `api_analysis_reports.py`, `kokoroWeatherFormatters.js` | `daily`, `weekly`, `monthly`, `content_text`, `standardReport.contentText` | visible名はこころ天気。旧本文fallbackは表示しない |
| 旧感情分析レポート非表示 | 表示対象外 | `AnalysisReportHistoryScreen.js`, `AnalysisReportViewerScreen.js`, `api_analysis_reports.py` | DB上の旧レポートrow | DBから物理削除せず、ready/detail/history/viewer/unreadから外す |
| こころ天気latest cache | `cocolon:kokoroWeatherLatestReport:v1` | `useAnalysisReportActions.js`, `AnalysisScreen.js` | `cocolon:analysisLatestReport` | 通常readは新cacheだけ。旧cacheはcleanup対象として残す |
| detail / weekly-days route | `/analysis/reports/{id}` / `/analysis/reports/{id}/weekly-days` | `legacyWireContracts.js`, `api_analysis_reports.py`, `api_analysis_reads.py` | MyWeb report legacy naming | routeはrenameしない。表示対象filterだけを追加する |

禁止: 旧レポート非表示を理由に、`myweb_reports`、`analysis_reports` bridge、`/analysis/*`、`daily` / `weekly` / `monthly` をこころ天気名へ物理renameしない。

## 2026-05-13 差分追記: わたしマップ名称混在境界

`自己分析` / `Self Structure` / `MyProfile` / `わたしマップ` は同じ層の別名ではない。current では次のように読む。

| 名前 | 使う場所 | rename可否 |
|---|---|---|
| `わたしマップ` | ユーザー向け tab / card / guide / tutorial / IAP copy | visible name として使う |
| `詳しい自己分析レポート` | 詳細本文・履歴・PDFなど、旧自己分析本文を読む場所 | visible補助として使う |
| `SelfStructure*` | RN file / route model / report screen | file rename しない |
| `/self-structure/*` | backend public route | route rename しない |
| `myprofile_reports` | DB physical table | physical rename しない |
| `selfStructureDeepVisual` | 旧 payload | fallback として維持 |
| `content_json.watashiMap` | 新 payload | additive field |

禁止: `SelfStructure*` file、`/self-structure/*` route、`myprofile_reports` physical name を visible名に合わせて一括renameしない。`わたしマップ` は自己分析の表現層であり、DB / route / legacy façade の置換作業ではない。

latest zip 補正: `components/selfStructure/watashiMapAccessPolicy.js` が存在し、screen import と一致している。root `components/watashiMapAccessPolicy.js` は同内容の互換copyとして保管する。これは旧名混在ではなく配置互換の境界として読む。

# 2026-05-15 差分追記: EmlisAI A案相当Composer名とわたしマップ配置境界

最新実ファイル `Cocolon_7(10).zip` / `mashos-api_7(13).zip` では、名称境界として次を固定する。

| 対象 | current fact | 読み方 |
|---|---|---|
| EmlisAI A案相当composer model | `cocolon_emlis_observation_composer.a1.v1` | internal `composer_model` / rollout meta名。visible名、public route、DB physical nameではない |
| Emlisの観測 | `input_feedback.comment_text`, `observation_status`, 表示名 `Emlisの観測` | passed-only表示契約を維持する。A案相当導入でresponse keyをrenameしない |
| Common Core | `cocolon_text_generation_core` | 品質・根拠・Guardの共通基盤。Emlis / Piece / Analysis の出力目的を統一する名称ではない |
| わたしマップaccess policy | `Cocolon/components/selfStructure/watashiMapAccessPolicy.js` と root copy | 最新zipではViewer/History import pathにselfStructure配下の実ファイルが存在する。root copyは互換/共通参照として読む |
| Analysis Home refresh signal | `Cocolon/lib/analysisHomeSummaryRefreshSignal.js` | RN local signal名。Analysis API routeやDB名ではない |

禁止: A案相当、Common Core、わたしマップの名称を理由に、DB physical rename / public route rename / response key renameを行わない。

# 2026-05-15 差分追記: EmlisAI 限定Composer拡張 Step0-11 名称混在境界

最新実ファイル `mashos-api_12(4).zip` では、限定Composer拡張 Step0-11 により内部meta名・helper名・test名が増えています。これらはユーザー表示名やpublic contractではありません。

| 対象 | current fact | 読み方 |
|---|---|---|
| 限定Composer | `emlis_ai_limited_composer_client.py` | 現在の自作Composer土台。今回のStep0-11で診断・binding・relation・surface・scorecardを拡張した。 |
| 完全Composer | 設計上の次目標 | 外部AI/ローカルLLM導入の別名ではない。限定Composer拡張完了後に初期版へ進む。 |
| 完全Composer商品品質版 | 商品品質ランク | `90%+` は評価基準であり、route / DB / response keyの名前ではない。 |
| `SentenceBinding` | internal type / meta | 文と根拠材料・relationを束縛する。DB table名ではない。 |
| `relation_taxonomy` | internal helper / meta | relation_not_expressedを構造で追うための分類。ユーザー表示名ではない。 |
| `binding_used` | Gate trace meta | reader / grounding / template / displayの診断用。public response key renameではない。 |
| `scorecard_harness` | QA / metrics meta | coverage_group別の進捗集計。商品表示名ではない。 |
| `step10_e2e_display_contract` / `step11_e2e_exit_gate` | QA contract meta | passed-only表示契約と限定Composer拡張完了Exit Gateの確認名。 |

禁止: 限定Composer拡張、完全Composer、完全Composer商品品質版、SentenceBinding、relation taxonomy、scorecardを理由に、DB physical rename / public route rename / response key rename / RN visible名renameを行わない。

# 2026-05-16 差分追記: 完全Composer初期版 Commit1-13 名称混在境界

旧基準実ファイル `mashos-api_15(3).zip` では、Complete Composer初期版の内部名として `complete_composer_initial` 系が追加され、既存 `a_plan_equivalent` / `A-1` 系も互換名として残っていた。これは名称混在の解消ではなく、完全Composer初期版へ進むための読み替え層である。最新正本では、後続のE2E表示開通 Step0-9 metaも同じく内部名として保管する。

| 名前 | 見える場所 | 構造上の意味 | rename判断 |
|---|---|---|---|
| `complete_composer_initial` | meta / registry alias / tests | 完全Composer初期版のcurrent設計名 | renameしない |
| `a_plan_equivalent` / `A-1` | 既存service / tests | Step18/19からの互換名 | 互換維持 |
| `CompleteComposerCandidate` / `CompleteSentencePlanV2` / `RepairTrace` | `emlis_ai_complete_composer_types.py` | 内部型 | public response keyに昇格しない |
| `Emlisの観測` | RN visible title | ユーザー表示名 | 変更しない |

この名称混在は、作業時の読み替えで吸収する。物理renameは別工程であり、今回の差分では行わない。


# 2026-05-16 差分追記: 完全Composer初期版 E2E表示開通 Step0-9 名称混在境界

最新実ファイル `Cocolon_10(7).zip` / `mashos-api_10(10).zip` では、完全Composer初期版のE2E表示開通に伴い、`complete_initial_entry_ap0`、`step6_final_ap0_scorecard_connection`、`step9_fixture_qa_run` などの内部meta名が増えています。これらはユーザー表示名、public route、DB物理名ではありません。

| 名称 / path | 種別 | 扱い | 理由 |
|---|---|---|---|
| `complete_initial_entry_ap0_decision` | internal diagnostic meta | `rename禁止` | registry前の入口AP0判定。Final AP0やpublic response keyではない。 |
| `complete_initial_pre_generation_diagnostic_seed` | internal diagnostic meta | `rename禁止` | resolver前にEntry AP0材料を残すためのseed。raw入力本文は含めない。 |
| `composer_client_resolution` / `complete_initial_gate` | internal resolution meta | `rename禁止` | clientがAP0 / rollout / safetyのどこで閉じたかを見る診断名。 |
| `step6_final_ap0_scorecard_connection` | internal QA meta | `rename禁止` | 実行後AP0とscorecard eventの接続確認。表示Gateの代替ではない。 |
| `step9_fixture_qa_run` / `complete_initial_fixture_qa_run` | internal QA meta | `rename禁止` | fixture / QA集計名。商品品質版scorecard seedへ渡すが、public本文ではない。 |
| `complete_initial_product_scorecard_seed` | internal scorecard seed | `rename禁止` | Product Gateに進むための入力meta。商品品質版到達宣言ではない。 |
| `emlis_ai_complete_initial_fixture_qa_service.py` | Step9 service owner | `rename禁止` | Complete初期版のQA集計service名。RN visible名へ置換しない。 |

visible名は引き続き `Emlisの観測`、公開本文は `input_feedback.comment_text`、表示条件は `observation_status=passed` かつ本文ありの場合のみ。Complete初期版E2E表示開通を理由に、DB physical name、public API route、response key、RN visible titleをrenameしない。

# 2026-05-16 差分追記: 商品品質版接続 Step0-7 名称混在境界

最新実ファイル `Cocolon_8(11).zip` / `mashos-api_8(16).zip` では、完全Composer初期版の上に商品品質版接続の内部meta / service / test名が追加されています。これらはrelease判定材料であり、visible名やpublic contractではありません。

| 名称 / path | 種別 | 扱い | 理由 |
|---|---|---|---|
| `emlis.gate_binding_contract.v2` | Gate contract version | `rename禁止` | `binding_used` の意味整理用。public response keyではない。 |
| `emlis_ai_complete_tone_policy.py` | backend service | `rename禁止` | TonePolicyの内部owner。Emlis visible名ではない。 |
| `emlis_ai_complete_product_quality_scorecard_service.py` | backend service | `rename禁止` | Product Gate判断材料のmeta集計owner。商品品質版到達宣言ではない。 |
| `emlis_ai_complete_release_ladder_service.py` | backend service | `rename禁止` | release ladder判定meta owner。rollout操作APIではない。 |
| `complete_product_quality_scorecard` | diagnostic/meta | `rename禁止` | machine metrics / Blind QA aggregate。Display Gateを置換しない。 |
| `complete_product_quality_release_ladder` | diagnostic/meta | `rename禁止` | internal / limited / broader_beta / product_gate の判定結果。public release applied ではない。 |
| `blind_qa_required` / `read_feeling_requires_blind_qa` | QA meta | `rename禁止` | 読まれた感を機械metricsだけでProduct Gate扱いにしないための内部flag。 |
| `product_gate_public_release_applied` | release meta | `rename禁止` | Step7ではfalseを保持する安全契約。 |

この名称混在は前提資料で保管し、作業時の読み替えで吸収する。DB physical name、public API route、既存response key、RN visible title `Emlisの観測` は変更しない。


# 2026-05-17 差分追記: relation surface contract 構造境界

`emlis_ai_relation_surface_contract.py` と `reader_relation_signal_*` / `self_repair_relation_marker_*` は、`Emlisの観測` の内部Composer品質境界として保管する。名称混在の扱いは次の通りです。

| 境界 | 扱い |
|---|---|
| visible名 | `Emlisの観測` のまま。`positive_recovery` や relation surface contract を画面名へ出さない。 |
| public response key | `input_feedback.comment_text` と `input_feedback.emlis_ai.observation_status` を維持する。diagnostic meta追加でpublic statusを上書きしない。 |
| DB / API physical name | DB table / route / write path は変更しない。relation surface contract はbackend内部file名。 |
| Gate boundary | Reader / Grounding / Template / Display Gate を緩めない。relation_not_expressedを単純削除しない。 |
| log boundary | debug logはdefault off。raw入力・comment_text本文を通常logへ出さない。 |
| 通知400 | `__global_emotion_notifications__` UUID error は別件。今回のrelation修正名と混ぜない。 |

作業時に `relation_surface_contract_version` や `reader_relation_signal_keys` を見つけた場合は、EmlisAI diagnostic / QA metaとして読み、DB/API/RNのrename候補にしない。


# 2026-05-17 差分追記: Observation Diagnostic Lockdown 構造境界

Observation Diagnostic Lockdownで追加された `diagnostic_lockdown` / `comparison` / `branching` は、名称変更ではなく内部診断境界です。`Emlisの観測` のvisible名、`input_feedback.comment_text`、`input_feedback.emlis_ai`、`/emotion/submit` route、DB physical nameは変更しません。

| 境界 | 読み方 |
|---|---|
| backend log prefix | `emlis_observation_diagnostic_lockdown` は内部log prefix。ユーザー向け表示名ではない。 |
| frontend log prefix | `emlis_observation_frontend_result` はRN local診断log。visible labelではない。 |
| branch names | `candidate_missing` / `candidate_generated_but_grounding_rejected` 等は次工程分岐の内部classification。public observation_statusではない。 |
| tools | `emlis_observation_compare_1135_1136.py` / `emlis_observation_route_next_step.py` はlocal確認tool。API routeではない。 |
| response | public response shapeは維持。diagnostic metaやcomplete metaだけでRN表示を開かない。 |

作業時は、この診断名を理由に `Emlisの観測`、`input_feedback`、DB table / columnをrenameしない。

# 2026-05-17 差分追記: Reader Relation Surface repair 構造境界

Reader Relation Surface Step0-8で追加された `limited_reader_repair` / `expected_relation_types` / `previous_rejection_reasons` は、名称変更ではなく内部Composer / Reader / diagnostic境界です。`Emlisの観測` のvisible名、`input_feedback.comment_text`、`input_feedback.emlis_ai`、`/emotion/submit` route、DB physical nameは変更しません。

| 境界 | 読み方 |
|---|---|
| visible名 | `Emlisの観測` のまま。Reader Relation Surfaceやlimited repairを画面名へ出さない。 |
| public response | `input_feedback.comment_text` と `input_feedback.emlis_ai.observation_status` を維持する。diagnostic metaでpublic statusを上書きしない。 |
| backend internal | `limited_reader_repair` はComposer / diagnostic meta。DB table / columnではない。 |
| relation handoff | `expected_relation_types` はReader内部引数。edge idやDB relation idではない。 |
| repair reason | `previous_rejection_reasons` はattempt間のcomposition contract。RN表示条件ではない。 |
| test support | `tests/conftest.py` はpytest import support。runtime APIではない。 |

作業時は、この修正名を理由に DB physical rename / public route rename / response key rename / RN visible title rename を行わない。

# 2026-05-18 差分追記: ProductGate Measurement internal名の保管境界

`mashos-api_11(6).zip` では、`product_gate_measurement` / `measurement_connection` / `display_confirmed` / `exit_gate` 系の内部名が増えています。これらはCocolonのvisible名やDB physical nameではありません。

| internal名 | 保管する意味 | 混同してはいけないもの |
|---|---|---|
| `emlis_ai_complete_product_quality_measurement_contract_inventory.py` | ProductGate Measurementのcontract inventory owner | public registry / API route ownerではない |
| `emlis_ai_complete_product_quality_measurement_connection.py` | diagnostic rowからscorecard / release / routing / Exit Gate reportを作るowner | Composer本文生成ownerではない |
| `display_confirmed` | RN modal_openedまで確認した表示確認済みderived key | backend `observation_status=passed` 単独ではない |
| `measurement_exit_gate_ready` | 測定接続の完了条件 | Product Gate達成 / public release appliedではない |
| `blind_qa_input_candidates` | Blind QAへ渡すmeta-only候補 | 入力本文やEmlis本文の保管場所ではない |

禁止: これらのinternal名を理由に、`Emlisの観測` 表示名、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、`/emotion/submit`、DB physical name、RN modal条件をrenameしない。

# 2026-05-20 差分追記: Runtime Surface Quality internal名の保管境界

`mashos-api_13(5).zip` では、`runtime_surface_quality` / `surface_signature` / `tone_engine_2_1` / `surface_aware_self_repair` 系の内部名が増えています。これらはCocolonのvisible名、public route、DB physical name、RN modal条件ではありません。

| internal名 | 保管する意味 | 混同してはいけないもの |
|---|---|---|
| `Runtime Surface Quality` | ProductGate Measurement後の表示文由来・表層品質・QA接続工程 | Product Gate達成 / public release / 完全Composer商品品質版完成ではない |
| `runtime_surface_source_lock` | 実表示文がどのcomposer / surface / tone / repair経路から来たかを本文なしで固定するmeta | public `composer_source` renameやRN表示条件ではない |
| `runtime_composer_source` | Step1/Step5用の分岐source名 | 既存scorecardの `composer_source` 意味を上書きする名前ではない |
| `surface_signature_id` / `surface_signature_family_key` | 正規化key列から作るsurface署名 | `comment_text` 本文、入力本文、DB保存本文ではない |
| `coverage_group_missing` | coverage未分類をshort_dailyへ流さず保持するblocker名 | 新しいvisible category名ではない |
| `surface_realizer_2_1_anti_template` | 固定文ではなく部品選択を分散する内部policy | 完成文テンプレ追加や入力専用分岐ではない |
| `phrase_unit_grammar_normalizer` | PhraseUnit材料段階のgrammar修正・drop/defer境界 | 意味補完や本文生成ownerではない |
| `tone_engine_2_1` | 診断化・命令・距離感崩れを検出しBlind QAへ渡す内部Tone境界 | read_feelingをmachine metricsで自動採点するものではない |
| `surface_aware_self_repair` | surface / grammar reasonをbounded repair targetへ変換するadapter | Gate緩和や新しい意味追加ではない |
| `blind_qa_long_run` | rating-only reviewとsignature diversity確認 | raw input / public comment_text本文の保管場所ではない |
| `runtime_surface_exit_gate` | Step12のhandoff-only出口 | `product_gate_ready` / `public_release_applied` ではない |

禁止: これらのinternal名を理由に、`Emlisの観測` 表示名、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、`/emotion/submit`、DB physical name、RN modal条件をrenameしない。

# 2026-05-21 差分追記: Observation Reply internal名の保管境界

`mashos-api_16(2).zip` では、`observation_reply_kind` / `eligible_observation` / `low_information_observation` / `user_fact_grounding_mode` / `unknown_slots` / `observation_roles` 系の内部名が増えています。これらはCocolonのvisible名、public route、DB physical name、RN modal条件ではありません。

| 領域 | current visible / 操作用語 | 実ファイル・runtime owner | legacy / 混在して残る名前 | 作業時の読み方 |
|---|---|---|---|---|
| EmlisAI 観測返答 | `Emlisの観測` | `emlis_ai_reply_service.py`, `emlis_ai_observation_*`, `emlis_ai_display_gate.py`, `inputFeedbackModel.js` | `input_feedback.comment_text`, `input_feedback.emlis_ai`, `observation_status`, `commentText` | 表示名は `Emlisの観測` のまま。reply kindはinternal metaとして読む。 |
| eligible観測 | Emlisの観測本文 | `emlis_ai_observation_eligibility_service.py`, Complete Composer関連 | `eligible_observation`, `eligibility_status=eligible` | public statusではない。入力整理＋状態言語化のbranch。 |
| 低情報観測 | Emlisの観測本文 + 質問 | `emlis_ai_low_information_observation_composer.py`, `emlis_ai_observation_display_repair_integration.py` | `low_information_observation`, `unknown_slots`, `question_required` | 通常入力で情報不足時の正規branch。Phase7 rollout block / pre-connection stop / 非修復candidate rejectionを低情報として扱わない。 |
| ユーザー辞書境界 | サブスクの過去情報補助 | `emlis_ai_user_fact_grounding_boundary.py` | `explicit_reference`, `implicit_focus`, `disabled` | Freeでは使わない。サブスクでも低情報を辞書だけでeligible化しない。 |
| Exit Gate / Handoff | 次工程への判断材料 | `emlis_ai_observation_exit_gate_handoff.py` | `release_allowed=false`, `product_gate_ready=false` | handoff-only。Product Gate達成やpublic releaseではない。 |

禁止: `low_information_observation` を public `observation_status` に追加しない。`observation_reply_kind` をRN表示条件にしない。`input_feedback.comment_text` / `commentText` / `observation_status=passed` を名称変更しない。

## 2026-05-22 差分追記: Step10 Repair Boundary internal名の保管境界

`mashos-api_6(27).zip` では、Step10 repair境界のために次の内部reason名が実行meta / test上で固定されています。これらはvisible名、public status、RN表示条件、API route、DB physical nameではありません。

| internal reason / key | 読み方 |
|---|---|
| `step10_blocked_by_phase7_rollout` | reply_service側の二重防御reason。Phase7 rollout blockを低情報repairへ流さない。 |
| `composer_resolution_blocked_rollout` | composer resolutionがrolloutで接続不可だったことを示すStep10 block reason。 |
| `composer_resolution_pre_connection_rollout_stop` | composer接続前のrollout stopを示すStep10 block reason。 |
| `limited_composer_rollout_not_allowed` | limited composerの段階リリース上の非許可reason。 |
| `phase7_rollout_gate_blocked` | release gate / phase7 rollout gate由来のblockをStep10 metaへ保持するreason。 |
| `ai_generated_candidate_non_repairable_rejection` | AI-generated candidateのrejected本文を低情報branchで覆わないための内部reason。 |

禁止: これらのreason名を見つけても、`observation_status` enumへ追加しない。RN側にreason別表示分岐を足さない。backend側で `passed + comment_text` を作らないことで表示契約を守る。


# 2026-05-21 差分追記: Emlis観測専用辞書 Phase0-5 構造境界

`mashos-api_6(26).zip` では、`emlis_observation_structure_dictionary` / `EmlisCurrentInputBundle` / `observation_structure_material` 系の内部名が増えています。これらは名称変更ではなく、EmlisAIが現在入力の束を構造材料として読むためのbackend内部境界です。`Emlisの観測` のvisible名、`input_feedback.comment_text`、`input_feedback.emlis_ai`、`/emotion/submit` route、DB physical nameは変更しません。

| 境界 | 読み方 |
|---|---|
| existing surface dictionary | `emlis_observation_dictionary.v1.json` は表面素材・guard signature系辞書として残る。 |
| new structure dictionary | `emlis_observation_structure_dictionary.v1.json` は入力束 / relation / inference chain系の別辞書。 |
| current input bundle | `EmlisCurrentInputBundle` は内部正規化型。public request / response keyではない。 |
| structure material | `selected_entry_ids` / `selected_relation_ids` / `structure_question_ids` はtext-free material。表示文ではない。 |
| Gate / Composer connection | `low_information_boundary_connected` / `overclaim_guard_connected` / `forbidden_inference_boundary_connected` は内部guard meta。public statusではない。 |
| Phase5 fixture | Blind QA fixtureは完成返答文の固定正解ではなく、relation / boundary / raw text非混入 / contract維持の確認材料。 |

作業時は、この構造辞書名を理由に、既存の `Emlisの観測`、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、public response key、DB physical name、RN modal条件をrenameしない。


# 2026-05-22 差分追記: ActionConversion / UnformedSelfInsight internal名の保管境界

`mashos-api_8(23).zip` では、Emlis観測専用辞書 UpdateDesign ActionConversion / UnformedSelfInsight により、`unexpressed_output_stop` / `self_shape_alignment` / `action_conversion_history` / `conversion_history_closure` / `unformed_self_insight` 系の内部名が増えています。これらは名称変更ではなく、EmlisAIが現在入力の束を構造材料として読むためのbackend内部境界です。`Emlisの観測` のvisible名、`input_feedback.comment_text`、`input_feedback.emlis_ai`、`/emotion/submit` route、DB physical nameは変更しません。

| 境界 | 読み方 |
|---|---|
| visible名 | `Emlisの観測` のまま。`ActionConversion` や `UnformedSelfInsight` を画面名へ出さない。 |
| public response | `input_feedback.comment_text` と `input_feedback.emlis_ai.observation_status` を維持する。構造辞書metaでpublic statusを上書きしない。 |
| backend internal | 新規relation / entryは `emlis_observation_structure_dictionary.v1.json` の内部辞書ID。DB table / columnではない。 |
| dictionary split | `emlis_observation_dictionary.v1.json` は表面素材辞書、`emlis_observation_structure_dictionary.v1.json` は構造観測辞書として分けて読む。 |
| relation condition | `thought_action_discrepancy` / `conversion_history_closure` / `priority_pressure` / `load_accumulation` は根拠条件付き。単語だけで強接続しない。 |
| meta-only | material / connection metaにraw input、public `comment_text`、完成返答文、辞書本文を流さない。 |
| Step10 | rollout block / release gate block / pre-connection stopは辞書材料で表示化しない。 |

作業時は、この構造辞書名を理由に、既存の `Emlisの観測`、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、public response key、DB physical name、RN modal条件をrenameしない。



# 2026-05-23 差分追記: Runtime Surface Gate / Shallow V2 internal名の保管境界

`mashos-api_12(8).zip` では、`runtime_surface_pre_return_gate` / `shallow_surface_realizer.v2` / `bounded_repair_reroute` / `low_information_specificity_plan` / `runtime_surface_exit_criteria` 系の内部名が増えています。これらはCocolonのvisible名、public route、DB physical name、RN modal条件ではありません。

| internal名 | 保管する意味 | 混同してはいけないもの |
|---|---|---|
| `runtime_surface_pre_return_gate` | 表示前にsurface fatalを止めるmeta-only gate | public `observation_status`、RN表示条件、response keyではない |
| `rerender_shallow_v2` | surface failure時に1回だけ許可されるbounded action | 無制限repairやGate緩和ではない |
| `reroute_low_information` | safe unit不足時などに許可されるbounded low-info reroute | どんな失敗でも表示するfallbackではない |
| `shallow_surface_realizer.v2` | shallow pathのsurface role更新 | 完成返答文テンプレ名や画面表示名ではない |
| `low_information_specificity_plan` | safe anchorがある低情報入力の狭い具体化plan | user fact捏造や過去辞書でのeligible化ではない |
| `surface_quality_blocked` | diagnostic_lockdown上の分類 | RNに出すエラー表示やpublic statusではない |
| `runtime_surface_exit_criteria` | 実機ログで確認するexit criteria helper | Render実機確認結果そのもの、Product Gate達成、release適用ではない |
| `jsonschema>=4.21.1` | 構造辞書schema validationの実行依存 | 外部AI追加や辞書schema変更ではない |

禁止: これらのinternal名を理由に、`Emlisの観測` 表示名、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、`/emotion/submit`、DB physical name、RN modal条件をrenameしない。blocked surfaceを低情報観測として無条件に表示化しない。

# 2026-05-25 差分追記: 環境状態出力観測構造 構造境界

環境状態出力観測構造は、名称変更ではなく、Cocolonの既存入力項目をどう読むかを固定する構造境界である。既存のpublic contract、DB physical name、RN表示名、API routeは変更しない。

| 既存field / 名称 | 新しい内部読み | 境界 |
|---|---|---|
| `category` | 環境ラベル / 話題方向 | 原因にしない。renameしない。 |
| `memo_action` / `action_text` | 実世界で起きたこと / したこと / 状況 | 事実以上に補完しない。 |
| `emotion_details` / `emotions` | 状態ラベル | 診断名にしない。 |
| `strength` | 状態の重さ | 原因の強さにしない。 |
| `memo` / `thought_text` | その環境・状態で外に置かれた出力内容 | 本音や結論を勝手に決めない。 |
| `created_at` / `selected_at` | 観測時点 | 1件で期間傾向にしない。 |

EmlisAIでは現在入力1件の単発観測、Pieceでは核の過圧縮防止、Analysisでは期間内の再出現観測として扱う。EmlisAIの温度をPiece / Analysisへ漏らさず、Analysisの診断・断定リスクを最も強く防ぐ。

禁止: `environment_state_output_frame` をpublic response keyにしない。`conditional_output_tendency` を1件入力から出さない。`recovery_label_path` を治療・処方・回復方法として表示しない。


# 2026-05-26 差分追記: EmlisAI ESO surface contract completion 構造境界

EmlisAI Environment State Output Surface Contract Completion は、`environment_state_output_frame` をpublic表示candidateへ接続する時の出口整合であり、名称変更・DB変更・API変更ではない。

| 境界 | 現行の読み方 | 禁止 |
|---|---|---|
| scope marker completion | 単一入力観測を期間傾向・人格傾向に見せないため、candidate surfaceに `今回の入力では` 等を補完する。 | 完成文テンプレや固定共感文として使わない。 |
| forbidden surface claim | 診断・人格化・原因断定・期間傾向・回復処方は、markerの有無に関係なくrejectする。 | markerがあることを許可理由にしない。 |
| runtime pre-return gate | normalize前補完済みでも返却直前に再確認する。 | gateを削除・緩和しない。 |
| public meta boundary | completion resultやcandidate bodyはinternal metaに留める。 | public response keyやRN表示条件にしない。 |

`environment_state_output_surface_contract_completion`、`environment_state_output_scope_marker_completion`、`environment_state_output_runtime_marker_check_performed` は内部実装/summary名であり、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、`/emotion/submit`、DB physical name、RN visible title `Emlisの観測` を置き換える名称ではない。

# 2026-05-26 差分追記: EmlisAI状態回答と人間的フォロー 構造境界

`状態回答` と `人間的フォロー` は、EmlisAI immediate response の出力思想・surface contract設計名である。Phase2-10ではbackend内部materialとして実装済みだが、Cocolon全体の基盤観測構造を置き換える名称ではなく、ユーザー表示名、public route、DB physical name、response key、RN表示条件でもない。

| 境界 | 読み方 | 禁止 |
|---|---|---|
| 状態回答 | `環境ラベル × 状態ラベル × 出力内容` をEmlisAIが「今の自分が何をしているのか」の答えとして返す出力思想。`emlis_state_answer_surface_contract` はその内部material。 | 行動指示、診断、原因断定、Analysis傾向文として扱わない。 |
| 人間的フォロー | 観測後に、入力内に見える意図・怖さ/負荷・努力・存在をEmlisの感想として受け止める層。`emlis_ai_human_follow_selector` は主役1 + 補助2 + 余韻1を選ぶ内部material。 | 人格肯定、絶対味方宣言、固定共感テンプレにしない。 |
| 観測6:フォロー4 | 基本の表示バランスを示すinternal ratio policy。`emlis_ai_state_answer_ratio_policy` がsection role / sentence plan unit / follow key数で扱う。 | UI設定名、public meta key、固定文字数ルールにしない。 |
| 自己否定例外 | felt state と identity claim を分け、入力内根拠に基づくEmlisの限定的反対意見だけを許す境界。 | 過剰慰め、人格肯定、医療・心理診断にしない。 |
| 怒り境界 | 相手評価へ同意せず、怒りの奥の大事にしていた線をユーザー側の状態として観測する境界。 | 相手攻撃への同意、関係指示、相手の内心断定にしない。 |
| 安全日常比喩 | 構造理解要求時だけ候補化する比喩material方針。`analogy_family` / `safe_daily_analogy_id` として内部扱いする。 | 自由生成、専門比喩、攻撃比喩、行動指示比喩にしない。 |
| Composer role plan | 状態回答surface contractをObservation section / Human follow sectionのrole planとして渡す。 | 完成文テンプレ、public payload、RN表示条件にしない。 |
| Gate / Public Meta boundary | forbidden claim と allowed exception を表示前に判定し、public metaは小さいsummaryだけにする。 | raw evidence、raw input、comment_text body、contract bodyをpublicへ出さない。 |
| Piece / Analysis境界 | Phase10横断contractで、EmlisAI状態回答の温度やフォロー層をPiece / Analysisへ流さない。 | PieceをEmlisの感想文にする、Analysisを単発状態回答にする。 |

作業時は、この設計名を理由に `Emlisの観測`、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、`/emotion/submit`、DB physical name、RN modal条件をrenameしない。  
Cocolon環境状態出力観測構造が「何を見るか」を固定し、本資料はEmlisAIが「どう返すか」を固定する。Piece / Analysis / Cocolon全体構造を本資料で上書きしない。


# 2026-05-28 Phase15反映: EmlisAI二段受け取り構造 / Daily Reception 構造境界

Phase15構造更新の結論: 二段受け取り構造はEmlisAI immediate responseの内部表示構造であり、Cocolon全体の名称体系、DB physical name、RN表示条件、public response shapeを変更しない。


EmlisAI二段受け取り構造は、EmlisAI immediate response の表示候補を「観測section」と「受け取りsection」に分け、既存 `input_feedback.comment_text` 内で結合する内部構造である。名称変更、DB変更、API変更、RN production UI変更ではない。

| 境界 | 現行の読み方 | 禁止 |
|---|---|---|
| `comment_text` 二段本文 | `見えたこと：
...

Emlisから：
...` を既存public key内の本文として返す。 | `observation_text` / `reception_text` のpublic key追加、RN側parse、別カード化。 |
| Shared Evidence | event fact、reaction、explicit cue、event hint、mode候補を共通根拠として扱う。 | raw input、memo、memo_action、comment_text bodyをmetaへ出す。 |
| 受け取り補助辞書 | 一般辞書ではなく、反応をどう受け取るかの内部補助material。 | 未知語意味断定、単語だけで恐怖/怒り/危険を作る、完成文テンプレ化。 |
| Reception Mode | `daily_unpleasant_reception` / `daily_positive_reception` / `self_denial_support` / `uncertainty_support` などの内部mode。 | public `observation_status` enum化、ユーザー設定モード化、RN表示条件化。 |
| Eligibility Router | 出来事 + 明示反応がある入力を低情報質問へ逃がさない。 | 情報不足でも無条件に表示する、categoryだけで原因化する。 |
| Ratio Policy | daily receptionでは観測を1文程度に軽くし、Emlisからを厚くする。 | 観測ゼロ、フォローゼロ、文字数固定、UI設定名化。 |
| Cross Gate | 二段label、順序、混線、質問逃げ、event hint感情捏造、koto splice、skeleton leakを止める。 | Gate緩和、block surfaceのpassed化、表示率目的のrepair濫用。 |
| Public Meta / Submit | two-stage gate block時は `passed + comment_text` として扱わず、保存成功と表示fail-closedを分ける。 | non-passed / meta-only / block済みsurfaceをRN表示する。 |
| RN契約 | `commentText` をそのまま表示する。表示名は `Emlisの観測` のまま。 | `見えたこと` / `Emlisから` をRN側で分解する。 |

A/B/非表示ログ1〜3の表示品質QAは、二段表示の受け入れ基準であり、runtime固定文ではない。A専用ハードコード、固定共感テンプレ、相手評価同意、自己否定の事実化、診断・人格断定・原因断定・行動指示へ変換しない。


# 2026-05-29 Phase16反映: EmlisAI TwoStage Composer Surface Connection 構造境界

Phase16構造更新の結論: 二段受け取り構造は、CompleteComposerClientの実出力から `/emotion/submit` public feedbackまで接続済みとして読む。ただし、それは既存 `input_feedback.comment_text` の本文shapeが二段になるという意味であり、Cocolon全体の名称体系、DB physical name、RN表示条件、public response shapeを変更するものではない。

| 境界 | 現行の読み方 | 禁止 |
|---|---|---|
| Section Surface Plan | `two_stage_section_surface_plan` はCompleteComposerがsection情報を読むための内部material。 | public response key化、RN表示source化、ユーザー設定化。 |
| SentencePlan section meta | `CompleteSentencePlanLine.meta` に `two_stage_section_id` 等を持つ。 | dataclass public field増設やAPI schema変更と誤読しない。 |
| SurfaceRealizer二段join | labelとjoin shapeだけを固定し、本文はSentencePlan / materialからrealizeする。 | Python固定文でA専用本文を足す、完成返答テンプレ化する。 |
| daily unpleasant surface quality | 日常不快受け取りでskeleton leakや質問逃げを避ける品質層。 | Gateを緩める、相手評価同意や危険断定を許す。 |
| Gate / self-repair reason | missing label、section empty、section meta missingなどをreason codeで切り分ける。 | reason codeをpublic status enumへ増やす、block済みsurfaceをpassed化する。 |
| `/emotion/submit` E2E | public `input_feedback.comment_text` へ二段本文が届く。 | route、request key、response top-level key、DB write pathを変える。 |
| RN Phase16-9回帰 | RNは `observation_status == passed && commentText non-empty` のまま二段本文を表示する。 | RN側で `見えたこと` / `Emlisから` をsplitし、二カード化やsplit key fallbackを作る。 |

作業時は、Phase16を「RN UI二段化」や「public schema二分割」と読まない。二段表示の正本は、既存 `comment_text` 本文内の `見えたこと：` / `Emlisから：` である。

# 2026-05-30 Phase17反映: EmlisAI TwoStage Product-Visible Fixture Completion 構造境界

Phase17構造更新の結論: 二段受け取り構造は、A/B/ログ1/ログ2/ログ3の5件fixtureで商品到達まで補完済みとして読む。ただし、それは既存 `input_feedback.comment_text` の二段本文shapeが5件で安定したという意味であり、Cocolon全体の名称体系、DB physical name、RN表示条件、public response shapeを変更するものではない。

| 境界 | 現行の読み方 | 禁止 |
|---|---|---|
| product-visible fixture | 5件fixtureは商品到達の最低受け入れ面。exact文一致ではなくshape / forbidden / feature family / metaで見る。 | fixture本文のruntime固定文化、A/B/ログ別case_id専用runtime分岐。 |
| internal role phrase | `achievement` / `positive state` / `perfection fear` などは内部role語であり、表示本文へ出さない。 | 英語role語の本文表示、一般辞書で意味断定。 |
| mode-specific surface policy | reception mode / section / role familyから商品surfaceへ寄せる。 | public mode追加、ユーザー設定化、完成返答テンプレ化。 |
| section budget | mode別にobservation / reception配分を正規化する内部policy。 | RN表示分割、public `observation_text` / `reception_text` key追加。 |
| Gate強化 | internal role leak / relation skeleton leakをfail-closedで止める。 | Gate緩和、block済みsurfaceのpassed化。 |
| grounding relation binding | effort / pace系の関係文を、根拠と関係表現がある場合だけ通す。 | `unsupported_sentence_allowed` や `relation_not_expressed_allowed` をtrueにする。 |
| self-repair reason | repair可能なsurface問題とdiagnostic-only分類を分ける。 | raw input直貼り、固定本文挿入、public meta本文格納。 |
| `/emotion/submit` 5件E2E | 保存後public feedbackまで5件二段本文が届くことを確認する。 | route、request key、response top-level key、DB write pathを変える。 |
| RN Phase17-9回帰 | RNは5件二段本文を既存 `commentText` としてそのまま保持する。 | RN側で `見えたこと` / `Emlisから` をsplitし、二カード化する。 |

作業時は、Phase17を「表示率を上げるためにGateを緩めた」と読まない。Phase17は、Gateを通れる商品surfaceをComposer / SentencePlan / SurfaceRealizer / Grounding側で作り、悪いsurfaceは引き続きfail-closedにする補完である。


# 2026-05-30 差分追記: EmlisAI Phase18 商品品質安定化 internal名の保管境界

`mashos-api_12(10).zip` では、Phase18 Product Quality Stabilization により、`product_quality_regression_matrix` / `two_stage_applicability_decision` / `low_information_public_repair_contract` / `two_stage_mode_context` / `meta_only_sanitizer` / `diagnostic_failure_taxonomy` / `visible_readability_quality` 系の内部名が増えている。これらは名称変更ではなく、EmlisAIが既存 `input_feedback.comment_text` とRN `passed + commentText` 契約を壊さず商品品質へ寄せるためのbackend内部境界である。`Emlisの観測` のvisible名、`input_feedback.comment_text`、`input_feedback.emlis_ai`、`/emotion/submit` route、DB physical nameは変更しない。

| 境界 | 読み方 |
|---|---|
| product quality matrix | Phase18対象の基準面をmeta-onlyで固定するtest helper。赤を仕様として許容するものではない。 |
| TwoStage applicability | 二段label必須判定を必要経路だけに限定し、低情報・legacy・pre-connection経路をlabel missingで巻き込まない。 |
| low-information repair | 短い低情報入力だけをpublic repairへ戻す。safety / scope / AP0 / provided candidate / positive recoveryを隠さない。 |
| mode context | daily_unpleasantを `reception_mode_id` / `ratio_reason` でSurfaceRealizerへ伝搬する。case_id固定文ではない。 |
| meta-only sanitizer | `surface_policy`、辞書本文、raw input、comment_text bodyをpayloadへ出さない。 |
| diagnostic taxonomy | canonical分類とlegacy aliasで表示不可理由を整理する。public status enumではない。 |
| visible readability | 本文を内部検査しても、reportにはrule id / count / actionだけを残す。 |
| public E2E / RN contract | `/emotion/submit` とRNは既存 `input_feedback.comment_text` / `passed + commentText` 契約を維持する。 |

作業時は、このPhase18名を理由に、既存の `Emlisの観測`、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、public response key、DB physical name、RN modal条件をrenameしない。
# 2026-06-01 差分追記: EmlisAI Phase20 internal名の保管境界

`mashos-api_12(12).zip` では、Phase20撤回保持再設計により、`response_kind` / `safety_triage_kind` / `input_material_bundle` / `material_quality` / `gate_recovery_loop` / `generic_sentence_plan_surface` / `response_contract_qa_matrix` 系の内部名が増えている。これらは名称変更ではなく、EmlisAIが既存 `input_feedback.comment_text` とRN `passed + commentText` 契約を壊さず、Phase19個別routeから汎用観測返答へ戻るためのbackend内部境界である。`Emlisの観測` のvisible名、`input_feedback.comment_text`、`input_feedback.emlis_ai`、`/emotion/submit` route、DB physical nameは変更しない。

| internal名 | 保管する意味 |
|---|---|
| response_kind | public statusではなく、EmlisAI内部の応答種別。 |
| safety_triage_kind | emergency safetyと自己否定安全応答を分ける内部分類。 |
| input_material_bundle / material_quality | 入力束から見える材料量・不明slotを判断する内部material。 |
| low_information_observation | 低情報入力を無応答にしない内部branch。 |
| gate_recovery_loop / repair_attempts | Gate failure後の短縮・限定・再生成・低情報/安全応答の内部履歴。 |
| generic_sentence_plan_surface | C/D専用modeではなく汎用sentence planでsurface化する内部mode。 |
| response_contract_qa_matrix | exact本文一致ではなくfamily品質で見るQA helper。 |

作業時は、このPhase20名を理由に、既存の `Emlisの観測`、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、public response key、DB physical name、RN modal条件をrenameしない。
