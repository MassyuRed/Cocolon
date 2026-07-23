---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch001_step5_cross_role_bound_selected_intersection_content_depth_only_contract_reconciliation_handoff
revision_date: "2026-07-23"
status: "BOUND_SELECTED_INTERSECTION_AND_CONTENT_DEPTH_ONLY_RECONCILED_AUTHORITY_STOP"
body_free: true
---

# Step 5 bound-selected intersection reconciliation handoff

## Current result

```text
BOUND_SELECTED_INTERSECTION_ASSERTION_RECONCILED
ROLE_LOCAL_BOUND_OBLIGATION_PRESENCE_ASSERTION_FROZEN
REQUIRED_BOUND_SELECTION_ASSERTION_PRESERVED
ACTIVE_ROLE_POLICY_ASSERTION_PRESERVED
CONTENT_DEPTH_ONLY_PRESERVED
PARENT_DESIGN_UNCHANGED
FUTURE_TEST_CORRECTION_SURFACE_EXACT2_FROZEN
MASHOS_API_CHANGE_COUNT_0
TEST_CHANGE_COUNT_0
TEST_RUN_COUNT_0
IMPLEMENTATION_NOT_AUTHORIZED
GREEN_NOT_RUN
SOURCE_BASELINE_UNLOCKED
CYCLE001_NOT_ACCEPTED
AUTHORITY_STOP
```

## Exact contract disposition

Current frozen S5 expression:

```python
assert all(
    bound_ids & selected
    for bound_ids in bound_obligation_ids_by_role.values()
)
```

Future corrected expression:

```python
assert all(
    bound_ids
    for bound_ids in bound_obligation_ids_by_role.values()
)
```

Remove only ` & selected`.

This keeps an explicit per-role proof that witness endpoints remain represented
by ledger obligations.  Required-bound obligations remain constrained by the
existing subset-selected assertion.  Both active source roles remain
independently constrained by
`REFINED_SOURCE_ROLES_MUST_BOTH_REMAIN_ACTIVE`.

## Boundaries that remain frozen

- witness effect: `CONTENT_DEPTH_ONLY`;
- complete one-to-one/onto body-free typed-component bijection;
- exact original / supplemental roles;
- required coverage 100%;
- unchanged decision status and selection policy;
- unchanged source refs and role-local obligations;
- original reception/control ownership;
- safety/must-separate closure exclusion;
- unmatched meaning/relation/unknown preservation;
- depth equality/floor, determinism, lineage, hash, tamper, and cue guards.

Do not change another S5 assertion unless a separate, independently evidenced
conflict reaches STOP.

## Next correction/refreeze exact surface

Only:

1. `ai/tests/test_emlis_nls_v3_s5_content_selection_stage_context.py`
2. `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py`

The first receives the exact expression correction.  The second binds this
reconciliation/current evidence and preserves the existing exact7
lineage/owner matrix.

Source exact3, semantic/S4 tests, parent design, and protected surfaces remain
unchanged.

## Future RED

Run only the frozen exact7 after the test correction:

```text
7_COLLECTED
1_LINEAGE_PASS
6_CAUSAL_FAIL
0_ERROR
0_UNEXPECTED
```

Any unrelated failure, collection error, unexpected pass/fail, required wider
surface, parent conflict, or source change requirement is STOP.

## Mash action required

Approve only this separate candidate if work should continue:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_BOUND_SELECTED_INTERSECTION_AND_CONTENT_DEPTH_ONLY_CONTRACT_RECONCILIATION_RED_CORRECTION_AND_REFREEZE_ONLY
```

It does not authorize source implementation, GREEN, broad regression,
completion, baseline lock, later Cycle work, or acceptance.

STOP.
