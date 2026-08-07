---
doc_id: cocolon_piece_workstream_pce2_design_closure_20260807
title: "Cocolon Piece Workstream — PCE-2 design closure"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece / EmlisAI / Analysis"
phase: "PCE-2 Cross-Core Source Handoff"
phase_completion: true
pce3_activated: false
analysis_roadmap_activated: false
automatic_progression: false
production_effect: "exact0"
---

# Cocolon Piece Workstream — PCE-2 design closure

## 1. current state

```text
PCE-0:
  COMPLETE

PCE-1:
  COMPLETE_DESIGN_ONLY

PCE-2:
  COMPLETE_DESIGN_ONLY

Analysis Pro-First roadmap:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

PCE-3:
  NOT_ACTIVATED
  QUEUED_AFTER_CROSS_WORKSTREAM_DECISION

automatic progression:
  false
```

This file supersedes the phase-state portion of `15D_cocolon_piece_workstream_pce1_design_closure_20260807.md`. PCE-1 decisions and historical facts remain valid.

## 2. fixed PCE-2 contracts

```text
cross-core handoff:
  cocolon.cross_core.source_handoff.v1

Piece source lineage:
  piece.source_lineage.v1

source role matrix:
  cocolon.cross_core.source_role_matrix.v1

forbidden mixing:
  cocolon.cross_core.forbidden_mixing.v1

eligibility:
  piece.generation_eligibility.v1
```

Responsibility separation:

```text
saved input:
  common source root

EmlisAI:
  current input observation
  stage / result lineage only
  visible body is not Piece source

Piece:
  expression / preview / save / share
  Piece-owned content and safety transformation

Analysis:
  period observation / current route
  no completion dependency with Piece
  no inference into Piece source
```

## 3. stage / source contract

```text
normal_observation:
  semantic original exact1
  question decision exact0
  supplemental exact0

pre_question_observation:
  semantic original exact1
  question decision control exact1
  supplemental exact0

refined_observation:
  semantic original exact1
  semantic supplemental exact1
  question decision control exact1
  original / supplemental remain distinct
```

Every eligible handoff requires saved source ID, source bundle version, body-free commitment, same-owner binding, Emlis result identity, terminal success, exact stage role set, and explicit eligibility. Missing or unknown defaults to ineligible.

## 4. current actual basis

```text
Cocolon head:
  1ea6fe60a2b43c11d02f15c63babf4ce0b75a469

Cocolon tree:
  e77b60576e0437061ea0ff06714d8959e24fc1dc

mashos-api head:
  315813c7bd3372462de926ddad74df567254a6b5

mashos-api tree:
  a641510e107d52bb910073f36604c85bd57af150

saved source identity candidate:
  /emotion/submit inserted emotions.id

current source bundle version:
  emlis.current_input_bundle.v1

current stage owner evidence:
  emlis_ai_observation_stage_context_v3.py

current refined separation evidence:
  emlis_ai_refined_source_partition_v3.py

current result identity candidates:
  observation_trace_id / trace_id
```

These are current mapping candidates, not PCE-2 runtime bindings.

## 5. PCE-2 outputs

```text
Cocolon_Piece/pce2_cross_core_source_handoff/
  Piece_CrossCore_Source_Handoff_Contract_20260807.md
  Piece_Source_Role_Matrix_20260807.md
  Piece_Forbidden_Mixing_Negative_Contract_20260807.md
```

## 6. body-free / no-mixing boundary

```text
forbidden Piece sources:
  Emlis visible comment_text
  Emlis reception / human-follow body
  Emlis internal obligation / AST / candidate body
  question decision body
  Analysis inference / route
  simulated route
  hidden public meta
  credential / contact data

forbidden dependencies:
  Analysis completion -> Piece success
  Piece completion -> Analysis success
  failure -> old Q&A fallback
```

PieceRecord `source_lineage` persists only identities, versions, commitments, roles, stage, terminal state, and eligibility material.

## 7. Analysis reuse

The existing Piece / Analysis handoff fixed that Analysis roadmap creation follows PCE-2 so the three core systems do not define source identity, roles, privacy, and event ordering separately.

Analysis roadmap may reuse:

```text
source input identity/version/commitment
original / supplemental separation
stage names
event ordering
same-owner binding
body-free lineage
no-mixing negative codes
```

It may not reuse Piece eligibility, Piece text, lifecycle, visibility, quota, or format policy as Analysis facts/contracts.

## 8. next exact action

```text
ANALYSIS_PRO_FIRST_CURRENT_ACTUAL_PRODUCT_QUALITY_CLOSURE_ROADMAP_DESIGN_ONLY
```

This is the next cross-workstream action because the prior durable handoff explicitly placed Analysis roadmap creation after PCE-2.

The next queued Piece phase remains:

```text
PCE3_RECORD_LIFECYCLE_VISIBILITY_QUOTA_DESIGN_ONLY
```

Neither action is activated by this closure.

## 9. non-effects

```text
Cocolon production source: exact0
mashos-api production source: exact0
DB / API / RN / migration / data deletion: exact0
test / runtime: exact0
EmlisAI technical state / authority / credit: exact0
Analysis runtime state: exact0
release: exact0
automatic progression: false
```
