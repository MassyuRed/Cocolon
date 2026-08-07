---
doc_id: cocolon_piece_workstream_current_state
title: "Cocolon Piece Workstream Current State"
revision_date: "2026-08-07 JST"
decision_owner: "Mash"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "Mash product decision + GitHub actual PCE-0 inventory + durable Piece artifact publication"
current_piece_root: "Cocolon_Piece/"
current_phase: "PCE-0 Current Contract Pin"
phase_completion: false
automatic_progression: false
purpose: "Pieceのcurrent product definition、専用資料owner、Phase状態、次の必要入力を前提資料から一意に参照できるようにする"
---

# Cocolon Piece Workstream Current State

## 1. 最初に結論

Piece作業のcurrent入口は次です。

```text
Cocolon_Piece/00_read_first.md
```

Pieceのroadmap、handoff、PCE成果物、evidence query、manifestは`Cocolon_Piece/`をownerとします。

```text
Piece:
  Cocolon_Piece/

EmlisAI実装履歴:
  EmlisAIの実装済み資料/
```

Piece成果物をEmlisAIの資料・履歴へ混在させません。EmlisAI資料をPiece内部実装の正本として扱いません。

## 2. Mashが確定したcurrent Piece定義

2026-08-07、Mashは次を明示しました。

```text
PieceはQ&Aそのものではない。
Q&AはPieceの一形式である。

今のPieceは、
ユーザーの考えや価値観を他者に伝えるための文章に整形して、
画像化する機能である。
```

この定義により、次をcurrent product premiseとします。

- Q&AをPiece全体のidentityへ固定しない。
- current Q&A実装・recordは、保持すべき既存形式かつcompatibility基盤として扱う。
- future Pieceは、上位Piece identityの下に明示的format、画像化、visual recipe、public/private、export / re-exportを持つadditive redesignとする。
- existing recordの一括migration、old route即削除、current Q&Aのhistorical-only化は自動決定しない。

## 3. current GitHub actualとの関係

current GitHub sourceで確認されたPiece基盤:

```text
Q&A preview
preview draft
preview_id publish / cancel
mymodel_reflections family storage
preview / publish text hash equality
public read / Nexus
resonance
owner deletion
Free 5 / Plus 30 / Premium unlimited quota
legacy route / module compatibility
```

current sourceで未実装または未確定:

```text
明示的format_type
Q&A以外のformat owner
visual_recipe
image preview / image generation
Piece単位public / private
owner private history
visibility toggle
端末保存
external share
same-record re-export
post-Emlis saved-input adapter
```

したがって、current Q&A sourceを「Piece完成済み」とも、「不要な旧機能」とも扱いません。

## 4. current Phase状態

```text
phase:
  PCE-0 Current Contract Pin

environment:
  CHAT_5_6_PRO_OK

GitHub actual contract inventory:
  PRESERVED

formal PCE-0 completion:
  FALSE

terminal state:
  STOPPED_AT_CURRENT_PRODUCTION_DB_RLS_MIGRATION_IDENTITY

PCE-1 activated:
  FALSE

automatic progression:
  FALSE
```

PCE-0で、GitHub current source上のwrite / read / storage adapter / access / quota / compatibility / representative test ownerは固定済みです。

停止理由は、future lifecycle / visibility / migrationを安全に決めるために必要なcurrent production Supabase actualが未取得であることです。

特に、次を推測で閉じません。

```text
current code:
  source_type = emotion_generated

historical DB audit record:
  source_type constraint = create / generated
```

この差分がcurrent migration、constraint変更、view/trigger、environment差分のどれによるかは、current production evidenceで確認します。

## 5. durable Piece artifacts

### 5.1 workstream entry / manifest

```text
Cocolon_Piece/00_read_first.md
Cocolon_Piece/manifest.json
```

### 5.2 roadmap

```text
Cocolon_Piece/roadmap/
Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807/
```

原本identity:

```text
UTF-8 bytes: 49,465
lines: 1,964
SHA-256: a8ec1298901839aaf7421dad1942fe94f6cb1b90bad5a8944dc41ac24cdc69bd
```

### 5.3 handoff

```text
Cocolon_Piece/handoff/
Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807/
```

原本identity:

```text
UTF-8 bytes: 27,677
lines: 948
SHA-256: 82f4f811760fb86767b4f667d7ed653b8c00678101d06a3e2c44948f8c166bd0
```

### 5.4 PCE-0

```text
Cocolon_Piece/pce0_current_contract_pin/
  Piece_Current_Contract_Inventory_20260807.md
  Piece_Current_Owner_Map_20260807.md
  Piece_Current_Unconfirmed_Ledger_20260807.md
  PCE0_Current_Supabase_Piece_Schema_RLS_Migration_Query_20260807.sql
```

## 6. large artifact preservation form

roadmapとhandoffは、ordered UTF-8 partsとしてGitHubへ保存しています。

publication transport上、part末尾の原本区切りLFを次のとおりmanifested restorationとして分離しています。

```text
roadmap:
  part 1〜7の各末尾へLF exact1を復元。

handoff:
  part 1とpart 2の末尾へLF exact1を復元。
  part 3は復元なし。
```

- GitHub current part bytes、LF count、SHA-256、git blob SHA-1を各bundle `README.md`と`Cocolon_Piece/manifest.json`で固定しています。
- 指定LFを復元して番号順に連結すると、roadmapは49,465 bytes・SHA-256 `a8ec...69bd`、handoffは27,677 bytes・SHA-256 `82f4...6bd0`へbyte-exactに戻ります。
- current state追記のためにhistorical原本本文を書き換えていません。

原本中の`GITHUB_NOT_REFLECTED`、`LOCAL_DOWNLOAD_ARTIFACT`、`GITHUB_WRITE_EXACT0`は、原本作成時点のhistorical stateです。current publication stateはGitHub current path、manifest、current commit、本前提資料で判断します。

## 7. 次のMash側作業

PCE-0を再開して閉じるため、次のbody-free evidence packetを取得します。

```text
CURRENT_SUPABASE_PIECE_SCHEMA_RLS_MIGRATION_BODY_FREE_PACKET
```

使用するread-only SQL:

```text
Cocolon_Piece/pce0_current_contract_pin/
PCE0_Current_Supabase_Piece_Schema_RLS_Migration_Query_20260807.sql
```

取得対象:

- `mymodel_reflections`のcolumn / constraint / index / trigger。
- `pieces` / `pieces_read`の実在・view定義・owner。
- RLS enabled state / policy / grants。
- migration history identity。
- body-free aggregate shape counts。

取得しないもの:

- user input本文。
- Piece本文。
- profile情報。
- email / phone。
- API key / JWT / password / connection string。
- raw user rows。

## 8. evidence受領後の順序

1. current production actualとGitHub sourceを照合する。
2. DB mismatchをactual mismatch / stale historical record / code defect / environment divergenceへ分類する。
3. PCE-0完了条件を再評価する。
4. PCE-0を閉じられた場合だけPCE-1へ進む。
5. PCE-1では、MashのPiece定義を前提にversion / existing record / Nexus / compatibility / normative update timingを決める。

## 9. EmlisAI / Analysisとの境界

このPiece workstream publicationは、EmlisAIのcurrent authority、STOP、pending、credit、acceptanceを変更しません。

```text
EmlisAI:
  current input observation

Piece:
  expression / save / share

Analysis:
  period observation / current route
```

この責任分離のexact source / handoff boundaryはPCE-2で一度だけ固定します。PCE-2前にAnalysis側と別々のsource定義を作りません。

## 10. 禁止事項

- Q&AをPiece identityそのものへ戻す。
- current Q&Aを確認せずlegacy-onlyへ下げる。
- existing recordを一括migrationする。
- PCE-0をcompleteと扱う。
- PCE-1へautomatic progressionする。
- production DB actualなしでvisibility / migrationを確定する。
- Piece資料をEmlisAI実装履歴へ移す。
- historical原本のcreation-state tokenをcurrent化のために書き換える。
- manifestに記録されていないLF restorationを加える。

## 11. 今回のpublication effect

```text
Piece documentation / continuity artifacts:
  GitHub reflected

Cocolon production source change:
  0

mashos-api production source change:
  0

DB change:
  0

API change:
  0

RN change:
  0

migration:
  0

test execution:
  0

runtime execution:
  0

release effect:
  0
```
