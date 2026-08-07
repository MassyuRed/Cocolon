---
doc_id: cocolon_piece_workstream_pce7_design_closure_20260808
title: "Cocolon Piece Workstream — PCE-7 design closure"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-7 Test / Monitoring / Rollback"
phase_completion: true
pce8_activated: false
analysis_roadmap_activated: false
automatic_progression: false
production_effect: "exact0"
---

# Cocolon Piece Workstream — PCE-7 design closure

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

PCE-8:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

Analysis Pro-First roadmap:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

PCE-7 fixes the evidence system that PCE-8/PCE-9 implementation must satisfy. It creates no tests, monitoring runtime, feature flags, DB operations or release authority.

## 2. Fixed contracts

```text
RED catalog:
  piece.red_contract_catalog.v1

Test matrix:
  piece.test_matrix.v1

Monitoring privacy:
  piece.monitoring_privacy.v1

Feature flag / rollback:
  piece.feature_flag_rollback.v1
```

These bind to all PCE-1 through PCE-6 product/data/API/RN/migration contracts.

## 3. RED catalog

```text
required negative contracts:
  exact40

valid RED:
  collected
  call phase executed
  intended invariant failure
  exact future GREEN owner

noncredit:
  import/collection/fixture/environment/network/credential failure
  skip/xfail
  broad exception swallowing
  assertion weakening
```

The exact40 release-blocking invariants cover:

- Emlis/raw/Analysis/source-role non-mixing;
- preview/save/export canonical text equality;
- private/public/access/concealment and owner-history separation;
- atomic quota, idempotency, concurrency, visibility conflict and delete purge;
- visual version retention, no clipping and re-export reproducibility;
- old Q&A route/card residual exact0;
- legacy read bridge and destructive migration scope;
- Piece-specific monitoring body leak exact0;
- server-authoritative fail-closed flags and safe-disabled rollback.

Automated RED implementation remains exact0 in PCE-7.

## 4. Test matrix

```text
suite classes:
  exact13
```

The matrix separates:

```text
pure backend contract/unit
API contract
actual DB transaction integration
actual DB RLS/access integration
migration verification
monitoring privacy
feature flag/rollback
RN source contract
RN state/component logic
renderer/layout logic
staging E2E
Mash actual-device
Work Ultra independent audit
```

Key honesty boundaries:

- DB transaction/concurrency and RLS claims require an actual isolated PostgreSQL/Supabase-compatible environment; mocks or source-string checks are insufficient.
- RN source tests can prove wiring/field/flag contracts but not native font, share sheet, permission or low-memory behavior.
- actual-device evidence remains PCE-11 and `MASH_ACTUAL_DEVICE_REQUIRED`.
- independent cross-repository acceptance remains PCE-U1/U2 and cannot be replaced by repeated single-agent review.

Current old Q&A pytest and RN source-contract tests are inputs only. No PCE-7 suite has run.

## 5. Monitoring privacy

Current generic monitoring accepts free-form `message`, `error_message` and nested `meta`, then pattern-redacts email/UUID/token-like material. PCE-7 does not treat that as permission or proof for Piece bodies.

```text
Piece event schema:
  piece.ops_event.v1

mode:
  exact enum/numeric allowlist

Piece free-form message/error/meta:
  exact0

forbidden:
  raw input
  Piece text/content
  Emlis visible/internal body
  Analysis inference/simulation
  supplemental body
  safety source/trace
  content/recipe hash values
  Piece/preview/source/user IDs
  idempotency values
  filenames/paths/recipients
  full exception/request/response body
```

Server terminal operations own save/quota/access/visibility/delete/hash/migration/rollback events. RN owns UI-only body-free observations. Both validate the same allowlist before current generic monitoring helpers.

The roadmap candidate `piece_record_published_public` is replaced by `piece_record_saved_public` because PCE-6 fixed `save` as canonical and visibility is not lifecycle.

Immediate critical events include any private visibility guard failure, hash mismatch, post-cutover old Q&A residual, migration guard failure, over-quota success, monitoring privacy canary and rollback write-cutoff violation.

Current source confirms structured logging/client events but does not confirm deployed external retention or Piece event storage. Initial Piece event DB table remains exact0. PCE-12 must pin the deployed log/alert owner, at least 14-day body-free search availability, and execute an alert/rollback drill.

## 6. Feature flags and rollback

Exact Piece flags:

```text
piece_v2_preview_enabled
piece_v2_save_enabled
piece_v2_owner_read_enabled
piece_v2_public_write_enabled
piece_v2_public_read_enabled
piece_v2_visibility_toggle_enabled
piece_v2_export_enabled
piece_v2_delete_enabled
```

```text
missing/unknown:
  false

RN:
  presentation only
  explicit fallback false

backend:
  authoritative terminal enforcement

flag-induced DDL/data deletion:
  exact0

old Q&A re-enable flag:
  exact0
```

Safe states:

```text
P7-FS0_PRELAUNCH_OFF
P7-FS1_OWNER_RECOVERY_ONLY
P7-FS2_PRIVATE_ONLY
P7-FS3_FULL
P7-FS4_READ_ONLY_OWNER
```

General incidents preserve healthy owner read/delete where possible. Public/privacy incidents immediately disable public write/read/visibility; quota/storage incidents disable new writes; renderer incidents disable export only. Rollback never routes to old Q&A.

Current `/app/bootstrap` and RN runtime context are reusable distribution primitives, but current generic RN helper defaults to a true fallback when callers omit it. PCE-9D must require explicit false at every Piece flag call, while backend gates remain independent of client freshness.

## 7. Current actual basis

```text
Cocolon head / tree:
  cf14b503a4e5087b7ef33a82c8073a93517d5b60
  4d64aba7bfe63aecf391a0ba3598589699cec6f1

mashos-api head / tree:
  315813c7bd3372462de926ddad74df567254a6b5
  a641510e107d52bb910073f36604c85bd57af150

roadmap SHA-256:
  2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939
```

Confirmed current actual:

```text
current Piece tests:
  old Q&A contract/safety/hash tests

current RN tests:
  Node source-contract suite requiring old Q&A preview/publish/cancel/card

current client monitoring:
  generic free-form fields + pattern redaction

current server observability:
  structured log/alert helpers + request performance counters

current feature flags:
  /app/bootstrap boolean map
  no Piece flags

current RN runtime:
  bootstrap context
  generic helper fallback defaults true

current Piece-specific RED/test/monitoring/rollback implementation:
  exact0
```

## 8. PCE-7 artifacts

| role | path | Git blob SHA-1 |
|---|---|---|
| RED catalog | `Cocolon_Piece/pce7_test_monitoring_rollback/Piece_RED_Contract_Catalog_20260808.md` | `c42aff5a7f00a81fb09bef1455a10453efc80a0f` |
| test matrix | `Cocolon_Piece/pce7_test_monitoring_rollback/Piece_Test_Matrix_20260808.md` | `cac4ca213133b872867465445bcdc04ae48b9b48` |
| monitoring privacy | `Cocolon_Piece/pce7_test_monitoring_rollback/Piece_Monitoring_Privacy_Contract_20260808.md` | `9076310d0f27266626685bd3feb814f9e745c4d4` |
| feature flag / rollback | `Cocolon_Piece/pce7_test_monitoring_rollback/Piece_FeatureFlag_Rollback_Design_20260808.md` | `b5b57df5b89fee3ea9f1950fb9cec4cf57f8676f` |

## 9. Completed / not implemented

Completed:

- exact40 RED invariant catalog and causal RED definition;
- suite/evidence ownership and actual DB/device/independent-review separation;
- Piece-specific strict monitoring allowlist, events, alerts and privacy tests;
- exact8 server-authoritative fail-closed flags;
- dependency lattice, five safe states and incident rollback playbooks;
- old Q&A non-restoration and body-free rollback evidence contract;
- current entry/manifest/premise update design.

Not implemented:

```text
production source / DB / API / RN / migration:
  exact0

test files / CI / test execution:
  exact0

monitoring event builder / alert config:
  exact0

feature flags / rollback runtime:
  exact0

actual-device / independent audit / release:
  exact0
```

## 10. Facts / inference / Karen's opinion

### Confirmed facts

The PCE-7 roadmap requirements, PCE-1 through PCE-6 contracts, current repository heads, current old Q&A tests/RN assertions, current generic monitoring implementation/tests, current bootstrap flag map and RN runtime context were confirmed.

### Inference / unconfirmed

The exact isolated DB test runner, RN component-test library, CI provider, external log platform/retention, deployment flag command/credential owner, production DB drift, actual-device behavior and independent review results remain unconfirmed. PCE-7 does not claim implementation or PASS.

### Karen's opinion

The most important PCE-7 boundary is that generic redaction is not a Piece privacy contract. The safer design is to make it impossible for Piece callers to submit free-form prose at all.

The second important boundary is rollback direction. After clean cutover, rollback must remove unsafe capability while preserving owner recovery; restoring old Q&A would recreate the product contract deliberately removed in PCE-1.

## 11. Next exact action

```text
PCE8_DESIGN_FREEZE_WORK_PACKAGE_SPLIT_DESIGN_ONLY

environment:
  CHAT_5_6_PRO_OK

state:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED
```

Analysis roadmap also remains unactivated. Mash-side action required for PCE-7 closure is exact0.

## 12. Effects / closure

```text
Cocolon documentation / Piece premise:
  reflected

production source / DB / API / RN / migration / deletion:
  exact0

test / CI / runtime / actual device:
  exact0

monitoring / feature flag runtime:
  exact0

EmlisAI / Analysis technical state:
  exact0

release effect:
  exact0

automatic progression:
  false

PCE7_RED_CATALOG_FIXED
PCE7_TEST_MATRIX_FIXED
PCE7_MONITORING_PRIVACY_FIXED
PCE7_FEATURE_FLAG_ROLLBACK_FIXED
PCE7_COMPLETE_DESIGN_ONLY
PCE8_NOT_ACTIVATED
ANALYSIS_ROADMAP_NOT_ACTIVATED
```
