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

Supabase evidence attempt 001:
  NONCREDIT_QUERY_DESIGN_FAILURE

confirmed attempt-001 fact:
  supabase_migrations.schema_migrations -> SQLSTATE 42P01 NOT PRESENT

PCE-1 activation:
  FALSE

automatic progression:
  FALSE
```

PCE-0のsource-side write / read / storage / access / quota / compatibility / representative test inventoryは作成済みです。

未解消blockerは、current production SupabaseのDDL、RLS、view identity、migration ownerです。特に、current codeが使う`source_type = emotion_generated`とhistorical DB auditに残るconstraint記録との不一致を、推測で閉じていません。

Attempt 001で確認できたのは、期待していたmigration history relationがそのsessionに存在しなかったことだけです。migrationが一度も行われていない、別名のmigration ownerも存在しない、current DDLが古い、という意味へ拡張しません。

## 4. 最初に読む順序

1. `Cocolon_前提資料/15_cocolon_piece_workstream_current_state.md`
2. `Cocolon_前提資料/15A_cocolon_piece_workstream_current_state_query_correction_20260807.md`
3. `Cocolon_Piece/manifest.json`
4. `Cocolon_Piece/pce0_current_contract_pin/PCE0_Query_Correction_Manifest_20260807.json`
5. `Cocolon_Piece/roadmap/Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807/README.md`
6. roadmap partsを番号順に読む
7. `Cocolon_Piece/handoff/Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807/README.md`
8. handoff partsを番号順に読む
9. `Cocolon_Piece/pce0_current_contract_pin/Piece_Current_Contract_Inventory_20260807.md`
10. `Cocolon_Piece/pce0_current_contract_pin/Piece_Current_Owner_Map_20260807.md`
11. `Cocolon_Piece/pce0_current_contract_pin/Piece_Current_Unconfirmed_Ledger_20260807.md`
12. `Cocolon_Piece/pce0_current_contract_pin/Piece_PCE0_Supabase_Query_Attempt001_Result_And_Correction_20260807.md`
13. Supabase evidence取得時はcurrent V2 queryだけを使う

Cocolon作業全体の開始時には、これより先に`Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt`を読みます。

## 5. Supabase evidence query state

### historical noncurrent query

```text
PCE0_Current_Supabase_Piece_Schema_RLS_Migration_Query_20260807.sql
```

state:

```text
ATTEMPT_001_FAILED_NONCREDIT
SUPERSEDED_FOR_EXECUTION
PRESERVED_IN_GIT_HISTORY
```

V1は、存在しない可能性のある`supabase_migrations.schema_migrations`を同じpacket内で直接参照したため、SQLSTATE 42P01で停止しました。

### current execution query

```text
Cocolon_Piece/pce0_current_contract_pin/
PCE0_Current_Supabase_Piece_Catalog_Query_20260807_V2.sql
```

V2は、一つのSELECTで一つのJSONB packetを返します。catalog-onlyであり、存在が未確認のapplication relationやmigration relationを直接参照しません。

application-row aggregateはPCE0-U009のnon-blocking evidenceなので、exact table / column確認前には実行しません。

## 6. large artifact preservation rule

roadmapとhandoffは、大きな原本をGitHubで読みやすく保存するため、ordered UTF-8 partsとして配置しています。

publication transport上、次のpartでは原本区間末尾のLF exact1をGitHub fileから分離し、manifested restorationとして扱います。

```text
roadmap:
  part 1〜7の各末尾へLF exact1を復元する。

handoff:
  part 1とpart 2の末尾へLF exact1を復元する。
  part 3はそのまま使う。
```

- GitHub current part bytes、LF count、SHA-256、git blob SHA-1を`manifest.json`と各bundle `README.md`で固定しています。
- 指定されたLFだけを復元し、番号順に連結すると原本をbyte-exactに再構成できます。
- 再構成後の原本bytesとSHA-256は検証済みです。
- current state追記のためにhistorical原本本文を書き換えていません。

原本内の`GITHUB_NOT_REFLECTED`、`LOCAL_DOWNLOAD_ARTIFACT`、`GITHUB_WRITE_EXACT0`等は、原本作成時点のhistorical stateです。current publication stateは、このdirectory、root manifest、PCE-0 correction manifest、前提資料checkpoint、current GitHub commitで判断します。

## 7. next exact action

Mash側で次のbody-free evidence packetを取得します。

```text
CURRENT_SUPABASE_PIECE_CATALOG_BODY_FREE_PACKET_V2
```

query owner:

```text
Cocolon_Piece/pce0_current_contract_pin/
PCE0_Current_Supabase_Piece_Catalog_Query_20260807_V2.sql
```

取得後に行うこと:

1. current DDL / constraints / views / RLS / grantsを照合する。
2. expected migration relationの不存在と、別名candidate relationの有無を分ける。
3. source-side inventoryとの不一致を分類する。
4. PCE-0を閉じられるか判定する。
5. migration history rowの追加readが本当に必要な場合だけ、確認されたexact relation向けの別SELECTを作る。
6. PCE-0を閉じられた場合だけPCE-1へ進む。

## 8. 禁止事項

- V1 queryを再実行する。
- Attempt 001でA-IまたはK-Lのevidenceが取得済みだったと推測する。
- migration relation不存在を「migration実行履歴なし」へ拡張する。
- PCE-0をcompleteと扱う。
- PCE-1へautomatic progressionする。
- Q&AをPieceそのものと再定義する。
- current Q&A recordを確認せずhistorical-onlyへ下げる。
- existing recordを一括migrationする。
- Emlis visible bodyをPiece本文へコピーする。
- Piece成果物をEmlisAI実装履歴へ混在させる。
- local pathやchatだけをdurable preservationと扱う。
- roadmap / handoff原本のcreation-state記述を書き換える。
- manifestにないnewline restorationを加える。

## 9. publication effect

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

PCE-0 completion:
  false

PCE-1 activation:
  false

release effect:
  0
```
