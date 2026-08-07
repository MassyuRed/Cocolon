# 4. release target

## 4.1 2027年3月23日のPiece体験

発売時にユーザーができることを次で固定する。

```text
入力を保存する
↓
Emlisが即時観測を返す
↓
ユーザーが望む場合だけPiece化を選ぶ
↓
Piece previewを見る
↓
public / privateを選ぶ
↓
Piece recordを保存する
↓
必要なら端末保存 / 外部shareする
↓
後から同じrecordを再exportする
```

## 4.2 発売前に守るcurrent asset

```text
preview / publish route
preview / publish本文一致
quota 5 / 30 / unlimited
existing safety policy
mymodel_reflections compatibility
public Piece read / access
Nexus feed
resonance
owner deletion
```

## 4.3 発売前必須additive scope

```text
post-Emlis trigger
export-safe Piece text
contract / format version
visual_recipe
template_version
Piece単位public / private
owner private history
public/private切替
画像preview
端末保存
外部share
recordからの再export
preview / record / export本文hash一致
raw input / Emlis body / hidden meta non-leak
```

## 4.4 第一目標と最低線

第一目標:

```text
content format: 2〜3
visual theme: 2
aspect ratio: 4:5 / 9:16
```

日程上の最低線を別判断する場合:

```text
content format: 1
visual theme: 1
aspect ratio: 1
```

最低線でも削らないもの:

```text
保存
public/private
share
再export
safety
hash一致
legacy compatibility
```

## 4.5 発売後へ回すもの

```text
4形式目以降
多数theme / font
追加ratio
branding位置customization
Piece Seed
Piece Tone
advanced export
simulation Piece
```

---

# 5. provisional product decisions

以下は、本ロードマップを進めるための初期仮説であり、PCE-1でactual contractと照合して正式決定する。

## D-PCE-001 current Q&Aの扱い

推奨:

```text
current Q&A Pieceをhistorical-onlyにしない。
Q&Aを現役のformat_type = qnaとして残す。
```

理由:

- current Q&Aは既にproduct flow、storage、feed、quota、accessへ接続されている
- 一問一答は新Pieceの目的に反しない
- 唯一形式から複数形式の一つへ位置を変えればよい
- historical-only化は不要なmigrationとUI分岐を増やす

## D-PCE-002 version戦略

推奨:

```text
既存record:
  existing contractのままread可能にする。

新record:
  versioned Piece contractを持つ。

Q&A:
  legacy互換だけでなくnew contract上でもqna formatとして生成可能にする。
```

候補field:

```text
piece_contract_version
format_type
piece_text
piece_text_hash
visual_recipe
visibility_scope
export_contract_version
```

## D-PCE-003 existing record migration

推奨:

```text
既存recordを一括書換えしない。
read adapter / default projectionで旧recordを表示する。
必要な場合だけlazy projectionまたはnew write以降のversioned fieldを使う。
```

## D-PCE-004 Nexus共存

推奨:

```text
旧Q&A record:
  current Q&A cardで読める。

new qna record:
  new visual contractを持てる。

new non-qna record:
  format-aware Piece Cardで描画する。
```

Nexusはrecord version / format_type / visual_recipeの有無に応じて描き分ける。

## D-PCE-005 old route / field / storage

推奨:

```text
current route / field / storageを直ちに削除しない。
new path安定後までcompatibility ownerとして残す。
```

削除・deprecationは、発売前Piece完成と同じauthorityに混ぜず、別判断にする。

---

# 6. roadmap overview

| Phase | 名称 | 主目的 | 標準環境 | Work使用 | 主な完了物 |
|---|---|---|---|---|---|
| PCE-0 | Current Contract Pin | current実装・契約・未確認を固定 | `CHAT_5_6_PRO_OK` | なし | actual contract inventory |
| PCE-1 | Piece Identity / Compatibility | Q&A・version・legacy・Nexus方針を決定 | `CHAT_5_6_PRO_OK` | なし | decision ledger |
| PCE-2 | Cross-Core Source Handoff | Emlis後triggerとsource lineageを固定 | `CHAT_5_6_PRO_OK` | なし | handoff contract |
| PCE-3 | Record Lifecycle / Visibility / Quota | state machineとprivacyを固定 | `CHAT_5_6_PRO_OK` | なし | lifecycle / access / quota contract |
| PCE-4 | Content / Format / Safety | Piece本文の意味と形式ownerを固定 | `CHAT_5_6_PRO_OK` | なし | content contract / format policy |
| PCE-5 | Visual Recipe / Export Design | 再現契約とexport owner比較を固定 | `CHAT_5_6_PRO_OK` | なし | visual/export design |
| PCE-6 | API / DB / RN / Migration Design | actual impactとcompatibility migrationを固定 | `CHAT_5_6_PRO_OK` | なし | detailed implementation design |
| PCE-7 | Test / Monitoring / Rollback | failureを止める証拠体系を固定 | `CHAT_5_6_PRO_OK` | なし | RED/QA/monitoring plan |
| PCE-8 | Design Freeze / Work Package Split | 実装をbounded packetへ分解 | `CHAT_5_6_PRO_OK` | なし | design freeze candidate / authorities |
| PCE-9A | Backend Additive Contract | storage/policy/APIをadditive実装 | `CHAT_5_6_PRO_OK` | 原則なし | bounded backend changes |
| PCE-9B | Format / Generation Owner | Q&A固定からformat ownerへ拡張 | `CHAT_5_6_PRO_OK` | 原則なし | generation changes |
| PCE-9C | Post-Emlis Connection | source identityでPiece trigger接続 | `CHAT_5_6_PRO_OK` | 原則なし | adapter / negative tests |
| PCE-9D | RN Preview / History / Visibility | new cardとowner flowを実装 | `CHAT_5_6_PRO_OK` | 原則なし | bounded RN changes |
| PCE-9E | Export Prototype | RN/backend/hybrid候補を試作 | `CHAT_5_6_PRO_OK` + device | 原則なし | prototype evidence |
| PCE-9F | Nexus Compatibility | old/new card共存とaccessを実装 | `CHAT_5_6_PRO_OK` | 原則なし | feed compatibility |
| PCE-U1 | Independent Cross-Repo Audit | 4系統独立auditでintegrationを検証 | `WORK_ULTRA_REQUIRED` | Emlis優先後 | exact independent review |
| PCE-10 | Audit Correction | U1 blockerを最小補正 | 原則`CHAT_5_6_PRO_OK` | atomicならUltra | bounded corrections |
| PCE-11 | Integrated E2E / Actual Device | end-to-endとiOS/Androidを確認 | Pro + `MASH_ACTUAL_DEVICE_REQUIRED` | 条件付き | actual-device packet |
| PCE-U2 | Final Independent Acceptance | release candidate横断受入れ | `WORK_ULTRA_REQUIRED` | Emlis優先後 | final audit / go-no-go material |
| PCE-12 | Release Closure | feature flag / monitoring / rollback / docs | `CHAT_5_6_PRO_OK` | U2後 | release closure packet |

---

# 7. Pro-first runway

Pieceの最初のWork必須gateは`PCE-U1`である。

その前に、次のPro作業を順番に進められる。

```text
PCE-0
PCE-1
PCE-2
PCE-3
PCE-4
PCE-5
PCE-6
PCE-7
PCE-8
PCE-9A
PCE-9B
PCE-9C
PCE-9D
PCE-9E code-side prototype
PCE-9F
```

ただし、実装Phaseへ入るには各bounded implementation authorityとGitHub write承認が必要である。

Work UltraがEmlisAIへ優先配分されている期間でも、少なくともPCE-0〜PCE-8は完全にProで進められる。

PCE-9も、次を守ればProで進められる。

- 一回の作業単位を一repo・一owner・一契約へbounded化する
- deterministic testを持つ
- public/private事故を実装前にREDで固定する
- GitHub反映後にfresh bytes / diff / changed pathsを確認する
- cross-repo全体の独立受入れだけはPCE-U1まで主張しない

---
