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

## 1. current owner

```text
Piece workstream:
  Cocolon_Piece/

EmlisAI implementation history:
  EmlisAIの実装済み資料/

current Piece premise:
  Cocolon_前提資料/15H_cocolon_piece_workstream_pce5_design_closure_20260808.md
```

Piece成果物をEmlisAI実装履歴へ混在させない。Piece / EmlisAI / Analysisの内部ownerを統合せず、PCE-2で固定したbody-free source handoffだけで接続する。

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

canonical visible body:
  piece_text

image binary:
  derived export artifact
  record source-of-truth exact0

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
  COMPLETE_DESIGN_ONLY

PCE-5 Visual Recipe / Export Design:
  COMPLETE_DESIGN_ONLY

PCE-6 API / DB / RN / Migration Design:
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
```

### PCE-4

```text
Cocolon_Piece/pce4_content_format_safety/
  Piece_Content_Meaning_Contract_20260807.md
  Piece_Format_Owner_Decision_20260807.md
  Piece_Public_Safety_Transformation_Contract_20260807.md
  Piece_User_Selection_Boundary_20260807.md
```

### PCE-5

```text
Cocolon_Piece/pce5_visual_recipe_export/
  Piece_Visual_Recipe_Contract_20260808.md
  Piece_Export_Owner_Comparison_20260808.md
  Piece_Render_Reproducibility_Contract_20260808.md
  Piece_LongText_Layout_Policy_20260808.md

premise:
  Cocolon_前提資料/15H_cocolon_piece_workstream_pce5_design_closure_20260808.md
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

```text
lifecycle_status:
  preview_draft / saved / cancelled / rejected / expired / deleted

visibility_scope:
  private / public

default visibility:
  private

public:
  current viewer-access relationでallowed viewerのみ
  world-readable exact0

private:
  owner-only
  owner history / export / re-export allowed
  Nexus / unread / resonance / friend notification exact0

quota:
  first successful PieceRecord save exact1
  private/public equal
  visibility change / re-export exact0
  new text / new format exact1
  delete refund exact0

external copy:
  private化 / deleteで回収不能
```

## 8. fixed PCE-4 decisions

```text
content meaning:
  piece.content_meaning.v1

content payload:
  piece.content_payload.v1

format owner:
  piece.format_owner.v1

public safety:
  piece.public_safety_transformation.v1

user selection:
  piece.user_selection_boundary.v1
```

```text
source canonical:
  saved input
  refined only: distinct supplemental answer

derived canonical:
  PieceRecord.piece_text

active formats exact3:
  short_essay
  quote
  declaration

default / Free:
  short_essay

Plus:
  eligible formatsからauto recommendation

Premium:
  eligible formatsから選択可能

Q&A active:
  exact0

fragment initial active:
  exact0

meaning fidelity / safety:
  all plans equal

raw input / Emlis / Analysis body reuse:
  exact0

user free text edit / safety override:
  exact0

preview / saved / export text:
  exact一致
```

## 9. fixed PCE-5 decisions

```text
visual recipe:
  piece.visual_recipe.v1

visual catalog:
  piece.visual_catalog.v1

export:
  piece.export_contract.v1

renderer interface:
  piece.render_interface.v1

render reproducibility:
  piece.render_reproducibility.v1

long-text layout:
  piece.long_text_layout.v1

export receipt:
  piece.export_receipt.v1
```

### visual catalog

```text
templates exact3:
  short_essay -> essay_frame v1
  quote -> focus_frame v1
  declaration -> stance_frame v1

themes exact2:
  soft_paper v1
  quiet_night v1

body font style exact1:
  system_readable v1

ratios exact2:
  4:5 -> PNG 1080x1350 sRGB
  9:16 -> PNG 1080x1920 sRGB

initial MIME:
  image/png exact1

remote/photo background:
  exact0
```

### plan visual boundary

```text
Free:
  soft_paper / 4:5 / required_small branding

Plus:
  exact2 themes / 4:5 / required_subtle branding

Premium:
  exact2 themes / 4:5 or 9:16 / required_subtle or off

all plans:
  same render fidelity
  same resolution
  same readability
  same safety
```

### renderer / export

```text
record schema:
  renderer-owner independent

code-side prototype:
  RN_FIRST

release renderer owner:
  PCE-9E + PCE-11 actual-device gate pending

backend:
  escalation candidate

hybrid initial active:
  exact0

silent renderer fallback:
  exact0

image binary as PieceRecord source-of-truth:
  exact0
```

### reproducibility / layout

```text
release requires:
  record identity
  semantic render identity
  layout equivalence

cross-platform PNG byte identity:
  diagnostic only

saved recipe/catalog versions:
  lifetime re-export support required

clipping / ellipsis / content deletion:
  exact0

font below floor:
  exact0

fit failure before save:
  PieceRecord exact0
  quota exact0

post-save overflow:
  release blocker
```

## 10. current actual basis

```text
Cocolon current design head:
  b777574b8ca9c5969fba5f78a63ed7b08f272e62
  tree 0dd930688040534dd57a98099abf3a7d5ef448f3

mashos-api current head:
  315813c7bd3372462de926ddad74df567254a6b5
  tree a641510e107d52bb910073f36604c85bd57af150

current RN visual primitives:
  react-native-svg
  react-native-linear-gradient

current file export:
  react-native-html-to-pdf
  React Native Share text/PDF pattern

current custom fonts:
  Cormorant Garamond
  Space Mono

current Piece image owner:
  absent

current backend image renderer dependency:
  absent

PCE-5 runtime / actual-device:
  exact0 / exact0
```

These are design inputs, not PCE-5 implementation results.

## 11. first read order

1. `Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt`
2. `Cocolon_前提資料/15H_cocolon_piece_workstream_pce5_design_closure_20260808.md`
3. `Cocolon_Piece/manifest.json`
4. revised clean-cutover roadmap
5. PCE-1 four design artifacts
6. PCE-2 three design artifacts
7. PCE-3 four design artifacts
8. PCE-4 four design artifacts
9. PCE-5 four design artifacts
10. PCE-0 catalog closure when current DB basis is needed
11. next phase-specific actual files

## 12. historical material

The original additive/compatibility roadmap, pre-clean-cutover handoff, PCE-0 inventory, pre-PCE-1 recommendation, earlier Piece premise checkpoints, and 2026-07-07 Piece design note remain historical evidence.

```text
not current:
  Q&A preservation / active Q&A
  compatibility renderer
  old/new visible coexistence
  Q&A or fragment initial active format
  tier-dependent content/render fidelity or safety
  image binary as feed/record source-of-truth
  arbitrary user-provided backgrounds/fonts/colors
  remote image runtime dependency
  post-save recipe in-place mutation
  silent latest-template substitution
  clipping/ellipsis/content deletion as success
  RN renderer production acceptance without device evidence
```

The design note's text/visual separation, export-safe text, recipe versioning, initial RN-first comparison, and external-copy boundary remain reused where consistent with current clean-cutover contracts.

## 13. next exact actions

Next Piece action:

```text
PCE6_API_DB_RN_MIGRATION_DESIGN_ONLY
```

Next cross-workstream queued action:

```text
ANALYSIS_PRO_FIRST_CURRENT_ACTUAL_PRODUCT_QUALITY_CLOSURE_ROADMAP_DESIGN_ONLY
```

Both require separate Mash approval. PCE-5 closure activates neither.

## 14. prohibited

- image binaryをPieceRecordまたはfeed正本にする。
- renderer familyをrecord schemaへ埋め込む。
- raw input / Emlis / Analysis bodyをrecipeや画像hidden layerへ入れる。
- arbitrary color/font/URL/user backgroundをrecipeへ入れる。
- same catalog/versionを後から変更する。
- saved old recipeをlatestへsilent substitutionする。
- remote photo/textureをinitial runtime必須にする。
- planにより解像度、可読性、意味保持、安全性を下げる。
- Freeの長文を低可読fontへ縮小する。
- template/theme/ratio/branding変更でPiece textを再生成する。
- post-save recipeをin-place mutationする。
- export時にPiece textまたはformatを再生成する。
- silent RN/backend renderer fallbackを行う。
- clipping、ellipsis、paragraph削除、glyph欠落を成功扱いする。
- ratioをfitのために無断変更する。
- owner/metrics/resonance/visibility/quota UIをexport画像へ混入する。
- PNG filename、EXIF、receipt、metricsへbody/profile/private relationを入れる。
- actual-device evidenceなしにRN rendererをrelease acceptedとする。
- PCE-5 designをcapture dependency、renderer、PNG、DB/API/RN実装済みと扱う。
- PCE-6またはAnalysis roadmapへautomatic progressionする。

## 15. effects

```text
PCE-5 documentation / premise / checkpoint:
  GitHub reflection required

Cocolon production source:
  exact0

mashos-api production source:
  exact0

DB / API / RN / migration / data deletion:
  exact0

capture / share / media-save dependencies:
  exact0

renderer / PNG generation:
  exact0

test / runtime / actual device:
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
