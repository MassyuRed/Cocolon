# 8. detailed phases

## PCE-0 Current Contract Pin

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

future資料だけでPieceを理解せず、current実装と契約を一枚のactual inventoryへ固定する。

### 作業

1. current heads / tree / target blobsを再取得する。
2. Piece write pathを追跡する。
3. Piece read pathを追跡する。
4. preview / publish / cancel / quotaのrequest-responseを記録する。
5. draft / ready / active / rejected / deletionの実stateを記録する。
6. public access / follower / owner / resonance / read / deleteを記録する。
7. current quota count pointを確認する。
8. current DB table / view / RLS / migration ownerを確認する。
9. current feature flagの有無を確認する。
10. current test inventoryを作る。
11. production DB / actual device / store等、GitHubだけでは未確認のものを分ける。

### 成果物

```text
Piece_Current_Contract_Inventory_YYYYMMDD.md
Piece_Current_Owner_Map_YYYYMMDD.md
Piece_Current_Unconfirmed_Ledger_YYYYMMDD.md
```

### 完了条件

- write pathとread pathのcurrent ownerが分かる
- legacy aliasとcurrent ownerを区別できる
- DB physical nameを推測していない
- public/private future fieldをcurrentに存在すると誤認していない
- current quotaの消費点が分かる
- current testで証明済み／未証明を分けている

### STOP

- current DB / RLS / migrationを特定できず、future lifecycle設計に影響する
- current head driftで受領資料のactual auditが無効になる
- current public accessのownerが競合する

### Ultraへ変わる条件

なし。大量であっても分割可能なread-only inventoryである。

---

## PCE-1 Piece Identity / Compatibility Decision

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

Piece v2相当のidentityを決め、current Q&Aとfuture visual Pieceの関係を一意にする。

### 決定対象

1. current Q&Aを現役formatとして残すか。
2. `piece_contract_version`を持つか。
3. old recordをmigrationするか、adapterで読むか。
4. old/new cardをNexusでどう描き分けるか。
5. old route / field / storageをいつまでcompatibility ownerとして残すか。
6. current normative Piece定義をどの正本で更新するか。
7. user-facing名称は「Piece」のままか。
8. historical recordの見た目を後から変えるか。

### 華恋の初期推奨

```text
Q&Aは現役formatとして残す。
new Pieceはadditive versioned contractにする。
existing recordsは一括migrationしない。
Nexusはversion-aware rendererで共存させる。
old route / field / storageは発売安定まで残す。
```

### 成果物

```text
Piece_Identity_Compatibility_Decision_YYYYMMDD.md
Piece_Record_Version_Matrix_YYYYMMDD.md
Piece_Normative_Definition_Update_Map_YYYYMMDD.md
```

### 完了条件

- 旧／新Pieceの境界が一意
- Q&Aの扱いが一意
- record migration方針が一意
- Nexus共存方針が一意
- deprecationを発売前作業へ混ぜていない

### STOP

- current record shapeを確認せずversion方針を決める必要がある
- existing public dataを破壊しないとnew contractが成立しない
- Pieceの定義変更がEmlis / Analysisの内部責任を吸収する

---

## PCE-2 Cross-Core Source Handoff

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

EmlisAI、Piece、Analysisを内部統合せず、上位flowで接続する。

### 採用する責任分離

```text
saved input record:
  EmlisAI -> current input observation
  Piece   -> expression / save / share
  Analysis -> period observation / current route
```

### Pieceが受け取る候補

```text
source_input_id
source_input_version
source_input_bundle_commitment
emlis_observation_stage
emlis_observation_result_identity
question_need_decision_identity (if any)
supplemental_answer_identity (if any)
allowed_source_roles
piece_generation_eligibility
```

### Pieceが本文sourceとして使わないもの

```text
Emlis visible comment_text
Emlis human-follow temperature
Emlis internal obligation / AST / candidate body
Analysis inference
simulated route
public metaのhidden field
```

### stage別境界

```text
normal_observation:
  original inputのみをPiece sourceにできる。

pre_question_observation:
  original inputのみ。
  question answerがある前提にしない。

refined_observation:
  original inputとsupplemental answerを別source roleで保持する。
  answerで元入力を上書きしない。
```

### 重要な分割

PCE-2では、abstract handoff contractをProで固定する。

Emlis current owner / question system ownerが安定する前に、exact runtime importやpublic hookを確定しない。

```text
PCE-2A:
  abstract source lineage / schema / negative contract
  -> Proで実施可能

PCE-9C:
  current Emlis ownerへのexact adapter binding
  -> Emlis側のcurrent contractが確定後
```

### 成果物

```text
Piece_CrossCore_Source_Handoff_Contract_YYYYMMDD.md
Piece_Source_Role_Matrix_YYYYMMDD.md
Piece_Forbidden_Mixing_Negative_Contract_YYYYMMDD.md
```

### 完了条件

- Emlis body copyが禁止されている
- original / supplemental sourceが分離されている
- Analysis inferenceをsourceへしない
- Piece生成がAnalysis完了へ依存しない
- source identityなしのPiece生成を成功にしない

### STOP

- Emlis visible bodyを使わないとPiece本文が作れない
- current input record identityを取得できない
- refined stageでoriginal / supplementalを分離できない

---

## PCE-3 Record Lifecycle / Visibility / Quota

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

Piece recordのstate、visibility、quota、delete、external shareを混ぜずに定義する。

### lifecycle候補

```text
preview_draft
saved_private
published_visible
hidden_private_after_publish
republished_visible
cancelled
rejected
deleted
legacy_ready
```

### 絶対分離

```text
record lifecycle status != visibility scope
```

例:

```text
status = ready
visibility_scope = private
```

を許せる設計にし、`published`という語だけでpublicを意味させない。

### visibility

```text
public:
  existing access policyで許可された他者に見える。
  全世界公開ではない。

private:
  ownerのみ。
  owner historyに残る。
  export / re-export可能。
  follower feedに出ない。
  friend notificationを出さない。
```

### toggle

- private -> public
- public -> private
- private -> public再公開
- delete

それぞれについて、feed、metrics、read、resonance、notification、cache、historyの扱いを決める。

### external share boundary

Cocolon内でprivateへ戻しても、保存済み画像・外部SNS投稿は回収できない。

### quota推奨

```text
preview:
  消費しない。

Piece record初回確定:
  1回消費。

private / public:
  同じ1回。

visibility change:
  消費しない。

同一record再export:
  消費しない。

別本文・別formatでnew record:
  1回消費。

failed generation / failed export:
  成立したrecordがなければ消費しない。
```

### 成果物

```text
Piece_Record_Lifecycle_StateMachine_YYYYMMDD.md
Piece_Visibility_Access_Contract_YYYYMMDD.md
Piece_Quota_Consumption_Contract_YYYYMMDD.md
Piece_Delete_ExternalShare_Boundary_YYYYMMDD.md
```

### 完了条件

- private leak pathが列挙されている
- notificationとvisibilityが整合する
- quotaの数え方に抜け道がない
- privateを選ぶことでquota上の不自然な損得がない
- external share回収不能が説明されている
- deleteのphysical / logical責任が分かる

### STOP

- current quotaがpublish countへ強く結合し、private saveを安全に数えられない
- RLS / access ownerを確認できない
- public->privateでfeedから消せない

---
