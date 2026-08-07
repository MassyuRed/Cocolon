---
doc_id: piece_identity_clean_cutover_decision_20260807
title: "Piece identity / clean cutover decision"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-1 Piece Identity / Clean Cutover Decision"
document_status: "PCE1_COMPLETE_DESIGN_ONLY"
source_cocolon_head: "3e558c4012c3049ca7d97f0b94d8d9a5cec24e1c"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_roadmap_sha256: "2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939"
automatic_progression: false
production_effect: "exact0"
---

# Piece identity / clean cutover decision

## 1. 結論

```text
user-facing name:
  Piece

record contract identity:
  piece.record.v2

public identity:
  piece:<uuid>

Q&A:
  pre-release legacy specification
  not a new Piece format
  preservation / migration / compatibility display not required

cutover model:
  clean replacement
  user-visible old/new dual-run exact0
```

Pieceは、**保存済みのユーザー入力を起点に、その考えや価値観を他者へ伝わる正準文章へ整形し、再現可能なvisual recipeによって画像化できる、ユーザー所有の表現artifact**である。

## 2. Piece identityに含むもの

1. 保存済みinputへのsource lineage。
2. 他者へ見せる唯一の正準本文`piece_text`。
3. 本文の同一性`piece_text_hash`。
4. 表現形式`format_type`。
5. 画像化を再現する`visual_recipe`とそのidentity。
6. owner、lifecycle、visibilityの独立した軸。
7. preview / saved record / exportを同じrecord identityへ結ぶversion契約。

## 3. Piece identityではないもの

```text
Q&Aのquestion / answer pair
raw inputそのもの
Emlis visible comment_text
Emlis internal obligation / AST / candidate body
Analysis inference / simulated route
export済み画像fileそのもの
public / privateというvisibility state
Nexus card component
```

画像fileはexport結果であり、Piece recordの正本ではない。Pieceの正本は、canonical text、source lineage、visual recipe、version identityを持つrecordである。

## 4. product / contract decisions

| ID | decision | current result |
|---|---|---|
| PCE1-D001 | user-facing名称 | `Piece`を維持 |
| PCE1-D002 | record contract | `piece.record.v2` |
| PCE1-D003 | public ID | `piece:<uuid>`。旧`reflection:<uuid>`を継承しない |
| PCE1-D004 | Q&A | new active format exact0 |
| PCE1-D005 | old record migration | exact0 |
| PCE1-D006 | compatibility renderer | exact0 |
| PCE1-D007 | old/new user-visible coexistence | exact0 |
| PCE1-D008 | canonical visible body | `piece_text` |
| PCE1-D009 | physical owner direction | dedicated `public.piece_records` table family |
| PCE1-D010 | current read name | cutover時に`public.pieces`をnew record projectionへrebind |
| PCE1-D011 | image storage | image binaryをrecord正本にしない |
| PCE1-D012 | destructive execution | PCE-1ではexact0。PCE-6 design + separate implementation approvalが必要 |

## 5. dedicated record ownerを選ぶ理由

PCE-0 actualでは、current `public.mymodel_reflections`は`question`と`answer`をNOT NULLかつnonemptyで要求し、`create / generated / emotion_generated`を共有する。

new PieceはQ&Aをidentityへ持たないため、current tableを拡張して`question / answer`へ仮値を入れる設計は採用しない。これはclean cutoverではなく、旧構造を内部へ残す偽装になる。

```text
target logical owner:
  PieceRecord

first physical candidate fixed by PCE-1:
  public.piece_records

current shared table:
  public.mymodel_reflections
  -> new Pieceのwrite ownerにはしない
  -> non-Piece dataを保護したままold Q&A scopeだけ後続で撤去
```

PCE-6は、この方向をcurrent catalogへbindしたDDL、index、RLS、view、rollbackへ落とす。table名を変更する必要が生じた場合は、同じdedicated-owner原則を保持した別明示判断が必要である。

## 6. downstream ownership

| boundary | finalizer phase | PCE-1 fixed input |
|---|---|---|
| source lineage / Emlis stage | PCE-2 | saved input必須、Emlis body copy禁止 |
| lifecycle / visibility / quota | PCE-3 | statusとvisibilityを別fieldにする |
| format / content / safety | PCE-4 | Q&Aをactive candidateにしない、`piece_text`がcanonical |
| visual recipe / export | PCE-5 | image fileではなくrecipeとversionが正本 |
| DB / API / RN / migration | PCE-6 | dedicated record owner、clean replacement |
| tests / rollback | PCE-7 | old Q&A flow残存をrelease blockerにする |

## 7. cutover invariant

```text
new Pieceの生成・保存・表示・exportがcompleteかつverifiedになる前に、
old Q&Aをproductionから破壊的に削除しない。

cutover後は、
old Q&Aをuser-facing fallbackとして復活させない。

rollbackは、
new Pieceをsafe disabled stateへ戻すことであり、old Q&Aへ戻すことではない。
```

これはproduct互換を残すためのdual-runではない。実装中に旧codeがrepository内へ存在する期間があっても、release acceptanceではold Q&A entry、generation、renderer、data dependencyがexact0でなければならない。

## 8. PCE-1 completion

```text
NEW_PIECE_IDENTITY_FIXED
USER_FACING_NAME_PIECE_FIXED
PIECE_RECORD_V2_FIXED
DEDICATED_RECORD_OWNER_DIRECTION_FIXED
ANA_ACTIVE_FORMAT_EXACT0
OLD_RECORD_MIGRATION_EXACT0
COMPATIBILITY_RENDERER_EXACT0
USER_VISIBLE_DUAL_RUN_EXACT0
DESTRUCTIVE_EXECUTION_EXACT0
PCE1_COMPLETE_DESIGN_ONLY
PCE2_NOT_ACTIVATED
AUTOMATIC_PROGRESSION_FALSE
```
