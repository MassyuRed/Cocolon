---
doc_id: piece_new_record_contract_matrix_20260807
title: "Piece new record contract matrix"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-1 Piece Identity / Clean Cutover Decision"
document_status: "PCE1_COMPLETE_DESIGN_ONLY"
record_contract_id: "piece.record.v2"
source_cocolon_head: "3e558c4012c3049ca7d97f0b94d8d9a5cec24e1c"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
automatic_progression: false
production_effect: "exact0"
---

# Piece new record contract matrix

## 1. contract header

```text
logical entity:
  PieceRecord

contract id:
  piece.record.v2

physical target direction:
  public.piece_records

read projection after cutover:
  public.pieces

public id:
  piece:<uuid>

old Q&A row migration:
  exact0
```

`public.piece_records`はPCE-1で固定するdedicated-owner directionである。PCE-6がexact DDL、RLS、index、view、migration baseline、rollbackを完成させるまでproduction objectは作らない。

## 2. required field matrix

| field | required | logical type | invariant / meaning | finalizer |
|---|---:|---|---|---|
| `id` | yes | UUID | immutable record identity | PCE-6 |
| `public_id` | yes | text | `piece:<id>`。旧`reflection:` namespaceを使わない | PCE-6 |
| `owner_user_id` | yes | UUID | owner immutable after create | PCE-6 |
| `piece_contract_version` | yes | text | exact `piece.record.v2` | PCE-1 |
| `source_input_id` | yes | UUID/text identity | 保存済みinputのcurrent identity。raw payloadだけの生成を認めない | PCE-2 |
| `source_input_version` | yes | text/int | source schema version | PCE-2 |
| `source_lineage` | yes | JSON object | original / supplemental role、Emlis stage、body-free commitments | PCE-2 |
| `format_type` | yes | text | Q&A以外。allowed setはPCE-4でfreeze | PCE-4 |
| `content_payload` | yes | JSON object | format-specific normalized structure。hidden bodyを入れない | PCE-4 |
| `piece_text` | yes | text | preview / saved / exportの唯一のcanonical visible body | PCE-1 / PCE-4 |
| `piece_text_hash` | yes | SHA-256 identity | UTF-8 canonical `piece_text` commitment | PCE-1 / PCE-4 |
| `visual_recipe` | yes | JSON object | template/theme/font/ratio等。画像binaryではない | PCE-5 |
| `visual_recipe_hash` | yes | SHA-256 identity | canonical visual recipe commitment | PCE-5 |
| `lifecycle_status` | yes | text | record lifecycle。visibilityと混ぜない | PCE-3 |
| `visibility_scope` | yes | text | owner-only / accessible public等。statusと混ぜない | PCE-3 |
| `export_contract_version` | yes | text | export interface version | PCE-5 |
| `renderer_version` | yes | text | same-record再現owner | PCE-5 |
| `created_at` | yes | timestamptz | record creation | PCE-6 |
| `updated_at` | yes | timestamptz | mutable metadata update | PCE-6 |
| `published_at` | conditional | timestamptz | public visibility成立時。private saveではnull可 | PCE-3 / PCE-6 |
| `deleted_at` | conditional | timestamptz | logical deleteを採る場合のみ | PCE-3 / PCE-6 |

## 3. explicitly absent Q&A fields

new Piece core recordには次を置かない。

```text
question
answer
q_key
topic_key
question_id
reflection_text
answer_display_state
emotion_reflection.v1
piece.core.v1 as the record contract
```

format固有の見出しが必要な場合は、PCE-4で`content_payload`内のversioned fieldとして定義する。Q&A互換のためにtop-level `question / answer`を残さない。

## 4. source lineage minimum shape

PCE-2でexact schemaをfreezeするが、PCE-1時点のminimum responsibilityは次である。

```json
{
  "source_input_id": "...",
  "source_input_version": "...",
  "source_input_bundle_commitment": "sha256:...",
  "emlis_observation_stage": "normal|pre_question|refined",
  "emlis_observation_result_identity": "...",
  "source_roles": ["original_input", "supplemental_answer?"],
  "piece_generation_eligibility": true
}
```

禁止:

```text
Emlis visible comment_textのcopy
Emlis internal AST / candidate body
Analysis inference
raw credential / profile / contact data
source identityなしの成功record
supplemental answerによるoriginal input上書き
```

## 5. canonical equality contract

```text
preview_piece_text
  == saved PieceRecord.piece_text
  == export renderer input piece_text

preview_piece_text_hash
  == saved piece_text_hash
  == export request piece_text_hash
```

publish / saveで本文を再生成しない。visual変更は`visual_recipe`を更新する別operationであり、本文変更を伴う場合はsame recordの単純re-exportとして扱わない。

## 6. identity layers

| layer | identity |
|---|---|
| record | `id`, `public_id`, `piece_contract_version` |
| source | `source_input_id`, `source_input_version`, source bundle commitment |
| content | `format_type`, `content_payload`, `piece_text_hash` |
| visual | `visual_recipe_hash`, `renderer_version` |
| export | `export_contract_version` + content/visual identities |
| access | `owner_user_id`, `lifecycle_status`, `visibility_scope` |

## 7. physical owner decision

### accepted direction

```text
new write table:
  public.piece_records

new read projection:
  public.pieces

old write table:
  public.mymodel_reflections
  -> no new Piece writes after cutover
```

### rejected direction

```text
mymodel_reflectionsへnew Pieceを保存し、
question / answerにplaceholderを入れる:
  REJECTED

old Q&A rowをpiece.record.v2へmass migrationする:
  REJECTED

old and new recordを一つのversion-aware rendererで永続共存させる:
  REJECTED
```

## 8. phase ownership matrix

| decision | PCE-1 result | later work |
|---|---|---|
| record identity | fixed | none |
| dedicated owner | fixed direction | PCE-6 DDL |
| source identity fields | required | PCE-2 exact schema |
| lifecycle / visibility fields | separate and required | PCE-3 enum/state machine |
| active formats | Q&A excluded | PCE-4 allowed set |
| visual recipe required | yes | PCE-5 schema |
| API / RN shape | no old compatibility | PCE-6 exact contract |
| old data migration | none | PCE-6 deletion/cleanup only |

## 9. closure

```text
PIECE_RECORD_CONTRACT_ID_PIECE_RECORD_V2
DEDICATED_TABLE_DIRECTION_PUBLIC_PIECE_RECORDS
PUBLIC_READ_PROJECTION_PUBLIC_PIECES
QNA_TOP_LEVEL_FIELDS_EXACT0
OLD_QNA_MIGRATION_EXACT0
SOURCE_LINEAGE_REQUIRED
STATUS_VISIBILITY_SEPARATED
CANONICAL_PIECE_TEXT_FIXED
VISUAL_RECIPE_REQUIRED
PCE1_COMPLETE_DESIGN_ONLY
```
