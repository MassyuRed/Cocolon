---
doc_id: piece_implementation_workpackage_index_20260808
title: "Piece implementation work-package index"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-8 Design Freeze / Work Package Split"
document_status: "PCE8_COMPLETE_DESIGN_ONLY"
contract_id: "piece.implementation_workpackage_index.v1"
design_freeze_contract_id: "piece.design_freeze.v1"
source_cocolon_head: "5316c8b3a9eef2ae84f6340aab24ee7ec8e654f5"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
automatic_progression: false
implementation_effect: "exact0"
---

# Piece implementation work-package index

## 1. Purpose

This index converts the PCE-8 freeze into bounded future work. B1–B15 are dependency groups, not automatic authorities. A group with backend and RN units is split into separately approved repository writes.

```text
contract:
  piece.implementation_workpackage_index.v1

work-package groups:
  B1..B15 exact15

future destructive M7:
  outside B1..B15

future Work independent gates:
  PCE-U1 / PCE-U2

automatic progression:
  false
```

## 2. Common lifecycle

Every source/SQL package has at least two lifecycle steps.

```text
R = RED freeze / causal validation
I = implementation + targeted GREEN
```

For example:

```text
B1-R:
  TEST_ONLY_RED

B1-I:
  CODE_DISABLED + targeted GREEN
```

B1-R completion does not activate B1-I. B1-I completion does not activate the next group. Each write unit requires a separate Mash approval unless Mash later creates an exact standing authority.

Common packet record:

```text
packet ID and lifecycle
repository + current head/tree
exact allowed paths
preimage/new-path assertions
RED IDs and expected causal signatures
environment/evidence owner
implementation effects
commands/tests actually run
changed paths
remote blobs/final head
STOP/blockers
next inactive packet
```

## 3. Frozen implementation order

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

B5-A pauses at `PCE8-U01` if the exact saved-input/Emlis terminal owner is not current. B1–B4, B8, B9 and B14-A do not wait for that binding.

## 4. Package summary

| Group | Frozen name | Primary phase | Repository | Class | Main dependencies |
|---|---|---|---|---|---|
| B1 | Contract/version helpers | PCE-9A | mashos-api | TEST_ONLY_RED -> CODE_DISABLED | PCE-8 |
| B2 | Storage/migration foundation | PCE-9A | mashos-api | DB_MIGRATION_FILE_ONLY | B1 |
| B3 | Visibility/access policy | PCE-9A | mashos-api | TEST_ONLY_RED -> CODE_DISABLED/SQL | B2 |
| B4 | Quota/terminal operation owner | PCE-9A | mashos-api | TEST_ONLY_RED -> CODE_DISABLED/SQL | B2,B3 |
| B5 | Saved-source adapter + preview API | PCE-9C/9A | mashos-api | TEST_ONLY_RED -> CODE_DISABLED | B1,B3,B8,B9,B14-A,U01 |
| B6 | Save API | PCE-9A | mashos-api | TEST_ONLY_RED -> CODE_DISABLED | B4,B5,B14-A |
| B7 | Owner API | PCE-9A | mashos-api | TEST_ONLY_RED -> CODE_DISABLED | B3,B4,B6,B14-A |
| B8 | Format/generation owner | PCE-9B | mashos-api | TEST_ONLY_RED -> CODE_DISABLED | B1 |
| B9 | Visual recipe/layout owner | PCE-9B/9E | mashos-api | TEST_ONLY_RED -> CODE_DISABLED | B1,B8 |
| B10 | RN preview/CTA | PCE-9D | Cocolon | TEST_ONLY_RED -> CODE_DISABLED | B5,B9,B14-B |
| B11 | RN owner history | PCE-9D | Cocolon | TEST_ONLY_RED -> CODE_DISABLED | B7,B10,B14-B |
| B12 | Nexus v2/clean cutover | PCE-9F | split backend/RN | separate write units | B3,B7,B10,B11,B13,B14,B15 prerequisites |
| B13 | Export prototype | PCE-9E | split backend/RN | preflight + CODE_DISABLED | B7,B9,B10,B14 |
| B14 | Feature flags/monitoring | PCE-9A/9D | split backend/RN | separate write units | B1; RN unit after backend |
| B15 | Integrated staging E2E | PCE-9 integration | both, evidence-first | STAGING_EXECUTION | B1–B14 staged |

## 5. B1 — Contract/version helpers

### Goal

Create the pure new Piece contract owner without registering routes or touching DB.

### Exact paths

```text
new:
  ai/services/ai_inference/piece_v2_contract.py
  ai/tests/piece_v2/test_b01_piece_v2_contract_red.py
```

### RED ownership

```text
PCE7-R008 structured/flat equality
PCE7-R013 missing visibility private / unknown reject
PCE7-R027 required version identities
PCE7-R037 strict body-free serializer rejection
```

### Completion

- enums, canonical JSON/hash functions, version constants, public projection allowlist and stable error codes are deterministic;
- no current Q&A module import is required;
- no route/DB/RN effect;
- targeted GREEN and predecessor pure tests pass.

### STOP

- contract requires Emlis body or Analysis inference;
- one serializer must accept unknown/open fields;
- a version choice contradicts PCE-1–7.

## 6. B2 — Storage/migration foundation

B2 is split because M0/M1 and M2 have different risk and changed paths.

### B2-A — M0 tracked baseline + M1 legacy bridge

Exact paths:

```text
new:
  supabase/migrations/README.md
  supabase/migrations/manifest.json
  supabase/migrations/20260808_001_piece_v2_legacy_read_bridge.sql
  requirements-piece-v2-test.txt
  ai/tests/piece_v2/db/conftest.py
  ai/tests/piece_v2/db/test_b02_m0_m1_legacy_bridge.py

modify current exact6 callers:
  ai/services/ai_inference/emlis_ai_readers.py
  ai/services/ai_inference/piece_generated_metrics.py
  ai/services/ai_inference/astor_worker.py
  ai/services/ai_inference/api_piece_runtime.py
  ai/services/ai_inference/piece_public_read_store.py
  ai/services/ai_inference/piece_generation_store.py
```

Implementation repeats the fresh `COCOLON_PIECES_READ_TABLE` search. A seventh caller is a STOP requiring path-scope correction before write.

RED IDs:

```text
PCE7-R035 public.pieces early semantic replacement
PCE7-R040 untracked migration/catalog drift
```

B2-A commits migration artifacts only; production application exact0.

### B2-B — M2 dedicated foundation

Exact paths:

```text
new:
  supabase/migrations/20260808_002_piece_v2_foundation.sql
  ai/tests/piece_v2/db/test_b02_piece_v2_foundation.py
```

Required DB evidence uses an isolated disposable PostgreSQL/Supabase-compatible database. `PIECE_V2_TEST_DATABASE_URL` is test-only. Production credentials/data are prohibited.

Completion includes dedicated tables, constraints/indexes, RLS enabled+forced, direct anon/authenticated DML exact0 and no image/raw/Emlis/Analysis body columns.

## 7. B3 — Visibility/access policy

### Exact paths

```text
new:
  supabase/migrations/20260808_003_piece_v2_rls_and_staging.sql
  ai/services/ai_inference/piece_v2_access.py
  ai/tests/piece_v2/db/test_b03_piece_v2_access_rls.py
  ai/tests/piece_v2/test_b03_piece_v2_access_api_policy.py
```

### RED IDs

```text
PCE7-R009..R016
```

### Required evidence

- owner/allowed viewer/unrelated viewer/anonymous/service-without-app-decision matrix;
- preview/private/public/public-then-private/deleted/missing object matrix;
- denied operations create no metrics/read/resonance state;
- non-owner response concealment is equivalent;
- `pieces_v2_staging` is service-only and no `public.pieces` cutover occurs.

## 8. B4 — Quota and atomic terminal operations

### Exact paths

```text
new:
  supabase/migrations/20260808_004_piece_v2_atomic_functions.sql
  ai/services/ai_inference/piece_v2_store.py
  ai/services/ai_inference/piece_v2_quota.py
  ai/tests/piece_v2/db/test_b04_piece_v2_atomic_transactions.py
```

### RED IDs

```text
PCE7-R017..R026
```

### Required evidence

- `piece_save_v2`, `piece_set_visibility_v2`, `piece_delete_v2` fixed search path/grants;
- save + quota exact one transaction;
- Free/Plus concurrent remaining-slot matrix;
- same-key replay returns same Piece/consumption;
- delete purges canonical/child state while immutable quota remains;
- client tier/limit never controls terminal result.

## 9. B5 — Saved-source adapter and Preview API

### B5-A — saved-source adapter

Exact paths:

```text
new:
  ai/services/ai_inference/piece_v2_source_adapter.py
  ai/tests/piece_v2/test_b05a_piece_v2_source_adapter.py
```

Dependencies: B1, B8, `PCE8-U01` resolved through the current saved-input/Emlis terminal owner.

RED IDs:

```text
PCE7-R001..R005
```

STOP if the exact adapter requires copying Emlis visible/internal body, accepting raw memo/emotions from RN, or changing Emlis internal ownership for Piece convenience.

### B5-B — preview API

Exact paths:

```text
new:
  ai/services/ai_inference/api_piece_v2.py
  ai/services/ai_inference/piece_v2_preview_service.py
  ai/tests/piece_v2/test_b05b_piece_v2_preview_api.py
```

The new module is tested in a dedicated test app and is not registered in production `app.py` until B12-C.

RED IDs:

```text
PCE7-R005,R006,R008,R013,R017,R038
```

Routes owned in this stage:

```text
GET    /emotion/piece/quota
POST   /emotion/piece/preview
PATCH  /emotion/piece/preview/{preview_id}
DELETE /emotion/piece/preview/{preview_id}
```

## 10. B6 — Save API

The earlier provisional name `publish API` is retired.

### Exact paths

```text
modify:
  ai/services/ai_inference/api_piece_v2.py

new:
  ai/services/ai_inference/piece_v2_save_service.py
  ai/tests/piece_v2/test_b06_piece_v2_save_api.py
```

Route:

```text
POST /emotion/piece/save
```

RED IDs:

```text
PCE7-R006,R017..R024,R038
```

Completion requires revision/text/content/recipe hash binding, private fail-closed default, server entitlement, idempotent replay, atomic RPC result and body-free monitoring.

## 11. B7 — Owner detail/visibility/delete API

### Exact paths

```text
modify:
  ai/services/ai_inference/api_piece_v2.py

new:
  ai/services/ai_inference/piece_v2_owner_service.py
  ai/tests/piece_v2/test_b07_piece_v2_owner_api.py
```

Routes:

```text
GET    /emotion/piece/history
GET    /emotion/piece/{piece_id}
PATCH  /emotion/piece/{piece_id}/visibility
DELETE /emotion/piece/{piece_id}
```

RED IDs:

```text
PCE7-R015,R016,R022,R025,R026,R038
```

Owner history uses an owner-only projection. It is not implemented by reusing the public Nexus query.

## 12. B8 — Content/format/generation owner

### Exact paths

```text
new:
  ai/services/ai_inference/piece_v2_content_policy.py
  ai/services/ai_inference/piece_v2_generation.py
  ai/tests/piece_v2/test_b08_piece_v2_generation.py
```

RED IDs:

```text
PCE7-R001,R002,R004,R006,R008
```

Completion:

- exact3 format eligibility and plan behavior;
- short_essay default/Free;
- Plus recommendation, Premium eligible selection;
- no Q&A/fragment active fallback;
- meaning/uncertainty/negation/source-role preservation;
- safety unavailable creates no record/quota;
- no fixed case-ID or generic filler owner.

## 13. B9 — Visual recipe/layout owner

### Exact paths

```text
new:
  ai/services/ai_inference/piece_v2_visual.py
  ai/services/ai_inference/piece_v2_layout.py
  ai/tests/piece_v2/test_b09_piece_v2_visual.py
```

RED IDs:

```text
PCE7-R027..R032
```

This packet owns recipe/catalog/version/plan/fit decisions, not native image capture. Unsupported old versions fail explicitly. No clipping/ellipsis/content deletion can be a successful layout result.

## 14. B10 — RN post-Emlis CTA and preview

### Exact paths

```text
new:
  features/piece/pieceApi.js
  features/piece/piecePreviewModel.js
  features/piece/PieceCreateController.js
  components/piece/PieceVisualCard.js
  components/piece/PiecePreviewModal.js
  screens/input/InputPieceActionArea.js
  tests/piece-v2-contracts.test.js
  tests/piece-v2-state-models.test.js

modify candidate set:
  screens/InputScreen.js
  package.json
```

The package first freezes Node causal REDs. It uses pure state models rather than adding a new component-test framework.

RED IDs:

```text
PCE7-R001,R005,R006,R013,R030,R037,R038
```

The CTA appears only for a saved source and terminal eligible Emlis state. It receives body-free identity, not Emlis text. New UI remains hidden while effective flags are false.

## 15. B11 — RN owner history/visibility/delete

### Exact paths

```text
new:
  features/piece/pieceOwnerModel.js
  features/piece/PieceOwnerHistoryController.js
  components/piece/PieceOwnerCard.js
  screens/PieceOwnerHistoryScreen.js

modify candidate set:
  features/piece/pieceApi.js
  navigation/PieceStackNavigator.js
  screens/PieceHistoryMenuScreen.js
  tests/piece-v2-contracts.test.js
  tests/piece-v2-state-models.test.js
```

RED IDs:

```text
PCE7-R015,R016,R025,R026,R037,R038
```

Completion includes private/public visible state, expected-row-version conflict/refetch, external-copy delete warning, same delete retry and owner-only API use.

## 16. B12 — Nexus v2 and clean cutover

B12 is a group with separately approved units.

### B12-A — backend public/Nexus v2

```text
new:
  ai/services/ai_inference/api_nexus_piece_v2.py
  ai/services/ai_inference/piece_v2_public_service.py
  ai/tests/piece_v2/test_b12a_piece_v2_nexus_api.py
```

RED IDs: R009–R015, R033–R035, R037–R039.

The new module remains unregistered until B12-C.

### B12-B — RN Nexus v2

```text
new:
  components/piece/NexusPieceCard.js

modify candidate set:
  lib/nexusApi.js
  screens/NexusScreen.js
  screens/PieceLibraryScreen.js
  tests/piece-v2-contracts.test.js
  tests/piece-v2-state-models.test.js

removal target at cutover:
  screens/nexus/NexusPieceCard.js
```

The new card accepts Piece v2 fields only and rejects question/q_key/q_instance/reflection identities.

### B12-C — M5 cutover and M6 capture tooling

Backend write unit candidate paths:

```text
new:
  supabase/migrations/20260808_005_piece_v2_clean_cutover.sql
  ai/tools/piece_v2_capture_old_qna_identity.py
  ai/tests/piece_v2/db/test_b12c_piece_v2_clean_cutover.py

modify/remove candidate set after fresh dependency search:
  ai/services/ai_inference/app.py
  ai/services/ai_inference/api_nexus.py
  ai/services/ai_inference/api_piece_compat.py
  Piece-facing sections of api_piece_runtime.py
  api_contract_registry.py / PUBLIC_API_REGISTRY.md
  old Emotion Piece route registration
```

RN write unit candidate paths:

```text
remove/replace after fresh caller search:
  screens/input/InputPiecePreviewController.js
  components/EmotionPiecePreviewModal.js
  lib/api/home/emotionPieceApi.js
  Piece-specific legacyWireContracts entries
  old Q&A Nexus normalizers/card assertions
```

B12-C may make old Q&A release-unreachable and switch the neutral namespaces/projection. It does not execute M7. M6 identity capture runs only after B15 new-flow verification.

## 17. B13 — Export prototype

### B13-A — dependency/owner preflight

Read-only decision unit:

```text
confirm RN 0.77.3 compatibility from primary package sources
compare capture/file-save/share minimal dependencies
confirm license/maintenance/native setup
freeze exact dependency and rollback
```

No package install during preflight. Failure to find an acceptable RN owner triggers a separate backend/hybrid design mutation proposal; silent fallback is prohibited.

### B13-B — backend body-free receipt

```text
new:
  ai/services/ai_inference/piece_v2_export_receipt_service.py
  ai/tests/piece_v2/test_b13b_piece_v2_export_receipt.py

modify:
  ai/services/ai_inference/api_piece_v2.py
```

Candidate route:

```text
POST /emotion/piece/{piece_id}/export-receipt
```

The server verifies owner/current record hashes and stores only the PCE-5 body-free receipt.

### B13-C — RN renderer/export

```text
new:
  features/piece/pieceRenderer.js
  features/piece/pieceLayout.js
  features/piece/pieceExport.js
  components/piece/PieceExportCanvas.js
  tests/piece-v2-renderer.test.js

modify:
  package.json / native dependency files only after B13-A approval
  Piece visual/owner components only within exact export wiring scope
```

RED IDs: R007,R018,R027–R032,R037,R038.

Code-side GREEN does not close native device rows. B13 creates the PCE-11 device packet.

## 18. B14 — Feature flags and monitoring

### B14-A — backend

```text
new:
  ai/services/ai_inference/piece_v2_runtime_control.py
  ai/services/ai_inference/piece_v2_monitoring.py
  ai/services/ai_inference/api_piece_events.py
  ai/tests/piece_v2/test_b14a_piece_v2_runtime_control.py
  ai/tests/piece_v2/test_b14a_piece_v2_monitoring.py

modify candidate set:
  ai/services/ai_inference/api_app_bootstrap.py
  ai/services/ai_inference/app.py only for strict Piece event receiver registration
```

RED IDs: R037–R039.

Exact8 flags default false. Backend resolver is single owner. Strict Piece events reject unknown/free-form fields before generic logging.

### B14-B — RN

```text
new:
  features/piece/pieceRuntime.js
  features/piece/pieceMonitoring.js

modify candidate set:
  AppRuntimeContext.js
  tests/piece-v2-contracts.test.js
```

All Piece defaults/calls are false. Generic `lib/monitoring.js` remains for unrelated features; Piece callers use the strict wrapper only.

## 19. B15 — Integrated staging E2E

B15 is evidence-first and has no production source change by default.

### Required flow

```text
saved input
terminal Emlis observation/source identity
Piece CTA
preview/mutation
private/public save
owner history
visibility change
Nexus/read/resonance
export/share/re-export code path
delete
safe-state rollback
```

### Required evidence

```text
PCE7-R001..R040 implemented rows GREEN
S01..S11 results present as applicable
private/public/body leak/old Q&A residual exact0
rollback suite GREEN
M5 staging projection/route result
M6 capture tool dry-run body-free result
approved exact-path verification
```

### Output owner

```text
Cocolon_Piece/evidence/pce9_b15_staging_e2e/
  result.json
  README.md
```

No private body is stored. Any implementation defect produces a separately approved bounded correction; B15 does not edit both repositories while executing E2E.

## 20. Out-of-band required packets

### M7 destructive old-Q&A cleanup

```text
state:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

input:
  frozen M6 exact identity packet

environment:
  deployment/isolated DB operation owner required

scope:
  exact captured old identities only
```

### M8 obsolete contract retirement

A separately approved Pro packet after verified M7. It removes old constraints/routes/code only after fresh consumer exact0. It is not automatic.

### PCE-U1 / PCE-U2

Independent exact4/final acceptance remain `WORK_ULTRA_REQUIRED`, with EmlisAI Work priority preserved and separate Mash allocation required.

## 21. Common STOP conditions

- current head/preimage/path set differs materially from the packet.
- a RED fails for import/collection/environment instead of the cataloged invariant.
- a required DB claim has no actual isolated DB.
- a package needs production private body.
- a one-repo unit unexpectedly requires another repository's simultaneous write.
- disabled staging becomes user-visible dual-run.
- `public.pieces` is switched before legacy caller exact0.
- M7/M8 scope is pulled into an earlier packet.
- RN capture dependency is installed without B13-A.
- a flag or rollback can re-enable old Q&A.
- implementation needs a product-contract change without separate approval.

## 22. Next exact inactive packet

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

production source effect:
  exact0

automatic progression:
  false

state:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED
```

## 23. Completion

```text
PIECE_IMPLEMENTATION_WORKPACKAGE_INDEX_V1_FIXED
WORK_PACKAGE_GROUPS_B1_B15_EXACT15
IMPLEMENTATION_ORDER_FIXED
RED_IMPLEMENTATION_LIFECYCLE_SEPARATED
B5_SOURCE_ADAPTER_EXTERNAL_CONDITION_OWNED
B12_B13_B14_MULTIREPO_UNITS_SEPARATED
M7_M8_OUT_OF_BAND_FIXED
PCE_U1_U2_WORK_ULTRA_BOUNDARY_PRESERVED
NEXT_PACKET_B01_RED_ONLY_FIXED
IMPLEMENTATION_EFFECT_EXACT0
AUTOMATIC_PROGRESSION_FALSE
PCE8_COMPLETE_DESIGN_ONLY
```
