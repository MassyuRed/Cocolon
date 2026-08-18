---
doc_id: cocolon_system_context_implementation_contract_20260818
title: "Cocolon System Context — Step 1 and Step 2 Implementation Contract"
revision_date: "2026-08-18 JST"
current_implementation_step: 2
scope: "Cocolon + mashos-api full tracked-file inventory, SCIP, and syntax index"
product_runtime_effect: 0
api_db_rn_contract_effect: 0
automatic_progression: false
---

# Cocolon System Context — Implementation Contract

## 0. Purpose

This system removes one observed cause of structural misreading: a Cocolon discussion can begin from recent files while implementation, tests, configuration, premise material, or active Draft files elsewhere in `MassyuRed/Cocolon` or `MassyuRed/mashos-api` are absent from the working context.

It is an engineering context source, not a product-quality substitute. It does not modify RN behavior, API behavior, DB behavior, EmlisAI output, Piece output, Analysis output, or CMEE output.

## 1. Workspace boundary

The system treats two repositories as one Cocolon implementation surface:

- `MassyuRed/Cocolon`: RN application plus premise, product, and design owners.
- `MassyuRed/mashos-api`: API, backend services, engines, storage, workers, and contracts.

Different Draft PRs are not overlaid into one false tree. `workspace_profiles.json` retains separate `production_main`, `cmee_working`, and `cycle001_working` views. The current generated checkpoint is `cmee_working`.

## 2. Step 1 — complete tracked-file population

Step 1 owns the exact file denominator. Its canonical output contains:

- `workspace_lock.json`
- `files.jsonl`
- `classification_summary.json`
- `unresolved.jsonl`
- `manifest.json`

Completion requires:

```text
Git tracked tree entries
  = files.jsonl unique repository+path rows

missing tracked path
  = 0

duplicate repository+path
  = 0
```

Every row carries repository, source commit, source tree, path, Git object identity, content SHA-256, size, content kind, initial role, lifecycle, domain, and classification status. Unknown classification remains inside the denominator as `UNRESOLVED`; it is not discarded or treated as understood.

## 3. Step 2 — precise SCIP plus syntax analysis

Step 2 adds a second layer without replacing Step 1. It is exposed through one CLI and a small set of responsibility-separated sibling modules; this avoids one oversized implementation file while keeping one execution entrypoint.

### 3.1 Pinned precise indexers

The exact toolchain is declared in `workspace_profiles.json`:

- Node major 20
- `@sourcegraph/scip-typescript` 0.4.0
- `@sourcegraph/scip-python` 0.6.6
- SCIP CLI v0.7.1
- TypeScript syntax parser 5.2.2

Required precise runs are:

1. Cocolon JavaScript/TypeScript.
2. mashos-api Python.
3. mashos-api JavaScript/TypeScript when its exact candidate count is nonzero.

A required run is valid only when its indexer exits 0, produces a SCIP file, `scip print --json` exits 0, and at least one SCIP document is present. A failed required run does not disappear behind syntax fallback; the result is `STEP2_PARTIAL_INDEX_STOP` and is not published as complete.

### 3.2 Syntax layer

Syntax analysis covers the entire locked denominator according to file type:

- JavaScript/TypeScript: TypeScript compiler AST for declarations, imports, exports, `require`, and dynamic imports.
- Python: Python AST for classes, functions, and imports.
- Other code: visible lexical declarations and imports.
- Markdown/RST: headings and links.
- JSON: key paths and `$ref`.
- YAML: key paths and file/action references.
- SQL: declared and referenced relations.
- dotenv, XML, and other supported configuration text: bounded structural extraction.

Files that are binary, lockfiles, generated projections, non-blobs, or unsupported extensions remain present with `INVENTORY_ONLY_SUPPORTED_REASON`. Parse failures remain present as `PARSE_ERROR_VISIBLE`. Silent omission is forbidden.

### 3.3 Canonical Step 2 outputs

`current/cmee_working/code_index/` contains:

- `indexer_runs.json`: pinned tool identity and precise-run result.
- `coverage.jsonl`: exactly one coverage row per Step 1 inventory row.
- `symbols.jsonl`: precise definitions and syntax definitions where precise output is absent.
- `references.jsonl`: repository-local precise references and syntax module/resource references.
- `file_dependencies.jsonl`: resolved file-to-file edges.
- `parse_errors.jsonl`: visible parser and SCIP-document errors.
- `code_index_summary.json`: exact counts and bounded completion state.
- `manifest.json`: input/output hashes and completion identity.

Raw user input, private Product Read bodies, credentials, environment values, and source bodies are not copied into these outputs.

## 4. Step 2 completion

Step 2 is complete only when:

```text
coverage rows
  = Step 1 inventory rows

coverage gap
  = 0

duplicate coverage key
  = 0

all required SCIP runs
  = valid

SCIP precise file count
  > 0

all remaining files
  = syntax indexed
    or parse error visible
    or inventory-only with explicit reason
```

The completion code is:

```text
STEP2_SCIP_AND_SYNTAX_INDEX_CONNECTED
```

This proves only that exact file population, precise code indexing, syntax indexing, and explicit fallback classification are connected. It does not prove that RN/API routes are linked, that every symbol relation is semantically correct, or that Cocolon product quality improved.

## 5. Snapshot and verification boundary

Generated outputs are deterministic projections of the source commit that triggers the workflow. This avoids self-referential Git identities.

- The source commit contains implementation, configuration, tests, and the prior generated checkpoint.
- The generated commit adds the inventory and code-index projection of that exact source commit.
- Step 1 verification regenerates the locked inventory byte-for-byte.
- Step 2 verification checks the inventory identity, exact output hashes, coverage denominator, duplicate keys, counts, and completion identity.
- Precise-run versions, commands, source commits, candidate counts, exit states, and SCIP JSON identities are recorded in `indexer_runs.json`.

Raw `.scip` and expanded SCIP JSON are temporary workflow inputs and are not committed. The committed normalized graph contains only repository identities, locations, symbols, references, dependencies, counts, and errors.

## 6. Prohibited expansion

Step 2 does not:

- modify production RN, API, DB, public contracts, dependencies, or user-visible output;
- merge or ready Draft PRs;
- mix CMEE and Cycle001 trees;
- create RN-to-API route linkage or a task-context compiler;
- treat syntax fallback as a successful required SCIP run;
- call machine completeness product acceptance;
- start Step 3 automatically.

`product_credit=0` and `automatic_progression=false` remain fixed.
