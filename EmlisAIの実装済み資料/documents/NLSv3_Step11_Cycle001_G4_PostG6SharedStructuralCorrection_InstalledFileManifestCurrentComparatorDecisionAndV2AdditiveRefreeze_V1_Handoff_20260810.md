# NLSv3 Step11 Cycle001 — installed-file manifest comparator V2 refreeze handoff

- date: `2026-08-10`
- authority: `NLS_V3_STEP11_CYCLE001_G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_INSTALLED_FILE_MANIFEST_CURRENT_COMPARATOR_DECISION_AND_V2_ADDITIVE_REFREEZE_V1`
- lifecycle: `CURRENT_COMPARATOR_DECISION_AUTHORITY_CLOSED_CONSUMED`
- state: `INSTALLED_FILE_MANIFEST_CURRENT_COMPARATOR_V2_REFROZEN`
- automatic progression: `false`

## Closed comparator decision

The current expected installed-file manifest for canonical schema `NLS_V3_INSTALLED_FILE_MANIFEST_CANONICAL_V1` is now:

`0eba095e4c173b4b69f68532fd66cf2c871ab9edef64d91754b52ed7daee15c5`

Only the current expected binding was superseded. The canonical schema body, validation strictness, exact5 distribution closure, formal lock, requirements, file-ownership and path rules, and all acceptance conditions remain unchanged.

## Current owner and binding

| Artifact | Git blob SHA-1 | Raw SHA-256 | Role |
|---|---|---|---|
| `NLSv3_Step11_Cycle001_InstalledFileManifest_VersionedCanonicalOwner_V2_20260810.json` | `3b9b332b1eea402dc18b7e7ceb8528e8f3bac678` | `9141231049a10a1d04741d66d6cab09ff3a831bd7bb096f1212f382ac381a808` | current V2 additive owner |
| `NLSv3_Step11_Cycle001_G4_PostG6SharedStructuralCorrection_InstalledFileManifestCurrentComparatorDecisionAndV2AdditiveRefreeze_V1_Result_20260810.md` | `2137a8ef6bf1d78760d65b9c1f691a0ab1ebc202` | `c31032dcb84a6ffc3cab68f59d5eb7c39245c2ec4a3fc5879f1522fe5798b6f0` | closed result |
| `NLSv3_Step11_Cycle001_G4_PostG6SharedStructuralCorrection_InstalledFileManifestCurrentComparatorDecisionAndV2AdditiveRefreeze_V1_BodyFree_Receipt_20260810.json` | `d1b838a7caee18b4fbce9030a05ce7f3b00c3f4d` | `cf4376d346489231d09312e439908351efa9767e19f6ae199315bbb78cdc9bdf` | body-free receipt |

Receipt logical SHA-256 is `f205b6c1f8451753e0f340d822323d2b75abe30bfafdff80e4ca354c9aab0647` under its empty-self-field sorted-compact JSON rule. This Handoff omits its own byte identity to avoid a hash cycle.

The V2 owner references the exact V1 schema-body owner instead of copying old diagnostic or execution counters into a new claim. Its authorized semantic effect is `current_expected_binding_refreeze_count: 1`; canonical-schema and historical-reclassification effects are 0.

## Preserved historical roles

- V1 owner `cc7c9f5573124aded5f007802ed031d79d92a7d8` remains `IMMUTABLE_HISTORICAL_DIAGNOSTIC_OWNER`. It is not edited.
- predecessor expected identity `9c6925ed94b8eb1ccd22d2d4aeccc5dde35c7c23915ae6d367fcaff17bf09de6` remains `HISTORICAL_NONCURRENT_FOR_CANONICAL_V1`.
- the 2026-08-09 G5 Gate B artifacts keep `9c6925ed...` only as an `UNVERSIONED_OR_ALTERNATE_HISTORICAL` runtime identity; they are not retroactively claimed to have used the newly named canonical V1 binding.
- historical runtime READY, G5 machine GREEN, and G6 REJECT remain unchanged.
- the 2026-08-01 historical session-local READY corroborates `0eba095e...` but supplied no current readiness credit.

## Evidence crosswalk

```text
NLS_V3_INSTALLED_FILE_MANIFEST_CANONICAL_V1
-> fresh owner derivation exact1 == independent derivation exact1
-> current actual 0eba095e...
-> exact5 wheel / RECORD / installed closure
-> rows 482, owned 482, unowned/duplicate/missing/extra 0
-> mismatch rows 0, active mismatch families 0
-> 2026-08-01 independent historical reproduction 0eba095e...
-> current expected decision 0eba095e...
```

The formal lock remains at `MassyuRed/mashos-api` commit `45bf98f9034261d3adb3e808d6d759f2334e2d25`; the current continuity procedure remains the tracked exact2 at blobs `ea7f96221846e5614431296e00ac481cc00e00a2` and `5c3b7dd03c84a84a2717f57f0d2c99c39b2ed6d8`.

## Durable scope and zero boundary

The completed authority is limited to Cocolon new exact4 plus modified exact3. V1 and historical artifacts are outside the changed-path set; `mashos-api` changed-path count is 0.

No diagnostic root, runtime root, network or wheel acquisition, install, helper, pytest probe, role smoke, or owner/independent readiness derivation was executed. Runtime READY, readiness credit, Gate B recovery, Gate C, protected-test append, target execution, test suite, production, Product Read, G5/G6/G7, and Cycle001 acceptance effects are all 0. Cycle001 remains `NOT_ACCEPTED`.

No raw manifest rows or relative-path list, absolute locator, package/file/RECORD/wheel/runtime body, configured route, credential, environment value, or private process output was published.

## Next authority requirement

The only named next proposal is:

`NLS_V3_STEP11_CYCLE001_G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_FRESH_RUNTIME_READINESS_UNDER_COMPARATOR_V2_V1`

Current proposal state: `DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED`.

It must bind a fresh post-publication Cocolon head/tree, this V2 owner path/blob/raw identity, canonical schema V1, current comparator `0eba095e...`, the current success Result/Receipt/Handoff, formal lock, exact7 projection, requirements exact5, and current continuity procedure exact2. If separately approved, it may authorize only one fresh isolated exact5 rematerialization/readiness attempt with owner/independent full identity, pytest `8.4.1` probe, and role smoke. It must not reuse a prior or failed root or readiness credit, retry, fall back, or switch interpreters.

That later authority must stop at either fresh READY plus one new readiness credit or one typed failure. Gate C, protected-test append, target import/collection/call, protected or downstream tests, production, `mashos-api` write, G5/G6/G7, and Cycle001 acceptance remain outside it and require still-later separate approval.

This authority did not issue, approve, activate, or execute the proposal.

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
