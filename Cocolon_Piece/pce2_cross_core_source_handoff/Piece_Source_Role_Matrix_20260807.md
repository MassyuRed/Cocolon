---
doc_id: piece_source_role_matrix_20260807
title: "Piece cross-core source role matrix"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece / EmlisAI / Analysis"
phase: "PCE-2 Cross-Core Source Handoff"
document_status: "PCE2_COMPLETE_DESIGN_ONLY"
contract_id: "cocolon.cross_core.source_role_matrix.v1"
parent_contract_id: "cocolon.cross_core.source_handoff.v1"
source_cocolon_head: "1ea6fe60a2b43c11d02f15c63babf4ce0b75a469"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
automatic_progression: false
production_effect: "exact0"
---

# Piece cross-core source role matrix

## 1. role class

PCE-2では、`source role`を一つの配列へ潰さず、次の2 classへ分ける。

```text
semantic source role:
  Piece content ownerが、認証済みsource bodyを読むためのrole。

lineage control role:
  stage / ordering / admissionを証明するidentity。
  Piece本文の意味材料にはしない。
```

## 2. canonical roles

| role | class | body owner | normal | pre-question | refined | Piece text material | persisted body-free lineage |
|---|---|---|---:|---:|---:|---:|---:|
| `original_input` | semantic | saved input owner | exact1 | exact1 | exact1 | allowed | required |
| `supplemental_answer` | semantic | question / answer owner | exact0 | exact0 | exact1 | allowed only as separate role | conditional required |
| `emlis_observation_result` | control | Emlis result owner | exact1 | exact1 | exact1 | forbidden | required |
| `question_need_decision` | control | question system owner | exact0 | exact1 | exact1 | forbidden | conditional required |
| `piece_generation_eligibility` | control | cross-core adapter | exact1 | exact1 | exact1 | forbidden | required |
| `analysis_inference` | forbidden | Analysis | exact0 | exact0 | exact0 | forbidden | forbidden |
| `analysis_route` | forbidden | Analysis | exact0 | exact0 | exact0 | forbidden | forbidden |
| `simulated_route` | forbidden | simulation owner | exact0 | exact0 | exact0 | forbidden | forbidden |
| `emlis_visible_body` | forbidden | Emlis surface owner | exact0 | exact0 | exact0 | forbidden | forbidden |
| `emlis_internal_artifact` | forbidden | Emlis internal owner | exact0 | exact0 | exact0 | forbidden | forbidden |
| `public_hidden_meta` | forbidden | public boundary owner | exact0 | exact0 | exact0 | forbidden | forbidden |

## 3. original_input

```text
cardinality:
  exact1 in every supported stage

identity:
  source_input_id
  source_input_version
  source_input_bundle_commitment

ownership:
  saved source owner

control-plane owner:
  yes

overwrite:
  prohibited
```

`original_input`は、current user inputの保存正本である。Piece textはoriginal bodyそのものでも短縮copyでもないが、Piece content ownerがmeaningを組み立てるprimary source rootである。

次を禁止する。

- raw client payloadだけで成功する。
- Emlis visible bodyをoriginalの代替にする。
- supplemental answerをoriginal identityへ書き戻す。
- Analysis outputをoriginal inputとして扱う。
- simulated routeをobserved inputとして扱う。

## 4. supplemental_answer

```text
cardinality:
  normal exact0
  pre-question exact0
  refined exact1

identity:
  supplemental_answer_identity
  supplemental_answer_version
  supplemental_answer_bundle_commitment

ownership:
  question / answer owner

control-plane owner:
  no
```

refined stageでは、supplemental answerをoriginalと別のsemantic partitionとして扱う。

必須条件:

1. originalと別identityである。
2. originalと別commitmentである。
3. corresponding `question_need_decision_identity`が存在する。
4. refined Emlis result identityが両commitmentにbindされる。
5. source roleを失わず、本文生成後もlineageへ残る。
6. originalの欠落を補うplaceholderとして使わない。

## 5. question_need_decision

```text
class:
  lineage control only

semantic source:
  false

required:
  pre-question exact1
  refined exact1

forbidden:
  normal
```

question need decisionは、なぜfuture stageへ進んだかを証明するcontrol-plane identityである。質問本文、回答候補、判断理由をPiece contentへ渡さない。

current Emlis NLS v3でも、refined source partitionはquestion decisionをsemantic sourceではないと扱う。PCE-2はこの境界をcross-core contractへ継承する。

## 6. emlis_observation_result

```text
class:
  lineage control only

required:
  exact1 in all stages

fields:
  emlis_observation_stage
  emlis_observation_result_identity
  emlis_observation_result_state
```

Emlis result identityは、次を証明する。

- exact source commitmentに対する結果である。
- exact stageに対する結果である。
- terminal stateへ到達した。
- Piece eligibility発行より前に成立した。

証明しないもの:

- Emlis visible textがPiece textに適している。
- Emlis内部artifactをPieceが読める。
- Analysisが完了した。
- Piece content safetyが成立した。

## 7. piece_generation_eligibility

```text
class:
  lineage control only

contract:
  piece.generation_eligibility.v1

decision:
  eligible | ineligible

missing default:
  ineligible
```

decision ownerは上位cross-core adapterである。Emlis内部module、Piece generation owner、RN clientのいずれも独断でtrueへ変えない。

`eligible`はsource handoff admissionであり、quota、visibility、format、public safety、render成功を意味しない。

## 8. stage matrix

| invariant | normal | pre-question | refined |
|---|---:|---:|---:|
| original input identity | exact1 | exact1 | exact1 |
| original bundle commitment | exact1 | exact1 | exact1 |
| Emlis result identity | exact1 | exact1 | exact1 |
| terminal success required for eligibility | yes | yes | yes |
| question decision identity | exact0 | exact1 | exact1 |
| supplemental identity | exact0 | exact0 | exact1 |
| supplemental bundle commitment | exact0 | exact0 | exact1 |
| semantic roles | `[original]` | `[original]` | `[original,supplemental]` |
| original remains root | yes | yes | yes |
| answer assumed | no | no | yes, separately saved |
| Analysis dependency | exact0 | exact0 | exact0 |

## 9. identity / body matrix

| material | handoff may carry | Piece source_lineage may persist | Piece content owner may retrieve body | public API exposure fixed by PCE-2 |
|---|---:|---:|---:|---:|
| source input ID/version/commitment | yes | yes | ID-authorized only | no |
| original input body | no | no | yes, internal authorized retrieval | no |
| supplemental ID/version/commitment | refined only | refined only | refined internal retrieval | no |
| supplemental body | no | no | refined internal retrieval | no |
| question decision identity | conditional | conditional | no body retrieval for Piece | no |
| question decision body | no | no | no | no |
| Emlis result identity/state | yes | yes | no body retrieval for Piece | no |
| Emlis visible body | no | no | no | no |
| Analysis identity/result | no | no | no | no |
| eligibility decision/reasons | yes | yes | no body | no |

PCE-2はpublic response shapeを変更しない。将来publicへ必要な最小CTA materialはPCE-6で別に決める。

## 10. owner equality

```text
saved_input.owner_user_id
  == requested Piece.owner_user_id
  == authenticated principal
```

このequalityを満たさないsource referenceは、bodyを読まずにrejectする。RNから送られたowner IDだけで成立させない。

supplemental answerも同じauthenticated principalへbindされなければならない。cross-user original/supplemental combinationは禁止する。

## 11. version and immutability

```text
source_input_version:
  source bundle schema version

source_input_bundle_commitment:
  exact source body version identity

record mutation:
  commitmentが変われば別source versionとして扱う。
  existing Piece lineageを暗黙更新しない。
```

現在のadapter candidateは`emlis.current_input_bundle.v1`である。将来saved source schemaが変わる場合、旧versionの意味を上書きせず、新versionを追加する。

## 12. Analysis reuse boundary

Analysis roadmapが再利用してよいもの:

```text
source_input_id / version / commitment semantics
original / supplemental role separation
stage names
event ordering
owner equality
body-free lineage
negative codes
```

再利用してはいけないもの:

```text
Piece eligibilityをAnalysis eligibilityへ流用する
Piece textをAnalysis factにする
Analysis routeをPiece sourceにする
Piece lifecycle / visibility / quotaをAnalysisへ持ち込む
```

## 13. closure

```text
SEMANTIC_AND_CONTROL_ROLES_SEPARATED
ORIGINAL_INPUT_EXACT1_ALL_STAGES
SUPPLEMENTAL_ANSWER_REFINED_EXACT1_ONLY
QUESTION_DECISION_CONTROL_ONLY
EMLIS_RESULT_CONTROL_ONLY
ANALYSIS_ROLE_IN_PIECE_SOURCE_EXACT0
SIMULATED_ROLE_IN_OBSERVED_SOURCE_EXACT0
CROSS_USER_SOURCE_REFERENCE_FORBIDDEN
SOURCE_BODY_IN_LINEAGE_EXACT0
PCE2_SOURCE_ROLE_MATRIX_COMPLETE_DESIGN_ONLY
```
