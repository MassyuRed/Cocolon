---
doc_id: cocolon_piece_workstream_pce5_design_closure_20260808
title: "Cocolon Piece Workstream — PCE-5 design closure"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-5 Visual Recipe / Export Design"
phase_completion: true
pce6_activated: false
analysis_roadmap_activated: false
automatic_progression: false
production_effect: "exact0"
---

# Cocolon Piece Workstream — PCE-5 design closure

## 1. current state

```text
PCE-0:
  COMPLETE

PCE-1:
  COMPLETE_DESIGN_ONLY

PCE-2:
  COMPLETE_DESIGN_ONLY

PCE-3:
  COMPLETE_DESIGN_ONLY

PCE-4:
  COMPLETE_DESIGN_ONLY

PCE-5:
  COMPLETE_DESIGN_ONLY

PCE-6:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

Analysis Pro-First roadmap:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

This file supersedes the phase-state portion of `15G_cocolon_piece_workstream_pce4_design_closure_20260807.md`. PCE-1 through PCE-4 contracts and historical facts remain valid.

## 2. fixed PCE-5 contracts

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

All contracts are logical design contracts for `piece.record.v2`. They do not install capture libraries, render images, add API routes, change DB/RN, run tests, or create release authority.

## 3. record / image decision

```text
PieceRecord source-of-truth:
  piece_text
  piece_text_hash
  versioned visual_recipe
  visual_recipe_hash
  catalog / renderer / export identities

saved image binary as record source-of-truth:
  exact0

Cocolon feed:
  text + recipe
  image binary exact0

image generation:
  save/share/re-export時にderived PNGを生成
```

Image binary is an external/derived artifact. The record remains renderer-owner independent so RN, backend, or hybrid can implement the same contract without data migration.

## 4. initial visual catalog

### templates

```text
short_essay -> essay_frame v1
quote       -> focus_frame v1
declaration -> stance_frame v1
```

Template user selection is initial exact0. Format owns template mapping.

### themes

```text
soft_paper v1
quiet_night v1

active count:
  exact2
```

Both are solid / gradient / vector-only. Network background、remote texture、photo asset、user-supplied background are exact0.

Token directions are fixed and versioned. `soft_paper` uses a light paper/burgundy family; `quiet_night` uses a dark navy/gold family. Same version tokens are immutable.

### font

```text
system_readable v1

active body font style:
  exact1
```

Japanese/mixed body uses the OS readable sans-serif stack. New font distribution is not an initial dependency. Existing bundled Cormorant Garamond may support branding but is not the Japanese body owner.

### ratio / output

```text
4:5:
  PNG 1080x1350 sRGB

9:16:
  PNG 1080x1920 sRGB

initial MIME:
  image/png exact1
```

JPEG、video、multi-page、PDF export are initial exact0.

## 5. plan visual boundary

| capability | Free | Plus | Premium |
|---|---|---|---|
| render fidelity / safety | full | full | full |
| resolution | full | full | full |
| theme | soft_paper fixed | exact2 select | exact2 select |
| ratio | 4:5 | 4:5 | 4:5 / 9:16 |
| body font | system_readable | same | same |
| branding | required_small | required_subtle | required_subtle / off |
| save/share/re-export | yes | yes | yes |

Plan differences do not lower meaning fidelity, safety, resolution, or readability. Premium font choice is not initial because no Japanese versioned font catalog has been proven necessary or accepted.

Saved lawful branding is preserved on re-export even after downgrade; exact entitlement and storage binding remain PCE-6 work.

## 6. visual recipe identity

```text
visual_recipe_hash:
  SHA-256 of canonical allowlisted JSON

preview recipe hash
  ==
saved recipe hash
  ==
export request recipe hash
```

Recipe includes only versioned IDs and plan-valid choices. It excludes raw colors supplied by client, arbitrary fonts, URLs, bodies, asset URIs, credentials, profile data, Emlis/Analysis material, and safety detector details.

Same recipe/catalog version is immutable. Updates create new versions. Existing records are not silently moved to latest.

## 7. export owner decision

```text
logical owner:
  owner-independent Piece export contract

code-side prototype:
  RN_FIRST

release renderer owner:
  DEVICE_GATED_PENDING_PCE9E_PCE11

backend:
  escalation candidate

hybrid initial active:
  exact0

silent renderer fallback:
  exact0
```

Current RN has SVG/gradient primitives and existing PDF/text-share patterns, but no current Piece image capture、image file share、media save owner. Current backend requirements have no image renderer dependency. Neither lane is implementation-complete.

RN-first is selected because it avoids additional server body handling, network, and server render cost. It is not production-accepted until PCE-9E code evidence and Mash's PCE-11 iOS/Android actual-device packet.

If RN cannot meet line-break, clipping, save/share, low-memory, or renderer-retention gates, backend/hybrid requires a separate explicit decision. No runtime silently switches renderer families.

## 8. reproducibility decision

Release requires:

```text
Level 0:
  record/text/recipe identity

Level 1:
  semantic render identity

Level 2:
  layout equivalence

Level 3:
  PNG byte identity
  diagnostic only across platforms
```

iOS and Android PNG bytes may differ because system font rasterization and PNG encoding can differ. This is acceptable only when visible text, paragraph order, template/theme/branding, canvas, contrast, and no-clipping invariants match.

`asset_sha256` identifies one derived output. It is not the Piece identity.

Saved recipe/catalog/layout versions must remain re-exportable for the lifetime of retained records. Unsupported old versions fail explicitly; latest look substitution is exact0.

## 9. long-text policy

PCE-4 envelopes remain:

```text
short_essay:
  24..420 normalized characters
  1..3 paragraphs
  1..6 sentences

quote:
  12..120
  exact1 block
  1..2 sentences

declaration:
  12..180
  1..3 complete lines
  1..4 sentences
```

Initial output is one image. Fit uses fixed margins, discrete versioned font sizes, grapheme-safe measurement, and a font floor.

```text
clipping:
  exact0

ellipsis:
  exact0

paragraph deletion:
  exact0

font below floor:
  exact0

silent ratio change:
  exact0

fit failure:
  PieceRecord exact0
  quota exact0
```

Save is allowed only after the selected text/recipe/output profile passes fit. Post-save overflow under a pinned renderer is a release blocker.

## 10. preview / card / export equality

```text
preview piece_text
  ==
saved PieceRecord.piece_text
  ==
Cocolon card body
  ==
renderer input
  ==
export visible body
```

Cocolon card is responsive and export canvas is fixed, so pixel identity is not required. Text, block order, visual identities, branding mode, and clipping absence are required.

Export images do not include owner chip、metrics、resonance、delete menu、unread badge、visibility toggle、quota UI.

## 11. privacy / external-copy boundary

PNG:

```text
EXIF:
  exact0

GPS:
  exact0

profile identity:
  exact0

hidden text layer:
  exact0

raw input / Emlis / Analysis body:
  exact0
```

Temporary render files live in app cache and require cleanup. Device-saved or externally shared files remain outside Cocolon control and cannot be recovered by private toggle or delete.

Filename is body-free and based on Piece UUID、recipe hash prefix、ratio. User name、Piece body、emotion、friend code、visibility、source timestamp are exact0.

## 12. current actual basis

```text
Cocolon basis head / tree:
  b777574b8ca9c5969fba5f78a63ed7b08f272e62
  0dd930688040534dd57a98099abf3a7d5ef448f3

mashos-api head / tree:
  315813c7bd3372462de926ddad74df567254a6b5
  a641510e107d52bb910073f36604c85bd57af150
```

Confirmed assets:

```text
Cocolon package:
  react-native 0.77.3
  react-native-svg
  react-native-linear-gradient
  react-native-html-to-pdf

existing share:
  React Native Share text/PDF pattern

current app themes:
  default / light / dark

bundled fonts:
  CormorantGaramond Bold/Regular/Light
  SpaceMono Regular

backend requirements:
  FastAPI / uvicorn / httpx / firebase-admin
  image renderer dependency absent
```

Absent current owners:

```text
Piece visual recipe/catalog
Piece image renderer
view capture dependency
image file share adapter
media save adapter
export receipt
re-export version owner
```

## 13. PCE-5 outputs

```text
Cocolon_Piece/pce5_visual_recipe_export/
  Piece_Visual_Recipe_Contract_20260808.md
  Piece_Export_Owner_Comparison_20260808.md
  Piece_Render_Reproducibility_Contract_20260808.md
  Piece_LongText_Layout_Policy_20260808.md
```

Prepared identities:

| path | UTF-8 bytes | SHA-256 | Git blob SHA-1 |
|---|---:|---|---|
| `Cocolon_Piece/pce5_visual_recipe_export/Piece_Visual_Recipe_Contract_20260808.md` | 13957 | `c53e1e2b7dd0cd9f8f9643e5ba78a8f1277281186954be19f539426069448007` | `19e1af6e390a7c1fcaaa00b050f86897f825aa51` |
| `Cocolon_Piece/pce5_visual_recipe_export/Piece_Export_Owner_Comparison_20260808.md` | 13337 | `f700861c84ed2e25d5bdf24452ae78361c79033cc916890902181eca1287dbd5` | `d8cfef13784dab87bfc7f7821381a055b524a957` |
| `Cocolon_Piece/pce5_visual_recipe_export/Piece_Render_Reproducibility_Contract_20260808.md` | 13180 | `47df021c1dec8540c43b11392de494e5e70c280effea2f4e23867075aa7ac5b6` | `7769f2d7ed8e1f59724641fa8a4229a47c90451b` |
| `Cocolon_Piece/pce5_visual_recipe_export/Piece_LongText_Layout_Policy_20260808.md` | 12655 | `217235dd7e610d51bffea9aacc76f968bf7c7557716d043cf4fbdd8e82594194` | `9c7eb2bbb9c739963195abd715e65d6a9083a98b` |

## 14. completed / not implemented

Completed:

- visual recipe schema / canonical hash。
- immutable template/theme/font/catalog identities。
- initial template exact3、theme exact2、ratio exact2、PNG exact1。
- plan visual-choice and branding boundary。
- renderer-owner-independent interface。
- RN-first staged owner decision。
- backend/hybrid escalation boundary。
- reproducibility levels and old-version support。
- body-free export receipt / filename / metrics boundary。
- long-text fit algorithm、font floor、failure policy。
- actual-device matrix。
- STOP / negative contracts。

Not implemented:

```text
production source:
  exact0

capture / share / media-save dependencies:
  exact0

visual catalog runtime:
  exact0

renderer:
  exact0

DB / API / RN / migration:
  exact0

PNG generation:
  exact0

test / runtime:
  exact0

actual-device:
  exact0

release:
  exact0
```

## 15. facts / inference / Karen's opinion

### 確認済み事実

- PCE-5 roadmap requires owner comparison、versioned recipe、re-export identity、long-text policy、actual-device separation。
- PCE-4 fixes canonical text and exact3 content formats。
- current RN has visual primitives but no Piece image capture/save/share owner。
- current backend has no image renderer dependency。
- existing custom fonts do not provide a Japanese body-font reproducibility contract。
- current GitHub source does not implement Piece visual recipe/export。

### 推測・未確認

- RN capture quality and memory behavior。
- exact package compatibility with RN 0.77.3。
- system Japanese font line-break differences。
- emoji rendering tolerance。
- iOS/Android media permission behavior。
- output PNG file size。
- whether backend escalation will be needed。
- exact aesthetic acceptance of the two themes。

### 華恋の意見

RN-first is the right first prototype because PieceRecord already owns canonical text/recipe and does not need server-generated image as its identity. It keeps private export local and avoids server cost. However RN-first is only honest if device differences remain a hard acceptance gate.

The visual contract should preserve the user's words equally at every plan. Paid value should come from theme、ratio、branding choices—not lower resolution, smaller unreadable text, or weaker reproducibility for Free.

## 16. next exact actions

Next Piece action:

```text
PCE6_API_DB_RN_MIGRATION_DESIGN_ONLY
```

Next cross-workstream queued action:

```text
ANALYSIS_PRO_FIRST_CURRENT_ACTUAL_PRODUCT_QUALITY_CLOSURE_ROADMAP_DESIGN_ONLY
```

Both require separate Mash approval. Neither is activated by PCE-5 closure.

## 17. non-effects

```text
Cocolon production source:
  exact0

mashos-api production source:
  exact0

DB / API / RN / migration / data deletion:
  exact0

test / runtime / actual device:
  exact0

EmlisAI technical state / authority / credit:
  exact0

Analysis runtime state:
  exact0

release:
  exact0

automatic progression:
  false
```

## 18. closure

```text
PCE5_VISUAL_RECIPE_FIXED
PCE5_EXPORT_CONTRACT_FIXED
PCE5_RENDER_INTERFACE_FIXED
PCE5_REPRODUCIBILITY_FIXED
PCE5_LONG_TEXT_LAYOUT_FIXED
INITIAL_TEMPLATE_EXACT3
INITIAL_THEME_EXACT2
INITIAL_RATIO_EXACT2
INITIAL_PNG_EXACT1
RN_FIRST_PROTOTYPE_SELECTED
FINAL_RENDERER_OWNER_DEVICE_GATED
IMAGE_BINARY_RECORD_SOURCE_EXACT0
CLIPPING_ELLIPSIS_CONTENT_DELETION_EXACT0
ACTUAL_DEVICE_MATRIX_FIXED
PCE5_COMPLETE_DESIGN_ONLY
PCE6_NOT_ACTIVATED
ANALYSIS_ROADMAP_NOT_ACTIVATED
AUTOMATIC_PROGRESSION_FALSE
```
