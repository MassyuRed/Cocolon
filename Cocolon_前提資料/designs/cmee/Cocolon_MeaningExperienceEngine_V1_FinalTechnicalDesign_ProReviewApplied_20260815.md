# Cocolon Meaning Experience Engine V1
## Pro華恋 Product Route Review反映・Ultra華恋 最終技術設計案

- 設計日: 2026-08-15
- technical design owner: Ultra華恋
- product route review owner: Pro華恋
- decision owner: Mash
- lifecycle: `FINAL_TECHNICAL_DESIGN_CANDIDATE`
- implementation approval: `NOT_YET`
- GitHub write authorization: `NONE_IN_THIS_DESIGN`
- production / test / dependency / DB / API / RN effect: `0`
- Cycle001 restart effect: `0`
- automatic progression: `false`
- prior Ultra design SHA-256: `8a3852380eb4b48ba70c5ada91d6b2d848ad6df28dbc79404a0074f45d00f5e2`
- Pro review SHA-256: `c94a0f3b8a816b796a19b94616e519e0632092b7e2d7c02473eda8d3a0ebfd9e`

---

## 0. 最終結論

正式な推奨名称は、次とする。

> **Cocolon Meaning Experience Engine V1**  
> 日本語説明名: **Cocolon 三大中核構造共通・意味体験生成エンジン V1**  
> 略称: **CMEE V1**

CMEEは、G0–G10で作られた補助経路の再編を起点にしない。

次の三つの商品目的から逆算する。

1. EmlisAI: 入力を「読まれた形」の観測へ変え、必要な場合だけ一点を問い、回答分だけ観測を深める。
2. Piece: 本人の意味を、他者が単独で受け取れる情報と画像へ変える。
3. 分析構造: 蓄積入力から現在の自己構造routeを根拠付きで形にし、観測routeと混ぜずに「もし」の分岐を試せるようにする。

この三つに必要なのは、完成文を検査するだけのtext guardでも、品質確認だけを行う独立基盤でもない。

```text
user-owned source
→ 根拠と未確定性を持つ意味構造
→ core-owned product intent
→ product experience plan
→ 文章・画像・map・IF route
→ source / meaningへのpositive trace
→ machine verificationとhuman Product Read
```

を一巡させる、三大中核共通の生成中枢である。

### 0.1 今回のPro reviewによるmaterial correction

前回設計の大方向は採用する。Pro reviewが求めた限定補正exact16をすべて反映し、その内容を次の六つの最上位boundary familyへ整理する。

1. ユーザーの言葉の意味を最終的に確定できる主体は、ユーザー本人である。
2. CMEEの内部意味構造を、本人の絶対的真実、本当の気持ち、隠れた原因へ昇格しない。
3. 日本語predicate / argument authorityと、人間理解の完成を同一視しない。
4. 候補比較では本人の核と意味保持を、自然さ、短さ、見栄え、machine score、resource costより先に守る。
5. Phase 0を追加資料chainにせず、一つのbounded work内でEmlis V1-Aのexactly one推奨実装経路、または`NO_SAFE_CMEE_V1A_CANDIDATE_STOP`まで収束する。
6. 上記思想やProduct Causality条件を、新checker、Gate、authority、Receipt、proof-of-proofへ変換しない。

### 0.2 現在の状態を普通の言葉で併記する

```text
CMEE V1:
  最終技術設計候補
  未承認
  未実装
  Cycle001で未実証
  EmlisAIで未稼働
  Piece未接続
  分析構造未接続
  三大中核対応完了ではない
```

名称に`V1`が含まれることを、完成、稼働、商品合格または三中核接続済みという意味へ変換しない。

---

## 1. 設計の正本関係

### 1.1 本設計候補のprecedence

Mashが本設計を別途採用しても、local fileだけではdurable current ownerへ昇格しない。採用後、別のGitHub write承認とremote fresh postverificationが完了するまでは`APPROVED_PENDING_DURABLE_REFLECTION`とする。postverification後だけ、architecture上のcurrent ownerを本設計exact1へ一意化する。

| 資料 | durable reflection後の位置づけ |
|---|---|
| 本設計 | CMEE V1 current architecture owner |
| `Cocolon_MeaningExperienceEngine_V1_UltraTechnicalDesign_20260815.md` | direct predecessor / superseded design source |
| `Cocolon_ThreeCore_QualityFoundation_V1_UltraTechnicalDesign_20260815.md` | historical predecessor |
| `Cocolon_Quality_Intelligence_Foundation_CrossCore_ApplicationPlan_20260814.md` | CMEE内の品質plane・原因特定・旧資産回収のhistorical design source |
| G0–G10 audit / control artifacts | asset、test vector、failure knowledge。architecture authorityではない |

CQIFとCMEEを並列のactive architecture ownerにしない。CQIFの価値は削除せず、CMEEの`Trust & Product Quality Plane`、`Product Improvement Loop`、`Optional Reproducibility Capsule`へ責任単位で回収する。

### 1.2 GitHub current facts at design time

```text
Cocolon main:
  de9c3d985053bbaaa7fc0d396e688cc2097ece40

Cocolon Draft PR #29:
  head 0854e21f92f841fd2cfdcef08b9e3117fc93f96a
  open / Draft / unmerged

mashos-api main/base:
  a8ca4ddf7b7ae76bf7b3d73e74e3a5808d623428

mashos-api Draft PR #2:
  head 958c1b53f5b5894691e0b10e2d991fb8236d9f6f
  tree 15b89d0f33a8c53c0d8ec7bae294a485cfed06ed
  open / Draft / unmerged
```

working current navigation at `MassyuRed/Cocolon@0854e21f92f841fd2cfdcef08b9e3117fc93f96a`（Draft PR #29 / unmerged）:

- `Cocolon_前提資料/08_cycle001_current_state.md` blob `7849ed3166f062ca550d5365928f7699893b3596`
- `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_Response3_Step1_IntermediateGateSeparation_NoSafeCurrentCandidate_Final_BodyFree_Decision_20260815.json` blob `8dd2dafbd400daa6230084cbf24df651a334891e`
- `EmlisAIの実装済み資料/documents/Cocolon_EmlisAI_NLSv3_Cycle001_Response3_ThreeStepSessionSafeExecutionAndRestartPlan_20260815.md` blob `a5d97d6affffaad9fb09b891f8764dfda8a68d48`

`MassyuRed/Cocolon@de9c3d985053bbaaa7fc0d396e688cc2097ece40` mainの`08_cycle001_current_state.md`はolder blob `452a6e0596743db37c2a1d8d671d62d1ec5caac7`である。current technical working stateと混同しない。

premise / rule facts:

- `Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt` blob `bee844aeae4ff1bb2d0f475081ef309f114f4b19`
- `Cocolon_前提資料/work_attitude_rules_for_karen/CURRENT_RULES.md` blob `12ace1751f8d6d2d3e458e8c1058e7282022e932`
- `Cocolon_前提資料/cocolon_thought_material_for_karen.md` blob `029b98347ff2989e997542202a8f9c8c1648b626`
- `Cocolon_前提資料/10_cocolon_joint_development_karen_thought_boundary_2026_05_24.md` blob `05cef407b530165384ec597585c24a68f540c141`
- `Cocolon_Piece/00_read_first.md` blob `96dd9c99fa27d539a02551b5343a749e88025099`
- current common composer `MassyuRed/mashos-api@a8ca4ddf7b7ae76bf7b3d73e74e3a5808d623428:ai/services/ai_inference/cocolon_text_generation_core/composer.py` blob `e1382c58ecbe920f12c4f3435b3a748838cdb3b4`

実装開始時は、これらを固定値として再利用せずfresh取得する。

---

## 2. 最上位思想境界

CMEEの最上位思想は次である。

> **Cocolonを、人間の言葉を雑に処理しない場所にする。**

これは曖昧な優しさやテンプレ共感ではない。source、意味、未確定、本人固有の核、最終商品体験を壊さないtechnical boundaryである。

### 2.1 ユーザー本人の意味主権

- CMEEは、current sourceから観測できる意味を整理できる。
- 各coreは、商品として何を出すかを決められる。
- しかし、本人の真意、人格、本質、隠れた原因を所有した存在として振る舞わない。
- ユーザーは、artifactを受け取り、訂正し、留保し、分からないと示し、採用しない権利を持つ。
- user correctionはoriginal sourceをretroactiveに書き換えず、別roleのsupplemental materialとしてlineageへ追加する。

### 2.2 内部表現は絶対的真実ではない

`GroundedMeaningGraph`は、current sourceとevidenceから扱える範囲を、epistemic state付きで表したruntime materialである。

次への自動昇格を禁止する。

```text
source-grounded current interpretation
  -> 本当の気持ち
  -> 本人も気づいていない真実
  -> 人格 / 本質
  -> 隠れた原因
  -> 将来予測
```

graph node / edgeには、少なくとも`source ref / evidence ref / epistemic state / scope / provenance`を持たせる。

### 2.3 日本語authorityと人間理解を分離する

predicate、argument、case role、relation direction、polarity、modality、temporal scopeを正しく扱うことは、ユーザーの言葉を壊さないために必要である。

ただし、それだけで次を確定したことにはならない。

- なぜその言葉を選んだか。
- 何が本人にとって最も重いか。
- 何を本当に伝えたかったか。
- どの人格・本質・原因を持つか。

Japanese Meaning Authorityは言葉を壊さずartifactへ運ぶ土台であり、人間理解の完成品ではない。本設計でこの互換名称を使う場合、その意味は`Japanese Linguistic Structure Authority`に限定する。

### 2.4 Candidate selection priority

候補比較の前に、source ownership、privacy / access、unsupported claim、high-care safety、epistemic partition、artifact lifecycleをhard eligibilityとして判定する。一つでも不成立なら、score比較へ送らず`REJECTED`または`UNAVAILABLE`とする。

hard eligibilityを満たした候補間の優先順位を次のexact6とする。

```text
1. 本人固有の核とmust-keep dutyを残す
2. sourceにない意味を足さない
3. negation / reservation / unknown / relation direction / scopeを守る
4. core固有の商品目的へ適合する
5. 本人と利用者が自然に受け取れる形にする
6. 見た目 / 短さ / latency / memory / resource costを調整する
```

下位項目の改善によって上位項目を損なう候補は選ばない。

作業量・latency・memory・resourceの比例性は引き続き必要である。ただし、意味を落とした安価な候補へ黙って切り替えない。faithful implementationがcurrent boundary内で不釣り合いまたは成立不能なら、意味を弱めず`STOP / REDESIGN`へ戻す。

### 2.5 「本人が受け取れ、自分のものとして扱える」

Machine correctnessだけでは完了しない。

| Core | human product completion condition |
|---|---|
| EmlisAI | AIに説明されたのではなく、自分の入力が観測と人間的な受け取りとして返ったと感じられる |
| Piece | 他者へ伝わるだけでなく、本人の表現として保存・共有したいと思える |
| Analysis | 決めつけられず、観測route、unknown、IF分岐を区別し、自分の材料として扱える |

### 2.6 思想をcontrol planeへしない

本章は、設計本文、core quality contract、candidate priority、Product Readへ統合する。

次は作らない。

- philosophy checker
- thought Gate
- thought authority chain
- philosophy Receipt family
- proof-of-philosophy

---

## 3. Product-first derivation

### 3.1 Product job exact3

| Core | Product job | Primary product artifact |
|---|---|---|
| EmlisAI | `OBSERVE_AND_CLARIFY` | `ConversationalObservation` |
| Piece | `EXPRESS_AND_SHARE` | `PieceArtifactSpec -> RenderedPieceExport` |
| Analysis | `MAP_AND_EXPLORE` | `ObservedSelfStructureMap + IfRouteSimulation` |

### 3.2 EmlisAI

商品目的:

```text
入力が処理されたのではなく、読まれた。
何が起きているか少し見えた。
分からないところを勝手に埋められなかった。
必要な場合だけ一点を確かめられた。
回答分だけ同じ観測が深まった。
また入力したい。
```

Emlis owner:

- 何を観測するか。
- Observationとbound Receptionの内容。
- SUFFICIENT / LIMITED / ASK / SEPARATE_SAFETY判断。
- 問いの種類、負担、回数、distance。
- history / continuity / structure insight eligibility。
- Emlis Product Readと最終受入。

### 3.3 Piece

商品目的:

```text
saved inputの核が、
本人の表現として、
他者が単独で受け取れる情報へ整い、
共有したい画像になる。
```

Piece owner:

- `external_share_card` product intent。
- audience、attribution、format eligibility。
- publicization policy。
- visual catalog、renderer、actual-device acceptance。
- preview / save / visibility / export / delete lifecycle。
- Piece Product Readと最終受入。

### 3.4 分析構造

商品目的:

```text
期間内sourceから、現在よく通る自己構造routeが見える。
何を守り、どこが負荷で、何がまだ分からないかを区別できる。
現在の自分を否定せず、分岐点から別のrouteを「もし」として眺められる。
```

Analysis owner:

- period source-set eligibility / comparability。
- self-structure taxonomyとobserved route induction。
- protective / burden / unknown / period change semantics。
- observed / simulated / saved identity。
- branch intent、IF condition / friction / safety。
- Analysis Product Readと最終受入。

---

## 4. CMEEと各coreのauthority境界

### 4.1 CMEEが所有するもの

1. Source Identity / Role / Lineage protocol
2. Evidence Binding protocol
3. Grounded Meaning representation primitives
4. Epistemic State separation
5. Japanese Meaning Authority port
6. Core Intent / Experience Plan envelope
7. Semantic Artifact Plan / Realization protocol
8. Japanese text / visual / graph projection primitives
9. Positive Realization Trace
10. shared no-added-claim / no-mixing / privacy / identity contract
11. Product Read packet interface
12. causal localization / batch / version diffの最小product improvement能力

### 4.2 CMEEが所有しないもの

- coreが何を観測・表現・分析するか。
- sourceを商品材料として採用する最終policy。
- core固有claim selection。
- voice、distance、depth、formatの最終policy。
- Pieceのrenderer / template catalog / record lifecycle。
- Analysisのroute meaning / IF scenario meaning。
- EmlisとAnalysisの問いの意味。
- human Product Read verdict。
- API、DB、RLS、quota、tier、RN navigation、notification。
- release / acceptance decision。
- ユーザー本人の真意・人格・本質。

### 4.3 Common protocolの意味

```text
common protocol
  + core-owned policy
  + modality-specific runtime
```

一つのvoice、一つのsemantic rule、一つのscore、一つの万能artifactへ三中核を潰さない。

---

## 5. Logical architecture

```text
Cocolon Meaning Experience Engine V1
|
+-- Source & Context Kernel
|   +-- Source Identity / Role / Lineage
|   +-- Ownership / Privacy Boundary
|   +-- Current / History / Period Context
|
+-- Grounded Meaning Kernel
|   +-- Japanese Meaning Authority Port
|   +-- Evidence Graph
|   +-- Epistemic State / Unknown / Conflict
|   +-- Core Extension Payloads
|
+-- Interaction & Information Need
|   +-- Sufficiency / Ambiguity Assessment
|   +-- ClarificationRequest Envelope
|   +-- Stage / Session Continuity
|
+-- Core Experience Compilers
|   +-- Emlis Observation Compiler
|   +-- Piece Share Artifact Compiler
|   +-- Analysis Map & IF Compiler
|
+-- Semantic Artifact Generator
|   +-- Realization Candidate Planner
|   +-- Japanese Text Realizer
|   +-- Visual Composition Planner
|   +-- Graph Projection Planner
|   +-- Positive Trace Builder
|
+-- Trust & Product Quality Plane
|   +-- Grounding / Must-Keep
|   +-- No Added Claim / No Mixing
|   +-- Epistemic Safety / Privacy
|   +-- Artifact Identity
|   +-- Machine / Human / Device separation
|
+-- Product Improvement Loop
    +-- Product Failure Localization
    +-- Correction / Rebuild / Re-read
    +-- Batch / Version Diff
    +-- Optional Reproducibility Capsule
```

---

## 6. Core data contracts

Phase 0では、discriminated envelopeとauthority境界だけをfixedにする。詳細fieldはEmlis V1-Aでprovisionalとし、第2 actual coreで共通昇格を判断する。

### 6.1 `SourceEnvelope`

```text
source_id
owner_id
source_type
source_role
source_version
stage
privacy_class
body_locator_private
body_free_commitment
parent_source_refs
```

source role候補:

```text
original_input
supplemental_answer
owned_history_record
period_member
simulation_session_material
```

derived artifact、question decision、IF scenario、saved route intent、Piece public expressionをsource roleへ戻さない。

### 6.2 `GroundedMeaningGraph`

minimum primitives:

```text
actor / referent
predicate
argument role / target
state / event / action / non-action
desire / intention / constraint
polarity / modality / temporal scope / topic scope
relation / condition
uncertainty / unknown / conflict
source span / evidence ref
epistemic state / provenance
```

このgraphは`current sourceから根拠付きで扱える意味候補`であり、user absolute truthではない。

### 6.3 `HypotheticalScenarioGraph`

```text
scenario_graph_id
base_observed_map_ref
base_route_ref_at_version
branch_point_id
simulation_session_source_refs
user_branch_intent
constraints
simulated_steps
conditions
frictions
unknowns
```

`HypotheticalScenarioGraph -> GroundedMeaningGraph / observed route`の自動昇格は0。

### 6.4 `CoreProductIntent`

```text
core_id
product_job
audience
source_policy_ref
meaning_policy_ref
depth
voice
format
modality
safety_profile
quality_profile
lifecycle_profile
```

### 6.5 `ExperiencePlan`

```text
experience_plan_id
core_id
product_job
semantic_duties
required_units
optional_units
deferred_units
interaction_acts
artifact_plans
ordering
voice_and_format_policy
forbidden_promotions
fallback: LIMITED | UNAVAILABLE | ASK | REJECT
```

### 6.6 `GenerationArtifactBundle`

```text
artifact_id
artifact_version
artifact_kind
epistemic_partition
core_id
product_job
source_commitments
semantic_graph_ref: GroundedMeaningGraphRef | HypotheticalScenarioGraphRef
experience_plan_id
parent_artifact_refs
derivation_lineage
primary_artifact
companion_artifacts
realization_trace
quality_report
lifecycle_bindings
status: GENERATED | REJECTED | UNAVAILABLE | QUESTION_PENDING
```

primary variants:

```text
ConversationalObservation
PieceArtifactSpec
ObservedSelfStructureMap
IfRouteSimulation
SavedRouteIntent
```

identity extensions:

```text
IfRouteSimulation:
  scenario_graph_ref
  base_observed_map_ref
  base_route_ref_at_version
  branch_point_id

SavedRouteIntent:
  source_simulation_ref

Text / Visual / Graph projection:
  projection_of artifact_id@version
```

---

## 7. EmlisAI vertical contract

### 7.1 Lifecycle separation

```text
observation_stage:
  NORMAL | PRE_QUESTION | REFINED

sufficiency_decision:
  SUFFICIENT | LIMITED | ASK | SEPARATE_SAFETY

artifact_kind:
  OBSERVATION_SURFACE | CLARIFICATION_REQUEST | OPTIONAL_CONTINUITY_LINE
```

`human reception`は独立stageではない。すべてのvisible observation artifactに含まれ、具体的Observation claimへbindされたrequired dutyである。

### 7.2 Flow

```text
Current Input
-> SourceEnvelope(original)
-> GroundedMeaningGraph
-> Observation Sufficiency Decision
   +-- SUFFICIENT -> NORMAL observation bundle
   +-- LIMITED -> NORMAL limited observation bundle
   +-- ASK -> PRE_QUESTION observation/reception -> one clarification request
   +-- SEPARATE_SAFETY -> separate safety owner / safe limited observation
-> optional Supplemental Answer
-> refined graph delta
-> REFINED observation/reception bundle
```

Question decisionはcontrol lineageだけに属し、semantic sourceにならない。meaningを追加できるのは、originalを保持した上で別roleへbindしたsupplemental answerだけである。

### 7.3 Emlis quality contract

| ID | Condition |
|---|---|
| `E-OBS-01` | original/current/history/supplemental source legitimacy |
| `E-OBS-02` | owner-bound predicate/argument/relation/polarity/modality/time/unknown preservation |
| `E-OBS-03` | 列挙・要約を越えるgrounded observation value |
| `E-OBS-04` | Receptionが具体Observation claimへbindされる |
| `E-OBS-05` | unknownを埋めずSUFFICIENT/LIMITED/ASKを分ける |
| `E-OBS-06` | 問いは必要な一点、skip可、負担に比例 |
| `E-OBS-07` | originalを保ったsame-card differential refinement |
| `E-OBS-08` | 原因・人格・診断・他者意図・未来保証・false understanding 0 |
| `E-OBS-09` | natural / non-template / input-density-proportional surface |
| `E-OBS-10` | 読まれた感、本人が受け取れる感覚、記録価値、再入力意欲 |

---

## 8. Piece vertical contract

### 8.1 Flow

```text
owner-authenticated saved_input_id + source_version + stage exact1
-> SourceEnvelope(original)
   refined only: supplemental remains separate
-> GroundedMeaningGraph
-> PieceProductIntent(EXPRESS_AND_SHARE)
-> Publicization Transform
-> format candidates: short_essay | quote | declaration
-> canonical share text
-> PieceArtifactSpec
-> Piece-owned modality runtime
-> RenderedPieceExport
```

### 8.2 Artifact source-of-truth

```text
PieceArtifactSpec:
  canonical share text
  format
  visual recipe
  layout plan
  public-safety transformation trace
  artifact identity / version set

RenderedPieceExport:
  derived image binary
  export receipt
```

image binaryはrecord/feed source-of-truth exact0。preview / save / card / renderer input / export visible textはexact UTF-8 identityで一致する。

immutable identity set:

```text
piece_text_hash = exact UTF-8 bytes including whitespace and line breaks
piece_contract_version
visual_recipe_hash
template_version
export_contract_version
renderer_version
```

### 8.3 Fixed boundaries

- Emlis body / Analysis inferenceをPiece sourceへ入れない。
- public safetyでuser coreが0になる場合は`UNAVAILABLE`。
- privateはowner-only。publicはcurrent access policyで許可された他者だけ。
- external image copyはCocolon visibilityとは別境界であり、回収可能と主張しない。
- record lifecycleとvisibilityは別stateにする。preview quota 0、first record確定だけquota 1、visibility toggle / same-record re-export quota 0。
- save後のtext / format / recipe in-place mutation 0。変更はnew recordとして作る。
- layout fitまたはsafety transform不成立時は`UNAVAILABLE`とし、record / quota effect 0。
- V1C activation時にold Q&A active/selectable route 0。
- rollbackはnew Piece safe-disableであり、old Q&A restoration 0。

### 8.4 Piece quality contract

| ID | Condition |
|---|---|
| `P-SHR-01` | must-keep、relation、negation、reservation、unknown保持 |
| `P-SHR-02` | 画像単独で他者が意味を受け取れる |
| `P-SHR-03` | 本人の表現でありEmlis/Analysis voice混入0 |
| `P-SHR-04` | public safetyで本人の核を消さない |
| `P-SHR-05` | meaning shape起点のformat選択、fixed branch 0 |
| `P-SHR-06` | actual-device layout / font / contrast / clipping成立 |
| `P-SHR-07` | preview/save/export/re-export identity一致 |
| `P-SHR-08` | 本人が保存・共有したい商品artifactとして成立 |

---

## 9. Analysis vertical contract

### 9.1 Observed route

```text
Period Source Set Freeze
-> Event Frames
-> Cross-record Evidence Graph
-> Self-Structure Claims
-> Observed Route Induction
-> Protective / Burden annotations + Unknown gaps
-> Comparable Period Change
-> Text + Visual Projection
-> ObservedSelfStructureMap
```

observed path node:

```text
scene
role
attention / thought
action / non-action
immediate result / aftermath
```

observed edge exact2:

```text
OBSERVED_ORDER
REPEATED_COOCCURRENCE
```

protective / burdenはnon-sequential annotation claim、unknownはscoped gap marker、IF transitionは別graphに置く。欠けたnodeをfixed storyで補完しない。

### 9.2 IF route

```text
Observed Map / Route Identity
-> user-selected Branch Point
-> Branch Intent / Constraint
-> optional Analysis Clarification
-> Analysis-owned IfScenarioCandidateSet 1..3
-> Conditions / Frictions / Unknown
-> per-scenario RealizationCandidateSet
-> Text + Visual Branch Projection
-> IfRouteSimulation 1..3 in parallel
-> optional SavedRouteIntent
```

scenario間をrankせず、best route、success probability、future prediction、behavior commandを出さない。Common Engine comparatorは同一scenarioの表現差だけを扱う。

### 9.3 Analysis quality contract

| ID | Condition |
|---|---|
| `A-MAP-01` | observed claim/edgeはexact evidence refs必須。unknownはevidence代替ではない |
| `A-MAP-02` | filler step/result 0、partial route許容 |
| `A-MAP-03` | roleを人格typeへしない |
| `A-MAP-04` | protective/burdenを原因・善悪へしない |
| `A-MAP-05` | period comparability不成立時はchangeを出さない |
| `A-IF-01` | observed/simulated/saved identity混同0 |
| `A-IF-02` | simulated step origin label 100% |
| `A-IF-03` | future/causal/diagnosis/personality/optimality assertion 0 |
| `A-IF-04` | conditions/frictions/unknown表示 |
| `A-VIS-01` | latest/history/detail/text/graphが対応するcanonical artifact identityへ解決 |
| `A-EXP-01` | 本人がobserved/IF/unknownを区別し、自分の材料として扱える |

---

## 10. Trust、Product Read、candidate comparison

### 10.1 Machine responsibility

- source legitimacy
- evidence binding
- semantic duty coverage
- epistemic partition separation
- no added claim
- no cross-core mixing
- privacy / access boundary
- artifact identity
- positive realization trace
- version / deterministic contract

### 10.2 Human Product Read

Machineで代替しない。

| Core | Human axes |
|---|---|
| EmlisAI | 読まれた感、自然さ、非テンプレ、問いの負担、また入力したさ |
| Piece | 本人の表現、単独伝達、共有したい見た目、自己啓発template化0 |
| Analysis | routeの飛躍0、observed/IF/unknown判別、決めつけ0、自分の材料としての受け取り |

### 10.3 Credit separation

```text
Machine PASS
!= Product Read PASS
!= Actual Device PASS
!= Runtime Readiness
!= Core Acceptance
!= Three-Core Operational Completion
```

---

## 11. Product Causality exact7 — 人間用の設計判断

旧設計で`Product Causality Constitution`と呼んだexact7は、新system、schema、state machineではない。一枚の人間用design / code-review checklistとしてだけ用いる。

新module、field、signal、test、dependency、service、runtime routeは、次のexact7を説明できる場合だけadmitする。

1. consumer core
2. product job
3. product quality criterion
4. observed product gap
5. user-visible artifactへ効く因果
6. 次のactual build / Product Read / device proof
7. STOP / retire / delete condition

### 11.1 実装禁止

exact7の確認用に、次を作らない。

- runtime checker
- new Gate
- approval ledger
- authority chain
- Receipt family
- proof system
- standalone dashboard

既存のimplementation説明またはcode review本文の中でexact7を一回だけ確認し、次のactual Product Readへつなぐ。exact7専用のpacketや永続artifactは作らない。

### 11.2 Detour STOP

次のいずれかで`DETOUR_RISK_STOP`とする。

- 共通Engineの外枠だけを作り、Emlis outputが変わらない。
- actual consumer 0のproduction componentが生まれる。
- named MAJOR / BLOCKERが2 correction cycle連続で減らない。
- retired control routeが別名で復活する。
- detailed common APIを第2 actual consumer前にfreezeする。
- philosophy / Product Causality確認がcontrol plane化する。
- machine PASSを商品PASSへ昇格する。

---

## 12. Current asset disposition

### 12.1 Existing `cocolon_text_generation_core`

GitHub actualの`CoreTextComposer`は、caller-supplied candidateを受け、Japanese coherence、template echo、overclaim、grounding、must-keep guardを通すfail-closed validatorである。

CMEE全体ではない。

採用:

- existing types / evidence / sentence-plan知見
- common guards
- three-core separation tests
- compatibility preimage

非採用:

- caller-supplied完成文を生成Engine正本とすること
- text-only architectureへPiece / Analysisを合わせること
- current adaptersを三中核V1完成の証拠とすること

current routeに関する追加境界:

- Draft PR #2のrecovery candidateは`experimental_only / private_body_full / shareable=false / runtime_connected=false`であり、CMEE hostへそのまま昇格またはwrapper化しない。
- current Piece user-visible routeは旧Q&A互換であり、新Piece visual artifact接続の証拠ではない。V2 contractは未activeとして扱う。
- current Analysisの固定四段routeはpresentation-oriented compatibility surface / test vectorであり、evidence-bound observed graphまたはIF graph authorityではない。
- 上記から再利用する場合は、source / evidence / plan / guardの責任単位だけを新contractへ適合させる。

### 12.2 G0–G10 / CQIFから回収するもの

- source lineage
- evidence graph
- plan ownership
- positive realization
- causal localization
- machine / human separation
- batch / version diff
- body-full / body-free separation
- Product Read / correction / rebuild / re-read loop

### 12.3 Optional Capsuleへ縮小するもの

- exact environment identity
- artifact transport identity
- clean runtime recreation
- forensic independent run

使用条件はrelease candidate、migration、重大incident、実環境依存障害、forensic/security auditに限定する。

### 12.4 Active authorityから退役するもの

- Inspector / scanner常時経路
- per-step SHA authority chain
- checker / controller / FD自動進行
- proof-of-proof
- technical GREENによる商品進行
- 重複Receipt / Handoff / Plan / snapshot

---

## 13. Exactly one host / migration recommendation

Ultra華恋の最終推奨は、次のexact1である。

> **新しいartifact-neutral outer CMEE hostを置き、既存`cocolon_text_generation_core`をJapanese text / common guard subsystemとして内包し、Emlis vertical sliceから単一active ownerへ段階移行する。**

recommended logical host:

```text
ai/services/ai_inference/cocolon_meaning_experience_engine/
  kernel/
  interaction/
  generation/
  realization/
  trust/
  cores/emlis/
  cores/piece/
  cores/analysis/
  evaluation/
```

### 13.1 このrouteを選ぶ理由

- Engine正本はtextではなくsemantic artifactである。
- Pieceはvisual artifactを持つ。
- Analysisはevidence route graphとIF graphを持つ。
- current composerはguard-onlyであり、meaning-to-artifact generation ownerではない。
- existing importを一度に破壊せず、subsystemとして再利用できる。
- current codeを新architecture ownerへ遡及昇格しない。

### 13.2 Migration invariants

- same `mashos-api` process内に置き、public API / DB / RN effectは0から始める。
- parallel active generation owner 0。
- existing composerはsubsystem / compatibility preimageであり、上位ownerではない。
- current limited-composer call siteは、CMEE V1-A cutoverが成立するまで破壊しない。
- Emlis vertical sliceの同一packet内で、outer hostからactual candidateを生成する。
- outer packageだけを先にproductionへ追加しない。
- cutover時のexact100 ingressはCMEE Emlis entry exact1とし、旧recovery builderへのdirect active ingressを0にする。
- Piece / Analysis runtimeは別Mash approvalまで0。
- cutoverと同一packetで旧direct active ingressをexact0にする。後続retirementで扱えるのは、すでにunreachable / reference-onlyになったcodeの除去だけとする。

本設計はpackage作成やpath変更を承認しない。Phase 0でcurrent symbol / import / test dependencyをactual確認し、このrouteをexact pathへ固定できない場合は、別の三択をMashへ返さず`NO_SAFE_CMEE_V1A_CANDIDATE_STOP`とする。

---

## 14. Phase 0 — one bounded work

Phase 0の名称:

> `CMEE_PHASE0_PRODUCT_CONTRACT_HOST_FITGAP_AND_ONE_ROUTE_DECISION`

### 14.1 Work boundary

Phase 0は一つの作業単位であり、Phase 0-A / 0-B / 0-Cへ分割しない。

成果物exact2を同じwork unitで完成させる。

1. `CMEE_ThreeProductJob_SemanticArtifact_Contract.md`
2. `CMEE_CurrentHost_Asset_FitGap_MigrationMap.md`

一冊目だけでSTOPして追加承認を求めず、二冊をatomicに揃える。第三のarchitecture、authority、Gate、Receiptを追加しない。

### 14.2 First document fixed content

- three product jobs / primary artifacts
- user meaning sovereignty
- internal representation non-absolute-truth boundary
- minimal discriminated envelopes
- core / Engine authority boundary
- candidate priority
- core quality contracts
- Product Causality exact7 as a non-system decision card

### 14.3 Second document fixed content

- current path / symbol / test dependency map
- KEEP / EXTRACT / REWRITE / TEST_VECTOR / RETIRE disposition
- outer CMEE host / callable / import ingressのterminal exact1
- duplicate active owner elimination route
- Phase 1 exact changed-path allowlist proposal exact1
- external dependency / model / dictionary / runtime requirementの有無
- resource / privacy / failure boundary
- current Japanese predicate/argument authority gapへのactual provider candidate
- causal RED、completion、STOP conditions

### 14.4 Mandatory terminal decision

Phase 0は、次のどちらかexact1で終了する。

```text
A. CMEE_V1A_EXACTLY_ONE_IMPLEMENTATION_ROUTE_RECOMMENDED
   - host / migration exact1
   - Japanese Meaning Authority provider exact1
   - external parts exact
   - changed paths bounded
   - completion / STOP fixed

B. NO_SAFE_CMEE_V1A_CANDIDATE_STOP
   - unresolved exact cause
   - unsafe or missing authority
   - automatic fallback / retry 0
```

「何らかのparserを接続する」「後でproviderを決める」「空portだけ作る」という終了を認めない。

### 14.5 Phase 0 completion

Phase 0 completeは、資料exact2の存在ではなく、Ultra華恋がMashへexactly oneのEmlis V1-A technical recommendation、またはsafe candidateなしを提示できる状態である。

```text
Phase 0 product credit = 0
Phase 0 implementation credit = 0
CMEE architecture decision credit = bounded exact1
automatic progression = false
```

---

## 15. Japanese Meaning Authority decision boundary

current GitHub actualには、required / active 251 ownerのgoverning predicate / argument attachmentを供給するadmitted producer authorityが存在しない。

Phase 0でexactly oneのRoute U implementation candidateへ収束させる。

Route U provider minimum contract:

```text
per required / active owner:
  exact predicate token range
  authoritative lemma
  authoritative inflection
  argument span
  case role
  governing predicate edge
  formal open-slot classification / denominator
  scope
  provenance
  ambiguity candidates
  unresolved reason
```

provider admissibility:

- ambiguity / unresolvedを自己申告のempty listにしない。
- raw replay、first/last/nearest、case/family、expected text、Product Read selectorをauthorityにしない。
- morphology partitionだけをattachment authorityへ昇格しない。
- parser 1-bestをuser truthへ昇格しない。
- Japanese grammar authorityをperson understandingへ昇格しない。
- external dependencyが必要ならpackage/version/artifact/resource/runtime boundaryをfixedにし、別Mash LEVEL_3対象へする。

Phase 0でsafe producer mechanismをactual証拠からexact1へ絞れない場合、V1-A実装へ進まず`NO_SAFE_CMEE_V1A_CANDIDATE_STOP`とする。

---

## 16. Phase 1 — Emlis V1-A vertical slice

Phase 1は、共通package、空adapter、schema、interfaceだけを作る作業ではない。

### 16.1 Single vertical implementation unit

同じbounded implementation unitで次を接続する。

```text
actual Current Input
-> admitted Route U provider
-> SourceEnvelope
-> provisional GroundedMeaningGraph
-> Emlis Observation Intent
-> ExperiencePlan
-> Japanese realization
-> bound Reception
-> Positive Realization Trace
-> trust checks
-> actual ConversationalObservation candidate
```

内部実装順は分けられるが、framework-only packetを完成creditへしない。最初のimplementation resultは、actual Emlis observation candidateを生成できなければ不合格である。

### 16.2 Completion state

```text
CMEE_V1A_EMLIS_OBSERVATION_CANDIDATE_READY_DISABLED_NOT_ADMITTED
```

completion conditions:

- representative actual inputでobservation candidateが生成される。
- source -> meaning -> plan -> surface -> traceが連続する。
- owner-bound predicate / argument witnessがprovider contractに一致する。
- bound Receptionが具体Observation claimへ接続する。
- raw replay / summary / fixed response / case-family branch 0。
- machine contractとindependent mutation rejection GREEN。
- body-full Product Read packetを作れる。
- production routeはdisabled / non-admitted。
- Piece / Analysis runtime effect 0。

### 16.3 External parts

Phase 0のfinal route decisionで、次をactualに固定する。

- new dependency exact count
- package / version / artifact hash
- model / dictionary / resource identity
- supported Python / OS / architecture
- installed size / one-process memory / latency measurement
- runtime network / external service / secret / storage write
- failure / OOV / ambiguity fail-close

新しい外部部品を使わない場合も、`EXTERNAL_PARTS = 0`と明記する。未確定のまま実装承認へ送らない。

### 16.4 Phase 1 STOP

- actual observation candidateを生成できない。
- attachment authorityが空port、heuristic、raw replay、Product Read selectionへ戻る。
- external resource boundaryが承認scopeを超える。
- Emlis outputを変えずshared skeletonだけが増える。
- representative Product Readでnamed blockerが減らず、次修正が共通原因へ返らない。

---

## 17. Cycle001 re-entry and proof

CMEE Phaseは新しいCycle navigation ownerではない。

実行時のfresh `Cocolon_前提資料/08_cycle001_current_state.md`だけがCycle001のsingle navigation ownerである。final Decision Receiptはmachine-readable current decision owner、Response3 three-step planはactive unchanged planであり、`08`と同格のnavigation ownerではない。実行時は`08`が指定するrestart bundle全体を取得・検証する。

### 17.1 Current blocker facts

```text
required visible owners = 245
active optional visible owners = 6
required + active = 251
safe semantic substitution eligible upper bound <= 30 / 251
authority-unresolved lower bound >= 221 / 251
formal lexical open-slot denominator = NOT_ESTABLISHED
Step1 = FORMAL_LEXICAL_AUTHORITY_UNRESOLVED
Step2 / Step3 = NOT_STARTED_FORBIDDEN
Cycle001 = NOT_ACCEPTED
automatic progression = false
```

221は真の日本語構文曖昧件数ではなく、current authorityでgoverning headを決められないowner数である。30もgoverning predicate authorityのPASS数ではない。

### 17.2 Re-entry conditions

1. Phase 0がexactly one safe implementation routeへ収束済み。
2. Pro華恋が、Phase 1の作業量、完了の意味、活用先、未完成範囲、STOP条件を普通の言葉で説明済み。
3. MashがRoute U provider、exact paths、external parts、resource boundary、failure boundaryとPhase 1実装をLEVEL_3で承認済み。
4. Phase 1 candidateが`READY_DISABLED_NOT_ADMITTED`へ到達し、承認boundary内のpost-resultを持つ。
5. MashがCycle001 Step1への再入場を、Phase 1実装承認とは別に明示する。
6. fresh `08`が指定するDecision Receipt、active three-step plan、remote identitiesを含むrestart bundle全体を取得・検証する。
7. automatic progression 0、Piece / Analysis effect 0。

### 17.3 Step1 completion

- `FORMAL_OWNER_BOUND_LEXICAL_OBSERVATION_WITNESS_AUTHORITY_251_OF_251`
- exact range unique / overlap 0
- authoritative lemma / inflection
- argument span / case role / governing predicate edge
- formal open-slot denominator established and closed
- scope / provenance exact
- ambiguity 0 / unresolved 0をindependentに導出
- independent mutation rejection GREEN
- source clause / summary / whole nominal / raw phrase / fixed response / case-family route 0
- relation / unknown / self-denial / lifecycle維持

Step1 completeまでStep2 / Step3を開始しない。

### 17.4 Cycle acceptance

Step1後だけ、active planに従ってStep2 / Step3へ進む。

- fresh current100
- strict / inverse
- body-full Product Read
- causal repair
- rebuild / re-read
- final exact100
- all100 body-full Product Read
- final acceptance decision

をそれぞれ別gateとして完了する。CMEE設計・実装量をCycle001 PASSへ換算しない。

Cycle001通過後に初めて、Emlis observation sliceの稼働可否を別判断できる。Cycle001 acceptanceだけでactual-device、owner switch、release readinessまたはproduction admissionを自動成立させない。

---

## 18. Later core order

### Phase 2 — Cycle001 First Proof

completion:

`CMEE_V1A_CYCLE001_PROVEN`

### Phase 3 — Emlis Question System

Observation本体の弱さを問いで隠さない。Cycle001 observation proof後に接続する。

completion:

`CMEE_V1B_EMLIS_QUESTION_OPERATIONAL`

### Phase 4 — Piece Visual Artifact

- owner-authenticated saved input exact1
- publicization transform
- exact3 format
- canonical text / visual recipe / renderer identity
- actual-device Product Read
- old Q&A clean cutover

completion:

`CMEE_V1C_PIECE_VISUAL_OPERATIONAL`

### Phase 5 — Analysis Observed Route

- period evidence graph
- observed route
- protective / burden / unknown separation
- text / graph projection

completion:

`CMEE_V1D_ANALYSIS_OBSERVED_ROUTE_OPERATIONAL`

### Phase 6 — Analysis IF Route

- observed / simulated / saved identity
- branch intent / condition / friction / unknown
- non-ranked alternate scenarios

completion:

`CMEE_V1E_ANALYSIS_IF_ROUTE_OPERATIONAL`

### Phase 7 — Three-Core Formalization

三中核actualから一致責任だけをformal shared contractへ昇格する。

completion:

`CMEE_V1_THREE_CORE_OPERATIONAL`

---

## 19. Technical work units, use, unfinished scope, STOP

期間・費用は、external estimateまたはactual measurementがないため本設計では捏造しない。Ultra華恋はtechnical workと成立条件を固定し、Pro華恋がMash向けに作業量と意味を普通の言葉で説明する。

| Work unit | 何を終えるか | 既存資産 / 外部部品 | 何へ活かすか | 完了後も未完成 | STOP |
|---|---|---|---|---|---|
| Phase 0 atomic exact2 | 三商品contract、asset fit-gap、host/provider exact1 decision | current symbolsをKEEP/EXTRACT/REWRITE/TEST_VECTOR/RETIREへ分類。dependency/resourceは選定のみ | V1-A実装承認判断 | implementation、Cycle proof | safe host/provider exact1へ絞れない |
| V1-A vertical slice | actual Emlis candidate一巡 | text core guardsをsubsystem利用。承認済みRoute Uとfixed external boundaryだけを採用 | Cycle001 Step1再入場候補 | production admission、Cycle acceptance | empty port / skeleton / no actual output / external scope超過 |
| Cycle001 | current100、Product Read、repair、final acceptance | single navigation ownerのfresh `08`、そのrestart bundle、runnerへ限定。new dependency追加0 unless separately approved | Emlis observation sliceの稼働可否を別判断する材料 | Emlis question、actual-device / owner switch / release、Piece、Analysis | active planのgate不成立 |
| Emlis Question | one-question differential refinement | stage / source partitionを適合。問いdecisionをsemantic source化しない | False Understanding Prevention | Piece、Analysis | 問いが観測不足を隠す |
| Piece | meaning-to-share-image lifecycle | saved-input / exact UTF-8 identityを採用。old Q&A active routeはcutover時退役。rendererはPiece owner | 他者共有artifact | Analysis、three-core formalization | user core loss / lifecycle identity不成立 |
| Analysis observed | evidence-bound current route | current fixed routeはtest vector。evidence graph / observed route authorityを新contractで構築 | 自己構造map | IF route、three-core formalization | route fiction / evidence edge欠落 |
| Analysis IF | observed別identityのhypothetical branches | observed graphをparent利用。new prediction serviceは採用しない | safe route exploration | formal three-core completion | prediction / best-route化 |
| Three-core formalization | actual共通責任だけをfreeze | 実consumer二つ以上のfieldだけをshared昇格。orphan generic API 0 | CMEE V1三中核運用 | future V2 / optional capsule maturity | premature generic API化 |

### 19.1 Pro / Ultra responsibility after this design

Ultra華恋:

- work unitとexact technical scope
- host / provider / external parts
- completion / STOP
- final technical go / STOP
- implementation / test / GitHub postverification

Pro華恋:

- 全体としてどの程度の作業があるか
- 何をもって各段階が終わるか
- Emlis / Cycle001 / Piece / Analysisへどう活きるか
- 完了後に何ができ、何が未完成か
- どこで停止・再設計するか

Pro説明が完了してもimplementation approvalにはならない。Mashの別LEVEL_3判断を必要とする。

---

## 20. Completion states

| State | Plain meaning |
|---|---|
| `CMEE_FINAL_TECHNICAL_DESIGN_CANDIDATE` | 最終設計候補。未承認・未実装 |
| `CMEE_ARCHITECTURE_APPROVED` | 設計採用のみ。実装未開始 |
| `CMEE_PHASE0_ONE_ROUTE_RECOMMENDED` | 実装候補exact1。未実装 |
| `CMEE_V1A_EMLIS_OBSERVATION_CANDIDATE_READY_DISABLED_NOT_ADMITTED` | Emlis試作候補。Cycle未実証 |
| `CMEE_V1A_CYCLE001_PROVEN` | Cycle001通過。Emlis観測稼働判断可能 |
| `CMEE_V1B_EMLIS_QUESTION_OPERATIONAL` | Emlis問い接続済み |
| `CMEE_V1C_PIECE_VISUAL_OPERATIONAL` | Piece画像接続済み |
| `CMEE_V1D_ANALYSIS_OBSERVED_ROUTE_OPERATIONAL` | Analysis observed route接続済み |
| `CMEE_V1E_ANALYSIS_IF_ROUTE_OPERATIONAL` | Analysis IF接続済み |
| `CMEE_V1_THREE_CORE_OPERATIONAL` | 三中核actual + Product Read成立 |

---

## 21. Final negative verification catalog

### Common

- user correctionでoriginal source mutation RED
- internal graphをuser absolute truthへ昇格 RED
- grammar authorityからpersonality / hidden cause昇格 RED
- candidate priority inversion RED
- cross-core body mixing RED
- plan外claim RED
- positive trace欠落 RED
- artifact identity mismatch RED

### Emlis

- predicate / argument provenance欠落 RED
- unknown補完 RED
- question-only response RED
- question decisionのsemantic source化 RED
- answerによるoriginal上書き RED
- unbound generic Reception RED
- raw replay / fixed response RED

### Piece

- raw input image RED
- Emlis / Analysis body混入 RED
- must-keep loss RED
- safety後generic filler RED
- Q&A active format RED
- preview/save/export mismatch RED
- policy外read RED
- clipping / ellipsis / hidden continuation RED

### Analysis

- one recordからperiod tendency RED
- cooccurrenceからordered route RED
- evidenceなしroute edge RED
- filler result RED
- observed / simulated / saved混同 RED
- IF future / best route化 RED
- scenario間machine ranking RED
- text / graph identity mismatch RED

### Work route

- Phase 0追加資料chain RED
- empty common portだけのV1-A RED
- outer packageだけのimplementation credit RED
- Product Causality checker / Gate化 RED
- CQIF / CMEE parallel current owner RED
- automatic progression RED

---

## 22. Approval and write boundary

本設計が許可しないもの:

- GitHub write
- PR metadata変更
- production / test / runner変更
- new dependency / model / dictionary adoption
- DB / API / RLS / RN変更
- new package creation
- Phase 0開始
- V1-A実装開始
- Cycle001 Step1再入場
- Step2 / Step3
- Piece / Analysis activation
- merge / ready / deploy
- automatic progression

承認順は次のとおりであり、各段階で自動停止する。

1. Mashが本設計候補を採用する。
2. Pro華恋がPhase 0の作業量、完了、活用先、未完成範囲、STOPをplain languageで説明する。
3. MashがPhase 0 exact1 workを別LEVEL_3で承認する。
4. Phase 0がone route recommendationまたはSTOPを返し、自動停止する。
5. READYの場合、Ultra華恋がexact technical routeを、Pro華恋がPhase 1の意味と作業を説明する。
6. Mashがprovider、dependency / resource、exact pathsを含むPhase 1実装を別LEVEL_3で承認する。
7. Phase 1はdisabled candidateで自動停止する。
8. MashがCycle001 Step1再入場をさらに別判断で明示した場合だけ、fresh `08`とactive planへ戻る。

---

## 23. Frozen final decisions

1. 正式推奨名は`Cocolon Meaning Experience Engine V1`。
2. 商品構造は三大中核のまま、CMEEをfirst-class shared technical coreとする。
3. 起点はG0–G10でなく三商品job exact3。
4. 品質は独立上位基盤でなくEngine内planeと改善loop。
5. ユーザー本人を意味の最終主体とする。
6. internal graphを本人の絶対的真実へしない。
7. Japanese authorityとperson understandingを分離する。
8. meaning fidelityをpolish / efficiencyより優先する。
9. existing text coreはsubsystemでありCMEE全体ではない。
10. host推奨はartifact-neutral outer CMEE exact1。
11. Phase 0はatomic exact2 + one route decisionの一作業。
12. Phase 0はRoute U providerをexact mechanismへ収束し、空portを残さない。
13. V1-Aはactual Emlis observationを生成するvertical slice。
14. Cycle001をfirst actual proofとし、acceptance条件を弱めない。
15. Emlis QuestionはObservation proof後。
16. Pieceはuser-owned share image、Analysisはobserved / IF routeを別identityで持つ。
17. Product Causality exact7をnew control planeへしない。
18. CQIFはhistorical design sourceでありparallel current ownerではない。
19. work unit、完了、活用先、未完成、STOPをPro華恋が普通の言葉で説明する。
20. 根拠のない期間・費用見積りを作らない。
21. 本設計から実装・Cycle・他coreへ自動進行しない。

---

## 24. References

### Pro review

- `ProKaren_ProductRouteReview_CocolonMeaningExperienceEngineV1_KarenThoughtIntegrated_20260815.txt`
- SHA-256 `c94a0f3b8a816b796a19b94616e519e0632092b7e2d7c02473eda8d3a0ebfd9e`

### Direct predecessor

- `Cocolon_MeaningExperienceEngine_V1_UltraTechnicalDesign_20260815.md`
- SHA-256 `8a3852380eb4b48ba70c5ada91d6b2d848ad6df28dbc79404a0074f45d00f5e2`

### Cocolon current premise / rules

- `Cocolon_前提資料/08_cycle001_current_state.md`
- `Cocolon_前提資料/Cocolon_EmlisAI_longterm_roadmap_CURRENT.md`
- `Cocolon_Piece/00_read_first.md`
- `Cocolon_前提資料/cocolon_thought_material_for_karen.md`
- `Cocolon_前提資料/10_cocolon_joint_development_karen_thought_boundary_2026_05_24.md`
- `Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt`
- `Cocolon_前提資料/work_attitude_rules_for_karen/CURRENT_RULES.md`
- `Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt`
- `Cocolon_前提資料/Cocolon_Quality_Intelligence_Foundation_CrossCore_ApplicationPlan_20260814.md`

### Product source materials

- `Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807_CleanCutover_Revised(6).md`
- `Cocolon_Analysis_ProFirst_CurrentActual_ProductQualityClosure_Roadmap_20260807(5).md`

---

## 25. Ultra華恋 final technical recommendation

Pro華恋のreviewを採用する。

CMEEは、ユーザーの言葉を解析して「真実を決めるEngine」ではない。

ユーザーが置いた言葉を雑に消費せず、現在のsourceから扱える意味、分からない部分、仮想部分を分け、その人が受け取れる観測、共有画像、自己構造routeへ形にするEngineである。

そのために、十分に大きく、長期的なtechnical coreとして育ててよい。ただし、規模の根拠は常に三大中核のactual artifactとhuman Product Readでなければならない。

Ultra華恋として、本設計exact1を、`Cocolon Meaning Experience Engine V1`の最終技術設計候補としてMashへ提示する。

現在は設計候補であり、実装、Cycle001再開、GitHub反映は開始しない。
