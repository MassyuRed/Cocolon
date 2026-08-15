---
doc_id: cocolon_analysis_current_structure
title: "分析構造 — Current Structure"
revision_date: "2026-08-15 JST"
document_role: "ANALYSIS_CURRENT_STRUCTURE_OWNER"
effective_when: "MERGED_TO_COCOLON_MAIN"
publication_state: "DRAFT_PR_CANDIDATE_UNTIL_MERGED"
implementation_effect: 0
if_route_activation_effect: 0
automatic_progression: false
---

# 分析構造 — Current Structure

## 0. Current conclusion

分析構造には、current RN／backend実装と広域の前提資料は存在する。
しかし専用の00_read_first、current structure、history ownerがなく、Analysis、Piece、EmotionLog、rankingを混在させた巨大追記資料から復元する必要があった。

また、current Watashi Mapと、将来構想であるevidence-bound observed route／IF routeを区別するdurable ownerがなかった。
このmapを分析構造のcurrent structure ownerとする。

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

1. dedicated Analysis design roadmap／implementation routeは未activated。
2. current Watashi Mapはpresentation-orientedで、claim／edge evidence graph authorityではない。
3. observed route edgeのformal evidence bindingは未実装。
4. IF route／HypotheticalScenarioGraph／SavedRouteIntentのruntime ownerはexact0。
5. Analysis専用Product Read packetとactual-device IF map verificationは未実行。
6. CMEE Analysis connectionはfuture phaseであり、このmap作成から開始しない。

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

    Cocolon main
      de9c3d985053bbaaa7fc0d396e688cc2097ece40

    mashos-api main
      a8ca4ddf7b7ae76bf7b3d73e74e3a5808d623428

次回はfresh refと実fileを再確認する。
