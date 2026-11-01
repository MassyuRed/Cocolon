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


<a id="piece-first-image-save-completion-20261101"></a>
## 2026-11-01 — 保存した感情選択からの画像化・保存一巡

Mashの「完成まで進めて」に基づく変更。詳細は最新weekly第9回§40。保存原本の選択済み感情が特定の本文文型を要求されていた拒否原因を再現し、通常の本人選択そのものを意味根拠へ接続する。GPU/別作者/原文画像fallbackは使わない。

| 既存owner | 今回の責務 |
|---|---|
| API cocolon_meaning_experience_engine/piece_source.py | private PieceSelectionEvidenceを追加。保存JSONのrecord hash・field/index・raw値を本文spanと分離。emotionsとemotion_detailsを同一感情nodeへまとめ、本文で既に同等表現済みなら旧node/ID/本文を維持 |
| API cocolon_meaning_experience_engine/piece_v1c.py | 既存planにSOURCE_RECORDED_FEELING、唯一作者に記録時の本人感情/選択強度を追加。元memo/actionの全命題/順序は保持。感情はshort_essayの根拠になり、意思を創作してdeclarationにはしない |
| API piece_v2_content_policy.py | 保存snapshotからの再導出とauthor-free本文検査で全選択/全原文を照合。選択の削除/重複/別感情/強度変更/恒常化/原因・意思追加を拒否 |
| RN components/piece/PieceVisualCard.js | 明示piece.rn_bitmap_renderer.ios.v1だけ完成採用proofを同artifactへ保持。構築/初回最終採用は元8秒。完成後の閲覧/保存fitは元source expires_atと全identityで判定し、600秒以内に読んで保存できる。prototypeの8秒、saved画像保持、期限外完了拒否は維持 |

公開API/7field source-ref/DB schema/保存枠/owner/receipt/CAS/依存/native描画は不変。新fileなし、STRUCTURE_MAP_DELTA_PRESENT（private選択根拠と既存renderer保持）。本文の曖昧な感情言及や句点なし等の一般文法対応、4B接続、Android/商品受入れの完了へ拡張しない。

局所検証：API6file557 PASS、自然profileの生成→実PGlite preview/visual-change/private保存/同内容再読と元source失効の7 PASS、RN renderer/保存host/exportの251 PASS。反復実行は加算しない。本人対象記録もprivate CPUで生成し本文実読済み、公開testは架空記録。実Auth/実OS/iPhoneの画像保存一巡は配布後に本人確認する。旧native V4 19失敗は未解消。稼働/配布結果はweekly§40へ記録する。


<a id="piece-user-text-only-20261101"></a>
## 2026-11-01 — 画像本文はユーザーが書いた文章だけ

Mashは7001で画像生成・一覧表示・スマホ写真フォルダへの保存成功を確認した。今回、感情選択から「記録時には〜」等の文章を付加しないよう明示し、新規ビルド不要と指定した。以後の新規作成は、ユーザー本文を必要に応じて整形した文章だけを画像へ載せる。本人が元から本文に書いた感情・否定・時点は保持する。

API piece_source.pyの選択JSON根拠はprivate selection_contextsへ分離し、可視graph/owner/planの命題にはしない。原recordへの束縛と変更検知を維持する。piece_v1c.pyの唯一作者は元memo/actionだけを整形し、metadataからの追加節を廃止。piece_v2_content_policy.pyの独立検査は余分な節/段落を拒否する。短い完成文もpaddingなしで扱うためshort_essay下限は非空（1..420正規化字/最大6文、1..3段落）。非表示選択だけで名詞断片を完成文へ昇格しない。quote/declarationの制約、既存安全/owner/source/枠/receiptは保持する。

既存保存済みrecord/本文/hash/端末画像を移行・書換しない。RN製品source/公開wire/DB schema/依存変更0、7001を継続し署名build追加0。STRUCTURE_MAP_DELTA_PRESENT（private選択contextと可視本文の分離）。最新の検証・API配置結果はweekly第9回§41へ記録する。Share送信/Android/一般日本語品質/全機能受入れを本人の今回確認へ含めない。
