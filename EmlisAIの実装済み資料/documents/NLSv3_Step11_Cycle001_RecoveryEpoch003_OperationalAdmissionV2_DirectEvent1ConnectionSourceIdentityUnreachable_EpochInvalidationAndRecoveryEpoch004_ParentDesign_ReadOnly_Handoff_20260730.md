---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch003_oa_v2_direct_event1_source_identity_unreachable_epoch_invalidation_recovery_epoch004_parent_design_handoff
title: "NLS v3 Step 11 Cycle001 Recovery Epoch003 OA v2 Direct Event1 Source Identity Unreachable — Epoch Invalidation and Recovery Epoch004 P0 Parent Design Handoff"
revision_date: "2026-07-30"
status: "READ_ONLY_HANDOFF_AUTHORITY_STOP"
document_authority: "NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_POSTVERIFIED_OPERATIONAL_ADMISSION_V2_DIRECT_EVENT1_CONNECTION_SOURCE_IDENTITY_UNREACHABLE_EPOCH003_INVALIDATION_AND_RECOVERY_EPOCH004_P0_PARENT_DESIGN_ISSUANCE_INDEPENDENT_VERIFICATION_AND_DESIGN_ONLY"
body_free: true
automatic_progression: false
---

# Recovery Epoch003 invalidation / Recovery Epoch004 P0 handoff

## 0. Decision

Recovery Epoch003 is administratively invalidated because its immutable
OperationalAdmission v2 cannot be connected to Event1 by the source that
it admitted.  This does not state that the admitted source had already
drifted, or that the Reference or admission was false.

Recovery Epoch003 P0, D1, D2, P0 Parent Addendum, prestart remediation,
Reference, OperationalAdmission v2, final issuance, and source-identity
reconciliation remain immutable historical evidence.  The current
Reference and OA v2 remain true, postverified, unconsumed, and not reusable
as active future execution credit.

Recovery Epoch004 P0 is frozen as `DEFINED_NOT_STARTED`.  This handoff
does not authorize D1, D2, final issuance, Candidate/Event1, runtime,
Readiness/Failure, Reservation, Attempt, formal exact134, P2, Product
Read, or Cycle001 acceptance.

## 1. Confirmed entry facts

```text
Karen-Diary current commit:
35e359d9045183e7c99065d680101d1ec3354d28

Cocolon entry commit / tree:
56bb2efb85e8ce166980eb499f24cfdf98979c61
0883244c5b4391f2c6a9fd396a639110809b1f00

mashos-api fixed commit / tree:
97e8dd4d7021b8a1781d534aaa603f71dffa41b9
cd3fc3da0976bbbcb708319e4bc8cbbb6a73ec19
```

Both repository entries matched `origin/main` and were clean.  No
mashos-api source drift, Reference/OA identity drift, Event1 appearance,
OA consumption, or Candidate allocation was found.

```text
Epoch003 Event1 path:
ABSENT

Candidate count:
exact0

source baseline:
UNLOCKED

Reference / OA v2:
POSTVERIFIED_IMMUTABLE_UNCONSUMED
```

Current issued identities:

```text
Reference:
190cb3cf0749cf8fcdd9ddc9fdfdd8e47dffb03e35a74c74472e788bab204864

OperationalAdmission v2:
80af08a59a37eacdcb38e2c1004e01dcf85e26fac11f75a56e8adb79d92abcd8

final issuance:
2c52bb50256bdf4c9bf456f33925f4bc868ecbef3001032f08290853f2f73c94

source-identity reconciliation:
2931b88a4c62a0bd12ffa5ec5043dc740b821750635d5bfa0377bd80e80ee173
```

The current reconciliation receipt is the corrected publication:

```text
commit / tree:
e4357895f92cd9e2085c80d2ea8a211f465a62b5
07a792e3dcd3fd9e94efd42bdd05578eb198bf09

blob / raw / logical:
740b4e85cced7a276682d4655bec7be6816e8fa8
b23479d3f01acd17a08e316a09a94056e7a834b3fd8dd6ab126e5f3345446c51
5376489c7cb905187eacfcd05022040bc9956f5d1ae074275c96c35270b4e843
```

The initial receipt commit
`d2062da3b003a9db82dbefbf2f160b1c737e676a` and old external identity
prefix `e4824473` are non-credit because the logical preimage incorrectly
included the trailing LF.

## 2. Actual-source finding

The actual owner call graph ends in an OA v1-specific authority check.
The independent nested Event1 validator is also OA v1-specific.
`_RECOVERY_EPOCH003_V2_EVENT1_AUTHORITY` is `None`, the v2 operation set
contains only OA publication, and the v2 parent accepts phase counts one
or two but has no phase3 Event1 connection.

The minimum direct production connection is exact3:

| Path | Blob | Raw SHA-256 |
|---|---|---|
| `ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py` | `1a3bea7536ce671a56f701ea2ba0acb1a9530536` | `a063af595ba70b8790ed7e6259cd1cc5bf1d565bd267ca8c589d9792ab5a4815` |
| `ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py` | `7e963598ef32ad8f0c88508c36fe5fe5a32dd32e` | `b9c2ada98c4a3f6e390f739335f45e7de2f542596447b1815a0c8c9b9094237a` |
| `ai/tools/emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py` | `289f2d6852768a895e72c900f61c670892574102` | `f334e5628449239161b8c164b2d347181ef8179618ea435a73efbae5f4232e22` |

All exact3 are members of the current OA-bound formal-owner exact7.
Event1 exact23 has one source/bootstrap subject and no second executor
provenance lane.

## 3. Actual-source-derived inference

```text
current OA v2 binds source S0
-> Event1 v2 owner/independent/parent connection is absent from S0
-> D1 publication or D2 implementation produces source S1
-> S1 commit/tree differs from S0
-> current OA v2 freshness fails for S1
-> current OA v2 cannot grant Event1 credit to S1
```

Therefore the current OA v2 direct Event1 route is not merely
unimplemented.  It is source-identity self-invalidating under the current
contract.  Dual-root execution, stale `origin/main`, detached historical
checkout, local ref rewind, synthetic repositories, same-epoch retry, and
successor OA do not repair that causal order and remain non-credit.

## 4. Epoch003 administrative invalidation

The exact3 reason codes are:

```text
DIRECT_OPERATIONAL_ADMISSION_V2_EVENT1_CONNECTION_SOURCE_IDENTITY_UNREACHABLE
SAME_EPOCH_REPAIR_OR_SUCCESSOR_FORBIDDEN
EVENT1_CONNECTION_IMPLEMENTATION_REQUIRES_PRE_ADMISSION_SOURCE_SUCCESSION
```

Closed disposition:

```text
Recovery Epoch003:
EPOCH_INVALIDATED

source drift present at entry:
false

Reference / OA v2 revoked or false:
false / false

Reference / OA v2 consumed:
false / false

Reference / OA v2 active future reuse:
false / false

rewrite / replacement / reissue / rename:
FORBIDDEN

same-epoch retry / successor OA:
FORBIDDEN
```

The immutable predecessor root contains exact16 records.  Its canonical
record-array SHA-256 is:

```text
4529a50c6e24744a38f840ac7161eb16420938b522ae2fba42192ec263aa3a86
```

## 5. Recovery Epoch004 P0

```text
state:
DEFINED_NOT_STARTED

source baseline:
UNLOCKED

Candidate:
UNALLOCATED_DISTINCT_FROM_ALL_PRIOR_CANDIDATES

D1 / D2:
NOT_STARTED / NOT_STARTED

Reference / OperationalAdmission:
NOT_CREATED / NOT_CREATED

Event1 / Readiness / Reservation / Attempt:
NOT_CREATED / NOT_CREATED / NOT_CREATED / NOT_CREATED

formal exact134:
NOT_INVOKED

active execution credit inherited from Epoch003:
NONE

automatic progression:
false
```

The P0 anchor exact2 was published and postfetched:

```text
publication commit / tree:
734aa36ecba8012b21860d4df3d3700b8164409d
419d1c5cd11488af79e4668f5fdf42b1e52dd2bb

Parent Design blob / raw:
43a90a9d7937ed3be818121929df2c8d30a9b424
7dcd50bc1f0fe745ae177cc5cf689f7773c043d6be06ccac54a54200b8c38784

P0 receipt blob / raw / logical:
7c559f55dc08bf362bee4c915baa649583721a3d
5459c128e1cfba2bde85304db3eccc9f6e8ef8237f19de32345019b9be35af90
dc5534919d301589a43e32998c2a5b97cf227f68bb5b462b05f11871ceb7d707
```

The strict exact6 P0 external identity is:

```json
{"logical_cycle_id":"NLS_V3_CYCLE_001","p0_external_identity_sha256":"e6659e9366b2c03b0ceef16bf2e0f8604d5e11226bbfd3fb1b070f9ab8bcac6a","parent_design":{"git_blob_sha1":"43a90a9d7937ed3be818121929df2c8d30a9b424","path":"EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_OperationalAdmissionV2_DirectEvent1ConnectionSourceIdentityUnreachable_EpochInvalidationAndRecoveryEpoch004_ParentDesign_ReadOnly_20260730.md","publication_commit_sha1":"734aa36ecba8012b21860d4df3d3700b8164409d","raw_sha256":"7dcd50bc1f0fe745ae177cc5cf689f7773c043d6be06ccac54a54200b8c38784"},"receipt":{"git_blob_sha1":"7c559f55dc08bf362bee4c915baa649583721a3d","logical_receipt_sha256":"dc5534919d301589a43e32998c2a5b97cf227f68bb5b462b05f11871ceb7d707","path":"EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_OperationalAdmissionV2_DirectEvent1ConnectionSourceIdentityUnreachable_EpochInvalidationAndRecoveryEpoch004_ParentDesign_ReadOnly_BodyFree_Receipt_20260730.json","publication_commit_sha1":"734aa36ecba8012b21860d4df3d3700b8164409d","raw_sha256":"5459c128e1cfba2bde85304db3eccc9f6e8ef8237f19de32345019b9be35af90"},"recovery_epoch_id":"NLS_V3_CYCLE001_RECOVERY_EPOCH_004","schema_version":"cocolon.emlis.nls_v3.step11.cycle001.recovery_epoch004.p0_external_identity.v1"}
```

P0 external identity:

```text
e6659e9366b2c03b0ceef16bf2e0f8604d5e11226bbfd3fb1b070f9ab8bcac6a
```

## 6. Future contract

The final D2-complete source must exist before the future Reference and
OperationalAdmission are issued.  Event1 v2 owner dispatch and the
independent schema dispatch must reject mixed/unknown/v2-to-v1 fallback.
The Event1 source subject, owner executor, and independent executor must
resolve to the same actual Git root, HEAD, tree, module origins, blobs, and
raw bytes.

Parent phase3 must reconstruct actual Reference/OA/Candidate/Event1
publication evidence, independently rerun owner and independent
validation, prove source/executor equality and Event1 changed-path exact1,
and fail closed before runtime on any mismatch.

Existing v1 exact16/exact8 keysets, API meaning, and the frozen
function-level hash map remain invariant:

```text
v1 exact16 keyset:
965d297c7413c243cdebbc744f15334ca5eb0972801fd4254d443369f9caf66b

v1 predecessor exact8 keyset:
ea2dfb2bf3289209bf272ec460173fd5b9ae0429e4adc7c6f900ced4b44458d8

function-level exact16 map:
02a9f982d8ce4341f2bcb4d6b453fc30440172af4f4d4c833b169eaa56757398
```

Strict future order:

```text
Epoch004 P0
-> separate D1 causal RED
-> separate D2 implementation and targeted GREEN
-> final source-bound Reference / OperationalAdmission issuance
-> distinct Candidate nested in Event1 / Event1 postverification
-> post-Event1 runtime and preflight
-> observation plus Readiness or Failure
-> one-shot Reservation after Readiness
-> runner-owned Attempt / formal exact134 at most once
-> later terminal and acceptance gates
```

Exactly one next concrete authority was frozen:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_OPERATIONAL_ADMISSION_V2_EVENT1_CONNECTION_OWNER_INDEPENDENT_SCHEMA_DISPATCH_ACTUAL_GIT_SOURCE_SUBJECT_OWNER_EXECUTOR_INDEPENDENT_EXECUTOR_IDENTITY_PARENT_PHASE3_EVIDENCE_AND_V1_EXACT16_EXACT8_INVARIANCE_CAUSAL_RED_FREEZE_ONLY
```

Its state is:

```text
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED
```

Publication of this handoff does not issue or activate it.

## 7. Facts, inference, and 華恋の意見

### Confirmed facts

- Epoch003 Event1 is absent, Candidate is exact0, and the baseline remains
  unlocked.
- Current Reference and OA v2 match the fixed source, are postverified,
  immutable, and unconsumed.
- The OA v2 Event1 owner, independent, and parent phase3 connection is
  absent from actual source.
- The exact3 minimum connection paths are inside the OA-bound
  formal-owner exact7.
- No source, test, fixture, runtime, Candidate/Event1, Readiness,
  Reservation, Attempt, or formal exact134 effect occurred in this
  authority.

### Actual-source-derived inference

The direct route is self-invalidating because the source change needed to
make the current admission consumable first violates that admission's
source identity and freshness condition.  A new recovery epoch is
therefore required.

### 華恋の意見

Epoch003 should remain intact as truthful immutable pre-Event1 history.
The regular route is to complete and prove the v2 Event1 connection first,
then let Epoch004 Reference and OperationalAdmission bind that final
source.  Reinterpreting the existing OA or splitting subject and executor
provenance would weaken the evidence model and should not receive credit.

## 8. Effect boundary and stop

```text
mashos-api production / test / fixture / dependency changes:
0 / 0 / 0 / 0

pytest collect / execution / pytest.main:
0 / 0 / false

Reference / OA rewrite, reissue, replacement:
0 / 0 / 0

runtime materialization:
0

Candidate / Event1:
0 / 0

source-baseline lock:
0

Readiness / Failure / Reservation / Attempt / formal exact134:
0 / 0 / 0 / 0 / 0

D1 / D2 / final issuance:
NOT_AUTHORIZED / NOT_AUTHORIZED / NOT_AUTHORIZED

P2 / Product Read / Cycle001 acceptance:
NOT_STARTED / NOT_STARTED / NOT_ACCEPTED

automatic progression:
false

target closure state:
RECOVERY_EPOCH003_EPOCH_INVALIDATED_REFERENCE_AND_OPERATIONAL_ADMISSION_V2_IMMUTABLE_HISTORICAL_UNCONSUMED_NOT_REUSABLE_RECOVERY_EPOCH004_P0_PARENT_DESIGN_FROZEN_DEFINED_NOT_STARTED_SOURCE_BASELINE_UNLOCKED_CANDIDATE_UNALLOCATED_EVENT1_NOT_CREATED_CAUSAL_RED_NOT_AUTHORIZED_AUTHORITY_STOP
```

The target closure state becomes current only after this Handoff, the
tracked Execution Plan, and the latest snapshot are reachable on Cocolon
`main`, all exact5 local bytes are postfetched as exact matches, and the
aggregate changed-path set is exactly the approved five paths.
