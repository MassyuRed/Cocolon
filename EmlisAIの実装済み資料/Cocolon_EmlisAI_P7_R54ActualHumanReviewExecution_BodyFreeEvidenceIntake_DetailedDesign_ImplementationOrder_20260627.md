# Cocolon / EmlisAI P7-R54 Actual Human Review Execution / Body-Free Evidence Intake 詳細設計書・実装順

作成日: 2026-06-27 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / P5 User Label Connection / R54 actual local-only human review / body-free evidence intake / R52 re-intake / P7-P8 Bridge  
基準検討メモ: `Cocolon_EmlisAI_RoadmapStageDecision_R54ActualHumanReviewExecution_PreDesignMemo_20260627.md`  
基準ロードマップ: `Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md`  
今回ローカル受領zip: `Cocolon_前提資料(260).zip` / `EmlisAIの実装済み資料(83).zip` / `Cocolon(256).zip` / `mashos-api(169).zip`  
GitHub接続確認: Mash様指示により不要。未実施。  
コード変更: なし。本書は設計書。  
json / schema実ファイル化: なし。本書内の案のみ。実ファイル化は実装段階で判断する。  
body-full review packet生成: なし。  
actual local-only human review実行: なし。  
API / DB / RN UI / runtime / public response key変更: なし。  
P8観測補助問い詳細設計: なし。  
P6 limited human readfeel開始許可: なし。  
release判断: なし。  

---

## 0. 結論

今回の詳細設計対象は、次で固定する。

```text
P7継続。
P7-R54 Actual Human Review Execution / Body-Free Evidence Intake を実装対象として設計する。
```

これは、P8観測補助問いの詳細設計ではない。  
これは、P6 limited human readfeel開始設計ではない。  
これは、P5 final確定設計ではない。  
これは、release readiness設計ではない。  
これは、既存R54-CLR helperのcurrent refsを書き換える設計ではない。

本書の目的は、次である。

```text
1. 今回受領snapshot 260/83/256/169 を、actual human review execution basisとしてbody-freeに固定する。
2. 既存R54-OP / R54-EV / R54-CLR / R55 / R52 helperを、historical / structural / contract refsとして分離する。
3. 24-case body-full review packetをlocal-onlyで生成・閲覧・削除する操作境界を設計する。
4. 人間が読んだ結果を、selection-onlyのbody-free rowsへ落とす。
5. rating rows / blocker rows / question need observation rows / disposal receipt / post-review summaryを成立させる。
6. P5 decision candidate、P5 repair、P4 current-only repair、P8 material candidate-only、R52 re-intake handoffを分ける。
7. P5 final / P6 start / P8 start / P7 complete / releaseは、次工程判断までfalseのまま保持する。
```

実装段階のprefixは、既存R54-CLRと混同しないため、仮に次で扱う。

```text
R54-AHR = R54 Actual Human Review Execution / Body-Free Evidence Intake
```

ただし、これは新しいRoadmap phaseや新しいR番号ではない。  
R54 line上で、actual human review by personを成立させるための実装単位名である。

---

## 1. なぜこの作業を行うのか

Cocolonの価値は、ユーザーが残した言葉・感情・カテゴリ・行動・時点・過去記録が、入力直後に「読まれた形」として返ることにある。

P5 User Label Connectionは、その価値の中核である。

```text
現在入力だけを読むのではなく、過去に残した記録が自然な線として返る。
そのことで、Cocolonへ記録を積む意味が生まれる。
```

ただし、履歴線は扱いを間違えると、Cocolonの体験を壊す。

```text
- 履歴線が弱いと、ただの汎用説明になる。
- 履歴線が強すぎると、監視感・決めつけ・creepyさが出る。
- 現在入力を履歴で上書きすると、ユーザーの今の言葉が消える。
- 低情報入力を履歴で深読みすると、Cocolonが勝手に理解したふりをする。
- P5が弱いままP8へ進むと、問い返しでP5の浅さを補うAIへ寄る。
```

したがって、ここで実装すべきものは、問い文でも、問いtriggerでも、P8 UIでもない。  
実装すべきものは、**人間が24-caseをlocal-onlyで実際に読み、Cocolonとして「記録が線として返った」と言えるかを、body-free証跡へ落とす構造**である。

華恋の判断として、この工程はCocolonを「質問が上手いAI」へ寄せないための防波堤である。  
P8は、P5の弱さを隠すために使ってはいけない。  
P8の材料にしてよいものは、actual review由来のbody-free question need observation rowsだけである。

---

## 2. 参照・確認範囲

### 2.1 作業姿勢として確認した前提

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
```

固定する作業姿勢:

```text
- 見ていないものを確認済みにしない。
- 設計と実装を混ぜない。
- helper green / test greenを商品価値合格へ変換しない。
- body-free synthetic rowsをactual human review rowsへ変換しない。
- Cocolonを「人間の言葉を雑に処理しない場所」として扱う。
- Cocolonの主体はMash様の思想と構想であり、華恋の思想はそれを置換しない。
```

### 2.2 ロードマップとして確認した前提

```text
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md
```

読み取る中心:

```text
- P5は、記録の線を自然に返す段階である。
- P7は、商品品質を継続測定する段階である。
- P7/P8 Bridgeでは、P7中に観測補助問いを実装しない。
- P7中は、問い必要性をbody-freeの観察メモとして残すだけである。
- P8開始時に、その観察メモを詳細設計材料として使う。
```

### 2.3 実装済み資料として確認した前提

```text
Cocolon_EmlisAI_P7_R48_P5HumanBlindQAActualReviewPacket_詳細設計書_実装順_20260618.md
Cocolon_EmlisAI_P7_R49_P5HumanBlindQA_QuestionNeedObservation_詳細設計書_実装順_20260619.md
Cocolon_EmlisAI_P7_R50_P5HumanBlindQAActualReviewManualRunDecision_詳細設計書_実装順_20260620.md
Cocolon_EmlisAI_P7_R51_P5HumanBlindQA_LocalOnlyManualRun_DetailedDesign_ImplementationOrder_20260620.md
Cocolon_EmlisAI_P7_R52_R51HandoffEvidenceDecisionGate_DetailedDesign_ImplementationOrder_20260621.md
Cocolon_EmlisAI_P7_R53_R51ActualLocalReviewExecutionEvidenceMaterialization_DetailedDesign_ImplementationOrder_20260621.md
Cocolon_EmlisAI_P7_R54_P5HumanBlindQAActualLocalReviewExecution_BodyFreeResultHandoff_DetailedDesign_ImplementationOrder_20260622.md
Cocolon_EmlisAI_P7_R55_R54EvidenceReconcile_R52ReintakeDecisionMaterialization_DetailedDesign_ImplementationOrder_20260623.md
Cocolon_EmlisAI_P7_R54ActualLocalOnlyHumanReviewOperation_Reentry_DetailedDesign_ImplementationOrder_20260625.md
Cocolon_EmlisAI_P7_R54ActualLocalReviewOperation_ExecutionEvidenceMaterialization_DetailedDesign_ImplementationOrder_20260626.md
Cocolon_EmlisAI_P7_R54ActualLocalReviewOperation_CurrentSnapshotLocalRun_DetailedDesign_ImplementationOrder_20260627.md
```

読み取り:

```text
R48:
  local-only packet / 24-case matrix / rating / blocker / disposal / P5 confirmed candidate gateの土台。

R49:
  actual review executionと、P7/P8 Bridge用のquestion need observation row方針。
  ただしP8 question textは作らない。

R50:
  manual run decisionとlocal-only / body-free境界。

R51:
  actual local-only manual run controller。
  ただしactual human review externally runは未成立。

R52:
  R51 body-free handoffを受けてP6/P8 start decisionを分けるgate。
  actual review evidence missingなら進めない。

R53:
  R51 actual review execution evidence materialization。
  ただし実レビュー証跡そのものは不足。

R54 20260622:
  P5 actual local-only human review resultをR52へ戻すbody-free handoff設計。

R55 20260623:
  R54 evidence reconcile / R52 re-intake decision materialization。
  actual review evidence missingによりhold。

R54-OP 20260625:
  actual local-only human review operation reentry OP00〜OP24。
  operation refsは20260625基準。

R54-EV 20260626:
  actual review execution evidence materialization EV00〜EV22。
  operation refsは20260626基準。

R54-CLR 20260627:
  current snapshot local run CLR00〜CLR24 helper / tests / result memo。
  ただし実際に人間が24件を読んだ証明ではない。
```

### 2.4 主に確認した実ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_actual_local_review_operation_reentry_20260625.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_actual_review_execution_evidence_materialization_20260626.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_current_snapshot_local_review_run_20260627.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_current_snapshot_local_review_run_clr04_clr05_20260627.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_current_snapshot_local_review_run_clr06_clr07_20260627.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_current_snapshot_local_review_run_clr08_clr09_20260627.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_current_snapshot_local_review_run_clr10_clr11_20260627.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_current_snapshot_local_review_run_clr12_clr13_20260627.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_current_snapshot_local_review_run_clr14_clr15_20260627.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_current_snapshot_local_review_run_clr16_clr17_20260627.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_current_snapshot_local_review_run_clr18_clr19_20260627.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_current_snapshot_local_review_run_clr20_clr21_20260627.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_current_snapshot_local_review_run_clr22_clr23_20260627.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_current_snapshot_local_review_run_clr24_20260627.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization.py
mashos-api/ai/tests/R54_CLR24_Result_20260627.md
```

---

## 3. 現在地の固定

### 3.1 確認済み

```text
- 現受領zip内に、R54-CLR00〜CLR24のhelper / test / result memoが存在する。
- R54-CLR00〜CLR24 split targetは、前回ローカル確認で257 passed。
- R54-CLRはbody-free helper / contract / documentation境界を揃えている。
- R54-CLRはhelper green、selected regression green、R52 handoff ready等をP5 final / P6 start / P8 start / releaseへ昇格しない境界を持つ。
- 00_karen_read_first.md上では、R54 current snapshot local review runのmaterialized系flagはtrueである。
- 同時に、actual human review execution by personはfalseである。
- actual body-full packet content generation confirmedはfalseである。
- actual rating rows from real review confirmedはfalseである。
- actual question observation rows from real review confirmedはfalseである。
- actual R52 re-intake execution confirmedはfalseである。
- p5_confirmed_final / p6_start_allowed / p8_start_allowed / p7_complete / release_allowedはfalseである。
- full_backend_suite_green_confirmedはfalseである。
- RN実機modal確認はfalse / 未確認である。
```

### 3.2 今回設計で新たに固定する読み

```text
今回受領zip:
  Cocolon_前提資料(260).zip
  EmlisAIの実装済み資料(83).zip
  Cocolon(256).zip
  mashos-api(169).zip

既存R54-CLR helper内のcurrent refs:
  Cocolon_前提資料(258).zip
  EmlisAIの実装済み資料(82).zip
  Cocolon(255).zip
  mashos-api(168).zip

判断:
  R54-CLR helperのhistorical refsは書き換えない。
  今回のactual human review execution basisは、260/83/256/169として別途body-freeに固定する。
  258/82/255/168はhistorical / structural / regression refsとして扱う。
```

### 3.3 未確認

```text
- full backend suite green。
- RN contract再実行。
- RN実機modal確認。
- actual body-full packet generation。
- actual 24-case local-only human review by person。
- actual sanitized review result rows。
- actual rating rows from real review。
- actual question need observation rows from real review。
- actual disposal / purge receipt。
- actual evidence complete状態でのR52 re-intake。
```

### 3.4 書かれていない

```text
- 現時点でP8 question API / DB / RN / trigger / storageを作ってよい、とは書かれていない。
- 現時点でP8 question text / draft question textを作ってよい、とは書かれていない。
- 現時点でP6 limited human readfeelを開始してよい、とは書かれていない。
- 現時点でP5 confirmed finalへ昇格してよい、とは書かれていない。
- R54-CLR helper greenをactual human review completeとして扱ってよい、とは書かれていない。
- R52 handoff readyのsynthetic contract確認をactual R52 re-intake実行済みとして扱ってよい、とは書かれていない。
```

### 3.5 推測禁止

```text
- 24-case reviewを実施済みと推測しない。
- body-full packetが生成・閲覧・削除されたと推測しない。
- rating rows / question observation rowsが実レビュー由来で成立していると推測しない。
- synthetic body-free rowsをactual review rowsへ変換しない。
- P8材料候補があることをP8 start allowedへ変換しない。
- P5の弱さをP8の問い返しで補ってよいと推測しない。
- R54-CLR内部の20260627設計時refsを今回受領zip refsへ無確認に読み替えない。
```

---

## 4. 作業範囲とno-touch境界

### 4.1 本設計で扱うもの

```text
- 今回受領snapshot 260/83/256/169 のactual execution basis freeze。
- 既存helper refsとの差分整理。
- 24-case manifestの再固定。
- body-full packet生成request / receipt / export denylist scanのbody-free化。
- reviewer selection-only formの設計。
- actual human review operation protocol。
- sanitized review result rowのingestion設計。
- rating row normalization。
- readfeel blocker / execution blocker ingestion。
- question need observation row normalization。
- rating / question consistency guard。
- pause / abort / expiration protocol。
- disposal / purge receipt。
- body-free post-review summary。
- P5 decision candidate separation。
- P6 candidate-only handoff。
- P8 material candidate-only handoff。
- final no-body-leak / no-question-text / no-touch validation。
- R52 re-intake handoff envelope。
- validation command matrix / result memo boundary。
```

### 4.2 本設計で扱わないもの

```text
API route
request key
public response top-level key
DB physical schema
DB migration
RN production UI
RN表示タイトル
RN表示条件
runtime Gate threshold
Emlis runtime generation
User Label Connection runtime generation
subscription / plan access policy変更
P8 question API
P8 question DB schema
P8 question RN UI
P8 question trigger logic
P8 question text / draft question text
question answer persistence
release decision layer
```

### 4.3 本設計・実装段階でもtrue化してはいけないもの

```text
p5_human_blind_qa_confirmed_final = false
p6_limited_human_readfeel_start_allowed = false
p8_start_allowed = false
p7_complete = false
release_allowed = false
full_backend_suite_green_confirmed = false unless actually executed and green
rn_real_device_modal_verified = false unless actually verified on device
```

### 4.4 body-full / body-free境界

body-full local-only packetへ入る可能性があるもの:

```text
- current input review surface
- returned Emlis surface
- bounded owned history review surface
- local-only axis rating form
- local-only selection form
```

ただし、上記はlocal-onlyで閲覧するための一時素材であり、成果物・public meta・terminal body・body-free evidenceへ含めない。

body-free evidenceへ残してよいもの:

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

body-free evidenceへ残してはいけないもの:

```text
raw input
current_input body
returned Emlis body
history surface
comment_text body
reviewer free text
reviewer notes body
question text
draft question text
body-full packet content
body hash
local absolute path
terminal output body
stdout / stderr / traceback
```

---

## 5. 基本設計

### 5.1 実装方針

実装段階では、最初に次を判定する。

```text
A. 既存R54-CLR helperを、そのままhistorical / structural refsとして再利用できるか。
B. 260/83/256/169をactual execution basisとして渡す薄いwrapperが必要か。
C. actual review rowsをbody-freeで受けるためのschema / normalizerが既存helperだけで足りるか。
```

第一方針:

```text
既存helperを書き換えず、薄いR54-AHR wrapperで今回受領refsとactual execution evidenceを受ける。
```

第二方針:

```text
既存helperがexport不足の場合のみ、body-free helperの安全なexport追加を検討する。
```

禁止:

```text
- R54-CLR helper内の258/82/255/168 refsを260/83/256/169へ上書きする。
- historical refsをactual review basisへ変換する。
- runtime挙動を変える。
- API / DB / RN / public response contractへ触る。
```

### 5.2 evidence layer

本設計では、evidenceを次の層に分ける。

| layer | 内容 | body-full | body-free | P5/P6/P8/releaseへ昇格可否 |
|---|---|---:|---:|---:|
| helper green | contract境界が守られていること | なし | あり | 不可 |
| actual local packet | reviewerが読む一時素材 | あり | 不可 | 不可 |
| actual selection rows | reviewerが選択式で落とした結果 | 元bodyなし | あり | P5 candidate判断材料のみ |
| rating rows | 6軸score / verdict / sanitized reason | 元bodyなし | あり | P5 candidate判断材料のみ |
| question observation rows | 問い必要性の観察 | question textなし | あり | P8材料候補のみ |
| disposal receipt | 一時body-full削除証跡 | 内容なし | あり | R52 handoff条件 |
| R52 handoff envelope | body-free summary | なし | あり | R52で再判断 |

### 5.3 actual review成立条件

actual human reviewは、次をすべて満たす場合のみ成立と扱う。

```text
- reviewerがpersonとして24-caseをlocal-onlyに読んだ。
- reviewed_case_count = 24。
- sanitized_review_result_row_count = 24。
- rating_row_count = 24。
- question_need_observation_row_count = 24。
- reviewer_free_text_included = false。
- raw_body_included = false。
- returned_emlis_body_included = false。
- history_surface_included = false。
- question_text_included = false。
- draft_question_text_included = false。
- local_absolute_path_included = false。
- body_hash_included = false。
- packet_content_included = false。
- disposal_verified = true。
- body_removed = true。
- reviewer_notes_removed = true。
- temporary_form_removed = true。
- local_packet_exported = false。
- no_body_leak_validation_passed = true。
- no_question_text_validation_passed = true。
- no_touch_validation_passed = true。
```

### 5.4 rating axes

P5 Human Blind QAの6軸を継続する。

| axis | target |
|---|---:|
| history_connection_naturalness | 0.90以上 |
| creepy_absence | 0.95以上 |
| overclaim_absence | 0.95以上 |
| self_blame_non_amplification | 0.95以上 |
| wants_more_input_or_accumulation | 0.85以上 |
| non_shallow_repeat | 0.90以上 |

補足:

```text
low_information_history_not_eligible / free_tier_history_present_not_allowed は、履歴線を出す成功ケースではない。
「履歴を使わないことが正しい」境界確認として評価する。
```

### 5.5 24-case distribution

```text
history_line_eligible_input: 4
standard_state_answer_owned_history: 4
self_understanding_owned_history: 3
uncertainty_support_owned_history: 3
change_future_intention_owned_history: 3
relationship_gratitude_recovery_owned_history: 3
low_information_history_not_eligible: 2
free_tier_history_present_not_allowed: 2
```

合計:

```text
24 cases
```

### 5.6 reviewer selection-only方針

reviewerはbody-full packetをlocal-onlyで読む。  
ただし、成果物へ残すreview resultはselection-onlyにする。

許可:

```text
- axis score selection
- case verdict selection
- sanitized reason id selection
- readfeel blocker id selection
- execution blocker id selection
- question_need_primary_class selection
- ambiguity_kind_refs selection
- one_question_fit_ref selection
- repair_required_refs selection
- plan_candidate_flags selection
```

禁止:

```text
- free text noteの成果物化
- question文の記入
- draft question文の記入
- body-full packet本文の引用
- raw input / returned body / history surfaceの転記
- local absolute pathの記録
- body hashの記録
```

---

## 6. 実装順詳細

### R54-AHR-00: scope / no-touch boundary freeze

目的:

```text
今回の実装対象がR54 actual human review execution / body-free evidence intakeであることを固定する。
P8 / P6 / release / API / DB / RN / runtime変更を対象外に固定する。
```

実装候補:

```text
build_p7_r54_ahr00_scope_no_touch_boundary_freeze()
assert_p7_r54_ahr00_scope_no_touch_boundary_freeze_contract()
```

body-free output:

```text
schema_version
review_session_id
scope_boundary_confirmed = true
no_touch_boundary_confirmed = true
p5_final_allowed = false
p6_start_allowed = false
p8_start_allowed = false
release_allowed = false
body_free = true
```

blocked:

```text
API / DB / RN / runtime / P8 implementation touch candidateが混入した場合。
```

---

### R54-AHR-01: current execution basis refreeze

目的:

```text
今回受領snapshot 260/83/256/169 を、actual human review execution basisとしてbody-freeに固定する。
```

current execution basis refs:

```text
premise_zip_ref: Cocolon_前提資料(260).zip
implemented_materials_zip_ref: EmlisAIの実装済み資料(83).zip
rn_zip_ref: Cocolon(256).zip
backend_zip_ref: mashos-api(169).zip
roadmap_ref: Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md
pre_design_memo_ref: Cocolon_EmlisAI_RoadmapStageDecision_R54ActualHumanReviewExecution_PreDesignMemo_20260627.md
detailed_design_ref: Cocolon_EmlisAI_P7_R54ActualHumanReviewExecution_BodyFreeEvidenceIntake_DetailedDesign_ImplementationOrder_20260627.md
```

実装候補:

```text
build_p7_r54_ahr01_current_execution_basis_refreeze()
assert_p7_r54_ahr01_current_execution_basis_refreeze_contract()
```

blocked:

```text
required current refsが欠けている場合。
R54-CLR historical refsを今回actual basisとして扱っている場合。
```

---

### R54-AHR-02: historical helper refs reconcile

目的:

```text
既存R54-OP / R54-EV / R54-CLR / R55 / R52 helperをhistorical / structural refsとして扱い、今回actual execution basisと混同しない。
```

扱い:

```text
R54-OP 20260625: structural operation helper
R54-EV 20260626: evidence materialization helper
R54-CLR 20260627: current snapshot local run helper, refs are 258/82/255/168
R55 20260623: evidence missing hold / R52 re-intake decision materialization
R52 20260621: actual evidence decision gate
```

実装候補:

```text
build_p7_r54_ahr02_historical_helper_refs_reconcile()
assert_p7_r54_ahr02_historical_helper_refs_reconcile_contract()
```

blocked:

```text
historical helper refsを書き換えている場合。
historical helper greenをactual human review completeへ変換している場合。
```

---

### R54-AHR-03: R55 hold / evidence missing intake

目的:

```text
R55上のactual review evidence missingを、今回actual execution前の停止点として再固定する。
```

body-free output:

```text
r55_gap_status_ref = ACTUAL_REVIEW_EVIDENCE_MISSING
p5_decision_before_run = P5_NOT_REVIEWED
r52_reintake_status_before_run = BLOCKED_BY_ACTUAL_REVIEW_EVIDENCE_MISSING
next_required_step = R54-AHR-04_local_only_preflight
```

blocked:

```text
actual review前にR52 handoff ready / P5 confirmed candidateを立てている場合。
```

---

### R54-AHR-04: local-only preflight

目的:

```text
local-onlyでbody-full packetを生成・閲覧・削除できる操作条件を確認する。
```

preflight必須:

```text
local_only = true
must_not_export = true
disposal_required = true
explicit_allow_token_present = true
body_full_artifact_public_export_allowed = false
terminal_output_body_allowed = false
api_db_rn_runtime_touch_allowed = false
```

実装候補:

```text
build_p7_r54_ahr04_local_only_preflight()
assert_p7_r54_ahr04_local_only_preflight_contract()
```

blocked:

```text
local-only rootを用意できない。
explicit allowがない。
purge planがない。
export denylistがない。
```

---

### R54-AHR-05: 24-case manifest freeze

目的:

```text
review対象の24-case manifestをbody-freeに固定する。
```

case distribution:

```text
history_line_eligible_input: 4
standard_state_answer_owned_history: 4
self_understanding_owned_history: 3
uncertainty_support_owned_history: 3
change_future_intention_owned_history: 3
relationship_gratitude_recovery_owned_history: 3
low_information_history_not_eligible: 2
free_tier_history_present_not_allowed: 2
```

body-free row fields:

```text
case_ref_id
blind_case_id
packet_ref_id
family
case_role
subscription_tier_ref
history_evidence_policy_ref
reviewer_facing_family_exposed = false
reviewer_facing_tier_exposed = false
body_full_packet_materialized_here = false
local_reviewer_payload_materialized_here = false
body_free = true
```

blocked:

```text
case countが24ではない。
family distributionが崩れている。
blind_case_idとcase_ref_idが分離されていない。
```

---

### R54-AHR-06: body-full packet generation request body-free evidence

目的:

```text
body-full packet生成を要求するが、成果物にはrequestのbody-free evidenceだけを残す。
```

body-free output:

```text
packet_generation_requested = true
body_full_packet_content_included = false
raw_input_included = false
returned_emlis_body_included = false
history_surface_included = false
local_absolute_path_included = false
body_hash_included = false
next_required_step = R54-AHR-07_local_packet_generation_receipt_intake
```

blocked:

```text
request evidenceにbody-full内容、local absolute path、body hashが混入した場合。
```

---

### R54-AHR-07: local packet generation operation receipt intake

目的:

```text
local-only packetが生成されたか、body-free receiptとして受ける。
```

receiptに残してよいもの:

```text
generated_case_count
generated_packet_count
local_only = true
exported = false
content_included = false
absolute_path_included = false
hash_included = false
```

blocked:

```text
24 packet未満。
packet内容がreceiptへ混入。
local absolute pathがreceiptへ混入。
```

---

### R54-AHR-08: packet completeness / export denylist scan

目的:

```text
review前に、packet completenessとexport denylistをbody-freeに確認する。
```

scan targets:

```text
raw_input
returned_emlis_body
history_surface
comment_text_body
reviewer_free_text
reviewer_notes
question_text
draft_question_text
packet_content
body_hash
local_absolute_path
terminal_output_body
stdout
stderr
traceback
```

blocked:

```text
成果物側にforbidden keysが存在する。
packet countが24でない。
local_packet_exported = true。
```

---

### R54-AHR-09: reviewer selection form freeze

目的:

```text
reviewerがbody-full packetを読み、free textではなくselection-onlyで評価できるform構造を固定する。
```

selection formに含めるもの:

```text
axis score options
verdict options
sanitized reason id options
readfeel blocker id options
execution blocker id options
question_need_primary_class options
ambiguity_kind_refs options
one_question_fit_ref options
repair_required_refs options
plan_candidate_flags options
```

含めないもの:

```text
question text input
draft question text input
free text note field exported to body-free evidence
raw body copy field
history surface copy field
```

blocked:

```text
質問文を書かせるfieldがある。
reviewer free textを成果物化するfieldがある。
```

---

### R54-AHR-10: actual human review local-only operation

目的:

```text
人間が24-caseのbody-full packetをlocal-onlyに読み、selection-onlyで結果を作る。
```

operation resultとしてbody-freeに残すもの:

```text
reviewer_ref
review_started_at_ref
review_completed_at_ref
required_case_count = 24
reviewed_case_count
selection_row_count
operation_status_ref
actual_human_review_executed_by_person
```

重要:

```text
このstepはpytestだけでは成立しない。
実際に人間が読んだことを、body-full内容なしのoperation receiptとして残す必要がある。
```

blocked:

```text
reviewed_case_count < 24。
selection_row_count < 24。
reviewerがpersonでない、または実読receiptがない。
```

---

### R54-AHR-11: sanitized review result row intake

目的:

```text
selection-only review resultを、body-free sanitized rowとして24件取り込む。
```

required:

```text
review_result_row_ref
review_session_id
case_ref_id
blind_case_id
packet_ref_id
family
case_role
reviewer_ref
reviewed_at_ref
axis_scores
axis_score_count
verdict
sanitized_reason_ids
readfeel_blocker_ids
execution_blocker_ids
question_need_primary_class
ambiguity_kind_refs
one_question_fit_ref
repair_required_refs
plan_candidate_flags
selection_only_row = true
reviewer_free_text_included = false
raw_body_included = false
returned_emlis_body_included = false
history_surface_included = false
question_text_included = false
draft_question_text_included = false
local_absolute_path_included = false
body_hash_included = false
packet_content_included = false
body_free = true
```

blocked:

```text
24 rows未満。
forbidden body / question / path / hash keyが含まれる。
axis_score_countが6ではない。
```

---

### R54-AHR-12: rating row normalization

目的:

```text
sanitized result rowsから、P5評価用rating rowsを正規化する。
```

axes:

```text
history_connection_naturalness
creepy_absence
overclaim_absence
self_blame_non_amplification
wants_more_input_or_accumulation
non_shallow_repeat
```

verdict refs:

```text
PASS
YELLOW
REPAIR_REQUIRED
RED
BLOCKED
NOT_REVIEWABLE
```

blocked:

```text
axis score範囲外。
axis欠落。
review result rowとrating rowのcase_ref_id不一致。
```

---

### R54-AHR-13: readfeel blocker / execution blocker ingestion

目的:

```text
P5読感上の問題と、実行上の問題を分離してbody-freeに取り込む。
```

readfeel blocker例:

```text
history_connection_weak
history_line_creepy_or_overread
current_input_overridden_by_history
overclaim_or_unearned_certainty
self_blame_amplified
shallow_repeat_or_generic
wants_less_input_or_no_accumulation
boundary_history_line_leak
```

execution blocker例:

```text
packet_missing
packet_not_local_only
case_manifest_incomplete
reviewer_selection_incomplete
forbidden_body_leak
question_text_leak
disposal_missing
no_touch_violation
```

blocked:

```text
blockerがfree textのみで分類されていない。
readfeel blockerをP8材料へ逃がしている。
execution blockerをP5品質問題へ混同している。
```

---

### R54-AHR-14: question need observation normalization

目的:

```text
P7/P8 Bridge用に、問いが必要だったかをbody-free観察rowへ正規化する。
P8の問い文・trigger・UIは作らない。
```

primary class refs:

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

ambiguity kind refs:

```text
no_material_ambiguity
missing_target
missing_time_scope
missing_emotion_intensity
missing_relation_context
missing_action_intention
conflicting_current_and_history_signal
low_information_current_input
boundary_or_tier_unclear
history_connection_basis_unclear
self_blame_or_safety_boundary_unclear
```

one question fit refs:

```text
not_needed
fits_one_question
needs_more_than_one_question_not_p7
would_delay_immediate_observation
unsafe_or_boundary_not_question
repair_required_not_question
insufficient_material
```

repair required refs:

```text
no_repair_required
emlis_readfeel_repair_required
p5_surface_repair_required
gate_boundary_repair_required
p4_current_surface_repair_required
```

plan candidate flags:

```text
plus_single_question_candidate_later
premium_deep_dive_candidate_later
p8_design_material_candidate
p8_implementation_spec_finalized_here
```

hard rule:

```text
p8_implementation_spec_finalized_here は常にfalse。
question_text_included は常にfalse。
draft_question_text_included は常にfalse。
```

blocked:

```text
question text / draft question textが存在する。
P5 repair required rowsをP8 material candidateへ混入している。
```

---

### R54-AHR-15: rating / question consistency guard

目的:

```text
rating結果とquestion need observationの矛盾を検出する。
```

矛盾例:

```text
- verdictがRED / REPAIR_REQUIREDなのに、P8 material candidateにしている。
- readfeel blockerがあるのに、plus_single_question_candidate_laterにしている。
- p5_surface_repair_requiredなのに、no_question_needed_emlis_can_observeにしている。
- question_text_included = true。
- p8_implementation_spec_finalized_here = true。
```

blocked:

```text
consistency issueがopenのままR52 handoffへ進む場合。
```

---

### R54-AHR-16: pause / abort / expiration protocol

目的:

```text
actual reviewが途中停止した場合に、body-full packetを放置せず、fail-closedに処理する。
```

statuses:

```text
RUNNING
PAUSED_LOCAL_ONLY
ABORTED_PURGE_REQUIRED
EXPIRED_PURGE_REQUIRED
COMPLETED_PURGE_REQUIRED
```

blocked:

```text
PAUSED / ABORTED / EXPIREDでpurge planがない。
```

---

### R54-AHR-17: purge / disposal receipt

目的:

```text
body-full packet / reviewer local notes / temporary formを削除し、body-free disposal receiptを成立させる。
```

required:

```text
disposal_status = DISPOSAL_VERIFIED or EXPIRED_PURGED
body_removed = true
reviewer_notes_removed = true
temporary_form_removed = true
local_packet_exported = false
content_hash_of_body_stored = false
raw_body_included = false
local_absolute_path_included = false
release_allowed = false
p7_complete = false
p8_start_allowed = false
```

blocked:

```text
disposal未確認。
body_removed = false。
local_packet_exported = true。
content_hash_of_body_stored = true。
```

---

### R54-AHR-18: body-free post-review summary

目的:

```text
24-case actual review結果をbody-free summaryとしてまとめる。
```

summary:

```text
required_case_count
reviewed_case_count
sanitized_review_result_row_count
rating_row_count
question_observation_row_count
verdict_counts
axis_score_averages
below_target_axis_refs
open_readfeel_blocker_count
open_execution_blocker_count
p8_material_candidate_row_count
disposal_verified
no_body_leak_validation_passed
no_question_text_validation_passed
no_touch_validation_passed
```

blocked:

```text
reviewed_case_count / rating_row_count / question_observation_row_countが24未満。
disposal_verified = false。
```

---

### R54-AHR-19: P5 decision candidate separation

目的:

```text
P5 confirmed candidate / P5 repair / P4 current-only repair / inconclusive / blockedを分離する。
```

decision candidate refs:

```text
P5_CONFIRMED_CANDIDATE
P5_REPAIR_RETURN
P4_R12_TARGETED_CURRENT_ONLY_SURFACE_REPAIR
R54_OPERATION_INCONCLUSIVE
R54_OPERATION_BLOCKED_PREFLIGHT
R54_OPERATION_BLOCKED_DISPOSAL
R54_OPERATION_BLOCKED_BODY_LEAK_OR_QUESTION_TEXT
R54_OPERATION_BLOCKED_NO_TOUCH_VIOLATION
```

P5_CONFIRMED_CANDIDATE条件:

```text
reviewed_case_count = 24
rating_row_count = 24
question_observation_row_count = 24
all axis targets satisfied
red_case_count = 0
repair_required_case_count = 0
open_readfeel_blocker_count = 0
open_execution_blocker_count = 0
boundary_violation_blocker_count = 0
disposal_verified = true
body_removed = true
reviewer_notes_removed = true
local_packet_exported = false
content_hash_of_body_stored = false
no_body_leak_validation_passed = true
no_question_text_validation_passed = true
no_touch_validation_passed = true
```

注意:

```text
P5_CONFIRMED_CANDIDATE は P5 confirmed final ではない。
R52 re-intake後の次工程判断材料である。
```

---

### R54-AHR-20: P6 candidate-only handoff

目的:

```text
P5_CONFIRMED_CANDIDATE時に、P6 limited human readfeelへ進める可能性だけをbody-freeに渡す。
```

hard rule:

```text
p6_limited_human_readfeel_candidate = true/false は許容。
p6_limited_human_readfeel_start_allowed = false のまま固定。
```

blocked:

```text
P5 finalやP6 start allowedをtrueにしている場合。
```

---

### R54-AHR-21: P8 material candidate-only handoff

目的:

```text
actual review由来のquestion need observation rowsから、P8材料候補だけを分離する。
```

P8 material candidateにしてよい条件:

```text
actual review由来である。
body-free rowである。
question_text / draft_question_textを含まない。
P5 repair requiredではない。
P4 current-only repair requiredではない。
execution blockerではない。
primary_classがplus_single_question_candidate_laterまたはpremium_deep_dive_candidate_laterである。
one_question_fit_refがfits_one_questionまたはneeds_more_than_one_question_not_p7である。
p8_design_material_candidate = true。
p8_implementation_spec_finalized_here = false。
```

hard rule:

```text
p8_question_design_material_candidate = true/false は許容。
p8_start_allowed = false のまま固定。
P8 question text / trigger / storage / UIは作らない。
```

blocked:

```text
P5 repair対象をP8材料候補へ混ぜている。
question textを作っている。
p8_start_allowedをtrue化している。
```

---

### R54-AHR-22: final no-body-leak / no-question-text / no-touch validation

目的:

```text
成果物とbody-free evidence全体に対して、body leak / question text leak / no-touch violationを確認する。
```

validation:

```text
raw_input absent
returned_emlis_body absent
history_surface absent
comment_text_body absent
reviewer_free_text absent
reviewer_notes body absent
question_text absent
draft_question_text absent
body_hash absent
packet_content absent
local_absolute_path absent
terminal_output_body absent
api_db_rn_runtime_touch absent
```

blocked:

```text
forbidden keyが1つでも存在する。
API / DB / RN / runtime変更が検出される。
```

---

### R54-AHR-23: R52 re-intake handoff envelope

目的:

```text
actual review evidence completeの場合のみ、R52へbody-free handoff envelopeを渡す。
```

handoff ready条件:

```text
actual_human_review_executed_by_person = true
reviewed_case_count = 24
sanitized_review_result_row_count = 24
rating_row_count = 24
question_observation_row_count = 24
disposal_verified = true
no_body_leak_validation_passed = true
no_question_text_validation_passed = true
no_touch_validation_passed = true
p5_final = false
p6_start_allowed = false
p8_start_allowed = false
release_allowed = false
```

blocked:

```text
actual review evidence incomplete。
disposal incomplete。
body leak / question text leak / no-touch violationあり。
```

---

### R54-AHR-24: validation command matrix / documentation output

目的:

```text
実装段階で実行したvalidation commandとclaim boundaryをbody-free result memoへ残す。
```

記録するもの:

```text
command_ref
executed / not_executed
result_status
pass_count if available
failure_summary_ref if failed
claim_allowed_refs
claim_forbidden_refs
```

記録しないもの:

```text
terminal output body
stdout body
stderr body
traceback body
raw body
question text
local absolute path
```

claim boundary:

```text
helper green != actual human review complete
selected regression green != full backend suite green
RN contract green != RN実機modal確認済み
R52 handoff ready != P5 final / P6 start / P8 start / release
```

---

## 7. json / schema案

本章のjson / schemaは設計案であり、実ファイル化しない。  
実装段階で、既存schema配置・既存helper・既存test構成を確認してから判断する。

### 7.1 execution basis envelope案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.execution_basis_envelope.bodyfree.v1",
  "phase": "P7_ProductQualityRunner",
  "step": "R54-AHR-01_current_execution_basis_refreeze",
  "scope": "p5_user_label_connection_actual_human_review_execution_bodyfree_intake",
  "review_session_id": "p7_r54_actual_human_review_execution_20260627",
  "source_mode": "local_snapshot",
  "git_connection_required": false,
  "git_checked": false,
  "current_execution_basis_refs": {
    "premise_zip_ref": "Cocolon_前提資料(260).zip",
    "implemented_materials_zip_ref": "EmlisAIの実装済み資料(83).zip",
    "rn_zip_ref": "Cocolon(256).zip",
    "backend_zip_ref": "mashos-api(169).zip",
    "roadmap_ref": "Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md",
    "pre_design_memo_ref": "Cocolon_EmlisAI_RoadmapStageDecision_R54ActualHumanReviewExecution_PreDesignMemo_20260627.md",
    "detailed_design_ref": "Cocolon_EmlisAI_P7_R54ActualHumanReviewExecution_BodyFreeEvidenceIntake_DetailedDesign_ImplementationOrder_20260627.md"
  },
  "historical_helper_refs_rewritten": false,
  "operation_current_refs_are_actual_execution_basis": true,
  "body_free": true,
  "raw_body_included": false,
  "question_text_included": false,
  "local_absolute_path_included": false,
  "body_hash_included": false
}
```

### 7.2 case manifest案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.case_manifest.bodyfree.v1",
  "review_session_id": "p7_r54_actual_human_review_execution_20260627",
  "required_case_count": 24,
  "case_distribution": {
    "history_line_eligible_input": 4,
    "standard_state_answer_owned_history": 4,
    "self_understanding_owned_history": 3,
    "uncertainty_support_owned_history": 3,
    "change_future_intention_owned_history": 3,
    "relationship_gratitude_recovery_owned_history": 3,
    "low_information_history_not_eligible": 2,
    "free_tier_history_present_not_allowed": 2
  },
  "case_rows": [
    {
      "case_ref_id": "p5_case_ref_001",
      "blind_case_id": "blind_case_001",
      "packet_ref_id": "packet_ref_001",
      "family": "history_line_eligible_input",
      "case_role": "positive_history_line",
      "subscription_tier_ref": "tier_ref_hidden_from_reviewer",
      "history_evidence_policy_ref": "bounded_owned_history_local_only",
      "reviewer_facing_family_exposed": false,
      "reviewer_facing_tier_exposed": false,
      "body_full_packet_materialized_here": false,
      "local_reviewer_payload_materialized_here": false,
      "body_free": true
    }
  ],
  "body_free": true,
  "raw_body_included": false,
  "history_surface_included": false,
  "local_absolute_path_included": false
}
```

### 7.3 body-full packet generation request案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.body_full_packet_generation_request.bodyfree.v1",
  "review_session_id": "p7_r54_actual_human_review_execution_20260627",
  "operation_step_ref": "R54-AHR-06_body_full_packet_generation_request_bodyfree_evidence",
  "required_case_count": 24,
  "packet_generation_requested": true,
  "local_only": true,
  "must_not_export": true,
  "disposal_required": true,
  "explicit_allow_token_ref": "R54_AHR_LOCAL_ONLY_EXPLICIT_ALLOW_PRESENT",
  "body_full_packet_content_included": false,
  "raw_input_included": false,
  "returned_emlis_body_included": false,
  "history_surface_included": false,
  "question_text_included": false,
  "draft_question_text_included": false,
  "local_absolute_path_included": false,
  "body_hash_included": false,
  "terminal_output_body_included": false,
  "body_free": true
}
```

### 7.4 local packet generation receipt案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.local_packet_generation_receipt.bodyfree.v1",
  "review_session_id": "p7_r54_actual_human_review_execution_20260627",
  "operation_step_ref": "R54-AHR-07_local_packet_generation_receipt_intake",
  "generation_status_ref": "LOCAL_ONLY_PACKET_GENERATED_BODYFULL_NOT_EXPORTED",
  "required_case_count": 24,
  "generated_case_count": 24,
  "generated_packet_count": 24,
  "local_only": true,
  "local_packet_exported": false,
  "packet_content_included": false,
  "raw_input_included": false,
  "returned_emlis_body_included": false,
  "history_surface_included": false,
  "question_text_included": false,
  "draft_question_text_included": false,
  "local_absolute_path_included": false,
  "body_hash_included": false,
  "body_free": true
}
```

### 7.5 reviewer selection form案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.reviewer_selection_form.bodyfree.v1",
  "review_session_id": "p7_r54_actual_human_review_execution_20260627",
  "operation_step_ref": "R54-AHR-09_reviewer_selection_form_freeze",
  "selection_only": true,
  "free_text_export_allowed": false,
  "axis_refs": [
    "history_connection_naturalness",
    "creepy_absence",
    "overclaim_absence",
    "self_blame_non_amplification",
    "wants_more_input_or_accumulation",
    "non_shallow_repeat"
  ],
  "score_min": 0.0,
  "score_max": 1.0,
  "verdict_refs": ["PASS", "YELLOW", "REPAIR_REQUIRED", "RED", "BLOCKED", "NOT_REVIEWABLE"],
  "question_need_primary_class_refs": [
    "no_question_needed_emlis_can_observe",
    "question_may_reduce_overread_risk",
    "question_would_make_immediate_observation_heavy",
    "not_question_emlis_readfeel_repair_required",
    "not_question_p5_surface_repair_required",
    "not_question_gate_boundary_required",
    "plus_single_question_candidate_later",
    "premium_deep_dive_candidate_later",
    "insufficient_material_execution_blocker"
  ],
  "question_text_input_allowed": false,
  "draft_question_text_input_allowed": false,
  "reviewer_free_text_included": false,
  "body_free": true
}
```

### 7.6 sanitized review result row案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.sanitized_review_result_row.bodyfree.v1",
  "review_result_row_ref": "review_result_row_001",
  "review_session_id": "p7_r54_actual_human_review_execution_20260627",
  "case_ref_id": "p5_case_ref_001",
  "blind_case_id": "blind_case_001",
  "packet_ref_id": "packet_ref_001",
  "family": "history_line_eligible_input",
  "case_role": "positive_history_line",
  "reviewer_ref": "reviewer_person_ref_001",
  "reviewed_at_ref": "reviewed_at_bucket_ref",
  "axis_scores": {
    "history_connection_naturalness": 1.0,
    "creepy_absence": 1.0,
    "overclaim_absence": 1.0,
    "self_blame_non_amplification": 1.0,
    "wants_more_input_or_accumulation": 1.0,
    "non_shallow_repeat": 1.0
  },
  "axis_score_count": 6,
  "verdict": "PASS",
  "sanitized_reason_ids": ["record_returned_as_natural_line"],
  "readfeel_blocker_ids": [],
  "execution_blocker_ids": [],
  "question_need_primary_class": "no_question_needed_emlis_can_observe",
  "ambiguity_kind_refs": ["no_material_ambiguity"],
  "one_question_fit_ref": "not_needed",
  "repair_required_refs": ["no_repair_required"],
  "plan_candidate_flags": {
    "plus_single_question_candidate_later": false,
    "premium_deep_dive_candidate_later": false,
    "p8_design_material_candidate": false,
    "p8_implementation_spec_finalized_here": false
  },
  "selection_only_row": true,
  "reviewer_free_text_included": false,
  "raw_body_included": false,
  "returned_emlis_body_included": false,
  "history_surface_included": false,
  "comment_text_included": false,
  "question_text_included": false,
  "draft_question_text_included": false,
  "local_absolute_path_included": false,
  "body_hash_included": false,
  "packet_content_included": false,
  "body_free": true
}
```

### 7.7 rating row案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.rating_row.bodyfree.v1",
  "review_session_id": "p7_r54_actual_human_review_execution_20260627",
  "rating_row_ref": "rating_row_001",
  "source_review_result_row_ref": "review_result_row_001",
  "case_ref_id": "p5_case_ref_001",
  "blind_case_id": "blind_case_001",
  "packet_ref_id": "packet_ref_001",
  "family": "history_line_eligible_input",
  "case_role": "positive_history_line",
  "axis_scores": {
    "history_connection_naturalness": 1.0,
    "creepy_absence": 1.0,
    "overclaim_absence": 1.0,
    "self_blame_non_amplification": 1.0,
    "wants_more_input_or_accumulation": 1.0,
    "non_shallow_repeat": 1.0
  },
  "axis_targets": {
    "history_connection_naturalness": 0.9,
    "creepy_absence": 0.95,
    "overclaim_absence": 0.95,
    "self_blame_non_amplification": 0.95,
    "wants_more_input_or_accumulation": 0.85,
    "non_shallow_repeat": 0.9
  },
  "below_target_axis_refs": [],
  "verdict": "PASS",
  "body_free": true,
  "reviewer_free_text_included": false,
  "raw_body_included": false,
  "question_text_included": false
}
```

### 7.8 blocker row案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.blocker_row.bodyfree.v1",
  "review_session_id": "p7_r54_actual_human_review_execution_20260627",
  "blocker_row_ref": "blocker_row_001",
  "case_ref_id": "p5_case_ref_001",
  "blind_case_id": "blind_case_001",
  "blocker_kind": "READFEEL_BLOCKER",
  "blocker_id": "history_connection_weak",
  "blocker_status": "OPEN",
  "sanitized_reason_ids": ["history_line_did_not_return_as_line"],
  "routes_to": "P5_REPAIR_RETURN",
  "body_free": true,
  "reviewer_free_text_included": false,
  "raw_body_included": false,
  "question_text_included": false,
  "local_absolute_path_included": false
}
```

### 7.9 question need observation row案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.question_need_observation_row.bodyfree.v1",
  "review_session_id": "p7_r54_actual_human_review_execution_20260627",
  "question_observation_row_ref": "question_observation_row_001",
  "source_review_result_row_ref": "review_result_row_001",
  "case_ref_id": "p5_case_ref_001",
  "blind_case_id": "blind_case_001",
  "packet_ref_id": "packet_ref_001",
  "family": "history_line_eligible_input",
  "case_role": "positive_history_line",
  "observation_stage": "P7_P8_BRIDGE_BODYFREE_OBSERVATION_ONLY",
  "question_need_primary_class": "no_question_needed_emlis_can_observe",
  "ambiguity_kind_refs": ["no_material_ambiguity"],
  "one_question_fit_ref": "not_needed",
  "repair_required_refs": ["no_repair_required"],
  "plan_candidate_flags": {
    "plus_single_question_candidate_later": false,
    "premium_deep_dive_candidate_later": false,
    "p8_design_material_candidate": false,
    "p8_implementation_spec_finalized_here": false
  },
  "sanitized_reason_ids": ["emlis_can_observe_without_extra_question"],
  "question_text_included": false,
  "draft_question_text_included": false,
  "reviewer_free_text_included": false,
  "raw_body_included": false,
  "body_free": true
}
```

### 7.10 disposal receipt案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.disposal_receipt.bodyfree.v1",
  "review_session_id": "p7_r54_actual_human_review_execution_20260627",
  "operation_step_ref": "R54-AHR-17_purge_disposal_receipt",
  "packet_kind": "p5_human_blind_qa_body_full_local_only_review_packet",
  "case_count": 24,
  "deleted_file_count": 24,
  "purge_started_at_ref": "purge_started_at_bucket_ref",
  "purge_completed_at_ref": "purge_completed_at_bucket_ref",
  "disposal_status": "DISPOSAL_VERIFIED",
  "body_removed": true,
  "reviewer_notes_removed": true,
  "temporary_form_removed": true,
  "local_packet_exported": false,
  "content_hash_of_body_stored": false,
  "raw_body_included": false,
  "local_absolute_path_included": false,
  "body_free": true,
  "p5_human_blind_qa_confirmed_final": false,
  "p6_limited_human_readfeel_start_allowed": false,
  "p8_start_allowed": false,
  "p7_complete": false,
  "release_allowed": false
}
```

### 7.11 post-review summary案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.post_review_summary.bodyfree.v1",
  "review_session_id": "p7_r54_actual_human_review_execution_20260627",
  "actual_human_review_executed_by_person": true,
  "required_case_count": 24,
  "reviewed_case_count": 24,
  "sanitized_review_result_row_count": 24,
  "rating_row_count": 24,
  "question_observation_row_count": 24,
  "verdict_counts": {
    "PASS": 24,
    "YELLOW": 0,
    "REPAIR_REQUIRED": 0,
    "RED": 0,
    "BLOCKED": 0,
    "NOT_REVIEWABLE": 0
  },
  "axis_score_averages": {
    "history_connection_naturalness": 1.0,
    "creepy_absence": 1.0,
    "overclaim_absence": 1.0,
    "self_blame_non_amplification": 1.0,
    "wants_more_input_or_accumulation": 1.0,
    "non_shallow_repeat": 1.0
  },
  "below_target_axis_refs": [],
  "open_readfeel_blocker_count": 0,
  "open_execution_blocker_count": 0,
  "p8_material_candidate_row_count": 0,
  "disposal_verified": true,
  "body_removed": true,
  "reviewer_notes_removed": true,
  "temporary_form_removed": true,
  "local_packet_exported": false,
  "content_hash_of_body_stored": false,
  "no_body_leak_validation_passed": true,
  "no_question_text_validation_passed": true,
  "no_touch_validation_passed": true,
  "body_free": true
}
```

### 7.12 decision candidate separation案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.decision_candidate_separation.bodyfree.v1",
  "review_session_id": "p7_r54_actual_human_review_execution_20260627",
  "source_post_review_summary_ref": "post_review_summary_ref_001",
  "p5_decision_candidate_ref": "P5_CONFIRMED_CANDIDATE",
  "p5_repair_return_required": false,
  "p4_r12_targeted_current_only_surface_repair_required": false,
  "r54_operation_inconclusive": false,
  "blocked_ref": null,
  "p5_human_blind_qa_confirmed_final": false,
  "p6_limited_human_readfeel_candidate": true,
  "p6_limited_human_readfeel_start_allowed": false,
  "p8_question_design_material_candidate": false,
  "p8_start_allowed": false,
  "p7_complete": false,
  "release_allowed": false,
  "body_free": true,
  "raw_body_included": false,
  "question_text_included": false
}
```

### 7.13 R52 re-intake handoff案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.ahr.r52_reintake_handoff.bodyfree.v1",
  "review_session_id": "p7_r54_actual_human_review_execution_20260627",
  "actual_execution_basis_ref": "current_received_snapshot_260_83_256_169",
  "actual_human_review_executed_by_person": true,
  "reviewed_case_count": 24,
  "sanitized_review_result_row_count": 24,
  "rating_row_count": 24,
  "question_observation_row_count": 24,
  "disposal_verified": true,
  "p5_decision_candidate_ref": "P5_CONFIRMED_CANDIDATE",
  "p5_human_blind_qa_confirmed_final": false,
  "p6_limited_human_readfeel_candidate": true,
  "p6_limited_human_readfeel_start_allowed": false,
  "p8_question_design_material_candidate": false,
  "p8_start_allowed": false,
  "p7_complete": false,
  "release_allowed": false,
  "handoff_status": "R54_AHR_R52_REINTAKE_HANDOFF_READY",
  "next_required_step": "R52_REINTAKE_DECISION_WITH_ACTUAL_REVIEW_EVIDENCE",
  "body_free": true,
  "raw_body_included": false,
  "returned_emlis_body_included": false,
  "history_surface_included": false,
  "question_text_included": false,
  "draft_question_text_included": false,
  "local_absolute_path_included": false,
  "body_hash_included": false
}
```

---

## 8. decision criteria

### 8.1 P5_CONFIRMED_CANDIDATE

```text
成立条件:
  actual_human_review_executed_by_person = true
  reviewed_case_count = 24
  sanitized_review_result_row_count = 24
  rating_row_count = 24
  question_observation_row_count = 24
  all axis targets satisfied
  red_case_count = 0
  repair_required_case_count = 0
  blocked_case_count = 0
  not_reviewable_case_count = 0
  open_readfeel_blocker_count = 0
  open_execution_blocker_count = 0
  boundary_violation_blocker_count = 0
  disposal_verified = true
  no_body_leak_validation_passed = true
  no_question_text_validation_passed = true
  no_touch_validation_passed = true

注意:
  P5_CONFIRMED_CANDIDATEはP5 confirmed finalではない。
  R52 re-intake後の判断材料にすぎない。
```

### 8.2 P5_REPAIR_RETURN

```text
成立条件:
  P5履歴線の自然さがtarget未満。
  creepy / overread / overclaim / shallow repeat / self blame amplification等のreadfeel blockerがある。
  boundary caseで履歴線を出してしまった。
  P5 surface repair requiredがある。

扱い:
  P8材料候補へ逃がさない。
  P5 User Label Connection修正へ戻す。
```

### 8.3 P4_R12_TARGETED_CURRENT_ONLY_SURFACE_REPAIR

```text
成立条件:
  問題の主因がP5履歴線ではなく、current-only surfaceである。
  repair_required_refsにp4_current_surface_repair_requiredがある。

扱い:
  P5 repairでもP8材料でもなく、P4-R12 targeted current-only surface repairへ返す。
```

### 8.4 P8 material candidate-only

```text
成立条件:
  actual review由来のbody-free question need observation rowである。
  P5 repair / P4 current-only repair / execution blockerではない。
  primary_classがplus_single_question_candidate_laterまたはpremium_deep_dive_candidate_later。
  question_text / draft_question_textがない。
  p8_design_material_candidate = true。
  p8_implementation_spec_finalized_here = false。

扱い:
  P8詳細設計材料候補として分離するだけ。
  p8_start_allowedはfalse。
```

### 8.5 R54_OPERATION_INCONCLUSIVE

```text
成立条件:
  review rowsが24未満。
  rating rowsが24未満。
  question observation rowsが24未満。
  decisionに必要なcountsが欠けている。
  body-full packet生成はされたがreview完了が確認できない。

扱い:
  retry / evidence補完へ戻す。
  P5/P6/P8/releaseへ進めない。
```

### 8.6 blocked系

```text
R54_OPERATION_BLOCKED_PREFLIGHT:
  local-only / explicit allow / purge plan / export denylistが不足。

R54_OPERATION_BLOCKED_DISPOSAL:
  body-full packet / reviewer notes / temporary formの削除未確認。

R54_OPERATION_BLOCKED_BODY_LEAK_OR_QUESTION_TEXT:
  body-free evidenceへbody-full内容またはquestion textが混入。

R54_OPERATION_BLOCKED_NO_TOUCH_VIOLATION:
  API / DB / RN / runtime / public contractなどのno-touch違反。
```

---

## 9. validation / test計画

### 9.1 実装後に最低限確認するtarget案

新規thin wrapperを作る場合:

```bash
cd mashos-api/ai
python3 -m compileall -q services/ai_inference tests
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_actual_human_review_execution_bodyfree_intake_ahr00_ahr03_20260627.py \
  tests/test_r54_actual_human_review_execution_bodyfree_intake_ahr04_ahr08_20260627.py \
  tests/test_r54_actual_human_review_execution_bodyfree_intake_ahr09_ahr12_20260627.py \
  tests/test_r54_actual_human_review_execution_bodyfree_intake_ahr13_ahr17_20260627.py \
  tests/test_r54_actual_human_review_execution_bodyfree_intake_ahr18_ahr21_20260627.py \
  tests/test_r54_actual_human_review_execution_bodyfree_intake_ahr22_ahr24_20260627.py
```

既存R54-CLR final周辺の回帰:

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_current_snapshot_local_review_run_clr18_clr19_20260627.py \
  tests/test_r54_current_snapshot_local_review_run_clr20_clr21_20260627.py \
  tests/test_r54_current_snapshot_local_review_run_clr22_clr23_20260627.py \
  tests/test_r54_current_snapshot_local_review_run_clr24_20260627.py
```

R55 / R52 selected regression:

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r10_20260624.py \
  tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r12_r13_20260621.py \
  tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_r14_r15_20260621.py
```

RN contract確認を実装段階で行う場合:

```bash
cd Cocolon
npm run test:rn-screens --silent
```

### 9.2 claim boundary

result memoでは、次を明確に分ける。

```text
confirmed:
  実行したコマンドと結果。
  実際に成立したbody-free evidence counts。
  disposal receiptの有無。

not confirmed:
  実行していないコマンド。
  full backend suite。
  RN実機modal。
  P6 limited human readfeel。
  P8 start。
  release。

not claimed:
  helper greenをactual human review completeとは呼ばない。
  selected regression greenをfull backend suite greenとは呼ばない。
  R52 handoff readyをP5 final / P6 start / P8 start / releaseとは呼ばない。
```

### 9.3 full backend suiteの扱い

```text
full backend suiteを実行してgreenなら、その事実だけを記録する。
実行していないなら未確認として残す。
collect-onlyやselected target greenをfull backend suite greenへ変換しない。
```

### 9.4 RN実機modal確認の扱い

```text
RN contract greenは、RN表示契約確認である。
RN実機modal確認ではない。
実機確認していない場合は rn_real_device_modal_verified = false のまま残す。
```

---

## 10. 実装時のファイル方針

### 10.1 追加する可能性があるproduction候補

必要な場合のみ、以下を候補にする。

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_actual_human_review_execution_bodyfree_intake_20260627.py
```

役割:

```text
- 260/83/256/169 execution basis refsを固定するthin wrapper。
- 既存R54-CLR / R54-EV / R54-OP / R55 helperをhistorical / structural refsとして参照する。
- actual review rowsのbody-free validation / normalizationを受ける。
- R52 re-intake handoff envelopeをbody-freeで作る。
```

### 10.2 追加する可能性があるtest候補

```text
mashos-api/ai/tests/test_r54_actual_human_review_execution_bodyfree_intake_ahr00_ahr03_20260627.py
mashos-api/ai/tests/test_r54_actual_human_review_execution_bodyfree_intake_ahr04_ahr08_20260627.py
mashos-api/ai/tests/test_r54_actual_human_review_execution_bodyfree_intake_ahr09_ahr12_20260627.py
mashos-api/ai/tests/test_r54_actual_human_review_execution_bodyfree_intake_ahr13_ahr17_20260627.py
mashos-api/ai/tests/test_r54_actual_human_review_execution_bodyfree_intake_ahr18_ahr21_20260627.py
mashos-api/ai/tests/test_r54_actual_human_review_execution_bodyfree_intake_ahr22_ahr24_20260627.py
```

### 10.3 result memo候補

```text
mashos-api/ai/tests/R54_AHR_BodyFreeEvidenceIntake_Result_20260627.md
```

result memoに含めるもの:

```text
- 実装範囲。
- 変更ファイル。
- 実行したvalidation commands。
- pass / fail / not executed。
- current execution basis refs。
- actual review evidence count summary。
- disposal verified status。
- body-free / no-touch確認。
- P5 decision candidate。
- P6 candidate-only / P8 material candidate-only。
- R52 re-intake handoff status。
- 未実施 / 未確認。
```

result memoに含めないもの:

```text
raw input
returned Emlis body
history surface
reviewer free text
reviewer notes body
question text
draft question text
local absolute path
body hash
packet content
terminal output body
```

### 10.4 変更しないファイル領域

```text
RN production code
API route files
DB migration files
runtime Emlis generation files
User Label Connection runtime generation files
subscription / entitlement files
public response contract files
P8 question implementation files
release decision files
```

### 10.5 既存helperを書き換える場合の制限

許可候補:

```text
- 誤字修正。
- export追加。
- body-free helperの安全な分離。
```

禁止:

```text
- 既存R54-CLR helper内のcurrent refsを260/83/256/169へ上書きする。
- 既存R54-OP / R54-EV / R54-CLR / R55のhistorical refsを消す。
- historical helper greenをactual review evidence completeへ変換する。
- runtime挙動を変える。
```

---

## 11. fail-closed / blocker判断

### 11.1 preflight fail

```text
decision_candidate = R54_OPERATION_BLOCKED_PREFLIGHT
actual reviewへ進まない。
body-full packet生成もしない。
R52 handoffはblocked evidenceとしてのみ返す。
```

### 11.2 packet generation partial / missing

```text
decision_candidate = R54_OPERATION_INCONCLUSIVE
24件に満たない場合、rating / question observationへ進めない。
不足countだけをbody-freeで残す。
```

### 11.3 reviewer selection incomplete

```text
decision_candidate = R54_OPERATION_INCONCLUSIVE
reviewed_case_count / rating_row_count / question_observation_row_countが24未満。
P5/P6/P8/releaseへ進めない。
```

### 11.4 readfeel blocker present

```text
decision_candidate = P5_REPAIR_RETURN
P8材料候補へ逃がさない。
readfeel blocker count / idsだけをbody-freeで残す。
```

### 11.5 current-only surface issue present

```text
decision_candidate = P4_R12_TARGETED_CURRENT_ONLY_SURFACE_REPAIR
P5履歴線ではなくcurrent-only surface repairへ返す。
```

### 11.6 question text leak

```text
decision_candidate = R54_OPERATION_BLOCKED_BODY_LEAK_OR_QUESTION_TEXT
question_text / draft_question_textを成果物へ含めた場合は失敗。
P8材料候補も無効化する。
```

### 11.7 disposal incomplete

```text
decision_candidate = R54_OPERATION_BLOCKED_DISPOSAL
body-full packetやreviewer notesの削除未確認なら、R52 handoff readyにしない。
```

### 11.8 no-touch violation

```text
decision_candidate = R54_OPERATION_BLOCKED_NO_TOUCH_VIOLATION
API / DB / RN / runtime / public contractに触った場合は、actual review evidence以前の境界違反として止める。
```

---

## 12. R52 re-intake後の次段階判断

R52 re-intake後も、自動で次へ進めない。  
R52側で改めて判断する。

候補:

```text
1. P5_CONFIRMED_CANDIDATE
   -> P6 limited human readfeel candidate-onlyへ進む可能性。
   -> ただしP6 start allowedは別判断。

2. P5_REPAIR_RETURN
   -> P5 User Label Connection修正へ戻す。

3. P4_R12_TARGETED_CURRENT_ONLY_SURFACE_REPAIR
   -> current-only surface repairへ戻す。

4. R54_OPERATION_INCONCLUSIVE
   -> actual review retry / evidence補完。

5. R54_OPERATION_BLOCKED_DISPOSAL
   -> disposal完了までhold。

6. R54_OPERATION_BLOCKED_BODY_LEAK_OR_QUESTION_TEXT
   -> body-free boundary repair。

7. R54_OPERATION_BLOCKED_NO_TOUCH_VIOLATION
   -> no-touch boundary repair。
```

P8へ進めるための材料条件:

```text
actual review由来のbody-free question need observation rowsが揃っている。
P5 repair対象とP8 material candidateが分離されている。
question text / draft question textを作っていない。
p8_start_allowedを別工程で判断する。
```

P8へ進めない条件:

```text
actual review未実行。
question observation rows不足。
P5 repair対象が残っている。
question textを作ってしまっている。
disposal未確認。
```

---

## 13. acceptance criteria

### 13.1 本設計書としての完了条件

```text
- 次実装対象をR54-AHR actual human review execution / body-free evidence intakeとして固定している。
- 260/83/256/169を今回actual execution basisとして扱う方針を明記している。
- 既存R54-CLR refsをhistorical helper refsとして分離している。
- 24-case actual reviewの実装順をR54-AHR-00〜24として示している。
- body-full / body-free境界を明記している。
- rating / blocker / question observation / disposal / R52 handoffのjson案を含んでいる。
- P5 final / P6 start / P8 start / releaseをtrue化しない境界を明記している。
- 実ファイル化は実装段階で判断すると明記している。
```

### 13.2 実装後の完了条件候補

```text
- compileall passed。
- R54-AHR target tests passed。
- R54-CLR final selected regression passed。
- R55 / R52 selected regression passed。
- result memoがbody-freeで作成されている。
- 実行していないfull backend suite / RN実機modalを未確認として残している。
```

### 13.3 actual review operation後の完了条件候補

```text
- actual_human_review_executed_by_person = true。
- reviewed_case_count = 24。
- sanitized_review_result_row_count = 24。
- rating_row_count = 24。
- question_observation_row_count = 24。
- disposal_verified = true。
- no_body_leak_validation_passed = true。
- no_question_text_validation_passed = true。
- no_touch_validation_passed = true。
- R52 re-intake handoff envelopeがbody-freeで成立している。
- P5 final / P6 start / P8 start / P7 complete / releaseはfalseのまま。
```

---

## 14. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- P7/P8 Bridgeでは、P7中にP8観測補助問いを実装しない。
- R54-CLR00〜CLR24は現受領zip内に存在する。
- R54-CLR00〜CLR24 split targetは前回ローカルで257 passed確認済み。
- R54-CLRはbody-free helper / contract / documentation境界を持つ。
- actual human review by personは未実行。
- actual rating rows / actual question need observation rows / disposal / actual R52 re-intakeは未成立。
- p5_confirmed_final / p6_start_allowed / p8_start_allowed / release_allowedはfalse。
```

### 未確認

```text
- full backend suite green。
- RN contract再実行。
- RN実機modal確認。
- actual body-full packet generation。
- actual 24-case local-only human review。
- actual evidence complete状態でのR52 re-intake。
```

### 書かれていない

```text
- 現時点でP8設計へ進んでよい、とは書かれていない。
- 現時点でP6 limited human readfeelへ進んでよい、とは書かれていない。
- helper greenを実レビュー完了へ変換してよい、とは書かれていない。
- P5_CONFIRMED_CANDIDATEをP5 finalへ昇格してよい、とは書かれていない。
```

### 推測禁止

```text
- 24-case reviewを実施済みと推測しない。
- body-full packetを削除済みと推測しない。
- synthetic contract rowsをactual review rowsとして扱わない。
- R52 handoff readyをP5 final / P6 start / P8 start / releaseへ変換しない。
- P8材料候補があることをP8開始許可へ変換しない。
```

### 次に実行すべきこと

```text
1. 実装段階で既存helperのoverride可否を確認する。
2. 必要ならR54-AHR thin wrapperを追加する。
3. 260/83/256/169 execution basis refsをbody-freeに固定する。
4. 24-case actual reviewをlocal-onlyで実行できるreceipt / row / disposal構造を作る。
5. actual review rowsをbody-free selection rowsとして取り込む。
6. P5 decision / P6 candidate-only / P8 material candidate-only / R52 handoffを分ける。
7. P5 final / P6 start / P8 start / releaseは次工程判断までfalseのまま保持する。
```

---

## 15. 華恋の意見

華恋としては、今回の実装は「新しい価値を足す実装」ではなく、Cocolonの核が本当に成立しているかを確かめるための実装だと見ています。

R54-CLR00〜CLR24で、body-free helper / contract / documentationの器はかなり揃っています。  
ただし、その器があることと、人間がP5履歴線を読んで「記録が線として返った」と判断できたことは別です。

ここを曖昧にすると、Cocolonは「残した記録が意味を持って返る場所」ではなく、「問い返しで会話を続けるAI」に寄ってしまいます。  
問い返しは便利ですが、P5の弱さを隠す道具にしてはいけません。

だから、実装順はP8ではなく、R54-AHRに置くのが正しいです。  
body-fullはローカルだけで読み、成果物はbody-freeに閉じる。  
P5を直すべきものはP5へ返す。  
current-only surfaceを直すべきものはP4へ返す。  
P8の材料にしてよいものだけ、問い必要性観察メモとして分ける。

この順番を守ることで、Cocolonは「動く」から、「残す理由がある」へ近づけると思います。

---

## 16. 最終判断

```text
本設計書は、P7-R54 Actual Human Review Execution / Body-Free Evidence Intake の詳細設計として採用可能。
実装段階では、R54-AHR-00〜24の順に進める。
json / schema案は本書内に留め、実ファイル化は実装段階で既存helper・既存test・既存配置を確認して判断する。
P8 / P6 / release / API / DB / RN / runtime変更は扱わない。
```
