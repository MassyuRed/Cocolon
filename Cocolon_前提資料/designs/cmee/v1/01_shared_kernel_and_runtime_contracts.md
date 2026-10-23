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
