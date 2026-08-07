---
doc_id: piece_crosscore_source_handoff_contract_20260807
title: "Piece cross-core source handoff contract"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece / EmlisAI / Analysis"
phase: "PCE-2 Cross-Core Source Handoff"
document_status: "PCE2_COMPLETE_DESIGN_ONLY"
cross_core_contract_id: "cocolon.cross_core.source_handoff.v1"
piece_lineage_contract_id: "piece.source_lineage.v1"
source_cocolon_head: "1ea6fe60a2b43c11d02f15c63babf4ce0b75a469"
source_cocolon_tree: "e77b60576e0437061ea0ff06714d8959e24fc1dc"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
source_roadmap_sha256: "2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939"
automatic_progression: false
production_effect: "exact0"
---

# Piece cross-core source handoff contract

## 1. 結論

```text
cross-core contract:
  cocolon.cross_core.source_handoff.v1

Piece persistence projection:
  piece.source_lineage.v1

connection model:
  saved inputを共通source rootにする。
  EmlisAI / Piece / Analysisを内部統合しない。
  上位flowのbody-free handoffで接続する。

runtime binding:
  PCE-2ではexact0
  PCE-9Cでcurrent ownerへbindする
```

責任分離は次で固定する。

```text
saved input owner:
  user inputの保存正本とbody取得権限を持つ。

EmlisAI:
  current input observationを所有する。
  observation result identityとstage lineageをhandoffへ渡せる。
  visible bodyをPiece sourceとして渡さない。

Piece:
  saved input sourceを起点にexpression / preview / save / shareを所有する。
  Emlisの文章を再利用せず、Piece固有のcontent / safety ownerでpiece_textを作る。

Analysis:
  period observation / current routeを所有する。
  Piece生成の前提にならず、Analysis inferenceをPiece sourceへ渡さない。
```

## 2. actual basisとabstract boundary

current actualで確認したbasis:

```text
saved row identity:
  /emotion/submit insert resultのemotions.id

current normalized input bundle:
  emlis.current_input_bundle.v1

current input bundle identity fields:
  source_record_id <- saved row id
  selected_at      <- saved row created_at

current NLS stage names:
  normal_observation
  pre_question_observation
  refined_observation

current stage context:
  original / question decision / supplementalをbody-free commitmentで分離する。

current public-safe result material:
  observation_trace_id or trace_id
  observation_status
```

PCE-2は上記actualを根拠にするが、次を固定しない。

```text
exact Python import
exact API response key
exact DB table / column binding
question system runtime owner
supplemental answer storage path
RN hook
public route
```

それらはPCE-9C / PCE-6の別設計・実装authorityでcurrent headへbindする。

## 3. canonical body-free handoff envelope

```json
{
  "handoff_contract_version": "cocolon.cross_core.source_handoff.v1",
  "piece_source_lineage_version": "piece.source_lineage.v1",
  "source_input": {
    "source_input_id": "<opaque-saved-input-id>",
    "source_input_version": "emlis.current_input_bundle.v1",
    "source_input_bundle_commitment": "sha256:<lowercase-64-hex>",
    "source_owner_user_id": "<internal-owner-id>",
    "source_recorded_at": "<RFC3339>"
  },
  "observation": {
    "emlis_observation_stage": "normal_observation",
    "emlis_observation_result_identity": "<opaque-body-free-id>",
    "emlis_observation_result_state": "terminal_success",
    "question_need_decision_identity": null,
    "supplemental_answer_identity": null,
    "supplemental_answer_version": null,
    "supplemental_answer_bundle_commitment": null
  },
  "semantic_source_roles": [
    "original_input"
  ],
  "lineage_control_roles": [
    "emlis_observation_result"
  ],
  "piece_generation_eligibility": {
    "contract_version": "piece.generation_eligibility.v1",
    "decision": "eligible",
    "reason_codes": []
  },
  "body_free": true
}
```

このenvelopeはbodyを保存しない。source bodyは認証済みownerからIDで取得し、handoffにはidentity、version、commitment、role、stage、terminal stateだけを置く。

## 4. field contract

| field | required | invariant | current mapping candidate | final binding |
|---|---:|---|---|---|
| `handoff_contract_version` | yes | exact `cocolon.cross_core.source_handoff.v1` | new abstract owner | PCE-2 |
| `piece_source_lineage_version` | yes | exact `piece.source_lineage.v1` | PieceRecord `source_lineage` | PCE-2 / PCE-6 |
| `source_input_id` | yes | 保存成功済みrecordのopaque stable identity。raw payloadだけでは不可 | `emotions.id` | PCE-9C |
| `source_input_version` | yes | source bundle schema version。record本文revisionの代替にしない | `emlis.current_input_bundle.v1` | PCE-2 / PCE-9C |
| `source_input_bundle_commitment` | yes | canonical source bundle bytesへのSHA-256 commitment | current `artifact_sha256`相当 | PCE-9C |
| `source_owner_user_id` | yes, internal | Piece ownerとexact一致。client申告を信用しない | saved row `user_id` | PCE-9C / PCE-6 |
| `source_recorded_at` | yes | saved inputのrecorded time。event ordering補助 | inserted `created_at` | PCE-9C |
| `emlis_observation_stage` | yes | supported stage exact1 | current NLS stage context | PCE-2 / PCE-9C |
| `emlis_observation_result_identity` | yes | same source commitment + same stageにboundされたbody-free identity | `observation_trace_id` / `trace_id` candidate | PCE-9C |
| `emlis_observation_result_state` | yes | `terminal_success` or `terminal_nonadmitting` | `passed` -> success; other terminal public states -> nonadmitting candidate | PCE-2 / PCE-9C |
| `question_need_decision_identity` | conditional | control lineage only。semantic sourceにしない | current decision commitment candidate | PCE-9C |
| `supplemental_answer_identity` | conditional | refined only。originalと別identity | future question owner | PCE-9C |
| `supplemental_answer_version` | conditional | refined supplemental schema/version | future question owner | PCE-9C |
| `supplemental_answer_bundle_commitment` | conditional | refined bundle bodyへのcommitment | current stage-context commitment pattern | PCE-9C |
| `semantic_source_roles` | yes | stage matrixとexact一致 | new abstract owner | PCE-2 |
| `lineage_control_roles` | yes | stage matrixとexact一致 | new abstract owner | PCE-2 |
| `piece_generation_eligibility` | yes | explicit decision。missingをtrue扱いしない | future adapter decision | PCE-2 / PCE-9C |
| `body_free` | yes | exact `true` | current body-free artifactsと同原則 | PCE-2 |

## 5. stage contract

### normal_observation

```text
semantic source:
  original_input exact1

control lineage:
  emlis_observation_result exact1

question_need_decision:
  exact0

supplemental_answer:
  exact0
```

### pre_question_observation

```text
semantic source:
  original_input exact1

control lineage:
  emlis_observation_result exact1
  question_need_decision exact1

supplemental_answer:
  exact0

invariant:
  answerが既にある前提にしない。
  question need decisionをユーザー発言として扱わない。
```

### refined_observation

```text
semantic source:
  original_input exact1
  supplemental_answer exact1

control lineage:
  emlis_observation_result exact1
  question_need_decision exact1

invariant:
  originalとsupplementalのidentity / commitmentを分離する。
  supplementalでoriginalを上書きしない。
  originalがcontrol-plane rootであり続ける。
```

同一saved inputについてnormal / pre-question / refinedの複数lineageが成立しても、各Piece preview / recordはexact1 stage lineageへbindする。後発refined lineageで、既存Piece recordのsource lineageを暗黙更新しない。

## 6. eligibility contract

```text
contract:
  piece.generation_eligibility.v1

decision:
  eligible | ineligible
```

`eligible`になるためのPCE-2 structural条件:

1. `source_input_id`、version、commitmentが全て存在する。
2. saved source ownerとPiece ownerが一致する。
3. stageがsupported exact1である。
4. semantic / control rolesがstage matrixとexact一致する。
5. Emlis result identityが同じsource commitmentとstageにbindされる。
6. result stateが`terminal_success`である。
7. forbidden body / role / cross-core sourceがexact0である。
8. refinedではquestion decisionとsupplemental identity/version/commitmentが全て存在し、originalと別identityである。

`terminal_nonadmitting`、missing、unknown、role mismatchは`ineligible`である。Piece側はeligibilityを再推測せず、missing / falseをfail-closedで扱う。

このeligibilityは、source handoffへ入れるかどうかだけを決める。次は保証しない。

```text
Piece content safety:
  PCE-4

quota / plan:
  PCE-3

visibility:
  PCE-3

format selection:
  PCE-4

render/export:
  PCE-5
```

## 7. cross-core event ordering

### normal

```text
S0 saved input committed
-> E0 normal Emlis observation terminal
-> H0 body-free handoff eligibility issued
-> P0 Piece preview may start
```

### pre-question

```text
S0 saved input committed
-> Q0 question-need decision committed
-> E1 pre-question observation terminal
-> H1 original-only handoff eligibility issued
-> P1 Piece preview may start without an answer
```

### refined

```text
S0 saved input committed
-> Q0 question-need decision committed
-> A0 supplemental answer committed separately
-> E2 refined observation terminal for exact original + supplemental commitments
-> H2 two-role handoff eligibility issued
-> P2 Piece preview may start
```

Analysis may start from `S0` under its own contract before or after the Piece branch. Analysis completion, Analysis result, Piece preview, Piece saveのいずれも、他方の成功条件にしない。

## 8. Piece persistence projection

`piece.record.v2.source_lineage`へ保存してよいもの:

```text
contract/version IDs
source input ID / version / commitment
source recorded time
observation stage / result identity / terminal state
conditional question decision identity
conditional supplemental identity / version / commitment
semantic roles
lineage control roles
eligibility decision identity / reason codes
body_free marker
```

保存してはいけないもの:

```text
raw input body
Emlis visible comment_text
Emlis human-follow text / temperature
Emlis internal obligation / AST / candidate body
question decision body
Analysis inference / route body
simulated route
hidden public meta fields
credential / token / contact data
```

`source_owner_user_id`はPiece `owner_user_id`とのinternal equality checkに使う。public projectionへ重複露出させない。

## 9. runtime split

```text
PCE-2:
  abstract schema
  source roles
  stage matrix
  eligibility semantics
  event ordering
  privacy / body-free boundary
  negative codes

PCE-9C:
  current saved-input ownerへのexact adapter
  current Emlis result ownerへのexact adapter
  question / supplemental ownerへのexact adapter
  CTA eligibility binding
  deterministic tests

PCE-6:
  PieceRecord persistence / API / RN projection

PCE-7:
  RED / integration / monitoring proof
```

PCE-2成果物をruntime import path、public API、DB migrationとして扱わない。

## 10. completion

```text
CROSS_CORE_HANDOFF_CONTRACT_FIXED
SAVED_INPUT_IDENTITY_REQUIRED
CURRENT_INPUT_BUNDLE_VERSION_MAPPED
ORIGINAL_SOURCE_EXACT1_ALL_STAGES
SUPPLEMENTAL_REFINED_ONLY_EXACT1
QUESTION_DECISION_CONTROL_ONLY
EMLIS_VISIBLE_BODY_COPY_FORBIDDEN
ANALYSIS_INFERENCE_SOURCE_FORBIDDEN
PIECE_ANALYSIS_MUTUAL_COMPLETION_DEPENDENCY_EXACT0
BODY_FREE_LINEAGE_REQUIRED
RUNTIME_BINDING_EXACT0
PCE2_COMPLETE_DESIGN_ONLY
AUTOMATIC_PROGRESSION_FALSE
```
