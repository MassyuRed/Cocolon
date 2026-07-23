---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch001_step5_cross_role_positive_binding_cardinality_green_denominator_reconciliation
revision_date: "2026-07-23"
authority: "NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_POSITIVE_BINDING_CARDINALITY_ASSERTION_AND_GREEN_DENOMINATOR_RECONCILIATION_READ_ONLY"
status: "BINDING_CARDINALITY_AND_GREEN_DENOMINATOR_RECONCILED_AUTHORITY_STOP"
body_free: true
automatic_progression: false
---

# Step 5 positive binding cardinality / GREEN denominator reconciliation

## 1. Result

This read-only authority reconciles the immutable-test cardinality conflict and
the postimplementation GREEN denominator without changing parent design,
production source, or tests.

```text
BINDING_CARDINALITY_ASSERTION_RECONCILED
POSTIMPLEMENTATION_GREEN_EXACT7_FROZEN
SOURCE_HASH_LINEAGE_RECONCILED
PARENT_DESIGN_UNCHANGED
MASHOS_API_CHANGE_COUNT_0
TEST_CHANGE_COUNT_0
TEST_RUN_COUNT_0
IMPLEMENTATION_NOT_AUTHORIZED
GREEN_NOT_RUN
SUCCESSFUL_STEP0_10_COMPLETION_RECEIPT_COUNT_0
SOURCE_BASELINE_UNLOCKED
FRESH_BATCH_RESERVED_NOT_CREATED
CYCLE001_NOT_ACCEPTED
AUTHORITY_STOP
```

## 2. Entry identity and evidence chain

Heads at authority entry and immediately before evidence write:

```text
Cocolon main:    ad8095d2e3e8ed6eb642bb5f4c014484edbb608e
mashos-api main: d9a65dc7d5ee329ba3387c8659f435f3fb9f8e8d
RELATED_DRIFT_0
```

Required body-free evidence:

- current authority blob:
  `389d7dcb487c71a5a1a3ee755e819cb2ec314c1c`
- Execution and Closure Plan blob:
  `a2f63dba0338f51ee670688e0a582d6f018fc9cf`
- latest implementation/GREEN STOP result / receipt / handoff blobs:
  `75c32197055cef81b160636e75a382a378c0e6d3`,
  `102a3299f4f5d1967eed33252925ba1c62448e12`,
  `867c8bb275431adb6b82c7ad2837f6f6bd92c6b0`
- corrected RED result / receipt / handoff blobs:
  `4f8cfdd12b97313b6c0205c067dd2fd0a1399359`,
  `f39e53720a7864f5156fcb1748559fdb3de41d07`,
  `e47bf086a5293059489156b1d58b0d289984d340`
- typed-subgraph reconciliation result / receipt / handoff blobs:
  `691ab5bf5be7fd51b6a1d4683bd167ba2c5f37ac`,
  `a33d26fa141d059fedbe47b031927a1444ddcde4`,
  `d67f265ca06441009a064ac2179a76431774dd57`
- parent-design addendum / receipt / handoff blobs:
  `df8d2e49287554b3da2867afde634b3afbec4a37`,
  `fdb64ba8ddab5b050556eb8025b77fd026c7aa50`,
  `ed9f5725ebd843bd258ef767dd0b7a7b74df8277`
- predecessor causal RED receipt blob:
  `e78d528600fef27ce3de52ef91c1118d6866d2ed`
- Detailed Design SHA-256:
  `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc`

Detailed Design §7.5, §8.2, §9.1, §9.2, §22.1, and the Step 5
STOP conditions were rechecked.  The EmlisAI correction policy and current
Cocolon work rules were also rechecked.

## 3. Cycle and owner-chain position

This authority remains a Step 5 prerequisite inside Recovery Epoch 001.  It
does not prove Step 5 completion or close Step 0–10.

The owner chain remains:

1. semantic proof owner:
   `ai/services/ai_inference/emlis_ai_grounded_observation_semantic_restatement_v3.py`
2. witness / alias / refined-snapshot owner:
   `ai/services/ai_inference/emlis_ai_semantic_obligation_inventory_v3.py`
3. depth-only consumer:
   `ai/services/ai_inference/emlis_ai_content_selection_v3.py`

The fixed boundary remains complete one-to-one/onto body-free typed-component
bijection with incident-relation and unknown-affected-graph closure.  Its
effect remains `CONTENT_DEPTH_ONLY`.

## 4. Reconciled cardinality assertion

The parent and typed-subgraph reconciliation contract is:

```text
binding_count
  == original_eligible_closed_graph_component_count
  == supplemental_eligible_closed_graph_component_count
  > 0
```

The current semantic test instead parses its parenthesized equality first.
For the current positive:

```text
ORIGINAL_PROJECTED_COUNT_8
SUPPLEMENTAL_PROJECTED_COUNT_8
INNER_EQUALITY_TRUE
OUTER_REQUIRED_BINDING_COUNT_TRUE_AS_INTEGER_1
ONTO_REQUIRED_MINIMUM_BINDING_COUNT_8
SIMULTANEOUS_SATISFACTION_IMPOSSIBLE
```

The exact future correction is the ordinary three-way chained comparison:

```python
assert (
    len(nonidentical_public_witness.component_bindings)
    == len(nonidentical_original_projected)
    == len(nonidentical_supplemental_projected)
)
```

The positive non-empty condition is already independently fixed by the
role-local projected graph assertions immediately before this comparison.  The
general normative formula remains greater than zero.

No literal `8`, arbitrary minimum, boolean cardinality, duplicate endpoint, or
custom length/iteration behavior may replace graph-derived cardinality.

### 4.1 Existing independent proof that remains required

Cardinality equality alone is not bijection proof.  The same test already
requires:

- exact role-local closure from the selected nucleus;
- equal kind histograms;
- original and supplemental endpoint sets equal the complete projected ID
  sets;
- equal typed semantic dimensions and component kinds;
- exact proof code and proof basis;
- independent validation and deterministic rebuild;
- independent ambiguity, deletion, injection, false-collapse, and tamper
  rejection.

All remain unchanged.

### 4.2 Exact correction location

Only this cardinality defect was found:

```text
ai/tests/test_emlis_ai_grounded_observation_semantic_restatement.py
current blob: 9a0e058fb00391b9efd5f33ac8a511afb10cdf0b
current lines: 1225-1228
```

The S5 helper already uses the correct chained equality.  S4 and the recovery
content node reuse that helper.  Other semantic-test component-count
assertions cover different positive or partial-binding contracts and must not
be changed.

## 5. Authoritative postimplementation GREEN matrix

The corrected RED exact7 had one authority/surface pass and six causal owner
failures.  Discarding the identity node and silently calling only exact6
authoritative would weaken the §22.1 evidence chain.

The postimplementation denominator is therefore a lineage-aware exact7:

| # | exact node | correction/refreeze RED | implementation GREEN |
|---:|---|---|---|
| 1 | `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py::test_recovery_epoch001_step5_cross_role_red_authority_and_surface_are_exact` | lineage/surface PASS | lineage/surface PASS |
| 2 | `ai/tests/test_emlis_ai_grounded_observation_semantic_restatement.py::test_cross_role_semantic_restatement_contract_false_collapse_and_tamper_red` | causal FAIL | PASS |
| 3 | `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py::test_recovery_epoch001_s5_cross_role_semantic_owner_is_resolved_or_red` | causal FAIL | PASS |
| 4 | `ai/tests/test_emlis_nls_v3_s4_semantic_obligation_inventory.py::test_s4_cross_role_refined_snapshot_lineage_alias_and_tamper_red` | causal FAIL | PASS |
| 5 | `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py::test_recovery_epoch001_s5_cross_role_inventory_owner_is_resolved_or_red` | causal FAIL | PASS |
| 6 | `ai/tests/test_emlis_nls_v3_s5_content_selection_stage_context.py::test_s5_cross_role_depth_noninflation_floor_and_effect_scope_red` | causal FAIL | PASS |
| 7 | `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py::test_recovery_epoch001_s5_cross_role_content_consumer_is_resolved_or_red` | causal FAIL | PASS |

Required future results:

```text
TEST_CORRECTION_REFREEZE_RED:
7_COLLECTED_1_LINEAGE_PASS_6_CAUSAL_FAIL_0_ERROR_0_UNEXPECTED

IMPLEMENTATION_GREEN:
7_COLLECTED_7_PASS_0_FAIL_0_ERROR_0_UNEXPECTED
```

The exact7 GREEN proves only this Step 5 remediation matrix.  It is not broad
regression, Step 5 completion, successful Step 0–10 completion, source
baseline lock, or Cycle acceptance.

## 6. Source-hash and policy-hash lineage

### 6.1 Historical preimplementation predecessor

The d9a source exact3 identities remain immutable predecessor evidence:

| path | Git blob | SHA-256 |
|---|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_semantic_restatement_v3.py` | `d28e2ab3086fa09a62c8dbdb3d887a7bff116c78` | `a014e942b34c2c8f2a424dda0b0ecd30cb34ff99112e813d2182ad84d34b65fc` |
| `ai/services/ai_inference/emlis_ai_semantic_obligation_inventory_v3.py` | `685ff7ccc8f5d7fd04dc9ed301b1649b608a868a` | `0a66adbf3163cf3aad1d4454a8a26aa6292284911b4bd5ba1825e0780e3aa2bc` |
| `ai/services/ai_inference/emlis_ai_content_selection_v3.py` | `7172a628f5ecdfb6ba888c36d42a6a62d0d7c22e` | `ec2ccfc92c5566e8ec780e67db54b4a4c620a9334f2ab2cac91a314550f43f0d` |

These hashes mean “source before implementation.”  They are not the expected
postimplementation hashes.

### 6.2 Lineage-aware authority/surface node

The recovery authority/surface node must be corrected so that:

- the d9a exact3 map remains frozen as historical predecessor identity;
- the source exact3 path set remains exact;
- parent, reconciliation, RED, current reconciliation, protected-surface, and
  test-surface identities remain frozen;
- current postimplementation files are not required to equal d9a source
  hashes;
- future result hashes are not guessed or hard-coded before implementation.

The test-correction result head will become the future implementation entry
head.  The source predecessor identities remain the d9a exact3 identities.
Those two identities must not be conflated.

### 6.3 Future implementation receipt owner

The future body-free implementation receipt and post-write GitHub verification
must record:

- implementation entry head and result head;
- predecessor and result Git blob / SHA-256 for each source exact3 path;
- source exact3 changed-path exactness;
- unchanged corrected test identities and protected surfaces;
- old and newly frozen Inventory source-policy identities;
- exact7 selected nodes, collection/pass/fail/error/unexpected counts;
- source-policy artifact hash equality with its newly frozen current constant;
- no source baseline lock and no completion or Cycle-acceptance claim.

Future result blobs, result SHA-256 values, and future policy hash do not exist
yet and are not predeclared.

### 6.4 Historical rc0028 policy pin

`ai/tests/test_emlis_nls_v3_s11_rc0028_lexical_role_snapshot_red.py` blob
`17c2fad2d4d2045d19b70300af90872d8f27e0dc` pins the Step 4 policy identity
that existed for rc0028.  Parent design explicitly requires a future policy
refreeze when cross-role witness metadata is added.

Therefore that historical temporal pin is not part of the Step 5 exact7 GREEN
denominator.  It remains unchanged historical evidence.  Broad regression and
the later disposition of temporal policy-pin tests remain unconfirmed and
cannot be claimed by a targeted exact7 GREEN.

### 6.5 Unlocked source-baseline manifest

`ai/services/ai_inference/emlis_ai_recovery_epoch001_source_baseline_manifest_v3.py`
blob `e95967eb35e2d24745d6e9f90e687afb1fcc83b6` remains an unlocked,
preimplementation manifest.  Re-freezing it is outside this authority and
outside the next correction/refreeze.

Whole-file S5/S10 historical manifest checks, test-exact4 whole-file execution,
and broad/full-suite execution are not part of the selected exact7.  Exact node
selection is required.  This exclusion must be reported and must not be
misstated as broad GREEN.

## 7. Future correction/refreeze surface

No test changes under this read-only authority.  The next separate authority
may modify only mashos-api test exact2:

1. `ai/tests/test_emlis_ai_grounded_observation_semantic_restatement.py`
   - replace only the malformed nested boolean comparison with the exact
     three-way chained comparison;
   - preserve every surrounding closure, onto, typed-dimension, negative, and
     tamper assertion.
2. `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py`
   - bind this reconciliation result / receipt / handoff;
   - freeze the exact7 phase expectations;
   - reinterpret the d9a source map as historical predecessor lineage;
   - remove only the requirement that future current source bytes equal the
     preimplementation hashes;
   - keep exact source/test/protected path surfaces and all protected hashes.

The S4 and S5 tests remain byte-identical:

- `ai/tests/test_emlis_nls_v3_s4_semantic_obligation_inventory.py`
  blob `3f0bd59facec541d8bad09d1af9410344c753e45`
- `ai/tests/test_emlis_nls_v3_s5_content_selection_stage_context.py`
  blob `7886477ff74ab10eb761fc1a5273e2b99f52fce0`

Source exact3 remains byte-identical during that correction/refreeze.

## 8. Protected and unchanged surface

- `ai/services/ai_inference/emlis_ai_refined_source_partition_v3.py`
- `ai/services/ai_inference/emlis_ai_nls_v3_artifact_contract.py`
- fixture / sample / manifest / generated batch
- API / DB / RN / runtime / public / shared route
- v1 production owner and stopped v2
- historical result / receipt / handoff and accepted authority history
- Detailed Design
- question-decision nonsemantic boundary
- partition `cross_source_bindings == []`
- obligation decisions, required coverage, source roles/references, and original
  reception/control ownership

No canonical closure, successful completion receipt, source baseline lock,
P1 retry002, P2, fresh batch, formal exact100, Product Read, correction, B6, or
Cycle acceptance is authorized.

## 9. Confirmed facts

- Both main heads and all required evidence identities were available without
  drift.
- The current nested comparison creates the exact1 versus minimum-exact8
  contradiction recorded by the latest STOP.
- The parent contract requires dynamic closed-graph cardinality equality, not a
  literal count or arbitrary minimum.
- Only one semantic-test cardinality expression has this malformed shape.
- The current recovery identity node compares current source bytes to d9a
  preimplementation hashes.
- The current source-baseline manifest remains unlocked and is not a current
  implementation-result identity.
- The corrected RED exact7 consists of one identity pass and six causal owner
  failures.
- A lineage-aware exact7 can remain the same selected matrix before and after
  source implementation.
- No source, test, protected surface, or mashos-api file changed and no test ran
  under this authority.

## 10. Inference

- The malformed parentheses likely resulted from a transcription of the
  intended three-way comparison.

This inference is not the authority for correction.  The already frozen
complete-bijection contract is the authority.

## 11. Unconfirmed

- Future corrected test blobs and result head.
- Future implementation feasibility, source blobs / SHA-256, and policy hash.
- Future RED refreeze and exact7 GREEN results.
- Broad regression and the later handling of historical temporal policy pins.
- Future source-baseline manifest reconciliation and lock.
- Successful Step 0–10 completion, baseline lock, later Cycle work, and Cycle
  acceptance.

## 12. Unwritten

- Any test or source change.
- Any test execution, implementation, GREEN, or broad regression result.
- Any successful completion receipt or baseline event.
- P1 retry002, P2, fresh batch, exact100, Product Read, correction, B6, or
  Cycle acceptance.
- Raw input/output, quotation, identifiable paraphrase, individual mapping,
  parsed span, private note, body digest, key, or expected surface.

## 13. No-guess boundary

- Do not silently use causal exact6 as the accepted matrix.
- Do not keep requiring postimplementation source to equal predecessor hashes.
- Do not guess future source or policy hashes.
- Do not rewrite historical predecessor hashes as result hashes.
- Do not hard-code exact8 as the general semantic rule.
- Do not fake length, iteration, endpoints, or mapping cardinality.
- Do not weaken one-to-one/onto closure, role separation, or body-free proof.
- Do not treat targeted exact7 GREEN as Step completion or Cycle acceptance.

## 14. Karen opinion

Karen judges the lineage-aware exact7 to be safer than discarding the identity
node and silently shrinking GREEN to exact6.  The evidence node should keep
proving where the implementation started, while the future receipt proves
where it ended.

Likewise, cardinality must be derived from the complete closed typed graph.
Reducing it to a boolean, arbitrary minimum, or fixture count would process
meaning structure too coarsely.  Keeping closure, onto coverage, and every
typed dimension together is consistent with Cocolon's requirement not to
handle a person's words roughly.

## 15. Next separate authority candidate

Exactly one candidate is presented:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_POSITIVE_BINDING_CARDINALITY_ASSERTION_AND_GREEN_DENOMINATOR_RECONCILIATION_RED_CORRECTION_AND_REFREEZE_ONLY
```

It may change only the test exact2 in §7 and run the minimum RED refreeze needed
to establish the corrected assertion, lineage-aware identity node, and exact7
phase matrix.  Source exact3, S4/S5 tests, protected surfaces, implementation,
GREEN, broad regression, baseline lock, later Cycle work, and acceptance remain
prohibited.

STOP. Separate approval required.
