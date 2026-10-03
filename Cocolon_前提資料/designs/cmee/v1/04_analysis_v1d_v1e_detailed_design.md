# CMEE V1-D / V1-E — Analysis Observed / IF Route 詳細設計

- document id: `cocolon.cmee.v1d_v1e.analysis_route.detailed_design`
- lifecycle: `DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE`
- observed-route runtime state: `OBSERVED_STORAGE_AND_API_IMPLEMENTED_DEFAULT_OFF`
- IF-route runtime state: `NOT_IMPLEMENTED`
- Analysis activation: `STORAGE_APPROVED_AND_APPLIED_2026_10_04_JST`; API source接続済み・稼働未配置
- API source effect: V2保存・read分岐実装、default off
- DB effect: dedicated table 1 / migration 20261003204421 applied
- production runtime activation effect: `0`
- RN source effect: versioned safe DTO receiver / renderer implemented; native未確認

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

## 1. Activation boundary

2026-10-03 u94更新：latest weekly §6.6〜6.10に沿い、offline source→部分graphに補足の明示引用訂正・撤回と本人向けsafe text／visual projectionを追加した。RNに閉じたDTOのvalidatorと専用renderer、latest／viewerのversion dispatchを実装。合成入力のbackend26検査、実RN componentを使う11検査、旧表示互換2検査PASS。全追加・変更fileの正本は`current_structure/03_analysis_current_structure.md` §4.5。u95で認証済みsaved period loader→ASTOR明示V2生成entryを追加し、13検査＋既存26検査PASS。u96/u97で専用保存と既存API接続を実装し、承認済みtableを実DBへ適用・照合した。稼働API配信・実ユーザー入力での実行・実機は未実施。

専用保存先のMash判断はu96で承認され、§15.1.2の実装・DB適用まで完了した。次は指定API版の開発配置と本人入力から開発画面で読む一往復を進める。原文節を含むprivate previewを公開DTOへ昇格しない。IF／SavedRouteIntent／外部exportはHOLD。以下の旧順序は設計時の履歴であり、Emlis/Pieceの文章品質全体完了をV1-D開始の待機条件に戻さない。

設計時の順序：

1. Emlis V1-A actual proof
2. V1-B Emlis Question operational proof
3. V1-C Piece visual operational proof
4. V1-D observed routeのimplementation / migration approval
5. observed mapのProduct Read / lifecycle proof
6. V1-E IF routeの別implementation / safety approval

設計のみの旧段階を越えてRN/API sourceを変更し、専用DB schemaを適用した。稼働API配置・global cutoverは未実施。

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

period source-set memberはsaved record identityを持ち、そのchild commitmentとして`ORIGINAL_INPUT`とoptional `SUPPLEMENTAL_ANSWER`を別`SourceEnvelope`でfreezeする。question decision / option / skip等のcontrol lineageとEmlis visible bodyはmeaning source 0である。

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
| mashos-api | `ai/services/ai_inference/astor_material_snapshots.py` | `SAVED_PERIOD_LOADER_IMPLEMENTED_READ_ONLY`: 認証・tier・元入力／補足・生成後再確認 |
| mashos-api | `ai/services/ai_inference/analysis_engine_adapter.py` | `KEEP_MATERIAL_NORMALIZATION_PREIMAGE_ONLY / NOT_GRAPH_ORCHESTRATION_OWNER` |
| mashos-api | `ai/services/ai_inference/astor_self_structure_report.py` | `EXPLICIT_READ_ONLY_V2_ENTRY_IMPLEMENTED`: u95内部preview。保存lifecycleはanalysis_observed_serviceへ分離、cutover未実施 |
| mashos-api | `ai/services/ai_inference/watashi_map_service.py` | `HISTORICAL_V1_GENERATOR / RETIRE_ACTIVE_AT_V1D_CUTOVER` |
| mashos-api | `ai/services/ai_inference/analysis_report_validity_gate.py` | `KEEP_PUBLISH_VALIDITY_GUARD / NOT_MEANING_OR_ROUTE_AUTHORITY / EXTEND_FOR_V2_IDENTITY` |
| mashos-api | `ai/services/ai_inference/api_analysis_reads.py` | `MUST_MAP_BEFORE_CUTOVER`: tier / access / unread / refresh semanticsを保護 |
| mashos-api | `ai/services/ai_inference/api_analysis_reports.py` | `MUST_MAP_BEFORE_CUTOVER`: report familyとのversion / identity境界を固定 |
| mashos-api | `ai/services/ai_inference/api_self_structure.py` | `IMPLEMENTED_DEFAULT_OFF`: latest/status/monthly V2保存read分岐 |
| mashos-api | `ai/services/ai_inference/analysis_observed_service.py` / `report_artifact_read_service.py` / `api_report_reads.py` | `IMPLEMENTED_DEFAULT_OFF`: immutable保存、safe読取、旧履歴統合、unread同一ID |
| mashos-api | `ai/services/ai_inference/api_self_structure_reports.py` | `DELEGATES_TO_UPDATED_READ_SERVICE`: existing route/response shape保持 |
| Cocolon RN | `components/selfStructure/WatashiMapRenderer.js` | `KEEP_HISTORICAL_V1_READ_RENDERER` |
| Cocolon RN | `components/selfStructure/watashiMapFormatters.js` | `KEEP_V1_FORMATTER / DO_NOT_INTERPRET_V2_AS_V1` |
| Cocolon RN | `screens/AnalysisSelfStructureScreen.js` | `REVIEWED_EXISTING_CALLER`: v2受信はgenerate／viewer側 |
| Cocolon RN | `screens/AnalysisContentFirstScreen.js` | `REVIEWED_EXISTING_EMBEDDED_GENERATE_CALLER` |
| Cocolon RN | `screens/analysis/useAnalysisSelfStructureActions.js` | `MUST_MAP_BEFORE_CUTOVER`: generation / refresh / navigation actionをV2 identityへ接続 |
| Cocolon RN | `screens/SelfStructureReportGenerateScreen.js` | `VERSION_RECEIVER_IMPLEMENTED`: 有効DTO／許可modeのみ既読。API source接続済み・稼働未配置 |
| Cocolon RN | `screens/SelfStructureReportViewerScreen.js` | `VERSION_RECEIVER_IMPLEMENTED`: private／未知／不正JSONを旧本文へ戻さない。保存identity lifecycle source接続済み・稼働未配置 |
| Cocolon RN | `screens/SelfStructureReportHistoryScreen.js` | `EXISTING_UUID_READER_REUSED`: V2 UUIDを同じhistory/detailで使用 |
| Cocolon RN | `components/selfStructure/watashiMapAccessPolicy.js` | `KEEP_ACCESS_OWNER / VERIFY_SAFE_V2_PROJECTION` |
| Cocolon RN | `lib/compat/legacyWireContracts.js` | `MUST_MAP_BEFORE_CUTOVER`: v2をv1 aliasへsilent変換しない |
| Cocolon RN | `components/selfStructure/WatashiMapV2Renderer.js` | `IMPLEMENTED_SAFE_V2_RENDERER_SOURCE_ONLY` |
| Cocolon RN | `components/selfStructure/watashiMapV2Contract.js` | `IMPLEMENTED_CLOSED_DTO_AND_TEXT_GRAPH_MODEL` |
| Cocolon RN | `components/selfStructure/WatashiMapRouteGraph.js` | `NOT_MATERIALIZED`: 現段階のgraphはV2Renderer内。分割の必要性待ち |
| Cocolon RN | `tests/analysis-watashi-map-v2-contracts.test.js`、`tests/fixtures/analysis-watashi-map-v2-synthetic.json` | `IMPLEMENTED_SYNTHETIC_BACKEND_TO_RN_TEST` |

V1-D Phase fit-gapはfresh caller / writer / reader graphとexact filenamesを再確認し、上表からのdeltaをapprovalへ出す。V1-EのIF source、storage、API、RN filesは別approvalまでmaterialize 0である。

### 3.2 u94 implementation limits

引用付き補足の対象occurrenceは親recordの完全節へ一意にbindし、元の主体／伝聞／疑問scopeを検証してから集約前に撤回・置換する。answerのnew clauseは元answerのfield/hash/scalar/byteを保持するparser viewで、派生文を新sourceにしない。元の否定・願望は置換へ継承しない。未解釈の補足は期間全体をUNAVAILABLEとする。

safeラベルは格を持つ名詞項と有限述語の型から再構成する。現段階は9動詞と限定名詞grammarの明示本人節のみで、任意の修飾／時点接頭句／複文は未対応。意味を削ってsafe化しない。生成不可を将来のlifecycle callerが扱う必要がある。annotations／conflict／期間比較と順序線のpositive cohortは未完了。

safe projectionは認証された本人向けのSELF_ONLY商品表示で、匿名telemetryではない。意味項としてsource-bound名詞を保つが、原bodyやprivate source/evidence識別子は含めない。unknown／注記／競合は対象refを保持して図と文章へ出し、ラベルだけの重複排除で対象を消さない。端末側のtier検査は認証・server access policyの代用ではない。

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
    optional SUPPLEMENTAL_ANSWER exact1
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

`members[]`はparallel arrayにせず、record identity / version / membership role / commitment / include-exclude reason / child envelope refsを一objectへ束ねる。`PERIOD_RECORD_IDENTITY`はSourceEnvelope roleではない。included recordのoriginal / supplemental childだけを別meaning-bearing SourceEnvelope refとして持つ。

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

canonical stored `watashi.map.v2` artifactはprivateで、exact evidence / source refsを保持する。API / RNへはaccess ownerがversioned safe projectionを作り、`projection_of = artifact_id@version`、visible node / edge / badge、anonymous evidence count、unknown / conflict / period comparison stateだけを渡す。raw body、private source ID、private evidence locator、source digestはprojection 0である。latest / history / detailが同じcanonical identityへresolveすることは、private stored JSONと全audience向けprojection bytesが同一であることを意味しない。

projectionでも`OBSERVED_ORDER`だけが`from_ref / to_ref`を持つ。`REPEATED_COOCCURRENCE`はunordered `endpoint_refs[]`で表し、矢印化しない。annotation / unknown / conflictはvisible labelだけのstring listにせず、safeな`target_ref` / `between_node_refs`を保持してgraph上の対応を失わない。

V1-E safe projectionは`watashi.if-route-set.v1`、SavedRouteIntent safe projectionは`watashi.saved-route-intent.v1`を使う。IF projectionはscenario origin、required condition、friction、unmodelled factorを保ち、rank / score / probabilityを持たない。SavedRouteIntent projectionはowner-authorized exact1で、選択scenarioとoptional noteだけを返す。どちらもobserved safe projectionへ混ぜない。

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
- high-care IF without required confirmation
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
- filler step / result 0
- observed graph simulation mutation 0
- simulated step origin label 100%
- future / causal / diagnosis / personality / optimality assertion 0
- text / visual / pointer / history identity mismatch 0
- unknown / conflict concealment 0
- safe projectionのraw body / private source ID / private evidence locator / source digest leakage 0
- policy-external projection read 0

Human Product Read:

- 観測・仮想・unknownを区別できる。
- 現在のrouteとして読めるが、人格診断に見えない。
- protectiveとburdenが原因断定に見えない。
- IFが正解や予測として押し付けられていない。
- actual RN表示でroute / branch / evidence / unknownが読める。

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

### 15.1.1 u95 actual storage fit-gapと別判断候補（当時未承認、u96承認済み）

2026-10-03にSupabase `cocolon-project` のcatalog／columns／constraints／grants／policies／view定義だけをread-only確認した。ユーザー行・入力本文は読んでいない。

- `myprofile_reports`はRLS enabled、authenticatedのown SELECT policyがあり、content_jsonを含む本人行の直接読取が可能。safe API serializerを通さずprivate evidenceを取得できてしまう。
- `self_structure_reports`は同tableの全列view、security_invoker=true、service_role SELECTのみ。viewが限定されても基底tableの本人direct SELECTは残る。
- uniqueは`(user_id,report_type,period_start,period_end)`、期間列はdate。既存latest writerは固定1970期間へmerge-upsert、monthly writerも同uniqueへupsert／旧schema行削除を行う。private immutable versionの格納先にはそのまま使えない。
- `emotions`のcreated_atはtimestamp without time zone、既存saved-input ownerはUTCと定義。version／deleted_at列はなく、exact7field commitmentと実在本人行を使う。
- byte／latency／history costの実測や新schema validationは未実行。既に確認できたprivate read／immutabilityの不成立に対し、無関係な前段測定を増やさない。

従って現行tableへの格納は`NO_SAFE_ANALYSIS_V1D_STORAGE_STOP`。上の§15.1に従い、次の**1案をMashの別判断へ出す**。この段落は承認済みschemaへの変更ではなくreviewable proposalで、SQL／table／flagはまだ追加・適用していない。

| 候補 | 内容 |
|---|---|
| 保存先 | 同じSupabaseのbackend専用`analysis_observed_artifacts` table 1つ。外部service追加なし |
| identity／access | immutable artifact_id＋version、本人owner、期間、report mode。user削除へ連動、RLS enabled、anon／authenticated直接権限なし、service_roleのみ |
| 内容 | raw user body 0。closed serializerでcanonical evidence refs／source commitments／graph identityと、生成時のsafe projection／textを保存。`asdict(current artifact)`による原文label保存は禁止 |
| freshness／削除 | commit時に本人・tier・source set／version／補足revisionを同transactionで再照合。元記録・補足の変更／削除時は影響artifactを無効化／削除し、readでも検証。request-local再読取をatomic writeと扱わない |
| API | 既存self-structure latest／history／detailのV2分岐だけへ接続。同じ保存identityからsafe projectionを返し、view-time意味再生成0。Free履歴不可・Plus deep不可をserverでも実施 |
| legacy | 旧myprofile_reportsと旧rendererを履歴用に維持。MyProfile互換はcanonicalへdelegate。`/mymodel/infer`／cron／workerの旧builderにprivate metaを共通追加しない |
| 進め方 | この保存方式の判断後にmigration／serializer／保存RPCとAPI差分を実装・検証。現在のPR反映からDB適用・公開cutoverへ自動進行しない |

既存tableのdirect SELECT権限と全旧writerを変える方式より、分析専用の1 tableへ限定する方が変更範囲が小さいため推奨する。旧table全体の権限を黙って剥奪して設計条件を満たしたことにはしない。

### 15.1.2 u96/u97 承認済み保存実装・DB適用

Mashの同じDBへのserver専用table1追加承認により、上記案を実装した。実migration `20261003204421 / analysis_observed_artifacts`、source `supabase/migrations/20261003134440_analysis_observed_artifacts.sql`。14列・14制約・4 index・6関数・5 triggerを事後照合し、関数body全文一致。RLS有効、anon/authenticated直接権限0。private evidenceのsource refs/commitmentと既に生成したsafe text/projectionを保存し、原入力JSON/private node labelは保存しない。

新owner `analysis_observed_service.py` がSQL snapshot→既存CMEE→closed serializer→atomic commit→safe readを担当。DB guardはCMEE commitmentと別namespace。READ COMMITTED＋auth KEY SHARE NOWAIT＋4source表SHARE NOWAITで全cohort/tierを再照合する。生成はlock外。競合409・ACK不明503。source/補足変更・削除、account削除で関連artifactを除去し、read時も再照合。table lockは他user書込にも短く競合し得る。

既存latest/status/monthly/history/detail/unreadへ同じ保存identityを接続。読取で意味を生成し直さず、保存text/graphの一致を検証。旧履歴はaccess後に混在表示し、Free履歴とPlus deepをserverで拒否する。status/latestはmode＋期間で選別してからlimit。RN既読は表示したprojection_ofに固定。

`COCOLON_ANALYSIS_OBSERVED_MODE`はoff既定／read_only保存読取／development生成保存。稼働envは未変更。monthly include_secret=false/now_isoは未対応400。旧/mymodel・cron/workerは今回変更しておらず、下記global単一owner cutoverの完了ではない。

Python54、RN11＋旧互換2、隔離PGlite31項目PASS。実ユーザー入力の生成・稼働APIの保存往復・複数接続負荷・nativeは未確認。適用応答待ちの停止からの再開経緯、実権限、既知範囲、次の指定API開発配置は06/API handoff末尾u96/u97に記録。全file mapはAnalysis map §4.7。

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
- latest / history / detail / text / visualがcanonical identityへ一致する。
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
- simulation safety / clarification / display proofを通過する。

V1-DまたはV1-Eをthree-core completionへ自動変換しない。
