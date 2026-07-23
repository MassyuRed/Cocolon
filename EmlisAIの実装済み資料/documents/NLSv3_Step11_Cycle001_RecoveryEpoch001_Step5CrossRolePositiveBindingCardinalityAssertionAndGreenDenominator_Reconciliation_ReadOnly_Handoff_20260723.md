---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch001_step5_cross_role_positive_binding_cardinality_green_denominator_reconciliation_handoff
revision_date: "2026-07-23"
status: "BINDING_CARDINALITY_AND_GREEN_DENOMINATOR_RECONCILED_AUTHORITY_STOP"
body_free: true
---

# Step 5 cardinality / GREEN denominator reconciliation handoff

## Current result

```text
BINDING_CARDINALITY_ASSERTION_RECONCILED
POSTIMPLEMENTATION_GREEN_EXACT7_FROZEN
SOURCE_HASH_LINEAGE_RECONCILED
MASHOS_API_CHANGE_COUNT_0
TEST_CHANGE_COUNT_0
TEST_RUN_COUNT_0
IMPLEMENTATION_NOT_AUTHORIZED
GREEN_NOT_RUN
SOURCE_BASELINE_UNLOCKED
CYCLE001_NOT_ACCEPTED
AUTHORITY_STOP
```

## Correct cardinality contract

Normative rule:

```text
binding_count
== original_eligible_closed_graph_component_count
== supplemental_eligible_closed_graph_component_count
> 0
```

Exact future test correction:

```python
assert (
    len(nonidentical_public_witness.component_bindings)
    == len(nonidentical_original_projected)
    == len(nonidentical_supplemental_projected)
)
```

Do not hard-code exact8.  The count must remain derived from independently
projected closed typed graphs.

## Postimplementation GREEN

The authoritative matrix remains exact7:

```text
LINEAGE_AWARE_AUTHORITY_SURFACE_1
SEMANTIC_OWNER_DIRECT_AND_RECOVERY_2
INVENTORY_OWNER_DIRECT_AND_RECOVERY_2
CONTENT_CONSUMER_DIRECT_AND_RECOVERY_2
TOTAL_7
```

Expected future states:

```text
TEST_CORRECTION_REFREEZE_RED:
7_COLLECTED_1_LINEAGE_PASS_6_CAUSAL_FAIL_0_ERROR_0_UNEXPECTED

IMPLEMENTATION_GREEN:
7_COLLECTED_7_PASS_0_FAIL_0_ERROR_0_UNEXPECTED
```

This targeted GREEN is not Step completion or broad regression.

## Source lineage

- d9a source exact3 hashes remain historical preimplementation evidence.
- The recovery identity node must not require future current source bytes to
  equal those predecessor hashes.
- Future result source and policy identities are recorded only after
  implementation by the body-free receipt and GitHub re-verification.
- The future test-refreeze result head and the d9a source predecessor identity
  are separate lineage positions.
- The rc0028 policy-hash pin remains historical and outside this exact7
  denominator.
- The unlocked source-baseline manifest and whole-file/broad-suite checks remain
  outside this exact7; targeted GREEN must not be reported as broad GREEN.

## Mash action required

Approve only this separate correction/refreeze candidate if work should
continue:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_POSITIVE_BINDING_CARDINALITY_ASSERTION_AND_GREEN_DENOMINATOR_RECONCILIATION_RED_CORRECTION_AND_REFREEZE_ONLY
```

It may change only:

1. `ai/tests/test_emlis_ai_grounded_observation_semantic_restatement.py`
2. `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py`

S4/S5 tests, source exact3, protected surfaces, implementation, GREEN, broad
regression, completion, baseline lock, and later Cycle work remain prohibited.

Do not advance automatically.

STOP.
