## PCE-7 Test / Monitoring / Rollback

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

実装前に、Pieceを壊す失敗をREDとrelease blockerへ固定する。

### required negative tests

1. Emlis bodyをPiece本文へコピーする。
2. raw inputを画像化する。
3. preview textとsaved textが違う。
4. saved textとexport textが違う。
5. private PieceがNexusへ出る。
6. public Pieceがaccess policy外へ出る。
7. public->private後もfeedへ残る。
8. private saveでfriend notificationが飛ぶ。
9. template_versionがなく再export不能。
10. legacy Q&A recordが読めない。
11. qna以外のrecordを旧cardが誤解する。
12. quotaをpreviewだけで消費する。
13. visibility changeでquotaを再消費する。
14. failed exportを生成回数へ数える。
15. Free / Plus branding boundaryが破れる。
16. Premium OFFが反映されない。
17. long textが切れても成功扱いになる。
18. hidden safety metaがpublicへ出る。
19. delete後もowner history / feedへ残る。
20. Emlis / Piece / Analysis source roleが混ざる。

### automated suites

- backend unit
- API contract
- store / access integration
- migration
- RN screen contract
- Nexus feed
- quota
- feature flag
- rollback
- deterministic hash

### monitoring

```text
piece_preview_requested
piece_preview_succeeded
piece_preview_failed
piece_record_saved_private
piece_record_published_public
piece_visibility_changed
piece_export_requested
piece_export_succeeded
piece_export_failed
piece_share_opened
piece_reexported
piece_delete_succeeded
piece_access_denied
piece_hash_mismatch
```

raw input、Piece body、Emlis bodyをmetricへ出さない。

### runtime controls

existing `/app/bootstrap` feature flag frameworkを再利用し、候補として次を分ける。

```text
piece_v2_generation
piece_visual_card
piece_export
piece_public_publish
piece_visibility_toggle
```

### rollback

- new generation OFF
- visual card OFF / legacy renderer
- export OFF
- public publish OFF
- visibility toggle OFF
- legacy Q&A read維持

### 成果物

```text
Piece_RED_Contract_Catalog_YYYYMMDD.md
Piece_Test_Matrix_YYYYMMDD.md
Piece_Monitoring_Privacy_Contract_YYYYMMDD.md
Piece_FeatureFlag_Rollback_Design_YYYYMMDD.md
```

### 完了条件

- release blockerがmachine-checkable
- private/public事故を実装後の手動確認だけへ任せない
- monitoringにbodyが入らない
- rollback pathがcurrent Q&Aへ戻れる
- actual deviceだけで確認する項目を分離している

---

## PCE-8 Design Freeze / Work Package Split

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

PCE-0〜7の決定を、実装可能なbounded packetへ分割する。

### 作業

- design conflictsの解消
- unresolved decision ledger
- exact owner / path候補
- dependency graph
- implementation order
- RED first order
- GitHub write unit
- postverification
- STOP条件
- environment classification

### bounded implementation候補

```text
B1 contract/version helpers
B2 storage additive fields / JSON contract
B3 visibility policy
B4 quota consumption owner
B5 preview API
B6 publish API
B7 owner detail / visibility API
B8 format owner
B9 visual recipe owner
B10 RN preview
B11 owner history
B12 Nexus compatibility
B13 export prototype
B14 feature flags / monitoring
B15 integration E2E
```

各packetを一つの巨大authorityへ束ねない。

### 成果物

```text
Piece_Design_Freeze_Candidate_YYYYMMDD.md
Piece_Implementation_WorkPackage_Index_YYYYMMDD.md
Piece_Environment_Assignment_Ledger_YYYYMMDD.md
```

### 完了条件

- Pro packetとUltra gateが明示される
- implementation順が一意
- B1〜B15の依存関係が一意
- no-op / docs-only / code / DB / deviceを区別する
- automatic progression false

### STOP

- unresolved decisionを実装者判断へ押し込む
- DB migrationとUIを一atomic unitにしないと成立しない
- Work Ultraを使わないと設計書自体を完成できないと誤認する

---

## PCE-9A〜9F Pro bounded implementation

### 共通環境

```text
CHAT_5_6_PRO_OK
```

bounded分割とdeterministic verificationで同じ品質を維持できる限り、実装もProを標準とする。

### PCE-9A Backend Additive Contract

- versioned contract
- store lifecycle
- visibility
- quota
- API compatibility
- migration
- unit / integration test

### PCE-9B Format / Generation Owner

- qna current non-regression
- quote / short_essay等の初期format
- format policy
- public safety
- text hash
- no Emlis body copy

### PCE-9C Post-Emlis Connection

- source input ID
- stage identity
- original / supplemental separation
- CTA eligibility
- Piece-side adapter
- Emlis ownerを勝手に変更しない

このpacketはEmlis current contractが確定するまで設計済みpendingにできる。

### PCE-9D RN Preview / History / Visibility

- CTA
- preview
- visibility choice
- owner history
- toggle
- error / retry
- tier display

### PCE-9E Export Prototype

- RN-first候補
- same record re-export
- file naming
- share sheet
- long text
- device packet作成

code-sideはProで進められる。

品質成立にはactual deviceが必要である。

### PCE-9F Nexus Compatibility

- legacy Q&A card
- new qna card
- new visual formats
- public/private filtering
- resonance / read / delete
- owner / follower access

### 共通完了条件

- packet単位test green
- approved exact path以外変更0
- current Q&A regression 0
- body leak 0
- fresh postverification
- durable checkpoint

### 共通STOP

- 一packetの修正が複数repository全体の独立受入れを必要とする
- same authority内で独立reviewがcompletion conditionになる
- Work固有runtimeが必須になる

この場合はPCE-U1へ持ち越す。

---
