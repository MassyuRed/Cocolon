---
doc_id: piece_format_owner_decision_20260807
title: "Piece format owner decision"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-4 Content / Format / Safety"
document_status: "PCE4_COMPLETE_DESIGN_ONLY"
contract_id: "piece.format_owner.v1"
content_contract_id: "piece.content_meaning.v1"
record_contract_id: "piece.record.v2"
source_cocolon_head: "66ca6d3f3b8b81bfee808670d0e96b5a16d48ea3"
source_cocolon_tree: "8507d8ccf34e3312a7c194fb9aab4fcce7daa4e6"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
source_roadmap_sha256: "2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939"
automatic_progression: false
production_effect: "exact0"
---

# Piece format owner decision

## 1. 結論

```text
format owner:
  piece.format_owner.v1

initial active formats:
  short_essay
  quote
  declaration

active count:
  exact3

Q&A:
  pre-release legacy
  active exact0

fragment:
  initial active exact0
  deferred post-release candidate

default / safe fallback format:
  short_essay

format selection input:
  meaning shape
  source length
  relation structure
  intent evidence
  context dependency
  public safety transform pressure

case ID / exact sample / isolated keyword:
  owner exact0
```

PCE-4はfirst targetの2〜3 formatsに対し、`short_essay`、`quote`、`declaration`のexact3を採用する。

## 2. prior design-note reconciliation

2026-07-07 design noteは`Q&A`をfuture候補に含めていた。  
その後、Mashがclean cutoverを決定し、PCE-1で次をcurrent contractとして固定した。

```text
Q&A:
  pre-release legacy specification
  new active format exact0
  migration / compatibility renderer exact0
```

したがって、design noteの「内容形式と見た目形式を分離する」「Quote / Short Essay / Declaration / Fragmentを検討する」という方向は継承するが、Q&A candidateだけはsupersededでありPCE-4 active setへ入れない。

## 3. common format invariants

全active formatで次を共通にする。

1. `piece_text`が唯一のcanonical visible body。
2. titleはinitial v1で`null`。
3. raw input、Emlis body、Analysis bodyをhidden contentとして持たない。
4. same safety and meaning-preservation contractを通る。
5. sourceにない立場・因果・診断・助言を追加しない。
6. visual theme / font / ratioをcontent formatへ混ぜない。
7. format labelを本文へ挿入しない。
8. format eligibility不成立をuser choiceでoverrideしない。
9. format変更後は新しいpreview text / hashを持つ。
10. saved recordのformat変更はnew PieceRecordであり、same-record re-exportではない。

## 4. format contracts

### 4.1 `short_essay`

role:

```text
default general-purpose format
context / relation / contrast / nuance preservation
```

eligibility:

- source-grounded anchor exact1以上。
- 一つ以上のcomplete claimを作れる。
- contrast、condition、temporal scope、uncertainty等を保つ必要がある場合に優先。
- multi-claim source、長めsource、context dependencyが高いsourceに適する。
- sourceが短くても、一つのcomplete self-contained sentenceにできればeligible。

shape:

```text
body_blocks:
  1..3 paragraphs

sentences:
  1..6

content envelope:
  24..420 normalized characters

title:
  null
```

禁止:

- generic introで長さを水増しする。
- sourceにない結論段落を足す。
- essayらしさのためにadviceを足す。

### 4.2 `quote`

role:

```text
one self-contained high-salience claim
external shareで単独理解できる短い表現
```

eligibility:

- dominant meaning anchor exact1。
- relation dependencyが低い。
- omitted contextによって意味反転・誤解が起きない。
- sourceの留保・否定を短い本文でも保持できる。
- third-party allegationやprivate identityを中心にしない。

shape:

```text
body_blocks:
  exact1

sentences:
  1..2

content envelope:
  12..120 normalized characters

title:
  null
```

禁止:

- 長いsourceから一文だけ抜き、残りのmust-keep relationを消す。
- ownerの言葉ではない「名言調」へ美化する。
- uncertaintyを断言にする。
- raw source substringをsafety gateなしでquotationとして公開する。

### 4.3 `declaration`

role:

```text
sourceに明示されたowner自身の意思・境界・選択
```

eligibility:

- first-person stance / intent / boundary evidenceがsourceに存在する。
- 「〜したい」「〜を大切にする」「〜しない」等のstanceが明示または意味等価に確認できる。
- fear、anger、sadnessだけからcommitmentを推定しない。
- third partyへの命令、脅し、断罪ではない。
- supplemental answerを使う場合もoriginalとのrelationを保持する。

shape:

```text
body_blocks:
  1..3 complete lines

sentences:
  1..4

content envelope:
  12..180 normalized characters

title:
  null
```

禁止:

- sourceにない決意を作る。
- momentary emotionをpermanent promiseへする。
- internal conflictの片側だけを宣言にする。
- 他者を従わせるimperativeへする。

## 5. `fragment` deferred decision

`fragment`は短い感情断片を表現できるが、external shareでは元文脈なしに誤解されやすい。

initial active exact0の理由:

1. low-informationとintentional fragmentを区別するownerが未完成。
2. safety transform後の断片がgenericまたは意味不明になりやすい。
3. declaration / quoteとの境界が曖昧。
4. 画像だけが切り取られた時のmisunderstanding riskが高い。
5. first releaseのexact3でproduct valueを十分検証できる。

fragmentはpost-release candidateであり、PCE-4 failure fallbackではない。

## 6. format decision features

format ownerはbody-free / structured featureから決める。exact textを公開metaへ出さない。

```text
claim_count:
  0..N

dominant_claim:
  true / false

relation_complexity:
  none / single / multi

context_dependency:
  low / medium / high

stance_evidence:
  absent / present

uncertainty_present:
  true / false

negation_present:
  true / false

must_keep_count:
  0..N

source_length_class:
  short / medium / long / very_long

public_transform_pressure:
  low / medium / high / blocking

self_contained_after_transform:
  true / false
```

format rule:

```text
if safe complete content cannot be produced:
  ineligible

elif explicit stance and declaration preserves all must-keep anchors:
  declaration candidate

elif dominant_claim and low context dependency and quote preserves all anchors:
  quote candidate

else:
  short_essay
```

`short_essay`をtie-breakerにする。これは最も多くのcontext、relation、uncertaintyを保持できるためである。

## 7. forbidden format owner inputs

次だけでformatを決めない。

- emotion category名。
- specific focus key。
- exact sample ID。
- user name。
- one keyword such as「大切」「怖い」「決意」。
- subscription tierだけ。
- visual theme。
- Emlis reception mode。
- Analysis route。
- previous Piece format。
- convenience for current Q&A renderer。

keyword / lexical signalはmeaning evidence探索の補助には使えるが、format決定の十分条件にはしない。

## 8. plan boundary

### semantic and safety quality

```text
Free / Plus / Premium:
  same meaning preservation
  same public safety
  same no-hallucination contract
  same preview/save/export equality
```

semantic qualityをtier差にしない。  
旧design noteの「Free低め、Premium高品質」という表現は、content fidelityやsafetyを下げる意味では採用しない。tier差はquota、selection breadth、visual customization、brandingへ置く。

### Free

```text
format:
  short_essay fixed

manual format selection:
  exact0

eligible source:
  same PCE-4 gates

quality:
  full contract
```

Free固定formatとして`short_essay`を採用する理由:

- short inputからmulti-claim inputまでsource-scaledに扱える。
- Quoteよりovercompression riskが低い。
- Declarationのようにstanceを発明する危険が低い。
- 一つのformatでもPieceの「他者へ届く文章化」を体験できる。

### Plus

```text
format:
  auto recommendation among eligible exact3

manual format selection:
  initial exact0

theme choice:
  PCE-5 owner

alternate-generation UX:
  PCE-6 / PCE-9D owner
```

Plusはinputに合うformatをCocolonが選ぶ。format選択UIを初期から増やさない。

### Premium

```text
format:
  user may choose from eligible active formats

forced ineligible format:
  exact0

theme / font / ratio:
  PCE-5 owner
```

Premiumでもsafetyやmeaning gateをoverrideできない。候補が一つしかeligibleでない場合、選択肢は一つでよい。

## 9. preview and save semantics

```text
pre-save format change:
  new preview candidate
  new piece_text
  new piece_text_hash
  PieceRecord exact0 until save
  quota exact0

save selected candidate:
  PieceRecord exact1
  quota exact1

post-save format change:
  same record mutation exact0
  new PieceRecord required
  quota exact1

same-record visual re-export:
  PCE-5 contract
  canonical format and text unchanged
```

format selectionはvisibility選択と独立する。private/publicによりformat eligibilityを変えない。private Pieceも外部export可能なため、同じpublic-safety contractを通す。

## 10. current actual gap

current runtime:

```text
question:
  required visible owner

answer:
  current Piece text

format:
  implicit Q&A exact1

generation:
  deterministic fixed question / focus patterns

display:
  Q&A-oriented repair / fallback

composer voice:
  user_subject_public_qna
```

PCE-4 target:

```text
question:
  top-level exact0

format_type:
  explicit active set exact3

piece_text:
  format-owned canonical body

format selection:
  generic meaning shape

runtime implementation:
  PCE-9B
```

current Q&A generator、question key、Q&A card、legacy aliasesをPCE-4成果物へ移植しない。PCE-9Bはnew format ownerを実装し、PCE-9Fはold Q&A public flowを到達不能化する。

## 11. negative decision matrix

| candidate | result | reason |
|---|---|---|
| Q&A as active format | rejected | clean cutoverに反する |
| fragment initial active | deferred | context / low-info / safety境界未成熟 |
| all tiers manual format choice | rejected initial | UIとQAを増やしFree/Plusの差分を崩す |
| tier-dependent safety | rejected | private/export含む事故になる |
| tier-dependent meaning fidelity | rejected |ユーザーの言葉をplanで雑に扱う |
| keyword-only selector | rejected | case-specific / fragile |
| exact sample sentence renderer | rejected | input meaning ownerにならない |
| short_essay universal success | rejected | anchor exact0やblocking safetyはineligible |
| Q&A fallback on failure | rejected | old flow復活になる |

## 12. STOP conditions

- active format exact3のいずれもmeaning anchorsを保てない。
- format selectorがspecific samples / focus keysへ依存する。
- quoteがmust-keep relationを落とさないと成立しない。
- declarationがsourceにないstanceを作らないと成立しない。
- short_essayがgeneric fillerを足さないと成立しない。
- safetyを満たすにはQ&Aへ戻る必要がある。
- planごとにsafety / fidelityを弱める必要がある。
- user free-editがないとformat成立しない。

## 13. completion

```text
PIECE_FORMAT_OWNER_V1_FIXED
INITIAL_ACTIVE_FORMATS_EXACT3
SHORT_ESSAY_ACTIVE
QUOTE_ACTIVE
DECLARATION_ACTIVE
QNA_ACTIVE_EXACT0
FRAGMENT_INITIAL_ACTIVE_EXACT0
SHORT_ESSAY_DEFAULT_AND_FREE_FIXED
PLUS_AUTO_RECOMMENDATION
PREMIUM_ELIGIBLE_FORMAT_SELECTION
TIER_SAFETY_FIDELITY_EQUAL
KEYWORD_CASE_ID_OWNER_EXACT0
POSTSAVE_FORMAT_CHANGE_NEW_RECORD
PRODUCTION_EFFECT_EXACT0
PCE4_COMPLETE_DESIGN_ONLY
```
