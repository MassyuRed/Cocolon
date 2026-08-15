# CMEE V1 Shared Kernel / Runtime Contracts 詳細設計

- document id: `cocolon.cmee.v1.shared_kernel.detailed_design`
- lifecycle: `DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE`
- implementation effect: `0`
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

## 2. Single active host

V1-Aのpublic import boundaryはexact1とする。

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
- shadow / mirror generation
- candidate bodyを生成後metadataだけCMEEで包むこと

既存production I5はV1-A candidateがdisabledの間そのまま維持する。cutover時は同一packetでnew active ingress exact1、old direct active ingress exact0にする。

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

## 4. Pipeline stages exact11

| Stage | Input | Output | Failure owner |
|---|---|---|---|
| S0 Source admission | core request | `AdmittedCoreSourceInput[]` | core adapter |
| S1 Source freeze | admitted private inputs | `SourceEnvelope[]` | shared kernel |
| S2 Evidence binding | source envelopes | `EvidenceGraph` | shared kernel |
| S3 Linguistic proposals / sealing | request-wide exact source spans | provider candidate payload -> sealed `JapaneseAttachmentSet` exact1 | candidate provider + shared kernel sealer |
| S4 Independent admission | set + lock + denominator + mutation evidence | `JapaneseAttachmentAdmission` | CMEE assessor |
| S5 Meaning assembly | evidence + admitted attachments | `GroundedMeaningGraph` | shared + core extension |
| S6 Core intent | meaning graph | `CoreProductIntent` | core compiler |
| S7 Plan | intent + duties | `ExperiencePlan` | core compiler + shared envelope |
| S8 Realization | plan | `RealizationCandidateSet` | modality realizer |
| S9 Validity / selection | candidates | selected candidate or no result | trust + comparator |
| S10 Trace / artifact | selected candidate | `GenerationArtifactBundle` | shared kernel |

S3とS4を同一にしない。candidate providerは自分をformal authorityに認定できない。parser outputはlanguage proposalであり、core meaningまたはuser truthではない。

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
        admitted_attachments: AdmittedJapaneseAttachmentView,
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

ID / digest mismatch、別requestのset swap、admissionだけの再利用はfail-closeする。coreはproduct taxonomyとsource policyを所有するが、syntax candidateのambiguous stateを勝手にuniqueへ変えない。

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

`GroundedMeaningGraph`はprovisional / source-boundである。

Node minimum:

```text
node_id
kind
source_evidence_refs[]
epistemic_state
scope
provenance
attributes
```

Edge minimum:

```text
edge_id
kind
from_node_id
to_node_id
source_evidence_refs[]
direction
epistemic_state
scope
provenance
```

epistemic state:

```text
SOURCE_EXPLICIT
FORMAL_DERIVED
USER_CONFIRMED
USER_CORRECTED
UNKNOWN
CONFLICT
```

Analysisの`INTERPRETIVE_HYPOTHESIS`はseparate annotation claim、`SIMULATED`はseparate `HypotheticalScenarioGraph`へ置く。GroundedMeaningGraphへ混ぜない。`USER_CORRECTED`はoriginal sourceをmutationせず、新source lineageを参照する。

## 7. Planning contract

`ExperiencePlan`は完成文ではなくsemantic dutiesを所有する。

```text
required_duties[]
optional_duties[]
deferred_duties[]
forbidden_promotions[]
interaction_acts[]
artifact_plans[]
ordering_constraints[]
surface_constraints
fallback_disposition
```

Duty:

```text
duty_id
meaning_refs[]
artifact_role
requiredness
allowed_realization_operations[]
forbidden_realization_operations[]
```

forbidden operations default:

- source clause replay
- whole nominal replay as meaning proof
- fixed response
- case / family lookup
- summary append
- ordinal / owner ID surface
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

## 9. Positive realization trace

各visible unitをplan dutyへ、plan dutyをmeaning / evidenceへ戻せなければ生成成功にしない。

```text
RealizationTraceItem
  trace_id
  artifact_unit_ref
  artifact_range_or_node_ref
  plan_duty_ref
  meaning_refs[]
  evidence_refs[]
  operation
```

禁止:

- artifact全体を先頭source spanへ一括bind
- candidate自己申告だけをtrace proofにする
- expected textとの一致をmeaning preservationにする
- hidden metadataへrequired dutyを置きvisible realizationと数える

trace verificationはrenderer / generatorと別functionで行う。ただし新しい独立service、control plane、remote verifierは作らない。

## 10. Error and failure semantics

公開可能なstatus:

```text
GENERATED
QUESTION_PENDING
LIMITED
UNAVAILABLE
REJECTED
SEPARATE_SAFETY
```

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

public body-free reportにはlayer、reason code、counts、schema / provider / policy versionsだけを出す。raw surface、lemma、source range、private pathをpublic reportへ出さない。

## 11. Existing text core integration

`cocolon_text_generation_core`の位置づけ:

```text
CMEE selected text candidate
-> existing common guards
-> CMEE trust reportへ結果を統合
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
- projectionは`projection_of`でcanonical artifactへ戻す。
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
- human Product Read packetを生成できる

schema / interface testだけではcompletion 0である。

## 15. Route B v1 approved acceptance supplement

Canonical contractは`cocolon.cmee.v1a.acceptance.route_b.v1`。承認identityはtechnical body v1.0.0 / canonical SHA-256 `4948bd4d0db491b29021a035af5d596776c86908301b5f49aeff15b2b8418901`である。

### 15.1 Owner universe and exact-one disposition

source adapter / core obligation ownerはprovider実行前に`required_owner_refs`、`active_optional_owner_refs`、`credit_only_owner_refs`、`owner_universe_digest`をsource versionとobligation versionへbindする。`U = required ∪ active_optional`とし、resolver output `D`は次を満たす。

```text
set(D.meaning_owner_id) = U
len(D) = len(U)
duplicate_owner_count = 0
missing_owner_count = 0
denominator_shrink = 0
```

各ownerはexact1の`RouteBOwnerDisposition`を持つ。`route_b_disposition`は`SOURCE_EXPLICIT_VISIBLE | SUPPLEMENTAL_USER_VISIBLE | UNKNOWN_PRESERVED_LIMITED | CLARIFICATION_TARGET | NOT_VISIBLE_UNRESOLVED | SEPARATE_SAFETY` exact6。provider omissionはowner omissionにせず、`MISSING_OR_INVALID / NOT_VISIBLE_UNRESOLVED`として残す。positive visible claimは最初のexact2 dispositionだけが持てる。

### 15.2 Provisional graph boundary

provider proposalはrequest-local `JapaneseAttachmentCandidateSet` / `JapaneseAttachmentAdmission`だけに保持し、`GroundedMeaningGraph`へ入れない。`closure_status=PROVISIONAL_ONLY`、`candidate_set_completeness=NOT_PROVED`、`open_slot_denominator_state=NOT_ESTABLISHED`である。Route B proposalから`FORMAL_DERIVED`または`FORMAL_CLOSED`を作らず、provisional epistemic enumも追加しない。visible positive semanticsは`SOURCE_EXPLICIT`、target exact1の`USER_CONFIRMED / USER_CORRECTED`、または将来別契約でformal closureしたevidenceだけである。

### 15.3 Outcome invariants

- `GENERATED`: 全required visible dutyがsource/user evidenceだけで成立し、unresolved required duty exact0。
- `LIMITED`: 入力固有でsource-boundなmeaningful Observation exact1以上 + bound Reception + unknown明示。raw replay、generic empathy、fixed template、薄い要約は禁止。
- `QUESTION_PENDING`: 上記LIMITEDをPRE_QUESTIONとして保持し、materialなtarget unknown exact1へClarificationRequest exact1をbindする。question-onlyは禁止。
- `UNAVAILABLE`: safeでmeaningfulなvisible claimがない。artifact / question / fallbackはnull。
- `REJECTED`: source role/version/lineage/privacy/contract identity hard-invalid。
- `SEPARATE_SAFETY`: high-care materialを既存separate ownerへ分離。

### 15.4 One clarification and immutable refinement

clarification requestはcanonical original `SourceEnvelope` lifecycle全体で最大exact1。発行時にbudgetを消費し、retry、regeneration、skip、expiry、ambiguous answerでも復活しない。re-ask、second unknown、question rallyは0。問いはsemantic difference exact1を自然・非leadingに尋ね、parser用語やannotation選択を強要せず、skip / unknownを許す。

answerはauthenticated caller-supplied private `SUPPLEMENTAL_ANSWER` SourceEnvelope exact1だけ。original bytes/digest/version、attachment set/admission、original graphをin-place変更せず、新graph version/deltaのtarget unknown exact1だけを`USER_CONFIRMED`または`USER_CORRECTED`へできる。他unknownやprovider ambiguityへ一般化せず、proposalをretroactive formal化しない。

### 15.5 Failure, OOV, privacy, and P0 separation

provider/resource mismatch、crash、invalid payloadは`UNAVAILABLE`、fallback 0、automatic retry 0。OOVはliteral source spanとしてだけ保持でき、relation/lemma/normalization/meaningを推測しない。raw input/output、question、parser output、surface/lemma/range、private identityはpublic禁止。P0では`route_b_owner_disposition_evaluation`と`route_b_sufficiency_evaluation`をともに`NOT_EVALUATED_IN_P0`とする。
