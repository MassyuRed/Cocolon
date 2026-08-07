---
doc_id: piece_delete_external_share_boundary_20260807
title: "Piece delete and external-share boundary"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-3 Record Lifecycle / Visibility / Quota"
document_status: "PCE3_COMPLETE_DESIGN_ONLY"
contract_id: "piece.delete_external_share_boundary.v1"
record_contract_id: "piece.record.v2"
source_cocolon_head: "50749566a11bade518add57d07cedbee4f5ab379"
source_cocolon_tree: "75084995241bea25fb787b79cd691caab4f22dba"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
source_roadmap_sha256: "2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939"
automatic_progression: false
production_effect: "exact0"
---

# Piece delete and external-share boundary

## 1. 結論

```text
delete / external-share contract:
  piece.delete_external_share_boundary.v1

delete:
  owner-only
  terminal
  restore exact0
  quota refund exact0
  Cocolon内のread / feed / history / re-exportを停止
  canonical bodyとrecord-owned stateをphysical purge
  body-free delete receiptだけ保持可能

public -> private:
  Cocolon内のaccessを止める
  external copyは回収不能

delete:
  Cocolon内のrecordを消す
  saved image / OS share / external SNS copyは回収不能

export / external share:
  visibility mutation exact0
  quota consumption exact0
```

Piece record、Cocolon内visibility、exported imageは別のownerである。Cocolon内でprivateへ戻す・削除する操作を、端末や外部SNSにあるcopyの回収機能として説明しない。

## 2. current actual

current owner deleteは次の順で動く。

```text
1. generated Piece rowを取得
2. owner exact1を確認
3. mymodel_reflections rowをphysical DELETE
4. metrics / reads / resonance / logs等をtableごとにDELETE
5. ranking / account / global summary refreshをbackground enqueue
```

確認できたこと:

- owner以外はdelete不可。
- canonical rowはphysical delete。
- related-state cleanupは別tableへの複数operation。
- current codeでは一つのDB transaction / cascadeであることを証明できない。
- cleanup failureはtable名を`failed`へ返し得る。
- current row delete後、monthly quota countから消え得る。

new Pieceでは、body concealment、related cleanup、quota retentionを分けて設計する。

## 3. delete authority

allowed actor:

```text
authenticated owner exact1
```

not allowed:

```text
follower
profile-linked viewer
resonating viewer
export recipient
client-supplied owner ID only
```

account deletion、legal retention、administrative moderationは別ownerであり、PCE-3のowner deleteへ混ぜない。PCE-6でaccount-delete cascadeとの接続を確認する。

## 4. canonical delete operation

logical request:

```text
piece_id
owner authorization
delete idempotency key
expected lifecycle / version
```

preconditions:

- `lifecycle_status=saved`。
- authenticated ownerと`owner_user_id`が一致。
- recordがnew `piece.record.v2`。
- stale delete / visibility raceを検出できる。

terminal outcome:

```text
lifecycle outcome:
  deleted

normal record read:
  exact0

owner history:
  exact0

public feed / profile:
  exact0

read / unread / resonance / ranking:
  exact0

export / re-export:
  exact0

restore:
  exact0

quota refund:
  exact0
```

## 5. conceal-first deletion sequence

security order:

```text
D0 authorize owner
D1 commit a non-readable deletion boundary
D2 invalidate public/private projections and cache
D3 purge canonical record body / visual / source lineage
D4 purge record-owned metrics / reads / resonance / discovery state
D5 retain body-free delete receipt and quota consumption identity
D6 enqueue body-free downstream refresh
```

D1完了後は、D3/D4がretry中でもbodyを返してはいけない。

PCE-6のphysical implementation候補:

```text
A. one transaction + FK cascade
B. tombstone/visibility deny commit + idempotent purge worker
C. RPC that atomically hides then cascades
```

PCE-3は方式を固定しない。ただし「related cleanupが全部成功するまでpublic rowを見せ続ける」方式は禁止する。

## 6. physical / logical responsibility

### 6.1 logical responsibility

observable contract:

- delete成功後、ownerを含む通常画面にPieceを出さない。
- direct detailはnot-found equivalent。
- public/private toggle不可。
- export/re-export不可。
- same public IDを別recordへ再利用しない。
- delete retryは追加副作用を作らない。

### 6.2 physical responsibility

purge target:

```text
PieceRecord canonical row / body
piece_text
content_payload
visual_recipe
source_lineage
export authorization/cache
owner-history projection
feed/search/ranking projection
record-owned metrics
read markers
resonance
notification/outbox references
discovery/view/resonance logs where record-owned
```

body-free retention allowed:

```text
delete receipt ID
piece_id
owner internal identity
record contract version
deleted_at
delete operation idempotency identity
cleanup state / reason code
quota consumption identity
```

body-free retentionにpiece_text hashを残す場合でも、復元可能body、raw input、Emlis body、visual bytesを含めない。exact retention policyはPCE-6 / privacy review。

### 6.3 quota responsibility

quota eventはdelete targetに含めない。理由は`piece.quota_consumption.v1`のno-refund invariantである。

## 7. partial failure contract

### 7.1 canonical row conceal succeeded / related cleanup failed

result:

```text
user-visible delete:
  succeeded

body access:
  denied

cleanup:
  pending / failed explicit

retry:
  idempotent cleanup only

quota:
  retained
```

monitoringへbody-free failure codeとfailed owner/table categoryを出す。成功を完全cleanupへ偽装しない。

### 7.2 conceal failed

result:

```text
delete:
  failed

record:
  unchanged

related cleanup:
  must not begin

retry:
  allowed under same idempotency owner
```

### 7.3 response lost after delete commit

retryはdelete receipt / absenceからsame terminal resultを返す。new delete event、quota change、notificationを作らない。

## 8. public/private vs external copy

### 8.1 Cocolon visibility owner

```text
private:
  Cocolon内owner-only

public:
  Cocolon current access policyでallowed viewer

delete:
  Cocolon内record unavailable
```

### 8.2 external copy owner

次はCocolon recordと別物である。

```text
deviceに保存した画像
OS share sheetから送信した画像
SNSへ投稿した画像
message / emailへ送った画像
screenshot
recipientが再保存・再投稿したcopy
```

Cocolonはこれらを追跡・回収・削除保証できない。

### 8.3 exact boundary

| Cocolon operation | Cocolon record | device/export copy | external SNS/recipient copy |
|---|---|---|---|
| private save | owner-only | ownerが作れば残る | ownerが共有すれば残る |
| private→public | public policyへ | unchanged | unchanged |
| public→private | owner-onlyへ | unchanged | unchanged |
| delete | unavailable | unchanged / user側削除が必要 | Cocolonから回収不能 |
| account delete | separate contract | unchanged unless device/app local policy | external回収不能 |

## 9. export / share semantics

### 9.1 owner authorization

export / re-exportはowner-only operationにする。

```text
required:
  lifecycle_status = saved
  authenticated owner exact1
  record contract / renderer supported
```

public Pieceだからnon-ownerもserver export APIを使える、とはしない。non-owner screenshot等はCocolonが制御できない別行為である。

### 9.2 visibility independence

```text
private Piece export:
  allowed

private Piece external share:
  owner actionとしてallowed

export:
  visibility_scope unchanged

share:
  visibility_scope unchanged
```

private recordの画像をownerが外部共有しても、Cocolon内recordをpublicへ自動変更しない。反対に、Cocolon内publicであっても、外部copyへlive access controlを付けたとは扱わない。

### 9.3 quota independence

```text
same record first export:
  consume exact0

re-export:
  consume exact0

share-sheet open:
  consume exact0

save-to-device:
  consume exact0

export failure:
  consume exact0
```

new canonical text / new formatを作る場合だけnew record quotaへ戻る。

## 10. external-share warning

user-facing minimum meaning:

```text
この画像を端末へ保存したり外部へ共有した後は、
Cocolon内で非公開に戻したりPieceを削除しても、
保存先や共有先の画像をCocolonから回収することはできません。
```

UI wordingはPCE-6 / PCE-9Eで調整できるが、次を弱めない。

- external copyは回収不能。
- privateへの変更はCocolon内だけ。
- deleteはexternal copyを消さない。
- share actionはvisibilityを変えない。
- hidden source / Emlis body / internal metaはexportしない。

warning timing:

```text
save-to-device:
  action確定前に明示

external share:
  share sheetを開く前または直前に明示

re-export:
  warningが常に参照可能
```

「一度見れば永久に非表示」だけに依存せず、共有結果画面またはhelpから再確認できるようにする。

## 11. export payload privacy

export rendererへ渡せるもの:

```text
piece_text
allowed format projection
visual_recipe
allowed branding
record / renderer / export versions
body-free integrity identities
```

渡してはいけないもの:

```text
raw input
source memo not selected into piece_text
Emlis visible comment_text
Emlis internal AST / obligation / candidate body
Analysis inference
owner email / phone / private profile data
access token
hidden safety meta
source lineage body
quota ledger
delete receipt
```

private/publicは画像内へ自動印字しない。branding / watermark policyはPCE-5。

## 12. cache / file handling

Cocolon server / RN cache:

- delete後にcanonical export cacheから再取得させない。
- public→private後、non-owner cached bodyを再表示しない。
- account switchでlocal private preview/cacheを消す。
- generated fileのtemporary path、permission、cleanupをPCE-9E / device testで確認する。
- CocolonがOS galleryのuser-owned copyを無断削除しない。
- external share先のcopyを削除できたと表示しない。

## 13. old Q&A clean cutover

old Q&A dataのpreservation / migration / compatibility rendererはexact0である。

destructive old Q&A cleanupはPCE-6 removal mapに従う。PCE-3 new owner delete contractを、shared `mymodel_reflections`の`create / generated` dataへ適用しない。

```text
new Piece delete:
  piece.record.v2 exact identity

old Q&A cleanup:
  source_type = emotion_generated exact predicate
  new flow complete/verified後
  separate implementation approval

shared non-Piece rows:
  automatic deletion exact0
```

## 14. monitoring / test requirements

PCE-7 minimum:

1. non-owner delete拒否。
2. deleted record direct read拒否。
3. delete後owner history / Nexus / unreadから消える。
4. delete後export / re-export拒否。
5. partial related cleanup中もbody read exact0。
6. delete retry idempotent。
7. deleteでquota count不変。
8. metrics / reads / resonance purge。
9. public→privateでexternal copy回収を主張しない。
10. private exportでvisibility不変。
11. external shareでquota不変。
12. export payloadにraw input / Emlis body / hidden meta exact0。
13. account switch後private local cache exact0。
14. old Q&A shared-table blanket delete exact0。
15. delete receipt / monitoring body-free。

## 15. implementation ownership

```text
PCE-5:
  renderer / export artifact contract

PCE-6:
  delete API / DB / transaction / cascade
  visibility / cache / owner history
  warning flow contract

PCE-7:
  failure / retry / leak / no-refund RED

PCE-9A:
  backend delete and cleanup

PCE-9D:
  owner history / toggle / delete UX

PCE-9E:
  file save / share-sheet / device cleanup

PCE-9F:
  Nexus removal / stale-state verification

PCE-11:
  iOS / Android actual device verification
```

## 16. STOP conditions

- delete後もbodyをread可能な時間窓が残る。
- owner authorizationなしにdeleteできる。
- related cleanup failureを完全成功として隠す。
- deleteでquota refundしないと上限を実装できない。
- private→public / public→privateをexternal copyの回収機能として表示する。
- exportにraw input、Emlis body、hidden metaを必要とする。
- old Q&A cleanup predicateがshared non-Piece rowsを巻き込む。
- serverがOS gallery / SNS copyを削除できると誤認する。
- delete receiptにbody-full dataを残す必要がある。

## 17. facts / inference / Karen's opinion

### 確認済み事実

current physical deleteとrelated-state cleanup順、current non-atomicity未証明、current quota row-count coupling、PCE-1 clean cutover、roadmapのexternal unrecoverabilityを確認した。

### 推測・未確認

- new dedicated tableのFK cascade。
- current related tablesのall FK / retention requirement。
- exact OS file path / share-sheet behavior。
- external platformの削除API連携有無。
- account deletionとのexact transaction。

### 華恋の意見

privateとdeleteが強い機能であるほど、「外へ出したものまで消える」という誤解を残してはいけない。一方、回収不能だからprivate exportを禁止すると、Pieceを自分のartifactとして持つ価値を損なう。ownerには持ち出す自由を残し、その瞬間にCocolonの管理外へcopyが生まれる境界を正直に示す設計が妥当である。

## 18. closure

```text
PIECE_DELETE_EXTERNAL_SHARE_BOUNDARY_V1_FIXED
OWNER_DELETE_ONLY
DELETE_TERMINAL_RESTORE_EXACT0
CONCEAL_FIRST_PURGE_AFTER
CANONICAL_BODY_PHYSICAL_PURGE_REQUIRED
RELATED_STATE_PURGE_REQUIRED
BODY_FREE_DELETE_RECEIPT_ALLOWED
DELETE_QUOTA_REFUND_EXACT0
PRIVATE_EXPORT_ALLOWED
EXPORT_VISIBILITY_MUTATION_EXACT0
EXPORT_QUOTA_CONSUMPTION_EXACT0
EXTERNAL_COPY_RECOVERY_EXACT0
EXTERNAL_SHARE_WARNING_REQUIRED
OLD_QNA_SHARED_TABLE_BLANKET_DELETE_EXACT0
PRODUCTION_EFFECT_EXACT0
PCE3_COMPLETE_DESIGN_ONLY
PCE4_NOT_ACTIVATED
AUTOMATIC_PROGRESSION_FALSE
```
