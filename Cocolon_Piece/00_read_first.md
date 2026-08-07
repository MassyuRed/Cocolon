---
doc_id: cocolon_piece_read_first
title: "Cocolon Piece — Read First"
revision_date: "2026-08-07 JST"
decision_owner: "Mash"
workstream: "Cocolon / Piece"
document_status: "CURRENT_PIECE_WORKSTREAM_ENTRY"
automatic_progression: false
---

# Cocolon Piece — Read First

## 1. current owner

```text
Piece workstream:
  Cocolon_Piece/

EmlisAI implementation history:
  EmlisAIの実装済み資料/

current Piece premise:
  Cocolon_前提資料/15F_cocolon_piece_workstream_pce3_design_closure_20260807.md
```

Piece成果物をEmlisAI実装履歴へ混在させない。PCE-2の共通source boundaryはAnalysis roadmapも再利用するが、Piece / EmlisAI / Analysisの内部ownerを統合しない。

## 2. current Piece identity

```text
user-facing name:
  Piece

Piece:
  保存済みのユーザー入力を起点に、
  その考えや価値観を他者へ伝わるcanonical textへ整形し、
  reproducible visual recipeで画像化できるユーザー所有artifact。

record contract:
  piece.record.v2

Q&A:
  pre-release legacy specification
  new active format exact0
  preservation / migration / compatibility renderer exact0
```

## 3. current phase state

```text
PCE-0 Current Contract Pin:
  COMPLETE

PCE-1 Piece Identity / Clean Cutover Decision:
  COMPLETE_DESIGN_ONLY

PCE-2 Cross-Core Source Handoff:
  COMPLETE_DESIGN_ONLY

PCE-3 Record Lifecycle / Visibility / Quota:
  COMPLETE_DESIGN_ONLY

PCE-4 Content / Format / Safety:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

Analysis Pro-First roadmap:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

## 4. current design owners

### roadmap

```text
Cocolon_Piece/roadmap/
Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807_CleanCutover_Revised/
  README.md
  bundle.json
  Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807_CleanCutover_Revised.md.gz.b64
```

### PCE-1

```text
Cocolon_Piece/pce1_identity_clean_cutover/
  Piece_Identity_CleanCutover_Decision_20260807.md
  Piece_New_Record_Contract_Matrix_20260807.md
  Piece_OldQna_Removal_Map_20260807.md
  Piece_Normative_Definition_Update_Map_20260807.md
```

### PCE-2

```text
Cocolon_Piece/pce2_cross_core_source_handoff/
  Piece_CrossCore_Source_Handoff_Contract_20260807.md
  Piece_Source_Role_Matrix_20260807.md
  Piece_Forbidden_Mixing_Negative_Contract_20260807.md
```

### PCE-3

```text
Cocolon_Piece/pce3_record_lifecycle_visibility_quota/
  Piece_Record_Lifecycle_StateMachine_20260807.md
  Piece_Visibility_Access_Contract_20260807.md
  Piece_Quota_Consumption_Contract_20260807.md
  Piece_Delete_ExternalShare_Boundary_20260807.md

premise:
  Cocolon_前提資料/15F_cocolon_piece_workstream_pce3_design_closure_20260807.md
```

## 5. fixed PCE-1 decisions

```text
record:
  piece.record.v2

public identity:
  piece:<uuid>

new physical owner direction:
  public.piece_records

read projection after cutover:
  public.pieces

old current Q&A rows:
  mymodel_reflections.source_type = emotion_generated
  -> exact removal candidate after new flow verification

shared data:
  create / generated / unrelated consumers
  -> no automatic deletion

rollback:
  safe-disable new Piece
  not old Q&A restoration
```

## 6. fixed PCE-2 decisions

```text
cross-core handoff:
  cocolon.cross_core.source_handoff.v1

Piece source lineage:
  piece.source_lineage.v1

source root:
  saved input identity exact1

normal:
  original exact1

pre-question:
  original exact1
  question decision control exact1
  supplemental exact0

refined:
  original exact1
  supplemental exact1
  question decision control exact1

Emlis visible body as Piece source:
  exact0

Analysis inference as Piece source:
  exact0

Piece / Analysis mutual completion dependency:
  exact0

runtime binding:
  exact0 in PCE-2
  PCE-9C owner
```

## 7. fixed PCE-3 decisions

```text
record lifecycle:
  piece.record_lifecycle.v1

visibility / access:
  piece.visibility_access.v1

quota:
  piece.quota_consumption.v1

delete / external share:
  piece.delete_external_share_boundary.v1
```

### lifecycle

```text
lifecycle_status:
  preview_draft
  saved
  cancelled
  rejected
  expired
  deleted

visibility_scope:
  private
  public

invariant:
  lifecycle_status != visibility_scope

valid saved states:
  saved + private
  saved + public
```

default visibility is private. Public requires explicit owner selection. Visibility change does not create a new record, regenerate Piece text, or consume quota.

### access

```text
private:
  owner only
  owner history included
  owner export / re-export allowed
  Nexus / public profile / unread / resonance / friend notification exact0

public:
  current Cocolon viewer-access policyでallowed viewerだけ
  world-readable exact0

public -> private:
  source-of-truth deny first
  feed/cache invalidation follows
```

Piece-specific friend notification is exact0 for initial release. Source input notification is a separate owner and is not replayed by Piece save/toggle.

### quota

```text
Free:
  5 per JST calendar month

Plus:
  30 per JST calendar month

Premium:
  unlimited

consume:
  first successful PieceRecord save exact1

preview / visibility change / re-export / failed export:
  exact0

delete refund:
  exact0

count owner:
  immutable body-free consumption identity
  not current row existence
```

Old Q&A rows are not backfilled into the new Piece quota ledger.

### delete / external share

```text
delete:
  owner-only
  terminal
  normal read exact0
  canonical body and related state purge required
  quota event retained
  restore exact0

external copy:
  public->private / deleteで回収不能
  export does not change visibility
  external share does not consume quota
  warning required
```

## 8. current actual basis

```text
Cocolon design basis:
  50749566a11bade518add57d07cedbee4f5ab379
  tree 75084995241bea25fb787b79cd691caab4f22dba

mashos-api basis:
  315813c7bd3372462de926ddad74df567254a6b5
  tree a641510e107d52bb910073f36604c85bd57af150

current quota:
  published_at row count
  Free 5 / Plus 30 / Premium unlimited
  JST calendar month

current visibility:
  user-selectable public/private exact0

current access:
  application service owner
  mymodel_reflections RLS enabled / policy exact0

current delete:
  physical Piece row delete
  related state cleanup in separate calls
  transaction atomicity unconfirmed
```

These are design inputs, not PCE-3 implementation results.

## 9. first read order

1. `Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt`
2. `Cocolon_前提資料/15F_cocolon_piece_workstream_pce3_design_closure_20260807.md`
3. `Cocolon_Piece/manifest.json`
4. revised clean-cutover roadmap
5. PCE-1 four design artifacts
6. PCE-2 three design artifacts
7. PCE-3 four design artifacts
8. PCE-0 catalog closure when current DB basis is needed
9. next workstream / phase-specific material

## 10. historical material

The original additive/compatibility roadmap, pre-clean-cutover handoff, PCE-0 inventory, pre-PCE-1 recommendation, and earlier Piece premise checkpoints remain historical evidence.

```text
not current:
  Q&A preservation
  active qna format
  compatibility renderer
  old/new user-visible coexistence
  public state inferred from lifecycle status
  quota inferred from surviving published row count
  delete refund
```

PCE-0 inventory documents that still show the pre-catalog STOP remain historical evidence. `PCE0_Closure_State_20260807.json` owns the later PCE-0 completion.

## 11. next exact actions

Next Piece action:

```text
PCE4_CONTENT_FORMAT_SAFETY_DESIGN_ONLY
```

Next cross-workstream queued action:

```text
ANALYSIS_PRO_FIRST_CURRENT_ACTUAL_PRODUCT_QUALITY_CLOSURE_ROADMAP_DESIGN_ONLY
```

Both require separate Mash approval. PCE-3 closure activates neither.

## 12. prohibited

- Q&Aをnew active Piece formatへ戻す。
- old/new user-visible dual runを設計する。
- old Q&A adapter / rendererを作る。
- `mymodel_reflections`へplaceholder question/answerでnew Pieceを保存する。
- `create` / `generated`をold Piece cleanupへ自動包含する。
- raw input payloadだけでPiece生成成功にする。
- Emlis visible body / internal artifactをPiece本文sourceにする。
- question need decisionをsemantic sourceにする。
- supplemental answerでoriginal inputを上書きする。
- Analysis inference / current route / simulated routeをPiece sourceにする。
- Piece textをAnalysis observed factへ昇格する。
- PieceとAnalysisを相互completion dependencyにする。
- lifecycle statusとvisibility scopeを一fieldへ戻す。
- `published`というstatusだけでpublic accessを許可する。
- private saveをquota無料にする。
- visibility toggle / re-exportでquotaを再消費する。
- deleteでquotaをrefundする。
- public→private / deleteでexternal copyも回収できると表示する。
- PCE-3 designをDB / API / RN / migration / runtime実装済みと扱う。
- PCE-4またはAnalysis roadmapへautomatic progressionする。

## 13. effects

```text
PCE-3 documentation / premise / checkpoint:
  GitHub reflection required

Cocolon production source:
  exact0

mashos-api production source:
  exact0

DB / API / RN / migration / data deletion:
  exact0

test / runtime:
  exact0

EmlisAI technical state:
  exact0

Analysis runtime state:
  exact0

release:
  exact0

automatic progression:
  false
```
