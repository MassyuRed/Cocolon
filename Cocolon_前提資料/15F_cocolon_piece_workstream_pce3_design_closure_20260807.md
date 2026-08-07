---
doc_id: cocolon_piece_workstream_pce3_design_closure_20260807
title: "Cocolon Piece Workstream — PCE-3 design closure"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-3 Record Lifecycle / Visibility / Quota"
phase_completion: true
pce4_activated: false
analysis_roadmap_activated: false
automatic_progression: false
production_effect: "exact0"
---

# Cocolon Piece Workstream — PCE-3 design closure

## 1. current state

```text
PCE-0:
  COMPLETE

PCE-1:
  COMPLETE_DESIGN_ONLY

PCE-2:
  COMPLETE_DESIGN_ONLY

PCE-3:
  COMPLETE_DESIGN_ONLY

PCE-4:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

Analysis Pro-First roadmap:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

This file supersedes the phase-state portion of `15E_cocolon_piece_workstream_pce2_design_closure_20260807.md`. PCE-1 / PCE-2 decisions and historical facts remain valid.

## 2. fixed PCE-3 contracts

```text
record lifecycle:
  piece.record_lifecycle.v1

visibility / access:
  piece.visibility_access.v1

quota consumption:
  piece.quota_consumption.v1

delete / external share:
  piece.delete_external_share_boundary.v1
```

All four contracts finalize PCE-3 design for `piece.record.v2`. They do not create DB objects, API routes, RN screens, migrations, runtime behavior, or release authority.

## 3. lifecycle decision

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

valid canonical saved states:
  saved + private
  saved + public
```

`save` owns canonical record confirmation. `visibility_scope` owns Cocolon-internal audience. Public/private toggle does not change record identity, Piece text, source lineage, quota, or lifecycle status.

Default visibility is private. Public requires explicit owner selection.

## 4. visibility / access decision

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
  source-of-truth deny first
  feed / profile / unread / cache invalidation follows
  external copies remain outside Cocolon control
```

current access is application-service owned. PCE-0 production catalog confirmed `mymodel_reflections` RLS enabled, forced false, policy exact0. PCE-6 must bind new dedicated table RLS / grants / service role / read projection; PCE-3 does not assume DB policy already protects private records.

## 5. quota decision

Current plan contract remains:

```text
Free:
  5

Plus:
  30

Premium:
  unlimited

window:
  JST calendar month
```

New count point:

```text
preview_draft -> saved:
  consume exact1

private / public:
  same cost

visibility change:
  exact0

same-record re-export:
  exact0

failed generation / preview / export without saved record:
  exact0

delete refund:
  exact0
```

The logical owner is an immutable body-free consumption identity, not surviving Piece rows or `published_at` count. This closes the current physical-delete quota bypass and makes private/public equal.

Old Q&A rows are not migrated or backfilled into the new Piece quota ledger.

## 6. delete / external-share decision

```text
delete:
  owner-only
  terminal
  restore exact0
  normal read / history / feed / export exact0
  canonical body and record-owned state physical purge required
  body-free delete receipt retained if needed
  quota consumption identity retained
  refund exact0

export / share:
  owner-only server export
  private record export allowed
  visibility mutation exact0
  quota consumption exact0
  external saved/shared copy recovery exact0
  user-facing irreversibility warning required
```

public→privateまたはdeleteは、端末保存画像、SNS投稿、message recipient copy、screenshotを回収しない。

## 7. current actual basis

```text
Cocolon source basis:
  50749566a11bade518add57d07cedbee4f5ab379
  tree 75084995241bea25fb787b79cd691caab4f22dba

mashos-api source basis:
  315813c7bd3372462de926ddad74df567254a6b5
  tree a641510e107d52bb910073f36604c85bd57af150

roadmap:
  UTF-8 bytes 51703
  lines 1973
  SHA-256 2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939
```

current confirmed owners:

```text
current draft / publish / monthly row count:
  ai/services/ai_inference/emotion_piece_store.py

current tier limits / JST month:
  ai/services/ai_inference/piece_publish_entitlements.py

current publish orchestration:
  ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py

current generated access:
  ai/services/ai_inference/piece_generated_access.py

current feed / detail / delete:
  ai/services/ai_inference/piece_public_read_service.py

current physical delete / related cleanup:
  ai/services/ai_inference/piece_public_read_store.py

current RN preview:
  components/EmotionPiecePreviewModal.js

current RN Q&A card:
  screens/nexus/NexusPieceCard.js
```

confirmed current contract:

```text
preview:
  draft / inactive

publish:
  same row -> ready / active

cancel:
  rejected / inactive

visibility_scope:
  absent

quota:
  current monthly published_at row count

delete:
  physical row first
  related metrics / reads / resonance cleanup in separate operations
  single-transaction atomicity unconfirmed
```

## 8. PCE-3 outputs

```text
Cocolon_Piece/pce3_record_lifecycle_visibility_quota/
  Piece_Record_Lifecycle_StateMachine_20260807.md
  Piece_Visibility_Access_Contract_20260807.md
  Piece_Quota_Consumption_Contract_20260807.md
  Piece_Delete_ExternalShare_Boundary_20260807.md
```

Prepared identities:

| path | UTF-8 bytes | SHA-256 | Git blob SHA-1 |
|---|---:|---|---|
| `Cocolon_Piece/pce3_record_lifecycle_visibility_quota/Piece_Record_Lifecycle_StateMachine_20260807.md` | 14244 | `20781debc92b0764a04173ece35dde863e0ae73a3af72908302593b3d9d6e087` | `5ec8c774a699f51c0aef242257f658d18e594ef8` |
| `Cocolon_Piece/pce3_record_lifecycle_visibility_quota/Piece_Visibility_Access_Contract_20260807.md` | 16744 | `fe358af816557997e1a67de078cd5c5144ef06a25189a3654e74bab092c12505` | `ac1f8874ee9a6a624b195eb59a3cbedd248f9259` |
| `Cocolon_Piece/pce3_record_lifecycle_visibility_quota/Piece_Quota_Consumption_Contract_20260807.md` | 14361 | `bc7cb2eccf59e694d8b6f877c3c196b60919eaccb4c718f050ee7ece224ad934` | `8020c68c37aea7f434933e00f4055c2262231ea9` |
| `Cocolon_Piece/pce3_record_lifecycle_visibility_quota/Piece_Delete_ExternalShare_Boundary_20260807.md` | 14471 | `406c2d360d255c5de1cd0434c896c0966ba34544e88d5baec5f79d0ff141590e` | `347ebd3ecf571adf136c2d7643dc924da211b2c1` |

## 9. completed / not completed

### PCE-3 completed

- lifecycle enum and transition graph.
- status / visibility separation.
- private default and explicit public selection.
- owner / allowed public viewer access matrix.
- private leak-path catalog.
- feed / unread / metrics / resonance / cache transition behavior.
- first-save quota count point.
- private/public equal quota.
- delete no-refund.
- idempotency / concurrency requirements.
- owner delete / physical purge / body-free receipt boundary.
- external copy irreversibility and warning contract.

### not implemented

```text
DB DDL / RLS / grants / indexes / trigger:
  exact0

API routes / response:
  exact0

RN preview / history / toggle:
  exact0

quota ledger:
  exact0

cache invalidation:
  exact0

delete transaction / purge worker:
  exact0

export / actual device:
  exact0

test / runtime:
  exact0
```

## 10. facts / inference / Karen's opinion

### 確認済み事実

- current quota is row-count based and delete can remove the counted row.
- current access is service-owned and per-Piece visibility is absent.
- current delete performs canonical row deletion and related-state cleanup separately.
- PCE-1 requires lifecycle and visibility as separate fields.
- roadmap requires private owner history, toggle, no private leak, quota equality, re-export, and external-copy warning.

### 推測・未確認

- actual concurrent quota race in production.
- exact new table RLS and transaction mechanism.
- current infrastructure cache.
- deployed production commit.
- iOS / Android file/share behavior.
- cleanup retention requirements outside repository.

### 華恋の意見

Pieceの存在、Cocolon内の公開範囲、外部へ持ち出されたcopyを分離する必要がある。これにより、privateを選んでも同じ一つのartifactとしてquotaを消費し、publicへ変えても別recordにせず、deleteしてもquotaを戻さず、外部copyだけは正直に回収不能と説明できる。

## 11. next exact actions

Next Piece action:

```text
PCE4_CONTENT_FORMAT_SAFETY_DESIGN_ONLY
```

Next cross-workstream queued action:

```text
ANALYSIS_PRO_FIRST_CURRENT_ACTUAL_PRODUCT_QUALITY_CLOSURE_ROADMAP_DESIGN_ONLY
```

Both require separate Mash approval. Neither is activated by PCE-3 closure.

## 12. non-effects

```text
Cocolon production source:
  exact0

mashos-api production source:
  exact0

DB / API / RN / migration / data deletion:
  exact0

test / runtime:
  exact0

EmlisAI technical state / authority / credit:
  exact0

Analysis runtime state:
  exact0

release:
  exact0

automatic progression:
  false
```

## 13. closure

```text
PCE3_RECORD_LIFECYCLE_FIXED
PCE3_VISIBILITY_ACCESS_FIXED
PCE3_QUOTA_CONSUMPTION_FIXED
PCE3_DELETE_EXTERNAL_SHARE_BOUNDARY_FIXED
LIFECYCLE_VISIBILITY_SEPARATED
PRIVATE_DEFAULT_FIXED
PUBLIC_ACCESS_RELATION_REQUIRED
PRIVATE_LEAK_PATH_CATALOG_FIXED
FIRST_SAVE_CONSUMPTION_FIXED
DELETE_REFUND_EXACT0
EXTERNAL_COPY_RECOVERY_EXACT0
PCE3_COMPLETE_DESIGN_ONLY
PCE4_NOT_ACTIVATED
ANALYSIS_ROADMAP_NOT_ACTIVATED
AUTOMATIC_PROGRESSION_FALSE
```
