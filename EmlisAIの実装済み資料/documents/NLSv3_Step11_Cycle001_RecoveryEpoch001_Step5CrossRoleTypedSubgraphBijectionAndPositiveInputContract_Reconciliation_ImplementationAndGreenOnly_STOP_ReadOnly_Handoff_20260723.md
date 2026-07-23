---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch001_step5_cross_role_typed_subgraph_reconciliation_implementation_green_stop_handoff
revision_date: "2026-07-23"
status: "AUTHORITY_STOP_IMMUTABLE_TEST_CONTRACT_CONFLICT"
body_free: true
---

# Step 5 typed-subgraph reconciliation implementation / GREEN STOP handoff

## Current result

```text
AUTHORITY_STOP_IMMUTABLE_TEST_CONTRACT_CONFLICT
MASHOS_API_RESULT_HEAD_d9a65dc7d5ee329ba3387c8659f435f3fb9f8e8d
TEST_RUN_COUNT_1
COLLECTED_2_PASSED_0_FAILED_2_ERROR_0_GREEN_0
SOURCE_EXACT3_GITHUB_CHANGE_COUNT_0
TEST_EXACT4_GITHUB_CHANGE_COUNT_0
PROTECTED_SURFACE_GITHUB_CHANGE_COUNT_0
SOURCE_BASELINE_UNLOCKED
CYCLE001_NOT_ACCEPTED
```

## Blocking contracts

### Immutable positive-cardinality conflict

The corrected semantic positive projects exact8 components per role.  Its
cardinality assertion evaluates the equality of those counts first and then
compares binding length to the resulting boolean, requiring exact1 binding.
The immediately following onto assertions require all exact8 IDs from both
roles, requiring at least exact8 binding rows.

```text
REQUIRED_BINDING_COUNT_1
REQUIRED_MINIMUM_BINDING_COUNT_8
SIMULTANEOUS_SATISFACTION_IMPOSSIBLE
```

Source implementation cannot correct this.  Test exact4 is immutable under the
approved authority.

### GREEN denominator conflict

The RED authority/surface node pins source exact3 to preimplementation hashes.
It must fail after any source implementation.  The six causal owner/consumer
nodes are a plausible postimplementation matrix, but no accepted evidence
explicitly freezes that exact6 denominator.

## Unchanged boundaries

- mashos-api main remains
  `d9a65dc7d5ee329ba3387c8659f435f3fb9f8e8d`
- source exact3 GitHub changes: `0`
- test exact4 GitHub changes: `0`
- partition and all protected surfaces: unchanged
- `cross_source_bindings == []`
- question decision remains nonsemantic
- obligations, source refs, roles, and original reception/control ownership
  remain unchanged
- no implementation GREEN, completion receipt, baseline lock, fresh batch, or
  Cycle acceptance

## Mash action required

Approve only this separate read-only candidate if reconciliation should
continue:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_POSITIVE_BINDING_CARDINALITY_ASSERTION_AND_GREEN_DENOMINATOR_RECONCILIATION_READ_ONLY
```

It must freeze the corrected cardinality assertion, the exact
postimplementation GREEN matrix, and the source-hash lineage rule before any
test correction or source implementation authority is proposed.

Do not resume implementation or GREEN automatically.

STOP.
