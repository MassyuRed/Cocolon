---
doc_id: piece_feature_flag_rollback_design_20260808
title: "Piece feature flag and rollback design"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-7 Test / Monitoring / Rollback"
document_status: "PCE7_COMPLETE_DESIGN_ONLY"
contract_id: "piece.feature_flag_rollback.v1"
source_cocolon_head: "cf14b503a4e5087b7ef33a82c8073a93517d5b60"
source_cocolon_tree: "4d64aba7bfe63aecf391a0ba3598589699cec6f1"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
automatic_progression: false
production_effect: "exact0"
---

# Piece feature flag and rollback design

## 1. Purpose

Piece rollback must stop unsafe new behavior without deleting records, exposing private data or restoring the old Q&A product path.

```text
contract:
  piece.feature_flag_rollback.v1

rollback target:
  new Piece safe-disabled state

old Q&A restoration:
  exact0

flag-triggered data deletion/migration:
  exact0

PCE-7 runtime implementation:
  exact0
```

## 2. Confirmed current actual

Current backend `/app/bootstrap` returns a boolean `feature_flags` map. Current RN `AppRuntimeContext` merges server flags over local defaults and exposes `isFeatureEnabled(name, fallback = true)`. Bootstrap is loaded at app startup and a fetch failure preserves the current/default runtime state.

These facilities can distribute Piece UI state, but the present generic fallback is not a safe authorization boundary. Piece flags therefore require explicit false defaults and independent backend enforcement on every affected operation.

## 3. Exact Piece flags

```text
piece_v2_preview_enabled
piece_v2_save_enabled
piece_v2_owner_read_enabled
piece_v2_public_write_enabled
piece_v2_public_read_enabled
piece_v2_visibility_toggle_enabled
piece_v2_export_enabled
piece_v2_delete_enabled
```

### Ownership

```text
single authoritative resolver:
  backend Piece runtime control owner

/app/bootstrap:
  read-only RN projection of the same resolved state

RN:
  presentation gate only

API/service/store:
  terminal enforcement owner
```

No service parses duplicate environment variables independently. PCE-8 freezes the exact owner file and environment/config keys.

## 4. Fail-closed rules

```text
missing Piece flag:
  false

unknown Piece flag value:
  false

bootstrap unavailable:
  Piece controls hidden/disabled

RN call site:
  isFeatureEnabled(name, false)

stale RN true state:
  backend still denies when server flag false

feature-disabled API:
  stable PIECE_FEATURE_DISABLED response
```

The current `fallback=true` helper behavior may remain for unrelated existing features, but every Piece call must explicitly use false. PCE-9D static contracts verify this.

## 5. Flag semantics

| Flag | Gates | Does not gate |
|---|---|---|
| `piece_v2_preview_enabled` | source resolution, generation, preview creation/mutation | existing saved-record read/delete |
| `piece_v2_save_enabled` | atomic first save and quota consumption | preview cancel, owner read/delete |
| `piece_v2_owner_read_enabled` | owner history/detail and record fetch for approved owner actions | public feed |
| `piece_v2_public_write_enabled` | save-as-public and private→public | private save, owner read/delete |
| `piece_v2_public_read_enabled` | Nexus list/detail/read/resonance for new Piece | owner history |
| `piece_v2_visibility_toggle_enabled` | owner visibility mutations | reading current visibility |
| `piece_v2_export_enabled` | RN-first export/share/re-export | record save/read/delete |
| `piece_v2_delete_enabled` | owner physical delete terminal operation | background destructive cleanup M7 |

`piece_v2_delete_enabled` is not the M7 old-Q&A cleanup authority. M7 remains a separate destructive migration approval.

## 6. Dependency lattice

```text
preview:
  requires migration M2/M3 ready

save:
  requires preview + atomic RPC + quota + monitoring ready

owner read:
  requires safe owner API and record projection

public write:
  requires save + public read + access/RLS GREEN

public read:
  requires new Nexus projection/card + private concealment GREEN

visibility toggle:
  requires owner read + public read + version conflict handling

export:
  requires owner read + immutable catalog + renderer/layout GREEN

delete:
  requires owner read + atomic delete/purge + receipt GREEN
```

A dependent flag cannot resolve true when a prerequisite resolves false. The backend resolver computes the effective state and exposes both requested/effective state only to bounded operational diagnostics; RN receives effective booleans only.

## 7. Safe states

### `P7-FS0_PRELAUNCH_OFF`

```text
all Piece v2 flags false
new Piece user-visible path absent
old Q&A remains current only before M5
```

This is staging/prelaunch, not rollback after clean cutover.

### `P7-FS1_OWNER_RECOVERY_ONLY`

```text
preview false
save false
owner read true
delete true
public write false
public read false
visibility toggle false
export false
```

Used for severe public/privacy or write-path incidents. Existing owners can inspect and delete their records through the safe owner path.

### `P7-FS2_PRIVATE_ONLY`

```text
preview true
save true
owner read true
delete true
public write false
public read false
visibility toggle false or private-target-only
export independently controlled
```

New saves are private only. Public selection is absent. This state is allowed only after private save/access/quota suites are GREEN.

### `P7-FS3_FULL`

```text
all approved flags true
```

This is the release candidate state, not a default.

### `P7-FS4_READ_ONLY_OWNER`

```text
preview false
save false
owner read true
delete conditionally true
all public mutation false
public read based on incident class
export false
```

Used for quota/storage/migration incidents where record reads are trustworthy but new writes are not.

## 8. Rollout sequence

### M4 disabled integration

```text
all public effective flags false
internal staging identity/allowlist may exercise backend in non-production only
```

An internal test mechanism is not exposed through `/app/bootstrap` and does not create product dual-run.

### M5 clean cutover

One coordinated packet:

1. verify migration/access/quota/monitoring/rollback prerequisites;
2. enable owner read/delete support;
3. make old Q&A entry/generation/card/routes release-unreachable;
4. enable preview and save;
5. enable public write/read and visibility only after private/public GREEN;
6. enable export only after renderer code-side GREEN;
7. verify effective flags and body-free monitoring;
8. leave destructive old-data cleanup disabled.

Old Q&A and Piece v2 are not both user-visible. A flag does not re-enable old Q&A after step 3.

## 9. Server-side gate order

Every gated operation checks:

```text
1. authentication
2. feature effective state
3. request schema
4. owner/source/access decision
5. lifecycle/version/hash/idempotency
6. terminal DB operation
```

For concealed public records, feature/access ordering must not create an existence oracle. Public endpoints return the same not-found-equivalent where PCE-3/PCE-6 require concealment.

A flag change between preview and save may make save unavailable. The preview remains unconsumed and eventually expires; the server does not silently save or route to old Q&A.

## 10. Rollback playbooks

### A. Generation/content incident

```text
set preview false
set save false
preserve owner read/delete
preserve public read only if saved records are trustworthy
old Q&A remains unreachable
```

Verify no new preview/save rows and no quota events after cutoff.

### B. Privacy/access incident

```text
set public write false
set public read false
set visibility toggle false
set preview/save false unless private-only safety is independently proven
preserve owner read/delete through safe owner path
invalidate public caches/projections
```

Any private exposure is a critical incident. Rollout does not resume until access/RLS/visibility suites and incident-specific proof are GREEN.

### C. Quota/idempotency/storage-write incident

```text
set save false
set preview false or leave preview-only if no durable draft risk
set public write false
preserve owner read/delete
public read may remain only if record integrity is proven
```

Verify record and quota deltas exact0 after cutoff and reconcile body-free terminal identities.

### D. Renderer/export incident

```text
set export false
leave record/visibility/public paths unchanged if independently healthy
```

No backend renderer fallback and no latest-template substitution are activated.

### E. Nexus/public projection incident

```text
set public read false
set public write false
set visibility toggle false
allow private save only if safe
preserve owner read/delete
```

Public routes conceal rather than serve stale broad data.

### F. Migration/schema incident

```text
all new writes false
public read false unless exact schema/projection is verified
owner recovery only if exact safe projection remains
no automatic down migration
no old Q&A restoration
```

Migration repair requires a separate bounded authority and current catalog identity.

### G. Old Q&A residual after M5

```text
stop rollout
keep old route/card/entry disabled
optionally disable new writes if contract ambiguity exists
remove residual through bounded correction
never use residual as fallback
```

## 11. Delete availability boundary

Owner delete is a privacy/recovery function, so general Piece rollback should preserve it when the atomic delete path is healthy.

```text
general generation/export/public incident:
  delete remains true

delete-path integrity incident:
  delete false
  owner read remains if safe
  user-facing temporary-unavailable response
  repair prioritized
```

Disabling delete does not authorize retention beyond the current data contract. PCE-12 support text must explain temporary unavailability without exposing internals.

## 12. Bootstrap freshness and stale clients

Backend flags are authoritative immediately. RN bootstrap state is advisory presentation.

Required client behavior:

```text
initial Piece flags:
  false

app foreground / authenticated session refresh:
  refresh bootstrap before exposing newly enabled Piece actions

backend PIECE_FEATURE_DISABLED:
  close/disable affected action
  refresh bootstrap
  preserve unsaved local UI state only when privacy-safe
```

A stale installed build may show an obsolete control briefly, but cannot execute a disabled server operation. The control never falls back to old Q&A.

## 13. Rollback evidence

Each rollback/drill records a body-free packet:

```text
rollback_id
reason_code
from_safe_state / to_safe_state
requested/effective flag snapshot
activated_at
repository/deployment identity
last allowed write time
post-cutoff record/quota deltas
public access probe result
owner read/delete probe result
old Q&A reachability result
monitoring/alert result
terminal verdict
```

Forbidden: Piece text, raw input, Emlis/Analysis body, exact record/source IDs, idempotency keys, token or full exception message.

## 14. Rollback success criteria

```text
new disallowed API success after cutoff:
  exact0

new record/quota effects after write cutoff:
  exact0

public visibility in privacy state:
  exact0

old Q&A route/card/entry reachable after M5:
  exact0

owner recovery behavior:
  matches selected safe state

flag-induced data deletion/migration:
  exact0

critical monitoring event delivered:
  true or explicit monitoring failure blocker
```

A bootstrap boolean screenshot is not rollback proof. Server probes and state deltas are required.

## 15. Flag administration boundary

PCE-7 does not create an admin console or public flag mutation endpoint.

```text
flag change owner:
  bounded deployment/runtime configuration

public API to mutate flags:
  exact0

RN local override in release build:
  exact0

flag change audit:
  body-free operational record required before release
```

Exact deployment commands, credential owner and approval flow are external/runtime details that PCE-12 must pin and drill. They are not inferred from source.

## 16. Negative contract

| ID | Prohibited state |
|---|---|
| `PCE7-F001` | missing Piece flag resolves true |
| `PCE7-F002` | RN flag is the only enforcement |
| `PCE7-F003` | different services parse conflicting flag sources |
| `PCE7-F004` | public write true while public read/access is unsafe |
| `PCE7-F005` | save true without quota/atomic RPC |
| `PCE7-F006` | general rollback disables healthy owner delete unnecessarily |
| `PCE7-F007` | flag change deletes/migrates data |
| `PCE7-F008` | rollback re-enables old Q&A |
| `PCE7-F009` | stale RN bypasses disabled backend |
| `PCE7-F010` | safe state exposes private records |
| `PCE7-F011` | internal staging allowlist becomes product coexistence |
| `PCE7-F012` | rollback packet stores body/IDs/secrets |

## 17. Current actual gap

```text
current /app/bootstrap boolean map:
  present

current RN runtime context:
  present

current Piece-specific flags:
  absent

current Piece flags default false:
  absent

current backend Piece gate resolver:
  absent

current rollback safe-state/drill:
  absent

PCE-7 flag implementation/execution:
  exact0
```

## 18. STOP conditions

- Safe disable requires restoring old Q&A.
- Backend cannot enforce a flag independently from RN.
- Public and private paths cannot be disabled separately during a privacy incident.
- A flag operation itself performs DDL or data deletion.
- Owner delete cannot remain available without exposing private/public data and no explicit incident state is defined.
- Exact deployment flag owner/command is required now but unavailable; design remains complete while PCE-12 deployment drill is blocked, not guessed.

## 19. Completion

```text
PIECE_FEATURE_FLAG_ROLLBACK_V1_FIXED
PIECE_FLAGS_EXACT8
MISSING_UNKNOWN_FAIL_CLOSED
BACKEND_AUTHORITATIVE_GATE_FIXED
DEPENDENCY_LATTICE_FIXED
SAFE_STATES_EXACT5
ROLLBACK_PLAYBOOKS_A_G_FIXED
OWNER_DELETE_RECOVERY_BOUNDARY_FIXED
OLD_QNA_ROLLBACK_EXACT0
FLAG_DATA_EFFECT_EXACT0
BODY_FREE_ROLLBACK_EVIDENCE_FIXED
FLAG_IMPLEMENTATION_EXACT0
PRODUCTION_EFFECT_EXACT0
PCE7_COMPLETE_DESIGN_ONLY
```
