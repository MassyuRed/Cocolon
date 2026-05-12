---
doc_id: cocolon_karen_read_first
title: "華恋用 READ FIRST"
revision_date: "2026-05-11"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
source_snapshot:
  premise: "Cocolon_前提資料(65).zip"
  Cocolon: "Cocolon_15(1).zip"
  mashos-api: "mashos-api_15(2).zip"
file_counts:
  Cocolon: 200
  mashos-api: 414
  total: 614
purpose: "華恋が作業前にCocolonのファイル構成・コード構成・名称混在境界を復元するための作業用地図"
coverage:
  total_files: 614
  included_in_overall_structure: 614
  included_in_national_system: 614
  excluded_from_main_body: 0
---

# これは何か

この一式は、**華恋の作業精度を上げるための作業用地図**です。  
Mash様への作業報告書や、残タスクを記録する場所ではありません。

前提資料で残すものは、次の3種類です。

1. **Cocolonの全体構造**  
   RN画面、hook、frontend API境界、backend public API、gateway、worker、test、rule file のつながり。

2. **国家システム**  
   `Input Gate -> Save API -> Dispatch -> Snapshot / Queue / Worker -> Publish / Access Policy -> Read API / Startup -> RN display` の流れ。

3. **その他の構造情報**  
   DB physical name、bridge view、legacy façade、contract、policy、rename境界、命名混在の保管情報。

# 前提資料の在り方

- 前提資料は、**タスク管理表ではありません**。
- 「次にやること」ではなく、**今のアプリがどのファイル構成で動いているか**を残します。
- 名称混在は、無理に解決せず、**どの旧名称が何の互換・DB境界・runtime ownerとして残っているか**を資料で保管します。
- 華恋は、作業時にこの資料を読んで、旧名称を見つけても即renameしません。
- 修正対象にするのは、稼働、public contract、API接続先、DB write path、account delete、access policy、ユーザーデータ保護に影響する箇所だけです。
- Piece関係は、Mash様が明示していない限り、Piece専用工程として扱います。

# 最新基準面

この版の基準面は次です。

| source | file count | 位置づけ |
|---|---:|---|
| `Cocolon_15(1).zip` | 200 | RNアプリ本体。今回差分なし |
| `mashos-api_15(2).zip` | 414 | backend / API / worker / docs / tests。共通文章生成基盤と三大中核接続を含む |
| total | 614 | 前提資料の構造coverage対象 |

`Cocolon_15(1).zip` / `mashos-api_15(2).zip` では、RN巨大画面分割と本番運用監視の構造を維持したうえで、`cocolon_text_generation_core` が三大中核の共通文章生成基盤として追加されています。  
EmlisAI本文は、旧 `input_feedback_text_templates` や固定文fallbackではなく、Evidence Ledger / 複数視点Observer / ObservationGraph / LimitedComposer / 共通Core / Reader・Grounding・Template Guard / Display Gate のfail-closed構造として読む。Pieceは短縮要約ではなく、ユーザーが言いたい核を `source_claims` / `must_keep_signal_keys` とともに共通Coreへ通す構造として読む。Analysisは診断・断定ではなく、素材domainを分けた観測レポートを共通Coreで安全確認する構造として読む。画面分割は機能追加ではなく、entry shellを維持した保守性改善として読む。

# 読む順

## 1. 入口

1. `00_華恋用_READ_FIRST.md`
2. `03_Cocolon_命名体系.md`
3. `09_Cocolon_名称混在保管と構造境界_2026-05-10.md`

この3つで、華恋は「見えている名前」と「実際に動いているファイル名・API名・DB名」が違う可能性を先に固定します。

## 2. 全体構造

1. `01_Cocolon_全体構造資料.md`
2. `01A_Cocolon_全体構造資料_アプリ基盤とHome系.md`
3. `01B_Cocolon_全体構造資料_Analysis_Piece_EmotionLog_Ranking系.md`
4. `01C_Cocolon_全体構造資料_Account_Subscription_Backend支援系.md`

`01` 系は、Cocolonをrepo単位ではなく、**feature / flow / system単位**で読むための資料です。

## 3. 国家システム

1. `02_Cocolon_国家システム資料.md`
2. `02A_Cocolon_国家システム資料_Input_Save_Dispatch系.md`
3. `02C_Cocolon_国家システム資料_契約_境界_検証系.md`

`02` 系は、入力が保存され、queue / worker / snapshot / read-side / RN display に流れる全体を確認する資料です。`02B_Cocolon_国家システム資料_Snapshot_Worker_Publish_Read系.md` はこの前提資料zip内に存在するため、Snapshot / Worker / Publish / Read は `02B` を正本として読み、`02` 本体、`02C`、`07` の差分追記で補助します。

## 4. 境界・rule・DB

1. `05_Cocolon_ルールファイル索引`
2. `06_Cocolon_ファイル名変更保留台帳.md`
3. `07_Cocolon_最新スナップショット差分`
4. `03_Cocolon_命名体系.md` / `09_Cocolon_名称混在保管と構造境界_2026-05-10.md`

`05` は contract / policy / guard、`06` はファイル名・旧名称の保管、`07` は最新zipとの差分確認、`08` はDB physical name / bridge / rename境界、`03` / `09` は名称混在・DB物理名の読み分けを補助する資料です。`08_Cocolon_DB_rename_boundary.md` は存在しますが、DB physical rename / drop / write path変更はMash様が明示した場合だけ扱います。

# 最新アプリ構造で特に見る場所

| 構造 | current file | 役割 |
|---|---|---|
| API base URL | `Cocolon/lib/apiClient.js` | `API_BASE_URL` の正本。App.jsはここを読む |
| App runtime | `Cocolon/AppRuntimeContext.js` | `/app/bootstrap` を取得し、feature flag / version状態を保持 |
| App root | `Cocolon/App.js` | provider / navigation / bootstrap gate / push起動処理 |
| account delete | `Cocolon/screens/SettingsOtherScreen.js` | `account_delete_enabled` と二段階確認を扱う |
| local cleanup | `Cocolon/lib/accountLocalCleanup.js` | 退会後の端末内ユーザー別cache削除 |
| Today Question | `Cocolon/features/home/useHomeState.js` / `Cocolon/screens/TodayQuestionHistoryScreen.js` | `today_question_enabled` / `today_question_history_enabled` を読む |
| subscription sales | `Cocolon/screens/SubscriptionSelectScreen.js` | `subscription_sales_enabled` を読む |
| push token | `Cocolon/lib/pushToken.js` | releaseではtoken prefix logを出さない |

# 作業時のルール

1. まず `03` と `09` で名称混在を確認する。
2. 次に `01` でファイル構成を確認する。
3. 国家システムやworker・access policyに関係する場合は `02` 系を確認する。DB physical rename / drop / write path変更は今回扱わない。
4. public API / request / response / entitlement / startup / auth / account delete / subscription を触る場合は `05` を確認する。
5. 旧名称を見つけても、資料で保管されている互換・DB境界なら rename しない。
6. 修正する場合は、関係ファイルだけを触る。
7. ユーザーが指示していない導線・機能・画面は追加しない。
8. ユーザーにJWT、curl、PowerShellなどの開発者前提操作を求めない。

# この版での主な構造更新

- `Cocolon/AppRuntimeContext.js` を `App root / runtime boundary` として資料化。
- `App.js` の API base URL は `lib/apiClient.js` の `API_BASE_URL` に一本化済みとして資料化。
- `App.js` の Supabase `access_token` ログ削除済みとして資料化。
- `/app/bootstrap` の `feature_flags` / version情報は、`AppRuntimeContext.js` を通じてアプリ側で使う構造として資料化。
- `account_delete_enabled` / `today_question_enabled` / `today_question_history_enabled` / `subscription_sales_enabled` のRN側消費先を資料化。
- `accountLocalCleanup.js` のユーザー別analysis cache cleanupを資料化。
- `pushToken.js` のtoken prefix logはdebug build限定として資料化。
- `09` を残タスク資料ではなく、名称混在を保管する構造境界資料へ変更。


# 2026-05-05 差分追記: EmlisAI / Piece / Tutorial / Subscription current boundary

この版の基準面は `Cocolon(138).zip` / `mashos-api_2(26).zip` です。前提資料は、旧版の作業記録ではなく **現状構造を読むための地図** として更新します。

| 構造 | current owner | 現状の読み方 |
|---|---|---|
| EmlisAI immediate reply | `emlis_ai_reply_service.py` + `emlis_ai_world_model_service.py` + `emlis_ai_observation_kernel.py` | `読解 -> 意味分解 -> 文章構成 -> 自然文生成 -> final review / quality gate -> safe fallback` の汎用pipeline |
| EmlisAI meaning layer | `emlis_ai_user_word_anchor_service.py` / `emlis_ai_phrase_shaping_service.py` / `emlis_ai_input_meaning_block_service.py` / `emlis_ai_understanding_frame_service.py` | 例文固有語句ではなく、現在入力から抽出した汎用意味カテゴリで扱う |
| EmlisAI composition layer | `emlis_ai_response_composition_service.py` | 長文入力では、入口 / 背景 / 緊張・限界 / 気づき / 新しい向き / 安心文 の順で返答構成を作る |
| EmlisAI guard layer | `emlis_ai_reply_final_review_service.py` / `emlis_ai_quality_gate.py` / `emlis_ai_safe_reply_fallback_service.py` | 破綻文、例文特化、情報不足、構成不足を返答前に検出し、現在入力に基づくfallbackへ切り替える |
| Piece生成 | `emotion_piece_generation_service.py` + `piece_generated_display.py` + `piece_generation_policy.py` | 簡潔化優先ではなく、入力全体の核を他者に伝わる一問一答へ整える。core answer をdisplay layerで汎用文へ潰さない |
| Tutorial fixture | `TutorialFlowScreen.js` / `tutorialScenarioData.js` / `tutorialFixtures.generated.json` / `generate_tutorial_fixtures.py` | runtime UIとは分けた固定fixture。実生成サービスから作るが、アプリ内ではtutorial表示用の静的データとして読む |
| Subscription plan copy | `iapRuntimeCatalog.js` / `SubscriptionSelectScreen.js` / `subscription_bootstrap_store.py` | Plus / Premium の表示文言は frontend runtime catalog と backend bootstrap catalog の両方で同期する |

作業時は、例文入力を runtime 条件として実装しません。例文はテストケースであり、runtime は汎用構造で処理します。


# 2026-05-07 差分追記: 三大中核構造 value observation current boundary

この版の基準面は `Cocolon_前提資料(48).zip` / `Cocolon(138).zip` / `mashos-api_2(26).zip` です。前提資料は、旧版の作業記録ではなく **現状構造を読むための地図** として差分更新します。

| 構造 | current owner | 現状の読み方 |
|---|---|---|
| 共通価値観測 layer | `value_observation_types.py` + `cocolon_value_observation_service.py` | 三大中核構造が共有する source-grounded な観測信号。例文固定返答ではなく、現在入力から汎用 signal を抽出する |
| EmlisAI value observation接続 | `emlis_ai_world_model_service.py` + `emlis_ai_observation_kernel.py` + `emlis_ai_reply_service.py` + `emlis_ai_quality_gate.py` + `emlis_ai_safe_reply_fallback_service.py` | value observation signal を world model / candidate / meta / fallback / gate にadditive接続する |
| Piece value observation接続 | `emotion_piece_generation_service.py` + `piece_generation_policy.py` | signal から問い・答えを作り、`must_keep_signal_keys` / `source_claims` / `overcompression_risk` を meta として保持する |
| Analysis value observation境界 | `analysis_report_validity_gate.py` | `value_observation_signals` をself_structure系素材として扱えるようにし、emotion domainへ混ぜない |
| 回帰test | `test_cocolon_value_observation_service.py` / `test_emlis_ai_value_observation_cases.py` / `test_emotion_piece_generation_value_observation.py` / `test_analysis_value_observation_boundary.py` | 5つの観測signalを固定文一致ではなく構造signalとして検証する |

この版で本文未記載だった現行ファイルは、`01` / `02` / `07` に差分追記してcoverageへ含める。`02B_Cocolon_国家システム資料_Snapshot_Worker_Publish_Read系.md` と `08_Cocolon_DB_rename_boundary.md` は、今回入力された前提資料zip内に存在するため、それぞれ Snapshot / Worker / Publish / Read と DB physical name / bridge / rename 境界の正本として読む。DB physical rename / drop / write path変更はMash様が明示した場合だけ扱う。


# 2026-05-09 差分追記: latest実ファイル基準 / 今日の問い personal followup / 通知・Tutorial補正

この版の最新基準面は `Cocolon_前提資料(48).zip` / `Cocolon(138).zip` / `mashos-api_2(26).zip` です。最新実ファイルのcoverage対象は `Cocolon` 125件、`mashos-api` 340件、合計465件です。`02B_Cocolon_国家システム資料_Snapshot_Worker_Publish_Read系.md` と `08_Cocolon_DB_rename_boundary.md` は前提資料内に存在するため、作業時の参照先として扱います。

| 構造 | current owner | 読み方 |
|---|---|---|
| 今日の問い static層 | `mashos-api/ai/services/ai_inference/today_question_store.py` / `today_question_bank` / `today_question_sequence` / `today_question_user_progress` | 既存100問テンプレを `static_role_probe` として維持する。personal回答ではstatic sequenceを進めない |
| 今日の問い personal_followup層 | `mashos-api/ai/services/ai_inference/today_question_personal_candidate_service.py` / `mashos-api/ai/services/ai_inference/today_question_personal_question_service.py` / `mashos-api/ai/services/ai_inference/today_question_personal_templates.py` | Premiumのみ、emotion入力の原文アンカーから固定選択肢つき深掘り問いを作る。AI生成文をユーザー発言として表示しない |
| 今日の問いAPI拡張 | `mashos-api/ai/services/ai_inference/api_today_question.py` / `mashos-api/ai/services/ai_inference/home_gateway/today_question_command_service.py` / `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py` | `question_origin` / `personal_question_id` / `source_anchor` / `source_anchor_hash` をadditive fieldとして扱う |
| 今日の問いRN送信 | `Cocolon/features/home/useHomeActions.js` / `Cocolon/components/TodayQuestionCard.js` / `Cocolon/screens/TodayQuestionHistoryScreen.js` | question本文とchoicesは既存UIで表示し、submit時にpersonal guard fieldを送る。履歴では `入力: 「...」` の短いアンカーだけ表示する |
| self_structure接続 | `mashos-api/ai/services/ai_inference/astor_material_snapshots.py` / `mashos-api/ai/services/ai_inference/analysis_engine_adapter.py` | 今日の問い回答をself-only素材として `question_origin` / `question_type` / `source_anchor` / hidden_meta込みで渡す。public面へは出さない |
| account delete | `mashos-api/ai/services/ai_inference/account_delete_service.py` | personal candidate / personal question も削除対象に含める |
| DB migration | `today_question_personal_followup_v1.sql` | `today_question_personal_candidates` / `today_question_personal_questions` 追加、`today_question_answers` にadditive field追加。SQLは別ファイルとして受領・実行済み |
| 感情通知Push | `mashos-api/ai/services/ai_inference/api_emotion_submit.py` / `.env.worker.example` | local/API-onlyではqueueを高負荷mode依存にし、queue modeではAPI側Firebase credential gateでenqueueを止めない。worker profile例は `all` |
| Tutorial | `Cocolon/tutorial/tutorialScenarioData.js` / `Cocolon/screens/InputScreen.js` / `Cocolon/screens/NexusScreen.js` / `Cocolon/screens/TutorialFlowScreen.js` | `Emlis（エムリス）` 表記、感情選択/カテゴリ選択の別フェーズ、Home説明時のsummary/history非表示、ピース説明文修正を反映 |

作業時は、今日の問いを触る場合、既存100問を消さず、`personal_followup` はPremium向けの追加層として扱います。通知文には原文アンカーを出さず、画面内だけで短い引用を表示します。

# 2026-05-09 差分追記: GitHub正本の再現性確認

この確認は、ローカルで受領した軽量zipだけではなく、GitHub上の `MassyuRed/Cocolon` 正本を基準にして行う。  
ローカルzipにnative project / config / support scriptが含まれていない場合でも、GitHub正本に存在するものは「実体欠落」ではなく、容量都合でローカル受領物から外れているものとして扱う。

| 確認項目 | GitHub上の状態 |
|---|---|
| `Cocolon/scripts/postinstall.js` | 存在。stale patchを `.skipped-by-postinstall` へ一時退避し、`patch-package` を実行後に元へ戻す処理を持つ |
| `Cocolon/scripts/reset-project.js` | 存在。`package.json` の `reset-project` script に対応するfile |
| `Cocolon/android/app/build.gradle` | 存在。release signing、Hermes、minify、`ANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON`、ABI filter等を持つAndroid release構成 |
| `Cocolon/ios/Podfile` | 存在。iOS 15.1、static frameworks、Firebase static framework、CI archive時のbundle code signing抑制を持つ |
| `Cocolon/babel.config.js` | 存在。React Native babel preset と Reanimated plugin を設定 |
| `Cocolon/metro.config.js` | 存在。`react-native-svg-transformer` と svg resolver を設定 |
| `Cocolon/eslint.config.js` | 存在。Expo ESLint flat config を設定 |
| `Cocolon/tsconfig.json` | 存在。`strict: true` と `@/*` path alias を設定 |
| `Cocolon/.github/workflows/ios-build.yml` | 存在。checkout、Node setup、Pod install、署名、archive、export、TestFlight uploadまでを扱う |

このため、`Cocolon(136).zip` 等のローカルzipに上記pathが含まれていない場合でも、GitHub正本では「再現できるソース」の主要構成は存在するものとして読む。  
`android/key.properties`、iOS証明書、provisioning profile、GitHub Secrets はsource fileではなくsecret管理対象であり、前提資料上の欠落扱いにしない。



# 2026-05-09 差分追記: current参照の実ファイル再照合

この版では、前提資料 `Cocolon_前提資料(48).zip` を、実ファイル `Cocolon(138).zip` / `mashos-api_2(26).zip` と再照合した。
GitHub正本で存在確認済みの native project / config / support script は、ローカル軽量zip未収録でも欠落扱いにしない。
一方で、旧MyWeb / MyModel / Echoes / Discoveries / EmotionReflection系の個別file名が旧本文内で `active` / `shared` / `legacy-live` として残っている箇所は、current実ファイルownerではなく、名称混在・legacy境界の保管情報として読む。

current作業では、次の読み替えを優先する。

| 旧系統 | current実ファイルowner |
|---|---|
| MyWeb系screen | `Analysis*` screen群 |
| MyModel系screen | `Piece*` / `Nexus*` / `Resonance*` screen群 |
| Echoes history | `ResonanceHistoryListScreen.js` / `ResonanceHistoryDetailScreen.js` |
| EmotionReflection frontend | `EmotionPiecePreviewModal.js` / `lib/api/home/emotionPieceApi.js` |
| Discoveries/Questions ranking旧screen | `RankingTopScreen.js` と current ranking screen群。単独旧screenはcurrent実ファイルではない |
| `api_ranking_mymodel_discoveries.py` | currentでは存在しない。`api_ranking.py` / `api_ranking_piece_views.py` / `api_ranking_piece_resonances.py` / `api_ranking_mymodel_views.py` / `api_ranking_mymodel_resonances.py` を確認する |

この補正により、旧本文に残る旧pathを見つけても即renameしない。current修正対象は実ファイル一覧に存在するownerへ寄せる。

# 2026-05-09 差分追記: RN巨大画面分割 / 本番運用監視 current boundary

この版の最新基準面は `Cocolon_前提資料(51).zip` / `Cocolon_12(3).zip` / `mashos-api_4(10).zip` です。実ファイルのcoverage対象は `Cocolon` 200件、`mashos-api` 342件、合計542件です。

今回の実ファイルでは、RN巨大画面分割の Phase 0〜2 / 4〜9 と、本番運用監視の最小構成がcurrentへ入っています。分割は機能追加ではなく、既存route / API契約 / DB境界を維持したまま entry shell と submodule に責務を分ける保守性改善として読む。

| 構造 | entry shell / current owner | 読み方 |
|---|---|---|
| App root | `Cocolon/App.js` + `Cocolon/navigation/*` + `Cocolon/runtime/*` | `App.js` はprovider / NavigationContainer / 初期push接続を持つ薄い入口。root stack / tab / linking / notification routing は navigation配下を読む |
| Home / Input | `Cocolon/screens/InputScreen.js` + `Cocolon/screens/input/*` | InputScreenはentry shell。下書き、入力高さ、感情/カテゴリ/memo UI、Piece preview modal、startup modalをinput配下で読む |
| Nexus | `Cocolon/screens/NexusScreen.js` + `Cocolon/screens/nexus/*` | feed / emotion log / recommend / history / owner picker のUIとnormalizeをnexus配下で読む。API呼び出し境界は既存のまま |
| Analysis report viewer | `Cocolon/screens/AnalysisReportViewerScreen.js` + `Cocolon/screens/analysisReport/*` | report normalize、format、HTML/PDF export、chart、subscription gateをanalysisReport配下で読む |
| Analysis home | `Cocolon/screens/AnalysisScreen.js` + `Cocolon/screens/analysis/*` | route state、unread、report action、self-structure action、tutorial overlayをanalysis配下で読む |
| Account | `Cocolon/screens/AccountScreen.js` + `Cocolon/screens/account/*` | profile、follow、visibility、subscription、ID検索をaccount配下で読む。account delete ownerは引き続き `SettingsOtherScreen.js` |
| Piece home | `Cocolon/screens/PieceScreen.js` + `Cocolon/screens/piece/*` | Piece home action、tutorial create、recommend users、global summaryをpiece配下で読む |
| Piece library | `Cocolon/screens/PieceLibraryScreen.js` | Phase 3は今回未実装。PieceLibraryはまだentry shell単独の大きなownerとして読む |
| RN screen test | `Cocolon/tests/rn-screen-contracts.test.js` | 分割後moduleの存在とentry shell接続を検査する軽量screen contract test |
| 本番運用監視 | `Cocolon/lib/monitoring.js` + `mashos-api/ai/services/ai_inference/api_client_events.py` | 外部SDK追加なしで、RN側client event / API error / bootstrap/push/IAP errorを `/ops/client-events` へbest-effort送信し、backendでredact済みstructured logへ出す |

作業時は、旧画面pathが薄くなっていても削除対象とは見なさず、`App.js` / 各screenは navigation から参照されるentry shellとして扱う。DB physical name / public API route / navigation route名は今回の分割では変更しない。

# 2026-05-09 差分追記: EmlisAI multi-perspective observation current boundary

この版の最新基準面は `Cocolon_前提資料(54).zip` / `Cocolon_6(28).zip` / `mashos-api_6(8).zip` です。最新実ファイルのcoverage対象は `Cocolon` 200件、`mashos-api` 356件、合計556件です。

| 構造 | current owner | 読み方 |
|---|---|---|
| Emlisの観測 runtime | `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | `render_emlis_ai_reply()` は `multi_perspective_observation.v1` のorchestrator。旧ObservationKernelの固定文経路、旧safe fallback、`input_feedback_text_templates` をEmlis観測本文として使わない |
| Evidence Ledger | `emlis_ai_evidence_ledger_service.py` | `current_input` から `EvidenceSpan` を作る。ここでは解釈文・表示文を作らない |
| 複数視点Observer | `emlis_ai_perspective_observers.py` / `emlis_ai_perspective_board.py` | 明示内容、感情、葛藤、圧迫、限界、自己認識、価値/強さ、相手モデル、安全境界を `PerspectiveReport` として分ける |
| 統合構造 | `emlis_ai_observation_integrator_service.py` | `PerspectiveBoard` を `ObservationGraph` へまとめる。本文生成はここでは行わない |
| 会話文生成 | `emlis_ai_conversation_composer_service.py` | `ObservationGraph` と `EvidenceSpan` から、ユーザーに向けた観測文を作る。設計上は固定文fallbackを置かない |
| 読解・根拠・テンプレGuard | `emlis_ai_listener_reader_judge.py` / `emlis_ai_grounding_judge.py` / `emlis_ai_template_echo_guard.py` | 出力文の理解可能性、原文根拠、旧文型・復唱類似を判定する |
| 表示停止Gate | `emlis_ai_display_gate.py` | `passed` 以外は `comment_text` を空にし、`observation_status` を `rejected` / `unavailable` / `safety_blocked` として扱う |
| RN表示制御 | `screens/input/useInputFeedbackModal.js` / `InputFeedbackReplyModal.js` / `InputScreen.js` | `observation_status` が存在し、`passed` でない場合はモーダルを開かない。空本文も表示しない |
| API互換 | `api_emotion_submit.py` / `emotion_submit_service.py` | `input_feedback.comment_text` は互換維持。ただしfail-closed時は空になり、API responseでは `input_feedback` 自体が省略されうる。詳細metaは `input_feedback.emlis_ai.observation_status` に置く |

作業時は、`Emlisからの返答` / `Emlisからの応答` というvisible旧名を見つけたら `Emlisの観測` に寄せる。ただし `input_feedback.comment_text`、`emlis_ai` meta、DB/API物理名は互換維持のため一括renameしない。

# 2026-05-10 差分追記: EmlisAI Phase8 LimitedComposer quality current boundary

この版の最新基準面は `Cocolon_前提資料(60).zip` / `Cocolon_8(6).zip` / `mashos-api_9(2).zip` です。最新実ファイルのcoverage対象は `Cocolon` 200件、`mashos-api` 374件、合計574件です。

Phase8は、`Emlisの観測` の起動条件変更ではなく、既に接続された B案 LimitedComposer の本文品質改善として読む。固定文テンプレや外部LLMを追加せず、EvidenceSpanから本文化可能な短い根拠句を作り、観測profileとsentence planを通して自然な短文へ寄せる。

| 構造 | current owner | 読み方 |
|---|---|---|
| LimitedComposer本文生成 | `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_client.py` | `EmlisPhraseUnit` / `ObservationProfile` / `SentencePlan` を使い、scoped graph内の根拠だけを2〜4文へ組み立てる。外部AIは呼ばない |
| Phase8文品質Guard | `emlis_ai_limited_sentence_quality_guard.py` | 感情ラベル単独行、未完了断片、`がつながっています` / `同じ中にあります` 系の破綻表面を機械的に落とす |
| Scope Gate補正 | `emlis_ai_limited_observation_scope_service.py` | 関係性葛藤や実ユーザー型のように、根拠ある関係構造を `eligible` にできるよう補正する |
| Evidence / Observer補正 | `emlis_ai_evidence_ledger_service.py` / `emlis_ai_perspective_observers.py` | Phase8 profile判定に必要な原文根拠と観測claimを取り落とさないよう補正する |
| Template / Display Gate補正 | `emlis_ai_template_echo_guard.py` / `emlis_ai_display_gate.py` | Phase8 quality reportをDisplay traceへ残し、破綻文を `passed` にしない |
| Phase8回帰fixture | `ai/tests/fixtures/emlis_ai_phase8_cases.py` | 華恋提示6ケース＋実ユーザー入力1ケースの計7ケースを品質回帰fixtureとして保持する |
| Phase8回帰test | `ai/tests/test_emlis_ai_phase8_real_input_quality.py` | 正解文一致ではなく、must_keep構造・禁止表面・passed/rejected制御で検証する |

作業時は、Phase8を「EmlisAIが全入力を理解できるようになった」とは読まない。B案のまま、根拠がある範囲だけを自然な観測文へ整える段階として扱う。短く曖昧な入力は、引き続き非表示または浅い受け取りだけが許容範囲です。


# 2026-05-11 差分追記: 共通文章生成基盤の読み方

`mashos-api_15(2).zip` では、三大中核の文章出力を共通品質基盤で支える `cocolon_text_generation_core` が追加されています。これは中核の出力目的を統一する層ではなく、品質・根拠・安全だけを横断で見る層です。

| 中核 | 既存公開契約 | 共通基盤との関係 | 変更禁止境界 |
|---|---|---|---|
| EmlisAI | `input_feedback.comment_text` / `observation_status=passed` のみ表示 / 表示名 `Emlisの観測` | `EmlisObservationComposer` adapterで候補文を共通Coreへ通す | 表示名、route、DB、passed-only制御を変えない |
| Piece | `piece_text` / preview-publish同一性 / legacy名 `reflection`・`mymodel_qna` | `PieceComposer` adapterで問い・答えを分離し、過圧縮と根拠欠落を検査する | preview時本文をpublish時に再生成しない |
| Analysis | `content_json` / `standardReport` / `contentText` | `AnalysisComposer` adapterとvalidity gateで非診断・非断定を検査する | payload shape、DB物理名、routeを変えない |

共通Core作業では、`03_Cocolon_命名体系.md`、`05_Cocolon_ルールファイル索引`、`09_Cocolon_名称混在保管と構造境界_2026-05-10.md` を先に読む。DB physical name / public API route / response key / visible名は、この差分では変更されていません。
