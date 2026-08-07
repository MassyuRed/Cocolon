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

cross-core premise:
  Cocolon_前提資料/15E_cocolon_piece_workstream_pce2_design_closure_20260807.md
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

Analysis Pro-First roadmap:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

PCE-3 Record Lifecycle / Visibility / Quota:
  NOT_ACTIVATED

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

premise:
  Cocolon_前提資料/15E_cocolon_piece_workstream_pce2_design_closure_20260807.md
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

## 7. first read order

1. `Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt`
2. `Cocolon_前提資料/15E_cocolon_piece_workstream_pce2_design_closure_20260807.md`
3. `Cocolon_Piece/manifest.json`
4. revised clean-cutover roadmap
5. PCE-1 four design artifacts
6. PCE-2 three design artifacts
7. PCE-0 catalog closure when current DB basis is needed
8. next workstream / phase-specific material

## 8. historical material

The original additive/compatibility roadmap, pre-clean-cutover handoff, PCE-0 inventory, and pre-PCE-1 recommendation remain historical evidence.

```text
not current:
  Q&A preservation
  active qna format
  compatibility renderer
  old/new user-visible coexistence
```

The pre-PCE-2 handoff remains current only for the cross-workstream sequence that creates the Analysis Pro-First roadmap after PCE-2. Its superseded PCE-1 compatibility recommendation is not current.

## 9. next exact action

```text
ANALYSIS_PRO_FIRST_CURRENT_ACTUAL_PRODUCT_QUALITY_CLOSURE_ROADMAP_DESIGN_ONLY
```

The next queued Piece phase is:

```text
PCE3_RECORD_LIFECYCLE_VISIBILITY_QUOTA_DESIGN_ONLY
```

Both require separate Mash approval. automatic progression is false.

## 10. prohibited

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
- PCE-2 designをruntime adapter / API / DB / RN実装済みと扱う。
- Analysis roadmapまたはPCE-3へautomatic progressionする。

## 11. effects

```text
PCE-2 documentation / premise / checkpoint:
  GitHub reflection required

Cocolon production source: exact0
mashos-api production source: exact0
DB / API / RN / migration / data deletion: exact0
test / runtime: exact0
EmlisAI technical state: exact0
Analysis runtime state: exact0
release: exact0
automatic progression: false
```
