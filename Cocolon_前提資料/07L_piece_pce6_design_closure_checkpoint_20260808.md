---
doc_id: piece_pce6_design_closure_checkpoint_20260808
title: "Piece PCE-6 API / DB / RN / migration design closure checkpoint"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
checkpoint_type: "PCE6_DESIGN_ONLY_CLOSURE"
baseline_cocolon_head: "96df30f6cdda8f4549065a3b2156c5b75d36026e"
baseline_cocolon_tree: "00196a604415267b45df335220a0b3ff525b910f"
design_publication_commit: "977ea468abe73744e96424a42840c1290117d8e9"
design_publication_tree: "5df5e2f7452267280d816d3751bbc3831675e51e"
pce6_complete: true
pce7_activated: false
analysis_roadmap_activated: false
automatic_progression: false
production_effect: "exact0"
---

# Piece PCE-6 API / DB / RN / migration design closure checkpoint

## 1. Closure result

Mashが承認した次のdesign-only作業を完了した。

```text
PCE6_API_DB_RN_MIGRATION_DESIGN_ONLY
```

```text
PCE-0: COMPLETE
PCE-1: COMPLETE_DESIGN_ONLY
PCE-2: COMPLETE_DESIGN_ONLY
PCE-3: COMPLETE_DESIGN_ONLY
PCE-4: COMPLETE_DESIGN_ONLY
PCE-5: COMPLETE_DESIGN_ONLY
PCE-6: COMPLETE_DESIGN_ONLY

PCE-7:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

Analysis Pro-First roadmap:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

## 2. Fixed contracts

```text
data:
  piece.data_contract.v1

API:
  piece.api.v2

RN flow:
  piece.rn_flow.v1

migration:
  piece.clean_cutover_migration.v1
```

PCE-6 binds the PCE-1 through PCE-5 contracts to detailed future owners. It does not create production SQL, API, RN, migration, deletion, runtime or release authority.

## 3. Principal decisions

### Data / DB

```text
selected physical owner:
  public.piece_records + dedicated Piece family

legacy shared table:
  public.mymodel_reflections preserved for create/generated/unrelated owners

legacy bridge before view cutover:
  public.mymodel_reflections_read

final new Piece projection:
  public.pieces

atomic functions:
  piece_save_v2
  piece_set_visibility_v2
  piece_delete_v2

quota:
  body-free ledger + owner/JST-month lock
  survives physical Piece delete

access:
  base RLS ENABLE + FORCE
  RN direct base DML exact0
  application-service/current-relation authorization
```

The critical ordering decision is that `public.pieces` cannot be replaced first. Current generated-reflection, Emlis, worker, metrics and runtime readers must move to the legacy bridge before that name acquires new Piece semantics.

### API

```text
preview source:
  body-free saved source reference

raw input resend:
  exact0

canonical operation:
  save, not publish

save binding:
  preview revision
  piece_text/content_payload/visual_recipe hashes
  visibility
  idempotency

owner history:
  dedicated owner API

public feed:
  saved + public + current viewer relation

backend image render route:
  initial exact0
```

Neutral `/emotion/piece/*` and `/nexus/pieces*` namespaces are reused with v2 semantics. Old Q&A fields, IDs, publish/cancel behavior and compatibility aliases are retired rather than translated.

### RN

```text
entry:
  saved input + terminal Emlis observation

CTA:
  この入力をPieceにする

preview:
  canonical text + visual card + private/public

private default:
  fixed

owner history:
  separate from Nexus

Nexus:
  new Piece payload/card only

export:
  saved-record RN-first

old Q&A preview/card compatibility:
  exact0
```

Piece receives source identity and eligibility, not the Emlis visible body. Text editing, safety override and hidden candidate saving remain exact0.

### Migration

```text
M0 tracked migration baseline
M1 legacy read bridge/caller rebind
M2 new Piece foundation
M3 RLS/RPC/staging projection
M4 disabled application integration
M5 one user-visible clean cutover
M6 body-free old identity capture
M7 exact destructive cleanup under separate Mash approval
M8 obsolete Q&A contract retirement
```

Old row deletion predicate remains `mymodel_reflections.source_type = emotion_generated`. `create`, `generated`, shared-table structure and unrelated consumers are excluded. Rollback is new Piece safe-disable, never old Q&A restoration.

## 4. Current actual basis

```text
Cocolon baseline head / tree:
  96df30f6cdda8f4549065a3b2156c5b75d36026e
  00196a604415267b45df335220a0b3ff525b910f

mashos-api head / tree:
  315813c7bd3372462de926ddad74df567254a6b5
  a641510e107d52bb910073f36604c85bd57af150

PCE-0 Supabase catalog SHA-256:
  2f51e5e6e4207a186aaacbeb355c07ade3b4f777960f3f46d1dbea9f8f9d810e
```

Confirmed current actual remains old Q&A over `mymodel_reflections`, Q&A request/response/modal/card, `published_at` row-count quota, `reflection:`/Q&A identifiers, compatibility route registration, a shared `public.pieces` view, and no tracked application migration owner.

## 5. Verified design artifacts

| path | remote UTF-8 bytes | Git blob SHA-1 |
|---|---:|---|
| `Cocolon_Piece/pce6_api_db_rn_migration/Piece_New_Data_Contract_Design_20260808.md` | 8329 | `262921f40536727443359b3d0c28b490cb5c5ed4` |
| `Cocolon_Piece/pce6_api_db_rn_migration/Piece_API_CleanCutover_Design_20260808.md` | 7418 | `96757b9ddbae8c2079fd7249d823f2f0d2bf3102` |
| `Cocolon_Piece/pce6_api_db_rn_migration/Piece_RN_Flow_Design_20260808.md` | 9100 | `c91a51eff44a89d08d714ece4c90c42ccdd97265` |
| `Cocolon_Piece/pce6_api_db_rn_migration/Piece_OldQna_Removal_And_DB_Migration_Design_20260808.md` | 10103 | `00dee10809a3b3f713ec038e1f675f3f8c346b8a` |
| `Cocolon_Piece/00_read_first.md` | verified | `7b7fef8f5f37c0d3924c4793615572aa15281d8f` |
| `Cocolon_Piece/manifest.json` | verified | `9ebe1008086518cf0f1d393c8ba5ac51b46698ff` |
| `Cocolon_前提資料/15I_cocolon_piece_workstream_pce6_design_closure_20260808.md` | verified | `e00567bdd3a28769c92df0d101b370f06bb9a463` |

All four PCE-6 paths were listed from the publication commit with the expected size/blob identities. Entry, manifest and premise were fetched from the publication commit and matched their canonical blobs.

## 6. Publication scope

```text
baseline:
  96df30f6cdda8f4549065a3b2156c5b75d36026e

publication commit:
  977ea468abe73744e96424a42840c1290117d8e9

publication tree:
  5df5e2f7452267280d816d3751bbc3831675e51e

publication commits:
  exact1

publication changed paths:
  exact7

new PCE-6 artifacts:
  exact4

entry / manifest / premise:
  exact3

scope outside Piece / Piece premise:
  exact0
```

Publication was a non-force fast-forward from the fresh baseline.

## 7. Transport incidents

```text
invalid candidate 1:
  131a3e73a2161b88acb8cca34e75287ea5936675
  first manual UTF-8 data-contract candidate did not match prepared identity

invalid candidate 2:
  1a1a495ac136c15f7aa216c56fe51eabb1bed901
  manual base64 transfer produced invalid UTF-8 bytes

both:
  tree inclusion exact0
  ref effect exact0
  reuse prohibited
```

The canonical data contract is `262921f40536727443359b3d0c28b490cb5c5ed4`. Both mismatches were detected before any tree/ref update and are recorded in manifest v10.

## 8. Completed / not implemented

Completed:

- dedicated table family and shared-view transition order;
- record/quota/state/receipt/RLS/atomic RPC design;
- owner/public v2 API, errors, exact-once and concealment;
- post-Emlis RN preview/history/Nexus/export flow;
- M0–M8 tracked clean-cutover migration and destructive boundary;
- old Q&A route/code/data removal map;
- negative contracts and STOP conditions;
- current entry, manifest v10 and premise update.

Not implemented:

```text
Cocolon production source:
  exact0

mashos-api production source:
  exact0

SQL / DB objects / grants / RLS / RPC:
  exact0

API / RN / dependencies / migration / deletion:
  exact0

test / runtime / actual device:
  exact0

old Q&A removal / release:
  exact0
```

## 9. Facts / inference / Karen's opinion

### Confirmed facts

Roadmap PCE-6 requirements, PCE-0 catalog, PCE-1 through PCE-5 contracts, current repository heads, current Q&A API/RN/routes/store, shared `public.pieces` consumers, publication scope and remote artifact identities were confirmed.

### Inference / unconfirmed

Production DB drift after PCE-0, exact final SQL/query plan, migration runner behavior, live concurrency, deployed commit, RN performance, actual-device and store behavior remain unconfirmed. PCE-6 does not claim them as implemented or PASS.

### Karen's opinion

A dedicated Piece family is the smallest design that genuinely performs clean cutover. Extending the shared Q&A row would keep old identity, constraints, quota and access responsibilities alive.

The legacy read bridge is the most important new finding in PCE-6. Protecting unrelated `public.pieces` consumers before changing that view's meaning is necessary to avoid breaking Emlis, generated reflection and other shared owners.

## 10. Next exact action

```text
PCE7_TEST_MONITORING_ROLLBACK_DESIGN_ONLY

environment:
  CHAT_5_6_PRO_OK

state:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED
```

Analysis roadmap remains unactivated. Mash-side action required for PCE-6 closure is exact0.

## 11. Effects / closure

```text
Cocolon documentation / Piece premise:
  reflected

production source / DB / API / RN / migration / deletion:
  exact0

test / runtime / actual device / release:
  exact0

EmlisAI / Analysis technical state:
  exact0

automatic progression:
  false

PCE6_DATA_CONTRACT_FIXED
PCE6_API_V2_FIXED
PCE6_RN_FLOW_FIXED
PCE6_MIGRATION_FIXED
NEW_PIECE_TABLE_FAMILY_SELECTED
LEGACY_READ_BRIDGE_FIRST_FIXED
ATOMIC_SAVE_QUOTA_VISIBILITY_DELETE_FIXED
SINGLE_CLEAN_CUTOVER_FIXED
M7_DESTRUCTIVE_SEPARATE_APPROVAL_REQUIRED
PCE6_REMOTE_BLOBS_VERIFIED_EXACT7
PCE6_COMPLETE_DESIGN_ONLY
PCE7_NOT_ACTIVATED
ANALYSIS_ROADMAP_NOT_ACTIVATED
AUTOMATIC_PROGRESSION_FALSE
```
