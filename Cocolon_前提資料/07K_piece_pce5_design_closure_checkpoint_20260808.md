---
doc_id: piece_pce5_design_closure_checkpoint_20260808
title: "Piece PCE-5 visual recipe / export design closure checkpoint"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
checkpoint_type: "PCE5_DESIGN_ONLY_CLOSURE"
baseline_cocolon_head: "b777574b8ca9c5969fba5f78a63ed7b08f272e62"
baseline_cocolon_tree: "0dd930688040534dd57a98099abf3a7d5ef448f3"
design_publication_commit: "dd9b96371976e153820814bc54532aeb87e7d415"
design_publication_tree: "ae99f234e36da7b0da65e53e33b1159f23f62c3f"
pce5_complete: true
pce6_activated: false
analysis_roadmap_activated: false
automatic_progression: false
production_effect: "exact0"
---

# Piece PCE-5 visual recipe / export design closure checkpoint

## 1. Closure result

Mashが承認した次のdesign-only作業を完了した。

```text
PCE5_VISUAL_RECIPE_EXPORT_DESIGN_ONLY
```

```text
PCE-0: COMPLETE
PCE-1: COMPLETE_DESIGN_ONLY
PCE-2: COMPLETE_DESIGN_ONLY
PCE-3: COMPLETE_DESIGN_ONLY
PCE-4: COMPLETE_DESIGN_ONLY
PCE-5: COMPLETE_DESIGN_ONLY

PCE-6:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

Analysis Pro-First roadmap:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

## 2. Fixed contracts

```text
record:
  piece.record.v2

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

PCE-5はlogical designだけを固定する。capture library、renderer、PNG生成、DB、API、RN、migration、runtime、test、actual-device、release authorityは作成していない。

## 3. Record / visual identity

```text
PieceRecord source-of-truth:
  piece_text
  piece_text_hash
  versioned visual_recipe
  visual_recipe_hash
  catalog / renderer / export identities

image binary as record source-of-truth:
  exact0

Cocolon feed:
  piece_text + visual_recipe
  image binary exact0

export image:
  derived artifact
```

renderer ownerはrecord schemaから分離した。RN、backend、hybridのいずれを採ってもPieceRecord migrationを必要としない。

## 4. Initial visual catalog

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

MIME exact1:
  image/png
```

Themeはsolid / gradient / vector-only。remote image、photo、user background、arbitrary font/color/URLはinitial exact0。same catalog/versionはimmutableで、更新はnew versionを作る。

## 5. Plan visual boundary

| capability | Free | Plus | Premium |
|---|---|---|---|
| fidelity / safety / resolution | full | full | full |
| theme | soft_paper fixed | exact2 select | exact2 select |
| ratio | 4:5 | 4:5 | 4:5 / 9:16 |
| body font | system_readable | same | same |
| branding | required_small | required_subtle | required_subtle / off |
| save/share/re-export | yes | yes | yes |

Freeだけを低解像度、低可読性、低再現性にしない。plan差はchoice breadthとbrandingである。

## 6. Export owner decision

```text
logical export owner:
  owner-independent contract

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

current RNにはSVG / gradient / PDF / text share資産があるが、Piece image capture、image file share、media save ownerはない。backend current requirementsにもimage renderer dependencyはない。

RN-firstはserverへの追加body送信、network、render costを避ける第一prototypeであり、production acceptanceではない。PCE-9E code-side evidenceとPCE-11のMash actual-device packetが必要である。

## 7. Reproducibility

```text
Level 0:
  record / text / recipe identity

Level 1:
  semantic render identity

Level 2:
  layout equivalence

Level 3:
  PNG byte identity
  cross-platform release condition exact0
```

releaseはLevel 0〜2を要求する。iOS/Androidのsystem font rasterizationやPNG encoderによりbyte hashが異なることは許容できるが、visible text、block order、template/theme/branding、canvas、contrast、clipping exact0は必須である。

Saved recipe/catalog/layout versionsはrecord lifetime中re-export可能にする。unsupported old versionは明示failureとし、latest appearanceへsilent substitutionしない。

## 8. Long-text / fit

PCE-4 envelope:

```text
short_essay:
  24..420 chars / 1..3 paragraphs / 1..6 sentences

quote:
  12..120 chars / exact1 block / 1..2 sentences

declaration:
  12..180 chars / 1..3 complete lines / 1..4 sentences
```

```text
initial output:
  one image exact1

fit:
  fixed canvas + fixed margin + discrete font scale + font floor

clipping:
  exact0

ellipsis:
  exact0

content deletion:
  exact0

font below floor:
  exact0

silent ratio change:
  exact0

fit failure before save:
  PieceRecord exact0
  quota exact0

post-save overflow:
  release blocker
```

Previewとcapture componentが別でもshared pure layout ownerを使う。actual measurementはgrapheme、Japanese/English mixed、emoji、long tokenを扱う。

## 9. Preview / record / export equality

```text
preview piece_text
  ==
saved PieceRecord.piece_text
  ==
Cocolon card body
  ==
renderer input
  ==
export-visible body
```

Responsive cardとfixed export canvasのpixel identityは不要だが、text、paragraph order、format/template/theme/branding identity、clipping absenceは一致させる。

Export画像へowner chip、metrics、resonance、unread、delete、visibility、quota UIを入れない。

## 10. Privacy / external copy

```text
PNG EXIF / GPS:
  exact0

profile identity:
  exact0

hidden text layer:
  exact0

raw input / supplemental / Emlis / Analysis body:
  exact0

filename / receipt / metrics body:
  exact0
```

Temporary fileはapp cacheへ置きcleanupする。端末保存・外部share済み画像はCocolonのprivate化やdeleteでは回収できない。

## 11. Current actual basis

```text
Cocolon baseline:
  b777574b8ca9c5969fba5f78a63ed7b08f272e62
  tree 0dd930688040534dd57a98099abf3a7d5ef448f3

mashos-api:
  315813c7bd3372462de926ddad74df567254a6b5
  tree a641510e107d52bb910073f36604c85bd57af150
```

Confirmed actual:

```text
React Native:
  0.77.3

visual primitives:
  react-native-svg
  react-native-linear-gradient

existing export/share:
  react-native-html-to-pdf
  React Native Share text/PDF pattern

current themes:
  default / light / dark

bundled fonts:
  Cormorant Garamond
  Space Mono

backend requirements:
  FastAPI / uvicorn / httpx / firebase-admin

Piece image renderer / visual recipe / capture / media-save:
  absent
```

## 12. Verified design artifacts

| path | UTF-8 bytes | SHA-256 | Git blob SHA-1 |
|---|---:|---|---|
| `Cocolon_Piece/pce5_visual_recipe_export/Piece_Visual_Recipe_Contract_20260808.md` | 13957 | `c53e1e2b7dd0cd9f8f9643e5ba78a8f1277281186954be19f539426069448007` | `19e1af6e390a7c1fcaaa00b050f86897f825aa51` |
| `Cocolon_Piece/pce5_visual_recipe_export/Piece_Export_Owner_Comparison_20260808.md` | 13337 | `f700861c84ed2e25d5bdf24452ae78361c79033cc916890902181eca1287dbd5` | `d8cfef13784dab87bfc7f7821381a055b524a957` |
| `Cocolon_Piece/pce5_visual_recipe_export/Piece_Render_Reproducibility_Contract_20260808.md` | 13180 | `47df021c1dec8540c43b11392de494e5e70c280effea2f4e23867075aa7ac5b6` | `7769f2d7ed8e1f59724641fa8a4229a47c90451b` |
| `Cocolon_Piece/pce5_visual_recipe_export/Piece_LongText_Layout_Policy_20260808.md` | 12655 | `217235dd7e610d51bffea9aacc76f968bf7c7557716d043cf4fbdd8e82594194` | `9c7eb2bbb9c739963195abd715e65d6a9083a98b` |
| `Cocolon_Piece/00_read_first.md` | 12322 | `bac253de270b5325b1f56037f06dd8e641a5214d8956f5c06374c5ccc0d8a035` | `049ab38c5d3fb0d8ba7473ef2c44814b3d0e2868` |
| `Cocolon_Piece/manifest.json` | 11061 | `fd2c4399fe2a867160e9b2d58256768b0e6a92ea928c4281fd37078f521a6dd5` | `daf96ae4cd5bf2d98a46e128fb4b05d63d851084` |
| `Cocolon_前提資料/15H_cocolon_piece_workstream_pce5_design_closure_20260808.md` | 13523 | `2db75b9ef9f73f3d81739fb7a1c4fcea10f293d98188783dd70dac500ce79d9d` | `23411ce07bfbab01c9879a3e0a226a75ccdf2473` |

All seven paths were fetched/listed from the design publication commit. Remote size/blob identities match the prepared canonical artifacts.

## 13. Publication scope

```text
baseline:
  b777574b8ca9c5969fba5f78a63ed7b08f272e62

publication commit:
  dd9b96371976e153820814bc54532aeb87e7d415

publication tree:
  ae99f234e36da7b0da65e53e33b1159f23f62c3f

publication commits:
  exact1

publication changed paths:
  exact7

new PCE-5 artifacts:
  exact4

entry / manifest / premise:
  exact3

scope outside Piece / Piece premise:
  exact0
```

Publication was a non-force fast-forward from the fresh baseline.

## 14. Manifest lineage

`Cocolon_Piece/manifest.json` advances from v8 to compact v9. PCE-0 through PCE-4 detailed identities remain in immutable predecessor blob `01067325520c37d2d2738b7c755ec78394bcaad7` and canonical phase artifacts. v9 carries current PCE-5 contracts、artifacts、actual basis、state、invalid-candidate record、next action、and technical effects.

This is compaction, not deletion or reclassification of prior PCE results.

## 15. Prepublication transport incident

```text
invalid candidate blob:
  090184ff83c0c7abd5976be5495e836bcefefdd1

canonical visual recipe blob:
  19e1af6e390a7c1fcaaa00b050f86897f825aa51

reason:
  manual base64 transport candidate did not match prepared UTF-8 bytes

tree inclusion:
  exact0

ref effect:
  exact0

reuse:
  prohibited
```

Mismatch was detected before any tree/ref update. The design publication uses the canonical UTF-8 blob only.

## 16. Completed / not implemented

Completed:

- visual recipe schema and canonical hash。
- immutable visual catalog / version retention。
- initial templates exact3、themes exact2、ratios exact2、font style exact1、PNG exact1。
- plan choice / branding boundary without quality degradation。
- renderer-owner-independent interface。
- RN-first staged prototype decision and backend escalation boundary。
- reproducibility levels / old-version support。
- body-free receipt / filename / monitoring boundary。
- long-text fit、font floor、no clipping/ellipsis/content deletion。
- actual-device acceptance matrix。
- negative contracts / STOP conditions。

Not implemented:

```text
production source / dependency:
  exact0

visual catalog runtime / renderer / PNG:
  exact0

DB / API / RN / migration:
  exact0

test / runtime / actual-device:
  exact0

old Q&A removal / release:
  exact0
```

## 17. Facts / inference / Karen's opinion

### 確認済み事実

PCE-5 roadmap requirements、PCE-4 canonical text/formats、current RN/backend dependency state、publication scope、remote artifact identitiesを確認した。

### 推測・未確認

RN capture package compatibility、iOS/Android line break/emoji/memory/permission behavior、PNG size、two-theme aesthetic acceptance、backend escalation necessityは未確認であり、実装・PASSを主張しない。

### 華恋の意見

RN-firstは、private Pieceを追加server render pathへ送らず、networkとserver costを増やさない第一prototypeとして妥当である。ただしsystem font/device差があるため、actual-device gateを外してproduction ownerへ昇格させてはいけない。

FreeもPremiumも同じPiece textを欠落なく読みやすく出すべきであり、課金差はtheme、ratio、brandingの選択幅へ置くのが妥当である。

## 18. Next exact actions

```text
next Piece action:
  PCE6_API_DB_RN_MIGRATION_DESIGN_ONLY

environment:
  CHAT_5_6_PRO_OK

next cross-workstream queued action:
  ANALYSIS_PRO_FIRST_CURRENT_ACTUAL_PRODUCT_QUALITY_CLOSURE_ROADMAP_DESIGN_ONLY
```

Both require separate Mash approval. Neither is activated.

Mash-side action required for PCE-5 closure:

```text
exact0
```

## 19. Effects

```text
Cocolon documentation / Piece premise:
  reflected

Cocolon production source change:
  exact0

mashos-api production source change:
  exact0

DB / API / RN / migration / data deletion:
  exact0

dependency / renderer / image generation:
  exact0

test / runtime / actual-device:
  exact0

EmlisAI technical state / authority / credit:
  exact0

Analysis runtime state:
  exact0

release effect:
  exact0

automatic progression:
  false
```

## 20. Closure

```text
PCE5_VISUAL_RECIPE_CONTRACT_FIXED
PCE5_VISUAL_CATALOG_FIXED
PCE5_EXPORT_CONTRACT_FIXED
PCE5_RENDER_INTERFACE_FIXED
PCE5_REPRODUCIBILITY_FIXED
PCE5_LONG_TEXT_LAYOUT_FIXED
IMAGE_BINARY_RECORD_SOURCE_EXACT0
INITIAL_TEMPLATE_EXACT3
INITIAL_THEME_EXACT2
INITIAL_RATIO_EXACT2
INITIAL_BODY_FONT_EXACT1
INITIAL_PNG_EXACT1
RN_FIRST_PROTOTYPE_SELECTED
FINAL_RENDERER_OWNER_DEVICE_GATED
SILENT_RENDERER_FALLBACK_EXACT0
CLIPPING_ELLIPSIS_CONTENT_DELETION_EXACT0
PCE5_REMOTE_BLOBS_VERIFIED_EXACT7
PCE5_COMPLETE_DESIGN_ONLY
PCE6_NOT_ACTIVATED
ANALYSIS_ROADMAP_NOT_ACTIVATED
AUTOMATIC_PROGRESSION_FALSE
```
