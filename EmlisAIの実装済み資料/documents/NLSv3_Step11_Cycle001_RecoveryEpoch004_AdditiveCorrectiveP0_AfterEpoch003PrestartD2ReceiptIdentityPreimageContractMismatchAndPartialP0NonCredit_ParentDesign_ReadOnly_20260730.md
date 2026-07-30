---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch004_additive_corrective_p0_parent_design
title: "NLS v3 Step 11 Cycle001 Recovery Epoch004 additive corrective P0 Parent Design"
revision_date: "2026-07-30"
status: "ADDITIVE_CORRECTIVE_P0_PARENT_DESIGN_FROZEN_DEFINED_NOT_STARTED_AUTHORITY_STOP"
body_free: true
automatic_progression: false
---

# 0. Decision

Approved authority:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_ADDITIVE_CORRECTIVE_P0_PARENT_DESIGN_AFTER_EPOCH003_PRESTART_D2_RECEIPT_IDENTITY_PREIMAGE_CONTRACT_MISMATCH_AND_PARTIAL_P0_NON_CREDIT_ISSUANCE_INDEPENDENT_VERIFICATION_AND_DESIGN_ONLY
```

This Parent Design is a distinct additive corrective P0.  It does not
complete, amend, reinterpret, replace, rename, or delete the earlier
partial Recovery Epoch004 P0 exact3.

The decision becomes effective only when this authority's approved exact5
is reachable on Cocolon main, every target has been postfetch-verified
against the exact local bytes, the aggregate unique changed-path set of
Karen's write commits is exact5, and GitHub latest contains all five
results.

When that complete condition is true, the administrative state is:

```text
Recovery Epoch003 active execution credit:
NOT_ESTABLISHED

Recovery Epoch004 additive corrective P0:
FROZEN_POSTVERIFIED

Recovery Epoch004:
DEFINED_NOT_STARTED

source baseline:
UNLOCKED

Candidate:
UNALLOCATED_DISTINCT_FROM_ALL_PRIOR_CANDIDATES

Event1:
NOT_CREATED

operational runtime:
NOT_MATERIALIZED

Readiness / Failure / Reservation / Attempt:
NOT_CREATED / NOT_CREATED / NOT_CREATED / NOT_CREATED

formal exact134:
exact0

automatic progression:
false

AUTHORITY_STOP
```

P0 defines a future execution contract and source boundary only.  It does
not create or execute a test, change production source, issue a final
Reference or OperationalAdmission, allocate a Candidate, publish Event1,
lock a source baseline, materialize an operational runtime, publish
Readiness or Failure, create Reservation or Attempt, or invoke formal
exact134.

# 1. Governing material and whole-project context

## 1.1 Repository and governance sources

The current governing sources were read in their required order:

- Karen-Diary `00_READ_FIRST.md`, operating principles, Mash/Karen memory,
  and the current July 2026 diary;
- `Cocolon_前提資料/work_attitude_rules_for_karen/`, including the work
  start, joint-development, trust-boundary, and subagent rules;
- `Cocolon_前提資料/00_karen_read_first.md`;
- `Cocolon_前提資料/05_cocolon_rule_file_index.md`;
- the current tail of `Cocolon_前提資料/07_latest_snapshot_diff.md`;
- `Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md`
  section `CURRENT_NORMATIVE_CONTRACT`; and
- actual Cocolon and mashos-api source and artifacts at the fixed entries.

Karen-Diary is an operating-memory source, not the Cocolon specification
source.  Product and evidence judgments remain governed by the Cocolon
premises, current artifacts, and actual source.

## 1.2 Local roadmap and design context

The supplied local files were read as architectural context:

```text
Cocolon_EmlisAI_longterm_roadmap_20260608_
P7P8_question_need_observation_20260619(47).md

Cocolon_EmlisAI_ModelFreeNaturalLanguageSurfaceV3_
DetailedDesign_ImplementationOrder_20260714_Revised_Cycle(34).md

NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723(30).md
```

The GitHub-tracked current Execution and Closure Plan is newer than the
supplied local copy and remains the operative Plan.  The local files do not
replace current GitHub bytes.

This corrective P0 preserves their project-level meaning:

- Cocolon's goal is a record experience in which a person's language is
  not processed casually and Emlis returns a reason to continue writing;
- NLS v3 Step11 is evidence and acceptance prerequisite work, not the
  entire product;
- question-system, P7/P8 product-quality, personal-continuity, pilot, and
  release gates remain later layers;
- a completed-looking evidence object cannot replace a failed causal
  predecessor; and
- phase completion and explicit STOP boundaries take precedence over
  apparent forward motion.

# 2. Fresh entry and stop-condition result

## 2.1 Cocolon

Fresh entry:

```text
repository:
MassyuRed/Cocolon

branch:
main

HEAD / origin-main:
ef26b94bdfc365138a3501f169746e7d618b0c4d

tree:
9e4fb43d4ea814cd1421426bccba395743ba9d61

worktree:
CLEAN
```

The supplied Cocolon anchor equals current main.  All three NEW target
paths were absent.  The Plan and latest-snapshot MODIFY targets matched
their current anchor blobs and had no competing local change.

## 2.2 mashos-api

Fresh fixed source:

```text
repository:
MassyuRed/mashos-api

branch:
main

HEAD / origin-main:
97e8dd4d7021b8a1781d534aaa603f71dffa41b9

tree:
cd3fc3da0976bbbcb708319e4bc8cbbb6a73ec19

worktree:
CLEAN
```

The source anchor, current main, tree, and formal-owner identities are
unchanged.  No mashos-api source drift was found.

## 2.3 Stop conditions

The following were independently checked and were not observed:

- mashos-api source drift;
- current reconciliation exact5 byte or identity drift;
- immutable predecessor modification, replacement, or reissuance;
- modification or after-the-fact completion of the old partial P0 exact3;
- Candidate or Event1 publication;
- source-baseline lock;
- operational runtime, Readiness, Failure, Reservation, Attempt, or
  formal exact134 evidence;
- an existing NEW target path;
- a conflicting change to either MODIFY target; or
- a need to change any path outside the approved exact5.

# 3. Confirmed historical facts

## 3.1 Epoch003 prestart D2 receipt

Immutable actual Git publication:

```text
commit:
15b38f2db38359bd88ecd3e0a8d8c3ed36a16156

tree:
b47fc75be54e9649f2b12f4e45a5b2590b34e584

blob:
119b79321c1ad0420d4b1aea79ed10c70c399ed1

raw SHA-256:
e0cbd49b6c1e041608a7dcc9a7ddbb4cf7111e57361af0bf9053ff370b70a7ac

byte count / CR count / trailing LF count:
4139 / 0 / exact1
```

The full bytes are canonical sorted compact JSON plus one publication LF.
There is no Git-byte drift and no trailing-LF ambiguity.  The mismatch is
the self-preimage contract.

Declared receipt logical identity:

```text
0160be7034f29ae3dcc3d0ddd6d3d92741a0bfa984e98417ca324d078ba70118
```

Declared publication external identity:

```text
97f62f881ac8035bb8fcba15d153ca38637bc659196a74f5f0f0e4849a4686c6
```

Both declared values reproduce only when the corresponding self field is
retained and replaced with an empty string.  The frozen design and actual
owner/independent source contract delete the self field.  No empty-self
compatibility lane exists.

Delete-self diagnostics:

```text
receipt:
b93940c6c8d98f9627f366b4ae957a8b0953d30ff2d9f44c8209560cc72d4f00

external:
8cd628fdd881803def2699edad56806b91357897779623f44c6721c69e3165e3
```

These values are diagnostic only.  They are not issued identities and
must not be promoted to current credit.

Frozen disposition:

```text
prestart D2 receipt bytes:
IMMUTABLE_HISTORICAL

0160be... / 97f62f...:
IMMUTABLE_HISTORICAL_NON_CREDIT

b93940... / 8cd628...:
DIAGNOSTIC_ONLY_NOT_AN_IDENTITY
```

## 3.2 Downstream immutable evidence

The exact historical bytes and intrinsic mathematical identities remain:

| Artifact | External identity | Disposition |
|---|---|---|
| final issuance | `2c52bb50256bdf4c9bf456f33925f4bc868ecbef3001032f08290853f2f73c94` | immutable historical; causal issuance credit not established |
| Reference | `190cb3cf0749cf8fcdd9ddc9fdfdd8e47dffb03e35a74c74472e788bab204864` | immutable historical; active Reference credit not established |
| OperationalAdmission v2 | `80af08a59a37eacdcb38e2c1004e01dcf85e26fac11f75a56e8adb79d92abcd8` | immutable historical; active admission credit not established |
| source-identity reconciliation | `2931b88a4c62a0bd12ffa5ec5043dc740b821750635d5bfa0377bd80e80ee173` | immutable historical; active reconciliation credit not established |

The final-issuance fixed entry directly uses the non-credit D2 external
identity.  Reference and OperationalAdmission v2 do not directly contain
that literal, and the OperationalAdmission predecessor exact8 does not
directly contain the D2 receipt.  Their own byte and identity mathematics
remain valid, but downstream self-consistency cannot establish the broken
causal authority edge.

This Design does not claim that Reference or OperationalAdmission bytes
are false.  It does not claim that mashos-api had drifted.  No Event1
exists, so the canonical artifact set contains no OperationalAdmission
consumption record; this is not a claim about unobservable private use.

Independent recomputation also makes the historical preimage mode of the
source-identity reconciliation explicit:

```text
receipt blob / raw / delete-self logical:
740b4e85cced7a276682d4655bec7be6816e8fa8
b23479d3f01acd17a08e316a09a94056e7a834b3fd8dd6ab126e5f3345446c51
5376489c7cb905187eacfcd05022040bc9956f5d1ae074275c96c35270b4e843

historical external exact9 preimage:
DELETE_IDENTITY_SHA256_CANONICAL_SORTED_COMPACT_JSON_UTF8_PLUS_EXACT1_LF

historical external identity:
2931b88a4c62a0bd12ffa5ec5043dc740b821750635d5bfa0377bd80e80ee173

current generic no-LF diagnostic:
da16062868effa4ec8c3325cd8d096cdf486eda266b3e707eeafc9a372630967
```

Thus `2931...` remains its exact historical mathematical object; it is not
described as conforming to the current generic no-LF publication
contract.  `da1606...` is diagnostic only and is not promoted to an
identity.  No historical byte or value is changed or reissued.

## 3.3 Current contract-reconciliation evidence

The current reconciliation is a complete exact5 publication.  Its
Design/receipt publication anchor is:

```text
commit / tree:
ae3a90d50d2411cc548008c58a21b345ebfc9a29
f766faac8163b410c7d5270745dbca75ec2b8aa5
```

Its final GitHub latest anchor is:

```text
commit / tree:
ef26b94bdfc365138a3501f169746e7d618b0c4d
9e4fb43d4ea814cd1421426bccba395743ba9d61
```

Current exact5 identities:

| Role | Git blob | Raw SHA-256 |
|---|---|---|
| reconciliation Design | `00fcf95d97cb1e994d2a98c4acdf15f2c9790d7d` | `bc0bdd6e134517e90f82a9012de418f6d6c06498a3b29cf94dab7347fe02f985` |
| reconciliation receipt | `71798663e56d77e4b092dd5efd6d8999fb9fd81e` | `8ee1149049dc3f37d974baf707fff784848c6105de0ab7557853bc09b327716a` |
| reconciliation Handoff | `99d087696aa8646282d198f65651d979de7c6589` | `b9680d0fef363b170ec8efc6037f281de9485643ffee047360e17bdb574f631b` |
| current Plan | `e8ab4270c55bd5112e4579afc9c78f928e54a656` | `69487756d3eb329a4d132da55aecad808943f1ba8059cfe9040b072dac838259` |
| current snapshot | `dd7390fae3d63ffada6beb2db0c93ac39b7ff540` | `f8d8abec73b08289a9edd3d25cbb1c8acebb488203567baf8c0f64ece19cef58` |

Receipt logical identity:

```text
b8a8789988b57961ccfc8edb84e8612ed38b5205153da651fc3886e4ca5ebf24
```

Current reconciliation external identity:

```text
c9eb76e54e6d956e9f082f46fdaf71abe6068a33a379fcb3c4b6c3c267542649
```

The logical identity deletes `receipt_sha256`; the strict exact10
publication identity deletes `identity_sha256`.  Both use sorted compact
UTF-8 JSON without a trailing LF.  This external identity is the typed
corrective-disposition predecessor for the additive corrective P0.

## 3.4 Earlier partial Recovery Epoch004 P0

The old publication changed only exact3 paths:

```text
Parent Design / receipt commit:
734aa36ecba8012b21860d4df3d3700b8164409d

Handoff commit:
1942156b9f14967a1c7eb3ab9eff14960a08bb0d

aggregate unique changed-path count:
exact3
```

Its frozen decision condition required exact5, including the Plan and
latest snapshot.  That condition was not satisfied.

The partial receipt's logical self-hash and its mathematical exact6 object
reproduce.  The latter is:

```text
e6659e9366b2c03b0ceef16bf2e0f8604d5e11226bbfd3fb1b070f9ab8bcac6a
```

Frozen disposition:

```text
old exact3:
IMMUTABLE_PUBLISHED_PARTIAL_INCOMPLETE_NON_CREDIT

e6659e...:
MATHEMATICAL_HISTORICAL_OBJECT_NOT_CURRENT_P0_IDENTITY

old administrative transition:
NOT_ESTABLISHED

old embedded D1 token:
HISTORICAL_LITERAL_NON_CREDIT_NOT_ISSUED_NOT_CURRENT_NEXT_AUTHORITY
```

The old exact3 must not be altered or completed by adding its missing
paths later.

# 4. Actual source, AST, import graph, and call graph

## 4.1 Fixed formal-owner source

The OperationalAdmission-bound formal-owner set is exact7 and retains
aggregate identity:

```text
43e6414e81cdc74fbfad73bb4992988f982c6114d6807150dd13c8f338833ffe
```

The mandatory direct exact3 are members of that exact7:

| Path | Git blob | Raw SHA-256 |
|---|---|---|
| `ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py` | `1a3bea7536ce671a56f701ea2ba0acb1a9530536` | `a063af595ba70b8790ed7e6259cd1cc5bf1d565bd267ca8c589d9792ab5a4815` |
| `ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py` | `7e963598ef32ad8f0c88508c36fe5fe5a32dd32e` | `b9c2ada98c4a3f6e390f739335f45e7de2f542596447b1815a0c8c9b9094237a` |
| `ai/tools/emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py` | `289f2d6852768a895e72c900f61c670892574102` | `f334e5628449239161b8c164b2d347181ef8179618ea435a73efbae5f4232e22` |

All exact7 Python modules parse as AST without syntax errors.  The
independent verifier does not import or forward the sequence-ledger owner
validator.  Its v2 Reference and OperationalAdmission paths independently
read actual Git source and artifact identities.

## 4.2 Current Event1 gap

The owner Event1 call route remains:

```text
validate_recovery_epoch003_sequence_event1_contract_state
-> _recovery_epoch003_profiled_event_valid
-> _recovery_epoch003_current_event_valid
-> _recovery_epoch003_current_event_authority_valid
-> OperationalAdmission v1
```

The independent nested route remains:

```text
_recovery_epoch003_current_event_nested_valid
-> independent external-identity validation
-> OperationalAdmission v1
```

Confirmed source facts:

- current Event1 schema is v1 and top-level exact23;
- Candidate is nested exact9;
- owner Event1 authority validation is OperationalAdmission v1-specific;
- independent nested Event1 validation is OperationalAdmission v1-specific;
- `_RECOVERY_EPOCH003_V2_EVENT1_AUTHORITY` is `None`;
- the v2 operation set is OperationalAdmission publication exact1;
- the v2 parent validator accepts completed phases exact1 or exact2 only;
- v2 parent phase3 is not implemented;
- the future D1 exact1 path is absent; and
- no Recovery Epoch004 source symbol or implementation exists.

Therefore Event1 v2 owner/independent connection is not implemented.

## 4.3 v1 invariance

The existing v1 contract is frozen:

```text
OperationalAdmission top-level:
exact16

predecessor binding:
exact8

exact16 ordered-key SHA-256:
965d297c7413c243cdebbc744f15334ca5eb0972801fd4254d443369f9caf66b

exact8 ordered-key SHA-256:
ea2dfb2bf3289209bf272ec460173fd5b9ae0429e4adc7c6f900ced4b44458d8

canonical loader blob / raw:
953d062fa858870e65d96cf03694d68c99003594
c20b262495276c9b549b257380e1a7c28069c316a7aca4b6e00a49de03d1512b
```

Existing v1 API, semantics, and frozen function-level source hashes must
remain unchanged.  Unknown schemas, mixed schema pairs, and v2-to-v1
fallback must fail closed.

# 5. Additive corrective P0 frozen state

This complete P0 freezes all of the following:

1. Epoch003 prestart D2 receipt bytes are immutable historical evidence.
2. `0160be...` and `97f62f...` are immutable non-credit values.
3. `b93940...` and `8cd628...` are diagnostic only.
4. final issuance, Reference, OperationalAdmission v2,
   source-identity reconciliation, current contract reconciliation, and
   the old partial P0 exact3 remain immutable historical evidence.
5. Epoch003 active execution credit is `NOT_ESTABLISHED`.
6. current reconciliation `c9eb76...` is typed corrective disposition
   evidence.
7. old partial P0 `e6659e...` is not the current P0 identity.
8. the old partial P0 administrative transition is `NOT_ESTABLISHED`.
9. Recovery Epoch004 becomes `DEFINED_NOT_STARTED` only after this
   additive corrective P0's complete exact5 publication and
   postverification.
10. source baseline remains `UNLOCKED`.
11. Candidate remains `UNALLOCATED_DISTINCT_FROM_ALL_PRIOR_CANDIDATES`.
12. Event1, operational runtime, Readiness, Failure, Reservation, and
    Attempt remain absent.
13. formal exact134 remains exact0.
14. Recovery Epoch004 inherits no active execution credit from Epoch003.
15. `automatic_progression=false`.

# 6. Receipt and publication identity contracts

## 6.1 Body-free receipt self-hash

The receipt self field is:

```text
receipt_sha256
```

Its logical value is:

```text
SHA256(
  UTF8(
    canonical_sorted_compact_json(
      receipt with receipt_sha256 field deleted
    )
  )
)
```

The logical preimage has no trailing LF.  Retaining the field as an empty
string is forbidden.  The publication file may use one final LF as its
byte form, but that LF is not part of the logical preimage.

## 6.2 Receipt strict exact10 external identity

Only after actual Git publication and postfetch, construct strict exact10:

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

Derive `identity_sha256` by deleting that field and hashing the canonical
sorted compact UTF-8 JSON with no trailing LF.  Empty-self compatibility
is forbidden.

## 6.3 Additive corrective P0 strict exact6

Schema:

```text
cocolon.emlis.nls_v3.step11.cycle001.recovery_epoch004.additive_corrective_p0_external_identity.v1
```

Top level is strict exact6:

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

Derive `p0_external_identity_sha256` by deleting that field from the other
exact5 members and hashing canonical sorted compact UTF-8 JSON with no
trailing LF.

The value is calculated only after both Design and receipt have actual
Git publication identities and postfetch equality.  It must be distinct
from `e6659e...`.  The actual strict exact10 receipt identity and strict
exact6 P0 identity are recorded only in the Handoff, current Plan, and
latest snapshot after postfetch.

# 7. Future causal order and role separation

The future order is frozen as:

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

Roles:

- P0 defines the future execution contract and source boundary.  It does
  not execute test or production work.
- D1 freezes a causal RED for the Event1 v2 connection contract.
- D2 implements only the D1-frozen contract and establishes targeted
  GREEN.
- Reference observes and binds the final source only after D2 is complete.
- OperationalAdmission binds the same final source, Reference,
  source/bootstrap closure, and formal-owner set.
- Candidate is distinct from every prior Candidate and is nested in
  Event1 exact23.
- Event1 binds Reference and OperationalAdmission and consumes the
  OperationalAdmission exactly once.
- source baseline locks only after Event1 independent postfetch
  verification succeeds.
- formal parent phase3 reconstructs actual evidence and fails closed on
  missing, mixed, or stale evidence.
- operational runtime and preflight materialize only after Event1.
- observation publishes exactly one matching Readiness or Failure.
- Reservation is one-shot and exists only after Readiness.
- Attempt is runner-owned and exists only after Reservation.
- formal exact134 is at most once for the same Attempt.

No stage inherits active execution credit from Epoch003, and no stage
begins automatically from this authority.

# 8. Event1 v2 future contract

The future D1/D2 contract must freeze:

1. owner and independent versioned schema dispatch;
2. fail-closed rejection of unknown, mixed, and v2-to-v1 fallback;
3. the source subject, owner executor, and independent executor bound to
   the same actual Git repository root, HEAD, and tree;
4. equal module origin, Git blob, and raw SHA-256 identities;
5. prohibition on the independent lane importing, forwarding, or trusting
   the owner validator;
6. parent phase3 reconstruction of actual evidence plus independent
   reexecution;
7. preservation of v1 exact16/exact8 API, meaning, and function-level
   source hashes; and
8. final Reference and OperationalAdmission bound only to the
   D2-complete final source.

Missing, mixed, stale, cross-root, synthetic-root, detached historical,
local-ref-rewound, or fallback evidence fails closed without runtime
materialization, baseline lock, Readiness, Reservation, Attempt, or formal
exact134.

# 9. D1 and D2 future boundaries

Future D1 exact1 test path:

```text
ai/tests/test_emlis_nls_v3_recovery_epoch004_operational_admission_v2_event1_connection_actual_git_identity_parent_phase3_red.py
```

Future D2 production envelope is the existing formal-owner exact7.
Mandatory direct exact3:

```text
ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py
ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py
ai/tools/emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py
```

This authority does not create, collect, or execute the D1 test and does
not modify any D2 source.

# 10. Exactly one frozen next authority

The only concrete next-authority token frozen by this Parent Design is:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_ADDITIVE_CORRECTIVE_P0_POSTVERIFIED_D1_OPERATIONAL_ADMISSION_V2_EVENT1_CONNECTION_OWNER_INDEPENDENT_SCHEMA_DISPATCH_ACTUAL_GIT_SOURCE_SUBJECT_OWNER_EXECUTOR_INDEPENDENT_EXECUTOR_IDENTITY_PARENT_PHASE3_EVIDENCE_AND_V1_EXACT16_EXACT8_INVARIANCE_CAUSAL_RED_FREEZE_ONLY
```

State:

```text
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED
```

It is distinct from the literal embedded in the old partial non-credit P0.
It must not be used without separate Mash approval.

```text
concrete next-authority token count:
exact1

automatic progression:
false
```

# 11. Publication boundary

Approved Cocolon exact5:

```text
NEW:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch004_
AdditiveCorrectiveP0_AfterEpoch003PrestartD2ReceiptIdentityPreimageContractMismatchAndPartialP0NonCredit_
ParentDesign_ReadOnly_20260730.md

NEW:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch004_
AdditiveCorrectiveP0_AfterEpoch003PrestartD2ReceiptIdentityPreimageContractMismatchAndPartialP0NonCredit_
ParentDesign_ReadOnly_BodyFree_Receipt_20260730.json

NEW:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch004_
AdditiveCorrectiveP0_AfterEpoch003PrestartD2ReceiptIdentityPreimageContractMismatchAndPartialP0NonCredit_
ParentDesign_ReadOnly_Handoff_20260730.md

MODIFY:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md

MODIFY:
Cocolon_前提資料/07_latest_snapshot_diff.md
```

No other Cocolon path and no mashos-api path is authorized.  The old
partial P0 exact3 paths are immutable and excluded.

GitHub transport and completion follow only
`11_cocolon_github_transport_and_session_continuity.md` section
`CURRENT_NORMATIVE_CONTRACT`.

# 12. Facts, inference, and Karen's opinion

## 12.1 Confirmed facts

- D2 actual Git bytes are stable and reproduce the declared logical and
  external values only through empty-self preimages.
- the normative design and actual owner/independent implementation use
  delete-self preimages and contain no compatibility lane;
- final issuance directly binds the affected D2 external value;
- downstream artifacts retain exact bytes and intrinsic identity math;
- source-identity reconciliation `2931...` is specifically a historical
  delete-self-plus-LF external preimage object, not a current generic
  no-LF identity;
- the old Recovery Epoch004 P0 publication is exact3, not its required
  exact5;
- mashos-api remains at the fixed source;
- Event1 v2 owner/independent dispatch and parent phase3 are not
  implemented; and
- Candidate, Event1, baseline lock, runtime, later evidence, and formal
  exact134 are absent.

## 12.2 Actual-source-derived inference

The mismatch is a self-preimage contract mismatch, not byte drift or a
publication-LF defect.  An intrinsically self-consistent downstream
artifact cannot repair an invalid causal predecessor.  The old exact3
cannot be made into its originally required exact5 after the fact without
hiding the failed establishment condition.  A distinct additive P0 that
binds the current reconciliation from its first complete publication is
therefore required.

## 12.3 華恋の意見

履歴を守ることと、実行creditを認めることは分離するべきです。D2、final
issuance、Reference、OperationalAdmission、各reconciliation、旧partial P0
を消したり読替えたりせず、どの因果が成立しなかったかを残す方がCocolonの
信頼性を守れます。

今回のP0は、進行を見せるための資料ではなく、次のD1以降で同じ誤りを起こさない
ためのsource boundaryです。したがって、exact5全体のpostverificationまでは
成立扱いにせず、D1はMash様の別承認までinactiveのまま止めるべきです。

# 13. Effect ledger and stop

```text
mashos-api changes:
exact0

production / test / fixture / dependency / lock / configuration changes:
exact0

pytest collect / execution / pytest.main:
exact0 / exact0 / false

existing historical artifact rewrite, replacement, reissue, rename:
exact0

old partial P0 completion:
false

Candidate / Event1:
exact0 / exact0

runtime materialization:
exact0

source-baseline lock:
false

Readiness / Failure / Reservation / Attempt:
exact0 / exact0 / exact0 / exact0

formal exact134:
exact0

P2 / Product Read / Cycle001 acceptance:
NOT_STARTED / NOT_STARTED / NOT_ACCEPTED

automatic progression:
false
```

Required stop:

```text
RECOVERY_EPOCH003_PRESTART_D2_RECEIPT_DELETE_SELF_CONTRACT_MISMATCH_RECORDED_DECLARED_EMPTY_SELF_IDENTITIES_IMMUTABLE_NON_CREDIT_FINAL_ISSUANCE_REFERENCE_OPERATIONAL_ADMISSION_V2_AND_RECONCILIATION_IMMUTABLE_HISTORICAL_ACTIVE_EXECUTION_CREDIT_NOT_ESTABLISHED_RECOVERY_EPOCH004_PARTIAL_P0_EXACT3_IMMUTABLE_NON_CREDIT_ADDITIVE_CORRECTIVE_P0_PARENT_DESIGN_FROZEN_DEFINED_NOT_STARTED_SOURCE_BASELINE_UNLOCKED_CANDIDATE_UNALLOCATED_EVENT1_NOT_CREATED_D1_CAUSAL_RED_NOT_AUTHORIZED_AUTOMATIC_PROGRESSION_FALSE_AUTHORITY_STOP
```
