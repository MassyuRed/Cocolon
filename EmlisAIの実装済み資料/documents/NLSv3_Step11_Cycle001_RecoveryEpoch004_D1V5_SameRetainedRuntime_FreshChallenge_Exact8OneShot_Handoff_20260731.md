# Handoff — NLSv3 Step11 Cycle001 Recovery Epoch004 D1 v5 R1 one-shot non-credit closure

Date: 2026-07-31  
Current state: `R1_PYTEST_LAUNCH_OR_COLLECTION_NONCREDIT_STOP`  
Automatic progression: `false`

## 1. Authority closed by this handoff

```text
authority:
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_V5_R0_RUNTIME_READY_CREDITED_POSTVERIFIED_R1_SAME_RETAINED_RUNTIME_IDENTITY_AND_EXECUTABLE_HASH_REDERIVED_FRESH_CHALLENGE_FULL_EXACT8_ONE_SHOT_PYTEST_INVOCATION_EXACT1_ELIGIBLE_ACTUAL_GIT_REMOTE_MAIN_ACQUISITION_EXACT1_GUARDED_ADDITIONAL_ROLE_HARNESS_QUERY_REQUEST_DETECTION_POSITIVE_PROCESS_NETWORK_EXECUTION_EXACT0_RETRY_FALLBACK_PRIOR_RUN_REUSE_REMATERIALIZATION_INTERPRETER_SWITCH_EXACT0_O01_O07_CAUSAL_RED_O08_GREEN_V1_INVARIANCE_CLOSURE_EXACT1_OR_TYPED_NONCREDIT_STOP_AND_POSTVERIFICATION_ONLY

pytest invocation:
exact1 consumed

same-authority rerun:
exact0

terminal:
R1_PYTEST_LAUNCH_OR_COLLECTION_NONCREDIT_STOP

D1 causal-RED refreeze:
NOT_ESTABLISHED
```

The R1 permission is closed.  Its expected O01–O07 causal-RED plus O08 GREEN
vector was not observed.  No part of the expected vector is credited from the
fact that pytest collected eight items.

## 2. Retained inputs

The following evidence remains valid at the R1 pre-launch boundary:

```text
Cocolon credited R1 Design commit / tree:
8d56241be3cbdb1ac2f6a1587887ca436c9ff809
06110e9f203a85895d414093dc8f5a60932302fc

Design Receipt blob / raw / delete-self logical SHA-256:
e03578fb656e87fa600b0fa34953ba19e3e85c75
645b002727a9dfd8e96ff125614349dfbdec441b0dc622a8ffe8f060ae0035f5
c2001045328e29f6eaadda2ac115a27acae1bc7887aa937fabb2b4d63b3c6882
```

```text
mashos-api commit / tree:
37eee88c431d1af3f8d2e96f9b0dd8b3d3bc327f
3891b84164ba0063136e47beb93d36798587a568

D1 blob / raw:
c0eb936690a3423ac4615a9aabb37c40cc257324
3536b8a838ffe2ccbe29db69e9c5400c719de8e63ddf83da9ea0f83b94f17d14

lock blob / raw / logical:
0822fcb010985cd0d384f250a9e8a1fe16dc8fd4
9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787
801ba54efc0f6655238d14e7c153fb70b555801489aa8ba028515fc64d9c05f4
```

Owner and independent verifier rederived all retained-runtime exact7 hashes
equal immediately before launch.  Full-root entries remained exact527,
installed rows exact482, distributions/RECORD matches exact5/exact5, and
unowned/unexpected exact0/exact0.  No runtime repair or rematerialization
occurred.

## 3. One-shot observation

```text
process started / completed / timed out / exit code:
true / true / false / 1

stdout bytes / SHA-256:
12856 /
18128e97df97e2496f7e7054c604448eb898196ce57519b05dc97e09f9f45001

stderr bytes / SHA-256:
0 /
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

```text
collection:
exact8

phase-normalized result:
error exact8 / failed exact0 / passed exact0

ordered oracle rows established:
exact0

test bodies / challenge / D1 preflight:
exact0 / exact0 / exact0

neutral remote request / execution:
exact0 / exact0

observation identity / closure:
exact0 / exact0
```

The module fixture compared the collected node ids to its frozen ordered
vector before it called `_acquire_run_observation()`.  The collected values
had a checkout-directory prefix; the frozen values begin at the
repository-relative `ai/tests/` path.  The exact8 count was therefore not an
exact ordered-node identity match.

The body-free Result was published and postfetch exact-equal:

```text
path:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_SameRetainedRuntime_FreshChallenge_Exact8OneShot_Result_20260731.md

commit / tree / blob / raw / bytes:
242d85d6474b0058816c804520d7c8d2f5bc19da
61b6eaeadac847e19145d76086207d0594ffe21e
2a098fb57517b8ce4e517c0bbfdc8c7a4fee5d5c
c8a1971fccf66e12bfe007d590170857b18c5b67898c762b070533db85981b63
7205
```

The canonical Body-free Receipt was published after that Result:

```text
path:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_D1V5_SameRetainedRuntime_FreshChallenge_Exact8OneShot_BodyFree_Receipt_20260731.json

commit / tree / blob / raw / bytes:
af81ceea7022b107304fea966204063441798ffe
1c8db1d5e4a350df8418cbf07ceb3370bf73deb0
49d04991899b5a4bc55d4ffd5e358004e65b80e7
dade13cf7fb02fb4d9df777b1288f66d18327039c33eb12e6e52e76f58b4ef4e
9187

execution observation / Receipt delete-self SHA-256:
7b10c9e9c55c4fa31e4e31908c78be358e16e42f00d61161d729fd34f785808a
ed31017aa72da31c9a2618b647426546dd3ecc0f521ef048dfe934d8dc0ffb07
```

Raw output, absolute runtime/source paths, environment bodies, exception
bodies, and challenge input bytes are not published.

## 4. Direct cause and evidence boundary

### 確認した事実

- `EMPTY_NON_REPOSITORY_DIRECTORY` and the absolute D1 argv token were used as
  frozen;
- each safely observed collected node id included the checkout-directory
  prefix;
- the fixed D1 requires byte-equality with repository-relative node ids;
- fixture setup stopped before challenge, preflight, remote acquisition, or
  O01–O08; and
- retry, fallback, prior-run reuse, rematerialization, interpreter switch,
  source change, and product/governance effect are all exact0.

### 推測

The old launcher contract assumed that empty cwd plus an absolute D1 path
would still yield repository-relative pytest node ids.  The observed prefix is
consistent with pytest deriving file node ids relative to its selected
`rootpath`.  The next Design must verify and freeze that boundary rather than
treat this inference as a new execution permission.

### 華恋の意見

失敗はtest数ではなく、launcherがD1のnode-id identity前提を満たしていなかった
ことです。D1を書き換えて観測結果へ合わせるより先に、固定source rootをpytestの
rootdirとして明示し、空の非repository cwdによる隔離とrepository-relative node-idを
両立させるcommand-only契約をDesignで閉じるのが妥当です。

## 5. Next Design-only reconciliation requirements

The proposed binding is body-free and contains exact8 keys:

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

Canonical fixed-root binding:

```text
schema_version:
cocolon.emlis.nls_v3.recovery_epoch004.d1_v5.pytest_rootdir_binding.v1

rootdir class:
FIXED_SOURCE_REPOSITORY_ROOT

binding byte count / SHA-256:
601 /
c8a56dfaa93db8b31b4908baa0e8b7a9a4bcc6f38d18a83e5f6a6d4635da2aef
```

Exact binding preimage, UTF-8 compact sorted-key JSON with no trailing LF:

```json
{"d1_blob_sha1":"c0eb936690a3423ac4615a9aabb37c40cc257324","d1_raw_sha256":"3536b8a838ffe2ccbe29db69e9c5400c719de8e63ddf83da9ea0f83b94f17d14","d1_relative_path":"ai/tests/test_emlis_nls_v3_recovery_epoch004_operational_admission_v2_event1_connection_actual_git_identity_parent_phase3_red.py","repository_full_name":"MassyuRed/mashos-api","rootdir_class":"FIXED_SOURCE_REPOSITORY_ROOT","schema_version":"cocolon.emlis.nls_v3.recovery_epoch004.d1_v5.pytest_rootdir_binding.v1","source_commit_sha1":"37eee88c431d1af3f8d2e96f9b0dd8b3d3bc327f","source_tree_sha1":"3891b84164ba0063136e47beb93d36798587a568"}
```

The Design must decide and freeze this command-only correction:

```text
<same retained executable> -B -m pytest -q --noconftest \
  -p no:cacheprovider \
  --rootdir=<fixed source repository root> \
  <absolute fixed D1 path> --maxfail=0
```

The body-free proposed logical argv hash is:

```text
45d1b95d0327423969e6383335795dac8911656717025f0d5f9a9151c1dc2e4e
```

Its exact preimage is this compact JSON array with no trailing LF:

```json
["EXECUTABLE_SHA256=9ed008e5a8685235361f0c53771b520ab082dd99a877ad2fd796a93fa4c0b488","-B","-m","pytest","-q","--noconftest","-p","no:cacheprovider","--rootdir=ROOTDIR_BINDING_SHA256=c8a56dfaa93db8b31b4908baa0e8b7a9a4bcc6f38d18a83e5f6a6d4635da2aef","D1_BLOB_SHA1=c0eb936690a3423ac4615a9aabb37c40cc257324","--maxfail=0"]
```

The Design must require:

- rootdir, `MASHOS_API_SOURCE_REPOSITORY_ROOT`, and the base of the exact D1
  relative path to be one no-symlink fixed source root;
- existing D1 ordered-node vector/hash to remain immutable;
- prefix stripping, suffix matching, output-time rewriting, collect-only,
  dry-run, and probe execution exact0;
- mashos-api production/test/fixture/dependency/config/lock change exact0;
- old logical argv hash retained as historical non-credit and never reused;
- no new pytest process, challenge, remote acquisition, or O01–O08 under the
  Design-only authority; and
- a distinct new one-shot token to remain inactive until a later, separate
  Mash approval after the Design exact5 is credited and postverified.

If explicit rootdir cannot satisfy these static constraints, the Design must
stop without guessing and route any D1 v6 test-only refreeze to another
separately approved authority.

## 6. Exactly one next authority

```text
next authority:
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D1_V5_R1_PYTEST_INVOCATION_EXACT1_COLLECTION_EXACT8_MODULE_FIXTURE_SETUP_ERROR_EXACT8_BEFORE_PREFLIGHT_CHALLENGE_REMOTE_AND_O01_O08_NONCREDIT_EMPTY_NONREPO_CWD_ABSOLUTE_D1_PYTEST_ROOTDIR_CHECKOUT_PREFIX_NODEID_MISMATCH_EXPLICIT_FIXED_SOURCE_ROOTDIR_REPOSITORY_RELATIVE_ORDERED_NODEID_LAUNCHER_CANONICALIZATION_AND_DISTINCT_NEW_ONE_SHOT_AUTHORITY_BOUNDARY_RECONCILIATION_DESIGN_READ_ONLY_AND_POSTVERIFICATION_ONLY

state:
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED

authority kind:
DESIGN_ONLY

concrete successor token count:
exact1

new one-shot execution authority token count:
exact0

Cocolon scope after approval:
NEW exact3 / MODIFY append-only exact2

mashos-api change / pytest / challenge / remote acquisition / O01–O08:
exact0 / exact0 / exact0 / exact0 / exact0

automatic progression:
false
```

No corrected D2, stability matrix, Reference/OA, Candidate/Event1, source
lock, product runtime effect, or new one-shot is authorized by this handoff.
