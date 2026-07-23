---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch001_step5_cross_role_bound_selected_intersection_content_depth_only_red_correction_refreeze
revision_date: "2026-07-23"
authority: "NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_BOUND_SELECTED_INTERSECTION_AND_CONTENT_DEPTH_ONLY_CONTRACT_RECONCILIATION_RED_CORRECTION_AND_REFREEZE_ONLY"
status: "BOUND_SELECTED_INTERSECTION_CORRECTED_AND_CAUSAL_RED_REFROZEN_AUTHORITY_STOP"
body_free: true
automatic_progression: false
---

# Step 5 bound-selected / CONTENT_DEPTH_ONLY RED correction and refreeze

## 1. Result

The approved test-only correction is reflected and the lineage-aware causal
RED is refrozen.

```text
BOUND_SELECTED_INTERSECTION_REMOVED
ROLE_LOCAL_BOUND_OBLIGATION_PRESENCE_PRESERVED
REQUIRED_BOUND_SELECTION_PRESERVED
ACTIVE_ROLE_POLICY_PRESERVED
CONTENT_DEPTH_ONLY_TEST_CONTRACT_RESTORED
AUTHORITATIVE_EXACT7_REFROZEN
7_COLLECTED
1_LINEAGE_SURFACE_PASS
6_CAUSAL_FAIL
0_ERROR
0_UNEXPECTED
TEST_EXACT2_CHANGED
SOURCE_EXACT3_CHANGE_COUNT_0
PROTECTED_SURFACE_CHANGE_COUNT_0
IMPLEMENTATION_NOT_AUTHORIZED
GREEN_NOT_RUN
SUCCESSFUL_STEP0_10_COMPLETION_RECEIPT_COUNT_0
SOURCE_BASELINE_UNLOCKED
FRESH_BATCH_RESERVED_NOT_CREATED
CYCLE001_NOT_ACCEPTED
AUTHORITY_STOP
```

## 2. Entry and evidence identity

Authority entry:

```text
Cocolon main:    d5892abc8ee50619e6d751f2e191c8a21cc0eff0
mashos-api main: f2e73dfcc0b1f0091f077c41afbf9110e4b1b333
RELATED_DRIFT_0
```

Immediately before the Cocolon evidence write:

```text
Cocolon main:    d5892abc8ee50619e6d751f2e191c8a21cc0eff0
mashos-api main: 4abc06bc544709f359ad4984357af0cd60fe083f
AUTHORIZED_MASHOS_API_ADVANCE_ONLY
UNRELATED_DRIFT_0
```

Required predecessor evidence:

- current authority blob:
  `d15439587bd1a795f51b90fe7e65ca47bee0ff97`
- Execution and Closure Plan blob:
  `eb72ef4dc0833173efa8f7e16a0a15a6a71ba029`
- bound-selected reconciliation result / receipt / handoff:
  `1d5a91eb0d2f46563c54fc68f12b8f154f5ae2f3`,
  `3842046ec8d07cf1cfafb980bd1a1336445aff99`,
  `d1dbb6c199486ad5c95f13b18142fec875e199b9`
- latest implementation/GREEN STOP result / receipt / handoff:
  `8c5254e267d9bddf10f681784ae0a901e2d4122f`,
  `a75164968cc49a073c0f1413792c4205c041a9a7`,
  `352ba688754e15e11cdd354623c2c84aff91d72e`
- parent-design addendum / receipt / handoff:
  `df8d2e49287554b3da2867afde634b3afbec4a37`,
  `fdb64ba8ddab5b050556eb8025b77fd026c7aa50`,
  `ed9f5725ebd843bd258ef767dd0b7a7b74df8277`
- predecessor causal RED receipt:
  `e78d528600fef27ce3de52ef91c1118d6866d2ed`
- Detailed Design SHA-256:
  `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc`

Detailed Design §7.5, §8.2, §9.1, §9.2, Step 5 STOP, §22.1,
§22.5, and §22.6 remain unchanged.

## 3. mashos-api result identity

Result head and atomic commit:

```text
4abc06bc544709f359ad4984357af0cd60fe083f
test(nls-v3): refreeze Step 5 depth-only selection boundary
```

GitHub compare from entry to result is `ahead_by 1`, `behind_by 0`, with
exactly two modified paths:

| path | predecessor blob | result blob | predecessor SHA-256 | result SHA-256 |
|---|---|---|---|---|
| `ai/tests/test_emlis_nls_v3_s5_content_selection_stage_context.py` | `7886477ff74ab10eb761fc1a5273e2b99f52fce0` | `f2e702a75c2294d689e3f55a6b7b7b8da149fa2a` | `31a8238d0c55f6e88e7e94cf2fae06f454c27de5ecceecf56f12c25beb574469` | `cb55178ca5df4746074b7d1c242d46463c5335d7d0a7962900933e5c11cf62f9` |
| `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py` | `4c295bab09965194608947585da559198b5a3e2b` | `51454fe9d1f0f6267d04e5f9872689be0072bed7` | `20b006716cbcb959020e9fc7e77be6c34de0a4d474bd5e8e5093f6d2eb28cc0f` | `0ddbe5c7e1aef2f56276775694e0b016c5902e367fa1de98e7848cc6ab6e3cb1` |

No other mashos-api path changed.

## 4. Corrected S5 assertion

The frozen selected-intersection expression was replaced with:

```python
assert all(
    bound_ids
    for bound_ids in bound_obligation_ids_by_role.values()
)
```

Only ` & selected` was removed.

The corrected assertion proves that each endpoint role has at least one
role-local obligation representation.  It does not make a depth-only witness
select an optional obligation.

The following surrounding proofs remain unchanged:

- each binding endpoint resolves to non-reception obligation rows;
- all bound rows have the exact endpoint source role;
- original/supplemental bound-obligation sets are disjoint;
- every required bound obligation remains selected;
- global required coverage is 100%;
- original and supplemental nonstance roles remain active;
- original reception target/control owner remains original;
- safety/must-separate closure remains outside witness bindings;
- unmatched nucleus/relation/unknown and their policy expectations remain
  distinct;
- depth equality/floor, determinism, effect scope, lineage, hash, tamper, and
  body-free guards remain intact.

No parent-design amendment or source workaround was introduced.

## 5. Recovery lineage refreeze

The recovery authority/surface node now binds:

- the bound-selected read-only reconciliation authority and entry heads;
- this RED correction/refreeze authority and entry heads;
- the current-authority / Execution Plan / result / receipt / handoff blobs;
- the latest parent-test STOP evidence;
- the rule
  `EACH_ROLE_BOUND_OBLIGATION_SET_NONEMPTY_AND_SELECTED_INTERSECTION_NOT_REQUIRED`;
- the correction changed-path exact2 and its disjointness from source exact3.

It preserves unchanged:

- the exact7 node identities and order;
- RED expectation `1 lineage pass / 6 causal fail`;
- implementation expectation `7 pass`;
- source exact3 historical predecessor identities;
- semantic/S4 tests and the full Step 5 test/source/protected sets;
- schema, proof, negative-code, cardinality, and tamper contracts.

## 6. Authoritative exact7

Selected nodes:

1. recovery authority / surface / lineage
2. semantic owner direct
3. semantic owner recovery
4. Inventory owner direct
5. Inventory owner recovery
6. Content Selection consumer direct
7. Content Selection consumer recovery

Observed result:

```text
COLLECTED_7
LINEAGE_SURFACE_PASSED_1
CAUSAL_FAILED_6
ERROR_0
UNEXPECTED_0
WARNING_1_KNOWN_NON_CAUSAL_PYDANTIC_DEPRECATION

RECOVERY_EPOCH001_S5_CROSS_ROLE_SEMANTIC_RESTATEMENT_OWNER_NOT_PROVED: 2
RECOVERY_EPOCH001_S5_CROSS_ROLE_REFINED_SNAPSHOT_BINDING_NOT_PROVED: 2
RECOVERY_EPOCH001_S5_CROSS_ROLE_DEPTH_NONINFLATION_NOT_PROVED: 2
```

The one pass is the corrected authority/surface lineage node.  Each owner
failure appears once in its direct test and once in the recovery test.  There
was no collection error, unrelated failure, or unexpected result.

Runner discovery was separated from the selected test result:

```text
PYTEST_RUNNER_CAPABILITY_CHECK_COUNT_3
AUTHORITATIVE_EXACT7_EXECUTION_COUNT_1
SELECTED_TEST_EXECUTION_COUNT_7
REPOSITORY_CHANGE_FOR_RUNNER_SETUP_COUNT_0
```

The first two capability checks found an unavailable system pytest module and
a stale external venv entrypoint.  The third identified an available isolated
dependency path.  None collected a selected test.

Generated local cache files were not included in the GitHub tree.  The GitHub
commit contains only the authorized test exact2.

## 7. Unchanged and protected surface

Verified unchanged after the mashos-api write:

- semantic test blob:
  `49864c6ee6a944c603da21ebd18ba60633e56fb9`
- S4 test blob:
  `3f0bd59facec541d8bad09d1af9410344c753e45`
- source exact3 blobs:
  `d28e2ab3086fa09a62c8dbdb3d887a7bff116c78`,
  `685ff7ccc8f5d7fd04dc9ed301b1649b608a868a`,
  `7172a628f5ecdfb6ba888c36d42a6a62d0d7c22e`
- refined partition blob:
  `fb6f4c299f5e61c6527acc86323a610b416c8e1d`
- artifact contract blob:
  `953d062fa858870e65d96cf03694d68c99003594`
- historical rc0028 policy-pin test blob:
  `17c2fad2d4d2045d19b70300af90872d8f27e0dc`
- unlocked source-baseline manifest blob:
  `e95967eb35e2d24745d6e9f90e687afb1fcc83b6`

No production source, fixture, sample, manifest, API, DB, RN, runtime,
public/shared route, v1 owner, stopped v2, historical receipt, Detailed Design,
or accepted authority history changed.

## 8. Confirmed facts

- Both main heads matched the approved entry identities.
- Required authority, parent, reconciliation, plan, and test evidence was
  available without conflict.
- mashos-api changed only the approved test exact2 in one atomic commit.
- The S5 correction removes only the selected intersection.
- The recovery change is limited to authority/evidence/rule/surface lineage.
- The exact7 produced one lineage pass and six causal failures with zero error
  and zero unexpected result.
- The three stable causal codes each occurred exactly twice.
- Source exact3 and all protected surfaces remained unchanged.
- No case, family, fixture, raw/private body, normalized-text, synonym, or
  expected-surface cue was introduced.

## 9. Inference

- Source exact3 implementation is required to resolve the six causal RED
  nodes, but the tests do not prescribe one internal algorithm.
- The old intersection likely conflated source-role activity with selection
  inside the witness-bound subset.

The second point explains the correction; the frozen parent contract remains
the authority.

## 10. Unconfirmed

- Future source exact3 implementation feasibility.
- Future source blobs / SHA-256 and Inventory policy hash.
- Exact7 GREEN and broad regression.
- Successful Step 0–10 completion, source baseline lock, fresh batch, formal
  exact100, Product Read, correction, B6, and Cycle acceptance.

## 11. Unwritten

- No production source implementation, GREEN, or broad regression is written.
- No successful completion receipt, source-baseline event, later Cycle work,
  or acceptance claim is written.
- No raw input/output, quotation, identifiable paraphrase, individual mapping,
  parsed span, private note, body digest, key, or expected surface is recorded.

## 12. No-guess boundary

- Do not make witness control obligation selection or decision status.
- Do not bind a must-separate incident/affected closure.
- Do not weaken required-bound coverage, active-role proof, unmatched
  preservation, original reception, exact graph bijection, or tamper guards.
- Do not reduce the authoritative denominator to causal exact6.
- Do not rewrite predecessor source hashes as future result hashes.
- Do not predeclare future source or policy hashes.
- Do not change test exact4 or protected surfaces during implementation.
- Do not treat this targeted RED as GREEN, Step completion, baseline lock, or
  Cycle acceptance.

## 13. Karen opinion

Karen judges this exact2 correction to be the smallest honest recovery.  The
S5 test now proves endpoint-role representation without letting a depth-only
witness choose optional content.  The recovery node proves the new contract's
lineage instead of passing on stale evidence.

The six remaining failures are now causal implementation gaps again.  That is
the correct RED state; making them green is a separate source authority.

## 14. Exactly one next separate authority candidate

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_BOUND_SELECTED_INTERSECTION_AND_CONTENT_DEPTH_ONLY_CONTRACT_RECONCILIATION_IMPLEMENTATION_AND_GREEN_ONLY
```

It may modify only the previously frozen source exact3 and run only the
targeted exact7 GREEN under separate approval.  Test exact4, protected
surfaces, broad regression, completion, baseline lock, later Cycle work, and
acceptance remain outside that authority.

STOP.  Separate approval required.
