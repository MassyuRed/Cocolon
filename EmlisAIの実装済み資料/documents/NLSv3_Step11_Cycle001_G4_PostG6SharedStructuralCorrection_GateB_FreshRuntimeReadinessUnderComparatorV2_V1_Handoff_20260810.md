# NLSv3 Step11 Cycle001 — Gate B comparator V2 independent-verifier typed-failure handoff

- date: `2026-08-10`
- authority: `NLS_V3_STEP11_CYCLE001_G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_FRESH_RUNTIME_READINESS_UNDER_COMPARATOR_V2_V1`
- lifecycle: `CURRENT_AUTHORITY_CLOSED_CONSUMED_TYPED_FAILURE`
- state: `G4_GATE_B_COMPARATOR_V2_INDEPENDENT_IDENTITY_DERIVATION_INVALID`
- automatic progression: `false`

## Closed authority result

The approved one-shot Gate B attempt consumed its authority. Acquisition exact1, accepted wheel exact5,
fresh rematerialization exact1, owner full identity exact1, pytest `8.4.1` probe exact1, and required-role
smoke exact1 all succeeded. The current installed-file comparator remained
`0eba095e4c173b4b69f68532fd66cf2c871ab9edef64d91754b52ed7daee15c5`, and the owner reproduced it.

The frozen independent verifier then failed on its only execution because its implementation supplied an
unsupported `newline` argument to `Path.read_text`. The authority-safe reason is
`INDEPENDENT_IDENTITY_DERIVATION_INVALID`; safe detail is
`INDEPENDENT_HELPER_TEXT_READ_API_ARGUMENT_INVALID`.

No helper correction or second execution was performed. Owner/independent equality and pre/post full-root
equality were not established. The root is failed-closed and unadmitted. Runtime READY and current-session
readiness-credit counts are 0.

## Durable artifact identities

| Role | Git blob SHA-1 | Raw SHA-256 | Bytes | LF |
|---|---|---|---:|---:|
| Result | `f24b2b3b80bb2ba284d9f764b75a68dfdd31ccbf` | `4af089e307187972c2b883f5200a58fc49e6b33ad8cf31f4c7afd4e7703c4972` | 12,436 | 283 |
| Body-free Receipt | `c2a0ca0c41b4c043d2195b3db1889a76aaab2933` | `dc4ac41272e54686754949dcda27582c5801b0fd20e5e1cb2579e38cd7d6af63` | 20,810 | 455 |

Receipt logical SHA-256 is
`426d65a146c183fa753b07f7bee97b66b0e8e1102cf26093fac27ab9f63788ae` under its empty-self-field,
sorted-compact UTF-8 JSON rule. This Handoff omits its own identity to avoid a hash cycle.

## Current frozen facts

```text
Cocolon entry:
f07e56478ed6429d62fb4415e59de85e57d7a8e4

mashos-api unchanged:
45bf98f9034261d3adb3e808d6d759f2334e2d25

canonical installed-file schema:
NLS_V3_INSTALLED_FILE_MANIFEST_CANONICAL_V1

current expected installed-file manifest:
0eba095e4c173b4b69f68532fd66cf2c871ab9edef64d91754b52ed7daee15c5

formal lock logical identity:
801ba54efc0f6655238d14e7c153fb70b555801489aa8ba028515fc64d9c05f4

projection / requirements / wheel manifest / distribution closure:
f501025c1dccef68c47c0a3e52f3ef74d01233f371b16f2b1a0bdfb21089e57e
4f7218509a20e42850afe75597f2abfdf447035001847621d4637faa246065f1
00d2df98c8cda7f1473794892bafe7ccd18cc816c79ccb346f3e21ff629b136d
4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c
```

The historical `9c6925ed...` comparator role remains noncurrent. Historical READY, G5 machine GREEN, G6
REJECT, and all prior receipts are unchanged and receive no new credit.

## Observations reached before failure

Owner exact19 included the following current-instance observations:

```text
materialization event:
ce78033a35c7e50c88bb4c29b425f644deaf8c6924ed342ba9b36311af42f78a

logical / content / root / instance:
6aeac10945cd15e1ee3b9f40ab3c6367c08114a4ff2032cda56f9165205746cb
394d81424265cdc79cbe67dc46ab2952565cd7e3f9a5f78d272773280208e549
9d9b17f9bcd366ef5e5903d35f2a8bfef4da5d7ec0df437746f0fbeb11db0845
ebdf69585d726616a87ba1799fb4c24f4d759a49c816e506e3b6ab47261925a8

full-root / installed-file / entrypoint-control:
f39533f80fb3c1dfd2605e39c9b64d556ac24b4f50a185de703c7c43ed368931
0eba095e4c173b4b69f68532fd66cf2c871ab9edef64d91754b52ed7daee15c5
7552ff240cb31cc08273f3cf40bd666bf813147c36091e585b2a90826e27a095
```

Canonical diagnostics matched the known good V1 shape: rows/eligible/owned `482/482/482`, installed
distribution/RECORD closure `5/5`, verified external entrypoints `3`, and every mismatch family 0.

Pytest returned exact `8.4.1` with exit 0, stdout 13 bytes SHA-256 `b2e10539...`, and empty stderr.
Role smoke returned exit 0 with direct loads/API calls/effects `3/0/0`. These successful observations are
not sufficient for readiness because the independent full-identity result is absent.

## Zero and no-reuse boundary

```text
independent execution / valid verdict:
1 / 0

owner-independent reconciliation / pre-post root reconciliation:
0 / 0

runtime READY / readiness credit:
0 / 0

retry / fallback / interpreter switch / repair / failed-root deletion:
0 / 0 / 0 / 0 / 0

prior root / wheel / helper / readiness-credit reuse:
0 / 0 / 0 / 0

Gate C / protected append / target import-collect-call / targeted pytest:
0 / 0 / 0-0-0 / 0

production / mashos-api write / G5 / G6 / G7 / Cycle001 acceptance:
0 / 0 / 0 / 0 / 0 / 0
```

The failed root and acquired wheel set are current-authority private observations only. They are not
eligible for reuse by a later authority. Absolute locators, configured routes, credentials, raw outputs,
helper bodies, package/RECORD/runtime bodies, and concrete manifest rows are not published.

## Next authority requirement

The only minimal proposal named by this handoff is:

`NLS_V3_STEP11_CYCLE001_G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_CORRECTED_INDEPENDENT_VERIFIER_AND_FRESH_RUNTIME_READINESS_UNDER_COMPARATOR_V2_V2`

Current proposal state: `DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED`.

If separately approved, it must fix and freeze the independent helper before effects, allocate and populate
a new fresh exact5 root, reacquire the exact5 wheel set through one configured-route process, and repeat the
owner/probe/role/independent/reconciliation sequence exactly once. It must not reuse the failed root,
downloaded wheels, helper bodies, or any readiness observation from this authority. It must stop at either
fresh READY plus one new credit or one typed failure.

Gate C, protected-test append, target execution, production, G5/G6/G7, and Cycle001 acceptance are not
authorized by this handoff.

## Terminal

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
