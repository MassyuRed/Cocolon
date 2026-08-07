---
doc_id: piece_current_owner_map_20260807
title: "Piece Current Owner Map"
created_at: "2026-08-07 JST"
created_by: "Karen"
decision_owner: "Mash"
phase: "PCE-0 Current Contract Pin"
document_type: "Markdown read-only current owner map"
document_status: "CONFIRMED_OWNER_MAP_WITH_DB_IDENTITY_STOP"
automatic_progression: false
current_cocolon_head: "f8ecb44305313497b1eed06a7e5fbfe6151e2b8d"
current_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
---

# Piece Current Owner Map

## 0. Reading rule

- `current owner`は、GitHub current sourceでprimary responsibilityを持つfileである。
- `compatibility owner`は、旧名・旧route・旧responseをcurrent ownerへ接続するactive fileである。
- `historical DB evidence`はcurrent production DDLの代用品ではない。
- blobを個別取得できたfileだけblobを記載する。current head配下で確認したが個別blobを別取得していないfileは`head-pinned`とする。
- このmapはwrite authorityではない。

---

## 1. Repository identity

| Repository | Head | Tree | State |
|---|---|---|---|
| `MassyuRed/Cocolon` | `f8ecb44305313497b1eed06a7e5fbfe6151e2b8d` | `d74be7c0498ca1ec157618b60f615639ec630de6` | current |
| `MassyuRed/mashos-api` | `315813c7bd3372462de926ddad74df567254a6b5` | `a641510e107d52bb910073f36604c85bd57af150` | current |

---

## 2. RN write and preview owners

| Layer | Path | Current role | Identity | Compatibility / consumer | PCE-1 impact |
|---|---|---|---|---|---|
| input shell | `Cocolon/screens/InputScreen.js` | current unsaved emotion inputをPiece preview payloadへ変換し、preview / publish後のUI stateを処理 | blob `d26d91c3cc938ecd7feb541265bd5e4294cbae4c` | Emlis input feedback modal、Home refresh、Analysis dirty signal | post-Emlis flowではsaved input identity adapterが必要 |
| preview controller | `Cocolon/screens/input/InputPiecePreviewController.js` | preview payloadとquotaをmodalへ渡す | blob `1935df242627b646c004849ce3b7dd8b6a5cbea2` | `EmotionPiecePreviewModal` | new format-aware preview controllerへ拡張候補 |
| preview UI | `Cocolon/components/EmotionPiecePreviewModal.js` | fixed Q&A preview、quota、publish / cancel | blob `46c6d88d746f8c03566f552024e0d6606dc7de45` | question / answer labels | current Q&A rendererとして保持し、new image previewと分離 |
| API adapter | `Cocolon/lib/api/home/emotionPieceApi.js` | quota / preview / publish / cancel client | blob `2254c2c1feb3fd152c86d26f7e386649a20830d7` | `PIECE_WIRE` | old routeをcompat ownerとして維持する可能性 |
| wire owner | `Cocolon/lib/compat/legacyWireContracts.js` | current Piece routeとlegacy aliasesを集約 | head-pinned | source type、public id prefix、old metric aliases | route / field retirementを別判断にする |
| Home state | `Cocolon/features/home/useHomeState.js` | Piece quotaをHome stateへ読み込む | head-pinned | `/emotion/piece/quota` | new visibility / format countをHomeへどう出すか |

---

## 3. Backend write owners

| Layer | Path | Current role | Identity | Compatibility / delegate | PCE-1 / PCE-2 impact |
|---|---|---|---|---|---|
| current route | `mashos-api/ai/services/ai_inference/api_emotion_piece.py` | `/emotion/piece/quota|preview|publish|cancel` owner | blob `e814c58b8828699ed1e745f1b72fe363cab4fca0` | publishはHome command gatewayへ委譲 | new Piece routeをadditiveにするか、current routeをversion-awareにするか |
| legacy module | `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` | `api_emotion_piece` re-export | head-pinned | old import path | active compatibility owner。即削除不可 |
| generation | `mashos-api/ai/services/ai_inference/emotion_piece_generation_service.py` | current-input-only deterministic Q&A generation | head-pinned | display / policy / value observation / Piece composer | Q&Aをformat ownerの一実装へ下げる |
| display | `mashos-api/ai/services/ai_inference/piece_generated_display.py` | public Q&A display、normalization、display hash | head-pinned | `piece_text_formatter` | export-safe Piece text ownerとの境界を決める |
| policy | `mashos-api/ai/services/ai_inference/piece_generation_policy.py` | visibility / generation / transform / safety / hash meta | head-pinned | `piece.core.v1` | new Piece contract versionとの関係を決める |
| draft store | `mashos-api/ai/services/ai_inference/emotion_piece_store.py` | `mymodel_reflections` draft / publish / cancel / monthly count | blob `ab61730c1cc4d88e25fc2bc28beb64487be95e6c` | old physical table family | DB actual未確認がPCE-0 STOP blocker |
| legacy store module | `mashos-api/ai/services/ai_inference/emotion_reflection_store.py` | `emotion_piece_store` re-export | head-pinned | old import path | immediate retirement不可 |
| publish orchestration | `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py` | quota、input persistence、draft publish、Emlis feedback | blob `d6b1a438180187832bad3c3d5e3eb27854687421` | command gateway / legacy emotion submit owner | PCE-2 / PCE-9Cでpost-Emlis adapter分離が必要 |
| input persistence adapter | `mashos-api/ai/services/ai_inference/home_gateway/emotion_submit_service.py` | legacy emotion submit serviceへ委譲 | blob `84bd25d9e302bcecefaa7c6e0508aa1e25645575` | old service owner | Pieceがinput persistenceを再所有しない境界 |
| entitlement | `mashos-api/ai/services/ai_inference/piece_publish_entitlements.py` | Free 5 / Plus 30 / Premium unlimited、JST month | blob `743cb30b746cd24d70b98b3c208d0885b5c163e8` | subscription store | format/private/exportを何に数えるかPCE-3で判断 |
| core registry | `mashos-api/ai/services/ai_inference/core_contract_registry.py` | Piece core input/output/storage/safety/read modes | head-pinned | compat mymodel-qna reader | Mashの上位Piece定義へnormative updateが必要 |
| app registration | `mashos-api/ai/services/ai_inference/app.py` | Piece / Nexus / compat runtime route登録 | head-pinned | dedicated Piece flagなし | additive rollout / rollback owner設計が必要 |

---

## 4. Storage and lifecycle owners

| Concern | Current owner | Confirmed contract | Unconfirmed boundary |
|---|---|---|---|
| physical row | `emotion_piece_store.py` | `mymodel_reflections` | current production DDL / constraints |
| source identity | `emotion_piece_store.py` | `emotion_generated` | historical audited check constraintとの差分migration |
| content version | `emotion_piece_store.py` | `emotion_reflection.v1` | future Piece contract versionとのmapping |
| core meta | `piece_generation_policy.py` | `piece.core.v1` | visual / export contractとのversion composition |
| draft | `emotion_piece_store.py` | `draft / inactive` | DB trigger / policy |
| publish | `emotion_piece_store.py` | same row -> `ready / active` | transaction / trigger / concurrent publish |
| cancel | `emotion_piece_store.py` | `rejected / inactive` | retention / cleanup policy |
| owner delete | `piece_public_read_store.py` | physical row delete | multi-table atomicity |
| related-state delete | `piece_public_read_store.py` | metrics / reads / resonance delete | failure rollback / orphan cleanup |
| monthly quota count | `emotion_piece_store.py` + entitlement | owner/source/published_at | delete semantics / concurrency / trigger |

---

## 5. Public read and Nexus owners

| Layer | Path | Current role | Identity | Compatibility | PCE-1 / PCE-3 impact |
|---|---|---|---|---|---|
| generated access | `mashos-api/ai/services/ai_inference/piece_generated_access.py` | generated row lookup、public id、owner/profile access | blob `57e1cd299d3223d652bac3d26041d70e453f2cc2` | `reflection:` public id | old/new record lookup strategy |
| public read service | `mashos-api/ai/services/ai_inference/piece_public_read_service.py` | Nexus/list/detail/read/resonance/delete payload | head-pinned | generated Q&A compatibility | format-aware projection / per-Piece visibility |
| public read store | `mashos-api/ai/services/ai_inference/piece_public_read_store.py` | physical reads、profiles、follow、metrics、read、resonance、delete | head-pinned | old physical tables | RLS / service role / atomicity actualが必要 |
| Nexus route | `mashos-api/ai/services/ai_inference/api_nexus.py` | `/nexus/reflections` family | head-pinned | old `reflections` naming | new Piece feedをadditiveにするか既存routeを拡張するか |
| compat runtime | `mashos-api/ai/services/ai_inference/api_piece_runtime.py` | older generated reflection / qna runtime | head-pinned | old MyModel Q&A routes | retirementは発売安定後の別判断 |
| compat module | `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` | `api_piece_runtime` re-export | head-pinned | old import path | active compatibility owner |
| RN Nexus shell | `Cocolon/screens/NexusScreen.js` | self/follow feed、filter、sort、unread、resonance、delete | head-pinned | old/new API aliases | version-aware feed consumption |
| RN Q&A card | `Cocolon/screens/nexus/NexusPieceCard.js` | owner / question / answer / metrics / delete | blob `9119e11c99aa3c749ee6cec88e880e83f4683a32` | implicit qna renderer | old implicit-qna / new qna / new non-qna renderer分離 |
| RN API | `Cocolon/lib/nexusApi.js` | Nexus list/unread/detail/resonance/delete | head-pinned | `/nexus/reflections` | route stability boundary |

---

## 6. DB / view / RLS / migration evidence owners

| Evidence | Path / source | What it establishes | Current status |
|---|---|---|---|
| DB rename boundary | `Cocolon_前提資料/08_cocolon_db_rename_boundary.md` | 2026-04-26 actual audit、physical table、view candidates、constraints、policy inventory | historical actual; not current DDL |
| structure addendum | `mashos-api/ai/docs/COCOLON_STRUCTURE_UNIFICATION_ADDENDUM_2026_04_21.md` | physical `mymodel_reflections`、compat view / legacy writer preservation | design/contract evidence |
| current code constants | `emotion_piece_store.py`, `piece_public_read_store.py` | current code writes/reads physical family | current source evidence |
| production Supabase | not supplied in this PCE-0 packet | current DDL / RLS / migration / grants / triggers | missing; PCE-0 STOP |

### Current naming conflict requiring actual DB evidence

```text
premise audit candidate:
  pieces

structure addendum candidate:
  pieces_read

current backend read/write:
  mymodel_reflections
```

これらをalias relationとして推測せず、current catalog exportで確認する。

---

## 7. Test owners

| Path | Contract role | PCE-0 execution |
|---|---|---|
| `mashos-api/ai/tests/contract/test_new_national_core_piece_contracts.py` | Piece core registry、response meta、safety、low-info、preview/publish hash | read-only source inspection; not run |
| `mashos-api/ai/tests/contract/test_mymodel_reflection_display_contracts.py` | legacy/generated display compatibility | read-only source inspection; not run |
| `Cocolon/tests/rn-screen-contracts.test.js` | RN screen connection guard | path confirmed; not run |
| additional Piece/Nexus tests | current tree contains related tests | complete test execution inventory not claimed |

```text
test execution: exact0
```

---

## 8. Owner graph summary

```text
InputScreen
  -> emotionPieceApi / PIECE_WIRE
  -> api_emotion_piece
  -> emotion_piece_generation_service
  -> piece_generated_display
  -> piece_generation_policy
  -> emotion_piece_store (draft)

publish preview_id
  -> api_emotion_piece
  -> home command gateway
  -> emotion_reflection_publish_service
  -> emotion_submit_service (input persist)
  -> emotion_piece_store (same-row publish)
  -> Emlis public feedback

published row
  -> piece_generated_access
  -> piece_public_read_service
  -> api_nexus / api_piece_runtime compatibility
  -> NexusScreen
  -> NexusPieceCard
```

---

## 9. PCE-0 owner conclusion

### Current owner競合

GitHub source上、write / read / public accessのprimary ownerは追跡できた。旧moduleはprimary ownerと競合する別実装ではなく、current ownerへのcompatibility wrapperである。

### Remaining blocker

DB physical nameはcurrent codeから`mymodel_reflections`と確認できるが、current productionのconstraint / RLS / migration / view identityは確定できない。このため、source owner mapは完成したが、DB authority mapはSTOP状態である。

```text
SOURCE_OWNER_MAP: COMPLETE_FOR_GITHUB_CURRENT
DB_OWNER_MAP: STOPPED_AT_PRODUCTION_ACTUAL
PCE0_FORMAL_COMPLETION: FALSE
```

---

## 10. Exact zero effects

```text
source changes: 0
DB changes: 0
API changes: 0
RN changes: 0
tests run: 0
runtime runs: 0
GitHub writes: 0
commits: 0
automatic progression: false
```
