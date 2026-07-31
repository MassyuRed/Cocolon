---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch004_d1v5_lock_derived_exact5_test_runner_runtime_readiness_handoff
title: "Recovery Epoch004 D1 v5 lock-derived exact5 test-runner runtime-readiness handoff"
revision_date: "2026-07-31"
status: "RUNTIME_READY_HANDOFF_NEXT_DESIGN_DEFINED_INACTIVE"
body_free: true
automatic_progression: false
---

# Recovery Epoch004 D1 v5 test-runner runtime-readiness handoff

## 0. Authority, result, and stop

Approved authority:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_V5_PUBLISHED_EXACT1_POSTFETCHED_PYTEST_MODULE_UNAVAILABLE_BEFORE_FRAMEWORK_ENTRY_PRECOLLECTION_NONCREDIT_CONFIGURED_ROUTE_HASH_VERIFIED_LOCK_DERIVED_EXACT5_ARTIFACT_ACQUISITION_TEST_RUNNER_MATERIALIZATION_PYTEST_AND_ROLE_IMPORT_PROBES_INDEPENDENT_RUNTIME_READINESS_VERIFICATION_READY_OR_NOT_READY_STOP_ONLY
```

Observed terminal:

```text
RUNTIME_READY
```

```text
configured-route access / accepted hash-equal wheels:
exact1 / exact5

materialization / pytest probe / role-smoke process:
exact1 / exact1 / exact1

direct role load / public API call / effect:
exact3 / exact0 / exact0

D1 target import / collection / execution:
exact0 / exact0 / exact0

challenge / eligible live remote / O01–O08:
exact0 / exact0 / exact0

automatic progression:
false
```

The R0 Result and Body-free Receipt are published and exact-content postfetch
equal.  Credit still requires this Handoff, the append-only Plan and latest
snapshot targets, aggregate unique changed-path exact5, and final
postverification.  Partial publication remains non-credit.

`RUNTIME_READY` closes only the runner-readiness gap.  It is not D1 causal
RED, does not consume a D1 challenge, and does not issue or execute R1.

## 1. Fixed repository and source identities

```text
mashos-api commit / tree / clean main:
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

Existing lock:

```text
path:
ai/configs/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_lock_v1.json

blob / raw / logical SHA-256:
0822fcb010985cd0d384f250a9e8a1fe16dc8fd4
9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787
801ba54efc0f6655238d14e7c153fb70b555801489aa8ba028515fc64d9c05f4
```

Both source identities and the clean commit/tree were reverified after the
pytest and role-smoke probes.  The D1 test module remained unimported.

## 2. Input, materialization, and readiness evidence

The existing exact46 lock was bound by reference and projected to the ordered
test-runner exact5 only:

```text
iniconfig 2.3.0
packaging 26.2
pluggy 1.6.0
pygments 2.20.0
pytest 8.4.1

projection SHA-256:
f501025c1dccef68c47c0a3e52f3ef74d01233f371b16f2b1a0bdfb21089e57e
```

Configured-route acquisition was non-credit preparation.  Candidate
filename, raw wheel hash, wheel RECORD hash, distribution name, and version
all equalled the lock before acceptance.

```text
acquisition state:
ACQUIRED_CONFIGURED_ROUTE

accepted-wheel manifest SHA-256:
00d2df98c8cda7f1473794892bafe7ccd18cc816c79ccb346f3e21ff629b136d

accepted / rejected / sdist / build / unconfigured source:
exact5 / exact0 / exact0 / exact0 / exact0

post-acceptance package-index access:
exact0
```

The fresh isolated target used pip 26.0.1 outside the target, with
hashes-required, wheel-only, no-index, no-dependency, and no-compile policy.

```text
materialization state / count:
VERIFIED / exact1

distribution / installed RECORD-closure match:
exact5 / exact5

unowned importable / unexpected entry:
exact0 / exact0
```

Body-free retained-runtime identities:

```text
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

The runtime is CPython 3.12.13 on `linux-x86_64`.  Owner and independent
verification rebuilt the installed-file and full-root manifests before and
after both probes and obtained identical values.  The absolute root and
executable path are not published.

## 3. Probe evidence

The fixed environment policy was:

```text
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1
PYTHONDONTWRITEBYTECODE=1

PYTEST_ADDOPTS absent
PYTEST_PLUGINS absent
PYTHONPATH absent

working-directory class:
EMPTY_NON_REPOSITORY_DIRECTORY

policy SHA-256:
8a43751b49a8db1d024063608405f9b169e829f3c0be3488433b31800d44b1a4
```

Pytest probe:

```text
invocation / exit / reported version / result:
exact1 / 0 / 8.4.1 / VALID

logical argv SHA-256:
4ff50356d7f0cd49b431df2f480e71aabaf2ff07bd476a90fa29ef4a2eb52cb9
```

Role smoke probe:

```text
process / direct role load / public API call / effect / result:
exact1 / exact3 / exact0 / exact0 / VALID

program raw SHA-256:
905d0a01bea1549228074c9401d95d39638820a9853cbbfebdcbe2227d95ef6e

logical argv SHA-256:
54de47a143deac47aab621c5d79314312ccaf149ad3a23ed4ab60a4cf7638a7b

ordered role-paths SHA-256:
e01f5e587ba1884b988075eee1c162454d3a6a1d4b10febc3b7111c2b5c1b248
```

The owner, independent verifier, and parent current modules were loaded from
their explicit fixed source paths.  Required public callables were
introspected only; none was invoked.  Raw stdout/stderr, exception bodies,
package bodies, and secrets are excluded.

## 4. Strict observation and verdict

```text
readiness observation object count:
exact10

readiness observation SHA-256:
c74148950138ac2a4c3897d9d93bc071f3a01f764b6e16d3885f21eeee3d1a45

owner verdict / reason:
VALID / ALL_CHECKS_EQUAL

independent verdict / reason:
VALID / ALL_CHECKS_EQUAL

failure class / stage / safe code:
NONE / NONE / NONE

receipt state:
RUNTIME_READY
```

Each role canonicalized the same exact10 observation independently.  Neither
verdict consumed the other.  All required counters and immutable identities
equalled the frozen Design.

## 5. Published Result and Receipt

Result:

```text
path:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_LockDerivedExact5_TestRunnerRuntimeReadiness_Result_20260731.md

commit / tree / blob / raw SHA-256 / bytes / lines:
886fc2074962e591f3f8c85492f0f8abe463c30a
58aacfe760bb0e3eb5e80e1b227d5e99612c174a
016e8eb969c336166eeff4d47219e7ec1370378b
adabfcb10d99f793f4ca40b92620f5d1d2e1986f5c17f9bd7b6b9fa70375c993
11256 / 342
```

Body-free Receipt:

```text
path:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_LockDerivedExact5_TestRunnerRuntimeReadiness_BodyFree_Receipt_20260731.json

commit / tree / blob / raw SHA-256 / bytes:
87dff10e3ff95279aa840bdee287c1e6f06866de
869a1a127e338a0aeaffdc18054cae40d5875391
871830720cdd387f60aca67b638b77b5ee32d52a
655be3c6be3f240218b1cdc6084f5847c6cf7ff246c4359fcf08e3eefec3b265
6535

delete-self logical SHA-256:
89d463cf7600170f912b194db687faa9e1a6569b2c913f51c1f0e452087040f4
```

Both targets are exact-content postfetch equal.  The Receipt is canonical
compact key-sorted UTF-8 JSON plus one LF and does not contain its own
publication identity.

## 6. Publication and responsibility boundary

The approved sequence is:

```text
Result -> Receipt -> this Handoff -> Plan append -> latest snapshot append
```

Each write changes one approved path.  Final credit requires aggregate unique
changed-path exact5, all final target bytes postfetch equal, and byte-identical
Plan/latest prefixes.

Three read-only audit lanes checked the receipt/document contract,
materialization identity algorithm, and role-smoke import boundary.  They
made no repository edit, commit, GitHub write, package acquisition, probe,
pytest invocation, or repository-module import.  Karen fixed the authority,
performed and rechecked the runtime work, made every write, and retains final
judgment.

## 7. Product and later-stage boundary

```text
Cocolon documentation:
NEW exact3 / MODIFY append-only exact2

mashos-api production / test / fixture / dependency / config / lock change:
exact0 / exact0 / exact0 / exact0 / exact0 / exact0

product runtime / Readiness / Failure / Reservation / Attempt / formal exact134:
exact0 / exact0 / exact0 / exact0 / exact0 / exact0

Reference / OA / Candidate / Event1 / source lock:
exact0 / exact0 / exact0 / exact0 / false
```

The runner is a retained session-local test tool, not a product artifact.  It
may support a later R1 only while its full-root, installed-file,
distribution-closure, runtime-root, and executable identities all rederive
equal.  Loss, mutation, added entries, control metadata change, interpreter
switch, or rematerialization expires eligibility.

## 8. Confirmed facts, inference, and Karen's opinion

### 8.1 Confirmed facts

- exact5 hash-gated input was obtained through one configured-route access;
- materialization and both probes were VALID at the frozen cardinalities;
- owner and independent runtime identities matched before and after probes;
- D1 import/collection/execution, challenge, live remote, and O01–O08 are all
  exact0; and
- Result and Receipt are published and postfetch equal.

### 8.2 Inference

The known pytest-launcher gap is closed for the retained runtime.  No D1
semantic outcome can be inferred from the readiness probes.

### 8.3 華恋の意見

次のexact8を同じruntimeで一度だけ行える準備は整いました。ただし、R0のGREENを
D1のGREENとして扱ってはいけません。credited Receiptと保持runtimeを先に別Designで
結び、fresh challenge・actual-Git exact1・retry exact0の実行authorityを明確にして
から、その一回だけを承認対象にするのが妥当です。

## 9. Exactly one next authority and stop

```text
next authority:
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_V5_TEST_RUNNER_RUNTIME_READY_CREDITED_POSTVERIFIED_SAME_RETAINED_RUNTIME_ROOT_IDENTITY_AND_EXECUTABLE_HASH_REDERIVATION_FRESH_CHALLENGE_FULL_EXACT8_ONE_SHOT_LIVE_REMOTE_MAIN_ACQUISITION_EXACT1_ADDITIONAL_QUERY_RETRY_FALLBACK_PRIOR_RUN_REUSE_REMATERIALIZATION_INTERPRETER_SWITCH_EXACT0_DISTINCT_R1_AUTHORITY_BINDING_DESIGN_READ_ONLY_AND_POSTVERIFICATION_ONLY

state:
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED

concrete successor token count:
exact1

R1 execution authority token count:
exact0

automatic progression:
false
```

The next authority is Design-only.  It binds the credited R0 Receipt and
retained runtime identity and defines the concrete R1 one-shot; it does not
execute pytest or acquire live remote-main evidence.

Required stop:

```text
RECOVERY_EPOCH004_D1_V5_PUBLISHED_RETAINED_R0_LOCK_DERIVED_EXACT5_INPUT_HASH_VERIFIED_MATERIALIZATION_EXACT1_PYTEST_PROBE_EXACT1_VALID_ROLE_SMOKE_EXACT1_DIRECT_ROLE_LOAD_EXACT3_VALID_OWNER_INDEPENDENT_RUNTIME_IDENTITY_EQUAL_RUNTIME_READY_D1_TARGET_IMPORT_COLLECTION_EXECUTION_CHALLENGE_LIVE_REMOTE_O01_O08_EXACT0_R1_EXECUTION_UNISSUED_REFERENCE_OPERATIONAL_ADMISSION_BLOCKED_AUTOMATIC_PROGRESSION_FALSE_AUTHORITY_STOP
```
