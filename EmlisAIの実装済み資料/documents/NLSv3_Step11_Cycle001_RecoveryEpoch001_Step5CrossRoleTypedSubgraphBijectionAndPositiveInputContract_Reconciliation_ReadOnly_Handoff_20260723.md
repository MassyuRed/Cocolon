---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch001_step5_cross_role_positive_input_reconciliation_handoff
revision_date: "2026-07-23"
status: "POSITIVE_INPUT_CONTRACT_RECONCILED_AUTHORITY_STOP"
body_free: true
---

# Step 5 typed-subgraph bijection / positive-input reconciliation handoff

## Current result

```text
POSITIVE_INPUT_CONTRACT_RECONCILED
PARENT_DESIGN_UNCHANGED
HISTORICAL_RED_AND_STOP_IMMUTABLE
MASHOS_API_CHANGE_COUNT_0
TEST_RUN_COUNT_0
IMPLEMENTATION_NOT_AUTHORIZED
SOURCE_BASELINE_UNLOCKED
CYCLE001_NOT_ACCEPTED
AUTHORITY_STOP
```

## Selected proof boundary

- Bind only complete, same-granularity, incident-relation and
  unknown-affected-graph closed typed subgraphs.
- Require exact one-to-one and onto component binding after independent
  per-role projection.
- Derive binding count from exact eligible graph cardinality; arbitrary
  `>= 2` is not completeness proof.
- Do not discard a relation, endpoint, unknown, dependent unit, or safety
  pressure connected to the candidate.
- Preserve disconnected unmatched meaning as distinct.
- Fail closed to empty witness / no equivalence when no eligible closed graph
  remains.
- Apply a valid witness only as `CONTENT_DEPTH_ONLY`.
- Preserve both semantic roles, every obligation/source ref, required coverage,
  and original reception/control ownership.

## Positive classes

Full owner-chain positive:

```text
INDEPENDENT_ROLE_LOCAL_FULL_TYPED_GRAPH_REPLAY
```

Both role-local bundles, ledgers, resolvers, plans, and source witnesses must be
built independently.  The selected positive has exact full-graph equality and
no unmatched eligible component.  Equal source material is not itself proof;
independent typed graph reproduction is required.

Non-identical semantic-owner positive:

```text
EXPLICIT_REFERENT_PREDICATE_CLOSED_SINGLE_COMPONENT_RESTATEMENT
```

It requires explicit referent/topic and predicate/completion proof plus exact
polarity, modality, time, quantifier, degree, and closure.  First-match batch
selection, omitted anchors, dependency-bearing partial graphs, raw equality,
synonym-only proof, and case/family/fixture cues are not eligible.

## Existing conflicting graph

The current default positive is reclassified for the future corrected RED:

```text
EXPECTED_EMPTY_WITNESS
CONNECTED_ONE_TO_TWO_AND_RELATION_NONISOMORPHIC_NEGATIVE
UNMATCHED_MEANING_AND_OBLIGATIONS_RETAINED
```

The historical RED commit and all historical receipts remain immutable.

## Next exact boundary

Only test exact4 may change in the next separate authority:

1. `ai/tests/test_emlis_ai_grounded_observation_semantic_restatement.py`
2. `ai/tests/test_emlis_nls_v3_s4_semantic_obligation_inventory.py`
3. `ai/tests/test_emlis_nls_v3_s5_content_selection_stage_context.py`
4. `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py`

Future source exact3, fixtures, samples, manifests, partition, artifact
contract, API/DB/RN/runtime/public/shared surfaces, v1, stopped v2, Detailed
Design, and accepted authority history remain unchanged.

## Mash action required

Approve only this one separate authority if the corrected causal RED should be
created:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_TYPED_SUBGRAPH_BIJECTION_AND_POSITIVE_INPUT_CONTRACT_RECONCILIATION_RED_CORRECTION_AND_REFREEZE_ONLY
```

It authorizes test exact4 correction and the minimum causal RED refreeze only.
Do not resume source implementation or GREEN automatically.

STOP.

