---
doc_id: piece_api_clean_cutover_design_20260808
title: "Piece API clean cutover design"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
phase: "PCE-6 API / DB / RN / Migration Design"
document_status: "PCE6_COMPLETE_DESIGN_ONLY"
contract_id: "piece.api.v2"
source_cocolon_head: "96df30f6cdda8f4549065a3b2156c5b75d36026e"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
automatic_progression: false
production_effect: "exact0"
---

# Piece API clean cutover design

## 1. Decision

```text
contract:
  piece.api.v2

reuse neutral namespaces:
  /emotion/piece/*
  /nexus/pieces*

old Q&A wire compatibility:
  exact0

preview source:
  saved source identity
  raw input resend exact0

canonical operation:
  save, not public publish

backend image export:
  initial exact0 under RN-first
```

Current request sends emotions/memo/category and returns question/reflection-shaped fields. Current publish changes one old row to ready/active and counts `published_at`. PCE-6 replaces that contract atomically rather than extending it.

## 2. Source request

```json
{
  "source_ref": {
    "source_input_id": "uuid",
    "source_input_version": "emlis.current_input_bundle.v1",
    "source_input_bundle_commitment": "sha256",
    "emlis_observation_stage": "normal_observation",
    "emlis_observation_result_identity": "opaque-id",
    "question_need_decision_identity": null,
    "supplemental_answer_identity": null
  },
  "requested_format": null,
  "visual_selection": {
    "theme_id": null,
    "aspect_ratio": null,
    "branding_mode": null
  }
}
```

Owner comes only from Bearer auth. `user_id`, raw memo/emotions, Emlis body and Analysis material are not accepted. Backend resolves authoritative saved source and validates PCE-2 roles.

## 3. Owner/write routes

| method/path | contract |
|---|---|
| `GET /emotion/piece/quota` | Piece save quota, not publish count |
| `POST /emotion/piece/preview` | create exact candidate; `Idempotency-Key` required |
| `PATCH /emotion/piece/preview/{preview_id}` | pre-save eligible format/visual change |
| `DELETE /emotion/piece/preview/{preview_id}` | idempotent cancel |
| `POST /emotion/piece/save` | atomic record + quota; `Idempotency-Key` required |
| `GET /emotion/piece/history` | owner private/public history |
| `GET /emotion/piece/{piece_id}` | owner detail |
| `PATCH /emotion/piece/{piece_id}/visibility` | same record, expected row version |
| `DELETE /emotion/piece/{piece_id}` | atomic physical purge, idempotent |

Preview response includes:

```text
record/api versions
preview ID/revision/expiry
format + eligible formats
piece_text + hash
content payload + hash
coarse safety state
visual recipe + hash
private default
plan capabilities/quota
```

It excludes raw source, question/Q&A identity, detector detail and internal flags.

Preview mutation replaces the active candidate. Format changes may change text/hash; visual-only changes may not. Quota remains exact0.

Save request binds:

```text
preview ID/revision
piece_text_hash
content_payload_hash
visual_recipe_hash
visibility_scope
```

Client replacement text/payload/recipe is not accepted. Missing visibility fails closed to private. Same idempotency key returns the same Piece and consumption.

## 4. Public/Nexus routes

```text
GET    /nexus/pieces
GET    /nexus/pieces/unread-status
GET    /nexus/pieces/{piece_id}
POST   /nexus/pieces/{piece_id}/read
PUT    /nexus/pieces/{piece_id}/resonance
DELETE /nexus/pieces/{piece_id}/resonance
```

Public payload:

```text
piece_id / piece:<uuid>
allowed owner profile projection
format_type
canonical piece_text/hash
visual_recipe/hash
saved_at
metrics
viewer state
```

Exact0:

```text
question / q_key / q_instance_id
reflection_id / reflection:<uuid>
source_type = emotion_generated
raw answer/source identity
friend notification state
```

Non-owner access requires `saved + public + current viewer relation`. Private, deleted, inaccessible and missing all return the same 404-equivalent. Every read/resonance operation revalidates current visibility.

## 5. Export decision

Initial API has no backend image-render route. RN fetches a saved Piece and applies PCE-5 renderer locally. A body-free receipt endpoint may be added in PCE-9E. Backend/hybrid escalation requires separate approval and the same render interface; silent fallback remains exact0.

## 6. Error / exact-once contract

| HTTP | code |
|---:|---|
| 400 | `PIECE_REQUEST_INVALID` |
| 401 | `PIECE_AUTH_REQUIRED` |
| 404 | `PIECE_SOURCE_NOT_FOUND` / concealed `PIECE_NOT_FOUND` |
| 409 | `PIECE_PREVIEW_STALE` |
| 409 | `PIECE_PREVIEW_EXPIRED` |
| 409 | `PIECE_HASH_MISMATCH` |
| 409 | `PIECE_QUOTA_EXHAUSTED` |
| 409 | `PIECE_CONFLICT` |
| 422 | `PIECE_SOURCE_NOT_ELIGIBLE` |
| 422 | `PIECE_FORMAT_NOT_ELIGIBLE` |
| 422 | `PIECE_VISUAL_SELECTION_NOT_ALLOWED` |
| 422 | `PIECE_SAFETY_UNAVAILABLE` |
| 422 | `PIECE_LAYOUT_UNAVAILABLE` |
| 503 | `PIECE_TEMPORARILY_UNAVAILABLE` |

No matched PII, private source fragment, detector/focus key or diagnosis-like explanation is returned.

```text
preview/save:
  Idempotency-Key

preview mutation:
  expected_preview_revision

visibility/delete:
  expected_row_version

timeout retry:
  same key, never automatic new record
```

## 7. Clean cutover

Reused neutral namespaces receive new semantics in one backend/client cutover.

Retire before release:

```text
/emotion/piece/publish
/emotion/piece/cancel
/emotion/reflection/*
/nexus/reflections*
/mymodel/qna/*
old /piece/* Q&A runtime
```

Retire old fields:

```text
question
reflection_text
reflection_id
q_key
q_instance_id
publish_limit / published_count naming
preview_ready / published as visibility owner
```

Required owner updates include `api_emotion_piece.py`, `api_nexus.py`, `api_piece_compat.py` removal, old `api_piece_runtime.py` Piece-facing routes, `app.py`, API registry/docs, RN wire contracts and API adapters.

Internal disabled staging is allowed; user-visible old/new dual run is exact0.

## 8. Layer ownership

| layer | owner |
|---|---|
| owner/write routes | `api_emotion_piece.py` with new models |
| record/access services | PCE-9A |
| generation | PCE-9B |
| source adapter | PCE-9C |
| public feed/routes | `api_nexus.py` / PCE-9F |
| RN client | PCE-9D |
| export receipt | PCE-9E |
| RED/privacy/error tests | PCE-7 |

Exact service filenames are frozen in PCE-8.

## 9. Negative contract / STOP

Prohibited:

```text
raw input resend
client user_id ownership
client replacement body
save treated as public publish
private weaker safety
403 existence leak
old Q&A fields/IDs
visibility regeneration/quota
unapproved backend export
internal safety detail
new record on same retry
release-reachable compat route
broad public view without visibility
```

STOP if saved source is unavailable without raw resend, old compatibility is required, save/quota cannot share one terminal owner, inaccessible records cannot be concealed, current visibility cannot be checked on every public action, or Emlis/Analysis internals must change.

## 10. Completion

```text
PIECE_API_V2_FIXED
SAVED_SOURCE_REQUEST_FIXED
RAW_INPUT_RESEND_EXACT0
PREVIEW_MUTATION_SAVE_HISTORY_VISIBILITY_DELETE_FIXED
SAVE_NOT_PUBLISH_FIXED
NEW_NEXUS_PAYLOAD_FIXED
OLD_QNA_WIRE_EXACT0
IDEMPOTENCY_REVISION_FIXED
PRIVATE_CONCEALMENT_FIXED
BACKEND_EXPORT_INITIAL_EXACT0
PRODUCTION_EFFECT_EXACT0
PCE6_COMPLETE_DESIGN_ONLY
```

## 11. 2026-10-08 source-reference transport binding — non-production scope

The preceding sections retain the August design and its history. The following
additive binding supplies the existing section 2 source_ref; it does not replace
the preview request/response, saved-source owner or clean-cutover requirements.

Mash's continuation instruction followed Karen's specific proposal to adopt
`GET /emotion/piece/source-ref/{saved_input_id}` and apply the prepared candidate
to non-running code, excluding live DB changes, deployment and activation. Work
is restricted to that presented scope. This is not blanket approval of B12-C,
server flag configuration, actual user access, public rollout or other APIs.

| Additional method/path | Contract |
|---|---|
| `GET /emotion/piece/source-ref/{saved_input_id}` | Explicit authenticated read of exactly the seven existing original-source references; no generation, persistence or quota consumption |

The path parameter is a canonical lower-case, nonzero UUID. No query parameters
or request body are accepted. Bearer authentication uses the existing HTTP
owner, then `PieceSavedSourceAdapter.resolve_original_source_ref` checks the
saved source/current observation and revalidates before returning. The response
object contains exactly `source_input_id`, `source_input_version`,
`source_input_bundle_commitment`, `emlis_observation_stage`,
`emlis_observation_result_identity`, `question_need_decision_identity` and
`supplemental_answer_identity`. It is not wrapped in a new envelope. The existing
bundle version is `emlis.current_input_bundle.v1`; the commitment is lower-case
`sha256:` plus 64 hex digits. Original-only normal/pre-question stages are
supported. Normal stage has a null question identity; pre-question stage has a
nonempty reference. The supplemental identity is null. Refined-source support
is not added by this binding.

Raw input, Emlis/Analysis text, owner ID, caller tier, eligibility, effective
flags and safety verdicts are neither accepted nor returned. Missing, extra or
invalid response fields produce an unavailable error, not partial projection.
Responses use `Cache-Control: no-store`; 401 also uses `WWW-Authenticate: Bearer`.
Closed errors are 400/PIECE_REQUEST_INVALID, 401/PIECE_AUTH_REQUIRED,
404/PIECE_SOURCE_NOT_FOUND, 409/PIECE_CONFLICT,
422/PIECE_SOURCE_NOT_ELIGIBLE and 503/PIECE_TEMPORARILY_UNAVAILABLE.
Unexpected details are not echoed; task cancellation is not converted to success.

RN uses the existing `features/piece/pieceApi.js` owner through an explicit
`requestPieceSourceRef` call, checking the expected session before and after IO.
It sends no Idempotency-Key or body and generates no preview automatically.
A later explicit preview POST retains its existing request/key contract and
independently revalidates the saved state. These references confer no ongoing
access, renderer admission, save authority or feature enablement.

Implementation lives in the separate `piece_v2_source_ref_http.source_ref_router`
and is not included in `api_piece_v2.router` or `app.py`. Live registration must
still include authoritative server-effective gating, source/access prerequisites
and the separately approved cutover. The RN function has no InputScreen caller
in this unit. Code existence and synthetic transport tests are not actual
Auth/DB/native evidence or completion of the October 10 product milestone.
