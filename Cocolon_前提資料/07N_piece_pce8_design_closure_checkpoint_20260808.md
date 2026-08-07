---
doc_id: piece_pce8_design_closure_checkpoint_20260808
title: "Piece PCE-8 design freeze / work-package split closure checkpoint"
created_at: "2026-08-08 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
checkpoint_type: "PCE8_DESIGN_ONLY_CLOSURE"
baseline_cocolon_head: "5316c8b3a9eef2ae84f6340aab24ee7ec8e654f5"
baseline_cocolon_tree: "ae6964261649492e2186d1ee277956d9d5d12874"
design_publication_commit: "1bae1bd1ae87a921ba1c71bd3965470746f576b2"
design_publication_tree: "c9d242ff1744231546a75cb97c134f02ef198473"
pce8_complete: true
pce9_b01_activated: false
analysis_roadmap_activated: false
automatic_progression: false
production_effect: "exact0"
---

# Piece PCE-8 design freeze / work-package split closure checkpoint

## 1. Closure result

Mashが承認した次のdesign-only作業を完了した。

```text
PCE8_DESIGN_FREEZE_WORK_PACKAGE_SPLIT_DESIGN_ONLY
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
PCE-8: COMPLETE_DESIGN_ONLY

PCE-9A B01 Contract/Version Causal RED:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

Analysis Pro-First roadmap:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

## 2. Fixed PCE-8 contracts

```text
design freeze:
  piece.design_freeze.v1

implementation work-package index:
  piece.implementation_workpackage_index.v1

environment assignment:
  piece.environment_assignment_ledger.v1
```

PCE-8はPCE-0 through PCE-7を撤回・置換せず、PCE-9実装での解釈、owner path、依存、RED-first lifecycle、環境境界を固定した。

## 3. Freeze verdict

```text
product/design decisions unresolved:
  exact0

runtime/tooling/deployment conditions:
  exact6 with fixed owner

implementation started:
  false

production effect:
  exact0
```

Exact6 conditions:

```text
PCE8-U01 exact saved-input/Emlis terminal source binding
PCE8-U02 RN capture/media-save dependency
PCE8-U03 isolated actual PostgreSQL runner
PCE8-U04 production flag command/credential owner
PCE8-U05 external log retention/alert owner
PCE8-U06 actual-device and independent acceptance evidence
```

不足条件を隠すための追加資料・代替systemは作らず、各条件が依存packetだけを止めるようにした。

## 4. Design-conflict resolutions

```text
FZ-C01:
  provisional B6 publish API -> B6 Save API

FZ-C02:
  staged v2 API owner = api_piece_v2.py
  production registration before M5 exact0

FZ-C03:
  public.pieces切替前にexact6 current shared callerをmymodel_reflections_readへrebind

FZ-C04:
  piece_record_published_public -> piece_record_saved_public

FZ-C05:
  every Piece RN feature check uses explicit false fallback
  backend terminal enforcement authoritative

FZ-C06:
  initial RN tests = existing node:test + pure JS state models
  new component-test dependency automatic addition exact0

FZ-C07:
  M7 destructive cleanup outside B1-B15
  separate Mash approval required

FZ-C08:
  multirepository B-group is dependency group only
  one repository per write unit
```

## 5. Work-package freeze

```text
B1  Contract/version helpers
B2  Storage/migration foundation
B3  Visibility/access policy
B4  Quota/atomic terminal operations
B5  Saved-source adapter + Preview API
B6  Save API
B7  Owner detail/history/visibility/delete API
B8  Content/format/generation owner
B9  Visual recipe/layout owner
B10 RN post-Emlis CTA/preview
B11 RN owner history/visibility/delete
B12 Nexus v2 and clean cutover
B13 Export prototype
B14 Feature flags/monitoring
B15 Integrated staging E2E
```

```text
work-package groups:
  exact15

source/SQL packet lifecycle:
  R = causal RED freeze/validation
  I = bounded implementation + targeted GREEN

R -> I automatic progression:
  false

I -> next packet automatic progression:
  false
```

## 6. Frozen implementation order

```text
01 B1  contract/version foundation
02 B2  tracked migration + legacy bridge + dedicated schema
03 B3  visibility/access/RLS/staging projection
04 B4  quota and atomic terminal operations
05 B8  content/format/generation owner
06 B9  visual recipe/layout owner
07 B14-A backend fail-closed flags/monitoring
08 B5-A saved-source adapter
09 B5-B preview API
10 B6  save API
11 B7  owner history/detail/visibility/delete API
12 B14-B RN runtime/monitoring projection
13 B10 RN post-Emlis CTA/preview
14 B11 RN owner history/visibility/delete
15 B13 export preflight/receipt/RN prototype
16 B12-A backend Nexus v2
17 B12-B RN Nexus v2 and old Q&A UI reachability removal
18 B12-C clean-cutover registration/view/route packet
19 B15 integrated staging E2E and U1 entry evidence
20 PCE-U1 independent cross-repository audit
```

B5-Aは`PCE8-U01`が未解決なら待機する。B1-B4、B8、B9、B14-Aは独立して進行可能だが、それぞれ別承認を必要とする。

## 7. Migration boundary

```text
M0:
  B2-A tracked baseline

M1:
  B2-A legacy bridge/caller rebind

M2:
  B2-B dedicated foundation

M3:
  B3 + B4 RLS/RPC/staging

M4:
  B5 through B14 disabled integration

M5:
  B12-C single clean cutover

M6:
  B12-C body-free old identity capture after B15

M7:
  outside B1-B15
  separate Mash approval

M8:
  separate bounded Pro packet after verified M7
```

PCE-8ではSQL file作成、migration apply、data deletionを行っていない。

## 8. Environment assignment

```text
PCE-8 and bounded design/code:
  CHAT_5_6_PRO_OK

actual DB transaction/RLS/migration evidence:
  ISOLATED_DB_REQUIRED

integrated non-production flow:
  STAGING_RUNTIME_REQUIRED

native iOS/Android evidence:
  MASH_ACTUAL_DEVICE_REQUIRED

independent cross-repository acceptance:
  WORK_ULTRA_REQUIRED at PCE-U1/U2

production runtime/migration/rollback/destructive operation:
  DEPLOYMENT_OWNER_REQUIRED
```

```text
Work priority:
  EmlisAI current executable Work-required task
  > Piece PCE-U1 / PCE-U2

additional credit purchase assumed:
  false

environment downgrade:
  prohibited
```

## 9. Current actual basis

```text
Cocolon baseline head / tree:
  5316c8b3a9eef2ae84f6340aab24ee7ec8e654f5
  ae6964261649492e2186d1ee277956d9d5d12874

mashos-api head / tree:
  315813c7bd3372462de926ddad74df567254a6b5
  a641510e107d52bb910073f36604c85bd57af150

roadmap SHA-256:
  2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939
```

Confirmed current actual:

```text
current product:
  old Q&A Piece flow

new Piece production implementation:
  exact0

current Piece migration root:
  absent

current COCOLON_PIECES_READ_TABLE callers:
  exact6

current RN tests:
  Node node:test

current RN component-test framework:
  absent

current Piece v2 feature flags:
  absent
```

## 10. Verified PCE-8 artifacts

| path | remote UTF-8 bytes | Git blob SHA-1 |
|---|---:|---|
| `Cocolon_Piece/pce8_design_freeze_work_packages/Piece_Design_Freeze_Candidate_20260808.md` | 14920 | `c6652b89d47f908d8f8ebbaccbc16c8aa6771f6d` |
| `Cocolon_Piece/pce8_design_freeze_work_packages/Piece_Implementation_WorkPackage_Index_20260808.md` | 20630 | `fcd8614bc2983f50d85da45dc873c58de7494456` |
| `Cocolon_Piece/pce8_design_freeze_work_packages/Piece_Environment_Assignment_Ledger_20260808.md` | 14456 | `7b15eb23b608f2bbef57926ec05121e604606434` |
| `Cocolon_Piece/00_read_first.md` | verified | `4671216243ae86d65da1581d940c5a07a79e8ac2` |
| `Cocolon_Piece/manifest.json` | verified | `186cdcff58223cf886ffdff5fe8f9aa1e7a19fa6` |
| `Cocolon_前提資料/15K_cocolon_piece_workstream_pce8_design_closure_20260808.md` | verified | `be4f58099f455c5020076a9587a02246db9a5c5b` |

All exact3 PCE-8 artifact paths were listed from the publication commit with expected remote sizes and blobs. Entry、manifest v12、15K premise were fetched from the publication commit and matched their canonical blobs.

## 11. Publication scope

```text
baseline:
  5316c8b3a9eef2ae84f6340aab24ee7ec8e654f5

publication commit:
  1bae1bd1ae87a921ba1c71bd3965470746f576b2

publication tree:
  c9d242ff1744231546a75cb97c134f02ef198473

publication commits:
  exact1

publication changed paths:
  exact6

new PCE-8 artifacts:
  exact3

entry / manifest / premise:
  exact3

scope outside Piece / Piece premise:
  exact0

publication mode:
  non-force fast-forward
```

## 12. Transport and integrity

```text
invalid transport candidate:
  exact0

publication blob mismatch:
  exact0

unexpected changed path:
  exact0
```

All created blobs were re-fetched before tree inclusion. Publication path identities were then re-fetched from the published commit.

## 13. Manifest lineage

`Cocolon_Piece/manifest.json`はv11からcompact v12へ進んだ。

```text
predecessor manifest:
  v11

predecessor blob:
  a6af676ed0113d5b6b52b01b43b307cf2fbccdee

predecessor head:
  5316c8b3a9eef2ae84f6340aab24ee7ec8e654f5
```

PCE-0 through PCE-7の詳細identityはimmutable predecessorと各canonical phase artifactに保持される。v12はPCE-8 contracts、exact15 groups、exact6 conditions、environment assignment、next packet、actual basis、effectsをcurrent stateとして保持する。

## 14. Completed / not implemented

Completed:

- PCE-0 through PCE-7 implementation interpretation freeze;
- product decision unresolved exact0;
- runtime/tooling/deployment exact6 ownership;
- exact future backend/RN/migration/test owner paths;
- B1-B15 exact15 package groups;
- implementation dependency order;
- RED-only and implementation/GREEN lifecycle separation;
- M0-M8 binding and M7/M8 out-of-band boundary;
- Chat/isolated DB/staging/device/Work/deployment environment assignment;
- next B1 RED-only packet;
- entry、manifest v12、15K premise publication and verification.

Not implemented:

```text
Cocolon production source:
  exact0

mashos-api production source:
  exact0

SQL / DB / API / RN / migration / deletion:
  exact0

test files / CI / test execution:
  exact0

monitoring / Piece flags / rollback runtime:
  exact0

actual device / Work Ultra / deployment / release:
  exact0
```

## 15. Facts / inference / Karen's opinion

### Confirmed facts

PCE-8 roadmap、PCE-1 through PCE-7 canonical artifacts、current repository heads、current old Q&A owners、exact6 read-table caller search、Node test setup、Piece v2 migration/flags/component-test framework absence、publication changed paths、remote sizes/blobsを確認した。

### Inference / unconfirmed

Exact saved-input/Emlis adapter binding、RN capture/media package、isolated PostgreSQL materialization、production flag command/credential、external log retention、actual-device result、future U1/U2 resultは未確認である。各条件はfuture ownerへ割当済みであり、implemented/PASSとは扱わない。

### Karen's opinion

PCE-8で最も重要なのは、B1-B15を巨大な実装authorityへしなかったことである。REDの成立は実装権限ではなく、次のbounded ownerを一つだけ明確にする証拠として扱う。

また、new v2 APIをM5までunregisteredにすることで、current Q&Aを早期に壊さず、かつold/new user-visible dual-runを作らない進行が可能になる。

M7削除を実装完了から分離したことも重要である。new Pieceの成立、M5/B15 verification、M6 exact identity packetなしにold dataへ触れない。

## 16. Next exact inactive packet

```text
PCE9A_B01_CONTRACT_VERSION_CAUSAL_RED_FREEZE_ONLY

environment:
  CHAT_5_6_PRO_OK

classification:
  TEST_ONLY_RED

repository:
  MassyuRed/mashos-api

allowed new path:
  ai/tests/piece_v2/test_b01_piece_v2_contract_red.py

production source / DB / runtime effect:
  exact0

state:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

Analysis roadmap remains unactivated. Mash-side action required for PCE-8 closure is exact0.

## 17. Effects / closure

```text
Cocolon documentation / Piece premise:
  reflected

production source / DB / API / RN / migration / deletion:
  exact0

test / CI / runtime / actual device:
  exact0

monitoring / feature flag runtime:
  exact0

Work Ultra / deployment / release:
  exact0

EmlisAI / Analysis technical state:
  exact0

automatic progression:
  false

PCE8_DESIGN_FREEZE_V1_FIXED
PCE8_WORKPACKAGE_INDEX_V1_FIXED
PCE8_ENVIRONMENT_LEDGER_V1_FIXED
PCE8_PRODUCT_DECISION_UNRESOLVED_EXACT0
PCE8_RUNTIME_CONDITIONS_EXACT6_OWNED
PCE8_WORK_PACKAGE_GROUPS_EXACT15
PCE8_IMPLEMENTATION_ORDER_FIXED
PCE8_RED_IMPLEMENTATION_LIFECYCLE_SEPARATED
PCE8_M7_M8_OUT_OF_BAND_FIXED
PCE8_REMOTE_BLOBS_VERIFIED_EXACT6
PCE8_COMPLETE_DESIGN_ONLY
PCE9_B01_NOT_ACTIVATED
ANALYSIS_ROADMAP_NOT_ACTIVATED
AUTOMATIC_PROGRESSION_FALSE
```
