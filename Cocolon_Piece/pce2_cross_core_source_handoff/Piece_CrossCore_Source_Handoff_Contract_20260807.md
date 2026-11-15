---
doc_id: piece_crosscore_source_handoff_contract_20260807
title: "Piece cross-core source handoff contract"
created_at: "2026-08-07 JST"
revision_date: "2026-11-15 JST"
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

2026-11-15の限定実装差分は`corrected_observation`だけに追加する。normal／pre-question／refinedの既存契約と保存済みlineageは変更しない。source実装・RN境界と、検証・SQL適用・通常反映・CIの成否を分け、最終結果は[補助設計§9.72](../../Cocolon_前提資料/designs/cmee/Cocolon_CMEE_AuxiliaryAsset_Reuse_ImplementationDesign_20261108.md#piece-answer-corrections-normal-rollout-20261115)へ戻る。build／TestFlight／本人実機は保留し、新実4B・一般品質の成立へ換算しない。 8月PCE-2の`runtime binding exact0`／design-only状態と固定source refは当時の設計単位の記録として保持する。

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

supported handoff stages（normal/pre-question/refinedの初期NLS名を継承）:
  normal_observation
  pre_question_observation
  refined_observation
  corrected_observation  (2026-11-15限定追加)

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

corrected専用のprivate lineageに限り、`interpretation_correction_source`を追加する。閉じた4keysは`correction_id`、`source_version`、`explanation_commitment`、`target_event_id`。`source_version`は保存された訂正source全体のcanonical SHA-256、`explanation_commitment`は本人説明sourceのcommitmentであり、本文・AI対象引用をlineageへ保存しない。これを公開`source_ref`の追加fieldにせず、normal／refinedへ空fieldも足さない。

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
| `supplemental_answer_identity` | conditional | refinedまたは実回答を明示選択したcorrected。originalと別identity | future question owner | PCE-9C |
| `supplemental_answer_version` | conditional | 選択した実supplementalのschema/version。ANSWER0 correctedはnull | future question owner | PCE-9C |
| `supplemental_answer_bundle_commitment` | conditional | 選択した実supplemental bundle bodyへのcommitment。ANSWER0 correctedはnull | current stage-context commitment pattern | PCE-9C |
| `semantic_source_roles` | yes | stage matrixとexact一致 | new abstract owner | PCE-2 |
| `lineage_control_roles` | yes | stage matrixとexact一致 | new abstract owner | PCE-2 |
| `piece_generation_eligibility` | yes | explicit decision。missingをtrue扱いしない | future adapter decision | PCE-2 / PCE-9C |
| `interpretation_correction_source` | corrected only, private | 上記4keys exact。本人説明とAI対象controlを区別し、本文を持たない | 最新の保存済み訂正sourceとtarget OBSへの束縛。全履歴はprivate fenceで別照合 | 2026-11-15限定追加 |
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

### corrected_observation（2026-11-15限定実装）

- ANSWER0のsemantic rolesは`[original_input, interpretation_correction]`、controlsは`[emlis_observation_result, ai_interpretation_target]`を継承する。実ANSWER1〜3件と、その後のproper訂正を明示選択した場合だけ、semantic rolesを`[original_input,supplemental_answer,interpretation_correction]`、controlsを`[emlis_observation_result,question_need_decision,ai_interpretation_target]`とする。本人説明は`USER_INTERPRETATION_CORRECTION`であり、ANSWER／原入力へ偽装しない。
- `emlis_observation_result_identity`は最新CORRECTED OBS UUIDへ固定する。ANSWER0ではquestion／supplemental identity・version・commitmentは全てnull。併存時は最新の選択ANSWERと対応する実QUESTION eventのidentityを条件付きpairで持ち、private lineageにその回答version／commitmentを保持する。公開source-refの7keysは増やさず、既存`supplemental_answer_identity` queryで回答を明示選択する。元`source_input_version`／`source_input_bundle_commitment`は不変。
- COMPLETED／FINALの全実回答prefixと、その後の全訂正prefix・各受領／完了・最新OBSを照合する。回答1〜3の最新を選び、読める独立ADDまたは原入力完全節へのREVISE／WITHDRAWを対象にする。先行有効REVISEは保持するが、独立した先行ADDの本文は加えない。読める先行ADDはshared compatibility検査を継承し、opaque先行ADDは履歴controlだけ、opaque選択回答は拒否する。
- 各proper訂正は異なる原入力の完全な節を指定する単一REVISE／WITHDRAWに限定する。全履歴から残る原節・有効な本人置換・選択回答の有効部分だけを既存作者とS7へ渡す。原active節を1つ以上残し、short_essay・最大3body blockを維持する。問いの3回上限を訂正件数へ適用しない。一般自由文、回答／置換節への再訂正、既撤回節の復活、曖昧な原／回答対象、原active0／3block超過は拒否のまま。
- 元七項目、実回答、各本人説明のenvelope・絶対scalar／UTF8根拠を別々に保持する。AI訂正対象とQUESTION本文はcontrolに留め、完全引用の旧側・失効節を本人の新事実へ戻さない。安全検査は原入力・全回答・全本人説明の全文を対象とし、有効な作者範囲だけへ狭めない。
- private expected stateの`interpretation_correction`は最新source・複数時の`prior_sources`・source_prefix_ref・全events・thread_dataを持ち、併存時だけ同fence内に`answer_sources`／`answer_checkpoints`を追加する。外側の`meaning_checkpoint(s)`と混在させず、公開DTO／ログへ出さない。各prefixは実回答prefixと、その時点までの順序付き全本人訂正から独立導出する。各本人説明は直前応答の完了以降。3writerで最新選択回答・表示OBSと全履歴を再検査する。ANSWER0の既存field／bytes／identityは保持する。
- API `24bc228dbf54abc983906323c0ae7d937fae1fd6`／RN `70527711e92821c0ae6f8704be5331f6c8011147`をsource反映済み。通常DBへmigration20261115011424を適用し、API／workerとも24bc228dでLive、Piece／AnalysisとRNのCI成功を確認した。併存経路の通常DB／API反映と対応RN sourceの限定単位は完了。§9.71のANSWER0経路と通常d10c3f86の先行完了を維持する。 本契約差分はsource採用範囲の記録であり、新実4B・画像・本人利用の成功ではない。最終検証・通常適用と残差は[補助設計§9.72](../../Cocolon_前提資料/designs/cmee/Cocolon_CMEE_AuxiliaryAsset_Reuse_ImplementationDesign_20261108.md#piece-answer-corrections-normal-rollout-20261115)へ集約する。

同一saved inputのnormal／pre-question／refined／correctedの各preview／recordはexact1 stage lineageへbindする。後発の回答・訂正で既存Pieceのlineageを暗黙更新しない。

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
9. correctedでは初回訂正sourceと現在CORRECTED OBS、説明の有効範囲、private4key lineageが一致し、question／supplemental4項目はnullである。表示資格だけで成立させず、保存chainとsource fenceを既存ownerで再検証する。

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

### corrected

保存原入力→INITIAL OBS→本人の対象付き二入力訂正を別sourceで保存→同prefixのCORRECTED OBS受領・完了→corrected handoff→本人の明示Piece要求、の順序を保持する。新訂正が入った場合は古い画面要求を現在sourceへ置換しない。

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
corrected-only private interpretation_correction_source four-key binding
semantic roles
lineage control roles
eligibility decision identity / reason codes
body_free marker
```

保存してはいけないもの:

```text
raw input body
raw correction explanation / AI target excerpt
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
