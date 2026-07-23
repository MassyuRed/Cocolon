---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch001_step5_cross_role_positive_binding_cardinality_green_denominator_red_correction_refreeze
revision_date: "2026-07-23"
authority: "NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_POSITIVE_BINDING_CARDINALITY_ASSERTION_AND_GREEN_DENOMINATOR_RECONCILIATION_RED_CORRECTION_AND_REFREEZE_ONLY"
status: "CORRECTED_CARDINALITY_AND_LINEAGE_AWARE_CAUSAL_RED_REFROZEN_AUTHORITY_STOP"
body_free: true
automatic_progression: false
---

# Step 5 positive binding cardinality / GREEN denominator RED correction and refreeze

## 1. Result

The approved test-only correction is reflected and the lineage-aware causal RED
is refrozen.

```text
CARDINALITY_NESTED_BOOLEAN_REMOVED
THREE_WAY_DYNAMIC_COUNT_EQUALITY_FROZEN
PREIMPLEMENTATION_SOURCE_LINEAGE_PRESERVED
CURRENT_SOURCE_PREDECESSOR_HASH_PIN_REMOVED
AUTHORITATIVE_EXACT7_REFROZEN
7_COLLECTED
1_LINEAGE_SURFACE_PASS
6_CAUSAL_FAIL
0_ERROR
0_UNEXPECTED
SOURCE_EXACT3_CHANGE_COUNT_0
S4_S5_TEST_CHANGE_COUNT_0
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
Cocolon main:    db507d9737b078b97a69d5651e62ce43aff27ea1
mashos-api main: d9a65dc7d5ee329ba3387c8659f435f3fb9f8e8d
RELATED_DRIFT_0
```

Immediately before the Cocolon evidence write:

```text
Cocolon main:    db507d9737b078b97a69d5651e62ce43aff27ea1
mashos-api main: f2e73dfcc0b1f0091f077c41afbf9110e4b1b333
AUTHORIZED_MASHOS_API_ADVANCE_ONLY
UNRELATED_DRIFT_0
```

Required predecessor evidence:

- current authority blob:
  `c298cd7759bc0e6df81b4be0231eafd048c41a2c`
- Execution and Closure Plan blob:
  `201828886ccee706af38c42c1fceb6b848d53278`
- cardinality / denominator reconciliation result / receipt / handoff:
  `e0f7d270a265251cbf1204f784dd7c0e283b1946`,
  `0eee62cfcaece10c79ae0267d2f4df6d835c6a33`,
  `61f309fd4f96e164448ae685b5584f26b0a474a9`
- implementation/GREEN STOP result / receipt / handoff:
  `75c32197055cef81b160636e75a382a378c0e6d3`,
  `102a3299f4f5d1967eed33252925ba1c62448e12`,
  `867c8bb275431adb6b82c7ad2837f6f6bd92c6b0`
- corrected predecessor RED result / receipt / handoff:
  `4f8cfdd12b97313b6c0205c067dd2fd0a1399359`,
  `f39e53720a7864f5156fcb1748559fdb3de41d07`,
  `e47bf086a5293059489156b1d58b0d289984d340`
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

Result head:

```text
f2e73dfcc0b1f0091f077c41afbf9110e4b1b333
```

Commits:

1. `66698bb48892861f2601b34a0a1408e5f876977d`
   - `test(nls-v3): correct Step 5 binding cardinality`
2. `f2e73dfcc0b1f0091f077c41afbf9110e4b1b333`
   - `test(nls-v3): refreeze Step 5 lineage denominator`

Changed path exact2:

| path | predecessor blob | result blob | predecessor SHA-256 | result SHA-256 |
|---|---|---|---|---|
| `ai/tests/test_emlis_ai_grounded_observation_semantic_restatement.py` | `9a0e058fb00391b9efd5f33ac8a511afb10cdf0b` | `49864c6ee6a944c603da21ebd18ba60633e56fb9` | `2e7ed277b55972adbae9bccdb71ad7fe538000c0779b791f2050bf4ca94785f9` | `28e74e82e7351a4e3f92345a30cf21e0a59aeb1b820a639baad509316ff3215b` |
| `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py` | `24d7db3e80754f66c98e6587c44b3e5c2dc79b1f` | `4c295bab09965194608947585da559198b5a3e2b` | `4bde64926240ce89ba8994bb4a9ea954955dc9ca9c4b1d936b424e3f13bd0585` | `20b006716cbcb959020e9fc7e77be6c34de0a4d474bd5e8e5093f6d2eb28cc0f` |

GitHub compare from entry to result is `ahead_by 2`, `behind_by 0`, with
exactly these two modified paths.

## 4. Corrected cardinality contract

The normative contract remains:

```text
binding_count
== original_eligible_closed_graph_component_count
== supplemental_eligible_closed_graph_component_count
> 0
```

The malformed nested boolean comparison was replaced with:

```python
assert (
    len(nonidentical_public_witness.component_bindings)
    == len(nonidentical_original_projected)
    == len(nonidentical_supplemental_projected)
)
```

No literal `8`, arbitrary minimum, custom length behavior, duplicate endpoint,
or fixture-derived count was introduced. The positive non-empty proof,
role-local closure, kind histogram, onto endpoint coverage, typed dimensions,
independent validation, deterministic rebuild, false-collapse negatives, and
tamper rejection remain intact.

The observed exact8 / exact8 counts describe only the current test graph. They
are not the general rule.

## 5. Lineage-aware exact7

The d9a source exact3 identities remain historical preimplementation evidence:

| path | predecessor blob | predecessor SHA-256 |
|---|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_semantic_restatement_v3.py` | `d28e2ab3086fa09a62c8dbdb3d887a7bff116c78` | `a014e942b34c2c8f2a424dda0b0ecd30cb34ff99112e813d2182ad84d34b65fc` |
| `ai/services/ai_inference/emlis_ai_semantic_obligation_inventory_v3.py` | `685ff7ccc8f5d7fd04dc9ed301b1649b608a868a` | `0a66adbf3163cf3aad1d4454a8a26aa6292284911b4bd5ba1825e0780e3aa2bc` |
| `ai/services/ai_inference/emlis_ai_content_selection_v3.py` | `7172a628f5ecdfb6ba888c36d42a6a62d0d7c22e` | `ec2ccfc92c5566e8ec780e67db54b4a4c620a9334f2ab2cac91a314550f43f0d` |

The recovery identity node no longer requires future current source bytes to
equal these predecessor hashes. It freezes the exact predecessor map,
source/test/protected path surfaces, authority evidence, and exact7 phases
without guessing future result hashes.

Authoritative exact7:

1. recovery authority / surface / lineage node
2. semantic owner direct node
3. semantic owner recovery node
4. Inventory owner direct node
5. Inventory owner recovery node
6. Content Selection consumer direct node
7. Content Selection consumer recovery node

The exact node IDs are frozen in the corrected recovery test and in the
body-free receipt.

## 6. Test execution ledger

Runner preparation was separated from the authoritative test result:

```text
PRECOLLECTION_RUNNER_SETUP_ATTEMPT_COUNT_2
ATTEMPT_1_PYTEST_UNAVAILABLE_0_COLLECTED
ATTEMPT_2_PROJECT_DEPENDENCY_ENVIRONMENT_NOT_MATERIALIZED_0_COLLECTED
REPOSITORY_CHANGE_FOR_RUNNER_SETUP_COUNT_0
AUTHORITATIVE_EXACT7_EXECUTION_COUNT_1
TOTAL_PYTEST_COMMAND_INVOCATION_COUNT_3
```

The authoritative exact7 run, after materializing an isolated test environment,
produced:

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

The two precollection attempts are runner bootstrap evidence, not selected test
case results. No selected node was collected in those attempts. The
authoritative run has zero error and zero unrelated failure.

## 7. Unchanged and protected surface

Verified unchanged after the mashos-api write:

- S4 test blob:
  `3f0bd59facec541d8bad09d1af9410344c753e45`
- S5 test blob:
  `7886477ff74ab10eb761fc1a5273e2b99f52fce0`
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

The historical policy SHA-256 remains
`de77b13a27e08ae3337d3ea8c11e1ba18ff24fb3f601d7639fe38c3948b8ff8c`
and remains outside this targeted exact7.

No source, fixture, sample, manifest, API, DB, RN, runtime, public/shared
route, v1 owner, stopped v2, historical receipt, Detailed Design, or accepted
authority history changed.

## 8. Confirmed facts

- Both main heads matched the approved entry identities.
- Required evidence was available and mutually consistent.
- Only test exact2 changed in mashos-api.
- The semantic cardinality expression now encodes dynamic three-way equality.
- The recovery node preserves d9a source exact3 as historical predecessor
  lineage without pinning future current source bytes to those hashes.
- The authoritative exact7 produced one lineage/surface pass and six causal
  failures with zero test error and zero unexpected result.
- The three stable causal codes each occurred exactly twice.
- Source exact3, S4/S5, and protected surfaces remained unchanged.

## 9. Inference

- Source exact3 implementation is required to resolve the six causal RED nodes,
  but the RED does not prescribe a unique internal algorithm.
- The earlier nested parentheses likely came from transcription of the intended
  chained equality.

The second point is not the authority for the correction; the frozen
complete-bijection contract is.

## 10. Unconfirmed

- Source exact3 implementation feasibility.
- Future source blobs / SHA-256 and Inventory policy hash.
- Exact7 GREEN and broad regression.
- Successful Step 0–10 completion, source baseline lock, fresh batch, formal
  exact100, Product Read, correction, B6, and Cycle acceptance.

## 11. Unwritten

- No source implementation, GREEN, broad regression, successful completion
  receipt, source-baseline event, later Cycle work, or acceptance claim is
  written.
- No raw input/output, quotation, identifiable paraphrase, individual mapping,
  parsed span, private note, body digest, key, or expected surface is recorded.

## 12. No-guess boundary

- Do not reduce the authoritative denominator to causal exact6.
- Do not rewrite predecessor hashes as future result hashes.
- Do not predeclare future source or policy hashes.
- Do not hard-code exact8 or an arbitrary minimum.
- Do not fake length, iteration, endpoint, or mapping cardinality.
- Do not weaken one-to-one/onto closure, role separation, body-free proof,
  negative codes, or tamper rejection.
- Do not treat this targeted RED as GREEN, Step completion, baseline lock, or
  Cycle acceptance.

## 13. Karen opinion

Karen judges this exact2 correction to be the smallest honest recovery. The
cardinality now follows the complete closed typed graph instead of a boolean,
and the lineage node still proves where implementation must start without
pretending that predecessor bytes are future results.

Keeping the exact7 identity node matters. Dropping it would make the test
denominator look simpler, but would weaken the chain that distinguishes
historical source, corrected tests, and future implementation.

## 14. Next separate authority candidate

Exactly one candidate is presented:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_POSITIVE_BINDING_CARDINALITY_ASSERTION_AND_GREEN_DENOMINATOR_RECONCILIATION_IMPLEMENTATION_AND_GREEN_ONLY
```

It may modify only the previously frozen source exact3 and run the targeted
exact7 implementation GREEN under separate approval. Test exact4, protected
surfaces, broad regression, completion, baseline lock, later Cycle work, and
acceptance remain outside this authority.

STOP. Separate approval required.
