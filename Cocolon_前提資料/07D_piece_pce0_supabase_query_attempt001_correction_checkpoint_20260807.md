---
doc_id: piece_pce0_supabase_query_attempt001_correction_checkpoint_20260807
title: "Piece PCE-0 Supabase query Attempt 001 correction checkpoint"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
checkpoint_type: "ADDITIVE_DURABLE_QUERY_CORRECTION"
baseline_cocolon_head: "2fd399ac95d11d5d800e986265faa43850bb532c"
publication_head_before_checkpoint: "2ffd4ae50d54aa2e526a60b2157d28e14da986c1"
publication_tree_before_checkpoint: "1159830c830b6737c91ef83b4aec03d4f82331e6"
automatic_progression: false
pce0_complete: false
pce1_activated: false
production_effect: "exact0"
---

# Piece PCE-0 Supabase query Attempt 001 correction checkpoint

## 1. 結論

MashがV1 queryをSupabase SQL Editorで実行した結果、次を直接観測した。

```text
SQLSTATE:
  42P01

error:
  relation "supabase_migrations.schema_migrations" does not exist

line:
  156
```

これは、exact relation `supabase_migrations.schema_migrations`が当該SQL sessionで解決できなかったことを示す。

一方、migrationが一度も行われていないこと、別名のmigration ownerも存在しないこと、current DDL / RLS / viewが古いまたは壊れていることは示さない。

## 2. V1の判定

```text
query:
  Cocolon_Piece/pce0_current_contract_pin/
  PCE0_Current_Supabase_Piece_Schema_RLS_Migration_Query_20260807.sql

Git blob SHA-1:
  c173712cadfaf4651f1c99d939c304e6fd7136a0

state:
  ATTEMPT_001_FAILED_NONCREDIT
  SUPERSEDED_FOR_EXECUTION
  PRESERVED_IN_GIT_HISTORY
```

V1は、relation不存在時に失敗し得ることをcommentで認識しながら、同じmulti-statement packet内で当該relationを直接参照していた。

Mashから返されたのはterminal errorであり、先行sectionのresult setは受領していない。そのためA-I / K-Lを取得済みevidenceへ昇格しない。

## 3. current query

```text
Cocolon_Piece/pce0_current_contract_pin/
PCE0_Current_Supabase_Piece_Catalog_Query_20260807_V2.sql
```

V2は次を満たす。

- one SELECT statement;
- one JSONB result packet;
- catalog-only;
- uncertain application / migration relationへのdirect reference exact0;
- application-row export exact0;
- expected migration relationのstateと、別名migration candidate relation / columnsを分離して返す;
- non-blockingなrow aggregateはexact catalog確認後へ延期する。

## 4. GitHub publication scope

baselineからcheckpoint直前headまで:

```text
commit count:
  exact5

changed paths:
  exact5

scope outside Piece / Piece premise correction:
  exact0
```

exact paths:

```text
Cocolon_Piece/00_read_first.md
Cocolon_Piece/pce0_current_contract_pin/PCE0_Current_Supabase_Piece_Catalog_Query_20260807_V2.sql
Cocolon_Piece/pce0_current_contract_pin/PCE0_Query_Correction_Manifest_20260807.json
Cocolon_Piece/pce0_current_contract_pin/Piece_PCE0_Supabase_Query_Attempt001_Result_And_Correction_20260807.md
Cocolon_前提資料/15A_cocolon_piece_workstream_current_state_query_correction_20260807.md
```

## 5. fresh remote blob verification

| path | UTF-8 bytes | SHA-256 | Git blob SHA-1 | result |
|---|---:|---|---|---|
| `Cocolon_Piece/00_read_first.md` | 7,737 | `8d3c9be7dfffd16dc4c212f1845228e546a69e8f641cc774ef766c7a5ee4ceec` | `fd5fb67a72f697338cb57a4a051f1841b345faf3` | MATCH |
| `PCE0_Current_Supabase_Piece_Catalog_Query_20260807_V2.sql` | 10,654 | `094de25c5afe51ef19ba9f3c517e217334cc21fa941df3ec8c8c5574c8eac69a` | `b38ba683d340aa599184a8f61e64867ebe13451b` | MATCH |
| `PCE0_Query_Correction_Manifest_20260807.json` | 1,648 | `60ae4796640ba984adb4307285334d6d1d410075b5e21eabc8849ff31842e186` | `dc59368645fd0f25744a2a346183c761430cd62a` | MATCH |
| `Piece_PCE0_Supabase_Query_Attempt001_Result_And_Correction_20260807.md` | 3,035 | `4fd02a7dca9322803d52f0bc2ea4e68054228746c4bd6912d82fe8c9795deb5d` | `6987a96834879670b6a453dc01191d0e7dc1b5f3` | MATCH |
| `Cocolon_前提資料/15A_cocolon_piece_workstream_current_state_query_correction_20260807.md` | 2,201 | `0f4b8237849b0b012f4d4fbd6ec4f9a20080189fcf9359a71d27d0e95a8f82c5` | `5c7e5a9313efb2b1777fef578afc756ab9cae82b` | MATCH |

## 6. current phase state

```text
PCE0 confirmed new fact:
  expected migration relation absent in observed SQL session

PCE0 blockers closed:
  exact0

current DDL / RLS / view evidence packet:
  NOT_YET_RECEIVED

migration candidate relation evidence:
  NOT_YET_RECEIVED

PCE0 formal completion:
  false

PCE1 activated:
  false

automatic progression:
  false
```

## 7. next exact action

MashがSupabase SQL Editorで次のcurrent queryを一回実行し、返されたsingle JSON packetを渡す。

```text
Cocolon_Piece/pce0_current_contract_pin/
PCE0_Current_Supabase_Piece_Catalog_Query_20260807_V2.sql
```

追加のDDL、migration、row export、token、secret、接続情報は不要である。

## 8. effects

```text
Cocolon production source change:
  exact0

mashos-api production source change:
  exact0

DB / API / RN / migration change:
  exact0

test / runtime execution:
  exact0

EmlisAI technical state effect:
  exact0

release effect:
  exact0
```
