# Cocolon System Context — standard technical entry

status: CURRENT_TECHNICAL_OWNER
revision_date: 2026-08-20
scope: Cocolon System Context Steps 1–5
product_credit: 0
automatic_progression: false

## Purpose

This file is the technical owner routed from
`Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt`.
It does not replace the general work-attitude owner, product canonical owners,
current-structure maps, or Cycle001 navigation.

The standard flow is fixed as follows.

```text
00_read_first
→ workspace resolve
→ inventory freshness
→ task context
→ actual full-text read
→ judgment
```

## One command

Run from the Cocolon repository root.

```bash
python3 -m tools.cocolon_context prepare \
  --workspace cmee_working \
  --task cmee
```

The command resolves exact `Cocolon` and `mashos-api` refs, compares the saved
workspace lock, verifies same-ref bytes, derives added/modified/deleted/renamed/
type-changed paths for changed refs, refreshes stale layers without using the
old context as evidence, recompiles the task context, and writes the result to:

```text
Cocolon_前提資料/system_context/current/cmee_working/prepare_summary.json
Cocolon_前提資料/system_context/current/cmee_working/prepare_summary.md
Cocolon_前提資料/system_context/current/cmee_working/task_context/cmee/
```

The actual full-file reading order is:

```text
Cocolon_前提資料/system_context/current/cmee_working/task_context/cmee/full_text_read_order.md
```

`prepare` is complete only after the execution owner has read the applicable
actual files in that order before making a Cocolon judgment.  The generated
order is not a claim that every file has been permanently memorized.

## Freshness behavior

### Same exact refs

The existing inventory, code index, route graph and task context are reused only
when their manifests, logical output hashes, transport manifests and context
fingerprint all verify.  A mismatch is rejected; it is not silently converted
into a PASS.

### Changed refs

`git diff --name-status -M <old> <new>` is used to retain added, modified,
deleted, renamed and type-changed paths.  The updater records the affected
layers.  A modified non-code path updates only Inventory and Task Context;
Code Index and Route Graph semantic provider payloads are reused, with their
manifest/coverage bindings refreshed against commit-independent file identity.

An ordinary modified source path is reindexed together with its transitive
reverse import/reference dependents.  The provider runs against a sparse
current-commit project, and only rows owned by that affected file set replace
the saved Step 2 rows.  Step 3 builds a scratch candidate, derives the affected
RN call / API route / backend owner / test closure, and merges only changed
rows admitted by that closure.  Any delta outside the closure or any change to
unaffected semantic rows is rejected.

Add/delete/rename/type changes, provider/toolchain/schema/profile changes, and
global route registry / `include_router` / domain-owner changes use the
bounded full-rebuild fallback rather than retaining a stale index.

### Fresh clone

The remotely sealed result must pass `prepare --verify-only` from a distinct
fresh clone with the same exact refs and produce no generated diff.

## Publication transport

Canonical large JSONL output remains canonical logical bytes.  Files exceeding
the Git single-file limit are represented by ordered `.partNNNN` files and a
`publication_transport.json` manifest.  Workspace and nested task-context
transports are independently owned and verified.  Missing, reordered,
duplicate, undeclared or modified parts are rejected.

## Boundaries

This entry does not change RN behavior, API/public contracts, DB/migrations,
production dependencies, CMEE/EmlisAI/Piece/Analysis output, Cycle001,
deployment, release, PR readiness or merge state.  `mashos-api` is read-only.

The only valid final claims are:

```text
STEP5_COCOLON_STANDARD_ENTRY_CONNECTED
COCOLON_SYSTEM_CONTEXT_STEPS1_TO_5_COMPLETE
```

They require remote source/generated-byte verification, same-ref reuse,
non-code incremental rebind, source plus reverse-dependent Step 2 reindex,
affected Step 3 closure refresh, the required global fallback evidence,
task-context regeneration, full-text read-order publication, fresh-clone
deterministic verification, and zero Mash manual operation.  Step 5 does not
automatically advance to any later work.
