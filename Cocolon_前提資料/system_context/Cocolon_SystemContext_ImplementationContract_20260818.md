---
doc_id: cocolon_system_context_implementation_contract_20260818
title: "Cocolon System Context — Step 1 Implementation Contract"
revision_date: "2026-08-18 JST"
implementation_step: 1
scope: "Cocolon + mashos-api full tracked-file inventory"
product_runtime_effect: 0
api_db_rn_contract_effect: 0
automatic_progression: false
---

# Cocolon System Context — Step 1 Implementation Contract

## 0. Purpose

This step removes one concrete cause of structural misreading: a Cocolon discussion can begin from recent files while tracked files elsewhere in `MassyuRed/Cocolon` or `MassyuRed/mashos-api` are absent from the working context.

Step 1 does not claim semantic understanding, RN/API route linkage, CMEE quality improvement, or product credit. It establishes the complete and exact file population on which those later operations must operate.

## 1. Repositories and workspace profiles

The system treats two repositories as one Cocolon implementation surface:

- `MassyuRed/Cocolon`: RN application plus premise/product/design owners.
- `MassyuRed/mashos-api`: API/backend/services/engines/storage/workers/contracts.

Different Draft PRs are not overlaid into one false tree. `workspace_profiles.json` keeps at least these separate views:

- `production_main`
- `cmee_working`
- `cycle001_working`

The first generated inventory in this step is `cmee_working`. The Cocolon side is the exact source commit that triggers generation and must descend from Cocolon Draft PR #30 head `d29042f44e882110514b74dcc6a1b3f31ec746e6`. The API side is the exact current CMEE Draft PR #3 head `06ce311b3ea728b06f83439d268a34bed917c01c`.

## 2. Canonical outputs

For one locked workspace, the canonical output directory contains:

- `workspace_lock.json`: exact repository commit and tree identities.
- `files.jsonl`: exactly one row per Git tracked tree entry.
- `classification_summary.json`: deterministic counts by role, lifecycle, domain, and status.
- `unresolved.jsonl`: all entries not yet classified by Step 1 rules; unresolved entries remain visible and included in the denominator.
- `manifest.json`: counts, digests, and the bounded completion claim.

Raw input/output bodies, credentials, environment values, and private Product Read material are not indexed or published.

## 3. Completion condition

Step 1 is complete only when, for every locked repository:

```text
Git ls-tree tracked entry count
  = files.jsonl unique repository+path count

missing tracked path
  = 0

duplicate repository+path
  = 0

all rows have:
  exact commit
  exact tree
  path
  object mode/type/SHA
  content SHA-256 for blobs
  size
  content kind
  file role
  lifecycle
  domain
  classification status
```

Unknown classification does not remove a file. It creates an `UNRESOLVED` row and remains part of the exact denominator.

## 4. Snapshot boundary

The generated inventory commit is a deterministic projection of its parent source commit. This avoids an impossible self-reference in which `files.jsonl` would need to contain its own final blob SHA before that SHA exists.

Therefore:

- source commit: implementation/config/workflow bytes being inventoried;
- generated commit: adds the inventory of that exact source commit;
- `workspace_lock.json`: records the source commit and tree;
- verification after generation: reads the locked source commit from Git history and requires byte-exact regeneration.

Generated files are not silently excluded from future source snapshots. When implementation or configuration changes again, the next source commit already contains the previous generated snapshot; that previous snapshot is inventoried as `GENERATED_CONTEXT`.

## 5. Classification boundary

Step 1 classification is deliberately path/type based. It distinguishes source, test, config, CI, schema/migration, premise, history, document, asset, lockfile, generated context, submodule, and unresolved entries.

It does not claim symbol/reference accuracy. SCIP ingestion, syntax indexing, RN/API route linkage, reverse dependencies, and task-context compilation are later steps and remain at effect `0` here.

## 6. Implementation and operation

The implementation is one standard-library Python CLI:

```text
python3 tools/cocolon_context_inventory.py build ...
python3 tools/cocolon_context_inventory.py verify ...
```

The GitHub workflow checks out the two repositories side by side, runs unit tests, builds `cmee_working`, verifies exact regeneration, and commits only the generated output directory back to the same branch. It uses no external service, database, model, or paid dependency.

## 7. Prohibited expansion

This step does not:

- modify RN production source, API production source, DB, public contracts, dependencies, CMEE output, Piece, Analysis, or EmlisAI behavior;
- merge or ready any existing Draft PR;
- combine CMEE and Cycle001 Draft trees;
- create a new product-quality score, authority family, proof chain, or human acceptance claim;
- claim that all files have been semantically understood.

`automatic_progression=false` remains fixed after the Step 1 checkpoint.
