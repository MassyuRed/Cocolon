# CMEE V1-A — EmlisAI Observation Vertical 詳細設計

- document id: `cocolon.cmee.v1a.emlis_observation.detailed_design`
- revision date: `2026-08-25 JST`
- lifecycle: `DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE`
- runtime state: `DRAFT_WIP_DISABLED_PRODUCT_FAIL_ADDITIONAL_CORRECTION_STEP3_COMMON_DEFECT_RETURN_BUDGET_EXHAUSTED_STOP`
- implementation evidence owner: `MassyuRed/mashos-api Draft PR #3 @ d26b3521f0cd63421af3596277145b2e52dafbbe`
- current Stage 1 correction checkpoint: `STEP7_V2_MACHINE_GREEN_PRODUCT_REJECTED`
- current Stage 1 additional correction checkpoint: `STEP3_COMMON_DEFECT_RETURN_BUDGET_EXHAUSTED_STOP / COUNT_2_OF_2 / EARLY_ACTUAL_NOT_RUN`
- R1–R4 state: `CLOSED_GREEN`
- original exact8 machine structural state: `8/8`
- private human Product Read: `EVALUATED_FAIL_STOP`
- candidate ready: `false`
- production admission: `false`
- current authorized next implementation: `NONE`
- automatic progression: `false`
- Cycle001 effect: `0`
- Stage 1 language route: `ROUTE_A_PROVIDERLESS_GROUNDED_DISCOURSE_COMPOSER / SOLE_CURRENT_AND_FUTURE_ROUTE`
- Phase 0 / P0 / P0-R1 / standalone product-delta-0 L3-R / L3-I lifecycle: `RETIRED_HISTORICAL_NONREUSABLE`
- current implementation rule: `PRODUCT_QUALITY_DELTA_GT_0_AND_MASH_CONFIRMED_ONLY`
- Step 10 integrated revision: `CMEE_STEP10_ULTRA_FINAL_INTEGRATED_REVISION_PROPOSAL_20260821_V2_REFLECTED`
- Stage 1 additional correction final body: `ROUTE_A_ONLY / STEP3_COMMON_DEFECT_RETURN_BUDGET_EXHAUSTED_STOP / EARLY_ACTUAL_NOT_RUN`

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

問いsystem全体、production cutover、Cycle001 acceptanceはV1-A completionに含めない。V1-A offline runnerはproviderless Route Aを検証できるよう、typed clarification candidateと、callerが別SourceEnvelopeとして供給したsupplemental answerからREFINED candidateを作るcontractまで持てる。ただしAPI / DB / RN / persistence、interactive session、user-visible question lifecycle、production question routeはexact0であり、後述§18のVertical 2だけがそれをoperational化する。V1-Aは§18のVertical 1、つまり全plan共通のLayer 1／2品質を担当する。

### 0.1 Current actual before baseline — body-free

[mashos-api Draft PR #3](https://github.com/MassyuRed/mashos-api/pull/3)には、CMEE package source exact5、
tests exact2、candidate runner exact1および`MeaningExperienceEngine.generate()`によるoffline disabled verticalが
実在する。head `06ce311b3ea728b06f83439d268a34bed917c01c`でR1〜R4は`CLOSED_GREEN`、original exact8は
machine structural 8/8である。一方、private human Product Readは`EVALUATED_FAIL_STOP`、candidate ready false、
providerless Route A complete false、Product / full-I1 / Cycle001 / production credit 0、`automatic_progression=false`である。

従って、これは未実装ではなく、商品品質に到達しなかった`DRAFT_WIP_DISABLED`のcurrent before baselineである。
body-full input / candidateは本designへ転記しない。correctionは未承認であり、authorized next workは0である。

### 0.2 絶対実装規則と許され得るnext implementation class

本設計は、parent final design
[`§0.3 三大中核構造及びCMEE実装作業の絶対定義`](../Cocolon_MeaningExperienceEngine_V1_FinalTechnicalDesign_ProReviewApplied_20260815.md#03-三大中核構造及びcmee実装作業の絶対定義)
とsuite [Read First §0.1](00_read_first.md#01-絶対実装規則へのbinding)に従う。「三大中核構造及びCMEEの実装作業」は、三大中核構造及びCMEEの商品品質を1％でも向上させる作業だけである。それ以外は作業とも成果とも扱わず、開始しない。

Phase 0 / P0 / P0-R1とstandalone product-quality delta 0のL3-R / L3-Iは
`RETIRED_HISTORICAL_NONREUSABLE`である。後続のP0 / L3-I prerequisite、alternate executor、別provider / model、rename、
類似preflight、再承認またはsuccessor routeはcurrent authorityを持たない。providerless Route Aのmeaning sovereignty、unknown、
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
| `AMBIGUOUS` | approved providerless Route A knowledgeと§18 current plan contractではambiguityに依存しないmeaningful limited claim、または各round target exact1のsemantic clarificationだけを候補化できる。thread budgetはFree／Plus 0..1、Premium sequential 0..3。同一product-quality improvement unit内のconstraintであり、別Gateにしない |
| `UNRESOLVED` | unresolved部分を言い切らず、limited／plan-budget内の一round一問／unavailable／separate safetyだけを候補化できる。同一product-quality improvement unit内のconstraintであり、別Gateにしない |

parserのone-bestだけで`UNIQUE`にしない。user clarificationはmeaning choiceを追加できるが、parserの過去outputをretroactive truthへしない。

independent admission closure:

| Status | Visible authority |
|---|---|
| `FORMAL_CLOSED` | independent assessorがcurrent formal contractを全条件で満たすmatching setとしてsealした場合だけ |
| `PROVISIONAL_ONLY` | providerless Route A選択後も単独ではvisible authorityにならない。source-explicitまたはtarget exact1のuser-owned supplemental evidenceに独立してgroundできないdisputed claimへ使用不可 |
| `UNRESOLVED` | visible candidateなし |
| `UNAVAILABLE` | meaning payloadなし |

providerのcandidate-local `UNIQUE`またはempty ambiguity listはadmissionではない。attachment set ID / digest、source version、resource lock、approved contract、formal denominator、independent mutation evidenceが一致しなければvisible dutyへ使用しない。

過去のprovider-first comparison、bounded preflightおよびそのexact literal identityはGit commit historyだけに残り、current treeのdesign input、admission prerequisite、fallbackまたは再承認候補ではない。current providerless Route Aは外部provider outputを受け付けず、source-owner resolutionはlocal source / user evidenceだけで閉じる。

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

2026-08-15のprovider-first比較と当時のroute-specific identityはcurrent treeから除去した。exact historical bytesはGit commit historyだけに残り、current contract、alternate route、preflight、fallbackまたはreapproval authorityを持たない。

providerless Route A exact1がcurrent/future sole routeだが、Cycle001のStep1 contract変更は未承認である。適用にはseparate C0とfresh `08`判断を必要とし、このdetail suiteまたはretired commit historyだけで251 denominator、visible claim authority、P1–P7、Cycle acceptanceを緩和しない。

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

retired provider-first packet、P0、separate L3-I、alternate executor、renamed preflightまたはreapprovalはremaining prerequisiteではなく、current treeへ戻さない。別Mash承認後に許され得るimplementation class exact1は、providerless Route Aだけを用いる§0.2のone bounded actual Emlis artifact quality improvement unitである。

Cycle001のcurrent first unfinished gateはfresh applicable `08`が示す。CMEE prerequisiteをCycleのnavigation stateへ読み替えず、同時にCycleのtechnical Gateを、actual Emlis artifactの品質向上に先行する独立workへ変換しない。

Cycle proof後もproduction operationalとは限らない。separate E0 approval、current `ReplyEnvelope` / passed-only display mapping、protected tests、actual-device proof、single-owner cutoverを通過した時だけ次のstateを宣言できる。

```text
CMEE_V1A_EMLIS_OBSERVATION_PRODUCTION_OPERATIONAL
```

このstateもV1-B question operationalを含まない。

## 17. Providerless Route A source-owner resolution contract

Emlis resolverはrequired/active owner全件のexact-one dispositionを入力とし、provider proposalをmeaning authorityへしない。visible graphはsource-explicitまたはtarget-exact1 user supplemental evidenceだけで支える。

```text
contract_id = cocolon.cmee.v1a.source_owner_resolution.v2
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
- positive providerless Route A ownerはcanonical authority / resolution / admission / reason / claim refsを要求する。`NOT_VISIBLE_UNRESOLVED`はvisible claim exact0、material UNKNOWNはunknown target exact1へ閉じる。coordinated downgrade、noncanonical owner field、directional endpoint逆転をrunnerもrejectする。
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

## 27. Stage 1 additional correction Step 1 — subjective meaning contract（2026-08-24）

本節はcanonical 06 §31で完了したStep 0と、Mashが明示承認したadditional correction Step 1だけを受け、final body §6.9のsubjective meaning責任を本fileのsole Emlis technical behavior ownerへ同期する。Step 2以後のcomposer、response v2 surface、runtime cutover、actual本文生成は開始しない。

### 27.1 Registered-disabled semantic contract

`SubjectivePropositionV2`はcurrent `EmlisSubjectiveClaim`へ将来nestedされるrequest-local private contentであり、独立artifact、第二meaning owner、public serializer、persistent Emlis stateではない。Step 1ではfinal typeとvalidatorを`REGISTERED_DISABLED`で固定し、current v1 projection / compiler / realizerからのread / writeはexact0とする。legacy `SubjectiveProposition`とのalias、dual read、dual write、generic fallbackは0である。

content discriminantとderived fieldsは次のexact5以外を許さない。

| content | subjective mode | subjective operator | assertion modality |
|---|---|---|---|
| `AFFECT` | `AFFECTIVE_RESPONSE` | `FEEL_TOWARD` | `EMLIS_FEELING` |
| `APPRAISAL` | `PERSONAL_APPRAISAL` | `APPRAISE_AS_MATERIAL` | `EMLIS_APPRAISAL` |
| `MATERIAL_VALUE` | `VALUE_POSITION` | `PROTECT_VALUE_BOUNDARY` | `EMLIS_VALUE_POSITION` |
| `RELATIONAL_POSITION / STANCE` | `RELATIONAL_STANCE` | `TAKE_RELATIONAL_STANCE` | `EMLIS_RELATIONAL_INTENTION` |
| `RELATIONAL_POSITION / BOUNDED_COUNTERPOSITION` | `BOUNDED_COUNTERPOSITION` | `COUNTER_SPECIFIC_PROMOTION` | `EMLIS_BOUNDED_REFUSAL` |

対応content fieldはexact1、残りexact0である。AFFECTはconcrete elicitor 1..N、APPRAISALはconcrete appraised binding 1..N、MATERIAL_VALUEはvalue application / protected target 1..N、RELATIONAL_POSITIONはtarget 1..Nを必須にする。mode / affect / stance labelだけ、ATTENTIONだけ、unboundな「気にかかる」「大切」等は`GENERIC_SUBJECTIVE_CONTENT_STOP`であり、thought paddingへfallbackしない。

### 27.2 Source / owner / safety / unknown / derivation spine

- `SubjectiveBasisBinding`はsame `projection_preimage_ref`のcontribution / semantic / role exact tupleへbindし、phase-A frozen expected descriptorとbyte-exact一致させる。
- `SourceQualifierBinding`は各basis exact1をsame orderでcoverする。directは`polarity / modality / time_scope` exact3、relation endpointは`<role>_polarity / <role>_modality / <role>_time_scope` exact3とscalar値を同時にbindする。candidate、role、axis code、scalarの全ID再hash tamperもfrozen expectationとの差でrejectする。
- 上記expected rows、allowed refs、actor / experiencer、focal relation、forbidden promotionsはcaller choiceではなく、same phase-A snapshotのtrusted frozen outputである。Step 1のvalidator seamにruntime callerは0であり、Step 2のsole projectorだけが同一snapshotから一括供給する。upstream closureとのfresh co-tamper検証はStep 2、sealed-plan tamperはStep 4のowning gateで行い、Step 1へparallel resolverを作らない。
- `basis_binding_refs`、qualifier refs、primary / boundary / response objects、target contributionsはcontentからpure deriveする。binding refsだけでなくresolved semantic refsもprimary / boundary間でdisjoint、response objectsは重複なしのexact concatenationである。counterpositionはboundary 1..Nかつadmitted focal relation exact1、STANCEはboundary exact0である。
- ownerはfinal Emlis owner、speakerは`EMLIS`、addresseeは`USER`、epistemic scopeは`REQUEST_LOCAL_EMLIS_SUBJECTIVITY`、`user_fact_effect=0`で固定する。forbidden promotionはcurrent wrapperから得たclaim-basis-local frozen resultとbyte-exactで、canonical prefix + V1–V9 suppression suffixのcanonical orderも同時に検証する。
- policy basis rowsもphase-A frozen expected rowsとbyte-exactに固定する。visible `ValueApplication`はcurrent visibility可能なV1 / V2 / V8だけ、principle↔risk exact、application row refはapplications間でunique、参照policy basisは`CONTRIBUTION` ownerだけである。material unknownは`PolicyBasisBinding(owner_kind=MATERIAL_UNKNOWN, role=MATERIAL_UNKNOWN)`だけに置け、V9 constraint専用でvisible applicationを支えない。unknownを`SubjectiveBasisBinding`、appraisal target、known feeling / valueへ昇格しない。policy rowは必要時0..Nであり、各propositionへ全unknown coverを強制しない。
- `SurfaceDerivation` exact8 kindはsource / claim、Emlis owner、participant、response object、relation / qualifier、evidence / scalar ranges、kind-compatible registered ruleを分離する。empty owner、foreign rule、overlap range、kind / response-mode rule swapをfail closedにする。Step 1が所有するのはregistered-disabled minimum shape / rule ownerまでであり、concrete source / evidence / scalar range freshnessはStep 2 sole projector、sealed reachability tamperはStep 4が検証する。

### 27.3 Anti-template and STOP

Step 1のanti-template invariantはConstructionSpecとeligible-constructions用grammatical-shape selectorだけを所有する。registryはraw ordered tuple `construction_id / argument_slots / role_order / valency / particle_rules / auxiliary_rules / relation_combinators / inflection_order` exact8、selectorはraw ordered tuple `grammatical_shape_key / predicate_valency / syntactic_orientation` exact3とのexact equalityを要求するclosed allowlistである。missing / duplicate / reorder / camelCase alias、unknown field、response-object / functional / post-rank identity fieldのcross-family混入をrejectする。case / fixture / exact8 / raw input / regex result / semantic keyword / expected text / finished surface・clause・sentence / input hashはregistry fieldにもselector inputにも使わない。同等aliasもrejectする。raw textからmeaning、construction ID、grouping、opening、speaker placement、endingを選ぶownerは0である。response-object / functional morphologyのfamily別final validatorはStep 2のowning implementationで追加し、Step 1へflat union allowlistを置かない。

```text
ADDITIONAL_CORRECTION_STEP1_SEMANTIC_CONTRACT = REGISTERED_DISABLED
FINAL_SUBJECTIVE_PROPOSITION_V2_OWNER = EXACT1
LEGACY_ALIAS_OR_DUAL_READ_WRITE = 0
GENERIC_PROPOSITION_FALLBACK = 0
RAW_TEXT_CONSTRUCTION_SELECTOR = 0
CURRENT_V1_RUNTIME_EFFECT = 0
STEP2 = NOT_STARTED
AUTOMATIC_PROGRESSION = FALSE
```

## 28. Stage 1 additional correction Step 2 — final language core（2026-08-24）

本節はcanonical 06 §33のcompletion receiptと同一stateを記録する。開始前にStep 1 `COMPLETE_DISABLED`、両Draft PRのapproved head、final body bytesをfresh確認した。作業中にfinal known structuresをtypedに成立させるため、Mashがfresh LEVEL_3で次のupstream exact pathを追加承認した。

```text
ai/services/ai_inference/emlis_ai_grounded_observation_plan.py
```

同pathはfinal-only builderでcompound action/change、residue/unfinished、direction/burdenをtyped projectionする。active `build_grounded_observation_plan()`の既存8入力結果はpreimageとbyte-equivalentで、active public path / provider / API / DB / RN / persistence / production effectは0である。

### 28.1 Sole staged implementation owners

canonical 06 §30.3に従い、final body §13の旧5名はlogical job labelとして次へ一意に写した。旧4名と同名のparallel production functionは作っていない。

| Logical job | Sole implementation owner |
|---|---|
| subjective meaning | `project_subjective_meaning_plan(phase_A)` |
| discourse planning | `project_stage1_discourse_arc(phase_B)` + same-phase exact5 seed/layout projector |
| draft composition | `compose_stage1_from_projection(phase_B)`内のtyped draft linearization |
| normal form | `normalize_to_normal_form(draft, same_seed, same_phase_B)` exact1 |
| profile / rank | `derive_discourse_preference_profile()` + Stage A/B reducer + global rank |

`emlis_stage1_response.py`はpublic pure seam exact3でPhase A inputを構築し、subjective meaningからfinal projectionをsealし、fresh Phase B inputを構築する。compositionからresponseへのreverse import、callback、viability-only flag、legacy v1 fallbackは0である。final projectionだけがv2 nested `SubjectivePropositionV2`を使い、active v1 compile pathは不変である。

### 28.2 Construction, morphology, normal form and rank

- construction exact8とtyped expression / response-object / relation / scalar / source-scalar / participant / structural assetsをclosed registryで検証する。
- source scalarはtyped `surface_scalar_range`と`surface_scalar_source:normalized_raw_text` exact1を使い、upstream同値whitespace normalizationとregistered finite-form morphologyだけでactual surfaceへ写す。
- admitted relation direction、source dependency、grounded→subjective、subjective content、unfinished terminalをfull `ArcDependencyRow`へ投影し、direct endpoint absorption後もowner coverageを失わない。
- `LayoutPreferenceSeed` exact5 dimensionsを各1..2で完全列挙し、cross-product cap exact32、typed dependency filter、0 / 3+ named STOPを持つ。normalizer phase 2はseed partitionを別canonical layoutへ潰さない。
- exact6 normalizerはpost-artifact defect projector exact8を実行し、typed defect exact0を証明した時だけcanonical bytesを返す。同じseed / Phase Bで二度目のnormalization bytes、duty、suppression、surface、response-object rowsは不変である。
- exact8 profileはsealed typed evidenceからcandidateごとにderiveし、NOT_APPLICABLE maskをpool-globalで一致させる。Stage Aはfull exact-member bytes、Stage Bはfull visible-equivalence bytesとprofile/signatureだけを使い、hash-only / first-seen / ID tie-breakを使わない。

known public-safe exact4はfinal APIからactual Japaneseへ4/4到達した。body-full textはこのcanonical receiptへ保存しない。material fixtureではinternal candidate exact4がnormalizer/profile/rankを通り、visible-equivalenceの異なるranked candidate exact2を保持した。

### 28.3 Frozen state and boundary

```text
LANGUAGE_CORE_IDENTITY = b74ea2f448011c8a721ed0b08bca8caa5c794e3f07c149612030451015953ae9
LANGUAGE_CORE_PAYLOADS = EXACT16
WHOLE_FILE_PAYLOADS = EXACT7
MANIFEST_PAYLOADS = EXACT9
COMBINED_TESTS = 138 / 138 PASS

STAGE1_ADDITIONAL_CORRECTION_STEP2 = COMPLETE_DISABLED
EARLY_ACTUAL_STATUS = NOT_RUN
STEP3 = NOT_RUN
PRODUCT_READ_EVALUATED_FOR_THIS_UNIT = FALSE
PRODUCT_PASS = NOT_DECLARED
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
CANDIDATE_READY = FALSE
CURRENT_AUTHORIZED_NEXT_IMPLEMENTATION = NONE_AFTER_ADDITIONAL_CORRECTION_STEP2
AUTOMATIC_PROGRESSION = FALSE
```

Step 2のknown exact4 machine generationはStep 3 human language viability observationを代行しない。identity対象のfile bytes / manifest / product-causal behaviorを今後変更した場合、`EARLY_ACTUAL_STATUS`は引き続き`NOT_RUN`であり、fresh Step 3前に新identityを明示承認しなければならない。

## 29. Route A v2 I01 — registered-disabled Japanese case-frame contract（2026-08-27）

Route A v2 final design §5 / §20のI01をauthorityとし、typed Japanese case-frame realizerのprivate typeとclosed grammar registryだけを`REGISTERED_DISABLED`で追加した。既存meaning ownerを置換せず、request-localの`GroundedExpressionPlan`、`PredicateSenseSpec`、`JapaneseCaseFrameSpec`、`SourceLeafToken` / `SourceLeafGroup`、`SourceComplementPlan`、`ArgumentRealizationPlan`、`DiscourseReferenceStateRow`、`ClauseLinkPlan`、`PredicateMorphologyPlan`、`JapaneseClauseIR`、`LinearizedJapaneseClause`、`JapaneseLocalPreferenceProfile`を登録する。registry backing typeはatomic head、lexical family、complement license、classifier / functional token / modifier / quote delimiter、case particle、inflection / morphology、clause link、reference / zero / topic、local preferenceをそれぞれsole typed ownerとする。

runtimeの`V2_GRAMMAR_INVENTORY_V1`はfinal designのcanonical literalとbyte-exactで、232 rows、13,811 UTF-8 bytes、SHA-256 `f071244e28baa5a824067ebfddf273bc4ad8f967d90ed5bd0bf9b9862a68a802`である。validatorはsense 17、frame 22、sense→frame license 22、head 22、lexical family 22、complement 8、sense-complement 22、source mode 5、classifier 5、functional token 3、modifier 3、quote delimiter 4、particle 42 / surface variant 59、inflection 6、morphology 22、link 10、reference 12、preference 7をexactに検査し、参照のnonunique、orphan、unlicensed rowをlinearization前にfail closedにする。旧`C01`はなく、corrected `CL05`を含む。

I01ではregistryを用いたbehavior、source realization、linearization、body generationを実行しない。active `compile_stage1_response` facade / call chain、public response schema、subjective proposition public schema、API、DB、RN、persistence、production、provider、network、dependency、fallbackはすべてdelta 0である。N2 implementationは未開始で、次のI02はfresh explicit startを必要とする。

```text
ROUTE_A_V2_I01_PRIVATE_TYPE_AND_REGISTRY = REGISTERED_DISABLED
GRAMMAR_INVENTORY_ROWS / BYTES / SHA256 = 232 / 13811 / f071244e28baa5a824067ebfddf273bc4ad8f967d90ed5bd0bf9b9862a68a802
ORPHAN / UNLICENSED / NONUNIQUE_OWNER = 0 / 0 / 0
ACTIVE_FACADE / BODY_GENERATION / PUBLIC_SCHEMA_EFFECT = 0 / 0 / 0
STRUCTURE_MAP_DELTA_NONE = TRUE_REGISTERED_DISABLED_PRIVATE_OWNER_NO_ACTIVE_ROUTE_OR_CALL_CHAIN_CHANGE
I02 = NOT_STARTED_REQUIRES_FRESH_EXPLICIT_START
AUTOMATIC_PROGRESSION = FALSE
```

## 30. Route A v2 I02 — source / complement / case / head（2026-08-27）

I02はfinal design §6–§7 / §20 Step 2のN2.1だけを、active facadeへ接続しないprivate behaviorとして実装した。`project_source_leaf_group`は`SourceLeafToken`のEvidenceRef、source envelope、raw UTF-8 range、extent proofをexact1へbindし、`payload_utf8 == raw_utf8[start:end]`とstrict UTF-8 round-tripを要求する。FULL_EVIDENCE_LITERALはEvidence literal rangeのexact cover、CERTIFIED_LITERAL_SUBSPANはcallerが渡すtyped subspan proof exact1だけを許し、composer内の文字列探索、normalization、strip、terminal削除、newline変換は0である。

shape witnessはsentence / final terminal / quote topology / linebreakのvalidationとouter delimiter selectionにだけ使う。terminal closed setは`。．.!！？?`、quoteはbalanced `「」` / `『』`、linebreakはNONE / LF_ONLY / CRLF_ONLYである。unbalanced quote、lone CR、LF / CRLF混在、invalid UTF-8、uncertified subspanはnamed STOPへ閉じる。exact2 groupのcardinality logicが読むのはordered leaf refsとcardinalityだけで、二leafのshape coupling、dedupe、reorder、generic 3-way joinは0である。

`select_source_complement_plan`はselected frameのSenseComplementLicenseからC02–C09 exact1を選び、mode exact5を次のownershipで閉じる。

| Mode | Cardinality | Complement owner |
|---|---|---|
| `QUOTE_COMPLEMENT` | exact1 | C02、outer delimiter、frame-owned case marker |
| `CONTENT_NOMINAL` | exact1 | C03 / C04、SF01 / SF02 |
| `CLASSIFIED_CONTENT` | exact1 | C05 / C06、classifier exact1 |
| `COORDINATED_EXACT2` | ordered exact2 | C07はframe particle、C08はSF03 |
| `BOUNDARY_SPLIT_EXACT2` | ordered exact2 | C09、PRIMARY / SECONDARY frame particle |

QD01–QD03は各leafへ独立にexact1、QD04 BALANCED_MIXEDは`SOURCE_OUTER_DELIMITER_UNAVAILABLE_STOP`であり、別modeや万能nominalizerへfallbackしない。source terminalはinner literal bytesに残り、matrix terminal ownerはI03のmorphology / linearizerまで未実装である。

`JapaneseCaseFrameKey`はSentenceJob、SemanticClauseKind、subjective content / predication / semantic sense、grounded predicate kind、required ClauseArgumentRole tuple、RelationOperator、polarity / modality / time scope、speaker / zero requirement、complement requirementだけを持つ。raw source、source shape、rendered surface、output history、case / fixture ID、expected textはfield 0である。`select_case_frame`はF01–F22 exact1、`select_atomic_predicate_head`は選択済みframeからH01–H22 exact1を別call / ownerとして返す。`project_argument_realization_plan`はrequired slot 42をframe orderでexact coverし、semantic binding exact1とparticle rule owner exact1を同時に固定する。0件 / 2件以上、missing / extra slot、particle duplicateはrank前にSTOPする。

runtime head `c40cc43952a49b75cb8cf5fd4a2bd1cf74a29473`でM02 / M04 / M07 exact3をpostverifyした。public typed testsはI02 named exact5、I01 regression exact1のfinal 6 / 6 GREEN、source boundary `192 + 2 + 10 + 4 = 208`、I02 applicable mutation `59×3 + 42 + 22 = 241`をbody-freeに実行した。private linearized output、formal exact8、human read、Product Readは0である。

```text
ROUTE_A_V2_I02_SOURCE_COMPLEMENT_CASE_HEAD = IMPLEMENTED_DISABLED
SOURCE_BOUNDARY_TOTAL = 208
SOURCE_MODE / CASE_FRAME / ATOMIC_HEAD / REQUIRED_SLOT_PARTICLE = 5 / 22 / 22 / 42
I02_APPLICABLE_MUTATION_SUBCASES = 241
INVALID_REACHES_RANK / LINEARIZATION = 0 / 0
LANGUAGE_CORE_IDENTITY_POST_I02 = 7e829de6cc80919d0cd760e1679ee6ac1f4d06b75edafa41133188767fa8a9b0
ACTIVE_FACADE / BODY_GENERATION / PUBLIC_SCHEMA / PRODUCTION_EFFECT = 0 / 0 / 0 / 0
I03 = NOT_STARTED_REQUIRES_FRESH_EXPLICIT_START
AUTOMATIC_PROGRESSION = FALSE
```

## 31. Route A v2 I03 — reference / link / morphology / IR / sole linearizer（2026-08-27）

I03はfinal design §8 / §13 / §20 Step 3のN2.2だけを、active facadeへ接続しないprivate behaviorとして実装した。I02で固定済みのsource complement、case frame、atomic head、argument planを入力とし、`project_reference_state`、`project_clause_link_plan`、`project_predicate_morphology_plan`、`build_japanese_clause_ir`、`linearize_japanese_clause`をproduct-causal ownerへ追加した。raw source、case / fixture ID、expected text、prior output、human verdictはselector入力0である。

### 31.1 reference / topic / zero owner

`DiscourseReferenceStateRow.establishment_proof_refs`には、登録済みR01–R12のうち適用された直交dimensionをexactにsealする。mention / relation endpointはR01–R04 / R11 / R12、Emlis speaker continuityはR05–R07、topic / base caseはR08–R10が所有する。したがって初出EmlisはR05 explicitとR08 introduced topicを同時に持て、same-speaker chainはR06 zeroとR10 baseを持つ。required relation endpointはR11 exact1だけでanaphor / zero / topicへ落とさない。

- singular anaphorはantecedent exact1、competitor 0、focus一致、local distanceをすべて要求する。
- pair anaphorは同じordered exact2 pairの直前導入を要求する。
- competitor、distance、cardinalityが曖昧ならfull expressionへ閉じ、full expressionがframe不適合なら`STAGE1_REFERENCE_REPAIR_UNAVAILABLE_STOP`である。
- Emlis zeroはsame-speaker chain exact1だけで、first / restart / counterposition後はexplicitである。
- `は`はR08 introduced topicまたはR09 admitted contrastだけで、R10 first noncontrastはbase caseである。

public typed proofはR01–R12のclosed cover、explicit＋topic、zero＋base、required endpointを全件検査した。text similarity、raw substring、fixture順はreference decisionに使っていない。

### 31.2 clause link / morphology owner

`ClauseLinkPlan`はadmitted relation、placement、token ownerを一体で選ぶ。L01–L05はF05–F09の`FRAME_INTERNAL`でexternal token 0、L06–L08はnon-first sentenceのtyped temporal / action-change / source-explicit-causeだけ、L09はindependent topic additiveだけ、L10はno relationまたはalready-owned relationの`ZERO`だけである。first-sentence connective、frame-internal relationの外部二重表示、adjacent same tokenはlinearization前STOPになる。cause connectiveを`SOURCE_EXPLICIT_CAUSE`以外へ付与しない。

`PredicateMorphologyPlan`はselected frame / head / inflection class / MP01–MP22をexact1で閉じ、aspect / time、polarity、modal、politeness、finite recipe、matrix terminalをsealする。head atomからのfinite surfaceはclass-specific closed transformationだけで、generic morpheme concatenationは0である。各clauseのfinite head exact1、matrix `。` exact1を要求し、source literal内のterminal、quote、newline、whitespace bytesは変更しない。

### 31.3 IR / linearization / derivation seal

`JapaneseClauseIR`はargument plan、source complement plan ref、reference state ref、link plan ref、morphology plan refとcanonical semantic digest 64 hexを、text生成前にsealする。`linearize_japanese_clause`だけがtext ownerであり、IRの再計算一致、source group / plan一致、reference / link / morphology exact1を再検証してから、delimiter、literal bytes、functional atom、particle、modifier、finite head、terminalをframe orderで組み立てる。

textと同じpassで`ClauseFrame` exact1、contiguous `RealizedSemanticBinding` exact cover、bindingと同数の`SurfaceDerivation`を生成する。source literal derivationは`SourceLeafToken`が持つcertified scalar rangeを保持し、opening / closing delimiterとmatrix terminalはregistered structural owner、Emlisはregistered Emlis owner、particle / classifier / modifier / connective / finite headはprojected functional ownerへ閉じる。render後のtext reparse、post-hoc ledger、alternate linearizer、legacy fallbackは0である。

runtime branch head `57a875978949742660e74ef10d7878eaf016cbd5`で、ordered commits `66125d62aa02ea1483a8c695c3b24fd77fc93942`（M02）、`b86f60a490b08244a9fb7cdd2585ff544f7c4c47`（M04）、`57a875978949742660e74ef10d7878eaf016cbd5`（M07）をfresh postverifyした。runtime target blobsはM02 `f0aa0d416b9fca6d807a9fe8adb0393f3b6dcce3`、M04 `da11f0232f0a8ae441d55505224df3e196c1ef8d`、M07 `b7f84eff2237d3195aad275ce008dad498b0fdc1`、postimage manifest SHA-256 `5fc4bb63bdb95b5119fa0098433a9e53c4ae2ae70b4a7e003ad0fa7e3fa08d80`である。各commit changed path exact1、aggregate exact3、PR open / draft / unmerged、status / workflow exact0を確認した。

machine proofはI01 regression exact1＋既存canonical names 2 / 4 / 5 / 6 / 7のI02/I03 enhanced exact5でfinal 6 / 6 GREEN、source boundary 208 / 208、mutation registry `59×3 + 42 + 22 + 22 + 10 = 273`、placeholder frame surface skeleton 22 / 22 byte equality、canonical skeleton SHA-256 `cba16357cec9cd37c8da16e9727aeea5a961c8e413c2f97469161c5a03a5f03b`を確認した。invalid mutationのrank / linearization到達は0 / 0である。これはpublic typed fixtureのmachine proofであり、private exact8、formal、human read、Product Read、Product / technical creditではない。

```text
ROUTE_A_V2_I03_REFERENCE_LINK_MORPHOLOGY_IR_LINEARIZER = IMPLEMENTED_DISABLED
REFERENCE / LINK / MATRIX_MORPHOLOGY = 12 / 10 / 22
MUTATION_CASE_REGISTRY / SOURCE_BOUNDARY / SKELETON = 273 / 208 / 22
SKELETON_SHA256 = cba16357cec9cd37c8da16e9727aeea5a961c8e413c2f97469161c5a03a5f03b
VISIBLE_DERIVATION_COVER / TERMINAL_OWNER / DELIMITER_OWNER = EXACT / EXACT1 / EXACT1
INVALID_REACHES_RANK / LINEARIZATION = 0 / 0
LANGUAGE_CORE_IDENTITY_POST_I03 = d7d211f5dae049d2c3a75b523794f48b292defaddddb7c5c73550c9380fe6365
STAGE1_RUNTIME_INTEGRATION_IDENTITY_POST_I03 = a13a3463927a048a507d7a6f283f501982095a00b7b517b154256f031f9e8b4c
ACTIVE_FACADE / PRIVATE_BODY / PUBLIC_SCHEMA / PRODUCTION_EFFECT = 0 / 0 / 0 / 0
STRUCTURE_MAP_DELTA_NONE = TRUE_PRIVATE_DISABLED_BEHAVIOR_ONLY_NO_ACTIVE_ROUTE_OR_CALL_CHAIN_CHANGE
I04 = NOT_STARTED_REQUIRES_FRESH_EXPLICIT_START
AUTOMATIC_PROGRESSION = FALSE
```

## 32. Route A v2 I04 — design-corrected normal form / rank / composer / trace（2026-08-27）

I04はN2.3のnormal form／rank／composer／preactivated helperを、Mashがfreshに承認した「v2 validator／production traceの設計と、R03 / R04のreference-state契約を先に確定する」設計補正を含めて完了した。corrected allowlistはM01 / M02 / M03 / M04 / M05 / M07 / M08 / C08 / C09 / C10のexact10であり、actual writeはruntime exact7（M01 / M02 / M03 / M04 / M05 / M07 / M08）とcanonical design exact3（C08 / C09 / C10）に閉じた。M06 runner、C11 / C12、元設計のhistorical recordは変更していない。runtime commitの確定値はI04 runtime handoffとdual-repo fresh remote post-verify記録を正とする。

### 32.1 v1 / v2 validator and preactivated boundary

validatorはschema versionのv1 / v2 exact dispatchとし、unknown schema、mixed child schema、cross-version artifact refをrankより前にSTOPする。v2 projection spineは、frozen v1 Layer 1 childrenとv2 subjective claimsをsame sourceからbottom-upでexactに構成する。v2 direct shapeはnode kind authoritativeのprivate ownerであり、v1 direct shapeのlegacy bytesとactive `compile_stage1_response` facadeのsource / AST bytesは不変である。

active response schemaは`cocolon.cmee.v1a.emlis_stage1_response.v1`のままで、v2 production helperは`PREACTIVATED_DISABLED`である。public schema / API / DB / RN / persistence / production route、provider / network / dependency / fallbackに効果を与えず、private body generation、formal run、human read、Product Readも実行していない。

### 32.2 Normal form, preference profile and global rank

normal form exact6 phases、discourse preference profile exact8 rules、Japanese local preference exact7 rulesをclosed ownerとした。candidate axesはlayout 4 × mention 2 × link 2 × head 1で、internal maximumはexact16、visible-equivalenceを経たemitted candidateはexact2である。representativeはfull canonical bytesで決め、collisionはSTOPする。required duty orderはflattened canonical seed orderに固定し、seed A / B / Aの逆順操作でもsame-seedの結果は不変である。hash-only、first-seen、candidate ID tie-breakを代替ownerにしない。

### 32.3 R03 / R04 reference-state and explicit cause

R03は`PROJECTED_RESPONSE_OBJECT`のsingular exact1だけを「そのこと」へ投影する。R04はsame ordered exact2 pairのimmediately prior response objectsだけを「その両方」へ投影する。どちらもraw text similarity、substring、fixture order、candidate historyをdecision ownerにせず、reference-state bundleからpublic graph refへ一意に写す。singular / pairのcardinality、ordered pair、immediately prior、projection bindingのいずれかが不成立ならanaphorへfallbackしない。

source-explicit causeはF09（frame-internal cause）とL05（already-owned / frame-internal link）の契約でproduction composerとv2 traceの両方へ到達する。causeをgeneric external connectiveとして二重表示しない。

### 32.4 Production trace and common guard

v2 visible unitは次のtrace seal exact6を持つ。

| Seal field | Contract |
|---|---|
| `covered_duty_refs` | selected unitが履行したdutyのcanonical ordered cover |
| `sentence_job_refs` | unitが実現したsentence jobのcanonical ordered cover |
| `source_reception_act_refs` | source / reception actへのexact provenance |
| `composition_candidate_ref` | selected composition candidate exact1 |
| `composition_layout_ref` | selected layout exact1 |
| `selected_stage1_artifact_ref` | same selected Stage 1 artifact exact1 |

trace validatorはsource → grounded plan → graph → v2 projection → selected unitsをcanonical production pathで再生し、visible unit / positive extension / artifactの同値性を比較する。coordinated unitのsealを一括置換するco-tamperも、caller-provided seal同士の整合だけで通さずSTOPする。grouped temporal unitはclauseごとのrelation / node / evidence exact coverを必須にする。

common guard proofはraw guardの`passed` / dispositionを改竄せず、typed admissionはexact typed quotationが成立する場合だけに閉じる。raw failureをtyped successに書き換えず、raw failure proofを保持する。

### 32.5 Identity, proof denominator and next boundary

I03までのbehavior root exact22はM08 `emlis_v1a.py`不変を前提としていたため、I04でM08 exact6を追加し、behavior rootをexact28（owner cardinality M01 / M02 / M03 / M08 = 2 / 15 / 5 / 6）へ補正した。M08 exact6からのtransitive AST closureもidentity対象に含める。I04 postimage identityは次の通りである。

```text
LANGUAGE_CORE_IDENTITY_POST_I04 = f979368cc28a920553f9b95894492cb9a9aad4e7c890eba9181c6d68e5994c55
STAGE1_RUNTIME_INTEGRATION_IDENTITY_POST_I04 = 0998ff14f2bd6b5853ebb09d8eb098b9a04c88c6c02b545c1ab674ad151bc266
ACTIVE_FACADE_SOURCE_SHA256 = 127858adb26813f83111f5b6fb0ec8116ad46d371ed9a91d8b60a48157976515
ACTIVE_FACADE_AST_SHA256 = ebdf3a8ab86537572c0ce7e9db89aae6c7bdd2f0c945d2d0e79de637a3364f47
```

public machine regressionはcontracts 152件＋vertical 44件の196 / 196 GREENで、I04 mandatory / strengthened gateは11 / 11 GREEN、compileall / role import / diff checkはPASSである。これはprivate disabled routeのmachine proofであり、I05のidentity freeze、full public proof、Product Readを先取りしない。

I04のdual-repo fresh remote post-verify後の次工程はI05である。I05はbehavior delta 0でidentity freezeとfull public proofだけを所有し、fresh explicit startなしに開始しない。I09のactivationはresponse facadeとgrounded-plan runtime resolverのatomic exact2であり、compile body単体exact1へ縮退させない。

```text
ROUTE_A_V2_I04_NORMAL_FORM_RANK_COMPOSER_TRACE = COMPLETE_DISABLED_DESIGN_CORRECTED
CORRECTED_ALLOWED_PATHS / ACTUAL_RUNTIME / ACTUAL_DESIGN = 10 / 7 / 3
NORMAL_FORM / PROFILE / LOCAL_RULES = 6 / 8 / 7
CANDIDATE_MAXIMA / INTERNAL / EMITTED = 4x2x2x1 / 16 / 2
REFERENCE_R03 / REFERENCE_R04 = そのこと / その両方
SOURCE_EXPLICIT_CAUSE = F09_L05_PRODUCTION_AND_TRACE_REACHABLE
V2_UNIT_TRACE_SEAL = EXACT6_CANONICAL_REPLAY
N2_BEHAVIOR_ROOTS = EXACT28_CARDINALITY_2_15_5_6
PUBLIC_MACHINE_REGRESSION = 196 / 196 PASS
ACTIVE_V1 / PRIVATE_V2 = UNCHANGED / PREACTIVATED_DISABLED
NEXT_STEP = I05_IDENTITY_FREEZE_AND_FULL_PUBLIC_PROOF_BEHAVIOR_DELTA_0_REQUIRES_FRESH_EXPLICIT_START
I09_ACTIVATION = ATOMIC_EXACT2_RESPONSE_FACADE_PLUS_GROUNDED_PLAN_RUNTIME_RESOLVER
AUTOMATIC_PROGRESSION = FALSE
```

## 33. Route A v2 I05 — identity freeze / full public proof（2026-08-27）

I05はN2.4のidentity freezeとfull public proofをbehavior delta 0で完了する。I04補正後の正しいdenominatorはbehavior root exact28（M01 / M02 / M03 / M08 = 2 / 15 / 5 / 6）とpublic named tests 196（contracts 152＋vertical 44）である。元final design本文のexact22 / 191はhistorical pre-correction値であり、本節とI05 terminal checkpointがsupersedeする。

I05監査で、M08 behavior root `_realize_cmee_experience`からimport bindingを介してactive M03 `compile_stage1_response`本体までLCI closureが到達していることを検出した。この状態ではI09 activation時にlanguage identityが変わり、`LANGUAGE_CORE_IDENTITY_N4 == N3_LANGUAGE_CORE_IDENTITY`を満たせない。M02の既存identity infrastructure owner `_language_core_source_owner_payloads`だけを補正し、次のI09 activation exact2をpath-qualifiedにclosure対象外とした。

| I09 activation owner | I05 state | LCI / runtime integration |
|---|---|---|
| M03 `compile_stage1_response` | active v1 body unchanged、activation excluded | body changeでLCI不変、whole-file runtime identity変化 |
| M08 `build_text_grounded_limited_artifact` | v1 schema resolver unchanged from I04、activation excluded | body changeでLCI不変、whole-file runtime identity変化 |
| M08 `_build_stage1_grounded_observation_plan_for_schema` | preactivated private behavior owner | closureに残り、body driftでLCI変化 |

M08に残る`compile_stage1_response` import binding descriptorはunchangedであり、M03 target declaration / bodyだけを除外する。name-global exclusion、private resolver exclusion、behavior helper refactorは行わない。atomic exact2をtemporary sourceでsimulationし、changed top-level AST symbol exact2、LCI equality、runtime integration inequalityを確認した。single-owner切替はI09 admissionにならない。

### 33.1 frozen N3 identity

```text
N3_LANGUAGE_CORE_IDENTITY = fc337cc7712d461d594dd8ec45ec46da10939a8d18dedc3fc4cf9246fe6a5f3d
N3_RUNTIME_INTEGRATION_IDENTITY = 8f9eb006847beb24446cacb64228c70ef7852a2e7cc364913e6876a99a9f8e3d
LANGUAGE / RUNTIME_PAYLOADS = EXACT16 / EXACT16
LANGUAGE_EXACT16_NAME_SHA_BYTES_TUPLE_SHA256 = f29ab019e5bb1d36617157a5f141c9c11adf8f52109e16665364573fe613e565
RUNTIME_EXACT16_NAME_SHA_BYTES_TUPLE_SHA256 = fdf5f722513485b9f8e9718512915eb12d76f03b05ec94bc9180826cdacfb726
SOURCE_OWNER_CLOSURE = FILES7_DECLARATIONS1070_IMPORT_BINDINGS354
SOURCE_OWNER_PAYLOAD_EXACT7_NAME_SHA_BYTES_TUPLE_SHA256 = 4c959b6ba61ff5135417e91d296d0291e4e246183040c3f639afab9d8694dbfe
SOURCE_OWNER_SYMBOL_SET_PATH_DECLARATIONS_IMPORTS_SHA256 = c3baf89b8810fc71c4468aa0f00262fc2626febccb12f9bece049cdd6ba85e58
PRODUCT_CAUSAL_OWNER_MANIFEST_FILES_SEEDS = 7 / 55
PRODUCT_CAUSAL_OWNER_SEED_CARDINALITIES = 18 / 10 / 11 / 10 / 3 / 1 / 2
PRODUCT_CAUSAL_OWNER_MANIFEST_SHA256 = c499a7b048dac5afc6e81fc7b44564c25d110b1c4d1e86b8507015133e81de3c
BEHAVIOR_ROOT_EXACT28_SHA256 = e2484757b2e834ea27febec130cacff36deb2df9ddc15a66f25f38708aec0606
IDENTITY_INFRASTRUCTURE_EXACT5_SHA256 = 1df267709164af1ce8e3ee443eddad14c83efa132bb1cf87492ab8cccf9f9c27
I09_ACTIVATION_EXACT2_SHA256 = 1eb7baf3fcc2673f0d73ecf1663f140baa955967a4e3066e54913b978f9d9e79
```

SHA tupleはUTF-8、`ensure_ascii=false`、key sort、separator `,` / `:`のcanonical JSONで、ordered `(name, sha256(payload bytes), byte_count)`をhashした値である。name＋SHAだけの別tuple値と混同しない。payload exact16の個別値はcanonical 05 §30を正とする。

### 33.2 runner freeze and public proof

M06はI06がM07 / C10 body-freeだけを変更できるよう、successorを事前固定した。unit IDはcanonical underscore spelling `cocolon.cmee.stage1.route_a.typed_japanese_case_frame_realizer.20260826.v1`であり、I01–I04 receiptのdotted spellingはhistorical typoとして書換えず、本I05からsupersedeする。

```text
SET = SUCCESSOR_EARLY_LANGUAGE_SET_EXACT8
ATTEMPT = SUCCESSOR_EARLY_LANGUAGE_ATTEMPT_01
ULTRA_READ = SUCCESSOR_EARLY_ULTRA_KNOWN_READ_ATTEMPT_01
PRO_READ = SUCCESSOR_EARLY_PRO_COMBINED_READ_ATTEMPT_01
I05_RUN / PRIVATE_INPUT_READ / PRIVATE_OUTPUT / HUMAN_READ = 0 / 0 / 0 / 0
```

runnerはprivate inputを開く前に、N3 identity pair、exact16 rows / tuple、source-owner closure、owner manifest、behavior exact28、identity infra exact5、activation exact2をfresh再計算してliteral equalityを要求する。旧`CMEE_STAGE1_STEP3_3_ATTEMPT_01`と旧identity `ab4a6b… / 49da471…`はcounter 2 / 2 immutable、attempt / output / read reuse falseのpredecessor recordだけに残る。同じretained inputのraw SHA `af718e82…` / set digest `489dcf87…`はpredecessor outputではなく、I06 successor exact1だけへ再bindされ、I05では消費していない。

public proofは既存test functionを増やさず196 / 196 GREEN、mutation273、source boundary208、skeleton22、A / B / A、idempotence、compileall、role import、diff checkをPASSした。active facade source / AST SHAは`127858…` / `ebdf3a…`、M08 public resolverのI04-current source / AST SHAは`01d901…` / `c1d3ab…`で不変である。M01 / M03 / M05 / M08、public schema / API / DB / RN / persistence / production routeにdeltaはない。Product runtimeのexternal AI / provider / network / new dependency / fallbackは0であり、GitHub control-plane transportはこのproduct-runtime network 0に含めない。

```text
ROUTE_A_V2_I05_IDENTITY_FREEZE_FULL_PUBLIC_PROOF = COMPLETE_ONLY_AFTER_DUAL_REMOTE_POSTVERIFY
ACTUAL_RUNTIME_PATHS = M02,M04,M06,M07
ACTUAL_DESIGN_PATHS = C08,C09,C10
STRUCTURE_MAP_DELTA_NONE = TRUE
PRIVATE_GENERATION / FORMAL / HUMAN_READ / PRODUCT_READ = 0 / 0 / 0 / 0
PRODUCT_CREDIT = 0
NEXT_STEP = I06_AFTER_FRESH_EXPLICIT_START
AUTOMATIC_PROGRESSION = FALSE
```
