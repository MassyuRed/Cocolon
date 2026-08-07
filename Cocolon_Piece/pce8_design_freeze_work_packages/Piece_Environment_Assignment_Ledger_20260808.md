---
doc_id: piece_environment_assignment_ledger_20260808
title: "Piece environment assignment ledger"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-8 Design Freeze / Work Package Split"
document_status: "PCE8_COMPLETE_DESIGN_ONLY"
contract_id: "piece.environment_assignment_ledger.v1"
design_freeze_contract_id: "piece.design_freeze.v1"
workpackage_index_contract_id: "piece.implementation_workpackage_index.v1"
source_cocolon_head: "5316c8b3a9eef2ae84f6340aab24ee7ec8e654f5"
source_cocolon_tree: "ae6964261649492e2186d1ee277956d9d5d12874"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
source_roadmap_sha256: "2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939"
automatic_progression: false
production_effect: "exact0"
---

# Piece environment assignment ledger

## 1. Purpose

This ledger assigns each frozen Piece work package to an honest execution/evidence environment. Environment assignment is part of the completion contract: a weaker environment may not be used to claim evidence that it cannot observe.

```text
contract:
  piece.environment_assignment_ledger.v1

standard Piece design/code environment:
  CHAT_5_6_PRO_OK

first Work Ultra gate:
  PCE-U1

actual-device owner:
  PCE-11 / Mash

additional credit purchase assumed:
  false

automatic progression:
  false
```

The roadmap's allocation remains intact: Work Ultra is reserved first for EmlisAI's current Work-required path, while bounded Piece design and implementation proceed in GPT-5.6 Pro. This does not lower Piece quality or convert Work/device requirements into Chat evidence.

## 2. Environment and evidence classes

### `CHAT_5_6_PRO_OK`

Use when one bounded owner can be implemented and verified through deterministic source, contract, unit or repository-local evidence.

Allowed examples:

```text
contract design
bounded Python/JS implementation
synthetic causal RED
targeted deterministic GREEN
hash/diff/path verification
documentation/checkpoint
read-only dependency preflight
```

This class does not prove live DB transaction semantics, native device behavior or independent multi-agent acceptance merely because the same work is reviewed repeatedly.

### `ISOLATED_DB_REQUIRED`

An evidence condition used with Chat implementation. The test target is a disposable PostgreSQL/Supabase-compatible database with actual transaction, constraint, grant and RLS semantics.

```text
production data/credential:
  prohibited

mock/in-memory substitute for transaction or RLS claim:
  prohibited

initial test-only locator:
  PIECE_V2_TEST_DATABASE_URL
```

The exact materialization method is frozen by B2-A preflight. Absence of a valid isolated database produces an environment STOP, not a Piece RED or GREEN.

### `STAGING_RUNTIME_REQUIRED`

An integrated non-production API/RN/database environment used for P7-S11 and B15. It verifies control/data flow but is not an independent audit, production release or actual-device replacement.

### `MASH_ACTUAL_DEVICE_REQUIRED`

Required where the evidence depends on real iOS/Android behavior:

```text
font/line break/glyph
share sheet
media permission
saved PNG quality
low-memory capture
screen-reader/touch behavior
```

Chat or Work prepares the bounded packet and analyzes results. Mash performs or supplies the actual-device observation in PCE-11.

### `WORK_ULTRA_REQUIRED`

Required when independent multiple review streams or indivisible cross-repository acceptance are themselves completion evidence.

```text
PCE-U1:
  independent cross-repository integration audit

PCE-U2:
  final independent release acceptance
```

Work availability alone does not activate either gate. EmlisAI current Work-required work retains priority, and Mash must explicitly allocate Work to Piece.

### `DEPLOYMENT_OWNER_REQUIRED`

Required for production runtime configuration, migration application, rollback command/credential ownership, external log retention/alert drill and destructive DB operations. These are not guessed from source and are not delegated to a public admin endpoint.

## 3. PCE-8 classification

```text
PCE8_DESIGN_FREEZE_WORK_PACKAGE_SPLIT_DESIGN_ONLY:
  CHAT_5_6_PRO_OK
  DOC_ONLY

GitHub documentation reflection:
  approved in current PCE-8 scope

production source/DB/API/RN/test/runtime effect:
  exact0
```

No Ultra, device, isolated DB, deployment credential or additional credit is required to complete PCE-8 design-only.

## 4. B1–B15 assignment

| Group/unit | Primary environment | Additional evidence condition | Completion boundary |
|---|---|---|---|
| `B1-R` contract RED | `CHAT_5_6_PRO_OK` | none | call-phase synthetic invariant RED |
| `B1-I` contract owner | `CHAT_5_6_PRO_OK` | none | deterministic unit GREEN |
| `B2-A` M0/M1 | `CHAT_5_6_PRO_OK` | `ISOLATED_DB_REQUIRED` for migration GREEN | migration files + actual bridge/caller proof; production apply exact0 |
| `B2-B` M2 foundation | `CHAT_5_6_PRO_OK` | `ISOLATED_DB_REQUIRED` | actual constraints/indexes/RLS/grants |
| `B3` access/RLS | `CHAT_5_6_PRO_OK` | `ISOLATED_DB_REQUIRED` | actual identity/object matrix |
| `B4` quota/atomic RPC | `CHAT_5_6_PRO_OK` | `ISOLATED_DB_REQUIRED` | actual transaction/fault/concurrency matrix |
| `B8` generation/content | `CHAT_5_6_PRO_OK` | none | deterministic source/meaning/safety tests |
| `B9` visual/layout logic | `CHAT_5_6_PRO_OK` | device rows deferred | deterministic recipe/fit/version GREEN |
| `B14-A` backend flags/monitoring | `CHAT_5_6_PRO_OK` | deployed drill deferred to PCE-12 | strict allowlist + fail-closed backend tests |
| `B5-A` source adapter | `CHAT_5_6_PRO_OK` | current source-owner binding `PCE8-U01` | exact body-free adapter GREEN |
| `B5-B` preview API | `CHAT_5_6_PRO_OK` | isolated DB where store behavior is observed | unregistered dedicated test app GREEN |
| `B6` save API | `CHAT_5_6_PRO_OK` | `ISOLATED_DB_REQUIRED` | API + atomic terminal GREEN |
| `B7` owner API | `CHAT_5_6_PRO_OK` | `ISOLATED_DB_REQUIRED` | owner/access/conflict/delete GREEN |
| `B14-B` RN flags/monitoring | `CHAT_5_6_PRO_OK` | none | Node source/state tests, false fallback exact |
| `B10` RN CTA/preview | `CHAT_5_6_PRO_OK` | native behavior not claimed | Node source + pure state-model GREEN |
| `B11` RN owner history | `CHAT_5_6_PRO_OK` | native behavior not claimed | Node source + pure state-model GREEN |
| `B13-A` export preflight | `CHAT_5_6_PRO_OK` | primary package sources/web verification | exact dependency/owner decision; no install |
| `B13-B` export receipt | `CHAT_5_6_PRO_OK` | isolated DB if receipt persistence observed | body-free API/store GREEN |
| `B13-C` RN export prototype | `CHAT_5_6_PRO_OK` | `MASH_ACTUAL_DEVICE_REQUIRED` later | code-side renderer GREEN + device packet only |
| `B12-A` backend Nexus v2 | `CHAT_5_6_PRO_OK` | `ISOLATED_DB_REQUIRED` | access/projection/API GREEN; unregistered |
| `B12-B` RN Nexus v2 | `CHAT_5_6_PRO_OK` | native behavior not claimed | new payload/card source/state GREEN |
| `B12-C` M5 cutover/M6 tool | `CHAT_5_6_PRO_OK` | `ISOLATED_DB_REQUIRED` + `STAGING_RUNTIME_REQUIRED` | split backend/RN writes + staging proof; M7 exact0 |
| `B15` staging E2E | `CHAT_5_6_PRO_OK` | `STAGING_RUNTIME_REQUIRED` | S01–S11 integrated evidence; code changes default exact0 |

The table assigns code ownership to Chat while preserving stronger evidence conditions. For example, B4 code may be written in Chat, but its transaction/concurrency completion cannot be claimed without an actual isolated database.

## 5. Migration and destructive-operation assignment

| Migration phase | Environment | Effect in ordinary implementation packet |
|---|---|---|
| `M0` tracked baseline | Chat | repository docs/manifest only |
| `M1` legacy bridge/rebind | Chat + isolated DB | SQL/file/test evidence; production apply separately controlled |
| `M2` foundation | Chat + isolated DB | SQL/file/test evidence; production apply separately controlled |
| `M3` RLS/RPC/staging | Chat + isolated DB | SQL/file/test evidence; production apply separately controlled |
| `M4` disabled integration | Chat + staging | effective flags false; no user-visible dual-run |
| `M5` clean cutover | Chat design/code + isolated/staging evidence + deployment owner | coordinated release packet, separate approval |
| `M6` body-free identity capture | Chat tool + approved environment | read-only/frozen identity evidence |
| `M7` destructive cleanup | `DEPLOYMENT_OWNER_REQUIRED` | separate Mash approval, exact frozen IDs only |
| `M8` obsolete retirement | Chat bounded code after verified M7 | separate approval and fresh consumer exact0 |

M7 is never activated by B1–B15 completion, PCE-U1 PASS or this ledger.

## 6. Actual-device assignment

### PCE-9E/B13 responsibility

```text
create device packet
provide exact test build/route/input cases
freeze expected code-side identities
record what cannot be observed in code
```

### Mash/PCE-11 responsibility

```text
run/observe iOS and Android rows available to Mash
record visible result and reproduction steps
avoid exposing private production content
return bounded evidence to Karen
```

### Karen responsibility after receipt

```text
separate fact from interpretation
compare against PCE-5/PCE-7 acceptance
localize blocker to owner/package
perform separately approved correction
never translate missing device evidence into PASS
```

PCE-8 does not request device work now.

## 7. Work Ultra assignment

### PCE-U1

```text
environment:
  WORK_ULTRA_REQUIRED

proposed independent streams:
  A backend storage/migration/quota/rollback
  B access/feed/privacy/delete
  C RN/owner/Nexus/export/accessibility/tier
  D Emlis-Piece-Analysis lineage/non-mixing/integration
```

Entry requires B1–B15 staging evidence. Same-Karen repeated review cannot replace the independent-stream condition.

### PCE-U2

```text
environment:
  WORK_ULTRA_REQUIRED

entry:
  corrected release candidate
  PCE-11 actual-device evidence
  monitoring/rollback evidence
  separate Mash allocation
```

U2 PASS does not itself authorize production deploy or store submission.

### Work priority

```text
EmlisAI current executable Work-required task
  > Piece PCE-U1 / PCE-U2
```

If Work is unavailable or still allocated to EmlisAI, Piece Ultra gates remain queued. Additional credit purchase is not presumed.

## 8. External/runtime condition ownership

| Condition | Environment owner | Blocks |
|---|---|---|
| `PCE8-U01` exact source binding | current GitHub source + Chat adapter work | B5-A/B10 connection only |
| `PCE8-U02` capture/media dependency | Chat primary-source preflight | B13-C dependency install |
| `PCE8-U03` isolated PostgreSQL runner | test/runtime environment | B2-B/B3/B4 and DB-dependent GREEN |
| `PCE8-U04` production flag command/credential | deployment owner / PCE-12 | rollout/drill, not design/code |
| `PCE8-U05` log retention/alert owner | deployment owner / PCE-12 | release operations acceptance |
| `PCE8-U06` device/independent evidence | Mash / Work Ultra | PCE-11/U1/U2 acceptance |

No missing external condition authorizes substitute paperwork or a weaker claim. Work proceeds only on independent packets not blocked by that condition.

## 9. Test/runtime continuity

When a packet uses Work Python/pytest or an isolated DB runner, it must obey the current Cocolon runtime continuity rules before execution.

```text
runtime identity/materialization:
  pinned before launch

collection/import/environment failure:
  Piece RED credit exact0

retry/interpreter/path substitution:
  only under the packet's explicit runtime contract

body-free result:
  required
```

PCE-8 does not select or launch a runtime.

## 10. GitHub write unit rules

```text
one repository per write unit
exact paths and preimages
no unrelated staging
non-force fast-forward
fresh remote bytes/diff/head verification
durable result before session loss
```

A B-group spanning both repositories is executed as two or more separately approved write units. Dependency ordering is preserved through pinned published commits, not through an uncommitted cross-repository workspace.

## 11. Environment reclassification rule

A future packet may move from Chat to Work only when a newly discovered completion condition honestly requires:

```text
independent multiple review streams
indivisible cross-repository atomic evidence
Work-specific runtime/filesystem/tooling
```

It may not move because the packet is merely long or inconvenient. Conversely, a Work/device/DB condition may not be downgraded because the stronger environment is unavailable.

Required reclassification record:

```text
prior environment
new environment
new fact/condition
why bounded Chat is insufficient
what evidence the new environment adds
scope and cost boundary
Mash approval state
```

## 12. STOP conditions

- GPT-5.6 Pro identity is unavailable for Chat Cocolon work.
- A DB transaction/RLS claim is attempted without an actual isolated DB.
- Production data, tokens or private bodies are needed for a test.
- A native/device row is claimed through static code review.
- Independent acceptance is replaced by single-agent repetition.
- Work is allocated to Piece while a higher-priority executable Emlis Work task exists without Mash reallocation.
- A deployment command/credential is guessed.
- M7 is started without its separate approval and frozen M6 packet.
- One write unit requires simultaneous unreviewed changes to both repositories.
- Environment unavailability is used to weaken product or evidence contracts.

## 13. Next exact inactive packet

```text
PCE9A_B01_CONTRACT_VERSION_CAUSAL_RED_FREEZE_ONLY

environment:
  CHAT_5_6_PRO_OK

classification:
  TEST_ONLY_RED

repository:
  MassyuRed/mashos-api

production source / DB / runtime effect:
  exact0

state:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

## 14. Completion

```text
PIECE_ENVIRONMENT_ASSIGNMENT_LEDGER_V1_FIXED
PCE8_CHAT_5_6_PRO_OK_FIXED
B1_B15_ENVIRONMENT_EVIDENCE_ASSIGNMENT_FIXED
ISOLATED_DB_REQUIRED_BOUNDARY_FIXED
MASH_ACTUAL_DEVICE_OWNER_FIXED
PCE_U1_U2_WORK_ULTRA_FIXED
EMLIS_WORK_PRIORITY_PRESERVED
DEPLOYMENT_OWNER_BOUNDARY_FIXED
ADDITIONAL_CREDIT_NOT_ASSUMED
ENVIRONMENT_DOWNGRADE_PROHIBITED
NEXT_B01_RED_CHAT_PRO_FIXED
PRODUCTION_EFFECT_EXACT0
AUTOMATIC_PROGRESSION_FALSE
PCE8_COMPLETE_DESIGN_ONLY
```
