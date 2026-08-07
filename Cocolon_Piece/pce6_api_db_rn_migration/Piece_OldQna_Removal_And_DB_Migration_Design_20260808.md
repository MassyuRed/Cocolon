---
doc_id: piece_old_qna_removal_db_migration_design_20260808
title: "Piece old Q&A removal and DB migration design"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
phase: "PCE-6 API / DB / RN / Migration Design"
document_status: "PCE6_COMPLETE_DESIGN_ONLY"
contract_id: "piece.clean_cutover_migration.v1"
source_cocolon_head: "96df30f6cdda8f4549065a3b2156c5b75d36026e"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_supabase_catalog_sha256: "2f51e5e6e4207a186aaacbeb355c07ade3b4f777960f3f46d1dbea9f8f9d810e"
automatic_progression: false
destructive_execution: false
production_effect: "exact0"
---

# Piece old Q&A removal and DB migration design

## 1. Decision

```text
migration owner:
  mashos-api/supabase/migrations/

tracked application migration baseline:
  required before first DDL

new Piece rollout:
  disabled staging then one user-visible clean cutover

old/new user-visible dual run:
  exact0

old Q&A restoration as rollback:
  exact0

old data preservation/migration/adapter:
  exact0

destructive cleanup:
  separate post-verification approval only
```

PCE-6 defines migration order and exact destructive boundary. It does not create SQL, mutate the production DB, delete data or remove code.

## 2. Confirmed old boundary

Canonical old Emotion Piece row predicate:

```sql
public.mymodel_reflections
where source_type = 'emotion_generated'
```

Automatically excluded:

```text
source_type = create
source_type = generated
all other mymodel_reflections rows
saved input / Emlis / Analysis data
profile / account / subscription data
```

`mymodel_reflections` is shared. No blanket delete, truncate, drop or owner-wide cleanup is permitted.

Old public identity forms include row ID, `reflection:<row-id>`, `public_id`, and old `q_instance_id` lookup variants. Exact columns and related-table key matches must be materialized body-free immediately before destructive cleanup.

## 3. Migration packet sequence

### M0 — tracked baseline

Create the repository-owned migration directory, naming/version rule, migration ledger contract, schema checksum and rollback/verification header.

Exit:

```text
application migration identity is durable
current catalog SHA matches PCE-0 or drift is reconciled
no DDL yet
```

### M1 — legacy read bridge

Create `public.mymodel_reflections_read` as a `security_invoker` projection of the legacy shared table. Rebind every non-new-Piece consumer currently reading `public.pieces`.

Mandatory caller scan includes:

```text
piece_generation_store.py
emlis_ai_readers.py
piece_generated_metrics.py
astor_worker.py
api_piece_runtime.py
piece_public_read_store.py
all COCOLON_PIECES_READ_TABLE references
```

Exit: all shared/legacy callers are proven against the new bridge; `public.pieces` semantics are still unchanged.

### M2 — new Piece foundation

Create disabled new tables, constraints, indexes and immutable catalog reference identities:

```text
piece_records
piece_quota_month_locks
piece_quota_consumptions
piece_record_metrics
piece_record_reads
piece_record_resonances
piece_export_receipts
piece_delete_receipts
```

RLS is enabled and forced. No anon/authenticated direct DML or execute grant is added.

### M3 — atomic functions and staging view

Create service-role-only `piece_save_v2`, `piece_set_visibility_v2`, `piece_delete_v2`, and service-only `pieces_v2_staging`. Add exact grants/revokes and fixed search paths.

Exit requires migration tests for save/quota concurrency, private access, visibility version conflict, delete purge and receipt retention.

### M4 — disabled application integration

Implement backend generation/source/store/access/API, RN preview/history/export and Nexus v2 behind disabled runtime controls. Old product remains the only user-visible path; this is internal staging, not product coexistence.

No old route or row is removed.

### M5 — product clean cutover

One coordinated release packet:

1. enable new Piece generation/preview/save/history/Nexus/export;
2. make old Q&A entry/generation/card unreachable;
3. remove old RN wire callers and registered compat routes;
4. prove legacy `public.pieces` caller exact0;
5. replace `public.pieces` with the new Piece projection;
6. verify private/public/feed/read/resonance/delete/re-export;
7. keep destructive old data cleanup disabled.

User-visible old/new dual run is exact0.

### M6 — body-free old identity capture

After new flow verification, capture:

```text
old emotion_generated row IDs
old public/reflection ID variants
related metrics/read/resonance/echo/log keys
pre-delete exact counts per table
consumer/caller exact0 evidence
new Piece replacement health evidence
```

No Piece/raw/Emlis/Analysis body enters the packet.

### M7 — destructive old Q&A cleanup

Separate Mash approval is required. Use the frozen M6 exact identity set only.

Order:

1. assert current heads/catalog/identity packet;
2. delete exact related state by old instance identities;
3. delete exact `emotion_generated` rows;
4. verify post-delete exact0 for captured IDs;
5. verify `create` / `generated` and unrelated counts unchanged;
6. commit body-free receipt;
7. stop on any mismatch.

No dynamic wider predicate is invented during execution.

### M8 — obsolete contract retirement

After destructive verification and consumer exact0:

```text
remove emotion_generated-only constraint branch/indexes
remove old Q&A store/generation/display/access paths
remove /emotion/reflection/*
remove /nexus/reflections*
remove /mymodel/qna/*
remove old /piece/* Q&A routes
remove api_piece_compat registration
remove old RN Q&A components/adapters
update API registry/docs
```

Preserve `mymodel_reflections`, `create`, `generated` and unrelated readers. File deletion occurs only after exact dependency scans.

## 4. Route/code removal map

Neutral namespaces reused with new semantics:

```text
/emotion/piece/*
/nexus/pieces*
```

Current paths requiring replacement/removal include:

```text
backend:
  api_emotion_piece.py old models
  emotion_piece_store.py
  emotion_piece_generation_service.py
  piece_generated_access.py
  Q&A portions of piece_public_read_service/store
  Q&A portions of api_nexus.py
  api_piece_compat.py
  Piece-facing api_piece_runtime.py routes
  app.py registrations
  API registries/docs

RN:
  InputPiecePreviewController.js
  EmotionPiecePreviewModal.js
  old emotionPieceApi payloads
  Piece legacyWireContracts aliases
  Nexus Q&A normalizers/card
  old RN contract assertions
```

Reusable pure safety or shared helper code is retained only after a caller/test audit proves its owner. The file name “piece” is not sufficient deletion evidence.

## 5. Related state cleanup

Old cleanup candidates:

```text
mymodel_qna_metrics / piece_metrics
mymodel_qna_reads / piece_reads
mymodel_qna_resonances
mymodel_qna_view_logs
mymodel_qna_resonance_logs
mymodel_qna_echoes
discovery logs
```

Each table must have an exact old-instance key mapping. Account/ranking/summary consumers are audited before delete. Owner-wide or q_key-wide blanket deletion is prohibited unless the exact relation proves no unrelated state.

New Piece uses dedicated `piece_record_*` state and does not inherit these old tables.

## 6. Rollout controls

PCE-7 freezes the exact runtime flag owner. Required separable controls are conceptually:

```text
new generation/preview
new storage/save
owner history/visibility
new Nexus feed
RN export
old Q&A reachability
public Piece availability
```

A flag may disable new Piece safely. It must not route users back to old Q&A. New disabled state is explicit and non-destructive.

Partial rollout must not allow:

- new save with old Nexus renderer;
- public save without visibility-safe reads;
- export from unsaved/old Q&A rows;
- old and new quota owners at once;
- old entry point creating rows after clean cutover.

## 7. Rollback

Pre-cutover packets M0–M4 may be rolled back by disabling application calls and reversing only non-destructive migrations whose down path is verified.

Post-cutover rollback target:

```text
new Piece safely disabled
old Q&A not restored
no new writes
existing new records preserved but inaccessible except approved recovery
private data not exposed
monitoring and support message active
```

Destructive M7 has no product rollback to old Q&A. Its rollback is evidence-based STOP before execution, exact snapshot/receipt, and repair of accidental scope only; deleted pre-release Q&A is not remigrated into Piece v2.

## 8. Verification packet

Every migration records:

```text
migration path/version/blob/hash
pre/post schema identity
changed objects
rows affected by exact predicate
RLS/grants/function owners
view definitions
caller search result
rollback state
current repository heads
```

M7 additionally records exact old IDs and per-table counts but no body. Any mismatch stops before the next operation.

## 9. Negative contract / STOP

Prohibited:

```text
untracked console SQL
public.pieces early replacement
blanket shared-table delete/drop
create/generated cleanup
old/new visible dual run
old Q&A migration/adapter
old Q&A restoration rollback
M7 bundled with first DDL
cleanup without frozen IDs
related-state guess by broad q_key/owner
new Piece child state in old qna tables
release without private/query proof
```

STOP if production catalog has drifted, the migration ledger cannot be pinned, a shared consumer remains on `public.pieces`, old identity mapping is incomplete, separate approval for M7 is absent, non-Piece counts change, or new flow verification is not complete.

## 10. Completion

```text
PIECE_CLEAN_CUTOVER_MIGRATION_V1_FIXED
TRACKED_APPLICATION_MIGRATION_BASELINE_REQUIRED
LEGACY_READ_BRIDGE_M1_FIXED
NEW_FOUNDATION_M2_M3_FIXED
DISABLED_STAGING_M4_FIXED
SINGLE_PRODUCT_CUTOVER_M5_FIXED
BODY_FREE_OLD_IDENTITY_CAPTURE_M6_FIXED
DESTRUCTIVE_CLEANUP_M7_SEPARATE_APPROVAL
OBSOLETE_CONTRACT_RETIREMENT_M8_FIXED
SAFE_DISABLED_ROLLBACK_FIXED
OLD_QNA_RESTORATION_EXACT0
DESTRUCTIVE_EXECUTION_EXACT0
PRODUCTION_EFFECT_EXACT0
PCE6_COMPLETE_DESIGN_ONLY
```
