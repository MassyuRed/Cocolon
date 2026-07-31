---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch004_d1v5_runtime_ready_credited_r1_one_shot_authority_binding_design_handoff
title: "Recovery Epoch004 D1 v5 credited-runtime-ready R1 one-shot authority-binding Design handoff"
revision_date: "2026-07-31"
status: "READ_ONLY_DESIGN_PUBLISHED_R1_DEFINED_INACTIVE_HANDOFF"
body_free: true
automatic_progression: false
---

# Recovery Epoch004 D1 v5 R1 authority-binding Design handoff

## 0. Authority, decision, and stop

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

automatic progression:
false
```

This checkpoint defines the later R1 one-shot contract.  It does not activate
or execute it.  Corrected D1 v5 causal-RED credit is still not established.

```text
package acquisition / runtime materialization:
exact0 / exact0

pytest invocation / framework entry / D1 target import / collection / execution:
exact0 / exact0 / exact0 / exact0 / exact0

challenge / eligible live remote-main acquisition / O01–O08:
exact0 / exact0 / exact0

mashos-api change / product runtime effect:
exact0 / exact0

Reference / OperationalAdmission / Candidate / Event1 / source lock:
exact0 / exact0 / exact0 / exact0 / false
```

## 1. Governing checkpoint and fixed source

Credited R0 Cocolon checkpoint:

```text
commit / tree:
ebc9307a01f55c8c99f0928e146fa1f8e86338ca
a9ca16f9c9daf8ce456bd6e7696270a251b6b9c1

state:
RUNTIME_READY

Receipt delete-self logical SHA-256:
89d463cf7600170f912b194db687faa9e1a6569b2c913f51c1f0e452087040f4

readiness observation SHA-256:
c74148950138ac2a4c3897d9d93bc071f3a01f764b6e16d3885f21eeee3d1a45
```

The fixed mashos-api source remains:

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

Existing lock:

```text
path:
ai/configs/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_lock_v1.json

blob / raw / logical SHA-256:
0822fcb010985cd0d384f250a9e8a1fe16dc8fd4
9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787
801ba54efc0f6655238d14e7c153fb70b555801489aa8ba028515fc64d9c05f4
```

GitHub HEAD, D1, and lock were re-fetched before the Design was fixed.  No
local copy is promoted over those GitHub identities.

## 2. Retained-runtime binding

Owner and independent verifier each rederived the already-retained runner and
returned `VALID`.  No package was acquired and no runtime was rematerialized.

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

```text
full entries:
exact527 = directory exact33 + regular file exact491 + symlink exact3

installed rows / distributions / RECORD closure matches:
exact482 / exact5 / exact5

unowned importable / unexpected entry:
exact0 / exact0
```

The retained runtime is CPython 3.12.13 on `linux-x86_64` with pytest 8.4.1.
Its absolute root and executable paths remain session-local and body-free.
Every identity above must be rederived again immediately before a separately
approved R1.  Any mismatch expires R1 eligibility without rematerialization,
interpreter switch, launcher, or retry.

## 3. Defined but inactive R1 contract

Exactly one successor token is defined in section 9.  Its frozen launcher and
environment identities are:

```text
logical argv SHA-256:
8797754f541bd6bbd97734f0e80329cb597f2e37605755d33588fbef7d58f99c

environment-policy SHA-256:
6393dea280af670e3b0ed902014c86fc65a6666e973fe8e7ee50318ff1a11591

execution deadline:
1200 seconds
```

Only after separate approval and all pre-launch gates may that authority use:

```text
pytest invocation / fresh challenge:
exact1 / exact1

eligible neutral actual-Git remote-main request / process-network execution:
exact1 / exact1

generic python or PATH resolution:
exact0

additional owner / independent / parent / harness process-network execution:
exact0 / exact0 / exact0 / exact0

retry / fallback / prior-run reuse / rematerialization / interpreter switch:
exact0 / exact0 / exact0 / exact0 / exact0
```

The unchanged D1 intentionally detects guarded additional role/harness query
requests in the exact O01–O07 lanes while blocking their process/network
execution.  A detected request is not a second live acquisition.

The ordered exact8 contract is:

```text
ordered node-list SHA-256:
e2661d946c060efc44ce7da06f8c55f51d10dfad2af4f5f0526bd38109c340bc

expected-vector SHA-256:
da9d266a254a12a655d4dd9388ccd3e866a57455ff98254e119571f8b824055b

O01–O07:
CAUSAL_RED exact7 with each frozen signature and violation class

O08:
GREEN_V1_INVARIANCE exact1

expected pytest result:
exit 1 / failed exact7 / passed exact1 / error exact0

internal closure:
exact1
```

Exit 1 by itself is not credit.  Credit requires the complete expected vector,
one immutable observation shared by all roles, each role's independent meaning
derivation, and the frozen internal closure.  Any typed non-credit result stops
without a second launcher.

## 4. Published Design and Receipt

Design:

```text
path:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_RuntimeReadyCredited_R1OneShotAuthorityBinding_Design_ReadOnly_20260731.md

commit / tree / blob / raw SHA-256 / bytes / lines:
34aa0ea0de5be6bd2d7460fd7ea6c70e021575ec
1430b5e9106e0274b33935ad45a3348174c052da
ce2b5f700c38182de42e17a1c4ea31f415820d46
8966c13ccc7259fc51301ca5a97cd937fc83040c8fdc3b46261569b69baafed3
42882 / 1145
```

Body-free Receipt:

```text
path:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_RuntimeReadyCredited_R1OneShotAuthorityBinding_Design_ReadOnly_BodyFree_Receipt_20260731.json

commit / tree / blob / raw SHA-256 / bytes / lines:
8f7712ecf25c801e1c5740f841f93e231917a102
e3e09a4d275858ab502c421fb03f3f180541af36
e03578fb656e87fa600b0fa34953ba19e3e85c75
645b002727a9dfd8e96ff125614349dfbdec441b0dc622a8ffe8f060ae0035f5
11016 / 1

delete-self logical SHA-256:
c2001045328e29f6eaadda2ac115a27acae1bc7887aa937fabb2b4d63b3c6882
```

Both targets are exact-content postfetch equal.  The Receipt has exact20
top-level keys, canonical compact key-sorted UTF-8 JSON plus one LF, and
independently verified delete-self hash.  Final audit blocker/advisory counts
are exact0/exact0.

## 5. Exact5 publication boundary

The approved order is:

```text
Design -> Receipt -> this Handoff -> Plan append -> latest snapshot append
```

```text
Cocolon:
NEW exact3 / MODIFY append-only exact2

mashos-api:
changed path exact0
```

Each write changes one approved path and is exact-content postfetched.  The
Handoff does not carry its own publication identity; the subsequent Plan does.
Plan and latest snapshot must retain their original byte prefixes:

```text
Execution and Closure Plan entry blob / raw / bytes:
810d34be3d3542d42f36cca550845414e196a2c3
d0afd2fa09d26f778dc92b1875f4b2f1c9ea1120f49bdc8ef04791633cfef7d5
365347

latest snapshot entry blob / raw / bytes:
67a771d08740c895722a360e278c0f676b61dbb0
a2f0d78340a95a84e1e27d2c2e86df0e5c3fd89b118041ff746254af294bcc49
1561399
```

Design and Receipt are published exact2.  This Handoff is target 3; Plan is
target 4; latest snapshot is target 5.  Until all exact5 are reachable and
postverified, the Design checkpoint remains partial and non-credit.

Three read-only audit lanes inspected the Design/Receipt contract, retained
runtime identity, and role/import/evidence boundaries.  They made no edit,
GitHub write, package acquisition, pytest execution, or product call.  Karen
fixed the contract, performed every GitHub write, and retains final judgment.

## 6. 確認した事実

- credited R0 remains `RUNTIME_READY`, and its Cocolon exact5 identities are
  unchanged at the Design entry checkpoint;
- current mashos-api HEAD/tree, D1 blob, and lock blob equal the fixed R0
  source identities;
- owner and independent verifier reproduced all seven retained-runtime hashes
  with unowned/unexpected exact0;
- the Design and Body-free Receipt are published, postfetch exact-equal, and
  each publication commit changed only its approved exact1 path;
- current authority executed no pytest, challenge, live remote acquisition, or
  O01–O08 and changed no mashos-api file; and
- R1, corrected D2, stability, Reference/OA, Candidate/Event1, and source lock
  remain inactive or blocked.

## 7. 推測

The retained runtime is still eligible at Design time, so the earlier missing
pytest-runner gap does not prevent defining R1.  This does not predict the
future remote availability or whether the exact8 vector will match.

## 8. 華恋の意見

同じruntimeであることは、R1の実行直前にも全同一性を再導出して確認すべきです。
その後にfresh challengeを生成し、actual-Git remote-mainを一度だけ取得し、全exact8を
一回で閉じるのが妥当です。O01–O07が検出する追加queryの「要求」と、実際の
process/network「実行」は分離し、有利な結果が出るまでの再実行は行いません。

必要性は、productionを変更する前に、同一immutable observation共有とroleごとの
独立意味判定の契約が、意図した原因でO01–O07をREDにし、O08のv1不変条件を維持
するかを一回の観測で証明することです。

## 9. 次の承認内容

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
