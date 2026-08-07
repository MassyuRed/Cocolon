---
doc_id: cocolon_piece_workstream_clean_cutover_product_decision_20260807
title: "Cocolon Piece Workstream — clean cutover product decision"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
document_status: "CURRENT_ADDITIVE_PRODUCT_DECISION"
pce0_complete: true
pce1_activated: false
automatic_progression: false
production_effect: "exact0"
---

# Cocolon Piece Workstream — clean cutover product decision

## 1. Current decision

Mashは、current Q&A Pieceがまだユーザーに利用されておらず、既存Q&A dataを保持する必要がないと明示した。

```text
Q&A preservation:
  NOT_REQUIRED

old/new coexistence:
  NOT_REQUIRED

compatibility renderer:
  NOT_REQUIRED

complete replacement with new Piece structure:
  ALLOWED
```

新しいPieceは、旧投稿画面、旧Q&A形式、旧record表示、旧route / field / storageとのproduct-level coexistenceを前提にしない。

## 2. Superseded prior position

次のprior positionはcurrentではない。

```text
Q&Aを現役formatとして残す。
existing Q&A recordをcompatibility adapterで表示し続ける。
Nexusでold/new rendererを共存させる。
old route / field / storageを発売安定まで残す。
```

roadmap原本とPCE-0 closure資料は当時の前提を保存するhistorical materialとして変更しない。current overlay ownerは次である。

```text
Cocolon_Piece/pce1_identity_clean_cutover/
Piece_PCE1_Clean_Cutover_Product_Decision_And_Roadmap_Overlay_20260807.md
```

## 3. Current phase state

```text
PCE-0:
  COMPLETE

next phase name:
  PCE-1 Piece Identity / Clean Cutover Decision

PCE-1:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

本決定はPCE-1のproduct premiseを固定するが、PCE-1の設計開始、code変更、DB変更、data削除を自動承認しない。

## 4. Safe deletion boundary

`public.mymodel_reflections`は複数source typeとconsumerを共有するため、「既存Q&Aを残さない」をshared table全削除へ拡張しない。

PCE-1 / PCE-6で次をactual ownerへbindする。

- old Q&A Piece rowのexact predicate。
- old Q&A UI / route / service / renderer / Nexus / quota / metrics / read / resonance dependency。
- Piece以外のrow・consumerを除外する条件。
- replacement complete後のatomic cutover / cleanup順序。
- tracked application migration baseline。

## 5. Non-effects

```text
production source:
  exact0

DB / API / RN / migration:
  exact0

data deletion:
  exact0

test / runtime:
  exact0

PCE-1 activation:
  false
```
