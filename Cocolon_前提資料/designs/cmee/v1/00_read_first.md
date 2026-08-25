# CMEE V1 詳細設計 — Read First

- document id: `cocolon.cmee.v1.detailed_design.read_first`
- revision date: `2026-08-25 JST`
- Step 10 final document id: `CMEE_STEP10_ULTRA_FINAL_INTEGRATED_REVISION_PROPOSAL_20260821_V2`
- Step 10 design identity: `CMEE_THREE_CORE_INTEGRATED_DESIGN_20260821`
- Step 10 Pro review: `CMEE_STEP10_PRO_SINGLE_PRODUCT_ROUTE_REVIEW_20260821 / CONSUMED_EXACTLY_ONCE`
- decision owner: `Mash`
- technical design owner: `Ultra華恋`
- architecture parent: [Cocolon_MeaningExperienceEngine_V1_FinalTechnicalDesign_ProReviewApplied_20260815.md](../Cocolon_MeaningExperienceEngine_V1_FinalTechnicalDesign_ProReviewApplied_20260815.md)
- NLSv3 inheritance input: [NLSv3_to_CMEE_Disposition_Phase1_20260817.md](../NLSv3_to_CMEE_Disposition_Phase1_20260817.md)
- lifecycle: `DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE`
- effective when: `MERGED_TO_COCOLON_MAIN_AS_DESIGN_OWNER`
- implementation approval: `NOT_GRANTED_BY_THIS_SUITE`
- dependency / production / test / runner / API / DB / RN effect: `0`
- Cycle001 restart effect: `0`
- Stage 1 language route: `ROUTE_A_PROVIDERLESS_GROUNDED_DISCOURSE_COMPOSER / SOLE_CURRENT_AND_FUTURE_ROUTE`
- Phase 0 / P0 / P0-R1 / standalone product-delta-0 L3-R / L3-I lifecycle: `RETIRED_HISTORICAL_NONREUSABLE`
- current implementation rule: `PRODUCT_QUALITY_DELTA_GT_0_AND_MASH_CONFIRMED_ONLY`
- current implementation state: `STAGE1_ADDITIONAL_CORRECTION_STEP3_COMMON_DEFECT_RETURN_BUDGET_EXHAUSTED_STOP`
- Phase 2 design correction state: `TOP_LEVEL_NAVIGATION_ALIGNED`
- Step 10 design correction state: `FINAL_INTEGRATED_CONTRACT_REFLECTED_EXISTING_EXACT14`
- Karen-derived functional companion: `exact2`
- Stage 1 additional correction final body: `COCOLON_CMEE_STAGE1_ADDITIONAL_CORRECTION_ULTRA_FINAL_TECHNICAL_BODY_AND_JOINT_RECOMMENDATION_20260824`
- Stage 1 additional correction Pro final confirmation: `PASS / BLOCKER 0 / MAJOR 0 / MINOR 0`
- Stage 1 additional correction placement: `NONCANONICAL_TECHNICAL_INTEGRATION_SOURCE / DESIGN_RECORD_WRITE_ONLY`
- duplicate parallel technical canonical design files: `0`
- current authorized next implementation: `NONE`
- automatic progression: `false`

---

## 0. このsuiteの役割

このdirectoryは、CMEEの上位技術設計を、実装者がsource、contract、module、failure、test、cutoverの順に追える詳細設計へ落とした正本候補である。

起点は旧G0–G10の補助経路ではなく、次の商品job exact3とする。

1. EmlisAI: 入力をLayer 1「見えたこと」とLayer 2「Emlisから」へ変え、plan budget内で各roundの一点を問い、Plus／Premiumは条件成立時だけLayer 3「記録の線」を加える。
2. Piece: 保存済み入力の意味を、本人の表現として他者へ共有できるcanonical textと画像artifactへ変え、recipient-visible route exact1以上まで届ける。
3. 分析構造: 期間sourceから現在の自己構造routeをsame-identityのtext＋visual graphで形にし、観測と分離したIF routeを扱う。external retentionはfuture HOLDとする。

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
source / owner / unknown / no-promotionのproduct contractだけは、route-neutralなcurrent実装unit内の制約として保持する。

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

### 0.2 NLSv3継承に関する第2段階の境界

第1段階の事実整理は、
[NLSv3 → CMEE Disposition表](../NLSv3_to_CMEE_Disposition_Phase1_20260817.md)
が所有する。同表は`REVIEWED_NONAUTHORITY / NLSV3_TO_CMEE_MIGRATION_INPUT`であり、設計正本、実装承認、
Cycle001再開authorityまたはproduction cutover authorityではない。第2段階では同表の分類とevidence indexを根拠に、
既存のFinal／Detailed Design ownerだけを必要な範囲で補正する。

NLSv3は捨てない。同時に、NLSv3とCMEEを二つの現役EmlisAI生成エンジンとして残さない。継承は大規模な
PR #2 recovery／surface実装をCMEEから丸ごと呼ぶwrapper方式ではなく、責任・使えるsymbol・test vector・corpus・
failure knowledge・Product Read方法を、それぞれのcurrent CMEE ownerへ移す方式とする。

継承区分は次のとおりである。

1. 三商品で共通するsource identity、evidence、meaning、unknown、semantic duty、plan、trace、artifact identity、machine／human分離はshared ownerへ置く。
2. App-Reachable Input、Observation、bound Reception、Emlisの声・距離・深さ、自然な日本語、body-only reverse、current100商品評価はEmlis routeへ置く。
3. Pieceには完成物から意味を戻す思想をtext＋visual用へ改良し、Analysisにはnode／edge／direction／IF provenance用へ改良して置く。
4. NLSv3の失敗case、mutation、回帰test、corpus、changed-output rereadはtest／failure knowledgeとして保持する。
5. Gate、Receipt、controller、executor、FD、長いauthority chain等の運用外殻はhistorical evidenceとして保持し、current routeへ復活させない。

切替はexact2の別境界で行う。

```text
A. Cycle001 candidate ingress cutover
   CMEE Cycle candidate ingress exact1
   NLSv3 direct recovery ingress 0

B. Production generation cutover
   Cycle proofと別のMash判断後
   CMEE Emlis generation owner exact1
   current production direct generation ingress 0
```

AとBを同一承認または同時cutoverへまとめない。第2段階のdesign correction自体から、A、B、実装、runner、
Product Read、PieceまたはAnalysis activationへ自動進行しない。

第2段階の整理順は次のexact5とする。

1. Final Designと本Read Firstで最上位の継承方針・読み順を揃える。
2. shared kernelとschemaで共通責任、identity、lineageの置き場所を揃える。
3. Emlis detailで商品中核、body-only reverse、natural／anti-template、separate safetyを揃える。
4. migration designでasset単位の移管、二段階cutover、旧owner退役を揃える。
5. Piece／Analysis detailへ将来改良する確認責任だけを明記する。

一つのphase資料を新設せず、既存ownerを順に修正する。第3段階のcurrent structure map／商品経路地図修正は、
上記design ownerの責任境界が揃った後に別write unitで行う。

### 0.3 Step 10 final integrated contract routing

2026-08-21のStep 10では、Step 9-B Final Disposition、MashのQ1〜Q3とplan判断、actual evidence、
Ultra stable V1に対するPro華恋の一回限りの正式reviewを、existing canonical exact14へ同期した。
Pro reviewは`CONSUMED_EXACTLY_ONCE`で、二回目は不要である。

current contractの短いroutingは次である。詳細は各exact ownerを読む。

| Contract | Canonical owner |
|---|---|
| source role、thread sequence、shared neutral boundary | `01_shared_kernel_and_runtime_contracts.md` |
| Emlis Free／Plus／Premium、Premium frame、Layer 1／2／3、question | `02_emlis_v1a_detailed_design.md` |
| Piece exact3 plan selection、recipient-visible final acceptance | `03_piece_v1c_detailed_design.md` |
| Analysis text＋graph、Free latest-only、IF、future external retention HOLD | `04_analysis_v1d_v1e_detailed_design.md` |
| logical thread／plan／layer／Piece／Analysis fields and invariants | `05_json_schema_and_versioning.md` |
| asset migration、remaining exact10、vertical order、verification | `06_implementation_order_migration_and_verification.md` |

cross-core source boundary:

- user originalとsupplemental answerは本人sourceである。
- Emlis Layer 1／2／3とquestionはderived artifactで、Analysis／Pieceのsourceにしない。
- Analysisはsupplemental answerをoriginal recordの補足根拠として使えても別occasionへ数えない。
- Pieceは本人が明示的に含めたsupplemental answerだけを使える。
- Premium cross-coreはuser-owned／user-confirmed／source-resolvable safe projectionだけを許可し、
  Piece生成本文、Analysis推定／IF、過去Emlis本文を拒否する。

Emlis plan／Layer:

```text
Free:
  current thread only
  Layer 1 + Layer 2
  question 0..1
  Layer 3 = 0

Plus:
  current thread + eligible owned history
  Layer 1 + Layer 2 + conditional Layer 3 0..1
  question 0..1

Premium:
  Plus + evidence-bound provisional correctable interpretive frame
  + allowed cross-core user context
  Layer 1 + Layer 2 + conditional Layer 3 0..1
  question sequential 0..3
```

P6 current-input structure insightは全planのLayer 1へ、P5 history continuityはPlus／PremiumのLayer 3へ置く。
Freeでもthreadを保存するが、別入力の生成sourceとしてpast threadを利用しない。

target scheduling order:

1. Emlis Layer 1／2。
2. Emlis question／refined Layer 1／2。
3. Emlis Plus／Premium Layer 3。
4. Piece text＋visual＋recipient-visible route。
5. Analysis V1-D observed text＋graph。
6. Analysis V1-E SELF_ONLY IF。

これはautomatic progressionまたはcross-core hard dependencyではない。各verticalの終点はactual artifactと
core-specific Product Readである。Cycle001はfresh current ownerが持つseparate external proof laneで、
docs、Layer 3、Piece、Analysisのautomatic prerequisiteではない。

Step 10 canonical synchronization set:

```text
parent Final Technical Design = exact1
detailed suite = exact7
current structure = exact5
Emlis long-term roadmap = exact1
total existing paths = exact14
new parallel canonical design file = 0
```

remaining `NEW_BUILD_IMPLEMENTATION`はlogical responsibility exact10であり、file countまたはimplementation authorityではない。
本docs reflectionからsource、test、DB、API、RN、runtime、activation、production、Cycle、Product Read、cleanupへ進行しない。

### 0.4 2026-08-23 華恋由来functional companion correction

2026-08-23のPro final reviewは、華恋由来の機能構造が既存technical ownerへ吸収されるだけでは、商品目的の独立ownerが残らないと判断した。Mashの今回指示に基づき、functional companion exact2を追加する。

```text
functional companion canonical candidate = exact2
duplicate technical canonical = 0
technical integration source = NONCANONICAL exact1
current structure map delta = 01 + 04
runtime / test / API / DB / RN / production effect = 0
product credit = 0
automatic progression = false
```

Step 10の`new parallel canonical design file = 0`は当時のsynchronization factとして保持する。今回追加するのは第二technical design treeではなく、P1–P8、M1–M7、Layer 1 / 2、V1–V9、最低商品品質を所有するfunctional companionである。

technical integration source:

[Cocolon CMEE Stage 1 華恋由来機能構造 Pro / Ultra 統合追加技術設計](../Cocolon_CMEE_Stage1_ProUltra_KarenDerivedFunctional_FinalTechnicalDesign_20260822.md)

次のruntime implementationは別の長い設計・審査projectへせず、fresh preimageを入れた短いexecution envelopeから同一bounded Stage 1 product correctionへ戻る。本docs correctionはimplementation開始authorityを生成しない。

### 0.5 2026-08-24 Stage 1 additional correction final body

Mashの今回の明示指示に基づき、Pro華恋が最終確認で`PASS / BLOCKER 0 / MAJOR 0 / MINOR 0`とした次の本文を、PR #30 working lineageへdocs-onlyで配置する。

[Cocolon CMEE Stage 1 追加修正 — Ultra華恋 Final Technical Body and Pro/Ultra Joint Recommendation](../Cocolon_CMEE_Stage1_AdditionalCorrection_UltraFinalTechnicalBodyAndJointRecommendation_20260824.md)

```text
document_id = COCOLON_CMEE_STAGE1_ADDITIONAL_CORRECTION_ULTRA_FINAL_TECHNICAL_BODY_AND_JOINT_RECOMMENDATION_20260824
reviewed_source_sha256 = 1f02e566ddfaefcbfc99ba985e3ef8af5c8e15b8867215c994cda99fbdedff05
reviewed_source_bytes_lines = 357275 / 4008
pro_final_confirmation_sha256 = ceef533a19d6ee2be75be06e8be74bc2fbefb7a7f0130050ffe2678903bef5bb
placement_role = NONCANONICAL_TECHNICAL_INTEGRATION_SOURCE
design_record_write = APPROVED_BY_MASH_20260824
implementation_approval = NOT_GRANTED
runtime_test_api_db_rn_production_provider_dependency_effect = 0
automatic_progression = false
```

本文frontmatterの`pro_review_verdict=CHANGES_REQUIRED`は初回reviewの歴史事実、`GITHUB_WRITE_APPROVAL=NOT_GRANTED`はfinal body freeze時点の状態として改変しない。本sectionとcanonical 06 §30が、今回のfinal Pro confirmationとdocs-only配置authorityを所有する。これは本文§12.2が禁じるparallel technical canonicalではなく、将来MashがLEVEL_3実装を明示承認した場合に限り、functional owner、02、05、06へ責任別に分配するintegration sourceである。

current v2 Step 7のmachine GREEN / pre-screen結果はhistorical factとして保持するが、Mashのactual本文判断「文章品質が不足する」によりproduct acceptanceは`FALSE`、candidate readyは`false`である。本文§13のStep 0–9だけをadditional correctionの提案実装順とし、canonical 06 §30がcallable名、known early exact4、遷移Tを一意に補足する。別の実装順ownerは作らない。System Context PR #37はnavigation-onlyのまま更新しない。

## 1. 読む順 exact10

1. 本file
2. [NLSv3 → CMEE Disposition表](../NLSv3_to_CMEE_Disposition_Phase1_20260817.md)
3. [華恋由来機能構造 — Read First](karen_derived/00_read_first.md)と[Stage 1 functional owner](karen_derived/01_emlis_observation_and_reception.md)
4. [01_shared_kernel_and_runtime_contracts.md](01_shared_kernel_and_runtime_contracts.md)
5. [05_json_schema_and_versioning.md](05_json_schema_and_versioning.md)
6. 実装対象coreの詳細設計
   - [02_emlis_v1a_detailed_design.md](02_emlis_v1a_detailed_design.md)
   - [03_piece_v1c_detailed_design.md](03_piece_v1c_detailed_design.md)
   - [04_analysis_v1d_v1e_detailed_design.md](04_analysis_v1d_v1e_detailed_design.md)
7. [06_implementation_order_migration_and_verification.md](06_implementation_order_migration_and_verification.md)
8. [Stage 1 additional correction Pro-confirmed final body](../Cocolon_CMEE_Stage1_AdditionalCorrection_UltraFinalTechnicalBodyAndJointRecommendation_20260824.md)
9. `../../../current_structure/04_cmee_current_structure.md`
10. 対象coreのcurrent structure mapとactual source / contract / test

Disposition表だけでcurrent実装状態や移管完了を決めない。本suiteだけでcurrent実装状態を決めず、current structure mapを地図、
GitHubのactual source / testを現物として両方確認する。

## 2. 文書別authority

| File | Owns | Does not own |
|---|---|---|
| `00_read_first.md` | 読み順、lifecycle、suite全体の非影響、NLSv3継承の第2段階routing | runtime contract詳細、asset単位の最終移管 |
| `karen_derived/00_read_first.md` + `01_emlis_observation_and_reception.md` | 華恋由来P1–P8、M1–M7、Layer 1 / 2、V1–V9、観測・選択・応答構造、最低商品品質、public-safe examples / prohibitions | Python型、schema、validator、trace実装、runtime algorithm |
| `../NLSv3_to_CMEE_Disposition_Phase1_20260817.md` | 第1段階の分類、受け皿、重複・欠落、evidence index | design authority、implementation authority、移管完了claim |
| `../Cocolon_CMEE_Stage1_AdditionalCorrection_UltraFinalTechnicalBodyAndJointRecommendation_20260824.md` | Pro-confirmed Stage 1 additional correctionのLEVEL_3 implementation candidate、root cause、提案delta、§13実装順 | parallel canonical owner、current runtime activation、implementation authority、Product PASS |
| `01_shared_kernel_and_runtime_contracts.md` | shared logical architecture、ports、pipeline、failure | core固有商品判断 |
| `02_emlis_v1a_detailed_design.md` | Emlis observation vertical、question lifecycle、Cycle境界 | Piece / Analysis activation |
| `03_piece_v1c_detailed_design.md` | share artifact、visual spec、identity、clean cutover | renderer implementation / DB activation |
| `04_analysis_v1d_v1e_detailed_design.md` | observed route、IF graph、projection、identity | current Watashi Mapの無承認置換 |
| `05_json_schema_and_versioning.md` | canonical draft schemas、identity、versioning | production schema registration |
| `06_implementation_order_migration_and_verification.md` | current product-quality implementation unit、NLSv3 asset migration、二段階cutover、Route A-only current authority | 実装開始authority |

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
11. NLSv3は責任・symbol・test・corpus・failure knowledgeをowner単位でCMEEへ継承し、PR #2全体をCMEE hostへwrapしない。
12. Cycle001 candidate ingress cutoverとproduction generation cutoverは別approval・別write unitとし、最終的にactive Emlis generation owner exact1へ収束する。

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
stage1_language_route = ROUTE_A_PROVIDERLESS_GROUNDED_DISCOURSE_COMPOSER_ONLY
external_generative_ai = PROHIBITED
external_body_send = 0
retired_provider_investigation = REMOVED_FROM_CURRENT_TREE_GIT_HISTORY_ONLY
runtime_state = DRAFT_WIP_DISABLED
implementation_evidence_owner = MASSYURED_MASHOS_API_DRAFT_PR_3_HEAD_106A1B8C92E808D15E88CE4F56C6300568D93E9F
r1_r4_state = CLOSED_GREEN
candidate_state = GENERATED_FOR_PRODUCT_READ_DISABLED_PENDING_MASH
machine_structural_exact8 = 8/8
product_read_state = PENDING_MASH_PRODUCT_READ
candidate_ready = false
source_owner_contract_complete = false
production_state = NOT_CONNECTED
cycle_state = NOT_REOPENED
current_authorized_next_implementation = NONE
only_admissible_next_implementation_class = ONE_BOUNDED_ACTUAL_EMLIS_STAGE1_ARTIFACT_IMPROVEMENT_UNIT
current_result_proof = NOT_ESTABLISHED_PENDING_MASH_PRODUCT_READ
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

本suiteの完成は、technical Markdown exact7とfunctional companion exact2がGitHubへ存在するだけではない。次を満たす必要がある。

- exact7相互linkが解決する。
- shared / Emlis / Piece / Analysisのauthority重複がない。
- schema draftと文章contractが一致する。
- implementation順にentry / exit / STOPがある。
- current CMEE structure mapが同じwrite unitで同期する。
- remote bytesとchanged pathsをpostverifyする。

## Current Route A-only authority（2026-08-25 Mash決定）

Mashのcurrent明示指示により、CMEE Stage 1のcurrent/future language routeはproviderless Route A exact1だけである。外部生成AI、external generative composer、remote model/provider、current input本文またはsemantic projectionの外部送信、network call、provider dependency、fallback、external costを禁止する。名称変更、別packet、別operator、別providerまたはfresh approvalで代替routeを復活させない。

今回の決定は外部route撤去とroute-neutral source/owner contractへの改名だけを承認する。第三generic correction、counter reset、同じStep 3の再実行、Step 4、formal Product Read、ready、merge、productionは承認しない。Route Aでceilingまたはreturn budget exhaustionとなった場合は、そのterminalで停止する。

```text
DECISION_ID = COCOLON_CMEE_STAGE1_ROUTE_A_ONLY_EXTERNAL_AI_PROHIBITION_20260825
DECISION_OWNER = MASH
SOLE_CURRENT_AND_FUTURE_ROUTE = ROUTE_A_PROVIDERLESS_GROUNDED_DISCOURSE_COMPOSER
EXTERNAL_GENERATIVE_AI = PROHIBITED
EXTERNAL_COMPOSER_OR_REMOTE_MODEL_PROVIDER = PROHIBITED
CURRENT_INPUT_OR_SEMANTIC_PROJECTION_EXTERNAL_SEND = 0
NETWORK_CALL / NEW_PROVIDER_DEPENDENCY / FALLBACK / EXTERNAL_COST = 0 / 0 / 0 / 0
ALTERNATIVE_ROUTE_CURRENT_AUTHORITY / FUTURE_TRIGGER / REACTIVATION = 0 / 0 / 0
EXTERNAL_OPERATOR = NOT_APPLICABLE
COMMON_DEFECT_RETURN_COUNT = 2/2_UNCHANGED
EARLY_ACTUAL_STATUS = NOT_RUN
STEP3 = COMMON_DEFECT_RETURN_BUDGET_EXHAUSTED_STOP
THIRD_GENERIC_CORRECTION / COUNTER_RESET / STEP3_RERUN / STEP4 = 0 / 0 / 0 / 0
CURRENT_AUTHORIZED_NEXT_IMPLEMENTATION = NONE
ONLY_POSSIBLE_FUTURE_CLASS = FRESH_LEVEL3_ROUTE_A_PROVIDERLESS_ONLY
PRIMARY_OUTCOME = ADMINISTRATIVE_ONLY
PRODUCT_CREDIT / TECHNICAL_CREDIT = 0 / 0
AUTOMATIC_PROGRESSION = false
```
