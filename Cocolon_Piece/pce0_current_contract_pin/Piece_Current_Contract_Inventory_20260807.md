---
doc_id: piece_current_contract_inventory_20260807
title: "Piece Current Contract Inventory"
created_at: "2026-08-07 JST"
created_by: "Karen"
decision_owner: "Mash"
workstream: "Cocolon / Piece"
phase: "PCE-0 Current Contract Pin"
document_type: "Markdown read-only actual contract inventory"
document_status: "PCE0_STOPPED_WITH_CONFIRMED_INVENTORY_PRESERVED"
stop_reason: "CURRENT_PRODUCTION_DB_RLS_MIGRATION_IDENTITY_NOT_PINNED"
automatic_progression: false
implementation_authority: false
github_write_authority: false
source_change_count: 0
db_change_count: 0
api_change_count: 0
rn_change_count: 0
test_execution_count: 0
runtime_execution_count: 0
github_write_count: 0
current_cocolon_head: "f8ecb44305313497b1eed06a7e5fbfe6151e2b8d"
current_cocolon_tree: "d74be7c0498ca1ec157618b60f615639ec630de6"
current_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
current_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
roadmap_file: "Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807.md"
roadmap_sha256: "a8ec1298901839aaf7421dad1942fe94f6cb1b90bad5a8944dc41ac24cdc69bd"
roadmap_bytes: 49465
roadmap_lines: 1964
---

# Piece Current Contract Inventory

## 0. PCE-0 execution result

### Exact state

```text
PCE-0 GitHub actual inventory:
  PRESERVED

PCE-0 formal completion:
  NOT COMPLETE

PCE-0 terminal state:
  STOPPED_AT_CURRENT_PRODUCTION_DB_RLS_MIGRATION_IDENTITY

PCE-1 automatic progression:
  FALSE
```

PCE-0で要求されたread-only調査のうち、GitHub current sourceから確認できるPieceのwrite、read、storage adapter、access、quota、compatibility、representative test contractは固定した。

一方、future lifecycle / visibility / migration設計の前提になるproduction Supabaseのcurrent DDL、RLS、migration identityはGitHubだけでは固定できなかった。さらに、current codeが書く`source_type = emotion_generated`と、Cocolon前提資料に残る2026-04-26時点の`mymodel_reflections_source_type_check`記録が一致しない。この不一致を推測で閉じないため、ロードマップのSTOP条件に従ってPCE-0を停止した。

確認済みinventoryは後続で再利用可能だが、PCE-0完了、DB compatibility成立、PCE-1開始とは扱わない。

---

## 1. Mashが確定したcurrent Piece product definition

Mashが2026-08-07に明示したcurrent定義は次である。

```text
PieceはQ&Aそのものではない。
Q&AはPieceの一形式である。

current Piece:
  ユーザーの考えや価値観を、
  他者に伝えるための文章へ整形し、
  画像化する機能。
```

### この定義がPCE-0へ与える意味

- current sourceにあるQ&A flowを、Piece全体のproduct identityと誤認しない。
- current Q&Aは、既存実装・既存record・compatibilityを確認する対象である。
- current sourceはまだQ&A固定で、画像化、`format_type`、`visual_recipe`、export contractを持たない。
- したがって、current implementationはPieceの完成定義ではなく、将来Pieceのために保持・拡張すべき既存Q&A基盤である。
- Q&Aを旧仕様由来の一形式として残すか、new contract上でどう表すかは、PCE-1のversion / compatibility decisionへ接続する。

この定義確認はproduct decisionであり、DB・API・RN変更を許可しない。

---

## 2. Source snapshot

| Repository | Current head | Current tree | PCE-0判定 |
|---|---|---|---|
| `MassyuRed/Cocolon` | `f8ecb44305313497b1eed06a7e5fbfe6151e2b8d` | `d74be7c0498ca1ec157618b60f615639ec630de6` | roadmap basisと一致 |
| `MassyuRed/mashos-api` | `315813c7bd3372462de926ddad74df567254a6b5` | `a641510e107d52bb910073f36604c85bd57af150` | roadmap basisと一致 |

head driftによるSTOPは発生していない。

---

## 3. Current implementation summary

### 3.1 Implemented current assets

```text
Emotion inputからのQ&A preview
preview draft作成
preview_idによるpublish / cancel
existing mymodel_reflections familyへの保存
preview / publish本文hash一致
deterministic / rule-based Q&A生成
public-safe display変換
low-info Piece
URL / PII / attack等の安全変換
public Piece read
Nexus feed
self / followed-owner filtering
read / unread
resonance
owner deletion
Free 5 / Plus 30 / Premium unlimited quota
legacy route / module / field compatibility
```

### 3.2 Current sourceに存在しないproduct requirements

```text
Q&A以外の明示的format owner
format_type
piece_contract_version
visual_recipe
template_version
theme / font / aspect ratio
Piece画像preview
画像生成owner
端末保存
外部share
recordからの再export
export identity / export version
Piece単位public / private
owner-only private history
public/private切替
post-Emlis Piece CTA
保存済みinput identityを受けるpost-Emlis adapter
```

### 3.3 Current implementationとMash定義の差分

| 項目 | Mashのcurrent Piece定義 | GitHub current implementation |
|---|---|---|
| product identity | 考え・価値観を他者向け文章へ整形し画像化 | Q&A text preview / publish |
| Q&A | 一形式 | 暗黙の唯一形式 |
| image | 必須機能要素 | 未実装 |
| explicit format | 複数形式を受けられる上位identityが必要 | `format_type`なし |
| version | old/newを区別できる必要 | storage `emotion_reflection.v1`、core `piece.core.v1`はあるがPiece format versionではない |
| public/private | future発売前必須 | user-selectable fieldなし |
| export/re-export | future発売前必須 | owner未実装 |

---

## 4. Current write path

### 4.1 RN entry

```text
Cocolon/screens/InputScreen.js
  current unsaved inputを保持
  emotions / memo / memo_action / category / created_at / notify_friendsを構築
  previewEmotionPiece(payload)を呼ぶ
```

preview可能条件は、current RNの通常入力送信可能条件と強く結合している。現在はPiece専用の保存済みinput selectorではない。

### 4.2 RN API adapter

```text
Cocolon/lib/api/home/emotionPieceApi.js

GET  /emotion/piece/quota
POST /emotion/piece/preview
POST /emotion/piece/publish
POST /emotion/piece/cancel
```

route stringは`PIECE_WIRE`から取得し、current wire契約を一箇所に集約している。

### 4.3 Preview route

```text
mashos-api/ai/services/ai_inference/api_emotion_piece.py
```

current preview flow:

```text
RN current unsaved input
  -> auth / client meta
  -> normalize_submission_payload
  -> generate_emotion_reflection_preview
  -> create_preview_draft
  -> quota status
  -> preview response
```

preview responseの主要field:

```text
preview_id
question
reflection_text
piece_text
answer_display_state
visibility_status
generation_status
transform_mode
safety_level
safety_flags
quota
meta
```

`piece_text`と`reflection_text`はcurrent compatibility上、同一display textを返す。

### 4.4 Generation owner

```text
mashos-api/ai/services/ai_inference/emotion_piece_generation_service.py
```

確認済み:

- current inputだけをsourceにする。
- deterministic / rule-basedである。
- question / answer / focus key / display result / policyを作る。
- current implementationはQ&A固定である。
- external modelを必須としない。

### 4.5 Draft storage

```text
mashos-api/ai/services/ai_inference/emotion_piece_store.py
```

preview時に、同一の`mymodel_reflections` familyへdraft rowを作成する。

```text
source_type = emotion_generated
status      = draft
is_active   = false
version     = emotion_reflection.v1  (content_json内)
```

`content_json`には、少なくとも次が含まれる。

```text
question
answer
q_key
category
emotion_preview
public display bundle
piece_text_hash
national_core / piece_core
previewed_at
Emlis context anchors
```

### 4.6 Publish flow

current routeは`preview_id`を受け、Home command gatewayの`emotion.reflection.publish`へ委譲する。

publish service:

```text
mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py
```

current order:

```text
1. ownerのpreview draftを取得
2. draft statusであることを確認
3. current quotaを確認
4. draft内のemotion_previewを取り出す
5. emotion inputをpersistする
6. 同じpreview rowをpublishする
7. next quotaを取得
8. public-safeなEmlis input_feedbackを返す
```

### 4.7 Important current coupling

現在はPiece publishが次を同時に担う。

```text
emotion input persistence
Piece draft publication
Emlis immediate feedback return
```

これはpost-Emlis Piece flowへ移る際に、そのまま再利用してはいけない重要境界である。保存済みinputからPieceを作るfuture flowでは、二重input保存、二重観測、source identity混同を防ぐadapter分離が必要になる。

ただし、現在の2段階処理がDB transactionとしてatomicかどうかはGitHub sourceだけでは証明できていない。確認済みの呼出順と、atomicity未確認を分ける。

### 4.8 Cancel

current cancelは、ownerのdraft rowを次へ変更する。

```text
status    = rejected
is_active = false
published_at = null
```

rowは削除しない。

---

## 5. Current record identity and lifecycle

### 5.1 Identity markers

| Identity | Current value / shape | Role |
|---|---|---|
| physical family | `mymodel_reflections` | current write/read family |
| source type | `emotion_generated` | generated Piece row識別 |
| storage content version | `emotion_reflection.v1` | current Q&A storage payload |
| core schema | `piece.core.v1` | safety / visibility / hash metadata |
| public ID | `reflection:<row id>` | Nexus / public runtime identity |
| q key | stored `q_key` or generated question hash | Q&A compatibility identity |
| source input scope | `current_input_only` | current generation source boundary |

### 5.2 Missing explicit identity

current recordには、Mashが確定した上位Piece identityを表す次がない。

```text
piece_contract_version
format_type = qna
visual_recipe
visibility_scope
export_contract_version
source_input_id
source_input_version
```

そのため、existing Q&A recordは「Q&A format」と明示されているのではなく、`source_type`, content shape, question/answer fieldsから暗黙に判定されている。

### 5.3 Row lifecycle

```text
preview:
  draft / inactive

publish:
  ready / active

cancel:
  rejected / inactive

owner delete:
  physical row delete
  + metrics / reads / resonance related state delete
```

read-sideは`status in (ready,published)`を許容するが、current publish ownerは`ready`を書いている。`published`はcompatibility許容値であり、current writeのprimary stateではない。

### 5.4 Four distinct visibility layers

現在のPieceでは、次を混同してはいけない。

```text
1. row lifecycle status
   draft / ready / rejected / historical archived

2. row active flag
   is_active true / false

3. internal/public policy metadata
   preview_ready / published / deleted / system_hidden

4. viewer access relation
   self / followed owner / permitted profile link
```

futureの「Piece単位public / private」は、このどれにもまだuser choiceとして存在しない。

---

## 6. Current content, safety, display, and hash contract

### 6.1 Display owner

```text
mashos-api/ai/services/ai_inference/piece_generated_display.py
```

- raw answerをstorageに保持する。
- public-facing display textを別に構築する。
- deterministic normalizationを行う。
- normalized hashを持つ。
- broken fragmentや不自然なQ&A displayを補正する。

### 6.2 Policy owner

```text
mashos-api/ai/services/ai_inference/piece_generation_policy.py
```

current schema:

```text
piece.core.v1
```

current policy classes:

```text
visibility_status:
  preview_ready / published / deleted / system_hidden

generation_status:
  generated / fallback_generated / generation_failed

transform_mode:
  as_is / normalized / abstracted / low_info

safety_level:
  safe / needs_transform / high_risk_transformed / blocked_internal
```

current safetyにはURL、email、phone、address/account相当、attack target等の検出・除去・抽象化がある。

### 6.3 Low-information contract

低情報入力は生成不能として捨てず、`fallback_generated / low_info`としてpublish可能なPiece textを作るcontractがある。

### 6.4 Preview / publish hash

- preview時のpublic display textからPiece text hashを作る。
- publish時にpreview textを再取得してhashを再計算する。
- stored hashと不一致ならpublishを拒否する。
- publishはtextを再生成せず、same preview textを昇格する。

future image exportでは、このtext hashに加え、record / renderer / visual recipe / export versionをどうbindするかが必要になる。

---

## 7. Current read, access, Nexus, resonance, and deletion

### 7.1 Generated Piece read eligibility

```text
source_type = emotion_generated
is_active   = true
status      in (ready, published)
public display text exists
```

### 7.2 Owner / viewer access

- self ownerは自分のrowを読める。
- non-selfはprofile link / follow関係が必要。
- access不成立は403またはnot-found boundaryになる。
- public-facing bodyが空ならread対象にしない。

### 7.3 Nexus feed

current Nexus generated Piece item:

```text
q_instance_id
source_type
owner
question { q_key, title }
body
created_at
metrics { views, resonances }
viewer_state { is_new, is_resonated, can_resonate }
```

current RN cardは明示的なQ&A表示である。

```text
問い
答え
```

visual recipe、image、format rendererはない。

### 7.4 Resonance

- self Pieceにはresonateしない。
- non-selfで、followed ownerの場合にcan_resonateとなる。
- resonance stateとmetricsはPiece rowとは別table familyで保持される。

### 7.5 Owner deletion

current owner deletionはsoft-hideではなく、code上は次である。

```text
1. owner / generated Piece identityを確認
2. mymodel_reflections physical rowをDELETE
3. metrics / reads / resonance related stateをDELETE
```

複数削除を一つのDB transactionへ包む実装は、このread-only source確認では証明できなかった。これは確認済み不具合ではなく、atomicity未確認事項である。

---

## 8. Current quota contract

### 8.1 Tier limits

| Tier | Monthly publish limit |
|---|---:|
| Free | 5 |
| Plus | 30 |
| Premium | unlimited |

month windowはJSTの月初から翌月月初までである。

### 8.2 Count point

current codeは、概ね次でpublished countを求める。

```text
owner_user_id = current user
source_type   = emotion_generated
published_at  within current JST month
```

### 8.3 Preview / publish distinction

- preview routeはdraftを作る。
- publish時にquotaを再確認する。
- quota超過時はpublishを403で拒否する。
- preview作成自体をquota消費として数えない。

### 8.4 Code-level implications requiring later verification

- current count queryは`published_at`を中心にし、status / is_activeを直接filterしていない。
- current owner deletionはphysical row deleteであるため、codeだけを見ると削除後はfuture countから消える。
- concurrent publishの厳密なquota atomicity、DB trigger、lock、unique guardはcurrent production DB identityなしでは証明できない。

これらはPCE-3 quota decisionへ持ち越す。PCE-0では現行codeのcount pointと未確認DB behaviorを分離する。

---

## 9. Current compatibility contract

### 9.1 Active compatibility modules

```text
api_emotion_reflection.py
  -> api_emotion_piece.pyをre-export

api_mymodel_qna.py
  -> api_piece_runtime.pyをre-export
```

旧名はhistorical documentだけではなく、current import compatibility ownerとして生きている。

### 9.2 Wire compatibility

RN `legacyWireContracts.js`は、current Piece routeと旧section / metric / source-type namesを同時に扱う。

current primary route:

```text
/emotion/piece/quota
/emotion/piece/preview
/emotion/piece/publish
/emotion/piece/cancel
```

compatibility markers:

```text
source_type = emotion_generated
public id prefix = reflection:
legacy reflection / mymodel-qna naming
old/new response aliases
```

### 9.3 Core registry

`core_contract_registry.py`はPieceを三大中核の一つとして登録し、current storageを`existing_mymodel_reflections_additive`、primary routeをpreview→publish、compat readerを`compat_mymodel_qna`として保持する。

### 9.4 PCE-1 consequence

old route / field / storageを「名前が古い」だけで削除できない。PCE-1では、現行Q&Aを一形式へ下げることと、compatibility ownerを退役させることを別判断にする。

---

## 10. Current runtime and feature-flag boundary

### 10.1 Route registration

current `app.py`は、少なくとも次を登録する。

```text
api_emotion_piece
api_nexus
api_piece_runtime / compat qna runtime
```

### 10.2 Dedicated Piece kill switch

GitHub current `/app/bootstrap` feature flagsには、専用のPiece enable/disable flagは確認できなかった。

確認できたのは、全体maintenance / version gateやEmlis-related flagsであり、Pieceだけを止めるcurrent runtime flagではない。

### 10.3 Consequence

future visual Pieceをadditive releaseする場合、旧Q&Aへのrollback、new Pieceだけの停止、export停止をどう行うかはPCE-7 / PCE-12で設計が必要になる。

---

## 11. Current test contract inventory

### 11.1 Confirmed representative backend tests

```text
ai/tests/contract/test_new_national_core_piece_contracts.py
```

確認できるcontract例:

- 三大中核registryにPieceがある。
- Piece preview responseへ`piece_text`とcore metaを持つ。
- URLをpublic preview前に除去する。
- attack targetを抽象化する。
- low-info Pieceもpublish可能である。
- preview / publishのsame text hashを保持する。
- hash mismatchを拒否する。

```text
ai/tests/contract/test_mymodel_reflection_display_contracts.py
```

- generated / legacy display compatibilityを固定する。

### 11.2 Confirmed frontend guard path

```text
Cocolon/tests/rn-screen-contracts.test.js
```

RN screen split / current connectionsを守るguard pathとして前提資料に登録されている。

### 11.3 PCE-0 test execution

```text
test execution: exact0
```

PCE-0はread-only inventoryであり、既存testを実行して新しいgreenを主張していない。ここでいう「testで確認」はtest sourceが固定するcontractの確認であり、current runtime greenの確認ではない。

---

## 12. Current DB / RLS / migration boundary

### 12.1 GitHub sourceから確認済み

- current codeのphysical table constantは`mymodel_reflections`である。
- current codeは`source_type = emotion_generated`を書き、同じtypeをread / delete / quotaで使う。
- current codeはdraft / ready / rejected lifecycleを使う。
- read-sideはready / publishedを許容する。

### 12.2 Cocolon前提資料に残る2026-04-26 actual DB audit

当時の監査記録は、少なくとも次を示す。

```text
physical table:
  mymodel_reflections

canonical/read view候補:
  pieces または pieces_read

write path:
  old physical tableを維持

recorded source_type constraint:
  create / generated

recorded status constraint:
  draft / ready / archived / rejected
```

### 12.3 Material inconsistency

```text
current code:
  source_type = emotion_generated

historical audited constraint record:
  source_type in (create, generated)
```

両方がそのままcurrentなら、current writeはconstraintにより成立しない。実際にcurrent Piece flowが成立しているなら、2026-04-26以後にconstraint変更、table/view migration、trigger、別environment差分等が存在する可能性がある。

しかし、そのcurrent DDL / migration / RLS identityをGitHubから特定できなかった。

### 12.4 RLS boundary

2026-04-26監査資料に表示されたpolicy一覧では、`mymodel_reflections`専用policyを確認できなかった。ただしこれは「current productionでRLSがない」と証明するものではない。

次が未確認である。

```text
current table RLS enabled state
current policies
service-role write/read boundary
view security invoker / definer behavior
current grants
```

### 12.5 PCE-0 STOP decision

ロードマップのSTOP条件:

```text
current DB / RLS / migrationを特定できず、future lifecycle設計に影響する
```

が成立した。

したがって、PCE-0は次で停止する。

```text
PCE0_CONFIRMED_CONTRACT_INVENTORY_PRESERVED
PCE0_STOPPED_AT_CURRENT_PRODUCTION_DB_RLS_MIGRATION_IDENTITY
PCE1_NOT_ACTIVATED
```

---

## 13. Current and future separation matrix

| Contract area | Current confirmed | Future / PCE work |
|---|---|---|
| Piece identity | implicit Q&A generated reflection | Mash定義を上位Piece identityへ正本化 |
| format | implicit Q&A only | explicit `format_type`; Q&A is one format |
| content | question + answer display | thought/value communicative Piece text |
| image | none | visual recipe + image preview/export |
| version | `emotion_reflection.v1`, `piece.core.v1` | Piece contract / format / export versions |
| source | current unsaved input | saved input identity + post-Emlis handoff |
| publish | input persistenceとPiece publishが結合 | saved inputからPiece publicationを分離 |
| storage | `mymodel_reflections` family | additive fields or new owner decision |
| visibility | lifecycle + active + access relation | per-Piece public/private + owner history |
| access | self / follow / profile link | old/new record compatible access |
| export | none | device save / share / re-export |
| quota | published row monthly count | format/export/private semanticsを含む再定義 |
| rollback | current Q&A always registered | new Piece / export kill switch |

---

## 14. Inputs prepared for PCE-1

### 14.1 Mash decision already confirmed

```text
Piece != Q&A
Q&A = one Piece format
Piece = thought/value -> communicable text -> image
```

このため、PCE-1の「Piece identity」論点そのものは方向が確定した。

### 14.2 PCE-1で残るdecision

```text
1. explicit Piece contract versionを持つか
2. format_type = qnaをどうdefault projectionするか
3. existing recordを一括migrationせずどう読むか
4. new qna / non-qna / old implicit-qnaをNexusでどう描き分けるか
5. current route / field / storageをどこまでcompatibility ownerとして残すか
6. normative Piece definitionをどの正本へ、いつ更新するか
7. historical recordの見た目を後から変えるか
```

ただし、production DB / RLS / migration identityが未固定のため、PCE-1をformalに開始しない。

---

## 15. Confirmed facts / inference / Karen's opinion

### 15.1 確認済み事実

- current sourceはQ&A固定である。
- current sourceは画像化contractを持たない。
- Q&A recordにexplicit `format_type`はない。
- current sourceは`emotion_generated`をphysical table familyへwriteする。
- preview draftとpublish rowは同じrowである。
- publish serviceはinput persistence後にPiece publishを行う。
- current Q&AはNexus、access、resonance、delete、quotaへ接続済みである。
- old names / modules / routesはcompatibility ownerとしてcurrent sourceに残る。
- current codeとhistorical DB constraint記録にsource_type不一致がある。

### 15.2 推測・未証明

- production DBでは後発migrationにより`emotion_generated`が許可された可能性がある。
- Piece publish途中失敗でpartial effectが起こりうる可能性がある。
- owner delete途中失敗でrelated stateが残る可能性がある。
- hard deleteによりquotaが戻る可能性がある。

上記はcurrent DDL、transaction owner、trigger、runtime結果なしでは断定しない。

### 15.3 華恋の意見

Mashのcurrent定義に基づくと、Pieceの上位identityをQ&Aから切り離す判断は妥当である。現在のQ&Aは捨てる対象ではなく、既存利用者・existing records・Nexusを守るための一形式かつcompatibility baseとして扱うべきである。

一方、Q&Aが一形式になったからといって、existing rowへ後付けで一括`format_type=qna`を書き込む必要はない。まずread adapter / default projectionで旧recordを扱い、新writeからversioned Piece contractを持たせる方が、current dataとrollbackを守りやすい。

ただし、この意見はPCE-1 decision materialであり、current DB actualを見ずにimplementation decisionへ昇格しない。

---

## 16. Exact zero effects

```text
Cocolon source change: 0
mashos-api source change: 0
DB change: 0
API change: 0
RN change: 0
migration: 0
test execution: 0
runtime execution: 0
Work Ultra use: 0
GitHub write: 0
commit: 0
release effect: 0
automatic progression: false
```

---

## 17. Closure

```text
PCE0_GITHUB_ACTUAL_CONTRACT_INVENTORY_CREATED
PCE0_CURRENT_WRITE_READ_STORAGE_ACCESS_QUOTA_COMPAT_TEST_OWNERS_PINNED
MASH_CURRENT_PIECE_DEFINITION_RECORDED_AS_PCE1_INPUT
CURRENT_QA_CONFIRMED_AS_IMPLEMENTED_FORMAT_NOT_PRODUCT_IDENTITY
CURRENT_IMAGE_FORMAT_VISIBILITY_EXPORT_CONTRACT_ABSENT
CURRENT_PRODUCTION_DB_RLS_MIGRATION_IDENTITY_UNRESOLVED
HISTORICAL_SOURCE_TYPE_CONSTRAINT_AND_CURRENT_CODE_MISMATCH_OPEN
PCE0_STOPPED_WITH_CONFIRMED_INVENTORY_PRESERVED
PCE1_NOT_ACTIVATED
SOURCE_CHANGE_EXACT0
TEST_EXECUTION_EXACT0
RUNTIME_EXECUTION_EXACT0
GITHUB_WRITE_EXACT0
AUTOMATIC_PROGRESSION_FALSE
```
