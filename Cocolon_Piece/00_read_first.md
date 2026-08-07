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
```

Piece成果物をEmlisAI実装履歴へ混在させない。

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
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

## 4. PCE-1 current owners

```text
roadmap:
  Cocolon_Piece/roadmap/Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807_CleanCutover_Revised/
  README.md
  bundle.json
  Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807_CleanCutover_Revised.md.gz.b64

identity decision:
  Cocolon_Piece/pce1_identity_clean_cutover/
  Piece_Identity_CleanCutover_Decision_20260807.md

record contract:
  Piece_New_Record_Contract_Matrix_20260807.md

old Q&A removal map:
  Piece_OldQna_Removal_Map_20260807.md

normative update map:
  Piece_Normative_Definition_Update_Map_20260807.md

premise current state:
  Cocolon_前提資料/15D_cocolon_piece_workstream_pce1_design_closure_20260807.md
```

## 5. fixed PCE-1 decisions

```text
new physical owner direction:
  public.piece_records

read projection after cutover:
  public.pieces

old write owner:
  public.mymodel_reflections
  -> no new Piece writes after cutover

old current Q&A rows:
  source_type = emotion_generated
  -> exact removal candidate after new flow verification

shared data:
  create / generated / unrelated consumers
  -> no automatic deletion

public identity:
  piece:<uuid>

canonical visible body:
  piece_text

rollback:
  safe-disable new Piece
  not old Q&A restoration
```

## 6. first read order

1. `Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt`
2. `Cocolon_前提資料/15D_cocolon_piece_workstream_pce1_design_closure_20260807.md`
3. `Cocolon_Piece/manifest.json`
4. revised roadmap
5. PCE-1 four design artifacts
6. PCE-0 catalog closure when current DB basis is needed
7. next phase-specific material

## 7. historical material

The original additive/compatibility roadmap, PCE-0 inventory, and pre-PCE-1 recommendation remain historical evidence. Their Q&A preservation/coexistence direction is not current.

## 8. next exact action

```text
PCE2_CROSS_CORE_SOURCE_HANDOFF_ABSTRACT_CONTRACT_DESIGN_ONLY
```

PCE-2 must fix saved input identity, original/supplemental roles, Emlis observation stage/result identity, eligibility, and no-body-copy negative contract. It must not start runtime binding to Emlis current owner.

## 9. prohibited

- Q&Aをnew active Piece formatへ戻す。
- old/new user-visible dual runを設計する。
- old Q&A adapter / rendererを作る。
- `mymodel_reflections`へplaceholder question/answerでnew Pieceを保存する。
- `create` / `generated`をold Piece cleanupへ自動包含する。
- PCE-2へautomatic progressionする。
- design-only resultをcode/DB removal済みと扱う。

## 10. effects

```text
PCE-1 documentation / roadmap / checkpoint:
  GitHub reflection required

Cocolon production source: exact0
mashos-api production source: exact0
DB / API / RN / migration / data deletion: exact0
test / runtime: exact0
EmlisAI technical state: exact0
release: exact0
automatic progression: false
```
