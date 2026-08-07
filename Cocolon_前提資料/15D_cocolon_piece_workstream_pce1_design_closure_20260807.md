---
doc_id: cocolon_piece_workstream_pce1_design_closure_20260807
title: "Cocolon Piece Workstream — PCE-1 design closure"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-1 Piece Identity / Clean Cutover Decision"
phase_completion: true
pce2_activated: false
automatic_progression: false
production_effect: "exact0"
---

# Cocolon Piece Workstream — PCE-1 design closure

## 1. current state

```text
PCE-0:
  COMPLETE

PCE-1:
  COMPLETE_DESIGN_ONLY

PCE-2:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

This file supersedes the PCE-1 prestart state in `15C_cocolon_piece_workstream_clean_cutover_product_decision_20260807.md`. Historical facts in earlier Piece premise files remain preserved.

## 2. completed design

```text
Piece identity:
  user-owned communicative visual artifact

user-facing name:
  Piece

record contract:
  piece.record.v2

public identity:
  piece:<uuid>

new physical owner direction:
  public.piece_records

read projection after cutover:
  public.pieces

Q&A new active format:
  exact0

old record migration / adapter / compatibility renderer:
  exact0 / exact0 / exact0
```

## 3. four PCE-1 outputs

```text
Cocolon_Piece/pce1_identity_clean_cutover/
  Piece_Identity_CleanCutover_Decision_20260807.md
  Piece_New_Record_Contract_Matrix_20260807.md
  Piece_OldQna_Removal_Map_20260807.md
  Piece_Normative_Definition_Update_Map_20260807.md
```

## 4. revised roadmap owner

```text
Cocolon_Piece/roadmap/Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807_CleanCutover_Revised/
README.md
bundle.json
Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807_CleanCutover_Revised.md.gz.b64

UTF-8 bytes:
  51703

lines:
  1972

SHA-256:
  2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939
```

The file preserves its local creation-state wording. Current GitHub publication is determined by this premise owner, Piece manifest, checkpoint, and current commit.

## 5. removal boundary

```text
confirmed old current Piece row predicate:
  mymodel_reflections.source_type = emotion_generated

not automatically included:
  create
  generated
  shared table
  ProfileCreate / EmlisAI / Analysis / account data
```

No destructive operation was executed. PCE-6 must bind exact related-state predicates and tracked migration baseline before any delete/drop.

## 6. next phase

```text
PCE2_CROSS_CORE_SOURCE_HANDOFF_ABSTRACT_CONTRACT_DESIGN_ONLY
```

PCE-2 may use the new record contract but may not implement Emlis runtime binding or copy Emlis visible body.

## 7. non-effects

```text
Cocolon source: exact0
mashos-api source: exact0
DB / API / RN / migration / data deletion: exact0
test / runtime: exact0
EmlisAI technical state: exact0
release: exact0
```
