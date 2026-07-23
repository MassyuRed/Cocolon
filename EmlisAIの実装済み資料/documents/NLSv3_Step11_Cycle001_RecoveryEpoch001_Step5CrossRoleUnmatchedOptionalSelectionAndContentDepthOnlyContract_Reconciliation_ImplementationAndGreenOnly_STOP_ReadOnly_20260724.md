---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch001_step5_cross_role_unmatched_optional_selection_content_depth_only_implementation_green_stop
revision_date: "2026-07-24"
authority: "NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_UNMATCHED_OPTIONAL_SELECTION_AND_CONTENT_DEPTH_ONLY_CONTRACT_RECONCILIATION_IMPLEMENTATION_AND_GREEN_ONLY"
status: "APPROVED_EXACT1_IMPLEMENTATION_REFLECTED_TARGETED_EXACT7_GREEN_STEP5_NOT_COMPLETED_AUTHORITY_STOP"
body_free: true
automatic_progression: false
---

# Step 5 unmatched optional selection / CONTENT_DEPTH_ONLY implementation and GREEN

## 1. Result

The approved implementation was reflected to `MassyuRed/mashos-api`.
The final GitHub materialization satisfies the corrected Step 5 targeted
contract:

```text
APPROVED_SOURCE_EXACT1_IMPLEMENTED
WITNESS_EFFECT_SCOPE_CONTENT_DEPTH_ONLY_PRESERVED
REQUIRED_AND_REQUIRED_RECEPTION_TARGET_SELECTION_PRESERVED
OPTIONAL_UNMATCHED_DECISION_STATUS_PRESERVED
AUTHORITATIVE_EXACT7_7_OF_7_GREEN
TEST_EXACT4_CHANGE_COUNT_0
PROTECTED_SURFACE_CHANGE_COUNT_0
BROAD_REGRESSION_NOT_RUN
STEP5_NOT_COMPLETED
SOURCE_BASELINE_UNLOCKED
SUCCESSFUL_STEP0_10_COMPLETION_RECEIPT_COUNT_0
CYCLE001_NOT_ACCEPTED
NEXT_AUTHORITY_UNSELECTED
AUTHORITY_STOP
```

This is a targeted implementation/GREEN result only. It is not a Step 5
completion receipt, source-baseline lock, canonical closure, formal exact100,
Product Read, B6, or Cycle 001 acceptance.

## 2. Entry identity and evidence chain

### 2.1 Entry heads

```text
Cocolon main:
69e8bbf830b99d447bd875ae2d857d9aee53c3ba

mashos-api main:
a3d43433841f58313c3cd381ce779fa0a14cdbd7

RELATED_DRIFT_COUNT:
0
```

Both heads and all governing blobs were fetched again immediately before the
first GitHub source write.

### 2.2 Governing evidence

- current authority blob:
  `29650691d5747152228f8214d1178fbb35de85d3`
- Execution and Closure Plan blob:
  `0ed0711e5611d04b96236dd0f6ccb899a13fbcd3`
- predecessor corrected RED result / receipt / handoff blobs:
  `ab1987233c8932398308e5efa323fd6a994fe661` /
  `8475b1b3aa542a1f702186a8e73004085d96054c` /
  `8cddfcaebf46d3780b62a4913d87f179d6f842cc`
- parent-design addendum blob:
  `df8d2e49287554b3da2867afde634b3afbec4a37`
- attached long-term roadmap SHA-256:
  `04fb9e4e11af2b1530d03d95d8e959ba644503722f72094a289bde1d4368ce5b`
- attached Detailed Design SHA-256:
  `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc`
- attached Execution and Closure Plan snapshot SHA-256:
  `31682e71ac047ac5f2f329d62ebc51b471bdcb00430a6ab35bcfb934c1438ca7`

The attached plan snapshot was used as supporting context. The later
append-only GitHub plan entry and current-authority file governed the exact
current pointer.

## 3. Approved implementation boundary

### 3.1 Changed path exact1

```text
ai/services/ai_inference/emlis_ai_content_selection_v3.py
```

The builder and validator previously formed `forced_active_ids` as:

```text
required stance / required reception target closure
UNION
all cross-role unmatched obligation IDs
```

They now form it only from:

```text
required stance / required reception target closure
```

This removes witness-derived unmatched IDs from decision authority. It does
not remove unmatched obligations, merge meanings, change source roles/refs, or
weaken the content-depth witness.

### 3.2 Necessity

The corrected RED oracle fixed:

```text
independently selected unmatched obligations
  =
unmatched obligations
  INTERSECT
(
  required obligation IDs
  UNION
  targets of required bound reception obligations
)
```

The remaining optional unmatched obligations must retain:

```text
decision_status:
deferred_by_budget

decision_reason_code:
OPTIONAL_DEFERRED_BY_BUDGET

integrated_into_obligation_id:
None
```

The old union selected all unmatched obligations merely because a
`CONTENT_DEPTH_ONLY` witness existed. Removing that union at the two
builder/validator sites is therefore necessary and sufficient to restore the
parent decision boundary.

### 3.3 Final source identity

| state | Git blob | SHA-256 |
|---|---|---|
| predecessor | `6096dd41e46fe9d9abc7695b49b3125b2f87cea1` | `3c9c51a9e514169a1b17d408329b3d2d526bab08b8663e0fb2606ae358eec3bb` |
| final | `995feb6066842f44b6f69b71b2b97a6109a7e40c` | `81df9f3205e14efe6de1eac5d2a92c7975df3d51af4451a8059f066aaa223d8b` |

Final compare from predecessor to result:

```text
status: ahead
ahead_by: 2
behind_by: 0
changed_path_count: 1
additions: 2
deletions: 14
```

## 4. GitHub write-integrity incident and correction

The first contents-API write accidentally appended one local character-count
line to the source because the command runner merged stderr into the captured
text stream.

```text
first write commit:
38f3beb421df4c5da86f87a715b97e7a45f7f07e

unexpected first-write blob:
8abc4c2bdc921437474eda932925bf2b1f407bd6

expected blob:
995feb6066842f44b6f69b71b2b97a6109a7e40c
```

The mismatch was detected by an immediate remote-fetch byte comparison. No
test or evidence evaluation was accepted from that transient tree. The current
blob was then used as the required optimistic-concurrency predecessor for a
non-force correction:

```text
correction / final result commit:
5033435bc94c4c0260cb3193a3c64b177971ceb5

final tree:
704fa0b97cd2737d5fe108b5624889a5ebaba2d6

final source blob:
995feb6066842f44b6f69b71b2b97a6109a7e40c
```

The final fetched bytes match the locally verified candidate exactly. Git
history was not force-rewritten or hidden.

## 5. Protected identity

The final GitHub tree retains these protected source owners:

| path | Git blob | SHA-256 |
|---|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_semantic_restatement_v3.py` | `cd2caeac0dfa4b502c798e1e5f65653033c96e2c` | `348003adbe7991de1717a8a2a7ca9d26a04e7f42caccdef2e4a0f31634f171b6` |
| `ai/services/ai_inference/emlis_ai_semantic_obligation_inventory_v3.py` | `241d38331b00fd6c7bd17d4c8a30b6b52b0c3f69` | `ddc42e6f30c46876b4ccc6c7f936c6cc7dcc6f394cbc2d9825694c7617b465f9` |

The authoritative test exact4 also remains unchanged:

| path | Git blob | SHA-256 |
|---|---|---|
| `ai/tests/test_emlis_ai_grounded_observation_semantic_restatement.py` | `49864c6ee6a944c603da21ebd18ba60633e56fb9` | `28e74e82e7351a4e3f92345a30cf21e0a59aeb1b820a639baad509316ff3215b` |
| `ai/tests/test_emlis_nls_v3_s4_semantic_obligation_inventory.py` | `3f0bd59facec541d8bad09d1af9410344c753e45` | `6aeba82aae9615f089a7fcf034efc317be4988011c6c7239460b6f5538fee3b0` |
| `ai/tests/test_emlis_nls_v3_s5_content_selection_stage_context.py` | `52e1b069f21861a89a1a22bc97de422cd2ac314d` | `ea18716e54a1e85c84b78d85fe8a8ff269d14c911deef08b89013277293fa475` |
| `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py` | `7f7f82a048562034189a2514c281c7853c754024` | `3893ac2333b5ae0fe970cef705c331ffb92d6e3913eb785218afa92f7604859d` |

Partition/artifact owners, fixture/sample/manifest, API/DB/RN/runtime/public/
shared routes, historical evidence, accepted authority history, and the
Detailed Design were not changed.

## 6. Authoritative exact7

### 6.1 Frozen predecessor RED reproduced

The same seven node IDs were run from GitHub predecessor
`a3d43433841f58313c3cd381ce779fa0a14cdbd7`:

```text
7 collected
5 passed
2 causal failed
0 error
0 unexpected
0 warning
9.98 seconds
```

Both failures emitted:

```text
RECOVERY_EPOCH001_S5_CROSS_ROLE_UNMATCHED_OPTIONAL_SELECTION_POLICY_NOT_PROVED
```

### 6.2 Final GitHub materialization GREEN

The final GitHub result head was fetched into a fresh read-only verification
tree and the same exact seven node IDs were run:

```text
7 collected
7 passed
0 failed
0 error
0 unexpected
0 warning
11.36 seconds
```

The direct Content Selection node and recovery Content consumer node are the
only predecessor causal failures that changed to PASS. Semantic owner,
inventory owner, lineage/surface, and their recovery owner nodes remained
PASS.

No broad regression, full backend suite, canonical current-closure run, formal
exact100, Product Read, correction, or B6 run was executed or claimed.

## 7. Confirmed facts

1. The approved entry heads and governing evidence matched without related
   drift immediately before source write.
2. The corrected RED was reproduced as 5 PASS / 2 causal FAIL with the frozen
   stable code.
3. The final predecessor-to-result diff changes only the authorized Content
   Selection path.
4. Builder and validator no longer use cross-role unmatched witness IDs as
   forced decision authority.
5. Required obligations and targets of required bound reception obligations
   remain independently selected.
6. Optional unmatched obligations retain their existing deferred status while
   their meanings and content-depth witness remain present.
7. The final GitHub bytes have blob
   `995feb6066842f44b6f69b71b2b97a6109a7e40c`.
8. The authoritative exact7 is 7/7 GREEN against the final GitHub result head.
9. Protected source/test identities are unchanged.
10. The first malformed write was corrected transparently without force
    update; no result was accepted from the malformed tree.

## 8. Inference

None is needed for the implementation disposition. The root cause, final diff,
owner boundaries, and GREEN result are directly observed.

The remaining project-level conclusion is intentionally limited: targeted
contract alignment does not by itself establish all Step 5 closure inputs.

## 9. Unconfirmed

- Step 5 completion and a successful Step 0–10 completion receipt.
- Source-baseline lock and canonical current closure.
- P1 retry002, G2/P2, fresh-batch creation, formal exact100, Product Read,
  correction, and B6.
- Cycle 001 acceptance.
- The identity or necessity of any next authority.

## 10. Karen opinion

This is the smallest correct repair. A semantic witness may prove that two
role-local structures support the same content depth, but it must not silently
decide which optional obligations are selected for the response. Removing
only that decision leak preserves both meanings: the witness remains useful,
and optional selection remains owned by the selection policy.

The write-integrity incident must remain visible in the evidence chain. The
final tree is correct and independently reverified, but hiding the transient
malformed commit would be incompatible with evidence-based trust.

## 11. Mash required work

No Mash-side device operation, raw-body review, or external input is required
to complete this approved authority.

Any further work requires a separately named and approved authority. The next
authority is intentionally:

```text
UNSELECTED / SEPARATE APPROVAL REQUIRED
```

## 12. STOP

- implementation/GREEN authority: completed
- targeted exact7: GREEN
- Step 5: `NOT_COMPLETED`
- successful Step 0–10 completion receipt count: `0`
- source baseline: `UNLOCKED`
- fresh batch: `RESERVED_NOT_CREATED`
- Cycle 001: `NOT_ACCEPTED`
- automatic progression: `false`
- next authority: `UNSELECTED`

STOP.
