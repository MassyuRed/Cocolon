---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch001_accepted_exact134_sequence_ledger_atomic_publication_reconciliation_design
title: "NLS v3 Step 11 Cycle 001 Recovery Epoch 001 Accepted exact134 / Sequence Ledger / Atomic Publication Contract Reconciliation Design"
revision_date: "2026-07-24"
status: "CONTRACT_RECONCILIATION_DESIGN_FROZEN_RED_NOT_AUTHORIZED_AUTHORITY_STOP"
document_authority: "NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_ACCEPTED_TEST_RUN_EXACT134_SUCCESS_AND_SEQUENCE_EVENT1_EVENT2_SHAREABLE_LEDGER_ATOMIC_PUBLICATION_CONTRACT_RECONCILIATION_DESIGN_READ_ONLY"
body_free: true
automatic_progression: false
cycle001_status: "NOT_ACCEPTED"
source_baseline_status: "UNLOCKED"
---

# NLS v3 Step 11 Cycle 001 accepted exact134 / sequence ledger / atomic publication reconciliation design

## 0. decision

本書は、P1 retry003がevent 1前にSTOPした三つの契約不整合を、
Recovery parent designへ戻して閉じるread-only reconciliation designである。

固定する契約は次のとおりである。

1. `accepted=true`をexact134完全成功のみに限定する。
2. parent §10を満たすevent 1 / event 2共通ledger schemaを定める。
3. event自身のGit blob自己参照を避ける二層artifact modelを定める。
4. 既存P0 parent artifactを遡及作成せず、event 1のimmutable prior anchorにする。
5. event 1をexact2 file、event 2をexact15 fileのsingle-tree /
   single-commit / expected-old-SHA ref transactionで公開する。
6. owner、independent verifier、deterministic publication bundle owner、
   GitHub writerとしての華恋の役割を分離する。
7. future RED、implementation / GREEN、formal P1 retry004を別authorityにする。

本authorityは設計だけをfreezeする。mashos-api source / test / fixture /
sample / manifest / runtimeを変更せず、formal exact134を実行せず、
authority tokenをcommitせず、event、receipt、ledgerを発行しない。

```text
CONTRACT_RECONCILIATION_DESIGN_FROZEN
EXACT134_ACCEPTED_SUCCESS_FIX_NOT_IMPLEMENTED
SEQUENCE_EVENT_V2_NOT_IMPLEMENTED
ATOMIC_PUBLICATION_BUNDLE_NOT_IMPLEMENTED
SUCCESSFUL_STEP0_10_COMPLETION_RECEIPT_COUNT_0
SOURCE_BASELINE_UNLOCKED
SEQUENCE_EVENT_1_NOT_CREATED
SEQUENCE_EVENT_2_NOT_CREATED
FORMAL_EXACT134_NOT_RUN
P2_NOT_AUTHORIZED
CYCLE001_NOT_ACCEPTED
AUTOMATIC_PROGRESSION_FALSE
AUTHORITY_STOP
```

## 1. authority, precedence, and fixed identities

| item | identity |
|---|---|
| approved authority | `NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_ACCEPTED_TEST_RUN_EXACT134_SUCCESS_AND_SEQUENCE_EVENT1_EVENT2_SHAREABLE_LEDGER_ATOMIC_PUBLICATION_CONTRACT_RECONCILIATION_DESIGN_READ_ONLY` |
| Karen-Diary entry | `700f749f5149cac1f8bd4bab8a364d524a56985b` |
| Cocolon entry | `3d91614c5beb73a78b2ebc96b696563ec2f6de4e` |
| mashos-api entry / result | `78276950d0d7650968fe938bc63a6e13455a8d6c` |
| mashos-api tree | `e13b8bcfce4d56ab1b25d0a4309326b8cc36eca2` |
| current formal proof candidate | `nls_v3_rc_0034` |
| Recovery parent design blob | `3333ae29ec0f4e9dde614bc9cd520448f61d2386` |
| prior reconciliation design blob | `f074cdd402eb9f160e6f3fbae67527d386e31161` |
| retry003 STOP result blob | `0ababf0f013366a4d73491eeb36deec7e850a16a` |
| Detailed Design SHA-256 | `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc` |
| shared local Step 11 Plan | 41,460 bytes / SHA-256 `31682e71ac047ac5f2f329d62ebc51b471bdcb00430a6ab35bcfb934c1438ca7` |
| shared local long-term roadmap | 69,980 bytes / SHA-256 `04fb9e4e11af2b1530d03d95d8e959ba644503722f72094a289bde1d4368ce5b` |
| registry SHA-256 | `70a75ae561fad0846604d05b1262615be4c4a16b36b332150f8c7dc04ee71728` |
| formal-node registry SHA-256 | `fbe29ce0b819563cb5db2dc79fec8277b32ae0dea5a3a5cba64230ba4a1f73cf` |
| canonical current closure SHA-256 | `fb04764568424c4ea89a6993ebbaf196275f52d896590d1fcd9c70cbb541ff60` |
| source dependency closure SHA-256 | `02501497a78dd0466ef965cad20d7e2664b560abb1650486ed333f45f53086fe` |

Precedence:

1. Revised Cycle Detailed Design。
2. Recovery parent design blob `3333ae29…`。
3. current reconciliation designは、accepted semantics / event ledger /
   publicationの未定義部分だけを補う。
4. prior reconciliation design blob `f074cdd…`のうち
   「`accepted`はshape/provenance validであり全PASSの別名ではない」という
   §4.2記述は、本書のexact134 accepted-success定義で限定的に置換する。
5. historical artifact、targeted GREEN、run candidateは受入条件を緩和しない。

parentまたはDetailed Designと意味競合した場合は、
`PARENT_DESIGN_CONFLICT_STOP`とする。

shared local materialsは全体接続と長期routeの補助資料として用いる。
normative precedenceはDetailed Design / Recovery parentであり、
local Plan / roadmapを実行authorityやcompletion evidenceへ読み替えない。

## 2. confirmed current facts

### 2.1 current accepted-run contract is fail-open

current accepted owner:

```text
ai/services/ai_inference/
emlis_ai_recovery_epoch001_accepted_test_run_receipt_v3.py
```

Git blob:

```text
66fbb62b02fcab4ac9817cbfe90bb67126144a8d
```

current independent verifier:

```text
ai/tools/
emlis_nls_v3_recovery_epoch001_closure_receipt_verify.py
```

Git blob:

```text
d70c217e6f83148c2d0db4fe9e1e1f793e687158
```

両者のpartial判定は、完全成功を要求せず、主に次だけを拒否する。

```text
passed == 134 AND exit_code != 0
failed > 0 AND exit_code == 0
```

そのため、nested hashを再計算した
`passed=133 / failed=1 / exit_code=1`、skip / xfail / xpassを含むrun、
`NOT_EXECUTED`を含む整合したfailure runからも
`accepted=true` receiptを構成できる。

Step receipt ownerとindependent verifierのStep-level predicateはfull
exact134を別途要求するため、false acceptedが直ちにall11へ進むわけではない。
しかしaccepted receipt単体の意味はfail-openである。

またPythonでは`False == 0`であるため、countsの値型を
`type(value) is int`で閉じないdict equalityだけではboolean zeroを拒否できない。

### 2.2 current event 1 is not parent-compliant

current event 1 exact keysetはsource commit / tree、closure、registry、
authority、challenge、body-free、event hashを持つ一方、parent §10が要求する
少なくとも次を持たない。

- state;
- timestamp;
- prior-event identity;
- body-free evidence artifact path / Git blob。

runnerとindependent verifierも同じ不足schemaを受理する。
current event 1はin-memory objectであり、Cocolon上のpublished
path/blob/commitを消費条件にしていない。

### 2.3 current event 2 / publication is only a candidate

current all11 owner:

```text
ai/tools/
emlis_nls_v3_recovery_epoch001_all11_receipt_issue.py
```

Git blob:

```text
d3822a01d1b69f0fcbcba9543db4dca13049425f
```

同ownerはowner / verifierがacceptしたexact11をmemory内でstageし、
`publication_state=STAGED_NOT_PUBLISHED`を必須にする。

`required_sequence_event_2`はevent name / ordinal / event1 hashだけの
3-field candidateであり、timestamp、authority、artifact identity、
event hash、Git publicationを持つledger eventではない。

filesystem / GitHub write path、deterministic publication bundle、
single-ref CAS owner、post-publication verifierはcurrent bytesに存在しない。

### 2.4 current execution state

```text
G1:
IMPLEMENTATION_GREEN_CURRENT_STEP_RECEIPTS_NOT_ISSUED_NOT_COMPLETED

G2:
BLOCKED_PRE_EVENT1_PROOF_LEDGER_PUBLICATION_CONTRACT_NONCONFORMANCE

STEP5:
TARGETED_EXACT7_GREEN_FORMAL_COMPLETION_NOT_COMPLETED

SUCCESSFUL_STEP0_10_COMPLETION_RECEIPT_COUNT:
0

SOURCE_BASELINE:
UNLOCKED

SEQUENCE_EVENT_1 / SEQUENCE_EVENT_2:
NOT_CREATED / NOT_CREATED

FORMAL_EXACT134:
NOT_RUN_PRE_EVENT1_CONTRACT_STOP

BROAD_REGRESSION:
NOT_RUN_NOT_CLAIMED

P1_RETRY002:
ADMISSION_STOPPED_NOT_COMPLETED

P1_RETRY003:
PRE_EVENT1_CONTRACT_NONCONFORMANCE_STOPPED_NOT_COMPLETED

P2:
NOT_AUTHORIZED

CYCLE001:
NOT_ACCEPTED
```

### 2.5 current candidate lineage

current canonical-current-closure owner、exact11 registry、accepted owner、
proof runner、independent verifierは
`candidate_version_id=nls_v3_rc_0034`へ一致している。

既存prerequisite-era
`emlis_ai_recovery_epoch001_source_baseline_manifest_v3.py`の
`nls_v3_rc_0032`はhistorical candidate source manifest identityであり、
future event 1 / accepted-run / Step/all11のcurrent formal candidateへ
再使用しない。

## 3. exact134 accepted-success contract

### 3.1 semantic decision

future schema:

```text
cocolon.emlis.nls_v3.recovery_epoch001.accepted_test_run_receipt.v2
```

`accepted=true`はprovenance shapeだけでなく、次の完全な論理積を意味する。

```text
all owner provenance checks valid
AND all independent provenance checks valid
AND collection_node_ids == frozen exact134 in registry order
AND executed_node_ids == frozen exact134 in registry order
AND outcome node IDs == frozen exact134 in registry order
AND len(outcomes) == 134
AND every outcome.result == PASSED
AND every dedicated-negative actual_closed_code == expected_closed_code
AND counts == {
  collected: 134,
  executed: 134,
  passed: 134,
  failed: 0,
  skipped: 0,
  xfailed: 0,
  xpassed: 0,
  deselected: 0,
  collection_errors: 0,
  timeouts: 0
}
AND every count has type int and is not bool
AND exit_code has type int and is not bool
AND exit_code == 0
AND timed_out is False
AND run_start == run_end == clean locked-source binding
AND event/source/tree/closure/registry/runner/environment/file/hash/body-free checks pass
```

`FAILED / SKIPPED / XFAILED / XPASSED / NOT_EXECUTED`は一件でもaccepted不可。
accepted ownerのrun admission、accepted owner validator、
independent verifierの三箇所で、同じ意味を別実装で閉じる。

### 3.2 run-attempt separation

runnerの一次出力はaccepted receiptではなく、body-free
`formal_test_run_attempt.v2` materialとする。

run-attemptは次を持つ。

- exact authority token / challenge / attempt ID;
- published event 1 path / blob / event hash / Cocolon publication commit;
- source commit / tree / closure / registry roots;
- exact collection / execution / outcome;
- runner environment profile material and its recomputed hash;
- run start / end binding;
- counts / exit code / timeout;
- `outcome_state = SUCCEEDED | FAILED | TIMED_OUT | INFRA_ERROR`;
- `run_started_at_utc / run_finished_at_utc`;
- canonical attempt hash。

`SUCCEEDED`かつ§3.1 exact predicate成立時だけaccepted receiptを構成する。
failure attemptから`accepted=true`を作らない。

successful attemptでは、accepted receipt v2がattempt materialをlosslessに
保持し、`formal_test_run_attempt_sha256`へbindする。したがってsuccess側で
attemptとaccepted receiptを二つのshareable fileへ重複公開しない。
accepted receiptのCocolon path / blob / raw SHAがsuccessful run evidenceの
shareable artifact identityになる。

failure時:

```text
ACCEPTED_TEST_RUN_RECEIPT:
NOT_ISSUED

STEP0_10_COMPLETION_RECEIPTS:
NOT_ISSUED

ALL11_CHAIN:
NOT_CREATED

SEQUENCE_EVENT_2:
NOT_CREATED

AUTOMATIC_RETRY / P2:
NOT_AUTHORIZED / NOT_AUTHORIZED
```

body-free failure attemptはappend-only STOP historyへ公開できるが、
successful exact15 bundleまたはsuccessful receipt countへ含めない。

### 3.3 environment binding

今回のrequired environment identity:

1. protocol;
2. runner path / Git blob / SHA-256;
3. exact worker argv hash;
4. isolated worker / detached pinned materialization;
5. plugin autoload / `PYTEST_*` boundary;
6. timeout;
7. formal workerが使用したPython version;
8. formal workerが使用したpytest version;
9. fixed environment fields、removed variable names、inherited PATH digest、
   `LANG / LC_ALL`を含むbody-free profile material;
10. profile materialからowner / verifierが別々に再計算するprofile hash。

OS / kernel / CPU / container image / full dependency inventory、
digital signature、remote attestation、verifierによる二重runは本設計の
required scopeではない。

proof scopeは次に限定する。

```text
BODY_FREE_HASH_BOUND_LOCAL_TRUSTED_ORCHESTRATOR_EVIDENCE
NOT_EXTERNAL_THIRD_PARTY_EXECUTION_ATTESTATION
```

### 3.4 formal test run attempt v2 literal schema

future schema:

```text
cocolon.emlis.nls_v3.recovery_epoch001.formal_test_run_attempt.v2
```

exact top-level keyset:

```text
schema_version
attempt_id
authority_token
challenge_id
authority_challenge_id
candidate_version_id
logical_cycle_id
recovery_epoch_id
source_baseline_event
run_reservation
source_closure
formal_node_registry_sha256
collection_node_ids
collection_sha256
executed_node_ids
executed_node_sha256
runner_environment
run_start
run_end
run_started_at_utc
run_finished_at_utc
outcomes
counts
exit_code
timed_out
outcome_state
stop_code
body_free
formal_test_run_attempt_sha256
```

`source_baseline_event`は§4.6
`PUBLISHED_SEQUENCE_EVENT` exact identityと同じkeysetを用い、
published event 1だけを入れる。`source_closure`、`run_start`、
`run_end`は§4.3 `source_closure` exact keysetを用いる。
top-level `source_closure`はevent 1 lock値、`run_start / run_end`は
actual pre/post-run値である。accepted時は三者exact equalityかつ
`worktree_clean=true`を要求する。

`attempt_id`とfailure path用`authority_challenge_id`は次で決定する。

```text
authority_challenge_id =
  SHA256(canonical_json({
    authority_token,
    challenge_id
  }))

attempt_id =
  SHA256(canonical_json({
    authority_token,
    challenge_id,
    source_baseline_event.event_sha256,
    source_closure.source_commit_sha1,
    formal_node_registry_sha256
  }))
```

同じ`authority_challenge_id`または`attempt_id`の再使用を拒否する。
さらにformal reservation namespaceではauthority token自体をunique keyとし、
一tokenから作れるreservationをexact1に制限する。同tokenへ別challengeを
付けても二件目を作れない。
`run_reservation` exact keys:

```text
artifact_role
schema_version
repository_full_name
path
git_blob_sha1
raw_sha256
logical_artifact_sha256
publication_commit_sha1
body_free
identity_sha256
```

`artifact_role=FORMAL_TEST_RUN_RESERVATION`、schemaは§3.6、
`identity_sha256`は同fieldだけを除いて計算する。
§3.6 published reservation artifactとpath / bytes / commitを含め
exact equalityでなければならない。

`runner_environment` exact keyset:

```text
protocol
python_version
pytest_version
plugin_autoload_disabled
runner_path
runner_git_blob_sha1
runner_sha256
worker_isolated
source_materialization
pytest_addopts_ignored
pytest_plugins_ignored
timeout_seconds
worker_argv_sha256
environment_profile_material
environment_profile_sha256
```

`environment_profile_material` exact keyset:

```text
fixed
removed
inherited_path_sha256
lang
lc_all
```

fixed literal:

```text
fixed = {
  PYTEST_DISABLE_PLUGIN_AUTOLOAD: "1",
  PYTHONDONTWRITEBYTECODE: "1",
  PYTHONHASHSEED: "0",
  PYTHONNOUSERSITE: "1",
  PYTHONUTF8: "1"
}
removed = [
  "PYTHONHOME",
  "PYTHONPATH",
  "PYTEST_ADDOPTS",
  "PYTEST_PLUGINS"
]
lang = "C.UTF-8"
lc_all = "C.UTF-8"
```

`environment_profile_sha256`はこのmaterialから再計算する。
`worker_argv_sha256`は`[-I, -B]`、runner path、worker mode、
registry順exact134 node IDs、literal pytest options
`[-q, --disable-warnings, -p, no:cacheprovider]`から再計算する。
Python / pytest versionはparent start、worker report、parent endの
exact equalityをissuance時に要求し、単なるnon-empty stringを受理しない。

`outcomes`はregistry順exact134 rowで、各row exact keysは次とする。

```text
test_node_id
source_path
source_blob_sha1
source_sha256
result
expected_closed_code
actual_closed_code
evidence_sha256
```

`counts` exact keys:

```text
collected
executed
passed
failed
skipped
xfailed
xpassed
deselected
collection_errors
timeouts
```

全countと`exit_code`は`type(value) is int`かつnon-bool。
`timed_out`はbool。`outcome_state` exact enumは
`SUCCEEDED | FAILED | TIMED_OUT | INFRA_ERROR`である。
`SUCCEEDED`では`stop_code=null`、それ以外は§10のstable STOP codeを
必須にする。timeoutはexit 124、orchestrator infra failureでpytest
exitを取得できない場合はexit 125を用い、いずれもaccepted不可とする。

collection failureまたはinfra failureでも`outcomes`はregistry順exact134を
維持し、未実行nodeを`NOT_EXECUTED`にする。これによりfailure historyから
missing rowを隠さない。

`run_started_at_utc / run_finished_at_utc`はorchestrator内部clockによる
UTC RFC3339 secondsで、caller supplied値を受理しない。
`run_started_at_utc <= run_finished_at_utc`を要求する。

`collection_sha256`、`executed_node_sha256`、各`evidence_sha256`、
`environment_profile_sha256`を下位から再計算した後、
`formal_test_run_attempt_sha256`を同fieldだけ除いたtop-level objectから
計算する。

exact preimage:

```text
collection_sha256 =
  SHA256(canonical_json({"node_ids": collection_node_ids}))

executed_node_sha256 =
  SHA256(canonical_json({"node_ids": executed_node_ids}))

outcome.evidence_sha256 =
  SHA256(canonical_json(outcome minus evidence_sha256))
```

pre-worker infraでtrustworthy `run_start`を取得できない場合、synthetic
bindingやoutcomesを作ってformal attempt schemaへ入れない。
published reservationだけをauthoritative historyとして
`ATTEMPT_CONSUMPTION_UNKNOWN_STOP`にし、same attempt再実行を禁止する。

### 3.5 accepted receipt v2 literal schema

accepted receipt v2 exact top-level keyset:

```text
schema_version
formal_test_run_attempt
formal_test_run_attempt_sha256
step_view_sha256_by_step
proof_sources
proof_source_closure_sha256
accepted
body_free
accepted_test_run_receipt_sha256
```

`formal_test_run_attempt`は§3.4 objectをlosslessに内包する。
外側`formal_test_run_attempt_sha256`は内包objectのhashとexact equality。
`step_view_sha256_by_step`はstring key `"0"`から`"10"`のexact11 mapで、
event 1 source closureから各current Step viewを再導出する。

`proof_sources`はoutcome sourceをpath lexical orderでdeduplicateした
exact rowsであり、row keysetは
`path / git_blob_sha1 / sha256`である。
`proof_source_closure_sha256`はこのexact listから再計算する。

次の全てが成立する時だけbuilderはこのschemaを返す。

```text
formal_test_run_attempt.outcome_state == SUCCEEDED
AND formal_test_run_attempt.stop_code == null
AND §3.1 full exact134 success predicate
AND accepted == true
AND body_free == true
```

failure attemptを`accepted=false`のaccepted schemaとして発行しない。
accepted receiptは成功専用、failure historyは§3.4 attempt schema専用とする。
`accepted_test_run_receipt_sha256`は同fieldだけを除いたobjectから計算する。
Step receipt / all11 ownerはv1 top-level値を暗黙継承せず、
内包attemptとderived exact11 mapをv2 schemaどおり検証する。

hash dependency orderは次で固定する。

```text
outcome evidence hashes
-> environment profile hash
-> formal attempt hash
-> proof-source closure hash
-> accepted receipt hash
-> Step 00..10 receipt hashes
-> all11 chain hash
-> atomic manifest logical hash
-> event 2 hash
```

canonical JSON artifact hash、published raw-file SHA-256、Git blob SHA-1は
別identityである。raw SHA / Git blobは§4.2 published file bytesから計算し、
logical artifact hashの代用にしない。

### 3.6 one-shot formal-run reservation

run開始前に次のbody-free reservationをCocolon mainへ先行公開する。

future schema:

```text
cocolon.emlis.nls_v3.recovery_epoch001.formal_test_run_reservation.v1
```

exact top-level keyset:

```text
schema_version
attempt_id
authority_challenge_id
authority_token
challenge_id
candidate_version_id
logical_cycle_id
recovery_epoch_id
source_baseline_event
source_closure
formal_node_registry_sha256
reserved_at_utc
reservation_state
automatic_progression
body_free
formal_test_run_reservation_sha256
```

fixed:

```text
reservation_state = ONE_SHOT_AUTHORITY_CONSUMED_BEFORE_RUN
automatic_progression = false
body_free = true
```

`attempt_id / authority_challenge_id`は§3.4式、
`source_baseline_event`はpublished event 1 identity、
`source_closure`はevent 1 exact closureとする。
`reserved_at_utc`は内部clockのUTC RFC3339 secondsでcaller supplied値を
受理しない。

reservation pathはimmutableで、§6.2と同じexpected-old-SHA
verified-direct-child transaction / post-verificationを一fileに適用する。
published reservation
成立後だけworkerを開始する。reservation publicationの時点で
authority/challengeは消費済みとなる。

reservation前にCocolon main上のRecovery Epoch 001 reservation artifact
全件を列挙・schema検証し、同じ`authority_token`が一件でもあれば
`RUN_ATTEMPT_REPLAY`でSTOPする。new challenge / new attempt pathは
このtoken-level消費を回避しない。

process crash、host loss、または結果artifact publish不能により
reservationだけが残った場合:

```text
ATTEMPT_CONSUMPTION_UNKNOWN_STOP
SAME_AUTHORITY_CHALLENGE_RERUN_FORBIDDEN
AUTOMATIC_RETRY_FALSE
```

同じreservationでrunを再実行しない。event 1 source closureが不変なら、
別途承認されたnew retry authority / new challenge / new attempt IDだけが
既存event 1を参照できる。

event 1 lock challengeとformal-run challengeは別field / 別purposeであり、
同値を禁止する。first retryではauthority token自体が同じでもよいが、
event 1はbaseline transition、reservationはrun consumptionを証明する。

## 4. sequence ledger v2

### 4.1 two-layer artifact model

parent §10の`body-free artifact path / blob`は、そのtransitionを証明する
primary evidence artifactのidentityとする。event JSON自身のGit blobを
event JSON内へ埋めない。

理由:

```text
event bytes
-> event Git blob
-> event fieldに同じblobを埋める
-> event bytesが変わる
-> blobが変わる
```

これは固定点を要求する自己参照であり、一般には構成不能である。

したがって:

- event 1 primary artifact:
  `source_baseline_closure_receipt.v2`;
- event 2 primary artifact:
  `all11_completion_chain.json`;
- event file自身のpath / blobはGit publication commitとsuccessor
  `prior_event`が記録する;
- `event_sha256`はevent objectから`event_sha256`だけを除いた
  canonical material hashとする。

### 4.2 canonical bytes

全JSON artifactはcurrent NLS v3 canonical codecを用いる。

```text
UTF-8
NFC
sorted keys
compact separators
no NaN / Infinity
canonical material hash has no trailing LF
published file bytes = canonical_json_bytes(value) + exactly one LF
Git blob = SHA-1("blob " + byte_length + NUL + published_file_bytes)
```

body-free validator、exact keyset、canonical file bytes、artifact hash、
Git blobをowner / independent verifierが別々に再計算する。

hash nameごとのmaterialを次で固定する。

```text
<artifact logical hash> =
  SHA256(canonical_json(artifact object minus its own logical-hash field))

raw_sha256 / event_raw_sha256 =
  SHA256(canonical_json(full artifact object) + exactly one LF)

git_blob_sha1 / event_git_blob_sha1 =
  SHA1("blob " + byte_length + NUL
       + canonical_json(full artifact object) + exactly one LF)

prior_event.identity_sha256 =
  SHA256(canonical_json(prior_event object minus identity_sha256))

supporting_artifact_set_sha256 =
  SHA256(canonical_json(supporting_artifacts exact lexical-order list))
```

`event_sha256`もfirst ruleのevent-specific fieldであり、
`event_sha256`だけを除く。logical hash、raw-file hash、Git blob hashを
相互代用しない。

### 4.3 common event exact top-level keys

future common schema:

```text
cocolon.emlis.nls_v3.step11.cycle001.recovery_epoch001.sequence_event.v2
```

exact top-level keyset:

```text
schema_version
ledger_id
event_id
logical_cycle_id
recovery_epoch_id
candidate_version_id
event_name
event_ordinal
state
timestamp_utc
timestamp_kind
authority
challenge_id
source_closure
prior_event
primary_evidence_artifact
publication
automatic_progression
body_free
event_sha256
```

fixed identities:

```text
ledger_id:
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_SEQUENCE_LEDGER

logical_cycle_id:
NLS_V3_CYCLE_001

recovery_epoch_id:
NLS_V3_CYCLE001_RECOVERY_EPOCH_001

candidate_version_id:
nls_v3_rc_0034
```

`event_ordinal`はnon-bool int。
`timestamp_utc`はUTC RFC3339 seconds
`YYYY-MM-DDTHH:MM:SSZ` exact formatとする。

timestampはartifact構築時刻を示す記述fieldであり、publication成立時刻でも
canonical orderの単独authorityでもない。
order authorityはGit commit ancestry、ordinal、prior-event identity、
path/blob/hash一致である。seconds精度のため同秒を許し、
`P0 timestamp <= event 1 timestamp <= event 2 timestamp`を要求する。

`timestamp_kind`は
`ORCHESTRATOR_UTC_BEFORE_REF_UPDATE`とする。builder内部clockから作り、
caller-supplied timestampを受理しない。Git commit server timestampとの
完全一致は要求しない。pre-built eventに将来commit timeを埋めることは
循環的であるためである。

`authority` exact keys:

```text
approval_kind
transition_authority_token
publication_authority_token
```

fixed:

```text
approval_kind = EXPLICIT_SEPARATE_APPROVAL
transition_authority_token = publication_authority_token
```

`source_closure` exact keys:

```text
repository_full_name
source_ref
source_commit_sha1
source_tree_sha1
worktree_clean
canonical_current_closure_sha256
source_dependency_closure_sha256
requirement_registry_sha256
formal_node_registry_sha256
detailed_design_sha256
```

fixed values / interpretation:

```text
repository_full_name = MassyuRed/mashos-api
source_ref = refs/heads/main
worktree_clean = true
```

`source_ref`はhuman-readable discovery refである。immutable authorityは
`source_commit_sha1 / source_tree_sha1`とrecomputed closure rootsであり、
後のmain移動をsource driftへ誤読しない。

`primary_evidence_artifact` exact keys:

```text
artifact_role
schema_version
repository_full_name
path
git_blob_sha1
raw_sha256
logical_artifact_sha256
body_free
```

event 1 fixed evidence:

```text
artifact_role = SOURCE_BASELINE_CLOSURE_RECEIPT
schema_version = cocolon.emlis.nls_v3.recovery_epoch001.source_baseline_closure_receipt.v2
logical_artifact_sha256 = source_baseline_closure_receipt_sha256
```

event 2 fixed evidence:

```text
artifact_role = ALL11_COMPLETION_CHAIN
schema_version = cocolon.emlis.nls_v3.recovery_epoch001.all11_completion_chain.v2
logical_artifact_sha256 = all11_completion_chain_sha256
```

### 4.4 ordinal 0 prior anchor without backfill

Recovery parent §4は後発artifactで前stateを作ることを禁止する。
そのため新しいevent 0 wrapperを作らない。

既存の次のimmutable pairをP0 anchorとする。

| role | path | Git blob |
|---|---|---|
| parent design | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_ProcessNonconformance_CanonicalRecoveryEpoch001_ParentDesignAddendum_ReadOnly_20260723.md` | `3333ae29ec0f4e9dde614bc9cd520448f61d2386` |
| parent receipt | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_ProcessNonconformance_CanonicalRecoveryEpoch001_ParentDesignAddendum_ReadOnly_BodyFree_Receipt_20260723.json` | `bdfbd559535db06ae4af35fe1bb58716d6566126` |

event 1 `prior_event`はtagged
`LEGACY_IMMUTABLE_P0_ANCHOR` objectとし、exact keysを次とする。

```text
identity_kind
event_name
event_ordinal
state
recovery_epoch_id
original_authority
timestamp_utc
document_path
document_publication_commit_sha1
document_git_blob_sha1
document_raw_sha256
receipt_path
receipt_publication_commit_sha1
receipt_git_blob_sha1
receipt_raw_sha256
anchor_publication_commit_sha1
identity_sha256
```

fixed values:

```text
identity_kind = LEGACY_IMMUTABLE_P0_ANCHOR
event_name = PARENT_ADDENDUM_FROZEN
event_ordinal = 0
state = DEFINED_NOT_STARTED
recovery_epoch_id = NLS_V3_CYCLE001_RECOVERY_EPOCH_001
original_authority = NLS_V3_STEP11_CYCLE001_PROCESS_NONCONFORMANCE_CANONICAL_RECOVERY_EPOCH_PARENT_DESIGN_ADDENDUM_READ_ONLY
timestamp_utc = 2026-07-22T22:37:07Z
document_publication_commit_sha1 = 90a2c009b8a463110e01b907224e52ea50912bd8
document_raw_sha256 = 46333ede4b86a9ced0a5223e8df8dea35287548c676ce15c7787602b9a62b45c
receipt_publication_commit_sha1 = f20165e3eda11dc0262373d5f82f63377df76f10
receipt_raw_sha256 = 70563fa0732f97e9c54d3e8371741253e834440a618936e448a31b4d1cf5c30e
anchor_publication_commit_sha1 = f20165e3eda11dc0262373d5f82f63377df76f10
```

`identity_sha256`は同fieldだけを除いたobjectから計算する。
これは既存P0 artifact pairを指すgenesis descriptorであり、新しいP0
transition、published event 0、historical completion、acceptance credit、
backfillではない。

`LEGACY_GENESIS_COMPATIBILITY_RULE`として、既に完了したordinal 0だけは
parent doc + receipt pairをledger genesisとする。genesisにはprior eventが
存在しないため、event 1のprior descriptorがそのimmutable pairを指す。
ordinal 1以降にこの例外を適用せず、late wrapperを作らない。

legacy ancestryは次で固定する。

```text
document_publication_commit_sha1
  ancestor-of receipt_publication_commit_sha1
document path/blob and receipt path/blob
  both reachable from Cocolon main
event1.publication.base_commit_sha1
  descendant-of anchor_publication_commit_sha1
anchor_publication_commit_sha1
  == receipt_publication_commit_sha1
```

### 4.5 event 1

fixed event:

```text
event_id = NLS_V3_CYCLE001_RECOVERY_EPOCH001_EVENT_001_SOURCE_BASELINE_LOCKED
event_name = SOURCE_BASELINE_LOCKED
event_ordinal = 1
state = SOURCE_BASELINE_LOCKED
automatic_progression = false
body_free = true
```

event 1は、final clean mashos-api commit / tree、canonical closure、
dependency closure、registry、formal node registry、Detailed Designを
`source_baseline_closure_receipt.v2`へ固定する。

event 1はそのreceiptのexact path / Git blob / artifact hashを
`primary_evidence_artifact`へ持ち、§4.4 P0 anchorをpriorにする。

event 1がCocolon mainへpublishedされ、path/blob/event hashを再fetchして
owner / verifierが一致確認する前にformal exact134を開始しない。

### 4.6 event 2 prior identity

event 2 `prior_event`はtagged `PUBLISHED_SEQUENCE_EVENT` objectとし、
exact keysを次とする。

```text
identity_kind
ledger_id
recovery_epoch_id
event_id
event_name
event_ordinal
state
timestamp_utc
event_path
event_git_blob_sha1
event_raw_sha256
event_sha256
publication_commit_sha1
identity_sha256
```

fixed prior:

```text
identity_kind = PUBLISHED_SEQUENCE_EVENT
event_name = SOURCE_BASELINE_LOCKED
event_ordinal = 1
state = SOURCE_BASELINE_LOCKED
```

event 1のpublished bytes / blob / event hash / publication commitと
一つでも違えばevent 2を作れない。

sequence validatorは各new eventへ次を機械的に要求する。

```text
current.event_ordinal == prior.event_ordinal + 1
current.recovery_epoch_id == prior.recovery_epoch_id
current publication base commit descends from prior publication commit
prior path / blob / raw hash / logical event hash exact match
event_id and event_path are unique and previously absent
```

本reconciliationがfreezeするordinal 0–2で許すpairは
`LEGACY_IMMUTABLE_P0_ANCHOR -> event 1`と
`PUBLISHED_SEQUENCE_EVENT(event 1) -> event 2`だけである。
missing ordinalのskip、同ordinal再発行、path overwrite、後発artifactによる
欠落event補修を拒否する。
ordinal 3以降は本書のscope外であり、禁止しない。parent state machineと
future separate design / authorityが同じgeneric no-skip invariantを継続する。

### 4.7 event 2

fixed event:

```text
event_id = NLS_V3_CYCLE001_RECOVERY_EPOCH001_EVENT_002_STEP0_10_PREREQUISITES_PROVED
event_name = STEP0_10_PREREQUISITES_PROVED
event_ordinal = 2
state = STEP0_10_PREREQUISITES_PROVED
automatic_progression = false
body_free = true
```

event 2 primary artifactはall11 v2 chainである。
次の全条件成立時だけfinal bytesを構成する。

1. published event 1 identity valid;
2. same locked source;
3. exact134 successful run-attempt;
4. accepted-run owner issue 0;
5. accepted-run independent verifier issue 0;
6. Step 0→10 exact11 owner / verifier issue 0;
7. missing / extra / duplicate / reorder 0;
8. same source / closure / registry / accepted-run root;
9. all receipt `PROVED`, completion true, all STOP false;
10. parent chain exact;
11. Step 10 next authority is P2 separate-approval boundary;
12. supporting exact14 candidate set valid;
13. `event1.timestamp <= reservation.reserved_at_utc <= run_started_at
    <= run_finished_at <= event2.timestamp`;
14. event1 publication commit is an ancestor of reservation publication
    commit, and reservation publication commit is an ancestor of event2
    publication base / commit;
15. event 2 `source_closure`はevent 1とexact equality。

event 2構築後にexact15 candidate validationを行う。exact15自身を
event 2構築の前提へ置かず、§6.2の二段階validationで循環を避ける。

### 4.8 source-baseline closure receipt v2

future schema:

```text
cocolon.emlis.nls_v3.recovery_epoch001.source_baseline_closure_receipt.v2
```

exact top-level keyset:

```text
schema_version
baseline_id
logical_cycle_id
recovery_epoch_id
candidate_version_id
lock_authority_token
lock_challenge_id
source_closure
prior_anchor
automatic_progression
body_free
source_baseline_closure_receipt_sha256
```

`source_closure`は§4.3、`prior_anchor`は§4.4のexact objectである。
`baseline_id`は次のmaterialのcanonical hashとする。

```text
logical_cycle_id
recovery_epoch_id
candidate_version_id
source_closure
prior_anchor.identity_sha256
```

lock authority/challengeはevent 1
`authority.transition_authority_token / challenge_id`とexact equality。
receipt自身はtransitionを成立させない。receipt + event 1 exact2が
mainへatomic publish / post-verifyされた時だけbaseline lockが成立する。

### 4.9 all11 completion chain v2

future schema:

```text
cocolon.emlis.nls_v3.recovery_epoch001.all11_completion_chain.v2
```

exact top-level keyset:

```text
schema_version
candidate_version_id
logical_cycle_id
recovery_epoch_id
source_baseline_event
source_closure
registry_sha256
formal_node_registry_sha256
accepted_test_run_artifact
accepted_test_run_receipt_sha256
receipt_count
ordered_steps
receipts
receipt_artifacts
receipt_sha256s
required_sequence_event_2
next_authority
publication_state
automatic_progression
body_free
all11_completion_chain_sha256
```

`source_baseline_event`はpublished event 1 identity、
`source_closure`はevent 1とexact equality。
`accepted_test_run_artifact`は§4.3 artifact identity rowで、
accepted v2 exact path / blob / raw SHA / logical receipt hashを持つ。

`receipts`はStep 00→10のcurrent receipt exact11を順序どおりlosslessに
含む。`receipt_artifacts`は同じ順序のartifact identity exact11、
`receipt_sha256s`は同じ順序のlogical receipt hash exact11である。
embedded receipt、artifact file bytes、artifact identity、hashの
一つでも異なればchainを作らない。

`required_sequence_event_2` exact keys:

```text
event_id
event_name
event_ordinal
state
prior_event_identity_sha256
```

fixed:

```text
event_id = NLS_V3_CYCLE001_RECOVERY_EPOCH001_EVENT_002_STEP0_10_PREREQUISITES_PROVED
event_name = STEP0_10_PREREQUISITES_PROVED
event_ordinal = 2
state = STEP0_10_PREREQUISITES_PROVED
prior_event_identity_sha256 = published event 1 identity_sha256
next_authority = NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_P1_EXIT_TO_P2_SEPARATE_APPROVAL_ONLY
publication_state = PUBLISHED_ATOMIC
automatic_progression = false
body_free = true
```

`PUBLISHED_ATOMIC`は§6.2 post-publication validator成立時だけ有効になる
prospective record assertionである。candidate validatorはbytes/hash/bundle
整合だけを返し、published/completedを返さない。
`all11_completion_chain_sha256`は同fieldだけを除いて計算する。

### 4.10 atomic publication manifest v2

future schema:

```text
cocolon.emlis.nls_v3.recovery_epoch001.all11_atomic_publication_manifest.v2
```

exact top-level keyset:

```text
schema_version
candidate_version_id
logical_cycle_id
recovery_epoch_id
source_baseline_event
base_commit_sha1
core_artifact_count
core_artifacts
core_artifact_set_sha256
event_supporting_artifact_count
expected_changed_path_count
event_path
ref_update_mode
body_free
atomic_publication_manifest_sha256
```

`core_artifacts`はaccepted exact1 + Step exact11 + all11 chain exact1の
artifact identity exact13をpath lexical orderで持つ。

```text
core_artifact_count = 13
event_supporting_artifact_count = 14
expected_changed_path_count = 15
```

manifest自身とevent 2自身のblobをmanifest内部へ入れない。
`event_path`は§5.2 exact event2 pathだけを持つ。
`core_artifact_set_sha256`はcore exact13 list、
`atomic_publication_manifest_sha256`は同fieldだけを除いたmanifest
objectから計算する。

## 5. exact Cocolon publication paths

既存Cocolon conventionへ合わせ、flat
`EmlisAIの実装済み資料/documents/` namespaceを用いる。次のevent bundle
exact17 targetはfixed entry headで全て不存在を確認した。

### 5.1 event 1 atomic unit: exact2

```text
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_SourceBaselineClosure_BodyFree_Receipt_20260724.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_SequenceEvent01_SourceBaselineLocked_BodyFree_Event_20260724.json
```

changed path countはexact2。既存pathのupdate / overwriteは禁止する。

### 5.2 event 2 atomic unit: exact15

```text
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_AcceptedTestRunExact134_BodyFree_Receipt_20260724.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_Step00_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260724.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_Step01_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260724.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_Step02_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260724.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_Step03_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260724.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_Step04_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260724.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_Step05_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260724.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_Step06_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260724.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_Step07_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260724.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_Step08_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260724.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_Step09_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260724.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_Step10_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260724.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_All11CompletionChain_BodyFree_Chain_20260724.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_All11AtomicPublication_BodyFree_Manifest_20260724.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_SequenceEvent02_Step0_10PrerequisitesProved_BodyFree_Event_20260724.json
```

accepted exact1、Step receipt exact11、all11 chain exact1、atomic manifest
exact1のsupporting artifact exact14とevent 2 exact1を同一commitへ入れる。
existing path update、partial publication、contents APIによるsequential
publicationは禁止する。

atomic manifestはaccepted + Step 00–10 + all11 chainのcore exact13を
path / blob / raw SHA / logical hashで列挙する。manifest自身とevent2自身の
blobを内部へ持たない。event2 `publication`がmanifestを含むsupporting
exact14とevent pathを固定し、post-publication Git treeがmanifest/event2の
外部identityを証明する。

### 5.3 one-shot reservation and failed attempt history

各formal runはrun前reservationと、failure時だけのattempt STOPを
次のdeterministic grammarへ分離する。

```text
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_Attempt_<64hex_attempt_id>_FormalTestRunReservation_BodyFree_Receipt_20260724.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_Attempt_<64hex_attempt_id>_FormalTestRunAttemptSTOP_BodyFree_Receipt_20260724.json
```

reservationはrun前に必須である。successful attemptはaccepted receiptへ
lossless embedするため、成功attemptの別fileは作らない。
同pathにaccepted receipt、Step receipt、all11、event 2を置かない。
同attempt pathのoverwriteは禁止する。
formal challenge / attempt IDは未発行であるため、本authorityではdynamic
instance pathの不存在をclaimしない。future reservation直前にexact pathを
mainで確認する。

## 6. publication contract

### 6.1 publication contract exact keys

event内`publication` exact keys:

```text
repository_full_name
branch
base_commit_sha1
event_path
supporting_artifact_count
supporting_artifacts
supporting_artifact_set_sha256
expected_changed_path_count
ref_update_mode
publication_state
```

fixed:

```text
repository_full_name = MassyuRed/Cocolon
branch = main
ref_update_mode = EXPECTED_OLD_SHA_LEASE_WITH_VERIFIED_DIRECT_CHILD
publication_state = PUBLISHED_ATOMIC
```

`supporting_artifacts`はpath lexical orderのclosed listで、各rowは
`primary_evidence_artifact`と同じexact keysを持つ。

path familyからartifact identity fieldを次へliteral固定する。

| path family | artifact_role | schema_version | logical_artifact_sha256 source field |
|---|---|---|---|
| `SourceBaselineClosure_BodyFree_Receipt` | `SOURCE_BASELINE_CLOSURE_RECEIPT` | `cocolon.emlis.nls_v3.recovery_epoch001.source_baseline_closure_receipt.v2` | `source_baseline_closure_receipt_sha256` |
| `AcceptedTestRunExact134_BodyFree_Receipt` | `ACCEPTED_TEST_RUN_RECEIPT` | `cocolon.emlis.nls_v3.recovery_epoch001.accepted_test_run_receipt.v2` | `accepted_test_run_receipt_sha256` |
| `Step00`…`Step10_CurrentStepCompletion_PROVED_BodyFree_Receipt` | `CURRENT_STEP_COMPLETION_RECEIPT` | `cocolon.emlis.nls_v3.recovery_epoch001.current_step_completion_receipt.v1` | `receipt_sha256` |
| `All11CompletionChain_BodyFree_Chain` | `ALL11_COMPLETION_CHAIN` | `cocolon.emlis.nls_v3.recovery_epoch001.all11_completion_chain.v2` | `all11_completion_chain_sha256` |
| `All11AtomicPublication_BodyFree_Manifest` | `ALL11_ATOMIC_PUBLICATION_MANIFEST` | `cocolon.emlis.nls_v3.recovery_epoch001.all11_atomic_publication_manifest.v2` | `atomic_publication_manifest_sha256` |

Step exact11はpath内step numberとreceipt `step_number`のexact equalityを
追加で要求する。accepted、Step exact11、chain、manifest以外をevent2
supporting exact14へ入れない。

event 1:

```text
supporting_artifact_count = 1
expected_changed_path_count = 2
```

event 2:

```text
supporting_artifact_count = 14
expected_changed_path_count = 15
```

final bytesはref update前にはunreachable candidateである。
candidate validatorの成功状態は
`CANDIDATE_UNREACHABLE_VALID_NOT_PUBLISHED`だけであり、
`PUBLISHED_ATOMIC`をcurrent factとしてclaimしない。
main refのexpected-old-SHA updateとpost-verification成功で初めて
published validatorが`PUBLISHED_ATOMIC_VALID`を返し、record semanticsが
有効になる。orphan blob / tree / commitはpublication、event、receipt
countへ含めない。

### 6.2 Git object / expected-old ref exact transaction

future publication executorは次を順序固定する。

1. Cocolon `main` current head `H0`とcommit tree `T0`を取得する。
2. target pathが全て不存在であることを確認する。
3. deterministic bundle ownerがsupporting set
   （event1 exact1 / event2 exact14）のpath / canonical bytes /
   logical hash / expected raw SHA / Git blobを返す。
4. supporting-set owner validatorとindependent verifierのissue exact0を
   確認する。
5. event bytesを構築し、complete candidate
   （event1 exact2 / event2 exact15）のowner / independent issue exact0と
   `CANDIDATE_UNREACHABLE_VALID_NOT_PUBLISHED`を確認する。
6. exact file blobsを作る。
7. `base_tree=T0`として一つのtree `T1`を作る。
8. parent exact1=`H0`、tree=`T1`のcommit `C1`を作り、direct-child、
   tree、changed path exact setをref update前に再検証する。
9. ref update直前にmain headを再取得し、`H0`でなければ
   `PUBLICATION_HEAD_DRIFT_STOP`。
10. expected old SHA=`H0`をserver-sideで比較するleaseを用い、
    verified direct child `C1`へmainを一回だけ更新する。
11. main=`C1`、parent=`H0`、changed path exact set、
    file bytes / blob / artifact hashを再取得して検証する。
12. 一項でも不一致ならcompletionをclaimせず
    `PUBLICATION_POSTVERIFY_CONFLICT_STOP`。

単なる`force=false` fast-forward checkはexpected-old-SHA CASではない。
8と10の間にrefがancestorへforce-rewindされた場合、target `C1`が
fast-forwardとなり得るためである。したがってprecheck +
`update_ref(force=false)`だけをCASと呼ばない。

current GitHub connectorではblob / tree / commit作成と
`update_ref(force=false)`は見える一方、read-only確認時の
`fetch_commit` responseからbase tree SHAを取得する経路と
expected-old-SHA lease fieldは確認できていない。

future D1 / D2は、次のいずれか一つをcausal GREENにする必要がある。

1. explicit `expected_old_sha=H0`とnon-fast-forward禁止を同時に持つ
   authenticated ref API;
2. authenticated Git receive-packでexact lease
   `refs/heads/main:H0`を送り、target `C1`がverified direct childである
   ことを別検証するroute。

Git CLIの`--force-with-lease=<ref>:H0`を使う場合、その`force`名を
history rewrite許可へ読み替えない。C1 parent exact1=`H0`、
changed path exact set、mergeなしを事前検証し、lease mismatchでは
必ずSTOPする。unleased force、non-descendant target、history rewriteは
常に禁止する。

能力が確認できなければformal P1はevent1前でSTOPする。
sequential Contents API、unleased force、non-descendant update、
未検証のbase treeへfallbackしない。

### 6.3 all11 publication-state reconciliation

all11 v2 final artifactは
`publication_state=PUBLISHED_ATOMIC`を持つ。

このfieldをmemory staging時点の事実として扱わない。
exact15 commitがmainへreachableになり、post-verificationが成立した時だけ
published stateがtrueになる。

current v1 `STAGED_NOT_PUBLISHED` candidateをv2 published artifactへ
手動で読み替えない。

### 6.4 reflection after atomic checkpoint

event 1 / event 2 atomic commitへExecution Planやlatest snapshotを混ぜない。
atomic post-verification後、Cocolon作業規約に従って別documentation commitで
Plan / snapshotを更新できる。

documentation reflection失敗をevent commitのpartial publicationへ
読み替えない。一方、reflectionが未完なら作業handoffはSTOPとして残す。

## 7. owner and role separation

### 7.1 future mashos-api owners

existing paths to modify:

```text
ai/services/ai_inference/emlis_ai_recovery_epoch001_accepted_test_run_receipt_v3.py
ai/services/ai_inference/emlis_ai_recovery_epoch001_step_completion_receipt_v3.py
ai/tools/emlis_nls_v3_recovery_epoch001_current_step_proof_run.py
ai/tools/emlis_nls_v3_recovery_epoch001_all11_receipt_issue.py
ai/tools/emlis_nls_v3_recovery_epoch001_closure_receipt_verify.py
ai/tests/test_emlis_nls_v3_recovery_epoch001_proved_receipt_contract_red.py
ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py
```

new candidate paths:

```text
ai/services/ai_inference/emlis_ai_recovery_epoch001_sequence_ledger_v3.py
ai/tools/emlis_nls_v3_recovery_epoch001_atomic_publication_bundle_v3.py
ai/tests/test_emlis_nls_v3_recovery_epoch001_exact134_accepted_success_red.py
ai/tests/test_emlis_nls_v3_recovery_epoch001_sequence_ledger_publication_red.py
```

Responsibilities:

| role | responsibility |
|---|---|
| proof runner | published event1 identityを消費し、一つのbody-free run-attemptを生成 |
| accepted owner | §3.1完全predicate成立時だけv2 accepted receiptを構築 |
| sequence ledger owner | event1 / event2 exact schema、prior、artifact、hashを構築・validate |
| Step/all11 owner | accepted v2からordered exact11とall11 v2を構築 |
| publication bundle owner | exact2 / exact15 path→canonical bytes→expected blob mapをdeterministicに構築。Git writeはしない |
| independent verifier | owner modulesのbuilder/validatorをimportせず、source bytes / schema / hash / chain / bundleを別実装で再計算 |
| 華恋 | GitHub read、bundle最終照合、single tree/commit/ref write、post-verification、Cocolon reflection |

subagentはread-only監査だけを行い、source変更、test実行、commit、
GitHub write、最終判定を行わない。

### 7.2 closure inclusion

新旧owner、runner、independent verifier、RED tests、publication bundle toolを
canonical current proof closureとper-Step relevant closureへlosslessに含める。

ownerとverifierが同じbuilder / validator / path list constant /
publication-set constructorを共有して独立性を失う構成は禁止する。
canonical JSON codecとcryptographic primitiveの共有だけをallowlistとする。

## 8. authority, challenge, retry, and state rules

### 8.1 authority separation

future sequence:

```text
D1 RED freeze only
-> AUTHORITY STOP
-> D2 implementation and targeted GREEN only
-> AUTHORITY STOP
-> P1 retry004 only
-> event1 / exact134 / exact11 / event2 or STOP
-> AUTHORITY STOP
-> P2 separate approval only
```

D1 / D2はformal P1 tokenをcommitせず、event / accepted receiptを発行しない。

reserved future formal P1 token:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_SOURCE_BASELINE_AND_STEP0_10_COMPLETION_RECEIPT_GENERATION_AND_VERIFICATION_RETRY004_ONLY
```

これは本書では選定候補として固定するが、承認済み・active・committedではない。

### 8.2 event1 and later retry

event1はbaseline transitionであり、一つのepochに一件だけである。
run attemptは§3.6 reservationでexact authority / challengeごとに
永続的に一回へ制限する。

retry004がevent1後に失敗した場合:

- published reservationを保持する;
- failure attemptをappend-onlyに残す;
- event2を作らない;
- automatic retryをしない;
- source closureが不変なら、別承認されたretry005等が既存event1を
  明示参照できる;
- new attempt authorityはevent1作成authorityと異なってよい;
- accepted receiptはevent1 lock authorityとcurrent run authorityを
  混同せず双方へbindする;
- source / proof-system / registry driftがあればevent1を再利用せず
  epoch invalidation / separate recovery decisionへSTOPする。

同じauthority / challengeの再実行、silent retry、best-of-run選択は禁止する。
reservation後にattempt artifactがない場合も消費済みとし、
`ATTEMPT_CONSUMPTION_UNKNOWN_STOP`から同じattemptを再開しない。

## 9. causal RED matrix

semantic mutationはnested attempt / outcome / receipt / event hashを
正しく再計算し、stale-hash rejectionだけでGREENにしない。
ownerとindependent verifierへ別々に適用する。

| ID | attack / missing evidence | required closed result |
|---|---|---|
| A01 | 133 pass + 1 failed + exit1 | accepted not issued / `RUN_PARTIAL` |
| A02 | 133 pass + 1 skipped + exit0 | accepted not issued / `RUN_PARTIAL` |
| A03 | 133 pass + 1 xfailed + exit0 | accepted not issued / `RUN_PARTIAL` |
| A04 | 133 pass + 1 xpassed + exit0 | accepted not issued / `RUN_PARTIAL` |
| A05 | 1 `NOT_EXECUTED` + failed1 + exit1 | accepted not issued / `RUN_PARTIAL` |
| A06 | 134 pass + exit1 | accepted not issued / `RUN_PARTIAL` |
| A07 | timeout true / timeouts1 / exit124 | `RUN_TIMED_OUT` |
| A08 | collection_errors1 | `RUN_COLLECTION_ERROR` |
| A09 | deselected1 | `RUN_PARTIAL` |
| A10 | collection/execution missing, duplicate, reorder | node-set mismatch |
| A11 | zero countをboolean `False`へ置換 | type invalid |
| A11a | `exit_code=True / False` | type invalid |
| A11b | `timed_out=0 / 1` | type invalid |
| A11c | event/attempt epochまたはordinalをboolへ置換 | type invalid |
| A12 | outcome missing, duplicate, reorder, count mismatch | outcome invalid |
| A13 | dedicated-negative actual code mismatch | outcome invalid |
| A14 | event/source/tree/closure/registry/start-end drift | exact binding rejection |
| A15 | pytest version/profile/runner/argv drift | environment invalid |
| A16 | attempt/outcome/receipt hash drift | hash mismatch |
| A17 | forbidden body field/value | body-free violation |
| A18 | `accepted=false`またはfailure attemptをaccepted schemaへ変換 | accepted not issued |
| A19 | rehashしたfalse acceptedをStep 0 / all11へ直接注入 | Step/all11 input rejected |
| A20 | malformed / non-UTC / caller-supplied reservation/run timestamp | timestamp invalid |
| A21 | `SUCCEEDED` + non-GREEN count、または`FAILED` + full GREEN | state/count conflict |
| L01 | event1 missing state/timestamp/prior/artifact | event schema invalid |
| L02 | ordinal / epoch numeric fieldにbool | event type invalid |
| L03 | malformed/non-UTC/non-monotonic timestamp | timestamp invalid |
| L04 | P0 anchor path/blob drift | prior identity invalid |
| L05 | new late event0 wrapperでP0を作成 | backfill forbidden |
| L06 | event自身のblobをself fieldへ要求 | self-reference contract invalid |
| L07 | event2 wrong event1 path/blob/hash/commit | prior event invalid |
| L08 | event2 before event1 publication | sequence invalid |
| L09 | primary artifact path/blob/hash mismatch | artifact identity invalid |
| P01 | event1 changed path count !=2 | publication set invalid |
| P02 | event2 changed path count !=15 | publication set invalid |
| P03 | supporting path missing/extra/duplicate/reordered | publication set invalid |
| P04 | sequential contents writes / partial 1..14 visibility | publication conflict |
| P05 | Cocolon head drift before ref update | CAS STOP |
| P06 | unleased force / lease mismatch / non-direct-child / non-single-parent commit | publication conflict |
| P07 | orphan objectをpublished扱い | publication state invalid |
| P08 | path already exists / overwrite | immutable path conflict |
| P09 | post-fetch blob/bytes/hash/compare mismatch | postverify conflict |
| P10 | current `STAGED_NOT_PUBLISHED`をpublished扱い | publication conflict |
| S01 | Step missing/extra/duplicate/reorder | all11 incomplete |
| S02 | receipt root/parent/next authority conflict | all11 invalid |
| S03 | owner/verifier disagreement | event2 forbidden |
| S04 | Step10からP2自動開始 | P2 not authorized |
| S05 | accepted v2を介さずattemptをStep/all11へ入力 | accepted input required |
| R01 | same token/challenge silent rerun | attempt replay forbidden |
| R02 | failed attemptを隠してbest-of-run選択 | attempt history conflict |
| R03 | run前reservation missing / unpublished / identity・timestamp・ancestry drift | run admission forbidden |
| R04 | reservation後result不在でsame attempt再実行 | `ATTEMPT_CONSUMPTION_UNKNOWN_STOP` |
| R05 | same formal authority token + different challengeで二件目を予約 | authority already consumed |

## 10. STOP taxonomy

future owner / verifier / publisherは少なくとも次を区別する。

```text
RUN_PARTIAL
RUN_TIMED_OUT
RUN_COLLECTION_ERROR
RUN_INFRA_ERROR
RUN_PROVENANCE_INVALID
RUN_ATTEMPT_REPLAY
RUN_RESERVATION_INVALID
ATTEMPT_CONSUMPTION_UNKNOWN_STOP
ACCEPTED_RECEIPT_NOT_ISSUABLE
EVENT_SCHEMA_INVALID
EVENT_TIMESTAMP_INVALID
PRIOR_EVENT_INVALID
P0_BACKFILL_FORBIDDEN
ARTIFACT_IDENTITY_INVALID
SEQUENCE_INVALID
ALL11_INCOMPLETE
OWNER_VERIFIER_CONFLICT
PUBLICATION_BUNDLE_INVALID
PUBLICATION_PATH_CONFLICT
PUBLICATION_HEAD_DRIFT_STOP
PUBLICATION_REF_UPDATE_FAILED_STOP
PUBLICATION_POSTVERIFY_CONFLICT_STOP
BODY_FREE_VIOLATION
SOURCE_OR_ROOT_DRIFT
P2_NOT_AUTHORIZED
```

failureはlate artifactでsuccessへ書き換えず、別authority判断までSTOPする。

## 11. future completion criteria

reconciliation implementation / GREENが完了と言えるのは次の全てが成立した場合だけ。

1. accepted v2が§3.1 exact predicateだけをacceptする。
2. counts / ordinal / epoch / exitのbool confusionが閉じる。
3. one-shot reservation、attempt、accepted receiptが分離する。
4. event 1 / 2 common schema v2がparent §10全fieldを持つ。
5. P0 legacy genesis compatibilityとimmutable anchorがbackfillなしで固定される。
6. primary evidence artifact分離によりself-referenceがない。
7. event1 exact2 / event2 exact15 pathsがliteralに固定される。
8. deterministic bundle ownerとindependent bundle verifierが別実装で一致する。
9. single-tree / single-commit / expected-old-SHA lease contractがREDで固定される。
10. all11 v2 published semanticsがmain reachability / postverifyに依存する。
11. failed runからaccepted / Step / all11 / event2が発行不能である。
12. same formal authority tokenのchallenge違いを含むreplayと
    silent best-of-runが拒否される。
13. public API / DB / RN / Safety / v1 product behavior change 0。
14. private body / exact100 / Product Read generation 0。
15. targeted GREENだけをformal exact134またはbroad regressionへ読み替えない。

D1 / D2 completionでもsource baselineは`UNLOCKED`、successful receiptは0、
formal exact134は未実行のままとする。

## 12. confirmed facts / inference / Karen opinion / unconfirmed

### 12.1 confirmed facts

- current accepted owner / verifierはfull exact134 successを強制しない。
- Step receipt側はfull exact134を別途要求する。
- current event1 schemaはparent §10 fieldが不足する。
- current all11 ownerは`STAGED_NOT_PUBLISHED`だけを返す。
- parent-compliant event2 / atomic publisherは存在しない。
- current formal candidateは`nls_v3_rc_0034`である。
- P0 parent doc / receiptは既存immutable Git blobsとして存在する。
- event1 / event2、accepted run、successful Step receiptは0件である。
- source baselineは`UNLOCKED`、Cycle 001は`NOT_ACCEPTED`である。
- 本authorityでmashos-api変更、test、formal run、private body生成は0である。

### 12.2 inference

targeted exact36 GREENとformal registryの静的整合から、formal runnerは
実行可能と推測する。しかしexact134を実行していないため、
GREEN、accepted、またはall11発行可能とは推測しない。

Git objectのcontent addressingとexpected-old-SHA ref leaseを用いれば、
partial per-file visibilityを避けるpublication transactionを構成できる。
ただしcurrent connectorのexpected-old-SHA capability、
future implementation / RED / actual Git ref behaviorは未確認である。

### 12.3 Karen opinion

華恋は、acceptedを「形式が正しいfailure run」にまで広げるべきではないと
判断する。acceptedという名前とformal completionの意味を一致させ、
failureはfailure attemptとして正直に残す方が、後で人の判断により成功へ
読み替える余地を小さくできる。

eventのartifact identityはevent自身ではなくtransition evidenceへ向ける。
これによりparent fieldを削らず、自己参照も避けられる。

また、既存P0を後からwrapperで作り直すことは採用しない。
既存immutable parent pairをlegacy genesis prior anchorとして固定する方が、
「後発artifactで前stateを作らない」というRecovery Epoch 001の責任に合う。

最後に、atomic publicationの核心はAPI名ではなく、
exact bundleを一つのunreachable commitとして組み、main refの一回の
expected-old-SHA lease成功でだけ可視化することである。華恋はbundle内容と
post-fetchを最終確認し、write責任を引き受ける。

### 12.4 unconfirmed

- D1 causal RED;
- D2 implementation / targeted GREEN;
- event1 / event2 v2 actual bytes;
- exact2 / exact15 atomic Git publication;
- formal exact134 result;
- accepted v2 receipt;
- successful Step 0–10 receipt exact11;
- P2 / fresh batch;
- broad regression / formal exact100;
- Product Read / correction / B6;
- Cycle 001 acceptance。

## 13. authority result and next lane

```text
STATUS:
CONTRACT_RECONCILIATION_DESIGN_FROZEN_RED_NOT_AUTHORIZED_AUTHORITY_STOP

MASHOS_API_CHANGE_COUNT:
0

TEST / FORMAL_EXACT134 / BROAD_REGRESSION:
NOT_RUN / NOT_RUN / NOT_RUN_NOT_CLAIMED

SUCCESSFUL_STEP0_10_COMPLETION_RECEIPT_COUNT:
0

SOURCE_BASELINE:
UNLOCKED

SEQUENCE_EVENT_1 / SEQUENCE_EVENT_2:
NOT_CREATED / NOT_CREATED

P1_RETRY003:
PRE_EVENT1_CONTRACT_NONCONFORMANCE_STOPPED_NOT_COMPLETED

P2:
NOT_AUTHORIZED

CYCLE001:
NOT_ACCEPTED

AUTOMATIC_PROGRESSION:
false
```

Exactly one next separate-approval candidate:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_ACCEPTED_TEST_RUN_EXACT134_SUCCESS_AND_SEQUENCE_EVENT1_EVENT2_SHAREABLE_LEDGER_ATOMIC_PUBLICATION_CONTRACT_RECONCILIATION_RED_FREEZE_ONLY
```

この候補は§9 attack matrix、exact future source / test paths、protected set、
reservation / attempt / accepted / event / source-baseline / all11 /
manifest literal schemas、exact2 / exact15 bundle、expected-old-SHA
adversarial contractをcausal REDとしてfreezeするだけである。

implementation、GREEN、token commit、event issuance、formal exact134、
successful receipt、P2、fresh batch、exact100、Product Read、correction、
B6、Cycle acceptanceを承認しない。

STOP. Separate approval required.
