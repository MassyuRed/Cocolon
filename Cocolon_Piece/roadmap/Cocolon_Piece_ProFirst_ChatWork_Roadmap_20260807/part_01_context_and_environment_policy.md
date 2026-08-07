---
title: "Cocolon Piece Pro-First / Chat-Work Environment Allocation Roadmap"
created_at: "2026-08-07 JST"
created_by: "Karen"
decision_owner: "Mash"
workstream: "Cocolon / Piece"
document_type: "Markdown roadmap"
document_status: "READ_ONLY_ROADMAP / IMPLEMENTATION_NOT_STARTED / GITHUB_NOT_REFLECTED"
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
Pieceは、current Q&A基盤を壊さないadditive redesignとして進める。
当面はProで、identity・compatibility・source・lifecycle・visibility・quota・format・visual・API/DB/RN・testを順に閉じる。
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

current rule上のPieceは、主に一問一答で入力の核を他者へ伝える機能である。

future設計では次へ拡張する。

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
- existing feedとlegacy recordを同時に守る必要がある
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
- compatibility方針
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
