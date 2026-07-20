# Cocolon / EmlisAI P7 Product Quality Runner / Long-run Product Gate 詳細設計書・実装順

作成日: 2026-06-12 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書  
対象: Cocolon / EmlisAI / `/emotion/submit` immediate observation / `Emlisの観測` / Product Read Feel / User Label Connection / Structure Insight / Product Quality Runner / Long-run Product Gate  
基準: ローカル受領ファイル  
GitHub接続確認: 不要（Mash様指定により未実施）  
コード変更: なし  
DB変更: なし  
RN変更: なし  
API route / request key / public response top-level key変更: なし  
実ファイル化: まだ行わない。本文内の `*.py` / `*.json` / `schema` は実装段階で採用判断する候補。  

---

## 0. この設計書の結論

次に進める実装段階は、**P7-0 / P7-1: P5/P6 body-free handoff固定 + P7 red ledger固定**です。

ただし、これはP7全体実装ではありません。  
今回のP7設計の目的は、EmlisAIを「完成したことにする」ことではなく、**P5/P6までに作った材料がCocolonの商品価値に近づいているかを継続測定できる構造を作ること**です。

P7は、EmlisAIの本文を強くする工程ではありません。  
P7は、EmlisAIの本文・履歴線・構造気づき・表示到達・読感・長期入力継続可能性を、**赤を隠さず、body-freeで、release判定と分離して測る工程**です。

この設計書で固定する主判断は次です。

```text
1. P7はrelease_allowedを立てない。
2. P7はProduct Pass候補をRelease Readyへ変換しない。
3. P7はP5/P6のHOLDをgreen化しない。
4. P7はPositive Recovery赤とProduct Quality Connection timeoutを必ずred ledgerへ登録する。
5. P7は既存Product Quality系moduleを「完成済み証拠」として扱わず、現行P5/P6 handoff後の役割へ再分類する。
6. P7の最初の実装は、本文生成ではなく red ledger / handoff normalizer / runner plan / body-free schema から始める。
7. heavy E2E / timeout系をrunner本線に入れない。隔離・timeout budget・subset化・body-free event化を先に設計する。
```

華恋の判断として、ここでP7へ進む理由は「P5/P6が完成したから」ではありません。  
**P5/P6がrelease readyではないことを保ったまま、次に測る構造が必要になったから**です。

---

## 1. 今回確認した基準面

### 1.1 受領ローカルファイル

```text
/mnt/data/Cocolon_前提資料(204).zip
/mnt/data/EmlisAIの実装済み資料(55).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608(8).md
/mnt/data/Cocolon_EmlisAI_P7_PreDesign_ConsiderationMemo_20260612(1).md
/mnt/data/Cocolon(226).zip
/mnt/data/mashos-api(139).zip
```

### 1.2 展開後の確認件数

| 対象 | 展開件数 | 読み |
|---|---:|---|
| `Cocolon_前提資料(204).zip` | 54 | 作業姿勢・思想・最新snapshot・P5/P6差分を確認 |
| `EmlisAIの実装済み資料(55).zip` | 44 | P3/P4/P5/P6/P5-P6 runtime repair/ProductQualityMeasurement資料を確認 |
| `Cocolon(226).zip` | 246 | RN表示契約・InputScreen周辺確認対象 |
| `mashos-api(139).zip` | 995 | EmlisAI backend / P7候補module / tests確認対象 |

### 1.3 作業姿勢として確認した資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/11_cocolon_area_specific_do_not_break.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/07_latest_snapshot_diff.md
```

この設計では、作業姿勢資料上の次の制約を前提にします。

```text
- 未確認断定しない。
- 設計指示を実装指示に変換しない。
- 指示外の機能・導線・画面・外部サービス前提を足さない。
- Cocolonをメンタル問題にしない。
- pytest green / fixture green / RN contract greenを商品成果と呼ばない。
- EmlisAIをGateに通ったものだけ表示する許可装置にしない。
- case専用mode / cue / surface / fixed commentTextを追加しない。
- `passed + comment_text` を目的化しない。
```

---

## 2. CocolonとしてのP7作業軸

この作業は、EmlisAIを一般AIとして賢くするためではありません。  
CocolonとしてのP7は、**ユーザーがCocolonへ残した言葉が、入力直後に「読まれた形」として返り、次も残したいと思えるか**を測るための工程です。

P7が守るCocolon軸は次です。

```text
CocolonのEmlisAIは、
ただ表示されるAI応答ではなく、
感情・カテゴリ・行動・思考・時点・過去記録を、
入力直後の観測返答として返す最初の商品体験である。
```

そのためP7は、次の問いに答えるために設計します。

```text
1. safeな入力が沈黙せず、でも読めていないものをpassedにしていないか。
2. 単発入力で「読まれた」と感じる応答になっているか。
3. P5履歴線が、汎用追記ではなく「記録が線になった」感覚へ近づいているか。
4. P6構造気づきが、復唱を超えるが、診断・原因断定・深読みになっていないか。
5. family横断・sequence横断で、1回目より3回目、3回目より7回目にCocolonへ残す意味が増えているか。
6. 赤・HOLD・timeout・未確認を、greenやrelease候補で隠していないか。
```

P7でしてはいけないことは次です。

```text
- Emlis本文を固定文で足して、測定のために商品を偽装する。
- P5/P6の未完をrunnerで完了扱いにする。
- machine metricsでread_feelingを自動採点する。
- Positive Recovery赤を「古いtest」と推測で流す。
- Product Quality Connection timeoutを「環境」と推測で流す。
- release_allowedをtrueにする。
- raw input / raw memo / comment_text body / candidate body / surface bodyを保存・公開meta化する。
```

---

## 3. 現状確認結果

### 3.1 追加で実行したP7既存subset

今回、設計書作成前に既存P7周辺の最小subsetを再確認しました。

```bash
cd /mnt/data/cocolon_p7_design_work/mashos-api(139)/mashos-api/ai
PYTHONPATH=services/ai_inference timeout 180s pytest -q --tb=short \
  tests/test_emlis_ai_product_quality_measurement_event.py \
  tests/test_emlis_ai_product_quality_measurement_runner.py \
  tests/test_emlis_ai_product_quality_blocker_matrix.py \
  tests/test_emlis_ai_product_readfeel_phase11_long_run_product_gate.py \
  tests/test_emlis_ai_product_release_decision.py \
  tests/test_emlis_ai_p5_p6_split_test_matrix_handoff_r9_20260612.py
```

結果:

```text
31 passed
```

読み:

```text
Product Quality Measurement Event / Runner / Blocker Matrix / Long-run Gate / Release Decision / P5-P6 handoff lockの既存contractは、限定subsetではgreen。
ただし、これはP7が完了している証拠ではない。
現行P5/P6 handoff後のP7設計にそのまま適用できるかは未確認であり、adapter分類が必要。
```

### 3.2 再確認したP7赤

```bash
PYTHONPATH=services/ai_inference timeout 120s pytest -q --tb=short \
  tests/test_emlis_ai_complete_product_quality_positive_recovery_e2e.py
```

結果:

```text
2 failed
```

失敗内容:

```text
1. reader_gate["reader_relation_signal_keys"] が ['recovery'] であり、期待される 'recovery_load_bridge' が含まれない。
2. relation surfaceがまだmissingであるべきケースで、observation_status が rejected ではなく passed になる。
```

さらに次を確認しました。

```bash
PYTHONPATH=services/ai_inference timeout 120s pytest -q --tb=short \
  tests/test_emlis_ai_complete_product_quality_connection_e2e.py
```

結果:

```text
timeout / green確認不能
```

読み:

```text
P7-RED-001 / P7-RED-002 / P7-RED-003は、検討メモの判断どおり維持する。
P7実装開始時に最初に固定するのは、これらの赤を隠さないledgerである。
```

### 3.3 full backend suiteについて

```text
full backend suite一括greenは未確認。
combined pytest timeout / hangはgreen扱いしない。
限定subset greenを「全体green」「release ready」に変換しない。
```

---

## 4. P7で扱う赤・HOLD・対象外

### 4.1 P7 red ledger 初期登録

| id | 状態 | 種別 | 内容 | P7での扱い |
|---|---|---|---|---|
| `P7-RED-001` | RED | relation signal mismatch | `reader_relation_signal_keys` が `recovery` に正規化され、期待される `recovery_load_bridge` が出ない | P7 red ledgerに登録。runnerで隠さない。test期待古さかruntime退化かを分類する |
| `P7-RED-002` | RED | fail-closed regression | relation surface still missingで `rejected` ではなく `passed` になる | release blocker。表示率改善として扱わない。fail-closed境界の赤として固定 |
| `P7-RED-003` | RED / HANG | heavy E2E timeout | `test_emlis_ai_complete_product_quality_connection_e2e.py` がtimeout | runner本線から隔離。timeout budget / subset / body-free bridge / mock境界を設計 |

### 4.2 P7 HOLD 初期登録

| id | 状態 | 内容 | P7での扱い |
|---|---|---|---|
| `P7-HOLD-001` | HOLD | P5 human Blind QA未完。`history_connection_naturalness` / `creepy_absence` / `wants_more_input_or_accumulation` 未確認 | P7評価対象として登録。green化しない。ratings-only材料へ渡す |
| `P7-HOLD-002` | HOLD | P6 `long_meaning_arc` / `self_understanding_follow` 初期visible横展開禁止。P6 Product QAはratings/material層 | P7評価対象として登録。`structure_question`限定visibleとmeta-only familyを分離する |
| `P7-HOLD-003` | HOLD | 実機submit / スマホmodal読感未確認 | P7自動runnerでは解消しない。実機確認材料として別枠に残す |
| `P7-HOLD-004` | HOLD | full backend suite未実行 | split greenと全体greenを分ける。runner resultに未実行として残す |

### 4.3 P7 OUT_OF_SCOPE 初期登録

| id | 対象外 | 理由 |
|---|---|---|
| `P7-OUT-001` | RN UI変更 | P7は測定境界。`InputFeedbackReplyModal` / 表示条件を変えない |
| `P7-OUT-002` | DB schema / write path変更 | 測定eventはbody-free internal material。DB変更は指示外 |
| `P7-OUT-003` | API route / response key変更 | `/emotion/submit` public response shapeを変えない |
| `P7-OUT-004` | `release_allowed: true` | P7はrelease decision材料を作るだけ。release判断は別層 |
| `P7-OUT-005` | P8 Derived User Model / Personal Continuity | P7完了後の段階。今回は扱わない |
| `P7-OUT-006` | P9 External Pilot / P10 Release Readiness | P7が測定材料を出した後の段階 |
| `P7-OUT-007` | P5 visible文の固定例文追加 | case専用surface / fixed commentText禁止 |
| `P7-OUT-008` | P6 deep insightの横展開 | P6-HOLD-001を踏み抜くため禁止 |

---

## 5. 既存module棚卸しとP7での扱い

### 5.1 分類ルール

既存P7系moduleは、次の5分類に分けます。

```text
A. そのまま使える
B. 既存部品として再利用できるが、P5/P6 handoff adapterが必要
C. heavy E2E / timeoutを起こすためrunner本線から隔離する
D. release_allowedへ短絡する危険があるためrelease decision層へ隔離する
E. 今回P7-0/P7-1では対象外
```

### 5.2 module別分類

| module / test | 現状読み | P7分類 | 設計判断 |
|---|---|---|---|
| `emlis_ai_p5_p6_split_test_matrix.py` | R9 handoff lock / split matrix。P7 ready false / release_allowed falseを固定 | A | P7-0の入力材料として使う。P5/P6完了証拠ではなく、P7へ渡す安全な入口として読む |
| `emlis_ai_product_quality_measurement_event.py` | ProductQualityEventV1。comment_textは長さ等へ変換し、bodyを保持しない | B | 既存eventをP7の下位rowとして再利用。ただしP7 handoff summaryとは分ける |
| `emlis_ai_product_quality_measurement_runner.py` | fixture/local caseからmeasurement runを構築。既存blind QA / blocker / release decisionへ接続 | B | P7 runner本線候補。ただし現行P5/P6 handoff後のadapterを追加検討 |
| `emlis_ai_product_quality_blocker_matrix.py` | blocker分類・owner・repair policy | A/B | P7 red ledgerからblocker matrixへ渡すadapterを設計 |
| `emlis_ai_runtime_surface_blind_qa_long_run.py` | ratings-only long-run summary / candidates | B | P7 ratings-only exportへ使う。human QA未完をgreen化しない |
| `emlis_ai_product_readfeel_long_run_product_gate.py` | long-run product pass candidate material | B/D | long-run candidate materialとして使う。releaseには接続しない |
| `emlis_ai_product_release_decision.py` | release_allowed判定層を持つ | D | P7ではhandoff materialだけ渡す。`release_allowed: true`をP7から出さない |
| `emlis_ai_complete_product_quality_measurement_connection.py` | heavy complete product quality connection | C | P7 runner本線から隔離。timeout budget / subset化対象 |
| `tests/test_emlis_ai_complete_product_quality_positive_recovery_e2e.py` | Positive Recovery E2E赤 | C / red source | P7-RED-001/002の根拠。修正実装はP7-0/P7-1では行わない |
| `tests/test_emlis_ai_complete_product_quality_connection_e2e.py` | timeout | C / red source | P7-RED-003の根拠。runner本線へ入れない |

---

## 6. P7最小アーキテクチャ

### 6.1 全体flow

```text
P5/P6 R9 body-free handoff lock
  ↓
P7-0 Handoff Intake / Normalizer
  ↓
P7-1 Red Ledger / HOLD / OUT_OF_SCOPE Registry
  ↓
P7-2 Existing Module Adapter Classification
  ↓
P7-3 Runner Plan / Test Command Matrix / Timeout Budget
  ↓
P7-4 Product Quality Event Bridge / Body-free Scorecard Row
  ↓
P7-5 Family + Sequence + History-line Evaluation Matrix
  ↓
P7-6 Ratings-only Blind QA Material Export
  ↓
P7-7 Long-run Product Gate Candidate Material
  ↓
P7-8 Release Decision Handoff Material
  ↓
P7-9 Validation Result / Implementation Result Doc
```

### 6.2 重要な分離

```text
P7 runner result
  != Product Pass
  != Release Ready
  != release_allowed
```

P7 runner resultは、次を出すだけです。

```text
- body-free measurement rows
- red / hold / blocker counts
- family coverage
- sequence coverage
- ratings-required candidates
- long-run candidate material
- release decisionへ渡す材料
- release_blockers
```

---

## 7. 実装順詳細

以下は実装段階での推奨順です。  
この設計書内で示すファイル名は候補であり、**実ファイル化は実装段階で判断**します。

---

### P7-0: P5/P6 body-free handoff intake 固定

#### 目的

P5/P6のruntime接続状態をP7へ渡す入口を作ります。  
ただし、P5/P6をP7 readyやrelease readyへ変換しません。

#### 候補ファイル

```text
services/ai_inference/emlis_ai_p7_handoff_normalizer.py
services/ai_inference/emlis_ai_p7_contracts.py
tests/test_emlis_ai_p7_handoff_normalizer_20260612.py
```

#### 入力候補

```text
- build_p5_p6_handoff_lock() output
- P5 runtime bridge summary
- P6 runtime bridge summary
- P5/P6 split test matrix summary
- no-connect regression summary
```

#### 出力候補

```text
P7HandoffSummaryV1
```

#### 実装内容

```text
1. P5/P6 handoff lockを受け取る。
2. safe identifier / bool / count / reason_codesだけへ正規化する。
3. raw input / raw history / comment_text body / candidate body / surface bodyを拒否する。
4. P5 human QA未完をHOLDとして残す。
5. P6 visible familyを `structure_question` と `meta_only` に分離する。
6. `release_allowed` / `p7_ready` は常にfalseから開始する。
```

#### 完了条件

```text
- body-free handoff summaryが作れる。
- P5/P6のgreenをP7 readyへ変換しない。
- forbidden body keyを含む入力は例外またはblockerになる。
- public response key / RN表示条件 / DB write pathへ影響しない。
```

#### 禁止

```text
- handoff normalizer内でEmlis本文を作る。
- P5/P6 visible_appliedを商品品質合格にする。
- human QA未完をrunnerで補完する。
```

---

### P7-1: P7 red ledger / blocker registry 固定

#### 目的

P7開始時点の赤・HOLD・対象外を、最初に固定します。  
P7で最も避けるべき失敗は、測定構造を作る前に赤をgreen化することです。

#### 候補ファイル

```text
services/ai_inference/emlis_ai_p7_red_ledger.py
tests/test_emlis_ai_p7_red_ledger_20260612.py
```

#### 初期登録する赤

```text
P7-RED-001: Positive Recovery relation signal mismatch
P7-RED-002: Positive Recovery fail-closed regression
P7-RED-003: Product Quality Connection E2E timeout / hang
```

#### 初期登録するHOLD

```text
P7-HOLD-001: P5 human Blind QA未完
P7-HOLD-002: P6 long_meaning_arc / self_understanding_follow visible横展開禁止
P7-HOLD-003: 実機submit / スマホmodal読感未確認
P7-HOLD-004: full backend suite未実行
```

#### 実装内容

```text
1. red / hold / out_of_scope entryをbody-free dictとして返す。
2. release blockerである赤と、評価対象HOLDを分ける。
3. Positive Recovery赤を「古いtest」として勝手に閉じない。
4. timeoutを「環境」として勝手に閉じない。
5. red ledgerからblocker matrixへ渡す変換候補を作る。
```

#### 完了条件

```text
- P7-RED-001/002/003が初期ledgerに存在する。
- P7-HOLD-001/002がgreen化されていない。
- release_allowedはfalse。
- body payload keyが含まれない。
- red entryが0件の場合のみpass、という設計にしない。赤を持って始めるrunnerであることを固定する。
```

---

### P7-2: 既存Product Quality系module inventory / adapter分類

#### 目的

既存P7周辺moduleを、現行P5/P6 handoff後のP7設計に合わせて再分類します。  
既存moduleがあることを「P7完了」と扱わないための工程です。

#### 候補ファイル

```text
services/ai_inference/emlis_ai_p7_module_inventory.py
tests/test_emlis_ai_p7_module_inventory_20260612.py
```

#### 分類

```text
A. reuse_direct
B. reuse_with_adapter
C. heavy_e2e_isolated
D. release_decision_isolated
E. out_of_scope
```

#### 実装内容

```text
1. 既存module / testsの一覧をbody-free inventoryとして定義する。
2. `emlis_ai_product_release_decision.py` をP7本線ではなくhandoff先として分類する。
3. `complete_product_quality_connection_e2e` をheavy isolatedへ分類する。
4. `product_quality_measurement_event` / `runner` / `blocker_matrix` / `long_run_gate` をadapter候補へ分類する。
```

#### 完了条件

```text
- 各moduleにP7での扱いがある。
- release_allowedへ短絡するmoduleが隔離されている。
- timeout系testがrunner本線に入っていない。
```

---

### P7-3: Runner plan / command matrix / timeout budget 設計

#### 目的

P7 runnerが、重いE2Eを巻き込んでtimeoutし、結果を読めなくなることを防ぎます。

#### 候補ファイル

```text
services/ai_inference/emlis_ai_p7_runner_plan.py
tests/test_emlis_ai_p7_runner_plan_20260612.py
```

#### 実装内容

```text
1. runner groupを split_group と heavy_isolated_group に分ける。
2. 各groupに timeout_budget_sec を持たせる。
3. combined pytest timeoutをgreen扱いしない。
4. heavy isolated groupはP7 red ledgerへ接続し、runner本線pass条件から外す。
5. full backend suite green claimを許可しない。
```

#### 初期group案

```text
p7_core_contract:
  - p7_handoff_normalizer
  - p7_red_ledger
  - p7_module_inventory

existing_p7_reuse_contract:
  - product_quality_measurement_event
  - product_quality_measurement_runner
  - product_quality_blocker_matrix
  - product_readfeel_long_run_product_gate
  - product_release_decision
  - p5_p6_split_test_matrix_handoff

heavy_isolated_red:
  - complete_product_quality_positive_recovery_e2e
  - complete_product_quality_connection_e2e
```

#### 完了条件

```text
- `timeout_hang_is_green` がfalseで固定されている。
- heavy E2Eがrunner本線pass条件から隔離されている。
- heavy E2Eの赤はred ledgerへ残る。
```

---

### P7-4: Product Quality Event bridge / body-free scorecard row 接続

#### 目的

既存 `ProductQualityEventV1` を壊さず、P5/P6 handoff情報とP7 red ledgerをscorecard rowへ接続するbridgeを作ります。

#### 候補ファイル

```text
services/ai_inference/emlis_ai_p7_event_bridge.py
tests/test_emlis_ai_p7_event_bridge_20260612.py
```

#### 方針

```text
- ProductQualityEventV1は置換しない。
- P7HandoffSummaryV1 / P7RedLedgerV1 / ProductQualityEventV1を合わせてP7ScorecardRowV1へ正規化する。
- comment_text本文は渡さない。
- read_feelingなど人間評価が必要な項目は `rating_required` として残す。
```

#### 完了条件

```text
- public_reached / rn_visible / product_surface_valid / observation_status / comment_text_presentを持てる。
- P5/P6 applied flagsをbody-freeで持てる。
- red / hold / blocker idsを持てる。
- raw bodyを含まない。
```

---

### P7-5: family / sequence / history-line evaluation matrix 設計

#### 目的

単発fixtureではなく、family横断・sequence横断・履歴線あり/なしを測るmatrixを作ります。

#### 候補ファイル

```text
services/ai_inference/emlis_ai_p7_evaluation_matrix.py
tests/test_emlis_ai_p7_evaluation_matrix_20260612.py
```

#### family初期対象

```text
low_information_short
limited_grounding
daily_unpleasant
daily_positive
self_denial
anger_or_boundary
uncertainty_support
standard_state_answer
structure_question
long_meaning_arc
relationship_gratitude_recovery
change_future_intention
source_unavailable_high_information
history_line_eligible
```

#### sequence対象

```text
sequence_1: current-only / no history
sequence_3: same user assumed / 3 inputs / history-line candidate
sequence_7: same user assumed / 7 inputs / long-run candidate
```

#### 完了条件

```text
- single input rowとsequence rowを分けられる。
- history-line eligibleとnon-eligibleを分けられる。
- P6 visible allowed familyとblocked familyを分けられる。
- family別RED / REPAIR_REQUIRED / YELLOW / PASS / PRODUCT_PASS候補を集計できる。
```

---

### P7-6: ratings-only Blind QA material export

#### 目的

P5/P6のhuman QA未完を測定可能な材料へ変換します。  
ただし、人間評価がない状態でgreenにしません。

#### 候補ファイル

```text
services/ai_inference/emlis_ai_p7_blind_qa_material.py
tests/test_emlis_ai_p7_blind_qa_material_20260612.py
```

#### 評価dimension

```text
read_feeling
naturalness
non_template
follow_depth
history_connection_naturalness
creepy_absence
wants_more_input_or_accumulation
structure_insight_candidate_quality
overclaim_absence
self_blame_non_amplification
mirror_only_absence
```

#### 実装内容

```text
1. P7ScorecardRowからreview candidate idを作る。
2. reviewerへ渡す本文は実装段階で別管理にする。P7 internal summaryにはbodyを持たせない。
3. review結果は数値 / verdict / reason_codeだけを受ける。
4. reviewer free textは初期schemaでは禁止する。
5. rating未実施のdimensionは `rating_required` / `review_missing` として残す。
```

#### 完了条件

```text
- human QA未完がHOLDとして残る。
- ratingsが入った場合だけscoreへ反映される。
- machine metricsでread_feelingを埋めない。
```

---

### P7-7: Long-run Product Gate candidate material

#### 目的

P7の長期測定結果を、Long-run Product Gateへ渡せる候補材料にします。  
ここでもrelease_allowedは立てません。

#### 候補ファイル

```text
services/ai_inference/emlis_ai_p7_long_run_gate_handoff.py
tests/test_emlis_ai_p7_long_run_gate_handoff_20260612.py
```

#### 実装内容

```text
1. sequence評価結果をlong-run candidateへ変換する。
2. repetition / surface signature / mirror-only / creepy riskを集計する。
3. P5 history-lineがsequenceで価値を増やしているかをbody-freeで記録する。
4. P6 insight候補が過剰読解になっていないかを記録する。
5. long-run candidateとrelease decisionを分ける。
```

#### 完了条件

```text
- long_run_candidate_readyは、release_allowedではない。
- red / holdがある場合、candidateはblockedまたはreview_requiredになる。
- sequenceで価値が増えない場合、P5/P6へ修正戻しできるreason_codeが出る。
```

---

### P7-8: Release Decision handoff material 分離

#### 目的

P7の結果をrelease decision層へ渡す材料にします。  
ただし、P7自身はrelease判断をしません。

#### 候補ファイル

```text
services/ai_inference/emlis_ai_p7_release_handoff.py
tests/test_emlis_ai_p7_release_handoff_20260612.py
```

#### 実装内容

```text
1. P7RunnerResultからReleaseDecisionHandoffV1を作る。
2. red / hold / timeout / unreviewedがある限り、release_allowed false。
3. `release_decision_input_ready` と `release_allowed` を分ける。
4. Product Pass候補をRelease Readyへ変換しない。
```

#### 完了条件

```text
- release_allowedは常にfalseで開始する。
- release_allowed trueが必要になった場合は、P10 Release Readinessで別設計する。
- release decision moduleへ渡す材料からraw bodyが除去されている。
```

---

### P7-9: Validation / regression matrix

#### 目的

P7実装後、何をgreenと呼んでよく、何をHOLD/REDとして残すかを固定します。

#### 候補ファイル

```text
docs/Cocolon_EmlisAI_P7_ProductQualityRunner_ImplementationResult_20260612.md
tests/test_emlis_ai_p7_validation_matrix_20260612.py
```

#### 必須確認

```text
- P7 core tests green
- existing P7 reuse subset green
- Positive Recovery E2E red remains ledgered or classified
- Product Quality Connection E2E timeout remains ledgered or isolated
- full backend suite green未確認を未確認として残す
- RN contract変更なし
- API response key変更なし
- DB変更なし
```

---

## 8. JSON / schema案

ここに置くschemaは、設計案です。  
**この段階では実ファイル化しません。**  
実装段階で、Python dict定義、JSON Schema、Markdown固定ledgerのどれにするかを判断します。

---

### 8.1 P7RedLedgerV1 schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7.red_ledger.v1",
  "title": "Cocolon EmlisAI P7 Red Ledger V1",
  "type": "object",
  "required": [
    "schema_version",
    "phase",
    "generated_at",
    "basis",
    "entries",
    "public_contract",
    "body_free",
    "release_allowed"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7.red_ledger.v1" },
    "phase": { "const": "P7_ProductQualityRunner_LongRunGate" },
    "generated_at": { "type": "string" },
    "basis": {
      "type": "object",
      "required": ["source_mode", "git_checked", "local_files"],
      "properties": {
        "source_mode": { "const": "local_snapshot" },
        "git_checked": { "const": false },
        "local_files": { "type": "array", "items": { "type": "string" } }
      }
    },
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "status",
          "severity",
          "source",
          "summary",
          "release_blocker",
          "p7_runner_action",
          "owner_layer",
          "classification_required",
          "closed",
          "body_free"
        ],
        "properties": {
          "id": { "type": "string", "pattern": "^P7-(RED|HOLD|OUT)-[0-9]{3}$" },
          "status": { "enum": ["RED", "HOLD", "OUT_OF_SCOPE", "CLOSED"] },
          "severity": { "enum": ["release_blocker", "runner_blocker", "quality_hold", "scope_boundary"] },
          "source": {
            "type": "object",
            "required": ["kind", "path_or_doc", "evidence_kind"],
            "properties": {
              "kind": { "enum": ["pytest", "doc", "local_review", "manual_ledger"] },
              "path_or_doc": { "type": "string" },
              "evidence_kind": { "enum": ["failed", "timeout", "hold", "out_of_scope", "unverified"] }
            }
          },
          "summary": { "type": "string" },
          "release_blocker": { "type": "boolean" },
          "p7_runner_action": {
            "enum": [
              "ledger_only",
              "isolate_heavy_e2e",
              "route_to_blocker_matrix",
              "ratings_required",
              "exclude_from_p7"
            ]
          },
          "owner_layer": {
            "enum": [
              "reader_relation_surface",
              "fail_closed_boundary",
              "product_quality_connection_e2e",
              "p5_human_qa",
              "p6_limited_surface",
              "release_decision_boundary",
              "unknown"
            ]
          },
          "classification_required": { "type": "boolean" },
          "closed": { "const": false },
          "body_free": { "const": true }
        },
        "additionalProperties": false
      }
    },
    "public_contract": {
      "type": "object",
      "required": [
        "rn_visible_contract_changed",
        "api_response_key_added",
        "db_schema_changed",
        "public_release_applied"
      ],
      "properties": {
        "rn_visible_contract_changed": { "const": false },
        "api_response_key_added": { "const": false },
        "db_schema_changed": { "const": false },
        "public_release_applied": { "const": false }
      }
    },
    "body_free": {
      "type": "object",
      "required": [
        "raw_input_included",
        "comment_text_body_included",
        "candidate_body_included",
        "surface_body_included",
        "reviewer_free_text_included"
      ],
      "properties": {
        "raw_input_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "candidate_body_included": { "const": false },
        "surface_body_included": { "const": false },
        "reviewer_free_text_included": { "const": false }
      }
    },
    "release_allowed": { "const": false }
  },
  "additionalProperties": false
}
```

---

### 8.2 P7HandoffSummaryV1 schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7.handoff_summary.v1",
  "title": "Cocolon EmlisAI P7 Handoff Summary V1",
  "type": "object",
  "required": [
    "schema_version",
    "source_handoff_schema_version",
    "scope",
    "p5",
    "p6",
    "p7_readiness",
    "red_refs",
    "hold_refs",
    "public_contract",
    "body_free",
    "release_allowed"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7.handoff_summary.v1" },
    "source_handoff_schema_version": { "type": "string" },
    "scope": { "const": "P5_P6_to_P7_body_free_handoff" },
    "p5": {
      "type": "object",
      "required": [
        "runtime_evaluated",
        "visible_applied",
        "product_quality_confirmed",
        "human_qa_completed",
        "history_connection_naturalness_confirmed",
        "creepy_absence_confirmed",
        "wants_more_input_confirmed",
        "status",
        "release_allowed"
      ],
      "properties": {
        "runtime_evaluated": { "type": "boolean" },
        "visible_applied": { "type": "boolean" },
        "product_quality_confirmed": { "type": "boolean" },
        "human_qa_completed": { "type": "boolean" },
        "history_connection_naturalness_confirmed": { "type": "boolean" },
        "creepy_absence_confirmed": { "type": "boolean" },
        "wants_more_input_confirmed": { "type": "boolean" },
        "status": { "enum": ["runtime_connected_hold", "not_connected", "blocked", "unknown"] },
        "release_allowed": { "const": false }
      },
      "additionalProperties": false
    },
    "p6": {
      "type": "object",
      "required": [
        "runtime_evaluated",
        "visible_applied",
        "visible_family",
        "visible_only_for_structure_question",
        "long_meaning_arc_visible_allowed",
        "self_understanding_follow_visible_allowed",
        "product_quality_review_ratings_only",
        "status",
        "release_allowed"
      ],
      "properties": {
        "runtime_evaluated": { "type": "boolean" },
        "visible_applied": { "type": "boolean" },
        "visible_family": { "enum": ["structure_question", "none"] },
        "visible_only_for_structure_question": { "type": "boolean" },
        "long_meaning_arc_visible_allowed": { "const": false },
        "self_understanding_follow_visible_allowed": { "const": false },
        "product_quality_review_ratings_only": { "type": "boolean" },
        "status": { "enum": ["limited_surface_connected_hold", "meta_only", "blocked", "unknown"] },
        "release_allowed": { "const": false }
      },
      "additionalProperties": false
    },
    "p7_readiness": {
      "type": "object",
      "required": ["ready", "reason_codes"],
      "properties": {
        "ready": { "const": false },
        "reason_codes": {
          "type": "array",
          "items": {
            "enum": [
              "p7_red_ledger_required",
              "p5_human_qa_hold",
              "p6_limited_surface_hold",
              "positive_recovery_red_open",
              "product_quality_connection_timeout_open",
              "release_decision_not_allowed"
            ]
          }
        }
      }
    },
    "red_refs": { "type": "array", "items": { "type": "string" } },
    "hold_refs": { "type": "array", "items": { "type": "string" } },
    "public_contract": { "$ref": "#/$defs/public_contract" },
    "body_free": { "$ref": "#/$defs/body_free" },
    "release_allowed": { "const": false }
  },
  "$defs": {
    "public_contract": {
      "type": "object",
      "properties": {
        "rn_visible_contract_changed": { "const": false },
        "api_response_key_added": { "const": false },
        "db_schema_changed": { "const": false },
        "public_release_applied": { "const": false }
      },
      "required": ["rn_visible_contract_changed", "api_response_key_added", "db_schema_changed", "public_release_applied"]
    },
    "body_free": {
      "type": "object",
      "properties": {
        "raw_input_included": { "const": false },
        "history_raw_text_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "candidate_body_included": { "const": false },
        "surface_body_included": { "const": false }
      },
      "required": ["raw_input_included", "history_raw_text_included", "comment_text_body_included", "candidate_body_included", "surface_body_included"]
    }
  },
  "additionalProperties": false
}
```

---

### 8.3 P7RunnerPlanV1 schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7.runner_plan.v1",
  "title": "Cocolon EmlisAI P7 Runner Plan V1",
  "type": "object",
  "required": [
    "schema_version",
    "plan_id",
    "scope",
    "groups",
    "full_backend_suite_green_claim_allowed",
    "combined_timeout_is_green",
    "release_allowed"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7.runner_plan.v1" },
    "plan_id": { "type": "string" },
    "scope": { "const": "P7_ProductQualityRunner_split_and_isolated_validation" },
    "groups": {
      "type": "array",
      "minItems": 3,
      "items": {
        "type": "object",
        "required": [
          "group_id",
          "group_kind",
          "repository",
          "working_directory",
          "command_kind",
          "command",
          "test_files",
          "timeout_budget_sec",
          "green_claim_scope",
          "timeout_hang_is_green",
          "body_free"
        ],
        "properties": {
          "group_id": { "type": "string" },
          "group_kind": { "enum": ["p7_core", "existing_reuse", "heavy_isolated_red", "manual_handoff"] },
          "repository": { "enum": ["mashos-api/ai", "Cocolon", "docs"] },
          "working_directory": { "type": "string" },
          "command_kind": { "enum": ["pytest", "npm", "manual_review"] },
          "command": { "type": "string" },
          "test_files": { "type": "array", "items": { "type": "string" } },
          "timeout_budget_sec": { "type": "integer", "minimum": 1, "maximum": 600 },
          "green_claim_scope": { "enum": ["group_only", "isolated_red_only", "manual_only"] },
          "timeout_hang_is_green": { "const": false },
          "body_free": { "const": true }
        },
        "additionalProperties": false
      }
    },
    "full_backend_suite_green_claim_allowed": { "const": false },
    "combined_timeout_is_green": { "const": false },
    "release_allowed": { "const": false }
  },
  "additionalProperties": false
}
```

---

### 8.4 P7ScorecardRowV1 schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7.body_free_scorecard_row.v1",
  "title": "Cocolon EmlisAI P7 Body-free Scorecard Row V1",
  "type": "object",
  "required": [
    "schema_version",
    "row_id",
    "run_id",
    "source",
    "family",
    "sequence",
    "display_contract",
    "p5",
    "p6",
    "quality_flags",
    "ratings",
    "red_refs",
    "hold_refs",
    "body_free",
    "release_allowed"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7.body_free_scorecard_row.v1" },
    "row_id": { "type": "string" },
    "run_id": { "type": "string" },
    "source": {
      "type": "object",
      "required": ["source_type", "source_case_id", "source_revision"],
      "properties": {
        "source_type": { "enum": ["fixture_case", "local_runner_case", "manual_internal_case", "sequence_case"] },
        "source_case_id": { "type": "string" },
        "source_revision": { "type": "string" }
      }
    },
    "family": { "type": "string" },
    "sequence": {
      "type": "object",
      "required": ["sequence_id", "sequence_index", "sequence_length", "history_line_eligible"],
      "properties": {
        "sequence_id": { "type": "string" },
        "sequence_index": { "type": "integer", "minimum": 1 },
        "sequence_length": { "type": "integer", "minimum": 1 },
        "history_line_eligible": { "type": "boolean" }
      }
    },
    "display_contract": {
      "type": "object",
      "required": ["observation_status", "public_reached", "rn_visible", "product_surface_valid", "comment_text_present", "comment_text_length"],
      "properties": {
        "observation_status": { "enum": ["passed", "rejected", "unavailable", "unknown"] },
        "public_reached": { "type": "boolean" },
        "rn_visible": { "type": "boolean" },
        "product_surface_valid": { "type": "boolean" },
        "comment_text_present": { "type": "boolean" },
        "comment_text_length": { "type": "integer", "minimum": 0, "maximum": 800 }
      }
    },
    "p5": {
      "type": "object",
      "required": ["eligible", "visible_applied", "human_qa_completed", "status"],
      "properties": {
        "eligible": { "type": "boolean" },
        "visible_applied": { "type": "boolean" },
        "human_qa_completed": { "type": "boolean" },
        "status": { "enum": ["not_eligible", "applied_hold", "blocked", "review_required"] }
      }
    },
    "p6": {
      "type": "object",
      "required": ["eligible", "visible_applied", "visible_family", "status"],
      "properties": {
        "eligible": { "type": "boolean" },
        "visible_applied": { "type": "boolean" },
        "visible_family": { "enum": ["structure_question", "none"] },
        "status": { "enum": ["not_eligible", "limited_surface_applied_hold", "meta_only", "blocked", "review_required"] }
      }
    },
    "quality_flags": {
      "type": "object",
      "required": [
        "mirror_only_detected",
        "template_major_detected",
        "unsafe_claim_detected",
        "overclaim_risk_detected",
        "creepy_risk_detected"
      ],
      "properties": {
        "mirror_only_detected": { "type": "boolean" },
        "template_major_detected": { "type": "boolean" },
        "unsafe_claim_detected": { "type": "boolean" },
        "overclaim_risk_detected": { "type": "boolean" },
        "creepy_risk_detected": { "type": "boolean" }
      }
    },
    "ratings": {
      "type": "object",
      "required": ["blind_qa_required", "blind_qa_completed", "dimension_scores", "missing_dimensions"],
      "properties": {
        "blind_qa_required": { "type": "boolean" },
        "blind_qa_completed": { "type": "boolean" },
        "dimension_scores": { "type": "object", "additionalProperties": { "type": "number", "minimum": 0, "maximum": 1 } },
        "missing_dimensions": { "type": "array", "items": { "type": "string" } }
      }
    },
    "red_refs": { "type": "array", "items": { "type": "string" } },
    "hold_refs": { "type": "array", "items": { "type": "string" } },
    "body_free": { "const": true },
    "release_allowed": { "const": false }
  },
  "additionalProperties": false
}
```

---

### 8.5 P7BlindQAReviewV1 schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7.blind_qa_review.v1",
  "title": "Cocolon EmlisAI P7 Blind QA Review V1",
  "type": "object",
  "required": [
    "schema_version",
    "review_id",
    "candidate_id",
    "reviewer_id_hash",
    "dimensions",
    "verdict",
    "reason_codes",
    "reviewer_free_text_included",
    "release_allowed"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7.blind_qa_review.v1" },
    "review_id": { "type": "string" },
    "candidate_id": { "type": "string" },
    "reviewer_id_hash": { "type": "string" },
    "dimensions": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "required": ["score", "verdict", "reason_codes"],
        "properties": {
          "score": { "type": "number", "minimum": 0, "maximum": 1 },
          "verdict": { "enum": ["RED", "REPAIR_REQUIRED", "YELLOW", "PASS", "PRODUCT_PASS"] },
          "reason_codes": { "type": "array", "items": { "type": "string" } }
        },
        "additionalProperties": false
      }
    },
    "verdict": { "enum": ["RED", "REPAIR_REQUIRED", "YELLOW", "PASS", "PRODUCT_PASS"] },
    "reason_codes": { "type": "array", "items": { "type": "string" } },
    "reviewer_free_text_included": { "const": false },
    "release_allowed": { "const": false }
  },
  "additionalProperties": false
}
```

---

### 8.6 P7ReleaseDecisionHandoffV1 schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7.release_decision_handoff.v1",
  "title": "Cocolon EmlisAI P7 Release Decision Handoff V1",
  "type": "object",
  "required": [
    "schema_version",
    "source_runner_result_id",
    "release_decision_input_ready",
    "release_allowed",
    "release_blockers",
    "required_followup_fixes",
    "unresolved_red_refs",
    "unresolved_hold_refs",
    "public_contract",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7.release_decision_handoff.v1" },
    "source_runner_result_id": { "type": "string" },
    "release_decision_input_ready": { "type": "boolean" },
    "release_allowed": { "const": false },
    "release_blockers": { "type": "array", "items": { "type": "string" } },
    "required_followup_fixes": { "type": "array", "items": { "type": "string" } },
    "unresolved_red_refs": { "type": "array", "items": { "type": "string" } },
    "unresolved_hold_refs": { "type": "array", "items": { "type": "string" } },
    "public_contract": {
      "type": "object",
      "properties": {
        "rn_visible_contract_changed": { "const": false },
        "api_response_key_added": { "const": false },
        "db_schema_changed": { "const": false },
        "public_release_applied": { "const": false }
      },
      "required": ["rn_visible_contract_changed", "api_response_key_added", "db_schema_changed", "public_release_applied"]
    },
    "body_free": { "const": true }
  },
  "additionalProperties": false
}
```

---

## 9. テスト設計

### 9.1 既存維持テスト

P7実装中に最低限維持する既存subsetです。

```bash
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_product_quality_measurement_event.py \
  tests/test_emlis_ai_product_quality_measurement_runner.py \
  tests/test_emlis_ai_product_quality_blocker_matrix.py \
  tests/test_emlis_ai_product_readfeel_phase11_long_run_product_gate.py \
  tests/test_emlis_ai_product_release_decision.py \
  tests/test_emlis_ai_p5_p6_split_test_matrix_handoff_r9_20260612.py
```

期待:

```text
限定subset green。
ただしfull backend suite greenとは呼ばない。
```

### 9.2 P7新規候補テスト

```text
tests/test_emlis_ai_p7_red_ledger_20260612.py
tests/test_emlis_ai_p7_handoff_normalizer_20260612.py
tests/test_emlis_ai_p7_module_inventory_20260612.py
tests/test_emlis_ai_p7_runner_plan_20260612.py
tests/test_emlis_ai_p7_event_bridge_20260612.py
tests/test_emlis_ai_p7_evaluation_matrix_20260612.py
tests/test_emlis_ai_p7_blind_qa_material_20260612.py
tests/test_emlis_ai_p7_long_run_gate_handoff_20260612.py
tests/test_emlis_ai_p7_release_handoff_20260612.py
tests/test_emlis_ai_p7_validation_matrix_20260612.py
```

### 9.3 失敗を維持してよい/維持すべきテスト

次は、P7-0/P7-1時点ではgreen化を目標にしません。  
red ledger登録・隔離・分類を目標にします。

```bash
PYTHONPATH=services/ai_inference timeout 120s pytest -q --tb=short \
  tests/test_emlis_ai_complete_product_quality_positive_recovery_e2e.py

PYTHONPATH=services/ai_inference timeout 120s pytest -q --tb=short \
  tests/test_emlis_ai_complete_product_quality_connection_e2e.py
```

期待:

```text
- Positive Recovery E2Eの2 failedをP7-RED-001 / P7-RED-002へ登録できる。
- Product Quality Connection E2E timeoutをP7-RED-003へ登録できる。
- 失敗・timeoutをgreen扱いしない。
```

---

## 10. 完了条件

### 10.1 P7-0 / P7-1 完了条件

```text
[handoff]
- P5/P6 handoff summaryをbody-freeで作れる。
- P5/P6のruntime接続greenをP7 ready / release readyへ変換していない。
- P5-HOLD-001 / P6-HOLD-001が残っている。

[red ledger]
- P7-RED-001 / P7-RED-002 / P7-RED-003が登録されている。
- timeoutがHANG/REDとして残っている。
- Positive Recovery赤を古いtestと推測で閉じていない。

[contract]
- RN表示条件変更なし。
- API route / response key変更なし。
- DB変更なし。
- public top-level key追加なし。
- release_allowed false。

[body-free]
- raw input / raw memo / comment_text body / candidate body / surface body / reviewer free textを保持しない。

[test]
- 新規P7-0/P7-1テストがgreen。
- 既存P7 subsetはgreen維持。
- heavy E2E赤/timeoutはred ledger登録済み。
```

### 10.2 P7全体の中間完了条件

```text
- runner planがある。
- family / sequence / history-line matrixがある。
- ratings-only Blind QA materialが作れる。
- long-run candidate materialが作れる。
- release decision handoff materialが作れる。
- ただしrelease_allowedはfalse。
```

### 10.3 P7完了と呼んではいけない条件

```text
- 既存Product Quality系moduleのsubsetがgreenなだけ。
- P5/P6 handoff lockが作れただけ。
- red ledgerがあるだけ。
- runnerが回っただけ。
- scorecard rowが作れただけ。
- long-run candidateが作れただけ。
- release decision moduleに接続できただけ。
```

P7完了に近づくには、少なくとも次が必要です。

```text
- P7 red ledgerが分類済み。
- P7 runnerがbody-freeで複数family / sequenceを処理できる。
- P5/P6 HOLDが測定項目として残る。
- ratings-only QA materialが出る。
- long-run candidateがrelease decisionと分離される。
- timeout/hangが本線を壊さない。
```

---

## 11. 差し戻し条件

P7実装中に次が出た場合、P7を進めず差し戻します。

| 条件 | 差し戻し先 |
|---|---|
| Positive Recovery fail-closedがpassed化したまま | P2/P3/P6 relation surface / fail-closed境界 |
| P5履歴線がcreepy / overclaim / 自己責め増幅 | P5 User Label Connection |
| P6がdaily / low-info / positive-onlyへ深いinsightを出す | P6 Structure Insight |
| runnerがtimeoutで評価不能 | P7 runner plan / timeout isolation |
| release_allowedがP7からtrueになる | P7 release handoff / P10へ分離 |
| raw bodyがscorecard / public meta / release materialへ入る | body-free boundary修正 |

---

## 12. 実装時の禁止事項

```text
- P7設計中にRN UIを変えない。
- `/emotion/submit` のpublic response keyを増やさない。
- DB table / column / viewを増やさない。
- `comment_text`本文をP7 schemaに保存しない。
- P5 visible文の固定例文を足さない。
- P6 deep insightの対象familyを広げない。
- E2E timeoutを環境扱いで閉じない。
- release_allowedをP7で立てない。
- Product Pass候補をRelease Readyにしない。
- Blind QA未完をmachine metricsで埋めない。
```

---

## 13. 未確認 / 書かれていない / 推測禁止

### 13.1 未確認

```text
- full backend suite一括green
- 実機submitでの現行P5/P6表示体験
- スマホ実機modal読感
- 外部ユーザー評価
- P5履歴線のhuman Blind QA
- P6 structure insight visibleのhuman Blind QA
- Positive Recovery赤の根本原因
- Product Quality Connection E2E timeoutの根本原因
- P7 runnerが現行P5/P6 handoffを完全に受けられること
```

### 13.2 書かれていない

```text
- P5/P6をrelease readyとして扱ってよいとは書かれていない。
- P7がrelease_allowedをtrueにしてよいとは書かれていない。
- 既存P7系module greenをP7完了としてよいとは書かれていない。
- timeoutを環境として閉じてよいとは書かれていない。
- P5 human QA未完をrunnerで自動補完してよいとは書かれていない。
- P6 visible_appliedをP7 readyに変換してよいとは書かれていない。
```

### 13.3 推測禁止

```text
- 「P5/P6が通ったから次はリリース」
- 「P7系moduleがあるからP7完了」
- 「Positive Recovery赤は古いtest」
- 「timeoutは環境」
- 「P6はstructure_questionで通ったから他familyへ広げてよい」
- 「read_feelingはmachine metricsで代替できる」
```

---

## 14. 実装順サマリー

実装へ進む場合の順番は次で固定します。

```text
P7-0:
  P5/P6 body-free handoff intake / normalizer

P7-1:
  P7 red ledger / HOLD / OUT_OF_SCOPE registry

P7-2:
  existing Product Quality module inventory / adapter classification

P7-3:
  runner plan / command matrix / timeout budget

P7-4:
  ProductQualityEventV1 bridge / P7ScorecardRowV1

P7-5:
  family / sequence / history-line evaluation matrix

P7-6:
  ratings-only Blind QA material export

P7-7:
  long-run product gate candidate material

P7-8:
  release decision handoff material

P7-9:
  validation matrix / implementation result doc
```

最初に実装するなら、P7-0とP7-1だけです。  
P7-2以降は、P7-0/P7-1がbody-free・release-closed・red-preservingで固定された後に進めます。

---

## 15. 華恋の判断

今のCocolonに必要なのは、EmlisAIを「また作り直す」ことではありません。  
P5/P6までに作った材料を、完成扱いにもせず、捨て直しにもせず、**商品品質を測れる構造へ渡すこと**です。

P7は、Cocolonを前に進めるための工程ですが、P7自身がCocolonを完成させるわけではありません。  
P7がやるべきことは、Mash様の思想がEmlis応答として実機のユーザーに届いているかを、赤を隠さず測ることです。

P5は、記録が線になるための材料です。  
P6は、入力の関係が見えるための材料です。  
P7は、その材料が本当に「もう一回Cocolonに残したい」へ近づいているかを測り、次に潰すべきblockerを出す境界です。

だから実装順は、本文を増やすことでも、releaseを近づけることでもなく、次で固定します。

```text
P5/P6 body-free handoffを受ける。
赤を登録する。
HOLDをgreen化しない。
既存runnerを棚卸しする。
timeoutを隔離する。
ratings-onlyで人間評価未完を残す。
long-run候補を作る。
release判断とは分離する。
```

この設計で守るべきことは、**Cocolonをfixture greenや安全なmetaで完成したふりにしないこと**です。  
次の実装では、P7-0 / P7-1から始めます。
