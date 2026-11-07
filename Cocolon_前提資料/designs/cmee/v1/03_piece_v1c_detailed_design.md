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

<a id="cmee-p2-piece"></a>

## 2026-10-23 — P2：未採用候補からPiece意味・本文までの対応差分（PROPOSED_ONLY）

P1後の固定原本はCocolon PR30 `141973b4eb35428b50e09cb5c74e9a0f7e2aa208`、API PR3 `b7eb534d44658549896baf449e7c319d49d14396`。本節はMashが指示したCMEE内部準備の具体化であり、実admission・grammar・realizer・guard・商品contractの変更、モデル接続、本文生成、保存・配置を実施／承認した記録ではない。冒頭のfuture topologyや旧activation状態から現在を復元せず、現在の実装・稼働・残件は[全体現在地](../../../00_cocolon_current_product_and_state.md)とPiece current mapへ戻る。

共通の未採用候補schemaは[05のP2](05_json_schema_and_versioning.md)が所有する。本節の「型へ写せる」はfieldの収容先があるという設計上の対応だけで、候補が妥当・採用済み・表示可能という意味ではない。P1の`CandidateReceipt.adoption_state=NOT_ADOPTED`を維持する。モデルの自己採点、quoteの位置一致、下表の記載だけでは採用しない。

### P2-C1. 既存型への対応と、保持できない意味

実source prefixはAPI `ai/services/ai_inference/cocolon_meaning_experience_engine/`。

| 候補の意味要素 | 既存の正確な収容先 | 写像条件・差分 |
|---|---|---|
| source ID・版・原7field・本文field | `PieceSourceSnapshot.saved_input_id/source_version/saved_original_json/original_text`、`PieceSourceMeaning.saved_snapshot/envelope/evidence` | snapshotは既存ownerが取得・再照合する。P1のfield locatorをnative `EvidenceRef`と偽らず、採用時に既存source envelopeへ束縛した正規locatorをCMEE側で作る。原7fieldとmemo→空行→memo_actionを保持 |
| claimのID・本文・根拠 | `GroundedMeaningGraph.nodes[]`の`MeaningNode.node_id/owner_id/node_kind/grounding_kind/value/epistemic_state/evidence_ids`、`PieceSentenceMeaning.node_id/evidence_id/source_start/source_end/role` | currentの`node.value`は原文の完全な文そのもの。モデルの言換え本文をここへ入れるとsource slice一致を壊す。candidate IDとCMEEが割当てるnode/owner IDを分ける。抽象claimから原文nodeへの対応は採用adapterの未実装責任 |
| 主体・述語・対象 | 限定評価は`PiecePersonalEvaluation.scalar_parts/utf8_parts`（speaker／predicate／target）、`construction/kind/copula`。明示role/nameは`PieceRoleBinding` | `MeaningNode`に一般actor/predicate/argument欄はない。省略主体を「私」の明示根拠へ変換しない。一般感情・非行動・被依頼行為などを評価frameへ押し込まない。未対応分は候補に保持し、nativeへ未採用 |
| 肯否・時点・確定度 | 限定評価は`PiecePersonalEvaluation.polarity/temporal_scope/commitment`。その他の原文nodeは完全原文を保持 | 原記録`created_at`と、記述対象の過去／次回／そのときは別。一般claimのnegation scope、報告内感情、将来条件をこれらの有限評価fieldだけでは表し切れない。native拡張／別の採用表現を決めるまで保留 |
| 関係・条件・留保 | `MeaningEdge.relation/source_node_id/target_node_id/evidence_ids`、限定scopeは`PieceExpressionScope.relation/marker/scope_scalar_span/scope_utf8_span/expression_scalar_span/expression_utf8_span` | currentは原文の接続詞と限定grammarから再導出する。relation文字列を入れられることと、妥当な関係として採用できることを分ける。markerや両端の根拠なしに因果・同時性・決意を作らない |
| 明示参照・照応 | `PieceNominalReference.antecedent_node_id/reference_node_id/nominal_head`と両側scalar/UTF-8 span | currentの限定名詞参照と同等のsource証拠が必要。「そのとき」が指す未来の条件を、既存nominal referenceの成功へ偽装しない |
| 選択感情・強さ | 保存JSONの`emotions/emotion_details`、限定対応の`PieceSelectedFeeling.selection_field/selection_index/label/strength/node_id/evidence_id` | selected labelは本文と別の本人入力。ラベルから感情の原因を補わない。現在の`_selected_feeling_bindings`は現在肯定の明示自己感情文との一致を要求するため、P01の過去感情へそのまま適用できない |
| unknown・複数の読み・不一致 | 現`PieceSourceMeaning`／`PieceArtifactPlan`に一般unknown/conflict集合はない | 原文の未確定・否定・対比はnodeから落とさず、候補側の対象・scope・根拠を保持する。架空のnode_kindや空の根拠で穴埋めせず、一般採用は未対応／保留とする。嬉しさと仕事の残りは両立する内容で、矛盾へ変換しない |
| 本文責務・段落・format | `PieceArtifactPlan.graph_id/source_version/intent/duties/block_node_ids/declaration_eligible`、`PieceTextDuty.node_id/operation` | 各claimのmust-keep対応を確認してからCMEEがplanを作る。モデルが返したplanをそのまま採用しない。本人の声、条件・否定・留保を保つ新本文の採用責任は現有限operationと別に具体化が必要 |
| canonical textとartifact | `PieceArtifact.body_blocks/piece_text/piece_text_hash/format_type/eligible_formats` | 型へ入れた時点ではartifact採用0。本文、既存format適格性、publicization、recipe／保存／画像fit／export identityの成立を分ける。モデルがfitやrenderer成功を宣言しても証拠にしない |

### P2-C2. P01-Nの具体的な意味と保留箇所

以下は固定fixtureを人手で対応づけた設計例であり、モデル出力・新しい採用済みgraphではない。全rangeは`P01-O`の元fieldに対するUnicode scalar半開区間。UTF-8は元fieldから再計算し、native envelopeに無いIDや座標を捏造しない。

| 元source | 保持する意味・scope | current型との対応／候補の扱い |
|---|---|---|
| `memo[0,19)`「助かったと言ってもらえてうれしかった。」 | 他者からそう言われたという本人報告と、本人の過去の嬉しさ。相手の内心の真偽は別 | 原文nodeへ残す形はある。一般報告・感情・その関係のcandidate→native採用は未対応。話者が省略されていることも候補で明示し、勝手な固有人物や現在感情へ変えない |
| `memo[19,41)`「でも自分の仕事が残って、帰るのが遅くなった。」 | 自分の仕事が残ったこと、帰りの遅れ、先行する嬉しさとの留保 | 2端点と「でも／残って」のscopeを候補へ保持。仕事量や時刻、手伝いが遅れの唯一原因という断定を追加しない。一般対比・結果のadmissionは保留 |
| `memo[41,61)`「手伝ったことを後悔しているわけではない。」 | 「手伝ったこと」に向く後悔の否定scopeを全文のまま保持 | `PiecePersonalEvaluation`の有限好き／価値文へ偽装しない。「全く後悔がない」「良い経験だった」へ強めない。一般否定scopeのnative対応が未完のため未採用 |
| `memo[61,84)`「次も引き受けるかは、そのときの余裕で決めたい。」 | 次回の引受けは未確定、その時の余裕を判断基準にしたいという意向 | `PieceExpressionScope`の原文「なら」等の成功に偽装しない。一般意思・条件・未来時点の採用は未対応。「次も引き受ける／断る」と確定せず、declaration適格性を自己認定しない |
| `memo_action[0,19)`「頼まれて同僚の発表資料を一緒に直した。」 | 依頼され、同僚の発表資料を一緒に直したという本人報告（共同相手は未特定） | fieldはmemoと別のまま保持。本文順を根拠に、この行動が前四文のいつに起きたか／本人の動機を補わない。`KEEP_COMPLETE_SOURCE_CONTEXT`の保持形と、新しい自然なcanonical textの意味採用を区別 |
| `emotions`／`emotion_details` | 喜び・不安、各weakの本人選択 | 7fieldにはそのまま保持するが、過去の嬉しさだけから不安の原因・現在強度を補わない。C0の`saved_emotion_meaning_not_yet_supported`は未解消のまま |

候補が「嬉しかった」「負担もあった」「後悔の否定」「次回は余裕次第」のうち一つを欠く場合、原文の一部だけから読みやすい本文を作れても採用しない。候補quoteの一致だけでは、そのquoteからclaimが導けるとは判定できない。意味の対応が曖昧なら保留、現native構造や作者に収容できないなら未対応とし、sourceを削って既存grammarへ合わせない。

### P2-C3. 維持する検査と、変更案が必要な正確なowner

| 実owner・関数 | 維持する責任 | 実admission実装前に設計／承認を要する差分 |
|---|---|---|
| `piece_v2_source_adapter.project_saved_original_source`、`piece_source._saved_field_projection` | owner解決済み保存record、canonical JSON、ID・版・元7field、二本文fieldの同一性 | `_saved_field_projection`内の`_sentences`は有限意味側の条件。P1のsource-only投影を本番admission成功へ転用しない。新候補のsource照合と現grammar条件を分離する実装案が必要 |
| `piece_source.build_piece_source_meaning`、`_selected_feeling_bindings` | 元本文・構造化選択・根拠位置を落とさない。生成文を本人sourceへ混ぜない | 新しい意味候補の主体・時点・肯否・関係の採用と、selected labelの保持／表出条件を具体化。有限grammarとの不一致だけで意味を誤りと決めず、未対応差を出す |
| `piece_source.validate_piece_saved_fields` | snapshotとsource・evidence・意味の結び付き | 現在は同snapshotから`build_piece_source_meaning`を全再導出して`expected == meaning`。sourceの厳密一致と意味の有限再導出一致を分ける。再導出削除だけでは代替にならない |
| `validate_piece_nominal_references`／`validate_piece_personal_evaluations`／`validate_piece_expression_scopes` | 全参照・主体・否定・時点・scopeの根拠保持 | 現有限導出と完全一致する型だけが通る。一般candidateを同型へ詰めた場合の保証範囲を拡げたことにしない |
| `piece_v1c.compile_piece_artifact_plan`／`realize_piece_artifact` | 全nodeを落とさないduties／blocks、本人の声、plan-source binding | `plan == compile_piece_artifact_plan(meaning)`、原文sliceと`node.value`の一致、有限operationの作者を現行どおり維持。モデルの言換え・段落案を使うなら、意味被覆・否定scope・条件・多重性をどう検査するかが別の変更案 |
| `piece_v2_content_policy.validate_source_meaning_preservation` | 本文とsourceの意味被覆、否定・時点・引数・role・条件の保持 | author-freeでも現有限grammarと許可編集だけを認める検査。一般paraphraseやLLM自己採点を検証できるものではない。新方式の意味検証と、機械で保証できず人が判断する範囲を明示する |
| `validate_candidate_text`／`choose_format`、既存recipe／renderer／保存owner | content envelope、プラン別選択、正規本文hash、preview/save/read/export identity | モデルのproposed formatは提案だけ。新意味経路ができてもformat・fit・recipe・本番保存の成功条件は免除しない |

P2は上記の差分表まで。current guardの緩和・削除、native型の追加、語彙／文法拡張、通常Engineへの候補注入、既存本文の再生成は0。次の実装案は、P01の全意味と未確定をどのversioned意味表現で保持し、どの候補を保留／未対応にするかを先に具体化し、既存承認と照合する。型を埋めたこと、stub成功、文書反映を意味採用・商品品質の成功へ数えない。

<a id="cmee-p4-offline-piece-proposal"></a>

## 2026-10-23 — P4限定内部実装案：Pieceの意味採用と構造化選択の分離

**承認範囲の案作成時記録。2026-10-23のMash明示承認・限定実装は後続P4実装節。** 確認原本はAPI PR3 `723ce9fe2128e66bd8a296b342466708da031bb3`、Cocolon PR30 `01cd04e366206c3e021875f09f74731ad1cf6574`。P3のEmlis承認はPieceへ流用しない。本節は今回のCMEE内部準備指示で実sourceとP2標本から具体化した次の一実装単位。実モデル、通常Piece、preview／保存／画像出力は対象外。

### P4-1. 解消する条件・Mash判断が必要な差

P01-NはP1で元7fieldを凍結できるが、候補意味から既存plan／作者へ入る入口がない。`engine.generate(semantic_input=...)`は現在Emlis専用で、Pieceは`semantic_offline_thread_required`になる。通常Pieceの`_selected_feeling_bindings`も「現在肯定・明示一人称・原文一文で全選択を被覆する」条件を満たさず、C0は`saved_emotion_meaning_not_yet_supported`だった。

推奨は、**新規・明示offlineの原入力Pieceだけに、版付き採用snapshotを意味の起点として追加する**こと。sourceの同一性・意味被覆・作者と独立検査・版と再開を維持し、旧有限parserとの完全一致を新profileの意味採用条件にはしない。新しい自由paraphraseを無検査で通す案ではなく、最初はP01-Nの閉じた意味familyだけを扱う。

本人が選んだ「喜び・不安／各weak」は本人の構造化入力であり、削除可能な装飾ではない。新profileでは全選択をsnapshot／planの独立した保持責務として残す一方、**本文に明示されない感情・程度・原因・時点を選択欄から補わない**。「不安もあった」「弱い喜びだった」を追加せず、過去の嬉しさを現在へ変えない。対応する本文がない選択は`SOURCE_SELECTION_RETAINED_NOT_TEXTUALIZED`で保持し、本文へ表出できたとは数えない。

これは旧profileの「全選択を本文で被覆する」契約からの変更で、Mashの具体承認が必要。選択欄を消してP01-N成功にせず、原文にない不安文を足しても成功にしない。公開された文章だけで選択不安まで伝わるという保証も付けない。

### P4-2. 型・変更owner・接続境界

型field案は[設計05のP4](05_json_schema_and_versioning.md#cmee-p4-piece-snapshot-proposal)。新profile名案は`piece_candidate_snapshot.v1`。P1 receiptの`NOT_ADOPTED`は不変、採用snapshotは別private成果物とする。

| exact path（API `ai/services/ai_inference/`から） | 許可を求める変更 |
|---|---|
| `cocolon_meaning_experience_engine/engine.py` | Piece requestの明示offline＋新profileだけをdispatch。既存Emlis／Analysis／通常Pieceは維持 |
| `cocolon_meaning_experience_engine/piece_semantic_admission.py`（新規案1module） | P1材料／receipt再束縛、閉鎖候補採否、immutable snapshot、原格／scope／選択、private serialize/reload。別Engine・別作者なし |
| `cocolon_meaning_experience_engine/piece_source.py` | 新profileのsource／候補／意味対応を検証。旧`validate_piece_saved_fields`／有限再導出／選択資格を維持し、新意味を旧型へ偽装しない |
| `cocolon_meaning_experience_engine/piece_v1c.py` | 既存compiler／唯一作者に新profileの閉じたarm。全claimと保持責務からplan／本文を生成 |
| `piece_v2_content_policy.py` | 既存author-free検査に新profileの意味被覆／引数／時点／否定scope／条件／選択照合。作者再実行を独立検査の代用にしない |
| repository root `ai/tests/test_cmee_piece_semantic_snapshot.py`（新test案） | 新profile・意味変異・再読・旧Piece非影響。必要な同family fixtureは1つまで |

`piece_v2_generation.generate_piece_candidate`は現Engine結果を旧source／plan／作者で全再導出するB8接続点であり、今回は変更しない。新profileの結果を通常B8へ流さない。公開API／DTO／DB／RN／format適格性／tier／recipe／renderer／fit／quota／export、refined／補足／履歴／モデルDIは対象外。公開outcomeへ新private型を混ぜず、明示offline呼出しだけが新private結果を受け取る。新profileのplan／artifactは設計05の`PieceSemanticPlanV1`／`PieceSemanticArtifactV1`とし、claim→node／duty→実本文範囲・選択保持責務を持たせる。既存compiler／唯一作者／policy内の版分岐がこの型を扱い、別作者は作らない。旧`PieceArtifact.content_payload()`が固定で返す`piece.content_meaning.v1`は新profileへ流用しない。新しい一般checker／runnerを作らない。

### P4-3. P01-Nの必要意味・拒否変異

P2保存済み手作業packetを再利用する。モデル出力・完成native graphではない。省略主体、共同相手、絶対時点、動機は補わない。

| 対象 | 保持する内容 | 拒否する変異 |
|---|---|---|
| `p.joy` | 「助かった」と言われた本人報告、過去の嬉しさ、報告scope | 相手の本心・信頼・成長の断定、現在感情化 |
| `p.work_left`／`p.late` | 仕事の残り、帰りの遅れ、原te連結 | 手伝いが唯一原因、量・時刻追加、同時性 |
| `p.no_regret` | 「手伝ったことを後悔しているわけではない」の対象・否定scope | 「全く後悔がない」「良い経験だった」への強化 |
| `p.next` | 次回引受け未確定、その時の余裕で決めたい意向 | 引受け／拒否／決意／実行済みへの変換 |
| `p.help` | 依頼され、同僚の発表資料を一緒に直した本人報告 | 共同相手・役割・他文との実行時刻の補完 |
| `p.contrast`／`p.cooccur` | 「でも」の留保とte連結、因果未確定 | 矛盾・因果・同時性への昇格 |
| 全選択 | 喜び／不安・各weak、field／index／元値 | 選択削除、不安の理由追加、過去感情の強度への転写 |

### P4-4. 採否・private保存再開・完了／停止

採否は`ADOPTED_PROVISIONAL / HOLD / UNSUPPORTED / REJECTED`を分ける。quote一致は必要条件で意味の正しさの証明ではない。owner／版／元7field／request／参照の不一致や改変は拒否、対応未確定は保留、型・作者で全必要意味を扱えなければ未対応。成功しやすい一部だけを採用しない。

同source／同版の採用snapshotはimmutable。意味確定後／plan後／本文後の中断を隔離したprivate serialized recordで再開し、同snapshot・plan・本文hashを復元する。候補再取得、旧parserへの切戻し、保存本文の再著述で置換しない。非採用は採用snapshot／成功artifactを発行しない。実DB／Piece保存tableへの書込は0。

検証は元7field・owner・版・Unicode/UTF-8範囲と別request拒否、6claim／2関係／全選択の欠落・否定／時点／scope変異、整合再hash改変と別profile混入、実作者の本文・author-free照合、意味確定前後の中断／同一結果再読、旧profile全outcomeとB8非影響。旧期待を緩めず、必要な現行owner identityのみ実差分へ同期する。主担当が全本文を読み、復唱・定型性等を商品品質未達として記録する。

完了は限定P01-N familyを意味→plan→既存作者の実本文→同一private保存再読へ通し、非採用と旧互換を確認すること。一般日本語・自由paraphrase・モデル・通常アプリ・商品合格は含まない。別作者、新公開保存、一般unknown／conflict、新依存、契約外意味が必要ならeffect前に停止する。既存作者へ追加する有限armでも収容不可ならHOLD／UNSUPPORTEDを維持する。同範囲の内部整合修復を版数ごとの再承認へ戻さない。


<a id="cmee-p4-implemented"></a>
## 2026-10-23 — Mash承認済みP4の限定内部実装

Mashの「具体案の範囲で→進めていいよ」を受領。上のP4案は承認範囲の履歴で、同範囲を未承認へ戻さない。API開始302d122、Cocolon開始3c2fa9c、API実装[4fd8db4](https://github.com/MassyuRed/mashos-api/commit/4fd8db4f5ad24336368a63f09f9d88170ab41fa0)。新`piece_semantic_admission.py`と既存4owner（Engine/source/compiler兼作者/policy）、新test1・fixture1の計7fileを反映・全文読戻し確認済み。通常B8は変更0。

- `PieceSemanticInputV1`は明示offline Pieceだけへ渡す。実sourceからP1材料を再作成し、expected owner／record／version／stage／tierを束縛。P1 request IDにはownerが含まれないため、source snapshot・private保存requestへownerを別に含める。raw/metadataをP1受取で再検証してreceipt偽装を拒否。元receiptはNOT_ADOPTEDのまま。
- 初版はP01の閉じた構文familyだけを照合。元7field、6claimと5文、報告・否定・将来条件、留保と因果未確定のte連結をtyped bindingへ保持。仕事／帰りの2claimは同じ第二文へ対応し、原「でも」・読点を残す。一般候補／unknown/conflict/updateは未対応、必要意味の欠落・引用だけ正しい意味改変は拒否する。
- 喜び／不安weakは論理的な2選択。emotionsとemotion_detailsの両field/indexをaliasとして保持し、重複計上しない。本文に対応しない選択を別責務へ保持し、不安文・原因・過去感情の強度を足さない。新profileの自己理解選択は未対応で、旧modeを変更しない。
- 意味snapshotから既存compilerがprivate planを作り、既存唯一作者の新armが完全な原文2段落を保持する。5文のためshort_essayだけが適格で、quote／declarationを付与しない。公開payloadへ変換せず、新private meaning版を使う。既存text envelope／tier／拒否detectorは共用する。
- author-free検査はcompiler／作者を呼ばず、接続詞を含む全可視範囲・6意味とtrace・選択責務・plan／本文hashを照合する。source構文照合はadmissionと共有しており、parser独立性や一般paraphrase検証とはしない。
- private stateは意味／plan／完成本文の段階別にserialize/reloadできる。意味保存後の実作者例外→同保存から明示再開、完成後の作者／compiler／候補取得禁止再読を検証。caller-managedの隔離ファイル保存で、serviceの自動durabilityや本番DB保存ではない。本文失敗でもADOPTED_PROVISIONALのsnapshotを返し、旧本文を付けない。

最終対象7file **339 passed／FAIL0／SKIP0、38.78秒、既存warning1、34 subtestsは加算しない**。新P4／P1／旧Piece4file／既存Emlis snapshotを含み、全suite・CI・本人実機合格ではない。初回の新test構文ミス、誤ったUNSUPPORTED標本、Q2 module環境変数不足、review修復はtrial記録へ残した。旧期待やhistorical fixtureは変更0。

実本文は原文と同一の二段落。これは意味採用→本文→同一private再読の限定到達で、自然な新文章・一般理解・商品品質改善の証明ではない。全結果と型field・原packetは[実結果JSON](../../../observation_learning/trials/2026-10-23-current-four/piece_semantic_snapshot_results.json)。実モデル／推論／DB／Render／公開API/DTO／RN／preview／保存quota／fit／export／merge/deploy0。STRUCTURE_MAP_DELTA_PRESENT、限定TECHNICAL_CREDIT、product_credit=0／PRODUCT_NOT_CLEAR／正式0/3／candidate_ready=false／automatic_progression=false。P5 Analysis、通常接続、自由paraphrase、画像商品品質は残件。
