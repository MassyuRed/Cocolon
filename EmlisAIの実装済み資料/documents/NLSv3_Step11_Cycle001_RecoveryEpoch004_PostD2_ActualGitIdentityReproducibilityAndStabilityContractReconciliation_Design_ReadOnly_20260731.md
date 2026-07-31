---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch004_post_d2_actual_git_identity_reproducibility_stability_contract_reconciliation
title: "NLS v3 Step 11 Cycle001 Recovery Epoch004 post-D2 actual-Git identity reproducibility and stability contract reconciliation"
revision_date: "2026-07-31"
status: "DESIGN_FROZEN_D2_STABLE_POSTVERIFIED_CREDIT_NOT_ESTABLISHED_CORRECTED_D1_V5_NOT_AUTHORIZED"
body_free: true
automatic_progression: false
---

# 0. Authority and decision

This Design is produced only under:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D2_POSTPUBLICATION_DIAGNOSTIC_FULL_EXACT8_GREEN_NONCREDIT_PRIOR_MIGRATING_O02_O06_FAILURES_NONREPRODUCED_LIVE_REMOTE_EXACT45_MULTICALL_OBSERVATION_LATENCY_ACTUAL_GIT_IDENTITY_REPRODUCIBILITY_AND_STABILITY_CONTRACT_RECONCILIATION_DESIGN_READ_ONLY
```

The approved work is design-only.  It reconciles the actual-Git identity
contract after the published D2 source produced two different
postpublication full-exact8 failures and a later instrumented diagnostic
full exact8 passed without reproducing either failure.

The decision is:

```text
published D2 implementation:
RETAINED_IMMUTABLE_TARGETED_GREEN_SOURCE

D2 stable postverified credit:
NOT_ESTABLISHED

diagnostic full exact8 GREEN:
VALID_DIAGNOSTIC_NON_CREDIT

historical O02 / O06 direct failure cause:
NOT_PROVEN

Reference / OperationalAdmission issuance:
BLOCKED_BEFORE_STABILITY_RECONCILIATION

required next class:
DISTINCT_CORRECTED_D1_V5_CAUSAL_RED_REFREEZE
```

This Design does not change mashos-api, modify the D1 v4 test, run or
collect pytest, rerun a failed oracle, implement an observation owner,
create a cache or snapshot, issue Reference or OperationalAdmission,
allocate Candidate, publish Event1, lock the source baseline, materialize
runtime, or enter a later phase.

# 1. Governing context and fixed entry

## 1.1 Governing sources

The governing order remains:

1. Karen-Diary operating memory and Karen operating principles;
2. Cocolon work-attitude rules;
3. `Cocolon_前提資料/00_karen_read_first.md`;
4. `Cocolon_前提資料/07_latest_snapshot_diff.md`;
5. `Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md`
   section `CURRENT_NORMATIVE_CONTRACT`;
6. the Recovery Epoch004 additive corrective P0 Parent Design, especially
   sections 7 through 13;
7. the current Execution and Closure Plan; and
8. actual GitHub Cocolon and mashos-api files at the fixed entries.

The current GitHub reflection contract is unchanged:

```text
blob:
4b8a4be26980b688883c0e7ed2bce8f3bf6b4fb2

raw SHA-256:
c2191d5a49c05a37bb4ac5607a0703185459f09313611f5cb789860278aae6c6
```

This runtime evidence Design does not add a transport condition to that
contract.

## 1.2 Fixed repository entry

```text
Cocolon main commit / tree:
d3b4c4a63aa2e00fe09251dbbc2d33c9a91dc2fe
73a349ca167bf6fba81a8786ad6e85013240ad5d

mashos-api main commit / tree:
735b1a59e525b6b314fd7139deb653543a74c389
eab4977649d8b31258c12e7ea49e1879c5e4a223

mashos-api branch / origin-main / worktree:
main / 735b1a59e525b6b314fd7139deb653543a74c389 / CLEAN
```

The mashos-api identity is the fixed post-D2 entry for this Design.  It is
not hard-coded as the future corrected-D2 final source.  A future D2
correction would necessarily create and bind a later source identity.

## 1.3 Frozen P0 and current exact4 source identities

```text
additive corrective P0 external identity:
aa602f6c7c39ea1ad0ece9ed6974c76b7dc8f3a4207540a290e3bb3eb06fe046
```

Current D1 v4 exact1:

```text
path:
ai/tests/test_emlis_nls_v3_recovery_epoch004_operational_admission_v2_event1_connection_actual_git_identity_parent_phase3_red.py

blob / raw SHA-256:
b7072620c31cd615ab221647c7145947255294e1
e67a26cd72cd8007c58e71a8c4258c0ab3244718717b305289f3ee346eaeb9dc
```

Current D2 mandatory direct exact3:

| Role | Path | Git blob SHA-1 | Raw SHA-256 |
|---|---|---|---|
| owner | `ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py` | `044287009b1fd155689bded46628b8fc91b73c06` | `13aa675be1356ab524a69066f861c2d27a8d8e32f0d690811b2b3308f199057d` |
| independent | `ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py` | `0fae71a29f8fe44d31c18af42aaf53cc34beac6c` | `634ddb104e0b7630c695e032bb54726912fcfc9ad4351ab0eb6da7901671fc2b` |
| parent | `ai/tools/emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py` | `fdea3dc18d81ca9ce1e3a842e802d21d0019a8c5` | `14fedde39823d90253a6adec6fc05ccde29f05a659edbac7edc007b28eab5793` |

The v1 OperationalAdmission exact16 and predecessor exact8 semantics,
ordered key sets, public APIs, meaning, and frozen function-level source
and closure hashes remain invariant.  This Design does not weaken or
replace them.

# 2. Confirmed postpublication evidence

## 2.1 Canonical uninstrumented history

Two postpublication full-exact8 runs were executed against the same
published source identity:

```text
run A:
O06 failed / other exact7 passed

immediate O06-only diagnostic:
passed

run B:
O02 failed / other exact7 passed

immediate O02-only diagnostic:
passed
```

The isolated passes do not replace either failed full run.  The failed
predicate's return code, stderr, exception class, or exact remote state was
not captured.  Therefore neither failure can be classified
retrospectively as a GitHub, network, timeout, source, test, or production
defect.

## 2.2 Instrumented diagnostic full exact8

A separately approved diagnostic wrapped parent-process
`subprocess.run`, forwarded the same arguments once to the original
function, returned the original result, re-raised the same exception, and
wrote body-free call metadata to an external pre-opened descriptor.  PATH
was unchanged and the real Git executable remained `/usr/local/bin/git`.

```text
result:
8 passed / 1 warning / 571.48 seconds

diagnostic Git-call log SHA-256:
4a22e0f1e0ce7731c6c75b244598a1ac09da6da8b8743a59e8fb51e8bbd5d6f7

diagnostic pytest output SHA-256:
92b42bee155c093dca92ebc017d0ae37445428a4d4c5d9c7fda6aeb9e111c939

Git calls / completed / exception / nonzero / nonempty stderr:
7040 / 7040 / 0 / 0 / 0

live ls-remote calls:
exact45

live ls-remote duration:
5.054–9.686 seconds each / 280.701 seconds total

observed remote row:
735b1a59e525b6b314fd7139deb653543a74c389	refs/heads/main

distinct observed remote OID count:
exact1
```

The raw 17 MB diagnostic log is not a Cocolon artifact and is not added to
the repository.  Its digest and aggregate body-free facts are diagnostic
evidence only.

During postrun inspection, tracked canonical `__pycache__` files exact28
were temporarily mistaken for disposable generated files, moved outside
the clone, identified from HEAD, and restored with the same bytes.  This
occurred after pytest.  The final diagnostic clone was clean, the exact28
matched HEAD, and no commit or GitHub state was changed.

## 2.3 Call-level amplification

The current valid actual-Git binding predicate in each production role
performs exact16 Git subprocess calls:

```text
rev-parse:
exact6

merge-base:
exact2

hash-object:
exact2

show:
exact2

remote get-url / ls-remote / status / symbolic-ref:
exact1 / exact1 / exact1 / exact1
```

The diagnostic full-run role counts were:

| Lane | Git calls | live `ls-remote` |
|---|---:|---:|
| harness | 6706 | 31 |
| owner | 135 | 5 |
| independent | 167 | 7 |
| parent | 32 | 2 |
| total | 7040 | 45 |

Production O02 executed its independent exact16 sequence exact3.
Production O06 executed its parent exact16 sequence exact2.  The repeated
semantic reexecutions are meaningful.  Reacquiring the same live remote
fact for each reexecution is not an independent semantic proof.

The diagnostic run established that all exact45 observations could agree
and succeed.  It did not reproduce or identify the prior failures.

# 3. What is not established

The following claims are not established and must not be inferred:

- `ls-remote` caused either historical failure;
- GitHub returned a transient error in either historical failure;
- current source has a deterministic O02 or O06 defect;
- the diagnostic instrumentation was behaviorally invisible for credit;
- one successful full run proves future reproducibility;
- the remote main remained unchanged for the entire diagnostic duration;
- a local `origin/main` value alone can replace a live remote observation;
- repeated remote acquisition is required for owner/independent role
  separation; or
- retrying until a favorable full run would establish stable credit.

The strongest supported inference is only that exact45 slow external
observations widen the temporal and availability surface without creating
45 distinct remote-main facts.

# 4. Position-change gate

## 4.1 Prior position

The additive corrective P0 Parent Design froze:

```text
D1 causal RED
-> D2 implementation and targeted GREEN
-> final D2-complete-source-bound Reference / OperationalAdmission
```

The published D1 v4 and D2 completed the first two stages in their
approved boundaries.

## 4.2 Proposed position

The reconciled order is:

```text
historical published D1 v4 / D2 targeted GREEN retained
-> post-D2 actual-Git stability corrected D1 v5 causal RED
-> later corrected D2 implementation and targeted GREEN
-> separately authorized postpublication stability matrix
-> final corrected-D2-source-bound Reference / OperationalAdmission
```

## 4.3 Change basis

New evidence consists of:

- full-run failure moving from O06 to O02 under the same published source;
- both immediate selected-oracle reruns passing;
- the static exact16 actual-Git predicate in each production role;
- live remote observation exact45 in one full exact8;
- production live remote exact14 and harness live remote exact31;
- all exact45 diagnostic calls succeeding with one identical OID; and
- the instrumented full exact8 passing as non-credit.

## 4.4 Exact error and correction

The prior order treated actual-Git identity meaning and the cardinality of
live network reacquisition as one concern.  It froze strong identity
semantics but left reproducibility dependency and harness amplification
unclassified.

The correction is additive.  Existing P0, Parent Design, D1 v4, D2 source,
and failed/passed run history remain immutable.  Stable postverification
credit is not established, and a stability-specific D1/D2 successor is
inserted before Reference/OA.  This does not cancel the published D2
implementation or reinterpret its targeted GREEN.

# 5. Reconciled consistent-cut contract

## 5.1 Meaning of a consistent cut

A consistent cut is one successful, immutable remote-main observation
made for one named canonical run and one run challenge.

It proves:

```text
at acquisition time:
the exact normalized repository/ref returned one exact OID

for that run:
all owner / independent / parent / harness judgments use the same
observation identity and the same local source cut
```

It does not claim that remote main stays unchanged continuously after
acquisition.  A later run, later publication stage, or later credit
authority must acquire a new observation.

## 5.2 Neutral acquisition owner

The contract role is:

```text
ACTUAL_GIT_REMOTE_MAIN_OBSERVATION_ACQUIRER
```

This is a semantic role, not a selected module, API, fixture, cache,
singleton, or file placement.

The acquirer may:

- resolve the actual repository root;
- normalize and verify the repository identity represented by `origin`;
- query exactly `refs/heads/main`;
- record one body-free observation and local source cut; and
- compute the immutable observation identity.

The acquirer may not:

- validate Event1 or OperationalAdmission semantics;
- call or replace the owner or independent validator;
- decide GREEN, RED, credit, or phase progression;
- retry, back off, use another transport, or fall back to a cached/local
  answer;
- mutate the observation after publication to consumers; or
- reuse an observation from another run.

The semantic acquisition profile is frozen even though helper/API/file
placement remains open:

```text
profile_id:
cocolon.emlis.nls_v3.recovery_epoch004.actual_git_ls_remote_main.v1

executable:
the real resolved Git executable

semantic argv:
git ls-remote --exit-code origin refs/heads/main

cwd:
the resolved mashos-api repository root

shell / stdin / timeout:
false / DEVNULL / exact20 seconds

stdout / stderr:
captured as bytes
```

The process environment removes every inherited `GIT_*` variable plus
`LD_AUDIT`, `LD_LIBRARY_PATH`, `LD_PRELOAD`, and `PYTHONPATH`, then fixes:

```text
GIT_ATTR_NOSYSTEM=1
GIT_CONFIG_GLOBAL=<platform null device>
GIT_CONFIG_NOSYSTEM=1
GIT_EXTERNAL_DIFF=
GIT_OPTIONAL_LOCKS=0
GIT_PAGER=cat
GIT_TERMINAL_PROMPT=0
PATH=<resolved Git executable parent only>
```

The `origin` URL must normalize to `MassyuRed/mashos-api`.  Its normalized
host must be one of exact4:

```text
git.chatgpt-team.site
github.com
ssh.github.com
www.github.com
```

No credential-bearing URL is passed as argv or persisted.  On process
completion, stdout and stderr are decoded with strict UTF-8.  Success
requires return code 0, stderr empty, and stdout containing exact1 row in
the exact semantic form:

```text
<lowercase SHA-1 exact40 hex><TAB>refs/heads/main
```

A single terminal line ending is permitted; empty, additional,
non-UTF-8, wrong-ref, or malformed output is not success.  The frozen
`profile_id` is bound into the observation.  GitHub API substitution,
another Git transport, another remote/ref, shell execution, and fallback
are outside this profile.

## 5.3 Acquisition and live-query cardinality

Cardinality is evaluated in two steps.

Preflight uses local, deterministic facts only.  It validates that the
requested repository, root, remote name, normalized repository identity,
source ref, branch, entry lineage, pre-attempt local source identity, and
executor paths are eligible for canonical acquisition.

Preflight always produces a body-free exact13 record before any network
access:

```text
schema_version
run_challenge_id
run_scope
repository_full_name
acquisition_profile_id
preflight_class
failure_stage
repository_identity_sha256
before_local_source_identity_sha256
module_identities_sha256
live_query_count_at_preflight
domain_effect_count
preflight_sha256
```

Its schema is:

```text
cocolon.emlis.nls_v3.recovery_epoch004.actual_git_preflight.v1
```

`live_query_count_at_preflight` and `domain_effect_count` are both 0.
`acquisition_profile_id` is the frozen v1 value in §5.2.  For
`PREFLIGHT_ELIGIBLE`, the three identity hashes are lowercase SHA-256
exact64 values over, respectively, the exact6 repository identity, the
pure-local exact14 `before` identity, and the exact3 module-identities
object defined below.  A hash is `null` only when the typed rejection
prevents that complete valid object from being formed.
`preflight_sha256` uses delete-self canonical sorted compact UTF-8.  An
eligible observation must reproduce all three preflight hashes before it
is exposed to consumers.  A preflight rejection is terminal for that
run/challenge: this exact13 record is retained, no acquisition
observation exists, and no terminal evaluation projection is fabricated.

`failure_stage` is one of exact6:

```text
NONE
REPOSITORY_IDENTITY
SOURCE_REF
LOCAL_SOURCE_IDENTITY
MODULE_IDENTITIES
SAFE_LOCAL_INTROSPECTION_EXCEPTION
```

Eligible preflight requires `NONE` and all three hashes present.  For a
rejection, `failure_stage` identifies the first failed deterministic
stage.  Every fully formed identity is hashed even when its values are
invalid; only an identity that cannot be completely formed and every
not-yet-reached identity are `null`.  Therefore a dirty, wrong-branch, or
ancestry-invalid but structurally complete local identity is hashable,
while a non-repository/synthetic root, missing HEAD/origin, or safely
caught local-Git introspection exception may leave the affected hash
`null`.  Exception text, raw URL, and command output are never stored.
Thus the failure variant is constructible without inventing identity
bytes.

The class/stage mapping is exact:

| Preflight class | Allowed `failure_stage` |
|---|---|
| `PREFLIGHT_ELIGIBLE` | `NONE` |
| `PREFLIGHT_REPOSITORY_MISMATCH` | `REPOSITORY_IDENTITY` |
| `PREFLIGHT_REF_MISMATCH` | `SOURCE_REF` |
| `PREFLIGHT_LOCAL_SOURCE_CUT_INVALID` | `LOCAL_SOURCE_IDENTITY` or `SAFE_LOCAL_INTROSPECTION_EXCEPTION` |
| `PREFLIGHT_EXECUTOR_IDENTITY_INVALID` | `MODULE_IDENTITIES` or `SAFE_LOCAL_INTROSPECTION_EXCEPTION` |

A repository/ref rejection must retain its completely formed exact6
repository-identity hash.  A local-source rejection must retain both the
repository hash and, when structurally formable, the exact14 local
identity hash.  An executor rejection must retain the repository and
local hashes and, when structurally formable, the exact3 module identity
hash.  No later-stage hash may be present after an earlier-stage stop.

```text
preflight-eligible canonical acquisition:
live remote attempt exact1

preflight-invalid input:
live remote attempt exact0 / fail closed

negative or tamper probe derived from a frozen observation:
live remote attempt exact0 / fail closed
```

Rejecting an invalid root/ref before network access is not an acquisition
cardinality violation.  Once preflight is eligible and acquisition begins,
the attempt/query cardinality is exact1 even if the attempt fails.

For one canonical run/challenge:

| Consumer or action | Allowed live remote-main acquisition |
|---|---:|
| neutral acquisition owner | attempt exact1 |
| owner validator | exact0 |
| independent verifier | exact0 |
| parent phase3 | exact0 |
| harness/helpers/fixtures/static inspection | exact0 |
| same-run retry or fallback | exact0 |
| prior-run observation reuse | exact0 |

An attempt is counted even if it times out, raises, returns nonzero, or
returns malformed output.  `attempt exact1` does not guarantee success.

No raw total of local read-only Git commands is fixed by this Design.
Their implementation may be consolidated, but their count must be O(1)
per canonical run and independent of fixture, tamper-probe, AST node, or
oracle-helper cardinality.  Live remote query cardinality is exact and
must be asserted by the corrected D1 test itself.

## 5.4 Immutable observation schema

The semantic observation object has top-level exact17:

```text
schema_version
logical_cycle_id
recovery_epoch_id
run_challenge_id
run_scope
attempt_ordinal
acquisition_role
acquisition_profile_id
preflight_sha256
repository_identity
remote_observation
local_source_cut
module_identities
freshness
diagnostic
automatic_progression
observation_sha256
```

Required fixed values:

```text
schema_version:
cocolon.emlis.nls_v3.recovery_epoch004.actual_git_remote_main_observation.v1

logical_cycle_id:
NLS_V3_CYCLE_001

recovery_epoch_id:
NLS_V3_CYCLE001_RECOVERY_EPOCH_004

run_challenge_id:
lowercase SHA-256 exact64 hex / unique and non-reusable per run

run_scope:
one of exact4:
D1_V5_CAUSAL_RED_REFREEZE
D2_CORRECTED_TARGETED_GREEN
POSTPUBLICATION_STABILITY_MATRIX_RUN_A
POSTPUBLICATION_STABILITY_MATRIX_RUN_B

attempt_ordinal:
1

acquisition_role:
ACTUAL_GIT_REMOTE_MAIN_OBSERVATION_ACQUIRER

acquisition_profile_id:
cocolon.emlis.nls_v3.recovery_epoch004.actual_git_ls_remote_main.v1

automatic_progression:
false
```

`preflight_sha256` must identify the same run/challenge's exact13
`PREFLIGHT_ELIGIBLE` record.  It cannot identify a rejected preflight.

`repository_identity` binds exact6:

```text
repository_full_name
repository_root
remote_name
normalized_remote_host
normalized_remote_repository
source_ref
```

The actual remote URL is parsed and normalized to repository identity.
Credential-bearing raw URL text is neither persisted nor copied into a
receipt.

`remote_observation` binds exact12:

```text
remote_ref
attempt_count
live_query_count
row_count
observed_oid_sha1
return_code
started_at_utc
finished_at_utc
duration_milliseconds
result_class
stderr_nonempty
matches_local_origin_main
```

`observed_oid_sha1` and `return_code` may be `null` only in the
corresponding typed acquisition-outcome class.  `row_count` is a
non-negative integer.  `observed_oid_sha1` is a lowercase exact40 hex
string only for a well-formed exact1 row; otherwise it is `null`.
`return_code` is an integer only when the process completed and is `null`
for timeout/exception.  Timestamps are UTC RFC3339 values and duration is
a non-negative integer.  Raw stdout, raw stderr, command text, credential
material, environment, and exception message are forbidden.

For every eligible acquisition, `remote_ref`,
`attempt_count`, and `live_query_count` are respectively
`refs/heads/main`, 1, and 1, including timeout, exception, or nonzero
outcomes.  `stderr_nonempty` is computed from captured bytes before
decoding.  `finished_at_utc` cannot precede `started_at_utc`.

`matches_local_origin_main` is true for `AVAILABLE_MATCH`, false for
`REMOTE_MAIN_OID_MISMATCH`, and `null` for timeout, exception, nonzero,
stderr, or malformed outcomes.  Its comparison target is exactly the
preflight-frozen `local_source_cut.before.origin_main_commit_sha1`, never
the post-attempt `after` value or a reread symbolic ref.

`local_source_cut` is an exact4 pure-local envelope:

```text
before
after
same_cut
source_cut_sha256
```

`before` and `after` each bind exact14:

```text
repository_root
remote_name
normalized_remote_host
normalized_remote_repository
source_ref
entry_commit_sha1
entry_tree_sha1
head_commit_sha1
head_tree_sha1
origin_main_commit_sha1
branch_ref
worktree_clean
entry_commit_is_ancestor
origin_main_is_ancestor_of_head
```

For this lineage the entry fields remain:

```text
entry_commit_sha1:
97e8dd4d7021b8a1781d534aaa603f71dffa41b9

entry_tree_sha1:
cd3fc3da0976bbbcb708319e4bc8cbbb6a73ec19
```

The exact5 repository/root/remote fields in each identity must exactly
equal their top-level `repository_identity` counterparts.

`before` is captured and self-hashed before preflight is finalized, then
the exact13 preflight record binds that hash.  The one live remote attempt
begins only after the eligible preflight record is immutable.  `after` is
captured immediately after that attempt without another live remote
query.  `same_cut` is true only when both pure-local exact14 identities are
identical.  No network-derived equality field is part of either identity
or of their pre-network hash.

`source_cut_sha256` uses delete-self canonical sorted compact UTF-8 over
the exact4 envelope.  Every Git-object read must be pinned to the captured
commit/OID rather than silently rereading a moving symbolic name.

`module_identities` has exact3 roles:

```text
owner_executor
independent_executor
parent_phase3_source
```

Each role binds exact4:

```text
module_path
module_origin
git_blob_sha1
raw_sha256
```

The exact3 module-identities object is captured and hashed before network
access, is bound by the eligible preflight record, and is revalidated
after acquisition and at run closure.

Both executors bind the same repository root, commit, tree, and
origin-main through `local_source_cut`.  `parent_phase3_source` binds:

```text
ai/tools/emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py
```

The parent is not reclassified as a third Event1 executor; its module
identity is bound because parent phase3 is part of the mandatory direct
exact3 and the same actual source cut.

`freshness` binds exact7:

```text
acquired_after_source_identity_freeze
acquired_before_first_oracle
run_challenge_bound
valid_for_single_run
reusable
must_close_at_run_end
wall_clock_ttl_is_credit_authority
```

Required values are:

```text
true / true / true / true / false / true / false
```

Freshness is run/challenge and source-cut scoped.  Wall-clock values prove
ordering and duration only; they do not prove continuous remote
unchangedness.

`diagnostic` binds exact4:

```text
command_attempted
timed_out
exception_class
body_free
```

`exception_class` is one of exact5:

```text
NONE
TIMEOUT_EXPIRED
SUBPROCESS_ERROR
OS_ERROR
OTHER_SAFE_CLASS
```

`command_attempted` and `body_free` are true for an eligible acquisition
attempt.  `timed_out` is true only with `TIMEOUT_EXPIRED`.  Raw exception
text is forbidden.  `remote_observation.result_class` is the sole
acquisition-outcome class; `diagnostic` does not duplicate that verdict.

`observation_sha256` is SHA-256 over delete-self canonical sorted compact
UTF-8.  The object becomes immutable before any owner, independent,
parent, or oracle consumer receives it.

The transient exact17 observation is consumed only inside its run and is
not persisted as a Cocolon artifact.

A persisted body-free terminal evaluation projection is a distinct
exact16 object, not a redacted copy that claims the same self-hash:

```text
schema_version
source_preflight_sha256
source_observation_sha256
source_closure_sha256
run_challenge_id
run_scope
repository_full_name
remote_ref
acquisition_profile_id
preflight_class
acquisition_class
run_terminal_class
violation_classes
oracle_outcomes
equality_verdicts
projection_sha256
```

Its schema is:

```text
cocolon.emlis.nls_v3.recovery_epoch004.actual_git_observation_body_free_projection.v1
```

`source_closure_sha256` is the matching exact10 closure identity.  A
canonical eligible run creates closure exact1.  It may be `null` only in
a diagnostic projection whose `run_terminal_class` is
`RUN_FAILED`, whose `violation_classes` includes
`RUN_CLOSURE_INVALID`, and whose `closure_consistent` is false.  More than
one matching closure is also `RUN_CLOSURE_INVALID`; no one closure is
selected for credit.  `acquisition_profile_id` must equal the frozen v1
profile bound by the transient observation.

`run_terminal_class` is one of exact4:

```text
D1_CAUSAL_RED_REFREEZE_ESTABLISHED
RUN_EVALUATED_GREEN
RUN_NOT_EVALUABLE
RUN_FAILED
```

`violation_classes` is an ordered, duplicate-free array of zero or more
consumer/run violation classes from §7.1.  The first element is the
primary violation under the frozen priority; later detected violations
remain visible and cannot replace it.

`oracle_outcomes` is always an ordered exact8 array in O01-through-O08
order for an eligible-acquisition projection.  Each row binds exact4:

```text
node_id
outcome
causal_signature_id
violation_class
```

`outcome` is one of exact4:

```text
GREEN
CAUSAL_RED
UNEXPECTED_FAILURE
NOT_EVALUATED
```

For GREEN or NOT_EVALUATED, both final fields are `null`.  A
`RUN_NOT_EVALUABLE` acquisition has all exact8 rows `NOT_EVALUATED`.
For CAUSAL_RED,
`causal_signature_id` is the exact stable node-specific identifier frozen
in §8.1 and `violation_class` is its primary typed cause.  An unexpected
failure records a safe stable signature identifier when available, never
raw exception/assertion text.

The D1 success vector is exactly O01–O07 `CAUSAL_RED` with each matching
its frozen signature identifier and violation class, followed by O08
`GREEN`.  A count-only `8 / 1 / 7` summary is insufficient and is not a
credit field.  Corrected D2/stability success is O01–O08 exact8 GREEN.

`equality_verdicts` binds exact8 booleans:

```text
repository_identity_consistent
source_cut_consistent
owner_executor_consistent
independent_executor_consistent
parent_phase3_source_consistent
live_remote_match
closure_consistent
body_free
```

`projection_sha256` uses delete-self canonical sorted compact UTF-8 over
the projection itself.  `source_observation_sha256` is an opaque
within-run linkage, not independently reverified from the redacted
projection and not sufficient for credit.  Absolute repository/module
origins, raw URL, stdout, stderr, environment, and exception text are
absent.

The projection is the storage location for preflight/acquisition classes,
the separate run terminal, ordered violation evidence, and exact oracle
vector.  For an eligible acquisition its first two classes must equal the
linked preflight record and transient observation.  A non-
`AVAILABLE_MATCH` acquisition uses `RUN_NOT_EVALUABLE`, exact8
`NOT_EVALUATED` oracle outcomes, and cannot claim GREEN or causal RED,
provided its observation,
cardinality, and closure contracts are otherwise valid.  A separate
contract violation yields `RUN_FAILED` while retaining the non-available
acquisition class.  A preflight-rejected run
has only its exact13 preflight record and no projection because no source
observation exists.

Run closure is recorded separately because the immutable observation
cannot change from open to closed.  The body-free closure record has
exact10:

```text
schema_version
run_challenge_id
observation_sha256
run_state
closed_at_utc
postrun_local_source_cut_sha256
postrun_module_identities_sha256
postrun_matches_acquisition
domain_effect_count
closure_sha256
```

`run_state` is `CLOSED`; `closure_sha256` uses delete-self canonical
sorted compact UTF-8.  `postrun_local_source_cut_sha256` is computed from
the postrun pure-local exact14 identity with live remote query exact0.
`postrun_module_identities_sha256` hashes the postrun exact3 module
identities.  `postrun_matches_acquisition` is true only when that local
identity equals both acquisition `before` and `after`, and that module
hash equals the preflight/observation module hash.  It must be true and
`domain_effect_count` must be 0 for GREEN/refreeze credit.  Every eligible
acquisition run must produce matching closure exact1; exact0 or more than
exact1 is `RUN_CLOSURE_INVALID`.  Consumers run before closure.  Any use
after a matching closure record exists is stale/reuse failure.

## 5.5 Actual-Git proof preserved

The single observation must preserve the current proof strength:

- expected repository `MassyuRed/mashos-api`;
- normalized `origin` repository identity and exact
  `refs/heads/main`;
- actual resolved repository root;
- local `refs/heads/main`, HEAD, HEAD tree, and `origin/main`;
- clean worktree and required ancestry;
- owner and independent exact module paths and origins;
- pinned Git blobs, `git show` bytes, local bytes, and raw SHA-256;
- live remote OID equal to the cut's local `origin/main`; and
- source subject, owner executor, and independent executor bound to the
  same cut.

The following remain rejected:

- local `origin/main` without live observation;
- detached historical checkout;
- synthetic repository root;
- cross-root executor;
- locally repointed ref;
- stale observation;
- wrong run/challenge;
- mixed observation identities;
- owner result forwarded as independent evidence;
- v2-to-v1 fallback; and
- hidden retry, alternate transport, or prior-run cache.

# 6. Role independence and parent phase3

## 6.1 Owner

The owner receives immutable facts, validates the owner Event1/OA
contract and the actual-Git cut, and produces its own verdict.  It performs
no live remote requery and cannot mutate the observation.

## 6.2 Independent

The independent verifier receives the same immutable observation bytes
and identity, then independently rederives its own schema, source,
executor, publication, and Event1 judgment.

It must not:

- import, call, forward, monkeypatch around, or trust the owner validator;
- consume an owner boolean, error tuple, or credit decision; or
- treat the common observation as a common verdict.

Sharing one immutable external fact does not merge the two semantic
verdict roles.

## 6.3 Parent

Parent phase3:

- requires one exact observation identity across all phase evidence;
- reconstructs actual evidence from immutable postfetch bodies;
- validates the cut without live reacquisition;
- invokes the independent verifier exactly once on the accepted public
  path;
- rejects missing, mixed, stale, wrong-run, or mutated evidence; and
- preserves effect exact0 on every failure.

## 6.4 Harness

Harness source inspection, fixture construction, tamper probes, module
state hashing, and negative-case derivation must not implicitly reacquire
repository or remote identity.

After the observation is frozen:

- fixture construction is pure with respect to remote observation;
- negative cases derive from copied immutable state;
- AST and module-state traversal cannot trigger a remote query;
- no external diagnostic plugin is required for credit; and
- the frozen D1 test itself asserts acquisition/query/retry/reuse
  cardinality.

# 7. Failure classification and no-retry rule

## 7.1 Typed classes

Preflight, acquisition outcome, run terminal, and consumer/run violation
are separate enums.  One field must not contain a value from another
enum.

Preflight exact5:

| Class | Meaning | Live query |
|---|---|---:|
| `PREFLIGHT_ELIGIBLE` | deterministic local identity is eligible for canonical acquisition | proceeds to exact1 attempt |
| `PREFLIGHT_REPOSITORY_MISMATCH` | expected and normalized repository differ | exact0 |
| `PREFLIGHT_REF_MISMATCH` | remote/source ref is not the frozen exact ref | exact0 |
| `PREFLIGHT_LOCAL_SOURCE_CUT_INVALID` | root/branch/HEAD/tree/origin/clean/ancestry is invalid before acquisition | exact0 |
| `PREFLIGHT_EXECUTOR_IDENTITY_INVALID` | module path/origin/blob/raw is invalid before acquisition | exact0 |

`remote_observation.result_class` is acquisition-outcome exact7:

| Class | Meaning |
|---|---|
| `AVAILABLE_MATCH` | one well-formed exact ref row; OID equals the local source cut |
| `OBSERVATION_UNAVAILABLE_TIMEOUT` | attempt timed out |
| `OBSERVATION_UNAVAILABLE_EXCEPTION` | process/transport attempt raised |
| `OBSERVATION_UNAVAILABLE_NONZERO` | process completed nonzero |
| `OBSERVATION_STDERR_NONEMPTY` | stderr is nonempty under the frozen clean profile |
| `OBSERVATION_MALFORMED` | empty, multiple, malformed, wrong-ref, or invalid-OID rows |
| `REMOTE_MAIN_OID_MISMATCH` | successful well-formed OID differs from the local source cut |

Acquisition classification priority is:

```text
timeout
-> exception
-> nonzero
-> nonempty stderr
-> malformed row
-> well-formed different OID
-> AVAILABLE_MATCH
```

`AVAILABLE_MATCH` requires return code 0, stderr empty, row count exact1,
one lowercase exact40 OID, exact requested ref, and OID equality.
Timeout/exception require `return_code=null`, `row_count=0`, and
`observed_oid_sha1=null`.  Nonzero requires an integer return code other
than zero and `observed_oid_sha1=null`.  Malformed output never promotes a
parsed OID.  These constraints keep `remote_observation.result_class`,
`diagnostic.timed_out`, `diagnostic.exception_class`, return code, stderr,
row count, and OID mutually consistent.

Run terminal exact4 is separate from consumer/run violations:

| Class | Meaning |
|---|---|
| `D1_CAUSAL_RED_REFREEZE_ESTABLISHED` | the exact D1 node/signature vector and all evidence obligations are satisfied |
| `RUN_EVALUATED_GREEN` | the applicable corrected D2 or stability exact8 is exact8 GREEN with all evidence obligations satisfied |
| `RUN_NOT_EVALUABLE` | eligible preflight completed but acquisition was not `AVAILABLE_MATCH`; no oracle result is credited |
| `RUN_FAILED` | an acquisition-cardinality, evidence, consumer, oracle, drift, or closure contract failed |

Consumer/run violation exact11:

| Class | Meaning |
|---|---|
| `ACQUISITION_CARDINALITY_INVALID` | eligible run attempt/query count is not exact1 |
| `OBSERVATION_SCHEMA_OR_HASH_INVALID` | exact schema or self-hash is invalid |
| `OBSERVATION_MISSING_OR_MIXED` | consumers do not share one exact observation identity |
| `OBSERVATION_STALE_OR_WRONG_RUN` | run/challenge/source cut differs or a matching closure already exists |
| `OBSERVATION_REUSE_FORBIDDEN` | observation came from a prior run |
| `LIVE_REMOTE_REQUERY_OUTSIDE_ACQUIRER` | owner/independent/parent/harness queried remote |
| `LOCAL_SOURCE_CUT_CHANGED_AFTER_ACQUISITION` | root/branch/HEAD/tree/origin/clean/ancestry changed after acquisition |
| `EXECUTOR_IDENTITY_CHANGED_AFTER_ACQUISITION` | module origin/blob/raw changed after acquisition |
| `ORACLE_FAILURE` | an evaluable node produced `UNEXPECTED_FAILURE`; an accepted node-specific `CAUSAL_RED` is excluded |
| `POSTRUN_LOCAL_DRIFT` | postrun exact source/worktree state differs from the run cut |
| `RUN_CLOSURE_INVALID` | required immutable closure is absent, malformed, or mismatched |

Classification priority is exact:

```text
ACQUISITION_CARDINALITY_INVALID
-> OBSERVATION_SCHEMA_OR_HASH_INVALID
-> acquisition outcome (the exact7 acquisition enum)
-> OBSERVATION_MISSING_OR_MIXED
-> OBSERVATION_STALE_OR_WRONG_RUN
-> OBSERVATION_REUSE_FORBIDDEN
-> LIVE_REMOTE_REQUERY_OUTSIDE_ACQUIRER
-> LOCAL_SOURCE_CUT_CHANGED_AFTER_ACQUISITION
-> EXECUTOR_IDENTITY_CHANGED_AFTER_ACQUISITION
-> ORACLE_FAILURE
-> POSTRUN_LOCAL_DRIFT
-> RUN_CLOSURE_INVALID
```

Preflight rejection precedes this entire list and has no acquisition
observation/projection.  The D1 success vector's duplicate-free expected
`violation_classes` is exact3 in this order:

```text
ACQUISITION_CARDINALITY_INVALID
OBSERVATION_MISSING_OR_MIXED
LIVE_REMOTE_REQUERY_OUTSIDE_ACQUIRER
```

The priority orders the duplicate-free `violation_classes` array; it does
not overwrite `run_terminal_class`.  This separation permits the frozen
D1 to retain expected violations while deriving a successful causal-RED
refreeze terminal.  An unexpected cause, node, order, or signature yields
`RUN_FAILED`.

An accepted `CAUSAL_RED` contributes only its frozen node-specific primary
violation.  It does not additionally contribute `ORACLE_FAILURE`.
`ORACLE_FAILURE` is reserved for `UNEXPECTED_FAILURE`; therefore the
accepted D1 global violation set remains the frozen exact3.

D1 refreeze requires `PREFLIGHT_ELIGIBLE`, `AVAILABLE_MATCH`, exact1 valid
closure, the frozen exact8 node/signature vector, and
`D1_CAUSAL_RED_REFREEZE_ESTABLISHED`.  Corrected D2/stability GREEN
requires `PREFLIGHT_ELIGIBLE`, `AVAILABLE_MATCH`, exact1 valid closure,
an exact8 all-GREEN vector, empty `violation_classes`, and
`RUN_EVALUATED_GREEN`.  A mere eligible preflight plus available
acquisition is never sufficient.

The exact13 preflight record stores the preflight class.  The transient
exact17 observation stores acquisition `result_class`.  The persisted
exact16 terminal evaluation projection stores both source classes, the
separate terminal, ordered violations, and exact oracle vector.  Field
duplication is valid only when projection values exactly equal linked
source records.

Here `effect exact0` means Cocolon domain effects: no Reference/OA,
Candidate/Event1, baseline lock, runtime, Readiness/Failure, Reservation,
Attempt, or formal exact134.  It does not mean that the explicitly
authorized read-only Git observation or body-free diagnostic record never
occurred.

Public validator failure tuples may remain fail-closed, but the
evidence-layer classes must be preserved in the body-free terminal
evaluation projection before public collapse.

An unavailable observation is not falsely labelled as a source identity
mismatch.  A successful well-formed different OID is not falsely labelled
as transport unavailability.

## 7.2 No retry and no lucky-GREEN selection

Within one canonical run/challenge:

```text
attempt:
exact1

automatic retry / backoff / alternate transport:
exact0

local origin-main fallback:
exact0

prior-run cache reuse:
exact0

selective failed-oracle rerun for credit:
exact0
```

A failed or unavailable canonical run remains historical evidence.  A new
attempt requires a new explicitly authorized run/challenge.  A selected
O02 or O06 pass cannot overwrite a failed full run.

# 8. Predeclared corrected-D1 and later revalidation matrix

## 8.1 Corrected D1 v5 boundary

The next D1 may modify only the existing exact1 test path:

```text
ai/tests/test_emlis_nls_v3_recovery_epoch004_operational_admission_v2_event1_connection_actual_git_identity_parent_phase3_red.py
```

It must:

- retain O01 through O08 as the exact8 denominator and order;
- retain all existing Event1 v2, parent phase3, fail-closed, and v1
  invariance obligations;
- freeze the observation schema, role separation, exact1 attempt,
  additional live-query exact0, retry exact0, and prior-run reuse exact0;
- use test-native counting rather than an external diagnostic plugin;
- run the exact8 file once under the D1 authority; and
- stop without production changes.

The D1 v5 expected result is frozen before implementation:

```text
O01:
CAUSAL_RED

O02:
CAUSAL_RED

O03:
CAUSAL_RED

O04:
CAUSAL_RED

O05:
CAUSAL_RED

O06:
CAUSAL_RED

O07:
CAUSAL_RED

O08:
GREEN_V1_INVARIANCE

expected denominator / GREEN / causal RED:
exact8 / exact1 / exact7
```

O01, O04, and O05 contain valid owner/independent paths and therefore must
also reject the current per-call live reacquisition behavior.  O08 uses no
live remote observation and remains the frozen v1/predecessor invariance
control.

The accepted causal signature is node-specific; an unrelated assertion
failure does not establish the refreeze:

| Node | Exact `causal_signature_id` | Primary violation | Frozen causal-RED signature |
|---|---|---|---|
| O01 | `O01_OWNER_ADDITIONAL_LIVE_REMOTE_QUERY` | `LIVE_REMOTE_REQUERY_OUTSIDE_ACQUIRER` | the valid owner path performs a live remote query instead of consuming the run's immutable observation, so additional query exact0 is violated |
| O02 | `O02_INDEPENDENT_ADDITIONAL_LIVE_REMOTE_QUERY` | `LIVE_REMOTE_REQUERY_OUTSIDE_ACQUIRER` | the independent path, including its independent/fresh execution variants, reacquires remote identity instead of consuming the same immutable observation |
| O03 | `O03_SOURCE_AND_ROLES_NOT_ONE_OBSERVATION_CUT` | `OBSERVATION_MISSING_OR_MIXED` | source subject, owner executor, independent executor, and parent source are not all bound to one before/after local cut plus one observation identity without requery |
| O04 | `O04_VALID_DISPATCH_ADDITIONAL_LIVE_REMOTE_QUERY` | `LIVE_REMOTE_REQUERY_OUTSIDE_ACQUIRER` | the valid owner/independent dispatch path performs additional live acquisition instead of using the frozen observation; harness-derived invalid/mixed/fallback probes themselves remain live query exact0 |
| O05 | `O05_EXACT23_CANDIDATE_OA_PATHS_REACQUIRE` | `LIVE_REMOTE_REQUERY_OUTSIDE_ACQUIRER` | valid exact23/candidate/OperationalAdmission and owner/independent paths perform additional acquisition rather than using the frozen observation |
| O06 | `O06_PARENT_POSTFETCH_AND_INDEPENDENT_REACQUIRE` | `LIVE_REMOTE_REQUERY_OUTSIDE_ACQUIRER` | parent reconstruction/postfetch and independent validation reacquire remote identity (current parent sequence exact2) instead of sharing the single observation |
| O07 | `O07_HARNESS_POSITIVE_PATH_EXCEEDS_EXACT1` | `ACQUISITION_CARDINALITY_INVALID` | harness/owner/independent/parent positive paths exceed exact1 and do not yet enforce typed unavailable, additional-query exact0, retry exact0, and reuse exact0 evidence |
| O08 | `null` | `null` | no causal RED is accepted; v1 exact16/exact8 and predecessor invariance must remain GREEN |

For O01 through O07 the D1 harness must emit the corresponding stable
causal signature only after test-native counters and observation identity
checks prove that cause.  A timeout, malformed result, import/setup
failure, unrelated assertion, or different cardinality symptom is
non-evaluable or unexpected, not the frozen causal RED.

The D1 v5 refreeze is established only if preflight is eligible, the
single acquisition outcome is `AVAILABLE_MATCH`, the exact8 denominator
is collected, the ordered exact8 outcome/signature/violation vector
matches the table above, closure exact1 is valid, and terminal is
`D1_CAUSAL_RED_REFREEZE_ESTABLISHED`.  An
unavailable/malformed/mismatched observation is non-evaluable; it does not
establish causal RED and requires a later separate authority rather than a
same-run retry.  Any different RED/GREEN set also fails the refreeze.

This Design does not itself choose helper/API names or execute the D1.

## 8.2 Later corrected D2 boundary

A later separately approved D2 may change only the D1-proven production
boundary, with the current mandatory direct exact3 explicit.  It must not
change the D1 v5 bytes to obtain GREEN.

The implementation form remains open.  In particular this Design does not
preselect a cache, session fixture, singleton, module global, helper/API,
or new file.  That implementation freedom does not reopen the frozen
actual-Git semantic acquisition profile in §5.2: the resolved Git
executable, exact `ls-remote --exit-code origin refs/heads/main`
operation, allowed-host set, exact20 timeout, process safety, strict
output parsing, and no-retry/no-alternate-transport rules remain
mandatory.

## 8.3 Later canonical stability matrix

Stable postpublication credit requires a separately authorized,
predeclared matrix:

1. verify the then-current D1 exact1 and corrected D2 exact3 identities;
2. collect exact8;
3. fresh clean materialization/process A:
   - one run/challenge observation attempt;
   - `AVAILABLE_MATCH`;
   - O01 through O08 exact8 GREEN;
   - test-native cardinality checks GREEN;
   - no external instrumentation;
4. only if A is fully evaluable and GREEN, fresh clean
   materialization/process B repeats the same exact8 against the same
   published checkpoint with a new run/challenge and new exact1
   observation;
5. require A and B both exact8 GREEN and postverify the then-current exact4
   bytes and clean state.

That future matrix authority must preauthorize exactly two distinct,
ordered run challenges: A and B.  Each challenge owns one exact1
acquisition attempt and cannot consume the other's observation.  B is an
independent repeatability sample executed only after A is fully evaluable
and GREEN; it is not an unplanned retry of A.

If A is unavailable, mismatched, or RED, B is not run as a compensating
retry.  If B fails, A does not compensate.  No selected-oracle rerun earns
credit.  Two GREEN runs are the minimum predeclared reproducibility sample;
they do not prove future infallibility.

An unexpected evaluable semantic failure is `ORACLE_FAILURE`; an accepted
D1 node-specific causal RED is not.  A changed local
source/worktree after a run is `POSTRUN_LOCAL_DRIFT`.  An unavailable
attempt is non-evaluable and cannot be replaced inside that matrix
authority.  All failure classes preserve domain effect exact0.

This matrix is a future contract, not authority to run it now.

# 9. Cocolon documentation scope

Approved Cocolon exact5:

```text
NEW:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch004_PostD2_
ActualGitIdentityReproducibilityAndStabilityContractReconciliation_
Design_ReadOnly_20260731.md

NEW:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch004_PostD2_
ActualGitIdentityReproducibilityAndStabilityContractReconciliation_
Design_ReadOnly_BodyFree_Receipt_20260731.json

NEW:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch004_PostD2_
ActualGitIdentityReproducibilityAndStabilityContractReconciliation_
Design_ReadOnly_Handoff_20260731.md

MODIFY:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md

MODIFY:
Cocolon_前提資料/07_latest_snapshot_diff.md
```

Plan and latest snapshot receive append-only current checkpoints.  Parent
Design, old artifacts, manifest, `00` files, GitHub reflection contract,
and all mashos-api paths are exact0.

# 10. Confirmed facts, inference, and Karen's opinion

## 10.1 Confirmed facts

- current published source is `735b1a59... / eab497...`;
- D1 v4 exact1 and D2 exact3 bytes match the fixed identities;
- two uninstrumented full runs failed at different O06/O02 nodes;
- each immediate selected-node rerun passed;
- a later instrumented full exact8 passed non-credit;
- that diagnostic made exact45 successful identical remote-main
  observations;
- live remote calls accounted for 280.701 seconds;
- current code collapses unavailable, malformed, and mismatch outcomes to
  fail-closed results without retaining their cause; and
- Reference/OA and later effects have not been authorized from the
  post-D2 state.

## 10.2 Inference

The repeated live network observation is a reproducibility risk surface
and a major latency source.  It is not proven to be the direct cause of
the prior O02/O06 failures.

A shared immutable external fact can preserve owner/independent
independence when each role independently recomputes its semantic verdict
and no role consumes an owner result.  Repeating the network query is not
the definition of independent verification.

## 10.3 華恋の意見

The right response is not to keep rerunning until one full result is
favorable.  It is also not to weaken actual-Git identity to local refs.

The observation should be acquired once as a neutral fact, bound to one
run and one source cut, and then judged independently by each role.  That
keeps the evidence strong while removing the accidental dependence on how
many times a fixture or validator happens to be called.

The published D2 should remain visible as completed targeted-GREEN work.
Stable postverification is a separate unmet boundary.  Reference/OA
should wait until the corrected D1/D2 and the predeclared two-run matrix
are separately approved and completed.

# 11. Exactly one next authority and stop

The only concrete next-authority token is:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D2_POSTPUBLICATION_DIAGNOSTIC_FULL_EXACT8_GREEN_NONCREDIT_PRIOR_MIGRATING_O02_O06_FAILURES_NONREPRODUCED_LIVE_REMOTE_EXACT45_MULTICALL_OBSERVATION_LATENCY_ACTUAL_GIT_IDENTITY_REPRODUCIBILITY_AND_STABILITY_CONTRACT_RECONCILED_RUN_CHALLENGE_SCOPED_REMOTE_MAIN_ACQUISITION_ATTEMPT_EXACT1_OWNER_INDEPENDENT_PARENT_HARNESS_SAME_IMMUTABLE_OBSERVATION_IDENTITY_ADDITIONAL_LIVE_QUERY_RETRY_AND_PRIOR_RUN_REUSE_EXACT0_DISTINCT_CORRECTED_D1_V5_CAUSAL_RED_REFREEZE_AND_POSTVERIFICATION_ONLY
```

```text
state:
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED

concrete next-authority token count:
exact1

automatic progression:
false
```

This next authority is test-only.  It includes no D2 implementation,
GREEN claim, Reference/OA, Candidate/Event1, runtime, or later effect.

Current effect ledger:

```text
Cocolon documentation paths:
NEW exact3 / MODIFY exact2

mashos-api production / test / fixture / dependency / config / lock:
exact0 / exact0 / exact0 / exact0 / exact0 / exact0

pytest collect / execution / diagnostic rerun:
exact0 / exact0 / exact0

Reference / OperationalAdmission / Candidate / Event1:
exact0 / exact0 / exact0 / exact0

source baseline lock:
false

runtime / Readiness / Failure / Reservation / Attempt / formal exact134:
exact0 / exact0 / exact0 / exact0 / exact0 / exact0

P2 / Product Read / Cycle001 acceptance:
NOT_STARTED / NOT_STARTED / NOT_ACCEPTED

automatic progression:
false
```

Required stop:

```text
RECOVERY_EPOCH004_D2_PUBLISHED_TARGETED_GREEN_RETAINED_POSTPUBLICATION_FULL_EXACT8_MIGRATING_O06_O02_FAILURES_SELECTED_RERUNS_GREEN_DIAGNOSTIC_INSTRUMENTED_FULL_EXACT8_GREEN_NONCREDIT_DIRECT_CAUSE_NOT_PROVEN_LIVE_REMOTE_EXACT45_MULTICALL_REPRODUCIBILITY_RISK_RECONCILED_RUN_CHALLENGE_SCOPED_REMOTE_MAIN_ACQUISITION_ATTEMPT_EXACT1_ADDITIONAL_QUERY_RETRY_PRIOR_RUN_REUSE_EXACT0_STABLE_POSTVERIFIED_CREDIT_NOT_ESTABLISHED_REFERENCE_OPERATIONAL_ADMISSION_BLOCKED_CORRECTED_D1_V5_DEFINED_INACTIVE_AUTOMATIC_PROGRESSION_FALSE_AUTHORITY_STOP
```
