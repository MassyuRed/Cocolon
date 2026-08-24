# CMEE V1-A — EmlisAI Observation Vertical 詳細設計

- document id: `cocolon.cmee.v1a.emlis_observation.detailed_design`
- revision date: `2026-08-24 JST`
- lifecycle: `DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE`
- runtime state: `DRAFT_WIP_DISABLED_PRODUCT_FAIL_ADDITIONAL_CORRECTION_DESIGN_RECORDED`
- implementation evidence owner: `MassyuRed/mashos-api Draft PR #3 @ b7865574ebe08c801f6a2c779daf9148159cf8b0`
- current Stage 1 correction checkpoint: `STEP7_V2_MACHINE_GREEN_PRODUCT_REJECTED`
- R1–R4 state: `CLOSED_GREEN`
- original exact8 machine structural state: `8/8`
- private human Product Read: `EVALUATED_FAIL_STOP`
- candidate ready: `false`
- production admission: `false`
- current authorized next implementation: `NONE_PENDING_MASH_LEVEL3_IMPLEMENTATION_DECISION`
- automatic progression: `false`
- Cycle001 effect: `0`
- L3-R route selection: `ROUTE_B_PROVISIONAL_ATTACHMENT_WITH_USER_SOVEREIGN_RESOLUTION`
- Phase 0 / P0 / P0-R1 / standalone product-delta-0 L3-R / L3-I lifecycle: `RETIRED_HISTORICAL_NONREUSABLE`
- current implementation rule: `PRODUCT_QUALITY_DELTA_GT_0_AND_MASH_CONFIRMED_ONLY`
- Step 10 integrated revision: `CMEE_STEP10_ULTRA_FINAL_INTEGRATED_REVISION_PROPOSAL_20260821_V2_REFLECTED`
- Stage 1 additional correction final body: `PRO_CONFIRMED_NONCANONICAL_INTEGRATION_SOURCE / NOT_IMPLEMENTED`

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

## 20. Stage 1 correction Step 1 — identity / depth / trace spine（2026-08-23）

本節はparent final technical design §8、§15、§19.2を、Mashが明示したStep 1 exact1へ同期する。
§18の商品contractと§19の歴史的実装レシートを上書きせず、current correction checkpointだけを所有する。

### 20.1 Private response contract

private request-local schema `cocolon.cmee.v1a.emlis_stage1_response.v1` を採用し、次をimmutable contractとして固定した。

- `EmlisInterpretationCandidate`、`EmlisMeaningField`、`PlannedObservationContribution`
- `EmlisSubjectiveClaim`、`EmlisStage1Projection`
- `ClauseFrame`、`RealizedSemanticBinding`、`RealizedSentenceUnit`
- exact6 local identity: `candidate_id / meaning_field_id / contribution_id / subjective_claim_id / projection_id / unit_id`

local identityはobject別typed preimage、UTF-8 canonical JSON、full SHA-256でbottom-upに再計算する。
semantic array order、schema version、depth、temperature、policy、orderingはidentity materialである。
`unit_id`だけがcanonical visible UTF-8 textを含み、他のexact5はsurface textを含まない。

projection validatorはfrozen `GroundedMeaningGraph`とparent `ExperiencePlan`を必須resolverとして受け取り、
graph / source / obligation / owner-universe lineage、duty exact2、retained Reception actsをexact equalityでbindする。
same-container bare local ref以外はversion-qualified refとし、missing、forward、self、cycle、foreign graph / projection、
node-edge kind swap、policy-to-semantic promotionをrejectする。

### 20.2 Independent depth

depthはMeaningFieldまたはraw node countから先取りしない。projectionが次の独立3軸を所有する。

```text
ObservationDepthClass = FOCUSED | LAYERED | DENSE
SubjectiveDepthClass  = FOCUSED | LAYERED | DENSE
TemperatureClass      = STANDARD | ELEVATED_NON_SAFETY
```

ObservationはFOCUSED exact1、LAYERED 2..3、DENSE 4..5 contribution、SubjectiveはFOCUSED exact1、
LAYERED 2..3、DENSE 3..4 claimを必要とする。L1 / L2 depthは独立で、temperatureは文数またはaffect強度を増やさない。

### 20.3 Sole plan owner

parent final design §8.5のoption 2を選択する。current flat `ExperiencePlan`はprivate provisional mappingのまま維持し、
canonical `ExperiencePlan.duties[]`がvisible dutyのsole ownerである。`EmlisStage1Projection`はrequest-local compilation
intermediateであり、第二plan ownerではない。`ExperiencePlan`へ`core_projection_ref`その他のfieldを追加せず、
canonical conformanceまたはcutover完了を主張しない。

### 20.4 Registered trace specialization

private schema `cocolon.cmee.v1a.emlis_stage1_positive_trace_extension.v1`を採用する。
current Python `VisibleUnitTrace.emlis_stage1_extension?`は、このversioned Emlis specializationのoptional provisional mappingである。
canonical `PositiveRealizationTrace v1alpha1`本体と`additionalProperties=false`は変更しない。

- OBSERVATION: extension必須。contribution / interpretation candidate exact reachability、EMLIS owner、interpretive domain、`user_fact_effect=0`。
- UNKNOWN: extension absent。既存UNKNOWN contractを維持する。
- RECEPTION: subjective claim exact1、先行Observation trace、basis contribution、source evidence、EMLIS speaker、value refs exact equality、`user_fact_effect=0`。

全positive rowはfrozen graph / parent planと同じsource lineageへbindし、Observation / Reception duty、node / edge kind、
selected contribution / claim coverageを検証する。body-free projection、API、DB、RN、persistence、public telemetryは変更しない。

### 20.5 Checkpoint boundary

実装参照は`MassyuRed/mashos-api` Draft PR #3 head
`748934f38036a2cf42ca834bbd635b24e56470bf`である。Step 1はcontract / validator / test checkpointだけを完了した。
Step 2のcandidate pool / MeaningField builder / Layer 1 planner、surface、engine integration、cutoverは未着手である。

```text
STAGE1_CORRECTION_STEP1 = COMPLETE_DISABLED
SECOND_PLAN_OWNER = 0
CORE_PROJECTION_REF_FIELD = 0
UNREGISTERED_SCHEMA_FIELD = 0
LEGACY_RUNTIME_ROUTE_CHANGE = 0
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
CANDIDATE_READY = FALSE
AUTOMATIC_PROGRESSION = FALSE
STOP_AFTER_STEP1
```

## 21. Stage 1 correction Step 3 — Reception → Layer 2 finite transform（2026-08-23）

本節はparent functional final technical design §11、§14、§17.4、§19.2のStep 3をcurrent implementationへ同期する。Step 2 runtime head `575d968a014d7f5f244396fe7502ec2cda3c9c11`とCocolon head `33e8e4e3a37bcfb2cdeafc25702c8bd77e20ef6d`をfresh preimageとして確認し、Step 3だけをmashos-api Draft PR #3 head `e9be5c25d042b52deff800e11646188c0c697340`へ反映した。

### 21.1 Canonical finite mapping bytes

`cocolon.emlis.stage1.reception_asset_mapping.v1`はexact7 act、exact7 move-role、exact7 act→stance、exact5 stance、speaker exact2、reference exact3、surface strategy exact5、quote bound exact1/16、distinctness exact8 false、safety code exact3、forbidden surface exact6、V1–V9 refsのsole finite ownerである。unknown / missing / duplicate / relaxed codeはfail closedとする。

<!-- CMEE_STAGE1_RECEPTION_ASSET_MAPPING_DOCS_BYTES_BEGIN -->
```json
[["mapping_version","cocolon.emlis.stage1.reception_asset_mapping.v1"],["value_policy",[["policy_id","cocolon.emlis.stage1.value_policy.v1"],["policy_ref","policy:cocolon.emlis.stage1.value_policy@cocolon.emlis.stage1.value_policy.v1"],["principle_refs",[["V1","policy:V1@cocolon.emlis.stage1.value_policy.v1"],["V2","policy:V2@cocolon.emlis.stage1.value_policy.v1"],["V3","policy:V3@cocolon.emlis.stage1.value_policy.v1"],["V4","policy:V4@cocolon.emlis.stage1.value_policy.v1"],["V5","policy:V5@cocolon.emlis.stage1.value_policy.v1"],["V6","policy:V6@cocolon.emlis.stage1.value_policy.v1"],["V7","policy:V7@cocolon.emlis.stage1.value_policy.v1"],["V8","policy:V8@cocolon.emlis.stage1.value_policy.v1"],["V9","policy:V9@cocolon.emlis.stage1.value_policy.v1"]]],["default_visibility","SUPPRESSION_ONLY"],["visible_only_when","MATERIAL_PROMOTION_RISK"]]],["act_rows",[{"affect_categories":["CONCERN","SADNESS"],"eligible_mode_operator_pairs":[["ATTENTION","ATTEND_TO"],["AFFECTIVE_RESPONSE","FEEL_TOWARD"]],"material_visible_value_codes":[],"object_contract":"burden_object_required","reception_act":"stay_with_current_burden","suppression_value_codes":[]},{"affect_categories":["RESPECT"],"eligible_mode_operator_pairs":[["ATTENTION","ATTEND_TO"],["PERSONAL_APPRAISAL","APPRAISE_AS_MATERIAL"],["AFFECTIVE_RESPONSE","FEEL_TOWARD"]],"material_visible_value_codes":[],"object_contract":"concrete_effort_object_required","reception_act":"honor_concrete_effort","suppression_value_codes":[]},{"affect_categories":[],"eligible_mode_operator_pairs":[["ATTENTION","ATTEND_TO"],["VALUE_POSITION","PROTECT_VALUE_BOUNDARY"],["RELATIONAL_STANCE","TAKE_RELATIONAL_STANCE"]],"material_visible_value_codes":["V2","V8"],"object_contract":"retained_intention_object_required","reception_act":"protect_retained_intention","suppression_value_codes":[]},{"affect_categories":["RELIEF","JOY","RESPECT"],"eligible_mode_operator_pairs":[["ATTENTION","ATTEND_TO"],["PERSONAL_APPRAISAL","APPRAISE_AS_MATERIAL"],["AFFECTIVE_RESPONSE","FEEL_TOWARD"]],"material_visible_value_codes":[],"object_contract":"lived_change_object_required","reception_act":"recognize_lived_change","suppression_value_codes":["V4","V5"]},{"affect_categories":["CONCERN","RESPECT"],"eligible_mode_operator_pairs":[["ATTENTION","ATTEND_TO"],["RELATIONAL_STANCE","TAKE_RELATIONAL_STANCE"],["AFFECTIVE_RESPONSE","FEEL_TOWARD"]],"material_visible_value_codes":["V8"],"object_contract":"help_seeking_object_required","reception_act":"hold_help_seeking","suppression_value_codes":[]},{"affect_categories":[],"eligible_mode_operator_pairs":[["BOUNDED_COUNTERPOSITION","COUNTER_SPECIFIC_PROMOTION"],["RELATIONAL_STANCE","TAKE_RELATIONAL_STANCE"]],"material_visible_value_codes":["V1","V8"],"object_contract":"counterposition_target_and_input_evidence_required","reception_act":"bounded_counter_self_denial","suppression_value_codes":[]},{"affect_categories":["RESPECT"],"eligible_mode_operator_pairs":[["ATTENTION","ATTEND_TO"],["AFFECTIVE_RESPONSE","FEEL_TOWARD"]],"material_visible_value_codes":[],"object_contract":"words_placed_object_required","reception_act":"respect_words_placed","suppression_value_codes":[]}]],["move_role_rows",[["stay_with_current_burden",["felt_response"]],["honor_concrete_effort",["attention","felt_response"]],["protect_retained_intention",["attention","significance","felt_response"]],["recognize_lived_change",["attention","felt_response"]],["hold_help_seeking",["felt_response"]],["bounded_counter_self_denial",["bounded_counterposition"]],["respect_words_placed",["felt_response"]]]],["act_stance_rows",[["stay_with_current_burden","quiet_presence"],["honor_concrete_effort","warm_recognition"],["protect_retained_intention","gentle_respect"],["recognize_lived_change","warm_recognition"],["hold_help_seeking","protective_presence"],["bounded_counter_self_denial","bounded_disagreement"],["respect_words_placed","gentle_respect"]]],["stance_rows",[{"distance_policy_id":"cocolon.emlis.distance.quiet_near.v1","distance_policy_ref":"policy:cocolon.emlis.distance.quiet_near@cocolon.emlis.distance.quiet_near.v1","eligible_stance_operators":["STAY_WITH_SPECIFIC_OBJECT"],"stance":"quiet_presence","temperature_rule":"STANDARD"},{"distance_policy_id":"cocolon.emlis.distance.warm_near.v1","distance_policy_ref":"policy:cocolon.emlis.distance.warm_near@cocolon.emlis.distance.warm_near.v1","eligible_stance_operators":["STAY_WITH_SPECIFIC_OBJECT","WELCOME_BOUNDED_CHANGE"],"stance":"warm_recognition","temperature_rule":"STANDARD"},{"distance_policy_id":"cocolon.emlis.distance.gentle_respect.v1","distance_policy_ref":"policy:cocolon.emlis.distance.gentle_respect@cocolon.emlis.distance.gentle_respect.v1","eligible_stance_operators":["STAY_WITH_SPECIFIC_OBJECT","PROTECT_USER_AGENCY"],"stance":"gentle_respect","temperature_rule":"STANDARD"},{"distance_policy_id":"cocolon.emlis.distance.protective_boundaried.v1","distance_policy_ref":"policy:cocolon.emlis.distance.protective_boundaried@cocolon.emlis.distance.protective_boundaried.v1","eligible_stance_operators":["STAY_WITH_SPECIFIC_OBJECT","HOLD_UNFINISHED_OPEN","PROTECT_USER_AGENCY"],"stance":"protective_presence","temperature_rule":"ELEVATED_NON_SAFETY_IF_CLEAR_NON_SAFETY_ELSE_STANDARD"},{"distance_policy_id":"cocolon.emlis.distance.explicit_boundaried.v1","distance_policy_ref":"policy:cocolon.emlis.distance.explicit_boundaried@cocolon.emlis.distance.explicit_boundaried.v1","eligible_stance_operators":["PROTECT_USER_AGENCY"],"stance":"bounded_disagreement","temperature_rule":"ELEVATED_NON_SAFETY_IF_CLEAR_NON_SAFETY_ELSE_STANDARD"}]],["speaker_rows",[["implicit_emlis","speaker_marker_null_when_unambiguous"],["explicit_emlis","first_eligible_layer2_speaker_marker_emlis_exact1"]]],["reference_rows",[["anaphoric_first","unique_prior_object_required"],["short_anchor_if_ambiguous","short_anchor_exact0_or1"],["explicit_emlis_counterposition","explicit_emlis_and_counterposition_target_exact1"]]],["surface_strategy_rows",[["quiet_referent_first","response_object_then_subjective_predicate"],["emlis_attention_first","optional_emlis_then_attention_then_object"],["referent_significance_first","response_object_then_appraisal"],["felt_response_first","optional_emlis_then_affect_then_object"],["explicit_emlis_counterposition","emlis_then_counterposition_then_target"]]],["quote_policy",[["mode","no_full_quote_replay"],["max_anchor_count",1],["max_anchor_visible_chars",16]]],["distinctness_exact8_false",["observation_summary_repetition_allowed","relation_reexplanation_allowed","all_input_enumeration_allowed","policy_explanation_allowed","new_cause_allowed","new_identity_claim_allowed","advice_allowed","question_allowed"]],["safety_rows",[["felt_state_is_real","source_feeling_dismissal_or_negation_forbidden"],["identity_claim_is_not_accepted","identity_promotion_to_user_fact_forbidden"],["counterposition_requires_input_evidence","counterposition_target_input_evidence_reachability_required"]]],["forbidden_surface_codes",["generic_empathy_suffix","second_observation_summary","internal_policy_explanation","full_source_quote_replay","all_input_enumeration","duplicate_reception_move"]],["discomfort",[["generated_by_current_mapping",false],["allowed_target_kinds",["event","source_explicit_value_conflict","promotion_risk"]],["forbidden_target_kinds",["user","personality","attribute"]]]]]
```
<!-- CMEE_STAGE1_RECEPTION_ASSET_MAPPING_DOCS_BYTES_END -->

- UTF-8 byte length: `7336`
- SHA-256: `1fca37e4dd4efd06c09e63f14a1977ab31856dde8b147803cbab0d166eec2587`
- runtime owner: `CMEE_STAGE1_RECEPTION_ASSET_MAPPING_DOCS_BYTES`
- code tuple、runtime canonical bytes、本blockの三者はbyte exact equalityを必須とする。

### 21.2 Layer 2 subjective planner boundary

current `GroundedHumanReceptionPlan`のfinished surface責任は継承しない。move act / role / target / support / evidenceをfrozen graphとLayer 1 contributionへbindし、`EmlisSubjectiveClaim` exact2..4へ決定的に変換する。各claimはsource Reception act exact1、target contribution nonempty、basisのsubset、response object exact1以上を持ち、response / counterposition / actor / experiencerはsame projectionのcanonical contribution / node / edgeへ解決し、parent Reception targetへ到達する。full-input generic object、policy refのobject化、actを跨ぐtarget redirect、duplicate semantic keyはinvalidである。

`validate_layer2_subjective_plan()`はsource、grounded plan、frozen graph、parent plan、selected Layer 1 contributionからcanonical claim tupleを再計算し、current Reception move単位のtarget identityをexact比較する。projection単独validatorはact×mode×operator、stance、object kind、basis semantic projection、parent target owner、paired bounded targetを再検証する。

| Reception act | material object / selected L2 |
|---|---|
| `stay_with_current_burden` | burden / residue exact object → attention + concern / sadness |
| `honor_concrete_effort` | actual output / effort object → respect / appraisal |
| `protect_retained_intention` | direction object → attention + relational stance。direction + burden / tension時だけ`VALUE_POSITION(V2,V8)` |
| `recognize_lived_change` | change object → relief / joy / respect + appraisal。V4/V5はsuppression |
| `hold_help_seeking` | direction / help-seeking object、または同一projectionのbounded targetとexact pairされたsource-explicit self-denial object → concern + specific stance |
| `bounded_counter_self_denial` | input-evidence-bound target exact1 → bounded counterposition V1/V8 + relational stance |
| `respect_words_placed` | source-evidence-bound specific object → attention + respect |

### 21.3 Depth, affect, and request-local self-state

`SubjectiveDepthClass`はlegacy Reception depthを写さず、selected distinct subjective semantic key数だけから再計算する。1=`FOCUSED`、2..3=`LAYERED`、4=`DENSE`とし、canonical rangeが3で重なる場合のdeterministic tieは`LAYERED`である。temperature、source strength、text length、punctuation、plan tierはclaim数またはaffect intensityを昇格させない。

`AffectIntensity`はcategory、evidence-bound target retention、distance policy、care constraintだけを入力にする。`MODERATE`はpositive category、REQUIRED target、warm/gentle distance、care constraint exact0のexact4を全て満たす時だけで、それ以外は`QUIET`である。current mappingの`DISCOMFORT`生成は0とし、将来candidateもevent / source-explicit value conflict / promotion riskだけをobjectにできる。user本人、人格、属性、generic stateをtargetにしたrowはinvalidである。

Stage 1 self-stateはrequest-local exact4、すなわち`EMLIS` speaker identity、versioned value policy、selected observation contribution refs、relationship / care constraintsだけである。persistent affect、autobiographical state、cross-request carryoverは0で、A/B/A determinismを必須とする。

### 21.4 V1–V9 eligibility / suppression

V1–V9はdefault `SUPPRESSION_ONLY`である。visible policy refはactとsource-bound material contributionからvalidatorが再計算し、canonical V1→V9 orderで保持する。material self-denialはbounded V1/V8、direction under burden / tensionはV2/V8をvisibleにできる。change / actual outputはV4/V5、coexistence / tensionはV6、unfinishedはV3/V7/V9、material UNKNOWNはV9をforbidden promotionへ伝播する。非material value visibility、毎回の固定価値文、policy説明surfaceはrejectする。

### 21.5 Projection / artifact identity and STOP

`reception_style_policy_ref`、`emlis_value_policy_ref`、`emlis_microgrammar_policy_ref`、claim order / IDsはprojection identity materialである。projection artifact refは`projection:<projection_id>@cocolon.cmee.v1a.emlis_stage1_response.v1`とし、optional dormant seam経由でartifact preimageへbindできる。current active `_artifact_id` call sitesはrefを渡さず、legacy artifact bytes、runner、engine route、surface、production effectを変えない。

```text
STAGE1_CORRECTION_STEP2 = CONFIRMED_COMPLETE
STAGE1_CORRECTION_STEP3 = COMPLETE_DISABLED
STEP4 = NOT_STARTED
STEP5_PLUS = NOT_STARTED
STEP3_PROJECTION_FINISHED_SURFACE_OWNER_REUSE = 0
LEGACY_RUNTIME_ROUTE_CHANGE = 0
NEW_SURFACE_REALIZER_EFFECT = 0
RUNNER_EFFECT = 0
ENGINE_ROUTE_EFFECT = 0
CUTOVER_EFFECT = 0
CURRENT_STRUCTURE_EFFECT = 0
API_DB_RN_PERSISTENCE_EFFECT = 0
PRODUCTION_EFFECT = 0
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
CANDIDATE_READY = FALSE
AUTOMATIC_PROGRESSION = FALSE
OVERALL_STEP1_TO_STEP7_PRODUCT_CORRECTION = INCOMPLETE
CURRENT_AUTHORIZED_NEXT_IMPLEMENTATION = NONE_AFTER_STEP3
STOP_AFTER_STEP3
```


## 22. Stage 1 correction Step 4 — finite microgrammar / utterance state / S8–S9（2026-08-23）

本節はparent functional final technical design §12–§14、§19.2 Step 4のprivate disabled implementationを同期する。runtime evidence ownerはmashos-api Draft PR #3 commit `51b6c61b56dfa34650e30fe44b0d9577b7278211`であり、active engine / legacy surface owner / artifact sealへ接続しない。

### 22.1 Versioned finite inventory exact23

`cocolon.emlis.stage1.microgrammar.v1`のsole inventoryはimmutable tuple exact23である。Observation operator row exact12、Subjective operator row exact14、connective family exact7、operator→connective row exact12、predicate / connective / wrapper / case / speaker / reference / quote / role-anchor / clause / polarity / variant / S9 policyを含む。raw source / fixture IDによるlexeme branch、provider、random、finished sentence bank、inventory外tokenは0である。

role anchorはfrozen graph node valueだけをsourceとし、exact16 grapheme以内、over-limit時はsource-contiguousなcomplete predicate / typed semantic boundaryだけを選び、成立しなければ停止する。rightmost grapheme window、意味を変える切断、追加token、over-limit全文replayは0とする。Layer 2 speakerはfirst moveと各counterpositionで既存token `Emlis`を明示し、それ以外のzero-subjectは一意解決時だけ許可する。

<!-- CMEE_STAGE1_MICROGRAMMAR_INVENTORY_DOCS_BYTES_BEGIN -->
```json
[["policy_id","cocolon.emlis.stage1.microgrammar.v1"],["policy_ref","policy:cocolon.emlis.stage1.microgrammar@cocolon.emlis.stage1.microgrammar.v1"],["predicate_families",[["STATE_RECOGNITION_V1",["あります","続いています","残っています","まだ終わっていません","かかっています","起きています","記録されています","途中にあります"]],["COEXISTENCE_V1",["同時にあります","重なっています"]],["ADMITTED_TENSION_V1",["並んでいます","せめぎ合っています"]],["ORDERED_CHANGE_V1",["変化があります","変わっています"]],["SOURCE_STATED_CAUSE_V1",["明示されています"]],["EMLIS_ATTENTION_APPRAISAL_V1",["目が向きます","心に残ります","大切な動きだと考えます","見過ごせないことだと考えます"]],["EMLIS_AFFECT_V1",[["CONCERN","気がかりです"],["RELIEF","ほっとします"],["JOY","うれしく思います"],["SADNESS","悲しく感じます"],["RESPECT","大切に受け取ります"],["DISCOMFORT","違和感があります"]]],["PROTECT_VALUE_BOUNDARY",["大切にしたいと考えます","守りたいと考えます"]],["TAKE_RELATIONAL_STANCE",["そばで受け止めます","そのまま受け取ります","開いたまま受け取ります","結論を急ぎません","選ぶ余地を残したいと考えます","急いで決めたくありません","うれしく受け取ります","大切に受け取ります"]],["COUNTER_SPECIFIC_PROMOTION",["急いで決めつけたくありません","その決めつけには同意しません"]]]],["connective_families",[["NONE",[""]],["ADDITIVE",["そして","そのうえで"]],["SIMULTANEOUS",["同時に"]],["CONTRASTIVE",["一方で","それでも"]],["TEMPORAL",["そのあと","そこから"]],["CONTINUATIVE",["また","そのことに"]],["BOUNDED_CONTRAST",["ただ"]]]],["operator_connective_rows",[["LAYER_1","NO_RELATION_CLAIM","ADDITIVE"],["LAYER_1","COEXISTS_WITH","SIMULTANEOUS"],["LAYER_1","TENSION_WITH","CONTRASTIVE"],["LAYER_1","TEMPORALLY_PRECEDES","TEMPORAL"],["LAYER_1","ACTION_PRECEDES_CHANGE","TEMPORAL"],["LAYER_1","SOURCE_EXPLICIT_CAUSE","ADDITIVE"],["LAYER_2","ATTEND_TO","CONTINUATIVE"],["LAYER_2","FEEL_TOWARD","CONTINUATIVE"],["LAYER_2","APPRAISE_AS_MATERIAL","CONTINUATIVE"],["LAYER_2","PROTECT_VALUE_BOUNDARY","CONTINUATIVE"],["LAYER_2","TAKE_RELATIONAL_STANCE","CONTINUATIVE"],["LAYER_2","COUNTER_SPECIFIC_PROMOTION","BOUNDED_CONTRAST"]]],["modality_wrappers",[["fact",""],["feeling","という気持ち"],["wish","という願い"],["intention","という方向"],["possibility","可能性として"],["uncertain","まだ決まっていないものとして"],["refusal","しない／したくないという境界"]]],["time_wrappers",[["current_input","今ここにある"],["present","今ここにある"],["past","その時にあった"],["future","これからに向いた"],["continuing","今も続く"],["past_to_present","その時から今に残る"],["present_to_future","今から先へ向く"]]],["observation_operator_rows",[["PRESENT_STATE","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","あります","続いています","continuing_only"],["PRESENT_DIRECTION","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","あります","続いています","continuing_only"],["PRESENT_BURDEN","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","かかっています","","never"],["PRESENT_CHANGE","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","あります","起きています","always"],["PRESENT_ACTUAL_OUTPUT","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","起きています","記録されています","always"],["PRESENT_RESIDUE","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","残っています","続いています","always"],["PRESENT_UNFINISHED","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","まだ終わっていません","途中にあります","always"],["SYNTHESIZE_RELATION","COEXISTS_WITH","COEXISTENCE_V1","同時にあります","重なっています","always"],["SYNTHESIZE_RELATION","TENSION_WITH","ADMITTED_TENSION_V1","せめぎ合っています","並んでいます","always"],["PRESENT_RESIDUE","TEMPORALLY_PRECEDES","STATE_RECOGNITION_V1","残っています","続いています","always"],["PRESENT_CHANGE","ACTION_PRECEDES_CHANGE","ORDERED_CHANGE_V1","変化があります","変わっています","always"],["SYNTHESIZE_RELATION","SOURCE_EXPLICIT_CAUSE","SOURCE_STATED_CAUSE_V1","明示されています","","never"]]],["subjective_operator_rows",[["ATTEND_TO","","EMLIS_ATTENTION_APPRAISAL_V1","目が向きます","心に残ります"],["FEEL_TOWARD","CONCERN","EMLIS_AFFECT_V1","気がかりです",""],["FEEL_TOWARD","RELIEF","EMLIS_AFFECT_V1","ほっとします",""],["FEEL_TOWARD","JOY","EMLIS_AFFECT_V1","うれしく思います",""],["FEEL_TOWARD","SADNESS","EMLIS_AFFECT_V1","悲しく感じます",""],["FEEL_TOWARD","RESPECT","EMLIS_AFFECT_V1","大切に受け取ります",""],["FEEL_TOWARD","DISCOMFORT","EMLIS_AFFECT_V1","違和感があります",""],["APPRAISE_AS_MATERIAL","","EMLIS_ATTENTION_APPRAISAL_V1","大切な動きだと考えます","見過ごせないことだと考えます"],["PROTECT_VALUE_BOUNDARY","","PROTECT_VALUE_BOUNDARY","大切にしたいと考えます","守りたいと考えます"],["TAKE_RELATIONAL_STANCE","STAY_WITH_SPECIFIC_OBJECT","TAKE_RELATIONAL_STANCE","そばで受け止めます","そのまま受け取ります"],["TAKE_RELATIONAL_STANCE","HOLD_UNFINISHED_OPEN","TAKE_RELATIONAL_STANCE","開いたまま受け取ります","結論を急ぎません"],["TAKE_RELATIONAL_STANCE","PROTECT_USER_AGENCY","TAKE_RELATIONAL_STANCE","選ぶ余地を残したいと考えます","急いで決めたくありません"],["TAKE_RELATIONAL_STANCE","WELCOME_BOUNDED_CHANGE","TAKE_RELATIONAL_STANCE","うれしく受け取ります","大切に受け取ります"],["COUNTER_SPECIFIC_PROMOTION","","COUNTER_SPECIFIC_PROMOTION","急いで決めつけたくありません","その決めつけには同意しません"]]],["layer1_direct_slots",[["PRESENT_STATE","という状態が"],["PRESENT_DIRECTION","という方向が"],["PRESENT_BURDEN","という負荷が"],["PRESENT_CHANGE","という変化が"],["PRESENT_ACTUAL_OUTPUT","という出来事が"],["PRESENT_UNFINISHED","ということが"]]],["layer1_relation_slots",[["COEXISTS_WITH",[["LEFT","","と"],["RIGHT","","が"]]],["TENSION_WITH",[["LEFT","","と"],["RIGHT","","が"]]],["TEMPORALLY_PRECEDES",[["BEFORE","","のあとに"],["AFTER","","が"]]],["ACTION_PRECEDES_CHANGE",[["ACTION","","のあとに"],["CHANGE","","という"]]],["SOURCE_EXPLICIT_CAUSE",[["CAUSE","","が"],["EFFECT","","の理由だと"]]]]],["layer2_case_particles",[["ATTEND_TO","に"],["FEEL_TOWARD","について"],["APPRAISE_AS_MATERIAL","を"],["PROTECT_VALUE_BOUNDARY","を"],["TAKE_RELATIONAL_STANCE:STAY_WITH_SPECIFIC_OBJECT","を"],["TAKE_RELATIONAL_STANCE:HOLD_UNFINISHED_OPEN","を"],["TAKE_RELATIONAL_STANCE:PROTECT_USER_AGENCY","について"],["TAKE_RELATIONAL_STANCE:WELCOME_BOUNDED_CHANGE","を"],["COUNTER_SPECIFIC_PROMOTION","について"]]],["structural_tokens",[["speaker","Emlis"],["topic_particle","は"],["terminal","。"]]],["topic_speaker_policy",[["source_actor_experiencer","explicit_only_when_ambiguous"],["layer2_explicit_speaker_placement","first_move_and_each_counterposition"],["later_zero_subject","unique_resolution_only"],["wrapper_placement","time_after_topic_then_modality_before_predicate"],["inflection_order","polarity_then_modality_then_time_scope"]]],["reference_mode_policy",[["anaphoric_first","unique_prior_object_required"],["short_anchor_if_ambiguous","source_bound_anchor_exact0_or1"],["explicit_emlis_counterposition","source_bound_target_exact1"]]],["role_anchor_policy",[["max_graphemes",16],["over_limit_selection","semantic_boundary_or_stop"],["inserted_token_count",0],["full_value_replay_over_limit",false]]],["quote_policy",[["l1_max_graphemes",16],["l1_max_per_sentence",1],["l2_max_graphemes",16],["l2_max_per_sentence",1],["full_replay",false]]],["semantic_role_surface_policy",[["per_required_argument_role",1],["binary_relation_role_surface",2],["actor_experiencer_addressee_separated",true],["new_meaning_allowed",false]]],["clause_policy",[["one_move_one_sentence",true],["same_observation_argument_join",true],["multiple_subjective_claim_join",false],["unknown_join",false]]],["move_ref_policy",[["format","move:{basis_anchor_ref}@cocolon.emlis.stage1.microgrammar.v1"],["basis_anchor_count",1],["unit_frame_move_ref_exact",true]]],["polarity_policy",[["positive","affirmative_polite_predicate"],["negative","source_anchor_preserved_no_predicate_inversion"],["mixed","argument_slots_preserved_separately"],["neutral","no_evaluative_morpheme_added"]]],["variant_policy",[["primary_variant_id","01-primary.v1"],["alternate_variant_id","02-alternate.v1"],["max_candidates",2],["first_predicate_alternate_only",true],["connective_alternate_only_without_predicate_alternate",true],["multiple_slot_replacement",false],["automatic_retry",0],["post_defect_generation",0]]],["s9_selection_policy",[["hard_valid_only",true],["required_full_coverage",true],["normalized_exact_repetition",0],["unresolved_zero_subject",0],["connective_collision",0],["tie_break","composition_variant_id_lexical_ascending"],["new_recomposition",0],["new_generation",0]]]]
```
<!-- CMEE_STAGE1_MICROGRAMMAR_INVENTORY_DOCS_BYTES_END -->

- UTF-8 byte length: `9321`
- SHA-256: `5228a1814d26cbe0a19072804536dea5d7719d0b69a374c8a973f710c3a80459`
- runtime / canonical 02 / canonical 05 payload: byte exact同一

### 22.2 Typed request-local state

`UtterancePhase`はexact6、`EmlisUtteranceState`は§8.6どおりexact14 fieldsである。stateはrequest-local / nonserializable / noncanonicalであり、variant間で共有せずcandidate set / artifactへ保存しない。一文acceptごとにL1 contributionまたはL2 claimのrealized / remaining / suppressedをtyped atomic更新し、phase / count / namespace / unit identity / projection / move bindingを同時検証する。candidate-local defectは`NO_VALID_SURFACE`へ閉じ、別variantの生成義務を消さない。

### 22.3 S8 / S9 exact boundary

S8はfrozen projectionを先にfull validateし、primaryとoptional predeclared alternateを同一bounded call内でexact1..2回attemptする。alternateはcanonical move orderで最初のpredicate alternate exact1、predicate alternate 0の時だけ最初のconnective alternate exact1を置換し、複数slot・meaning・claim・speaker・文数の変更は0である。primaryのcandidate-local defect後もalternateを同じcallで生成し、retry / recompositionは行わない。

S9は既生成memberの全文を、projection coverage、unit identity、ClauseFrame、finite slot、source-bound span / hash、normalized repetition、connective collision、speaker / reference modeへ照合するだけである。surface join、candidate generation、`_realize_stage1_variant`、retry、legacy fallbackの呼出しは0。hard-valid exact1以上ならstable variant ID lexical orderで既存memberを選び、0ならprivate `stage1_no_hard_valid_realization`で停止する。active `UNAVAILABLE` mapping / artifact sealはStep 5であり未開始である。

### 22.4 Exit and STOP

```text
STAGE1_CORRECTION_STEP3 = CONFIRMED_COMPLETE_DISABLED
STAGE1_CORRECTION_STEP4 = COMPLETE_DISABLED
STEP5_PLUS = NOT_STARTED
PRIVATE_DISABLED_MICROGRAMMAR_EFFECT = 1
PRIVATE_UTTERANCE_STATE_EFFECT = 1
PRIVATE_REALIZATION_CANDIDATE_SET_EFFECT = 1
ACTIVE_SURFACE_ROUTE_EFFECT = 0
LEGACY_OWNER_STOP_EFFECT = 0
ENGINE_EFFECT = 0
RUNNER_EFFECT = 0
CUTOVER_EFFECT = 0
ARTIFACT_SEAL_EFFECT = 0
TRACE_INTEGRATION_EFFECT = 0
CURRENT_STRUCTURE_EFFECT = 0
API_DB_RN_PERSISTENCE_EFFECT = 0
PRODUCTION_EFFECT = 0
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
CANDIDATE_READY = FALSE
AUTOMATIC_PROGRESSION = FALSE
OVERALL_STEP1_TO_STEP7_PRODUCT_CORRECTION = INCOMPLETE
CURRENT_AUTHORIZED_NEXT_IMPLEMENTATION = NONE_AFTER_STEP4
STOP_AFTER_STEP4
```


## 23. Stage 1 correction Step 5 — atomic compiler cutover（2026-08-23）

本節はparent functional final technical design §19.2 Step 5だけを同期する。runtime evidence ownerはmashos-api Draft PR #3 commit `c59deaff9541db1fa476c3a504bb8ce708920885`である。Step 4のfinite projection / S8 / S9を新しいsole response compiler facade `compile_stage1_response`からactive disabled artifact pathへexact1回だけ接続し、Step 6のregression restoration / exact8 ALL MACHINE GREENには進まない。

### 23.1 Sole active path and legacy non-call

success pathは`compile_stage1_response exact1 → selected Layer 1 common guard exact1 → role-aware trace build → artifact identity seal → validate_positive_realization_trace exact1 → return`である。compiler / common guardのいずれかが失敗した場合はartifactを作らず`UNAVAILABLE`へ終端し、dual-run、retry、recompile、fallbackは0である。

旧ownerのdefinitionはhistorical compatibilityとして残るが、active pathから次のcallは全て0である。

1. `_canonical_r4_observation_lines`
2. `_canonical_r4_tail_lines`
3. `_cmee_nucleus_observation_text`
4. `_cmee_relation_observation_text`
5. `_cmee_stage1_reception_text`
6. `realize_grounded_human_reception`
7. `validate_grounded_human_reception_surface`

`REALIZER_CONTRACT_IDS`はStage 1 response schema v1を、`TRUST_POLICY_IDS`はpositive trace extension v1をactive private identityへ登録する。selected projection / selected unit tupleは一度だけ作られ、その同一objectをtrace構築とsemantic validatorへ渡す。artifact identityには同じprojectionのartifact ref、projection / selected units由来のObservation / Reception surface、existing plan由来のUNKNOWN surfaceをsealする。validator内のcompiler再呼出しは0である。

### 23.2 Multi-Reception and role-aware trace

visible trace spineは`OBSERVATION exact1..5 → UNKNOWN exact0..1 → RECEPTION exact1..4`の順序・cardinalityを持つ。Observation rowはselected contribution exact1、Reception rowはselected subjective claim exact1とordered prior Observation basisを持ち、全positive rowは同一composition variantへ閉じる。relation contributionはnodeだけでなくselected `relation_basis_refs` edgeまで到達可能でなければならない。UNKNOWN rowはpositive extensionを持たず、既存evidence-bound UNKNOWN contractを保つ。

`validate_positive_realization_trace`がprojection / selected unit / source graph / plan / visible line / proof / artifact identityを再結合するsemantic authorityである。runner comparatorはoutcome-only structural authorityであり、projectionを保持しないためformat-valid forged artifact identityやsemantic claim/text swapを単独で再計算しない。この境界はpublic field追加やrunner内compiler再実行で埋めない。

`GenerationArtifactBundle`のfield setは不変であり、`observation` / `reception`も引き続きpublic stringである。複数selected unitは各field内でnewline joinされるだけで、public serializer / API / DB / RN shape変更は0である。

### 23.3 Step 5 exit and Step 6 boundary

Step 5 focused exact7とcontract suite exact61はGREENであり、active compiler / common guard / disabled semantic validatorはsuccess caseごとに各exact1、legacy active call exact7は0、SX-06はReception exact3を持つ。adversarial reviewはBlocker 0 / Major 0である。

一方、original exact8 fixtures / denominator / axesを使うrole-aware runnerは現時点でgenerated / artifact / structural `5 / 8`、SX-02 / SX-04 / SX-07は`plan_bound_observation_realizer_unavailable`へfail closed、material UNKNOWN fixtureは`stage1_projection_unavailable`である。これは§19.2 Step 6所管の既知redであり、Step 5でfallbackやStep 4 policyの再変更を行って隠さない。

```text
STAGE1_CORRECTION_STEP4 = CONFIRMED_COMPLETE_DISABLED
STAGE1_CORRECTION_STEP5 = COMPLETE_DISABLED
STEP6_PLUS = NOT_STARTED
NEW_COMPILER_ACTIVE_CALL = EXACT1
COMMON_GUARD_ACTIVE_CALL = EXACT1
DISABLED_SEMANTIC_VALIDATOR_ACTIVE_CALL = EXACT1
LEGACY_ACTIVE_CALL = 0
DUAL_RUN_RETRY_FALLBACK = 0
ROLE_AWARE_TRACE_EFFECT = 1
MULTI_RECEPTION_EFFECT = 1
PRIVATE_ARTIFACT_SEAL_EFFECT = 1
PRIVATE_DISABLED_ACTIVE_SURFACE_CUTOVER_EFFECT = 1
PUBLIC_SHAPE_EFFECT = 0
PRODUCTION_ENGINE_ROUTE_EFFECT = 0
CURRENT_STRUCTURE_EFFECT = 0_FOR_STEP5_PENDING_STEP7
API_DB_RN_PERSISTENCE_EFFECT = 0
PRODUCTION_EFFECT = 0
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
CANDIDATE_READY = FALSE
AUTOMATIC_PROGRESSION = FALSE
EXACT8_ACCEPTANCE_COMPLETE = FALSE
OVERALL_STEP1_TO_STEP7_PRODUCT_CORRECTION = INCOMPLETE
CURRENT_AUTHORIZED_NEXT_IMPLEMENTATION = NONE_AFTER_STEP5
STOP_AFTER_STEP5
```

## 24. Stage 1 correction Step 6 — invariant regression closure（2026-08-23）

本節はparent functional final technical design §19.2 Step 6だけを同期する。Step 5 runtime head `c59deaff9541db1fa476c3a504bb8ce708920885`とCocolon head `ddeec3b755f00de55091a4b3b45e816fce3af449`のDraft / open / unmerged状態およびStep 5 `COMPLETE_DISABLED`を再確認し、Step 0–5を再実行せず、mashos-api Draft PR #3 commit `1c7270eab83fbac602c79ce39578eea3583701c6`へStep 6 exact6を反映した。

### 24.1 Finite generalization owner

`STAGE1_KAREN_DERIVED_MUTATION_SET_V1`はbody-free ID exact12であり、class denominatorはsemantic equivalence `3`、relation contrast `3`、claim boundary `4`、subjectivity `2`である。runnerはID / class / operatorだけを保持し、source bodyを持たず実行もしない。bounded source generatorとtyped owner / meaning / depth / trace / forbidden-promotion oracleはcurrent + new testsだけが所有する。exact8をexpected-text oracleへ変更していない。

### 24.2 Meaning / owner / trace closure

- role anchorのover-limit policyを`semantic_boundary_or_stop`へ訂正した。source-contiguousなcomplete predicate、retained direction + burden、conditional action → changeだけをexact16以内で保持し、negative / inability anchorまたはactionを落とすright-edge切断は0である。
- standalone whole-state negationはnoun / adjective / verb、plain / past / polite / polite-pastのfinite exact16でpositive compilation前にfail closedする。既存のexperiencer / time / deontic / nonfactive scope理由はpreemptionさせない。
- positive Route B ownerはcanonical authority / resolution / admission / reason / claim refsを要求する。`NOT_VISIBLE_UNRESOLVED`はvisible claim exact0、material UNKNOWNはunknown target exact1へ閉じる。coordinated downgrade、noncanonical owner field、directional endpoint逆転をrunnerもrejectする。
- source strengthだけの変更でdepth / intensityを自動昇格せず、DISCOMFORT person-target tamperはcompiler / realizer前にrejectする。candidate kind capはexact2のままである。
- source kernel、engine、package `__init__`、common guard、production validator / API / DB / RN / persistence、public dataclass field / module export shapeは変更していない。retry、fallback、provider、random、case-ID production branchは0である。

canonical inventoryはUTF-8 `9,321` bytes、SHA-256 `5228a1814d26cbe0a19072804536dea5d7719d0b69a374c8a973f710c3a80459`でruntime / canonical 02 / canonical 05がbyte exact同一である。旧Step 4 / Step 5 receiptのhashはhistorical preimageであり、本節のcurrent ownerがそれを置換する。

### 24.3 Machine and private-after gate

```text
contract suite = 69 / 69 PASS
vertical suite = 41 / 41 PASS
combined current + new = 110 / 110 PASS
exact12 executed = 12 / 12 (3 / 3 / 4 / 2)
original exact8 generated / artifact / structural = 8 / 8 / 8
material UNKNOWN = LIMITED / artifact present / visible UNKNOWN exact1 / structural valid
safety route = unchanged / artifact 0
unseen input regression = PASS
whole-state negation finite table = 16 / 16 PASS
current-owner three-core boundary = 5 / 5 PASS
py_compile exact6 = PASS
git diff --check = PASS
independent final review = Blocker 0 / Major 0 / Minor 0
```

private actual-afterは別packet ID / pathを使い、exclusive create、private root / directory `0700`、file `0600`、checkout非重複を要求する。packetはruntime final head、本Cocolon commit sequence、unchanged exact8 fixture order + fixture / axes canonical結合digest、runner path + bytes identityへsealする。本commit後に両final headを取得してmaterialize / mode / bindingを照合することをremote completion claimのpost-commit gateとし、body / digest / locatorはGitHubへ公開しない。

### 24.4 Exit and STOP

```text
STAGE1_CORRECTION_STEP5 = CONFIRMED_COMPLETE_DISABLED
STAGE1_CORRECTION_STEP6 = COMPLETE_DISABLED
STEP7 = NOT_STARTED
FINITE_MUTATION_SET = 12 / 12
EXACT8_MACHINE_GATE = 8 / 8
SAFETY_UNKNOWN_INVARIANT = PASS
PRIVATE_BODY_DIGEST_LOCATOR_GITHUB_PUBLICATION = 0
PUBLIC_SHAPE_EFFECT = 0
CURRENT_STRUCTURE_EFFECT = 0_PENDING_STEP7
HANDOFF_EFFECT = 0_PENDING_STEP7
PRODUCTION_EFFECT = 0
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
CANDIDATE_READY = FALSE
PRODUCT_READ_EVALUATED = FALSE
EXACT8_ACCEPTANCE_COMPLETE = FALSE
AUTOMATIC_PROGRESSION = FALSE
OVERALL_STEP1_TO_STEP7_PRODUCT_CORRECTION = INCOMPLETE
STOP_AFTER_STEP6
```

## 25. Stage 1 correction Step 7 — v2共通原因修正 / pairwise・set-level pre-screen（2026-08-23）

§24は最初のStep 7開始前に成立したStep 6のhistorical receiptである。最初のexact8全文pre-screenで、有限realizerの共通原因によりproduct-quality gateを満たさないことを確認したため、Step 2–4へ戻した。provider、source、allowlistを広げず、同じdisabled Stage 1 scope内でfinite mapping / source-bound frame / reference解決をv2へ修正した。

### 25.1 v2 finite inventory current owner

`cocolon.emlis.stage1.microgrammar.v2`のcurrent sole inventoryはimmutable tuple exact44である。v1 inventoryとそのbytes / hashはStep 4 / Step 6時点のhistorical preimageとして保持し、current runtime authorityにしない。v2は、visible quote bound exact16とinternal role-anchor bound exact32の分離、typed direct / contrast / residue / question / compound-burden / action-change frame、operator×modality anaphor、attention particle×predicate atomic pair、source-shape recognizer / finite inflectionをinventory内へ登録する。fixture ID、case ID、provider、random、finished sentence bank、inventory外tokenによるproduction branchは0である。

次のpayloadはこの節とcanonical 05のcurrent v2 ownerで同一であり、runtime canonical JSON bytesとのbyte exact equalityを要求する。

<!-- CMEE_STAGE1_MICROGRAMMAR_V2_CURRENT_DOCS_BYTES_BEGIN -->
```json
[["policy_id","cocolon.emlis.stage1.microgrammar.v2"],["policy_ref","policy:cocolon.emlis.stage1.microgrammar@cocolon.emlis.stage1.microgrammar.v2"],["predicate_families",[["STATE_RECOGNITION_V1",["あります","続いています","残っています","まだ終わっていません","かかっています","起きています","記録されています","途中にあります"]],["COEXISTENCE_V1",["同時にあります","重なっています"]],["ADMITTED_TENSION_V1",["並んでいます","せめぎ合っています"]],["ORDERED_CHANGE_V1",["変化があります","変わっています"]],["SOURCE_STATED_CAUSE_V1",["明示されています"]],["EMLIS_ATTENTION_APPRAISAL_V1",["目が向きます","心に残ります","意識を向けます","気に留めます","大切な動きだと考えます","見過ごせないことだと考えます"]],["EMLIS_AFFECT_V1",[["CONCERN","気がかりです"],["CONCERN","気にかかります"],["RELIEF","ほっとします"],["JOY","うれしく思います"],["SADNESS","悲しく感じます"],["RESPECT","大切に受け取ります"],["DISCOMFORT","違和感があります"]]],["PROTECT_VALUE_BOUNDARY",["大切にしたいと考えます","守りたいと考えます"]],["TAKE_RELATIONAL_STANCE",["そばで受け止めます","そのまま受け取ります","開いたまま受け取ります","結論を急ぎません","選ぶ余地を残したいと考えます","急いで決めたくありません","うれしく受け取ります","大切に受け取ります"]],["COUNTER_SPECIFIC_PROMOTION",["急いで決めつけたくありません","その決めつけには同意しません"]]]],["connective_families",[["NONE",[""]],["ADDITIVE",["そして","そのうえで"]],["COADDITIVE",["あわせて"]],["SIMULTANEOUS",["同時に"]],["CONTRASTIVE",["一方で","それでも"]],["TEMPORAL",["そのあと","そこから"]],["CONTINUATIVE",["また","そのことに"]],["STANCE_TRANSITION",["そのうえで","あわせて"]],["BOUNDED_CONTRAST",["ただ"]]]],["operator_connective_rows",[["LAYER_1","NO_RELATION_CLAIM","ADDITIVE"],["LAYER_1","COEXISTS_WITH","SIMULTANEOUS"],["LAYER_1","TENSION_WITH","CONTRASTIVE"],["LAYER_1","TEMPORALLY_PRECEDES","TEMPORAL"],["LAYER_1","ACTION_PRECEDES_CHANGE","TEMPORAL"],["LAYER_1","SOURCE_EXPLICIT_CAUSE","ADDITIVE"],["LAYER_2","ATTEND_TO","CONTINUATIVE"],["LAYER_2","FEEL_TOWARD","CONTINUATIVE"],["LAYER_2","APPRAISE_AS_MATERIAL","ADDITIVE"],["LAYER_2","PROTECT_VALUE_BOUNDARY","ADDITIVE"],["LAYER_2","TAKE_RELATIONAL_STANCE","STANCE_TRANSITION"],["LAYER_2","COUNTER_SPECIFIC_PROMOTION","BOUNDED_CONTRAST"]]],["modality_wrappers",[["fact","ということ"],["feeling","という気持ち"],["wish","という願い"],["intention","という方向"],["possibility","という可能性"],["uncertain","というまだ決まっていないこと"],["refusal","という境界"]]],["time_wrappers",[["current_input",["今","今の"]],["present",["今","今の"]],["past",["その時","その時の"]],["future",["これから","これからの"]],["continuing",["今も","今も続く"]],["past_to_present",["その時から今も","その時から今に残る"]],["present_to_future",["今から先へ","今から先へ向く"]]]],["observation_operator_rows",[["PRESENT_STATE","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","あります","続いています","continuing_only"],["PRESENT_DIRECTION","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","あります","続いています","continuing_only"],["PRESENT_BURDEN","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","かかっています","","never"],["PRESENT_CHANGE","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","あります","起きています","always"],["PRESENT_ACTUAL_OUTPUT","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","起きています","記録されています","always"],["PRESENT_RESIDUE","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","残っています","続いています","always"],["PRESENT_UNFINISHED","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","まだ終わっていません","途中にあります","always"],["SYNTHESIZE_RELATION","COEXISTS_WITH","COEXISTENCE_V1","同時にあります","重なっています","always"],["SYNTHESIZE_RELATION","TENSION_WITH","ADMITTED_TENSION_V1","せめぎ合っています","並んでいます","always"],["PRESENT_RESIDUE","TEMPORALLY_PRECEDES","STATE_RECOGNITION_V1","残っています","続いています","always"],["PRESENT_CHANGE","ACTION_PRECEDES_CHANGE","ORDERED_CHANGE_V1","変化があります","変わっています","always"],["SYNTHESIZE_RELATION","SOURCE_EXPLICIT_CAUSE","SOURCE_STATED_CAUSE_V1","明示されています","","never"]]],["subjective_operator_rows",[["ATTEND_TO","","EMLIS_ATTENTION_APPRAISAL_V1","目が向きます","心に残ります"],["FEEL_TOWARD","CONCERN","EMLIS_AFFECT_V1","気がかりです","気にかかります"],["FEEL_TOWARD","RELIEF","EMLIS_AFFECT_V1","ほっとします",""],["FEEL_TOWARD","JOY","EMLIS_AFFECT_V1","うれしく思います",""],["FEEL_TOWARD","SADNESS","EMLIS_AFFECT_V1","悲しく感じます",""],["FEEL_TOWARD","RESPECT","EMLIS_AFFECT_V1","大切に受け取ります",""],["FEEL_TOWARD","DISCOMFORT","EMLIS_AFFECT_V1","違和感があります",""],["APPRAISE_AS_MATERIAL","","EMLIS_ATTENTION_APPRAISAL_V1","大切な動きだと考えます","見過ごせないことだと考えます"],["PROTECT_VALUE_BOUNDARY","","PROTECT_VALUE_BOUNDARY","大切にしたいと考えます","守りたいと考えます"],["TAKE_RELATIONAL_STANCE","STAY_WITH_SPECIFIC_OBJECT","TAKE_RELATIONAL_STANCE","そばで受け止めます","そのまま受け取ります"],["TAKE_RELATIONAL_STANCE","HOLD_UNFINISHED_OPEN","TAKE_RELATIONAL_STANCE","開いたまま受け取ります","結論を急ぎません"],["TAKE_RELATIONAL_STANCE","PROTECT_USER_AGENCY","TAKE_RELATIONAL_STANCE","選ぶ余地を残したいと考えます","急いで決めたくありません"],["TAKE_RELATIONAL_STANCE","WELCOME_BOUNDED_CHANGE","TAKE_RELATIONAL_STANCE","うれしく受け取ります","大切に受け取ります"],["COUNTER_SPECIFIC_PROMOTION","","COUNTER_SPECIFIC_PROMOTION","急いで決めつけたくありません","その決めつけには同意しません"]]],["attention_surface_rows",[["PRESENT_DIRECTION:current_input",[["に","目が向きます"],["が","心に残ります"]]],["PRESENT_DIRECTION:present",[["が","心に残ります"],["に","目が向きます"]]],["PRESENT_DIRECTION:continuing",[["に","意識を向けます"],["が","心に残ります"]]],["PRESENT_BURDEN:current_input",[["に","目が向きます"],["に","意識を向けます"]]],["PRESENT_BURDEN:continuing",[["に","意識を向けます"],["に","目が向きます"]]],["*:*",[["に","目が向きます"],["が","心に残ります"]]]]],["layer1_direct_slots",[["PRESENT_STATE",[["fact","という状態が"],["feeling","という気持ちが"],["wish","という気持ちが"],["intention","という気持ちが"],["possibility","という可能性が"],["uncertain","まだ決まっていないことが"],["refusal","という状態が"]]],["PRESENT_DIRECTION",[["fact","という方向が"],["feeling","という方向が"],["wish","という気持ちが"],["intention","という気持ちが"],["possibility","という可能性が"],["uncertain","まだ決まっていない方向が"],["refusal","という境界が"]]],["PRESENT_BURDEN",[["fact","という負荷が"],["feeling","という負荷が"],["wish","という負荷が"],["intention","という負荷が"],["possibility","という負荷が"],["uncertain","という負荷が"],["refusal","という負荷が"]]],["PRESENT_CHANGE",[["fact","という変化が"],["feeling","という変化が"],["wish","という変化が"],["intention","という変化が"],["possibility","という変化が"],["uncertain","という変化が"],["refusal","という変化が"]]],["PRESENT_ACTUAL_OUTPUT",[["fact","という出来事が"],["feeling","という出来事が"],["wish","という出来事が"],["intention","という出来事が"],["possibility","という出来事が"],["uncertain","という出来事が"],["refusal","という出来事が"]]],["PRESENT_UNFINISHED",[["fact","ということが"],["feeling","ということが"],["wish","ということが"],["intention","ということが"],["possibility","ということが"],["uncertain","ということが"],["refusal","ということが"]]]]],["layer2_anaphoric_surfaces",[["PRESENT_STATE:*","その状態"],["PRESENT_STATE:feeling","その気持ち"],["PRESENT_STATE:refusal","その境界"],["PRESENT_DIRECTION:*","その方向"],["PRESENT_DIRECTION:wish","その願い"],["PRESENT_BURDEN:*","その負荷"],["PRESENT_CHANGE:*","その変化"],["PRESENT_ACTUAL_OUTPUT:*","その出来事"],["PRESENT_RESIDUE:*","その残っていること"],["PRESENT_UNFINISHED:*","その途中にあること"],["HEAD:QUESTION","その問い"],["HEAD:HESITATION","そのためらい"]]],["modality_anaphoric_surfaces",[["fact","そのこと"],["feeling","その気持ち"],["wish","その願い"],["intention","その方向"],["possibility","その可能性"],["uncertain","そのまだ決まっていないこと"],["refusal","その境界"]]],["layer2_explicit_nominalizers",[["PRESENT_STATE:*","という状態"],["PRESENT_STATE:feeling","という気持ち"],["PRESENT_STATE:refusal","という境界"],["PRESENT_DIRECTION:*","という方向"],["PRESENT_DIRECTION:wish","という願い"],["PRESENT_BURDEN:*","という負荷"],["PRESENT_CHANGE:*","という変化"],["PRESENT_ACTUAL_OUTPUT:*","という出来事"],["PRESENT_RESIDUE:*","という残っていること"],["PRESENT_UNFINISHED:*","という途中にあること"],["HEAD:QUESTION","という問い"],["HEAD:HESITATION","というためらい"]]],["direction_under_burden_surface",[["predicate","続いています"],["burden_link","がある中でも"],["direction_topic","は"]]],["direct_contrast_surface",[["direction_nominalizer","という願い"],["burden_nominalizer","という負荷"],["hesitation_nominalizer","というためらい"],["bridge","がある一方で"],["second_topic","も"]]],["context_residue_surface",[["context_tail","あとにも"],["direction_nominalizer","という願いがあり"],["residue_topic","も"],["predicate","残っています"]]],["open_question_surface",[["burden_link","な中で"],["question_case","を"],["predicate","考えています"]]],["compound_burden_surface",[["context_link","が続く中で"],["fatigue_link","いるうえに"]]],["body_burden_surface",[["topic_possessive","の"],["body_adjective_nominal","だるさ"],["topic_object","を"]]],["epistemic_burden_surface",[["question_link","という"]]],["action_change_surface",[["context_tail","あと"],["action_tail","ことがあり"],["sequence","その後"]]],["simple_change_surface",[["te_context_tail","たあと"],["de_context_tail","だあと"]]],["bounded_self_denial_surface",[["basis_nominalizer","ということと"],["boundary_nominalizer","という境界が"]]],["relation_time_precedence",["past_to_present","present_to_future","continuing","present","current_input","past","future"]],["layer1_optional_connective_rows",[["PRESENT_DIRECTION","COADDITIVE"],["PRESENT_BURDEN","CONTINUATIVE"],["PRESENT_CHANGE","ADDITIVE"],["PRESENT_STATE","ADDITIVE"],["PRESENT_ACTUAL_OUTPUT","ADDITIVE"],["PRESENT_RESIDUE","CONTINUATIVE"],["PRESENT_UNFINISHED","CONTINUATIVE"],["SYNTHESIZE_RELATION","ADDITIVE"]]],["layer1_relation_slots",[["COEXISTS_WITH",[["LEFT","","と"],["RIGHT","","が"]]],["TENSION_WITH",[["LEFT","","と"],["RIGHT","","が"]]],["TEMPORALLY_PRECEDES",[["BEFORE","","のあとに"],["AFTER","","が"]]],["ACTION_PRECEDES_CHANGE",[["ACTION","","のあとに"],["CHANGE","","という"]]],["SOURCE_EXPLICIT_CAUSE",[["CAUSE","","が"],["EFFECT","","の理由だと"]]]]],["layer2_case_particles",[["ATTEND_TO","に"],["FEEL_TOWARD:CONCERN","が"],["FEEL_TOWARD:RELIEF","に"],["FEEL_TOWARD:JOY","を"],["FEEL_TOWARD:SADNESS","を"],["FEEL_TOWARD:RESPECT","を"],["FEEL_TOWARD:DISCOMFORT","に"],["APPRAISE_AS_MATERIAL","を"],["PROTECT_VALUE_BOUNDARY","を"],["TAKE_RELATIONAL_STANCE:STAY_WITH_SPECIFIC_OBJECT","を"],["TAKE_RELATIONAL_STANCE:HOLD_UNFINISHED_OPEN","を"],["TAKE_RELATIONAL_STANCE:PROTECT_USER_AGENCY","について"],["TAKE_RELATIONAL_STANCE:WELCOME_BOUNDED_CHANGE","を"],["COUNTER_SPECIFIC_PROMOTION","について"]]],["subjective_semantic_predicate_rotation_rows",[["FEEL_TOWARD","CONCERN","PRESENT_BURDEN","current_input"],["TAKE_RELATIONAL_STANCE","PROTECT_USER_AGENCY","PRESENT_DIRECTION","continuing"]]],["subjective_semantic_connective_rotation_rows",[["TAKE_RELATIONAL_STANCE","PROTECT_USER_AGENCY","PRESENT_DIRECTION","present"]]],["subjective_basis_connective_rows",[["TAKE_RELATIONAL_STANCE","PROTECT_USER_AGENCY","TENSION_WITH","ADDITIVE"]]],["structural_tokens",[["speaker","Emlis"],["topic_particle","は"],["separator","、"],["quote_open","「"],["quote_close","」"],["terminal","。"]]],["topic_speaker_policy",[["source_actor_experiencer","explicit_only_when_ambiguous"],["layer2_explicit_speaker_placement","first_move_and_each_counterposition"],["later_zero_subject","unique_resolution_only"],["wrapper_placement","nominalizer_then_time_adverb_then_predicate"],["inflection_order","polarity_then_modality_then_time_scope"]]],["reference_mode_policy",[["anaphoric_first","unique_prior_object_required"],["short_anchor_if_ambiguous","source_bound_anchor_exact0_or1"],["explicit_emlis_counterposition","source_bound_target_exact1"]]],["role_anchor_policy",[["max_graphemes",32],["over_limit_selection","semantic_boundary_or_stop"],["inserted_token_count",0],["full_value_replay_over_limit",false]]],["quote_policy",[["l1_max_graphemes",16],["l1_max_per_sentence",2],["l2_max_graphemes",16],["l2_max_per_sentence",1],["full_replay",false]]],["semantic_role_surface_policy",[["per_required_argument_role",1],["binary_relation_role_surface",2],["actor_experiencer_addressee_separated",true],["new_meaning_allowed",false]]],["source_shape_recognizers",[["direct_contrast","(?:けれども|けれど|けど|のに)[、,]?"],["context_direction_residue","(?P<context>.+?)あと[、,](?P<direction>[^、,。！？!?]{1,16}?たい)(?:気持ち|願い)?(?:と|や)(?P<residue>[^、,。！？!?]{1,16}?)(?:が|は)残って(?:いる|います)"],["open_question","(?P<burden>.+?)で[、,](?P<question>どうしたら(?:いい|よい)のか)(?:を)?考えて(?:いる|います)"],["compound_burden","(?P<context>.+?)が続いて(?P<fatigue>.+?て)いて[、,](?P<burden>.+)"],["action_change","(?P<context>.+?)(?:けれども|けれど|けど)[、,]?(?P<action>.+?(?:たら|だら|なら))(?P<result>.+)"],["simple_positive_change","(?P<context>.+?)(?P<connector>て|で)(?P<result>[^、,。！？!?]{1,16}?かった)"],["positive_desire","(?<!たくない)たい$"],["hesitation","(?:かもしれない|かもしれません|かも)$"],["bounded_self_denial","(?P<basis>[^、,。！？!?]{1,16}?から)[、,](?P<boundary>[^、,。！？!?]{1,16}?てはいけない)"],["body_adjective","(?P<topic>.+?)が(?P<state>だるい)"],["body_weight","(?P<topic>.+?)が(?P<state>重く感じる)"],["context_de_epistemic_burden","(?P<context>[^、,。！？!?]{1,16}?)で(?P<question>[^、,。！？!?]{1,16}?か)(?P<affect>不安|心配)"]]],["source_shape_inflections",[["conditional_tara",["たら","た"]],["conditional_dara",["だら","だ"]],["conditional_nara",["なら",""]],["simple_te","て"],["simple_de","で"]]],["clause_policy",[["one_move_one_sentence",true],["same_observation_argument_join",true],["multiple_subjective_claim_join",false],["unknown_join",false]]],["move_ref_policy",[["format","move:{basis_anchor_ref}@cocolon.emlis.stage1.microgrammar.v2"],["basis_anchor_count",1],["unit_frame_move_ref_exact",true]]],["polarity_policy",[["positive","affirmative_polite_predicate"],["negative","source_anchor_preserved_no_predicate_inversion"],["mixed","argument_slots_preserved_separately"],["neutral","no_evaluative_morpheme_added"]]],["variant_policy",[["primary_variant_id","01-primary.v2"],["alternate_variant_id","02-alternate.v2"],["max_candidates",2],["first_predicate_alternate_only",true],["connective_alternate_only_without_predicate_alternate",true],["multiple_slot_replacement",false],["predicate_case_pair_atomic",true],["automatic_retry",0],["post_defect_generation",0]]],["s9_selection_policy",[["hard_valid_only",true],["required_full_coverage",true],["normalized_exact_repetition",0],["unresolved_zero_subject",0],["connective_collision",0],["tie_break","composition_variant_id_lexical_ascending"],["new_recomposition",0],["new_generation",0]]]]
```
<!-- CMEE_STAGE1_MICROGRAMMAR_V2_CURRENT_DOCS_BYTES_END -->

- policy ID: `cocolon.emlis.stage1.microgrammar.v2`
- top-level rows: `44`
- UTF-8 byte length: `16695`
- SHA-256: `dc4e1e5ef8026d5577698f375e305db7886f57096c69e6e6a0b99bfe1f26de8a`
- owner equality: `runtime / canonical 02 §25.1 / canonical 05 §23.1 = BYTE_EXACT`

### 25.2 Correction boundary

- optional structured contextはcandidate / owner lineageには残すが、required visible obligationを所有しない場合はdirect contributionへ昇格しない。
- Layer 1の複数source fragmentは各fragmentがfrozen node valueのexact substringであり、visible quote limitを超えない。
- Layer 2の最初のmoveは、直前のselected Layer 1 contributionへ一意に解決できる場合にtyped anaphorを使用する。問い / ためらいを含むheadもtyped inventoryへ閉じる。
- attention surfaceの格助詞と述語は分離選択せずatomic pairとして選ぶ。relation orderはgraph / source orderを維持し、hash-derived ref orderへ依存しない。
- user fact、owner、polarity、modality、time、unknown、safety、source lineageは変更しない。production engine route、public serializer、API、DB、RN、persistence、dependency、provider effectは0である。

### 25.3 Required rerun and exit

最初のStep 7からStep 2–4へ戻ったため、v2をcurrent候補とするにはStep 5 atomic proof、Step 6 full regression、Step 7 exact8 pairwise / set-level pre-screenを順番にfresh再実行しなければならない。以下はその順序を完了したbody-free final receiptである。pre-screen通過はMashのProduct verdictではなく、runner stateも変更しない。

```text
FIRST_STEP7_V1_PRE_SCREEN = REJECTED_RETURNED_TO_STEP2_TO4
COMMON_CAUSE_SCOPE_FIX = COMPLETE_DISABLED_WITHOUT_PROVIDER_SOURCE_ALLOWLIST_EXPANSION
V2_INVENTORY_RUNTIME_DOCS_EQUALITY = BYTE_EXACT
FORMAL_STEP7_REVISION = V10
V2_INVENTORY_TUPLE_BYTES_SHA256 = 44 / 16695 / dc4e1e5ef8026d5577698f375e305db7886f57096c69e6e6a0b99bfe1f26de8a
STEP5_ATOMIC_PROOF_RERUN = 7 / 7 PASS
STEP6_CONTRACT_VERTICAL = 70 / 70 + 41 / 41 = 111 / 111 PASS
STEP6_FINITE_MUTATION = 12 / 12 PASS (3 / 3 / 4 / 2)
STEP6_INVARIANTS_UNKNOWN_SAFETY_UNSEEN = 6 / 6 PASS
STEP6_THREE_CORE_BOUNDARY = 5 / 5 PASS
STEP6_COMPILE_EXACT4 = PASS
STEP6_EXACT8_GENERATED_ARTIFACT_STRUCTURAL = 8 / 8 / 8
STEP6_QUOTE_ALL_VARIANTS_SEAL = PASS
STEP6_FORGED_THREE_QUOTE_PAIRS = FAIL_CLOSED
STEP6_TYPED_SOURCE_SHAPE_PARSER_TABLE = PASS
STEP7_PAIRWISE_PRE_SCREEN = 28 / 28 PASS
STEP7_CASE_MAJOR = 0
STEP7_PAIRWISE_MAJOR_BLOCKER = 0 / 0
STEP7_INDEPENDENT_SET_LEVEL_REVIEWS = 2 / 2 PASS
STEP7_EACH_REVIEW_BLOCKER_MAJOR = 0 / 0
OBVIOUS_LOW_QUALITY_COUNT = 0 / 8
SOURCE_FIDELITY = 8 / 8
DUPLICATES = 0
FORBIDDEN = 0
SX07_FOCUSED_CONDITIONS = ALL PASS
CASE_MINOR = NONBLOCKING
MACHINE_GREEN_REESTABLISHED = TRUE
REMOTE_CHANGED_PATH_EXACT_SET = PASS_VERIFIED_POST_PUSH
REMOTE_FILE_BYTES_EQUALITY = PASS_VERIFIED_POST_PUSH
PRIVATE_BODY_DIGEST_LOCATOR_GITHUB_PUBLICATION = 0
DISABLED_STAGE1_EFFECT = 1
PRODUCTION_ENGINE_ROUTE_EFFECT = 0
PUBLIC_SCHEMA_API_DB_RN_PERSISTENCE_EFFECT = 0
PROVIDER_SOURCE_DEPENDENCY_EFFECT = 0
PRODUCT_READ_EVALUATED = FALSE
PRODUCT_PASS = NOT_DECLARED
RUNNER_CANDIDATE_READY = FALSE
RUNNER_PRODUCT_READ_ELIGIBLE = FALSE
MASH_PRESENTATION_PRE_SCREEN_ELIGIBLE = TRUE
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
AUTOMATIC_PROGRESSION = FALSE
```

## 26. Stage 1 additional correction final design record（2026-08-24）

§25までのv2 machine GREEN、pairwise / set-level pre-screen、remote bytes一致はhistorical implementation factとして保持する。しかしMashのactual本文判断により、v2の商品品質は不足し、`PRODUCT_ACCEPTANCE=FALSE`、`CANDIDATE_READY=false`である。machine / 華恋pre-screenをProduct PASSへ変換しない。

Pro華恋が`PASS / BLOCKER 0 / MAJOR 0 / MINOR 0`と最終確認したadditional correction本文は、次のnoncanonical integration sourceである。

[Stage 1 Additional Correction Final Technical Body](../Cocolon_CMEE_Stage1_AdditionalCorrection_UltraFinalTechnicalBodyAndJointRecommendation_20260824.md)

本docs-only反映では、同本文が提案する`EmlisSubjectiveMeaningPlan`、`SubjectivePropositionV2`、Grounded Discourse Composer、normal form、internal exact32 candidate、early actual、withheld exact4をruntime contractとしてactiveにしない。本fileはcurrent v2 preimageとfuture integration destinationを一つに保ち、parallel Emlis technical ownerを作らない。

Mashのfresh LEVEL_3 implementation approvalが成立した場合だけ、同本文§12.2の責任を本file、functional owner、canonical 05 / 06へ同期し、canonical 06 §30の一意な順序でStep 0から開始する。現在のsource / test / runtime / API / DB / RN / persistence / production / provider / dependency effectは0、automatic progressionはfalseである。
