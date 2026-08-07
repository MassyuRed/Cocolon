---
title: "Cocolon Piece / Analysis Pro-First Design Workstream Handoff"
created_at: "2026-08-07 JST"
created_by: "Karen"
decision_owner: "Mash"
workstream: "Cocolon / Piece / Analysis / Chat-Work environment allocation"
document_type: "Markdown handoff / read-only continuity record"
document_status: "READ_ONLY_HANDOFF / LOCAL_DOWNLOAD_ARTIFACT / GITHUB_NOT_REFLECTED"
automatic_progression: false
implementation_authority: false
github_write_authority: false
work_ultra_authority: false
current_cocolon_head: "f8ecb44305313497b1eed06a7e5fbfe6151e2b8d"
current_cocolon_tree: "d74be7c0498ca1ec157618b60f615639ec630de6"
current_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
current_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
piece_roadmap_file: "Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807.md"
piece_roadmap_sha256: "a8ec1298901839aaf7421dad1942fe94f6cb1b90bad5a8944dc41ac24cdc69bd"
piece_roadmap_bytes: 49465
piece_roadmap_lines: 1964
---

# Cocolon Piece / Analysis Pro-First設計作業 引き継ぎ資料

## 0. この引き継ぎの決定

本資料は、Work Ultraの利用上限によりEmlisAIのWork必須作業を一時的に進められない期間に、ChatのGPT-5.6 ProでCocolon完成へ直接接続する独立作業を進めるために開始した、Piece / Analysis設計作業の継続記録である。

本資料の中心決定は次である。

```text
1. Work Ultraが利用可能になったら、EmlisAIのcurrent Work-required作業を最優先で再開する。
2. Work Ultraが利用できない期間は、PieceとAnalysisのうちProで要求品質を維持できる設計・監査・bounded実装準備を進める。
3. Piece / Analysisを永久にProだけで進める方針ではない。
4. Piece / Analysisでも、独立複数agentそのものが完了条件になる横断監査や最終受入れでは、将来Work Ultraを使う。
5. ただし当面のWork Ultra枠はEmlisAIが最優先であり、Piece / AnalysisのUltra工程はqueueに保持する。
6. 最初にPieceロードマップを作成した。
7. Analysisロードマップも作成する。
8. Analysisロードマップは、Piece PCE-2完了後に作成する。
9. PCE-2より前にAnalysisロードマップを独立作成し、三大中核のsource / handoff境界を二重定義しない。
```

この作業は、EmlisAIから逃げる代替機能追加ではない。

```text
EmlisAI:
  Work利用可能時にcurrent checkpointから最優先再開するcritical path。

Piece / Analysis:
  Workが利用できない間にも後戻りなく進められ、発売前に必須である独立workstream。
```

---

# 1. 実行環境の方針

## 1.1 当面の配分

```text
Work Ultra:
  EmlisAIのcurrent Work-required作業を最優先する。

Chat GPT-5.6 Pro:
  Piece / Analysisの設計、actual inventory、contract decision、bounded実装準備を進める。
```

この配分は、次を意味しない。

- Piece / Analysisの品質基準を下げる。
- Proだから簡易版を作る。
- Work必須の独立reviewをChatの再読で代替する。
- Piece / AnalysisへWork Ultraを永久に使わない。
- EmlisAIのcurrent Work順序をPiece / Analysisのために後ろへずらす。
- Work不足を理由にEmlisAIのauthority lifecycle、STOP、pending状態を変更する。

## 1.2 Proで進められる条件

次を満たすbounded作業は`CHAT_5_6_PRO_OK`として扱う。

- 作業を複数の小さなowner / contract単位へ分割できる。
- actual file、hash、diff、test、fresh postverificationで品質を維持できる。
- 独立複数agentそのものが完了証拠ではない。
- Work固有runtime / filesystem / absolute locatorが成立条件ではない。
- 次の工程で再作業にならない共通設計・契約・inventoryである。

## 1.3 Ultraへ切り替える条件

Piece / Analysisでも、次に該当する作業は`WORK_ULTRA_REQUIRED`候補となる。

- 4系統等の独立reviewそのものが完了条件になる。
- 複数repositoryの全体integrationを安全に分割できない。
- 複数仮説を相互汚染なしで並列調査する必要がある。
- atomic authority内にWork固有stageがある。
- Chatでbounded化しても同等のcoverage・独立性・証拠性を維持できない。

当面、これらのPiece / Analysis Ultra工程は、EmlisAIのWork優先を守ってqueueへ置く。

## 1.4 Work再開時の優先順位

Work Ultraが再び利用可能になった場合、単に「Workが空いた」ことだけを理由にPieceのUltra gateへ進まない。

優先順は次である。

```text
1. EmlisAI current Work-required exact作業単位を確認する。
2. EmlisAIに直ちに実行可能なWork-required作業があれば、そちらを再開する。
3. EmlisAIが外部情報待ち、Mash判断待ち、別環境待ち等で直ちに進められない場合だけ、Piece / AnalysisのWork gateを再評価する。
4. Piece / AnalysisへWorkを使う場合も、bounded作業単位ごとに別判定する。
```

---

# 2. 今回行った作業

## 2.1 作業の目的

Work Ultraが利用できない間に、EmlisAIを低品質な代替環境で進めたことにせず、発売前に必須で、current blockerから独立し、後でやり直しにならないPiece / Analysis設計作業を進めるための地図を作ること。

## 2.2 受領した資料

今回、Mashから次の6資料を受領した。

```text
1. Cocolon_EmlisAI_ModelFreeNaturalLanguageSurfaceV3_DetailedDesign_ImplementationOrder_20260714_Revised_Cycle(20260806-212529).md
2. NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723(20260806-212529).md
3. Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(20260806-212530).md
4. Cocolon_2027_Public_Release_Soft_Launch_And_Growth_Launch_Strategy_GitHubActualAudit_Revised_20260728(2).md
5. Cocolon_Piece_Card_Image_Export_Redesign_DesignNote_20260707(3).md
6. Cocolon_WatashiSimulation_RouteBranch_DesignNote_20260708(3).md
```

## 2.3 GitHub actual file照合

将来資料だけで判断せず、current GitHub actual ownerと照合した。

確認面:

```text
Cocolon main:
  f8ecb44305313497b1eed06a7e5fbfe6151e2b8d
  tree d74be7c0498ca1ec157618b60f615639ec630de6

mashos-api main:
  315813c7bd3372462de926ddad74df567254a6b5
  tree a641510e107d52bb910073f36604c85bd57af150
```

主なPiece actual owner:

```text
Cocolon/components/EmotionPiecePreviewModal.js
  blob 46c6d88d746f8c03566f552024e0d6606dc7de45

Cocolon/screens/nexus/NexusPieceCard.js
  blob 9119e11c99aa3c749ee6cec88e880e83f4683a32

mashos-api/ai/services/ai_inference/api_emotion_piece.py
  blob e814c58b8828699ed1e745f1b72fe363cab4fca0

mashos-api/ai/services/ai_inference/emotion_piece_store.py
  blob ab61730c1cc4d88e25fc2bc28beb64487be95e6c

mashos-api/ai/services/ai_inference/piece_publish_entitlements.py
  blob 743cb30b746cd24d70b98b3c208d0885b5c163e8
```

主なAnalysis actual owner:

```text
Cocolon/components/selfStructure/WatashiMapRenderer.js
  blob b044912cfd9cf4188767e237f8ca43345f3ed8c2

mashos-api/ai/services/ai_inference/watashi_map_service.py
  blob b5836d69da2d01a5e66873bdbce4d56d96ecd8a0

mashos-api/ai/tests/test_watashi_map_service.py
  blob d553f6e225891ae868975ede231fb36957c38489
```

## 2.4 確認したcurrent Piece

current Pieceは未実装のgreenfieldではない。

実装済み:

- Emotion inputからのQ&A Piece preview。
- preview draft作成。
- preview IDを使ったpublish。
- existing `mymodel_reflections` familyへの保存。
- preview / publish本文hash一致境界。
- public feed / access。
- Nexus Q&A card。
- resonance。
- owner削除。
- quota。
  - Free: 月5回。
  - Plus: 月30回。
  - Premium: 無制限。

current主要ownerで未実装または未確定:

- Emlis観測後のPiece CTA。
- 複数content format。
- `visual_recipe`。
- `template_version`。
- Piece単位public / private。
- owner private history。
- public / private切替。
- 画像preview。
- 端末保存。
- 外部share。
- 保存recordからの再export。
- Piece画像export owner。
- current storageへのadditive拡張かnew tableかの最終決定。

結論:

```text
Pieceは、current Q&A基盤を捨てずに行うadditive redesignである。
```

## 2.5 確認したcurrent Analysis

current Analysis / わたしマップもgreenfieldではない。

実装済み:

- overview。
- role switches。
- current routes。
- crossroads。
- unknown areas。
- plan別visibility / lock。
- Free / Plus / Premium projection。
- insufficient-data surface。

発売前に必要な中心作業:

- actual output inventory。
- role label quality。
- route step grounding。
- scene -> role -> action -> result direction。
- protective meaning / burden meaning。
- insufficient-data boundary。
- generic fallback detection。
- self-denial / diagnosis / personality overclaim prevention。
- time-change minimum。
- Plus / Premium visibility実確認。
- latest / history consistency。
- RN actual-device表示。

結論:

```text
Analysis発売前作業は、current Watashi Mapを捨てる新規構築ではなく、actual-product quality closureである。
```

## 2.6 作成した成果物

作成済み:

```text
Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807.md
```

identity:

```text
UTF-8 bytes:
  49,465

lines:
  1,964

SHA-256:
  a8ec1298901839aaf7421dad1942fe94f6cb1b90bad5a8944dc41ac24cdc69bd

state:
  READ_ONLY_ROADMAP
  IMPLEMENTATION_NOT_STARTED
  GITHUB_NOT_REFLECTED
  AUTOMATIC_PROGRESSION_FALSE
```

このロードマップは、次を明示した。

- Work Ultra復帰時はEmlisAI優先。
- PieceはPro-firstで進める。
- PieceへUltraを永久に使わないわけではない。
- Pieceの最初のWork必須gateを後段へ置く。
- PCE-0〜PCE-8はProで進められる。
- bounded化できるPCE-9 implementationも原則Pro候補。
- 独立cross-repository auditとfinal independent acceptanceはUltra候補。
- current Q&A基盤を保持する。
- Pieceをversioned additive redesignにする。
- Analysis roadmapはPCE-2の共通境界を再利用する。

---
