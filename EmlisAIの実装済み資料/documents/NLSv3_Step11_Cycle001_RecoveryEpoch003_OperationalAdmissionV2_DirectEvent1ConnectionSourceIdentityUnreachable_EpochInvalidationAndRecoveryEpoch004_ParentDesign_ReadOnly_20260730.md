---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch004_parent_design
title: "NLS v3 Step 11 Cycle001 Recovery Epoch003 invalidation and Recovery Epoch004 P0 parent design"
revision_date: "2026-07-30"
status: "RECOVERY_EPOCH003_EPOCH_INVALIDATED_RECOVERY_EPOCH004_PARENT_DESIGN_FROZEN_DEFINED_NOT_STARTED_AUTHORITY_STOP"
body_free: true
automatic_progression: false
---

# 0. Decision

Approved authority:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_POSTVERIFIED_OPERATIONAL_ADMISSION_V2_DIRECT_EVENT1_CONNECTION_SOURCE_IDENTITY_UNREACHABLE_EPOCH003_INVALIDATION_AND_RECOVERY_EPOCH004_P0_PARENT_DESIGN_ISSUANCE_INDEPENDENT_VERIFICATION_AND_DESIGN_ONLY
```

This document makes one append-only administrative transition:

```text
Recovery Epoch003:
EPOCH_INVALIDATED

Epoch003 Reference / OperationalAdmission v2:
POSTVERIFIED_IMMUTABLE_HISTORICAL_UNCONSUMED
ACTIVE_FUTURE_BASELINE_NOT_REUSABLE

Recovery Epoch004:
DEFINED_NOT_STARTED

source baseline:
UNLOCKED

Candidate:
UNALLOCATED_DISTINCT_FROM_ALL_PRIOR_CANDIDATES

Event1 / Readiness / Reservation / Attempt:
NOT_CREATED / NOT_CREATED / NOT_CREATED / NOT_CREATED

formal exact134:
NOT_INVOKED

automatic progression:
false

AUTHORITY_STOP
```

The invalidation does **not** assert that the source had already drifted at
entry.  It does **not** assert that the Reference or OperationalAdmission
v2 was false.  It removes only the right to reuse the issued
OperationalAdmission v2 as an active future baseline after the
pre-admission source succession required to implement its missing Event1
connection.

This Parent Design does not change mashos-api, collect or execute pytest,
materialize a runtime, allocate a Candidate, publish Event1, lock a source
baseline, create Readiness, Failure, Reservation, or Attempt evidence, or
invoke formal exact134.

# 1. Governing material and fixed entries

## 1.1 Current repositories

Fresh current state at Design entry:

```text
Karen-Diary current commit:
35e359d9045183e7c99065d680101d1ec3354d28

Cocolon HEAD / tree / origin/main:
56bb2efb85e8ce166980eb499f24cfdf98979c61
0883244c5b4391f2c6a9fd396a639110809b1f00
56bb2efb85e8ce166980eb499f24cfdf98979c61

mashos-api HEAD / tree / origin/main:
97e8dd4d7021b8a1781d534aaa603f71dffa41b9
cd3fc3da0976bbbcb708319e4bc8cbbb6a73ec19
97e8dd4d7021b8a1781d534aaa603f71dffa41b9

Cocolon / mashos-api dirty path count:
0 / 0
```

The supplied Cocolon anchor is an ancestor of the observed Cocolon HEAD and
is equal to it.  The supplied mashos-api fixed commit is equal to the
observed `HEAD` and freshly observed `origin/main`.

## 1.2 Current normative contract

GitHub reflection is governed only by:

```text
Cocolon_前提資料/
11_cocolon_github_transport_and_session_continuity.md
# CURRENT_NORMATIVE_CONTRACT
```

The current contract requires immediate prewrite target checks, approved
path scope, postwrite target refetch and exact equality, aggregate changed
path verification for the writes performed by Karen, and confirmation that
the GitHub latest state contains every result.  Historical SSH/key,
expected-old lease, direct-child, single-commit, whole-tree, full-recursive
postfetch, or durable-store conditions are not revived.

## 1.3 Current and supplied working material

The current GitHub tracked Execution and Closure Plan is the operative
plan.  The supplied local plan is an older 798-line copy and is not used to
replace the current 9083-line GitHub file.

The supplied Detailed Design and long-term roadmap remain architectural
context:

- NLS v3 fixes the model-free natural-language surface contract;
- Step11 Cycle001 evidence is prerequisite work, not the whole product;
- Step11 must later pass through saturation, RC, shadow, device, and switch
  gates before product completion;
- question-system and P7/P8 work remain later product layers; and
- phase completion, evidence integrity, and explicit STOP boundaries take
  precedence over apparent forward motion.

# 2. Confirmed facts

## 2.1 Current Epoch003 state

```text
Event1 exact path:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch003_
SequenceEvent01_SourceBaselineLocked_BodyFree_Event.json

Event1 path state:
ABSENT

Candidate allocation count:
0

source baseline:
UNLOCKED

operational runtime / Readiness / Failure:
0 / 0 / 0

Reservation / Attempt / formal exact134:
0 / 0 / 0
```

The issued OperationalAdmission v2 records Candidate, Event1, operational
runtime, Readiness, Reservation, Attempt, formal exact134, formal
collection, and test execution as zero.  Its operation set contains only
`OPERATIONAL_ADMISSION_PUBLICATION`; its `next_authority_token` is `null`;
`reuse_allowed` is `false`; maximum Event1 consumption is one.

No Event1 means that no canonical consumption record exists.  Therefore
`unconsumed` is established by the current canonical artifact set and
effect boundaries; it is not a claim about unobservable private use.

## 2.2 Current issued identities

| Artifact | Publication commit | Git blob | Raw SHA-256 | Logical SHA-256 | External identity |
|---|---|---|---|---|---|
| Reference Runtime Observation | `26b4d3746648c48b137103e4a8f22f7c98e1e9fa` | `59623e9baba5f76bb9e80df4ca0cddd18f8320e4` | `bd3180d55f756c7b0605bf0862641e22a9cea3f4325babc8802803d2b8530371` | `0fd0c012d788c790b31fab275a6bcc6180bc544736aaac4dd72d2a42cea46a00` | `190cb3cf0749cf8fcdd9ddc9fdfdd8e47dffb03e35a74c74472e788bab204864` |
| OperationalAdmission v2 | `3a0cf9dab6f81711a3754367796095e36109c657` | `c58e29b982a89bf2aefa008fc3276431b5e8cac2` | `26db0957e0582e4fbcc7fcd5ffdefb98a198fb0c1abe2a13aa6159c63a73b280` | `e3e53e2d446cdac7332b0caebb8dcd3ef5eff103502cc6eebfffbc2ffece5676` | `80af08a59a37eacdcb38e2c1004e01dcf85e26fac11f75a56e8adb79d92abcd8` |
| final-issuance receipt | `b8e39ea696e337bcafd166df2cab3f27b1f0796c` | `ab901e0947f1487cfca4bb5d9c8e02f75684da9f` | `d231e4b863e5b6df8ec86144bd2a79c95ac9feedd3e47d1e5df2b7045536e22f` | `15a455414a281b330ae815d51811085df141e4dbab7a22f85b41967fe3f7e6b5` | `2c52bb50256bdf4c9bf456f33925f4bc868ecbef3001032f08290853f2f73c94` |
| source-identity reconciliation receipt | `e4357895f92cd9e2085c80d2ea8a211f465a62b5` | `740b4e85cced7a276682d4655bec7be6816e8fa8` | `b23479d3f01acd17a08e316a09a94056e7a834b3fd8dd6ab126e5f3345446c51` | `5376489c7cb905187eacfcd05022040bc9956f5d1ae074275c96c35270b4e843` | `2931b88a4c62a0bd12ffa5ec5043dc740b821750635d5bfa0377bd80e80ee173` |

All four publication commits are ancestors of current Cocolon main.  Their
current blobs remain equal to their publication blobs.  The raw, logical,
and external identities were independently recomputed from actual bytes.

The earlier reconciliation receipt publication
`d2062da3b003a9db82dbefbf2f160b1c737e676a` and external identity
`e4824473b41a04cace6b988271c03e3c8d3cde1b71b6dfef0699c4514a35523b`
are non-credit.  Their logical preimage incorrectly included the trailing
LF.  Only `e4357895... / 2931b88a...` is current.

## 2.3 OperationalAdmission v2 source binding

```text
schema:
cocolon.emlis.nls_v3.recovery_epoch003.operational_admission.v2

top-level / predecessor key count:
exact16 / exact8

bound source commit / tree:
97e8dd4d7021b8a1781d534aaa603f71dffa41b9
cd3fc3da0976bbbcb708319e4bc8cbbb6a73ec19

source closure:
80e18e75604c72c78701384f127839aee1ef152a7788622d2824e8678137fe97

bootstrap closure:
a6c19b645fede8d9a508235e63babd7299d96194d88b5f7aeb3b7a7feedae571

formal-owner exact7:
43e6414e81cdc74fbfad73bb4992988f982c6114d6807150dd13c8f338833ffe

predecessor exact8:
c5db068bb6683ef2a8359b51a7f16190027c17e97f70752ddace53e0af04d071
```

The fixed freshness conditions include
`SOURCE_COMMIT_OR_TREE_DRIFTED_OR_WORKTREE_NOT_CLEAN`.  At this Design
entry that condition is false: current source still equals the admitted
source.

## 2.4 Actual source, AST, import graph, and call graph

The public owner route is:

```text
validate_recovery_epoch003_sequence_event1_contract_state
-> _recovery_epoch003_profiled_event_valid
-> _recovery_epoch003_current_event_valid
-> _recovery_epoch003_current_event_authority_valid
-> OperationalAdmission schema v1
```

The independent route is:

```text
_recovery_epoch003_current_event_nested_valid
-> _recovery_epoch003_external_identity_valid
-> OperationalAdmission schema v1
```

The v2 admission route is:

```text
build_recovery_epoch003_operational_admission_v2
-> OperationalAdmission publication only

verify_recovery_epoch003_operational_admission_contract_v2
-> prepublication/postfetch OA verification only

validate_recovery_epoch003_parent_pre_event1_phase_evidence_state_v2
-> Reference phase1
-> OperationalAdmission phase2
-> STOP before phase3
```

Actual facts:

1. the owner Event1 authority validator is OA v1-specific;
2. the independent nested Event1 validator is OA v1-specific;
3. `_RECOVERY_EPOCH003_V2_EVENT1_AUTHORITY` is `None`;
4. the v2 operation set is OperationalAdmission publication exact1;
5. the v2 parent accepts completed phase count exact1 or exact2 only;
6. the general phase3 path calls the v1 admission verifier;
7. Candidate is nested exact9 and has no standalone publication API;
8. Event1 is exact23 and contains one source/bootstrap subject identity;
9. Event1 exact23 and Candidate exact9 contain no second executor
   provenance lane; and
10. parent phase3 has not occurred.

The minimum direct-connection production subset is exact3:

```text
ai/services/ai_inference/
emlis_ai_recovery_epoch002_sequence_ledger_v3.py

ai/tools/
emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py

ai/tools/
emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py
```

Ordered-path canonical SHA-256:

```text
e01f5e587ba1884b988075eee1c162454d3a6a1d4b10febc3b7111c2b5c1b248
```

All exact3 are members of the OA-bound formal-owner exact7.  Their current
actual identities are:

| Path | Git blob | Raw SHA-256 |
|---|---|---|
| sequence ledger | `1a3bea7536ce671a56f701ea2ba0acb1a9530536` | `a063af595ba70b8790ed7e6259cd1cc5bf1d565bd267ca8c589d9792ab5a4815` |
| independent closure verifier | `7e963598ef32ad8f0c88508c36fe5fe5a32dd32e` | `b9c2ada98c4a3f6e390f739335f45e7de2f542596447b1815a0c8c9b9094237a` |
| formal parent orchestrator | `289f2d6852768a895e72c900f61c670892574102` | `f334e5628449239161b8c164b2d347181ef8179618ea435a73efbae5f4232e22` |

The owner and independent actual-repository checks require the explicit
repository root, actual top-level equality, expected `HEAD`, expected tree,
fresh `origin/main`, and clean worktree.  The v2 verifier also rechecks the
formal-owner path/blob/raw identities at actual `HEAD`.

## 2.5 Full causal role order

| Stage | Role and current meaning |
|---|---|
| P0 | Defines the recovery epoch, immutable predecessors, identities, schemas, authority order, and STOP boundaries. It grants no execution credit. |
| D1 | Under separate authority, freezes one causal RED proving the missing Event1 v2 dispatch, actual-Git executor equality, and parent phase3 evidence seam. It changes no production source. |
| D2 | Under separate authority, adds the versioned implementation and obtains targeted GREEN. It creates the final pre-Reference source but does not issue Reference/OA/Candidate/Event1. |
| Reference | After D2, observes the final source-bound reference runtime and publishes an immutable body-free external identity. |
| OperationalAdmission | After Reference, binds the same final source commit/tree, source/bootstrap closure, formal-owner set, predecessor set, and Reference identity. |
| Candidate | A distinct exact9 object allocated only inside final Event1 bytes; it has no standalone publication and does not lock the baseline by itself. |
| Event1 | A single exact1 publication that binds Candidate, Reference, OA, source/bootstrap closure, and source identity. The baseline locks only after independent postfetch verification. |
| formal parent phase3 | Reconstructs actual Reference/OA/Candidate/Event1 evidence, independently reexecutes validation, proves executor/source equality and publication immutability, then stops before runtime. |
| runtime/preflight | Starts only after Event1. It materializes an operational runtime distinct from the Reference root and constructs operational observation plus exactly one Readiness or Failure candidate. |
| Readiness/Failure | Publishes the observation and the matching terminal preflight receipt. Failure stops with Reservation/Attempt/exact134 at zero. |
| Reservation | May be published once only after postverified Readiness; it grants no result by itself. |
| Attempt | Is runner-owned and created only from a valid one-shot Reservation under a later separate authority. |
| formal exact134 | May execute at most once for that Attempt after all prior gates; it is not an OA, Event1, Readiness, or Reservation effect. |

The current OA v2 stops at formal-parent phase2.  Therefore Event1,
runtime, Readiness, Reservation, Attempt, and formal exact134 are all
unreachable from the current v2 route.

# 3. Actual-source-derived inference

The source identity self-invalidation is:

```text
current OA v2 binds source S0
-> v2 Event1 owner/independent/parent connection is absent from S0
-> D1 commit or D2 implementation creates source S1
-> S1 commit/tree differs from S0
-> the current OA v2 source-drift invalidation condition becomes true
-> current OA v2 cannot grant Event1 credit to S1
```

This is stronger than “the feature is not implemented.”  The required
implementation would invalidate the source identity that the current
admission requires before that admission could be consumed.

The following do not repair the causal order:

- treating old S0 as the Event1 subject while executing S1 validators;
- dual-root owner/independent credit;
- detached historical checkout credit;
- stale `origin/main`;
- local ref rewind or remote-tracking ref repoint;
- synthetic repository or hidden source lookup;
- rewriting or reissuing the current OA;
- relaxing source/freshness/formal-owner validation; or
- adding a same-Epoch successor OA.

Those routes either leave the executing code outside the admitted closure,
make current Git evidence false, or mutate an immutable postverified
identity.

# 4. Recovery Epoch003 administrative invalidation

## 4.1 Reason exact3

The ordered exact3 reason codes are:

```text
DIRECT_OPERATIONAL_ADMISSION_V2_EVENT1_CONNECTION_SOURCE_IDENTITY_UNREACHABLE
SAME_EPOCH_REPAIR_OR_SUCCESSOR_FORBIDDEN
EVENT1_CONNECTION_IMPLEMENTATION_REQUIRES_PRE_ADMISSION_SOURCE_SUCCESSION
```

## 4.2 Closed disposition

```text
recovery_epoch_id:
NLS_V3_CYCLE001_RECOVERY_EPOCH_003

state:
EPOCH_INVALIDATED

source drift present at invalidation entry:
false

Reference false or revoked:
false

OperationalAdmission v2 false or revoked:
false

OperationalAdmission v2 consumed:
false

active future reuse:
false

rewrite / replacement / reissue / rename:
FORBIDDEN

same-epoch retry / successor OA / identity reinterpretation:
FORBIDDEN
```

Administrative invalidation changes eligibility, not history.  Epoch003
P0, D1, D2, Parent Addendum, Reference, OA v2, final issuance, prestart
remediation, and source-identity reconciliation remain immutable historical
evidence.

# 5. Immutable Epoch003 predecessor set

## 5.1 Canonical record contract

The P0 receipt contains the normative ordered exact16 root-record array.
It binds the Epoch003 P0 pair, the current-credit D1/D2 receipt chain,
Parent Addendum receipt, prestart remediation receipt chain, Reference,
OA v2, final-issuance receipt, and reconciliation exact3.  Their associated
Result/Design/Handoff companions remain immutable in Git but do not expand
the root array unless named in that exact16.  Every
record is strict exact10:

```text
label
path
publication_commit_sha1
git_blob_sha1
raw_sha256
logical_identity_field
logical_identity_sha256
external_identity_kind
external_identity_sha256
disposition
```

The disposition is always:

```text
IMMUTABLE_HISTORICAL_NOT_ACTIVE_EXECUTION_CREDIT
```

For Markdown Design/Result/Handoff evidence, no body self-hash or generic
exact10 publication external-identity contract was defined historically.
Their logical and external values are therefore `null` with
`external_identity_kind=NOT_DEFINED_FOR_MARKDOWN_EVIDENCE`.  This is an
explicit type distinction, not missing data and not permission to invent
an identity.

The canonical sorted compact JSON hash of the exact16 record array is:

```text
4529a50c6e24744a38f840ac7161eb16420938b522ae2fba42192ec263aa3a86
```

## 5.2 Root identities

```text
Epoch003 P0 external identity:
74286b862eeee1663d2758ee18d1e848316da6fc27b12fef38c149c5a2b52f36

Reference external identity:
190cb3cf0749cf8fcdd9ddc9fdfdd8e47dffb03e35a74c74472e788bab204864

OperationalAdmission v2 external identity:
80af08a59a37eacdcb38e2c1004e01dcf85e26fac11f75a56e8adb79d92abcd8

final-issuance receipt external identity:
2c52bb50256bdf4c9bf456f33925f4bc868ecbef3001032f08290853f2f73c94

current reconciliation receipt external identity:
2931b88a4c62a0bd12ffa5ec5043dc740b821750635d5bfa0377bd80e80ee173
```

Transitive immutable roots:

```text
historical predecessor seed:
3a08461e6f06c820038a29c5c547476842560f41865929e4c05454b220afaa00

historical binding core:
519359777b7efc56b79d9422ba6f312913f97a490dc290c20c18ab42dfbd8ef5

OA predecessor exact8:
c5db068bb6683ef2a8359b51a7f16190027c17e97f70752ddace53e0af04d071

source closure:
80e18e75604c72c78701384f127839aee1ef152a7788622d2824e8678137fe97

bootstrap closure:
a6c19b645fede8d9a508235e63babd7299d96194d88b5f7aeb3b7a7feedae571

formal-owner exact7:
43e6414e81cdc74fbfad73bb4992988f982c6114d6807150dd13c8f338833ffe
```

## 5.3 Reconciliation exact3

| Member | Path | Publication commit | Blob | Raw SHA-256 | Logical | External |
|---|---|---|---|---|---|---|
| Design | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_OperationalAdmissionV2_DirectEvent1ConnectionSourceIdentityParadox_ContractReconciliation_Design_ReadOnly_20260730.md` | `794a8e2605e9627de0065ca2835270ebdcc1dfc7` | `d2da870c669dbd1d1050e81a032e213a318f82bd` | `d6cac997800a3ee59a8d42950d1ba3583ea1f227dbc00f1e7b7a57c74e141829` | `NOT_DEFINED` | `NOT_DEFINED` |
| corrected receipt | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_OperationalAdmissionV2_DirectEvent1ConnectionSourceIdentityParadox_ContractReconciliation_Design_ReadOnly_BodyFree_Receipt_20260730.json` | `e4357895f92cd9e2085c80d2ea8a211f465a62b5` | `740b4e85cced7a276682d4655bec7be6816e8fa8` | `b23479d3f01acd17a08e316a09a94056e7a834b3fd8dd6ab126e5f3345446c51` | `5376489c7cb905187eacfcd05022040bc9956f5d1ae074275c96c35270b4e843` | `2931b88a4c62a0bd12ffa5ec5043dc740b821750635d5bfa0377bd80e80ee173` |
| Handoff | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_OperationalAdmissionV2_DirectEvent1ConnectionSourceIdentityParadox_ContractReconciliation_Design_ReadOnly_Handoff_20260730.md` | `d25ef78c977552b08414b92e8f8162438bdea9b5` | `005a54bef21dae73206099d271a5c0dedf69fd20` | `5d00a9f347e8dc2dedba7ef200c4f74f7f1efb6e42ca22c865360e4fd68fbb38` | `NOT_DEFINED` | `NOT_DEFINED` |

# 6. Recovery Epoch004 P0

## 6.1 Definition

```text
logical_cycle_id:
NLS_V3_CYCLE_001

recovery_epoch_id:
NLS_V3_CYCLE001_RECOVERY_EPOCH_004

state:
DEFINED_NOT_STARTED

source baseline:
UNLOCKED

Candidate:
UNALLOCATED_DISTINCT_FROM_ALL_PRIOR_CANDIDATES

D1 / D2 / final Reference / final OA:
NOT_STARTED / NOT_STARTED / NOT_CREATED / NOT_CREATED

Event1 / Readiness / Reservation / Attempt:
NOT_CREATED / NOT_CREATED / NOT_CREATED / NOT_CREATED

formal exact134:
NOT_INVOKED

inherited active execution credit from Epoch003:
NONE

Cycle001:
NOT_ACCEPTED

automatic progression:
false
```

Epoch004 may inherit historical evidence identities and the causal lesson.
It does not inherit an active Candidate, Event1, Reference, OA capability,
runtime observation, Readiness, Reservation, Attempt, formal execution, P2,
Product Read, or Cycle acceptance credit.

## 6.2 P0 external identity

The Epoch004 P0 anchor has exactly two members:

1. this Parent Design; and
2. its body-free receipt.

The external identity schema is:

```text
cocolon.emlis.nls_v3.step11.cycle001.
recovery_epoch004.p0_external_identity.v1
```

It is strict exact6:

```text
schema_version
logical_cycle_id
recovery_epoch_id
parent_design
receipt
p0_external_identity_sha256
```

`parent_design` is strict exact4:

```text
path
publication_commit_sha1
git_blob_sha1
raw_sha256
```

`receipt` is strict exact5:

```text
path
publication_commit_sha1
git_blob_sha1
raw_sha256
logical_receipt_sha256
```

The body-free P0 receipt is strict exact25:

```text
schema_version
approved_authority_token
logical_cycle_id
recovery_epoch_id
source_entries
parent_design
epoch003_invalidation
immutable_evidence
epoch004_definition
epoch004_p0_contract
source_identity_self_invalidation
actual_source_contract
event1_v2_contract
parent_phase3_contract
v1_preservation
future_gate_order
next_authority_token
historical_credit_boundary
independent_verification
repository_scope
decision_effective_when
state
automatic_progression
body_free
receipt_sha256
```

`receipt_sha256` is SHA-256 over UTF-8 canonical sorted compact JSON of
the other exact24 fields, with no trailing LF.  The on-disk receipt bytes
are canonical sorted compact JSON of all exact25 fields followed by
exactly one LF.  This `receipt_sha256` is the
`logical_receipt_sha256` used by the P0 external identity.

`p0_external_identity_sha256` is SHA-256 over UTF-8 canonical sorted
compact JSON of the other exact5 fields, with no trailing LF.

The value cannot be known before both members have actual Git publication
identities.  It must be derived after their publication and postfetch,
then recorded in the Handoff, tracked Plan, and latest snapshot.  It must
not be guessed or made circular by embedding its future publication
identity in either anchor member.

# 7. Epoch004 source and artifact contracts

## 7.1 Final source rule

Let the D2-complete source be `S4-final`.

```text
P0 and D1:
do not issue Reference or OA

D2:
completes every required source change and targeted GREEN

Reference:
binds S4-final after D2

OperationalAdmission:
binds the same S4-final after Reference

Candidate/Event1:
consume only those post-D2 identities
```

No production or test commit may occur between final Reference
materialization/publication, OA publication, and Event1.  If source
commit/tree, clean-state, formal-owner identities, dependency closure, or
fresh `origin/main` changes, the new Reference/OA becomes ineligible and
the route fails closed.  There is no same-epoch repair or successor unless
a later explicit design authority establishes one before issuance.

## 7.2 Epoch004 paths and schemas

| Role | Future path or nested location | Schema |
|---|---|---|
| Reference | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_PreEvent1_ReferenceRuntimeObservation_BodyFree_Receipt.json` | `cocolon.emlis.nls_v3.recovery_epoch004.reference_runtime_observation.v1` |
| OperationalAdmission v2 | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_OperationalAdmissionV2_BodyFree_Receipt.json` | `cocolon.emlis.nls_v3.recovery_epoch004.operational_admission.v2` |
| Event1 v2 | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_SequenceEvent01_SourceBaselineLocked_BodyFree_Event.json` | `cocolon.emlis.nls_v3.recovery_epoch004.sequence_event.v2` |
| Candidate | Event1 `#/candidate_allocation` only | `cocolon.emlis.nls_v3.recovery_epoch004.candidate_allocation.v1` |
| source closure | Event1 `#/source_closure` and OA carrier | `cocolon.emlis.nls_v3.recovery_epoch004.source_baseline_eligibility_closure.v1` |
| bootstrap closure | Event1 `#/bootstrap_closure` and OA carrier | `cocolon.emlis.nls_v3.recovery_epoch004.formal_worker_bootstrap_manifest.v1` |
| operational observation | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_PostEvent1_OperationalRuntimeObservation_BodyFree_Receipt.json` | `cocolon.emlis.nls_v3.recovery_epoch004.operational_runtime_observation.v1` |
| Readiness | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_PostEvent1_BootstrapReadiness_BodyFree_Receipt.json` | `cocolon.emlis.nls_v3.recovery_epoch004.bootstrap_readiness_receipt.v1` |
| Failure | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_PostEvent1_BootstrapPreflightFailure_BodyFree_Receipt.json` | `cocolon.emlis.nls_v3.recovery_epoch004.formal_worker_bootstrap_preflight_failure_receipt.v1` |

All paths are distinct from Epoch003.  No Epoch003 path is renamed or
reused.

## 7.3 Stable shapes

Unless D1 proves a shape change causally necessary:

- Reference remains strict exact21;
- OperationalAdmission remains strict exact16;
- its predecessor mapping remains strict exact8;
- Candidate remains strict exact9;
- Event1 v2 remains strict exact23 with the established top-level names;
- source closure remains strict exact20;
- bootstrap closure remains strict exact33;
- operational observation remains strict exact41;
- Readiness remains strict exact24; and
- Failure remains strict exact29.

The Event1 v2 schema version separates dispatch; it does not silently
change v1 meaning.  Candidate remains nested-only.  The executing source
identity is proved by actual phase3 evidence rather than by adding a
second, caller-asserted executor lane to Event1.

## 7.4 Epoch004 predecessor exact8

The new OA v2 predecessor mapping is strict exact8:

```text
p0_external_identity
epoch003_immutable_predecessor_set_sha256
epoch003_reconciliation_receipt_external_identity
d1_event1_connection_receipt_external_identity
d2_event1_connection_receipt_external_identity
reference_runtime_observation_external_identity
final_source_identity_contract_sha256
predecessor_bindings_sha256
```

Every external identity is a complete typed object, not a bare SHA string,
except the two explicitly named SHA-256 aggregate fields.  The mapping is
self-hashed without `predecessor_bindings_sha256`.

# 8. Event1 v2 owner and independent schema dispatch

## 8.1 Owner dispatch

The sequence-ledger public entrypoint must dispatch by the complete schema
tuple:

```text
recovery_epoch_id
Event1 schema
OperationalAdmission schema
Candidate schema
source-closure schema
bootstrap-closure schema
```

Accepted tuples are closed and version-specific:

- historical/current v1 inputs continue through the existing byte-frozen
  v1 route; and
- the complete Epoch004 tuple goes through a new v2 Event1 owner route.

Mixed epoch, mixed schema, unknown schema, missing authority, v2-to-v1
downgrade, profile-only, filename-only, or unknown-schema fallback fails
closed.

The new owner validates Candidate exact9, Event1 exact23, OA v2 exact10
external identity, Reference exact10 identity, full source/bootstrap
closure, supporting artifacts exact2, Event1 changed path exact1, distinct
candidate provenance, and zero later-stage facts.

## 8.2 Independent dispatch

The independent verifier implements the same accepted tuple set without
importing or calling the owner Event1 validator.  It independently derives
keysets, hashes, external identities, publication ancestry, current path
blob, raw/postfetch equality, and actual Git source identities.

Owner success forwarded as a boolean, a prebuilt mapping, a digest, a
cursor, or a phase name is not independent evidence.

# 9. Same actual Git identity contract

## 9.1 Identity equality

At Event1 owner validation and independent postverification:

```text
Event1 subject source identity
==
owner executor actual Git identity
==
independent executor actual Git identity
==
consumed OA bound source identity
```

Each actual Git identity is derived from:

```text
repository_full_name
source_ref
resolved repository top-level
HEAD commit SHA-1
HEAD tree SHA-1
freshly fetched origin/main SHA-1
worktree clean-state
loaded owner module paths and their HEAD blob/raw identities
```

The resolved root is transient validation input and is not serialized in a
body-free artifact.  Equality is established from actual Git commands and
module source origins, not caller-supplied strings.

The following are non-credit:

- source subject root different from owner executor root;
- owner executor root different from independent executor root;
- code loaded from a sibling or fallback root;
- stale or locally manipulated `origin/main`;
- detached historical checkout used as current credit;
- symlink/root alias that resolves outside the asserted top-level;
- synthetic repository;
- dirty worktree; or
- a module blob/raw not equal to `HEAD:path`.

## 9.2 Parent phase3 actual evidence

Future phase3 must reconstruct and prove from actual repositories:

1. Reference body, exact10 identity, publication commit/blob/raw/logical,
   ancestry, current-byte freshness, and postfetch equality;
2. OA v2 body, exact10 identity, publication facts, source/bootstrap
   closures, predecessor exact8, freshness, and unconsumed state;
3. Candidate exact9 nested only inside Event1 and distinct from every prior
   candidate;
4. Event1 v2 exact23 body, logical hash, publication commit/tree/blob/raw,
   postfetch equality, supporting exact2, and changed path exact1;
5. the exact same source identity for subject, owner executor, and
   independent executor;
6. owner and independent schema dispatch executed separately;
7. Event1 runtime-record count exact0;
8. parent completed phases exact3 with phase4 named but not started; and
9. source baseline `LOCKED` only after all preceding phase3 checks pass.

Any missing, mixed, stale, forwarded, or non-actual evidence returns one
stable phase3 failure and leaves the baseline `UNLOCKED`.

# 10. v1 exact16/exact8 and API preservation

## 10.1 Ordered keysets

The existing v1 OperationalAdmission top-level exact16 remains:

```text
schema_version
logical_cycle_id
recovery_epoch_id
predecessor_bindings
source_closure
bootstrap_closure
authority
scope
freshness
effect_boundary
owner_validation_state
independent_verification_state
state
automatic_progression
body_free
operational_admission_sha256
```

Ordered exact16 keyset SHA-256:

```text
965d297c7413c243cdebbc744f15334ca5eb0972801fd4254d443369f9caf66b
```

The existing v1 predecessor exact8 remains:

```text
p0_external_identity
operational_admission_parent_addendum_receipt_external_identity
bootstrap_contract_d1_receipt_external_identity
bootstrap_contract_d2_receipt_external_identity
operational_admission_contract_d1_receipt_external_identity
operational_admission_contract_d2_receipt_external_identity
reference_runtime_observation_external_identity
predecessor_bindings_sha256
```

Ordered exact8 keyset SHA-256:

```text
ea2dfb2bf3289209bf272ec460173fd5b9ae0429e4adc7c6f900ced4b44458d8
```

## 10.2 v1 meaning

`build_recovery_epoch003_operational_admission` keeps its strict exact8
input:

```text
predecessor_bindings
source_closure
bootstrap_closure
authority
scope
freshness_policy
reference_publication_state
source_repository_observation
```

It returns a strict v1 exact16 OA or the existing stable fail-closed result.

`verify_recovery_epoch003_operational_admission_contract` keeps its strict
exact7 input:

```text
verification_mode
artifact_repository_root
source_repository_observation
operational_admission
operational_admission_external_identity
reference_runtime_observation
reference_publication_state
```

It retains `BODY_ONLY_BEFORE_PUBLICATION` and `BODY_AND_POSTFETCH` meaning
and returns `()` only for a valid complete v1 contract.  Neither v1
function accepts v2 by fallback.

The canonical loader remains:

```text
Git blob:
953d062fa858870e65d96cf03694d68c99003594

raw SHA-256:
c20b262495276c9b549b257380e1a7c28069c316a7aca4b6e00a49de03d1512b
```

## 10.3 Function-level source-hash invariants

Hash preimage:

```text
SHA256_UTF8_AST_LINENO_THROUGH_END_LINENO_INCLUSIVE_WITH_FINAL_LINE_LF
```

| Path / function | Frozen SHA-256 |
|---|---|
| `ai/services/ai_inference/emlis_ai_nls_v3_artifact_contract.py` / `canonical_json_bytes` | `394387ad45c71df8437e6d2755d4043eaf6bb8e19f20514b508a8f40687c341c` |
| same / `load_canonical_json_bytes` | `2176bce9b2421ccb3cd0217af346d164f4fd10bdca7b3d1d1223e81e0f168865` |
| `ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py` / `build_recovery_epoch003_operational_admission` | `ad85c66692d2b8e9bb3787ef6d8afff21c0e4b4f4a08c1fa6978e1a07e8bbfae` |
| same / `validate_recovery_epoch003_sequence_event1_contract_state` | `63ef2fb2e3a17e5aac2605cd82d8b40e7ffd07e1b0f1bec5baeb6dc994249695` |
| `ai/services/ai_inference/emlis_ai_recovery_epoch002_canonical_current_closure_v3.py` / `build_recovery_epoch003_source_bootstrap_closure` | `24bf12d6d1937ae5dc54dc74a45094a779df2338ea40ff4862ddb710c4789002` |
| same / `validate_recovery_epoch003_source_bootstrap_contract_state` | `eb255d7243f45acf194f20044748d1ad20971653faa3c09fbd39668021ed321e` |
| `ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py` / `verify_recovery_epoch003_reference_runtime_observation` | `05cd2d7f8182fe1dc0ec20536445ab7d63ba092e47ff8f3f649211f1e1cb60b9` |
| same / `verify_recovery_epoch003_operational_admission_contract` | `089bfb98ddf540ef85aa2ddcf97b15ab5cef8e6e55a35c5bad6ad4cfe2de50c5` |
| `ai/tools/emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py` / `validate_recovery_epoch003_parent_phase_evidence_state` | `fcb7056bbd2868ad59115832c4f68a2c9728a945780ae4a9f5a546eaf4826c3e` |
| same / `execute_recovery_epoch003_current_strict_parent_phase_v1` | `0865deb09995a19d6b0e91249e4a3176ed3cb64f55806e73cda3d56c5035a138` |
| `ai/tools/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_preflight.py` / `materialize_recovery_epoch003_reference_runtime` | `558f7cba3b57df408508974fa03ab6927cfb1830f92931bef615562ccc4e953b` |
| same / `build_recovery_epoch003_reference_runtime_observation` | `9792f7446d6f26b48239df10c05f6283943259ee7eb65c0b3cd2ba8bd1bc364e` |
| same / `execute_recovery_epoch003_current_strict_preflight_v1` | `faf706fa297e912ac43b534eda6da744449ec905f4cd3cb374951e70bb9b1cdc` |

Additional Event1 meaning anchors:

| Path / function | Frozen SHA-256 |
|---|---|
| sequence ledger / `_recovery_epoch003_current_event_valid` | `17bc86dda311ac503e7634f459a5f62a8c9993fd0e4d00aced4410e69b093e32` |
| independent verifier / `_recovery_epoch003_current_event_nested_valid` | `78e835d067f5f9d1474a3d6d4b7c58bdf920829b7140ca8adb7a0bd08c571493` |
| preflight / `_recovery_epoch003_baseline_valid` | `5087babfcc289f89548708858cf7a690bf21c5edbca0153e3cc2cbaa7f611df7` |

D2 must add new versioned functions or dispatch around these anchors.  It
must not edit the frozen function bodies, overload v1 with v2 semantics, or
introduce unknown-schema fallback.

# 11. Separate D1 and D2 contracts

## 11.1 D1 exact1 write surface

The only D1 test path is:

```text
ai/tests/
test_emlis_nls_v3_recovery_epoch004_operational_admission_v2_event1_
connection_actual_git_identity_parent_phase3_red.py
```

D1 must pre-freeze its exact node IDs, denominator, oracle names, file
blob/raw, source entry, and expected causal failures before collection.

Required causal families:

- Epoch004 schema tuple owner dispatch;
- independent schema dispatch without owner-validator import;
- mixed/unknown/v2-to-v1 rejection;
- same actual Git source subject/owner/independent identity;
- fresh `origin/main`, clean tree, module-origin and HEAD blob/raw checks;
- Candidate exact9 nested-only and distinct;
- Event1 v2 exact23, OA/Reference supporting exact2, changed path exact1;
- OA freshness and single consumption;
- parent phase3 actual reconstruction and independent reexecution;
- cursor/name/digest/prebuilt mapping non-credit;
- baseline lock only after Event1 postverification;
- runtime/Readiness/Reservation/Attempt/exact134 effects exact0; and
- all v1 exact16/exact8/API/function hash invariants.

D1 may collect and execute only under a separate explicit Mash approval.
This P0 does not create, collect, or execute the test.

## 11.2 D2 production envelope

The D2 allowed production envelope is the formal-owner exact7:

```text
ai/services/ai_inference/
emlis_ai_recovery_epoch002_canonical_current_closure_v3.py

ai/services/ai_inference/
emlis_ai_recovery_epoch002_sequence_ledger_v3.py

ai/tools/
emlis_nls_v3_recovery_epoch002_atomic_publication_bundle_v3.py

ai/tools/
emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py

ai/tools/
emlis_nls_v3_recovery_epoch002_current_step_proof_run.py

ai/tools/
emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py

ai/tools/
emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_preflight.py
```

The mandatory direct Event1 connection subset is the exact3 in section
2.4.  The remaining exact4 may change only when a pre-frozen D1 oracle
proves they are required for the complete Epoch004 source/bootstrap,
publisher, preflight, and formal-gate schema tuple.  No eighth production
path is allowed without a new explicit design authority.

D2 must finish all source changes before final Reference/OA issuance.  It
must not materialize Reference or operational runtime, publish an
artifact, allocate Candidate/Event1, lock the baseline, create
Readiness/Reservation/Attempt, invoke exact134, or automatically progress.

# 12. Exact future order and exactly one next authority

The strict future order is:

```text
01 Recovery Epoch004 P0 postverified
02 separate D1 causal RED
03 separate D2 implementation and targeted GREEN
04 final S4-bound Reference and OperationalAdmission issuance
05 distinct Candidate allocation nested in Event1 and Event1 postverification
06 post-Event1 operational runtime materialization and preflight
07 operational observation plus matching Readiness or Failure publication
08 one-shot Reservation after Readiness only
09 runner-owned Attempt and formal exact134 at most once
10 terminal and later acceptance gates under further authorities
```

Only one concrete next authority token is frozen by this Design:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_OPERATIONAL_ADMISSION_V2_EVENT1_CONNECTION_OWNER_INDEPENDENT_SCHEMA_DISPATCH_ACTUAL_GIT_SOURCE_SUBJECT_OWNER_EXECUTOR_INDEPENDENT_EXECUTOR_IDENTITY_PARENT_PHASE3_EVIDENCE_AND_V1_EXACT16_EXACT8_INVARIANCE_CAUSAL_RED_FREEZE_ONLY
```

Its state is `DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED`.  It is not
issued or usable by publication of this Design.  D2, final issuance,
Candidate/Event1, runtime/preflight, Readiness/Failure, Reservation,
Attempt/exact134, terminal, P2, Product Read, and Cycle acceptance remain
authority classes only; no concrete later token is defined here.

# 13. Scope and prohibited effects

This authority changes exactly five Cocolon documentation paths:

```text
NEW:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch003_OperationalAdmissionV2_
DirectEvent1ConnectionSourceIdentityUnreachable_
EpochInvalidationAndRecoveryEpoch004_ParentDesign_ReadOnly_20260730.md

NEW:
the same stem with
_BodyFree_Receipt_20260730.json

NEW:
the same stem with
_Handoff_20260730.md

MODIFY:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md

MODIFY:
Cocolon_前提資料/07_latest_snapshot_diff.md
```

Forbidden:

- mashos-api production, test, fixture, dependency, lock, or configuration
  changes;
- pytest collect, pytest execution, or `pytest.main`;
- current Reference/OA v2 rewrite, replacement, reissue, reformat, or
  scope/freshness weakening;
- runtime materialization;
- Candidate or Event1 creation/publication;
- source-baseline lock;
- Readiness, Failure, Reservation, Attempt, or formal exact134;
- same-epoch retry or successor OA;
- dual-root, stale-ref, detached historical, ref-rewind, or synthetic
  repository current credit;
- automatic transition to D1, D2, final issuance, Event1, or later;
- P2, Product Read, Cycle001 acceptance; and
- any GitHub changed path outside the exact5.

# 14. Independent verification

Three read-only lanes independently covered:

1. work rules, current normative contract, supplied local material, and
   full causal role order;
2. actual source, AST, imports, calls, exact3/exact7 membership, repository
   checks, v1 keysets, and function source hashes; and
3. actual artifact paths, history, blobs, raw/logical/external identities,
   corrected reconciliation, and state/effect counts.

All lanes reported blocker exact0.  They performed no edit, pytest,
commit, GitHub write, route decision, authority issuance, or final
judgment.  Karen independently checked their claims against actual source
and artifacts and retains all publication and final-decision
responsibility.

Before GitHub reflection Karen must recheck the latest repository heads,
target exact paths, NEW absence, MODIFY unchanged state, and mashos-api
freshness.  After reflection Karen must refetch every exact5 target,
compare exact content, recompute new artifact blob/raw/logical and P0
identity, verify the write-commit aggregate changed-path set is exact5,
and confirm current main contains all results.

# 15. Facts, inference, and Karen's opinion

## 15.1 Confirmed facts

- The current source still equals the source bound by OA v2.
- Reference and OA v2 are postverified, immutable, and canonically
  unconsumed.
- Event1 is absent, Candidate count is zero, and the source baseline is
  unlocked.
- Event1 owner and independent validation are v1-specific.
- the v2 Event1 authority constant is `None`.
- the v2 parent route stops after phase2.
- the minimum direct-connection exact3 are inside the OA-bound
  formal-owner exact7.
- current OA v2 invalidates on source commit/tree or clean-state drift.
- no second executor provenance lane exists in Event1 exact23 or Candidate
  exact9.

## 15.2 Actual-source-derived inference

Implementing the required connection necessarily advances the source and
formal-owner identity before Event1.  The current OA v2 would then be stale
under its own frozen freshness condition.  Therefore the same-OA
Epoch003 direct Event1 path is structurally unreachable.

The compliant order is to close Epoch003 active eligibility, implement the
connection in Epoch004 before Reference/OA, and then let new Reference/OA
bind the completed source.

## 15.3 華恋の意見

守るべきなのは、成立済みの証拠を「後から使いやすい意味」に変えないことです。
Epoch003のReferenceとOA v2は偽でも失敗物でもありません。正しく成立した
pre-Event1履歴ですが、必要な接続実装より先にsourceを固定したため、未来の実行権
としては再利用できません。

古いsourceをsubject、新しいsourceをexecutorとして使うと、Event1がlockしたと
主張するcodeと、その主張を認めたcodeが別になります。これはowner／independent
分離を形式だけにします。接続を先に実装し、その完成sourceを後からReferenceと
OAが束縛するEpoch004の順序が、履歴とcurrent strictnessを同時に守る正規経路だと
判断します。

# 16. Required STOP

```text
RECOVERY_EPOCH003_EPOCH_INVALIDATED_REFERENCE_AND_OPERATIONAL_ADMISSION_V2_IMMUTABLE_HISTORICAL_UNCONSUMED_NOT_REUSABLE_RECOVERY_EPOCH004_P0_PARENT_DESIGN_FROZEN_DEFINED_NOT_STARTED_SOURCE_BASELINE_UNLOCKED_CANDIDATE_UNALLOCATED_EVENT1_NOT_CREATED_CAUSAL_RED_NOT_AUTHORIZED_AUTHORITY_STOP
```

No next stage is automatically authorized.
