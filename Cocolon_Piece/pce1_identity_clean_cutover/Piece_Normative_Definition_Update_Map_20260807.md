---
doc_id: piece_normative_definition_update_map_20260807
title: "Piece normative definition update map"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-1 Piece Identity / Clean Cutover Decision"
document_status: "PCE1_COMPLETE_DESIGN_ONLY_UPDATE_MAP"
source_cocolon_head: "3e558c4012c3049ca7d97f0b94d8d9a5cec24e1c"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
automatic_progression: false
production_effect: "exact0"
---

# Piece normative definition update map

## 1. current precedence

Pieceについて互換・Q&A保持に関する記述が競合する場合、current precedenceを次で固定する。

```text
1. Mash 2026-08-07 clean-cutover product decision
2. PCE-1 completion artifacts in Cocolon_Piece/pce1_identity_clean_cutover/
3. clean-cutover revised roadmap
4. PCE-0 current actual / catalog evidence
5. earlier additive/compatibility roadmap and historical premise text
```

old roadmapやPCE-0文書に残る「Q&Aを現役formatとして保持」「adapterでexisting recordを読む」はhistorical premiseであり、current directionではない。

## 2. current normative owner after PCE-1

```text
Piece entry:
  Cocolon_Piece/00_read_first.md

Piece manifest:
  Cocolon_Piece/manifest.json

PCE-1 identity:
  Piece_Identity_CleanCutover_Decision_20260807.md

new record contract:
  Piece_New_Record_Contract_Matrix_20260807.md

old removal boundary:
  Piece_OldQna_Removal_Map_20260807.md

roadmap:
  Cocolon_Piece/roadmap/Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807_CleanCutover_Revised/
README.md
bundle.json
Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807_CleanCutover_Revised.md.gz.b64
```

## 3. update-now owners

PCE-1 publicationで次をcurrentへ更新する。

| path | update |
|---|---|
| `Cocolon_Piece/00_read_first.md` | PCE-1 complete、PCE-2 not activated、record v2 / dedicated owner / no Q&A compatibility |
| `Cocolon_Piece/manifest.json` | PCE-1 artifact identities、current roadmap、phase state |
| `Cocolon_前提資料/15D_cocolon_piece_workstream_pce1_design_closure_20260807.md` | premise current pointer |
| `Cocolon_前提資料/07G_piece_pce1_design_closure_checkpoint_20260807.md` | publication checkpoint |

## 4. current documentation requiring later normative correction

| path / family | stale or incomplete position | correction owner / timing |
|---|---|---|
| `Cocolon_前提資料/work_attitude_rules_for_karen/CURRENT_RULES.md` | Q&AをPieceの一形式として扱うsummary | product-rule correction before PCE-2 output publication |
| `work_attitude_rules_for_karen/11_cocolon_area_specific_do_not_break.txt` | old Q&A non-break boundaryが残る可能性 | same correction; new Piece identityへ置換 |
| `Cocolon_前提資料/01B_cocolon_overall_structure_analysis_piece_emotionlog_ranking.md` | Pieceを他者へ伝わる一問一答として記述 | PCE-6 design publicationでactual owner mapごと更新 |
| `Cocolon_前提資料/02A_cocolon_national_system_input_save_dispatch.md` | InputScreen old preview/publish flow | PCE-6 / PCE-9D implementation result |
| `Cocolon_前提資料/02B_cocolon_national_system_snapshot_worker_publish_read.md` | Piece Composer / Q&A publish/read owner | PCE-4/PCE-6/PCE-9B/F |
| `Cocolon_前提資料/03_cocolon_naming_system.md` | old reflection/Q&A naming・UI path | PCE-6 naming and route freeze |
| `Cocolon_前提資料/05_cocolon_rule_file_index.md` | old Piece contract/test references | relevant contract replacement時 |
| `Cocolon_前提資料/cocolon_thought_material_for_karen.md` | Pieceの一問一答定義 | product premise correction |
| original Piece roadmap parts | additive compatibility assumptions | historical only; rewriteしない |
| PCE-0 inventory/owner map | current old implementation description | historical actual; rewriteしない |

上記のactual mutationは本PCE-1 design-only authorityへ含めない。PCE-1 artifactsをcurrent override ownerとして先に固定する。

## 5. backend normative/code update map

| path | required future update |
|---|---|
| `core_contract_registry.py` | `core.piece.v1` old route/storage/read surfaceを`piece.record.v2` ownersへ置換 |
| `api_contract_registry.py` | old request/response keys、legacy route contractをremove |
| `ai/docs/PUBLIC_API_REGISTRY.md` | new Piece API / Nexus contractをpublish |
| `api_emotion_piece.py` | Q&A modelsからnew Piece modelsへreplace |
| `api_piece_compat.py` | Piece/Q&A compatibility routes remove |
| `api_nexus.py` | Q&A response modelsからnew visual Piece modelへreplace |
| `api_piece_runtime.py` / `api_mymodel_qna.py` | old Q&A runtime surfaceをremove/split |
| `piece_generation_policy.py` | old `piece.core.v1`からnew policy contractへreplace |
| Piece contract tests | old Q&A non-regressionからold-flow-absent + new invariantsへreplace |

## 6. RN normative/code update map

| path | required future update |
|---|---|
| `lib/compat/legacyWireContracts.js` | old Piece aliases / metrics compatibilityをremove |
| `lib/api/home/emotionPieceApi.js` | request/response contract replace |
| `screens/InputScreen.js` | post-Emlis saved-input CTAへreplace |
| `InputPiecePreviewController.js` | new preview state ownerへreplace |
| `EmotionPiecePreviewModal.js` | new visual previewへreplace |
| `NexusScreen.js` / `NexusPieceCard.js` | new record rendererへreplace |
| `lib/nexusApi.js` | new feed/detail payloadへreplace |
| RN tests | old Q&A flow absent + new flow contractへreplace |

## 7. wording rules after PCE-1

Use:

```text
Pieceは、ユーザーの考えや価値観を他者へ伝える文章に整形し、画像化する機能。
new Piece recordはpiece.record.v2。
Q&Aはpre-release legacy specificationであり、new active formatではない。
clean cutover後のcurrent ownerはdedicated Piece record family。
```

Do not use as current:

```text
Q&AはPieceの一形式として残る。
旧recordをadapterで永続表示する。
old/new rendererを共存させる。
rollbackはcurrent Q&Aへ戻す。
mymodel_reflectionsをnew Pieceのcanonical write ownerにする。
```

## 8. closure

```text
NORMATIVE_CURRENT_OWNER_FIXED
STALE_QNA_DEFINITION_PATHS_MAPPED
HISTORICAL_ARTIFACTS_PRESERVED
GLOBAL_RULE_AND_STRUCTURE_CORRECTIONS_NOT_EXECUTED
CODE_CONTRACT_UPDATES_NOT_EXECUTED
PCE1_COMPLETE_DESIGN_ONLY
PCE2_NOT_ACTIVATED
```
