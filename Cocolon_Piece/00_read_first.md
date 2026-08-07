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
  Cocolon_前提資料/15K_cocolon_piece_workstream_pce8_design_closure_20260808.md
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

PCE-8:
  Cocolon_Piece/pce8_design_freeze_work_packages/
    Piece_Design_Freeze_Candidate_20260808.md
    Piece_Implementation_WorkPackage_Index_20260808.md
    Piece_Environment_Assignment_Ledger_20260808.md
```

PCE-0 through PCE-7 detailed identities remain in immutable predecessor manifests and each phase's canonical artifacts.

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
  preview/mutation/visibility/re-export/failed export exact0
  delete refund exact0

formats exact3:
  short_essay / quote / declaration

meaning/safety:
  equal for every plan and private/public
  user free text edit / safety override exact0

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

canonical API operation:
  save, not publish

RN entry:
  saved input + terminal Emlis observation
  -> この入力をPieceにする

owner history:
  separate from Nexus

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

## 7. PCE-7 fixed boundary

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

```text
required negative contracts:
  PCE7-R001..R040 exact40

valid causal RED:
  collected + call-phase intended invariant failure
  import/collection/fixture/environment failure noncredit

suite classes:
  exact13

actual DB transaction/RLS:
  actual isolated DB required
  mock-only GREEN prohibited

monitoring:
  piece.ops_event.v1 strict enum/numeric allowlist
  free-form Piece body/error/meta exact0

feature flags exact8:
  missing/unknown false
  backend authoritative

safe states exact5:
  PRELAUNCH_OFF
  OWNER_RECOVERY_ONLY
  PRIVATE_ONLY
  FULL
  READ_ONLY_OWNER
```

Actual-device evidence belongs to PCE-11/Mash. Independent cross-repository acceptance belongs to PCE-U1/U2 Work Ultra.

## 8. PCE-8 fixed contracts

```text
design freeze:
  piece.design_freeze.v1

work-package index:
  piece.implementation_workpackage_index.v1

environment assignment:
  piece.environment_assignment_ledger.v1
```

### Freeze verdict

```text
product/design decisions unresolved:
  exact0

runtime/tooling/deployment conditions:
  exact6 with fixed owner

implementation started:
  false

production effect:
  exact0
```

The external conditions are exact source binding, RN capture dependency, isolated DB runner, production flag owner, external log/alert owner and device/independent evidence. They are not product semantics and may not be guessed or replaced with weaker evidence.

### Design-conflict resolution

```text
B6 provisional publish API:
  frozen as Save API

new staged backend API owner:
  api_piece_v2.py
  unregistered until M5

public.pieces cutover:
  after legacy shared caller exact0 only

monitoring public terminal event:
  piece_record_saved_public

Piece RN flag fallback:
  explicit false at every call

RN component-test dependency:
  not added initially
  existing node:test + pure state model first

M7 destructive cleanup:
  outside B1-B15
  separate Mash approval

multirepository B-group:
  dependency group only
  separate repository write units
```

## 9. Frozen B1–B15 implementation order

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

Every source/SQL package separates causal RED from implementation/GREEN. Completion never auto-activates the next package.

## 10. Exact future owner roots

### mashos-api

```text
ai/services/ai_inference/piece_v2_*.py
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

Current old Q&A owners are not silently reclassified as new Piece owners. They remain current actual until the M5 cutover and are retired only under the exact B12-C/M8 scope.

## 11. Environment assignment

```text
PCE-8 / bounded B1-B15 design-code:
  CHAT_5_6_PRO_OK

actual DB transaction/RLS/migration evidence:
  ISOLATED_DB_REQUIRED

integrated non-production flow:
  STAGING_RUNTIME_REQUIRED

native iOS/Android behavior:
  MASH_ACTUAL_DEVICE_REQUIRED

independent cross-repository acceptance:
  WORK_ULTRA_REQUIRED at PCE-U1/U2

production runtime/migration/rollback/destructive operation:
  DEPLOYMENT_OWNER_REQUIRED
```

Work priority remains:

```text
EmlisAI current executable Work-required task
  > Piece PCE-U1 / PCE-U2
```

Additional credit purchase is not presumed. Environment unavailability never weakens the evidence contract.

## 12. Read order

1. `Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt`
2. `Cocolon_前提資料/15K_cocolon_piece_workstream_pce8_design_closure_20260808.md`
3. `Cocolon_Piece/manifest.json`
4. revised clean-cutover roadmap
5. PCE-1 through PCE-8 canonical artifacts
6. PCE-0 catalog closure when DB basis is needed
7. exact target/current files for the approved B packet
8. PCE-7 RED/test matrix rows assigned to that packet

## 13. Prohibited

- PCE-8 design closureをimplementation authorityとして使う。
- B1-Rの完了からB1-Iまたは次groupへ自動進行する。
- provisional `publish API`をnew Piece terminal ownerへ戻す。
- current Q&A routeをM5前にnew v2へ置換・二重登録する。
- `public.pieces`をlegacy shared caller exact0前に置換する。
- B5 source adapterでEmlis visible/internal bodyをコピーする。
- transaction/RLSをmockだけでGREENにする。
- RN capture dependencyをB13-A前に追加する。
- generic free-form monitoringをPiece callerへ開放する。
- missing/unknown Piece flagをtrueにする。
- owner historyをpublic Nexus queryで実装する。
- multirepository groupを一つの無制限authorityへ束ねる。
- M7/M8をB1-B15へ混在させる。
- rollbackでold Q&Aを復活させる。
- actual-device/Work evidenceをChatの推測で完了にする。
- PCE-U1、Analysisまたはproductionへautomatic progressionする。

## 14. Current actual basis

```text
Cocolon head / tree:
  5316c8b3a9eef2ae84f6340aab24ee7ec8e654f5
  ae6964261649492e2186d1ee277956d9d5d12874

mashos-api head / tree:
  315813c7bd3372462de926ddad74df567254a6b5
  a641510e107d52bb910073f36604c85bd57af150

current product:
  old Q&A Piece flow

new Piece production code/SQL/RN/test/runtime:
  exact0

current `COCOLON_PIECES_READ_TABLE` search:
  exact6 current callers

current RN test framework:
  Node node:test

current Piece v2 feature flags:
  absent
```

These are PCE-8 design inputs, not implementation results.

## 15. Next exact inactive packet

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

## 16. Effects

```text
PCE-8 documentation / premise / checkpoint:
  GitHub reflection required

Cocolon production source:
  exact0

mashos-api production source:
  exact0

DB / API / RN / migration / deletion:
  exact0

test files / test execution / CI:
  exact0

monitoring / feature flag runtime:
  exact0

actual device / Work Ultra / release:
  exact0

EmlisAI / Analysis technical state:
  exact0

automatic progression:
  false
```
