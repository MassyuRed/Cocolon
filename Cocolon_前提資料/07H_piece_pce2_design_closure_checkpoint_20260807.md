---
doc_id: piece_pce2_design_closure_checkpoint_20260807
title: "Piece PCE-2 cross-core source handoff design closure checkpoint"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece / EmlisAI / Analysis"
checkpoint_type: "PCE2_DESIGN_ONLY_CLOSURE"
baseline_cocolon_head: "1ea6fe60a2b43c11d02f15c63babf4ce0b75a469"
baseline_cocolon_tree: "e77b60576e0437061ea0ff06714d8959e24fc1dc"
design_publication_commit: "499e2e45bdfe3dc03061f18f3fc85f0fb2a3ef43"
design_publication_tree: "ba09b5a758519c6eaf97c3c13c40608c3f6ed343"
pce0_complete: true
pce1_complete: true
pce2_complete: true
pce3_activated: false
analysis_roadmap_activated: false
automatic_progression: false
production_effect: "exact0"
---

# Piece PCE-2 cross-core source handoff design closure checkpoint

## 1. Closure result

Mashが承認した次のdesign-only作業を完了した。

```text
PCE2_CROSS_CORE_SOURCE_HANDOFF_ABSTRACT_CONTRACT_DESIGN_ONLY
```

current state:

```text
PCE-0 Current Contract Pin:
  COMPLETE

PCE-1 Piece Identity / Clean Cutover Decision:
  COMPLETE_DESIGN_ONLY

PCE-2 Cross-Core Source Handoff:
  COMPLETE_DESIGN_ONLY

Analysis Pro-First roadmap:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

PCE-3 Record Lifecycle / Visibility / Quota:
  NOT_ACTIVATED
  QUEUED

automatic progression:
  false
```

## 2. Fixed contract identities

```text
cross-core handoff:
  cocolon.cross_core.source_handoff.v1

Piece source lineage:
  piece.source_lineage.v1

source role matrix:
  cocolon.cross_core.source_role_matrix.v1

forbidden mixing:
  cocolon.cross_core.forbidden_mixing.v1

Piece generation eligibility:
  piece.generation_eligibility.v1
```

## 3. Responsibility separation

```text
saved input:
  common source root
  body owner and authenticated retrieval boundary

EmlisAI:
  current input observation
  stage and result lineage control only
  visible body is not Piece source

Piece:
  expression / preview / save / share
  Piece-owned content and safety transformation

Analysis:
  period observation / current route
  no inference into Piece source
  no mutual completion dependency with Piece
```

EmlisAI、Piece、Analysisは内部統合せず、body-free handoffによる上位flowで接続する。

## 4. Current actual basis

```text
Cocolon basis head / tree:
  1ea6fe60a2b43c11d02f15c63babf4ce0b75a469
  e77b60576e0437061ea0ff06714d8959e24fc1dc

mashos-api basis head / tree:
  315813c7bd3372462de926ddad74df567254a6b5
  a641510e107d52bb910073f36604c85bd57af150

saved source identity candidate:
  /emotion/submit inserted emotions.id

normalized source bundle version:
  emlis.current_input_bundle.v1

stage evidence owner:
  ai/services/ai_inference/emlis_ai_observation_stage_context_v3.py

refined source partition evidence owner:
  ai/services/ai_inference/emlis_ai_refined_source_partition_v3.py

body-free result identity candidates:
  observation_trace_id
  trace_id
```

These are current mapping candidates. Exact Python import、API key、DB binding、question/supplemental owner、RN hook、public routeはPCE-2ではbindしていない。

## 5. Stage and source-role matrix

```text
normal_observation:
  semantic original_input exact1
  Emlis result control exact1
  question decision exact0
  supplemental exact0

pre_question_observation:
  semantic original_input exact1
  Emlis result control exact1
  question decision control exact1
  supplemental exact0

refined_observation:
  semantic original_input exact1
  semantic supplemental_answer exact1
  Emlis result control exact1
  question decision control exact1
  original / supplemental identity and commitment remain separate
```

All eligible handoffs require saved source ID/version/commitment、same-owner binding、supported stage exact1、Emlis result identity、terminal success、exact role set、explicit eligibility。Missing / unknown / mismatchはineligibleである。

## 6. Body-free and forbidden-mixing boundary

Piece source_lineageへ保存してよいもの:

```text
contract and version IDs
source input ID / version / commitment
source recorded time
observation stage / result identity / terminal state
conditional question decision identity
conditional supplemental identity / version / commitment
semantic roles
lineage control roles
eligibility identity / decision / reason codes
body_free marker
```

保存・再利用してはいけないもの:

```text
raw input body
Emlis visible comment_text
Emlis reception / human-follow body
Emlis internal obligation / AST / candidate body
question decision body
Analysis inference / route body
simulated route
hidden public meta fields
credential / token / contact data
```

Failure時にold Q&A generationへfallbackしない。

## 7. Design artifacts and verified blobs

| path | UTF-8 bytes | SHA-256 | Git blob SHA-1 |
|---|---:|---|---|
| `Cocolon_Piece/pce2_cross_core_source_handoff/Piece_CrossCore_Source_Handoff_Contract_20260807.md` | 11891 | `db8beca6b64a27fbf280fc41120aa03ea43b0d6fa549c6113d47ccb26fd3c4a0` | `eb588d140961a38f7e7b063a8439bf7f795c5db8` |
| `Cocolon_Piece/pce2_cross_core_source_handoff/Piece_Source_Role_Matrix_20260807.md` | 9123 | `c5ae9d34998e9dfe0b5f60f99988b04b96a269163133aec457f6822414da3bba` | `514138643f09704db350f18d9f799f04d983a545` |
| `Cocolon_Piece/pce2_cross_core_source_handoff/Piece_Forbidden_Mixing_Negative_Contract_20260807.md` | 10058 | `ee95f7a6638cd922900c7f6b85dec959f979e9c6a8d9bce391353f01615396a0` | `bbece156152379a8d98cd2e37c44f6c5cd2225b4` |
| `Cocolon_前提資料/15E_cocolon_piece_workstream_pce2_design_closure_20260807.md` | 5079 | `7ace1e2a4d9c9fb9830f33763db6b6fd4dcdfdcc0d59e34ef7d189b703360eb5` | `a7a6500bcd4ebe2ace7cdd7d42177c51be11301f` |
| `Cocolon_Piece/00_read_first.md` | 5887 | `2cb72bebb86226de796e0b716f0f04507678785bcee08cd92c68bdbc112d4f56` | `4b24837cab8e6ab88acbf91b0d2203ac29069314` |
| `Cocolon_Piece/manifest.json` | 9955 | `087b79c0cdb3445981b9f9d18b90e02a97103714d9b3c3318cb0a280bde28efa` | `fd5f1ef5ab27da265c35341615c429789d37850d` |

All six files were fetched from the publication commit after write. Remote blob identities matched the prepared identities.

## 8. Publication scope

```text
baseline:
  1ea6fe60a2b43c11d02f15c63babf4ce0b75a469

design publication:
  499e2e45bdfe3dc03061f18f3fc85f0fb2a3ef43

design publication tree:
  ba09b5a758519c6eaf97c3c13c40608c3f6ed343

design publication commits:
  exact1

design publication changed paths:
  exact6

scope outside Piece / Piece premise:
  exact0
```

This checkpoint is the additive exact7th changed path after the PCE-2 baseline.

## 9. Prepublication transport incident

```text
unreferenced candidate blob:
  d51a4ddb74fc56c7fb479fe0a7609af902735b9f

reason:
  connector base64 candidate had UTF-8 byte mismatch

tree inclusion:
  exact0

ref effect:
  exact0

reuse:
  prohibited
```

The candidate was detected by prepared-vs-remote blob comparison before any tree/ref update. The exact canonical handoff contract is blob `eb588d140961a38f7e7b063a8439bf7f795c5db8`.

## 10. Runtime split

```text
PCE-2 completed:
  abstract schema
  source roles
  stage matrix
  eligibility semantics
  event ordering
  privacy / body-free boundary
  negative code catalog

PCE-9C owns later:
  exact saved-input adapter
  exact Emlis result adapter
  exact question / supplemental adapter
  CTA eligibility binding
  deterministic tests

PCE-6 owns later:
  PieceRecord persistence / API / RN projection

PCE-7 owns later:
  RED / integration / monitoring proof
```

## 11. Next exact actions

Next cross-workstream action:

```text
ANALYSIS_PRO_FIRST_CURRENT_ACTUAL_PRODUCT_QUALITY_CLOSURE_ROADMAP_DESIGN_ONLY
```

Next queued Piece phase:

```text
PCE3_RECORD_LIFECYCLE_VISIBILITY_QUOTA_DESIGN_ONLY
```

Both require separate Mash approval. Neither is activated by this checkpoint.

## 12. Effects

```text
Cocolon production source change:
  exact0

mashos-api production source change:
  exact0

DB / API / RN / migration / data deletion:
  exact0

test / runtime execution:
  exact0

EmlisAI technical state / authority / credit:
  exact0

Analysis runtime state:
  exact0

release effect:
  exact0

automatic progression:
  false
```

## 13. Closure

```text
PCE2_CROSS_CORE_HANDOFF_FIXED
SAVED_INPUT_IDENTITY_REQUIRED
ORIGINAL_SOURCE_EXACT1_ALL_STAGES
SUPPLEMENTAL_REFINED_ONLY_EXACT1
QUESTION_DECISION_CONTROL_ONLY
EMLIS_VISIBLE_BODY_SOURCE_EXACT0
ANALYSIS_INFERENCE_SOURCE_EXACT0
PIECE_ANALYSIS_MUTUAL_COMPLETION_DEPENDENCY_EXACT0
BODY_FREE_LINEAGE_REQUIRED
NEGATIVE_CODE_CATALOG_FIXED
FAIL_CLOSED_ELIGIBILITY_FIXED
RUNTIME_BINDING_EXACT0
PREPUBLICATION_CORRUPT_CANDIDATE_REF_EFFECT_EXACT0
PCE2_COMPLETE_DESIGN_ONLY
ANALYSIS_ROADMAP_NOT_ACTIVATED
PCE3_NOT_ACTIVATED
AUTOMATIC_PROGRESSION_FALSE
```
