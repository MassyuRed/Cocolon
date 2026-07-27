---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch002_post_d2_actual_s1_identity_current_active_test_identity_separation_combined_green_boundary_contract_reconciliation
title: "NLS v3 Step 11 Cycle 001 Recovery Epoch002 Post-D2 actual S1 historical identity / current active test identity separation and successor combined-GREEN publication-boundary contract reconciliation"
revision_date: "2026-07-28"
status: "READ_ONLY_CONTRACT_RECONCILIATION_DESIGN_FROZEN_AUTHORITY_STOP"
authority_token: "NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_POST_D2_ACTUAL_S1_HISTORICAL_IDENTITY_AND_CURRENT_ACTIVE_TEST_IDENTITY_SEPARATION_SUCCESSOR_COMBINED_GREEN_PUBLICATION_BOUNDARY_CONTRACT_RECONCILIATION_READ_ONLY"
body_free: true
automatic_progression: false
---

# 0. Decision

This body-free read-only design separates two identities that currently share
one repository path but have different temporal roles:

1. the immutable historical test-file identity embedded in the published S1
   causal-RED result; and
2. the current active successor-contract test-file identity represented by
   the final mashos-api source closure and success-contract test manifest.

They MUST NOT be required to match.

The historical S1 identity is validated against the exact published S1
artifact and its external identity. The current active test identity is
validated independently through the current successor source closure and
success-contract test manifest. The successor combined-GREEN exact16 is the
bridge: it binds the historical S1 logical hash and the current source
commit/tree/closure/test-manifest identities in one postverified artifact.
Its ordered `test_node_ids` MUST exact-match the independently reconstructed
success-contract manifest; length and uniqueness alone are insufficient.

This authority freezes the reconciliation design only. It changes no
mashos-api source, test, fixture, schema, runtime, sample, dependency, API, DB,
RN, public response, credential, or historical artifact. It does not run
pytest. It does not calculate or publish final exact20, combined-GREEN exact16,
or completion exact13 bytes.

Fixed result:

```text
ACTUAL_S1_HISTORICAL_IDENTITY_AND_CURRENT_ACTIVE_TEST_IDENTITY_ROLES_SEPARATED
OWNER_AND_INDEPENDENT_VERIFIER_REMEDIATION_SURFACE_FROZEN
SUCCESSOR_COMBINED_GREEN_PUBLICATION_BOUNDARY_FROZEN
MASHOS_API_CHANGE_COUNT_0
TEST_EXECUTION_COUNT_0
COMBINED_GREEN_NOT_PUBLISHED
SUCCESSOR_COMPLETION_NOT_PUBLISHED
AUTOMATIC_PROGRESSION_FALSE
AUTHORITY_STOP
```

# 1. Completion-purpose connection

The governing product purpose remains the supplied NLS v3 Detailed Design:
EmlisAI must return the user's input in a form that feels read, without
inventing unsupported causes, personality, diagnosis, intent, or future
claims. Step 11 evidence must therefore be causally reliable; a synthetic
fixture that passes while the published predecessor is rejected cannot
support Cycle 001 completion.

This reconciliation is necessary because the next successor-completion
receipt must bind:

```text
immutable actual S1 causal RED
+ current repaired successor source and active exact110 contract
+ postverified successor combined GREEN
```

Without this separation, the independent verifier rejects the real historical
predecessor while the active test suite proves only a synthetic current-file
substitute. Issuing exact13 in that state would turn a fixture gap into a
formal completion claim.

# 2. Governing sources and fixed entry

## 2.1 Repository entry

```text
Cocolon:
MassyuRed/Cocolon main
841ed0a2762f5ad55aa8f880537262d7333d2767

mashos-api:
MassyuRed/mashos-api main
05e63ae05bb91f94725b0e6ef37a5bd9a76bcd8b
```

The current GitHub reflection method and completion test are owned only by:

```text
Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md
# CURRENT_NORMATIVE_CONTRACT
```

Specific SSH keys, expected-old CAS, direct-child commits, a single commit,
whole-repository verification, full-recursive postfetch, and durable-store
capability are not GitHub-reflection prerequisites.

## 2.2 Product and execution context supplied locally

```text
NLS v3 Revised Cycle Detailed Design SHA-256:
6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc

long-term roadmap SHA-256:
04fb9e4e11af2b1530d03d95d8e959ba644503722f72094a289bde1d4368ce5b

supplied historical Execution and Closure Plan SHA-256:
31682e71ac047ac5f2f329d62ebc51b471bdcb00430a6ab35bcfb934c1438ca7
```

These locally supplied documents provide the product purpose, Step 11
acceptance boundaries, exact100 / exact110 denominator separation, privacy
boundary, RED-before-implementation rule, no case-specific repair rule, and
no-automatic-progression rule. Current operational identity and later
corrections are taken from current GitHub, not from historical pins embedded
in those supplied copies.

## 2.3 Governing current Cocolon evidence

```text
Parent Addendum:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2SourceBaselineEligibilitySuccessorAndSuccessOwnerFormalParentContinuation_ParentAddendum_ReadOnly_20260726.md
Git blob:
8016eeb3e2731dc837423e48497d424b01ab34d4

current GitHub-reflection correction:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_GitHubReflectionContractCorrection_20260727.md
Git blob:
762e146e80890d01c6d8ba5a9aa4bca14f99be40
```

The Parent Addendum retains historical D2 and S1 as immutable ancestor
evidence, requires a postverified successor combined-GREEN result, defines the
source-closure exact20 as a semantic object, and defines completion exact13 as
the body-free publication receipt. This design does not amend that parent.

# 3. Confirmed facts

## 3.1 Actual published S1 identity

```text
artifact path:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2_Successor_RED_Result_20260726.json

publication commit:
a45a958cab1a5e1d052e6b470dd26d8e19764b7b

artifact Git blob:
fa2ac8978294e9eb92211147c09989ae7583455e

artifact raw SHA-256:
f03bf71f267813d25664ceacd1344d74fb354156a9c65b19c14a3c7f315e4c03

artifact logical receipt SHA-256:
7b3b6d0890038642d69feb18e46630fbf97a5918fe0e95db766b8c8175e2d179

artifact external identity SHA-256:
1504bf4f58ca02b76df7f0a9fd6f88a429b01a56c59b7a9082648a25fb3614b4

state:
SUCCESSOR_CAUSAL_RED_FROZEN

counts:
successor_node_count 64
collected 64
failed 64
passed 0
collection_errors 0
```

The S1 artifact embeds:

```text
successor test path:
ai/tests/test_emlis_nls_v3_recovery_epoch002_post_d2_success_owner_graph_and_formal_parent_continuation_red.py

historical test Git blob:
1616de8b9f738b7037b6e18a64113280fa6ec478

historical test raw SHA-256:
3e5cdcd5c2cd2113f273f6cc1a43ff09bdd4845b14cd7aea49237d26cfc0753b
```

Those bytes are historical S1 evidence. They are not an alias for the same
path at a later mashos-api commit.

## 3.2 Current active successor-contract test identity

At the fixed mashos-api entry, the same path has:

```text
current active test Git blob:
a57e7e4b20acf28b6b997a2317a4d16f9bcbaa0a

current active test raw SHA-256:
361384b49dfa9aba98489b23159ade1e9196ca1ec8f81d5d79996d7ae9e8c587
```

Therefore:

```text
historical S1 test identity != current active test identity
```

This inequality is expected after later test changes. It is not evidence that
the published S1 bytes changed.

## 3.3 Current owner / independent disagreement

Current production paths:

```text
owner:
ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py
Git blob:
933d8bcbbb50e997c119b33f554e68bb3599cb36

independent verifier:
ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py
Git blob:
3015e656b0ded5cfa3a392a16925050a51236bbb
```

Confirmed behavior from source inspection:

- the owner checks S1 state, source-entry identity, counts, logical receipt,
  external identity, and postfetch, but does not require the published
  historical `successor_test_file` identity;
- the independent verifier resolves the S1 test path against the current live
  mashos-api file and requires the historical artifact to equal that current
  identity;
- the active exact64 fixture synthesizes S1 from
  `_source_file_identity(_THIS_PATH)`, so it tests the current identity instead
  of the actual published S1 identity; and
- the owner requires combined-GREEN `test_node_ids` to equal the fixed ordered
  exact110 contract nodes, while the independent completion verifier checks
  only length 110, uniqueness, executed-list equality, and outcome-key order.
  It does not directly compare those nodes with its independently
  reconstructed success-contract manifest.

Read-only owner/independent evaluation of actual S1 therefore yields:

```text
owner issue codes:
exact0

independent issue codes:
SUCCESSOR_COMPLETION_EVIDENCE_BINDING_INVALID
```

Current exact110 GREEN does not disprove this gap because the baseline fixture
does not use the published S1 bytes.

The combined-GREEN node-list gap is also not disproved by current exact110:
the fixture supplies the expected list and does not include a fully coherent
non-manifest exact110 substitution.

## 3.4 Missing future publications

At the fixed Cocolon entry, both future targets are absent:

```text
combined-GREEN exact16:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2_Successor_GREEN_Result_20260726.json

successor completion exact13:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2SourceBaselineEligibilitySuccessorCompletion_BodyFree_Receipt_20260726.json
```

The source closure exact20 is a canonical semantic object. It is not a third
publication file.

# 4. Reconciliation: identity roles

## 4.1 Historical S1 identity owner

The historical branch MUST validate exact published facts, including:

```text
S1 exact keyset and schema
S1 authority token
source-entry commit/tree
historical successor-test path/blob/raw
64 / 64 failed / 0 passed / 0 collection errors
owner and independent issue codes exact0
state SUCCESSOR_CAUSAL_RED_FROZEN
body_free true
automatic_progression false
logical receipt hash
actual external identity
actual complete postfetch evidence
```

The fixed historical test identity is:

```text
path:
ai/tests/test_emlis_nls_v3_recovery_epoch002_post_d2_success_owner_graph_and_formal_parent_continuation_red.py

git_blob_sha1:
1616de8b9f738b7037b6e18a64113280fa6ec478

raw_sha256:
3e5cdcd5c2cd2113f273f6cc1a43ff09bdd4845b14cd7aea49237d26cfc0753b
```

No owner or verifier may replace these values by reading the current file at
that path.

## 4.2 Current active test identity owner

The current active test identity is owned by the successor source closure and
the `success_contract_test_manifest`. It is calculated from the final
mashos-api source commit/tree used for targeted GREEN.

It MUST:

- identify the active exact64 test file at the final source commit;
- preserve historical exact46 plus successor exact64 as exact110 ordered node
  IDs;
- bind its current file blob/raw identity into the success-contract manifest;
- contribute to `success_contract_test_manifest_sha256`;
- contribute to the source-closure exact20 hash; and
- be bound by combined-GREEN exact16.

It MUST NOT:

- overwrite or reinterpret the historical S1 artifact;
- be required to equal the historical S1 test blob/raw; or
- turn a current synthetic fixture into the historical S1 publication.

## 4.3 Bridge between historical RED and current GREEN

The successor combined-GREEN exact16 is the only allowed bridge:

```text
historical actual S1 logical hash
        +
current successor source commit/tree
        +
current source-closure exact20 hash
        +
current success-contract manifest hash
        +
exact110 ordered executed/PASSED outcomes
        +
owner issue codes exact0
        +
independent issue codes exact0
```

The completion exact13 then binds the historical S1 logical hash, the
postverified combined-GREEN logical hash, and the source-closure exact20 hash.

# 5. Frozen remediation surface

The complete functional correction surface is exact3 across two separately
approved stages.

## 5.1 RED-freeze stage: test exact1

```text
ai/tests/test_emlis_nls_v3_recovery_epoch002_post_d2_success_owner_graph_and_formal_parent_continuation_red.py
```

No new top-level `test_` function is added.

The existing:

```text
test_c09_completion_receipt_red_green_bound
```

is extended internally.

Positive contract:

```text
fixture S1 == actual published S1 artifact
fixture S1 test identity == historical fixed identity
fixture S1 test identity != current _source_file_identity(_THIS_PATH)
fixture S1 logical/external identity == actual published S1
owner accepts actual S1 chain
independent verifier accepts actual S1 chain
```

Negative contract:

1. replace only the historical S1 embedded test identity with the current
   active test identity;
2. recalculate the S1 logical receipt, external identity, and postfetch;
3. bind the new RED logical hash into combined GREEN;
4. recalculate combined-GREEN logical receipt, external identity, and
   postfetch;
5. recalculate completion and the dependent
   admission/allocation/Event1 chain; and
6. require both owner and independent verifier to reject the fully coherent
   forgery with:

```text
SUCCESSOR_COMPLETION_EVIDENCE_BINDING_INVALID
```

This coherent rebinding is required so the negative cannot pass merely because
of an unrelated stale hash.

Combined-GREEN manifest-parity negative:

1. keep exact110 length, uniqueness, execution equality, all-PASSED outcomes,
   counts, source closure hash, and manifest hash;
2. replace one ordered `test_node_id` by a unique non-manifest node;
3. rebuild `executed_node_ids` and `outcome_states` to the substituted list;
4. recalculate combined-GREEN receipt, identity, postfetch, completion, and
   dependent chain; and
5. require both owner and independent verifier to reject with
   `SUCCESSOR_COMPLETION_EVIDENCE_BINDING_INVALID`.

This isolates the requirement that exact16 nodes equal the active
success-contract manifest, rather than merely forming some unique list of
length 110.

Denominators remain:

```text
historical contract nodes:
46

successor contract nodes:
64

combined:
110
```

The RED-freeze authority records the current implementation failure without
changing production.

## 5.2 Implementation stage: production exact2

Only after a separate implementation authority:

```text
ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py
ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py
```

Owner correction:

- validate the full exact historical S1 keyset/schema/authority;
- validate the fixed historical test path/blob/raw;
- validate the actual S1 logical and external identity;
- reject any different self-consistent RED predecessor; and
- do not compare historical S1 against the current file.

Independent correction:

- remove the current-live-file equality check from the historical S1 branch;
- duplicate the historical constants independently;
- do not import the owner semantic constant as the independent source of
  truth;
- preserve `_success_source_identity` for current manifest and verifier-source
  checks where current identity is the intended role; and
- reconstruct the current success-contract manifest independently and require
  combined-GREEN `success_contract_test_manifest_sha256` and ordered
  `test_node_ids` to exact-match it, rather than checking only length and
  uniqueness; and
- return the same closed issue code for a non-historical S1 predecessor.

No canonical-current-closure owner change is required: current active test
identity is already recalculated into the current manifest.

# 6. GREEN and publication boundary

After RED freeze and the separately approved production correction:

1. run targeted C09;
2. run current successor exact64;
3. run historical exact46 plus current exact64 as exact110;
4. on the final mashos-api source commit, calculate the source-closure exact20
   semantic object and success-contract manifest;
5. construct combined-GREEN exact16 from that final source and actual S1;
6. publish exact16 to its fixed Cocolon path;
7. refetch exact16 and derive its actual publication commit, blob, raw,
   logical, external identity, and complete postfetch evidence;
8. construct exact13 using the exact20 semantic hash, actual S1 logical hash,
   and postverified exact16 logical hash;
9. publish exact13 to its fixed Cocolon path;
10. refetch exact13 and perform owner plus independent end-to-end
    postverification; and
11. stop with automatic progression false.

Fixed exact16 schema:

```text
cocolon.emlis.nls_v3.recovery_epoch002.post_d2_successor_targeted_green_result.v1
```

Strict exact16 keys:

```text
schema_version
causal_red_evidence_sha256
successor_source_commit_sha1
successor_source_tree_sha1
successor_source_closure_sha256
success_contract_test_manifest_sha256
test_node_ids
executed_node_ids
outcome_states
counts
owner_issue_codes
independent_issue_codes
state
automatic_progression
body_free
receipt_sha256
```

Fixed exact16 target:

```text
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2_Successor_GREEN_Result_20260726.json
```

Fixed exact13 target:

```text
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2SourceBaselineEligibilitySuccessorCompletion_BodyFree_Receipt_20260726.json
```

No final exact20, exact16, or exact13 hash is frozen in this read-only design.
All depend on the final post-remediation mashos-api source and/or actual
Cocolon publication identity.

# 7. Position correction

prior position:

```text
The current exact110 GREEN and current-source-derived S1 fixture are sufficient
to proceed directly to exact20 / exact13 issuance, and a unique exact110 GREEN
node list is sufficient for independent completion verification.
```

proposed position:

```text
The actual published S1 predecessor must be accepted by both owner and
independent verifier, while a coherently rebound current-test substitute must
be rejected by both, before combined-GREEN exact16 or exact13 may be issued.
```

change basis:

1. actual S1 embeds historical test blob/raw `1616de8... / 3e5cdcd...`;
2. current active test is `a57e7e4... / 361384b...`;
3. independent verifier compares the historical branch with the live current
   file;
4. owner lacks an exact historical test-identity check; and
5. current fixture synthesizes S1 from the live current file and therefore
   masks both historical-identity defects; and
6. independent combined-GREEN verification does not compare the ordered
   exact110 nodes with its own reconstructed current manifest.

correction:

```text
DIRECT_EXACT20_EXACT13_ISSUANCE_FROM_CURRENT_SYNTHETIC_S1_FIXTURE:
NOT_AUTHORIZED

ACTUAL_S1_HISTORICAL_IDENTITY_CURRENT_ACTIVE_TEST_IDENTITY_SEPARATION:
REQUIRED

COMBINED_GREEN_EXACT16_PUBLICATION_BEFORE_EXACT13:
REQUIRED

INDEPENDENT_EXACT16_ORDERED_EXACT110_MANIFEST_PARITY:
REQUIRED
```

This is not a Parent Addendum mutation. It reconciles current implementation
with the existing immutable-history and successor-GREEN contract.

# 8. Current approved change scope

This read-only checkpoint changes only:

```text
add:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2_ActualS1Identity_CurrentActiveTestIdentitySeparation_CombinedGreenBoundary_ContractReconciliation_Design_ReadOnly_20260728.md

add:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2_ActualS1Identity_CurrentActiveTestIdentitySeparation_CombinedGreenBoundary_ContractReconciliation_Handoff_20260728.md

append:
Cocolon_前提資料/07_latest_snapshot_diff.md
```

It does not modify the tracked Execution and Closure Plan, create a separate
receipt/result, or update a manifest. The approved scope explicitly limits
reflection to the design, handoff, and minimal current pointer.

# 9. Forbidden work

Under this authority:

- no mashos-api source/test/fixture change;
- no test execution;
- no historical S1, D2, Parent Addendum, or GitHub-reflection-contract rewrite;
- no exact20 standalone JSON publication;
- no combined-GREEN exact16 publication;
- no exact13 publication;
- no candidate, Event1, readiness, reservation, exact134, terminal, accepted,
  Step00..10, all11, manifest, Event2, P2, Cycle acceptance, or actual-device
  work;
- no user credential, key, token, secret, or private-body request; and
- no automatic progression.

# 10. Completion and next authority

This read-only design is complete when the exact3 Cocolon paths in section 8
are present, content-matched, changed-path verified, and included in current
Cocolon main.

Exactly one next authority:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_POST_D2_ACTUAL_S1_HISTORICAL_IDENTITY_AND_CURRENT_ACTIVE_TEST_IDENTITY_SEPARATION_SUCCESSOR_COMBINED_GREEN_EXACT110_MANIFEST_PARITY_AND_PUBLICATION_BOUNDARY_CONTRACT_RECONCILIATION_RED_FREEZE_ONLY
```

That next authority is separate approval required. Its only write target is
the current exact64 successor-contract test file. It freezes actual-S1 positive
and coherent-current-identity negative evidence, records the causal RED, and
ends at authority STOP without production changes.
