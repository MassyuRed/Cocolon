---
doc_id: cocolon_piece_read_first
title: "Cocolon Piece — Read First"
revision_date: "2026-08-07 JST"
decision_owner: "Mash"
workstream: "Cocolon / Piece"
document_status: "CURRENT_PIECE_WORKSTREAM_ENTRY"
automatic_progression: false
---

# Cocolon Piece — Read First

## 1. このdirectoryのowner

`Cocolon_Piece/`は、Pieceのroadmap、handoff、Phase成果物、evidence query、checkpointをEmlisAI資料群と分離して保存するcurrent ownerです。

```text
Piece workstream:
  Cocolon_Piece/

EmlisAI implementation history:
  EmlisAIの実装済み資料/
```

Piece成果物を`EmlisAIの実装済み資料/`へ混在させません。EmlisAI資料をPiece内部実装の正本として扱いません。cross-core境界が必要な場合は、PCE-2でsource / handoff責任を一度だけ固定します。

## 2. Mashが確定したcurrent Piece定義

```text
PieceはQ&Aそのものではない。
Q&AはPieceの一形式である。

Pieceは、
ユーザーの考えや価値観を他者に伝えるための文章に整形し、
画像化する機能である。
```

この定義は、2026-08-07にMashが明示したcurrent product decisionです。

current GitHub実装はQ&A preview / publish / storage / Nexus / resonance / quotaを持ちますが、画像化、明示的`format_type`、`visual_recipe`、Piece単位public/private、export / re-exportは未実装です。したがって、current Q&AをPiece全体の定義と誤認しません。

## 3. current phase state

```text
phase:
  PCE-0 Current Contract Pin

GitHub actual inventory:
  PRESERVED

formal completion:
  FALSE

terminal state:
  STOPPED_AT_CURRENT_PRODUCTION_DB_RLS_MIGRATION_IDENTITY

PCE-1 activation:
  FALSE

automatic progression:
  FALSE
```

PCE-0のsource-side write / read / storage / access / quota / compatibility / representative test inventoryは作成済みです。

未解消blockerは、current production SupabaseのDDL、RLS、view identity、migration headです。特に、current codeが使う`source_type = emotion_generated`とhistorical DB auditに残るconstraint記録との不一致を、推測で閉じていません。

## 4. 最初に読む順序

1. `Cocolon_前提資料/15_cocolon_piece_workstream_current_state.md`
2. `Cocolon_Piece/manifest.json`
3. `Cocolon_Piece/roadmap/Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807/README.md`
4. roadmap partsを番号順に読む
5. `Cocolon_Piece/handoff/Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807/README.md`
6. handoff partsを番号順に読む
7. `Cocolon_Piece/pce0_current_contract_pin/Piece_Current_Contract_Inventory_20260807.md`
8. `Cocolon_Piece/pce0_current_contract_pin/Piece_Current_Owner_Map_20260807.md`
9. `Cocolon_Piece/pce0_current_contract_pin/Piece_Current_Unconfirmed_Ledger_20260807.md`
10. Supabase evidence取得時だけ`PCE0_Current_Supabase_Piece_Schema_RLS_Migration_Query_20260807.sql`を使う

Cocolon作業全体の開始時には、これより先に`Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt`を読みます。

## 5. large artifact preservation rule

roadmapとhandoffは、原本bytesを改変せずGitHubへ保存するため、ordered UTF-8 partsとして配置しています。

- 各partは原本の連続byte範囲です。
- part順は各bundleの`README.md`で固定しています。
- 単純連結で原本を再構成できます。
- 各part SHA-256、原本bytes、原本lines、原本SHA-256を固定しています。
- current stateの追記を原本へ混ぜません。

原本内の`GITHUB_NOT_REFLECTED`、`LOCAL_DOWNLOAD_ARTIFACT`、`GITHUB_WRITE_EXACT0`等は、原本作成時点のhistorical stateです。current publication stateは、このdirectory、`manifest.json`、前提資料checkpoint、current GitHub commitで判断します。

## 6. next exact action

Mash側で次のbody-free evidence packetを取得します。

```text
CURRENT_SUPABASE_PIECE_SCHEMA_RLS_MIGRATION_BODY_FREE_PACKET
```

query owner:

```text
Cocolon_Piece/pce0_current_contract_pin/
PCE0_Current_Supabase_Piece_Schema_RLS_Migration_Query_20260807.sql
```

取得後に行うこと:

1. current DDL / constraints / views / RLS / grants / migration identityを照合する。
2. source-side inventoryとの不一致を分類する。
3. PCE-0を閉じられるか判定する。
4. 閉じられた場合だけPCE-1へ進む。

## 7. 禁止事項

- PCE-0をcompleteと扱う。
- PCE-1へautomatic progressionする。
- Q&AをPieceそのものと再定義する。
- current Q&A recordを確認せずhistorical-onlyへ下げる。
- existing recordを一括migrationする。
- Emlis visible bodyをPiece本文へコピーする。
- Piece成果物をEmlisAI実装履歴へ混在させる。
- local pathやchatだけをdurable preservationと扱う。
- roadmap / handoff原本のcreation-state記述を書き換える。

## 8. publication effect

```text
Piece documentation / evidence files:
  GitHub reflected

Cocolon production source change:
  0

mashos-api production source change:
  0

DB / API / RN / migration change:
  0

test / runtime execution:
  0

release effect:
  0
```
