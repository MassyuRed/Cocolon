---
doc_id: NLSv3_Step11_Cycle001_G5_GateB_FrozenExact5RuntimeRecoveryAndFreshReadiness_TypedPreMaterializationStop_Handoff_20260809
date: "2026-08-09"
state: "G5_GATE_B_MATERIALIZER_SCHEMA_INVALID_PREMATERIALIZATION_STOP"
body_free: true
automatic_progression: false
---

# G5 Gate B frozen-exact5 recovery — typed STOP Handoff

## Current state

The separately approved Gate B authority is closed and consumed at one typed terminal:

```text
G5_GATE_B_MATERIALIZER_SCHEMA_INVALID_PREMATERIALIZATION_STOP
AUTHORITY_BOUND_MATERIALIZER_PROJECTION_PREIMAGE_SCHEMA_INVALID_PREMATERIALIZATION_STOP
```

The frozen exact5 wheel acquisition succeeded once: accepted exact5, rejected0, sdist0,
build0, substitution0, and unconfigured source0. The accepted manifest is
`00d2df98c8cda7f1473794892bafe7ccd18cc816c79ccb346f3e21ff629b136d`.

The authority-bound materializer then compared a full exact9 lock-row projection
`0d8c1584d30eb417142e1afac13b776a235def0112ef58e928f8322ad781e13f`
to the frozen exact7 projection
`f501025c1dccef68c47c0a3e52f3ef74d01233f371b16f2b1a0bdfb21089e57e`.
The required ordered keys are `distribution_version`, `installed_record_closure_sha256`,
`normalized_distribution_name`, `selected_dependency_names`, `wheel_filename`,
`wheel_record_sha256`, and `wheel_sha256`; `requires_dist` and `top_level_imports` are excluded.
Canonicalization is lock-order exact5 rows, lexicographically ordered selected object keys,
UTF-8 compact JSON array, and no final LF.
It fail-closed before creating any runtime entry. The fresh private root remained empty;
rematerialization, owner/independent identity derivation, version probe, role probe, and target
were all0. No retry, repair, helper reuse, fallback, or interpreter switch was performed.

## Authority and effects

```text
Gate B approval / activation / consumption / classification / close:
1 / 1 / 1 / 1 / 1

configured-route acquisition / network / accepted wheels:
1 / 1 / 5

materializer helper creation / execution / exit:
1 / 1 / 1

fresh root allocation / entries after helper / rematerialization:
1 / 0 / 0

independent verifier execution / version probe / role probe / direct role load:
0 / 0 / 0 / 0

target import / collection / call / targeted pytest:
0 / 0 / 0 / 0

production / protected test / fixture / sample / mashos-api change:
0 / 0 / 0 / 0 / 0

G5 GREEN / G6 / Cycle001 acceptance:
0 / 0 / 0
```

Corrected G4 remains closed with 22 PASS / 2 causal RED. The bounded production candidate was
not applied, executed, or published. The historical failed Gate B version probe remains a distinct
closed noncredit count1 and was not retried or reclassified.

## Durable artifacts

| role | path | bytes | LF | SHA-256 | Git blob |
|---|---|---:|---:|---|---|
| Result | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G5_GateB_FrozenExact5RuntimeRecoveryAndFreshReadiness_TypedPreMaterializationStop_Result_20260809.md` | 10226 | 271 | `974f481a34d7ee2e5ca05ec40c0556e630bac89ee4cfb4d53baf6ca1c4a4fae4` | `a3fa32da423e5a77f00889eac19a407f5e517bef` |
| body-free Receipt | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G5_GateB_FrozenExact5RuntimeRecoveryAndFreshReadiness_TypedPreMaterializationStop_BodyFree_Receipt_20260809.json` | 10404 | 231 | `12f83593f72fcd5a9bd753748f881002a021fe8d1f720db889a227ba892dc5b6` | `1bd9f855ca8384ed8b16e694459dc7e62b77a196` |
| Handoff | this path | self identity intentionally omitted to avoid a hash cycle | self identity intentionally omitted | self identity intentionally omitted | self identity intentionally omitted |
| Plan append-only postimage | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md` | 1172811 | 18333 | `2065096670ef8a966172c1e881074fd46dbb2641090afb8e884b01ba6a485e6e` | `45a2b5ac04a865c542db6d918ba2add0e63f201d` |
| 07 append-only postimage | `Cocolon_前提資料/07_latest_snapshot_diff.md` | 2369558 | 39071 | `c44547128eaec3e2e8093568b69594ab1fbbecca8df41fa610749bd357aea292` | `5df05e2508cd89beccc4db3d1bb058e0c245f072` |
| 08 append-only postimage | `Cocolon_前提資料/08_cycle001_current_state.md` | 25161 | 619 | `812ee11b075a9c805628c8e6c61d42ca1a1fbf2a8dd5ace8c24e5a21d12bac6e` | `1ff5d99b7a88e8fd7f389e4d6528e8ffcfa14e0e` |

The Result contains the complete exact5 filename/raw/wheel-RECORD identity bundle, lifecycle,
counters, and exact semantic cause. The Receipt is JSON-valid and binds the Result identity,
source cut, acquisition, failed helper identities, downstream zeros, privacy, and next boundary.
The private route, absolute runtime/helper paths, wheel/package bodies, helper bodies, raw stderr,
traceback, credentials, and environment values are not published.

The acquired wheel bytes and failed helpers are session-local noncredit material and are explicitly
nonreusable after this closed authority. No future work depends on their local bytes.

## STOP and next authority

```text
current state:
G5_GATE_B_PREMATERIALIZATION_TYPED_STOP

first unfinished gate:
G5_GATE_B_CORRECTED_PROJECTION_SCHEMA_FRESH_RECOVERY_ONLY

next authority:
SEPARATE_MASH_APPROVAL_REQUIRED

Gate C:
UNISSUED_INACTIVE

automatic progression:
false
```

A later Gate B correction must create a new nonreused helper, project the frozen ordered exact7 keys
with the frozen canonical rule, statically prove that semantic projection, establish exact5 artifact availability under new
counters, and perform a fresh isolated recovery. Even a future READY checkpoint would stop before
Gate C; G5 exact24 target execution and production reflection still require a later separate Mash
approval.
