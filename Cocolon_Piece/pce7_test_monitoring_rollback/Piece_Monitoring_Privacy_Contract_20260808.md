---
doc_id: piece_monitoring_privacy_contract_20260808
title: "Piece monitoring privacy contract"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-7 Test / Monitoring / Rollback"
document_status: "PCE7_COMPLETE_DESIGN_ONLY"
contract_id: "piece.monitoring_privacy.v1"
source_cocolon_head: "cf14b503a4e5087b7ef33a82c8073a93517d5b60"
source_cocolon_tree: "4d64aba7bfe63aecf391a0ba3598589699cec6f1"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
automatic_progression: false
production_effect: "exact0"
---

# Piece monitoring privacy contract

## 1. Purpose

Piece monitoring must reveal product failure without turning a user's Piece, raw input or Emlis/Analysis material into an observability payload.

```text
contract:
  piece.monitoring_privacy.v1

monitoring mode:
  strict enumerated allowlist

free-form Piece body/error/meta:
  exact0

production monitoring implementation in PCE-7:
  exact0
```

Monitoring is evidence of runtime behavior. Absence of an event is not proof that the product invariant is correct, and monitoring never replaces automated tests or access control.

## 2. Confirmed current actual

Current Cocolon RN monitoring sends generic events to `/ops/client-events`. It allows `message`, `error_message` and nested `meta`, then applies pattern-based email/UUID/token redaction and truncation. Current backend client-event handling sanitizes similar free-form fields, logs them through `observability.log_event`, and emits alerts for error/fatal severity. Current response reports `stored=false`; no Piece-specific durable event table is confirmed.

Current request-performance monitoring records method, path, status, latency, Supabase call/error/time and cache counters. It does not inspect request/response bodies.

Current generic redaction is useful for broad application errors, but it is not sufficient proof that arbitrary Piece prose, Emlis text or Analysis text cannot enter a free-form field. PCE-7 therefore requires a Piece-specific schema at both caller and receiver.

## 3. Event schema

```text
schema_version:
  piece.ops_event.v1

required:
  event_name
  event_version
  source_layer
  stage
  outcome
  occurred_at
  request_id

optional allowlisted:
  error_code
  http_status
  duration_bucket
  retry_count
  idempotency_replayed
  visibility_scope
  subscription_tier
  format_type
  theme_id
  aspect_ratio
  branding_mode
  source_stage
  safety_state
  hash_check_result
  feature_state
  migration_stage
  app_version
  app_build
  platform
```

Rules:

- Every string field except `request_id`, app/build and stable contract IDs is an enum from the current contract.
- `request_id` is the API middleware correlation ID, not a user/record/source ID.
- Exact duration may remain in generic request-performance logs; Piece product events use a bucket to reduce fingerprinting.
- `hash_check_result` is `match`, `mismatch` or `not_applicable`; no hash value or prefix is emitted.
- `retry_count` is a bounded integer.
- `feature_state` is a stable safe-state/flag decision, not the entire environment.
- Unknown fields are rejected or dropped before logging; they are never stringified into a fallback field.

## 4. Forbidden monitoring material

The following are prohibited from Piece events, logs, alert markers, Slack payloads, client-event requests, persistent metrics and filenames.

```text
raw input body
Piece text or content payload
supplemental answer body
Emlis visible body
Emlis internal candidate/AST/obligation
Analysis inference/simulation body
safety matched source or detector trace
piece_text_hash/content_payload_hash/visual_recipe_hash values
Piece ID/public ID/preview ID/source input ID
idempotency key or hash
owner/viewer user ID or raw user hash
profile name/share code/friend code
external recipient/app/share target
local file path
Authorization/token/credential
full exception message/stack containing request data
request or response body
```

A UUID redactor is not permission to send a UUID. Piece-specific builders must omit the field before generic sanitization.

## 5. Event catalog

### Preview and save

```text
piece_preview_requested
piece_preview_succeeded
piece_preview_failed
piece_preview_mutated
piece_preview_cancelled
piece_save_requested
piece_record_saved_private
piece_record_saved_public
piece_save_failed
piece_quota_exhausted
piece_idempotency_replayed
```

The roadmap candidate `piece_record_published_public` is replaced by `piece_record_saved_public`. PCE-6 made `save` the canonical operation and separated visibility from lifecycle; retaining “published” would reintroduce the old Q&A meaning.

### Owner lifecycle and access

```text
piece_owner_history_loaded
piece_owner_history_failed
piece_visibility_changed
piece_visibility_change_failed
piece_delete_requested
piece_delete_succeeded
piece_delete_failed
piece_access_denied
piece_concealed_not_found
```

`piece_access_denied` and `piece_concealed_not_found` do not contain target identity. They may include `source_layer`, route contract, HTTP status and coarse denial class only in internal server logs. Public API responses remain indistinguishable where required.

### Public/Nexus

```text
piece_public_list_loaded
piece_public_detail_loaded
piece_public_read_recorded
piece_resonance_changed
piece_public_operation_denied
```

No event carries the Piece ID. Aggregate product health is sufficient; exact record investigation uses body-free DB receipt/request identities under bounded operational access, not broad monitoring.

### Export

```text
piece_export_requested
piece_export_succeeded
piece_export_failed
piece_share_opened
piece_reexport_succeeded
piece_reexport_failed
piece_layout_unavailable
```

Export events may include plan, format, theme, ratio, branding, renderer version and duration bucket. They may not include filename, local path, Piece body, target app or image bytes.

### Invariant and operations

```text
piece_hash_mismatch
piece_private_visibility_guard_failed
piece_old_qna_residual_detected
piece_migration_guard_failed
piece_feature_disabled
piece_rollback_activated
piece_rollback_verified
```

The first four are release/incident blockers and must use alert markers. They still carry no body or raw IDs.

## 6. Allowed enums

```text
source_layer:
  rn / api / service / store / db_rpc / renderer / migration

stage:
  source_resolve / preview / preview_mutation / save / owner_read
  / visibility / public_read / resonance / export / delete
  / migration / rollback

outcome:
  requested / succeeded / failed / denied / concealed / replayed / disabled

visibility_scope:
  private / public / not_applicable

subscription_tier:
  free / plus / premium / unknown

source_stage:
  normal_observation / pre_question_observation / refined_observation
  / not_applicable

safety_state:
  ready / adjusted / unavailable / not_applicable

hash_check_result:
  match / mismatch / not_applicable

duration_bucket:
  lt_100ms / 100_499ms / 500_1499ms / 1500_4999ms / gte_5000ms
```

Format, theme, ratio and branding enums are read from the immutable PCE-4/PCE-5 catalogs. Arbitrary strings are not accepted.

## 7. Error-code policy

Piece monitoring uses the stable API/product error code, never the human-facing message or exception text.

Allowed initial codes:

```text
PIECE_REQUEST_INVALID
PIECE_AUTH_REQUIRED
PIECE_SOURCE_NOT_FOUND
PIECE_NOT_FOUND
PIECE_SOURCE_NOT_ELIGIBLE
PIECE_PREVIEW_STALE
PIECE_PREVIEW_EXPIRED
PIECE_HASH_MISMATCH
PIECE_QUOTA_EXHAUSTED
PIECE_CONFLICT
PIECE_FORMAT_NOT_ELIGIBLE
PIECE_VISUAL_SELECTION_NOT_ALLOWED
PIECE_SAFETY_UNAVAILABLE
PIECE_LAYOUT_UNAVAILABLE
PIECE_FEATURE_DISABLED
PIECE_TEMPORARILY_UNAVAILABLE
PIECE_MIGRATION_GUARD_FAILED
```

An unexpected exception maps to `PIECE_INTERNAL_ERROR` and logs only the exception class in the generic request-performance layer. Piece event payload does not copy `str(exc)`.

## 8. Emission ownership

### Backend

Server-side terminal operations are authoritative for:

```text
save/private/public outcome
quota exhaustion/replay
authorization/concealment
visibility terminal result
delete terminal result
migration/rollback guard
hash mismatch
```

They use one Piece-specific builder that validates the allowlist before calling current `observability.log_event`/`log_alert`. Individual services do not construct arbitrary monitoring dicts.

### RN

RN emits UI-only observations:

```text
preview screen shown/failed
user requested export
capture/share sheet opened or failed
client safe-disabled presentation
accessibility/render client failure class
```

A Piece wrapper may call current `captureClientEvent`, but it accepts only the strict Piece schema and never exposes generic `message`, `error_message` or open `meta` to Piece callers. Backend sanitizes and validates again.

### Request performance

Current request-performance middleware remains route-level. Piece code may add only numeric/enum counters through `set_metric`; it may not add IDs, hashes, bodies or exception messages.

## 9. Alert policy

### Immediate critical — any occurrence

```text
piece_private_visibility_guard_failed
piece_hash_mismatch
piece_old_qna_residual_detected after M5
piece_migration_guard_failed
successful over-quota save
monitoring privacy canary detected
rollback write cutoff violated
```

These stop rollout or release acceptance. Alert payload contains alert key, layer/stage, contract/version, build and request ID only.

### Availability warning

Initial warning rule for low-volume launch:

```text
same event/error_code:
  3 consecutive failures
  OR 5 failures within 15 minutes

export failure ratio:
  at least 5 attempts and >= 20% failed within 15 minutes

preview/save temporary unavailable:
  at least 5 failures within 15 minutes
```

Thresholds are release defaults, not evidence that current external alerting is configured. PCE-12 pins the deployed alert owner and performs a drill.

## 10. Aggregation and retention boundary

Current source confirms structured application logs and best-effort alert/Slack helpers; it does not confirm a Piece event warehouse or the external platform's exact retention.

PCE-7 decision:

```text
initial detailed Piece event DB table:
  exact0

application logs:
  body-free schema only

aggregate counters:
  allowed if only enum/numeric buckets

release requirement:
  deployed log/alert owner and retention documented in PCE-12
```

Minimum release operational target is 14 days of body-free alert/search availability. This is a deployment acceptance target, not a claim about current retention. Longer aggregate retention may be configured later without preserving request-level identifiers.

## 11. Monitoring privacy tests

Every sink test injects the forbidden canaries into likely misuse locations:

```text
message
error_message
meta nested values
exception text
route/query
filename/path
IDs/hashes
renderer diagnostics
migration diagnostics
alert message
Slack text
```

Assertions inspect the fully serialized payload/string for all sinks, not merely the normalized Python/JS object.

Required sinks:

```text
RN request body
backend client-event sanitized payload
structured JSON log
plain ALERT marker
optional Slack payload builder
request-performance log
migration/rollback receipt/log projection
```

A test that only proves emails/tokens are redacted does not satisfy Piece body privacy.

## 12. Metrics needed for product health

Body-free aggregate views:

```text
preview success/failure by plan and source stage
save success/failure/quota exhaustion/replay by plan
private/public saved counts
visibility changes by direction
public denial/concealment count
export success/failure by platform/ratio/format
layout unavailable by platform/format/length class
rollback/feature-disabled count
old Q&A residual and hash mismatch count
```

Text length is allowed only as a coarse class:

```text
short / medium / long / very_long
```

Exact character count is not required for monitoring and is not emitted initially.

## 13. User-facing privacy boundary

Monitoring is not described as collecting Piece content. Product/privacy text must not imply that private Piece bodies are sent to analytics. Any future third-party analytics SDK or persistent event warehouse that changes this boundary requires a separate privacy/data-safety review and Mash approval.

## 14. Current actual gap

```text
current generic RN monitoring:
  present

current generic backend sanitizer/structured log:
  present

current Piece-specific allowlist builder:
  absent

current Piece event enum/schema:
  absent

current Piece privacy-canary suite:
  absent

current deployed alert thresholds/retention proof:
  unconfirmed

PCE-7 implementation/execution:
  exact0
```

## 15. STOP conditions

- Product debugging is said to require storing Piece/raw/Emlis/Analysis body in monitoring.
- A free-form field remains reachable from Piece callers.
- Hash or ID values are used as a shortcut for body-free monitoring without threat analysis.
- An external analytics/alert provider is added without privacy and retention ownership.
- Monitoring failure is allowed to fail the user operation.
- Absence of monitoring events is presented as access/privacy test evidence.

## 16. Completion

```text
PIECE_MONITORING_PRIVACY_V1_FIXED
STRICT_ENUM_ALLOWLIST_FIXED
FREE_FORM_PIECE_MONITORING_EXACT0
BODY_HASH_RAW_ID_LOGGING_EXACT0
PIECE_EVENT_CATALOG_FIXED
PUBLISHED_EVENT_RENAMED_TO_SAVED_PUBLIC
SERVER_TERMINAL_EVENT_OWNER_FIXED
RN_UI_EVENT_BOUNDARY_FIXED
CRITICAL_AND_AVAILABILITY_ALERT_POLICY_FIXED
PIECE_EVENT_DB_INITIAL_EXACT0
RETENTION_DEPLOYMENT_GATE_TO_PCE12
MONITORING_IMPLEMENTATION_EXACT0
PRODUCTION_EFFECT_EXACT0
PCE7_COMPLETE_DESIGN_ONLY
```
