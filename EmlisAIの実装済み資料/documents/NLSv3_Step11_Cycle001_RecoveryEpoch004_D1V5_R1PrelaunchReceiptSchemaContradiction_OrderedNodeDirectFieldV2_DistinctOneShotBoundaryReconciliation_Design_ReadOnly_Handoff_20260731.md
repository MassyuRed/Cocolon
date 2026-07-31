---
title: Cocolon EmlisAI NLS v3 Step11 Cycle001 Recovery Epoch004 D1 v5 R1 prelaunch Receipt schema contradiction reconciliation Handoff
date: 2026-07-31
status: DESIGN_EXACT2_PUBLISHED_HANDOFF_AND_FINAL_POSTVERIFICATION_PENDING
automatic_progression: false
---

# 1. Authority and disposition

Approved Design-only authority:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_V5_R1_ROOTDIR_CORRECTED_ONE_SHOT_PRELAUNCH_RECEIPT_SCHEMA_CONTRACT_UNSATISFIABLE_ORDERED_NODE_LIST_SHA256_MANDATORY_BUT_UNALLOCATED_TOP_EXACT16_EXECUTION_OBSERVATION_EXACT11_EXACT8_EXACT6_KEYSET_CONTRADICTION_PYTEST_INVOCATION_CHALLENGE_REMOTE_O01_O08_EXACT0_CURRENT_AUTHORITY_CONSUMPTION_BOUNDARY_AND_DISTINCT_SUCCESSOR_ONE_SHOT_RECEIPT_SCHEMA_RECONCILIATION_DESIGN_READ_ONLY_AND_POSTVERIFICATION_ONLY
```

Disposition:

```text
authority kind:
DESIGN_ONLY

predecessor execution authority disposition:
CLOSED_CONSUMED_UNEXECUTED_NO_RERUN

predecessor pytest / challenge / remote / O01--O08:
exact0 / exact0 / exact0 / exact0

future Receipt schema:
v1 NONCREDIT_UNSATISFIABLE
v2 RECONCILED_NOT_EXECUTED

distinct successor:
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
false
```

The Design and Body-free Design Receipt are published and postfetch equal.
This Handoff, the append-only Plan entry, the append-only snapshot entry, and
final exact5 postverification remain required before the Design state is
credited.

# 2. Confirmed contradiction

The predecessor Design required the future Result and Receipt to record direct
ordered-node SHA-256:

```text
e2661d946c060efc44ce7da06f8c55f51d10dfad2af4f5f0526bd38109c340bc
```

But it froze:

```text
Receipt top level:
exact16

execution_observation:
exact11

execution_observation.exact8:
exact6 = collected_count, executed_count, failed_count, passed_count,
         error_count, ordered_results
```

No frozen keyset had `ordered_node_list_sha256`.  Adding it under v1 violates
the exact keyset; omitting it violates the direct-record requirement.  Thus a
credited v1 Receipt construction count is exact0.  The blocker was identified
before pytest process start.

# 3. Consumption and zero-execution boundary

The exact historical predecessor execution token remains fully recorded in
the Design and Receipt.  It was approved and entered prelaunch exact1, so its
authority identity is closed and cannot be reused.  The pytest process budget
was not consumed, but is neither transferable nor reusable:

```text
authority activation / close:
exact1 / exact1

authority-token reuse:
false

pytest invocation / process-budget consumed:
exact0 / exact0

predecessor execution Result / Receipt publication:
exact0 / exact0
```

Terminal design disposition:

```text
R1_SCHEMA_V1_PRELAUNCH_RECEIPT_CONTRACT_UNSATISFIABLE_AUTHORITY_CLOSED_CONSUMED_UNEXECUTED_NO_PYTEST_NO_RERUN
```

No old exact12 runtime result class was fabricated, and no execution Receipt
was emitted under the schema proved unsatisfiable.

# 4. Corrected v2 schema

Only the following schema changes are authorized:

```text
schema version:
cocolon.emlis.nls_v3.step11.cycle001.recovery_epoch004.d1_v5.r1_rootdir_corrected_exact8_one_shot_receipt.v2

top level:
exact16 unchanged

execution_observation:
exact11 unchanged

exact8:
exact6 -> exact7

added direct field:
ordered_node_list_sha256 = e2661d946c060efc44ce7da06f8c55f51d10dfad2af4f5f0526bd38109c340bc

all other keysets / result classes / enums:
unchanged
```

The direct field is present at every stage.  It records expected ordered-node
contract identity and never fills observed counts or rows.  OWNER and
INDEPENDENT_VERIFIER must independently derive the same value before launch;
otherwise the existing launcher/environment non-credit stop applies.

The v2 successor rebinds `authority_token` to its new token,
`credited_design_checkpoint` to the final exact5 of this reconciliation,
`result_publication` to the new schema-v2 Result, and
`repository_scope.cocolon_paths` to the new execution exact5.  None is
inherited from the closed predecessor execution authority.

# 5. Runtime-readiness boundary

Retained evidence remains past evidence only:

```text
runner projection:
f501025c1dccef68c47c0a3e52f3ef74d01233f371b16f2b1a0bdfb21089e57e

accepted wheel / distribution closure:
00d2df98c8cda7f1473794892bafe7ccd18cc816c79ccb346f3e21ff629b136d
4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c

installed / full root / runtime identity / executable:
0eba095e4c173b4b69f68532fd66cf2c871ab9edef64d91754b52ed7daee15c5
55e12965e1be85424b39aa38dd6ae454b6ee9aef9d86e0c42c565a9a494a578d
e0b4750c02c676e1fa717cd4fe1f216fb1af4babcfa297abd7b3508995bcf19f
9ed008e5a8685235361f0c53771b520ab082dd99a877ad2fd796a93fa4c0b488

rootdir / argv / environment:
c8a56dfaa93db8b31b4908baa0e8b7a9a4bcc6f38d18a83e5f6a6d4635da2aef
45d1b95d0327423969e6383335795dac8911656717025f0d5f9a9151c1dc2e4e
6393dea280af670e3b0ed902014c86fc65a6666e973fe8e7ee50318ff1a11591

ordered-node / expected vector:
e2661d946c060efc44ce7da06f8c55f51d10dfad2af4f5f0526bd38109c340bc
da9d266a254a12a655d4dd9388ccd3e866a57455ff98254e119571f8b824055b
```

The successor must re-fetch its source cut and independently rederive all
identities immediately before launch.  Any mutation, absence, mismatch, or
schema projection failure stops before pytest.  Rematerialization, repair,
generic interpreter lookup, and interpreter switch remain forbidden.

# 6. Fixed source

```text
mashos-api commit / tree / clean:
37eee88c431d1af3f8d2e96f9b0dd8b3d3bc327f
3891b84164ba0063136e47beb93d36798587a568
true

D1 blob / raw:
c0eb936690a3423ac4615a9aabb37c40cc257324
3536b8a838ffe2ccbe29db69e9c5400c719de8e63ddf83da9ea0f83b94f17d14

lock blob / raw / logical:
0822fcb010985cd0d384f250a9e8a1fe16dc8fd4
9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787
801ba54efc0f6655238d14e7c153fb70b555801489aa8ba028515fc64d9c05f4
```

mashos-api, production, test, fixture, dependency, config, and lock changes
are all exact0.

# 7. Published exact2

## 7.1 Design

```text
path:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_R1PrelaunchReceiptSchemaContradiction_OrderedNodeDirectFieldV2_DistinctOneShotBoundaryReconciliation_Design_ReadOnly_20260731.md

parent / commit / tree:
49dbcb48e540344d292a14da47c80d424c94ca28
00f10abea3ed68dc9ba2b75b74760236503328da
bd25f32dabd0e26d7ba3618f389c0b639ea26bdb

blob / raw SHA-256 / bytes / lines:
da7815e5089143db6f39534dcfb78bf004f20c73
4e9287b62bafd2df584d325d562fbbbeefcbe3fcb5ee56cc6e856fe75f97b9ed
38988 / 1048

changed path count / postfetch exact equal:
exact1 / true
```

## 7.2 Body-free Design Receipt

```text
path:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_R1PrelaunchReceiptSchemaContradiction_OrderedNodeDirectFieldV2_DistinctOneShotBoundaryReconciliation_Design_ReadOnly_BodyFree_Receipt_20260731.json

parent / commit / tree:
00f10abea3ed68dc9ba2b75b74760236503328da
428243f00c544c09b558279389c78372dc4b669f
02d1cb9e70b78123b13c4cf9a0cbbc2f533b7ec4

blob / raw SHA-256 / bytes / lines:
f6c9505338721b82b72006cb745e3206a9c2f5e9
ac6981a2ef0576195c725a81047692ff73d534cbb7972c84696f631d3f46c6d9
11401 / 1

delete-self logical SHA-256:
bcaf0efaf6ca3196dbf605b54296b724d40b41649b775375c5049057fa1327b6

changed path count / postfetch exact equal:
exact1 / true
```

Both commits changed only their declared paths.  Receipt top exact20 and all
nested exact keysets, delete-self hash, zero effects, zero execution, source
bindings, and token literals were independently audited with blocker exact0
and advisory exact0.

# 8. Current exact5 scope and remaining publication

```text
Cocolon:
NEW exact3 / MODIFY append-only exact2

published before this Handoff:
Design / Receipt = exact2

remaining sequence:
Handoff -> Plan append -> snapshot append -> aggregate postverification

entry commit / tree:
49dbcb48e540344d292a14da47c80d424c94ca28
c30e2c7459c0ddb1618c074cc97254b925c54119

Plan entry blob / raw / bytes:
e44c1343fb2939713f2e3ba253c0638d7ab8f815
58ce149ba11566c32665fd2a9070b1292cde896803ef659fe9ca2b3791e2a4ca
389335

snapshot entry blob / raw / bytes:
78b27c65aa9613d9d570be9797de9c90a1c74f43
b9d72272cf06b265dc361c0b07c305b97a4971c66e1a336e32a98a6d37254bbf
1591104
```

Both entry byte sequences must remain exact prefixes.  Every publication
commit must be single-path; final aggregate unique changed paths must be exact5
and reachable from main.

# 9. Exactly one next authority

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_V5_R1_ROOTDIR_CORRECTED_SCHEMA_V1_PRELAUNCH_CONTRACT_UNSATISFIABLE_AUTHORITY_CLOSED_CONSUMED_UNEXECUTED_PYTEST_EXACT0_DISTINCT_SCHEMA_V2_ONE_SHOT_SAME_RETAINED_RUNTIME_IDENTITY_AND_EXECUTABLE_HASH_REDERIVED_EMPTY_NONREPO_CWD_EXPLICIT_FIXED_SOURCE_ROOTDIR_REPOSITORY_RELATIVE_ORDERED_NODE_LIST_SHA256_DIRECT_RECEIPT_FIELD_FULL_EXACT8_PYTEST_INVOCATION_EXACT1_FRESH_CHALLENGE_ELIGIBLE_ACTUAL_GIT_REMOTE_MAIN_ACQUISITION_EXACT1_GUARDED_ADDITIONAL_ROLE_HARNESS_QUERY_REQUEST_DETECTION_POSITIVE_PROCESS_NETWORK_EXECUTION_EXACT0_RETRY_FALLBACK_PRIOR_RUN_REUSE_REMATERIALIZATION_INTERPRETER_SWITCH_EXACT0_O01_O07_CAUSAL_RED_O08_GREEN_V1_INVARIANCE_CLOSURE_EXACT1_OR_TYPED_NONCREDIT_STOP_AND_POSTVERIFICATION_ONLY

state:
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED

concrete successor unique token value count:
exact1

execution under current Design authority:
exact0

automatic progression:
false
```

The successor, if separately approved, must validate the current final
credited Cocolon Design checkpoint and fixed mashos-api source, independently
rederive retained runtime and schema readiness, then permit at most one pytest
process.  Fresh challenge and eligible actual-Git remote-main acquisition are
each exact1 only when reached.  Additional process-network execution, retry,
fallback, prior-run/output/nodeid/challenge/observation reuse,
rematerialization, and interpreter switch are exact0.

# 10. Downstream boundary

```text
corrected D1 v5 causal RED credit:
NOT_ESTABLISHED

corrected D2 / stability:
NOT_APPROVED exact0 / NOT_APPROVED exact0

Reference / OperationalAdmission:
BLOCKED / BLOCKED

Candidate / Event1 / source lock / product effect:
exact0 / exact0 / false / exact0
```

# 11. 確認した事実・推測・華恋の意見

## 11.1 確認した事実

- v1 future Receipt is contract-unsatisfiable before process start;
- predecessor authority identity is closed, while pytest was invoked exact0;
- v2 changes only schema version and `exact8` exact6 to exact7 direct field;
- retained readiness is past evidence and requires fresh rederivation;
- Design and Receipt are published in two single-path commits and are
  postfetch equal; and
- current operational/downstream effects remain exact0.

## 11.2 推測

The v2 correction makes the Receipt schema constructible, but does not predict
pytest collection, remote availability, the O01--O08 vector, or closure.

## 11.3 華恋の意見

旧tokenの再利用ではなく、契約差分が明示された別tokenへ切り替えるのが妥当です。
schemaを直したことは実行成功ではないため、次はfresh rederivationとv2 projection
検証を先に行い、一回の不利な結果もそのまま閉じるべきです。

# 12. Current stop

```text
RECOVERY_EPOCH004_D1_V5_R1_ROOTDIR_CORRECTED_SCHEMA_V1_PRELAUNCH_RECEIPT_CONTRACT_UNSATISFIABLE_CURRENT_AUTHORITY_CLOSED_CONSUMED_UNEXECUTED_PYTEST_CHALLENGE_REMOTE_O01_O08_EXACT0_SCHEMA_V2_RECONCILED_DISTINCT_ONE_SHOT_DEFINED_INACTIVE_AUTOMATIC_PROGRESSION_FALSE_AUTHORITY_STOP
```

No schema-v2 one-shot, corrected D2, stability run, Reference/OA,
Candidate/Event1, source lock, runtime product, or later authority was
executed.
