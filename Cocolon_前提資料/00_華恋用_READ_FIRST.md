---
doc_id: cocolon_karen_read_first
title: "華恋用 READ FIRST"
revision_date: "2026-05-07"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
source_snapshot:
  premise: "Cocolon_前提資料(40).zip"
  Cocolon: "Cocolon(132).zip"
  mashos-api: "mashos-api_2(23).zip"
file_counts:
  Cocolon: 125
  mashos-api: 336
  total: 461
purpose: "華恋が作業前にCocolonのファイル構成・コード構成・名称混在境界を復元するための作業用地図"
coverage:
  total_files: 461
  included_in_overall_structure: 461
  included_in_national_system: 461
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
| `Cocolon(132).zip` | 125 | RNアプリ本体 |
| `mashos-api_2(23).zip` | 336 | backend / API / worker / docs / tests |
| total | 461 | 前提資料の構造coverage対象 |

`Cocolon(132).zip` / `mashos-api_2(23).zip` では、EmlisAI / Piece / Analysis に共通する value observation layer が追加され、三大中核構造の観測信号を共有する構造が現行基準へ更新されています。  
EmlisAI / Piece は例文特化ではなく、汎用意味カテゴリ・文章構成・最終品質Gateで読む構造として扱います。Pieceは短縮要約ではなく、ユーザーが言いたいことを他者へ伝わる形へ昇華する構造として読む。

# 読む順

## 1. 入口

1. `00_華恋用_READ_FIRST.md`
2. `03_Cocolon_命名体系.md`
3. `09_Cocolon_名称混在保管と構造境界_2026-04-30.md`

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

`02` 系は、入力が保存され、queue / worker / snapshot / read-side / RN display に流れる全体を確認する資料です。今回入力された前提資料zipには `02B_Cocolon_国家システム資料_Snapshot_Worker_Publish_Read系.md` が存在しないため、Snapshot / Worker / Publish / Read は `02` 本体、`02C`、`07` の差分追記から読む。

## 4. 境界・rule・DB

1. `05_Cocolon_ルールファイル索引`
2. `06_Cocolon_ファイル名変更保留台帳.md`
3. `07_Cocolon_最新スナップショット差分`
4. `03_Cocolon_命名体系.md` / `09_Cocolon_名称混在保管と構造境界_2026-04-30.md`

`05` は contract / policy / guard、`06` はファイル名・旧名称の保管、`07` は最新zipとの差分確認、`03` / `09` は名称混在・DB物理名の読み分けを補助する資料です。今回入力された前提資料zipには `08_Cocolon_DB_rename_boundary.md` が存在しないため、DB physical rename / drop / write path変更は扱わない。

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

この版の基準面は `Cocolon(132).zip` / `mashos-api_2(23).zip` です。前提資料は、旧版の作業記録ではなく **現状構造を読むための地図** として更新します。

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

この版の基準面は `Cocolon_前提資料(40).zip` / `Cocolon(132).zip` / `mashos-api_2(23).zip` です。前提資料は、旧版の作業記録ではなく **現状構造を読むための地図** として差分更新します。

| 構造 | current owner | 現状の読み方 |
|---|---|---|
| 共通価値観測 layer | `value_observation_types.py` + `cocolon_value_observation_service.py` | 三大中核構造が共有する source-grounded な観測信号。例文固定返答ではなく、現在入力から汎用 signal を抽出する |
| EmlisAI value observation接続 | `emlis_ai_world_model_service.py` + `emlis_ai_observation_kernel.py` + `emlis_ai_reply_service.py` + `emlis_ai_quality_gate.py` + `emlis_ai_safe_reply_fallback_service.py` | value observation signal を world model / candidate / meta / fallback / gate にadditive接続する |
| Piece value observation接続 | `emotion_piece_generation_service.py` + `piece_generation_policy.py` | signal から問い・答えを作り、`must_keep_signal_keys` / `source_claims` / `overcompression_risk` を meta として保持する |
| Analysis value observation境界 | `analysis_report_validity_gate.py` | `value_observation_signals` をself_structure系素材として扱えるようにし、emotion domainへ混ぜない |
| 回帰test | `test_cocolon_value_observation_service.py` / `test_emlis_ai_value_observation_cases.py` / `test_emotion_piece_generation_value_observation.py` / `test_analysis_value_observation_boundary.py` | 5つの観測signalを固定文一致ではなく構造signalとして検証する |

この版で本文未記載だった現行ファイルは、`01` / `02` / `07` に差分追記してcoverageへ含める。`02B_Cocolon_国家システム資料_Snapshot_Worker_Publish_Read系.md` と `08_Cocolon_DB_rename_boundary.md` は、今回入力された前提資料zip内に存在しないため、参照先として新規追記しない。DB physical rename / drop / write path変更は今回も対象外とする。
