---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch003_post_d2_remediation_d1_actual_unclassified_import_exact3_and_versioned_current_strict_preflight_connection_causal_red_freeze_only_result
title: "NLS v3 Step 11 Cycle001 Recovery Epoch003 post-D2 remediation D1 causal RED freeze-only result"
recorded_on_jst: "2026-07-29"
body_free: true
automatic_progression: false
---

# Recovery Epoch003 post-D2 remediation D1 causal RED freeze-only result

## 1. Authority and boundary

Mash explicitly approved:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_POST_P0_PARENT_ADDENDUM_POST_D2_REMEDIATION_D1_ACTUAL_UNCLASSIFIED_IMPORT_EXACT3_AND_VERSIONED_CURRENT_STRICT_PREFLIGHT_CONNECTION_CAUSAL_RED_FREEZE_ONLY
```

This authority permits only:

1. one new causal-RED test path in mashos-api;
2. pre-execution freezing of its complete node denominator, identities, and
   commands;
3. collect-only and execution of that exact path;
4. byte/hash verification, without execution, of the existing frozen exact3;
5. read-only independent inspection; and
6. bounded publication of that test and the body-free Cocolon evidence set.

It does not permit production, existing-test, fixture, proof, lock, or
registry changes; scanner weakening; name-specific exceptions; runtime
materialization; publication of reference observation, OperationalAdmission,
Candidate, Event1, Readiness, or Failure; Reservation, Attempt, formal
exact134, source-baseline lock, P2, Product Read, Cycle001 acceptance,
remediation implementation, GREEN, final issuance, or automatic progression.

## 2. 確認済み事実

### 2.1 Fixed entry and predecessor

```text
Cocolon entry:
3267a4028e116d071f729126428cdc2309393dcb

mashos-api entry commit / tree:
32efb22cd1843d2d2103f0a981fd3e4be9623dc2
077b9150057f7562f700b6825b23d978276b42a0

entry state:
RECOVERY_EPOCH003_OPERATIONAL_ADMISSION_CONTRACT_D2_TARGETED_GREEN_AUTHORITY_STOP

entry blocker:
BLOCKED_BY_ACTUAL_UNCLASSIFIED_IMPORT_EXACT3_AND_VERSIONED_STRICT_PREFLIGHT_CONNECTION
```

The governing predecessor identities remain:

```text
P0 external identity:
74286b862eeee1663d2758ee18d1e848316da6fc27b12fef38c149c5a2b52f36

Parent Addendum receipt external identity:
e8cc49a4983bb1c7e46948fb92ea605ce8fde7aa3a07926fbf047725e14bbf43

prior D1 RED receipt external identity:
d1897d23f89d8df0fce8fd5591b77aeb3e2832197d1474aa8827b810805c174b

D2 targeted-GREEN receipt external identity:
85dc3b8d64a12fa62f390e1c9ba654162c3f404122d0eb92f949647d6fcb3e30
```

Both repository heads were re-fetched before the first write. No entry drift
was accepted.

### 2.2 New exact1 test publication and frozen identity

Only this mashos-api path was added:

```text
ai/tests/test_emlis_nls_v3_recovery_epoch003_actual_unclassified_import_exact3_and_versioned_current_strict_preflight_connection_red.py
```

Its publication identity is:

```text
repository:
MassyuRed/mashos-api

parent commit:
32efb22cd1843d2d2103f0a981fd3e4be9623dc2

publication commit / tree:
1bcadf0b02e79ba935b01dc4d65c85e0cdd77d2b
4b682b8b5c55d3ad3b82db7da45cf2a971372355

changed paths:
exact1, the new test only

Git blob SHA-1:
f705b5296088c15accc76eb629bac637d16c714a

raw SHA-256:
cda6119f9dc85fd386eb2447f1c85d8e250b973388866dad2fff6855d342311a

bytes / LF lines / trailing LF:
32310 / 962 / true

postfetch:
byte-equal
```

The complete frozen denominator is exact8:

1. `ai/tests/test_emlis_nls_v3_recovery_epoch003_actual_unclassified_import_exact3_and_versioned_current_strict_preflight_connection_red.py::test_m01_owner_actual_head_unclassified_exact3_noncredit_diagnostic`
2. `ai/tests/test_emlis_nls_v3_recovery_epoch003_actual_unclassified_import_exact3_and_versioned_current_strict_preflight_connection_red.py::test_m02_independent_actual_head_unclassified_exact3_noncredit_diagnostic`
3. `ai/tests/test_emlis_nls_v3_recovery_epoch003_actual_unclassified_import_exact3_and_versioned_current_strict_preflight_connection_red.py::test_m03_actual_reachable_import_owner_paths_exact2`
4. `ai/tests/test_emlis_nls_v3_recovery_epoch003_actual_unclassified_import_exact3_and_versioned_current_strict_preflight_connection_red.py::test_m04_green_requires_unmodified_lock_manifest_parity_and_zero_unresolved`
5. `ai/tests/test_emlis_nls_v3_recovery_epoch003_actual_unclassified_import_exact3_and_versioned_current_strict_preflight_connection_red.py::test_p01_versioned_current_strict_api_separated_from_historical`
6. `ai/tests/test_emlis_nls_v3_recovery_epoch003_actual_unclassified_import_exact3_and_versioned_current_strict_preflight_connection_red.py::test_p02_current_preflight_rejects_downgrade_fallback_and_fixture_credit`
7. `ai/tests/test_emlis_nls_v3_recovery_epoch003_actual_unclassified_import_exact3_and_versioned_current_strict_preflight_connection_red.py::test_f01_source_syntax_import_and_identity_drift_fail_closed`
8. `ai/tests/test_emlis_nls_v3_recovery_epoch003_actual_unclassified_import_exact3_and_versioned_current_strict_preflight_connection_red.py::test_z01_all_success_and_failure_branches_keep_effects_zero`

The canonical ordered node-list SHA-256 is:

```text
22c217b28ae1916ac7817dcfa091ea107a85e483ce5959241e44200c6c9a79de
```

The pre-execution freeze record was completed before either pytest
invocation and before any production change:

```text
freeze record SHA-256:
5e760d55daf0e034387344a97de0188424780e69a91e5e16ec260526889441e8

expected initial result:
2 passed / 6 causal failed / 0 collection errors / 0 unexpected errors

production change count:
0
```

### 2.3 Authoritative pytest selection and causal RED

The only authoritative collect command was:

```text
env -u PYTEST_ADDOPTS -u PYTEST_PLUGINS -u PYTHONPATH \
  PYTHONDONTWRITEBYTECODE=1 \
  PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 \
  LANG=C.UTF-8 LC_ALL=C.UTF-8 \
  /tmp/nlsv3_d1_pytest_runner/bin/python -m pytest \
  --noconftest -p no:cacheprovider --collect-only -q \
  ai/tests/test_emlis_nls_v3_recovery_epoch003_actual_unclassified_import_exact3_and_versioned_current_strict_preflight_connection_red.py
```

Its argv SHA-256 and result were:

```text
51bf771a1cb4709cce5d89e4b1f07bed722f612889e404dca93aa41e9ae6672d

exit 0
8 collected
ordered node-list match true
collection / import / unexpected errors:
0 / 0 / 0
elapsed:
0.37s
```

The only authoritative execution command was the same exact path without
`--collect-only`:

```text
env -u PYTEST_ADDOPTS -u PYTEST_PLUGINS -u PYTHONPATH \
  PYTHONDONTWRITEBYTECODE=1 \
  PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 \
  LANG=C.UTF-8 LC_ALL=C.UTF-8 \
  /tmp/nlsv3_d1_pytest_runner/bin/python -m pytest \
  --noconftest -p no:cacheprovider -q \
  ai/tests/test_emlis_nls_v3_recovery_epoch003_actual_unclassified_import_exact3_and_versioned_current_strict_preflight_connection_red.py
```

Its argv SHA-256 and result were:

```text
0868d11bfb575c46e43017ff3bb9ff10970dec0822d1170f12915e11124cf28a

exit 1:
INTENDED_CAUSAL_RED

8 collected / 8 executed
2 passed / 6 causal failed
0 errors / 0 collection errors / 0 unexpected errors
0 skipped / 0 xfailed / 0 xpassed / 0 deselected
elapsed:
70.50s
```

The exact causal failures were:

| Node | Result |
|---|---|
| M01 owner actual-HEAD manifest | `M01_CAUSAL_RED` |
| M02 independent actual-HEAD manifest | `M02_CAUSAL_RED` |
| M04 manifest parity and exact0 gate | `M04_CAUSAL_RED` |
| P01 versioned current-strict separation | `P01_CAUSAL_RED` |
| P02 downgrade/fallback/fixture rejection | `P02_CAUSAL_RED` |
| Z01 complete zero-effect branch contract | `Z01_CAUSAL_RED` |

M03 actual reachable owner-path derivation and F01 fail-closed fault/drift
contract passed.

The ordered outcome and failure-code hashes are:

```text
ordered outcomes SHA-256:
c4cee383301a36212c6148b82ff1d865ad1ff8502c1fb0e7f680308e5654ee76

ordered causal codes SHA-256:
a07e73f611b1675654fe007cf1c527c0e69eb9b577e56506904cebbdfd43a164
```

No other pytest selection was executed in this authority.

### 2.4 Actual import observation

From actual HEAD, the owner and independent verifier were exercised
separately with the untouched lock.

Both first stopped fail-closed at:

```text
UNCLASSIFIED_IMPORT / models
```

Two independent progressive diagnostics used copied, non-authoritative lock
state only to enumerate the complete reachable blocker set. Their credit was
fixed to zero, and the original lock remained unchanged.

The actual reachable unclassified exact3 is:

```text
models
models_updated
self_structure_engine.rules
```

Its ordered SHA-256 is:

```text
5c9eb809ff8d0fd5760238d706428d94fbafe7ea715669ab151b61f988314a25
```

The owner paths are:

| Import | Actual reachable owner path |
|---|---|
| `models` | `ai/services/analysis_engine/self_structure_engine/rules.py` |
| `models_updated` | `ai/services/analysis_engine/self_structure_engine/rules.py` |
| `self_structure_engine.rules` | `ai/services/ai_inference/astor_self_structure_report.py` |

The canonical owner-path mapping SHA-256 is:

```text
9d9ae9545f22fa2a91d0d686d807afff250a81fdf18dd75349369b12af585c1f
```

No allowlist, hard-code, in-memory mapping, mock, or fabricated search root
received credit. The future GREEN gate is frozen as all of:

1. owner manifest derived from actual HEAD with the unmodified lock;
2. independent manifest derived separately under the same conditions;
3. exact equality of the two manifests;
4. reachable unclassified import exact0; and
5. unresolved dynamic import exact0.

Those conditions are not met in this D1.

### 2.5 Versioned current-strict preflight observation

The historical verifier and historical preflight remain present. A private
current-strict verifier exists, but the following frozen public/versioned
surface is absent:

```text
verify_recovery_epoch003_bootstrap_source_runtime_contract_current
execute_recovery_epoch003_current_strict_preflight_v1
execute_recovery_epoch003_current_strict_parent_phase_v1
```

Therefore, historical/current separation is not yet connected. The RED
contract requires the versioned current path to:

1. call the public current-strict verifier, never the historical verifier;
2. remain separate from the historical preflight API;
3. reject payload profile downgrade, historical fallback, and fixture-only
   current credit;
4. connect the parent current API to both the current-strict preflight and
   the current parent phase-evidence validator; and
5. return body-free, fail-closed results with no operational effects.

Historical verifier and preflight source hashes were frozen so that later
implementation cannot obtain GREEN by rewriting their established meaning:

```text
historical verifier source SHA-256:
6479a4d409d2d4971c78caf60067c769fc6308dde87ec60149d13e610a5e100f

historical preflight source SHA-256:
2aa5bc3704ec806046ae817512e5db1171b369b0fa49e395fdc9b28b6ea20109
```

### 2.6 Fail-closed and zero-effect observations

F01 passed the frozen requirement that source `SyntaxError`, unclassified
import, unresolved dynamic import, and commit/tree/clean-state drift reach a
fail-closed result rather than being swallowed.

Z01 remains causal RED because the missing versioned APIs make the complete
success/failure branch contract unreachable. This D1 does not claim that an
unimplemented branch has been verified.

The effects actually produced by this authority are all zero:

```text
reference / operational runtime materialization:
0 / 0

reference observation / OperationalAdmission publication:
0 / 0

runtime / Candidate / Event1 publication:
0 / 0 / 0

Readiness / Failure publication:
0 / 0

Reservation / Attempt / formal exact134:
0 / 0 / 0

source baseline:
UNLOCKED

P2 / Product Read / Cycle001:
NOT_STARTED / NOT_STARTED / NOT_ACCEPTED

automatic progression:
false
```

### 2.7 Post-RED implementation candidate boundary

Only after the actual RED result and call-graph inspection, the candidate
scope was fixed to exact5:

1. `ai/services/analysis_engine/self_structure_engine/rules.py`
2. `ai/services/ai_inference/astor_self_structure_report.py`
3. `ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py`
4. `ai/tools/emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py`
5. `ai/tools/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_preflight.py`

The ordered path SHA-256 is:

```text
2254777eaaa0b5b444d2cc99b377298542b77d5f8c8022f8f5e74d7c92490f77
```

This is a future candidate boundary, not an authorization to edit. No
production path was changed in D1.

### 2.8 Immutable existing evidence

The existing frozen exact3 was not run. Its bytes remained unchanged:

| Path | Git blob SHA-1 | raw SHA-256 | D1 executions |
|---|---|---|---:|
| `ai/tests/test_emlis_nls_v3_recovery_epoch003_operational_admission_contract_red.py` | `cd79f1be2f2321c90deb817c93e75e848ba7d3fe` | `9af99873afd7d77f151e4b6b0a75f350bfc96a1aea781e047f162d1e5379560d` | 0 |
| `ai/tests/test_emlis_nls_v3_recovery_epoch003_bootstrap_source_runtime_expected_observed_contract_red.py` | `dda02f15be90387dd045ef117a5961961e2cae2b` | `8c8fcaf5211064ca59127a8081dc41ae8b9207472f070746c84a8e4b591a07e5` | 0 |
| `ai/tests/test_emlis_nls_v3_recovery_epoch002_retry_lineage_and_formal_worker_bootstrap_reconciliation_red.py` | `6e1f904d91c0e6852b8af66500a0563e20648026` | `70d6db7fe3e9f42c59a01fdba5e73752ba6aa1e7c2c4e6d7bf2581dbd5090ce5` | 0 |

The current-step proof also remained byte-immutable and was not run:

```text
path:
ai/tools/emlis_nls_v3_recovery_epoch002_current_step_proof_run.py

Git blob / raw SHA-256:
ad9e206c0d69b953579dfffea64dbe059ae154bb
6eaece6aa91d4e19b8f30df4c9cc489788e283ce93553e35342e603a2401c261

execution count:
0
```

The D2 production exact6 remained unchanged. Its canonical ordered
`path/raw_sha256` manifest is:

```text
9d12cd9b3497f72c0860c3b08035fd387caee6e8762b4e14ce4cd9060f19b21a
```

### 2.9 Retained non-credit deviation

The earlier unauthorized selection remains recorded:

```text
ai/tests/test_emlis_nls_v3_recovery_epoch002_post_d2_success_owner_graph_and_formal_parent_continuation_red.py
```

Its observed `64 failed` receives:

```text
authorized-selection credit:
0

D2 GREEN credit:
0

operational credit:
0

rerun in this D1:
0

concealment or test rewrite:
0
```

It was neither hidden nor reused as evidence for this D1.

### 2.10 Independent read-only inspection

Three read-only subagent lanes independently inspected:

1. actual owner/independent import reachability and owner paths;
2. versioned current-strict and parent call-graph requirements; and
3. the closed body-free evidence schema and immutable-input accounting.

They performed:

```text
edits / pytest executions / commits / GitHub writes:
0 / 0 / 0 / 0
```

Karen reconciled the findings, made the sole test edit, performed both
authorized pytest invocations, made every GitHub write, and completed the
postfetch checks.

## 3. 推測

The agreement between the owner and independent non-credit diagnostics, the
M03 owner-path pass, and the untouched-lock first stop strongly supports
that the exact3 is an actual reachability/classification gap rather than a
test-fixture artifact.

The P01/P02 failures and inspected call graph support the exact3 tool paths
as the narrow current-strict connection candidates. This is a bounded
implementation hypothesis; D1 does not claim those edits will be sufficient
until a separately approved remediation implements and re-runs the frozen
test.

## 4. 華恋の意見

This causal RED should be frozen as the honest current result. It would be
incorrect to grant GREEN or operational credit, to special-case the three
names, or to route the current contract through the historical API.

The necessary next action is a separate, explicit approval for remediation
implementation and this exact test's targeted GREEN. Even after GREEN,
Karen should stop again and require postverified evidence before Mash
separately approves final issuance.

## 5. Authority stop

```text
state:
RECOVERY_EPOCH003_POST_D2_REMEDIATION_D1_CAUSAL_RED_FROZEN_IMPLEMENTATION_NOT_AUTHORIZED_AUTHORITY_STOP

remediation implementation:
NOT_AUTHORIZED

targeted GREEN:
NOT_AUTHORIZED

final issuance:
NOT_AUTHORIZED

automatic progression:
false
```
