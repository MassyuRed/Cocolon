---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch001_attempt_consumption_unknown_post_reservation_retry_lineage_and_formal_worker_bootstrap_nonconformance_epoch_invalidation_and_recovery_epoch002_parent_design
title: "NLS v3 Step 11 Cycle 001 Recovery Epoch 001 invalidation and Recovery Epoch 002 parent design"
revision_date: "2026-07-25"
status: "RECOVERY_EPOCH001_INVALIDATED_RECOVERY_EPOCH002_PARENT_DESIGN_FROZEN_DEFINED_NOT_STARTED_AUTHORITY_STOP"
document_authority: "NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_ATTEMPT_CONSUMPTION_UNKNOWN_POST_RESERVATION_RETRY_LINEAGE_AND_FORMAL_WORKER_BOOTSTRAP_NONCONFORMANCE_EPOCH_INVALIDATION_AND_RECOVERY_EPOCH002_PARENT_DESIGN_ONLY"
body_free: true
automatic_progression: false
cycle001_status: "NOT_ACCEPTED"
recovery_epoch001_status: "EPOCH_INVALIDATED"
recovery_epoch002_status: "DEFINED_NOT_STARTED"
---

# 0. Decision

Mash explicitly approved:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_ATTEMPT_CONSUMPTION_UNKNOWN_POST_RESERVATION_RETRY_LINEAGE_AND_FORMAL_WORKER_BOOTSTRAP_NONCONFORMANCE_EPOCH_INVALIDATION_AND_RECOVERY_EPOCH002_PARENT_DESIGN_ONLY
```

This authority makes two append-only decisions:

1. Recovery Epoch 001 is closed as `EPOCH_INVALIDATED`.
2. Recovery Epoch 002 is defined as `DEFINED_NOT_STARTED`.

The Epoch 001 invalidation does not revoke, delete, or rewrite its published
event 1, consumed RETRY007 reservation, or unknown-consumption history. They
remain valid historical evidence inside an epoch that may no longer progress.

This authority does not create a sequence event, source-baseline receipt,
reservation, formal attempt, accepted receipt, Step receipt, all11 chain,
atomic manifest, event 2, fresh batch, Product Read, or private body. It does
not change mashos-api source and does not run pytest or formal exact134.

Fixed result:

```text
RECOVERY_EPOCH001:
EPOCH_INVALIDATED

RECOVERY_EPOCH002:
DEFINED_NOT_STARTED

RECOVERY_EPOCH002_SOURCE_BASELINE:
UNLOCKED

RECOVERY_EPOCH002_EVENT1 / RESERVATION / ATTEMPT:
NOT_CREATED / NOT_CREATED / NOT_CREATED

LINEAGE_BOOTSTRAP_REPAIR:
DESIGNED_NOT_IMPLEMENTED

CYCLE001:
NOT_ACCEPTED

NLS_V3_METHOD_STOP:
false

AUTOMATIC_PROGRESSION:
false

AUTHORITY_STOP
```

# 1. Precedence and fixed entry

## 1.1 Precedence

1. The Revised Cycle Detailed Design remains normative for NLS v3 product,
   Step 11, batch acceptance, privacy, and method STOP.
2. The Recovery Epoch 001 parent addendum remains the historical parent for
   Epoch 001.
3. The accepted-run / sequence-ledger reconciliation design remains the
   historical formal-run contract for Epoch 001.
4. The RETRY007 result, receipt, append-only correction, correction receipt,
   and handoff are execution-history evidence.
5. This document supplements only the previously undefined
   post-reservation unknown-consumption / later-retry / bootstrap recovery
   boundary. It does not weaken the normative acceptance criteria.

If this document would require a product-contract relaxation, private-body
publication, history rewrite, or acceptance backfill, the result is
`PARENT_DESIGN_CONFLICT_STOP`.

## 1.2 Repository entry

| repository | commit | tree |
|---|---|---|
| `MassyuRed/Karen-Diary` | `700f749f5149cac1f8bd4bab8a364d524a56985b` | unchanged by this authority |
| `MassyuRed/Cocolon` | `575e7e91a7510507e677159e59f7c378ed681b07` | `f0d028afb985dff0b865fac0dcd9969f6c840a37` |
| `MassyuRed/mashos-api` | `e4917fd7380cdf9b8a29c8ad1c9d045d162f56fd` | `1c8970e91dbc793fcb3b81b51c73291f0326a565` |

The Cocolon tracked base and the clean mashos-api materialization matched
these Git objects before this design was finalized. The untracked parent
design itself is not counted as source drift.

## 1.3 Normative and current-navigation identities

| role | identity |
|---|---|
| Revised Cycle Detailed Design | local supplied file SHA-256 `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc` |
| long-term roadmap context | local supplied file SHA-256 `04fb9e4e11af2b1530d03d95d8e959ba644503722f72094a289bde1d4368ce5b` |
| supplied historical Execution and Closure Plan snapshot | local supplied file SHA-256 `31682e71ac047ac5f2f329d62ebc51b471bdcb00430a6ab35bcfb934c1438ca7`, 798 lines; navigation only, superseded by the tracked current plan below |
| Epoch 001 parent design | commit `90a2c009b8a463110e01b907224e52ea50912bd8`, blob `3333ae29ec0f4e9dde614bc9cd520448f61d2386`, raw SHA-256 `46333ede4b86a9ced0a5223e8df8dea35287548c676ce15c7787602b9a62b45c` |
| Epoch 001 parent receipt | commit `f20165e3eda11dc0262373d5f82f63377df76f10`, blob `bdfbd559535db06ae4af35fe1bb58716d6566126`, raw SHA-256 `70563fa0732f97e9c54d3e8371741253e834440a618936e448a31b4d1cf5c30e` |
| Epoch 001 parent handoff | commit `90e64f230f83270a873a9754c95d7f3897e99e93`, blob `883cc3f98c9ba880cd6176cca2f2d3e5c81877a2`, raw SHA-256 `6c1b33b8620580e4d28c30445ccbfe0d1cfe7e3fbec9b2d2ac323d84b36b8efc` |
| accepted-run / sequence design | blob `7e7d454d888141cbdb872244bf6df93c046e0b6c`, raw SHA-256 `8bb377d49f04a33d6d21323a40bcd5ddc0d30eee8d4d2a2700ad7f074e32bb64` |
| current Execution and Closure Plan | commit `47cb62640c257bc1e86725f717ba582bb5e8d4e4`, blob `ca0f0de1d8ca7b2013b04e9f0c50cd36bebcd975`, raw SHA-256 `5fc283fd29deaa104ece4554410a15dfc0d095c36d32b44a7de4c5609ee20cd4` |
| current latest snapshot | commit `575e7e91a7510507e677159e59f7c378ed681b07`, blob `39facadf96f38f9e1df9567b767d4520d239d13c`, raw SHA-256 `65209c95faea0812576389b71dd641bc12f53ea26ca4f67c96aa20000a4ba6b8` |

The roadmap defines EmlisAI as an immediate observation experience rather
than a fixture-passing system. The Revised Cycle Detailed Design requires
append-only initial results, shared-cause correction, cumulative reruns, and
no case-specific repair. This parent design changes none of those product
boundaries.

# 2. Confirmed nonconformance facts

## 2.1 Preserved Epoch 001 source and proof identity

```text
candidate version:
nls_v3_rc_0034

requirement registry SHA-256:
70a75ae561fad0846604d05b1262615be4c4a16b36b332150f8c7dc04ee71728

formal node registry SHA-256:
fbe29ce0b819563cb5db2dc79fec8277b32ae0dea5a3a5cba64230ba4a1f73cf

canonical current closure SHA-256:
2e171332086e0dad14917c9adcd40b7b3b49c759cb160719f3f99c0e14b8a4d0

source dependency closure SHA-256:
594f8105b29b516b1d1eb8eb3ed9f434bd69a88c7851674c596b09d2328a5b67
```

`nls_v3_rc_0034` is an immutable Recovery Epoch 001 historical identity. It
is not the candidate identity for Recovery Epoch 002 and may not be reused,
renamed, or silently inherited by Epoch 002.

## 2.2 Published event 1 and RETRY007 reservation

Event 1:

```text
publication commit:
de9a448f072cb9e3da60e344d31aee5b13c91847

publication tree:
b87aacf81f41d867e73284ba401ce8798aa6a862

source receipt blob / raw / logical SHA-256:
745074a8d998204eb1c1ec8bdf615879d16563fc
08c300ca238081a7a9ce97d02c2902a6c5b9f4df13c1ea7e42ce69efad842c87
16e99eac8009890615573d1235c59a301fa580b839915bbde760b75975e21f62

event blob / raw / event / identity SHA-256:
1a5bc8a66c113661d345b7556ca1baa2d35105bf
efeca263e3d2f776e36ea64aa0fc20046736dd278fd2b142b9fb0b35b6896f2e
33da356d87da0e00d7f3f901468dc151dea8fa4e5d9ac632ebe4a20cc7bb80bc
03219827fa14a57fb304d005efa755f2c815ce9d7f3040706ff6031e85f1ac90
```

Reservation:

```text
publication commit:
9a831823137413226cbae9f1521041cc9202cedf

publication tree:
fb22a8f46d040380704aa0c06e42b294dadd8dd2

reservation blob / raw / logical / identity:
41fb8cf26009eb21ddfd5872b5f1271fdb43461c
495c58b1fd73d46f30e71413979c6b93a3e895550bf0d39b537b2b46e200aef4
4d5e171c95238d6a8addcf8582c5f6cb3d86e5dcfa3a4d242fd68755a7d062b2
6428c820e572b45d01f98537da1989ee8292d2a0a70c2033076a0880d2617baa

formal challenge:
2aff9fce294833aabb0f88d59fbd9b476cb999b70a9316385ddd4706596b0397

authority-challenge:
47cd89db37666be906fd940280123fe946f9270b6c89871b86c673b31753ad73

attempt:
14bfcb655ebff5320611018fa7510b7e676d3f29ae5ca3020dc8279d95714a5e
```

RETRY007 exact134 was invoked once after durable
`CONSUMPTION_STARTED`. No trustworthy worker result, formal attempt, success
terminal, or failure terminal was produced. The required classification is:

```text
CONSUMPTION_STARTED_AT_UTC:
2026-07-25T04:24:03Z

FORMAL_EXACT134_INVOCATION_COUNT:
1

ATTEMPT_CONSUMPTION_UNKNOWN_STOP
SAME_AUTHORITY_CHALLENGE_RERUN_FORBIDDEN
AUTOMATIC_RETRY_FALSE
```

Append-only RETRY007 closure evidence:

| artifact | commit | blob | raw SHA-256 | canonical receipt SHA-256 |
|---|---|---|---|---|
| unknown STOP result | `e561d2f22423c9b05f79aefa57d842eefea8f47d` | `74cce408594a2373465d498838f418f2d565aa59` | `cac8053c3ab66737480860704b690efd00ce132aafb7c1e40bbe5c8f172ecafb` | not applicable |
| unknown STOP receipt | `86b7ca4bc074d18523fbd4e3bb1e4ac79e2271b1` | `620c80f835852cd842f69dadbddd251020258d43` | `bc1c1f308dea64c32ab81e9e550d31f83e7f2957183de721119a8352fcc8d461` | `68d8dc98471ebbfc33d64f94dbf8abaf768e5479c1ffe12ce19e49e17351f447` |
| next-boundary correction | `761c6761f38a430439ba99c9c8b781b542b0b2d2` | `17f884b05ac0630286ccaad07b683e68f401a929` | `546baa76587b9995b79e9e4333d35b553660e4d002fbbef950eb48a89de108ad` | not applicable |
| correction receipt | `4dd84ffdffef2da0684b2ea9ce33d2f8a89642ab` | `3be9761fc24735884e9ad65d92f868ec3bbb532b` | `8f752486a6219a30a6ecacf51245c10b9d2442ed7ee7c41f4a10c64454bf1767` | `7716deee92f8b94f5ecb1a22035959a67cc69b6460ec37dd3d35ba4d7668d8d7` |
| final RETRY007 handoff | `be6e78ca52e09b1c3d9352e96e49bbac6e2e51ad` | `615f7789f01f4350f5fb86719bcf0d7b8aabe647` | `e7d8a62027f9e83426925ad549fc1d13c47f204d9b1962af600044d2167ea100` | not applicable |

## 2.3 Later-retry design and production topology conflict

The Epoch 001 formal design says a separately approved later retry may
reference the same event 1 when the source closure is unchanged.

The production reservation validator instead requires every reservation
publication commit to have event 1 as its only parent. The owner and relevant
identity are:

```text
path:
ai/services/ai_inference/emlis_ai_recovery_epoch001_sequence_ledger_v3.py

blob:
e1d517264c77c60fcba01e1064f75c1578f0d8db

raw SHA-256:
5fbdda03b25830fa8d77c7b9bc6d4c782cc3ebacac94d854cdc146d58d72968b

validated owner ranges:
1154-1159 and 1169-1179
```

The independent verifier also requires the event 1 direct parent. The
RETRY007 reservation is already the append-only child of event 1. A second
reservation appended to current main cannot also have event 1 as its only
parent. Rewind, history hiding, forged ancestry, or old-reservation reuse is
forbidden.

## 2.4 Formal worker bootstrap incompleteness

Confirmed source facts:

1. the formal parent has no pre-reservation worker bootstrap preflight;
2. after reservation postverification it calls exact134 immediately;
3. the child uses `sys.executable -I -B`, fixed environment fields, and
   disables pytest entry-point plugin autoload;
4. it does not disable project conftest loading;
5. `ai/tests/conftest.py` unconditionally registers
   `helpers.emlis_ai_fb172_migration`;
6. that plugin imports `emotion_submit_service`, which imports FastAPI;
7. exact134 and the FB172 migration ledger overlap exact0;
8. the RETRY007 isolated runtime did not contain FastAPI;
9. the worker writes its result only after `pytest.main` returns;
10. it has no durable intermediate stage checkpoint and discards stdout and
    stderr;
11. a missing or invalid result becomes generic
    `RECOVERY_PROOF_ENVIRONMENT_ENTRY_INVALID`;
12. timeout without a result currently synthesizes expected collection IDs
    rather than proving observed collection; and
13. current source closure includes `ai/tests/conftest.py` but its AST import
    expansion does not resolve the literal `pytest_plugins` declaration or
    external installed-distribution closure.

Relevant owners:

| role | path | blob | raw SHA-256 |
|---|---|---|---|
| reservation independent verifier | `ai/tools/emlis_nls_v3_recovery_epoch001_closure_receipt_verify.py` | `d734ba89efab75d85987de0a8039bb7dbe053641` | `600b0eec2850ff58529c5ffe40a251ee119236265cfa745dbcf2e27fbbc0ed33` |
| formal parent | `ai/tools/emlis_nls_v3_recovery_epoch001_formal_parent_orchestrator_v3.py` | `f06f16d2bb838102d9e1068ff823e055de62fa2b` | `6293b075e48c5501f9e443545d7d04484b92265f0378ff30d847bed81a66a7b0` |
| formal worker | `ai/tools/emlis_nls_v3_recovery_epoch001_current_step_proof_run.py` | `fe1ee4dfbc044739f9452b3b3e0f32061a895596` | `df42d097ec356c9c5a860ffda54e5cdf119d3a1d8cef0518576f99d0dbd8c749` |
| shared conftest | `ai/tests/conftest.py` | `ecf83cda03fe1375e5240576ae6b7bdffca35632` | `2f269b3589da7c619c44c638422799271379ff70a70c04cd1283d1fca812a999` |
| explicit FB172 plugin | `ai/tests/helpers/emlis_ai_fb172_migration.py` | `94664072a08eafec4113b43b64b3ee1878821dff` | `94cbf59a31f92a966df6a87b8c4a046b02a12dd8b0fee1b693a839f32b7fde48` |
| first proven external boundary | `ai/services/ai_inference/emotion_submit_service.py` | `f467741a0bf2d349680ce855539c4f027848966c` | `818ee1edb7ac4ff5f12cc7f8537eeb10fedc9f7dd37a4d165c5248a7249830f2` |
| closure owner | `ai/services/ai_inference/emlis_ai_recovery_epoch001_canonical_current_closure_v3.py` | `25ba71682721834de82002c44f5de3fba03ef5be` | `c8cc109adbb0b95e5d571b7d75f267d52d5076e17b169fd96699667b02782436` |
| root dependency declaration | `requirements.txt` | `363a29f4b718884d95658d5ed911a54d0c4b55bb` | `202215a8c33f37a1f2e55953bf3f96b65e3be3b5fefd9859df81297b9aac82fb` |

The root dependency declaration names FastAPI and other packages but does not
pin versions or installer hashes. It is not a reproducible formal-worker
distribution lock.

# 3. Recovery Epoch 001 invalidation

## 3.1 Invalidation reason codes

```text
POST_RESERVATION_RETRY_LINEAGE_CONTRACT_NONCONFORMANCE
FORMAL_WORKER_BOOTSTRAP_DEPENDENCY_CLOSURE_NONCONFORMANCE
FORMAL_WORKER_PRE_RESULT_DIAGNOSTIC_NONCONFORMANCE
RELEVANT_SOURCE_PROOF_CLOSURE_REPAIR_REQUIRED
```

The first three are confirmed current contract gaps. The fourth means that
closing the gaps requires changes to owners inside the event 1 source/proof
closure.

At this authority entry:

```text
ACTUAL_POST_EVENT1_SOURCE_DRIFT_OBSERVED:
false

SOURCE_REPAIR_EXECUTED:
false

TEST_OR_FORMAL_WORKER_RUN:
false
```

Epoch 001 is invalidated before repair so that a future source change is not
misrepresented as continuing under the locked event 1. This is an
append-only process decision, not a claim that source drift already happened.

## 3.2 Historical evidence disposition

Retained as immutable historical evidence:

- Epoch 001 P0 design and receipt;
- event 1 exact2 publication;
- RETRY007 reservation exact1 publication;
- the durable `CONSUMPTION_STARTED` record;
- the unknown-consumption result and receipt;
- the append-only RETRY008-withdrawal correction and receipt;
- the final RETRY007 handoff and current plan/snapshot reflection.

Not created or inferred:

- formal attempt;
- exact exception, exit code, signal, collection state, or test outcome;
- success or ordinary failure terminal;
- accepted receipt;
- Step00-10 receipts;
- all11 chain, atomic manifest, or event 2.

The Epoch 001 event 1 and reservation remain valid published artifacts. They
are not reusable for Epoch 002 source, attempt, or acceptance credit.

## 3.3 Invalidation record form

The append-only invalidation record is this parent design plus its separately
published body-free receipt. It is an administrative transition record and
does not claim event ordinal 2. Creating an Epoch 001 event 2, synthetic
attempt, or late replacement event 1 is forbidden.

The invalidation decision becomes current only after:

1. this exact design is reachable on Cocolon main;
2. its path, bytes, blob, and raw SHA-256 are post-fetched;
3. the body-free receipt binds those exact identities;
4. the receipt is reachable on main and post-fetched.

The handoff, plan append, and latest-snapshot append are mandatory
documentation reflection after that decision. If any reflection publication
fails, the invalidation decision remains valid and append-only, but the
authority closes as documentation-reflection incomplete STOP. It may not
claim a complete handoff or make D1 eligible until the reflection is
completed and postverified.

# 4. Recovery Epoch 002 identity and P0

```text
logical_cycle_id:
NLS_V3_CYCLE_001

recovery_epoch_id:
NLS_V3_CYCLE001_RECOVERY_EPOCH_002

initial_state:
DEFINED_NOT_STARTED

source_baseline:
UNLOCKED

reserved_batch:
NOT_CREATED

formal_run:
UNALLOCATED

candidate_version_id:
UNALLOCATED_DISTINCT_FROM_NLS_V3_RC_0034
```

This design and its body-free receipt form the immutable Epoch 002 P0 anchor
pair. A future event 1 must bind their published path, commit, blob, raw
SHA-256, logical receipt SHA-256, and a derived P0 identity.

Epoch 001 history is retained as process-risk evidence only. Epoch 002 does
not inherit Epoch 001 event, reservation, run, Step-completion, batch, review,
or acceptance credit. It also does not inherit generated output, Product
Read, installed-distribution, depth, surface, performance, correction, or
sample acceptance credit from `nls_v3_rc_0034`.

The Revised Cycle Detailed Design requires source-, test-, runner-, config-,
schema-, or dependency-affecting repair after an RC freeze to use a new
release candidate. D1 freezes the exact repair boundary; D2 closes the final
source/test/runner/dependency bytes. After D2 final closure is postverified
and before Epoch 002 event 1 is issued, a distinct immutable Epoch 002
`candidate_version_id` must be allocated and bound into the event 1,
readiness, reservation, result, accepted-run, and later lineage.

The exact future ID is deliberately unknown in P0. If later implementation
requires reusing `nls_v3_rc_0034`, inheriting its acceptance evidence, or
assigning an ID before the final D2 closure is known, the result is
`EPOCH002_RELEASE_CANDIDATE_BOUNDARY_CONFLICT_STOP`. Cumulative rerun and
Product Read remain later separately approved gates; allocating a new ID
does not complete either one.

# 5. Authority and gate order

Recovery Epoch 002 uses separate authorities:

| gate | allowed work | required exit | automatic next |
|---|---|---|---|
| P0 current parent design | Epoch001 invalidation, Epoch002 design/receipt/handoff, plan/snapshot | `DEFINED_NOT_STARTED` or `EXPLICIT_STOP` | none |
| D1 causal RED | exact retry-lineage/bootstrap tests and byte-frozen RED evidence only | `CAUSAL_RED_FROZEN` or `EXPLICIT_STOP` | none |
| D2 implementation / targeted GREEN | approved source owners and targeted GREEN only | `IMPLEMENTED_TARGETED_GREEN` or `EXPLICIT_STOP` | none |
| P1 formal source / Step0-10 | event1, bootstrap preflight, one reservation, exact134 once, terminal publication or STOP | `STEP0_10_PREREQUISITES_PROVED` or `EXPLICIT_STOP` | none |
| P2 and later | original recovery parent gates with Epoch002 identities | separately approved gate result or `EXPLICIT_STOP` | none |

No authority may bundle D1, D2, formal P1, or P2. Each gate ends at
`AUTHORITY_STOP`.

Downstream eligibility is success-specific:

```text
D1 CAUSAL_RED_FROZEN + GitHub postverification
-> D2 candidate may be selected

D2 IMPLEMENTED_TARGETED_GREEN + GitHub postverification
-> formal P1 candidate may be selected
```

An `EXPLICIT_STOP`, failed publication, or incomplete reflection does not make
the next candidate eligible.

# 6. Epoch 002 source-baseline publication contract

## 6.1 Event 1 timing

Epoch 002 event 1 may be issued only after D1 is separately approved and exits
as `CAUSAL_RED_FROZEN` with GitHub postverification, and D2 is separately
approved and exits as `IMPLEMENTED_TARGETED_GREEN` with GitHub
postverification. This parent design does not select event paths, authority
tokens, challenges, timestamps, source commits, closure hashes, or artifact
bytes.

Event 1 remains a one-per-epoch baseline transition. Its future atomic bundle
must:

1. use an Epoch002-only schema and immutable path namespace;
2. bind the Epoch002 P0 anchor pair;
3. bind the distinct immutable Epoch002 `candidate_version_id` allocated
   after D2 final closure and reject `nls_v3_rc_0034`;
4. bind the final clean mashos-api commit/tree;
5. bind the exact D2 source/test/runner/config/schema/dependency closure from
   which that candidate ID was derived;
6. bind canonical source, proof, registry, formal-node, runner, bootstrap,
   plugin, and installed-distribution closure roots;
7. be a single-parent direct child of the then-current Cocolon main `H0`;
8. use exact expected-old=`H0` lease and exact changed paths;
9. be fully post-fetched and independently verified; and
10. leave `automatic_progression=false`.

The P0 anchor publication commit must be a verified ancestor of event 1. It
need not be event 1's direct Git parent. Semantic prior identity and current
Git transaction parent are distinct concepts.

The first Epoch 002 P1 authority creates event 1 only when no Epoch 002 event
1 exists. A later separately approved retry reuses the one exact published
event 1 and must not create a duplicate. If the event 1 source, proof,
registry, runtime, bootstrap, plugin, or distribution closure drifts, that
event 1 may not be reused, replaced, or late-patched; Epoch 002 is invalidated
before any new source-baseline decision.

The event 1 publication challenge, bootstrap-preflight challenge, and
formal-run challenge have different purposes and must be mutually distinct.
No challenge value may be copied across those phases.

## 6.2 Required bootstrap closure root

The Epoch 002 source baseline adds a body-free bootstrap closure root that
must include at least:

- formal parent, runner, preflight owner, checkpoint owner, result owner, and
  independent verifier path/blob/raw hashes;
- exact formal conftest and plugin allowlist;
- literal `pytest_plugins`, explicit `-p`, conftest discovery, local import,
  and literal dynamic-import closure;
- the exact134 formal test modules and their statically resolved first-party
  import closure;
- exact3 import classification
  `FIRST_PARTY | STDLIB_BOUND_TO_PYTHON_RUNTIME |
  THIRD_PARTY_BOUND_TO_LOCKED_DISTRIBUTION`;
- normalized mapping from every reached third-party import to a locked
  installed distribution identity;
- stdlib-import binding to the locked Python runtime identity;
- unclassified import count exact0;
- unresolved dynamic import count exact0 within the first-party
  bootstrap/test closure;
- normalized external distribution name and exact version;
- one exact reproducible installer/build-input identity class frozen in D1,
  including its artifact SHA-256; D1 may not leave multiple runtime choices;
- installed distribution RECORD closure SHA-256;
- Python executable hash and body-free runtime/build identity;
- pytest distribution identity;
- fixed/removed environment profile and inherited PATH digest;
- preflight argv hash and formal-worker argv hash; and
- the combined bootstrap closure SHA-256.

An unpinned requirements name list, successful `import pytest`, or a
non-empty version string is not sufficient.

The preflight checks the frozen static test/import manifest without importing
or collecting formal test modules. A new first-party, stdlib, or third-party
import that is not present in the manifest is a pre-reservation STOP, even
when the module happens to be available in the runtime.

## 6.3 Drift

After Epoch 002 event 1:

- source/proof/registry/bootstrap closure drift forbids event 1 reuse;
- a source repair may not be made inside the formal P1 authority;
- required drift invalidates Epoch 002 and returns to a separate recovery
  decision;
- a runtime materialization mismatch with an unchanged locked manifest stops
  before reservation and does not itself create a formal attempt.

# 7. Pre-reservation formal-worker bootstrap readiness

## 7.1 Required phase order

```text
EVENT1_PUBLISHED_AND_POSTVERIFIED
-> FORMAL_WORKER_BOOTSTRAP_PREFLIGHT
-> BOOTSTRAP_READINESS_RECEIPT_PUBLISHED_AND_POSTVERIFIED
   -> FORMAL_RESERVATION_PUBLISHED_AND_POSTVERIFIED
      -> PARENT_SPAWN_INTENT_PERSISTED
      -> FORMAL_EXACT134_ONCE
      -> TERMINAL_RESULT_OR_UNKNOWN_STOP
   OR
   -> READY_UNUSED_AUTHORITY_STOP_PUBLISHED_AND_POSTVERIFIED

PREFLIGHT_FAILURE_RECEIPT_PUBLISHED_AND_POSTVERIFIED
-> AUTHORITY_STOP_WITHOUT_RESERVATION
```

The current order that publishes a reservation before checking the complete
worker bootstrap boundary is not allowed in Epoch 002.

## 7.2 Preflight non-execution boundary

The preflight must use the same interpreter, `-I -B`, fixed environment,
bootstrap owner, source materialization, plugin manifest, and dependency lock
as the formal child. It may:

- validate event 1, source, registry, runtime, and dependency identities;
- import pytest;
- import only the exact allowlisted formal bootstrap plugins;
- validate plugin manifests and body-free runtime identities; and
- write a body-free readiness result and checkpoints.

It must not:

- call `pytest.main`;
- invoke collection hooks;
- collect exact134;
- import formal test modules or test functions;
- execute any formal node;
- produce outcomes or counts; or
- create a reservation or attempt.

## 7.3 Formal plugin boundary

The future implementation must choose one of two causal-GREEN routes:

1. isolate unrelated plugins, including the zero-overlap FB172 migration
   plugin, from the formal exact134 conftest boundary; or
2. include every plugin and its full local/external transitive dependency
   closure in the locked bootstrap manifest.

Karen's design preference is route 1 because it gives the formal denominator
the smallest truthful collection boundary. This preference is not an
implementation approval; D1 must first freeze the causal contract.

The ambiguous current field `pytest_plugins_ignored` must not be retained
with its current meaning. Epoch 002 must distinguish:

```text
pytest_entrypoint_autoload_disabled
pytest_plugins_environment_variable_removed
conftest_plugin_mode
loaded_plugin_manifest_sha256
```

## 7.4 Readiness receipt

Each formal authority/challenge requires a new one-shot body-free preflight
receipt with:

- authority and preflight challenge identity;
- published event 1 identity;
- source/proof/registry/bootstrap closure roots;
- Python, pytest, dependency-lock, environment, preflight-owner, and argv
  identities;
- exact allowlisted plugin manifest hash;
- `READY_FOR_EXACT_ONE_FORMAL_SPAWN` or a stable failure code;
- formal collection state `NOT_STARTED` and formal execution state
  `NOT_STARTED`;
- `pytest_main_called=false`;
- owner and independent-verifier result;
- deterministic immutable publication path and logical receipt SHA-256; and
- `automatic_progression=false`.

The receipt bytes must not contain their own Git commit, blob, or raw
SHA-256. After publication, an independent postfetch verifier derives an
external identity record containing the exact commit, path, blob, raw
SHA-256, and logical receipt SHA-256. That external record is not part of the
receipt preimage. The next reservation must bind the exact external record.
A receipt that claims its own commit/blob/raw identity is invalid
self-reference.

`READY_FOR_EXACT_ONE_FORMAL_SPAWN` means only that the frozen worker bootstrap
boundary passed before reservation. It does not prove collection, exact134
execution, a formal outcome, Step00-10 completion, or acceptance.

A ready receipt is consumable by exact one reservation. The reservation
must be the direct child of the ready receipt publication commit. Any
intervening Cocolon head change, source/runtime/bootstrap drift, receipt
mutation, or reuse closes the authority before reservation.

Readiness-receipt publication uses this exact Git contract:

1. freeze the exact current Cocolon main as publication base `R0`;
2. verify the Epoch 002 event 1 publication commit is an ancestor of `R0`;
3. publish one single-parent commit whose only parent is `R0`;
4. use exact expected-old=`R0` lease;
5. change only the predeclared exact set containing the one new immutable
   readiness-receipt path;
6. post-fetch and independently verify commit/tree/path/blob/raw/logical
   identity and unchanged paths; and
7. classify any lease, parent, path-set, byte, or postfetch drift as
   `READINESS_RECEIPT_NOT_PUBLISHED_STOP`.

Preflight failure:

```text
PRE_RESERVATION_FORMAL_WORKER_BOOTSTRAP_STOP
RESERVATION_COUNT_DELTA_0
ATTEMPT_ID_NULL
FORMAL_EXACT134_INVOCATION_COUNT_0
SAME_AUTHORITY_PREFLIGHT_RERUN_FORBIDDEN
AUTOMATIC_RETRY_FALSE
AUTHORITY_STOP
```

A separately approved new authority may perform a new preflight. It does not
reuse a failed or consumed readiness receipt.

A readiness failure receipt closes the authority before reservation. If a
valid ready receipt is published but no reservation is published, an exact1
dedicated body-free disposition must consume it:

```text
READY_UNUSED_AUTHORITY_STOP
RESERVATION_COUNT_DELTA_0
FORMAL_EXACT134_INVOCATION_COUNT_0
AUTOMATIC_RETRY_FALSE
```

The disposition bytes bind the ready receipt's external postfetch identity,
authority/preflight identities, source/runtime/bootstrap identities, and the
closed state above. They do not self-bind their own Git commit/blob/raw
identity. Publication freezes the exact current main `U0`, verifies the ready
receipt is its ancestor, creates one single-parent child of `U0`, uses exact
expected-old=`U0`, changes exact1 new immutable disposition path, and
post-fetches the complete identity and unchanged-path proof.

Every later preflight or reservation admission enumerates all Epoch 002 ready
receipts. Each earlier ready receipt must have exactly one mutually exclusive
disposition:

```text
RESERVATION_PUBLISHED
READY_UNUSED_AUTHORITY_STOP_PUBLISHED
```

The current reservation candidate may be the exact one unresolved ready
receipt only when that receipt commit is current `H0` and its
authority/preflight/challenge binding equals the reservation authority;
publishing the reservation consumes it. Any other unresolved, duplicate, or
conflicting ready disposition blocks both the next preflight and reservation.

Until the unused disposition is published and postverified, the authority is
`READY_UNUSED_DISPOSITION_PUBLICATION_PENDING_STOP`, not durably closed, and
no next authority is eligible. A published unused disposition makes that
ready receipt permanently non-reusable.

# 8. Append-only post-reservation retry lineage

## 8.1 Semantic anchor and transaction parent

Epoch 002 separates:

```text
semantic source anchor:
published Epoch002 event 1 exact identity

Git transaction parent:
the exact current Cocolon main H0 immediately before publication
```

For a reservation candidate:

1. event 1 publication commit must be a verified ancestor of `H0`;
2. the `READY_FOR_EXACT_ONE_FORMAL_SPAWN` receipt publication commit must
   equal `H0`;
3. all earlier ready receipts have exactly one reservation-or-unused
   disposition reachable from `H0`;
4. all prior Epoch002 reservations and dispositions must be reachable from
   `H0`;
5. the reservation commit must have parent exact1=`H0`;
6. changed path count must be exact1 and the path must be new;
7. source/proof/registry/bootstrap closure must equal event 1;
8. exact expected-old=`H0` lease must succeed; and
9. commit/tree/path/blob/raw/logical identities must pass full post-fetch.

The reservation is not required to have event 1 as its direct Git parent.
Requiring semantic event ancestry does not permit a merge, alternate parent,
rewind, history hiding, or unleased update.

## 8.2 Reservation lineage material

The Epoch002 reservation schema is an additive successor to the historical
base reservation contract. D1 must retain, validate, and hash at least these
base fields and their nested external identities:

```text
schema_version
authority_token
challenge_id
authority_challenge_id
attempt_id
candidate_version_id
logical_cycle_id
recovery_epoch_id
formal_node_registry_sha256
reservation_state = ONE_SHOT_AUTHORITY_CONSUMED_BEFORE_RUN
reserved_at_utc
source_baseline_event
source_closure
automatic_progression = false
body_free = true
formal_test_run_reservation_sha256
```

`formal_test_run_reservation_sha256` remains the canonical reservation hash
over the frozen canonical preimage. The event and source-closure objects
continue to bind their path/commit/blob/raw/logical and repository
identities. Epoch002 may extend this contract, but may not drop, weaken, or
silently rename a base semantic field.

Each Epoch002 reservation must additionally contain or bind:

```text
reservation_ordinal
publication_base_commit_sha1
bootstrap_readiness_artifact
prior_reservation_count
prior_reservation_history
prior_reservation_history_sha256
lineage_state
event1_challenge_id
preflight_challenge_id
```

`prior_reservation_history` is the complete ordinal-ordered list. Each row
binds one reservation artifact identity to exactly one disposition artifact
identity and disposition kind. Ordinals start at 1, have no gap, and may not
be reordered or omitted.

The base `challenge_id` is the canonical formal-run challenge and the base
`authority_challenge_id` is the canonical formal authority-challenge.
Phase-explicit aliases, if D1 retains them, must exact-equal those canonical
fields; disagreement, duplicate semantics, missing base fields, or a changed
canonical preimage is schema failure.

Allowed derived lineage states:

```text
INITIAL
RETRY_AFTER_PUBLISHED_FORMAL_FAILURE
RETRY_AFTER_PUBLISHED_CONSUMPTION_UNKNOWN_STOP
```

Every authority token, phase-specific challenge, formal
authority-challenge, attempt ID, readiness receipt, and reservation path is
unique. The event1, preflight, and formal-run challenges are pairwise
distinct. Adding a new challenge to a consumed authority token does not make
it reusable.

The attempt ID preimage must include at least:

- logical cycle and recovery epoch;
- authority and formal-run challenge;
- event 1 hash and identity;
- source/proof/registry/bootstrap closure roots;
- readiness receipt external postfetch identity and preflight challenge;
- reservation ordinal; and
- prior reservation history hash.

The exact schema and preimage are frozen in D1, not invented during formal
execution.

## 8.3 Required prior disposition

Before a later reservation, every prior reservation must have exactly one
verified disposition:

```text
FORMAL_FAILURE_ATTEMPT_PUBLISHED
ATTEMPT_CONSUMPTION_UNKNOWN_STOP_PUBLISHED
```

The following block a new reservation:

```text
UNRESOLVED_RESERVATION
RESERVATION_PUBLICATION_OUTCOME_UNKNOWN
RESULT_DURABLY_PRESENT_TERMINAL_PUBLICATION_PENDING
SUCCESS_EVENT2_PUBLISHED
MISSING_OR_CONFLICTING_DISPOSITION
```

An unknown-consumption disposition is a dedicated body-free artifact. It
binds the reservation, parent spawn/checkpoint observation, and absence or
invalidity of a trustworthy terminal result. It does not contain synthetic
outcomes, counts, collection state, or exit facts. An actually observed
closed exit class, integer exit code, signal number, or timeout observation
may be retained only as a body-free diagnostic under section 9.3. It never
becomes a formal outcome or a synthesized disposition fact.

Success event 2 and the accepted receipt must bind the complete prior
failure/unknown reservation-history hash plus the successful reservation.
Past consumed attempts may not be hidden by publishing only the successful
attempt.

Reservation publication and postverification are part of the consumption
boundary. Once a reservation is remotely published and postverified, both
the one-shot authority and its attempt ID are irreversibly consumed before
worker spawn.

If the reservation write outcome is unknown, including a receive-pack result
that cannot be reconciled by post-fetch, the state is:

```text
RESERVATION_PUBLICATION_OUTCOME_UNKNOWN_STOP
READY_UNUSED_FORBIDDEN
NEW_RESERVATION_FORBIDDEN
FORMAL_SPAWN_FORBIDDEN
AUTOMATIC_RETRY_FALSE
```

Only a separately approved reconciliation lane may inspect the exact remote
ref and immutable candidate path. It may classify the preceding ready receipt
as `READY_UNUSED` only after authoritative post-fetch proves the reservation
artifact absent, the remote main unchanged at the expected old SHA, and no
conflicting path or disposition reachable. Failure to fetch is not proof of
absence. A proven published reservation is consumed; ambiguous or conflicting
evidence remains STOP.

## 8.4 Result-publication recovery

If a trustworthy terminal result was durably persisted but Git publication
failed:

- do not run exact134 again;
- do not create a new reservation;
- preserve the exact result bytes and identity locally;
- close as `RESULT_DURABLY_PRESENT_TERMINAL_PUBLICATION_PENDING_STOP`; and
- permit only a separately approved publication-only authority for those
  same verified bytes.

If no trustworthy terminal result exists after reservation consumption, the
primary classification remains:

```text
ATTEMPT_CONSUMPTION_UNKNOWN_STOP
SAME_ATTEMPT_RERUN_FORBIDDEN
AUTOMATIC_RETRY_FALSE
```

This includes child-process creation failure after the reservation was
published. The parent must persist `PARENT_SPAWN_INTENT_PERSISTED` before
attempting creation and may record the body-free closed exit class
`SPAWN_FAILED`.
Because the reservation and attempt are already consumed, absent or invalid
terminal result bytes still produce the unknown-consumption disposition and
never authorize rerun of the same authority, challenge, attempt, or
reservation.

# 9. Body-free checkpoint and diagnostic contract

## 9.1 Durable stage chain

The parent persists spawn intent before child creation. The child persists a
monotonic hash-linked stage chain. Formal-run stages must be able to
distinguish at least:

```text
PARENT_SPAWN_INTENT_PERSISTED
CHILD_PROCESS_ENTRY
SOURCE_BINDING_VALIDATED
RUNTIME_PROFILE_VALIDATED
PYTEST_IMPORT_VALIDATED
FORMAL_PLUGIN_BOOTSTRAP_VALIDATED
PYTEST_MAIN_ENTERING
COLLECTION_STARTED
COLLECTION_FINISHED
COLLECTION_FAILED
EXECUTION_STARTED
EXECUTION_FINISHED
TERMINAL_RESULT_PERSISTED
```

Preflight uses a separate phase and stops before
`PYTEST_MAIN_ENTERING`. A checkpoint may localize the last observed stage but
may not convert an unknown-consumption run into success or ordinary failure.

Checkpoint schemas are purpose-separated:

```text
preflight checkpoint:
authority + preflight_id + event1 + source/runtime/bootstrap binding

formal-run checkpoint:
authority + attempt_id + reservation + event1 + source/runtime/bootstrap binding
```

No attempt ID is synthesized for a pre-reservation preflight.

The formal stage graph permits explicit terminal branches. For example:

```text
COLLECTION_STARTED
  -> COLLECTION_FINISHED
  -> EXECUTION_STARTED
  -> EXECUTION_FINISHED
  -> TERMINAL_RESULT_PERSISTED

COLLECTION_STARTED
  -> COLLECTION_FAILED
  -> TERMINAL_RESULT_PERSISTED
```

An observed prefix may end early because of process loss. That prefix is
diagnostic evidence only. A transition outside the frozen graph, rollback,
reorder, or a skipped required predecessor inside the selected branch is
invalid.

## 9.2 Atomic local persistence

Each checkpoint and terminal result must use:

- an owner-only directory and file mode;
- no symlink following or path substitution;
- same-directory temporary file;
- canonical JSON and exact-key validation;
- file flush and fsync;
- atomic replace;
- directory fsync;
- monotonic ordinal and prior-checkpoint hash;
- authority/preflight-or-attempt/source/runtime binding; and
- owner plus independent validation before publication.

Invalid graph transition, rollback, duplicate terminal, stale file, partial
JSON, wrong owner, wrong source, or wrong runtime is invalid.

No collection or execution observation may be synthesized when its checkpoint
is absent. In particular, expected registry node IDs are not observed
collection IDs.

## 9.3 Shareable diagnostic fields

Shareable diagnostics may include only closed enums, booleans, integers,
second-precision UTC timestamps emitted by the persistence owner from its
internal clock and formatted exactly as `YYYY-MM-DDTHH:MM:SSZ`,
cryptographic hashes, and this exact identifier allowlist:

```text
logical_cycle_id
recovery_epoch_id
authority_token_id
event1_challenge_id
preflight_challenge_id
formal_run_challenge_id
formal_authority_challenge_id
preflight_id
attempt_id
reservation_ordinal
checkpoint_ordinal
stage_enum
```

No arbitrary string that merely matches a "safe" character pattern is
shareable. Within the exact keysets frozen by D1, those fields may bind:

- process-start observation;
- exit class `EXITED | SIGNALED | TIMED_OUT | SPAWN_FAILED | UNKNOWN`;
- integer exit code or signal number when actually observed;
- checkpoint status `VALID | ABSENT | INVALID`;
- last valid stage or null;
- terminal result status `VALID | ABSENT | INVALID`;
- valid result identity when one exists;
- source/runtime/bootstrap identities; and
- stable STOP code.

Forbidden in checkpoints, receipts, handoffs, and GitHub artifacts:

```text
stdout
stderr
traceback
exception message
raw environment
absolute temporary path
PID or hostname
raw or generated body
prompt or response text
private review data
secret or credential material
free-form diagnostic text
```

For an invalid result, publish `RESULT_INVALID`, not the invalid bytes or a
hash that could become a body oracle.

# 10. D1 minimum causal RED matrix

The next RED must fail on current production behavior and cover at least:

| ID | attack or missing behavior | required closed result |
|---|---|---|
| L01 | valid second reservation is current-head direct child and event1 descendant | accepted by new lineage owner |
| L02 | second reservation still requires event1 direct parent | causal RED |
| L03 | event1 is not an ancestor | reservation rejected |
| L04 | current head / lease / single-parent / changed-path mismatch | publication STOP |
| L05 | prior reservation or disposition missing, hidden, reordered, or duplicated | lineage rejected |
| L06 | prior reservation unresolved or result publication pending | new reservation forbidden |
| L07 | authority/challenge/attempt/path/readiness reuse | replay forbidden |
| L08 | success event2 already published | new reservation forbidden |
| L09 | source/proof/registry/bootstrap drift | event1 reuse forbidden |
| L10 | accepted/event2 omits earlier failed or unknown lineage | success publication forbidden |
| L11 | a second Epoch002 event1 is created after the first one exists | duplicate event1 rejected |
| L12 | event1/preflight/formal-run challenge values collide | phase-boundary replay rejected |
| L13 | ordinal uses bool-as-int, wrong integer domain, missing/extra key, altered history hash, or altered attempt preimage | schema/lineage rejected |
| L14 | reservation base or closure differs from the postverified ready state | ready-to-reservation drift STOP |
| L15 | reservation-to-child source/runtime parity drifts after consumption | unknown-consumption STOP, no rerun |
| L16 | Epoch002 event1 uses `nls_v3_rc_0034`, omits a candidate ID, or inherits Epoch001 acceptance credit | release-candidate boundary conflict STOP |
| L17 | event1/readiness/reservation/result/accepted lineage candidate IDs disagree | lineage rejected |
| L18 | candidate ID is allocated before or without binding the postverified D2 final closure | source-baseline publication forbidden |
| B01 | preflight fails or is absent | reservation and exact134 both exact0 |
| B02 | preflight calls pytest.main, collection, test import, or test execution | readiness forbidden |
| B03 | unlisted conftest/plugin, or FB172 without a complete explicitly locked closure, enters the formal boundary | readiness forbidden |
| B04 | local plugin closure or external distribution version/hash drifts | readiness forbidden |
| B05 | Python/pytest/environment/argv/owner parity drifts | readiness forbidden |
| B06 | `READY_FOR_EXACT_ONE_FORMAL_SPAWN` receipt is stale, mutated, reused, or not immediate base | reservation forbidden |
| B07 | child spawn failure, early-exit, signal, or timeout with trustworthy terminal result absent/invalid after reservation publication | `SPAWN_FAILED` or observed closed exit class diagnostic plus unknown STOP, no rerun |
| B08 | checkpoint stage skip/reorder/rollback/partial/symlink substitution | checkpoint invalid |
| B09 | absent checkpoint with synthetic collected/executed nodes | formal attempt forbidden |
| B10 | diagnostic field/body-free attack | body-free violation |
| B11 | durable valid result publication failure | publication-only STOP, no new run |
| B12 | readiness receipt includes its own commit/blob/raw identity | self-reference rejected |
| B13 | readiness publication violates exact lease, direct-child, immutable-path, exact-path-set, or postfetch contract | readiness not published |
| B14 | readiness owner and independent verifier disagree | readiness forbidden |
| B15 | preflight manifest omits a static import classification or required third-party distribution mapping | readiness forbidden without test import/collection |
| B16 | unknown disposition injects a synthetic exit, outcome, count, or collection state | disposition rejected |
| B17 | durable terminal result bytes are mutated, multiple runs are ranked, or an earlier consumed-attempt disposition is dropped | terminal/acceptance publication rejected |
| B18 | invalid result bytes or their hash are published as diagnostics | body-oracle violation |
| B19 | an earlier ready receipt has no reservation-or-unused disposition | next preflight and reservation forbidden |
| B20 | ready receipt has duplicate/conflicting dispositions or an unused disposition is reused | readiness lineage rejected |
| B21 | reservation receive-pack outcome is unknown or post-fetch cannot prove presence/absence | publication-outcome-unknown STOP; READY_UNUSED, new reservation, and spawn forbidden |
| B22 | authoritative post-fetch proves exact reservation absence but code marks the ready receipt consumed or fabricates a reservation | only body-free READY_UNUSED closure is eligible; fabricated consumption rejected |
| B23 | Epoch002 reservation drops, weakens, or silently renames a historical base field | additive-schema validation rejected |
| B24 | canonical reservation hash/preimage or phase-explicit alias disagrees with the base challenge fields | reservation rejected |

D1 must freeze exact future owner/test paths, protected sets, schema keysets,
hash preimages, and targeted denominator. It must not implement the repair.

# 11. Confirmed facts, inference, unknowns, and Karen opinion

## 11.1 Confirmed facts

- RETRY007 event 1 and reservation are valid published history.
- exact134 was started once and its outcome is unknown and not claimable.
- the same authority/challenge/attempt may not be rerun.
- current production cannot append a later reservation while also requiring
  event 1 to be its direct parent.
- current formal order has no pre-reservation complete bootstrap preflight.
- an unrelated explicitly registered plugin reaches an unavailable package in
  the RETRY007 isolated runtime.
- current source closure does not fully model the pytest-plugin and installed
  distribution collection boundary.
- repairing the relevant owners changes the closure locked by Epoch 001
  event 1.
- the Revised Cycle Detailed Design requires a new release candidate after
  source/test/runner/config/schema/dependency-affecting frozen-RC changes.
- therefore `nls_v3_rc_0034` is Recovery Epoch 001 history only, while
  Epoch 002 must bind a distinct candidate ID after D2 final closure.
- no source drift or repair was performed by this authority.

## 11.2 Inference

The highest-confidence explanation for the missing RETRY007 worker result is
a collection/bootstrap import failure caused by the incomplete isolated
runtime dependency closure. The exact exception and final child stage were
not retained, so FastAPI absence is not claimed as the exact or only cause.

## 11.3 Unknown and not written

- RETRY007 exact exception, exit code, signal, timeout, collection state, and
  test outcome;
- future Epoch002 source commit/tree/closure;
- exact future Epoch002 `candidate_version_id`, which is allocated only after
  D2 final closure and before event 1;
- future event, readiness, reservation, attempt, and terminal identities;
- exact future dependency versions and installer hashes;
- exact future schema keysets and source/test paths before D1;
- D1 RED result, D2 implementation result, or formal exact134 result;
- P2, fresh exact100, Product Read, correction, B6, or Cycle acceptance.

These are not completed by inference.

## 11.4 Karen opinion

Karen judges Epoch 001 invalidation to be necessary because preserving the
published reservation while repairing the only source/proof path forward is
more truthful than pretending the locked baseline can continue.

Karen also judges that semantic event ancestry and Git transaction parenthood
must be separate. Event 1 proves what source a run belongs to; the current
main parent and exact lease prove where the next append-only reservation was
published.

Finally, bootstrap readiness must be proved before formal consumption.
Isolating unrelated plugins is the preferred implementation direction, but
the RED must define the invariant before source is changed.

# 12. Repository, privacy, and authority boundary

For this authority:

```text
mashos-api source changes:
0

test / pytest / exact134 / broad regression:
NOT_RUN / NOT_RUN / NOT_RUN / NOT_RUN

new event / reservation / attempt:
0 / 0 / 0

private body / Product Read:
0 / 0

P2 / fresh batch / correction / B6:
NOT_AUTHORIZED

Cycle001 acceptance:
NOT_ACCEPTED

read-only subagent lanes:
3

subagent edit / test / commit / GitHub write:
0 / 0 / 0 / 0
```

Only the body-free parent design, receipt, handoff, plan append, and
latest-snapshot append are permitted Cocolon changes.

# 13. Result and next authority

```text
STATUS:
RECOVERY_EPOCH001_INVALIDATED_RECOVERY_EPOCH002_PARENT_DESIGN_FROZEN_DEFINED_NOT_STARTED_AUTHORITY_STOP

RECOVERY_EPOCH001 EVENT1 / RESERVATION:
PUBLISHED_IMMUTABLE_HISTORICAL_NOT_REUSABLE

RETRY007:
CLOSED_NOT_RESUMABLE_NOT_REUSABLE

RECOVERY_EPOCH002 SOURCE BASELINE / EVENT1:
UNLOCKED / NOT_CREATED

RECOVERY_EPOCH002 CANDIDATE VERSION:
UNALLOCATED_DISTINCT_FROM_NLS_V3_RC_0034

LINEAGE / BOOTSTRAP:
DESIGNED_NOT_IMPLEMENTED

RED / IMPLEMENTATION / FORMAL EXACT134:
NOT_RUN / NOT_STARTED / NOT_RUN

P2:
NOT_AUTHORIZED

CYCLE001:
NOT_ACCEPTED

NLS_V3_METHOD_STOP:
false

AUTOMATIC_PROGRESSION:
false

AUTHORITY_STOP
```

Exactly one next separate-approval candidate:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_POST_RESERVATION_RETRY_LINEAGE_AND_FORMAL_WORKER_BOOTSTRAP_COMPLETENESS_RECONCILIATION_RED_FREEZE_ONLY
```

After D1 completion, but not approved by this document:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_POST_RESERVATION_RETRY_LINEAGE_AND_FORMAL_WORKER_BOOTSTRAP_COMPLETENESS_RECONCILIATION_IMPLEMENTATION_AND_GREEN_ONLY
```

This candidate is eligible only after a postverified
`CAUSAL_RED_FROZEN` exit, not after an arbitrary D1 STOP.

After D2 completion, but not approved by this document:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_SOURCE_BASELINE_AND_STEP0_10_COMPLETION_RECEIPT_GENERATION_AND_VERIFICATION_ONLY
```

This candidate is eligible only after a postverified
`IMPLEMENTED_TARGETED_GREEN` exit, not after an arbitrary D2 STOP.

RETRY008 is not revived or renamed. No downstream authority is approved or
active. Separate explicit approval is required at every STOP.
