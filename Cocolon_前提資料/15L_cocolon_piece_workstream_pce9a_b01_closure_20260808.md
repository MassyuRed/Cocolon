---
doc_id: cocolon_piece_workstream_pce9a_b01_closure_20260808
title: "Cocolon Piece Workstream — PCE-9A B01 contract owner closure"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-9A Backend New Piece Contract / B01"
sync_authority: "PCE9A_B01_COCOLON_WORKSTREAM_STATE_SYNC_DOC_ONLY"
sync_classification: "DOC_ONLY"
cocolon_baseline_head: "4979d8cf3590ec4e4a34db73dc583a953c89bf4e"
cocolon_baseline_tree: "315d0984c453d428348e33494c487341eba00285"
mashos_api_b01_red_commit: "522af8cb66fb8e4d8e1b4b2d6cc82cf10545ce56"
mashos_api_b01_implementation_commit: "7a10fc593b123cb9d9b02147c4b345894dba0c0b"
pce9a_b01_complete: true
b02a_activated: false
automatic_progression: false
production_connection_effect: "exact0"
---

# Cocolon Piece Workstream — PCE-9A B01 contract owner closure

## 1. Current state

```text
PCE-0: COMPLETE
PCE-1: COMPLETE_DESIGN_ONLY
PCE-2: COMPLETE_DESIGN_ONLY
PCE-3: COMPLETE_DESIGN_ONLY
PCE-4: COMPLETE_DESIGN_ONLY
PCE-5: COMPLETE_DESIGN_ONLY
PCE-6: COMPLETE_DESIGN_ONLY
PCE-7: COMPLETE_DESIGN_ONLY
PCE-8: COMPLETE_DESIGN_ONLY

PCE-9A B01-R:
  COMPLETE_TEST_ONLY_CAUSAL_RED

PCE-9A B01-I:
  COMPLETE_CODE_DISABLED_TARGETED_GREEN

PCE-9A B02-A:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

Analysis Pro-First roadmap:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

PCE-9A B01は、Piece v2の最下層となるpure contract ownerを、既存Q&A route、DB、migration、RN、runtimeへ接続せずに追加したbounded implementationである。

## 2. Current sync authority and scope

Mashが承認したcurrent作業は次である。

```text
PCE9A_B01_COCOLON_WORKSTREAM_STATE_SYNC_DOC_ONLY
```

Allowed Cocolon paths:

```text
modify:
  Cocolon_Piece/00_read_first.md
  Cocolon_Piece/manifest.json

create:
  Cocolon_前提資料/15L_cocolon_piece_workstream_pce9a_b01_closure_20260808.md
```

This sync records the already-completed mashos-api B01-R and B01-I results. It does not modify mashos-api, rerun tests, register routes, apply SQL, activate B2-A or change product behavior.

## 3. B01-R causal RED record

```text
repository:
  MassyuRed/mashos-api

baseline before B01-R:
  315813c7bd3372462de926ddad74df567254a6b5

commit:
  522af8cb66fb8e4d8e1b4b2d6cc82cf10545ce56

tree:
  37fe412c1f7b342cd521e88fc3b010bbccafa2ae

commit message:
  test(piece-v2): freeze B01 contract causal RED

changed paths:
  exact1

path:
  ai/tests/piece_v2/test_b01_piece_v2_contract_red.py

Git blob SHA-1:
  00bf4dea9a2321c59265d2bbb211ae5b13b97cde

classification:
  TEST_ONLY_RED

production source / DB / API / RN / runtime effect:
  exact0
```

### Causal signature

```text
PCE9A_B01_PIECE_V2_CONTRACT_OWNER_IMPLEMENTATION_ABSENT_RED
```

The RED loads the future owner inside the test call. Owner absence therefore yields a collected call-phase failure rather than an import/collection failure.

```text
owner import/load failure signature:
  PCE9A_B01_OWNER_IMPORT_OR_LOAD_FAILURE_NONCREDIT

collection/import/fixture/environment/network/credential failure:
  RED credit exact0
```

### Covered release-blocking contracts

```text
PCE7-R008:
  content payload reconstruction / piece_text / piece_text_hash exact binding

PCE7-R013:
  missing visibility -> private
  unknown or present-invalid visibility -> reject

PCE7-R027:
  required contract/version identities present and exact

PCE7-R037:
  public projection and Piece monitoring reject body-bearing/raw identity fields
```

## 4. B01-I implementation and targeted GREEN record

```text
repository:
  MassyuRed/mashos-api

parent:
  522af8cb66fb8e4d8e1b4b2d6cc82cf10545ce56

commit:
  7a10fc593b123cb9d9b02147c4b345894dba0c0b

tree:
  842715d588c0573f0de5411dae62b8b8bb22f3a4

commit message:
  feat(piece-v2): implement B01 contract owner

changed paths:
  exact1

path:
  ai/services/ai_inference/piece_v2_contract.py

Git blob SHA-1:
  e4d20c9d0994b0a05f086ff6543de9d5cf2f31aa

classification:
  CODE_DISABLED

existing RED test modification:
  exact0
```

### Implemented B01 responsibilities

```text
PieceContractError:
  stable body-free error code owner

PIECE_V2_CONTRACT_VERSIONS:
  exact immutable Piece v2 version registry

canonical_json_bytes / canonical_sha256_hex:
  UTF-8 compact sorted-key JSON
  trailing LF exact0
  SHA-256 lowercase hex

reconstruct_piece_text:
  quote / short_essay / declaration reconstruction contract

validate_piece_text_binding:
  reconstructed text / flat text / hash exact binding

normalize_visibility_scope:
  absent -> private
  private/public only
  unknown/present-invalid reject

project_public_piece:
  exact public field allowlist

serialize_piece_ops_event:
  exact Piece monitoring allowlist
  unknown/free-form/body/raw ID fields reject
```

### Targeted GREEN result

The completed B01-I authority recorded the following packet-scoped result.

```text
collected:
  exact1

passed:
  exact1

failed:
  exact0

error:
  exact0

skipped:
  exact0

xfail:
  exact0

terminal:
  1 passed
```

This DOC_ONLY state sync did not rerun pytest. It records the completed B01-I execution result and freshly verifies the published test/owner commit and blob identities.

The result is B01 targeted GREEN only. It is not full mashos-api regression, DB integration, API integration, PCE-9A completion, PCE-U1 acceptance or release proof.

## 5. Contract-version registry fixed by B01

```text
piece.api.v2
piece.content_meaning.v1
piece.content_payload.v1
piece.data_contract.v1
piece.export_contract.v1
piece.format_owner.v1
piece.long_text_layout.v1
piece.record_lifecycle.v1
piece.record.v2
piece.quota_consumption.v1
piece.render_interface.v1
piece.render_reproducibility.v1
piece.public_safety_transformation.v1
piece.source_lineage.v1
piece.visibility_access.v1
piece.visual_catalog.v1
piece.visual_recipe.v1
```

Missing, wrong or extra version identity fails with `PIECE_REQUEST_INVALID`.

## 6. Public and monitoring privacy boundary

### Public Piece projection

```text
allowed exact11:
  format_type
  metrics
  owner_profile
  piece_id
  piece_text
  piece_text_hash
  public_id
  saved_at
  viewer_state
  visual_recipe
  visual_recipe_hash
```

Raw input, source identity, owner internal identity, content payload and safety trace are not projected merely because they exist in the source mapping.

### Piece operations event

The serializer accepts only the PCE-7 enum/numeric allowlist. It rejects, among others:

```text
raw_input
piece_text
content_payload
Emlis body
Analysis inference
piece/content/recipe hash values
Piece/preview/source/owner IDs
idempotency key
message
error_message
meta
request/response body
filename/path/recipient
```

This is an input-schema prohibition, not a promise to redact arbitrary prose after receipt.

## 7. Production connection boundary

```text
pure owner importability:
  present

API route registration:
  exact0

app.py registration:
  exact0

service/store caller:
  exact0

DB / SQL / migration / RLS / grants:
  exact0

RN connection:
  exact0

feature flag runtime:
  exact0

monitoring emission:
  exact0

production deployment:
  exact0

old Q&A reachability:
  unchanged
```

`piece_v2_contract.py` being located under the production source tree does not mean the new Piece flow is active. It is a code-disabled pure dependency for future bounded owners.

## 8. Repository identities at sync start

```text
Cocolon head / tree before this DOC_ONLY sync:
  4979d8cf3590ec4e4a34db73dc583a953c89bf4e
  315d0984c453d428348e33494c487341eba00285

mashos-api current head / tree:
  7a10fc593b123cb9d9b02147c4b345894dba0c0b
  842715d588c0573f0de5411dae62b8b8bb22f3a4
```

The B01 commits form one direct chain:

```text
315813c7... baseline
  -> 522af8cb... B01-R
  -> 7a10fc59... B01-I
```

## 9. Facts, unconfirmed items and Karen's opinion

### Confirmed facts

- Cocolon current routing still pointed to PCE-8 before this sync.
- mashos-api current main contains B01-R and B01-I as two direct commits.
- B01-R changed only the exact new test path.
- B01-I changed only the exact new pure contract owner path.
- RED test blob remains unchanged after B01-I.
- owner is not registered into API, DB, RN or runtime.

### Unconfirmed / not executed in this sync

```text
full mashos-api pytest regression:
  not run

GitHub Actions:
  no PASS claimed

actual PostgreSQL / Supabase-compatible DB:
  not materialized

B2-A migration preflight / causal RED:
  not run

production database catalog drift:
  unconfirmed after PCE-0 observation

production deployment:
  not run
```

### Karen's opinion

B01をpure contract ownerとして最初に閉じたことは妥当である。version、canonical serialization、visibility default、text/hash binding、public/monitoring allowlistをDB/APIごとに重複実装すると、同じPieceに複数の基礎契約が生まれる。

同時に、B01 targeted GREENを理由に次のmigration packetを自動実行してはいけない。B2-Aはmigration owner、legacy read bridge、current exact caller、actual isolated DBという別の証拠境界を持つため、別承認と別lifecycleが必要である。

## 10. Next frozen group

```text
group:
  B2-A

name:
  M0 Tracked Migration Baseline
  + M1 Legacy Read Bridge / Current Caller Rebind

environment:
  CHAT_5_6_PRO_OK
  ISOLATED_DB_REQUIRED for migration GREEN

state:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

B2-A must begin with a separately bounded preflight/causal RED unit. It must freshly search every `COCOLON_PIECES_READ_TABLE` consumer and stop if the exact path scope has drifted. Production migration application remains exact0 unless separately approved.

## 11. Effects of this state sync

```text
Cocolon documentation paths changed:
  exact3

Cocolon production source:
  exact0

mashos-api change in this sync:
  exact0

DB / API / RN / migration / deletion:
  exact0

test execution in this sync:
  exact0

EmlisAI / Analysis technical state:
  exact0

release effect:
  exact0

automatic progression:
  false
```

## 12. Completion

```text
PCE9A_B01_RED_COMMIT_RECORDED
PCE9A_B01_RED_TEST_BLOB_RECORDED
PCE9A_B01_CAUSAL_SIGNATURE_RECORDED
PCE9A_B01_IMPLEMENTATION_COMMIT_RECORDED
PCE9A_B01_OWNER_BLOB_RECORDED
PCE9A_B01_TARGETED_GREEN_RECORDED
PCE9A_B01_EXISTING_RED_MODIFICATION_EXACT0
PCE9A_B01_CODE_DISABLED
PCE9A_B01_PRODUCTION_CONNECTION_EXACT0
PCE9A_B01_COMPLETE
PCE9A_B02A_NOT_ACTIVATED
ANALYSIS_ROADMAP_NOT_ACTIVATED
AUTOMATIC_PROGRESSION_FALSE
```
