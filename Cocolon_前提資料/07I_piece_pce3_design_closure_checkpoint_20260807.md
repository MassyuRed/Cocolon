---
doc_id: piece_pce3_design_closure_checkpoint_20260807
title: "Piece PCE-3 record lifecycle / visibility / quota design closure checkpoint"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
checkpoint_type: "PCE3_DESIGN_ONLY_CLOSURE"
baseline_cocolon_head: "50749566a11bade518add57d07cedbee4f5ab379"
baseline_cocolon_tree: "75084995241bea25fb787b79cd691caab4f22dba"
design_publication_commit: "5c540c3d01735d8114b5f297dcbfd156cd97a751"
design_publication_tree: "7c196715c24c94a26ba3742e14f91c360d1dcaed"
pce0_complete: true
pce1_complete: true
pce2_complete: true
pce3_complete: true
pce4_activated: false
analysis_roadmap_activated: false
automatic_progression: false
production_effect: "exact0"
---

# Piece PCE-3 record lifecycle / visibility / quota design closure checkpoint

## 1. Closure result

Mashが承認した次のdesign-only作業を完了した。

```text
PCE3_RECORD_LIFECYCLE_VISIBILITY_QUOTA_DESIGN_ONLY
```

current state:

```text
PCE-0 Current Contract Pin:
  COMPLETE

PCE-1 Piece Identity / Clean Cutover Decision:
  COMPLETE_DESIGN_ONLY

PCE-2 Cross-Core Source Handoff:
  COMPLETE_DESIGN_ONLY

PCE-3 Record Lifecycle / Visibility / Quota:
  COMPLETE_DESIGN_ONLY

PCE-4 Content / Format / Safety:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

Analysis Pro-First roadmap:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

## 2. Fixed contract identities

```text
Piece record:
  piece.record.v2

record lifecycle:
  piece.record_lifecycle.v1

visibility / access:
  piece.visibility_access.v1

quota consumption:
  piece.quota_consumption.v1

delete / external share:
  piece.delete_external_share_boundary.v1
```

PCE-3 fixes logical product contracts only. DB DDL、RLS、API、RN、migration、runtime、release authority are not created by this closure.

## 3. Lifecycle contract

```text
lifecycle_status:
  preview_draft
  saved
  cancelled
  rejected
  expired
  deleted

visibility_scope:
  private
  public

absolute invariant:
  lifecycle_status != visibility_scope

valid saved states:
  saved + private
  saved + public
```

Canonical record confirmation is `save`. Cocolon-internal audience is `visibility_scope`. Visibility transition keeps the same Piece ID、canonical text、source lineage、format、lifecycle status、and quota identity.

Default visibility is private. Public requires explicit owner selection. Missing visibility fails closed to private; unknown values are rejected.

## 4. Visibility / access contract

```text
private:
  authenticated owner only
  owner history included
  owner export / re-export allowed
  Nexus / public profile / unread / resonance / ranking exact0
  Piece-specific friend notification exact0

public:
  authenticated owner always
  non-owner only when current Cocolon viewer-access relation is allowed
  world-readable / unauthenticated public exact0

public -> private:
  visibility source-of-truth deny first
  feed / profile / unread / cache invalidation follows
  stale cache may not bypass current authorization
```

Non-owner access to private、deleted、or inaccessible Piece uses not-found-equivalent concealment. Owner history and public feed are separate projections; public feed queries are not reused by merely omitting visibility filtering.

The private leak-path catalog includes API/DB、RN/local cache、metrics/background processing、and export/external-copy paths. PCE-7 converts these into machine-checkable negative tests; PCE-U1 later performs independent cross-repository audit.

## 5. Quota contract

Current plan limits remain:

```text
Free:
  5 per JST calendar month

Plus:
  30 per JST calendar month

Premium:
  unlimited
```

Canonical count point:

```text
preview_draft -> saved:
  consume exact1

private / public:
  equal consumption

preview / cancel / reject / expiry:
  exact0

visibility change / re-public:
  exact0

same-record export / re-export / share:
  exact0

failed generation / save / export without saved record:
  exact0

delete refund:
  exact0
```

The quota owner is an immutable body-free first-save consumption identity, not surviving Piece rows or `published_at` row count. Same idempotent retry produces the same Piece and same consumption event; concurrent saves may not exceed the plan limit.

Old Q&A rows are not migrated or backfilled into the new Piece quota ledger.

## 6. Delete / external-share contract

```text
delete:
  authenticated owner only
  terminal
  restore exact0
  normal read / owner history / public feed / re-export exact0
  conceal-first
  canonical body / visual / source lineage physical purge required
  record-owned metrics / reads / resonance / discovery purge required
  body-free delete receipt may remain
  quota consumption identity remains
  quota refund exact0

external share:
  owner export of private Piece allowed
  visibility mutation exact0
  quota consumption exact0
  external copy recovery exact0
  user-facing irreversibility warning required
```

Cocolon内のprivate化またはdeleteは、端末保存画像、OS share、SNS投稿、message recipient copy、screenshotを回収しない。External copies are outside the PieceRecord visibility owner.

## 7. Current actual basis

```text
Cocolon basis head / tree:
  50749566a11bade518add57d07cedbee4f5ab379
  75084995241bea25fb787b79cd691caab4f22dba

mashos-api basis head / tree:
  315813c7bd3372462de926ddad74df567254a6b5
  a641510e107d52bb910073f36604c85bd57af150

roadmap source:
  UTF-8 bytes 51703
  lines 1973
  SHA-256 2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939
```

Confirmed current owners:

```text
preview / publish / cancel / monthly row count:
  mashos-api/ai/services/ai_inference/emotion_piece_store.py

plan limits / JST month:
  mashos-api/ai/services/ai_inference/piece_publish_entitlements.py

publish orchestration:
  mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py

access / feed / detail / delete:
  mashos-api/ai/services/ai_inference/piece_generated_access.py
  mashos-api/ai/services/ai_inference/piece_public_read_service.py
  mashos-api/ai/services/ai_inference/piece_public_read_store.py

RN preview / card:
  Cocolon/components/EmotionPiecePreviewModal.js
  Cocolon/screens/nexus/NexusPieceCard.js
```

Confirmed current contract:

```text
preview:
  draft / inactive

publish:
  same row -> ready / active

cancel:
  rejected / inactive

user-selectable Piece visibility:
  absent

quota:
  current JST-month published_at row count

delete:
  physical row delete
  related-state cleanup through separate calls
  one-transaction atomicity unconfirmed

current DB access:
  application-service owned
  mymodel_reflections RLS enabled
  forced false
  policy exact0
```

These facts are design inputs. PCE-3 does not represent them as already-remediated runtime behavior.

## 8. Design artifacts and verified identities

| path | UTF-8 bytes | SHA-256 | Git blob SHA-1 |
|---|---:|---|---|
| `Cocolon_Piece/pce3_record_lifecycle_visibility_quota/Piece_Record_Lifecycle_StateMachine_20260807.md` | 14244 | `20781debc92b0764a04173ece35dde863e0ae73a3af72908302593b3d9d6e087` | `5ec8c774a699f51c0aef242257f658d18e594ef8` |
| `Cocolon_Piece/pce3_record_lifecycle_visibility_quota/Piece_Visibility_Access_Contract_20260807.md` | 16744 | `fe358af816557997e1a67de078cd5c5144ef06a25189a3654e74bab092c12505` | `ac1f8874ee9a6a624b195eb59a3cbedd248f9259` |
| `Cocolon_Piece/pce3_record_lifecycle_visibility_quota/Piece_Quota_Consumption_Contract_20260807.md` | 14361 | `bc7cb2eccf59e694d8b6f877c3c196b60919eaccb4c718f050ee7ece224ad934` | `8020c68c37aea7f434933e00f4055c2262231ea9` |
| `Cocolon_Piece/pce3_record_lifecycle_visibility_quota/Piece_Delete_ExternalShare_Boundary_20260807.md` | 14471 | `406c2d360d255c5de1cd0434c896c0966ba34544e88d5baec5f79d0ff141590e` | `347ebd3ecf571adf136c2d7643dc924da211b2c1` |
| `Cocolon_Piece/00_read_first.md` | 9415 | `dad3d2bcfc32e23400188e0e3912a8311d4bc71b58f84617245698be10c514e6` | `43990a59f02f06268cb573230eaac9c20e5a6225` |
| `Cocolon_Piece/manifest.json` | 14312 | `d4b75321b5f1e787aeaea9e00e15cbf1302f4035f486233871e4ecd8a4e2545e` | `2eb59e4f7c0427da9ce37f57349e7d31e4715301` |
| `Cocolon_前提資料/15F_cocolon_piece_workstream_pce3_design_closure_20260807.md` | 10006 | `7aea17186a99f5a680eb5236be6f93046bb5103853c2b6b8e4843133c21dfe70` | `6bcdfba901cbecd195659417513473acf32799ba` |

All seven paths were fetched or listed from the publication commit after write. Remote size and blob identities matched the prepared identities.

## 9. Publication scope

```text
baseline:
  50749566a11bade518add57d07cedbee4f5ab379

publication commit:
  5c540c3d01735d8114b5f297dcbfd156cd97a751

publication tree:
  7c196715c24c94a26ba3742e14f91c360d1dcaed

publication commits:
  exact1

publication changed paths:
  exact7

new PCE-3 artifacts:
  exact4

current entry / manifest / premise updates:
  exact3

scope outside Piece / Piece premise:
  exact0
```

The publication was a non-force fast-forward from the fresh baseline. This checkpoint is the additive exact8th changed path after the PCE-3 baseline and is written in a separate closure commit.

## 10. Completed / not implemented

### PCE-3 completed

- lifecycle enum and allowed transition graph.
- lifecycle / visibility absolute separation.
- private default and explicit public selection.
- owner / authorized public viewer access predicates.
- private leak-path catalog.
- feed / unread / metric / resonance / notification / cache effects.
- first-save quota count point and private/public equality.
- immutable body-free quota identity and delete no-refund.
- retry / concurrency requirements.
- owner delete、conceal-first、physical purge、body-free receipt boundary.
- external-copy irreversibility and warning boundary.

### Not implemented by PCE-3

```text
production source:
  exact0

DB DDL / RLS / grants / indexes / migration:
  exact0

API routes / response implementation:
  exact0

RN preview / owner history / toggle / export:
  exact0

quota ledger / atomic save RPC:
  exact0

cache invalidation / purge worker:
  exact0

test / runtime / actual device:
  exact0

release / feature activation:
  exact0
```

## 11. Downstream ownership

```text
PCE-4:
  Piece content meaning / format / public-safety contract

PCE-5:
  visual recipe / renderer / export reproducibility

PCE-6:
  DB / API / RN / migration exact binding
  lifecycle / visibility / quota / delete physical owner

PCE-7:
  RED / private leak / concurrency / no-refund / monitoring proof

PCE-9A:
  backend store / policy / API implementation

PCE-9D:
  RN preview / owner history / visibility UX

PCE-9E:
  export / save / share / actual-device packet

PCE-9F:
  Nexus public feed / old Q&A unreachability

PCE-U1:
  independent cross-repository audit
```

The following remain STOP conditions for later design or implementation:

- private body cannot be denied on every read path.
- public->private cannot deny before projection/cache cleanup.
- save and quota consumption cannot be exact1 atomically.
- delete leaves a body-readable window.
- delete no-refund cannot be preserved.
- external copies are represented as recoverable.
- lifecycle and visibility must be recombined.
- old Q&A fallback becomes required.

## 12. Facts / inference / Karen's opinion

### Confirmed facts

Current row-count quota、per-Piece visibility absence、service-owned access、separate delete cleanup、PCE-1/PCE-2 contracts、publication scope、remote blob identities are confirmed from current GitHub and publication results.

### Inference / unconfirmed

Exact new RLS policy、atomic DB mechanism、production concurrency behavior、deployed commit、infrastructure cache、retention requirements outside repository、iOS/Android external-share behavior remain unconfirmed and are not claimed as implemented.

### Karen's opinion

Piece existence、Cocolon-internal visibility、and external copies must remain separate owners. This lets private and public represent the same artifact without quota distortion, lets visibility toggle preserve identity, prevents deletion from becoming a quota bypass, and explains external-copy irreversibility honestly.

## 13. Next exact actions

Next Piece action:

```text
PCE4_CONTENT_FORMAT_SAFETY_DESIGN_ONLY
```

Next cross-workstream queued action:

```text
ANALYSIS_PRO_FIRST_CURRENT_ACTUAL_PRODUCT_QUALITY_CLOSURE_ROADMAP_DESIGN_ONLY
```

Both require separate Mash approval. Neither is activated by this checkpoint.

Mash-side action required for PCE-3 closure:

```text
exact0
```

## 14. Effects

```text
Cocolon documentation / Piece premise:
  reflected

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

## 15. Closure

```text
PCE3_RECORD_LIFECYCLE_CONTRACT_FIXED
PCE3_VISIBILITY_ACCESS_CONTRACT_FIXED
PCE3_QUOTA_CONSUMPTION_CONTRACT_FIXED
PCE3_DELETE_EXTERNAL_SHARE_BOUNDARY_FIXED
LIFECYCLE_VISIBILITY_SEPARATED
PRIVATE_DEFAULT_FIXED
PUBLIC_ACCESS_RELATION_REQUIRED
PRIVATE_LEAK_PATH_CATALOG_FIXED
FIRST_SUCCESSFUL_SAVE_CONSUMPTION_EXACT1
PRIVATE_PUBLIC_EQUAL_CONSUMPTION
VISIBILITY_REEXPORT_CONSUMPTION_EXACT0
DELETE_REFUND_EXACT0
EXTERNAL_COPY_RECOVERY_EXACT0
PCE3_REMOTE_BLOBS_VERIFIED_EXACT7
PCE3_COMPLETE_DESIGN_ONLY
PCE4_NOT_ACTIVATED
ANALYSIS_ROADMAP_NOT_ACTIVATED
AUTOMATIC_PROGRESSION_FALSE
```
