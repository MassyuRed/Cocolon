# 5. EmlisAIとの関係

## 5.1 EmlisAIのcurrent状態を変更しない

今回のPiece / Analysis作業は、EmlisAI current authority、STOP、pending、credit、acceptanceを変更しない。

確認済みの親資料では、Cycle001は`NOT_ACCEPTED`であり、automatic progressionはfalseである。

この引き継ぎは、EmlisAIの進捗報告、実行authority、recovery authorityではない。

## 5.2 Work再開時

Work利用可能になったら、次を行う。

1. latest fresh-verified durable GitHub checkpointを読む。
2. Cocolon / mashos-api current headを確認する。
3. EmlisAI current authority lifecycleを確認する。
4. exact next actionとrequired environmentを確認する。
5. EmlisAIのWork-required laneを再開する。
6. Piece / AnalysisのPro成果を理由にEmlisAIの順序を変更しない。

## 5.3 Piece / AnalysisがEmlisへ要求しないこと

- Piece形式をEmlis ASTへ吸収する。
- Piece本文のためにEmlis visible bodyを変更する。
- Piece safetyをEmlis safetyへ統合する。
- Piece visibility / quotaをEmlis metaへ混ぜる。
- Analysis inferenceをEmlisがユーザー発言として使う。
- Analysis routeをEmlis current observationへ自動昇格する。
- simulated routeをEmlis current factへ昇格する。

---

# 6. 現在の成果物state

## 6.1 作成済み

```text
Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807.md
Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807.md
```

## 6.2 未作成

```text
Piece PCE-0 actual contract inventory
Piece PCE-1 decision ledger
Piece PCE-2 cross-core handoff contract
Analysis Pro-First roadmap
Analysis actual output inventory
Piece / Analysis implementation design
Piece / Analysis source changes
Piece / Analysis GitHub checkpoint
```

## 6.3 実行・変更効果

```text
Cocolon source change: 0
mashos-api source change: 0
DB change: 0
API change: 0
RN change: 0
migration: 0
test execution: 0
runtime execution: 0
Work Ultra use: 0
GitHub write: 0
commit: 0
release effect: 0
```

## 6.4 durable state上の注意

Piece roadmapと本handoffは、現時点ではローカルDL成果物であり、GitHubへ反映されていない。

したがって、次のセッションでこれらを参照する場合は、Mashがファイルを渡すか、別途GitHub反映authorityでdurable checkpoint化する必要がある。

ローカルpath、chat、SHA-256だけをGitHub-backed durable preservationと誤認しない。

---

# 7. 次のexact作業

## 7.1 次のPiece作業

```text
実行環境判定:
  CHAT_5_6_PRO_OK

対象:
  PCE-0 Current Contract Pin

作業種別:
  read-only actual contract inventory

目的:
  current Piece write / read / storage / access / quota / testを
  一枚のactual inventoryへ固定する。

GitHub write:
  なし

実装:
  なし

完了条件:
  PCE-1のidentity / compatibility判断に必要なcurrent factsが揃う。
```

PCE-0で最低限確認するowner:

```text
Cocolon/components/EmotionPiecePreviewModal.js
Cocolon/lib/api/home/emotionPieceApi.js
Cocolon/screens/NexusScreen.js
Cocolon/screens/nexus/NexusPieceCard.js
mashos-api/ai/services/ai_inference/api_emotion_piece.py
mashos-api/ai/services/ai_inference/emotion_piece_generation_service.py
mashos-api/ai/services/ai_inference/emotion_piece_store.py
mashos-api/ai/services/ai_inference/piece_generation_policy.py
mashos-api/ai/services/ai_inference/piece_generated_display.py
mashos-api/ai/services/ai_inference/piece_generated_access.py
mashos-api/ai/services/ai_inference/piece_public_read_service.py
mashos-api/ai/services/ai_inference/piece_publish_entitlements.py
relevant tests / migrations / RLS / access policy
```

## 7.2 PCE-0後

```text
PCE-1:
  current Q&Aの扱い
  version strategy
  existing record migration
  Nexus old/new coexistence
  route / field / storage compatibility owner
  normative Piece definition update timing
```

## 7.3 PCE-1後

```text
PCE-2:
  saved input identity
  source role
  Emlis observation stage
  original / supplemental separation
  Piece eligibility
  Analysis independence
  privacy / body-free lineage
  no-mixing negative contract
```

## 7.4 PCE-2後

```text
Analysis Pro-First roadmapを作成する。
```

この時点でAnalysis roadmapは、PCE-2の共通境界をsource of truthとして参照する。

---

# 8. 次のセッションの読み順

新しい華恋は、次の順で確認する。

```text
1. Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
2. Cocolon_前提資料/work_attitude_rules_for_karen/18_chat_work_environment_selection_rule_2026_08_06.txt
3. Cocolon_前提資料/14_cocolon_continuous_work_recording_and_emergency_handoff.md
4. Cocolon_前提資料/work_attitude_rules_for_karen/17_continuous_durable_work_recording_and_emergency_handoff.txt
5. latest durable GitHub handoff
6. 本handoff
7. Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807.md
8. 受領6資料
9. GitHub current Cocolon / mashos-api heads
10. PCE-0対象actual files / tests / migrations / access policy
```

本handoffとPiece roadmapはGitHub未反映なので、latest GitHub checkpointより新しいlocal decision materialとして、GitHub stateと混同せず読む。

---

# 9. 禁止事項

本handoffを根拠に次を行わない。

- EmlisAIのauthorityを再解釈する。
- EmlisAIのSTOP / pendingを閉じる。
- Piece PCE-0を飛ばしてDB schemaやUIを確定する。
- current Q&Aを確認せずlegacy-onlyへ下げる。
- existing recordを一括migrationする。
- Emlis visible bodyをPiece本文へコピーする。
- Piece textをAnalysis observed factへ昇格する。
- Analysis inferenceをPiece sourceへ使う。
- simulated routeをobservedへ昇格する。
- Workが使えないことを理由に独立review条件を緩める。
- Workが使えるようになっただけでPiece Ultra gateを自動開始する。
- Analysis roadmapをPCE-2前に別のsource / handoff定義で作る。
- Piece PCE-2完了後もAnalysis roadmapを無期限に後回しにする。
- ローカルファイルをGitHub durable checkpointとして扱う。
- automatic progressionする。

---

# 10. 未確認事項

現時点で未確認のもの:

- latest production deployとGitHub mainの一致。
- production Supabase schema / RLS / migration実状態。
- current private Piece historyに利用可能なread ownerの有無。
- Piece単位visibilityをcurrent tableへ追加できる実DB条件。
- iOS / Android image export品質。
- RN / backend / hybrid exportの実測比較。
- current Watashi Mapのactual user output品質。
- Analysis time-changeのcurrent実owner。
- Piece / Analysisの最終Ultra gate分母・review系統数。
- Piece roadmap / handoffのGitHub反映path。

これらを推測で埋めない。

---

# 11. 華恋の判断

Pieceを最初に選んだ理由:

- current Q&A基盤があり、ゼロからの新機能ではない。
- future visual / visibility / exportは発売前必須。
- storage / public access / migrationの設計を早く固定しないと後工程の手戻りが大きい。
- PCE-0〜PCE-8をProで長く進められる。
- EmlisAIのWork枠を奪わず、Cocolon完成へ直接接続する。

Analysis roadmapをPCE-2後にする理由:

- AnalysisをPiece完了まで待たせるためではない。
- Piece / Analysis / Emlisの共通source boundaryを一度だけ定義するためである。
- PCE-2後なら、Analysisはcurrent Watashi Map quality closureへ集中できる。
- source role、privacy、lineage、event orderingを二重設計しなくて済む。
- Work不足期間のPro workstreamを、PieceからAnalysisへ自然に継続できる。

この順序は、止まりたくないために作業を発明するものではない。

```text
Piece redesign:
  発売前必須。

Analysis quality closure:
  発売前必須。

PCE-2 shared boundary:
  両者の手戻りを防ぐために先に必要。
```

---

# 12. closure statement

```text
WORK_UNAVAILABLE_PRO_FIRST_DESIGN_WORKSTREAM_RECORDED
WORK_ULTRA_REMAINS_EMLIS_AI_FIRST_PRIORITY
PIECE_ROADMAP_CREATED
PIECE_PCE0_NEXT
PIECE_PCE1_IDENTITY_DECISION_QUEUED
PIECE_PCE2_SHARED_HANDOFF_BOUNDARY_QUEUED
ANALYSIS_ROADMAP_REQUIRED
ANALYSIS_ROADMAP_CREATION_AFTER_PCE2
ANALYSIS_NOT_BLOCKED_UNTIL_PIECE_COMPLETION
PIECE_AND_ANALYSIS_ULTRA_USE_NOT_PERMANENTLY_FORBIDDEN
PIECE_AND_ANALYSIS_ULTRA_GATES_DEFERRED_WHILE_EMLIS_WORK_IS_ACTIONABLE
SOURCE_CHANGE_EXACT0
TEST_EXECUTION_EXACT0
RUNTIME_EXECUTION_EXACT0
GITHUB_WRITE_EXACT0
AUTOMATIC_PROGRESSION_FALSE
LOCAL_DOWNLOAD_ARTIFACT_ONLY
```

以上。
