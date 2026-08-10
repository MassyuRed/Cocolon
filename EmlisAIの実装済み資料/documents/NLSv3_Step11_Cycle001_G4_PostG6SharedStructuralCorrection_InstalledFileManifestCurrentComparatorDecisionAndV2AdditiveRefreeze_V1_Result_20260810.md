# NLSv3 Step11 Cycle001 — installed-file manifest current comparator decision and V2 additive refreeze result

- date: `2026-08-10`
- authority: `NLS_V3_STEP11_CYCLE001_G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_INSTALLED_FILE_MANIFEST_CURRENT_COMPARATOR_DECISION_AND_V2_ADDITIVE_REFREEZE_V1`
- lifecycle: `CURRENT_COMPARATOR_DECISION_AUTHORITY_CLOSED_CONSUMED`
- artifact policy: `BODY_FREE_PUBLIC_SAFE`
- automatic progression: `false`

## Outcome

The current comparator for canonical schema `NLS_V3_INSTALLED_FILE_MANIFEST_CANONICAL_V1` is refrozen to:

`0eba095e4c173b4b69f68532fd66cf2c871ab9edef64d91754b52ed7daee15c5`

The sole semantic effect is one additive current-expected-binding refreeze. The canonical schema body is unchanged. The predecessor expected identity `9c6925ed94b8eb1ccd22d2d4aeccc5dde35c7c23915ae6d367fcaff17bf09de6` and all historical readiness, G5 machine GREEN, and G6 REJECT evidence remain immutable historical evidence; none is invalidated or reclassified.

This authority did not create or execute a runtime, issue runtime READY, or grant readiness credit.

## Fresh entry and prior publication integrity

| Repository | Entry commit | Entry tree | Write effect |
|---|---|---|---:|
| `MassyuRed/Cocolon` | `0507b7274bf31826ba7a410cc3b57095b1d0656f` | `90a336a924c8011927188bbd686cc1d16b1ae3dd` | approved exact7 only |
| `MassyuRed/mashos-api` | `45bf98f9034261d3adb3e808d6d759f2334e2d25` | `23f1684ed5430cafef955d7af9fc6bde75a4c62f` | 0 |

The immediately preceding exact7 publication was present on current `main`; its prepared bytes matched the remote artifacts. Its changed-path union was exact7, with unauthorized path 0, deletion 0, rename 0, `mashos-api` changed path 0, and related drift 0.

The attached planning copy was treated as noncurrent reference material. All append-only work used the larger current GitHub Plan at the entry commit as its write base.

## Evidence crosswalk

1. **Canonical schema.** `NLS_V3_INSTALLED_FILE_MANIFEST_CANONICAL_V1` remains owned by `NLSv3_Step11_Cycle001_InstalledFileManifest_VersionedCanonicalOwner_V1_20260810.json` at blob `cc7c9f5573124aded5f007802ed031d79d92a7d8`, raw SHA-256 `ca2f6aa5de27a01e73d92ebb3b98940f912c201486eb7510c9a3d7a166243acd`. Its `canonical_manifest_contract`, `record_closure_contract`, and `diagnostic_inventory_contract` remain the schema body; their sorted compact exact3-object digest is `161b23b5cdf11ec0284bfd0933b2b41feeb3e9a3745d72807d3ea68921ee7fe0`.
2. **Independent fresh reproduction.** The closed diagnostic authority produced one owner derivation and one independent derivation. They were equal and both produced `0eba095e4c173b4b69f68532fd66cf2c871ab9edef64d91754b52ed7daee15c5`; their shared diagnostic-core digest was `a0391ee0f772f4d179b3285d47eb6ef608b1aa5c622384ce1f09ba5a0a6f8ce0`.
3. **Exact5 closure.** Wheel identity match, wheel RECORD identity match, and installed RECORD closure match were each exact5. Accepted-wheel manifest digest remained `00d2df98c8cda7f1473794892bafe7ccd18cc816c79ccb346f3e21ff629b136d`; distribution-closure digest remained `4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c`.
4. **Mismatch-family zero.** Canonical rows / eligible payload / owned files were `482 / 482 / 482`; unowned, duplicate, missing, extra, symlink, nonregular, pyc, pycache, mismatch rows, and active mismatch families were all 0.
5. **Historical independent reproduction.** The immutable 2026-08-01 fresh-runtime-readiness artifacts independently recorded the same installed-file manifest `0eba095e...`, the same distribution closure `4d3d6a...`, RECORD match5, and owner/independent equality. That historical session-local READY is corroboration only and supplied no readiness credit to this authority.
6. **Current expected decision.** Mash selected the reproducible current identity `0eba095e...`; V2 therefore supersedes only the current expected binding and leaves every schema and historical-evidence role unchanged.

## Evidence owners

### Current diagnostic exact3

| Artifact | Git blob SHA-1 | Raw SHA-256 |
|---|---|---|
| `NLSv3_Step11_Cycle001_G4_PostG6SharedStructuralCorrection_InstalledFileManifestVersionedCanonicalOwnerAndDiagnosticOnlyFreshReproduction_V1_Result_20260810.md` | `71f35f124ef0061e23d62e54a410b052358e5640` | `5efce5eb52ebf1e0eb2f6e2e46049df86808201c138b6db711f1a6f156f1fe22` |
| `NLSv3_Step11_Cycle001_G4_PostG6SharedStructuralCorrection_InstalledFileManifestVersionedCanonicalOwnerAndDiagnosticOnlyFreshReproduction_V1_BodyFree_Receipt_20260810.json` | `33f706029f8dc2962ccfb2af3195b3a76f5bd399` | `1c1e240d7e5458edb0f6bf0f5abe50433074161ff320470e5b01917d126f9c24` |
| `NLSv3_Step11_Cycle001_G4_PostG6SharedStructuralCorrection_InstalledFileManifestVersionedCanonicalOwnerAndDiagnosticOnlyFreshReproduction_V1_Handoff_20260810.md` | `87b15ab5a54a2f140051d6467fe18dd8057f5daa` | `1489850ae9aa2929bc009d17cdd9245ccb7210a538552c55c916709ba4554750` |

The diagnostic classification `EXPECTED_IDENTITY_NOT_REPRODUCED_COMPARATOR_DECISION_REQUIRED` remains a historical input to this decision; it is not rewritten into a new diagnostic classification.

### Historical reproduction exact3, 2026-08-01

| Artifact role | Git blob SHA-1 | Raw SHA-256 |
|---|---|---|
| Result | `70560281cab822fba22a980cd3220393f39c4625` | `9b4a27fba233fc36b374db04f1882f467203d315eb2602bb7baf5365fff635dd` |
| Receipt | `ce6cfe0217f3e28c88643f4a4f543e069a6b21c6` | `b80acc68e1d38c734c243031c7d4a13024057eac73f34ed5fe09db7ab945ebe2` |
| Handoff | `ce98b142cd279b106c81ae9455748f5aa193bbe5` | `f59b7d9c89aa32d4a6391f9cc01e241243d400a83500d2d9f89d6c32d24b9c58` |

The procedure identity in these historical artifacts is an earlier historical revision. It does not replace the current tracked procedure exact2.

### Historical G5 Gate B exact3, 2026-08-09

| Artifact role | Git blob SHA-1 | Raw SHA-256 |
|---|---|---|
| Result | `5231f83b42d55676610a0476189cf1685ccba971` | `9c38b0d49a5edef51ad6db3ef5188ef70512e87f98b7c236829fad43d9e37e25` |
| Receipt | `0e26959f85c18ca50d02ff06de0dcce8fd226a36` | `a321df13d4912cf29e680a34cf55cf08598cb5b7ab7009a624330ff1fe9efd31` |
| Handoff | `a120b4f2886962591267524b7047b109a866fd02` | `721632507f2391ebe64d24f9d65ad921538833ee7001278bd67f048be5216bf3` |

These artifacts retain `9c6925ed...` as an `UNVERSIONED_OR_ALTERNATE_HISTORICAL` runtime identity. They are not claimed to have used the newly named canonical V1 binding. Their READY, G5 machine GREEN, and downstream G6 REJECT roles remain unchanged.

### Immutable current runtime inputs

- formal lock: `MassyuRed/mashos-api:ai/configs/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_lock_v1.json`, blob `0822fcb010985cd0d384f250a9e8a1fe16dc8fd4`, raw `9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787`, logical `801ba54efc0f6655238d14e7c153fb70b555801489aa8ba028515fc64d9c05f4`.
- current continuity procedure exact2: `Cocolon_前提資料/13_cocolon_work_test_runner_runtime_continuity.md` at blob `ea7f96221846e5614431296e00ac481cc00e00a2`, and `Cocolon_前提資料/work_attitude_rules_for_karen/16_test_runner_runtime_continuity_and_one_shot_prelaunch.txt` at blob `5c3b7dd03c84a84a2717f57f0d2c99c39b2ed6d8`.

## V2 owner and unchanged canonical contract

The additive owner is:

`EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_InstalledFileManifest_VersionedCanonicalOwner_V2_20260810.json`

- Git blob SHA-1: `3b9b332b1eea402dc18b7e7ceb8528e8f3bac678`
- raw SHA-256: `9141231049a10a1d04741d66d6cab09ff3a831bd7bb096f1212f382ac381a808`
- bytes / LF / CR / final LF / mode: `12210 / 255 / 0 / true / 100644`
- owner revision: `V2`
- canonical schema change: `false`
- current expected binding refreeze count: `1`
- supersession scope: `CURRENT_EXPECTED_BINDING_ONLY`
- predecessor artifact rewrite: `false`
- historical readiness / G5 / G6 reclassification: `false / false / false`
- acceptance weakening / automatic progression: `false / false`

The wrapper references the exact V1 schema-body owner rather than copying V1 diagnostic/execution fields as new facts. V1 itself remains outside the changed-path set.

## Authorized effect exact1 and zero boundaries

Authorized semantic effect:

- current expected binding decision: 1
- current expected binding refreeze: 1

Zero schema and historical effects:

- canonical-schema, row-field, normalization, ordering, JSON-rule, hash-rule, file-ownership-rule changes: 0
- V1 or historical artifact rewrites: 0
- historical READY, G5 machine GREEN, or G6 REJECT reclassifications: 0
- exact5, formal-lock, requirements, distribution-closure, environment-policy changes: 0
- acceptance weakening: 0

Zero execution and downstream effects:

- diagnostic-root or runtime-root creation, network/wheel acquisition, install, helper, pytest probe, role smoke, owner/independent readiness derivation: 0
- runtime READY, readiness credit, Gate B recovery, Gate C, protected-test append, target import/collection/call, targeted pytest, ordered exact24, full52, full54, outside-exact24 whole collection, exact100: 0
- production, protected-test, fixture/sample/corpus, `mashos-api`, Product Read, G5, G6, G7, Cycle001 acceptance, API/DB/RN/public/shared-runtime/Safety-owner changes: 0

No raw manifest row or relative-path list, absolute locator, package/file/RECORD/wheel/runtime body, configured route, credential, environment value, or private process output is published.

## Durable artifact scope

This authority writes only the approved Cocolon exact7: new V2 owner plus new Result/Receipt/Handoff, and append-only/additive updates to the current Plan, 07, and 08. V1 owner and all historical evidence remain outside the changed-path set. `mashos-api` write count is 0.

## Next separate authority

The following authority is defined only as an inactive proposal and was neither issued, approved, activated, nor executed here:

`NLS_V3_STEP11_CYCLE001_G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_FRESH_RUNTIME_READINESS_UNDER_COMPARATOR_V2_V1`

Its state is `DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED`. It requires a fresh post-publication entry freeze and separate Mash approval. No current result grants it readiness credit or downstream authorization.

## Terminal

```text
INSTALLED_FILE_MANIFEST_CURRENT_COMPARATOR_V2_REFROZEN
CANONICAL_SCHEMA_V1_UNCHANGED
CURRENT_EXPECTED_IDENTITY_0EBA095E_REFROZEN
HISTORICAL_9C6925_IDENTITY_PRESERVED_NONCURRENT
HISTORICAL_READINESS_AND_G5_G6_EVIDENCE_UNCHANGED
NO_RUNTIME_READY_OR_READINESS_CREDIT
CURRENT_COMPARATOR_DECISION_AUTHORITY_CLOSED_CONSUMED
NEXT_G4_GATE_B_FRESH_READINESS_UNDER_V2_COMPARATOR_SEPARATE_APPROVAL_REQUIRED
CURRENT_AUTHORITY_STOP
AUTOMATIC_PROGRESSION_FALSE
```
