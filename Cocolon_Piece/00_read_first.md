---
doc_id: cocolon_piece_read_first
title: "Cocolon Piece — Read First"
revision_date: "2026-08-08 JST"
decision_owner: "Mash"
workstream: "Cocolon / Piece"
document_status: "CURRENT_PIECE_WORKSTREAM_ENTRY"
automatic_progression: false
---

# Cocolon Piece — Read First

## 1. Current owner

```text
Piece workstream:
  Cocolon_Piece/

EmlisAI implementation history:
  EmlisAIの実装済み資料/

current Piece premise:
  Cocolon_前提資料/15J_cocolon_piece_workstream_pce7_design_closure_20260808.md
```

Piece / EmlisAI / Analysisの内部ownerを統合しない。PieceはPCE-2のbody-free source handoffだけでsaved inputと接続する。

## 2. Current Piece identity

```text
Piece:
  保存済みユーザー入力を起点に、
  考えや価値観を他者へ伝わるcanonical textへ整形し、
  versioned visual recipeで画像化できるユーザー所有artifact。

record:
  piece.record.v2

public identity:
  piece:<uuid>

canonical visible body:
  piece_text

image binary:
  derived export artifact
  record/feed source-of-truth exact0

Q&A:
  pre-release legacy
  new active format / migration / compatibility exact0
```

## 3. Phase state

```text
PCE-0: COMPLETE
PCE-1: COMPLETE_DESIGN_ONLY
PCE-2: COMPLETE_DESIGN_ONLY
PCE-3: COMPLETE_DESIGN_ONLY
PCE-4: COMPLETE_DESIGN_ONLY
PCE-5: COMPLETE_DESIGN_ONLY
PCE-6: COMPLETE_DESIGN_ONLY
PCE-7: COMPLETE_DESIGN_ONLY

PCE-8 Design Freeze / Work Package Split:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

Analysis Pro-First roadmap:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

## 4. Canonical design owners

```text
PCE-1:
  Cocolon_Piece/pce1_identity_clean_cutover/

PCE-2:
  Cocolon_Piece/pce2_cross_core_source_handoff/

PCE-3:
  Cocolon_Piece/pce3_record_lifecycle_visibility_quota/

PCE-4:
  Cocolon_Piece/pce4_content_format_safety/

PCE-5:
  Cocolon_Piece/pce5_visual_recipe_export/

PCE-6:
  Cocolon_Piece/pce6_api_db_rn_migration/

PCE-7:
  Cocolon_Piece/pce7_test_monitoring_rollback/
    Piece_RED_Contract_Catalog_20260808.md
    Piece_Test_Matrix_20260808.md
    Piece_Monitoring_Privacy_Contract_20260808.md
    Piece_FeatureFlag_Rollback_Design_20260808.md
```

PCE-0 through PCE-6 detailed identities remain in immutable predecessor manifests and each phase's canonical artifacts.

## 5. PCE-1 through PCE-5 fixed boundary

```text
clean cutover:
  old Q&A preservation / adapter / visible coexistence exact0

source:
  saved input exact1
  refined supplemental remains distinct
  Emlis / Analysis body reuse exact0

lifecycle:
  preview_draft / saved / cancelled / rejected / expired / deleted

visibility:
  private default
  public only for current allowed viewer relation

quota:
  first successful save exact1
  visibility/re-export exact0
  new text/format exact1
  delete refund exact0

formats exact3:
  short_essay / quote / declaration

meaning/safety:
  equal for every plan and private/public
  user free text edit exact0

visual:
  versioned recipe/catalog
  themes exact2
  ratios 4:5 / 9:16
  PNG derived export
  RN-first prototype, device-gated release
```

## 6. PCE-6 fixed boundary

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

### Data / DB

```text
physical owner:
  public.piece_records + dedicated Piece family

legacy shared table:
  public.mymodel_reflections preserved for create/generated/unrelated owners

legacy read bridge before final view cutover:
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

`public.pieces` is replaced only after every legacy/shared caller moves to `mymodel_reflections_read` and residual caller count is exact0.

### API / RN / migration

```text
preview source:
  body-free saved source reference
  raw payload resend exact0

canonical operation:
  save, not publish

RN entry:
  saved input + terminal Emlis observation
  -> この入力をPieceにする

owner history:
  separate from Nexus

backend image render route:
  initial exact0

migration:
  M0 tracked baseline
  M1 legacy bridge
  M2 new foundation
  M3 RLS/RPC/staging
  M4 disabled integration
  M5 single clean cutover
  M6 body-free old identity capture
  M7 separate-approval destructive cleanup
  M8 obsolete Q&A retirement
```

Rollback is new Piece safe-disable, never old Q&A restoration.

## 7. PCE-7 fixed contracts

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

### RED / test

```text
required negative contracts:
  exact40

causal RED:
  call-phase invariant failure only
  collection/import/fixture/environment failure noncredit

suite classes:
  exact13

actual transaction/RLS claims:
  actual isolated DB required
  mocks/source checks insufficient

actual device:
  PCE-9E packet + PCE-11 Mash evidence

PCE-7 test implementation/execution:
  exact0 / exact0
```

The exact40 catalog covers source/body non-mixing, preview/save/export equality, private/public/concealment, atomic quota/idempotency/delete, visual/re-export, old Q&A residual, migration scope, monitoring privacy and safe-disabled rollback.

### Monitoring privacy

```text
schema:
  piece.ops_event.v1

mode:
  strict enum allowlist

free-form message/error/meta from Piece:
  exact0

forbidden:
  raw/Piece/Emlis/Analysis body
  content/recipe hash values
  Piece/preview/source/user IDs
  idempotency values
  filenames/paths/recipients
  full exception/request/response body

server terminal outcomes:
  authoritative event owner

RN:
  UI-only body-free events
```

The roadmap candidate `piece_record_published_public` is replaced by `piece_record_saved_public` because PCE-6 fixed save as the canonical operation and separated visibility from lifecycle.

### Feature flags / rollback

```text
flags exact8:
  piece_v2_preview_enabled
  piece_v2_save_enabled
  piece_v2_owner_read_enabled
  piece_v2_public_write_enabled
  piece_v2_public_read_enabled
  piece_v2_visibility_toggle_enabled
  piece_v2_export_enabled
  piece_v2_delete_enabled

missing/unknown:
  false

RN:
  presentation only
  every Piece check uses fallback false

backend:
  authoritative on every affected operation

safe states exact5:
  PRELAUNCH_OFF
  OWNER_RECOVERY_ONLY
  PRIVATE_ONLY
  FULL
  READ_ONLY_OWNER

old Q&A rollback:
  exact0

flag-triggered DB/data effect:
  exact0
```

General rollback preserves healthy owner read/delete where possible. A privacy incident disables public write/read/visibility immediately and never routes users to old Q&A.

## 8. Current actual basis

```text
Cocolon head / tree:
  cf14b503a4e5087b7ef33a82c8073a93517d5b60
  4d64aba7bfe63aecf391a0ba3598589699cec6f1

mashos-api head / tree:
  315813c7bd3372462de926ddad74df567254a6b5
  a641510e107d52bb910073f36604c85bd57af150

current Piece product:
  old Q&A flow

current backend Piece tests:
  old Q&A contract/safety/hash tests

current RN tests:
  Node source-contract suite requiring old Q&A flow

current monitoring:
  generic free-form payload + pattern redaction

current bootstrap flags:
  static boolean map
  generic RN helper fallback defaults true

current Piece-specific RED/test/monitoring/rollback implementation:
  exact0
```

These are design inputs, not PCE-7 execution results.

## 9. Read order

1. `Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt`
2. `Cocolon_前提資料/15J_cocolon_piece_workstream_pce7_design_closure_20260808.md`
3. `Cocolon_Piece/manifest.json`
4. revised clean-cutover roadmap
5. PCE-1 through PCE-7 canonical artifacts
6. PCE-0 catalog closure when DB basis is needed
7. current mashos-api/RN/test/monitoring/bootstrap files for PCE-8

## 10. Prohibited

- collection/import/environment failureをPiece causal REDと扱う。
- DB concurrency/RLSをmockだけでGREENにする。
- production private bodyをtest fixtureへ使う。
- monitoringへPiece/raw/Emlis/Analysis bodyやhash/IDを入れる。
- generic redactionがあることをbody送信許可へ変える。
- missing/unknown Piece flagをtrueにする。
- RN flagだけでserver operationを許可/禁止する。
- flagでDDL/data deletionを行う。
- rollbackでold Q&Aを復活させる。
- public/private incidentでowner recoveryとpublic pathを混同する。
- actual-device evidenceをChat/Workの推測で完了にする。
- PCE-7 designをtest/monitoring/flag実装済みと扱う。
- PCE-8またはAnalysisへautomatic progressionする。

## 11. Next exact actions

```text
next Piece action:
  PCE8_DESIGN_FREEZE_WORK_PACKAGE_SPLIT_DESIGN_ONLY

environment:
  CHAT_5_6_PRO_OK

state:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

next cross-workstream action:
  ANALYSIS_PRO_FIRST_CURRENT_ACTUAL_PRODUCT_QUALITY_CLOSURE_ROADMAP_DESIGN_ONLY
```

## 12. Effects

```text
PCE-7 documentation / premise / checkpoint:
  GitHub reflection required

production source / DB / API / RN / migration / deletion:
  exact0

test files / test execution / CI:
  exact0

monitoring/feature flag runtime change:
  exact0

actual device / release:
  exact0

EmlisAI / Analysis technical state:
  exact0

automatic progression:
  false
```
