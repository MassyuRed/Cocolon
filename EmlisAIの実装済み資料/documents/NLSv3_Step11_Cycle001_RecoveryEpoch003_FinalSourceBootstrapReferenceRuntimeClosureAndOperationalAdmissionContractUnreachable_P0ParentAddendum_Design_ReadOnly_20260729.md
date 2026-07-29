---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch003_final_source_bootstrap_reference_runtime_closure_operational_admission_contract_unreachable_p0_parent_addendum_design_read_only
title: "NLS v3 Step 11 Cycle 001 Recovery Epoch 003 final source/bootstrap/reference-runtime closure and operational-admission contract-unreachable P0 Parent Addendum"
revision_date: "2026-07-29"
status: "RECOVERY_EPOCH003_PRE_EVENT1_OPERATIONAL_ADMISSION_CONTRACT_PARENT_ADDENDUM_DESIGN_FROZEN_D1_NOT_STARTED_AUTHORITY_STOP"
body_free: true
automatic_progression: false
---

# 0. Decision

Approved authority:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_FINAL_SOURCE_BOOTSTRAP_REFERENCE_RUNTIME_CLOSURE_AND_OPERATIONAL_ADMISSION_CONTRACT_UNREACHABLE_P0_PARENT_ADDENDUM_DESIGN_ISSUANCE_INDEPENDENT_VERIFICATION_AND_DESIGN_ONLY
```

The previously approved final issuance stopped before creating any
operational artifact because the governing P0 did not define a reachable
pre-Event1 carrier for source/bootstrap closure and did not define the
OperationalAdmission body.

This append-only Parent Addendum freezes the missing prospective contract.
It changes Cocolon documentation only.

```text
REFERENCE RUNTIME MATERIALIZATION:
NOT_STARTED

REFERENCE RUNTIME OBSERVATION:
NOT_CREATED

SOURCE / BOOTSTRAP CLOSURE:
NOT_CREATED

OPERATIONAL ADMISSION:
NOT_CREATED

CANDIDATE / EVENT1 / READINESS:
UNALLOCATED / NOT_CREATED / NOT_CREATED

RESERVATION / ATTEMPT / FORMAL EXACT134:
0 / 0 / 0

SOURCE BASELINE:
UNLOCKED

P2 / PRODUCT READ / CYCLE001:
NOT_STARTED / NOT_STARTED / NOT_ACCEPTED

AUTOMATIC PROGRESSION:
false

AUTHORITY STOP
```

The exact correction is:

```text
OperationalAdmission is the sole pre-Event1 source/bootstrap full-object
carrier.

source_closure exact20 and bootstrap_closure exact33 remain without
individual standalone paths, but are embedded as full canonical objects in:

1. the postverified OperationalAdmission body; and
2. the later immutable Event1 body.
```

No separate final-closure document is added. A second carrier would add a
path, role, identity, publication, and maintenance boundary without adding
a distinct fact: the OperationalAdmission self-hash and external identity
already bind both full closure objects.

# 1. Position-change and authority gate

```text
prior_position:
the original final issuance authority was eligible after D2 GREEN

newly confirmed facts:
the P0 requires pre-Event1 source/bootstrap publication while declaring
those objects Event1-nested-only; OperationalAdmission has only a fixture
path/schema/role and no body contract; current D2 accepts a generic
admission schema/path and has no production reference-runtime constructor

change_basis:
direct inspection of the current P0, corrected D1 fixture, D2 exact7,
historical Epoch002 admission, lock, materializer, and absent GitHub paths

correction:
the original final issuance authority ended at a no-write contract stop;
this Addendum freezes the missing contract before any runtime or artifact
issuance

proposed_position:
publish and postverify this documentation exact5, then require a new D1
causal RED and D2 targeted GREEN before a superseding final issuance
```

Observable effects:

```text
user_action_effect:
false

contract_mutation_effect:
true, explicitly authorized by the approved Design-only token

position_change_effect:
true, supported by the newly observed exact contract gaps above
```

This Addendum does not request a wheelhouse or any Mash operation. The
wheelhouse is not needed until the later operational issuance.

# 2. Precedence and fixed entries

## 2.1 Precedence

For the prospective Recovery Epoch003 pre-Event1 operational contract, the
order is:

1. this Parent Addendum;
2. the Recovery Epoch003 P0 Parent Design;
3. the corrected D1 receipt and immutable exact30 oracle;
4. the D2 implementation and targeted-GREEN receipt;
5. the current Execution and Closure Plan; and
6. historical Epoch002 material.

This Addendum supersedes only:

- the P0 statement that source/bootstrap are nested only in Event1;
- the undefined OperationalAdmission body contract;
- the P0 standalone-path and publication-role counts;
- the unreachable pre-Event1 phase evidence;
- the Event1 OperationalAdmission schema/path, primary-evidence, supporting
  artifact, changed-path, and authority-token semantics;
- the candidate/Event1 phase split; and
- the missing actual Epoch003 reference-runtime materializer/builder
  contract.

All unrelated P0 schemas, keysets, paths, hashes, historical-credit
boundaries, expected/observed separation, readiness/failure contracts,
reservation boundary, and zero-effect rules remain unchanged.

The original P0 Design/receipt, first D1, corrected D1, and D2 artifacts
remain immutable historical evidence. The D2 GREEN remains true for the
contract it tested; it is not operational-admission eligibility.

## 2.2 Repository entry

```text
MassyuRed/Karen-Diary:
700f749f5149cac1f8bd4bab8a364d524a56985b

MassyuRed/Cocolon:
9a15b41d30af232c444ad99d1c04bb26eff4e32e

MassyuRed/mashos-api:
cc8d2962ac30e3e6ebdae3c22dde2794471157d1

mashos-api tree:
1ddc22da0ac80cdd53a67acfd604949bf99e369a
```

The mashos-api commit/tree above is the Design entry only. It must not be
copied into the future OperationalAdmission as the final source identity.
The later D2 remediation changes source bytes; the operational issuance
must freshly observe the clean post-remediation `main` commit/tree.

## 2.3 Governing identities

```text
Recovery Epoch003 P0 external identity:
74286b862eeee1663d2758ee18d1e848316da6fc27b12fef38c149c5a2b52f36

corrected bootstrap-contract D1 receipt external identity:
d9164d82715abb519b549a7581737a37ebd3bf153b53284697cbe4573a8edb9e

bootstrap-contract D2 receipt external identity:
cbd665b12b3af16b251a66073222d12823fb8776207922616718290e4bddc738
```

The fixed corrected-D1 exact10 object is:

```json
{"artifact_role":"RECOVERY_EPOCH003_D1_BOOTSTRAP_ORACLE_CORRECTION_CAUSAL_RED_REFREEZE_RECEIPT","body_free":true,"git_blob_sha1":"1ad1d3610916f48a3d7adafac76fcb93c4d47538","identity_sha256":"d9164d82715abb519b549a7581737a37ebd3bf153b53284697cbe4573a8edb9e","logical_artifact_sha256":"cabe7aa0d50e94083edfd95b4641383aaa9ff11e44e60e7ea538e93252490370","path":"EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_D1_BootstrapFormalExact134ManifestAndReferenceRuntimeRootIdentityBinding_OracleCorrectionAndCausalREDRefreeze_BodyFree_Receipt_20260729.json","publication_commit_sha1":"31601a4f5ea3583ef1e9a839c55a8ace7677fd3e","raw_sha256":"0b6e491dedeb684b3f7d32b3a3acd231fbc724b994a75b1419c855428894a405","repository_full_name":"MassyuRed/Cocolon","schema_version":"cocolon.emlis.nls_v3.recovery_epoch003.d1_bootstrap_oracle_correction_causal_red_refreeze_receipt.v1"}
```

The fixed D2 exact10 object is:

```json
{"artifact_role":"RECOVERY_EPOCH003_D2_BOOTSTRAP_SOURCE_RUNTIME_TARGETED_GREEN_RECEIPT","body_free":true,"git_blob_sha1":"fd2396953e1a3fe6d8e2172f1cdf30a197406b0a","identity_sha256":"cbd665b12b3af16b251a66073222d12823fb8776207922616718290e4bddc738","logical_artifact_sha256":"39ffbe4a791624c550eeb5d70d5326a26c88fee9e0a3880ae93e53066db570db","path":"EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_D2_BootstrapSourceRuntimeExpectedObservedSeparationSchemaPairDispatchEvent1ImmutabilityAndIndependentOperationalProjection_ImplementationAndTargetedGREEN_BodyFree_Receipt_20260729.json","publication_commit_sha1":"1da49a13ee8a0a16d9c856861af55a3deb7468e4","raw_sha256":"a24184570ce97d46d4e13652c2417e77b41f730832861aa0cbddb9a9b3e5d6dd","repository_full_name":"MassyuRed/Cocolon","schema_version":"cocolon.emlis.nls_v3.recovery_epoch003.d2_bootstrap_source_runtime_targeted_green_receipt.v1"}
```

# 3. Confirmed contract unreachability

## 3.1 Missing carrier

The P0 freezes source closure exact20 and bootstrap closure exact33 as
Event1-nested-only objects with no standalone path. Its parent phase order
nevertheless requires source/bootstrap closure publication and
postverification before candidate allocation and Event1.

There is no artifact carrying the two full objects in that phase.

## 3.2 Missing OperationalAdmission body

The corrected D1 fixture uses only:

```text
role:
RECOVERY_EPOCH003_OPERATIONAL_ADMISSION

schema:
cocolon.emlis.nls_v3.recovery_epoch003.operational_admission.v1

path:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch003_
OperationalAdmission_BodyFree_Receipt.json
```

The fixture logical identity is not an actual artifact body. No top-level
keyset, nested contract, self-hash, authority, scope, freshness,
predecessor, source/bootstrap, owner, or independent-verifier contract was
frozen.

## 3.3 Current D2 is insufficient for issuance

The current D2:

- validates `authority.operational_admission` only as role plus generic
  exact10, allowing arbitrary non-empty safe schema/path;
- does not validate an OperationalAdmission body;
- has no OperationalAdmission publication role/path;
- expects a fixture-only Event1 primary role
  `RECOVERY_EPOCH003_D2_GREEN_RECEIPT`, which does not equal the actual D2
  role in section 2.3;
- ties Event1 `expected_changed_path_count` to already-published supporting
  artifacts, producing `3` instead of the Event1 exact1 publication;
- requires publication and transition authority tokens to differ even
  though candidate allocation and Event1 share one explicit authority;
- advances the parent cursor from phase-name strings without requiring the
  phase's artifact and postfetch evidence;
- contains no Epoch003 reference-runtime constructor/materializer or
  production source/bootstrap builder.

These are prospective operational gaps. They do not retroactively erase
the historical D2 targeted GREEN.

# 4. Addendum external identity

This Addendum has two documentation anchor members:

1. this Markdown Design; and
2. its body-free receipt.

The handoff, tracked-plan append, and latest-snapshot append are reflection
records.

The Addendum postfetch external-identity target is the body-free receipt.
Its artifact role is:

```text
RECOVERY_EPOCH003_OPERATIONAL_ADMISSION_PARENT_ADDENDUM_DESIGN_FROZEN_RECEIPT
```

Its schema and path are:

```text
cocolon.emlis.nls_v3.recovery_epoch003.
operational_admission_parent_addendum_design_frozen_receipt.v1

EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch003_
FinalSourceBootstrapReferenceRuntimeClosureAndOperationalAdmission
ContractUnreachable_P0ParentAddendum_Design_ReadOnly_
BodyFree_Receipt_20260729.json
```

After publication, the exact10 external identity uses the P0 generic
contract:

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

`identity_sha256` is SHA-256 over canonical sorted compact JSON of the other
exact9 keys with no trailing LF.

The future OperationalAdmission predecessor bindings contain the full
postverified exact10 Addendum identity. They do not accept only a caller
supplied scalar.

# 5. OperationalAdmission as the sole pre-Event1 source/bootstrap carrier

## 5.1 Fixed path, schema, and role

```text
path:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch003_
OperationalAdmission_BodyFree_Receipt.json

schema:
cocolon.emlis.nls_v3.recovery_epoch003.operational_admission.v1

artifact role:
RECOVERY_EPOCH003_OPERATIONAL_ADMISSION

owner:
ai/services/ai_inference/
emlis_ai_recovery_epoch002_sequence_ledger_v3.py

independent verifier:
ai/tools/
emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py
```

The path is absent at the Design entry. This Design does not create it.

## 5.2 Strict exact16 top-level contract

```text
schema_version
logical_cycle_id
recovery_epoch_id
predecessor_bindings
source_closure
bootstrap_closure
authority
scope
freshness
effect_boundary
owner_validation_state
independent_verification_state
state
automatic_progression
body_free
operational_admission_sha256
```

Fixed values:

```text
schema_version:
cocolon.emlis.nls_v3.recovery_epoch003.operational_admission.v1

logical_cycle_id:
NLS_V3_CYCLE_001

recovery_epoch_id:
NLS_V3_CYCLE001_RECOVERY_EPOCH_003

owner_validation_state:
PROVED

independent_verification_state:
PROVED

state:
SOURCE_BOOTSTRAP_REFERENCE_RUNTIME_CLOSED_AWAITING_SEPARATE_CANDIDATE_EVENT1_AUTHORITY

automatic_progression:
false

body_free:
true
```

`operational_admission_sha256` is SHA-256 over canonical UTF-8 sorted
compact JSON of the other exact15 keys with no trailing LF. NFC and LF
normalization, no duplicate keys, no non-finite numbers, and array-order
rules from P0 section 6.0 apply.

## 5.3 Predecessor bindings strict exact8

```text
p0_external_identity
operational_admission_parent_addendum_receipt_external_identity
bootstrap_contract_d1_receipt_external_identity
bootstrap_contract_d2_receipt_external_identity
operational_admission_contract_d1_receipt_external_identity
operational_admission_contract_d2_receipt_external_identity
reference_runtime_observation_external_identity
predecessor_bindings_sha256
```

Requirements:

- `p0_external_identity` is the strict exact6 P0 identity whose self-hash is
  `74286b862eeee1663d2758ee18d1e848316da6fc27b12fef38c149c5a2b52f36`;
- `operational_admission_parent_addendum_receipt_external_identity` is the
  full strict exact10 identity from section 4;
- `bootstrap_contract_d1_receipt_external_identity` is the fixed corrected
  D1 exact10 object in section 2.3;
- `bootstrap_contract_d2_receipt_external_identity` is the fixed D2 exact10
  object in section 2.3;
- the two operational-admission contract identities are the future
  postverified D1 and D2 remediation receipts defined in section 11;
- `reference_runtime_observation_external_identity` is the strict exact10
  reference identity with the P0-fixed role/schema/path; and
- `predecessor_bindings_sha256` hashes the other exact7 keys.

The source closure exact20 remains unchanged. Its existing D1/D2 scalar
fields retain the original corrected bootstrap-contract D1 and D2
identities `d916...` and `cbd665...`. The later remediation D1/D2 identities
are cumulatively bound by this predecessor object and the
OperationalAdmission self-hash. They do not silently change the meaning or
keyset of source closure exact20.

## 5.4 Embedded source and bootstrap

`source_closure` is the unchanged P0 strict exact20:

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

`bootstrap_closure` is the unchanged P0 strict exact33:

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

The owner and independent verifier must separately prove:

- the P0 exact20/exact33 validators;
- exact-equal source commit/tree across source, bootstrap, scope, and the
  freshly observed clean post-remediation mashos-api `main`;
- exact-equal bootstrap/reference external identity and the corresponding
  source scalar;
- exact-equal source/bootstrap self-hashes and scope fields;
- D1/D2/P0 predecessor bindings;
- formal exact134, formal-test exact21, owner, import, plugin, argv,
  environment, lock, wheel, installed-distribution, pytest, and runtime
  identities derived from actual source/reference runtime;
- placeholder, absolute-path, traversal, private-body, post-Event1 fact,
  unclassified import, and unresolved dynamic import counts are forbidden
  or zero as frozen by P0; and
- neither verifier accepts arbitrary nonzero digests as observed facts.

The exact20 and exact33 objects appear only in the OperationalAdmission and
later Event1. They have no individual standalone document paths.

Admission postverification is also a causal publication check. From the
OperationalAdmission exact10 publication commit, owner and independent
verifier must prove that:

- the admission commit changes exactly the admission path;
- its parent/base commit contains the fixed reference path;
- the reference bytes at that base exactly match the reference exact10
  blob/raw/logical identity embedded in the admission;
- the reference publication commit is an ancestor of the admission base;
  and
- no overwrite, delete, or same-path replacement occurred between the
  reference publication and admission publication.

Final-head reachability alone is not sufficient evidence of
reference-before-admission order.

## 5.5 Authority strict exact4

```text
approval_kind
admission_authority_token
publication_authority_token
authority_sha256
```

Requirements:

```text
approval_kind:
EXPLICIT_SEPARATE_APPROVAL

admission_authority_token:
the superseding final issuance token in section 11.3

publication_authority_token:
the same superseding final issuance token
```

`authority_sha256` hashes the other exact3 keys. The current Design-only
token is forbidden in a future OperationalAdmission.

## 5.6 Scope strict exact12

```text
artifact_repository_full_name
source_repository_full_name
source_ref
source_commit_sha1
source_tree_sha1
source_closure_sha256
bootstrap_closure_sha256
reference_runtime_observation_external_identity_sha256
next_authority_token
operation_set
separate_explicit_authority_required
scope_sha256
```

Fixed repository/ref values:

```text
artifact_repository_full_name:
MassyuRed/Cocolon

source_repository_full_name:
MassyuRed/mashos-api

source_ref:
refs/heads/main

separate_explicit_authority_required:
true
```

The ordered exact7 eligibility operation set is:

```text
OPERATIONAL_ADMISSION_PUBLICATION
DISTINCT_CANDIDATE_ALLOCATION
SOURCE_BASELINE_EVENT1_PUBLICATION
OPERATIONAL_RUNTIME_MATERIALIZATION
OPERATIONAL_RUNTIME_OBSERVATION_PUBLICATION
BOOTSTRAP_READINESS_OR_FAILURE_PUBLICATION
FORMAL_ATTEMPT_ONE_SHOT_RESERVATION_PUBLICATION
```

This is eligibility, not authorization. Every separately named later stage
or compound transaction still requires its own exact explicit token.
Suboperations intentionally grouped by one token—candidate plus Event1, or
one observation plus exactly one readiness/failure publication—must remain
atomic within that token and do not require invented sub-tokens. Formal
exact134 invocation, terminal/success publication, P2, Product Read, and
Cycle acceptance are not in this operation set.

`next_authority_token` is exactly:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_DISTINCT_CANDIDATE_ALLOCATION_AND_SEQUENCE_EVENT1_SOURCE_BASELINE_LOCK_PUBLICATION_INDEPENDENT_VERIFICATION_AND_POSTVERIFICATION_ONLY
```

`scope_sha256` hashes the other exact11 keys.

## 5.7 Freshness strict exact11

```text
issued_at_utc
expires_at_utc
validity_mode
bound_source_commit_sha1
bound_source_tree_sha1
bound_reference_runtime_observation_external_identity_sha256
event1_path_state_at_issuance
maximum_event1_consumption_count
invalidation_conditions
reuse_allowed
freshness_sha256
```

Fixed policy:

```text
expires_at_utc:
null

validity_mode:
IDENTITY_STABLE_SINGLE_EVENT1_CONSUMPTION

event1_path_state_at_issuance:
ABSENT

maximum_event1_consumption_count:
1

reuse_allowed:
false
```

`issued_at_utc` is a JSON string in canonical RFC3339 UTC-second form
`YYYY-MM-DDTHH:MM:SSZ`, with no fractional seconds or offset alias. It is
freshly observed, not caller supplied. There is no arbitrary wall-clock
expiry. Freshness is lost when any of the following sorted exact4
conditions becomes true:

```text
ADMISSION_IDENTITY_ALREADY_BOUND_BY_EVENT1
REFERENCE_OR_PREDECESSOR_IDENTITY_NOT_REACHABLE_OR_BYTE_DRIFTED
SOURCE_COMMIT_OR_TREE_DRIFTED_OR_WORKTREE_NOT_CLEAN
SOURCE_OR_BOOTSTRAP_CLOSURE_MISMATCH
```

At Event1 publication the owner and independent verifier freshly recheck
all conditions. A stale or already-consumed admission is never overwritten,
reissued under the same epoch, or reused. Recovery requires explicit
invalidation/new-epoch authority.

`freshness_sha256` hashes the other exact10 keys.

## 5.8 Effect boundary strict exact15

```text
reference_runtime_materialization_count_delta
reference_runtime_observation_publication_count
operational_admission_publication_count
operational_runtime_materialization_count
candidate_allocation_count
sequence_event1_count
readiness_artifact_count
formal_reservation_count
formal_attempt_count
formal_exact134_invocation_count
formal_test_collection_count
test_execution_count
pytest_main_call_count
source_baseline_state
effect_boundary_sha256
```

Fixed values at successful OperationalAdmission postverification:

```text
1 / 1 / 1 / 0 / 0 / 0 / 0 / 0 / 0 / 0 / 0 / 0 / 0

source_baseline_state:
UNLOCKED
```

`effect_boundary_sha256` hashes the other exact14 keys.

# 6. Reference-runtime materializer and builders

## 6.1 Frozen lock facts

```text
path:
ai/configs/emlis_nls_v3_recovery_epoch002_
formal_worker_bootstrap_lock_v1.json

Git blob:
0822fcb010985cd0d384f250a9e8a1fe16dc8fd4

raw SHA-256:
9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787

logical lock SHA-256:
801ba54efc0f6655238d14e7c153fb70b555801489aa8ba028515fc64d9c05f4

wheel/distribution count:
46

wheel-bundle manifest SHA-256:
63f3915ccf57845dc0c4b5d14762207d23d1cb7a435a9de8411add8491ba6fc8

installed exact4 array SHA-256:
0e2e4b5ec3f3b1aef7fad4474af28d8eeea8fa7bec1a57a9cb7180fc81b80e42

target:
CPython 3.12.13 / Linux x86_64 / pip 26.0.1
```

The lock identity and wheel hashes are semantic authority. A download URL,
index, directory name, credential, or provider is not.

## 6.2 Required production APIs

The later D2 remediation must add the following exact7 public functions.
Every function accepts exactly one `Mapping[str, Any]` argument named
`state`. Builders return the frozen body on success and an exact1 error
tuple on failure; validators return `()` on success and an exact1 error
tuple on failure. No function raises a caller-visible exception for
malformed contract input.

```text
materialize_recovery_epoch003_reference_runtime
build_recovery_epoch003_reference_runtime_observation
verify_recovery_epoch003_reference_runtime_observation
build_recovery_epoch003_source_bootstrap_closure
build_recovery_epoch003_operational_admission
verify_recovery_epoch003_operational_admission_contract
validate_recovery_epoch003_parent_phase_evidence_state
```

The required API-to-owner map is exact7:

| API | production owner path |
|---|---|
| `materialize_recovery_epoch003_reference_runtime` | `ai/tools/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_preflight.py` |
| `build_recovery_epoch003_reference_runtime_observation` | `ai/tools/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_preflight.py` |
| `verify_recovery_epoch003_reference_runtime_observation` | `ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py` |
| `build_recovery_epoch003_source_bootstrap_closure` | `ai/services/ai_inference/emlis_ai_recovery_epoch002_canonical_current_closure_v3.py` |
| `build_recovery_epoch003_operational_admission` | `ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py` |
| `verify_recovery_epoch003_operational_admission_contract` | `ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py` |
| `validate_recovery_epoch003_parent_phase_evidence_state` | `ai/tools/emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py` |

The API names and owner paths above freeze responsibility and observable
behavior; they do not authorize implementation in this Design stage.

The input and success contracts are:

| API | strict input keyset | success |
|---|---|---|
| materialize reference runtime | exact9: `authority_token / artifact_repository_root / source_repository_root / expected_source_commit_sha1 / expected_source_tree_sha1 / dependency_lock_path / wheelhouse_path / destination_root / environment` | transient strict exact4 `runtime_root / wheel_snapshot_root / runtime_materialization / effective_environment_policy`, where materialization is P0 strict exact10 and policy is P0 strict exact5 |
| build reference observation | exact2: `materialization_request / materialization_result` | P0 reference-observation strict exact21, freshly derived by probing the transient roots and bound policy |
| independently verify reference observation | exact6: `verification_mode / materialization_request / materialization_result / reference_runtime_observation / reference_runtime_observation_external_identity / reference_publication_state` | `()` |
| build source/bootstrap closure | exact5: `source_repository_root / source_commit_sha1 / source_tree_sha1 / reference_runtime_observation / reference_runtime_observation_external_identity` | strict exact2 mapping `source_closure / bootstrap_closure`, containing P0 exact20/exact33 |
| build OperationalAdmission | exact8: `predecessor_bindings / source_closure / bootstrap_closure / authority / scope / freshness_policy / reference_publication_state / source_repository_observation` | OperationalAdmission strict exact16 |
| independently verify OperationalAdmission | exact7: `verification_mode / artifact_repository_root / source_repository_observation / operational_admission / operational_admission_external_identity / reference_runtime_observation / reference_publication_state` | `()` |
| validate parent phase evidence | exact9: `artifact_repository_root / source_repository_root / phase_order / completed_phases / phase_evidence / next_phase / reservation_count_delta / formal_exact134_invocation_count / automatic_progression` | `()` |

The independent reference verifier runs first with
`verification_mode = BODY_ONLY_BEFORE_PUBLICATION`, where the external
identity and publication state are `null`, then with
`BODY_AND_POSTFETCH`, where both are complete and exact. It independently
probes the materialized runtime root, source root, lock, wheel snapshot,
Python, pip, pytest, distributions/RECORD, and environment; it does not
import the owner builder.

`materialization_request` is the exact9 input to the materializer, retained
only as transient verifier state. The reference builder and independent
verifier recompute the sanitized exact5 policy from that same request and
require it to deep/hash exact-equal the policy in `materialization_result`
and the later exact21 body. A second environment/request object is
forbidden.

The independent admission verifier likewise runs first with
`verification_mode = BODY_ONLY_BEFORE_PUBLICATION` and a `null`
OperationalAdmission external identity, then with `BODY_AND_POSTFETCH` and
the complete exact10 identity. Thus both reference and admission are
independently body-verified before publication and identity/postfetch-
verified after publication.

The transient filesystem roots are owner/verifier inputs only and are
never serialized. The effective exact5 environment policy is serialized
only where P0 already requires it in the reference/bootstrap chain. The
builder never accepts a second caller-supplied effective policy; it uses
the policy emitted by materialization and independently recomputed from the
sanitized process environment.

The `authority_token` input to materialize, build-reference, and
verify-reference must in both verifier modes be exact-equal to the
superseding final issuance token in section 11.3. A non-empty, Design,
candidate/Event1, or later-stage token is rejected.

`reference_publication_state` is transient validation input, not a new
artifact. It is strict exact7:

```text
artifact_repository_root
external_identity
postfetch_body
admission_base_commit_sha1
admission_base_tree_sha1
reference_publication_is_ancestor_of_admission_base
reference_path_blob_at_admission_base_sha1
```

Both owner and independent verifier derive the ancestry, base, path blob,
raw/logical hashes, and postfetch equality from actual repository state.
They do not trust the Boolean or any supplied digest by itself.

`source_repository_observation` is transient strict exact4
`source_repository_root / source_commit_sha1 / source_tree_sha1 /
worktree_clean`. Its Git identities and cleanliness are freshly derived,
not accepted as caller assertions.

The admission owner re-derives this observation at build time and requires
its commit/tree to be exact-equal to source closure, bootstrap closure,
scope, and the values used by the source/bootstrap builder. A stale
pre-reference observation cannot build an admission.

`freshness_policy` is the freshness exact11 keyset after deleting
`issued_at_utc` and `freshness_sha256`, therefore strict exact9. The
admission builder freshly observes the canonical UTC-second timestamp,
adds `issued_at_utc`, and derives `freshness_sha256`; neither value is
accepted from the caller.

The parent phase input exact9 adds `artifact_repository_root` and
`source_repository_root` to the seven state/cursor/effect keys in the
table. Each parent `phase_evidence` row is strict exact6:

```text
phase
artifact_records
runtime_records
owner_validation_state
independent_verification_state
phase_evidence_sha256
```

Artifact records are strict exact5
`external_identity / published_body / postfetch_body /
publication_base_commit_sha1 / changed_paths`. The external identity is
strict exact10; owner and verifier deep-compare the two bodies and derive
blob/raw/logical/commit ancestry and exact changed paths from the artifact
repository root. Records are sorted by external-identity
`artifact_role / path / identity_sha256`. Runtime records are strict exact4
`evidence_role / evidence_body / logical_sha256 / body_free`; the logical
hash is independently derived from the full body, and rows are sorted by
`evidence_role / logical_sha256`. The phase-evidence self-hash covers the
other exact5 keys. Completed phases require, in order: reference exact1;
admission exact1; Event1 exact1; an operational-observation candidate plus
exactly one readiness-or-failure candidate as phase-4 runtime records
exact2; operational observation plus exactly one
readiness-or-failure artifact exact2; and reservation exact1. Names,
external identities, or digests without bodies/repository evidence are
rejected.

For phase 4, membership is exactly:

1. role `OPERATIONAL_RUNTIME_OBSERVATION_CANDIDATE` with the P0 strict
   exact41 operational-observation body, including its nested strict
   exact10 runtime materialization; and
2. exactly one of role `BOOTSTRAP_READINESS_CANDIDATE` with the P0 strict
   exact24 readiness body, or role
   `FORMAL_WORKER_BOOTSTRAP_PREFLIGHT_FAILURE_CANDIDATE` with the P0 strict
   exact29 failure body.

The numbering above explains membership, not array order. The actual sorted
array is the readiness or failure role first, then the operational role;
the frozen `evidence_role / logical_sha256` sort remains authoritative.

All other phase-specific record counts and artifact roles are those in
section 9. Phase 5 publishes/postverifies the exact2 candidates from phase
4; it does not rebuild or replace them.

The stable exact7 failure tuples are respectively:

```text
RECOVERY_EPOCH003_REFERENCE_RUNTIME_MATERIALIZATION_INVALID
RECOVERY_EPOCH003_REFERENCE_RUNTIME_OBSERVATION_INVALID
RECOVERY_EPOCH003_REFERENCE_RUNTIME_OBSERVATION_VERIFICATION_INVALID
RECOVERY_EPOCH003_SOURCE_BOOTSTRAP_BUILD_INVALID
RECOVERY_EPOCH003_OPERATIONAL_ADMISSION_BUILD_INVALID
RECOVERY_EPOCH003_OPERATIONAL_ADMISSION_VERIFICATION_INVALID
RECOVERY_EPOCH003_PARENT_PHASE_EVIDENCE_INVALID
```

Failure returns no partial body and causes no publication, runtime reuse,
test, candidate, Event1, readiness, reservation, attempt, or formal
exact134 effect.

## 6.3 Materialization requirements

The Epoch003 reference materializer must:

1. freshly observe the clean post-remediation mashos-api `main` commit/tree;
2. require the exact lock identity in section 6.1;
3. require the wheelhouse directory-entry set itself to be the exact46
   regular wheel files, rejecting every extra file, directory, symlink, or
   other entry;
4. reject each wheel that is not a regular non-symlink file;
5. no-follow copy each wheel into an owner-controlled immutable snapshot
   root outside the artifact repository, source repository, and input
   wheelhouse;
6. verify filename, SHA-256, wheel RECORD, metadata, and target tag before
   and after snapshotting and before/after install;
7. use a fresh nonexistent destination root; require destination and
   snapshot roots to be mutually disjoint and both outside the artifact
   repository, source repository, and input wheelhouse; and never reuse a
   partial root;
8. run pip with sanitized explicit environment and
   `--isolated --no-index --no-cache-dir --require-hashes
   --only-binary=:all: --no-compile`,
   with `--find-links` pointing only to the immutable exact46 snapshot;
9. perform no network/index fallback during materialization;
10. recompute actual installed exact46 distribution/RECORD closures;
11. verify the installer interpreter's `python -m pip` is exactly 26.0.1
    before install, then probe the isolated Python executable/build and
    pip/pytest identities, requiring exact agreement with CPython 3.12.13,
    Linux x86_64, pip 26.0.1, and the lock-derived pytest distribution;
12. produce
    `cocolon.emlis.nls_v3.recovery_epoch003.runtime_materialization.v1`
    with state `VERIFIED_LOCKED_REFERENCE_RUNTIME`;
13. omit absolute runtime/wheel paths and credentials from every artifact;
14. keep collection, test execution, `pytest.main`, reservation, attempt,
    and formal exact134 at zero; and
15. fail closed without a reference artifact when any predicate fails.

At fresh-root creation, the materializer creates an owner-generated
32-byte cryptographic nonce in an immutable root-local identity file. The
nonce and file are never published. `runtime_root_identity_sha256` is
SHA-256 over canonical UTF-8 sorted compact JSON of this strict exact11
preimage, with no trailing LF:

```text
schema_version
materialization_kind
root_nonce_sha256
source_commit_sha1
source_tree_sha1
dependency_lock_raw_sha256
wheel_bundle_manifest_sha256
installed_distributions_sha256
python_runtime_identity_sha256
pytest_distribution_identity_sha256
environment_policy_sha256
```

`schema_version` is
`cocolon.emlis.nls_v3.recovery_epoch003.runtime_root_identity_preimage.v1`;
`materialization_kind` is exactly `REFERENCE` here and `OPERATIONAL` in
the later post-Event1 materializer. Owner and independent verifier read the
root-local nonce, re-probe the root, rebuild this preimage, and require the
same hash. Distinct roots and materialization kinds must have distinct
identities; a caller-supplied root digest is never accepted.

No exact46 wheelhouse was found in the inspected repository trees, supplied
workspace artifacts, or currently available artifact routes. That is not a
blocker for this Design, D1, or D2. A fixture/unit GREEN in D2 is contract
evidence only and is never operational materialization or success credit.
Actual exact46 materialization is allowed only in the later operational
issuance. At that stage Karen first attempts all authorized available
acquisition routes. Only if the exact46 wheelhouse cannot be obtained
without Mash action may a separate concrete user request be made under the
work-rule explanation gate.

## 6.4 Actual derivation, not fixture injection

The source/bootstrap builders derive, rather than accept as authoritative
caller-supplied hashes:

- the exact7 owner blob/raw identities;
- formal exact134 node IDs and exact21 formal-test manifest;
- static import closure and FIRST_PARTY/STDLIB/THIRD_PARTY target bindings;
- dependency-lock, exact46 wheel, installed-distribution, RECORD, Python,
  pytest, plugin, argv, and environment identities;
- source dependency, canonical current, requirement-registry,
  formal-node-registry, proof-source, and formal-test closures; and
- the full reference-observation exact10 identity.

The owner and independent verifier may share only canonical serialization
and cryptographic primitives. The independent verifier does not import the
owner validators/builders.

The P0 reference-observation exact21 `authority_token` must be exact-equal
to the superseding final issuance token in section 11.3. That same token
must be exact-equal to both token fields in the OperationalAdmission
authority exact4. A merely non-empty reference token is not accepted.

# 7. Publication-role and standalone-path correction

The P0 prospective contract count changes from:

```text
artifact contracts / standalone paths:
7 / 5
```

to:

```text
artifact contracts / standalone paths:
8 / 6
```

Source and bootstrap remain nested contracts, not standalone paths.

The Epoch003 publication role/path map is strict exact7 roles over exact6
unique paths. Every path in the table is under the exact prefix
`EmlisAIの実装済み資料/documents/`:

| artifact role | exact path |
|---|---|
| `RECOVERY_EPOCH003_REFERENCE_RUNTIME_OBSERVATION` | `NLSv3_Step11_Cycle001_RecoveryEpoch003_PreEvent1_ReferenceRuntimeObservation_BodyFree_Receipt.json` |
| `RECOVERY_EPOCH003_OPERATIONAL_ADMISSION` | `NLSv3_Step11_Cycle001_RecoveryEpoch003_OperationalAdmission_BodyFree_Receipt.json` |
| `RECOVERY_EPOCH003_SOURCE_BASELINE_EVENT` | `NLSv3_Step11_Cycle001_RecoveryEpoch003_SequenceEvent01_SourceBaselineLocked_BodyFree_Event.json` |
| `RECOVERY_EPOCH003_OPERATIONAL_RUNTIME_OBSERVATION` | `NLSv3_Step11_Cycle001_RecoveryEpoch003_PostEvent1_OperationalRuntimeObservation_BodyFree_Receipt.json` |
| `RECOVERY_EPOCH003_OPERATIONAL_RUNTIME_OBSERVATION_FAILURE_EVIDENCE` | the same operational-observation path |
| `RECOVERY_EPOCH003_BOOTSTRAP_READINESS` | `NLSv3_Step11_Cycle001_RecoveryEpoch003_PostEvent1_BootstrapReadiness_BodyFree_Receipt.json` |
| `RECOVERY_EPOCH003_FORMAL_WORKER_BOOTSTRAP_PREFLIGHT_FAILURE` | `NLSv3_Step11_Cycle001_RecoveryEpoch003_PostEvent1_BootstrapPreflightFailure_BodyFree_Receipt.json` |

Every publication candidate is exact one changed path. Already-published
supporting identities never increase the current publication changed-path
count.

# 8. Event1 prospective correction

The Event1 exact23 and candidate-allocation exact9 keysets remain unchanged.

The later Event1 must satisfy:

```text
Event1.source_closure
==
postverified OperationalAdmission.source_closure

Event1.bootstrap_closure
==
postverified OperationalAdmission.bootstrap_closure

Event1.authority.operational_admission
==
Event1.primary_evidence_artifact
==
the postverified OperationalAdmission strict exact10 external identity
```

The admission external identity must bind the exact role, schema, and path
in section 5.1. Generic non-empty schema/path acceptance is forbidden.

Event1 publication supporting artifacts are sorted strict exact2 by
`artifact_role / path / identity_sha256`:

1. OperationalAdmission exact10; and
2. reference runtime observation exact10.

They are already published and postverified. Therefore:

```text
supporting_artifact_count:
2

expected_changed_path_count:
1
```

The supporting array hash still covers the exact2 array. The current
`1 + len(supporting_artifacts)` rule is superseded.

Both:

```text
authority.publication_authority_token
authority.transition_authority_token
```

must equal the single separately approved candidate/Event1 token in section
5.6. Requiring them to differ is superseded.

`authority.approval_kind` is exactly
`EXPLICIT_SEPARATE_APPROVAL`. The transition token is the authority for the
`SOURCE_BASELINE_LOCKED` transition performed by this same Event1
publication; it is not the authority for the later post-Event1 stage.

Candidate allocation remains nested in Event1. It binds P0, source closure,
and reference observation directly and binds OperationalAdmission
transitively through the Event1 self-hash and primary evidence. Adding a
new candidate key is unnecessary.

# 9. Corrected parent phase order and evidence

The governing prospective order is exact6:

```text
1. REFERENCE_RUNTIME_OBSERVATION_PUBLISHED_AND_POSTVERIFIED

2. SOURCE_BOOTSTRAP_OPERATIONAL_ADMISSION_CARRIER_
   PUBLISHED_AND_POSTVERIFIED

3. CANDIDATE_ALLOCATED_WITH_EVENT1_
   PUBLISHED_AND_POSTVERIFIED

4. OPERATIONAL_RUNTIME_MATERIALIZATION_AND_PREFLIGHT

5. READINESS_OR_FAILURE_PUBLISHED_AND_POSTVERIFIED

6. FORMAL_RESERVATION_PUBLISHED_AND_POSTVERIFIED
```

The original exact7 string-only order is historical compatibility input,
not current operational authority.

`CANDIDATE_ALLOCATED` is not a standalone completed phase because candidate
allocation is an Event1-nested object with no standalone publication or
postfetch identity.

The phase validator must reject a completed phase name without its evidence:

| phase | minimum required evidence |
|---|---|
| 1 | valid reference exact21, exact10 identity, single-path publication and fresh postfetch |
| 2 | valid admission exact16, full exact20/exact33 objects, strict predecessor/authority/scope/freshness/effect boundaries, exact10 identity, single-path publication and fresh postfetch |
| 3 | valid candidate exact9 nested in immutable Event1 exact23, exact1 Event1 publication/postfetch, reference/admission dependencies fresh |
| 4 | valid operational observation candidate and exactly one readiness/failure candidate, distinct roots, all pre-reservation effects zero |
| 5 | operational observation plus matching readiness/failure publication identities and postfetch |
| 6 | valid one-shot reservation publication/postfetch and all preceding evidence |

Owner and independent phase validation must independently apply the
artifact/body/external-identity/postfetch predicates. A caller-provided
phase cursor or digest is not completion evidence.

# 10. Version-aware production owner surface

## 10.1 Future D1 exact1

The new causal RED path is:

```text
ai/tests/
test_emlis_nls_v3_recovery_epoch003_operational_admission_contract_red.py
```

The corrected existing D1 test remains byte-immutable.

The new D1 freezes its node IDs and exact denominator before running. P0
does not invent that denominator.

Required causal families:

- OperationalAdmission exact path/schema/role/body/keysets/self-hashes;
- full source/bootstrap carrier and reference/predecessor cross-binding;
- reference-publication ancestry/base-bytes proof before admission
  publication;
- identity-stable single-use freshness;
- exact7 role/exact6 path map;
- Event1 exact admission schema/path and deep closure equality;
- actual OperationalAdmission primary evidence;
- supporting exact2 with Event1 changed-path exact1;
- equal candidate/Event1 publication/transition authority token;
- candidate allocation not independently phase-completable;
- phase evidence required beyond names/cursor;
- actual Epoch003 exact7 API signatures, strict input/success/failure
  contracts, and no fixture/hash injection;
- exact API-to-owner map and exact-equal reference/admission final-issuance
  authority token;
- exact46 wheel/snapshot/environment/root requirements; and
- zero runtime/test/candidate/Event1/reservation/formal effects in D1.

## 10.2 Future D2 exact6

The later D2 may modify only:

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
emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py

ai/tools/
emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_preflight.py
```

`emlis_nls_v3_recovery_epoch002_current_step_proof_run.py` remains
unchanged because its existing readiness-before-formal STOP remains the
downstream execution gate.

Any need for a new production path or a seventh changed production path
requires a new explicit authority.

Historical Epoch002 and the original Epoch003 D2 API meanings remain
available for historical validation. The new current operational phase API
is versioned; old cursor-only phase state cannot grant operational credit.

## 10.3 Frozen future verification selections

Future D1 freezes the new exactN ordered full-node array and its SHA-256 in
the D1 receipt before executing only:

```text
PYTHONDONTWRITEBYTECODE=1
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1
python -m pytest -q --tb=short --disable-warnings --noconftest \
  -p no:cacheprovider \
  ai/tests/test_emlis_nls_v3_recovery_epoch003_operational_admission_contract_red.py
```

Future D2 runs exactly three pytest selections with those same flags:

1. the new D1 path above, with exactN and ordered-node hash exact-equal to
   the postverified D1 receipt;
2. the immutable corrected original D1 path
   `ai/tests/test_emlis_nls_v3_recovery_epoch003_bootstrap_source_runtime_expected_observed_contract_red.py`,
   exact30; and
3. the immutable historical regression path
   `ai/tests/test_emlis_nls_v3_recovery_epoch002_retry_lineage_and_formal_worker_bootstrap_reconciliation_red.py`,
   exact46.

No directory, wildcard, unbound related regression, or full-suite
selection is authorized. Syntax compilation and `git diff --check` are
non-pytest supporting checks. Fixture/unit GREEN does not count as actual
exact46 reference materialization or operational success.

# 11. Future authority order

Every stage requires separate explicit approval and stops without automatic
progression.

## 11.1 Exactly one next authority

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_POST_P0_PARENT_ADDENDUM_D1_OPERATIONAL_ADMISSION_SOURCE_BOOTSTRAP_CARRIER_REFERENCE_MATERIALIZER_EVENT1_BINDING_AND_PHASE_EVIDENCE_CONTRACT_CAUSAL_RED_FREEZE_ONLY
```

It may add only the exact D1 test, freeze and execute its causal RED, publish
the D1 result/receipt/handoff/plan/snapshot, and stop. It may not modify
production or materialize a runtime.

Future D1 receipt exact10 binding:

```text
role:
RECOVERY_EPOCH003_OPERATIONAL_ADMISSION_CONTRACT_CAUSAL_RED_RECEIPT

schema:
cocolon.emlis.nls_v3.recovery_epoch003.
operational_admission_contract_causal_red_receipt.v1

path:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch003_
PostP0ParentAddendum_D1_OperationalAdmissionSourceBootstrapCarrier
ReferenceMaterializerEvent1BindingAndPhaseEvidenceContract_
CausalRED_FreezeOnly_BodyFree_Receipt_20260729.json
```

## 11.2 D2

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_POST_P0_PARENT_ADDENDUM_D2_OPERATIONAL_ADMISSION_SOURCE_BOOTSTRAP_CARRIER_REFERENCE_MATERIALIZER_EVENT1_BINDING_AND_PHASE_EVIDENCE_CONTRACT_IMPLEMENTATION_AND_TARGETED_GREEN_ONLY
```

It implements the section 10.2 exact6, keeps both D1 tests immutable, runs
only the section 10.3 exact3 pytest selections and supporting checks,
publishes its result/receipt/handoff/plan/snapshot, and stops.

Future D2 receipt exact10 binding:

```text
role:
RECOVERY_EPOCH003_OPERATIONAL_ADMISSION_CONTRACT_TARGETED_GREEN_RECEIPT

schema:
cocolon.emlis.nls_v3.recovery_epoch003.
operational_admission_contract_targeted_green_receipt.v1

path:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch003_
PostP0ParentAddendum_D2_OperationalAdmissionSourceBootstrapCarrier
ReferenceMaterializerEvent1BindingAndPhaseEvidenceContract_
ImplementationAndTargetedGREEN_BodyFree_Receipt_20260729.json
```

Both future receipt exact10 identities must use their actual postverified
paths, blobs, raw/logical hashes, and publication commits. No fixture
identity is accepted.

Each future receipt body is a closed body-free JSON contract frozen in its
own approved stage before execution. Its only logical self-hash field is
`receipt_sha256`, computed over canonical UTF-8 sorted compact JSON after
deleting only that field, with no trailing LF. In the external exact10,
`logical_artifact_sha256` must exact-equal the body `receipt_sha256`;
`schema_version`, `path`, and role must exact-equal the values above. The
D1 receipt must bind exactN and its ordered full-node-array hash. The D2
receipt must bind the exact3 selections and denominators `N / 30 / 46`.

## 11.3 Superseding final issuance

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_FINAL_PRE_EVENT1_REFERENCE_RUNTIME_OBSERVATION_AND_SOURCE_BOOTSTRAP_OPERATIONAL_ADMISSION_CARRIER_ISSUANCE_INDEPENDENT_VERIFICATION_AND_POSTVERIFICATION_ONLY
```

Within that one stage:

1. materialize one actual reference runtime;
2. build/independently verify/publish/postverify the reference observation;
3. freshly recheck source commit/tree after reference publication;
4. derive exact20/exact33 and build/independently verify the admission;
5. publish/postverify the admission exact1;
6. derive its strict exact10 external identity; and
7. stop.

One explicit final-issuance execution permits at most one materialization
start. A failure before reference publication leaves the reference and
admission paths absent, treats any incomplete root as non-reusable, grants
no successful-materialization or operational credit, and stops. A new
explicit recovery authority is required before another start.

If source drifts after reference publication, the published reference
remains immutable historical evidence, but Recovery Epoch003 becomes
ineligible. No admission is published, the reference path is not
overwritten, and neither the reference identity nor the epoch may be
retried/reused. Continuation requires an explicit invalidation and
new-recovery-epoch authority.

The same closed disposition applies to any non-source failure after
reference publication and before successful admission postverification,
including build, owner verification, independent verification, admission
publication, or postfetch failure. The reference remains immutable history;
no same-epoch retry or overwrite is allowed. If admission publication may
have occurred but postfetch is inconclusive, the epoch is
`INDETERMINATE_STOP`, not success, until a separate investigation and
invalidation/new-epoch authority resolves the published path.

## 11.4 Later unchanged authorities

Candidate/Event1:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_DISTINCT_CANDIDATE_ALLOCATION_AND_SEQUENCE_EVENT1_SOURCE_BASELINE_LOCK_PUBLICATION_INDEPENDENT_VERIFICATION_AND_POSTVERIFICATION_ONLY
```

Post-Event1 operational materialization/preflight:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_POST_EVENT1_LOCKED_RUNTIME_MATERIALIZATION_OPERATIONAL_RUNTIME_OBSERVATION_READINESS_OR_FAILURE_CANDIDATE_AND_INDEPENDENT_PREFLIGHT_VERIFICATION_ONLY
```

Observation plus readiness/failure publication:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_POST_EVENT1_OPERATIONAL_RUNTIME_OBSERVATION_AND_MATCHING_BOOTSTRAP_READINESS_OR_FAILURE_BODY_FREE_RECEIPT_PUBLICATION_INDEPENDENT_VERIFICATION_AND_POSTVERIFICATION_ONLY
```

One-shot reservation:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_PREFLIGHT_READY_FORMAL_ATTEMPT_ONE_SHOT_RESERVATION_PUBLICATION_AND_POSTVERIFICATION_ONLY
```

# 12. Addendum body-free receipt contract

Receipt path:

```text
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch003_
FinalSourceBootstrapReferenceRuntimeClosureAndOperationalAdmission
ContractUnreachable_P0ParentAddendum_Design_ReadOnly_
BodyFree_Receipt_20260729.json
```

Strict exact27 top-level keyset:

```text
schema_version
approved_authority_token
logical_cycle_id
recovery_epoch_id
source_entries
governing_p0_external_identity_sha256
corrected_d1_receipt_external_identity_sha256
d2_green_receipt_external_identity_sha256
parent_addendum_design_path
parent_addendum_design_raw_sha256
position_change
confirmed_contract_gap
precedence
operational_admission_contract
reference_materializer_contract
publication_contract
event1_binding_contract
phase_order
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

The published receipt JSON itself is the normative closed nested shape.
No unlisted nested key, reordered normative array, or extra value is
accepted. The direct nested object key counts are:

```text
source_entries / position_change / confirmed_contract_gap / precedence:
4 / 4 / 9 / 4

operational_admission_contract / reference_materializer_contract:
29 / 47

publication_contract / event1_binding_contract:
7 / 14

repository_scope / independent_verification:
16 / 6
```

Nested exact counts are future D1/D2 receipt bindings exact5/exact5, API
name/owner/input-count/failure collections exact7/exact7/exact7/exact7,
phase4 runtime-record contract exact8,
precedence supersedes/preserves exact6/exact6,
publication roles exact7, supporting roles exact2 in frozen sorted order,
phase order exact6, future gates exact7, new/modified paths exact3/exact2,
and historical fixed denominators exact2. The receipt arrays and scalar
values shown in the published JSON are exact, not examples.

`receipt_sha256` hashes the canonical exact26 object after deleting only
that field, with no trailing LF.

The receipt contains no self publication commit/blob/raw identity. Those
are postfetch facts used to construct the Addendum exact10 identity in
section 4.

Decision effectiveness:

```text
PARENT_ADDENDUM_DESIGN_AND_RECEIPT_REACHABLE_ON_COCOLON_MAIN_
AND_TARGET_CONTENT_POSTFETCH_VERIFIED
```

# 13. Repository scope and forbidden effects

## 13.1 Exact changed paths

This Design authority changes exact5 Cocolon paths:

```text
NEW:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch003_
FinalSourceBootstrapReferenceRuntimeClosureAndOperationalAdmission
ContractUnreachable_P0ParentAddendum_Design_ReadOnly_20260729.md

NEW:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch003_
FinalSourceBootstrapReferenceRuntimeClosureAndOperationalAdmission
ContractUnreachable_P0ParentAddendum_Design_ReadOnly_
BodyFree_Receipt_20260729.json

NEW:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch003_
FinalSourceBootstrapReferenceRuntimeClosureAndOperationalAdmission
ContractUnreachable_P0ParentAddendum_Design_ReadOnly_
Handoff_20260729.md

MODIFY:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md

MODIFY:
Cocolon_前提資料/07_latest_snapshot_diff.md
```

No structure/rule file changes because repository structure, work rules,
reflection contract, read order, and naming boundary do not change.

## 13.2 Forbidden effects

```text
mashos-api write:
0

test / collection / RED / GREEN:
0 / 0 / 0 / 0

reference / operational runtime materialization:
0 / 0

reference observation / admission publication:
0 / 0

candidate / Event1 / readiness:
0 / 0 / 0

reservation / attempt / formal exact134:
0 / 0 / 0

private body:
0

source baseline:
UNLOCKED

P2 / Product Read / Cycle001:
NOT_STARTED / NOT_STARTED / NOT_ACCEPTED
```

# 14. Independent verification contract

Before publication:

1. re-fetch current Cocolon, mashos-api, and Karen-Diary heads;
2. re-read the current work rules, P0, corrected D1, D2, tracked plan,
   latest snapshot, roadmap, and detailed design;
3. verify all three new paths are absent;
4. verify the two modified-path blobs equal the entry blobs;
5. validate Design required sections and every frozen exact
   path/schema/role/keyset/hash/owner/phase/token;
6. validate the receipt exact27 and every nested closed value;
7. independently recompute Design raw SHA-256, receipt logical/raw SHA-256,
   and Git blob SHA-1;
8. verify no runtime fact, reference identity, final source commit/tree, or
   future D1/D2 identity was invented;
9. verify no private-body or absolute runtime/wheel path appears; and
10. independently audit scope and authority order.

After publication:

1. re-fetch all exact5 paths and exact-match intended content;
2. verify each new artifact's blob/raw/logical identities;
3. construct and independently recompute the Addendum receipt exact10
   external identity;
4. verify every Karen-generated write commit changed only approved paths;
5. verify the current Cocolon head contains all exact5;
6. verify mashos-api remains at the Design entry commit/tree;
7. verify reference/admission/Event1/readiness/reservation/formal effects
   remain zero; and
8. stop without automatic progression.

GitHub reflection follows only
`Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md`
`CURRENT_NORMATIVE_CONTRACT`. This Design does not add a transport
condition.

# 15. Facts, inference, unknowns, and Karen's opinion

## 15.1 Confirmed facts

- the P0 pre-Event1 carrier is missing;
- the admission fixture has no production body contract;
- the current D2 has no admission body validator, publication role, or
  Epoch003 reference constructor;
- current Event1 admission schema/path and primary evidence are not fixed to
  actual artifacts;
- current Event1 changed-path and authority-token predicates conflict with
  the later single Event1 publication authority;
- the exact46 lock identities exist, while no exact46 wheelhouse or actual
  reference runtime was found in the inspected repository trees, supplied
  workspace artifacts, or currently available artifact routes; and
- no operational artifact was created under the stopped final authority.

## 15.2 Inference

Using OperationalAdmission itself as the carrier is the smallest complete
repair. It satisfies the P0 pre-Event1 publication requirement, preserves
the individual no-standalone-path rule for source/bootstrap, and gives
Event1 one postverified full-object predecessor.

Identity-based single-use freshness is safer and cheaper than an arbitrary
wall-clock lease in the current one-writer/separate-approval environment.
Source/reference drift and prior Event1 consumption already invalidate the
admission causally.

## 15.3 Unknown and not written

This Design does not know or assert:

- post-remediation mashos-api commit/tree;
- exact46 wheel bytes or their acquisition route;
- reference runtime root or runtime identity;
- future reference/admission raw, logical, blob, publication, or external
  identities;
- future D1/D2 remediation receipt identities;
- candidate ID, challenge ID, Event1 timestamp/hash/identity;
- operational runtime observation, readiness/failure, reservation, attempt,
  formal result, Product Read, or Cycle acceptance.

These values may not be filled from fixtures or inference.

## 15.4 Karen's opinion

The earlier final issuance correctly stopped. Publishing a reference
observation before its carrier/admission contract was closed would have
created a stranded runtime fact and pressured later code to conform to an
accidental partial artifact.

I judge one admission-carrier artifact to be the right repair. A separate
final-closure receipt would duplicate the same source/bootstrap/reference
identity chain and create another publication gate without changing what
Event1 must trust.

I also judge that the wheelhouse should not be requested now. The truthful
order is Design, causal RED, targeted GREEN, and only then operational
materialization. This keeps Mash's work off the critical path until it is
actually necessary.

# 16. STOP

```text
STATE:
RECOVERY_EPOCH003_PRE_EVENT1_OPERATIONAL_ADMISSION_CONTRACT_
PARENT_ADDENDUM_DESIGN_FROZEN_D1_NOT_STARTED_AUTHORITY_STOP

EXACTLY_ONE_NEXT_AUTHORITY:
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_POST_P0_PARENT_ADDENDUM_D1_OPERATIONAL_ADMISSION_SOURCE_BOOTSTRAP_CARRIER_REFERENCE_MATERIALIZER_EVENT1_BINDING_AND_PHASE_EVIDENCE_CONTRACT_CAUSAL_RED_FREEZE_ONLY

SEPARATE_APPROVAL_REQUIRED:
true

AUTOMATIC_PROGRESSION:
false
```
