---
doc_id: cocolon_emlis_ai_current_structure
title: "EmlisAI構造 — Current Structure"
revision_date: "2026-09-05 JST"
document_role: "EMLIS_AI_CURRENT_STRUCTURE_OWNER"
effective_when: "MERGED_TO_COCOLON_MAIN"
publication_state: "DRAFT_PR_CANDIDATE_UNTIL_MERGED"
implementation_effect: 0
stage1_v2_product_read_state: "HISTORICAL_PREDECESSOR_FAIL_RETAINED"
stage1_additional_correction_design_state: "CURRENT_PRODUCT_OWNER_NON_PASS / SELECTED_SUBJECTIVE_RECEPTION_INPUT_VERIFIED_PRODUCT_NOT_CLEAR"
cycle001_effect: 0
stage1_language_route: "ROUTE_A_PROVIDERLESS_GROUNDED_DISCOURSE_COMPOSER_ONLY"
external_generative_ai_allowed: false
external_body_send: 0
automatic_progression: false
current_product_owner_adoption_state: "IMPLEMENTED_NOT_ACCEPTED"
im10_state: "NON_PASS"
current_product_read_state: "EVALUATED_NON_PASS_VISIBLE_RESPONSE_QUALITY_INSUFFICIENT"
candidate_ready: false
---

# EmlisAI構造 — Current Structure

## 0. Current conclusion

EmlisAIの安定した商品目的、production経路、NLS v3／Cycle001 WIP、問い構想、履歴はGitHubに存在する。
ただし、それらは別々の資料と数百のfile familyへ分散しており、production I5経路とoffline Cycle001経路を一枚で区別できるcurrent mapがなかった。

このmapは、その区別と読取順をcurrent ownerとして固定する。

2026-09-05最新：行動予定を同じ選択済み意図の担当で受け止める継続修正を実装・検証した。固定sourceで同じ100件を直接生成、Move／expression／binding124、外側73/27。フォロー1件を改善、観測・可否・理由変更0。全198検査194成功／既存4失敗、新規失敗0。華恋が原入力全フィールド・観測・フォロー100件を全文確認しNOT_CLEAR。詳細と再開位置は02 §38、06末尾、既存runtime handoff末尾。長い復唱・定型の締め・上流対象と意味分類の問題が残り、9月12日商品確認準備は未成立。ready／採用／merge／本番／問い／Layer3は未成立。 新CMEE本文保存・履歴接続の完成は未主張。

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
| grounded Human Reception + reception realization | ai/services/ai_inference/emlis_ai_grounded_human_reception.py | CURRENT_ACTUAL |
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
| current Stage 1 product contract / completion route | Cocolon_前提資料/designs/cmee/v1/02_emlis_v1a_detailed_design.md latest §35 + 06_implementation_order_migration_and_verification.md latest §86 | CURRENT_PRODUCT_OWNER_NON_PASS / FOLLOW_PRIMARY_CORRECTION_ROUTE |
| historical Karen-derived functional / Pro-Ultra integration sources | deleted `v1/karen_derived/00_read_first.md` + `01_emlis_observation_and_reception.md` + `Cocolon_CMEE_Stage1_ProUltra_KarenDerivedFunctional_FinalTechnicalDesign_20260822.md` | HISTORICAL_PREDECESSOR_ABSENT_CURRENT_TREE / Git history only。current ownerではない |
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
6. CMEE Stage 1はPro / Ultra追加設計の必要責務を既存ownerへ継承したdisabled owner chainまで実装済みである。IM10 Product Readは`NON_PASS`である。旧Round 0の未開始記録は履歴であり、現在は本節冒頭の承認済みselected-reception入力と本文修正・検証を継続中である。Cycle re-entryとproductionは未承認である。

CMEE Emlis detailed design candidate:

[CMEE V1-A — EmlisAI Observation Vertical 詳細設計](../designs/cmee/v1/02_emlis_v1a_detailed_design.md)

このpointerはcurrent production ownerまたはCycle navigationを変更しない。current runtime evidenceはmashos-api Draft PR #3 head `4e8d397843c0381bc94379b71665cf71b80d7d1b`である。final-language payloadはexact18、product causal source ownerはexact9、canonical100はdirect 100/100、outer generated-disabled 68件／finite fail-closed 32件である。owner adoptionは`IMPLEMENTED_NOT_ACCEPTED`、IM10 Mash Product Readは`NON_PASS`、Round 0 correctionは`APPROVED_ROUTE_NOT_STARTED`、`candidate_ready=false`、`product_credit=0`、`automatic_progression=false`、production effect 0である。historical `NO_SAFE_CMEE_V1A_CANDIDATE_STOP`をcurrent candidate stateへ復活させない。

## 9. Step 10 reviewed design synchronization

このmapは次をcanonical current-structure readingへ同期する。

    DOCUMENT_ID = CMEE_STEP10_ULTRA_FINAL_INTEGRATED_REVISION_PROPOSAL_20260821_V2
    DESIGN_IDENTITY = CMEE_THREE_CORE_INTEGRATED_DESIGN_20260821
    FORMAL_PRO_REVIEW = CONSUMED_EXACTLY_ONCE

target実装順は、Vertical 1 Layer 1／2、Vertical 2 question／refined Layer 1／2、Vertical 3 Plus／Premium Layer 3である。現存するcapability、context、user model、history、P5、P6を移行候補として先に照合し、不足するproduct integrationだけをNB-F01..NB-F04として残す。これはruntime接続、API／DB／RN変更、activation、Product Read合格を意味しない。

### 9.1 2026-08-23 華恋由来Stage 1 functional correction

本§9.1は2026-08-23時点のpredecessor統合記録である。ここでいうfunctional owner exact2とPro／Ultra integration sourceはcurrent treeに存在せず、current ownerではない。統合後のcurrent商品契約はlatest §19とcanonical 02 §35、実行順はcanonical 06 §86を優先する。

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

## 12. Historical verified refs

以下は継承完了前の履歴refである。current runtime evidenceは本file latest §18を使用する。

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

    mashos-api Draft PR #3 historical snapshot
      106a1b8c92e808d15e88ce4f56c6300568d93e9f

次回はfresh refと実fileを再確認する。

## 13. Historical Stage 1 disabled candidate snapshot — Step 7 correction（2026-08-23）

本節は旧Step 7 candidateのappend-only predecessor snapshotであり、current owner／lifecycle判定に使用しない。current stateは本file latest §18を優先する。当時のimplementation ownerはmashos-api Draft PR #3のprivate disabled routeであり、production `emlis_ai_reply_service.py`、ReplyEnvelope、RN display ownerを置換しなかった。

| Surface | Current owner / state | Effect |
|---|---|---|
| Stage 1 response compiler | `cocolon_meaning_experience_engine/emlis_stage1_response.py::compile_stage1_response` / disabled candidate | private disabled effect exact1 |
| finite language owner | `cocolon.emlis.stage1.microgrammar.v2` / exact44 / 16695 bytes / canonical 02 + 05 byte-exact | production effect 0 |
| engine / runner | `MeaningExperienceEngine.generate()`経由のdisabled candidate run | public ingress effect 0 |
| production reply / API / DB / RN | existing owners unchanged | effect 0 |
| provider / source / dependency | no new owner, no expansion | effect 0 |
| Product verdict | Mash body-full Product Read only | not evaluated in docs |

最初のStep 7 pre-screenで共通surface原因を検出してStep 2–4へ戻し、provider / source / allowlistを広げずsame-scope v2 finite correctionを行った。fresh Step 5は7/7、Step 6はcontracts 70/70 + vertical 41/41 = 111/111で、all-variant quote seal、forged three-pair fail-closed、typed source-shape parser tableも通過した。formal V10 Step 7はpairwise 28/28と独立set-level review 2/2を通過し、case / pairwiseのMajor / Blocker 0、明白な低品質0/8、source fidelity 8/8、duplicate / forbidden 0、SX07重点全PASSとなった。full receiptはcanonical 06 §29が所有する。machine GREENや華恋pre-screenはMash Product PASSではない。

```text
candidate_state = DISABLED_MASH_PRESENTATION_PRE_SCREEN_PASSED
current_runtime_owner = mashos-api Draft PR #3 / canonical 06 §29 final token
formal_step7_revision = V10
v2_inventory_tuple_bytes_sha256 = 44 / 16695 / dc4e1e5ef8026d5577698f375e305db7886f57096c69e6e6a0b99bfe1f26de8a
step6_full_regression_rerun = 111 / 111 PASS
step6_quote_and_parser_regression = PASS
production_owner_changed = false
provider_source_dependency_expansion = 0
public_schema_api_db_rn_persistence_effect = 0
private_body_digest_locator_github_publication = 0
runner_candidate_ready = false
runner_product_read_eligible = false
mash_presentation_pre_screen_eligible = true
product_read_evaluated = false
product_pass = not_declared
product_technical_full_i1_cycle001_production_credit = 0
remote_exact_path_and_bytes_equality = PASS_VERIFIED_POST_PUSH
automatic_progression = false
```

final remote refs、exact changed-path set、file bytes equalityはcommit / push後にcanonical 06 §29の`PASS_VERIFIED_POST_PUSH`として実測確認した。

## 14. Historical Stage 1 product verdict / additional correction snapshot（2026-08-24）

本sectionは旧candidateのProduct verdictとnext design stateのappend-only predecessor snapshotであり、current判定に使用しない。current Product Read stateは本file latest §19の`IM10=NON_PASS`を優先する。

- v2 Step 7 machine / pre-screen: historical GREEN。
- Mash actual Product Read: `EVALUATED_FAIL_QUALITY_INSUFFICIENT`。
- current v2 product acceptance: `FALSE`。
- current candidate ready / Product / technical / production credit: `false / 0 / 0 / 0`。
- additional correction final body: [Pro-confirmed noncanonical integration source](../designs/cmee/Cocolon_CMEE_Stage1_AdditionalCorrection_UltraFinalTechnicalBodyAndJointRecommendation_20260824.md)。
- final body reviewed source SHA-256: `1f02e566ddfaefcbfc99ba985e3ef8af5c8e15b8867215c994cda99fbdedff05`。
- Pro final confirmation: `PASS / BLOCKER 0 / MAJOR 0 / MINOR 0`。
- implementation order owner: canonical 06 §30 → final body §13。
- implementation approval / runtime / test / provider / API / DB / RN / persistence / production effect: `0`。
- current authorized next implementation: `NONE_PENDING_MASH_LEVEL3_IMPLEMENTATION_DECISION`。
- automatic progression: `false`。

current production `emlis_ai_reply_service.py`、ReplyEnvelope、RN display、Cycle001、question、Layer 3、Piece、Analysisのownerは変わらない。new final bodyはcurrent v2 surface ownerを即時に置換せず、future LEVEL_3 approval後にだけcanonical owner exact1へ分配する。

## 15. Current Route A-only authority（2026-08-25 Mash決定）

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

## 16. Emlis input-specific meaning decision — IM01 authorized integration gate（2026-08-28）

Mashのfresh explicit authorityは、IM00のremote-postverified runtime head `2c607f001e3524de67c6c276d0140c1b8b464584`とdesign head `ac1ccfce52374abad122cb6b82f99b0760c01d6f`をsole preimageとして、IM01の統合修正とformal pytest exact1だけを許可する。authority前のlocal途中差分は完了creditではなく、failed diagnostic pytestはclosed/no-creditである。

最初のformal launcherはrepository `ai` rootをisolated Pythonのimport pathから外した`COMMAND_CONSTRUCTION_ERROR`でcollection 0となった。Mashのfresh bounded mechanical repair authorityによりlauncherだけをexact1修復し、target／denominator／comparator／input identity／runtime不変の同じGateをexact1再実行した結果は`25 passed`でGREENである。

IM01の完了前提は、current disabled response pathのpre-meaning grounded inputs／allowed Reception envelope型分離、typed Grounded Viewから`derive_foreground_scope_closed()`への実接続、および新しい型に合わせた旧IM00 test fixture移行をactual source／testへ統合することである。fixture移行を含む統合完了前のdiagnostic pytest、target test、compileallその他同等のrepository-code executionは0とする。Foreground Scopeは許可basis exact5をtyped compatibility exact10でcanonical unionし、material competingは`LIMITED_COMPETING_MATERIAL_READINGS`、safe objectを保持できる構造不足は`LIMITED_STRUCTURE_INSUFFICIENT`、safe foreground object exact0だけは`STRUCTURE_INSUFFICIENT_STOP`へ閉じる。Reception、affect、style、temperature、surface、fixture、ID／hash／列挙順はscope selectorへ逆流しない。

```text
RUNTIME_PRE_HEAD = 2c607f001e3524de67c6c276d0140c1b8b464584_REMOTE_POSTVERIFIED
DESIGN_PRE_HEAD = ac1ccfce52374abad122cb6b82f99b0760c01d6f_REMOTE_POSTVERIFIED
PRIOR_DIAGNOSTIC_PYTEST = FAILED_CLOSED_NO_CREDIT
CURRENT_LOCAL_INTERIM_DIFF_COMPLETION_CREDIT = 0
IM00_FIXTURE_MIGRATION_BEFORE_FORMAL_PYTEST = COMPLETE
POST_AUTHORITY_PREINTEGRATION_TEST_EXECUTION = 0
ORIGINAL_FORMAL_PYTEST_ALLOWED_INVOCATION / RETRY / RERUN = 1 / 0 / 0
ORIGINAL_FORMAL_PYTEST_RESULT = COMMAND_CONSTRUCTION_ERROR_COLLECTION_0_CLOSED_NO_CREDIT
BOUNDED_MECHANICAL_REPAIR_LAUNCHER / SAME_GATE_RERUN = 1 / 1
FORMAL_PYTEST_TERMINAL_RESULT = GREEN_PASS_25_OF_25_OWNED_BY_CANONICAL_06_SECTION_82
OTHER_REPOSITORY_CODE_EXECUTION = 0
WRITE_GATE = FORMAL_PYTEST_GREEN_SATISFIED
STEP_STATE = COMPLETE_NONTERMINAL_CHECKPOINT
PRODUCT_CREDIT / TECHNICAL_CREDIT = 0 / 0
PRODUCT_READ / IM02 / ACTIVATION / I09 / PRODUCTION_EFFECT = 0 / 0 / 0 / 0 / 0
FULL_PUBLIC_REGRESSION = DEFERRED_TO_IM07_NOT_CLAIMED_AT_IM01
NEXT_DEPENDENCY / CURRENT_AUTHORIZED_NEXT_IMPLEMENTATION = IM02 / NONE_AFTER_IM01
```

current production `emlis_ai_reply_service.py`、ReplyEnvelope、RN display ownerは変更しない。Required Difference／counterfactual mutation／WholeReadingConsequence issuerはIM02のownerへ留保するが、本authorityでIM02へは進まず、automatic progressionはfalseである。

## 17. Emlis input-specific meaning decision — IM02 difference requirements complete checkpoint（2026-08-28）

Mashの明示的なcomplete-to-finish authorityにより、IM02をactual source／testへ統合し、final exact selectors `32/32`、IM02 targeted `7/7`をGREENで完了した。追加したcurrent structureは、Difference Config、Observed Difference／Required Difference、closed counterfactual mutation、Difference Bundle、WholeReadingConsequence issuer、response pre-Reception storage、composition-side rederive／exact equality、およびruntime integration exact17 identityである。

Required Differenceはtyped Grounded View／Foreground Scopeから導出したObserved Differenceとclosed mutation結果を同じbundleへ束ね、semantic orderとadjacencyを固定する。WholeReadingConsequenceはそのbundleだけから発行し、responseがReceptionへ入る前に保存する。compositionは保存済み結果を再導出してexact equalityを要求し、不一致、未知mutation、signature不整合、対象不一致をclosedで拒否する。Reception、affect、stance、style、temperature、surface、ID／hash／fixture順序を意味決定へ逆流させない。

```text
CHECKPOINT_ID = CMEE_EMLIS_INPUT_SPECIFIC_MEANING_IM02_DIFFERENCE_REQUIREMENTS_20260828_V1
IMPLEMENTATION_STEP / STEP_STATE = IM02 / COMPLETE_NONTERMINAL_CHECKPOINT
FORMAL_GATE_HISTORY = MISSING_FASTAPI_PRECOLLECTION_CLOSED_NO_CREDIT -> 28_OF_32 -> 24_OF_32 -> 25_OF_32 -> 32_OF_32_GREEN
FINAL_EXACT_SELECTORS / FINAL_RESULT = 32 / PASS_32_OF_32
IM02_TARGETED_SELECTORS / TARGETED_RESULT = 7 / PASS_7_OF_7
RUNTIME_INTEGRATION_IDENTITY = EXACT17_FROZEN
PRODUCT_CREDIT / TECHNICAL_CREDIT = 0 / 0
IM03 / ACTIVATION / I09 / PRODUCTION / MERGE = NOT_STARTED / 0 / 0 / 0 / 0
API / DB / RN / PERSISTENCE / PROVIDER / NETWORK / FALLBACK / COST_EFFECT = 0 / 0 / 0 / 0 / 0 / 0 / 0 / 0
FULL_PUBLIC_REGRESSION = DEFERRED_TO_IM07_NOT_CLAIMED_AT_IM02
DESIGN_FINAL_SOURCE_MODIFICATION = 0
DESIGN_PR30_STATE = DRAFT_OPEN_UNMERGED_PENDING_PUSH
NEXT_DEPENDENCY = IM03
AUTOMATIC_PROGRESSION = false
```

current production activation、public API、DB、RN、persistence、provider、network、fallback、external costへのeffectは0である。IM03のreading operation applicability／enumeration、I09、production、mergeは開始していない。

## 18. CMEE継承後のEmlis Stage 1 owner chain（2026-09-01）

本節はcurrent disabled CMEE routeについて§17よりfreshである。production I5のpublic orchestration、ReplyEnvelope、RN displayおよびAPI／DB ownerは変更しない。

disabled Stage 1では、`emlis_input_specific_meaning.py`がinput-specific meaning decisionを所有し、`emlis_stage1_composition.py`はそのprojectionのschema／ref／identity／non-mutationを検証するだけである。compositionはfinal observation、Sentence Plan、Human Receptionまたはvisible surfaceのownerではない。

final Layer 1 ownerは`GroundedObservationPlan`、final sentence planning／sentence realization ownerは`emlis_ai_grounded_sentence_surface.py`、final Layer 2 ownerとreception realization ownerは`emlis_ai_grounded_human_reception.py`である。`emlis_ai_grounded_observation_gate.py`は生成済みfinal bodyだけを入力とするbody-only inverseと独立source matcherを所有し、forward plan／source metadataをparserへ渡して自己照合しない。

NLSv3／Cycle001からはこの責務とprotected failure knowledgeだけを移した。large Cycle001 recovery moduleは`NOT_ADOPTED`であり、copy／wrapper／import／callは0である。System Contextはdisabled implementation seedをexact11からexact13へ更新し、canonical100 bridge testをprotected pathへ追加する。

```text
CURRENT_PRODUCT_OWNER_ADOPTION_STATE = IMPLEMENTED_NOT_ACCEPTED
IM10 = MASH_PENDING
CANDIDATE_READY = false
PRODUCTION_EFFECT = 0
CUTOVER / MERGE / API / DB / RN = 0 / 0 / 0 / 0 / 0
EXTERNAL_GENERATIVE_AI / PRODUCT_RUNTIME_NETWORK / FALLBACK = 0 / 0 / 0
AUTOMATIC_PROGRESSION = false
```

canonical100、protected inverse、machine／trace結果はdisabled candidateのtechnical evidenceに限定し、Mash Product Read、acceptance、production creditへ自動変換しない。

current implementation evidenceはmashos-api Draft PR #3 head `4e8d397843c0381bc94379b71665cf71b80d7d1b`である。active final-language identityはpayload exact18、product causal source owner exact9で封印した。canonical100はdirect active final surface 100/100、outer engine generated-disabled 68／有限fail-closed 32で、全100件のproduction effect、candidate ready、Product Read eligible、automatic progressionは0／falseである。

## 19. IM10 NON_PASS後のcurrent EmlisAI商品境界（2026-09-02）

本節はcurrent Product Read、visible product roles、次の構造順について§18よりfreshである。Mashはcurrent disabled exact8を読み、`NON_PASS`と判断した。内部meaning／observation／Reception／traceが実装済みでも、Layer 1が入力の引用に近く、Layer 2が短い定型的followに縮退しているcurrent本文は、EmlisAIの最低商品品質へ到達していない。

```text
IM10 = NON_PASS
CURRENT_PRODUCT_OWNER_ADOPTION_STATE = IMPLEMENTED_NOT_ACCEPTED
CANDIDATE_READY = false
CURRENT_AUTHORIZED_IMPLEMENTATION = NONE_UNTIL_FRESH_SESSION_EXPLICIT_START
APPROVED_NEXT_ROUTE = ROUND0_FOLLOW_PRIMARY_VISIBLE_RESPONSE_CORRECTION
PRODUCT_CREDIT = 0
AUTOMATIC_PROGRESSION = false
```

user-visible役割は次の通りである。

| Visible layer | Current role | Current weight boundary |
|---|---|---|
| Layer 1「見えたこと」 | Emlisが何を根拠に読んだかを示す必要最小限の観測 | 意味役割として1〜4。0にしない |
| Layer 2「Emlisから」 | 何を受け取り、何に目を向け、どう感じ、何を伝えるかを担う主本文 | 意味役割として9〜6。0にせず、常にLayer 1以上 |

Layer 1は入力の反復、語尾変更、短い引用または構造labelだけでは成立しない。根拠を越える人物推定をせず、Emlisが入力のどこを意味の中心として受け取ったかが入力固有に分かる必要がある。Layer 2は必須質問や相槌formulaではなく、一方向の「Emlisからユーザーへの言葉」として内容上の流れを持つ。

入力別のcurrent配分は、日常の出来事／感情が観測1〜3：フォロー9〜7、通常の悩み／自己理解が観測3〜4：フォロー7〜6、構造説明を明示的に求められた場合でも観測最大4：フォロー最小6である。文字数、文数、token数の固定quotaではない。旧標準6：4／構造要求7：3はcurrent routeに使用しない。

current actual product-causal chainは次である。

```text
input-specific meaning
  -> Grounded Observation Plan
  -> compile_stage1_response
       -> limited Reception material mode
       -> forced limited plan fields
  -> Grounded Sentence Plan + active realizer
  -> Human Reception realization
  -> body-only inverse + Gate
  -> disabled Layer 1 / Layer 2 body
```

`_cmee_semantic_reception_plan()`のlimited Reception material modeと`compile_stage1_response()`内のforced-limited置換を一連の最初の確認点とし、current callerからfinal bodyまで追う。constant／literal解除だけを修正とせず、isolated historical `_compile_stage1_response_v1_legacy()`が使うcase-frame candidate builder／selector、削除済みfunctional companion、NLSv3／Cycle001 large moduleをcurrent active ownerへ戻さない。

完成順はRound 0 active-path correction、華恋body-full pre-screen、Mash Round 0 Product Read、Mash PASS後のFree重要問い0..1 end-to-end、さらに後のPlus／Premium Layer 3である。問いではsupplemental answerだけをoriginalと別のuser-owned sourceとして保存し、その回答分だけLayer 1／2をrefineする。API／DB／Supabase／RNはquestion stage開始時にactual contractを読み、必要な既存経路だけを扱う。

current detailed ownerはcanonical 02 §35、execution order ownerはcanonical 06 §86、shared CMEE mapは04 §32である。本map更新はruntime structure、production I5、ReplyEnvelope、API、DB、Supabase、RNまたはSystem Context生成物を変更しない。構造上のdeltaはProduct Read state、visible role、current owner／next-route navigationだけで、primary outcomeは`ADMINISTRATIVE_ONLY`である。


## Current same-nucleus status correction（2026-09-04）

Current approved disabled work is canonical v1/02 §38 and v1/06 §89. The existing `emlis_ai_grounded_observation_plan.py` final-only seam owns same-nucleus source-grounded status alignment before graph/meaning/Reception generation. Human Reception remains the sole intended Layer2 author; Sentence Surface owns Observation and placement; composition validates only. The public base reply path, national-system storage/dispatch/publication, Piece and Analysis are unchanged. Implementation and full-body verification are in progress, not complete; predecessor candidate remains rejected/rolled back and all production/ready/merge effects remain 0.

Current result: `BLOCKED_AVAILABILITY_CONSTRAINT_UNFINISHED`. Direct generation and 124 required bindings succeeded on a frozen probe; outer availability differed from the required 68/32 because the unchanged completed-body guard no longer rejects a removed unsupported sensation. Root full100 review was NOT_CLEAR. The disabled Human Reception → Sentence Surface placement → adapter path is retained as unfinished work; canonical 06 §89 and the existing runtime handoff own the precise boundary/resume point. National-system/public route boundaries are unchanged.

Current state superseding the preceding boundary checkpoint: `IN_PROGRESS_APPROVED_SOURCE_FIDELITY_EXCEPTION`. Mash approved only UNAVAILABLE→GENERATED caused by removal of unsupported meaning under unchanged strict checks. Canonical 02 §38 / 06 §89 own the exception and continued same-unit correction; all100 CLEAR and product readiness remain pending.


Latest checkpoint: Current correction status (2026-09-05): source-proven finite plans retain the existing selected intention Move and use the existing future-action referent in Human Reception. Frozen same100 is direct100, Move/expression/binding124, outer73/27; one GENERATED follow changed, observation/status/reasons unchanged. Three records have upstream source-status/proof changes; all selected acts/targets/supports are unchanged. Required198:194 PASS/4 inherited FAIL, no new failures; all36 later cases and96 post-hash checks executed,96 PASS, unseen duplicate FAIL retained. Karen read every original input field, observation and follow of all100:NOT_CLEAR. The125-Move trial was rejected;124 expectations and historical evidence remain unchanged. Existing final Plan is passed through surface validation; no new owner, carrier, schema, parser, Gate threshold or production route. Long replay, generic closes and upstream target/agency/tense/relation scope remain. See canonical02 §38,06 latest checkpoint and runtime handoff. Product readiness/adoption/merge/production and new CMEE history persistence remain unclaimed.
