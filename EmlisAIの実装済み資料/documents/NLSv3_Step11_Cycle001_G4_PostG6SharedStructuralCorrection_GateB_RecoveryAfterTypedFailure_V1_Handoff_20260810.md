# Handoff — G4 post-G6 Gate B recovery after typed failure V1

- Date: 2026-08-10
- Decision owner: Mash
- Operation owner: Karen
- Authority: `NLS_V3_STEP11_CYCLE001_G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_RECOVERY_AFTER_TYPED_FAILURE_V1`
- State: `G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_RECOVERY_TYPED_FAILURE`
- Exactly-one cause: `FAILED_ROOT_NOT_AVAILABLE_FOR_CAUSAL_DIAGNOSIS`
- Lifecycle: `CLOSED_CONSUMED_TYPED_FAILURE`
- Body-free: true
- Automatic progression: false

## Handoff verdict

Stage R0 was executed read-only. The failed Gate B V1 session-local root was not available in the current
Work session. The authority-bound V1 helper sources exact5 remained available, but no helper was executed:
owner diagnostic 0 and independent diagnostic 0. No runtime body was repaired, mutated, readmitted, or reused.

Because the failed root was unavailable, the actual installed-file manifest identity and all required
body-free row/count/digest observations were not derivable. The authority therefore closed with exactly one
approved cause:

```text
FAILED_ROOT_NOT_AVAILABLE_FOR_CAUSAL_DIAGNOSIS
```

Stage R1 was not admitted. No acquisition, new helper, fresh root, materialization, pytest probe, role smoke,
or readiness admission occurred.

```text
G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_RECOVERY_TYPED_FAILURE
EXACT_TYPED_CAUSE_RECORDED
CURRENT_GATE_B_RECOVERY_AUTHORITY_CLOSED_CONSUMED_TYPED_FAILURE
SAME_SERIES_FURTHER_RETRY_NOT_AUTHORIZED
NEXT_AUTHORITY_UNSELECTED_SEPARATE_MASH_APPROVAL_REQUIRED
CURRENT_AUTHORITY_STOP
AUTOMATIC_PROGRESSION_FALSE
```

## Preserved entry gate

```text
Cocolon main:
  6d14b1dad31407999a27918873d6aa69e248c456

mashos-api main / tree:
  45bf98f9034261d3adb3e808d6d759f2334e2d25
  23f1684ed5430cafef955d7af9fc6bde75a4c62f

production / protected-test blobs:
  f10ce7948e5570ee8ad27ee2af00a9caf3867d49
  c302dd99e143967fed6edd65b429373e87453fc6

failed Gate B V1 Result / Receipt / Handoff blobs:
  bbd1c96efb02121dcea472423d04a4938d14df6e
  fe610a3614deac5a1d1961ac276ec6470ef18160
  1dbad1c85a08124af8aa29ea1836d10641718d91

failed V1 state / reason / lifecycle / reuse:
  G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_TYPED_MATERIALIZATION_FAILURE
  INSTALLED_FILE_MANIFEST_IDENTITY_MISMATCH
  CLOSED_CONSUMED_TYPED_FAILURE
  false

previous exact6 latest inclusion / prepared-byte equality:
  true / true

previous exact6 changed / unauthorized / deletion / rename:
  6 / 0 / 0 / 0
```

Related drift count was 0. Historical authorities and the failed V1 were not reopened, reused, retried,
reactivated, or reclassified.

## Immutable identities

```text
formal lock blob / raw / logical SHA-256:
  0822fcb010985cd0d384f250a9e8a1fe16dc8fd4
  9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787
  801ba54efc0f6655238d14e7c153fb70b555801489aa8ba028515fc64d9c05f4

corrected exact7 projection:
  2185 bytes
  f501025c1dccef68c47c0a3e52f3ef74d01233f371b16f2b1a0bdfb21089e57e

requirements:
  473 bytes / LF5
  4f7218509a20e42850afe75597f2abfdf447035001847621d4637faa246065f1

accepted wheel / distribution closure / expected installed manifest:
  00d2df98c8cda7f1473794892bafe7ccd18cc816c79ccb346f3e21ff629b136d
  4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c
  9c6925ed94b8eb1ccd22d2d4aeccc5dde35c7c23915ae6d367fcaff17bf09de6

interpreter / environment policy / required role-path order:
  9ed008e5a8685235361f0c53771b520ab082dd99a877ad2fd796a93fa4c0b488
  8a43751b49a8db1d024063608405f9b169e829f3c0be3488433b31800d44b1a4
  e01f5e587ba1884b988075eee1c162454d3a6a1d4b10febc3b7111c2b5c1b248
```

Tracked procedure identities remained:

- runtime continuity: blob `ea7f96221846e5614431296e00ac481cc00e00a2`, raw
  `42fcd4d65b0d21b5e41659b6329c55c14ed42c0270838f13be6102b351db7ac9`;
- one-shot prelaunch: blob `5c3b7dd03c84a84a2717f57f0d2c99c39b2ed6d8`, raw
  `895ea1f130e331d4e89f857835b4477d949c1ff63c0adea11276bc97b4c717b2`.

## R0 diagnosis checkpoint

```text
failed-root availability observation / candidate:
  1 / 0

V1 helper sources present / current-authority helper execution:
  5 / 0

owner / independent diagnostic executions:
  0 / 0

actual manifest identity:
  NOT_DERIVABLE_FAILED_ROOT_ABSENT

row and file-kind counts:
  NOT_DERIVABLE_FAILED_ROOT_ABSENT

owned / unowned / duplicate counts:
  NOT_DERIVABLE_FAILED_ROOT_ABSENT

canonical preimage bytes / LF:
  NOT_DERIVABLE_FAILED_ROOT_ABSENT

owner-independent equality / expected match:
  NOT_OBSERVED / NOT_OBSERVED

mismatch family counts / pathset / mismatch-row digests:
  NOT_DERIVABLE_FAILED_ROOT_ABSENT
```

The current V1 materializer source hash matched its prior frozen Receipt. Its installed-manifest routine was
losslessly recorded as an unversioned exact11 expected-hash candidate oracle: regular RECORD-owned in-site
payloads only, external entrypoints and RECORD self excluded after verification, pyc/cache RECORD rows
excluded, symlinks and nonregulars forbidden, candidate-dependent row fields/order, compact sorted-key UTF-8
JSON, no final LF. No candidate was selected in V1 because the mismatch raised before rule emission.

The prior G5 READY Receipt, failed V1 new3, formal lock, and tracked procedure exact2 were compared. The
expected value is durable, but the inspected current evidence does not bind it to a versioned canonical owner.
A historical generic exact4 rule exists, but its earlier lineage does not bind current expected `9c6925...`.
This remains a secondary durable-evidence conflict and is not used as a second causal classification.

## Durable artifact owners

| Role | Path | Bytes | LF | Raw SHA-256 | Git blob |
|---|---|---:|---:|---|---|
| Result | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4_PostG6SharedStructuralCorrection_GateB_RecoveryAfterTypedFailure_V1_Result_20260810.md` | 12803 | 295 | `59a65dad6b4ca2838d908cc0f8136aba3e291adcb5819d203a7819495586edaa` | `943db07ae0ce1f33a6a1b152d04acf5b30236d2e` |
| Body-free Receipt | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4_PostG6SharedStructuralCorrection_GateB_RecoveryAfterTypedFailure_V1_BodyFree_Receipt_20260810.json` | 17198 | 354 | `8d47e9f8f1fcbdf00ffac5c39b4d1eeb8c3843520504e9bc98da46a9f3bbcaba` | `5e6e7c08787485ec34de09eb290b08835cbdca11` |
| Receipt logical | sorted compact JSON with self field empty / no final LF | — | — | `5803b8809a70073eb6a55329e7779d8ba05ead672526d0b2e87768e444613484` | — |
| Handoff | this path | self identity omitted to avoid a hash cycle | — | — | — |

All durable artifacts are UTF-8, LF-only, mode `100644`, and end with LF.

## Stage R1 and protected boundary

```text
Stage R1 admission / attempt: 0 / 0
new staging / download / runtime root: 0 / 0 / 0
network / accepted wheel: 0 / 0
new helper creation / execution: 0 / 0
venv / installation: 0 / 0
owner / pytest probe / role smoke / independent: 0 / 0 / 0 / 0
runtime READY admission: 0

target import / collection / call: 0 / 0 / 0
targeted pytest / exact24 / full52 / full54 / whole collection / exact100: 0 / 0 / 0 / 0 / 0 / 0
production / protected append / fixture / sample / corpus changes: 0 / 0 / 0 / 0 / 0
mashos-api write / Product Read / G5 / G6 / G7 / Cycle001 acceptance: 0 / 0 / 0 / 0 / 0 / 0
```

No raw absolute path, file/package/RECORD/manifest-row body, configured route or URL, credential, environment
value, helper body, runtime body, acquisition output, or traceback is published.

## Next approval boundary

The next authority is unselected. Same-series retry, comparator refreeze, readiness rematerialization, Gate C,
target work, protected-test append, and mashos-api write remain unauthorized.

The smallest separate proposal is diagnostic-only:

1. bind current expected-manifest handling to a versioned tracked path-free canonical owner;
2. authorize one nonadmitted fresh diagnostic root, not a readiness retry;
3. execute separately implemented owner and independent derivations exact1 each;
4. STOP for a separate Mash decision before any comparator refreeze or readiness rematerialization.

This handoff itself does not issue that authority. Publication is complete only after GitHub fresh postwrite
verification proves remote prepared-byte equality, changed-path union exact6, unauthorized/deletion/rename 0,
and latest-main inclusion.
