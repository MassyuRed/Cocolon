---
doc_id: piece_public_safety_transformation_contract_20260807
title: "Piece public safety transformation contract"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-4 Content / Format / Safety"
document_status: "PCE4_COMPLETE_DESIGN_ONLY"
contract_id: "piece.public_safety_transformation.v1"
content_contract_id: "piece.content_meaning.v1"
format_contract_id: "piece.format_owner.v1"
record_contract_id: "piece.record.v2"
source_cocolon_head: "66ca6d3f3b8b81bfee808670d0e96b5a16d48ea3"
source_cocolon_tree: "8507d8ccf34e3312a7c194fb9aab4fcce7daa4e6"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
source_roadmap_sha256: "2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939"
automatic_progression: false
production_effect: "exact0"
---

# Piece public safety transformation contract

## 1. 結論

```text
public safety contract:
  piece.public_safety_transformation.v1

applies to:
  private Piece
  public Piece
  preview
  saved record
  export
  re-export

safety bypass by visibility or plan:
  exact0

raw input public copy:
  exact0

Emlis body public copy:
  exact0

Analysis body public copy:
  exact0

internal safety details public:
  exact0
```

private Pieceもownerが画像export・external shareできるため、安全基準をpublic Pieceより弱くしない。

## 2. pipeline

```text
S0:
  authenticated source retrieval

S1:
  PCE-2 role / stage / owner / commitment validation

S2:
  source meaning-anchor plan

S3:
  source safety scan

S4:
  publicization transform

S5:
  eligible format realization

S6:
  post-format safety scan

S7:
  meaning-preservation / no-added-claim gate

S8:
  canonical content_payload + piece_text + hash

S9:
  preview eligible
```

S0〜S8のどこかが不成立なら、Piece preview successへ進めない。old Q&A fallback、raw source fallback、Emlis body fallbackを禁止する。

## 3. transformation classes

### 3.1 normalization

Allowed:

- zero-width character removal。
- CR/LF normalization。
- surrounding/trailing whitespace cleanup。
- repeated punctuation compression。
- meaning段落の正規化。
- Unicode-safe canonicalization that does not merge distinct visible text。

Normalizationは意味変更ではない。変更後のdisplay bytesをhash ownerにする。

### 3.2 direct identifier removal / masking

対象:

```text
email
phone
postal code
address
account / handle / LINE ID
URL / external redirect
direct contact instruction
credential / token / connection string
```

public Pieceでは、mask tokenをそのまま残すだけで不自然・再識別可能な場合、文全体を自然なabstract expressionへ再構成する。

例:

```text
unsafe:
  「example.comを見て」

safe meaning:
  「外から入ってきた情報で気持ちが動いた」
```

上記はillustrativeでありfixed sentence ownerではない。

### 3.3 third-party target abstraction

対象:

- identifiable person / account / workplace / school / location。
- attack、insult、doxxing、revenge、exposure intent。
- specific allegation whose truth cannot be verified。

transform:

```text
target identity:
  remove / abstract

owner reaction:
  preserve when safe

unverified allegation:
  do not publish as fact

threat / instruction:
  remove or block
```

怒りを消して「穏やか」と書き換えない。対象への攻撃を外し、owner側に残る反応・境界・負担だけをsource-groundedに表現できる場合に限りtransform successとする。

### 3.4 violence / severe harm

- direct threat、specific plan、doxxing-like disclosureは`ineligible_blocked`。
- 危険な対象・手段・識別情報を除いてもsource coreが安全に残る場合だけ`transformed`.
- safety変換によってsource coreがexact0になる場合、generic fallbackを生成せずineligibleにする。

### 3.5 unsupported claims

Piece本文へ追加しないもの:

```text
medical / psychological diagnosis
personality label
legal conclusion
financial advice
factual allegation about third party
future prediction
hidden motive
causal explanation not in source
moral judgment
```

owner自身がsourceで述べた不確実なclaimを扱う場合、そのuncertaintyとfirst-person scopeを保持する。

## 4. output safety states

internal state:

```text
ready:
  meaning-preserving transform不要またはnormalizationのみ

transformed:
  safety transformあり
  meaning anchors preserved

ineligible:
  safe and faithful Piece textを作れない

blocked:
  severe public risk
  public text exact0
```

public response may expose only:

```text
content_status:
  ready
  adjusted
  unavailable
```

publicへ出さない:

```text
PII category detail
threat / abuse detector detail
matched source token
internal regex / rule
source fragment
Emlis / Analysis internal identity
hidden anchor body
review/debug trace
```

internal reason codeはbody-free、bounded、non-diagnosticである。

## 5. meaning and safety dual gate

安全だけでなく意味保持もPASSする必要がある。

```text
safety_pass:
  no prohibited public material

meaning_pass:
  must-keep anchors preserved
  no added claim
  no polarity / uncertainty / relation corruption

preview_pass:
  safety_pass AND meaning_pass
```

次は失敗である。

- PIIを除いた結果、誰の何の話か完全に消える。
- attack targetを除いた結果、sourceにない自己啓発文だけが残る。
- uncertaintyを消してdeclarationにする。
- relationを落として反対の意味にする。
- low-infoをgeneric sympathy文へする。
- blocked inputを「今の気持ちを大切にしたい」等の一律文にする。

## 6. format-specific safety

### quote

- context omission riskを追加評価する。
- third-party allegation、time-limited state、uncertaintyを単独断言にしない。
- masked tokenだらけのquoteを成功にしない。

### short_essay

- contextを保持しやすいdefault。
- disclaimerや安全説明で本文を埋めない。
- unsafe detailを繰り返して説明しない。

### declaration

- stance evidence exact1を要求する。
- threat / retaliation / pressure toward othersをdeclarationにしない。
- temporary feelingをpermanent commitmentへしない。

format変更でsafety resultを弱化できない。Premiumが選択したformatでも同じgateを再実行する。

## 7. private / public boundary

```text
private visibility:
  Cocolon内read owner only

external export capability:
  allowed

therefore:
  same export-safe piece_text required
```

raw/private diaryとして保存したい内容はsaved input ownerが保持する。Piece privateは「安全化を外したraw copy保管場所」ではない。

## 8. user-edit boundary

本文free-editを許可しない。

理由:

1. safety gate後のPII / threat再注入を防ぐ。
2. preview / save / export equalityを保つ。
3. Cocolonがpublic-safe Piece textとして責任を持てる範囲を保つ。
4. hidden contentとvisible contentの二重ownerを作らない。
5. planによるsafety bypassを作らない。

ユーザーがsource自体を直す場合はsaved input側の別operationであり、既存PieceRecordを黙って更新しない。source revisionから再生成する場合はnew preview / new record ownerで扱う。

## 9. current reusable assets

### reusable concepts

```text
piece_text_formatter.py:
  PII masking
  URL removal
  severe threat / doxxing block
  deterministic normalization

piece_generation_policy.py:
  transform / safety classification
  safety flags
  text hash
  meaning_preserved / overcompression metadata

piece_composer.py:
  no Emlis voice
  no user-claim addition
  source claim / must-keep coverage
  preview/publish no regeneration

existing contract tests:
  URL removal
  attack target abstraction
  low-info no empty text
  preview/publish hash match
  mismatch rejection
```

### not adopted unchanged

```text
current Q&A answer:
  new Piece body ownerではない

current fixed abstracted fallback sentences:
  PCE-4 generic format ownerではない

current piece.core.v1 public flags:
  piece.record.v2 safety schemaではない

current raw storage of Q&A answer:
  new PieceRecord content contractではない
```

PCE-9Bはreusable detector / formatter / guardをcurrent headへbindし直す。PCE-4はcode reuseを承認せず、logical requirementsだけを固定する。

## 10. low-information safety

low-info sourceに対して:

```text
do:
  source-grounded one claimを確認
  quote / short_essay eligibilityを評価
  no-added-information gateを通す

do not:
  invented cause
  invented wish
  invented coping method
  invented positive conclusion
  fixed generic completion
```

safe contentが作れない場合は`unavailable`であり、failureではなく正直なnon-admissionである。PieceRecordとquota effectはexact0。

## 11. language / Unicode / external context

PCE-4は日本語と英語のpublic textを想定する。

- mixed Japanese / Englishを理由に削除しない。
- emojiはmeaningを担う場合があるため一律除去しない。
- bidirectional control、zero-width abuse、malformed Unicodeはnormalization / block対象。
- URL-like text、handles、phone-like textをlanguageごとに検証する。
- unsupported languageを日本語generic文へ変換しない。
- translationはPCE-4 initial ownerではない。
- external imageだけを見てもownerのclaim scopeが分かるようにする。

exact multilingual implementation/test matrixはPCE-7 / PCE-9Bで固定する。

## 12. monitoring / evidence privacy

metricsへ出してよい:

```text
contract version
format type
coarse content status
coarse transform class
length bucket
eligible / ineligible
body-free reason code
latency
hash mismatch boolean
```

metricsへ出さない:

```text
raw input
piece_text
Emlis body
Analysis body
matched PII
third-party identity
source claim body
supplemental answer body
```

## 13. negative contract catalog

| ID | prohibited result |
|---|---|
| `PCE4-S001` | raw input direct public copy without gates |
| `PCE4-S002` | Emlis visible body copied |
| `PCE4-S003` | Analysis inference copied |
| `PCE4-S004` | PII/contact/URL remains |
| `PCE4-S005` | third-party target remains identifiable |
| `PCE4-S006` | threat/doxxing exposed |
| `PCE4-S007` | uncertainty hardened |
| `PCE4-S008` | negation inverted |
| `PCE4-S009` | source relation dropped |
| `PCE4-S010` | diagnosis/personality added |
| `PCE4-S011` | generic filler replaces all meaning |
| `PCE4-S012` | private visibility bypasses safety |
| `PCE4-S013` | Premium selection bypasses safety |
| `PCE4-S014` | free edit reinjects unsafe body |
| `PCE4-S015` | internal safety details leaked |
| `PCE4-S016` | blocked result falls back to Q&A |
| `PCE4-S017` | preview/save/export text differs |
| `PCE4-S018` | transformed text lacks source anchor |

PCE-7 converts these into machine-checkable RED / contract tests.

## 14. STOP conditions

- safety transformation exact rule cannot preserve source core.
- current detector misses a known direct leak class required for release.
- private export cannot use the same safety owner.
- user free-edit is required to make Piece useful.
- Q&A fallback is required to avoid empty result.
- public response must reveal matched PII / attack details.
- format selection can bypass safety.
- preview / saved / export body cannot share one canonical text.
- transformed output requires unsupported diagnosis or interpretation.

## 15. completion

```text
PIECE_PUBLIC_SAFETY_TRANSFORMATION_V1_FIXED
PRIVATE_PUBLIC_SAME_SAFETY
RAW_INPUT_PUBLIC_COPY_EXACT0
EMLIS_BODY_COPY_EXACT0
ANALYSIS_BODY_COPY_EXACT0
PII_CONTACT_URL_NONLEAK_FIXED
THIRD_PARTY_TARGET_ABSTRACTION_FIXED
SEVERE_THREAT_DOXXING_NONADMISSION_FIXED
MEANING_AND_SAFETY_DUAL_GATE_FIXED
INTERNAL_SAFETY_DETAIL_PUBLIC_EXACT0
USER_FREE_EDIT_EXACT0
LOW_INFO_NO_HALLUCINATION_FIXED
NEGATIVE_CONTRACT_EXACT18
PRODUCTION_EFFECT_EXACT0
PCE4_COMPLETE_DESIGN_ONLY
```
