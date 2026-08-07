---
doc_id: cocolon_piece_workstream_checkpoint_20260807
title: "Cocolon Piece Workstream GitHub Publication Checkpoint"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
workstream: "Cocolon / Piece"
checkpoint_type: "additive durable publication checkpoint"
baseline_cocolon_head: "f8ecb44305313497b1eed06a7e5fbfe6151e2b8d"
publication_head_before_checkpoint: "fd0814669856cb11598962b68837b6d78497a88a"
publication_tree_before_checkpoint: "16c7f0d1f6e4eb1db9ea012fa1b68782fe7540bb"
automatic_progression: false
pce0_complete: false
pce1_activated: false
---

# Cocolon Piece Workstream GitHub Publication Checkpoint

## 1. 結論

Pieceのroadmap、handoff、PCE-0成果物、Supabase evidence query、workstream manifest、current入口を、EmlisAI実装履歴と分離したGitHub durable ownerへ反映した。

```text
Piece owner root:
  Cocolon_Piece/

EmlisAI implementation history root:
  EmlisAIの実装済み資料/
```

今回のpublicationはPiece documentation / continuity artifactの保存であり、Cocolon production source、mashos-api production source、DB、API、RN、migration、test、runtime、releaseを変更していない。

## 2. Mash product decision

2026-08-07、Mashは次を明示した。

```text
PieceはQ&Aそのものではない。
Q&AはPieceの一形式である。

Pieceは、
ユーザーの考えや価値観を他者に伝えるための文章に整形し、
画像化する機能である。
```

このdecisionは次へ反映済みである。

```text
Cocolon_Piece/00_read_first.md
Cocolon_Piece/manifest.json
Cocolon_前提資料/15_cocolon_piece_workstream_current_state.md
Cocolon_Piece/pce0_current_contract_pin/Piece_Current_Unconfirmed_Ledger_20260807.md
```

current Q&A実装をPiece全体のidentityと扱わず、既存の一形式かつcompatibility基盤として保持する。

## 3. GitHub publication scope

baseline:

```text
commit:
  f8ecb44305313497b1eed06a7e5fbfe6151e2b8d
```

checkpoint作成直前のpublication state:

```text
commit:
  fd0814669856cb11598962b68837b6d78497a88a

tree:
  16c7f0d1f6e4eb1db9ea012fa1b68782fe7540bb

compare:
  ahead_by exact24
  changed_paths exact19
  additions 5,492
  deletions 0
```

changed path class:

```text
Cocolon_Piece/*:
  exact18

Cocolon_前提資料/15_cocolon_piece_workstream_current_state.md:
  exact1

EmlisAIの実装済み資料/*:
  exact0

production source path:
  exact0
```

## 4. durable paths

### 4.1 entry and manifest

```text
Cocolon_Piece/00_read_first.md
Cocolon_Piece/manifest.json
```

### 4.2 roadmap bundle

```text
Cocolon_Piece/roadmap/
Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807/
  README.md
  part_01_context_and_environment_policy.md
  part_02_release_target_decisions_and_overview.md
  part_03_pce0_to_pce3.md
  part_04_pce4_to_pce6.md
  part_05_pce7_to_pce9.md
  part_06_u1_to_release_closure.md
  part_07_queue_relations_decisions_and_closure.md
```

original identity:

```text
UTF-8 bytes:
  49,465

lines:
  1,964

SHA-256:
  a8ec1298901839aaf7421dad1942fe94f6cb1b90bad5a8944dc41ac24cdc69bd
```

### 4.3 Piece / Analysis handoff bundle

```text
Cocolon_Piece/handoff/
Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807/
  README.md
  part_01_context_and_actual.md
  part_02_piece_and_analysis_policy.md
  part_03_emlis_state_next_and_closure.md
```

original identity:

```text
UTF-8 bytes:
  27,677

lines:
  948

SHA-256:
  82f4f811760fb86767b4f667d7ed653b8c00678101d06a3e2c44948f8c166bd0
```

### 4.4 PCE-0

```text
Cocolon_Piece/pce0_current_contract_pin/
  Piece_Current_Contract_Inventory_20260807.md
  Piece_Current_Owner_Map_20260807.md
  Piece_Current_Unconfirmed_Ledger_20260807.md
  PCE0_Current_Supabase_Piece_Schema_RLS_Migration_Query_20260807.sql
```

### 4.5 premise owner

```text
Cocolon_前提資料/15_cocolon_piece_workstream_current_state.md
```

## 5. remote blob verification

PCE-0成果物は、ローカル成果物のSHA-256とGitHub current blobを照合した。

| file | UTF-8 bytes | SHA-256 | Git blob SHA-1 |
|---|---:|---|---|
| `Piece_Current_Contract_Inventory_20260807.md` | 25,797 | `63dae6a51a2517997464fc9c37e283c34ca699e2605303c945ed6770a0ce6f18` | `67cc67036f53dddd3a5cc5fe5544c336e2d4cf1d` |
| `Piece_Current_Owner_Map_20260807.md` | 12,762 | `9e8e72665992e7529122d08de18e777179d4776f5429e97f9f70e9b956533fb7` | `6225c4e6c4a1efe02f110fcea2be25f0309f574f` |
| `Piece_Current_Unconfirmed_Ledger_20260807.md` | 11,011 | `a0d0ef7d330f3d028dbbf7024b9503530765d28a693c9e003d3072aea275fb8c` | `d58967bfc6f5445ace23faf2d89bad6809d72e38` |
| `PCE0_Current_Supabase_Piece_Schema_RLS_Migration_Query_20260807.sql` | 6,903 | `ae83c2677b813c96a37015eaf887bbc6713ba1eabf8bf56868ea76cd547bcdd1` | `c173712cadfaf4651f1c99d939c304e6fd7136a0` |

## 6. large artifact transport verification

roadmapとhandoffはordered UTF-8 partsとして保存した。

GitHub publication時に、manifestで指定したpartだけ原本区切りLF exact1をfile外へ分離した。原本再構成では次だけを復元する。

```text
roadmap:
  part 1〜7の各末尾にLF exact1。

handoff:
  part 1とpart 2の各末尾にLF exact1。
  part 3は復元exact0。
```

`Cocolon_Piece/manifest.json`および各bundle `README.md`は、GitHub current partのbytes、LF count、SHA-256、git blob SHA-1、restore flagを記録する。

publication前再構成検証:

```text
roadmap:
  reconstructed bytes = 49,465
  reconstructed SHA-256 = a8ec1298901839aaf7421dad1942fe94f6cb1b90bad5a8944dc41ac24cdc69bd
  original match = true

handoff:
  reconstructed bytes = 27,677
  reconstructed SHA-256 = 82f4f811760fb86767b4f667d7ed653b8c00678101d06a3e2c44948f8c166bd0
  original match = true
```

原本本文中の`GITHUB_NOT_REFLECTED`、`LOCAL_DOWNLOAD_ARTIFACT`、`GITHUB_WRITE_EXACT0`はcreation-time historical stateである。current publicationは本checkpoint、manifest、GitHub current pathで判断する。

## 7. PCE-0 current state

```text
PCE-0 GitHub actual inventory:
  PRESERVED

PCE-0 formal completion:
  FALSE

terminal state:
  STOPPED_AT_CURRENT_PRODUCTION_DB_RLS_MIGRATION_IDENTITY

PCE-1 activated:
  FALSE

automatic progression:
  FALSE
```

source-side write / read / storage / access / quota / compatibility / representative test inventoryは保存済みである。

未解消blocker:

```text
current production Supabase DDL
current source_type constraint
current pieces / pieces_read view identity
current RLS / grants
current migration head
```

current codeの`source_type = emotion_generated`と、historical DB auditの`create / generated` constraint記録を推測で一致扱いにしない。

## 8. next exact input

Mash側で取得するもの:

```text
CURRENT_SUPABASE_PIECE_SCHEMA_RLS_MIGRATION_BODY_FREE_PACKET
```

query path:

```text
Cocolon_Piece/pce0_current_contract_pin/
PCE0_Current_Supabase_Piece_Schema_RLS_Migration_Query_20260807.sql
```

取得後、current production actualとGitHub sourceを照合し、PCE-0を閉じられるか判断する。PCE-0を閉じる前にPCE-1へ進まない。

## 9. technical effects

```text
Piece documentation / continuity files:
  GitHub reflected

Cocolon production source change:
  exact0

mashos-api production source change:
  exact0

DB change:
  exact0

API change:
  exact0

RN change:
  exact0

migration:
  exact0

test execution:
  exact0

runtime execution:
  exact0

release effect:
  exact0
```

## 10. closure

```text
PIECE_DEDICATED_GITHUB_ROOT_CREATED
PIECE_ARTIFACTS_SEPARATED_FROM_EMLIS_HISTORY
MASH_CURRENT_PIECE_DEFINITION_PRESERVED
ROADMAP_DURABLY_PRESERVED_WITH_VERIFIED_RECONSTRUCTION
HANDOFF_DURABLY_PRESERVED_WITH_VERIFIED_RECONSTRUCTION
PCE0_ARTIFACTS_BYTE_IDENTITIES_VERIFIED
PREMISE_CURRENT_STATE_OWNER_ADDED
PCE0_REMAINS_STOPPED
PCE1_NOT_ACTIVATED
AUTOMATIC_PROGRESSION_FALSE
PRODUCTION_EFFECT_EXACT0
```
