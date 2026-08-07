---
doc_id: piece_current_unconfirmed_ledger_20260807
title: "Piece Current Unconfirmed Ledger"
created_at: "2026-08-07 JST"
created_by: "Karen"
decision_owner: "Mash"
phase: "PCE-0 Current Contract Pin"
document_type: "Markdown unconfirmed / blocker ledger"
document_status: "OPEN_WITH_PCE0_BLOCKER"
automatic_progression: false
pce0_state: "STOPPED_WITH_CONFIRMED_INVENTORY_PRESERVED"
---

# Piece Current Unconfirmed Ledger

## 0. Ledger rule

- 未確認を成功・不具合・仕様へ変換しない。
- historical auditとcurrent production actualを混同しない。
- GitHub current sourceから分かることと、production catalog / runtime / actual deviceが必要なことを分ける。
- `BLOCKING_PCE0`が一件でもopenならPCE-0をcompleteにしない。
- このledgerは修正・migration・production access authorityを与えない。

---

## 1. Blocking items

### PCE0-U001 — current `mymodel_reflections` DDL / source-type constraint

```text
state:
  BLOCKING_PCE0

confirmed current code:
  writes and filters source_type = emotion_generated

historical DB audit record:
  source_type check allowed create / generated

unconfirmed:
  current production check constraint
  migration that introduced emotion_generated
  environment-specific divergence
```

Why blocking:

future Piece version、format、visibility、old/new record coexistenceを設計する前に、current row shapeとaccepted valuesを正確に知る必要がある。old auditをcurrentと誤認すると、migration planとwrite compatibilityを誤る。

Required evidence:

```text
current production catalog export for mymodel_reflections:
  columns / types / defaults / nullability
  check constraints
  unique constraints
  foreign keys
  indexes
  triggers
  generated columns
```

Required owner/action:

MashがSupabase側で取得できるbody-free schema evidenceを渡す。秘密、token、user row、本文は不要。

---

### PCE0-U002 — current RLS / grants / service-role boundary

```text
state:
  BLOCKING_PCE0

historical evidence:
  2026-04-26 policy inventoryにmymodel_reflections専用policyが明示されていない

confirmed current source:
  backend helpers directly call REST table/view paths

unconfirmed:
  RLS enabled state
  policies
  grants
  service-role usage
  view security behavior
```

Why blocking:

future owner-private history、Piece単位public/private、owner switch、Nexus accessを設計するには、current authorizationがapplication serviceだけで成立しているのか、DB policyでも拘束されるのかを知る必要がある。

Required evidence:

```text
RLS enabled / forced state
policies for mymodel_reflections and related Piece views
role grants
view security_invoker / security_barrier equivalent
backend role used for current calls (identity only; no secret)
```

---

### PCE0-U003 — current migration head and post-2026-04-26 changes

```text
state:
  BLOCKING_PCE0

confirmed:
  historical audit recorded 36 migration-history rows at 2026-04-26
  current code expects a later-compatible schema

unconfirmed:
  current migration-history head
  migration files or SQL that changed source_type / views / policies
```

Why blocking:

PCE-6 migration design cannot be additive and reversible unless current migration baseline is pinned.

Required evidence:

```text
migration history after 2026-04-26
current migration head / version
relevant SQL or body-free change summary
```

---

### PCE0-U004 — canonical read view identity

```text
state:
  BLOCKING_PCE0_LINKED_TO_U001_U003

observed names:
  pieces
  pieces_read
  mymodel_reflections

confirmed current code:
  generated Piece backend currently reads physical mymodel_reflections family

unconfirmed:
  whether pieces and pieces_read both exist
  which one is current canonical view
  whether either rewrites / filters / projects emotion_generated rows
```

Why blocking:

old/new record projectionとpublic/private read modelを設計するownerが変わるため。

Required evidence:

```text
current pg_views / information_schema view definitions for pieces and pieces_read
object existence and owner
consumer list if available
```

---

## 2. Important non-blocking-for-source-inventory items

### PCE0-U005 — deployed production backend identity

```text
state:
  OPEN_REQUIRED_BEFORE_IMPLEMENTATION

confirmed:
  GitHub main head = 315813c7bd3372462de926ddad74df567254a6b5

unconfirmed:
  production deployment commit / image identity
```

Impact:

GitHub current contractと実稼働contractが同一かをrelease前に確認できない。

Required evidence:

```text
production deploy commit/image body-free identity
```

---

### PCE0-U006 — preview publish atomicity

```text
state:
  OPEN_FOR_PCE3_PCE7

confirmed source order:
  persist emotion input
  then publish Piece draft

unconfirmed:
  shared DB transaction
  idempotency key
  rollback / recovery when second step fails
```

Do not infer:

partial effectが実際に起きる、または起きないとは断定しない。

Required evidence:

```text
transaction owner / RPC / trigger / idempotency implementation
failure-path test or runtime evidence
```

---

### PCE0-U007 — owner deletion atomicity and retention

```text
state:
  OPEN_FOR_PCE3_PCE7

confirmed source order:
  delete Piece row
  delete related metrics / reads / resonance

unconfirmed:
  one transaction
  orphan cleanup
  retry policy
  audit/retention requirement
```

Required evidence:

```text
transaction / cascade / FK / trigger definitions
failure-path tests
account-delete interaction
```

---

### PCE0-U008 — quota concurrency and deletion semantics

```text
state:
  OPEN_FOR_PCE3

confirmed code:
  monthly count by owner + emotion_generated + published_at
  publish checks count before publication
  owner delete physically removes row

unconfirmed:
  concurrent publish race prevention
  trigger or lock
  whether deletion intentionally restores quota
  rejected/hidden/private rows future treatment
```

Required decision/evidence:

```text
current DB concurrency guard
Mash product decision for delete / private / re-export quota semantics
```

---

### PCE0-U009 — current data distribution

```text
state:
  OPEN_REQUIRED_BEFORE_MIGRATION_DESIGN

unconfirmed:
  record counts by source_type / status / is_active
  records with missing question/answer/content_json
  duplicate identity patterns
  old implicit Q&A shape variants
```

Why needed:

read adapter / default `format_type=qna` projectionの安全性を決めるため。

Required evidence:

body-free aggregate counts and schema-shape counts only。本文・ユーザー識別子は不要。

---

### PCE0-U010 — private Piece history owner

```text
state:
  OPEN_FOR_PCE3_PCE6

confirmed current:
  active public/follow read flow exists

unconfirmed:
  current reusable owner-only history endpoint / view
  whether inactive/rejected rows are intentionally retained for user history
```

Impact:

future public/private switchとowner historyのAPI / DB ownerが未決定。

---

### PCE0-U011 — per-Piece visibility feasibility in current table

```text
state:
  OPEN_FOR_PCE3_PCE6

confirmed current:
  no user-selectable visibility_scope field in current Piece contract

unconfirmed:
  additive column feasibility under current constraints / RLS
  whether new table is required
```

Required evidence:

U001-U004 resolution plus PCE-3 product lifecycle decision。

---

### PCE0-U012 — current image/export owner and actual-device quality

```text
state:
  OPEN_FOR_PCE5_PCE9E_PCE11

confirmed current:
  Piece image preview / export / re-export owner is absent

unconfirmed:
  RN / backend / hybrid best owner
  font rendering
  Japanese line-break fidelity
  iOS / Android save/share behavior
  4:5 / 9:16 actual quality
```

Required evidence:

code-side prototype followed by Mash actual-device review。PCE-0では質問・選定しない。

---

### PCE0-U013 — dedicated Piece rollout / kill switch

```text
state:
  OPEN_FOR_PCE7_PCE12

confirmed GitHub current:
  no dedicated Piece enable/disable flag in /app/bootstrap feature flags
  current Piece routes are registered normally

unconfirmed:
  infrastructure-level route switch outside GitHub source
```

Impact:

new visual Pieceだけを止め、current Q&Aへrollbackするrelease controlが必要。

---

### PCE0-U014 — full test inventory and current green state

```text
state:
  OPEN_FOR_PCE7

confirmed:
  representative Piece contract tests exist

PCE-0 execution:
  test execution exact0

unconfirmed:
  full Piece/Nexus test node inventory
  current full backend green
  RN contract green
  production smoke
```

Do not infer:

sourceにtestがあることを、current runtime greenへ変換しない。

---

## 3. Resolved product question

### PCE0-R001 — Is Q&A the Piece identity?

```text
state:
  RESOLVED_BY_MASH_20260807

answer:
  no

current decision:
  Q&A is one Piece format.
  Piece transforms the user's thoughts and values into text that can be communicated to others, then turns it into an image.
```

Effect:

- PCE-1でPiece identityをQ&Aへ固定しない。
- current implicit Q&A rowsをcompatibility / one-format recordsとして扱う。
- explicit version / format / image contractは別途PCE-1以降で設計する。

Non-effect:

- current sourceを変更しない。
- Q&A recordをhistorical-onlyへ下げない。
- existing recordsを一括migrationしない。
- image implementationを開始しない。

---

## 4. Exact Mash-side evidence request

PCE-0を再開して閉じるために必要なMash側作業は、現時点では一つのevidence packetである。

```text
CURRENT_SUPABASE_PIECE_SCHEMA_RLS_MIGRATION_BODY_FREE_PACKET
```

Minimum contents:

```text
A. mymodel_reflections
   columns / types / defaults / nullability
   check / unique / FK constraints
   indexes
   triggers
   RLS enabled state
   policies
   grants / owner identity

B. pieces and pieces_read
   existence
   view definitions
   owner
   security behavior

C. migration identity
   current migration head
   changes after 2026-04-26 relevant to Piece
   exact migration that permits emotion_generated, if present

D. body-free aggregates if easily available
   count by source_type / status / is_active
```

Do not include:

```text
API keys
JWTs
tokens
passwords
connection strings
user text
Piece body
email / phone / profile data
raw rows
```

このpacket取得方法の技術手順は、利用可能なSupabase画面・SQL Editor・CLIのどれを使うかに応じて別途案内する。PCE-0ではMashへ技術選択を丸投げせず、必要になった場合は華恋がbody-free queryを作る。

---

## 5. Ledger closure

```text
OPEN_BLOCKING_ITEMS: 4
RESOLVED_PRODUCT_ITEMS: 1
PCE0_CONFIRMED_INVENTORY: PRESERVED
PCE0_FORMAL_COMPLETION: FALSE
PCE1_ACTIVATED: FALSE
SOURCE_CHANGE_EXACT0
TEST_EXECUTION_EXACT0
RUNTIME_EXECUTION_EXACT0
GITHUB_WRITE_EXACT0
AUTOMATIC_PROGRESSION_FALSE
```
