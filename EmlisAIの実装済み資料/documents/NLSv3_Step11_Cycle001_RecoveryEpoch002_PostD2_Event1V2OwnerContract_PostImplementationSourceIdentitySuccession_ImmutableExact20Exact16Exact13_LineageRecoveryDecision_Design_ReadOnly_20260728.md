---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch002_post_d2_event1_v2_owner_contract_postimplementation_source_identity_succession_immutable_exact20_exact16_exact13_lineage_recovery_decision
title: "NLS v3 Step 11 Cycle 001 Recovery Epoch002 Post-D2 Event1-v2 owner-contract postimplementation source-identity succession and immutable exact20/exact16/exact13 lineage-recovery decision"
revision_date: "2026-07-28"
status: "SOURCE_IDENTITY_LINEAGE_02_RECOVERY_DECISION_DESIGN_FROZEN_AUTHORITY_STOP"
authority_token: "NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_POST_D2_SUCCESSOR_P1_EVENT1_V2_OWNER_CONTRACT_RECONCILIATION_POSTIMPLEMENTATION_SOURCE_IDENTITY_SUCCESSION_IMMUTABLE_EXACT20_EXACT16_EXACT13_LINEAGE_RECOVERY_DECISION_DESIGN_READ_ONLY"
body_free: true
automatic_progression: false
---

# 0. Decision

The published post-D2 source-eligibility chain is retained as valid immutable
historical evidence, but it is not eligible as the current P1 predecessor
after the Event1-v2 owner-contract production change.

The recovery uses one additive operational generation:

```text
SOURCE_IDENTITY_LINEAGE_02
```

It does not overwrite, rename, delete, revoke, or reinterpret the historical
source closure exact20, combined-GREEN exact16, or completion exact13.

The additive generation is frozen as:

1. a new semantic source closure with the existing v1 exact20 schema and
   keyset, calculated only from the final post-reconciliation mashos-api
   source;
2. a new combined-GREEN artifact with the existing v1 exact16 schema and
   keyset at a distinct immutable path; and
3. a new completion v2 exact14 artifact at a distinct immutable path. It adds
   exactly one field,
   `lineage_recovery_decision_external_identity_sha256`, to the historical
   exact13 meaning so the second completion lineage is visibly authorized by
   this separately published recovery decision.

The exact20 and exact16 schemas are not version counters. Their shapes and
meanings do not change, so their v1 schemas remain. The completion meaning
does change: it must bind the authority that permits an additive completion
after the first path became immutable. Therefore only completion advances to
v2 exact14.

This authority freezes design and publishes body-free documentation evidence
only. It changes no mashos-api source, test, fixture, schema, configuration,
dependency, runtime, sample, API, DB, RN, public response, credential, or
private body. It does not run pytest. It does not calculate a final Lineage02
exact20, publish Lineage02 exact16/exact14, issue P1, allocate a candidate, or
publish Event1.

Fixed result:

```text
SOURCE_IDENTITY_LINEAGE_02_RECOVERY_DECISION_DESIGN_FROZEN
HISTORICAL_EXACT20_EXACT16_EXACT13_IMMUTABLE
HISTORICAL_EXACT20_EXACT16_EXACT13_CURRENT_P1_INELIGIBLE
LINEAGE02_EXACT20_V1_SEMANTIC_CONTRACT_FROZEN
LINEAGE02_EXACT16_V1_ADDITIVE_PATH_FROZEN
LINEAGE02_COMPLETION_V2_EXACT14_ADDITIVE_PATH_FROZEN
MASHOS_API_CHANGE_COUNT_0
TEST_EXECUTION_COUNT_0
P1_EVENT1_COUNT_0
AUTOMATIC_PROGRESSION_FALSE
AUTHORITY_STOP
```

# 1. Completion-purpose connection

The supplied Revised Cycle Detailed Design requires Step 11 evidence to prove
the actual source, owner graph, test contract, and result lineage used for the
candidate. EmlisAI's product purpose remains unchanged: return the user's
input in a form that feels read without inventing unsupported cause,
personality, diagnosis, intent, or future claim.

This recovery is necessary because an Event1 publication for source
`c5686aa... / c551f78...` cannot rely on GREEN and completion evidence that
bind source `0205f81... / 677e9c0...`. Treating those identities as
interchangeable would make a historical success claim stand in for a
different active owner implementation.

The recovery is administrative and causal-contract work. It changes no NLS
surface behavior and provides no Product Read or Cycle-acceptance credit.

# 2. Governing sources and fixed entry

## 2.1 Repository entry

```text
Karen-Diary:
MassyuRed/Karen-Diary main
700f749f5149cac1f8bd4bab8a364d524a56985b

Cocolon:
MassyuRed/Cocolon main
14467332c43519fce150d1f5b00b4d7a2d47eb27

mashos-api:
MassyuRed/mashos-api main
c5686aa217c8b2637172ddb76de414bdf837d107

mashos-api tree:
c551f78f8a13703cad343a123a65a18cb03da972
```

The current GitHub-reflection method and completion test are owned only by:

```text
Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md
# CURRENT_NORMATIVE_CONTRACT
```

Specific SSH keys, expected-old CAS, direct-child commits, a single commit,
whole-repository verification, all-unchanged-path verification, full recursive
postfetch, durable-store capability, and Guardian/Issue workflow are not
current GitHub-reflection prerequisites.

## 2.2 Product and execution context supplied locally

```text
NLS v3 Revised Cycle Detailed Design SHA-256:
6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc

long-term roadmap SHA-256:
04fb9e4e11af2b1530d03d95d8e959ba644503722f72094a289bde1d4368ce5b

supplied historical Execution and Closure Plan SHA-256:
31682e71ac047ac5f2f329d62ebc51b471bdcb00430a6ab35bcfb934c1438ca7
```

These documents supply the product purpose, privacy boundary, Step 11
acceptance boundaries, RED-before-implementation order, exact100/exact110
denominator separation, no case-specific repair rule, and
no-automatic-progression rule. Current operational identity and later
corrections come from current GitHub.

## 2.3 Governing current Cocolon evidence

```text
Parent Addendum:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2SourceBaselineEligibilitySuccessorAndSuccessOwnerFormalParentContinuation_ParentAddendum_ReadOnly_20260726.md

Parent Addendum Git blob:
8016eeb3e2731dc837423e48497d424b01ab34d4

Parent Addendum external identity SHA-256:
527eb11a767582a2f86531e34e044dffa9f0ed034af91ef063c3acc33813ba6d
```

Parent Addendum section 5.4 states that, after completion publication, source
or test drift makes that completion ineligible for Event1, its path and bytes
are immutable, and a required repair returns to a separate recovery decision.
This document is that separate decision. It does not mutate the Parent
Addendum.

# 3. Confirmed facts

## 3.1 Historical immutable Lineage01

### Semantic source closure exact20

```text
schema:
cocolon.emlis.nls_v3.recovery_epoch002.post_d2_source_baseline_eligibility_successor_closure.v1

source commit:
0205f81a4719a578f0e188bcfbd164cb9e2abb08

source tree:
677e9c0c4cdfcaf254aa9eb8089cdf3b02a85727

success-contract test manifest SHA-256:
76f4115ce992f1718448aae4e0d2ce6c733c7f2902ffa50776e13833e6163f3c

source-closure SHA-256:
d4156b14eddf5e1f6a13411017bd522784b26e3e67d780203a727cc7cc1aa97f

classification:
IMMUTABLE_HISTORICAL_SUCCESSOR_SOURCE_CLOSURE
INELIGIBLE_FOR_CURRENT_P1_SOURCE
```

The exact20 closure is a semantic object, not a standalone Cocolon
publication file.

### Combined-GREEN exact16

```text
path:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2_Successor_GREEN_Result_20260726.json

publication commit:
ed03af56edefb378f74a0f5a20b08b6ab11abfd8

Git blob:
7d6763d9a2c38b8b3fc40c0e5b15e6328948d75a

raw SHA-256:
7beb737ba6962391df8d3549db0c5a483024d32a4abc52e059f99f89f91267c7

logical receipt SHA-256:
2cca7b1f1ce4586448352cf1041e990cde930d20dba3f2a0b72f09aec9f0414c

external identity SHA-256:
022e1f4014c055325e192f415601f31d890272cf24cbd837faac9dad8f8660d7

source closure:
d4156b14eddf5e1f6a13411017bd522784b26e3e67d780203a727cc7cc1aa97f

ordered node count:
110

classification:
IMMUTABLE_HISTORICAL_GREEN_EVIDENCE
NOT_CURRENT_P1_PREDECESSOR
```

### Completion exact13

```text
path:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2SourceBaselineEligibilitySuccessorCompletion_BodyFree_Receipt_20260726.json

publication commit:
d1629e0e0fe3f04d715caa242aab751c5e62e30b

Git blob:
6dba9d00660f6dbac2013df331f77375a24e4648

raw SHA-256:
f29007bff71e8cc647b3ee18e8e8aaf8a59df841f6dd8ae739eb8544a6b4c98b

logical receipt SHA-256:
7b726c5fd6c7b87546962065a1bea48bdc20ed82a335e068debe828a9237e124

external identity SHA-256:
9213577db07d55c6901494ac2e30b69335c1e5b274079e491ca451aa3281b643

source closure:
d4156b14eddf5e1f6a13411017bd522784b26e3e67d780203a727cc7cc1aa97f

combined GREEN logical:
2cca7b1f1ce4586448352cf1041e990cde930d20dba3f2a0b72f09aec9f0414c

classification:
IMMUTABLE_HISTORICAL_COMPLETION
NOT_CURRENT_P1_ELIGIBILITY
```

All three historical identities remain valid. None is failed, revoked, or
deleted.

## 3.2 Current postimplementation source

The approved Event1-v2 owner-contract implementation changed production
exact4 and produced:

```text
source commit:
c5686aa217c8b2637172ddb76de414bdf837d107

source tree:
c551f78f8a13703cad343a123a65a18cb03da972

current active success-contract test manifest SHA-256:
9a7622d96eef9a86fd6724acbc0e94afdaa63d95b61ae2671bc18df8c4ffcc58

ordered exact110 node count / unique count:
110 / 110

ordered exact110 node-list SHA-256:
da8db0f75db162ca3f4dafc0e60c1348c63c3bbd5cbb5dfc155788eb2c46ac83
```

The production change reconciled sequence owner, atomic publication owner,
public independent verifier, and formal-parent observation for Event1 v2.
It did not publish P1, allocate a candidate, publish Event1, or issue a
replacement completion.

The current active manifest is a design-entry fact, not the future final
Lineage02 manifest. Extending the existing C09 test for the RED freeze will
change test bytes and therefore legitimately recalculate the manifest while
preserving the exact110 node IDs and order.

## 3.3 Current path collision

Current source still fixes the historical exact16 and exact13 paths in the
sequence owner, atomic publication owner, public independent verifier, and
successor exact64 fixture.

Both historical files already exist at those exact paths. A second
publication there would be an overwrite, not an additive recovery.

At the fixed Cocolon entry, the following proposed Lineage02 targets are
absent:

```text
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2_SourceIdentityLineage02_Successor_GREEN_Result_20260728.json

EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2SourceIdentityLineage02_SourceBaselineEligibilitySuccessorCompletion_BodyFree_Receipt_20260728.json
```

# 4. Inferences

## 4.1 A replacement current chain is necessary

The Lineage01 exact16 binds source `0205f81... / 677e9c0...`, closure
`d4156b...`, and test manifest `76f411...`. The current source and manifest
are different. Therefore Lineage01 cannot prove the current P1 source.

The required current proof chain is:

```text
historical D2 and S1 retained
-> published Lineage02 recovery-decision external identity
-> final post-reconciliation source closure exact20
-> exact110 combined GREEN exact16 at the Lineage02 path
-> completion v2 exact14 at the Lineage02 path
-> separate P1 re-entry decision
```

## 4.2 A new path alone is insufficient for completion

A second v1 exact13 at a different filename could bind a different source and
GREEN hash, but its artifact bytes would not identify the separate recovery
decision that permits a second completion lineage after the original path
became immutable.

Adding only
`lineage_recovery_decision_external_identity_sha256` is the smallest
artifact-visible correction. It prevents an unapproved second completion
from looking like another ordinary instance of the original singleton
contract.

## 4.3 Epoch003 is not required

No P1 admission, candidate allocation, Event1, readiness, reservation,
attempt, terminal, accepted chain, or Event2 was created. The source baseline
remains unlocked. An append-only source-identity lineage inside Recovery
Epoch002 can therefore preserve the same historical D2/S1 ancestors without
pretending that an irreversible candidate identity exists.

This is an inference from the current state and the Parent Addendum's
separate-recovery-decision rule. It is not automatic authority to create
Lineage02 artifacts or start P1.

# 5. Karen's opinion and decision basis

The smallest safe design is not to copy the old completion to a new filename.
That would solve the path collision while leaving the reason for the second
lineage outside the artifact that P1 consumes.

The recovery-decision binding belongs only in completion:

- exact20 already identifies the final source and all derived closure roots;
- exact16 already identifies exact20, the active exact110 manifest, ordered
  nodes, execution outcomes, and historical S1; and
- completion is the administrative eligibility artifact consumed by P1.

Changing exact20 or exact16 schemas would add instance metadata to semantic
proofs whose meanings are unchanged. Adding one field to completion records
the new eligibility authority at the point where it is needed.

This design is necessary to avoid both false reuse and unnecessary schema
churn. It preserves every historical identity and creates one explicit,
auditable bridge to the future current-source chain.

# 6. Frozen Lineage02 contract

## 6.1 Recovery-decision receipt

This design is bound by a body-free decision receipt:

```text
path:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2_Event1V2OwnerContract_PostImplementationSourceIdentityLineage02_RecoveryDecision_Design_ReadOnly_BodyFree_Receipt_20260728.json

schema:
cocolon.emlis.nls_v3.recovery_epoch002.post_d2_source_identity_lineage_recovery_decision_design_frozen_receipt.v1

artifact role:
SOURCE_IDENTITY_LINEAGE_RECOVERY_DECISION_DESIGN_FROZEN_RECEIPT
```

Its strict keyset is:

```text
schema_version
authority_token
lineage_generation_id
bound_design_path
bound_design_raw_sha256
historical_source_closure_sha256
historical_combined_green_external_identity_sha256
historical_completion_external_identity_sha256
design_entry_source_commit_sha1
design_entry_source_tree_sha1
state
automatic_progression
body_free
receipt_sha256
```

Required values:

```text
lineage_generation_id = SOURCE_IDENTITY_LINEAGE_02
state = SOURCE_IDENTITY_LINEAGE_02_RECOVERY_DECISION_DESIGN_FROZEN
automatic_progression = false
body_free = true
```

The future completion v2 exact14 binds the published receipt's exact10
external identity SHA-256, not a caller-supplied bare design hash.

## 6.2 Source closure exact20

Schema and exact20 keyset remain:

```text
cocolon.emlis.nls_v3.recovery_epoch002.post_d2_source_baseline_eligibility_successor_closure.v1
```

No Lineage02 source-closure hash is frozen here. It is calculated only after
the RED test bytes and the approved production correction are stable on the
final mashos-api commit/tree.

The calculation must reconstruct every derived field. It may not copy the
Lineage01 closure and replace only commit/tree.

## 6.3 Combined-GREEN exact16

Schema and strict exact16 keyset remain:

```text
cocolon.emlis.nls_v3.recovery_epoch002.post_d2_successor_targeted_green_result.v1
```

The additive immutable target is:

```text
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2_SourceIdentityLineage02_Successor_GREEN_Result_20260728.json
```

It must bind:

```text
historical S1 logical:
7b3b6d0890038642d69feb18e46630fbf97a5918fe0e95db766b8c8175e2d179

final Lineage02 source commit/tree
final Lineage02 exact20 source-closure hash
final Lineage02 success-contract manifest
historical46 + successor64 ordered exact110 node IDs
exact110 executed/PASSED outcomes
owner issue codes exact0
independent issue codes exact0
automatic_progression false
body_free true
```

## 6.4 Completion v2 exact14

Schema:

```text
cocolon.emlis.nls_v3.recovery_epoch002.post_d2_source_baseline_eligibility_successor_completion_receipt.v2
```

Strict exact14 keyset:

```text
schema_version
logical_cycle_id
recovery_epoch_id
historical_d2_final_closure_sha256
historical_d2_completion_receipt_identity_sha256
parent_addendum_external_identity_sha256
lineage_recovery_decision_external_identity_sha256
successor_source_closure_sha256
causal_red_evidence_sha256
combined_green_evidence_sha256
state
automatic_progression
body_free
receipt_sha256
```

The additive immutable target is:

```text
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2SourceIdentityLineage02_SourceBaselineEligibilitySuccessorCompletion_BodyFree_Receipt_20260728.json
```

Required values:

```text
lineage_recovery_decision_external_identity_sha256 =
published Lineage02 recovery-decision receipt external identity SHA-256

state = SUCCESSOR_SOURCE_BASELINE_ELIGIBILITY_PROVED
automatic_progression = false
body_free = true
```

All other semantic bindings retain their exact13 meaning. The new receipt
must bind the final Lineage02 exact20, historical S1, and postverified
Lineage02 exact16.

# 7. RED and implementation boundary

## 7.1 Next RED-freeze stage

The existing successor test file is the only allowed mashos-api write:

```text
ai/tests/test_emlis_nls_v3_recovery_epoch002_post_d2_success_owner_graph_and_formal_parent_continuation_red.py
```

The existing top-level:

```text
test_c09_completion_receipt_red_green_bound
```

is extended in place. No top-level test node is added, removed, renamed, or
reordered.

The RED contract freezes:

1. the full historical exact20/exact16/exact13 identities as immutable and
   current-ineligible;
2. both Lineage02 paths as distinct and additive;
3. the recovery-decision exact10 external identity;
4. a coherent current-source exact20 -> Lineage02 exact16 -> completion v2
   exact14 positive chain;
5. rejection of historical-path overwrite;
6. rejection of Lineage01 exact20/exact16/exact13 as the current P1 chain;
7. rejection of old/new mixed closure, GREEN, completion, and decision
   bindings; and
8. unchanged historical46 plus successor64 ordered exact110 node IDs.

The expected sole RED is that current production still requires the
historical completion schema/path and historical GREEN path.

Expected denominator:

```text
targeted C09:
1 failed

successor exact64:
63 passed / 1 failed

historical exact46:
46 passed

combined ordered exact110:
109 passed / 1 failed

ordered node count / unique count:
110 / 110

ordered node-list SHA-256:
da8db0f75db162ca3f4dafc0e60c1348c63c3bbd5cbb5dfc155788eb2c46ac83
```

The success-contract manifest hash is expected to change because the existing
C09 test bytes change. It must be recomputed; `9a7622...` is not frozen as the
future Lineage02 value.

## 7.2 Later implementation stage

Only after a separate implementation authority, the minimum production
surface is:

```text
ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py
ai/tools/emlis_nls_v3_recovery_epoch002_atomic_publication_bundle_v3.py
ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py
```

Required changes:

- retain the historical schemas, paths, and identities as immutable history;
- make Lineage02 exact16/completion paths the only current operational
  targets;
- accept completion v2 exact14 for the current chain;
- require the exact frozen recovery-decision external identity;
- reject a bare decision hash, old-path substitution, and old/new mixed
  lineage;
- preserve independent-verifier import separation; and
- leave formal parent and preflight unchanged unless the RED proves a direct
  source-level incompatibility. They consume the corrected owner/verifier
  contract and are not pre-authorized write targets.

The implementation stage ends after targeted C09, successor exact64,
historical exact46, and combined exact110 GREEN. It does not calculate or
publish Lineage02 exact20/exact16/exact14.

## 7.3 Final-source publication stage

Only after a separately approved publication authority:

1. freeze the final mashos-api commit/tree;
2. reconstruct the semantic exact20 and all derived roots;
3. run and preserve the exact110 ordered GREEN evidence;
4. publish Lineage02 exact16 at its absent target;
5. refetch and postverify its content, blob, raw, logical, external identity,
   write-commit changed path, and current-main containment;
6. construct completion v2 exact14 using the published recovery-decision
   external identity and postverified Lineage02 exact16 logical identity;
7. publish exact14 at its absent target;
8. refetch and independently postverify the complete chain; and
9. stop with automatic progression false.

No mashos-api change may occur between final exact20 calculation and the
Lineage02 exact16/exact14 evidence it binds.

# 8. Current approved reflection scope

This read-only checkpoint changes only:

```text
add:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2_Event1V2OwnerContract_PostImplementationSourceIdentitySuccession_ImmutableExact20Exact16Exact13_LineageRecoveryDecision_Design_ReadOnly_20260728.md

add:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2_Event1V2OwnerContract_PostImplementationSourceIdentityLineage02_RecoveryDecision_Design_ReadOnly_BodyFree_Receipt_20260728.json

add:
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2_Event1V2OwnerContract_PostImplementationSourceIdentitySuccession_ImmutableExact20Exact16Exact13_LineageRecoveryDecision_Handoff_20260728.md

append:
Cocolon_前提資料/07_latest_snapshot_diff.md
```

The tracked Execution and Closure Plan is not changed. Current navigation is
recorded by the new design/receipt/handoff and the minimal latest-snapshot
append.

# 9. Forbidden work

Under this authority:

- no mashos-api source, test, fixture, schema, configuration, dependency, or
  lock change;
- no test execution or final exact20 calculation;
- no overwrite, rename, delete, reissue, or mutation of historical
  exact20/exact16/exact13, D2, S1, Parent Addendum, or prior receipts;
- no Lineage02 exact16 or completion v2 exact14 publication;
- no P1 admission, candidate allocation, Event1, readiness, reservation,
  formal exact134, terminal, accepted, Step00..10, all11, manifest, Event2,
  P2, Product Read, Cycle acceptance, or actual-device work;
- no revival of retired Git transport or durable-store prerequisites;
- no credential, key, token, secret, or private-body request; and
- no automatic progression.

# 10. Completion and next authority

This design is complete when the exact4 Cocolon paths in section 8 are
present, content-matched, changed-path verified, and contained by current
Cocolon main. The Lineage02 exact16/exact14 targets remain absent.

Exactly one next authority:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_POST_D2_SUCCESSOR_SOURCE_IDENTITY_LINEAGE02_EXACT20_EXACT16_AND_COMPLETION_V2_EXACT14_IMMUTABLE_PREDECESSOR_BINDING_RECONCILIATION_RED_FREEZE_ONLY
```

That authority is separate approval required. It may extend only existing C09
in the existing successor exact64 test file, execute the scoped causal RED,
record the result, and stop. It may not change production or publish
Lineage02 exact20/exact16/exact14, P1, or Event1.
