---
doc_id: nls_v3_step11_cycle001_recovery_epoch004_gate_b_static_verifier_launcher_identity_discovery_invalid_at_declared_scope_stop_result
title: "NLS v3 Step 11 Cycle001 Recovery Epoch004 Gate B static-verifier launcher identity discovery invalid-at-declared-scope stop Result"
date: "2026-08-02"
status: "POSTVERIFIED_CURRENT"
body_free: true
automatic_progression: false
---

# Gate B static-verifier launcher identity discovery invalid-at-declared-scope stop Result

## Outcome

Approved authority SHA-256
`3e57889ef1bf28bddaeef92aa0e3d0017a1f6e5abb954d37675dd5a4555451f0` was activated and
closed-consumed exact1. The current-session controller PATH was captured exact1, its raw SHA-256 was
derived exact1 and both the PATH value and raw PATH SHA-256 remained unpublished. One owner and one
independent static locator observation then completed with separate candidate, chain, stat and hash
state.

The terminal is:

```text
RUNTIME_NOT_READY_STATIC_VERIFIER_LAUNCHER_IDENTITY_INVALID_AT_DECLARED_DISCOVERY_SCOPE_STOP
```

Both observations encountered one direct `node` candidate locator, rejected that candidate under
the frozen admission contract, and produced zero accepted aliases, zero collapsed identities and
zero selected candidates. Their typed verdict, reason and count projections match. No selected
identity comparison was reached.

This is limited to the declared current PATH snapshot and policy. It is not a host-wide `node`
absence claim and does not establish which private locator or rejection predicate was involved.
Runtime readiness remains false and Full R1 remains `UNKNOWN_PRESERVED`.

## Confirmed facts

### Repository boundary

- The authority-declared Cocolon prewrite base is
  `1a05a9371b1a0475a9e8a840e60c41d564900a38` / tree
  `565386975bc65e2f767aac7566a42e694e3d2c71`.
- The connector-confirmed current Cocolon pre-observation predecessor is
  `b99707f6f058e38793d142d13df493b67b506cd7` / tree
  `811b3a3f393d3f813d99c2b2858be8ddb0a57572`.
- mashos-api remains `315813c7bd3372462de926ddad74df567254a6b5` / tree
  `a641510e107d52bb910073f36604c85bd57af150`.

### Frozen discovery input and method

```text
PATH snapshot read / raw SHA-256 derivation:
exact1 / exact1

PATH value / raw PATH SHA-256 publication:
exact0 / exact0

command name / command-name cardinality:
node / exact1

owner static locator observation / independent static locator observation:
exact1 / exact1

candidate-set / resolved-chain / stat / hash state reuse:
exact0 / exact0 / exact0 / exact0

recursive search / command-v lookup / guessed locator:
exact0 / exact0 / exact0
```

PATH order was preserved. Only direct PATH-entry plus `node` candidates were considered. Empty,
relative, dot/dot-dot escaping, duplicate, unreadable, non-executable and excluded-ancestry entries
were rejected. Task-root, upload, Cocolon, mashos-api, runtime, private and prior-helper ancestry
were excluded. Symlink traversal was bounded to 40 hops and failed closed on cycle, broken target or
excluded-ancestry escape.

### Owner and independent observations

```text
                                        owner      independent
PATH entries                            14         14
valid PATH entries                      13         13
rejected PATH entries                   1          1
candidate locators                      1          1
rejected candidates                     1          1
accepted candidate aliases              0          0
collapsed identities                    0          0
selected candidates                     0          0
verdict                                 INVALID    INVALID
reason                                  CANDIDATE_ABSENT_OR_UNTRUSTED
```

```text
owner observation SHA-256:
6cb9565230c1d6cf15a55f3c99a1ea47017ec721a991bc8c78a0a87c97c557af

independent observation SHA-256:
2ad2d44dfd11fc424378b0db8a1ee2e5de317f271c2937bff78693ebb6cf426b

controller combined observation SHA-256:
6ef3a14c52b1d5f8edf6bfe69104868e7c88407aa76fa940c8373618556b21f7

typed-blocker manifest SHA-256:
85918138bd71410773412e0c8ae63f5fddbd9358217720ceecb27288c7fc26c4

postverified receipt observation SHA-256:
dd10e06f0f1f0db799b3d7de098401ac6af2b146f64d1e5836fc432dc17ea82a
```

Absolute locators, PATH entries, symlink targets, raw stat values, PATH value and raw PATH SHA-256
were not published. Because no candidate was selected, selected-locator, chain, executable-raw and
stable-stat identity hashes are null.

### Sealed artifacts and zero-effect preservation

The replacement helper v2 raw identities remain
`7bc0aecb713831b8567987bae9ca599f67672a0cb3a85758892ac194fd13ca96` and
`5d2cc38a382c09156d3e8f9f09e70df1ee1d4e03b36bf7097dae154fda44406b`.
The alias-aware verifier v2 raw identities remain
`52d3f2fc02117240e2ad4a1fdaa498b9b3415d22f944f564fe2bbec664acddca` and
`fe0c3b563a40f0851a513fdc5fb2c252dfa2e89620246151df51baa9df0f6e47`.
No private body was read, imported, compiled, edited, reused, executed or published.

```text
node version probe / node engine execution:
exact0 / exact0

owner verifier / independent verifier execution:
exact0 / exact0

runtime / acquisition / network / staging / materialization / probe / role import / pytest:
exact0 / exact0 / exact0 / exact0 / exact0 / exact0 / exact0 / exact0

target authority issuance / activation / admission / consumption:
exact0 / exact0 / exact0 / exact0

target OS child / target import / collection / call / targeted pytest:
exact0 / exact0 / exact0 / exact0 / exact0

retry / fallback / interpreter switch:
exact0 / exact0 / exact0

Cocolon production / published RED / existing D1 / mashos-api change:
exact0 / exact0 / exact0 / exact0
```

The prior literal-only owner INVALID at 98/100, Observer V1 and Observer V2 outcomes remain
immutable and noncredit. Retroactive reparse, reclassification, credit and result change counts are
all exact0.

## Inference

The matched aggregate tells us that the two observers saw the same bounded failure, but it does not
identify whether the single candidate failed a symlink, final-file, ownership, mode or stability
predicate. Repeating discovery or guessing a second path would not close that semantic ambiguity.

## Karen's opinion

Before any runtime acquisition or verifier launch, the trust and rejection grammar should be made
total and explicit. In particular, PATH-entry rejection must be separated from same-final identity
collapse; the trusted-owner allowlist, exact five stable fields and symlink escape roots must have
one canonical meaning shared by owner and independent observers. That design closes the reason
boundary without exposing the locator or rerunning `node`.

## Body-free receipt identities

```text
Receipt blob SHA-1:
4e969dace3f817b780d0a866947799a327422ab3

Receipt raw SHA-256:
b3f98c94eadabf6c39cc2bcb97770908a2d7136b2e50152ca4b03e99d9d1e1ab

Receipt logical SHA-256:
65d81f1c069847b4e75e401b3fba8ff3228b8d04dd58231d5e4b603163524256

terminal observation SHA-256:
dd10e06f0f1f0db799b3d7de098401ac6af2b146f64d1e5836fc432dc17ea82a
```

## Exactly one next authority

Token SHA-256:

`a9f3c6eba3e3f1025ca20fdd981eb6c45e79fd6bf620ca79c961ae51823d1d15`

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_R1_OWNER_CONTRACT_OBSERVER_V2_RUNTIME_CONTINUITY_GATE_B_STATIC_VERIFIER_LAUNCHER_IDENTITY_DISCOVERY_INVALID_AT_DECLARED_SCOPE_POSTVERIFIED_OBSERVATION_SHA256_DD10E06F0F1F0DB799B3D7DE098401AC6AF2B146F64D1E5836FC432DC17EA82A_CURRENT_LAUNCHER_IDENTITY_DISCOVERY_AUTHORITY_SHA256_3E57889EF1BF28BDDAEEF92AA0E3D0017A1F6E5ABB954D37675DD5A4555451F0_ACTIVATED_EXACT1_CLOSED_CONSUMED_TYPED_LAUNCHER_IDENTITY_INVALID_STOP_FULL_R1_RESULT_UNKNOWN_PRESERVED_PRIOR_OBSERVER_V1_CLOSED_CONSUMED_NONCREDIT_IMMUTABLE_PRIOR_OBSERVER_V2_EXECUTION_AUTHORITY_CLOSED_UNCONSUMED_PRELAUNCH_NONCREDIT_NO_RETROACTIVE_REPARSE_RECLASSIFICATION_OR_CREDIT_AUTHORITY_DECLARED_COCOLON_PREWRITE_BASE_1A05A937_TREE_56538697_VERIFIED_CURRENT_COCOLON_PREWRITE_BASE_B99707F6_TREE_811B3A3F_MASHOS_API_315813C7_TREE_A641510E_PATH_SNAPSHOT_READ_AND_RAW_SHA256_DERIVATION_EXACT1_EXACT1_VALUE_AND_RAW_SHA256_PUBLICATION_EXACT0_EXACT0_COMMAND_NAME_NODE_EXACT1_PATH_ENTRY_TOTAL14_VALID13_REJECTED1_OWNER_STATIC_LOCATOR_OBSERVATION_EXACT1_CANDIDATE_LOCATOR1_REJECTED1_ACCEPTED_ALIAS0_COLLAPSED_IDENTITY0_SELECTED0_INVALID_CANDIDATE_ABSENT_OR_UNTRUSTED_OBSERVATION_SHA256_6CB9565230C1D6CF15A55F3C99A1EA47017EC721A991BC8C78A0A87C97C557AF_INDEPENDENT_STATIC_LOCATOR_OBSERVATION_EXACT1_CANDIDATE_LOCATOR1_REJECTED1_ACCEPTED_ALIAS0_COLLAPSED_IDENTITY0_SELECTED0_INVALID_CANDIDATE_ABSENT_OR_UNTRUSTED_OBSERVATION_SHA256_2AD2D44DFD11FC424378B0DB8A1EE2E5DE317F271C2937BFF78693EBB6CF426B_DUAL_VERDICT_REASON_AND_COUNT_PROJECTION_MATCH_EXACT1_SELECTED_IDENTITY_COMPARISON_NOT_REACHED_CONTROLLER_COMBINED_OBSERVATION_SHA256_6EF3A14C52B1D5F8EDF6BFE69104868E7C88407AA76FA940C8373618556B21F7_BLOCKING_MANIFEST_SHA256_85918138BD71410773412E0C8AE63F5FDDBD9358217720CEECB27288C7FC26C4_NO_GLOBAL_NODE_ABSENCE_OR_CANDIDATE_DETAIL_CLAIM_ABSOLUTE_LOCATOR_PATH_ENTRY_SYMLINK_TARGET_RAW_STAT_PATH_VALUE_AND_PATH_RAW_SHA256_PUBLICATION_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_NODE_VERSION_PROBE_ENGINE_EXECUTION_ALIAS_AWARE_VERIFIER_READ_IMPORT_COMPILE_EDIT_REUSE_EXECUTION_HELPER_RAW_READ_GATE_B_RUNTIME_ACQUISITION_NETWORK_STAGING_MATERIALIZATION_PROBE_ROLE_IMPORT_PYTEST_TARGET_EXECUTION_TARGET_AUTHORITY_ISSUANCE_ACTIVATION_ADMISSION_CONSUMPTION_TARGET_OS_CHILD_TARGET_IMPORT_COLLECTION_CALL_TARGETED_PYTEST_RETRY_FALLBACK_INTERPRETER_SWITCH_CHALLENGE_REMOTE_OBSERVATION_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_COCOLON_PRODUCTION_PUBLISHED_RED_EXISTING_D1_AND_MASHOS_API_CHANGE_EXACT0_EXACT0_EXACT0_EXACT0_DISTINCT_STATIC_VERIFIER_LAUNCHER_TRUST_AND_REJECTION_CONTRACT_RECONCILIATION_DESIGN_ONLY_AUTHORITY_CURRENT_BODY_FREE_RECEIPT_CONSUMPTION_EXACT1_PRIVATE_PATH_SNAPSHOT_VALUE_RAW_SHA256_PATH_ENTRY_LOCATOR_SYMLINK_TARGET_RAW_STAT_REJECTION_DETAIL_AND_PRIVATE_BODY_READ_OR_PUBLICATION_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_BODY_FREE_PUBLICABLE_LAUNCHER_TRUST_AND_REJECTION_CONTRACT_V1_CANDIDATE_CREATION_EXACT1_PATH_ENTRY_REJECTION_AND_CANDIDATE_REJECTION_DISTINCT_TYPED_ENUM_CLOSED_EXACT1_DUPLICATE_PATH_ENTRY_REJECTION_AND_SAME_FINAL_IDENTITY_ALIAS_COLLAPSE_SEPARATION_EXACT1_SYMLINK_MAX40_CYCLE_BROKEN_AND_EXCLUDED_ANCESTRY_ESCAPE_TOTAL_EXACT1_EXCLUDED_ANCESTRY_SET_CURRENT_TASK_ROOT_UPLOAD_COCOLON_MASHOS_API_RUNTIME_PRIVATE_PRIOR_HELPER_EXACT7_TRUSTED_OWNER_POLICY_ROOT_OR_AUTHORITY_PREBOUND_CONTROLLER_UID_CANONICALLY_DEDUPLICATED_EXACT1_FINAL_REGULAR_EXECUTABLE_NOT_GROUP_OR_WORLD_WRITABLE_NLINK_POSITIVE_SIZE_POSITIVE_EXACT1_STABLE_FIELD_SET_SIZE_MTIME_INODE_MODE_UID_EXACT5_NO_UNDECLARED_ACCEPTANCE_FIELD_EXACT1_REJECTION_REASON_PRECEDENCE_TOTAL_AND_EXCLUSIVE_EXACT1_OWNER_AND_INDEPENDENT_CANONICAL_PREIMAGE_DOMAIN_SEPARATION_AND_NO_STATE_REUSE_EXACT1_INVALID_DIVERGENCE_AND_DUAL_MATCH_DESIGN_VALID_THREE_WAY_TERMINAL_MAPPING_TOTAL_EXACT1_OWNER_STATIC_DESIGN_VERIFICATION_EXACT1_VALID_AND_INDEPENDENT_STATIC_DESIGN_VERIFICATION_EXACT1_VALID_OR_TYPED_DESIGN_BLOCKER_STOP_PRIOR_VERIFIER_HELPER_SCHEMA_AND_OBSERVATION_EDIT_REUSE_EXECUTION_RECLASSIFICATION_OR_CREDIT_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_PATH_SNAPSHOT_READ_LOCATOR_DISCOVERY_NODE_PROBE_OR_EXECUTION_VERIFIER_OR_HELPER_READ_EXECUTION_GATE_B_RUNTIME_ACQUISITION_NETWORK_MATERIALIZATION_PYTEST_TARGET_EXECUTION_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_COCOLON_PRODUCTION_SOURCE_PUBLISHED_RED_EXISTING_D1_AND_MASHOS_API_CHANGE_EXACT0_EXACT0_EXACT0_EXACT0_BODY_FREE_CONTRACT_RESULT_RECEIPT_HANDOFF_PLAN_LATEST_POSTVERIFICATION_ONLY_STOP_NO_REJECTION_CLASSIFIER_LAUNCHER_ACQUISITION_VERIFIER_GATE_B_OR_TARGET_AUTHORITY_EXECUTION_NO_AUTOMATIC_PROGRESSION
```

State: `DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED`.

Automatic progression: `false`.
