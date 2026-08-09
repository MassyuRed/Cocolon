# NLS v3 Step11 Cycle001 G4 B6 Remediation Design Freeze RED-only — Additive Correction Handoff

```text
PRIOR G4 TECHNICAL CREDIT: WITHDRAWN_NONCREDIT
PRIOR G4 LIFECYCLE: CLOSED_NOT_REOPENED
ADDITIVE CORRECTION: CLOSED_CONSUMED_CAUSAL_RED_PASS
CORRECTED G4: CLOSED_CONSUMED_CAUSAL_RED_PASS
CORRECTED ORDERED EXACT24: 22 PASS / 2 CAUSAL_RED / 0 UNEXPECTED / 0 ERROR
ORDERED-LIST SHA-256: ea5f4afb819210eac771db02287c02475afb19cf9cff0408c7ce3dd866df10b9
MASHOS-API CORRECTION COMMIT: b0a8c70e5cec08581678b98f2e21571d17674d91
CORRECTED TEST BLOB: 25f302a35d9e00df96f69d2eca26cc3caccc0e35
PRODUCTION CHANGE: exact0
G5 AUTHORITY: RECEIVED_EXACT1_PENDING_G4_DURABLE_POSTVERIFY
G6: SEPARATE_APPROVAL_REQUIRED_NOT_STARTED
CYCLE001: NOT_ACCEPTED
AUTOMATIC PROGRESSION: false
```

## Corrected closure

The additive correction preserves the first408,068 protected-test bytes and replaces only the invalid G4 suffix. The corrected suffix is23,954 bytes under the frozen24,000-byte cap. Static pytest definitions are52, new test definitions are0, and the existing G3 body-recovery exact2 are strengthened in place.

The old full-production-blob pin is gone. The future-GREEN boundary is the G3 window: Natural Surface prefix537,842 is immutable; the marker suffix is capped at11,090; `_rc0031_rt_plan`, signatures, constants, and the body-masked remainder are immutable; and only the exact3 approved function bodies may change.

The fresh corrected run used the ordered exact24 with material SHA-256 `ea5f4afb819210eac771db02287c02475afb19cf9cff0408c7ce3dd866df10b9`. The first22 nodes passed. Only the existing exact2 failed:

1. `REACHABLE_DIMENSION_EQUIVALENCE_LOCUS_NOT_PROVED`
2. `HEAD_DOMINANT_TYPED_ATTACHMENT_NOT_PROVED`

The projection is exactly `22 PASS / 2 CAUSAL_RED / 0 UNEXPECTED / 0 ERROR`; wall time903.38 seconds; target invocation1; retry/fallback/interpreter switch0. Full exact52 and exact100 were not run.

GitHub reflection of the protected test is complete and postverified: parent `dab99efc12907fed82185ed3f9b5a5ba260094c2`, fast-forward commit/current main `b0a8c70e5cec08581678b98f2e21571d17674d91`, remote blob `25f302a35d9e00df96f69d2eca26cc3caccc0e35`, changed-path union exact1, unauthorized0, deletion0, rename0.

## Durable owner identities

| role | path | bytes | LF | SHA-256 | Git blob |
|---|---|---:|---:|---|---|
| correction Addendum | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4_B6RemediationDesignFreezeRedOnly_AdditiveCorrection_Addendum_20260809.md` | 7,719 | 137 | `fe5cae6accc37de6569b1a100bc77715dd0fffe74e2d49d3870702853da9460f` | `6f0fe72ccdb8922cb0db6f7962f42de6758d1d67` |
| body-free Receipt | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4_B6RemediationDesignFreezeRedOnly_AdditiveCorrection_BodyFree_Receipt_20260809.json` | 5,708 | 144 | `b01885c14555dcfeb2d1caf8421346a3e684365728f2eeb7ad221fbe2e0d7056` | `81bfa8c39d17340d71de46e66f74d23cf6e4ed6b` |
| correction Handoff | this path | final owner identity is not embedded to avoid a hash cycle | final owner identity is not embedded to avoid a hash cycle | final owner identity is not embedded to avoid a hash cycle | final owner identity is not embedded to avoid a hash cycle |

Corrected G4 becomes durably final only when this new3 plus the append-only Plan, `07_latest_snapshot_diff.md`, and `08_cycle001_current_state.md` are all present on GitHub with prepared bytes, the Cocolon write group changed-path union is exact6/unauthorized0, and latest `main` contains all six. Historical G4 artifacts are not edited.

## G5 entry

Mash's same direct instruction separately approves continuation through G5 after corrected G4 durable refreeze. G5 activation occurs only after the exact6 Cocolon postverification above. Its entry pins are:

```text
mashos-api commit: b0a8c70e5cec08581678b98f2e21571d17674d91
protected test blob: 25f302a35d9e00df96f69d2eca26cc3caccc0e35
production preimage blob: 1c19b6c293e20a9094b9180fded8c167daaaf5eb
ordered exact24 SHA-256: ea5f4afb819210eac771db02287c02475afb19cf9cff0408c7ce3dd866df10b9
entry projection: 22 PASS / 2 causal RED
required exit projection: 24 PASS / 0 FAIL
```

G5 may change only the exact3 bodies in the one Natural Surface suffix. Protected test, fixture, sample, case rows, Catalog, Grounded Lexicalization, Reception/relation/source authority, Parser, Matcher, Hard Gate, API, DB, RN, public/shared runtime, and all other paths remain immutable. G5 machine GREEN is not Product Read PASS. G6 remains a separate approval boundary and is not started automatically.
