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

`Cocolon_Piece/`は、Pieceのroadmap、handoff、Phase成果物、evidence、checkpointをEmlisAI資料群と分離して保存するcurrent ownerです。

```text
Piece:
  Cocolon_Piece/

EmlisAI implementation history:
  EmlisAIの実装済み資料/
```

Piece成果物を`EmlisAIの実装済み資料/`へ混在させません。

## 2. Mashが確定したcurrent Piece定義

```text
PieceはQ&Aそのものではない。
Q&AはPieceの一形式である。

Pieceは、
ユーザーの考えや価値観を他者に伝えるための文章に整形し、
画像化する機能である。
```

current Q&A implementation / recordは既存formatかつcompatibility基盤です。Piece全体のidentityではありません。

## 3. current phase state

```text
completed phase:
  PCE-0 Current Contract Pin

PCE-0:
  COMPLETE

current technical state:
  PCE0_COMPLETE_CURRENT_CONTRACT_PINNED

PCE-1:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  FALSE
```

PCE-0 completion owner:

```text
Cocolon_前提資料/
15B_cocolon_piece_workstream_pce0_closure_20260807.md

Cocolon_Piece/pce0_current_contract_pin/
Piece_PCE0_Current_Catalog_Analysis_And_Closure_20260807.md
PCE0_Closure_State_20260807.json
Piece_PCE0_Closure_Ledger_20260807.md
```

## 4. PCE-0で固定したcurrent actual

```text
physical write table:
  public.mymodel_reflections

read view:
  public.pieces
  security_invoker=true
  direct projection

public.pieces_read:
  absent

source_type:
  create / generated / emotion_generated

status:
  draft / ready / rejected / failed / archived

RLS:
  enabled on mymodel_reflections
  policy exact0

current access owner:
  backend application service

application migration history owner:
  expected relation absent
```

migration history owner不存在は、current catalogを未確認へ戻しません。PCE-6でDDLへ進む前に、current snapshotへbindしたtracked application migration baselineを作ります。

## 5. 最初に読む順序

1. `Cocolon_前提資料/15B_cocolon_piece_workstream_pce0_closure_20260807.md`
2. `Cocolon_Piece/pce0_current_contract_pin/PCE0_Closure_State_20260807.json`
3. `Cocolon_Piece/pce0_current_contract_pin/Piece_PCE0_Current_Catalog_Analysis_And_Closure_20260807.md`
4. `Cocolon_Piece/pce0_current_contract_pin/Piece_PCE0_Closure_Ledger_20260807.md`
5. `Cocolon_Piece/manifest.json`
6. `Cocolon_Piece/roadmap/Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807/README.md`
7. roadmap partsを番号順に読む
8. `Cocolon_Piece/handoff/Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807/README.md`
9. handoff partsを番号順に読む
10. Phase-specific current成果物を読む

Cocolon作業全体の開始時には、これより先に`Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt`を読みます。

## 6. Supabase evidence lineage

### Attempt 001 — noncredit

```text
PCE0_Current_Supabase_Piece_Schema_RLS_Migration_Query_20260807.sql

state:
  ATTEMPT_001_FAILED_NONCREDIT
  SUPERSEDED_FOR_EXECUTION
```

### V2 query and result

```text
query:
  PCE0_Current_Supabase_Piece_Catalog_Query_20260807_V2.sql

result bundle:
  PCE0_Current_Supabase_Piece_Catalog_Result_20260807.json.gz.b64
  PCE0_Current_Supabase_Piece_Catalog_Result_20260807.bundle.json

result SHA-256:
  2f51e5e6e4207a186aaacbeb355c07ade3b4f777960f3f46d1dbea9f8f9d810e
```

V2 resultはcatalog / metadataのみで、user input本文、Piece本文、profile、credential、raw user rowを含みません。

## 7. large artifact preservation rule

roadmapとhandoffはordered UTF-8 partsとして保存しています。

```text
roadmap:
  part 1〜7の各末尾へLF exact1を復元。

handoff:
  part 1とpart 2の末尾へLF exact1を復元。
  part 3は復元なし。
```

`manifest.json`と各bundle `README.md`に記録された復元規則以外を追加しません。

原本内の`GITHUB_NOT_REFLECTED`、`LOCAL_DOWNLOAD_ARTIFACT`、`GITHUB_WRITE_EXACT0`は原本作成時点のhistorical stateです。

## 8. next exact action

PCE-1は別承認後に開始します。

最初に決める事項:

```text
existing Q&Aを、
new Piece導入後もユーザーが選べる現役formatとして残すか、
既存record表示のcompatibility formatだけにするか。
```

その後、version、existing record adapter、Nexus renderer、compatibility duration、normative ownerを固定します。

## 9. 禁止事項

- PCE-1へautomatic progressionする。
- Q&AをPiece identityへ戻す。
- current Q&A recordを確認せず削除・一括migrationする。
- application migration owner不存在を、Supabase内部migration tableで代用する。
- current catalog snapshotなしでfuture DDLを作る。
- Emlis visible bodyをPiece本文へコピーする。
- Piece成果物をEmlisAI実装履歴へ混在させる。
- roadmap / handoff原本のhistorical stateを書き換える。
- manifestにないnewline restorationを加える。

## 10. current effects

```text
PCE-0 documentation / evidence:
  GitHub reflected after closure publication

Cocolon production source:
  0

mashos-api production source:
  0

DB / API / RN / migration:
  0

test / runtime:
  0

PCE-1 activation:
  false

release:
  0
```
