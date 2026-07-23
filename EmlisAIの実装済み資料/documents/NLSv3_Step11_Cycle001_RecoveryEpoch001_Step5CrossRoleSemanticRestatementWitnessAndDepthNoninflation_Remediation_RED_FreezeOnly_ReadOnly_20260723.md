---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch001_step5_cross_role_remediation_red_freeze
revision_date: "2026-07-23"
authority: "NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_SEMANTIC_RESTATEMENT_WITNESS_AND_DEPTH_NONINFLATION_REMEDIATION_RED_FREEZE_ONLY"
status: "RED_FROZEN_AUTHORITY_STOP"
body_free: true
automatic_progression: false
---

# Step 5 cross-role semantic-restatement / depth-noninflation remediation RED freeze

## 1. Result

このauthorityで、選択済みowner chainに対するcausal REDをtest exact4へ固定した。

```text
RED_FROZEN
IMPLEMENTATION_NOT_AUTHORIZED
GREEN_NOT_RUN
SUCCESSFUL_STEP0_10_COMPLETION_RECEIPT_COUNT_0
SOURCE_BASELINE_UNLOCKED
FRESH_BATCH_RESERVED_NOT_CREATED
CYCLE001_NOT_ACCEPTED
AUTHORITY_STOP
```

production source、fixture、sample、manifest、Detailed Design、accepted authority historyは変更していない。

## 2. Entry identity and evidence chain

- Cocolon entry head: `ec66fdbadef3ebee4b5a531f77391252146b2e4e`
- mashos-api entry head: `21600c3d07b4f3d870beb3acb0bd78bf3e898f36`
- mashos-api RED result head: `e485f4a3c07ec0edeb2c248a74449b95f5017a58`
- entry current-authority blob: `3e98c712dcc9a22f8b377b214be6ff51476eefb1`
- parent-design addendum blob: `df8d2e49287554b3da2867afde634b3afbec4a37`
- parent-design receipt blob: `fdb64ba8ddab5b050556eb8025b77fd026c7aa50`
- parent-design handoff blob: `ed9f5725ebd843bd258ef767dd0b7a7b74df8277`
- Execution and Closure Plan entry blob: `4f4cdd8fd43af06844b8c303443c3635ce62d0ba`
- predecessor causal RED receipt blob: `e78d528600fef27ce3de52ef91c1118d6866d2ed`
- Detailed Design SHA-256: `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc`

開始時とGitHub反映直前に両main headを再取得し、指定headとの一致を確認した。関連drift、取得不能、証拠競合はなかった。

## 3. Changed test surface exact4

| path | result blob |
|---|---|
| `ai/tests/test_emlis_ai_grounded_observation_semantic_restatement.py` | `2d27401250f84468339ec995afa5628e7b323ace` |
| `ai/tests/test_emlis_nls_v3_s4_semantic_obligation_inventory.py` | `fa94723d02b37de72572d027372cdb8936e184a5` |
| `ai/tests/test_emlis_nls_v3_s5_content_selection_stage_context.py` | `711385416c845e5225493b25868b94fd3cc68e46` |
| `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py` | `33c73d30292c96e1d61cf6599a421414817ffd4b` |

changed path countはexact4である。

## 4. Frozen owner chain and protected boundary

Owner chain:

1. semantic proof owner:
   `ai/services/ai_inference/emlis_ai_grounded_observation_semantic_restatement_v3.py`
2. witness binding / alias / refined snapshot owner:
   `ai/services/ai_inference/emlis_ai_semantic_obligation_inventory_v3.py`
3. depth-only consumer:
   `ai/services/ai_inference/emlis_ai_content_selection_v3.py`

Future source exact3は変更していない。結果SHA-256は次のとおりである。

- semantic proof owner: `a014e942b34c2c8f2a424dda0b0ecd30cb34ff99112e813d2182ad84d34b65fc`
- Inventory owner: `0a66adbf3163cf3aad1d4454a8a26aa6292284911b4bd5ba1825e0780e3aa2bc`
- Content Selection owner: `ec2ccfc92c5566e8ec780e67db54b4a4c620a9334f2ab2cac91a314550f43f0d`

Protected ownersも変更していない。

- refined-source partition SHA-256: `02d943e3cb6f3e1a60bae38242900af0f929de9bf0b5300c3f9d4be10a44389a`
- artifact contract SHA-256: `c20b262495276c9b549b257380e1a7c28069c316a7aca4b6e00a49de03d1512b`
- `cross_source_bindings == []`
- question decision / `TrustedFutureStageAuthority`はnonsemantic controlのまま
- API / DB / RN / runtime / public / shared route変更 exact0
- v1 production owner、stopped v2、historical RC / receipt変更 exact0

## 5. Exact positive contract

Frozen schemas:

- `cocolon.emlis.nls_v3.grounded_cross_role_semantic_restatement_witness.v1`
- `cocolon.emlis.nls_v3.grounded_cross_role_semantic_restatement_adapter.20260723.v1`
- `cocolon.emlis.nls_v3.cross_role_semantic_depth_equivalence.v1`
- `cocolon.emlis.nls_v3.refined_source_snapshot.v2`

Frozen proof and effect:

- proof code: `TYPED_SEMANTIC_GRAPH_EQUIVALENCE`
- proof basis: `COMPLETE_BODY_FREE_TYPED_COMPONENT_BIJECTION`
- effect scope: `CONTENT_DEPTH_ONLY`

Witness exact fields:

1. `schema_version`
2. `adapter_version`
3. `original_plan_binding_sha256`
4. `supplemental_plan_binding_sha256`
5. `original_source_witness_sha256`
6. `supplemental_source_witness_sha256`
7. `component_bindings`
8. `effect_scope`
9. `depth_equivalence_schema_version`
10. `witness_sha256`
11. `body_free`

Component binding exact fields:

1. `binding_id`
2. `component_kind`
3. `original_source_role`
4. `original_source_kind`
5. `original_component_id`
6. `supplemental_source_role`
7. `supplemental_source_kind`
8. `supplemental_component_id`
9. `canonical_typed_component_sha256`
10. `proof_code`
11. `proof_basis`

The test freeze requires:

- original / supplemental exact2 active roles
- required coverage 100%
- original reception/control ownership retention
- role-pure, disjoint obligation/source-reference binding
- one original-only target for each reception row
- obligations and source references retained
- deterministic body-free output and parent/hash lineage
- non-identical surface forms may bind only through typed semantic graph proof
- normal/refined depth equality where all meaning is restated
- refined depth never below original-only depth
- unmatched relation/unknown meaning remains distinct and active
- safety source is projected as `must_separate`, excluded from witness endpoints, and its reciprocal separation obligations remain intact
- proof failure yields empty witness / no equivalence

## 6. Independent false-collapse and tamper boundaries

The RED freezes independent rejection for:

- referent/topic difference
- polarity/negation difference
- modality difference
- temporal-scope difference
- predicate/intention/completion difference
- quantifier/degree difference
- subset/superset difference
- relation type/direction/endpoint difference
- unknown dimension/affected-graph difference
- safety/must-separate pressure
- ambiguous, partial, one-to-many, and many-to-one mapping
- role swap and same-role mapping
- unresolved ID and component-kind mismatch
- question-decision endpoint injection
- witness/effect/hash/parent tampering
- plan/resolver/bundle/partition/stage drift
- snapshot witness injection/removal
- obligation omit/defer/integrate
- active-role drop
- private body or case/family/fixture cue use
- nondeterministic ordering

Stable negative codes exact18:

1. `CROSS_ROLE_SEMANTIC_RESTATEMENT_WITNESS_INVALID`
2. `CROSS_ROLE_SEMANTIC_RESTATEMENT_WITNESS_TYPE_INVALID`
3. `CROSS_ROLE_SEMANTIC_RESTATEMENT_WITNESS_SCHEMA_MISMATCH`
4. `CROSS_ROLE_SEMANTIC_RESTATEMENT_WITNESS_ADAPTER_MISMATCH`
5. `CROSS_ROLE_SEMANTIC_RESTATEMENT_PLAN_BINDING_MISMATCH`
6. `CROSS_ROLE_SEMANTIC_RESTATEMENT_SOURCE_WITNESS_MISMATCH`
7. `CROSS_ROLE_SEMANTIC_RESTATEMENT_ROLE_PAIR_INVALID`
8. `CROSS_ROLE_SEMANTIC_RESTATEMENT_COMPONENT_UNRESOLVED`
9. `CROSS_ROLE_SEMANTIC_RESTATEMENT_COMPONENT_KIND_MISMATCH`
10. `CROSS_ROLE_SEMANTIC_RESTATEMENT_AMBIGUOUS`
11. `CROSS_ROLE_SEMANTIC_RESTATEMENT_GRAPH_MISMATCH`
12. `CROSS_ROLE_SEMANTIC_RESTATEMENT_PROOF_CODE_INVALID`
13. `CROSS_ROLE_SEMANTIC_RESTATEMENT_PROOF_BASIS_INVALID`
14. `CROSS_ROLE_SEMANTIC_RESTATEMENT_EFFECT_SCOPE_INVALID`
15. `CROSS_ROLE_SEMANTIC_RESTATEMENT_DEPTH_CONTRACT_INVALID`
16. `CROSS_ROLE_SEMANTIC_RESTATEMENT_BODY_FREE_REQUIRED`
17. `CROSS_ROLE_SEMANTIC_RESTATEMENT_ORDER_INVALID`
18. `CROSS_ROLE_SEMANTIC_RESTATEMENT_WITNESS_HASH_MISMATCH`

## 7. Authoritative final causal RED

Only five named nodes were collected in the final frozen execution.

```text
COLLECTED_5
PASSED_1
FAILED_4
ERROR_0
UNEXPECTED_FAILURE_0
```

Passed:

- authority / exact surface / parent identity static check

Causal failures:

1. semantic proof owner:
   `RECOVERY_EPOCH001_S5_CROSS_ROLE_SEMANTIC_RESTATEMENT_OWNER_NOT_PROVED`
2. Inventory refined snapshot owner:
   `RECOVERY_EPOCH001_S5_CROSS_ROLE_REFINED_SNAPSHOT_BINDING_NOT_PROVED`
3. Content Selection depth consumer:
   `RECOVERY_EPOCH001_S5_CROSS_ROLE_DEPTH_NONINFLATION_NOT_PROVED`
4. recovery aggregate:
   `RECOVERY_EPOCH001_S5_CROSS_ROLE_SEMANTIC_RESTATEMENT_OWNER_NOT_PROVED`

The current source therefore does not yet satisfy the parent contract. Failures occurred at the selected owner chain and not at fixture, manifest, route, runtime, or unrelated collection.

Execution accounting:

- authoritative final targeted execution count: `1`
- superseded targeted collected development execution count: `5`
- total targeted collected execution count: `6`
- non-verdict precollection environment setup attempts: `2`
- broad suite / exact100 / Product Read execution count: `0`

The development executions were limited to the same named RED surface and were superseded while strengthening lineage, role purity, tamper, and safety boundaries. Only the final result above is authoritative.

## 8. Confirmed facts

- Both entry heads, all required body-free evidence blobs, and the Detailed Design identity were available and mutually consistent.
- Detailed Design §7.5, §8.2, §9.1, §9.2, §22.1 and the Step 5 STOP boundary place this work before implementation/GREEN and before Cycle acceptance.
- Test exact4 alone changed in mashos-api.
- The final failure set is causal to missing exact owner surfaces.
- No production implementation, GREEN, completion receipt, baseline lock, P1 retry002, P2, fresh batch, formal exact100, Product Read, correction, B6, or Cycle acceptance was performed.

## 9. Inference

- A future implementation must change the approved source exact3 to make these tests GREEN; the RED does not prove that a particular internal algorithm is the only viable implementation.
- Keeping equivalence effect at depth only is the narrowest route consistent with the parent design and avoids moving semantic authority into partition or control-plane owners.

## 10. Unconfirmed

- Future implementation feasibility and GREEN are unconfirmed.
- Broader regression status is unconfirmed because no broad suite was authorized.
- Successful Step 0–10 completion, baseline lock, fresh-batch readiness, exact100, Product Read, B6, and Cycle acceptance remain unconfirmed.
- Downstream surface naturalness after a future GREEN is unconfirmed.

## 11. Not written

- No source or output body, quotation, identifiable paraphrase, individual mapping, parsed span, private review note, private digest, verification secret, or PII is recorded here.
- No fixture-specific expected answer or case/family dispatch rule was added.
- No implementation prescription beyond the frozen public/typed contract was declared.

## 12. No-guess boundary

- Raw or normalized text equality, synonym tables, broad typed shells, and fixture cues must not be promoted to semantic equivalence.
- Missing or incomplete one-to-one typed proof must not be guessed as equivalence.
- RED existence must not be inferred as implementation completion, GREEN, Step 0–10 completion, baseline lock, or Cycle acceptance.
- Historical RC/receipt success must not be substituted for current exact owner completion.

## 13. Karen opinion

- This RED is now sufficiently causal and general to freeze: it binds the semantic proof owner, the Inventory lineage/snapshot owner, and the Content Selection depth consumer without expanding partition authority.
- The safety path is essential. A witness that can collapse a safety-bearing source while preserving a layered depth label would be a false success; actual projection, endpoint exclusion, and reciprocal separation therefore belong in the frozen contract.
- The correct action is to stop here. Mash has no additional recovery work to perform under this authority; only a separate next-authority decision remains.

## 14. Next separate authority candidate

Exactly one candidate is presented:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_SEMANTIC_RESTATEMENT_WITNESS_AND_DEPTH_NONINFLATION_REMEDIATION_IMPLEMENTATION_AND_GREEN_ONLY
```

This candidate is not approved by this document. Automatic progression is false.

STOP.
