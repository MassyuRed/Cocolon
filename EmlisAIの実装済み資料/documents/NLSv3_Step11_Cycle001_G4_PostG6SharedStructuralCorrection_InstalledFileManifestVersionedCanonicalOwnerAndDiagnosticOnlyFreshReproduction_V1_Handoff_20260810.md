# Handoff — installed-file manifest canonical owner and diagnostic-only fresh reproduction V1

- Date: 2026-08-10
- Decision owner: Mash
- Operation owner: Karen
- Authority: `NLS_V3_STEP11_CYCLE001_G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_INSTALLED_FILE_MANIFEST_VERSIONED_CANONICAL_OWNER_AND_DIAGNOSTIC_ONLY_FRESH_REPRODUCTION_V1`
- Classification: `EXPECTED_IDENTITY_NOT_REPRODUCED_COMPARATOR_DECISION_REQUIRED`
- Current state: `INSTALLED_FILE_MANIFEST_COMPARATOR_DECISION_REQUIRED`
- Lifecycle: `CURRENT_DIAGNOSTIC_AUTHORITY_CLOSED_CONSUMED_TYPED_STOP`
- Body-free: true
- Automatic progression: false

## Handoff verdict

Stage D0 durably bound the current expected identity to a versioned canonical owner without changing the
expected value. Stage D1 then created one fresh, private, nonadmitted diagnostic root and executed owner and
independent derivations exactly once each.

The fresh exact5 wheel set, wheel RECORD identities, installed distribution closure, and per-distribution
installed RECORD closure exact5 all matched. The separately implemented diagnostic cores were equal and all
fixed inventory/content/closure mismatch families were zero. The V1 canonical preimage nevertheless derived:

```text
actual:
0eba095e4c173b4b69f68532fd66cf2c871ab9edef64d91754b52ed7daee15c5

unchanged expected:
9c6925ed94b8eb1ccd22d2d4aeccc5dde35c7c23915ae6d367fcaff17bf09de6

match:
false
```

The classification is exactly one:

```text
EXPECTED_IDENTITY_NOT_REPRODUCED_COMPARATOR_DECISION_REQUIRED
```

No comparator or expected identity was changed. This diagnostic root receives no runtime READY status and no
readiness credit.

## Preserved entry gate

```text
Cocolon activation main:
  c974f672b7bd3089700e3d7834527995cfff0aa0

mashos-api main / tree:
  45bf98f9034261d3adb3e808d6d759f2334e2d25
  23f1684ed5430cafef955d7af9fc6bde75a4c62f

recovery Result / Receipt / Handoff blobs:
  943db07ae0ce1f33a6a1b152d04acf5b30236d2e
  5e6e7c08787485ec34de09eb290b08835cbdca11
  4190d2f05b9b2d638436b7786ce304576dd20a44

recovery state / cause / lifecycle:
  G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_RECOVERY_TYPED_FAILURE
  FAILED_ROOT_NOT_AVAILABLE_FOR_CAUSAL_DIAGNOSIS
  CLOSED_CONSUMED_TYPED_FAILURE

same-series retry / automatic progression:
  false / false

related drift:
  0
```

The failed V1 and Recovery V1 were not retried, reused, reopened, reactivated, or reclassified.

## Durable canonical owner

Path:

`EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_InstalledFileManifest_VersionedCanonicalOwner_V1_20260810.json`

```text
commit:
  e91aece89f5a3e89f7ee788b8cae981862429a1a

bytes / LF / CR / final-LF / mode:
  16313 / 380 / 0 / true / 100644

raw SHA-256 / Git blob:
  ca2f6aa5de27a01e73d92ebb3b98940f912c201486eb7510c9a3d7a166243acd
  cc7c9f5573124aded5f007802ed031d79d92a7d8

remote prepared-byte equality / latest inclusion before D1:
  true / true
```

The owner fixes `NLS_V3_INSTALLED_FILE_MANIFEST_CANONICAL_V1`: site root excluded, exact5 distribution
order, RECORD-owned in-site regular payloads, RECORD self/external entrypoint/cache exclusions, row exact4,
POSIX paths, Unicode-codepoint row order, sorted keys, compact UTF-8 JSON array, and no final LF. It also fixes
the body-free inventory and digest domains. No concrete row or path list is included.

Helper freeze and use:

| Role | Body bytes | Raw SHA-256 | Creation / D1 execution | Private report raw SHA-256 |
|---|---:|---|---|---|
| Owner | 31211 | `cacf1bb15d61943e7934037aec6b5d6e69a27d9a0da93dc07d4ba988e3d2b50e` | 1 / 1 | `7b7506501ab9fcf57af79d5ea50290849232a30627d22f83717395b80ead0a5a` |
| Independent | 30411 | `071fa8f2225c170cad1f7afc56111d83c4319f593f76d7caa9c40ec4785fc37c` | 1 / 1 | `abf956b966a6e670892d7b020faaa692c97bac61689c94e8d3d6c021cab6ea56` |

Shared-module, mutual-import, prior-helper-copy, and prior-helper-reuse counts were 0. Equal diagnostic core
SHA-256 was `a0391ee0f772f4d179b3285d47eb6ef608b1aa5c622384ce1f09ba5a0a6f8ce0`.

## One-shot execution checkpoint

```text
attempt / retry / fallback / attempt-two:
  1 / 0 / 0 / 0

failed/prior root, prior wheel/helper, readiness credit reuse:
  0 / 0 / 0 / 0 / 0

new staging / download / runtime root:
  1 / 1 / 1

configured route / network process / exit:
  1 / 1 / 0

accepted wheel count / total bytes / all wheel+RECORD match:
  5 / 1724842 / true

venv --without-pip --copies / exit:
  1 / 0

hash-required no-index no-deps wheel-only no-compile install / exit:
  1 / 0

owner / independent execution and exits:
  1 / 0
  1 / 0

owner-independent equality:
  true
```

## Body-free observation

```text
canonical row / preimage bytes / LF:
  482 / 89653 / 0

site regular / directory / symlink / other:
  487 / 27 / 0 / 0

eligible / owned / unowned / duplicate:
  482 / 482 / 0 / 0

missing / extra / pyc / pycache directory:
  0 / 0 / 0 / 0

record self excluded / verified external entrypoints:
  5 / 3

installed distribution / RECORD closure match:
  5 / 5

distribution closure / match:
  4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c
  true

pathset digest:
  6fb972b20c2c5c776886c53c905bf08e8577fa74284d760c39065b9ba65328f2

mismatch-row digest / row count / active family count:
  4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945
  0 / 0
```

Every fixed mismatch-family count is 0. Absolute locators, concrete path/row lists, package/file/RECORD/wheel
bodies, configured route, credentials, environment values, private output, and tracebacks remain unpublished.

## Durable artifact owners

| Role | Path | Bytes | LF | Raw SHA-256 | Git blob |
|---|---|---:|---:|---|---|
| Canonical owner | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_InstalledFileManifest_VersionedCanonicalOwner_V1_20260810.json` | 16313 | 380 | `ca2f6aa5de27a01e73d92ebb3b98940f912c201486eb7510c9a3d7a166243acd` | `cc7c9f5573124aded5f007802ed031d79d92a7d8` |
| Result | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4_PostG6SharedStructuralCorrection_InstalledFileManifestVersionedCanonicalOwnerAndDiagnosticOnlyFreshReproduction_V1_Result_20260810.md` | 9066 | 270 | `5efce5eb52ebf1e0eb2f6e2e46049df86808201c138b6db711f1a6f156f1fe22` | `71f35f124ef0061e23d62e54a410b052358e5640` |
| Body-free Receipt | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4_PostG6SharedStructuralCorrection_InstalledFileManifestVersionedCanonicalOwnerAndDiagnosticOnlyFreshReproduction_V1_BodyFree_Receipt_20260810.json` | 17276 | 393 | `1c1e240d7e5458edb0f6bf0f5abe50433074161ff320470e5b01917d126f9c24` | `33f706029f8dc2962ccfb2af3195b3a76f5bd399` |
| Receipt logical | sorted compact JSON with self field empty, no final LF | — | — | `3b214273db8049b6b589b9fb017b3a8cfd69085f21cfa199f106f2c604a702a5` | — |
| Handoff | this path | self identity omitted to avoid a hash cycle | — | — | — |

All durable artifacts are UTF-8, LF-only, mode `100644`, and end with LF.

## Protected boundary and next decision

```text
pytest probe / role smoke / full-root readiness / runtime admission:
  0 / 0 / 0 / 0

Gate B recovery / Gate C / target import-collection-call:
  0 / 0 / 0-0-0

production / protected append / fixture / sample / corpus / mashos-api writes:
  0 / 0 / 0 / 0 / 0 / 0

Product Read / G5 / G6 / G7 / Cycle001 acceptance:
  0 / 0 / 0 / 0 / 0
```

The next authority is unselected. A comparator decision, expected identity refreeze, new readiness
rematerialization, Gate B recovery, Gate C, target work, or any second diagnostic attempt requires separate
Mash approval.

```text
INSTALLED_FILE_MANIFEST_COMPARATOR_DECISION_REQUIRED
NO_COMPARATOR_CHANGE
NO_RUNTIME_READY_OR_READINESS_CREDIT
CURRENT_DIAGNOSTIC_AUTHORITY_CLOSED_CONSUMED_TYPED_STOP
NEXT_AUTHORITY_UNSELECTED_SEPARATE_MASH_APPROVAL_REQUIRED
CURRENT_AUTHORITY_STOP
AUTOMATIC_PROGRESSION_FALSE
```

Publication is complete only after GitHub fresh postwrite verification proves exact7 changed-path union,
remote prepared-byte equality, unauthorized/deletion/rename 0, and latest-main inclusion. This Handoff omits
its own identity to avoid a hash cycle.
