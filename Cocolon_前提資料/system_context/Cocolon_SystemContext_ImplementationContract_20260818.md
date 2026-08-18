---
doc_id: cocolon_system_context_implementation_contract_20260818
title: "Cocolon System Context — Steps 1–3 Implementation Contract"
revision_date: "2026-08-18 JST"
implementation_steps: [1, 2, 3]
scope: "Cocolon + mashos-api full file inventory, code index, and RN/API route graph"
product_runtime_effect: 0
api_db_rn_contract_effect: 0
automatic_progression: false
---

# Cocolon System Context — Steps 1–3 Implementation Contract

## 0. Purpose

Cocolon work must not start from only recent files. The system treats `MassyuRed/Cocolon` and `MassyuRed/mashos-api` as one implementation surface, while keeping production, CMEE, and Cycle001 workspaces as separate exact Git trees.

This contract establishes the technical context needed to locate every tracked file, its source-level relationships, and the RN-to-API product route. It does not claim that product quality improved, that every unresolved relation has been resolved, or that any Draft is merge-ready.

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

## 4. Step 3 — RN/API cross-repository route graph

RN extraction resolves direct paths, imported route constants, nested `Object.freeze` route maps, template paths, and imported path-builder functions. It records each network call with its method, source file, caller symbol, path candidates, and visible consumer closure through local import edges.

API extraction reads FastAPI decorators, `APIRouter` prefixes, `include_router` mounts, request models, and response models from the locked `mashos-api` source tree.

Canonical outputs under `current/cmee_working/route_graph/`:

- `rn_calls.jsonl`
- `api_routes.jsonl`
- `cross_repository_route_edges.jsonl`
- `api_model_edges.jsonl`
- `unresolved_rn_calls.jsonl`
- `unresolved_api_consumers.jsonl`
- `route_extraction_errors.jsonl`
- `route_graph_summary.json`
- `route_graph_manifest.json`

Each detected RN call is either connected to an API route or present in `unresolved_rn_calls.jsonl`. Each API route is classified as RN-consumed, external public, infrastructure, or unresolved consumer. Exact and template matches remain distinct. Silent unresolved count is `0`.

Step 3 completes only when RN calls `> 0`, API routes `> 0`, cross-repository route edges `> 0`, all identities are unique, all outputs verify against the same Step 1 inventory and Step 2 manifest, and the completion claim is `STEP3_RN_API_CROSS_REPOSITORY_ROUTE_GRAPH_CONNECTED`.

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

Unresolved rows are evidence for later context compilation; they are not defects silently reclassified as success. Step 4 task-context compilation is not authorized by this checkpoint.

`product_credit=0`  
`automatic_progression=false`
