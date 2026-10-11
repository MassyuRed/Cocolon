# CMEE V1-C — Piece Semantic Visual Artifact 詳細設計

- document id: `cocolon.cmee.v1c.piece_semantic_visual_artifact.detailed_design`
- lifecycle: `DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE`
- runtime state: `NOT_IMPLEMENTED`
- Piece activation: `NOT_AUTHORIZED`
- API / DB / RN effect: `0`
- legacy Q&A cutover effect: `0`

---

## 0. Product result

V1-Cが最終的に作るものは、保存済みのユーザー入力を、他者が単独で読んでも意味を取り違えにくい共有artifactへ変換する`PieceArtifactSpec`である。

```text
owner-authenticated saved input
-> source-bound provisional meaning
-> Piece public-expression intent
-> format-specific canonical text
-> versioned visual recipe and layout plan
-> positive realization trace
-> verified PieceArtifactSpec
-> Piece-owned renderer
-> RenderedPieceExport
```

CMEEはcanonical textとrender-neutral visual specificationまでを生成する。画像binaryの描画、保存、公開、Nexus表示、quota、削除はPiece product lifecycle ownerが担う。

## 1. Activation boundary

この文書はfuture V1-C contractを設計する。current user-visible Pieceはpre-release legacy Q&Aであり、新Piece V2はcode-disabled design / causal RED段階である。

本設計のGitHub反映は次を行わない。

- Piece V2のactivation
- current Q&A routeの変更または停止
- DB / RLS / API / RN / Nexus / native shareの変更
- Piece recordの作成
- CMEE Piece moduleの空実装
- EmlisAIまたは分析構造bodyの再利用

V1-C implementationは、Emlis V1-A / Cycle001 proofとV1-B Emlis Questionのoperational proof後に、別Mash判断を必要とする。approved V1 orderを変更してPieceをV1-Bより先にactivateしない。

## 2. Core request

```text
PieceGenerationRequest
  request_id
  authenticated_owner_scope
  saved_input_ref
  saved_input_version
  source_stage
  supplemental_answer_ref?
  requested_format?
  visibility_intent
  audience_policy_ref
  locale = ja-JP
  piece_policy_version
  visual_catalog_version
```

`saved_input_ref`はowner-authenticated IDであり、raw emotion / memo payloadの再送をsource authorityへしない。

Piece lifecycle serviceがowner authentication / entitlementとsaved record retrievalを所有し、request-local private materialをCMEEへ渡す。CMEEはDB read policy、record lookup、DB write、quotaを所有しない。

source rule:

| Stage | Original | Supplemental | Other-core body |
|---|---:|---:|---:|
| normal / pre-question | exact1 | 0 | 0 |
| refined | exact1 immutable | exact1 separate role | 0 |

Emlis observation / reception / question decision、Analysis claim / route / simulationはcontrol lineageに参照できても、Piece本文のmeaning sourceにはできない。

## 3. Proposed future module topology

V1-Cの別implementation approval時に、Phase fit-gapでexact pathを確定する候補である。

```text
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/piece/__init__.py
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/piece/source_adapter.py
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/piece/intent_compiler.py
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/piece/visual_plan_realizer.py
```

publicization、format planning、canonical text realizationは`intent_compiler.py`内のPiece-owned責任として最初のverticalで閉じ、actual code量・循環import・reviewabilityが分割を必要とするときだけPhase approvalでexact pathを増やす。empty stubやfuture callableだけをV1-A packageへ先行作成しない。第2 actual consumerで一致した責任だけをshared contractへ昇格する。

### 3.1 Current owner integration disposition

V1-C implementation approval時は、new CMEE pathsだけでなく次のcurrent ownerを同じchanged-path / retirement設計で再確認する。

| Repository | Current path | V1-C disposition |
|---|---|---|
| mashos-api | `ai/services/ai_inference/api_emotion_piece.py` | `MODIFY_AT_CUTOVER`: raw resendではなくsaved-input identityへ接続 |
| mashos-api | `ai/services/ai_inference/emotion_piece_generation_service.py` | `RETIRE_ACTIVE_AT_CLEAN_CUTOVER`: legacy Q&A generation owner |
| mashos-api | `ai/services/ai_inference/emotion_piece_store.py` | `KEEP_LIFECYCLE_OWNER / MODIFY_FOR_V2_IDENTITY` |
| mashos-api | `ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py` | `MODIFY_AT_CUTOVER`: canonical artifact identityを保存・公開へ渡す |
| mashos-api | `ai/services/ai_inference/piece_v2_contract.py` | `KEEP_CORE_CONTRACT / RECONCILE_WITH_CMEE` |
| mashos-api | `ai/services/ai_inference/piece_generation_policy.py` | `MUST_MAP_BEFORE_CUTOVER`: legacy selection / hash policyをV2 identity authorityへ昇格しない |
| mashos-api | `ai/services/ai_inference/piece_generated_display.py` | `MUST_MAP_BEFORE_CUTOVER`: canonical V2 body以外のdisplay reconstructionを0にする |
| mashos-api | `ai/services/ai_inference/piece_text_formatter.py` | `MUST_MAP_BEFORE_CUTOVER`: legacy Q&A formatting ownerをV2生成ownerにしない |
| mashos-api | `ai/services/ai_inference/piece_generated_access.py` | `KEEP_ACCESS_BOUNDARY / VERIFY_V2_IDENTITY` |
| mashos-api | `ai/services/ai_inference/piece_publish_entitlements.py` | `KEEP_ENTITLEMENT_OWNER / VERIFY_V2_VISIBILITY` |
| mashos-api | `ai/services/ai_inference/api_piece_runtime.py` | `KEEP_READ_LIFECYCLE / VERSION_DISPATCH` |
| mashos-api | `ai/services/ai_inference/api_nexus.py` | `MODIFY_PROJECTION_ONLY`; generation ownerにしない |
| mashos-api | `ai/services/ai_inference/piece_public_read_service.py` | `KEEP_ACCESS_OWNER / MODIFY_FOR_V2_ARTIFACT` |
| mashos-api | `ai/services/ai_inference/piece_public_read_store.py` | `KEEP_READ_STORE / PROTECT_NON_PIECE_ROWS` |
| Cocolon RN | `components/EmotionPiecePreviewModal.js` | `RETIRE_LEGACY_QA_REACHABILITY / REPLACE_WITH_V2_PREVIEW` |
| Cocolon RN | `screens/input/InputPiecePreviewController.js` | `MODIFY_AT_CUTOVER` |
| Cocolon RN | `lib/api/home/emotionPieceApi.js` | `MODIFY_WIRE_TO_V2_CONTRACT` |
| Cocolon RN | `screens/nexus/NexusPieceCard.js` | `MODIFY_TO_CANONICAL_V2_BODY` |
| Cocolon RN | `screens/nexus/NexusPieceFeedSection.js` | `KEEP_FEED_OWNER / REMOVE_QA_BRANCH` |
| Cocolon RN | `screens/NexusScreen.js` | `MUST_MAP_BEFORE_CUTOVER`: feed entry / access / empty-state behaviorを固定 |
| Cocolon RN | `lib/compat/legacyWireContracts.js` | `MUST_MAP_BEFORE_CUTOVER`: V2 wireをlegacy aliasへsilent変換しない |

`KEEP`はbytes不変を意味せず、責任ownerを維持する意味である。Phase fit-gapはfresh caller / writer / reader graphを再取得し、上表からのdeltaをMash approvalへ明示する。

## 4. Piece source adapter

`source_adapter.py`のminimum duties:

1. authenticated ownerとsaved input ownerを一致させる。
2. source ID、source version、stage snapshotをexact1でfreezeする。
3. originalとsupplementalを別partition / commitmentとして保持する。
4. raw bodyはrequest-local private materialとして扱う。
5. source range、Unicode scalar、UTF-8 byte境界を検証する。
6. Emlis / Analysis bodyをsource setから拒否する。
7. current raw-payload preview routeからの入力をV2 source authorityへ昇格させない。

failure:

| Condition | Result |
|---|---|
| saved input absent / version mismatch | `UNAVAILABLE` |
| owner scope mismatch | `REJECTED` |
| supplemental-only request | `REJECTED` |
| other-core body mixed | `REJECTED` |
| raw payload replay route | `REJECTED` |

## 5. Piece meaning extension

shared SourceBoundMeaningGraphへPiece固有のartifact dutiesを付与する。

```text
subject / speaker ownership
stance
object / target
predicate and argument relation
polarity / modality / temporal scope
condition / contrast
uncertainty / reservation
audience risk
must-keep meaning
forbidden public promotion
```

graphは本人の絶対的truthではなく、保存入力にbindしたprovisional interpretationである。user correctionはoriginalを改変せず、new source versionまたはsupplemental lineageを作る。

## 6. Piece product intent

```text
PieceArtifactIntent
  product_job = EXPRESS_AND_SHARE
  authorship = USER_OWNED_COCOLON_SHAPED
  audience = EXTERNAL_SHARE_CARD_WITHIN_POLICY
  self_contained = true
  public_safe = true
  output_modalities = [CANONICAL_TEXT, VISUAL_CARD_SPEC]
  eligible_formats[]
  must_realize_duties[]
  forbidden_claims[]
  attribution_policy
```

「他者が読める」は一般公開と同義ではない。Cocolon内visibility `public`はexisting access policyで許可された他者に限る。外部画像shareはCocolon内visibilityとは別境界である。

## 7. Publicization transform

目的はmeaningを消して安全なgeneric文を作ることではなく、本人の核を保持したまま共有可能な表現へ変換することである。

transform対象候補:

- PII、連絡先、URL
- 第三者の直接識別
- unsupported allegation
- attack / threat
- private locator
- audience policyに反するdetail

must preserve:

- user-owned reaction / stance
- negation
- uncertainty / reservation
- temporal scope
- condition / contrast
- source-grounded subject / object relation

安全化後にsource-grounded anchorまたはmust-keep user coreが0になった場合は`UNAVAILABLE`とし、generic fillerを生成しない。record / quota effectは0である。

## 8. Format planner exact3

new Piece active format候補は次のexact3だけである。

```text
short_essay
quote
declaration
```

formatはkeyword、文長、focus keyだけで選ばない。semantic shape、authorship、must-keep coverage、standalone comprehensibility、layout feasibilityを使う。

| Format | Eligibility summary |
|---|---|
| `short_essay` | contextとrelationを複数blockで保持する必要がある |
| `quote` | 一つのsource-grounded stanceが単独で成立し、context lossがない |
| `declaration` | user-owned intention / valueが明示的で、推測による意思化がない |

eligible format 0なら`UNAVAILABLE`。Q&Aをfallback formatにしない。

### 8.1 Existing Piece V2 contract mapping

| Contract | CMEE V1-C use |
|---|---|
| `piece.record.v2` | Piece-owned record / lifecycle identityを保持 |
| `piece.content_payload.v1` | CMEE canonical `piece_text` / lowercase formatを供給 |
| `piece.content_meaning.v1` | source-bound meaning dutiesへadaptしduplicate meaning owner 0 |
| `piece.public_safety_transformation.v1` | Piece publicization transformとして保持 |
| `piece.visual_recipe.v1` | Piece-owned recipe selection / version identityを保持 |

CMEE internal enumを別表記にする場合もwire exact1は`short_essay | quote | declaration`であり、明示mappingなしのuppercase / aliasを受けない。

## 9. Canonical text generation

Piece text realizerはArtifactPlanのdutiesからactual Japanese textを作る。

allowed:

- meaning-preserving clause / paragraph ordering
- source-bound predicate / argument realization
- formatに応じたline / paragraph division
- safe abstraction
- repetition reduction
- audienceに必要なminimum context追加。ただしsource-groundedのみ

forbidden:

- fixed inspiration / self-help closing
- Emlis reception voice
- Analysis diagnosis / route inference
- sourceにないevent、cause、intent、future、advice
- isolated keyword ownership
- silent overcompression
- raw sourceをそのまま画像本文へ移すfallback

## 10. `PieceVisualCardPayload` and `PieceArtifactSpec`

CMEE / Piece compiler boundaryのcanonical output:

```text
PieceVisualCardPayload
  kind = PIECE_VISUAL_CARD_SPEC
  format
  canonical_piece_text
  piece_text_hash
  body_blocks[]
  visual_recipe_ref
  visual_recipe_hash
  layout_plan
  version_set

PieceArtifactSpec = GenerationArtifactBundle<PieceVisualCardPayload>
  artifact_id
  artifact_version
  artifact_kind = PIECE_VISUAL_CARD_SPEC
  source_commitments[]
  semantic_graph_ref
  experience_plan_ref
  primary_artifact = PieceVisualCardPayload
  realization_trace_ref
  quality_report_ref
  lifecycle_bindings
```

`piece_text_hash`は空白・改行を含むexact UTF-8 bytesから計算する。whitespace compact hashはV2 canonical identityへ使わない。

`version_set` minimum:

```text
piece_contract_version
meaning_schema_version
artifact_plan_version
visual_recipe_version
template_version
layout_contract_version
export_contract_version
renderer_version
```

## 11. Visual plan and renderer boundary

CMEE / Piece compiler owns:

- canonical text
- selected format
- Piece-owned recipe selection result ref
- render-neutral block order
- grapheme-safe wrap constraints
- minimum font / contrast / margin constraints
- no-clip / no-ellipsis duty
- accessibility reading order
- trace and identity envelope

Piece modality runtime owns:

- template catalog content
- theme / font / ratio selection policy
- RN / native renderer
- actual pixels
- device-specific fit
- save / share UI
- binary export receipt

```text
RenderedPieceExport
  source_artifact_ref
  renderer_version
  export_contract_version
  binary_digest
  dimensions
  accessibility_result
  fit_result
  export_receipt
```

image binaryはderived exportであり、PieceRecordまたはfeedのsource-of-truthにしない。

current actualでは画像export / native captureのfinal ownerと必要dependencyは未確定である。V1-C preflightでRN renderer、native capture、iOS / Android permission、binary memory、dependency / licenseを測定し、新native dependencyが必要ならseparate Mash approvalを得る。未確認dependencyをCMEE kernelへ先行追加しない。

## 12. Identity and lifecycle invariants

1. preview body = saved body = card body = renderer input = export / re-export visible body。
2. preview recipe hash = saved recipe hash = export request recipe hash。
3. saved後のtext / format / recipe in-place mutationは0。変更はnew record。
4. silent latest template substitutionは0。
5. layout fitまたはsafety failureは`UNAVAILABLE`でrecord / quota 0。
6. preview quota 0、initial record確定だけ1、visibility toggle / same-record re-export 0。
7. record lifecycleとvisibilityは別state。
8. `private`はowner-only。owner historyとexport / re-exportを許すがNexus / notificationは0。
9. `public`は全世界ではなくexisting access policy内の他者だけ。policy外readはRED。
10. public -> privateはCocolon内部feed / cache / notificationからsource deny firstで除去する。
11. deleteはCocolon内部conceal / purgeであり、外部保存画像やSNS copyを回収したと表示しない。
12. private / publicのmeaning / safety基準は同一。

## 13. Verification

Proposed future tests:

```text
ai/tests/test_cmee_piece_v1c_source_adapter.py
ai/tests/test_cmee_piece_v1c_intent_compiler.py
ai/tests/test_cmee_piece_v1c_visual_plan_realizer.py
ai/tests/test_cmee_piece_v1c_vertical.py
ai/tests/test_cmee_piece_v1c_negative_contracts.py
```

machine gates:

- source / owner / version exact
- must-keep coverage 100%
- added unsupported claim 0
- polarity / relation / uncertainty / time corruption 0
- cross-core body / voice leakage 0
- public safety violation 0
- format ineligible selection 0
- text / recipe / version identity mismatch 0
- clip / ellipsis / hidden continuation 0
- policy-external read 0
- first-cutover rollback targetは旧Q&A reachability 0、explicit UNAVAILABLE、record / quota 0、single ownerを満たす

human / actual-device Product Read:

- 画像単独で誰の何が伝わるか
- 本人の考えとして読めるか
- template / self-help / Emlis voiceになっていないか
- 意味を削って安全に見せていないか
- 保存・共有したい商品品質か
- iOS / Androidのactual viewで読めるか

## 14. Clean cutover

V1-C activation packetで次を同時成立させる。

```text
new Piece generation ingress exact1
Q&A active/selectable format 0
legacy Q&A generation/API/RN/Nexus entrypoint reachability 0
dual-run / coexistence renderer / compat-read adapter 0
first rollback target = pre-admitted PIECE_V2_SAFE_UNAVAILABLE_ROLLBACK_TARGET
later rollback = deploy / git revert to last admitted single-owner V2 version
```

初回V2 activationには、戻り先となるadmitted V2がまだ存在しない。したがってactivationより前に、旧Q&A reachability 0を保ったまま明示的な`UNAVAILABLE`を返す`PIECE_V2_SAFE_UNAVAILABLE_ROLLBACK_TARGET`を、public behavior、single owner、API / RN表示、quota 0、device testと共に別Mash判断でpre-admitする。これが成立しなければ`NO_SAFE_PIECE_V1C_FIRST_CUTOVER_STOP`とし、初回activationを行わない。

parent design / Piece entryにある`new Piece safe-disable`は、このpre-admitted exact targetを指すものとして本detailで具体化する。generic feature flagや旧Q&A fallbackを指さない。初回以後はdeploy / git revertでlast admitted single-owner V2 versionへ戻す。その他のruntime safe-disableまたは旧Q&A fallbackは、public behavior / owner exact1を別承認するまで未採用である。旧Q&Aをrollback routeとして復活させない。shared tableやnon-Piece dataを変更する場合は、exact Piece predicateとwriter / reader dependency mapを先に固定し、non-Piece row / consumerを保護する。

## 15. V1-C completion

```text
CMEE_V1C_PIECE_VISUAL_OPERATIONAL
```

成立条件:

- owner-authenticated saved inputからverified `PieceArtifactSpec`が生成される。
- exact3 formatがsemantic eligibilityに従う。
- preview / save / card / render / export identityが一致する。
- publicizationがmeaningを消さない。
- actual-device Product Readを通過する。
- legacy Q&A active ingressが0である。
- pre-admitted first-cutover rollback targetまたはlast admitted V2 rollback targetがexact1である。
- Piece current structure map / manifest / historyがsame packetで同期する。

このstateをCMEE three-core operational completionへ自動変換しない。
