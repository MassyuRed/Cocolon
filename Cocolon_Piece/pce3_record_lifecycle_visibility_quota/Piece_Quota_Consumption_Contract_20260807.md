---
doc_id: piece_quota_consumption_contract_20260807
title: "Piece quota consumption contract"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-3 Record Lifecycle / Visibility / Quota"
document_status: "PCE3_COMPLETE_DESIGN_ONLY"
contract_id: "piece.quota_consumption.v1"
record_contract_id: "piece.record.v2"
source_cocolon_head: "50749566a11bade518add57d07cedbee4f5ab379"
source_cocolon_tree: "75084995241bea25fb787b79cd691caab4f22dba"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
source_roadmap_sha256: "2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939"
automatic_progression: false
production_effect: "exact0"
---

# Piece quota consumption contract

## 1. 結論

```text
quota contract:
  piece.quota_consumption.v1

quota unit:
  first successful PieceRecord save

count point:
  preview_draft -> saved

visibility effect:
  private / public are identical

delete refund:
  exact0

visibility change:
  consume exact0

same-record re-export:
  consume exact0

failed generation / preview / export:
  saved recordが成立しなければconsume exact0

new canonical text or new format:
  new record
  consume exact1
```

current plan contractを維持する。

| plan | JST calendar-month limit |
|---|---:|
| Free | 5 |
| Plus | 30 |
| Premium | unlimited |

quota表示名は「publish回数」ではなく「Piece保存回数」へ意味を更新する。exact RN wordingはPCE-6 / PCE-9Dで固定する。

## 2. current actualと問題

### 2.1 current code

current quotaは次をownerにする。

```text
table/read projection:
  current mymodel_reflections / pieces

predicate:
  owner_user_id
  source_type = emotion_generated
  published_at within current JST month

limit:
  Free 5
  Plus 30
  Premium unlimited
```

preview draftはcountしない。publish直前にcountを確認する。

### 2.2 current contractをfutureへそのまま使えない理由

1. private saveは`published_at`を持たないためcountできない。
2. owner physical deleteでrowが消えると、同月countから消え得る。
3. public→privateで`published_at`をnull化するとcountが戻り得る。
4. concurrent saveのcheckとcommitが別ならlimit超過raceを防げない。
5. response loss retryで同じrecordを二重countする可能性がある。
6. export / visibility / record creationを「publish」という一語へ戻してしまう。

したがって、new Piece quotaはcurrent row countではなく、immutableなfirst-save consumption identityをownerにする。

## 3. confirmed facts

- current plan limitsはFree 5 / Plus 30 / Premium unlimited。
- current month windowはAsia/Tokyoの月初から翌月月初。
- current previewはcountしない。
- current countは`published_at` row数である。
- current owner deleteはphysical row deleteである。
- new Pieceはprivate save、public save、toggle、re-exportを持つ。
- old Q&A record migrationはexact0。
- new Pieceはdedicated record owner directionである。
- `piece.record.v2`ではvisibilityとlifecycleを分離する。

PCE-3でproduction quota implementation、DB ledger、API、test executionはexact0である。

## 4. canonical quota event

logical event:

```text
contract_version:
  piece.quota_consumption.v1

consumption_id:
  immutable opaque id

owner_user_id:
  authenticated owner

piece_id:
  exact saved PieceRecord id

record_contract_version:
  piece.record.v2

consumed_at:
  server-side successful save commit time

month_key:
  consumed_atをAsia/Tokyoへ投影したYYYY-MM

subscription_tier_at_consumption:
  free | plus | premium

idempotency_key:
  exact save operation identity

reason:
  first_saved_record
```

body-free invariant:

```text
piece_text:
  exact0

raw input:
  exact0

Emlis body:
  exact0

Analysis body:
  exact0

visual image bytes:
  exact0
```

physical table / RPC / unique keyはPCE-6で決める。logical uniquenessは次である。

```text
one consumption per piece_id
one terminal result per save idempotency key
```

## 5. consumption matrix

| operation | record effect | quota |
|---|---|---:|
| preview request succeeds | `preview_draft` | 0 |
| preview request fails | none / rejected | 0 |
| preview cancelled | `cancelled` | 0 |
| preview expires | `expired` | 0 |
| policy rejects save | `rejected` | 0 |
| first private save succeeds | `saved + private` | 1 |
| first public save succeeds | `saved + public` | 1 |
| same save response retry | same record | 0 additional |
| private→public | same record | 0 |
| public→private | same record | 0 |
| re-public | same record | 0 |
| same-record re-export | same record | 0 |
| export fails | same record | 0 |
| visual-only operation allowed by PCE-5 | PCE-5 contract | 0 unless new record |
| canonical text変更 | new record required | 1 |
| format変更 | new record required | 1 |
| intentional duplicate new record | new record | 1 |
| delete | deleted | refund 0 |
| account downgrade | existing records unchanged | next save checks current tier |
| Premium save | saved | ledger may record; limit enforcement unlimited |

## 6. private / public equality

```text
private save:
  one Piece artifact

public save:
  one Piece artifact
```

ユーザーがprivateを選んでもquota上の追加損失を受けず、publicを選んでも追加利益を受けない。

禁止:

```text
private saveは無料、publicで初めてcount:
  prohibited

private -> publicで追加count:
  prohibited

public -> privateでrefund:
  prohibited

re-publicで追加count:
  prohibited
```

理由は、quotaの対象が「他者への公開」ではなく、Piece生成・canonical record確定だからである。

## 7. deletion semantics

deleteしてもconsumption eventを消さない。

```text
record:
  physical purge可能

quota event:
  body-free immutable retention

monthly used count:
  unchanged

remaining count:
  unchanged
```

これにより、save→delete→saveを繰り返すquota bypassを防ぐ。

delete eventとquota eventは別ownerにする。delete cleanupがmetrics / reads / resonance / bodyを削除しても、quota consumption identityは残す。

## 8. idempotency and response loss

### 8.1 same save retry

同一save operationは次を返す。

```text
same piece_id
same lifecycle result
same visibility result
same quota consumption_id
additional consumption exact0
```

client retry tokenだけを信用せず、authenticated owner、preview identity、canonical hashes、server idempotency ownerへbindする。

### 8.2 response loss after commit

save commitが成功し、HTTP responseだけ失われた場合:

```text
retry:
  existing saved resultを返す

new record:
  exact0

new quota event:
  exact0
```

### 8.3 failure before commit

quota admissionまたはrecord saveがcommitしなかった場合:

```text
saved PieceRecord:
  exact0

durable quota event:
  exact0
```

quota reservationを先に取る実装なら、同じatomic boundaryでrollback/releaseする。

## 9. concurrency contract

PCE-6 implementationは、少なくとも次を一つのtransaction / RPC / equivalent atomic ownerへ置く。

```text
1. authenticated ownerとcurrent planを解決
2. JST month keyをserver timeから決定
3. current consumption countを取得
4. limitを超えないことを確認
5. preview/hash/source invariantsを確認
6. saved PieceRecordを確定
7. unique consumption eventを確定
8. resultをidempotency ownerへbind
```

concurrent requests:

- limit残1で同時save exact2が来てもsuccessful new recordsはexact1。
- same preview exact2はrecord exact1 / consumption exact1。
- different preview exact2でlimit内なら各record exact1。
- transaction conflictをquota exceededまたはretryable conflictとして明示し、成功へ偽装しない。

exact SQL locking / serializable mode / advisory lock / unique constraintはPCE-6が選ぶ。

## 10. month and tier semantics

### 10.1 month owner

```text
timezone:
  Asia/Tokyo

month key:
  YYYY-MM

boundary:
  JST month start inclusive
  next JST month start exclusive

timestamp owner:
  server committed consumed_at
```

client `created_at`、source input recorded time、export time、public timeをquota monthへ使わない。

### 10.2 tier owner

save admission時のcurrent subscription tierを使う。

```text
Free:
  limit 5

Plus:
  limit 30

Premium:
  limit none / can_save true
```

tier downgradeで既存Pieceを削除・private化しない。次のnew saveからcurrent tier limitを適用する。

tier upgradeで同月に利用可能な上限が増える。既存consumption countは引き継ぐ。

### 10.3 Premium ledger

Premiumはlimit enforcementなしでも、record identity / idempotency / analytics / future auditのためconsumption eventを残せる。ただしUI `remaining_count`はnull相当とする。

## 11. clean cutover semantics

old Q&A rowsはnew `piece.record.v2`へmigrationしない。new quota ledgerにもrecord migrationしない。

```text
new quota activation boundary:
  piece.record.v2 save feature activation time以後

old emotion_generated row count:
  new Piece ledgerへbackfill exact0

old row deletion:
  new quota usageを減らさない / 増やさない
```

release前のinternal / pre-release Q&A dataはclean cutover scopeで別途削除・disableする。PCE-6はactivation timestamp、feature flag、legacy endpoint disable順をexact化する。

この判断は「旧ユーザー履歴を保護しない」というMashのclean-cutover decisionと一致する。現在の実利用者が存在しない前提を実装時に再確認せずproduct migrationへ拡大しない。

## 12. response projection

future quota responseのlogical semantics:

```json
{
  "contract_version": "piece.quota_consumption.v1",
  "subscription_tier": "free",
  "month_key": "2026-08",
  "save_limit": 5,
  "saved_count": 2,
  "remaining_count": 3,
  "can_save": true
}
```

compatibility期間にcurrent keyを残すかはPCE-6がclean-cutover route designで決める。new Piece UIで`publish_limit / published_count / can_publish`をcanonical namingにしない。

body / Piece IDsをquota responseへ列挙しない。

## 13. edge cases

### 13.1 same textを再度保存

- same idempotent retryなら追加consume 0。
- userが別recordとして明示作成したならconsume 1。
- text equalityだけで別recordを無料扱いしない。

### 13.2 format change

saved recordの`format_type`変更はre-exportではない。new preview / new record / consume 1。

### 13.3 source stage change

normal Pieceをrefined sourceへ暗黙更新しない。refinedからnew Pieceを作るならnew record / consume 1。

### 13.4 private toggle

visibilityだけの変更なのでconsume 0。public期間の長さ、回数をquotaにしない。

### 13.5 delete retry

same delete retryでquota eventを消さない。not-found equivalentでもbody-free delete receiptからidempotent successを返せる設計をPCE-6で検討する。

## 14. monitoring and negative requirements

PCE-7は少なくとも次をrelease blockerへする。

1. previewだけでcountが増える。
2. private saveがcountされない。
3. public saveが二重countされる。
4. visibility toggleでcountが変わる。
5. deleteでcountが減る。
6. re-exportでcountが増える。
7. failed exportでcountが増える。
8. failed saveでorphan consumptionが残る。
9. same retryでrecord / countが増える。
10. concurrent saveでlimit超過する。
11. client timeで月境界を操作できる。
12. old Q&A deleteでnew quotaが変わる。
13. Premiumに有限remainingを表示する。
14. downgradeで既存recordを消す。
15. quota metricへpiece_text / raw input / Emlis bodyを出す。

## 15. implementation ownership

```text
PCE-6:
  logical event -> DB/API contract
  unique / atomic / month / tier binding
  activation boundary
  response naming

PCE-7:
  concurrency RED
  retry / response loss
  delete no-refund
  privacy-safe monitoring

PCE-9A:
  backend store / policy / API implementation

PCE-9D:
  quota display / tier UX

PCE-U1:
  storage / access / quota cross-repo independent audit
```

## 16. STOP conditions

- physical row countしかquota ownerにできず、delete no-refundを保証できない。
- private saveを安全にcountできない。
- saveとconsume exact1をatomicにできない。
- limit残数のconcurrent oversubscriptionを止められない。
- old Q&A rowをnew ledgerへmigrationしないとnew Pieceを開始できない。
- visibility toggle / exportをnew record扱いしないと実装できない。
- quota eventへbody-full dataを保存する必要がある。

## 17. facts / inference / Karen's opinion

### 確認済み事実

current plan limits、JST window、published-row count、preview non-consumption、physical delete、PCE-1 clean cutover、PCE-3 required operationsを確認した。

### 推測・未確認

- current productionでconcurrent publishが実際にlimit超過するか。
- DB trigger / external lockがrepository外にあるか。
- exact future quota table名。
- actual subscription change timing behavior。
- pre-release row count。

### 華恋の意見

quotaを公開回数へ結びつけると、privateを選ぶ人が不自然に得をするか、後でpublicにした時に二重に損をする。Pieceの価値は公開状態ではなく、考えや価値観をcanonical artifactへ確定したことにある。したがって、first saved recordを唯一の消費点にし、deleteでも戻さない設計が最も一貫している。

## 18. closure

```text
PIECE_QUOTA_CONSUMPTION_CONTRACT_V1_FIXED
FREE_5_PLUS_30_PREMIUM_UNLIMITED_PRESERVED
JST_CALENDAR_MONTH_PRESERVED
FIRST_SUCCESSFUL_SAVE_CONSUMES_EXACT1
PRIVATE_PUBLIC_EQUAL_CONSUMPTION
PREVIEW_CONSUMPTION_EXACT0
VISIBILITY_CHANGE_CONSUMPTION_EXACT0
REEXPORT_CONSUMPTION_EXACT0
DELETE_REFUND_EXACT0
IMMUTABLE_BODY_FREE_CONSUMPTION_IDENTITY_REQUIRED
IDEMPOTENT_RETRY_NO_DOUBLE_CONSUMPTION
CONCURRENT_LIMIT_OVERSUBSCRIPTION_PROHIBITED
OLD_QNA_BACKFILL_EXACT0
PRODUCTION_EFFECT_EXACT0
PCE3_COMPLETE_DESIGN_ONLY
PCE4_NOT_ACTIVATED
AUTOMATIC_PROGRESSION_FALSE
```
