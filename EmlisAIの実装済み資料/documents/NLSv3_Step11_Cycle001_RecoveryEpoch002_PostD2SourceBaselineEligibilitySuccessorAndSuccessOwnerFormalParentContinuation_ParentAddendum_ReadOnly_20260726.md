---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch002_post_d2_source_baseline_eligibility_successor_and_success_owner_formal_parent_continuation_parent_addendum
title: "NLS v3 Step 11 Cycle 001 Recovery Epoch 002 post-D2 source-baseline eligibility successor and success-owner/formal-parent continuation Parent Addendum"
revision_date: "2026-07-26"
status: "RECOVERY_EPOCH002_POST_D2_SOURCE_BASELINE_ELIGIBILITY_SUCCESSION_PARENT_ADDENDUM_DESIGN_FROZEN_AUTHORITY_STOP"
document_authority: "NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_POST_D2_SOURCE_BASELINE_ELIGIBILITY_SUCCESSION_ACCEPTED_STEP0_10_ALL11_EVENT2_ATOMIC_SUCCESS_OWNER_GRAPH_AND_FORMAL_PARENT_CONTINUATION_ADDENDUM_DESIGN_READ_ONLY"
body_free: true
automatic_progression: false
cycle001_status: "NOT_ACCEPTED"
---

# 0. Decision

Mash explicitly approved:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_POST_D2_SOURCE_BASELINE_ELIGIBILITY_SUCCESSION_ACCEPTED_STEP0_10_ALL11_EVENT2_ATOMIC_SUCCESS_OWNER_GRAPH_AND_FORMAL_PARENT_CONTINUATION_ADDENDUM_DESIGN_READ_ONLY
```

This append-only Parent Addendum resolves the pre-Event1 gate-order conflict
without rewriting the completed Recovery Epoch002 D2 history.

The immutable historical D2 targeted-GREEN receipt and final closure remain
valid exactly as published. The old Parent Design edge:

```text
historical D2 final closure
-> candidate allocation
-> Event1 bound directly to historical D2
```

is no longer an eligible operational edge. It is replaced prospectively by:

```text
historical D2 final closure
-> this Parent Addendum design freeze
-> success-owner / schema-succession causal RED freeze
-> implementation / targeted GREEN
-> successor source-closure completion receipt publication/postverification
-> fresh Git transport / durable-store capability proof
-> operational-admission receipt exact1 publication/postverification
-> distinct candidate allocation embedded in successor Event1
-> successor Event1 publication/postverification
```

No historical D2 bytes, receipt, logical hash, publication identity, or
closure are edited, reissued, reopened, or treated as if they already
contained the successor success-owner graph.

This authority freezes design only. It does not change mashos-api source,
tests, schemas, fixtures, samples, dependency locks, runtime, or credentials.
It does not run pytest, causal RED, targeted GREEN, broad regression, or
formal exact134. It does not allocate a candidate or publish Event1,
readiness, reservation, terminal, accepted, Step, all11, manifest, or Event2.

Fixed result:

```text
CURRENT_AUTHORITY_RESULT:
RECOVERY_EPOCH002_POST_D2_SOURCE_BASELINE_ELIGIBILITY_SUCCESSION_PARENT_ADDENDUM_DESIGN_FROZEN_AUTHORITY_STOP

GOVERNING_OPERATIONAL_STATE:
POST_D2_SUCCESSOR_CLOSURE_NOT_IMPLEMENTED_PRE_EVENT1_AUTHORITY_STOP

HISTORICAL_D2:
IMMUTABLE_TARGETED_GREEN_RETAINED

POST_D2_SUCCESSOR:
DESIGNED_NOT_IMPLEMENTED

SOURCE_BASELINE:
UNLOCKED

RECOVERY_EPOCH002_CANDIDATE_VERSION:
UNALLOCATED_DISTINCT_FROM_NLS_V3_RC_0034

OPERATIONAL_ADMISSION:
NOT_CREATED / NOT_PUBLISHED

EVENT1 / READINESS / RESERVATION / ATTEMPT / TERMINAL:
NOT_CREATED / NOT_PUBLISHED / 0 / 0 / NOT_CREATED

FORMAL_EXACT134:
NOT_RUN / INVOCATION_COUNT_0

ACCEPTED / STEP00..10 / ALL11 / MANIFEST / EVENT2:
0 / 0 / 0 / 0 / 0

P2 / CYCLE001:
NOT_AUTHORIZED / NOT_ACCEPTED

AUTOMATIC_PROGRESSION:
false

AUTHORITY_STOP
```

# 1. Precedence and fixed entry

## 1.1 Precedence

The following remain normative:

1. the supplied Revised Cycle Detailed Design for NLS v3 product,
   Step00..10 completion, Step11 Cycle001, privacy, RC invalidation, and
   method STOP;
2. the Recovery Epoch001 invalidation / Recovery Epoch002 Parent Design for
   P0, historical invalidation, bootstrap, reservation-consumption, retry,
   checkpoint, and body-free boundaries;
3. the historical Recovery Epoch002 D1 causal RED and D2 implementation /
   targeted-GREEN results;
4. the accepted-success contract reconciliation STOP as the direct reason
   this Addendum was required; and
5. this Addendum only for the post-D2 pre-Event1 eligibility edge and the
   success-owner/formal-parent continuation it defines.

This Addendum does not weaken the Revised Cycle completion criteria and does
not inherit Recovery Epoch001 acceptance credit.

If a future implementation would require historical D2 rewrite, old
candidate reuse, synthetic formal outcomes, private-body publication,
case-specific product repair, or automatic progression, the result is:

```text
PARENT_ADDENDUM_CONTRACT_CONFLICT_STOP
```

## 1.2 Repository entry

| repository | fixed entry |
|---|---|
| `MassyuRed/Karen-Diary` | commit `700f749f5149cac1f8bd4bab8a364d524a56985b` |
| `MassyuRed/Cocolon` | commit `2c3fc3d3b29365b073ee228c0ac536d4ffc3cffc` |
| `MassyuRed/mashos-api` | commit `5eb4d6d1f0a18a715f33305e7fb7cfe92be42d74`, tree `b7ad6dd2dbc90e9db296f8599103597d6bbd7ff7` |

The mashos-api materialization was clean and detached at the exact commit and
tree above. No subagent edited files, ran tests, created commits, or wrote to
GitHub.

## 1.3 Normative and current-navigation identities

| material | identity | role |
|---|---|---|
| Revised Cycle Detailed Design | SHA-256 `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc` | Step completion and product boundary |
| long-term roadmap | SHA-256 `04fb9e4e11af2b1530d03d95d8e959ba644503722f72094a289bde1d4368ce5b` | long-term product-quality context |
| supplied historical Execution Plan | SHA-256 `31682e71ac047ac5f2f329d62ebc51b471bdcb00430a6ab35bcfb934c1438ca7` | historical navigation only |
| current tracked Execution Plan | blob `16a56eba1a213f05f24623724e540dbf847c9c89` | current authority ledger |
| current latest snapshot | blob `9ee10e974027ba8de059255714a71e70bc0800cf` | current navigation ledger |
| Recovery Epoch002 Parent Design | blob `af00c5c4a49207fb94108afbf383ea0e830620ae` | governing parent before this additive amendment |
| Epoch001 success contract design | blob `7e7d454d888141cbdb872244bf6df93c046e0b6c` | historical contract input only |
| preceding reconciliation STOP receipt | logical SHA-256 `f85639fdd37052caa3012ddae4c43f5bbb731521291509db26145d43b7cf6afe` | direct predecessor |

# 2. Confirmed current facts

## 2.1 Historical D2 is complete and immutable

The fixed D2 completion identity is:

```text
publication commit:
8d26f3344be8b1e6a4661f958d8279a6236191d1

receipt Git blob:
d93f7e63e8a941a15f11cfdc088a8613af041e41

logical receipt SHA-256:
0af065a6499ff99164d206f6fddafafaa91f3436de191f20078e6c4aa858253c

D2 final closure SHA-256:
2d15d58d7bbdd2dab91f526486dcaf29a05c7326ec3944a91fc04757c1d73fbe
```

The D2 final-closure preimage has exact10 keys:

```text
source_commit_sha1
source_tree_sha1
canonical_current_closure_sha256
source_dependency_closure_sha256
proof_source_closure_sha256
requirement_registry_sha256
formal_node_registry_sha256
formal_test_manifest_sha256
bootstrap_closure_sha256
detailed_design_sha256
```

This Addendum treats those exact bytes and identities as historical ancestor
evidence. It does not recompute the old D2 hash using future source.

## 2.2 No irreversible P1 identity exists

At authority entry:

```text
candidate allocation:
0

operational admission:
0

Event1:
0

readiness:
0

reservation:
0

attempt:
0

formal exact134 invocation:
0

terminal:
0

accepted / Step00..10 / all11 / manifest / Event2:
0 / 0 / 0 / 0 / 0
```

Therefore the post-D2 eligibility edge can be changed append-only without
invalidating an issued Event1 or consumed attempt.

## 2.3 Current v1 candidate/Event1 are hard-bound to old D2

Current
`ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py`
defines:

```text
cocolon.emlis.nls_v3.recovery_epoch002.candidate_allocation.v1
cocolon.emlis.nls_v3.recovery_epoch002.sequence_event.v1
```

The candidate allocation exact keyset contains the old
`d2_final_closure_sha256` and D2 completion receipt. Event1 validates the
same direct binding.

Changing those v1 meanings in place would make old code and frozen D2 design
mean something they did not mean when published. Additive successor schemas
are therefore required.

## 2.4 Current success-owner graph is absent

Current mashos-api has no Epoch002-specific owner and independent verifier
for:

```text
accepted exact134 success receipt
Step00..10 current completion receipts exact11
all11 completion chain
all11 atomic publication manifest
success Event2
success exact15 publication
independent terminal-success semantic closure
```

The existing generic publication owner supports exact6 one-path roles:

```text
SOURCE_BASELINE_EVENT
BOOTSTRAP_READINESS
FORMAL_TEST_RUN_RESERVATION
FORMAL_WORKER_TERMINAL_RESULT
ATTEMPT_CONSUMPTION_UNKNOWN_DISPOSITION
READY_UNUSED_AUTHORITY_STOP
```

It does not own an exact15 transaction.

The existing independent publication verifier operationally verifies only
source baseline, readiness, and reservation. It does not independently close
terminal or success exact15 semantics.

## 2.5 Current formal parent stops before success closure

The existing parent has exact5 external ports:

```text
observe_event1_publication
run_bootstrap_preflight
publish_readiness
publish_reservation
spawn_exact134_once
```

It stops at a terminal/unknown observation. It has no explicit
terminal-publication/postverification port and no exact15-success port.

## 2.6 Current terminal evidence is insufficient

The current terminal result records ordered collection/execution node IDs,
states, collection errors, process exit facts, source/runtime/bootstrap
roots, and timestamps.

It does not preserve exact134 per-node rows containing:

```text
source path
source Git blob SHA-1
source raw SHA-256
result
expected independent-negative closed code
actual independent-negative closed code
evidence SHA-256
```

The historical Step receipt owner requires those facts to establish actual
owners, positive proof, independent negative proof, artifact evidence,
completion, and non-triggered STOP conditions. They may not be guessed after
a consumed one-shot attempt.

## 2.7 Current owner-file identities

At the fixed mashos-api entry, the current exact9 D1 owner paths have these
Git-blob/raw identities:

| path suffix | Git blob SHA-1 | raw SHA-256 |
|---|---|---|
| `emlis_ai_recovery_epoch002_canonical_current_closure_v3.py` | `1117ec848d4359882c377313046982e12b1d1c12` | `29471406e4a1c0e93603aaecdaccc328bd1e6cab89e91b5ad41f4e6091f80480` |
| `emlis_ai_recovery_epoch002_sequence_ledger_v3.py` | `28b2618f1383049d75ba01b1cd4a319bf2299246` | `dc8a1d8e964a02db2d042ba71955170f5b65832c497a79d21c580dfbd00bc347` |
| `emlis_nls_v3_recovery_epoch002_formal_worker_evidence_v3.py` | `f394d09ed13a51bf4c3c3b6559864dac7463d6f1` | `4f2bb7fe28b7172266ffd7953aa518eccad28c95754daabf3d40c6fede854384` |
| `emlis_nls_v3_recovery_epoch002_current_step_proof_run.py` | `5e2d70db551150bb17b5000ef0401c55ca70bbf2` | `17fcb514bf9b9a41380da8fddab1101e498467f04d887cad50bf3d0f2a648b8e` |
| `emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py` | `4943332274333ff1b683522b98dc2503ec520eb4` | `6dbf685939678f7497b52d6a422a7515ae79d3be490bb6646705bd3969f9a886` |
| `emlis_nls_v3_recovery_epoch002_atomic_publication_bundle_v3.py` | `47b4345929b65c5e5886445c079e248b907ec6de` | `f854b29a81f16b52a42fd235b95550edfd178fd1f4eb3aafe7e0ded102f7da2c` |
| `emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py` | `03328eb6c115699e93e114d1087989f1ec85af95` | `4ae8b8078b25343f06819da6baae5c9586d5031453c6def5bd2f4927f130306f` |
| `emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_preflight.py` | `a2f5b472841b6934560c3bb43579a8afd5b383f2` | `4b0bab51f295e67ba081d4abe9fa2567ae0589514d2429a64c6903c7ded61495` |
| `emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_lock_v1.json` | `0822fcb010985cd0d384f250a9e8a1fe16dc8fd4` | `9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787` |

The existing Epoch002 D1 causal test has exact46 collected items. The
declarative formal registry remains registry-order exact134, including
exact11 independent-negative nodes. These facts define the protected entry;
they are not future RED/GREEN results.

# 3. Exact additive amendment

## 3.1 Replaced eligibility edge only

This Addendum replaces only the future eligibility meaning of Parent Design
sections 4 through 6 where old D2 directly made candidate allocation and
Event1 eligible.

The following remain unchanged:

- Recovery Epoch001 invalidation and retained history;
- Recovery Epoch002 P0 identity;
- historical D1 and D2 evidence;
- one Event1 per recovery epoch;
- preflight before reservation;
- readiness one-shot disposition;
- reservation consumption before formal spawn;
- exact134 at most once per reservation/attempt;
- append-only retry lineage;
- no synthetic terminal outcome;
- body-free public artifacts;
- no automatic progression; and
- P2 as a separate explicit authority.

## 3.2 Additive successor eligibility

The new eligibility predicate is:

```text
historical D2 receipt is postverified and immutable
AND this Addendum is published and postverified
AND successor causal RED is frozen and postverified
AND successor implementation targeted GREEN is postverified
AND successor source-closure completion receipt is published and postverified
AND required Git publication capability is freshly proved
AND required durable evidence capability is freshly proved
AND operational-admission receipt exact1 is published and postverified
```

Only then may a P1 authority freeze candidate/Event1 bytes.

An Addendum publication by itself does not make P1 eligible.

# 4. Gate and authority order

The amended Recovery Epoch002 order is:

| gate | allowed work | required success exit | automatic next |
|---|---|---|---|
| historical P0 | already completed parent identity | immutable history | none |
| historical D1 | already completed retry/bootstrap causal RED | immutable history | none |
| historical D2 | already completed implementation/targeted GREEN | immutable historical targeted GREEN | none |
| A0 current Addendum | read-only parent amendment and exact5 documentation reflection | `PARENT_ADDENDUM_DESIGN_FROZEN` | none |
| S1 successor causal RED | one additive RED file; production exact10 and existing exact11 independent-negative tests untouched | `SUCCESSOR_CAUSAL_RED_FROZEN` | none |
| S2 successor implementation/GREEN | approved production exact10 plus existing exact11 independent-negative evidence adapters, targeted exact110, successor closure/receipt publication | `POST_D2_SUCCESSOR_COMPLETION_PUBLISHED_AND_POSTVERIFIED` | none |
| P1 formal source/Step00..10 | fresh capability proof, operational-admission exact1 publication/postverification, candidate/Event1, readiness, reservation, exact134 once, terminal, success exact15 or STOP | `STEP0_10_PREREQUISITES_PROVED` or explicit STOP | none |
| P2 and later | original later gates with successor identities | separately approved result or STOP | none |

No authority bundles A0, S1, S2, P1, or P2.

Every gate ends:

```text
AUTOMATIC_PROGRESSION_FALSE
AUTHORITY_STOP
```

# 5. Post-D2 successor completion contract

## 5.1 Successor completion is not a sequence event

The successor completion receipt is an administrative source-eligibility
artifact. It is not Event0, does not consume Event1 ordinal, and does not
lock the source baseline.

Event1 remains exact ordinal 1 and is the only transition that locks the
Recovery Epoch002 source baseline.

## 5.2 Frozen successor schemas and receipt path

Source closure schema:

```text
cocolon.emlis.nls_v3.recovery_epoch002.post_d2_source_baseline_eligibility_successor_closure.v1
```

Completion receipt schema:

```text
cocolon.emlis.nls_v3.recovery_epoch002.post_d2_source_baseline_eligibility_successor_completion_receipt.v1
```

Immutable completion path:

```text
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2SourceBaselineEligibilitySuccessorCompletion_BodyFree_Receipt_20260726.json
```

The completion receipt is exact1 and body-free. The source closure is the
canonical semantic object whose hash the receipt binds; it is not an
additional sequence event.

## 5.3 Successor source closure exact20

The strict exact20 keyset is:

```text
schema_version
repository_full_name
source_ref
source_commit_sha1
source_tree_sha1
worktree_clean
detailed_design_sha256
parent_addendum_external_identity_sha256
historical_d2_final_closure_sha256
historical_d2_completion_receipt_identity_sha256
source_dependency_closure_sha256
canonical_current_closure_sha256
requirement_registry_sha256
formal_node_registry_sha256
proof_source_closure_sha256
formal_test_manifest_sha256
bootstrap_closure_sha256
success_owner_graph_sha256
success_contract_test_manifest_sha256
source_closure_sha256
```

`source_closure_sha256` is the canonical logical hash over the other exact19
keys. The closure covers the post-S2 source, production exact10, exact11
independent-negative evidence adapters, runner, schemas, dependency identity,
success owners, terminal evidence, independent verifier, formal-parent
continuation, publication contract, and exact64 successor contract tests.

`formal_test_manifest_sha256` is the immutable exact134 product/formal-node
manifest root. `success_contract_test_manifest_sha256` is the disjoint
historical46-plus-successor64 causal-contract manifest from section 14.2.
Neither denominator may substitute for the other.

It binds the historical D2 identity as immutable ancestor evidence. The new
source commit/tree must not be represented as the historical D2 commit/tree.

The bootstrap closure in this object uses:

```text
cocolon.emlis.nls_v3.recovery_epoch002.formal_worker_bootstrap_manifest.v2
```

with the strict exact31 top-level shape:

```text
schema_version
source_commit_sha1
source_tree_sha1
formal_owner_artifacts
formal_owner_artifacts_sha256
formal_test_node_ids
formal_test_manifest
formal_test_manifest_sha256
conftest_plugin_mode
pytest_plugins_environment_variable_removed
pytest_entrypoint_autoload_disabled
explicit_plugin_allowlist
loaded_plugin_manifest
loaded_plugin_manifest_sha256
import_manifest
import_manifest_sha256
dependency_lock_identity
installed_distributions
installed_distributions_sha256
python_runtime_identity
pytest_distribution_identity
environment_profile
environment_profile_sha256
preflight_argv
preflight_argv_sha256
formal_worker_argv
formal_worker_argv_sha256
unclassified_import_count
unresolved_dynamic_import_count
body_free
bootstrap_closure_sha256
```

`formal_test_node_ids` is registry-order exact134, and both import issue
counts are zero. Its
`formal_owner_artifacts` changes from historical exact12 roles/exact9 paths
to successor exact15 roles/exact12 distinct paths; the historical v1
manifest remains immutable.

## 5.4 Successor completion receipt exact13

The strict exact13 keyset is:

```text
schema_version
logical_cycle_id
recovery_epoch_id
historical_d2_final_closure_sha256
historical_d2_completion_receipt_identity_sha256
parent_addendum_external_identity_sha256
successor_source_closure_sha256
causal_red_evidence_sha256
combined_green_evidence_sha256
state
automatic_progression
body_free
receipt_sha256
```

Required values:

```text
state = SUCCESSOR_SOURCE_BASELINE_ELIGIBILITY_PROVED
automatic_progression = false
body_free = true
```

`receipt_sha256` is the canonical logical hash over the other exact12 keys.
`causal_red_evidence_sha256` exact-matches the logical artifact hash of the
postverified S1 body-free result receipt whose state is
`SUCCESSOR_CAUSAL_RED_FROZEN`. `combined_green_evidence_sha256`
exact-matches the logical artifact hash of the postverified S2 body-free
targeted-GREEN result receipt. That S2 evidence must bind the S1 evidence,
the successor source commit/tree and closure, the success-contract manifest
exact110 ordered node IDs, exact110 executed/PASSED outcomes, success
counts, and owner/independent issue counts exact0. The completion owner and
independent verifier receive and verify both full external identities; the
completion receipt stores their logical hashes and may not accept a
caller-supplied bare hash without the corresponding postfetch evidence.
Transaction-dependent Git capability and durable-store capability are not
folded into this stable semantic receipt. They are independently admitted
under section 12 and must not be inferred from semantic GREEN.

Once the completion receipt is published:

- its path and bytes are immutable;
- source/test/runner/schema/config/dependency drift makes it ineligible for
  Event1;
- it is not overwritten or reissued under the same identity; and
- a required repair returns to a separate recovery decision.

## 5.5 Publication of successor completion

Let `C0` be the fresh current Cocolon main before publication and `C1` the
successor-completion commit.

The initial publication requires:

```text
target path absent at C0
C1 parent exact1 == C0
changed path exact1 == successor completion path
true server-side expected-old C0 -> C1
fresh full postfetch
owner issue count 0
independent issue count 0
automatic_progression false
```

An ordinary connector `force=false` update without expected-old comparison
does not prove this contract.

# 6. Candidate allocation and successor Event1

## 6.1 Candidate allocation is embedded

Candidate allocation is a canonical nested record in Event1, not a separate
publication path.

The candidate ID is selected only after a fresh pre-Event1 capability and
successor-closure admission check. It becomes an operative published
candidate identity only when Event1 is postverified.

This avoids an unreferenced standalone allocation artifact while retaining a
deterministic allocation preimage.

## 6.2 Successor candidate schema

Schema:

```text
cocolon.emlis.nls_v3.recovery_epoch002.candidate_allocation.v2
```

The strict exact10 keyset is:

```text
schema_version
logical_cycle_id
recovery_epoch_id
candidate_version_id
historical_d2_final_closure_sha256
historical_d2_completion_receipt
successor_source_closure_sha256
successor_completion_receipt
allocated_at_utc
candidate_allocation_sha256
```

Required rules:

- candidate ID is a non-empty body-free machine token and immutable;
- candidate ID is not `nls_v3_rc_0034`;
- candidate ID collides with no known NLS v3 candidate;
- the historical D2 and successor completion receipts are independently
  postverified external identities;
- the successor completion receipt binds the exact successor source closure;
- allocation occurs after successor completion postverification;
- allocation timestamp is not later than Event1 timestamp;
- `allocated_at_utc` is a canonical UTC-second string;
- candidate allocation hash covers the other exact9 fields; and
- no Epoch001 event, run, accepted, Step, batch, or Product Read credit is
  inherited.

## 6.3 Successor Event1 schema

Event1 and Event2 deliberately share one additive strict ledger schema:

```text
cocolon.emlis.nls_v3.recovery_epoch002.sequence_event.v2
```

Its exact23 common keyset is:

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
p0_external_identity
candidate_allocation
bootstrap_closure
```

This is intentional schema unification, not an accidental role collision.
The validator has disjoint conditional branches for ordinal/name/state and
evidence cardinality. It rejects an Event1 object shaped as Event2 or the
reverse. `event_sha256` is the canonical logical hash over the other exact22
top-level keys. The old v1 schema and meaning remain immutable.

Common scalar rules are:

```text
ledger_id / event_id / candidate_version_id:
non-empty body-free machine tokens

logical_cycle_id:
NLS_V3_CYCLE_001

recovery_epoch_id:
NLS_V3_CYCLE001_RECOVERY_EPOCH_002

event_ordinal:
plain integer, never bool

timestamp_utc:
canonical UTC-second string

timestamp_kind:
ORCHESTRATOR_UTC_BEFORE_REF_UPDATE

challenge_id:
lowercase SHA-256

automatic_progression:
false

body_free:
true
```

Event1 and Event2 use the same `ledger_id`, distinct `event_id` values, and
strictly increasing timestamps. No identifier or timestamp is supplied by
the formal worker.

The v2 `authority` subobject is strict exact4:

```text
approval_kind
transition_authority_token
publication_authority_token
operational_admission
```

`approval_kind = EXPLICIT_SEPARATE_APPROVAL`; both authority tokens are the
same non-empty string. `operational_admission` is the postverified exact10
external identity for the exact section 12.2 receipt and is exact-equal to
the separately supplied admission identity. For Event1, the tokens also
equal the admission receipt's admission/publication tokens. For Event2, they
bind the separately explicit Event2 phase request and do not authorize P2.

The v2 `publication` subobject is strict exact11:

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
transaction_capability
```

Common required values are:

```text
repository_full_name = MassyuRed/Cocolon
branch = main
ref_update_mode = EXPECTED_OLD_SHA_LEASE_WITH_VERIFIED_DIRECT_CHILD
publication_state = PUBLISHED_ATOMIC
```

`base_commit_sha1` is lowercase SHA-1; `event_path` is the one immutable
branch-specific event path; supporting artifacts are path-sorted and unique;
count and set hash are exact; and
`expected_changed_path_count` is an integer, not bool.
`supporting_artifact_set_sha256` is the canonical logical hash of the exact
path-sorted `supporting_artifacts` list and has no additional envelope.

The supporting-artifact row schema is branch-specific:

```text
Event1:
exact1 strict exact10 postverified external identity

Event2:
exact14 strict exact8 co-published candidate identities
```

Event2 rows contain no publication commit or external identity self-hash;
that prohibition prevents `S` self-reference. A validator must not accept an
Event1 external row in Event2 or an Event2 candidate row in Event1.

`transaction_capability` is strict exact15:

```text
schema_version
provider_class
provider_identity_sha256
repository_full_name
source_ref
base_commit_sha1
expected_changed_path_count
authoritative_ref_read
expected_old_compare_and_swap
commit_parent_tree_and_recursive_read
full_changed_and_unchanged_postfetch_verification
challenge_id
operational_admission_identity_sha256
observed_at_utc
transaction_capability_sha256
```

Its schema is
`cocolon.emlis.nls_v3.recovery_epoch002.git_transaction_capability.v1`;
`provider_class =
EXPECTED_OLD_CAS_CAPABLE_GITHUB_TRANSPORT`, and provider identity equals the
operational admission transport provider. Repository/ref/base/count equal
the event publication values, with
`source_ref = refs/heads/{publication.branch} = refs/heads/main`. The exact4
capability flags are booleans and all true. `challenge_id` exact-matches the
event challenge, and
`operational_admission_identity_sha256` exact-matches
`authority.operational_admission.identity_sha256`. `observed_at_utc` is a
UTC-second string within the admission freshness interval and no later than
the event timestamp. `transaction_capability_sha256` is the canonical
logical hash over the other exact14 keys.

Successor Event1 must bind:

```text
Recovery Epoch002 P0 external identity
historical D2 completion external identity and final closure
this Parent Addendum external identity
successor completion external identity
successor source closure
embedded candidate allocation v2
post-S2 source commit/tree and complete source closure
bootstrap closure
event1 challenge
publication intent
automatic_progression false
body_free true
```

Its strict branch is:

```text
event_ordinal = 1
event_name = SOURCE_BASELINE_LOCKED
state = SOURCE_BASELINE_LOCKED
prior_event = frozen P0 external identity
primary_evidence_artifact = successor completion receipt external identity
publication.supporting_artifact_count = 1
publication.expected_changed_path_count = 1
```

`candidate_allocation.successor_completion_receipt` and the primary evidence
are exact-equal. The old D2 receipt remains allocation ancestor evidence and
is not substituted for current Event1 primary evidence.
Event1 additionally requires:

```text
publication.supporting_artifacts
==
[primary_evidence_artifact]
==
[candidate_allocation.successor_completion_receipt]
```

Thus count exact1 cannot be satisfied by a different supporting artifact.

The Event1 `authority` strict subobject includes one postverified
`operational_admission` external identity. It is part of the Event1
`event_sha256` preimage and binds the successor closure, capability scope,
freshness, challenge, Git transport, and durable-store admission from
section 12. Candidate allocation alone is never operative; only the
allocation plus this postverified Event1 are operative.

The historical D2 commit is semantic ancestor evidence. The current Cocolon
head is the Git transaction parent. These meanings remain distinct.

The Event2 branch is frozen in section 11. It uses ordinal 2, the
`STEP0_10_PREREQUISITES_PROVED` name/state, published Event1 as prior event,
and exact14 supporting candidate identities.

## 6.4 Event1 publication

Event1 is exact1:

```text
immutable path:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_SequenceEvent01_SourceBaselineLocked_BodyFree_Event_20260726.json

event count before:
0

event ordinal:
1

event name/state:
SOURCE_BASELINE_LOCKED

successor completion commit:
verified ancestor of fresh current H0

Event1 commit:
single-parent direct child of H0

changed path:
exact1 new immutable Event1 path

ref update:
true expected-old H0 -> Event1 commit

postfetch:
full and independent
```

After Event1 postverification, every readiness, reservation, terminal,
accepted, Step, all11, manifest, and Event2 object must exact-match the same
candidate, Event1 identity, successor source closure, and complete
reservation/disposition lineage.

## 6.5 Candidate burn and Event1 uncertainty

Once candidate/Event1 bytes are frozen for publication:

- publication success and full postverification make the ID operative;
- an unknown ref result permits reconciliation of those same exact bytes and
  commit only;
- no timestamp shift, rebuild, rebase, or ID reuse is allowed;
- proven absence under a separate authority retires that unpublished ID and
  requires a new ID for new bytes; and
- conflicting or unfetchable evidence remains STOP.

# 7. Frozen future production-owner change surface

S1 freezes one minimal production implementation surface of exact10 paths.

## 7.1 New exact3 production paths

```text
ai/services/ai_inference/emlis_ai_recovery_epoch002_accepted_test_run_receipt_v3.py
ai/services/ai_inference/emlis_ai_recovery_epoch002_step_completion_receipt_v3.py
ai/tools/emlis_nls_v3_recovery_epoch002_all11_receipt_issue.py
```

No Epoch002 issuance-registry copy is added. The immutable Epoch001
requirement registry is reused only as the declarative exact134/Step
requirement definition; no Epoch001 result or completion credit is reused.

## 7.2 Modified existing exact7 production paths

```text
ai/services/ai_inference/emlis_ai_recovery_epoch002_canonical_current_closure_v3.py
ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py
ai/tools/emlis_nls_v3_recovery_epoch002_formal_worker_evidence_v3.py
ai/tools/emlis_nls_v3_recovery_epoch002_current_step_proof_run.py
ai/tools/emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py
ai/tools/emlis_nls_v3_recovery_epoch002_atomic_publication_bundle_v3.py
ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py
```

The existing preflight owner and dependency lock remain source-byte
immutable in S2:

```text
ai/tools/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_preflight.py
ai/configs/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_lock_v1.json
```

They remain part of the successor exact12 distinct owner paths through their
fresh source/blob/raw identities and bootstrap-v2 binding.

## 7.3 Existing exact11 independent-negative evidence adapters

S2 may modify only the following existing exact11 formal test files to emit
their actually observed closed code through the runner-owned strict evidence
fixture:

```text
ai/tests/test_emlis_nls_v3_recovery_epoch001_step00_independent_negative.py
ai/tests/test_emlis_nls_v3_recovery_epoch001_step01_independent_negative.py
ai/tests/test_emlis_nls_v3_recovery_epoch001_step02_independent_negative.py
ai/tests/test_emlis_nls_v3_recovery_epoch001_step03_independent_negative.py
ai/tests/test_emlis_nls_v3_recovery_epoch001_step04_independent_negative.py
ai/tests/test_emlis_nls_v3_recovery_epoch001_step05_independent_negative.py
ai/tests/test_emlis_nls_v3_recovery_epoch001_step06_independent_negative.py
ai/tests/test_emlis_nls_v3_recovery_epoch001_step07_independent_negative.py
ai/tests/test_emlis_nls_v3_recovery_epoch001_step08_independent_negative.py
ai/tests/test_emlis_nls_v3_recovery_epoch001_step09_independent_negative.py
ai/tests/test_emlis_nls_v3_recovery_epoch001_step10_independent_negative.py
```

The modification is evidence instrumentation only. Product behavior,
case-specific expectations, formal node IDs, and exact134 membership may not
change under S2.

## 7.4 Exact15 roles / exact12 paths

Historical D1 froze exact12 owner roles over exact9 distinct paths. The
successor bootstrap-v2 manifest retains those exact12 roles and paths and
adds exactly:

| additive role | new owner path |
|---|---|
| `accepted_test_run_receipt_owner` | `ai/services/ai_inference/emlis_ai_recovery_epoch002_accepted_test_run_receipt_v3.py` |
| `current_step_completion_receipt_owner` | `ai/services/ai_inference/emlis_ai_recovery_epoch002_step_completion_receipt_v3.py` |
| `all11_receipt_owner` | `ai/tools/emlis_nls_v3_recovery_epoch002_all11_receipt_issue.py` |

Thus the combined successor graph is exact15 roles over exact12 distinct
paths. No duplicate success publisher, verifier, issuance registry, or
sequence owner is created.

The exact role-to-path map is:

| role | path |
|---|---|
| `sequence_lineage_owner` | `ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py` |
| `bootstrap_closure_owner` | `ai/services/ai_inference/emlis_ai_recovery_epoch002_canonical_current_closure_v3.py` |
| `publication_owner` | `ai/tools/emlis_nls_v3_recovery_epoch002_atomic_publication_bundle_v3.py` |
| `readiness_owner` | `ai/tools/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_preflight.py` |
| `preflight_owner` | `ai/tools/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_preflight.py` |
| `formal_worker_owner` | `ai/tools/emlis_nls_v3_recovery_epoch002_current_step_proof_run.py` |
| `checkpoint_owner` | `ai/tools/emlis_nls_v3_recovery_epoch002_formal_worker_evidence_v3.py` |
| `terminal_result_owner` | `ai/tools/emlis_nls_v3_recovery_epoch002_formal_worker_evidence_v3.py` |
| `formal_parent_owner` | `ai/tools/emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py` |
| `independent_verifier` | `ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py` |
| `canonical_current_closure_owner` | `ai/services/ai_inference/emlis_ai_recovery_epoch002_canonical_current_closure_v3.py` |
| `reproducible_dependency_lock` | `ai/configs/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_lock_v1.json` |
| `accepted_test_run_receipt_owner` | `ai/services/ai_inference/emlis_ai_recovery_epoch002_accepted_test_run_receipt_v3.py` |
| `current_step_completion_receipt_owner` | `ai/services/ai_inference/emlis_ai_recovery_epoch002_step_completion_receipt_v3.py` |
| `all11_receipt_owner` | `ai/tools/emlis_nls_v3_recovery_epoch002_all11_receipt_issue.py` |

## 7.5 Owner responsibilities

| owner path/class | responsibility |
|---|---|
| accepted receipt owner | validate one independently postverified successful terminal and complete success lineage |
| Step receipt owner | derive exact11 current-only receipts in order from actual terminal outcomes |
| all11 issuer | validate ordered exact11, derive all11, and provide core material |
| sequence ledger | successor closure/receipt identities, operational-admission strict schema/builder, candidate v2, generic Event1/Event2 v2, success lineage |
| worker evidence owner | checkpoint/terminal v2 strict schemas and write-once persistence |
| exact134 runner | capture exact134 ordered per-node actual evidence before terminal persistence |
| formal parent | exact phase order, tagged disposition, one external port call per explicit phase request, failure/unknown closure |
| existing atomic publisher | existing exact1 roles plus successor/admission/Event1/terminal/disposition exact1 and one-tree/one-commit success exact15 candidates/observations |
| existing independent verifier | successor/admission/Event1/readiness/reservation/terminal/accepted/Step/all11/manifest/Event2/publication independence |
| canonical closure owner | successor closure, bootstrap-v2, and exact15 owner-graph identities |
| unchanged preflight owner | Event1/source/bootstrap/admission parity before reservation |
| unchanged dependency lock | reproducible dependency identity |

The independent verifier must not import owner keysets, owner path lists,
semantic validators, bundle builders, or owner hash-preimage helpers.
Shared use is limited to the canonical byte serializer and declarative
cryptographic primitive.

## 7.6 Success-owner graph canonical object

Schema:

```text
cocolon.emlis.nls_v3.recovery_epoch002.success_owner_graph.v1
```

Strict exact6 top-level keys:

```text
schema_version
owner_role_count
owner_path_count
owner_role_bindings
independent_verifier_constraints
success_owner_graph_sha256
```

Required values are role count exact15, distinct path count exact12, and
`owner_role_bindings` exact15 in lexical role order. Every binding is strict
exact4:

```text
role
path
git_blob_sha1
raw_sha256
```

Role/path pairs exact-match section 7.4; blob/raw identities exact-match the
successor source tree.

`independent_verifier_constraints` is strict exact5:

```text
verifier_path
verifier_git_blob_sha1
verifier_raw_sha256
forbidden_owner_import_count
shared_primitive_allowlist
```

The verifier path/identities match the binding above,
`forbidden_owner_import_count = 0`, and the exact ordered allowlist is:

```text
canonical_json_bytes
artifact_sha256
```

`success_owner_graph_sha256` is the canonical logical hash over the other
exact5 top-level keys. The successor source closure
`success_owner_graph_sha256` must exact-match this object.

# 8. Terminal evidence choice and contract

## 8.1 Frozen choice

This Addendum chooses:

```text
EXPAND_TERMINAL_V2_WITH_EXACT134_ORDERED_PER_NODE_EVIDENCE
```

The alternative of creating Step receipts from a later hand-authored or
post-attempt reconstructed proof object is rejected.

The runner may deterministically materialize source identity and frozen
negative-code bindings from the already locked source closure and issuance
registry while producing the terminal. It must do so before terminal bytes
are durably written.

## 8.2 Terminal v2 schema

Schema:

```text
cocolon.emlis.nls_v3.recovery_epoch002.formal_worker_terminal_result.v2
```

In addition to the v1 bindings, v2 requires:

```text
outcomes
counts
formal_node_outcome_evidence_sha256
formal_exact134_invocation_count
```

The v1 terminal has exact28 top-level keys. V2 retains all exact28 without
renaming and adds the exact4 above, producing exact32.
`formal_worker_result_sha256` remains the terminal self-hash and is the
canonical logical hash over the other exact31 top-level keys.

`outcomes` is exact134 in formal registry order. Every row has the strict
exact8 fields:

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

`evidence_sha256` is the canonical hash over the other exact7 row fields.
Every source path/blob/raw identity is taken from the locked source closure.

For the exact11 registered independent-negative nodes:

```text
expected_closed_code = immutable registry declaration
actual_closed_code = value actually emitted through the runner-owned fixture
```

The runner may not infer `actual_closed_code` from `result == PASSED` or copy
the expected value after the run. A passing independent-negative row
requires an actually observed value equal to the frozen expected value. A
missing or different actual value makes the success predicate false. For the
other exact123 nodes, both closed-code fields are null.

`counts` has strict exact10 integer fields:

```text
collected
executed
passed
failed
errors
skipped
xfailed
xpassed
deselected
collection_errors
```

It is derived from and must be bijectively consistent with collection IDs,
execution IDs, states, outcomes, and the existing terminal
`collection_errors` field. Booleans are invalid integers.

The terminal remains body-free. It contains no stdout, stderr, traceback,
exception text, raw environment, PID, hostname, path secret, raw/candidate
body, prompt, response, or private review data.

## 8.3 Success terminal predicate

A terminal is success only when:

```text
owner issue count == 0
AND independent issue count == 0
AND full checkpoint chain is valid
AND collection exact134 in registry order
AND execution exact134 in registry order
AND outcomes exact134 in registry order
AND every outcome source identity matches the locked source
AND exact11 expected/actual closed codes are actually observed and equal
AND exact123 non-negative closed-code pairs are null
AND every state/result == PASSED
AND collection_errors == 0
AND counts == collected134/executed134/passed134/all other counts0
AND exit_class == EXITED
AND type(exit_code) is int and not bool
AND exit_code == 0
AND signal_number == null
AND timed_out == false
AND formal_exact134_invocation_count == 1
AND source/runtime/bootstrap/Event1/readiness/reservation/candidate parity
AND complete prior reservation/disposition history parity
```

Any missing/extra/duplicate/reordered node, failure, skip, xfail, xpass,
collection error, non-zero exit, signal, timeout, source drift, lineage gap,
or validator disagreement makes success false.

## 8.4 Terminal exact1 publication

The terminal result is always outside success exact15.

A valid success or failure terminal uses an immutable attempt-derived path,
single-parent current-head transaction, exact1 changed path, true expected-old
lease, and full independent postfetch.

Accepted receipt generation is forbidden until the successful terminal's
external publication identity is independently verified.

# 9. Formal parent continuation

## 9.1 Exact phase order

The amended formal parent has exact9 ordered phases:

```text
EVENT1_PUBLISHED_AND_POSTVERIFIED
FORMAL_WORKER_BOOTSTRAP_PREFLIGHT
BOOTSTRAP_READINESS_RECEIPT_PUBLISHED_AND_POSTVERIFIED
FORMAL_RESERVATION_PUBLISHED_AND_POSTVERIFIED
PARENT_SPAWN_INTENT_PERSISTED
FORMAL_EXACT134_ONCE
TERMINAL_RESULT_OR_UNKNOWN_STOP
TERMINAL_DISPOSITION_PUBLISHED_AND_POSTVERIFIED
SUCCESS_EXACT15_PUBLISHED_AND_POSTVERIFIED
```

Exact7 phases are externally executable. `PARENT_SPAWN_INTENT_PERSISTED` and
`TERMINAL_RESULT_OR_UNKNOWN_STOP` are internal durable state transitions,
not extra executable authorities. The last phase is eligible only for a
postverified success terminal.

## 9.2 Exact7 external ports

```text
observe_event1_publication
run_bootstrap_preflight
publish_readiness
publish_reservation
spawn_exact134_once
publish_terminal_disposition
publish_success_exact15
```

The existing exact5 port contracts retain their meaning. The spawn port
durably persists the internal spawn-intent transition before invoking the
child at most once; it is still one externally requested executable phase.
The last exact2 ports are additive.

One explicit phase request calls at most one port and returns with
`automatic_progression=false`. Successful completion of a phase does not
invoke the next phase.

`publish_terminal_disposition` accepts one strict tagged union only:

```text
VALID_TERMINAL_RESULT
ATTEMPT_CONSUMPTION_UNKNOWN_DISPOSITION
```

It never converts an invalid/missing terminal into a synthetic failure
terminal. A durable valid terminal whose publication is pending or unknown
remains the same exact terminal bytes and does not complete the phase.

## 9.3 Success and non-success branches

```text
valid success terminal
-> terminal disposition publish/postverify
-> accepted + Step00..10 + all11 + manifest + Event2 exact15
-> exact15 publish/postverify
-> STEP0_10_PREREQUISITES_PROVED
-> AUTHORITY_STOP

valid failure terminal
-> terminal disposition publish/postverify
-> FORMAL_FAILURE_ATTEMPT_PUBLISHED
-> accepted/Step/all11/manifest/Event2 exact0
-> AUTHORITY_STOP

no valid terminal
-> unknown disposition tagged publication exact1
-> accepted/Step/all11/manifest/Event2 exact0
-> ATTEMPT_CONSUMPTION_UNKNOWN_STOP

durable valid terminal but publication pending/unknown
-> preserve same exact bytes
-> accepted/Step/all11/manifest/Event2 exact0
-> RESULT_DURABLY_PRESENT_TERMINAL_PUBLICATION_PENDING_STOP
```

# 10. Accepted, Step00..10, and all11 owner contract

## 10.1 Frozen schemas

```text
cocolon.emlis.nls_v3.recovery_epoch002.accepted_test_run_receipt.v1
cocolon.emlis.nls_v3.recovery_epoch002.current_step_completion_receipt.v1
cocolon.emlis.nls_v3.recovery_epoch002.all11_completion_chain.v1
cocolon.emlis.nls_v3.recovery_epoch002.all11_atomic_publication_manifest.v1
cocolon.emlis.nls_v3.recovery_epoch002.sequence_event.v2
```

The immutable Epoch001 requirement registry remains the declarative
requirement and exact134-node source. Epoch002 accepted and Step receipts
bind its source identity together with the successor closure; they do not
inherit any Epoch001 outcome or completion.

## 10.2 Accepted receipt

The accepted receipt has strict exact17 top-level keys:

```text
schema_version
logical_cycle_id
recovery_epoch_id
candidate_version_id
formal_worker_terminal_result
formal_worker_result_sha256
terminal_result_artifact
success_lineage
step_view_sha256_by_step
proof_sources
proof_source_closure_sha256
owner_validation_state
independent_verification_state
accepted
body_free
automatic_progression
accepted_test_run_receipt_sha256
```

Required constants are the Epoch002 schema/cycle/epoch, the Event1 candidate,
both validation states `PROVED`, `accepted=true`, `body_free=true`, and
`automatic_progression=false`.

`formal_worker_terminal_result` is the strict successful terminal-v2 exact32
object from section 8. The top-level `formal_worker_result_sha256`
exact-matches the nested terminal's self-hash.
`terminal_result_artifact` is its independently postverified exact10
external identity; its role/schema/logical hash and bytes exact-match the
nested terminal. Its logical artifact hash exact-matches
`formal_worker_result_sha256`; its raw identity is computed from the
canonical exact32 terminal bytes plus one trailing LF.

`success_lineage` uses:

```text
cocolon.emlis.nls_v3.recovery_epoch002.success_lineage.v1
```

and strict exact8 keys:

```text
schema_version
candidate_version_id
source_baseline_event
successful_reservation
prior_reservation_count
prior_reservation_history
prior_reservation_history_sha256
success_lineage_sha256
```

Event1 and the successful reservation are postverified exact10 external
identities. Prior history is ordinal-ordered and each row is strict exact5:

```text
reservation_ordinal
reservation_artifact
attempt_id
disposition_kind
disposition_artifact
```

Reservation/disposition artifacts are exact10 external identities.
`prior_reservation_count` and every reservation ordinal are plain integers,
never booleans. The ordinals are contiguous
`1..prior_reservation_count`;
the successful reservation has ordinal `prior_reservation_count + 1` and is
outside prior history. Count equals list length, and there are no
ordinal/attempt/identity repeats.

`disposition_kind` is exactly one of:

```text
FORMAL_FAILURE_ATTEMPT_PUBLISHED
ATTEMPT_CONSUMPTION_UNKNOWN_STOP_PUBLISHED
```

The former requires disposition artifact role
`FORMAL_WORKER_TERMINAL_RESULT` or `TERMINAL_RESULT`; the latter requires
`ATTEMPT_CONSUMPTION_UNKNOWN_DISPOSITION` or `UNKNOWN_DISPOSITION`.
Reservation roles are `FORMAL_TEST_RUN_RESERVATION` or `RESERVATION`.
Every external identity is strict exact10 and independently postverified.

`prior_reservation_history_sha256` is the canonical logical hash of the
strict single-key object
`{prior_reservation_history: <the exact ordered list>}`.
`success_lineage_sha256` is the canonical logical hash over the other exact7
keys.

`step_view_sha256_by_step` is a strict exact11 map with canonical keys
`"0"` through `"10"` and lowercase SHA-256 values matching the immutable
requirement registry/current successor source. `proof_sources` is a
path-sorted, unique, non-empty list of strict exact3 rows:

```text
path
git_blob_sha1
sha256
```

Every row exact-matches successor source bytes.
`proof_source_closure_sha256` is the canonical logical hash of that exact
list. `accepted_test_run_receipt_sha256` is the canonical logical hash over
the other exact16 top-level keys.

Issuance additionally requires terminal exact134 all-success, counts
exact10 success, invocation exact1, Event1/candidate/source/bootstrap/runtime
parity, complete retry history, owner issue exact0, and independent issue
exact0.

No Epoch001 accepted receipt, Step receipt, candidate, event, reservation, or
run is current evidence.

## 10.3 Step receipts exact11

Each receipt has strict exact20 top-level keys:

```text
schema_version
logical_cycle_id
recovery_epoch_id
candidate_version_id
step_number
lineage
current_binding
actual_owners
strict_contracts
positive_proof
independent_negative_proof
artifact_receipt
parent_binding
completion_condition
stop_conditions
next_authority
verdict
automatic_progression
body_free
receipt_sha256
```

Required constants are the Epoch002 schema/cycle/epoch, one exact Event1
candidate, integer `step_number` in 0..10, `verdict=PROVED`, and
`automatic_progression=false`, and `body_free=true`. Boolean values are not
valid integers.

`lineage` is strict exact5:

```text
kind
historical_disposition
historical_rewrite
historical_as_current
backfill
```

Required values are `kind=current`,
`historical_disposition=IMMUTABLE_NONCURRENT_EVIDENCE`, and all exact3
booleans false.

`current_binding` is strict exact15:

```text
source_commit_sha1
source_tree_sha1
source_baseline_event_identity_sha256
successor_source_closure_sha256
canonical_current_closure_sha256
source_dependency_closure_sha256
proof_source_closure_sha256
requirement_registry_sha256
formal_node_registry_sha256
bootstrap_closure_sha256
formal_node_outcome_evidence_sha256
accepted_test_run_receipt_sha256
step_view_key
step_view_sha256
full_graph_sha256
```

Every value exact-matches the accepted receipt, Event1, successor closure,
terminal, and immutable declarative registry. `step_view_key` is
`step_0` through `step_10` without zero-padding; its hash matches the
accepted step-view map value at key `"0"` through `"10"`.
`full_graph_sha256` preserves the current closure's graph-root meaning and
must exact-match `canonical_current_closure_sha256`; it is not a
current-binding self-hash. The top-level receipt hash covers the complete
binding.

`actual_owners` is a non-empty list of strict exact5 rows:

```text
path
git_blob_sha1
sha256
symbol
role
```

`strict_contracts` is a non-empty list of strict exact6 rows:

```text
contract_id
schema_version
validator_path
validator_blob_sha1
validator_symbol
invariant_ids
```

Both lists exact-match their immutable requirement-registry declaration
order; an implementation may not independently sort or regroup them. All
owner/validator identities match current source. Invariant IDs retain
registry order and are unique, non-empty machine tokens.

`positive_proof` and `independent_negative_proof` both use the terminal
outcome strict exact8:

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

Each object exact-matches its registered terminal row, has
`result=PASSED`, and its evidence hash covers the other exact7 fields. The
positive row has both closed-code fields null. The independent-negative row
has the same non-empty registered machine code in both fields, including the
value actually observed by the runner.

`artifact_receipt` is strict exact9:

```text
schema_version
step_number
required_artifact_schema_version
owner_binding_sha256
strict_contract_binding_sha256
requirement_registry_sha256
accepted_test_run_receipt_sha256
formal_completion_evidence_sha256
body_free
```

Required values include:

```text
schema_version = cocolon.emlis.nls_v3.recovery_epoch002.current_step_artifact_evidence.v1
step_number = receipt step_number
required_artifact_schema_version = immutable registry row value
body_free = true
```

The owner/contract hashes are canonical hashes of their exact
registry-order lists. `formal_completion_evidence_sha256` is the canonical
hash of this strict exact4 preimage:

```text
step_number
formal_node_ids
outcome_evidence_sha256s
accepted_test_run_receipt_sha256
```

The two lists are non-empty, same-length, and exact-match every formal node
for the Step and its terminal outcome evidence hash in immutable registry
order. This prevents the two selected proof rows from being mistaken for
the whole Step's formal evidence.

`parent_binding` is strict exact4:

```text
parent_kind
parent_step_number
source_baseline_event_identity_sha256
parent_receipt_sha256
```

Step00 uses `parent_kind=SOURCE_BASELINE_EVENT_AND_ACCEPTED`,
`parent_step_number=null`, and the accepted receipt hash as parent receipt.
Step01..10 use `parent_kind=PREVIOUS_STEP_RECEIPT`, previous integer Step,
and the immediately preceding receipt hash. All exact11 bind the same Event1
identity.

`completion_condition` is one strict exact4 object:

```text
condition_id
required
satisfied
evidence_sha256
```

Its `condition_id` exact-matches the Step registry declaration,
`required=true`, `satisfied=true`, and `evidence_sha256` exact-matches the
artifact receipt's `formal_completion_evidence_sha256`.

`stop_conditions` is a non-empty registry-order list of strict exact6 rows:

```text
condition_id
proof_scope
proof_node_registry_sha256
accepted_test_run_receipt_sha256
triggered
evidence_sha256
```

`proof_scope` is exactly one of:

```text
GLOBAL_EXACT134
STEP_EXACT_REQUIRED_NODES
```

Every `triggered` value is boolean false. Global conditions bind all
registry-order exact134 nodes; Step conditions bind that Step's
registry-order formal nodes. `proof_node_registry_sha256` is the canonical
hash of strict object `{node_ids: <that ordered list>}`.
`evidence_sha256` is the canonical hash of this strict exact6 preimage:

```text
condition_id
proof_scope
proof_node_registry_sha256
outcome_evidence_sha256s
accepted_test_run_receipt_sha256
triggered
```

The outcome-evidence list exact-matches those proof nodes in the same order.

For Steps00..09, `next_authority` is exactly:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_SUCCESS_CANDIDATE_STEP{NN}_GENERATION_SAME_APPROVED_PHASE
```

where `{NN}` is the next two-digit Step ordinal `01` through `10`. For Step10
it is:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_SUCCESS_EXACT15_PUBLICATION_AND_POSTVERIFY_ONLY
```

These tokens are records inside one later explicit P1 phase; they do not
create a new external port and authorize neither P2 nor automatic execution.
`receipt_sha256` is the canonical logical hash over the other exact19
top-level keys.

All receipts bind the same candidate, Event1, successor source closure,
accepted receipt, terminal outcome-evidence root, and declarative registry.

Historical rename, backfill, manual proof maps, missing chain elements, or
green-total-only completion are forbidden.

## 10.4 all11

The all11 chain has strict exact21 top-level keys:

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

`source_baseline_event` is the postverified Event1 exact10 external identity;
`source_closure` is strict successor exact20. Accepted/Step co-publication
identities are strict exact8 candidate identities from section 11.5.

Required cardinalities are accepted exact1, receipt count exact11, ordered
steps `[0,1,...,10]`, receipts exact11, receipt artifacts exact11, and
receipt hashes exact11. Every list is ordinal/path consistent and exact
equal to the full receipt material.

`required_sequence_event_2` is strict exact5:

```text
event_id
event_name
event_ordinal
state
prior_event_identity_sha256
```

Its name/state are `STEP0_10_PREREQUISITES_PROVED`, ordinal is integer 2,
and prior identity is Event1.

Required values:

```text
next_authority = NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_P2_SEPARATE_APPROVAL_ONLY
publication_state = PUBLISHED_ATOMIC
automatic_progression = false
body_free = true
```

This next-authority value records the STOP boundary; it does not grant P2.
`all11_completion_chain_sha256` is the canonical logical hash over the other
exact20 top-level keys. Missing, extra, duplicate, reordered,
mixed-candidate, mixed-source, mixed-terminal, triggered-STOP, or any
owner/verifier disagreement rejects the chain.

# 11. Atomic success exact15

## 11.1 Exact composition

```text
accepted receipt:
exact1

Step00..10:
exact11

all11 chain:
exact1

atomic manifest:
exact1

Event2:
exact1

TOTAL:
exact15
```

The terminal result is not part of exact15.

## 11.2 Immutable exact15 paths

```text
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_AcceptedTestRunExact134_BodyFree_Receipt_20260726.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_Step00_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260726.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_Step01_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260726.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_Step02_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260726.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_Step03_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260726.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_Step04_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260726.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_Step05_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260726.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_Step06_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260726.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_Step07_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260726.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_Step08_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260726.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_Step09_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260726.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_Step10_CurrentStepCompletion_PROVED_BodyFree_Receipt_20260726.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_All11CompletionChain_BodyFree_Chain_20260726.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_All11AtomicPublication_BodyFree_Manifest_20260726.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_SequenceEvent02_Step0_10PrerequisitesProved_BodyFree_Event_20260726.json
```

## 11.3 Atomic manifest exact15-key contract

The manifest has strict exact15 top-level keys:

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

Required constants:

```text
schema_version = cocolon.emlis.nls_v3.recovery_epoch002.all11_atomic_publication_manifest.v1
logical_cycle_id = NLS_V3_CYCLE_001
recovery_epoch_id = NLS_V3_CYCLE001_RECOVERY_EPOCH_002
core_artifact_count = 13
event_supporting_artifact_count = 14
expected_changed_path_count = 15
ref_update_mode = EXPECTED_OLD_SHA_LEASE_WITH_VERIFIED_DIRECT_CHILD
body_free = true
```

Candidate/Event1 match the other success artifacts. `base_commit_sha1` is
the independently postverified successful terminal commit `T`.
`core_artifacts` is the exact path-sorted candidate-identity list for
accepted exact1, Step exact11, and all11 exact1.
`core_artifact_set_sha256` is the canonical logical hash of that exact list
with no envelope. `event_path` exact-matches the immutable Event2 path.
`atomic_publication_manifest_sha256` is the canonical logical hash over the
other exact14 top-level keys. It does not include the manifest candidate
identity, Event2, or success commit `S`.

## 11.4 Transaction

Let `T` be the independently postverified successful terminal commit and `S`
the exact15 success commit.

Initial success publication requires:

```text
fresh success base == T
all exact15 paths absent at T
one base tree + exact15 blobs -> one target tree
S parent exact1 == T
one server-side expected-old T -> S ref compare-and-swap
all exact15 paths become reachable together
full postfetch proves head S, parent T, target tree, exact15 changed paths,
all bytes/hashes/schemas/lineages, and all unchanged path identities
```

No accepted, Step, all11, manifest, or Event2 artifact receives publication
credit before the complete postfetch closes.

## 11.5 Self-reference

Canonical logical JSON is UTF-8, NFC, sorted-key, compact serialization.

```text
logical SHA-256:
canonical JSON without the artifact's own logical-hash field, no trailing LF

raw SHA-256:
exact published canonical bytes with one trailing LF

Git blob SHA-1:
SHA-1 over Git blob header plus exact raw bytes
```

The co-published candidate identity has strict exact8 keys:

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

It contains no publication commit.

The postfetch external identity has strict exact10 keys: the exact8 above
plus:

```text
publication_commit_sha1
identity_sha256
```

`identity_sha256` is the canonical logical hash over the other exact9 keys.
Candidate and external identities reject renamed, missing, or extra keys.

The manifest binds core exact13:

```text
accepted exact1 + Step exact11 + all11 exact1
```

Event2 binds supporting exact14:

```text
core exact13 + manifest exact1
```

Neither manifest nor Event2 binds itself, `S`, its own Git blob, or its own
raw hash inside its own preimage.

Event2 state is:

```text
event_ordinal = 2
event_name = STEP0_10_PREREQUISITES_PROVED
state = STEP0_10_PREREQUISITES_PROVED
prior_event = published successor Event1 external identity
primary_evidence_artifact = all11 candidate identity
publication.supporting_artifact_count = 14
publication.expected_changed_path_count = 15
publication.base_commit_sha1 = T
```

Event2 uses the same exact23 `sequence_event.v2` schema as Event1 under its
disjoint ordinal-2 branch. It preserves the same P0, candidate, successor
source closure, and bootstrap-v2 identities. Its exact14 supporting
candidate identities are accepted exact1, Step exact11, all11 exact1, and
manifest exact1. Its `publication.transaction_capability` binds the
transaction-fresh Git observation for expected-old `T -> S`; it does not
inherit the older Event1 transaction observation as current proof. Its
`authority.operational_admission` is exact-equal to Event1's admission
identity. No co-published candidate identity contains `S`.

It does not prove P2, Product QA, fresh exact100, Product Read, correction,
B6, or Cycle001 acceptance.

# 12. Git transport and durable-evidence admission

## 12.1 Formal publication capability

Each successor, operational-admission, Event1, readiness, reservation,
terminal, disposition, and exact15 publication requires:

1. authoritative fresh ref SHA;
2. authoritative base tree;
3. exact target-path absence or expected old object identity;
4. semantic ancestor verification;
5. frozen canonical bytes and exact blob identities;
6. one target tree and one single-parent commit;
7. a ref update with server-side expected-old SHA;
8. authoritative fresh head, parent, tree, and recursive-tree reads;
9. exact changed-path proof;
10. complete unchanged-path mode/type/SHA proof; and
11. owner and independent postfetch issue counts exact0.

The currently connected GitHub connector can perform ordinary object and
fast-forward documentation reflection, but its exposed `update_ref` has no
expected-old parameter and its current reads do not independently provide
the complete formal ref/parent/tree proof above.

Therefore:

```text
CURRENT_FORMAL_PUBLICATION_CAPABILITY:
REQUIRED_NOT_PROVED
```

This is not treated as absence of every possible authenticated Git route.
It is a prohibition on claiming formal capability before a future authority
proves one.

An eligible future route may be:

- a connector with expected-old CAS, authoritative get-ref, commit parent /
  tree, and recursive-tree reads;
- an authenticated Cocolon Git materialization using exact
  `--force-with-lease=refs/heads/main:<H>` plus full fetch verification; or
- an equivalent dedicated GitHub App transport.

No Guardian actor or retired Guardian route is introduced or revived.

S2 may publish the successor completion receipt only after the same
transaction-local Git capability is proved for that publication. That proof
does not remain fresh enough to authorize later Event1 automatically.

## 12.2 P1 operational admission receipt

Before candidate bytes are frozen, P1 creates and independently verifies one
body-free operational admission receipt:

```text
cocolon.emlis.nls_v3.recovery_epoch002.p1_operational_admission_receipt.v1
```

Immutable path:

```text
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_P1OperationalAdmission_BodyFree_Receipt_20260726.json
```

Strict exact20 top-level keys:

```text
schema_version
logical_cycle_id
recovery_epoch_id
successor_completion_receipt
successor_source_closure_sha256
repository_full_name
source_ref
authority
challenge_id
scope
transport_capability
durable_store_capability
owner_validation_state
independent_verification_state
issued_at_utc
expires_at_utc
state
automatic_progression
body_free
operational_admission_sha256
```

Required state:

```text
schema_version = cocolon.emlis.nls_v3.recovery_epoch002.p1_operational_admission_receipt.v1
logical_cycle_id = NLS_V3_CYCLE_001
recovery_epoch_id = NLS_V3_CYCLE001_RECOVERY_EPOCH_002
repository_full_name = MassyuRed/Cocolon
source_ref = refs/heads/main
owner_validation_state = PROVED
independent_verification_state = PROVED
state = P1_OPERATIONAL_ADMISSION_PROVED
automatic_progression = false
body_free = true
```

`successor_completion_receipt` is the postverified exact10 external identity
for the section 5 completion receipt, and its receipt
`successor_source_closure_sha256` must exact-match the top-level closure hash.
`challenge_id` is one non-empty lowercase SHA-256 and is distinct from every
Event1, preflight, readiness, reservation, run, and publication challenge.

`issued_at_utc` and `expires_at_utc` are UTC-second strings with
`issued_at_utc < expires_at_utc`. The receipt is fresh only while the
authoritative orchestrator time is in that half-open interval. Both
capability observations must be no later than `issued_at_utc`.

The admission `authority` subobject is strict exact4:

```text
approval_kind
admission_authority_token
publication_authority_token
authority_sha256
```

`approval_kind = EXPLICIT_SEPARATE_APPROVAL`; both tokens are the same
non-empty string. `authority_sha256` is the canonical logical hash over the
other exact3 keys.

The `scope` subobject is strict exact5:

```text
repository_full_name
source_ref
successor_source_closure_sha256
operation_set
scope_sha256
```

The first exact3 values equal the admission top-level values.
`operation_set` is this exact11 ordered unique list:

```text
OPERATIONAL_ADMISSION_PUBLICATION
SOURCE_BASELINE_EVENT1_PUBLICATION
BOOTSTRAP_READINESS_PUBLICATION
FORMAL_RESERVATION_PUBLICATION
PARENT_SPAWN_INTENT_PERSISTENCE
FORMAL_ATTEMPT_WRITE_ONCE_CLAIM
FORMAL_EXACT134_SINGLE_INVOCATION
CHECKPOINT_DURABLE_WRITE
TERMINAL_DURABLE_WRITE_AND_RECOVERY
TERMINAL_DISPOSITION_PUBLICATION
SUCCESS_EXACT15_PUBLICATION
```

`scope_sha256` is the canonical logical hash over the other exact4 keys.

The transport capability strict subobject binds owner/version identity,
authoritative ref read, exact expected-old CAS, commit-parent/tree and
recursive-tree reads, exact changed-path proof, complete unchanged-path
verification, full postfetch, scope, freshness, and challenge.

The durable-store capability strict subobject binds owner/protocol identity,
sealed-store class, write-once and atomic-durability properties, recovery
read capability, scope, freshness, and challenge. Neither subobject exposes
credentials, secret values, or private absolute paths.

`transport_capability` is strict exact14:

```text
schema_version
provider_class
provider_identity_sha256
authoritative_ref_read
expected_old_compare_and_swap
commit_parent_tree_read
recursive_tree_read
exact_changed_path_verification
complete_unchanged_path_verification
full_postfetch_verification
scope_sha256
challenge_id
observed_at_utc
transport_capability_sha256
```

`schema_version` is
`cocolon.emlis.nls_v3.recovery_epoch002.git_transport_capability.v1`;
`provider_class = EXPECTED_OLD_CAS_CAPABLE_GITHUB_TRANSPORT`, and
`provider_identity_sha256` is lowercase SHA-256. The exact7 capability flags
are booleans and all are true. `scope_sha256` and `challenge_id` exact-match
the receipt scope and top-level challenge. `observed_at_utc` is a UTC-second
string. `transport_capability_sha256` is the canonical logical hash over the
other exact13 keys.

`durable_store_capability` is strict exact16:

```text
schema_version
provider_class
provider_identity_sha256
owner_only_permissions
no_symlink_following
same_directory_temporary_write
atomic_write_replace
file_and_directory_fsync
write_once_attempt_claim
session_interruption_survival
exact_terminal_recovery_read
body_free_retention_contract
scope_sha256
challenge_id
observed_at_utc
durable_store_capability_sha256
```

`schema_version` is
`cocolon.emlis.nls_v3.recovery_epoch002.durable_store_capability.v1`;
`provider_class =
OWNER_CONTROLLED_WRITE_ONCE_DURABLE_EVIDENCE_STORE`; provider identity is
lowercase SHA-256. The exact9 capability flags are booleans and all are true.
`scope_sha256` and `challenge_id` exact-match the receipt scope and top-level
challenge. `observed_at_utc` is a UTC-second string.
`durable_store_capability_sha256` is the canonical logical hash over the
other exact15 keys.

`operational_admission_sha256` is the canonical logical hash over the other
exact19 top-level keys. Extra/missing/renamed keys, boolean-as-integer,
non-canonical timestamps, hash mismatch, state mismatch, scope mismatch,
provider mismatch, expired evidence, owner issue, or independent issue
rejects admission.

The sequence-ledger owner validates/builds the canonical receipt, the
existing atomic publisher owns its exact1 transaction, and the existing
independent verifier re-derives schema, capability semantics, bytes, hashes,
graph, changed/unchanged paths, and postfetch state without importing owner
helpers. Capability observations are supplied by the identified transport
and sealed-store providers; provider output is data, not an untracked
implicit side effect.

The receipt is a phase-admission artifact, not a semantic source closure and
not a sequence event. Its postverified external identity is canonical inside
Event1 `authority.operational_admission`; Event1 self-hashes it. Builder
preconditions alone are insufficient. Candidate allocation becomes
operative only through that postverified Event1.

Let `O0` be the fresh Cocolon head immediately before admission publication
and `O1` the frozen admission commit. Publication requires target-path
absence at `O0`, exact1 changed path, `O1` parent exact1 equal to `O0`, one
server-side expected-old `O0 -> O1` update, and full independent postfetch of
head/parent/tree/changed-and-unchanged paths/bytes/hashes with issue counts
exact0. The capability observation inside the receipt is pre-update evidence;
the postfetch external identity closes the actual admission publication.
Candidate allocation is forbidden until that external identity exists.

If the `O0 -> O1` ref result is unknown, only the same frozen `O1` may be
reconciled. Proven `O1` plus full postfetch closes the admission; proven head
`O0` with path absence permits only a separately approved publication-only
attempt of the same bytes when the frozen transport contract permits it.
Conflicting, partial, stale, or unfetchable evidence leaves admission
unproved, candidate/Event1 exact0, and authority STOP.

The admission receipt does not replace transaction-local expected-old and
postfetch proof. Readiness revalidates the completion/admission/source
triple. Reservation additionally binds one run-specific durable-store
allocation identity. Spawn intent, checkpoints, and terminal inherit that
same store allocation. Success exact15 revalidates Git capability immediately
before publication.

## 12.3 Durable evidence capability

Before reservation, the P1 admission must prove a non-transient,
owner-controlled evidence store that supports:

```text
owner-only directory and file modes
no symlink following
same-directory temporary write
file flush and fsync
atomic replace
directory fsync
write-once attempt claim
survival across child/parent failure and session interruption
preservation of exact terminal bytes for publication-only recovery
body-free access and retention rules
```

Transient scratch alone is not a durable store for this purpose.

Public capability evidence contains closed state, hashes, and provider class
only. It does not expose credentials, secrets, or private absolute paths.

At this authority:

```text
CURRENT_DURABLE_EVIDENCE_CAPABILITY:
REQUIRED_NOT_PROVED
```

If Karen cannot establish these capabilities within the later approved
authority, she must stop before operational-admission publication,
candidate, and Event1 and request the smallest specific Mash action then
required. If a previously proved capability drifts after Event1, she must
stop before reservation and close any readiness under its defined
disposition.
No Mash preparation is required for the present read-only Addendum.

## 12.4 Documentation reflection is not inherited capability proof

Successful publication of this Addendum's documentation exact5 proves only
that those documentation bytes were reflected and post-fetched under the
current minimal collaboration rules.

It does not prove the formal expected-old lease, recursive full-tree
verification, durable terminal storage, or exact15 execution route.

# 13. Failure, unknown, and reconciliation

## 13.1 Pre-Event1 successor failure

Failure to close S1, S2, capability admission, successor completion, or
Event1 publication leaves:

```text
source baseline:
UNLOCKED

candidate:
UNALLOCATED or RETIRED_UNPUBLISHED

reservation / attempt / exact134:
0 / 0 / 0
```

No old D2 rewrite and no automatic Epoch003 creation occur. A separate
recovery decision is required.

## 13.2 Readiness and reservation

- failed preflight publishes only its body-free failure closure and creates
  reservation exact0;
- a ready receipt not followed by reservation requires one
  `READY_UNUSED_AUTHORITY_STOP` disposition;
- reservation postverification consumes the authority and attempt before
  spawn;
- reservation publication outcome unknown forbids spawn, ready-unused, and
  new reservation until separate authoritative reconciliation; and
- failure to fetch is not proof of absence.

## 13.3 Terminal

- valid failure terminal: publish exact1, success exact15 remains exact0;
- no valid terminal: publish unknown disposition exact1, never synthesize
  collection, outcomes, counts, success, or ordinary failure;
- durable valid terminal but publication failure: preserve exact bytes and
  permit only separately approved publication-only reconciliation;
- terminal postverification success but later Step evidence insufficiency:
  accepted remains exact0, no new reservation is authorized, and a separate
  recovery decision is required; and
- the same attempt is never rerun.

## 13.4 Success exact15 ref uncertainty

An unknown exact15 ref result is reconciled against the same exact `S`:

- if fresh authoritative evidence proves `S` and exact15 reachable and
  correct, close the same publication;
- if head remains `T` and exact15 paths are absent, a separate
  publication-only authority may retry only the same frozen `S` when the
  frozen transport contract permits it;
- partial, conflicting, or unfetchable evidence remains STOP; and
- rebuild, rebase, timestamp change, new accepted receipt, or automatic retry
  is forbidden.

Unreachable blobs, trees, or commits receive publication credit exact0.

# 14. Next causal RED contract

## 14.1 Exact additive test path

S1 may add exactly one test file:

```text
ai/tests/test_emlis_nls_v3_recovery_epoch002_post_d2_success_owner_graph_and_formal_parent_continuation_red.py
```

The historical Epoch002 D1 test file remains byte-immutable.

```text
ai/tests/test_emlis_nls_v3_recovery_epoch002_retry_lineage_and_formal_worker_bootstrap_reconciliation_red.py
```

The new file freezes exact64 uniquely identified causal cases.

Existing historical D1 denominator:

```text
exact46
```

Future S2 targeted cumulative denominator:

```text
historical exact46 + successor exact64 = exact110
```

S1 protects the historical D1 file, production exact10, and existing exact11
independent-negative tests byte-for-byte, then records the actual current
source RED outcomes. This Addendum neither claims nor executes those
outcomes.

## 14.2 Success-contract test manifest exact8

Schema:

```text
cocolon.emlis.nls_v3.recovery_epoch002.success_contract_test_manifest.v1
```

Strict exact8 top-level keys:

```text
schema_version
historical_node_count
successor_node_count
total_node_count
test_files
test_files_sha256
test_node_ids
success_contract_test_manifest_sha256
```

Required counts are respectively exact46, exact64, and exact110. Each is a
plain integer and a boolean is invalid.
`test_files` is the path-sorted exact2 list consisting only of the immutable
historical D1 causal test and the additive successor causal test. Every row
is strict exact3:

```text
path
git_blob_sha1
raw_sha256
```

Both file identities exact-match the successor source tree.
`test_files_sha256` is the canonical logical hash of that exact list without
an envelope.

`test_node_ids` is one ordered, unique exact110 list. Its first exact46
entries exact-match the byte-immutable historical D1 causal-test collection
order. Its remaining exact64 entries exact-match the successor-test order
shown in sections 14.3 through 14.9:

```text
C01..C10
T01..T10
A01..A08
R01..R10
B01..B12
I01..I06
P01..P08
```

Every successor node ID is mechanically fixed as:

```text
<successor test path>::test_<lowercase case ID>_<lowercase frozen boundary>
```

where the case ID and frozen boundary are the exact table cells below.
There is exactly one concrete, non-parameterized pytest item per successor
case ID. S1 may not rename, merge, split, parameterize, or reorder those
items.

`success_contract_test_manifest_sha256` is the canonical logical hash over
the other exact7 top-level keys. The successor source closure field of the
same name must exact-match this object. A missing, extra, duplicate,
reordered, renamed, or source-mismatched item rejects the manifest.

## 14.3 C01-C10 successor closure

| ID | frozen boundary |
|---|---|
| C01 | `HISTORICAL_D2_IMMUTABLE` |
| C02 | `SUCCESSOR_CLOSURE_EXACT20` |
| C03 | `FINAL_SOURCE_COMMIT_TREE_BOUND` |
| C04 | `D2_CLOSURE_ANCESTOR_BOUND` |
| C05 | `D2_RECEIPT_IDENTITY_BOUND` |
| C06 | `PARENT_ADDENDUM_IDENTITY_BOUND` |
| C07 | `SUCCESS_OWNER_GRAPH_EXACT15_ROLE12_PATH` |
| C08 | `SUCCESS_CONTRACT_TEST_MANIFEST_BOUND` |
| C09 | `COMPLETION_RECEIPT_RED_GREEN_BOUND` |
| C10 | `ALLOCATION_V2_EVENT1_V2_OPERATIONAL_ADMISSION_EXACT20_SUCCESSION_ONLY` |

`C10` explicitly freezes the operational-admission exact20 schema, immutable
path, authority exact4, scope exact5, transport exact14, durable-store
exact16, freshness/scope/challenge, exact1 expected-old/direct-child
publication, independent postfetch, Event authority exact4, publication
exact11, transaction capability exact15, and Event1
`authority.operational_admission` hash binding. It also proves that a
candidate allocation is never operative outside that postverified Event1.

## 14.4 T01-T10 terminal evidence

| ID | frozen boundary |
|---|---|
| T01 | `TERMINAL_V2_EXACT32` |
| T02 | `COLLECTION_EXACT134_REGISTRY_ORDER` |
| T03 | `EXECUTION_EXACT134_REGISTRY_ORDER` |
| T04 | `OUTCOME_ROW_EXACT8` |
| T05 | `PINNED_SOURCE_IDENTITY_PER_NODE` |
| T06 | `EXPECTED_CLOSED_CODE_EXACT11` |
| T07 | `ACTUAL_CLOSED_CODE_OBSERVED_EXACT11` |
| T08 | `COUNTS_EXACT10_STATES_PARITY` |
| T09 | `TERMINAL_SUCCESS_PREDICATE_EXACT` |
| T10 | `TERMINAL_DURABLE_PUBLICATION_POSTVERIFIED` |

## 14.5 A01-A08 accepted receipt

| ID | frozen boundary |
|---|---|
| A01 | `POSTVERIFIED_TERMINAL_REQUIRED` |
| A02 | `TERMINAL_ALL_SUCCESS_ONLY` |
| A03 | `FORMAL_INVOCATION_EXACT1` |
| A04 | `SOURCE_RUNTIME_BOOTSTRAP_PARITY` |
| A05 | `EVENT_READINESS_RESERVATION_PARITY` |
| A06 | `COMPLETE_RETRY_HISTORY_BOUND` |
| A07 | `ACCEPTED_BODY_FREE_SELF_HASH` |
| A08 | `UNCERTAINTY_ACCEPTED_EXACT0` |

## 14.6 R01-R10 Step/all11 receipts

| ID | frozen boundary |
|---|---|
| R01 | `ACCEPTED_RECEIPT_REQUIRED` |
| R02 | `STEP_RECEIPT_EXACT11_ORDERED` |
| R03 | `STEP00_EVENT1_ACCEPTED_BIND` |
| R04 | `STEP01_10_IMMEDIATE_PARENT_CHAIN` |
| R05 | `CURRENT_SOURCE_VIEW_ROOT_BIND` |
| R06 | `ACTUAL_OWNER_STRICT_CONTRACT_BIND` |
| R07 | `POSITIVE_PROOF_OUTCOME_BIND` |
| R08 | `NEGATIVE_PROOF_OBSERVED_CODE_BIND` |
| R09 | `ALL11_ACCEPTED_AND_EXACT11_BIND` |
| R10 | `NO_EPOCH001_CREDIT_BACKFILL_OR_P2` |

## 14.7 B01-B12 success exact15 bundle

| ID | frozen boundary |
|---|---|
| B01 | `SUCCESS_PATHS_EXACT15_ABSENT_AT_T` |
| B02 | `CORE_ARTIFACTS_EXACT13` |
| B03 | `SUPPORTING_ARTIFACTS_EXACT14` |
| B04 | `MANIFEST_CORE_SET_HASH` |
| B05 | `EVENT2_SUPPORT_SET_HASH` |
| B06 | `EVENT2_EVENT1_ANCESTRY` |
| B07 | `EVENT2_TERMINAL_SUCCESS_LINEAGE` |
| B08 | `ONE_TREE_ONE_COMMIT` |
| B09 | `SUCCESS_COMMIT_DIRECT_PARENT_T` |
| B10 | `EXPECTED_OLD_T_LEASE` |
| B11 | `FULL_POSTFETCH_AND_UNCHANGED_PATHS` |
| B12 | `UNKNOWN_RESULT_SAME_S_NO_RETRY_REBASE` |

## 14.8 I01-I06 independent verifier

| ID | frozen boundary |
|---|---|
| I01 | `VERIFIER_OWNER_IMPORT_SPLIT` |
| I02 | `TERMINAL_SCHEMA_INDEPENDENT` |
| I03 | `ACCEPTED_STEP_ALL11_INDEPENDENT` |
| I04 | `EVENT2_EXACT14_15_INDEPENDENT` |
| I05 | `GIT_GRAPH_BYTES_HASHES_INDEPENDENT` |
| I06 | `OWNER_VERIFIER_DISAGREEMENT_STOP` |

## 14.9 P01-P08 formal parent

| ID | frozen boundary |
|---|---|
| P01 | `FORMAL_PARENT_PHASE_ORDER_EXACT9` |
| P02 | `EXECUTABLE_PHASES_EXACT7` |
| P03 | `EXTERNAL_PORTS_EXACT7` |
| P04 | `ONE_PORT_CALL_NO_AUTOPROGRESSION` |
| P05 | `FAILURE_TERMINAL_PUBLICATION_STOP` |
| P06 | `UNKNOWN_DISPOSITION_NO_RERUN` |
| P07 | `SUCCESS_TERMINAL_THEN_EXACT15_ONLY` |
| P08 | `EVENT2_POSTVERIFY_STEP_PROVED_P2_STOP` |

```text
C10 + T10 + A8 + R10 + B12 + I6 + P8 = exact64
```

All production semantic keysets, nested keysets, hash preimages, state
values, type rules, and immutable paths enumerated by this Addendum are
frozen. The separately approved S1 RED-freeze authority chooses only the
concrete mutation encoding and closed issue-code name for each already
frozen C/T/A/R/B/I/P boundary, then freezes the exact64 mutation-oracle map,
protected-entry identities, causal-test bytes, and actual RED result.
Those test-oracle representation choices grant no production-schema choice
and S1 does not implement production owners. If one listed boundary admits
more than one materially different production meaning, S1 must stop and
request an Addendum correction instead of choosing among meanings.

# 15. Facts, inference, unknowns, and Karen opinion

## 15.1 Confirmed facts

- old D2 is a valid published targeted-GREEN result;
- current candidate/Event1 v1 directly bind that old D2 closure;
- success-owner implementation changes source/test/schema/runner/closure
  identities;
- current candidate, Event1, readiness, reservation, attempt, exact134,
  terminal, accepted, Step, all11, manifest, and Event2 counts are zero;
- current formal parent has exact5 ports and stops before terminal
  publication/success exact15;
- current terminal lacks complete per-node Step evidence;
- current connector interface does not by itself prove the future formal
  expected-old/full-tree publication contract;
- current transient scratch does not by itself prove durable terminal
  preservation; and
- no source change or test execution occurred under this authority.

## 15.2 Inference

Because no P1 candidate or one-shot consumption exists, an additive
post-D2 successor is sufficient to preserve Recovery Epoch002 identity. An
immediate Epoch003 invalidation is not presently necessary.

This inference depends on the successor design, RED, implementation, closure,
transport, and durability gates all closing before Event1. If they cannot,
Epoch003 remains the fail-closed alternative.

## 15.3 Unknown and not written

- future successor RED outcomes;
- future successor implementation commit/tree and closure hashes;
- future exact transport route and capability identity;
- future durable evidence provider identity;
- future candidate ID;
- future Event1/readiness/reservation/attempt/terminal identities;
- future exact134 outcome;
- future accepted/Step/all11/manifest/Event2 bytes;
- P2, Product QA, fresh exact100, Product Read, correction, B6, or Cycle001
  acceptance.

None of these are completed by design inference.

## 15.4 Karen opinion

Karen judges the additive successor to be the least destructive truthful
path. Reopening D2 would rewrite history, while binding Event1 to old D2
would knowingly lock a source that lacks its success closure.

Karen chooses terminal-v2 evidence expansion because the one-shot run should
preserve the proof needed for Step issuance before the attempt can be lost.
Later hand-authored reconstruction would be weaker and would make the
accepted receipt depend on facts not durably captured at execution.

Karen also judges transport and durability to be admission capabilities, not
optional operational details. They should stop P1 before irreversible
publication or reservation if unproved. This does not justify reviving
Guardian or requiring Mash to prepare credentials during the present
read-only design authority.

# 16. Authority boundary, result, and next authority

## 16.1 Work performed

```text
mashos-api source/test/config/schema/fixture/sample/lock changes:
0

test / pytest / causal RED / targeted GREEN / exact134:
NOT_RUN / NOT_RUN / NOT_RUN / NOT_RUN / NOT_RUN

candidate / Event1 / readiness / reservation / attempt:
0 / 0 / 0 / 0 / 0

operational admission:
0

terminal / accepted / Step00..10 / all11 / manifest / Event2:
0 / 0 / 0 / 0 / 0 / 0

private body / Product Read:
0 / 0

Guardian use:
0

subagent edit / test / commit / GitHub write:
0 / 0 / 0 / 0
```

Only this body-free Addendum, its receipt, handoff, current-plan append, and
latest-snapshot append are permitted Cocolon changes.

## 16.2 Result

```text
STATUS:
RECOVERY_EPOCH002_POST_D2_SOURCE_BASELINE_ELIGIBILITY_SUCCESSION_PARENT_ADDENDUM_DESIGN_FROZEN_AUTHORITY_STOP

HISTORICAL_D2:
IMMUTABLE_TARGETED_GREEN_RETAINED

OLD D2 -> CANDIDATE -> EVENT1 EDGE:
SUPERSEDED_FOR_FUTURE_ELIGIBILITY_NOT_REWRITTEN

POST_D2 SUCCESSOR:
DESIGNED_NOT_IMPLEMENTED

SOURCE BASELINE:
UNLOCKED

CANDIDATE:
UNALLOCATED_DISTINCT_FROM_NLS_V3_RC_0034

OPERATIONAL_ADMISSION:
NOT_CREATED / NOT_PUBLISHED

EVENT1 / RESERVATION / ATTEMPT / EXACT134:
0 / 0 / 0 / 0

TERMINAL / ACCEPTED / STEP / ALL11 / MANIFEST / EVENT2:
0 / 0 / 0 / 0 / 0 / 0

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

## 16.3 Exactly one next separate-approval candidate

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_POST_D2_SOURCE_BASELINE_ELIGIBILITY_SUCCESSION_ACCEPTED_STEP0_10_ALL11_EVENT2_ATOMIC_SUCCESS_OWNER_GRAPH_AND_FORMAL_PARENT_CONTINUATION_REMEDIATION_RED_FREEZE_ONLY
```

The next authority may create and run only the exact successor causal RED
surface described in section 14, freeze its exact64 concrete mutation /
closed-code oracle representation, and reflect its result. It may not change
the frozen production meaning, implement production owners, allocate a
candidate, publish Event1, create readiness or reservation, invoke exact134,
publish terminal or exact15, start P2, or accept Cycle001.

After a postverified `SUCCESSOR_CAUSAL_RED_FROZEN` exit, but not approved by
this Addendum:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_POST_D2_SOURCE_BASELINE_ELIGIBILITY_SUCCESSION_ACCEPTED_STEP0_10_ALL11_EVENT2_ATOMIC_SUCCESS_OWNER_GRAPH_AND_FORMAL_PARENT_CONTINUATION_IMPLEMENTATION_TARGETED_GREEN_AND_SUCCESSOR_COMPLETION_ONLY
```

After a postverified successor completion, but not approved by this
Addendum, a fresh P1 authority may be proposed.

No downstream authority is active. Separate explicit approval is required at
every STOP.

# 17. Body-free receipt

Receipt path:

```text
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2SourceBaselineEligibilitySuccessorAndSuccessOwnerFormalParentContinuation_ParentAddendum_ReadOnly_BodyFree_Receipt_20260726.json
```

The receipt logical SHA-256 is computed over canonical JSON with its own
`receipt_sha256` field excluded. Publication commit, Git blob SHA-1, and raw
SHA-256 are external postfetch identities and are not self-bound inside the
receipt bytes.
