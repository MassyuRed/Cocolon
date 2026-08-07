---
doc_id: piece_new_data_contract_design_20260808
title: "Piece new data contract design"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
phase: "PCE-6 API / DB / RN / Migration Design"
document_status: "PCE6_COMPLETE_DESIGN_ONLY"
contract_id: "piece.data_contract.v1"
source_cocolon_head: "96df30f6cdda8f4549065a3b2156c5b75d36026e"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_supabase_catalog_sha256: "2f51e5e6e4207a186aaacbeb355c07ade3b4f777960f3f46d1dbea9f8f9d810e"
automatic_progression: false
production_effect: "exact0"
---

# Piece new data contract design

## 1. Decision

```text
selected storage:
  dedicated new Piece table family

record table:
  public.piece_records

new Piece read projection after cutover:
  public.pieces

legacy shared-table read bridge:
  public.mymodel_reflections_read

mymodel_reflections extension as new Piece owner:
  rejected

image binary as record/feed source:
  exact0
```

`mymodel_reflections` is shared by `create`, `generated`, and `emotion_generated`. It requires old Q&A fields, uses `reflection:<uuid>`, old lifecycle and `published_at` quota. New lifecycle, visibility, source lineage, content, visual recipe and exact-once quota therefore receive a dedicated owner.

## 2. Confirmed current basis

```text
write table:
  public.mymodel_reflections

read view:
  public.pieces
  security_invoker = true

question / answer:
  NOT NULL

source_type:
  create / generated / emotion_generated

RLS:
  enabled
  forced false
  policy exact0

tracked application migration:
  absent
```

`public.pieces` is not old Emotion Piece only. Generated-reflection, Emlis, worker, metrics and runtime readers also use it. It must not be replaced until those consumers move to `mymodel_reflections_read`.

## 3. Physical family

```text
public.piece_records
public.piece_quota_month_locks
public.piece_quota_consumptions
public.piece_record_metrics
public.piece_record_reads
public.piece_record_resonances
public.piece_export_receipts
public.piece_delete_receipts
```

New Piece does not reuse old `mymodel_qna_*` child tables.

## 4. `piece_records`

Required groups:

```text
identity:
  id
  generated unique public_id = piece:<uuid>
  owner_user_id
  piece_contract_version = piece.record.v2

source lineage:
  source_lineage_version
  source_input_id / version / bundle commitment
  Emlis observation stage / result identity
  optional question-decision identity
  refined-only supplemental-answer identity
  body-free source roles

state:
  lifecycle_status
  visibility_scope default private
  preview_revision
  row_version
  expires_at / saved_at

content:
  format_type
  content contract / payload version
  content_payload / hash
  canonical piece_text / hash
  safety contract / coarse state

visual:
  visual recipe / version / hash
  catalog version
  export / render / reproducibility / layout versions

exact-once:
  save_idempotency_key_hash
  server timestamps
```

Checks:

```text
lifecycle:
  preview_draft / saved / cancelled / rejected / expired / deleted

visibility:
  private / public
  missing -> private
  unknown -> reject

format:
  short_essay / quote / declaration

safety:
  ready / adjusted
  unavailable row exact0

supplemental identity:
  refined stage only

saved:
  saved_at and save idempotency non-null
  expires_at null

title field:
  initial exact0
```

`deleted` may exist only inside the delete transaction. Canonical body and record-owned state are physically purged before commit; a normal readable deleted row is exact0.

Forbidden stored bodies:

```text
raw input
supplemental answer body
Emlis visible/internal body
Analysis inference/simulation
safety matched source/trace
profile/friend code
PNG bytes
external recipient
```

## 5. Quota and record-owned state

`piece_quota_month_locks` owns `(owner_user_id, month_key)` and serializes concurrent saves.

`piece_quota_consumptions` is body-free and stores owner, logical piece ID, JST month, tier at consumption, consumed time, idempotency hash, reason and contract version.

```text
unique:
  piece_id
  owner + save idempotency hash

FK to piece_records:
  exact0

delete refund:
  exact0
```

The ledger survives physical Piece deletion. Premium is recorded but limit enforcement remains unlimited.

```text
piece_record_metrics:
  piece_id PK/FK ON DELETE CASCADE

piece_record_reads:
  piece_id + viewer PK
  FK ON DELETE CASCADE

piece_record_resonances:
  piece_id + viewer PK
  FK ON DELETE CASCADE
  owner self-resonance prohibited
```

Export and delete receipts retain IDs, hashes, coarse result/error class and timestamps only. They contain no body, full local path, external app or recipient.

## 6. Atomic RPCs

### `piece_save_v2`

One service-role-only transaction:

1. lock owner preview row;
2. verify lifecycle, expiry, revision and text/content/recipe hashes;
3. return prior result for the same idempotency key;
4. resolve tier and limit server-side;
5. lock owner/JST-month row;
6. enforce quota ledger limit;
7. update preview to saved with selected visibility;
8. insert quota consumption exact1;
9. return record and consumption identities.

```text
response-loss retry:
  same record / same consumption

successful concurrent over-limit save:
  exact0

client tier or limit trusted:
  exact0
```

### `piece_set_visibility_v2`

Requires owner, piece ID, expected row version and target visibility. It preserves record/text/format/recipe/quota and increments row version. Every public read rechecks current visibility.

### `piece_delete_v2`

Requires owner, expected row version and idempotency identity. It writes a body-free receipt, purges child state and the canonical record in one transaction, retains quota/receipts, and returns the same receipt on retry.

All RPCs use fixed `search_path`; PUBLIC, anon and authenticated execute are revoked; only bounded service-role execution is granted.

## 7. RLS and projections

```text
base tables:
  RLS ENABLE + FORCE

anon/authenticated direct base DML:
  exact0

RN:
  backend API only

authorization:
  application service + current viewer relation
  service-role possession is not authorization proof
```

Private, deleted, inaccessible and nonexistent records all return not-found-equivalent responses to non-owners.

Cutover order:

1. create `public.mymodel_reflections_read` over the legacy shared table;
2. rebind every non-new-Piece `public.pieces` caller;
3. create service-only `public.pieces_v2_staging` over `piece_records`;
4. prove legacy `public.pieces` caller exact0;
5. replace `public.pieces` with the new Piece projection.

No raw source or internal safety material is projected.

## 8. Index and ownership requirements

Indexes cover owner history, public feed, source lookup, preview expiry, save idempotency, quota month, reads and resonances. `source_input_id` alone is not unique because one saved input may intentionally create multiple new Piece records.

```text
DDL owner:
  mashos-api/supabase/migrations/

atomic store/access:
  PCE-9A

generation:
  PCE-9B

source adapter:
  PCE-9C

RN/history:
  PCE-9D

renderer/export:
  PCE-9E

public feed:
  PCE-9F

RED/monitoring/rollback:
  PCE-7
```

Exact new implementation filenames are frozen in PCE-8, not guessed here.

## 9. Negative contract / STOP

Prohibited:

```text
new Piece in mymodel_reflections
Q&A placeholders
visibility from published_at
quota from surviving rows
public.pieces early replacement
broad direct-client grants
body in receipt/ledger
quota cascade on delete
separate save/quota transactions
old Q&A child-table reuse
image binary as record source
untracked migration
```

STOP if the current catalog drifts, tracked migration cannot be established, a legacy `public.pieces` consumer remains, private safety needs broad grants, save/quota or delete/purge cannot be atomic, exact old cleanup cannot isolate `emotion_generated`, or rollback requires old Q&A restoration.

## 10. Completion

```text
PIECE_DATA_CONTRACT_V1_FIXED
NEW_PIECE_TABLE_FAMILY_SELECTED
PIECE_RECORDS_PHYSICAL_OWNER_FIXED
LEGACY_READ_BRIDGE_FIRST_FIXED
ATOMIC_SAVE_QUOTA_FIXED
ATOMIC_VISIBILITY_DELETE_FIXED
DEDICATED_STATE_AND_BODY_FREE_RECEIPTS_FIXED
RLS_FORCE_API_SERVICE_OWNER_FIXED
IMAGE_BINARY_SOURCE_EXACT0
PRODUCTION_EFFECT_EXACT0
PCE6_COMPLETE_DESIGN_ONLY
```
