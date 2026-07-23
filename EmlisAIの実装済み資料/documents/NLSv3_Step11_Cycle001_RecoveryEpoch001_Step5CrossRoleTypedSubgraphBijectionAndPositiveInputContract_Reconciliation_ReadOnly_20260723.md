---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch001_step5_cross_role_typed_subgraph_positive_input_reconciliation
revision_date: "2026-07-23"
authority: "NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_TYPED_SUBGRAPH_BIJECTION_AND_POSITIVE_INPUT_CONTRACT_RECONCILIATION_READ_ONLY"
status: "POSITIVE_INPUT_CONTRACT_RECONCILED_AUTHORITY_STOP"
body_free: true
automatic_progression: false
---

# Step 5 cross-role typed-subgraph bijection / positive-input contract reconciliation

## 1. Result

This read-only authority reconciles the parent proof boundary and the
conflicting frozen positive without weakening either privacy or semantic
safety.

```text
POSITIVE_INPUT_CONTRACT_RECONCILED
PARENT_DESIGN_UNCHANGED
HISTORICAL_RED_AND_STOP_EVIDENCE_IMMUTABLE
CURRENT_TEST_EXACT4_REQUIRES_SEPARATE_RED_CORRECTION
MASHOS_API_CHANGE_COUNT_0
TEST_RUN_COUNT_0
IMPLEMENTATION_NOT_AUTHORIZED
GREEN_NOT_AUTHORIZED
SOURCE_BASELINE_UNLOCKED
SUCCESSFUL_STEP0_10_COMPLETION_RECEIPT_COUNT_0
FRESH_BATCH_RESERVED_NOT_CREATED
CYCLE001_NOT_ACCEPTED
AUTHORITY_STOP
```

The parent contract remains complete one-to-one body-free typed-component
bijection.  The prior implementation/GREEN STOP remains correct: its default
positive graph is not eligible for a non-empty witness.

## 2. Entry identity and evidence chain

Heads checked at authority entry:

```text
Cocolon main:   bfaa4ca3a5b255072a0f31d8985bc05b79444a07
mashos-api main: e485f4a3c07ec0edeb2c248a74449b95f5017a58
RELATED_DRIFT_0
```

Required evidence:

- current authority blob:
  `cf802ffe1d66b5c42c4e2eb659423bb2c4ce7196`
- Execution and Closure Plan blob:
  `d5f5d185116ad0aaab86c3ab0afc65afd30fe22f`
- parent-design addendum blob:
  `df8d2e49287554b3da2867afde634b3afbec4a37`
- parent-design receipt blob:
  `fdb64ba8ddab5b050556eb8025b77fd026c7aa50`
- parent-design handoff blob:
  `ed9f5725ebd843bd258ef767dd0b7a7b74df8277`
- frozen causal RED receipt blob:
  `a544760ba508778aa339cad57fed330dc3048b26`
- implementation/GREEN STOP result blob:
  `9776f827a4cd384ec47f29ce0e83d4fe5e82ae96`
- implementation/GREEN STOP receipt blob:
  `37ab784cf8f2f44945bafbeda33d56db4150b129`
- implementation/GREEN STOP handoff blob:
  `360d070747c8bba247c1f4feec38acd1eabaa167`
- Detailed Design SHA-256:
  `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc`

The Detailed Design materialization matched the required identity.  §7.5,
§8.2, §9.1, §9.2, §22.1, and the Step 5 STOP conditions were rechecked.

## 3. Cycle and owner-chain position

This reconciliation is a Step 5 prerequisite inside Recovery Epoch 001.  It
does not prove Step 5 completion and does not close Step 0–10.

Owner chain remains:

1. semantic proof owner:
   `ai/services/ai_inference/emlis_ai_grounded_observation_semantic_restatement_v3.py`
2. witness binding / alias / refined snapshot owner:
   `ai/services/ai_inference/emlis_ai_semantic_obligation_inventory_v3.py`
3. depth-only consumer:
   `ai/services/ai_inference/emlis_ai_content_selection_v3.py`

Detailed Design relations remain:

- §7.5 keeps original and supplemental as separate source roles and keeps the
  question decision nonsemantic.
- §8.2 requires role-pure obligations and source references.
- §9.1 keeps meaning discovery in Inventory and selection in Content
  Selection.
- §9.2 derives depth from distinct meaning structure and forbids repetition
  inflation.
- Step 5 stops if repetition is required to satisfy depth.
- §22.1 requires owner, strict contract, positive, independent negative,
  receipt, parent/source hash, completion condition, and next authority before
  a Step is complete.

The successful Step 0–10 completion receipt count remains zero.  Source
baseline, P1 retry002, P2, fresh batch, formal exact100, Product Read, B6, and
Cycle acceptance remain unopened.

## 4. Confirmed conflict classification

The STOP evidence establishes this body-free topology for the frozen default
positive:

```text
original:     nuclei 5 / relations 1
supplemental: nuclei 2 / relations 1
shared granularity pressure: 1 to 2
relation type match: false
relation direction match: false
relation endpoint provenance match: false
strict binding count: 0
frozen positive minimum: 2
```

The mismatched relation is connected to the candidate meaning.  It is not an
independent unmatched component.  A non-empty result would require one-to-many
collapse, removal of a connected relation followed by partial nucleus salvage,
or body/input-specific proof.  All three are prohibited.

Therefore:

```text
CURRENT_DEFAULT_GRAPH_POSITIVE_ELIGIBLE_FALSE
CURRENT_DEFAULT_GRAPH_EXPECTED_EMPTY_WITNESS
CURRENT_DEFAULT_GRAPH_FUTURE_NEGATIVE_CLASSIFICATION_REQUIRED
```

This classification does not invalidate the historical causal RED against the
unimplemented source owners.  It only supersedes use of that graph as a future
positive/GREEN denominator.

## 5. Reconciled graph proof contract

The existing proof code, proof basis, schemas, and effect remain unchanged:

```text
proof code:
TYPED_SEMANTIC_GRAPH_EQUIVALENCE

proof basis:
COMPLETE_BODY_FREE_TYPED_COMPONENT_BIJECTION

effect:
CONTENT_DEPTH_ONLY
```

### 5.1 Incident and affected-graph closure

A candidate mapped subgraph is complete only when all of the following are
closed on each role:

1. Every mapped nucleus has every required incident relation included.
2. Every included relation has both endpoints included.
3. Every unknown boundary whose affected graph intersects the candidate is
   included, together with every affected component.
4. Closure is repeated until no incident relation endpoint or unknown affected
   component remains outside the candidate.
5. Parent component and decomposed child units are different granularities and
   cannot be bound to one another.
6. Safety-bearing or `must_separate` components are not witness endpoints.
   Their obligations and reciprocal separation remain distinct.

A relation or unknown connected to a candidate cannot be discarded to make
the remaining nuclei appear equivalent.

### 5.2 Exact one-to-one bijection

After independent role-local projection and closure:

- original and supplemental component counts are equal;
- component-kind histograms are equal;
- each original component has exactly one supplemental component;
- each supplemental component has exactly one original component;
- role-local IDs may differ;
- component granularity and every typed semantic dimension match;
- relation type, direction, and mapped endpoints match;
- unknown dimension and mapped affected graph match;
- ordering and witness/hash derivation are deterministic.

The completion condition is:

```text
binding_count
  == original_eligible_closed_graph_component_count
  == supplemental_eligible_closed_graph_component_count
  > 0
```

An arbitrary `binding_count >= 2` is not proof of completeness.  A numeric
minimum may be used by a test only when independently derived from the selected
closed graph, never as authority to create extra bindings.

### 5.3 Unmatched meanings

An unmatched component may remain distinct while another subgraph binds only
when it is disconnected from the mapped closure on both roles.

If a type, direction, endpoint, affected-graph, granularity, safety, or
ambiguity mismatch occurs inside a connected closure, that entire connected
candidate is ineligible.  Other truly independent closed components may still
be evaluated.  If no eligible component remains, the formal result is an empty
witness and no equivalence.

## 6. Reconciled positive-input contract

### 6.1 Full owner-chain positive

The canonical full-path positive is:

```text
INDEPENDENT_ROLE_LOCAL_FULL_TYPED_GRAPH_REPLAY
```

Required construction:

- create two independent input bundles with the same approved test-local
  semantic material;
- independently build Evidence Ledger, resolver, Grounded Plan, and
  source-local witness for each bundle;
- assign `original_input` and `supplemental_answer` as distinct roles;
- use a non-safety graph with no unmatched eligible component in the selected
  positive;
- independently reproject both complete typed graphs;
- require exact full-graph cardinality, kind, topology, and semantic-dimension
  equality before building bindings.

Reusing one Python object or accepting raw/normalized equality is not proof.
The role-local owners must independently reproduce the same complete typed
graph.

Expected full-path result:

- non-empty exact graph-complete witness;
- refined snapshot v2 and depth-equivalence v1;
- original / supplemental exact2 active semantic roles;
- all nonstance obligations and source refs remain role-pure and active;
- required coverage remains 100%;
- original reception/control owner remains original-only;
- question decision remains nonsemantic;
- refined depth equals the independently computed original-only depth for the
  all-restated positive;
- refined depth never falls below the original-only floor;
- repeated build and validation are deterministic and body-free.

### 6.2 Non-identical semantic-owner positive

The semantic owner must also retain an independent non-identical positive:

```text
EXPLICIT_REFERENT_PREDICATE_CLOSED_SINGLE_COMPONENT_RESTATEMENT
```

It is eligible only when both roles independently prove:

- one closed component at the same granularity;
- explicit, equal referent/topic identity;
- equal predicate/completion identity;
- equal polarity, modality, temporal scope, quantifier, and degree;
- no relation, unknown, dependent fragment, safety pressure, or connected
  extra component omitted from the proof;
- non-identical surface form;
- no fixture ID, family ID, case cue, first-match batch selector, raw equality,
  or synonym-only proof.

The current dependency-bearing first-match positive is not eligible because
non-empty binding alone does not prove closure or bijection.  It must become an
empty-witness negative in the future corrected RED.

The full-chain graph-replay positive proves owner-chain depth behavior.  The
non-identical owner positive proves that raw equality is not the semantic
authority.  Neither may substitute for the other.

## 7. Future test-only correction surface

No test is changed under this authority.  A separate RED correction/refreeze
may modify only the existing test exact4:

1. `ai/tests/test_emlis_ai_grounded_observation_semantic_restatement.py`
   - keep the closed synthetic typed-graph and tamper matrix;
   - replace the underclosed actual non-identical positive;
   - assert exact projected graph cardinality, kind, semantic dimensions, and
     closure;
   - classify dependent-fragment, connected-extra, and anchor-absent
     completion candidates as empty-witness negatives.
2. `ai/tests/test_emlis_nls_v3_s4_semantic_obligation_inventory.py`
   - use the full role-local graph replay as positive;
   - replace arbitrary minimum count with exact projected graph equality;
   - classify the current default graph as empty-witness negative while
     retaining both roles, obligations, and source refs.
3. `ai/tests/test_emlis_nls_v3_s5_content_selection_stage_context.py`
   - use the reconciled full-path positive;
   - bind exact equivalence lineage and `CONTENT_DEPTH_ONLY` to the depth
     assertion;
   - preserve all obligation decisions/source refs and original reception;
   - strengthen safety incident-edge exclusion and unmatched-meaning
     preservation.
4. `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py`
   - bind the reconciliation evidence and corrected positive;
   - keep semantic owner, Inventory snapshot owner, and Content Selection
     consumer as independent causal REDs;
   - do not use source-string presence or accidental depth equality as proof.

Future source exact3 remains prohibited in that RED authority.  Fixture,
sample, manifest, partition, artifact contract, API, DB, RN, runtime, public,
shared, v1, stopped v2, Detailed Design, and accepted history remain protected.

## 8. Historical evidence disposition

- Commit `e485f4a3c07ec0edeb2c248a74449b95f5017a58` remains immutable history.
- Frozen RED result `5 collected / 1 passed / 4 causal failed / 0 error`
  remains the record of that authority.
- STOP result `2 collected / 1 passed / 1 causal failed / 0 error` remains the
  record that exposed the positive-input conflict.
- Existing receipts and handoffs are not rewritten.
- A future corrected RED must create a new receipt and identify which positive
  classification it supersedes.
- No historical causal failure is converted into GREEN.

## 9. Confirmed facts

- Both entry heads and every required body-free evidence identity were
  available without drift.
- The Detailed Design materialization matched the required SHA-256.
- Parent design, partition separation, owner chain, schemas, effect scope,
  original-only depth floor, and fail-closed empty witness remain coherent.
- The default S4 positive graph is connected and non-isomorphic.
- The semantic-owner actual non-identical positive currently asserts only a
  non-empty result and does not prove closure/cardinality.
- The S5 action-empty positive may be isomorphic, but its exact projected
  cardinality and closure are not frozen.
- No mashos-api file or protected surface was changed, and no test was run.

## 10. Inference

- Independent full typed-graph replay should provide a coherent end-to-end
  positive without weakening the parent contract.
- The existing S5 action-empty form may also satisfy the reconciled contract,
  but this remains a candidate until the next RED independently projects and
  checks exact closure.
- Keeping the conflicting graph as a negative is safer than deleting it,
  because it preserves the evidence that blocks one-to-many and partial
  salvage.

These are design inferences, not implementation or test results.

## 11. Unconfirmed

- Actual projected component count and kind histogram for the corrected
  full-chain positive.
- Availability of a non-identical public input satisfying every explicit
  owner-level proof condition without a case cue.
- Corrected causal RED collection/pass/fail/error counts and failure codes.
- Future implementation feasibility, policy hash, source blobs, GREEN, broad
  regression, Step 0–10 completion, baseline lock, and Cycle acceptance.

## 12. Unwritten

- Test exact4 correction.
- Source exact3 implementation.
- Any GREEN result.
- Canonical closure or successful Step 0–10 completion receipt.
- Baseline event, P1 retry002, P2, fresh batch, exact100, Product Read,
  correction, B6, or Cycle acceptance.
- Raw input/output, quotation, identifiable paraphrase, individual mapping,
  parsed span, private note, body digest, key, or expected surface.

## 13. No-guess boundary

- Do not infer equivalence from equal body, normalized body, synonym list,
  component kind, broad typed shell, or source-local restatement status alone.
- Do not omit a connected relation, unknown, dependent unit, or
  must-separate pressure to salvage matching nuclei.
- Do not reinterpret one-to-many as one-to-one.
- Do not interpret a non-empty partial witness as graph-complete.
- Do not convert an empty witness into implementation failure when the selected
  graph is correctly ineligible.
- Do not convert this read-only reconciliation into test correction,
  implementation, GREEN, or Cycle acceptance.

## 14. Karen opinion

Karen judges the parent contract to be correct and the positive denominator to
be wrong.  The safe correction is to preserve the conflicting graph as an
independent false-collapse negative and use a separately validated, complete
role-local graph as the positive.  This keeps the evidence chain honest and
does not turn similarity into meaning identity.

For Cocolon, this distinction matters beyond the test.  A system that discards
a connected difference merely because another fragment resembles the original
would process a person's words too coarsely.  Empty witness is preferable to
claiming an equivalence that the semantic owner cannot fully prove.

## 15. Next separate authority candidate

Exactly one candidate is presented:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_TYPED_SUBGRAPH_BIJECTION_AND_POSITIVE_INPUT_CONTRACT_RECONCILIATION_RED_CORRECTION_AND_REFREEZE_ONLY
```

It may change only test exact4 and run the minimum causal RED needed to freeze
the corrected positive/negative contract.  Source exact3, implementation,
GREEN, fixture/sample/manifest, protected surface, baseline lock, later Cycle
work, and acceptance remain prohibited.

STOP. Separate approval required.

