# Result — installed-file manifest versioned canonical owner and diagnostic-only fresh reproduction V1

- Date: 2026-08-10
- Decision owner: Mash
- Operation owner: Karen
- Authority: `NLS_V3_STEP11_CYCLE001_G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_INSTALLED_FILE_MANIFEST_VERSIONED_CANONICAL_OWNER_AND_DIAGNOSTIC_ONLY_FRESH_REPRODUCTION_V1`
- Classification: `EXPECTED_IDENTITY_NOT_REPRODUCED_COMPARATOR_DECISION_REQUIRED`
- Lifecycle: `CURRENT_DIAGNOSTIC_AUTHORITY_CLOSED_CONSUMED_TYPED_STOP`
- Body-free: true
- Automatic progression: false

## Outcome

The current expected installed-file manifest value remains unchanged:

```text
9c6925ed94b8eb1ccd22d2d4aeccc5dde35c7c23915ae6d367fcaff17bf09de6
```

Stage D0 durably froze a versioned owner for
`NLS_V3_INSTALLED_FILE_MANIFEST_CANONICAL_V1`. Stage D1 then performed the separately approved,
nonadmitted diagnostic-only fresh reproduction exactly once. Fresh acquisition, exact5 wheel and wheel
RECORD verification, venv creation, hash-required local install, owner derivation, and independently
implemented derivation all completed successfully.

The owner and independent diagnostic cores were byte-canonically equal. Distribution and installed RECORD
closure exact5 matched the frozen identities. Missing, extra, unowned, duplicate, symlink, nonregular,
content, RECORD, cache, and closure mismatch observations were all zero. The resulting canonical identity was:

```text
0eba095e4c173b4b69f68532fd66cf2c871ab9edef64d91754b52ed7daee15c5
```

It does not equal the unchanged current expected identity. The exactly-one classification is therefore:

```text
EXPECTED_IDENTITY_NOT_REPRODUCED_COMPARATOR_DECISION_REQUIRED
```

No comparator, expected identity, formal lock, or acceptance rule was changed. No runtime READY or readiness
credit was issued.

## Fresh entry gate

```text
Cocolon main at activation:
  c974f672b7bd3089700e3d7834527995cfff0aa0

mashos-api main / tree:
  45bf98f9034261d3adb3e808d6d759f2334e2d25
  23f1684ed5430cafef955d7af9fc6bde75a4c62f

current recovery Result / Receipt / Handoff blobs:
  943db07ae0ce1f33a6a1b152d04acf5b30236d2e
  5e6e7c08787485ec34de09eb290b08835cbdca11
  4190d2f05b9b2d638436b7786ce304576dd20a44

current recovery state / cause / lifecycle:
  G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_RECOVERY_TYPED_FAILURE
  FAILED_ROOT_NOT_AVAILABLE_FOR_CAUSAL_DIAGNOSIS
  CLOSED_CONSUMED_TYPED_FAILURE

same-series retry / automatic progression:
  false / false

related drift count:
  0
```

The prior exact6 publication remained included in latest main with prepared-byte equality and
unauthorized/deletion/rename counts 0/0/0. This authority did not reopen, retry, reuse, reactivate, or
reclassify the failed Gate B V1 or Recovery V1.

## Stage D0 — versioned canonical owner

The following exact owner was new before write and was durably created before D1:

`EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_InstalledFileManifest_VersionedCanonicalOwner_V1_20260810.json`

```text
D0 commit:
  e91aece89f5a3e89f7ee788b8cae981862429a1a

owner bytes / LF / CR / final-LF / mode:
  16313 / 380 / 0 / true / 100644

owner raw SHA-256 / Git blob:
  ca2f6aa5de27a01e73d92ebb3b98940f912c201486eb7510c9a3d7a166243acd
  cc7c9f5573124aded5f007802ed031d79d92a7d8

fresh remote prepared-byte equality / latest inclusion:
  true / true
```

The owner separates the public contract document from the derived manifest preimage. The identity preimage
is an array without a schema wrapper: row exact4, frozen distribution order then Unicode-codepoint POSIX
path order, lexicographic object keys, compact UTF-8 JSON, and no final LF. Concrete rows and path lists are
not published.

Frozen helper bodies before D1:

| Role | Bytes | LF | Raw SHA-256 | Git-object identity | Creation / execution before D1 |
|---|---:|---:|---|---|---|
| Owner derivation | 31211 | 789 | `cacf1bb15d61943e7934037aec6b5d6e69a27d9a0da93dc07d4ba988e3d2b50e` | `acac8c45dafc4f0ed5cbabb24b966f5e4bc264e6` | 1 / 0 |
| Independent derivation | 30411 | 721 | `071fa8f2225c170cad1f7afc56111d83c4319f593f76d7caa9c40ec4785fc37c` | `416a53a48c175f257d66fbb49081729df2cb49fa` | 1 / 0 |

The implementations share no module and do not import each other. Prior helper copy/reuse was 0. Their
tracked procedure binding is exact2:

- runtime continuity: blob `ea7f96221846e5614431296e00ac481cc00e00a2`, raw
  `42fcd4d65b0d21b5e41659b6329c55c14ed42c0270838f13be6102b351db7ac9`;
- one-shot prelaunch: blob `5c3b7dd03c84a84a2717f57f0d2c99c39b2ed6d8`, raw
  `895ea1f130e331d4e89f857835b4477d949c1ff63c0adea11276bc97b4c717b2`.

## Immutable input identities

```text
formal lock blob / raw / logical SHA-256:
  0822fcb010985cd0d384f250a9e8a1fe16dc8fd4
  9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787
  801ba54efc0f6655238d14e7c153fb70b555801489aa8ba028515fc64d9c05f4

corrected projection bytes / SHA-256:
  2185
  f501025c1dccef68c47c0a3e52f3ef74d01233f371b16f2b1a0bdfb21089e57e

requirements bytes / LF / raw SHA-256:
  473 / 5
  4f7218509a20e42850afe75597f2abfdf447035001847621d4637faa246065f1

accepted wheel manifest / distribution closure:
  00d2df98c8cda7f1473794892bafe7ccd18cc816c79ccb346f3e21ff629b136d
  4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c

base runtime / interpreter SHA-256:
  CPython 3.12.13 / Linux x86_64
  9ed008e5a8685235361f0c53771b520ab082dd99a877ad2fd796a93fa4c0b488
```

## Stage D1 — single fresh diagnostic reproduction

```text
attempt / retry / fallback / attempt-two:
  1 / 0 / 0 / 0

failed root / prior root / prior wheel / prior helper / readiness-credit reuse:
  0 / 0 / 0 / 0 / 0

new private staging / download / runtime root:
  1 / 1 / 1

configured route / network process / exit:
  1 / 1 / 0

fresh accepted wheel count / total bytes / all wheel+RECORD identity match:
  5 / 1724842 / true

rejected / sdist / build / substitution / unconfigured source:
  0 / 0 / 0 / 0 / 0

venv --without-pip --copies / exit:
  1 / 0

hash-required no-index no-deps wheel-only no-compile install / exit:
  1 / 0

owner creation / execution / exit:
  1 / 1 / 0

independent creation / execution / exit:
  1 / 1 / 0

owner-independent equality:
  true
```

The owner and independent private reports were not published. Their body-free identities are:

| Role | Report bytes | Raw SHA-256 |
|---|---:|---|
| Owner | 2566 | `7b7506501ab9fcf57af79d5ea50290849232a30627d22f83717395b80ead0a5a` |
| Independent | 2869 | `abf956b966a6e670892d7b020faaa692c97bac61689c94e8d3d6c021cab6ea56` |
| Equal diagnostic core | — | `a0391ee0f772f4d179b3285d47eb6ef608b1aa5c622384ce1f09ba5a0a6f8ce0` |

Combined private process output was 2323 bytes with raw SHA-256
`e8899e0c4586c23a7732aecab11199e69c95a46b22d7dc0698e5d1621784ed11`; its body remains private.

## Body-free canonical observation

```text
actual / expected canonical manifest SHA-256:
  0eba095e4c173b4b69f68532fd66cf2c871ab9edef64d91754b52ed7daee15c5
  9c6925ed94b8eb1ccd22d2d4aeccc5dde35c7c23915ae6d367fcaff17bf09de6

expected identity match:
  false

canonical row / preimage bytes / preimage LF:
  482 / 89653 / 0

site regular / directory / symlink / other:
  487 / 27 / 0 / 0

eligible / owned / unowned / duplicate:
  482 / 482 / 0 / 0

missing / extra / pyc / pycache directory:
  0 / 0 / 0 / 0

record self excluded / verified external entrypoint:
  5 / 3

installed distributions / RECORD closure matches:
  5 / 5

distribution closure SHA-256 / match:
  4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c
  true

canonical pathset digest:
  6fb972b20c2c5c776886c53c905bf08e8577fa74284d760c39065b9ba65328f2

mismatch-row digest / row count / active family count:
  4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945
  0 / 0
```

Every fixed mismatch family count is 0. No concrete manifest row, relative path list, absolute locator,
file/package/RECORD/wheel body, route body, environment value, credential, raw process output, or traceback
is published.

## Protected and readiness boundaries

```text
pytest probe / role smoke / full-root readiness identity / runtime admission:
  0 / 0 / 0 / 0

Gate B recovery / Gate C:
  0 / 0

target import / collection / call:
  0 / 0 / 0

targeted pytest / exact24 / full52 / full54 / whole collection / exact100:
  0 / 0 / 0 / 0 / 0 / 0

production / protected-test / protected append / fixture / sample / corpus changes:
  0 / 0 / 0 / 0 / 0 / 0

mashos-api write / Product Read / G5 / G6 / G7 / Cycle001 acceptance:
  0 / 0 / 0 / 0 / 0 / 0

formal lock / expected manifest / acceptance rule changes:
  0 / 0 / 0
```

## Terminal

```text
INSTALLED_FILE_MANIFEST_COMPARATOR_DECISION_REQUIRED
NO_COMPARATOR_CHANGE
NO_RUNTIME_READY_OR_READINESS_CREDIT
CURRENT_DIAGNOSTIC_AUTHORITY_CLOSED_CONSUMED_TYPED_STOP
NEXT_AUTHORITY_UNSELECTED_SEPARATE_MASH_APPROVAL_REQUIRED
CURRENT_AUTHORITY_STOP
AUTOMATIC_PROGRESSION_FALSE
```

This authority is consumed. No second diagnostic attempt, comparator refreeze, readiness rematerialization,
Gate B recovery, Gate C, target work, or automatic progression is authorized.
