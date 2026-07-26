---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch002_oracle_exact5_collision_correction_refreeze_and_implementation_green_result
title: "NLS v3 Step 11 Cycle001 Recovery Epoch002 oracle exact5 collision correction, refreeze, and implementation GREEN result"
recorded_on_jst: "2026-07-26"
body_free: true
---

# Recovery Epoch002 oracle correction / D2 implementation GREEN result

## 1. Authority

Mash explicitly approved:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_POST_RESERVATION_RETRY_LINEAGE_AND_FORMAL_WORKER_BOOTSTRAP_ORACLE_EXACT5_COLLISION_CORRECTION_REFREEZE_AND_IMPLEMENTATION_GREEN_ONLY
```

This combined authority permits only:

1. correction of the exact5 collisions found in the frozen D1 oracle;
2. correction-only causal RED refreeze;
3. implementation of the frozen exact9 owner/configuration surface;
4. targeted GREEN verification;
5. body-free evidence reflection; and
6. authority STOP.

The predecessor `...IMPLEMENTATION_AND_GREEN_ONLY` authority did not reach a
completion claim after the oracle collisions were found. The current
authority is the later, narrower authority that permits the correction and
the same D2 implementation as one auditable chain.

## 2. Confirmed facts

### 2.1 Fixed entry and GitHub result chain

```text
mashos-api D1 entry:
8b2b05809867ae53ba2fc3e525e99eea5e92f390

oracle-correction commit:
082b0dd54e4ba3cc8fd0fc632334cb4bfb37b107

oracle-correction tree:
7d5b4a965ce7435c8eb17928390fdd7c9462e125

D2 implementation commit:
3b99c549cc9ef32d0a4f0f014db08c8627471457

D2 initial implementation tree:
46eb3a1d219da526e4863f99ea51410f43b35df8

D2 operational-closure correction commit:
5eb4d6d1f0a18a715f33305e7fb7cfe92be42d74

final tree:
b7ad6dd2dbc90e9db296f8599103597d6bbd7ff7

entry -> final:
ahead 3 / behind 0 / total commits 3

changed paths:
oracle exact1 + owner/configuration exact9 = exact10

force:
false
```

The three result commits form a direct exact-parent chain. Immediately before
each GitHub ref update, the observed head still equalled the expected old
head. Post-fetch confirmed the final head, all parents and trees, the exact10
path set, and byte equality for every changed file.

### 2.2 Oracle exact5 collision and append-only correction

The historical D1 oracle remains evidence:

```text
historical blob:
8badf41f78a0f853e13cc0824d2dcd7be734ad6d

historical raw SHA-256:
619605e3520bec66062d7903d8e495c3e413a8e367b78de49bd824c78f777358
```

The later review found exact5 ineffective or misrouted mutations:

1. L04 exact4 mutations were applied to the bootstrap-readiness fixture
   instead of the reservation-publication state whose lease, parent, path,
   and post-fetch contract they were intended to test.
2. L05 exact1 reversed a singleton reservation-history list. The reversed
   value was byte-equivalent to the original and therefore assertion-neutral.

The correction changed only the D1 test path:

```text
path:
ai/tests/test_emlis_nls_v3_recovery_epoch002_retry_lineage_and_formal_worker_bootstrap_reconciliation_red.py

change:
30 additions / 1 deletion

corrected blob:
6e1f904d91c0e6852b8af66500a0563e20648026

corrected raw SHA-256:
70d6db7fe3e9f42c59a01fdba5e73752ba6aa1e7c2c4e6d7bf2581dbd5090ce5

production changes in correction commit:
exact0
```

The matrix IDs and expected issue codes were not weakened. A collision audit
over the corrected oracle observed:

```text
matrix cases:
42

validator calls:
110

unique state identities:
110

same-case state collisions:
0

expected-code conflicts:
0
```

This is an append-only correction of later-discovered oracle defects. It does
not delete the historical D1 evidence or claim that the older exact5
mutations had been effective.

### 2.3 Correction-only refreeze

The corrected test was executed on the correction-only tree, before any
Recovery Epoch002 production owner existed:

```text
collected:
46

positive/current-fact passed:
4

expected causal RED failed:
42

matrix:
L01-L18 + B01-B24

collection / import / syntax / fixture errors:
0

unexpected failures / warnings:
0 / 0

state:
CORRECTED_CAUSAL_RED_REFROZEN
```

Every exact42 causal row stopped at its own
`RECOVERY_EPOCH002_OWNER_PATH_NOT_IMPLEMENTED`. This was targeted oracle
execution, not formal exact134 and not broad regression.

### 2.4 D2 exact9 implementation

The D2 commit added exactly these nine paths:

| Path | Git blob SHA-1 | Raw SHA-256 |
|---|---|---|
| `ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py` | `28b2618f1383049d75ba01b1cd4a319bf2299246` | `dc8a1d8e964a02db2d042ba71955170f5b65832c497a79d21c580dfbd00bc347` |
| `ai/services/ai_inference/emlis_ai_recovery_epoch002_canonical_current_closure_v3.py` | `1117ec848d4359882c377313046982e12b1d1c12` | `29471406e4a1c0e93603aaecdaccc328bd1e6cab89e91b5ad41f4e6091f80480` |
| `ai/tools/emlis_nls_v3_recovery_epoch002_atomic_publication_bundle_v3.py` | `47b4345929b65c5e5886445c079e248b907ec6de` | `f854b29a81f16b52a42fd235b95550edfd178fd1f4eb3aafe7e0ded102f7da2c` |
| `ai/tools/emlis_nls_v3_recovery_epoch002_formal_worker_evidence_v3.py` | `f394d09ed13a51bf4c3c3b6559864dac7463d6f1` | `4f2bb7fe28b7172266ffd7953aa518eccad28c95754daabf3d40c6fede854384` |
| `ai/tools/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_preflight.py` | `a2f5b472841b6934560c3bb43579a8afd5b383f2` | `4b0bab51f295e67ba081d4abe9fa2567ae0589514d2429a64c6903c7ded61495` |
| `ai/tools/emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py` | `4943332274333ff1b683522b98dc2503ec520eb4` | `6dbf685939678f7497b52d6a422a7515ae79d3be490bb6646705bd3969f9a886` |
| `ai/tools/emlis_nls_v3_recovery_epoch002_current_step_proof_run.py` | `5e2d70db551150bb17b5000ef0401c55ca70bbf2` | `17fcb514bf9b9a41380da8fddab1101e498467f04d887cad50bf3d0f2a648b8e` |
| `ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py` | `03328eb6c115699e93e114d1087989f1ec85af95` | `4ae8b8078b25343f06819da6baae5c9586d5031453c6def5bd2f4927f130306f` |
| `ai/configs/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_lock_v1.json` | `0822fcb010985cd0d384f250a9e8a1fe16dc8fd4` | `9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787` |

The exact9 paths implement the frozen exact12 roles. The main closed
contracts are:

1. P0-bound additive retry lineage and a distinct post-D2 candidate boundary;
2. deterministic exact6 D2 completion receipt and event1 cross-binding;
3. exact source, proof, registry, formal-test, and bootstrap closures;
4. exact46 `PIP_REQUIRE_HASHES_WHEEL_LOCK_V1` distribution closure;
5. `--noconftest`, disabled entrypoint autoload, and empty explicit plugin
   allowlist;
6. static first-party/stdlib/third-party import reconciliation;
7. pre-reservation readiness and one-use reservation semantics;
8. durable preflight, parent-spawn-intent, collection, execution, terminal,
   diagnostic, and unknown-disposition evidence;
9. one shared operational terminal validator at worker write, reconciliation,
   parent acceptance, and atomic publication boundaries; and
10. explicit GitHub-mutation and formal-worker-execution ports with no
    automatic progression.

The runner persists `PARENT_SPAWN_INTENT` before fallible local admission.
After a published reservation, missing trustworthy terminal bytes close as
`ATTEMPT_CONSUMPTION_UNKNOWN_STOP`; the same attempt is not replayed.

The actual exact31 bootstrap/source reconciliation then exposed a
source-resolution gap inside the canonical-closure owner. The targeted
exact46 did not exercise that read-only operational scan. The final exact1
commit modified only that already-approved exact9 path:

```text
change:
165 additions / 37 deletions

purpose:
bind owner paths to modeled runtime search roots;
resolve relative imports by runtime package name;
retain fallback imports unless an import-only first-party branch,
its unique target, and imported members are statically present;
never prune TryStar or stdlib/third-party fallbacks

post-fetch:
blob/raw/tree matched; force false
```

This did not expand the exact10 path set. A fixed-runtime import smoke
supplemented the static branch proof for the current bytes; it did not import
or execute the formal exact134 tests.

### 2.5 Final D2 closure

The closure was derived from the post-fetched remote commit/tree and the
actual final bytes:

| Closure component | Identity |
|---|---|
| source commit | `5eb4d6d1f0a18a715f33305e7fb7cfe92be42d74` |
| source tree | `b7ad6dd2dbc90e9db296f8599103597d6bbd7ff7` |
| detailed design | `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc` |
| canonical current closure | `f2d69acef07e210f5ca61da6d9cec07d97c53add7ad95d0e2c3c9516a8464f18` |
| source dependency closure | `594f8105b29b516b1d1eb8eb3ed9f434bd69a88c7851674c596b09d2328a5b67` |
| proof source closure | `93f1032fe17b265a6a268688e7ecd3a2e53cb3f68bac5b3ecf9e8345aa0c8a43` |
| requirement registry | `70a75ae561fad0846604d05b1262615be4c4a16b36b332150f8c7dc04ee71728` |
| formal-node registry | `fbe29ce0b819563cb5db2dc79fec8277b32ae0dea5a3a5cba64230ba4a1f73cf` |
| formal-test manifest | `ba5b15f22c5ced74936d6a94e3a24a31c0243e42609c2f1b519a71c5e9984e6a` |
| bootstrap closure | `3d53021646fc550794cf8a094cb46daa81892d79ac0de0c8051bbccc84d79b04` |
| D2 final closure | `2d15d58d7bbdd2dab91f526486dcaf29a05c7326ec3944a91fc04757c1d73fbe` |
| exact15 source closure | `b05eac06b1dc411164a1a7546229ffb79f811c17c3d32ee4c72004b88f8fcd60` |

The exact46 lock raw SHA-256 is
`9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787`.
The deterministic locked-runtime materialization contains exact46
distributions and has materialization SHA-256
`35f48076855e637ac9cc18cdcd88686fae0fa3870348b5517bc8efec8b698646`.

The deterministic D2 completion receipt has exact6 fields, binds the D2
final closure above, and validates with receipt SHA-256
`0af065a6499ff99164d206f6fddafafaa91f3436de191f20078e6c4aa858253c`.

### 2.6 Targeted GREEN and audits

The same corrected oracle bytes were then executed against the final D2
tree:

```text
collected:
46

passed:
46

failed / errors:
0 / 0

captured warning:
1 pre-existing Pydantic V1-style validator deprecation

state:
IMPLEMENTED_TARGETED_GREEN
```

Additional bounded audits confirmed:

```text
exact9 syntax / AST:
PASS

Python owner imports:
exact8 PASS

exact46 dependency lock and wheel identities:
PASS

source / proof / registry / bootstrap cross-binding:
PASS

actual bootstrap/source manifest:
formal nodes exact134 / tests exact21 / owners exact12 / installed exact46
source exact211 / imports exact251 / first-party exact191
unclassified exact0 / unresolved dynamic exact0

official read-only validators:
dependency lock / bootstrap shape / operational bootstrap /
operational source / source closure / formal-node registry = PASS

worker-write / reconcile / parent / publication terminal-validator parity:
PASS

pre-existing-directory and unpublished-reservation replay attacks:
REJECTED

dirty worktree:
false
```

Three specialized audit lanes supported the review. Karen rechecked their
findings, integrated the final bytes, ran the final targeted verification,
performed the GitHub writes, and owns the final judgment.

The retired/disabled guardian workflow was not used.

### 2.7 Actions not performed

```text
formal exact134 executions:              0
broad regression executions:            0
candidate allocations:                  0
source-baseline event1 publications:     0
readiness artifact publications:        0
formal reservations / worker spawns:    0 / 0
formal attempts / terminal artifacts:   0 / 0
private-body artifacts:                 0
P2 / fresh batch / exact100:            NOT_AUTHORIZED
Product Read / Product Read correction: NOT_RUN / NOT_RUN
B6 / Cycle001 acceptance:               NOT_RUN / NOT_ACCEPTED
guardian Issues / Actions / refs:       NOT_USED
```

The word `CORRECTION` in this authority means the D1 oracle correction. It
does not mean Product Read correction.

## 3. Inferences

1. The oracle defect was in test-state selection and duplicate mutation
   identity, not in the intended reservation/publication contract.
2. The corrected RED followed by 46/46 GREEN on unchanged corrected oracle
   bytes distinguishes an implemented contract from a test weakened to pass.
3. Binding lineage, reproducible bootstrap, checkpoint persistence, and
   publication acceptance at one reservation boundary removes the known
   route by which a one-shot authority could be consumed without an
   auditable terminal disposition.

## 4. Karen's opinion

The correction was necessary: keeping knowingly assertion-neutral or
misrouted mutations would preserve the appearance of coverage rather than
the coverage itself. It was equally necessary to preserve the historical D1
identity and record the correction as a later direct commit.

D2 is complete at the targeted-GREEN boundary. No formal worker should be
started under this authority. The next phase must allocate its own distinct
candidate only after this D2 completion evidence is postverified, and it
must remain separately approved.

## 5. Current state and STOP

```text
RECOVERY_EPOCH001:
EPOCH_INVALIDATED

RECOVERY_EPOCH002:
D2_IMPLEMENTED_TARGETED_GREEN

ORACLE:
EXACT5_COLLISION_CORRECTED_CAUSAL_RED_REFROZEN

RECOVERY_EPOCH002_CANDIDATE_VERSION:
UNALLOCATED_DISTINCT_FROM_NLS_V3_RC_0034

SOURCE_BASELINE:
UNLOCKED

FORMAL ARTIFACTS:
NOT_ISSUED

P2:
NOT_AUTHORIZED

CYCLE001:
NOT_ACCEPTED

AUTOMATIC_PROGRESSION:
false

AUTHORITY_STOP
```

The only next separate-approval candidate is:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_SOURCE_BASELINE_AND_STEP0_10_COMPLETION_RECEIPT_GENERATION_AND_VERIFICATION_ONLY
```

It is not approved by this result. Do not progress automatically.
