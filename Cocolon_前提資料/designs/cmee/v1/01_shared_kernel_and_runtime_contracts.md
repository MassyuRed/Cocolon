# CMEE V1 Shared Kernel / Runtime Contracts 詳細設計

> 2026-09-11 Q3現在地：添付修正版Technical Design v1.2に従い、Q2のコード実装完了からQ3へ進めた。Plusの適格本人履歴、Premiumの本人続行による最大3問と確認・修正・否定できる解釈フレーム、限定条件のLayer3を保存・API・RNまで実装した。Q3のコード実装は完了し、次の実装単位はQ4の統合・実本文確認・互換性・公開接続準備。実DB適用、端末・実課金確認、Mashの正式商品判断、公開操作は別作業として未実施。default OFF、商品NOT_CLEAR、Draft/open/unmergedを維持する。以下の旧Q1/Q2段落・Product Read待ちの順序は当時の履歴であり、Q3/Q4のコード進行を止める現行条件ではない。現在の進行ownerは本系列の`06_implementation_order_migration_and_verification.md`末尾Q3節とAPI既存handoff末尾Q3節。


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
- `QUESTION_PENDING`: 旧shared v1ではLIMITED PRE_QUESTION＋target unknown exact1。Emlis thread v1では本文充足度（SUFFICIENT／LIMITED）と問い要否（ASK／END／BLOCKED）を分離し、成立済みの初回Layer 1／2＋意味を深める一点のClarificationを返す。本文失敗を問いで代替しない。question-onlyは禁止。
- `UNAVAILABLE`: safeでmeaningfulなvisible claimがない。artifact／question／fallbackはnull。
- `REJECTED`: source role／version／lineage／privacy／contract identity hard-invalid。
- `SEPARATE_SAFETY`: high-care materialを既存separate ownerへ分離。production safety ownerの代替ではない。

### 15.4 One clarification and immutable refinement

旧shared版はoriginal source lifecycle全体で最大1回。Emlis thread版は一round一問、thread上限はFree／Plus 1回、Premium 3回。今回Q1はFree最大1回の純粋処理だけで、後続round・永続的枠管理は未実施。発行時にbudgetを消費し、retry、regeneration、skip、expiry、ambiguous answerでも復活しない。answerはauthenticated caller-supplied private `SUPPLEMENTAL_ANSWER` SourceEnvelope exact1だけで、original bytes／digest／version、attachment set／admission、original graphをin-place変更しない。旧shared v1のtarget unknown exact1更新は旧契約内に保持する。Emlis thread v1は、問い焦点の補足・同threadで対象を特定できる本人の明示訂正・その依存先を、更新項目ごとにADD／REVISE／WITHDRAWで検証する。一問一焦点は発行条件であり、別箇所の明示訂正を捨てる条件ではない。非対象の主体・出来事・対象・関係・時点・unknownは保持する。意味checkpointを本文前に確定し、本文失敗で確定した撤回を戻さない。回答記録時刻と回答が指す時点を分離する。Analysisへこの更新規則を適用しない。

### 15.5 Failure knowledgeとcurrent Cycle contractの分離

provider／resource mismatch、crash、invalid payloadはprovider-required routeで`UNAVAILABLE`、fallback 0、automatic retry 0。OOVはliteral source spanとしてだけ保持し、relation／lemma／normalization／meaningを推測しない。raw input／output、question、parser output、surface／lemma／range、private identityはpublic禁止。

一方、251-owner、Cycle001のfresh current denominator／acceptance、current100評価条件はCMEE implementation prerequisiteではないが、本設計からhistorical-only、unnecessaryまたはretiredとは決めない。本設計はそれらを変更・緩和・退役せず、Cycle適用時はfresh Cycle001 current ownerに従う。

## 2026-09-11 Q3 — 有料履歴・逐次質問・解釈フレーム

Emlisは「今回の入力を読んだ観測→重要な一点の任意質問→本人回答で観測を深める」体験を担当する。回答・続行・フレーム操作は元入力に所属し、国家の入力件数・課金event・通知・Astor queueを増やさない。原入力の保存と既存fanoutは`emotion_submit_service`、履歴の閲覧期限は既存`publish_governance`が所有する。Piece／Analysisの入力許可、TodayQuestionの回答schema、旧I5 public wireを拡張しない。共有CMEE→既存Human Reception作者→Sentence Surface→独立逆検証の順を継承し、外部生成AIや別本文rendererは追加しない。

| 対象 | 現行Q3の動作 |
|---|---|
| Free | 今回の原入力＋同thread回答のみ、最大1問。履歴とframeなし。 |
| Plus | 最大1問、所有者・状態・365日の条件を満たす直近最大3記録から必要な履歴。 |
| Premium | 最大3問、3650日の条件を満たす直近最大6記録と修正可能frame。元入力自体の閲覧は既存Premium無期限条件のまま。 |
| 質問発行 | 回答後本文を先に保存し、次候補があればAWAITING_CONTINUE。本人のcontinueで初めて次問を保存・発行する。4問目なし。 |
| プラン変更 | 開始時上限と現在上限の小さい方。upgradeで開始枠を増やさず、downgrade後も既発行問への回答を受けるが次問は現在枠に従う。 |
| 履歴失効 | 編集・削除・回答更新・期限・権限・feedback versionの変化を保存時に照合。古い現在本文はCONTEXT_CHANGED、旧timelineでは自分のLayer1/2だけを履歴として扱う。 |
| 意味変更なし | 同じ有効意味・同じ許可contextの保存済み本文だけを再使用。旧本文へ新prefixを付け替えず、最終commitでもguardを再照合。 |
| 障害と再送 | ANSWER→意味→本文の独立commit、同じ回答で明示retry。旧操作receiptと現在stateを分ける。CAS後の再読取りと失敗返却も現在contextを照合。 |

Q1 request・prefixは既存版を保持し、Q3のsource集合と寄与数だけをversioned extensionで扱う。履歴をSUPPLEMENTAL_USERへ混ぜず、original+今回の回答をresolveするkernelと、owned historyをresolveする経路を区別する。Layer1/2の独立検証が通った後に任意Layer3を検証し、履歴行失敗で成立したLayer1/2を消さない。


## 2026-09-11 Q4 — 実行modeと既存作者

ExecutionModeへEMLIS_APPLICATIONを追加する。保存serviceが認証・mode・sourceを検証してEmlis thread付きrequestだけを渡し、public single requestではREJECTEDとする。旧OFFLINE_CANDIDATEの純粋生成は維持する。EngineOutcomeのbody-free表示も実modeを保持し、内部でofflineを装わない。Q2/Q3保存profileと意味checkpointのsource identityを維持し、旧保存版を同じsourceから読める。Human Reception → Sentence Surface → independent inverseの所有者は同一。作者を二重実行するfallbackを置かない。

<a id="cmee-p1"></a>

## 2026-10-23 — P1：モデル選定前の内部材料・未採用候補

Mashの「学習済みAI選定前の、CMEE内部準備を進めろ」によるP1。新しい生成Engineやproviderを作らず、既存package内の`preparation.py`と`preparation_sources.py`に純粋なoffline関数を置いた。Engine、service、保存ownerからのimport／接続はない。sourceを扱えることと、現有限方式で意味が成立することを分ける。

| 内部入口 | 再利用・保持するもの | 今回の境界 |
|---|---|---|
| `prepare_emlis(GenerationRequest)` | `admit_emlis_thread`の原入力・独立回答・実question control、owner解決済み履歴の原入力／回答、frame feedback | 意味plan／本文を生成しない。履歴の所有・期限は既存loader責務。原入力と歴史を結合せず、意味が現parserで成立することを材料条件にしない |
| 同入口の`supplemental_probe` | 固定E02-Bの補足ID・親・原文 | `SUPPLEMENTAL_PROBE`、実thread回答ではない。元C0のpendingなし／更新N/Aを維持、question IDを発明しない。probeの残数0と実controlの残数を別fieldで保持 |
| `prepare_piece(PieceSourceSnapshot)` | 元7fieldのcanonical JSON・ID・版・owner一致、memo→空行→memo_actionのview | `_saved_field_projection`は`_sentences`も呼ぶため、そのまま使わずsource照合だけを分離。引用・不完全文等の有限意味可否をP1の前提にしない。既存本体は不変。originalのnormal／pre-questionだけ |
| `prepare_analysis(AnalysisObservedMapRequest)` | `freeze_analysis_sources`、所有／版／親／半開期間、INCLUDED/EXCLUDED member、根拠 | 既存複数補足拒否を維持。比較requestはP1未対応として明示拒否。期間外本文はsourceへ流さない |
| `receive_candidate` | 同一requestへのraw候補・終了理由・実提供metadata、候補JSONと根拠位置 | 通信0。全結果NOT_ADOPTED。位置整合は意味・自然さ・Safety・商品合格を証明しない |

材料はcanonical JSON文字列へ凍結し内容hashのrequest IDへ束縛する。`payload()`は独立copy。元7fieldのnull・選択・時刻を保持し、text fieldは分離、生成文を本人sourceにしない。元sourceのEvidenceRefは保持。Pieceは意味前にnative envelopeが無いためenvelope IDを捏造せず、保存JSON commitmentとfield座標を保持する。Analysis補足のnative memo座標と投影上のanswer_text_privateを明示する。

今回の固定stubは通信形の標本であり、意味の主張・手本・学習成果ではない。モデル名・revision・usage・時間は未提供ならnull。実際のtimeoutを待つ試験ではなく、timeoutを表す固定応答の分類試験。4場面20往復と境界testの実結果は[既存試験記録](../../../observation_learning/trials/2026-10-23-current-four/README.md#p1)。

### P2へ残す採用責任の対応案（設計案、未実装・guard変更なし）

| 未採用候補に必要な情報 | 対応する既存型／owner | P1後の具体的未完了 |
|---|---|---|
| source ID・版・役割・field・根拠range | `SourceEnvelope`／`EvidenceRef`、core別source adapter | 位置一致に加え、候補の各claim／argumentがどの根拠を使うかを対応付ける。metadata・生成文を本人発言へしない |
| 主体・時点・肯否・関係・不明・不一致 | Emlis `GroundedMeaningGraph`／`EmlisInterpretationCandidate`のargument_bindings・relation_basis・epistemic_state・required_qualifiers | 現在の有限enum／operatorに写せる部分と表せない部分を、最初の実候補で確定する。存在しない対応を自動補完しない |
| 回答で追加・訂正・撤回する対象 | `emlis_answer_update`／`AnswerMeaningUpdateV1`／`EmlisMeaningCheckpointV1` | 実pendingへ束縛し、未変更claim・時点を保持。更新と本文生成・保存を分ける。probeでは代替しない |
| Pieceの意味・本人の声・条件・否定 | `PieceSourceMeaning`→既存plan／artifactと意味保持検査 | 原文と新本文の意味保持責任を具体化。既存selected-feeling／完全replayの有限制約と、生成候補の読みを区別する |
| Analysisのnode／edge・unknown・conflict | `ObservedGraph`のnodes/edges/unknown_gaps/source_updates/conflicts/annotations | nodeだけでなく関係の根拠を戻す。期間外・他者意図・性格を補わない。観測mapとIFを分離 |

候補の扱い案は、source／requestの不一致なら拒否、core未対応なら未対応、根拠不足／複数の読み／訂正対象不明なら保留、形式と位置が揃ってもcore側の採用責任が未成立なら未採用とする。**現parserと不一致というだけで候補の意味を誤りと断定せず、保留して対応差を残す。モデルの自己採点で採用しない。**

変更が必要な実ownerは、Emlis `emlis_stage1_response._validate_canonical_semantic_inputs`（source再凍結と現plan再導出一致を分ける箇所）、`validate_interpretation_candidate_pool`（現poolの完全一致）、`emlis_v1a.validate_positive_realization_trace`（plan／本文の整合）である。Piece source→meaning→planと内容検査、Analysis freeze→compile_observed_graph→realizerも同様。source identity／親／owner／期間の検査は維持対象で、有限意味への一致をどう置換するかは別の具体案が必要。今回検査を削除・緩和していない。P1で語彙・意味の新admissionを承認済みにしない。

次作業はP2の各claim／argumentと既存型・検査の具体的差分表。実モデル選定・認証を待たず、保存済み候補／固定例から設計できる。実admissionの変更は、その具体差分に対する既存承認範囲を確認してから扱う。本番、DB、公開DTO、RN、課金、モデル接続のeffectはP1に含めない。

<a id="cmee-p2"></a>

## 2026-10-23 — P2：候補・既存意味型・検査の具体対応

**P2の設計対応は完了、実admissionは未実装。** Mashの継続指示により、P1の未採用受口から既存三中核へ写すためのfield対応、保持する検査、再設計が必要な一致条件を具体化した。source原本はCocolon PR30 `141973b4eb35428b50e09cb5c74e9a0f7e2aa208`／API PR3 `b7eb534d44658549896baf449e7c319d49d14396`。今回API code/test/guard/schema、実モデル、DB、RN、本番の変更0。

| 設計owner | P2で具体化したもの | 実装へ残る差分 |
|---|---|---|
| [共通schema05](05_json_schema_and_versioning.md#cmee-p2-schema) | claim／引数、主体の明示／省略、否定scope、modality、source時刻とabout_time、程度／報告／条件のqualifier、関係・unknown origin・conflict・updateの最小案 | schemaの格納だけでは採用しない。既存profileとの版分岐とcoreごとの実admissionが必要 |
| [Emlis 02](02_emlis_v1a_detailed_design.md#cmee-p2-emlis) | nucleus.semantic_frame→graph→component／qualifier→候補／問い／更新／本文／保存のfield対応 | MeaningNodeのvalueだけでは主体・時点・肯否を伝えられない。既知の3guard以外にthread plan・question再導出一致も対象 |
| [Piece 03](03_piece_v1c_detailed_design.md#cmee-p2-piece) | PieceSourceMeaningと有限評価／scope／選択感情、plan／artifactと全意味保持 | 原文slice replayと全meaning再導出、有限編集だけの検査は一般モデル文の意味同等性を保証しない |
| [Analysis 04](04_analysis_v1d_v1e_detailed_design.md#cmee-p2-analysis) | ObservedProposition／node／edge／unknown／conflict／annotationからsafe表示・保存まで | UnknownGapの根拠／対象の不足、wish限定annotation、safe label再導出とsaved validatorまで対応が必要 |

### 現検査の責任をどう分けるか

1. 原文・field・scalar／UTF-8・版・親・owner・期間・既質問／上限・保存identityは維持する。同一sourceに位置があることと、その意味解釈が妥当であることを混ぜない。
2. 現finite parserでplan/pool/graph/問い/propositionを再導出し完全一致する検査は、旧profileの保証として残す。一般候補を扱う新profileでは、意味の起点を採用済みの版付きsnapshotにする具体的変更案が必要。検査を削ってrawモデル本文を通す案ではない。
3. snapshotからplan・意味被覆・関係端点・qualifier・本文／safe graph・保存版が同じ意味を消費するよう対応させる。新候補が現enum／型／作者に写らなければ、自由strやattribute codeに偽装せず未対応として残す。
4. 原文反復・自然さ・意味の読みは、source位置と型だけでは保証できない。新profileの保証範囲と、モデルの読解を暫定採用する商品上の変更点を明示する。モデル自身の採点で正しさを保証しない。

### 4場面の設計例から得た具体的な差

E02-0は説明を任せた行動と最後まで聞いた行動を分け、嬉しさの対象不明と併存させる。E02-Bは否定された理由への言及を実事実にせず、否定を理由関係へ一度だけ付ける。「私」は思いつかなかった従属節の主体であって、主節の主体を機械確定する証拠ではない。元行動と元不明は落とさず、probeで解決済み／REVISE済みにしない。

P01は「自分の仕事が」の主語を「自分」へ縮めず、報告・嬉しさ・帰りの遅れ・後悔の否定scope・次回の条件を保持。A02は本人の希望から実現／未実現を決めず、購入できた結果と軽い面倒さの「けど」を残す。「聞いていない」は記述時点までの非行動で、記録上の使いやすさ未観測は本人が絶対知らないというclaimではない。

[全設計例と実inspection](../../../observation_learning/trials/2026-10-23-current-four/README.md#p2)は、手作業例28claim／60quoteをP1受口へ4回通し、26native型のfieldと9関数の実在を照合したもの。意味採用、native graph構築、本文生成、モデル推論、P2 schemaのruntime検証は0。引用一致とnative対応を混同しない。

### 次の具体的な変更判断

次は、上記対応に沿った限定実admissionの変更案を一つにまとめる。対象は、(a) 新しいprivate semantic profileと採用済み意味snapshotの版・内容identity、(b) 旧profileを維持した新profileのplan/pool/thread/question/traceの起点分岐、(c) 旧保存互換・中断再開とprivate保存field、(d) coreの未対応を保留して意味を捨てない失敗結果、である。新profileが任意の日本語意味・本文を一般的に保証できるとはしない。

これは既存の意味採用・再導出契約を変える具体的な範囲であり、P2設計の指示だけで製品guardを変更しない。最新weeklyのP2後の実装判断へ戻し、同じ意味の確認を繰り返し求める承認連鎖にはしない。P3の実Engine／回答更新、P4/P5、M1/M2は別の未実施工程として保持する。STRUCTURE_MAP_DELTA_NONE（実経路・型変更0）、primary=BLOCKER_NARROWED、product_credit=0。

<a id="cmee-p3-bounded-proposal"></a>

## 2026-10-23 — P2後の限定実装案：新規Emlis threadの意味snapshot

**提案時：PROPOSED_ONLY / IMPLEMENTATION_APPROVAL_PENDING。現在はMash承認済み・実装結果を後続[cmee-p3-implemented](#cmee-p3-implemented)へ記録。** 今回の「学習済みAI選定前のCMEE内部準備を進めろ」に基づく、P2後の具体化である。今回実施したのは実sourceの読取・契約差分の特定と本案の保存。製品code・test・保存形式を変更した記録ではない。確認原本はCocolon `db33718a47cbd0b09f3bff066ad865d67180d0d9`、API `b7eb534d44658549896baf449e7c319d49d14396`。

### 1. 推奨する一つの範囲と、判断が必要な点

最初の実装は、**明示的なoffline呼出しで開始する新規Emlis threadだけ**に、候補の意味を暫定採用するprofileとimmutable snapshotを導入する。実モデルを接続せず、P1の固定候補・手作業候補を内部portへ注入する。既存Engineと既存thread serviceを使い、初回→実pendingへの回答→意味確定→本文→隔離保存／中断再開まで一つの変更単位にする。snapshotだけの別prototypeを追加して工程を増やさない。

意味の起点を「現finite parserが再導出した読み」から「sourceを照合して暫定採用した版付きの読み」へ変える点が、今回判断を求める契約差分である。引用一致・型一致は、モデルが日本語を正しく読んだという保証にならない。この制限を隠さず、本人が訂正可能な解釈として扱い、既存のsource保護・根拠のない推論の禁止・本文検査・商品受入条件は維持する。Rule18 §11.3 LEVEL_3対象。P1/P2の実施承認だけを実admission変更の承認へ読み替えない。

既存thread／旧pendingの移行、通常applicationへの有効化、公開API／DTO、RN、実DB・Render、実モデル／課金、Piece／Analysisの新admissionは本案の外。旧threadは旧意味profileで継続する。新profileのデフォルト有効化やclient指定は加えず、既存の内部依存注入だけで隔離検証する。

### 2. 実sourceで確認した差分

以下のprefixはAPI `ai/services/ai_inference/`。`.../`は`cocolon_meaning_experience_engine/`。

| 実owner | 現在の拘束 | 限定案で必要な変更 |
|---|---|---|
| `.../emlis_thread_contracts.py::EmlisMeaningCheckpointV1` | source prefix・base意味・更新・参照を保持するが、候補由来の意味内容全体は保持しない | 新版checkpointとsnapshotを結合。旧V1のfieldと再構築を維持 |
| `.../emlis_answer_update.py::prepare_emlis_meaning` | 原source／全回答から現finite planを再構築し、既知legacy版を照合 | 新profileだけ保存snapshotから有効意味を構築。旧profileは現行経路 |
| `.../emlis_stage1_response.py::_validate_canonical_semantic_inputs`／`validate_interpretation_candidate_pool` | sourceの再凍結に加え、現plan／poolの再導出完全一致 | sourceの再凍結と意味の正規化を分離。新profileのplan／poolは同一snapshotから再導出し完全一致を確認 |
| `.../emlis_thread_projection.py::_project_thread_meaning_aggregate` | `build_updated_grounded_plan`一致と原source由来の保持資格を確認 | plan／graph／pool／component／selectedに同じsnapshot refを通す。旧retained資格を新意味へ自動付与しない |
| `.../emlis_question.py::question_candidate`／`validate_question_binding` | 原plan・原文recognizerからcanonicalな問いを再導出 | 新profileはsnapshot上の未確定対象から再導出し、実pending・既質問・予算へ結合。候補が書いた問い文を直接発行しない |
| `.../emlis_v1a.py::validate_positive_realization_trace`／`.../emlis_thread_surface.py::realize_emlis_thread_body` | planから既存作者、surface、inverse、gateを通す | 同じ採用意味・選択・関係端点・qualifierの消費を確認。作者が表現できない意味はUNSUPPORTED。trace一致だけで自然な本文の合格にしない |
| `emlis_thread_service.py::_process` | MEANING_UPDATEを本文前に保存。単一SEMANTIC_SCHEMA判定と再導出checkpointのJSON完全一致 | 新旧意味版のdispatch、保存snapshotの復元、同一checkpointとの完全一致。後段effective_plan_ref算出も同じ起点へ揃える |
| `emlis_thread_service.py::_context_current`／`_generation_current`／`_public_frames`とQ3 SQL | `runtime_profile == q3.plan.sequential.v1`等で有料context・CASを判定 | runtime_profileは変更しない。semantic_profileを別軸にして既存tier/history/frame条件を維持 |

単に3つのguardを緩める案では、thread projection・問い・service側の再導出が旧意味を使うため成立しない。P1の`CandidateReceipt.adoption_state=NOT_ADOPTED`も維持し、P1受口自体を採用器へ変更しない。

### 3. 初版の意味採用範囲

1. 正規sourceのowner／親／版／role／field／scalar・UTF-8位置を再照合する。候補IDはnative IDにせず、対応表をCMEEが作る。候補の狭いquoteは既存sourceに結びついたprivate subrangeとして保持し、存在しないnative spanを作らない。
2. 既存nucleus／frame／interpretation operator／argument role／component／作者へ、主体・対象・時点・肯否・必要qualifierを**全て**写せる意味だけを対象にする。native語彙を自由str・attribute codeで拡大しない。任意の日本語を全件採用できる契約にはしない。
3. 原文literalのanchorと、モデル候補が与えた読みを区別する。読みには既存の暫定解釈責務を適用し、quoteがあるだけでモデル由来の主語解決・原因・相手意図等をSOURCE_EXPLICITの事実へ昇格しない。既存型／後段でこの区別を保持できなければUNSUPPORTEDとする。
4. 関係自体の否定、報告／条件の埋込み、未対応のunknown.originやconflictなど、必要意味がどこか一段で失われる候補は全体をHOLD／UNSUPPORTEDとする。必要な一節だけ消して部分成功にせず、候補全文・理由・対象をprivateに保持する。既存PARTIALを新profileの意味落ちの許可に使わない。
5. E02-0は嬉しさと対象不明、説明を任せた行動と最後まで聞いた行動を分離する。E02-Bの否定理由は、現型へ押し込まず未対応のまま残してよい。E02-Bはprobeであり、実pendingへの回答成功へ加算しない。P01-N／A02-P1もP4/P5前に採用しない。

**採用できるか、本文へ出せるか、商品として良いかは別判定。** 新profileでもSafety別owner、LIMITED／UNAVAILABLE等の既存商品結果を維持する。候補自身のconfidence、別LLM採点、常時のMash承認を採用の隠れた条件にしない。

#### 初版で必ず通すnative対応と実pending系列

初版の採用対象は、既存のevent／reactionとclaim単位の肯否・過去／現在、明示contrast、実pendingに束縛したABOUT_TARGET、同範囲の回答更新に絞る。他の型へ自動拡大しない。最小成功参照は既存`ai/tests/test_cmee_emlis_q1_thread.py`の`ORIGINAL='褒められたのに、嬉しくなかった。'`と`initial/answered/prepared_request`。これは旧経路の既存期待から選んだ到達目標で、新profileの実行成功記録ではない。E02-0だけを成功条件にせず、**全件UNSUPPORTEDのまま完了にしない**。

| claim／関係 | native nucleus／frame | 暫定interpretationへの対応 |
|---|---|---|
| 「褒められた」 | event／predicate=event、neutral、fact、past | DIRECT_STATE／PRESENT_STATE、PRIMARY |
| 「嬉しくなかった」 | reaction／feeling、negative、feeling、past | DIRECT_STATE／PRESENT_STATE、PRIMARY＋EXPERIENCER |
| 「のに」の二対象 | contrast、event→reaction、両端とmarker根拠を分離 | TENSION／SYNTHESIZE_RELATION／TENSION_WITH、LEFT(event)＋RIGHT(reaction) |
| 実pendingへのADD「今は嬉しい。」 | positive reaction、present、thread_time:answer_time。元negative／pastとcontrastを保持 | DIRECT_STATE／PRESENT_STATE、PRIMARY＋EXPERIENCER。焦点との結合はABOUT_TARGETで、原因や変化を補わない |
| 実pendingへのREVISE「あの時も本当は嬉しかった。書き方を間違えた。」 | positive reaction、past、thread_time:original_occasion。旧negativeと依存contrastを失効、event保持 | 同direct型と対象束縛。現在の感情へ移さない |
| memo_action「帰宅しても苦しかった。」を持つ実pendingへの回答 `その時は寂しかった。「帰宅しても苦しかった」は誤りです。` | 原時点のnegative reactionをADD、完全引用で一意に特定したmemo_action核と依存だけWITHDRAW。原event／reaction／contrast保持 | 残るdirect型を維持。撤回用の新nodeを作らない。単独撤回での本文成功を保証しない |

元fixtureの正確な引用は`その時は寂しかった。「帰宅しても苦しかった」は誤りです。`。opaqueなnative IDは候補から受け取らずCMEEが導出する。graphのSOURCE_EXPLICITはraw literal anchorにだけ使い、読みは`EmlisInterpretationCandidate.epistemic_state=PROVISIONAL_INTERPRETATION`へ置く。`MeaningNode.epistemic_state`へ存在しない暫定enumを入れない。省略主体をもつ上記参照でのactor=current_userは本人文脈への暫定解釈として保持し、sourceのsubject.binding=OMITTEDをEXPLICITへ書換えない。任意の省略主語、明示第三者、引用へこの対応を一般化しない。構造化された元感情選択・カテゴリ・別fieldも材料から落とさない。

静的根拠は`emlis_ai_grounded_observation_plan.py::_received_event_reaction_text_projections`、共有`contracts.py::_foreground_direct_shape/_foreground_direct_argument_bindings/project_stage1_relation_shape`、`emlis_answer_update.py::_answer_nucleus/_prepare_answer/_active_plan`と上記testの既存期待。共有contracts.pyと元作者は今回の変更対象にせず、現enumへの対応先として読む。候補の意味対応を旧parserの正解一致で代替せず、実装後の新profileで同一の原文・意味軸・本文・問い・保存再開へ到達することを必須にする。

### 4. 問い・回答更新と版の固定

新profileは新規thread開始時だけ選び、そのthread中は固定する。入口は、FRESH_CANDIDATE（当該prefixの未採用receipt必須・採用済みsnapshotの持込み禁止）、RESUME_ADOPTED（保存snapshot必須・候補再採用禁止）、READ_NONADOPTED（保存された非採用評価を返すだけ）の三つを区別する。初回にsnapshotがないことは正常であり、再開で保存snapshotがないこととは異なる。profile欠落をlegacyと解決してよいのは、既存旧thread／旧checkpointの形が一致した場合だけ。未知profile・再開snapshot欠落／破損・core違いは拒否し、旧finite経路へ自動fallbackしない。

新profileの実pendingは、発行時snapshot・target・根拠・round・既質問と既存上限へ結ぶ。Free／Plusはthread全体最大1、Premiumは本人continueで逐次最大3、skip／END／期限と既存tier contextを維持する。未解決候補の存在だけで自動質問を発行しない。

回答は本人の実ANSWER envelopeとprior snapshotのactive claimに結びつけ、ADD／REVISE／WITHDRAW／無更新／対象不明を分ける。未変更claim・独立不明・元の経験と各時点を保持する。失効したclaimと依存関係を次snapshotへ明示し、本文失敗でも確定済み訂正・撤回を復活させない。profile内の表現可能範囲を超える回答は、新しい意味を黙って部分採用せず保留する。旧snapshotは履歴として保持するが、新ANSWER後のprefixに対する現在の読み・成功本文へ付け替えない。保留中のprefixを下流へ成功handoffしない。

### 5. 保存・再開とcross-core

同一prefixで一度ADOPTした意味はimmutableとする。別の読みで同prefix／同schemaのMEANING_UPDATEを追加・上書きせず、実ANSWERで新prefixになった時だけ次のsnapshotを作る。

非採用のHOLD／UNSUPPORTED／REJECTにはMEANING_UPDATEも採用snapshotも作らない。既存OPERATION eventのprivate payloadへ、attempted_source_prefix_ref・prior_active_snapshot_ref・decision・候補全文・理由を保存し、data.semantic_evaluation_refから参照する。priorは旧prefixの履歴でありcurrent採用の参照ではない。初回は本文未提供、回答後は既存ANSWER_UNREFLECTED相当で未反映とする。意味確定済みと誤認させるevaluated_prefix_ref更新をしない。保存した非採用評価をREAD_NONADOPTEDで再読でき、再開だけを理由に候補を再採用しない。

型・field案の唯一ownerは[設計05の限定案](05_json_schema_and_versioning.md#cmee-p3-snapshot-schema)。既存SQL `supabase/migrations/20260911020509_emlis_input_threads_q2.sql`のevents.payloadはjsonbで、MEANING_UPDATEのuniqueはthread／source_prefix_ref／semantic_schema_version。`supabase/migrations/20260911041749_emlis_q3_plan_rounds.sql`もpayloadを保存するため、**source上は物理column追加やmigrationを要しない案**にできる。ただし、Pythonの保存・再開contractは変更対象。実DBへ適用・保存できると検証した意味ではない。

| 中断／再読 | 限定案の動作 |
|---|---|
| 意味確定前 | 本人source・未採用候補／保留理由から再開。保存前候補を確定済み扱いしない。候補が失われた時は未完了を返し、実モデルを勝手に再呼出ししない |
| 意味確定後・本文前 | 保存済みsnapshotを復元し本文だけ再開。同じprefixのMEANING_UPDATEを二重追加しない。再推論・再採用・撤回復活なし |
| 本文保存済み | 新旧とも保存済み本文・DTOを再読。profile／model／作者版の変更を再生成理由にしない |
| 旧未完成checkpoint | 既存legacy source／意味／問いの再導出と同じID照合を維持。復元不能を新候補で置換しない |

Pieceの`piece_v2_source_adapter.py::_original_observation_handoff`は、旧Emlis意味schema・INITIAL・checkpoint／source／成功attemptを検査する。新profileを通常applicationへ有効化する将来工程では影響するownerであり、今回offline成功をPiece eligibility成立へ広げない。今回は同関数を変更せず、全schema許可へ緩めない。

Pieceのsource→meaning再導出／本文の有限命題検査、Analysisのgraph compiler／safe label再導出／保存allowlistはP4/P5まで維持する。新snapshotを各旧保存型へ流さず、refined・複数補足・IF／Saved等の既存未対応も残す。

### 6. 承認後の対象・検証・完了と打切り

APIの製品変更候補は共有package内の`emlis_thread_contracts.py`、新規`emlis_semantic_admission.py`、`engine.py`、`emlis_thread_source.py`、`emlis_answer_update.py`、`emlis_stage1_response.py`、`emlis_thread_projection.py`、`emlis_question.py`、`emlis_v1a.py`、`emlis_thread_surface.py`、`emlis_thread_engine.py`と既存`emlis_thread_service.py`に限定する。新moduleは同packageのadmission adapter一つで、別Engine／管理systemではない。既存SourceEnvelope・P1二module・public factory・SQL／migration・Piece/Analysis codeは変更しない。実装時に必要なtestは同packageの新profile用testと既存Q1/Q2/Q3・service検査へ限定し、既存の固定期待・historical fixtureを変更しない。正本02/05/06・全体00/01/01A・Emlis/CMEE map・weekly・既存API handoffの関連差分を同単位で同期する。

最小検証は、(a) source/owner/親/版/quote/Unicode座標と別core拒否、(b) native対応の欠落・未対応・保留と旧prefixの非昇格、(c) 新profileの同一snapshotからplan/pool/問い/traceを再導出し、改変snapshot・差替え参照を拒否、(d) 初回と**実発行pending**へのADD/REVISE/WITHDRAW・無更新・対象不明、未変更意味／時点保持、(e) Free/Plus/Premiumの既存予算・履歴・frame・continue/skip/END、(f) 意味保存前／後中断・非採用OPERATIONの再読・同prefix再採用禁止・volatile非算入・旧完成DTOの非再生成・旧未完成復元と同一DTO再読、(g) 旧経路の必要回帰、である。固定4場面のHOLD／UNSUPPORTEDを成功本文へ数えず、全suite成功・実Auth・本人実機を主張しない。

**完了は**、表現可能な新profileの初回／実回答について、採用意味と実本文・問い・保存再開を同じidentityで確認し、未対応4場面の理由を保全し、旧形式を維持した限定内部実装。本文は主担当が全件読み、復唱・意味落ち・時点誤読・汎用受け取りの残りを記録する。内部実装成立を商品品質改善やProduct Read PASSに換算しない。

**打切りは**、別作者・語彙一般化・public DTO・migration・稼働有効化が必要と判明した時、または新profileを通すため既存Safety／意味保持／本文検査を弱める必要が生じた時。scopeを自動拡大せず、具体的に足りない意味とownerを既存記録へ残す。同じ成果へ戻るための新checkerや承認系列を増やさない。

想定作業は主担当の内部実装・必要検証を1変更単位で進め、途中保存するもの。所要は実装後の作者適合性・保存検査次第で、現時点で完了時刻は保証しない。追加課金0、Mashの端末操作0、実モデル待ち0。本案の承認で同範囲の内部技術修正・検証・GitHub反映まで進め、単なる内部版数変更ごとに同じ承認を求めない。実モデル選定・接続、P4/P5、通常applicationへの有効化は別の残件である。

今回の文書具体化は`STRUCTURE_MAP_DELTA_NONE`、primary=`BLOCKER_NARROWED`、product_credit=0。承認・実装・新profileの意味採用・新検査実行はいずれも未実施、automatic_progression=false。

<a id="cmee-p3-implemented"></a>
## 2026-10-23 — 承認済み限定Emlis snapshot内部実装

Mashの「この限定範囲の内部実装へ進めてよろしいでしょうか。→進めていいよ」を受領し、上記案を明示offline・新規Emlisだけへ実装した。上記PROPOSED_ONLYは案作成時の履歴であり、同範囲の再承認待ちではない。API開始原本b7eb534／Cocolon開始原本fcdfe2。実装ownerは新`emlis_semantic_admission.py`と既存`engine.py`／`emlis_answer_update.py`／`emlis_thread_engine.py`／`emlis_thread_service.py`だけ。既存作者・共有型・single-inputの三guardを変更せず、既存thread projectionが受け取るplanの起点を新profileだけsnapshotへ切替えた。

内部keyword-only `semantic_input`でFRESH_CANDIDATEとRESUME_ADOPTEDを明示する。P1 receiptはNOT_ADOPTEDのまま、別ownerが暫定採用を判断。版・source commitment・prefix・実control・canonical packet・native対応表・prior refを凍結し、plan/pool/graph/問い/traceを同じ起点から作る。使用しないquoteで不足節を隠す候補、主体・時制・肯否不一致、重複source範囲claimは採用しない。未対応unknown/conflict/引数/qualifier/埋込みを黙って落とさない。元の選択感情などの全source材料は保持するが、それだけで自由意味理解を主張しない。

実pendingに束縛したADD、原時点への明示REVISE、完全引用WITHDRAW、わからないの無更新を既存更新型へ結合。未変更核・元contrastと過去回答のABOUT関係を保持し、撤回核を復活させない。既存のFree/Plus一問・Premium本人continue最大三問、runtime_profileのQ2/Q3等値判定は維持。新profileを履歴として別threadへ渡す機能は未対応で拒否し、旧履歴の扱いは維持する。

serviceは候補取得STARTEDとRECEIVEDを既存private OPERATIONへ別保存し、意味checkpointを本文前に保存。receipt保存後の再開は同receipt、意味保存後は同snapshot/checkpointを使用し、候補の再取得・同prefix再採用をしない。取得開始後にreceiptが残らなかった場合、明示retryはHOLDを保存してCOMPLETEDへ閉じる。非採用はMEANING_UPDATEを作らず、新prefixの評価済み参照を進めず、旧本文をcurrentへ付替えない。無更新の早期return前にも保存snapshotを再検証する。

通常serviceは新profileの保存再読だけ可能でcan_write=false。answer/action/frame mutation・commit/processには同じ明示offline設定を必須とし、通常application factory／API／DTO fieldは変更しない。新旧threadの移行も行わない。実型は[05の実装追記](05_json_schema_and_versioning.md#cmee-p3-actual-schema)、検証・実本文・失敗は[trial](../../../observation_learning/trials/2026-10-23-current-four/README.md#p3)。限定TECHNICAL_CREDIT、STRUCTURE_MAP_DELTA_PRESENT、product_credit=0、automatic_progression=false。

<a id="cmee-adapter-v2-correction"></a>
## 2026-10-23 — 既承認adapterの時点範囲修復

新adapterが時点込み全claimをlexical:preserve_source_predicateへ渡し、既存作者のthread_time表示と重なっていた。同じ作者の旧parser側は時点を分離しており、「既存作者だけの残件」という説明を訂正する。既承認の保持意味/作者を変えない整合修復としてFRESHのadapter_versionを2へ進めた。RESUMEは保存1/2を全original/prior/current plan・問い・再開で明示dispatchする。profile/schema/admission版は不変。

2では回答の裸時点語/「は」だけをlexical範囲から分離し、snapshot全claim/根拠/時点/程度/本当は/否定は保持。「も」は添加/継続を担うので削らず旧範囲を維持し、反復残件として残す。原文や出力の後処理置換ではない。e5ca453から修正前に実採取したv1三系列はcheckpoint/graph/本文/問い/停止を含む全outcomeが一致し、v1実pending→新回答prefixだけv2の混在も成立。対象35件成功、全suite/商品合格ではない。STRUCTURE_MAP_DELTA_NONE、限定TECHNICAL_CREDIT。

<a id="cmee-targeted-unknown-action-proposal"></a>
## 次の限定案 — E02-0の本人明示不明と二行動

**提案時はPROPOSED_ONLY / IMPLEMENTATION_APPROVAL_PENDING。Mashは追加範囲を承認済み。実装・検証結果は後続節を参照。** 提案作成時点ではこの追加採用は実装0。既承認のevent/reaction初版を自動拡大しない。次の一単位は明示offlineの新規Emlisだけで、本人不明と二行動を初回本文/保存再開まで保持すること。既存の実pendingが成立する混在系列では、新要素を変更しない既受理回答後にも保持する。E02-0自体に架空の問い/回答を作らない。

| 正確に残す意味 | 現sourceの不足と最小変更 |
|---|---|
| 過去の喜びは成立し、どの部分かは記述時点でも曖昧 | GroundedUnknownBoundary/UNKNOWN nodeのdimensionだけではstatementと対象joyを区別できない。旧不明資格は同一根拠のSELF「わからない」statement核を指す。新profileのPERSON_STATED/JOY_ASPECT bindingでstatement_ref/target_joy_ref/記述presentと対象pastを別保持し、projection→basis/qualifier→作者/trace/独立readerへ渡す。喜び自体の否定/原因不明/後輩への信頼へ変えない |
| 後輩に説明を任せて、最後まで聞いた二行動 | action/fact/past/PRESENT_ACTUAL_OUTPUTは存在するが、現binderはowner/kind/grounding/evidenceだけで検索するため同span二actionが一意にならない。実spanと正規subrange、claim→nucleus→graph nodeの明示対応を新profileへ追加。旧曖昧検索を緩めず架空spanを作らない |
| 打合せで/後輩に/説明を/最後まで、OMITTED主体 | ArgumentRoleは命題間役割で文内格ではない。原格/owning claim/根拠をtyped case bindingで保持し、受取人/原因等を推測しない。本人source所有と省略主体、暫定SELF読みを区別 |
| te連結、joy→unknownのけど | TE_LINKをACTION_BEFORE_AFTERへ写すとshift/厳密時点を補う。元連結のみを保持し、因果/同時性/信頼/成長/喜びの原因を作らない。既存HRは「任せて」を単独完了節として名詞化できないため、完全連結節のまま既存作者/独立readerで両行動を消費する有限対応が必要 |
| listen終端句点の座標差 | P2 quote14:22はnative memo_action span終端21を一字越える。raw field quoteを保持し、native lexical14:21との対応を型で明示する。除外許可は終端「。」のみ。内部字/否定/markerを削らず他のcross-spanは未対応 |

### 実ownerと責任（API prefix: ai/services/ai_inference/）

- `cocolon_meaning_experience_engine/emlis_semantic_admission.py`：closed ACTION/対象付き不明/格/主体/te/句点対応と全意味被覆、typed binding生成。
- 同`contracts.py`＋`emlis_stage1_response.py`＋`emlis_thread_projection.py`：設計05の新profile専用binding、同span二核の明示対応、unknown statement→joy対象、component/qualifier/traceの消費。旧型へnull fieldを追加して全旧identityを変えない。
- `emlis_ai_grounded_observation_plan.py`：完全連結原文から過去/従属teを確認。単独「任せて」を自由な完了事実へしない。
- `emlis_ai_grounded_sentence_surface.py`＋`emlis_ai_grounded_human_reception.py`：完全二行動と対象付き曖昧さを既存作者内で表現。別作者/末尾の定型補足を作らない。
- `emlis_ai_grounded_observation_gate.py`＋同packageの`emlis_v1a.py`＋`emlis_thread_surface.py`：作者を呼ばず格/主体/時点/肯否/未知対象/両行動/連結を確認。
- 同packageの`engine.py`＋`emlis_answer_update.py`＋`emlis_thread_engine.py`と`emlis_thread_service.py`：明示offline新profileだけdispatch、意味先行保存と原版再開。既存test_cmee_emlis_semantic_snapshot.pyと同family fixtureで検証し、protected旧期待を差替えない。

### 採用・更新・問い・完了・停止

全4claim/unknown対象/二relation/全格を同じsnapshotから消費できる閉じた本人sourceだけ暫定採用する。任意ACTION/一般日本語/第三者意図理解へ広げない。JOY_ASPECT専用の新しい問いはこの案へ含めず、既存必要性/実pending/skip/END/予算を維持。不明の存在だけでASKにしない。

別焦点への既受理ADD/REVISE/WITHDRAWでは、新要素が未変更なら保持する。新unknown/ACTION/格/te自体を変更・解消する回答や依存先を失わせる変更はHOLD/UNSUPPORTEDとし、新prefixへ旧意味/本文を付替えない。この単位で一般的な行動訂正やunknown解消文法まで完成としない。

完了は全意味を残す初回実本文、同版保存再読/中断再開、実際に成立するpending系列での未変更素材保持、旧profile/保存adapter1/2再現、必要逆検査と回帰。本文失敗でも意味先行保存を維持し、欠ける節を消して部分成功へしない。復唱/意味label/集合定型性が明白ならProduct ReadをMashへ戻さない。型/trace/試験数だけで新案を完了にしない。

Rule18 §11.3 LEVEL_3（既説明scope外の意味採用・私有保持契約追加）。モデル選定前に本人明示不明/二行動を落とす現blockerを解消するための一案。複数ownerの実装/本文確認/旧互換/保存再開を一単位、所要は未実測で途中保存を行う。追加課金/Mash端末操作0。新Engine/runner/checker、通常application/公開API/DTO/RN/実DB/Render/実モデル/学習/merge/deployは範囲外。必要意味が一段でも落ちる、旧版再解釈、別仕組み追加やscope増加が必要なら止め、最小差分だけ既存ownerへ残す。


<a id="20261023-cmee-targeted-unknown-action-v2"></a>
## 2026-10-23 — 承認済み本人明示不明・二行動の限定実装

Mashの追加範囲への「進めていいよ」を受領し、本人明示のJOY_ASPECT不明と二行動を、新規・明示offlineの`emlis_candidate_snapshot.v2`へ限定実装した。原E02-0は四claim／unknown statement→joy対象／過去の喜びと記述present／原格4つ／OMITTED主体／te連結とconcessionを、既存作者の実本文・private保存再開まで保持する。E02-0自身は問いなしENDで、架空pendingを作らない。

snapshot schemaは`cocolon.cmee.emlis_semantic_snapshot.v2`、checkpointは`cocolon.cmee.emlis_answer_meaning.v3`、admission/adapter各1。旧profileはFRESH adapter2・保存1/2をそのまま再現する。namespace tupleと全prior edgeの同profileを照合する。native_bindingsは意味hashへ含め、graph IDはhashへ含めない。checkpoint確定後のclaim→nucleus→nodeとnative relation→edgeを明示導出し、同span二actionを別核・別nodeとして保持する。

四typed binding familyは既存PreMeaningの新専用qualifier rowへ渡し、UNKNOWN carrierとjoyの肯否・modality・時点・evidence、原格とTE witnessを独立照合する。native TEはprivate scope-only linkで、ACTION_BEFORE_AFTER／同時性へ代用しない。既存Observation／HR作者と既存独立readerに有限armを追加。各section17件のSnapshotBindingConsumptionV2が、slice／case／unknown／written linkを実visible範囲とgraph対応へ束縛する。本文変異8条件、candidate閉鎖5、canonical再hash改変5、新要素target更新4、越native句点1、unknown carrier改変3、TE witness改変3等を拒否確認した。

実際に成立する別焦点のQ3 pendingからADD／REVISE／WITHDRAWを通し、新四要素のpacket・typed bindings・核対応が未変更であることを確認。Q3実serviceは意味保存後のCancelledError→保存GET→明示retryを通し、候補再取得なし・意味checkpoint重複なし。通常readerの再開は作者を呼ばず保存DTOを返し、can_write=falseになる。未対応更新はprivate評価を残しANSWER_UNREFLECTED／current_observation=nullで旧本文を新prefixへ付替えない。

初回の実Observationは「うれしかった一方で、どこがうれしかったかはまだ曖昧なのですね。」「打合せで後輩に説明を任せて、最後まで聞いたのですね。」。Receptionは「その打合せでの関わり方に、私は心が留まります。うれしかったという気持ちも、どの部分かまだ曖昧なままで受け止めています。」。行動の短い照応は同prefixの実Observationが独立読取に合格した場合だけ束縛し、別の生成本文・保存旧本文から補わない。喜びのどの部分かを保持し、原因不明／喜び自体の不明／信頼・成長へ変えない。

最終対象146 passed／FAIL0／SKIP0、106.30秒、既存警告2。内訳はsnapshot同family70（旧35＋新35）、P1旧22、Q2/Q3 application旧54。34 subtests・反復実行・本文採取を件数へ加算しない。旧adapter1/2の全outcome fixtureは変更0。旧広範囲Q1/Q3の未分類失敗は未解消で、全suite成功とはしない。

原E02の有限文法と既受理event/feelingの併存に閉じる。一般unknown/ACTION、新要素自身の変更・解消・依存削除はHOLD/UNSUPPORTED。旧Q2 cap4では混在更新の5 contributionを提供できず意味保存後BODY_UNAVAILABLEとなる制限を残し、capを緩めない。現在のQ3実serviceでの隔離SQL/RPC保存・中断再開成功と区別する。実モデル／有料推論／重み／学習／本人DB／Render／通常application有効化／公開API・DTO・RN変更／merge／deployは0。限定TECHNICAL_CREDIT、STRUCTURE_MAP_DELTA_PRESENT、product_credit=0／PRODUCT_NOT_CLEAR／正式Product Read0/3／candidate_ready=false／automatic_progression=false。

<a id="cmee-p4-next-unit"></a>

## 2026-10-23 — 次の内部準備単位：Piece意味snapshotの限定案

Emlis新profile2の承認・実装を維持し、旧Q2のcap4を緩めない。次は未着手だったP4を[Piece設計03の具体案](03_piece_v1c_detailed_design.md#cmee-p4-offline-piece-proposal)と[private型案05](05_json_schema_and_versioning.md#cmee-p4-piece-snapshot-proposal)まで具体化した。**PROPOSED_ONLY／実admission未実装・未承認**。モデル選定や認証を待たずに判断できる案で、実モデル接続を含まない。

新規・明示offline・原入力1件のPieceだけで、元7field／P1 request→候補採否→immutable意味snapshot→既存plan／唯一作者／author-free照合→同一private serialize/reloadを実装する案。P01-Nの6claim／2関係と全選択を保持する。全選択を本文一文に対応させる旧契約から、構造化選択は別の本人入力として必ず保持し、本文にない感情・程度・時点・原因は補わない契約への差分を明示した。旧profile／旧保存は維持。通常B8／preview／実保存／fit／export／DB／RNは未変更・案の対象外。

Analysis P5も実sourceを確認した。対象付きunknownの根拠、行動への過去の軽い負荷、safe label、private serialize/reloadが一体の差分となる。[Analysis設計04の調査結果](04_analysis_v1d_v1e_detailed_design.md#cmee-p5-offline-gap)へ残した。P2手作業packetを完成graphとせず、Pieceと一括して実装承認済みにしない。最初の実装判断はP4一単位に絞る。

前回API CI39912451179はAnalysis対象1634成功後、現行共有owner identity fixtureの同期漏れで1失敗。既存producerから承認済み6ownerの差を同期し、既存失敗検査は1 passed／194 deselected、26.43秒。API `302d1223362484b30cf66c9c2c3ca3a72b6cdf2d`はfixture1pathだけ、GitHubの全文・blob・変更集合・PR headを読戻し確認済み。historical IM03・旧全outcome・検査assertion・production codeは変更0。過去CIは失敗のまま、新しい全suite／CI合格を主張しない。新しい広範囲再実行は0。

今回のprimaryはBLOCKER_NARROWED（次P4の具体差分）。identity修復は前回実装の検証整合だけで商品品質creditにしない。STRUCTURE_MAP_DELTA_NONE（既存ownerと現行fixtureの同期、P4/P5の新runtime ownerは未追加）、product_credit=0、PRODUCT_NOT_CLEAR、正式0/3、candidate_ready=false、automatic_progression=false。Codex Work Modeで主担当が統合・反映し、補助担当は読取のみ。確認できないPro／Ultraの正式審査・実モデル・稼働・本人受入れは申告しない。


## 2026-10-23 — 承認済みP4のactual接続

Mash承認により[Piece P4](03_piece_v1c_detailed_design.md#cmee-p4-implemented)を実装。新規明示offline PieceだけでP1→版付き採用snapshot→既存compiler／唯一作者／author-free policy→同一private再読。実型と版は[05 actual](05_json_schema_and_versioning.md#cmee-p4-actual-types)。旧P4未承認の記載は案作成時の履歴で、現状態ではない。P01の6claim／5文／2関係と全選択を保持。出力は原文2段落保持で一般文章生成・商品品質合格ではない。

API4fd8db4の7fileはGitHub全文／blob／変更集合／head確認済み。対象339成功、34 subtestsは加算せず、全suite／CI成功とはしない。通常B8／Analysis／Emlis profileの意味契約・公開API／DB／RN／モデルは不変。新private dataclass10／例外2はPiece専用で共有logical registryは不変。STRUCTURE_MAP_DELTA_PRESENT、限定TECHNICAL_CREDIT、商品0／正式0/3／candidate_ready=false／automatic_progression=false。次の別残件はP5の実型・採用／保存差分、通常接続と商品品質。今回の承認から自動開始しない。

<a id="cmee-p5-next-unit"></a>

## 2026-10-23 — 次の内部準備：Analysis P5の具体案

MashのCMEE内部準備継続指示により、P4完了の現在地から[Analysis P5の一単位](04_analysis_v1d_v1e_detailed_design.md#cmee-p5-offline-analysis-proposal)と[private型・保存案](05_json_schema_and_versioning.md#cmee-p5-analysis-schema-proposal)を具体化した。PROPOSED_ONLYで、新admission／graph／本文・図は未実装。既承認Emlis／Pieceのactualを未実装へ戻さない。

原入力3件・補足0・比較なしの明示offlineに限り、P1→immutable採用snapshot→新private graph→既存唯一realizerの文章・図→同一private serialize/reloadを最小到達先とする。18保持単位は16node候補＋従属scope1＋負荷注記1、原文11文group、8 source scope relation、route edge0。本人の省略主体・意向・否定・比較留保・程度・選択感情を保持し、不明は本人不知と材料内未観測を分ける。旧finite parser／safe projection／通常serializer／SQLを新意味の受入れへ黙って流用しない。

実装変更案はEngine、Analysisの新semantic_admission.py、既存compiler、既存realizerの4 production path＋新test／fixture各1。新shared契約へ広げず、通常service／DB／API／RN／モデル接続は含めない。新private型と意味起点の追加はRule18 §11.3 LEVEL_3の具体契約差分で、Mashがこの範囲を判断後に実装する。内部準備資料・source位置検査までを再承認待ちにしない。

今回確認原本はAPI4fd8db4／Cocolon967c7d4。P1同一material／request／期間／全memberを照合、55quoteの元scalar／UTF8と参照を確認したP1受取はCANDIDATE_UNREVIEWEDのみ。全手作業例・原入力・source blob・実施限界はtrialのanalysis_semantic_admission_proposal.json。旧P1/P2/C0は不変、今回test／実admission／生成／DB／Render／モデル0。STRUCTURE_MAP_DELTA_NONE、BLOCKER_NARROWED、商品0／正式0/3／candidate_ready=false／automatic_progression=false。


## 2026-10-23 — Mash承認済みP5のactual接続

be37f40dの具体案へMashの「進めていいよ」を受領し、API 666b28517ef04aba170ebffe3c86980fea4c11bdに限定実装した。[実仕様04](04_analysis_v1d_v1e_detailed_design.md#cmee-p5-implemented)／[実型05](05_json_schema_and_versioning.md#cmee-p5-actual-types)を参照。旧PROPOSED_ONLYは案作成時の履歴。新規・明示offlineの原3記録／Plus／補足0／比較なしだけで、P1→immutable snapshot→新private graph→既存唯一realizerの文章・図→3段階private再読へ接続する。

18保持単位／11原文group／8source scope／unknown／負荷注記／選択4を保持。完成済みは候補取得・再採用・compiler・作者を呼ばず同artifactを返し、実作者失敗時は採用snapshotを消さない。新private6型・例外2、旧logical registry／通常service／SQL／public DTO／RNは不変。対象9file905成功・12058subtestsは加算せず、全suiteや商品合格とはしない。API全6fileの全文／blob／変更集合／headを確認済み。STRUCTURE_MAP_DELTA_PRESENT、限定TECHNICAL_CREDIT、商品0／正式0/3／candidate_ready=false／automatic_progression=false。通常有効化・実モデルへ自動拡大しない。

<a id="cmee-4b-cm01-t1-proposal"></a>
## 2026-10-24 — 4B学習とCMEE接続の共通初手 CM-01/T1：意味・自然な本文の責務変更案

**状態：具体案。未承認・未実装・未学習。** Mashの本セッションの「4B学習＋CMEE接続を進めて」に基づき、第8回weekly §8.1/8.2の共通初手を実物で確認した。ここで提案する新しい意味／作者入力契約は、Rule18 §11.3のLEVEL_3判断対象である。モデル4B確定と16GB優先／24GB許容は決定済みで、再選定しない。旧P1〜P5・旧9教師・受領9B重み・既存検査期待は変更していない。

### 1. 実際に止まる位置と、今回実行した診断

照合したheadはCocolon `98f3b46c7cd35df667c080e7fb7c85c57f6d588e`、API `666b28517ef04aba170ebffe3c86980fea4c11bd`。全機能00全文、作業規則入口／CURRENT_RULES／Rule18／incident、全体設計01・全file地図01Aの現P1〜P5節、三core共通入口・CMEE map、最新weeklyのCM-01〜10/T1〜9、関連sourceを確認した。System Contextは最新cache未完成の既知状態を保ち、8月snapshotを根拠にせずfresh原本を直接参照した。実行環境はWork／Python3.12.14。補助2担当は読取調査、編集・診断・反映は主担当華恋のみ。別modelのPro/Ultra実査と偽らない。

| 確認した実物 | 今回のactual |
|---|---|
| 旧9教師のassistant JSON→現`preparation._candidate` | 9/9で`candidate_shape_invalid`。形式だけの診断で、モデル推論・意味評価・test suiteの件数ではない |
| 保存済み4Bの6 raw→同関数 | 6/6で同じ形式不一致。旧実推論の保存rawを読み直したもので、新規4B呼出し0 |
| chair初回の旧完成JSON→native材料を作る`prepare_emlis`→`receive_candidate` | `INVALID_FORMAT / NOT_ADOPTED`。合成時刻を使った診断requestであり本人record／本番操作ではない |
| 同JSONを単に`candidate`へ入れ、原文に一致する`evidence`を1つ付与 | P1は`CANDIDATE_UNREVIEWED / NOT_ADOPTED`。続く実`prepare_snapshot_meaning`は`REJECT / semantic_shape_invalid` |
| 現semantic v1/v2・唯一作者・問い | EVENT/STATE等の有限解釈、原E02限定のunknown/action。chairの修理・共同作業・理由訂正は一般対応外。完成した自然本文を受け取るfieldもない |

結果の原本と、全文を埋めた初回／訂正後の契約例は [contract_examples.json](../../../observation_learning/training/2026-10-24-emlis-4b-training/contract_examples.json)。全source quoteは初回6／訂正後12参照のscalar範囲と一致することを確認した。新例は華恋の手作業の**契約説明用**で、モデルraw・adopted snapshot・学習target・商品候補ではない。表面文は旧華恋編集案を対応説明のため保持し、完成goldや品質改善済みへ昇格しない。正式な新教師では本文も改めて全文検討する。

### 2. 推奨する一案：4Bに意味の候補と自然な文章の案を任せ、CMEEが確定する

**4Bは意味候補と自然なObservation／Reception／更新説明・任意問いの案を生成する。CMEEは本人source、採否、最終本文、実問い、訂正・撤回、保存・再開のownerを維持する。** 4Bを引用抽出だけへ縮めず、旧finite作者の復唱を最終到達にも置かない。モデル本文を先に採用してCMEE metadataで包む方式、新Engine、別renderer、別モデルは追加しない。

最初は**新規・明示offlineのFree Emlis**で、chair初回と本人訂正の一往復に絞る。これは一般入力・Plus/Premium・Piece/Analysisへの採用や通常有効化ではない。既存の一般的な動詞・主体・理由・結果の表現へ対応を広げるための最初のverticalとし、chair文面のlookup・固定応答を生成ownerにしない。新語を一つずつ足すだけの作業へ戻らない。

| 役割 | 4Bが返すもの | CMEEが決めるもの／保持するもの |
|---|---|---|
| 意味 | 原文根拠付きclaim、主体・時点・肯否、本人の評価理由、関係、不明・競合、更新案 | 元source・全選択の保持、対応範囲内の採否、旧意味との更新差。位置一致だけで意味を認定しない |
| 自然な本文 | 意味参照を付けた`surface_proposal.observation/reception/update_note` | 同じ採用意味から、既存最終本文ownerが検査・最終化する。文章を別coreの本人factにしない |
| 問い | `question_proposal`またはnull | 実target・focus・question ID・予算・ASK/END。初回1問以内、回答後残0、skip/ENDを保持 |
| 保存 | rawと実model metadata。modelにDB権限を与えない | 既存serviceがreceipt→意味→本文を保存。完成再読ではモデル／採用／作者を呼ばない |
| Piece／Analysis | 将来、各core自身の意味・文章案 | 各coreのsource・声・artifact・保存・公開owner。今回のEmlis差分で既存P4/P5を切り替えない |

### 3. 入出力の具体差分

P1の厳密な最上位`{candidate,evidence}`は維持し、`candidate`に**新しいprivate候補版**を設ける。旧`semantic_mapping_proposal.v1`と旧snapshot v1/v2のdecoderは変更しない。提案する候補版は`cocolon.cmee.semantic_and_surface_proposal.v1`、明示profileは`emlis_model_proposal.v1`。snapshot／checkpointにも旧版と区別する専用版を与え、旧schemaへ新fieldを混ぜない。fieldの閉鎖形・列挙値・symbolic refの限界は[schema05の提案節](05_json_schema_and_versioning.md#cmee-4b-proposal-shape)を正本とする。これは今回新版を有効化したという記録ではない。

旧完成JSONからの対応は次の一つにする。

| 旧field | 新候補での位置 | 意味への扱い |
|---|---|---|
| observation/reception | `surface_proposal`の同名field | 意味の根拠に逆流させず、採用claim/relationへ束縛する文章案 |
| question | `question_proposal.text`＋対象ref／focus、またはnull | 実pendingではない。CMEEだけが発行する |
| update_note | `surface_proposal.update_note`と、別のtyped `updates` | 本文の説明文だけで意味を訂正せず、原回答の根拠を持つ更新差を別に表す |
| grounded_points | 同一fieldの完全原文から再構成した最上位`evidence` | source ID／field／start／end／quoteが必要。fields配列だけを座標根拠へ昇格しない |
| unknowns | typed `unknowns` | 本人明示の不明とNOT_STATEDを区別。モデルが知らないことを本人の不明にしない |
| 旧完成JSONにないもの | `claims/relations/conflicts/updates` | 原入力・原回答を読み直して作る。本文から意味を逆生成しない。旧9件への自動変換は禁止 |

初回のchair例は、修理・再使用可能な結果・本人の喜び・「全部一人で直せたこと」を喜びとして述べた対象を分ける。TE接続を客観原因や厳密な先後へ変換しない。「なぜそれがうれしいかの詳しい説明がない」はNOT_STATEDであり、本人が「わからない」と述べたUNKNOWNではない。初回へ将来の友人・再使用という喜びの理由・訂正を漏らさない。

訂正後の例は、友人から手順を教わったこと／共同修理、新たに本人が説明した「捨てずにまた使える」喜びの理由を別に保持する。独力という説明と旧喜び理由だけを置換し、修理・再使用結果・喜びは残す。否定された旧理由を別の感情や人格へ変換しない。NOT_STATEDの旧gapは焦点自体の訂正により無効化し、未知の本人理由を勝手に解決したことにしない。

`contract_examples.json`訂正後は、旧teacherの`text`を同一bytesで将来のnative field`answer_text_private`へ投影した**説明例**である。実改行2つを含む92文字の原回答を正規化せず保持している。`$actual_prior_snapshot_ref`は実採用snapshotから将来注入する記号で、実在refではない。この例をそのまま学習・送信・native回答へ投入しない。

### 4. 問い・本文の採用を、形式成功から分離する

chair初回の旧teacher質問はMashの実演に由来するが、**現CMEEが発行した実問いではない**。新しい`PERSONAL_JOY_SIGNIFICANCE`焦点は、本人が明示した評価対象と喜びの組に限る変更案とする。問おうとする本人の詳しい意味づけ（PERSONAL_JOY_SIGNIFICANCE）が既に述べられている場合は聞き直さない。評価対象が既述であることと、その本人固有の意味づけが未記述であることを分ける。提案null、意味不採用、scope不成立、予算0、skip/stopでは発行しない。初回から返る実questionを使い、同threadへそのquestionに応じた訂正を提出できた場合だけchair一往復成功とする。初回がENDなら、架空pendingを足して訂正検証を成功にしない。

新しい自由な日本語を、旧finite inverseが読めたことにはしない。既存のauthor-freeな逆検査ownerに、新profileの対応範囲を独立実装する。本人の共同修理・理由の肯否・過去時点・残存事実と本文の意味が対応しない文、対応範囲外の言い換えは本文へ採用しない。根拠座標・claim参照・hash・JSON成功だけで一般自由文の完全性は証明できない。自己申告したbindingの一致だけを新readerの代わりにしない。検査を同じbody作者に戻して同じ文を作り直す方式も採らない。

**既存の逆検査で表現できず一般parser／別モデル／品質条件変更が必要と分かった場合は、今回の範囲を自動拡大せず、その具体差を報告する。** 既存検査を通すために4B文を原文コピーへ戻すfallbackも使わない。新profileの到達可能範囲、拒否、本文未生成と、自然な本文の実際の改善を分ける。実rawを華恋が全件読み、明白な反転・補完・復唱・定型受容をMashの商品確認へ戻さない。華恋の事前確認は正式human Product Readではない。

### 5. 実装時のexact owner案

共通prefixはmashos-api `ai/services/ai_inference/`。これは今後の変更対象案で、今回のproduction差分は0。

| exact path | 変更案 |
|---|---|
| `cocolon_meaning_experience_engine/preparation.py` | 既存材料と未採用receiptを維持。新候補も最上位shape・quote位置だけで意味採用しない |
| `cocolon_meaning_experience_engine/emlis_semantic_admission.py` | 新profileのclosed packet、意味とsurface案の分離、chair familyの更新、専用snapshot／checkpoint。旧版復元は維持 |
| `cocolon_meaning_experience_engine/contracts.py`・`emlis_thread_contracts.py` | 実装で必要なprivate候補／snapshot fieldだけ。公開DTO・既存logical registryへ未承認で型を追加しない |
| `cocolon_meaning_experience_engine/emlis_question.py` | 新焦点のsource資格、対象・予算・実発行。モデルはquestion IDを発行しない |
| `cocolon_meaning_experience_engine/emlis_thread_surface.py` | 現最終本文owner内で新profileを最終化する分岐。別renderer・metadata wrapperは作らない |
| `emlis_ai_grounded_sentence_surface.py`・`emlis_ai_grounded_human_reception.py`・`emlis_ai_grounded_observation_gate.py` | 新private profileに必要な実本文の組立／独立逆検査。旧finite検査と旧受容契約は維持 |
| `cocolon_meaning_experience_engine/engine.py`・`emlis_answer_update.py`・`emlis_thread_engine.py` | 新profileを既存唯一のorchestrationへ渡す。意味確定を表面失敗で巻き戻さない |
| `emlis_thread_service.py` | 既存eventに元raw／receipt／採用意味／本文を保存。明示offlineの注入点を使用し、通常policy併用禁止は維持 |
| `ai/tests/test_cmee_emlis_semantic_snapshot.py`、同`test_cmee_preparation.py`（repo rootから） | 旧版全outcome不変、新候補の誤意味・誤表面・問い・保存中断を対象追加。旧fixture期待を書換えない |
| 新`ai/tests/test_cmee_emlis_model_proposal.py`（案） | 新profileの一往復・surfaceを実境界で検査。fixtureを実model rawへ偽装しない |
| 新`cocolon_meaning_experience_engine/model_candidate_source.py`（案） | `offline_candidate_source`へ渡す薄い明示client。PreparedRequest→messages→raw/finish/usage/identityだけ。別Engine・暗黙retry・DB・常設監視を持たない |

モデル呼出しは最初のPods上の実4Bと同じ過程で検証し、別の有料公開APIへ切り替えない。providerの実protocol／認証／上限時間はGPU実行案で具体化し、秘密値をGitへ保存しない。CPU側のclient実装・synthetic transport検査と、実4Bを呼んだ成功は明確に区別する。

### 6. 失敗・重複・保存再開の継承

- `length/timeout/error/unknown`はJSON完結より優先。部分JSONの補修・内容の手修正・自動再送なし。
- 意味不採用ならsurfaceを本文へ昇格しない。意味採用後の表面失敗はsnapshotを保持してBODY_UNAVAILABLE。同じ保存proposal／意味から明示再開し、4Bを再呼出ししない。
- STARTEDのみで中断した場合は既存`semantic_candidate_acquisition_incomplete`を維持。応答不明を無料の未実行と見なして再送しない。
- receipt後／意味後／本文保存後の中断・ACK消失で、採用event・入力件数・候補呼出しを増やさない。完成済みGET／再表示・旧完成DTOは再生成しない。
- 親source・owner・版・実question・prior ref不一致、訂正後の旧独力理由復活、他人／現在への時点移動、未知文面は拒否または未対応にする。未解釈更新は旧本文を新prefixに付け替えない。
- 通常API・RN・本人DB・Render配置は変更せず、CM-09/10の別到達として残す。

### 7. 学習側を同じ契約に揃える最小順序

1. 本責務変更を採用後、旧9教師を読み直し、対応可能な行だけ新candidate＋surface targetを作る。原本9件は不変。今回の2契約例をそのまま教師へ昇格しない。対応できない行は理由付き未対応のままで、N=9へ水増ししない。
2. 4B専用folderにrunner／bootstrap／診断／exportを置く。モデルは`Qwen/Qwen3.5-4B`、revision `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a`。旧9B recipe／adapter／run directory／hardcoded hashを継承しない。新folderの現存fileは契約例JSONのみで、実行commandはまだない。
3. train/eval/診断で同じJSON-only指示を使用。4B tokenizerでflat token list、prefix、最終assistantのみloss、EOS、全input/completion長を確認。切捨てず、token実測後にcontext/max_newを決める。
4. 実4Bのtext q/v対象module、base凍結・LoRAだけtrainableを確認。旧total40/free32GiB条件を、4B profileの実GPU total/free/BF16と見積りへ限定変更する。閾値を下げただけで16GB適合成功にしない。
5. BF16/SDPA/r8/alpha16/dropout0/lr1e-4/batch1/accumulation1/checkpointing/seed20261024を初期案とする。最初はN行×1epochのoptimizer・教師適合診断1回。仮にN=9へ正しく対応できれば9updateであり、4周/16周や品質十分性の根拠はまだない。
6. 同じbefore/afterはchair2件＋学習外EFREE6件＝各8生成、教師NLLは各N行。仮N=9なら計16生成・18NLL評価・9update。既読の開発確認でありblind最終評価ではない。context/出力長・単価・総時間・支出上限・保存mountは未確定で、GPU開始前に具体化する。
7. 学習直後にadapterを先に退避し、同4Bへ非学習reloadしたものをafterとして使う。raw／recipe／dataset／model revision／adapter本体hashを保管。Pod外受領確認後Stopし、学習process時間とPod総課金時間を区別する。OOM時は記録して停止し、24GBの自動借り直し・量子化・教材削減をしない。

1epoch案は新targetの勾配・適合確認であり、旧9Bの品質問題を再現して終える計画ではない。mask・実更新・教師適合・非学習への転移のどこが不足するかをactualから判定し、その結果なしに周回だけ増やさない。**今回の確認対象はCPU側の新private契約実装・教材/4B runner整備まで。GPU起動・課金・新volume・外部常設提供・deployの許可を含めない。** 実行用の値が揃った具体GPU案を後で示す。

### 8. 今回の判断点と再開先

推奨は上の一案。単なるJSON包み替え、4Bを意味抽出だけへ縮める案、先に4周/16周学習する案を採らない。構造整合しか確認できないまま自由本文を採用する案も採らない。

Rule18 §11.3は「商品目的、商品体験、method family、contract、acceptanceまたは品質条件を追加、変更、置換または弱化する」作業に実行前のMash判断を要求している。今回は**モデルの意味候補に自然本文案を追加し、現唯一作者がそれを検査・最終化する入力契約と、chairの喜び焦点／訂正の対応範囲を変える**ため、既存方式内の機械的4B置換には当たらない。モデル決定や作業開始の指示を未決へ戻すものではなく、今回具体化した責務差だけを確認対象とする。

採用後の最初の一作業は新private profileのCPU実装と同sourceの初回→実問い→訂正→同一保存再読、および新target／4B runnerの契約一致。合成結果を実4B成功・本人実機・商品受入れへ数えない。所要はこの実装の1 bounded単位、追加金銭費用0。正確な作業時間は未測定で期限保証はしない。別一般parser・新外部service・dependency・通常policy・DB migration・公開contractの変更が不可欠と判明したら拡大せず具体差へ戻る。

今回production/test/旧教材/重み変更0、新GPU/推論/学習/DB/Render/merge/deploy0。正式Product Read0/3／PRODUCT_NOT_CLEAR／candidate_ready=false／automatic_progression=false、全体管理54.50％は据置。STRUCTURE_MAP_DELTA_NONE（実装構造は不変、将来責務変更案と所在のみ）。今回の診断・案作成を商品品質改善に数えない。


<a id="cmee-4b-model-proposal-implemented"></a>
## 2026-10-24 — CM-01/T1承認後のactual：offline意味・自然本文・実問い・保存再開

Mashが上記具体案に「進めて」と承認し、[API02c0b943](https://github.com/MassyuRed/mashos-api/commit/02c0b943c96b67cb32354e1d3352a00dcb768e64)の14fileへ実装した。上の未承認・未実装は案作成時点の履歴。新規・明示offline Freeのみで、旧v1/v2・通常applicationは維持する。実4Bモデルは呼んでおらず、合成候補で実Engine/serviceの接続を検証した。

actual profileは`emlis_model_proposal.v1`、候補`semantic_and_surface_proposal.v1`、snapshot v3／checkpoint v4、private artifact `cocolon.cmee.emlis_model_thread_artifact.v1`。意味ownerはsource全文から修理／再使用／独力の喜び対象を採用し、実問いに対する共同修理・喜び理由の訂正だけを更新する。表面案・モデル自由説明・provider metadataを意味IDに混ぜず、原rawとproposalは別に保持する。NOT_STATEDの採用説明は対象／未記載性の検査後、CMEE側のcoverage説明へcanonical化し、モデルの原説明はreceiptへ残す。

現最終本文ownerの新private分岐と、既存author-free ownerの独立句読取を接続した。生成templateへの置換・旧finite作者へのfallback・ref一致だけの意味合格はない。対応範囲内のモデル案は文面を保持して最終化し、未知の自由な日本語は本文不採用に閉じる。初回では「ぐらついていた椅子を直し、また座れるようになったのですね。」と「全部一人で直せたことが、うれしかったのですね。また座れるようになったと聞けて、私もうれしいです。」を同意味へ束縛。訂正後は友人の手順／共同修理、捨てずに再使用できる喜びへ更新し、独力理由を復活させない。実本文・全native bindings・問いは[CPU結果](../../../observation_learning/training/2026-10-24-emlis-4b-training/cpu_connection_results.json)に保存。合成の編集候補であって学習済モデルの文章や商品合格ではない。

実質問はsource由来のPERSONAL_JOY_SIGNIFICANCEから現問いownerが発行する。モデルquestion文・IDを権限として採用しない。実ASK→本人訂正→REFINED、意味保存後CancelledError→同意味／同proposalで明示再開、完成GET/start/同key再送の非生成を隔離SQLで確認。source取得後STARTEDだけの中断を自動再送へ変えず、通常readerはcan_write=falseを保持した。

新`model_candidate_source.py`は固定4B/revision、JSON-only messages、検証済みpriorの意味投影、async generator注入、実raw/finish/usage/baseとadapter identityをP1へ渡す薄境界。原材料は削らず、既に含まれる原文と重複するnative proofだけはモデルへ再送しない。実endpoint・secret・常設client・cache・DB・自動retryを持たず、通常APIへは未登録。 10/25のmodel投影では全text_fieldsの各Unicode文字をfield_unicode_spansの[start,end,char]として機械表示する。原文全文/metadata/control/priorを保持し、補足の前置き/空行も同欄の0から連続する。これは根拠/意味の選択ではなく、CMEE側のnative証明と採用条件・出力schemaは不変。P1 optional adapter_revisionは値がない旧receiptではkey自体を省いて全bytesを保つ。

有限なsource資格は名詞token＋許可状態修飾／修理・再使用の構文family。品目／人名lookupや新しい一般parserは作らない。追加動詞節を名詞slotへ飲み込む実欠陥を最終reviewで発見し、sourceを削らずUNSUPPORTEDにするよう修復した。未知ひらがな複合名、一般関係・感情・自由文、Plus/Premium・他coreは今回未対応である。

最終backend対象219 PASS/FAIL0/SKIP0（105.09秒、既存警告1、34subtestsは加算しない）、別のcurrent identity1検査PASS。旧snapshot全outcomeとP1/Q2/Q3を含む限定集合で、全suite/CI/本人実機成功ではない。current identity初回の旧runtime期待を現sourceから同期し、language identity・歴史的proofは不変。source scope escape、SQL readerのcan_write期待、participant回帰fixtureの途中失敗と修復はAPI既存handoffと最新weeklyへ記録した。

4Bpackは旧9教師を変更せず、sourceと実priorに一致するchair2教師だけを用意し、未対応7件を理由付き保持する。旧EFREE6は学習外・既読のstandalone proxyで、このprofileの意味成功へ加算しない。実tokenizer/indexをCPU確認し、最大7856 tokens、context8192/max_new2048、N=2×1epochの診断コード・保存→先退避→非学習reload→after・固定rawのCMEE consumerを整備した。GPU条件が未確定の現状態ではrunを拒否する。実モデルの初回出力から回答入力を動的に作るGPU一往復はまだ行っていない。

全pathは01A、actual private型は05、Emlis本文責務は02、実装結果と再開は06・第8回weeklyの実装節、新pack READMEへ同期。STRUCTURE_MAP_DELTA_PRESENTはprivate offline接続だけ。新GPU／有料推論／重み取得／学習／実DB／Render／通常API／DTO／RN／merge／deploy0。正式Product Read0/3／PRODUCT_NOT_CLEAR／candidate_ready=false／automatic_progression=false、全体54.50％は据置。次はGPUの単価・時間／支出・保存先を固定してから、実4B＋保存adapterを同じ接続へ通す。


<a id="cmee-offline-model-service-deadline-proposal"></a>
## 2026-10-25 — offline MODEL_PROFILE限定期限案（Mash承認後、実装済み・訂正以降未成立）

### 事実と今回の判断点

API7a4dc32の`emlis_thread_service.py`は`ATTEMPT_SECONDS=30`を全profileで使い、STARTED後のsource結果受領にもfinishing_attemptを要求する。Q2正本`ai/docs/EMLIS_Q2_DEVELOPMENT.md`は「各attemptは30秒」。SQLは期限後を40001/emlis_attempt_staleで拒否する。実4Bの初回57.4254569秒・訂正95.9949960秒は両方30秒を超える。今回実SQL失敗を起こしたという記録ではなく、実推論時間とsource条件の不整合である。

上の既承認案はprovider protocol/上限時間をGPU実行案で具体化するとしている。一方、今回はprovider timeoutだけでなく保存attemptの失効時点を変更する。rootはこの差をRule18 §11.3のcurrent runtime/STOP境界変更として扱い、以下の具体範囲の判断を求める。新private時間の内部具体化なのでLEVEL_2でよいという補助review意見も記録するが、別モデルPro/Ultraの審査とはしない。現在の継続指示で実施したEngine cold file再開は完了済みで、この判断待ちへ戻さない。

### 推奨する最小変更

- `ai/services/ai_inference/emlis_thread_service.py`のconstructorへ`offline_model_attempt_seconds=None`を追加。未指定の既定は30秒。明示値はboolを除く整数31..180に閉じ、`MODEL_PROFILE`・明示callable source・`enforce_application_policy=False`だけで受理する。他profile/policy、文字列/float/bool/範囲外は拒否する。今回の指定値は180秒。
- `_begin`はinstance設定を参照し、保存thread自身も`semantic_profile==MODEL_PROFILE`かつ`execution_mode==OFFLINE_CANDIDATE`の場合だけその値を使う。同じinstanceが通常Q2/Q3/旧snapshotを扱っても30秒。既存active attemptの期限は書換えない。
- 候補sourceの待機は最大150秒とし、attempt180秒のうち最大30秒を受領/意味/本文保存へ残す。model/tokenizer loadはattempt開始前に完了。timeout/cancelで候補を自動再取得せず、STARTEDだけなら既存のacquisition_incompleteへ閉じる。保存済みreceipt/意味があれば既存の明示retry_responseでのみ再開する。
- SQL/CAS/owner/tier/source/current revision/期限後commit拒否、公開DTO、意味/本文reader、問い予算、旧profileの再開を変更しない。heartbeat/新queue/常設service/新dependency/env/公開field/migration/通常有効化を加えない。

### 対象pathと検証

API製品source1file（上記service）、既存`ai/tests/test_cmee_emlis_model_proposal.py`へ対象検証を追加。既存`test_cmee_model_candidate_source.py`と`test_emlis_q2_application.py`を必要範囲で実行する。通常30秒維持、不正constructor拒否、別threadへ設定流出なし、期限超過/競合の拒否、STARTED/RECEIVED/意味保存各中断、明示再開と完成GET/start/同keyでモデル/意味event/作者を増やさないことを確認する。SQLは既存isolated実RPCを使い、辞書store成功をSQL成功へ数えない。必要runtimeが成立しなければその部分は未実施で閉じる。

その後、新しい一回の`service_roundtrip_20261025`で架空本人/原入力を隔離SQLへ作り、service自身が組んだUUID/request/source/controlを`ModelCandidateSource`へ渡す。初回の実ASKを得た場合だけ既存訂正原文へ進み、serviceが保存したactual priorで2call目を生成する。初回END/意味不採用なら問いを捏造せず終了。新規model最大2call、追加学習0、raw書換え0、固定base/revision/adapter9b845eced/prompt/8192context/2048newtokenを維持。旧rawは参照/比較用で、ID/prior置換して成功を流用しない。

成功は実service receipt→意味→本文保存、実問い1/訂正3更新/END、同じ本人の再読、意味保存後中断から同じ本文への明示再開。通常application/Auth/HTTP/RN/本人端末/商品受入れの成功にはしない。期限/OOM/不一致/不採用/例外で追加call/retry/再学習せず実状態を回収する。

### 時間・費用・GPU

既存A4500/同Podのみ、モデルcall各150秒以内、load/隔離SQL/回収を含むprocess最大900秒。前回表示$0.26/hで15分按分$0.065（準備回収/既存継続保持/税を含む請求hard capではない）。新Pod/charge/外部API/STOP/再起動/削除なし。終了/失敗後もMashの指示までGPUを保持する。今回の接続問題に新しい観測会は不要。

**現状態：MASH_APPROVED_IMPLEMENTED_BOUNDED_ACTUAL_INITIAL_ONLY。** Mashが本具体案へ「いいよ、進めて」と承認し、API95d00bへsource1/test1を実装した。下段が最新actualで、上の未適用/判断待ちは案作成時点の履歴。SQL/通常applicationの30秒は不変。


<a id="cmee-offline-model-service-deadline-implemented"></a>
### 承認後のactual — 2026-10-25

API95d00bはconstructor/実thread限定180秒、残30秒を引くasync最大150秒、timeout/cancelのSTARTED再取得禁止を実装。最初のSQL回帰で判明したSTARTED後旧revisionのHOLD競合は、同service内でfresh readとactive attempt一致確認へ最小修復した。通常Q2/Q3/APPLICATION・旧profile30秒、SQL期限/CAS/owner/sourceを維持する。同期sourceのhard中断は対象外で、実runnerはcancelをtoken loop停止へ伝える。新しいheartbeat/queue/公開fieldはない。

期限実装時のCPU3file114 PASSと、最初の実service初回保存のみ/訂正INVALID_FORMATはweekly§35・trial/service_roundtrip_20261025の履歴。後続の明示継続作業は、凍結chair教師のservice束縛12更新＋根拠表/参照6更新を別planで行った。API95d00bの明示offline attempt180秒/source150秒・通常30秒/SQL期限/CASを保持。既存chair1題2段階を正規service ID3組へ再束縛した凍結6教師に、全文12更新＋根拠表/参照重点6更新を実施し、保存/非学習reload後の同6入力FITは意味/本文5/6→6/6。新adapter76309b86…をPod外照合/保持。最初の学習外ID01は訂正INVALID_EVIDENCEで終了したが、別のfresh ID02の実4B2call/隔離SQL30RPCは210.939656秒で初回ASK・訂正3更新/END・意味保存後中断/明示再開・初回/最終GET/startとsame-key回答の非生成再読まで成立。raw/teacher/reader/API/SQL contractの修復・緩和0。同processの既知chair一往復であり、cold restart/未知言語/通常app/実Auth・端末/商品受入れは未成立。観測会は今回不要、GPU稼働保持/STOP0、商品credit0/正式0/3/54.50％据置。 共有schema/reader/作者/意味採用/SQLの契約は変更せず、今回の生成枠2560/prompt5632/context8192は診断runnerの新有限設定のみ。原本はtrial/2026-10-25-service-binding/README.md・weekly§36。

上記§36の実行planは終了済みで、同じchairの再束縛を現在の次作業へ戻さない。private期限の実装差分だけがSTRUCTURE_MAP_DELTA_PRESENT。現在の次作業は下のdaily-calm具体案で、商品0/正式0/3/54.50％を保持する。


<a id="cmee-daily-calm-family-proposal"></a>
## 2026-10-25 — 別の日常場面へ意味と自然本文を通す限定案（未承認）

現在のemlis_model_proposal.v1はrepair/reuseのsource認識・4/6claim・専用逆検査を持つ。既存FT-UDON-INITIALの一回CPU診断はUNSUPPORTED/model_repair_reuse_source_out_of_scope。学習反復だけの問題としない。

[具体案・原sourceと全packet・実診断](../../../observation_learning/training/2026-10-25-emlis-daily-calm/README.md)に、帰宅/調理/食事/温かいものを食べた/少し落ち着いたの5claimと4関係、原文のから/て/たらの作用域、限定語彙/否定・追加節拒否、metadata保持、旧chairの版/意味/hash/完成本文不変、初回だけ/問いなし、API3製品path＋新test/fixture2pathの最小変更を固定した。KARA/TARAは追加するprivate関係値の案で、未実装。

承認対象は、上記familyの意味採用/独立本文検査/model指示、native教師のCPU/実tokenizer確認、76309b86から9行×2passの新18更新一回・保存/reload/FIT9（1800秒/$0.13以内）、非学習service2call/隔離SQL保存再読（900秒/$0.065以内）、回収/保持まで。原うどんと固定した雑炊変形を範囲へ含め、後者は学習に入れない。費用は記録単価$0.26/hのprocess按分で、継続保持等を含む請求総額ではない。

同案のRule18 LEVEL_3というroot判断は、新しい意味/関係を採用する契約拡張と解釈したため。既存のoffline180秒承認を流用せず、実装/学習はMash判断前に開始しない。今回は診断/具体案のみ、製品code/reader/teacher/重み/API/SQL/DTO/RNは不変。通常アプリ/本番/端末/商品合格へ進めず、追加試行/追加更新/LR探索/他core展開0。GPUはSTOPしない。STRUCTURE_MAP_DELTA_NONE、primary BLOCKER_NARROWED、商品0。現在地はweekly§37/全機能00。


## 2026-10-25 — 承認済みdaily食事family（学習前checkpoint）

Mashが§37の日常食事family追加・18更新・保存再読の限定検証を明示承認。APIbd356566の3製品owner＋新test/fixtureを実装し、限定4file174成功（新59＋既存115）。旧chairの実行captureと意味/snapshot/本文/問い/3更新/model入力は全文一致。dailyだけ5claim/4関係/内部版2/2・初回/問いなしへ対応し、合成3service identity/SQL30RPCで保存非生成再読を確認。旧chair6行をbytes不変で保持した9行/2familyと18update/FIT9の新有限planを凍結。本物tokenizer事前確認とGPU学習・実model保存再読は未実行。GPUのA4500稼働/76309b86を再確認しSTOP0。新観測会不要、通常app/本番配置/DB変更0、正式0/3・54.50％据置。 共有契約の差分は既存MODEL_PROFILEのprivate source認識/5claim/4関係/表面逆検査とsnapshot内部admission/adapter2/2だけ。KARAはreturnからcook/eatの二作用域、TARAは記載の結び付きで一般causeではない。旧chairのversion1/1/native/hash/本文/messagesは不変、外側MODEL_SCHEMA/MODEL_CHECKPOINT_SCHEMA/semantic_profileは据置。dailyの回答/prior/gap/問い/更新は拒否し、通常入口へ接続しない。全実装pathは01A、原本は新daily pack、進行はweekly§38/全機能00。STRUCTURE_MAP_DELTA_PRESENT、商品0。


### 2026-10-25 §38最終結果 — 18更新完了、daily採用未達で終了

18更新・保存/非学習reload/FIT9を1189.666秒で完了。無補修rawの意味/本文はchair6/6・daily0/3（全INVALID_EVIDENCE）。FIT全9成功に未到達のため別IDの実service保存再読はcall0で終了し、追加更新/再試行0。新重み5f0e51e9はPod外検証・保管済みだが昇格せず、旧76309b86を保持。原欄座標・引用・根拠索引・KARA両作用域と受け取りが残件で、新観測会は今回不要。GPUはA4500稼働保持/STOP・再起動・削除0。本番/DB/Render/RN変更0、商品credit0・正式0/3・54.50％据置。

APIbd356566/source e06d6b4c、実tokenizer max5045/2339、18更新・生成9・意味/本文6、holdout0。限定CPU174（新59＋既存115）/失敗0/skip0、既存warning1。原raw9・結果・凍結条件・32tensor/全member照合・失敗履歴を `observation_learning/trials/2026-10-25-daily-calm-fit18/` に保存。上記のGPU実行前checkpointは履歴として保持する。全ファイル地図の追加ownerはこのtrialのREADME/run/closure/raw/training/NLL/runtime/weights検査/consumer index＋20partsだけで、product責務の追加なし。

<a id="cmee-quote-address-offline-proposal"></a>
## 2026-10-25 — 引用の選択と位置計算を分ける明示offline案（未承認・未実装）

状態：**MASH_APPROVED_IMPLEMENTED_CPU_CHECKED_GPU_PENDING**。以下の未承認記述は案作成時点の履歴。承認後actualは末尾と実行pack。原本・9行の候補・CPU結果・有限planは[quote-address候補](../../../observation_learning/training/2026-10-25-emlis-quote-address/README.md)。Cocolon preimage49511071364bee1df1c4ecd43def61dd08d6c1a0／APIbd356566d37370911e14dab2819ab25a619c6353。

### 目的と判断理由

focus12の実rawはchair6/6を保持、dailyは引用開始位置3整数と受け取り3件が残る。78根拠はすべてsource_id/fieldを固定すると原文内で一意に見つかる。原rawの3整数は実際に誤りで、本文の「少し落ち着いたのですね」も事実再確認に留まる。既存readerの拒否は妥当であり、bug扱いで緩和しない。

同じ整数を第三の通常学習で暗記させる代わりに、4Bが原文のどこを引用するかを選び、既存preparationが完全引用のscalar位置を決める責務へ限定変更する。意味・自然な受け取りは引き続き4Bが生成し、CMEEは独立に採否を決める。位置一致は意味の証明ではない。新しい観測会は今回不要。一般理解・三中核品質の教師不足は別残件。

### 新しい私的出力形式と旧形式の保持

新形式は最上位exact3キーで明示する。

```json
{
  "schema_version": "cocolon.cmee.quote_candidate.v1",
  "candidate": {"schema_version": "cocolon.cmee.semantic_and_surface_proposal.v1"},
  "evidence_quotes": [
    {"source_id": "<requestのsource_id>", "field_path": "memo_action", "quote": "うどんを作って"}
  ]
}
```

上のcandidateは形式説明用の省略例であり、学習・採用できる完成packetではない。完全な5claim/4関係/本文を含む日常3教師は候補JSONLにある。最上位の旧exact2キーcandidate/evidenceと、新exact3キーschema_version/candidate/evidence_quotesを混在させない。未知版・余剰キー・行内start/end・空引用・不正型・重複JSONキー・非有限値は拒否。旧形式の誤座標を新形式として救済しない。

ModelCandidateSource/build_model_messagesへ明示format引数を追加し、既定値は旧方式のまま。新引数はOFFLINE_CANDIDATEかつEmlisだけに限定する。新形式を指定した取得で旧形式が返っても自動fallbackせず不採用にする。旧chair6は旧prompt/旧packetのまま、新daily3と2holdoutだけ新引数を明示する。Piece/Analysis/通常applicationへ適用しない。新promptは原文・metadata/control/priorを保持して重複するfield_unicode_spansだけを外し、位置を出す教示/shapeを完全引用方式へ置換する。

### 既存owner内での処理と保存

| owner | 承認後に加える最小差分 |
|---|---|
| API `ai/services/ai_inference/cocolon_meaning_experience_engine/preparation.py` | strict parserの新形式分岐。一意quoteをnative5fieldへcompileして既存_check_evidenceへ渡す。旧分岐と旧receipt bytesを維持 |
| API 同package `model_candidate_source.py` | 既定旧形式＋明示offlineの新format選択、矛盾しないsystem/output_spec、実rawの期待形式確認。新client/endpoint/補助routeなし |
| API `ai/tests/test_cmee_preparation.py`、`test_cmee_model_candidate_source.py` | 既存assert/fixtureは不変で追加検証。旧prompt/receiptの全等値と新format指定・拒否を確認 |
| API `ai/tests/test_cmee_quote_candidate.py`（新しい検証file1） | strict形式・引用一意性・原raw保持・receipt/snapshot再導出・偽造拒否・daily実本文/隔離保存再読をまとめる |
| Cocolon quote-address候補pack内のrunner2file | 既存学習/helperとholdout手順を再利用する有限runner。旧planを変更せず、新3教師と明示formatを渡す |

原文欄はrequestに束縛されたsource_idとfield_pathでexact指定する。quoteは正規化・trim・近似・他欄検索をせずそのまま探し、重なった出現も含め全開始位置を数える。0件または2件以上なら拒否。1件だけならstart、その後ろのscalar長からendを決め、配列順は保持する。空quoteも拒否する。例えば「あああ」に「ああ」は開始0/1の2件であり、一意としない。UTF8 byte/UTF16 code-unit位置へ読み替えない。_model_spanは意味owner側にあり、非重複countでもあるためpreparationからimportしない。

CandidateReceipt.raw_outputは**実際の新形式rawそのもの**を保存する。candidate_jsonだけを従来nativeのcandidate/evidenceへcompileし、candidate本体・引用順・evidence_indexes・問い・更新を変えない。statusは位置確認後もCANDIDATE_UNREVIEWED。既存emlis_semantic_admission._receiptが同じ保存rawからreceive_candidateを再実行し同一receipt/native結果を再導出できることを必須とする。意味snapshot・保存・再開はこのnative結果を既存責務で扱う。生成rawを書き換えてreceive_candidateへ渡す実装は不可。

### 実行前CPU条件と終了条件

今回は製品実装・receipt再導出検査・pytest・GPUをまだ実行していない。行ったのは9教師/原raw78引用のread-only照合と候補の可逆投影だけ。旧chair6行bytes一致、日常3のcandidate/本文/根拠順/意味は不変、nativeへの復元3/3一致。これは4Bの新生成や採用成功ではない。

承認後、上記APIの既存preparation/model/daily/proposalテストを含む限定回帰、旧chairのprompt/全receipt/snapshot/本文/問い/3更新の等値、新rawのreceipt再導出、改ざんraw/native拒否、重複/overlap/欠落/source/field不一致、絵文字・結合文字・改行のscalar位置、unknown finish/timeout優先を確認する。既存daily5claim/4関係と短い自然な反応のreaderは不変。合成新rawで意味→実本文→隔離SQL保存/意味保存後中断→再開/非生成再読まで通す。失敗時はGPUへ進まない。

### 同じ判断範囲に含める有限学習と保存再読

CPU/実tokenizer条件が成立した場合だけ、未採用candidate affea8a7094832dfbac27343af87a9ad1b302f61616c19ead33d1dcc7bf59cc3を開始点として新しい一回の試験を行う。旧76309/5f0/affeaと原raw/旧18+12planを保持し、終了planの再開はしない。

- 凍結候補9行：旧chair6を各1回、新形式daily3を各4回、計18更新。全assistant JSON＋実EOSのloss、promptは除外。受け取り本文も元教師のまま教える。追加倍率/疎mask/途中探索なし。
- 新AdamW、LR5e-5、decay0、clip1、batch1、accumulation1、seed20261024、既存LoRA32tensor/base/tokenizer。最初の9行をshuffle後、daily3の追加3周を同じrngでshuffle。
- context8192/input5632/output2560、実tokenizerで超過・切捨て・EOS不整合があれば停止。前新生成0、保存・非学習reload後のFIT新生成9。
- 学習/保存reload/FIT合計1800秒以内。全9の無補修実rawが意味/本文採用へ通り、chairの実問い/訂正3更新を維持した場合だけ、学習外の別identity2件を新形式で各1call、実service→隔離SQL保存→GET/startの非生成再読へ進む。後段900秒以内、最大2call。成功後の追加承認往復は不要。
- 記録単価$0.26/hのprocess按分は最大45分/$0.195。準備/回収/継続保持/税等を含む請求総額ではない。18回は最適回数の実証値ではなく、新形式と受け取りの有限適合試験の上限。
- 不一致/OOM/非有限/長さ/期限/意味または本文不採用で終了、追加update/LR探索/失敗要求再call/reader緩和/旧raw補修なし。失敗時も重み・全原結果をPod外へ回収する。GPUはSTOP/再起動/削除せず保持。

### 判断範囲・今回の効果・残件

この案はモデル出力形式・教示・教師投影・停止後の新試験を変更するため、Rule18§11.3 LEVEL_3の具体判断が必要。過去の追加12更新承認を流用しない。今回の継続依頼を根拠に診断・レビュー可能な案と候補データまで作成したが、未承認の製品変更/新GPU試行は0。

提案の実装・CPU・実tokenizer・上限18更新/FIT9・成功時2call保存再読・回収までを一つのscopeとし、承認後のscope内の実装詳細/byte hash固定だけで再承認を求めない。範囲/基準/費用枠の拡張が必要なら実行前に止める。通常アプリ/HTTP/Auth/RN/本人DB/本番/Supabase変更/Render配置/有料差/他core/商品受入れを含めない。

実環境はCodex Work/GPT-6、root華恋が調査/統合/反映owner、別文脈agent2枠はread-only意見。独立Pro/Ultra/human受入れとは呼ばない。System Context最新cacheは本作業でも未成立でfresh原本fallbackを使用。STRUCTURE_MAP_DELTA_NONE（今回、未承認案・候補データのみで製品構造変更0）。商品credit0、正式0/3、全体54.50％据置。原実結果の意味7/9・本文6/9を新案の成功へ上書きしない。次は本案の判断であり、自動試行しない。

## 2026-10-25 — 承認後quote形式のactual（実GPU試行前）

Mash明示承認に基づきAPI4002b457のpreparation.py/model_candidate_source.py＋新test1へ実装。新wire cocolon.cmee.quote_candidate.v1はEmlisの明示offline形式選択だけ。旧デフォルト/旧receipt bytes/意味/reader/保存schemaは保持。新quote配列を順序不変で一意位置へcompileし、実rawは保存、candidate_jsonだけnative化。既存_receiptが実rawから同一結果を再導出する。重複/overlap/空/不一致/混在形式/別coreを拒否し、旧誤座標を救済しない。新sourceは要求形式違いをraw保持のPROVIDER_ERRORとして拒否、再callなし。

限定対象は重複除外197成功、初回DTOと回答更新のtest期待修正履歴をcpu_validation.jsonへ保存。新SQL4variantで通常/意味保存後中断と明示再開/非生成GET-start、保存意味IDとevent数不変を確認。合成9教師はnative/意味/実本文9/9、旧chair6行bytes不変。実tokenizer/新18学習/FIT9/2保存再読はまだ未実行。詳細/実行用filesはquote-address pack、最新weekly§42。STRUCTURE_MAP_DELTA_PRESENT、限定CPU TECHNICAL_CREDIT、商品0/正式0/3/54.50％を保持。


## 2026-10-26 — 4題材6教材のprivate版3接続（CPU完了）

Mash承認c97d6794に基づき、既存4ownerのsource-derived admission/adapter3でBOOK/SHOPの初回実問い→説明ADD・元意味保持・gapのみ解消・一回答END、REPOT/KNIT初回ENDを接続した。本文は独立source readerで主客・時点・否定・程度・本人知覚・二対象の明示不明を照合。外側wire/schema/dataclass・通常API/DTO/DB/RN/依存・通常30秒/明示offline180秒は不変。対象394成功/HTTP2対象外、新SQL6状態の同snapshot再開と完成非生成再読、旧18構成の1,851,616bytes全一致、native6/EOS/context8192 max7935を確認。新4B学習/生成0、旧2560出力枠では2回答targetが長すぎるため次のGPU条件は未決。STRUCTURE_MAP_DELTA_PRESENT、型追加0、商品0/正式0/3/54.50％。実原本・全本文・失敗履歴・全pathは `observation_learning/training/2026-10-26-unconnected-native/README.md#sixrow-cpu-implementation` と最新weekly§56。


### 2026-10-27 — quoteモデル教示へ既存ID制約を明示

APIa4b91b4のQUOTE_CANDIDATE_SCHEMAにおけるunknown_id_constraintsの1項目追補は、既存reader制約の教示であり新意味/新採用条件ではない。共通system/legacy_numeric/教師targetは不変。固定198位置の重点lossと併用した承認済みlocalized30一回は終了。30更新・新保存・112F32/3,833,856parameterの非学習再読込を完了。自由生成15/15、EOS15・strict JSON14、同CMEEの意味11/15・本文9/15（旧9意味/本文9/9、新6意味/本文2/0）。採用snapshotの別process cold-fileは11/11完全一致、失敗0。処理1524.400948秒・$0.118565按分（準備/CPU/回収/保持/保存/通信/税等別）。新937233a0は通常不採用。意味11/本文9・新6本文0で前回から本文成立は増えていない。指示とlossの効果は単独帰属しない。原本 `observation_learning/training/2026-10-26-unconnected-native/localized30_result/README.md`・最新weekly§76。意味型/wire/API/DB/RNの境界は不変、STRUCTURE_MAP_DELTA_NONE、商品0/正式0/3/54.50％。


<a id="cmee-named-reference-unapproved-proposal-20261028"></a>
## 2026-10-28 — 名前付き参照形式の未承認差分案（未接続CPUのみ）

状態PREPARED_AWAITING_MASH_CONTRACT_APPROVAL。既存quote契約は変更せず、[名前付き参照の具体案](../../../observation_learning/training/2026-10-26-unconnected-native/named_reference_preparation/README.md)を別案として置く。新root v/a/q/c、key略記、モデルが明示するidentity表、q.idへのev/更新$idへのurからnative数値参照を導出する案は、既存「candidate本体/evidence_indexes/更新を変えない」のwire表現範囲を変更する。Rule18§11.3 LEVEL_3のMash判断前にAPIへ実装/新GPU試験しない。

採用する場合の保持条件：actual named raw保存、明示candidate_formatのみ/自動検出・fallbackなし、新metadataは同じrawからreceipt再導出、旧receipt bytes不変、既存一意quote位置/意味/本人本文/問い/全ADD-GAPの採否不変。source-derived V3のBOOK/SHOP説明回答だけをsemantic ownerでguardしraw自己申告へ委ねない。preparationからsemantic ownerをimportしない。外部情報による意味補完なし。旧新snapshotはraw/metadataが異なるためnative意味/binding/本文/問い/更新で比較し、各同raw再読では完全一致を要求。

今回CPUの15/15は投影を元teacher rawへ復元して旧receiverへ渡した同値で、新wire実受領/metadata再読/保存再開/4B品質は未確認。targetはBOOK/SHOP265/323token減、prompt各220増。SHOP3712枠はcontext超過し、案の3584も最終実tokenizer確認後だけ。一回の実装→CPU→成功時d431/13更新→save/reload→各1生成、600秒/$0.047処理按分（保持等別）を同scopeとして提案。新形式未採用・追加model/学習/生成/SQL0、商品0/正式0/3/54.50％、STRUCTURE_MAP_DELTA_NONE。


<a id="cmee-named-reference-implemented-20261028"></a>
## 2026-10-28 — Mash承認後named形式のprivate接続・CPU完了（GPU前）

[具体scopeとactual pack](../../../observation_learning/training/2026-10-26-unconnected-native/named_reference_preparation/execution/README.md)。起案67910d91に対するMashの明示承認後、APIa8be7a9bのprivate4owner＋新test1へ実装。cocolon.cmee.named_reference_candidate.v1は明示candidate_formatだけ、actualrawを保持、出力内のq.id/update$idと明示identity表をnative索引へ解決する。推測/欠落意味補完なし。既存quote契約のwire表現差分は今回の承認範囲に限定され、旧default/旧receipt bytes・native意味/本文/問い/全更新の採否は維持する。

preparationはstrict形式/一意quote位置まで、semantic ownerは既存source由来native.family/stageでBOOK_CONCERN_V3/SHOP_DISTANCE_V3のAFTER_EXPLANATIONだけを認め、raw自己申告へ資格を委ねない。preparation→semanticの循環なし。_receiptは新metadataのformatを同actualrawへ渡し同一receiptを再導出。別profile/core・空/重複/不明参照・不正JSONを拒否し、timeout/length優先・自動fallbackなし。新型/保存schema/公開API/DTO/DB/RN変更0。

最終CPU347成功/失敗・skip0、SQL12対象外。旧API64の15receipt/snapshot/fulloutcome完全一致、新2はnamed実raw→同native意味/本文/7・8更新→別process保存再読一致。新旧wire間のreceipt-linked identity差を隠さず各同rawの完全再読を確認。BOOK4422+3712=8134、SHOP4586+3584=8170/8192。実4B改善はまだ未確認、GPU一回は実行前、商品0/正式0/3/54.50％、STRUCTURE_MAP_DELTA_PRESENT。


### 2026-10-28 named13 — 承認済み一回の閉鎖結果

source3786df21/APIa8be7a9bでd431から13更新/save/112F32 no-grad reload/BOOK-SHOP各1生成を556.846752秒/$0.043310処理按分で終了（準備/CPU/回収/保持等別）。両EOSなし・cap3712/3584で未完結、実receiver TOKEN_LIMIT→REJECT/semantic_receipt_not_validated、意味/本文0/2・採用snapshot0/cold対象なし。静的なv構造不正/旧新表記混在/参照反復/全更新・本人本文不足は、実意味検査でのUNSUPPORTED判定ではない。新284f1df7不採用・元d431/source不変、原本と追加重み全hash/112F32有限性照合保全済み。GPU保持/Stop等0、追加試行/意味補完/reader緩和/上限延長なし。CPU347/旧15完全一致/合成named2冷再読と実4B失敗を区別し、商品0/正式0/3/54.50％。結果は `observation_learning/training/2026-10-26-unconnected-native/named_reference_result/README.md` とweekly§87。実行/回収のSTRUCTURE_MAP_DELTA_NONE。


## 2026-10-29 承認済みprivate fixed-row受領契約

Mashがbadea42e fixed_rows案の一回を最大40分/処理按分$0.19（他費用別）で明示承認。API c920f81aは`cocolon.cmee.fixed_rows_comparison.v1`を明示offlineのFree BOOK/SHOP回答後に追加した。root `[format,v,a,q,c]`と固定列（bindだけ3/4列）から名前と階層だけを復元し、既存named/quote/native意味判定へ渡す。v/schema・alias名と実ID・quote・時点/否定/主体・全更新/target/order・bind・本文3項目はモデル出力のまま。欠落/型不正/未定義や重複宣言/不正JSONを補完せず、finish失敗を成功より優先する。新format未指定時の自動検出、旧形式fallback、通常ModelCandidateSource対応は含まない。実rows raw/format/model/base/adapter/usage/finishをreceiptへ保持、同rawでreplay/coldを行い復元namedをモデルrawに置き換えない。意味採用側もactual offline/free/source由来BOOK/SHOP AFTER_EXPLANATIONを独立確認する。native meaning/snapshot/公開DTOのschema・型は追加0。CPU教師2/旧9全結果一致、実モデルの一回は終了しBOOK/SHOP0/2（両INVALID_FORMAT）・旧9=6/9・椅子01訂正の旧成功喪失で新重み不採用。5更新/2load/13生成、成立6件cold/replay一致・原本回収済み。後続7acff074は現identity fixture同期のみ。原plan/成功/STOP/上限はfixed_rows execution、実結果はweekly§105。
