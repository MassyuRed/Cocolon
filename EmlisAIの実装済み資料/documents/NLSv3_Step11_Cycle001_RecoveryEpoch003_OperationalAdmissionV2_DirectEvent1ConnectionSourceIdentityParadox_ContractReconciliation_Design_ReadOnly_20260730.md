# NLS v3 Step 11 Cycle001 Recovery Epoch003
# OperationalAdmission v2 Direct Event1 Connection
# Source-Identity Paradox Contract Reconciliation
# Design Read Only

Date: 2026-07-30 JST

## 0. Authority and design result

This document is produced only under:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_POSTVERIFIED_OPERATIONAL_ADMISSION_V2_TO_DISTINCT_CANDIDATE_ALLOCATION_AND_SEQUENCE_EVENT1_SOURCE_BASELINE_LOCK_CONNECTION_AUTHORITY_SCHEMA_DISPATCH_AND_PARENT_PHASE3_EVIDENCE_CONTRACT_RECONCILIATION_DESIGN_READ_ONLY
```

Fixed entry:

```text
Cocolon commit / tree:
6f87ede3a2d56c8eb1297d00b79680072f0beb74
13be1ca9314f34482264961bba34f898a5b61161

mashos-api commit / tree:
97e8dd4d7021b8a1781d534aaa603f71dffa41b9
cd3fc3da0976bbbcb708319e4bc8cbbb6a73ec19

final-issuance receipt external identity:
2c52bb50256bdf4c9bf456f33925f4bc868ecbef3001032f08290853f2f73c94
```

The contract-reconciliation result is:

```text
DIRECT_SAME_OPERATIONAL_ADMISSION_V2_EVENT1_CONNECTION:
UNREACHABLE_UNDER_CURRENT_SOURCE_IDENTITY_AND_FRESHNESS_CONTRACT

CURRENT_OPERATIONAL_ADMISSION_V2:
RETAINED_IMMUTABLE_UNCONSUMED

SAME_EPOCH_RETRY_OR_SUCCESSOR:
FORBIDDEN_BY_EXISTING_POST_REFERENCE_SOURCE_DRIFT_DISPOSITION

REQUIRED_NEXT_CLASS:
RECOVERY_EPOCH003_INVALIDATION_AND_RECOVERY_EPOCH004_PARENT_DESIGN
```

This result does not claim that the current source has already drifted.
At the fixed entry, the source still matches the OperationalAdmission v2.
The unreachable condition is causal: the first D1 source commit, and
independently the production changes required for the v2 Event1
connection, would move the source commit/tree and therefore satisfy a
frozen invalidation condition before that same admission could receive
Event1 credit.

No D1 token, implementation token, Event1 token, invalidation token, or
Recovery Epoch004 token is issued here.  No automatic progression follows
from this Design.

## 1. Confirmed facts

### 1.1 Repository state

At Design start, the explicit local repositories were clean and equal to
their freshly observed `origin/main`.

```text
Cocolon HEAD / tree / origin/main / dirty path count:
6f87ede3a2d56c8eb1297d00b79680072f0beb74
13be1ca9314f34482264961bba34f898a5b61161
6f87ede3a2d56c8eb1297d00b79680072f0beb74
0

mashos-api HEAD / tree / origin/main / dirty path count:
97e8dd4d7021b8a1781d534aaa603f71dffa41b9
cd3fc3da0976bbbcb708319e4bc8cbbb6a73ec19
97e8dd4d7021b8a1781d534aaa603f71dffa41b9
0
```

The fixed Event1 path was absent:

```text
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_SequenceEvent01_SourceBaselineLocked_BodyFree_Event.json

state:
ABSENT
```

No Candidate has been allocated and the source baseline remains
`UNLOCKED`.

### 1.2 Issued evidence identities

The postverified Reference, OperationalAdmission v2, and final-issuance
receipt are immutable entry evidence.

| Artifact | Publication commit | Blob | Raw SHA-256 | Logical SHA-256 | External identity |
|---|---|---|---|---|---|
| Reference Runtime Observation | `26b4d3746648c48b137103e4a8f22f7c98e1e9fa` | `59623e9baba5f76bb9e80df4ca0cddd18f8320e4` | `bd3180d55f756c7b0605bf0862641e22a9cea3f4325babc8802803d2b8530371` | `0fd0c012d788c790b31fab275a6bcc6180bc544736aaac4dd72d2a42cea46a00` | `190cb3cf0749cf8fcdd9ddc9fdfdd8e47dffb03e35a74c74472e788bab204864` |
| OperationalAdmission v2 | `3a0cf9dab6f81711a3754367796095e36109c657` | `c58e29b982a89bf2aefa008fc3276431b5e8cac2` | `26db0957e0582e4fbcc7fcd5ffdefb98a198fb0c1abe2a13aa6159c63a73b280` | `e3e53e2d446cdac7332b0caebb8dcd3ef5eff103502cc6eebfffbc2ffece5676` | `80af08a59a37eacdcb38e2c1004e01dcf85e26fac11f75a56e8adb79d92abcd8` |
| Final-issuance receipt | `b8e39ea696e337bcafd166df2cab3f27b1f0796c` | `ab901e0947f1487cfca4bb5d9c8e02f75684da9f` | `d231e4b863e5b6df8ec86144bd2a79c95ac9feedd3e47d1e5df2b7045536e22f` | `15a455414a281b330ae815d51811085df141e4dbab7a22f85b41967fe3f7e6b5` | `2c52bb50256bdf4c9bf456f33925f4bc868ecbef3001032f08290853f2f73c94` |

The historical and closure commitments remain:

```text
frozen historical seed:
3a08461e6f06c820038a29c5c547476842560f41865929e4c05454b220afaa00

historical binding core:
519359777b7efc56b79d9422ba6f312913f97a490dc290c20c18ab42dfbd8ef5

complete predecessor exact8:
c5db068bb6683ef2a8359b51a7f16190027c17e97f70752ddace53e0af04d071

source closure:
80e18e75604c72c78701384f127839aee1ef152a7788622d2824e8678137fe97

bootstrap closure:
a6c19b645fede8d9a508235e63babd7299d96194d88b5f7aeb3b7a7feedae571
```

### 1.3 OperationalAdmission v2 scope and freshness

The actual admission has:

```text
schema:
cocolon.emlis.nls_v3.recovery_epoch003.operational_admission.v2

top-level / predecessor keys:
exact16 / exact8

state:
SOURCE_BOOTSTRAP_REFERENCE_RUNTIME_CLOSED_AWAITING_SEPARATE_V2_EVENT1_CONNECTION_DESIGN_AND_AUTHORITY

scope.next_authority_token:
null

scope.operation_set:
["OPERATIONAL_ADMISSION_PUBLICATION"]

scope.separate_explicit_authority_required:
true

bound source commit / tree:
97e8dd4d7021b8a1781d534aaa603f71dffa41b9
cd3fc3da0976bbbcb708319e4bc8cbbb6a73ec19
```

Its freshness contract is:

```text
validity mode:
IDENTITY_STABLE_SINGLE_FUTURE_EVENT1_CAPABILITY

expires_at_utc:
null

event1 path at issuance:
ABSENT

maximum Event1 consumption:
1

reuse allowed:
false
```

The frozen invalidation conditions are exact5:

```text
REFERENCE_OR_PREDECESSOR_IDENTITY_NOT_REACHABLE_OR_BYTE_DRIFTED
SOURCE_COMMIT_OR_TREE_DRIFTED_OR_WORKTREE_NOT_CLEAN
SOURCE_OR_BOOTSTRAP_CLOSURE_MISMATCH
HISTORICAL_RECEIPT_BYTE_FORM_CROSS_LANE_MISMATCH
EVENT1_PATH_PRESENT_WITHOUT_SEPARATE_V2_CONNECTION_AUTHORITY
```

The admission's own effect boundary records:

```text
Reference materialization delta / Reference publication / OA publication:
1 / 1 / 1

Candidate / Event1 / operational runtime / readiness:
0 / 0 / 0 / 0

Reservation / Attempt / formal exact134 / test execution:
0 / 0 / 0 / 0

source baseline:
UNLOCKED
```

Neither this Design nor a future authority may reinterpret
`next_authority_token=null` or the one-element operation set as an
embedded Event1 grant.

### 1.4 Actual Event1 and parent call graph

The actual source establishes all of the following:

1. `validate_recovery_epoch003_sequence_event1_contract_state` dispatches
   only the legacy fixture profile or the current v1 Event1 validator.
2. `_recovery_epoch003_current_event_authority_valid` requires
   OperationalAdmission schema v1 and the historical Event1 authority.
3. `_RECOVERY_EPOCH003_V2_EVENT1_AUTHORITY` is `None`.
4. The independent nested Event1 validator is likewise fixed to the v1
   OperationalAdmission route.
5. `validate_recovery_epoch003_parent_pre_event1_phase_evidence_state_v2`
   accepts completed phase count exact1 or exact2 only.
6. The general phase3 parent path remains tied to the v1 admission
   contract.
7. The worker preflight calls the central Event1 validator; it does not
   create an independent missing v2 connection.
8. The atomic publication bundle already knows the fixed Event1 path and
   exact1 publication envelope, but it cannot supply missing authority or
   validation semantics.

The current parent phase order remains exact6:

```text
01 REFERENCE_RUNTIME_OBSERVATION_PUBLISHED_AND_POSTVERIFIED
02 SOURCE_BOOTSTRAP_OPERATIONAL_ADMISSION_CARRIER_PUBLISHED_AND_POSTVERIFIED
03 CANDIDATE_ALLOCATED_WITH_EVENT1_PUBLISHED_AND_POSTVERIFIED
04 OPERATIONAL_RUNTIME_MATERIALIZATION_AND_PREFLIGHT
05 READINESS_OR_FAILURE_PUBLISHED_AND_POSTVERIFIED
06 FORMAL_RESERVATION_PUBLISHED_AND_POSTVERIFIED
```

Phase 1 and phase 2 are postverified.  Phase 3 is not implemented for
OperationalAdmission v2 and has not occurred.

### 1.5 Existing Event1 and Candidate shape

The existing strict Event1 schema is:

```text
cocolon.emlis.nls_v3.recovery_epoch003.sequence_event.v1
```

Its top-level keyset is exact23:

```text
schema_version
ledger_id
event_id
logical_cycle_id
recovery_epoch_id
candidate_version_id
event_ordinal
event_name
state
prior_event
challenge_id
timestamp_utc
timestamp_kind
authority
p0_external_identity
candidate_allocation
source_closure
bootstrap_closure
primary_evidence_artifact
publication
body_free
automatic_progression
event_sha256
```

The nested Candidate keyset is exact9:

```text
schema_version
logical_cycle_id
recovery_epoch_id
candidate_version_id
allocated_at_utc
p0_external_identity_sha256
source_closure_sha256
reference_runtime_observation_external_identity_sha256
candidate_allocation_sha256
```

The Event1 shape already binds one `source_closure` and one
`bootstrap_closure`; the latter includes the formal-owner exact7.  What it
does not have is a second, distinct execution-provenance field for an
executor outside that bound source, such as:

```text
validator execution repository root
validator execution commit/tree
connection implementation identity
successor source identity
```

Therefore the existing exact23/exact9 cannot simultaneously retain S0 as
the Event1 subject and bind a distinct later S1 checkout as the validator
executor.  It can and must bind the implementation identities that belong
to its single source/bootstrap closure.

### 1.6 Formal-owner artifact binding

OperationalAdmission v2 embeds the bootstrap formal-owner exact7:

| Role | Path | Blob | Raw SHA-256 |
|---|---|---|---|
| atomic publication bundle | `ai/tools/emlis_nls_v3_recovery_epoch002_atomic_publication_bundle_v3.py` | `a7e0de1b7e048a647b95eccfbd03cdd7e198500b` | `f2625be00933f2c72b1094a9546e08e3c0de7c6bd28b56e01d4c67f625af023d` |
| canonical current closure | `ai/services/ai_inference/emlis_ai_recovery_epoch002_canonical_current_closure_v3.py` | `eeb21405e6b873ee5394eb68913440776ea5623e` | `245793262fe7a22c52e62a0277c1ce8531437d79876a93e64f7298819f6a6ed2` |
| current step proof gate | `ai/tools/emlis_nls_v3_recovery_epoch002_current_step_proof_run.py` | `ad9e206c0d69b953579dfffea64dbe059ae154bb` | `6eaece6aa91d4e19b8f30df4c9cc489788e283ce93553e35342e603a2401c261` |
| formal parent orchestrator | `ai/tools/emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py` | `289f2d6852768a895e72c900f61c670892574102` | `f334e5628449239161b8c164b2d347181ef8179618ea435a73efbae5f4232e22` |
| formal worker bootstrap preflight | `ai/tools/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_preflight.py` | `c5e9c5c5f1840273749013e1f7b917e9c6690f0a` | `6afd0df9451c9cb3d339b67511f1eb6aeaa426d7c0809337c496c48e5e676ff0` |
| independent closure verifier | `ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py` | `7e963598ef32ad8f0c88508c36fe5fe5a32dd32e` | `b9c2ada98c4a3f6e390f739335f45e7de2f542596447b1815a0c8c9b9094237a` |
| sequence ledger | `ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py` | `1a3bea7536ce671a56f701ea2ba0acb1a9530536` | `a063af595ba70b8790ed7e6259cd1cc5bf1d565bd267ca8c589d9792ab5a4815` |

The formal-owner set hash is:

```text
43e6414e81cdc74fbfad73bb4992988f982c6114d6807150dd13c8f338833ffe
```

Under the hypothetical direct route, actual AST/import/call-graph analysis
requires changes in at least exact3:

```text
ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py
ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py
ai/tools/emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py
```

Ordered-path canonical JSON SHA-256:

```text
e01f5e587ba1884b988075eee1c162454d3a6a1d4b10febc3b7111c2b5c1b248
```

All exact3 are inside the exact7 bound by the current admission.
Changing any one changes its blob/raw identity and the formal-owner set.
Any committed D1 test also changes the fixed source commit/tree even
before these production changes.

### 1.7 Actual repository-root checks

The owner and independent v2 repository-root validators require:

```text
explicit absolute root
resolved top-level equals the explicit root
HEAD equals expected head
HEAD tree equals expected tree
origin/main equals expected head
worktree clean
origin equals anonymous HTTPS MassyuRed repository
```

Relevant function source hashes at the fixed source are:

| Path / function | Lines | Source SHA-256 |
|---|---:|---|
| sequence ledger / `_recovery_epoch003_v2_repository_root` | 4596–4671 | `3793c6130316a6b8f303a66b4a51fc3483a512363946e2e0e4c5fc55008428a4` |
| independent verifier / `_recovery_epoch003_independent_v2_repository_root` | 10998–11073 | `65f2297384924d4a64f5704db2f7d4e79871f8f91caa495b9b3a1634f3bb7332` |

After a future implementation is reflected to `main`, a fresh checkout's
`origin/main` cannot remain the OA-bound `97e8dd4d...`.

### 1.8 Existing stale-admission and failure disposition

The immutable Epoch003 P0 Parent Addendum section 5.7 fixed the Event1-time
freshness rule:

```text
At Event1 publication the owner and independent verifier freshly recheck
all invalidation conditions.

A stale or already-consumed admission is never overwritten, reissued under
the same epoch, or reused.

Recovery requires explicit invalidation/new-epoch authority.
```

Its section 11.3 separately fixed the closed disposition for source drift
after Reference publication and before successful admission
postverification: the Reference remains immutable history, Epoch003
becomes ineligible, no same-epoch retry/overwrite is allowed, and
continuation requires invalidation/new-epoch authority.

The current OA v2 did successfully reach postverification, so section 11.3
alone is not being retroactively applied as the current event.  The
controlling future condition is instead the actual OA v2 freshness rule:
once D1 or D2 moves the source, `SOURCE_COMMIT_OR_TREE_DRIFTED_OR_WORKTREE_NOT_CLEAN`
is true.  The general section 5.7 stale-admission rule then forbids
overwriting, reissuing, or reusing that admission in the same epoch.

## 2. Inferences

### 2.1 Source-identity paradox

The direct route requires a v2 Event1 owner/validator/parent connection.
That connection is absent from the source bound by the admission.  Adding
the connection changes the same source identity whose unchanged state is a
precondition for admission freshness.

```text
OA v2 binds source S0
→ v2 Event1 connection is missing in S0
→ implementing the connection creates source S1
→ S1 != S0
→ OA v2 source-drift invalidation condition is true
→ OA v2 cannot provide current Event1 credit to S1
```

This is not a missing-symbol-only RED.  The implementation step would
invalidate the evidence it is intended to consume.

### 2.2 Why a dual-root execution is non-credit

Using an old checkout as the `source_repository_root` and importing the
new validator from a later checkout does not resolve the paradox:

1. the public Event1 validator receives state, not a second
   execution-root identity;
2. the v2 OA verifier and parent receive only the subject source root;
3. the Event1 exact23 and Candidate exact9 bind one source/bootstrap
   closure and have no second field for a distinct later implementation
   identity;
4. the later validator is outside the admission's formal-owner and source
   closure;
5. a fresh later checkout advances `origin/main`, while the old-root
   validator requires it to equal the old bound head; and
6. the Event1 would claim to lock S0 while the validator granting credit
   actually executes from S1.

Such a split can be useful for a negative tamper diagnosis.  It cannot be
used as current operational credit.

### 2.3 Why local ref manipulation is non-credit

Keeping a stale `origin/main`, repointing a local remote-tracking ref,
using a detached historical checkout, or constructing a synthetic
repository could make selected Git predicates appear to match.  None
establishes that the current main source and the executing validator are
the admission-bound source.

These techniques violate the actual-current, fresh-origin, clean-checkout,
no-hidden-fallback boundary and are prohibited.

### 2.4 Why the admission cannot be patched

Rewriting or reissuing the current admission to bind the later source
would change its bytes, blob, logical identity, external identity,
publication history, and postverified parent phase2 evidence.  Relaxing
its invalidation condition or formal-owner equality would weaken the
contract after issuance.

The current admission is therefore retained as immutable historical
evidence.  It is not patched into a different capability.

## 3. Reconciled Event1 contract

The following remains the intended semantic contract for a future
recovery epoch.  It is not an active Epoch003 execution design.

### 3.1 Candidate

1. Candidate remains strict exact9.
2. It is nested only inside Event1.
3. Standalone Candidate path and standalone Candidate publication remain
   exact0.
4. It binds P0, the current source closure, and the current Reference
   identity of its own recovery epoch.
5. Candidate construction alone does not lock the source baseline.

### 3.2 Event1

1. Event1 remains body-free strict exact23 unless a future parent design
   explicitly proves a versioned change necessary.
2. It is event ordinal 1 and names `SOURCE_BASELINE_LOCKED`.
3. The authority object uses one separately approved publication and
   transition authority.
4. The admission external identity is the primary evidence.
5. Supporting artifacts are the current Reference plus current admission,
   sorted exact2.
6. Publication changes the Event1 path exact1 only.
7. Published bytes, postfetch bytes, logical hash, raw hash, blob, and
   external identity must agree.
8. Event1 remains exact1 per recovery epoch and cannot reuse an admission.
9. Runtime, readiness/failure, Reservation, Attempt, and formal exact134
   facts remain forbidden from Event1.

### 3.3 Source-baseline lock

The source baseline changes from `UNLOCKED` to `LOCKED` only after:

1. Candidate is nested in the final Event1 bytes;
2. the correct epoch's Reference and admission are fresh;
3. Event1 exact1 is published;
4. postfetch bytes and external identity are independently verified; and
5. the owner and independent verifier execute from the same source
   repository identity that Event1 locks.

The following provenance equality is mandatory:

```text
event1 subject source repository root
==
Event1 connection owner execution repository root
==
Event1 independent execution repository root

HEAD / tree / freshly observed origin/main
==
the consumed admission's bound source commit / tree
```

### 3.4 Parent phase3

Future parent phase3 must:

1. reconstruct Reference, admission, Candidate, and Event1 from actual
   repositories;
2. re-execute owner-independent validation without accepting a forwarded
   owner result;
3. prove Reference/admission freshness at Event1 publication base;
4. prove Candidate exact9 is nested only in Event1;
5. prove Event1 path changed exact1 and supporting evidence exact2;
6. prove publication/postfetch immutability;
7. record the Event1 artifact role exact1 and runtime records exact0;
8. complete parent phases exact3; and
9. stop with next phase named but not started.

A cursor, phase name, identity string, or prebuilt in-memory mapping is not
phase3 evidence.

### 3.5 v1 preservation

The following fixed source hashes are preservation anchors.  Each hash is
SHA-256 over the UTF-8 source bytes from the AST function's `lineno`
through `end_lineno`, inclusive, retaining the final line LF:

| Path / function | Source SHA-256 |
|---|---|
| sequence ledger / `_recovery_epoch003_current_event_valid` | `17bc86dda311ac503e7634f459a5f62a8c9993fd0e4d00aced4410e69b093e32` |
| sequence ledger / `validate_recovery_epoch003_sequence_event1_contract_state` | `63ef2fb2e3a17e5aac2605cd82d8b40e7ffd07e1b0f1bec5baeb6dc994249695` |
| independent verifier / `_recovery_epoch003_current_event_nested_valid` | `78e835d067f5f9d1474a3d6d4b7c58bdf920829b7140ca8adb7a0bd08c571493` |
| parent / `validate_recovery_epoch003_parent_phase_evidence_state` | `fcb7056bbd2868ad59115832c4f68a2c9728a945780ae4a9f5a546eaf4826c3e` |
| worker / `_recovery_epoch003_baseline_valid` | `5087babfcc289f89548708858cf7a690bf21c5edbca0153e3cc2cbaa7f611df7` |

They are evidence of the current v1 meaning at S0.  A future epoch may
add versioned dispatch, but must not silently transform these v1 semantics
or use unknown-schema fallback.

## 4. Route reconciliation

| Route | Result | Reason |
|---|---|---|
| Implement D1/D2 and consume current OA v2 | rejected | source/tree and bound owner artifacts drift before Event1 |
| Old source subject plus later validator executor | rejected | executing implementation is outside the bound closure and has no exact23 provenance |
| Stale `origin/main`, detached old checkout, or local ref repoint | rejected | not fresh current Git evidence |
| Rewrite/reissue OA v2 for later source | rejected | mutates immutable postverified identity and phase2 evidence |
| Relax source drift or formal-owner checks | rejected | weakens an issued contract |
| Epoch003 additive successor Reference/OA | rejected | actual OA v2 becomes stale and the existing Event1-time rule forbids same-epoch overwrite/reissue/reuse |
| Explicit Epoch003 invalidation plus Recovery Epoch004 parent design | required next class | preserves history and allows connection code to be present before the new Reference/OA bind the source |

Recovery Epoch004 is not started here.  Its future parent design must
decide, before any D1:

1. how Epoch003 P0, Reference, OA v2, and this reconciliation receipt are
   retained as immutable predecessor/invalidation evidence;
2. the exact Epoch004 P0 external identity;
3. the source change order that places Event1 schema dispatch and parent
   phase3 support before new Reference and admission issuance;
4. whether exact23/exact9 can remain unchanged under an Epoch004 schema
   namespace;
5. the new source/bootstrap closure and formal-owner set;
6. the new Reference/admission paths and schemas without reusing Epoch003
   paths;
7. D1/D2/final pre-Event1/Event1 authority separation; and
8. effect and rollback boundaries for every phase.

## 5. Prohibitions

This Design rejects:

- any production or test change under the current authority;
- D1 collect or execution;
- an Epoch003 Event1 authority or Candidate allocation;
- current OA v2 rewrite, replacement, reformat, reissue, scope expansion,
  or invalidation-condition weakening;
- Reference rewrite or replacement;
- historical receipt rewrite or identity substitution;
- schema-name-only, filename-only, profile-selected, fixture-only, or
  allowlist current credit;
- mock, monkeypatch, hard-code, in-memory current-credit mapping, or
  search-root fabrication;
- dual-root owner/independent execution credit;
- stale remote-tracking refs, detached historical checkout credit, local
  ref repoint, synthetic repository, hidden lookup, sibling search, or
  fallback;
- unknown-schema fallback or v2-to-v1 downgrade;
- Event1 exact23 provenance claims that are not represented in its bytes;
- Candidate/Event1/source-lock/runtime/readiness/failure/Reservation/
  Attempt/formal-exact134 effects;
- P2, Product Read, or Cycle001 acceptance; and
- automatic progression.

## 6. Independent read-only verification

Three read-only lanes were used:

1. actual source/AST/import/call-graph and v2 code-contract audit;
2. historical parent/Event1/failure-disposition audit; and
3. issued receipt/identity/parent-phase evidence audit.

They independently converged on:

```text
direct same-OA v2 Event1 connection blocker:
SOURCE_IDENTITY_AND_FORMAL_OWNER_CLOSURE_SELF_INVALIDATION

dual-root current credit:
REJECTED

same-epoch successor:
REJECTED_BY_EXISTING_NO_SAME_EPOCH_RETRY_DISPOSITION

remaining blocker count for direct Epoch003 Event1 route:
1
```

No read-only lane edited a file, ran pytest, committed, wrote to GitHub,
selected the final route, or made the final judgment.  Karen performed the
contract reconciliation and retains the publication decision.

## 7. Facts, inference, and Karen's opinion

### Confirmed facts

- OA v2 binds mashos-api `97e8dd4d... / cd3fc3da...`.
- Its invalidation exact5 includes source commit/tree drift.
- The v2 Event1 owner/independent/parent phase3 connection is absent.
- The minimum hypothetical production exact3 are all in the OA-bound
  formal-owner exact7.
- D1 alone would move the source commit/tree.
- dual-root execution provenance is not represented by the public
  validators or Event1 exact23.
- the published Epoch003 parent contract forbids same-epoch retry after
  post-Reference source drift.

### Inference

Because the missing connection must change the source before Event1 can be
validated, the current OA cannot both remain fresh and validate that
connection.  The direct route is therefore structurally unreachable, not
merely unimplemented.

### 華恋の意見

今回いちばん守るべきなのは、「発行済みの証拠に後から都合のよい意味を足さない」
ことです。古いsourceを検査対象、新しいsourceを検証者として分ければ形式上の
一致は作れますが、Event1がlockしたと主張するsourceと、その主張を認めたcodeが
別になります。それはCocolonが積み上げてきたowner／independent分離より弱い
証明です。

Epoch003のReferenceとOA v2は失敗物として扱うのではなく、ここまで正しく成立した
pre-Event1履歴として残すべきです。そのうえで、必要な接続実装を新しいsourceへ
先に置き、新しいReferenceとAdmissionがそのsourceを束縛できるRecovery Epoch004
へ明示的に切り替えるのが、履歴とcurrent strictnessを同時に守る最小の正規経路
だと判断します。

## 8. Effect boundary and authority stop

This authority changed documentation only.

```text
mashos-api production / test changes:
0 / 0

test collect / execution / pytest.main:
0 / 0 / false

Reference rewrite / reissue / new materialization:
0 / 0 / 0

OA rewrite / reissue / new publication:
0 / 0 / 0

Candidate allocation / Event1 publication:
0 / 0

source-baseline lock:
UNLOCKED

operational runtime / Readiness / Failure:
0 / 0 / 0

Reservation / Attempt / formal exact134:
0 / 0 / 0

Recovery Epoch003 invalidation issued:
false

Recovery Epoch004 started:
false

P2 / Product Read / Cycle001 acceptance:
NOT_STARTED / NOT_STARTED / NOT_ACCEPTED

automatic progression:
false
```

Required stop:

```text
RECOVERY_EPOCH003_POSTVERIFIED_OPERATIONAL_ADMISSION_V2_DIRECT_EVENT1_CONNECTION_SOURCE_IDENTITY_UNREACHABLE_CURRENT_OA_V2_RETAINED_IMMUTABLE_RECOVERY_EPOCH004_PARENT_DESIGN_REQUIRED_CAUSAL_RED_NOT_AUTHORIZED_CANDIDATE_EVENT1_NOT_ISSUED_SOURCE_BASELINE_UNLOCKED_AUTHORITY_STOP
```

The next action requires a separately approved Recovery Epoch003
invalidation and Recovery Epoch004 P0 parent-design authority.  This
document does not issue that authority.
