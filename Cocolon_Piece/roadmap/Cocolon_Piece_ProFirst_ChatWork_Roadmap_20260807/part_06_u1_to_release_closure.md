## PCE-U1 Independent Cross-Repo Audit

### 環境

```text
WORK_ULTRA_REQUIRED
```

### Work割当順位

```text
EmlisAI current Work-required task
  > Piece PCE-U1
```

EmlisAIの直ちに実行可能なWork作業がある間、PCE-U1はqueueに保持する。

### 目的

一人の華恋による順次実装確認とは別に、複数の独立系統でPiece全体を監査する。

### proposed exact4 review streams

```text
Stream A:
  backend storage / migration / version / quota / rollback

Stream B:
  public/private / access / feed / notification / delete / privacy

Stream C:
  RN preview / owner history / Nexus / export / accessibility / tier

Stream D:
  Emlis-Piece-Analysis handoff / source lineage / non-mixing / release integration
```

### 重要境界

- subagentはread-only review補助
- code編集、最終判断、write、commitは華恋
- 4系統の出力は候補
- 華恋がactual fileと原典を再確認
- 一系統のPASSで全体PASSにしない

### exit

- 4系統のreviewが有効
- material conflictsが解消
- unresolved privacy / access / migration blocker 0
- exact correction listがある
- final integrated E2Eへ進める

### STOP

- Work unavailable
- EmlisAIにより高優先のWork taskがある
- independent reviewer inputが同一資料を読めていない
- private bodyをshareable reviewへ出す必要がある
- audit範囲を安全に固定できない

---

## PCE-10 Audit Correction

### 標準環境

```text
CHAT_5_6_PRO_OK
```

PCE-U1のblockerを、ownerごとのbounded correctionへ戻す。

### Ultraへ変わる条件

- correction自体がatomic multi-agent stageを要求する
- 同じauthority内で複数repositoryを同時変更しないと整合しない
- independent reviewを再実行しなければcompletionを主張できない

その場合のみ`WORK_ULTRA_REQUIRED`へ再分類する。

---

## PCE-11 Integrated E2E / Actual Device

### 環境

```text
Chat側の分析・修正:
  CHAT_5_6_PRO_OK

端末確認:
  MASH_ACTUAL_DEVICE_REQUIRED
```

### 最低flow

```text
input save
Emlis observation
optional question / refined observation
Piece CTA
preview
public/private
save
export
share
re-export
Nexus / owner history
visibility change
Analysis dirty / refresh independence
subscription guard
account visibility
```

### device matrix

- iOS
- Android
- Free
- Plus
- Premium
- short
- long
- Japanese
- mixed Japanese / English
- emoji
- private
- public
- legacy Q&A
- new qna
- non-qna

### 完了条件

- private/public誤認0
- preview/record/export本文不一致0
- major visual collapse 0
- share / save / permission成立
- old Q&A regression 0
- account / tier / access整合

---

## PCE-U2 Final Independent Acceptance

### 環境

```text
WORK_ULTRA_REQUIRED
```

### Work割当順位

EmlisAIのWork critical pathが優先である。

Piece U2は、Piece release candidateができ、かつMashがWork再配分を認めた時だけ実行する。

### 目的

release candidateの最終独立受入れを行う。

### review focus

- current Q&A non-regression
- new format correctness
- public/private
- access / RLS / feed
- preview / record / export equality
- quota
- privacy / body leak
- Emlis / Analysis non-mixing
- feature flag
- rollback
- monitoring
- actual-device evidence
- release blocker 0

### exit

```text
unresolved BLOCKER: 0
unresolved MAJOR: 0
private/public accident: 0
body leak: 0
legacy regression: 0
rollback unproven: 0
```

### automatic progression

false。

U2 PASSだけでproduction deployやstore submissionを許可しない。

---

## PCE-12 Release Closure

### 環境

```text
CHAT_5_6_PRO_OK
```

### 作業

- U2 result反映
- final feature flag
- rollout order
- monitoring query / alert
- rollback drill record
- support / user-facing help
- external share warning
- privacy / Data Safety影響確認
- release notes
- GitHub durable checkpoint

### 完了条件

- public releaseに含めるscopeが固定
- post-releaseへ回すscopeが固定
- rollback command / ownerが分かる
- monitoring ownerが分かる
- support responseがある
- final head / changed paths / remote bytes確認済み

---
