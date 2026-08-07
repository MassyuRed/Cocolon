---
doc_id: cocolon_piece_workstream_pce6_design_closure_20260808
title: "Cocolon Piece Workstream — PCE-6 design closure"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-6 API / DB / RN / Migration Design"
phase_completion: true
pce7_activated: false
analysis_roadmap_activated: false
automatic_progression: false
production_effect: "exact0"
---

# Cocolon Piece Workstream — PCE-6 design closure

## 1. Current state

```text
PCE-0: COMPLETE
PCE-1: COMPLETE_DESIGN_ONLY
PCE-2: COMPLETE_DESIGN_ONLY
PCE-3: COMPLETE_DESIGN_ONLY
PCE-4: COMPLETE_DESIGN_ONLY
PCE-5: COMPLETE_DESIGN_ONLY
PCE-6: COMPLETE_DESIGN_ONLY

PCE-7:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

Analysis Pro-First roadmap:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

PCE-6 converts the PCE-1 through PCE-5 logical contracts into one detailed DB/API/RN/migration design. It creates no production implementation or database effect.

## 2. Fixed contracts

```text
data:
  piece.data_contract.v1

API:
  piece.api.v2

RN flow:
  piece.rn_flow.v1

clean-cutover migration:
  piece.clean_cutover_migration.v1
```

These bind to:

```text
piece.record.v2
piece.source_lineage.v1
piece.record_lifecycle.v1
piece.visibility_access.v1
piece.quota_consumption.v1
piece.content_meaning.v1
piece.format_owner.v1
piece.public_safety_transformation.v1
piece.visual_recipe.v1
piece.export_contract.v1
```

## 3. DB decision

Selected option:

```text
dedicated new table family:
  public.piece_records
  public.piece_quota_month_locks
  public.piece_quota_consumptions
  public.piece_record_metrics
  public.piece_record_reads
  public.piece_record_resonances
  public.piece_export_receipts
  public.piece_delete_receipts
```

Rejected as new Piece physical owner:

```text
mymodel_reflections/content_json extension
visual child table attached to old Q&A row
old mymodel_qna_* state reuse
image binary primary storage
```

Reason: current `mymodel_reflections` is shared by `create`, `generated`, and `emotion_generated`, requires Q&A fields, uses old IDs/statuses and row-count quota. Extending it would preserve the old Q&A owner rather than perform clean cutover.

## 4. The `public.pieces` boundary

PCE-0 confirmed `public.pieces` is the current security-invoker projection over `mymodel_reflections`. Source inspection also confirmed it is read by generated-reflection, Emlis, worker, metrics and runtime owners, not only old Emotion Piece.

Therefore the cutover is:

```text
1. create public.mymodel_reflections_read
2. rebind every legacy/shared public.pieces caller
3. create service-only public.pieces_v2_staging
4. prove legacy public.pieces caller exact0
5. replace public.pieces with new piece_records projection
```

Replacing `public.pieces` first is a STOP condition.

## 5. Record, quota and access

`piece_records` owns immutable Piece identity, body-free source lineage, lifecycle, private/public visibility, content/text hashes, visual recipe/hash and all version identities.

It stores no raw input, supplemental body, Emlis/Analysis body, detector trace, profile/friend code or PNG bytes.

```text
visibility default:
  private

unavailable safety result:
  record exact0

normal readable deleted row:
  exact0

source_input_id uniqueness:
  exact0
```

Quota is an immutable body-free ledger. An owner/JST-month lock serializes concurrent saves. The quota ledger has no deleting FK to Piece records and survives physical delete.

Dedicated metrics/reads/resonances cascade with the record. Export/delete receipts are body-free and may survive delete.

Base tables use RLS ENABLE + FORCE. RN has no direct base-table mutation. Application-service authorization and the current viewer relation are checked on every read/action; service-role possession is not authorization proof.

## 6. Atomic operations

```text
piece_save_v2:
  preview lock + revision/hash validation + server tier/limit + month lock
  + saved transition + quota exact1 in one transaction

piece_set_visibility_v2:
  owner/version checked
  same record/text/format/recipe/quota

piece_delete_v2:
  body-free receipt + child purge + physical record delete in one transaction
  quota/receipts retained
```

All use fixed search paths and service-role-only execution. Response-loss retries return the same terminal result; they never create another Piece or quota event.

## 7. API clean cutover

Neutral namespaces are reused with new semantics, not compatibility:

```text
owner:
  GET  /emotion/piece/quota
  POST /emotion/piece/preview
  PATCH/DELETE /emotion/piece/preview/{preview_id}
  POST /emotion/piece/save
  GET  /emotion/piece/history
  GET  /emotion/piece/{piece_id}
  PATCH /emotion/piece/{piece_id}/visibility
  DELETE /emotion/piece/{piece_id}

public:
  GET /nexus/pieces
  GET /nexus/pieces/unread-status
  GET /nexus/pieces/{piece_id}
  POST /nexus/pieces/{piece_id}/read
  PUT/DELETE /nexus/pieces/{piece_id}/resonance
```

Preview accepts a body-free saved-source reference. It rejects raw input resend, client owner/tier/limit, Emlis body and Analysis material.

Save binds preview revision, text/content/recipe hashes, visibility and idempotency. Missing visibility fails closed to private. Initial backend image-export route is exact0 under the RN-first PCE-5 decision.

Retired before release:

```text
/emotion/piece/publish
/emotion/piece/cancel
/emotion/reflection/*
/nexus/reflections*
/mymodel/qna/*
old /piece/* Q&A runtime
old Q&A response fields and identifiers
```

Private/deleted/inaccessible/missing Piece responses are concealed as the same not-found-equivalent for non-owners.

## 8. RN flow

```text
saved input
  -> terminal Emlis observation
  -> optional Piece CTA
  -> canonical text + visual preview
  -> plan-eligible choices
  -> private/public, private default
  -> save
  -> optional RN-first export/share
  -> owner history / Nexus
```

Piece receives body-free source identity, never the Emlis visible body. Old pre-Emlis Q&A modal/controller/card is retired rather than wrapped.

Owner history is a dedicated owner-only flow, not the public Nexus feed with filters removed. Visibility mutation never regenerates text or consumes quota. Export is saved-record-only and includes no raw/internal/profile/metric/visibility UI or EXIF/GPS.

The new Nexus card consumes Piece ID, format, canonical text/hash, visual recipe/hash, allowed owner projection, saved time, metrics and viewer state. It consumes no `q_key`, `q_instance_id`, question, reflection ID or `emotion_generated` marker.

## 9. Migration design

```text
M0 tracked application migration baseline
M1 legacy read bridge and caller rebind
M2 dedicated new Piece foundation
M3 RLS, atomic RPCs and staging view
M4 disabled application integration
M5 one user-visible clean cutover
M6 body-free old identity capture
M7 exact destructive cleanup under separate Mash approval
M8 obsolete Q&A contract/code retirement
```

Old row predicate remains exact:

```sql
public.mymodel_reflections
where source_type = 'emotion_generated'
```

`create`, `generated`, the shared table and unrelated state are excluded. M7 uses a frozen exact ID packet and body-free pre/post counts. It is not bundled with the first DDL or PCE-6 design approval.

Rollback is new Piece safe-disable. It never restores old Q&A as a product path.

## 10. Current actual basis

```text
Cocolon head / tree:
  96df30f6cdda8f4549065a3b2156c5b75d36026e
  00196a604415267b45df335220a0b3ff525b910f

mashos-api head / tree:
  315813c7bd3372462de926ddad74df567254a6b5
  a641510e107d52bb910073f36604c85bd57af150

PCE-0 catalog SHA-256:
  2f51e5e6e4207a186aaacbeb355c07ade3b4f777960f3f46d1dbea9f8f9d810e
```

Confirmed current gaps:

```text
old Q&A request/response and modal/card
mymodel_reflections draft -> ready/active row mutation
published_at row-count quota
reflection:<uuid> / q_instance IDs
Q&A Nexus payload
compat route registration
shared public.pieces view
tracked application migration absent
new Piece DB/API/RN/migration implementation exact0
```

## 11. PCE-6 artifacts

| role | path | Git blob SHA-1 |
|---|---|---|
| data contract | `Cocolon_Piece/pce6_api_db_rn_migration/Piece_New_Data_Contract_Design_20260808.md` | `262921f40536727443359b3d0c28b490cb5c5ed4` |
| API design | `Cocolon_Piece/pce6_api_db_rn_migration/Piece_API_CleanCutover_Design_20260808.md` | `96757b9ddbae8c2079fd7249d823f2f0d2bf3102` |
| RN flow | `Cocolon_Piece/pce6_api_db_rn_migration/Piece_RN_Flow_Design_20260808.md` | `c91a51eff44a89d08d714ece4c90c42ccdd97265` |
| migration | `Cocolon_Piece/pce6_api_db_rn_migration/Piece_OldQna_Removal_And_DB_Migration_Design_20260808.md` | `00dee10809a3b3f713ec038e1f675f3f8c346b8a` |

## 12. Completed / not implemented

Completed:

- new table family and read-view transition order;
- record/quota/state/receipt/RLS/atomic RPC design;
- v2 owner/public API and exact-once/error contract;
- post-Emlis RN preview/history/Nexus/export flow;
- tracked M0–M8 clean-cutover migration and destructive boundary;
- old Q&A route/code/data retirement map;
- negative contracts and STOP conditions.

Not implemented:

```text
production source / SQL / DB object:
  exact0

API / RN / migration / deletion:
  exact0

test / runtime / actual device:
  exact0

old Q&A removal / release:
  exact0
```

## 13. Facts / inference / Karen's opinion

### Confirmed facts

Current catalog, current heads, shared-table/view shape, current API/RN Q&A contracts, current route registration, shared `public.pieces` consumers, prior PCE contracts and PCE-6 roadmap requirements were confirmed.

### Inference / unconfirmed

Production schema drift after the PCE-0 packet, final SQL syntax, query plans, exact migration runner behavior, live concurrency, deployed commit, RN performance and actual-device behavior remain unconfirmed. They are not claimed as implemented or PASS.

### Karen's opinion

A dedicated Piece family is the smallest design that truly performs clean cutover. Extending `mymodel_reflections` would preserve old Q&A constraints and make privacy/quota/delete responsibilities harder to prove.

The important correction is the read bridge: `public.pieces` currently belongs to more than old Emotion Piece. Protecting those unrelated consumers before renaming its meaning is necessary, not optional ceremony.

## 14. Next exact action

```text
PCE7_TEST_MONITORING_ROLLBACK_DESIGN_ONLY

environment:
  CHAT_5_6_PRO_OK

state:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED
```

Analysis roadmap also remains unactivated. Mash-side action required for PCE-6 closure is exact0.

## 15. Effects / closure

```text
Cocolon documentation / Piece premise:
  reflected

production source / DB / API / RN / migration / deletion:
  exact0

test / runtime / actual device / release:
  exact0

EmlisAI / Analysis technical state:
  exact0

automatic progression:
  false

PCE6_DATA_CONTRACT_FIXED
PCE6_API_V2_FIXED
PCE6_RN_FLOW_FIXED
PCE6_MIGRATION_FIXED
PCE6_COMPLETE_DESIGN_ONLY
PCE7_NOT_ACTIVATED
ANALYSIS_ROADMAP_NOT_ACTIVATED
```
