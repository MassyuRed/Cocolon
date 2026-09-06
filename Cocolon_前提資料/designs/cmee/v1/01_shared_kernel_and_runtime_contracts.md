# CMEE V1 Shared Kernel / Runtime Contracts 詳細設計

- document id: `cocolon.cmee.v1.shared_kernel.detailed_design`
- revision date: `2026-08-17 JST`
- lifecycle: `DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE`
- Phase 2 product-route verdict: `ADOPT_WITH_BOUNDED_CORRECTIONS_REFLECTED`
- canonical field / ref / version owner: `05_json_schema_and_versioning.md`
- implementation / cutover / dependency effect: `0`
- parent: `00_read_first.md`

---

## 0. Design goal

CMEE shared kernelは、三商品を同じ文章へ統一する層ではない。次の変換を、sourceとartifactのidentityを失わずに行うrequest-local engineである。

```text
Core-owned legitimate sources
-> SourceEnvelope / EvidenceGraph
-> provisional meaning candidates
-> core-owned product intent
-> ExperiencePlan / ArtifactPlan
-> modality realization candidates
-> hard validity + fidelity-first selection
-> PositiveRealizationTrace
-> GenerationArtifactBundle
```

## 1. Proposed package topology

first verticalではrepoの既存規約に合わせ、shared責任をflatに保つ。各phaseで必要になったfileだけを作り、directory skeletonを先行commitしない。

```text
ai/services/ai_inference/cocolon_meaning_experience_engine/
  __init__.py
  engine.py
  contracts.py
  source_kernel.py
  japanese_structure.py
  meaning_graph.py
  artifact_plan.py
  realization_trace.py
  trust_pipeline.py
  cores/
    __init__.py
    emlis/       # V1-A actual verticalと同時にmaterialize
    piece/       # V1-Cまで作らない
    analysis/    # V1-Dまで作らない
```

`contracts.py`はimmutable type / enum / serialization、`engine.py`はorchestrationだけを所有する。file責任がactual code量・循環import・reviewabilityの観点で分割を必要とする場合は、Phase implementation approvalでexact pathを再固定する。future directoryを空で作らない。

## 2. Single active host per lifecycle lane

V1-AのCMEE public import boundaryはexact1とする。

```python
from cocolon_meaning_experience_engine import (
    MeaningExperienceEngine,
)

outcome = MeaningExperienceEngine.generate(request)
```

禁止:

- core adapterからkernel private moduleへ直接import
- runnerからold recovery builderとCMEEを同時にactive call
- CMEE失敗時のlegacy fallback
- shadow／mirror／dual-run generation
- candidate bodyを生成後metadataだけCMEEで包むこと
- PR #2 large recovery／surface／semantic-overlayをCMEE subengineまたはwrapperとして呼ぶこと

NLSv3はcontainer単位ではなく責任単位で継承する。

| Owner | 継承する責任 | 明示的な非owner |
|---|---|---|
| CMEE shared kernel | source identity／role／version／privacy、evidence binding、source-bound meaning／unknown／epistemic state、generic `ExperiencePlan.duties[]`、positive trace、hard validity、artifact identity／schema／lineage | Emlisの声・観測・問い・Product Read・safety public mapping |
| CMEE Emlis route | Emlis input projection、Observation／Reception、sufficiency／clarification、voice／distance／depth／naturalness、body-only inverse、Emlis Product Read、safety triage／public mapping | Piece／Analysis product judgment |
| future Piece／Analysis routes | 各productで実測後に改良したmeaning／verification／Product Read | Emlis shapeのcopy、V1 runtime materialization |
| test／failure knowledge | usable mutation vector、regression、naturalness／anti-template failure knowledge | generation authority、runtime fallback、active engine |

NLSv3の旧ownerは移管完了後にactive generation authorityを持たない。knowledge／historyの保持をactive owner維持と解釈しない。

### 2.1 A／B lane ownership

A／BのauthorizationはFinal Technical Designとmigration ownerが持ち、本shared contractまたは`execution_scope`はcutover approvalを持たない。

| Point | Cycle candidate lane | Production generation lane | Production safety |
|---|---|---|---|
| after A | CMEE ingress exact1／NLSv3 direct recovery 0 | current I5 exact1／CMEE 0 | current owner unchanged／CMEE production safety effect 0 |
| after B | CMEE ingress exact1／NLSv3 direct recovery 0 | CMEE Emlis exact1／current direct 0 | separately fixed public mapping and single safety owner exact1 |

AとBを同時cutover／同一approvalにしない。`EngineOutcome.SEPARATE_SAFETY`はshared outcome semanticsであり、current production safety ownerを代替しない。Bより前にcurrent safe response／public behavior mapping、single owner、silent empty 0、fallback／dual-run 0を別判断で固定する。

## 3. Request-local execution model

CMEEはrequestごとにimmutable contextを作る。

```text
EngineRequestContext
  request_id
  core_id
  product_job
  policy_versions
  schema_versions
  provider_identity
  source_envelopes
  privacy_context
  capability_context
```

public Python `GenerationRequest`はJSON metadataだけではなく、request-local private inputを同じimmutable objectに持つ。

```text
GenerationRequest
  meta: GenerationRequestMeta
  source_inputs_private: tuple[CoreSourceInputPrivate, ...]
  core_payload_private: CoreRequestPayloadPrivate
```

`meta.source_input_refs`とprivate input ID setはexact matchを必須とする。Core source adapterがowner / entitlement / role / versionをadmitして初めて`SourceEnvelope(meta, material_private)`を作る。raw Japanese bodyをglobal registry、body-free schema、logger、opaque refの外部lookupから取得しない。Piece / Analysisではcore lifecycle serviceが認証・取得済みprivate materialを渡し、CMEE自身はDB ownerにならない。

global mutable candidate cache、cross-request source、process-wide monkeypatch、case fixture lookupを使わない。

許可するcacheは、immutable external model instanceのread-only load cacheだけである。cacheはsource、owner、candidate、decision、traceを保持しない。model identity mismatch時はprocessをfail-closeし、新resourceをruntime downloadしない。

`GenerationRequestMeta.execution_scope`等のlane値を保持する場合、それはrequest-local ingress routing contextに限る。許可済みentry laneの選択には使えるが、meaning claim、relation、epistemic state、duty、trace bindingまたはcanonical artifact materialを選択・変更してはならない。`GroundedMeaningGraph`、`ExperiencePlan`、`GenerationArtifactBundle`の意味、artifact digest／identity／lineage、Product Read対象identityへ含めない。

## 4. Pipeline stages exact11

| Stage | Input | Output | Failure owner |
|---|---|---|---|
| S0 Source admission | core request | `AdmittedCoreSourceInput[]` | core adapter |
| S1 Source freeze | admitted private inputs | `SourceEnvelope[]` | shared kernel |
| S2 Evidence binding | source envelopes | `EvidenceGraph` | shared kernel |
| S3 Linguistic proposals／sealing — provider-required route only | request-wide exact source spans | provider candidate payload → sealed `JapaneseAttachmentSet` exact1 | candidate provider + shared kernel sealer |
| S4 Independent admission — provider-required route only | set + lock + denominator + mutation evidence | `JapaneseAttachmentAdmission` | CMEE assessor |
| S5 Meaning assembly | evidence + `AdmittedJapaneseAttachmentView` OR verified `SourceExplicitNoProviderContext` | `GroundedMeaningGraph` | shared + core extension |
| S6 Core intent | meaning graph | `CoreProductIntent` | core compiler |
| S7 Plan | intent + duties | `ExperiencePlan` | core compiler + shared envelope |
| S8 Realization | plan | `RealizationCandidateSet` | modality realizer |
| S9 Validity／selection | candidates | selected candidate or no result | trust + core comparator |
| S10 Trace／artifact | selected candidate | `GenerationArtifactBundle` | shared kernel |

S3とS4を同一にしない。candidate providerは自分をformal authorityに認定できず、parser outputはlanguage proposalであってcore meaningまたはuser truthではない。

### 4.1 Provider route preselection

meaning authority routeはprovider invocation前にexact1選び、request途中で切り替えない。

| Route | Use | Required invariants |
|---|---|---|
| `FORMAL_ATTACHMENT_ROUTE` | `FORMAL_DERIVED`、provider-derived meaning／relation／attachmentを一つでも使う | S3／S4必須、formal admission成立 |
| `SOURCE_EXPLICIT_NO_PROVIDER_ROUTE` | visible claim全量が`SOURCE_EXPLICIT`またはauthenticated supplemental evidenceへbindした`USER_CONFIRMED / USER_CORRECTED`だけ | provider-derived usage 0、required source coverage、unknown preservation、polarity／modality／time、evidence binding、no-added-claim |

source-explicit routeではS3／S4を`NOT_APPLICABLE_PRESELECTED_SOURCE_EXPLICIT_ROUTE`として記録し、providerを呼ばない。`None`、empty attachmentまたはprovider未設定を暗黙のsource-explicit authorityにしない。

provider-required routeのprovider／resource mismatch、crashまたはinvalid payload後にsource-explicit routeへsilent switch、fallback、retryしない。route selectionをCycle001の251-owner denominator、fresh current100、acceptance contractの緩和または自動PASSへ変換しない。

## 5. Port contracts

### 5.1 `CoreSourceAdapter`

```python
class CoreSourceAdapter(Protocol):
    def admit(self, request: GenerationRequest) -> tuple[AdmittedCoreSourceInput, ...]: ...
```

`AdmittedCoreSourceInput`はrequest-local / nonserializableで、S0がowner / entitlement / requested role / versionを確認した結果だけを持つ。まだcanonical `SourceEnvelope`ではない。

```text
AdmittedCoreSourceInput
  private_input: CoreSourceInputPrivate
  admitted_source_type
  admitted_source_role
  admitted_stage
  admitted_owner_scope
  parent_source_refs[]
  material_present
```

S1のshared source kernelだけが`AdmittedCoreSourceInput`からcanonical metaを作り、raw materialとpairにして`SourceEnvelope`をfreezeする。adapterとkernelが別々のEnvelope ID / role / versionを作ることは0である。`SourceEnvelope`はrequest-local / nonserializableなpairである。

```text
SourceEnvelope
  meta: SourceEnvelopeMeta
  material_private: SourceMaterialPrivate
```

public projectionはmetaそのものでもなく、public-safe quality reportのanonymous counts / reason / versionだけである。providerはprivate material handleからraw Japanese bytesを読み、serializer / loggerは読まない。

責任:

- source owner / entitlement / stage / version / privacyの確認
- original / supplemental / history / period / simulation sessionの分離
- cross-core body mixing rejection

source bodyを意味解釈したり、output textを作らない。

### 5.2 `JapaneseStructureCandidateProvider`

```python
class JapaneseStructureCandidateProvider(Protocol):
    identity: ProviderIdentity
    def analyze(
        self,
        sources: tuple[SourceEnvelope, ...],
        spans: tuple[EvidenceSpan, ...],
    ) -> JapaneseAttachmentCandidatePayload: ...
```

providerはrequest-wide source tupleを一括解析し、requestにつきcandidate payload exact1を返す。sourceごとのsetを後段で無定義mergeしない。shared kernel sealerがpayloadへrequest-wide identityを付与し、`JapaneseAttachmentSet` exact1を作る。

`JapaneseAttachmentCandidatePayload`はruntime-only / private body-fullで、次のclosed shapeを持つ。

```text
JapaneseAttachmentCandidatePayload
  provider_candidate_owners[]:
    meaning_owner_id
    source_range_candidate
    token_range_candidates[]
    predicate_candidates[]
    argument_candidates[]
    open_slot_candidates[]
    scope_candidates[]
    candidate_local_resolution
    ambiguity_reasons[]
    unresolved_reasons[]
    producer_provenance
  provider_diagnostics_private[]
```

payloadは`attachment_set_id`、canonical digest、source binding digest、closure status、admitted owner refsを持てない。provider protocolのimmutable `identity`とpayload provenanceもshared sealerがapproved contextへ照合し、payloadの自己申告をauthorityにしない。

sealed setは各ownerについて次を必ず持つ。

```text
attachment_set_id
canonical_private_digest
provider_identity / resource_lock_ref
source_bindings[] = source_id + source_version + field body digest
owners[]:
meaning_owner_id
source_range
token_ranges
predicate_candidates[]
argument_candidates[]
lemma / inflection candidates
case role / governing edge candidates
scope candidates
provenance
candidate-local resolution = UNIQUE | AMBIGUOUS | UNRESOLVED
reason_codes[]
```

sealing algorithm:

1. `source_bindings[]`をadmitted `SourceEnvelope` tupleのsource ID / version / field body digest exact setからshared kernelが作る。
2. providerが供給したidentity / digest claimはauthorityに使わない。
3. `canonical_private_digest` fieldを除くclosed canonical private set bytesをshared kernelが独立recomputeする。
4. recomputeしたdigestとrequest-local `attachment_set_id`をimmutable sealed copyへbindする。
5. set swap、source set差、field digest差、provider / resource lock差をfail-closeする。

empty ambiguity listをsuccess条件にしない。candidateを列挙できなければ`UNRESOLVED`である。provider outputは`FORMAL_CLOSED`を自己申告しない。

### 5.3 `JapaneseAttachmentAdmissionAssessor`

```python
class JapaneseAttachmentAdmissionAssessor(Protocol):
    def assess(
        self,
        attachment_set: JapaneseAttachmentSet,
        admission_context: AttachmentAdmissionContext,
    ) -> JapaneseAttachmentAdmission: ...
```

assessment input:

- approved provider / resource lock identity
- source / range closure
- complete-candidate-set evidence
- formal open-slot denominator
- independent mutation evidence
- approved Route A / B contract version

assessment output closure status。provider resultではなく、independent admission resultだけが次を持つ。

```text
FORMAL_CLOSED
PROVISIONAL_ONLY
UNRESOLVED
UNAVAILABLE
```

`FORMAL_CLOSED`にはcomplete candidate set、formal open-slot denominator、visible projection exact1、independent mutation rejectionが必要である。statistical one-bestは`PROVISIONAL_ONLY`であり、current formal contractではmeaning graphのvisible authorityへ昇格できない。

### 5.4 `CoreMeaningCompiler`

```python
class CoreMeaningCompiler(Protocol):
    def compile(
        self,
        evidence: EvidenceGraph,
        attachment_context: AdmittedJapaneseAttachmentView | SourceExplicitNoProviderContext,
    ) -> GroundedMeaningGraph: ...
```

`AdmittedJapaneseAttachmentView`はassessorだけがrequest-localにsealするpairである。

```text
AdmittedJapaneseAttachmentView
  attachment_set
  admission
  invariant:
    attachment_set.attachment_set_id == admission.attachment_set_ref
    attachment_set.canonical_private_digest == admission.attachment_set_digest
    source ID / version / field digest exact match
    provider / resource lock exact match
```

`SourceExplicitNoProviderContext`はroute selectorがprovider実行前にだけsealするrequest-local／nonserializable markerである。

```text
SourceExplicitNoProviderContext
  route = SOURCE_EXPLICIT_NO_PROVIDER_ROUTE
  provider_derived_meaning_relation_attachment_count = 0
  source_coverage = PASS
  unknown_preservation = PASS
  polarity_modality_time = PASS
  evidence_binding = PASS
  no_added_claim = PASS
  selected_before_provider_invocation = true
```

ID／digest mismatch、別requestのset swap、admissionだけの再利用、provider failure由来のroute changeはfail-closeする。coreはproduct taxonomyとsource policyを所有するが、syntax candidateのambiguous stateを勝手にuniqueへ変えない。

### 5.5 `CoreIntentCompiler`

```python
class CoreIntentCompiler(Protocol):
    def decide(self, graph: GroundedMeaningGraph) -> CoreProductIntent: ...
```

Emlisの観測、Pieceの共有、Analysisのmap / IFを同一intentにしない。

### 5.6 `ArtifactRealizer`

```python
class ArtifactRealizer(Protocol):
    def realize(self, plan: ExperiencePlan) -> RealizationCandidateSet: ...
```

realizerはplanにないsemantic edgeを作らない。text / visual / graphは同じprotocolを使えるが、modality実装は分離する。

## 6. Meaning graph boundary

`GroundedMeaningGraph`はprovisional／source-boundである。exact field名、required／optional、ref encodingは`05_json_schema_and_versioning.md`のsole authorityに従い、本sectionはruntime semanticsだけを所有する。

| Element | Runtime semantic minimum |
|---|---|
| node | typed meaning unit、EvidenceGraph内evidenceへのversion-qualified binding、epistemic state、polarity、modality、temporal scope、forbidden promotion |
| edge | typed relation、exact endpoints／direction、EvidenceGraph内evidenceへのversion-qualified binding、epistemic state、provenance |
| graph | source refs、EvidenceGraph ref、derivation mode、conditional attachment admission、statusを一つのimmutable versionへbind |

epistemic state:

```text
SOURCE_EXPLICIT
FORMAL_DERIVED
USER_CONFIRMED
USER_CORRECTED
UNKNOWN
CONFLICT
```

`SOURCE_OR_USER_EVIDENCE_ONLY` modeでは`FORMAL_DERIVED`を0、attachment admission refをnullとし、§4.1のsource coverage／unknown／polarity／modality／time／evidence／no-added-claimを再検証する。`FORMAL_DERIVED`が一つでもあれば`FORMAL_ATTACHMENT_ADMITTED` modeとnon-null formal admissionを必須にする。provider failure後にmodeを変えない。

Analysisの`INTERPRETIVE_HYPOTHESIS`はseparate annotation claim、`SIMULATED`はseparate `HypotheticalScenarioGraph`へ置き、GroundedMeaningGraphへ混ぜない。`USER_CORRECTED`はoriginal sourceをmutationせず、新source lineageとnew graph versionを参照する。

## 7. Planning and coverage ownership

`ExperiencePlan`は完成文ではなくproduct realization dutiesを所有し、canonical field shapeは`05_json_schema_and_versioning.md`の`duties[]` exact1とする。

```text
ExperiencePlan
  duties[]:
    duty_id
    duty_kind
    semantic_refs[]
    retention = REQUIRED | OPTIONAL | DEFERRED
    allowed_operations[]
    forbidden_operations[]
  ordering[]
  interaction_acts[]
  artifact_plans[]
  surface_constraints[]
  forbidden_promotions[]
  fallback_disposition
```

shared ownerはgeneric duty envelope、meaning refs、retention、ordering、artifact bindingまでである。何をObservation、Reception、Piece expression、Analysis node／edgeとして選ぶかはcore ownerが決める。

source coverageとplan dutyを混ぜない。

1. `SourceEnvelope / EvidenceGraph`: admitted sourceとexact evidence。
2. generic source-coverage concept: admitted source materialのcoverage denominator。
3. `GroundedMeaningGraph`: source-bound meaning／unknown／conflict。
4. `ExperiencePlan.duties[]`: product artifactで実現するsole plan-duty record。

current PR #3の`SourceOwnerUniverse`はgeneric source-coverage conceptのEmlis V1-A current shape、`RouteBOwnerDisposition`はEmlis／Route B core-owned shapeである。両方を`PROVISIONAL_EMLIS_SPECIALIZATION / NOT_YET_PROMOTED_TO_CROSS_CORE_SHARED_FINAL`とし、Piece／Analysisへ要求しない。第2 actual productが同じ責任を実証した後の別design changeだけがpromotionできる。

forbidden operations default:

- source clause replay
- whole nominal replay as meaning proof
- fixed response
- case／family lookup
- summary append
- ordinal／owner ID surface
- relation direction reversal
- unknown completion

## 8. Candidate generation and selection

`RealizationCandidateSet`は同一meaning / planを異なるsurfaceで実現する候補だけを比較する。意味の異なるAnalysis IF scenario同士は比較しない。

Selection exact2:

1. hard validity
2. fidelity-first ordering among valid candidates

Hard validity:

- legitimate sources
- required duty coverage
- unsupported claim 0
- cross-core mixing 0
- epistemic partition exact
- privacy / access exact
- artifact identity valid
- positive trace complete
- core-specific safety valid

Fidelity ordering:

1. must-keep coverage
2. no added meaning
3. polarity / modality / relation / unknown / scope
4. product intent fit
5. naturalness / readability
6. latency / memory / visual compactness

score合算でhard failureを埋めない。valid candidateが0なら`UNAVAILABLE`またはcore-owned `ASK`である。

shared selectionはhard validityとmeaning fidelityのprotocolだけを所有する。Emlis natural／anti-template comparator、Piece visual／share judgment、Analysis route readabilityとhuman Product Readはcore-ownedであり、shared numeric scoreまたはmachine reportへ統合しない。

## 9. Positive realization trace and distinct evidence families

各visible unitをplan dutyへ、plan dutyをmeaning／evidenceへ戻せなければ生成成功にしない。

```text
RealizationTraceItem
  visible_artifact_unit_ref
  unit_role = SEMANTIC_REALIZATION | UNKNOWN_DISCLOSURE | RECEPTION
  plan_duty_ref
  semantic_node_or_edge_refs[]
  source_evidence_refs[]
  constrained_owner_refs[]
  attachment_witness_refs[]
  realization_operation
  coverage_status
```

role-aware invariant:

- `SEMANTIC_REALIZATION`／`RECEPTION`: semantic ref exact1以上、source／user evidenceへ連続。
- `UNKNOWN_DISCLOSURE`: semantic refs exact0とし、source evidence ref、constrained owner refをそれぞれexact1以上持って何を確定しなかったかを示す。fake UNKNOWN nodeを作らない。
- provider proposal単独のattachment witnessはvisible meaning authorityにならない。

禁止:

- artifact全体を先頭source spanへ一括bind
- candidate自己申告だけをtrace proofにする
- expected textとの一致をmeaning preservationにする
- hidden metadataへrequired dutyを置きvisible realizationと数える

evidence familyを相互代替しない。

| Evidence | Owner／meaning | Not a substitute for |
|---|---|---|
| `PositiveRealizationTrace` | shared semantic lineage | human Product Read、guard proof |
| current PR #3 `VisibleUnitTrace` | V1-A provisional implementation mapping of positive trace | second canonical trace owner |
| `CommonGuardProof` | common guard実行のmachine evidence | semantic trace、meaning authority、Product Read PASS |
| Emlis body-only inverse | Emlis core-owned completed-body reverse verification | shared trace／guard |
| human Product Read | core-owned reading of immutable artifact | machine report |

trace verificationはrenderer／generatorと別functionで行うが、独立service、control plane、remote verifierは作らない。

## 10. Error and failure semantics

`GenerationArtifactBundle`はvisible artifactがある`GENERATED | LIMITED`だけを持つ。outer `EngineOutcome`は次のexact6を所有する。

```text
GENERATED
QUESTION_PENDING
LIMITED
UNAVAILABLE
REJECTED
SEPARATE_SAFETY
```

`QUESTION_PENDING`はtyped clarificationとcore policyに応じたoptional LIMITED artifactを持てる。`UNAVAILABLE`、`REJECTED`、`SEPARATE_SAFETY`はempty primary artifactを作らない。`SEPARATE_SAFETY`はnormal generationへ混ぜないshared result shapeであり、Emlis production safety triage、safe responseまたはpublic mappingのownerではない。

内部failure layer:

```text
SOURCE_ADMISSION
EVIDENCE_BINDING
LINGUISTIC_PROVIDER
ATTACHMENT_ADMISSION
MEANING_ASSEMBLY
CORE_INTENT
PLAN
REALIZATION
HARD_VALIDITY
TRACE
ARTIFACT_IDENTITY
```

reason code例:

```text
SOURCE_ROLE_NOT_ALLOWED
SOURCE_VERSION_MISMATCH
PROVIDER_IDENTITY_MISMATCH
PREDICATE_ATTACHMENT_AMBIGUOUS
ARGUMENT_ATTACHMENT_UNRESOLVED
MEANING_DUTY_UNREALIZED
UNSUPPORTED_CLAIM_ADDED
CROSS_CORE_SOURCE_MIXED
POSITIVE_TRACE_INCOMPLETE
NO_VALID_CANDIDATE
```

public body-free reportにはlayer、reason code、anonymous counts、schema／provider／policy versionsだけを出し、raw surface、lemma、source range、private pathを出さない。`BodyFreeQualityReport`は`MACHINE_ONLY`であり、human verdict／product acceptanceを含めず、artifactをmutateしない。

human Product Readはimmutable `artifact_id@artifact_version`をengine外から読むcore-owned evaluationである。machine reportからPASSへ変換せず、修正はnew generation／new artifact versionとして作る。

## 11. Existing text core integration

`cocolon_text_generation_core`の位置づけ:

```text
CMEE selected text candidate
-> existing common guards
-> CommonGuardProof（machine evidence）
-> shared machine trust result
```

再利用候補:

- evidence / phrase / sentence-plan typesの概念
- Japanese coherence
- template echo
- overclaim
- grounding
- must-keep
- exact3 boundary tests

禁止:

- current composerをCMEE hostへrename
- caller-supplied completed textをCMEE generated resultとみなす
- current Emlis / Piece / Analysis adaptersをnew core compilerへ昇格
- guard PASSをProduct Read PASSへ変換

## 12. Artifact identity and persistence boundary

CMEEは新しいDB ownerにならない。

- CMEEはcanonical artifact bundleを返す。
- 各core serviceが既存または別承認されたlifecycleへ保存する。
- `artifact_id@artifact_version`はcanonical semantic payloadから作る。
- volatile runtime fields、body locator、timing、debug dataをidentity materialへ入れない。
- `execution_scope`、CYCLE／PRODUCTION lane、cutover stateをidentity materialへ入れない。
- machine verdict、`BodyFreeQualityReport`、human Product Read verdictをcanonical semantic payload／lineage materialへ入れない。
- old NLS RC、Gate、Receipt、controller、executor、FD identityをartifact version／parent refへ使わない。
- projectionはversion-qualified `projection_of`でcanonical artifactへ戻す。
- Piece image binaryはderived、Analysis text / graphはprojection、Emlis visible textはConversationalObservationのprimary projectionである。

## 13. Performance and resource boundaries

Default:

- same process
- CPU-only
- runtime network 0
- external service 0
- secret 0
- CMEEによるstorage write 0
- one request / one immutable context

External linguistic providerのfresh admissionでは次を測る。

- cold model load
- installed bytes
- model / dictionary bytes
- max RSS one process
- per-request p50 / p95 latency
- concurrency時のmemory multiplier
- supported Python / OS / architecture

数値上限はactual measurementなしに捏造しない。current baselineに対するmaterial increaseはMashの別LEVEL_3判断へ戻す。

## 14. Shared kernel acceptance

Shared kernelを完成と数えるminimum:

- actual Emlis requestがsingle callableを通る
- source -> meaning -> plan -> realization -> trace -> bundleが連続
- no private body public
- hard invalid candidate rejection
- mutation testsでsource / polarity / relation / unknown / duty / trace driftを拒否
- existing text guardsをsubsystemとして利用または明示不採用
- Piece / Analysis runtime exact0
- active duplicate owner 0
- immutable artifactと`MACHINE_ONLY` reportをhuman Product Read ownerへ渡せる（human verdictは生成しない）

schema / interface testだけではcompletion 0である。

## 15. Emlis V1-A Route B retained semantic constraints

旧L3-R／P0／P0-R1のpacket、body identity、Gate、Receipt、controller、executor、FD、旧approval orderはhistorical operational shellであり、shared kernelのruntime／implementation prerequisite／authorityへ移さない。ここで保持するのはmeaning sovereignty、unknown、no-promotion、one clarification、immutable refinement、no fallback等のusable semantic／failure knowledgeだけである。

### 15.1 Provisional Emlis coverage specialization

current PR #3の`SourceOwnerUniverse`はgeneric coverage概念のcurrent Emlis shape、`RouteBOwnerDisposition`はEmlis／Route B core-owned shapeである。

```text
SourceOwnerUniverse.status = PROVISIONAL_EMLIS_SPECIALIZATION
RouteBOwnerDisposition.status = PROVISIONAL_EMLIS_SPECIALIZATION
promotion = NOT_YET_PROMOTED_TO_CROSS_CORE_SHARED_FINAL
```

Piece／Analysisにこれらのtype、owner denominatorまたはdisposition enumを要求しない。shared final promotionは第2 actual productで同じ責任が実証された後の別design changeだけで行う。`ExperiencePlan.duties[]`はplan dutyのcanonical shared ownerであり、source coverage denominatorまたはRoute B dispositionではない。

Emlis V1-A／Route B内でowner universeを使う場合、required／active／credit-onlyをsource versionとobligation versionへbindし、duplicate、missing、denominator shrinkを0にする。これはEmlis product admission semanticsであり、251というcurrent Cycle denominatorをshared runtime constantへしない。

### 15.2 Source-explicit and provider-required dispositions

preselected source-explicit routeはprovider omissionまたはfailureではない。visible claim全量がsource／user evidenceで成立する時、source-explicit／supplemental visible dispositionを使える。unknown ownerはunknownのまま保持し、generic fillerへ変えない。

provider-required routeでproviderがmissing／invalidならroute変更せず、`NOT_VISIBLE_UNRESOLVED`または`UNAVAILABLE`へfail-closeする。provider omissionをowner omissionにせず、provider failure後のsilent source-explicit fallbackを禁止する。positive visible claimへprovider proposalだけを使わず、`FORMAL_DERIVED`にはformal admissionを必須にする。

### 15.3 Outcome invariants

- `GENERATED`: 全required visible dutyがsource／user evidence、またはformal-admitted evidenceで成立し、unresolved required duty exact0。
- `LIMITED`: 入力固有でsource-boundなmeaningful Observation exact1以上 + bound Reception + unknown明示。raw replay、generic empathy、fixed template、薄い要約は禁止。
- `QUESTION_PENDING`: LIMITED PRE_QUESTION artifactとmaterial target unknown exact1へbindしたClarificationRequest。question-onlyは禁止。
- `UNAVAILABLE`: safeでmeaningfulなvisible claimがない。artifact／question／fallbackはnull。
- `REJECTED`: source role／version／lineage／privacy／contract identity hard-invalid。
- `SEPARATE_SAFETY`: high-care materialを既存separate ownerへ分離。production safety ownerの代替ではない。

### 15.4 One clarification and immutable refinement

clarification requestはcanonical original `SourceEnvelope` lifecycle全体で最大exact1。発行時にbudgetを消費し、retry、regeneration、skip、expiry、ambiguous answerでも復活しない。answerはauthenticated caller-supplied private `SUPPLEMENTAL_ANSWER` SourceEnvelope exact1だけで、original bytes／digest／version、attachment set／admission、original graphをin-place変更しない。target unknown exact1だけをnew graph versionで`USER_CONFIRMED / USER_CORRECTED`にできる。

### 15.5 Failure knowledgeとcurrent Cycle contractの分離

provider／resource mismatch、crash、invalid payloadはprovider-required routeで`UNAVAILABLE`、fallback 0、automatic retry 0。OOVはliteral source spanとしてだけ保持し、relation／lemma／normalization／meaningを推測しない。raw input／output、question、parser output、surface／lemma／range、private identityはpublic禁止。

一方、251-owner、Cycle001のfresh current denominator／acceptance、current100評価条件はCMEE implementation prerequisiteではないが、本設計からhistorical-only、unnecessaryまたはretiredとは決めない。本設計はそれらを変更・緩和・退役せず、Cycle適用時はfresh Cycle001 current ownerに従う。
