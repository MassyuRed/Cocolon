---
doc_id: piece_content_meaning_contract_20260807
title: "Piece content meaning contract"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-4 Content / Format / Safety"
document_status: "PCE4_COMPLETE_DESIGN_ONLY"
contract_id: "piece.content_meaning.v1"
content_payload_version: "piece.content_payload.v1"
record_contract_id: "piece.record.v2"
source_lineage_contract_id: "piece.source_lineage.v1"
source_cocolon_head: "66ca6d3f3b8b81bfee808670d0e96b5a16d48ea3"
source_cocolon_tree: "8507d8ccf34e3312a7c194fb9aab4fcce7daa4e6"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
source_roadmap_sha256: "2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939"
automatic_progression: false
production_effect: "exact0"
---

# Piece content meaning contract

## 1. 結論

```text
content meaning contract:
  piece.content_meaning.v1

content payload:
  piece.content_payload.v1

canonical visible body:
  piece_text

source of truth:
  saved source input
  + refined stage only: distinct supplemental answer

derived artifact:
  PieceRecord

raw input overwrite:
  exact0

Emlis visible body reuse:
  exact0

Analysis inference reuse:
  exact0

Q&A active format:
  exact0
```

Pieceは、保存済み入力の短縮要約ではない。  
保存済み入力に含まれる核・関係・留保を、他者へ届くpublic-safeな表現物へ変換したユーザー所有artifactである。

`piece_text`はraw inputの代替正本ではない。raw inputはユーザーが最初に置いた記録として残り、PieceRecordはそのsource identityとbody-free lineageを保持する。

## 2. content owner separation

```text
saved input owner:
  source body / source identity / owner authentication

PCE-2 handoff:
  source ID / version / commitment / role / stage / eligibility
  body-free

PCE-4 content owner:
  meaning preservation
  format realization
  public-safety transformation
  canonical piece_text

PCE-5 visual owner:
  visual_recipe
  renderer / export / layout

PCE-3 lifecycle owner:
  save / visibility / quota / delete
```

PCE-4はsource bodyを認証済みownerから一時的に読むことを許すが、source bodyをlineage、public metadata、monitoring、export metadataへ複製しない。

## 3. Piece本文の目的順位

```text
priority 1:
  public / external shareに耐える安全化

priority 2:
  inputの核を潰さず他者へ伝える

priority 3:
  visual cardで読める構成へ整える
```

短くすること自体を目的にしない。  
文字数を減らすために意味、否定、留保、対比、時間範囲、関係性を落とすことを禁止する。

## 4. meaning anchor model

生成前に、sourceから次のうち該当するanchorを抽出する。

| anchor | role | preserve rule |
|---|---|---|
| `subject_anchor` | 誰の経験・考えか | ownerの一人称を別人・一般論へ変えない |
| `stance_anchor` | 感情、価値、願い、判断、境界 | sourceにない立場を追加しない |
| `object_anchor` | 何についてか | unsafe identityは抽象化できるが、対象関係を捏造しない |
| `relation_anchor` | 対比、理由、条件、因果、並存 | 「AだがB」「AだからB」等の関係を落とさない |
| `scope_anchor` | 今、最近、時々、特定場面等 | 一時的状態を恒常的性質へ変えない |
| `uncertainty_anchor` | かもしれない、分からない、迷い | 断定・宣言へ強化しない |
| `negation_anchor` | 〜ではない、望んでいない | 肯定へ反転しない |
| `source_role_anchor` | original / supplemental | supplementalでoriginalを上書きしない |
| `audience_risk_anchor` | 第三者・場所・連絡先等 | public-safe abstractionの対象として保持する |
| `must_keep_anchor` | 消すと核が変わる要素 | final textまたは等価な安全表現へ必ず残す |

anchor本文そのものをpublic metaへ出さない。保存する場合はanchor key、source role、body-free commitment、transform codeに限定する。

## 5. meaning preservation invariants

final `piece_text`は次を全て満たす。

1. sourceに存在しない出来事、意図、診断、性格、原因、未来予測を追加しない。
2. ownerの言葉を、第三者への攻撃、一般化、道徳判断、助言へ変換しない。
3. 感情だけのsourceから、決意・境界・願いを自動生成しない。
4. 迷い・留保・否定を、確信・肯定へ強めない。
5. originalとsupplementalの役割を混ぜない。
6. Emlisの観測文、名乗り、温度、受け止め、質問をPiece本文にしない。
7. Analysisの傾向、期間観測、route、simulationをPiece本文にしない。
8. safety transform後も、少なくとも一つのsource-grounded meaning anchorが残る。
9. transform前後のmust-keep anchor coverageが成立する。
10. final textがsourceより「分かったこと」を増やさない。

## 6. canonical content payload

initial schema:

```json
{
  "schema_version": "piece.content_payload.v1",
  "format_type": "short_essay",
  "body_blocks": [
    "..."
  ],
  "title": null,
  "language": "ja",
  "meaning_contract_version": "piece.content_meaning.v1",
  "safety_contract_version": "piece.public_safety_transformation.v1"
}
```

### canonical reconstruction

```text
quote:
  body_blocks exact1
  piece_text = body_blocks[0]

short_essay:
  body_blocks 1..3
  piece_text = blocks joined by LF LF

declaration:
  body_blocks 1..3
  piece_text = blocks joined by LF
```

`body_blocks`は`piece_text`をlosslessに再構成できるexact substringsであり、hidden explanationやsource bodyを入れない。

initial v1では独立titleを生成しない。

```text
title:
  null exact1
```

理由:

- sourceにない解釈見出しを追加しない。
- titleと本文の二重meaning ownerを作らない。
- PCE-5のvisual labelとcontent titleを混同しない。

## 7. format-independent canonical equality

```text
preview content_payload -> reconstructed piece_text
  ==
preview piece_text
  ==
saved PieceRecord.piece_text
  ==
export renderer input piece_text
```

save、visibility change、export、re-exportで本文を再生成しない。  
`piece_text_hash`はcanonical UTF-8 bytesへbindする。hash normalization exact ruleはPCE-5 / PCE-6で現在のwhitespace-insensitive hashから再検討するが、異なる表示本文を同じrecordとして許容しない。

## 8. line break ownership

content ownerが持つ改行は意味段落・意図的行単位だけである。  
端末幅に応じたwrap、font size、pixel line breakはPCE-5 renderer ownerである。

禁止:

```text
content generation:
  pixel幅を推測して手動折返しを埋める

renderer:
  meaning段落を無視して本文を連結する

export:
  overflowをellipsisで成功扱いする
```

## 9. source stage application

### normal observation

```text
semantic source:
  original exact1
```

### pre-question observation

```text
semantic source:
  original exact1

question decision:
  control only
  content exact0
```

### refined observation

```text
semantic source:
  original exact1
  supplemental exact1

invariant:
  distinct roles
  original overwrite exact0
```

一つのPiece previewはPCE-2のexact1 stage lineageへbindする。後発refined observationによって既存Piece本文を暗黙更新しない。

## 10. low-information source

low-informationを理由にgeneric完成文を大量生成しない。

```text
eligible:
  source-grounded anchor exact1以上
  public-safe textがsourceより情報を増やさない
  active formatのminimum integrityを満たす

ineligible:
  anchor exact0
  sourceを言い換えると新しい意味を発明する
  safety transformationで核がexact0になる
```

ineligible時:

```text
PieceRecord:
  exact0

quota:
  exact0

old Q&A fallback:
  exact0

public body:
  exact0
```

「短い入力だから必ず失敗」ではない。短くても自己完結した一つの核があれば`quote`またはsource-scaled `short_essay`候補になり得る。

## 11. length policy

lengthはformat eligibilityとrenderer planningのsignalであり、truncate authorityではない。

| format | initial content envelope | overflow behavior |
|---|---|---|
| `quote` | 12–120 normalized characters / 1–2 sentences | `short_essay`へ再選定、またはineligible |
| `short_essay` | 24–420 characters / 1–6 sentences / 1–3 paragraphs | PCE-5 long-text policyへ渡す。意味削除で収めない |
| `declaration` | 12–180 characters / 1–4 complete lines | `short_essay`へ再選定、またはineligible |

上記はcontent envelopeであり、iOS / Androidでのpixel fitを保証しない。PCE-5が実際のlayout limitをfinalizeする。

## 12. public misunderstanding resistance

external shareでは元入力・Emlis文脈・Cocolon画面が隣にない。したがってfinal textは単独で次を満たす。

- ownerの経験・考えとして読める。
- 第三者への事実断定や告発に見えない。
- sourceにないdiagnosis / medical / legal / financial claimを作らない。
- 指示対象のない命令文にしない。
- context依存代名詞だけで構成しない。
- unsafe固有対象を除いた後も何を表しているか読める。
- disclaimerを大量付加して本文の主役を奪わない。

## 13. current actual assets and non-adoption boundary

current reusable assets:

```text
piece_text_formatter.py:
  deterministic normalization / PII mask / severe block

piece_generation_policy.py:
  safety classification / text hash / overcompression metadata

piece_composer.py:
  source_claim / must_keep / no Emlis voice / no added claims guards

test_new_national_core_piece_contracts.py:
  URL removal / target abstraction / low-info / hash mismatch contract
```

current not adopted as PCE-4 final owner:

```text
question / answer pair:
  old Q&A contract

fixed question text branches:
  format ownerではない

focus key固有の完成文:
  new Piece generation ownerではない

value_observation piece_question / piece_answer:
  source-grounded signal候補
  final Piece body ownerではない

piece.core.v1:
  current compatibility metadata
  piece.record.v2 content contractではない
```

## 14. prohibited transformations

- raw input全体を安全確認なしにそのままPiece成功とする。
- raw inputをPiece textで上書きしたと扱う。
- Emlis comment / reception / questionをcopyする。
- Analysis inferenceをownerの自己表現へ変える。
- uncertaintyをdeclarationへ変える。
- third-party allegationを事実として残す。
- generic励まし、助言、診断、人格評価を足す。
- case ID、sample sentence、固有語一致だけでformatと本文を決める。
- safetyのために全入力を同じ無内容文へ落とす。
- char limitのためにmust-keep anchorを削る。
- blocked sourceをold Q&Aへfallbackする。
- public/privateでmeaning qualityまたはsafety qualityを変える。

## 15. completion

```text
PIECE_CONTENT_MEANING_V1_FIXED
PIECE_CONTENT_PAYLOAD_V1_FIXED
CANONICAL_VISIBLE_BODY_PIECE_TEXT
RAW_INPUT_REMAINS_SOURCE_CANONICAL
MEANING_ANCHOR_MODEL_FIXED
NO_ADDED_CLAIMS_FIXED
UNCERTAINTY_NEGATION_RELATION_PRESERVED
LOW_INFO_NO_HALLUCINATION_FIXED
TITLE_INITIAL_EXACT0
PREVIEW_SAVE_EXPORT_TEXT_EQUALITY_REQUIRED
QNA_ACTIVE_FORMAT_EXACT0
PRODUCTION_EFFECT_EXACT0
PCE4_COMPLETE_DESIGN_ONLY
```
