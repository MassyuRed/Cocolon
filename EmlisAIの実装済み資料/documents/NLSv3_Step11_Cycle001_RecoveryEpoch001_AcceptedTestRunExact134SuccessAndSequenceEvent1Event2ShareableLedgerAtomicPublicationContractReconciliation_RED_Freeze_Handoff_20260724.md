---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch001_contract_reconciliation_red_freeze_handoff
title: "NLS v3 Step 11 Cycle001 Recovery Epoch001 contract reconciliation RED freeze handoff"
recorded_on_jst: "2026-07-24"
body_free: true
---

# Contract reconciliation RED freeze handoff

## Completed authority

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_ACCEPTED_TEST_RUN_EXACT134_SUCCESS_AND_SEQUENCE_EVENT1_EVENT2_SHAREABLE_LEDGER_ATOMIC_PUBLICATION_CONTRACT_RECONCILIATION_RED_FREEZE_ONLY
```

The causal RED specification is frozen and reflected to mashos-api commit
`37ad05927b596322e3fa0791ca8cadd5a63b56c1`. The commit is a direct child of
fixed entry `78276950d0d7650968fe938bc63a6e13455a8d6c`, changes exact4 test
paths, and changes exact0 production-source paths.

## Confirmed handoff state

1. exact40 tests collect;
2. exact40 execution is intentionally `5 passed / 35 failed / 0 errors`;
3. accepted exact10 has `2 passed / 8 failed`;
4. sequence/publication exact27 has `1 passed / 26 failed`;
5. selected existing reconciliation exact3 has `2 passed / 1 failed`;
6. the RED failures identify current fail-open acceptance and missing future
   accepted owner/reservation/runner/verifier/downstream gates, sequence
   owner/verifier, atomic publisher, and closure paths;
7. `py_compile` for exact4 and `git diff --check` pass;
8. no formal run, reservation, event, receipt, private body, broad regression,
   or completion transition occurred.

## Future implementation owners required by the RED

The next implementation authority, if separately approved, must provide or
extend the following owner surfaces while preserving the frozen tests:

1. accepted exact134 attempt/receipt owner and exact negative-code sets;
2. one-shot reservation owner and published-reservation verification;
3. formal runner materialization of attempt v2;
4. independent accepted verifier with no owner-result trust;
5. Step/all11 accepted-v2 consumer gates;
6. common sequence event owner and independent verifier;
7. candidate/preflight/ref-update/post-fetch atomic publisher;
8. current closure path ownership for all new modules.

Production code must not alter the tests merely to obtain GREEN. A frozen-test
change needs a new, explicit authority and documented rationale.

## Fixed semantic decisions

1. `accepted=true` means exact134 full success: 134 collected, 134 executed,
   exact ordered outcomes, 134 passed, all non-success counts zero, exit0,
   timeout false, same-source clean binding, full provenance/environment/hash,
   and body-free validity.
2. One formal authority token permits exact1 reservation, even when a caller
   changes challenge input.
3. A reserved attempt with unknown/missing output is
   `ATTEMPT_CONSUMPTION_UNKNOWN_STOP`; it is not retried.
4. Failure/timeout/infra attempt records never become accepted, Step, all11,
   or event2 evidence.
5. P0 remains the existing `LEGACY_IMMUTABLE_P0_ANCHOR`; no new event0
   backfill is created.
6. Event1 is exact2 and event2 is exact15. Event2 supporting artifacts are
   exact14 with literal path/role/schema/logical-hash mapping.
7. Logical SHA-256, raw-file SHA-256, and Git blob SHA-1 are different
   identities and must not be substituted.
8. Publication phases are separate: supporting-set candidate,
   complete-bundle candidate, preflight, expected-old-SHA ref update, and
   post-publication verification.
9. Formal `PUBLISHED_ATOMIC` requires a verified base tree, expected-old-SHA
   lease, direct-child single-parent commit, sibling preservation, main
   reachability, and exact post-fetch bytes/hashes.

## Explicit interpretation to preserve or supersede

Karen interpreted the attempt-ID preimage labels
`source_baseline_event.event_sha256` and
`source_closure.source_commit_sha1` as literal dotted keys. Future
implementation should preserve this or explicitly supersede it under a new
authority; it must not silently reinterpret the preimage.

Publication failure codes are phase-specific:

- bundle/set/schema failure:
  `PUBLICATION_BUNDLE_INVALID`;
- immutable target-path conflict:
  `PUBLICATION_PATH_CONFLICT`;
- stale expected head or stale T0:
  `PUBLICATION_HEAD_DRIFT_STOP`;
- plan/capability/direct-child/lease failure:
  `PUBLICATION_REF_UPDATE_FAILED_STOP`;
- partial/reachability/post-fetch failure:
  `PUBLICATION_POSTVERIFY_CONFLICT_STOP`.

## Stop conditions

Stop without issuing formal artifacts if any of the following is true:

- production implementation authority is absent;
- frozen RED tests are changed without separate approval;
- reservation cannot be proved published before runner start;
- same-authority reservation already exists;
- current source/tree/root is dirty, stale, or inconsistent;
- event1 is not published and verified before formal run/event2;
- base-tree read or expected-old-SHA lease capability is unavailable;
- target commit is not a verified direct child with one parent;
- any exact2/exact15 path is missing, extra, overwritten, or partially visible;
- owner and independent verifier disagree;
- post-fetch tree/blob/raw/logical identity is not exact;
- any request attempts automatic progression to formal P1/P2/Cycle acceptance.

## Current immutable state

```text
G1:
IMPLEMENTATION_GREEN_CURRENT_STEP_RECEIPTS_NOT_ISSUED_NOT_COMPLETED

G2:
CAUSAL_RED_FROZEN_IMPLEMENTATION_NOT_AUTHORIZED

STEP5:
TARGETED_EXACT7_GREEN_FORMAL_COMPLETION_NOT_COMPLETED

SUCCESSFUL_STEP0_10_COMPLETION_RECEIPT_COUNT:
0

SOURCE_BASELINE:
UNLOCKED

SEQUENCE_EVENT_1 / SEQUENCE_EVENT_2:
NOT_CREATED / NOT_CREATED

FORMAL_TEST_RUN_RESERVATION_COUNT:
0

FORMAL_EXACT134:
NOT_RUN_PRE_EVENT1_CONTRACT_STOP

BROAD_REGRESSION:
NOT_RUN_NOT_CLAIMED

P1_RETRY002:
ADMISSION_STOPPED_NOT_COMPLETED

P1_RETRY003:
PRE_EVENT1_CONTRACT_NONCONFORMANCE_STOPPED_NOT_COMPLETED

FUTURE_P1 / P2:
NOT_AUTHORIZED / NOT_AUTHORIZED

CYCLE001:
NOT_ACCEPTED

AUTOMATIC_PROGRESSION:
false

AUTHORITY_STOP
```

## Separate approval needed

Reserved formal P1 token; not approved, active, or committed:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_SOURCE_BASELINE_AND_STEP0_10_COMPLETION_RECEIPT_GENERATION_AND_VERIFICATION_RETRY004_ONLY
```

Exactly one next candidate:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_ACCEPTED_TEST_RUN_EXACT134_SUCCESS_AND_SEQUENCE_EVENT1_EVENT2_SHAREABLE_LEDGER_ATOMIC_PUBLICATION_CONTRACT_RECONCILIATION_IMPLEMENTATION_AND_TARGETED_GREEN_ONLY
```

That candidate does not include formal reservation/event/receipt issuance,
formal exact134, formal P1 token commitment, P2, fresh batch, exact100,
Product Read, correction, B6, or Cycle001 acceptance. STOP.
