---
doc_id: piece_forbidden_mixing_negative_contract_20260807
title: "Piece cross-core forbidden mixing negative contract"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece / EmlisAI / Analysis"
phase: "PCE-2 Cross-Core Source Handoff"
document_status: "PCE2_COMPLETE_DESIGN_ONLY"
contract_id: "cocolon.cross_core.forbidden_mixing.v1"
parent_contract_id: "cocolon.cross_core.source_handoff.v1"
source_cocolon_head: "1ea6fe60a2b43c11d02f15c63babf4ce0b75a469"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
automatic_progression: false
production_effect: "exact0"
---

# Piece cross-core forbidden mixing negative contract

## 1. purpose

このcontractは、EmlisAI / Piece / Analysis / simulationを上位flowで接続しながら、本文、source role、owner、stage、completion dependencyを混ぜないためのfail-closed negative contractである。

```text
negative contract:
  cocolon.cross_core.forbidden_mixing.v1

failure effect:
  no Piece handoff admission
  no successful Piece preview
  no successful Piece record
  no automatic fallback to old Q&A
```

PCE-2ではtestを実行しない。PCE-7がこのcode catalogをRED / contract testへ落とし、PCE-9Cがadapter testへbindする。

## 2. failure response invariant

negative codeが一つでも成立した場合:

1. `piece_generation_eligibility.decision = ineligible`。
2. Piece generation ownerへsource bodyを渡さない。
3. Emlis body、Analysis body、supplemental bodyをerrorへ含めない。
4. success record、success event、success metricを作らない。
5. old Q&A generationへfallbackしない。
6. retryabilityはcode別に後続で定義するが、同requestで推測補完しない。
7. body-free codeとidentityだけをmonitoring候補にする。
8. quota effectはPCE-3 contractに従い、PCE-2だけで消費済みにしない。

## 3. identity failures

| code | trigger | required action |
|---|---|---|
| `PCE2_SOURCE_INPUT_ID_MISSING` | saved source identity absent | reject before body read |
| `PCE2_SOURCE_INPUT_VERSION_MISSING` | source schema version absent | reject |
| `PCE2_SOURCE_INPUT_COMMITMENT_MISSING` | source bundle commitment absent | reject |
| `PCE2_SOURCE_INPUT_COMMITMENT_INVALID` | malformed / mismatch commitment | reject; no body echo |
| `PCE2_SOURCE_RECORD_NOT_SAVED` | raw request only、saved record未成立 | reject |
| `PCE2_SOURCE_OWNER_MISMATCH` | saved owner != Piece owner/auth principal | reject and audit body-free |
| `PCE2_CROSS_USER_SOURCE_COMBINATION` | original / supplemental owner differs | reject |
| `PCE2_RESULT_IDENTITY_MISSING` | Emlis result identity absent | reject |
| `PCE2_RESULT_SOURCE_BINDING_MISMATCH` | result identity binds other source commitment | reject |
| `PCE2_RESULT_STAGE_BINDING_MISMATCH` | result identity binds other stage | reject |
| `PCE2_RESULT_NOT_TERMINAL` | pending / unknown result | reject |
| `PCE2_RESULT_TERMINAL_NONADMITTING` | terminal nonadmitting state | ineligible |

## 4. stage / role failures

| code | trigger | required action |
|---|---|---|
| `PCE2_STAGE_UNSUPPORTED` | stage outside exact3 | reject |
| `PCE2_NORMAL_CONTROL_ROLE_MISMATCH` | normalにquestion decision等がある | reject |
| `PCE2_NORMAL_SUPPLEMENT_FORBIDDEN` | normalにsupplementalがある | reject |
| `PCE2_PREQUESTION_DECISION_MISSING` | pre-questionでdecision identity absent | reject |
| `PCE2_PREQUESTION_SUPPLEMENT_FORBIDDEN` | pre-questionでanswerを仮定 | reject |
| `PCE2_REFINED_DECISION_MISSING` | refinedでdecision identity absent | reject |
| `PCE2_REFINED_SUPPLEMENT_MISSING` | refinedでsupplemental identity/version/commitment不足 | reject |
| `PCE2_REFINED_SOURCE_ALIAS_COLLISION` | originalとsupplemental identity/commitmentが同一 | reject |
| `PCE2_ORIGINAL_SOURCE_NOT_EXACT1` | original role missing or duplicate | reject |
| `PCE2_SUPPLEMENTAL_OVERWRITES_ORIGINAL` | original lineage/bodyをanswerで置換 | reject |
| `PCE2_QUESTION_DECISION_USED_AS_SEMANTIC_SOURCE` | decision body/identityを本文材料化 | reject |
| `PCE2_ROLE_SET_MISMATCH` | semantic/control role setがstage matrixと不一致 | reject |

## 5. body / privacy failures

| code | trigger | required action |
|---|---|---|
| `PCE2_HANDOFF_BODY_FREE_REQUIRED` | envelope `body_free != true` | reject |
| `PCE2_RAW_INPUT_BODY_EMBEDDED` | raw input text/bodyがlineageへ入る | reject; do not log body |
| `PCE2_SUPPLEMENTAL_BODY_EMBEDDED` | answer bodyがlineageへ入る | reject |
| `PCE2_EMLIS_VISIBLE_BODY_REUSED` | `comment_text`等をPiece source/contentへcopy | reject |
| `PCE2_EMLIS_HUMAN_FOLLOW_BODY_REUSED` | reception / temperature等をcopy | reject |
| `PCE2_EMLIS_INTERNAL_ARTIFACT_REUSED` | obligation / AST / candidate / hidden metaを使用 | reject |
| `PCE2_QUESTION_DECISION_BODY_EMBEDDED` | question/decision bodyをlineageへ保存 | reject |
| `PCE2_CREDENTIAL_OR_CONTACT_DATA_EMBEDDED` | token/profile/contactをsource lineageへ含む | reject |
| `PCE2_PUBLIC_LINEAGE_OVEREXPOSURE` | internal source IDs/owner dataをpublicへ無設計露出 | reject / fail closed |

forbidden key / marker familyの最低線:

```text
raw_input
raw_body
comment_text
observation_text
reception_text
human_follow
candidate_body
obligation_body
ast
private_note
credential
access_token
email
phone
```

単なるkey-name filterだけを完全なprivacy proofにしない。PCE-7ではvalue-level leak testとallowlist shape testを両方持つ。

## 6. cross-core mixing failures

| code | trigger | required action |
|---|---|---|
| `PCE2_ANALYSIS_INFERENCE_AS_PIECE_SOURCE` | Analysis inferenceをsemantic sourceにする | reject |
| `PCE2_ANALYSIS_ROUTE_AS_ORIGINAL_INPUT` | current routeをuser input扱い | reject |
| `PCE2_SIMULATED_ROUTE_AS_OBSERVED_SOURCE` | simulationをobserved input扱い | reject |
| `PCE2_PIECE_TEXT_AS_ANALYSIS_FACT` | Piece表現文をAnalysis observed factへ昇格 | reject downstream claim |
| `PCE2_ANALYSIS_COMPLETION_REQUIRED_FOR_PIECE` | Analysis完了をPiece admission条件にする | contract violation |
| `PCE2_PIECE_COMPLETION_REQUIRED_FOR_ANALYSIS` | Piece完了をAnalysis更新条件にする | contract violation |
| `PCE2_EMLIS_FORMAT_OWNER_ABSORBS_PIECE` | Piece format/safetyをEmlis内部ownerへ入れる | contract violation |
| `PCE2_PIECE_VISIBILITY_OR_QUOTA_IN_EMLIS_META` | Piece stateをEmlis metaへ混ぜる | contract violation |
| `PCE2_CROSS_CORE_CIRCULAR_DEPENDENCY` | Emlis/Piece/Analysisが相互成功待ち | reject design / STOP |

## 7. ordering / admission failures

| code | trigger | required action |
|---|---|---|
| `PCE2_HANDOFF_BEFORE_SOURCE_COMMIT` | saved input成立前にhandoff | reject |
| `PCE2_HANDOFF_BEFORE_RESULT_TERMINAL` | Emlis terminal前にeligibility true | reject |
| `PCE2_REFINED_BEFORE_SUPPLEMENT_COMMIT` | answer保存前にrefined lineage | reject |
| `PCE2_ELIGIBILITY_MISSING` | eligibility object absent | ineligible |
| `PCE2_ELIGIBILITY_UNKNOWN_TREATED_TRUE` | unknown/defaultをtrue扱い | reject |
| `PCE2_ELIGIBILITY_REASON_INVALID` | reason code非allowlist / body含有 | reject |
| `PCE2_EXISTING_LINEAGE_IMPLICITLY_REBOUND` | later refined resultで既存Piece sourceを上書き | reject |
| `PCE2_OLD_QNA_FALLBACK_ACTIVATED` | failure時に旧Q&Aへ戻る | reject |

## 8. owner / phase failures

| code | trigger | required action |
|---|---|---|
| `PCE2_RUNTIME_OWNER_BOUND_EARLY` | PCE-2でexact import/API/DB hookをcurrent owner化 | STOP as scope violation |
| `PCE2_IMPLEMENTATION_EFFECT_NONZERO` | source/API/RN/DB/runtime変更が発生 | STOP |
| `PCE2_EMLIS_TECHNICAL_STATE_MUTATED` | Emlis authority/STOP/creditを変更 | STOP |
| `PCE2_ANALYSIS_CONTRACT_REDEFINED_SEPARATELY` | common source boundaryと競合する別定義 | STOP |
| `PCE2_AUTOMATIC_PROGRESSION_ATTEMPTED` | PCE-3/Analysis workを自動開始 | STOP |

## 9. acceptance matrix

PCE-7 / PCE-9Cで最低限固定するnegative examples:

1. source IDなしでraw payloadを送る。
2. normalへsupplemental identityを付ける。
3. pre-questionへanswerを付ける。
4. refinedでsupplementalを欠落させる。
5. originalとsupplementalを同じidentityにする。
6. Emlis `comment_text`をPiece bodyへcopyする。
7. question decisionをsemantic sourceにする。
8. Analysis routeをoriginalとして渡す。
9. private owner Aのsourceをowner BのPieceへ渡す。
10. result identityを別input commitmentへ差し替える。
11. terminal result前にeligibility trueを出す。
12. unavailable/rejected/safety-blocked相当をterminal successへ誤mapする。
13. later refined lineageで既存recordを暗黙更新する。
14. failure時にold Q&A routeへfallbackする。
15. error / metricへsource bodyを含める。
16. Analysis完了待ちでPieceを止める。
17. Piece完了待ちでAnalysisを止める。
18. public responseへinternal owner/source identityを無設計露出する。

## 10. STOP boundary

PCE-2 completionを主張せずSTOPする条件:

```text
saved input identityをcurrent actualから確認できない
original / supplementalをrefinedで分離できない
Emlis bodyを使わないとPiece source contractが成立しない
Analysis inferenceを除外するとPieceが成立しない
body-free envelopeでowner / stage / result bindingを表現できない
PCE-2 design-only範囲でruntime変更が必要になる
```

今回のactual確認では、saved row ID、current input bundle version、body-free stage commitments、refined source partitionが存在するため、このSTOP条件は成立しない。

## 11. closure

```text
NEGATIVE_CODE_CATALOG_FIXED
FAIL_CLOSED_ADMISSION_FIXED
RAW_INPUT_BODY_IN_LINEAGE_EXACT0
EMLIS_VISIBLE_BODY_REUSE_EXACT0
ANALYSIS_INFERENCE_AS_SOURCE_EXACT0
SIMULATED_ROUTE_AS_OBSERVED_EXACT0
ORIGINAL_SUPPLEMENTAL_COLLAPSE_EXACT0
CROSS_USER_SOURCE_REFERENCE_EXACT0
OLD_QNA_FAILURE_FALLBACK_EXACT0
RUNTIME_BINDING_EXACT0
PCE2_FORBIDDEN_MIXING_COMPLETE_DESIGN_ONLY
```
