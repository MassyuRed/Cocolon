---
doc_id: nls_v3_step11_cycle001_recovery_epoch001_p1_retry004_pre_event1_publication_lease_capability_stop
title: "NLS v3 Step 11 Cycle 001 Recovery Epoch 001 P1 retry004 pre-event1 publication lease capability STOP"
revision_date: "2026-07-25"
status: "P1_RETRY004_PRE_EVENT1_EXPECTED_OLD_SHA_LEASE_CAPABILITY_STOP_AUTHORITY_STOP"
document_authority: "NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_SOURCE_BASELINE_AND_STEP0_10_COMPLETION_RECEIPT_GENERATION_AND_VERIFICATION_RETRY004_ONLY"
body_free: true
automatic_progression: false
cycle001_status: "NOT_ACCEPTED"
---

# 1. Authority and decision

Mash approved:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_SOURCE_BASELINE_AND_STEP0_10_COMPLETION_RECEIPT_GENERATION_AND_VERIFICATION_RETRY004_ONLY
```

The authority stopped at pre-event1 publication-capability admission.

```text
STOP_CODE:
PUBLICATION_REF_UPDATE_FAILED_STOP

STOP_REASON:
EVENT1_ATOMIC_EXPECTED_OLD_SHA_LEASE_TRANSPORT_NOT_PROVED

POSITION:
PRE_EVENT1

AUTHORITY_STOP
```

No event, formal reservation, challenge, attempt, formal exact134 run, accepted
receipt, Step receipt, all11 chain, or atomic manifest was created.

# 2. Fresh entry

| repository | fixed entry |
|---|---|
| `MassyuRed/Karen-Diary` | `700f749f5149cac1f8bd4bab8a364d524a56985b` |
| `MassyuRed/Cocolon` | `bcf9aa225f018dc6cfa3c29cfa9c6792e356e242` |
| `MassyuRed/mashos-api` | `191e9d8be63132f10f94e2b2f54c6bae94ce1f07` |
| mashos-api tree | `e68df6587b8cb674456b3bc9bceb23e0699f33aa` |

The three heads matched the completed implementation handoff. No entry drift
was found during admission.

The local ordinary mashos-api worktree has the same tree but a synthetic commit
identity. It was not used as a formal source. A future formal run must use a
clean detached materialization of the actual GitHub commit.

# 3. Pre-event1 path and replay checks

The design-fixed formal target set was checked at the Cocolon entry:

```text
event1 exact2 paths:
ABSENT / ABSENT

event2 exact15 paths:
ALL ABSENT

total fixed formal paths checked:
17

existing fixed formal path count:
0
```

The reservation namespace search found no published formal reservation
artifact. Mentions inside design documents are not reservation artifacts.

```text
FORMAL_TEST_RUN_RESERVATION_COUNT:
0

FORMAL_ATTEMPT_COUNT:
0

AUTHORITY_CHALLENGE_ID:
NOT_CREATED

ATTEMPT_ID:
NOT_CREATED
```

# 4. Required publication capability

The frozen reconciliation design and both production validators require the
following exact transport capability before event1:

```json
{
  "base_tree_read": true,
  "expected_old_sha_lease": true,
  "single_ref_update": true
}
```

The event1 exact2 publication must additionally prove:

```text
write_mode:
SINGLE_TREE_SINGLE_COMMIT_EXPECTED_OLD_SHA_LEASE

expected_old_sha:
current Cocolon main H0

target parent exact1:
H0

target:
verified direct child of H0

server result:
EXPECTED_OLD_SHA_MATCHED_AND_UPDATED
```

After the ref update, the owner and independent verifier must re-fetch and
verify head, parent, tree, exact changed paths, every blob byte, Git blob SHA-1,
raw SHA-256, and logical artifact SHA-256.

The normative implementation points are:

- `validate_recovery_epoch001_atomic_publication_preflight`;
- `validate_recovery_epoch001_atomic_ref_update_plan`;
- `validate_recovery_epoch001_atomic_publication_result`; and
- the corresponding independent verifier implementations in
  `emlis_nls_v3_recovery_epoch001_closure_receipt_verify.py`.

# 5. Confirmed capability mismatch

The production atomic-publication module is intentionally inert. Its module
contract states that it has no transport or ref-write capability, and its
normal command entry exits with:

```text
inert contract module; no publication transport exists
```

The available GitHub connector exposes:

```text
github_update_ref(
  branch_name,
  sha,
  force
)
```

It does not expose `expected_old_sha`, an equivalent expected-head OID, or a
server observation proving `EXPECTED_OLD_SHA_MATCHED_AND_UPDATED`.

The connector also exposes tree creation but no full base/target tree read
interface sufficient to prove `base_tree_read=true`, sibling preservation, and
post-fetch target-tree equality.

The local environment has no `gh` executable, configured Git remote,
credential helper, or authenticated Git receive-pack route. Therefore the
design-authorized alternative:

```text
git push --force-with-lease=refs/heads/main:<H0>
```

cannot be truthfully executed or observed from this environment.

Treating `update_ref(force=false)` as CAS, declaring the capability true,
synthesizing a successful server observation, using sequential Contents API
writes, or using an unleased force update would contradict the frozen design.

# 6. Actions deliberately not taken

Because publication capability admission failed before event1, the following
were not performed:

- formal token exact3 source commit;
- source-baseline closure receipt construction or publication;
- sequence event1 construction or publication;
- challenge or one-shot reservation generation/publication;
- formal exact134;
- failure-attempt or accepted-success receipt issuance;
- Step00–10 receipt exact11 generation;
- all11, manifest, event2 construction/publication;
- broad regression;
- P2, fresh batch, exact100, Product Read, correction, B6;
- Cycle001 acceptance; or
- automatic progression.

No mashos-api source, test, fixture, sample, or manifest changed.

# 7. Read-only independent audit

Three non-root read-only audits independently checked:

1. retry004 normative sequencing and STOP boundary;
2. formal runner and artifact-builder interfaces; and
3. Git object/ref publication capability.

All three reached the same pre-event1 STOP. Subagent source edit, test,
reservation, artifact generation, commit, and GitHub write counts were zero.
Karen performed the final connector capability inspection and STOP decision.

# 8. Current state

```text
STATUS:
P1_RETRY004_PRE_EVENT1_EXPECTED_OLD_SHA_LEASE_CAPABILITY_STOP_AUTHORITY_STOP

G1:
IMPLEMENTATION_GREEN_CURRENT_STEP_RECEIPTS_NOT_ISSUED_NOT_COMPLETED

G2:
CONTRACT_RECONCILIATION_IMPLEMENTED_TARGETED_EXACT40_GREEN_FORMAL_RETRY004_PUBLICATION_TRANSPORT_BLOCKED

P1_RETRY004:
PUBLICATION_REF_UPDATE_FAILED_STOP_PRE_EVENT1_NOT_COMPLETED

FORMAL_P1_TOKEN:
APPROVED_BUT_UNCOMMITTED

SOURCE_BASELINE:
UNLOCKED

SEQUENCE_EVENT_1 / SEQUENCE_EVENT_2:
NOT_CREATED / NOT_CREATED

FORMAL_TEST_RUN_RESERVATION_COUNT:
0

FORMAL_EXACT134:
NOT_RUN_PRE_EVENT1_LEASE_CAPABILITY_STOP

SUCCESSFUL_STEP0_10_COMPLETION_RECEIPT_COUNT:
0

BROAD_REGRESSION:
NOT_RUN_NOT_CLAIMED

P2:
NOT_AUTHORIZED

CYCLE001:
NOT_ACCEPTED

AUTOMATIC_PROGRESSION:
false

AUTHORITY_STOP
```

# 9. Confirmed facts, inference, and Karen opinion

## Confirmed facts

- The formal path and reservation namespaces are unused.
- Current heads are stable.
- The production owner and independent verifier require an exact expected-old
  SHA lease and full tree observations.
- Neither the connector nor the local environment provides an authenticated,
  observable exact-lease route.
- Formal exact134 and all downstream issuance remain unexecuted.

## Inference

The source-side atomic contract is implemented and targeted GREEN, but the
external transport needed to turn an unreachable candidate into a published
formal ledger event is not currently available to Karen.

Adding an explicit expected-head mutation to the connector, or exposing an
authenticated Git receive-pack route with exact force-with-lease and full
post-fetch reads, should make a later formal admission technically possible.
That capability must be observed, not asserted.

## Karen opinion

The correct action is to stop before event1. A fast-forward-only write is
usually safe operationally, but this Recovery authority deliberately requires
a stronger exact-head lease. Calling the weaker operation equivalent would
make the formal evidence say something the transport did not prove.

Preserving an unlocked baseline and zero reservation count is better than
creating a formal-looking partial sequence that cannot satisfy its own
publication contract.

# 10. Required Mash-side capability and STOP

Before a later formal retry can be selected, Karen needs one of:

1. a GitHub connector/API mutation with explicit `expected_old_sha` or
   equivalent expected-head OID, together with full base/target tree and blob
   post-fetch; or
2. an authenticated Cocolon Git receive-pack route in this workspace that can
   execute and verify exact
   `--force-with-lease=refs/heads/main:<H0>`.

Do not paste credentials into chat. Configure or connect the authenticated
route outside the conversation.

```text
NEXT_FORMAL_RETRY_AUTHORITY:
UNSELECTED

PRECONDITION:
LEASE_CAPABLE_AUTHENTICATED_GIT_ROUTE_REQUIRED

SEPARATE_AUTHORITY_SELECTION_AND_APPROVAL_REQUIRED_AFTER_CAPABILITY_VERIFICATION

AUTOMATIC_PROGRESSION:
false

AUTHORITY_STOP
```
