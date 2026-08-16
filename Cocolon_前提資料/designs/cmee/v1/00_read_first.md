# CMEE V1 詳細設計 — Read First

- document id: `cocolon.cmee.v1.detailed_design.read_first`
- revision date: `2026-08-16 JST`
- decision owner: `Mash`
- technical design owner: `Ultra華恋`
- architecture parent: [Cocolon_MeaningExperienceEngine_V1_FinalTechnicalDesign_ProReviewApplied_20260815.md](../Cocolon_MeaningExperienceEngine_V1_FinalTechnicalDesign_ProReviewApplied_20260815.md)
- lifecycle: `DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE`
- effective when: `MERGED_TO_COCOLON_MAIN_AS_DESIGN_OWNER`
- implementation approval: `NOT_GRANTED_BY_THIS_SUITE`
- dependency / production / test / runner / API / DB / RN effect: `0`
- Cycle001 restart effect: `0`
- L3-R route selection: `ROUTE_B_PROVISIONAL_ATTACHMENT_WITH_USER_SOVEREIGN_RESOLUTION`
- Phase 0 / P0 / P0-R1 / standalone product-delta-0 L3-R / L3-I lifecycle: `RETIRED_HISTORICAL_NONREUSABLE`
- current implementation rule: `PRODUCT_QUALITY_DELTA_GT_0_AND_MASH_CONFIRMED_ONLY`
- current implementation state: `DRAFT_WIP_DISABLED_PRODUCT_FAIL`
- current authorized next implementation: `NONE`
- automatic progression: `false`

---

## 0. このsuiteの役割

このdirectoryは、CMEEの上位技術設計を、実装者がsource、contract、module、failure、test、cutoverの順に追える詳細設計へ落とした正本候補である。

起点は旧G0–G10の補助経路ではなく、次の商品job exact3とする。

1. EmlisAI: 入力を「読まれた形」の観測へ変え、必要な場合だけ一点を問い、回答分だけ観測を深める。
2. Piece: 保存済み入力の意味を、本人の表現として他者へ共有できるcanonical textと画像artifactへ変える。
3. 分析構造: 期間sourceから現在の自己構造routeを根拠付きで形にし、観測と分離したIF routeを扱う。

CMEEは三商品へ共通する意味保持・artifact生成のtechnical coreである。独立したuser-facing商品、第四の商品中核、共通voice、万能text generatorではない。

### 0.1 絶対実装規則へのbinding

本suiteは、parent final design
[`§0.3 三大中核構造及びCMEE実装作業の絶対定義`](../Cocolon_MeaningExperienceEngine_V1_FinalTechnicalDesign_ProReviewApplied_20260815.md#03-三大中核構造及びcmee実装作業の絶対定義)
に従う。「三大中核構造及びCMEEの実装作業」は、三大中核構造及びCMEEの商品品質を1％でも
向上させる作業だけである。それ以外は作業とも成果とも扱わず、開始しない。

従って、Phase 0 / P0 / P0-R1およびstandaloneでproduct-quality delta 0のL3-R / L3-Iは
`RETIRED_HISTORICAL_NONREUSABLE`である。後続sectionに残るbody、identity、terminal、hash、resultは失敗履歴と
非再利用証拠だけであり、current prerequisite、approval order、next workまたは再実行authorityを持たない。
別executor、別provider、別model、rename、類似preflight、新しい承認または別名のsuccessorで復活させない。
Route Bのmeaning sovereignty、unknown、no-promotion等のproduct contractだけは、以下のcurrent実装unit内の制約として保持する。

別のMash明示承認後に許され得るnext implementation classは、unchanged input / fixtureとcurrent actual Emlis artifactをbeforeとし、その同じ入力から得る
actual Observation / Reception artifactの商品品質を非0に改善する、one bounded implementation unit exact1だけである。
必要なtechnical stepはこの同一unit内に限り、別stage、別Gate、別成果へ切り出さない。

同unitの末尾で、華恋はbody-full private boundary内で全candidateを本文として読む。復唱・近い言い換え・
meaning label置換・少数template・generic Reception・集合反復・深さ不足の一つでも残ればMashへ見せず、
商品本文の共通原因を同unit内で修正する。明白な低品質が解消し、商品artifactの設計・実装・読みの厳密さが
過去の補助経路へ投じた厳密さを少なくとも上回った後だけ、actual before / after / resultをMashへprivateに提示する。

商品品質向上の証明は、上記actual product resultとMashの明示確認だけである。華恋のmachine check、
trace、proof、hash、schema、internal reviewまたは自己採点はproofではない。Mash確認前はcandidateであり、成果または
product creditへ変換しない。この規則のためのnew Gate、checker、score、Receipt、authority familyまたはproof systemを作らない。

この規則の理由となった事実記録:
[EmlisAI商品中核の後回しとCMEE Product Read失敗](../../../audits/emlis_ai/Cocolon_EmlisAI_ProductNeglect_and_CMEE_ProductReadFailure_20260816.md)。

## 1. 読む順 exact7

1. 本file
2. [01_shared_kernel_and_runtime_contracts.md](01_shared_kernel_and_runtime_contracts.md)
3. [05_json_schema_and_versioning.md](05_json_schema_and_versioning.md)
4. 実装対象coreの詳細設計
   - [02_emlis_v1a_detailed_design.md](02_emlis_v1a_detailed_design.md)
   - [03_piece_v1c_detailed_design.md](03_piece_v1c_detailed_design.md)
   - [04_analysis_v1d_v1e_detailed_design.md](04_analysis_v1d_v1e_detailed_design.md)
5. [06_implementation_order_migration_and_verification.md](06_implementation_order_migration_and_verification.md)
6. `../../../current_structure/04_cmee_current_structure.md`
7. 対象coreのcurrent structure mapとactual source / contract / test

このsuiteだけでcurrent実装状態を決めない。current structure mapを地図、GitHubのactual source / testを現物として両方確認する。

## 2. 文書別authority

| File | Owns | Does not own |
|---|---|---|
| `00_read_first.md` | 読み順、lifecycle、suite全体の非影響 | runtime contract詳細 |
| `01_shared_kernel_and_runtime_contracts.md` | shared logical architecture、ports、pipeline、failure | core固有商品判断 |
| `02_emlis_v1a_detailed_design.md` | Emlis observation vertical、question lifecycle、Cycle境界 | Piece / Analysis activation |
| `03_piece_v1c_detailed_design.md` | share artifact、visual spec、identity、clean cutover | renderer implementation / DB activation |
| `04_analysis_v1d_v1e_detailed_design.md` | observed route、IF graph、projection、identity | current Watashi Mapの無承認置換 |
| `05_json_schema_and_versioning.md` | canonical draft schemas、identity、versioning | production schema registration |
| `06_implementation_order_migration_and_verification.md` | current product-quality implementation unitとretired historical packet記録、migration | 実装開始authority |

## 3. Fixed architecture decisions

1. outer hostは`ai/services/ai_inference/cocolon_meaning_experience_engine/`をexact1推奨とする。
2. current `cocolon_text_generation_core`はdownstream guard subsystemとして保持し、CMEE全体へ昇格しない。
3. first implementationはEmlis sourceからactual observation candidateまでのvertical sliceであり、空package / schema-only / adapter-onlyを完成扱いしない。
4. active generation ownerはcoreごとにexact1とし、cutover時のparallel active owner、fallback、mirror routeは0とする。
5. shared APIの詳細fieldはEmlisだけでfinal freezeせず、第2 actual coreで共通昇格を判定する。
6. Piece / Analysisのdesign contractは先に固定してよいが、runtime moduleは各phaseの別承認まで作らない。
7. machine PASS、human Product Read、actual-device PASS、runtime readiness、Cycle acceptanceを相互変換しない。
8. user source、provisional meaning、hypothesis、simulation、saved intentを型で分離する。
9. original sourceをuser correctionやsupplemental answerでretroactive mutationしない。
10. API / DB / RLS / RN / public routeはcore lifecycle ownerに残し、CMEE packageの初期実装で変更しない。

## 4. Historical Japanese linguistic provider recommendation state

officialに確認できた日本語parser / PAS候補は、morphology、dependency、predicate / argument proposalを返せても、current contractが要求する次を保証しない。

```text
complete candidate set
zero / omitted argumentを含むformal open-slot denominator
required / active owner全件のunique governing attachment
statistical one-bestをuser meaning authorityへできる根拠
```

したがって、GiNZA、spaCy Japanese、KWJA等を`FORMAL_CLOSED` authorityとして選定済みにしない。設計上は`PROVISIONAL_ONLY` candidate producer候補である。

2026-08-15のhistorical Phase 0 terminalは次だった。current implementation routeへ再利用しない。

```text
NO_SAFE_CMEE_V1A_CANDIDATE_STOP
```

route候補は次のexact2であり、2026-08-15 JSTのMash LEVEL_3判断でRoute Bを選択した。

1. `ROUTE_A_FORMAL_CLOSED_ATTACHMENT_AUTHORITY`: current formal closureを満たす別authorityを提示する。
2. `ROUTE_B_PROVISIONAL_ATTACHMENT_WITH_USER_SOVEREIGN_RESOLUTION`: provisional analysisをlimited observation / user clarification / unavailableへ明示的にbindするよう受入契約を変更する。

Mashはroute directionに加えて、`CMEE_V1_L3R_ROUTE_B_BOUNDED_PREFLIGHT_TECHNICAL_BODY` v1.0.0（canonical SHA-256 `4948bd4d0db491b29021a035af5d596776c86908301b5f49aeff15b2b8418901`）を承認した。provider / resolver責任、Route B cross-field semantics、KWJA exact1候補、temp path、categorical ceiling、network / storage / secret effect、failure / ambiguity / OOV、privacy、retry、post-preflight境界は同bodyへ固定され、L3-R exitは成立した。P0 exact1はdocs reflectionのfresh verification後にactivateされ、`P0_ACTIVATION_PRECONDITION_STOP`でterminalとなった。これらは変更しないhistorical factsである。

historical approval orderは`L3-R route + bounded preflight authorization -> P0 measured evidence -> L3-I dependency/resource/I1 exact allowlist -> I1`だったが、この順序とstandalone packetは全て`RETIRED_HISTORICAL_NONREUSABLE`である。P0 PASS、L3-I、alternate executor、providerの再選定または別のpreflightをcurrent I1 prerequisiteにしない。wheel / model / resource等のtechnical制約がactual artifact改善に必要な場合だけ、§0.1の同一bounded unit内で扱う。one-best arc、model score、Product Read、first / last / nearest heuristicはambiguityを消すauthorityにならない。

## 5. Runtime entrypoint target

outer public entryはexact1とする。

```python
MeaningExperienceEngine.generate(
    request: GenerationRequest,
) -> EngineOutcome
```

requestは`core_id + product_job`のdiscriminated unionである。V1-Aでadmitするのは`EMLIS_AI / OBSERVE_AND_CLARIFY`のObservation sliceだけである。Piece / Analysis callable、dynamic provider registry、empty handlerをproduction packageへ先行作成しない。

canonical internal / schema enum:

```text
core_id:
  EMLIS_AI | PIECE | ANALYSIS

product_job:
  OBSERVE_AND_CLARIFY | EXPRESS_AND_SHARE | MAP_AND_EXPLORE
```

V1-Aのactual admitted sub-jobは`OBSERVE_AND_CLARIFY`内のObservation sliceである。Piece formatのcanonical wire valueはexisting V2 contractへ合わせて`short_essay | quote | declaration`とし、uppercase Python enumを使う場合はserializerでexact mappingを一つだけ持つ。

## 6. State axes

current orthogonal state:

```text
document_lifecycle = DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE
route_selection = ROUTE_B_PROVISIONAL_ATTACHMENT_WITH_USER_SOVEREIGN_RESOLUTION
historical_l3r_state = L3R_ROUTE_B_APPROVED_P0_TERMINAL_ACTIVATION_PRECONDITION_STOP
historical_p0r1_executor_candidate_state = P0R1_GITHUB_HOSTED_EXECUTOR_FINAL_TECHNICAL_PROPORTIONALITY_STOP
historical_p0r1_execution = 0
historical_provider_admission = NO_SAFE_CMEE_V1A_CANDIDATE_STOP
historical_zero_delta_packet_lifecycle = RETIRED_HISTORICAL_NONREUSABLE
runtime_state = DRAFT_WIP_DISABLED
implementation_evidence_owner = MASSYURED_MASHOS_API_DRAFT_PR_3_HEAD_06CE311B3EA728B06F83439D268A34BED917C01C
r1_r4_state = CLOSED_GREEN
candidate_state = GENERATED_FOR_PRODUCT_READ_DISABLED_PRODUCT_FAIL
machine_structural_exact8 = 8/8
product_read_state = EVALUATED_FAIL_STOP
candidate_ready = false
route_b_contract_complete = false
production_state = NOT_CONNECTED
cycle_state = NOT_REOPENED
current_authorized_next_implementation = NONE
only_admissible_next_implementation_class = ONE_BOUNDED_ACTUAL_EMLIS_ARTIFACT_QUALITY_IMPROVEMENT_UNIT
current_result_proof = NOT_ESTABLISHED_PRODUCT_READ_FAIL
required_future_result_proof = ACTUAL_PRODUCT_RESULT_PLUS_MASH_EXPLICIT_CONFIRMATION
automatic_progression = false
```

future target states:

```text
CMEE_V1A_EMLIS_OBSERVATION_CANDIDATE_READY_DISABLED_NOT_ADMITTED
CMEE_V1A_CYCLE001_PROVEN
CMEE_V1A_EMLIS_OBSERVATION_PRODUCTION_OPERATIONAL
CMEE_V1B_EMLIS_QUESTION_OPERATIONAL
CMEE_V1C_PIECE_VISUAL_OPERATIONAL
CMEE_V1D_ANALYSIS_OBSERVED_ROUTE_OPERATIONAL
CMEE_V1E_ANALYSIS_IF_ROUTE_OPERATIONAL
CMEE_V1_THREE_CORE_OPERATIONAL
```

target listはautomatic transitionではない。current authorized next implementationは0である。別のMash明示承認がある場合に許され得るclass exact1だけが§0.1のactual Emlis artifact品質改善unitであり、historical preflight / L3-Iを間に挿入しない。Cycle再入場、production、Piece / Analysis activationは、各coreのactual product resultが必要な別product decisionである。

## 6.1 Parent contract refinement

本suiteの`05_json_schema_and_versioning.md`は、parent §6.6のstatus shapeを次の二層へ詳細化する。

- `GenerationArtifactBundle`: visible artifactが存在する`GENERATED | LIMITED`だけ。
- `EngineOutcome`: `GENERATED | QUESTION_PENDING | LIMITED | REJECTED | UNAVAILABLE | SEPARATE_SAFETY` exact6。`QUESTION_PENDING`はtyped clarificationと、core policyに応じたoptional artifact bundleを持てる。
- non-generated resultをempty `GenerationArtifactBundle`で表現しない。
- parent / Piece entryの`new Piece safe-disable`は、V1-C初回cutover前に別承認・pre-admitするsingle-owner `PIECE_V2_SAFE_UNAVAILABLE_ROLLBACK_TARGET`へ具体化する。generic feature flag、dual-run、旧Q&A restorationではない。

このrefinementはparentのproduct intentを変えず、同名typeの曖昧さを解消する。詳細suiteがdesign ownerとしてadoptされる場合、このstatus fieldに限り05をimplementation schema authorityとする。

## 7. Product-causal admission — human checklist only

新module、field、dependency、test、signalは、PR説明内で次を説明できる場合だけadmitする。

1. actual consumer core
2. product job
3. quality criterion ID
4. observed gap
5. user-visible artifactへ効く因果
6. 次のactual run / Product Read / device proof
7. stop / retire condition

この確認専用のchecker、schema、Gate、Receipt、dashboard、authority chainを作らない。

## 8. Privacy and evidence boundary

- runtime source body、generated body、user correction、Product Read本文はprivate body-fullである。
- public GitHubとbody-free telemetryへraw input / output、identifiable paraphrase、case ID、private locator、keyを出さない。
- source body hash、source commitment digest、visible text hashはprivateであり外へ出さない。承認済みのnon-user-correlating provider / schema / artifact identity hash、anonymous count、reason code、body-free contract resultだけをpolicy範囲で外へ出せる。
- internal `body_locator_private`はpublic serialization対象外である。
- CMEEは新しいpublic telemetry DB、log service、dashboardを作らない。

## 9. Completion and STOP

本suiteの完成は、Markdown exact7がGitHubへ存在するだけではない。次を満たす必要がある。

- exact7相互linkが解決する。
- shared / Emlis / Piece / Analysisのauthority重複がない。
- schema draftと文章contractが一致する。
- implementation順にentry / exit / STOPがある。
- current CMEE structure mapが同じwrite unitで同期する。
- remote bytesとchanged pathsをpostverifyする。

本suiteの2026-08-15 publication primary outcomeは`BLOCKER_NARROWED`だった。Route B selectionとbounded preflight technical body v1.0.0の承認によりL3-Rは成立した。P0 exact1はactivation preconditionでterminalとなり、historical stateは`L3R_ROUTE_B_APPROVED_P0_TERMINAL_ACTIVATION_PRECONDITION_STOP`である。後続のreviewed GitHub-hosted P0-R1 executor candidateも比例性STOPでpre-execution rejectされ、P0-R1 executionは0である。これはproduct / implementation creditではなく、商品出力、Product Read、runtime readiness、Cycle creditは増えなかった。この経路全体は`RETIRED_HISTORICAL_NONREUSABLE`である。

## 10. Historical nonreusable L3-R identity and activation boundary

本sectionと§11–12は、body、identity、terminalとfailure historyを保持するためのhistorical recordである。
current prerequisite、approval order、next workまたは再実行可能なbodyとして読まない。

Canonical body:

[CMEE V1 L3-R Route B Bounded Preflight Technical Body v1](../CMEE_V1_L3R_RouteB_BoundedPreflight_TechnicalBody_20260815.md)

```text
approval_token = CMEE_V1_L3R_ROUTE_B_TECHNICAL_BODY_V1_APPROVED
body_version = 1.0.0
body_canonical_sha256 = 4948bd4d0db491b29021a035af5d596776c86908301b5f49aeff15b2b8418901
P0 = CONSUMED_EXACT1_P0_ACTIVATION_PRECONDITION_STOP
implementation_approval = 0
automatic_progression = false
```

P0はcanonical bodyのactivation Gateでterminalとなった。dependency、requirements、lock、source、test、runner writeは0で、separate L3-Iは未承認のままであった。このL3-Iを承認するfuture routeは存在しない。

## 11. Historical nonreusable P0 body-free terminal

[CMEE V1 P0 KWJA 2.5.1 Base Body-Free Result](../CMEE_V1_P0_KWJA251_Base_BodyFree_Result_20260815.json)

```text
terminal = P0_ACTIVATION_PRECONDITION_STOP
authority = CONSUMED_TERMINAL
platform_tuple = NOT_RECORDED_BY_P0
temp_root_created = 0
network / acquisition / install / load / inference = 0
Route B disposition / sufficiency = NOT_EVALUATED_IN_P0
L3-I / implementation / Cycle001 = NOT_AUTHORIZED
automatic_progression = false
```

このterminalはKWJA capability、license/provenance、resource cost、Route B product sufficiencyのFAILではない。current executorのactivation precondition不成立で後段を未実行のまま閉じた結果である。`RETIRED_HISTORICAL_NONREUSABLE`のため再実行しない。

## 12. Historical nonreusable P0-R1 executor final technical judgment

[CMEE V1 P0-R1 GitHub-hosted bounded executor — Final Technical Body](../CMEE_V1_P0R1_GitHubHosted_BoundedExecutor_TechnicalBody_20260815.md)

```text
body_id = CMEE_V1_P0R1_GITHUB_HOSTED_BOUNDED_EXECUTOR_FINAL_TECHNICAL_BODY
body_version = 1.0.0
body_canonical_sha256 = d5637c8303e377e2bda11977425f209c139911acbb56542e8526ee0afa00be70
docs_reflection_approval = DOCS_REFLECTION_ONLY
approval_token = CMEE_V1_P0R1_GITHUB_HOSTED_EXECUTOR_FINAL_PROPORTIONALITY_STOP_V1_APPROVED_FOR_DOCS_REFLECTION_ONLY
p0r1_executor_candidate_state = P0R1_GITHUB_HOSTED_EXECUTOR_FINAL_TECHNICAL_PROPORTIONALITY_STOP
rule18_verdict = NO_SAFE_NEXT_CANDIDATE_STOP
work_rule_stop_classification = DETOUR_RISK_STOP
candidate = REJECTED_PRE_EXECUTION
P0_R1_execution = 0
ROUTE_B_FAILURE = NOT_ESTABLISHED
KWJA_FAILURE = NOT_ESTABLISHED
provider_resource_platform_evidence = 0
L3-I / dependency / implementation / I1 / Product Read / Cycle001 / production = NOT_AUTHORIZED
automatic_progression = false
```

Final bodyは、reviewed current GitHub-hosted executor candidateの技術的成立可能性と商品経路への比例性を分離し、minimum-compliant residual 32–52 focused hoursがcurrent one-shot evidence価値に比例しないためSTOPした。既存P0 terminalを置き換えず、Route B、KWJA、meaning sovereignty、owner denominator、clarification exact1、supplemental lineageを保持する。これらのhistorical facts / bodiesは変更しないが、別executor、P0 boundary、provider、model、version、task、corpus、rename、successorまたは新しい承認による再開routeはない。
