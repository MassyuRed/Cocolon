## PCE-4 Content / Format / Safety

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

Piece本文が何を保持し、何を落とし、どの形式へ変換できるかを決める。

### Piece本文の目的順位

```text
1. public / external shareに耐える安全化
2. inputの核を潰さず他者へ伝える
3. visual cardとして読める長さと構成へ整える
```

短くすること自体を目的にしない。

### source ownership

- raw inputは正本として保持する
- Piece textでraw inputを書き換えた扱いにしない
- Emlis bodyをPiece textへコピーしない
- user自由編集でsafety ownerを迂回させない

### format候補

```text
qna
quote
short_essay
declaration
fragment
```

### 初期候補の比較項目

- どのmeaning shapeに向くか
- minimum / maximum text length
- titleの有無
- line break contract
- external shareで誤解されにくいか
- Q&A current compatibility
- safety transformationとの相性
- Free固定format候補
- Plus auto recommendation
- Premium selection範囲

### format owner

`family`や固有語でcase分岐するのではなく、input meaning shape、length、relation、intent、public safetyから決める。

### ユーザー選択

初期は細かい本文編集を許可しない。

候補:

```text
Free:
  format固定。

Plus:
  auto recommendation + 少数theme選択。

Premium:
  format / theme / font / ratioを選択可能。
```

### 成果物

```text
Piece_Content_Meaning_Contract_YYYYMMDD.md
Piece_Format_Owner_Decision_YYYYMMDD.md
Piece_Public_Safety_Transformation_Contract_YYYYMMDD.md
Piece_User_Selection_Boundary_YYYYMMDD.md
```

### 完了条件

- Pieceが短縮要約ではないことを機械契約へ落とせる
- raw input / Emlis body leakを禁止できる
- format決定理由がcase IDや固有語に依存しない
- qna current compatibilityが残る
- user自由編集を許可しない理由がUIとcontractで一貫する

### STOP

- inputの核を保つには自由生成・無制限本文が必要になる
- formatごとに固定完成文を増やす必要がある
- public safetyを保つためQ&A以外を全部無応答にする必要がある

---

## PCE-5 Visual Recipe / Export Design

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

画像そのものを常時保存せず、recordから再現可能なvisual contractを作る。

### visual recipe候補

```json
{
  "format_type": "quote",
  "template_id": "soft_paper_01",
  "template_version": 1,
  "theme_id": "calm",
  "font_style_id": "gentle",
  "aspect_ratio": "4:5",
  "branding_mode": "required_small"
}
```

### 必須identity

```text
piece_text_hash
visual_recipe_hash
template_version
export_contract_version
renderer_version
```

### 再現契約

- 同じrecordと同じrenderer versionで意味的に同じ画像を作れる
- template updateで過去Pieceの見た目を勝手に変えない
- unsupported old templateをどう保守するか決める
- Cocolon内cardとexport imageの本文を一致させる

### export owner候補

```text
A. RN view capture / native image export
B. backend image renderer
C. hybrid
```

### Proで決められること

- owner比較表
- renderer interface
- error / retry contract
- file name rule
- output size候補
- long text policy
- Unicode / emoji / URL / newline test設計
- offline / server cost / cacheの比較

### actual deviceが必要なこと

- iOS / Androidのfont差
- line break差
- pixel / padding / aspect ratio
- share sheet
- permission
- saved file quality
- low-memory / long text

### 初期推奨

```text
record contractはexport ownerから独立させる。
RN-first prototypeを第一候補にする。
実機差が許容できない場合、backendまたはhybridへ切り替える。
```

### 成果物

```text
Piece_Visual_Recipe_Contract_YYYYMMDD.md
Piece_Export_Owner_Comparison_YYYYMMDD.md
Piece_Render_Reproducibility_Contract_YYYYMMDD.md
Piece_LongText_Layout_Policy_YYYYMMDD.md
```

### 完了条件

- image fileをfeed本体にしない
- re-exportに必要なversionが揃う
- past recordの見た目を再現できる
- long textの縮小下限とfailure条件がある
- RN/backend切替でrecord schemaを作り直さない

### STOP

- renderer ownerを決めないとdata contractが成立しない
- font fileの配布が必要になる
- same recordから本文の異なるexportが作られる

---

## PCE-6 API / DB / RN / Migration Design

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

future Pieceをcurrent ownerへ最小additiveで接続する詳細設計を作る。

### DB比較

```text
Option A:
  existing mymodel_reflections / content_json additive extension

Option B:
  existing row + dedicated visual/export child table

Option C:
  new Piece table family + legacy adapter
```

比較項目:

- existing RLS
- owner read
- follower feed
- index
- update visibility
- delete cascade
- old record read
- quota count
- migration
- rollback
- analytics
- export version retention

### 初期推奨

existing table family + versioned content_json additive extensionを第一候補にする。

ただし、次が確認できない限り確定しない。

- production DB shape
- RLS
- indexing
- content_json size
- visibility query
- current read view
- delete policy

### API設計対象

```text
GET  /emotion/piece/quota
POST /emotion/piece/preview
POST /emotion/piece/publish
POST /emotion/piece/cancel
PATCH /emotion/piece/{piece_id}/visibility  candidate
GET   /emotion/piece/{piece_id}             candidate
POST  /emotion/piece/{piece_id}/export      backend owner時candidate
```

route名はcurrent routeとのcompatibilityを見て決める。

### request / response決定

- preview sourceをraw payload再送にするか、saved input IDにするか
- preview responseへformat / visual recipe / visibility defaultをどう入れるか
- publish requestへvisibilityを入れるか
- old clientsのresponse keyをどう保つか
- `reflection_text` compatibilityをいつまで残すか
- `piece_text`をcanonical visible bodyにするか
- error code
- idempotency

### RN設計対象

- Emlis modal CTA
- modalを閉じた後のaction area
- Piece Card preview
- public/private choice
- save / export / share
- owner Piece history
- visibility toggle
- old/new Nexus card
- accessibility
- tier lock
- error / retry

### migration設計

- additive migration
- old row default projection
- no mass rewrite
- rollback
- new client / old backend
- old client / new backend
- partial rollout

### 成果物

```text
Piece_Additive_Data_Contract_Design_YYYYMMDD.md
Piece_API_Compatibility_Design_YYYYMMDD.md
Piece_RN_Flow_Design_YYYYMMDD.md
Piece_DB_Migration_Rollback_Design_YYYYMMDD.md
```

### 完了条件

- DB / API / RN ownerが一意
- old client / old recordの扱いがある
- response key破壊がない
- private queryが安全
- rollbackでcurrent Q&Aへ戻れる
- Emlis fileをPiece実装の都合だけで変更しない

### STOP

- production DB未確認のままirreversible migrationを決める
- existing route削除が必要になる
- current feed queryを全面置換しないとprivateが成立しない

---
