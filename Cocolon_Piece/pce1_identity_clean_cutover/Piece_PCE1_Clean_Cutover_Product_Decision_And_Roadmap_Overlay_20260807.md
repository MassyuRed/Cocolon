---
doc_id: piece_pce1_clean_cutover_product_decision_and_roadmap_overlay_20260807
title: "Piece PCE-1 clean cutover product decision and roadmap overlay"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
document_status: "CURRENT_PCE1_PRESTART_PRODUCT_DECISION"
pce0_complete: true
pce1_activated: false
automatic_progression: false
production_effect: "exact0"
---

# Piece PCE-1 clean cutover product decision and roadmap overlay

## 1. Mashが確定したproduct decision

2026-08-07、Mashは次を明示した。

```text
current Q&A Pieceはまだユーザーに利用されていない。
既存Q&Aデータを残す必要はない。
旧投稿画面、旧Q&A形式、旧record表示を維持する必要はない。
old / newを両立させるcompatibility設計をproduct requirementにしない。
Pieceは完全に新構造へ切り替えてよい。
```

Pieceのcurrent identityは既に次で固定されている。

```text
PieceはQ&Aそのものではない。
Pieceは、ユーザーの考えや価値観を他者に伝えるための文章へ整形し、画像化する機能である。
```

## 2. これにより撤回されるprior recommendation

次のprior recommendationはcurrentではない。

```text
Q&Aをnew Piece導入後も現役formatとして残す。
existing Q&A recordをadapterで永続表示する。
old / new cardをNexusでversion-aware coexistenceさせる。
old route / field / storageを発売安定までcompatibility ownerとして残す。
Q&A recordをmigrationせず互換rendererだけで保持する。
```

上記を含むroadmap原本、PCE-0 closure文書、過去の華恋出力は、当時の前提に基づくhistorical materialとして保持する。current product decisionは本書を正とする。

## 3. current PCE-1名称と目的

```text
phase:
  PCE-1 Piece Identity / Clean Cutover Decision

state:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED
```

PCE-1の目的は、旧Q&Aとの共存方法を決めることではない。

```text
new Pieceだけを前提に、
product identity、record identity、target storage、posting / preview / image / Nexusの境界、
旧Q&A構造の撤去範囲とclean cutover順序を一意にする。
```

## 4. PCE-1で固定する事項

1. new Pieceの上位identityとuser-facing名称。
2. new Piece recordが持つ本文、画像、visual recipe、source lineage、visibility、lifecycleの境界。
3. new storageを専用tableで作るか、current physical familyを安全に置換・再利用するか。
4. post-Emlis saved-input flowからnew Pieceを生成する入口。
5. new preview、save、public/private、image export、Nexus表示の単一current flow。
6. old Q&A UI、route、service、renderer、quota coupling、DB row、view / index / field dependencyの撤去map。
7. old Q&A dataのexact deletion predicateと、実行前のbody-free count / dependency verification。
8. clean cutoverを一回のbounded implementation sequenceとして行う順序とSTOP条件。
9. current normative Piece定義を更新するowner。

## 5. compatibilityとして行わないこと

```text
old Q&Aの新規生成を残さない。
old Q&A投稿画面を残さない。
old / newの選択UIを作らない。
old record adapterをproduct requirementにしない。
old / new Nexus rendererを並行運用しない。
old route / field / storageを将来ユーザーのために保持しない。
旧データをnew schemaへcontent migrationしない。
```

## 6. destructive scopeの安全境界

このproduct decisionは、旧Q&Aを保存しないことを許可する。ただし、本書だけで即時のDB DELETE / DROP、code削除、route停止を実行しない。

current physical table `public.mymodel_reflections`は、少なくとも次の複数source typeを共有する。

```text
create
generated
emotion_generated
```

したがって、次を分ける。

```text
削除してよい対象:
  current / legacy Q&A Pieceに属するrecord、UI、route、service、renderer、関連state。

この判断だけでは削除しない対象:
  Piece以外のconsumerが必要とするrow、shared table全体、無関係なcreate / generated data、
  account / Analysis / EmlisAI等の別owner。
```

PCE-1 / PCE-6では、source_typeだけで雑に全削除せず、actual writer、reader、foreign / logical reference、quota、metrics、read、resonance、account-deleteへの接続を確認してexact deletion scopeを固定する。

## 7. downstream roadmap overlay

### PCE-2

cross-core source handoffは維持する。旧Q&A body / visible Emlis bodyをnew Piece sourceへ流用しない。

### PCE-3

legacy lifecycleとの互換ではなく、new Pieceのlifecycle / visibility / quotaをcleanに定義する。

### PCE-4 / PCE-5

Q&A format coexistenceを前提にせず、他者へ伝える文章と画像化を中心にcontent / visual contractを設計する。

### PCE-6

最初にtracked application migration baselineを作り、その後、new schema作成とold Q&A data / schema dependency removalをbounded migrationとして設計する。

### PCE-7以降

old / new dual-runをrelease requirementにしない。replacementがcomplete・verifiedになったcutoverでold Piece UI / API / rendererを撤去する。

## 8. current state / non-effects

```text
PCE-0:
  COMPLETE

PCE-1:
  NOT_ACTIVATED

product decision input:
  CLEAN_CUTOVER_FIXED

existing Q&A preservation requirement:
  false

old/new coexistence requirement:
  false

production source change:
  exact0

DB / API / RN / migration change:
  exact0

data deletion:
  exact0

test / runtime execution:
  exact0

automatic progression:
  false
```

## 9. next exact action

Mashの別承認後、PCE-1を次のscopeで開始する。

```text
PCE1_PIECE_IDENTITY_AND_CLEAN_CUTOVER_DESIGN
```

開始時に、旧Q&Aを残すかどうかは再質問しない。既に`残さない / 完全切替`で固定済みである。
