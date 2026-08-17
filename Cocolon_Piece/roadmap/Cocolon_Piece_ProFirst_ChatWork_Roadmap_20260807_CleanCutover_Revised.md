---
title: "Cocolon Piece Pro-First / Chat-Work Environment Allocation Roadmap"
created_at: "2026-08-07 JST"
created_by: "Karen"
decision_owner: "Mash"
workstream: "Cocolon / Piece"
document_type: "Markdown roadmap"
document_status: "REVISED_ROADMAP / CLEAN_CUTOVER_PREMISE / IMPLEMENTATION_NOT_STARTED / LOCAL_DOWNLOAD_ARTIFACT"
revision_basis: "Mash 2026-08-07: Q&A data preservation and old/new coexistence are not required"
pce0_state: "COMPLETE"
pce1_product_premise: "CLEAN_CUTOVER_FIXED"
automatic_progression: false
temporary_work_allocation: "WORK_ULTRA_RESERVED_FOR_EMLIS_AI_FIRST"
standard_piece_environment: "CHAT_5_6_PRO_OK"
current_cocolon_head: "f8ecb44305313497b1eed06a7e5fbfe6151e2b8d"
current_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
---

# Cocolon Piece Pro-First / Chat・Work環境配分ロードマップ

## 0. この文書の決定

このロードマップは、Work Ultraが利用可能になった時点ではEmlisAI作業を最優先で再開する、というMashの環境配分方針を前提にする。

```text
当面のWork Ultra:
  EmlisAIのcurrent Work-required作業を最優先する。

当面のPiece:
  ChatのGPT-5.6 Proで要求品質を維持できる作業を先に進める。

将来のPiece:
  Work Ultraを永久に使わないわけではない。
  独立複数agentそのものが完了条件になる横断監査、
  分割不能なatomic integration、最終独立受入れで必要になった時に使う。
```

この環境配分は、Pieceの品質条件を下げるものではない。

- Proだから簡易版にする、という意味ではない。
- Workが使えないため独立review数を減らす、という意味ではない。
- Ultra必須工程をProで完了したことにする、という意味ではない。
- PieceをEmlisAIより優先してWorkへ流す、という意味ではない。
- PieceやAnalysisへUltraを永久に割り当てない、という意味でもない。

本ロードマップは、Pieceの最初のWork Ultra必須gateを後段へ置き、その前にProで進められる設計・監査・契約整理・bounded実装を十分に並べる。

## 0.1 一文での方針

```text
Pieceは、旧Q&A仕様との両立を前提にせず、new visual Piece構造へclean cutoverする。
当面はProで、identity・source・lifecycle・visibility・quota・format・visual・API/DB/RN・test・旧Q&A撤去mapを順に閉じる。
Work Ultraは、EmlisAIを優先した後、Pieceの独立横断監査と最終受入れに限定して使う。
```

## 0.2 この文書が許可しないこと

このロードマップだけでは、次を許可しない。

- GitHub write
- source変更
- DB migration
- API route変更
- RN変更
- Piece public/private仕様の即時変更
- EmlisAI ownerへの接続
- Work Ultra利用
- 追加クレジット購入
- authority activation / consumption
- 次Phaseへのautomatic progression

各設計判断、実装、test、GitHub反映、Work利用は、必要なbounded単位ごとに別途扱う。

---

# 1. source basis

## 1.1 受領した設計・戦略資料

本ロードマップは、次の受領資料を基礎にする。

```text
Cocolon_EmlisAI_ModelFreeNaturalLanguageSurfaceV3_DetailedDesign_ImplementationOrder_20260714_Revised_Cycle(20260806-212529).md
NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723(20260806-212529).md
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(20260806-212530).md
Cocolon_2027_Public_Release_Soft_Launch_And_Growth_Launch_Strategy_GitHubActualAudit_Revised_20260728(2).md
Cocolon_Piece_Card_Image_Export_Redesign_DesignNote_20260707(3).md
Cocolon_WatashiSimulation_RouteBranch_DesignNote_20260708(3).md
```

上記のうち、Piece未来構造の中心資料は次である。

```text
Cocolon_Piece_Card_Image_Export_Redesign_DesignNote_20260707(3).md
Cocolon_2027_Public_Release_Soft_Launch_And_Growth_Launch_Strategy_GitHubActualAudit_Revised_20260728(2).md
```

EmlisAI資料はPieceの内部実装正本ではないが、次の境界確認に使う。

- EmlisAIが現在入力の即時観測ownerであること
- normal / pre-question / refinedのstageが分離されること
- original inputとsupplemental answerを混ぜないこと
- Emlis visible bodyをPiece本文へコピーしないこと
- Work Ultraが当面EmlisAIのcurrent critical pathへ優先配分されること

## 1.2 GitHub current identity

本ロードマップ作成時にfresh確認したcurrent headは次である。

| repository | current head | current tree / note |
|---|---|---|
| `MassyuRed/Cocolon` | `f8ecb44305313497b1eed06a7e5fbfe6151e2b8d` | current main |
| `MassyuRed/mashos-api` | `315813c7bd3372462de926ddad74df567254a6b5` | current main |

Piece実装へ入る時点では、必ずlatest headと本ロードマップのbasis差分を再監査する。

## 1.3 current Piece actual owners

### RN

```text
Cocolon/components/EmotionPiecePreviewModal.js
  current blob: 46c6d88d746f8c03566f552024e0d6606dc7de45
  current role: Q&A Piece preview / quota / publish confirmation

Cocolon/screens/nexus/NexusPieceCard.js
  current blob: 9119e11c99aa3c749ee6cec88e880e83f4683a32
  current role: owner / question / answer / resonance / deleteを持つQ&A card
```

### backend

```text
mashos-api/ai/services/ai_inference/api_emotion_piece.py
  current blob: e814c58b8828699ed1e745f1b72fe363cab4fca0
  current role: quota / preview / publish / cancel route owner

mashos-api/ai/services/ai_inference/emotion_piece_store.py
  current blob: ab61730c1cc4d88e25fc2bc28beb64487be95e6c
  current role: mymodel_reflections draft -> ready/active同一row lifecycle

mashos-api/ai/services/ai_inference/piece_publish_entitlements.py
  current blob: 743cb30b746cd24d70b98b3c208d0885b5c163e8
  current role: Free 5 / Plus 30 / Premium unlimited quota
```

関連ownerとして、実装時に最低限次を再確認する。

```text
Cocolon/lib/api/home/emotionPieceApi.js
Cocolon/screens/NexusScreen.js
mashos-api/ai/services/ai_inference/emotion_piece_generation_service.py
mashos-api/ai/services/ai_inference/piece_generation_policy.py
mashos-api/ai/services/ai_inference/piece_generated_display.py
mashos-api/ai/services/ai_inference/piece_generated_access.py
mashos-api/ai/services/ai_inference/piece_public_read_service.py
mashos-api/ai/services/ai_inference/api_nexus.py
```

## 1.4 current environment rule

環境判定の正本は次である。

```text
Cocolon_前提資料/work_attitude_rules_for_karen/18_chat_work_environment_selection_rule_2026_08_06.txt
blob: db8ef5cac35da5291aa36ed626ae67ffa1649365
```

このruleに従い、Pieceの標準環境はChatのGPT-5.6 Proとする。

Work Ultraが必要になるのは、主に次の場合である。

- 独立複数agent reviewそのものが完了証拠になる
- 同一華恋の反復確認では独立性を正直に満たせない
- 複数repository間の監査を安全に分割できない
- Work固有runtime / filesystem / toolingが成立条件になる
- atomic authorityを分けるとlifecycleやevidence boundaryが壊れる

---

# 2. current Pieceとfuture Pieceの差分

## 2.1 currentで既に存在するもの

```text
Q&A型preview
preview / publish / cancel route
preview_idによるdraft lifecycle
preview / publish本文一致用hash
existing safety / transform policy
mymodel_reflections storage family
public Piece read / Nexus feed
owner / follower access
resonance
owner deletion
Free 5 / Plus 30 / Premium unlimited quota
```

## 2.2 future資料にあり、current ownerでは未実装のもの

```text
Emlis観測後の「この入力をPieceにする」導線
Q&A以外のcontent format
export-safe Piece textのversioned contract
visual_recipe
template_id / template_version
theme_id
font_style_id
aspect_ratio
branding_mode
Piece単位public / private
owner-only private history
public/private切替
画像preview
端末保存
外部share
recordからの再export
export identity / export version
preview / record / export本文hash一致
```

## 2.3 Pieceの定義差分

旧仕様上のPieceは、主にQ&Aで入力の核を他者へ伝える機能だった。

current decisionでは、Q&AをPiece identityとして残さず、次へ切り替える。

```text
Piece =
  自分の内側にあったものを、
  他者に届く表現物として持ち出せる形にする機能。
```

このため、future Pieceは小さな画像追加ではない。

- product identityが変わる
- content format ownerが増える
- record lifecycleが増える
- private/publicの意味が増える
- 旧Q&A data / 旧投稿画面 / old-new共存は保持不要である
- ただし shared table 内の非Piece dataと無関係consumerは守る必要がある
- export後の外部回収不能境界が加わる

---

# 3. temporary environment allocation policy

## 3.1 Work Ultraの優先順位

Pieceロードマップ上のWork Ultra作業は、Workが利用可能になっただけでは開始しない。

次を全て満たした場合にだけ候補になる。

```text
1. Pieceが、ロードマップ上のWork-required gateへ到達している。
2. EmlisAIのcurrent Work-required exact next actionが完了、または外部条件待ちで実行不能である。
3. MashがPieceへのWork割当を明示的に認める。
4. Piece側の別authority / privacy / source / acceptance boundaryが確定している。
```

Workが利用可能でも、EmlisAIに直ちに実行可能なWork-required作業が残る間は、PieceのUltra gateをqueueに保持する。

## 3.2 環境class

本ロードマップでは次を使う。

```text
CHAT_5_6_PRO_OK
  bounded分割とdeterministic verificationで品質を維持できる。

WORK_ULTRA_REQUIRED
  独立複数agent reviewまたは分割不能な横断監査が完了条件。

MASH_ACTUAL_DEVICE_REQUIRED
  Chat / Workでは代替できないiOS / Android実機確認。
  これは環境classではなく外部確認条件。
```

## 3.3 環境配分の原則

### Proへ置くもの

- source / contract inventory
- current / future差分監査
- product identity判断
- clean cutover / old Q&A removal方針
- source lineage設計
- record lifecycle設計
- visibility / quota設計
- content / format / safety設計
- visual recipe設計
- API / DB / RN impact設計
- migration設計
- test / monitoring / rollback設計
- boundedな一repo実装
- deterministic unit / contract test
- small additive correction
- documentation / checkpoint

### Ultraへ置くもの

- 独立review exact4等を完了証拠にする横断監査
- Piece storage / access / feed / privacy / quota / RN / exportを同時に見るmulti-repo audit
- Emlis / Piece / Analysis non-mixingを独立系統で検証するintegration audit
- final release candidateの独立受入れ監査
- 一つのatomic authority内で複数agentの独立性が必要な作業

### Ultraへ置かないもの

- 量が多いだけの資料読解
- 長い設計書作成
- boundedなPython / JS実装
- deterministic testの実行
- hash / diff / source確認
- 一つの問題を順番に調べれば成立する作業

---

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
input -> Emlis -> Piece化のsource boundary
preview / record / export本文一致
quota 5 / 30 / unlimitedのplan contract
public safety policy
public / private access boundary
Nexus / owner historyの新Piece表示
resonance / read / deleteの新Piece責任
shared table内の非Piece data保護
```

旧Q&A preview / 旧Q&A renderer / old-new共存 / 既存Q&A data保持は発売前必須assetではない。

## 4.3 発売前必須clean cutover scope

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
old Q&A撤去map
shared data protection
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

以下は、Mashの2026-08-07 clean cutover決定を反映したcurrent provisional decisionである。
PCE-1でactual contractと照合して正式決定する。

## D-PCE-001 current Q&Aの扱い

決定済み前提:

```text
current Q&A Pieceは、まだユーザーに利用されていない。
既存Q&A dataを残す必要はない。
Q&Aをnew Pieceの現役formatとして残さない。
旧投稿画面・旧Q&A renderer・old/new共存は不要。
```

理由:

- Q&Aである理由は旧仕様上の理由であり、current Piece identityではない。
- ユーザー未利用のため、既存Q&A data保持をproduct requirementにしない。
- 互換rendererやdual-runを作るほど、new visual Piece構造の実装が遠回りになる。
- ただし、shared table内の非Piece dataと別owner consumerは削除対象にしない。

## D-PCE-002 version戦略

推奨:

```text
新Piece:
  versioned Piece contractを持つ。

Q&A:
  pre-release legacy formatとして扱う。
  new contract上のactive user-selectable formatにはしない。

old Q&A data:
  preservation / migration / adapter不要。
  削除または撤去は、exact predicateとdependency mapを作ってから行う。
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
既存Q&A recordをnew schemaへ移行しない。
compatibility read adapterを作らない。
旧Q&A rowの削除・無効化・関連state撤去はPCE-6以降のexact removal mapで扱う。
```

## D-PCE-004 Nexus方針

推奨:

```text
Nexusはnew visual Piece cardをcurrent ownerにする。
旧Q&A cardとの共存rendererは作らない。
旧Q&A entry pointはnew Piece切替時に到達不能化する。
```

Nexusはnew Piece record contract、visibility、visual_recipe、owner/follower accessで描画する。

## D-PCE-005 old route / field / storage

推奨:

```text
旧Q&A route / field / storageは、product互換のためには残さない。
ただし即時削除はしない。
actual writer / reader / test / RN dependency mapを作ってから撤去する。
```

`mymodel_reflections`はshared tableなので、blanket delete / dropは禁止する。

---

# 6. roadmap overview

| Phase | 名称 | 主目的 | 標準環境 | Work使用 | 主な完了物 |
|---|---|---|---|---|---|
| PCE-0 | Current Contract Pin | current実装・契約・未確認を固定 | `CHAT_5_6_PRO_OK` | なし | actual contract inventory |
| PCE-1 | Piece Identity / Clean Cutover | new Piece identityと旧Q&A撤去方針を決定 | `CHAT_5_6_PRO_OK` | なし | decision ledger / removal map |
| PCE-2 | Cross-Core Source Handoff | Emlis後triggerとsource lineageを固定 | `CHAT_5_6_PRO_OK` | なし | handoff contract |
| PCE-3 | Record Lifecycle / Visibility / Quota | state machineとprivacyを固定 | `CHAT_5_6_PRO_OK` | なし | lifecycle / access / quota contract |
| PCE-4 | Content / Format / Safety | Piece本文の意味と形式ownerを固定 | `CHAT_5_6_PRO_OK` | なし | content contract / format policy |
| PCE-5 | Visual Recipe / Export Design | 再現契約とexport owner比較を固定 | `CHAT_5_6_PRO_OK` | なし | visual/export design |
| PCE-6 | API / DB / RN / Migration Design | actual impactとclean cutover migrationを固定 | `CHAT_5_6_PRO_OK` | なし | detailed implementation design |
| PCE-7 | Test / Monitoring / Rollback | failureを止める証拠体系を固定 | `CHAT_5_6_PRO_OK` | なし | RED/QA/monitoring plan |
| PCE-8 | Design Freeze / Work Package Split | 実装をbounded packetへ分解 | `CHAT_5_6_PRO_OK` | なし | design freeze candidate / authorities |
| PCE-9A | Backend New Piece Contract | storage/policy/APIをnew contractで実装 | `CHAT_5_6_PRO_OK` | 原則なし | bounded backend changes |
| PCE-9B | Format / Generation Owner | Q&A固定を廃止しvisual Piece format ownerへ切替 | `CHAT_5_6_PRO_OK` | 原則なし | generation changes |
| PCE-9C | Post-Emlis Connection | source identityでPiece trigger接続 | `CHAT_5_6_PRO_OK` | 原則なし | adapter / negative tests |
| PCE-9D | RN Preview / History / Visibility | new cardとowner flowを実装 | `CHAT_5_6_PRO_OK` | 原則なし | bounded RN changes |
| PCE-9E | Export Prototype | RN/backend/hybrid候補を試作 | `CHAT_5_6_PRO_OK` + device | 原則なし | prototype evidence |
| PCE-9F | Nexus New Piece Feed | new visual Piece feedと旧Q&A到達不能化を実装 | `CHAT_5_6_PRO_OK` | 原則なし | feed / removal verification |
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

## PCE-1 Piece Identity / Clean Cutover Decision

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

Piece v2相当のidentityを決め、Q&A旧仕様を保持せず、new visual Piece構造へclean cutoverする方針を一意にする。

### 決定対象

1. new Pieceのidentityとuser-facing名称。
2. Q&Aをnew Pieceのactive formatから外すこと。
3. 旧Q&A data / 旧投稿画面 / 旧Q&A rendererを保持しないこと。
4. old Q&A route / field / storage / related stateの撤去map。
5. `piece_contract_version` / `format_type` / `visual_recipe` / `visibility_scope`を持つか。
6. Nexusをnew visual Piece rendererへ単一化する方法。
7. current normative Piece定義をどの正本で更新するか。
8. destructive cleanupを実行する前のexact predicate / dependency map。

### 華恋の初期推奨

```text
Q&Aはnew Pieceの現役formatとして残さない。
new Pieceはclean versioned contractにする。
既存Q&A recordはmigration / compatibility adapter不要。
Nexusはnew visual Piece cardへ単一化する。
old route / field / storageは、exact dependency map作成後に撤去する。
```

### 成果物

```text
Piece_Identity_CleanCutover_Decision_YYYYMMDD.md
Piece_New_Record_Contract_Matrix_YYYYMMDD.md
Piece_OldQna_Removal_Map_YYYYMMDD.md
Piece_Normative_Definition_Update_Map_YYYYMMDD.md
```

### 完了条件

- new Piece identityが一意
- Q&Aをactive formatとして残さないことが一意
- 旧Q&A data / UI / renderer / routeの扱いが一意
- shared table内の非Piece dataを巻き込まない削除条件が一意
- Nexus単一renderer方針が一意
- destructive cleanupを設計判断だけで即実行しない

### STOP

- shared table内の削除predicateを作れず、非Piece dataを巻き込む
- old Q&A撤去がEmlis / Analysis / account等の別ownerを壊す
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
quote
short_essay
declaration
fragment
```

Q&Aは旧仕様のpre-release formatであり、new Pieceのactive format候補に含めない。

### 初期候補の比較項目

- どのmeaning shapeに向くか
- minimum / maximum text length
- titleの有無
- line break contract
- external shareで誤解されにくいか
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
- Q&A旧仕様へ戻らないことをcontractで固定できる
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
- saved visual Piece recordの見た目を再現できる
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

future Pieceをclean cutover可能なnew ownerへ接続する詳細設計を作る。

### DB比較

```text
Option A:
  new Piece table family

Option B:
  dedicated visual/export child table + minimal bridge view

Option C:
  existing mymodel_reflections / content_json extension（fallback only）
```

比較項目:

- existing RLS
- owner read
- follower feed
- index
- update visibility
- delete cascade
- old Q&A removal predicate
- quota count
- migration
- rollback
- analytics
- export version retention

### 初期推奨

new Piece table familyを第一候補にする。既存`mymodel_reflections`拡張は、shared tableを壊さず最短安全であることが証明された場合だけfallback候補にする。

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

route名はnew Piece contractを基準に決める。old route互換はproduct requirementにしない。

### request / response決定

- preview sourceをraw payload再送にするか、saved input IDにするか
- preview responseへformat / visual recipe / visibility defaultをどう入れるか
- publish requestへvisibilityを入れるか
- `piece_text`をcanonical visible bodyにするか
- old Q&A response keyをいつ削除するか
- deleted / disabled old routeのerror contract
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
- new visual Piece Nexus card
- old Q&A card到達不能化
- accessibility
- tier lock
- error / retry

### migration設計

- tracked application migration baseline
- new Piece table / view / index / RLS
- old Q&A row deletion or disable predicate
- related metrics / reads / resonance cleanup
- rollback to safe disabled state
- partial rollout

### 成果物

```text
Piece_New_Data_Contract_Design_YYYYMMDD.md
Piece_API_CleanCutover_Design_YYYYMMDD.md
Piece_RN_Flow_Design_YYYYMMDD.md
Piece_OldQna_Removal_And_DB_Migration_Design_YYYYMMDD.md
```

### 完了条件

- DB / API / RN ownerが一意
- old Q&A removal predicateが一意
- shared tableの非Piece dataを巻き込まない
- private queryが安全
- rollbackがsafe disabled stateへ戻れる
- Emlis fileをPiece実装の都合だけで変更しない

### STOP

- production DB未確認のままirreversible migrationを決める
- old Q&A削除predicateが曖昧なままdestructive migrationが必要になる
- current feed queryを全面置換しないとprivateが成立しない

---

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
10. old Q&A生成routeがnew Piece切替後も到達できる。
11. old Q&A cardがnew Piece recordを誤描画する。
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
- visual card OFF / safe disabled state
- export OFF
- public publish OFF
- visibility toggle OFF
- old Q&Aを復活させず、new Piece featureを安全停止する

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
- rollback pathがsafe disabled stateへ戻れる
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
B2 storage / JSON contract
B3 visibility policy
B4 quota consumption owner
B5 preview API
B6 publish API
B7 owner detail / visibility API
B8 format owner
B9 visual recipe owner
B10 RN preview
B11 owner history
B12 Nexus new Piece renderer / old Q&A removal
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

### PCE-9A Backend New Piece Contract

- versioned contract
- store lifecycle
- visibility
- quota
- API clean cutover
- migration
- unit / integration test

### PCE-9B Format / Generation Owner

- quote / short_essay等の初期format
- old Q&A generation disabled
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

### PCE-9F Nexus New Piece Feed

- new visual formats
- old Q&A card到達不能化
- public/private filtering
- resonance / read / delete
- owner / follower access

### 共通完了条件

- packet単位test green
- approved exact path以外変更0
- old Q&A flow残存 0
- body leak 0
- fresh postverification
- durable checkpoint

### 共通STOP

- 一packetの修正が複数repository全体の独立受入れを必要とする
- same authority内で独立reviewがcompletion conditionになる
- Work固有runtimeが必須になる

この場合はPCE-U1へ持ち越す。

---

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
- initial visual format
- alternate visual format
- export image

### 完了条件

- private/public誤認0
- preview/record/export本文不一致0
- major visual collapse 0
- share / save / permission成立
- old Q&A flow残存 0
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

- old Q&A flow残存 0
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
old Q&A residual flow: 0
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

# 9. Work Ultra queue policy

## 9.1 PieceがWorkを使う予定のexact gate

```text
PCE-U1:
  independent cross-repository integration audit

PCE-U2:
  final independent release acceptance
```

## 9.2 PieceでWorkを使わない予定の主作業

```text
PCE-0〜PCE-8
PCE-9A〜PCE-9F
PCE-10 bounded corrections
PCE-11のcode分析・修正
PCE-12 release closure
```

## 9.3 Work再配分条件

PieceがU1/U2へ到達していても、次の順で扱う。

```text
1. EmlisAIにcurrent Work-required next actionがあるか確認。
2. ある場合、EmlisAIを実行する。
3. EmlisAIが外部条件待ち、またはcurrent Work lane完了ならPiece U1/U2を候補にする。
4. Mashの明示承認後にだけPiece Work authorityを開始する。
```

## 9.4 追加課金

本ロードマップは追加クレジット購入を前提にしない。

Work利用可能枠がなければU1/U2をpendingに保持する。

---

# 10. Pro作業が尽きた時の次の扱い

Piece PCE-0〜PCE-8を完了し、PCE-9 implementation authorityがまだ承認されていない、またはPCE-U1待ちになった場合、停止を避けるためだけにPiece周辺資料を増やさない。

次の独立作業候補を使う。

```text
Analysis / わたしマップのactual output inventory
Analysis発売前quality closure roadmap
Analysisのevidence / route / time-change / tier / history設計
```

ただし、AnalysisロードマップはPieceのPCE-2 cross-core handoff boundaryを参照する。

これにより、Emlis / Piece / Analysisのsource roleを三重に別定義することを避ける。

---

# 11. relation to EmlisAI

## 11.1 EmlisAIを止めない

Work利用可能になった時は、EmlisAI current checkpointから再開する。

Piece Pro作業を進めたことを理由に、EmlisAIのWork順序を後ろへずらさない。

## 11.2 PieceがEmlisAIへ要求しないこと

- PieceのためにEmlis visible bodyを変更する
- Piece formatをEmlis ASTへ追加する
- Piece safetyをEmlis safetyへ吸収する
- Piece visibilityをEmlis metaへ持たせる
- Piece quotaをEmlis plan guardへ混ぜる

## 11.3 Pieceが待つ必要のあるもの

PCE-9C exact adapter bindingには、少なくとも次のcurrent ownerが必要である。

- saved input identity
- Emlis observation stage identity
- original / supplemental source separation
- observation result terminal state
- Piece CTA eligibility

これらが未確定でも、PCE-2 abstract contract、PCE-3〜8の設計は進められる。

---

# 12. relation to Analysis

## 12.1 independence

```text
AnalysisはPiece完了に依存しない。
PieceはAnalysis完了に依存しない。
```

両者はsaved inputを起点にし、上位flowで接続する。

## 12.2 forbidden mixing

- Piece textをAnalysis observed factにしない
- Analysis inferenceをPiece sourceへしない
- simulated routeをPieceのoriginal inputとして扱わない
- Analysis updateをPiece save成功条件にしない

## 12.3 shared contract

Piece PCE-2で次を共通化する。

- source input identity
- source roles
- cross-core event ordering
- privacy boundary
- body-free lineage
- no-mixing negative codes

Analysis roadmapはこの共通境界を再利用する。

---

# 13. release blockers

次はPiece release blockerである。

```text
private Pieceが他者へ見える
public Pieceがaccess policy外へ見える
preview / record / export本文が一致しない
raw input / Emlis body / hidden metaが漏れる
old Q&A flowがrelease buildに残る
quotaがplan contractと一致しない
public/private toggle後のfeedが不整合
owner deleteが成立しない
re-exportが同一recordを再現できない
画像が重大に崩れる
feature flagで止められない
rollback不能
monitoringなし
```

次はrelease blockerではなく、発売後へ回せる。

```text
4形式目以降
多数のtheme
font customization拡張
追加ratio
branding位置選択
Piece Seed / Tone
advanced export
simulation Piece
```

---

# 14. decision ledger

PCE-1〜PCE-7で最低限次を決める。

| ID | decision | current provisional answer | final owner phase |
|---|---|---|---|
| D001 | Q&Aを残すか | 残さない。new active formatにしない | PCE-1 |
| D002 | version field | 持つ | PCE-1 |
| D003 | existing Q&A migration | 不要。削除 / disable predicateを作る | PCE-1 / PCE-6 |
| D004 | Nexus rendering | new visual Piece rendererへ単一化 | PCE-1 / PCE-6 |
| D005 | old route removal | 発売前に撤去mapを作る | PCE-1 / PCE-6 |
| D006 | source owner | saved input identity | PCE-2 |
| D007 | Emlis body reuse | 禁止 | PCE-2 / PCE-4 |
| D008 | refined answer | supplemental role | PCE-2 |
| D009 | visibility default | 未決定 | PCE-3 |
| D010 | quota count point | first saved record | PCE-3 |
| D011 | Free format | 未決定 | PCE-4 |
| D012 | initial formats | Q&A以外の2〜3候補 | PCE-4 |
| D013 | visual themes | 2候補 | PCE-5 |
| D014 | export owner | RN-first候補 | PCE-5 / device |
| D015 | storage strategy | new Piece table family第一候補 | PCE-6 |
| D016 | visibility API | 未決定 | PCE-6 |
| D017 | metrics | body-free events | PCE-7 |
| D018 | Work U1 exact4 | proposed | PCE-8 / Mash approval |
| D019 | final Ultra acceptance | proposed | PCE-8 / Mash approval |

---

# 15. immediate next action

PCE-0は完了済みである。次のbounded作業単位は次である。

```text
実行環境判定:
  CHAT_5_6_PRO_OK

対象:
  PCE-1 Piece Identity / Clean Cutover Decision

作業:
  new Piece identity、new record contract、old Q&A撤去map、normative definition updateを設計する。

変更:
  design-only

GitHub write:
  別承認までなし

完了:
  PCE-2以降がold/new共存を前提にせず、clean cutover前提で進められる。
```

PCE-1では、Mashのclean cutover decisionを前提に、破壊的撤去を即実行せず、exact removal scopeを設計へ落とす。

---

# 16. closure statement

```text
PIECE_ROADMAP_CREATED
PRO_FIRST_RUNWAY_DEFINED
WORK_ULTRA_TEMPORARILY_RESERVED_FOR_EMLIS_AI
PIECE_ULTRA_USE_NOT_PERMANENTLY_FORBIDDEN
PIECE_ULTRA_GATE_DEFERRED_TO_INDEPENDENT_AUDIT_AND_FINAL_ACCEPTANCE
OLD_QNA_PRESERVATION_NOT_REQUIRED
CLEAN_CUTOVER_ALLOWED
PCE0_COMPLETE
IMPLEMENTATION_NOT_STARTED
GITHUB_NOT_REFLECTED
AUTOMATIC_PROGRESSION_FALSE
NEXT_PIECE_ACTION_PCE1_CHAT_5_6_PRO_OK
```

