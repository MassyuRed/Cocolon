---
doc_id: piece_render_reproducibility_contract_20260808
title: "Piece render reproducibility contract"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-5 Visual Recipe / Export Design"
document_status: "PCE5_COMPLETE_DESIGN_ONLY"
contract_id: "piece.render_reproducibility.v1"
export_contract_id: "piece.export_contract.v1"
render_interface_id: "piece.render_interface.v1"
visual_recipe_contract_id: "piece.visual_recipe.v1"
source_cocolon_head: "b777574b8ca9c5969fba5f78a63ed7b08f272e62"
source_cocolon_tree: "0dd930688040534dd57a98099abf3a7d5ef448f3"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
automatic_progression: false
production_effect: "exact0"
---

# Piece render reproducibility contract

## 1. 結論

```text
render reproducibility:
  piece.render_reproducibility.v1

text identity:
  byte/semantic invariant

visual recipe identity:
  canonical hash invariant

catalog:
  immutable versioned

renderer:
  family + version explicit

output asset:
  derived artifact
  asset hash receipt
  record source-of-truth exact0
```

reproducibilityは「全deviceでPNG bytesが必ず同一」という意味ではない。Pieceのcanonical text、block順、visual recipe、catalog、canvas、branding、安全境界が同一であり、許容されたrenderer差の範囲内で意味的に同じ画像を再構築できることを意味する。

## 2. identity stack

| layer | identity |
|---|---|
| Piece record | `piece_id`, `piece.record.v2` |
| content | `format_type`, `piece_text_hash`, content payload identity |
| visual | `visual_recipe_hash`, visual catalog version |
| layout | `piece.long_text_layout.v1`, fit result |
| renderer | family + renderer version |
| export | `piece.export_contract.v1`, output profile |
| binary | `asset_sha256`, MIME, width, height |

一つのhashを別layerの代用品にしない。

## 3. absolute text invariant

```text
preview Piece text
  ==
saved PieceRecord.piece_text
  ==
Cocolon card visible body
  ==
renderer input piece_text
  ==
export-visible body
```

許可しない:

```text
export専用要約
ratio別本文
theme別本文
brandingによる本文追記
renderer fallback本文
line-fitのための単語削除
ellipsis
hidden continuation
```

rendererはline wrapを変えられるが、grapheme/order/punctuation/paragraph orderを変更しない。

## 4. visual invariant

同じsaved recordのre-exportは次を固定する。

```text
format-to-template mapping
template version
theme version
font style version
aspect ratio
branding mode / mark version
layout policy version
canvas size
text hash
recipe hash
```

次はderived and variable:

```text
generated_at
local file URI
OS share destination
PNG compression implementation detail
platform font rasterization
asset_sha256
```

`asset_sha256`が違っても直ちにreproducibility failureとはしない。absolute/semantic acceptanceが一致するかを確認する。

## 5. reproducibility levels

### Level 0 — record identity

Piece ID、text hash、recipe hashが一致する。

### Level 1 — semantic render identity

- visible text exact。
- block order exact。
- template/theme/ratio/branding exact。
- clipping / ellipsis exact0。
- hidden body exact0。
- contrast requirement PASS。
- output dimensions exact。

### Level 2 — layout equivalence

- paragraph boundaries exact。
- alignment class exact。
- padding/safe-area tolerance内。
- line count / line breakはplatform tolerance内。
- font floor以上。
- decorative vectorsがcontentを覆わない。

### Level 3 — byte identity

same renderer binary、font files、OS graphics stack、compression設定が完全一致する場合だけ期待できる。initial RN cross-platform acceptance条件にしない。

release requires Level 0〜2. Level 3はdiagnosticであり、iOS/Android間の必須条件ではない。

## 6. immutable catalog rule

```text
same catalog ID + version:
  token values immutable
  template geometry immutable
  font stack immutable
  branding geometry immutable
```

change:

```text
new template version
new theme version
new font style version
new catalog version
```

既存recordをnew versionへsilent rewriteしない。

catalog artifactは少なくとも次を持つ。

```text
catalog version
canonical JSON bytes
catalog SHA-256
template entries
theme token entries
font stack entries
branding entries
supported layout policy
supported renderer families
created_at
supersedes / does_not_replace
```

PCE-9E実装時にexact catalog bytesをGitHubへfreezeし、runtimeのallowlistと一致させる。

## 7. renderer version rule

renderer versionは次を識別する。

```text
renderer family
layout engine implementation
text measurement implementation
capture implementation
PNG encoder profile
catalog compatibility range
```

example:

```text
piece.rn_renderer.v1
piece.backend_renderer.v1
```

same symbolic versionでimplementation behaviorを変更しない。bug fixでvisual outputが変わる場合はversionを上げる。

## 8. old version support

saved PieceRecordが存在する限り、そのrecordが参照するrecipe/catalog/layout versionを再export可能にする。

allowed strategies:

1. compatibility renderer codeを保持。
2. immutable catalogとlayout adapterを保持。
3. backend rendererへ明示migrationするが、old recipe semanticsをexactに投影し、別renderer versionとして記録。
4. support不能ならcoarse `renderer_version_unavailable`でfailし、latest appearanceへsilent substitutionしない。

「古い見た目が気に入らない」「templateを改善した」という理由でexisting recordを変えない。

## 9. Cocolon card vs export image

Cocolon内cardはresponsive UI、exportはfixed canvasであるためpixel-identicalを要求しない。

required equivalence:

```text
same piece_text
same format semantics
same template family
same theme identity
same branding mode
same block order
same absence of clipping
```

allowed UI difference:

```text
screen width responsive wrap
card shadow/elevation
interactive buttons
owner/metrics area outside export canvas
screen accessibility focus
```

export画像へowner chip、resonance count、delete menu、unread badge、visibility toggle、quota表示を入れない。これらはPiece artifactではなくCocolon UI stateである。

## 10. preview acceptance binding

save前previewは次を返す。

```text
piece_text_hash
visual_recipe_hash
output profile preview
layout_fit_status
renderer candidate family/version
```

save requestはpreview identityへbindする。

save後、exportはsaved text/recipe identitiesを再取得し、client cacheのbodyだけで生成しない。offline re-exportを許す場合も、verified cached record bundleが必要である。exact cache envelopeはPCE-6で決める。

## 11. export receipt

body-free receipt schema:

```json
{
  "receipt_version": "piece.export_receipt.v1",
  "export_id": "<opaque>",
  "piece_id": "piece:<uuid>",
  "piece_text_hash": "<sha256>",
  "visual_recipe_hash": "<sha256>",
  "visual_catalog_version": "piece.visual_catalog.v1",
  "layout_policy_version": "piece.long_text_layout.v1",
  "renderer_family": "rn_native",
  "renderer_version": "piece.rn_renderer.v1",
  "export_contract_version": "piece.export_contract.v1",
  "output_profile": "png_1080x1350_srgb_v1",
  "mime_type": "image/png",
  "width": 1080,
  "height": 1350,
  "asset_sha256": "<sha256>",
  "generated_at": "<RFC3339>",
  "persistent_server_asset": false,
  "body_free": true
}
```

receiptにbody、URI、local path、share target、recipientを保存しない。receipt保持の要否・table ownerはPCE-6で決める。monitoring eventだけで十分ならpersistent receipt exact0も許す。

## 12. render transaction

```text
R0 authenticate owner / read eligibility
R1 fetch canonical PieceRecord
R2 validate lifecycle not deleted
R3 recompute text hash
R4 validate recipe / catalog / entitlement-at-record
R5 resolve renderer family/version
R6 deterministic layout fit
R7 render fixed canvas
R8 verify dimensions / non-empty / no overflow
R9 calculate asset SHA-256
R10 create body-free receipt
R11 hand off to save/share
R12 cleanup temp artifact
```

R0〜R9のいずれかがfailした場合、share/saveへ進まない。partial fileはcleanupする。

## 13. hash mismatch behavior

```text
piece_text_hash mismatch:
  STOP export
  record mutation exact0
  regeneration exact0
  quota exact0

visual_recipe_hash mismatch:
  STOP export
  latest default substitution exact0

catalog hash mismatch:
  renderer unavailable
  old Q&A fallback exact0
```

hash mismatchを「表示だけ直す」処理にしない。PCE-7 release blockerへ接続する。

## 14. font and glyph reproducibility

initial body fontはsystem readable stackのため、platformごとのglyph metrics差があり得る。

contract:

- grapheme clusterを分割しない。
- missing glyphを空白・question markへsilent substituteしない。
- tofu / missing glyph検出時は`font_or_glyph_unavailable`。
- emojiを削除しない。
- emoji color / shape差はactual-device acceptanceで扱う。
- body font floorとfitはplatformごとに検証する。
- new font fileが必須と判明した場合、PCE-5 scope内で勝手に追加せずSTOPして別decisionにする。

branding font failureがbody renderを失敗させない。brandingはallowlisted fallback markを持てるが、bodyは変えない。

## 15. Unicode / newline contract

- UTF-8 valid only。
- NFC normalizationはPCE-4 canonical text ownerで完了済みであることを前提にし、rendererで再normalizationしない。
- CR/LF差をrendererで本文変更へしない。
- paragraph boundaryは`content_payload.body_blocks`をownerにする。
- zero-width / bidi controlsはPCE-4 safety ownerの結果を使い、renderer独自にhidden contentを足さない。
- mixed Japanese/English wrapをgrapheme-safeにする。
- URLはPCE-4 safetyで除去/抽象化済みであり、rendererをURL sanitizerにしない。

## 16. platform tolerance

PCE-11で数値をfinalizeするcandidate tolerance:

```text
canvas width / height:
  exact

content safe-area:
  ±8 px

outer padding:
  ±8 px

baseline / line height:
  ±6 px per line cumulative upper-bound review

text clipping:
  0 px allowed

missing glyph:
  exact0

paragraph loss:
  exact0

branding overlap:
  exact0
```

tolerance内でもmeaning/readabilityが壊れる場合はFAIL。数値だけでmajor visual collapseをPASSにしない。

## 17. re-export states

| record state | owner export | result |
|---|---:|---|
| saved + private | yes | stored recipeでexport |
| saved + public | yes | stored recipeでexport |
| visibility changed | yes | recipe unchanged |
| deleted | no | `piece_deleted` |
| recipe version unsupported | no silent fallback | `renderer_version_unavailable` |
| hash mismatch | no | mismatch STOP |
| downgraded plan | yes | saved lawful recipe preserved |
| offline with verified cached bundle | candidate | PCE-6 cache contract |
| offline without verified bundle | no | record unavailable |

## 18. negative contract

| ID | prohibited |
|---|---|
| `PCE5-R001` | export専用本文を再生成 |
| `PCE5-R002` | ratioごとに本文を短縮 |
| `PCE5-R003` | latest templateへsilent substitution |
| `PCE5-R004` | same version catalogの上書き |
| `PCE5-R005` | old version unavailableを別lookで成功扱い |
| `PCE5-R006` | byte hash差だけでsemantic failure断定 |
| `PCE5-R007` | clippingをsuccessful render扱い |
| `PCE5-R008` | Cocolon UI metricsをexport画像へ混入 |
| `PCE5-R009` | asset URI/local pathをpersistent receiptへ保存 |
| `PCE5-R010` | visibility changeでrecipeを更新 |
| `PCE5-R011` | downgradeでsaved brandingを改変 |
| `PCE5-R012` | glyph missingをsilent deletion |
| `PCE5-R013` | renderer exceptionにbodyを出す |
| `PCE5-R014` | deleted recordをcacheからexport |

## 19. STOP conditions

- preview/save/export text equalityをrenderer layerで守れない。
- same catalog/versionをimmutableに保てない。
- old recipe supportのためrecord bodyをmigrationしなければならない。
- device差を吸収するため本文削除が必要になる。
- glyph fallbackがsource textを変える。
- Cocolon cardとexportで別visual recipeが必要になる。
- receiptをbody-fullにしないとdebugできない。
- deleted/private accessをcacheだけで迂回できる。

## 20. completion

```text
PIECE_RENDER_REPRODUCIBILITY_V1_FIXED
IDENTITY_STACK_SEPARATED
TEXT_ABSOLUTE_INVARIANT_FIXED
VISUAL_RECIPE_INVARIANT_FIXED
CATALOG_IMMUTABLE_VERSIONED
RENDERER_FAMILY_VERSION_EXPLICIT
LEVEL0_TO_LEVEL2_RELEASE_REQUIRED
CROSS_PLATFORM_BYTE_IDENTITY_NOT_REQUIRED
SAVED_VERSION_LIFETIME_SUPPORT_REQUIRED
SILENT_LATEST_SUBSTITUTION_EXACT0
BODY_FREE_EXPORT_RECEIPT_FIXED
HASH_MISMATCH_FAIL_CLOSED
DELETED_RECORD_REEXPORT_EXACT0
PRODUCTION_EFFECT_EXACT0
PCE5_COMPLETE_DESIGN_ONLY
```
