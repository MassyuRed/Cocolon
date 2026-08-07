---
doc_id: piece_clean_cutover_product_decision_checkpoint_20260807
title: "Piece clean cutover product decision checkpoint"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
checkpoint_type: "ADDITIVE_PRODUCT_DECISION_CHECKPOINT"
baseline_cocolon_head: "560053ea43eb548e1d1c11975aa5c03cdc43ee47"
publication_head_before_checkpoint: "aaf2e8b83de01efd8e3eb3cc82b0eb155b2a1b41"
automatic_progression: false
pce0_complete: true
pce1_activated: false
production_effect: "exact0"
---

# Piece clean cutover product decision checkpoint

## 1. Decision fixed by Mash

```text
current Q&A Piece user exposure:
  none, as confirmed by Mash

existing Q&A data preservation:
  not required

old/new coexistence:
  not required

compatibility renderer:
  not required

new Piece structure:
  complete replacement allowed
```

This decision supersedes the prior recommendation to keep Q&A as an active or compatibility format after visual Piece introduction.

## 2. Current phase state

```text
PCE-0:
  COMPLETE

next phase:
  PCE-1 Piece Identity / Clean Cutover Decision

PCE-1:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

PCE-1 product premise:
  CLEAN_CUTOVER_FIXED

automatic progression:
  false
```

## 3. Current owners

```text
product decision / roadmap overlay:
  Cocolon_Piece/pce1_identity_clean_cutover/
  Piece_PCE1_Clean_Cutover_Product_Decision_And_Roadmap_Overlay_20260807.md

premise pointer:
  Cocolon_前提資料/
  15C_cocolon_piece_workstream_clean_cutover_product_decision_20260807.md

Piece current entry:
  Cocolon_Piece/00_read_first.md

Piece current manifest:
  Cocolon_Piece/manifest.json
```

## 4. Publication scope before this checkpoint

```text
base:
  560053ea43eb548e1d1c11975aa5c03cdc43ee47

head before checkpoint:
  aaf2e8b83de01efd8e3eb3cc82b0eb155b2a1b41

commit count:
  exact4

changed paths:
  exact4
```

exact paths:

```text
Cocolon_Piece/00_read_first.md
Cocolon_Piece/manifest.json
Cocolon_Piece/pce1_identity_clean_cutover/Piece_PCE1_Clean_Cutover_Product_Decision_And_Roadmap_Overlay_20260807.md
Cocolon_前提資料/15C_cocolon_piece_workstream_clean_cutover_product_decision_20260807.md
```

scope outside Piece / Piece premise:

```text
exact0
```

## 5. Fresh remote identities

```text
Cocolon_Piece/00_read_first.md:
  ffbadf2e400b3fb67dd8a8f1d687d02f2d182297

Cocolon_Piece/manifest.json:
  0bf4bd978d7c138cdc2e58fe272fa1a299252423

Piece_PCE1_Clean_Cutover_Product_Decision_And_Roadmap_Overlay_20260807.md:
  df30001475aba8fe3460d1b0ad79dce0363a9631

15C_cocolon_piece_workstream_clean_cutover_product_decision_20260807.md:
  66e0d2e69160cac0bc760f2a3727a571206b39e2
```

## 6. Destructive boundary

The product decision permits old Q&A removal, but does not itself execute or authorize immediate destructive changes.

```text
DB DELETE / DROP:
  exact0

code / route / UI removal:
  exact0

shared table blanket deletion:
  prohibited

separate implementation approval:
  required
```

`public.mymodel_reflections` has multiple source types and consumers. PCE-1 / PCE-6 must bind the old Q&A row predicate and dependency map before deletion so that unrelated data is not removed.

## 7. Effects

```text
Cocolon production source:
  exact0

mashos-api production source:
  exact0

DB / API / RN / migration / data deletion:
  exact0

test / runtime:
  exact0

EmlisAI technical state:
  exact0

PCE-1 activation:
  false

automatic progression:
  false
```
