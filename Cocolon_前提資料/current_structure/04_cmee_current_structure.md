---
doc_id: cocolon_meaning_experience_engine_current_structure
title: "CMEE — Current Structure"
revision_date: "2026-08-15 JST"
document_role: "CMEE_CURRENT_STRUCTURE_AND_PREPARATION_OWNER"
effective_when: "MERGED_TO_COCOLON_MAIN"
publication_state: "DRAFT_PR_CANDIDATE_UNTIL_MERGED"
design_state: "FINAL_TECHNICAL_DESIGN_CANDIDATE"
detailed_design_state: "DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE_STOP_BEFORE_IMPLEMENTATION"
l3r_route_selection: "ROUTE_B_PROVISIONAL_ATTACHMENT_WITH_USER_SOVEREIGN_RESOLUTION"
l3r_packet_state: "L3R_ROUTE_B_APPROVED_P0_TERMINAL_ACTIVATION_PRECONDITION_STOP"
p0r1_executor_candidate_state: "P0R1_GITHUB_HOSTED_EXECUTOR_FINAL_TECHNICAL_PROPORTIONALITY_STOP"
implementation_state: "NOT_STARTED"
runtime_effect: 0
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
    Phase 0 provider result = NO_SAFE_CMEE_V1A_CANDIDATE_STOP
    L3-R route selection = ROUTE_B_PROVISIONAL_ATTACHMENT_WITH_USER_SOVEREIGN_RESOLUTION
    L3-R bounded preflight authorization = GRANTED_BY_APPROVED_BODY_V1
    P0 = P0_ACTIVATION_PRECONDITION_STOP
    P0-R1 GitHub-hosted executor candidate = REJECTED_PRE_EXECUTION
    P0-R1 final judgment = NO_SAFE_NEXT_CANDIDATE_STOP / DETOUR_RISK_STOP
    not approved for implementation
    not implemented
    not production connected
    not Cycle001 proven
    Piece not connected
    Analysis not connected
    automatic progression false

## 1. Product-first derivation

CMEEが支えるproduct job exact3:

1. EmlisAI: 入力を読まれた形の観測へ変え、必要な場合だけ一点を問い、回答分だけ観測を深める。
2. Piece: 本人の意味を、他者が単独で受け取れるcanonical textと画像artifactへ変える。
3. 分析構造: 蓄積入力から現在の自己構造routeを根拠付きで形にし、観測と分離したIF routeを扱う。

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

2026-08-15 JST、MashはL3-Rのrouteとして`ROUTE_B_PROVISIONAL_ATTACHMENT_WITH_USER_SOVEREIGN_RESOLUTION`を選択し、続いて`CMEE_V1_L3R_ROUTE_B_BOUNDED_PREFLIGHT_TECHNICAL_BODY` v1.0.0（canonical SHA-256 `4948bd4d0db491b29021a035af5d596776c86908301b5f49aeff15b2b8418901`）を承認した。provider proposalをmeaning authorityへ昇格せず、ambiguityに依存しないlimited observation、original-input lifecycle全体で最大一回のuser clarification、または`UNAVAILABLE`で閉じる。L3-Rは成立した。P0 exact1はactivation Gateで`P0_ACTIVATION_PRECONDITION_STOP`となり、authorityは消費済みである。dependency採用、implementation、L3-I、runtime、Cycle001再入場は未承認のままである。
同日、Mashは`CMEE_V1_P0R1_GITHUB_HOSTED_BOUNDED_EXECUTOR_FINAL_TECHNICAL_BODY` v1.0.0（canonical SHA-256 `d5637c8303e377e2bda11977425f209c139911acbb56542e8526ee0afa00be70`）のdocs-only reflectionを承認した。reviewed GitHub-hosted executor candidateは、approved isolationを保持したminimum-compliant residualでも32–52 focused hoursを要し、current one-shot evidence価値に比例しないため、`NO_SAFE_NEXT_CANDIDATE_STOP / FINAL_TECHNICAL_PROPORTIONALITY_STOP / DETOUR_RISK_STOP`としてpre-executionで棄却した。P0-R1 executionは0であり、この判断をRoute B、KWJA、provider capabilityの失敗へ変換しない。

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

ただし空package、typesだけ、adapterだけを先に作らない。
最初のimplementation packetはEmlis observationのsourceからsurface／traceまでのvertical sliceとatomicでなければならない。

Current cocolon_text_generation_coreは初期段階でdownstream candidate validation／common guard subsystemとして保持する。
PR #2のCycle001 recovery builderをCMEE wrapperまたはhostへ昇格しない。

cutover時:

- CMEE callable／runner ingress exact1
- old direct active ingress exact0
- parallel engine／fallback／mirror route 0
- old codeの後続除去は、既にunreachable／reference-onlyとなったものだけ

Phase 0でouter host、callable、import ingress、meaning provider、exact change pathsが一意にならない場合、NO_SAFE_CMEE_V1A_CANDIDATE_STOPとする。

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

Final P0-R1 executor judgment:

[CMEE V1 P0-R1 GitHub-hosted bounded executor — Final Technical Body](../designs/cmee/CMEE_V1_P0R1_GitHubHosted_BoundedExecutor_TechnicalBody_20260815.md)

Detailed implementation design suite:

[CMEE V1 詳細設計 — Read First](../designs/cmee/v1/00_read_first.md)

children:

1. `01_shared_kernel_and_runtime_contracts.md`
2. `02_emlis_v1a_detailed_design.md`
3. `03_piece_v1c_detailed_design.md`
4. `04_analysis_v1d_v1e_detailed_design.md`
5. `05_json_schema_and_versioning.md`
6. `06_implementation_order_migration_and_verification.md`

Lifecycle:

    FINAL_TECHNICAL_DESIGN_CANDIDATE
    implementation approval NOT_YET
    production / test / dependency / DB / API / RN effect 0
    Cycle001 restart effect 0

このcurrent structure map、full design、detail suiteのmerge自体は実装承認にならない。L3-R bounded preflightとP0 exact1の承認は上記canonical bodyにだけ由来し、dependency採用、implementation、L3-I、Cycle再入場は未承認である。

## 11. Implementation order

1. CMEE three-core architecture and detailed suite defined
2. Phase 0 current result `NO_SAFE_CMEE_V1A_CANDIDATE_STOP`
3. Mash L3-R: Route B selectionとbounded preflight technical body v1.0.0を承認済み（2026-08-15 JST）。L3-R成立、P0 exact1はactivation precondition STOPでterminal
4. P0 exact1はactivation Gateで`P0_ACTIVATION_PRECONDITION_STOP`となり、provider／resource／platform evidence 0のままauthority消費済み。後続のGitHub-hosted P0-R1 executor candidateも`FINAL_TECHNICAL_PROPORTIONALITY_STOP`でpre-execution rejectし、P0-R1 execution 0、next candidate 0
5. 将来、separate P0 PASS evidenceが得られた場合だけ、separate Mash L3-Iでexact dependency hashes／resource lock／I1 changed-path allowlistを承認
6. disabled Emlis vertical candidate
7. representative machine verification + body-full Product Read + bounded correction（I2）
8. separate fresh applicable 08判断に従うCycle001 Step1 re-entry（planは08が指すrestart / evidence bundle）
9. Cycle001 product proof
10. separate E0 approval、ReplyEnvelope / passed-only mapping、protected tests、actual-device proofによるEmlis Observation production cutover
11. `CMEE_V1A_EMLIS_OBSERVATION_PRODUCTION_OPERATIONAL`
12. separate V1-B approvalによるEmlis question / refinement operationalization
13. Piece visual artifact
14. Analysis observed route
15. Analysis IF route
16. second actual consumerでshared contractをformalize
17. three-core operational proof

CMEE phaseは上位migration順であり、Cycle001のfresh applicable 08 exact1を置き換えない。active planは同格navigation ownerではない。

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
- two correction cyclesでnamed MAJOR／BLOCKERが減らなければDETOUR_RISK_STOP

規模そのものを禁止しない。三商品の品質へ届く因果とactual improvementがない肥大だけを止める。

## 13. Current gaps

1. detailed fit-gapで、current formal contractを満たすsafe provider exact1は確認できず、Phase 0 terminalは`NO_SAFE_CMEE_V1A_CANDIDATE_STOP`。
2. Route B bounded preflight technical body v1.0.0は承認済み。P0 exact1は`P0_ACTIVATION_PRECONDITION_STOP`でterminalとなり、provider/resource/platform measurement evidenceは未取得。
3. CMEE package、callable、runner ingressは存在しない。
4. Emlis vertical slice、Piece adapter、Analysis adapterは未実装。
5. current text coreとPR #2 assetのsymbol-level dispositionはPhase 0で確定が必要。
6. Cycle001はFORMAL_LEXICAL_AUTHORITY_UNRESOLVEDで停止中。
7. L3-Rはapproved body identityへ固定され、P0 exact1はactivation Gateで消費・terminal。implementation / dependency / L3-I / Cycle approvalは消費していない。
8. reviewed GitHub-hosted P0-R1 executor candidateは比例性STOPでpre-execution reject。別executor、P0 boundary、provider、model、version、task、corpus、Route B contractの変更はnew Mash LEVEL_3 decisionを要する。

## 14. History and design pointers

- full CMEE final technical design candidate
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

内部logicのみで構造が不変ならSTRUCTURE_MAP_DELTA_NONEと理由を記す。

## 16. Last verified refs

    Cocolon main
      de9c3d985053bbaaa7fc0d396e688cc2097ece40

    Cocolon Draft PR #29
      0854e21f92f841fd2cfdcef08b9e3117fc93f96a

    mashos-api main
      a8ca4ddf7b7ae76bf7b3d73e74e3a5808d623428

    mashos-api Draft PR #2
      958c1b53f5b5894691e0b10e2d991fb8236d9f6f

次回はfresh refと実fileを再確認する。

## 17. L3-R approved bounded-preflight envelope

Canonical body:

[CMEE V1 L3-R Route B Bounded Preflight Technical Body v1](../designs/cmee/CMEE_V1_L3R_RouteB_BoundedPreflight_TechnicalBody_20260815.md)

```text
body_version = 1.0.0
body_canonical_sha256 = 4948bd4d0db491b29021a035af5d596776c86908301b5f49aeff15b2b8418901
route_contract_id = cocolon.cmee.v1a.acceptance.route_b.v1
current_state = L3R_ROUTE_B_APPROVED_P0_TERMINAL_ACTIVATION_PRECONDITION_STOP
P0_execution = 1_TERMINAL_AT_ACTIVATION_GATE
dependency_adoption = 0
implementation = 0
Cycle001_effect = 0
automatic_progression = false
```

承認済みP0はKWJA 2.5.1 / base / char+word / CPUのexact1候補だけをsynthetic exact12で一回測る。temporary root、acquisition allowlist、license/provenance hard gate、OS/runner isolation、resource ceiling、retry、cleanup、terminalはcanonical bodyを正本とする。P0 PASSもprovider/resource/platform evidenceだけであり、L3-I、I1、Product Read、production、Cycle creditへ換算しない。

## 18. P0 actual terminal — 2026-08-15 JST

Body-free result:

[CMEE V1 P0 KWJA 2.5.1 Base Body-Free Result](../designs/cmee/CMEE_V1_P0_KWJA251_Base_BodyFree_Result_20260815.json)

```text
terminal = P0_ACTIVATION_PRECONDITION_STOP
P0_execution_count = 1
activation_python_child_started = false
temp_root_created = 0
network / download / install / load / inference = 0 / 0 / 0 / 0 / 0
retry / fallback = 0 / 0
provider_resource_platform_evidence = 0
primary_outcome = BLOCKER_NARROWED
automatic_progression = false
```

current Work executorはapproved acquisition channelを提供せず、activation cp312 childも開始前に停止した。後段のisolation、license/provenance、package/resource、synthetic exact12は未評価であり、未実行をFAIL/PASSへ変換しない。P0 authorityは消費済みで再利用しない。

## 19. P0-R1 GitHub-hosted executor final proportionality STOP

Final technical body:

[CMEE V1 P0-R1 GitHub-hosted bounded executor — Final Technical Body](../designs/cmee/CMEE_V1_P0R1_GitHubHosted_BoundedExecutor_TechnicalBody_20260815.md)

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
provider_resource_platform_evidence = 0
ROUTE_B_FAILURE = NOT_ESTABLISHED
KWJA_FAILURE = NOT_ESTABLISHED
reusable_execution_product_cycle_credit = 0
automatic_progression = false
```

このSTOPはreviewed current GitHub-hosted executor candidateだけを棄却し、GitHub-hosted runner一般、Route B、KWJAまたはCMEEを失敗判定しない。既存P0 terminalは`P0_ACTIVATION_PRECONDITION_STOP`のままである。別executorまたはP0 boundary、provider、model、version、task、corpus、Route B contractを変える場合はnew Mash LEVEL_3 decisionへ戻り、自動でalternate candidateを作らない。
