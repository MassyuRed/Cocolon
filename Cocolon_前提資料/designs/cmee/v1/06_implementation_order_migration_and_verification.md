# CMEE V1 — Implementation Order / Migration / Verification 詳細設計

- document id: `cocolon.cmee.v1.implementation_migration_verification.detailed_design`
- lifecycle: `DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE`
- current implementation admission: `STOP_BEFORE_IMPLEMENTATION`
- current provider admission: `NO_SAFE_CMEE_V1A_CANDIDATE_STOP`
- L3-R route selection: `ROUTE_B_PROVISIONAL_ATTACHMENT_WITH_USER_SOVEREIGN_RESOLUTION`
- current L3-R state: `ROUTE_B_SELECTED_BOUNDED_PREFLIGHT_NOT_AUTHORIZED_STOP`
- automatic progression: `false`

---

## 0. Current conclusion

CMEEのproduct、host、shared responsibilities、core boundaries、schema、migration routeは詳細設計できる。

一方、Emlis V1-Aがcurrent Cycle001へ返るために必要なformal predicate / argument attachment authorityについて、current acceptance contractを満たすconcrete providerは確認できていない。

official parser / model候補は、morphology、dependency、PAS proposalを返せても、次を形式的に保証しない。

- complete candidate set
- zero / omitted argumentを含むclosed denominator
- required / active owner全件のunique governing attachment
- statistical one-bestをuser meaningのauthorityへできる根拠

よって、本設計publicationのterminalは次である。

```text
NO_SAFE_CMEE_V1A_CANDIDATE_STOP
```

これはCMEE全体の不可能判定ではない。current formal contractのまま、provisional parserをauthorityへ昇格して実装を始めないためのbounded STOPである。

2026-08-15 JST、MashはL3-Rのrouteとして`ROUTE_B_PROVISIONAL_ATTACHMENT_WITH_USER_SOVEREIGN_RESOLUTION`を選択した。route ambiguityは解消したが、L3-Rが要求するbounded preflight exact bodyは未承認である。したがってcurrent L3-R stateは`ROUTE_B_SELECTED_BOUNDED_PREFLIGHT_NOT_AUTHORIZED_STOP`、P0 / implementation effectは0である。

## 1. Mash LEVEL_3 route decision

exact2候補に対するMash判断はRoute B selectionで確定した。

### Route A — formal closureを維持（NOT_SELECTED）

```text
ROUTE_A_FORMAL_CLOSED_ATTACHMENT_AUTHORITY
```

required:

- complete candidate setを保証するconcrete mechanism exact1
- formal open-slot denominator
- exact predicate / lemma / inflection
- argument span / case role / governing edge
- scope / provenance
- ambiguity / unresolved independent derivation
- resource / dependency / platform / failure boundary

これを満たすauthorityが提示できなければRoute AはSTOPする。

### Route B — provisional language analysis + explicit product resolution（SELECTED）

```text
ROUTE_B_PROVISIONAL_ATTACHMENT_WITH_USER_SOVEREIGN_RESOLUTION
```

acceptance contractを明示的に変更し、provider outputを`PROVISIONAL_ONLY`とする。visible claimに必要なambiguityは、次のいずれかで解決する。

- ambiguityに依存しないlimited observation
- userへ一点だけ確認し、answerをsupplemental sourceとして扱う
- safe claimがなければ`UNAVAILABLE`

one-bestをsilent authorityにしない。user answerはperson truthの全部ではなく、対象unknownについてのuser-owned correction / confirmationである。

MashはRoute B directionを選択した。この選択はprovider proposalを`PROVISIONAL_ONLY`に留め、limited observation / user sovereign clarification / `UNAVAILABLE`で閉じるroute-level semanticsだけを承認する。bounded preflight、exact cross-field acceptance contract、P0、dependency、implementation、runtime、Cycle001変更は承認しない。

## 2. Work packet overview

| Packet | Goal | Entry | Exit | Product / runtime effect |
|---|---|---|---|---|
| D0 | 詳細設計publication | user request | exact7 docs + map sync remote verified | 0 |
| L3-R | Route A / B + bounded preflight authorization | D0 | one route and preflight scope approved or STOP | 0 |
| P0 | provider/resource preflight | L3-R | measured provider / platform / resource evidence or STOP | 0 |
| L3-I | dependency/resource/I1 allowlist decision | P0 PASS | exact adoption and implementation packet approved or STOP | 0 |
| I1 | Emlis disabled vertical | L3-I | candidate ready disabled | production 0 |
| I2 | representative correction | I1 | machine + Product Read packet | production 0 |
| C0 | Cycle001 re-entry decision | I2 + fresh current owner | explicit re-entry or STOP | navigation only |
| C1 | Cycle Step1 CMEE ingress | C0 | Step1 formal/approved contract proof | offline Cycle only |
| C2 | Cycle Step2 / 3 / acceptance | C1 complete | Cycle001 decision | production 0 |
| E0 | Emlis production cutover | accepted Cycle + separate approval | active owner exact1 | Emlis runtime |
| E1 | Emlis question / refinement | E0 proof + separate design | V1-B operational | Emlis API/DB/RN possible |
| P1 | Piece V1-C | separate activation | Piece visual operational | Piece runtime |
| A1 | Analysis V1-D | separate activation | observed route operational | Analysis runtime |
| A2 | Analysis V1-E | V1-D proof + separate activation | IF route operational | Analysis runtime |
| X1 | cross-core formalization | second / third actual consumer | shared contracts proven | bounded refactor |

矢印は自動進行しない。

## 3. D0 — detailed design publication

scope:

- detailed design exact7
- CMEE current structure map update
- affected core current mapsへのdesign pointer同期
- no mashos-api write
- no dependency / implementation / test / runner write

verification:

- Markdown links resolve
- schema JSON blocks parse where intended as complete schemas
- path references exact
- design / current / future lifecycle separated
- current STOP code consistent
- remote commit changed paths exact
- PR remains Draft / open / unmerged

D0はproduct / technical implementation credit 0である。

## 4. L3-R — authority route and bounded preflight decision

Mash decision must fix the acceptance route and a bounded preflight scope. P0より前にunmeasured package hash、resource size、RSS、latencyを採用済みとはしない。

Current fixed fields:

```text
route_id = ROUTE_B_PROVISIONAL_ATTACHMENT_WITH_USER_SOVEREIGN_RESOLUTION
approval_owner = Mash
route_selection_date = 2026-08-15 JST
route_level_semantics = provisional provider + ambiguity-independent limited observation | target exact1 user clarification | unavailable
```

The route selection does not prove candidate-set completeness, does not make one-best / score / empty ambiguity list authoritative, and does not permit per-owner omission or denominator shrink. A supplemental answer must remain a new caller-supplied source bound to the target unknown only; original source / graph / admission are immutable. These clauses set direction, not executable admission.

L3-R must still fix:

```text
approved cross-field acceptance semantics, including required / active owner exact coverage
provisional epistemic representation that cannot alone support visible claims
original-input lifecycle clarification request maximum exact1
provider / resolver responsibility
preflight candidate package set
preflight exact local / temporary paths
preflight resource and platform ceiling
runtime network / storage / secret effects
failure / ambiguity / OOV behavior
privacy boundary
retry authority
post-preflight approval requirements
automatic progression = false
```

Until every remaining field is approved in one bounded technical body, the L3-R exit is not met and P0 is forbidden. The current outcome is `BLOCKER_NARROWED`, not product / technical implementation credit.

P0 PASS後、Mashのseparate `L3-I`でexact dependency versions / hashes、resource lock、repo changed-path allowlist、I1 implementation scopeを承認する。L3-I前にrequirements、lock、production source、test、runnerを書かない。

decisionだけの新runtime Gate / checker / authority chainを作らない。既存work navigationとdesign docsへ最小反映する。

## 5. P0 — provider and resource preflight

### 5.1 Candidate use

GiNZA / spaCy Japanese / KWJA等は比較候補にできるが、admissionは承認routeのcontractで判定する。

official capability references:

- GiNZA: https://github.com/megagonlabs/ginza
- GiNZA 5.2.0 distribution: https://pypi.org/project/ginza/5.2.0/
- ja-ginza 5.2.0 distribution: https://pypi.org/project/ja-ginza/5.2.0/
- spaCy Japanese pipelines: https://spacy.io/models/ja
- spaCy 3.7.6 distribution: https://pypi.org/project/spacy/3.7.6/
- KWJA: https://github.com/ku-nlp/kwja
- KWJA 2.5.1 distribution: https://pypi.org/project/kwja/2.5.1/

上記がdependency / morphology / dependency / PAS capabilityを持つことと、CMEEのformal closureを満たすことは別である。「current formal contractを満たす保証が確認できない」というSTOP判断は、official capabilityとCMEE completion conditionsを比較した設計上の推論である。

Route Aでは、statistical parserのone-bestやscoreだけでは`FORMAL_CLOSED`にならない。

Route Bでは、approved providerを`PROVISIONAL_ONLY` producerとして固定し、ambiguous / unresolvedをvisible claimへsilent promotionしない。

current comparison candidate identityは次である。すべて`PROVISIONAL_ONLY / NOT_APPROVED`であり、package setをimplementation authorityへ昇格しない。

```text
ginza==5.2.0
ja-ginza==5.2.0
spacy==3.7.6                         # historical bounded comparison candidate; PyPI yanked
SudachiPy==0.6.11
sudachidict_core==20260723          # intended dictionary identity

alternative comparison, not a combined stack:
kwja==2.5.1
```

official PyPIは`spacy==3.7.6`をtransformer model compatibility不備によりyankedと表示する。このversionをadoptせず、P0でreject理由を記録する。別のnon-yanked spaCy versionを比較する場合は新しいpreflight candidateとしてMash scopeへ戻し、silent substitutionしない。

`sudachidict_core==20260723`のofficial distribution artifact、wheel hash、platform installation closureは本design reviewでは採用証拠として確定していない。P0でexact bytesを取得・測定できなければSTOPし、別versionへsilent substitutionしない。上記candidateがdependency / PAS proposalを供給しても、formal complete candidate setまたは251/251 governing authorityを証明したことにはならない。

### 5.2 Required lock material

```text
direct distributions and versions
transitive lock
wheel / model / dictionary filenames
artifact SHA-256
installed semantic resource closure
provider config and split / tokenization mode
Python implementation / version
OS / architecture / libc
license review
installed bytes
cold start
single-process max RSS
representative latency and denominator
runtime network = 0
runtime resource write = 0
user dictionary = 0 unless separately approved
```

root / service requirementsのどちらがactual installer ownerかfresh確認し、推測で両方を変更しない。new Docker / image / buildpack / deployment manifest、vendor wheel、new external serviceは別scopeである。

### 5.3 STOP

次のいずれかでP0 STOP:

- approved platform wheelなし / source build required
- resource identity未固定
- runtime download required
- unapproved dependency / model required
- resource boundary不成立
- provider capabilityがapproved route contractを満たさない
- formal closureをconfidenceで代替する必要がある

### 5.4 L3-I adoption / implementation decision

P0 PASSだけではrepository writeを開始しない。Mashのseparate LEVEL_3判断で次をexact1に固定する。

```text
approved route contract version
approved provider / resolver responsibility
exact direct and transitive dependency versions
wheel / model / dictionary artifact hashes
resource lock bytes
approved Python / OS / architecture boundary
approved peak memory / latency / installed-size result
approved mashos-api changed-path allowlist
approved tests / runner paths
retry / fallback / network / storage effects
I1 terminal and STOP conditions
automatic progression = false
```

P0 evidenceとL3-I approved bytesが一致しない場合はSTOPし、測定していない近似resourceへ置換しない。

## 6. I1 — Emlis actual vertical implementation

### 6.1 Proposed code paths

P0とimplementation LEVEL_3判断で最終allowlistを固定する候補である。current STOP中は作成しない。

```text
ai/services/ai_inference/cocolon_meaning_experience_engine/__init__.py
ai/services/ai_inference/cocolon_meaning_experience_engine/engine.py
ai/services/ai_inference/cocolon_meaning_experience_engine/contracts.py
ai/services/ai_inference/cocolon_meaning_experience_engine/source_kernel.py
ai/services/ai_inference/cocolon_meaning_experience_engine/japanese_structure.py
ai/services/ai_inference/cocolon_meaning_experience_engine/meaning_graph.py
ai/services/ai_inference/cocolon_meaning_experience_engine/artifact_plan.py
ai/services/ai_inference/cocolon_meaning_experience_engine/realization_trace.py
ai/services/ai_inference/cocolon_meaning_experience_engine/trust_pipeline.py
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/__init__.py
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/emlis/__init__.py
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/emlis/source_adapter.py
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/emlis/intent_compiler.py
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/emlis/observation_realizer.py
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/emlis/v1a_entry.py
```

`cores/emlis/v1a_entry.py`は`engine.py`からだけ呼ぶprivate composition helperである。public callableまたはrunner ingressにしない。

conditional approved provider paths:

```text
ai/services/ai_inference/cocolon_meaning_experience_engine/providers/__init__.py
ai/services/ai_inference/cocolon_meaning_experience_engine/providers/<approved_provider>.py
ai/services/ai_inference/cocolon_meaning_experience_engine/resources/japanese_attachment_provider.lock.json
requirements.txt                                            # only if actual owner and approved
ai/services/ai_inference/requirements.txt                    # only if actual owner and approved
```

dynamic plugin discovery、provider registry、自動fallbackを作らない。

### 6.2 Public entry

```python
MeaningExperienceEngine.generate(
    request: GenerationRequest,
) -> EngineOutcome
```

V1-Aでは`core_id=EMLIS_AI`かつ`product_job=OBSERVE_AND_CLARIFY`だけをadmitする。Piece / Analysis requestをempty handlerで受けない。

### 6.3 Proposed tests and runner

```text
ai/tests/test_cmee_v1a_source_envelope.py
ai/tests/test_cmee_v1a_japanese_structure.py
ai/tests/test_cmee_v1a_meaning_graph.py
ai/tests/test_cmee_v1a_emlis_intent.py
ai/tests/test_cmee_v1a_realization_trace.py
ai/tests/test_cmee_v1a_emlis_vertical.py
ai/tests/test_cmee_v1a_negative_mutations.py
ai/tools/cmee_v1a_emlis_candidate_run.py
```

test exact textをproduction meaning ownerにしない。runnerはprivate actual inputをbody-full boundary内で処理し、publicにはbody-free reportだけを書く。

### 6.4 Atomic vertical rule

I1のcompletionはactual Emlis candidateまでである。

```text
source
-> Japanese structure outcome
-> source-bound provisional meaning graph
-> Emlis intent / plan
-> actual observation + bound Reception
-> positive trace
-> EngineOutcome
```

package skeleton、types、schema、provider wrapper、guardだけを個別completionにしない。internal commitは許せるが、orphan foundation-only PRやmergeはしない。

### 6.5 I1 terminal

```text
CMEE_V1A_EMLIS_OBSERVATION_CANDIDATE_READY_DISABLED_NOT_ADMITTED
```

or one cause-specific STOP. production / Cycle credit 0。

## 7. I2 — representative correction

order:

1. representative private cohort exact freeze
2. source / graph / plan / trace machine checks
3. body-full Product Read
4. failure localization to source / syntax / graph / intent / plan / realization / display
5. one bounded correction
6. rebuild / re-read

machine GREEN、Product Read、runtime readinessは別結果である。

named common BLOCKER / MAJORが2 correction cycles連続で減らない場合:

```text
DETOUR_RISK_STOP
```

新checkerやcontrol-planeを足して継続しない。

## 8. C0–C2 — Cycle001

CMEE phaseはCycle navigation ownerではない。fresh applicable `Cocolon_前提資料/08_cycle001_current_state.md`だけがtechnical navigation ownerである。08が指すthree-step planはrestart / evidence bundleであり、同格ownerではない。

### C0 re-entry

separate Mash LEVEL_3で:

- current STOPの原因がapproved routeで解消可能か
- exact Cycle changed paths
- approved Route A / B contract version、denominator、fixture、schemaを無断変更しないこと
- old recovery branchとの関係
- body-free / private evidence boundary

を確認する。automatic re-entry 0。

### C1 ingress cutover

runner / candidate ingressをCMEE exact1へ切り替えるpacketでは:

```text
new CMEE Cycle candidate ingress exact1
old recovery builder direct active ingress 0
dual-run / mirror / fallback 0
approved acceptance-contract version / fixture / denominatorの無断変更 0
```

old codeはunreachable referenceとして残せる。削除は別retirement。

Step1 completion条件は、approved Route A / B acceptance contractに従う。current Route A相当を維持する場合は少なくとも:

```text
required / active meaning authority 251/251
exact predicate range
authoritative lemma / inflection
argument span / case role / governing edge
formal open-slot denominator
scope / provenance
ambiguity 0 / unresolved 0 independently derived
positive realization trace complete
raw replay / fixed response / case-family branch 0
```

### C2 Step2 / Step3

Step1 completion後だけ開始する。

- current100 machine and product read convergence
- fresh exact100
- all100 body-full Product Read
- repair / rebuild / re-read
- final acceptance decision

V1-A candidate readyをStep1またはCycle acceptanceへ換算しない。

## 9. E0–E1 — Emlis production / question

### E0 production cutover

separate approval required:

- `emlis_ai_reply_service.py` remains orchestration owner or is explicitly migrated
- internal generation call exact1 to CMEE
- old direct generation ingress 0 in same packet
- API response / public meta / RN visible label identity protected
- `EngineOutcome` exact6からcurrent `ReplyEnvelope` / public feedback meta / RN passed-only displayへのversioned mapping exact1
- eligible safe inputがsilent emptyになるmapping 0。成立しなければ`NO_SAFE_EMLIS_PRODUCTION_CUTOVER_STOP`
- response / public-meta / display protected tests GREEN
- dual generation / fallback 0
- rollback is deploy / git revert to the last admitted single-owner version, not a runtime feature fallback
- runtime safe-disableはReplyEnvelope / public behavior、owner exact1、dual-run / fallback 0を別承認するまで未採用
- actual-device proof

E0ではObservationのNORMAL / LIMITED production routeだけをadmitする。V1-A offlineで検証した`QUESTION_PENDING`、PRE_QUESTION、caller-supplied supplemental refinementを、そのままinteractive productionへ昇格しない。ASK相当はapproved mappingでLIMITED observationへ閉じ、question-only / silent empty / temporary persistenceを作らない。

E0 completion state:

```text
CMEE_V1A_EMLIS_OBSERVATION_PRODUCTION_OPERATIONAL
```

### E1 question / refinement

observation production proof後の別design / implementation packet。

- PRE_QUESTION observation + bound Reception first
- clarification exact1
- skip / unknown allowed
- answer is supplemental source
- original immutable
- refined artifact new version / same lifecycle lineage
- API / DB / RN / persistence owner separately fixed

## 10. P1 — Piece V1-C implementation order

entry条件はEmlis V1-A / Cycle001 proofとV1-B Emlis Questionのoperational proof、fresh Piece owner確認、separate Mash activation approvalである。PieceをV1-Bより前へ自動前倒ししない。

1. PCE current actual and CMEE path fit-gap; causal RED.
2. disabled vertical: saved source -> `PieceArtifactSpec`.
3. storage / RLS / quota contracts.
4. preview service calls CMEE exact1.
5. visual recipe / layout / renderer / history / actual-device.
6. old Q&A reachability 0、explicit `UNAVAILABLE`、record / quota 0、single ownerを持つ`PIECE_V2_SAFE_UNAVAILABLE_ROLLBACK_TARGET`を別Mash判断でpre-admitする。成立しなければ`NO_SAFE_PIECE_V1C_FIRST_CUTOVER_STOP`。
7. staging E2E / Nexus / clean cutover.
8. Product Read and operational decision.

V1-C activation packet:

```text
new Piece generation owner exact1
old Q&A generation / preview / Nexus reachability 0
old Q&A fallback / coexistence 0
preview-save-card-export identity exact
first-cutover rollback target exact1
```

初回activation後のrollbackはpre-admitted targetへdeploy / git revertし、旧Q&Aを復活させない。generic runtime flagやdual-runをrollbackへしない。unimplemented PCE generation pathsとCMEE equivalentを並列に作らない。PCE work-package indexをsame packetでreconcileする。

## 11. A1–A2 — Analysis implementation order

### A1 observed route

entry条件はV1-C Piece operational proof、fresh Analysis owner確認、separate Mash activation approvalである。V1-CとV1-Dを選択式または並列実装にしない。

1. current v1 output and failure behavior pin
2. source-set / claim / route causal RED
3. disabled source -> event frame -> observed route vertical
4. annotation / unknown / conflict / period comparison
5. text / visual projection and stored identity
6. API / report / RN version dispatch code-disabled connection
7. staging / Product Read / actual-device
8. one-owner activation

active requestでCMEE失敗時、current fixed `watashi.map.v1`へsilent fallbackしない。historical v1 artifactはv1 rendererでreadできる。

### A2 IF route

V1-D operational後に自動停止し、別Mash判断でのみ開始する。

- simulation-session source
- separate hypothetical graph
- one `IfScenarioCandidateSet` with scenario exact1–3 parallel, same base map / route
- no best / score / probability
- stable display order only; it is not ranking
- `ANALYSIS_SAVE_ROUTE_INTENT` operation: user selection source exact1、scenario setはderived parent
- `watashi.if-route-set.v1` / `watashi.saved-route-intent.v1` separate immutable storage
- IF / Saved distinct safe projection / API / RN read policy
- observed `watashi.map.v2`へのinline mutation / per-request v1 fallback 0
- Product Read / safety proof

IFをobserved report payloadへ混ぜない。storage / RLS / payload size / latency / retention / accessをpreflightし、安全なseparate ownerを固定できなければ`NO_SAFE_ANALYSIS_V1E_STORAGE_STOP`で停止する。

## 12. X1 — shared contract formalization

Phase 0では三商品のjob、artifact identity、minimum discriminated envelope、core ownership境界だけを先に固定する。

Emlis-only implementation detailをshared final APIへしない。第2 actual consumerで一致した次の責任だけをsharedへ昇格する。

- source identity / role / commitment
- evidence / epistemic state
- semantic duty plan
- artifact identity
- positive trace
- common outcome semantics

Piece visual recipe / publicization / quota、Analysis period / observed edge / IF graph、Emlis Reception / question needはcore ownerに残す。

## 13. Existing asset disposition

| Asset family | Disposition |
|---|---|
| current Emlis source / evidence / safety contracts | `KEEP_OR_ADAPT` |
| current `cocolon_text_generation_core` guards | `KEEP_BEHIND_ADAPTER` |
| current core adapters that accept supplied candidates | `TEST_VECTOR_OR_GUARD_ADAPTER` |
| PR #2 semantic / relation / mutation knowledge | `EXTRACT_CONCEPT_OR_TEST_VECTOR` |
| PR #2 large recovery / surface modules | `DO_NOT_WRAP_AS_CMEE` |
| direct recovery ingress | `RETIRE_ACTIVE_AT_CYCLE_CUTOVER` |
| Piece V2 pure contract | `KEEP_CORE_OWNER` |
| old Piece Q&A generator / display | `RETIRE_ACTIVE_AT_CLEAN_CUTOVER` |
| current Watashi Map v1 artifact / renderer | `HISTORICAL_READ_COMPATIBILITY` |
| current fixed/generic map generation | `RETIRE_ACTIVE_AT_V1D_CUTOVER` |
| G0–G10 checker / control / transport families | `HISTORICAL_OR_OPTIONAL_CAPSULE` |

旧assetは能力・contract・test知識を回収し、route結合やproof-of-proofを再稼働しない。

## 14. Verification matrix

### Shared

- raw UTF-8 hash / scalar-byte offset
- emoji / composed Unicode / CRLF / full-width whitespace
- source correction immutability
- cross-request / cross-core source swap
- provider resource identity / no runtime network
- ambiguity / unresolved self-claim rejection
- graph evidence ref resolution
- candidate priority inversion
- added meaning / polarity / unknown / scope mutation
- positive trace completeness
- private / body-free separation
- legacy fallback non-reachability
- concurrency / cold start / memory / latency

### Emlis

- predicate / argument / case / governor
- topical `は`、coordination、quotation、relative clause
- passive / causative / negation / modality / time
- omitted argument / zero anaphora / open-slot denominator
- Observation / Reception binding
- question decision semantic-source rejection
- supplemental answer does not overwrite original

### Piece

- saved source exact1
- must-keep / no-added-claim
- publicization without meaning erasure
- format eligibility exact3
- exact UTF-8 text / recipe / version identity
- no clip / ellipsis
- visibility / quota / external-share boundaries
- old Q&A unreachable

### Analysis

- period source-set identity
- observed claim / edge evidence exact
- cooccurrence does not become order / cause
- partial route valid
- annotation / unknown / conflict separation
- observed / hypothetical / saved separation
- scenario not ranked
- text / graph / latest / history identity
- no silent v1 fallback

Machine PASS、human Product Read、actual-device、runtime readiness、Cycle acceptanceは別recordである。

## 15. Documentation update obligation

product purpose、active owner、E2E flow、file family、schema owner、artifact identity、API / DB / RN boundary、phase stateが変わるpacketは、affected current structure mapとCMEE detail ownerをsame packetで更新する。

internal logicだけでarchitecture role不変ならmapをchurnせず、PR説明へ`STRUCTURE_MAP_DELTA_NONE`を書く。

新しいphaseごとにcurrent map、manifest、Receipt、Gateを増やさない。current map exact1 per system、Git history、必要なdesign ownerを使う。

## 16. Final state separation

```text
CMEE_DETAILED_DESIGN_DRAFT_PR_REMOTE_VERIFIED_NOT_CURRENT
CMEE_DETAILED_DESIGN_CURRENT_OWNER_MERGED
NO_SAFE_CMEE_V1A_CANDIDATE_STOP
CMEE_L3R_ROUTE_B_SELECTED_BOUNDED_PREFLIGHT_NOT_AUTHORIZED_STOP
CMEE_V1A_EMLIS_OBSERVATION_CANDIDATE_READY_DISABLED_NOT_ADMITTED
CMEE_V1A_CYCLE001_PROVEN
CMEE_V1A_EMLIS_OBSERVATION_PRODUCTION_OPERATIONAL
CMEE_V1B_EMLIS_QUESTION_OPERATIONAL
CMEE_V1C_PIECE_VISUAL_OPERATIONAL
CMEE_V1D_ANALYSIS_OBSERVED_ROUTE_OPERATIONAL
CMEE_V1E_ANALYSIS_IF_ROUTE_OPERATIONAL
CMEE_V1_THREE_CORE_OPERATIONAL
```

本turnのpublication targetは、同じDraft PR上の`CMEE_L3R_ROUTE_B_SELECTED_BOUNDED_PREFLIGHT_NOT_AUTHORIZED_STOP`である。D0 publicationとRoute B selectionがremote publishされてもcurrent owner、P0 authorization、implementation admissionにはならず、merge後のfresh verificationでだけ`CMEE_DETAILED_DESIGN_CURRENT_OWNER_MERGED`になり得る。

各stateは別であり、前のstateを次へ自動変換しない。
