# NLSv3 Step11 Cycle001 — Recovery Epoch004 D1 v5 R1 same-retained-runtime fresh-challenge exact8 one-shot result

Date: 2026-07-31  
Repository scope: `MassyuRed/Cocolon` documentation exact5; `MassyuRed/mashos-api` change exact0  
Result: `R1_PYTEST_LAUNCH_OR_COLLECTION_NONCREDIT_STOP`

## 1. Approved authority and stop boundary

```text
authority:
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_V5_R0_RUNTIME_READY_CREDITED_POSTVERIFIED_R1_SAME_RETAINED_RUNTIME_IDENTITY_AND_EXECUTABLE_HASH_REDERIVED_FRESH_CHALLENGE_FULL_EXACT8_ONE_SHOT_PYTEST_INVOCATION_EXACT1_ELIGIBLE_ACTUAL_GIT_REMOTE_MAIN_ACQUISITION_EXACT1_GUARDED_ADDITIONAL_ROLE_HARNESS_QUERY_REQUEST_DETECTION_POSITIVE_PROCESS_NETWORK_EXECUTION_EXACT0_RETRY_FALLBACK_PRIOR_RUN_REUSE_REMATERIALIZATION_INTERPRETER_SWITCH_EXACT0_O01_O07_CAUSAL_RED_O08_GREEN_V1_INVARIANCE_CLOSURE_EXACT1_OR_TYPED_NONCREDIT_STOP_AND_POSTVERIFICATION_ONLY

automatic progression:
false

same-authority rerun:
exact0

result class:
R1_PYTEST_LAUNCH_OR_COLLECTION_NONCREDIT_STOP

failure stage / class / safe code:
PYTEST / EXECUTION / PYTEST_LAUNCH_OR_COLLECTION_INVALID
```

This authority is closed.  The one permitted pytest process completed once.
The observed result did not satisfy the credit vector, so no retry, fallback,
prior-run reuse, rematerialization, interpreter switch, corrected D2,
stability run, or governance progression is authorized.

## 2. Pre-launch identities

The fixed source was clean and equal immediately before launch:

```text
mashos-api commit / tree:
37eee88c431d1af3f8d2e96f9b0dd8b3d3bc327f
3891b84164ba0063136e47beb93d36798587a568

D1 blob / raw SHA-256:
c0eb936690a3423ac4615a9aabb37c40cc257324
3536b8a838ffe2ccbe29db69e9c5400c719de8e63ddf83da9ea0f83b94f17d14

lock blob / raw / logical SHA-256:
0822fcb010985cd0d384f250a9e8a1fe16dc8fd4
9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787
801ba54efc0f6655238d14e7c153fb70b555801489aa8ba028515fc64d9c05f4
```

Owner and independent verifier each rederived the retained runtime as
`VALID`, with all exact7 hashes equal:

```text
runner projection:
f501025c1dccef68c47c0a3e52f3ef74d01233f371b16f2b1a0bdfb21089e57e

accepted-wheel manifest:
00d2df98c8cda7f1473794892bafe7ccd18cc816c79ccb346f3e21ff629b136d

distribution closure:
4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c

installed-file manifest:
0eba095e4c173b4b69f68532fd66cf2c871ab9edef64d91754b52ed7daee15c5

full runtime-root manifest:
55e12965e1be85424b39aa38dd6ae454b6ee9aef9d86e0c42c565a9a494a578d

runtime-root identity:
e0b4750c02c676e1fa717cd4fe1f216fb1af4babcfa297abd7b3508995bcf19f

interpreter executable:
9ed008e5a8685235361f0c53771b520ab082dd99a877ad2fd796a93fa4c0b488
```

```text
full runtime entries:
exact527 = directory exact33 + regular exact491 + symlink exact3

installed rows / distributions / RECORD matches:
exact482 / exact5 / exact5

unowned importable / unexpected:
exact0 / exact0
```

The runtime was neither repaired nor changed.  Its absolute path and the
operational source path are not published.

## 3. Frozen launcher and observed process

```text
logical argv SHA-256:
8797754f541bd6bbd97734f0e80329cb597f2e37605755d33588fbef7d58f99c

environment-policy SHA-256:
6393dea280af670e3b0ed902014c86fc65a6666e973fe8e7ee50318ff1a11591

working-directory class:
EMPTY_NON_REPOSITORY_DIRECTORY

pytest invocation / generic PATH resolution:
exact1 / exact0

deadline / timeout:
1200 seconds / false

process started / completed / exit code:
true / true / 1
```

Body-free stream evidence:

```text
stdout state / bytes / SHA-256:
CAPTURED / 12856 /
18128e97df97e2496f7e7054c604448eb898196ce57519b05dc97e09f9f45001

stderr state / bytes / SHA-256:
CAPTURED / 0 /
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

Raw stdout/stderr, exception body, absolute paths, environment body, and
challenge input bytes are not part of the publication.

## 4. Safe result normalization

Pytest collected exact8 nodes, but the module-scoped fixture rejected the
collected node-id vector before `_acquire_run_observation()` was called.  The
actual node ids included an invocation-context checkout-directory prefix,
whereas the fixed D1 vector requires repository-relative node ids beginning
with `ai/tests/`.

```text
collected:
exact8

pytest normalized terminal records:
error exact8 / failed exact0 / passed exact0

O01–O08 test-body execution:
exact0

ordered semantic oracle results:
exact0 established

fixture phase:
SETUP_ERROR_BEFORE_D1_PREFLIGHT
```

No causal-RED signature, violation class, O08 GREEN, immutable observation,
or closure is filled from the expected vector.  The expected values are not
used as observed evidence.

```text
fresh challenge:
exact0

D1 preflight:
NOT_STARTED

eligible neutral remote request / execution:
exact0 / exact0

additional role/harness remote execution:
exact0

retry / fallback / prior-run reuse:
exact0 / exact0 / exact0

rematerialization / interpreter switch:
exact0 / exact0

observation identity / closure:
exact0 / exact0
```

The owner and independent verifier both classify the same safe observation as
`INVALID / PYTEST_LAUNCH_OR_COLLECTION_INVALID`.  This is non-credit.  D1
causal-RED refreeze remains unestablished.

## 5. Scope and effects

```text
mashos-api changed paths:
exact0

production / test / fixture / dependency / config / lock changes:
exact0 / exact0 / exact0 / exact0 / exact0 / exact0

product runtime effect:
exact0

Reference / OperationalAdmission:
BLOCKED / BLOCKED

Candidate / Event1 / source lock:
exact0 / exact0 / false

corrected D2 invocation / stability run:
exact0 / exact0
```

## 6. 確認した事実

- fixed source and both retained-runtime rederivations were equal before the
  launch;
- the approved pytest launcher ran exact1 and completed without timeout;
- collection produced exact8 items, but fixture setup produced exact8 errors
  before challenge, preflight, remote acquisition, or any O01–O08 body;
- the mismatching dimension was the node-id path prefix, not the number or
  names of the collected tests; and
- no retry or downstream authority was executed.

## 7. 推測

The mismatch is consistent with pytest deriving node ids from its selected
root/invocation context while the frozen D1 compares them against a
repository-relative literal.  This explains the observation, but it does not
by itself authorize changing the working directory, adding a root option, or
changing the test.

## 8. 華恋の意見

この結果を「実質exact8」としてcreditに寄せるべきではありません。D1内部の
challengeより前に停止しており、actual-Gitもcausal oracleも観測していません。
まずDesign-onlyで、空の非repository作業dirという隔離境界と、pytest node-idの
repository-relative同一性を同時に満たすlauncher契約を固定し、どの層を変更するかを
明示する必要があります。その後も新しいone-shotは別承認にすべきです。

## 9. Authority stop

```text
current authority:
CLOSED_NONCREDIT_NO_RERUN

D1 causal-RED refreeze credit:
NOT_ESTABLISHED

corrected D2 / stability / Reference / OperationalAdmission:
BLOCKED

automatic progression:
false
```
