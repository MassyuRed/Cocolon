---
doc_id: piece_rn_flow_design_20260808
title: "Piece RN clean-cutover flow design"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
phase: "PCE-6 API / DB / RN / Migration Design"
document_status: "PCE6_COMPLETE_DESIGN_ONLY"
contract_id: "piece.rn_flow.v1"
source_cocolon_head: "96df30f6cdda8f4549065a3b2156c5b75d36026e"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
automatic_progression: false
production_effect: "exact0"
---

# Piece RN clean-cutover flow design

## 1. Decision

```text
entry timing:
  saved input + terminal Emlis observation

primary CTA:
  この入力をPieceにする

old pre-Emlis Q&A preview:
  retired

preview body:
  canonical Piece text + visual recipe

visibility default:
  private

free text edit:
  exact0

old/new visible dual run:
  exact0
```

The CTA is adjacent to the Emlis observation experience but is owned by Piece. It receives body-free source identity and eligibility only; it never receives or copies the Emlis visible body.

## 2. Confirmed current RN gap

Current RN uses:

```text
screens/InputScreen.js
screens/input/InputPiecePreviewController.js
components/EmotionPiecePreviewModal.js
lib/api/home/emotionPieceApi.js
lib/compat/legacyWireContracts.js
screens/NexusScreen.js
screens/nexus/NexusPieceCard.js
lib/nexusApi.js
```

The current modal displays a Q&A-shaped `question` and `answer`, calls publish/cancel, and names the quota as generation/publish count. `nexusApi.js` normalizes `q_instance_id`, `q_key` and question title. These models are not reused as the new Piece UI contract.

`useInputFeedbackModal.js` owns Emlis observation display state. Piece does not change its observation text, temperature, pass condition or internal model.

## 3. New RN owner structure

Proposed component responsibilities; exact filenames are frozen in PCE-8:

```text
PieceCreateController:
  source-ref / entitlement / preview lifecycle

PiecePreviewModal:
  canonical text, format, visual preview, visibility, save/cancel

PieceVisualCanvas:
  shared responsive/fixed render contract

PieceHistoryScreen:
  owner private/public saved records

PieceHistoryCard:
  owner actions, visibility, export, delete

NexusPieceCard v2:
  public new Piece only

PieceExportController:
  saved-record fetch, RN-first render, save/share, receipt
```

Old `InputPiecePreviewController` and `EmotionPiecePreviewModal` are removed from release reachability rather than wrapped with Q&A compatibility.

## 4. End-to-end screen state

```text
input saved
  -> Emlis terminal response shown
  -> Piece CTA eligible / unavailable / hidden
  -> preview request
  -> preview ready / adjusted / unavailable
  -> visual/text review
  -> optional eligible format/theme/ratio/branding choice by plan
  -> private/public selection
  -> save
  -> saved confirmation
  -> optional export/share
```

Closing the Emlis modal may expose a bounded action area for the same saved input. It must carry source identity, not cached raw input or Emlis body.

## 5. Preview UI

Required information:

```text
canonical Piece text in full
visual card preview
format human-readable label
coarse safety state when adjusted
private/public selection; private default
plan capability and remaining Piece saves
save and cancel actions
external-copy warning before export/share
```

Plan behavior:

| capability | Free | Plus | Premium |
|---|---|---|---|
| format | fixed short_essay | auto eligible format | eligible format choice |
| theme | soft_paper | exact2 choice | exact2 choice |
| ratio | 4:5 | 4:5 | 4:5 / 9:16 |
| branding | required_small | required_subtle | subtle / off |
| text/safety/readability | full | full | full |

Ineligible format or visual choices are not displayed as forceable controls. Internal detector/focus/source details are not shown.

No text area, replacement paste, title editor, raw-source toggle, safety override or “publish anyway” control is present.

## 6. Preview mutation and save

Every format-changing preview mutation replaces:

```text
preview revision
piece_text
piece_text_hash
content payload/hash
visual recipe/hash
```

Visual-only mutation preserves Piece text/hash. The UI announces that the preview changed and never saves a hidden prior candidate.

Save sends preview ID/revision, three hashes, visibility and the same idempotency key. It does not send Piece body, recipe replacement, owner ID, tier or limit.

```text
save success:
  same preview body/hash
  Piece ID piece:<uuid>
  quota exact1

response loss retry:
  same key
  same Piece
  additional quota exact0
```

## 7. Owner history

Owner history is a dedicated owner-only API and screen. It is not the public Nexus feed with a visibility filter removed.

Each card shows:

```text
canonical visual Piece card
private/public state
date
format/theme/ratio
export/share
visibility toggle
delete
```

Private cards are owner-only and never create unread/resonance/friend-notification state.

Visibility mutation:

```text
optimistic input:
  expected row version

success:
  update current state/version
  no regeneration
  no quota

conflict:
  refetch current record
  do not overwrite silently
```

Delete requires an explicit confirmation that Cocolon data is removed while already saved/shared external images cannot be recovered. Same delete retry returns the terminal receipt.

## 8. Nexus new Piece UI

`NexusPieceCard v2` consumes only the new payload:

```text
piece_id / public_id
owner allowed profile projection
format_type
piece_text / hash
visual_recipe / hash
saved_at
metrics
viewer state
```

It never consumes question, q_key, q_instance_id, reflection ID, emotion_generated source type or raw answer.

Public feed rules:

```text
saved + public + current viewer relation only
private/deleted/inaccessible absent
visibility rechecked on detail/read/resonance
old Q&A card release reachability exact0
```

The responsive in-app card and fixed export canvas may differ in pixels but share canonical text, block order, format, template, theme and branding identity.

## 9. Export / share

Initial export is RN-first and saved-record-only.

```text
fetch fresh owner record
verify text/recipe hashes
render with PCE-5 shared layout owner
capture PNG
save to cache
open save/share action
cleanup temporary file
write body-free receipt if enabled
```

No raw input, Emlis/Analysis material, owner chip, metrics, visibility UI, EXIF/GPS or hidden text layer enters the image.

Offline re-export is not promised unless a complete, current, authorized record and all immutable catalog versions are locally available. Silent backend fallback is exact0.

## 10. Error / retry / accessibility

Required user-visible classes:

```text
source unavailable
not eligible
preview expired/stale
quota exhausted
format/visual not eligible
safety unavailable
layout unavailable
conflict
not found
temporary unavailable
export/save/share failure
```

Messages are human-readable and do not expose matched PII, private source, detector labels, internal identities or technical stack details.

Accessibility requirements:

- full text readable before save;
- format/visibility/theme/ratio have labels and selected state;
- private/public is not color-only;
- preview changes are announced;
- long text is scrollable without covering actions;
- disabled choices explain plan or eligibility, not internal detector rules;
- buttons have stable accessible names;
- contrast/font floor follows PCE-5.

## 11. Wire cutover

RN API owner is replaced atomically:

```text
old:
  preview raw emotion payload
  publish(preview_id)
  cancel body
  Q&A fields / q_instance IDs

new:
  source_ref preview
  preview mutation/cancel
  save with hashes/revision/visibility/idempotency
  owner history/detail/visibility/delete
  new Nexus Piece payload
```

`PIECE_WIRE` may retain the neutral `/emotion/piece` and `/nexus/pieces` names, but old aliases, field readers and Q&A normalizers are removed. `/emotion/reflection/*`, `/nexus/reflections*`, `/mymodel/qna/*` and old `/piece/*` do not remain release-reachable.

## 12. Negative contract / STOP

Prohibited:

```text
CTA before saved source/terminal Emlis
Emlis body copied into Piece
raw payload resend
Q&A modal/card compatibility
private via public feed reuse
missing visibility treated public
text edit/safety bypass
hidden candidate saved
tier-dependent text safety/readability
visibility mutation regeneration/quota
old Q&A IDs in new UI
export before saved record
external-copy recovery promise
```

STOP if the CTA cannot obtain body-free source identity, preview cannot show the exact saved body, owner history cannot be separated from public feed, private content can enter Nexus/cache, or new RN requires changing Emlis output ownership.

## 13. Completion

```text
PIECE_RN_FLOW_V1_FIXED
POST_EMLIS_CTA_FIXED
QNA_PREVIEW_RETIRED
NEW_VISUAL_PREVIEW_FIXED
PRIVATE_DEFAULT_UI_FIXED
OWNER_HISTORY_SEPARATE_FIXED
VISIBILITY_DELETE_RETRY_FIXED
NEXUS_NEW_PAYLOAD_FIXED
RN_FIRST_EXPORT_FLOW_FIXED
OLD_QNA_RN_REACHABILITY_EXACT0
PRODUCTION_EFFECT_EXACT0
PCE6_COMPLETE_DESIGN_ONLY
```
