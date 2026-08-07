---
doc_id: piece_visibility_access_contract_20260807
title: "Piece visibility and access contract"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
phase: "PCE-3 Record Lifecycle / Visibility / Quota"
document_status: "PCE3_COMPLETE_DESIGN_ONLY"
contract_id: "piece.visibility_access.v1"
record_contract_id: "piece.record.v2"
source_cocolon_head: "50749566a11bade518add57d07cedbee4f5ab379"
source_cocolon_tree: "75084995241bea25fb787b79cd691caab4f22dba"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
source_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
source_roadmap_sha256: "2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939"
automatic_progression: false
production_effect: "exact0"
---

# Piece visibility and access contract

## 1. 結論

```text
visibility contract:
  piece.visibility_access.v1

visibility_scope:
  private | public

default:
  private

public meaning:
  Cocolonのcurrent viewer-access policyで許可された他者に見える。
  全世界公開、無認証公開、検索engine公開を意味しない。

private meaning:
  ownerだけがCocolon内で読める。
  owner historyに残る。
  ownerはpreview / export / re-exportできる。
  follower feed、public profile、direct non-owner read、unread、resonance、
  friend notification、discoveryへ出さない。
```

`visibility_scope`は`lifecycle_status`と独立する。`saved + private`と`saved + public`は同じPieceRecordの正規状態である。

## 2. current actualから確認したaccess owner

### 2.1 current generated Q&A access

current backendは概ね次でreadを絞る。

```text
source_type = emotion_generated
is_active = true
status in (ready,published)
public display body exists
```

owner以外は`myprofile_links`等のaccess relationを必要とする。Nexusはselfとfollowed ownerを集め、non-owner detailではprofile linkを確認する。resonanceはself不可、followed ownerだけをeligibleにする。

### 2.2 current DB boundary

PCE-0 actual catalog:

```text
public.mymodel_reflections:
  RLS enabled = true
  RLS forced = false
  policy count = 0

public.pieces:
  security_invoker = true

current access:
  application service owned
```

したがって、PCE-3は「RLSが既にprivate/publicを守る」とは扱わない。new dedicated tableのRLS / grants / service-role / read projectionはPCE-6がexact化する。

### 2.3 current missing capability

current recordには次がない。

```text
visibility_scope
owner-only saved Piece history
public/private toggle
private feed exclusion contract
visibility-versioned cache invalidation
private export boundary
```

PCE-3はこの未実装を設計済みに変換しない。

## 3. access predicates

### 3.1 canonical predicate

Piece bodyを返してよいのは次のいずれかだけである。

```text
OWNER_READ:
  authenticated viewer == owner_user_id
  lifecycle_status == saved
  record not deleted

AUTHORIZED_PUBLIC_READ:
  authenticated viewer != owner_user_id
  lifecycle_status == saved
  visibility_scope == public
  current Piece viewer-access relation == allowed
  record not deleted
```

preview owner read:

```text
authenticated viewer == owner_user_id
lifecycle_status == preview_draft
preview token / identity valid
```

その他はdenyする。

### 3.2 existence concealment

non-ownerがprivate / deleted / inaccessible Pieceのpublic IDを指定した場合:

```text
response:
  not found equivalent

must not disclose:
  record existence
  owner identity
  former public state
  deletion state
  piece_text hash
  metrics
```

owner向けhistory / management APIだけがprivate recordを返せる。

### 3.3 owner access is not public access

ownerが自分のpublic Pieceを読む場合でも、owner authorization pathで成立してよい。owner readをpublic access relationに依存させない。

## 4. surface access matrix

| Surface / operation | `saved + private` owner | `saved + private` non-owner | `saved + public` owner | `saved + public` allowed non-owner | inaccessible non-owner |
|---|---:|---:|---:|---:|---:|
| owner history | yes | no | yes | no | no |
| direct detail | yes | no | yes | yes | no |
| Nexus feed | owner-history側のみ | no | yes | yes | no |
| public profile Piece list | no public projection | no | yes | yes | no |
| unread count | no | no | self=false | eligible | no |
| read marker | owner optional/no public count | no | owner no public increment | yes | no |
| resonance | no | no | no self-resonance | relation依存 | no |
| export / re-export | yes | no | yes | no | no |
| visibility toggle | yes | no | yes | no | no |
| delete | yes | no | yes | no | no |
| metrics body/API | owner aggregate only if product exposes | no | owner aggregate | allowed public projection only | no |

「Nexus feedのowner history側」は、同じcardをpublic feedへ混ぜるという意味ではない。PCE-9Dのowner Piece historyとPCE-9FのNexus public feedを別projectionにする。

## 5. private leak path catalog

PCE-7のnegative testとPCE-U1 auditは最低限次を確認する。

### 5.1 API / DB

1. `public.pieces`またはdetail queryがprivateを返す。
2. direct ID lookupがvisibility filterなしでrowを返す。
3. service-role query後のapplication filtering漏れ。
4. RLS / view / grantがowner外readを許す。
5. legacy Q&A routeがnew private recordをprojectionする。
6. count / unread endpointがprivate存在を漏らす。
7. error messageがprivate recordの存在・owner・旧公開状態を漏らす。
8. batch / sort / search / pagination cursorにprivateが混ざる。
9. stale follower relationshipでprivateを返す。
10. deleted rowまたはcleanup途中rowを返す。

### 5.2 RN / local state

11. public→private後もNexus stateに残る。
12. query cache / optimistic state / offline cacheからprivate bodyが見える。
13. notification payloadにprivate body / ID / ownerが残る。
14. deep link historyがprivate body previewを保持する。
15. screenshot / share previewをvisibility toggleで自動回収できるように誤表示する。
16. account切替後に前ownerのprivate cacheが残る。
17. owner history responseをpublic profile screenへ再利用する。
18. accessibility label / analytics breadcrumbへbodyが入る。

### 5.3 metrics / background processing

19. private saveでfriend notificationを発行する。
20. private Pieceをunread countへ入れる。
21. private detail attemptでview metricを増やす。
22. private Pieceへresonanceを作る。
23. ranking / global summary / account status queueへprivate bodyを送る。
24. logs / monitoring / crash reportへpiece_text、source body、Emlis bodyを送る。
25. public→private後もdiscovery / ranking materialに残る。
26. cache invalidation失敗時にsource authorizationを再確認せずbodyを返す。

### 5.4 export / external copy

27. private exportにhidden source / Emlis body / internal metaを含める。
28. export actionがCocolon visibilityをpublicへ変える。
29. share sheetを開いただけでquotaを再消費する。
30. privateへ戻せば外部SNS画像も消えると誤表示する。

このcatalogはrelease blockerの最小集合であり、PCE-7でmachine-checkableなtestへ分解する。

## 6. feed and history contract

### 6.1 owner history

owner historyは次を返せる。

```text
lifecycle_status = saved
owner_user_id = authenticated owner
visibility_scope = private | public
deleted exact0
```

owner historyはpublic feed queryをvisibility無視で流用しない。private bodyを返すため、owner authorizationをserver側で確定する。

表示候補:

```text
Piece body / visual preview
private / public label
saved_at
first public time if any
latest visibility change time
export / re-export action
visibility toggle
delete
```

exact RN layoutはPCE-6 / PCE-9D。

### 6.2 Nexus / public profile

eligible predicate:

```text
lifecycle_status = saved
visibility_scope = public
current viewer relation allowed
```

private、deleted、preview、cancelled、rejected、expiredはexact0。

`public`でも全世界公開ではない。current follower / profile-link accessをnew Piece access policyへbindする。

### 6.3 unread

- private saveでunreadを作らない。
- public saveまたはfirst private→public後、authorized viewerの未読計算対象になり得る。
- public→private後は未読集合から即時除外する。
- re-public時の未読扱いはsame recordの既存read identityを維持し、visibility toggleだけで「新しいPiece」と再通知しない。
- 本文・formatが変わるnew recordだけが新しいunread identityを持つ。

## 7. visibility transition effects

### 7.1 save private

```text
record:
  saved

scope:
  private

owner history:
  include

Nexus / profile / unread:
  exclude

read / resonance / ranking:
  no new state

notification:
  exact0

export:
  owner allowed

quota:
  exact1
```

### 7.2 save public

```text
record:
  saved

scope:
  public

owner history:
  include

Nexus / profile / unread:
  eligible under access policy

notification:
  Piece-specific friend push exact0
  source input notificationとは別

quota:
  exact1
```

### 7.3 private -> public

```text
lifecycle:
  saved unchanged

visibility_version:
  +1 on actual change

Nexus / profile:
  eligible after commit

existing metrics/read/resonance:
  retain and resume if record was public before

unread:
  same record identity
  republishだけでnew notification扱いにしない

notification:
  exact0

quota:
  exact0
```

### 7.4 public -> private

security ordering:

```text
1. visibility source-of-truthをprivateへcommit
2. all read pathsがsource predicateでdeny
3. feed / profile / unread / ranking projectionをinvalidate
4. cache / background artifactsをpurgeまたはversion invalid
```

cache purge完了前でも、direct readはcurrent visibilityを再認証しなければならない。

effects:

```text
metrics/read/resonance:
  body-free related stateをrecord存続中はretain
  non-owner projection exact0
  new writes exact0

notification:
  exact0

quota:
  exact0

external copies:
  unaffected / unrecoverable
```

### 7.5 re-public

same record identityを維持する。

```text
new Piece record:
  exact0

quota:
  exact0

friend notification:
  exact0

prior metrics:
  retained

public visibility:
  resumes after authorized commit
```

## 8. metrics / read / resonance handling

### 8.1 while private

- non-owner view increment exact0。
- non-owner read marker upsert exact0。
- resonance create/delete exact0。
- ranking/discovery inclusion exact0。
- ownerがhistoryで見るaggregateはbody-freeで、viewer identityを漏らさない。
- public時に蓄積したaggregateはrecord存続中保持できるが、private期間のpublic metricとして増やさない。

### 8.2 after public -> private

existing stateをすぐphysical deleteしない。理由:

1. re-public時にsame record identityと過去のpublic反応を維持する。
2. visibility toggleでmetricsをresetし、ランキング・quota・反応を操作する抜け道を作らない。
3. deleteとhideを分離する。

ただしnon-owner API、feed、rankingへ返さない。delete時にrelated stateをpurgeする。

### 8.3 delete

metrics / reads / resonance / discovery / logsのrecord-owned stateを削除する。body-free quota consumption eventだけはrefund防止のため保持する。

## 9. cache contract

PCE-6 / PCE-7は次のいずれか、または同等以上を成立させる。

```text
cache key:
  piece_id + visibility_version + viewer access identity

or

cache read:
  current visibility / lifecycleを毎回re-authorize
```

必須:

- public→private後、stale public bodyを返さない。
- access relation解除後、stale follower cacheを返さない。
- account switch後、previous owner private cacheを返さない。
- cache purge failureをsuccessとして隠さない。
- cache / logにraw input、Emlis body、hidden metaを置かない。

## 10. notification decision

PCE-3ではnew Piece-specific friend push / source input notification再送を導入しない。

```text
private save:
  no notification

public save:
  no Piece-specific push
  Nexus / unread projection only

private -> public:
  no notification

public -> private:
  no notification

re-public:
  no notification

delete:
  no notification
```

根拠:

- Pieceはpost-Emlisのoptional branchであり、source input保存時の`notify_friends`とは別責任である。
- same recordのtoggleで通知を再送するとspamとvisibility gamingが起きる。
- roadmapの発売必須scopeはfeed / public-private / shareであり、新しいpush notification subsystemではない。

将来Piece notificationを導入する場合は、別product decision、privacy contract、idempotency、user opt-inが必要である。

## 11. export and private access

ownerはprivate Pieceをexport / re-exportできる。

```text
export allowed:
  lifecycle_status = saved
  authenticated owner exact1

visibility mutation:
  exact0

quota re-consumption:
  exact0
```

export imageはCocolon外へ持ち出されるcopyであり、record visibilityとは別である。external boundaryは`piece.delete_external_share_boundary.v1`を正本とする。

non-ownerはpublic Pieceであっても、owner用re-export APIを使えない。公開cardのscreenshot等はCocolonが回収できない外部行為であり、server export authorizationとは分ける。

## 12. implementation binding requirements

PCE-6:

- dedicated tableのRLS / grants / service role。
- owner history query。
- public feed / detail query。
- visibility PATCH候補とstale-write guard。
- public/private change transaction。
- cache invalidation / projection refresh。
- current follower/profile access policyとのbinding。
- legacy routeがnew private recordを読まないこと。

PCE-7:

- private leak negative exact paths。
- public→private immediate deny。
- relation解除後deny。
- unread / resonance / metric no-write。
- direct ID existence concealment。
- concurrent toggle / delete。
- body-free monitoring。

PCE-9D / 9F:

- owner historyとpublic Nexus rendererを分離。
- private/public label。
- explicit public selection。
- toggle / delete UX。
- stale screen removal。

## 13. STOP conditions

- `public.pieces` projectionがprivateをfilterできない。
- service-role read後、全consumerのapplication filterを証明できない。
- public→private後、cacheを介してbodyが返る。
- private saveがsource input notificationまたはfriend notificationを発火する。
- owner history queryをnon-owner public profileへ流用する。
- visibility changeにnew record / new quotaが必要になる。
- access policy外のpublic Pieceを返す。
- RLS / service role identityが未確認のままproduction DDLを確定する。

## 14. facts / inference / Karen's opinion

### 確認済み事実

current access owner、feed relation、read/resonance/delete paths、PCE-0 catalog、PCE-1/PCE-2 fixed contractsを確認した。new visibility DB/API/RN、cache behavior、actual device behaviorは未実装・未確認である。

### 推測・未確認

- dedicated tableで採るexact RLS policy。
- owner history endpointのexact route。
- current infrastructure cacheの有無。
- notification backendにPiece専用consumerが別途存在するか。
- actual production service role identity。

### 華恋の意見

Pieceをprivateで保存できることは、公開しないための弱い代替機能ではなく、「自分の内側をartifactとして持つ」ことを保証する中核である。一方publicはCocolonの関係性の中で届ける状態であり、無認証の全世界公開ではない。この二つを同じPieceRecordのvisibility差として扱うことで、privateを選んでもquota上損をせず、publicへ変えても同じartifactであり続ける。

## 15. closure

```text
PIECE_VISIBILITY_ACCESS_CONTRACT_V1_FIXED
VISIBILITY_DEFAULT_PRIVATE
PUBLIC_NOT_WORLD_READABLE
PRIVATE_OWNER_ONLY
PRIVATE_OWNER_HISTORY_INCLUDED
PRIVATE_EXPORT_REEXPORT_ALLOWED
PRIVATE_NEXUS_PROFILE_UNREAD_RESONANCE_EXACT0
PUBLIC_ACCESS_RELATION_REQUIRED
PUBLIC_TO_PRIVATE_SOURCE_DENY_FIRST
VISIBILITY_VERSION_REQUIRED
PRIOR_PUBLIC_METRICS_RETAINED_WHILE_HIDDEN
PIECE_SPECIFIC_FRIEND_NOTIFICATION_EXACT0
PRIVATE_LEAK_PATH_CATALOG_FIXED
PRODUCTION_EFFECT_EXACT0
PCE3_COMPLETE_DESIGN_ONLY
PCE4_NOT_ACTIVATED
AUTOMATIC_PROGRESSION_FALSE
```
