---
doc_id: cocolon_emlis_ai_current_structure
title: "EmlisAI構造 — Current Structure"
revision_date: "2026-08-23 JST"
document_role: "EMLIS_AI_CURRENT_STRUCTURE_OWNER"
effective_when: "MERGED_TO_COCOLON_MAIN"
publication_state: "DRAFT_PR_CANDIDATE_UNTIL_MERGED"
implementation_effect: 0
cycle001_effect: 0
automatic_progression: false
---

# EmlisAI構造 — Current Structure

## 0. Current conclusion

EmlisAIの安定した商品目的、production経路、NLS v3／Cycle001 WIP、問い構想、履歴はGitHubに存在する。
ただし、それらは別々の資料と数百のfile familyへ分散しており、production I5経路とoffline Cycle001経路を一枚で区別できるcurrent mapがなかった。

このmapは、その区別と読取順をcurrent ownerとして固定する。

## 1. 商品目的

EmlisAIは、ユーザーの現在入力、選択感情、category、行動、時点、適格なowned historyを、入力直後に「読まれた形」へ変える。

Current product destinationの中心は次の二つであり、plan別thread／問い／履歴接続はdesigned futureである。

1. Layer 1「見えたこと」として、今の状態、関係、変化を根拠の範囲で観測する。current input内の構造気づきは全planのLayer 1に含む。
2. Layer 2「Emlisから」として、具体的な観測claimへ結び付いた人間的な受け取りを返す。
3. DESIGNED_NOT_IMPLEMENTED: 各roundで重要なunknownが残る場合だけplan budget内の一点を問い、回答分だけLayer 1／2を更新する。Plus／Premiumは条件成立時だけLayer 3「記録の線」を0..1加える。

単なる復唱、要約、テンプレ共感、診断、人格決め、原因の断定、相手の意図の推測ではない。

## 2. User-visible product flow

### 2.1 Current production

    RN InputScreen
      -> emotion submit API
      -> emotion_submit_service
      -> emlis_ai_reply_service
      -> ReplyEnvelope / public feedback meta
      -> input_feedback.comment_text
      -> InputFeedbackReplyModal

現行production orchestration ownerはmashos-apiのemlis_ai_reply_service.pyである。
NLS v3 Step10 public routingは同file内でdisabledであり、Cycle001 candidateをproduction app ownerとして扱わない。

### 2.2 Current I5 generation route

    current input normalization
      -> Evidence Ledger
      -> perspective observers / board
      -> ObservationGraph integration
      -> safety triage
      -> GroundedObservationPlan
      -> GroundedSentencePlan
      -> functional grounded sentence surface
      -> semantic gate
      -> ReplyEnvelope

### 2.3 Future observation and question system

将来のEmlis問いsystemは、質問だけを返すchat routeではない。

    original input as USER_OWNED_SOURCE
      -> round 0 Layer 1 + Layer 2
      -> if important unknown remains and plan budget remains:
           question exact1
           -> supplemental answer as a separate USER_OWNED_SOURCE
           -> refined Layer 1 + Layer 2
           -> next sequential round only when allowed
      -> Plus/Premium and eligibility satisfied:
           Layer 3 0..1

observation stage、問い要否decision、visible artifactを分離する。Free／Plusのquestion budgetはthread全体で0..1、Premiumは逐次0..3である。一画面へ複数問を一括表示せず、skip、stop、分からない、無回答を正常終了として扱う。

問いdecisionとquestion本文はcontrol／derived lineageでありsemantic sourceではない。回答だけがsupplemental sourceとなり、original inputを上書きしない。問いがない場合もoriginal、Layer 1、Layer 2を同じinput-history threadへ順番に保存する。

### 2.4 Plan別source・artifact contract

| Plan | Allowed user-owned source | Rejected source | Visible target | Question budget |
|---|---|---|---|---|
| Free | current threadのoriginalとsame-thread supplemental answers | past input、derived user model、cross-core context | Layer 1、Layer 2。Layer 3なし | thread全体で0..1 |
| Plus | current threadとeligible owned history | 許可外cross-core derived artifact | Layer 1、Layer 2、条件成立時Layer 3 0..1 | thread全体で0..1 |
| Premium | current thread、eligible owned history、許可済み本人context | Piece生成本文、Analysis推定／IF、過去Emlis本文 | Layer 1、Layer 2、条件成立時Layer 3 0..1 | sequential 0..3 |

Premiumの商品contractの中心表現は次のとおり。

> **Premiumでは、ユーザーの蓄積した本人情報から作られた、根拠付き・暫定的・修正可能な「ユーザー固有の解釈フレーム」を使い、ユーザー本人の辞書により近い位置から観測とReceptionを行う。**

interpretive frameは本人情報から導く処理境界であり、本人が直接述べたsourceでもvisible evidenceでもない。本人は参照範囲を確認・修正・拒否でき、sourceへ戻れない主張、許可外cross-core derived artifact、診断・人格固定・他者意図推定を加えない。

### 2.5 Layerと既存資産の位置

- Layer 1「見えたこと」は入力固有の観測であり、P6 Structure Insightのrelation classification／guardをadaptしてcurrent input内の構造気づきを全planへ残す。
- Layer 2「Emlisから」はLayer 1の観測claimへ結び付いたHuman Receptionであり、独立した根拠なし断定にしない。
- Layer 3「記録の線」は今回入力とeligible owned historyの具体的なcontinuityであり、P5 User Label Connectionのeligibility／guard／scopeをadaptしてPlus／Premiumだけに条件付き0..1で出す。
- capability、context、user model、history search、P5、P6、Free history boundary testsはADAPT_AND_INHERIT候補である。ただしP5／P6のgeneric fixed surfaceをtarget visible bodyとしてREUSE_AS_ISしない。

## 3. 問いに関するexact3分類

| 種類 | Current status | Owner／境界 |
|---|---|---|
| TodayQuestion product | CURRENT_ACTUAL / 別product route | ai/services/ai_inference/api_today_question.py、ai/services/ai_inference/today_question_store.py。Emlis内部問いと混同しない |
| Emlis internal question candidate | DORMANT_OR_PARTIAL | ai/services/ai_inference/emlis_ai_internal_question_service.py、ai/services/ai_inference/emlis_ai_question_dominance_guard.pyは存在するがcurrent reply serviceから未接続 |
| Emlis observation-and-question system | DESIGNED_NOT_IMPLEMENTED | observation-first、各roundの問いはexact1、Free／Plus 0..1、Premium sequential 0..3、skip可能、同じthreadでrefined observation |

問い関連fileの存在を、問いsystemの商品完成へ変換しない。

## 4. Current architecture components and files

### 4.1 Cocolon RN

| Responsibility | Repository path | Lifecycle |
|---|---|---|
| input entry | screens/InputScreen.js | CURRENT_ACTUAL |
| feedback model | screens/input/inputFeedbackModel.js | CURRENT_ACTUAL |
| visible reply modal | screens/input/InputFeedbackReplyModal.js | CURRENT_ACTUAL |
| modal lifecycle | screens/input/useInputFeedbackModal.js | CURRENT_ACTUAL |

Public displayはpassed-only contractを守り、private body、internal evidence、verification keyをRNへ出さない。

### 4.2 mashos-api entry and orchestration

| Responsibility | Repository path | Lifecycle |
|---|---|---|
| submit API | ai/services/ai_inference/api_emotion_submit.py | CURRENT_ACTUAL |
| submit application service | ai/services/ai_inference/emotion_submit_service.py | CURRENT_ACTUAL |
| current orchestration | ai/services/ai_inference/emlis_ai_reply_service.py | CURRENT_ACTUAL |
| response contract | ai/services/ai_inference/emlis_ai_response_contract.py | CURRENT_ACTUAL |
| public body-free meta | ai/services/ai_inference/emlis_ai_public_feedback_meta.py | CURRENT_ACTUAL |
| common Emlis types | ai/services/ai_inference/emlis_ai_types.py | CURRENT_ACTUAL |

### 4.3 Source and evidence

| Responsibility | Repository path | Lifecycle |
|---|---|---|
| current input bundle | ai/services/ai_inference/emlis_ai_current_input_bundle.py | CURRENT_ACTUAL |
| input material roles | ai/services/ai_inference/emlis_ai_input_material_bundle.py | DORMANT_OR_PARTIAL / canonical I5 call chain未接続 |
| subscription capability | ai/services/ai_inference/emlis_ai_capability.py | CURRENT_ACTUAL |
| evidence ledger | ai/services/ai_inference/emlis_ai_evidence_ledger_service.py | CURRENT_ACTUAL |
| perspective observers | ai/services/ai_inference/emlis_ai_perspective_observers.py | CURRENT_ACTUAL |
| perspective board | ai/services/ai_inference/emlis_ai_perspective_board.py | CURRENT_ACTUAL |
| observation integration | ai/services/ai_inference/emlis_ai_observation_integrator_service.py | CURRENT_ACTUAL |
| observation stage scaffold | ai/services/ai_inference/emlis_ai_observation_stage_context_v3.py | DORMANT_OR_PARTIAL |
| refined source partition | ai/services/ai_inference/emlis_ai_refined_source_partition_v3.py | DORMANT_OR_PARTIAL |

### 4.4 Plan, surface, and safety

| Responsibility | Repository path | Lifecycle |
|---|---|---|
| safety triage | ai/services/ai_inference/emlis_ai_safety_triage.py | CURRENT_ACTUAL |
| grounded observation plan | ai/services/ai_inference/emlis_ai_grounded_observation_plan.py | CURRENT_ACTUAL |
| grounded sentence plan + functional realization | ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py | CURRENT_ACTUAL |
| grounded observation gate | ai/services/ai_inference/emlis_ai_grounded_observation_gate.py | CURRENT_ACTUAL |
| safety boundary service | ai/services/ai_inference/emlis_ai_safety_boundary_service.py | CURRENT_ACTUAL / separate safety owner |

### 4.5 Representative protected tests

| Contract | Repository path |
|---|---|
| Emlis API／reply contract | ai/tests/contract/test_emlis_ai_contracts.py |
| national-core Emlis boundary | ai/tests/contract/test_new_national_core_emlis_contracts.py |
| current display contract | ai/tests/test_emlis_ai_observation_current_display_contract.py |

この表はtest全件一覧ではない。architecture-level contract ownerを示す。

## 5. NLS v3／Cycle001 offline route

### 5.1 Lifecycle

NLS v3 Step11／Cycle001はACTIVE_OFFLINE_WIPであり、production public routeではない。

mainの代表owner:

- ai/services/ai_inference/emlis_ai_step11_runtime_adapter_v3.py
- ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py
- ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py
- ai/services/ai_inference/emlis_ai_step11_hard_gate_v3.py
- ai/services/ai_inference/emlis_ai_step11_cycle001_product_recovery_v3.py
- ai/tools/emlis_nls_v3_step11_current_rc_g8_run.py

mashos-api Draft PR #2はruntime-unconnected service/source exact6、tests exact6、runner exact1のWIPであり、mainまたはruntime接続済みと数えない。

### 5.2 Current technical state

Cocolon mainの08_cycle001_current_state.mdは古い。
working currentはCocolon Draft PR #29の同pathであり、次を示す。

    Step1:
      FORMAL_LEXICAL_AUTHORITY_UNRESOLVED

    final technical code:
      NO_SAFE_STEP1_INTERMEDIATE_GATE_CORRECTION_FOR_CURRENT_ACTUAL_V1

    Step2 / Step3:
      NOT_STARTED_FORBIDDEN

    Cycle001:
      NOT_ACCEPTED

    automatic progression:
      false

safe substitution eligible upper boundは30/251以下、authority-unresolved lower boundは221/251以上である。
221を真の日本語構文曖昧件数、30をgoverning authority成立件数として読み替えない。

Route Uまたはcontract変更は別Mash LEVEL_3判断が必要であり、このmap作成から再開しない。

## 6. Product／design canonical owners

| Role | Path | Lifecycle |
|---|---|---|
| stable product destination | Cocolon_前提資料/Cocolon_EmlisAI_longterm_roadmap_CURRENT.md | CURRENT_PRODUCT_OWNER。embedded SHAはfresh currentではない |
| Karen-derived Stage 1 functional owner | Cocolon_前提資料/designs/cmee/v1/karen_derived/00_read_first.md + 01_emlis_observation_and_reception.md | DRAFT_PR_CANONICAL_CANDIDATE / product-function owner exact2 |
| Pro / Ultra technical integration source | Cocolon_前提資料/designs/cmee/Cocolon_CMEE_Stage1_ProUltra_KarenDerivedFunctional_FinalTechnicalDesign_20260822.md | NONCANONICAL_TECHNICAL_INTEGRATION_SOURCE |
| NLS v3 alignment | Cocolon_前提資料/Cocolon_EmlisAI_NLSv3_CurrentAlignment.md | CURRENT_REFERENCE。append済みpinsに古いものがある |
| immutable NLS design baseline | Cocolon_前提資料/historical_baselines/emlis_ai/Cocolon_EmlisAI_ModelFreeNaturalLanguageSurfaceV3_DetailedDesign_ImplementationOrder_20260714_Revised_Cycle.md | CURRENT_TECHNICAL_NORM / immutable |
| Cycle current navigation | Cocolon_前提資料/08_cycle001_current_state.md | CURRENT only at fresh applicable ref |
| milestone history | Cocolon_前提資料/07_latest_snapshot_diff.md | HISTORICAL_REFERENCE / navigationではない |
| implementation archive | EmlisAIの実装済み資料/ | HISTORICAL_REFERENCE / active ownerは個別確認 |

## 7. Protected invariants

### Source and meaning

- original input、owned history、question control、supplemental answerのroleを混ぜない。
- actor／referent、predicate、argument、relation direction、polarity、modality、time、unknown、lifecycleを保持する。
- raw inputの再掲、source clause、case／family専用surface routeをmeaning authorityの代用にしない。
- self-denial、uncertain、intended、stoppedをfact、completed、valueへ昇格しない。

### Product and safety

- 根拠のない原因、人格、診断、他者意図、未来保証を追加しない。
- ObservationとEmlis Receptionを同義反復にしない。
- unknownを埋めず、通常観測、限定観測、問い、separate safetyを分ける。
- 問いは各roundの観測と受け取りの後にexact1だけ、skip可能。Free／Plus 0..1、Premium sequential 0..3のbudgetを超えず、問い先行、詰問、一括質問、無条件の質問ラリーをしない。
- emergency／high-care surfaceはseparate safety ownerを使う。

### Acceptance and privacy

- machine GREEN、human Product Read、runtime readiness、Cycle acceptanceを相互変換しない。
- read-feeling、naturalness、non-template、また入力したさは最終表示artifactのbody-full Product Readで判定する。
- public body-free metaへraw input、raw output、identifiable paraphrase、private evidence、keyを出さない。
- API／DB／RNの既存public contractをdesign資料だけで変更しない。

## 8. Current gaps

1. production I5とNLS v3／Cycle001の二経路が存在し、統合またはcutoverは未承認。
2. Japanese predicate／argument governing authority 251/251は未成立。
3. Emlis input-history thread、plan別question lifecycle、refined Layer 1／2、Plus／Premium Layer 3は商品完成未確認。
4. mainのCycle current navigationはDraft #29より古い。
5. active planの一部metadataにdraft lifecycle表記が残るため、current actual判断では08とremote factsを優先する。
6. CMEE Stage 1はdisabled verticalまで実装済みだが、Pro / Ultra追加設計のruntime implementation、Cycle re-entry、productionは未承認。

CMEE Emlis detailed design candidate:

[CMEE V1-A — EmlisAI Observation Vertical 詳細設計](../designs/cmee/v1/02_emlis_v1a_detailed_design.md)

このpointerはcurrent production ownerまたはCycle navigationを変更しない。current runtime evidenceはmashos-api Draft PR #3 head `106a1b8c92e808d15e88ce4f56c6300568d93e9f`、47 tests PASS、unchanged exact8 8/8 `GENERATED`、structural trace 8/8である。Mash Product Readはpending、`candidate_ready=false`、`product_credit=0`、`automatic_progression=false`である。historical `NO_SAFE_CMEE_V1A_CANDIDATE_STOP`をcurrent candidate stateへ復活させない。

## 9. Step 10 reviewed design synchronization

このmapは次をcanonical current-structure readingへ同期する。

    DOCUMENT_ID = CMEE_STEP10_ULTRA_FINAL_INTEGRATED_REVISION_PROPOSAL_20260821_V2
    DESIGN_IDENTITY = CMEE_THREE_CORE_INTEGRATED_DESIGN_20260821
    FORMAL_PRO_REVIEW = CONSUMED_EXACTLY_ONCE

target実装順は、Vertical 1 Layer 1／2、Vertical 2 question／refined Layer 1／2、Vertical 3 Plus／Premium Layer 3である。現存するcapability、context、user model、history、P5、P6を移行候補として先に照合し、不足するproduct integrationだけをNB-F01..NB-F04として残す。これはruntime接続、API／DB／RN変更、activation、Product Read合格を意味しない。

### 9.1 2026-08-23 華恋由来Stage 1 functional correction

functional owner exact2は、P1–P8、M1–M7、Layer 1 / 2、V1–V9、観測・選択・応答構造、最低商品品質を所有する。既存`02 / 05 / 06`はtechnical realization、schema / ref / identity、implementation / verificationを所有し、Pro / Ultra追加技術資料はnoncanonical integration sourceとする。

Stage 1の新product contract:

- Observation depthとSubjective depthを独立にする。
- FOCUSED L2はhonest / input-specific proposition exact1で正常成立する。
- AffectIntensityをuser emotion strengthから直接決めない。
- `DISCOMFORT`を出来事 / value conflict / promotion riskへbindし、ユーザー人格へ向けない。
- existing `GroundedHumanReceptionPlan`資産をREUSE / TRANSFORMし、finished surface ownerだけをretireする。
- semantic interpretation poolとsame-plan surface `RealizationCandidateSet`を分け、automatic retry / legacy fallbackを0にする。
- Free=current input only。eligible owned historyはPlus / Premiumのsource admission境界で扱い、current unitのPremium runtime effectは0。

今回のeffectはdesign / routing / mapだけで、runtime / test / production effectは0。次は別の長い設計projectではなく、fresh short execution envelopeから一つのbounded Stage 1 product correctionへ戻る。Mashのimplementation開始指示前は進めない。

## 10. History pointers

- 2026-05〜07の実装経緯: EmlisAIの実装済み資料/
- milestone timeline: Cocolon_前提資料/07_latest_snapshot_diff.md
- NLS v3 immutable design: historical_baselines/emlis_ai/ 以下
- G0–G10後の構造監査: Cocolon_前提資料/audits/emlis_ai/Cocolon_Cycle001_PostG2_SystemArchitecture_Reusability_Audit_20260814.md
- Response3 body-free receipts and plan: EmlisAIの実装済み資料/documents/ 以下

履歴の古いnext actionをcurrentへ復活させない。

## 11. Map update triggers

次を変更するworkは、このfileを同じwrite unitで更新する。

- production reply orchestrationまたはRN display entry
- source role、observation stage、問いlifecycle
- meaning／plan／surface／safety owner
- NLS v3のactive／dormant／production status
- API、DB、RN、public meta contract
- CMEE Emlis adapterへのcutoverまたは旧owner retirement
- Cycle statusのauthority path

内部logicだけのfixで上記が不変ならSTRUCTURE_MAP_DELTA_NONEと理由をPRへ記す。

## 12. Last verified refs

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
