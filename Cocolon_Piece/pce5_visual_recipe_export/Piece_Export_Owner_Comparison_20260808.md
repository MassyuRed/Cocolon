---
doc_id: piece_export_owner_comparison_20260808
title: "Piece export owner comparison"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-5 Visual Recipe / Export Design"
document_status: "PCE5_COMPLETE_DESIGN_ONLY"
comparison_id: "piece.export_owner_comparison.v1"
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

# Piece export owner comparison

## 1. 結論

```text
logical export contract:
  piece.export_contract.v1

renderer interface:
  piece.render_interface.v1

record schema:
  renderer-owner independent

code-side prototype owner:
  RN_FIRST

release renderer owner:
  DEVICE_GATED_PENDING_PCE9E_PCE11

silent renderer fallback:
  exact0

backend / hybrid:
  escalation candidate only
```

PCE-5はRN rendererをproduction実装済み・actual-device acceptedとは扱わない。RN-firstを最初のbounded prototype ownerに選び、PCE-9Eでcode-side evidence、PCE-11でiOS / Android actual-device evidenceを取得する。

record contractはRN、backend、hybridのどれを採っても作り直さない。

## 2. current actual

### Cocolon RN

`package.json` current:

```text
react-native:
  0.77.3

available visual primitives:
  react-native-svg
  react-native-linear-gradient

existing file export:
  react-native-html-to-pdf

existing share:
  React Native Share text/PDF patterns
```

current dependencyで確認できないもの:

```text
react-native-view-shot / captureRef
image file share library
media library save adapter
general file-system adapter
Piece renderer
Piece image export owner
```

### backend

`mashos-api/requirements.txt` current:

```text
fastapi
uvicorn[standard]
httpx
firebase-admin
```

Pillow、Cairo、SVG renderer、browser renderer等のimage pipelineはcurrent requirementsにない。

### conclusion from actual

RNもbackendも、current Piece画像exportを実装済みではない。既存依存の多さだけでownerを決めず、privacy、offline、reproducibility、device variance、costを比較する。

## 3. common owner-independent interface

rendererは次のinputだけを受ける。

```json
{
  "render_interface_version": "piece.render_interface.v1",
  "piece_id": "piece:<uuid>",
  "piece_contract_version": "piece.record.v2",
  "format_type": "short_essay",
  "piece_text": "<canonical text>",
  "piece_text_hash": "<sha256>",
  "content_payload_version": "piece.content_payload.v1",
  "visual_recipe": {},
  "visual_recipe_hash": "<sha256>",
  "export_contract_version": "piece.export_contract.v1",
  "output_profile": "png_1080x1350_srgb_v1"
}
```

rendererはraw input、Emlis body、Analysis body、profile data、visibility relation、quota stateを受け取らない。

renderer output:

```json
{
  "render_state": "succeeded",
  "renderer_family": "rn_native",
  "renderer_version": "piece.rn_renderer.v1",
  "mime_type": "image/png",
  "width": 1080,
  "height": 1350,
  "asset_uri": "<ephemeral-local-uri>",
  "asset_sha256": "<sha256>",
  "warnings": []
}
```

`asset_uri`はrecord正本ではない。backend outputの場合もtemporary signed location等をrecordへ保存しない。

## 4. Option A — RN view capture / native export

### flow

```text
PieceRecord
-> versioned RN PieceCard renderer
-> fixed-size offscreen/export canvas
-> PNG capture
-> temporary local file
-> media save or OS share
-> temporary cleanup
```

### strengths

- raw sourceやPiece bodyを追加でserverへ送らない。
- network不要でre-export可能。
- server image generation cost exact0。
- Cocolon内card componentとlayout semanticsを共有しやすい。
- save/share sheetと同じdeviceで完結する。
- private Pieceをbackend export endpointへ送らずに済む。

### risks

- iOS / Androidのsystem font、line break、emoji rasterization差。
- capture library / save library / permission ownerがcurrent dependencyにない。
- low-memory / long text / offscreen canvasの実機差。
- OS upgradeでpixel-level outputが変わり得る。
- local file lifecycleとshare cancellationの検証が必要。

### required proof

- fixed canvas dimensions。
- preview/export body exact一致。
- actual-device line break acceptance。
- no clipping / ellipsis。
- share and save permissions。
- temporary file cleanup。
- renderer version reporting。
- no hidden text / metadata。
- low-memory fail-closed。

## 5. Option B — backend image renderer

### flow

```text
PieceRecord identity
-> authenticated backend fetch
-> server renderer
-> temporary PNG
-> authenticated download/share handoff
```

### strengths

- one server font/layout stackで見た目を統一しやすい。
- renderer binary/versionを中央管理しやすい。
- deviceごとのcapture差を減らせる。
- output size、PNG metadata、hashを統制しやすい。

### risks

- image renderer dependency、font packaging、runtime、server costが新規。
- private Piece bodyをserver render pathで扱う範囲が増える。
- network failure / latency / temporary URL / cleanup ownerが増える。
- backendが現在のFastAPI軽量requirementsから拡張される。
- offline re-export不可。
- backendとRN previewのlayout差が生じる。
- font license / distribution / container identityを固定する必要がある。

### required proof

- backend renderer library / font / container hash。
- authenticated owner-only private export。
- no persistent image storage。
- timeout / retry / cost guard。
- RN preview and server render semantic parity。
- temporary object deletion。
- no body in logs/metrics。

## 6. Option C — hybrid

hybrid候補:

```text
RN primary
backend explicit fallback for unsupported/failed device
```

### strengths

- RNのoffline/privacy利点とbackendのuniformityを組み合わせられる。
- known unsupported devicesを救済できる可能性がある。

### risks

- renderer exact2を維持するためQA面積が最大。
- same recordで見た目がrenderer familyにより変わる。
- silent fallbackするとユーザーがpreviewしていない画像を共有し得る。
- version retention、cost、privacy、supportが二重になる。
- feature flag / monitoring / rollbackも二系統になる。

### decision

initial releaseではhybridを常時activeにしない。RN acceptance不成立時に、backendへ明示的にownerを切り替えるか、限定fallbackを別design changeとして承認する。

## 7. comparison matrix

| criterion | RN | backend | hybrid |
|---|---|---|---|
| current image owner | absent | absent | absent |
| network |不要 | 必須 | 条件付き |
| server cost | 0 | 増加 | 増加 |
| private body server exposure | current record read範囲内 | render path追加 | 条件付き追加 |
| offline | yes | no | partial |
| pixel uniformity | device差あり | 高め | two-family差 |
| actual-device dependency | high | preview/shareでstill required | highest |
| implementation breadth | medium | high | highest |
| record schema independence | possible | possible | possible |
| initial recommendation | first prototype | fallback candidate | not initial |

## 8. selected staged decision

### PCE-5

```text
logical owner:
  Piece export contract

renderer owner:
  replaceable adapter

prototype:
  RN-first

production acceptance:
  not claimed
```

### PCE-9E

RN-first code-side prototypeをboundedに行う。

required candidate dependenciesはPCE-9Eでactual version / maintenance / license / RN 0.77 compatibilityを確認して選ぶ。PCE-5では特定packageを実装契約へ固定しない。

### PCE-11

Mash actual-device packetで最低限次を確認する。

```text
iOS
Android
4:5
9:16
short_essay / quote / declaration
short / max-envelope
Japanese / English / mixed
emoji
soft_paper / quiet_night
Free / Plus / Premium branding
save
share
permission denied
low-memory behavior
```

### escalation rule

次のいずれかがrelease blockerなら、backendまたはhybridを別decisionとして検討する。

- major line break / clippingがplatform間で解消不能。
- bundled/system fontで日本語再現性が不十分。
- RN captureがsupported deviceで安定しない。
- share/save品質がOS差で許容できない。
- re-exportに必要な旧rendererを保持できない。

## 9. no silent fallback

RN render failure時:

```text
old Q&A fallback:
  exact0

raw text share fallback:
  exact0 unless user explicitly chooses a separately designed text-share feature

latest recipe substitution:
  exact0

backend silent fallback:
  exact0

quota consumption:
  exact0
```

ユーザーへcoarse errorを返し、same record / same recipeでretryできる。別rendererを使う場合は、renderer family/versionとpreview differenceを明示し、新しいacceptance contractを通す。

## 10. export operation matrix

| operation | owner | record mutation | quota |
|---|---|---:|---:|
| preview render | RN preview | 0 | 0 |
| save PieceRecord | PCE-3/PCE-6 | record exact1 | 1 |
| generate local PNG | renderer | 0 | 0 |
| save to device | native media adapter | 0 | 0 |
| open share sheet | native share adapter | 0 | 0 |
| user cancels share | OS/user | 0 | 0 |
| re-export same record | renderer | 0 | 0 |
| delete temp file | local cleanup | 0 | 0 |
| delete PieceRecord | PCE-3 delete owner | terminal | refund 0 |

visibility does not decide export eligibility for owner. owner may export private Piece.

## 11. file and output contract

initial output:

```text
MIME:
  image/png

color:
  sRGB
  opaque canvas

metadata:
  EXIF exact0
  GPS exact0
  user/profile identity exact0
  source text hidden layer exact0
```

filename:

```text
cocolon-piece_<piece-uuid-no-hyphen>_<visual-recipe-hash-first12>_<ratio-token>.png
```

example:

```text
cocolon-piece_123e4567e89b12d3a456426614174000_a1b2c3d4e5f6_4x5.png
```

filenameへPiece body、user name、emotion label、friend code、visibility、source timestampを入れない。

## 12. temporary file and external copy

```text
render temp:
  app cache
  session-bounded
  share/save completion後cleanup
  app start時stale cleanup candidate

saved media:
  external copy
  Cocolon delete/private化で回収不能

OS share target:
  external copy
  recipient/app behaviorはCocolon control外
```

save/share前にPCE-3 external-copy warningを表示する。share sheet cancelはfailure metricに含めず`cancelled`として扱う。

## 13. error / retry contract

coarse errors:

```text
piece_not_found
piece_deleted
owner_required
text_hash_mismatch
recipe_hash_mismatch
recipe_invalid
catalog_version_unavailable
renderer_version_unavailable
font_or_glyph_unavailable
layout_overflow
capture_failed
temporary_file_failed
save_permission_denied
share_unavailable
low_memory
```

public responseへexception trace、file path、Piece body、detector detailを出さない。

retry:

- same Piece ID / text hash / recipe hashへbind。
- record・visibility・quotaを変更しない。
- renderer versionを無断変更しない。
- duplicated saved imageはOS/file ownerの扱いであり、Piece quotaではない。
- response loss後もrecordを再生成しない。

## 14. monitoring boundary

body-free events候補:

```text
piece_export_requested
piece_export_render_succeeded
piece_export_render_failed
piece_export_save_succeeded
piece_export_save_denied
piece_share_opened
piece_share_cancelled
piece_reexport_succeeded
piece_export_temp_cleanup_failed
```

allowed dimensions:

```text
plan
format_type
theme_id
aspect_ratio
renderer_family
renderer_version
coarse failure code
duration bucket
```

Piece text、raw input、asset URI、local path、recipient、share app、profile IDをmetricへ入れない。

## 15. STOP conditions

- RN-firstがrecord schemaへRN-only fieldを要求する。
- backendへ切り替えるとPieceRecord migrationが必要になる。
- renderer failure時にsilent cross-renderer fallbackが必要になる。
- image保存にbody/profileをfilenameへ入れる必要がある。
- private exportを成立させるためaccessをpublicへ変える必要がある。
- share cancelをrecord failureやquota refundへ変える必要がある。
- current dependencyにないことを理由にPCE-5 design completionをruntime completionへ読み替える。
- actual-device evidenceなしにRN production acceptanceを主張する。

## 16. completion

```text
PIECE_EXPORT_CONTRACT_V1_FIXED
PIECE_RENDER_INTERFACE_V1_FIXED
RECORD_RENDERER_OWNER_INDEPENDENT
RN_FIRST_PROTOTYPE_SELECTED
FINAL_RENDERER_OWNER_DEVICE_GATED
BACKEND_ESCALATION_CANDIDATE
HYBRID_INITIAL_ACTIVE_EXACT0
SILENT_RENDERER_FALLBACK_EXACT0
INITIAL_PNG_EXPORT_FIXED
BODY_FREE_FILENAME_FIXED
TEMPORARY_FILE_CLEANUP_REQUIRED
PRIVATE_OWNER_EXPORT_ALLOWED
EXPORT_REEXPORT_QUOTA_EXACT0
ACTUAL_DEVICE_ACCEPTANCE_REQUIRED
PRODUCTION_EFFECT_EXACT0
PCE5_COMPLETE_DESIGN_ONLY
```
