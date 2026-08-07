---
doc_id: piece_red_contract_catalog_20260808
title: "Piece RED contract catalog"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-7 Test / Monitoring / Rollback"
document_status: "PCE7_COMPLETE_DESIGN_ONLY"
contract_id: "piece.red_contract_catalog.v1"
source_cocolon_head: "cf14b503a4e5087b7ef33a82c8073a93517d5b60"
source_cocolon_tree: "4d64aba7bfe63aecf391a0ba3598589699cec6f1"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
source_roadmap_sha256: "2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939"
automatic_progression: false
production_effect: "exact0"
---

# Piece RED contract catalog

## 1. Purpose

PCE-7 freezes the failures that must be observable before the corresponding production owner is implemented. A RED is not progress by itself. It is useful only when it proves that a required safeguard is absent for the intended causal reason and gives the implementation packet one bounded target.

```text
contract:
  piece.red_contract_catalog.v1

required release-blocking negative contracts:
  exact40

PCE-7 test implementation:
  exact0

PCE-7 runtime execution:
  exact0
```

The catalog binds PCE-1 through PCE-6. It does not replace the exact test paths and work packages that PCE-8 will freeze.

## 2. Valid RED definition

A RED is valid only when all conditions hold.

1. The test is collected and its call phase runs.
2. The expected failure signature is the cataloged Piece invariant, not import, collection, fixture, network, credential, package, timeout or environment failure.
3. The production owner under test is absent or intentionally incomplete.
4. No production data, private body or external irreversible operation is used.
5. The test has an exact future GREEN owner.
6. `skip`, `xfail`, broad exception swallowing, snapshot regeneration and assertion weakening do not count as GREEN.
7. After GREEN, the negative assertion remains in the suite.

```text
collection-only:
  RED credit exact0

infrastructure failure:
  RED credit exact0

wrong causal signature:
  RED credit exact0

expected invariant failure:
  RED credit exact1
```

## 3. Severity

```text
BLOCKER:
  privacy exposure
  source/body mixing
  record or quota duplication/corruption
  inaccessible-record existence leak
  destructive migration scope error
  old Q&A release reachability
  rollback to old Q&A
  monitoring body leak

MAJOR:
  required visual/tier/re-export/accessibility behavior is wrong
  but no confirmed private-body exposure or destructive data effect occurs
```

Every catalog row is a release blocker until GREEN. Severity distinguishes incident handling, not whether the test may be omitted.

## 4. Source and canonical-content REDs

| ID | Severity | Failure to freeze | Machine assertion | Earliest owner |
|---|---|---|---|---|
| `PCE7-R001` | BLOCKER | Emlis visible body becomes Piece text/source | canary Emlis body absent from record/API/render output | PCE-9B/9C |
| `PCE7-R002` | BLOCKER | raw input is stored, returned or rendered as Piece | raw canary absent from Piece family, response and PNG input | PCE-9A/9B/9E |
| `PCE7-R003` | BLOCKER | supplemental answer overwrites original source role | lineage retains original and distinct supplemental identities | PCE-9C |
| `PCE7-R004` | BLOCKER | Analysis inference/simulation becomes Piece source | Analysis canary absent; source role rejects Analysis identities | PCE-9C |
| `PCE7-R005` | BLOCKER | preview accepts raw memo/emotion payload or client owner ID | request model rejects forbidden keys and ignores no client ownership | PCE-9A/9C |
| `PCE7-R006` | BLOCKER | preview text differs from saved text | preview text/hash equals saved text/hash exact | PCE-9A/9B |
| `PCE7-R007` | BLOCKER | saved text differs from export-visible text | saved text/hash equals renderer input and reconstructed export body | PCE-9E |
| `PCE7-R008` | BLOCKER | structured payload and flat Piece text disagree | canonical reconstruction equals `piece_text` and both hashes verify | PCE-9A/9B |

## 5. Visibility, access and concealment REDs

| ID | Severity | Failure to freeze | Machine assertion | Earliest owner |
|---|---|---|---|---|
| `PCE7-R009` | BLOCKER | private Piece appears in Nexus/list/unread | private ID absent from all public projections and state tables | PCE-9A/9F |
| `PCE7-R010` | BLOCKER | public Piece is visible outside current viewer relation | unauthorized viewer receives concealed not-found and no metrics effect | PCE-9A/9F |
| `PCE7-R011` | BLOCKER | public→private remains in feed/detail/cache | source-of-truth read denies immediately; projection invalidates | PCE-9A/9F |
| `PCE7-R012` | BLOCKER | private save creates friend notification, unread or resonance state | related public-state rows/events exact0 | PCE-9A/9F |
| `PCE7-R013` | BLOCKER | missing/unknown visibility becomes public | missing resolves private; unknown rejected | PCE-9A |
| `PCE7-R014` | BLOCKER | service-role possession is treated as authorization proof | service call without owner/viewer decision is denied | PCE-9A/9F |
| `PCE7-R015` | BLOCKER | private/deleted/inaccessible/missing responses reveal different existence states | same public status/code/body shape for non-owner | PCE-9A/9F |
| `PCE7-R016` | BLOCKER | owner history reuses public feed and leaks private rows through broad query | owner API requires owner auth and public feed never supplies private rows | PCE-9A/9D |

## 6. Quota, concurrency and terminal-operation REDs

| ID | Severity | Failure to freeze | Machine assertion | Earliest owner |
|---|---|---|---|---|
| `PCE7-R017` | BLOCKER | preview or preview mutation consumes quota | quota ledger delta exact0 | PCE-9A |
| `PCE7-R018` | BLOCKER | visibility change, re-export or failed export consumes quota | same ledger identity/count before and after | PCE-9A/9E |
| `PCE7-R019` | BLOCKER | concurrent saves exceed Free/Plus limit | serialized concurrent attempts yield at most remaining slots | PCE-9A |
| `PCE7-R020` | BLOCKER | saved record and quota event commit separately | injected failure leaves both committed or both absent | PCE-9A |
| `PCE7-R021` | BLOCKER | same save idempotency key creates duplicate Piece/quota | same Piece ID and consumption ID returned; counts unchanged | PCE-9A |
| `PCE7-R022` | BLOCKER | delete refunds/cascades quota consumption | record absent; immutable quota event remains | PCE-9A |
| `PCE7-R023` | BLOCKER | response-loss retry creates a new record | terminal result replayed for same idempotency identity | PCE-9A |
| `PCE7-R024` | BLOCKER | client-provided tier or limit controls quota | server entitlement overrides/rejects client values | PCE-9A |
| `PCE7-R025` | BLOCKER | visibility conflict silently overwrites a newer row | stale `expected_row_version` returns conflict and preserves current row | PCE-9A/9D |
| `PCE7-R026` | BLOCKER | delete leaves canonical body or record-owned state | record/metrics/reads/resonances absent in one terminal transaction | PCE-9A |

## 7. Visual, export and tier REDs

| ID | Severity | Failure to freeze | Machine assertion | Earliest owner |
|---|---|---|---|---|
| `PCE7-R027` | BLOCKER | saved record lacks recipe/catalog/template/renderer/layout versions | all required version fields non-null and supported | PCE-9A/9E |
| `PCE7-R028` | MAJOR | long text clips, ellipsizes, deletes content or goes below font floor | layout result fails instead of producing invalid success | PCE-9E |
| `PCE7-R029` | BLOCKER | old recipe silently renders with latest catalog/renderer fallback | unsupported version returns explicit failure; no substitution | PCE-9E |
| `PCE7-R030` | MAJOR | Free/Plus/Premium theme, ratio or branding boundary is wrong | plan matrix exact; semantic quality/resolution equal | PCE-9D/9E |
| `PCE7-R031` | BLOCKER | export contains raw/internal/profile/metric/visibility data or EXIF/GPS | canaries and forbidden metadata absent from renderer input/output | PCE-9E |
| `PCE7-R032` | BLOCKER | same saved record re-export changes canonical text/format/recipe identity | Level 0–2 reproducibility holds | PCE-9E |

## 8. Legacy, migration, monitoring and rollback REDs

| ID | Severity | Failure to freeze | Machine assertion | Earliest owner |
|---|---|---|---|---|
| `PCE7-R033` | BLOCKER | old Q&A generation/compat route is reachable after cutover | route registry and RN caller search exact0; requests return retired result | PCE-9A/9F |
| `PCE7-R034` | BLOCKER | old Q&A card renders new Piece or new card accepts Q&A IDs/fields | new card rejects question/q_key/q_instance/reflection identities | PCE-9D/9F |
| `PCE7-R035` | BLOCKER | `public.pieces` changes meaning before legacy/shared caller exact0 | migration precondition fails while any old caller remains | PCE-9A migration |
| `PCE7-R036` | BLOCKER | destructive cleanup touches `create`, `generated` or unrelated state | frozen exact ID set only; excluded counts byte/count stable | M7 separate authority |
| `PCE7-R037` | BLOCKER | monitoring contains Piece/raw/Emlis/Analysis body, content hash, raw IDs or free-form error text | forbidden canaries absent from captured logs/events/alerts | PCE-9A/9D/9E/9F |
| `PCE7-R038` | BLOCKER | missing/stale flag fails open or RN flag is the only gate | missing Piece flags false; backend independently denies | PCE-9A/9D/9F |
| `PCE7-R039` | BLOCKER | rollback restores old Q&A or allows new writes after cutoff | safe-disabled state, write delta exact0, old route unreachable | PCE-9A/9D/9F |
| `PCE7-R040` | BLOCKER | untracked migration/catalog drift is ignored | migration identity/catalog guard fails before DDL/data operation | PCE-9A migration |

## 9. Test-data privacy

All automated REDs use synthetic canaries. Production user bodies, production IDs, access tokens and live destructive operations are prohibited.

Required canary classes:

```text
RAW_INPUT_CANARY
EMLIS_VISIBLE_BODY_CANARY
EMLIS_INTERNAL_CANARY
ANALYSIS_INFERENCE_CANARY
SUPPLEMENTAL_BODY_CANARY
PII_EMAIL_CANARY
TOKEN_CANARY
PRIVATE_PIECE_CANARY
MONITORING_BODY_CANARY
```

A canary may be stored only inside the isolated test process/database and must be removed by test teardown. Public GitHub fixtures contain synthetic strings only.

## 10. GREEN and regression policy

For each row:

```text
before owner implementation:
  valid causal RED required

after owner implementation:
  targeted GREEN required

before packet completion:
  predecessor Piece regressions GREEN

before PCE-U1:
  all implemented-row suites GREEN
  unresolved required RED exact0

before release:
  PCE7-R001..R040 GREEN
  skip / xfail / quarantine exact0
```

A test may move to a different file in PCE-8, but its ID, invariant and causal meaning remain stable. Renaming an invariant to avoid a failure is prohibited.

## 11. Actual-device separation

The following are not honestly replaceable by static/unit GREEN:

```text
iOS/Android font and line break
emoji/glyph rendering
share sheet and permission
saved PNG quality
low-memory capture
screen-reader announcement and touch behavior
```

PCE-9E creates the device packet; PCE-11 records Mash actual-device evidence. Automated tests must still prove input/output identity, no clipping decision, metadata absence and stable accessibility labels before device work.

## 12. Current actual gap

Current source contains old Q&A Piece contract tests and RN source-contract tests. It also contains generic client-event redaction tests. It does not contain PCE-7 RED implementations, new Piece migration tests, transaction-concurrency evidence, Piece-specific monitoring allowlist tests, rollback drills or actual-device evidence.

```text
PCE-7 RED test files:
  exact0

PCE-7 tests executed:
  exact0

production effect:
  exact0
```

## 13. STOP conditions

- A required RED can only be produced by using production private bodies.
- A DB invariant is simulated in memory when actual transaction semantics are the claim.
- Collection/import/environment failure is presented as causal RED.
- The only recovery path is old Q&A restoration.
- An invariant cannot be assigned to one bounded future owner.
- A test requires PCE-U1 independent review to be honest; it is queued for U1 rather than fabricated in Pro.

## 14. Completion

```text
PIECE_RED_CATALOG_V1_FIXED
REQUIRED_NEGATIVE_CONTRACTS_EXACT40
SOURCE_BODY_NONMIXING_RED_FIXED
PRIVATE_ACCESS_CONCEALMENT_RED_FIXED
ATOMIC_QUOTA_IDEMPOTENCY_RED_FIXED
VISUAL_REEXPORT_RED_FIXED
LEGACY_MIGRATION_ROLLBACK_RED_FIXED
MONITORING_BODY_LEAK_RED_FIXED
ACTUAL_DEVICE_SEPARATION_FIXED
TEST_IMPLEMENTATION_EXACT0
TEST_EXECUTION_EXACT0
PRODUCTION_EFFECT_EXACT0
PCE7_COMPLETE_DESIGN_ONLY
```
