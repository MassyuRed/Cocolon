# CMEE V1-D / V1-E — Analysis Observed / IF Route 詳細設計

- document id: `cocolon.cmee.v1d_v1e.analysis_route.detailed_design`
- revision date: `2026-08-21 JST`
- lifecycle: `DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE`
- Step 10 integrated revision: `CMEE_STEP10_ULTRA_FINAL_INTEGRATED_REVISION_PROPOSAL_20260821_V2_REFLECTED`
- observed-route runtime state: `NOT_IMPLEMENTED`
- IF-route runtime state: `NOT_IMPLEMENTED`
- Analysis activation: `NOT_AUTHORIZED`
- API / DB / RN effect: `0`

---

## 0. Product result

分析構造のCMEE connectionは、期間sourceから現在よく通る自己構造routeを根拠付きで形にし、希望時だけ観測routeとは別identityのIF routeを作る。

```text
period source set
-> event frames and evidence graph
-> evidence-bound observed route
-> protective / burden annotations and unknown gaps
-> text + visual projection
-> ObservedSelfStructureMap

ObservedSelfStructureMap + user-owned branch intent
-> separate HypotheticalScenarioGraph candidate set
-> parallel IF route artifacts
-> optional SavedRouteIntent
```

current Watashi Mapのfixed presentation routeをtruth graphへ昇格しない。IFは未来予測、正解、命令、最適化ではない。

V1-Dの最終商品artifactはtext + visual graphであり、V1-Eがなくても独立してcompleteかつProduct Read可能にする。V1-Eはaccepted V1-D後の別approvalでのみ開始する。

## 1. Activation boundary

V1-D / V1-Eのdesign contractは先に定義する。Step 10のrecommended scheduling positionは次のとおりで、各runtime接続は別承認とする。

1. Emlis Vertical 1 — Layer 1／2
2. Emlis Vertical 2 — question／refined Layer 1／2
3. Emlis Vertical 3 — Plus／Premium Layer 3
4. Piece — text + visual + recipient-visible route
5. V1-D observed routeのimplementation／migrationとProduct Read
6. V1-E IF routeの別implementation／safety approval

この順序はmachine proofからのautomatic progression、Cycle001またはPiece operational完了の無条件gate、PieceからAnalysisへのdirect source transferを作らない。V1-D／V1-Eはそれぞれactual Analysis unitへの別Mash判断を必要とする。

本設計反映からAnalysis route、latest/history、API、DB、RNを変更しない。

## 2. Source model

`SourceEnvelope`へ入れてよいのはauthentic input materialだけである。

```text
ORIGINAL_INPUT
SUPPLEMENTAL_ANSWER
PERIOD_METADATA
USER_CORRECTION
SIMULATION_SESSION_MATERIAL
```

`PERIOD_RECORD_IDENTITY`は本文を持つ`SourceEnvelope` roleではなく、`AnalysisSourceSet.members[].member_role`のmembership metadataである。record childの`ORIGINAL_INPUT`とoptional `SUPPLEMENTAL_ANSWER`だけをmeaning-bearing SourceEnvelopeにする。

period source-set memberはsaved record identityを持ち、そのchild commitmentとして`ORIGINAL_INPUT` exact1とoptional `SUPPLEMENTAL_ANSWER` 0..3を別`SourceEnvelope`でfreezeする。supplemental answerはoriginal recordに従属する補足根拠であり、別record、別occasion、独立した期間sampleに数えない。question decision / option / skip等のcontrol lineageとEmlis Layer 1 / Layer 2 / question / Layer 3はmeaning source 0である。

次はsource roleではなくderived artifact / lineage refである。

```text
AnalysisClaimRef
ObservedSelfStructureMapRef
IfScenarioArtifactRef
SavedRouteIntentRef
```

`observed_analysis_claim`、`simulated_route_material`、`saved_route_intent`をsource namespaceへ戻さない。simulation-session materialはobserved period sourceへ混ぜない。

Analysis lifecycle ownerがDBからowner-authenticated saved recordを取得してrequest-local private materialを渡す。CMEEはsourceをadmitするだけで、DB read policy、DB owner、storage writeを持たない。

## 3. Proposed future module topology

```text
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/__init__.py
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/source_adapter.py
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py
```

V1-Eで初めてmaterializeする候補:

```text
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/if_route_realizer.py
```

event framing、route induction、annotation、period comparisonは`intent_compiler.py`のAnalysis-owned責任として最初のverticalで閉じ、必要性をactual codeで示した場合だけ分割する。第1phaseでIF empty stubを置かない。exact pathはV1-D / V1-EそれぞれのPhase fit-gapで再固定する。

### 3.1 Current owner integration disposition

| Repository | Current / proposed path | V1-D disposition |
|---|---|---|
| mashos-api | `ai/services/ai_inference/astor_material_snapshots.py` | `KEEP_SOURCE_MATERIAL_OWNER / MODIFY_FOR_SOURCE_SET_REFS` |
| mashos-api | `ai/services/ai_inference/analysis_engine_adapter.py` | `KEEP_MATERIAL_NORMALIZATION_PREIMAGE_ONLY / NOT_GRAPH_ORCHESTRATION_OWNER` |
| mashos-api | `ai/services/ai_inference/astor_self_structure_report.py` | `ORCHESTRATION_AND_CUTOVER_OWNER / MODIFY_REQUIRED`: V1-D active requestのexceptionを握り潰してv1へ継続しない |
| mashos-api | `ai/services/ai_inference/watashi_map_service.py` | `HISTORICAL_V1_GENERATOR / RETIRE_ACTIVE_AT_V1D_CUTOVER` |
| mashos-api | `ai/services/ai_inference/analysis_report_validity_gate.py` | `KEEP_PUBLISH_VALIDITY_GUARD / NOT_MEANING_OR_ROUTE_AUTHORITY / EXTEND_FOR_V2_IDENTITY` |
| mashos-api | `ai/services/ai_inference/api_analysis_reads.py` | `MUST_MAP_BEFORE_CUTOVER`: tier / access / unread / refresh semanticsを保護 |
| mashos-api | `ai/services/ai_inference/api_analysis_reports.py` | `MUST_MAP_BEFORE_CUTOVER`: report familyとのversion / identity境界を固定 |
| mashos-api | `ai/services/ai_inference/api_self_structure.py` | `MODIFY_FOR_WATASHI_MAP_VERSION_DISPATCH` |
| mashos-api | `ai/services/ai_inference/api_self_structure_reports.py` | `MODIFY_LATEST_HISTORY_DETAIL_TO_CANONICAL_REF` |
| Cocolon RN | `components/selfStructure/WatashiMapRenderer.js` | `KEEP_HISTORICAL_V1_READ_RENDERER` |
| Cocolon RN | `components/selfStructure/watashiMapFormatters.js` | `KEEP_V1_FORMATTER / DO_NOT_INTERPRET_V2_AS_V1` |
| Cocolon RN | `screens/AnalysisSelfStructureScreen.js` | `MODIFY_VERSION_DISPATCH` |
| Cocolon RN | `screens/analysis/useAnalysisSelfStructureActions.js` | `MUST_MAP_BEFORE_CUTOVER`: generation / refresh / navigation actionをV2 identityへ接続 |
| Cocolon RN | `screens/SelfStructureReportGenerateScreen.js` | `MUST_MAP_BEFORE_CUTOVER`: active generation version exact1を固定 |
| Cocolon RN | `screens/SelfStructureReportViewerScreen.js` | `MODIFY_TO_STORED_ARTIFACT_IDENTITY` |
| Cocolon RN | `screens/SelfStructureReportHistoryScreen.js` | `MODIFY_TO_STORED_ARTIFACT_IDENTITY` |
| Cocolon RN | `components/selfStructure/watashiMapAccessPolicy.js` | `KEEP_ACCESS_OWNER / VERIFY_SAFE_V2_PROJECTION` |
| Cocolon RN | `lib/compat/legacyWireContracts.js` | `MUST_MAP_BEFORE_CUTOVER`: v2をv1 aliasへsilent変換しない |
| Cocolon RN | `components/selfStructure/WatashiMapV2Renderer.js` | `PROPOSED_NEW_V1D_PATH` |
| Cocolon RN | `components/selfStructure/WatashiMapRouteGraph.js` | `PROPOSED_NEW_V1D_PATH` |
| Cocolon RN | `tests/analysis-watashi-map-v2-contracts.test.js` | `PROPOSED_NEW_VERSION_DISPATCH_TEST` |

V1-D Phase fit-gapはfresh caller / writer / reader graphとexact filenamesを再確認し、上表からのdeltaをapprovalへ出す。V1-EのIF source、storage、API、RN filesは別approvalまでmaterialize 0である。

## 4. Period source-set freeze

`AnalysisObservedMapRequest`:

```text
request_id
authenticated_owner_scope
period_start / period_end
members[]:
  saved_record_ref
  saved_record_version
  member_role = PERIOD_RECORD_IDENTITY
  source_commitment
  inclusion_status
  inclusion_or_exclusion_reason
  child_source_envelope_refs[]:
    ORIGINAL_INPUT exact1
    optional SUPPLEMENTAL_ANSWER 0..3
source_set_version
dedupe_policy_version
comparability_policy_version
analysis_policy_version
locale = ja-JP
```

source adapter minimum duties:

- same-owner entitlement
- period inclusion / exclusion reason
- record version freeze
- duplicate detection
- source ordering evidence
- privacy class
- conflict / missing source preservation
- Piece / Emlis bodyとsimulation outputのsource mixing拒否
- supplemental answerをoriginal memberの別record／別occasionに数えない

`members[]`はparallel arrayにせず、record identity / version / membership role / commitment / include-exclude reason / child envelope refsを一objectへ束ねる。`PERIOD_RECORD_IDENTITY`はSourceEnvelope roleではない。included recordのoriginal / supplemental childだけを別meaning-bearing SourceEnvelope refとして持つが、occasion / record countはparent member単位でdedupeする。

一件の記録を傾向へ昇格しない。record countだけでroute edgeを作らない。

## 5. Event frame

各recordから次のtyped frameを作る。

```text
scene
role
attention_or_thought
action_or_nonaction
immediate_result_or_aftermath
participants
temporal_scope
polarity / modality
unknown fields
source evidence refs
conflict refs
```

欠けたstepをfixed labelやgeneric resultで補わない。partial frameはvalid resultである。

## 6. `GroundedMeaningGraph` and `HypotheticalScenarioGraph`

`GroundedMeaningGraph`はsource-grounded observed / derived / user-confirmed / user-corrected / unknown / conflictだけを持つ。

```text
epistemic_state:
  SOURCE_EXPLICIT
  FORMAL_DERIVED
  USER_CONFIRMED
  USER_CORRECTED
  UNKNOWN
  CONFLICT
```

IFは別graphである。

```text
HypotheticalScenarioGraph
  scenario_graph_id
  scenario_graph_version
  base_observed_map_ref
  base_route_ref
  branch_point_id
  branch_intent_source_ref
  constraint_source_refs[]
  scenario_nodes[]
  scenario_edges[]
  unmodelled_factors[]
  status
```

observed graphをIF nodeでmutationしない。IF graphのstepはoriginを必須とする。

```text
OBSERVED_ANCHOR
USER_CHOICE
SIMULATED_EXTENSION
UNKNOWN
```

## 7. Observed route model

### 7.1 Path nodes

Observed route pathのnode kindは次だけである。

```text
SCENE
ROLE
ATTENTION_OR_THOUGHT
ACTION_OR_NONACTION
IMMEDIATE_RESULT_OR_AFTERMATH
```

protective、burden、unknownはpath nodeへ混ぜない。

### 7.2 Observed edges

```text
OBSERVED_ORDER
REPEATED_COOCCURRENCE
```

- `OBSERVED_ORDER`: same-record等のexplicit order evidenceがある。
- `REPEATED_COOCCURRENCE`:複数sourceで一緒に現れるが、direction / causalityを主張しない。

共起を矢印因果へ変換しない。

`SOURCE_EXPLICIT` / `FORMAL_DERIVED` claimと上記edgeにはexact evidence refsを必須とする。evidenceなしobserved claimを`UNKNOWN`で代替しない。

### 7.3 Unknown gap

`UNKNOWN_GAP`は別identityで、次を持つ。

```text
gap_id
between_node_refs[]
missing_scope
reason_code
source_set_ref
```

unknownはobserved factではなく、足りない範囲を示す非矢印markerである。

## 8. Protective / burden annotations

protectiveとburdenはroute pathではなくnon-sequential annotation claimである。

```text
AnalysisAnnotationClaim
  annotation_id
  kind = PROTECTIVE | BURDEN
  target_node_or_edge_ref
  annotation_state = SOURCE_EXPLICIT_ANNOTATION | EVIDENCE_BOUND_INTERPRETIVE_HYPOTHESIS
  evidence_refs[]
  uncertainty
  alternative_explanations[]
  forbidden_promotions[]
```

direct source statementとinterpretive hypothesisを分ける。`INTERPRETIVE_HYPOTHESIS` edgeはannotation graphだけに存在し、observed route edgeへ入れない。

## 9. `ObservedSelfStructureMap`

```text
ObservedSelfStructureMapPayload
  kind = ANALYSIS_OBSERVED_SELF_STRUCTURE_MAP
  wire_kind = watashi.map.v2
  source_set_ref
  period
  route_graph
  annotation_claims[]
  unknown_gaps[]
  conflict_refs[]
  central_route_ref? = exact0..1
  comparison_availability = NO_PREVIOUS | COMPARISON_PRESENT
  period_comparisons[] = exact0..1, canonical payload内へinline
  text_projection_ref
  visual_projection_ref

ObservedSelfStructureMap = GenerationArtifactBundle<ObservedSelfStructureMapPayload>
  artifact_id
  artifact_version
  artifact_kind = ANALYSIS_OBSERVED_SELF_STRUCTURE_MAP
  epistemic_partition = OBSERVED
  semantic_graph_ref
  experience_plan_ref
  primary_artifact = ObservedSelfStructureMapPayload
  realization_trace_ref
  quality_report_ref
  lifecycle_bindings
```

各period artifactは別identityである。latest pointer、history item、detail、text、graphは同じcanonical `artifact_id@version`へresolveする。comparison objectも同じimmutable stored artifactに含め、別のunresolved private locatorへ逃がさない。

「今よく通る流れ」をcentral routeとして表示する最低条件は、record count 3以上、distinct occasion count 2以上、same orderまたはrelationがactual evidenceに結び付くことの全部である。occasionは日付ではなく一回の出来事／機会で数える。同一出来事の分割入力とsupplemental answerは水増ししない。

```text
central route count:
  0..1

minimum conditions true:
  central route exact1

minimum conditions false:
  central route exact0
  partial observation + unknown / not enough
  generic route fallback 0
```

### 9.1 Period comparison

```text
PeriodComparison
  comparison_id
  current_artifact_ref
  current_source_set_ref
  previous_artifact_ref
  previous_source_set_ref
  comparability_state = COMPARABLE | NOT_COMPARABLE
  reason_codes[]
  change_claims[]:
    change_kind = ROUTE_EVIDENCE_CHANGED
                | ANNOTATION_EVIDENCE_CHANGED
                | UNKNOWN_SCOPE_CHANGED
                | CONFLICT_STATE_CHANGED
    current_ref
    previous_ref
    evidence_refs[]
```

`NOT_COMPARABLE`では`change_claims` exact0、reason exact1以上とする。`COMPARABLE`でも差分を改善、悪化、原因、達成へ自動昇格しない。

previous artifactがない初回は`comparison_availability=NO_PREVIOUS`、`period_comparisons` exact0とする。safe projectionも`NO_PREVIOUS`を明示し、架空のprevious / change claimを作らない。

### 9.2 Plan product boundary

```text
Free:
  latest observed artifact only
  prior Analysis artifact history access 0
  period comparison 0
  central route 0..1

Plus:
  available evidence-backed complete observed map
  Analysis artifact history / comparison

Premium:
  Plus範囲
  + separately approved V1-E IF
  + SavedRouteIntent
```

Freeのhistory access 0は、過去のAnalysis artifactを閲覧したり期間比較を受けたりする商品機能が0という意味である。V1-Dが分析sourceとして過去の保存入力を使えないという意味ではない。Freeでもrecord count 3以上 + distinct occasion count 2以上のsource条件を維持する。

## 10. IF route

### 10.1 Request

```text
AnalysisIfRouteRequest
  base_observed_map_ref
  base_route_ref
  branch_point_id
  branch_intent_source_ref
  constraint_source_refs[]
  requested_candidate_count = 1..3
  simulation_scope = SELF_ONLY
  analysis_if_policy_version
```

branch point / intent / constraintが足りない場合、Analysis ownerが`ClarificationRequest`を決める。Emlis question policyを流用しない。answerはsimulation-session sourceであり、period observed sourceへ入れない。

### 10.2 Scenario candidates

Analysis ownerはmeaningの異なるscenarioを1–3含む`IfScenarioCandidateSet`をexact1作れる。

- candidate間をsuccess / improvement / likelihoodでrankしない。
- best routeを自動選択しない。
- 1–3を並列提示する。
- required conditions、frictions、unknown、unmodelled factorsを表示する。
- result probability、future guarantee、optimality scoreを生成しない。
- other personはcontext evidenceに限定し、相手の意図、反応、関係の結果を推定しない。
- health / medical IFは生成不可とし、追加確認後に生成可とする例外を置かない。emergency / high-riskはseparate Safety ownerへ渡す。

CMEE comparatorが選べるのは、同じscenario graphの`RealizationCandidateSet`だけである。意味の異なるscenarioをsurface qualityで一つへ選ばない。

### 10.3 IF scenario set artifact

```text
IfRouteSimulationPayload
  kind = ANALYSIS_IF_ROUTE_SIMULATION
  wire_kind = watashi.if-route.v1
  scenario_artifact_ref
  base_observed_map_ref
  base_route_ref
  branch_point_id
  scenario_graph_ref
  branch_intent_source_ref
  condition_refs[]
  unmodelled_factor_refs[]
  text_projection_ref
  visual_projection_ref
  scenario_display_label

IfScenarioCandidateSetPayload
  kind = ANALYSIS_IF_SCENARIO_SET
  wire_kind = watashi.if-route-set.v1
  candidate_set_id
  base_observed_map_ref
  base_route_ref
  scenarios[] = IfRouteSimulationPayload, exact1..3
  display_order[] = scenario_artifact_ref exact set
  selection_policy = PARALLEL_NOT_RANKED

IfScenarioCandidateSet = GenerationArtifactBundle<IfScenarioCandidateSetPayload>
  artifact_id
  artifact_version
  artifact_kind = ANALYSIS_IF_SCENARIO_SET
  epistemic_partition = HYPOTHETICAL
  semantic_graph_ref = candidate_set_id
  experience_plan_ref
  primary_artifact = IfScenarioCandidateSetPayload
  realization_trace_ref
  quality_report_ref
  lifecycle_bindings
```

scenario candidateの意味identityはcandidate set内で保ち、Bundleの`companion_artifacts`へ曖昧に並べない。全scenarioは同一`base_observed_map_ref` / `base_route_ref`へbindする。`display_order`は表示順でありrankではない。

branch point / intent / constraint不足時は`EngineOutcome(status=QUESTION_PENDING, artifact_bundle=null, clarification_request=...)`を返し、空の`HypotheticalScenarioGraph`やIF artifactを作らない。

## 11. `SavedRouteIntent`

userが明示保存した関心方向は、IF artifactともobserved mapとも別identityである。

```text
SavedRouteIntentPayload
  kind = ANALYSIS_SAVED_ROUTE_INTENT
  wire_kind = watashi.saved-route-intent.v1
  source_scenario_set_ref
  selected_scenario_ref
  selection_source_ref
  user_note_source_ref?
  saved_at

SavedRouteIntent = GenerationArtifactBundle<SavedRouteIntentPayload>
  artifact_id
  artifact_version
  artifact_kind = ANALYSIS_SAVED_ROUTE_INTENT
  epistemic_partition = USER_SAVED_INTENT
  semantic_graph_ref = selected scenario graph
  parent_artifact_refs includes source scenario set
  source_commitments includes user selection source + optional note only
  experience_plan_ref
  primary_artifact = SavedRouteIntentPayload
  realization_trace_ref
  quality_report_ref
  lifecycle_bindings
```

SavedRouteIntentは`ANALYSIS_SAVE_ROUTE_INTENT` operationでCMEEがcompileし、Analysis lifecycle serviceがauth、retrieval、persistence、read accessを所有する。userがscenarioを選択した操作を`SIMULATION_SESSION_MATERIAL` SourceEnvelope exact1としてcommitし、optional noteも別sourceにする。scenario set / simulation / scenario graphはderived parentでありsource commitmentではない。`selected_scenario_ref`はsource set member exact1でなければREJECTする。

saved intentをobservedへ自動昇格しない。後続記録との比較をachievement / failure / causal proofへしない。

## 12. Text / visual projection

CMEE shared graph projection protocolはsemantic edgeを発明しない。Analysis compilerが作ったtyped graphを表示planへ投影するだけである。

`AnalysisVisualPlan`:

```text
projection_id
projection_of = artifact_id@version
node_specs[]
edge_specs[]
lane_specs[]
group_specs[]
evidence_badges[]
unknown_badges[]
branch_markers[]
style_tokens:
  theme_ref
  layout_policy_ref
  accessibility_policy_ref
accessibility_linear_order[]
text_fallback_ref
```

V1-D observed mapでは`branch_markers` exact0でよい。V1-E scenarioではbranch point / user-selected branchを`branch_markers`で明示する。`group_specs`はvisual groupingだけを表し、semantic edgeやscenario rankを作らない。

visual semantics:

- observed route: solid + label
- simulated route: clearly labelled dashed + icon
- unknown gap: broken / dotted + unknown label
- user-selected branch: explicit marker
- 色だけに依存しない

RN rendererはAnalysis product ownerである。text / graph / accessible linear viewは同じcanonical artifactへresolveする。

Analysisのfinal product artifactはtext-onlyでもgraph-onlyでもなく、text + visual graphである。latest pointer、history item、detail、text、graphは同じcanonical `artifact_id@version`へresolveし、別identityの代替品にしない。

canonical stored `watashi.map.v2` artifactはprivateで、exact evidence / source refsを保持する。API / RNへはaccess ownerがversioned safe projectionを作り、`projection_of = artifact_id@version`、visible node / edge / badge、anonymous evidence count、unknown / conflict / period comparison stateだけを渡す。raw body、private source ID、private evidence locator、source digestはprojection 0である。latest / history / detailが同じcanonical identityへresolveすることは、private stored JSONと全audience向けprojection bytesが同一であることを意味しない。

projectionでも`OBSERVED_ORDER`だけが`from_ref / to_ref`を持つ。`REPEATED_COOCCURRENCE`はunordered `endpoint_refs[]`で表し、矢印化しない。annotation / unknown / conflictはvisible labelだけのstring listにせず、safeな`target_ref` / `between_node_refs`を保持してgraph上の対応を失わない。

V1-E safe projectionは`watashi.if-route-set.v1`、SavedRouteIntent safe projectionは`watashi.saved-route-intent.v1`を使う。IF projectionはscenario origin、required condition、friction、unmodelled factorを保ち、rank / score / probabilityを持たない。SavedRouteIntent projectionはowner-authorized exact1で、選択scenarioとoptional noteだけを返す。どちらもobserved safe projectionへ混ぜない。

### 12.1 Provisional UI direction

```text
分析画面

[ 今のわたしマップ ] [ わたしシミュレーション ]

わたしシミュレーション:
  今のルート
  分かれ道
  ifルート候補
  条件
  unknown
```

UIの表示候補は、価値判断を含みやすい「正規ルート」ではなく「今のルート」を推奨する。final navigation、tab / swipe / separate screen、text量、graph scale、animationはHOLDであり、本設計反映でRN導線を確定しない。

### 12.2 Future external retention

分析結果を将来アプリ外へ保持可能にする方向は残す。対象候補は今のわたしマップ、わたしシミュレーション全体、個別ifルート、短い概要である。形式候補はPDF、image、overview image + full PDFその他だが、exact format、coverage、UI、renderer、storageは`FUTURE_ANALYSIS_EXTERNAL_RETENTION_HOLD`とする。

```text
initial V1-D mandatory export: false
initial V1-E mandatory export: false
Piece posting: separate product
Analysis -> Piece direct connection: 0
```

当面固定するのは、Analysis artifactのcanonical identity / version、text / graphの同一identity、将来render-neutral export projectionを追加できる拡張境界、Analysis lifecycleがexternal retention ownerであることだけである。Analysis-owned IF image / PDF exportをcurrent必須実装や初期Product Read終点にしない。SavedRouteIntentはin-app saveとして維持するがexternal retentionの前提にしない。

## 13. Safety and epistemic gates

hard reject:

- unsupported diagnosis / personality / hidden cause
- one record -> trend
- cooccurrence -> causal order
- observed / simulated / saved identity mixing
- protective / burden -> fact promotion
- future / probability / optimality claim
- filler step / generic result
- evidence ref absent observed claim / edge
- hidden conflict / insufficient data
- health / medical IF、およびrelationship outcome / other-person intent / reaction IF
- Piece / Emlis voice or body reuse

valid failure resultはpartial map、unknown gap、conflict表示、IF unavailableである。fixed four-step fallbackへ戻さない。

## 14. Verification

V1-D proposed tests:

```text
ai/tests/test_cmee_analysis_v1d_source_adapter.py
ai/tests/test_cmee_analysis_v1d_intent_compiler.py
ai/tests/test_cmee_analysis_v1d_observed_route_realizer.py
ai/tests/test_cmee_analysis_v1d_vertical.py
ai/tests/test_cmee_analysis_v1d_negative_contracts.py
```

V1-E proposed tests:

```text
ai/tests/test_cmee_analysis_v1e_if_route_realizer.py
ai/tests/test_cmee_analysis_v1e_identity_separation.py
ai/tests/test_cmee_analysis_v1e_negative_contracts.py
```

machine acceptance:

- visible observed claim / edge evidence ref coverage 100%
- central routeはrecord count 3以上 + distinct occasion count 2以上 + evidence-backed order / relationの全条件成立時だけexact1
- supplemental answerによるrecord / occasion / period sample水増し 0
- filler step / result 0
- observed graph simulation mutation 0
- simulated step origin label 100%
- future / causal / diagnosis / personality / optimality assertion 0
- text / visual / pointer / history identity mismatch 0
- unknown / conflict concealment 0
- Freeはlatest observed artifact only、prior artifact history access 0、period comparison 0、central route 0..1
- health / medical IFとrelationship outcome / other-person intent / reaction IF 0
- initial V1-D / V1-E mandatory image / PDF / external export 0
- safe projectionのraw body / private source ID / private evidence locator / source digest leakage 0
- policy-external projection read 0

Human Product Read:

- 観測・仮想・unknownを区別できる。
- 現在のrouteとして読めるが、人格診断に見えない。
- protectiveとburdenが原因断定に見えない。
- IFが正解や予測として押し付けられていない。
- actual RN表示でroute / branch / evidence / unknownが読める。
- textとvisual graphが同一canonical identityの一つの商品artifactとして読める。

## 15. Migration and cutover

### 15.1 Stored artifact and wire identity

V1-D first storage candidateはcurrent self-structure report familyへimmutable `watashi.map.v2` JSONをadditive保存する。

```text
wire kind = watashi.map.v2
stored raw user body = 0
stored evidence refs = required
stored artifact_id@version = canonical
latest pointer / history item / detail / text / graph = same stored artifact
view-time meaning or route regeneration = 0
API / RN = audience-authorized safe projection_of canonical artifact
```

implementation前にfresh DB row contract、payload bytes、read/write latency、index / history cost、retention、RLS / accessをpreflightする。current table boundary内で成立しない場合、evidenceを落として通さず`NO_SAFE_ANALYSIS_V1D_STORAGE_STOP`とし、child tableまたはdedicated artifact storageをseparate Mash decisionへ出す。

existing tier、access、unread、dirty / refresh semanticsをregression gateに含める。historical `watashi.map.v1`はread-only version dispatchで既存rendererへ渡す。global V1-D activationがOFFの間はv1 generationを選べるが、V1-D active requestの失敗からv1へper-request fallbackしない。v2 payloadをv1 shapeとして解釈しない。

V1-Eのfirst storage candidateは、Analysis lifecycle ownerが`watashi.if-route-set.v1`と`watashi.saved-route-intent.v1`をobserved mapとは別artifact kind / namespaceでimmutable保存する。parent observed map、scenario set、selected scenarioのversion refを固定し、view-time regeneration 0とする。DB / RLS / payload size / latency / retention / read-policy preflightで安全に分離できなければ`NO_SAFE_ANALYSIS_V1E_STORAGE_STOP`とし、observed `watashi.map.v2`へ混ぜて通さない。

V1-E safe projectionはcanonical IF / Saved identityからAnalysis access ownerが生成する。IF / SavedのAPI / RN pathとstorage exact ownerはV1-E separate approvalでfresh固定し、それまでmaterialize 0である。

external retentionのexact format / coverage / UI / renderer / storageは将来の別approvalまでHOLDである。V1-D / V1-Eのinitial storage / cutoverからimage / PDF exportをmandatory dependencyにしない。

### 15.2 One-owner cutover

V1-D activation packet:

```text
new observed-map generation owner exact1
current Watashi Map v1 generation owner active ingress 0
per-request silent fallback 0
dual-write / dual-render truth owner 0
```

old renderer / API shapeをcompatibility projectionとして使う場合も、truth generation ownerはexact1とする。安全なmigrationができなければ`NO_SAFE_ANALYSIS_V1D_CUTOVER_STOP`。

V1-E activationはV1-D後の別packetで行う。V1-DとIFを一度にactivateしない。

## 16. Completion

```text
CMEE_V1D_ANALYSIS_OBSERVED_ROUTE_OPERATIONAL
```

requires:

- period sourceからpartialを許すevidence-bound observed routeを作る。
- observed / annotation / unknown / conflict identityが分離する。
- text + visual graphを必須とし、latest / history / detail / text / graphがcanonical identityへ一致する。
- Freeでlatest observed artifact only、prior artifact history access 0、period comparison 0、central route 0..1を守る。
- current generic fallback ownerがactive ingress 0になる。
- Product Readとactual RN proofを通過する。

```text
CMEE_V1E_ANALYSIS_IF_ROUTE_OPERATIONAL
```

requires:

- observed mapをmutationせず1–3 scenarioを作る。
- candidate set exact1内でsame base map / routeを持ち、表示順をrankへ昇格しない。
- scenarioをrank / optimal選択しない。
- observed / hypothetical / saved identityが分離する。
- user selection sourceとderived scenario parentを分離する。
- IF / Savedのseparate immutable storage / safe projectionを通過する。
- SELF_ONLYを保ち、health / medicalおよびrelationship outcome / other-person intent / reaction IFを生成しない。
- simulation safety / clarification / display proofを通過する。

V1-DまたはV1-Eをthree-core completionへ自動変換しない。
