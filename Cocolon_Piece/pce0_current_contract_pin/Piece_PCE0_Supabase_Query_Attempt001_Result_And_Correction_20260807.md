---
doc_id: piece_pce0_supabase_query_attempt001_result_and_correction_20260807
title: "Piece PCE-0 Supabase evidence query Attempt 001 result and correction"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
phase: "PCE-0 Current Contract Pin"
attempt_id: "PCE0_SUPABASE_EVIDENCE_ATTEMPT_001"
result: "NONCREDIT_QUERY_DESIGN_FAILURE"
automatic_progression: false
production_effect: "exact0"
---

# Piece PCE-0 Supabase evidence query Attempt 001 result and correction

## 1. Observed result

Mash executed:

```text
Cocolon_Piece/pce0_current_contract_pin/
PCE0_Current_Supabase_Piece_Schema_RLS_Migration_Query_20260807.sql
```

Observed terminal error:

```text
SQLSTATE: 42P01
relation "supabase_migrations.schema_migrations" does not exist
line: 156
```

## 2. Confirmed fact

The exact relation below was not resolvable in that Supabase SQL session:

```text
supabase_migrations.schema_migrations
```

This is valid body-free evidence for the exact expected migration-history relation.

## 3. What this does not prove

The error does not prove any of the following:

- no migration has ever been applied;
- no migration-history relation exists under another schema or name;
- the current `mymodel_reflections` DDL is old;
- the current source-type constraint is incompatible;
- the current RLS or view contract is broken.

## 4. Why Attempt 001 receives no PCE-0 credit

V1 contained the following known unsafe construction:

```sql
from supabase_migrations.schema_migrations m
```

The file comment already acknowledged that this statement could fail when the relation was absent, but it still placed the direct reference inside the same execution packet.

Because Mash returned only the terminal error and not the preceding result sets, sections A-I and K-L are not adopted as current evidence. The attempt therefore closes as:

```text
QUERY_EXECUTION:
  failed at section J

PCE0_BLOCKERS_CLOSED:
  exact0

DATABASE_EFFECT:
  exact0

PCE0_COMPLETION:
  false

PCE1_ACTIVATION:
  false
```

## 5. Corrected execution owner

Current query:

```text
PCE0_Current_Supabase_Piece_Catalog_Query_20260807_V2.sql
```

V2 characteristics:

- one SELECT statement;
- one JSONB result packet;
- catalog-only;
- no direct reference to uncertain application or migration relations;
- no application-row export;
- migration candidate relations are discovered through catalogs;
- row aggregate evidence is deferred because it is non-blocking for PCE-0 and should not be queried before the exact columns are confirmed.

## 6. Current interpretation of migration history

Until V2 returns:

```text
expected migration relation:
  NOT_RESOLVED_IN_ATTEMPT_001

exact observed relation error:
  supabase_migrations.schema_migrations -> 42P01 NOT PRESENT

migration history elsewhere:
  UNCONFIRMED
```

## 7. Next exact action

Mash runs the V2 SQL once in Supabase SQL Editor and returns the single JSON packet.

No other Supabase action, migration execution, DDL change, row export, token, or secret is requested.
