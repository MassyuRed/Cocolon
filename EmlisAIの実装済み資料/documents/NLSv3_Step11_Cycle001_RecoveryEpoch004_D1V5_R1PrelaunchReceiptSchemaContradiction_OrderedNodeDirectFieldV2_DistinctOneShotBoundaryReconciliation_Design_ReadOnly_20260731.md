---
title: Cocolon EmlisAI NLS v3 Step11 Cycle001 Recovery Epoch004 D1 v5 R1 prelaunch Receipt schema contradiction / ordered-node direct field v2 / distinct one-shot boundary reconciliation Design (Read-Only)
date: 2026-07-31
status: DESIGN_ONLY_POSTVERIFICATION_REQUIRED
authority_kind: DESIGN_ONLY
automatic_progression: false
---

# 0. Authority and conclusion

## 0.1 Approved authority

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_V5_R1_ROOTDIR_CORRECTED_ONE_SHOT_PRELAUNCH_RECEIPT_SCHEMA_CONTRACT_UNSATISFIABLE_ORDERED_NODE_LIST_SHA256_MANDATORY_BUT_UNALLOCATED_TOP_EXACT16_EXECUTION_OBSERVATION_EXACT11_EXACT8_EXACT6_KEYSET_CONTRADICTION_PYTEST_INVOCATION_CHALLENGE_REMOTE_O01_O08_EXACT0_CURRENT_AUTHORITY_CONSUMPTION_BOUNDARY_AND_DISTINCT_SUCCESSOR_ONE_SHOT_RECEIPT_SCHEMA_RECONCILIATION_DESIGN_READ_ONLY_AND_POSTVERIFICATION_ONLY
```

Mash approved design only.  This authority may reconcile the contradiction,
close the unexecuted predecessor one-shot, freeze one distinct schema-v2
successor, and publish the Cocolon Design exact5.  It may not invoke pytest,
import or collect D1, create a challenge, observe remote main for the D1 run,
evaluate O01--O08, modify mashos-api, or advance automatically.

## 0.2 Conclusion

The predecessor Design simultaneously required its future Result and Receipt
to directly record ordered-node SHA-256
`e2661d946c060efc44ce7da06f8c55f51d10dfad2af4f5f0526bd38109c340bc`
and froze a Receipt keyset with no field able to hold that value.  The future
Receipt top level was exact16, `execution_observation` exact11, and its
`exact8` object exact6.  None of those keysets allocated
`ordered_node_list_sha256`.

Adding the field under schema v1 violates its frozen exact keyset.  Omitting
the field violates the direct-recording requirement.  A credited v1 execution
Receipt therefore was not constructible.  This is a prelaunch blocker, not a
pytest result and not a reason to weaken D1.

The minimal reconciliation is:

1. retain the top exact16 and `execution_observation` exact11;
2. preserve every other nested keyset and semantic rule;
3. change only `exact8` from exact6 to exact7 by adding the direct field
   `ordered_node_list_sha256`;
4. bump the future execution Receipt schema from v1 to v2;
5. require the same direct literal in the future Result;
6. close the approved predecessor one-shot as consumed at the authority-token
   boundary but unexecuted at the pytest-process boundary; and
7. define exactly one distinct inactive schema-v2 successor which requires
   separate Mash approval.

No historical Design, Receipt, Result, or snapshot is rewritten.

# 1. Governing evidence and fixed checkpoints

## 1.1 Governing order

This Design was interpreted under, in order:

1. Mash's exact approval and its Design-only/zero-execution boundary;
2. `Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt`;
3. `Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt`;
4. `Cocolon_前提資料/14_cocolon_joint_development_and_karen_thought_boundary.txt`;
5. `Cocolon_前提資料/15_trust_based_joint_development_boundary_2026_06_05.txt`;
6. `Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md`;
7. `Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md`;
8. the current GitHub main files, not a local copy as authority;
9. the attached NLSv3 detailed design, execution/closure plan, and long-term
   roadmap as context; and
10. the predecessor rootdir/launcher reconciliation Design and its exact5.

Facts, inference, and Karen's opinion are separated in section 10.

## 1.2 Cocolon entry checkpoint

GitHub main was re-fetched before drafting:

```text
repository:
MassyuRed/Cocolon

entry commit:
49dbcb48e540344d292a14da47c80d424c94ca28

entry tree:
c30e2c7459c0ddb1618c074cc97254b925c54119
```

The directly governing predecessor Design checkpoint is:

```text
Design path:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_R1NodeIdPrefixNoncredit_ExplicitFixedRootdirLauncherCanonicalization_NewOneShotBoundaryReconciliation_Design_ReadOnly_20260731.md

Design blob / raw SHA-256:
8e667880adb27a831e0af98b199a7b77c33d779d
c720b1bb5c7f5868e2e24af13159ec3020de61fb118119c526dbe90cf57f0f6e

Design Receipt path:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_R1NodeIdPrefixNoncredit_ExplicitFixedRootdirLauncherCanonicalization_NewOneShotBoundaryReconciliation_Design_ReadOnly_BodyFree_Receipt_20260731.json

Receipt blob / raw / delete-self logical SHA-256:
c357ad159a185b086034ab18909c8fe6759c5150
bd401ed633221f5aa5dd0b0059515867124eb371d564223ab1a0618a4d91502f
2dcc424b08c4f77f80d87e9ea495fb6c45ce0139ed12ffa2043542a0607bd6a2

predecessor Design state:
RECOVERY_EPOCH004_D1_V5_R1_PRIOR_NODEID_PREFIX_NONCREDIT_CLOSED_EXPLICIT_FIXED_SOURCE_ROOTDIR_STATIC_CONTRACT_RECONCILED_DISTINCT_ROOTDIR_CORRECTED_ONE_SHOT_DEFINED_INACTIVE_PYTEST_CHALLENGE_REMOTE_O01_O08_EXACT0_CORRECTED_D2_STABILITY_REFERENCE_OPERATIONAL_ADMISSION_BLOCKED_AUTOMATIC_PROGRESSION_FALSE_AUTHORITY_STOP
```

The predecessor Design is historical evidence.  Its v1 future schema remains
byte-preserved and is superseded only for a new successor.  It is not edited.

The entry append-only files are:

```text
Execution and Closure Plan:
blob e44c1343fb2939713f2e3ba253c0638d7ab8f815
raw  58ce149ba11566c32665fd2a9070b1292cde896803ef659fe9ca2b3791e2a4ca
bytes 389335
lines 11297

latest snapshot:
blob 78b27c65aa9613d9d570be9797de9c90a1c74f43
raw  b9d72272cf06b265dc361c0b07c305b97a4971c66e1a336e32a98a6d37254bbf
bytes 1591104
lines 31468
```

Both byte sequences are immutable prefixes for this authority.

## 1.3 Fixed mashos-api source

GitHub main and the two fixed files were re-fetched equal:

```text
repository:
MassyuRed/mashos-api

commit / tree / clean:
37eee88c431d1af3f8d2e96f9b0dd8b3d3bc327f
3891b84164ba0063136e47beb93d36798587a568
true

D1 path:
ai/tests/test_emlis_nls_v3_recovery_epoch004_operational_admission_v2_event1_connection_actual_git_identity_parent_phase3_red.py

D1 blob / raw SHA-256:
c0eb936690a3423ac4615a9aabb37c40cc257324
3536b8a838ffe2ccbe29db69e9c5400c719de8e63ddf83da9ea0f83b94f17d14

lock path:
ai/configs/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_lock_v1.json

lock blob / raw / delete-self logical SHA-256:
0822fcb010985cd0d384f250a9e8a1fe16dc8fd4
9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787
801ba54efc0f6655238d14e7c153fb70b555801489aa8ba028515fc64d9c05f4
```

This Design changes none of those files.

# 2. The prelaunch contradiction

## 2.1 Frozen requirements

The predecessor Design section 8.1 required both the future Result and Receipt
to record the ordered-node SHA-256.  Section 8.1.1 then froze:

| Projection | Frozen count | Field available for the ordered-node hash |
|---|---:|---|
| Receipt top level | exact16 | no |
| `execution_observation` | exact11 | no |
| `execution_observation.exact8` | exact6 | no |
| every other nested keyset | frozen | no |

The old `exact8` exact6 was exactly:

```text
collected_count
executed_count
failed_count
passed_count
error_count
ordered_results
```

`credited_design_checkpoint` committed to the predecessor Design Receipt, but
that is an identity reference to a past artifact.  It neither allocates a
field in the future execution Receipt nor directly records the ordered-node
hash in that Receipt's canonical preimage.

## 2.2 Satisfiability proof

There are only two candidate constructions under v1:

| Candidate | Direct-record requirement | Frozen keyset | Credit |
|---|---|---|---|
| omit `ordered_node_list_sha256` | violated | satisfied | impossible |
| add `ordered_node_list_sha256` | satisfied | violated | impossible |

Therefore:

```text
v1 credited Receipt construction count:
exact0

contradiction blocker count:
exact1

safe point of discovery:
PRELAUNCH_BEFORE_PYTEST_PROCESS_START
```

The contradiction was found after static/local prelaunch preparation and
before framework entry.  No favorable or unfavorable pytest result exists.
Launching and later inventing a nonconforming Receipt would have broken the
predefined evidence boundary; launching without any credit-capable Receipt
would have consumed a one-shot for an authority that could never close with
valid evidence.  Stopping was required.

# 3. Current authority consumption and closure boundary

## 3.1 Approved execution authority disposition

The predecessor execution authority was explicitly approved and its prelaunch
work began.  Its authority identity is therefore consumed and must not be
reopened.  Its pytest-process budget, however, was never exercised.

The exact historical consumed execution token is:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_V5_R1_ROOTDIR_CORRECTED_DISTINCT_ONE_SHOT_PRIOR_R1_NODEID_SETUP_NONCREDIT_CLOSED_SAME_RETAINED_RUNTIME_IDENTITY_AND_EXECUTABLE_HASH_REDERIVED_EMPTY_NONREPO_CWD_EXPLICIT_FIXED_SOURCE_ROOTDIR_REPOSITORY_RELATIVE_ORDERED_NODEID_FULL_EXACT8_PYTEST_INVOCATION_EXACT1_FRESH_CHALLENGE_ELIGIBLE_ACTUAL_GIT_REMOTE_MAIN_ACQUISITION_EXACT1_GUARDED_ADDITIONAL_ROLE_HARNESS_QUERY_REQUEST_DETECTION_POSITIVE_PROCESS_NETWORK_EXECUTION_EXACT0_RETRY_FALLBACK_PRIOR_RUN_REUSE_REMATERIALIZATION_INTERPRETER_SWITCH_EXACT0_O01_O07_CAUSAL_RED_O08_GREEN_V1_INVARIANCE_CLOSURE_EXACT1_OR_TYPED_NONCREDIT_STOP_AND_POSTVERIFICATION_ONLY
```

It is historical and closed.  It is not counted among the exact1 concrete
successor token values in section 6.1.

These two layers are distinct:

```text
authority approval count:
exact1

prelaunch entry count:
exact1

authority close count:
exact1

authority token reusable:
false

pytest invocation count:
exact0

pytest process budget consumed count:
exact0

pytest process budget transferable or reusable:
false
```

An unconsumed process count does not keep an approved token alive after its
contract is proved unsatisfiable.  Reusing the token with a new Receipt schema
would silently change an already-approved authority.  The corrected run must
therefore use a distinct token and a separate approval.

## 3.2 Terminal state

The closed predecessor execution authority receives the following design
disposition, not a fabricated member of its old exact12 runtime-result enum:

```text
R1_SCHEMA_V1_PRELAUNCH_RECEIPT_CONTRACT_UNSATISFIABLE_AUTHORITY_CLOSED_CONSUMED_UNEXECUTED_NO_PYTEST_NO_RERUN
```

This disposition lives in this Design checkpoint.  No predecessor execution
Result or execution Receipt is created because its frozen Receipt contract is
the object proved unsatisfiable.  Publishing an execution Receipt under that
schema would contradict the finding.

Exact effects of the closed authority are:

```text
execution Result publication:
exact0

execution Receipt publication:
exact0

Handoff / Plan / snapshot execution-result publication:
exact0 / exact0 / exact0

pytest / framework entry / import / collection:
exact0 / exact0 / exact0 / exact0

challenge / eligible live remote / additional remote execution:
exact0 / exact0 / exact0

O01--O08 / closure:
exact0 / exact0

retry / fallback / prior-run reuse:
exact0 / exact0 / exact0
```

# 4. Runtime-readiness boundary

## 4.1 Retained evidence

The retained runtime had a credited postverified R0 readiness checkpoint.  Its
expected identities remain:

```text
runner projection SHA-256:
f501025c1dccef68c47c0a3e52f3ef74d01233f371b16f2b1a0bdfb21089e57e

accepted-wheel manifest SHA-256:
00d2df98c8cda7f1473794892bafe7ccd18cc816c79ccb346f3e21ff629b136d

distribution closure SHA-256:
4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c

installed-file manifest SHA-256:
0eba095e4c173b4b69f68532fd66cf2c871ab9edef64d91754b52ed7daee15c5

full-runtime-root manifest SHA-256:
55e12965e1be85424b39aa38dd6ae454b6ee9aef9d86e0c42c565a9a494a578d

runtime-root identity SHA-256:
e0b4750c02c676e1fa717cd4fe1f216fb1af4babcfa297abd7b3508995bcf19f

interpreter executable SHA-256:
9ed008e5a8685235361f0c53771b520ab082dd99a877ad2fd796a93fa4c0b488
```

The full-root entry count was 527, installed-file rows 482, distribution and
RECORD closure counts 5 and 5, with unowned importables and unexpected entries
both exact0.  Rootdir, logical argv, environment, ordered-node, and expected
vector identities were also statically rederived before the blocked launch:

```text
rootdir binding bytes / SHA-256:
601 /
c8a56dfaa93db8b31b4908baa0e8b7a9a4bcc6f38d18a83e5f6a6d4635da2aef

corrected logical argv bytes / SHA-256:
319 /
45d1b95d0327423969e6383335795dac8911656717025f0d5f9a9151c1dc2e4e

environment-policy SHA-256:
6393dea280af670e3b0ed902014c86fc65a6666e973fe8e7ee50318ff1a11591

ordered-node-list SHA-256:
e2661d946c060efc44ce7da06f8c55f51d10dfad2af4f5f0526bd38109c340bc

expected-vector SHA-256:
da9d266a254a12a655d4dd9388ccd3e866a57455ff98254e119571f8b824055b
```

## 4.2 What readiness does and does not mean

These are retained past facts, not a guarantee that a later approved process
still sees the same bytes.  This Design performs no materialization,
rematerialization, package acquisition, import, collection, or runner switch.

The successor must re-fetch GitHub source and independently rederive every
exact7 runtime identity, the executable hash, rootdir binding, environment
policy, logical argv, ordered-node list, and expected vector immediately
before launch.  Mutation, absence, mismatch, or ambiguity stops before pytest.
No repair, alternate runtime, generic interpreter lookup, rematerialization,
or interpreter switch is allowed under that successor.

Thus the runtime-readiness state after this Design is:

```text
RETAINED_RUNTIME_PREVIOUSLY_READY_CURRENT_SUCCESSOR_READINESS_REQUIRES_FRESH_REDERIVATION
```

# 5. Minimal future Receipt schema reconciliation

## 5.1 Schema version and invariant counts

The old future schema remains historical and is not credit eligible:

```text
cocolon.emlis.nls_v3.step11.cycle001.recovery_epoch004.d1_v5.r1_rootdir_corrected_exact8_one_shot_receipt.v1
```

The only credit-capable schema for the distinct successor is:

```text
cocolon.emlis.nls_v3.step11.cycle001.recovery_epoch004.d1_v5.r1_rootdir_corrected_exact8_one_shot_receipt.v2
```

The corrected counts are:

```text
top level:
exact16 unchanged

execution_observation:
exact11 unchanged

execution_observation.exact8:
exact7 corrected from exact6

all other nested keysets:
unchanged
```

The corrected `exact8` exact7 is exactly:

```text
ordered_node_list_sha256
collected_count
executed_count
failed_count
passed_count
error_count
ordered_results
```

In documentation order, the direct identity field appears first.  Compact
sorted-key JSON canonicalization remains key-sorted, so prose order does not
alter the preimage.

## 5.2 Direct-field semantics

`ordered_node_list_sha256` is always the exact string:

```text
e2661d946c060efc44ce7da06f8c55f51d10dfad2af4f5f0526bd38109c340bc
```

It records the frozen ordered-node contract identity, not a runtime result,
not a prior-run node-id observation, and not raw node IDs.  It is populated at
every stage, including prelaunch and not-reached projections.  Counts and
`ordered_results` remain observations and must never be filled from this
expected identity.

Before launch, OWNER and INDEPENDENT_VERIFIER each independently derive the
ordered list from the fixed D1 source and canonical rule.  The exact7 field is
present even in a non-credit prelaunch projection; launch or credit eligibility
is admitted only when both independent derivations equal the fixed value.
Either unavailable or unequal derivation fails the existing
`PRELAUNCH_LAUNCHER_CHECK` with result class
`R1_LAUNCHER_OR_ENVIRONMENT_IDENTITY_INVALID_NONCREDIT_STOP`; the exact12
runtime-result enum is not expanded.

For a future credit result:

- Result Markdown directly includes the full literal and states owner and
  independent equality;
- Receipt `execution_observation.exact8.ordered_node_list_sha256` contains the
  same full literal;
- `execution_observation_sha256` includes that exact7 object;
- Receipt delete-self hashing includes the resulting observation hash; and
- old schema v1, missing field, extra field, wrong field, wrong value, or
  different stage projection is non-credit and stops without a rerun.

## 5.3 Complete v2 top and observation keysets

The v2 Receipt top level remains exact16:

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

`execution_observation` remains exact11:

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

The unchanged nested keysets are repeated to remove inheritance ambiguity:

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

exact8 exact7:
ordered_node_list_sha256, collected_count, executed_count, failed_count,
passed_count, error_count, ordered_results

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

Every nested enum, exact12 result class, failure mapping, nullable projection,
process-stream rule, count rule, timeout rule, and safe body-free restriction
from the predecessor Design remains unchanged except where this Design
explicitly changes schema version and `exact8` keyset.  The distinct successor
also rebinds the identity-bearing top projections; they are not inherited from
the old authority:

```text
authority_token:
the exact distinct successor token in section 6.1

credited_design_checkpoint:
the final postverified commit/tree and Body-free Receipt identity of this
reconciliation Design exact5

result_publication:
the new schema-v2 Result path in section 7 and its actual postfetched
publication identity

repository_scope.cocolon_paths:
the ordered new schema-v2 exact5 path list in section 7
```

The `credited_design_checkpoint` exact7, `result_publication` exact8,
`repository_scope` exact5, owner/independent verdicts, failure exact3,
`zero_effects` exact8, and other top-level keysets retain their predecessor
key counts and meanings while carrying these successor-specific identities.

## 5.4 Canonicalization and deterministic stage projections

`execution_observation_sha256` remains SHA-256 of compact sorted-key UTF-8 JSON
of the exact `execution_observation` object with no trailing LF.  The Receipt
`receipt_sha256` remains SHA-256 of compact sorted-key UTF-8 JSON after deleting
only top-level `receipt_sha256`, with no trailing LF.  The stored Receipt is
compact sorted-key UTF-8 JSON plus exactly one trailing LF.

At every stage from `PRELAUNCH_SOURCE_CHECK` through `RESULT_PARSE`, the
`exact8` object is exact7 and the direct hash is populated with the fixed
literal.  The remaining exact6 members retain the predecessor deterministic
zero/empty/not-reached projections.  In particular:

```text
before process start:
ordered_node_list_sha256 = e2661d946c060efc44ce7da06f8c55f51d10dfad2af4f5f0526bd38109c340bc
collected_count = 0
executed_count = 0
failed_count = 0
passed_count = 0
error_count = 0
ordered_results = []
```

After process start, only safely parsed observation values may change the six
observation members.  The fixed hash never supplies collection or outcome
evidence.  `prior_nodeid_reuse_count` remains exact0 for all result classes.

# 6. Distinct successor one-shot boundary

## 6.1 Exactly one next authority

This Design defines exactly one concrete successor token:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_V5_R1_ROOTDIR_CORRECTED_SCHEMA_V1_PRELAUNCH_CONTRACT_UNSATISFIABLE_AUTHORITY_CLOSED_CONSUMED_UNEXECUTED_PYTEST_EXACT0_DISTINCT_SCHEMA_V2_ONE_SHOT_SAME_RETAINED_RUNTIME_IDENTITY_AND_EXECUTABLE_HASH_REDERIVED_EMPTY_NONREPO_CWD_EXPLICIT_FIXED_SOURCE_ROOTDIR_REPOSITORY_RELATIVE_ORDERED_NODE_LIST_SHA256_DIRECT_RECEIPT_FIELD_FULL_EXACT8_PYTEST_INVOCATION_EXACT1_FRESH_CHALLENGE_ELIGIBLE_ACTUAL_GIT_REMOTE_MAIN_ACQUISITION_EXACT1_GUARDED_ADDITIONAL_ROLE_HARNESS_QUERY_REQUEST_DETECTION_POSITIVE_PROCESS_NETWORK_EXECUTION_EXACT0_RETRY_FALLBACK_PRIOR_RUN_REUSE_REMATERIALIZATION_INTERPRETER_SWITCH_EXACT0_O01_O07_CAUSAL_RED_O08_GREEN_V1_INVARIANCE_CLOSURE_EXACT1_OR_TYPED_NONCREDIT_STOP_AND_POSTVERIFICATION_ONLY
```

Its state is:

```text
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED
```

```text
concrete successor unique token value count:
exact1
```

Automatic progression is false.  This Design does not activate or execute it.

## 6.2 Successor prelaunch gates

After separate approval, the successor must, in order:

1. re-fetch the then-current GitHub `main` identities and require Cocolon to
   equal this reconciliation's final credited Design checkpoint, while
   mashos-api must equal fixed commit/tree
   `37eee88c431d1af3f8d2e96f9b0dd8b3d3bc327f` /
   `3891b84164ba0063136e47beb93d36798587a568`, or stop;
2. prove the retained runtime root has not mutated by independent exact7 and
   executable-hash rederivation;
3. prove fixed rootdir, environment policy, logical argv, and ordered-node
   list identities independently;
4. materialize the v2 Receipt projections for every reachable stage and prove
   top exact16, observation exact11, and `exact8` exact7 before process start;
5. require the direct ordered-node field in both future Result and Receipt;
6. enter an empty non-repository cwd and use the one fixed interpreter with
   explicit fixed-source `--rootdir` and repository-relative ordered node IDs;
7. invoke pytest at most once; and
8. accept either the exact credited vector or one typed non-credit stop, with
   no same-authority retry.

Any source, runtime, schema, rootdir, environment, command, or ordered-node
failure stops before pytest.  No prelaunch failure may consume a challenge or
remote observation.

## 6.3 Successor one-shot budgets

If and only if every prelaunch gate passes:

```text
pytest invocation:
exact1 maximum

fresh challenge creation:
exact1 when reached

eligible neutral actual-Git remote-main acquisition:
exact1 when reached

additional owner / independent / parent / harness process-network execution:
exact0

retry / fallback / prior-run reuse / prior-output reuse:
exact0 / exact0 / exact0 / exact0

prior node-id / challenge / observation reuse:
exact0 / exact0 / exact0

rematerialization / interpreter switch:
exact0 / exact0
```

The same immutable acquired observation is shared among roles, while OWNER and
INDEPENDENT_VERIFIER independently rederive their semantic verdicts.  Guarded
additional-query request detection must be positive for frozen lanes, but
additional process/network execution remains exact0.

Credit requires O01--O07 exact causal RED, O08 `GREEN_V1_INVARIANCE`, exact8
ordered closure, source equality, role-independent agreement, and closure
exact1.  Any other finite or unknown outcome is non-credit and stops.

# 7. Future execution publication contract

The distinct successor, if separately approved and actually observed, may
publish only this new exact5:

```text
NEW exact3:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_R1RootdirCorrected_SchemaV2_DistinctOneShot_SameRetainedRuntime_FreshChallenge_Exact8OneShot_Result_20260731.md
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_R1RootdirCorrected_SchemaV2_DistinctOneShot_SameRetainedRuntime_FreshChallenge_Exact8OneShot_BodyFree_Receipt_20260731.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_R1RootdirCorrected_SchemaV2_DistinctOneShot_SameRetainedRuntime_FreshChallenge_Exact8OneShot_Handoff_20260731.md

MODIFY append-only exact2:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md
Cocolon_前提資料/07_latest_snapshot_diff.md
```

The old v1 future artifact names remain unused exact0 and cannot be substituted.
Publication order is Result, Receipt, Handoff, Plan append, snapshot append,
each in one single-path commit with exact-content postfetch.  The final
aggregate unique changed-path set must be exact5, both old prefixes must be
byte-equal, and all final paths must be reachable from main.

The successor still changes mashos-api exact0 and production/test/config/lock
exact0.  A non-credit observation may publish the same exact5 only after the
typed terminal is complete and body-free.  If evidence is incomplete or the
Receipt schema cannot be satisfied, it stops without publication and without
retry.

# 8. Current Design-only publication contract

## 8.1 Cocolon exact5

This approved Design publishes only:

```text
NEW exact3:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_R1PrelaunchReceiptSchemaContradiction_OrderedNodeDirectFieldV2_DistinctOneShotBoundaryReconciliation_Design_ReadOnly_20260731.md
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_R1PrelaunchReceiptSchemaContradiction_OrderedNodeDirectFieldV2_DistinctOneShotBoundaryReconciliation_Design_ReadOnly_BodyFree_Receipt_20260731.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_R1PrelaunchReceiptSchemaContradiction_OrderedNodeDirectFieldV2_DistinctOneShotBoundaryReconciliation_Design_ReadOnly_Handoff_20260731.md

MODIFY append-only exact2:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md
Cocolon_前提資料/07_latest_snapshot_diff.md
```

Publication order is Design, Body-free Receipt, Handoff, Plan append, latest
snapshot append.  Each commit changes one approved path.  The Design Receipt
binds the published Design; Handoff binds Design and Receipt; Plan binds the
published exact3; snapshot binds the published exact4.  The final snapshot is
the exact5 postverification target.

## 8.2 Current Body-free Design Receipt schema

The current Design Receipt top level is exact20:

```text
authority_token
automatic_progression
body_free
contradiction
current_authority_boundary
design_publication
fixed_source
independent_verification
next_authority
predecessor_design_checkpoint
receipt_sha256
receipt_sha256_preimage_rule
reconciled_future_receipt_schema
repository_scope
retained_runtime_boundary
schema_version
source_entries
state
zero_effects
zero_execution
```

Its schema version is:

```text
cocolon.emlis.nls_v3.step11.cycle001.recovery_epoch004.d1_v5.r1_prelaunch_receipt_schema_contradiction.reconciliation_design_receipt.v1
```

Its nested exact keysets are:

```text
contradiction exact12:
future_schema_v1, top_level_key_count,
execution_observation_key_count, exact8_key_count,
mandatory_direct_record_field, mandatory_field_present_in_frozen_keysets,
add_field_without_version_bump_allowed, omit_field_allowed,
credited_execution_receipt_constructible, blocker_count,
pytest_launch_allowed, resolution

current_authority_boundary exact10:
approved_token, activation_count, prelaunch_entered,
pytest_invocation_count, pytest_process_budget_consumed_count,
authority_closed_count, authority_token_reuse_allowed,
predecessor_execution_result_publication_count,
predecessor_execution_receipt_publication_count, terminal_state

design_publication exact11:
repository_full_name, path, publication_parent_commit_sha1,
publication_commit_sha1, publication_tree_sha1, git_blob_sha1,
raw_sha256, byte_count, line_count, changed_path_count,
postfetch_exact_equal

fixed_source exact9:
repository_full_name, commit_sha1, tree_sha1, clean,
github_refetched_equal, d1_path, d1_blob_sha1, d1_raw_sha256,
dependency_lock

dependency_lock exact4:
path, git_blob_sha1, raw_sha256, logical_sha256

independent_verification exact9:
read_only_lane_count, schema_lane_complete,
authority_boundary_lane_complete, runtime_boundary_lane_complete,
final_blocker_count, final_advisory_count, subagent_edit_count,
subagent_github_write_count,
subagent_pytest_import_collection_or_execution_count

next_authority exact5:
token, state, concrete_unique_token_value_count,
separate_explicit_mash_approval_required, automatic_transition

predecessor_design_checkpoint exact10:
cocolon_commit_sha1, cocolon_tree_sha1,
design_path, design_git_blob_sha1, design_raw_sha256,
receipt_path, receipt_git_blob_sha1, receipt_raw_sha256,
receipt_logical_sha256, state

reconciled_future_receipt_schema exact12:
schema_version, top_level_key_count,
execution_observation_key_count, exact8_key_count,
added_direct_field, added_field_value, all_other_keysets_unchanged,
stage_projection_rule, result_recording_rule,
old_schema_credit_eligible, schema_contract_satisfiable,
successor_use_required

repository_scope exact7:
cocolon_approved_changed_path_count, cocolon_new_path_count,
cocolon_modified_path_count, cocolon_paths,
mashos_api_changed_path_count, production_source_change_count,
test_or_fixture_change_count

retained_runtime_boundary exact13:
state, past_readiness_is_future_guarantee,
pre_successor_fresh_rederivation_required, rematerialization_allowed,
interpreter_switch_allowed, runtime_path_published, expected,
full_runtime_entry_count, installed_file_row_count, distribution_count,
record_closure_match_count, unowned_importable_count,
unexpected_entry_count

retained_runtime_boundary.expected exact7:
runner_projection_sha256, accepted_wheel_manifest_sha256,
distribution_closure_sha256, installed_file_manifest_sha256,
full_runtime_root_manifest_sha256, runtime_root_identity_sha256,
interpreter_executable_sha256

source_entries exact8:
cocolon_entry_commit_sha1, cocolon_entry_tree_sha1,
execution_plan_entry_git_blob_sha1, execution_plan_entry_raw_sha256,
execution_plan_entry_byte_count, latest_snapshot_entry_git_blob_sha1,
latest_snapshot_entry_raw_sha256, latest_snapshot_entry_byte_count

zero_effects exact8:
product_runtime_effect_count, reference_or_operational_admission_count,
candidate_or_event1_count, source_lock_change_count,
corrected_d1_v5_causal_red_credit_count, corrected_d2_invocation_count,
stability_run_count, automatic_transition_count

zero_execution exact16:
pytest_invocation_count, framework_entry_count,
python_or_pytest_import_count, d1_target_import_count, collection_count,
collect_only_count, dry_run_count, launcher_probe_count,
challenge_creation_count, eligible_live_remote_attempt_count,
additional_remote_execution_count, o01_o08_observed_count, closure_count,
runtime_materialization_count, package_acquisition_count,
successor_invocation_count
```

The `current_authority_boundary` literals are frozen as follows:

```text
approved_token:
the full historical consumed execution token in section 3.1

activation_count / prelaunch_entered / authority_closed_count:
1 / true / 1

pytest_invocation_count / pytest_process_budget_consumed_count:
0 / 0

authority_token_reuse_allowed:
false

predecessor_execution_result_publication_count /
predecessor_execution_receipt_publication_count:
0 / 0

terminal_state:
R1_SCHEMA_V1_PRELAUNCH_RECEIPT_CONTRACT_UNSATISFIABLE_AUTHORITY_CLOSED_CONSUMED_UNEXECUTED_NO_PYTEST_NO_RERUN
```

The `zero_execution` exact16 and `zero_effects` exact8 values are all integer
`0`.  They describe the predecessor execution branch and the present
Design-only authority's operational effects; they do not count publication of
the present Design, Design Receipt, Design Handoff, Plan append, or snapshot
append.  Those documentation writes are represented only by
`design_publication` and `repository_scope` and later publication ledgers.

Its delete-self rule is:

```text
SHA256_OF_UTF8_COMPACT_SORTED_KEY_JSON_AFTER_DELETING_RECEIPT_SHA256_WITH_NO_TRAILING_LF
```

The stored form is compact sorted-key UTF-8 JSON plus exactly one trailing LF.
It contains no runtime body, raw node IDs, operational paths, environment
bodies, exception text, stdout/stderr bodies, or challenge bytes.

The Receipt records the exact contradiction, the two-layer consumption
boundary, the unchanged source/runtime identities, v2 correction, current
exact5 scope, independent read-only audit, all zero executions/effects, and
exactly one inactive successor token.  It does not claim a pytest result.

# 9. Stop state and downstream boundary

The current Design authority can become credited only after all exact5 are
published, exact-content postfetched, single-path verified, reachable from
main, and both append prefixes remain byte-identical.  Until then its state is
`DESIGN_ONLY_POSTVERIFICATION_REQUIRED`.

After successful postverification, its terminal state is:

```text
RECOVERY_EPOCH004_D1_V5_R1_ROOTDIR_CORRECTED_SCHEMA_V1_PRELAUNCH_RECEIPT_CONTRACT_UNSATISFIABLE_CURRENT_AUTHORITY_CLOSED_CONSUMED_UNEXECUTED_PYTEST_CHALLENGE_REMOTE_O01_O08_EXACT0_SCHEMA_V2_RECONCILED_DISTINCT_ONE_SHOT_DEFINED_INACTIVE_AUTOMATIC_PROGRESSION_FALSE_AUTHORITY_STOP
```

The following remain blocked or unchanged:

```text
corrected D1 v5 causal RED credit:
NOT_ESTABLISHED

corrected D2:
NOT_APPROVED / exact0

stability matrix:
NOT_APPROVED / exact0

Reference / OperationalAdmission:
BLOCKED / BLOCKED

Candidate / Event1 / source lock / product runtime effect:
exact0 / exact0 / false / exact0

automatic progression:
false
```

# 10. Facts, inference, and Karen's opinion

## 10.1 確認した事実

- GitHub current main identities are Cocolon `49dbcb48...` and mashos-api
  `37eee88c...`, with the fixed blobs recorded in section 1;
- the predecessor Design requires the ordered-node hash in Result and Receipt;
- its frozen future Receipt schema has top exact16, observation exact11, and
  `exact8` exact6 with no field for that hash;
- adding or omitting the field under v1 violates one of two simultaneous
  mandatory rules, so a credited v1 Receipt is not constructible;
- the approved predecessor one-shot invoked pytest exact0 and reached
  challenge, remote, O01--O08, and closure exact0;
- historical Designs and Receipts remain unchanged;
- this authority changes Cocolon NEW exact3 / MODIFY append-only exact2 only;
  and
- this authority executes no successor and does not advance downstream.

## 10.2 推測

The schema contradiction is sufficient to explain why the approved one-shot
could not responsibly launch, but it predicts nothing about whether pytest,
the remote observation, or O01--O08 would pass under the corrected successor.
The retained runtime and rootdir evidence make future readiness plausible,
but temporal mutation remains possible until fresh rederivation.

## 10.3 華恋の意見

一回性は「pytestをまだ起動していないから同じtokenを使える」という意味では
ありません。承認された契約そのものに矛盾が見つかった以上、そのauthorityは
閉じ、契約差分が見える別tokenとしてMash様に再承認を求めるのが妥当です。

補正は `exact8` に必須hashを一つ直接追加しschemaをv2へ上げる最小差分で十分です。
D1の厳密比較、actual-Git強度、remote exact1、role独立評価、no-retryを緩める
必要はありません。次はfresh rederivationでreadinessを再確認し、schema-v2を
prelaunchで機械検証してから、一回だけ実行すべきです。

# 11. Final stop

```text
current authority:
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_V5_R1_ROOTDIR_CORRECTED_ONE_SHOT_PRELAUNCH_RECEIPT_SCHEMA_CONTRACT_UNSATISFIABLE_ORDERED_NODE_LIST_SHA256_MANDATORY_BUT_UNALLOCATED_TOP_EXACT16_EXECUTION_OBSERVATION_EXACT11_EXACT8_EXACT6_KEYSET_CONTRADICTION_PYTEST_INVOCATION_CHALLENGE_REMOTE_O01_O08_EXACT0_CURRENT_AUTHORITY_CONSUMPTION_BOUNDARY_AND_DISTINCT_SUCCESSOR_ONE_SHOT_RECEIPT_SCHEMA_RECONCILIATION_DESIGN_READ_ONLY_AND_POSTVERIFICATION_ONLY

next authority state:
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED

concrete successor unique token value count:
exact1

successor execution under this authority:
exact0

automatic progression:
false
```

No schema-v2 pytest process, corrected D2, stability run, Reference/OA,
Candidate/Event1, source lock, runtime product change, or later authority was
executed.
