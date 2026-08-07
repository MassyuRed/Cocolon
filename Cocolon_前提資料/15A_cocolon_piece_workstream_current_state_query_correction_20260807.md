---
doc_id: cocolon_piece_workstream_current_state_query_correction_20260807
title: "Cocolon Piece Workstream Current State — Supabase query correction"
revision_date: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
correction_type: "ADDITIVE_CURRENT_POINTER_CORRECTION"
supersedes_scope: "15_cocolon_piece_workstream_current_state.md section 7 query path only"
automatic_progression: false
---

# Cocolon Piece Workstream Current State — Supabase query correction

## 1. Current correction

The query named in section 7 of `15_cocolon_piece_workstream_current_state.md` is no longer the current execution query.

Historical Attempt 001 query:

```text
Cocolon_Piece/pce0_current_contract_pin/
PCE0_Current_Supabase_Piece_Schema_RLS_Migration_Query_20260807.sql
```

Observed result:

```text
SQLSTATE 42P01
relation "supabase_migrations.schema_migrations" does not exist
line 156
```

Current execution query:

```text
Cocolon_Piece/pce0_current_contract_pin/
PCE0_Current_Supabase_Piece_Catalog_Query_20260807_V2.sql
```

## 2. Current phase state

```text
PCE-0 formal completion:
  false

PCE-0 blockers closed by Attempt 001:
  exact0

confirmed new fact:
  expected migration relation is not present in the observed SQL session

migration history under another relation:
  unconfirmed

PCE-1 activated:
  false

automatic progression:
  false
```

## 3. Why V2 is required

V1 directly referenced an uncertain migration relation in the same multi-statement packet. V2 uses one catalog-only SELECT and returns one JSONB packet. It does not directly read uncertain application or migration relations.

The body-free application-row aggregate is deferred because it is non-blocking for PCE-0 and should be designed only after exact catalog columns are confirmed.

## 4. Current evidence owner

```text
Cocolon_Piece/pce0_current_contract_pin/
  Piece_PCE0_Supabase_Query_Attempt001_Result_And_Correction_20260807.md
  PCE0_Query_Correction_Manifest_20260807.json
  PCE0_Current_Supabase_Piece_Catalog_Query_20260807_V2.sql
```

This correction does not change production source, DB, API, RN, migration, runtime, EmlisAI state, or release state.
