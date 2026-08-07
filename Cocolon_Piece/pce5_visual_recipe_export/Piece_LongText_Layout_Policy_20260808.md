---
doc_id: piece_long_text_layout_policy_20260808
title: "Piece long-text layout policy"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-5 Visual Recipe / Export Design"
document_status: "PCE5_COMPLETE_DESIGN_ONLY"
contract_id: "piece.long_text_layout.v1"
visual_recipe_contract_id: "piece.visual_recipe.v1"
format_contract_id: "piece.format_owner.v1"
source_cocolon_head: "b777574b8ca9c5969fba5f78a63ed7b08f272e62"
source_cocolon_tree: "0dd930688040534dd57a98099abf3a7d5ef448f3"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
automatic_progression: false
production_effect: "exact0"
---

# Piece long-text layout policy

## 1. 結論

```text
layout policy:
  piece.long_text_layout.v1

initial output:
  single image exact1

clipping:
  exact0

ellipsis:
  exact0

content deletion:
  exact0

font below floor:
  exact0

fit failure:
  preview/save unavailable
  record/quota effect exact0

post-save export overflow:
  release blocker
```

長文を画像へ押し込むためにPieceの核を削らない。PCE-4 content envelopeとPCE-5 fixed canvasの間を、deterministic measurement、discrete font scale、padding、paragraph spacingで調整し、最小可読サイズでもfitしない場合は成功扱いしない。

## 2. PCE-4 content envelopes

| format | body blocks | sentences | normalized characters |
|---|---:|---:|---:|
| `short_essay` | 1..3 paragraphs | 1..6 | 24..420 |
| `quote` | exact1 | 1..2 | 12..120 |
| `declaration` | 1..3 complete lines | 1..4 | 12..180 |

layout ownerはこの上限を超える本文をsilent truncateしない。PCE-4 generator / policyがenvelope違反をsave前にrejectする。

character countだけでfitを保証しない。mixed language、emoji、wide glyph、line breaks、long unbroken tokenをactual measurementする。

## 3. fixed canvas

| ratio | width | height | orientation |
|---|---:|---:|---|
| `4:5` | 1080 | 1350 | portrait |
| `9:16` | 1080 | 1920 | portrait |

initial exportはsingle-page、opaque PNG。scroll capture、multiple image split、carousel、PDFはinitial exact0。

## 4. safe-area geometry

### 4:5

```text
outer margin:
  96 px minimum

content width:
  888 px maximum

top/bottom content zone:
  template-defined
  branding reserved zone minimum 72 px

decorative overlap with text:
  exact0
```

### 9:16

```text
outer margin:
  108 px minimum

content width:
  864 px maximum

top/bottom content zone:
  template-defined
  branding reserved zone minimum 84 px

decorative overlap with text:
  exact0
```

template versionはgeometryをfreezeする。themeはcolor/decorative tokensを変えられるがcontent geometryを変えない。

## 5. typography scale

initial font style:

```text
system_readable v1
```

logical export pixels:

### `quote`

| ratio | candidate sizes | floor | line-height |
|---|---|---:|---:|
| `4:5` | 72, 64, 56 | 56 | 1.35 |
| `9:16` | 80, 72, 64 | 64 | 1.35 |

### `declaration`

| ratio | candidate sizes | floor | line-height |
|---|---|---:|---:|
| `4:5` | 64, 56, 48 | 48 | 1.42 |
| `9:16` | 72, 64, 56 | 56 | 1.42 |

### `short_essay`

| ratio | candidate sizes | floor | line-height |
|---|---|---:|---:|
| `4:5` | 48, 44, 40, 36 | 36 | 1.55 |
| `9:16` | 52, 48, 44, 40 | 40 | 1.55 |

letter spacing:

```text
Japanese body:
  0..0.02em

English/mixed:
  0..0.01em

negative letter spacing:
  exact0
```

font floor未満へ縮小しない。PCE-9E actual prototypeでsystem font metricsが不適切なら、floorを下げるのではなくtemplate geometryまたはrenderer ownerを見直す。

## 6. deterministic fit algorithm

```text
F0 validate Piece text / format envelope
F1 resolve content_payload.body_blocks
F2 resolve template / ratio / theme / font
F3 reserve fixed outer and branding zones
F4 choose largest candidate font size
F5 measure grapheme-safe wrapped layout
F6 validate block order / paragraph spacing / no clipping
F7 if overflow, choose next discrete size and repeat
F8 if floor also overflows, layout_unavailable
F9 produce layout snapshot identity
F10 preview and save only if fit
```

binary searchやcontinuous arbitrary font sizeを使わず、versioned discrete scaleを使う。これによりrenderer間のdecisionを比較しやすくする。

## 7. fit result

body-free fit result:

```json
{
  "layout_policy_version": "piece.long_text_layout.v1",
  "layout_state": "fit",
  "template_id": "essay_frame",
  "template_version": 1,
  "aspect_ratio": "4:5",
  "selected_font_px": 40,
  "line_height_ratio": 1.55,
  "paragraph_count": 3,
  "line_count": 14,
  "overflow": false,
  "clipped": false,
  "missing_glyph": false
}
```

fit resultはbody-freeである。exact line text、glyph sequence、matched sourceをmeta/metricへ保存しない。

layout snapshot hashをrecordへ保存するか、export receiptだけに持つかはPCE-6で決める。recipe hashの代用品にはしない。

## 8. save-time fit gate

PieceRecord save前に、selected candidateのtext + recipe + target profileでfitを検証する。

```text
fit:
  save eligible

layout_unavailable:
  PieceRecord exact0
  quota exact0
  visibility effect exact0
```

userがPremiumで9:16を選び4:5がfitしない場合でも、ratioをsilent switchしない。eligibleな別ratioをUI候補として提示できるが、ユーザーの明示選択が必要。

Free/Plusの固定4:5がfitしない場合、short_essay textを削らず、PCE-4 generatorへbounded retry/rejection policyを返す。arbitrary rerollはPCE-6で決める。

## 9. paragraph and line-break contract

- `content_payload.body_blocks`の順序が正本。
- paragraph間隔を持つが、paragraphをmergeしない。
- user raw newlineはrendererの正本ではない。
- manual line breakはcontent contractがexplicit line roleとして保存した場合だけ尊重。
- Japanese kinsoku candidate rulesを適用し、句読点を行頭へ置かない。
- grapheme clusterを分割しない。
- surrogate pair、variation selector、ZWJ emoji sequenceを分断しない。
- English long tokenはcharacter-safe break candidateを使うが文字を削らない。
- bidi control / zero-width hidden contentはPCE-4 safety済みを前提にする。

## 10. format-specific layout

### short_essay

- alignment: leading/left for Japanese/English。
- body blocks 1..3。
- paragraph spacing 0.65 line-height。
- first-line indent exact0。
- title zone exact0。
- generic decorative quote mark exact0。
- max visible linesはfixed numberでなくmeasured fitで決める。

### quote

- alignment: center candidate。
- body block exact1。
- quotation marksを自動追加しない。
- sourceにないauthor attribution exact0。
- 1..2 sentences。
- line countが多すぎてfocus性を失う場合はquote eligibility failureであり、font縮小だけで通さない。

### declaration

- alignment: leading or centered by `stance_frame v1` fixed geometry。
- complete lines 1..3。
- imperative styling、all caps、exclamation追加 exact0。
- sourceにないsignature / date exact0。

## 11. branding zone

brandingはtext content zoneと別固定zoneを持つ。

```text
required_small:
  visible but subordinate

required_subtle:
  lower contrast within accessibility floor

off:
  no reserved visible mark
  template geometry remains stable
```

branding OFFで本文領域を拡張しない。同じrecipe以外のtext wrap変化を防ぐため、reserved geometryはmode間で固定する。

## 12. decorative elements

initial theme decoration:

- solid / gradient / vector-only。
- decorative alphaがtext contrastを下げない。
- text bounding boxへ侵入しない。
- animation exact0。
- remote image exact0。
- random seed exact0。
- current time/weather/user profileから変化 exact0。

同じtheme versionはdeterministic token setを使う。

## 13. glyph / emoji policy

```text
supported:
  Japanese
  Latin
  common punctuation
  emoji subject to OS glyph availability

missing glyph:
  layout unavailable
  silent deletion exact0
  image placeholder substitution exact0
```

emoji variationはplatform差を持ち得るためPCE-11で確認する。emojiをmonochromeへ強制するかはinitial exact0。color emojiがcontrast/line boxを壊す場合はindividual candidateをunavailableにする。

## 14. accessibility

export image自体はscreen reader textを持たないため、Cocolon内のPiece detailはcanonical `piece_text`をaccessible textとして別途提供する。

- previewで全文をselect/読み上げ可能。
- imageだけを唯一の閲覧方法にしない。
- colorだけでformat / visibility / safety stateを伝えない。
- font sizeはexport floorを守る。
- user device text scalingは surrounding UIへ適用し、fixed export canvasを無断変更しない。
- share時のaccessibility description候補はPCE-6で設計する。

## 15. preview / export parity

preview componentはexport canvasと同じrecipe/catalog/layout policyを使う。

allowed:

```text
screen preview scale transform
shadow/elevation
interactive controls outside canvas
```

prohibited:

```text
previewだけ別font
previewだけ別line-break algorithm
exportだけ本文再flow
exportだけbranding追加
previewでfit、exportでclipping
```

capture用offscreen componentとvisible preview componentが別実装になる場合、shared pure layout ownerを必須にする。

## 16. post-save overflow

saved recordが同じpinned renderer/versionでoverflowする場合、release blockerである。

禁止:

- renderer update後にfontを小さくしてsilent recovery。
- saved textを短くする。
- template latestへ変える。
- 4:5から9:16へ無断変更。
- multi-pageへ無断変更。

対応:

1. affected renderer versionをdisable。
2. exact old behaviorを再現するcorrection versionを作る。
3. existing recordのrecipeは不変。
4. deterministic regression testを追加。
5. re-export availabilityを復旧する。
6. PCE-U1/U2のscopeへ含める。

## 17. actual-device matrix

PCE-11 minimum:

| axis | values |
|---|---|
| platform | iOS / Android |
| ratio | 4:5 / 9:16 |
| format | short_essay / quote / declaration |
| length | min / typical / max envelope |
| language | Japanese / English / mixed |
| glyph | punctuation / emoji / long Latin token |
| theme | soft_paper / quiet_night |
| branding | required_small / required_subtle / off |
| condition | normal / low memory / permission denied |

Mashはvisual collapse、読みやすさ、余白、ブランドの強さをactual deviceで確認する。Chatでactual device PASSを代替しない。

## 18. negative contract

| ID | prohibited |
|---|---|
| `PCE5-L001` | ellipsisで成功 |
| `PCE5-L002` | clippingで成功 |
| `PCE5-L003` | font floor未満へ縮小 |
| `PCE5-L004` | content paragraph削除 |
| `PCE5-L005` | ratioをsilent change |
| `PCE5-L006` | branding OFFで本文geometry変更 |
| `PCE5-L007` | random decoration |
| `PCE5-L008` | remote background必須 |
| `PCE5-L009` | user profileによるlayout change |
| `PCE5-L010` | glyph missingを空白へする |
| `PCE5-L011` | preview/export別layout owner |
| `PCE5-L012` | max character countだけでfit PASS |
| `PCE5-L013` | scroll capture / partial image |
| `PCE5-L014` | multi-page silent fallback |
| `PCE5-L015` | exported imageだけでPiece閲覧を完結 |
| `PCE5-L016` | actual-device未確認をPASSへする |

## 19. STOP conditions

- PCE-4 max envelopeをfont floor以上で一枚へfitできない。
- user-visible textを削らないと4:5が成立しない。
- Japanese system font差がrelease toleranceを超え、RN-firstで解消できない。
- new font file配布なしではsupported glyphを表示できない。
- visible previewとcapture componentのlayout ownerを共有できない。
- branding entitlement差が本文line wrapを変える。
- theme exact2の一方がcontrast requirementを満たせない。
- actual-device matrixをMashが確認できないままrelease acceptanceが必要になる。

## 20. completion

```text
PIECE_LONG_TEXT_LAYOUT_V1_FIXED
SINGLE_IMAGE_INITIAL_EXACT1
CLIPPING_EXACT0
ELLIPSIS_EXACT0
CONTENT_DELETION_EXACT0
FONT_FLOOR_FIXED
DISCRETE_FIT_SCALE_FIXED
SAVE_TIME_FIT_GATE_REQUIRED
INITIAL_CANVAS_EXACT2
INITIAL_FORMAT_ENVELOPES_BOUND
PREVIEW_EXPORT_SHARED_LAYOUT_REQUIRED
MISSING_GLYPH_FAIL_CLOSED
POSTSAVE_OVERFLOW_RELEASE_BLOCKER
ACTUAL_DEVICE_MATRIX_FIXED
PRODUCTION_EFFECT_EXACT0
PCE5_COMPLETE_DESIGN_ONLY
```
