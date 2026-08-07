---
doc_id: piece_visual_recipe_contract_20260808
title: "Piece visual recipe contract"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-5 Visual Recipe / Export Design"
document_status: "PCE5_COMPLETE_DESIGN_ONLY"
contract_id: "piece.visual_recipe.v1"
catalog_contract_id: "piece.visual_catalog.v1"
record_contract_id: "piece.record.v2"
content_contract_id: "piece.content_payload.v1"
layout_contract_id: "piece.long_text_layout.v1"
source_cocolon_head: "b777574b8ca9c5969fba5f78a63ed7b08f272e62"
source_cocolon_tree: "0dd930688040534dd57a98099abf3a7d5ef448f3"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
source_roadmap_sha256: "2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939"
automatic_progression: false
production_effect: "exact0"
---

# Piece visual recipe contract

## 1. 結論

```text
visual recipe:
  piece.visual_recipe.v1

visual catalog:
  piece.visual_catalog.v1

canonical record:
  piece.record.v2

image binary as record source-of-truth:
  exact0

feed payload:
  piece_text + versioned visual_recipe
  image binary exact0

re-export:
  saved recipe identityから再構築

renderer ownership:
  recipe contractから独立
```

Piece画像は、保存済み画像fileをrecord正本にしない。正本は`piece_text`、`piece_text_hash`、versioned `visual_recipe`、`visual_recipe_hash`、renderer/export identityを持つPieceRecordである。

Cocolon内のpreview、owner history、Nexus cardは、同じPiece textとvisual recipeを使う。端末保存・外部共有時だけ固定canvasのPNGを生成する。

## 2. responsibility separation

```text
PCE-4:
  Piece text / format / safety

PCE-5:
  visual recipe / catalog / layout / export interface

PCE-6:
  DB / API / RN exact fields and routes

PCE-9E:
  renderer prototype and code-side evidence

PCE-11:
  iOS / Android actual-device acceptance
```

visual recipeは本文の意味ownerではない。theme、template、font、ratio、brandingを変えても、`piece_text`、content payload、format、source lineage、visibility、quota identityを変更しない。

## 3. canonical schema

```json
{
  "visual_recipe_version": "piece.visual_recipe.v1",
  "visual_catalog_version": "piece.visual_catalog.v1",
  "format_type": "short_essay",
  "template": {
    "template_id": "essay_frame",
    "template_version": 1
  },
  "theme": {
    "theme_id": "soft_paper",
    "theme_version": 1
  },
  "font_style": {
    "font_style_id": "system_readable",
    "font_style_version": 1
  },
  "aspect_ratio": "4:5",
  "branding": {
    "branding_mode": "required_small",
    "branding_mark_id": "cocolon_text_mark",
    "branding_mark_version": 1
  },
  "layout_policy_version": "piece.long_text_layout.v1",
  "language": "ja"
}
```

### required top-level fields

| field | invariant |
|---|---|
| `visual_recipe_version` | exact `piece.visual_recipe.v1` |
| `visual_catalog_version` | exact catalog contract/version |
| `format_type` | PieceRecord formatとexact一致 |
| `template` | allowlisted immutable ID + positive integer version |
| `theme` | allowlisted immutable ID + positive integer version |
| `font_style` | allowlisted immutable ID + positive integer version |
| `aspect_ratio` | initial `4:5` or `9:16` |
| `branding` | plan-valid allowlisted mode and mark |
| `layout_policy_version` | exact `piece.long_text_layout.v1` |
| `language` | Piece content language projection。initial `ja` / `en` / `mixed` |

recipeへraw color、arbitrary font name、URL、user body、image URI、external asset URL、credential、user ID、Emlis/Analysis materialを入れない。

## 4. canonicalization and hash

`visual_recipe_hash`は次で作る。

```text
1. unknown keyをreject
2. keyをUTF-8 code-point ascendingでsort
3. numberはJSON integer
4. stringはtrim済みallowlisted canonical ID
5. arrayはschema順
6. JSON separatorsはcomma/colon、余分な空白exact0
7. final newline exact0
8. SHA-256 lowercase hex
```

```text
visual_recipe_hash:
  sha256(canonical visual recipe JSON bytes)
```

hash不一致、unknown version、catalog未解決、format mismatchはsave/exportをfail-closedにする。clientがhashを申告してもserver/record ownerが再計算する。

## 5. initial immutable catalog

### 5.1 format-to-template mapping

| PCE-4 format | template ID | initial version | role |
|---|---|---:|---|
| `short_essay` | `essay_frame` | 1 | 1〜3段落を余白と順序を保って表示 |
| `quote` | `focus_frame` | 1 | dominant claim exact1を中央寄せで表示 |
| `declaration` | `stance_frame` | 1 | owner stanceを明確な行構造で表示 |

initial releaseではtemplateをユーザー選択にしない。formatがtemplateを決める。template更新時は同じversionを上書きせず、新versionを追加する。

### 5.2 theme set

initial active theme exact2:

```text
soft_paper v1
quiet_night v1
```

theme contractは次のsemantic tokenを必須にする。

```text
canvas_background
surface_background
primary_text
secondary_text
accent
border
branding_text
decorative_vector_tokens
```

初期themeはsolid / gradient / vector-onlyとし、network image、remote texture、user-provided background、photo assetを使わない。同じtheme versionのtokenを後から変更しない。

initial token catalog:

| token | `soft_paper v1` | `quiet_night v1` |
|---|---|---|
| canvas background | `#F6F1E8` | `#0B1120` |
| surface background | `#FFFDF8` | `#111827` |
| primary text | `#111827` | `#F9FAFB` |
| secondary text | `#4B5563` | `#CBD5E1` |
| accent | `#800020` | `#D4AF37` |
| border | `#D7D2C9` | `#334155` |
| branding text | `#800020` | `#D4AF37` |
| vector/gradient end | `#FFFFFF` | `#1E293B` |

PCE-9Eはこのexact token setをcanonical catalog artifactとしてfreezeし、catalog SHA-256へbindする。actual-deviceでrelease blockerが見つかった場合は同じversionを変更せず、PCE-10 correctionとしてnew versionを作る。

`soft_paper`は明るい紙系、`quiet_night`は暗い静かな系統とする。いずれもbody text contrastを4.5:1以上、large text / brandingを3:1以上にする。

### 5.3 font set

initial body font style exact1:

```text
system_readable v1
```

- Japanese / mixed textはOS標準の読みやすいsans-serif stackを使う。
- textを画像化するためだけに新しいfont file配布を必須にしない。
- bundled Cormorant Garamond等をbodyの日本語正本にしない。
- branding markはbody fontから独立できるが、missing fontでbody layoutを変えない。
- unsupported glyphを削除・別文字へ置換しない。

追加font styleはpost-release candidate。font choiceを初期Premium価値の必須条件にしない。

### 5.4 aspect ratio and output profiles

initial active ratio exact2:

| ratio | export profile | canvas |
|---|---|---|
| `4:5` | `png_1080x1350_srgb_v1` | 1080 × 1350 |
| `9:16` | `png_1080x1920_srgb_v1` | 1080 × 1920 |

initial MIME exact1:

```text
image/png
```

JPEG、animated image、multi-page image、videoはinitial exact0。

## 6. plan matrix

| capability | Free | Plus | Premium |
|---|---|---|---|
| render fidelity / safety | full | full | full |
| output pixel size | full | full | full |
| template | format-mapped | format-mapped | format-mapped |
| theme | `soft_paper` fixed | exact2から選択 | exact2から選択 |
| ratio | `4:5` fixed | `4:5` fixed | `4:5` / `9:16` |
| body font | `system_readable` | same | same |
| branding | `required_small` | `required_subtle` | `required_subtle` or `off` |
| save / share / re-export | yes | yes | yes |

Freeの画質や可読性を落とさない。plan差はchoice breadthとbrandingであり、本文の意味、安全性、解像度、欠落防止ではない。

`branding_mode=off`はPremium entitlementがsave時・export時の両方で成立する場合だけ許可する。downgrade後の既存record再exportについては、saved recipeを尊重し、record生成時に合法だったbranding modeを後から強制変更しない。exact entitlement bindingはPCE-6で固定する。

## 7. record binding

PieceRecordは少なくとも次をbindする。

```text
piece_id
piece_contract_version
format_type
piece_text_hash
content_payload identity
visual_recipe
visual_recipe_hash
visual_catalog_version
export_contract_version
created_at
```

`visual_recipe`はsave前preview candidateに存在し、saveされたrecipe/hashとexact一致する。

```text
preview visual_recipe_hash
  ==
saved visual_recipe_hash
  ==
export request visual_recipe_hash
```

visibility toggle、delete receipt、read metrics、resonance、quota eventはvisual recipe ownerではない。

## 8. visual-only mutation

initial contract:

```text
pre-save theme / ratio / branding change:
  candidate recipe/hashを更新
  PieceRecord exact0
  quota exact0

post-save theme / ratio / branding change:
  same-record mutation exact0
  saved recipeを保持
  alternate exportはnew PieceRecordにしない限りexact0
```

initial releaseでは、saved recordのvisual recipeをin-place変更しない。同じrecordのre-exportは保存済みrecipe exact1を使う。

将来visual-only variantを許す場合は、variant identityとquotaを別contractで追加する。PCE-5 v1へ暗黙導入しない。

## 9. branding boundary

Piece画像の主役はユーザーのPiece textであり、brandingは本文より強くしない。

```text
branding mark:
  Cocolon text mark

body attribution:
  Cocolonが整えたPiece
  Emlis / Analysis outputとして表示しない

position:
  template fixed
  user position choice exact0 initial
```

brandingへuser name、friend code、profile image、input date、emotion labelを自動挿入しない。

## 10. privacy and safety

visual recipe / catalog / export receiptへ次を含めない。

```text
raw input
supplemental answer body
Emlis visible comment_text
Emlis internal artifact
Analysis inference
PII
contact data
profile data
private access relation
safety matched text
detector detail
credential
```

private/publicはPCE-3 access ownerであり、同じrecipeを使う。privateだからraw input backgroundやhidden text layerを持つことを許さない。

PNGへEXIF、location、user name、profile ID、source timestamp、hidden text layerを付与しない。

## 11. validation matrix

save/export前に次を検証する。

1. recipe schema exact。
2. format/template mapping exact。
3. catalog version present。
4. all IDs allowlisted。
5. plan entitlement valid。
6. piece text hash bound。
7. recipe hash recomputation match。
8. layout policy known。
9. ratio/output profile known。
10. branding mode valid。
11. remote asset exact0。
12. unknown/extra key exact0。

validation failureはrecipeをsilent defaultへ置換しない。preview前ならsafe default candidateを新規構築できるが、saved record/re-exportではstored recipeを別versionへ読み替えない。

## 12. current actual gap

current Cocolonには次がある。

```text
react-native:
  0.77.3

visual primitives:
  react-native-svg
  react-native-linear-gradient

existing export:
  react-native-html-to-pdf
  React Native Share text/PDF pattern

bundled fonts:
  Cormorant Garamond
  Space Mono

app themes:
  default / light / dark
```

次はcurrent ownerとして確認できない。

```text
Piece visual recipe
Piece template/theme catalog
Piece image renderer
view capture dependency
image file share adapter
media-library save adapter
Piece export receipt
Piece re-export version owner
```

current assetは実装候補であり、PCE-5 completionやruntime availabilityを意味しない。

## 13. negative contract

| ID | prohibited |
|---|---|
| `PCE5-V001` | image binaryをPieceRecord正本にする |
| `PCE5-V002` | feedへ常時画像binaryを保存する |
| `PCE5-V003` | recipeへraw color/font/URLを任意入力する |
| `PCE5-V004` | same version catalogを後から変更する |
| `PCE5-V005` | formatとtemplate mappingをclient任せにする |
| `PCE5-V006` | planによりrender品質・可読性を下げる |
| `PCE5-V007` | private recipeへhidden source bodyを入れる |
| `PCE5-V008` | saved recipeをlatest defaultへsilent migrationする |
| `PCE5-V009` | brandingへprofile dataを自動埋め込む |
| `PCE5-V010` | new font fileがないと本文を表示できない |
| `PCE5-V011` | remote background assetをruntime必須にする |
| `PCE5-V012` | post-save recipeをin-place mutationする |
| `PCE5-V013` | export時にformat / textを再生成する |
| `PCE5-V014` | unknown recipeを成功扱いする |

## 14. STOP conditions

- renderer ownerをrecipe schemaへ埋め込まないとrecordが成立しない。
- initial body表示に新font file配布が不可避になる。
- exact2 themeをremote imageなしで成立させられない。
- same saved recipeから異なるPiece textが出る。
- catalog versionを保持できず、過去Pieceの見た目がsilent changeする。
- long textを削除・ellipsis・不可視縮小しないとfitしない。
- Freeだけ低解像度または低可読性にしないとcostが成立しない。
- visual recipeへraw source / private materialを保存しないとrendererが成立しない。

## 15. completion

```text
PIECE_VISUAL_RECIPE_V1_FIXED
PIECE_VISUAL_CATALOG_V1_FIXED
IMAGE_BINARY_RECORD_SOURCE_EXACT0
TEXT_RECIPE_FEED_FIXED
INITIAL_TEMPLATES_EXACT3
INITIAL_THEMES_EXACT2
INITIAL_ASPECT_RATIOS_EXACT2
INITIAL_BODY_FONT_STYLE_EXACT1
INITIAL_MIME_PNG_EXACT1
OUTPUT_4_5_1080X1350_FIXED
OUTPUT_9_16_1080X1920_FIXED
FREE_PLUS_PREMIUM_RENDER_FIDELITY_EQUAL
VISUAL_RECIPE_HASH_CANONICALIZATION_FIXED
POSTSAVE_RECIPE_MUTATION_EXACT0
REMOTE_ASSET_RUNTIME_DEPENDENCY_EXACT0
PRODUCTION_EFFECT_EXACT0
PCE5_COMPLETE_DESIGN_ONLY
```
