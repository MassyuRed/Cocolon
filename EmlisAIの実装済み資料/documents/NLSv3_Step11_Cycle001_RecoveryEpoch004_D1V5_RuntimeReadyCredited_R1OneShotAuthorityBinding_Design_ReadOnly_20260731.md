---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch004_d1v5_runtime_ready_credited_r1_one_shot_authority_binding_design
title: "Recovery Epoch004 D1 v5 credited-runtime-ready R1 one-shot authority binding"
revision_date: "2026-07-31"
status: "READ_ONLY_DESIGN_FROZEN_R1_EXECUTION_DEFINED_INACTIVE"
body_free: true
automatic_progression: false
---

# 0. Authority, decision, and zero-execution result

Approved Design-only authority:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_V5_TEST_RUNNER_RUNTIME_READY_CREDITED_POSTVERIFIED_SAME_RETAINED_RUNTIME_ROOT_IDENTITY_AND_EXECUTABLE_HASH_REDERIVATION_FRESH_CHALLENGE_FULL_EXACT8_ONE_SHOT_LIVE_REMOTE_MAIN_ACQUISITION_EXACT1_ADDITIONAL_QUERY_RETRY_FALLBACK_PRIOR_RUN_REUSE_REMATERIALIZATION_INTERPRETER_SWITCH_EXACT0_DISTINCT_R1_AUTHORITY_BINDING_DESIGN_READ_ONLY_AND_POSTVERIFICATION_ONLY
```

Decision:

```text
credited R0 RUNTIME_READY:
BOUND_WITHOUT_MUTATION

same retained runtime identity:
REDERIVED_EQUAL

concrete R1 execution authority:
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED

R1 execution under this Design authority:
exact0

automatic progression:
false
```

This authority binds the credited R0 Receipt, the unchanged retained runner,
the fixed mashos-api source cut, and one concrete later R1 authority.  It
does not execute that authority.

```text
Cocolon documentation:
NEW exact3 / MODIFY append-only exact2

mashos-api production / test / fixture / dependency / config / lock change:
exact0 / exact0 / exact0 / exact0 / exact0 / exact0

package acquisition / runtime materialization:
exact0 / exact0

pytest invocation / framework entry / target import / collection / execution:
exact0 / exact0 / exact0 / exact0 / exact0

challenge creation / eligible live remote-main acquisition / O01–O08:
exact0 / exact0 / exact0

Reference / OperationalAdmission / Candidate / Event1 / source lock:
exact0 / exact0 / exact0 / exact0 / false
```

The Design receives credit only after its Design, Body-free Receipt, Handoff,
Execution and Closure Plan append, and latest snapshot append are all
reachable on Cocolon main, exact-content postfetch equal, aggregate unique
changed paths are exact5, and both modified-file prefixes remain byte-equal.
Partial publication is non-credit.

# 1. Governing sources and fixed GitHub identities

## 1.1 Governing order

The governing order remains:

```text
published D2 targeted-GREEN source retained
-> corrected D1 v5 published exact1
-> R0 lock-derived test-runner RUNTIME_READY credited and postverified
-> this distinct R1 authority-binding Design
-> separately approved R1 full exact8 one-shot
-> separately approved corrected D2 mandatory direct exact3
-> separately approved predeclared A/B stability matrix
-> Reference / OperationalAdmission consideration only after stable credit
```

This Design does not move corrected D2, stability, Reference/OA,
Candidate/Event1, source lock, or runtime-product state.

## 1.2 Cocolon entry and credited R0 checkpoint

Current Cocolon entry identity:

```text
repository:
MassyuRed/Cocolon

commit / tree:
ebc9307a01f55c8c99f0928e146fa1f8e86338ca
a9ca16f9c9daf8ce456bd6e7696270a251b6b9c1
```

The credited R0 exact5 at that commit is:

| Artifact | Git blob SHA-1 | Raw SHA-256 |
|---|---|---|
| Result | `016e8eb969c336166eeff4d47219e7ec1370378b` | `adabfcb10d99f793f4ca40b92620f5d1d2e1986f5c17f9bd7b6b9fa70375c993` |
| Body-free Receipt | `871830720cdd387f60aca67b638b77b5ee32d52a` | `655be3c6be3f240218b1cdc6084f5847c6cf7ff246c4359fcf08e3eefec3b265` |
| Handoff | `020cb6fae8bd5469b3a4009efbafc26e1764426e` | `2d81e49a0608d8d0a0897508003eb7b576559ef824022f162a90d1175fcb9ba1` |
| Execution and Closure Plan | `810d34be3d3542d42f36cca550845414e196a2c3` | `d0afd2fa09d26f778dc92b1875f4b2f1c9ea1120f49bdc8ef04791633cfef7d5` |
| latest snapshot | `67a771d08740c895722a360e278c0f676b61dbb0` | `a2f0d78340a95a84e1e27d2c2e86df0e5c3fd89b118041ff746254af294bcc49` |

```text
R0 Receipt delete-self logical SHA-256:
89d463cf7600170f912b194db687faa9e1a6569b2c913f51c1f0e452087040f4

R0 readiness observation SHA-256:
c74148950138ac2a4c3897d9d93bc071f3a01f764b6e16d3885f21eeee3d1a45

R0 state:
RUNTIME_READY

R0 automatic progression:
false
```

These identities are received as credited postverified evidence.  This
Design neither rewrites nor reinterprets the R0 readiness result as a D1
semantic result.

## 1.3 Fixed mashos-api source and lock

```text
repository:
MassyuRed/mashos-api

commit / tree / clean main:
37eee88c431d1af3f8d2e96f9b0dd8b3d3bc327f
3891b84164ba0063136e47beb93d36798587a568
true
```

Published D1 v5:

```text
path:
ai/tests/test_emlis_nls_v3_recovery_epoch004_operational_admission_v2_event1_connection_actual_git_identity_parent_phase3_red.py

blob / raw SHA-256:
c0eb936690a3423ac4615a9aabb37c40cc257324
3536b8a838ffe2ccbe29db69e9c5400c719de8e63ddf83da9ea0f83b94f17d14
```

Existing formal lock:

```text
path:
ai/configs/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_lock_v1.json

blob / raw / logical SHA-256:
0822fcb010985cd0d384f250a9e8a1fe16dc8fd4
9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787
801ba54efc0f6655238d14e7c153fb70b555801489aa8ba028515fc64d9c05f4
```

GitHub HEAD, D1, and lock were re-fetched for this Design.  The Git blobs
equal the credited R0 source identities.  No local copy is promoted over
these GitHub identities.

# 2. Same-retained-runtime binding

## 2.1 Credited R0 runtime identity

The retained test runner is bound by the following body-free identities:

```text
runner projection SHA-256:
f501025c1dccef68c47c0a3e52f3ef74d01233f371b16f2b1a0bdfb21089e57e

accepted-wheel manifest SHA-256:
00d2df98c8cda7f1473794892bafe7ccd18cc816c79ccb346f3e21ff629b136d

distribution closure SHA-256:
4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c

installed-file manifest SHA-256:
0eba095e4c173b4b69f68532fd66cf2c871ab9edef64d91754b52ed7daee15c5

full runtime-root manifest SHA-256:
55e12965e1be85424b39aa38dd6ae454b6ee9aef9d86e0c42c565a9a494a578d

runtime-root identity SHA-256:
e0b4750c02c676e1fa717cd4fe1f216fb1af4babcfa297abd7b3508995bcf19f

interpreter executable raw SHA-256:
9ed008e5a8685235361f0c53771b520ab082dd99a877ad2fd796a93fa4c0b488
```

The interpreter remains CPython 3.12.13 on `linux-x86_64`, with pytest
8.4.1 in the exact5 projection.

## 2.2 Design-time rederivation

Before issuing the concrete R1 token, owner and independent verifier each
reran the R0 identity derivation against the same retained root.  Both
obtained `VALID` and every identity in section 2.1 exactly.

```text
identity rederivation roles:
owner exact1 / independent exact1

full runtime entries:
exact527 = directory exact33 + regular file exact491 + symlink exact3

installed-file rows / distributions / RECORD-closure matches:
exact482 / exact5 / exact5

unowned importable / unexpected entry:
exact0 / exact0

package acquisition / materialization / pytest probe / role import probe:
exact0 / exact0 / exact0 / exact0
```

The rederivation reads the already-retained root, accepted-wheel evidence,
and fixed lock only.  It does not rematerialize, repair, add, or remove an
entry.  The operational root and executable paths remain session-local and
are omitted from body-free evidence.

## 2.3 Eligibility and expiry

The Design-time equality proves that R1 can still be defined.  It is not a
future-time guarantee.  Immediately before the separately approved R1
launcher, owner and independent verifier must rederive every identity in
section 2.1 again.

Any loss, mutation, added entry, mode/control change, symlink-identity change,
unowned importable entry, unexpected entry, rematerialization, or interpreter
switch expires eligibility.  The typed pre-launch terminal is:

```text
R1_RUNTIME_IDENTITY_EXPIRED_NONCREDIT_STOP
```

On that terminal:

```text
pytest launcher / challenge / live remote / O01–O08:
exact0 / exact0 / exact0 / exact0

rematerialization / repair / interpreter switch / retry:
exact0 / exact0 / exact0 / exact0
```

# 3. Concrete R1 one-shot authority

## 3.1 Exactly one inactive token

This Design issues exactly one concrete execution authority:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_V5_R0_RUNTIME_READY_CREDITED_POSTVERIFIED_R1_SAME_RETAINED_RUNTIME_IDENTITY_AND_EXECUTABLE_HASH_REDERIVED_FRESH_CHALLENGE_FULL_EXACT8_ONE_SHOT_PYTEST_INVOCATION_EXACT1_ELIGIBLE_ACTUAL_GIT_REMOTE_MAIN_ACQUISITION_EXACT1_GUARDED_ADDITIONAL_ROLE_HARNESS_QUERY_REQUEST_DETECTION_POSITIVE_PROCESS_NETWORK_EXECUTION_EXACT0_RETRY_FALLBACK_PRIOR_RUN_REUSE_REMATERIALIZATION_INTERPRETER_SWITCH_EXACT0_O01_O07_CAUSAL_RED_O08_GREEN_V1_INVARIANCE_CLOSURE_EXACT1_OR_TYPED_NONCREDIT_STOP_AND_POSTVERIFICATION_ONLY
```

```text
state:
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED

concrete R1 token count:
exact1

automatic progression:
false
```

The token is not activated by this document, its publication, runtime
identity equality, or Mash approval of the present Design-only authority.

## 3.2 Pre-launch gates

R1 may reach its launcher only when all are true:

1. Mash separately approves the exact token in section 3.1;
2. this Design exact5 is credited and exact-content postverified;
3. current GitHub main still contains the fixed D1 and lock bytes;
4. the execution checkout is clean at the fixed mashos-api commit/tree;
5. owner and independent pre-launch runtime rederivation both equal section
   2.1 with unowned/unexpected exact0;
6. the retained operational executable resolves to the credited executable
   hash; and
7. the one-shot command and environment match sections 3.3 and 3.4.

Control-plane GitHub reads used to verify fixed source or publish Cocolon
evidence are outside the run/challenge acquisition budget.  They may not be
reused as the D1 observation.  The D1 test must acquire its fresh immutable
remote-main fact itself after creating its fresh challenge.

Gate failure is non-credit and stops.  No gate failure authorizes another
runtime, another interpreter, dependency installation, a second launcher, or
a corrected D2 run.

## 3.3 Frozen environment

R1 inherits the R0 isolation and adds fixed source pins:

```text
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1
PYTHONDONTWRITEBYTECODE=1
PYTEST_ADDOPTS absent
PYTEST_PLUGINS absent
PYTHONPATH absent

MASHOS_API_EXPECTED_HEAD_COMMIT_SHA1=
37eee88c431d1af3f8d2e96f9b0dd8b3d3bc327f

MASHOS_API_EXPECTED_HEAD_TREE_SHA1=
3891b84164ba0063136e47beb93d36798587a568

MASHOS_API_SOURCE_REPOSITORY_ROOT:
the operational root containing the fixed D1 blob; value omitted

working-directory class:
EMPTY_NON_REPOSITORY_DIRECTORY
```

Logical environment-policy SHA-256:

```text
6393dea280af670e3b0ed902014c86fc65a6666e973fe8e7ee50318ff1a11591
```

Its preimage is compact sorted-key UTF-8 JSON with exact4 top-level keys
`fixed`, `fixed_path_identity`, `removed`, and `working_directory_class`.
The exact no-LF preimage is:

```json
{"fixed":{"MASHOS_API_EXPECTED_HEAD_COMMIT_SHA1":"37eee88c431d1af3f8d2e96f9b0dd8b3d3bc327f","MASHOS_API_EXPECTED_HEAD_TREE_SHA1":"3891b84164ba0063136e47beb93d36798587a568","PYTEST_DISABLE_PLUGIN_AUTOLOAD":"1","PYTHONDONTWRITEBYTECODE":"1"},"fixed_path_identity":{"MASHOS_API_SOURCE_REPOSITORY_ROOT":"SOURCE_ROOT_CONTAINING_D1_BLOB_c0eb936690a3423ac4615a9aabb37c40cc257324"},"removed":["PYTEST_ADDOPTS","PYTEST_PLUGINS","PYTHONPATH"],"working_directory_class":"EMPTY_NON_REPOSITORY_DIRECTORY"}
```

`fixed` is an exact4 string-to-string object,
`fixed_path_identity` is an exact1 string-to-string object, and `removed` is
the ordered exact3 string array shown above.

## 3.4 Frozen launcher and budget

Operational command:

```text
<R0_RETAINED_EXECUTABLE> -B -m pytest -q --noconftest \
  -p no:cacheprovider <PUBLISHED_D1_V5_PATH> --maxfail=0
```

Shell parsing is not used.  The ordered logical argv preimage is:

```json
["EXECUTABLE_SHA256=9ed008e5a8685235361f0c53771b520ab082dd99a877ad2fd796a93fa4c0b488","-B","-m","pytest","-q","--noconftest","-p","no:cacheprovider","D1_BLOB_SHA1=c0eb936690a3423ac4615a9aabb37c40cc257324","--maxfail=0"]
```

```text
logical argv SHA-256:
8797754f541bd6bbd97734f0e80329cb597f2e37605755d33588fbef7d58f99c

pytest process invocation:
exact1

generic python/PATH resolution:
exact0

execution deadline:
1200 seconds; timeout is non-credit and no retry
```

The absolute executable and source-root paths are operational values only.
The receipt records their fixed hashes/identities, not their bodies.

`<PUBLISHED_D1_V5_PATH>` is not a relative path from the empty working
directory.  The executor resolves the fixed operational source root joined
with the exact repository-relative D1 path in section 1.3, requires the result
to remain inside that root and be a regular file, and verifies its Git blob and
raw SHA-256 before forming one absolute argv token.  The body-free logical
argv substitutes that operational token with the fixed D1 blob identity.

## 3.5 Fresh challenge and actual-Git budget

The unchanged D1 module-scoped fixture creates a fresh cryptographic challenge
after collection and before the neutral acquisition.  A control-plane HEAD
read, the R0 readiness observation, or any prior run cannot supply it.

```text
fresh run challenge:
exact1

eligible neutral actual-Git remote-main request / process-network execution:
exact1 / exact1

owner / independent / parent / harness additional process-network execution:
exact0 / exact0 / exact0 / exact0

retry / fallback / prior-run reuse:
exact0 / exact0 / exact0
```

The current-source D1 causal-RED proof intentionally detects additional
role/harness query requests and blocks them before execution.  Therefore the
frozen statements are not contradictory:

```text
additional current-source query request detection:
positive only in the exact node/lane required by O01–O07

additional process/network execution:
exact0
```

The numerical request count is diagnostic-only.  Credit requires the exact
node-specific signature and lane, not a guessed aggregate number.  Treating a
blocked request as an executed live query is forbidden; treating its positive
detection as desired GREEN behavior is also forbidden.

# 4. Exact8 result contract

## 4.1 Collection and ordered denominator

The fixed D1 source contains exact8 ordered test functions O01 through O08.
The module-scoped fixture requires the complete ordered node-id vector before
acquisition.

```text
ordered node-list SHA-256:
e2661d946c060efc44ce7da06f8c55f51d10dfad2af4f5f0526bd38109c340bc
```

```text
collected / executed denominator:
exact8 / exact8

maxfail early stop:
disabled

unexpected collection error / setup error / teardown error / interrupt:
exact0 / exact0 / exact0 / exact0
```

Collection other than exact8 is non-credit.  A partial O01–O08 vector is not
completed by prior-run evidence or a second launcher.

## 4.2 Frozen expected vector

| Node | Expected outcome | Exact causal signature | Exact violation class |
|---|---|---|---|
| O01 | `CAUSAL_RED` | `O01_OWNER_ADDITIONAL_LIVE_REMOTE_QUERY` | `LIVE_REMOTE_REQUERY_OUTSIDE_ACQUIRER` |
| O02 | `CAUSAL_RED` | `O02_INDEPENDENT_ADDITIONAL_LIVE_REMOTE_QUERY` | `LIVE_REMOTE_REQUERY_OUTSIDE_ACQUIRER` |
| O03 | `CAUSAL_RED` | `O03_SOURCE_AND_ROLES_NOT_ONE_OBSERVATION_CUT` | `OBSERVATION_MISSING_OR_MIXED` |
| O04 | `CAUSAL_RED` | `O04_VALID_DISPATCH_ADDITIONAL_LIVE_REMOTE_QUERY` | `LIVE_REMOTE_REQUERY_OUTSIDE_ACQUIRER` |
| O05 | `CAUSAL_RED` | `O05_EXACT23_CANDIDATE_OA_PATHS_REACQUIRE` | `LIVE_REMOTE_REQUERY_OUTSIDE_ACQUIRER` |
| O06 | `CAUSAL_RED` | `O06_PARENT_POSTFETCH_AND_INDEPENDENT_REACQUIRE` | `LIVE_REMOTE_REQUERY_OUTSIDE_ACQUIRER` |
| O07 | `CAUSAL_RED` | `O07_HARNESS_POSITIVE_PATH_EXCEEDS_EXACT1` | `ACQUISITION_CARDINALITY_INVALID` |
| O08 | `GREEN_V1_INVARIANCE` | `null` | `null` |

Canonical expected-vector preimage, compact sorted-key UTF-8 JSON with no
trailing LF:

```json
[{"causal_signature_id":"O01_OWNER_ADDITIONAL_LIVE_REMOTE_QUERY","node_id":"O01","outcome":"CAUSAL_RED","violation_class":"LIVE_REMOTE_REQUERY_OUTSIDE_ACQUIRER"},{"causal_signature_id":"O02_INDEPENDENT_ADDITIONAL_LIVE_REMOTE_QUERY","node_id":"O02","outcome":"CAUSAL_RED","violation_class":"LIVE_REMOTE_REQUERY_OUTSIDE_ACQUIRER"},{"causal_signature_id":"O03_SOURCE_AND_ROLES_NOT_ONE_OBSERVATION_CUT","node_id":"O03","outcome":"CAUSAL_RED","violation_class":"OBSERVATION_MISSING_OR_MIXED"},{"causal_signature_id":"O04_VALID_DISPATCH_ADDITIONAL_LIVE_REMOTE_QUERY","node_id":"O04","outcome":"CAUSAL_RED","violation_class":"LIVE_REMOTE_REQUERY_OUTSIDE_ACQUIRER"},{"causal_signature_id":"O05_EXACT23_CANDIDATE_OA_PATHS_REACQUIRE","node_id":"O05","outcome":"CAUSAL_RED","violation_class":"LIVE_REMOTE_REQUERY_OUTSIDE_ACQUIRER"},{"causal_signature_id":"O06_PARENT_POSTFETCH_AND_INDEPENDENT_REACQUIRE","node_id":"O06","outcome":"CAUSAL_RED","violation_class":"LIVE_REMOTE_REQUERY_OUTSIDE_ACQUIRER"},{"causal_signature_id":"O07_HARNESS_POSITIVE_PATH_EXCEEDS_EXACT1","node_id":"O07","outcome":"CAUSAL_RED","violation_class":"ACQUISITION_CARDINALITY_INVALID"},{"causal_signature_id":null,"node_id":"O08","outcome":"GREEN_V1_INVARIANCE","violation_class":null}]
```

```text
expected-vector SHA-256:
da9d266a254a12a655d4dd9388ccd3e866a57455ff98254e119571f8b824055b
```

External pytest process expectation:

```text
exit code:
1

pytest node result count:
failed exact7 / passed exact1 / error exact0
```

Exit code 1 alone is not credit.  Each O01–O07 failure must carry its exact
node signature, O08 must pass, and no setup/collection/teardown or unrelated
failure may be present.

For non-credit observations, `ordered_results` remains body-free and finite:

- `node_id` is only `O01` through `O08`, appears at most once, and rows form an
  order-preserving subsequence of that order; the full exact8 sequence is
  allowed as a non-credit vector;
- `outcome` is only `CAUSAL_RED`, `GREEN_V1_INVARIANCE`,
  `UNEXPECTED_GREEN`, or `UNEXPECTED_FAILURE`;
- `CAUSAL_RED` is allowed only with the exact node/signature/violation tuple
  in the expected vector;
- `GREEN_V1_INVARIANCE` is allowed only for O08 with both nullable fields
  `null`;
- a passed O01–O07 is normalized to `UNEXPECTED_GREEN` with both nullable
  fields `null`;
- a safely observed unexpected node failure is normalized to
  `UNEXPECTED_FAILURE`, `UNEXPECTED_SAFE_FAILURE`, and `ORACLE_FAILURE`;
- raw exception, assertion, nodeid, path, stack, or output text is never used
  as a row value; and
- a terminal pytest error without a safely attributable row increments
  `error_count` and appends no guessed row.

Pytest phase reports are normalized to mutually exclusive terminal records.
For one collected node the precedence is `error > failed > passed`; a setup or
teardown error overrides a call-phase pass/fail and that node is counted once
as error.  The overridden call-phase row is omitted.  A safely counted
collection/phase error not attributable to one O-node forms one error record
and no ordered row.  `executed_count` is the number of these normalized
terminal records and equals `failed_count + passed_count + error_count`.
The ordered row count is at most `executed_count`; it equals
`executed_count` only when every normalized terminal record has one safe row.
No raw phase text is retained.  All node-derived counts are between `0` and
`collected_count`; unattributed phase errors may make `error_count` and
`executed_count` positive while collected count is lower, which is always
non-credit.  Credit alone requires collected/executed/row exact8 and the
exact `7 failed + 1 passed + 0 error` vector.

## 4.3 Internal closure and semantic credit

Successful completion of O08 and clean fixture teardown must imply the
unchanged D1 assertions over:

```text
preflight:
PREFLIGHT_ELIGIBLE

remote observation:
AVAILABLE_MATCH

same source cut / immutable observation identity:
true / exact1 identity across roles

neutral request / execution:
exact1 / exact1

additional execution / retry / fallback / prior-run reuse:
exact0 / exact0 / exact0 / exact0

ordered oracle vector:
exact8 expected vector

closure:
exact1 and source/postrun equality true

terminal:
D1_CAUSAL_RED_REFREEZE_ESTABLISHED
```

The external executor does not add an instrumentation plugin, call a role
API, or extract a private module body.  It records the exact command identity,
safe process result, ordered node outcomes/signatures, and the fact that O08
plus fixture teardown completed.  Raw stdout/stderr may be retained only
session-locally for verification; the body-free receipt carries hashes,
byte counts, parsed safe fields, and typed result only.

## 4.4 Non-credit terminals

Any of the following stops the authority without retry:

- retained-runtime identity unavailable or unequal;
- source, tree, D1, lock, or cleanliness drift;
- pytest unavailable, timeout, process error, collection not exact8, partial
  execution, setup/teardown error, or unexpected exit;
- preflight rejection;
- remote observation unavailable, malformed, mismatched, or not one immutable
  observation identity;
- post-acquisition local-introspection typed abort;
- any missing or unexpected O01–O08 outcome/signature;
- additional process/network execution, retry, fallback, or prior-run reuse;
- closure missing, multiple, invalid, or not source-equal; or
- an execution result that cannot be safely classified from the one process.

Finite result classes for the R1 execution receipt are:

```text
D1_CAUSAL_RED_REFREEZE_ESTABLISHED
R1_RUNTIME_IDENTITY_EXPIRED_NONCREDIT_STOP
R1_SOURCE_IDENTITY_DRIFT_NONCREDIT_STOP
R1_PYTEST_LAUNCH_OR_COLLECTION_NONCREDIT_STOP
R1_D1_PREFLIGHT_REJECTED_NONCREDIT_STOP
R1_REMOTE_OBSERVATION_NONCREDIT_STOP
R1_POSTACQUISITION_TYPED_ABORT_NONCREDIT_STOP
R1_ORACLE_VECTOR_NONCREDIT_STOP
R1_CLOSURE_NONCREDIT_STOP
R1_RESULT_UNKNOWN_STOP
```

Only the first is credit.  No result automatically authorizes corrected D2.
Publication or postverification failure is outside these execution result
classes.  It is a non-credit checkpoint stop and cannot be circularly written
into the Receipt whose publication did not complete.

# 5. R1 result evidence and publication boundary

## 5.1 Body-free execution observation

The later R1 receipt must include one canonical observation with:

1. the concrete R1 authority token and automatic progression false;
2. this credited Design Receipt identity;
3. fixed Cocolon and mashos-api source identities;
4. owner and independent pre-launch runtime rederivation values;
5. logical environment and argv hashes;
6. launcher count, deadline class, exit code, stdout/stderr SHA-256 and byte
   counts without raw output;
7. collection/execution denominator and ordered exact8 safe result vector;
8. challenge/acquisition/additional-execution/retry/fallback/reuse counts as
   established by the unchanged D1 contract;
9. source/closure equality verdicts;
10. one finite result class and one owner verdict;
11. a separately rederived independent verdict over the same canonical
    observation bytes; and
12. delete-self receipt and observation SHA-256 values.

Unknown or unavailable values are represented by typed `null`, `0`, or
`NOT_STARTED` according to the reached stage.  Raw command output, absolute
paths, environment bodies, challenge secret input bytes, package bodies,
exception bodies, and credential/session/access-token bodies are forbidden.
The approved `authority_token` string is required and is not credential
material.

### 5.1.1 Canonical execution Receipt keysets and literals

The later R1 Body-free Receipt top level is exact16:

```text
authority_token
automatic_progression
body_free
credited_design_checkpoint
execution_observation
execution_observation_sha256
failure
independent_verdict
owner_verdict
receipt_sha256
receipt_sha256_preimage_rule
repository_scope
result_publication
schema_version
state
zero_effects
```

Top-level literals are:

```text
schema_version:
cocolon.emlis.nls_v3.step11.cycle001.recovery_epoch004.d1_v5.r1_exact8_one_shot_receipt.v1

authority_token:
the exact token in section 3.1

body_free / automatic_progression:
true / false

receipt_sha256_preimage_rule:
SHA256_OF_UTF8_COMPACT_SORTED_KEY_JSON_AFTER_DELETING_RECEIPT_SHA256_WITH_NO_TRAILING_LF
```

`credited_design_checkpoint` is exact7:

```text
cocolon_commit_sha1
cocolon_tree_sha1
receipt_path
receipt_git_blob_sha1
receipt_raw_sha256
receipt_logical_sha256
state
```

It binds the final postverified commit/tree of the present Design exact5 and
the present Design Receipt.  Its `state` is
`R1_EXECUTION_DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED`.

`result_publication` is exact8:

```text
repository_full_name
path
publication_commit_sha1
publication_tree_sha1
git_blob_sha1
raw_sha256
byte_count
postfetch_exact_equal
```

It binds the R1 Result published before the execution Receipt;
`repository_full_name` is `MassyuRed/Cocolon` and
`postfetch_exact_equal` is true.

`execution_observation` is exact10:

```text
stage
fixed_source
runtime_rederivation
environment_policy
command_contract
process_result
exact8
run_contract
source_and_closure
result_class
```

Its nested exact keysets are:

```text
fixed_source exact17:
repository_full_name,
expected_commit_sha1, expected_tree_sha1,
expected_d1_blob_sha1, expected_d1_raw_sha256,
expected_lock_blob_sha1, expected_lock_raw_sha256,
expected_lock_logical_sha256,
observed_commit_sha1, observed_tree_sha1,
observed_d1_blob_sha1, observed_d1_raw_sha256,
observed_lock_blob_sha1, observed_lock_raw_sha256,
observed_lock_logical_sha256, clean, all_equal

runtime_rederivation exact5:
expected, owner, independent, rederivation_count, all_equal

runtime_rederivation.expected exact7:
runner_projection_sha256, accepted_wheel_manifest_sha256,
distribution_closure_sha256, installed_file_manifest_sha256,
full_runtime_root_manifest_sha256, runtime_root_identity_sha256,
interpreter_executable_sha256

runtime owner/independent row exact11:
role, status, runner_projection_sha256,
accepted_wheel_manifest_sha256, distribution_closure_sha256,
installed_file_manifest_sha256, full_runtime_root_manifest_sha256,
runtime_root_identity_sha256, interpreter_executable_sha256,
unowned_importable_count, unexpected_entry_count

environment_policy exact2:
logical_policy_sha256, working_directory_class

command_contract exact4:
logical_argv_sha256, invocation_count, deadline_seconds,
generic_path_resolution_count

process_result exact11:
started, completed, timed_out, exit_code,
stdout_capture_state, stdout_sha256, stdout_byte_count,
stderr_capture_state, stderr_sha256, stderr_byte_count, safe_result

exact8 exact6:
collected_count, executed_count, failed_count, passed_count,
error_count, ordered_results

ordered_results row exact4:
node_id, outcome, causal_signature_id, violation_class

run_contract exact9:
fresh_challenge_count, neutral_remote_request_count,
neutral_remote_execution_count, additional_remote_execution_count,
retry_count, fallback_count, prior_run_reuse_count,
rematerialization_count, interpreter_switch_count

source_and_closure exact7:
preflight_class, remote_result_class, same_source_cut,
observation_identity_count, closure_count, terminal_class,
equality_verdicts

equality_verdicts exact8:
repository_identity_consistent, source_cut_consistent,
owner_executor_consistent, independent_executor_consistent,
parent_phase3_source_consistent, live_remote_match,
closure_consistent, body_free
```

`failure` is exact3 `stage`, `class`, and `safe_code`.  Each owner/independent
verdict is exact4 `role`, `verdict`, `reason_code`, and
`execution_observation_sha256`.

`repository_scope` is exact5:

```text
cocolon_new_path_count
cocolon_modified_path_count
cocolon_paths
mashos_api_changed_path_count
production_or_test_changed_path_count
```

The counts are `3 / 2 / exact5 / 0 / 0`, and `cocolon_paths` is exactly the
ordered R1 path list in section 5.2.

`zero_effects` is exact8, with every value integer `0`:

```text
mashos_api_change_count
product_runtime_effect_count
reference_or_operational_admission_count
candidate_or_event1_count
source_lock_change_count
corrected_d2_invocation_count
stability_run_count
automatic_transition_count
```

`execution_observation_sha256` is SHA-256 of compact sorted-key UTF-8 JSON of
the exact `execution_observation` object with no trailing LF.  `receipt_sha256`
is the same canonical hash after deleting only `receipt_sha256` from the top
object, also with no trailing LF.  The stored Receipt is compact sorted-key
UTF-8 JSON plus exactly one trailing LF.

### 5.1.2 Finite enums and cross-field rules

`state` and `execution_observation.result_class` use the exact10 result classes
in section 4.4 and must be byte-equal.  Failure mapping is exact:

| Result class | failure.stage | failure.class | failure.safe_code |
|---|---|---|---|
| `D1_CAUSAL_RED_REFREEZE_ESTABLISHED` | `NONE` | `NONE` | `NONE` |
| `R1_RUNTIME_IDENTITY_EXPIRED_NONCREDIT_STOP` | `PRELAUNCH_RUNTIME` | `IDENTITY` | `RUNTIME_IDENTITY_EXPIRED` |
| `R1_SOURCE_IDENTITY_DRIFT_NONCREDIT_STOP` | `PRELAUNCH_SOURCE` | `IDENTITY` | `SOURCE_IDENTITY_DRIFT` |
| `R1_PYTEST_LAUNCH_OR_COLLECTION_NONCREDIT_STOP` | `PYTEST` | `EXECUTION` | `PYTEST_LAUNCH_OR_COLLECTION_INVALID` |
| `R1_D1_PREFLIGHT_REJECTED_NONCREDIT_STOP` | `D1_PREFLIGHT` | `PREFLIGHT` | `D1_PREFLIGHT_REJECTED` |
| `R1_REMOTE_OBSERVATION_NONCREDIT_STOP` | `REMOTE_OBSERVATION` | `EXTERNAL_OBSERVATION` | `REMOTE_OBSERVATION_NOT_EVALUABLE` |
| `R1_POSTACQUISITION_TYPED_ABORT_NONCREDIT_STOP` | `POSTACQUISITION` | `LOCAL_INTROSPECTION` | `POSTACQUISITION_TYPED_ABORT` |
| `R1_ORACLE_VECTOR_NONCREDIT_STOP` | `ORACLE` | `SEMANTIC_VECTOR` | `ORACLE_VECTOR_INVALID` |
| `R1_CLOSURE_NONCREDIT_STOP` | `CLOSURE` | `CLOSURE` | `CLOSURE_INVALID` |
| `R1_RESULT_UNKNOWN_STOP` | `RESULT` | `RESULT_UNKNOWN` | `RESULT_UNKNOWN` |

Verdict roles are exactly `OWNER` and `INDEPENDENT_VERIFIER`.  Verdict is
`VALID` only for credit and otherwise `INVALID`.  Reason code maps in result
class order to:

```text
ALL_CHECKS_EQUAL
RUNTIME_IDENTITY_EXPIRED
SOURCE_IDENTITY_DRIFT
PYTEST_LAUNCH_OR_COLLECTION_INVALID
D1_PREFLIGHT_REJECTED
REMOTE_OBSERVATION_NOT_EVALUABLE
POSTACQUISITION_TYPED_ABORT
ORACLE_VECTOR_INVALID
CLOSURE_INVALID
RESULT_UNKNOWN
```

Both verdicts independently canonicalize the same observation and carry the
same `execution_observation_sha256`.  Credit requires both verdicts `VALID /
ALL_CHECKS_EQUAL`; one verdict cannot reuse the other's semantic decision.

`stage` is one of:

```text
PRELAUNCH_SOURCE_CHECK
PRELAUNCH_RUNTIME_CHECK
PROCESS_START
PROCESS_COMPLETION
RESULT_PARSE
```

Runtime role `status` is `NOT_STARTED`, `VALID`, or `INVALID`.  Process
`safe_result` is one of:

```text
NOT_STARTED
PROCESS_START_FAILED
COMPLETED_EXIT_1
COMPLETED_UNEXPECTED_EXIT
TIMEOUT
PROCESS_RESULT_UNKNOWN
```

Each stream capture state is `NOT_STARTED`, `CAPTURED`, or `UNAVAILABLE`.
If `process_result.started=false`, both capture states are `NOT_STARTED`, both
stream hashes, byte counts, and `exit_code` are `null`, `completed=false`, and
`timed_out=false`.  If a started process yields captured bytes, capture state
is `CAPTURED`, the hash is lowercase exact64 SHA-256, and byte count is a
nonnegative integer; actual empty bytes use SHA-256 of empty bytes and count
`0`.  Capture failure is never normalized to empty: its state is
`UNAVAILABLE`, hash and count are `null`, and the execution result is
`R1_RESULT_UNKNOWN_STOP` with `safe_result=PROCESS_RESULT_UNKNOWN`.
`completed=true` records the independently observed process fact and requires
integer `exit_code` plus `timed_out=false`; it does not require successful
stream capture.  When either completed-process stream is `UNAVAILABLE`, the
safe result remains `PROCESS_RESULT_UNKNOWN` and the result is non-credit.
When both are `CAPTURED`, exit `1` may use `COMPLETED_EXIT_1`; any other exit
uses `COMPLETED_UNEXPECTED_EXIT`.  `timed_out=true` requires
`completed=false` and `exit_code=null`; it uses `safe_result=TIMEOUT` only when
both partial streams are safely captured, otherwise `PROCESS_RESULT_UNKNOWN`.

`source_and_closure.preflight_class` is one of:

```text
NOT_STARTED
PREFLIGHT_ELIGIBLE
PREFLIGHT_REPOSITORY_MISMATCH
PREFLIGHT_REF_MISMATCH
PREFLIGHT_LOCAL_SOURCE_CUT_INVALID
PREFLIGHT_EXECUTOR_IDENTITY_INVALID
```

`remote_result_class` is one of:

```text
NOT_STARTED
AVAILABLE_MATCH
OBSERVATION_UNAVAILABLE_EXCEPTION
OBSERVATION_UNAVAILABLE_TIMEOUT
OBSERVATION_UNAVAILABLE_NONZERO
OBSERVATION_STDERR_NONEMPTY
OBSERVATION_MALFORMED
REMOTE_MAIN_OID_MISMATCH
```

`terminal_class` is one of:

```text
NOT_STARTED
PREFLIGHT_REJECTED_NON_CREDIT
POSTACQUISITION_TYPED_ABORT_NON_CREDIT
RUN_NOT_EVALUABLE
RUN_FAILED
RUN_CLOSURE_INVALID
RUN_EVALUATED_GREEN
D1_CAUSAL_RED_REFREEZE_ESTABLISHED
```

The first seven equality-verdict values are nullable booleans.  `body_free`
is always boolean `true`.  When no D1 projection exists, the first seven are
all `null`; once a projection exists, all exact8 values are booleans copied or
independently rederived from the fixed D1 projection contract.

### 5.1.3 Stage and null/zero projections

The fixed-source expected fields are always populated from section 1.3.
Observed source hashes are lowercase exact40/exact64 when safely observed and
otherwise `null`; `clean` is boolean or `null`.  `all_equal=true` requires
every observed field equal its expected field and `clean=true`.

At `PRELAUNCH_SOURCE_CHECK`, source drift selects the source-drift result;
runtime rows are `NOT_STARTED` with nullable hashes `null`, counts `0`,
`rederivation_count=0`, and `all_equal=false`.  Command invocation, exact8,
and every run-contract count are `0`, ordered results are empty, and process
uses the exact not-started capture/null projection in section 5.1.2.

For every pre-process and pre-fixture stop, `source_and_closure` has
`preflight_class=NOT_STARTED`, `remote_result_class=NOT_STARTED`,
`same_source_cut=null`, observation/closure counts `0`,
`terminal_class=NOT_STARTED`, the first seven equality values `null`, and
`body_free=true`.

At `PRELAUNCH_RUNTIME_CHECK`, fixed source is all-equal.  Owner and independent
rederivation each run once, so `rederivation_count=2`; each row retains its
actual safe hashes or `null`, status, and counts.  Runtime credit eligibility
requires both rows `VALID`, every row hash equal the expected exact7, both
unowned/unexpected counts `0`, and `all_equal=true`.  Expiry keeps command,
exact8, and run-contract counts zero, ordered results empty, and process at
the exact not-started capture/null projection.

At `PROCESS_START`, command `invocation_count=1`.  A spawn failure has
`started=false`, capture states `NOT_STARTED`, stream hashes/counts and exit
code `null`, completed/timed-out false, and
`safe_result=PROCESS_START_FAILED`.  A started process follows the stream
rules above.  No second start is allowed.

At `PROCESS_COMPLETION`, the one process has completed, timed out, or reached
an unknown process result.  Only safely parsed collection, node, and run
fields may be nonzero; no expected value is filled from prior evidence.

If the D1 fixture creates its challenge but rejects preflight before neutral
acquisition, the result is
`R1_D1_PREFLIGHT_REJECTED_NONCREDIT_STOP`: collection exact8, executed exact0,
fresh challenge exact1, neutral request/execution exact0, ordered results
empty, preflight class equal to the reached non-eligible finite class,
`remote_result_class=NOT_STARTED`, `same_source_cut=null`, observation and
closure counts `0`, `terminal_class=PREFLIGHT_REJECTED_NON_CREDIT`, first seven
equality values `null`, and `body_free=true`.

At `RESULT_PARSE`, owner and independent verifier derive the finite result
from the same complete safe observation.  Remote or typed-abort outcomes may
have collected exact8 but executed exact0 and closure exact0; they retain the
fresh challenge and one neutral acquisition attempt actually reached.  Oracle
or closure failures retain only the exact ordered rows and equality values
actually established.  `R1_RESULT_UNKNOWN_STOP` cannot claim complete exact8,
closure, or a valid verdict and never authorizes a retry.

The credited projection is fully non-null at `RESULT_PARSE` and requires:

```text
fixed source / runtime:
all_equal true / all_equal true / owner VALID / independent VALID

process:
started true / completed true / timed_out false / exit_code 1 /
safe_result COMPLETED_EXIT_1

exact8:
collected 8 / executed 8 / failed 7 / passed 1 / error 0 /
ordered_results byte-for-byte equal to section 4.2 including violation class

run contract:
challenge 1 / neutral request 1 / neutral execution 1 /
additional execution 0 / retry 0 / fallback 0 / reuse 0 /
rematerialization 0 / interpreter switch 0

source and closure:
PREFLIGHT_ELIGIBLE / AVAILABLE_MATCH / same cut true /
observation identity 1 / closure 1 /
all exact8 equality_verdicts true /
D1_CAUSAL_RED_REFREEZE_ESTABLISHED

top cross-fields:
state == execution_observation.result_class ==
source_and_closure.terminal_class ==
D1_CAUSAL_RED_REFREEZE_ESTABLISHED

failure:
NONE / NONE / NONE

owner / independent verdict:
VALID / ALL_CHECKS_EQUAL / same observation hash
```

## 5.2 Later R1 exact5 paths

The concrete R1 authority may publish only:

```text
NEW exact3:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_SameRetainedRuntime_FreshChallenge_Exact8OneShot_Result_20260731.md
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_SameRetainedRuntime_FreshChallenge_Exact8OneShot_BodyFree_Receipt_20260731.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_SameRetainedRuntime_FreshChallenge_Exact8OneShot_Handoff_20260731.md

MODIFY append-only exact2:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md
Cocolon_前提資料/07_latest_snapshot_diff.md
```

```text
mashos-api change:
exact0

production effect / Reference / OA / Candidate / Event1 / source lock:
exact0 / exact0 / exact0 / exact0 / exact0 / false
```

The R1 result exact5 records either the credited terminal or the reached typed
non-credit stop.  It does not hide an unfavorable result and does not rerun
until favorable.  Publication occurs only after the one allowed launcher has
terminated and Karen can form a body-free observation without guessing.
If the result cannot be safely formed or GitHub publication/postverification
fails, the checkpoint stops outside the Receipt state; it does not fabricate
a published failure record.

# 6. Current Design exact5 publication contract

The present Design-only checkpoint uses:

```text
NEW exact3:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_RuntimeReadyCredited_R1OneShotAuthorityBinding_Design_ReadOnly_20260731.md
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_RuntimeReadyCredited_R1OneShotAuthorityBinding_Design_ReadOnly_BodyFree_Receipt_20260731.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_RuntimeReadyCredited_R1OneShotAuthorityBinding_Design_ReadOnly_Handoff_20260731.md

MODIFY append-only exact2:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md
Cocolon_前提資料/07_latest_snapshot_diff.md
```

Publication order is Design, Receipt, Handoff, Plan append, latest snapshot
append.  Each target is postfetched exact-equal.  The Receipt carries the
published Design identity; Handoff carries Design and Receipt identities;
Plan carries published exact3; latest snapshot carries published exact4.

The current pre-append identities are:

```text
Execution and Closure Plan blob / raw / bytes:
810d34be3d3542d42f36cca550845414e196a2c3
d0afd2fa09d26f778dc92b1875f4b2f1c9ea1120f49bdc8ef04791633cfef7d5
365347

latest snapshot blob / raw / bytes:
67a771d08740c895722a360e278c0f676b61dbb0
a2f0d78340a95a84e1e27d2c2e86df0e5c3fd89b118041ff746254af294bcc49
1561399
```

Both are append-only; the exact byte prefixes above must remain unchanged.

# 7. Confirmed facts, inference, and Karen's opinion

## 7.1 Confirmed facts

- Cocolon main contains the fully postverified R0 exact5 and its Receipt says
  `RUNTIME_READY` with owner/independent `VALID`;
- current mashos-api main, D1 blob, and lock blob equal the R0-fixed source;
- owner and independent Design-time rederivation both reproduced the full
  retained-runtime and executable identities with unowned/unexpected exact0;
- the fixed D1 source contains the ordered O01–O08 exact8 and internally
  distinguishes guarded query requests from actual process/network execution;
- this authority invoked no pytest, created no challenge, acquired no live
  run observation, and changed no mashos-api file; and
- corrected D2 and every later product/governance effect remain blocked.

## 7.2 Inference

The retained runtime remains eligible at Design time, so the known launcher
gap no longer prevents defining R1.  This does not predict whether the future
remote observation will be available or whether the exact8 vector will match.

## 7.3 華恋の意見

次は、同じruntimeを使うことだけでなく、実行直前にも同一性を再確認した上で、
fresh challengeを持つ一回だけを実行すべきです。O01–O07で検出する追加queryの
「要求」と、実際のprocess/network「実行」を混同すると、因果REDの意味が壊れます。
要求の検出は現行sourceの違反証拠、追加実行exact0は観測の単一性を守る境界です。

有利な結果が出るまで再実行せず、一回の全exact8が期待vectorとclosureを満たした
場合だけD1 causal RED creditとして扱うのが妥当です。

# 8. Exactly one next authority and stop

```text
next authority:
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_V5_R0_RUNTIME_READY_CREDITED_POSTVERIFIED_R1_SAME_RETAINED_RUNTIME_IDENTITY_AND_EXECUTABLE_HASH_REDERIVED_FRESH_CHALLENGE_FULL_EXACT8_ONE_SHOT_PYTEST_INVOCATION_EXACT1_ELIGIBLE_ACTUAL_GIT_REMOTE_MAIN_ACQUISITION_EXACT1_GUARDED_ADDITIONAL_ROLE_HARNESS_QUERY_REQUEST_DETECTION_POSITIVE_PROCESS_NETWORK_EXECUTION_EXACT0_RETRY_FALLBACK_PRIOR_RUN_REUSE_REMATERIALIZATION_INTERPRETER_SWITCH_EXACT0_O01_O07_CAUSAL_RED_O08_GREEN_V1_INVARIANCE_CLOSURE_EXACT1_OR_TYPED_NONCREDIT_STOP_AND_POSTVERIFICATION_ONLY

state:
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED

concrete successor token count:
exact1

automatic progression:
false
```

Required stop:

```text
RECOVERY_EPOCH004_D1_V5_R0_RUNTIME_READY_CREDITED_POSTVERIFIED_SAME_RETAINED_RUNTIME_REDERIVED_EQUAL_R1_CONCRETE_AUTHORITY_DEFINED_INACTIVE_PYTEST_CHALLENGE_LIVE_REMOTE_O01_O08_EXACT0_CORRECTED_D2_STABILITY_REFERENCE_OPERATIONAL_ADMISSION_BLOCKED_AUTOMATIC_PROGRESSION_FALSE_AUTHORITY_STOP
```

No R1 launcher, corrected D2, stability run, Reference/OA, Candidate/Event1,
source lock, runtime product, or later authority was executed.
