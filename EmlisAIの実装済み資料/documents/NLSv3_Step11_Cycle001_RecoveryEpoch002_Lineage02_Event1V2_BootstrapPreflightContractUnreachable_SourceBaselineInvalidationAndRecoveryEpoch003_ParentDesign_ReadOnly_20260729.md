---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch003_parent_design
title: "NLS v3 Step 11 Cycle 001 Recovery Epoch 002 invalidation and Recovery Epoch 003 P0 parent design"
revision_date: "2026-07-29"
status: "RECOVERY_EPOCH002_INVALIDATED_RECOVERY_EPOCH003_PARENT_DESIGN_FROZEN_DEFINED_NOT_STARTED_AUTHORITY_STOP"
body_free: true
automatic_progression: false
---

# 0. Decision

Approved authority:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_POST_D2_SUCCESSOR_LINEAGE02_EVENT1_POSTVERIFIED_BOOTSTRAP_PREFLIGHT_CONTRACT_UNREACHABLE_SOURCE_BASELINE_INVALIDATION_AND_RECOVERY_EPOCH003_P0_PARENT_DESIGN_ISSUANCE_INDEPENDENT_VERIFICATION_AND_DESIGN_ONLY
```

This P0 is an append-only administrative recovery-epoch transition. It does
not run or repair production code.

```text
RECOVERY_EPOCH002:
EPOCH_INVALIDATED

RECOVERY_EPOCH002_EVENT1:
PUBLISHED_POSTVERIFIED_IMMUTABLE_HISTORICAL_NOT_REUSABLE

RECOVERY_EPOCH002_CANDIDATE:
nls_v3_rc_epoch002_success_0001
HISTORICAL_NOT_REUSABLE

RECOVERY_EPOCH003:
DEFINED_NOT_STARTED

RECOVERY_EPOCH003_SOURCE_BASELINE:
UNLOCKED

RECOVERY_EPOCH003_CANDIDATE:
UNALLOCATED

RECOVERY_EPOCH003_EVENT1 / READINESS / RESERVATION / ATTEMPT:
NOT_CREATED / NOT_CREATED / NOT_CREATED / NOT_CREATED

CYCLE001:
NOT_ACCEPTED

AUTOMATIC_PROGRESSION:
false

AUTHORITY_STOP
```

The Parent Design and its postverified body-free receipt are the
administrative transition record. They are not Event2, a source closure, a
readiness artifact, a reservation, an attempt, a result, or acceptance
evidence.

# 1. Governing material and fixed entries

## 1.1 Repository entries

```text
Karen-Diary:
700f749f5149cac1f8bd4bab8a364d524a56985b

Cocolon:
1b3dee071cf71c5524cf83f412fb5bc043cefbcf

mashos-api commit:
a70d3c12be235381b4c63fd2f54b5319c1fd1931

mashos-api tree recorded by Event1 and governing design:
ccddcf1901d2ea3cecddddc037c9c455e35cb36d
```

The Event1 bytes, raw hash, and logical hash were independently recomputed.
The tree value above was cross-checked between the Event1 and governing
records; this P0 does not claim an independent tree-object traversal.

## 1.2 Supplied current-working documents

The three supplied files exact-match the governing recorded SHA-256 values.
They are navigation and design inputs, not replacements for current GitHub
authority.

```text
Cocolon_EmlisAI_ModelFreeNaturalLanguageSurfaceV3_DetailedDesign_
ImplementationOrder_20260714_Revised_Cycle(29).md:
6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc

Cocolon_EmlisAI_longterm_roadmap_
20260608_P7P8_question_need_observation_20260619(42).md:
04fb9e4e11af2b1530d03d95d8e959ba644503722f72094a289bde1d4368ce5b

NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723(25).md:
31682e71ac047ac5f2f329d62ebc51b471bdcb00430a6ab35bcfb934c1438ca7
```

The current tracked plan is the GitHub path:

```text
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md
```

Its entry blob is:

```text
ca1aabf8421f3f79d5319cc7bae5f56f94746424
```

## 1.3 Governing reconciliation record

The following postverified exact10 external identity is bound as the
governing disposition decision:

```json
{"artifact_role":"BOOTSTRAP_SOURCE_RUNTIME_BASELINE_DISPOSITION_CONTRACT_RECONCILIATION_DESIGN_FROZEN_RECEIPT","body_free":true,"git_blob_sha1":"9e943c3de9ab38088511cafc4386e35cbb4aa977","identity_sha256":"70d81a5bf53cc4e4406be4488c641ac1e1fc7f48e063a8bcbbbb20e7efe0333a","logical_artifact_sha256":"9f45578357420d79700439319fc410bb2d490fbb4be2c1de515cfb3f9cc52060","path":"EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_Lineage02_Event1V2_BootstrapPreflightUnreachable_BootstrapSourceClosureRuntimeIdentityBaselineDisposition_ContractReconciliation_Design_ReadOnly_BodyFree_Receipt_20260728.json","publication_commit_sha1":"132662a72aa3f97bea63f405fdb1ca3b5a7fc047","raw_sha256":"15e732e7f10ee3af3df021d17dc45567207cc8fddaa46efda0894d8c1ac7c4cc","repository_full_name":"MassyuRed/Cocolon","schema_version":"cocolon.emlis.nls_v3.recovery_epoch002.bootstrap_source_runtime_baseline_disposition_contract_reconciliation_design_frozen_receipt.v1"}
```

Its selected disposition requires:

```text
failure receipt postverification
-> Epoch002 invalidation before source repair
-> Recovery Epoch003 P0
```

The failure receipt postverification prerequisite is complete at the
Cocolon entry in section 1.1.

# 2. Confirmed facts

## 2.1 Immutable Event1

```text
path:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_SequenceEvent01_
SourceBaselineLocked_BodyFree_Event_20260726.json

publication commit:
c0fea517d63d71651fa32ddf541767b64d8f8540

Git blob:
e41089d2df5f34c0db7a65f10edcf29a9582d98c

raw SHA-256:
1d6b4223cf7ff8e6e9e40abbfbac641ca16fe6a00770cff09a10e1fd4e9e7b4e

logical Event SHA-256:
75f96a270fc4b1b44cf696615b814ca91ad26752d3bac90d03cb05e9f04b9391

historical postverified external identity SHA-256:
dcb1d29ec5e0546b096111a8f84f6521b7862bc610e30f408cf0c56a29610682

candidate:
nls_v3_rc_epoch002_success_0001

source closure SHA-256:
e6d27de726f71e4f757c597862f4adcb68d2587a9ddaf619cf1dff53d06edf88

bootstrap closure SHA-256:
75e9ca12c84c2f17d5c6f1cb0609a83a7413851dea4612b82b28ccd44c8383fe
```

The historical external identity is referenced as an already postverified
identity. This P0 does not claim that its exact external-identity preimage
was independently reconstructed during this authority.

## 2.2 Corrected failure receipt

```text
path:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_Lineage02_Event1V2_
BootstrapPreflightContractUnreachable_Failure_BodyFree_Receipt_20260728.json

publication commit:
cbfb9e1e939b4d1dde7b4c1df4a59d9d7320e7ab

Git blob:
11dd115e9dffc5117f8a022000bd1d36866b1959

raw SHA-256:
96b56a3685230174e6b9a08b6c2067cf09eed09557f8fa544eecff75876067b0

logical receipt SHA-256:
d7606768178abf9cad8bb3cf17b95a586654d91fb51bfc38d395669846097c27

corrected exact10 external identity SHA-256:
c38516c355aa450aecce332b7ad50d3db9daad13ce6f27ebdd942dc0f239a856

failure class:
BOOTSTRAP_SOURCE_RUNTIME_CONTRACT_UNREACHABLE

stop code:
PRE_RESERVATION_FORMAL_WORKER_BOOTSTRAP_STOP

semantic state:
VALID_WITH_CHALLENGE_PROVENANCE_QUALIFICATION
```

The exact30 receipt, diagnostics exact4, raw hash, logical hash, and corrected
exact10 identity were independently recomputed with issue exact0.
The corrected role is a documentation/postfetch identity frozen by the
correction authority. It is not claimed to be accepted by the current
production publication-role allowlist.

## 2.3 Challenge provenance

```text
5d58979338cbc30ce603df884d466981895e05198196925e209424a129c4b0f9:
DESIGN_DECLARED_PREFLIGHT_CHALLENGE_ID_WITH_UNPROVED_EXECUTION_PROVENANCE

6c315203ce98f635feb80b04f27ab7dcb43545f2883b8a6fcca36c8c1cb7acf4:
CURRENT_SCRATCH_SCRIPT_EXACT4_PREIMAGE_RECOMPUTED_PREFLIGHT_CHALLENGE_ID

actual executed challenge:
UNRESOLVED_NOT_REPLACEABLE_BY_INFERENCE

execution provenance:
UNRESOLVED_CURRENT_SCRIPT_RECOMPUTATION_MISMATCH

affects failure class:
false

affects downstream execution-identity claims:
true
```

Neither candidate challenge is promoted to an execution fact. Recovery
Epoch003 inherits no active challenge identity from Recovery Epoch002.

## 2.4 Current source contradiction

The current Event1 binds successor source closure exact20 and bootstrap
manifest v2. The current preflight path calls historical validators that
strictly reject that pair as `READINESS_FORBIDDEN` and
`SOURCE_CLOSURE_INVALID`.

The Event1 bootstrap also contains frozen fixture values:

```text
python executable SHA-256:
3333333333333333333333333333333333333333333333333333333333333333

python build SHA-256:
4444444444444444444444444444444444444444444444444444444444444444

inherited PATH SHA-256:
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

The operational preflight later probes a materialized runtime and requires
its observed identity to equal the Event1 identity. It also requires
post-Event1 materialization and attempt-registry facts inside the same
immutable bootstrap object. Current source therefore cannot reach readiness
under the locked Event1.

## 2.5 Zero-effect execution boundary

At this P0 entry:

```text
runtime materialization:
0

readiness / attestation:
0 / 0

reservation / attempt:
0 / 0

formal exact134 invocation:
0

mashos-api write:
0

test execution:
0
```

# 3. Recovery Epoch002 invalidation contract

## 3.1 Reason codes

Strict sorted exact3:

```text
BOOTSTRAP_SOURCE_RUNTIME_CONTRACT_UNREACHABLE
SAME_EPOCH_REPAIR_FORBIDDEN_BY_ONE_EVENT1_PER_EPOCH
SOURCE_BASELINE_LOCKED_PREFLIGHT_CONTRACT_UNREACHABLE
```

Challenge-provenance uncertainty is not an invalidation reason and does not
replace the confirmed failure class. It is an explicit non-inheritance
qualification.

## 3.2 Append-only disposition

```text
Recovery Epoch002:
EPOCH_INVALIDATED

source repair in this authority:
NOT_EXECUTED

source drift claimed:
false

history rewrite or deletion:
FORBIDDEN
```

The following remain immutable historical evidence:

- operational admission and candidate allocation;
- Event1 publication and postverification;
- source/bootstrap closures frozen by Event1;
- failed preflight request and formal-parent phase result;
- immutable failure receipt and its corrected external identity;
- correction Design, receipt, handoff, and postverification append.

The following are not created and require no later backfill:

- ready-unused disposition;
- readiness artifact or attestation;
- reservation;
- attempt or attempt-consumption disposition;
- terminal result;
- accepted-run, Step00..10, all11, Event2, or Cycle acceptance disposition.

The current candidate and Event1 cease to be eligible as an active baseline.
They remain true history and are never renamed, rewritten, reissued,
reinterpreted, deleted, or used for a second Event1.

# 4. Recovery Epoch003 P0 definition

## 4.1 Fixed identity and state

```text
logical cycle:
NLS_V3_CYCLE_001

recovery epoch:
NLS_V3_CYCLE001_RECOVERY_EPOCH_003

state:
DEFINED_NOT_STARTED

source baseline:
UNLOCKED

candidate:
UNALLOCATED_DISTINCT_FROM_nls_v3_rc_epoch002_success_0001

Event1 / readiness / attestation / reservation / attempt:
NOT_CREATED / NOT_CREATED / NOT_CREATED / NOT_CREATED / NOT_CREATED

D1 / D2 / final closure / admission:
NOT_STARTED / NOT_STARTED / NOT_CREATED / NOT_CREATED

formal exact134 / Product Read / Cycle acceptance:
0 / NOT_STARTED / NOT_ACCEPTED
```

## 4.2 P0 anchor pair

The P0 anchor has exactly two members:

1. this Parent Design; and
2. its postverified body-free receipt.

The handoff, tracked-plan append, and latest-snapshot append are reflection
records, not additional P0 anchor members.

After both members are published and postverified, the P0 external identity
uses strict exact6:

```text
schema_version
logical_cycle_id
recovery_epoch_id
parent_design
receipt
p0_external_identity_sha256
```

Schema:

```text
cocolon.emlis.nls_v3.step11.cycle001.recovery_epoch003.p0_external_identity.v1
```

`parent_design` is strict exact4:

```text
path
publication_commit_sha1
git_blob_sha1
raw_sha256
```

`receipt` is strict exact5:

```text
path
publication_commit_sha1
git_blob_sha1
raw_sha256
logical_receipt_sha256
```

`p0_external_identity_sha256` is SHA-256 over the canonical sorted JSON
exact5 preimage without that field and without a trailing LF.

# 5. Epoch003 expected-versus-observed contract

## 5.1 Separation rule

The pre-Event1 reference materialization supplies expected runtime facts.
The post-Event1 operational materialization supplies observed runtime facts.
They are separate body-free artifacts.

The reference and operational runtime roots must be distinct. Their absolute
paths are not stored. Their opaque root identities may be stored.

Required parity:

```text
observed Python runtime identity
==
Event1 expected Python runtime identity

observed pytest distribution identity
==
Event1 expected pytest distribution identity

observed installed-distribution / RECORD closure
==
Event1 expected installed-distribution / RECORD closure

observed dependency lock and wheel bundle
==
Event1 dependency lock and wheel bundle

observed source commit/tree and owner/test/import/plugin/argv/env policy
==
Event1 source/bootstrap baseline

operational runtime-root identity
!=
reference runtime-root identity
```

Runtime-root and attempt-registry-root identities are readiness-side facts.
They have no equality target nested in Event1.

## 5.2 Event1 allowed and forbidden content

The future Event1 may bind:

- final source commit/tree and clean state;
- source/proof/registry/formal-node roots;
- owner path/blob/raw identities;
- formal exact134 node IDs and formal-test manifest;
- first-party, stdlib, and locked third-party import classifications;
- dependency lock, wheel bundle, installed-distribution, and RECORD
  identities;
- plugin policy and loaded-plugin manifest;
- preflight and formal-worker argv;
- fixed/removed/inherited-PATH environment policy;
- expected runtime identities observed by the pre-Event1 reference
  materialization; and
- the full postverified external identity of that reference observation.

The future Event1 must not contain:

- runtime-root or attempt-registry-root absolute paths;
- post-Event1 materialization, readiness, attestation, reservation, attempt,
  or result facts;
- mutable collection or execution state;
- a placeholder executable/build/PATH hash; or
- an expected runtime identity without its bound reference observation.

# 6. P0-frozen Epoch003 artifact contracts

This section freezes schema names, exact locations, strict top-level keysets,
and responsible owners. It does not create any artifact. There are seven
artifact contracts and five standalone document paths. The bootstrap and
source closures are nested at `/bootstrap_closure` and `/source_closure`
inside the exact Event1 path in section 6.4; they have no standalone
document path.

## 6.0 Common nested contracts and canonicalization

All objects use UTF-8 canonical sorted compact JSON without a trailing LF
for logical hashes. An object's self-hash is computed over the same object
with only its own self-hash key removed. Array order is normative. Sets
described as sorted must be strictly sorted and duplicate-free.

The publication-derived external identity is strict exact10:

```text
artifact_role
body_free
git_blob_sha1
identity_sha256
logical_artifact_sha256
path
publication_commit_sha1
raw_sha256
repository_full_name
schema_version
```

`identity_sha256` is the canonical hash over the other exact9 keys.

Python runtime identity is strict exact4:

```text
executable_sha256
implementation
version
build_sha256
```

An installed-distribution row is strict exact4:

```text
normalized_distribution_name
distribution_version
wheel_sha256
installed_record_closure_sha256
```

Installed-distribution rows are sorted by
`normalized_distribution_name`, contain no duplicate name, and
`installed_distributions_sha256` is the canonical hash of that exact array.
The pytest identity is one exact4 row equal to the `pytest` row in that
array.

Dependency-lock identity is strict exact3:

```text
identity_class
path
raw_sha256
```

Wheel-bundle rows are strict exact3:

```text
wheel_filename
wheel_sha256
wheel_record_sha256
```

They are sorted by `wheel_filename`; `wheel_bundle_manifest_sha256` is the
canonical hash of the exact array.

Runtime materialization is strict exact10:

```text
schema_version
runtime_root_identity_sha256
python_executable_relative_path
installed_directory_relative_path
dependency_lock_raw_sha256
wheel_bundle_manifest_sha256
distribution_count
runtime_materialization_state
body_free
runtime_materialization_sha256
```

The relative paths must remain under the opaque runtime root and contain no
absolute path or traversal. `runtime_materialization_sha256` is the
canonical hash over the other exact9 keys.

Environment policy is strict exact5:

```text
fixed
removed
inherited_path_sha256
lang
lc_all
```

`fixed` is strict exact2:

```text
PYTEST_DISABLE_PLUGIN_AUTOLOAD
PYTHONDONTWRITEBYTECODE
```

Both values are `"1"`. `removed` is the strict sorted exact3 array:

```text
PYTEST_ADDOPTS
PYTEST_PLUGINS
PYTHONPATH
```

An owner-artifact row is strict exact4:

```text
role
path
git_blob_sha1
raw_sha256
```

A formal-test-manifest row is strict exact3:

```text
path
git_blob_sha1
raw_sha256
```

An import-manifest row is strict exact4:

```text
import_name
classification
owner_paths
target_identity
```

`classification` is exactly one of:

```text
FIRST_PARTY
STDLIB_BOUND_TO_PYTHON_RUNTIME
THIRD_PARTY_BOUND_TO_LOCKED_DISTRIBUTION
```

FIRST_PARTY target identity is strict exact3
`path / git_blob_sha1 / raw_sha256`. STDLIB target identity is strict exact2
`module_name / python_runtime_identity_sha256`. THIRD_PARTY target identity
is strict exact5:

```text
module_name
normalized_distribution_name
distribution_version
wheel_sha256
installed_record_closure_sha256
```

Owner rows, test rows, import rows, node IDs, plugin rows, and argv arrays
have one canonical order fixed by D1 fixtures and reproduced independently.
The corresponding `*_sha256` field hashes the exact array, never a caller
supplied digest without the array.

The operational expected/observed projection is strict exact14:

```text
source_commit_sha1
source_tree_sha1
formal_owner_artifacts_sha256
formal_test_manifest_sha256
import_manifest_sha256
dependency_lock_raw_sha256
wheel_bundle_manifest_sha256
installed_distributions_sha256
pytest_distribution_identity
python_runtime_identity
loaded_plugin_manifest_sha256
preflight_argv_sha256
formal_worker_argv_sha256
environment_policy_sha256
```

The owner and independent verifier each derive this exact14 object from
source/runtime observations without accepting the other's projection.
Their canonical hashes must agree before readiness. The expected projection
is derived from Event1; the observed projection is derived from the
post-Event1 operational observation.

## 6.1 Pre-Event1 reference runtime observation

```text
path:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch003_
PreEvent1_ReferenceRuntimeObservation_BodyFree_Receipt.json

schema:
cocolon.emlis.nls_v3.recovery_epoch003.reference_runtime_observation.v1

owner:
ai/tools/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_preflight.py
```

Strict exact21 top-level keyset:

```text
schema_version
logical_cycle_id
recovery_epoch_id
authority_token
source_commit_sha1
source_tree_sha1
dependency_lock_identity
wheel_bundle_manifest_sha256
runtime_materialization
python_runtime_identity
pytest_distribution_identity
installed_distributions
installed_distributions_sha256
environment_policy
environment_policy_sha256
reservation_count_delta
formal_exact134_invocation_count
collection_state
test_execution_state
body_free
reference_runtime_observation_sha256
```

The artifact contains no absolute runtime-root path and no private body.
Its publication-derived exact10 external identity is bound by the future
source/bootstrap closure and Event1.

## 6.2 Epoch003 bootstrap closure

```text
schema:
cocolon.emlis.nls_v3.recovery_epoch003.formal_worker_bootstrap_manifest.v1

owner:
ai/services/ai_inference/
emlis_ai_recovery_epoch002_canonical_current_closure_v3.py
```

Strict exact33 top-level keyset:

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
wheel_bundle_manifest_sha256
expected_installed_distributions
expected_installed_distributions_sha256
expected_python_runtime_identity
expected_pytest_distribution_identity
reference_runtime_observation_external_identity
environment_policy
environment_policy_sha256
preflight_argv
preflight_argv_sha256
formal_worker_argv
formal_worker_argv_sha256
unclassified_import_count
unresolved_dynamic_import_count
body_free
bootstrap_closure_sha256
```

The external identity nested in
`reference_runtime_observation_external_identity` is strict exact10.
The environment policy does not contain materialization or attempt-registry
facts.

## 6.3 Epoch003 source closure

```text
schema:
cocolon.emlis.nls_v3.recovery_epoch003.
source_baseline_eligibility_closure.v1

owner:
ai/services/ai_inference/
emlis_ai_recovery_epoch002_canonical_current_closure_v3.py
```

Strict exact20 top-level keyset:

```text
schema_version
repository_full_name
source_ref
source_commit_sha1
source_tree_sha1
worktree_clean
detailed_design_sha256
epoch003_p0_external_identity_sha256
epoch002_predecessor_set_sha256
d1_red_receipt_external_identity_sha256
d2_green_receipt_external_identity_sha256
source_dependency_closure_sha256
canonical_current_closure_sha256
requirement_registry_sha256
formal_node_registry_sha256
proof_source_closure_sha256
formal_test_manifest_sha256
bootstrap_closure_sha256
reference_runtime_observation_external_identity_sha256
source_closure_sha256
```

This closure is new-epoch eligibility. It does not reinterpret the
historical Epoch002 successor closure.

## 6.4 Epoch003 Event1

```text
path:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch003_
SequenceEvent01_SourceBaselineLocked_BodyFree_Event.json

schema:
cocolon.emlis.nls_v3.recovery_epoch003.sequence_event.v1

owner:
ai/services/ai_inference/
emlis_ai_recovery_epoch002_sequence_ledger_v3.py
```

Strict exact23 top-level keyset:

```text
schema_version
ledger_id
event_id
logical_cycle_id
recovery_epoch_id
candidate_version_id
event_ordinal
event_name
state
prior_event
challenge_id
timestamp_utc
timestamp_kind
authority
p0_external_identity
candidate_allocation
source_closure
bootstrap_closure
primary_evidence_artifact
publication
body_free
automatic_progression
event_sha256
```

The nested role separation remains explicit. Event1 may bind the full
reference observation external identity through bootstrap/source closure,
but no post-Event1 operational observation.

Event1 nested contracts are:

```text
authority:
strict exact4
approval_kind
operational_admission
publication_authority_token
transition_authority_token

operational_admission:
strict exact10 external identity from section 6.0

p0_external_identity:
strict exact6 from section 4.2

prior_event:
the same strict exact6 P0 external identity

candidate_allocation:
strict exact9
schema_version
logical_cycle_id
recovery_epoch_id
candidate_version_id
allocated_at_utc
p0_external_identity_sha256
source_closure_sha256
reference_runtime_observation_external_identity_sha256
candidate_allocation_sha256

primary_evidence_artifact:
strict exact10 external identity

publication:
strict exact9
base_commit_sha1
branch
event_path
expected_changed_path_count
publication_state
repository_full_name
supporting_artifact_count
supporting_artifact_set_sha256
supporting_artifacts

publication supporting artifact row:
strict exact10 external identity
```

`publication.supporting_artifacts` is sorted by
`artifact_role / path / identity_sha256`; its exact count and canonical array
hash must equal the adjacent fields. `event_sha256` is the canonical hash of
the exact22 remaining top-level keys. `source_closure` and
`bootstrap_closure` are the strict embedded objects from sections 6.3 and
6.2.

## 6.5 Post-Event1 operational runtime observation

```text
path:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch003_
PostEvent1_OperationalRuntimeObservation_BodyFree_Receipt.json

schema:
cocolon.emlis.nls_v3.recovery_epoch003.operational_runtime_observation.v1

owner:
ai/tools/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_preflight.py
```

Strict exact41 top-level keyset:

```text
schema_version
logical_cycle_id
recovery_epoch_id
candidate_version_id
authority_token
preflight_challenge_id
preflight_id
source_baseline_event_external_identity_sha256
source_closure_sha256
bootstrap_closure_sha256
source_commit_sha1
source_tree_sha1
worktree_clean
formal_owner_artifacts_sha256
formal_test_manifest_sha256
import_manifest_sha256
dependency_lock_raw_sha256
wheel_bundle_manifest_sha256
installed_distributions_sha256
pytest_distribution_identity
python_runtime_identity
loaded_plugin_manifest_sha256
preflight_argv_sha256
formal_worker_argv_sha256
environment_policy
environment_policy_sha256
runtime_materialization
runtime_root_identity_sha256
reference_runtime_root_identity_sha256
attempt_registry_root_identity_sha256
owner_operational_projection_sha256
independent_operational_projection_sha256
owner_validation_state
independent_verification_state
reservation_count_delta
formal_exact134_invocation_count
collection_state
test_execution_state
pytest_main_called
body_free
operational_runtime_observation_sha256
```

It is not Event1, a source closure, a reservation, an attempt, or a result.
Its publication external-identity role is exactly one of:

```text
RECOVERY_EPOCH003_OPERATIONAL_RUNTIME_OBSERVATION
RECOVERY_EPOCH003_OPERATIONAL_RUNTIME_OBSERVATION_FAILURE_EVIDENCE
```

The success role requires equal owner/independent exact14 projection hashes
and all parity predicates. The failure-evidence role is allowed only for the
two post-observation failure classes in section 6.6 and never grants
readiness.

## 6.6 Readiness and failure receipts

Readiness:

```text
path:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch003_
PostEvent1_BootstrapReadiness_BodyFree_Receipt.json

schema:
cocolon.emlis.nls_v3.recovery_epoch003.bootstrap_readiness_receipt.v1
```

Strict exact24 top-level keyset:

```text
schema_version
logical_cycle_id
recovery_epoch_id
candidate_version_id
authority_token
event1_external_identity_sha256
event1_bootstrap_closure
event1_bootstrap_closure_sha256
operational_runtime_observation_external_identity
operational_runtime_observation_sha256
expected_observed_projection_sha256
readiness_receipt_path
preflight_started_at_utc
preflight_finished_at_utc
owner_validation_state
independent_verification_state
reservation_count_delta
formal_exact134_invocation_count
collection_state
test_execution_state
pytest_main_called
automatic_progression
body_free
bootstrap_readiness_receipt_sha256
```

Failure:

```text
path:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch003_
PostEvent1_BootstrapPreflightFailure_BodyFree_Receipt.json

schema:
cocolon.emlis.nls_v3.recovery_epoch003.
formal_worker_bootstrap_preflight_failure_receipt.v1
```

Strict exact29 top-level keyset:

```text
schema_version
logical_cycle_id
recovery_epoch_id
candidate_version_id
authority_token
preflight_challenge_id
preflight_id
event1_external_identity_sha256
source_closure_sha256
bootstrap_closure_sha256
operational_runtime_observation_state
operational_runtime_observation_external_identity
operational_runtime_observation_sha256
owner_operational_projection_sha256
independent_operational_projection_sha256
expected_observed_projection_sha256
failure_stage
failure_class
failure_issue_codes
stop_code
reservation_count_delta
attempt_id
formal_exact134_invocation_count
owner_validation_state
independent_verification_state
automatic_retry
automatic_progression
body_free
receipt_sha256
```

The preflight produces exactly one publication candidate: readiness or
failure. A failure keeps reservation, attempt, and exact134 at zero.

Nullable evidence fields are closed by failure class:

| failure class | failure stage | operational observation external identity / logical hash | owner / independent / expected-observed projection hashes |
|---|---|---|---|
| `BOOTSTRAP_SCHEMA_PAIR_UNSUPPORTED` | `BEFORE_MATERIALIZATION` | all `null` | all `null` |
| `SOURCE_BOOTSTRAP_BASELINE_MISMATCH` | `BEFORE_MATERIALIZATION` | all `null` | all `null` |
| `OPERATIONAL_MATERIALIZATION_BINDING_MISSING` | `MATERIALIZATION_BINDING` | both `null` | all `null` |
| `OPERATIONAL_RUNTIME_IDENTITY_MISMATCH` | `EXPECTED_OBSERVED_COMPARISON` | strict exact10 / required logical hash | both projection hashes required; expected-observed hash is canonical exact2 `{expected, observed}` |
| `INDEPENDENT_OPERATIONAL_PROJECTION_DISAGREEMENT` | `INDEPENDENT_PROJECTION` | strict exact10 / required logical hash | both projection hashes required and unequal; expected-observed hash is canonical exact2 `{owner, independent}` |

For every row, `preflight_challenge_id` and `preflight_id` are required
lowercase SHA-256 values derived before materialization, Event1/source/
bootstrap identities are required, `failure_issue_codes` is non-empty
sorted unique, `stop_code` is
`PRE_RESERVATION_FORMAL_WORKER_BOOTSTRAP_STOP`, and
reservation/formal-exact134 remain zero. A non-null external identity must
use the exact10 contract in section 6.0 and bind the exact operational
observation path. Nullability outside this table fails closed.

# 7. Version-aware owner and validator surface

## 7.1 Historical preservation

Historical Epoch002 validator behavior and historical artifact bytes remain
unchanged in meaning. Epoch003 does not relabel an Epoch002 object.

Known complete schema pairs:

```text
historical Epoch002:
cocolon.emlis.nls_v3.recovery_epoch002.
post_d2_source_baseline_eligibility_successor_closure.v1
+
cocolon.emlis.nls_v3.recovery_epoch002.
formal_worker_bootstrap_manifest.v2

Recovery Epoch003:
cocolon.emlis.nls_v3.recovery_epoch003.
source_baseline_eligibility_closure.v1
+
cocolon.emlis.nls_v3.recovery_epoch003.
formal_worker_bootstrap_manifest.v1
```

Mixed, unknown, relabeled, or partially converted pairs fail closed.

## 7.2 Exact future production-owner path set

The future D2 production path set is strict exact7:

```text
ai/services/ai_inference/
emlis_ai_recovery_epoch002_canonical_current_closure_v3.py

ai/services/ai_inference/
emlis_ai_recovery_epoch002_sequence_ledger_v3.py

ai/tools/
emlis_nls_v3_recovery_epoch002_atomic_publication_bundle_v3.py

ai/tools/
emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py

ai/tools/
emlis_nls_v3_recovery_epoch002_current_step_proof_run.py

ai/tools/
emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py

ai/tools/
emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_preflight.py
```

| path role | D2 necessity |
|---|---|
| canonical current closure | owns the Epoch003 source/bootstrap schema pair, strict nested validation, and closure hashing |
| sequence ledger | owns Epoch003 candidate allocation, P0 binding, Event1 exact23, and Event1 immutability |
| atomic publication bundle | owns the new body-free artifact roles and exact approved-path publication candidate validation |
| closure receipt verifier | independently owns schema-pair dispatch, exact14 operational projection, receipt validation, and external-identity validation |
| current step proof run | refuses formal execution until a valid Epoch003 readiness receipt is bound and keeps exact134 at zero before that gate |
| formal parent orchestrator | owns the separately stopped reference-closure, Event1, preflight, publication, and reservation phase order |
| formal worker bootstrap preflight | owns reference materialization, operational materialization, observation, readiness/failure candidate construction, and pre-reservation STOP |

These filenames remain historical compatibility owners. D2 may add
version-aware Epoch003 branches without changing the accepted meaning of
historical validators. Any need to add or replace a production path requires
a new explicit authority; D1 cannot silently broaden this set.

Independent verification must implement schema-pair discrimination and the
expected/observed projection without importing the owner validation
implementation. Only canonical serialization and cryptographic primitives
may be shared.

## 7.3 Exact D1 write surface

The next D1 may add exactly one test file:

```text
ai/tests/
test_emlis_nls_v3_recovery_epoch003_bootstrap_source_runtime_
expected_observed_contract_red.py
```

D1 must freeze its exact node IDs and denominator before executing the RED
selection. The denominator is not an observed fact at P0 and is not invented
here. No production path is writable by D1.

Required causal oracle families:

- complete known schema-pair dispatch and mixed/unknown rejection;
- expected reference observation binding;
- observed operational observation separation;
- expected/observed runtime, pytest, lock, RECORD, source, owner, plugin,
  argv, and environment parity;
- distinct reference and operational root identities;
- absence of post-Event1 materialization/root facts from Event1;
- placeholder executable/build/PATH identity rejection;
- Event1 byte immutability;
- Epoch002 challenge-provenance non-inheritance;
- owner-independent operational projection;
- readiness-or-failure exact-one candidate;
- reservation and formal exact134 exact0 on every preflight failure.

Stable failure classes:

```text
BOOTSTRAP_SCHEMA_PAIR_UNSUPPORTED
SOURCE_BOOTSTRAP_BASELINE_MISMATCH
OPERATIONAL_RUNTIME_IDENTITY_MISMATCH
OPERATIONAL_MATERIALIZATION_BINDING_MISSING
INDEPENDENT_OPERATIONAL_PROJECTION_DISAGREEMENT
```

Every class closes through:

```text
PRE_RESERVATION_FORMAL_WORKER_BOOTSTRAP_STOP
RESERVATION_COUNT_DELTA_0
FORMAL_EXACT134_INVOCATION_COUNT_0
AUTOMATIC_PROGRESSION_FALSE
AUTHORITY_STOP
```

# 8. Predecessor linkage and historical-credit boundary

## 8.1 Required predecessor set

The P0 receipt binds:

```text
governing reconciliation receipt external identity:
70d81a5bf53cc4e4406be4488c641ac1e1fc7f48e063a8bcbbbb20e7efe0333a

challenge-provenance correction Design receipt external identity:
d419334194d4dbc37c6c0da725b1d166005253f22178ae4ddc0367c4e6c481b7

Event1 historical external identity:
dcb1d29ec5e0546b096111a8f84f6521b7862bc610e30f408cf0c56a29610682

Event1 source closure:
e6d27de726f71e4f757c597862f4adcb68d2587a9ddaf619cf1dff53d06edf88

Event1 bootstrap closure:
75e9ca12c84c2f17d5c6f1cb0609a83a7413851dea4612b82b28ccd44c8383fe

failure receipt corrected external identity:
c38516c355aa450aecce332b7ad50d3db9daad13ce6f27ebdd942dc0f239a856

formal-parent phase result:
4bf8736052e7acd4d7638593f282c8ae0282a7cb94c81590bf222e79879dc6a3
```

The receipt also carries a canonical SHA-256 over the strict exact7 mapping
above.

## 8.2 Retained evidence

Recovery Epoch003 may retain only:

- the fact that the Event1 baseline was published and immutable;
- the observed source/bootstrap incompatibility;
- the qualified failure receipt;
- the process risk of expected/observed conflation;
- the one-Event1-per-epoch and one-shot authority boundaries; and
- the exact predecessor identities in section 8.1.

## 8.3 Non-inherited active credit

Recovery Epoch003 does not inherit:

- `nls_v3_rc_epoch002_success_0001` as a candidate;
- Event1, source closure, or bootstrap closure as an active baseline;
- the design-declared or scratch-recomputed challenge as actual;
- D1 RED or D2 GREEN credit;
- reference or operational runtime observations;
- readiness, reservation, attempt, terminal, accepted-run, Step00..10,
  all11, Event2, P2, Product Read, or Cycle acceptance credit;
- fixture runtime identities as observations; or
- batch, distribution, depth, surface, performance, or review credit.

# 9. Exact future authority order

Every stage requires separate explicit approval and ends without automatic
progression.

## 9.1 Exactly one next authority

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_D1_BOOTSTRAP_SOURCE_RUNTIME_EXPECTED_OBSERVED_SEPARATION_SCHEMA_PAIR_DISPATCH_EVENT1_IMMUTABILITY_AND_INDEPENDENT_OPERATIONAL_PROJECTION_RED_FREEZE_ONLY
```

Allowed:

- add the exact D1 test path in section 7.3;
- freeze exact node IDs and denominator;
- obtain causal RED against the unchanged current production owner surface;
- independently verify the RED is caused by the absent Epoch003 contract;
- publish only the D1 result, body-free receipt, handoff, tracked-plan
  append, and latest-snapshot append; and
- stop.

Forbidden:

- no production source, fixture, config, dependency, lock, schema owner, or
  existing test change;
- no reference or operational runtime materialization;
- no candidate, Event1, readiness, reservation, attempt, or exact134;
- no automatic progression.

## 9.2 Later exact stage tokens

D2 implementation and targeted GREEN:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_D2_BOOTSTRAP_SOURCE_RUNTIME_EXPECTED_OBSERVED_SEPARATION_SCHEMA_PAIR_DISPATCH_EVENT1_IMMUTABILITY_AND_INDEPENDENT_OPERATIONAL_PROJECTION_IMPLEMENTATION_AND_TARGETED_GREEN_ONLY
```

Final source/bootstrap/reference-runtime closure and operational admission:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_FINAL_SOURCE_BOOTSTRAP_REFERENCE_RUNTIME_CLOSURE_AND_OPERATIONAL_ADMISSION_ISSUANCE_INDEPENDENT_VERIFICATION_AND_POSTVERIFICATION_ONLY
```

Distinct candidate allocation and exactly one Event1:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_DISTINCT_CANDIDATE_ALLOCATION_AND_SEQUENCE_EVENT1_SOURCE_BASELINE_LOCK_PUBLICATION_INDEPENDENT_VERIFICATION_AND_POSTVERIFICATION_ONLY
```

Post-Event1 operational materialization and preflight:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_POST_EVENT1_LOCKED_RUNTIME_MATERIALIZATION_OPERATIONAL_RUNTIME_OBSERVATION_READINESS_OR_FAILURE_CANDIDATE_AND_INDEPENDENT_PREFLIGHT_VERIFICATION_ONLY
```

Readiness-or-failure publication:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_POST_EVENT1_OPERATIONAL_RUNTIME_OBSERVATION_AND_MATCHING_BOOTSTRAP_READINESS_OR_FAILURE_BODY_FREE_RECEIPT_PUBLICATION_INDEPENDENT_VERIFICATION_AND_POSTVERIFICATION_ONLY
```

One-shot reservation:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_PREFLIGHT_READY_FORMAL_ATTEMPT_ONE_SHOT_RESERVATION_PUBLICATION_AND_POSTVERIFICATION_ONLY
```

No later token is eligible until the immediately preceding stage is
published and postverified. Reservation and all later formal stages remain
outside this P0.

# 10. P0 body-free receipt contract

Path:

```text
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_Lineage02_Event1V2_
BootstrapPreflightContractUnreachable_SourceBaselineInvalidationAnd
RecoveryEpoch003_ParentDesign_ReadOnly_BodyFree_Receipt_20260729.json
```

Schema:

```text
cocolon.emlis.nls_v3.step11.cycle001.
recovery_epoch003.parent_design.body_free_receipt.v1
```

Strict exact24 top-level keyset:

```text
schema_version
approved_authority_token
logical_cycle_id
source_entries
parent_design_path
parent_design_raw_sha256
epoch002_invalidation
epoch002_event1_external_identity
epoch002_failure_receipt_external_identity
challenge_provenance
immutable_evidence_disposition
epoch003_definition
epoch003_p0_contract
predecessor_linkage
historical_credit_boundary
future_gate_order
repository_scope
independent_verification
decision_effective_when
next_authority_token
state
automatic_progression
body_free
receipt_sha256
```

`source_entries` is strict exact4:

```text
karen_diary_commit_sha1
cocolon_entry_commit_sha1
mashos_api_commit_sha1
mashos_api_tree_sha1
```

`epoch002_invalidation` is strict exact12:

```text
recovery_epoch_id
state
reason_codes
candidate_state
event1_state
failure_receipt_state
readiness_state
reservation_state
attempt_state
formal_exact134_invocation_count
source_repair_executed
history_rewrite_or_deletion_allowed
```

`challenge_provenance` is strict exact6:

```text
design_declared_preflight_challenge_id
current_script_recomputed_preflight_challenge_id
actual_executed_challenge_state
execution_provenance_state
affects_failure_class
affects_downstream_execution_identity_claim
```

`epoch003_definition` is strict exact12:

```text
recovery_epoch_id
state
source_baseline_state
candidate_state
d1_state
d2_state
event1_state
readiness_state
reservation_state
attempt_state
formal_exact134_invocation_count
cycle001_state
```

`predecessor_linkage` is strict exact8: the seven fields in section 8.1 plus
`predecessor_set_sha256`.

The remaining nested objects and arrays are strict and documented in the
receipt itself. The receipt contains no self publication commit, blob, or
raw identity. `receipt_sha256` is SHA-256 over the canonical sorted JSON
exact23 preimage without that field and without a trailing LF.

Decision effectiveness:

```text
PARENT_DESIGN_AND_RECEIPT_REACHABLE_ON_COCOLON_MAIN_AND_TARGET_CONTENT_POSTFETCH_VERIFIED
```

The full P0 documentation checkpoint is complete only after the handoff,
tracked plan, and latest snapshot are also present and postverified.

# 11. Scope and prohibitions

## 11.1 Exact changed paths

This authority changes exactly five Cocolon paths:

```text
NEW:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_Lineage02_Event1V2_
BootstrapPreflightContractUnreachable_SourceBaselineInvalidationAnd
RecoveryEpoch003_ParentDesign_ReadOnly_20260729.md

NEW:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_Lineage02_Event1V2_
BootstrapPreflightContractUnreachable_SourceBaselineInvalidationAnd
RecoveryEpoch003_ParentDesign_ReadOnly_BodyFree_Receipt_20260729.json

NEW:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_Lineage02_Event1V2_
BootstrapPreflightContractUnreachable_SourceBaselineInvalidationAnd
RecoveryEpoch003_ParentDesign_ReadOnly_Handoff_20260729.md

MODIFY:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md

MODIFY:
Cocolon_前提資料/07_latest_snapshot_diff.md
```

No structural premise file changes because structure, owner-policy,
reflection contract, required read order, and naming boundary do not change.

## 11.2 Forbidden effects

```text
mashos-api source/test/fixture/schema/config/dependency/lock write:
0

test / pytest / preflight execution:
0

reference or operational runtime materialization:
0

candidate / Event1 / readiness / attestation:
0 / 0 / 0 / 0

reservation / attempt / exact134:
0 / 0 / 0

private body generation or publication:
0

P2 / fresh batch / exact100 / Product Read / correction / B6:
NOT_STARTED

Cycle001 acceptance:
NOT_ACCEPTED
```

No current Event1, failure receipt, source closure, bootstrap closure,
historical receipt, contract, source, test, fixture, sample, manifest, public
API, DB, RN, Safety, runtime, or shared route is modified.

# 12. Independent verification contract

Three read-only verification roles separately covered rules/scope, design
causality, and identity/state consistency. Karen performs final judgment and
all GitHub writes.

Before publication:

1. re-fetch current repository heads;
2. verify all three new exact paths are absent;
3. verify the tracked-plan and latest-snapshot blobs still equal the entry
   blobs;
4. validate the Design required sections, exact schema/path/keyset/owner
   surface, historical-credit boundary, and authority order;
5. validate the receipt strict keysets and closed values;
6. independently recompute the receipt canonical hash;
7. scan Design, receipt, and handoff for raw/private-body fields and
   forbidden runtime claims; and
8. verify mashos-api remains unchanged.

After publication:

1. re-fetch each target path and exact-match intended content;
2. verify path/blob/raw/logical identities as applicable;
3. derive and independently recompute the P0 external identity;
4. verify the five write commits changed no path outside the exact approved
   set;
5. verify current Cocolon main contains all exact5 results;
6. verify Event1 and the failure receipt still have their entry blobs;
7. verify mashos-api remains at the fixed source commit;
8. verify test/preflight/runtime/reservation/attempt/exact134 counts remain
   zero; and
9. stop without automatic progression.

Current GitHub reflection is governed only by
`Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md`
`# CURRENT_NORMATIVE_CONTRACT`. Historical SSH/key, expected-old lease,
direct-child, single-commit, whole-tree, all-unchanged-path, full-recursive
postfetch, and durable-store transport conditions are not revived.

# 13. Facts, inference, and Karen's opinion

## 13.1 Confirmed facts

- Event1 is published, postverified, immutable, and locks the current source
  baseline.
- The current validator/materialization contract is unreachable before
  reservation.
- The body-free failure receipt and corrected external identity are
  postverified.
- No runtime materialization, readiness, reservation, attempt, or exact134
  occurred.
- Same-epoch source repair would change bytes protected by Event1, and a
  second Event1 is forbidden.

## 13.2 Inference

The required transition is an eligibility change, not a declaration that
Event1 was false. The Event1 accurately records what was locked; that locked
baseline cannot truthfully reach its downstream readiness contract.

The expected-versus-observed split is inferred to be the smallest repair
that preserves both Event1 immutability and actual runtime proof.

## 13.3 Karen's opinion

The honest boundary is to preserve every Epoch002 fact while withdrawing
only its right to continue as an active baseline. Reusing its candidate,
challenge, or readiness credit would make an unreachable path look
successful.

For Epoch003, a runtime identity must be observed twice under the same frozen
lock: once before Event1 as the expected reference and once after Event1 as
the independent operational observation. That separation keeps source truth
and runtime truth connected without inserting future observations into
immutable past bytes.

This P0 must end here. A correct design does not become permission to write
production code or execute the RED.

# 14. STOP

```text
RECOVERY_EPOCH002:
EPOCH_INVALIDATED

RECOVERY_EPOCH003:
PARENT_DESIGN_FROZEN_DEFINED_NOT_STARTED

SOURCE_BASELINE:
UNLOCKED

CANDIDATE:
UNALLOCATED

MASHOS_API_CHANGE_COUNT:
0

TEST_EXECUTION_COUNT:
0

RUNTIME_MATERIALIZATION_COUNT:
0

READINESS / RESERVATION / FORMAL_EXACT134:
0 / 0 / 0

CYCLE001:
NOT_ACCEPTED

AUTOMATIC_PROGRESSION:
false

NEXT_SEPARATE_APPROVAL_CANDIDATE:
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_D1_BOOTSTRAP_SOURCE_RUNTIME_EXPECTED_OBSERVED_SEPARATION_SCHEMA_PAIR_DISPATCH_EVENT1_IMMUTABILITY_AND_INDEPENDENT_OPERATIONAL_PROJECTION_RED_FREEZE_ONLY

AUTHORITY_STOP
```
