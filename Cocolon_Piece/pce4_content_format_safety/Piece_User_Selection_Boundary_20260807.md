---
doc_id: piece_user_selection_boundary_20260807
title: "Piece user selection boundary"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-4 Content / Format / Safety"
document_status: "PCE4_COMPLETE_DESIGN_ONLY"
contract_id: "piece.user_selection_boundary.v1"
content_contract_id: "piece.content_meaning.v1"
format_contract_id: "piece.format_owner.v1"
safety_contract_id: "piece.public_safety_transformation.v1"
record_contract_id: "piece.record.v2"
source_cocolon_head: "66ca6d3f3b8b81bfee808670d0e96b5a16d48ea3"
source_cocolon_tree: "8507d8ccf34e3312a7c194fb9aab4fcce7daa4e6"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
source_roadmap_sha256: "2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939"
automatic_progression: false
production_effect: "exact0"
---

# Piece user selection boundary

## 1. 結論

```text
user selection contract:
  piece.user_selection_boundary.v1

user may:
  choose whether to create Piece
  inspect preview
  cancel preview
  choose private / public
  choose eligible format when plan allows
  later choose PCE-5 visual options when plan allows
  save
  export / share after save

user may not:
  freely edit piece_text
  paste replacement body
  reveal raw source through Piece
  disable safety
  force ineligible format
  select Emlis body as Piece text
  select Analysis inference as Piece text
  mutate saved record format/text in place
```

ユーザーの主体性は「安全化を無効化して本文を書くこと」ではなく、Piece化するか、どのeligible表現にするか、Cocolon内の公開範囲、保存・exportを選ぶことに置く。

## 2. selection layers

```text
Layer 1:
  create Piece or not

Layer 2:
  eligible content format
  plan boundary applies

Layer 3:
  visual recipe choices
  PCE-5 owner

Layer 4:
  private / public
  PCE-3 owner

Layer 5:
  save / cancel
  PCE-3 lifecycle owner

Layer 6:
  export / share / re-export
  PCE-5 owner
```

各layerを混ぜない。formatを変えてvisibilityを変えない。visibilityを変えてtextを再生成しない。themeを変えてmeaningを変えない。

## 3. initial plan matrix

| capability | Free | Plus | Premium |
|---|---|---|---|
| Piece保存 | yes, monthly 5 | yes, monthly 30 | yes, unlimited |
| semantic / safety quality | full | full | full |
| format | fixed `short_essay` | auto eligible recommendation | choose eligible active format |
| text free edit | no | no | no |
| visibility choice | private / public | private / public | private / public |
| export / share | yes | yes | yes |
| theme / font / ratio | PCE-5 | PCE-5 | PCE-5 |
| safety override | no | no | no |

quotaはPCE-3 contract、visual differenceはPCE-5 contractがownerである。

## 4. no free-edit contract

initial Piece本文にtextarea / free-text editorを置かない。

禁止UI/operation:

```text
edit generated body
paste replacement body
append arbitrary hashtag / URL / handle into body
edit title
toggle "show original"
publish raw input
disable filtering
show blocked source
save unsafe draft as private
```

本文free-edit不可でも、元入力のownerはユーザーである。元入力自体を編集できるかはsaved input contractの別判断であり、Piece preview内でraw source mutationを行わない。

## 5. preview controls

previewで必要なuser operation:

```text
close / cancel
visibility choose
eligible format choose if Premium
save
```

PCE-5後に追加できるoperation:

```text
theme choose
font style choose
aspect ratio choose
branding option according to plan
```

initial PCE-4では「別案を生成」「同じformatでreroll」のproduct contractを固定しない。必要ならPCE-6のAPI/idempotency設計とPCE-9DのUXで、同じsource lineageとfull safety gateを維持したbounded operationとして別決定する。

## 6. format availability communication

formatがineligibleの場合、ユーザーへinternal detector detailを返さない。

allowed message intent:

```text
この入力では、この表現形式を安全に保てません。
内容を変えずに使える形式を選びました。
```

禁止:

```text
matched PII token
attack / threat detector label
private source fragment
internal focus key
confidence score
diagnosis-like explanation
```

Premiumでもeligible format exact1なら、一つだけ表示してよい。「Premiumなのに選べない」ことを隠すためunsafe candidateを出さない。

## 7. pre-save candidate semantics

```text
source lineage:
  same exact1

format candidate:
  may differ

piece_text:
  candidate-specific

piece_text_hash:
  candidate-specific

PieceRecord:
  exact0 before save

quota:
  exact0 before save
```

ユーザーがformat候補を切り替えた場合、表示中candidateのtext/hashを明示的に置換し、hidden prior candidateをsaveしない。

save requestは少なくとも次へbindする。

```text
source lineage identity
format type
piece_text hash
content payload hash / identity
visibility selection
preview identity
idempotency key
```

exact API fieldsはPCE-6で固定する。

## 8. save and post-save boundary

save成功後:

```text
record identity:
  fixed

format:
  fixed

canonical piece_text:
  fixed

source lineage:
  fixed

visibility:
  toggle allowed

same-record re-export:
  allowed

text edit:
  exact0

format edit:
  exact0
```

別format、別本文、source revisionによる再生成はnew preview / new PieceRecordであり、PCE-3 quota exact1を消費する。

visual-only changeをsame recordで許す範囲はPCE-5が決める。visual changeで本文を変えてはいけない。

## 9. visibility and safety

```text
private:
  owner-only Cocolon read
  export possible

public:
  authorized viewer read
  export possible

safety:
  identical
```

privateを「未検査本文を保存するoption」にしない。public/private選択はaudience controlであり、safety levelではない。

default visibilityはPCE-3どおりprivate。publicにはownerの明示選択が必要である。

## 10. user ownership without false authorship

Pieceはユーザーのsourceから作るユーザー所有artifactだが、Cocolonが整形した本文である。

UXは次を同時に満たす。

- sourceはユーザー自身の記録である。
- Piece textはCocolonが他者向けに整えた表現である。
- Cocolonがユーザーの発言を捏造したように見せない。
- 「あなたはこういう人」と人格断定しない。
- Emlisが書いた文章として表示しない。
- Analysis結果として表示しない。
- export imageでCocolon brandingがあっても、本文の主体をCocolonにしない。

exact copy / attribution wordingはPCE-6 RN designで固定する。

## 11. accessibility and comprehension requirements

PCE-6 / PCE-9D UIは次を満たす。

- format名だけで意味を要求せず、短いhuman-readable説明を持つ。
- visibilityとformatを同じtoggleにしない。
- private/publicの現在値をscreen readerで読める。
- safety unavailableを色だけで示さない。
- save前にcanonical textを全文確認できる。
- scroll / long textでもsave buttonが誤操作にならない。
- format切替時にtextが変わったことをannounceする。
- user free-edit不可を故障のように見せず、編集control自体を出さない。
- internal technical termを表示しない。

## 12. cancellations and failures

### cancel

```text
record:
  exact0 / cancelled preview

quota:
  exact0

source:
  unchanged

Emlis / Analysis:
  unchanged
```

### safety unavailable

```text
record:
  exact0

quota:
  exact0

visibility selection:
  no effect

old Q&A fallback:
  exact0
```

### save response loss

PCE-3 idempotency contractによりsame record / same quota eventを返す。ユーザーへ再生成や二重保存を要求しない。

## 13. deferred choices

PCE-4で確定しない:

- exact RN component / screen layout。
- exact API fields / error codes。
- Plus alternative-generation UX。
- title feature。
- custom user text。
- fragment format。
- visual themes。
- font / ratio / branding。
- renderer。
- image filename。
- export image size。
- post-save visual mutation semantics。

owner:

```text
PCE-5:
  visual / export

PCE-6:
  API / DB / RN exact design

PCE-7:
  RED / QA / monitoring

PCE-9D:
  RN implementation
```

## 14. negative contract catalog

| ID | prohibited user path |
|---|---|
| `PCE4-U001` | free-edit generated text |
| `PCE4-U002` | paste arbitrary replacement |
| `PCE4-U003` | show/publish raw source |
| `PCE4-U004` | choose Emlis body |
| `PCE4-U005` | choose Analysis inference |
| `PCE4-U006` | bypass safety because private |
| `PCE4-U007` | bypass safety because Premium |
| `PCE4-U008` | force ineligible format |
| `PCE4-U009` | format toggle mutates saved record |
| `PCE4-U010` | visibility toggle regenerates text |
| `PCE4-U011` | preview candidate and saved candidate differ |
| `PCE4-U012` | cancel consumes quota |
| `PCE4-U013` | unavailable result falls back to Q&A |
| `PCE4-U014` | internal reason detail exposed |
| `PCE4-U015` | tier lowers fidelity / safety |
| `PCE4-U016` | hidden title or body saved without preview |

## 15. STOP conditions

- product value requires arbitrary text editing.
- safe format choice cannot be explained without exposing source body.
- Premium format choice must bypass eligibility to feel valuable.
- Free fixed short_essay cannot preserve a material class of eligible inputs and no safe fallback exists.
- preview cannot show the exact saved body.
- post-save format mutation is required.
- private is used as safety bypass.
- plan-specific fidelity difference is required.
- Q&A fallback is required.

## 16. completion

```text
PIECE_USER_SELECTION_BOUNDARY_V1_FIXED
USER_CREATE_OR_NOT_FIXED
USER_VISIBILITY_CHOICE_FIXED
FREE_SHORT_ESSAY_FIXED
PLUS_AUTO_FORMAT_FIXED
PREMIUM_ELIGIBLE_FORMAT_SELECTION_FIXED
USER_FREE_TEXT_EDIT_EXACT0
SAFETY_OVERRIDE_EXACT0
PRIVATE_SAFETY_BYPASS_EXACT0
PREVIEW_CANDIDATE_SAVE_BINDING_REQUIRED
POSTSAVE_TEXT_FORMAT_MUTATION_EXACT0
NEW_FORMAT_OR_TEXT_NEW_RECORD
ACCESSIBILITY_REQUIREMENTS_FIXED
NEGATIVE_USER_PATH_EXACT16
PRODUCTION_EFFECT_EXACT0
PCE4_COMPLETE_DESIGN_ONLY
```
