---
title: "Cocolon Analysis Pro-First / Current Actual Product Quality Closure Roadmap"
created_at: "2026-08-07 JST"
created_by: "Karen"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Analysis / Watashi Map"
document_type: "Markdown roadmap"
document_status: "READ_ONLY_ROADMAP / CURRENT_ACTUAL_PRODUCT_QUALITY_CLOSURE / IMPLEMENTATION_NOT_STARTED / LOCAL_DOWNLOAD_ARTIFACT"
authority: "ANALYSIS_PRO_FIRST_CURRENT_ACTUAL_PRODUCT_QUALITY_CLOSURE_ROADMAP_DESIGN_ONLY"
standard_environment: "CHAT_5_6_PRO_OK"
work_ultra_priority: "EMLIS_AI_FIRST"
actual_device_requirement: "LATER_MASH_ACTUAL_DEVICE_REQUIRED"
human_product_read_requirement: "LATER_MASH_PRODUCT_READ_REQUIRED"
intended_durable_root: "Cocolon_Analysis/"
intended_roadmap_path: "Cocolon_Analysis/roadmap/Cocolon_Analysis_ProFirst_CurrentActual_ProductQualityClosure_Roadmap_20260807.md"
current_cocolon_head: "50749566a11bade518add57d07cedbee4f5ab379"
current_cocolon_tree: "75084995241bea25fb787b79cd691caab4f22dba"
current_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
current_mashos_api_tree: "a641510e107d52bb910073f36604c85bd57af150"
shared_source_contract: "cocolon.cross_core.source_handoff.v1"
shared_source_role_matrix: "cocolon.cross_core.source_role_matrix.v1"
shared_forbidden_mixing_contract: "cocolon.cross_core.forbidden_mixing.v1"
piece_pce2_state: "COMPLETE_DESIGN_ONLY"
analysis_implementation_started: false
simulation_release_lane: "POST_RELEASE_SEPARATE_LANE"
github_write: false
automatic_progression: false
---

# Cocolon Analysis Pro-First / Current Actual Product Quality Closure Roadmap

## 0. この文書の決定

本ロードマップは、Cocolonの分析構造をgreenfieldで作り直す計画ではない。

current GitHubには、次が既に存在する。

```text
Analysis home
こころ天気（日 / 週 / 月）
わたしマップ
latest / history / detail
Free / Plus / Premium projection
light / standard / deep mode
role switch
current route
crossroad
unknown area
report validity gate
unread / dirty refresh
```

したがって、発売前の中心作業は次である。

```text
current actualを捨てず、
わたしマップを「役割・現在ルート・守っているもの・負荷・根拠・変化」が
ユーザーに本当に読める商品へ閉じる。
```

一方、添付された「わたしシミュレーション / ルート分岐システム」は非常に強い将来構想だが、発売前のAnalysis quality closureへ混ぜない。

```text
発売前lane:
  current Watashi Map actual-product quality closure

発売後lane:
  Watashi Simulation / route branching
```

この分離は、わたしシミュレーションを軽視するためではない。

- current routeをobserved正本として先に成立させる。
- simulated routeをobservedへ混ぜない。
- 現在の自分を否定しない安全境界を固める。
- 発売前のAnalysisを、重い新規機能によって遅延させない。
- 将来のsimulationが信頼できるsourceを受け取れるようにする。

という順序である。

## 0.1 一文での方針

```text
Analysisは、current Watashi Mapを捨てず、
actual output・evidence・role・current route・protective meaning・burden meaning・unknown・time change・tier・history・RN表示を順に閉じる。

Watashi Simulationは、observed / simulated / savedを分離した発売後の別laneとして設計する。
```

## 0.2 この文書が許可しないこと

本ロードマップだけでは、次を許可しない。

- GitHub write。
- Cocolon source変更。
- mashos-api source変更。
- DB migration。
- API route変更。
- RN変更。
- report dataの削除・一括変換。
- `watashi.map.v1`の即時廃止。
- `myprofile.report.v5`の即時変更。
- production deploy。
- Work Ultra利用。
- 追加クレジット購入。
- EmlisAI current authority、STOP、credit、acceptanceの変更。
- Piece PCE-3以降へのautomatic progression。
- Analysis implementationのautomatic progression。
- Watashi Simulation実装の開始。

設計判断、actual inventory、RED、実装、GitHub反映、DB操作、実機確認、human Product Readは、それぞれboundedな別作業として扱う。

## 0.3 成果物の分離owner

Analysis成果物の将来のdurable ownerは次とする。

```text
Cocolon_Analysis/
  00_read_first.md                  future
  manifest.json                     future
  roadmap/
  current_actual/
  contracts/
  implementation/
  audits/
  simulation/                       post-release separate lane
```

分離規則:

```text
EmlisAI:
  EmlisAIの実装済み資料/

Piece:
  Cocolon_Piece/

Analysis:
  Cocolon_Analysis/
```

今回の成果物は本Markdown一冊だけであり、Mashの明示指示に従ってGitHubへ反映しない。

---

# 1. source basis

## 1.1 current GitHub identity

ロードマップ作成時にfresh確認したidentity:

| repository | head | tree |
|---|---|---|
| `MassyuRed/Cocolon` | `50749566a11bade518add57d07cedbee4f5ab379` | `75084995241bea25fb787b79cd691caab4f22dba` |
| `MassyuRed/mashos-api` | `315813c7bd3372462de926ddad74df567254a6b5` | `a641510e107d52bb910073f36604c85bd57af150` |

実装・actual inventoryへ入る時点では、必ずlatest headと本basisの差分を再確認する。

## 1.2 current rule / premise basis

必須basis:

```text
Karen-Diary/00_READ_FIRST.md
Karen-Diary/memory/karen_operating_principles.md
Karen-Diary/memory/mash_and_karen.md

Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/CURRENT_RULES.md
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/11_cocolon_area_specific_do_not_break.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt

Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md
Cocolon_前提資料/14_cocolon_continuous_work_recording_and_emergency_handoff.md
Cocolon_前提資料/01B_cocolon_overall_structure_analysis_piece_emotionlog_ranking.md
```

current product boundary:

```text
Analysis / わたしマップ:
  診断ではなく観測。
  医療・人格・未来を断定しない。
  current actual fileと表示導線を確認する。

こころ天気:
  感情履歴・推移の補助surface。

わたしマップ:
  場面・役割・思考・行動・現在ルートを扱うAnalysis中核。
```

## 1.3 PCE-2 shared source foundation

Analysis roadmapは、Piece PCE-2で固定済みのcross-core foundationを再利用する。

```text
cocolon.cross_core.source_handoff.v1
cocolon.cross_core.source_role_matrix.v1
cocolon.cross_core.forbidden_mixing.v1
```

再利用するもの:

- saved input identity。
- source input version / commitment。
- original / supplemental source分離。
- normal / pre-question / refined stage名。
- body-free lineage。
- same-owner binding。
- cross-core event ordering。
- no-mixing negative codeの考え方。

Analysis側で再定義しないもの:

- Piece generation eligibility。
- Piece lifecycle / visibility / quota。
- Piece text / visual recipe。
- Emlis visible body。
- Emlis internal artifact。

Analysis固有に後続で定義するもの:

- 複数saved inputからなるperiod source set。
- observed claimとevidenceの対応。
- role / route / protective / burden / unknown claim。
- period comparisonとtime change。
- Analysis report lifecycle / tier / history。

## 1.4 受領した構想資料

今回の中心構想資料:

```text
Cocolon_WatashiSimulation_RouteBranch_DesignNote_20260708(4).md
UTF-8 bytes: 28,143
SHA-256: 9803dc00eb319e9da52d3f4fd6550dff6b717675ec5169e0e2fab29e084469ce
```

この資料は、Watashi Simulationを今すぐ実装する指示書ではない。

current routeを残したまま別routeを試すこと、observed / simulatedを混ぜないこと、正解route・人格改造・未来予測・行動命令を作らないことを、将来laneの思想basisとして使う。

関連current planning basis:

```text
Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807_CleanCutover_Revised.md
SHA-256: 2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939

Cocolon_Piece/pce2_cross_core_source_handoff/
  Piece_CrossCore_Source_Handoff_Contract_20260807.md
  Piece_Source_Role_Matrix_20260807.md
  Piece_Forbidden_Mixing_Negative_Contract_20260807.md
```

## 1.5 current RN actual owners

現時点で確認した主要owner:

```text
Cocolon/screens/AnalysisScreen.js
  Analysis shell / route / unread / dirty refresh / latest / history / detail

Cocolon/screens/AnalysisContentFirstScreen.js
  Analysis home
  こころ天気 / わたしマップのtop-level tabs
  latest reportの直接表示

Cocolon/components/selfStructure/WatashiMapRenderer.js
  overview
  role switches
  routes
  crossroads
  unknown areas
  tier lock

Cocolon/components/selfStructure/watashiMapFormatters.js
  Watashi Map payload normalization
  legacy projection
  tier visibility normalization

Cocolon/screens/SelfStructureReportGenerateScreen.js
  self-structure latest取得
  light / standard / deep
  Free / Plus / Premium mode制御
  text/PDF share fallback

Cocolon/screens/SelfStructureReportViewerScreen.js
Cocolon/screens/SelfStructureReportHistoryScreen.js
Cocolon/screens/AnalysisReportViewerScreen.js
Cocolon/screens/AnalysisReportHistoryScreen.js

Cocolon/screens/analysis/useAnalysisRouteState.js
Cocolon/screens/analysis/useAnalysisReportActions.js
Cocolon/screens/analysis/useAnalysisSelfStructureActions.js
Cocolon/screens/analysis/useAnalysisUnreadBadges.js
Cocolon/lib/analysisHomeSummaryRefreshSignal.js
```

この一覧はロードマップ作成時の主要ownerであり、ANL-0でfull owner mapを作る。

## 1.6 current backend actual owners

```text
mashos-api/ai/services/ai_inference/watashi_map_service.py
  watashi.map.v1 projection
  overview / role switches / routes / crossroads / unknown / visibility

mashos-api/ai/services/ai_inference/astor_self_structure_report.py
  myprofile.report.v5 report content owner
  Watashi Map payload attachment

mashos-api/ai/services/ai_inference/api_self_structure.py
  latest / status / monthly / history / detail
  read/write table selection
  tier projection
  generation lock

mashos-api/ai/services/ai_inference/api_analysis_reports.py
  こころ天気側analysis report API

mashos-api/ai/services/ai_inference/analysis_report_validity_gate.py
  analysis.validity.v1
  material sufficiency
  emotion/self-structure domain separation
  diagnosis / overclaim / empty output gate
  additive text-generation safety meta

mashos-api/ai/services/analysis_engine/self_structure_engine/*
  signal extraction / fusion / structural basis candidates

mashos-api/ai/services/ai_inference/emotion_submit_service.py
  saved input row identity / Emlis current input connection
```

current code default candidate:

```text
self-structure read:
  public.self_structure_reports

self-structure write:
  public.myprofile_reports

structure patterns:
  public.mymodel_structure_patterns
```

これらはcode defaultであり、production DB actualとしてはANL-0で別確認する。

## 1.7 current public routes

current public API registryで確認した主route:

```text
GET  /analysis/home-summary
POST /analysis/reports/ensure
GET  /analysis/reports/ready
GET  /analysis/reports/{report_id}
GET  /analysis/reports/{report_id}/weekly-days
GET  /report-reads/analysis-unread-status

GET  /self-structure/latest/status
GET  /self-structure/latest
POST /self-structure/monthly/ensure
GET  /self-structure/reports/history
GET  /self-structure/reports/{report_id}
```

historical aliases:

```text
/myweb/*
/myprofile/*
```

はdeprecated registry entryとして残る。ANL-0でcurrent caller / compatibility ownerを確認するまで即時削除しない。

## 1.8 current tests

確認済みの中心test:

```text
mashos-api/ai/tests/test_watashi_map_service.py
mashos-api/ai/tests/test_self_structure_watashi_map_payload.py
mashos-api/ai/tests/contract/test_self_structure_latest_free_light.py
mashos-api/ai/tests/test_analysis_value_observation_boundary.py
mashos-api/ai/tests/contract/test_new_national_core_analysis_contracts.py
Cocolon/tests/rn-screen-contracts.test.js
```

current testsが既に証明する主なこと:

- Watashi Map required sectionsのshape。
- `タイプ`断定を避ける最低境界。
- Free lightでroutes / crossroads / detailをlockすること。
- report v5へWatashi Mapをadditiveに付けること。
- latest Free responseからdetailを除くこと。
- validity gateの一部。

current testsだけではまだ証明しないこと:

- 実ユーザー入力に対するrole label品質。
- route stepのevidence fidelity。
- generic fallback率。
- protective meaning / burden meaningの品質。
- time changeの妥当性。
- latest / history / tierの実データ整合。
- RN actual-device読感。
- Analysis全体の商品価値。

---

# 2. current Analysis actualとquality gap

## 2.1 current product surface

current Analysis homeは次の二surfaceを持つ。

```text
こころ天気:
  日 / 週 / 月の感情推移・レポート

わたしマップ:
  場面ごとの役割・現在ルート・分かれ道・unknown
```

本ロードマップでは、両者を同じ「Analysis tab」に置きつつ、責任を分ける。

```text
こころ天気:
  感情の履歴と推移を把握する補助surface

わたしマップ:
  役割・思考・行動routeを扱うAnalysis中核
```

こころ天気を削除・軽視する計画ではない。
ただし、Analysis差別化の中心はWatashi Mapのquality closureへ置く。

## 2.2 current Watashi Map payload

current `watashi.map.v1`で確認できる概念:

```text
overview
role_switches
routes
crossroads
unknown_areas
visibility
detail_report
report_mode
period
```

current rendererで確認できるsurface:

```text
今のわたしマップ
場面
役割
立ち上がりやすさ
route preview
よく通るroute
crossroad
まだ地図にない場所
tier lock
```

これは発売前quality closureの土台として十分に価値がある。

## 2.3 current safety / validity asset

current `analysis.validity.v1`は、少なくとも次を持つ。

```text
material sufficiency
domain separation
diagnosis-like output rejection
overclaim rejection
empty display rejection
text-generation safety integration
save_allowed
blocked_reasons
```

このassetは保持する。

ただし、禁止語がないことだけで商品品質合格とはしない。

```text
safe but generic
safe but source-ungrounded
safe but routeが飛ぶ
safe butユーザーに意味がない
```

を別に検出する必要がある。

## 2.4 発売前に閉じるquality gap

```text
actual output inventory
role label quality
scene -> role -> thought/action -> result/aftermath grounding
current route fidelity
protective meaning
burden meaning
unknown / insufficient-data boundary
evidence period / observation amount / confidence相当
generic fallback detection
self-denial / diagnosis / personality / future overclaim prevention
time change minimum
latest / history consistency
Free / Plus / Premium projection
cache / refresh / dirty / unread consistency
RN actual-device readability
human Product Read
monitoring / rollback
```

## 2.5 current actualとして断定しないもの

本ロードマップ作成時点で未確認:

- production deployとGitHub mainの一致。
- production DB table / view / RLS / policy / index / migration actual。
- actual userのsaved Analysis report分布。
- current report bodyの実品質。
- role / routeごとのreal evidence coverage。
- latestとhistoryが実データで常に一致すること。
- Free / Plus / Premiumの実アカウント結果。
- iOS / Android actual-device表示。
- report generation latency / timeout / stale rate。
- production monitoring event。
- Watashi Simulationのcurrent implementation owner。

これらを「ある」「成立済み」と推測しない。

## 2.6 current AnalysisとWatashi Simulationの差分

current Analysis:

```text
observed input accumulation
current role
current route
crossroad
unknown
```

Watashi Simulation:

```text
current routeからbranch pointを選ぶ
alternate routeを仮想生成する
interest directionとして保存する
必要なら将来Pieceへ接続する
```

simulationはcurrent actualの小さな表示追加ではない。

- 新identity。
- observed / simulated / savedの三分離。
- branch intent。
- high-care safety。
- question system connection。
- separate storage。
- separate tier / quota。
- Piece connection。

を必要とするため、発売後laneとする。

---

# 3. Analysis product identity

## 3.1 user-facing identity

```text
app tab:
  分析

emotion history surface:
  こころ天気

self-structure core:
  わたしマップ

latest core title:
  今のわたしマップ
```

「自己分析」「自己構造」という内部語は、current compatibilityや説明で残る場合があるが、user-facing core identityは`わたしマップ`を優先する。

## 3.2 Watashi Mapの定義

```text
Watashi Map =
  保存済み入力の蓄積から、
  場面ごとに立ち上がりやすい役割、
  その役割から続きやすい思考・行動・結果の現在route、
  守っているもの、負荷、まだ分からない場所、変化を、
  断定ではなく根拠付き観測として見せるsurface。
```

## 3.3 Watashi Mapではないもの

```text
性格診断
人格分類
医療診断
未来予測
行動命令
理想自己の押し付け
Emlisの即時返答
Pieceの共有文章
simulated route
```

## 3.4 current routeの意味

```text
current route:
  複数のobserved inputから見えている、
  場面 -> role -> thought/action -> result/aftermathの流れ。
```

current routeは運命でも固定人格でもない。

- 対象periodがある。
- evidence量がある。
- unknownがある。
- 変化し得る。
- simulated routeで上書きされない。

## 3.5 protective meaning / burden meaning

役割やrouteを「悪い癖」として扱わない。

```text
protective meaning:
  その役割・routeが守ろうとしている可能性のあるもの。

burden meaning:
  その役割・routeによって負荷になりやすいところ。
```

両者を一つの善悪scoreへ潰さない。

```text
守っている -> 正しい
負荷がある -> 間違い
```

とは扱わない。

## 3.6 Analysisの成功条件

ユーザーがWatashi Mapを見たとき、最低限次を区別できること。

1. どんな場面の話か。
2. どんな役割が立ち上がっているか。
3. その役割からどんなrouteが続きやすいか。
4. そのrouteが何を守っているように見えるか。
5. どこが負荷になりやすいか。
6. どの期間・どれくらいの観測から見ているか。
7. まだ分からない部分はどこか。
8. 前回から何が変わった／変わっていないか。
9. これは診断・命令・未来予測ではないこと。

---

# 4. environment allocation policy

## 4.1 standard environment

```text
CHAT_5_6_PRO_OK
```

Proで進める主作業:

- current source / owner / contract inventory。
- actual output inventory。
- product identity / version decision。
- evidence / claim / route contract。
- protective / burden / unknown contract。
- time-change design。
- tier / history / refresh design。
- RN / API / DB impact design。
- RED / Product Read rubric。
- boundedな一repo実装。
- deterministic unit / contract test。
- documentation。

## 4.2 Work Ultra gate

Work Ultra候補:

```text
ANL-U1:
  independent cross-repository product-quality audit

ANL-U2:
  final independent release acceptance

SIM-U1:
  post-release simulation independent safety/integration audit
```

Workが利用可能になっただけでは開始しない。

優先順位:

```text
EmlisAI current Work-required task
  > Analysis U1/U2
  > Simulation U1
```

必要条件:

1. 対象Phaseへ到達済み。
2. 独立複数reviewがcompletion condition。
3. EmlisAIに直ちに実行可能な高優先Work作業がない、またはMashが再配分を明示。
4. bounded authorityとprivacy boundaryがある。
5. Mashの明示承認がある。

## 4.3 actual device / human review

```text
MASH_ACTUAL_DEVICE_REQUIRED:
  iOS / Android表示・操作・読みやすさ

MASH_PRODUCT_READ_REQUIRED:
  actual generated Watashi Mapの読感と商品価値
```

Chat / Workは、実機の見え方や人間としての読感を完全には代替しない。

ただし、Mashへ依頼する前に、華恋側で次を完成させる。

- review対象のexact output packet。
- 何を評価するか。
- body-full private boundary。
- rating form。
- 完了条件。
- 結果を受け取った後に華恋が引き取る作業。

## 4.4 Ultraへ置かないもの

- 長い資料読解だけの作業。
- ロードマップ作成。
- deterministic code実装。
- unit test。
- hash / diff。
- 一つずつ追えるowner調査。
- actual output packetの作成。

---

# 5. release target

## 5.1 2027年3月23日のAnalysis体験

発売時の目標flow:

```text
入力を蓄積する
↓
Analysisを開く
↓
こころ天気で感情推移を確認できる
↓
わたしマップで今のoverviewを見る
↓
場面ごとのrole switchを見る
↓
current routeを見る
↓
守っているもの / 負荷を見る
↓
根拠期間 / 観測量 / confidence相当を見る
↓
unknown / not enoughを見る
↓
前回からの安全な変化を見る
↓
必要ならhistoryで過去mapを確認する
```

## 5.2 発売前必須surface

```text
今のわたしマップ overview
よく立ち上がる場面
role switch
current route
protective meaning
burden meaning
unknown / insufficient data
evidence period
observation amount / confidence相当
latest / history
Free / Plus / Premium projection
previous-period change minimum
safe note
```

## 5.3 発売前最低線

日程上scopeを縮めても削らないもの:

```text
current route
source/evidence traceability
protective / burdenの非善悪化
unknown / insufficient-data
診断 / 人格 / 未来断定禁止
latest / history consistency
Free / Plus / Premium access整合
actual output Product Read
actual-device確認
monitoring / rollback
```

縮小可能なもの:

- route表示数。
- crossroadsの深さ。
- change summaryの種類。
- Premium深掘りsection数。
- visual polishの追加variation。

## 5.4 発売後へ回すもの

```text
Watashi Simulation
branch point selection
alternate route generation
saved target route
post-input verification against saved route
simulation Piece
multiple branch comparison
advanced route editor
long-term route evolution
```

## 5.5 こころ天気の位置づけ

こころ天気は発売前に維持する。

```text
こころ天気:
  感情の推移・履歴

わたしマップ:
  場面・役割・current route・meaning
```

両者を一つの巨大payloadへ混ぜず、UI上の接続と意味の分離を保つ。

---

# 6. provisional product decisions

以下はロードマップを進めるための華恋の初期推奨であり、各owner Phaseでactualと照合してfinalizeする。

## D-ANL-001 Analysis中核

```text
Analysis中核:
  わたしマップ

こころ天気:
  auxiliary emotion-history surface
```

## D-ANL-002 version strategy

推奨:

```text
current:
  watashi.map.v1

future release-quality contract candidate:
  watashi.map.v2

container:
  myprofile.report.v5を直ちに捨てない
```

理由:

- route evidence、protective / burden、time change等が増える。
- v1の意味を後から上書きしない。
- existing saved reportを一括rewriteしない。
- latest projectionはnew versionへ段階的に切り替えられる。

final decision owner:

```text
ANL-1 / ANL-9
```

## D-ANL-003 existing report

```text
existing report:
  保持して読めるようにする。

mass rewrite:
  しない。

new latest generation:
  new contractへ切替後はnew versionを使う。
```

Pieceと異なり、Analysisのexisting reportを不要とするMash決定はないため、破壊的cleanupを前提にしない。

## D-ANL-004 current route

```text
current route:
  observed sourceだけから作る。

Piece text:
  sourceにしない。

simulated route:
  sourceにしない。

saved target route:
  current stateへ昇格しない。
```

## D-ANL-005 role / route claim

各claimは、少なくとも次へbindする。

```text
claim kind
period
source-set identity
evidence refs
observation amount
confidence class
unknown boundary
```

## D-ANL-006 protective / burden

```text
protective meaning:
  role / routeが守ろうとしている可能性

burden meaning:
  role / routeが負荷になりやすい部分
```

両者は別field / claim kindとし、片方から片方を自動推測しない。

## D-ANL-007 time change

発売前第一目標:

```text
comparableな前回periodと現在periodの差を、
増えた / 減った / 新しく見えた / 今回は判断できない、
の範囲で表示する。
```

禁止:

```text
成長した
悪化した
治った
本来の自分に近づいた
このまま進む
```

## D-ANL-008 tier floor

current floorを壊さない。

```text
Free:
  light

Plus:
  light + standard

Premium:
  light + standard + deep
```

new sectionのexact tier allocationはANL-7で決める。

## D-ANL-009 history

```text
latest:
  current source set / periodにbind

history:
  保存時のversion / source period / payloadを保持

projection:
  tierで隠しても、report identityを勝手に別reportへ変えない
```

## D-ANL-010 Watashi Simulation

```text
release lane:
  post-release separate lane

current Analysis release blocker:
  Watashi Simulation未実装はblockerではない

future prerequisite:
  observed current route contractがrelease-qualityで成立済み
```

## D-ANL-011 simulation data separation

将来candidate:

```text
analysis.observed_route.v1
analysis.simulated_route.v1
analysis.saved_route_intent.v1
```

同じtable / payloadで扱う場合でも、typeとread policyを混ぜない。

## D-ANL-012 Piece connection

```text
Analysis inference -> Piece original source:
  forbidden

simulated route -> Piece original source:
  forbidden

simulation routeから将来Piece化:
  simulation-specific source role / explicit user action / Piece safety ownerが必要
```

## D-ANL-013 refresh independence

```text
input save:
  Analysis dirty / refresh candidateになり得る

Piece save:
  Analysis success conditionではない

Analysis refresh:
  Piece success conditionではない
```

---

# 7. roadmap overview

| Phase | 名称 | 主目的 | 標準環境 | Work使用 | 主成果物 |
|---|---|---|---|---|---|
| ANL-0 | Current Actual / Output Pin | current owner・contract・real output・未確認を固定 | `CHAT_5_6_PRO_OK` | なし | inventory / owner map / output ledger |
| ANL-1 | Product Identity / Version / Release Boundary | Watashi Map中核・version・simulation分離を固定 | `CHAT_5_6_PRO_OK` | なし | identity / version decision |
| ANL-2 | Shared Source Adoption / Period Source Set | PCE-2をAnalysisのperiod sourceへ採用 | `CHAT_5_6_PRO_OK` | なし | source-set contract |
| ANL-3 | Claim / Evidence / Unknown Contract | claimと根拠・confidence・unknownを固定 | `CHAT_5_6_PRO_OK` | なし | claim taxonomy / evidence contract |
| ANL-4 | Role / Scene / Current Route Fidelity | roleとcurrent routeをevidenceへbind | `CHAT_5_6_PRO_OK` | なし | route fidelity contract |
| ANL-5 | Protective / Burden / High-Care Safety | 守る意味・負荷・自己否定境界を固定 | `CHAT_5_6_PRO_OK` | なし | meaning / safety contract |
| ANL-6 | Time Change / Latest / History | period比較とlatest/history整合を固定 | `CHAT_5_6_PRO_OK` | なし | time-change / history contract |
| ANL-7 | Tier / Access / Distribution / Refresh | plan・read・unread・cache・dirtyを固定 | `CHAT_5_6_PRO_OK` | なし | tier/access/refresh contract |
| ANL-8 | RN Product Surface / Readability | 情報階層・表示・accessibilityを設計 | `CHAT_5_6_PRO_OK` + later device | なし | RN surface design |
| ANL-9 | API / DB / Generation / Migration | actual ownerへ詳細接続する設計 | `CHAT_5_6_PRO_OK` | なし | backend/data/API design |
| ANL-10 | Test / Product Read / Monitoring / Rollback | 実装前にfailureと合格証拠を固定 | `CHAT_5_6_PRO_OK` | なし | RED / Product Read / monitoring plan |
| ANL-11 | Design Freeze / Work Package Split | bounded implementation packetへ分解 | `CHAT_5_6_PRO_OK` | なし | freeze / package index |
| ANL-12A | Source / Evidence / Validity Implementation | source-set・claim evidence・validity実装 | `CHAT_5_6_PRO_OK` | 原則なし | backend bounded changes |
| ANL-12B | Watashi Map Content Implementation | role/route/protective/burden/unknown実装 | `CHAT_5_6_PRO_OK` | 原則なし | payload/content changes |
| ANL-12C | Time Change / History Implementation | change/latest/history実装 | `CHAT_5_6_PRO_OK` | 原則なし | time/history changes |
| ANL-12D | API / Storage Implementation | route/storage/migration bounded実装 | `CHAT_5_6_PRO_OK` | 原則なし | API/DB changes |
| ANL-12E | RN Surface Implementation | overview/detail/history/tier表示 | `CHAT_5_6_PRO_OK` | 原則なし | RN changes |
| ANL-12F | Refresh / Unread / Monitoring Integration | dirty/cache/unread/metrics/flags | `CHAT_5_6_PRO_OK` | 原則なし | integration changes |
| ANL-U1 | Independent Cross-Repo Audit | 4系統独立audit | `WORK_ULTRA_REQUIRED` | Emlis優先後 | independent review |
| ANL-13 | Audit Correction | U1 blockerをbounded補正 | 原則`CHAT_5_6_PRO_OK` | 条件付き | corrections |
| ANL-14 | Integrated E2E / Product Read / Actual Device | end-to-endと人間/実機の品質確認 | Pro + Mash review | 条件付き | acceptance packet |
| ANL-U2 | Final Independent Acceptance | release candidate最終受入れ | `WORK_ULTRA_REQUIRED` | Emlis優先後 | go/no-go material |
| ANL-15 | Release Closure | rollout・monitoring・rollback・docs | `CHAT_5_6_PRO_OK` | U2後 | release closure |

Post-release separate lane:

| Phase | 名称 | 主目的 |
|---|---|---|
| SIM-0 | Simulation Prerequisite Pin | released observed route contractを確認 |
| SIM-1 | Observed / Simulated / Saved Identity | 三identityを分離 |
| SIM-2 | Branch Intent / Route Generation | branch pointとalternate route contract |
| SIM-3 | High-Care / Question / Safety | 高慎重領域・問い・非命令化 |
| SIM-4 | Storage / API / RN / Tier | simulation lifecycleとsurface |
| SIM-5 | Piece Connection | simulation-specific Piece handoff |
| SIM-U1 | Independent Safety Audit | cross-core / safety独立監査 |
| SIM-6 | Simulation Release Closure | rollout / monitoring / help |

---

# 8. Pro-first runway

最初のWork必須gateは`ANL-U1`である。

それまで、次をProで順に進められる。

```text
ANL-0
ANL-1
ANL-2
ANL-3
ANL-4
ANL-5
ANL-6
ANL-7
ANL-8
ANL-9
ANL-10
ANL-11
ANL-12A〜12F
```

条件:

- 一回の作業を一owner / 一contract / 一repoへbounded化。
- deterministic testを持つ。
- actual output reviewをfixtureへ代替しない。
- human Product Read未実行を合格へ変換しない。
- cross-repo独立受入れをANL-U1前に主張しない。
- implementation authority / GitHub write approvalをphaseごとに分ける。

---

# 9. detailed phases

## ANL-0 Current Actual / Output Pin

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

future構想や前提資料だけでAnalysisを理解せず、current code、public contract、DB actual、saved report、RN表示、test、real outputを一枚のinventoryへ固定する。

### 作業

1. Cocolon / mashos-api latest headsを再取得する。
2. Analysis homeからlatest/history/detailまでRN routeを追う。
3. こころ天気とWatashi Mapのownerを分離する。
4. `watashi.map.v1` builder / formatter / rendererを追う。
5. report generation sourceと`myprofile.report.v5` containerを追う。
6. `analysis.validity.v1`のcaller、enforcement、fallbackを追う。
7. latest / monthly / history / detail API contractを記録する。
8. current read / write table、view、RLS、policy、index、migration ownerをproduction catalogで確認する。
9. Free / Plus / Premium、light / standard / deepの消費・表示点を記録する。
10. unread / read marker / dirty / cache / refreshを追う。
11. current testsをowner別に分類する。
12. actual generated outputsを、private body-full review packetとpublic-safe body-free ledgerに分ける。
13. role label、route、unknown、generic fallback、period、evidence、protective / burden、changeの現在分布を確認する。
14. production deploy、actual device、human Product Readの未確認を分ける。

### actual output inventory minimum

最低でも次のcaseを集める。

```text
short input
long input
emotion only
thought + action
self-denial adjacent
relationship
work
positive input
negative input
low-information
mixed periods
insufficient data
role switch multiple
route present
route absent
crossroad present
unknown present
Free
Plus
Premium
latest
history
```

actual user bodyをpublic GitHubへ出さない。

### 成果物

```text
Analysis_Current_Contract_Inventory_YYYYMMDD.md
Analysis_Current_Owner_Map_YYYYMMDD.md
Analysis_Actual_Output_Inventory_YYYYMMDD.md
Analysis_Current_Unconfirmed_Ledger_YYYYMMDD.md
Analysis_Current_DB_RLS_Migration_Evidence_YYYYMMDD.json
```

### 完了条件

- current write / read / generation / projection ownerが分かる。
- Watashi MapとKokoro Weatherを混同していない。
- current payload versionとreport containerを区別できる。
- DB physical nameをcode defaultだけで断定していない。
- actual output品質の確認済み／未確認を分けている。
- fixture testをreal output proofへ変換していない。
- ANL-1〜10のdecision inputが揃う。

### STOP

- production DB actualを確認できず、version / migration設計に影響する。
- actual outputを一件も取得できず、quality closure roadmapをfixtureだけで進める必要がある。
- current head driftによりowner mapが無効になる。
- private outputをpublic durable ownerへ置く必要が生じる。
- current Analysis ownerが複数競合し、正本を決めるためMash判断が必要になる。

### Ultraへ変わる条件

なし。inventoryは分割可能であり、独立複数agentをcompletion conditionにしない。

---

## ANL-1 Product Identity / Version / Release Boundary

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

Watashi Mapの発売前identity、Kokoro Weatherとの責任分離、version strategy、existing report、Simulationの発売後分離を一意にする。

### 決定対象

1. user-facing name。
2. Watashi MapをAnalysis中核とすること。
3. current routeの定義。
4. protective / burden / unknown / time changeをcoreに含めること。
5. `watashi.map.v1`継続か`watashi.map.v2`か。
6. `myprofile.report.v5` containerを維持するか。
7. existing reportをどう読むか。
8. historical aliasesの扱い。
9. Watashi Simulationをpost-release separate laneにすること。
10. release buildにsimulation入口を置くか置かないか。

### 華恋の初期推奨

```text
user-facing core:
  わたしマップ

new payload:
  watashi.map.v2 candidate

report container:
  myprofile.report.v5をANL-9まで維持候補

existing report:
  read維持 / mass rewriteなし

Watashi Simulation:
  release buildではinactive / no public entry
```

### 成果物

```text
Analysis_Product_Identity_And_Release_Boundary_YYYYMMDD.md
WatashiMap_Version_Strategy_Decision_YYYYMMDD.md
Analysis_Existing_Report_Compatibility_Decision_YYYYMMDD.md
Analysis_Normative_Definition_Update_Map_YYYYMMDD.md
```

### 完了条件

- Watashi Mapのcore identityが一意。
- Kokoro Weatherとの責任が一意。
- version strategyが一意。
- existing reportの扱いが一意。
- simulationが発売前scopeへ混入しない。
- current routeとsimulated routeの用語が一意。

### STOP

- current saved reportを破壊しないとnew payloadが成立しない。
- Kokoro WeatherとWatashi Mapを一つのclaim modelへ統合しないと成立しない。
- simulationを入れないとWatashi Mapの商品価値を説明できない。
- user-facing名称変更が全体naming contractを巻き込む。

---

## ANL-2 Shared Source Adoption / Period Source Set

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

PCE-2で固定したsaved input identity / source roles / body-free lineageを、Analysisの複数record・period観測へ拡張し、同じ境界を別定義しない。

### Analysis source-set candidate

```text
contract:
  analysis.source_set.v1 candidate

fields:
  source_set_id
  source_set_version
  owner_user_id
  period_start
  period_end
  source_input_ids[]
  source_input_versions[]
  source_input_bundle_commitments[]
  source_roles[]
  stage_distribution
  included_count
  excluded_count
  exclusion_reason_codes[]
  source_set_commitment
  body_free
```

### source role

```text
original_input:
  observed source

supplemental_answer:
  observed supplemental source

question_need_decision:
  control lineage only

Emlis visible body:
  forbidden

Piece text:
  forbidden

simulated route:
  forbidden

saved target route:
  forbidden as current observed source
```

### event ordering

```text
saved input committed
-> source eligibility / privacy filtering
-> period source set frozen
-> analysis claims built
-> Watashi Map generated
-> validity / Product Read / publish governance
```

Analysis period constructionはPiece saveの成功を待たない。

### privacy

- secret input inclusion policyをowner / report modeごとに明示する。
- public/follower self-structure readへraw source identityを露出しない。
- body-free lineageとbody retrieval capabilityを分離する。
- cross-user source combinationを禁止する。

### 成果物

```text
Analysis_Period_SourceSet_Contract_YYYYMMDD.md
Analysis_SourceRole_Adoption_Matrix_YYYYMMDD.md
Analysis_SourceEligibility_Exclusion_Contract_YYYYMMDD.md
Analysis_CrossCore_NoMixing_Adoption_YYYYMMDD.md
```

### 完了条件

- source input identityがPCE-2と一致する。
- original / supplementalが別roleで保持される。
- period source-set identityがある。
- Piece text / simulated routeがsourceに入らない。
- source exclusionがbody-free codeで追える。
- source identityなしのclaim生成を成功にしない。

### STOP

- current report generationがsaved input identityを一切保持せず、period source setを作れない。
- secret/public境界をsource setで表現できない。
- Analysis sourceを作るためEmlis visible bodyが必要になる。
- current DB actualなしにsource retrieval ownerを決める必要がある。

---

## ANL-3 Claim / Evidence / Unknown Contract

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

Watashi Mapに表示する各文を、単なる生成文ではなく、type・period・evidence・confidence・unknownを持つclaimへする。

### claim kind候補

```text
scene_observation
role_observation
thought_pattern_observation
action_pattern_observation
relation_observation
current_route_step
protective_meaning
burden_meaning
unknown_boundary
insufficient_data
time_change
```

### minimum claim shape candidate

```json
{
  "claim_id": "...",
  "claim_kind": "role_observation",
  "source_set_id": "...",
  "period_start": "...",
  "period_end": "...",
  "evidence_refs": [],
  "evidence_count": 0,
  "confidence_class": "insufficient|low|moderate|high",
  "allowed_display_scope": "summary|detail|internal",
  "unknown_codes": [],
  "body_free_lineage": true
}
```

### evidence invariant

- display textとclaim identityを分離する。
- evidence refはsource bodyをpublicへ出さない。
- claim_kindごとにminimum evidenceを決める。
- evidence countだけでconfidenceを決めない。
- 同じinputの重複を観測数として水増ししない。
- categoryをcauseとして扱わない。
- emotion strengthをcauseとして扱わない。
- one recordからperiod tendencyを断定しない。

### unknown contract

unknownはfailureではない。

```text
not enough
conflicting evidence
scene missing
role ambiguous
route incomplete
protective meaning unknown
burden meaning unknown
period not comparable
```

を別codeで扱う。

### 成果物

```text
Analysis_Claim_Taxonomy_YYYYMMDD.md
Analysis_Evidence_Traceability_Contract_YYYYMMDD.md
Analysis_Confidence_And_ObservationAmount_Contract_YYYYMMDD.md
Analysis_Unknown_InsufficientData_Contract_YYYYMMDD.md
```

### 完了条件

- 全user-visible claimがclaim kindへ分類できる。
- claimからperiod/source/evidenceへ辿れる。
- unknownをgeneric fallbackで隠さない。
- confidenceが人格確率に見えない。
- one-record overclaimを止められる。
- diagnosis / cause / future predictionをmachine-checkableに拒否できる。

### STOP

- current outputの中心文がsource evidenceへbindできない。
- claim typeを増やさずgeneric summary一つで済ませる必要がある。
- confidenceを数値だけで出さないとUIが成立しない。
- unknownを出すとproduct flowが成立しない。

---

## ANL-4 Role / Scene / Current Route Fidelity

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

Watashi Mapの中心であるroleとcurrent routeを、generic labelや飛躍した物語ではなく、observed evidenceに沿う構造へ閉じる。

### current route shape candidate

```text
scene / trigger context
↓
role activation
↓
thought or attention movement
↓
action / non-action
↓
relation or immediate result
↓
aftermath / burden candidate
```

全caseで全nodeが必要とは限らない。
欠けたnodeを固定文で補完しない。

### role label quality

禁止:

```text
単語置換だけの硬いrole名
人格タイプ化
常に / 本質 / 生まれつき
入力にない美化・悪化
同じlabelの乱用
```

必要:

- sceneと一緒に読むと意味が分かる。
- roleが行動や注意の置き方へ接続する。
- userを一語で固定しない。
- fallback labelをactual output inventoryで検出する。

### route fidelity

各route stepについて、次を持つ。

```text
step kind
source claim IDs
source-set ID
order rationale
unknown / omitted reason
```

routeは、単に自然な文章に見えるだけでは合格しない。

### generic fallback detection

最低限検出するもの:

```text
どの入力にも当てはまるroute
sceneだけ変えて同じrole/route
固定4step
「状況を整理する」「行動する」等だけの空疎label
resultがsourceにないのに肯定的結末を追加
```

### 成果物

```text
Analysis_Role_Label_Quality_Contract_YYYYMMDD.md
Analysis_CurrentRoute_Structure_Contract_YYYYMMDD.md
Analysis_Route_Evidence_Fidelity_Contract_YYYYMMDD.md
Analysis_GenericFallback_Detection_Contract_YYYYMMDD.md
```

### 完了条件

- current routeがobserved sourceだけから作られる。
- scene -> role -> routeの接続が説明できる。
- sourceにないresultを追加しない。
- route欠落を固定文で埋めない。
- generic fallbackをmachine / Product Readの両方で検出できる。
- simulated routeと同じcontractを使わない。

### STOP

- current engineのbasisにroute stepの根拠がなく、文章だけを作る必要がある。
- role labelを固有語case分岐で増やさないと品質が出ない。
- sourceにないresultを補わないとrouteが読めない。
- current routeとsimulation routeを同じownerへ置かないと実装できない。

---

## ANL-5 Protective / Burden / High-Care Safety

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

role / current routeが何を守っている可能性があるかと、どこが負荷になりやすいかを分離し、自己否定・欠陥化・治療化を防ぐ。

### protective meaning contract

```text
claim:
  このrole / routeは、何かを守るために働いている可能性がある。

not claim:
  それが正しい。
  必ずそうである。
  過去の原因がこれである。
```

### burden meaning contract

```text
claim:
  このrouteでは、後から疲れ・抱え込み・距離の難しさ等が負荷になりやすいように見える。

not claim:
  欠点である。
  改善すべきである。
  病気である。
```

### self-denial boundary

self-denial adjacent inputで禁止:

- userの否定を人格真実として再掲する。
- 「あなたは自分を否定する人」とtype化する。
- role / routeを罰や原因にする。
- positivityで上書きする。
- 具体的治療・安全判断をAnalysisに持たせる。

許容:

- source上の言葉と観測範囲を限定する。
- unknownを残す。
- protective meaningを断定しない。
- high-care display policyへ切り替える。

### high-care domain

```text
恋愛
家族
健康
金銭
トラウマ
暴力 / 被害 / 加害
安全隣接
強い自己否定
```

では、cause・相手の意図・未来・具体行動を強く出さない。

### 成果物

```text
Analysis_ProtectiveMeaning_Contract_YYYYMMDD.md
Analysis_BurdenMeaning_Contract_YYYYMMDD.md
Analysis_SelfDenial_And_HighCare_Safety_Contract_YYYYMMDD.md
Analysis_NonDiagnosis_NonCorrection_Language_Policy_YYYYMMDD.md
```

### 完了条件

- protectiveとburdenが別claim。
- protectiveから正当化へ飛ばない。
- burdenから欠陥化へ飛ばない。
- high-careで行動命令を出さない。
- self-denialを人格断定しない。
- current roleを「消すべきもの」と扱わない。

### STOP

- source evidenceなしにprotective meaningを生成する必要がある。
- burdenを表示すると必ずdiagnosis / correctionに見える。
- high-care domainを通常routeと同じ文法で扱わないと成立しない。
- Emlis safety outputをcopyしないと安全に見せられない。

---

## ANL-6 Time Change / Latest / History

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

Watashi Mapを一回きりの固定分析で終わらせず、comparableなperiod間で安全な変化を見せ、latestとhistoryを一貫させる。

### period comparison

比較に必要なもの:

```text
current report identity
previous report identity
current source-set identity
previous source-set identity
period lengths
coverage / observation amount
comparable claim kinds
version compatibility
```

### change kind候補

```text
newly_observed
more_visible
less_visible
stable_within_scope
route_step_changed
role_context_shifted
burden_shifted
protective_meaning_shifted
not_comparable
insufficient_data
```

### display boundary

許容:

```text
前回より、この場面で整える役割が見えやすくなっています。
今回は、前回にはなかった別のrouteが少し見えています。
観測量が違うため、変化とはまだ言えません。
```

禁止:

```text
成長しました。
悪化しています。
本来の自分になりました。
このまま変わっていきます。
```

### latest / history invariant

```text
latest record:
  exact report identity

history item:
  same report identity / version / period

detail:
  same canonical payload

Free projection:
  detailを隠しても別内容へ作り替えない
```

### 成果物

```text
Analysis_TimeChange_Contract_YYYYMMDD.md
Analysis_Period_Comparability_Contract_YYYYMMDD.md
Analysis_Latest_History_Detail_Identity_Contract_YYYYMMDD.md
Analysis_Change_Unknown_Contract_YYYYMMDD.md
```

### 完了条件

- comparableでないperiodをchangeへ変換しない。
- time changeが人格成長scoreにならない。
- latest / history / detailが同一identity。
- old version比較の扱いがある。
- no-data / insufficientをchangeなしへ誤分類しない。

### STOP

- current storageでprevious comparable reportを特定できない。
- report version違いを吸収する方法がない。
- source-set identityなしでperiod比較する必要がある。
- latestがview-time regenerationされ、historyと同一性を保てない。

---

## ANL-7 Tier / Access / Distribution / Refresh

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

Free / Plus / Premium、light / standard / deep、latest / history、unread、distribution、dirty refreshを一つのproduct contractとして整合させる。

### current floor

```text
Free:
  light

Plus:
  light / standard

Premium:
  light / standard / deep
```

### decision target

- overview visibility。
- role switch count / detail。
- current route visibility。
- crossroads。
- protective / burden。
- evidence period / amount。
- time change。
- history retention / detail。
- monthly distribution。
- unread badge。
- account visibility / follower read。

### privacy / access

- owner private Analysisとfollowed owner reportの境界を確認する。
- secret input inclusionとshared reportを混ぜない。
- Free projectionでhidden bodyをmetaへ残さない。
- tier downgrade後のhistory readを決める。
- report distribution notificationとactual publishable rowを一致させる。

### refresh / dirty

```text
input saved
-> Analysis source dirty candidate
-> bounded background/ensure generation
-> latest version key changes
-> unread / refresh signal
```

禁止:

- Piece saveをAnalysis refresh条件にする。
- screen openごとに無制限再生成する。
- stale reportをlatestとして出す。
- tier変更で別ownerのreportを生成する。

### 成果物

```text
Analysis_Tier_Surface_Contract_YYYYMMDD.md
Analysis_Access_And_ReportVisibility_Contract_YYYYMMDD.md
Analysis_Distribution_Unread_Contract_YYYYMMDD.md
Analysis_Dirty_Cache_Refresh_Contract_YYYYMMDD.md
```

### 完了条件

- tierごとのsurfaceが一意。
- Free detail leak exact0。
- latest / history / unreadが同じpublish governanceへbind。
- dirty / refresh / cache invalidationのownerが一意。
- input saveとAnalysis updateのorderingが一意。
- Piece依存exact0。

### STOP

- production access/RLSを確認できない。
- tier projectionでhidden bodyを返さないとRNが動かない。
- current unread ownerがreport publishと分離しすぎて整合不能。
- public/follower readとowner private sourceを分離できない。

---

## ANL-8 RN Product Surface / Readability

### 環境

```text
CHAT_5_6_PRO_OK
later MASH_ACTUAL_DEVICE_REQUIRED
```

### 目的

Watashi Mapの情報量を増やすだけでなく、ユーザーが「今の自分のroute」を順番に読めるsurfaceへする。

### information hierarchy

推奨順:

```text
1. 今のわたしマップ overview
2. 根拠期間 / 観測量
3. よく見えている場面
4. role switch
5. current route
6. 守っているもの
7. 負荷になりやすいところ
8. 前回からの変化
9. unknown / not enough
10. 詳細report / history
```

全sectionを常時同じ密度で並べない。

### RN target

- AnalysisContentFirstScreen。
- WatashiMapRenderer。
- overview / role / route / crossroad / unknown components。
- SelfStructureReportGenerateScreen。
- SelfStructureReportViewerScreen。
- SelfStructureReportHistoryScreen。
- Analysis route / unread hooks。
- tutorial scenario。

### readability

- long labels。
- Japanese / English mixed。
- dark mode。
- dynamic font size。
- VoiceOver / TalkBack。
- collapsed / expanded sections。
- empty / loading / stale / insufficient。
- tier lockの位置。
- latestとhistoryの行き来。

### actual device matrix

```text
iOS
Android
Free
Plus
Premium
short output
long output
many role switches
route absent
unknown only
high-care output
time change present
no comparable history
light / standard / deep
dark / light theme
large text
```

### 成果物

```text
Analysis_RN_Surface_InformationArchitecture_YYYYMMDD.md
WatashiMap_Component_And_State_Design_YYYYMMDD.md
Analysis_Accessibility_Readability_Contract_YYYYMMDD.md
Analysis_ActualDevice_Review_Packet_Design_YYYYMMDD.md
```

### 完了条件

- userがscene / role / route / meaning / evidenceを区別できる。
- lockがcontentの代わりにならない。
- unknownがerrorに見えない。
- no-dataから入力へ戻れる。
- long outputが読む順を壊さない。
- actual-device項目がcode-side acceptanceと分離されている。

### STOP

- payload変更なしでは情報階層を作れないのにANL-9が未完了。
- tier lockにhidden body leakがある。
- actual-deviceでしか判定できないことをProだけで完了扱いする必要がある。
- current rendererを全面rewriteしないと一sectionも改善できない。

---

## ANL-9 API / DB / Generation / Migration

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

ANL-1〜8のcontractをcurrent backend / DB / API / RN ownerへbindし、破壊的greenfieldではない詳細実装設計を作る。

### storage option

```text
Option A:
  current myprofile_reports / self_structure_reports familyへ
  versioned watashiMap payloadをadditive保存

Option B:
  current report row + dedicated evidence/claim child table

Option C:
  dedicated Analysis artifact family + current report projection
```

初期推奨:

```text
発売前quality closure:
  Option Aを第一候補

大量evidence / claim queryが必要な場合:
  Option B

current report familyで安全に成立しない場合:
  Option C
```

Watashi Simulation storageを、このdecisionへ混ぜない。

### API target

current routeを基準に、必要ならadditive field / candidate routeを設計する。

```text
/self-structure/latest/status
/self-structure/latest
/self-structure/monthly/ensure
/self-structure/reports/history
/self-structure/reports/{report_id}

/analysis/home-summary
/analysis/reports/ensure
/analysis/reports/ready
/analysis/reports/{report_id}
```

route renameを品質改善の必須条件にしない。

### generation design

- source-set freeze。
- evidence / claim build。
- Watashi Map projection。
- validity gate。
- Product Read candidate packet。
- publish/save governance。
- latest version key。
- cache invalidation。

### migration design

- production catalog baseline。
- additive field / JSON version。
- index。
- RLS / access。
- backfill不要を第一候補。
- existing report read維持。
- rollback。
- partial rollout。

### 成果物

```text
Analysis_Data_Contract_Design_YYYYMMDD.md
Analysis_API_Contract_Design_YYYYMMDD.md
Analysis_Generation_Publish_Governance_Design_YYYYMMDD.md
Analysis_DB_Migration_Rollback_Design_YYYYMMDD.md
Analysis_RN_Impact_Map_YYYYMMDD.md
```

### 完了条件

- write / read / generation / publish ownerが一意。
- version strategyがDB/API/RNで一致。
- existing reportが読める。
- source/evidence bodyがpublic metaへ出ない。
- rollbackでcurrent stable surfaceへsafe-disableできる。
- Simulation table / routeを発売前migrationへ混ぜない。

### STOP

- production DB actualなしにirreversible migrationを決める。
- current route削除が必要になる。
- existing reportをmass rewriteしないと成立しない。
- public/private report accessを安全に分けられない。
- current report containerへpayloadを入れるとsize/index/latencyを満たせない。

---

## ANL-10 Test / Product Read / Monitoring / Rollback

### 環境

```text
CHAT_5_6_PRO_OK
later MASH_PRODUCT_READ_REQUIRED
```

### 目的

実装前に、Analysisを壊すfailureと、実際に商品として読めることの証拠体系を固定する。

### required negative tests

1. one recordからperiod tendencyを断定する。
2. categoryをcauseにする。
3. emotion strengthをcauseにする。
4. Piece textをobserved factにする。
5. simulated routeをcurrent routeにする。
6. supplemental answerでoriginal sourceを上書きする。
7. source-set identityなしでclaimを保存する。
8. evidenceなしrole labelを表示する。
9. route stepにsourceにないresultを加える。
10. protective meaningを断定する。
11. burdenを欠点・診断にする。
12. self-denialを人格typeにする。
13. high-care領域で行動を命令する。
14. unknownをgeneric positive summaryで隠す。
15. comparableでないperiodをchangeにする。
16. latest / history / detail本文が違う。
17. Free responseにdetail bodyが残る。
18. tier downgradeでaccessが不整合。
19. stale reportをlatestとして返す。
20. dirty signalが失われる。
21. screen openで無制限regenerationする。
22. unreadが未publish reportへ立つ。
23. report validity failなのにpublishされる。
24. safeだがgenericなoutputを自動PASSする。
25. old aliasとcurrent routeでpayloadが不一致。
26. monitoringへsource bodyを出す。
27. rollback後もnew partial payloadを表示する。
28. simulation fieldがrelease payloadへ混入する。

### automated suites

- source-set unit。
- evidence/claim contract。
- route fidelity。
- protective/burden safety。
- time change。
- validity gate。
- API contract。
- storage / migration。
- tier / access。
- latest / history / detail identity。
- RN screen contract。
- dirty / cache / unread。
- feature flags。
- rollback。

### Product Read

machine testでは判定できないもの:

```text
入力を読んだ構造に見えるか
role labelが人間として自然か
current routeに飛躍がないか
protective meaningが擁護・美化に見えないか
burdenが欠陥化に見えないか
unknownが逃げに見えないか
changeが成長判定に見えないか
Freeでも価値が伝わるか
Plus/Premiumに払う理由があるか
文章量とUI密度が適切か
```

Product Read packetは、case identityをblind化し、expected contractとratingを分離する。

### monitoring candidate

```text
analysis_report_source_set_built
analysis_report_source_excluded
analysis_claim_built
analysis_claim_rejected
analysis_route_built
analysis_route_rejected
analysis_validity_passed
analysis_validity_failed
analysis_report_saved
analysis_report_publish_skipped
analysis_latest_served
analysis_history_served
analysis_change_built
analysis_change_not_comparable
analysis_tier_projection_applied
analysis_refresh_requested
analysis_refresh_succeeded
analysis_refresh_failed
analysis_stale_served
analysis_access_denied
```

raw input、claim body、report body、Emlis body、Piece bodyをmetricへ出さない。

### feature flag / rollback

candidate:

```text
analysis_watashi_map_v2
analysis_evidence_claims
analysis_protective_burden
analysis_time_change
analysis_new_rn_surface
```

rollback:

```text
new generation OFF
new projection OFF
new RN section OFF
current stable Watashi Map v1 readへsafe fallback
new DB dataは保持して再実行可能
```

### 成果物

```text
Analysis_RED_Contract_Catalog_YYYYMMDD.md
Analysis_Test_Matrix_YYYYMMDD.md
Analysis_ProductRead_Rubric_YYYYMMDD.md
Analysis_Monitoring_Privacy_Contract_YYYYMMDD.md
Analysis_FeatureFlag_Rollback_Design_YYYYMMDD.md
```

### 完了条件

- release blockerがmachine-checkable。
- Product Read対象がfixtureと分離。
- body-free monitoring。
- rollbackがcurrent stable surfaceへ戻れる。
- actual-device / human judgmentが別Gate。
- simulation混入testがある。

---

## ANL-11 Design Freeze / Work Package Split

### 環境

```text
CHAT_5_6_PRO_OK
```

### 目的

ANL-0〜10を、実装者判断へ未決定を押し込まないbounded packetへ分割する。

### 作業

- decision conflict解消。
- unresolved ledger。
- exact owner / path候補。
- dependency graph。
- RED-first order。
- implementation order。
- GitHub write unit。
- DB/RN/API分離。
- privacy classification。
- postverification。
- environment classification。
- human/device Gate。

### bounded packet候補

```text
A1  contract/version helpers
A2  period source-set owner
A3  evidence/claim contract
A4  current route owner
A5  protective/burden owner
A6  unknown/insufficient owner
A7  time-change owner
A8  validity/publish governance
A9  storage/migration
A10 API projection
A11 tier/access
A12 latest/history/detail identity
A13 dirty/cache/unread
A14 RN overview
A15 RN role/route/meaning
A16 RN history/change/unknown
A17 Product Read packet
A18 monitoring/feature flags
A19 integration E2E
```

一つの巨大authorityへ束ねない。

### 成果物

```text
Analysis_Design_Freeze_Candidate_YYYYMMDD.md
Analysis_Implementation_WorkPackage_Index_YYYYMMDD.md
Analysis_Environment_Assignment_Ledger_YYYYMMDD.md
Analysis_Unresolved_Decision_Ledger_YYYYMMDD.md
```

### 完了条件

- Pro packetとUltra gateが一意。
- package依存関係が一意。
- no-op / docs / code / DB / human / deviceを区別。
- implementation前未決定0、または明示STOP。
- automatic progression false。

### STOP

- DB migrationとRN変更を一authorityにしないと成立しない。
- Product Readをimplementation後の気分判断へ残す。
- unresolved safetyを実装者へ委ねる。
- Work Ultraを使わないと設計書自体を完成できないと誤認する。

---

## ANL-12A〜12F Pro bounded implementation

### 共通環境

```text
CHAT_5_6_PRO_OK
```

bounded分割とdeterministic verificationで品質を維持できる限り、実装もProを標準とする。

### ANL-12A Source / Evidence / Validity

- period source-set。
- source role adoption。
- evidence refs。
- claim identity。
- validity gate拡張。
- source/body leak negative tests。

### ANL-12B Watashi Map Content

- role label。
- current route。
- protective meaning。
- burden meaning。
- unknown / not enough。
- generic fallback detection。

### ANL-12C Time Change / History

- comparable period。
- change contract。
- latest/history/detail identity。
- old payload projection。

### ANL-12D API / Storage

- versioned payload。
- save / read。
- migration。
- RLS / access。
- rollback。

### ANL-12E RN Surface

- information hierarchy。
- role / route / meaning cards。
- change / unknown。
- tier lock。
- history/detail。
- accessibility。

### ANL-12F Refresh / Unread / Monitoring

- dirty signal。
- version key。
- cache invalidation。
- unread。
- distribution。
- body-free metrics。
- feature flag。

### 共通完了条件

- packet test green。
- approved exact path以外変更0。
- body leak 0。
- current public route regression 0。
- existing report read regression 0。
- fresh GitHub verification。
- durable checkpoint。
- independent audit前に全体PASSを主張しない。

### 共通STOP

- 一packetが複数repositoryの独立受入れをcompletion conditionにする。
- same authority内でDB/RN/human reviewを分離できない。
- Work固有runtimeが必要になる。
- private bodyをpublic reviewへ出す必要がある。

---

## ANL-U1 Independent Cross-Repo Audit

### 環境

```text
WORK_ULTRA_REQUIRED
```

### Work割当順位

```text
EmlisAI current Work-required task
  > Analysis ANL-U1
```

### 目的

一人の華恋による実装確認とは別に、Analysis全体を独立複数系統で監査する。

### proposed exact4 streams

```text
Stream A:
  source-set / evidence / DB / migration / API / rollback

Stream B:
  role / route / protective / burden / unknown / diagnosis / overclaim / Product Read

Stream C:
  RN / tier / latest / history / unread / refresh / accessibility

Stream D:
  Emlis / Piece / Analysis no-mixing / privacy / release integration
```

### exit

- exact4 reviewが有効。
- same source basisを読んでいる。
- unresolved BLOCKER 0、またはexact correction list。
- privacy / access / source / route conflictが分類済み。
- ANL-14へ進める証拠がある。

### STOP

- Work unavailable。
- EmlisAIに高優先のWork taskがある。
- reviewer inputが異なる。
- private bodyを独立系統へ安全に渡せない。
- audit scopeが固定できない。

---

## ANL-13 Audit Correction

### 標準環境

```text
CHAT_5_6_PRO_OK
```

U1のblockerをownerごとのbounded correctionへ戻す。

Ultraへ再分類する条件:

- correction自体がmulti-agent atomic stageを要求。
- multi-repo同時変更なしでは整合しない。
- independent reviewの再実行がcompletion condition。

---

## ANL-14 Integrated E2E / Product Read / Actual Device

### 環境

```text
code-side:
  CHAT_5_6_PRO_OK

human read:
  MASH_PRODUCT_READ_REQUIRED

actual device:
  MASH_ACTUAL_DEVICE_REQUIRED
```

### minimum E2E

```text
input save
-> Analysis dirty
-> generation / publish governance
-> latest version update
-> Analysis home refresh
-> Watashi Map overview
-> role switch
-> current route
-> protective / burden
-> evidence / unknown
-> time change
-> history / detail
-> tier change
-> unread/read
-> rollback
```

### Product Read matrix

- short / long。
- low-information。
- self-denial adjacent。
- positive / negative。
- work / relationship / value。
- role single / multiple。
- route complete / incomplete。
- protective known / unknown。
- burden known / unknown。
- change comparable / not comparable。
- Free / Plus / Premium。

### device matrix

- iOS / Android。
- light / dark。
- standard / large text。
- Free / Plus / Premium。
- latest / history / detail。
- offline / retry / stale。

### 完了条件

```text
major route grounding failure: 0
role label major unnaturalness: 0
protective/burden harmful framing: 0
diagnosis/personality/future overclaim: 0
latest/history identity mismatch: 0
tier leak: 0
body leak: 0
major RN collapse: 0
refresh/unread blocker: 0
rollback unproven: 0
```

Product Readでminorが残る場合、発売品質への影響とbounded correctionを明示する。

---

## ANL-U2 Final Independent Acceptance

### 環境

```text
WORK_ULTRA_REQUIRED
```

### Work割当順位

EmlisAIのWork critical pathを優先する。

### review focus

- current actualとのcongruence。
- source/evidence traceability。
- current route fidelity。
- protective / burden safety。
- unknown / insufficient。
- time change。
- tier/access/history。
- body-free privacy。
- cross-core no-mixing。
- Product Read evidence。
- actual-device evidence。
- monitoring / rollback。
- simulation release payload混入0。

### exit

```text
unresolved BLOCKER: 0
unresolved MAJOR: 0
body leak: 0
tier/access accident: 0
source/evidence mismatch: 0
route grounding failure: 0
harmful meaning framing: 0
latest/history mismatch: 0
rollback unproven: 0
```

U2 PASSだけでdeploy / store submissionを許可しない。

---

## ANL-15 Release Closure

### 環境

```text
CHAT_5_6_PRO_OK
```

### 作業

- U2 result反映。
- final feature flags。
- rollout order。
- monitoring query / alert。
- rollback drill。
- support / help。
- Free / Plus / Premium説明。
- privacy / Data Safety確認。
- release notes。
- final durable checkpoint。
- Watashi Simulationがinactiveであることの確認。

### 完了条件

- release scope固定。
- post-release scope固定。
- monitoring owner固定。
- rollback owner固定。
- support responseあり。
- final head / changed paths / remote bytes確認済み。
- simulation automatic progression false。

---

# 10. post-release Watashi Simulation lane

## 10.1 lane position

Watashi Simulationは、Watashi Mapで見えたcurrent routeをもとに、別の選び方を仮想的に試す機能である。

```text
current routeを見る
-> branch pointを選ぶ
-> alternate routeを見る
-> interest directionとして保存する
-> 必要なら将来Pieceへ接続する
```

これはAnalysis release quality closureと別である。

## 10.2 entry prerequisite

SIM-0へ入るための最低条件:

1. ANL-15 complete。
2. current routeがobserved evidenceへbind済み。
3. `observed` identityがversioned。
4. unknown / high-care boundaryが成立。
5. simulationをcurrent stateへ戻さないwrite policyがある。
6. Mashが別authorityを承認。

## 10.3 SIM-1 Observed / Simulated / Saved Identity

```text
observed:
  input historyから見えているcurrent route

simulated:
  branch intentから仮想生成したalternate route

saved:
  userが関心を持った方向
  current stateではない
```

禁止:

- simulatedをobservedへ昇格。
- savedをcurrent routeへ昇格。
- branch generationだけでAnalysis claimを更新。

## 10.4 SIM-2 Branch Intent / Route Generation

必要meta:

```text
source observed route identity
source role identity
branch point
branch intent
route generation contract version
safety scope
simulated route identity
```

alternate routeは予測ではない。

```text
こうすればこうなる
```

ではなく、

```text
この分岐では、こういう動き方も候補として置ける
```

までとする。

## 10.5 SIM-3 High-Care / Question / Safety

- branch intentが曖昧な時だけ短い問い。
- 質問を増やしすぎない。
- high-careでは具体行動を弱める、または生成しない。
- current roleを悪いrouteとして扱わない。
- 正解routeを作らない。
- treatment / correction / optimizationを禁止。

## 10.6 SIM-4 Storage / API / RN / Tier

candidate data:

```text
role card
observed route
simulation session
simulated route
saved route intent
```

Analysis report payloadへsimulated bodyを混ぜず、separate ownerを第一候補とする。

## 10.7 SIM-5 Piece connection

simulationからPieceへ接続する場合:

```text
source role:
  simulated_route_expression candidate

not source role:
  original_input
  observed current route
```

明示的なuser action、Piece content/safety owner、simulation label、external share boundaryを必要とする。

## 10.8 SIM-U1

Work Ultraによる独立safety / cross-core audit。

focus:

- observed / simulated / saved混同。
- high-care。
- action command。
- future prediction。
- self-denial。
- Piece connection。
- storage / access / privacy。

## 10.9 SIM-6

simulation-specific release closure。

ANL release closureやPiece release closureへ自動包含しない。

---

# 11. Work Ultra queue policy

## 11.1 AnalysisがWorkを使うexact gate

```text
ANL-U1
ANL-U2
SIM-U1
```

## 11.2 Proで進める予定の主作業

```text
ANL-0〜ANL-11
ANL-12A〜12F
ANL-13
ANL-14のcode-side分析・修正
ANL-15
SIM-0〜5の設計・bounded実装候補
SIM-6
```

## 11.3 Work再配分

```text
1. EmlisAI current Work-required next actionを確認。
2. actionableならEmlisAIを優先。
3. external wait / completionの場合だけAnalysis gateを候補化。
4. Mash承認後だけ実行。
```

## 11.4 追加課金

本ロードマップは追加クレジット購入を前提にしない。

Work枠がなければU1/U2/SIM-U1をpendingに保持し、合格扱いしない。

---

# 12. relation to EmlisAI

## 12.1 responsibility

```text
EmlisAI:
  今回の入力を即時に観測する。

Analysis:
  saved inputの蓄積をperiod単位で観測する。
```

## 12.2 AnalysisがEmlisAIへ要求しないこと

- Watashi Map sectionをEmlis ASTへ追加。
- Analysis claimをEmlis visible bodyへcopy。
- Analysis routeをcurrent user inputへ昇格。
- Analysis validityをEmlis safetyへ統合。
- Analysis tier/historyをEmlis metaへ持たせる。
- Emlis outputの文章をAnalysis evidenceとして利用。

## 12.3 shared material

再利用できるのはbody-free identity / stage / source role / commitmentである。

Emlis visible `comment_text`はAnalysis source bodyではない。

## 12.4 current Emlis state

Analysis roadmap・設計・実装は、EmlisAI current authority、STOP、pending、credit、Cycle001 acceptanceを変更しない。

---

# 13. relation to Piece

## 13.1 independence

```text
AnalysisはPiece完了に依存しない。
PieceはAnalysis完了に依存しない。
```

## 13.2 forbidden mixing

- Piece textをAnalysis observed factにしない。
- Piece format / visual recipeをAnalysis claimにしない。
- Analysis inferenceをPiece original sourceにしない。
- Analysis updateをPiece save成功条件にしない。
- Piece saveをAnalysis refresh成功条件にしない。

## 13.3 future simulation Piece

Watashi SimulationからPieceへ接続する将来案は、通常Piece sourceとは別contractを必要とする。

```text
simulation route:
  observed factではない

Piece export:
  simulation由来であることを失わない
```

Piece PCE-4 / PCE-5 / PCE-9Cのcurrent contractと接続するまで実装しない。

---

# 14. release blockers

次はAnalysis release blockerである。

```text
source-set identityなしのreport
claim evidence不明
role labelが人格type化
current routeにsource外step
protective meaningの断定
burdenの欠陥化 / 診断化
self-denialを人格真実として表示
unknownをgeneric outputで隠す
one recordからperiod tendency
category / emotion strengthからcause断定
comparableでないtime change
latest / history / detail mismatch
Free detail leak
tier/access不整合
stale latest
unread / refresh不整合
body leak
monitoringなし
rollback不能
actual Product Readなし
actual-device evidenceなし
simulation fieldのrelease payload混入
```

次は発売後へ回せるため、Analysis release blockerではない。

```text
Watashi Simulation
branch point UI
saved target route
simulation Piece
multiple alternate routes
advanced route comparison
post-input verification against target route
```

---

# 15. decision ledger

| ID | decision | current provisional answer | final owner |
|---|---|---|---|
| D001 | Analysis中核 | Watashi Map | ANL-1 |
| D002 | Kokoro Weather | auxiliary / separate | ANL-1 |
| D003 | payload version | `watashi.map.v2` candidate | ANL-1 / ANL-9 |
| D004 | report container | `myprofile.report.v5`維持候補 | ANL-1 / ANL-9 |
| D005 | existing reports | read維持 / mass rewriteなし | ANL-1 / ANL-9 |
| D006 | source contract | PCE-2 adoption | ANL-2 |
| D007 | period source-set | versioned body-free set | ANL-2 |
| D008 | Piece text reuse | forbidden | ANL-2 |
| D009 | simulated route reuse | forbidden as observed source | ANL-2 |
| D010 | claim taxonomy | scene/role/route/protective/burden/unknown/change | ANL-3 |
| D011 | confidence | class + evidence, no personality probability | ANL-3 |
| D012 | current route | observed only | ANL-4 |
| D013 | route node shape | scene->role->thought/action->result/aftermath candidate | ANL-4 |
| D014 | protective/burden | separate claims | ANL-5 |
| D015 | time change | comparable period minimum | ANL-6 |
| D016 | tier floor | Free light / Plus standard / Premium deep | ANL-7 |
| D017 | storage | current report family additive first candidate | ANL-9 |
| D018 | Product Read | release mandatory | ANL-10 / ANL-14 |
| D019 | Work U1 exact4 | proposed | ANL-11 / Mash approval |
| D020 | final Ultra acceptance | proposed | ANL-11 / Mash approval |
| D021 | Watashi Simulation | post-release separate lane | ANL-1 |
| D022 | simulation storage | separate owner first candidate | SIM-4 |
| D023 | simulation Piece | explicit simulation source role | SIM-5 |

---

# 16. immediate next action

本ロードマップ採用後の最初のbounded作業候補:

```text
実行環境判定:
  CHAT_5_6_PRO_OK

対象:
  ANL-0 Current Actual / Output Pin

exact action:
  ANL0_CURRENT_ACTUAL_CONTRACT_OUTPUT_OWNER_AND_UNCONFIRMED_INVENTORY_READ_ONLY

作業:
  Analysis / Watashi Mapのcurrent RN・backend・API・DB・tier・history・refresh・test・actual outputを一枚のinventoryへ固定する。

変更:
  read-only

GitHub write:
  別承認までなし

Mash action:
  現時点ではなし

完了:
  ANL-1以降のidentity / version / evidence / route / time-change判断に必要なactual factsが揃う。
```

Piece側のqueue:

```text
PCE3_RECORD_LIFECYCLE_VISIBILITY_QUOTA_DESIGN_ONLY
```

は保持するが、本ロードマップ作成だけでactivationしない。

---

# 17. closure statement

```text
ANALYSIS_ROADMAP_CREATED
CURRENT_ACTUAL_NOT_GREENFIELD
WATASHI_MAP_RELEASE_CORE_FIXED_AS_ROADMAP_DIRECTION
KOKORO_WEATHER_AUXILIARY_BOUNDARY_PRESERVED
PCE2_SHARED_SOURCE_CONTRACT_ADOPTED_NOT_REDEFINED
PIECE_TEXT_AS_ANALYSIS_FACT_FORBIDDEN
SIMULATED_ROUTE_AS_OBSERVED_SOURCE_FORBIDDEN
PRO_FIRST_RUNWAY_DEFINED
WORK_ULTRA_DEFERRED_TO_INDEPENDENT_AUDIT_AND_FINAL_ACCEPTANCE
WORK_ULTRA_REMAINS_EMLIS_AI_FIRST_PRIORITY
HUMAN_PRODUCT_READ_REQUIRED_LATER
ACTUAL_DEVICE_REVIEW_REQUIRED_LATER
WATASHI_SIMULATION_POST_RELEASE_SEPARATE_LANE
ANALYSIS_IMPLEMENTATION_NOT_STARTED
GITHUB_WRITE_EXACT0
AUTOMATIC_PROGRESSION_FALSE
NEXT_ANALYSIS_ACTION_ANL0_CHAT_5_6_PRO_OK
```
