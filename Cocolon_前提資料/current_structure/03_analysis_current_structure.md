---
doc_id: cocolon_analysis_current_structure
title: "分析構造 — Current Structure"
revision_date: "2026-10-04 JST"
document_role: "ANALYSIS_CURRENT_STRUCTURE_OWNER"
effective_when: "MERGED_TO_COCOLON_MAIN"
publication_state: "DRAFT_PR_CANDIDATE_UNTIL_MERGED"
implementation_effect: 0
if_route_activation_effect: 0
automatic_progression: false
---

# 分析構造 — Current Structure

## 0. Current conclusion

**u102 current**：指定Analysis API315f5b5…を開発配置済み、TestFlight6201送信済み、Mashが実機確認OKを報告した。現在は内容改善が主作業。通常補足の完全節採用と同一意味の二重計上修正を既存compilerへ実装し、33検査PASS（§4.8）。この修正版は未配置。以下のu94〜u97は配置前の履歴であり、再び配置/実機を内容修正の前提へ戻さない。

current RN／backendのWatashi Mapに加え、CMEE V1-Dのoffline observed-map実装を開始した。
2026-10-03 weekly review §6.6〜6.10とMashの「分析構造の実装に進んで」に基づく。Emlis/Pieceの文章品質全体完了を開始条件にしない。
u94で保存補足の明示的な訂正・撤回、owner向けsafe projection、同一artifactの文章と図を読むRN受信・表示経路を追加した。合成入力からbackend生成DTOを実際のRN component／latest・viewerへ渡す検査まで成立。u95で既存の本人認証・保存入力RPCを使う期間loaderと、ASTOR内の明示V2生成entryを追加した。合成DB応答→実loader／CMEE→safe文章・図の検査まで成立。u96/u97で承認済み専用tableを実DBへ適用し、immutable保存と既存APIへのV2接続を実装・検証した（§4.7）。稼働APIの配置・機能有効化、実ユーザー入力での実行、実機Product Readは未実施。
private previewは原文節を含む開発内部出力として分離し、watashi.map.v2は閉じたsafe DTOだけを専用rendererへ渡す。safeは認証された本人向け商品表示で、匿名共有ではない。現行Watashi Mapの稼働経路の置換、IF、SavedRouteIntentは未実施。
このmapがAnalysisのcurrent ownerであり、旧混在資料01Bは歴史参照とする。Draft branch上の実装と稼働中productを区別する。

## 1. 商品目的

分析構造は、保存入力の期間蓄積から、本人が現在よく通る自己構造を根拠付きで読める形へ変える。

中心となるrouteは次である。

    scene
      -> role
      -> attention / thought
      -> action / non-action
      -> immediate result / aftermath

そのrouteへ、守っているもの、負荷、unknown、conflict、期間差を別claimとして添える。

将来のIF routeは、observed current routeを上書きする正解、未来予測、命令、最適化ではない。
observed routeをbaseとし、ユーザーが選んだbranch intent／constraintから、別identityの仮想候補を並列提示する。

## 2. Current actualとfuture design

| Capability | Current actual | Designed future |
|---|---|---|
| period reports | Kokoro Weather／Analysis report routeあり | evidence graphとperiod comparabilityを強化 |
| self structure | Watashi Map、role_switches、routes、crossroads、unknown_areas | evidence-bound ObservedSelfStructureMap |
| route semantics | presentation-oriented fixed four-step／generic fallbackを含む | claim／edgeごとのexact evidence refs、partial route |
| protective／burden | formal typed visible ownerは未実装 | direct observationとinterpretive hypothesisを型分離 |
| IF route | owner pathなし、runtime exact0 | HypotheticalScenarioGraph + IfRouteSimulation |
| saved intent | owner pathなし | SavedRouteIntentをobserved／simulatedと別identityで保存 |
| visual | current Watashi Map cards | observed／IF／unknownを見分けられるgraph + accessible text |

上表のCurrent actualは稼働経路を示す。Draftのoffline observed実装は§4.5に分離する。

Current frontend／backendにIF route authorityはない。future designをcurrent runtimeへ数えない。

## 3. Current product flows

### 3.1 Analysis report／Kokoro Weather

    eligible period material
      -> analysis engine aggregation
      -> report material / generation
      -> validity gate
      -> API latest / history / detail
      -> RN Analysis report screens

### 3.2 Current Watashi Map

    self-structure eligible material
      -> signal / rule / fusion builders
      -> astor self-structure report
      -> watashi_map_service presentation model
      -> self-structure API latest / history / detail
      -> WatashiMapRenderer

Current watashi_map_service.pyはpresentation-orientedなfixed four-step routeを生成し、generic fallbackを含む。これはfuture CMEEのsource-grounded truth graph authorityではない。

### 3.3 Future observed and IF route

    period source-set freeze
      -> event-frame extraction
      -> cross-record evidence graph
      -> observed route induction
      -> protective / burden annotations
      -> period comparison
      -> optional user-requested IF scenario
      -> text + visual projection
      -> grounding / epistemic gates

## 4. Current architecture components and files

### 4.1 Cocolon RN

| Responsibility | Path | Lifecycle |
|---|---|---|
| stack | navigation/AnalysisStackNavigator.js | CURRENT_ACTUAL |
| Analysis shell | screens/AnalysisScreen.js | CURRENT_ACTUAL |
| route model | screens/analysis/analysisRouteModel.js | CURRENT_ACTUAL |
| report actions | screens/analysis/useAnalysisReportActions.js | CURRENT_ACTUAL |
| self-structure actions | screens/analysis/useAnalysisSelfStructureActions.js | CURRENT_ACTUAL |
| report home／viewer／history | screens/AnalysisContentFirstScreen.js、screens/AnalysisReportViewerScreen.js、screens/AnalysisReportHistoryScreen.js、screens/AnalysisHistoryScreen.js | CURRENT_ACTUAL |
| self-structure current／generate／viewer／history | screens/AnalysisSelfStructureScreen.js、screens/SelfStructureReportGenerateScreen.js、screens/SelfStructureReportViewerScreen.js、screens/SelfStructureReportHistoryScreen.js | CURRENT_ACTUAL |
| Watashi Map renderer | components/selfStructure/WatashiMapRenderer.js | CURRENT_ACTUAL |
| access policy | components/selfStructure/watashiMapAccessPolicy.js | CURRENT_ACTUAL |
| formatters | components/selfStructure/watashiMapFormatters.js | CURRENT_ACTUAL |
| route wire owner | lib/compat/legacyWireContracts.js | CURRENT_ACTUAL |

### 4.2 mashos-api analysis engine

| Responsibility | Path family | Lifecycle |
|---|---|---|
| analysis engine | ai/services/analysis_engine/ | CURRENT_ACTUAL |
| baseline／models | ai/services/analysis_engine/baseline.py、ai/services/analysis_engine/models.py | CURRENT_ACTUAL |
| daily／weekly／monthly | ai/services/analysis_engine/emotion_structure_engine/daily.py、ai/services/analysis_engine/emotion_structure_engine/weekly.py、ai/services/analysis_engine/emotion_structure_engine/monthly.py | CURRENT_ACTUAL |
| self builders | ai/services/analysis_engine/self_structure_engine/builders.py | CURRENT_ACTUAL |
| fusion／rules／signals | ai/services/analysis_engine/self_structure_engine/fusion.py、ai/services/analysis_engine/self_structure_engine/rules.py、ai/services/analysis_engine/self_structure_engine/signal_extraction.py | CURRENT_ACTUAL |

### 4.3 mashos-api entry, material, quality, and render

| Responsibility | Path | Lifecycle |
|---|---|---|
| analysis read API | ai/services/ai_inference/api_analysis_reads.py | CURRENT_ACTUAL |
| report API | ai/services/ai_inference/api_analysis_reports.py | CURRENT_ACTUAL |
| self-structure API | ai/services/ai_inference/api_self_structure.py | CURRENT_ACTUAL |
| self-structure history façade | ai/services/ai_inference/api_self_structure_reports.py | CURRENT_ACTUAL |
| material snapshots | ai/services/ai_inference/astor_material_snapshots.py | CURRENT_ACTUAL |
| analysis adapter | ai/services/ai_inference/analysis_engine_adapter.py | CURRENT_ACTUAL |
| self report generation | ai/services/ai_inference/astor_self_structure_report.py | CURRENT_ACTUAL |
| validity gate | ai/services/ai_inference/analysis_report_validity_gate.py | CURRENT_ACTUAL |
| Kokoro Weather | ai/services/ai_inference/kokoro_weather_service.py | CURRENT_ACTUAL |
| Watashi Map presentation | ai/services/ai_inference/watashi_map_service.py | CURRENT_ACTUAL |
| shared text guard adapter | ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_composer.py | SHARED_SUBSYSTEM |
| shared Analysis input contract | ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_composer_input_contract.py | SHARED_SUBSYSTEM |

Current AnalysisComposerはcaller-supplied textをguardするadapterであり、ObservedSelfStructureMapまたはIF graphを生成しない。

### 4.4 Representative protected tests

| Contract | Path |
|---|---|
| national core Analysis | ai/tests/contract/test_new_national_core_analysis_contracts.py |
| Kokoro Weather | ai/tests/test_analysis_report_kokoro_weather.py |
| Watashi Map payload | ai/tests/test_self_structure_watashi_map_payload.py |
| Watashi Map service | ai/tests/test_watashi_map_service.py |

current testsは主にpayload／label／presentation contractを守る。evidence-bound observed edgeまたはIF graphのauthority証明ではない。

### 4.5 CMEE V1-D offline implementation／RN受信（2026-10-03 u94）

backend prefixはmashos-apiの`ai/services/ai_inference/cocolon_meaning_experience_engine/`。

| File | Responsibility | State |
|---|---|---|
| `cores/__init__.py`、`cores/analysis/__init__.py` | Analysis専用consumerのpackage境界 | OFFLINE_IMPLEMENTED |
| `cores/analysis/source_adapter.py` | 期間・owner・LIVE・version・補足親identity、重複排除、exact byte/scalar evidence。置換節のparser viewは原answer envelopeの範囲へ戻す | OFFLINE_IMPLEMENTED |
| `cores/analysis/intent_compiler.py` | 部分node／edge／unknown、独立記録の同時出現、対象occurrenceの訂正・撤回、格と有限述語operatorを保持するproposition | PARTIAL_OBSERVED_IMPLEMENTED |
| `cores/analysis/observed_route_realizer.py` | 不変artifact、private previewと本人向けsafe text／visual projectionを別生成。unknown対象を保持 | OFFLINE_SAFE_PROJECTION_IMPLEMENTED |
| `engine.py` | `AnalysisObservedMapRequest`専用dispatch。application modeは未許可 | OFFLINE_ONLY |
| `ai/tests/test_cmee_analysis_v1d_vertical.py`（repo相対） | source／補足→artifact、operator、owner／evidence、safe表現の26検査 | PASS_LOCAL |

RN側はCocolon repo相対。既存のlifecycle ownerを増やさず、受信済みprojectionの解釈と表示を分離する。

| File | Responsibility | State |
|---|---|---|
| `components/selfStructure/watashiMapV2Contract.js` | 閉じたDTO・version・参照整合性を検証し、同一graphから読み順・文章・表示modelを構成 | SOURCE_IMPLEMENTED |
| `components/selfStructure/WatashiMapV2Renderer.js` | 観測node／同時出現／順序、対象を持つunknown／注記／競合、同一内容の読み上げ用文章 | SOURCE_IMPLEMENTED |
| `components/selfStructure/watashiMapFormatters.js` | 旧v1専用。v2／private／不正・未知versionを旧map／旧本文へ戻さない | MODIFIED |
| `components/selfStructure/watashiMapAccessPolicy.js` | 既存tier policyを使いv2のraw modeを検証。Free最新概要・Plus標準・Premium深いmap | MODIFIED |
| `screens/SelfStructureReportGenerateScreen.js` | latest応答のversion dispatch。正しいDTOかつ許可modeのみ既読同期 | MODIFIED_RECEIVER_ONLY |
| `screens/SelfStructureReportViewerScreen.js` | history/detail応答のversion dispatch。履歴／mode制限、不正JSON・privateの旧本文fallback拒否 | MODIFIED_RECEIVER_ONLY |
| `screens/AnalysisContentFirstScreen.js` | latest embedded画面の既存caller | REVIEWED_UNCHANGED |
| `tests/analysis-watashi-map-v2-contracts.test.js` | backend DTO→実component／latest・viewer、参照／tier／fallback／既読の11検査 | PASS_LOCAL |
| `tests/fixtures/analysis-watashi-map-v2-synthetic.json` | backend生成の合成projection／text 2ケース。appのdummyデータではない | SYNTHETIC_TEST_ONLY |

`MAP_AND_EXPLORE / ANALYSIS_OBSERVED_MAP / OFFLINE_CANDIDATE`のみ受理する。本人の明示的な有限節から一部の行動・考えを採用し、場面・役割・結果など未成立部分をunknownとして保持する。同時出現線は無方向で原因を主張しない。順序線にはsource-boundの明示的時間関係が必要で、記録・配列順から生成しない。safe有限節grammarでは「昨日／その後」など時点接頭句は未対応であり、順序線のpositive cohortは未確認。

補足は共有の引用撤回／置換grammarで、親recordの原fieldに一意の完全節として存在する対象だけを更新する。元発話も明示本人の観測であることを検証し、伝聞・質問を置換後に本人へ付け替えない。cross-record集約前に親occurrenceだけを取り除き、置換の否定・願望・時点を再解釈し、count／同時出現／unknownを再計算する。通常の追加回答、部分一致、曖昧対象、未対応置換はUNAVAILABLEとして旧観測を返さない。

safeラベルは閉じた述語grammar（9動詞）と名詞項・格、極性、実行／願望、時点から再構成し、元節の全文・修飾語を黙って切り落として通さない。未対応意味はsafe projectionを生成できない。現段階は汎用日本語理解の完成ではなく、annotations／conflictの意味生成と期間比較も未完了。

private previewは`cocolon.cmee.analysis_private_preview.v1`／`watashi.map.v2.private-preview`として開発内部だけに保つ。safe DTOはcanonical05の`cocolon.cmee.analysis_watashi_map_safe_projection.v1alpha1`／`watashi.map.v2`に限定し、raw body、private source ID、evidence locator、digestを持たない。意味項として本人入力の名詞を保つため、匿名telemetryや外部共有へ転用しない。source取得の認証・tier・retention・削除再検査は§4.7のAPI/lifecycle ownerが担当し、offline requestのowner文字列を認証と扱わない。

期間loaderのsource接続はu95、immutable保存とlatest／history／detailの同一保存identity解決はu96/u97で実装した。稼働API配信は未実施。RNは応答受信時の準備でありnative画面確認ではない。旧renderer自体は保持し、IF／SavedRouteIntent／外部exportはHOLD。

### 4.6 保存入力からのread-only生成（2026-10-03 u95時点の履歴）

すべてmashos-api repo相対。新しいservice／flag／routeを増やさず、既存material ownerとASTORへ置く。

| File／function | 責任 | 状態 |
|---|---|---|
| `ai/services/ai_inference/astor_material_snapshots.py::load_analysis_saved_period` | 本人認証→tier/mode/期間確認→emotionsのID集合→既存EmlisThreadStore.read。元7fieldと1補足をexactに結合 | IMPLEMENTED_READ_ONLY |
| 同 `recheck_analysis_saved_period` | 生成後に本人・tier・同期間ID集合・原入力commitment・thread revision・補足metadataを再読取 | IMPLEMENTED_READ_ONLY |
| `ai/services/ai_inference/astor_self_structure_report.py::prepare_saved_analysis_observed_map` | 保存source→既存CMEE→safe文章／図。旧builder／upsertへ接続せず、private artifactを返さない | IMPLEMENTED_INTERNAL_ENTRY |
| `.../cores/analysis/source_adapter.py::_time` | DB原入力created_atだけを既存保存owner同様UTCとして読む。naive原文字列・exact commitmentは不変、要求期間はtimezone必須 | MODIFIED |
| `ai/tests/test_analysis_saved_period.py` | 実loader／CMEE／ASTORの13検査、HTTP/RPC・認証・tierのみ合成応答 | PASS_LOCAL |
| `emlis_thread_store.py`、`emlis_thread_service.py`、`supabase_client.py`、`subscription.py`、`publish_governance.py`（同inference配下） | 既存の認証済みsaved source、回答束縛・保持期間・HTTP／tier ownerを再利用 | REVIEWED_UNCHANGED |

ID取得は半開区間と`created_at.asc,id.asc`を固定し、count=exactと101件目で100件超・不完全取得を拒否する。保持期間に収まらない窓は切り詰めずUNAVAILABLE。DBにはsource version／LIVE列を捏造せず、実在本人行と保持期間、原7fieldのcommitmentで束縛する。threadの旧source_snapshot、回答の親／質問／round／event ID不一致を拒否し、Q3複数回答を最後の1件へ切り詰めない。質問は束縛確認にだけ使い、生成Emlis本文・意味checkpointはAnalysis sourceにしない。

再読取は観測可能な競合を拒否するが、DB保存transactionの保証ではない。新entryは未登録・未配置で、`/mymodel/infer`／worker／cronが使う旧builderは変更しない。API39検査（新13＋既存26）PASS。実DBユーザー入力を使った生成は未実行。

保存は`NO_SAFE_ANALYSIS_V1D_STORAGE_STOP`。fresh DB catalogで既存myprofile_reportsの本人direct SELECT・全content_json、date uniqueと現行merge-upsertを確認した。private evidenceをそのまま追加できないため、canonical04 §15.1.1のbackend専用immutable table候補をMashの別判断へ出す。loaderまでのコード反映を専用保存の承認・実API接続へ換算しない。

### 4.7 サーバー専用保存と既存API接続（2026-10-04 JST u96/u97）

Mashの専用table承認に基づく。DB適用済み、API/RN sourceはDraft・稼働未配置。u95の保存方式判断待ちは解消した。

| Repository / file | 責任・状態 |
|---|---|
| mashos-api `supabase/migrations/20261003134440_analysis_observed_artifacts.sql` | 新table1、immutable identity、server-only ACL、snapshot/commit/read、source変更無効化。実履歴20261003204421へ適用・照合済み |
| mashos-api `ai/services/ai_inference/analysis_observed_service.py` | 新lifecycle owner。期間source→CMEE→closed evidence/safe文章・図の保存、読取時freshness、mode/期間別latest、既定off |
| 同 `api_self_structure.py` | 認証後latest/status/monthlyのV2分岐。稼働への配置は未実施 |
| 同 `report_artifact_read_service.py` | 旧履歴とV2のaccess後統合、同UUIDの詳細、プラン/不正V2拒否 |
| 同 `api_report_reads.py` | 同じ可読履歴IDをunreadへ接続 |
| mashos-api `ai/tests/test_analysis_observed_api.py`、`test_analysis_observed_storage.py` | 新HTTP 6＋保存9検査、通信だけ合成応答。既存39と計54 PASS |
| mashos-api `ai/tests/analysis_observed_storage_sql.cjs` | 隔離Postgresへの実migrationと保存/ACL/変更・削除/競合前提31項目確認。外部一時test依存、製品依存変更なし |
| Cocolon `screens/SelfStructureReportGenerateScreen.js` | 表示したV2 identityだけを既読化し、後続statusとのraceを除く |
| Cocolon `tests/analysis-watashi-map-v2-contracts.test.js` | 上記既読race期待を更新、実component11 PASS。旧互換2 PASS |

原文節のprivate previewは保存しない。DB専用guardとCMEE commitmentを分離し、commit時は短いSHARE NOWAIT lock内で全source/tierを照合。変更/削除で関連artifactを除去し、読取時も照合する。文章と図は同じ保存identityへ戻り、意味再生成0。Free latest lightのみ／履歴不可、Plus deep不可。read_onlyは有効保存版を維持する。

`COCOLON_ANALYSIS_OBSERVED_MODE=off|read_only|development`（source既定off、稼働設定未変更）。月初半開期間、legacy履歴併存、safe本文一致検証を実装。既存/mymodel・cron・workerの旧builderは変更しておらず、global cutover・配置・本人入力一往復・nativeは次工程。詳細なDB照合・検証・残件はcanonical04 §15.1.2および06/API handoff末尾u96/u97。

### 4.8 通常補足の分析採用と同一意味の集約（2026-10-04 u102）

| Repository / existing file | 更新した責務 |
|---|---|
| mashos-api `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | 通常補足の全文・本人・既存grammar解釈、exact evidence被覆、対立記述の保留。同じ意味の格順/丁寧語表記を一観測へ束ね、全evidenceと独立record件数を保持 |
| mashos-api `ai/tests/test_cmee_analysis_v1d_vertical.py` | 追加7＋既存26＝33 PASS。文章/図、補足出典、非重複件数、無方向共起、未解釈/訂正混在/反対極性を確認 |

通常補足も親recordの一機会で、別入力件数にしない。引用訂正/撤回の優先経路は維持。全文が読めない回答や矛盾の意図が未確定な回答を都合よく部分採用しない。新規path/owner/DB/DTO/RN/依存追加0。語彙は既存9動詞/名詞項に限定され、一般日本語・複数補足・意味annotation/比較/IFは残る。u102 sourceは未配置。実機OKはu101版に対するMash報告であり、修正版の本人実行や保存UUIDの華恋による照合ではない。

## 5. Source and artifact identity

### 5.1 Grounded sources

SourceEnvelopeへ置けるのは、owner／period／version／privacyが固定された真正入力だけ。

- period saved inputs
- allowed supplemental source
- simulation session material
- user-confirmed branch intent／constraints

observed claim、simulated route、saved intentをgrounded source roleへ入れない。

### 5.2 Derived artifacts

| Artifact | Identity boundary |
|---|---|
| ObservedSelfStructureMap | period source-setにbindしたsource-grounded claim graph |
| HypotheticalScenarioGraph | observed map／route versionとbranch pointをparentに持つ別graph |
| IfRouteSimulation | scenario graphを投影した別artifact。observedへ逆流しない |
| SavedRouteIntent | userが保存した関心方向。observed factへ自動昇格しない |
| AnalysisVisualPlan | canonical artifact id／versionの宣言的visual projection |

latest pointer、history item、detail、text、graphは同じcanonical artifact_id@versionへ解決する。period artifact同士を同じidentityにしない。

future `watashi.map.v2`では、private canonical stored artifactとAPI / RN向けsafe projectionを分ける。projectionは`projection_of = artifact_id@version`で同一identityへ戻れるが、raw body、private source ID、private evidence locator、source digestを持たない。access policyはAnalysis ownerに残り、audienceごとのprojection bytesがprivate stored JSONと同一である必要はない。

## 6. Observed／annotation／IFの型分離

### Observed path nodes

- scene
- role
- attention／thought
- action／non-action
- immediate result／aftermath

### Observed edge

- OBSERVED_ORDER
- REPEATED_COOCCURRENCE

共起を順序または原因へ変換しない。observed claim／edgeにはexact evidence refsが必須であり、unknownをevidence代替に使わない。

### Annotation

- protective
- burden
- interpretive hypothesis

route path nodeではない。direct observationとinterpretive hypothesisを区別する。

### Unknown

missing reasonとscopeを持つ別claim／gap marker。observed factを作るための穴埋めではない。

### IF graph

- SIMULATED_TRANSITIONはHypotheticalScenarioGraphだけに置く。
- scenario candidate exact1〜3を意味の違う候補として並列提示する。
- scenario同士をbest／optimalへrankしない。
- common comparatorが選べるのは同じscenarioの文章／visual／layout realization差だけ。

## 7. Protected invariants

### Meaning and epistemics

- user-visible observed claim／edgeの100%をexact evidence refsへ結ぶ。
- filler step、generic result、evidenceなし因果、人格、診断、未来予測を作らない。
- insufficient、conflict、unknownを隠さない。
- protective／burdenを原因断定にしない。
- one recordをtrendへ、category／intensityをcauseへ昇格しない。

### Observed／simulated／saved separation

- observed routeをsimulationでmutationしない。
- simulated step originをobserved_anchor、user_choice、simulated_extension、unknownに区別する。
- IFにsuccess probability、improvement score、正解、命令、最適化を付けない。
- SavedRouteIntentをobserved factまたはachievement／failureへ昇格しない。
- IF clarification answerはsimulation session materialでありperiod observed sourceではない。

### Visual and accessibility

- observedはsolid lane、simulatedは明示label付きdashed lane、unknownはbroken／dottedで分ける。
- 色だけで区別せずlabel、icon、textを併用する。
- graphとaccessible linear textを同じartifact identityから投影する。
- actual deviceで観測／仮想／unknownを判別できることをProduct Readする。

### Lifecycle and acceptance

- tier、latest、history、detail、refreshの既存product lifecycleはAnalysis ownerに残す。
- machine verification、human Product Read、runtime readinessを相互変換しない。
- high-careでunsupported IFは生成停止またはAnalysis固有の短い問いへ進む。

## 8. Product／design owners

| Role | Path | Lifecycle |
|---|---|---|
| broad mixed structure source | Cocolon_前提資料/01B_cocolon_overall_structure_analysis_piece_emotionlog_ranking.md | HISTORICAL_DETAILED_REFERENCE。current entryではない |
| Analysis policy source | Cocolon_Piece/handoff/Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807/part_02_piece_and_analysis_policy.md | HISTORICAL_PRODUCT_DESIGN_REFERENCE |
| future role alignment | Cocolon_Piece/handoff/Cocolon_Piece_Analysis_RoleAlignment_Overlay_20260812.md | PROSPECTIVE_NOT_ACTIVATED |
| current structure owner | 本file | CURRENT when merged |

ユーザー提供のAnalysis roadmapは設計参照として確認したが、同名のdurable GitHub ownerはcurrent treeで確認できなかった。
本mapはそのproduct方向をcurrent／future分離付きでdurable化する。詳細roadmap activationやimplementation authorityを代替しない。

## 9. Current gaps

1. V1-Dのoffline実装を開始済み。公開safe surfaceと補足の訂正・撤回解釈を最小の次工程とする。
2. current Watashi Mapはpresentation-orientedで、claim／edge evidence graph authorityではない。
3. 初回部分graphにexact evidenceを結合済み。全段階・annotations・conflict・期間比較の意味実装は未完了。
4. IF route／HypotheticalScenarioGraph／SavedRouteIntentのruntime ownerはexact0。
5. Analysis専用Product Read packetとactual-device IF map verificationは未実行。
6. 認証済み期間source loader、保存lifecycle、API、開発画面、実機一往復は未接続。今回の18検査PASSを商品完成へ換算しない。

CMEE Analysis detailed design candidate:

[CMEE V1-D / V1-E — Analysis Observed / IF Route 詳細設計](../designs/cmee/v1/04_analysis_v1d_v1e_detailed_design.md)

このpointerはcurrent Watashi Mapの置換、observed／IF runtime activation、API／DB／RN変更を承認しない。

## 10. History pointers

- Cocolon_前提資料/01B_cocolon_overall_structure_analysis_piece_emotionlog_ranking.md
- Cocolon_Piece/handoff/Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807/part_02_piece_and_analysis_policy.md
- Cocolon_Piece/handoff/Cocolon_Piece_Analysis_RoleAlignment_Overlay_20260812.md
- Git history for screens/Analysis*、components/selfStructure/、ai/services/analysis_engine/、analysis API／service files

追加のphase mapを作らず、このfileをreplace-currentで更新する。

## 11. Map update triggers

次を変更するworkは、このfileを同じwrite unitで更新する。

- Analysis entry／API／RN／DB owner
- period source-set eligibility／comparability
- event taxonomy／route edge semantics
- observed／annotation／unknown／IF／saved identity
- current Watashi MapのretirementまたはCMEE cutover
- visual projection／accessibility／latest／history contract
- Analysis roadmap activation state

内部logicのみで構造が不変ならSTRUCTURE_MAP_DELTA_NONEと理由を記す。

## 12. Last verified refs

    Cocolon PR30 implementation base（Draft/open/unmerged）
      4e8892bbaaebb6c010a63f9f477575d462c7ead8

    mashos-api PR3 implementation base（Draft/open/unmerged）
      e6882f1009a03640357d83d8b9fec7c656611f7a

次回はfresh refと実fileを再確認する。
