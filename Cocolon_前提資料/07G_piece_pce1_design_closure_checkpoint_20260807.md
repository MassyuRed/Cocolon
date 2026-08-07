---
doc_id: piece_pce1_design_closure_checkpoint_20260807
title: "Piece PCE-1 identity / clean cutover design closure checkpoint"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
checkpoint_type: "PCE1_DESIGN_ONLY_CLOSURE"
baseline_cocolon_head: "3e558c4012c3049ca7d97f0b94d8d9a5cec24e1c"
design_publication_commit: "29a0b18d5b5455ffe026f5b202a25d844d137602"
design_publication_tree: "2de1255b83719b2f22e3aeb241e923696110531e"
pce0_complete: true
pce1_complete: true
pce2_activated: false
automatic_progression: false
production_effect: "exact0"
---

# Piece PCE-1 identity / clean cutover design closure checkpoint

## 1. Closure result

Mashが承認した次のdesign-only作業を完了した。

```text
PCE1_PIECE_IDENTITY_NEW_RECORD_CONTRACT_CLEAN_CUTOVER_AND_OLD_QNA_REMOVAL_MAP_DESIGN_ONLY
```

current state:

```text
PCE-0 Current Contract Pin:
  COMPLETE

PCE-1 Piece Identity / Clean Cutover Decision:
  COMPLETE_DESIGN_ONLY

PCE-2 Cross-Core Source Handoff:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

## 2. Revised roadmap basis

Mashが受領・採用したclean-cutover revised roadmapをlossless bundleとしてGitHubへ保存した。

```text
original filename:
  Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807_CleanCutover_Revised.md

UTF-8 bytes:
  51703

lines:
  1972

SHA-256:
  2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939
```

GitHub owner:

```text
Cocolon_Piece/roadmap/
Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807_CleanCutover_Revised/
  README.md
  bundle.json
  Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807_CleanCutover_Revised.md.gz.b64
```

The bundle uses deterministic gzip (`mtime=0`) and Base64 ASCII and reconstructs the exact original bytes and SHA-256.

## 3. Fixed PCE-1 decisions

```text
user-facing name:
  Piece

logical record contract:
  piece.record.v2

public identity:
  piece:<uuid>

canonical visible body:
  piece_text

new physical owner direction:
  public.piece_records

read projection after cutover:
  public.pieces

Q&A:
  pre-release legacy specification
  new active format exact0

old record migration:
  exact0

compatibility read adapter:
  exact0

compatibility renderer:
  exact0

user-visible old/new dual-run:
  exact0

rollback:
  safe-disable new Piece
  not old Q&A restoration
```

`public.piece_records` is a design direction fixed by PCE-1. PCE-6 must still create a tracked application migration baseline and complete exact DDL / RLS / index / view / rollback design before production creation.

## 4. New record boundary

The new Piece record does not use Q&A top-level fields as its identity.

Required contract layers:

```text
record:
  id / public_id / piece_contract_version

source:
  source_input_id / source_input_version / source lineage

content:
  format_type / content_payload / piece_text / piece_text_hash

visual:
  visual_recipe / visual_recipe_hash / renderer_version

access:
  owner_user_id / lifecycle_status / visibility_scope

export:
  export_contract_version + content / visual identities
```

Explicitly absent from the new core record:

```text
question
answer
q_key
topic_key
question_id
reflection_text
emotion_reflection.v1
piece.core.v1 as the record contract
```

PCE-2 through PCE-5 finalize the exact source, lifecycle, content-format, visual and export schemas.

## 5. Old Q&A removal boundary

Confirmed current old Emotion Piece row predicate:

```sql
public.mymodel_reflections
where source_type = 'emotion_generated'
```

Not automatically included:

```text
source_type = create
source_type = generated
shared table
ProfileCreate / EmlisAI / Analysis / account data
unrelated consumers
```

PCE-1 permits removal as a product decision but executes no destructive operation.

Before any delete / drop, PCE-6 and the later implementation authority must establish:

1. new Piece generation / save / visibility / feed / export is complete and verified;
2. old entry, generation, route, caller and renderer residual is exact0;
3. old row IDs and related metric/read/resonance identities are captured body-free;
4. exact dependency map proves unrelated owners are preserved;
5. tracked application migration baseline and rollback are available.

## 6. Design artifacts and verified blobs

| path | UTF-8 bytes | SHA-256 | Git blob SHA-1 |
|---|---:|---|---|
| `Cocolon_Piece/pce1_identity_clean_cutover/Piece_Identity_CleanCutover_Decision_20260807.md` | 5634 | `6eaf9f1a2c68130e537404ed80552a49d1d983fde1ca352f55e5a983ef2ed2e7` | `5dc0dff9c9e3e23c507cd140dbe8b4e1b1944ce5` |
| `Cocolon_Piece/pce1_identity_clean_cutover/Piece_New_Record_Contract_Matrix_20260807.md` | 6524 | `451f2b17c49d91fa2db3cf9e449eeb845fe318c0fdcf47024290fa1998958cd5` | `9550742bd3feafe4dc3c5242a868576752edc58f` |
| `Cocolon_Piece/pce1_identity_clean_cutover/Piece_OldQna_Removal_Map_20260807.md` | 10047 | `e946243abfb22b449c5d33ae69a26886166f7ff0ee68d2cb3e1e49a935f6905f` | `757780de7b43e458abc9c1d69a4d303698ddf006` |
| `Cocolon_Piece/pce1_identity_clean_cutover/Piece_Normative_Definition_Update_Map_20260807.md` | 6433 | `0b4891c0106701880a89c03fd14ca710765da4b901529d030d2601e17a7e9963` | `b0661c19a22948579f116570d78f53b5c978a0d3` |
| `Cocolon_Piece/00_read_first.md` | 4031 | `4408fbf2fb30e089846bfbd5fa75a8fee497209b9df7c026134873a176f62286` | `efcc3b6e03eef7b4ca5de5c5a421598b98109879` |
| `Cocolon_Piece/manifest.json` | 6062 | `c83ccc1512442aec65a626d79fbf6876442b559f8e1bb180f17fc99d0e31c9d6` | `86015fe8fed99c20970195455a65069e3fd0951b` |
| revised roadmap `README.md` | 1836 | `c7f828d983a8a4d38e2bc9784d96040288c80d6075f957e77b4065c14300286d` | `729b93ede7074e332ed005b146c77b34549e590b` |
| revised roadmap `bundle.json` | 1454 | `6bb71140d255e408ff8fecff2c7970fd4febb7c9de2def262b8e0ab2c5db246d` | `4b4a3c8a4c354c93e652a6081ef6fe828904edff` |
| revised roadmap `.md.gz.b64` | 24556 | `865ef229b08d24696bfead7b5a4f75b6dec534ffc0af9a5e3ea17f24631cfbbb` | `6a855b3c4cc2d74937f6c8eebeed0aa594e320b0` |
| `Cocolon_前提資料/15D_cocolon_piece_workstream_pce1_design_closure_20260807.md` | 2810 | `91a9eec38cf924165cf8c33bca0106925eb644d0f8c777d5cc0f35e0fdaf5e55` | `63eb95aec8fa419907d8d965d261b760da7ec060` |

All files were fetched from the publication commit after write. The returned remote blob identities matched the prepared identities.

## 7. Publication scope

```text
baseline:
  3e558c4012c3049ca7d97f0b94d8d9a5cec24e1c

design publication:
  29a0b18d5b5455ffe026f5b202a25d844d137602

design publication tree:
  2de1255b83719b2f22e3aeb241e923696110531e

design publication commits:
  exact1

design publication changed paths:
  exact10

scope outside Piece / Piece premise:
  exact0
```

This checkpoint is the additive exact11th path and does not change the completed design bytes.

## 8. Non-reuse boundary

```text
unreferenced candidate blob:
  bc41acf2cab60a1a74cf0b40a8b4bf1c0c774177

reason:
  pre-bundle normative-map path version

tree inclusion:
  exact0

ref effect:
  exact0

reuse:
  prohibited
```

The current normative map is blob `b0661c19a22948579f116570d78f53b5c978a0d3`.

## 9. Next exact action

```text
PCE2_CROSS_CORE_SOURCE_HANDOFF_ABSTRACT_CONTRACT_DESIGN_ONLY
```

PCE-2 requires separate Mash approval. It must fix saved-input identity, original/supplemental source roles, Emlis observation stage/result identity, Piece eligibility, and the no-body-copy negative contract. It must not bind runtime imports to the current Emlis owner or activate implementation.

## 10. Effects

```text
Cocolon production source change:
  exact0

mashos-api production source change:
  exact0

DB / API / RN / migration / data deletion:
  exact0

test / runtime execution:
  exact0

EmlisAI technical state:
  exact0

release effect:
  exact0

automatic progression:
  false
```

## 11. Closure

```text
PCE1_IDENTITY_FIXED
PIECE_RECORD_V2_FIXED
DEDICATED_RECORD_OWNER_DIRECTION_FIXED
QNA_NEW_ACTIVE_FORMAT_EXACT0
OLD_RECORD_MIGRATION_EXACT0
COMPATIBILITY_RENDERER_EXACT0
USER_VISIBLE_DUAL_RUN_EXACT0
OLD_QNA_REMOVAL_BOUNDARY_FIXED
SHARED_NON_PIECE_DATA_PROTECTED
REVISED_ROADMAP_LOSSLESSLY_PRESERVED
PCE1_COMPLETE_DESIGN_ONLY
PCE2_NOT_ACTIVATED
AUTOMATIC_PROGRESSION_FALSE
```
