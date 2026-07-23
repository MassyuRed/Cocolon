---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch001_step5_cross_role_typed_subgraph_positive_input_red_correction_refreeze
revision_date: "2026-07-23"
authority: "NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_TYPED_SUBGRAPH_BIJECTION_AND_POSITIVE_INPUT_CONTRACT_RECONCILIATION_RED_CORRECTION_AND_REFREEZE_ONLY"
status: "CORRECTED_CAUSAL_RED_REFROZEN_AUTHORITY_STOP"
body_free: true
automatic_progression: false
---

# Step 5 typed-subgraph bijection / positive-input corrected causal RED refreeze

## 1. Result

This authority corrected and refroze only the approved test exact4. It did not
implement production source and did not run GREEN.

~~~text
CORRECTED_CAUSAL_RED_REFROZEN
AUTHORITATIVE_FINAL_CAUSAL_RED_7_COLLECTED_1_PASS_6_CAUSAL_FAIL_0_ERROR
UNEXPECTED_FINAL_FAILURE_COUNT_0
TEST_EXACT4_CHANGE_COUNT_4
FUTURE_SOURCE_EXACT3_CHANGE_COUNT_0
PROTECTED_SURFACE_CHANGE_COUNT_0
IMPLEMENTATION_NOT_AUTHORIZED
GREEN_NOT_RUN
SUCCESSFUL_STEP0_10_COMPLETION_RECEIPT_COUNT_0
SOURCE_BASELINE_UNLOCKED
FRESH_BATCH_RESERVED_NOT_CREATED
CYCLE001_NOT_ACCEPTED
AUTHORITY_STOP
~~~

The single pass is the authority/surface identity node. The six failures are
the direct and recovery projections of the three intended owner-chain gaps:

- semantic proof owner: 2 causal failures;
- witness / alias / refined-snapshot owner: 2 causal failures;
- depth-only consumer: 2 causal failures.

There was no collection error and no unrelated final failure.

## 2. Entry identity and evidence chain

Heads at authority entry and immediately before write:

- Cocolon main: 3bd0bcb8077ecaab07b04e913bdffaa2f66f3c7f
- mashos-api main: e485f4a3c07ec0edeb2c248a74449b95f5017a58
- related drift: exact0

Required body-free evidence:

- current authority blob: 662ba8d1bbc67a23dc155cfdd7e163aadbe8af7c
- Execution and Closure Plan blob: 748b787977e059d1c10b3d83b290429152a69ac3
- reconciliation result / receipt / handoff blobs:
  691ab5bf5be7fd51b6a1d4683bd167ba2c5f37ac /
  a33d26fa141d059fedbe47b031927a1444ddcde4 /
  d67f265ca06441009a064ac2179a76431774dd57
- parent-design result / receipt / handoff blobs:
  df8d2e49287554b3da2867afde634b3afbec4a37 /
  fdb64ba8ddab5b050556eb8025b77fd026c7aa50 /
  ed9f5725ebd843bd258ef767dd0b7a7b74df8277
- predecessor causal RED receipt blob:
  e78d528600fef27ce3de52ef91c1118d6866d2ed
- Detailed Design SHA-256:
  6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc

Detailed Design §7.5, §8.2, §9.1, §9.2, §22.1, and the Step 5 STOP
conditions were rechecked. Parent design and accepted history were unchanged.

## 3. Refrozen owner chain and schemas

Owner chain:

1. ai/services/ai_inference/emlis_ai_grounded_observation_semantic_restatement_v3.py
2. ai/services/ai_inference/emlis_ai_semantic_obligation_inventory_v3.py
3. ai/services/ai_inference/emlis_ai_content_selection_v3.py

Frozen schemas:

- cocolon.emlis.nls_v3.grounded_cross_role_semantic_restatement_witness.v1
- cocolon.emlis.nls_v3.grounded_cross_role_semantic_restatement_adapter.20260723.v1
- cocolon.emlis.nls_v3.cross_role_semantic_depth_equivalence.v1
- cocolon.emlis.nls_v3.refined_source_snapshot.v2

The proof basis remains COMPLETE_BODY_FREE_TYPED_COMPONENT_BIJECTION and the
effect remains CONTENT_DEPTH_ONLY.

## 4. Corrected positive and closure contract

The full owner-chain positive is
INDEPENDENT_ROLE_LOCAL_FULL_TYPED_GRAPH_REPLAY. Both roles independently build
their bundle, ledger, resolver, Grounded Plan, source-local witness, and
complete typed graph. Exact cardinality, kind histogram, every typed dimension,
relation topology, unknown affected graph, topic mapping, closure, and
one-to-one/onto bindings are required.

The independent semantic-owner positive is
EXPLICIT_REFERENT_PREDICATE_CLOSED_SINGLE_COMPONENT_RESTATEMENT. It requires
non-identical public test-local surfaces, explicit equal referent/topic and
predicate/completion identities, equal polarity/modality/time/quantifier/degree,
one closed connected component at the same granularity, and inclusion of every
incident unknown boundary. The body and body-derived digest are forbidden as
source cues.

The anchor-absent same-shell candidate, dependent underclosure, connected
non-isomorphic legacy graph, ambiguity, one-to-many, and must-separate closure
remain empty-witness negatives.

A partial match is eligible only when its bound nucleus closure equals its
exact bound IDs on both roles. Every unmatched nucleus, relation, and unknown
must be disconnected from that closure, remain role-pure, retain exact
obligation source-reference coverage, remain selected, and preserve required
coverage.

## 5. Refrozen negative codes

The exact stable set is:

~~~text
CROSS_ROLE_SEMANTIC_RESTATEMENT_WITNESS_INVALID
CROSS_ROLE_SEMANTIC_RESTATEMENT_WITNESS_TYPE_INVALID
CROSS_ROLE_SEMANTIC_RESTATEMENT_WITNESS_SCHEMA_MISMATCH
CROSS_ROLE_SEMANTIC_RESTATEMENT_WITNESS_ADAPTER_MISMATCH
CROSS_ROLE_SEMANTIC_RESTATEMENT_PLAN_BINDING_MISMATCH
CROSS_ROLE_SEMANTIC_RESTATEMENT_SOURCE_WITNESS_MISMATCH
CROSS_ROLE_SEMANTIC_RESTATEMENT_ROLE_PAIR_INVALID
CROSS_ROLE_SEMANTIC_RESTATEMENT_COMPONENT_UNRESOLVED
CROSS_ROLE_SEMANTIC_RESTATEMENT_COMPONENT_KIND_MISMATCH
CROSS_ROLE_SEMANTIC_RESTATEMENT_AMBIGUOUS
CROSS_ROLE_SEMANTIC_RESTATEMENT_GRAPH_MISMATCH
CROSS_ROLE_SEMANTIC_RESTATEMENT_PROOF_CODE_INVALID
CROSS_ROLE_SEMANTIC_RESTATEMENT_PROOF_BASIS_INVALID
CROSS_ROLE_SEMANTIC_RESTATEMENT_EFFECT_SCOPE_INVALID
CROSS_ROLE_SEMANTIC_RESTATEMENT_DEPTH_CONTRACT_INVALID
CROSS_ROLE_SEMANTIC_RESTATEMENT_BODY_FREE_REQUIRED
CROSS_ROLE_SEMANTIC_RESTATEMENT_ORDER_INVALID
CROSS_ROLE_SEMANTIC_RESTATEMENT_WITNESS_HASH_MISMATCH
~~~

The tests also freeze referent/topic, polarity, modality, time,
predicate/completion, quantifier/degree, subset/superset, relation
type/direction/endpoints, unknown affected graph, safety, ambiguity,
role/kind/ID, question-decision, lineage/tamper, stage drift, snapshot
injection/removal, obligation decision, active-role drop, body/case cue, and
ordering as independent false-collapse boundaries.

## 6. Test execution ledger

Six exact7 command executions occurred while correcting the test-only contract.
Five were construction/refinement runs; one is the authoritative final run.
The first construction run exposed a test-local independent-bundle identity
collision. It was corrected only inside test exact4; no source or protected
surface was changed. Every later authoritative-shape run produced the same
three causal owner codes. The final run is:

~~~text
collected: 7
passed: 1
causal failed: 6
error: 0
unexpected: 0
warning: 1 non-causal deprecation warning

RECOVERY_EPOCH001_S5_CROSS_ROLE_SEMANTIC_RESTATEMENT_OWNER_NOT_PROVED: 2
RECOVERY_EPOCH001_S5_CROSS_ROLE_REFINED_SNAPSHOT_BINDING_NOT_PROVED: 2
RECOVERY_EPOCH001_S5_CROSS_ROLE_DEPTH_NONINFLATION_NOT_PROVED: 2
~~~

## 7. Confirmed facts

- mashos-api result head is d9a65dc7d5ee329ba3387c8659f435f3fb9f8e8d.
- Only test exact4 changed.
- The future source exact3 SHA-256 and Git blobs remained unchanged.
- emlis_ai_refined_source_partition_v3.py, artifact contract, fixtures,
  samples, manifests, API/DB/RN/runtime/public/shared routes, v1, stopped v2,
  historical receipts, Detailed Design, and accepted authority history were
  unchanged.
- cross_source_bindings remains exact empty, question decision remains
  nonsemantic, both active semantic roles remain, original reception/control
  ownership remains original-only, and obligation/source references and
  required coverage are not reduced.
- Final RED failures are causal and body-free.

## 8. Inference

- Source exact3 implementation is required to resolve the three causal owner
  gaps. The RED does not choose a unique internal algorithm.
- Independent full typed-graph replay is the smallest owner-chain positive that
  preserves the reconciled parent contract.
- Depth-only consumption prevents equivalence from becoming permission to omit
  meaning or change control ownership.

These are inferences, not GREEN or completion evidence.

## 9. Unconfirmed

- Source exact3 implementation feasibility and policy hash.
- GREEN and broad regression.
- Successful Step 0–10 completion receipt.
- Source baseline lock, P1 retry002, P2, fresh batch, exact100, Product Read,
  correction, B6, and Cycle acceptance.

## 10. Unwritten

- No private body, output, quotation, identifiable paraphrase, individual
  semantic mapping, parsed span, private note, body digest, key, or expected
  surface is recorded here.
- No production implementation, GREEN claim, successful completion receipt,
  baseline event, later Cycle work, or acceptance claim is written.

## 11. No-guess boundary

- Raw or normalized equality, synonym lists, broad typed shells,
  case/family/fixture cues, and source-local status are not equivalence proof.
- A connected relation, endpoint, unknown, dependent unit, or safety pressure
  cannot be removed to salvage a match.
- One-to-many is not one-to-one.
- A non-empty partial witness is not graph-complete without exact closure.
- Empty witness for an ineligible graph is not implementation failure.
- RED existence is not Step completion or Cycle acceptance.

## 12. Karen opinion

The corrected RED now asks the semantic owner to prove meaning identity, the
Inventory owner to bind that proof into the current graph, and Content
Selection to consume it only for depth. It does not let similarity erase a
person's connected difference, and it does not let repetition inflate depth.
That is the smallest responsibility split consistent with Cocolon.

## 13. Next separate authority candidate

Exactly one candidate is presented:

~~~text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_TYPED_SUBGRAPH_BIJECTION_AND_POSITIVE_INPUT_CONTRACT_RECONCILIATION_IMPLEMENTATION_AND_GREEN_ONLY
~~~

It is not approved by this document. It may implement source exact3 and run the
authorized GREEN only after separate approval. It must not automatically
advance to completion, baseline lock, later Cycle work, or acceptance.

STOP.
