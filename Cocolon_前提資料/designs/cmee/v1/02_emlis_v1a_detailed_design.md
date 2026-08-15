# CMEE V1-A — EmlisAI Observation Vertical 詳細設計

- document id: `cocolon.cmee.v1a.emlis_observation.detailed_design`
- lifecycle: `DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE`
- runtime state: `NOT_IMPLEMENTED`
- production admission: `false`
- Cycle001 effect: `0`

---

## 0. Product result

V1-Aが作るものはframeworkではなく、actual current inputから生成される一つの`ConversationalObservation` candidateである。

```text
current input
-> source-bound provisional meaning
-> Observation duty
-> bound Human Reception duty
-> natural Japanese realization
-> positive trace
-> disabled candidate bundle
```

問いsystem全体、production cutover、Cycle001 acceptanceはV1-A completionに含めない。V1-A offline runnerはRoute Bを検証できるよう、typed clarification candidateと、callerが別SourceEnvelopeとして供給したsupplemental answerからREFINED candidateを作るcontractまで持てる。ただしAPI / DB / RN / persistence、interactive session、user-visible question lifecycle、production question routeはexact0であり、V1-Bだけがそれをoperational化する。

## 1. Core request

```text
EmlisObservationRequest
  request_id
  subject_ref_private
  current_input_ref
  owned_history_refs[]
  observation_stage
  supplemental_answer_ref?
  capability_snapshot
  locale = ja-JP
  requested_depth
  policy_version
```

`subject_ref_private`とsource bodyはpublic serializationしない。

`current_input_ref` / `owned_history_refs` / `supplemental_answer_ref`は同じruntime `GenerationRequest.source_inputs_private`内のIDへだけ解決する。global lookupまたはpublic body-free metadataからraw bodyを取得しない。

source role:

| Material | Role | Meaning source |
|---|---|---|
| current thought / action / emotions / categories | `ORIGINAL_INPUT` | yes |
| eligible owned history | `OWNED_HISTORY_RECORD` | eligibility成立時だけ |
| question need decision | control lineage | no |
| question text | artifact | no |
| user answer | `SUPPLEMENTAL_ANSWER` | refined deltaだけ |
| separate safety output | separate owner artifact | Emlis observationへ自動混入しない |

## 2. Stage, sufficiency, artifact separation

```text
observation_stage:
  NORMAL | PRE_QUESTION | REFINED

sufficiency_decision:
  SUFFICIENT | LIMITED | ASK

routing_disposition:
  OBSERVATION | SEPARATE_SAFETY | UNAVAILABLE

artifact_kind:
  OBSERVATION_SURFACE | CLARIFICATION_REQUEST | OPTIONAL_CONTINUITY_LINE
```

Human Receptionはstageではない。visible observation artifact内のrequired dutyである。

Question rule:

- `ASK`でも先にpre-question observation + bound receptionを出す。
- questionは不足している一点だけを対象にする。
- skip / このまま観測 / 分からないを許す。
- answerがなくてもlimited observationは有効である。
- answerはoriginalを置換せず、refined graph deltaへ追加する。
- question decision、question option、skip decisionをsemantic sourceへしない。

V1-A/I1–I2およびCycle offlineで`QUESTION_PENDING`を検証する場合、runnerはPRE_QUESTION observation + bound Reception + typed clarificationを同じprivate packetで扱う。answerはtest textやquestion decisionから作らず、caller-supplied `SUPPLEMENTAL_ANSWER` SourceEnvelopeだけをREFINED graph deltaへbindする。E0 production cutoverではV1-B前のinteractive questionを有効化せず、ASK相当は承認済みresponse mappingに従うLIMITED observationへ閉じる。question-only response、silent empty、temporary DB sessionは0である。

## 3. Proposed V1-A module topology

Mashの`L3-R` route / bounded preflight authorization、`P0` measured PASS、separate `L3-I` exact provider / dependency / resource / changed-path / I1 approvalの三境界が順に成立した後だけ、最初のimplementation packetでactual observation verticalと同時にmaterializeする候補を示す。`L3-R`だけでI1へ進めず、current STOP中は作成しない。

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

これはpost-decision change-path proposalであり、本設計mergeでfile作成を承認しない。approved route / provider / dependency pathを加えたterminal exact allowlistはimplementation LEVEL_3判断で固定する。

`v1a_entry.py`は`engine.py`からだけ呼ばれるprivate composition helperであり、public import、runner direct ingress、第二generation ownerではない。runnerは`MeaningExperienceEngine.generate()`だけを呼ぶ。

Piece / Analysis subpackageはV1-A packetで作らない。

## 4. Source adapter

`cores/emlis/source_adapter.py`はcurrent input contractをnew SourceEnvelopeへ変換する。

minimum duties:

- thought / action / emotion / category / explicit absenceを別source field evidenceとして保持
- scalar / UTF-8 rangeをsource bodyに対して検証
- owner、version、stage、privacyを固定
- eligible historyだけを別source envelopeへ追加
- answerはsupplemental envelope exact1としてoriginalと併存
- body-free commitmentを生成

禁止:

- input textの要約をsourceにする
- emotion / categoryを原因・性格へ変換
- question need decisionをevidence nodeへする
- answerでoriginal fieldを上書き

## 5. Japanese syntax and owner witness

providerは各required / active `meaning_owner_id`に対して次を返す。authenticated user owner IDと同じfield名を使わない。

```text
exact source range
token ranges
predicate candidates
lemma / inflection candidates
argument span candidates
case role / governing predicate edge candidates
formal open-slot classification candidates
scope / provenance
resolution and reason codes
```

V1-A runtime policy:

| Resolution | Normal observation use |
|---|---|
| `UNIQUE` | 必要条件にすぎない。matching `JapaneseAttachmentAdmission`がapproved route contract下で当該owner / witnessをadmitした場合だけrequired dutyへ使用可能 |
| `AMBIGUOUS` | current Route A contractではimplementation STOP。Route B承認後だけ、ambiguityに依存しないlimited claimまたはASK |
| `UNRESOLVED` | current Route A contractではimplementation STOP。Route B承認後だけ、unresolved部分を言い切らずlimited / unavailable / separate safety |

parserのone-bestだけで`UNIQUE`にしない。user clarificationはmeaning choiceを追加できるが、parserの過去outputをretroactive truthへしない。

independent admission closure:

| Status | Visible authority |
|---|---|
| `FORMAL_CLOSED` | independent assessorがcurrent formal contractを全条件で満たすmatching setとしてsealした場合だけ |
| `PROVISIONAL_ONLY` | current contractではvisible disputed claimへ使用不可 |
| `UNRESOLVED` | visible candidateなし |
| `UNAVAILABLE` | meaning payloadなし |

providerのcandidate-local `UNIQUE`またはempty ambiguity listはadmissionではない。attachment set ID / digest、source version、resource lock、approved contract、formal denominator、independent mutation evidenceが一致しなければvisible dutyへ使用しない。

official候補のcurrent comparisonでは`FORMAL_CLOSED`を成立させるconcrete providerが確認できていない。このためcurrent implementation admissionは`NO_SAFE_CMEE_V1A_CANDIDATE_STOP`である。

## 6. `EmlisMeaningGraph` extension

shared graphへ次のcore-owned attributesを追加する。

```text
observation_role:
  CURRENT_STATE | RELATION | CHANGE | INTENTION | CONSTRAINT |
  UNKNOWN | CONTINUITY_CANDIDATE

retention:
  REQUIRED | OPTIONAL | DEFERRED

reception_eligibility:
  BOUND_REQUIRED | NOT_ELIGIBLE

self_denial_boundary:
  NONE | PRESENT_NOT_ADOPTABLE
```

graphにpersonality、hidden cause、diagnosis、future guaranteeを追加しない。

## 7. Sufficiency decision

decision inputs:

- required dutyのgrounded coverage
- ambiguity / unresolvedがvisible claimへ与える影響
- original inputだけで安全に言えるobservation value
- questionのexpected information gain
- user burden / high-care adjacency
- answerなしでも返せるlimited observation

decision:

```text
SUFFICIENT
  required observation dutiesをsource-boundに実現できる。

LIMITED
  meaningful limited observationはできるが、欠落を埋めない。

ASK
  一点の回答がvisible observationをmaterialに深め、負担に比例する。

SEPARATE_SAFETY
  Emlis observation内で安全に扱わずseparate ownerへ渡す。
```

自然さ不足、template不足、generatorの弱さを`ASK`で隠さない。

## 8. Observation duties

minimum duties:

```text
OBSERVE_PRIMARY_MEANING
OBSERVE_RELATION_OR_CHANGE_IF_GROUNDED
PRESERVE_UNKNOWN
PRESERVE_POLARITY_MODALITY_TIME
BOUND_HUMAN_RECEPTION
AVOID_FALSE_COMPLETION
OPTIONAL_CONTINUITY_IF_ELIGIBLE
```

`BOUND_HUMAN_RECEPTION`:

- exact Observation claim refを一つ以上持つ。
- Observationの同義反復にしない。
- generic sympathy、fixed closing、万能肯定を使わない。
- unsupported advice、cause、intent、futureを追加しない。

## 9. `ConversationalObservationPayload` and outer bundle

```text
ConversationalObservationPayload
  observation_stage
  sufficiency_decision
  observation_blocks[]
  reception_block

GenerationArtifactBundle<ConversationalObservationPayload>
  artifact_id / artifact_version / artifact_kind
  source_commitments[]
  semantic_graph_ref
  experience_plan_ref
  primary_artifact = ConversationalObservationPayload
  companion_artifacts[]             # optional continuity projection等
  realization_trace_ref
  quality_report_ref
  lifecycle_bindings
```

product上の`ConversationalObservation`はこのbundle specializationの呼称である。`clarification_request`は`ASK`かつPRE_QUESTIONのouter `EngineOutcome`がtyped fieldとして持ち、primary payloadへ重複格納しない。Emlis `QUESTION_PENDING`ではpre-question observation bundleを必須とし、question-only outcomeを禁止する。

## 10. Text realization

Realizer inputはsource bodyではなくExperiencePlanとmeaning refsである。

allowed operations:

- predicate / argumentを保ったclause realization
- pronoun / topic省略のauthority-bound adjustment
- sentence split / join
- connective selection
- polarity / modality / tense inflection
- repetition reduction
- plan-approved concise realization

forbidden:

- source clause exact replay as observation body
- whole nominal append
- raw summary append
- fixed family response
- case ID / expected text branch
- owner ID / ordinal surface
- unknown completion

surface variationはmeaning dutyを変えない範囲に限定する。

## 11. Trust checks

Machine checks:

1. source legitimacy exact
2. required meaning duty coverage
3. predicate / argument witness status exact
4. relation / polarity / modality / time preserved
5. unknown / self-denial boundary preserved
6. Reception bound to visible observation claim
7. unsupported claim 0
8. forbidden replay / append / fixed route 0
9. positive trace complete
10. public body-free projection contains no source / output body

Machineはread-feeling、自然さ、非template、また入力したさをPASS判定しない。

## 12. Failure dispositions

| Failure | Disposition |
|---|---|
| source role / version invalid | `REJECTED` |
| provider identity mismatch | `UNAVAILABLE` and no fallback |
| material attachment ambiguity | current Route AではSTOP。Route B承認後だけ`LIMITED` or `ASK`, never guessed |
| no meaningful grounded claim | `UNAVAILABLE` |
| high-care adjacency | `SEPARATE_SAFETY` |
| candidate hard-invalid | reject candidate; valid candidate 0なら`UNAVAILABLE` |
| trace incomplete | `UNAVAILABLE` |

`UNAVAILABLE`時にlegacy body、fixed empathy、raw input replayを返さない。

## 13. Test architecture

Proposed test files:

```text
ai/tests/test_cmee_v1a_source_envelope.py
ai/tests/test_cmee_v1a_japanese_structure.py
ai/tests/test_cmee_v1a_meaning_graph.py
ai/tests/test_cmee_v1a_emlis_intent.py
ai/tests/test_cmee_v1a_realization_trace.py
ai/tests/test_cmee_v1a_emlis_vertical.py
ai/tests/test_cmee_v1a_negative_mutations.py
```

Negative mutations:

- predicate range / lemma / inflection
- argument span / case role / governing edge
- relation direction
- polarity / modality / temporal scope
- unknown -> known
- question decision -> semantic source
- answer overwrites original
- Reception unbound / generic
- source clause injection
- plan duty drop / duplicate
- trace coordinated rehash
- cross-request source swap

test helperをproduction authorityにしない。expected final text exact matchをquality oracleにしない。

## 14. Candidate runner and evidence

Cycle runnerを直接書き換える前に、disabled V1-A candidate用のsingle ingressを持つ。

```text
ai/tools/cmee_v1a_emlis_candidate_run.py
```

このtoolはproduction APIではない。actual private input setをbody-full boundary内で読み、body-free metricsとProduct Read packetを作る。

minimum metrics:

- source legitimacy count
- unique / ambiguous / unresolved owner count
- required duty coverage
- replay / unsupported claim / trace failure counts
- disposition counts
- provider / schema / policy identities

raw bodyをGitHubへ保存しない。

## 15. Cutover and current route

### Disabled candidate stage

- production `emlis_ai_reply_service.py` unchanged
- NLS Step10 public routing unchanged / disabled
- CMEE candidate callable reachable only from approved candidate runner
- Piece / Analysis effect 0

### Cycle re-entry

別Mash判断後、fresh applicable `08_cycle001_current_state.md`だけをtechnical navigation ownerとして従う。08が指すactive planはrestart / evidence bundleであり、同格のnavigation ownerではない。CMEE設計もCycle navigation ownerではない。

current Route A formal contractを維持する場合、Step1 completionは少なくとも次を必要とする。

```text
owner-bound authority 251/251
exact predicate range
authoritative lemma / inflection
argument span / case role / governing edge
formal open-slot denominator established
scope / provenance exact
ambiguity 0 / unresolved 0 independently derived
forbidden replay / append 0
relation / unknown / self-denial / lifecycle preserved
```

Route Bが承認された場合、Step1 completionは承認後に改訂されたacceptance contractとfresh `08`を参照する。このdetail suiteだけで251 denominator、visible claim authority、Cycle acceptanceを緩和しない。

### Production cutover

Cycle001 acceptance後に別判断する。

- new Emlis generation owner exact1
- old direct owner unreachable in same packet
- fallback / dual-run 0
- `EngineOutcome` exact6からcurrent `ReplyEnvelope`、public feedback meta、RN passed-only displayへのversioned mapping exact1
- current response/public-meta/display protected tests GREEN
- eligible safe inputがsilent empty responseになるmappingは`NO_SAFE_EMLIS_PRODUCTION_CUTOVER_STOP`
- existing API response and RN display contract unchanged unless separately approved
- rollbackはdeploy / git revertでlast admitted single-owner versionへ戻す。runtime safe-disableは、ReplyEnvelope / public behavior、owner exact1、dual-run / fallback 0を別承認するまで未採用

## 16. V1-A completion

```text
CMEE_V1A_EMLIS_OBSERVATION_CANDIDATE_READY_DISABLED_NOT_ADMITTED
```

成立条件:

- representative actual inputsでcandidateが生成される。
- source -> meaning -> plan -> surface -> traceが連続する。
- bound Receptionが成立する。
- independent mutation tests GREEN。
- body-full Product Read packetを作れる。
- production / Piece / Analysis effect 0。

このstateをCycle proof、production admission、Emlis question completionへ変換しない。

currentではprovider / acceptance-contract decisionが未承認なため、このstateへの実装を開始しない。CMEE implementation prerequisiteは、`06_implementation_order_migration_and_verification.md`の`L3-R` Route A / B判断、`P0` measured PASS、separate `L3-I` exact adoption / I1 allowlist approvalの全てである。

Cycle001のcurrent first unfinished gateはfresh applicable `08`が示す`FORMAL_OWNER_BOUND_LEXICAL_OBSERVATION_WITNESS_AUTHORITY_251_OF_251`であり、現時点のauthorized next product workは0である。CMEE prerequisiteをCycleのnavigation stateへ読み替えない。

Cycle proof後もproduction operationalとは限らない。separate E0 approval、current `ReplyEnvelope` / passed-only display mapping、protected tests、actual-device proof、single-owner cutoverを通過した時だけ次のstateを宣言できる。

```text
CMEE_V1A_EMLIS_OBSERVATION_PRODUCTION_OPERATIONAL
```

このstateもV1-B question operationalを含まない。
