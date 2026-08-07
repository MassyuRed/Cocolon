---
doc_id: cocolon_piece_workstream_pce4_design_closure_20260807
title: "Cocolon Piece Workstream — PCE-4 design closure"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-4 Content / Format / Safety"
phase_completion: true
pce5_activated: false
analysis_roadmap_activated: false
automatic_progression: false
production_effect: "exact0"
---

# Cocolon Piece Workstream — PCE-4 design closure

## 1. current state

```text
PCE-0:
  COMPLETE

PCE-1:
  COMPLETE_DESIGN_ONLY

PCE-2:
  COMPLETE_DESIGN_ONLY

PCE-3:
  COMPLETE_DESIGN_ONLY

PCE-4:
  COMPLETE_DESIGN_ONLY

PCE-5:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

Analysis Pro-First roadmap:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
  false
```

This file supersedes the phase-state portion of `15F_cocolon_piece_workstream_pce3_design_closure_20260807.md`. PCE-1 / PCE-2 / PCE-3 decisions and historical facts remain valid.

## 2. fixed PCE-4 contracts

```text
content meaning:
  piece.content_meaning.v1

content payload:
  piece.content_payload.v1

format owner:
  piece.format_owner.v1

public safety transformation:
  piece.public_safety_transformation.v1

user selection:
  piece.user_selection_boundary.v1
```

All contracts finalize logical Piece content behavior for `piece.record.v2`. They do not implement generation code, DB objects, API routes, RN screens, renderer, export, migrations, runtime behavior, tests, or release authority.

## 3. content meaning decision

```text
source canonical:
  saved input
  + refined only: distinct supplemental answer

derived canonical:
  PieceRecord.piece_text

raw input overwrite:
  exact0

Emlis body source:
  exact0

Analysis inference source:
  exact0

title:
  initial exact0
```

Pieceは短縮要約ではない。sourceのsubject、stance、object、relation、scope、uncertainty、negation、source role、must-keep anchorを必要に応じて保持し、他者へ届くpublic-safeな文章へ変換する。

禁止:

- sourceにないdiagnosis / personality / cause / advice / future predictionを追加する。
- uncertaintyやtemporary stateを断定・恒常的性質へ変える。
- third-party allegationを事実として外部共有する。
- char limitのためにmust-keep relationを落とす。
- low-infoをfixed generic完成文で埋める。
- failed contentをold Q&Aへfallbackする。

## 4. initial format decision

```text
active formats:
  short_essay
  quote
  declaration

active count:
  exact3

default:
  short_essay

Free:
  short_essay fixed

Plus:
  auto recommendation among eligible exact3

Premium:
  choose among eligible exact3

Q&A:
  active exact0

fragment:
  initial active exact0
  deferred
```

`short_essay`をdefaultとする。context、relation、uncertaintyを最も保持しやすく、QuoteのovercompressionとDeclarationのfalse-stance riskを避けやすいためである。

format ownerはmeaning shape、claim count、relation complexity、context dependency、stance evidence、uncertainty、negation、source length、public transform pressureから決める。case ID、exact sample、focus key、one keyword、tierだけをownerにしない。

旧2026-07-07 design noteはQ&Aをfuture candidateに含めていたが、後発のMash clean-cutover decisionとPCE-1により、そのcandidateはsupersededである。内容形式と見た目形式の分離、Quote / Short Essay / Declaration検討、本文編集不可、安全境界は継承する。

## 5. content payload and equality

initial payload:

```text
piece.content_payload.v1
  format_type
  body_blocks
  title = null
  language
  meaning contract version
  safety contract version
```

canonical reconstruction:

```text
quote:
  body_blocks exact1

short_essay:
  body_blocks 1..3
  join with LF LF

declaration:
  body_blocks 1..3
  join with LF
```

absolute equality:

```text
preview reconstructed piece_text
  ==
preview piece_text
  ==
saved PieceRecord.piece_text
  ==
export renderer input piece_text
```

save、visibility toggle、export、re-exportで本文を再生成しない。saved recordのformatまたはcanonical textを変える場合はnew recordであり、PCE-3 quota exact1を消費する。

## 6. safety decision

```text
applies equally:
  private
  public
  Free
  Plus
  Premium
  preview
  save
  export
  re-export
```

pipeline:

```text
authenticated source
-> PCE-2 lineage validation
-> meaning anchors
-> source safety scan
-> publicization transform
-> format realization
-> post-format safety
-> meaning-preservation / no-added-claim
-> canonical content + hash
```

safety covers:

- email / phone / postal / address。
- URL / handle / account / contact instruction。
- credential / token / connection string。
- identifiable third-party target。
- attack / insult / threat / doxxing。
- unsupported diagnosis / allegation / hidden motive。
- internal Cocolon / Emlis / Analysis material。

private Pieceもexternal exportできるため、privateをunsafe/raw保存optionにしない。

public responseは`ready / adjusted / unavailable`等のcoarse stateだけを返し、matched source、PII category detail、detector rule、internal anchor body、safety traceを返さない。

## 7. user selection decision

```text
user may:
  choose Piece creation
  inspect preview
  cancel
  choose visibility
  choose eligible format when plan allows
  save
  later export/share under PCE-5

user may not:
  free-edit piece_text
  paste replacement body
  show/publish raw input
  disable safety
  force ineligible format
  choose Emlis body
  choose Analysis inference
  mutate saved format/text in place
```

semantic fidelity and safety quality are equal across plans.旧design noteの「Free低め / Premium高品質」はcontent fidelityやsafetyの差として採用せず、tier差はquota、eligible format selection、PCE-5 visual customization、brandingへ置く。

PCE-4ではPlusのalternate-generation UX、title、fragment、visual options、exact RN/APIを確定しない。

## 8. current actual basis

```text
Cocolon source basis:
  66ca6d3f3b8b81bfee808670d0e96b5a16d48ea3
  tree 8507d8ccf34e3312a7c194fb9aab4fcce7daa4e6

mashos-api source basis:
  315813c7bd3372462de926ddad74df567254a6b5
  tree a641510e107d52bb910073f36604c85bd57af150

roadmap:
  UTF-8 bytes 51703
  lines 1973
  SHA-256 2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939
```

current confirmed owners:

```text
Q&A generation:
  ai/services/ai_inference/emotion_piece_generation_service.py
  blob 2deda0357c3b00016f188abab7281eb768816003

generated display:
  ai/services/ai_inference/piece_generated_display.py
  blob a02fe1dc4118833a561523f88039cd01879ba198

public text formatter:
  ai/services/ai_inference/piece_text_formatter.py
  blob 2573ea391dba9c84123a4762174bb7978b35ac8a

generation policy:
  ai/services/ai_inference/piece_generation_policy.py
  blob ec2023e33feb7740b51e9dc449b596abf109bbfb

common Piece composer:
  ai/services/ai_inference/cocolon_text_generation_core/adapters/piece_composer.py
  blob f83956a8c26424fc19e48a9f21f1aab075f8f657

value observation:
  ai/services/ai_inference/cocolon_value_observation_service.py

representative contract tests:
  ai/tests/contract/test_new_national_core_piece_contracts.py
  blob df9e06df5eb7766ea071c75cb91ef0e7fcd28083
```

confirmed current contract:

```text
format:
  implicit Q&A

question / answer:
  visible required structure

generation:
  deterministic rule-based
  current-input-only
  fixed question / focus / phrase branches

safety:
  PII mask / URL removal / attack abstraction / severe block

low info:
  fallback-generated and publishable

preview / publish:
  same text hash
  mismatch rejected

composer:
  source claims / must-keep / no Emlis voice
  current voice distance user_subject_public_qna
```

PCE-4 reuses safety、meaning-preservation、hash/no-regeneration concepts. It does not adopt current Q&A text branches、focus-key完成文、`piece_question / piece_answer` candidate bodies、current `piece.core.v1` as the future content owner.

## 9. PCE-4 outputs

```text
Cocolon_Piece/pce4_content_format_safety/
  Piece_Content_Meaning_Contract_20260807.md
  Piece_Format_Owner_Decision_20260807.md
  Piece_Public_Safety_Transformation_Contract_20260807.md
  Piece_User_Selection_Boundary_20260807.md
```

Prepared identities:

| path | UTF-8 bytes | SHA-256 | Git blob SHA-1 |
|---|---:|---|---|
| `Cocolon_Piece/pce4_content_format_safety/Piece_Content_Meaning_Contract_20260807.md` | 11695 | `88b7a40280ad3beb3a83caceb85dc74f75662edcf4442aa19c237ae41f63fc1d` | `cfa23183e26551ed461ee4815a8535f47d92c6c1` |
| `Cocolon_Piece/pce4_content_format_safety/Piece_Format_Owner_Decision_20260807.md` | 12123 | `9239025403fd8c083af684439316ccfb1d8e3a96ea022ed97668077ada4af48b` | `546ba60a870f0e8271d15a39d2ae15adc16c0c50` |
| `Cocolon_Piece/pce4_content_format_safety/Piece_Public_Safety_Transformation_Contract_20260807.md` | 12212 | `56db5be17034731b70cabbe646be6bd1e9c615551e53afb342bcf0c9888324da` | `45bb3259975fe697d0c2703ef53a90cf5fe68e94` |
| `Cocolon_Piece/pce4_content_format_safety/Piece_User_Selection_Boundary_20260807.md` | 10436 | `57928eea103f88566028a46c99dbcff98fbed6159c3566f80296f5714cee7cdf` | `c74f59e3de64996dba5f1841d23a544a65f4f050` |

## 10. completed / not implemented

### PCE-4 completed

- content meaning and source-canonical separation。
- meaning anchor and no-added-claim contract。
- canonical content payload and line-break reconstruction。
- initial active format exact3。
- Q&A active exact0 and fragment deferral。
- generic format selection features and tie-break。
- Free / Plus / Premium format boundary。
- tier-independent fidelity / safety。
- safety transformation pipeline and output states。
- private/public same safety。
- no free-edit user boundary。
- pre-save candidate / save / post-save new-record semantics。
- negative contract catalogs and STOP conditions。

### not implemented

```text
production source:
  exact0

format selector:
  exact0

new content generator:
  exact0

DB / API / RN / migration:
  exact0

visual recipe / renderer / export:
  exact0

test / runtime / actual device:
  exact0

old Q&A removal:
  exact0

release / feature flag:
  exact0
```

## 11. facts / inference / Karen's opinion

### 確認済み事実

- roadmap requires safety first、meaning preservation second、visual readability third。
- roadmap excludes Q&A from new active formats under clean cutover。
- current generation is deterministic Q&A and uses fixed lexical / focus branches。
- current formatter masks PII / URL and blocks severe threat / doxxing cases。
- current policy carries text hash、meaning preservation、overcompression metadata。
- current composer forbids Emlis voice and added user claims。
- current contract tests pin URL removal、target abstraction、low-info、same preview/publish hash。
- PCE-3 fixes new canonical text or format as a new record and quota consumption exact1。

### 推測・未確認

- exact distribution of future user inputs across the three formats。
- whether 12/24/120/180/420 character envelopes fit every Japanese/English layout。
- exact multilingual safety detector coverage。
- exact percentage of current low-info inputs that remain eligible without generic filler。
- actual user preference for Free short_essay vs quote。
- exact RN wording and format-switch comprehension。
- renderer/device behavior。

These remain design hypotheses for PCE-5 / PCE-7 / PCE-9B / PCE-11 validation. They are not runtime facts.

### 華恋の意見

Free固定formatは`short_essay`が妥当である。Quote固定は長い入力の核と関係を削りやすく、Declaration固定はsourceにない決意を作りやすい。short_essayをsource-scaledにすれば、短い入力も一文で扱え、長い入力では関係と留保を残せる。

また、plan差を「ユーザーの言葉をどれだけ丁寧に扱うか」へ置くべきではない。FreeでもPremiumでも意味保持と安全性は同じにし、価値差は回数、選択範囲、visual customization、brandingへ置く。

## 12. next exact actions

Next Piece action:

```text
PCE5_VISUAL_RECIPE_EXPORT_DESIGN_ONLY
```

Roadmap phase name:

```text
PCE-5 Visual Recipe / Export Design
```

Next cross-workstream queued action:

```text
ANALYSIS_PRO_FIRST_CURRENT_ACTUAL_PRODUCT_QUALITY_CLOSURE_ROADMAP_DESIGN_ONLY
```

Both require separate Mash approval. Neither is activated by PCE-4 closure.

## 13. non-effects

```text
Cocolon production source:
  exact0

mashos-api production source:
  exact0

DB / API / RN / migration / data deletion:
  exact0

test / runtime:
  exact0

EmlisAI technical state / authority / credit:
  exact0

Analysis runtime state:
  exact0

release:
  exact0

automatic progression:
  false
```

## 14. closure

```text
PCE4_CONTENT_MEANING_FIXED
PCE4_CONTENT_PAYLOAD_FIXED
PCE4_FORMAT_OWNER_FIXED
PCE4_PUBLIC_SAFETY_FIXED
PCE4_USER_SELECTION_FIXED
INITIAL_ACTIVE_FORMATS_EXACT3
SHORT_ESSAY_DEFAULT_FREE_FIXED
PLUS_AUTO_RECOMMENDATION_FIXED
PREMIUM_ELIGIBLE_SELECTION_FIXED
QNA_ACTIVE_EXACT0
FRAGMENT_INITIAL_ACTIVE_EXACT0
TIER_SAFETY_FIDELITY_EQUAL
RAW_EMLIS_ANALYSIS_BODY_COPY_EXACT0
USER_FREE_EDIT_EXACT0
PREVIEW_SAVE_EXPORT_EQUALITY_REQUIRED
PCE4_COMPLETE_DESIGN_ONLY
PCE5_NOT_ACTIVATED
ANALYSIS_ROADMAP_NOT_ACTIVATED
AUTOMATIC_PROGRESSION_FALSE
```
