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
  Cocolon_前提資料/15I_cocolon_piece_workstream_pce6_design_closure_20260808.md
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

PCE-7 Test / Monitoring / Rollback:
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
    Piece_New_Data_Contract_Design_20260808.md
    Piece_API_CleanCutover_Design_20260808.md
    Piece_RN_Flow_Design_20260808.md
    Piece_OldQna_Removal_And_DB_Migration_Design_20260808.md
```

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

## 6. PCE-6 fixed contracts

```text
data contract:
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
selected physical owner:
  public.piece_records + dedicated Piece family

legacy shared table:
  public.mymodel_reflections preserved for create/generated/unrelated owners

legacy read bridge before view cutover:
  public.mymodel_reflections_read

final new Piece view:
  public.pieces

quota:
  dedicated body-free ledger + owner/JST-month lock

state:
  dedicated metrics / reads / resonances

receipts:
  body-free export / delete

atomic functions:
  piece_save_v2
  piece_set_visibility_v2
  piece_delete_v2

access:
  base RLS ENABLE + FORCE
  RN direct base-table DML exact0
  backend application-service owner
```

`public.pieces` currently serves shared legacy/non-Piece readers. It is replaced only after every such reader moves to `mymodel_reflections_read` and residual caller count is exact0.

### API

```text
owner routes:
  GET  /emotion/piece/quota
  POST /emotion/piece/preview
  PATCH/DELETE preview resource
  POST /emotion/piece/save
  GET  /emotion/piece/history
  GET/PATCH/DELETE Piece resource

public routes:
  /nexus/pieces resource family

preview source:
  body-free saved source reference
  raw payload resend exact0

save:
  revision + text/content/recipe hashes + visibility + idempotency

backend image render route:
  initial exact0
```

Old `publish/cancel`, reflection/Q&A aliases, old `/piece/*` runtime and Q&A wire fields are not release-compatible contracts.

### RN

```text
entry:
  saved input + terminal Emlis observation

CTA:
  この入力をPieceにする

preview:
  canonical text + visual card + private/public

history:
  owner-only dedicated flow

Nexus:
  new Piece payload/card only

export:
  saved-record RN-first

Q&A preview/card compatibility:
  exact0
```

### Migration

```text
M0 tracked migration baseline
M1 legacy read bridge / caller rebind
M2 new table foundation
M3 RLS / RPC / staging projection
M4 disabled application integration
M5 single user-visible clean cutover
M6 body-free old identity capture
M7 exact destructive cleanup under separate approval
M8 obsolete contract retirement
```

Rollback is new Piece safe-disable, never old Q&A restoration.

## 7. Current actual basis

```text
Cocolon head / tree:
  96df30f6cdda8f4549065a3b2156c5b75d36026e
  00196a604415267b45df335220a0b3ff525b910f

mashos-api head / tree:
  315813c7bd3372462de926ddad74df567254a6b5
  a641510e107d52bb910073f36604c85bd57af150

PCE-0 catalog SHA-256:
  2f51e5e6e4207a186aaacbeb355c07ade3b4f777960f3f46d1dbea9f8f9d810e

current new Piece implementation / migration / runtime:
  exact0
```

Current actual remains old Q&A over `mymodel_reflections`, raw emotion preview request, question/reflection response, Q&A Nexus payload, compat routes and untracked application migration ownership. PCE-6 is design input, not remediation result.

## 8. Read order

1. `Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt`
2. `Cocolon_前提資料/15I_cocolon_piece_workstream_pce6_design_closure_20260808.md`
3. `Cocolon_Piece/manifest.json`
4. revised clean-cutover roadmap
5. PCE-1 through PCE-6 canonical artifacts
6. PCE-0 catalog closure when current DB basis is needed
7. current mashos-api and RN files for the next phase

## 9. Prohibited

- new Pieceを`mymodel_reflections`へQ&A placeholder付きで保存する。
- `public.pieces`をlegacy caller退避前に置換する。
- raw input / Emlis / Analysis bodyをPiece request/recordへ複製する。
- visibilityを`published_at`、quotaをsurviving row countへ戻す。
- saveとquota、deleteとpurgeを別transactionにする。
- private owner historyをpublic feed再利用で作る。
- old Q&A state tablesをnew Pieceへ再利用する。
- old/new user-visible dual run、compatibility adapter、old Q&A rollbackを作る。
- tracked migrationなしでSQLを適用する。
- M7 destructive cleanupを別承認なしに実行する。
- designをDB/API/RN/migration実装済みと扱う。
- PCE-7またはAnalysisへautomatic progressionする。

## 10. Next exact actions

```text
next Piece action:
  PCE7_TEST_MONITORING_ROLLBACK_DESIGN_ONLY

environment:
  CHAT_5_6_PRO_OK

state:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

next cross-workstream action:
  ANALYSIS_PRO_FIRST_CURRENT_ACTUAL_PRODUCT_QUALITY_CLOSURE_ROADMAP_DESIGN_ONLY
```

## 11. Effects

```text
PCE-6 documentation / premise / checkpoint:
  GitHub reflection required

production source / DB / API / RN / migration / deletion:
  exact0

test / runtime / actual device / release:
  exact0

EmlisAI / Analysis technical state:
  exact0

automatic progression:
  false
```
