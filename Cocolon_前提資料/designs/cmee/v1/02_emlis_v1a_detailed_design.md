# CMEE V1-A — EmlisAI Observation Vertical 詳細設計

- document id: `cocolon.cmee.v1a.emlis_observation.detailed_design`
- revision date: `2026-08-21 JST`
- lifecycle: `DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE`
- runtime state: `DRAFT_WIP_DISABLED_PRODUCT_FAIL`
- implementation evidence owner: `MassyuRed/mashos-api Draft PR #3 @ 06ce311b3ea728b06f83439d268a34bed917c01c`
- R1–R4 state: `CLOSED_GREEN`
- original exact8 machine structural state: `8/8`
- private human Product Read: `EVALUATED_FAIL_STOP`
- candidate ready: `false`
- production admission: `false`
- Cycle001 effect: `0`
- L3-R route selection: `ROUTE_B_PROVISIONAL_ATTACHMENT_WITH_USER_SOVEREIGN_RESOLUTION`
- Phase 0 / P0 / P0-R1 / standalone product-delta-0 L3-R / L3-I lifecycle: `RETIRED_HISTORICAL_NONREUSABLE`
- current implementation rule: `PRODUCT_QUALITY_DELTA_GT_0_AND_MASH_CONFIRMED_ONLY`
- Step 10 integrated revision: `CMEE_STEP10_ULTRA_FINAL_INTEGRATED_REVISION_PROPOSAL_20260821_V2_REFLECTED`

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

問いsystem全体、production cutover、Cycle001 acceptanceはV1-A completionに含めない。V1-A offline runnerはRoute Bを検証できるよう、typed clarification candidateと、callerが別SourceEnvelopeとして供給したsupplemental answerからREFINED candidateを作るcontractまで持てる。ただしAPI / DB / RN / persistence、interactive session、user-visible question lifecycle、production question routeはexact0であり、後述§18のVertical 2だけがそれをoperational化する。V1-Aは§18のVertical 1、つまり全plan共通のLayer 1／2品質を担当する。

### 0.1 Current actual before baseline — body-free

[mashos-api Draft PR #3](https://github.com/MassyuRed/mashos-api/pull/3)には、CMEE package source exact5、
tests exact2、candidate runner exact1および`MeaningExperienceEngine.generate()`によるoffline disabled verticalが
実在する。head `06ce311b3ea728b06f83439d268a34bed917c01c`でR1〜R4は`CLOSED_GREEN`、original exact8は
machine structural 8/8である。一方、private human Product Readは`EVALUATED_FAIL_STOP`、candidate ready false、
Route B complete false、Product / full-I1 / Cycle001 / production credit 0、`automatic_progression=false`である。

従って、これは未実装ではなく、商品品質に到達しなかった`DRAFT_WIP_DISABLED`のcurrent before baselineである。
body-full input / candidateは本designへ転記しない。correctionは未承認であり、authorized next workは0である。

### 0.2 絶対実装規則と許され得るnext implementation class

本設計は、parent final design
[`§0.3 三大中核構造及びCMEE実装作業の絶対定義`](../Cocolon_MeaningExperienceEngine_V1_FinalTechnicalDesign_ProReviewApplied_20260815.md#03-三大中核構造及びcmee実装作業の絶対定義)
とsuite [Read First §0.1](00_read_first.md#01-絶対実装規則へのbinding)に従う。「三大中核構造及びCMEEの実装作業」は、三大中核構造及びCMEEの商品品質を1％でも向上させる作業だけである。それ以外は作業とも成果とも扱わず、開始しない。

Phase 0 / P0 / P0-R1とstandalone product-quality delta 0のL3-R / L3-Iは
`RETIRED_HISTORICAL_NONREUSABLE`である。後続のP0 / L3-I prerequisite、alternate executor、別provider / model、rename、
類似preflight、再承認またはsuccessor routeはcurrent authorityを持たない。Route Bのmeaning sovereignty、unknown、
no-promotionとsource-explicit groundingのproduct contractだけを、以下のcurrent implementation unit内で保持する。

別のMash明示承認後に許され得るnext implementation classはone bounded actual Emlis artifact quality improvement unit exact1だけである。開始時に、
unchanged input / fixture、current actual before artifact、改善対象の`E-OBS-01..10` exact1以上、変更する
product-causal source、同一unitで生成するafter artifactを固定する。framework、source locator、binding、guard、trace、
proof、test、runnerまたはprovider取得だけを先行stageにせず、actual Observation / Reception artifactの改善まで
同一unitで完了する。

同unitの末尾で華恋はbody-full private boundary内の全candidate本文を読み、復唱・近い言い換え・meaning label置換・
少数template・generic Reception・集合反復・深さ不足をpre-screenする。一つでも残る間はMashへ見せず、
同unit内で商品本文の共通原因を修正する。明白な低品質がなく、商品artifactの設計・実装・読みの厳密さが
過去の補助経路へ投じた厳密さを少なくとも上回った後だけ、actual before / after / resultをMashへprivateに提示する。

商品品質向上のproofはactual product resultとMashの明示確認だけである。machine GREEN、structural一致、trace、
guard、hash、test、華恋またはsubagentの自己採点はproofではない。Mash確認前はcandidateであり、成果または
product creditとして確定しない。この運用のためのnew Gate、checker、score、Receipt、authority familyまたはproof systemを作らない。

この絶対規則の理由となった事実記録:
[EmlisAI商品中核の後回しとCMEE Product Read失敗](../../../audits/emlis_ai/Cocolon_EmlisAI_ProductNeglect_and_CMEE_ProductReadFailure_20260816.md)。

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
  LAYER_1 | LAYER_2 | CLARIFICATION_REQUEST | LAYER_3_HISTORY_CONTINUITY
```

Human Receptionはstageではない。Layer 2として、Layer 1のvisible observation claimへbindするderived artifactである。

Question rule:

- `ASK`でも先にpre-question observation + bound receptionを出す。
- questionは不足している一点だけを対象にする。
- skip / このまま観測 / 分からないを許す。
- answerがなくてもlimited observationは有効である。
- answerはoriginalを置換せず、refined graph deltaへ追加する。
- question decision、question option、skip decisionをsemantic sourceへしない。

V1-A/I1–I2およびCycle offlineで`QUESTION_PENDING`を検証する場合、runnerはPRE_QUESTION observation + bound Reception + typed clarificationを同じprivate packetで扱う。answerはtest textやquestion decisionから作らず、caller-supplied `SUPPLEMENTAL_ANSWER` SourceEnvelopeだけをREFINED graph deltaへbindする。E0 production cutoverではV1-B前のinteractive questionを有効化せず、ASK相当は承認済みresponse mappingに従うLIMITED observationへ閉じる。question-only response、silent empty、temporary DB sessionは0である。

## 3. Proposed V1-A module topology

Mashの`L3-R` route / bounded preflight authorizationがapproved body v1.0.0で成立したこと、P0がterminalとなったことはhistorical factsとして保持する。P0 measured PASSやseparate L3-Iをcurrent prerequisiteにせず、以下のmodule候補は§0.2のactual Emlis artifact品質改善unit exact1でactual Observation verticalと同時にmaterializeする場合だけ扱う。module、provider、dependency、testまたはrunnerだけを先行しない。

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

これはproduct-quality implementationのchanged-path候補であり、本設計mergeでfile作成を承認しない。actual before / after artifact改善まで到達する同一bounded unitのexact allowlistとしてだけ固定し、product-quality delta 0の別allowlist decisionを挿入しない。

`v1a_entry.py`は`engine.py`からだけ呼ばれるprivate composition helperであり、public import、runner direct ingress、第二generation ownerではない。runnerは`MeaningExperienceEngine.generate()`だけを呼ぶ。

Piece / Analysis subpackageはV1-A packetで作らない。

## 4. Source adapter

`cores/emlis/source_adapter.py`はcurrent input contractをnew SourceEnvelopeへ変換する。

minimum duties:

- thought / action / emotion / category / explicit absenceを別source field evidenceとして保持
- scalar / UTF-8 rangeをsource bodyに対して検証
- owner、version、stage、privacyを固定
- eligible historyだけを別source envelopeへ追加
- answerはroundごとのsupplemental envelope exact1としてoriginalと併存し、thread全体ではplan budget内の1..3を順序付きで保持
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
| `AMBIGUOUS` | approved Route B knowledgeと§18 current plan contractではambiguityに依存しないmeaningful limited claim、または各round target exact1のsemantic clarificationだけを候補化できる。thread budgetはFree／Plus 0..1、Premium sequential 0..3。同一product-quality improvement unit内のconstraintであり、別Gateにしない |
| `UNRESOLVED` | unresolved部分を言い切らず、limited／plan-budget内の一round一問／unavailable／separate safetyだけを候補化できる。同一product-quality improvement unit内のconstraintであり、別Gateにしない |

parserのone-bestだけで`UNIQUE`にしない。user clarificationはmeaning choiceを追加できるが、parserの過去outputをretroactive truthへしない。

independent admission closure:

| Status | Visible authority |
|---|---|
| `FORMAL_CLOSED` | independent assessorがcurrent formal contractを全条件で満たすmatching setとしてsealした場合だけ |
| `PROVISIONAL_ONLY` | Route B選択後も単独ではvisible authorityにならない。source-explicitまたはtarget exact1のuser-owned supplemental evidenceに独立してgroundできないdisputed claimへ使用不可 |
| `UNRESOLVED` | visible candidateなし |
| `UNAVAILABLE` | meaning payloadなし |

providerのcandidate-local `UNIQUE`またはempty ambiguity listはadmissionではない。attachment set ID / digest、source version、resource lock、approved contract、formal denominator、independent mutation evidenceが一致しなければvisible dutyへ使用しない。

official候補のcurrent comparisonでは`FORMAL_CLOSED`を成立させるconcrete providerが確認できていない。Route Bのper-owner disposition、provisional graph隔離、one-clarification lifecycleを含むexact acceptance contractとbounded preflightがapproved body v1.0.0へ固定されたこと、P0 evidence / L3-Iが成立しなかったことはhistorical factsとして保持する。P0 / L3-Iはcurrent admission prerequisiteではない。provider outputはRoute B product contractに従い、§0.2の同一unit内で得るactual artifactの商品品質でだけ判断する。

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
| material attachment ambiguity | meaningful ambiguity-independent `LIMITED`、§18 plan budget内で各round target unknown exact1のclarification、または`UNAVAILABLE`; never guessed。standalone P0 / L3-Iは作らず、同一product-quality improvement unit内で保持 |
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

## 14. Private body-full execution inside the same product-quality unit

既存の最短private execution surfaceでactual before / after artifactを得る。下記toolが必要な場合も、§0.2の同一product-quality improvement unit内でafter artifact生成と華恋body-full pre-screenまで完了する時だけ作る。runner単体の実装・GREEN・証拠化をworkまたは成果にしない。

```text
ai/tools/cmee_v1a_emlis_candidate_run.py
```

このtoolはproduction APIではない。actual private input setをbody-full boundary内で読み、before / after product artifactと華恋pre-screen用private surfaceを作る。body-free metricsはprivacy確認に必要な既存範囲に限り、quality scoreまたは新Gateにしない。

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

非選択のRoute A formal contractはcurrent workへ採用しない。以下は2026-08-15設計時のhistorical acceptance evidenceとして保持し、alternate provider / preflight / reapproval routeに使わない。

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

Route B directionは選択済みだが、Cycle001のStep1 contract変更は未承認である。適用にはseparate C0とfresh `08`判断を必要とし、このdetail suiteまたはL3-R selection receiptだけで251 denominator、visible claim authority、P1–P7、Cycle acceptanceを緩和しない。

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
- unchanged input / fixtureに対するbefore / after actual artifactで`E-OBS-01..10` exact1以上の非0改善が本文に現れる。
- source -> meaning -> plan -> surface -> traceが連続する。
- bound Receptionが成立する。
- independent mutation tests GREEN。
- 華恋がbody-full private boundary内で全candidateを読み、復唱、meaning label置換、少数template、generic Reception、集合反復、深さ不足がexact0である。
- 商品artifactの設計・実装・読みの厳密さが、過去の補助経路へ投じた厳密さを少なくとも上回る。
- actual before / after / resultをMashがprivateに読み、商品品質の向上を明示確認する。
- production / Piece / Analysis effect 0。

このstateをCycle proof、production admission、Emlis question completionへ変換しない。machine checkと華恋pre-screenはMash確認を代替せず、Mash確認前は本stateまたはproduct creditを宣言しない。

Route B bounded preflight / exact acceptance contractがapproved body v1.0.0へ固定され、L3-Rが成立したことはhistorical factである。P0 measured PASS、separate L3-I、alternate executor、renamed preflightまたはreapprovalはremaining prerequisiteではない。別Mash承認後に許され得るimplementation class exact1は§0.2のone bounded actual Emlis artifact quality improvement unitだけである。

Cycle001のcurrent first unfinished gateはfresh applicable `08`が示す。CMEE prerequisiteをCycleのnavigation stateへ読み替えず、同時にCycleのtechnical Gateを、actual Emlis artifactの品質向上に先行する独立workへ変換しない。

Cycle proof後もproduction operationalとは限らない。separate E0 approval、current `ReplyEnvelope` / passed-only display mapping、protected tests、actual-device proof、single-owner cutoverを通過した時だけ次のstateを宣言できる。

```text
CMEE_V1A_EMLIS_OBSERVATION_PRODUCTION_OPERATIONAL
```

このstateもV1-B question operationalを含まない。

## 17. Approved Route B Emlis resolution contract

Emlis resolverはrequired/active owner全件のexact-one dispositionを入力とし、provider proposalをmeaning authorityへしない。visible graphはsource-explicitまたはtarget-exact1 user supplemental evidenceだけで支える。

```text
contract_id = cocolon.cmee.v1a.acceptance.route_b.v1
GENERATED = all required visible duties source/user grounded; unresolved required duty 0
LIMITED = meaningful source-bound observation >= 1 + bound Reception + explicit unknown
QUESTION_PENDING = PRE_QUESTION LIMITED + material target unknown exact1
UNAVAILABLE = no meaningful safe visible claim
max_clarification_requests_per_thread = FREE:1 | PLUS:1 | PREMIUM:3
questions_per_round = 1
fallback = 0
automatic_retry = 0
```

question prompt/options/need、fixture、expected text、Product Readはsemantic sourceではない。answerはnew `SUPPLEMENTAL_ANSWER` SourceEnvelopeとしてnew graph version/deltaへbindし、original、prior answer、prior graph／artifactと非target unknownを不変に保つ。ambiguous answer、skip、stop、分からない、無回答では正常終了し、同一questionを再発行しない。Premiumの後続roundはrefined Layer 1／2後もmaterial unknownが残り、本人がexplicit continueを選び、budgetが残る場合だけである。V1-A offline contractであり、production interactive questionは後述Vertical 2の別承認まで0である。

## 18. Step 10 finalized Emlis product contract

本sectionはFinal Dispositionと一回限りの正式Pro reviewを反映したEmlis current targetである。§0〜17のcurrent候補と矛盾する場合は本sectionを優先する。historical execution fact、PR #3 Product Read FAIL、runtime disabled、production admission falseは変更しない。exact DB／table／API／RN／session／persistence pathはactual fit-gapまでHOLDであり、本docs reflectionのimplementation effectは`0`である。

### 18.1 Product output exact roles

```text
Layer 1「見えたこと」:
  current-input observation
  P6 Structure Insightのcurrent input内structure insightを含められる
  全plan

Layer 2「Emlisから」:
  Layer 1のvisible observation claimにbindしたHuman Reception
  新しい本人事実を作らない
  全plan

Layer 3「記録の線」:
  current inputとeligible owned historyのconcrete connection
  P5 User Label Connectionのeligibility／guardをadapt
  Plus／Premiumのみ、条件付き0..1
```

P6のstructure thinkingはFreeにもLayer 1として返す。構造思考自体を有料化しない。有料差はP5による履歴連続性である。Layer 3は、current input aloneが十分に観測され、eligible historyとmultiple evidence recordsがあり、current inputが中心で、low-informationでもsafety／high-careでもなく、personality／cause／other-intent promotionがない時だけ出す。不成立はLayer 1／2だけで正常終了する。Layer 3をLayer 1／2 failureの回避路にしない。UI最終名称はHOLD、暫定推奨は「これまでの記録から」とする。

### 18.2 Input-history thread

```text
no question:
  original input
  -> Layer 1
  -> Layer 2
  -> eligible Layer 3 0..1

with question:
  original input
  -> round 0 Layer 1
  -> round 0 Layer 2
  -> question artifact
     -> skip / stop / no answer: NORMAL_TERMINAL
        (supplemental answer 0, refined artifact 0)
     -> 「分からない」reply / ambiguous answer: supplemental answer
        -> NORMAL_TERMINAL (refined artifact 0)
     -> authenticated usable supplemental answer
        -> refined Layer 1
        -> refined Layer 2
        -> plan budget内のlater round
  -> eligible Layer 3 0..1（exact insertion positionはHOLD）
```

上記を生成順にsame threadへ保存する。later roundによるearlier source／artifactのoverwrite／deleteは`0`である。originalと各supplemental answerを別source role、別version、別round lineageで保持し、latest answerでoriginalまたはearlier answerを置換しない。Layer 3もderived artifactとして同thread lineageへ接続し、user sourceへ昇格させない。既存入力のauth／access／delete lifecycleから独立した孤立artifactを作らない。

```text
USER_OWNED_SOURCE:
  ORIGINAL_INPUT
  SUPPLEMENTAL_ANSWER 1..3

DERIVED_EMLIS_ARTIFACT:
  LAYER_1
  LAYER_2
  QUESTION
  LAYER_3
```

Emlisはcurrent threadのoriginal + supplemental answerを使える。Analysisはsupplemental answerをoriginal recordに従属する補足根拠として使えるが、別occasion／recordへ数えない。Pieceはuserが「この回答も含める」と明示した場合だけ使える。Analysis／PieceはEmlis Layer 1／2／3、question textをsourceにしない。

### 18.3 Plan contract

| Plan | source scope | output | question |
|---|---|---|---:|
| Free | `CURRENT_THREAD_ONLY`。original + same-thread supplemental | Layer 1 + Layer 2。Layer 3なし | thread 0..1 |
| Plus | current thread + eligible owned history | Layer 1 + Layer 2 + eligible Layer 3 0..1 | thread 0..1 |
| Premium | current thread + eligible owned history + evidence-bound interpretive frame + allowed user-owned cross-core context | Layer 1 + Layer 2 + eligible Layer 3 0..1 | sequential 0..3 |

Freeもthread／artifactを保存する。ただし、別入力の次回Emlis生成sourceとしてpast input、derived user model、cross-core contextを使わない。same-current-thread supplemental answerは有料の過去履歴利用に数えない。

Premiumでは一画面へ三問を一括表示しない。各roundでLayer 1／2を先に返し、重要unknownが残り、本人が続行を選び、budgetが残る場合だけquestion exact1を出す。skip、stop、分からない、無回答はいつでも正常終了である。

### 18.4 Premium interpretive frame

> **Premiumでは、ユーザーの蓄積した本人情報から作られた、根拠付き・暫定的・修正可能な「ユーザー固有の解釈フレーム」を使い、ユーザー本人の辞書により近い位置から観測とReceptionを行う。**

frameの各要素は本人入力のevidence refへ戻れ、永続的人格／真実／診断ではなく、新しい本人入力と本人訂正で更新できる。current inputをpast modelより優先し、automatic agreement、personality fixation、cause promotionを`0`とする。frame自体をvisible evidenceにせず、visible claimはcurrent inputまたはeligible owned historyへ戻す。

許可できるcross-core contextはuser-owned source、user-confirmed情報、original sourceへ戻れるsafe projectionだけである。Piece生成本文、Analysis推定文、Analysis IF route、past Emlis observation bodyを拒否する。current `cross_core_context` payloadは実装時にactual source roleを確認し、このallowed subsetだけに絞る。

### 18.5 Actual asset disposition

- `emlis_ai_reply_service.py::render_emlis_ai_reply`はaccepted cutoverまでcurrent active owner exact1として維持する。current surfaceをAS_IS継承しない。
- `emlis_ai_capability.py`、`emlis_ai_context_service.py`、`emlis_ai_user_model_store.py`、owned-history search、P5、P6、Free history boundary testsを`ADAPT_AND_INHERIT`する。
- capabilityへquestion budgetとLayer contractを追加する。
- context serviceへsame-thread supplemental lineage、eligible-owned-history、cross-core derived-artifact rejectionを追加する。
- user model storeへcurrent-input precedence、user correction、frame non-evidenceを追加する。
- P5／P6のeligibility、scope、guard、relation classificationは継承できるが、generic fixed visible bodyは継承しない。
- Reception-before-question guard、input material bundle、source partitionをadaptする。
- `TodayQuestion`は別商品として維持し、Emlis clarificationへ統合しない。
- PR #3はsource、unknown、contract、test、failure knowledgeだけをadaptし、Product Read FAIL surfaceを継承しない。
- PR #2はusable symbol、test、failure knowledgeだけを移し、wrapper ingress／large recovery shellをCMEE入口にしない。

### 18.6 Product vertical exact3

```text
Vertical 1 — Layer 1／2:
  actual current input
  -> input-specific observation
  -> Layer 1
  -> bound Human Reception
  -> Layer 2
  -> body-full Product Read

Vertical 2 — question／refined Layer 1／2:
  accepted Layer 1／2 quality
  -> plan budget + explicit continue
  -> question exact1
  -> supplemental answer
  -> cumulative source prefix
  -> refined Layer 1／2
  -> sequential lifecycle Product Read

Vertical 3 — Layer 3:
  accepted Layer 1／2 quality
  -> Plus／Premium
  -> eligible owned history
  -> P5 guard
  -> input-specific history connection
  -> Layer 3 0..1
  -> history-continuity Product Read
```

各Product Readを別claimとして評価し、一つのPASSを残りへ流用しない。Vertical 1は全planのLayer 1／2 actual body-full quality、Vertical 2はquestion／supplemental／refined lifecycle、Vertical 3はhistory continuityを読む。machine GREEN、shared guard PASS、PR #3 structural 8/8をProduct Read PASSへ換算しない。

### 18.7 Completion and implementation boundary

この完成版contractは、次のremaining logical responsibilityをEmlis ownerに残す。

- `NB-F01`: Layer 1／2 input-specific observation／Reception realizer correction。
- `NB-F02`: plan別sequential question lifecycle。
- `NB-F03`: input-history thread persistence／artifact linkage。
- `NB-F04`: Plus／Premium Layer 3 history continuity integration／realizer。

これらはnew file count、implementation approval、runtime activationではない。exact DB／API／RN／persistence、Premium cross-core payload、production cutoverはHOLDまたはseparate Mash approvalであり、本sectionだけで開始しない。

## 19. Stage 1 実装レシート（2026-08-22）

- 実装参照: `MassyuRed/mashos-api` Draft PR #3 / `106a1b8c92e808d15e88ce4f56c6300568d93e9f`
- `TK-01 -> NB-F01` として、source-explicit observation と evidence-bound human reception を実装した。
- 願い・負荷・実行済み行動・変化は別役割として扱い、他者主語、非current時制、外部評価、否定形は本人の肯定的現在状態へ昇格させない。
- safety 判定は scope / meaning 判定より先行する。
- reception opportunity / move / target / support / evidence は canonical validator と field-named digest でexact sealする。
- material unknown のみ `LIMITED` の可視 UNKNOWN とし、非material unresolved は表示しない。
- exact8 8/8 GENERATED、material fixture LIMITED/UNKNOWN1、47 tests PASS。
- 既知MINOR: メタ入力prefix（`例えば…` / `Q:` 等）の表記差は未収録。
- Product PASS、candidate ready、activation、production は未宣言。Mash確認前に次段階へ進まない。
