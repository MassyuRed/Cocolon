---
doc_id: cocolon_piece_workstream_pce8_design_closure_20260808
title: "Cocolon Piece Workstream — PCE-8 design freeze and work-package closure"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-8 Design Freeze / Work Package Split"
phase_completion: true
pce9_b01_activated: false
analysis_roadmap_activated: false
automatic_progression: false
production_effect: "exact0"
---

# Cocolon Piece Workstream — PCE-8 design freeze and work-package closure

## 1. Current state

```text
PCE-0: COMPLETE
PCE-1: COMPLETE_DESIGN_ONLY
PCE-2: COMPLETE_DESIGN_ONLY
PCE-3: COMPLETE_DESIGN_ONLY
PCE-4: COMPLETE_DESIGN_ONLY
PCE-5: COMPLETE_DESIGN_ONLY
PCE-6: COMPLETE_DESIGN_ONLY
PCE-7: COMPLETE_DESIGN_ONLY
PCE-8: COMPLETE_DESIGN_ONLY

PCE-9A B01 Contract/Version Causal RED:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

Analysis Pro-First roadmap:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

PCE-8 converts PCE-0 through PCE-7 from a set of product/design contracts into an implementation-facing freeze and bounded dependency graph. It does not create test files, production code, SQL, DB objects, RN components, monitoring runtime, flags, migration execution, destructive cleanup, Work use, actual-device evidence or release authority.

## 2. Fixed contracts

```text
design freeze:
  piece.design_freeze.v1

implementation work-package index:
  piece.implementation_workpackage_index.v1

environment assignment:
  piece.environment_assignment_ledger.v1
```

These do not replace the PCE-1 through PCE-7 contracts. They freeze how those contracts are interpreted and divided during PCE-9.

## 3. Freeze verdict

```text
product/design decisions unresolved:
  exact0

runtime/tooling/deployment conditions still external:
  exact6

implementation started:
  false

production effect:
  exact0
```

The exact6 external conditions are:

```text
PCE8-U01 exact saved-input/Emlis terminal source binding
PCE8-U02 RN capture/media-save dependency
PCE8-U03 isolated actual PostgreSQL runner
PCE8-U04 production flag command/credential owner
PCE8-U05 external log retention/alert owner
PCE8-U06 actual-device and independent acceptance evidence
```

Each condition has a fixed future owner and blocks only its dependent packet. They are not product-semantics gaps and do not authorize an implementer to invent behavior or create substitute documentation.

## 4. Frozen product interpretation

### Identity / source

```text
record:
  piece.record.v2

public identity:
  piece:<uuid>

canonical visible body:
  piece_text

source:
  saved input identity exact1

refined supplemental:
  distinct source role

Emlis visible/internal body reuse:
  exact0

Analysis inference/simulation reuse:
  exact0

old Q&A:
  pre-release legacy
  new active format/migration/adapter/dual-run exact0
```

### Lifecycle / visibility / quota

```text
lifecycle:
  preview_draft / saved / cancelled / rejected / expired / deleted

visibility:
  private / public
  default private
  lifecycle != visibility

quota:
  first successful saved record exact1
  preview/mutation/visibility/re-export/failed export exact0
  delete refund exact0
```

### Content / visual

```text
formats exact3:
  short_essay / quote / declaration

Q&A/fragment active:
  exact0 / exact0

free text edit/safety override:
  exact0

preview/save/export visible text:
  exact equality

visual recipe:
  piece.visual_recipe.v1

themes exact2:
  soft_paper / quiet_night

ratios exact2:
  4:5 / 9:16

image binary as record/feed source:
  exact0

renderer:
  RN-first prototype
  release device-gated
```

### DB / API / RN

```text
physical owner:
  public.piece_records + dedicated Piece family

legacy shared table:
  public.mymodel_reflections preserved for create/generated/unrelated owners

legacy read bridge:
  public.mymodel_reflections_read

final projection:
  public.pieces after legacy caller exact0

atomic functions:
  piece_save_v2
  piece_set_visibility_v2
  piece_delete_v2

canonical API terminal operation:
  save, not publish

RN entry:
  saved input + terminal Emlis observation
  -> この入力をPieceにする

owner history:
  dedicated owner path, not Nexus query reuse
```

## 5. Design-conflict resolutions

PCE-8 resolved exact8 implementation-facing conflicts.

### `FZ-C01` publish → save

The provisional roadmap label `B6 publish API` is frozen as `B6 Save API` because PCE-6 made `save` the canonical terminal operation. `/emotion/piece/publish` remains an old Q&A route to retire.

### `FZ-C02` staged API owner

New v2 owner routes are staged in:

```text
ai/services/ai_inference/api_piece_v2.py
```

The module is exercised through a dedicated test app and remains unregistered in production `app.py` until M5/B12-C. This avoids replacing or dual-registering the current Q&A route during disabled staging.

### `FZ-C03` legacy read bridge first

Current source search identified exact6 `COCOLON_PIECES_READ_TABLE` callers:

```text
emlis_ai_readers.py
piece_generated_metrics.py
astor_worker.py
api_piece_runtime.py
piece_public_read_store.py
piece_generation_store.py
```

M1 creates `public.mymodel_reflections_read` and rebinds these callers before `public.pieces` changes meaning. A fresh implementation-time search is mandatory; a new caller stops the exact path scope.

### `FZ-C04` monitoring event name

```text
superseded provisional:
  piece_record_published_public

frozen:
  piece_record_saved_public
```

Visibility and lifecycle remain separate.

### `FZ-C05` Piece flags fail closed

Every RN Piece call uses `isFeatureEnabled(name, false)`. Backend terminal enforcement remains authoritative. The unrelated generic helper default is not silently changed for the whole app.

### `FZ-C06` RN testing entry

Current `package.json` provides Node `node:test` and no RN component-test framework. PCE-8 freezes:

```text
static/wire:
  existing node:test

state/component behavior:
  pure JS state models + node:test

native behavior:
  PCE-9E device packet + PCE-11 Mash actual-device
```

A new test dependency requires a later exact gap/proposal; it is not added as ceremony.

### `FZ-C07` M7 out of band

M7 destructive cleanup is outside B1–B15. It requires a frozen M6 exact identity packet and separate Mash approval.

### `FZ-C08` multirepository groups split

B12, B13 and B14 are dependency groups. Backend and RN writes remain separate one-repository authorities with independent preimages, commits, tests and postverification.

## 6. B1–B15 work-package freeze

```text
B1  Contract/version helpers
B2  Storage/migration foundation
B3  Visibility/access policy
B4  Quota/atomic terminal operations
B5  Saved-source adapter + Preview API
B6  Save API
B7  Owner detail/history/visibility/delete API
B8  Content/format/generation owner
B9  Visual recipe/layout owner
B10 RN post-Emlis CTA/preview
B11 RN owner history/visibility/delete
B12 Nexus v2 and clean cutover
B13 Export prototype
B14 Feature flags/monitoring
B15 Integrated staging E2E
```

Every source/SQL packet has separated lifecycle:

```text
R:
  RED freeze / causal call-phase validation

I:
  bounded implementation + targeted GREEN
```

R completion does not activate I. I completion does not activate the next packet. Each repository write unit requires separate Mash approval unless Mash later creates an exact standing authority.

## 7. Frozen implementation order

```text
01 B1  contract/version foundation
02 B2  tracked migration + legacy bridge + dedicated schema
03 B3  visibility/access/RLS/staging projection
04 B4  quota and atomic terminal operations
05 B8  content/format/generation owner
06 B9  visual recipe/layout owner
07 B14-A backend fail-closed flags/monitoring
08 B5-A saved-source adapter
09 B5-B preview API
10 B6  save API
11 B7  owner history/detail/visibility/delete API
12 B14-B RN runtime/monitoring projection
13 B10 RN post-Emlis CTA/preview
14 B11 RN owner history/visibility/delete
15 B13 export preflight/receipt/RN prototype
16 B12-A backend Nexus v2
17 B12-B RN Nexus v2 and old Q&A UI reachability removal
18 B12-C clean-cutover registration/view/route packet
19 B15 integrated staging E2E and U1 entry evidence
20 PCE-U1 independent cross-repository audit
```

B5-A waits when `PCE8-U01` is unresolved. B1–B4, B8, B9 and B14-A are independent and may proceed under their own approvals.

## 8. Exact future owner roots

### mashos-api

```text
ai/services/ai_inference/piece_v2_contract.py
ai/services/ai_inference/piece_v2_access.py
ai/services/ai_inference/piece_v2_store.py
ai/services/ai_inference/piece_v2_quota.py
ai/services/ai_inference/piece_v2_content_policy.py
ai/services/ai_inference/piece_v2_generation.py
ai/services/ai_inference/piece_v2_visual.py
ai/services/ai_inference/piece_v2_layout.py
ai/services/ai_inference/piece_v2_source_adapter.py
ai/services/ai_inference/piece_v2_preview_service.py
ai/services/ai_inference/piece_v2_save_service.py
ai/services/ai_inference/piece_v2_owner_service.py
ai/services/ai_inference/piece_v2_public_service.py
ai/services/ai_inference/piece_v2_export_receipt_service.py
ai/services/ai_inference/piece_v2_runtime_control.py
ai/services/ai_inference/piece_v2_monitoring.py
ai/services/ai_inference/api_piece_v2.py
ai/services/ai_inference/api_nexus_piece_v2.py
ai/services/ai_inference/api_piece_events.py

supabase/migrations/
ai/tests/piece_v2/
```

### Cocolon

```text
features/piece/
components/piece/
screens/input/InputPieceActionArea.js
screens/PieceOwnerHistoryScreen.js
tests/piece-v2-contracts.test.js
tests/piece-v2-state-models.test.js
tests/piece-v2-renderer.test.js
```

These are selected future owners, not files implemented in PCE-8. Current Q&A files remain current actual until M5 and are retirement targets rather than new v2 owners.

## 9. Migration binding

```text
M0 tracked baseline:
  B2-A

M1 legacy bridge/caller rebind:
  B2-A

M2 dedicated foundation:
  B2-B

M3 RLS/RPC/staging:
  B3 + B4

M4 disabled integration:
  B5 through B14 with effective flags false

M5 single clean cutover:
  B12-C after all prerequisites

M6 body-free old identity capture:
  B12-C tool/evidence after B15 verification

M7 destructive cleanup:
  outside B1-B15, separate Mash approval

M8 obsolete retirement:
  separate bounded Pro packet after verified M7
```

PCE-8 applies no SQL or production migration.

## 10. RED-first packet rule

Every future code/SQL unit follows:

```text
1. exact PCE7 RED IDs and test path freeze
2. causal RED call-phase verification
3. bounded implementation
4. targeted GREEN
5. predecessor Piece regression subset
6. monitoring/privacy/flag subset when applicable
7. changed-path and source review
8. remote bytes/head verification
9. durable body-free result
```

Import, collection, package, credential, network or environment failure has RED credit exact0.

## 11. Environment assignment

```text
standard bounded design/code:
  CHAT_5_6_PRO_OK

actual transaction/RLS/migration evidence:
  ISOLATED_DB_REQUIRED

integrated non-production flow:
  STAGING_RUNTIME_REQUIRED

native iOS/Android evidence:
  MASH_ACTUAL_DEVICE_REQUIRED

independent cross-repository acceptance:
  WORK_ULTRA_REQUIRED at PCE-U1/U2

production flag/migration/rollback/destructive operation:
  DEPLOYMENT_OWNER_REQUIRED
```

Work Ultra remains reserved first for EmlisAI's current executable Work-required path. Piece U1/U2 require separate Mash allocation. Additional credit purchase is not an assumption. A stronger evidence condition is never downgraded because the environment is unavailable.

## 12. Current actual basis

```text
Cocolon head / tree:
  5316c8b3a9eef2ae84f6340aab24ee7ec8e654f5
  ae6964261649492e2186d1ee277956d9d5d12874

mashos-api head / tree:
  315813c7bd3372462de926ddad74df567254a6b5
  a641510e107d52bb910073f36604c85bd57af150

roadmap SHA-256:
  2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939
```

Confirmed actual inputs:

```text
current product:
  old Q&A Piece flow

new Piece production implementation:
  exact0

current migration owner directory:
  absent

current COCOLON_PIECES_READ_TABLE consumers:
  exact6 from source search

current RN tests:
  Node node:test source contracts

current RN component-test dependency:
  absent

current Piece v2 flags:
  absent
```

## 13. PCE-8 artifacts

| role | path | Git blob SHA-1 |
|---|---|---|
| design freeze | `Cocolon_Piece/pce8_design_freeze_work_packages/Piece_Design_Freeze_Candidate_20260808.md` | `c6652b89d47f908d8f8ebbaccbc16c8aa6771f6d` |
| work-package index | `Cocolon_Piece/pce8_design_freeze_work_packages/Piece_Implementation_WorkPackage_Index_20260808.md` | `fcd8614bc2983f50d85da45dc873c58de7494456` |
| environment ledger | `Cocolon_Piece/pce8_design_freeze_work_packages/Piece_Environment_Assignment_Ledger_20260808.md` | `7b15eb23b608f2bbef57926ec05121e604606434` |
| current entry candidate | `Cocolon_Piece/00_read_first.md` | `4671216243ae86d65da1581d940c5a07a79e8ac2` |

`Cocolon_Piece/manifest.json` is updated to v12 in the same publication packet. The durable closure checkpoint is written after publication identities are freshly verified.

## 14. Completed / not implemented

Completed:

- PCE-0 through PCE-7 implementation interpretation freeze;
- product decision unresolved exact0;
- runtime/tooling/deployment exact6 condition ownership;
- exact future backend/RN/migration/test owner paths;
- B1–B15 exact15 package groups and dependency order;
- RED-only versus implementation/GREEN lifecycle separation;
- M0–M8 binding and M7/M8 out-of-band boundary;
- Chat/isolated DB/staging/device/Work/deployment assignment;
- next B1 RED-only packet definition.

Not implemented:

```text
Cocolon production source:
  exact0

mashos-api production source:
  exact0

SQL / DB / API / RN / migration / deletion:
  exact0

test files / CI / test execution:
  exact0

monitoring / Piece flags / rollback runtime:
  exact0

actual device / Work Ultra / release:
  exact0
```

## 15. Facts / inference / Karen's opinion

### Confirmed facts

PCE-8 roadmap requirements, PCE-1 through PCE-7 canonical artifacts, current Cocolon and mashos-api heads, current old Q&A owners, exact6 current read-table caller search, current Node test setup, absence of a Piece v2 migration root/flags/component-test framework and the PCE-7 evidence boundaries were confirmed.

### Inference / unconfirmed

The exact current saved-input/Emlis runtime adapter path, acceptable RN capture/media-save package, isolated PostgreSQL materialization, production flag command/credentials, external log platform retention, actual-device behavior and future independent audit result remain unconfirmed. Each is assigned to a future condition owner and is not claimed as implemented or PASS.

### Karen's opinion

The most important PCE-8 choice is to avoid treating B1–B15 as fifteen large permissions. Each source owner begins with a causal RED and receives a separate implementation/GREEN authority. This keeps a failed contract test from silently becoming permission to edit DB, API and RN together.

The second important choice is to stage new v2 API modules without registering them until M5. Replacing current Q&A routes early would either create a user-visible dual-run or make the current product unusable before the new private/public/quota/Nexus path is complete.

The third is to keep M7 deletion outside implementation completion. A functioning new Piece and a proven exact old identity packet are prerequisites for deletion; design freeze alone is not.

## 16. Next exact action

```text
PCE9A_B01_CONTRACT_VERSION_CAUSAL_RED_FREEZE_ONLY

environment:
  CHAT_5_6_PRO_OK

classification:
  TEST_ONLY_RED

repository:
  MassyuRed/mashos-api

allowed new path:
  ai/tests/piece_v2/test_b01_piece_v2_contract_red.py

production source / DB / runtime effect:
  exact0

state:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

Analysis roadmap remains unactivated. Mash-side action required for PCE-8 closure is exact0.

## 17. Effects / closure

```text
Cocolon documentation / Piece premise:
  reflection required

production source / DB / API / RN / migration / deletion:
  exact0

test / CI / runtime / actual device:
  exact0

monitoring / feature flag runtime:
  exact0

Work Ultra / deployment / release:
  exact0

EmlisAI / Analysis technical state:
  exact0

automatic progression:
  false

PCE8_DESIGN_FREEZE_FIXED
PCE8_PRODUCT_DECISION_UNRESOLVED_EXACT0
PCE8_RUNTIME_CONDITIONS_EXACT6_OWNED
PCE8_WORK_PACKAGE_GROUPS_EXACT15
PCE8_IMPLEMENTATION_ORDER_FIXED
PCE8_RED_AND_IMPLEMENTATION_LIFECYCLE_SEPARATED
PCE8_M7_M8_OUT_OF_BAND_FIXED
PCE8_ENVIRONMENT_ASSIGNMENT_FIXED
PCE8_NEXT_B01_RED_ONLY_FIXED
PCE8_COMPLETE_DESIGN_ONLY
PCE9_B01_NOT_ACTIVATED
ANALYSIS_ROADMAP_NOT_ACTIVATED
AUTOMATIC_PROGRESSION_FALSE
```
