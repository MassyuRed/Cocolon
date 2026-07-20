# Cocolon / EmlisAI P7-R54 Actual Local Review Operation / Current Snapshot Local Run 詳細設計書・実装順

作成日: 2026-06-27 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / P5 User Label Connection / R54 actual local-only human review / R52 re-intake / P7-P8 Bridge  
基準検討メモ: `Cocolon_EmlisAI_RoadmapStageDecision_R54ActualReviewRun_PreDesignMemo_20260627.md`  
基準ロードマップ: `Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md`  
基準ローカル受領zip: `Cocolon_前提資料(258).zip` / `EmlisAIの実装済み資料(82).zip` / `Cocolon(255).zip` / `mashos-api(168).zip`  
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

今回の正式設計対象は、次で固定する。

```text
P7-R54 Actual Local Review Operation / Current Snapshot Local Run
```

これは、P8観測補助問いの詳細設計ではない。  
これは、P6 limited human readfeel開始設計でもない。  
これは、release readiness設計でもない。

本書の目的は、次である。

```text
現受領snapshotを、R54 actual review basisとして再固定する。
既存R54-OP / R54-EV / R55 helperを historical / structural refs として扱い、
今回のactual review basisと混同しない。
P5 User Label Connection履歴線を24-caseでlocal-onlyに人間が読み、
rating / blocker / question need observation / disposal / R52 re-intakeへ渡すbody-free evidenceを成立させる。
```

本設計で絶対に守る中心は次である。

```text
local-only
body-free evidence only
no body-full artifact export
no question text
no P8 implementation
no public contract change
no runtime change
no P5 final confirmation
no P6/P8/release promotion
```

華恋の判断として、ここで最も危険なのは、**R54-EV00〜EV22のhelperが揃ったことを、actual human reviewが成立したことに変換してしまうこと**である。  
現在の不足は、新しいhelperをさらに増やすことではなく、実際の24-case読感をbody-free evidenceとして安全に通すことである。

---

## 1. なぜこの作業を行うのか

Cocolonの価値は、ユーザーが残した言葉・感情・カテゴリ・行動・時点・過去記録が、入力直後に「読まれた形」として返ることにある。

P5 User Label Connectionは、その価値の中核である。

```text
現在入力だけを読むのではなく、過去に残した記録が自然な線として返る。
そのことで、Cocolonへ記録を積む意味が生まれる。
```

ただし、P5履歴線は強い価値と同時に、強い危険も持つ。

```text
- 履歴線が弱ければ、ただの汎用説明になる。
- 履歴線が強すぎれば、監視感・決めつけ・creepyさが出る。
- 現在入力を履歴で上書きすると、ユーザー本人の今の言葉が消える。
- 低情報入力を履歴で深読みすると、Cocolonが勝手に理解したふりをする。
- P5が未確認のままP8へ進むと、問い返しでP5の浅さを補うAIへ寄る。
```

したがって、今行うべきことは、P8の問い文や発生ロジックを作ることではない。  
P5履歴線が、Cocolonの商品体験として「記録が線として返った」と言えるかを、人間の読感で確認することである。

この工程は地味だが、Cocolonを「質問が上手なAI」ではなく「残した記録が意味を持って返る場所」として成立させるために必要である。

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
Cocolon_前提資料/10_cocolon_joint_development_karen_thought_boundary_2026_05_24.md
```

作業姿勢として固定すること:

```text
- 見ていないものを確認済みにしない。
- 設計と実装を混ぜない。
- helper green / test greenを商品価値合格へ変換しない。
- Cocolonをメンタル問題ではなく、商品品質として扱う。
- Cocolonを「人間の言葉を雑に処理しない場所」として扱う。
```

### 2.2 EmlisAI判断として確認した前提

```text
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/cocolon_environment_state_output_observation_structure_design_2026_05_25.md
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/r54ev_diff_20260626.csv
```

EmlisAI側の固定読み:

```text
- EmlisAIは、Gateに通ったものだけを表示する許可装置ではない。
- EmlisAIは、入力直後の観測返答である。
- P5履歴線は、現在入力を上書きせず、現在入力に自然につながる必要がある。
- P5履歴線の弱さを、P8の問いで隠してはいけない。
```

### 2.3 参照した実装済み資料

```text
Cocolon_EmlisAI_P7_R49_P5HumanBlindQA_QuestionNeedObservation_詳細設計書_実装順_20260619.md
Cocolon_EmlisAI_P7_R50_P5HumanBlindQAActualReviewManualRunDecision_詳細設計書_実装順_20260620.md
Cocolon_EmlisAI_P7_R51_P5HumanBlindQA_LocalOnlyManualRun_DetailedDesign_ImplementationOrder_20260620.md
Cocolon_EmlisAI_P7_R52_R51HandoffEvidenceDecisionGate_DetailedDesign_ImplementationOrder_20260621.md
Cocolon_EmlisAI_P7_R53_R51ActualLocalReviewExecutionEvidenceMaterialization_DetailedDesign_ImplementationOrder_20260621.md
Cocolon_EmlisAI_P7_R54_P5HumanBlindQAActualLocalReviewExecution_BodyFreeResultHandoff_DetailedDesign_ImplementationOrder_20260622.md
Cocolon_EmlisAI_P7_R55_R54EvidenceReconcile_R52ReintakeDecisionMaterialization_DetailedDesign_ImplementationOrder_20260623.md
Cocolon_EmlisAI_P4_RuntimeBackfill_HIJ_FutureDirectionSurfaceRepair_DetailedDesign_ImplementationOrder_20260624.md
Cocolon_EmlisAI_P4_R11_ResidualFamilyCurrentOnlySurfaceAudit_DetailedDesign_ImplementationOrder_20260624.md
Cocolon_EmlisAI_P7_R54ActualLocalOnlyHumanReviewOperation_Reentry_DetailedDesign_ImplementationOrder_20260625.md
Cocolon_EmlisAI_P7_R54ActualLocalReviewOperation_ExecutionEvidenceMaterialization_DetailedDesign_ImplementationOrder_20260626.md
```

読み取り:

```text
R49〜R53:
  P5 Human Blind QA / local-only / body-free / R52 decision gate の器を積んだ。
  actual review完了ではない。

R54 20260622:
  P5 actual local-only human review resultをbody-freeでR52へ戻す設計。
  ただしactual review evidenceはまだ不足。

R55 20260623:
  R54 evidenceをR52へre-intakeするdecision materialization。
  actual review evidence missingによりholdする読みを保持。

R54-OP 20260625:
  actual local-only human review operation reentryのOP00〜OP24 helper。
  ただしoperation current refsは20260625基準。

R54-EV 20260626:
  actual review execution evidence materializationのEV00〜EV22 helper。
  ただしoperation current refsは20260626基準。
```

### 2.4 主に確認した実ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_actual_local_review_operation_reentry_20260625.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_actual_review_execution_evidence_materialization_20260626.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_p4_r11_summary_decision_handoff.py
mashos-api/ai/tests/R54_EV16_EV17_Result_20260626.md
mashos-api/ai/tests/R54_EV18_EV19_Result_20260626.md
mashos-api/ai/tests/R54_EV20_EV21_Result_20260626.md
mashos-api/ai/tests/R54_EV22_Result_20260626.md
Cocolon/tests/rn-screen-contracts.test.js
```

---

## 3. 現状整理

### 3.1 確認済み

```text
- P7/P8 Bridgeでは、P7中に観測補助問いを実装しない。
- P7中は、body-freeの問い必要性観察メモを残すだけである。
- R54-OP00〜OP24 / R54-EV00〜EV22 / R55 helperは存在する。
- R54-EV helper default stateでは reviewed_case_count / rating_row_count / question_observation_row_count が0である。
- actual_human_review_run / body_full_packet_generated / actual_rating_rows_materialized / actual_question_need_observation_rows_materialized / disposal_verified は、確認範囲でfalseである。
- p6_limited_human_readfeel_start_allowed / p8_start_allowed / release_allowed はfalseである。
- R54-EV実ファイルのoperation refsは20260626基準であり、今回受領の20260627基準とは一致しない。
```

### 3.2 未確認

```text
- full backend suite green。
- RN実機modal確認。
- actual body-full packet生成。
- actual local-only human review実行。
- actual rating rows成立。
- actual question need observation rows成立。
- actual disposal / purge receipt成立。
- R52 re-intakeがactual evidence completeとして受け取れる状態。
- 外部pilot / release readiness。
```

### 3.3 書かれていない

```text
- 現時点でP8観測補助問い詳細設計を開始してよい、とは書かれていない。
- 現時点でP6 limited human readfeelを開始してよい、とは書かれていない。
- 現時点でP5 confirmed finalにしてよい、とは書かれていない。
- 現時点でrelease_allowedをtrueにしてよい、とは書かれていない。
- helper greenをactual human review completeとして扱ってよい、とは書かれていない。
```

### 3.4 推測禁止

```text
- 24-caseを人間が読んだはず、と推測しない。
- rating rowsが成立しているはず、と推測しない。
- question need observation rowsがあるはず、と推測しない。
- P8材料候補があるならP8設計してよい、と推測しない。
- RN contract greenをRN実機modal確認済みへ変換しない。
- selected target greenをfull backend suite greenへ変換しない。
- P4-R11 auditをR54 actual review evidenceへ変換しない。
```

### 3.5 次に実行すべきこと

```text
1. 現受領snapshotをR54 actual review basisとしてrefreezeする。
2. 既存R54-OP / R54-EV helperをhistorical / structural refsに分離する。
3. body-full packetをlocal-onlyで生成・閲覧する操作境界を固定する。
4. 24-case actual reviewを選択式body-free rowへ落とす。
5. rating / blocker / question need observation / disposal / summary / decision / R52 handoffをbody-free evidenceとして成立させる。
```

---

## 4. 作業範囲とno-touch境界

### 4.1 本設計で扱うもの

```text
- R54 actual review basisの20260627 current snapshot refreeze。
- local-only actual review runの実行順。
- body-full packet生成・閲覧・削除の操作境界。
- reviewer selection-only form案。
- sanitized review result rows案。
- rating rows正規化案。
- readfeel blocker / execution blocker分離案。
- question need observation rows案。
- disposal receipt案。
- post-review summary案。
- P5 decision candidate / P4-R12 repair / P5 repair return / inconclusiveの分岐案。
- P6 candidate-only / P8 material candidate-only / R52 re-intake handoff案。
- validation command matrix案。
```

### 4.2 本設計で扱わないもの

```text
RN production UI
RN表示条件
API route
request key
response key
DB physical schema
DB migration
runtime Gate threshold
User Label Connection runtime surface generation
Emlis visible output generation
public meta key
subscription / plan access policy
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
real_device_modal_verified = false unless actually verified on device
```

### 4.4 body-full / body-free境界

成果物へ残してはいけないもの:

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

成果物へ残してよいもの:

```text
safe refs
enum
boolean
count
score
threshold refs
summary statistics
decision candidate refs
validation result refs
```

---

## 5. 設計判断

### 5.1 Current Snapshot Local Runを新しいR番号にしない

本書は、新しいP7-R56ではなく、R54のactual local review operationを現snapshotで成立させるための設計である。

理由:

```text
- ロードマップ上の不足はR54 actual review evidence missingである。
- R54-OP / R54-EV / R55の器はある。
- 新しい大きな段階を足すと、actual reviewからさらに遠ざかる。
```

したがって、実装段階で必要な場合も、追加するのは「20260627 current snapshot local run」の薄い境界に限定する。

候補名:

```text
module候補:
  emlis_ai_p7_r54_current_snapshot_local_review_run_20260627.py

test候補:
  test_r54_current_snapshot_local_review_run_20260627.py

result memo候補:
  R54_CurrentSnapshotLocalRun_Result_20260627.md
```

ただし、これらは本設計内の候補であり、実ファイル化は実装段階で現物コード・既存helperのoverride可否・既存test影響を見て判断する。

### 5.2 既存helperは再利用するが、actual review basisにはしない

既存helperの扱い:

```text
R54-OP 20260625:
  structural contract / validation pattern / enum定義の参照として使う。
  2026065 current refsを、今回のactual review basisにしない。

R54-EV 20260626:
  execution evidence materializationの構造参照として使う。
  20260626 current refsを、今回のactual review basisにしない。

R55 20260623:
  R52 re-intake / P6-P8-release holdの境界参照として使う。
  20260623 refsを、今回のactual review basisにしない。
```

今回actual review basis:

```text
premise_zip_ref: Cocolon_前提資料(258).zip
implemented_materials_zip_ref: EmlisAIの実装済み資料(82).zip
rn_zip_ref: Cocolon(255).zip
backend_zip_ref: mashos-api(168).zip
roadmap_ref: Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md
pre_design_memo_ref: Cocolon_EmlisAI_RoadmapStageDecision_R54ActualReviewRun_PreDesignMemo_20260627.md
detailed_design_ref: Cocolon_EmlisAI_P7_R54ActualLocalReviewOperation_CurrentSnapshotLocalRun_DetailedDesign_ImplementationOrder_20260627.md
```

### 5.3 read_feelingの扱い

検討メモではrating rowsに `read_feeling` が含まれている。  
一方、確認したR54-OP09 / R54-EV08のfrozen rating axisは、次の6軸である。

```text
history_connection_naturalness
creepy_absence
overclaim_absence
self_blame_non_amplification
wants_more_input_or_accumulation
non_shallow_repeat
```

したがって、本設計では次の扱いにする。

```text
- 既存R54-OP/R54-EVへ渡す axis_scores は、既存6軸を維持する。
- read_feeling は axis_scores に無断追加しない。
- read_feeling は、selection row上の body-free enum `overall_read_feeling_ref` として別枠に置く。
- 実装段階で既存helperへ取り込む必要がある場合は、thin wrapper側で summary count に集約する。
- 既存helperのrating axis tupleを直接変更しない。
```

理由:

```text
- 既存helperはrating_axis_refs完全一致を検証している。
- axisを無断で増やすと、過去helper / test / R55 handoffの意味が変わる。
- ただし、人間読感としての「読まれた感じ」は重要なので、body-free enumとして残す。
```

---

## 6. 実装方針

### 6.1 実装段階の基本方針

```text
原則:
  既存R54-OP / R54-EV / R55 helperを使う。

ただし:
  20260627 current snapshot refsをactual review basisとして固定できない場合、薄いwrapperを追加する。

禁止:
  既存runtime、API、DB、RN、public response contractを変更しない。
  既存R54-OP/R54-EVのhistorical refsを今回basisへ見せかけない。
```

### 6.2 実装段階で最初に判定すること

実装時、最初に次を確認する。

```text
A. 既存helperが operation_current_refs / current_received_snapshot_refs を外部入力として受けられるか。
B. 既存helperが reviewer_selection_rows / sanitized_review_result_rows を外部入力として受けられるか。
C. 既存helperが disposal receipt を外部入力として受けられるか。
D. 既存helperのassertが20260626 refs固定で失敗しないか。
```

判断:

```text
A〜Dがすべて既存helperで成立:
  追加helperなし。local operation result memoとbody-free evidenceだけを作る。

current refsが固定で20260627 basisにできない:
  thin current snapshot wrapperを追加する。

reviewer selection rows / disposal receipt の受け口が不足:
  row intake / disposal receipt の薄いhelperだけ追加する。

既存helperを大きく書き換えないと成立しない:
  実装を停止し、設計再検討。大規模改修へ進まない。
```

### 6.3 予想される実装形

現時点の確認では、R54-OPは20260625 refs、R54-EVは20260626 refsを保持している。  
そのため、実装段階では以下の薄いwrapperが必要になる可能性が高い。

```text
候補:
  R54-CLR-00〜CLR-24 current snapshot local run wrapper

役割:
  - 20260627 actual review basis refsを固定する。
  - 既存helper refsをhistorical / structural refsとして添える。
  - actual reviewer selection rowsをbody-freeで取り込む。
  - 既存R54-EV16〜EV22相当のsummary / decision / handoffを20260627 basisで出す。

やらないこと:
  - body-full packet生成そのもの。
  - local delete実行そのもの。
  - API / DB / RN / runtime変更。
  - P8 question implementation。
```

---

## 7. 全体フロー

```text
R54-CLR-00 scope / no-touch boundary
  ↓
R54-CLR-01 current snapshot basis refreeze
  ↓
R54-CLR-02 historical helper refs reconcile
  ↓
R54-CLR-03 R55 hold / evidence missing intake
  ↓
R54-CLR-04 local-only preflight
  ↓
R54-CLR-05 24-case manifest freeze
  ↓
R54-CLR-06 body-full packet generation request body-free evidence
  ↓
R54-CLR-07 local packet generation operation receipt intake
  ↓
R54-CLR-08 packet completeness / export denylist scan
  ↓
R54-CLR-09 reviewer selection form freeze
  ↓
R54-CLR-10 actual human review local-only operation
  ↓
R54-CLR-11 sanitized review result row intake
  ↓
R54-CLR-12 rating row normalization
  ↓
R54-CLR-13 readfeel blocker / execution blocker ingestion
  ↓
R54-CLR-14 question need observation normalization
  ↓
R54-CLR-15 rating / question consistency guard
  ↓
R54-CLR-16 pause / abort / expiration protocol
  ↓
R54-CLR-17 purge / disposal receipt
  ↓
R54-CLR-18 body-free post-review summary
  ↓
R54-CLR-19 P5 decision candidate separation
  ↓
R54-CLR-20 P6 candidate-only handoff
  ↓
R54-CLR-21 P8 material candidate-only handoff
  ↓
R54-CLR-22 final no-body-leak / no-question-text / no-touch validation
  ↓
R54-CLR-23 R52 re-intake handoff
  ↓
R54-CLR-24 validation command matrix / documentation output
```

`CLR` は本書上の設計ラベルである。  
実装段階でこの名称を実ファイル名・関数名に採用するかは、既存helperとの重複と影響範囲を見て判断する。

---

## 8. 実装順詳細

### R54-CLR-00: scope / no-touch boundary freeze

目的:

```text
今回の作業が、R54 actual local-only human review operationであり、P8設計・API/DB/RN/runtime変更ではないことを固定する。
```

入力:

```text
基準検討メモ
基準ロードマップ
現受領zip refs
```

出力案:

```text
scope_no_touch_boundary.bodyfree
```

必須flags:

```text
api_changed = false
db_changed = false
rn_changed = false
runtime_changed = false
public_response_key_changed = false
question_implementation_started_here = false
p8_start_allowed = false
p6_limited_human_readfeel_start_allowed = false
p5_human_blind_qa_confirmed_final = false
release_allowed = false
```

fail条件:

```text
- P8 question text / trigger / storage / RN UIを設計し始めている。
- API / DB / RN / runtimeを変更対象にしている。
- R54 actual reviewの完了を事前に主張している。
```

### R54-CLR-01: current snapshot basis refreeze

目的:

```text
今回actual reviewが、どのsnapshotに対するレビューなのかをbody-freeに固定する。
```

固定するcurrent refs:

```text
premise_zip_ref = Cocolon_前提資料(258).zip
implemented_materials_zip_ref = EmlisAIの実装済み資料(82).zip
rn_zip_ref = Cocolon(255).zip
backend_zip_ref = mashos-api(168).zip
roadmap_ref = Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md
pre_design_memo_ref = Cocolon_EmlisAI_RoadmapStageDecision_R54ActualReviewRun_PreDesignMemo_20260627.md
detailed_design_ref = Cocolon_EmlisAI_P7_R54ActualLocalReviewOperation_CurrentSnapshotLocalRun_DetailedDesign_ImplementationOrder_20260627.md
```

出力案:

```text
current_snapshot_basis_refreeze.bodyfree
```

pass条件:

```text
operation_current_refs_are_actual_review_basis = true
historical_helper_refs_used_as_actual_review_basis = false
old_helper_refs_allowed_as_actual_review_basis = false
all_required_current_refs_present = true
```

fail条件:

```text
- R54-OP 20260625 refsを今回actual review basisにしている。
- R54-EV 20260626 refsを今回actual review basisにしている。
- 現受領zip refsをbody-freeに残していない。
```

### R54-CLR-02: historical helper refs reconcile

目的:

```text
既存R54-OP / R54-EV / R55を、historical / structural refsとして安全に分離する。
```

historical refs:

```text
r54_op_20260625
r54_ev_20260626
r55_20260623
r52_20260621
r53_20260621
r54_bodyfree_handoff_20260622
p4_r11_20260624
```

出力案:

```text
historical_helper_refs_reconcile.bodyfree
```

pass条件:

```text
structural_contract_reused = true
historical_refs_can_be_used_for_helper_regression_only = true
historical_refs_can_be_used_for_actual_review_basis = false
```

fail条件:

```text
- older helper refsをactual review basisへ混入している。
- P4-R11 audit rowsをR54 actual review casesへ変換している。
```

### R54-CLR-03: R55 hold / evidence missing intake

目的:

```text
R55側がactual review evidence missingでholdしている状態を、今回local run開始前提として取り込む。
```

固定:

```text
required_case_count = 24
reviewed_case_count_before_run = 0
rating_row_count_before_run = 0
question_observation_row_count_before_run = 0
disposal_verified_before_run = false
p6_hold = true
p8_hold = true
release_hold = true
```

pass条件:

```text
R55 holdが解除されていない。
P6/P8/release開始許可が立っていない。
```

### R54-CLR-04: local-only preflight

目的:

```text
body-full packet生成前に、local-only条件を満たすかbody-freeで判定する。
```

必要条件:

```text
explicit_local_only_allow_ref present
review_session_id present
current_snapshot_basis_refreeze ready
24-case manifest source available
export_denylist ready
purge_plan ready
no API/DB/RN/runtime touch
```

出力案:

```text
local_only_preflight.bodyfree
```

pass条件:

```text
preflight_status = PREFLIGHT_READY
body_full_packet_generation_allowed_by_preflight = true
raw_body_included = false
question_text_included = false
local_path_included = false
```

blocked条件:

```text
preflight_status = PREFLIGHT_BLOCKED
body_full_packet_generation_allowed_by_preflight = false
execution_blocker_ids includes reason
```

### R54-CLR-05: 24-case manifest freeze

目的:

```text
R54 P5 Human Blind QAの24-caseを固定し、P4-R11 residual family audit rowsと混同しない。
```

manifest rowに必要なbody-free fields:

```text
case_index
case_ref_id
blind_case_id
case_role_family_ref
plan_tier_context_ref
review_axis_profile_ref
requires_history_line_review
current_only_boundary_case
```

含めないもの:

```text
raw input
returned Emlis body
history surface
local path
body hash
```

pass条件:

```text
required_case_count = 24
manifest_row_count = 24
case_ref_id_unique = true
blind_case_id_unique = true
p4_r11_rows_mixed_in = false
```

### R54-CLR-06: body-full packet generation request body-free evidence

目的:

```text
body-full packet本体ではなく、生成要求と禁止境界だけをbody-freeで残す。
```

出力案:

```text
body_full_packet_generation_request.bodyfree
```

残してよいもの:

```text
packet_request_count
packet_ref_ids
expected_packet_ref_count
allowed_output_ref = local_only_body_full_packet
forbidden_output_refs
export_denylist_refs
```

残してはいけないもの:

```text
packet content
local path
body hash
raw input
returned Emlis body
history surface
```

### R54-CLR-07: local packet generation operation receipt intake

目的:

```text
local-onlyでbody-full packetが生成されたかどうかを、body-free receiptだけで受け取る。
```

receiptに許可するfields:

```text
review_session_id
packet_generation_operation_ref
packet_generation_status
expected_packet_count
actual_packet_count
packet_ref_ids
export_candidate_count
execution_blocker_ids
```

禁止fields:

```text
local_path
packet_content
body_hash
terminal_output_body
```

pass条件:

```text
packet_generation_status = LOCAL_ONLY_PACKET_GENERATED
actual_packet_count = 24
export_candidate_count = 0
```

blocked条件:

```text
packet_generation_status = BLOCKED or PARTIAL
actual reviewへ進まない
```

### R54-CLR-08: packet completeness / export denylist scan

目的:

```text
packetが24件分そろっているか、成果物へ混ぜてはいけないbody-full情報が出力候補に入っていないかをbody-freeで確認する。
```

scan row fields:

```text
packet_ref_id
blind_case_id
required_fields_present
packet_present_local_only
export_denylist_violation
body_full_packet_export_candidate
```

pass条件:

```text
packet_scan_status = PACKET_SCAN_READY
packet_scan_row_count = 24
packet_present_count = 24
required_fields_present_count = 24
export_denylist_violation_count = 0
body_full_packet_export_candidate_count = 0
```

fail条件:

```text
- packet contentがscan結果へ入っている。
- local path / hashが成果物候補へ入っている。
- 24件未満。
```

### R54-CLR-09: reviewer selection form freeze

目的:

```text
reviewerがfree textではなく、選択式body-free formで評価できるように固定する。
```

form policy:

```text
selection_only = true
reviewer_free_text_field_present = false
raw_body_copy_field_present = false
question_text_field_present = false
draft_question_text_field_present = false
local_path_field_present = false
body_hash_field_present = false
```

axis_scoresは既存6軸:

```text
history_connection_naturalness
creepy_absence
overclaim_absence
self_blame_non_amplification
wants_more_input_or_accumulation
non_shallow_repeat
```

score options:

```text
0.0
0.25
0.5
0.75
1.0
```

thresholds:

```text
history_connection_naturalness >= 0.90
creepy_absence >= 0.95
overclaim_absence >= 0.95
self_blame_non_amplification >= 0.95
wants_more_input_or_accumulation >= 0.85
non_shallow_repeat >= 0.90
```

read_feelingは別枠:

```text
overall_read_feeling_ref
```

### R54-CLR-10: actual human review local-only operation

目的:

```text
24-caseを人間がlocal-onlyに読み、selection-only formへ記録する。
```

reviewerが見るもの:

```text
current input review surface local-only
returned Emlis surface local-only
P5 history line / boundary surface local-only
plan tier context local-only
case role family ref
rating axis instruction
selection form
```

reviewerが成果物へ出さないもの:

```text
raw input
returned body
history body
free text note
question text
local path
hash
packet content
```

操作順:

```text
1. 1件ずつpacketを開く。
2. 現在入力を先に読む。
3. Emlisの返りを読む。
4. P5履歴線が現在入力へ自然につながるかを見る。
5. 監視感 / overclaim / 自己責め増幅 / 浅い復唱を確認する。
6. 6軸scoreとoverall_read_feeling_refを選択する。
7. verdictを選択する。
8. readfeel blocker / execution blockerを選択する。
9. question need primary classを選択する。
10. question textは書かない。
```

未完了時:

```text
status = REVIEW_IN_PROGRESS_LOCAL_ONLY or PAUSED_NO_HANDOFF_LOCAL_ONLY
R52 handoffへ進めない
```

### R54-CLR-11: sanitized review result row intake

目的:

```text
reviewer selectionsをbody-free rowとして取り込む。
```

required count:

```text
sanitized_review_result_row_count = 24
```

必須fields:

```text
case_ref_id
blind_case_id
packet_ref_id
reviewer_ref
reviewed_at_ref
axis_scores
overall_read_feeling_ref
verdict
sanitized_reason_ids
readfeel_blocker_ids
execution_blocker_ids
question_need_primary_class
ambiguity_kind_refs
one_question_fit_ref
repair_required_refs
plan_candidate_flags
```

禁止fields:

```text
reviewer_free_text
reviewer_note
reviewer_notes
raw_input
returned_emlis_body
history_surface
question_text
draft_question_text
local_absolute_path
body_hash
packet_content
```

### R54-CLR-12: rating row normalization

目的:

```text
sanitized review result rowsをrating rowsへ正規化する。
```

rating row fields:

```text
rating_row_ref
review_session_id
case_ref_id
blind_case_id
packet_ref_id
axis_scores
axis_score_count
overall_read_feeling_ref
average_score
below_target_axis_refs
verdict
```

pass条件:

```text
rating_row_count = 24
all_axes_present = true
axis_score_range_valid = true
verdict_allowed = true
below_target_axis_refs calculated
```

verdict options:

```text
PASS
YELLOW
REPAIR_REQUIRED
RED
NOT_REVIEWABLE
```

### R54-CLR-13: readfeel blocker / execution blocker ingestion

目的:

```text
商品読感のblockerと、レビュー実行上のblockerを分ける。
```

readfeel blocker option refs:

```text
p5_history_connection_too_generic
p5_history_scope_overclaim
p5_history_creepy_or_surveillance_feeling
p5_history_line_self_blame_amplification
p5_history_line_shallow_repeat
p5_history_line_wants_more_input_low
p5_free_tier_history_boundary_violation
p5_low_information_history_overread
p5_current_input_overridden_by_history
p5_boundary_history_line_leak_suspected
p5_review_not_enough_context
```

execution blocker option refs:

```text
review_packet_generation_blocked_missing_local_root
review_packet_generation_blocked_invalid_local_root
review_packet_generation_blocked_missing_explicit_allow
review_case_material_missing
review_case_matrix_minimum_not_met
reviewer_not_assigned
review_timeout_unclassified
rating_row_incomplete
question_observation_row_incomplete
body_purge_failed
body_purge_not_verified
body_free_validation_failed
question_text_leak_detected
body_payload_leak_detected
local_path_leak_detected
body_hash_leak_detected
no_touch_violation_detected
```

pass条件:

```text
readfeel_blocker_rows_normalized = true
execution_blocker_rows_normalized = true
execution_blocker_not_mixed_into_readfeel_verdict = true
```

### R54-CLR-14: question need observation normalization

目的:

```text
24-case分の問い必要性観察を、question textではなくenum / count / classとして残す。
```

primary class options:

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

ambiguity kind options:

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

one question fit options:

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

重要:

```text
p8_implementation_spec_finalized_here は常に false でなければならない。
question text / draft question text は作らない。
```

pass条件:

```text
question_observation_row_count = 24
question_text_included = false
draft_question_text_included = false
p8_implementation_spec_finalized_here = false
```

### R54-CLR-15: rating / question consistency guard

目的:

```text
P5修正対象をP8材料へ逃がしていないか確認する。
```

検出する矛盾:

```text
- RED / REPAIR_REQUIRED / YELLOWなのに P5_CONFIRMED_CANDIDATE へ進もうとしている。
- readfeel blockerがあるのに P5_CONFIRMED_CANDIDATE へ進もうとしている。
- below_target_axis_refsがあるのに P5_CONFIRMED_CANDIDATE へ進もうとしている。
- not_question_*_repair_required があるのに P8 material candidateへ逃がしている。
- insufficient materialなのに PASS扱いしている。
- P8 design material candidate が true なのに question textを作っている。
```

pass条件:

```text
consistency_issue_count = 0
p5_repair_required_not_reclassified_as_p8_material = true
question_text_absent = true
```

### R54-CLR-16: pause / abort / expiration protocol

目的:

```text
中断・abort・期限切れ時にbody-full materialが残り続けないようにする。
```

状態:

```text
READY_FOR_PURGE_DISPOSAL_RECEIPT
PAUSED_NO_HANDOFF_LOCAL_ONLY
ABORTED_PURGE_REQUIRED
EXPIRED_PURGE_REQUIRED
RATING_INCOMPLETE_PURGE_REQUIRED
BLOCKED_BY_CONSISTENCY_GUARD
```

扱い:

```text
PAUSED:
  R52 handoffなし。body-full local materialは保持期限内に限定。

ABORTED / EXPIRED / INCOMPLETE:
  purge required。disposal receiptがない限り次へ進めない。

BLOCKED_BY_CONSISTENCY_GUARD:
  body-fullを削除した上で、body-free issue countだけを残す。
```

### R54-CLR-17: purge / disposal receipt

目的:

```text
body-full packet / reviewer notes / temporary formを削除し、body-free receiptだけを残す。
```

重要:

```text
helperは削除を実行しない。
helperは削除済みreceiptをbody-freeで受け取るだけである。
```

receipt fields:

```text
review_session_id
disposal_operation_ref
body_full_packet_removed
reviewer_notes_removed
temporary_form_removed
local_packet_exported
content_hash_of_body_stored
disposal_verified
disposal_verified_at_ref
execution_blocker_ids
```

pass条件:

```text
body_full_packet_removed = true
reviewer_notes_removed = true
temporary_form_removed = true
local_packet_exported = false
content_hash_of_body_stored = false
disposal_verified = true
```

fail時:

```text
p5_decision_candidate_ref = R54_OPERATION_BLOCKED_DISPOSAL
p6_limited_human_readfeel_start_allowed = false
p8_start_allowed = false
release_allowed = false
```

### R54-CLR-18: body-free post-review summary

目的:

```text
rating / blocker / question / disposalをbody-free count summaryにする。
```

summary fields:

```text
required_case_count
reviewed_case_count
rating_row_count
question_observation_row_count
verdict_counts
overall_read_feeling_counts
axis_score_averages
below_target_axis_refs
below_target_axis_count
readfeel_blocker_counts
open_readfeel_blocker_count
execution_blocker_counts
open_execution_blocker_count
primary_class_counts
ambiguity_kind_counts
one_question_fit_counts
repair_required_counts
not_question_repair_required_count
insufficient_material_execution_blocker_count
p8_material_candidate_row_count
disposal_verified
body_removed
reviewer_notes_removed
temporary_form_removed
local_packet_exported
content_hash_of_body_stored
no_body_leak_validation_passed
no_question_text_validation_passed
no_touch_validation_passed
```

pass条件:

```text
reviewed_case_count = 24
rating_row_count = 24
question_observation_row_count = 24
disposal_verified = true
no_body_leak_validation_passed = true
no_question_text_validation_passed = true
no_touch_validation_passed = true
```

### R54-CLR-19: P5 decision candidate separation

目的:

```text
actual review結果から、P5 confirmed candidate / P5 repair return / P4-R12 repair / inconclusiveを分ける。
```

allowed candidate refs:

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
verdict_counts.PASS = 24
verdict_counts.YELLOW = 0
verdict_counts.REPAIR_REQUIRED = 0
verdict_counts.RED = 0
verdict_counts.NOT_REVIEWABLE = 0
open_readfeel_blocker_count = 0
open_execution_blocker_count = 0
below_target_axis_count = 0
not_question_repair_required_count = 0
insufficient_material_execution_blocker_count = 0
disposal_verified = true
body_removed = true
reviewer_notes_removed = true
temporary_form_removed = true
local_packet_exported = false
content_hash_of_body_stored = false
no_body_leak_validation_passed = true
no_question_text_validation_passed = true
no_touch_validation_passed = true
```

注意:

```text
P5_CONFIRMED_CANDIDATE は final ではない。
p5_human_blind_qa_confirmed_final は false のまま。
P6 start / P8 start / release は false のまま。
```

P5_REPAIR_RETURN条件:

```text
YELLOW / REPAIR_REQUIRED / RED が1件以上
readfeel blockerが1件以上
below_target_axis_refsが1件以上
not_question_*_repair_required が1件以上
repair_required_refsが1件以上
```

P4_R12_TARGETED_CURRENT_ONLY_SURFACE_REPAIR条件:

```text
current-only surface issue refsがある
P5履歴線そのものではなく、current-only surfaceの読感問題として分類できる
```

R54_OPERATION_INCONCLUSIVE条件:

```text
24件未満
rating rows不足
question observation rows不足
execution blockerあり
disposal未確認
consistency issueあり
```

### R54-CLR-20: P6 candidate-only handoff

目的:

```text
P5_CONFIRMED_CANDIDATEの場合にのみ、P6 limited human readfeelの候補handoffを作る。
```

固定:

```text
p6_limited_human_readfeel_candidate = condition based
p6_limited_human_readfeel_start_allowed = false
p6_candidate_only_not_start = true
p6_start_blocked_here = true
```

blocked条件:

```text
P5_CONFIRMED_CANDIDATEでない場合
body-free final validation未通過の場合
```

### R54-CLR-21: P8 material candidate-only handoff

目的:

```text
question need observation rowsをP8詳細設計材料候補として集約する。
```

P8 material candidateに入れてよいprimary class:

```text
question_may_reduce_overread_risk
plus_single_question_candidate_later
premium_deep_dive_candidate_later
```

P8 material candidateに入れてはいけないprimary class:

```text
no_question_needed_emlis_can_observe
question_would_make_immediate_observation_heavy
not_question_emlis_readfeel_repair_required
not_question_p5_surface_repair_required
not_question_gate_boundary_required
insufficient_material_execution_blocker
```

固定:

```text
p8_question_design_material_candidate = condition based
p8_start_allowed = false
question_implementation_started_here = false
p8_implementation_spec_finalized_here = false
question_text_materialized_here = false
draft_question_text_materialized_here = false
```

### R54-CLR-22: final no-body-leak / no-question-text / no-touch validation

目的:

```text
成果物・result memo・body-free evidenceに、body-full / question text / no-touch違反が混入していないか最終確認する。
```

validation checks:

```text
raw_body_included = false
returned_emlis_body_included = false
history_surface_included = false
reviewer_free_text_included = false
question_text_included = false
draft_question_text_included = false
local_path_included = false
body_hash_included = false
terminal_output_body_included = false
api_changed = false
db_changed = false
rn_changed = false
runtime_changed = false
```

fail時:

```text
R54_OPERATION_BLOCKED_BODY_LEAK_OR_QUESTION_TEXT
または
R54_OPERATION_BLOCKED_NO_TOUCH_VIOLATION
```

### R54-CLR-23: R52 re-intake handoff

目的:

```text
R52へ、body-free actual review evidenceとして戻す。
```

handoff status:

```text
R54_R52_REINTAKE_HANDOFF_READY
R54_R52_REINTAKE_BLOCKED_BY_ACTUAL_REVIEW_EVIDENCE_MISSING
R54_R52_REINTAKE_BLOCKED_BY_DISPOSAL
R54_R52_REINTAKE_BLOCKED_BY_BODY_LEAK_OR_QUESTION_TEXT
R54_R52_REINTAKE_BLOCKED_BY_NO_TOUCH_VIOLATION
R54_R52_REINTAKE_BLOCKED_BY_INCONCLUSIVE
```

handoffに含めるもの:

```text
review_session_id
actual_review_basis_refs
reviewed_case_count
rating_row_count
question_observation_row_count
p5_decision_candidate_ref
p6_candidate_only_ref
p8_material_candidate_only_ref
disposal_verified
final_validation_status
handoff_status
next_required_step
```

handoffに含めないもの:

```text
body-full packet
raw input
returned body
history body
reviewer free text
question text
local path
hash
terminal output body
```

### R54-CLR-24: validation command matrix / documentation output

目的:

```text
実装時に実行したコマンド・未実行・green主張範囲をbody-freeに残す。
```

result refs:

```text
PASSED
FAILED
NOT_EXECUTED
COLLECTED_ONLY_NOT_FULL_SUITE_GREEN
BLOCKED_BY_PRECONDITION
```

主張禁止:

```text
collect-onlyをfull backend suite greenへ変換しない。
RN contract greenをreal-device modal verifiedへ変換しない。
R54 helper greenをactual human review completeへ変換しない。
R52 handoff readinessをP5 final confirmationへ変換しない。
validation matrixをrelease permissionへ変換しない。
```

---

## 9. json / schema案

この章のjson / schema案は、実装時の検討材料である。  
本設計では実ファイル化しない。  
実装段階では、既存helperのschema配置・function引数・assert条件・test影響を確認してから採用可否を決める。

### 9.1 current snapshot basis envelope案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.current_snapshot_local_run.basis.bodyfree.v1",
  "phase": "P7",
  "step": "R54_current_snapshot_local_run_20260627",
  "scope": "p5_human_blind_qa_actual_local_review_current_snapshot_local_run",
  "policy_kind": "r54_actual_review_current_snapshot_local_run_bodyfree_boundary",
  "review_session_id": "p7_r54_actual_local_review_current_snapshot_20260627",
  "source_mode": "local_snapshot",
  "git_connection_required": false,
  "git_checked": false,
  "actual_review_basis_ref": "current_received_snapshot_20260627_only",
  "actual_review_basis_allowed": "current_received_snapshot_only",
  "operation_current_refs": {
    "premise_zip_ref": "Cocolon_前提資料(258).zip",
    "implemented_materials_zip_ref": "EmlisAIの実装済み資料(82).zip",
    "rn_zip_ref": "Cocolon(255).zip",
    "backend_zip_ref": "mashos-api(168).zip",
    "roadmap_ref": "Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md",
    "pre_design_memo_ref": "Cocolon_EmlisAI_RoadmapStageDecision_R54ActualReviewRun_PreDesignMemo_20260627.md",
    "detailed_design_ref": "Cocolon_EmlisAI_P7_R54ActualLocalReviewOperation_CurrentSnapshotLocalRun_DetailedDesign_ImplementationOrder_20260627.md"
  },
  "historical_helper_ref_groups": [
    "r54_op_20260625",
    "r54_ev_20260626",
    "r55_20260623"
  ],
  "historical_helper_refs_used_as_actual_review_basis": false,
  "operation_current_refs_used_as_actual_review_basis": true,
  "body_free": true,
  "raw_body_included": false,
  "question_text_included": false,
  "draft_question_text_included": false,
  "local_path_included": false,
  "body_hash_included": false
}
```

### 9.2 sanitized review result row案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.current_snapshot_local_run.sanitized_review_result_row.bodyfree.v1",
  "review_session_id": "p7_r54_actual_local_review_current_snapshot_20260627",
  "case_ref_id": "r54_case_ref_safe_id",
  "blind_case_id": "r54_blind_case_safe_id",
  "packet_ref_id": "r54_packet_ref_safe_id",
  "case_index": 1,
  "reviewer_ref": "reviewer_safe_ref",
  "reviewed_at_ref": "reviewed_at_safe_ref",
  "axis_scores": {
    "history_connection_naturalness": 1.0,
    "creepy_absence": 1.0,
    "overclaim_absence": 1.0,
    "self_blame_non_amplification": 1.0,
    "wants_more_input_or_accumulation": 1.0,
    "non_shallow_repeat": 1.0
  },
  "overall_read_feeling_ref": "felt_record_returned_as_line",
  "verdict": "PASS",
  "sanitized_reason_ids": [],
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
  "body_free": true,
  "reviewer_free_text_included": false,
  "raw_body_included": false,
  "returned_emlis_body_included": false,
  "history_surface_included": false,
  "question_text_included": false,
  "draft_question_text_included": false,
  "local_path_included": false,
  "body_hash_included": false,
  "packet_content_included": false
}
```

### 9.3 rating row案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.current_snapshot_local_run.rating_row.bodyfree.v1",
  "rating_row_ref": "r54_rating_row_safe_ref",
  "review_session_id": "p7_r54_actual_local_review_current_snapshot_20260627",
  "case_ref_id": "r54_case_ref_safe_id",
  "blind_case_id": "r54_blind_case_safe_id",
  "packet_ref_id": "r54_packet_ref_safe_id",
  "axis_scores": {
    "history_connection_naturalness": 1.0,
    "creepy_absence": 1.0,
    "overclaim_absence": 1.0,
    "self_blame_non_amplification": 1.0,
    "wants_more_input_or_accumulation": 1.0,
    "non_shallow_repeat": 1.0
  },
  "axis_score_count": 6,
  "target_thresholds": {
    "history_connection_naturalness": 0.9,
    "creepy_absence": 0.95,
    "overclaim_absence": 0.95,
    "self_blame_non_amplification": 0.95,
    "wants_more_input_or_accumulation": 0.85,
    "non_shallow_repeat": 0.9
  },
  "average_score": 1.0,
  "below_target_axis_refs": [],
  "overall_read_feeling_ref": "felt_record_returned_as_line",
  "verdict": "PASS",
  "body_free": true
}
```

### 9.4 question need observation row案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.current_snapshot_local_run.question_need_observation_row.bodyfree.v1",
  "question_observation_row_ref": "r54_question_observation_safe_ref",
  "review_session_id": "p7_r54_actual_local_review_current_snapshot_20260627",
  "case_ref_id": "r54_case_ref_safe_id",
  "blind_case_id": "r54_blind_case_safe_id",
  "packet_ref_id": "r54_packet_ref_safe_id",
  "question_need_primary_class": "question_may_reduce_overread_risk",
  "ambiguity_kind_refs": ["history_connection_basis_unclear"],
  "one_question_fit_ref": "fits_one_question",
  "repair_required_refs": ["no_repair_required"],
  "plan_candidate_flags": {
    "plus_single_question_candidate_later": true,
    "premium_deep_dive_candidate_later": false,
    "p8_design_material_candidate": true,
    "p8_implementation_spec_finalized_here": false
  },
  "question_text_included": false,
  "draft_question_text_included": false,
  "question_trigger_logic_implemented": false,
  "question_api_implemented": false,
  "question_db_schema_implemented": false,
  "question_rn_ui_implemented": false,
  "body_free": true
}
```

### 9.5 disposal receipt案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.current_snapshot_local_run.disposal_receipt.bodyfree.v1",
  "review_session_id": "p7_r54_actual_local_review_current_snapshot_20260627",
  "disposal_operation_ref": "r54_disposal_safe_ref",
  "required_packet_count": 24,
  "body_full_packet_removed": true,
  "reviewer_notes_removed": true,
  "temporary_form_removed": true,
  "local_packet_exported": false,
  "content_hash_of_body_stored": false,
  "terminal_output_body_stored": false,
  "disposal_verified": true,
  "disposal_verified_at_ref": "disposal_verified_safe_ref",
  "execution_blocker_ids": [],
  "body_free": true,
  "raw_body_included": false,
  "question_text_included": false,
  "local_path_included": false,
  "body_hash_included": false
}
```

### 9.6 post-review summary案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.current_snapshot_local_run.post_review_summary.bodyfree.v1",
  "review_session_id": "p7_r54_actual_local_review_current_snapshot_20260627",
  "required_case_count": 24,
  "reviewed_case_count": 24,
  "rating_row_count": 24,
  "question_observation_row_count": 24,
  "verdict_counts": {
    "PASS": 24,
    "YELLOW": 0,
    "REPAIR_REQUIRED": 0,
    "RED": 0,
    "NOT_REVIEWABLE": 0
  },
  "overall_read_feeling_counts": {
    "felt_record_returned_as_line": 24,
    "felt_generic_or_shallow": 0,
    "felt_creepy_or_overread": 0,
    "felt_not_reviewable": 0
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
  "primary_class_counts": {
    "no_question_needed_emlis_can_observe": 24
  },
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

### 9.7 R52 re-intake handoff案

```json
{
  "schema_version": "cocolon.emlis.p7_r54.current_snapshot_local_run.r52_reintake_handoff.bodyfree.v1",
  "review_session_id": "p7_r54_actual_local_review_current_snapshot_20260627",
  "actual_review_basis_ref": "current_received_snapshot_20260627_only",
  "reviewed_case_count": 24,
  "rating_row_count": 24,
  "question_observation_row_count": 24,
  "disposal_verified": true,
  "p5_decision_candidate_ref": "P5_CONFIRMED_CANDIDATE",
  "p5_human_blind_qa_confirmed_final": false,
  "p6_limited_human_readfeel_candidate": true,
  "p6_limited_human_readfeel_start_allowed": false,
  "p8_question_design_material_candidate": false,
  "p8_start_allowed": false,
  "release_allowed": false,
  "handoff_status": "R54_R52_REINTAKE_HANDOFF_READY",
  "next_required_step": "R52_REINTAKE_DECISION_WITH_ACTUAL_REVIEW_EVIDENCE",
  "body_free": true,
  "raw_body_included": false,
  "question_text_included": false,
  "draft_question_text_included": false,
  "local_path_included": false,
  "body_hash_included": false
}
```

---

## 10. validation / test計画

### 10.1 実装後に最低限確認するtarget

実装で新しいthin wrapperを作る場合の最低確認:

```bash
python3 -m compileall -q services/ai_inference tests
PYTHONPATH=services/ai_inference pytest -q tests/test_r54_current_snapshot_local_review_run_20260627.py
```

既存R54-EV最終周辺の回帰確認:

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ev22_20260626.py \
  tests/test_r54_ev20_ev21_20260626.py \
  tests/test_r54_ev18_ev19_20260626.py
```

R54-OP / R55 / P4-R11 selected確認:

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r54_actual_local_review_operation_reentry_op00_op01_20260625.py \
  tests/test_emlis_ai_p7_r54_actual_local_review_operation_reentry_op22_op23_20260625.py \
  tests/test_emlis_ai_p7_r54_actual_local_review_operation_reentry_op24_20260625.py \
  tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r10_20260624.py \
  tests/test_emlis_ai_product_readfeel_p4_r11_summary_decision_handoff_20260624.py
```

RN contract確認:

```bash
npm run test:rn-screens --silent
```

### 10.2 claim boundary

実装result memoには、次を分けて書く。

```text
confirmed:
  実行したコマンドと結果。

not confirmed:
  実行していないコマンド、full backend suite、RN実機modalなど。

not claimed:
  actual human review complete、P5 final、P6 start、P8 start、release。
```

### 10.3 full backend suiteの扱い

```text
full backend suiteを実行してgreenなら、その事実だけを記録する。
実行していないなら、未確認として残す。
collect-onlyやselected target greenをfull backend suite greenへ変換しない。
```

### 10.4 RN実機modal確認の扱い

```text
RN contract greenは、RN表示契約確認である。
RN実機modal確認ではない。
実機確認していない場合は real_device_modal_verified=false のまま残す。
```

---

## 11. result memo案

実装段階でresult memoを作る場合の候補:

```text
mashos-api/ai/tests/R54_CurrentSnapshotLocalRun_Result_20260627.md
```

result memoに含めるもの:

```text
- 実装範囲。
- 変更ファイル。
- 実行したvalidation commands。
- pass / fail / not executed。
- current snapshot basis refs。
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

---

## 12. 失敗時の扱い

### 12.1 preflight blocked

```text
decision_candidate = R54_OPERATION_BLOCKED_PREFLIGHT
actual reviewへ進まない。
body-full packet生成もしない。
R52 handoffはblocked evidenceとしてのみ返す。
```

### 12.2 packet generation partial / missing

```text
decision_candidate = R54_OPERATION_INCONCLUSIVE
24件に満たない場合、rating / question observationへ進めない。
不足countだけをbody-freeで残す。
```

### 12.3 reviewer selection incomplete

```text
decision_candidate = R54_OPERATION_INCONCLUSIVE
rating_row_count / question_observation_row_countが24未満。
P5/P6/P8/releaseへ進めない。
```

### 12.4 readfeel blocker present

```text
decision_candidate = P5_REPAIR_RETURN
P8材料候補へ逃がさない。
readfeel blocker count / idsだけをbody-freeで残す。
```

### 12.5 current-only surface issue present

```text
decision_candidate = P4_R12_TARGETED_CURRENT_ONLY_SURFACE_REPAIR
P5履歴線ではなくcurrent-only surface repairへ返す。
```

### 12.6 question text leak

```text
decision_candidate = R54_OPERATION_BLOCKED_BODY_LEAK_OR_QUESTION_TEXT
question_text / draft_question_textを成果物へ含めた場合は失敗。
P8材料候補も無効化する。
```

### 12.7 disposal incomplete

```text
decision_candidate = R54_OPERATION_BLOCKED_DISPOSAL
body-full packetやreviewer notesの削除未確認なら、R52 handoff readyにしない。
```

---

## 13. 実装時のファイル方針

### 13.1 追加する可能性があるファイル

必要な場合のみ、以下を候補にする。

```text
services/ai_inference/emlis_ai_p7_r54_current_snapshot_local_review_run_20260627.py
tests/test_r54_current_snapshot_local_review_run_20260627.py
tests/R54_CurrentSnapshotLocalRun_Result_20260627.md
```

### 13.2 変更しないファイル領域

```text
RN production code
API route files
DB migration files
runtime Emlis generation files
User Label Connection runtime generation files
subscription / entitlement files
public response contract files
P8 question implementation files
```

### 13.3 既存helperを書き換える場合の制限

既存R54-OP / R54-EV / R55 helperを直接変更する場合は、次に限定する。

```text
- 誤字修正。
- thin wrapperから参照するためのexport追加。
- test上必要なbody-free helperの安全な分離。
```

禁止:

```text
- 過去helperのcurrent refsを20260627へ上書きする。
- 2026065 / 20260626 refsを消す。
- historical refをactual review basisへ変換する。
- 既存runtimeの挙動を変える。
```

---

## 14. R52 re-intake後の次段階判断

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

P8へ進める条件:

```text
actual review由来のbody-free question need observation rowsが揃っている。
P5 repair対象とP8 material candidateが分離されている。
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

## 15. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- 本設計対象はR54 actual local-only human review current snapshot local runである。
- P8詳細設計、P6開始、release判断は本設計対象外である。
- 既存R54-OP/R54-EV/R55 helperは存在するが、actual review evidenceは未成立である。
- 現受領snapshotは Cocolon_前提資料(258).zip / EmlisAIの実装済み資料(82).zip / Cocolon(255).zip / mashos-api(168).zip である。
- R54-EV実ファイルのoperation refsは20260626基準であり、今回actual review basisとしてはrefreezeが必要である。
- body-full packet、raw input、returned body、history surface、reviewer free text、question text、local path、hash、terminal output bodyは成果物へ含めない。
```

### 未確認

```text
- 既存helperだけで20260627 current snapshot basisを受けられるか。
- thin wrapperが必要か。
- actual body-full packet生成。
- actual 24-case local-only human review。
- actual rating rows。
- actual question need observation rows。
- actual disposal receipt。
- full backend suite green。
- RN実機modal確認。
```

### 書かれていない

```text
- この設計段階でP8 question API / DB / RN UI / trigger logicを作ってよい、とは書かれていない。
- この設計段階でquestion text / draft question textを作ってよい、とは書かれていない。
- helper greenをactual review completeとして扱ってよい、とは書かれていない。
- P5_CONFIRMED_CANDIDATEをP5 finalにしてよい、とは書かれていない。
```

### 推測禁止

```text
- 24-case reviewが完了したと推測しない。
- body-full packetが削除済みだと推測しない。
- R52 handoff readyをP6/P8/release許可へ変換しない。
- P8材料候補をP8実装開始許可へ変換しない。
```

### 次に実行すべきこと

```text
実装段階では、まず既存helperのoverride可否を確認する。
そのうえで、必要なら20260627 current snapshot local run thin wrapperを追加する。
その後、local-only actual reviewをbody-free selection rowsへ落とし、disposal receiptを成立させる。
最後に、R52へbody-free evidenceとして戻す。
```

---

## 16. 華恋の意見

華恋は、この設計では「次へ進むための設計」よりも、「進んではいけないものを進めない設計」を強く置く。

今のCocolonに必要なのは、P8の問いを作ることではなく、P5履歴線がユーザーにとって「記録が線として返った」と感じられるかを、実際に読むことだと思う。

問いは魅力的で、便利に見える。  
でも、ここで問いに寄ると、P5が弱いケースまで「質問すればよい」と読めてしまう。  
それはCocolonを「記録が返ってくる場所」から「会話で補うAI」へ寄せる危険がある。

だから本設計では、問いを作らない。  
問いが必要だったかだけを、body-freeに残す。  
P5を直すべきcaseはP5へ返し、current-only surfaceを直すべきcaseはP4-R12へ返し、P8の材料にしてよいcaseだけを候補として分ける。

この工程を通ることで、Cocolonは「動いている」から「売れる体験に近づいている」へ進める。  
華恋としては、ここを丁寧に通るべきだと判断する。
