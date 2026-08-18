---
doc_id: cocolon_system_context_implementation_contract_20260818
title: "Cocolon System Context — Step 1/2 Implementation Contract"
revision_date: "2026-08-18 JST"
implementation_step: 2
scope: "Cocolon + mashos-api full tracked-file inventory plus SCIP/syntax code index"
product_runtime_effect: 0
api_db_rn_contract_effect: 0
automatic_progression: false
---

# Cocolon System Context — Step 1/2 Implementation Contract

## 0. Purpose

This system prevents Cocolon discussion and design from starting from only recent files. It treats `MassyuRed/Cocolon` and `MassyuRed/mashos-api` as one implementation surface while preserving separate workspace profiles for production, CMEE, and Cycle001 Draft trees.

Step 1 established the exact complete tracked-file denominator. Step 2 attaches code-meaning indexes without reducing that denominator.

## 1. Repositories and workspace profiles

The system indexes:

- `MassyuRed/Cocolon`: RN application plus premise/product/design owners.
- `MassyuRed/mashos-api`: API/backend/services/engines/storage/workers/contracts.

`workspace_profiles.json` keeps at least:

- `production_main`
- `cmee_working`
- `cycle001_working`

Different Draft PRs are never overlaid into one false tree.

## 2. Step 1 canonical outputs

For one locked workspace:

- `workspace_lock.json`
- `files.jsonl`
- `classification_summary.json`
- `unresolved.jsonl`
- `manifest.json`

Every tracked Git tree entry remains in `files.jsonl`, including unresolved, binary, generated, historical, and support files.

## 3. Step 2 code-index outputs

`code_index/` adds:

- `coverage.jsonl`: exactly one row for every Step 1 inventory row.
- `symbols.jsonl`: SCIP or syntax-derived symbol definitions.
- `references.jsonl`: SCIP occurrences/import references plus syntax fallback references.
- `code_index_summary.json`: exact denominator coverage and index-mode counts.

The Step 2 denominator is the Step 1 `files.jsonl` row count. SCIP success is not allowed to redefine the denominator.

## 4. SCIP and syntax responsibility split

### Precise indexing

Where supported and successfully generated:

- JavaScript / TypeScript: `scip-typescript`.
- Python: `scip-python`.

The workflow converts `index.scip` into JSON with `scip print --json` and retains only normalized Cocolon JSONL outputs in Git. Raw `.scip` files are temporary CI artifacts and are not canonical repository state.

### Syntax fallback

If SCIP is unavailable, fails, or does not emit a document for an eligible source file, Step 2 still indexes the source with deterministic syntax fallback:

- Python: stdlib `ast` for definitions/imports.
- JavaScript / TypeScript: bounded import/function/class extraction.
- Other supported source extensions: bounded declaration extraction.

Such rows are explicitly marked `SYNTAX_FALLBACK_SCIP_ELIGIBLE` or `SYNTAX_INDEXED`; they are not reported as precise SCIP results.

### Inventory-only

Binary, non-source, and unsupported entries remain `INVENTORY_ONLY` with an explicit reason. They stay part of `coverage.jsonl`.

## 5. Completion conditions

Step 2 is complete only when:

```text
coverage.jsonl row count
  = Step 1 total tracked entries

coverage gap count
  = 0

Each tracked entry is exactly one of:
  SCIP_PRECISE_INDEXED
  SYNTAX_FALLBACK_SCIP_ELIGIBLE
  SYNTAX_INDEXED
  INVENTORY_ONLY

SCIP failure or missing language support
  != silent omission

symbols/references retain repository key + path
```

Step 2 does not require all source languages to have a precise SCIP index. It requires complete population coverage and truthful index mode per file.

## 6. Snapshot boundary

Generated inventory/code-index commits are deterministic projections of their parent source commit. `workspace_lock.json` records the source commit/tree. Verification uses those locked source commits, not the generated commit as if it could index itself.

## 7. GitHub operation

The single workflow checks out Cocolon and the locked mashos-api workspace side-by-side, then:

1. runs Step 1 and Step 2 unit tests;
2. rebuilds and verifies the Step 1 inventory;
3. installs SCIP indexers;
4. generates TypeScript/JavaScript and Python SCIP indexes when possible;
5. converts raw SCIP to JSON;
6. merges SCIP data with syntax fallback;
7. asserts full Step 1 denominator coverage;
8. commits only generated `system_context/current/cmee_working` outputs.

No Sourcegraph server, database, model API, or paid external service is required.

## 8. Prohibited expansion

Step 2 does not:

- modify RN or API production behavior;
- change DB/public contracts/dependencies used by the product runtime;
- claim CMEE/EmlisAI/Piece/Analysis product quality improvement;
- perform RN↔API route linkage (Step 3);
- compile task-specific context or claim semantic understanding of all files (Step 4);
- merge/ready Draft PRs or automatically progress to Step 3.

`product_credit=0` and `automatic_progression=false` remain fixed.
