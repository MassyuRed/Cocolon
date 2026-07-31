---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch004_post_d2_actual_git_identity_reproducibility_stability_contract_reconciliation_handoff
title: "Recovery Epoch004 post-D2 actual-Git reproducibility and stability contract reconciliation handoff"
revision_date: "2026-07-31"
status: "READ_ONLY_HANDOFF_STABLE_POSTVERIFIED_CREDIT_NOT_ESTABLISHED_CORRECTED_D1_V5_DEFINED_INACTIVE"
body_free: true
automatic_progression: false
---

# Recovery Epoch004 post-D2 stability reconciliation handoff

## 0. Authority and result

Approved authority:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D2_POSTPUBLICATION_DIAGNOSTIC_FULL_EXACT8_GREEN_NONCREDIT_PRIOR_MIGRATING_O02_O06_FAILURES_NONREPRODUCED_LIVE_REMOTE_EXACT45_MULTICALL_OBSERVATION_LATENCY_ACTUAL_GIT_IDENTITY_REPRODUCIBILITY_AND_STABILITY_CONTRACT_RECONCILIATION_DESIGN_READ_ONLY
```

Result:

```text
published D2 implementation:
RETAINED_IMMUTABLE_TARGETED_GREEN_SOURCE

D2 stable postverified credit:
NOT_ESTABLISHED

historical O02 / O06 direct cause:
NOT_PROVEN

diagnostic full exact8 GREEN:
VALID_DIAGNOSTIC_NON_CREDIT

Reference / OperationalAdmission:
BLOCKED

corrected D1 v5:
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
false
```

This authority is Design-only.  It changes no mashos-api source, test,
fixture, dependency, configuration, or lock file; runs no pytest; and
creates no Reference/OA, Candidate/Event1, source lock, runtime, or later
effect.

The result is complete only after the approved Cocolon NEW exact3 and
MODIFY exact2 are all reachable on main, their exact contents are
postfetch-verified, Karen's write-commit aggregate unique changed-path set
is exact5, and latest contains all results.  A partial publication has no
credit.

## 1. Fixed entry and source identities

```text
Cocolon anchor commit / tree:
d3b4c4a63aa2e00fe09251dbbc2d33c9a91dc2fe
73a349ca167bf6fba81a8786ad6e85013240ad5d

mashos-api commit / tree:
735b1a59e525b6b314fd7139deb653543a74c389
eab4977649d8b31258c12e7ea49e1879c5e4a223

additive corrective P0 external identity:
aa602f6c7c39ea1ad0ece9ed6974c76b7dc8f3a4207540a290e3bb3eb06fe046
```

Current D1 v4 exact1:

```text
path:
ai/tests/test_emlis_nls_v3_recovery_epoch004_operational_admission_v2_event1_connection_actual_git_identity_parent_phase3_red.py

blob / raw:
b7072620c31cd615ab221647c7145947255294e1
e67a26cd72cd8007c58e71a8c4258c0ab3244718717b305289f3ee346eaeb9dc
```

Current D2 mandatory direct exact3:

| Role | Git blob SHA-1 | Raw SHA-256 |
|---|---|---|
| owner | `044287009b1fd155689bded46628b8fc91b73c06` | `13aa675be1356ab524a69066f861c2d27a8d8e32f0d690811b2b3308f199057d` |
| independent | `0fae71a29f8fe44d31c18af42aaf53cc34beac6c` | `634ddb104e0b7630c695e032bb54726912fcfc9ad4351ab0eb6da7901671fc2b` |
| parent | `fdea3dc18d81ca9ce1e3a842e802d21d0019a8c5` | `14fedde39823d90253a6adec6fc05ccde29f05a659edbac7edc007b28eab5793` |

The v1 OperationalAdmission exact16 and predecessor exact8 API,
semantics, ordered sets, and frozen source/closure identities remain
invariant.

## 2. Confirmed diagnostic facts

Canonical uninstrumented history:

```text
full run A:
O06 failed / other exact7 passed

immediate O06-only:
passed

full run B:
O02 failed / other exact7 passed

immediate O02-only:
passed
```

The failing predicates' exact return code, stderr, exception class, and
remote state were not captured.  No direct historical root cause is
therefore proved.

Instrumented diagnostic:

```text
result:
8 passed / 1 warning / 571.48 seconds

Git calls:
7040

completed / exception / nonzero / nonempty stderr:
7040 / 0 / 0 / 0

live ls-remote:
exact45

distinct live remote OID:
exact1

live remote duration:
5.054–9.686 seconds each / 280.701 seconds total

observed main OID:
735b1a59e525b6b314fd7139deb653543a74c389
```

```text
diagnostic Git log raw SHA-256:
4a22e0f1e0ce7731c6c75b244598a1ac09da6da8b8743a59e8fb51e8bbd5d6f7

pytest output raw SHA-256:
92b42bee155c093dca92ebc017d0ae37445428a4d4c5d9c7fda6aeb9e111c939
```

The diagnostic GREEN is valid diagnostic evidence but non-credit.  It
neither replaces the two historical failed full runs nor proves their
cause.

## 3. Design and receipt publication identities

Design:

```text
commit / tree / parent:
6b104ed52b1821912b6dcff638809ff1ff1b4926
ddd995726905cbd91d00f2ecbc97d89fba485dc0
d3b4c4a63aa2e00fe09251dbbc2d33c9a91dc2fe

blob / raw / bytes:
9985eee5c0e4379b916aed4321eacf60cb1e7adf
79d7d677466c6d3d1379bd5377e60ce31fa79abca5bd84790dcdcec535b9b4b8
51222

postfetch exact equal:
true
```

Body-free receipt:

```text
commit / tree / parent:
0df0a41b5b8b89e48f7e9331fad900280c0306e4
928484eaf52b5f83fdf4c07a66d6dcad65a55fd3
6b104ed52b1821912b6dcff638809ff1ff1b4926

blob / raw / bytes:
1d1b4dcf657bc80ce254bfaf96ca1e89272be382
2936e1c29924d026d3ad8dd586136f2ec4bd51eff71ca3d0b5e7dfb2913718fc
7564

delete-self logical:
7c272c084e4400be8ca06628f259ebe2c0a17f75221e46f7fa04d4fc2613ef6e

postfetch exact equal:
true
```

Receipt self-hash deletes `receipt_sha256` and hashes canonical sorted
compact UTF-8 JSON without LF.  The publication file is that canonical
JSON plus exact1 LF.

## 4. Reconciled contract

One canonical run/challenge now has:

```text
preflight:
local deterministic / network exact0

eligible actual-Git remote-main acquisition:
attempt exact1

owner / independent / parent / harness additional query:
exact0

retry / fallback / prior-run reuse:
exact0 / exact0 / exact0
```

Frozen semantic acquisition profile:

```text
profile:
cocolon.emlis.nls_v3.recovery_epoch004.actual_git_ls_remote_main.v1

operation:
resolved actual Git
ls-remote --exit-code origin refs/heads/main

timeout:
exact20 seconds

shell:
false
```

The safe allowed normalized-host set is exact4:
`git.chatgpt-team.site`, `github.com`, `ssh.github.com`, and
`www.github.com`.  Strict UTF-8, exact1 ref row, empty stderr, return code
0, and OID equality with the preflight-frozen local `origin/main` are
required for `AVAILABLE_MATCH`.

Evidence schemas:

```text
preflight:
exact13

transient immutable observation:
exact17

terminal body-free projection:
exact16

matching closure:
exact10 / exact1 per eligible run
```

The owner, independent verifier, parent phase3, and harness consume one
immutable observation identity and one before/after local source cut.
Semantic verdicts remain independent: the independent verifier neither
imports nor forwards the owner result.

## 5. Corrected D1 v5 and later boundary

The corrected D1 remains test-only exact1:

```text
ai/tests/test_emlis_nls_v3_recovery_epoch004_operational_admission_v2_event1_connection_actual_git_identity_parent_phase3_red.py
```

Frozen expected result:

```text
O01–O07:
CAUSAL_RED exact7 with node-specific signature and primary violation

O08:
GREEN v1 invariance

attempt / additional query / retry / prior-run reuse:
exact1 / exact0 / exact0 / exact0
```

The D1 terminal is separate from its expected violation evidence.
Refreeze requires the exact ordered O01–O08 outcome/signature vector,
valid closure exact1, and
`D1_CAUSAL_RED_REFREEZE_ESTABLISHED`.  Transport unavailability,
malformed output, unexpected cause, or another RED/GREEN distribution is
not the frozen causal RED and cannot be retried in the same authority.

Only a later separately approved D2 may implement the D1-proved
production boundary.  Stable postverification then requires a separately
approved, predeclared two-run A/B matrix with a new challenge and exact1
observation per run.  B is allowed only after A is fully evaluable and
GREEN; it is not a compensating retry.

## 6. Independent verification and responsibility

Three read-only subagent lanes checked:

1. exact5 scope, position-change gate, and GitHub reflection boundary;
2. actual-Git consistent-cut/schema/closure contract; and
3. D1 v5 causal signatures and implementation feasibility.

```text
final blocker count:
0

subagent edit / commit / GitHub write:
0 / 0 / 0

subagent pytest collect / execution:
0 / 0
```

Karen re-read the governing material and actual source, independently
checked the decisive facts and hashes, resolved every design conflict,
performed all GitHub writes, and retains final judgment.

## 7. Facts, inference, and Karen's opinion

### Confirmed facts

- two canonical full runs failed at different O06/O02 nodes;
- both immediate selected-node reruns passed;
- the later instrumented full exact8 passed non-credit;
- that run performed exact45 successful identical live observations;
- 280.701 seconds, about half its runtime, was spent in those calls;
- current D1 v4 and D2 exact3 identities are fixed; and
- Reference/OA and every later effect remain blocked.

### Inference

Repeated slow external observation widens the temporal and availability
risk surface and adds material latency.  It is not proved to be the
historical failures' direct cause.

One immutable external fact can preserve owner/independent separation
when each role independently derives its semantic verdict.  Repeating
the network query is not itself independent verification.

### 華恋の意見

有利なGREENが出るまで再実行するのではなく、actual-Gitの強さを保ったまま、
run/challengeごとに一度だけ取得したimmutableな事実を全roleで共有するべきです。
これなら、検証の意味を弱めず、fixtureやvalidatorの呼出回数へ外部可用性を
掛け合わせる偶発性を除けます。

published D2のtargeted GREENは履歴として保持し、stable postverificationは別の
未達境界として扱うべきです。Reference/OAはcorrected D1/D2と二run matrixが
別承認で完了するまで進めません。

## 8. Exactly one next authority and stop

```text
token:
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_D2_POSTPUBLICATION_DIAGNOSTIC_FULL_EXACT8_GREEN_NONCREDIT_PRIOR_MIGRATING_O02_O06_FAILURES_NONREPRODUCED_LIVE_REMOTE_EXACT45_MULTICALL_OBSERVATION_LATENCY_ACTUAL_GIT_IDENTITY_REPRODUCIBILITY_AND_STABILITY_CONTRACT_RECONCILED_RUN_CHALLENGE_SCOPED_REMOTE_MAIN_ACQUISITION_ATTEMPT_EXACT1_OWNER_INDEPENDENT_PARENT_HARNESS_SAME_IMMUTABLE_OBSERVATION_IDENTITY_ADDITIONAL_LIVE_QUERY_RETRY_AND_PRIOR_RUN_REUSE_EXACT0_DISTINCT_CORRECTED_D1_V5_CAUSAL_RED_REFREEZE_AND_POSTVERIFICATION_ONLY

state:
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED

concrete token count:
exact1

automatic progression:
false
```

No use is allowed without separate Mash approval.

```text
Cocolon approved documentation:
NEW exact3 / MODIFY exact2

mashos-api production / test / fixture / dependency / config / lock:
exact0 / exact0 / exact0 / exact0 / exact0 / exact0

pytest collect / execution / diagnostic rerun:
exact0 / exact0 / exact0

Reference / OA / Candidate / Event1 / source lock:
exact0 / exact0 / exact0 / exact0 / false

runtime / Readiness / Failure / Reservation / Attempt / formal exact134:
exact0 / exact0 / exact0 / exact0 / exact0 / exact0

automatic progression:
false
```

Required stop:

```text
RECOVERY_EPOCH004_D2_PUBLISHED_TARGETED_GREEN_RETAINED_POSTPUBLICATION_FULL_EXACT8_MIGRATING_O06_O02_FAILURES_SELECTED_RERUNS_GREEN_DIAGNOSTIC_INSTRUMENTED_FULL_EXACT8_GREEN_NONCREDIT_DIRECT_CAUSE_NOT_PROVEN_LIVE_REMOTE_EXACT45_MULTICALL_REPRODUCIBILITY_RISK_RECONCILED_RUN_CHALLENGE_SCOPED_REMOTE_MAIN_ACQUISITION_ATTEMPT_EXACT1_ADDITIONAL_QUERY_RETRY_PRIOR_RUN_REUSE_EXACT0_STABLE_POSTVERIFIED_CREDIT_NOT_ESTABLISHED_REFERENCE_OPERATIONAL_ADMISSION_BLOCKED_CORRECTED_D1_V5_DEFINED_INACTIVE_AUTOMATIC_PROGRESSION_FALSE_AUTHORITY_STOP
```
