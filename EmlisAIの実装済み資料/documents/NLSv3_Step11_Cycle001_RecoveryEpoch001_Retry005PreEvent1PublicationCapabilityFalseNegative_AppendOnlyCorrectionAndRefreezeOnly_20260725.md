---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch001_retry005_pre_event1_publication_capability_false_negative_append_only_correction_and_refreeze_only
title: "NLS v3 Step 11 Cycle 001 Recovery Epoch 001 RETRY005 pre-event1 publication capability false-negative append-only correction and refreeze"
revision_date: "2026-07-25"
status: "RETRY005_HISTORICAL_FALSE_NEGATIVE_STOP_RETAINED_CAPABILITY_BLOCKER_SUPERSEDED_AUTHORITY_STOP"
body_free: true
automatic_progression: false
cycle001_status: "NOT_ACCEPTED"
---

# 1. Authority and purpose

Approved authority:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_RETRY005_PRE_EVENT1_PUBLICATION_CAPABILITY_FALSE_NEGATIVE_APPEND_ONLY_CORRECTION_AND_REFREEZE_ONLY
```

Mash approved two separate actions on 2026-07-25:

1. correct RETRY005's false STOP reason without deleting or rewriting history;
2. use the registered SSH key and perform a new retry as a separate formal
   verification.

This document performs action 1 only. It does not reopen or rerun RETRY005,
and it does not issue event 1, a reservation, an attempt, an accepted receipt,
Step receipts, all11, a manifest, or event 2.

# 2. Entry pins

| repository | entry ref |
|---|---|
| `MassyuRed/Karen-Diary` | `700f749f5149cac1f8bd4bab8a364d524a56985b` |
| `MassyuRed/Cocolon` | `9c2ce2fcb89179de346c29bbcb594d82e58fa10b` |
| `MassyuRed/mashos-api` | `191e9d8be63132f10f94e2b2f54c6bae94ce1f07` |

Cocolon entry tree:

```text
7445738d4c04b9d5457939d7b6a4ef1ac24d5096
```

mashos-api entry tree:

```text
e68df6587b8cb674456b3bc9bceb23e0699f33aa
```

No entry-head drift was found before this correction result was created.

# 3. Immutable RETRY005 records

The following records remain byte-immutable and retrievable.

| record | commit | Git blob | raw SHA-256 |
|---|---|---|---|
| result | `bece11adbd3d72c997662770d94c7992b9a04265` | `e4d93be1827833cf04b7db2751f1a1f0dd5ad7ca` | `e460f5a8f730977e23e70253d21eb5503323317c2a31585aba5fac41ae6de4a7` |
| body-free receipt | `8f315bcd6dd8cbc11d63ff1b10e93eb9bd6fe3f2` | `ff5140f75702472f7566f68504ecf03bb9ed3393` | `cc16fd96efae6df8ea20ec686be71321d060fc375f7ee878c04f8a659438c75c` |
| handoff | `16e081705b7012187f525d32b328a1844d7312da` | `d8ee3f4b84c89ec137ba4c204eb12e92543c1c38` | `fe8ff2a3c091e90f45aeb583e932a6619f9855bae78e4f476baba8325494c618` |

The original receipt canonical SHA-256 remains:

```text
1c19edc14b9848e8915b3b47ec1b42ec758c6fdc46894a6bb4af474705eb9aaa
```

No prior file, blob, commit, or statement is rewritten by this authority.

# 4. False-negative diagnosis

## 4.1 What RETRY005 recorded

RETRY005 recorded the following capability values or derived states:

```text
capability_admission.base_tree_read_proved = false
capability_admission.complete_recursive_tree_fetch_available = false
capability_admission.expected_old_sha_lease_proved = false
capability_admission.local_authenticated_cocolon_git_receive_pack_available = false
capability_admission.private_cocolon_git_ls_remote_authenticated = false
capability_admission.stop_code = PUBLICATION_REF_UPDATE_FAILED_STOP
capability_admission.stop_reason =
  EVENT1_ATOMIC_EXPECTED_OLD_SHA_LEASE_TRANSPORT_NOT_PROVED
next_boundary.authenticated_capability_required =
  EXPLICIT_EXPECTED_OLD_SHA_API_OR_AUTHENTICATED_GIT_RECEIVE_PACK_EXACT_LEASE
state.g2 =
  CONTRACT_RECONCILIATION_IMPLEMENTED_TARGETED_EXACT40_GREEN_
  FORMAL_RETRY005_PUBLICATION_TRANSPORT_BLOCKED
```

## 4.2 What was actually available

Before the RETRY005 result commit:

- the Work SSH keypair and strict `known_hosts` material had already been
  created;
- the private key file birth time precedes the RETRY005 result commit;
- its derived public-key fingerprint was
  `SHA256:gCA4W3puVpLcATfGVc9f97n8l4allD0kzc5x5mml9OA`;
- Mash had registered the matching deploy key
  `Karen Work Cocolon Lease 2026-07-25` for `MassyuRed/Cocolon` with write
  access;
- GitHub SSH 443 authentication and the official host-key match had been
  confirmed;
- authenticated `git ls-remote` had returned the then-current Cocolon main
  `75d1b02b5fa50969425ec307e353499074233f82`;
- full clone / commit / recursive tree / blob materialization had succeeded;
- an exact current-H0 force-with-lease dry-run had been accepted; and
- a stale-H0 force-with-lease dry-run had been rejected.

RETRY005 did not consult or use that route. It tried local Git without
selecting the registered key and treated the resulting unauthenticated
failure as proof that no authenticated route existed.

That was a capability false negative and a process error. The key registration
was not preserved in `Cocolon_前提資料`, so the session-continuity ground truth
was missing when RETRY005 was executed.

# 5. Independent remeasurement and actual publication proof

The registered route was remeasured on 2026-07-25 without exposing credential
material.

## 5.1 Non-mutating capability checks

At Cocolon main
`94fe7bbdfd88f5b7899e530056b9ed9e46d0bdce`:

```text
authenticated ls-remote: PASS
base tree read: PASS
recursive tree / all blob fetch: PASS
git fsck missing-object detection: 0 issue
current-H0 exact lease dry-run: ACCEPTED
stale 75d1b02b... exact lease dry-run: REJECTED_STALE_INFO
remote ref change during dry-run checks: 0
```

## 5.2 Actual exact-lease publications

The same route then published the separate premise/rule correction checkpoint.

| transaction | expected old SHA | direct child | post-fetch result |
|---|---|---|---|
| continuity owner / rules | `94fe7bbdfd88f5b7899e530056b9ed9e46d0bdce` | `9f4d56d4c3b530b40dc5423d13c32f7f54d9e0c5` | head / parent / tree matched |
| latest snapshot reflection | `9f4d56d4c3b530b40dc5423d13c32f7f54d9e0c5` | `9c2ce2fcb89179de346c29bbcb594d82e58fa10b` | head / parent / tree matched |

This proves the authenticated receive-pack route, exact expected-old-SHA lease,
base-tree read, and complete post-fetch capability in the current Work
environment.

These later publications do not backfill a RETRY005 formal update. They prove
that RETRY005's claimed capability absence was false; they do not claim that
event 1 or any formal artifact was published during RETRY005.

# 6. Append-only supersession boundary

This correction supersedes only the RETRY005 capability-availability false
negative and its derived causal blocker:

```text
capability_admission.base_tree_read_proved
capability_admission.complete_recursive_tree_fetch_available
capability_admission.expected_old_sha_lease_proved
capability_admission.local_authenticated_cocolon_git_receive_pack_available
capability_admission.private_cocolon_git_ls_remote_authenticated
capability_admission.stop_code
capability_admission.stop_reason
evidence_class
next_boundary.authenticated_capability_required
state.formal_exact134
state.g2
state.p1_retry005
```

Corrected disposition:

```text
RETRY005_HISTORICAL_FALSE_NEGATIVE_STOP_RETAINED
CAPABILITY_BLOCKER_SUPERSEDED
FORMAL_RETRY_NOT_EXECUTED
NO_FORMAL_SUCCESS_BACKFILLED
```

The following original RETRY005 facts remain unchanged:

- the GitHub connector itself did not expose an explicit expected-old-SHA
  parameter;
- local `gh`, configured credential helper, and token were not available;
- the source publication module did not itself perform transport;
- no formal ref update was attempted or observed during RETRY005;
- `server_result_expected_old_sha_matched_and_updated_observable` remains
  false for RETRY005;
- `full_postfetch_tree_and_blob_proved` remains false for a RETRY005 formal
  publication because no such publication occurred;
- fixed formal path existing count remained 0;
- reservation / event 1 / event 2 / attempt / accepted / Step receipt /
  all11 / manifest counts remained 0;
- source baseline remained `UNLOCKED`;
- formal exact134 was not run;
- mashos-api changes remained 0;
- P2 remained not authorized; and
- Cycle001 remained `NOT_ACCEPTED`.

# 7. Rule and premise correction

The missing cross-session information is now owned by:

```text
Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md
```

The updated rules require:

- reading the registered non-secret identity before deciding transport
  availability;
- separating GitHub-side registration from current-session private-key
  availability;
- revalidating fingerprint, host, repository, live H0, full fetch, and exact
  lease every session;
- never recording secret material; and
- distinguishing prohibited unleased force / history rewrite from a separately
  approved exact expected-old-SHA lease to a verified direct child.

# 8. Facts, inference, and Karen opinion

## Confirmed facts

- The registered deploy key and matching Work key material existed before the
  RETRY005 result.
- RETRY005 did not select that key when it tested local Git.
- The matching route authenticates, reads the complete repository, rejects a
  stale lease, accepts the current exact lease, and has now completed two
  actual direct-child lease publications with post-fetch verification.
- RETRY005 issued no formal artifact and ran no exact134 test.
- All RETRY005 historical files and commits remain unchanged.

## Inference

The unauthenticated RETRY005 `git ls-remote` failure was caused by testing the
wrong local Git identity path, not by absence of a registered authenticated
route.

## Karen opinion

The STOP cause was wrong because Karen failed to use and preserve a capability
that Mash had already enabled. Keeping the old STOP files while adding this
correction is the only honest way to preserve both the mistake and the
corrected current reading. A new retry must start from a new live H0 and must
not pretend RETRY005 ran.

# 9. Final state and STOP

```text
RETRY005:
HISTORICAL_TERMINAL_FALSE_NEGATIVE_STOP_RETAINED

RETRY005_CAPABILITY_BLOCKER:
SUPERSEDED

RETRY005_FORMAL_EVENT / RESERVATION / EXACT134:
NOT_CREATED / NOT_CREATED / NOT_RUN

SOURCE_BASELINE:
UNLOCKED

SUCCESSFUL_STEP0_10_COMPLETION_RECEIPT_COUNT:
0

CYCLE001:
NOT_ACCEPTED

AUTOMATIC_PROGRESSION:
false

AUTHORITY_STOP
```

The new formal retry is a separate authority and uses a new entry H0. This
correction does not authorize reusing RETRY005's closed authority token.
