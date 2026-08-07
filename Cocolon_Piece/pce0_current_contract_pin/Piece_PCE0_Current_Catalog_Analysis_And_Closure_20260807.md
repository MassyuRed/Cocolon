---
doc_id: piece_pce0_current_catalog_analysis_and_closure_20260807
title: "Piece PCE-0 current production catalog analysis and closure"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-0 Current Contract Pin"
document_status: "PCE0_COMPLETE_CURRENT_CONTRACT_PINNED"
source_cocolon_head_before_result: "e23f4c40613fb7cbcb32149416cc87372d784067"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
supabase_packet_sha256: "2f51e5e6e4207a186aaacbeb355c07ade3b4f777960f3f46d1dbea9f8f9d810e"
automatic_progression: false
pce1_activated: false
production_effect: "exact0"
---

# Piece PCE-0 current production catalog analysis and closure

## 1. 結論

MashがSupabase SQL Editorで取得したV2 catalog packetにより、PCE-0で未確認だったcurrent production DB / view / RLS / grant / migration-owner状態を固定できた。

```text
PCE-0:
  COMPLETE

PCE-1:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

application migration history relationが存在しないことは、current catalogを未確認へ戻す理由ではない。current catalog自体をactual baselineとし、future DDL前にtracked application migration ownerをPCE-6で新設する。

## 2. Evidence identity

```text
packet version:
  pce0.current_supabase_piece_catalog.v2

captured_at_utc:
  2026-08-07T09:41:56.410491

UTF-8 bytes:
  26484

SHA-256:
  2f51e5e6e4207a186aaacbeb355c07ade3b4f777960f3f46d1dbea9f8f9d810e
```

Lossless GitHub bundle:

```text
PCE0_Current_Supabase_Piece_Catalog_Result_20260807.json.gz.b64
PCE0_Current_Supabase_Piece_Catalog_Result_20260807.bundle.json
```

The packet contains catalog / metadata only. It contains no user input text, Piece body, profile/contact data, credential, connection string, or raw application row.

## 3. Physical and read identities

```text
physical write table:
  public.mymodel_reflections
  relation kind: table
  owner: postgres

current read view:
  public.pieces
  relation kind: view
  owner: postgres
  security_invoker: true
  definition: direct projection of all 21 mymodel_reflections columns
  filter / rewrite / visibility predicate: exact0

public.pieces_read:
  NOT_PRESENT
```

GitHub source defaults agree:

```text
write:
  MYMODEL_REFLECTIONS_TABLE -> mymodel_reflections

read:
  COCOLON_PIECES_READ_TABLE / fallback -> pieces
```

Therefore `pieces` is the current read owner. `pieces_read` is not a current DB object and must not be used as a future design premise.

## 4. Current row contract

### source_type

```text
create
generated
emotion_generated
```

The current Piece write uses `emotion_generated`; the database constraint accepts it. The historical create/generated-only audit is stale as a current statement.

### lifecycle status

```text
draft
ready
rejected
failed
archived
```

Current emotion-Piece writes are compatible:

```text
preview: draft / inactive
publish: ready / active
cancel: rejected / inactive
```

Current read code still accepts `ready,published`; `published` is not in the current DB CHECK. Because current writes use `ready`, this is not a PCE-0 write blocker. It remains a compatibility-cleanup candidate for version-aware read design.

### required fields

```text
question: NOT NULL + nonempty
answer: NOT NULL + nonempty
content_json: NOT NULL, default {}
public_id: generated always as reflection:<id>
```

These match the current preview/publish payload and public-id handling.

## 5. RLS, grants, and access owner

```text
public.mymodel_reflections:
  RLS enabled: true
  RLS forced: false
  policy count: exact0

public.pieces:
  security_invoker: true
  service_role SELECT: present
  postgres SELECT: present
  anon/authenticated direct SELECT grant: exact0
```

The backend Supabase client uses `SUPABASE_SERVICE_ROLE_KEY`. Owner/follow/MyProfile visibility is implemented by backend application services before rows are returned.

Current architectural owner:

```text
database policy-owned public visibility:
  false

backend application-owned Piece visibility:
  true

RN direct DB read owner:
  false
```

This resolves the current access-owner question. Role attributes such as `rolbypassrls` and deployed endpoint smoke were not in the packet; they remain PCE-7 runtime/release verification, not PCE-0 design blockers.

## 6. Index, trigger, and deletion implications

Confirmed indexes include:

```text
generated source:
  owner + q_key partial unique
  owner + topic_key partial unique

create source:
  owner + question_id partial unique

emotion_generated source:
  dedicated uniqueness constraint exact0
```

Current emotion-generated rows can therefore share a q_key; this is consistent with the current store rule that does not archive sibling rows. Concurrent publish and future quota semantics remain PCE-3 work.

Confirmed trigger:

```text
trg_touch_mymodel_reflections_updated_at
BEFORE UPDATE
```

No owner FK/cascade appeared in the returned target constraint set. Owner deletion, related metrics/read/resonance cleanup, and account-delete atomicity remain PCE-3/PCE-7 verification items.

## 7. Migration owner disposition

Expected application relation:

```text
supabase_migrations.schema_migrations:
  NOT_PRESENT
```

Observed candidate relations:

```text
auth.schema_migrations
realtime.schema_migrations
storage.migrations
```

They are Supabase subsystem-internal owners and must not substitute for Cocolon application migration history.

Disposition:

```text
PCE0-U003 prior state:
  BLOCKING_PCE0

current state:
  RESOLVED_AS_CURRENT_APPLICATION_MIGRATION_OWNER_ABSENCE
  CARRY_TO_PCE6_PRECONDITION
```

PCE-6 must first create a tracked application migration baseline bound to this catalog snapshot, before any additive DDL / view / RLS migration.

## 8. PCE-0 blocker disposition

| item | disposition |
|---|---|
| PCE0-U001 current DDL / source_type constraint | RESOLVED |
| PCE0-U002 RLS / grants / access owner | RESOLVED_FOR_CURRENT_ARCHITECTURE |
| PCE0-U003 migration head / owner | RESOLVED_AS_OWNER_ABSENCE; CARRY_TO_PCE6 |
| PCE0-U004 canonical read view identity | RESOLVED |
| PCE0-U009 aggregate row distribution | DEFERRED_NONBLOCKING |
| service-role role attribute / endpoint smoke | CARRY_TO_PCE7 |
| full Piece / Nexus test execution | CARRY_TO_PCE7 |

```text
OPEN_BLOCKING_PCE0_ITEMS:
  exact0

PCE0_FORMAL_COMPLETION:
  TRUE

PCE1_ACTIVATED:
  FALSE
```

## 9. Inputs fixed for PCE-1

1. Physical table is `mymodel_reflections`.
2. Current read view is `pieces`.
3. Existing records are implicit Q&A shape.
4. `format_type`, `piece_contract_version`, `visual_recipe`, and per-Piece visibility do not exist.
5. Current public/read access is backend application-owned.
6. Q&A is one Piece format, not Piece identity.
7. Existing rows do not require automatic bulk migration based on PCE-0 evidence.
8. Future DDL requires a tracked migration baseline before PCE-6 implementation.

The first PCE-1 product decision is whether existing Q&A remains a user-selectable active format after visual Piece introduction, or becomes compatibility-only for existing records.

## 10. Effects

```text
Cocolon production source change: exact0
mashos-api production source change: exact0
DB / API / RN / migration change: exact0
test / runtime execution: exact0
EmlisAI technical state effect: exact0
PCE-0: COMPLETE
PCE-1: NOT_ACTIVATED
automatic progression: false
```
