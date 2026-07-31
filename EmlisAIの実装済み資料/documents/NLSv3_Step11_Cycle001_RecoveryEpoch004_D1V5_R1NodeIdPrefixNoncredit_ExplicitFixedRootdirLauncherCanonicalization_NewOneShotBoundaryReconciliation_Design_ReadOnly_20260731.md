---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch004_d1v5_r1_nodeid_prefix_noncredit_explicit_fixed_rootdir_launcher_canonicalization_new_one_shot_boundary_reconciliation_design
title: "Recovery Epoch004 D1 v5 R1 node-id-prefix non-credit: explicit fixed-rootdir launcher and distinct one-shot boundary reconciliation"
revision_date: "2026-07-31"
status: "READ_ONLY_DESIGN_FROZEN_ROOTDIR_CORRECTED_ONE_SHOT_DEFINED_INACTIVE"
body_free: true
automatic_progression: false
---

# 0. Authority, decision, and zero-execution result

Approved Design-only authority:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_V5_R1_PYTEST_INVOCATION_EXACT1_COLLECTION_EXACT8_MODULE_FIXTURE_SETUP_ERROR_EXACT8_BEFORE_PREFLIGHT_CHALLENGE_REMOTE_AND_O01_O08_NONCREDIT_EMPTY_NONREPO_CWD_ABSOLUTE_D1_PYTEST_ROOTDIR_CHECKOUT_PREFIX_NODEID_MISMATCH_EXPLICIT_FIXED_SOURCE_ROOTDIR_REPOSITORY_RELATIVE_ORDERED_NODEID_LAUNCHER_CANONICALIZATION_AND_DISTINCT_NEW_ONE_SHOT_AUTHORITY_BOUNDARY_RECONCILIATION_DESIGN_READ_ONLY_AND_POSTVERIFICATION_ONLY
```

Decision:

```text
prior R1 fixture-setup result:
R1_PYTEST_LAUNCH_OR_COLLECTION_NONCREDIT_STOP

prior R1 authority:
CLOSED_CONSUMED_NO_RERUN

explicit fixed-source rootdir launcher contract:
STATICALLY_RECONCILED_NOT_EXECUTED

distinct corrected R1 one-shot authority:
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED

corrected R1 invocation under this Design authority:
exact0

automatic progression:
false
```

This Design closes the authority boundary created when the first R1 launcher
collected exact8 items but the D1 module fixture rejected all exact8 during
setup because their node ids carried a checkout-directory prefix.  It freezes
a command-only explicit-rootdir correction and exactly one later authority.
It does not execute that later authority and does not alter D1.

```text
Cocolon documentation:
NEW exact3 / MODIFY append-only exact2

mashos-api production / test / fixture / dependency / config / lock change:
exact0 / exact0 / exact0 / exact0 / exact0 / exact0

package acquisition / runtime materialization or repair:
exact0 / exact0

pytest invocation / framework entry / target import / collection / execution:
exact0 / exact0 / exact0 / exact0 / exact0

collect-only / dry-run / launcher probe / role import probe:
exact0 / exact0 / exact0 / exact0

challenge / preflight / live remote / O01–O08 / closure:
exact0 / exact0 / exact0 / exact0 / exact0

Reference / OperationalAdmission / Candidate / Event1 / source lock:
BLOCKED / BLOCKED / exact0 / exact0 / false
```

The Design receives credit only after its Design, Body-free Receipt, Handoff,
Execution and Closure Plan append, and latest snapshot append are all
reachable on Cocolon main, exact-content postfetch equal, aggregate unique
changed paths are exact5, and both modified-file prefixes remain byte-equal.
Partial publication is non-credit.

# 1. Governing sequence and source checkpoints

## 1.1 Governing order

The governing sequence remains:

```text
published D2 targeted-GREEN source retained
-> corrected D1 v5 published exact1
-> R0 lock-derived test-runner RUNTIME_READY credited and postverified
-> first R1 one-shot closed fixture-setup non-credit with no rerun
-> this rootdir/launcher reconciliation Design
-> separately approved distinct rootdir-corrected R1 one-shot
-> separately approved corrected D2 mandatory direct exact3
-> separately approved predeclared A/B stability matrix
-> Reference / OperationalAdmission consideration only after stable credit
```

This Design does not move corrected D2, stability, Reference/OA,
Candidate/Event1, source lock, or runtime-product state.

## 1.2 Current Cocolon entry checkpoint

```text
repository:
MassyuRed/Cocolon

entry commit / tree:
b8ac15d3d158807e3478b09b66db670eee14b023
71de24be78dbe9dfc43502d192ef0f2918879f85
```

The prior R1 non-credit exact5 ending at this checkpoint is:

| Artifact | Publication commit | Git blob SHA-1 | Raw SHA-256 |
|---|---|---|---|
| Result | `242d85d6474b0058816c804520d7c8d2f5bc19da` | `2a098fb57517b8ce4e517c0bbfdc8c7a4fee5d5c` | `c8a1971fccf66e12bfe007d590170857b18c5b67898c762b070533db85981b63` |
| Body-free Receipt | `af81ceea7022b107304fea966204063441798ffe` | `49d04991899b5a4bc55d4ffd5e358004e65b80e7` | `dade13cf7fb02fb4d9df777b1288f66d18327039c33eb12e6e52e76f58b4ef4e` |
| Handoff | `617282a2b3dddf4185621be386fb8b8b41c6998e` | `29e98da67efa84cfefc0619c51380ba373710c1b` | `126f11274f43505ac3bdc4eeab424a30f792f8ffc1d447a874cc3ff98b4a849e` |
| Execution and Closure Plan | `973c2fdeaf6f7c922c18eca0ef7713c6b58e49eb` | `57e7374470016a44953354f122318f6a2ff876c3` | `19618da45a123b939447bc76bb545b03dae98546ad6fcebcafe5f5384cc68f71` |
| latest snapshot | `b8ac15d3d158807e3478b09b66db670eee14b023` | `bcade45e8d3bc7c77bbd1e4ff7df982377f7ee6c` | `09082806d2a2c2e9189dcd3e0176a36f0da63432ec6fd9ee66f10eec8ba19dca` |

```text
prior execution observation SHA-256:
7b10c9e9c55c4fa31e4e31908c78be358e16e42f00d61161d729fd34f785808a

prior Receipt delete-self logical SHA-256:
ed31017aa72da31c9a2618b647426546dd3ecc0f521ef048dfe934d8dc0ffb07

prior owner / independent verdict:
INVALID / INVALID

prior safe failure code:
PYTEST_LAUNCH_OR_COLLECTION_INVALID
```

All five prior paths are postverified on main.  This Design consumes their
finite non-credit result without turning it into semantic evidence and
without reopening the consumed authority.

## 1.3 Fixed mashos-api source and retained runner

```text
repository:
MassyuRed/mashos-api

fixed commit / tree / clean checkout:
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

The retained test runner remains bound by:

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

The prior R1 pre-launch owner and independent derivations were `VALID`, with
full entries exact527, installed rows exact482, distributions/RECORD matches
exact5/exact5, and unowned/unexpected exact0/exact0.  That past result is
retained evidence, not a future-time guarantee.

# 2. Prior one-shot observation and finite diagnosis

## 2.1 What the one permitted process established

```text
prior logical argv SHA-256:
8797754f541bd6bbd97734f0e80329cb597f2e37605755d33588fbef7d58f99c

environment-policy SHA-256:
6393dea280af670e3b0ed902014c86fc65a6666e973fe8e7ee50318ff1a11591

working-directory class:
EMPTY_NON_REPOSITORY_DIRECTORY

pytest invocation / same-authority rerun:
exact1 / exact0

process started / completed / timed out / exit:
true / true / false / 1
```

```text
collected / phase-normalized executed:
exact8 / exact8

failed / passed / error:
exact0 / exact0 / exact8

ordered semantic result rows / O01–O08 test bodies:
exact0 / exact0

challenge / preflight / neutral remote request / execution:
exact0 / exact0 / exact0 / exact0

observation identity / closure:
exact0 / exact0
```

The safely observed item node ids all carried the checkout-directory name as
a prefix.  D1 constructs its frozen vector from the repository-relative path
beginning `ai/tests/` and compares all `request.session.items[*].nodeid`
values byte-for-byte before `_acquire_run_observation()`.  The comparison
failed in the module fixture.  Therefore collection cardinality exact8 did
not become semantic exact8, challenge or remote evidence, O08 invariance, or
D1 causal-RED credit.

## 2.2 What is closed and what is not proven

Confirmed from the prior process:

- the fixed source and retained runner passed their pre-launch identity gates;
- pytest started once, collected exact8, and produced setup error exact8;
- the fixture's exact ordered-node comparison rejected the prefixed vector;
- challenge, preflight, remote observation, O01–O08 bodies, and closure were
  never reached; and
- retry, fallback, prior-run reuse, rematerialization, interpreter switch,
  and mashos-api change were exact0.

Not proven by that process:

- a dynamic root cause for why pytest selected the observed rootpath;
- that an explicit rootdir has already corrected the node ids;
- any O01–O07 causal-RED or O08 GREEN result; or
- remote availability, exact8 closure, corrected D2 readiness, or stability.

The process is final non-credit evidence for its consumed authority.  It may
not be replayed, repaired in place, or relabelled as a rootdir-corrected run.

# 3. Read-only pytest 8.4.1 static contract

## 3.1 Evidence boundary

This Design inspected the already-retained pytest package as files only.  It
did not invoke Python, import pytest, enter the framework, collect D1, or run
a probe.  Static evidence is limited to source-control behavior needed to
decide whether an explicit-rootdir launcher is implementation-neutral.

| Retained file | Raw SHA-256 | Bytes | Static role |
|---|---|---:|---|
| `_pytest/_version.py` | `eec1a404d513f4d188ecdbfe9d8da4ae32ce0a7e9427920da88f2078bb3ec493` | 511 | binds version `8.4.1` |
| `_pytest/main.py` | `1cfc8743fd192849d2309353de3eb8b42dcd83801e1d11b1169dbc75198333d7` | 37689 | defines `--rootdir` |
| `_pytest/config/__init__.py` | `9a0857d7dec27c5389986a98aecf61f5ab869e46e72dabb8e54695a4b9641eda` | 72712 | passes the option and stores `rootpath` |
| `_pytest/config/findpaths.py` | `e3bbb530cc5d160d60f88b177e2d8f6baed6db507c639af0d8ba0c42650a61be` | 8404 | resolves explicit rootdir |
| `_pytest/nodes.py` | `5646501513534cd741a31a92fea2af1aadd3c2e24d7b70318aa83d9656792ba2` | 26533 | derives filesystem node ids |
| `_pytest/pathlib.py` | `8127808359baaa711775862b32bfbe0a7e5c16a2e8c9923d60ddd45f031b66fa` | 37622 | absolute-path helper semantics |
| `_pytest/python.py` | `ebf31a8738065ad418c354ceeed99562926055587c664501e9f8d194e4078202` | 66627 | Python collector path |

The installed distribution metadata says pytest `8.4.1`; its METADATA raw
SHA-256 is `3e6f6ba5b37585c7d54b9283e9804a647e83e953dc9c9759df81fba0e391ed1`.
The retained RECORD closure for the inspected files was exact-equal.

## 3.2 Direct static facts

The inspected source establishes this path:

1. `_pytest/main.py` registers `--rootdir` as a value-bearing option;
2. `_pytest/config/__init__.py` passes that value as `rootdir_cmd_arg` to
   `determine_setup` and stores the returned path as `config._rootpath`;
3. `_pytest/config/findpaths.py` replaces the inferred root with the explicit
   argument after absolute-path normalization and rejects a non-directory;
4. `_pytest/nodes.py` first derives an FS collector node id with
   `self.path.relative_to(session.config.rootpath)`; and
5. child test node ids append `::` and the test name to their parent node id.

The fixed D1 source independently defines its path as the repository-relative
`ai/tests/...py`, builds exact8 ordered node ids from that path, and compares
the complete session vector before acquisition.

Therefore, if the operational `--rootdir` is exactly the fixed source
repository root, the absolute D1 path is under that same root without a
symlink boundary, and all source identities still match, pytest 8.4.1's
inspected code path derives the module part as the frozen repository-relative
path.  The test names then form the existing exact8 vector.

This is static contract readiness only.  It is not a collected observation or
a prediction of remote availability or semantic exact8.

# 4. Canonical fixed-root binding

## 4.1 Exact body-free binding

The fixed-root binding has exact8 keys:

```text
schema_version
rootdir_class
repository_full_name
source_commit_sha1
source_tree_sha1
d1_relative_path
d1_blob_sha1
d1_raw_sha256
```

```text
rootdir class:
FIXED_SOURCE_REPOSITORY_ROOT

canonical byte count / SHA-256:
601 /
c8a56dfaa93db8b31b4908baa0e8b7a9a4bcc6f38d18a83e5f6a6d4635da2aef
```

Exact UTF-8 compact sorted-key JSON preimage with no trailing LF:

```json
{"d1_blob_sha1":"c0eb936690a3423ac4615a9aabb37c40cc257324","d1_raw_sha256":"3536b8a838ffe2ccbe29db69e9c5400c719de8e63ddf83da9ea0f83b94f17d14","d1_relative_path":"ai/tests/test_emlis_nls_v3_recovery_epoch004_operational_admission_v2_event1_connection_actual_git_identity_parent_phase3_red.py","repository_full_name":"MassyuRed/mashos-api","rootdir_class":"FIXED_SOURCE_REPOSITORY_ROOT","schema_version":"cocolon.emlis.nls_v3.recovery_epoch004.d1_v5.pytest_rootdir_binding.v1","source_commit_sha1":"37eee88c431d1af3f8d2e96f9b0dd8b3d3bc327f","source_tree_sha1":"3891b84164ba0063136e47beb93d36798587a568"}
```

## 4.2 Operational root gates

The future executor must resolve one absolute operational source root and
prove all of these before any launcher:

1. it is an existing directory and the clean fixed mashos-api checkout root;
2. its HEAD commit/tree are the fixed values in section 1.3;
3. its canonical lexical path contains no symlink component and the final
   directory itself is not a symlink;
4. joining the exact D1 relative path stays strictly inside that root;
5. the joined target is a regular non-symlink file with the fixed Git blob and
   raw SHA-256;
6. the exact same root is used for operational pytest `--rootdir`,
   `MASHOS_API_SOURCE_REPOSITORY_ROOT`, and the D1 relative-path base; and
7. the rendered rootdir argument contains no `$` byte, and applying pytest
   8.4.1's inspected environment expansion plus absolute normalization still
   yields the validated root byte/path identity; and
8. owner and independent verifier derive the same binding hash in section
   4.1 without trusting each other's verdict.

The absolute root body is session-local and is not published.  The body-free
logical launcher uses the binding hash; the operational process receives the
validated absolute path.  These two representations may not be substituted
for one another.

Precedence is fixed.  Commit/tree, clean-checkout, D1, or lock byte mismatch
first stops as the unchanged `R1_SOURCE_IDENTITY_DRIFT_NONCREDIT_STOP`.
Only after those source identities are equal, a root absence/non-directory,
symlink, containment, same-root, binding-hash, or role-agreement failure stops
before launcher as:

```text
R1_ROOTDIR_BINDING_INVALID_NONCREDIT_STOP
```

On that terminal:

```text
pytest invocation / challenge / remote / O01–O08:
exact0 / exact0 / exact0 / exact0

repair / rematerialization / interpreter switch / retry:
exact0 / exact0 / exact0 / exact0
```

# 5. Corrected launcher canonicalization

## 5.1 Frozen operational form

After every pre-launch gate passes, the only eligible operational command is:

```text
<same retained executable> -B -m pytest -q --noconftest \
  -p no:cacheprovider \
  --rootdir=<validated absolute fixed source repository root> \
  <absolute fixed D1 path> --maxfail=0
```

Shell parsing and generic PATH resolution are not used.  The working directory
remains a freshly validated empty non-repository directory.  The environment
policy remains:

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
same validated root bound by section 4; body omitted

working-directory class:
EMPTY_NON_REPOSITORY_DIRECTORY

environment-policy SHA-256:
6393dea280af670e3b0ed902014c86fc65a6666e973fe8e7ee50318ff1a11591

shell parsing / generic Python or PATH resolution:
exact0 / exact0

execution deadline:
1200 seconds; timeout is non-credit with retry exact0
```

## 5.2 New logical argv

Exact compact JSON-array preimage with no trailing LF:

```json
["EXECUTABLE_SHA256=9ed008e5a8685235361f0c53771b520ab082dd99a877ad2fd796a93fa4c0b488","-B","-m","pytest","-q","--noconftest","-p","no:cacheprovider","--rootdir=ROOTDIR_BINDING_SHA256=c8a56dfaa93db8b31b4908baa0e8b7a9a4bcc6f38d18a83e5f6a6d4635da2aef","D1_BLOB_SHA1=c0eb936690a3423ac4615a9aabb37c40cc257324","--maxfail=0"]
```

```text
logical argv byte count / SHA-256:
319 /
45d1b95d0327423969e6383335795dac8911656717025f0d5f9a9151c1dc2e4e
```

The previous logical argv hash
`8797754f541bd6bbd97734f0e80329cb597f2e37605755d33588fbef7d58f99c`
is historical non-credit evidence only.  It is consumed and may not be
reused by the new authority.

Relative to that body-free prior argv array, the exact only token insertion
is the rootdir identity token shown above, immediately before the unchanged
D1 blob token.  Every other ordered logical token and the environment policy
are byte-identical.  The future machine Receipt must bind this insertion-only
relationship as well as both old and new hashes.

```text
eligible new logical argv value count:
exact1

old logical argv reuse:
exact0

explicit operational rootdir option:
exact1 only in the later eligible one-shot

prefix stripping / suffix matching / nodeid output rewrite:
exact0 / exact0 / exact0

collect-only / dry-run / launcher probe:
exact0 / exact0 / exact0
```

The correction changes the process command only.  It does not modify pytest,
D1, another test, fixture, production module, dependency, configuration, or
lock.

# 6. Immutable node-id and semantic contracts

## 6.1 Ordered node identity

```text
ordered node-list SHA-256:
e2661d946c060efc44ce7da06f8c55f51d10dfad2af4f5f0526bd38109c340bc

ordered node count:
exact8
```

The existing D1 `_ORDERED_NODE_IDS` object and its exact path/test-name order
remain immutable.  The future fixture must compare pytest's native
`request.session.items[*].nodeid` values directly.  No prefix removal,
suffix-only acceptance, path alias, rewritten reporter output, or tolerant
comparison is credit-eligible.

## 6.2 Expected exact8 vector

```text
expected-vector SHA-256:
da9d266a254a12a655d4dd9388ccd3e866a57455ff98254e119571f8b824055b
```

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

Credit still requires:

```text
pytest exit:
1

collected / executed / ordered rows:
exact8 / exact8 / exact8

failed / passed / error:
exact7 / exact1 / exact0

fresh challenge / eligible neutral request / process-network execution:
exact1 / exact1 / exact1

additional role/harness query request detection:
POSITIVE_FROZEN_NODE_LANES

additional role/harness process-network execution:
exact0

observation identity / internal closure:
exact1 / exact1
```

Exit code 1 or collected exact8 alone is never credit.  Every O01–O07 row
must have the frozen signature and violation class, O08 must pass, the same
immutable observation identity must be consumed across roles, and closure
must equal exact1.

# 7. Exactly one distinct corrected one-shot authority

## 7.1 Unique token and inactive state

This Design defines exactly one unique concrete successor token value:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_V5_R1_ROOTDIR_CORRECTED_DISTINCT_ONE_SHOT_PRIOR_R1_NODEID_SETUP_NONCREDIT_CLOSED_SAME_RETAINED_RUNTIME_IDENTITY_AND_EXECUTABLE_HASH_REDERIVED_EMPTY_NONREPO_CWD_EXPLICIT_FIXED_SOURCE_ROOTDIR_REPOSITORY_RELATIVE_ORDERED_NODEID_FULL_EXACT8_PYTEST_INVOCATION_EXACT1_FRESH_CHALLENGE_ELIGIBLE_ACTUAL_GIT_REMOTE_MAIN_ACQUISITION_EXACT1_GUARDED_ADDITIONAL_ROLE_HARNESS_QUERY_REQUEST_DETECTION_POSITIVE_PROCESS_NETWORK_EXECUTION_EXACT0_RETRY_FALLBACK_PRIOR_RUN_REUSE_REMATERIALIZATION_INTERPRETER_SWITCH_EXACT0_O01_O07_CAUSAL_RED_O08_GREEN_V1_INVARIANCE_CLOSURE_EXACT1_OR_TYPED_NONCREDIT_STOP_AND_POSTVERIFICATION_ONLY
```

```text
state:
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED

concrete successor unique token value count:
exact1

successor invocation under this Design:
exact0

automatic transition:
false
```

Repeated documentary references to that same value do not create multiple
authorities.  No other concrete execution token is issued by this Design.
Publication and postverification of this Design exact5 still do not activate
the token; Mash must separately approve that exact token.

## 7.2 Pre-launch gates and expiry

Before the separately approved launcher, owner and independent verifier must
each rederive, without verdict reuse:

- the fixed source commit/tree, D1 blob/raw, and lock blob/raw/logical values;
- every retained-runtime exact7 identity in section 1.3, including the
  executable hash;
- full-root exact527, installed rows exact482, distribution/RECORD closure
  exact5/exact5, and unowned/unexpected exact0/exact0;
- the rootdir binding hash in section 4; and
- the new logical argv hash and unchanged environment-policy hash.

Any mismatch, missing root, source mutation, runtime mutation, added entry,
symlink violation, command mismatch, role disagreement, or executable change
stops before launcher.  The process budget on such a stop is exact0.  It does
not authorize repair, package acquisition, rematerialization, interpreter
switch, another runtime, or a second command.

Fixed commit/tree, D1, or lock byte drift keeps the existing
`R1_SOURCE_IDENTITY_DRIFT_NONCREDIT_STOP`.  Root path, symlink, containment,
same-root, or binding-hash failure uses the section 4 terminal.  A new
logical-argv or environment-policy mismatch uses:

```text
R1_LAUNCHER_OR_ENVIRONMENT_IDENTITY_INVALID_NONCREDIT_STOP
```

For either pre-launch terminal:

```text
pytest / challenge / remote / O01–O08:
exact0 / exact0 / exact0 / exact0

repair / retry / fallback / rematerialization / interpreter switch:
exact0 / exact0 / exact0 / exact0 / exact0
```

## 7.3 One-shot budgets after every gate passes

```text
pytest invocation upper bound / eligible-path value:
exact1 / exact1

same-authority rerun:
exact0

fresh challenge when reached:
exact1

eligible neutral actual-Git remote-main request / process-network execution
when reached:
exact1 / exact1

owner / independent / parent / harness additional process-network execution:
exact0 / exact0 / exact0 / exact0

retry / fallback / prior-run reuse:
exact0 / exact0 / exact0

runtime repair / rematerialization / interpreter switch:
exact0 / exact0 / exact0

prior stdout, nodeid vector, challenge, or observation reuse:
exact0 / exact0 / exact0 / exact0
```

Challenge and remote counts are reach-dependent.  A launcher/collection stop
may leave both exact0; a preflight stop may retain challenge exact1 and remote
exact0; an eligible path reaches exact1/exact1.  No unobserved value may be
filled from the expected vector or prior run.

The existing current-source guards may positively detect forbidden
role/harness query requests in the frozen O01–O07 lanes, but they must block
their actual process/network execution.  Request detection positive and
additional process/network execution exact0 are separate, compatible facts.

## 7.4 Typed result and no-rerun closure

The rootdir-corrected execution schema has exact12 finite result classes.  It
preserves the prior exact10 vocabulary byte-for-byte and adds only the two
new pre-launch identity classes required by sections 4 and 7.2:

```text
D1_CAUSAL_RED_REFREEZE_ESTABLISHED
R1_RUNTIME_IDENTITY_EXPIRED_NONCREDIT_STOP
R1_SOURCE_IDENTITY_DRIFT_NONCREDIT_STOP
R1_ROOTDIR_BINDING_INVALID_NONCREDIT_STOP
R1_LAUNCHER_OR_ENVIRONMENT_IDENTITY_INVALID_NONCREDIT_STOP
R1_PYTEST_LAUNCH_OR_COLLECTION_NONCREDIT_STOP
R1_D1_PREFLIGHT_REJECTED_NONCREDIT_STOP
R1_REMOTE_OBSERVATION_NONCREDIT_STOP
R1_POSTACQUISITION_TYPED_ABORT_NONCREDIT_STOP
R1_ORACLE_VECTOR_NONCREDIT_STOP
R1_CLOSURE_NONCREDIT_STOP
R1_RESULT_UNKNOWN_STOP
```

Only the first is credit.  It requires the complete section 6 contract and
owner/independent `VALID` verdicts over the same body-free observation hash.
The exact failure mapping is:

| Result class | failure.stage | failure.class | failure.safe_code |
|---|---|---|---|
| `D1_CAUSAL_RED_REFREEZE_ESTABLISHED` | `NONE` | `NONE` | `NONE` |
| `R1_RUNTIME_IDENTITY_EXPIRED_NONCREDIT_STOP` | `PRELAUNCH_RUNTIME` | `IDENTITY` | `RUNTIME_IDENTITY_EXPIRED` |
| `R1_SOURCE_IDENTITY_DRIFT_NONCREDIT_STOP` | `PRELAUNCH_SOURCE` | `IDENTITY` | `SOURCE_IDENTITY_DRIFT` |
| `R1_ROOTDIR_BINDING_INVALID_NONCREDIT_STOP` | `PRELAUNCH_ROOTDIR` | `IDENTITY` | `ROOTDIR_BINDING_INVALID` |
| `R1_LAUNCHER_OR_ENVIRONMENT_IDENTITY_INVALID_NONCREDIT_STOP` | `PRELAUNCH_LAUNCHER` | `IDENTITY` | `LAUNCHER_OR_ENVIRONMENT_IDENTITY_INVALID` |
| `R1_PYTEST_LAUNCH_OR_COLLECTION_NONCREDIT_STOP` | `PYTEST` | `EXECUTION` | `PYTEST_LAUNCH_OR_COLLECTION_INVALID` |
| `R1_D1_PREFLIGHT_REJECTED_NONCREDIT_STOP` | `D1_PREFLIGHT` | `PREFLIGHT` | `D1_PREFLIGHT_REJECTED` |
| `R1_REMOTE_OBSERVATION_NONCREDIT_STOP` | `REMOTE_OBSERVATION` | `EXTERNAL_OBSERVATION` | `REMOTE_OBSERVATION_NOT_EVALUABLE` |
| `R1_POSTACQUISITION_TYPED_ABORT_NONCREDIT_STOP` | `POSTACQUISITION` | `LOCAL_INTROSPECTION` | `POSTACQUISITION_TYPED_ABORT` |
| `R1_ORACLE_VECTOR_NONCREDIT_STOP` | `ORACLE` | `SEMANTIC_VECTOR` | `ORACLE_VECTOR_INVALID` |
| `R1_CLOSURE_NONCREDIT_STOP` | `CLOSURE` | `CLOSURE` | `CLOSURE_INVALID` |
| `R1_RESULT_UNKNOWN_STOP` | `RESULT` | `RESULT_UNKNOWN` | `RESULT_UNKNOWN` |

Unavailable, malformed, OID-mismatched, differently ordered, partial,
unexpected-GREEN, unexpected-failure, setup/teardown error, timeout, or
unknown results stop.  They do not authorize a second process in the same
authority and do not advance to corrected D2.

# 8. Evidence and publication contracts

## 8.1 Future rootdir-corrected one-shot exact5

The later execution authority, if separately approved, may publish only:

```text
NEW exact3:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_R1RootdirCorrected_SameRetainedRuntime_FreshChallenge_Exact8OneShot_Result_20260731.md
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_R1RootdirCorrected_SameRetainedRuntime_FreshChallenge_Exact8OneShot_BodyFree_Receipt_20260731.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_R1RootdirCorrected_SameRetainedRuntime_FreshChallenge_Exact8OneShot_Handoff_20260731.md

MODIFY append-only exact2:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md
Cocolon_前提資料/07_latest_snapshot_diff.md
```

Its Result and Receipt must record, at minimum:

- rootdir binding SHA-256 `c8a56d...a2aef` and owner/independent equality;
- new logical argv SHA-256 `45d1b95d...e4e` and invocation count;
- historical argv SHA-256 `8797754f...f99c` with reuse exact0;
- environment-policy SHA-256 `6393dea2...1591`;
- ordered-node SHA-256 `e2661d94...40bc`;
- exact source/runtime/executable rederivations;
- actual reached challenge/request/execution/result/closure counts; and
- the complete safe typed terminal without raw output, paths, exception
  bodies, environment bodies, or challenge bytes.

The future Body-free Receipt uses a distinct rootdir-corrected schema version.
It preserves the existing exact16 top-level execution-Receipt roles while
adding the rootdir/old-new launcher evidence inside the finite command and
environment projections.  It does not overwrite or reinterpret the prior
non-credit Receipt.

### 8.1.1 Frozen rootdir-corrected execution Receipt schema

The future Body-free Receipt top level remains exact16:

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
cocolon.emlis.nls_v3.step11.cycle001.recovery_epoch004.d1_v5.r1_rootdir_corrected_exact8_one_shot_receipt.v1

authority_token:
the exact unique token in section 7.1

body_free / automatic_progression:
true / false

receipt_sha256_preimage_rule:
SHA256_OF_UTF8_COMPACT_SORTED_KEY_JSON_AFTER_DELETING_RECEIPT_SHA256_WITH_NO_TRAILING_LF
```

`credited_design_checkpoint` remains exact7:

```text
cocolon_commit_sha1
cocolon_tree_sha1
receipt_path
receipt_git_blob_sha1
receipt_raw_sha256
receipt_logical_sha256
state
```

It binds the final postverified commit/tree and Receipt of the present Design
exact5.  `result_publication` remains exact8:

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

It binds the separately published future Result and requires repository
`MassyuRed/Cocolon` and `postfetch_exact_equal=true`.

`execution_observation` is exact11:

```text
stage
fixed_source
runtime_rederivation
rootdir_contract
environment_policy
command_contract
process_result
exact8
run_contract
source_and_closure
result_class
```

Its nested exact keysets are frozen as follows:

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

rootdir_contract exact14:
binding_schema_version, rootdir_class, binding_byte_count,
expected_binding_sha256, owner_binding_sha256,
independent_binding_sha256, owner_status, independent_status,
operational_path_published, rootdir_equals_source_environment_root,
rootdir_equals_d1_relative_path_base,
expanded_absolute_root_equals_validated_root,
rootdir_argument_dollar_byte_count, all_equal

environment_policy exact5:
expected_logical_policy_sha256, owner_logical_policy_sha256,
independent_logical_policy_sha256, working_directory_class, all_equal

command_contract exact12:
expected_logical_argv_sha256, owner_logical_argv_sha256,
independent_logical_argv_sha256, logical_argv_all_equal,
prior_noncredit_logical_argv_sha256, prior_logical_argv_reuse_count,
logical_rootdir_token_count, process_explicit_rootdir_option_count,
invocation_count, deadline_seconds, generic_path_resolution_count,
shell_parsing_count

process_result exact11:
started, completed, timed_out, exit_code,
stdout_capture_state, stdout_sha256, stdout_byte_count,
stderr_capture_state, stderr_sha256, stderr_byte_count, safe_result

exact8 exact6:
collected_count, executed_count, failed_count, passed_count,
error_count, ordered_results

ordered_results row exact4:
node_id, outcome, causal_signature_id, violation_class

run_contract exact14:
fresh_challenge_count, neutral_remote_request_count,
neutral_remote_execution_count,
guarded_additional_query_request_detection,
additional_remote_execution_count, retry_count, fallback_count,
prior_run_reuse_count, prior_stdout_reuse_count,
prior_nodeid_reuse_count, prior_challenge_reuse_count,
prior_observation_reuse_count, rematerialization_count,
interpreter_switch_count

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

Rootdir literals are the section 4 schema/class, byte count `601`, expected
hash `c8a56d...a2aef`, and `operational_path_published=false`.
Environment expected hash is `6393dea2...1591`; working-directory class is
`EMPTY_NON_REPOSITORY_DIRECTORY`.  Command expected hash is
`45d1b95d...e4e`, prior non-credit hash is `8797754f...f99c`, logical
rootdir token count is `1`, deadline is `1200`, and prior reuse, generic
resolution, and shell parsing are always `0`.

`failure` remains exact3 `stage`, `class`, and `safe_code`.  Each
owner/independent verdict remains exact4 `role`, `verdict`, `reason_code`, and
`execution_observation_sha256`.  `repository_scope` remains exact5 with
`3 / 2 / exact5 / 0 / 0` for new paths, modified paths, ordered future paths
in section 8.1, mashos-api paths, and production-or-test paths.

```text
repository_scope exact5:
cocolon_new_path_count
cocolon_modified_path_count
cocolon_paths
mashos_api_changed_path_count
production_or_test_changed_path_count
```

`zero_effects` remains exact8, all integer `0`:

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
the exact `execution_observation` object with no trailing LF.  Receipt
`receipt_sha256` uses the same canonicalization after deleting only
`receipt_sha256` from the top object.  The stored Receipt is compact sorted-key
UTF-8 JSON plus exactly one trailing LF.

### 8.1.2 Enums, verdicts, and stage projections

`state` and `execution_observation.result_class` are byte-equal and use the
exact12 classes and exact failure mapping in section 7.4.  Verdict roles are
exactly `OWNER` and `INDEPENDENT_VERIFIER`; verdict is `VALID` only for credit
and otherwise `INVALID`.  Reason codes in exact12 class order are:

```text
ALL_CHECKS_EQUAL
RUNTIME_IDENTITY_EXPIRED
SOURCE_IDENTITY_DRIFT
ROOTDIR_BINDING_INVALID
LAUNCHER_OR_ENVIRONMENT_IDENTITY_INVALID
PYTEST_LAUNCH_OR_COLLECTION_INVALID
D1_PREFLIGHT_REJECTED
REMOTE_OBSERVATION_NOT_EVALUABLE
POSTACQUISITION_TYPED_ABORT
ORACLE_VECTOR_INVALID
CLOSURE_INVALID
RESULT_UNKNOWN
```

Both roles independently canonicalize the same observation and carry the same
observation hash; neither may reuse the other's verdict.  `stage` is one of:

```text
PRELAUNCH_SOURCE_CHECK
PRELAUNCH_RUNTIME_CHECK
PRELAUNCH_ROOTDIR_CHECK
PRELAUNCH_LAUNCHER_CHECK
PROCESS_START
PROCESS_COMPLETION
RESULT_PARSE
```

Runtime and rootdir role `status` values are `NOT_STARTED`, `VALID`, or
`INVALID`.  `guarded_additional_query_request_detection` is one of
`NOT_STARTED`, `POSITIVE_FROZEN_NODE_LANES`, `NOT_POSITIVE`, or `UNKNOWN`.
Credit requires `POSITIVE_FROZEN_NODE_LANES`; it never means an additional
process/network execution occurred.

The unchanged process `safe_result` enum is:

```text
NOT_STARTED
PROCESS_START_FAILED
COMPLETED_EXIT_1
COMPLETED_UNEXPECTED_EXIT
TIMEOUT
PROCESS_RESULT_UNKNOWN
```

Each stream capture state is `NOT_STARTED`, `CAPTURED`, or `UNAVAILABLE`.
The unchanged preflight enum is:

```text
NOT_STARTED
PREFLIGHT_ELIGIBLE
PREFLIGHT_REPOSITORY_MISMATCH
PREFLIGHT_REF_MISMATCH
PREFLIGHT_LOCAL_SOURCE_CUT_INVALID
PREFLIGHT_EXECUTOR_IDENTITY_INVALID
```

The unchanged remote-result enum is:

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

The unchanged terminal-class enum is:

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

The first seven equality-verdict fields are nullable booleans and `body_free`
is always true.  If `started=false`, both stream states are `NOT_STARTED`,
stream hashes/counts and exit code are `null`, and completed/timed-out are
false.  Captured empty bytes use the empty-byte SHA-256 and integer `0`;
capture failure uses `UNAVAILABLE` with hash/count `null` and forces
`PROCESS_RESULT_UNKNOWN`.  A completed process requires an integer exit code
and `timed_out=false`; timeout requires `completed=false` and exit code
`null`.  Ordered rows retain only the existing finite O01–O08 normalized
values and never raw node ids or exception text.  This rootdir-only
reconciliation does not rename or remove these prior enums or cross-fields.

Expected fixed-source, runtime, rootdir, environment, command, prior-hash,
deadline, and body-free fields are always populated.  The exact not-reached
rootdir projection is:

```text
owner_binding_sha256 / independent_binding_sha256:
null / null

owner_status / independent_status:
NOT_STARTED / NOT_STARTED

rootdir_equals_source_environment_root:
null

rootdir_equals_d1_relative_path_base:
null

expanded_absolute_root_equals_validated_root:
null

rootdir_argument_dollar_byte_count:
null

all_equal:
false
```

The exact not-reached launcher projection is:

```text
environment owner / independent hash:
null / null

environment all_equal:
false

command owner / independent hash:
null / null

command logical_argv_all_equal:
false

logical_rootdir_token_count:
1

prior_logical_argv_reuse_count / process_explicit_rootdir_option_count /
invocation_count / generic_path_resolution_count / shell_parsing_count:
0 / 0 / 0 / 0 / 0

deadline_seconds:
1200
```

Stage projection is then deterministic:

- at `PRELAUNCH_SOURCE_CHECK`, runtime owner/independent hashes are all
  `null`, their statuses are `NOT_STARTED`, their counts and
  `rederivation_count` are `0`, and runtime `all_equal=false`; rootdir and
  launcher use the exact not-reached projections above; process/exact8/run
  counts are `0`, ordered rows are empty, and process/closure are
  `NOT_STARTED`;
- at `PRELAUNCH_RUNTIME_CHECK`, fixed source is equal; owner/independent
  runtime rows retain only safely derived values.  Runtime failure leaves
  rootdir and launcher at the exact not-reached projections, with process,
  exact8, and run counts `0`;
- at `PRELAUNCH_ROOTDIR_CHECK`, source/runtime are equal; owner/independent
  rootdir rows retain safely observed hashes or `null`, actual statuses, and
  each safely observed equality/dollar value or `null`.  Validity requires
  both `VALID`, both hashes equal expected, all three equality booleans true,
  dollar-byte count `0`, and `all_equal=true`; any other finite projection is
  invalid with `all_equal=false`.  Launcher remains at its exact not-reached
  projection and invocation stays `0`;
- at `PRELAUNCH_LAUNCHER_CHECK`, rootdir is equal; owner/independent
  environment and command hashes retain safely derived values or `null`.
  Environment `all_equal=true` only when both hashes equal expected;
  `logical_argv_all_equal=true` only when both command hashes equal expected.
  Any unavailable/mismatched value sets the relevant equality to false.
  Logical rootdir token remains `1`; prior reuse, process rootdir option,
  invocation, generic resolution, and shell parsing remain `0`; and
- at `PROCESS_START`, invocation and process explicit-rootdir counts become
  exact1 together.  Spawn failure uses the unchanged not-started stream/null
  projection and no second start;
- at `PROCESS_COMPLETION`, only safely parsed collection/node/run fields may
  be nonzero; expected values and prior output never fill observation gaps;
  and
- at `RESULT_PARSE`, owner and independent derive one finite exact12 result
  from the same complete safe observation.

For every pre-launch stop and process-start failure, challenge, remote,
exact8, and closure remain zero/not-started.  After a process starts, a
collection or fixture-setup stop retains every safely parsed collection,
executed, and error count; if the fixture never reaches challenge/acquisition,
those run and closure counts remain `0`.  Preflight, remote, typed-abort,
oracle, closure, and unknown stops retain only values actually reached under
the unchanged prior semantic projection rules.  The credited projection
additionally requires rootdir, environment, and command equality; new argv
only; old argv reuse exact0; process explicit-rootdir exact1; guarded request
detection `POSITIVE_FROZEN_NODE_LANES`; the exact section 6 vector; and closure
exact1.  No stage authorizes a retry.

## 8.2 Current Design exact5

The present Design-only checkpoint uses:

```text
NEW exact3:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_R1NodeIdPrefixNoncredit_ExplicitFixedRootdirLauncherCanonicalization_NewOneShotBoundaryReconciliation_Design_ReadOnly_20260731.md
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_R1NodeIdPrefixNoncredit_ExplicitFixedRootdirLauncherCanonicalization_NewOneShotBoundaryReconciliation_Design_ReadOnly_BodyFree_Receipt_20260731.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_R1NodeIdPrefixNoncredit_ExplicitFixedRootdirLauncherCanonicalization_NewOneShotBoundaryReconciliation_Design_ReadOnly_Handoff_20260731.md

MODIFY append-only exact2:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md
Cocolon_前提資料/07_latest_snapshot_diff.md
```

Publication order is Design, Receipt, Handoff, Plan append, latest snapshot
append.  Each publication commit changes only its approved exact1 path and is
postfetched exact-equal before the next publication.

Current append prefixes:

```text
Execution and Closure Plan blob / raw / bytes:
57e7374470016a44953354f122318f6a2ff876c3
19618da45a123b939447bc76bb545b03dae98546ad6fcebcafe5f5384cc68f71
380650

latest snapshot blob / raw / bytes:
bcade45e8d3bc7c77bbd1e4ff7df982377f7ee6c
09082806d2a2c2e9189dcd3e0176a36f0da63432ec6fd9ee66f10eec8ba19dca
1580396
```

Both prefixes must remain byte-identical.  The Receipt carries the published
Design identity; Handoff carries Design and Receipt identities; Plan carries
published exact3; latest snapshot carries published exact4.  The Receipt does
not carry its own publication identity.

### 8.2.1 Frozen current Design Receipt schema

The present Body-free Design Receipt top level is exact20:

```text
authority_token
automatic_progression
body_free
decision
design_publication
fixed_source
independent_verification
launcher_reconciliation
next_authority
predecessor_noncredit_checkpoint
receipt_sha256
receipt_sha256_preimage_rule
repository_scope
retained_runtime_binding
schema_version
source_entries
state
static_pytest_evidence
zero_effects
zero_execution
```

Its schema and canonical rule are:

```text
schema_version:
cocolon.emlis.nls_v3.step11.cycle001.recovery_epoch004.d1_v5.r1_nodeid_prefix_noncredit.rootdir_launcher_reconciliation_design_receipt.v1

authority_token:
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_V5_R1_PYTEST_INVOCATION_EXACT1_COLLECTION_EXACT8_MODULE_FIXTURE_SETUP_ERROR_EXACT8_BEFORE_PREFLIGHT_CHALLENGE_REMOTE_AND_O01_O08_NONCREDIT_EMPTY_NONREPO_CWD_ABSOLUTE_D1_PYTEST_ROOTDIR_CHECKOUT_PREFIX_NODEID_MISMATCH_EXPLICIT_FIXED_SOURCE_ROOTDIR_REPOSITORY_RELATIVE_ORDERED_NODEID_LAUNCHER_CANONICALIZATION_AND_DISTINCT_NEW_ONE_SHOT_AUTHORITY_BOUNDARY_RECONCILIATION_DESIGN_READ_ONLY_AND_POSTVERIFICATION_ONLY

body_free / automatic_progression:
true / false

state:
RECOVERY_EPOCH004_D1_V5_R1_PRIOR_NODEID_PREFIX_NONCREDIT_CLOSED_EXPLICIT_FIXED_SOURCE_ROOTDIR_STATIC_CONTRACT_RECONCILED_DISTINCT_ROOTDIR_CORRECTED_ONE_SHOT_DEFINED_INACTIVE_PYTEST_CHALLENGE_REMOTE_O01_O08_EXACT0_CORRECTED_D2_STABILITY_REFERENCE_OPERATIONAL_ADMISSION_BLOCKED_AUTOMATIC_PROGRESSION_FALSE_AUTHORITY_STOP

receipt_sha256_preimage_rule:
SHA256_OF_UTF8_COMPACT_SORTED_KEY_JSON_AFTER_DELETING_RECEIPT_SHA256_WITH_NO_TRAILING_LF
```

Exact nested keysets are:

```text
source_entries exact8:
cocolon_entry_commit_sha1, cocolon_entry_tree_sha1,
execution_plan_entry_git_blob_sha1,
execution_plan_entry_raw_sha256, execution_plan_entry_byte_count,
latest_snapshot_entry_git_blob_sha1,
latest_snapshot_entry_raw_sha256, latest_snapshot_entry_byte_count

predecessor_noncredit_checkpoint exact6:
cocolon_commit_sha1, cocolon_tree_sha1,
execution_observation_sha256,
receipt_delete_self_logical_sha256, state, artifacts

predecessor artifacts exact5 object:
result, receipt, handoff, execution_plan, latest_snapshot

each predecessor artifact row exact3:
publication_commit_sha1, git_blob_sha1, raw_sha256

design_publication exact11:
repository_full_name, path, publication_parent_commit_sha1,
publication_commit_sha1, publication_tree_sha1, git_blob_sha1,
raw_sha256, byte_count, line_count, changed_path_count,
postfetch_exact_equal

fixed_source exact7:
repository_full_name, commit_sha1, tree_sha1, clean,
published_d1_v5, dependency_lock, github_refetched_equal

published_d1_v5 exact3:
path, git_blob_sha1, raw_sha256

dependency_lock exact4:
path, git_blob_sha1, raw_sha256, logical_sha256

static_pytest_evidence exact4:
version, inspection_mode, execution_count, files

static pytest file row exact3:
path, raw_sha256, byte_count

launcher_reconciliation exact11:
prior_authority_state, prior_logical_argv_sha256,
prior_logical_argv_reuse_count, environment_policy_sha256,
rootdir_binding, corrected_logical_argv, ordered_node_list_sha256,
expected_vector_sha256, forbidden_nodeid_rewrite_count,
future_execution_receipt_schema_version, static_contract_status

rootdir_binding exact4:
schema_version, rootdir_class, byte_count, sha256

corrected_logical_argv exact4:
byte_count, sha256, only_difference_from_prior,
eligible_value_count

next_authority exact5:
token, state, concrete_unique_token_value_count,
separate_explicit_mash_approval_required, automatic_transition

decision exact11:
prior_r1_authority_state, prior_r1_result,
rootdir_launcher_contract, corrected_one_shot_authority,
corrected_one_shot_execution_count,
corrected_d1_v5_causal_red_credit, corrected_d2_and_stability,
reference_operational_admission, candidate_or_event1_count,
source_lock, runtime_product_effect_count

retained_runtime_binding exact12:
expected, prior_owner_status, prior_independent_status,
past_readiness_is_future_guarantee, full_runtime_entry_count,
installed_file_row_count, distribution_count,
record_closure_match_count, unowned_importable_count,
unexpected_entry_count, pre_successor_full_rederivation_required,
runtime_path_published

retained runtime expected exact7:
runner_projection_sha256, accepted_wheel_manifest_sha256,
distribution_closure_sha256, installed_file_manifest_sha256,
full_runtime_root_manifest_sha256, runtime_root_identity_sha256,
interpreter_executable_sha256

repository_scope exact7:
cocolon_new_path_count, cocolon_modified_path_count,
cocolon_approved_changed_path_count, cocolon_paths,
mashos_api_changed_path_count, production_source_change_count,
test_or_fixture_change_count

independent_verification exact10:
read_only_lane_count, static_pytest_lane_complete,
design_contract_lane_complete, receipt_and_boundary_lane_complete,
subagent_edit_count, subagent_github_write_count,
subagent_pytest_import_collection_or_execution_count,
final_blocker_count, final_advisory_count, final_judgment_owner

zero_execution exact15:
package_acquisition_count, runtime_materialization_count,
python_or_pytest_import_count, launcher_probe_count,
collect_only_count, dry_run_count, pytest_invocation_count,
framework_entry_count, d1_target_import_count, collection_count,
challenge_creation_count, eligible_live_remote_attempt_count,
o01_o08_observed_count, successor_invocation_count,
mashos_api_change_count

zero_effects exact8:
product_runtime_effect_count,
reference_or_operational_admission_count,
candidate_or_event1_count, source_lock_change_count,
corrected_d2_invocation_count, stability_run_count,
automatic_transition_count, d1_causal_red_credit_count
```

Repository scope is the exact ordered current path list in section 8.2 with
counts new/modified/total `3/2/5`, mashos-api exact0, and production/test
exact0.  Every zero-execution and zero-effect count is integer `0`; automatic
progression is boolean false.  Past retained-runtime statuses are `VALID /
VALID`, `past_readiness_is_future_guarantee=false`, and the next authority
requires a fresh full owner/independent rederivation.

`static_pytest_evidence.files` is the exact7 ordered file list in section 3.1.
`inspection_mode=READ_ONLY_FILE_STATIC_NO_IMPORT_NO_EXECUTION` and
`execution_count=0`.  The next token is the exact section 7.1 value, unique
value count `1`, inactive, and separately approvable.  The Receipt stores
compact sorted-key UTF-8 JSON plus exactly one trailing LF, with delete-self
hash computed after deleting only `receipt_sha256`.  It cannot select a schema
after observing a future run because this Receipt records no run.

# 9. Failure-safe design boundary

If static source inspection had not established the section 3 path, this
Design would have stopped without issuing a one-shot token.  It would not
have changed D1.  Any future D1 v6 test-only refreeze remains a different
Design and a different Mash approval.

The following remain forbidden under both this Design and its later
successor unless a new separate authority explicitly changes them:

```text
D1 modification / fixture tolerance / prefix stripping / suffix matching:
exact0 / exact0 / exact0 / exact0

pytest source change / dependency or config change / lock change:
exact0 / exact0 / exact0 / exact0

same-authority rerun / favorable-result selection:
exact0 / exact0

automatic corrected D2 / stability / Reference / OA transition:
exact0 / exact0 / exact0 / exact0
```

# 10. Confirmed facts, inference, and Karen's opinion

## 10.1 確認した事実

- Cocolon main at `b8ac15d3...` contains the prior R1 non-credit exact5;
- the prior process ran pytest exact1, collected exact8, and ended with setup
  error exact8 before challenge, preflight, remote, oracle bodies, or closure;
- the D1 fixture rejects any ordered node-id vector that differs from its
  repository-relative exact8 vector;
- retained pytest 8.4.1 statically accepts explicit `--rootdir`, stores it as
  `rootpath`, and derives filesystem node ids relative to that rootpath;
- the fixed-root binding and corrected logical argv independently recalculate
  to 601 bytes / `c8a56d...a2aef` and 319 bytes / `45d1b9...1c2e4e`;
- this authority executed no pytest/import/probe/challenge/remote/oracle and
  changed no mashos-api file; and
- the distinct corrected one-shot remains inactive and unexecuted.

## 10.2 推測

The observed checkout prefix is consistent with the first launcher allowing
pytest to infer a rootpath above the fixed source repository.  The inspected
pytest path makes the explicit fixed-source rootdir correction strongly
supported, but the corrected launcher has not yet run.  Therefore runtime
node-id equality and the later exact8 semantic result remain unobserved.

## 10.3 華恋の意見

D1の厳密なnode-id比較を観測結果へ合わせて緩めるより、pytestが本来持つ明示
rootdirで実行境界を固定する方が、テストの因果性と既存D1不変条件を守れます。
ただし静的に整合したことと実行成功は別です。次は同じruntimeとsourceを実行直前に
再導出し、補正済みcommandを一度だけ使い、不利な結果でも再実行せず有限に閉じる
べきです。

# 11. Exactly one next authority and stop

```text
next authority:
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_V5_R1_ROOTDIR_CORRECTED_DISTINCT_ONE_SHOT_PRIOR_R1_NODEID_SETUP_NONCREDIT_CLOSED_SAME_RETAINED_RUNTIME_IDENTITY_AND_EXECUTABLE_HASH_REDERIVED_EMPTY_NONREPO_CWD_EXPLICIT_FIXED_SOURCE_ROOTDIR_REPOSITORY_RELATIVE_ORDERED_NODEID_FULL_EXACT8_PYTEST_INVOCATION_EXACT1_FRESH_CHALLENGE_ELIGIBLE_ACTUAL_GIT_REMOTE_MAIN_ACQUISITION_EXACT1_GUARDED_ADDITIONAL_ROLE_HARNESS_QUERY_REQUEST_DETECTION_POSITIVE_PROCESS_NETWORK_EXECUTION_EXACT0_RETRY_FALLBACK_PRIOR_RUN_REUSE_REMATERIALIZATION_INTERPRETER_SWITCH_EXACT0_O01_O07_CAUSAL_RED_O08_GREEN_V1_INVARIANCE_CLOSURE_EXACT1_OR_TYPED_NONCREDIT_STOP_AND_POSTVERIFICATION_ONLY

state:
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED

concrete successor unique token value count:
exact1

new one-shot execution under this Design:
exact0

automatic progression:
false
```

Required stop:

```text
RECOVERY_EPOCH004_D1_V5_R1_PRIOR_NODEID_PREFIX_NONCREDIT_CLOSED_EXPLICIT_FIXED_SOURCE_ROOTDIR_STATIC_CONTRACT_RECONCILED_DISTINCT_ROOTDIR_CORRECTED_ONE_SHOT_DEFINED_INACTIVE_PYTEST_CHALLENGE_REMOTE_O01_O08_EXACT0_CORRECTED_D2_STABILITY_REFERENCE_OPERATIONAL_ADMISSION_BLOCKED_AUTOMATIC_PROGRESSION_FALSE_AUTHORITY_STOP
```

No corrected R1 launcher, corrected D2, stability run, Reference/OA,
Candidate/Event1, source lock, runtime product, or later authority was
executed.
