---
doc_id: piece_pce7_design_closure_checkpoint_20260808
title: "Piece PCE-7 test / monitoring / rollback design closure checkpoint"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
checkpoint_type: "PCE7_DESIGN_ONLY_CLOSURE"
baseline_cocolon_head: "cf14b503a4e5087b7ef33a82c8073a93517d5b60"
baseline_cocolon_tree: "4d64aba7bfe63aecf391a0ba3598589699cec6f1"
design_publication_commit: "cc2b43699e5ac3621e4bf6f0361a2e906c4e344f"
design_publication_tree: "cebc3ef84fcb5dd30e51ad33cfbe5266ee751f38"
pce7_complete: true
pce8_activated: false
analysis_roadmap_activated: false
automatic_progression: false
production_effect: "exact0"
---

# Piece PCE-7 test / monitoring / rollback design closure checkpoint

## 1. Closure result

Mashが承認した次のdesign-only作業を完了した。

```text
PCE7_TEST_MONITORING_ROLLBACK_DESIGN_ONLY
```

```text
PCE-0: COMPLETE
PCE-1: COMPLETE_DESIGN_ONLY
PCE-2: COMPLETE_DESIGN_ONLY
PCE-3: COMPLETE_DESIGN_ONLY
PCE-4: COMPLETE_DESIGN_ONLY
PCE-5: COMPLETE_DESIGN_ONLY
PCE-6: COMPLETE_DESIGN_ONLY
PCE-7: COMPLETE_DESIGN_ONLY

PCE-8:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

Analysis Pro-First roadmap:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

## 2. Fixed contracts

```text
RED catalog:
  piece.red_contract_catalog.v1

Test matrix:
  piece.test_matrix.v1

Monitoring privacy:
  piece.monitoring_privacy.v1

Feature flag / rollback:
  piece.feature_flag_rollback.v1
```

PCE-7はPCE-8／PCE-9実装が満たすevidence systemを固定した。test file、CI、monitoring runtime、feature flag、DB、API、RN、migration、actual-device、releaseは実装・実行していない。

## 3. RED contract

```text
required negative contracts:
  exact40

valid causal RED:
  collected
  call phase executed
  intended Piece invariant failure
  future GREEN owner exact1

noncredit:
  import failure
  collection failure
  fixture/environment/network/credential failure
  skip / xfail
  broad exception swallowing
  assertion weakening
```

exact40は次をrelease blockerとして固定する。

```text
source/body non-mixing
preview/save/export canonical equality
private/public/access/concealment
atomic quota/idempotency/concurrency/delete
visual version retention / no-invalid-layout / re-export
old Q&A residual exact0
legacy view/migration/destructive scope
monitoring body leak exact0
server-authoritative fail-closed rollback
```

PCE-7ではcausal REDを実際に作成・実行していない。

## 4. Test matrix

```text
suite classes:
  exact13
```

```text
P7-S01 pure contract/unit
P7-S02 API contract
P7-S03 actual DB transaction integration
P7-S04 actual DB RLS/access integration
P7-S05 migration verification
P7-S06 backend monitoring privacy
P7-S07 backend feature flag/rollback
P7-S08 RN source contract
P7-S09 RN state/component logic
P7-S10 renderer/layout logic
P7-S11 staging E2E
P7-S12 Mash actual-device
P7-S13 Work Ultra independent audit
```

重要境界:

- transaction、concurrency、RLSはactual isolated PostgreSQL／Supabase-compatible DBで確認する。mockやsource-string testだけでGREENにしない。
- RN source contractはwire、field、flag fallback、stable labelを確認できるが、native font、share sheet、permission、low-memoryは確認できない。
- actual-deviceはPCE-9E packet後のPCE-11でMashが確認する。
- independent cross-repository acceptanceはPCE-U1/U2のWork Ultra ownerであり、華恋単独の反復確認へ置換しない。

## 5. Monitoring privacy

Current generic monitoringはfree-form `message`、`error_message`、nested `meta`を受け、email／UUID／token-like patternをredactする。PCE-7はこれをPiece body送信の許可やprivacy proofとして採用しない。

```text
Piece monitoring schema:
  piece.ops_event.v1

mode:
  strict enum / numeric allowlist

Piece free-form message/error/meta:
  exact0

forbidden:
  raw input body
  Piece text/content payload
  supplemental answer body
  Emlis visible/internal body
  Analysis inference/simulation
  safety matched source/trace
  content/recipe hash values
  Piece/preview/source/user IDs
  idempotency values
  filename/path/recipient
  full exception/request/response body
```

Server terminal operationsがsave、quota、access、visibility、delete、hash、migration、rollback eventのauthorityを持つ。RNはUI-only body-free eventだけを送る。

Roadmap候補の`piece_record_published_public`は採用せず、次へ補正した。

```text
piece_record_saved_public
```

PCE-6でcanonical operationが`save`となり、visibilityとlifecycleを分離したためである。

```text
initial Piece event database:
  exact0

release operational target:
  body-free alert/search availability at least 14 days

actual deployed owner / retention / alert drill:
  PCE-12
```

現在の外部log retentionやalert設定が成立済みとは主張していない。

## 6. Feature flags and rollback

Exact Piece flags:

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

```text
flag count:
  exact8

missing / unknown:
  false

RN:
  presentation gate only
  explicit fallback false

backend:
  authoritative terminal enforcement

flag-triggered DDL / data deletion:
  exact0

old Q&A re-enable flag:
  exact0
```

Safe states:

```text
P7-FS0_PRELAUNCH_OFF
P7-FS1_OWNER_RECOVERY_ONLY
P7-FS2_PRIVATE_ONLY
P7-FS3_FULL
P7-FS4_READ_ONLY_OWNER
```

Rollback playbookはgeneration/content、privacy/access、quota/idempotency/storage、renderer/export、Nexus/public projection、migration/schema、old Q&A residualのexact7 incident classを固定した。

General rollbackでは、healthyなowner read/deleteを可能な範囲で保持する。privacy incidentではpublic write/read/visibilityを直ちに停止し、old Q&Aへfallbackしない。

## 7. Current actual basis

```text
Cocolon baseline head / tree:
  cf14b503a4e5087b7ef33a82c8073a93517d5b60
  4d64aba7bfe63aecf391a0ba3598589699cec6f1

mashos-api head / tree:
  315813c7bd3372462de926ddad74df567254a6b5
  a641510e107d52bb910073f36604c85bd57af150

roadmap SHA-256:
  2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939
```

Confirmed current actual:

```text
backend Piece tests:
  old Q&A response/safety/preview-publish hash contract

RN tests:
  Node source-contract suite requiring old preview/publish/cancel/Q&A card

RN monitoring:
  generic free-form payload + pattern redaction

backend client event:
  ops.client_event.v1
  response stored=false

backend observability:
  structured JSON log / alert marker / optional Slack helper

request performance:
  route/status/latency/Supabase/cache counters

bootstrap feature flags:
  static boolean map
  Piece flags absent

RN runtime flag helper:
  generic fallback defaults true when caller omits fallback

Piece-specific RED/test/monitoring/rollback implementation:
  exact0
```

## 8. Verified design artifacts

| path | remote UTF-8 bytes | Git blob SHA-1 |
|---|---:|---|
| `Cocolon_Piece/pce7_test_monitoring_rollback/Piece_RED_Contract_Catalog_20260808.md` | 12754 | `c42aff5a7f00a81fb09bef1455a10453efc80a0f` |
| `Cocolon_Piece/pce7_test_monitoring_rollback/Piece_Test_Matrix_20260808.md` | 14804 | `cac4ca213133b872867465445bcdc04ae48b9b48` |
| `Cocolon_Piece/pce7_test_monitoring_rollback/Piece_Monitoring_Privacy_Contract_20260808.md` | 13835 | `9076310d0f27266626685bd3feb814f9e745c4d4` |
| `Cocolon_Piece/pce7_test_monitoring_rollback/Piece_FeatureFlag_Rollback_Design_20260808.md` | 14285 | `b5b57df5b89fee3ea9f1950fb9cec4cf57f8676f` |
| `Cocolon_Piece/00_read_first.md` | verified | `555cf1480346c2bae5d6fb3a851ecad3d4cf0f1a` |
| `Cocolon_Piece/manifest.json` | verified | `a6af676ed0113d5b6b52b01b43b307cf2fbccdee` |
| `Cocolon_前提資料/15J_cocolon_piece_workstream_pce7_design_closure_20260808.md` | verified | `e82b0462deaef4bc169d85e79af122d3ffdede26` |

All four PCE-7 artifact paths were listed from the publication commit with expected size/blob identities. Entry、manifest、15J premise were fetched from the publication commit and matched canonical blobs.

## 9. Publication scope

```text
baseline:
  cf14b503a4e5087b7ef33a82c8073a93517d5b60

publication commit:
  cc2b43699e5ac3621e4bf6f0361a2e906c4e344f

publication tree:
  cebc3ef84fcb5dd30e51ad33cfbe5266ee751f38

publication commits:
  exact1

publication changed paths:
  exact7

new PCE-7 artifacts:
  exact4

entry / manifest / premise:
  exact3

scope outside Piece / Piece premise:
  exact0
```

Publication was a non-force fast-forward from the fresh baseline.

## 10. Manifest lineage

`Cocolon_Piece/manifest.json`はv10からcompact v11へ進んだ。PCE-0 through PCE-6の詳細identityはimmutable predecessor blob `9ebe1008086518cf0f1d393c8ba5ac51b46698ff`と各canonical phase artifactに保持される。

v11はcurrent PCE-7 contracts、artifact identities、actual basis、phase state、next action、technical effectsを保持する。これは過去成果の削除・再分類ではない。

## 11. Completed / not implemented

Completed:

- exact40 RED catalogとcausal RED条件。
- exact13 suite matrixとactual DB／device／independent review分離。
- strict monitoring allowlist、event catalog、alert/privacy test design。
- exact8 server-authoritative fail-closed flags。
- dependency lattice、exact5 safe states、incident rollback playbooks。
- owner recovery/delete境界、old Q&A non-restoration、body-free rollback evidence。
- current entry、manifest v11、15J premise更新。

Not implemented:

```text
Cocolon production source:
  exact0

mashos-api production source:
  exact0

DB / API / RN / migration / deletion:
  exact0

test files / CI / test execution:
  exact0

monitoring runtime / deployed alert:
  exact0

Piece feature flags / rollback runtime:
  exact0

actual device / independent audit / release:
  exact0
```

## 12. Facts / inference / Karen's opinion

### Confirmed facts

PCE-7 roadmap requirements、PCE-1 through PCE-6 contracts、current repository heads、old Q&A backend/RN tests、generic monitoring implementation/tests、bootstrap feature flag map、RN runtime context、publication scope、remote artifact identitiesを確認した。

### Inference / unconfirmed

Exact isolated DB test runner、RN component-test library、CI provider、external log platform/retention、deployment flag command/credential owner、production DB drift、actual-device behavior、independent audit resultは未確認である。PCE-7はこれらをimplementedまたはPASSと扱わない。

### Karen's opinion

PCE-7で最も重要な境界は、generic redactionをPiece privacy contractにしないことである。Piece callerがfree-form proseをmonitoringへ送れないschemaを持つ方が、送った後でredactする設計より安全である。

第二の重要境界はrollback方向である。clean cutover後は、unsafe capabilityを止めながらowner recoveryを保持するべきであり、PCE-1で廃止したold Q&A product contractを復活させるべきではない。

## 13. Next exact action

```text
PCE8_DESIGN_FREEZE_WORK_PACKAGE_SPLIT_DESIGN_ONLY

environment:
  CHAT_5_6_PRO_OK

state:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED
```

Analysis roadmap remains unactivated. Mash-side action required for PCE-7 closure is exact0.

## 14. Effects / closure

```text
Cocolon documentation / Piece premise:
  reflected

production source / DB / API / RN / migration / deletion:
  exact0

test / CI / runtime / actual device:
  exact0

monitoring / feature flag runtime:
  exact0

EmlisAI / Analysis technical state:
  exact0

release effect:
  exact0

automatic progression:
  false

PCE7_RED_CATALOG_FIXED
PCE7_REQUIRED_NEGATIVE_CONTRACTS_EXACT40
PCE7_TEST_MATRIX_FIXED
PCE7_SUITE_CLASSES_EXACT13
PCE7_MONITORING_PRIVACY_FIXED
PCE7_FEATURE_FLAGS_EXACT8
PCE7_SAFE_STATES_EXACT5
PCE7_OLD_QNA_ROLLBACK_EXACT0
PCE7_REMOTE_BLOBS_VERIFIED_EXACT7
PCE7_COMPLETE_DESIGN_ONLY
PCE8_NOT_ACTIVATED
ANALYSIS_ROADMAP_NOT_ACTIVATED
AUTOMATIC_PROGRESSION_FALSE
```
