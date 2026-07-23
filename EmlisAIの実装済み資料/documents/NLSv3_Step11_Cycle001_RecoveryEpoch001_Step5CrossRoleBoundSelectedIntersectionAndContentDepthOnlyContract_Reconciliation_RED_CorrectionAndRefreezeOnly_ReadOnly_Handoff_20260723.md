---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch001_step5_cross_role_bound_selected_intersection_content_depth_only_red_correction_refreeze_handoff
revision_date: "2026-07-23"
status: "BOUND_SELECTED_INTERSECTION_CORRECTED_AND_CAUSAL_RED_REFROZEN_AUTHORITY_STOP"
body_free: true
---

# Step 5 bound-selected RED correction handoff

## Current result

```text
mashos-api result head:
4abc06bc544709f359ad4984357af0cd60fe083f

changed path:
TEST_EXACT2_ONLY

authoritative exact7:
7_COLLECTED
1_LINEAGE_SURFACE_PASS
6_CAUSAL_FAIL
0_ERROR
0_UNEXPECTED

source exact3:
UNCHANGED_PREIMPLEMENTATION

implementation:
NOT_AUTHORIZED

GREEN:
NOT_RUN

source baseline:
UNLOCKED

Cycle 001:
NOT_ACCEPTED

state:
AUTHORITY_STOP
```

## Corrected contract

S5 now asserts:

```python
assert all(
    bound_ids
    for bound_ids in bound_obligation_ids_by_role.values()
)
```

The correction removes only the selected intersection.  It retains explicit
role-local obligation presence while leaving optional selection outside the
`CONTENT_DEPTH_ONLY` witness.

Required-bound selection, both active roles, source-role separation, original
reception, safety closure exclusion, unmatched preservation, depth floor,
lineage, determinism, and tamper rejection remain frozen.

## Refrozen RED

```text
RECOVERY_EPOCH001_S5_CROSS_ROLE_SEMANTIC_RESTATEMENT_OWNER_NOT_PROVED: 2
RECOVERY_EPOCH001_S5_CROSS_ROLE_REFINED_SNAPSHOT_BINDING_NOT_PROVED: 2
RECOVERY_EPOCH001_S5_CROSS_ROLE_DEPTH_NONINFLATION_NOT_PROVED: 2
```

The exact7 identity/order remains unchanged.  The recovery lineage node now
binds this reconciliation, latest STOP evidence, corrected rule, and changed
path exact2.  It does not alter source predecessor identities or future GREEN
expectations.

## Unchanged boundary

- source exact3
- semantic / S4 tests
- refined source partition and artifact contract
- fixture / sample / manifest
- API / DB / RN / runtime / public / shared route
- v1 production owner and stopped v2
- historical policy pin, receipts, Detailed Design, and accepted history

No implementation, GREEN, broad regression, successful completion receipt,
baseline lock, later Cycle work, or acceptance occurred.

## Mash action required

Approve only this separate candidate if work should continue:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_BOUND_SELECTED_INTERSECTION_AND_CONTENT_DEPTH_ONLY_CONTRACT_RECONCILIATION_IMPLEMENTATION_AND_GREEN_ONLY
```

It may modify only source exact3 and run only the targeted exact7 GREEN.  Test
exact4, protected surfaces, broad regression, completion, baseline lock, later
Cycle work, and Cycle acceptance remain prohibited.

Do not advance automatically.

STOP.
