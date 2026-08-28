---
doc_id: cocolon_meaning_experience_engine_current_structure
title: "CMEE — Current Structure"
revision_date: "2026-08-27 JST"
document_role: "CMEE_CURRENT_STRUCTURE_AND_PRODUCT_QUALITY_ROUTE_OWNER"
effective_when: "MERGED_TO_COCOLON_MAIN"
publication_state: "DRAFT_PR_CANDIDATE_UNTIL_MERGED"
design_state: "MASH_APPROVED_ROUTE_A_TYPED_CASE_FRAME_V2_FINAL_DESIGN_WITH_SESSION_SAFE_ORDER"
detailed_design_state: "FINAL_DESIGN_APPROVED_IMPLEMENTATION_NOT_STARTED"
stage1_language_route: "ROUTE_A_PROVIDERLESS_GROUNDED_DISCOURSE_COMPOSER_ONLY"
external_generative_ai_allowed: false
external_body_send: 0
retired_provider_investigation: "REMOVED_FROM_CURRENT_TREE_GIT_HISTORY_ONLY"
current_authorized_next_work: "I00_AFTER_FRESH_EXPLICIT_STEP_START"
only_possible_future_implementation_class: "APPROVED_ROUTE_A_TYPED_CASE_FRAME_SUCCESSOR_I00_I14"
implementation_state: "PREDECESSOR_DRAFT_WIP_DISABLED_TERMINAL / SUCCESSOR_NOT_STARTED"
candidate_state: "FINAL_DESIGN_APPROVED_SUCCESSOR_NOT_GENERATED"
candidate_ready: false
product_read_state: "EVALUATED_FAIL_QUALITY_INSUFFICIENT"
production_runtime_effect: 0
automatic_progression: false
---

# CMEE — Current Structure

## 0. Current conclusion

正式推奨名称:

> Cocolon Meaning Experience Engine V1  
> Cocolon 三大中核構造共通・意味体験生成エンジン V1  
> 略称 CMEE V1

CMEEは、EmlisAI、Piece、分析構造の三商品から必要能力を逆算した共有生成中枢である。
G0–G10の補助経路またはcurrent text guardを拡大して作るのではない。

Current state:

    final technical design candidate
    detailed implementation design candidate
    absolute implementation rule = PRODUCT_QUALITY_DELTA_GT_0_AND_MASH_CONFIRMED_ONLY
    Phase 0 / P0 / P0-R1 = RETIRED_HISTORICAL_NONREUSABLE
    product-delta-0 standalone L3-R / L3-I = RETIRED_HISTORICAL_NONREUSABLE
    source / owner / unknown / no-promotion contract = RETAINED_ROUTE_NEUTRAL
    mashos-api Draft PR #3 = STEP7_V2_MACHINE_GREEN_DISABLED @ b7865574ebe08c801f6a2c779daf9148159cf8b0
    implementation state = DRAFT_WIP_DISABLED
    current Product Read = EVALUATED_FAIL_QUALITY_INSUFFICIENT
    additional correction final body = HISTORICAL_PREDECESSOR
    typed case-frame v2 final design = MASH_APPROVED / NOT_IMPLEMENTED
    candidate ready = false / product credit 0
    current authorized next work = I00_AFTER_FRESH_EXPLICIT_STEP_START
    only admissible future class = APPROVED_ROUTE_A_SUCCESSOR_STEP_0_TO_14_EXACT1_PER_SESSION
    not production connected
    not Cycle001 proven
    Piece not connected
    Analysis not connected
    automatic progression false

Current implementation rule owner:

- [Final Technical Design §0.3](../designs/cmee/Cocolon_MeaningExperienceEngine_V1_FinalTechnicalDesign_ProReviewApplied_20260815.md#03-三大中核構造及びcmee実装作業の絶対定義)
- [EmlisAI商品中核の後回しとCMEE Product Read失敗](../audits/emlis_ai/Cocolon_EmlisAI_ProductNeglect_and_CMEE_ProductReadFailure_20260816.md)

Mashの2026-08-16明示指示により、三大中核構造及びCMEEの実装作業は、既存core quality
contractの未達exact1以上を、before / afterのactual user-visible product artifactで非0に改善する
同一bounded unitだけである。CMEE内部の構造、test、proof、traceまたはsafety精度ではなく、
EmlisAI / Piece / 分析構造のactual product artifactに現れた改善だけを対象とする。

consumer core、unchanged input / fixture、before artifact、未達quality criterion、product-causal source、
after artifactを作業開始前に固定できない場合は開始しない。必要なtechnical stepは同じunit内の
従属制約とし、単独stage、Gate、成果またはcreditへ分割しない。新しいchecker、Gate、score、
Receipt、authority familyまたはproof systemは作らない。

KarenはMashへ提示する前にactual bodyを全件読み、復唱、label置換、template、generic Reception、
集合反復、深さ不足その他の明白な低品質が残る候補をMashへ戻さない。商品本文が補助経路へ
投入した精度・検証密度を上回った後だけbefore / after resultをMashへ提示する。Karen、model、
subagentはhuman PASSを自己attestせず、Mashの確認前は成果、product creditまたはacceptanceとして
確定しない。

## 1. Product-first derivation

CMEEが支えるproduct job exact3:

1. EmlisAI: current threadを中心にLayer 1「見えたこと」とLayer 2「Emlisから」を返し、各roundで必要な場合だけ一点を問い、回答分だけ観測を深める。Plus／Premiumは条件成立時だけLayer 3「記録の線」を加える。
2. Piece: 本人の意味を、他者が単独で受け取れるcanonical textと画像artifactへ変え、actual recipient-visible routeへ届ける。
3. 分析構造: 蓄積入力から現在の自己構造routeを根拠付きtext + graphで形にし、観測と分離したSELF_ONLY IF routeを扱う。external retentionはfuture HOLDとする。

必要な共通flow:

    user-owned source
      -> source roles and evidence
      -> provisional grounded meaning
      -> core-owned product intent
      -> experience / artifact plan
      -> text, visual card, map, route
      -> positive source / meaning trace
      -> machine verification
      -> core-specific human Product Read

## 2. CMEEの位置づけ

CMEEはengineering上first-classのshared technical coreである。
ただし独立したuser-facing purpose、release、acceptanceを持たないため、商品構造上の第四中核ではない。

CMEEは文章生成だけに限定しない。primary artifactはcoreごとに異なる。

| Core | Primary artifact |
|---|---|
| EmlisAI | observation／reception／clarification lifecycle |
| Piece | PieceArtifactSpec + derived RenderedPieceExport |
| Analysis | ObservedSelfStructureMap／IfScenarioCandidateSet（1–3 parallel simulations）／SavedRouteIntent |

## 3. CMEEが所有する責任

### 3.1 Source and evidence

- SourceEnvelope
- source role、version、owner、stage、privacy、lineage
- EvidenceGraph
- body-full private materialとbody-free public telemetryの分離
- cross-core source mixing rejection

### 3.2 Japanese meaning infrastructure

- predicate／argument attachment
- actor／referent
- lemma／inflection
- polarity、modality、temporal／topic scope
- relation endpoint／direction
- unknown、conflict、provenance、fail-close

これはlanguage-preservation infrastructureであり、人間理解の完成、本人の真実、隠れた原因を所有しない。

### 3.3 Plan and realization

- core-neutral artifact envelope
- SemanticDutyPlan／must-realize duty
- text／visual／graph projection plans
- plan-owned Japanese realization
- clause、particle、inflection、connective、sentence boundary
- candidate generation／comparison
- positive realization trace

### 3.4 Trust and improvement

- grounding、no-added-claim、no-mixing
- overclaim／diagnosis／unsupported future rejection
- Japanese coherence／non-template signals
- sentence／block／node／edgeからplan／meaning／sourceへのtrace
- body-free quality report
- causal localization、batch／version diff
- release／migration／incident時だけのOptional Reproducibility Capsule

## 4. CMEEが所有しない責任

各product coreへ残すもの:

- allowed sourceとsource eligibility
- 何を観測／表現／主張するか
- claim selection、attention、depth
- tone、voice、format、visible hierarchy
- core-specific artifact lifecycle
- API、DB、RN、public route
- human Product Read、actual device read、product acceptance

CMEEは一つの共通voice、万能template、core横断body reuseを作らない。

## 5. User meaning sovereignty

ユーザー本人が、自分の言葉の意味を最終的に確定できる主体である。

CMEEの内部graphは:

- source-bound
- provisional
- product-scoped
- correctable
- unknown-capable

であり、本人の絶対的真実ではない。

user-confirmed、user-corrected、unknown、hypothesisのlineageを分け、original sourceを書き換えない。


上記のPhase 0 / P0 / P0-R1とproduct-quality delta 0のstand-alone L3-R / L3-Iは全て
`RETIRED_HISTORICAL_NONREUSABLE`である。historical bodyとresultは削除・改変せず証拠として保持するが、
current prerequisite、next Gate、reusable authorityまたはimplementation creditにしない。別executor、別provider、
別model、rename、類似preflightまたはnew approvalによる復活は0である。

Candidate selectionはhard validity constraintsを先に適用し、有効候補の中で意味保持をnaturalness、shortness、appearance、machine score、resource costより先に置く。
faithfulなrouteが比例的scopeで作れない場合、安価なmeaning-loss candidateを選ばずSTOP／redesignする。

## 6. Logical architecture

    Core Source Adapter
      -> SourceEnvelope
      -> Japanese Structure Candidate Provider
      -> independent Attachment Admission Assessor
      -> GroundedMeaningGraph
      -> Core Product Intent Compiler
      -> ExperiencePlan / ArtifactPlan
      -> Realization Candidate Set
      -> Positive Trace + Guard Pipeline
      -> GenerationArtifactBundle
      -> Core Lifecycle Adapter

GenerationArtifactBundle minimum identity:

- artifact_id
- artifact_version
- artifact_kind
- core_id
- product_job
- epistemic_partition
- source commitments
- semantic_graph_ref
- experience_plan_ref
- primary artifact
- companion artifacts
- realization trace
- quality report
- parent／projection lineage
- bundle status = generated／limited（visible artifactあり）

Non-generated resultとquestion stateはouter `EngineOutcome`が所有する。

- outcome status = generated／question_pending／limited／rejected／unavailable／separate_safety
- rejected／unavailable／separate_safetyはempty primary artifactを作らない

## 7. Current actual shared subsystem

Current mashos-apiにはcocolon_text_generation_coreが存在する。

| Responsibility | Path | Actual role |
|---|---|---|
| shared types | ai/services/ai_inference/cocolon_text_generation_core/types.py | SHARED_SUBSYSTEM |
| evidence | ai/services/ai_inference/cocolon_text_generation_core/evidence.py | SHARED_SUBSYSTEM |
| phrase units | ai/services/ai_inference/cocolon_text_generation_core/phrase_units.py | SHARED_SUBSYSTEM |
| sentence plan | ai/services/ai_inference/cocolon_text_generation_core/sentence_plan.py | SHARED_SUBSYSTEM |
| composer | ai/services/ai_inference/cocolon_text_generation_core/composer.py | caller-supplied candidate validator |
| result／policies | ai/services/ai_inference/cocolon_text_generation_core/result.py、ai/services/ai_inference/cocolon_text_generation_core/policies.py | SHARED_SUBSYSTEM |
| guards | ai/services/ai_inference/cocolon_text_generation_core/guards/ | grounding、coherence、must-keep、overclaim、template echo |
| adapters | ai/services/ai_inference/cocolon_text_generation_core/adapters/emlis_observation_composer.py、ai/services/ai_inference/cocolon_text_generation_core/adapters/piece_composer.py、ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_composer.py | current guard adapters |
| boundary test | ai/tests/test_cocolon_text_generation_core_boundary.py | exact3 output boundary |

CoreTextComposerはcandidateを生成せず、missing candidateをfail-closeする。
これはCMEEの再利用subsystem候補であり、CMEE全体またはJapanese meaning authorityではない。

adapter lifecycleを混同しない。

- Emlis adapterはcaller-supplied candidateを検査するlimited-composer接続であり、CMEE observation generation ownerではない。
- Piece / Analysis adapterはevidence / supplied-candidate guard boundaryのskeletonで、future V2 Pieceまたはevidence-bound Analysis routeへ未接続である。
- exact3 adapterが存在しても、三中核CMEE implementation、Piece V2 activation、Analysis observed / IF graph authorityが成立したことにはならない。

## 8. Exactly one host recommendation

Final design candidateの推奨route:

    CMEE_V1A_OUTER_HOST_STRANGLER_ROUTE_V1

同じmashos-api process内に、outer hostとして次を設計候補とする。

    ai/services/ai_inference/cocolon_meaning_experience_engine/

このhostはmashos-api Draft PR #3でdisabled verticalとして既にmaterializeされ、current Product Read failed beforeに含まれる。
ここでのfuture設計対象はpackage新設ではなく、商品品質correctionとproduction / cutover境界である。
空package、typesだけ、adapterだけを成果にしない。別Mash承認後のcorrectionはEmlis observationの
sourceからactual surface／Reception／human readまでを一巡し、商品品質を非0改善する同一unitでなければならない。

Current cocolon_text_generation_coreは初期段階でdownstream candidate validation／common guard subsystemとして保持する。
PR #2のCycle001 recovery builderをCMEE wrapperまたはhostへ昇格しない。

cutover時:

- CMEE callable／runner ingress exact1
- old direct active ingress exact0
- parallel engine／fallback／mirror route 0
- old codeの後続除去は、既にunreachable／reference-onlyとなったものだけ

outer host、callable、import ingress、meaning provider、exact change pathsは、actual product artifactを改善する
最初のbounded implementation unit内で必要な範囲だけ固定する。同一unitでactual improvementまで
到達できない場合は開始せず、Phase 0 / P0または類似の先行作業へ分割しない。

## 9. Current PR #2／G0–G10／CQIF disposition

### mashos-api Draft PR #2

- private／experimental Cycle001 WIP
- runtime_connected false
- CMEE hostではない
- reusable source／evidence／plan knowledgeはsymbol単位で再評価する
- 5900行級recovery builderを丸ごとwrapしない

### G0–G10 assets

KEEP／EXTRACT:

- source lineage
- semantic evidence
- plan-owned realization
- causal RED／GREEN
- human Product Read separation
- batch evaluationの最小責任
- privacy／body-free telemetry

OPTIONAL CAPSULE:

- environment fingerprint
- artifact／hash／transport／epoch／recovery
- release candidate、migration、重大incident、forensic／security時だけ

RETIRE FROM DAILY AUTHORITY:

- inspector／scanner／harness常時運用
- per-step SHA authority chain
- mandatory runtime identity
- controller／FD proof
- transport proofをproduct validityにする経路
- technical GREENを進捗代替にする経路
- duplicate Receipt／Result／Handoff／Plan／snapshot

### CQIF

Cocolon_Quality_Intelligence_Foundation_CrossCore_ApplicationPlan_20260814.mdはnon-normative proposalである。
CMEEが推奨top-level architectureをsupersedeし、CQIFはquality plane／asset recoveryのhistorical design sourceとして保持する。並列active ownerにしない。

## 10. Current design owner

Full design candidate:

[Cocolon_MeaningExperienceEngine_V1_FinalTechnicalDesign_ProReviewApplied_20260815.md](../designs/cmee/Cocolon_MeaningExperienceEngine_V1_FinalTechnicalDesign_ProReviewApplied_20260815.md)

Detailed implementation design suite:

[CMEE V1 詳細設計 — Read First](../designs/cmee/v1/00_read_first.md)

children:

1. `01_shared_kernel_and_runtime_contracts.md`
2. `02_emlis_v1a_detailed_design.md`
3. `03_piece_v1c_detailed_design.md`
4. `04_analysis_v1d_v1e_detailed_design.md`
5. `05_json_schema_and_versioning.md`
6. `06_implementation_order_migration_and_verification.md`
7. `karen_derived/00_read_first.md`
8. `karen_derived/01_emlis_observation_and_reception.md`

Stage 1 Pro / Ultra technical integration source:

[Cocolon CMEE Stage 1 華恋由来機能構造 Pro / Ultra 統合追加技術設計](../designs/cmee/Cocolon_CMEE_Stage1_ProUltra_KarenDerivedFunctional_FinalTechnicalDesign_20260822.md)

このsourceは`NONCANONICAL_TECHNICAL_INTEGRATION_SOURCE`であり、children exact8のtechnical / functional authorityを置換しない。

Lifecycle:

    FINAL_TECHNICAL_DESIGN_CANDIDATE
    implementation approval NOT_YET
    production / test / dependency / DB / API / RN effect 0
    Cycle001 restart effect 0

このcurrent structure map、full design、detail suiteのmerge自体は実装承認または商品品質向上にならない。
historical L3-R / P0 / P0-R1 bodyは実行権限を生成せず、standalone L3-Iもcurrent prerequisiteではない。
実装はFinal Technical Design §0.3に合致するactual product-quality unitの別のMash承認なしに開始しない。

### 10.1 Step 10 final integrated contract

このcurrent structure ownerは、正式review済みの次のidentityを既存設計群へ同期する。

    DOCUMENT_ID = CMEE_STEP10_ULTRA_FINAL_INTEGRATED_REVISION_PROPOSAL_20260821_V2
    DESIGN_IDENTITY = CMEE_THREE_CORE_INTEGRATED_DESIGN_20260821
    FORMAL_PRO_REVIEW = CONSUMED_EXACTLY_ONCE
    SECOND_PRO_REVIEW = false

#### EmlisAI thread／plan／layer

- original input、各supplemental answer、question、Layer 1／2／3を同一input-history threadへ順序付きで接続する。ただしuser-owned sourceとderived artifactは別role／version／round lineageであり、derived artifactを本人sourceへ昇格させない。
- Freeはcurrent thread only、Plusはeligible owned historyを加える。Premiumはさらに根拠付き・暫定的・修正可能な「ユーザー固有の解釈フレーム」と許可済み本人contextをplan／purpose境界内で使う。
- question budgetはFree／Plusがthread全体で0..1、Premiumが逐次0..3である。各roundでLayer 1／2を先に返し、重要unknown、本人の続行、残budgetが全て成立する場合だけquestion exact1を出す。
- P6 Structure Insightはcurrent input内の構造気づきとして全planのLayer 1へ置く。P5 User Label Connectionはeligible historyとのcontinuityとしてPlus／Premiumの条件付きLayer 3 0..1へ置く。

#### Piece／Analysis

- PieceはFree fixed short_essay、Plus auto eligible exact3、Premium eligible user selection exact3とし、plan間で意味保持・文章品質を落とさない。preview／saveは中間状態であり、actual recipient-visible route exact1以上で他者が単独受領できることをfinal acceptanceへ含める。exact channelはHOLDである。
- AnalysisはFree latest-only、Plusはartifact history + comparison、PremiumはPlus範囲に加えて別承認後のV1-E／SavedRouteIntentを扱う。canonical identityを共有するtext + graphを返し、IF routeはSELF_ONLY、explicit selection、unranked 1..3とする。health／medical IFおよびother-person intent／reaction／relationship outcome IFは対象外である。
- Analysis external retention／sharing／Nexus、exact format／renderer／storageはfuture HOLDであり、初期mandatory exportやPiece完了の無条件gateにしない。

#### shared boundary／remaining responsibility

- cross-coreでsemantic source候補にできるのは、original、supplemental answer、許可済み本人contextだけである。Analysisはsupplemental answerをoriginal recordに従属する補足根拠として利用できるが、Pieceは本人の明示opt-inがある場合だけ利用できる。Emlis本文、Piece生成本文、Analysis推定／IFを他coreの本人sourceにしない。
- current target順はEmlis vertical exact3、Piece、Analysis observed、Analysis IFである。残るlogical responsibilityはNB-F01..NB-F10 exact10であり、詳細ownerは[CMEE V1 Implementation Order / Migration / Verification](../designs/cmee/v1/06_implementation_order_migration_and_verification.md)が持つ。
- plan、capability、context、user model、history search、P5、P6等はADAPT_AND_INHERIT候補である。generic fixed visible body、old Q&A、presentation-oriented map、hidden PDF helperをtarget artifactとしてREUSE_AS_ISしない。

今回のStep 10はexisting exact14へのdocumentation reflectionだけであり、code、test、runtime、dependency、DB、API、RN、activation、Cycle001、Product Read effectは0である。

## 11. Implementation order

1. Phase 0 / P0 / P0-R1とproduct-delta-0 standalone L3-R / L3-Iは歴史証拠としてのみ保持し、current routeから退役。
2. target vertical順はEmlis Layer 1／2、Emlis question／refined Layer 1／2、Emlis Plus／Premium Layer 3、Piece text + visual + recipient route、Analysis observed text + graph、Analysis SELF_ONLY IFである。
3. 各verticalはconsumer core exact1のactual product artifactを非0に改善するone bounded implementation unit exact1として別のMash承認を得る。前verticalのmachine GREENだけで自動進行しない。
4. source / provider / dependency / resource / test / runner / privacy / Safetyは、同一unitでactual resultまで届けるための必要最小な従属制約としてだけ扱う。
5. Karenがunchanged input / fixtureのbefore / after actual bodyを全件pre-screenし、明白な低品質が残る場合はMashへ提示せず、同一unit内で商品本文の原因を修正する。
6. 商品artifactの品質が補助経路へ投入した精度・検証密度を上回った後だけMashへbefore / after resultを提示する。
7. Mashの確認後だけ商品品質向上、成果またはproduct creditを確定する。Karen / model / subagentはhuman PASSを自己attestしない。
8. 確認後もCycle001、production cutover、次verticalまたは次unitへ自動進行しない。

## 12. Anti-bloat boundaries

新しいshared componentは、人間用のwork説明として次を全て示す。

1. actual core consumer
2. three-core quality criterion
3. observed product failure／acceptance gap
4. output／artifactを変える因果
5. next actual run／Product Read
6. stop／retire condition
7. duplicate ownerがないこと

これを新しいruntime Gate、checker、schema、Receipt、dashboardへしない。

さらに:

- new production symbolのcriterion mapping 100%
- orphan module／metric／field 0
- shared-only implementation packet 0
- foundation-only packetをProduct Readなしで連続させない
- active duplicate owner 0
- formal shared APIはsecond actual consumer前にfreezeしない
- Emlis-only providerをthree-core universal truthへ昇格しない
- external network／storage write 0 default
- API／DB／RN／public route effect 0 default
- actual before / after artifactの品質delta 0なら作業、成果、technical creditとして閉じない
- product-delta-0のcorrection、preflight、proofまたは測定を次の独立unitへ送らない

規模の大小ではなく、三商品のactual artifactに非0の品質向上を出さない実装行動を全て禁止する。

## 13. Current gaps

1. CMEEによるactual three-core product artifactのMash-confirmed品質向上は未成立。
2. mashos-api Draft PR #3 head `106a1b8c92e808d15e88ce4f56c6300568d93e9f`には、disabled CMEE Stage 1 verticalが実在し、47 tests PASS、unchanged exact8 8/8 `GENERATED`、structural trace 8/8まで成立している。
3. current verticalのMash Product Readはpending、candidate ready false、source-owner contract complete false、Product / full-I1 / Cycle001 / production credit 0である。historical predecessorのProduct Read FAILをcurrent candidateのverdictへ転用しない。現在の不足は入力固有のwhole-input observation、Emlis固有subjectivity、自然さ、非template性、読まれた感を含むactual artifactの商品品質確認である。
4. current text coreとPR #2 assetのsymbol-level dispositionは、direct product unitに必要なsymbolだけ同一unit内で行う。別作業へしない。
5. Cycle001は`FORMAL_LEXICAL_AUTHORITY_UNRESOLVED`で停止中だが、このblockerの証明強化をproduct-delta-0の独立作業へしない。
6. runtime correction authorityは0。別のMash明示的なimplementation開始指示がある場合だけ、fresh unchanged exact8 beforeを固定するone bounded actual Emlis Stage 1 product-quality unitを開始できる。
7. Step 10で設計したinput-history thread、plan別question、P5／P6 product integration、Piece recipient route、Analysis text + graph／SELF_ONLY IFは未実装である。external retentionはfuture HOLDである。
8. actual asset migrationを反映しても、remaining responsibilityはNB-F01..NB-F10 exact10であり、design同期をruntime readinessへ変換しない。

## 14. History and design pointers

- full CMEE final technical design candidate
- Final Technical Design §0.3 absolute implementation rule
- Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_ProductNeglect_and_CMEE_ProductReadFailure_20260816.md
- CMEE V1 detailed implementation design suite under Cocolon_前提資料/designs/cmee/v1/
- Cocolon_前提資料/Cocolon_Quality_Intelligence_Foundation_CrossCore_ApplicationPlan_20260814.md
- Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_安全装置全履歴_20260701_20260813.md
- Cocolon_前提資料/audits/emlis_ai/Cocolon_Cycle001_PostG2_SystemArchitecture_Reusability_Audit_20260814.md
- existing cocolon_text_generation_core and its boundary test
- mashos-api Draft PR #2 as experimental asset／failure knowledge

## 15. Map update triggers

次を変更するworkは、このfileを同じwrite unitで更新する。

- CMEE host／package／callable／runner ingress
- Japanese meaning provider／dependency／resource boundary
- common protocol／artifact identity
- Emlis／Piece／Analysis adapter connection
- current text core／PR #2／G0–G10 asset disposition
- active owner cutover／retirement
- implementation phase／proof state
- CMEEのauthority boundaryまたはanti-bloat boundary
- absolute product-quality work boundary

内部logicのみで構造が不変ならSTRUCTURE_MAP_DELTA_NONEと理由を記す。

## 16. Last verified refs

    Cocolon main
      de9c3d985053bbaaa7fc0d396e688cc2097ece40

    Cocolon Draft PR #29
      0854e21f92f841fd2cfdcef08b9e3117fc93f96a

    Cocolon Draft PR #30 current work preimage
      986dbb6b1a0e5be54cf5776e4402bf369ec26887

    mashos-api main
      a8ca4ddf7b7ae76bf7b3d73e74e3a5808d623428

    mashos-api Draft PR #2
      958c1b53f5b5894691e0b10e2d991fb8236d9f6f

    mashos-api Draft PR #3 current
      106a1b8c92e808d15e88ce4f56c6300568d93e9f

次回はfresh refと実fileを再確認する。

## 20. CMEE current structure 更新 — Stage 1（2026-08-22）

- code lineage: `MassyuRed/mashos-api` Draft PR #3 / `106a1b8c92e808d15e88ce4f56c6300568d93e9f`
- current implemented slice: `TK-01 -> NB-F01`。
- input bundle -> evidence resolver -> grounded plan -> meaning graph / experience plan -> two-layer artifact のvertical sliceをdisabled状態で実装。
- safety は独立経路。experiencer / time / negation が不明確な入力はfail closed。
- material unknown は `LIMITED` と可視 UNKNOWN、unknown 0 は `GENERATED`。いずれもautomatic progression false。
- exact8 8/8 GENERATED、structural trace 8/8、47 tests PASS。
- 既知MINOR: メタ入力prefix（`例えば…` / `Q:` 等）の表記差は未収録。
- Product readの最終authorityはMash。Product PASS、candidate ready、activation、production effectはまだ0/false。
- 次の許可対象はProduct確認のみであり、第2段階は未着手。

## 21. CMEE current structure 更新 — 華恋由来Stage 1 functional correction（2026-08-23）

本sectionはStage 1 design / next-boundaryについて§20よりfreshであり、§20のhistorical 2026-08-22 stateと衝突する場合はこちらを優先する。

Canonical working ownerはCocolon Draft PR #30である。System Context V1のPR #37は管理entryとしてfreezeを維持し、本correctionを重複反映しない。

owner delta:

```text
functional companion canonical candidate = exact2
  designs/cmee/v1/karen_derived/00_read_first.md
  designs/cmee/v1/karen_derived/01_emlis_observation_and_reception.md

technical integration source = exact1 NONCANONICAL
  designs/cmee/Cocolon_CMEE_Stage1_ProUltra_KarenDerivedFunctional_FinalTechnicalDesign_20260822.md

technical canonical owners retained:
  designs/cmee/v1/01 / 02 / 05 / 06
```

functional delta:

1. Observation depthとSubjective depthを独立にし、FOCUSED / LAYERED / DENSEを別々に決める。
2. FOCUSED Layer 2 exact1を正常成立にし、genericな二文目を足さない。
3. `AffectIntensity`をuser emotion strengthから直接決めず、response materiality / relational distance / care constraintから決める。
4. `DISCOMFORT`を出来事 / value conflict / promotion riskへbindし、ユーザー本人 / 人格へ向けない。
5. Emlis subjectivityをrequest-local / stateless response stateへ限定し、persistent emotion / hidden state / autobiography / cross-request affectを0にする。
6. semantic InterpretationCandidatePoolとsame-plan surface `RealizationCandidateSet(max2)`を分離し、automatic retry / legacy fallbackを0にする。
7. existing `GroundedHumanReceptionPlan`のopportunity / move / stance / speaker / reference / safety資産をREUSE / TRANSFORMし、finished surface ownerだけをretireする。
8. Free=current input only。Plus / Premiumのowned historyはentitlement / source admission境界を通し、current Stage 1 unitのPremium runtime effectは0にする。

次のimplementationは別の長いdesign / review projectにしない。fresh preimage、exact changed paths、新規file exact1、legacy owner停止点、comparator delta、unchanged exact8、tests、actual after、華恋pre-screen、Mash Product Read、STOPを短いexecution envelopeへ固定し、一つのbounded Stage 1 product correctionとして進める。

今回のeffectはCocolon docs / routing / current structure mapだけである。runtime、test、runner、API、DB、RN、production、Cycle、question、Layer 3、Piece、Analysis effectは0。Mashのimplementation開始指示前は進めず、全段階で`automatic_progression=false`を維持する。

## 22. CMEE current structure 更新 — Stage 1 Step 7 correction（2026-08-23）

本sectionはStage 1 correctionのcurrent working stateについて§20 / §21よりfreshである。mashos-api Draft PR #3のdisabled Emlis verticalだけがimplementation ownerであり、shared CMEE production owner、three-core共通API、provider、dependency、source admissionを新設しない。

current owner / boundary:

```text
response compiler = compile_stage1_response / private disabled exact1
finite language policy = cocolon.emlis.stage1.microgrammar.v2
canonical inventory owners = runtime + canonical 02 §25.1 + canonical 05 §23.1
production engine route effect = 0
public serializer / API / DB / RN / persistence effect = 0
provider / source / dependency expansion = 0
Piece / Analysis / question / Layer 3 effect = 0
private body / digest / locator GitHub publication = 0
```

最初のStep 7 pre-screenで共通surface原因を確認したため、Step 2–4へ戻してprovider / source / allowlist拡張0のsame-scope v2 correctionを行った。fresh Step 5は7/7、Step 6はcontracts 70/70 + vertical 41/41 = 111/111で、all-variant quote seal、forged three-pair fail-closed、typed source-shape parser tableも通過した。formal V10 Step 7はpairwise 28/28と独立set-level review 2/2を通過した。case / pairwiseのMajor / Blocker 0、明白な低品質0/8、source fidelity 8/8、duplicate / forbidden 0、SX07重点全PASSであり、case minorはnonblockingである。通過後もcandidateはdisabledのままであり、Product PASS、activation、production、Cycle001、full-I1 creditへ自動進行しない。

```text
formal_step7_revision = V10
v2_inventory_tuple_bytes_sha256 = 44 / 16695 / dc4e1e5ef8026d5577698f375e305db7886f57096c69e6e6a0b99bfe1f26de8a
step5_atomic_proof_rerun = 7 / 7 PASS
step6_full_regression_rerun = 111 / 111 PASS
step6_quote_and_parser_regression = PASS
step7_pairwise_pre_screen = 28 / 28 PASS
step7_independent_set_level_reviews = 2 / 2 PASS, each Blocker / Major 0 / 0
step7_case_major = 0
step7_pairwise_major_blocker = 0 / 0
obvious_low_quality_count = 0 / 8
source_fidelity = 8 / 8
duplicates / forbidden = 0 / 0
sx07_focused_conditions = ALL PASS
runner_candidate_ready = false
runner_product_read_eligible = false
mash_presentation_pre_screen_eligible = true
remote_exact_path_and_bytes_equality = PASS_VERIFIED_POST_PUSH
product_read_evaluated = false
product_pass = not_declared
product_technical_full_i1_cycle001_production_credit = 0
automatic_progression = false
```

## 23. CMEE current structure 更新 — Stage 1 additional correction design record（2026-08-24）

本sectionはcurrent Product verdictとfuture Stage 1 design routeについて§22よりfreshである。§22のv2 Step 7 machine / pre-screen receiptはhistorical factとして保持するが、Mashのactual本文判断によりproduct acceptanceは`FALSE`である。

```text
v2_product_read = EVALUATED_FAIL_QUALITY_INSUFFICIENT
v2_machine_green = HISTORICAL_TRUE
v2_candidate_ready = false
additional_correction_final_body = PRO_CONFIRMED_NONCANONICAL_INTEGRATION_SOURCE
additional_correction_implementation = NOT_APPROVED_NOT_STARTED
current_authorized_next_work = NONE_PENDING_MASH_LEVEL3_IMPLEMENTATION_DECISION
production / API / DB / RN / persistence / provider / dependency effect = 0
automatic_progression = false
```

design record:
[Cocolon CMEE Stage 1 Additional Correction — Ultra Final Technical Body and Joint Recommendation](../designs/cmee/Cocolon_CMEE_Stage1_AdditionalCorrection_UltraFinalTechnicalBodyAndJointRecommendation_20260824.md)

canonical ownerはfunctional=`v1/karen_derived/01`、technical=`v1/02`、schema / identity=`v1/05`、implementation order=`v1/06`、shared S8/S9=`v1/01`のままである。new final bodyはparallel canonicalではなく、canonical 06 §30から§13へrouteするLEVEL_3 implementation candidateである。System Context PR #37はnavigation-only / frozenのまま重複反映しない。

## 24. Current Route A-only authority（2026-08-25 Mash決定）

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

## 25. Route A typed Japanese case-frame realizer v2 final design（2026-08-27 Mash最終承認）

§24のRoute A-only境界、§62相当のpredecessor terminal、counter 2/2を保持したまま、Mashはfresh sibling successor design exact1を最終承認した。corrected V2へPro delta CLEARが出たとは扱わない。

design record:
[Route A Typed Japanese Case-Frame Realizer v2 — Final Technical Design and Implementation Order](../designs/cmee/Cocolon_CMEE_Stage1_RouteA_TypedJapaneseCaseFrameRealizerV2_UltraFinalTechnicalDesignAndImplementationOrder_20260827.md)

    FINAL_DOCUMENT_ID = CMEE_STAGE1_ROUTE_A_TYPED_JAPANESE_CASE_FRAME_REALIZER_V2_ULTRA_FINAL_TECHNICAL_DESIGN_AND_IMPLEMENTATION_ORDER_20260827
    SOURCE_CORRECTED_V2_SHA256 = 4c71c49577e4e95cbc735eafeacc301cabcc4b2c8d3dc4544006dcdd56a9b0de
    FINAL_DOCUMENT_SHA256 = da20918280ccb4bcaba7ee112dca454e447fdcfb6432891e3c7437d29b311cbd
    MASH_DECISION_ID = COCOLON_CMEE_ROUTE_A_V2_FINAL_DESIGN_AND_SESSION_ORDER_APPROVAL_20260827
    SESSION_SAFE_ORDER / SHA256 = I00_I14_EXACT15 / 0d6fb8cb123669d37d4a6801225f9995ea6ff3765900c6fb460e7592f1bba7b6
    PRO_DELTA_FINAL_CHECK / READ / REREAD = NOT_RUN / 0 / 0
    PRO_VERIFIED_CURRENT_BODY_CLEAR = false
    DESIGN_APPROVAL = COMPLETE
    IMPLEMENTATION_EXECUTION = NOT_STARTED
    CURRENT_AUTHORIZED_NEXT_STEP = I00_AFTER_FRESH_EXPLICIT_STEP_START
    PREDECESSOR_COUNTER = 2_OF_2_IMMUTABLE
    STEP_4_1 / PRODUCT_PASS / ACTIVATION = 0 / 0 / 0
    AUTOMATIC_PROGRESSION = false

Step 0–14は一つのbounded product-quality unitのsession checkpointで、独立product outcomeではない。各Stepはruntime→Cocolonのremote postverify後にだけsession-switch-safeとなり、次StepはMashのfresh explicit startを必要とする。retained inputはsuccessor early exact1へ限定rebind済みだが、Step 6より前の利用0、run／retry／rerunは1／0／0である。

今回のeffectはCocolon docs exact4だけである。runtime、source、test、runner、API、DB、RN、persistence、private generation、activation、production effectは0。System Context v1はnavigation-onlyのため変更しない。

## 26. Emlis input-specific meaning decision final design candidate（2026-08-28）

§25のRoute A typed Japanese case-frame realizer v2は、決定済みmeaningを自然な日本語へ写すdownstream sole ownerとして保持する。§79相当のfresh sibling terminal、Pro `COMMON_DEFECT`、candidate acceptance false、counter 2/2を履歴として変更しない。

Pro最終商品レビューはUltra修正版の前回必須修正10/10を確認して`PASS`とし、残るtechnical handoff exact1をclosed contractとstatus更新だけで閉じれば追加Pro商品レビューは不要とした。今回のfinal design candidateは、Foreground Scopeを第二selectorにしないclosed derivation、whole-reading consequence closed exact7、`SubjectiveDepthClass`、IM00–IM10 exact11を所有する。

design record:
[Emlis Input-Specific Meaning Decision — Final Technical Design and Implementation Order](../designs/cmee/Cocolon_CMEE_Stage1_Emlis_InputSpecificMeaningDecision_KarenDesigned_FinalTechnicalDesignAndImplementationOrder_20260828.md)

    FINAL_DOCUMENT_ID = Cocolon_CMEE_Stage1_Emlis_InputSpecificMeaningDecision_KarenDesigned_FinalTechnicalDesignAndImplementationOrder_20260828
    INTERMEDIATE_REVISION_SHA256 = 0bc64a78c2ce092dec1ca86fb91050402745c00ffaf1c2b198d2b83f5f0e1a51
    PRO_FINAL_PRODUCT_REVIEW_SHA256 = 7dbaf221244c840f376d49b978df4fdab375f1c4f7f7ff4cbcfc25be712d0cec
    FINAL_DOCUMENT_SHA256 = 9690c3f027608825406df7bd5d3b51cb6834b20e07e36bf837b1e309b2daef18
    PRO_FINAL_PRODUCT_REVIEW = PASS
    PREVIOUS_REQUIRED_CORRECTIONS = 10_OF_10_REFLECTED
    CANONICAL_ADOPTION = READY_FOR_MASH_DECISION
    REVISION_STATE = PRO_FINAL_PRODUCT_REVIEW_PASSED
    TECHNICAL_HANDOFF_REMAINING = EXACT0
    IMPLEMENTATION_ORDER = IM00_IM10_EXACT11
    IMPLEMENTATION_EXECUTION = NOT_STARTED
    CURRENT_AUTHORIZED_NEXT_STEP = NONE
    NEXT = FRESH_MASH_LEVEL_3_ROUTE_A_ONLY_DESIGN_ADOPTION_AND_IMPLEMENTATION_DECISION
    PRODUCT_READ / PRODUCT_CREDIT / TECHNICAL_CREDIT = 0 / 0 / 0
    ACTIVATION / I09 / PRODUCTION_EFFECT = 0 / 0 / 0
    AUTOMATIC_PROGRESSION = false

current boundary:

~~~text
UPSTREAM_MEANING_DESIGN_CANDIDATE
  = 2026-08-28 input-specific meaning decision final document

DOWNSTREAM_REALIZER_DESIGN_OWNER
  = 2026-08-27 Route A typed Japanese case-frame realizer v2

CURRENT_ACTUAL_RUNTIME_STRUCTURE
  = UNCHANGED

CURRENT_IMPLEMENTATION_AUTHORITY
  = EXACT0
~~~

今回のeffectはCocolon docs exact4だけである。actual Emlis runtime構造は未変更なので`current_structure/01_emlis_ai_current_structure.md`は変更しない。mashos-api、System Context PR #37、runtime source、test、runner、API、DB、RN、persistence、private generation、merge、activation、production effectは0である。
