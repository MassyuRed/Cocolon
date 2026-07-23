---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch001_step5_cross_role_bound_selected_intersection_content_depth_only_contract_reconciliation
revision_date: "2026-07-23"
authority: "NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_BOUND_SELECTED_INTERSECTION_AND_CONTENT_DEPTH_ONLY_CONTRACT_RECONCILIATION_READ_ONLY"
status: "BOUND_SELECTED_INTERSECTION_AND_CONTENT_DEPTH_ONLY_RECONCILED_AUTHORITY_STOP"
body_free: true
automatic_progression: false
---

# Step 5 bound-selected intersection / CONTENT_DEPTH_ONLY reconciliation

## 1. Result

This read-only authority reconciles the frozen S5 selected-intersection
assertion with the parent `CONTENT_DEPTH_ONLY` contract.  Parent design,
production source, and tests remain unchanged.

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
SOURCE_CHANGE_COUNT_0
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
Cocolon main:    cad49a542aa60d2cbac9497d00c85cf7857a7316
mashos-api main: f2e73dfcc0b1f0091f077c41afbf9110e4b1b333
RELATED_DRIFT_0
```

Required body-free evidence:

- current authority blob:
  `5bd9be7d15f7691aece89d268431f044dc4a5d3e`
- Execution and Closure Plan blob:
  `e86a66aa71ea3fa67a923e4e52aac4a40241f8db`
- latest implementation/GREEN STOP result / receipt / handoff:
  `8c5254e267d9bddf10f681784ae0a901e2d4122f`,
  `a75164968cc49a073c0f1413792c4205c041a9a7`,
  `352ba688754e15e11cdd354623c2c84aff91d72e`
- corrected causal RED result / receipt / handoff:
  `bbaa8981883c773f8b20cff408eda03078998013`,
  `0f8319c6519e6e38bd5139d50d292038573b5271`,
  `d2214c0097eebb6b3d2e024643a6b262cacdb4f7`
- parent-design addendum / receipt / handoff:
  `df8d2e49287554b3da2867afde634b3afbec4a37`,
  `fdb64ba8ddab5b050556eb8025b77fd026c7aa50`,
  `ed9f5725ebd843bd258ef767dd0b7a7b74df8277`
- predecessor causal RED receipt:
  `e78d528600fef27ce3de52ef91c1118d6866d2ed`
- Detailed Design SHA-256:
  `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc`

Detailed Design §7.5, §8.2, §9.1, §9.2, Step 5 STOP, §22.1,
§22.5, and §22.6 were rechecked.  The EmlisAI correction policy, current
Cocolon work rules, and Karen operating principles were also rechecked.

## 3. Cycle and owner-chain position

This remains a Step 5 prerequisite inside Recovery Epoch 001.  It does not
complete Step 5 or Step 0–10 and does not accept Cycle 001.

The selected owner chain remains unchanged:

1. semantic proof owner:
   `ai/services/ai_inference/emlis_ai_grounded_observation_semantic_restatement_v3.py`
2. witness / alias / refined-snapshot owner:
   `ai/services/ai_inference/emlis_ai_semantic_obligation_inventory_v3.py`
3. depth-only consumer:
   `ai/services/ai_inference/emlis_ai_content_selection_v3.py`

The proof remains a complete one-to-one/onto body-free typed-component
bijection over the eligible incident-relation and unknown-affected-graph
closure.  Its effect remains exactly `CONTENT_DEPTH_ONLY`.

## 4. Reconciled contract

The parent design separates five responsibilities:

| responsibility | required proof | witness may control it |
|---|---|---|
| endpoint representation | each binding endpoint resolves to at least one role-local nonstance obligation | no; this is Inventory preservation |
| required selection | every required bound obligation is selected | no; this is required coverage |
| active source roles | original and supplemental each retain an active nonstance obligation | no; this is Content Selection stage policy |
| depth identity | equivalent typed components are not double-counted; original-only depth is the floor | yes |
| safety / unmatched meaning | must-separate closure remains unbound; unmatched meaning remains distinct | no collapse |

No parent or Detailed Design requirement says that every role must have a
*witness-bound* selected obligation.  The frozen parent instead says that
witness use must not change obligation decision status or the
`selected` / `integrated_into` policy.

The current S5 helper correctly proves role-local endpoint representation,
required-bound coverage, role separation, and original reception ownership.
It then adds this stronger condition:

```python
assert all(
    bound_ids & selected
    for bound_ids in bound_obligation_ids_by_role.values()
)
```

For the frozen safety positive, the legally witnessable outside-safety closure
has, per role:

```text
WITNESS_BINDING_COUNT_3
BOUND_OBLIGATION_COUNT_3
BOUND_REQUIRED_OBLIGATION_COUNT_0
BOUND_SELECTED_OBLIGATION_COUNT_0
BOUND_DEFERRED_OBLIGATION_COUNT_3
```

The selected safety obligations belong to the incident/affected
must-separate closure that must remain disjoint from witness bindings.
Therefore the selected-intersection condition cannot be satisfied through
source exact3 without changing an optional obligation decision, changing
requiredness/source refs, or binding protected safety components.

### 4.1 Exact future S5 correction

At current S5 blob
`7886477ff74ab10eb761fc1a5273e2b99f52fce0`, current lines 1306–1309,
replace only the selected intersection:

```python
assert all(
    bound_ids
    for bound_ids in bound_obligation_ids_by_role.values()
)
```

Equivalently, remove only ` & selected`.  Do not delete the aggregate
role-presence assertion and do not add a source workaround.

This proves that both witness endpoint roles remain represented in the
obligation ledger while leaving selection to the unchanged Content Selection
policy.

### 4.2 Assertions that remain unchanged

The correction must preserve:

- non-empty validated equivalence and complete typed graph bijection;
- every binding endpoint resolving to a non-reception obligation row;
- exact role-local source refs for every bound row;
- non-empty role-local bound-obligation sets and their disjointness;
- `bound_obligation_ids & required <= selected`;
- global required coverage 100%;
- `REFINED_SOURCE_ROLES_MUST_BOTH_REMAIN_ACTIVE`;
- exact original / supplemental selected nonstance role proof in the positive;
- original-only reception target and control ownership;
- normal/refined depth equality where required and original-only depth floor;
- must-separate reciprocity and closure exclusion from witness bindings;
- unmatched nucleus / relation / unknown preservation, role-local references,
  selection-policy expectations, and layered depth;
- required supplemental omit / defer / integrate rejection;
- wrong effect-scope, hash, lineage, parent, and body-free/cue rejection;
- deterministic rebuild and all independent false-collapse negatives.

The unmatched-selection assertion is not the stopped bound-selected
intersection and is not changed by this reconciliation.  It remains an
independent unmatched-meaning positive.  Any future unexpected conflict there
must STOP rather than be silently broadened into this correction.

### 4.3 Why parent and source remain unchanged

- Amending parent design to make witness control selection would contradict
  the frozen `CONTENT_DEPTH_ONLY` purpose.
- Selecting optional witness-bound obligations in source exact3 would change
  decision status to satisfy a test.
- Binding safety closure components would weaken the independent
  must-separate negative.
- Removing the role-aggregate check entirely is larger than necessary and
  loses an explicit representation assertion.

The exact expression above is therefore the smallest contract-preserving
disposition.

## 5. Future correction/refreeze surface

No mashos-api change occurs under this read-only authority.  The next separate
authority may modify only test exact2:

1. `ai/tests/test_emlis_nls_v3_s5_content_selection_stage_context.py`
   - replace only `bound_ids & selected` with `bound_ids` in the one frozen
     aggregate assertion;
   - preserve every surrounding assertion listed in §4.2.
2. `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py`
   - bind this reconciliation and the latest STOP evidence;
   - freeze the exact changed-path surface and corrected assertion rule;
   - preserve the exact7 node set, phase expectations, historical source
     lineage, source exact3 surface, and protected surfaces.

Current immutable test identities:

| path | Git blob |
|---|---|
| `ai/tests/test_emlis_nls_v3_s5_content_selection_stage_context.py` | `7886477ff74ab10eb761fc1a5273e2b99f52fce0` |
| `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py` | `4c295bab09965194608947585da559198b5a3e2b` |

The semantic and S4 tests remain unchanged:

- `ai/tests/test_emlis_ai_grounded_observation_semantic_restatement.py`
  blob `49864c6ee6a944c603da21ebd18ba60633e56fb9`
- `ai/tests/test_emlis_nls_v3_s4_semantic_obligation_inventory.py`
  blob `3f0bd59facec541d8bad09d1af9410344c753e45`

Source exact3 remains byte-identical during the correction/refreeze:

| path | Git blob |
|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_semantic_restatement_v3.py` | `d28e2ab3086fa09a62c8dbdb3d887a7bff116c78` |
| `ai/services/ai_inference/emlis_ai_semantic_obligation_inventory_v3.py` | `685ff7ccc8f5d7fd04dc9ed301b1649b608a868a` |
| `ai/services/ai_inference/emlis_ai_content_selection_v3.py` | `7172a628f5ecdfb6ba888c36d42a6a62d0d7c22e` |

## 6. Future RED denominator

The authoritative matrix remains the lineage-aware exact7 already frozen:

```text
LINEAGE_AWARE_AUTHORITY_SURFACE_1
SEMANTIC_OWNER_DIRECT_AND_RECOVERY_2
INVENTORY_OWNER_DIRECT_AND_RECOVERY_2
CONTENT_CONSUMER_DIRECT_AND_RECOVERY_2
TOTAL_7
```

Required future correction/refreeze result:

```text
7_COLLECTED
1_LINEAGE_PASS
6_CAUSAL_FAIL
0_ERROR
0_UNEXPECTED
```

The future test correction must not convert a causal RED into an unrelated
failure or collection error.  The later implementation/GREEN authority, if
separately approved, still requires exact7 pass 7 / fail 0 / error 0 /
unexpected 0.

No test was run under this read-only authority.

## 7. Protected and unchanged surface

- parent-design addendum, receipt, and handoff;
- Detailed Design and accepted authority history;
- source exact3 under the next correction/refreeze;
- `emlis_ai_refined_source_partition_v3.py`;
- `emlis_ai_nls_v3_artifact_contract.py`;
- fixture / sample / manifest / generated batch;
- API / DB / RN / runtime / public / shared route;
- v1 production owner and stopped v2;
- historical result / receipt / handoff;
- question-decision nonsemantic boundary;
- partition `cross_source_bindings == []`;
- obligation decisions, requiredness, source roles/refs, original reception,
  and control ownership.

Canonical closure generation, successful completion receipt, source baseline
lock, P1 retry002, P2, fresh batch, formal exact100, Product Read, correction,
B6, and Cycle acceptance remain unauthorized.

## 8. Confirmed facts

- Both main heads matched the approved authority-entry identities.
- Required parent, predecessor, current-authority, plan, and test evidence was
  available and mutually consistent.
- Parent §4.5 limits witness effect to depth identity and freezes obligation
  decision status and selection policy.
- Current Content Selection independently rejects loss of either active
  refined source role.
- The S5 helper independently preserves bound-row presence, required-bound
  selection, source-role separation, and original reception.
- The frozen extra assertion requires a witness-bound/selected intersection
  for each role.
- The safety positive has only optional/deferred obligations in the legally
  witnessable closure and selected obligations only inside the unbindable
  must-separate closure.
- The exact future S5 correction removes only ` & selected`.
- No source, test, protected surface, or mashos-api file changed and no test
  ran under this authority.

## 9. Inference

- The stopped assertion likely conflated “both source roles remain active”
  with “both roles have a selected obligation inside the witness-bound set.”
- Keeping the role-aggregate presence check while removing selection coupling
  is the smallest expression of the parent contract.

These explain the disposition; they do not authorize the future edit.

## 10. Unconfirmed

- Future corrected test blobs and result head.
- Future correction/refreeze exact7 result.
- Future source implementation feasibility, source/policy hashes, and exact7
  GREEN.
- Whether later broad regression reveals a separate unmatched-selection or
  historical-policy issue.
- Successful Step 0–10 completion, source-baseline lock, later Cycle work, and
  Cycle acceptance.

## 11. Unwritten

- No test correction or production source implementation is written to
  mashos-api.
- No RED refreeze, GREEN, broad regression, completion, baseline, fresh-batch,
  exact100, Product Read, correction, B6, or Cycle-acceptance claim is written.
- No raw input/output, quotation, identifiable paraphrase, individual mapping,
  parsed span, private note, body digest, key, or expected surface is recorded.

## 12. No-guess boundary

- Do not make witness control selection, requiredness, omission, deferral,
  integration, source refs, or source roles.
- Do not bind any must-separate incident/affected closure.
- Do not remove or weaken required-bound coverage or both-active-role proof.
- Do not change unmatched assertions without a separately evidenced conflict.
- Do not change semantic/S4 tests, source exact3, parent, or protected surfaces
  under the next correction/refreeze.
- Do not guess future test/source/policy/result identities.
- Do not treat future targeted RED or GREEN as Step completion, baseline lock,
  or Cycle acceptance.

## 13. Mash required work

No external implementation or real-device input is required to complete this
read-only reconciliation.  To continue, Mash need only approve the exactly one
separate correction/refreeze authority in §15.  No edit or test run should
start before that approval.

## 14. Karen opinion

Karen judges the exact token removal to be the honest correction.  A semantic
witness should prove that two typed structures mean the same thing for depth;
it should not decide which optional obligation becomes visible.  Keeping an
explicit non-empty obligation set for each endpoint role preserves evidence
without allowing a depth proof to rewrite Content Selection policy.

Changing source to satisfy the old intersection would create a green test by
crossing the very boundary the test is supposed to protect.

## 15. Exactly one next separate authority candidate

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_BOUND_SELECTED_INTERSECTION_AND_CONTENT_DEPTH_ONLY_CONTRACT_RECONCILIATION_RED_CORRECTION_AND_REFREEZE_ONLY
```

It is not approved by this result.  It may modify only the test exact2 in §5
and run only the frozen exact7 RED.  Source implementation, GREEN, broad
regression, completion, baseline lock, later Cycle work, and acceptance remain
prohibited.

STOP.
