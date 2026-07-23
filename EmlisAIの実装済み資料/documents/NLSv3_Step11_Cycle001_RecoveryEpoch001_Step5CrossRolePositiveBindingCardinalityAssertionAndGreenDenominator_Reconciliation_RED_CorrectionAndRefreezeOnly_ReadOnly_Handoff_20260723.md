---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch001_step5_cross_role_positive_binding_cardinality_green_denominator_red_correction_refreeze_handoff
revision_date: "2026-07-23"
status: "CORRECTED_CARDINALITY_AND_LINEAGE_AWARE_CAUSAL_RED_REFROZEN_AUTHORITY_STOP"
body_free: true
---

# Step 5 cardinality / denominator RED correction handoff

## Current result

```text
mashos-api result head:
f2e73dfcc0b1f0091f077c41afbf9110e4b1b333

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

Body-free result / receipt:

- result blob: `bbaa8981883c773f8b20cff408eda03078998013`
- receipt blob: `0f8319c6519e6e38bd5139d50d292038573b5271`

## Corrected contract

Cardinality is now frozen as:

```text
binding_count
== original_eligible_closed_graph_component_count
== supplemental_eligible_closed_graph_component_count
> 0
```

The test uses a three-way chained dynamic equality. It does not hard-code
exact8, accept an arbitrary minimum, or fake length / iteration behavior.

The recovery authority node preserves the d9a source exact3 blob / SHA-256 map
as historical predecessor lineage. It no longer requires future current source
bytes to equal those predecessor hashes. Future result source and policy
identities remain owned by a future implementation receipt and post-write
GitHub verification.

## Refrozen RED

The exact7 denominator remains:

```text
LINEAGE_AWARE_AUTHORITY_SURFACE_1
SEMANTIC_OWNER_DIRECT_AND_RECOVERY_2
INVENTORY_OWNER_DIRECT_AND_RECOVERY_2
CONTENT_CONSUMER_DIRECT_AND_RECOVERY_2
TOTAL_7
```

Observed causal codes:

```text
RECOVERY_EPOCH001_S5_CROSS_ROLE_SEMANTIC_RESTATEMENT_OWNER_NOT_PROVED: 2
RECOVERY_EPOCH001_S5_CROSS_ROLE_REFINED_SNAPSHOT_BINDING_NOT_PROVED: 2
RECOVERY_EPOCH001_S5_CROSS_ROLE_DEPTH_NONINFLATION_NOT_PROVED: 2
```

Two runner setup attempts stopped before collection and are separately recorded
in the receipt. The authoritative exact7 ran once in the materialized isolated
test environment and had zero test error and zero unexpected result.

## Unchanged boundary

- source exact3
- S4 / S5 tests
- refined source partition
- artifact contract
- historical rc0028 policy pin
- unlocked source-baseline manifest
- fixture / sample / manifest
- API / DB / RN / runtime / public / shared route
- v1 production owner and stopped v2
- historical receipts, Detailed Design, and accepted authority history

No implementation, GREEN, broad regression, successful completion receipt,
baseline lock, later Cycle work, or acceptance occurred.

## Mash action required

Approve only this separate authority if work should continue:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_POSITIVE_BINDING_CARDINALITY_ASSERTION_AND_GREEN_DENOMINATOR_RECONCILIATION_IMPLEMENTATION_AND_GREEN_ONLY
```

It may modify only source exact3 and run the targeted exact7 GREEN. Test
exact4, protected surfaces, broad regression, completion, baseline lock, later
Cycle work, and Cycle acceptance remain prohibited.

Do not advance automatically.

STOP.
