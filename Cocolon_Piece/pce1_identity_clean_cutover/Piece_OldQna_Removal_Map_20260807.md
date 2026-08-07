---
doc_id: piece_old_qna_removal_map_20260807
title: "Piece old Q&A removal map"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-1 Piece Identity / Clean Cutover Decision"
document_status: "PCE1_COMPLETE_DESIGN_ONLY_REMOVAL_MAP"
source_cocolon_head: "3e558c4012c3049ca7d97f0b94d8d9a5cec24e1c"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
automatic_progression: false
destructive_execution: false
production_effect: "exact0"
---

# Piece old Q&A removal map

## 1. scope rule

Mashのproduct decisionにより、old Q&Aのdata、投稿画面、生成、renderer、互換route、old/new共存は保持不要である。

ただし、PCE-1は削除を実行しない。目的は、**new Piece complete後にold Q&Aだけを撤去し、shared ownerや別機能を巻き込まないexact map**を作ることである。

## 2. fixed deletion boundary

### confirmed old current Emotion Piece rows

```sql
public.mymodel_reflections
where source_type = 'emotion_generated'
```

このpredicateはcurrent Emotion->Piece writerに対応するold Q&A row setの第一ownerである。

### automatic deletionから除外

```text
source_type = create
source_type = generated
shared table全体
ProfileCreate source data
EmlisAI input / observation data
Analysis / Self Structure data
account / profile / subscription data
```

`create`と`generated`がQ&A surfaceで読まれることは確認済みだが、別owner・別用途を持つ可能性がある。PCE-6のfresh dependency mapなしにold Q&A cleanupへ含めない。

## 3. RN removal map

| current path | current Q&A responsibility | clean-cutover action | replacement / verification owner |
|---|---|---|---|
| `screens/InputScreen.js` | 未保存inputからQ&A previewを起動しpublish結果を処理 | old preview orchestrationを削除 | PCE-9C post-Emlis CTA + PCE-9D new preview |
| `screens/input/InputPiecePreviewController.js` | Q&A payload/controller | retire or replace as new Piece preview controller | PCE-9D |
| `components/EmotionPiecePreviewModal.js` | question/answer preview、publish/cancel | remove old component | new visual Piece preview component |
| `lib/api/home/emotionPieceApi.js` | old quota/preview/publish/cancel payload | replace request/response; old keysを保持しない | PCE-6 / PCE-9D |
| `lib/emotionPieceApi.js` | old adapter re-export | remove after imports move | PCE-9D |
| `lib/compat/legacyWireContracts.js` | old Piece route/metric aliases | Piece-specific compatibility keysをremove | PCE-6 / PCE-9F |
| `features/home/useHomeState.js` | old Piece quota/startup keys | rebind to new quota contract | PCE-3 / PCE-9D |
| `screens/NexusScreen.js` | Q&A-shaped feed consumption | replace with new Piece feed model | PCE-9F |
| `screens/nexus/NexusPieceCard.js` | owner/question/answer Q&A card | remove old renderer | new visual Piece card |
| `lib/nexusApi.js` | old Q&A/Nexus response adapter | replace with new Piece payload | PCE-6 / PCE-9F |
| `tests/rn-screen-contracts.test.js` | old screen/wire guards | replace assertions; old flow must be absent | PCE-7 / PCE-9D/F |

## 4. backend removal / replacement map

| current path | current responsibility | action | preserve boundary |
|---|---|---|---|
| `api_emotion_piece.py` | Q&A preview/publish models and routes | neutral `/emotion/piece` namespace may be reused, but models/semantics are replaced atomically; old contract removed | no `question`, `reflection_text`, old preview payload compatibility |
| `api_emotion_reflection.py` | legacy import façade | delete after registration/import search exact0 | none |
| `api_piece_compat.py` | `/emotion/reflection/*`, `/nexus/reflections/*`, `/mymodel/qna/*` aliases | remove Piece/Q&A compat routes | non-Piece compat in other owners unaffected |
| `emotion_piece_generation_service.py` | deterministic Q&A generation | retire | new format/content owner PCE-4/9B |
| `emotion_piece_store.py` | `emotion_generated` draft/ready/rejected in shared table | retire after new storage cutover | `piece_generation_store.py` non-old-Piece consumers unaffected until audited |
| `emotion_reflection_store.py` | compatibility re-export | remove | none |
| `piece_generated_display.py` | Q&A/reflection public display | split reusable generic normalization only if proven; retire Q&A contract | no automatic carry-over |
| `piece_generation_policy.py` | `piece.core.v1`, old visibility/safety/hash | replace with `piece.record.v2` policy owner | reusable pure safety function may be extracted only by explicit test |
| `piece_text_formatter.py` | Q&A/reflection formatting | remove from new Piece path | ProfileCreate/other consumer audit required before file deletion |
| `home_gateway/emotion_reflection_publish_service.py` | input persistence + old draft publish coupling | replace with saved-input post-Emlis Piece service | `emotion_submit_service.py` remains input owner |
| `home_gateway/emotion_submit_service.py` | shared input persistence | preserve | new Piece references saved input; does not re-own persistence |
| `piece_publish_entitlements.py` | 5/30/unlimited plan values | preserve plan values, replace count point semantics | PCE-3 |
| `piece_generated_access.py` | `emotion_generated` row lookup, `reflection:` id | retire from new path | new Piece access owner |
| `piece_public_read_service.py` | Q&A body/list/detail/read/resonance/delete | replace | PCE-3/PCE-6/PCE-9F |
| `piece_public_read_store.py` | old Q&A metrics/read/resonance storage | replace or split | account/follow/profile helpers may remain shared |
| `api_nexus.py` | Q&A-shaped `/nexus/pieces` models | neutral route may be reused; response contract replaced | emotion ranking/log/recommend sections preserved |
| `api_piece_runtime.py` | MyModel/ProfileCreate/generated Q&A runtime | remove Piece-facing Q&A routes after dependency split | ProfileCreate source owners and unrelated data preserved |
| `api_mymodel_qna.py` | legacy façade | remove | none |
| `core_contract_registry.py` | old Piece owner route/storage/read surface | update to `piece.record.v2` owners | Emlis/Analysis entries unchanged |
| `api_contract_registry.py` / `PUBLIC_API_REGISTRY.md` | old route contracts | replace registry entries | no old response compatibility |
| `app.py` | route registration | remove old Q&A/compat registrations and register new owner | unrelated route registration unchanged |

## 5. route disposition

### neutral namespaces that may be reused without compatibility

```text
/emotion/piece/*
/nexus/pieces*
```

Reuse means **new request/response contractへ置換する**ことであり、old client supportではない。

### removal candidates

```text
/emotion/reflection/*
/nexus/reflections*
/mymodel/qna/*
old /piece/* Q&A runtime endpoints unless explicitly reused by the new contract
```

PCE-6はcurrent route registrationとRN callerをfresh scanし、old route caller exact0を成立させる。

## 6. DB / related state map

| object / family | action | exact safety boundary |
|---|---|---|
| `public.mymodel_reflections` rows `source_type='emotion_generated'` | delete after new cutover verification | pre-delete count + exact IDs + post-delete exact0 |
| `public.mymodel_reflections` other rows | preserve | no blanket delete/drop |
| `public.pieces` current view | replace definition to project `piece_records` | new view verified before old writer removal |
| source_type constraint | remove `emotion_generated` only after old writer/data exact0 | keep `create/generated` unless separate owner decision |
| `mymodel_qna_metrics` / `piece_metrics` | delete old instance state or replace schema | derive old `q_instance_id` set from deleted IDs |
| `mymodel_qna_reads` / `piece_reads` | same | no owner-wide blanket delete without key proof |
| `mymodel_qna_resonances` | same | delete only old Piece instance references |
| `mymodel_qna_view_logs` | same | body-free pre/post counts |
| `mymodel_qna_resonance_logs` | same | body-free pre/post counts |
| `mymodel_qna_echoes` / discovery logs | dependency audit first | account/summary/material consumers may exist |
| old Piece-specific indexes/views/RPC | drop only after consumer exact0 | tracked migration + rollback |

old instance identity candidates:

```text
row.id
row.public_id = 'reflection:' || row.id
q_instance_id values matching the old public id / generated lookup forms
```

PCE-6 must inspect exact columns/FKs before producing DELETE statements.

## 7. clean cutover sequence

```text
C1  freeze piece.record.v2 + source/lifecycle/content/visual contracts
C2  create tracked application migration baseline
C3  create new piece_records / views / RLS / indexes disabled from users
C4  implement new backend + RN + Nexus + export behind new feature gates
C5  verify new flow, privacy, quota, delete, re-export, monitoring
C6  make old Q&A entry/generation unreachable
C7  verify old route/caller/renderer residual exact0
C8  capture old Q&A row IDs and related-state body-free counts
C9  delete exact old Q&A rows and related state
C10 remove old code, aliases, constraints, views/indexes that have consumer exact0
C11 final cross-repo audit + actual device + release acceptance
```

No user-visible dual-run is created. C3-C5 are pre-release implementation staging, not product coexistence.

## 8. STOP conditions

- new Piece is not complete/verified but destructive old removal is required.
- `emotion_generated`以外を削除しないと成立しないがownerを証明できない。
- related-state key mappingが不明。
- ProfileCreate、Analysis、EmlisAI、account、ranking、notification等の別ownerへ影響する。
- old route caller exact0を証明できない。
- rollbackがold Q&A復活に依存する。
- tracked application migration baselineがない。

## 9. non-effects

```text
code deletion: exact0
route change: exact0
DB DELETE / DROP / migration: exact0
RN change: exact0
runtime/test execution: exact0
PCE1_COMPLETE_DESIGN_ONLY
```
