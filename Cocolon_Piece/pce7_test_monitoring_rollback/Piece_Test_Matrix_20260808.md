---
doc_id: piece_test_matrix_20260808
title: "Piece test matrix"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-7 Test / Monitoring / Rollback"
document_status: "PCE7_COMPLETE_DESIGN_ONLY"
contract_id: "piece.test_matrix.v1"
red_catalog_id: "piece.red_contract_catalog.v1"
source_cocolon_head: "cf14b503a4e5087b7ef33a82c8073a93517d5b60"
source_cocolon_tree: "4d64aba7bfe63aecf391a0ba3598589699cec6f1"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
automatic_progression: false
production_effect: "exact0"
---

# Piece test matrix

## 1. Purpose

This matrix defines where each PCE-7 invariant is proved, which environment is honest, and what evidence is required before an implementation packet may close.

```text
contract:
  piece.test_matrix.v1

source RED catalog:
  piece.red_contract_catalog.v1

PCE-7 test code created:
  exact0

PCE-7 tests run:
  exact0
```

PCE-8 freezes exact filenames and packet ownership. PCE-7 freezes suite roles, evidence boundaries and release gates.

## 2. Confirmed current test basis

Current `mashos-api` has pytest contract tests for the old Q&A Piece flow, including Q&A response fields, safety transforms, preview/publish hash equality and old same-row lifecycle. Current Cocolon uses Node `node:test` through `tests/rn-screen-contracts.test.js`, primarily source/wiring assertions; those assertions currently require the old preview/publish/cancel and Q&A modal/card paths.

Current monitoring has generic backend client-event sanitizer tests, but no Piece-specific allowlist/body-leak suite. Current repository has no new Piece migration implementation, no new Piece transaction test environment, no Piece renderer test owner and no actual-device evidence.

These are inputs. They are not PCE-7 GREEN results.

## 3. Suite classes

| Suite ID | Role | Standard environment | What it may prove | What it may not prove |
|---|---|---|---|---|
| `P7-S01` | pure contract/unit | Chat implementation + deterministic pytest | schema, enum, hash, eligibility, no-mixing | live DB transaction/RLS |
| `P7-S02` | API contract | pytest/FastAPI client | request/response, auth/error/concealment, route retirement | production deployment |
| `P7-S03` | store transaction integration | isolated actual PostgreSQL/Supabase-compatible DB | atomic save/quota/delete, concurrency, FK/cascade | production data behavior |
| `P7-S04` | access/RLS integration | isolated actual DB + service/API identities | grants, RLS, private/public/viewer relation | RN presentation |
| `P7-S05` | migration verification | fresh and predecessor-shaped isolated DB | M0–M8 pre/post object identity, drift/rollback guards | destructive production cleanup |
| `P7-S06` | backend monitoring privacy | pytest captured logs/events/alerts | exact allowlist, forbidden canary absence | external log retention/config |
| `P7-S07` | backend feature flag/rollback | pytest API/store integration | fail-closed server gates, dependency lattice, write cutoff | stale installed RN pixels |
| `P7-S08` | RN source contract | Node `node:test` | imports, route/field absence, flag fallback, stable labels | runtime rendering/interaction |
| `P7-S09` | RN state/component logic | selected deterministic RN test harness | preview state, conflict/retry, visibility choices | native share/permission |
| `P7-S10` | renderer/layout logic | deterministic JS/native-independent tests | recipe/hash, fit decision, forbidden metadata input | final OS rasterization |
| `P7-S11` | staging E2E | integrated non-production backend + RN build | full data/control flow and safe-disable behavior | independent audit or store release |
| `P7-S12` | actual device | `MASH_ACTUAL_DEVICE_REQUIRED` | iOS/Android visual, share, permission, accessibility, memory | independent cross-repo acceptance |
| `P7-S13` | independent audit | `WORK_ULTRA_REQUIRED` at PCE-U1/U2 | cross-repo independent acceptance | implementation ownership |

`P7-S03` and `P7-S04` must use actual transaction and RLS semantics. An in-memory dict, mocked HTTP response or source-string assertion cannot substitute for those claims.

## 4. Contract-to-suite matrix

### Source / content

| RED IDs | Required suites | Packet owner | Minimum evidence |
|---|---|---|---|
| R001–R004 | S01, S02, S11 | PCE-9B/9C | synthetic canaries absent; lineage roles exact |
| R005 | S02, S08 | PCE-9A/9C/9D | forbidden request keys rejected; RN sends source ref only |
| R006–R008 | S01, S02, S03, S10, S11 | PCE-9A/9B/9E | preview/save/render text and hash equality |

### Visibility / access

| RED IDs | Required suites | Packet owner | Minimum evidence |
|---|---|---|---|
| R009–R013 | S02, S03, S04, S11 | PCE-9A/9F | private absent, public relation enforced, missing visibility private |
| R014–R016 | S02, S04, S08, S11 | PCE-9A/9D/9F | service-role not auth, concealment equal, owner API separated |

### Quota / concurrency / terminal operations

| RED IDs | Required suites | Packet owner | Minimum evidence |
|---|---|---|---|
| R017–R018 | S02, S03, S11 | PCE-9A/9E | ledger delta exact0 for non-save operations |
| R019–R024 | S03, S11 | PCE-9A | concurrent terminal results, exact-once and server entitlement |
| R025–R026 | S02, S03, S04, S11 | PCE-9A/9D | optimistic conflict, atomic purge, quota retained |

### Visual / export / tier

| RED IDs | Required suites | Packet owner | Minimum evidence |
|---|---|---|---|
| R027 | S01, S03, S10 | PCE-9A/9E | required version identities stored/supported |
| R028–R032 | S08, S09, S10, S11, S12 | PCE-9D/9E | deterministic no-invalid-success plus actual-device packet |

### Legacy / migration / monitoring / rollback

| RED IDs | Required suites | Packet owner | Minimum evidence |
|---|---|---|---|
| R033–R034 | S02, S08, S11 | PCE-9A/9D/9F | route/caller/card residual exact0 |
| R035–R036 | S05, S11 | PCE-9A migration/M7 | bridge precondition and exact destructive identity set |
| R037 | S06, S08, S11 | PCE-9A/9D/9E/9F | forbidden body canaries absent from every monitoring sink |
| R038–R039 | S07, S08, S11 | PCE-9A/9D/9F | missing flags false, server authoritative, safe disable |
| R040 | S05 | PCE-9A migration | catalog/migration identity guard stops before operation |

## 5. Test execution order per implementation packet

Every PCE-9 packet follows this order.

```text
1. freeze packet-scoped RED IDs
2. validate causal RED
3. implement one bounded owner
4. targeted GREEN
5. predecessor Piece regression subset
6. monitoring/privacy negative subset
7. feature flag safe-disabled subset when applicable
8. fresh changed-path/source verification
9. durable packet result
```

A packet may not close because its positive happy-path test passes while a cataloged negative remains absent.

## 6. Required backend test groups

### 6.1 Data/schema/unit

Required cases include:

```text
piece.record.v2 field/version validation
source role/stage validation
private default and unknown visibility rejection
content payload reconstruction equality
format and visual eligibility
hash canonicalization
body-free receipt/ledger serializers
public projection allowlist
error code stability
```

### 6.2 API contract

Required cases include:

```text
Bearer owner only
raw payload/client user_id/tier/limit rejected
Idempotency-Key required where defined
expected revision/version required
coarse errors without source detail
concealed non-owner 404 equivalence
old Q&A fields absent
old Q&A routes retired
contract headers and request ID present
feature-disabled response stable
```

### 6.3 Transaction and concurrency

Use an isolated database that supports the actual SQL/RPC semantics.

Required fault injection points:

```text
after preview lock
before month lock
after quota check
between record transition and ledger insert
before delete child purge
after delete receipt insert
before physical record delete
```

Every injection verifies all-or-nothing terminal state.

Concurrency matrix:

```text
Free remaining 1 / concurrent 2
Plus remaining 1 / concurrent 3
same idempotency key concurrent 2
same preview / different keys concurrent 2
visibility toggle / delete race
public read / public->private race
```

### 6.4 Access/RLS

Identity matrix:

```text
owner
allowed viewer
unrelated authenticated viewer
anonymous
service process with missing application authorization decision
```

Object matrix:

```text
preview_draft
saved private
saved public
public then private
physically deleted
missing
```

Assertions cover base-table grants, forced RLS defense, API concealment and no metrics/read/resonance side effect on denied access.

## 7. Migration test matrix

| Packet | Required database states | Required assertions |
|---|---|---|
| M0 | repository only | migration ledger/path/hash exists; no DDL |
| M1 | predecessor catalog | legacy bridge definition; every shared caller rebound; `public.pieces` unchanged |
| M2 | fresh + predecessor | dedicated family, constraints/indexes, RLS forced, grants exact |
| M3 | M2 | RPC search path/grants, staging projection, atomic negative tests |
| M4 | M3 | disabled app integration; user-visible new path absent |
| M5 | M4 | one clean cutover; old caller/route/card exact0; new view safe |
| M6 | verified M5 | body-free exact old identity packet and counts |
| M7 | isolated pre-release copy | exact IDs only; excluded rows unchanged; post-delete captured IDs exact0 |
| M8 | verified M7 | obsolete consumer exact0 before code/object removal |

Migration tests run both from a clean schema and from the pinned predecessor shape where applicable. A generated SQL snapshot alone is not sufficient.

## 8. RN tests

### Static/source contract

The current Node suite can prove import/wire/field absence and stable labels. PCE-9D/9F must replace old assertions with new ones, including:

```text
no previewEmotionPiece raw payload builder
no publishEmotionPiece/cancelEmotionPiece old operations
no question/reflection/q_key/q_instance normalization
Piece CTA requires source identity + terminal Emlis state
all Piece feature checks pass fallback false
private is explicit default
owner history uses owner API
Nexus card accepts Piece v2 fields only
external-copy warning present
```

### State/component logic

The chosen harness must exercise:

```text
preview ready/adjusted/unavailable
format/visual mutation revision replacement
stale preview conflict
quota exhausted
save response loss and same-key retry
visibility conflict/refetch
safe-disabled response
export unavailable
long text scroll and action visibility
accessibility selected/disabled states
```

PCE-8 decides whether existing Node tests are extended or a component harness is introduced. A new test framework is not added merely because it is common practice; it must close a matrix gap that source tests cannot.

## 9. Renderer tests

Deterministic logic tests cover:

```text
recipe canonicalization/hash
catalog/version resolution
format-template mapping
plan capability matrix
fixed canvas/output profile
font candidate sequence and floor
no clipping/ellipsis/content deletion success
Japanese/English/emoji/long-token measurement fixtures
forbidden export-field allowlist
old version explicit failure
Level 0–2 equivalence projection
```

PNG byte identity across iOS/Android is diagnostic, not a release requirement. Visible content, block order, identity, fit and forbidden metadata are requirements.

## 10. Monitoring and rollback tests

Monitoring tests capture every sink:

```text
backend structured log
alert marker
optional Slack payload builder
RN client event body
client-event backend sanitizer
request performance log fields
```

They insert all forbidden canaries and assert absence from serialized payloads, not only from selected fields.

Rollback tests verify each playbook from the feature-flag contract:

```text
new writes stop at server
RN may be stale but cannot bypass server
existing owner read/delete remains according to state
public incident state conceals public records
no old Q&A route is re-enabled
no data deletion is caused by a flag
monitoring emits only body-free rollback events
```

## 11. Body-free result schema

Every automated run result uses a body-free summary.

```text
schema_version
suite_id
run_id
repository head/tree
test node IDs or ordered-list hash
collected/executed/passed/failed/skipped counts
RED IDs covered
causal signatures
runtime identity
DB schema/migration identity when applicable
terminal state
```

Exact Piece/raw/Emlis/Analysis bodies, production IDs, tokens, full exception payloads and local secret paths are excluded.

## 12. Release gates

### Packet completion

```text
packet RED IDs:
  GREEN

unexpected failures:
  exact0

required skips/xfails:
  exact0

approved changed paths only:
  true
```

### PCE-U1 entry

```text
PCE-9A..9F bounded suite results present
new Piece E2E staging result present
private/public blocker exact0
body leak exact0
old Q&A residual exact0
rollback suite GREEN
```

### PCE-11

Automated suites are GREEN before asking Mash to perform actual-device checks. The device packet is bounded to observations that code-side evidence cannot provide.

### Release candidate / U2

```text
PCE7-R001..R040 GREEN
unresolved BLOCKER exact0
unresolved MAJOR exact0
required actual-device rows complete
monitoring/rollback drill evidence present
```

## 13. Non-effects and unknowns

PCE-7 does not choose the exact DB test container, RN component-test library, CI provider, migration runner or device farm. Those are implementation/tooling decisions constrained by this matrix and frozen in PCE-8/PCE-9 packets.

```text
test files created:
  exact0

tests executed:
  exact0

CI changed:
  exact0

runtime/DB effect:
  exact0
```

## 14. STOP conditions

- A matrix claim is assigned to a weaker suite that cannot observe the behavior.
- Live production data or irreversible production DB operations are required.
- DB concurrency/RLS is marked GREEN through mocks only.
- Actual-device rows are declared complete through screenshots or inference not supplied by Mash.
- Independent audit evidence is required but substituted by repeated single-agent review.
- Test framework maintenance becomes larger than the product invariant it is meant to prove without closing a real gap.

## 15. Completion

```text
PIECE_TEST_MATRIX_V1_FIXED
SUITE_CLASSES_EXACT13
RED_TO_SUITE_OWNERSHIP_FIXED
ACTUAL_DB_TRANSACTION_AND_RLS_TEST_REQUIRED
MIGRATION_M0_M8_MATRIX_FIXED
RN_STATIC_COMPONENT_DEVICE_SEPARATION_FIXED
MONITORING_ROLLBACK_SINK_COVERAGE_FIXED
BODY_FREE_RESULT_SCHEMA_FIXED
PCE7_TEST_IMPLEMENTATION_EXACT0
PCE7_TEST_EXECUTION_EXACT0
PRODUCTION_EFFECT_EXACT0
PCE7_COMPLETE_DESIGN_ONLY
```
