---
doc_id: piece_design_freeze_candidate_20260808
title: "Piece design freeze candidate"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-8 Design Freeze / Work Package Split"
document_status: "PCE8_COMPLETE_DESIGN_ONLY_FREEZE_CANDIDATE"
contract_id: "piece.design_freeze.v1"
source_cocolon_head: "5316c8b3a9eef2ae84f6340aab24ee7ec8e654f5"
source_cocolon_tree: "ae6964261649492e2186d1ee277956d9d5d12874"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
source_roadmap_sha256: "2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939"
automatic_progression: false
production_effect: "exact0"
---

# Piece design freeze candidate

## 1. Purpose and verdict

PCE-8 freezes the implementation-facing interpretation of PCE-0 through PCE-7. It removes design ambiguity before production code, SQL, RN wiring, monitoring, migration or destructive cleanup begins.

```text
contract:
  piece.design_freeze.v1

product/design decisions unresolved:
  exact0

runtime/tooling/deployment conditions still external:
  exact6

implementation started:
  false

production effect:
  exact0
```

This document is a freeze candidate for separately approved bounded implementation packets. It is not an implementation authority, migration authority, deployment authority, destructive cleanup authority, Work Ultra allocation or release approval.

## 2. Frozen product contracts

The following decisions are implementation inputs and are not delegated to a future implementer.

### Identity and clean cutover

```text
user-facing name:
  Piece

record:
  piece.record.v2

public identity:
  piece:<uuid>

canonical visible body:
  piece_text

old Q&A:
  pre-release legacy
  active new format exact0
  data migration/adapter exact0
  user-visible dual run exact0
```

### Source and body ownership

```text
source root:
  saved input identity exact1

normal/pre-question:
  original input role exact1
  supplemental exact0

refined:
  original role exact1
  supplemental role exact1 and distinct

Emlis visible/internal body as Piece source:
  exact0

Analysis inference/simulation as Piece source:
  exact0

raw body copied into Piece record/monitoring/export metadata:
  exact0
```

### Lifecycle, visibility and quota

```text
lifecycle:
  preview_draft / saved / cancelled / rejected / expired / deleted

visibility:
  private / public
  default private
  lifecycle != visibility

public:
  saved + current viewer relation
  world-readable exact0

quota:
  first successful saved record exact1
  preview/mutation/visibility/re-export/failed export exact0
  delete refund exact0
```

### Content and visual

```text
formats exact3:
  short_essay / quote / declaration

Q&A/fragment active:
  exact0 / exact0

free text editing/safety override:
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

renderer direction:
  RN-first prototype
  release acceptance device-gated
```

### DB, API and RN

```text
physical owner:
  public.piece_records + dedicated Piece family

legacy shared table:
  public.mymodel_reflections preserved for create/generated/unrelated owners

legacy bridge before final projection:
  public.mymodel_reflections_read

final Piece projection:
  public.pieces

atomic operations:
  piece_save_v2
  piece_set_visibility_v2
  piece_delete_v2

canonical API operation:
  save, not publish

RN entry:
  saved input + terminal Emlis observation
  -> この入力をPieceにする

owner history:
  dedicated owner flow, not public-feed reuse
```

### Evidence and rollback

```text
required negative contracts:
  PCE7-R001..R040 exact40

valid RED:
  collected + call-phase intended invariant failure

monitoring:
  piece.ops_event.v1 strict enum/numeric allowlist
  free-form Piece body/error/meta exact0

feature flags:
  exact8
  missing/unknown false
  backend authoritative

safe states:
  exact5

rollback:
  new Piece safe-disable
  old Q&A restoration exact0
```

## 3. Design-conflict resolutions

### FZ-C01 — `publish` candidate is replaced by `save`

The roadmap's provisional B6 `publish API` name is superseded by PCE-6's canonical `save` operation.

```text
frozen package name:
  B6 Save API

/emotion/piece/publish:
  old Q&A route to retire

new terminal route:
  POST /emotion/piece/save
```

This does not change PCE-6; it applies PCE-6 to the earlier provisional B-list.

### FZ-C02 — disabled staging uses a new module owner

PCE-6 deferred exact service filenames to PCE-8. To avoid replacing the current Q&A route before M5, new owner/write routes are staged in:

```text
ai/services/ai_inference/api_piece_v2.py
```

They are tested through a dedicated test FastAPI app and remain unregistered in the production `app.py` until the clean-cutover write unit. At M5, the neutral `/emotion/piece/*` namespace is registered from the new owner and the old owner registration is removed. This is disabled staging, not a compatibility API or product dual-run.

### FZ-C03 — `public.pieces` is never replaced first

Current source search identifies exact6 `COCOLON_PIECES_READ_TABLE` consumers:

```text
emlis_ai_readers.py
piece_generated_metrics.py
astor_worker.py
api_piece_runtime.py
piece_public_read_store.py
piece_generation_store.py
```

M1 creates `public.mymodel_reflections_read` and rebinds these current callers before the name `public.pieces` changes meaning. Implementation repeats the fresh repository search and stops if a new caller appears.

### FZ-C04 — monitoring uses `saved_public`

```text
superseded provisional event:
  piece_record_published_public

frozen event:
  piece_record_saved_public
```

Visibility and lifecycle remain separate.

### FZ-C05 — Piece feature checks always supply false fallback

The generic RN helper may keep its unrelated default. Every Piece call site must use:

```text
isFeatureEnabled(pieceFlagName, false)
```

Backend terminal enforcement remains authoritative.

### FZ-C06 — no new RN component-test framework at entry

Current `package.json` has Node `node:test` and no RN component-test framework. PCE-8 selects the following initial approach:

```text
static/wire tests:
  existing Node node:test

state/component logic:
  extract pure JS state models and test with Node node:test

native rendering/share/permission:
  PCE-9E device packet + PCE-11 Mash actual-device
```

A new component-test dependency may be proposed only if a specific P7-S09 invariant cannot be observed through pure state models and device evidence. It is not added by default.

### FZ-C07 — M7 remains outside B1–B15

M7 old-Q&A destructive cleanup requires a frozen M6 identity packet and separate Mash approval. No B package consumes that authority, deletes old rows or widens the predicate.

### FZ-C08 — multi-repository groups do not become one authority

B12, B13 and B14 have backend/RN write units. Their group IDs express dependency, not a single multi-repository write authority. Every repository write unit receives separate scope, preimage, commit, tests and postverification.

## 4. Exact future owner paths

### mashos-api new owners

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
```

These names are selected to isolate the staged new owner from current Q&A modules. They are not compatibility wrappers. Old files are retired only at the M5/M8 boundaries defined below.

### mashos-api migration/test owners

```text
supabase/migrations/README.md
supabase/migrations/manifest.json
supabase/migrations/20260808_001_piece_v2_legacy_read_bridge.sql
supabase/migrations/20260808_002_piece_v2_foundation.sql
supabase/migrations/20260808_003_piece_v2_rls_and_staging.sql
supabase/migrations/20260808_004_piece_v2_atomic_functions.sql
supabase/migrations/20260808_005_piece_v2_clean_cutover.sql

requirements-piece-v2-test.txt
ai/tests/piece_v2/
ai/tests/piece_v2/db/
```

The filenames identify ordered repository artifacts, not permission to apply them to production. Any catalog drift before implementation stops the packet and requires additive correction rather than silently editing an applied migration.

### Cocolon new owners

```text
features/piece/pieceApi.js
features/piece/pieceRuntime.js
features/piece/pieceMonitoring.js
features/piece/piecePreviewModel.js
features/piece/pieceOwnerModel.js
features/piece/pieceRenderer.js
features/piece/pieceLayout.js
features/piece/pieceExport.js
features/piece/PieceCreateController.js
features/piece/PieceOwnerHistoryController.js
components/piece/PieceVisualCard.js
components/piece/PiecePreviewModal.js
components/piece/PieceOwnerCard.js
components/piece/PieceExportCanvas.js
components/piece/NexusPieceCard.js
screens/input/InputPieceActionArea.js
screens/PieceOwnerHistoryScreen.js

tests/piece-v2-contracts.test.js
tests/piece-v2-state-models.test.js
tests/piece-v2-renderer.test.js
```

Current `InputPiecePreviewController.js`, `EmotionPiecePreviewModal.js`, Q&A normalizers/cards and old Piece wire aliases are not new owners. They remain current actual until clean cutover and then become removal targets.

## 5. Migration-to-package binding

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
  B5 through B14 staged with effective flags false

M5 one product clean cutover:
  B12-C after all prerequisites

M6 body-free old identity capture:
  B12-C tool/evidence, after B15 verification

M7 destructive cleanup:
  outside B1-B15; separate Mash approval

M8 obsolete contract retirement:
  separate bounded Pro packet after verified M7
```

No production migration is applied in PCE-8.

## 6. RED-first and closure rules

Every code/SQL work unit follows:

```text
1. exact RED IDs and test path freeze
2. causal RED call-phase verification
3. bounded implementation
4. targeted GREEN
5. predecessor regression subset
6. monitoring/privacy and flag subset where applicable
7. exact changed-path review
8. remote bytes/head verification
9. durable body-free result
```

A group may not auto-run its implementation after a RED-only authority. A RED result, GREEN result and next packet each require the lifecycle defined by the work-package index.

## 7. Unresolved-condition ledger

These conditions are not product-design decisions. Each has a fixed future owner and must not be guessed by an implementer.

| ID | Condition | Current state | Fixed owner / effect |
|---|---|---|---|
| `PCE8-U01` | exact saved-input/Emlis terminal source adapter binding | designed abstractly; runtime owner may still move | B5-A / PCE-9C; blocks source-adapter GREEN and CTA wiring, not B1–B4/B8/B9/B14 |
| `PCE8-U02` | RN capture/media-save dependency | not selected | B13-A preflight; no package install until primary-source compatibility and minimal-path evidence |
| `PCE8-U03` | isolated actual PostgreSQL endpoint/runner | not materialized in current repos | B2-A preflight; required for S03/S04/S05 GREEN, mocks prohibited |
| `PCE8-U04` | production flag command/credential owner | external/deployment unconfirmed | PCE-12; no public mutation API or guessed command |
| `PCE8-U05` | external log platform/retention/alert drill | external/deployment unconfirmed | PCE-12; 14-day body-free search target remains acceptance condition |
| `PCE8-U06` | iOS/Android and independent acceptance evidence | not run | PCE-11 Mash device, PCE-U1/U2 Work Ultra |

```text
unresolved product semantics:
  exact0

unresolved runtime/tooling/deployment conditions:
  exact6 with explicit owner
```

## 8. Change classification

Every future write unit is classified before approval.

```text
DOC_ONLY:
  contract/index/evidence only

TEST_ONLY_RED:
  synthetic tests; production source exact0

CODE_DISABLED:
  production code present but effective Piece flags false/unregistered

DB_MIGRATION_FILE_ONLY:
  tracked SQL committed; production apply exact0

STAGING_EXECUTION:
  non-production DB/API/RN evidence

DESTRUCTIVE_DB:
  M7 only, separate approval

MASH_ACTUAL_DEVICE:
  PCE-11 only

WORK_INDEPENDENT_AUDIT:
  PCE-U1/U2 only
```

PCE-8 itself is `DOC_ONLY`.

## 9. Freeze mutation rule

After PCE-8 closure, PCE-1 through PCE-7 product contracts and this implementation interpretation are frozen for PCE-9.

A later packet may change them only by stating:

```text
prior position
proposed position
new fact or exact error
contracts retained
contracts changed
owner and impact
separate Mash approval
```

Tooling substitution inside the same interface is allowed only when the packet's exact STOP/acceptance rules are preserved and the substitution is recorded before implementation.

## 10. STOP conditions

- A future implementer must invent product behavior not fixed here.
- One authority would need to modify both repositories without separable write units.
- M7 deletion is bundled with schema foundation, application cutover or docs.
- `public.pieces` replacement is requested before current shared callers are exact0.
- B5 source adapter requires copying Emlis visible/internal body.
- DB atomicity/RLS is claimed through mocks.
- RN renderer dependency is installed before B13 preflight.
- Missing Piece flags can resolve true.
- Monitoring requires a free-form Piece field.
- A rollback path requires old Q&A restoration.
- Work Ultra or actual-device evidence is claimed through Chat-only repetition.

## 11. Completion

```text
PIECE_DESIGN_FREEZE_V1_FIXED
PCE0_PCE7_IMPLEMENTATION_INTERPRETATION_FROZEN
PRODUCT_DECISION_UNRESOLVED_EXACT0
RUNTIME_TOOLING_DEPLOYMENT_CONDITIONS_EXACT6_OWNED
NEW_BACKEND_OWNER_PATHS_FIXED
NEW_RN_OWNER_PATHS_FIXED
M0_M8_PACKAGE_BINDING_FIXED
RED_FIRST_LIFECYCLE_FIXED
M7_OUTSIDE_B1_B15_SEPARATE_APPROVAL
MULTIREPO_GROUP_NOT_SINGLE_AUTHORITY
IMPLEMENTATION_EXACT0
PRODUCTION_EFFECT_EXACT0
PCE8_COMPLETE_DESIGN_ONLY
```
