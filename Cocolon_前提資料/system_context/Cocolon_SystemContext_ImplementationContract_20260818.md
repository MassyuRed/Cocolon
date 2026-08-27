---
doc_id: cocolon_system_context_implementation_contract_20260818
title: "Cocolon System Context — Steps 1–3 Implementation Contract"
revision_date: "2026-08-19 JST"
implementation_steps: [1, 2, 3]
scope: "Cocolon + mashos-api full file inventory, code index, and RN/API/backend/test/domain route graph"
product_runtime_effect: 0
api_db_rn_contract_effect: 0
automatic_progression: false
---

# Cocolon System Context — Steps 1–3 Implementation Contract

## 0. Purpose

Cocolon work must not start from only recent files. The system treats `MassyuRed/Cocolon` and `MassyuRed/mashos-api` as one implementation surface, while keeping production, CMEE, and Cycle001 workspaces as separate exact Git trees.

This contract establishes the technical context needed to locate every tracked file, its source-level relationships, and the complete RN-to-backend/test product route needed by Step 4. It does not claim that product quality improved, that every unresolved relation has been resolved, or that any Draft is merge-ready.

## 1. Workspace

The generated checkpoint in this branch uses `cmee_working`:

- `Cocolon`: the exact source commit that triggers generation and descends from Draft PR #30.
- `mashos-api`: `agent/cmee-v1a-i1sx-source-explicit-20260815`, exact expected head fixed by `workspace_profiles.json`.

Different Draft PRs are not overlaid into one false tree.

## 2. Step 1 — full tracked-file population

Canonical outputs under `current/cmee_working/`:

- `workspace_lock.json`
- `files.jsonl`
- `classification_summary.json`
- `unresolved.jsonl`
- `manifest.json`

Completion requires one row per Git tracked tree entry, missing path `0`, duplicate repository+path `0`, exact commit/tree/blob/content identity, and visible unresolved classification rather than omission.

## 3. Step 2 — SCIP and syntax index

Required precise providers are:

- `Cocolon` JavaScript/TypeScript: `scip-typescript`.
- `mashos-api` JavaScript/TypeScript: `scip-typescript` when candidate files exist.
- `mashos-api` Python: `scip-python`.

Required-provider failure is not converted into syntax success. Syntax parsing supplements precise SCIP and provides visible fallback or parse-error states.

Canonical outputs under `current/cmee_working/code_index/`:

- `provider_runs.json`
- `file_coverage.jsonl`
- `symbols.jsonl`
- `references.jsonl`
- `import_edges.jsonl`
- `parse_errors.jsonl`
- `unmatched_scip_documents.jsonl`
- `code_index_summary.json`
- `code_index_manifest.json`

Every inventory row must have exactly one coverage row classified as `PRECISE_SCIP`, `SYNTAX_INDEXED`, `PARSE_ERROR_VISIBLE`, `BINARY_REGISTERED`, or `INVENTORY_ONLY_WITH_REASON`. Coverage gaps and duplicate coverage are `0`.

## 4. Step 3 — RN/API/backend/test/domain route graph

### 4.1 RN/API endpoint connection

RN extraction resolves direct paths, imported route constants, nested `Object.freeze` route maps, template paths, imported path-builder functions, query suffixes, transparent wrappers, local method options, URL objects, and bounded config-array endpoints. It records each network call with its method, source file, caller symbol, path candidates, and reverse-import consumer closure.

API extraction reads FastAPI decorators, nested registration functions, `APIRouter` prefixes, `include_router` mounts, request models, and response models from the locked `mashos-api` source tree.

Each detected RN call is either connected or retained with an explicit unresolved reason. Each API route has an explicit consumer classification. Exact and template matches remain distinct.

### 4.2 Backend owner closure — C-1

For each FastAPI route, Python AST and Step 2 import edges trace the bounded call chain:

```text
route handler
→ called function / method
→ application service
→ domain service / engine
→ repository / store / worker
→ DB table / external boundary / terminal owner
```

Cycles close by visited node identity and traversal depth is bounded. Dynamic dispatch, parse failure, or missing owner is never silently cut; the route receives `UNKNOWN_OWNER` and an explicit reason in `unresolved_backend_owners.jsonl`.

Each backend node retains repository, source commit, path, symbol, line, node role, domain, lifecycle, edge source, and resolution status. Node roles include `ROUTE_HANDLER`, `REQUEST_MODEL`, `RESPONSE_MODEL`, `APPLICATION_SERVICE`, `DOMAIN_SERVICE`, `ENGINE`, `STORE_OR_REPOSITORY`, `WORKER`, `SCHEMA_OR_CONTRACT`, `DB_TABLE_REFERENCE`, `EXTERNAL_BOUNDARY`, and `UNKNOWN_OWNER`.

### 4.3 Existing protected test / ordinary test / contract connection — C-2

Existing route-chain coverage is derived from reverse imports, endpoint literals, handler/service/engine/store symbol references, protected-test path metadata, and contract/schema references.

Every API route has one or more existing `PROTECTED_TEST`, `ORDINARY_TEST`, or `CONTRACT` edges, or an explicit `NO_TEST_OR_CONTRACT_WITH_REASON` row. This checkpoint discovers current protection; it does not create product tests in `mashos-api`.

### 4.4 RN visible consumer closure — C-3

The existing reverse-import closure is adjudicated through hook/context/state owners to screens, navigators, and visible components. Every RN call is classified as exactly one of:

- `VISIBLE_SCREEN_CONSUMER`
- `BACKGROUND_OR_CONTEXT_CONSUMER`
- `NO_VISIBLE_CONSUMER_WITH_REASON`

The route does not stop silently at an API adapter.

### 4.5 File domain assignment — C-4

Every inventory file receives one or more tags from the bounded domain set, or explicit `UNRESOLVED_DOMAIN`:

- `EmlisAI`
- `Piece`
- `Analysis`
- `CMEE`
- `shared`
- `account`
- `subscription`
- `notification`
- `history`

Step 1 fields, current structure owners, path, symbol, endpoint, and lifecycle are evidence. Multiple tags are allowed. Unresolved files are not silently classified as `shared`.

### 4.6 Canonical outputs — C-5

Canonical outputs under `current/cmee_working/route_graph/` are:

- `rn_calls.jsonl`
- `api_routes.jsonl`
- `cross_repository_route_edges.jsonl`
- `api_model_edges.jsonl`
- `backend_call_edges.jsonl`
- `route_owner_closures.jsonl`
- `test_contract_edges.jsonl`
- `file_domain_assignments.jsonl`
- `unresolved_rn_calls.jsonl`
- `unresolved_api_consumers.jsonl`
- `unresolved_backend_owners.jsonl`
- `unresolved_test_contracts.jsonl`
- `route_extraction_errors.jsonl`
- `route_graph_summary.json`
- `route_graph_manifest.json`

The v2 manifest binds all canonical outputs to the same Step 1 inventory SHA-256 and Step 2 manifest SHA-256.

### 4.7 Completion — C-6

Step 3 completes only when actual output establishes all of the following:

- all RN calls are connected or explicitly unresolved with reason;
- all API routes have an allowed consumer classification or explicit unresolved reason;
- all RN-connected routes have backend closure or explicit unresolved backend-owner reason;
- all route chains have an existing test/contract edge or `NO_TEST_OR_CONTRACT_WITH_REASON`;
- all RN calls have visible/background/no-visible consumer classification;
- all chain-node files have domain tags or `UNRESOLVED_DOMAIN`;
- all IDs are unique and all output hashes verify;
- `silent_unresolved_count = 0`.

The only full Step 3 completion claim is:

```text
STEP3_RN_API_BACKEND_TEST_ROUTE_GRAPH_CONNECTED
```

The former endpoint-only claim `STEP3_RN_API_CROSS_REPOSITORY_ROUTE_GRAPH_CONNECTED` is an internal predecessor validated before C extension; it is not the final Step 3 claim.

## 5. Operation

The implementation uses these CLIs:

```text
python3 tools/cocolon_context_inventory.py build|verify ...
python3 tools/cocolon_context_code_index.py run-scip|build|verify ...
python3 tools/cocolon_context_routes.py build|verify ...
```

GitHub Actions checks out both repositories, installs the pinned SCIP toolchain, runs unit tests, rebuilds the exact inventory, builds and verifies Steps 2 and 3, and commits only generated `current/cmee_working` outputs back to the same Draft branch.

## 6. Boundaries

This implementation does not change RN production behavior, API production behavior, public route contracts, DB, migrations, product dependencies, CMEE output, EmlisAI output, Piece, Analysis, merge state, or release state.

No `mashos-api` write is authorized. Unresolved rows are context evidence, not defects silently reclassified as success. Step 4 task-context compilation, PR-body update, ready conversion, and merge are outside this C1-C6 checkpoint.

`STRUCTURE_MAP_DELTA_NONE`: System Context metadata closure only; product flow, runtime owner, public API, DB, RN behavior, and core boundaries are unchanged.

`product_credit=0`  
`automatic_progression=false`
