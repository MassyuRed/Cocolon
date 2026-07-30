---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch003_prestart_d2_receipt_identity_preimage_mismatch_downstream_credit_partial_epoch004_p0_disposition_reconciliation
title: "NLS v3 Step11 Cycle001 Recovery Epoch003 prestart D2 receipt identity-preimage mismatch — downstream active-credit and partial Recovery Epoch004 P0 publication disposition reconciliation"
revision_date: "2026-07-30"
status: "CONTRACT_RECONCILIATION_DESIGN_FROZEN_AUTHORITY_STOP"
body_free: true
automatic_progression: false
---

# 0. Decision

Approved authority:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_PRESTART_D2_RECEIPT_SELF_HASH_AND_EXTERNAL_IDENTITY_PREIMAGE_CONTRACT_MISMATCH_DOWNSTREAM_ACTIVE_CREDIT_IMPACT_AND_PARTIAL_RECOVERY_EPOCH004_P0_PUBLICATION_DISPOSITION_CONTRACT_RECONCILIATION_DESIGN_ISSUANCE_INDEPENDENT_VERIFICATION_AND_DESIGN_ONLY
```

This Design records one additive, read-only contract reconciliation:

```text
Recovery Epoch003 prestart D2 receipt bytes:
IMMUTABLE_HISTORICAL

declared receipt_sha256 / external identity:
EMPTY_SELF_PREIMAGE_REPRODUCIBLE
DELETE_SELF_NORMATIVE_CONTRACT_NOT_SATISFIED
NON_CREDIT

final issuance / Reference / OperationalAdmission v2 /
source-identity reconciliation:
IMMUTABLE_HISTORICAL
INTRINSIC_BYTES_AND_SELF_IDENTITIES_RETAINED
DOWNSTREAM_ACTIVE_EXECUTION_CREDIT_NOT_ESTABLISHED

published Recovery Epoch004 P0 exact3:
IMMUTABLE_PUBLISHED_PARTIAL_INCOMPLETE_NON_CREDIT

Recovery Epoch004 P0:
NOT_ESTABLISHED

Recovery Epoch004:
NOT_STARTED

source baseline:
UNLOCKED

Candidate:
UNALLOCATED

Event1 / Readiness / Reservation / Attempt:
NOT_CREATED / NOT_CREATED / NOT_CREATED / NOT_CREATED

formal exact134:
NOT_INVOKED

automatic progression:
false

AUTHORITY_STOP
```

This reconciliation does not rewrite, correct, replace, rename, reissue,
or reinterpret any existing receipt.  In particular, the independently
derived delete-self diagnostic values are not promoted to current
identities.  It also does not complete the partially published Recovery
Epoch004 P0, activate its embedded D1 token, or authorize a corrective P0.

# 1. Governing material and current entry

## 1.1 Normative sources

The governing documents are:

```text
Cocolon_前提資料/
11_cocolon_github_transport_and_session_continuity.md
# CURRENT_NORMATIVE_CONTRACT

Cocolon_前提資料/
07_latest_snapshot_diff.md

EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md

EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_Lineage02_
Event1V2_BootstrapPreflightContractUnreachable_
SourceBaselineInvalidationAndRecoveryEpoch003_
ParentDesign_ReadOnly_20260729.md

EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch003_
FinalSourceBootstrapReferenceRuntimeClosureAndOperationalAdmissionContractUnreachable_
P0ParentAddendum_Design_ReadOnly_20260729.md
```

The current GitHub Plan is the operative plan.  The supplied local
Detailed Design, long-term roadmap, and older local Plan were also read as
architectural context.  They do not replace the newer tracked Plan or the
current transport contract.

## 1.2 Repository entry

Fresh current state at Design entry:

```text
Cocolon local clean HEAD / tree:
1942156b9f14967a1c7eb3ab9eff14960a08bb0d
88dd394fa71e64ea353cb25e97c234353d445b6e

Cocolon GitHub main observed through the connected GitHub app:
1942156b9f14967a1c7eb3ab9eff14960a08bb0d

Cocolon supplied starting anchor / tree:
56bb2efb85e8ce166980eb499f24cfdf98979c61
0883244c5b4391f2c6a9fd396a639110809b1f00

mashos-api fixed HEAD / tree / origin-main:
97e8dd4d7021b8a1781d534aaa603f71dffa41b9
cd3fc3da0976bbbcb708319e4bc8cbbb6a73ec19
97e8dd4d7021b8a1781d534aaa603f71dffa41b9

Cocolon / mashos-api dirty path count:
0 / 0
```

The supplied Cocolon anchor is an ancestor of current Cocolon main.
Current Cocolon contains only the later partial Recovery Epoch004 P0
exact3 in addition to that anchor.  mashos-api has not drifted from the
fixed OperationalAdmission-bound commit/tree.

The materialized Cocolon checkout's remote-tracking `origin/main` was not
used as current evidence because it retained the supplied anchor.  Current
GitHub main was independently observed as `1942156...` through the
connected GitHub app, and the clean local HEAD/tree exactly matched that
observed main.  No stale remote-tracking ref receives current credit.

At entry:

```text
Epoch003 Event1 path:
ABSENT

Candidate allocation count:
exact0

source baseline:
UNLOCKED

operational runtime / Readiness / Failure:
0 / 0 / 0

Reservation / Attempt / formal exact134:
0 / 0 / 0
```

# 2. Frozen receipt preimage contract

## 2.1 Body-free receipt self-hash

The Recovery Epoch003 P0 Parent Design freezes body-free receipt
`receipt_sha256` as:

```text
SHA-256(
  UTF-8(
    canonical sorted compact JSON of the receipt object
    after deleting the receipt_sha256 field
  )
)

trailing LF in logical preimage:
0
```

The P0 Parent Addendum repeats the same delete-self rule.  The serializer
may add exactly one LF to the complete on-disk JSON bytes; that LF belongs
to the raw artifact, not to the logical preimage.

## 2.2 Generic publication external identity

The generic publication identity is strict exact10:

```text
artifact_role
body_free
git_blob_sha1
identity_sha256
logical_artifact_sha256
path
publication_commit_sha1
raw_sha256
repository_full_name
schema_version
```

Its `identity_sha256` is SHA-256 over canonical sorted compact JSON of the
other exact9 fields after deleting `identity_sha256`, with no trailing LF.

Replacing the self field with an empty string is not the same preimage.
No frozen design or actual-source validator provides an
`EMPTY_SELF_FIELD` compatibility lane.

## 2.3 Actual implementation

Actual source implements the same semantics in both owner and independent
lanes:

```text
ai/services/ai_inference/
emlis_ai_recovery_epoch002_sequence_ledger_v3.py

_recovery_epoch003_hash_without
-> deepcopy mapping
-> pop(self key)
-> canonical artifact_sha256

ai/tools/
emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py

_hash_without
-> deepcopy mapping
-> pop(self key)
-> canonical artifact_sha256
```

The independent historical receipt path requires:

```text
body.receipt_sha256
== external envelope logical_artifact_sha256
== _hash_without(body, "receipt_sha256")
```

before its byte-form disposition can succeed.  A noncanonical historical
byte lane can classify `CANONICAL_BYTES_MISMATCH` only after the logical
self-hash is valid.  It does not admit a self-preimage mismatch.

The generic exact10 validator likewise requires:

```text
identity.identity_sha256
== _hash_without(identity, "identity_sha256")
```

The import graph resolves canonical JSON and artifact hashing through
`emlis_ai_nls_v3_artifact_contract`.  AST and call-graph inspection found
no empty-self fallback, no alternate self-hash function, and no
schema-specific exception for this D2 receipt.

# 3. Prestart D2 receipt mismatch

## 3.1 Immutable publication evidence

Target receipt:

```text
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch003_
PrestartPredecessorActualGitBytesExact6_
OperationalAdmissionV2SchemaDispatchTransientIdentityBoundHistoricalReceiptByteForm_
D2_ImplementationAndTargetedGREENOnly_BodyFree_Receipt_20260730.json
```

Actual Git evidence:

```text
publication commit / tree / parent:
15b38f2db38359bd88ecd3e0a8d8c3ed36a16156
b47fc75be54e9649f2b12f4e45a5b2590b34e584
d43df1d94b196daa810a52e3d233c8656b8ad84d

Git blob:
119b79321c1ad0420d4b1aea79ed10c70c399ed1

raw SHA-256:
e0cbd49b6c1e041608a7dcc9a7ddbb4cf7111e57361af0bf9053ff370b70a7ac

byte count / CR count / trailing LF count:
4139 / 0 / exact1

publication blob equals current main blob:
true

publication changed path count:
exact1
```

The complete bytes are canonical sorted compact JSON plus exactly one LF.
Therefore this is not a raw-byte drift, noncanonical JSON, or trailing-LF
logical-preimage issue.

## 3.2 Declared and reproduced values

The receipt declares:

```text
receipt_sha256:
0160be7034f29ae3dcc3d0ddd6d3d92741a0bfa984e98417ca324d078ba70118

external identity:
97f62f881ac8035bb8fcba15d153ca38637bc659196a74f5f0f0e4849a4686c6
```

Both values reproduce exactly only under:

```text
observed preimage mode:
REPLACE_SELF_FIELD_WITH_EMPTY_STRING

receipt self field retained as:
"receipt_sha256":""

external identity self field retained as:
"identity_sha256":""

trailing LF in preimage:
0
```

The frozen and actual-source normative mode is:

```text
DELETE_SELF_FIELD
```

The two modes produce different JSON keysets and different hashes.

## 3.3 Delete-self diagnostic values

Independent recomputation under the frozen rule gives:

```text
receipt body minus receipt_sha256:
b93940c6c8d98f9627f366b4ae957a8b0953d30ff2d9f44c8209560cc72d4f00

published exact10 envelope minus identity_sha256,
while retaining its published logical value 0160be...:
8cd628fdd881803def2699edad56806b91357897779623f44c6721c69e3165e3
```

These are diagnostic values only:

- `b93940...` is not stored in the immutable receipt;
- `8cd628...` still describes an envelope whose
  `logical_artifact_sha256` is the non-credit declared `0160be...`; and
- changing either stored field would require a rewrite or reissue that
  this authority forbids.

Therefore none of `0160be...`, `97f62f...`, `b93940...`, or `8cd628...`
may be read as a newly corrected current-credit identity.  The actual
publication bytes, commit, blob, and raw identity remain truthful
historical evidence.

## 3.4 Closed disposition

```text
receipt bytes:
IMMUTABLE_HISTORICAL

declared logical identity:
EMPTY_SELF_REPRODUCIBLE_DELETE_SELF_CONTRACT_MISMATCH_NON_CREDIT

declared external identity:
EMPTY_SELF_REPRODUCIBLE_DELETE_SELF_CONTRACT_MISMATCH_NON_CREDIT

delete-self recomputations:
DIAGNOSTIC_ONLY_NOT_CURRENT_IDENTITIES

rewrite / replacement / reissue / rename:
FORBIDDEN
```

# 4. Downstream causal-credit impact

## 4.1 Direct and transitive dependency graph

The downstream relationship is:

```text
prestart D2 receipt declared external identity 97f62f...
    |
    | direct fixed-entry dependency
    v
final Reference/OA issuance execution and final-issuance receipt 2c52bb...
    |
    +--> published Reference 190cb3...
    |
    +--> published OperationalAdmission v2 80af08...
    |
    | direct dependency from reconciliation receipt
    v
source-identity reconciliation receipt 2931b8...
    |
    | included in predecessor interpretation
    v
partial Recovery Epoch004 P0 Design/receipt/handoff and e6659e...
```

The final-issuance receipt directly records:

```text
entry.d2_targeted_green_receipt_external_identity_sha256:
97f62f881ac8035bb8fcba15d153ca38637bc659196a74f5f0f0e4849a4686c6
```

Its Result and Handoff freeze the same value as the fixed entry.

The Reference and OperationalAdmission v2 bodies do **not** contain
`97f62f...`.  The OA v2 predecessor exact8 also does not directly contain
the prestart D2 receipt.  Its exact8 binds Epoch003 P0, bootstrap D1/D2,
P0 Parent Addendum, OperationalAdmission contract D1/D2, Reference, and
the exact8 self-hash.

This distinction controls the disposition: the Reference/OA intrinsic
objects are not byte-corrupted by the D2 receipt.  The break is in the
authorization and causal issuance chain that used the invalid D2
external identity as its fixed precondition.

## 4.2 Typed disposition matrix

| Artifact | Intrinsic bytes/self identity | Dependency on mismatched D2 | Current disposition |
|---|---|---|---|
| prestart D2 receipt | bytes/blob/raw are exact; declared logical/external fail delete-self | origin | `IMMUTABLE_HISTORICAL_DECLARED_IDENTITIES_NON_CREDIT` |
| final-issuance receipt `2c52bb...` | its own bytes/logical/external are reproducible | direct fixed-entry binding of `97f62f...` | `IMMUTABLE_HISTORICAL_CAUSAL_ISSUANCE_CREDIT_NOT_ESTABLISHED` |
| Reference `190cb3...` | intrinsic body/logical/external are reproducible | issued in the affected final-issuance execution; no direct literal | `IMMUTABLE_HISTORICAL_ACTIVE_REFERENCE_CREDIT_NOT_ESTABLISHED` |
| OA v2 `80af08...` | intrinsic body/logical/external are reproducible | issued in the affected final-issuance execution; no direct literal in exact8 | `IMMUTABLE_HISTORICAL_ACTIVE_ADMISSION_CREDIT_NOT_ESTABLISHED` |
| source reconciliation `2931b8...` | corrected receipt self/external identity is reproducible | directly binds final issuance `2c52bb...` and treats its credit as established | `IMMUTABLE_HISTORICAL_ACTIVE_RECONCILIATION_CREDIT_NOT_ESTABLISHED` |
| partial Epoch004 P0 exact3 | each path blob/raw is exact; receipt self-hash and `e6659e...` mathematics reproduce | exact16 includes the invalid D2 row and reports blocker exact0 | `IMMUTABLE_PUBLISHED_PARTIAL_INCOMPLETE_NON_CREDIT` |

`2c52bb...`, `190cb3...`, `80af08...`, and `2931b8...` remain identifiers
of the exact historical objects that were published.  Their mathematical
reproducibility does not repair the invalid prerequisite and does not
grant current execution, Reference, admission, reconciliation, or
successor P0 credit.

This Design does not call the Reference or OA body false.  It does not
claim mashos-api source drift.  It records that current active credit
cannot be derived through the broken D2-to-final-issuance authority edge.

## 4.3 Fail-closed consequence

Actual owner and independent routes turn invalid historical identity
derivations into stable failures and no derived core.  Formal parent v2
independently verifies Reference then OA and fails closed before phase3
or runtime on any issue.  `_RECOVERY_EPOCH003_V2_EVENT1_AUTHORITY`
remains `None`.

There is no permitted repair through:

- interpreting empty-self as delete-self;
- substituting `b93940...` or `8cd628...`;
- rewriting or reissuing the D2 receipt;
- rewriting, replacing, or reissuing Reference/OA;
- using the final-issuance or reconciliation receipt to validate its own
  invalid prerequisite;
- same-epoch retry or successor OA;
- dual-root, stale `origin/main`, detached historical checkout, local ref
  rewind, or synthetic repository; or
- treating published bytes as proof of active execution authorization.

# 5. Partial Recovery Epoch004 P0 publication

## 5.1 Actual publication exact3

The earlier authority approved exact5, but current Git history contains
only the following exact3:

| Member | Publication commit / tree | Git blob | Raw SHA-256 |
|---|---|---|---|
| Parent Design | `734aa36ecba8012b21860d4df3d3700b8164409d` / `419d1c5cd11488af79e4668f5fdf42b1e52dd2bb` | `43a90a9d7937ed3be818121929df2c8d30a9b424` | `7dcd50bc1f0fe745ae177cc5cf689f7773c043d6be06ccac54a54200b8c38784` |
| body-free receipt | `734aa36ecba8012b21860d4df3d3700b8164409d` / `419d1c5cd11488af79e4668f5fdf42b1e52dd2bb` | `7c559f55dc08bf362bee4c915baa649583721a3d` | `5459c128e1cfba2bde85304db3eccc9f6e8ef8237f19de32345019b9be35af90` |
| Handoff | `1942156b9f14967a1c7eb3ab9eff14960a08bb0d` / `88dd394fa71e64ea353cb25e97c234353d445b6e` | `e11c06ff9c1da28c08562cc2aec84f4877fa6637` | `3d556045c80d2136785019df4014ba050f0f80c2eb9dd35c0dec1d809a65eef5` |

The Design/receipt publication parent is
`56bb2efb85e8ce166980eb499f24cfdf98979c61`; the Handoff publication
parent is `734aa36ecba8012b21860d4df3d3700b8164409d`.

Every current blob equals its publication blob.  Across the two write
commits:

```text
per-commit changed path count:
exact2 / exact1

aggregate unique changed path count:
exact3

canonical C-sorted ordered-path-array SHA-256:
ad2874295816b007ca15521a01bc32ee873289fb83ee95fc526cfd95682f3b5f
```

The two required MODIFY paths were not changed:

```text
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md

Cocolon_前提資料/
07_latest_snapshot_diff.md
```

## 5.2 Internal identity mathematics

The partial receipt's delete-self logical identity is reproducible:

```text
dc5534919d301589a43e32998c2a5b97cf227f68bb5b462b05f11871ceb7d707
```

The strict exact6 P0 object constructed from the actual Design and receipt
publication identities is also mathematically reproducible:

```text
e6659e9366b2c03b0ceef16bf2e0f8604d5e11226bbfd3fb1b070f9ab8bcac6a
```

Those computations prove which bytes were published.  They do not prove
that the P0 decision became effective.

## 5.3 Why P0 was not established

The partial receipt freezes:

```text
decision_effective_when:
EXACT5_REACHABLE_ON_COCOLON_MAIN_EXACT_CONTENT_POSTFETCH_VERIFIED_AND_
AGGREGATE_CHANGED_PATH_SET_EXACT5
```

That condition was not met: the aggregate was exact3, not exact5.  In
addition, its immutable exact16 record array contains the prestart D2 row
with declared logical `0160be...` and external `97f62f...`.  The row's
literal disposition is
`IMMUTABLE_HISTORICAL_NOT_ACTIVE_EXECUTION_CREDIT`; however, the partial
receipt treats those logical/external values as verified identities and
reports `identity_state_issue_count=0` and `blocker_count=0`.

Therefore:

```text
partial exact3 bytes:
IMMUTABLE_PUBLISHED_HISTORY

partial exact3 current credit:
NON_CREDIT

e6659e...:
MATHEMATICALLY_REPRODUCIBLE_HISTORICAL_OBJECT
NOT_A_CURRENT_P0_EXTERNAL_IDENTITY

Recovery Epoch004 P0:
NOT_ESTABLISHED

Recovery Epoch004:
NOT_STARTED

administrative invalidation declared by partial P0:
NOT_ESTABLISHED_AS_CURRENT_STATE_TRANSITION
```

This reconciliation neither completes the missing two paths under the
old authority nor edits the old exact3.  Completing them now would hide
the failed exact5 completion condition and would preserve the invalid D2
classification.

## 5.4 Old embedded D1 token

The partial Design froze:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_OPERATIONAL_ADMISSION_V2_EVENT1_CONNECTION_OWNER_INDEPENDENT_SCHEMA_DISPATCH_ACTUAL_GIT_SOURCE_SUBJECT_OWNER_EXECUTOR_INDEPENDENT_EXECUTOR_IDENTITY_PARENT_PHASE3_EVIDENCE_AND_V1_EXACT16_EXACT8_INVARIANCE_CAUSAL_RED_FREEZE_ONLY
```

Its corrected disposition is:

```text
HISTORICAL_LITERAL_NON_CREDIT
NOT_ISSUED
NOT_CURRENT_NEXT_AUTHORITY
```

The token cannot be activated by this reconciliation or by later
completion of the two omitted paths.

# 6. Corrected current state

The state after this Design becomes effective is:

```text
Recovery Epoch003 artifact set:
IMMUTABLE_HISTORICAL

Recovery Epoch003 active execution credit:
NOT_ESTABLISHED

Recovery Epoch003 Candidate / Event1:
UNALLOCATED / NOT_CREATED

Recovery Epoch003 Reference / OA consumption evidence:
UNCONSUMED

Recovery Epoch003 Reference / OA active reuse:
NOT_ALLOWED

Recovery Epoch003 administrative invalidation from partial P0:
NOT_ESTABLISHED_AS_CURRENT_STATE_TRANSITION

Recovery Epoch004 P0:
NOT_ESTABLISHED

Recovery Epoch004:
NOT_STARTED

inherited active execution credit:
NONE

source baseline:
UNLOCKED

Candidate:
UNALLOCATED_AND_MUST_BE_DISTINCT_FROM_ALL_PRIOR_CANDIDATES

Event1 / operational runtime / Readiness / Failure:
NOT_CREATED / NOT_MATERIALIZED / NOT_CREATED / NOT_CREATED

Reservation / Attempt / formal exact134:
NOT_CREATED / NOT_CREATED / NOT_INVOKED

P2 / Product Read / Cycle001 acceptance:
NOT_STARTED / NOT_STARTED / NOT_ACCEPTED

automatic progression:
false
```

`UNCONSUMED` is an observation over the canonical artifact set: Event1 is
absent and no canonical consumption evidence exists.  It is not a grant
of active reuse.

# 7. Additive corrective Recovery Epoch004 P0 contract

## 7.1 Exactly one next authority

Only one concrete next authority is defined by this Design:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_ADDITIVE_CORRECTIVE_P0_PARENT_DESIGN_AFTER_EPOCH003_PRESTART_D2_RECEIPT_IDENTITY_PREIMAGE_CONTRACT_MISMATCH_AND_PARTIAL_P0_NON_CREDIT_ISSUANCE_INDEPENDENT_VERIFICATION_AND_DESIGN_ONLY
```

State:

```text
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED
```

This is not an issued or executable authority.  Mash must separately
review and approve its exact token.  `automatic progression` is false.

## 7.2 Required corrective P0 properties

A separately approved corrective P0 must be additive.  It must not modify,
delete, rename, replace, or complete the old partial exact3.  It must
publish a distinct new Parent Design, body-free receipt, and Handoff and
update the tracked Plan and latest snapshot only under its own explicit
path authority.

It must freeze at least:

1. the D2 receipt bytes as immutable history and its declared
   `0160be... / 97f62f...` identities as non-credit;
2. `b93940... / 8cd628...` as diagnostics only;
3. final issuance, Reference, OA v2, reconciliation, and partial P0 exact3
   as immutable history without active credit;
4. Recovery Epoch004 `DEFINED_NOT_STARTED` only after its own complete
   publication condition is met;
5. source baseline `UNLOCKED`;
6. Candidate `UNALLOCATED` and distinct from every prior Candidate;
7. Event1, Readiness, Reservation, and Attempt `NOT_CREATED`;
8. no active execution credit inherited from Epoch003;
9. the immutable predecessor set with typed credit dispositions;
10. Event1 v2 owner/independent schema dispatch and fail-closed unknown,
    mixed, or v2-to-v1 fallback rejection;
11. source subject, owner executor, and independent executor equality at
    the same actual Git repository root, HEAD, tree, module origins, blobs,
    and raw bytes;
12. parent phase3 actual evidence and fail-closed behavior;
13. v1 exact16/exact8 APIs, meanings, and function-level source-hash
    invariants;
14. D1 test, D2 implementation, final Reference/OA, Candidate/Event1, and
    post-Event1 stages in strict causal order;
15. final Reference/OA binding only the D2-complete final source;
16. exactly one fresh D1 authority token, distinct from the old
    historical non-credit literal, and inactive until separate Mash
    approval; and
17. `automatic_progression=false`.

The future order remains:

```text
corrective Recovery Epoch004 P0
-> separate D1 causal RED
-> separate D2 implementation and targeted GREEN
-> final D2-complete-source-bound Reference / OperationalAdmission
-> distinct Candidate nested in Event1 / Event1 postverification
-> post-Event1 operational runtime and preflight
-> observation plus exactly one matching Readiness or Failure
-> one-shot Reservation after Readiness only
-> runner-owned Attempt / formal exact134 at most once
-> later terminal and acceptance gates under further authorities
```

No stage in that order is executed by this authority.

# 8. Current exact5 publication contract

## 8.1 Authorized paths

This authority changes exactly five Cocolon documentation paths:

```text
NEW:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch003_
PrestartD2ReceiptIdentityPreimageContractMismatch_
DownstreamActiveCreditAndPartialRecoveryEpoch004P0PublicationDisposition_
ContractReconciliation_Design_ReadOnly_20260730.md

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

The decision becomes effective only when:

```text
all exact5 are reachable on Cocolon main
AND each target postfetch is exactly equal to the locally verified bytes
AND this authority's aggregate changed-path set is exact5
AND current GitHub latest contains every result
```

GitHub transport and completion follow only the
`CURRENT_NORMATIVE_CONTRACT`.  No historical single-commit, direct-child,
whole-tree, SSH-key, lease, or durable-store condition is revived.

## 8.2 New receipt external identity

The new body-free reconciliation receipt uses the delete-self
`receipt_sha256` rule in section 2.1.  After its Design/receipt publication
commit exists, its publication external identity is derived as the strict
generic exact10 in section 2.2.

The receipt external identity may be recorded only after actual Git
publication and postfetch of its exact bytes.  It is recorded in the
Handoff, Plan, and snapshot; it is not guessed or made circular inside the
receipt itself.

## 8.3 Prohibited effects

Forbidden:

- any mashos-api production, test, fixture, dependency, lock, or
  configuration change;
- pytest collect, pytest execution, or `pytest.main`;
- runtime materialization;
- D2 receipt rewrite, correction, reissue, replacement, or diagnostic
  identity promotion;
- Reference, OA v2, final-issuance receipt, reconciliation receipt, or
  partial P0 exact3 rewrite/reissue;
- Candidate or Event1 allocation/publication;
- source-baseline lock;
- Readiness, Failure, Reservation, Attempt, or formal exact134;
- same-epoch retry or successor OA;
- old partial D1 token use;
- corrective P0 execution;
- automatic transition to D1, D2, final issuance, Event1, or later;
- P2, Product Read, or Cycle001 acceptance; and
- any GitHub changed path outside this exact5.

# 9. Independent verification

Three read-only independent lanes covered:

1. current work rules, transport contract, current artifacts, exact target
   scope, and current/partial publication history;
2. actual source, AST, import graph, call graph, delete-self semantics,
   fail-closed behavior, and source/Event1 state; and
3. D2 and partial P0 actual Git bytes, blobs, raw/logical/external
   identities, exact path counts, and independent hash recomputation.

The lanes performed no edit, pytest, commit, GitHub write, route decision,
authority issuance, or final judgment.  Karen independently checked the
claims against actual source and artifacts and retains final publication
and judgment responsibility.

Before reflection, Karen must recheck current main, mashos-api fixed
source, NEW-path absence, and MODIFY-path current identities.  After
reflection, Karen must refetch every target, prove exact equality,
recompute blob/raw/logical/external identities, verify aggregate
changed-path exact5, and prove that GitHub latest contains all results.

# 10. Facts, inference, and Karen's opinion

## 10.1 Confirmed facts

- The D2 receipt bytes are canonical sorted compact JSON plus one LF.
- Its declared logical/external values reproduce only by retaining an
  empty self field.
- Frozen designs and actual source require deletion of the self field.
- The final-issuance receipt directly binds the non-credit D2 external
  identity.
- Reference and OA v2 do not directly contain that literal and their
  intrinsic self/external identities reproduce.
- OA predecessor exact8 does not directly include the prestart D2 receipt.
- The corrected source-reconciliation receipt binds final issuance.
- The partial P0 receipt directly records the mismatched D2 row.
- The old P0 decision required exact5, while actual publication changed
  only exact3.
- No Event1, Candidate, baseline lock, runtime, Readiness, Reservation,
  Attempt, or formal exact134 exists.
- mashos-api remains at the fixed clean commit/tree.

## 10.2 Actual-source-derived inference

The mismatch is not limited to an incorrect number in one receipt.  The
invalid external identity was used as the precondition for final
issuance.  Consequently, the exact published Reference and OA objects can
remain intrinsically identifiable while their active execution/admission
credit is not established.  Any later artifact that assumes that causal
credit cannot acquire current credit merely by hashing its own bytes
correctly.

The partial P0 exact3 has a second independent defect: its own exact5
effectiveness condition was never met.  Its internally reproducible
`e6659e...` therefore identifies a historical exact2 anchor object; it
does not establish Recovery Epoch004 P0.

## 10.3 華恋の意見

ここで守るべきなのは、hashが再現できることと、そのartifactが実行権を持つことを
混同しないことです。ReferenceとOAのbytesを「偽」と書き換えるのも、
`b93940...`を正しい値として後付けするのも、どちらも履歴を変えてしまいます。

私は、公開済みbytesはそのまま保持し、D2からfinal issuanceへ渡るcreditだけを
fail-closedで切り分けるべきだと判断します。同じ理由で、exact3だけ公開された
Epoch004 P0を、残り2 pathの後付けで完成扱いにはしません。

次は、今回のdispositionを最初から predecessor contract に含めた別のadditive P0
を作り、完全なexact5 publicationを確認してから初めてEpoch004を
`DEFINED_NOT_STARTED`に置くべきです。それまではsourceをlockせず、Candidateも
Event1も作らないことが、履歴・設計・実装の因果順序を同時に守る正規経路です。

# 11. Required STOP

```text
RECOVERY_EPOCH003_PRESTART_D2_RECEIPT_DELETE_SELF_CONTRACT_MISMATCH_RECORDED_DECLARED_EMPTY_SELF_IDENTITIES_IMMUTABLE_NON_CREDIT_FINAL_ISSUANCE_REFERENCE_OPERATIONAL_ADMISSION_V2_AND_RECONCILIATION_IMMUTABLE_HISTORICAL_ACTIVE_EXECUTION_CREDIT_NOT_ESTABLISHED_RECOVERY_EPOCH004_PARTIAL_P0_EXACT3_IMMUTABLE_NON_CREDIT_P0_NOT_ESTABLISHED_NOT_STARTED_SOURCE_BASELINE_UNLOCKED_CANDIDATE_UNALLOCATED_EVENT1_NOT_CREATED_CORRECTIVE_P0_NOT_AUTHORIZED_AUTOMATIC_PROGRESSION_FALSE_AUTHORITY_STOP
```

No next stage is automatically authorized.
