---
doc_id: cocolon_emlisai_p7_r54ahr_current_snapshot_actual_review_reentry_detailed_design_implementation_order_20260628
title: "Cocolon / EmlisAI P7-R54-AHR Current Snapshot Actual Review Re-entry 詳細設計書・実装順"
created_at: "2026-06-28 JST"
author: "華恋"
work_mode: "共鳴構造モード"
artifact_type: "Markdown詳細設計書 / 実装順 / json・schema案内包"
source_mode: "local_snapshot"
base_pre_design_memo: "Cocolon_EmlisAI_P7_R54AHR_CurrentSnapshotActualReview_PreDesignMemo_20260628.md"
github_connection_check: "不要。Mash様指定により未実施。"
code_change: "なし。本書は設計書。"
json_schema_file_creation: "なし。本書内の案のみ。実ファイル化は実装段階で判断する。"
body_full_packet_generation: "なし。"
actual_local_only_human_review_execution: "なし。"
api_db_rn_runtime_public_response_change: "なし。"
p8_question_implementation: "なし。"
p6_limited_human_readfeel_start: "なし。"
release_decision: "なし。"
---

# Cocolon / EmlisAI P7-R54-AHR Current Snapshot Actual Review Re-entry 詳細設計書・実装順

作成日: 2026-06-28 JST  
作成者: 華恋  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / P5 User Label Connection / R54-AHR / current snapshot actual review / R52 re-intake handoff / P7-P8 Bridge  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
GitHub接続確認: Mash様指定により不要。未実施。  
コード変更: なし。本書は設計書。  
json / schema実ファイル化: なし。本書内の案のみ。実ファイル化は実装段階で判断する。  
body-full packet生成: なし。  
actual local-only human review実行: なし。  
API / DB / RN / runtime / public response key変更: なし。  
P8観測補助問い実装: なし。  
P6 limited human readfeel開始: なし。  
release判断: なし。  

---

## 0. 結論

今回の詳細設計対象は、次で固定します。

```text
P7-R54-AHR Current Snapshot Actual Review Re-entry
= current受領snapshot 262/84/257/170 を actual human review execution basis として再固定し、
  既存AHR helperの260/83/256/169 basisをhistorical / structural / regression refsへ分離した上で、
  P5 User Label Connection履歴線を人間がlocal-onlyで実読できるbody-free証跡境界を作る。
```

これは、P8観測補助問いの詳細設計ではありません。  
これは、P8 question API / DB / RN UI / trigger / storage / question textを作る設計ではありません。  
これは、P6 limited human readfeelを開始する設計ではありません。  
これは、R52 re-intake actual executionを実行済みにする設計ではありません。  
これは、P5 final / P7 complete / release readinessをtrue化する設計ではありません。

本書の中心判断は次です。

```text
推奨実装方針:
  既存 emlis_ai_p7_r54_actual_human_review_execution_bodyfree_intake_20260627.py は直接書き換えない。
  既存AHR helperは historical / structural / regression refs として保持する。
  current 262/84/257/170 は、新しい薄い current snapshot actual review re-entry wrapper / basis envelope で固定する。
```

理由:

```text
- 既存AHR helperは current_received_snapshot_260_83_256_169 をactual execution basisとして保持している。
- 今回の受領基準は Cocolon_前提資料(262).zip / EmlisAIの実装済み資料(84).zip / Cocolon(257).zip / mashos-api(170).zip である。
- 260/83/256/169を、確認なしで262/84/257/170のactual review evidenceとして扱うと、どのsnapshotを読んだ証拠なのかが曖昧になる。
- 既存AHRのテストgreenは「器の確認」であり、actual human review completeではない。
- P8の問い設計へ進むには、actual review由来のbody-free question need observation rowsが必要である。
```

実装段階の仮prefixは、既存AHR line上の薄い再入場層として次を提案します。

```text
R54-AHR-CS
= R54 Actual Human Review / Current Snapshot Actual Review Re-entry
```

これは新しいRoadmap Phaseではありません。  
R54-AHR lineにおいて、current snapshot basisを再固定するための実装単位名です。

---

## 1. なぜこの作業を行うのか

Cocolonの価値は、ユーザーが残した言葉・感情・カテゴリ・行動・時点・過去記録が、入力直後に「読まれた形」として返ることです。

P5 User Label Connection は、その中でも特にCocolon固有価値に近い部分です。

```text
現在入力だけではなく、過去に残した記録が自然な線として返る。
そのことで、Cocolonへ記録を残す意味が生まれる。
```

ただし、履歴線は危険も持ちます。

```text
- 履歴で見られすぎて怖い。
- 「あなたはいつも」「原因は」「性格です」に寄る。
- 現在入力を履歴で上書きする。
- 低情報入力を履歴で深読みする。
- 安全寄りすぎて、記録が返った体験ではなく汎用説明に見える。
- P5の弱さをP8の問い返しで補ってしまう。
```

そのため、今作るべきものは「問い」ではなく、P5履歴線そのものが人間にどう読まれるかを確認するための、current basis付きactual review evidence境界です。

華恋の判断として、この工程はCocolonを「質問が上手いAI」へ寄せないための防波堤です。  
Cocolonは、ユーザーを質問で追い込む場所ではなく、残した記録が必要なときに静かに戻ってくる場所であるべきです。  
だから、P8へ進む前に、どのsnapshotを読んだ証拠なのかを固定します。

---

## 2. 参照・確認範囲

### 2.1 今回の基準ローカル資料

```text
/mnt/data/Cocolon_前提資料(262).zip
/mnt/data/EmlisAIの実装済み資料(84).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(3).zip
/mnt/data/Cocolon(257).zip
/mnt/data/mashos-api(170).zip
/mnt/data/Cocolon_EmlisAI_P7_R54AHR_CurrentSnapshotActualReview_PreDesignMemo_20260628.md
```

### 2.2 作業姿勢として確認した前提

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/04_forbidden_mixing_design_and_implementation.txt
Cocolon_前提資料/work_attitude_rules_for_karen/08_artifact_delivery_rules.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/10_stop_judgment_and_unwritten_rules.txt
Cocolon_前提資料/work_attitude_rules_for_karen/11_cocolon_area_specific_do_not_break.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/10_cocolon_joint_development_karen_thought_boundary_2026_05_24.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
```

固定する作業姿勢:

```text
- 設計指示なのでコード変更しない。
- 見ていないものを確認済みにしない。
- helper green / pytest greenを商品価値合格へ変換しない。
- body-free synthetic rowsをactual human review rowsへ変換しない。
- EmlisAIをGateに通ったものだけ表示する許可装置として扱わない。
- case専用mode / cue / surface / fixed commentTextを増やして解決しない。
- public contract / DB write path / RN表示条件 / ユーザーデータ保護を勝手に変えない。
- Cocolonを「人間の言葉を雑に処理しない場所」として扱う。
- Cocolonの主体はMash様の思想と構想であり、華恋の思想はそれを置換しない。
```

### 2.3 ロードマップとして確認した前提

```text
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md
```

読み取り:

```text
P7:
  Product Quality Runner / Long-run Product Gate。
  EmlisAIの商品品質を、単発fixture greenではなく継続測定できる形にする。

P7/P8 Bridge:
  P7のP5 human Blind QA、P6 limited human readfeel、実機modal確認では、観測補助問いを実装しない。
  body-freeの問い必要性観察メモだけを残す。

P8:
  P8開始時に、P7で集めた実ケースの問い必要性観察メモを根拠に観測補助問いの詳細設計を作る。
```

### 2.4 主に確認した実装済み資料

```text
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R54ActualHumanReviewExecution_BodyFreeEvidenceIntake_DetailedDesign_ImplementationOrder_20260627.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R54ActualLocalReviewOperation_CurrentSnapshotLocalRun_DetailedDesign_ImplementationOrder_20260627.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R54ActualLocalReviewOperation_ExecutionEvidenceMaterialization_DetailedDesign_ImplementationOrder_20260626.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R55_R54EvidenceReconcile_R52ReintakeDecisionMaterialization_DetailedDesign_ImplementationOrder_20260623.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R54ActualLocalOnlyHumanReviewOperation_Reentry_DetailedDesign_ImplementationOrder_20260625.md
```

### 2.5 主に確認した実ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_actual_human_review_execution_bodyfree_intake_20260627.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_current_snapshot_local_review_run_20260627.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_actual_review_execution_evidence_materialization_20260626.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_actual_local_review_operation_reentry_20260625.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate.py
mashos-api/ai/tests/R54_AHR24_BodyFreeEvidenceIntake_Result_20260627.md
```

---

## 3. 現在地の固定

### 3.1 確認済み

```text
- R54-AHR00〜AHR24のbody-free helper / target tests / result memosはcurrent backend snapshotに存在する。
- AHR00〜AHR24は、API / DB / RN / runtime / public response key / P8 question implementationへ触れない境界で作られている。
- AHR24 result memoでは、helper greenとactual human review completeを混同しないclaim boundaryが固定されている。
- 00_karen_read_first.md上でも、live actual human review runはfalseのままである。
- actual live body-full packet content generation confirmedはfalseである。
- actual live rating rows from external review confirmedはfalseである。
- actual live question observation rows from external review confirmedはfalseである。
- actual live disposal / purge operation confirmedはfalseである。
- actual R52 re-intake execution confirmedはfalseである。
- p5_confirmed_final / p6_start_allowed / p8_start_allowed / p7_complete / release_allowedはfalseである。
- full_backend_suite_green_confirmedはfalseである。
- RN real device modal verifiedはfalseである。
```

### 3.2 既存AHR helperのbasis

既存AHR helper内のactual execution basisは次です。

```text
P7_R54_AHR_ACTUAL_EXECUTION_BASIS_REF = current_received_snapshot_260_83_256_169
P7_R54_AHR_ACTUAL_EXECUTION_BASIS_ALLOWED_REF = current_received_snapshot_260_83_256_169_only

P7_R54_AHR_CURRENT_EXECUTION_BASIS_REFS:
  premise_zip_ref: Cocolon_前提資料(260).zip
  implemented_materials_zip_ref: EmlisAIの実装済み資料(83).zip
  rn_zip_ref: Cocolon(256).zip
  backend_zip_ref: mashos-api(169).zip
```

今回受領しているcurrent基準は次です。

```text
premise_zip_ref: Cocolon_前提資料(262).zip
implemented_materials_zip_ref: EmlisAIの実装済み資料(84).zip
rn_zip_ref: Cocolon(257).zip
backend_zip_ref: mashos-api(170).zip
```

したがって、既存AHR helperをそのままcurrent actual review evidenceとして扱ってはいけません。

### 3.3 既存R54-CLR / OP / EV / R55 / R52の扱い

既存R54-CLR / OP / EV / R55 / R52 helperは、構造・契約・回帰確認として重要です。  
ただし、それぞれ作成時点のsnapshot refsを持っています。

本設計では、これらを次のように扱います。

```text
使ってよい:
  - body-free境界の設計参考
  - helper contractの参考
  - rating / blocker / question observation normalizationの構造参考
  - selected regression target
  - historical evidence refs

使ってはいけない:
  - current 262/84/257/170 actual review basisそのもの
  - actual human review complete証拠
  - current snapshotで人間が読んだ証拠
  - P5 final / P6 start / P8 start / release判断の直接根拠
```

---

## 4. 本設計の対象範囲

本設計で扱うもの:

```text
1. current 262/84/257/170 basisをbody-freeに再固定する。
2. existing AHR 260/83/256/169 refsをhistorical / structural / regression refsとして分離する。
3. 260→262 / 83→84 / 256→257 / 169→170 の差分影響を、直接比較できる場合とできない場合に分けて扱う。
4. 24-case manifestをcurrent基準で再確認・再固定する。
5. body-full packet generation request / receiptのcurrent基準を固定する。
6. person reviewerがlocal-onlyで読むoperation receiptの条件を固定する。
7. sanitized review result row / rating row / blocker row / question need observation rowの受け口をcurrent基準で固定する。
8. disposal / purge receiptをcurrent基準で残す。
9. actual evidence completeになった場合のみ、R52 re-intake handoffへ進める条件を固定する。
10. P5 decision candidate / P5 repair / P4 current-only repair / P8 material candidate-only / inconclusiveを分ける。
11. P5 final / P6 start / P8 start / P7 complete / releaseはfalseのまま保持する。
```

---

## 5. 本設計の非対象範囲

本設計で扱わないもの:

```text
- API route変更
- request / response key変更
- DB physical schema変更
- DB migration
- RN production UI変更
- RN表示タイトル変更
- RN表示条件変更
- Emlis runtime generation変更
- User Label Connection runtime generation変更
- runtime Gate threshold変更
- public response top-level key変更
- P8 question API
- P8 question DB schema
- P8 question RN UI
- P8 question trigger logic
- question answer persistence
- question text / draft question text生成
- P6 limited human readfeel開始
- R52 re-intake actual execution
- P5 final化
- release decision layer
```

---

## 6. 設計原則

### 6.1 既存AHR helperを直接書き換えない

推奨は、既存AHR helperを直接 `260/83/256/169` から `262/84/257/170` へ書き換えないことです。

理由:

```text
- 既存AHR helper / tests / result memoは、2026-06-27のbasisとclaim boundaryを持つ歴史的証跡である。
- そこを書き換えると、過去のAHR24 result memoと実ファイルの意味がずれる。
- 既存テストは260/83/256/169前提をassertしている可能性が高い。
- current evidenceを作るには、過去証跡を書き換えるより、current wrapperで再固定する方が安全である。
```

### 6.2 current basis envelopeを第一級の証跡にする

current 262/84/257/170 は、薄いbody-free envelopeとして固定します。

```text
current basis envelopeが担うこと:
  - 今回のreview対象snapshotを明示する。
  - existing AHR helperのbasisと違うことを明示する。
  - 旧helperをcurrent evidenceにしないことをassertする。
  - 24-case manifest / packet / review row / disposal / R52 handoffが、current basisに紐づいていることをassertする。
```

### 6.3 直接diffができない場合も、黙って同一視しない

260/83/256/169 のzipが実装時に手元にない場合、直接file diffはできません。  
その場合は「影響なし」とは書きません。

扱い:

```text
直接diffが可能:
  direct_file_diff_executed = true
  diff_impact_status_ref を明示する。

直接diffが不可能:
  direct_file_diff_executed = false
  diff_impact_status_ref = DIRECT_DIFF_NOT_AVAILABLE_CURRENT_MANIFEST_REFREEZE_REQUIRED
  旧manifestをcurrent manifestとして流用せず、current 262/84/257/170用にmanifestを再固定する。
```

### 6.4 current manifest再固定で前へ進む

old basisとの差分影響を完全証明できない場合でも、実レビューを永久に止める必要はありません。  
ただし、old manifestをcurrent evidenceとして使ってはいけません。

実装判断:

```text
current 262/84/257/170上で、24-case manifestを新しくbody-freeに再固定する。
そのmanifestを使ってbody-full packet generation requestへ進む。
既存AHR manifestはhistorical / structural refとしてだけ残す。
```

### 6.5 actual review complete条件を固定する

actual human review completeは、helper greenでは成立しません。  
最低条件は次です。

```text
required_case_count = 24
reviewed_case_count = 24
sanitized_review_result_row_count = 24
rating_row_count = 24
question_need_observation_row_count = 24
disposal_verified = true
no_body_leak_validation_passed = true
no_question_text_validation_passed = true
no_touch_validation_passed = true
```

上記が揃わない場合:

```text
actual_review_evidence_complete = false
r52_reintake_handoff_ready = false または blocked
p5_confirmed_final = false
p6_start_allowed = false
p8_start_allowed = false
p7_complete = false
release_allowed = false
```

---

## 7. 実装時の候補ファイル構成

本書では実ファイル化しません。  
実装段階で現物コード・既存schema配置・既存Guard・テスト結果を見て判断します。

### 7.1 推奨候補: 新規薄いwrapper helper

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_ahr_current_snapshot_actual_review_reentry_20260628.py
```

役割:

```text
- current 262/84/257/170 basisを固定する。
- existing AHR / CLR / OP / EV / R55 / R52 refsをhistorical / structural / regression refsへ分離する。
- current basis付きの24-case manifest / receipt / evidence rows / R52 handoff envelopeを作る。
- 既存AHR helperをcurrent evidenceとして直接使わない。
```

### 7.2 候補target tests

```text
mashos-api/ai/tests/test_r54_ahr_current_snapshot_actual_review_reentry_cs00_cs01_20260628.py
mashos-api/ai/tests/test_r54_ahr_current_snapshot_actual_review_reentry_cs02_cs03_20260628.py
mashos-api/ai/tests/test_r54_ahr_current_snapshot_actual_review_reentry_cs04_cs05_20260628.py
mashos-api/ai/tests/test_r54_ahr_current_snapshot_actual_review_reentry_cs06_cs08_20260628.py
mashos-api/ai/tests/test_r54_ahr_current_snapshot_actual_review_reentry_cs09_cs11_20260628.py
mashos-api/ai/tests/test_r54_ahr_current_snapshot_actual_review_reentry_cs12_cs14_20260628.py
mashos-api/ai/tests/test_r54_ahr_current_snapshot_actual_review_reentry_cs15_cs16_20260628.py
mashos-api/ai/tests/test_r54_ahr_current_snapshot_actual_review_reentry_cs17_cs18_20260628.py
```

### 7.3 候補result memo

```text
mashos-api/ai/tests/R54_AHR_CS00_CS01_CurrentSnapshotActualReviewReentry_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CS02_CS03_CurrentSnapshotActualReviewReentry_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CS04_CS05_CurrentSnapshotActualReviewReentry_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CS06_CS08_CurrentSnapshotActualReviewReentry_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CS09_CS11_CurrentSnapshotActualReviewReentry_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CS12_CS14_CurrentSnapshotActualReviewReentry_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CS15_CS16_CurrentSnapshotActualReviewReentry_Result_20260628.md
mashos-api/ai/tests/R54_AHR_CS17_CS18_CurrentSnapshotActualReviewReentry_Result_20260628.md
```

### 7.4 非推奨候補: 既存AHR helperのbasis直接差し替え

```text
非推奨:
  emlis_ai_p7_r54_actual_human_review_execution_bodyfree_intake_20260627.py の
  P7_R54_AHR_ACTUAL_EXECUTION_BASIS_REF / CURRENT_EXECUTION_BASIS_REFS を直接262/84/257/170へ変更する。
```

非推奨理由:

```text
- 既存AHR24 result memoとの整合が壊れる。
- 2026-06-27のhistorical evidenceを現在証跡へ上書きしてしまう。
- 既存target testsの意味が変わる。
- 「どのsnapshotを読んだのか」をより曖昧にする。
```

---

## 8. 実装順

### 全体依存順

```text
CS00 no-touch boundary
  ↓
CS01 current 262/84/257/170 basis envelope
  ↓
CS02 historical helper refs reconcile
  ↓
CS03 manifest / packet / evidence impact assessment
  ↓
CS04 current 24-case manifest refreeze
  ↓
CS05 local-only preflight
  ↓
CS06 packet generation request / receipt bridge
  ↓
CS07 packet completeness / export denylist scan
  ↓
CS08 reviewer selection form current compatibility
  ↓
CS09 actual human review operation receipt intake
  ↓
CS10 sanitized review result row intake
  ↓
CS11 rating row normalization
  ↓
CS12 blocker / question need observation normalization
  ↓
CS13 rating-question consistency guard
  ↓
CS14 pause / abort / expiration / disposal receipt
  ↓
CS15 body-free post-review summary / evidence complete判定
  ↓
CS16 P5 decision candidate separation
  ↓
CS17 P6/P8 candidate-only / R52 handoff envelope
  ↓
CS18 final no-leak / no-question-text / no-touch validation + command matrix
```

---

### CS00: Scope / no-touch boundary freeze

目的:

```text
current snapshot actual review re-entryの範囲と、絶対に触らないcontractを固定する。
```

実装候補:

```text
build_p7_r54_ahr_cs00_scope_no_touch_boundary_freeze()
assert_p7_r54_ahr_cs00_scope_no_touch_boundary_freeze_contract()
```

出力するbody-free material:

```text
schema_version
phase
step
scope
policy_kind
policy_section
operation_step_ref
current_phase
material_id
source_mode
git_connection_required=false
git_checked=false
api_route_changed=false
db_schema_changed=false
rn_ui_changed=false
runtime_generation_changed=false
public_response_key_changed=false
p8_question_implementation_started=false
body_free=true
```

fail-closed:

```text
- API / DB / RN / runtime / public response key変更flagがtrueならblocked。
- question text / draft question text / raw body / path / hash keyを含むならblocked。
- source_modeがlocal_snapshotでなければblocked。
```

---

### CS01: Current 262/84/257/170 basis envelope

目的:

```text
今回のactual review execution basisを、current_received_snapshot_262_84_257_170 として固定する。
```

実装候補:

```text
build_p7_r54_ahr_cs01_current_snapshot_basis_refreeze()
assert_p7_r54_ahr_cs01_current_snapshot_basis_refreeze_contract()
```

必須refs:

```text
current_received_snapshot_refs:
  premise_zip_ref: Cocolon_前提資料(262).zip
  implemented_materials_zip_ref: EmlisAIの実装済み資料(84).zip
  rn_zip_ref: Cocolon(257).zip
  backend_zip_ref: mashos-api(170).zip
  roadmap_ref: Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md
  pre_design_memo_ref: Cocolon_EmlisAI_P7_R54AHR_CurrentSnapshotActualReview_PreDesignMemo_20260628.md
  detailed_design_ref: Cocolon_EmlisAI_P7_R54AHR_CurrentSnapshotActualReview_Reentry_DetailedDesign_ImplementationOrder_20260628.md
```

必須判定:

```text
actual_review_basis_ref = current_received_snapshot_262_84_257_170
actual_review_basis_allowed = current_received_snapshot_262_84_257_170_only
existing_ahr_basis_ref = current_received_snapshot_260_83_256_169
existing_ahr_basis_matches_current = false
existing_ahr_can_be_used_as_current_actual_review_evidence = false
current_basis_refrozen_here = true
```

fail-closed:

```text
- 262/84/257/170のいずれかが欠ける場合blocked。
- 260/83/256/169をcurrent evidenceとして使うflagがtrueならblocked。
```

---

### CS02: Historical helper refs reconcile

目的:

```text
既存AHR / CLR / OP / EV / R55 / R52 helper refsをhistorical / structural / regression refsとして分離する。
```

実装候補:

```text
build_p7_r54_ahr_cs02_historical_helper_refs_reconcile()
assert_p7_r54_ahr_cs02_historical_helper_refs_reconcile_contract()
```

historical group候補:

```text
r52_20260621
r54_bodyfree_handoff_20260622
r55_20260623
r54_op_20260625
r54_ev_20260626
r54_clr_20260627
r54_ahr_20260627
```

必須判定:

```text
historical_helper_refs_separated = true
historical_helper_refs_can_be_used_for_helper_regression_only = true
historical_helper_refs_can_be_used_for_actual_review_basis = false
historical_helper_refs_used_as_current_actual_review_basis = false
```

fail-closed:

```text
- historical helper outputをcurrent actual evidenceとして渡している場合blocked。
- helper greenをactual review completeへ変換するclaimが含まれる場合blocked。
```

---

### CS03: Manifest / packet / evidence impact assessment

目的:

```text
260/83/256/169 から 262/84/257/170 への差分が、24-case manifest / packet boundary / evidence rowsへ影響するかをbody-freeに分類する。
```

実装候補:

```text
build_p7_r54_ahr_cs03_manifest_packet_evidence_impact_assessment()
assert_p7_r54_ahr_cs03_manifest_packet_evidence_impact_assessment_contract()
```

扱い:

```text
直接diff可能:
  direct_file_diff_executed = true
  diff_impact_status_ref = NO_REVIEW_MANIFEST_IMPACT | REVIEW_MANIFEST_IMPACT_PRESENT | DIFF_INCONCLUSIVE

直接diff不可:
  direct_file_diff_executed = false
  diff_impact_status_ref = DIRECT_DIFF_NOT_AVAILABLE_CURRENT_MANIFEST_REFREEZE_REQUIRED
  current_manifest_refreeze_required = true
```

ここで重要なのは、直接diff不可を「影響なし」としないことです。  
直接diff不可の場合でも、current manifestを新しく固定すれば次へ進めます。

fail-closed:

```text
- diff不可なのに no impact と書く場合blocked。
- old manifestをcurrent manifestとして無条件採用する場合blocked。
- body-full diff contentやraw file pathを成果物に含む場合blocked。
```

---

### CS04: Current 24-case manifest refreeze

目的:

```text
current 262/84/257/170基準の24-case manifestをbody-free refsとして再固定する。
```

実装候補:

```text
build_p7_r54_ahr_cs04_current_24_case_manifest_refreeze()
assert_p7_r54_ahr_cs04_current_24_case_manifest_refreeze_contract()
```

必須条件:

```text
required_case_count = 24
manifest_row_count = 24
case_ref_ids_unique = true
blind_case_ids_unique = true
packet_ref_ids_unique = true
rating_axis_profile_ref present
rating_axis_count = 6
body_full_packet_materialized_here = false
local_reviewer_payload_materialized_here = false
body_free = true
```

rating axis refsは既存R54-OP / AHRの構造を継承する候補です。

```text
history_connection_naturalness
creepy_absence
overclaim_absence
self_blame_non_amplification
wants_more_input_or_accumulation
non_shallow_repeat
```

目標threshold候補:

```text
history_connection_naturalness: 0.90
creepy_absence: 0.95
overclaim_absence: 0.95
self_blame_non_amplification: 0.95
wants_more_input_or_accumulation: 0.85
non_shallow_repeat: 0.90
```

fail-closed:

```text
- 24件未満 / 重複 / body-full materialized flag trueならblocked。
- current basis refが262/84/257/170でない場合blocked。
```

---

### CS05: Local-only preflight

目的:

```text
body-full packet生成要求の前に、local-only条件とpurge計画をbody-freeに確認する。
```

実装候補:

```text
build_p7_r54_ahr_cs05_local_only_preflight()
assert_p7_r54_ahr_cs05_local_only_preflight_contract()
```

必須条件:

```text
explicit_local_only_allow_present = true
local_review_root_available_ref_present = true
current_24_case_manifest_frozen = true
export_denylist_ready = true
purge_plan_ready = true
review_session_id_present = true
body_full_generation_blocked_until_preflight = true before ready
```

fail-closed:

```text
- local-only allowがない場合blocked。
- purge planがない場合blocked。
- export denylistがない場合blocked。
- local absolute pathを成果物に含む場合blocked。
```

---

### CS06: Packet generation request / receipt bridge

目的:

```text
body-full packet生成を実行するのではなく、生成要求と生成receiptをbody-freeで受ける境界を固定する。
```

実装候補:

```text
build_p7_r54_ahr_cs06_packet_generation_request_bodyfree_evidence()
build_p7_r54_ahr_cs06_local_packet_generation_receipt_intake()
assert_p7_r54_ahr_cs06_packet_generation_bridge_contract()
```

記録してよいもの:

```text
packet_generation_request_ref
packet_generation_operation_ref
required_case_count
generated_case_count
generated_packet_count
packet_ref_ids
local_only=true
exported=false
body_full_packet_content_included=false
local_absolute_path_included=false
body_hash_included=false
terminal_output_body_included=false
```

fail-closed:

```text
- packet content / raw input / returned Emlis body / history surface / path / hash / terminal outputを含む場合blocked。
- exported=trueならblocked。
- generated countsが24でない場合blocked。
```

---

### CS07: Packet completeness / export denylist scan

目的:

```text
reviewer selection formへ進む前に、packet completenessとexport denylistをbody-freeに確認する。
```

実装候補:

```text
build_p7_r54_ahr_cs07_packet_completeness_export_denylist_scan()
assert_p7_r54_ahr_cs07_packet_completeness_export_denylist_scan_contract()
```

必須条件:

```text
required_case_count = 24
expected_packet_count = 24
scanned_case_count = 24
scanned_packet_count = 24
exported = false
local_packet_exported = false
forbidden_export_flag_count = 0
packet_completeness_export_denylist_scan_passed = true
```

fail-closed:

```text
- 1件でも欠ける場合blocked。
- export / path / hash / body leakの兆候がある場合blocked。
```

---

### CS08: Reviewer selection form current compatibility

目的:

```text
reviewerがbody-full packetをlocal-onlyで読むための、selection-only form構造をcurrent基準で固定する。
```

実装候補:

```text
build_p7_r54_ahr_cs08_reviewer_selection_form_freeze()
assert_p7_r54_ahr_cs08_reviewer_selection_form_freeze_contract()
```

許可するもの:

```text
score options: 0.0 / 0.25 / 0.5 / 0.75 / 1.0
verdict options: PASS / YELLOW / REPAIR_REQUIRED / RED / BLOCKED / NOT_REVIEWABLE
sanitized_reason_id options
readfeel_blocker_id options
execution_blocker_id options
question_need_primary_class options
ambiguity_kind refs
one_question_fit refs
repair_required refs
plan_candidate flags
```

禁止するもの:

```text
reviewer_free_text
reviewer_notes_body
question_text
draft_question_text
raw input
returned Emlis body
history surface
comment_text body
local path
body hash
```

fail-closed:

```text
- free-text欄を設ける場合blocked。
- question text / draft question text欄を設ける場合blocked。
- reviewer-facing family / tier exposing policyがmanifestと矛盾する場合blocked。
```

---

### CS09: Actual human review operation receipt intake

目的:

```text
人間がlocal-onlyで実際に読んだoperation receiptを、body-free counts / refsとして受ける。
```

実装候補:

```text
build_p7_r54_ahr_cs09_actual_human_review_local_only_operation_receipt_intake()
assert_p7_r54_ahr_cs09_actual_human_review_local_only_operation_receipt_intake_contract()
```

ここで重要なのは、helperはレビューを実行しないことです。  
helperは、レビュー実施receiptを受け取り、境界違反がないか検査するだけです。

必須条件:

```text
actual_human_review_operation_run = true
reviewer_person_ref present
review_started_at_bucket_ref present
review_completed_at_bucket_ref present
reviewed_case_count = 24
selection_form_used = true
local_only = true
body_full_packet_content_included = false
reviewer_free_text_included = false
raw_body_included = false
question_text_included = false
```

fail-closed:

```text
- operation receiptがない場合blocked。
- reviewed_case_countが24でない場合blocked。
- body-full content / free text / question text / path / hashが含まれる場合blocked。
```

---

### CS10: Sanitized review result row intake

目的:

```text
actual review由来のselection-only結果を、24件のsanitized review result rowsとして受ける。
```

実装候補:

```text
build_p7_r54_ahr_cs10_sanitized_review_result_row_intake()
assert_p7_r54_ahr_cs10_sanitized_review_result_row_intake_contract()
```

必須条件:

```text
source_operation_receipt_ready = true
sanitized_review_result_row_count = 24
case_ref_ids_match_manifest = true
axis_score_count = 6
all_scores_in_allowed_options = true
all_verdicts_in_allowed_options = true
all_reason_ids_in_allowed_options = true
body_free = true
```

fail-closed:

```text
- 24件未満 / case不一致 / axis不一致 / score範囲外ならblocked。
- reviewer free text / raw body / question text / path / hashを含む場合blocked。
```

---

### CS11: Rating row normalization

目的:

```text
sanitized review result rowsを、P5 rating rowsへ正規化する。
```

実装候補:

```text
build_p7_r54_ahr_cs11_rating_row_normalization()
assert_p7_r54_ahr_cs11_rating_row_normalization_contract()
```

必須出力:

```text
rating_row_count = 24
axis_averages
below_target_axis_counts
verdict_counts
readfeel_blocker_id_counts
execution_blocker_id_counts
current_basis_ref = current_received_snapshot_262_84_257_170
```

fail-closed:

```text
- rating_row_countが24でない場合blocked。
- below targetやblockerがあること自体はblockedではない。
- ただし、P5 confirmed candidateへ進めるかの判断材料として分ける。
```

---

### CS12: Blocker / question need observation normalization

目的:

```text
readfeel blockers / execution blockers / question need observationsをbody-freeで分離する。
```

実装候補:

```text
build_p7_r54_ahr_cs12_blocker_question_need_observation_normalization()
assert_p7_r54_ahr_cs12_blocker_question_need_observation_normalization_contract()
```

question need primary class候補:

```text
no_question_needed_emlis_can_observe
question_may_reduce_overread_risk
question_would_make_immediate_observation_heavy
not_question_emlis_readfeel_repair_required
not_question_p5_surface_repair_required
not_question_gate_boundary_required
plus_single_question_candidate_later
premium_deep_dive_candidate_later
insufficient_material_execution_blocker
```

重要:

```text
ここで作るのは、P8用の材料候補だけである。
question text / draft question text は作らない。
P8 start_allowed はfalseのまま。
```

fail-closed:

```text
- question_need_observation_row_countが24でない場合blocked。
- question text / draft question textを含む場合blocked。
- P8 implementation spec finalized flagがtrueならblocked。
```

---

### CS13: Rating-question consistency guard

目的:

```text
rating rowsとquestion observation rowsが矛盾していないか確認する。
```

実装候補:

```text
build_p7_r54_ahr_cs13_rating_question_consistency_guard()
assert_p7_r54_ahr_cs13_rating_question_consistency_guard_contract()
```

例:

```text
- execution blockerがあるcaseをP8 material candidateにしない。
- P5 repair required caseを、question candidateで覆わない。
- not_question_emlis_readfeel_repair_requiredを、plus_single_question_candidate_laterとして扱わない。
- question_would_make_immediate_observation_heavyを、実装候補へ昇格しない。
```

fail-closed:

```text
- open consistency issueが残る場合、R52 handoff readyへ進めない。
```

---

### CS14: Pause / abort / expiration / disposal receipt

目的:

```text
body-full local-only packet lifecycleの終了状態を、body-freeで閉じる。
```

実装候補:

```text
build_p7_r54_ahr_cs14_pause_abort_expiration_protocol()
build_p7_r54_ahr_cs14_purge_disposal_receipt_intake()
assert_p7_r54_ahr_cs14_disposal_contract()
```

必須条件:

```text
disposal_receipt_present = true
disposal_verified = true
body_full_packet_deleted_or_purged_ref = true
reviewer_notes_deleted_or_not_created_ref = true
local_path_included = false
body_hash_included = false
terminal_output_body_included = false
```

fail-closed:

```text
- disposal receiptがない場合、actual_review_evidence_complete=false。
- local path / hash / terminal outputを成果物に含む場合blocked。
```

---

### CS15: Body-free post-review summary / evidence complete判定

目的:

```text
review counts / rating stats / blocker counts / question observation counts / disposalをまとめ、actual_review_evidence_completeを判定する。
```

実装候補:

```text
build_p7_r54_ahr_cs15_bodyfree_post_review_summary()
assert_p7_r54_ahr_cs15_bodyfree_post_review_summary_contract()
```

complete条件:

```text
required_case_count = 24
reviewed_case_count = 24
rating_row_count = 24
question_observation_row_count = 24
disposal_verified = true
no_body_leak_validation_passed = true
no_question_text_validation_passed = true
no_touch_validation_passed = true
```

completeでもtrueにしないもの:

```text
p5_confirmed_final = false
p6_start_allowed = false
p8_start_allowed = false
p7_complete = false
release_allowed = false
actual_r52_reintake_execution_confirmed = false
```

fail-closed:

```text
- いずれかのcomplete条件が欠ける場合 actual_review_evidence_complete=false。
- completeをP5 final / P6 / P8 / releaseへ自動変換する場合blocked。
```

---

### CS16: P5 decision candidate separation

目的:

```text
P5 confirmed candidate / P5 repair / P4 current-only repair / operation blocked / inconclusiveを分ける。
```

実装候補:

```text
build_p7_r54_ahr_cs16_p5_decision_candidate_separation()
assert_p7_r54_ahr_cs16_p5_decision_candidate_separation_contract()
```

decision candidate候補:

```text
P5_CONFIRMED_CANDIDATE
P5_REPAIR_RETURN_REQUIRED
P4_CURRENT_ONLY_REPAIR_REQUIRED
R54_OPERATION_INCONCLUSIVE
R54_OPERATION_BLOCKED_PREFLIGHT_OR_EXECUTION
R54_OPERATION_BLOCKED_DISPOSAL
R54_OPERATION_BLOCKED_BODY_LEAK_OR_QUESTION_TEXT
R54_OPERATION_BLOCKED_NO_TOUCH
```

重要:

```text
P5_CONFIRMED_CANDIDATE は P5 final ではない。
P5 finalは、R52側 re-intake / decision gate以降の別判断である。
```

fail-closed:

```text
- actual_review_evidence_complete=falseなのにP5_CONFIRMED_CANDIDATEを出す場合blocked。
- P5_CONFIRMED_CANDIDATEをP5 finalへ変換する場合blocked。
```

---

### CS17: P6/P8 candidate-only / R52 handoff envelope

目的:

```text
actual review evidence complete時だけ、P6候補 / P8材料候補 / R52 handoff envelopeをbody-freeで作る。
```

実装候補:

```text
build_p7_r54_ahr_cs17_p6_candidate_only_handoff()
build_p7_r54_ahr_cs17_p8_material_candidate_only_handoff()
build_p7_r54_ahr_cs17_r52_reintake_handoff_envelope()
assert_p7_r54_ahr_cs17_candidate_handoff_contract()
```

P8 material candidate-only条件:

```text
- actual review由来のquestion need observation rowsからのみ作る。
- question text / draft question textは含めない。
- P5 repair対象 / P4 current-only repair対象 / execution blocker対象は除外する。
- plus_single_question_candidate_later / premium_deep_dive_candidate_later は候補refsに留める。
- p8_start_allowed=false。
```

R52 handoff条件:

```text
actual_review_evidence_complete = true
final_no_body_leak_validation_passed = true
final_no_question_text_validation_passed = true
final_no_touch_validation_passed = true
r52_reintake_handoff_ready = true
actual_r52_reintake_execution_confirmed = false
```

fail-closed:

```text
- P8 candidate-onlyをP8 start / P8 detailed design startへ変換する場合blocked。
- R52 handoff readyをR52 actual execution済みに変換する場合blocked。
```

---

### CS18: Final validation / command matrix / documentation output

目的:

```text
current snapshot actual review re-entryで何を確認し、何をまだ確認していないかをbody-freeに残す。
```

実装候補:

```text
build_p7_r54_ahr_cs18_final_no_body_leak_no_question_text_no_touch_validation()
build_p7_r54_ahr_cs18_validation_command_matrix_documentation_output()
assert_p7_r54_ahr_cs18_validation_command_matrix_documentation_output_contract()
```

command matrixに残す候補:

```text
compileall_services_ai_inference_tests
target_r54_ahr_cs00_cs18_split
selected_existing_ahr_regression
selected_r55_regression
selected_r52_regression
full_backend_suite
rn_contract
rn_real_device_modal
```

claim boundary:

```text
CS helper green != actual human review complete
existing AHR helper green != current actual review complete
selected regression green != full backend suite green
RN contract green != RN real device modal verified
R52 handoff ready != R52 re-intake executed
P8 material candidate-only != P8 start allowed
P5 confirmed candidate != P5 final
```

fail-closed:

```text
- command未実行なのにpassed扱いする場合blocked。
- timeout / kill / interruptedをgreen証拠にする場合blocked。
- stdout / stderr / traceback bodyを成果物に含む場合blocked。
```

---

## 9. json / schema案

ここに書くjson / schemaは、DB schemaではありません。  
body-free material / evidence envelopeの論理schema案です。  
実ファイル化は実装段階で、既存コード配置・既存Guard・既存test構成を確認して判断します。

### 9.1 current snapshot basis envelope案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.current_snapshot_reentry.cs01_current_snapshot_basis_refreeze.bodyfree.v1",
  "phase": "P7_Product_Quality_Runner",
  "step": "R54-AHR-CS",
  "scope": "p5_user_label_connection_current_snapshot_actual_review_reentry",
  "policy_kind": "r54_ahr_current_snapshot_actual_review_reentry_boundary",
  "policy_section": "R54-AHR-CS01_current_snapshot_basis_refreeze",
  "material_id": "p7_r54_ahr_cs01_current_snapshot_basis_refreeze_20260628",
  "source_mode": "local_snapshot",
  "git_connection_required": false,
  "git_checked": false,
  "current_received_snapshot_refs": {
    "premise_zip_ref": "Cocolon_前提資料(262).zip",
    "implemented_materials_zip_ref": "EmlisAIの実装済み資料(84).zip",
    "rn_zip_ref": "Cocolon(257).zip",
    "backend_zip_ref": "mashos-api(170).zip",
    "roadmap_ref": "Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md",
    "pre_design_memo_ref": "Cocolon_EmlisAI_P7_R54AHR_CurrentSnapshotActualReview_PreDesignMemo_20260628.md",
    "detailed_design_ref": "Cocolon_EmlisAI_P7_R54AHR_CurrentSnapshotActualReview_Reentry_DetailedDesign_ImplementationOrder_20260628.md"
  },
  "actual_review_basis_ref": "current_received_snapshot_262_84_257_170",
  "actual_review_basis_allowed": "current_received_snapshot_262_84_257_170_only",
  "existing_ahr_basis_ref": "current_received_snapshot_260_83_256_169",
  "existing_ahr_basis_matches_current": false,
  "existing_ahr_can_be_used_as_current_actual_review_evidence": false,
  "current_basis_refrozen_here": true,
  "body_free": true,
  "raw_input_included": false,
  "returned_emlis_body_included": false,
  "history_surface_included": false,
  "comment_text_included": false,
  "question_text_included": false,
  "draft_question_text_included": false,
  "local_absolute_path_included": false,
  "body_hash_included": false,
  "api_route_changed": false,
  "db_schema_changed": false,
  "rn_ui_changed": false,
  "runtime_generation_changed": false,
  "public_response_key_changed": false,
  "p8_question_implementation_started": false
}
```

### 9.2 historical helper refs reconcile row案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.current_snapshot_reentry.historical_helper_ref_row.bodyfree.v1",
  "helper_group_ref": "r54_ahr_20260627",
  "helper_module_ref": "emlis_ai_p7_r54_actual_human_review_execution_bodyfree_intake_20260627",
  "helper_basis_ref": "current_received_snapshot_260_83_256_169",
  "current_basis_ref": "current_received_snapshot_262_84_257_170",
  "matches_current_basis": false,
  "allowed_as_structural_ref": true,
  "allowed_as_regression_ref": true,
  "allowed_as_current_actual_review_evidence": false,
  "helper_green_can_claim_actual_review_complete": false,
  "body_free": true
}
```

### 9.3 manifest impact assessment案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.current_snapshot_reentry.cs03_manifest_impact_assessment.bodyfree.v1",
  "material_id": "p7_r54_ahr_cs03_manifest_impact_assessment_20260628",
  "current_basis_ref": "current_received_snapshot_262_84_257_170",
  "historical_basis_ref": "current_received_snapshot_260_83_256_169",
  "direct_file_diff_executed": false,
  "diff_impact_status_ref": "DIRECT_DIFF_NOT_AVAILABLE_CURRENT_MANIFEST_REFREEZE_REQUIRED",
  "current_manifest_refreeze_required": true,
  "old_manifest_allowed_as_current_manifest": false,
  "old_manifest_allowed_as_structural_ref": true,
  "body_free": true,
  "raw_diff_body_included": false,
  "local_absolute_path_included": false,
  "terminal_output_body_included": false
}
```

### 9.4 current 24-case manifest row案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.current_snapshot_reentry.cs04_case_manifest_row.bodyfree.v1",
  "case_index": 1,
  "case_ref_id": "r54_ahr_cs_case_001",
  "blind_case_id": "blind_case_001",
  "packet_ref_id": "packet_ref_001",
  "case_family_ref": "case_family_ref_enum",
  "case_role_ref": "case_role_ref_enum",
  "subscription_tier_ref": "tier_ref_enum",
  "history_evidence_policy_ref": "history_policy_ref_enum",
  "review_axis_profile_ref": "r54_ahr_p5_history_line_6_axis_profile_current_20260628",
  "requires_history_line_review": true,
  "current_only_boundary_case": false,
  "reviewer_facing_family_exposed": false,
  "reviewer_facing_tier_exposed": false,
  "body_full_packet_materialized_here": false,
  "local_reviewer_payload_materialized_here": false,
  "body_free": true
}
```

### 9.5 actual operation receipt案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.current_snapshot_reentry.cs09_actual_operation_receipt.bodyfree.v1",
  "review_session_id": "p7_r54_ahr_current_snapshot_actual_review_20260628",
  "operation_receipt_ref": "R54_AHR_CS_ACTUAL_HUMAN_REVIEW_LOCAL_ONLY_OPERATION_RECEIPT_REF",
  "current_basis_ref": "current_received_snapshot_262_84_257_170",
  "actual_human_review_operation_run": true,
  "reviewer_person_ref": "reviewer_person_ref_001",
  "review_started_at_bucket_ref": "review_started_at_bucket_ref",
  "review_completed_at_bucket_ref": "review_completed_at_bucket_ref",
  "required_case_count": 24,
  "reviewed_case_count": 24,
  "selection_form_used": true,
  "local_only": true,
  "body_free": true,
  "body_full_packet_content_included": false,
  "reviewer_free_text_included": false,
  "reviewer_notes_body_included": false,
  "raw_body_included": false,
  "returned_emlis_body_included": false,
  "history_surface_included": false,
  "question_text_included": false,
  "draft_question_text_included": false,
  "local_absolute_path_included": false,
  "body_hash_included": false
}
```

### 9.6 sanitized review result row案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.current_snapshot_reentry.cs10_sanitized_review_result_row.bodyfree.v1",
  "review_result_row_ref": "review_result_row_001",
  "review_session_id": "p7_r54_ahr_current_snapshot_actual_review_20260628",
  "case_ref_id": "r54_ahr_cs_case_001",
  "blind_case_id": "blind_case_001",
  "packet_ref_id": "packet_ref_001",
  "axis_scores": {
    "history_connection_naturalness": 0.0,
    "creepy_absence": 0.0,
    "overclaim_absence": 0.0,
    "self_blame_non_amplification": 0.0,
    "wants_more_input_or_accumulation": 0.0,
    "non_shallow_repeat": 0.0
  },
  "axis_score_count": 6,
  "verdict": "NOT_REVIEWABLE",
  "sanitized_reason_ids": [],
  "readfeel_blocker_ids": [],
  "execution_blocker_ids": [],
  "question_need_primary_class": "insufficient_material_execution_blocker",
  "ambiguity_kind_refs": [],
  "one_question_fit_ref": "insufficient_material",
  "repair_required_refs": [],
  "plan_candidate_flags": {
    "plus_single_question_candidate_later": false,
    "premium_deep_dive_candidate_later": false,
    "p8_design_material_candidate": false,
    "p8_implementation_spec_finalized_here": false
  },
  "body_free": true,
  "reviewer_free_text_included": false,
  "raw_body_included": false,
  "returned_emlis_body_included": false,
  "history_surface_included": false,
  "comment_text_included": false,
  "question_text_included": false,
  "draft_question_text_included": false,
  "local_absolute_path_included": false,
  "body_hash_included": false,
  "packet_content_included": false
}
```

注記: 上記のscore `0.0` はschema形の例であり、実レビュー値ではありません。実装段階では実レビュー由来のselection-only値を受けます。

### 9.7 question need observation row案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.current_snapshot_reentry.cs12_question_need_observation_row.bodyfree.v1",
  "question_observation_row_ref": "question_observation_row_001",
  "review_session_id": "p7_r54_ahr_current_snapshot_actual_review_20260628",
  "source_rating_row_ref": "rating_row_001",
  "case_ref_id": "r54_ahr_cs_case_001",
  "question_need_primary_class": "no_question_needed_emlis_can_observe",
  "ambiguity_kind_refs": ["no_material_ambiguity"],
  "one_question_fit_ref": "not_needed",
  "repair_required_refs": ["no_repair_required"],
  "plus_single_question_candidate_later": false,
  "premium_deep_dive_candidate_later": false,
  "p8_design_material_candidate": false,
  "p8_implementation_spec_finalized_here": false,
  "body_free": true,
  "question_text_included": false,
  "draft_question_text_included": false,
  "raw_answer_included": false,
  "comment_text_included": false
}
```

### 9.8 disposal receipt案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.current_snapshot_reentry.cs14_disposal_receipt.bodyfree.v1",
  "review_session_id": "p7_r54_ahr_current_snapshot_actual_review_20260628",
  "disposal_receipt_ref": "R54_AHR_CS_BODY_FULL_PACKET_PURGE_DISPOSAL_RECEIPT_REF",
  "current_basis_ref": "current_received_snapshot_262_84_257_170",
  "disposal_receipt_present": true,
  "disposal_verified": true,
  "body_full_packet_deleted_or_purged_ref": true,
  "reviewer_notes_deleted_or_not_created_ref": true,
  "body_free": true,
  "body_full_packet_content_included": false,
  "reviewer_notes_body_included": false,
  "local_absolute_path_included": false,
  "body_hash_included": false,
  "terminal_output_body_included": false
}
```

### 9.9 R52 handoff envelope案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.current_snapshot_reentry.cs17_r52_reintake_handoff.bodyfree.v1",
  "handoff_ref": "R54_AHR_CS_R52_REINTAKE_HANDOFF_CURRENT_SNAPSHOT_20260628",
  "current_basis_ref": "current_received_snapshot_262_84_257_170",
  "actual_review_evidence_complete": true,
  "required_case_count": 24,
  "reviewed_case_count": 24,
  "rating_row_count": 24,
  "question_observation_row_count": 24,
  "disposal_verified": true,
  "final_no_body_leak_validation_passed": true,
  "final_no_question_text_validation_passed": true,
  "final_no_touch_validation_passed": true,
  "r52_reintake_handoff_ready": true,
  "actual_r52_reintake_execution_confirmed": false,
  "p5_confirmed_final": false,
  "p6_start_allowed": false,
  "p8_start_allowed": false,
  "p7_complete": false,
  "release_allowed": false,
  "body_free": true
}
```

注記: 上記はcomplete時の形を示すschema案です。実レビュー証跡が揃わない場合、`actual_review_evidence_complete` と `r52_reintake_handoff_ready` はfalseになります。

---

## 10. body-full / body-free境界

### 10.1 body-full local-onlyで一時的に扱う可能性があるもの

```text
current input review surface
returned Emlis surface
bounded owned history review surface
local-only axis rating form
local-only selection form
```

ただし、上記は成果物へ残しません。  
成果物へ残すのはbody-free evidenceだけです。

### 10.2 body-free evidenceへ残してよいもの

```text
safe refs
enums
booleans
counts
axis scores
threshold refs
case family refs
case role refs
sanitized reason ids
blocker ids
summary statistics
decision candidate refs
validation status refs
```

### 10.3 body-free evidenceへ残してはいけないもの

```text
raw input
current input body
returned Emlis body
history surface
comment_text body
reviewer free text
reviewer notes body
question text
draft question text
raw question answer
body-full packet content
body hash
local absolute path
terminal output body
stdout / stderr / traceback body
```

---

## 11. no-touch contract

本設計で固定するno-touch contractは次です。

```text
api_route_changed = false
request_response_key_changed = false
db_physical_schema_changed = false
db_migration_created = false
rn_production_ui_changed = false
rn_display_condition_changed = false
runtime_generation_changed = false
user_label_connection_runtime_changed = false
gate_threshold_changed = false
public_response_top_level_key_changed = false
p8_question_api_created = false
p8_question_db_schema_created = false
p8_question_rn_ui_created = false
p8_question_trigger_logic_created = false
question_answer_persistence_created = false
release_decision_layer_changed = false
```

違反時の扱い:

```text
- target helper / testsがgreenでも、no-touch違反があれば本工程はblocked。
- no-touch違反が必要になる場合は、本設計の範囲外として止める。
```

---

## 12. 検証計画

### 12.1 実装時target test候補

実装段階では、次のような分割targetを想定します。  
本書作成時点では実行しません。

```bash
cd mashos-api/ai
python3 -m compileall -q services/ai_inference tests

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_current_snapshot_actual_review_reentry_cs00_cs01_20260628.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_current_snapshot_actual_review_reentry_cs02_cs03_20260628.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_current_snapshot_actual_review_reentry_cs04_cs05_20260628.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_current_snapshot_actual_review_reentry_cs06_cs08_20260628.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_current_snapshot_actual_review_reentry_cs09_cs11_20260628.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_current_snapshot_actual_review_reentry_cs12_cs14_20260628.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_current_snapshot_actual_review_reentry_cs15_cs16_20260628.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_current_snapshot_actual_review_reentry_cs17_cs18_20260628.py
```

### 12.2 selected regression候補

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_actual_human_review_execution_bodyfree_intake_ahr22_ahr23_20260627.py \
  tests/test_r54_actual_human_review_execution_bodyfree_intake_ahr24_20260627.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r8_r9_20260623.py \
  tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r10_20260624.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r12_r13_20260621.py \
  tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r14_r15_20260621.py
```

### 12.3 full backend suite / RN contract / RN実機確認のclaim boundary

```text
full backend suite:
  実行してgreen確認できた場合だけ、full_backend_suite_green_confirmed=trueと記録できる。
  timeout / kill / interruptedはgreen証拠にしない。

RN contract:
  本工程はRN no-touchなので必須ではない。
  実行した場合だけ、rn_contract_re_run=trueとして記録できる。

RN実機modal:
  本工程では実施しない。
  RN contract greenとRN実機modal確認を混同しない。
```

---

## 13. 完了条件

### 13.1 設計書としての完了条件

```text
- 現在Phaseが P7-R54-AHR Current Snapshot Actual Review Re-entry として固定されている。
- P8 / P6 / R52 actual execution / releaseへ進まない理由が明示されている。
- 262/84/257/170のcurrent basisがbody-freeに固定されている。
- 260/83/256/169の既存AHR refsをhistorical / structural / regression refsとして分離している。
- current差分が24-case manifest / review packet / evidence rowsへ影響するかの確認手順がある。
- 直接diffできない場合のcurrent manifest refreeze方針がある。
- actual human review成立条件が、24件review / 24 rating rows / 24 question observation rows / disposal verified / no-leak / no-touchとして固定されている。
- helper green / actual review complete / R52 handoff ready / P5 final / P8 start / releaseの違いが固定されている。
- API / DB / RN / runtime / public response key / P8 question no-touchが明示されている。
- json / schema案がbody-free evidence材料として内包され、実ファイル化は実装段階判断と明記されている。
```

### 13.2 実装段階の完了候補

実装時に完了候補と呼べるのは、次が揃った場合です。

```text
- CS00〜CS18 target tests green。
- selected AHR / R55 / R52 regression green。
- final no-body-leak / no-question-text / no-touch validation passed。
- current basis 262/84/257/170 と historical basis 260/83/256/169 が分離されている。
- result memoにclaim boundaryが残っている。
```

ただし、これでも次は自動trueにしません。

```text
actual_human_review_complete
P5 final
P6 start
P8 start
P7 complete
release_allowed
full_backend_suite_green_confirmed
RN real device modal verified
```

### 13.3 actual human review complete候補

actual human review complete候補は、target tests greenではなく、次が揃った場合だけです。

```text
actual_human_review_operation_run = true
reviewed_case_count = 24
sanitized_review_result_row_count = 24
rating_row_count = 24
question_need_observation_row_count = 24
disposal_verified = true
no_body_leak_validation_passed = true
no_question_text_validation_passed = true
no_touch_validation_passed = true
```

その場合でも、次は別工程判断です。

```text
R52 re-intake actual execution
P5 final
P6 start
P8 start
release
```

---

## 14. rollback / fail-closed条件

次のいずれかが発生した場合、実装段階ではfail-closedにします。

```text
- current basisが262/84/257/170として固定できない。
- 既存AHR basis 260/83/256/169をcurrent evidenceとして扱っている。
- old manifestをcurrent manifestとして無条件採用している。
- body-full content / raw input / returned Emlis body / history surface / comment_text bodyが成果物へ入る。
- reviewer free text / reviewer notes bodyが成果物へ入る。
- question text / draft question textが成果物へ入る。
- local absolute path / body hash / terminal output bodyが成果物へ入る。
- P8 implementation spec finalized flagがtrueになる。
- P8 start_allowedがtrueになる。
- P6 start_allowedがtrueになる。
- P5 finalがtrueになる。
- release_allowedがtrueになる。
- helper greenをactual review completeとしてclaimしている。
- timeout / kill / interruptedをgreen証拠としてclaimしている。
```

rollback方針:

```text
- 新規wrapper helper / 新規tests / 新規result memoのみを戻す。
- 既存AHR / CLR / OP / EV / R55 / R52 helperは原則触らないため、rollback範囲を狭くできる。
- no-touch contract違反が発生した場合、設計範囲外として停止し、別設計に切り出す。
```

---

## 15. 書かれていない

```text
- 現時点でP8 question API / DB / RN UI / trigger / storageを作ってよい、とは書かれていない。
- 現時点でquestion text / draft question textを作ってよい、とは書かれていない。
- 現時点でP6 limited human readfeelを開始してよい、とは書かれていない。
- 現時点でR52 re-intake actual executionを実行してよい、とは書かれていない。
- 現時点でP5 confirmed finalへ昇格してよい、とは書かれていない。
- R54-AHR helper greenをactual human review completeとして扱ってよい、とは書かれていない。
- R52 handoff envelope readyをactual R52 re-intake実行済みとして扱ってよい、とは書かれていない。
- 260/83/256/169のexecution basisを、262/84/257/170のcurrent execution basisへ自動変換してよい、とは書かれていない。
- full backend suite未実行をgreen扱いしてよい、とは書かれていない。
- RN contract greenをRN実機modal確認として扱ってよい、とは書かれていない。
```

---

## 16. 推測禁止

```text
- 24-case reviewを実施済みと推測しない。
- body-full packetが生成・閲覧・削除されたと推測しない。
- rating rows / question observation rowsが実レビュー由来で成立していると推測しない。
- synthetic body-free rowsをactual review rowsへ変換しない。
- 既存AHR 260/83/256/169 basisをcurrent 262/84/257/170 evidenceへ読み替えない。
- P8 material candidate-onlyがあることをP8 start allowedへ変換しない。
- P5の弱さをP8の問い返しで補ってよいと推測しない。
- helper green / selected regression greenを商品価値合格へ変換しない。
- full backend suite未実行をgreen扱いしない。
- RN contract greenとRN実機modal確認を混同しない。
- current受領zipの差分影響を未確認のまま「影響なし」と断定しない。
```

---

## 17. 実装時の作業順サマリー

```text
1. 新規薄いwrapper helper方針で進めるか最終確認する。
2. CS00〜CS01で no-touch / current 262/84/257/170 basis を固定する。
3. CS02で既存AHR / CLR / OP / EV / R55 / R52 refsをhistorical / structural / regression refsへ分離する。
4. CS03でmanifest / packet / evidence impact assessmentを固定する。
5. CS04でcurrent 24-case manifestを再固定する。
6. CS05〜CS08でlocal-only packet / scan / reviewer selection form境界を固定する。
7. CS09〜CS14でactual review receipt / sanitized rows / rating / question observation / disposalを受ける。
8. CS15〜CS17でpost-review summary / P5 decision candidate / P6-P8 candidate-only / R52 handoffを作る。
9. CS18でfinal validation / command matrix / result memoを作る。
10. selected regressionを分割で確認する。
11. full backend suite / RN contract / RN実機modalは、実行したものだけclaimする。
12. P5 final / P6 start / P8 start / releaseはfalseのまま保持する。
```

---

## 18. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- 検討メモ上、次に進む段階はP8ではなくP7-R54-AHR Current Snapshot Actual Review Re-entryである。
- 既存AHR helperは260/83/256/169 basisを持つ。
- 今回受領基準は262/84/257/170である。
- AHR00〜AHR24 helper / tests / result memoは存在するが、actual human review completeではない。
- P8は、P7で集めたactual review由来のquestion need observation rowsを材料にしてから詳細設計へ進む方針である。
- 本書は設計書であり、コード変更・json/schema実ファイル化・body-full packet生成・actual review実行は行っていない。
```

### 未確認

```text
- 260/83/256/169と262/84/257/170の直接file diff。
- current 262/84/257/170基準のactual body-full packet generation。
- current 262/84/257/170基準のactual 24-case local-only human review。
- actual sanitized review result rows 24件。
- actual rating rows 24件。
- actual question need observation rows 24件。
- actual disposal / purge receipt。
- actual R52 re-intake execution。
- full backend suite green。
- RN contract re-run。
- RN実機modal確認。
```

### 書かれていない

```text
- P8 question機能を作ってよいとは書かれていない。
- P6を開始してよいとは書かれていない。
- P5 finalへ昇格してよいとは書かれていない。
- release判断をしてよいとは書かれていない。
- 既存AHR basisをcurrent basisへ自動変換してよいとは書かれていない。
```

### 推測禁止

```text
- 実レビュー済みと推測しない。
- helper greenをactual review completeへ変換しない。
- P8材料候補をP8開始へ変換しない。
- R52 handoff readyをR52実行済みへ変換しない。
- current差分影響を未確認のまま影響なしと断定しない。
```

### 次に実行すべきこと

```text
1. 実装段階では、新規薄いwrapper helper方式を第一候補にする。
2. CS00〜CS18の順で、current basis envelopeからfinal validationまで実装する。
3. 既存AHR helperはhistorical / structural / regression refsとして扱い、直接current evidenceへしない。
4. 実レビューを行う場合は、current 262/84/257/170 manifest / packet / selection form / disposal planを先に揃える。
5. actual review evidence complete後にだけ、R52 re-intake handoffをready候補にする。
6. P8 question design / P6 start / releaseは引き続きholdにする。
```

---

## 19. 華恋の意見

華恋としては、今回の実装方針は「既存AHRを直して前へ進む」よりも、「既存AHRを過去証跡として守り、current wrapperで今の基準を立てる」方がCocolonに合っています。

理由は、Cocolonの作業では、動くことよりも「何を見たのか」「何を見ていないのか」を曖昧にしないことが大事だからです。  
P5履歴線は、Cocolonの価値に近い分、間違えると監視感・決めつけ・過剰理解に寄ります。  
その確認を、古いbasisのまま進めると、あとでP5/P6/P8の判断が濁ります。

また、P8の問いは必要になる可能性があります。  
でも、ここで先に問いを作ると、履歴線の弱さを質問で隠してしまう危険があります。  
Cocolonとして先に見るべきなのは、「質問があれば成立するか」ではなく、「記録の線が、問いなしでもどこまで自然に返るか」です。

そのため、次の実装はcurrent basis re-entryを慎重に行い、P8はまだholdでよいと判断します。

---

## 20. 最終判断

```text
現在Phase:
  P7 Product Quality Runner / Long-run Product Gate 内。

今回設計した段階:
  P7-R54-AHR Current Snapshot Actual Review Re-entry。

推奨実装方針:
  新規薄いwrapper helper / current basis envelope方式。

進めない段階:
  P8観測補助問い詳細設計。
  P8観測補助問い実装。
  P6 limited human readfeel。
  R52 re-intake actual execution。
  P5 final。
  release readiness。

理由:
  既存AHR helper / tests は揃っているが、actual human review evidence は未成立。
  さらに current受領snapshot 262/84/257/170 と既存AHR basis 260/83/256/169 に差がある。
  そのため、P8へ進む前に、current基準でactual review evidenceを成立させる設計が必要。
```
