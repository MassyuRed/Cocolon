# CMEE V1-A — EmlisAI Observation Vertical 詳細設計

- document id: `cocolon.cmee.v1a.emlis_observation.detailed_design`
- revision date: `2026-09-05 JST`
- lifecycle: `CURRENT_PRODUCT_OWNER_NON_PASS / REALIZABLE_RECEPTION_EXPRESSION_WORK_STAGE1_ACTIVE`
- runtime state: `DRAFT_WIP_DISABLED_INHERITED_OWNER_CHAIN_IM10_NON_PASS`
- historical predecessor implementation evidence: `MassyuRed/mashos-api Draft PR #3 @ d26b3521f0cd63421af3596277145b2e52dafbbe / NOT_CURRENT_OWNER_HEAD`
- historical predecessor Stage 1 correction checkpoint: `STEP7_V2_MACHINE_GREEN_PRODUCT_REJECTED / NOT_CURRENT_CHECKPOINT`
- historical predecessor Stage 1 additional correction checkpoint: `STEP3_COMMON_DEFECT_RETURN_BUDGET_EXHAUSTED_STOP / COUNT_2_OF_2 / EARLY_ACTUAL_NOT_RUN / NOT_CURRENT_CHECKPOINT`
- current implementation evidence owner: `MassyuRed/mashos-api Draft PR #3 / fresh remote head and latest existing runtime handoff; System Context doctor fallback does not bind current runtime head`
- current Stage 1 checkpoint: `INHERITED_OWNER_CHAIN_IMPLEMENTED_NOT_ACCEPTED / IM10_NON_PASS`
- R1–R4 state: `CLOSED_GREEN`
- original exact8 machine structural state: `8/8`
- private human Product Read: `CURRENT_EVALUATED_NON_PASS / HISTORICAL_PREDECESSOR_EVALUATED_FAIL_STOP`
- candidate ready: `false`
- production admission: `false`
- current authorized next implementation: `FRESH_MASH_LEVEL3_CMEE_STAGE1_SELECTED_SUBJECTIVE_RECEPTION_FORWARD_INVERSE_REQUEST_LOCAL_CONTRACT_20260905 / CONTINUE_APPROVED_SOURCE_AND_BODY_CORRECTION`
- automatic progression: `false`
- Cycle001 effect: `0`
- Stage 1 language route: `ROUTE_A_PROVIDERLESS / SOURCE_GROUNDED_REALIZABLE_RECEPTION_EXPRESSION / HUMAN_RECEPTION_SOLE_LAYER2_AUTHOR`
- Phase 0 / P0 / P0-R1 / standalone product-delta-0 L3-R / L3-I lifecycle: `RETIRED_HISTORICAL_NONREUSABLE`
- current implementation rule: `PRODUCT_QUALITY_DELTA_GT_0_AND_MASH_CONFIRMED_ONLY`
- Step 10 integrated revision: `CMEE_STEP10_ULTRA_FINAL_INTEGRATED_REVISION_PROPOSAL_20260821_V2_REFLECTED`
- Stage 1 historical predecessor additional correction final body, not current: `ROUTE_A_ONLY / STEP3_COMMON_DEFECT_RETURN_BUDGET_EXHAUSTED_STOP / EARLY_ACTUAL_NOT_RUN`

2026-09-05最新：過去の発言・思考を現在願望へ寄せない限定修正を実装・検証した。元span／typed fragmentの既存時間分類と、分割前の引用・話者・疑問境界を同じownerで確認し、Human Receptionは原文確認済みの当時参照を用いる。固定sourceで同じ100件direct100、Move／expression／binding124、外側73/27。nuclei時制とselected identityが2件変化、フォローの局所改善は利用不可側1件、生成可能73件の本文変更0。残98件は全保存項目同一、観測・可否・理由・選択act／対象／支援先の変更0。全204検査200成功／既存4失敗、新規失敗0・未実行0。華恋が原入力全フィールド・観測・フォロー100件を全文確認しNOT_CLEAR。今回のGate／parser／閾値・歴史的hash／PASS変更0。途中2版と追加検査案の失敗は保存した。詳細は02 §38、06末尾、既存runtime handoff末尾。長い復唱・同じ締め・意味分類と対象選択が残り、商品確認準備／ready／採用／merge／本番／問い／Layer3は未成立。

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

[mashos-api Draft PR #3](https://github.com/MassyuRed/mashos-api/pull/3)には、input-specific meaning、meaning projection validation、Grounded Observation Plan、Grounded Sentence Plan／sentence realizer、Human Reception／reception realizer、final-body-only inverse／Gateを既存owner chainで接続したoffline disabled verticalが実在する。current headは`4e8d397843c0381bc94379b71665cf71b80d7d1b`で、compositionはfinal surfaceを所有しない。

canonical100はdirect active final surface 100/100、outer engineはgenerated-disabled 68／有限fail-closed 32である。active final-language identityはpayload exact18、product causal source owner exact9へ更新した。全100件でproduction effect 0、candidate ready false、Product Read eligible false、automatic progression falseを維持する。これはIM10実施前のtechnical baselineであり、current private human Product Readはlatest §35の`IM10=NON_PASS`を優先する。過去candidateの`EVALUATED_FAIL_STOP`はhistorical predecessor verdictとしてだけ保持する。

従って、これは未実装ではなく`IMPLEMENTED_NOT_ACCEPTED`の`DRAFT_WIP_DISABLED` current baselineである。body-full input／candidateは本designへ転記せず、current NON_PASSのままacceptance、ready、mergeまたはproductionへ進めない。

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

## 34. Inherited V1-A final-owner contract（2026-09-01）

本節はcurrent V1-A owner contractについて§33よりfreshである。§0–§33のpredecessor state、identityおよび実装checkpointは履歴として保持する。

meaningとvisible artifactのownershipを次の一方向へ閉じる。

1. `emlis_input_specific_meaning.py`がinput-specific candidate、hard validity、selection、NORMAL／LIMITED、selected meaningを所有する。
2. `emlis_stage1_response.py`がselected meaningを同一object／refのままdownstreamへcarryする。
3. `emlis_stage1_composition.py`はmeaning projectionのschema／ref／identity／non-mutationだけを検証し、meaning、Grounded View、plan、Reception、visible surfaceを再導出しない。責任codeは`MEANING_PROJECTION_VALIDATION_ONLY_NO_FINAL_SURFACE_OWNER`である。
4. `emlis_ai_grounded_observation_plan.py`がfinal Grounded Observation Planを所有する。
5. `emlis_ai_grounded_sentence_surface.py`がfinal Grounded Sentence Plan、sentence realization、final-body-only parserを所有する。
6. `emlis_ai_grounded_human_reception.py`がfinal Human Receptionとtarget＋attention＋whyを含むreception realizationを所有する。
7. `emlis_ai_grounded_observation_gate.py`がforward metadataを受け取らないbody-only inverseとindependent source matchingを所有する。

visible Layer 1は具体的な出来事、願い、block、変化、relation、source boundaryを選択済みmeaningから保持し、Layer 2はそのclaimへtarget＋attention＋whyでbindする。unknownを埋めず、relation direction／roleを反転せず、unselected meaningをvisible coverageへ昇格しない。

NLSv3／Cycle001のlarge recovery moduleは`NOT_ADOPTED`で、継承対象は責務とprotected test knowledgeだけである。canonical100 bridgeとbody-only inverse protected vectorsをprotected pathに置くが、それ自体はProduct Readではない。

```text
CURRENT_PRODUCT_OWNER_ADOPTION_STATE = IMPLEMENTED_NOT_ACCEPTED
IM10 = MASH_PENDING
CANDIDATE_READY = false
PRODUCTION_EFFECT = 0
CUTOVER / MERGE / API / DB / RN = 0 / 0 / 0 / 0 / 0
EXTERNAL_GENERATIVE_AI / PRODUCT_RUNTIME_NETWORK / FALLBACK = 0 / 0 / 0
AUTOMATIC_PROGRESSION = false
```

current evidence headは`4e8d397843c0381bc94379b71665cf71b80d7d1b`、current language/runtime identity payload countは18/18、product causal source owner countは9である。canonical100はdirect 100/100、outer generated-disabled 68／finite fail-closed 32を保持する。N3 exact16／source-owner exact7、historical exact17 receipt、IM06 approval freezeはcurrent bytesへ遡及更新しない。

## 35. IM10 Mash Product Read NON_PASS / follow-primary completion contract（2026-09-02）

本節はV1-Aの商品本文、current verdict、次の実装方向について§34よりfreshである。Mashのcurrent Product Readにより、current disabled exact8は`NON_PASS`である。内部のinput-specific meaning、Grounded Observation Plan、Human Reception、trace、body-only inverseが存在しmachine resultがGREENでも、visible本文がユーザー入力の近い言い換えと短い定型的followへ縮退している限り、EmlisAIの商品品質は成立しない。

### 35.1 current product roles

Layer 1「見えたこと」は、Emlisが何を根拠に読んだかをユーザーが確かめられる必要最小限の観測である。Layer 2「Emlisから」は、Emlisがその入力をどう受け取り、何に目を向け、何を感じ、どの距離と姿勢で言葉を返すかを担うユーザー向け主本文である。

Layer 1では、入力文の反復、語尾変更、短い引用または構造labelの提示そのものを観測成立と数えない。入力のどこを意味の中心として受け取り、どの出来事、状態、願い、block、変化または関係が同時に／順に／緊張して置かれていると読んだかが、その入力固有に分かる必要がある。ただし、本人が示していない原因、人格、診断または他者意図を補わない。

主従は次に固定する。

```text
PRIMARY_USER_FACING_BODY = LAYER_2_EMLIS_KARA
MINIMUM_GROUNDING_AND_TRANSPARENCY = LAYER_1_MIETA_KOTO
LAYER_1_ZERO = FORBIDDEN
LAYER_2_ZERO = FORBIDDEN
```

Layer 2はLayer 1の要約、言い換え、感情labelの付加または固定closeではない。ユーザーが置いた出来事や状態を受け取り、その入力固有の重要点へEmlisとして目を向け、その受け取りを人間的な流れで返す。華恋との雑談にあるような「何を受け取ったか、そのことをどう考えたか、その上で何を伝えるか」という内容上の連続性を持たせる。これは必須質問、相槌formulaまたはturn-takingを意味せず、会話ではない場面でも一方向の「Emlisからユーザーへの言葉」として成立させる。ただし、これを固定した三文構成、定型sequenceまたはcase別完成文として実装してはいけない。

### 35.2 dynamic meaning-role ratio

配分は文字数、文数、token数のquotaではなく、完成本文の中で各Layerが担う意味役割の比率である。入力ごとに次の範囲で動かす。

| Input family | Layer 1 観測 | Layer 2 フォロー |
|---|---:|---:|
| 日常の出来事、感情の受け取り | 1〜3 | 9〜7 |
| 通常の悩み、迷い、自己理解 | 3〜4 | 7〜6 |
| 構造説明を明示的に求められた入力 | 最大4 | 最小6 |

全体範囲は`観測1：フォロー9`から`観測4：フォロー6`である。入力に観測材料が少ない場合もLayer 1を水増しせず、Layer 2をgeneric empathyで埋めない。入力が構造的でも、内部分析の説明が主本文を占有しない。

旧`emlis_ai_state_answer_human_follow_definition_2026_05_26.md`等に残る標準`観測6：フォロー4`、構造要求時`観測7：フォロー3`はhistorical product positionとして保持するが、本節がcurrent V1-A product positionとしてsupersedeする。これは2026-09-02に新しく思いついた比率ではなく、2026-06-01までの会話で固定されていたfollow-primary方向をcurrent ownerへ復元したものである。

### 35.3 current actual failure boundary

current mashos-api head `4e8d397843c0381bc94379b71665cf71b80d7d1b`のactive disabled owner chainでは、`emlis_v1a.py`の`_cmee_semantic_reception_plan()`が`CMEE_RECEPTION_MATERIAL_MODE="limited_grounding"`でReception planを作り、その後`compile_stage1_response()`が、このactive compilerへ到達した各`grounded_plan`を`material_quality="limited_grounding"`、`response_kind="limited_grounding_observation"`、`hedge_policy="limited_single_input_scope"`へ置換して`build_grounded_sentence_plan()`と`realize_grounded_sentence_plan()`へ渡す。sentence plannerはlimited branchで単一の`render_limited_scope` observationを作り、その後にhuman followを加える。この一連の境界が最初に追うべきproduct-causal seamである。

同fileに残る`_compile_stage1_response_v1_legacy()`は、case-frame candidate builder／selectorを使うisolated historical test ownerであり、active facadeとrunnerは呼ばない。したがって、registryや設計構造の存在をvisible本文への到達証拠にせず、current actual callerから最終表示bodyまでを追って修正する。

これはconstantまたは三つのliteralを解除するだけの変更指示ではない。実装時はReception material mode、入力固有meaning、source／unknown／safety境界、Layer 1／2 plan、realizer、Gate、public response mappingへの影響を同じbounded unitで読み、未知入力にも効く共通原因の修正だけを行う。fixture語、case ID、case別mode、固定surface、外部生成AI、provider、fallbackを追加しない。

### 35.4 completion route

1. `ROUND0_FOLLOW_PRIMARY_VISIBLE_RESPONSE_CORRECTION`: current actual callerからLayer 1／2 final bodyまでを修正し、同じ代表入力のbefore／afterでactual visible qualityを非0改善する。
2. `KAREN_BODY_FULL_PRE_SCREEN`: 華恋がprivate本文を全件読み、復唱、近い言い換え、label置換、少数template、generic follow、Layer 1／2同義反復、不自然な日本語、深さ不足が一つでも残る間はMashへ提示せず、同じproduct-causal correctionへ戻る。
3. `MASH_ROUND0_PRODUCT_READ`: actual before／after本文をMashへ提示する。Mashの明示PASSだけがRound 0商品通過であり、machine GREEN、華恋pre-screenまたはGitHub反映で代替しない。
4. `FREE_ONE_QUESTION_END_TO_END`: Round 0 PASS後のfresh explicit startで、重要unknownがある場合だけ問いexact1を返し、supplemental answerをoriginal inputと別の`USER_OWNED_SOURCE`として保存し、その根拠だけでLayer 1／2をrefineする。API／DB／Supabase／RNはcurrent contractとactual schemaを先に確認し、必要な既存経路だけを変更する。
5. `PLUS_PREMIUM_LAYER3_AND_LATER_ROUNDS`: Layer 3、eligible history、Premium sequential roundsは、Free一問end-to-end後の別判断とする。

一つのcommon-cause correctionをactual final bodyまで完了しても同種の引用化、定型化またはgeneric followが残る場合、同じ修正方針を名前だけ変えて自動反復しない。actual before／after、残存欠陥、到達したactive path、providerless current routeの能力限界を固定し、Mashのmethod／product判断へ`STOP`する。別設計、別helper、同じstrategyの再実装または問いstageへの先送りで回避しない。

各実装work unitはactual user-visible outputの改善、必要なsource／test、GitHub checkpoint、fresh remote bytes／changed paths確認までを同じ単位で完了する。document、framework、schema、trace、test、internal reviewだけのunitを商品作業として挿入しない。既存mashos-api handoffをcontinuity ownerとして更新し、新しいhandoff file、parallel design、checker、score、authority familyを作らない。

```text
IM10 = NON_PASS
CURRENT_PRODUCT_OWNER_ADOPTION_STATE = IMPLEMENTED_NOT_ACCEPTED
CANDIDATE_READY = false
ROUND0_CORRECTION = APPROVED_ROUTE_NOT_STARTED
QUESTION / LAYER3 = NOT_STARTED
CURRENT_AUTHORIZED_IMPLEMENTATION = NONE_UNTIL_FRESH_SESSION_EXPLICIT_START
PRODUCT / TECHNICAL CREDIT OF THIS DOCS REFLECTION = 0 / 0
ADMINISTRATIVE_RESULT = APPROVED_PRODUCT_DECISION_DURABLY_RECORDED
PRODUCTION / CUTOVER / MERGE / API / DB / SUPABASE / RN EFFECT = 0 / 0 / 0 / 0 / 0 / 0 / 0
AUTOMATIC_PROGRESSION = false
```

## 36. Source-grounded realizable Reception expression current contract（2026-09-04）

本節は、IM10 NON_PASS後のWork Stage 1におけるcurrent root cause、owner境界、実装順について§35および§34よりfreshである。§1–§33、旧Route A、case-frame route、IM00–IM10、前回focus selectorの記録は履歴として保持するが、current実装入口には使わない。

```text
AUTHORITY = FRESH_MASH_LEVEL3_CMEE_WORK_STAGE1_REALIZABLE_RECEPTION_EXPRESSION_CANONICAL_INTEGRATION_AND_HUMAN_RECEPTION_BODY_CLOSURE_20260904
CURRENT_COMMON_CAUSE = FINAL_STAGE1_HUMAN_RECEPTION_MOVE_PLAN_CONTENT_FLOW_COLLAPSE
ROOT_CAPABILITY_GAP = SELECTED_MEANING_TO_GRAMMATICALLY_REALIZABLE_HUMAN_RECEPTION_EXPRESSION_CONTRACT_ABSENT
CURRENT_CAPABILITY = SOURCE_GROUNDED_REALIZABLE_RECEPTION_EXPRESSION_CONTRACT
PREVIOUS_FOCUS_SELECTOR_AUTHORITY = CONSUMED_TERMINAL_STOP_DO_NOT_RETRY_RENAME_OR_RECREATE
ROUTE = PROVIDERLESS_EXISTING_OWNER_CHAIN_ONLY
EXTERNAL_GENERATIVE_AI / PROVIDER / PRODUCT_RUNTIME_NETWORK / FALLBACK = 0 / 0 / 0 / 0
```

### 36.1 corrected causal finding

pre-IM10設計の「主因は上流のinput-specific meaning decisionであり、日本語realizerそのものではない」という診断は当時の履歴として正しい。しかし、IM00–IM09でmeaning decisionを実装し、IM10およびrequired Human Reception Move 124件をactual bodyまで追った後にも、selected meaningを文法的に実現可能な形で各Moveへ渡すcurrent active carrierが存在しないことが確定した。

現在のselected meaning、`MeaningBoundReception`、Grounded Situation View、visible causal traceは、predicate、owner、relation、polarity、modality、time、scope等を保持している。一方、current `GroundedReceptionMovePlan`はMoveのtarget、support、evidence、act、surface strategyまでであり、それらをactor／predicate／ordered arguments／case／morphology／referenceへ変換して最終segmentへexactにbindする契約を持たない。この断絶により、Sentence SurfaceがMove act中心のgeneric followを再生成し、内部meaningが存在してもactual Layer 2で失われる。

したがってcurrent one-way routeは次だけである。

```text
selected input-specific meaning -> MeaningBoundReception
or bounded LIMITED outcome -> BoundedLimitedReception
  -> SourceGroundedRealizableReceptionExpression exact1 per selected plan Move
  -> existing Human Reception Move consumes expression
  -> Human Reception-authored Layer 2 segment
  -> Sentence Surface arrangement only
  -> independent Gate / final-body-only inverse / public mapping
```

expressionはmeaningを再選択しない。Move act、style、temperature、surface strategyからmeaningへ逆流しない。NORMAL／LIMITED以外の分類、ontology、Move family、fixture-specific modeを増やさない。

### 36.2 fit-gap and asset disposition

| asset | current disposition | current use |
|---|---|---|
| input-specific meaning、MeaningBoundReception、BoundedLimitedReception | `ACTIVE_AND_RETAIN` | meaning sole owner、NORMAL／LIMITED、fake selected reading防止を維持 |
| Grounded Situation View、semantic projection、visible causal trace | `ACTIVE_AND_RETAIN` | source-grounded expression derivationのtyped evidence |
| existing Opportunity／Depth／required Move | `ACTIVE_AND_RETAIN` | selection済みMove dutyを変更せずexact-cover domainにする |
| R8 owner map: Opportunity／Depth／Move=`Grounded Observation Plan`、Clause／semantic segment=`Human Reception`、multi-Move layout=`Sentence Surface`、12 Gates=`Gate` | `ACTIVE_AND_RETAIN_WITH_EXCLUSIVE_OWNER_CORRECTION` | Move selectionとGateは維持し、Layer 2 authorshipだけをHuman Reception exact1へ閉じる |
| Human Reception clause realization | `ADAPT_AND_INHERIT` | expressionからLayer 2 semantic clauseとvisible segmentを同一passで作るsole author |
| Sentence Surface multi-Move layout | `ADAPT_AND_INHERIT` | 配置、結合、句読点、文境界、body parserだけを保持 |
| `JapaneseCaseFrameSpec`、`ArgumentRealizationPlan`、`PredicateMorphologyPlan`、`JapaneseClauseIR`のpure grammatical knowledge | `ADAPT_AND_INHERIT` | Human Reception内部のbounded predicate／argument／case／inflection bindingへfield知識だけ継承 |
| `SurfaceDerivation`、ClauseFrame、visible semantic binding知識 | `ADAPT_AND_INHERIT` | Human Reception realizationと同一passのsegment-level bindingへ継承し、whole-line後付けを廃止 |
| NLSv3の小さいowner-role inflection／typed recomposition原理 | `ADAPT_AND_INHERIT` | app-wide moduleを使わずHuman Reception内部のpure ruleへ限定継承 |
| NLSv3のfailure taxonomy／Product Read知識 | `RETAIN_AS_TEST_OR_FAILURE_KNOWLEDGE` | generic collapse、meaning loss、full-body read境界のregression知識だけ保持 |
| historical `ResponseObjectExpression`のsource anchor、polarity、modality、time、EXPLICIT／COMPOSITE／ANAPHORIC知識 | `ADAPT_AND_INHERIT` | 新contractのfield knowledgeだけ継承する |
| historical `ResponseObjectExpression` type／projector／storage／旧order | `HISTORICAL_ONLY` | 型、carrier、`SealedCompositionPlan` storageを復活させない |
| Gate、body-only inverse、source／unknown／safety protection、composition validation-only | `ACTIVE_AND_RETAIN` | forward expression metadataに依存しない独立verificationを維持 |
| old Route A composer／selector／rank、active case-frame route、`compose_stage1_from_projection()`、旧linearizer、large NLSv2/v3 route | `NOT_ADOPTED_DO_NOT_REVIVE` | active import、wrapper、entrypoint call、fallbackを0に保つ |
| previous bounded focus selector method | `NOT_ADOPTED_DO_NOT_REVIVE` | terminal STOPを同名・別名・別helperで反復しない |
| previous focus selectorの124 Move failure、RR／NLSの失敗事実 | `RETAIN_AS_TEST_OR_FAILURE_KNOWLEDGE` | regressionと能力境界の証拠だけ保持 |

### 36.3 sole private expression contract

2026-09-05のMash承認により、本節と§36.4／§36.5のcurrent call contractは、既存のselected subjective decisionを明示的なrequest-local入力としてforward／replayへ共通に渡す。承認範囲、未完了状態、継承する検証条件は§38末尾を参照する。forward expression／surface／bindingを逆検証の正解にしない条件は維持する。

新しいparallel schema familyやshared CMEE ontologyは作らない。current implementationでは、late final Move identity／duty確定後からHuman Reception realizationまでだけ存在するEmlis-private、request-local、providerlessなschema v1をexact1作る。既存public response schema、DB、API、projection schemaのversionは上げない。expressionはrequest-local function argumentとreturn valueだけでHuman Receptionへ渡し、Human Reception-authored surfaceとvisible bindingはSentence Surfaceの配置結果までだけ運ぶ。`GroundedSentencePlan`を含む既存schemaは変更せず、Gate／body-only inverse／public mappingへexpression、binding、preauthored surfaceを渡さない。body-free metadataへprivate lexical materialを出さない。

production placementは既存`emlis_ai_grounded_human_reception.py` exact1とする。同fileに次のfrozen request-local typesを置く。

```text
SelectedSubjectiveReceptionDecisionV1
  one row per selected final Move, with its existing act/nucleus lineage
  existing meaning outcome / reception binding / projected claim / opportunity identity
  subjective_proposition: existing immutable SubjectivePropositionV2, lossless
  existing authoritative semantic/qualifier binding rows needed for exact joins

SelectedSubjectiveReceptionInputV1
  decisions: immutable tuple[SelectedSubjectiveReceptionDecisionV1, ...]
  authoritative projection preimage/seal and current plan/resolver grounding identity
  request-local only; not a serialized schema, public metadata, cache or Emlis self-state

RealizableReceptionArgumentV1
  semantic_ref: str exact1
  source_evidence_refs: tuple[str, ...] 1..N
  semantic_role: str exact1
  lexical_form: private str exact1
  requirement: REQUIRED | OPTIONAL
  omission_permission: FORBIDDEN | PERMITTED
  zero_realization_condition_refs: tuple[str, ...] 0..N; exact0 means ZERO forbidden, 1..N means ZERO is a permitted alternative
  omission_condition_refs: tuple[str, ...] 0..N; exact0 iff omission_permission=FORBIDDEN, 1..N iff PERMITTED
  case_marker: str | None
  direction_ref: str | None
  relation_endpoint_ref: str | None
  realization: EXPLICIT | ZERO | OMITTED

SourceGroundedRealizableReceptionExpressionV1
  schema_version: literal cocolon.emlis.human_reception.realizable_expression.v1
  expression_ref: str exact1 derived from complete canonical payload
  selected_subjective_decision_ref: str exact1; same Move's independently validated request-local SelectedSubjectiveReceptionDecisionV1
  meaning_outcome_ref: str exact1
  reception_binding_ref: str exact1 branch-specific one-of
    NORMAL: Move-function-matched MeaningBoundReceptionProposition exact1; Set ref is provenance only
    LIMITED: BoundedLimitedReception lineage, no fake selected reading
  move_id: str exact1
  source_evidence_refs: tuple[str, ...] 1..N
  actor_refs / subject_refs / experiencer_refs: tuple[str, ...], applicable union 1..N
  predicate_kind: str exact1
  lexical_head: private str exact1
  arguments: tuple[RealizableReceptionArgumentV1, ...] 1..N ordered
  polarity / modality / time_scope / aspect / degree / quantity / scope: str exact1
  qualifier_refs: tuple[str, ...] 0..N
  relation_refs / relation_endpoint_refs / direction_refs: tuple[str, ...] 0..N, applicable exact-cover
  reference_mode: EXPLICIT | COMPOSITE | ANAPHORIC
  antecedent_refs: tuple[str, ...] 1..N iff reference_mode == ANAPHORIC; exact0 otherwise
  antecedent_condition: str | None, required iff ANAPHORIC
  particle_plan / inflection_plan / nominalization_plan / clause_link_plan: tuple[str, ...] applicable 1..N
  provenance_refs: tuple[str, ...] 1..N

ReceptionVisibleSegmentBindingV1
  binding_ref: str exact1 derived from complete private binding payload
  expression_refs / move_ids: tuple[str, ...] 1..N
  human_reception_local_scalar_start / human_reception_local_scalar_end: int exact1 valid range
  surface_span_sha256: private str exact1
  clause_frame_fields: request-local mapping exact1
  surface_derivation_refs: tuple[str, ...] 1..N

SentenceSurfacePlacement (request-local tuple, not a schema or serialized record)
  binding_ref / sentence_id
  line_scalar_start / line_scalar_end
  body_scalar_start / body_scalar_end

final Stage 1 request-local call contract (not a schema or serialized record)
  selected_subjective_input = sole compiler bridge exact-join/seal output
  expressions = compiler bridge output for the active recovery candidate
  human_surface = realize_source_grounded_human_reception(
      ..., expressions, ..., selected_subjective_input=selected_subjective_input,
  )
  surface_result, placements = realize_grounded_sentence_plan_with_human_reception(
      sentence_plan, grounded_plan, resolver,
      human_reception_surface=human_surface,
      selected_subjective_input=selected_subjective_input,
  )
  realized_units = _adapt_grounded_surface_to_v2_realized_units(
      ...,
      human_reception_surface=human_surface,
      sentence_surface_placements=placements,
  )
  evaluate_grounded_observation_gate(..., selected_subjective_input=selected_subjective_input)
  evaluate_grounded_surface_body_inverse(..., selected_subjective_input=selected_subjective_input)
  independent_replay = replay_source_grounded_human_reception_from_plan(
      ..., selected_subjective_input=selected_subjective_input,
  )
```

`emlis_stage1_response.py`のsole bridgeがselected meaningとMove-function-matched MeaningBoundReceptionProposition exact1（Set refはprovenance only）、またはbounded LIMITED outcomeとBoundedLimitedReception exact1のいずれか、visible trace、およびexact-cover keyとして先に確定済みのread-only final Move duty／identityをexact joinし、Human Receptionのsole builderへ渡す。Move identityはexpressionの内容sourceではなく、どのmeaning outcomeをどのdutyへ実現するかを固定するkeyだけである。`emlis_ai_grounded_human_reception.py`の`realize_source_grounded_human_reception(reception_plan, expressions, nucleus_index, resolver, *, plan, recovery_stage, clause_plans, selected_subjective_input) -> GroundedHumanReceptionSurface`だけがexpressionをvalidate／consumeして本文とHuman Reception-local segment bindingを同一passで作る。`emlis_ai_grounded_sentence_surface.py`の`realize_grounded_sentence_plan_with_human_reception(sentence_plan, plan, resolver, *, human_reception_surface, selected_subjective_input) -> tuple[GroundedSurfaceResult, tuple[SentenceSurfacePlacement, ...]]`はcurrent final Stage 1 projection versionでだけ使うguarded entrypointである。そのresultをrequired request-local argumentで受け、binding ref exact1でjoinするplacement tupleとともにcompilerのcandidate tupleへ返す。既存`realize_grounded_sentence_plan()`のpublic／base signature、return、bytesは変更しない。compilerはrecovery candidateごとにsentence plan／surface result／Human Reception surface／placementを一つのcandidate identityとして保持し、選択後に別candidateのsidecarと混ぜない。compilerはそのcandidateとplacementをadapterへ同時に渡し、adapterがLayer 2 unit／binding identityとrange／hashを検証した時点でcarrierを破棄する。既存planやresponseへserializeせず、expression、preauthored surface、binding、placementをschema field、global state、cache、functional atom、log、Gateへ運ばず、同義field、compat field、parallel carrierは0である。

`SelectedSubjectiveReceptionInputV1`はexpressionより前に確定する上流判断の入力であり、forward生成metadataではない。sole bridgeは既存Phase A、sealed projection、selected NORMAL／bounded LIMITED outcome、trace、Move、nucleusとexact joinし、完全な`SubjectivePropositionV2`および必要な既存bindingを不変入力へ束ねる。content kind／mode／operator、selected contribution subset、response／basis／qualifier binding、appraisal等のtyped content、focal relation、actor／experiencer、assertion modality／epistemic scopeを落とさない。型・seal・grounding preimageの一致だけでsource忠実性を代用せず、既存のbranch-specific lineage、source／role／qualifier／relation検証を同時に維持する。

この入力はprojection seal後、recovery loop前に一度だけ構築する。各candidateは許可されたactive Move subsetだけを同じ入力へread-onlyでjoinし、meaningを再選択・変更しない。forwardとreplayは同じ入力を受けるが、replayはexpression、forward realization、surface、visible bindingを読まず、plan／Move／nucleus／resolverと上流判断から独立に文法realizationを再構成する。欠落、duplicate／foreign Move、別request／grounding、branch／claim／binding／focal relation不一致、seal後の変更は既存のnamed failureへ閉じる。Sentence Surfaceはreplay検証呼出しへ引数を通すだけで、selected meaningを執筆しない。この入力のlifetimeはrequest内のforward、Gate／inverse検証までとし、public mapping、response、DB、log、durable metadataへserializeしない。

各selected final plan Moveはexpression exact1を持ち、expression集合はselected final plan Move集合をexact-coverする。これにrequired Move全数がexact-coverされる。plan-owned optional Moveがexact-cover domainにある間はそのexpression exact1を要し、許可済みrecoveryでMove自体が除外される場合にだけ同時に除外する。planにないforeign／unused expressionは許可しない。missing、duplicate、foreign Move、unresolved source、role conflict、required argument欠落、invalid zero／omission、morphology gap、anaphora antecedent gapはfail closedする。一つの自然なvisible segmentが複数Move／expressionを担うmany-to-oneは許可するが、各expressionはvisible segmentへexact1以上到達する。

argumentの選択されたrealizationと、実現可能な代替としてのZERO／omission条件は別々にidentity-bearing payloadへ保持する。したがって`EXPLICIT`でも許可された代替条件refを保持できる。`ZERO`は既存antecedent／shared-subject／case dutyへ解決する`zero_realization_condition_refs` 1..Nを持ち、当該条件が全て成立することを要する。`omission_permission=PERMITTED`は`requirement=OPTIONAL`を必須とし、`OMITTED`はそれに加えて既存omission dutyへ解決する`omission_condition_refs` 1..Nを持ち、当該条件が全て成立することを要する。`REQUIRED+OMITTED`、`REQUIRED+omission_permission=PERMITTED`、condition無し`ZERO`／`OMITTED`、permissionとcondition cardinalityの不一致、foreign／unresolved／不成立conditionは`REALIZABLE_RECEPTION_EXPRESSION_ARGUMENT_GAP`へfail closedし、free-form推測またはfallbackで補わない。

成功recordへnullable failureを混ぜない。projector／realizerはsuccessまたは次のnamed failureを返す。

```text
MEANING_REALIZATION_CAPABILITY_GAP
MEANING_REALIZATION_CAUSAL_TRACE_GAP
REALIZABLE_RECEPTION_EXPRESSION_ARGUMENT_GAP
REALIZABLE_RECEPTION_EXPRESSION_MORPHOLOGY_GAP
REALIZABLE_RECEPTION_EXPRESSION_REFERENCE_GAP
REALIZABLE_RECEPTION_EXPRESSION_VISIBLE_BINDING_GAP
```

### 36.4 ordering, identity, and late rebuild

`compile_stage1_response()`は、input-specific meaning ownerのmeaning outcomeとprojectionを保持したまま、`_cmee_semantic_reception_plan()`によるfinal Move identity／duty domainの読み取りkeyを先に確定する。これはexact join先のidentityを確定するexecution sequencingにすぎず、Moveはexpression内容を決めない。その後、NORMALはselected meaning／MeaningBoundReception lineage、LIMITEDはbounded outcome／BoundedLimitedReception lineageのbranch-specific one-ofと、semantic projection、visible causal trace、Grounded Situation Viewから発話内容を構成し、read-only Move keyへexact1でbindしたexpressionを発行する。正規のcausal directionは`meaning outcome -> expression -> existing Move consumes expression`であり、Moveからmeaning／expression contentへのreselection／semantic backflowは0である。

各recovery candidateはactive Move集合、effective reference mode、argument realizationをexpression発行前に確定し、そのcandidate固有のcomplete payloadからexpression refをderiveする。同一candidateのsecond compiler validationは同じexpression refを再現し、Human Receptionの独立replayは同じ上流の`selected_subjective_input`とplanから同じ可視surfaceを再現する。optional Move除外またはEXPLICIT／ZERO／OMITTED変更時はMove集合とexpression identityをcandidate単位で再deriveし、発行済みexpressionを保持したまま変更しない。expression発行後に意味内容を変更できるのは0で、Sentence Surfaceは句読点と文境界の配置だけを扱う。final unit identityはMove ref、expression ref、visible segment bindingをsealし、whole-line一括bindingや完成後の推測で代用しない。

source clauseは、applicableなpredicate、ordered arguments、degree／quantity、relationとendpoint／direction、polarity／negation、modality／wish、time／aspect、scope／qualifierを全て欠けなく保持する最小単位である場合だけ、private internal evidenceとして保持できる。ただしfinal本文へraw replay、quote、label置換またはgeneric fixed closeとして出力しない。source span、source text、lexical head、scalar locator、segment digest、case別情報、expression／source refsをbody-free metadata、GitHub、handoff、checkpoint、diagnostic、log、public responseへ出さない。

### 36.5 exclusive realization ownership

`Human Reception`は各expressionを自然なLayer 2 semantic clauseへ実現し、同じpassで次を発行するsole authorである。

発行型は§36.3の`ReceptionVisibleSegmentBindingV1` exact1であり、それと同じ`binding_ref`、`expression_refs / move_ids`、`human_reception_local_scalar_start / human_reception_local_scalar_end`、`surface_span_sha256`、`clause_frame_fields`、`surface_derivation_refs`を用いる。alias field、再定義、parallel bindingは作らない。

`Sentence Surface`はpreauthored Human Reception surfaceをrequired request-local inputとして受け取り、Layer 1との配置、複数segmentの結合、句読点、文境界、body parserだけを行う。Human Reception-local rangeはHuman Reception-authored source surface上の検証coordinateとして保持する。Sentence SurfaceはHuman Reception binding ref exact1をplacementに引き継ぎ、実際に追加したprefix／separator／line startのscalar数だけを移動させ、request-local `SentenceSurfacePlacement`のline range／body rangeへdeterministically remapする。Human Reception-local、final line-local、body-globalの三coordinate spaceのslice hashがHuman Receptionのsegment hashと一致し、対象segment内の文字が一字でも変更された場合は`REALIZABLE_RECEPTION_EXPRESSION_VISIBLE_BINDING_GAP`へ閉じる。adapterは`SentenceSurfacePlacement.line_scalar_start / line_scalar_end`をLayer 2 unit textの`RealizedSemanticBinding` rangeへ移し、Human Reception-local rangeはsource surface、body-global rangeは完成bodyとの一致検証にのみ用い、whole-line `[0,len]`一括bindingを作らない。final Stage 1 pathにおけるgeneric follow、empathy close、fixed close、Move actからのsemantic clause生成、second Layer 2 bodyのauthoringはexact0とする。preauthored surfaceが無いfinal callはfallbackせずnamed failureで停止する。

`emlis_stage1_composition.py`は既存どおりschema／ref／identity／non-mutationのvalidation-onlyであり、expressionをderiveまたはrenderしない。expression／bindingのcarrierはSentence Surfaceの配置結果とadapterで終了する。Gate／final-body-only inverseが受けるのは完成本文、既存plan／sentence plan／resolver、および§36.3の独立に検証された上流入力`selected_subjective_input`である。forward expression metadata、binding、preauthored surfaceを正解またはverification oracleとして読ませない。body parserは完成本文だけを解析する。今回追加するのはmatcher／replayへ渡す明示的な意味入力であり、Gate／body-only inverseの現行責任、判定項目、閾値は変更しない。

Gateの`realize_grounded_human_follow_text(..., selected_subjective_input=...)`はforward carrierを受けず、final CMEE branchで`replay_source_grounded_human_reception_from_plan(reception_plan, nucleus_index, resolver, *, plan, recovery_stage, clause_plans, selected_subjective_input) -> GroundedHumanReceptionSurface`へ委譲する。forward入口と独立replay入口はHuman Reception内の同一final authorを呼ぶ。前者はexpressionと検証済み上流判断、後者は完成plan／Move／nucleus／resolverと同じ検証済み上流判断から同じsurface-affecting realization objectへ到達する。replayが同値を再現できない場合はfallbackせず`MEANING_REALIZATION_CAUSAL_TRACE_GAP`へ閉じる。GateはそのHuman Reception-owned replayとactual completed-body lineのexact bytesを現行どおり比較する。新入力はcurrent final Stage 1 branchでrequiredとし、public／legacy branchの既存挙動とbase surface entrypointは維持する。second renderer、意味の再選択、forward oracle、Gate弱化は0である。

### 36.6 verification and product boundary

実装は同じbounded unitでactual active Layer 2へ到達しなければ完了しない。最低verificationは次を含む。

1. required Move→expression exact1とexpression→visible segment exact1以上。
2. actor／predicate／ordered arguments／case／polarity／modality／time／degree／scope／reference／morphology／zero・omission conditionの保持とnamed failure。
3. same Move actでもselected meaningが異なればLayer 2本文が異なり、fixture id、case id、word cue、固定完成文で分岐しないこと。
4. Human Receptionがfinal Layer 2 sole author、Sentence Surfaceのsemantic content generation call count 0。
5. source／unknown／safety／LIMITED、Gate、body-only inverse、question budget、composition validation-onlyの回帰なし。
6. canonical100 direct `100/100`、required Move `124/124`と同じ入力・順序・評価軸・分母を維持すること。outerと個別availabilityは§38の明示承認済みsource-fidelity例外だけを適用し、過去の68/32を件数quotaにしない。
7. 華恋がcanonical100 actual body全文をMash提示前にprivate boundary内で読み、generic follow、source replay、label置換、少数template、不自然な日本語、Layer 1／2重複、深さ不足を確認すること。

machine GREENと華恋pre-screenはMash Product Readを代替しない。successはcanonical 06 latest §87.6のall-ofを一つも省略せず満たす場合だけである。成功時も`CURRENT_PRODUCT_OWNER_ADOPTION_STATE=IMPLEMENTED_NOT_ACCEPTED`、`candidate_ready=false`、product／technical credit 0、`PRIMARY_OUTCOME=BLOCKER_NARROWED`を維持し、`MASH_ROUND0_PRODUCT_READ_READY=true`だけを次境界として固定する。問い、Layer 3、Piece、Analysis、production、merge、cutoverへ自動進行しない。

### 36.7 Phase 1 design checkpoint

```text
CHECKPOINT_ID = CMEE_REALIZABLE_RECEPTION_EXPRESSION_PHASE1_CANONICAL_20260904_V1
AUTHORITY = FRESH_MASH_LEVEL3_CMEE_WORK_STAGE1_REALIZABLE_RECEPTION_EXPRESSION_CANONICAL_INTEGRATION_AND_HUMAN_RECEPTION_BODY_CLOSURE_20260904
PARENT_COCOLON_HEAD = 97b25c146ad41f87d5859e450e48face9de65ea0
PHASE = 1_CANONICAL_INTEGRATION
STATE = DESIGNED_NOT_IMPLEMENTED
COMPLETED = RULES_READ_FRESH_ADMISSION_FIT_GAP_OWNER_CONTRACT
NOT_COMPLETED = RUNTIME_SOURCE_TEST_BODY_PRESCREEN_SYSTEM_CONTEXT_FINAL_REFS
CHANGED_PATHS = EXISTING_CANONICAL_EXACT4
TESTS_RUN = GIT_DIFF_CHECK_AND_AGGREGATE_DESIGN_REVIEW
TESTS_NOT_RUN = RUNTIME_SOURCE_TESTS_CANONICAL100_BODY_PRESCREEN
PRIVATE_INPUT_OR_BODY_PUBLICATION = 0
PRODUCT / TECHNICAL CREDIT = 0 / 0
API / DB / SUPABASE / RN / PERSISTENCE / PRODUCTION / MERGE EFFECT = 0 / 0 / 0 / 0 / 0 / 0 / 0
NEXT_EXACT_ACTION = IMPLEMENT_REQUEST_LOCAL_EXPRESSION_AFTER_FINAL_MOVE_REBUILD_AND_CONNECT_HUMAN_RECEPTION_AUTHORED_BODY
AUTOMATIC_PROGRESSION = false
```

## 37. Cross-layer action-status owner conflict terminal（2026-09-04）

本節はcurrent feasibilityとnext actionについて§36.6–§36.7よりfreshである。§36 contractはdesign historyとして保持するが、そのsuccess routeおよびruntime実装next actionは未達で終了した。

canonical100の20 outputで、Layer 1はprospective action、Layer 2はperformed／nonfutureとして同じaction nucleusへexact bindされる。Layer 2のsource-grounded morphology内訳はpositive past 19、progressive 1である。plan binding、nucleus、target realizationおよびrelation semanticsの独立照合により、Layer 1が別のsupport、downstream actionまたはepistemic contentを所有するscope escapeは成立しない。

Layer 1 classifierとそのvisible bytesは本試行より前から存在し、current Layer 2 status補正が潜在していたcross-layer contradictionを可視化した。direct runner、Gateまたはinverseのmachine GREENはcanonical100 full-body CLEARを代替しない。Human Reception／Gate内の局所分類変更、parallel ownerまたはfallbackではowner conflictを解消できない。

```text
CURRENT_CONTRACT_RESULT = SCOPE_TERMINAL_STOP
CURRENT_PRODUCT_OWNER_ADOPTION_STATE = IMPLEMENTED_NOT_ACCEPTED
CANDIDATE_RETAINED = false
CANDIDATE_READY = false
MASH_ROUND0_PRODUCT_READ_READY = false
PRODUCT / TECHNICAL CREDIT = 0 / 0
NEXT_REQUIRED_ACTION = FRESH_MASH_DECISION_EXACT1
AUTOMATIC_PROGRESSION = false
```

再開には、Layer 1 byte parityを緩和してsame-nucleus statusを統一するか、Layer 1 parityを保持してupstream meaning／plan contractでprospective ownerとperformed ownerを明示的に分割するかについて、fresh Mash decision exact1を要する。決定まではnew runtime implementationを承認しない。


## 38. Same-nucleus status alignment with bounded Layer 1 revision（2026-09-04）

Current authority: `FRESH_MASH_LEVEL3_CMEE_STAGE1_SAME_NUCLEUS_STATUS_ALIGNMENT_WITH_LAYER1_PARITY_RELAXATION_20260904`. This section supersedes the execution prohibition in §37 for this newly approved unit only; the predecessor STOP, rollback and non-acceptance remain historical facts.

The final Stage 1 Observation Plan owner resolves the same action nucleus against its exact source fragment before relations, reception duties, graph, selected meaning, projection and identity are derived. It may correct source-grounded status/time/modality and their existing attribute codes, preserving nucleus identity, actor, polarity, evidence, arguments, relations and unknown scope. Downstream expression and both visible layers consume that common state; they do not mutate a sealed meaning outcome or independently reclassify the action. No owner split, new ontology, arbitrary meaning reselection or public base-route change is authorized.

Layer 1 byte parity is relaxed only for this causal correction and necessary grammatical realization. Source faithfulness and full-body quality remain mandatory. Past morphology alone does not establish completed action; negation, wish, uncertainty, quoted/conditional scope and progressive aspect remain distinct. Existing time-scope vocabulary and schema versions are retained. Pure morphology knowledge is shared through the existing upstream owner without duplicate classifiers or a new module.

The §36 request-local expression → Human Reception sole Layer 2 author → Sentence Surface placement → adapter contract is reimplemented in the same unit. The rejected predecessor implementation is reference evidence, not an accepted candidate. Its shortened-context Gate matching and repetitive predicate construction are not adopted as proof of correctness. Gate/source matching thresholds and independent final-body inverse duties remain unchanged.

Verification requires original canonical100 input/order/axes/count, direct 100/100, required Move and binding 124/124, baseline outer 68/32 and per-input availability parity except the approved removal-of-unsupported-meaning improvement, relevant regression, status-to-source fidelity, and a frozen same-set full-body Karen pre-screen. Scope-internal implementation/language/test defects are corrected within this unit, with regeneration and all100 re-reading after changes. Unrun required tests prevent completion/readiness. Mash Product Read PASS, adoption, candidate ready, production and merge are not awarded.

Historical pre-approval execution state: `BLOCKED_AVAILABILITY_CONSTRAINT_UNFINISHED`. Execution and next checkpoint are owned by canonical 06 §89 and the existing mashos-api handoff.

Historical pre-approval execution checkpoint: `BLOCKED_AVAILABILITY_CONSTRAINT_UNFINISHED`. A reliable frozen probe reached direct 100/100 and required Move/expression/visible binding 124/124, but outer classification became 72/28 with four changes. Root read that probe's original/observation/follow for all100 and recorded NOT_CLEAR. Later source repairs require a fresh full generation and full reread; no final CLEAR or readiness is claimed.

The unchanged completed-body compatibility check rejects unsupported negative sensation. Removing that unsupported meaning correctly removes the rejection. The four original inputs, observations and selected nuclei were unchanged; the final follow was the changed operand. Restoring legacy referent defaults did not restore the old classifications. Keeping the old classification would require an unfaithful body or a new admission rule/parallel route. The approved 68/32 and per-input parity requirement has not been relaxed. Canonical 06 §89 and the existing mashos-api handoff record this specific approval boundary. Other status/grammar/quality defects remain scope-internal work, not additional approval boundaries. Product Read, candidate ready, adoption and production/merge effects remain false/0.

Current execution resumed under the same original authority and the following explicit supplement. Mash approved the source-fidelity availability exception in the current session: an admitted UNAVAILABLE input may become GENERATED only because unsupported meaning was removed and the unchanged strict checks now pass. Every change needs causal source/body verification; unrelated classification changes and GENERATED-to-UNAVAILABLE regressions are not covered. The canonical100 inputs, order, evaluation axes and denominator stay fixed. Baseline 68/32 remains historical evidence, not a quota that requires defective wording. No Gate/threshold weakening, new admission hold or automatic product acceptance is authorized.


The resumed final-only status seam proves outer action separately from embedded operators, and proves prospective intent with the existing future/next-intention vocabulary. An action-field default alone proves neither performance nor a future plan. A factual clause with a separate subject retains fact/time but does not acquire performed-action proof. Public/V1 classifiers retain their existing default; final reconstruction and all validators derive the flag from the existing final source contract.

The existing expression grammar is completed in the same implementation unit: a bounded, uniquely reversible decomposition of already admitted Japanese head/case/carrier forms may be sealed in the existing private nominalization plan before emission. Whole source remains private evidence; no actor, target, polarity, modality, time/aspect, qualifier or unknown is omitted. A natural action nominal may change its inner Japanese case only under that exact proof; outer semantic roles, relation endpoints and direction stay unchanged. Ambiguous morphology is not guessed. Human Reception forward and plan-only replay derive the same grammar and compose the same bytes. Context remains complete; a target-only grammar change does not relax Gate context matching. Actual semantic-slot and relation consumption must populate the existing clause-core cover, rather than pre-filling the expected count. This grammar and full-body validation remain work in progress, not a CLEAR result.


Existing concrete-action response responsibility includes its existing prospective and uncertain-content variants. Family membership alone must never prove performance. The final projection derives future, past or continuing status from the source-bound outer predicate before meaning sealing; Human Reception retains the corresponding voice and uncertainty. Nonpast action plus a past decision carrier remains prospective, and a bare ellipsis retains the existing admitted time value rather than inventing a schema value. All other owners and public/V1 default behavior remain unchanged.


Latest frozen checkpoint: direct canonical100 100/100, required Move/expression/visible binding 124/124, outer 73/27. Five increases remain bounded by Mash's approved removal-of-unsupported-meaning exception; no reverse classification changes are accepted. The preceding failed intermediate probes remain historical evidence. Root completed all100 original/observation/follow reading for this probe and recorded NOT_CLEAR: generic follow, source replay, uncertain-wish qualification and set-level repetition remain. Related generic tests executed 34/34 PASS; three subsequent focused finite-feeling/body-inverse tests also pass. These results do not certify later source edits or final acceptance.

Existing Human Reception grammar now tracks actual emitted semantic/relation cover and consumes context once. Existing source-proven future referents may own their already visible time expression, avoiding a duplicate adjunct. The existing private nominalization tuple can encode uniquely reversible negative finite-carrier and adverb attachment, checked against inherited lexical conjugation classes before expression sealing and independently re-derived by the same plan-only replay owner. No input-example branch, full sentence bank, second meaning owner, parser, new carrier or Gate relaxation is introduced. Next work remains source-owned uncertainty alignment, meaningful Reception expression, frozen all100 regeneration/rereading and the required regression/current source identity verification; no CLEAR or readiness is claimed.


### Selected subjective-content consumption and replay boundary — pre-approval finding

The latest fixed source probe is direct 100/100, required Move/expression/visible binding 124/124 and outer GENERATED 73 / UNAVAILABLE 27. Original input/order/axes/denominator are unchanged. Root read every original input, observation and follow in that same fixed100 and recorded NOT_CLEAR. Source-owned future/performed/progressive corrections, uncertain desire qualification and the bounded finite-feeling nominalization improve specific defects; they do not establish full source/grammar/product closure. Generic closes, categorical anaphora, raw source replay and some embedded intention/outer-action scope remain unresolved. No private body, individual case, digest or locator is included here.

The remaining subjective-content gap is concrete. `emlis_stage1_response.py` already resolves the selected NORMAL projected subjective claim, including its existing `appraisal_content`; the existing LIMITED branch also resolves its bounded subjective proposition. The final expression currently consumes source component/role/qualifier material while dropping selected subjective content. The sole Human Reception predicate then reduces to act/role wording. More grammatical nominalization alone cannot substitute for consuming the selected subjective decision.

The exact constraint is canonical 02 §36.3 / §36.5: the final replay receives only existing observation plan, Move/nuclei and resolver, and cannot receive the forward expression/projection. `GroundedObservationPlan`, `GroundedReceptionMovePlan` and `GroundedSentencePlan` do not retain the selected appraisal, appraised binding set or focal relation. Existing `_normal_reception_appraisal` depends on the selected contribution subset, with explicit precedence and exact-one validation. Repeating that choice inside Human Reception/composition or inferring it from all plan relations would be a second decision over a potentially different domain. Hiding it in a source attribute/stance/grammar opcode would be a new semantic carrier. Using forward generation metadata as an inverse oracle is forbidden.

The proposed next adjustment, NOT implemented or self-authorized here, is to let the existing Human Reception forward and inverse replay consume the same independently validated, immutable existing NORMAL/LIMITED subjective decision through an explicit request-local input contract. The selected meaning/outcome/binding identity remains authoritative and source/role/qualifier validated; no new appraisal operation, Reception act, Move family, semantic reselection, owner split or renderer is introduced. Completed body comparison and all strict Gate items/thresholds remain. This requires an explicit adjustment of the existing replay input/trust contract, beyond status alignment and wiring the current plan-only replay. Current Mash §5 limits and §8 require that boundary to be reported before crossing it. The proposed adjustment is not claimed to eliminate every remaining language defect by itself.

Resume after that exact boundary is decided: continue the same unit from this preserved disabled checkpoint, connect the existing selected subjective content through the agreed replay contract, repair remaining source-scope/grammar/product defects, regenerate and reread all100, and execute final required regressions. The previous terminal STOP/rollback and intermediate failed probes remain history; this is a new unfinished checkpoint under the current authority, not product adoption. No one-failure stopping rule is being reinstated. Scope-internal language defects remain work to complete; they are not separate approval requests. Product Read readiness, candidate readiness, acceptance, merge and production effects remain false/0.


### Mash-approved selected subjective reception input — implemented, verification unfinished（2026-09-05）

Mash explicitly approved `FRESH_MASH_LEVEL3_CMEE_STAGE1_SELECTED_SUBJECTIVE_RECEPTION_FORWARD_INVERSE_REQUEST_LOCAL_CONTRACT_20260905` after reviewing the concrete change. The preceding proposed-only replay boundary is a historical pre-approval finding, not a current execution prohibition. The approved normative input/trust contract is integrated in §36.3–§36.5; no separate proposal, meaning owner, schema family or renderer is created. The input and bounded grammar connection are implemented. Focused contract/body-inverse verification is 58/58 PASS; the new fixed same100 is100/124/73-27, latest final-source required-regression190 total /186 PASS/4 inherited FAIL, and root full100 rereading is NOT_CLEAR. The latest implementation checkpoint is recorded in 06 §89 and the existing runtime handoff.

The same verified existing NORMAL/LIMITED `SubjectivePropositionV2` is carried losslessly by `SelectedSubjectiveReceptionDecisionV1` rows inside one immutable `SelectedSubjectiveReceptionInputV1`. The sole Stage 1 bridge binds the existing selected decision to authoritative projection/grounding and Move lineage before expression generation. The same request-local input reaches Human Reception forward and independent replay through keyword `selected_subjective_input`. Recovery may select only the already authorized active Move subset; it cannot rewrite the decision. Human Reception consumes the existing selected appraisal/binding/focal relation to realize what this input was received as, instead of reducing it to Move act/role wording. Grammar and selected-content realization are part of the same body-correction unit, not independent technical completion.

Runtime scope is the existing `emlis_stage1_response.py`, `emlis_ai_grounded_human_reception.py`, `emlis_ai_grounded_sentence_surface.py`, `emlis_ai_grounded_observation_gate.py`, directly affected tests, and existing runner identity maintenance. Existing shared meaning types and public/persisted schemas are retained. Canonical 02/05/06 and the existing runtime handoff own the change. Current-map and PR display synchronization changes status pointers only; application, national-system, public API/DB/RN, Piece/Analysis and legacy-route responsibilities do not change.

Inherited status/grammar/source-fidelity corrections and the already approved UNAVAILABLE-to-GENERATED exception remain authorized in this same unfinished unit and are not new approval requests. Preserve strict Gate/body inverse, exact completed-body comparison, source/role/qualifier/unknown/safety protection, Move/expression/visible binding cover and no semantic reselection. After representative body checks, regenerate the same100 on final code, execute required regressions including the seven inherited failures and later unexecuted checks, verify runner identity and per-input availability reasons, and have Karen read every original/observation/follow plus set-level repetition. Candidate11's 100/124/73-27 and latest combined regression 177/7 remain pre-change evidence; all100 NOT_CLEAR is not cleared by this approval. Product Read readiness, candidate ready, acceptance, merge and production remain false/0 until their own actual conditions are met.


### Inherited regression source grammar continuation (2026-09-05)

After the selected-reception contract save, the same unfinished verification work repairs shared source recognition: the existing self-worth-negation grammar accepts the additive particle under its unchanged identity dependency, and Observation Plan uses original field/validated span positions to distinguish a concessive time introduction from a change in the user’s state or a scheduled value. The source-context proof stays in the existing owner and also reaches final typed scalar projections; it is not a new meaning selector, Evidence or hidden attribute carrier. Shared active/legacy callers and their safety/public boundaries remain explicit. Strict Gate and historical expected hashes are unchanged. See the latest 06/handoff continuation for fresh execution results; candidate12 cannot certify later changed source. Product NOT_CLEAR and all readiness/merge prohibitions remain.


### 2026-09-05 continuation — source time and unfinished wording

同じ承認の継続修正。final Stage1の既存same-nucleus status alignerは、継続を希望する直接の肯定願望形を継続実行とみなさず、同じwishのtime_scopeをcurrent_inputへ戻す。引用・過去願望・reporting host・別の継続根拠はこの限定修正で書き換えない。source・actor・target・modality・relation・上流判断の担当は維持する。

既存の後置指示語＋限定助詞の解析を同じObservation Plan owner内の関数にまとめ、Human Receptionも同じ有限述語を時制の根拠として確認する。元の限定句はsource／argument／本文に保持し、余分な期間表現を足さない。未完入力のellipsisはlexical whitespaceとして削除せず、同じsource argumentをforwardとreplayの両方に渡す。Gate／body-only parser／判定基準・閾値を変更せず、生成metadataを正解にしない。

代表本文で原入力より強い継続・期間表現の除去とellipsis保持を確認した。既存generic Move41検査成功、追加の境界・完成本文の改変拒否3検査成功。最初の新規検査案2件は、短い入力で正しくanaphoricが選ばれて対象本文が出ないという検査入力の不一致で失敗した記録を残す。対象を実際に露出する既存canonical loader入力で確認し、歴史的期待値は変更していない。この時点で変更後の最終same100／必要回帰／華恋全文確認はこれから実行する。candidate13の結果を変更コードの合格証拠へ流用しない。


### 2026-09-05 continuation — selected object grammar and context responsibility

同じ承認の継続修正として、唯一のHuman Receptionが選択済みPRESERVE_BOTH_ENDPOINTSのfocal relationを既存のrelation順へexact joinし、方向のない共在関係に限り、二つの完全な対象を一つの分配的目的語へ組み立てる。共在の事実説明と両側保持の締めを二重に出さず、選択済みの両側保持を可視目的語で一度だけ表す。方向、比較、因果、不確かな接続はこの省略対象にせず、既存の述語・endpoint・directionを維持する。意味、Move、act、上流のselection、private schema、Gate／body parser／判定項目・閾値は変更しない。

背景は、source slotがcoveredであるという理由だけで削除しない。最初の単純削除案は既存逆検証のcontext／why義務で停止したため採用せず、失敗記録を保持した。関係exact1・背景exact1・応答対象とのendpoint一致を満たすANAPHORICだけ、背景を対象の連体修飾へ組み込み、背景の可視markerと両方のsource objectを同じcoreに一度ずつ残す。複数関係、方向・比較、不確かさを一般的な背景へ平坦化しない。forwardと独立replayが同じplan／resolver／検証済み判断からこの文法を再導出し、生成metadataを逆検証の正解にしない。

同じ100件の大部分には、選択済み判断が一つの行動へのMATERIAL_WEIGHT評価に限られるものが残る。文法修正で選ばれていない感情・価値・関係を付け足さず、選択内容の限界と表現実装の不足を区別する。代表本文を先に確認し、変更コードの最終100件・必要回帰・華恋の全文確認後に結果を本handoff／実装順へ保存する。NOT_CLEAR、全ready／採用／merge／本番／問い／Layer3未成立を維持する。


### 2026-09-05 continuation — 選択済み対象の本文接続・最終確認と未完了の再開位置

同じ承認の継続修正を、runtime remote `12cbd0d03ce4d2235ffce50147a250e8f2310df5`／local `27345652b2f4e6a68ff3fff11a21ccbd491ea5d5`（whole tree一致）で固定し、同じ100件を新規生成・検証した。Human Receptionの既存文法が、選択済みの両側保持を二つの対象へ直接かけ、限定条件下では背景を対象の修飾として一度だけ表す。上流の意味・判断・Move・actを変更せず、生成側metadataを逆検証の正解にせず、背景・why・両endpointの可視義務を保持する。単純な背景削除の失敗案は採用していない。

今回の本文変更は7件、開始時候補から通算14件。直前候補との全100件比較で、フォロー以外の保存項目は全て同一（入力・順序、nuclei、選択済み判断、観測、Move／expression／binding、外側状態・理由を含む）。直接100/100、必要Move／expression／binding各124、外側73 GENERATED／27 UNAVAILABLE、可否変更0。runner identity exact18／exact9を確認した。両側保持の文法による変更3件、背景関係の重複削減4件であり、これを全体の品質成立や一定率の商品改善とみなさない。

華恋自身が、この固定コードによる原入力全フィールド・観測・フォロー100件を全て全文で読み、集合としても **NOT_CLEAR** と判定した。長い行動の復唱、ほぼ同じ締め、分類名だけの先行詞が残る。選択済みの124判断は、material評価116、両側保持5、限定変化1、関係姿勢2で同一である。意味が接続されたことと、入力固有の人間的なフォローが成立したことは別々に確認する。一つの行動への評価しか選ばれていない場面で、rendererが未選択の感情・価値・関係を足す修正は行っていない。過去の意図・発話内の願い、主体、複文の時制や不確かさ、関係の型にも上流の残問題がある。

必要回帰を固定コードで全193件実行し、189 PASS／4 FAIL。元184件は180 PASS／4 FAIL、追加9件は全成功（先の契約3、前回文法3、今回の両側保持・背景義務・不正slot拒否3）。今回の新しい失敗testは0、開始時7失敗のうち3修正済み／4残存を区別する。今回の完成本文に対して、両方を片方へ変える・削除する・不確かにする改変、背景markerの削除を既存逆検証が拒否した。Gate、body-only parser、基準・閾値、historical hash／PASS receiptは変更していない。

残4件は観測固定値不一致2、dated receiptとの現コード不一致1、集合フォロー重複1。観測不一致には比較・意味分類の未解決問題があるため、古い期待値というだけで消さない。dated receiptは歴史的記録として維持し、現コードの合格証拠へ転用しない。集合重複は今回の最終文法の外側にある既存経路で残り、合格として報告しない。途中終了の後ろも、全36ケース・post-hash96検査を今回の固定コードで実行した。96は全成功、unseen集合の重複は失敗を維持する。追加診断は元testのFAILを置き換えない。共有追加164件157／7は過去コードの結果であり、今回の193件に混ぜない。

利用不可27件は直前候補と入力・nuclei・選択済み判断・観測・理由・可否が全件同一。既存の能力不足18／時制・不確かさ等の根拠未成立8／composer内訳未解決1という説明を維持する。今回変わった本文のうち4件は利用不可側の直接生成であり、本文の局所改善で外側の停止を通過したとは扱わない。

次の再開位置は、改善した7件と未改善の行動評価を同じ原入力へ戻して比較し、既存のsource-boundな項・述語・先行詞のどこまでを省略／統合できるか確認する部分。Human Reception内部の実現不足と、既存の意味選択／source scopeの狭さを区別し、各既存ownerへ戻して扱う。別の意味選択担当、言い換えbank、隠し属性、検査緩和を導入しない。代表本文を先に確認し、コード変更後は同じ100件・必要回帰・華恋全文確認を新しく行う。同じ承認範囲の継続修正に再承認は不要。

作業開始時doctorは18 PASS／16 FAIL（固定toolchain不一致）。prepare未実行、stale不使用、原典直接確認、profile／ref／lock変更0を維持した。9月12日までの商品確認準備は、集合の定型化と上流scope残件により引き続き危うい。9月9日の作業時には改善本文・100件残件・見通しを確認する。日付による自動実行・停止はしない。Product Read PASS、採用、candidate ready、merge、本番、問い／Layer3は未成立。private本文・個別ケース・digest・locatorの公開0。この結果保存の差分は文書のみで、runtime／test／runnerの検証対象bytesは変えない。


### 2026-09-05 continuation — 願望目的語内の継続を主述語へ昇格しない

既存same-nucleus status alignerの直接願望判定を、単一continuationの非過去連体形＋名詞目的語＋形容詞連用形の変化願望が句末まで閉じる場合へ限定拡張した。目的語内部の継続を願望全体の継続と扱わず、同じwishのtime_scopeと対応属性だけをcurrent_inputへ訂正する。current_user、exact1 source span、既存typed scalar範囲、元のwish modalityとcontinuing time、top-level引用なし、単一operator、句末全文一致を維持する。過去/進行連体形、過去願望、報告・引用・否定・不確かさのhost、複数continuationをこの型へ混ぜない。nucleus・actor・kind・modality・polarity・source refs・continuation operatorを保持し、graph／意味選択の固定前の既存ownerだけで扱う。

既存意味ownerが訂正済みplanからselected inputを再構築し、Human Reception forward／独立replayへ同じ検証済み判断を渡す。rendererの意味再選択、source引数の削除、新しいowner、private schema、Gate／body parser／閾値変更0。完全な行動節の名詞化・再参照案は既存本文markerを満たさずrecoveryへ移るため棄却し、現runtimeへ残さない。

固定runtime remote `ad736865bc0b4cce24555f5d3852a62cf0b5f926`で同じ100件を生成。直接100、Move／expression／binding124、外側73/27。フォロー1件の過剰な継続断定を除去、観測／可否／理由変更0。変更した直接本文は利用不可側で、生成可能73件は保存項目全て同じ。全195検査は191成功／既存4失敗、華恋の全100件全文確認はNOT_CLEAR。上流対象選択の狭さと既存表現の不足は未解決として分け、意味・主体・時制・関係と本文の接続を同じ承認内で継続する。詳細結果と次の再開点は06末尾／既存runtime handoff末尾が所有する。


### 2026-09-05 continuation — 有限の行動予定を願望と混同しない（実装固定前）

同じ承認の継続として、既存final-only Observation Planのsame-nucleus status alignerで、肯定の非過去動詞＋予定hostの有限末尾だけを既存intention／future／next_intention／concrete_actionへ整合する。kind、nucleus、actor、polarity、predicate kind、source範囲と文中のwish／negation operatorを保持する。既存の行動対象判定はfinal分岐でこの外側intentionを読み、上流の既存meaning ownerがMove・selected inputを再構築する。Human Receptionはその判断を既存future-action表現へ実現する。文末を越えた願望の昇格や、実行済みの主張を加えない。

引用・括弧、過去予定、否定された予定、推量・疑問、明示された別主体は今回の肯定予定証明へ入れない。subjectの初期current_user値を本人の行動証明とせず、冒頭の既存calendar adjunctを除いてsubject／topicとなり得る文字が残る場合は保守的に未解決とする。目的語topicを正しく分解できない文もこの限定修正へ混ぜない。一般的な日本語の主語解析の完成ではない。

既存Human Reception、Sentence Surface、Gate、body-only parser、閾値、historical hash／PASS receiptを変更しない。全体の入力保存→dispatch→production Emlis→public feedback→RN表示を実ファイルで確認し、今回のfinal seamをproduction経路・Piece・Analysisへ適用しない。STRUCTURE_MAP_DELTA_NONE：owner、経路、schema、公開契約を変えず既存final内の意味状態を補正する。構造地図の現在地案内だけを同期する。

最終コードの同じ100件、関連回帰、華恋の全文判定は06末尾／既存runtime handoffに記録する。


### 2026-09-05 continuation — 予定の意味を同じ選択済み意図の担当で表す（再固定前）

直前の実装固定は同じ100件を直接生成したが、Move／expression／bindingが125となり、全198検査は193成功／5失敗だった。従来4失敗に加え、既存bridgeの124要件へ違反した1失敗であり、この案は不採用。124という期待値、過去receipt／hashを変更して合格へ合わせない。原入力／観測／外側73-27と理由は変わらなかったが、別familyへの移動が新しいsupport Moveを作っていた。非公開の途中証拠として保持する。

肯定予定のsame-nucleus modality補正は維持し、行動family分類の今回変更を撤回した。既存protect_retained_intentionの選択済みtargetが、既存future／next_intention、modality=intention、concrete_action証明を全て持つ場合だけ、唯一のHuman Receptionが既存future_action_intention参照を使う。願望用の短いtopic補正で願いへ戻さない。新しいMoveや受け取り判断を作らず、同じ選択済み意図を保護する述語の義務を保持する。

Human Reception内の責務検証は、既存final Planのtyped target証明がある場合だけ、予定対象・見失わず・大切の全てを要求する。共通の願望regexを無条件には拡張しない。Sentence Surfaceの既存検証呼出2箇所は同じPlanを渡すだけで、意味や本文を生成しない。Planなし／base経路では従来の責務検証を維持する。Gate／body parser／閾値／selected request-local契約／private schema変更0。実ファイル追加0、owner／経路追加0。実装対象は既存Observation Plan、Human Reception、Sentence Surface、既存テスト、current runnerと既存設計・地図・handoffに限定する。

代表検査で、予定の原文とfuture参照が同じ本文に残り、願い／実施済みへの改ざんを独立inverseが拒否することを確認する。最終固定後に同じ100件・全関連回帰と華恋の全文再読を行う。先の125結果は合格証拠にしない。商品確認準備は未成立、同じ承認内の継続中。


### 2026-09-05 continuation — 最終検証と全文確認（商品未成立）

最終実装の固定sourceはruntime remote `853df85d7e4c7805b07b4df5d7dbc5cb58e25220`、local `6d1dc0706e6faa58bc087dc634c295604c28e4f3`、全体tree `f54e820a123fefa55e15835389dfebaa576ce4a9`。local／remoteはcommit objectが異なるがtree一致を確認した。この後の最終保存差分は結果文書のみで、実装・テスト・runner bytesを変更しない。

同じcanonical入力全フィールド・順序・評価軸・分母100で、direct100、required Move／expression／visible binding各124、外側GENERATED73／UNAVAILABLE27。直前候補と観測・可否・外側理由は全件同一。フォロー1件が変わり、これはGENERATED側の予定を願いと呼んでいた不一致を、同じ意図保護の担当のまま訂正した。上流の状態／予定証明と選択済み入力のidentityは3件で変わり、残97件は全保存項目同一。全100の既存act・target・supportは不変で、selected operation内訳もmaterial116／両側保持5／限定変化1／関係姿勢2を維持する。別の入力で意味状態だけが直っても、未選択の対象をrendererが追加することはしない。

全198検査をこの固定sourceで通して実行し、194成功／4失敗。元184は180成功／4失敗、従来追加11と今回追加3の計14は全成功。新規失敗0、未実行0。最初の125-Move案による追加1失敗は、期待値を変えずfamily分類の拡張を撤回して解消した。予定参照への切替時に残っていた願望用の責務検査不一致も修正し、最終検査はPlanなしで新しい予定表現を許さないこと、独立inverseが願望・実施済みへの改ざんを拒否することを確認する。途中の検査設定不一致・失敗案は非公開証拠に残す。

既存4失敗は観測固定との不一致2、過去dated receiptと現コードの不一致1、旧経路の集合フォロー重複1。観測不一致には比較・意味分類の未解決問題があり、古い期待値だけとして消さない。過去PASS／hash変更0。後続36ケースとpost-hash96検査を今回も全実行、96成功。unseen集合重複FAILを維持し、追加診断で元testの失敗を置換しない。過去コードの共有164件157／7を今回の成功証拠にしない。

華恋自身が変更後の原入力全フィールド・観測・フォロー100件を全文で読み、集合判定はNOT_CLEAR。予定／願望の局所改善はあるが、長い行動節の復唱、同じ締め、分類名だけの参照、感情・価値・関係から一つの行動評価へ寄る対象選択が残る。肯定反応を変化へ寄せる分類、過去の意図・伝達と現在の願い、援助の主体、複文の時制と関係にも問題が残る。意味状態の補正と本文の自然さを同一視せず、受け取りの担当を増やして解決したことにしない。

System Contextは今回doctor→prepare実行、doctor18成功／16失敗、prepareは固定toolchain不一致で不成立。stale不使用、原典直接読取。既存runtime lock46依存の版／wheel hash／installed RECORD2277件を復元・照合し、profile／基準ref／tracked current／lock変更0。全体と国家システム、入力保存→Emlis→返却→表示、旧経路・他機能境界を確認し、今回は既存final実装だけに限定。新CMEE本文の保存・履歴接続が完成済みとは扱わない。

次は同じ承認内で、今回の予定修正を保持し、選択対象のsource scopeと主述語・主体・不確かさ・関係分類を既存ownerへ戻して本文と突き合わせる。特に反応と変化を混同する入力、過去の発言／願望、長い行動の既存引数を代表本文で比較してから同じ100へ広げる。新しいproposal／台帳／言い換えbank／第二selector／隠し意味／Gate・parser緩和は作らない。9月12日商品確認準備は、集合の反復と意味分類が未解決のため依然危うい。9月9日の作業時には改善本文と残件・見通しを確認する。日付による自動実行・停止や自動Product Read PASSはない。採用／candidate ready／merge／本番／問い／Layer3は未成立。


### 2026-09-05 continuation — 肯定反応と変化の区別を本文へ渡す（実装固定前）

同じ承認済み継続修正として、既存Observation Planのtyped reaction／feeling／positiveを、共用のpositive_change語彙だけで変化へ昇格させない。既存ownerのpure helperが、明示されたchange／result／action-before-change根拠を除外して判定する。新しい属性・意味carrierを保存せず、nucleus、actor、polarity、modality、time、source、relation、受け取りfamily／Moveの選択は変更しない。共用regexと旧V1分類は維持する。

既存V2の選択前direct projection、独立contractsの再導出、Human Receptionの文法projectionは同じtyped区別を参照する。sealed meaningの後から本文側で意味を選び直さない。既存認識actの全targetがこの反応に該当するとき、sole Human Receptionの先行詞を気持ちとして実現し、原文の有限節と既存の関係・相手側を保持する。実際の変化・結果は従来の表現を維持する。positive_changeの共用名称や上流の全分類問題を解消したとは扱わない。

parser／Gateにも限定した変更がある。既存body parserは本文だけから感情対象markerを読み、finalの同act・全target存在・全targetのtyped証明が成立するときだけGateがそのmarkerを必須にする。その場合は従来のchange／words markerを代用品にしない。他対象、mixed／空／不足target、V1／baseは従来条件を維持する。Human Receptionの責務検証も同じPlan証明と感情対象・感じる述語を要求し、Planなしでは新文法を許さない。独立replayの完成本文一致、参照・source・context・why・Move cover、既存閾値と歴史的hash／PASS記録は保持する。検査省略や許容幅の一律拡張ではなく、誤った変化対象義務を正しい対象へ結び直す同一本文修正である。

代表7件のうち3件で根拠のない変化表現を除き、全7件のGate／独立inverseが成立した。最初の代表実行では3件が既存の変化marker義務で停止し、その途中記録は非公開証拠に保持する。これから最終コードの同じ100件、required124、必要回帰、華恋による全100件全文確認を行う。直前候補の結果を新コードの証拠にしない。

全体・国家システム・current file map・既存保存入力→Emlis→返却→RN表示と旧経路の境界を確認した。STRUCTURE_MAP_DELTA_NONE：既存owner内の意味投影・文法・検証を修正し、新owner／route／公開schemaを追加しない。production／API／DB／RN／Piece／Analysisの変更0、新CMEE本文保存・履歴接続の完成は未主張。System Contextはfresh doctor18成功／16失敗、prepare実行・固定toolchain不一致で不成立。stale不使用・原典直読、profile／基準ref／lock／tracked current変更0。9月12日商品確認準備、ready／採用／merge／本番／問い／Layer3は未成立。

実際に完了した肯定変化については、既存final source alignerで同じ反応の原文範囲を確認する。既存positive lexiconの一致自体が有限の完了動詞で、引用・疑問・条件・後続hostの内側ではなく外側述語の末尾を占める場合だけ、既存operator:changeを保持・明示する。単なる肯定感情のstemはこの証明にならない。選択感情labelだけでは新しい反応判定を成立させない。先行代表7件／追加3検査の成功後、この実変化境界を補った。最終固定コードの回帰・同じ100件で再確認する。V1分類と受取義務は従来通りであり、共通parserのmarker診断だけには新語の検出が現れ得る。

最初の固定コードで全201検査を実行したところ196成功／5失敗となり、既存4件に加えて疑問符を失ったsourceから変化を確定する新規失敗が1件発生した。Ledgerは原文末尾の疑問符をspanから除くため、span内だけの確認では不十分だった。既存normalized_inputを同じfinal alignerへ渡し、元fieldとstart/endの一致を確認したうえで終端の疑問記号列を調べる。欠損・不一致のsourceでは新しい変化証明を追加しない。Ledger／offset／既存action・wish分岐と検査期待は変更しない。この失敗と途中100件は非公開記録に保持し、修正後を新たに固定して全201検査・同じ100件・全文確認を行う。


### 2026-09-05 continuation — 反応と変化の最終検証・全文確認（商品未成立）

最終固定sourceはruntime remote `9766c4bceece120e7461cf7e8a2ba3cf88a11147`、local `d8f4c14ebbd6b30baea4dab69366692c8744cc35`、全体tree `6fc38702b2334bdf0fcdf9e59cb3f4912e1c855e`。対応する設計sourceはremote `9b81b46fd815b159609a1f196bd1c2d5a836266c`、local `a0bdd39f0cc2edc1251b14c9c8f3f5055c2328e3`、全体tree `2e93bdb733705c085ba714e85cd17102146c3c6f`。両repoのlocal／remote treeと変更ファイル全文の一致を確認した。この後の保存は結果・地図・handoffだけで、実装・テスト・runner bytesを変えない。

同じcanonical入力の全フィールド・順序・評価軸・分母100でdirect100、必須Move／expression／binding各124、外側GENERATED73／UNAVAILABLE27。直前候補に対して観測・可否・外側理由・nucleiは全件同一、3件のGENERATEDフォローとselected-input identityが変わり、残97件は全保存項目同一。3件とも、肯定反応を根拠なく変化と呼ぶ不一致を、同じ選択対象の気持ちとして訂正した。全100の既存act・target・supportとoperation内訳material116／両側保持5／限定変化1／関係姿勢2は維持。未選択対象を本文から追加せず、GENERATED→UNAVAILABLE変更0。

全201検査を固定sourceで通して実行し197成功／4失敗。元184は180成功／4失敗、直前までの追加14と今回追加3の計17は全成功。新規失敗0、未実行0。途中の全201では疑問符消失による新規1失敗があり、その失敗と途中100件は非公開記録として保持する。元field／start／endを検証して元の終端記号列を見る修正により、疑問・混在記号・空白を含む反例が成功した。疑問符のないspanだけでは新しい変化証明を作らない。既存テスト期待やLedgerの本文／offsetは書き換えない。

既存4失敗は観測固定との不一致2、過去dated receiptと現コードの不一致1、旧経路の集合フォロー重複1。観測不一致には比較・意味分類の未解決問題が含まれ、古い期待値だけとして処理しない。後続36ケースとpost-hash96検査も全実行、96成功。unseen集合重複FAILを維持し、後続診断で元testの失敗を置換しない。歴史的hash／PASS／閾値変更0。

今回parser／Gateは実際に変更した。本文だけを読む既存parserへ感情対象markerを加え、finalの同act・全target存在・全target typed feeling証明が揃う場合だけ、独立inverseにその対象義務を要求する。変化／言葉markerで代用できず、同じ完成本文replay・source・参照・context・why・Move coverを維持する。Planなしの新文法は不許可。mixed／不足target／base経路の受け取り義務は従来通り。新しい属性語彙・carrierは追加せず、実変化を原文が証明するときだけ既存operator:changeを明示し得る。今回100件のnuclei変更0と、一般に属性編集が一切ないという主張を混同しない。

華恋自身が最終sourceの原入力全フィールド・観測・フォロー100件を全文で再読し、集合判定はNOT_CLEAR。3件の誤呼称は改善したが、長い行動節の復唱、同じ締め方、分類名だけの参照、感情・価値・関係より一つの行動評価へ偏る選択が残る。過去の発言／意図を現在の願いに寄せる分類、援助を受けた際の主体、問い・比較・複文の関係分類も未解決。局所的な参照改善を、商品全体の自然さや正式Product Read成功へ読み替えない。Mashへ未達本文の確認を求めない。

System Contextはdoctor→prepare実行、18成功／16失敗、prepareは固定toolchain不一致で不成立。stale不使用、承認済み原典直読を継続。既存lock46依存の版／46 wheel hash／installed RECORD2277件を照合し不一致0。profile／基準ref／tracked current／lock変更0。全体設計・全ファイル地図・国家システム・保存入力→Emlis→返却→RN表示・旧経路と他機能境界を確認した。STRUCTURE_MAP_DELTA_NONE：新owner／route／公開schema追加0、production／API／DB／RN／Piece／Analysis変更0。地図は現状の説明を同期する。新CMEE本文の保存・履歴接続が完成済みとは扱わない。

次は同じ承認内で、今回の予定・反応の修正を保持し、過去の発言／意図と現在の主述語・援助の主体・不確かさ・比較関係を既存意味ownerと代表本文で突き合わせる。選択前のsource scopeと実現責務を直し、同じ100件・required124と既存失敗を保持して検証する。表面的な分類語削除、言い換えbank、第二selector／renderer、隠し意味、新proposal／台帳は作らない。9月12日商品確認準備は集合の反復と意味分類の未解決により依然危うい。9月9日の中間確認では改善本文・残件・見通しを確認する。日付からの自動作業／停止／Product Read PASSはない。PR3／30／37はDraft/open/unmerged、ready／採用／merge／本番／問い／Layer3は未成立。


### 2026-09-05 continuation — 過去の願望発言と現在時制の整合（最終検証前）

同じ承認済み継続内で、final Stage1の既存same-nucleus status alignerが、current_inputのwishに属する有限な過去発言・思考を原入力へ照合し、既存time_scopeと対応属性だけpastへ整合する。願望modality・kind・actor・polarity・source・nucleus IDを保持し、発話から願望の現在継続や行動実行を導かない。引用・疑問・明示主語を含む曖昧な範囲・推量・条件・非過去・既存continuingにはこの限定補正を拡大しない。Ledgerで落ちる疑問符は元フィールドと既存offsetの照合で除外する。presentに属する埋込時間句や複文の過去予定は未解決として保持する。

唯一のHuman Receptionは、同じ選択対象が全てpastのwishである場合、既存retained_wishの参照を当時の願いとして実現する。後段のtopic補正で現在の願いへ戻さず、既存context参照も同じtyped時制に従う。方向のdirect shape・Move act・対象・支援先・選択担当・replay入力契約は増設も置換もしない。Sentence Surface・Gate・body parser・閾値は変更しない。past化でgraph／selected identityは選択前から再導出し、sealed意味を書き換えない。実装位置は保存直後Emlisのdisabled final Stage1内部で、国家の保存・dispatch・queue・read-side、RN passed-only境界、旧public/V1経路・Piece・分析には波及させない。

代表4本文を華恋が原入力とともに読み、Gate／independent inverse成功を確認した。過去の発言の参照1件が変わり、もう1件の既存願望は意味時制だけ変わるため本文改善件数へ含めない。簡略入力をwishと仮定した新規検査案2件の失敗は保存し、既存typed状態を明示する境界検査と実際の選択本文検査へ直して3成功を確認した。context参照の追加assertionを含む最終検査、固定100・必要回帰・全文確認はこの後に実施する。現在runnerのexact18／exact9対応だけを更新し、歴史的receipt／PASS／hashは保持する。

開始時に3 PRの保存headとlocal treeを照合し、全体設計・国家flow・current地図・tracked inventory・影響現物・最新weekly reviewを確認した。System Contextはdoctor→prepareを実行したが固定環境不一致で不成立、staleは不使用で承認済み原典を直接読んだ。profile／基準ref／tracked currentは変更していない。既存実装runtimeの46依存版・46wheel hash・2277installed RECORDは今回も不一致0。候補18の100／124／73-27、201検査197成功4失敗、全文NOT_CLEARは前段証拠であり、変更コードの最終証明に流用しない。商品確認準備・ready・採用・merge・本番・問い・Layer3は未成立。


### 2026-09-05 continuation — 分割前の引用・話者境界と過去参照の補正

前段固定source（runtime remote `35cd05e37f4b19d576960dbb813611b9f9c618bc` / local `125a1ef15003c9947f6a1c5e2c07b0acead1612a`）は100/124/73-27、204検査200成功／既存4失敗だったが、追加source reviewで引用・他者主語が分割前の位置へ残る不足を特定した。華恋が同じspan/元offsetを用いた最小再現で2つの誤ったpast補正を確認したため、このsourceの成功を最終証明にしない。前段100の全文確認は未実施、生成・XML・後続診断・最小再現を途中証拠として保持する。

既存alignerの新past-report補正だけを、元フィールド全体で引用外の同位置、直前文境界から未知の前置きがないspan、同じtyped fragmentの先頭に限定した。分割された引用・話者は推測で補わない。Human Receptionはtyped pastだけを過去の願望と同一視せず、同じ完全source fragmentの願望が有限の過去report hostに閉じることも確認する。この形態規則は既存ObservationPlan内のpure functionを共有し、別の分類器・opaque flag・新意味carrierを作らない。元の目的語内の時間語だけで得られたpast値は、新しい当時参照の根拠にならない。

追加3検査の中に元位置・話者／引用・目的語内時間語の境界を追加し、同じ固定100と必要回帰を新sourceで再実行してから華恋が全100本文を読む。required124・選択責務・Gate／parser／閾値・過去PASS／hashを維持する。前段検証と今回の最終sourceを混ぜず、実装／検査／runner以後の変更は結果と地図・handoffに限定して保存する。商品NOT_CLEAR、ready／採用／merge／本番／問い／Layer3は未成立。


### 2026-09-05 continuation — 当時参照を原文確認済み補正へ限定

2回目の固定source（runtime remote `7d447d146a6ef780cc13262ffc2d205ca908f160` / local `880a8158f1da6d442f5f61587d100dd9675a32d3`）も100/124/73-27、204検査200成功／既存4失敗だった。ただし旧時間語判定でpastとなる疑問文が、元フィールド確認を経ず当時参照へ入る境界を華恋の最小再現でも確認した。2回目の全文確認は未実施で、生成・XML・診断・再現を途中証拠として保持する。

有限過去reportの共通関数は、既存時間語関数で元spanとtyped fragmentの両方がcurrent_inputとなる範囲だけを新しい本文参照の対象にする。現行wish builderの旧past生成はこの時間語関数に由来し、他の固定past経路はaction／change／eventである。現在のtyped pastと両方の元分類・有限reportの組合せにより、今回の元位置／疑問／引用／話者確認を通った補正へ限定される。暦・期間・継続等の従来時制経路を新表現へ一括移行しない。新flag／schema／carrier／第二selectorや原入力を保持する新resolver契約は追加しない。対象・支援先・Move124・既存replay責務を保持する。

同じ追加3検査内で、旧past疑問、旧past断定、typed fragment外の時間語を除外する境界も検証する。限定後の最終sourceで必要回帰・固定100生成・華恋全文確認をそろえる。過去2回の結果を最終証拠へ流用せず、既存4失敗・歴史的hash／PASSを変更しない。商品NOT_CLEAR、ready／採用／merge／本番／問い／Layer3は未成立。


### 2026-09-05 continuation — 過去の願望発言の最終検証・全文確認（商品未成立）

最終固定sourceはruntime remote `ed884a4493ccb43b3620ac2897e6defd670d3982`、local `d519c3e655966a78bf5baf98d7ae23c8b87b8b81`、全体tree `7e6dce47eaa29af5241f97151e17cc5a6c490c18`。対応する設計sourceはremote `e3d9524c34dbf70fcce1e1fa5f7e8d5e2c9d6c56`、local `3b828dd79facd19d2a85403a3222b58416cfff7f`、全体tree `516a9e9c1e148a15d516cd67cd9c137d2c9daae0`。両repoのlocal／remote treeと変更ファイル全文が一致。この後の変更は結果・地図・handoffだけで、実装・テスト・runner bytesは固定する。

同じ原入力全フィールド・順序・評価軸・分母100で、direct100、required Move／expression／binding124、外側GENERATED73／UNAVAILABLE27。前段との比較で同じnucleusのcurrent_input→pastと既存time属性が2件変わり、そのselected-input identityも2件変わった。同じ対向nucleusのoperator属性順序1件にも実行間の差があり、非時制属性tupleのbyte一致は主張しない。非時制属性の内容集合・actor・polarity・source・nucleus IDは一致する。選択act／対象／支援先は全件同じで、operation内訳116／5／1／2も同じ。フォローが変わったのは利用不可側1件、当時の願いという時点が本文へ届いた。もう1件は時制だけの補正で本文改善には数えない。生成可能73件の本文変更0、観測・可否・理由変更0、残98件は全保存項目同一。局所修正を生成可能集合の商品改善へ読み替えない。

最終sourceの必要回帰204件を全実行し、200成功／既存4失敗、新規失敗0、未実行0。原184は180成功4失敗、前段追加17と今回追加3は20成功。XML・完全なconsoleの最終集計を照合した。過去sourceの成功、最初の新規検査案2失敗、2つの固定途中版の200／4、source位置と旧past疑問の誤適用再現は別証拠として保持し、最終合格へ流用しない。

既存4失敗は、観測固定との不一致2、過去dated receiptと現コードの不一致1、旧経路の集合フォロー重複1。観測には比較・意味分類の未解決もあり、古い期待値だけとして消さない。後続36ケースも全実行し、観測hash不一致を保持。post-hash96検査は全成功、unseen集合の重複FAILを保持する。後続診断で元test失敗を置換せず、歴史的hash／PASS／閾値変更0。

利用不可27件の今回の外側理由は、current_experiencer_or_time_scope_unsupportedが26件、plan_bound_observation_realizer_unavailableが1件で全件不変。これは今回観測したトップレベルの理由集計であり、旧記録の内部分類18／8／1を今回あらためて個別立証したという意味ではない。全文確認でも過去の伝達・予定、未知、関係・主体分類が残るため、27件を一括で正しい停止とも一括で不具合とも判定しない。停止を解除するための新しい判断条件は追加しない。

華恋自身が最終sourceの原入力全フィールド・観測・フォロー100件を、10件ずつ省略なしで読み、集合判定はNOT_CLEAR。過去の発言の時点は1件改善したが、感情・価値・関係より行動評価に偏る選択、長い行動節と関係節の復唱、同じ締め、分類名だけの参照、問い・比較・可能性の誤分類が残る。過去予定と未完結果、伝達文内の現在時点、援助を受けた主体、複文の関係も未解決。型の時制だけの改善を本文改善へ数えず、今回もMashへ未達本文の確認を求めない。

System Contextは今回doctor→prepareを実行したが18成功16失敗、prepareも固定toolchain不一致で不成立。stale不使用・承認済み原典直接読取。profile／基準ref／tracked current変更0。既存実装runtimeは46依存版・46wheel hash・2277installed RECORDを今回照合し不一致0。全体／国家／共通基盤と最新地図・tracked inventory・weekly reviewを確認し、今回もdisabled final Stage1の既存ObservationPlan／Human Reception内部、テスト、現在runner identityに限定した。Sentence Surface／Gate／parser変更0、既存exact replay・source／unknown／安全・124義務を保持する。

次は同じ承認内で、過去の発言の今回修正を保持し、未解決の複文・伝達・予定と、援助の受領主体、問い・比較・可能性を既存意味ownerの原入力へ戻って確認する。原入力→選択意味→本文を代表例で先に突き合わせ、分類語だけの変更や長い再掲を商品改善にしない。既存ownerの範囲で次修正を実装し、同じ100・124と必要回帰・華恋全文確認をそろえる。新proposal／台帳／言い換えbank／第二selector／renderer／隠し意味／弱いGate／歴史的hash修正を追加しない。9月12日商品確認準備は依然危うく、9月9日の作業時には改善本文・残件・見通しを確認する。日付による自動実装／停止／Product Read PASSはない。PR3／30／37はDraft/open/unmerged、ready／採用／merge／本番／問い／Layer3は未成立。


### 2026-09-05 continuation — 未完の問いと埋込行動のsource分類（最終検証前）

最新再開点に残る問いの誤分類を、同じ承認内の既存final ObservationPlan ownerで修正する。既存action型の中でも、既にuncertainとoperator:uncertaintyを持ち、元field／offset一致・引用外の同位置・前の文境界から未所有prefixなし・疑問の外側終端を証明できる理由疑問だけを、同じnucleusの既存uncertainty型へ正す。kind／predicate_kindの訂正をstatus一般の拡大許可とは扱わない。原入力の同じ未完述語を分類し直す限定修正であり、nucleus ID・actor・polarity・時制・modality・source／anchor・関係は保持する。埋込行動を外側行動の断定にしない。新しい型・意味選択器・owner split・公開base経路を追加しない。

既存graph／direct shape／contributionと既存優先条件からPRESENT_UNFINISHED／LEAVE_UNFINISHEDが選択され、同じimmutable request-local decisionがHuman Receptionのforwardと独立replayへ届く。Human Receptionはその既選択openness補語に必要な読点を置き、既存の受取対象と補語内の目的語を区切る。観測上の分類語を消すだけの修正ではない。既存action-status補正にも元field末尾の疑問符を確認する拒否を加え、Ledgerで符号が落ちた質問から実行／予定の証明を作らない。Gate／parser／閾値／歴史的hash・PASSは変更しない。

代表本文で選択前の分類、選択された未完openness、観測とフォロー、Gate／independent inverseを確認した。4つの直接関連検査を追加し、原source欠損・不一致・引用・他者prefix・報告host・質問符と、本文から選択内容を除く改変を覆う。代表検証後の読点／追加境界を含む固定sourceで必要回帰・同じ100件・華恋全件全文確認を実行する。前段204件200成功／既存4失敗と100／124／73-27は変更前の証拠であり、今回最終コードの証明に流用しない。

この機能は保存直後Emlisのdisabled final Stage1内の受け止めを担当する。国家の保存・dispatch・queue・read-side、共通公開返却・RN passed-only表示、旧経路、Piece／分析との境界は維持。System Contextはdoctor→prepareが固定toolchain不一致で不成立のため原典直読、profile／基準ref／tracked current変更0。複文の過去予定・援助の受領主体・比較や他の可能性・長い復唱と集合反復は残件。商品NOT_CLEAR、商品確認準備／ready／採用／merge／本番／質問生成／Layer3は未成立。
