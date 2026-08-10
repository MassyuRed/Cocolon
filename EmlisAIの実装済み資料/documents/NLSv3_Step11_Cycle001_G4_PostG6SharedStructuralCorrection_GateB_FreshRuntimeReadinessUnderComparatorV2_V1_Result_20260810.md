# NLSv3 Step11 Cycle001 G4 post-G6 shared structural correction — Gate B fresh runtime readiness under comparator V2 V1 Result

- date: `2026-08-10`
- authority: `NLS_V3_STEP11_CYCLE001_G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_FRESH_RUNTIME_READINESS_UNDER_COMPARATOR_V2_V1`
- lifecycle: `CURRENT_AUTHORITY_CLOSED_CONSUMED_TYPED_FAILURE`
- terminal: `INDEPENDENT_IDENTITY_DERIVATION_INVALID`
- runtime READY: `false`
- current-session readiness credit: `0`
- automatic progression: `false`

## 0. Conclusion

The separately approved Gate B authority was activated once and consumed once. Static preactivation,
configured-route acquisition, fresh exact5 materialization, the owner full-identity derivation under the
current V2 comparator, the exact pytest `8.4.1` version probe, and the required-role exact3 smoke all
completed successfully.

The frozen independent verifier then executed exactly once and terminated before deriving its full
identity. Its implementation supplied an unsupported `newline` argument to `Path.read_text`. The safe
typed authority reason is `INDEPENDENT_IDENTITY_DERIVATION_INVALID`; the safe diagnostic detail is
`INDEPENDENT_HELPER_TEXT_READ_API_ARGUMENT_INVALID`.

The helper was not edited or re-executed. The fresh root was not repaired, retried, reclassified, or
admitted. Owner/independent reconciliation, pre/post full-root reconciliation, readiness observation,
runtime READY admission, and readiness credit were not established.

```text
G4_GATE_B_COMPARATOR_V2_INDEPENDENT_IDENTITY_DERIVATION_INVALID
FRESH_ROOT_FAILED_CLOSED_UNADMITTED
RUNTIME_READY_CURRENT_SESSION_FALSE
READINESS_CREDIT_0
CURRENT_AUTHORITY_CLOSED_CONSUMED_TYPED_FAILURE
CURRENT_AUTHORITY_STOP
AUTOMATIC_PROGRESSION_FALSE
```

## 1. Frozen entry and current comparator

```text
Cocolon entry commit / tree:
f07e56478ed6429d62fb4415e59de85e57d7a8e4
990a2aea4b82946964d43cef92a01fdac4f45ac2

mashos-api entry commit / tree:
45bf98f9034261d3adb3e808d6d759f2334e2d25
23f1684ed5430cafef955d7af9fc6bde75a4c62f

canonical installed-file schema:
NLS_V3_INSTALLED_FILE_MANIFEST_CANONICAL_V1

current V2 comparator:
0eba095e4c173b4b69f68532fd66cf2c871ab9edef64d91754b52ed7daee15c5
```

The current V2 owner remains blob `3b9b332b1eea402dc18b7e7ceb8528e8f3bac678`, raw SHA-256
`9141231049a10a1d04741d66d6cab09ff3a831bd7bb096f1212f382ac381a808`. The canonical schema,
formal lock, requirements, exact5 closure, historical comparator role, and historical results were not
changed.

Before network or runtime effects, the authority froze a path-free execution contract of 6,671 bytes,
97 LF, raw SHA-256 `ca5a890d5de0e53cde126c41a8bd28babdc90198a2ccf5ef9b87d474b9132816`.
It fixes the full-root row schema, every higher identity preimage, the compared exact19 field set, the
stage order, a closed typed-reason map, output paths, and the exact6 publication boundary.

## 2. Immutable runner inputs and helper freeze

| Input | Identity |
|---|---|
| formal lock blob / raw / logical | `0822fcb010985cd0d384f250a9e8a1fe16dc8fd4` / `9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787` / `801ba54efc0f6655238d14e7c153fb70b555801489aa8ba028515fc64d9c05f4` |
| corrected exact7 projection | 2,185 bytes / `f501025c1dccef68c47c0a3e52f3ef74d01233f371b16f2b1a0bdfb21089e57e` |
| exact5 requirements | 473 bytes / LF5 / `4f7218509a20e42850afe75597f2abfdf447035001847621d4637faa246065f1` |
| accepted wheel manifest | exact5 / 1,724,842 bytes / `00d2df98c8cda7f1473794892bafe7ccd18cc816c79ccb346f3e21ff629b136d` |
| distribution closure | exact5 / `4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c` |
| base/admitted interpreter | CPython 3.12.13, Linux x86_64 / `9ed008e5a8685235361f0c53771b520ab082dd99a877ad2fd796a93fa4c0b488` |
| environment policy | `8a43751b49a8db1d024063608405f9b169e829f3c0be3488433b31800d44b1a4` |
| required-role ordered paths | `e01f5e587ba1884b988075eee1c162454d3a6a1d4b10febc3b7111c2b5c1b248` |

Authority-bound helper exact5 were created and frozen before acquisition. A single static syntax pass
accepted all five bodies. Their bodies and absolute paths are private and are not published.

| Role | Bytes | Raw SHA-256 | Creation | Execution |
|---|---:|---|---:|---:|
| projection verifier | 5,589 | `7c3a6e3fe19f05af0a354339a4da57c840bbb69d00c25ca9fc1d2701c024b4b8` | 1 | 1 |
| materializer | 11,578 | `ba4f1cd757c75b65178f7de63e2c6eed1068f422209bb2204e3c2df8bdb94c6e` | 1 | 1 |
| owner identity verifier | 19,306 | `81bbc37074754270297ac6bdebd9b8a7e045a94fe4c46ddaae2dfadc99e74ec6` | 1 | 1 |
| independent identity verifier | 17,809 | `dc2e8c3141a67724f4bc2cfd914fffb5795283111791a63124ba54d780ccb71c` | 1 | 1 |
| required-role smoke | 4,032 | `f649864f6839e17bf861d8ab67ceb7379ccc3da64271a2a5d7386374f0e6be05` | 1 | 1 |

Prior or failed helper/root/wheel/readiness-credit reuse is 0. Helper mutation after freeze is 0.

## 3. Acquisition and fresh materialization

```text
configured-route acquisition / network process / exit:
1 / 1 / 0

accepted / rejected / sdist / build / substitution:
5 / 0 / 0 / 0 / 0

unconfigured source / post-acceptance index access:
0 / 0

fresh root nonexistent before / fresh rematerialization:
true / 1

venv --without-pip --copies / local install process:
1 / 1

venv exit / install exit:
0 / 0

distribution / installed RECORD-closure match:
5 / 5
```

The acquisition output is retained only as 1,356 private bytes with SHA-256
`e6f9e0fa85ecb5c2886cf6097591e69f04b6192a1e03e32bfcd86a1f2359a104`. The local install output is
retained only as 983 private bytes with SHA-256
`52c6285fb1a63614766e42de92838fd267bf9ef92d2761ea29c6172745d48a79`.
The configured route, URL, credentials, raw process output, wheels, RECORD bodies, and runtime body are
not published.

The materialization event ID is
`ce78033a35c7e50c88bb4c29b425f644deaf8c6924ed342ba9b36311af42f78a`. It identifies a new instance;
it does not inherit any prior readiness credit.

## 4. Owner full identity before probes

The owner derivation executed once and returned `VALID / ALL_CHECKS_EQUAL`. The installed-file manifest
reproduced the current V2 comparator exactly.

| Field | Owner observation |
|---|---|
| logical runtime ID | `6aeac10945cd15e1ee3b9f40ab3c6367c08114a4ff2032cda56f9165205746cb` |
| runtime content identity | `394d81424265cdc79cbe67dc46ab2952565cd7e3f9a5f78d272773280208e549` |
| runtime-root identity | `9d9b17f9bcd366ef5e5903d35f2a8bfef4da5d7ec0df437746f0fbeb11db0845` |
| runtime instance observation | `ebdf69585d726616a87ba1799fb4c24f4d759a49c816e506e3b6ab47261925a8` |
| full runtime-root manifest | `f39533f80fb3c1dfd2605e39c9b64d556ac24b4f50a185de703c7c43ed368931` |
| installed-file manifest | `0eba095e4c173b4b69f68532fd66cf2c871ab9edef64d91754b52ed7daee15c5` |
| entrypoint-control identity | `7552ff240cb31cc08273f3cf40bd666bf813147c36091e585b2a90826e27a095` |
| distribution closure | `4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c` |
| resolved interpreter | `9ed008e5a8685235361f0c53771b520ab082dd99a877ad2fd796a93fa4c0b488` |

Canonical V1 diagnostics were rows/preimage bytes/LF `482 / 89653 / 0`; site regular/directories/symlinks/
other were `487 / 27 / 0 / 0`; eligible/owned/unowned/duplicate/missing/extra were
`482 / 482 / 0 / 0 / 0 / 0`; RECORD-self exclusions and verified external entrypoints were `5 / 3`.
PYC and `__pycache__` counts were 0. Every fixed mismatch-family count was 0, mismatch-row digest was
`4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945`, and canonical pathset digest was
`6fb972b20c2c5c776886c53c905bf08e8577fa74284d760c39065b9ba65328f2`.

These are owner observations only. Because the independent derivation failed, they are not admitted as a
reconciled runtime identity or readiness credit.

## 5. Readiness probes reached before the typed failure

The pytest version probe used the admitted `bin/python` from an empty non-repository directory with the
fixed environment policy and removed `PYTEST_ADDOPTS`, `PYTEST_PLUGINS`, and `PYTHONPATH`.

```text
pytest probe count / exit / reported version / result:
1 / 0 / 8.4.1 / VALID

stdout bytes / SHA-256:
13 / b2e1053958c9395fa5cc8f621e613449d36f3cdddc21c7bbba2364493e225064

stderr bytes / SHA-256:
0 / e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855

path-free argv SHA-256:
4c8c5452cc1b85902df26fa8bc5196b60a4a180f99436626123e0c853426b541
```

The separate role-smoke process direct-loaded owner, independent, and parent sources, checked each named
public callable and its one-argument signature, and did not call a public API.

```text
role-smoke process / exit / direct load / public API call / effect:
1 / 0 / 3 / 0 / 0

stdout bytes / SHA-256:
707 / 7dde425c3f2bb068d594ee2324e8162fab9107b652a104496c6a97b471520ea5

stderr bytes / SHA-256:
0 / e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855

role-smoke helper / path-free argv SHA-256:
f649864f6839e17bf861d8ab67ceb7379ccc3da64271a2a5d7386374f0e6be05
cae3847af147ecd9c1dc0a023221f0401f6594f0b8c3e64350600f79d2b2e35b
```

## 6. Independent-verifier typed failure

```text
independent helper execution:
1

independent result / verdict:
INVALID / INVALID

typed stage / reason:
INDEPENDENT_IDENTITY / INDEPENDENT_IDENTITY_DERIVATION_INVALID

safe detail:
INDEPENDENT_HELPER_TEXT_READ_API_ARGUMENT_INVALID

private failure observation bytes / SHA-256:
243 / a816e0a73a36c4b61aba99d53c60d794f3456de4fd057c617b80e58b8819fde8
```

No second helper, helper edit, retry, fallback, interpreter switch, root repair, re-acquisition, or second
derivation was performed. The independent exact19 value, owner/independent equality, post-probe full-root
identity, readiness observation, runtime readiness observation ID, and continuity-chain identity are
`NOT_DERIVED`.

## 7. Counter closure and non-effects

```text
projection / materializer / owner / pytest / role smoke / independent:
1 / 1 / 1 / 1 / 1 / 1

owner valid / independent valid / reconciliation complete:
1 / 0 / 0

pre/post full-root reconciliation / readiness admission / readiness credit:
0 / 0 / 0

prior root / wheel / helper / credit reuse:
0 / 0 / 0 / 0

retry / fallback / interpreter switch / repair / deletion:
0 / 0 / 0 / 0 / 0

target import / collection / call / targeted pytest:
0 / 0 / 0 / 0

Gate C / protected append / production / mashos-api write:
0 / 0 / 0 / 0

Product Read / G5 / G6 / G7 / Cycle001 acceptance:
0 / 0 / 0 / 0 / 0
```

The failed root is `FAILED_CLOSED_UNADMITTED_SESSION_LOCAL_ROOT`. Its absolute locator is private. It is not
a current runtime, retained runtime, admitted runtime, or reusable readiness source. Cycle001 remains
`NOT_ACCEPTED`.

## 8. Durable publication scope

This result is published with a new body-free Receipt and Handoff plus append-only Plan/07 updates and an
additive 08 current-navigation update: new exact3, modified exact3, changed exact6. Deletion, rename,
unauthorized path, and mashos-api changed-path counts must remain 0. Historical artifacts are not rewritten.

No absolute runtime/helper path, concrete manifest row/path list, file/package/RECORD/wheel/runtime body,
configured route/URL, credential, environment value, raw acquisition/process output, traceback, production
body, or protected-test body is included.

## 9. Next separate authority proposal

The minimal next proposal is:

`NLS_V3_STEP11_CYCLE001_G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_CORRECTED_INDEPENDENT_VERIFIER_AND_FRESH_RUNTIME_READINESS_UNDER_COMPARATOR_V2_V2`

It is `DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED`. If separately approved, it must correct and freeze
the independent helper before effects, create a new fresh exact5 runtime, repeat acquisition/materialization/
owner/probes/independent reconciliation once, and stop at fresh READY or one typed failure. It must not reuse
this failed root, downloaded wheels, helpers, or readiness evidence.

Gate C, protected-test append, target execution, production, G5/G6/G7, and Cycle001 acceptance remain outside
that proposal and require later separate approval.

## 10. Terminal

```text
CURRENT_COMPARATOR_V2_0EBA095E_UNCHANGED
OWNER_MANIFEST_MATCH_AND_PROBES_VALID_NOT_ADMITTED
INDEPENDENT_IDENTITY_DERIVATION_INVALID
FAILED_ROOT_UNADMITTED_NO_REUSE
NO_RUNTIME_READY_OR_READINESS_CREDIT
CURRENT_AUTHORITY_CLOSED_CONSUMED_TYPED_FAILURE
NEXT_CORRECTED_INDEPENDENT_VERIFIER_FRESH_GATE_B_SEPARATE_APPROVAL_REQUIRED
CURRENT_AUTHORITY_STOP
AUTOMATIC_PROGRESSION_FALSE
```
