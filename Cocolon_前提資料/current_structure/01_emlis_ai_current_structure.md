---
doc_id: cocolon_emlis_ai_current_structure
title: "EmlisAI構造 — Current Structure"
revision_date: "2026-08-15 JST"
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

Current product destinationの中心は次の二つであり、三つ目はdesigned futureである。

1. 今の状態、関係、変化を根拠の範囲で観測する。
2. 具体的な観測claimへ結び付いたEmlisからの人間的な受け取りを返す。
3. DESIGNED_NOT_IMPLEMENTED: 条件を満たす場合だけ、記録の線、構造の気づき、または一点の問いへ進む。

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

    normal observation
    limited observation
    pre-question observation + bound reception
    one clarification request
    supplemental answer as separate source
    refined observation

observation stage、問い要否decision、visible artifactを分離する。
問いdecisionはcontrol lineageでありsemantic sourceではない。回答だけがsupplemental sourceとなり、original inputを上書きしない。

## 3. 問いに関するexact3分類

| 種類 | Current status | Owner／境界 |
|---|---|---|
| TodayQuestion product | CURRENT_ACTUAL / 別product route | ai/services/ai_inference/api_today_question.py、ai/services/ai_inference/today_question_store.py。Emlis内部問いと混同しない |
| Emlis internal question candidate | DORMANT_OR_PARTIAL | ai/services/ai_inference/emlis_ai_internal_question_service.py、ai/services/ai_inference/emlis_ai_question_dominance_guard.pyは存在するがcurrent reply serviceから未接続 |
| Emlis observation-and-question system | DESIGNED_NOT_IMPLEMENTED | observation-first、問いは必要な一点だけ、skip可能、同一cardでrefined observation |

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
- 問いは観測と受け取りの後、一点だけ、skip可能。問い先行、詰問、毎回の質問ラリーをしない。
- emergency／high-care surfaceはseparate safety ownerを使う。

### Acceptance and privacy

- machine GREEN、human Product Read、runtime readiness、Cycle acceptanceを相互変換しない。
- read-feeling、naturalness、non-template、また入力したさは最終表示artifactのbody-full Product Readで判定する。
- public body-free metaへraw input、raw output、identifiable paraphrase、private evidence、keyを出さない。
- API／DB／RNの既存public contractをdesign資料だけで変更しない。

## 8. Current gaps

1. production I5とNLS v3／Cycle001の二経路が存在し、統合またはcutoverは未承認。
2. Japanese predicate／argument governing authority 251/251は未成立。
3. Emlis observation-and-question systemは商品完成未確認。
4. mainのCycle current navigationはDraft #29より古い。
5. active planの一部metadataにdraft lifecycle表記が残るため、current actual判断では08とremote factsを優先する。
6. CMEEは設計候補であり、Emlis V1-A implementation／Cycle re-entryは未承認。

## 9. History pointers

- 2026-05〜07の実装経緯: EmlisAIの実装済み資料/
- milestone timeline: Cocolon_前提資料/07_latest_snapshot_diff.md
- NLS v3 immutable design: historical_baselines/emlis_ai/ 以下
- G0–G10後の構造監査: Cocolon_前提資料/audits/emlis_ai/Cocolon_Cycle001_PostG2_SystemArchitecture_Reusability_Audit_20260814.md
- Response3 body-free receipts and plan: EmlisAIの実装済み資料/documents/ 以下

履歴の古いnext actionをcurrentへ復活させない。

## 10. Map update triggers

次を変更するworkは、このfileを同じwrite unitで更新する。

- production reply orchestrationまたはRN display entry
- source role、observation stage、問いlifecycle
- meaning／plan／surface／safety owner
- NLS v3のactive／dormant／production status
- API、DB、RN、public meta contract
- CMEE Emlis adapterへのcutoverまたは旧owner retirement
- Cycle statusのauthority path

内部logicだけのfixで上記が不変ならSTRUCTURE_MAP_DELTA_NONEと理由をPRへ記す。

## 11. Last verified refs

    Cocolon main
      de9c3d985053bbaaa7fc0d396e688cc2097ece40

    Cocolon Draft PR #29
      0854e21f92f841fd2cfdcef08b9e3117fc93f96a

    mashos-api main
      a8ca4ddf7b7ae76bf7b3d73e74e3a5808d623428

    mashos-api Draft PR #2
      958c1b53f5b5894691e0b10e2d991fb8236d9f6f

次回はfresh refと実fileを再確認する。
