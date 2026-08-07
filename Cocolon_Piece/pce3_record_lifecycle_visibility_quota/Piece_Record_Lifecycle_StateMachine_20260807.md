---
doc_id: piece_record_lifecycle_state_machine_20260807
title: "Piece record lifecycle state machine"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-3 Record Lifecycle / Visibility / Quota"
document_status: "PCE3_COMPLETE_DESIGN_ONLY"
contract_id: "piece.record_lifecycle.v1"
record_contract_id: "piece.record.v2"
source_cocolon_head: "50749566a11bade518add57d07cedbee4f5ab379"
source_cocolon_tree: "75084995241bea25fb787b79cd691caab4f22dba"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
source_roadmap_sha256: "2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939"
automatic_progression: false
production_effect: "exact0"
---

# Piece record lifecycle state machine

## 1. 結論

```text
record lifecycle contract:
  piece.record_lifecycle.v1

canonical lifecycle field:
  lifecycle_status

allowed values:
  preview_draft
  saved
  cancelled
  rejected
  expired
  deleted

visibility field:
  visibility_scope

allowed visibility values:
  private
  public

absolute invariant:
  lifecycle_status != visibility_scope
```

`piece.record.v2`は、保存状態と公開範囲を別軸にする。

```text
saved + private:
  valid

saved + public:
  valid

preview_draft + private:
  valid

saved_private / published_visible / hidden_private_after_publish:
  canonical lifecycle valueとしては使用しない
```

「publish」という語だけでpublicを意味させない。recordを確定する操作は`save`、他者への可視化は`visibility_scope=public`で表す。

## 2. PCE-3が閉じる問題

current Q&A実装では、次の四層が分かれている。

```text
row lifecycle:
  draft / ready / rejected

active flag:
  is_active true / false

policy display state:
  preview_ready / published / deleted / system_hidden

viewer relation:
  self / followed owner / permitted profile link
```

future Pieceへそのままpublic/privateを追加すると、`ready`、`is_active`、`published`、viewer relationのどれが公開の正本か競合する。

PCE-3では、new Pieceの正本を次へ単純化する。

```text
lifecycle_status:
  recordが候補、確定、終了、削除のどこにいるか

visibility_scope:
  saved recordを誰がCocolon内で読めるか

visibility_version:
  public/private変更の単調増加identity

quota_consumed_at:
  first saved transitionが成立したか
```

exact DB column、constraint、index、transaction、API route、RN stateはPCE-6がcurrent catalogへbindする。

## 3. 確認済み事実

### 3.1 current actual

- current previewは`public.mymodel_reflections`へ`draft / inactive` rowを作る。
- current publishは同じrowを`ready / active`へ更新する。
- current cancelは同じrowを`rejected / inactive`へ更新し、削除しない。
- current readは`status in (ready,published)`、`is_active=true`、public display body存在を要求する。
- current owner deleteはPiece rowをphysical deleteした後、metrics / reads / resonance等を別処理で削除する。
- current quotaはJST月内の`published_at` row数を数える。
- current implementationにはuser-selectable `visibility_scope`がない。
- current production catalogでは`mymodel_reflections`のRLSはenabled、forced=false、policy exact0で、current accessはapplication service ownerである。
- new `piece.record.v2`のdedicated physical owner directionは`public.piece_records`、read projection directionは`public.pieces`である。

### 3.2 PCE-1 / PCE-2から継承する不変条件

- public identityは`piece:<uuid>`であり、旧`reflection:<uuid>`を継承しない。
- Q&Aはnew active format exact0である。
- source rootは保存済みinput identity exact1である。
- Emlis visible body、Analysis inference、hidden metaはPiece sourceにしない。
- `piece_text`はpreview / saved / exportのcanonical visible bodyである。
- old Q&A migration / compatibility renderer / user-visible dual runはexact0である。

## 4. 華恋の判断

### 4.1 previewとsavedを同じrecord lineageで扱う

previewから保存時に本文を再生成しないため、preview candidateは保存後のrecord identityへ連続する。

```text
preview_draft:
  canonical candidate identityを持つ
  public read不可
  quota消費なし

saved:
  canonical PieceRecord成立
  piece_text / source lineageを保存時にfreeze
  quota消費exact1
```

PCE-6は、同一row昇格、preview tableからrecord tableへのtransactional materialization、その他の実装方式を比較できる。ただし、どの方式でも次を守る。

```text
preview piece_text hash == saved piece_text hash
same idempotent save retry == same PieceRecord
save時の本文再生成 exact0
```

### 4.2 default visibilityはprivate

```text
preview_draft visibility_scope:
  private

save requestでvisibilityが欠落:
  privateへfail-closed

unknown visibility value:
  reject

public:
  ユーザーの明示選択がある時だけ
```

これはPieceを「他者へ届く表現物」にする価値を否定しない。公開するかどうかを、生成成功やquota消費の副作用へ混ぜず、ownerの明示選択にする。

### 4.3 status名にvisibilityを埋め込まない

次はcanonical enumにしない。

```text
saved_private
published_visible
hidden_private_after_publish
republished_visible
```

これらはUI説明またはtransition labelとしては使えるが、storage正本にはしない。public/private切替でrecord lifecycleを偽装変更しないためである。

## 5. state definition

| lifecycle_status | meaning | PieceRecord成立 | owner history | public read | quota |
|---|---|---:|---:|---:|---:|
| `preview_draft` | 保存前candidate | no | preview ownerだけ | no | no |
| `saved` | canonical record確定 | yes | yes | `visibility_scope`依存 | first transitionで1 |
| `cancelled` | ownerがpreviewを破棄 | no | no | no | no |
| `rejected` | safety / contractにより保存不可 | no | no | no | no |
| `expired` | 未確定previewの期限切れ | no | no | no | no |
| `deleted` | 保存済みrecordのterminal deletion outcome | no longer active | no | no | refund no |

`cancelled`、`rejected`、`expired`はpre-save terminal outcomeである。PCE-6がphysical retentionを決めても、owner Piece history、Nexus、quotaへ出さない。

`deleted`はprotocol上のterminal resultであり、canonical rowを永久保存しなければならないという意味ではない。physical purge後はbody-free delete receiptだけを残せる。

## 6. allowed transition graph

```text
create preview:
  none -> preview_draft(private)

save private:
  preview_draft(private) -> saved(private)

save public:
  preview_draft(private) -> saved(public)

cancel:
  preview_draft -> cancelled

policy reject:
  preview_draft -> rejected

expiry:
  preview_draft -> expired

visibility change:
  saved(private) -> saved(public)
  saved(public)  -> saved(private)

delete:
  saved(private|public) -> deleted
```

禁止transition:

```text
cancelled / rejected / expired -> saved
deleted -> saved
deleted -> private / public
saved -> preview_draft
visibility change -> new record identity
visibility change -> quota re-consumption
re-export -> lifecycle transition
export failure -> lifecycle transition
```

本文またはformatを変える場合:

```text
piece_text_hash変更:
  same recordのvisibility transitionではない

format_type変更:
  same recordのvisibility transitionではない

result:
  new preview_draft -> new saved record
  quota exact1
```

visual recipeだけの変更がsame recordで許可される範囲はPCE-5が決める。PCE-3は本文・format変更をre-export扱いしないことだけ固定する。

## 7. transition preconditions and effects

### 7.1 create preview

preconditions:

```text
piece.generation_eligibility.v1:
  eligible

saved source owner == Piece owner
supported source stage exact1
forbidden source exact0
```

effects:

```text
lifecycle_status = preview_draft
visibility_scope = private
public read exact0
quota consume exact0
friend notification exact0
```

### 7.2 save

preconditions:

- current ownerのみ。
- preview contract / hash / source lineageがvalid。
- quota admissionが同じatomic boundaryで成立。
- idempotency keyが同じなら既存結果を返す。

effects:

```text
lifecycle_status = saved
visibility_scope = requested public | private
saved_at = server commit time
quota consumption event = exact1
piece_text / hash / source lineage = frozen
```

`public` saveでだけ、`published_at`をfirst public exposure timeとして設定する。private saveではnullでよい。

### 7.3 visibility change

preconditions:

- `lifecycle_status=saved`。
- current ownerのみ。
- expected `visibility_version`または同等のstale-write guard。
- requested scopeがallowed value。

effects:

```text
lifecycle_status:
  unchanged saved

visibility_scope:
  changed if different

visibility_version:
  increment exactly once on actual change

quota:
  unchanged

piece_text / source lineage / format / record id:
  unchanged
```

same valueへのretryはidempotent no-opであり、versionやquotaを増やさない。

### 7.4 delete

preconditions:

- current ownerのみ。
- saved record exact1。
- idempotent delete identity。

effects:

```text
normal read:
  immediately denied

owner history:
  removed

feed / direct detail / resonance / read:
  denied

quota:
  retained, no refund

canonical body / visual / source lineage:
  physical purge required

body-free delete receipt:
  retention allowed
```

詳細は`piece.delete_external_share_boundary.v1`を正本とする。

## 8. time semantics

```text
created_at:
  preview candidate identity creation time

saved_at:
  first successful saved transition time

published_at:
  first successful public exposure time
  once set, historical identityとして保持可能

visibility_changed_at:
  latest actual public/private change time

deleted_at:
  terminal delete commit time

quota month:
  saved_atのserver timeをJST calendar monthへ投影
```

client supplied `created_at`をquota month ownerにしない。

## 9. concurrency / stale write contract

PCE-6実装は少なくとも次を満たす。

1. 同じpreviewに対する同時saveでPieceRecord exact1。
2. quota consumption exact1。
3. public/private同時更新はexpected version不一致をreject。
4. delete commit後のvisibility updateをreject。
5. public→private commit後、stale public cacheからbodyを返さない。
6. network response loss後のretryはsame result。
7. partial cleanup中でもrecord bodyを再公開しない。

exact transaction、RPC、unique constraint、outbox形式はPCE-6で決める。

## 10. cross-owner side-effect matrix

| operation | lifecycle | visibility | quota | feed | metrics/read/resonance | notification | export |
|---|---|---|---|---|---|---|---|
| preview | `preview_draft` | private | 0 | no | no | no | preview only |
| save private | `saved` | private | +1 | no | no new public state | no | owner yes |
| save public | `saved` | public | +1 | eligible | enabled | Piece-specific push no | owner yes |
| private→public | unchanged | public | 0 | eligible | resume | no | owner yes |
| public→private | unchanged | private | 0 | remove | freeze/hide | no | owner yes |
| re-export | unchanged | unchanged | 0 | unchanged | unchanged | no | yes |
| delete | `deleted` | n/a | 0/refund0 | remove | purge | no | no |

Nexus unread計算はfeed projectionの一部であり、private Pieceを数えない。Piece-specific push / friend notificationはPCE-3で導入しない。

## 11. unresolved implementation bindings

以下はPCE-3 design completionを妨げないが、実装済みではない。

```text
exact DB DDL / RLS / indexes / trigger:
  PCE-6

preview physical owner:
  PCE-6

save / visibility / delete API route:
  PCE-6

RN preview / visibility selector / history:
  PCE-6 / PCE-9D

quota ledger physical owner:
  PCE-6 / PCE-9A

RED / concurrency / leak tests:
  PCE-7

visual recipe mutation boundary:
  PCE-5
```

## 12. STOP conditions carried forward

PCE-6または実装時に次が判明したらSTOPする。

- private readをapplication service / DB projectionの全経路でdenyできない。
- public→privateをsource queryから即時除外できない。
- saveとquota consumeをexact1にできない。
- deleteでbodyを隠す前にrelated cleanup完了を待つ必要があり、その間public leakする。
- lifecycleとvisibilityを一fieldへ再結合しないと実装できない。
- old Q&Aへのfallbackが必要になる。

## 13. facts / inference / Karen's opinion

### 確認済み事実

current actual、PCE-0 catalog、PCE-1 record contract、PCE-2 source contractに記載した内容だけを確認済みとする。PCE-3によるproduction change、DB migration、API/RN実装、runtime testはexact0である。

### 推測・未確認

- new dedicated tableのexact DDL。
- physical purgeをsingle transaction / cascade / cleanup queueのどれで行うか。
- preview draftの保存期間。
- current deployment commitとGitHub mainの一致。
- actual concurrent request behavior。

### 華恋の意見

private/publicをstatus名に埋め込むと、公開範囲の変更がrecord生成・quota・通知・削除と再結合する。Pieceが「自分の内側を持ち出せるartifact」であるほど、公開するかどうかはartifactの存在とは別に扱うべきである。そのため、`saved`を一つにし、visibilityを独立させる設計を採用する。

## 14. closure

```text
PIECE_RECORD_LIFECYCLE_CONTRACT_V1_FIXED
LIFECYCLE_STATUS_AND_VISIBILITY_SCOPE_SEPARATED
PREVIEW_DRAFT_PRIVATE_DEFAULT_FIXED
SAVED_PRIVATE_VALID
SAVED_PUBLIC_VALID
VISIBILITY_CHANGE_NOT_NEW_RECORD
VISIBILITY_CHANGE_QUOTA_EXACT0
DELETE_TERMINAL_NO_RESTORE
DELETE_QUOTA_REFUND_EXACT0
PIECE_SPECIFIC_FRIEND_NOTIFICATION_EXACT0
PRODUCTION_EFFECT_EXACT0
PCE3_COMPLETE_DESIGN_ONLY
PCE4_NOT_ACTIVATED
AUTOMATIC_PROGRESSION_FALSE
```
