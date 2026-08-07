---
doc_id: piece_pce4_design_closure_checkpoint_20260807
title: "Piece PCE-4 content / format / safety design closure checkpoint"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
checkpoint_type: "PCE4_DESIGN_ONLY_CLOSURE"
baseline_cocolon_head: "66ca6d3f3b8b81bfee808670d0e96b5a16d48ea3"
baseline_cocolon_tree: "8507d8ccf34e3312a7c194fb9aab4fcce7daa4e6"
design_publication_commit: "76ae94f46ac5c53ddab9aa0d8c437afa63f3a92a"
design_publication_tree: "fe1657641937cf4bec2f6c3551fc6609b0a003b6"
pce4_complete: true
pce5_activated: false
analysis_roadmap_activated: false
automatic_progression: false
production_effect: "exact0"
---

# Piece PCE-4 content / format / safety design closure checkpoint

## 1. Closure result

Mashが承認した次のdesign-only作業を完了した。

```text
PCE4_CONTENT_FORMAT_SAFETY_DESIGN_ONLY
```

```text
PCE-0: COMPLETE
PCE-1: COMPLETE_DESIGN_ONLY
PCE-2: COMPLETE_DESIGN_ONLY
PCE-3: COMPLETE_DESIGN_ONLY
PCE-4: COMPLETE_DESIGN_ONLY

PCE-5:
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

PCE-4 fixes logical content contracts only. Generation code、DB、API、RN、renderer、export、migration、runtime、tests、release authority remain exact0.

## 3. Content meaning

```text
source canonical:
  saved input exact1
  refined only: distinct supplemental answer exact1

derived canonical:
  PieceRecord.piece_text

raw input overwrite:
  exact0

Emlis visible body reuse:
  exact0

Analysis inference reuse:
  exact0

title:
  initial exact0
```

Piece is not a short summary. It preserves applicable subject、stance、object、relation、scope、uncertainty、negation、source role、audience risk、and must-keep anchors.

It may not add diagnosis、personality、cause、advice、motive、future prediction、or third-party allegation. If safety transformation leaves no source-grounded meaning anchor, PieceRecord and quota effect are exact0. Old Q&A fallback is exact0.

## 4. Initial active formats

```text
active exact3:
  short_essay
  quote
  declaration

default:
  short_essay

Free:
  short_essay fixed

Plus:
  auto recommendation among eligible exact3

Premium:
  choose among eligible exact3

Q&A:
  pre-release legacy
  active exact0

fragment:
  initial active exact0
  deferred post-release candidate
```

`short_essay` is the default and Free format because it preserves the widest range of context、relation、and uncertainty without Quote overcompression or Declaration false-stance risk.

Format selection uses generic meaning shape、claim count、relation complexity、context dependency、stance evidence、uncertainty / negation、source length、and safety-transform pressure. Case ID、exact sample、focus key、one keyword、tier、visual theme、Emlis mode、or Analysis route alone are not format owners.

## 5. Canonical content equality

```text
content payload:
  piece.content_payload.v1

fields:
  format_type
  body_blocks
  title = null
  language
  meaning contract version
  safety contract version
```

```text
preview reconstructed piece_text
  ==
preview piece_text
  ==
saved PieceRecord.piece_text
  ==
export renderer input piece_text
```

Save、visibility change、export、and re-export do not regenerate text. Pre-save format change creates a new candidate/hash and quota exact0. Post-save text or format change requires a new PieceRecord and consumes PCE-3 quota exact1.

## 6. Safety and user selection

```text
same meaning fidelity and safety:
  Free / Plus / Premium
  private / public
  preview / save / export / re-export
```

Safety covers direct identifiers、URL / contact instruction、credentials、identifiable third-party targets、attack / threat / doxxing、unsupported claims、and internal Cocolon / Emlis / Analysis material.

Allowed public states are coarse `ready / adjusted / unavailable`. Detector detail、matched source、PII detail、anchor body、and safety trace remain public exact0.

```text
user may:
  choose whether to create
  inspect preview
  cancel
  choose private / public
  choose eligible format when plan allows
  save
  later export/share under PCE-5

user may not:
  free-edit piece_text
  paste replacement body
  show/publish raw input
  disable safety
  force ineligible format
  choose Emlis / Analysis body
  mutate saved text/format in place
```

Private is audience control, not a safety bypass. Paid value belongs to quota、eligible selection breadth、visual choices、and branding—not weaker or stronger treatment of the user's words.

## 7. Current actual basis

```text
Cocolon basis head / tree:
  66ca6d3f3b8b81bfee808670d0e96b5a16d48ea3
  8507d8ccf34e3312a7c194fb9aab4fcce7daa4e6

mashos-api basis head / tree:
  315813c7bd3372462de926ddad74df567254a6b5
  a641510e107d52bb910073f36604c85bd57af150

roadmap SHA-256:
  2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939
```

Confirmed current actual:

```text
format:
  implicit Q&A

generation:
  deterministic rule-based
  fixed question / focus / phrase branches

reusable concepts:
  PII mask / URL removal
  target abstraction
  severe threat / doxxing block
  text hash
  meaning / overcompression metadata
  source claim / must-keep coverage
  no Emlis voice / no added user claims
  preview/publish hash equality
```

PCE-4 does not adopt current Q&A bodies、fixed branches、legacy candidate text、or `piece.core.v1` as the future content owner.

## 8. Verified design artifacts

| path | UTF-8 bytes | SHA-256 | Git blob SHA-1 |
|---|---:|---|---|
| `Cocolon_Piece/pce4_content_format_safety/Piece_Content_Meaning_Contract_20260807.md` | 11695 | `88b7a40280ad3beb3a83caceb85dc74f75662edcf4442aa19c237ae41f63fc1d` | `cfa23183e26551ed461ee4815a8535f47d92c6c1` |
| `Cocolon_Piece/pce4_content_format_safety/Piece_Format_Owner_Decision_20260807.md` | 12123 | `9239025403fd8c083af684439316ccfb1d8e3a96ea022ed97668077ada4af48b` | `546ba60a870f0e8271d15a39d2ae15adc16c0c50` |
| `Cocolon_Piece/pce4_content_format_safety/Piece_Public_Safety_Transformation_Contract_20260807.md` | 12212 | `56db5be17034731b70cabbe646be6bd1e9c615551e53afb342bcf0c9888324da` | `45bb3259975fe697d0c2703ef53a90cf5fe68e94` |
| `Cocolon_Piece/pce4_content_format_safety/Piece_User_Selection_Boundary_20260807.md` | 10436 | `57928eea103f88566028a46c99dbcff98fbed6159c3566f80296f5714cee7cdf` | `c74f59e3de64996dba5f1841d23a544a65f4f050` |
| `Cocolon_Piece/00_read_first.md` | 13196 | `03a0ebb68f7c61933c7ceae892a7887d9d14aeff01371a329fcc621539469732` | `647afd472c799c2909f40de63ed5cc21175da473` |
| `Cocolon_Piece/manifest.json` | 9576 | `e7e532291027d4d26650800a70041d2320575d89931f58be12a5c3a373ce3b12` | `01067325520c37d2d2738b7c755ec78394bcaad7` |
| `Cocolon_前提資料/15G_cocolon_piece_workstream_pce4_design_closure_20260807.md` | 13492 | `23d40271f3b7b35e9d13fa9a10940ed1a4bcb6b204f5c6acf8aba2b5ca2a61c8` | `b6bde5a02b7a4c52db5201206769abb099cd9bed` |

All seven paths were listed or fetched from the publication commit. Remote sizes and blob identities match the canonical artifacts.

## 9. Manifest lineage

`Cocolon_Piece/manifest.json` advances from v7 to compact v8. PCE-0 through PCE-3 detailed identities remain in immutable predecessor blob `2eb59e4f7c0427da9ce37f57349e7d31e4715301` and canonical phase artifacts. v8 names that predecessor and carries current PCE-4 contracts、artifacts、actual basis、state、next action、and exact technical effects.

This is compaction, not deletion or reclassification of prior PCE results.

## 10. Publication scope

```text
baseline:
  66ca6d3f3b8b81bfee808670d0e96b5a16d48ea3

publication commit:
  76ae94f46ac5c53ddab9aa0d8c437afa63f3a92a

publication tree:
  fe1657641937cf4bec2f6c3551fc6609b0a003b6

publication commits:
  exact1

publication changed paths:
  exact7

new PCE-4 artifacts:
  exact4

entry / manifest / premise:
  exact3

scope outside Piece / Piece premise:
  exact0
```

Publication was a non-force fast-forward from the fresh baseline.

## 11. Unreferenced transport candidates

### PCE-4 user selection candidate

```text
invalid blob:
  ad92789e8fc5b8bf7ed8b59c0a619c49874151a2

canonical blob:
  c74f59e3de64996dba5f1841d23a544a65f4f050

reason:
  base64 transport candidate did not match prepared UTF-8 bytes

tree inclusion / ref effect:
  exact0 / exact0

reuse:
  prohibited
```

This incident is also recorded in manifest v8.

### First closure candidate

```text
invalid blob:
  f6bd91d51fd014997dd6406aa68724eeb62a9dc3

reason:
  created blob did not match the prepared checkpoint bytes

tree inclusion / ref effect:
  exact0 / exact0

reuse:
  prohibited
```

Both mismatches were detected before their blob identities were used in any tree/ref update. The canonical checkpoint is the exact successor blob identified by this file's publication result.

## 12. Completed / not implemented

Completed:

- content meaning / source-canonical separation。
- meaning anchors / no-added-claim contract。
- active format exact3 and eligibility boundaries。
- Q&A active exact0 / fragment deferral。
- generic format owner and plan boundary。
- canonical content payload and text equality。
- public safety pipeline and coarse result states。
- private/public same safety。
- no free-edit user boundary。
- pre-save candidate / post-save new-record semantics。
- negative contracts and STOP conditions。

Not implemented:

```text
production source / format selector / content generator:
  exact0

DB / API / RN / migration:
  exact0

visual recipe / renderer / export:
  exact0

test / runtime / actual device:
  exact0

old Q&A removal / release / feature flag:
  exact0
```

## 13. Facts / inference / Karen's opinion

### Confirmed facts

Roadmap PCE-4 requirements、PCE-1 clean cutover、PCE-2 source separation、PCE-3 new-record quota rule、current Q&A/safety/hash assets、publication scope、and remote artifact identities were confirmed.

### Inference / unconfirmed

Future input distribution across formats、final layout limits、multilingual detector coverage、low-info eligibility rate、user preference、RN comprehension、and actual-device renderer behavior remain unconfirmed and are not claimed as validated.

### Karen's opinion

`short_essay` is the correct Free/default format because it preserves the widest input range without forcing overcompression or inventing stance. Quote and Declaration add value only when stricter source evidence is present.

Meaning fidelity and safety should not be plan upgrades. Cocolon must handle the user's words equally carefully at every tier; paid value belongs elsewhere.

## 14. Next exact actions

```text
next Piece action:
  PCE5_VISUAL_RECIPE_EXPORT_DESIGN_ONLY

environment:
  CHAT_5_6_PRO_OK

next cross-workstream queued action:
  ANALYSIS_PRO_FIRST_CURRENT_ACTUAL_PRODUCT_QUALITY_CLOSURE_ROADMAP_DESIGN_ONLY
```

Both require separate Mash approval. Neither is activated.

Mash-side action required for PCE-4 closure:

```text
exact0
```

## 15. Effects

```text
Cocolon documentation / Piece premise:
  reflected

Cocolon production source change:
  exact0

mashos-api production source change:
  exact0

DB / API / RN / migration / data deletion:
  exact0

test / runtime:
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

## 16. Closure

```text
PCE4_CONTENT_MEANING_FIXED
PCE4_CONTENT_PAYLOAD_FIXED
PCE4_FORMAT_OWNER_FIXED
PCE4_PUBLIC_SAFETY_FIXED
PCE4_USER_SELECTION_FIXED
INITIAL_ACTIVE_FORMATS_EXACT3
SHORT_ESSAY_DEFAULT_FREE_FIXED
PLUS_AUTO_RECOMMENDATION_FIXED
PREMIUM_ELIGIBLE_SELECTION_FIXED
QNA_ACTIVE_EXACT0
FRAGMENT_INITIAL_ACTIVE_EXACT0
TIER_SAFETY_FIDELITY_EQUAL
RAW_EMLIS_ANALYSIS_BODY_COPY_EXACT0
USER_FREE_EDIT_EXACT0
PREVIEW_SAVE_EXPORT_EQUALITY_REQUIRED
PCE4_REMOTE_BLOBS_VERIFIED_EXACT7
PCE4_COMPLETE_DESIGN_ONLY
PCE5_NOT_ACTIVATED
ANALYSIS_ROADMAP_NOT_ACTIVATED
AUTOMATIC_PROGRESSION_FALSE
```
