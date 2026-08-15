---
doc_id: cocolon_piece_read_first
title: "Cocolon Piece — Read First"
revision_date: "2026-08-15 JST"
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

current Piece structure map:
  Cocolon_前提資料/current_structure/02_piece_current_structure.md

current Piece premise / historical phase closure:
  Cocolon_前提資料/15L_cocolon_piece_workstream_pce9a_b01_closure_20260808.md
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

PCE-9A B01-R Contract/Version Causal RED:
  COMPLETE_TEST_ONLY_CAUSAL_RED

PCE-9A B01-I Contract Owner Implementation:
  COMPLETE_CODE_DISABLED_TARGETED_GREEN

PCE-9A B02-A M0/M1 Tracked Migration + Legacy Bridge:
  CAUSAL_RED_TEST_FROZEN_PRESENT
  EXECUTION_CREDIT_UNVERIFIED
  IMPLEMENTATION_ARTIFACTS_NOT_MATERIALIZED
  DISPOSABLE_DATABASE_GREEN_NOT_RUN_NOT_CREDIT
  PRODUCTION_APPLY_NOT_AUTHORIZED
  IMPLEMENTATION_REQUIRES_SEPARATE_MASH_APPROVAL

Analysis roadmap:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

Analysis current role alignment:
  Cocolon_Piece/handoff/Cocolon_Piece_Analysis_RoleAlignment_Overlay_20260812.md
  PRO_PRODUCT_ALIGNMENT_AND_EXPLANATION
  ULTRA_INITIAL_FINAL_TECHNICAL_DESIGN_AND_EXECUTION
  FUTURE_UNEXECUTED_STAGES_ONLY

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

PCE-0 through PCE-8の詳細identityはimmutable predecessor manifests、各Phase canonical artifact、07N checkpointに保持される。

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
  public.pieces after legacy shared caller exact0

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

## 8. PCE-8 fixed boundary

```text
design freeze:
  piece.design_freeze.v1

work-package index:
  piece.implementation_workpackage_index.v1

environment assignment:
  piece.environment_assignment_ledger.v1

product/design decisions unresolved:
  exact0

runtime/tooling/deployment conditions:
  exact6 with fixed owner

work-package groups:
  B1..B15 exact15

packet lifecycle:
  R causal RED
  I bounded implementation + targeted GREEN
  automatic progression false
```

```text
B6 terminal owner:
  Save API, not publish

new staged backend API owner:
  api_piece_v2.py
  unregistered until M5

public.pieces cutover:
  after legacy shared caller exact0 only

monitoring public terminal event:
  piece_record_saved_public

Piece RN flag fallback:
  explicit false at every call

RN initial tests:
  existing node:test + pure state model

M7 destructive cleanup:
  outside B1-B15
  separate Mash approval

multirepository B-group:
  dependency group only
  separate repository write units
```

## 9. PCE-9A B01 current implementation state

### B01-R causal RED

```text
repository:
  MassyuRed/mashos-api

commit:
  522af8cb66fb8e4d8e1b4b2d6cc82cf10545ce56

tree:
  37fe412c1f7b342cd521e88fc3b010bbccafa2ae

test path:
  ai/tests/piece_v2/test_b01_piece_v2_contract_red.py

test blob:
  00bf4dea9a2321c59265d2bbb211ae5b13b97cde

causal signature:
  PCE9A_B01_PIECE_V2_CONTRACT_OWNER_IMPLEMENTATION_ABSENT_RED

covered release blockers:
  PCE7-R008
  PCE7-R013
  PCE7-R027
  PCE7-R037

production source / DB / API / RN / runtime effect:
  exact0
```

B01-Rはcollection/import/environment failureではなく、future owner不存在をtest call phaseのstable causal REDとして固定した。

### B01-I pure contract owner

```text
repository:
  MassyuRed/mashos-api

commit:
  7a10fc593b123cb9d9b02147c4b345894dba0c0b

tree:
  842715d588c0573f0de5411dae62b8b8bb22f3a4

owner path:
  ai/services/ai_inference/piece_v2_contract.py

owner blob:
  e4d20c9d0994b0a05f086ff6543de9d5cf2f31aa

classification:
  CODE_DISABLED

implemented responsibilities:
  exact contract-version registry
  canonical UTF-8 compact JSON / SHA-256
  content payload -> piece_text reconstruction
  piece_text/hash binding
  visibility missing -> private / unknown reject
  public Piece field allowlist
  strict Piece ops-event allowlist

targeted GREEN recorded by completed B01-I authority:
  collected exact1
  passed exact1
  failed/error/skipped/xfail exact0

existing RED test modification:
  exact0

API registration / DB / migration / RN / runtime connection:
  exact0
```

このDOC_ONLY同期ではpytestを再実行していない。B01-Iの実行結果をcurrent workstreamへ記録し、GitHub上のtest/owner commit・blob identityをfresh確認した。

## 10. Frozen implementation order and current next

```text
01 B1      COMPLETE
02 B2-A    CAUSAL_RED_TEST_FROZEN_PRESENT__EXECUTION_UNVERIFIED__IMPLEMENTATION_INACTIVE
03 B2-B    NOT_ACTIVATED
04 B3      NOT_ACTIVATED
05 B4      NOT_ACTIVATED
06 B8      NOT_ACTIVATED
07 B9      NOT_ACTIVATED
08 B14-A   NOT_ACTIVATED
09 B5-A    NOT_ACTIVATED
10 B5-B    NOT_ACTIVATED
11 B6      NOT_ACTIVATED
12 B7      NOT_ACTIVATED
13 B14-B   NOT_ACTIVATED
14 B10     NOT_ACTIVATED
15 B11     NOT_ACTIVATED
16 B13     NOT_ACTIVATED
17 B12-A   NOT_ACTIVATED
18 B12-B   NOT_ACTIVATED
19 B12-C   NOT_ACTIVATED
20 B15     NOT_ACTIVATED
21 PCE-U1  NOT_ACTIVATED
```

B2-AはM0 tracked migration baselineとM1 legacy read bridge/current caller rebindを扱う。causal RED test bytesはcurrent mashos-api mainに存在するが、durable execution creditは未確認である。M0/M1 implementation、disposable PostgreSQL GREEN、production applyは未成立であり、B1完了またはtest存在による自動activationはない。

## 11. Environment assignment

```text
bounded B1-B15 design/code:
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

## 12. Read order

1. `Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt`
2. `Cocolon_前提資料/current_structure/02_piece_current_structure.md`
3. `Cocolon_前提資料/15L_cocolon_piece_workstream_pce9a_b01_closure_20260808.md`
4. `Cocolon_Piece/manifest.json`
5. revised clean-cutover roadmap
6. PCE-1 through PCE-8 canonical artifacts
7. B01 RED test and pure contract owner at their pinned mashos-api commits
8. B02-A frozen causal RED test bytes and exact target/current files for a separately approved implementation packet
9. PCE-7 RED/test matrix rows assigned to B02-A
10. Analysis作業の場合だけ、`Cocolon_Piece/handoff/Cocolon_Piece_Analysis_RoleAlignment_Overlay_20260812.md`

## 13. Prohibited

- B01 targeted GREENをPiece全体、PCE-9A全体、releaseのGREENへ拡大する。
- `piece_v2_contract.py`をAPI登録済み、DB接続済み、runtime activeと扱う。
- B01 RED testを次packetで無承認変更する。
- B2-AをB01完了から自動activationする。
- actual migration/RLS claimをmockだけでGREENにする。
- `public.pieces`をlegacy shared caller exact0前に置換する。
- current Q&A routeをM5前にnew v2へ置換・二重登録する。
- B5 source adapterでEmlis visible/internal bodyをコピーする。
- generic free-form monitoringをPiece callerへ開放する。
- missing/unknown Piece flagをtrueにする。
- M7/M8をB1-B15へ混在させる。
- rollbackでold Q&Aを復活させる。
- actual-device/Work evidenceをChatの推測で完了にする。
- PCE-U1、Analysisまたはproductionへautomatic progressionする。
- historical `Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807`を書き換え、current role ownerとして再利用する。

## 14. Current actual basis

```text
Cocolon audited main head / tree:
  de9c3d985053bbaaa7fc0d396e688cc2097ece40
  4e7901f8b3e10d20f242e19be91f6c725f625b2a

mashos-api current head / tree:
  a8ca4ddf7b7ae76bf7b3d73e74e3a5808d623428
  a7f782e48e8ac0c97992c74e5a0c5a828f1a9e00

B02-A causal RED test:
  ai/tests/piece_v2/db/test_b02_m0_m1_legacy_bridge.py
  FROZEN_PRESENT
  EXECUTION_CREDIT_UNVERIFIED

B02-A implementation required exact5:
  absent

current user-visible product:
  old Q&A Piece flow

new Piece pure contract owner:
  present, code-disabled

new Piece API registration:
  absent

new Piece DB / migration / RN / runtime:
  absent

current Piece v2 feature flags:
  absent
```

## 15. Next exact inactive group

```text
group:
  B2-A M0 Tracked Baseline + M1 Legacy Read Bridge

environment:
  CHAT_5_6_PRO_OK
  ISOLATED_DB_REQUIRED for honest migration GREEN

state:
  CAUSAL_RED_TEST_FROZEN_PRESENT
  EXECUTION_CREDIT_UNVERIFIED
  IMPLEMENTATION_NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

expected first lifecycle:
  bounded M0/M1 implementation + isolated migration GREEN

production DB apply:
  exact0 until separately approved

automatic progression:
  false
```

## 16. Effects

```text
B01 mashos-api source addition:
  exact1 pure contract owner

B01 API / DB / migration / RN / runtime connection:
  exact0

this state-sync Cocolon documentation:
  STAGED_IN_DOCS_DRAFT
  EFFECTIVE_WHEN_MERGED

this state-sync production source / DB / API / RN / runtime:
  exact0

EmlisAI / Analysis technical state:
  exact0

release effect:
  exact0

automatic progression:
  false
```


