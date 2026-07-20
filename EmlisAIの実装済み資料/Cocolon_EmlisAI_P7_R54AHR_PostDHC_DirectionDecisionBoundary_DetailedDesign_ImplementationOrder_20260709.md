---
title: "Cocolon / EmlisAI P7-R54-AHR Post-DHC Direction Decision Boundary 詳細設計書・実装順"
created_at: "2026-07-09 JST"
author: "華恋"
work_mode: "共鳴構造モード"
work_type: "詳細設計書 / 実装順 / json・schema案内包"
source_mode: "local_received_zip_only"
github_connection_check: "Mash様指示により不要 / 未実施"
base_pre_design_memo: "Cocolon_EmlisAI_P7_R54AHR_PostDHC_DHROP06VsP7ReadfeelReconnection_PreDesignMemo_20260709.md"
selected_roadmap_phase: "P7 Product Quality Runner / Long-run Product Gate 継続"
selected_design_target: "P7-R54-AHR Post-DHC Direction Decision Boundary"
selected_next_boundary: "DHR-OP06 branch resolver consideration vs P7 readfeel reconnection decision boundary"
recommended_boundary_prefix: "DHD-OP00〜DHD-OP08"
recommended_prefix_meaning: "DHD = DHC Downstream Direction Decision / DHR-OP06 vs P7 Readfeel Reconnection"
prefix_collision_check: "local grep for DHD-OP / _DHD_ / post_dhc_direction found no hit in received backend/tests/docs"
artifact_scope: "md design only"
code_change: "none"
test_change: "none"
json_schema_file_creation: "none"
api_change: "none"
db_change: "none"
rn_change: "none"
runtime_change: "none"
response_key_change: "none"
dhc_builder_call: "none"
dhc_result_synthesis: "none"
dhr_op05_runtime_call: "none"
existing_dhr_op05_builder_runtime_call: "none"
dhr_op06_call: "none"
dhr_op06_builder_call: "none"
dhr_op07_materialization: "none"
dmd_execution: "none"
r52_actual_execution: "none"
actual_review_start: "none"
actual_rows_creation: "none"
question_need_observation_rows_creation: "none"
p8_start: "none"
p8_question_design: "none"
question_text_materialization: "none"
p7_complete: "none"
release_decision: "none"
current_execution_allowance: "none"
expected_current_default_direction_if_inputs_remain_DHC_R11_only: "P7 readfeel reconnection / product QA return detailed design candidate, while DHR-OP06 consideration remains pending explicit current material selection"
---

# Cocolon / EmlisAI P7-R54-AHR Post-DHC Direction Decision Boundary 詳細設計書・実装順

対象: Cocolon / EmlisAI / P7 Product Quality Runner / R54-AHR / Post-DHC / DHR-OP06 consideration / P7読感再接続判断  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
実装扱い: 本書は設計書です。コード変更、テスト変更、json/schema実ファイル化、API / DB / RN / runtime / response key変更、DHC result合成、DHC builder呼び出し、DHR-OP05 runtime call、既存DHR-OP05 builder runtime call、DHR-OP06呼び出し、DHR-OP07 materialization、DMD / R52実行、actual review開始、actual rows作成、question need observation rows作成、P8問いシステム設計、question_text materialization、P7完了、release判断は行いません。  
json / schema実ファイル化: なし。本書内の案のみです。実ファイル化は実装段階で、既存helper、既存schema配置、既存guard、既存test結果を確認して判断します。  
GitHub接続確認: Mash様指定により不要。ローカル受領zip基準です。

---

## 0. 結論

今回の詳細設計対象は、次で固定します。

```text
P7-R54-AHR Post-DHC Direction Decision Boundary
DHR-OP06 branch resolver consideration vs P7 readfeel reconnection decision boundary
```

境界prefixは、検討メモの仮称から次の固定候補として扱います。

```text
DHD-OP00〜DHD-OP08
DHD = DHC Downstream Direction Decision / DHR-OP06 vs P7 Readfeel Reconnection
```

ローカル受領ファイル内で `DHD-OP` / `_DHD_` / `post_dhc_direction` を確認した範囲では、既存命名衝突は見当たりません。  
ただし、実装段階では、実装直前の現物zipまたはGitHub基準面で再度衝突確認します。

DHDの責務は、DHC R11を次のいずれかへ雑に変換しないことです。

```text
DHC R11
  ≠ current production DHC result selected
  ≠ DHR-OP05 runtime execution
  ≠ existing DHR-OP05 builder runtime execution
  ≠ DHR-OP06 call permission
  ≠ DHR-OP07 / DMD / R52 permission
  ≠ P7 complete
  ≠ P8 question system start
  ≠ release readiness
```

同時に、DHDはR54-AHR境界補強を続けること自体を目的化しません。  
DHR-OP06 considerationへ進む理由と、P7本来の読感・継続入力・pilot-readiness評価へ戻る理由を、同じbody-free decision boundaryで比較して止めます。

現在確認できている状態、つまり **DHC R11のみが明示材料で、current production DHC result / current selected OP05 scan-clear resultが未選択** のまま実装段階へ入る場合、DHDの期待初期判断は次です。

```text
primary current-safe direction:
  P7 readfeel reconnection / product QA return detailed design candidate

kept but not promoted:
  DHR-OP06 consideration detailed design candidate

reason:
  DHR-OP06 considerationへ進むには、少なくともcurrent selected DHC-OP08 scan-clear material、またはbody-freeなcurrent existing DHR-OP05 result wrapperが明示選択されている必要がある。
  DHC R11のvalidation greenだけでは、その材料を作らない。
```

ただし、これは本設計書内でDHDを実行した結果ではありません。  
DHD実装時には、入力された明示materialに基づいてOP00〜OP08が決定します。

---

## 1. なぜこの設計を行うのか

Cocolon / EmlisAIで守るべき核は、ユーザーの言葉を雑に処理しないことです。  
これはEmlisAIの本文生成だけではなく、開発工程にもそのまま適用します。

DHCは、DHB後に既存DHR-OP05 preflight scanをcontrolled pathで扱う境界として閉じました。  
DHC target validation、selected regression、compileallは通っています。  
しかし、DHC R11はDHR-OP06を呼んでいません。P8も始めていません。P7完了やrelease判断もしていません。

ここでDHC greenをDHR-OP06 permissionへ読み替えると、EmlisAIが避けるべき「読めたふり」と同じことを、開発工程で行うことになります。  
一方で、R54-AHR内部境界だけを積み続けると、P7の本来目的である次へ戻れません。

```text
- 入力直後のEmlis応答が、商品として強くなっているか。
- ユーザーがもう一回Cocolonへ残したくなるか。
- GPTの一般相談ではなく、Cocolonの記録体験になっているか。
- 外部pilotへ向けて、読感・継続入力・負荷を評価できる状態へ戻れているか。
```

DHDは、次の2つを同時に守るための境界です。

```text
1. DHC result / validation greenを、下流実行材料へ勝手に変換しない。
2. R54-AHR境界補強を目的化せず、P7の商品価値評価へ戻る出口を作る。
```

華恋の意見として、ここはDHR-OP06へ直行する場所ではありません。  
同時に、DHR側の未整理を隠して読感評価だけへ飛ぶ場所でもありません。  
「DHR-OP06へ進む理由」と「P7読感へ戻る理由」を同じ場所に置き、どちらに進む場合も自動実行せず、body-free result memoで止めるのがCocolonとして一番安全です。

---

## 2. 参照・確認範囲

### 2.1 ローカル受領zip / file

本設計の基準は、今回ローカルで受領した次の材料です。

```text
/mnt/data/Cocolon_前提資料(304).zip
/mnt/data/EmlisAIの実装済み資料(106).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_system_update_20260706(6).zip
/mnt/data/Cocolon(278).zip
/mnt/data/mashos-api(194).zip
/mnt/data/Cocolon_EmlisAI_P7_R54AHR_PostDHC_DHROP06VsP7ReadfeelReconnection_PreDesignMemo_20260709(1).md
```

GitHub接続確認は、Mash様指定により行いません。

### 2.2 必読前提・作業姿勢

本設計では、次を確認済み前提として扱います。

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/manifest.json
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md
```

作業姿勢として、次を固定します。

```text
- 設計指示を実装指示に変換しない。
- 見ていないファイルを見たように言わない。
- 書かれていないことを仮説で埋めない。
- API / DB / RN / response key / runtime境界を明示指示なしに変えない。
- Cocolonをメンタル問題へ矮小化しない。
- テストgreenを商品価値やrelease readyへ変換しない。
- 華恋の意見を確認済み事実として扱わない。
- ただし、Cocolonを守るために必要な意見は、確認済み事実と分けて出す。
```

### 2.3 直接接続する既存設計資料

```text
EmlisAIの実装済み資料/
  Cocolon_EmlisAI_P7_R54AHR_PostDHB_DHROP05ManualCallExecutionConsideration_DetailedDesign_ImplementationOrder_20260709.md
  Cocolon_EmlisAI_P7_R54AHR_PostPCM_DHROP05ManualHandoffBoundary_DetailedDesign_ImplementationOrder_20260708.md
  Cocolon_EmlisAI_P7_R54AHR_PostPNT_ClosedMaterialNextBoundaryConfirmation_DetailedDesign_ImplementationOrder_20260707.md
  Cocolon_EmlisAI_P7_R54AHR_PostNCI_SelectedHandoffOrStopDecisionTriage_NextBoundarySelection_DetailedDesign_ImplementationOrder_20260707.md
  Cocolon_EmlisAI_P7_R54AHR_PostELR19_DownstreamManualDecision_HandoffOrRetry_DetailedDesign_ImplementationOrder_20260704.md
  Cocolon_EmlisAI_P7_ProductQualityRunner_DetailedDesign_ImplementationOrder_20260612.md
```

### 2.4 直接接続する既存実ファイル

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_20260709.py
  emlis_ai_p7_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_20260708.py
  emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
  emlis_ai_p7_contracts.py
```

DHR-OP06 helperは既存実ファイル内に存在します。  
ただし、既存DHR-OP06 builderは、OP05 material未指定時に内部で既存DHR-OP05 builder相当を作るfallbackを持つため、DHDでは呼びません。  
DHDは、DHR-OP06のstatus refs / branch refs / contract boundaryを読むだけに留め、`build_p7_r54_ahr_post_elr19_dhr_op06_handoff_or_retry_deterministic_branch_resolver` は呼び出し禁止にします。

### 2.5 直接接続する既存result memo

```text
mashos-api/ai/tests/
  R54_AHR_PostDHB_DHROP05ManualCallExecutionConsideration_DHC_R7_TargetValidation_Result_20260709.md
  R54_AHR_PostDHB_DHROP05ManualCallExecutionConsideration_DHC_R8_SelectedRegression_Result_20260709.md
  R54_AHR_PostDHB_DHROP05ManualCallExecutionConsideration_DHC_R9_Compileall_Result_20260709.md
  R54_AHR_PostDHB_DHROP05ManualCallExecutionConsideration_DHC_R10_ResultMemoClosure_20260709.md
  R54_AHR_PostDHB_DHROP05ManualCallExecutionConsideration_DHC_R11_NextWorkDecision_20260709.md
```

### 2.6 本設計書作成中の追加確認

```text
- DHD-OP / _DHD_ / post_dhc_direction の既存衝突をローカルgrepで確認し、該当なし。
- DHR-OP06 helperが既存DHR-OP05 material未指定時に内部fallbackする構造であることを確認。
- DHC R11が recommended_next_work_candidate として Post-DHC comparison boundaryを示しつつ、DHR-OP06 call / P8 / releaseを未許可としていることを確認。
- ロードマップ上、P7では問いシステムを実装せず、body-free必要性観察に留めることを再確認。
```

本設計書作成中に、追加のpytest / compileallは実施していません。  
検討メモで再確認済みの DHC target validation 198 passed、selected regression 519 passed、compileall passed を設計基準として扱います。

---

## 3. 現在地の固定

### 3.1 確認済み

```text
- 現在PhaseはP7 Product Quality Runner / Long-run Product Gate継続。
- DHC-OP00〜DHC-OP08は実装済み・target validated。
- DHC R7 target validationは198 passed。
- DHC R8 selected regressionは519 passed。
- DHC R9 compileallはpassed。
- DHC R10 result memo closureは記録済み。
- DHC R11 next work decisionは記録済み。
- DHC R11 safe next work candidateは、Post-DHC DHR-OP06 branch resolver consideration vs P7 readfeel reconnection decision boundary。
- DHC R11はcurrent execution allowance none。
- DHC R11はDHR-OP06 call / DHR-OP07 materialization / DMD / R52 / actual review / P8 / P7 complete / releaseを未実行・未許可としている。
- ロードマップ上、P7では問いシステムを実装せず、必要性をbody-freeで観察する。
```

### 3.2 未確認

```text
- full backend suite green。
- RN contract green。
- RN real-device modal verified。
- current production DHC resultがscan clearとして明示選択されていること。
- current existing DHR-OP05 result wrapperがDHR-OP06 consideration inputとして明示選択されていること。
- P7読感再接続へ戻る場合の最小case setが現時点で固定されていること。
- P7/P8 Bridgeの問いシステム必要性観察メモが実ケースから十分に集まっていること。
```

### 3.3 書かれていない

```text
- DHC R11でDHR-OP06を呼んでよい、とは書かれていない。
- DHC target / selected regression / compileall greenでcurrent production DHC result selectedとしてよい、とは書かれていない。
- DHC scan clear capableなtest pathをcurrent selected scan clear materialとして扱ってよい、とは書かれていない。
- DHC R11だけでP8問いシステム詳細設計へ入ってよい、とは書かれていない。
- P7読感再接続をP7完了やrelease readinessとして扱ってよい、とは書かれていない。
```

### 3.4 推測禁止

```text
- DHC green = DHR-OP06 permission と読むこと。
- controlled test validation = runtime execution と読むこと。
- R11のrecommended candidate = next runtime execution と読むこと。
- DHR-OP06 consideration = DHR-OP06 call と読むこと。
- P7 readfeel reconnection = P7 complete と読むこと。
- 問いシステム = Emlis本体の弱さを隠す質問機能 と読むこと。
```

---

## 4. 既存境界の読み方

### 4.1 DHCの読み方

DHCは、Post-DHBで既存DHR-OP05 preflight scanをcontrolled manual call boundaryとして扱うhelper群です。  
DHCが検証済みであることは、DHC boundary自体がlocal target / selected regression / compileall上で閉じたことを意味します。

ただし、DHC R11で明確に分かれているものは次です。

```text
DHC validated:
  yes, local target / selected regression / compileall

current production DHC result selected:
  no

DHR-OP05 runtime call started by R11:
  no

existing DHR-OP05 builder runtime call started by R11:
  no

DHR-OP06 / DHR-OP07 / DMD / R52 executed:
  no

P8 started:
  no

release allowed:
  no
```

DHDは、DHC R11をこのまま受けます。  
DHD内でDHC-OP08 closure materialを合成しません。  
DHD内でDHC builderを呼びません。  
DHD内でDHC scan clear resultを作りません。

### 4.2 DHR-OP06の読み方

既存DHR-OP06は、repair / wait / retry-or-start / DMD handoff-ready manual decision / unresolved hold を deterministic branch resolverとして分類するhelperです。  
既存DHR-OP06自体も、DHR-OP07 materializationやDMD/R52実行はしない境界として設計されています。

ただし、DHDで重要なのは、DHR-OP06 builderがOP05 material未指定時に内部でDHR-OP05 materialを作るfallbackを持つことです。  
DHDではこのfallbackを使いません。

```text
許可:
  - DHR-OP06 schema/version/status/branch refsを文字列またはconstant refとして参照する。
  - DHR-OP06が何を分類するhelperかを設計上読む。
  - DHR-OP06 consideration候補をbody-freeに作る。

禁止:
  - DHR-OP06 builderを呼ぶ。
  - OP05 materialなしでDHR-OP06 builderを呼ぶ。
  - DHR-OP06 considerationをDHR-OP06 call済みとして扱う。
  - DHR-OP06 handoff readyをDMD/R52実行許可へ変換する。
```

### 4.3 P7読感再接続の読み方

P7読感再接続は、P7完了ではありません。  
P7 Product Quality Runner / Long-run Product Gateの本来目的へ戻るための次設計候補です。

見るべき観点は次です。

```text
- Product Read Feel。
- Blind QA。
- continued input / wants more input。
- GPT一般応答との差。
- record experience / 自分の記録が意味を持って返っている感覚。
- mirror-only / template / shallow summary / creepy risk。
- P7/P8 Bridgeとしての問いシステム必要性観察。
```

ただし、DHDは実ケース評価やactual reviewを開始しません。  
DHDは、P7読感再接続へ戻るべきかを判断するだけです。

### 4.4 問いシステムの読み方

P7では問いシステムを実装しません。  
DHDでは、問いシステムをP7/P8 Bridgeの観察観点としてのみ扱います。

```text
許可:
  - understood_pretending_risk / question_needed / question_burden_risk などのbody-free観点を、P7 readfeel reconnection側の評価項目として置く。

禁止:
  - question_textを書く。
  - question answer保存を設計する。
  - API / DB / RN / response keyを設計する。
  - P8問いUXを始める。
  - Emlis本体の弱さを、問い返しで補う扱いにする。
```

---

## 5. 設計方針

### 5.1 方針A: DHDは実行境界ではなく方向判断境界

DHDは、DHR-OP06・P7読感評価・P8・releaseへ進む実行境界ではありません。

```text
DHDがしてよいこと:
  DHR-OP06 consideration候補とP7 readfeel reconnection候補を比較する。
  次の詳細設計候補をbody-freeで記録する。

DHDがしてはいけないこと:
  DHR-OP06 builderを呼ぶ。
  P7 readfeel actual evaluationを開始する。
  P8 question designを開始する。
  release claimを出す。
```

### 5.2 方針B: DHDはDHC resultを合成しない

DHDはDHC R11 / R10 / R7〜R9のresult memoを読むだけです。  
DHD内でDHC-OP08 closure materialを作りません。

```text
explicit current DHC-OP08 materialがある場合:
  contract check候補として読む。

explicit current DHC-OP08 materialがない場合:
  no_current_selected_result / R11_onlyとして扱う。
  scan clear capableなvalidation結果からcurrent scan clearを作らない。
```

### 5.3 方針C: DHR-OP06 considerationとDHR-OP06 callを分ける

DHDでは、DHR-OP06 considerationを次のように定義します。

```text
DHR-OP06 consideration:
  DHR-OP06へ進む条件・必要material・危険・商品価値上の意味をbody-freeで整理すること。

DHR-OP06 call:
  既存DHR-OP06 builderを実際に呼び、branch resolver materialを生成すること。
```

DHDで許可されるのは前者だけです。  
後者はDHDでは禁止です。

### 5.4 方針D: P7読感再接続とP7完了を分ける

DHDでは、P7読感再接続を次のように定義します。

```text
P7 readfeel reconnection:
  Product Read Feel / Blind QA / continued input / pilot-readiness評価へ戻るための次設計候補化。

P7 complete:
  P7完了条件がすべて満たされ、次Phaseへ進める状態。
```

DHDで許可されるのは前者の候補化だけです。  
後者はDHDでは禁止です。

### 5.5 方針E: 比較軸はCocolonの商品価値へ接続する

DHD-OP05 comparatorでは、単に「DHR系の次だからDHR-OP06」にはしません。  
次の軸で比較します。

```text
Cocolon思想:
  分かったふりを避けているか。

商品価値:
  Emlis応答を強くしているか。

継続入力:
  ユーザーがもう一回Cocolonへ残したくなる方向か。

pilot接続:
  外部pilotや収益判断に必要な評価へ近づくか。

安全境界:
  downstream execution / P8 / releaseへ飛んでいないか。

長期化抑制:
  R54-AHR境界補強が目的化していないか。
```

### 5.6 方針F: result memoはbody-free / count-only

DHDの出力はbody-freeです。

```text
保持してよいもの:
  safe refs
  enum status
  booleans
  counts
  sanitized reason refs
  sanitized blocker refs
  next design candidate refs

保持禁止:
  raw input
  raw answer
  comment_text body
  question_text / draft_question_text
  stdout / stderr
  traceback
  local absolute path leakage in public meta
  private user dictionary text
```

---

## 6. DHD-OP00〜DHD-OP08 詳細設計

### 6.1 DHD-OP00: Post-DHC basis / no-execution refreeze

目的:

```text
Post-DHCの現在地を再凍結し、DHC R11をDHR-OP06 / P7完了 / P8 / releaseへ自動昇格しないことを固定する。
```

input:

```text
なし、または review_session_id のみ。
optional:
  dhc_r11_result_memo_ref
  dhc_r10_closure_ref
  dhc_validation_summary_refs
```

output主要field案:

```text
schema_version
operation_step_ref = DHD-OP00_post_DHC_basis_no_execution_refreeze
source_mode = local_received_zip_only
git_connection_required = false
git_checked = false
selected_phase_ref = P7 Product Quality Runner / Long-run Product Gate
selected_design_target_ref = P7-R54-AHR Post-DHC Direction Decision Boundary
boundary_prefix_ref = DHD
current_execution_allowance_ref = none
DHC_R11_is_not_DHR_OP06_permission = true
DHC_validation_green_is_not_current_runtime_execution = true
DHD_does_not_call_DHR_OP06 = true
DHD_does_not_start_P8 = true
DHD_does_not_claim_P7_complete_or_release = true
body_free = true
next_required_step = DHD-OP01_DHC_R11_closure_material_intake
```

status案:

```text
DHD_STATUS_POST_DHC_SCOPE_REFROZEN_STOPPED
DHD_STATUS_POST_DHC_SCOPE_REPAIR_REQUIRED
DHD_STATUS_POST_DHC_SCOPE_BLOCKED_PROMOTION_OR_AUTORUN
```

禁止:

```text
- DHC builder call
- DHC-OP08 result synthesis
- DHR-OP05 builder call
- DHR-OP06 builder call
- P7 readfeel evaluation execution
- P8 / release promotion
```

### 6.2 DHD-OP01: DHC R11 / closure material intake

目的:

```text
DHC R11 next work decision materialをbody-freeで受け、DHC結果の明示material有無を分ける。
DHD内でDHC resultを合成しない。
```

input:

```text
op00_refreeze
explicit_dhc_r11_bodyfree_next_work_decision_material
optional_explicit_dhc_op08_result_memo_closure_material
optional_current_existing_dhr_op05_result_wrapper
```

受理条件:

```text
- mappingである。
- body_free is true。
- source_mode is local_received_zip_only。
- current_execution_allowance is none。
- dhr_op06_call is none / false。
- dhr_op07_materialization is none / false。
- p8_question_design is none / false。
- release_decision is none / false。
- recommended_next_work_candidate がPost-DHC comparison boundaryである。
```

status案:

```text
DHD_STATUS_DHC_R11_INTAKE_READY
DHD_STATUS_DHC_R11_INTAKE_READY_WITH_EXPLICIT_DHC_OP08_MATERIAL
DHD_STATUS_WAITING_FOR_EXPLICIT_DHC_R11_MATERIAL
DHD_STATUS_DHC_R11_REPAIR_REQUIRED
DHD_STATUS_BLOCKED_DHC_R11_BODY_LEAK_PROMOTION_OR_AUTORUN
```

next:

```text
intake ready:
  DHD-OP02 DHC outcome class / current material sufficiency check

missing / repair / blocked:
  DHD-OP08 closure / no downstream stop
```

### 6.3 DHD-OP02: DHC outcome class / current material sufficiency check

目的:

```text
DHC outcome classを分類し、DHR-OP06 considerationへ進むだけの明示materialがあるか、P7読感再接続へ戻るべきかを判断できる状態にする。
```

input:

```text
op01_dhc_r11_intake
optional_explicit_dhc_op08_result_memo_closure_material
optional_current_existing_dhr_op05_result_wrapper
```

分類:

| 入力状態 | DHD outcome class | 扱い |
|---|---|---|
| explicit current DHC-OP08 scan clear materialあり | `DHD_DHC_OUTCOME_SCAN_CLEAR_SELECTED` | DHR-OP06 consideration候補とP7読感再接続候補の比較へ進める |
| DHC R11のみ / test greenのみ | `DHD_DHC_OUTCOME_R11_ONLY_NO_CURRENT_SELECTED_RESULT` | current scan clearを作らず、P7読感再接続またはcurrent material selection候補へ寄せる |
| DHC scan clear capable validationのみ | `DHD_DHC_OUTCOME_SCAN_CLEAR_CAPABLE_TEST_VALIDATED_NOT_RUNTIME` | DHR-OP06 call不可。considerationもmaterial不足として扱う |
| waiting / incomplete | `DHD_DHC_OUTCOME_WAITING_OR_INCOMPLETE` | explicit material collection / repair候補 |
| repair required | `DHD_DHC_OUTCOME_REPAIR_REQUIRED` | repair boundary候補 |
| not called | `DHD_DHC_OUTCOME_NOT_CALLED` | explicit manual call request / OP04 material候補 |
| non-DHR lane | `DHD_DHC_OUTCOME_NON_DHR_LANE_ROUTE_PRESERVED` | lane route preservation候補 |
| blocked | `DHD_DHC_OUTCOME_BLOCKED` | no-touch repair候補 |

重要固定:

```text
DHD-OP02は、DHC R11のvalidation greenからDHC-OP08 scan clear materialを合成しない。
DHD-OP02は、DHC result classをDHR-OP06 permissionへ変換しない。
DHD-OP02は、DHC resultが未選択の場合、未選択として保持する。
```

status案:

```text
DHD_STATUS_DHC_OUTCOME_CLASSIFIED_READY
DHD_STATUS_DHC_OUTCOME_R11_ONLY_NO_CURRENT_SELECTED_RESULT
DHD_STATUS_DHC_OUTCOME_WAITING_REPAIR_OR_NOT_CALLED_STOPPED
DHD_STATUS_DHC_OUTCOME_REPAIR_REQUIRED
DHD_STATUS_DHC_OUTCOME_BLOCKED_PROMOTION_OR_AUTORUN
```

### 6.4 DHD-OP03: DHR-OP06 consideration eligibility without call

目的:

```text
DHR-OP06へ進む理由があるかを、DHR-OP06 builderを呼ばずに判定する。
```

input:

```text
op02_dhc_outcome_classification
optional_current_existing_dhr_op05_result_wrapper
allow_dhr_op06_consideration_candidate
allow_dhr_op06_builder_call
allow_dhr_op06_implicit_op05_fallback
```

eligibility条件:

```text
- OP02がscan clear selected、またはexplicit current existing DHR-OP05 result wrapperがある。
- OP05 result wrapperがbody_freeで、DHR-OP05 scan clear stopped classと矛盾しない。
- DHR-OP06 considerationが必要な理由が、単なる「次OPだから」ではなく、未解決branch判断に関係している。
- allow_dhr_op06_consideration_candidate is true。
- allow_dhr_op06_builder_call is false。
- allow_dhr_op06_implicit_op05_fallback is false。
- DHR-OP06 / DHR-OP07 / DMD / R52 / P8 / release flags がすべてfalse。
```

status案:

```text
DHD_STATUS_DHR_OP06_CONSIDERATION_ELIGIBLE_WITH_EXPLICIT_SCAN_CLEAR_MATERIAL
DHD_STATUS_DHR_OP06_CONSIDERATION_DEFERRED_PENDING_EXPLICIT_CURRENT_MATERIAL
DHD_STATUS_DHR_OP06_CONSIDERATION_NOT_ALLOWED_FOR_WAITING_REPAIR_OR_NOT_CALLED
DHD_STATUS_DHR_OP06_CONSIDERATION_BLOCKED_BY_IMPLICIT_FALLBACK_OR_AUTORUN
```

重要field案:

```text
dhr_op06_consideration_candidate
why_dhr_op06_consideration_may_be_needed_refs
why_dhr_op06_consideration_is_not_enough_refs
explicit_current_op05_material_present
explicit_current_op05_material_contract_valid_ref
current_dhc_result_selected
dhr_op06_builder_call_allowed_here = false
dhr_op06_builder_called_here = false
dhr_op06_implicit_op05_fallback_allowed_here = false
dhr_op06_implicit_op05_fallback_used_here = false
dhr_op07_materialized_here = false
dmd_execution_started_here = false
p8_question_design_started = false
release_allowed = false
```

### 6.5 DHD-OP04: P7 readfeel reconnection eligibility

目的:

```text
P7本来のProduct Read Feel / continued input / pilot-readiness評価へ戻る条件を整理する。
```

input:

```text
op02_dhc_outcome_classification
op03_dhr_op06_consideration_eligibility
p7_roadmap_readfeel_axis_refs
optional_existing_p7_runner_refs
```

eligibility観点:

```text
- R54-AHR境界補強が長期化している。
- DHC後のDHR-OP06 considerationに明示current materialが不足している。
- P7の完了条件であるbaseline corpus / long-run / Product Pass vs Release Ready分離が未確認。
- P7/P8 Bridgeの問いシステム必要性観察が未収集または不十分。
- Emlisの初回返答が、商品としての読感・継続入力価値に戻って評価される必要がある。
```

status案:

```text
DHD_STATUS_P7_READFEEL_RECONNECTION_ELIGIBLE
DHD_STATUS_P7_READFEEL_RECONNECTION_ELIGIBLE_BUT_MIN_CASE_SET_REQUIRED
DHD_STATUS_P7_READFEEL_RECONNECTION_DEFERRED_UNTIL_REPAIR_OR_WAIT_CLOSED
DHD_STATUS_P7_READFEEL_RECONNECTION_BLOCKED_BY_UNSAFE_DHC_OUTCOME
```

重要field案:

```text
p7_readfeel_reconnection_candidate
product_value_return_pressure_ref
minimum_case_set_required_ref
blind_qa_return_required
continued_input_observation_required
pilot_readiness_observation_required
question_need_observation_allowed_as_bodyfree = true
question_text_materialized_here = false
p8_question_design_started = false
p7_complete = false
release_allowed = false
```

DHD-OP04は、実際の読感評価caseを作成しません。  
最小case setが必要であることを記録するだけです。

### 6.6 DHD-OP05: direction comparator

目的:

```text
DHR-OP06 consideration候補とP7読感再接続候補を比較し、次設計候補を1つ、または明示holdとして決める。
```

比較軸:

| 軸 | DHR-OP06 consideration側 | P7読感再接続側 |
|---|---|---|
| 分かったふり防止 | current scan clear materialが明示されていれば、branch未整理を残さない | current materialが未選択なら、DHR-OP06へ進んだふりを避ける |
| 商品価値 | DHR未解決が下流判断を塞いでいる場合に有効 | Emlis応答の読感・継続入力へ戻れる |
| 安全境界 | callせずconsiderationだけなら安全 | P7完了・releaseへ昇格しなければ安全 |
| 長期化抑制 | DHR枝を整理できるが、境界補強継続のリスクあり | 商品価値へ戻れるが、内部未解決を隠すリスクあり |
| material sufficiency | explicit current OP05 / DHC scan clearが必要 | R11-onlyでも候補化可能。ただし評価case setは別途必要 |

決定preference案:

```text
1. blocked / body leak / promotion / autorun があれば no-touch repair / hold。
2. waiting / repair / not-called / non-DHR laneなら、DHR-OP06 or P7読感へ進まず、対応するrepair / material collection / route preservationへ止める。
3. current DHC result未選択 / R11-onlyなら、DHR-OP06 considerationをmaterial不足で保留し、P7読感再接続またはcurrent material selection boundaryを優先候補にする。
4. explicit scan clear selected + explicit current OP05 wrapperありなら、DHR-OP06 consideration detailed designとP7読感再接続を比較する。
5. DHR-OP06 considerationが商品価値に直接効く理由を持たず、境界補強の継続だけになる場合は、P7読感再接続を優先する。
6. どちらも材料不足なら explicit current DHC material selection boundary として止める。
```

allowed decision refs:

```text
DHD_DECISION_DHR_OP06_CONSIDERATION_DESIGN_FIRST
DHD_DECISION_P7_READFEEL_RECONNECTION_DESIGN_FIRST
DHD_DECISION_EXPLICIT_CURRENT_DHC_MATERIAL_SELECTION_REQUIRED
DHD_DECISION_REPAIR_OR_WAIT_BOUNDARY_REQUIRED
DHD_DECISION_NON_DHR_LANE_ROUTE_PRESERVED
DHD_DECISION_NO_TOUCH_REPAIR_OR_HOLD_REQUIRED
```

禁止:

```text
- decision_refをruntime executionへ変換すること。
- DHR-OP06 consideration design firstをDHR-OP06 call allowedへ変換すること。
- P7 readfeel reconnection design firstをP7 complete / releaseへ変換すること。
```

### 6.7 DHD-OP06: no-touch / no-promotion / no-question-system guard

目的:

```text
DHDが方向判断境界を越えて、実行境界・P8設計・release claimへ進まないようにする。
```

guard対象:

```text
dhc_builder_called_here
dhc_result_synthesized_here
dhr_op05_runtime_call_started_here
existing_dhr_op05_builder_runtime_called_here
dhr_op06_builder_called_here
dhr_op06_implicit_op05_fallback_used_here
dhr_op07_materialized_here
dmd_execution_started_here
r52_actual_execution_started_here
actual_review_started_here
actual_rows_created_here
question_need_observation_rows_created_here
p8_question_design_started
p8_question_implementation_started
question_text_materialized_here
api_changed
db_changed
rn_changed
runtime_changed
response_key_changed
json_schema_file_created
p7_complete
release_allowed
full_backend_suite_green_claimed_here
rn_contract_green_claimed_here
rn_real_device_modal_verified_claimed_here
```

status案:

```text
DHD_STATUS_NO_TOUCH_NO_PROMOTION_NO_QUESTION_SYSTEM_GUARD_PASSED
DHD_STATUS_REPAIR_REQUIRED_FOR_NO_TOUCH_GUARD_INPUTS
DHD_STATUS_BLOCKED_NO_TOUCH_NO_PROMOTION_NO_QUESTION_SYSTEM_GUARD
```

### 6.8 DHD-OP07: validation plan / result memo draft material

目的:

```text
実装時のtarget validation / selected regression / compileall / result memo候補をbody-freeで固定する。
```

outputに含めるもの:

```text
- target_test_ref_refs
- selected_regression_test_ref_refs
- optional_product_readfeel_regression_ref_refs
- compileall_target_ref_refs
- result_memo_expected_file_refs
- expected_validation_command_summary_refs
- no raw output policy
- full_backend_suite / RN contract / real-device unconfirmed policy
- next work decision memo draft refs
```

注意:

```text
DHD-OP07はvalidation planを作るだけで、pytest / compileallを実行しない。
DHD-OP07はresult memoファイルを作らない。
```

### 6.9 DHD-OP08: stopped next design decision closure

目的:

```text
DHD判断を閉じ、次の設計候補を記録して止める。
```

allowed closure:

```text
DHD_OP08_DHR_OP06_CONSIDERATION_DESIGN_CLOSED_STOPPED
DHD_OP08_P7_READFEEL_RECONNECTION_DESIGN_CLOSED_STOPPED
DHD_OP08_EXPLICIT_CURRENT_DHC_MATERIAL_SELECTION_REQUIRED_CLOSED_STOPPED
DHD_OP08_REPAIR_OR_WAIT_BOUNDARY_CLOSED_STOPPED
DHD_OP08_NON_DHR_LANE_ROUTE_PRESERVED_CLOSED_STOPPED
DHD_OP08_BLOCKED_NO_TOUCH_NO_PROMOTION
```

allowed next_design_candidate_ref:

```text
DHR_OP06_consideration_detailed_design_without_call
P7_readfeel_reconnection_product_QA_return_detailed_design
explicit_current_DHC_OP08_or_current_OP05_material_selection_boundary
explicit_DHR_OP04_or_OP05_material_repair_or_wait_boundary
DHB_non_DHR_lane_route_preserved_decision_boundary
no_touch_no_promotion_repair_boundary
```

禁止closure:

```text
next_runtime_execution
dhr_op06_auto_call
dhr_op07_auto_materialization
dmd_r52_auto_execution
actual_review_auto_start
p8_auto_start
p7_complete
release_ready
```

---

## 7. decision matrix

### 7.1 DHC outcome別の次候補

| DHDで見える状態 | DHR-OP06 consideration | P7読感再接続 | DHD next candidate |
|---|---:|---:|---|
| R11-only / current selected resultなし | 保留 | 候補化可 | P7読感再接続、またはcurrent material selection boundary |
| scan clear selected + explicit OP05 wrapperあり | 候補化可 | 候補化可 | comparatorで決定 |
| scan clear capable test validationのみ | material不足 | 候補化可 | P7読感再接続寄り / current material selection |
| waiting / incomplete | 不可 | 原則保留 | explicit material collection / wait boundary |
| repair required | 不可 | 原則保留 | repair boundary |
| not called | 不可 | 原則保留 | explicit manual call request / OP04 material boundary |
| non-DHR lane | 不可 | lane次第 | route preserved decision |
| blocked | 不可 | 不可 | no-touch repair / hold |

### 7.2 現在確認済み状態に対する設計上の期待

現時点で明示的に確認できるのは、DHC R11のnext work decisionとvalidation closureです。  
current production DHC result selected / current OP05 wrapperは未確認です。

したがって、実装時にDHDへR11-only材料だけを渡す場合、DHD-OP05は次のどちらかを選ぶ設計にします。

```text
preferred:
  DHD_DECISION_P7_READFEEL_RECONNECTION_DESIGN_FIRST

fallback if design team wants to close material ambiguity first:
  DHD_DECISION_EXPLICIT_CURRENT_DHC_MATERIAL_SELECTION_REQUIRED
```

DHD-OP05は、この状態から `DHD_DECISION_DHR_OP06_CONSIDERATION_DESIGN_FIRST` を出してはいけません。  
出すには、explicit current scan clear material / current OP05 wrapperが必要です。

---

## 8. json / schema案

本章は、実装時に使う可能性があるjson / schema案です。  
**この設計段階では実ファイル化しません。**  
実ファイル化は実装段階で、既存schema配置・既存guard・既存test結果を確認して判断します。

### 8.1 schema案: DHD direction boundary input

```json
{
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhc.dhd.direction_boundary_input.bodyfree.v1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "source_mode",
    "git_connection_required",
    "git_checked",
    "explicit_dhc_r11_bodyfree_next_work_decision_material",
    "allow_dhr_op06_consideration_candidate",
    "allow_dhr_op06_builder_call",
    "allow_dhr_op06_implicit_op05_fallback",
    "allow_p7_readfeel_reconnection_candidate",
    "allow_p8_question_design",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhc.dhd.direction_boundary_input.bodyfree.v1"
    },
    "review_session_id": { "type": "string", "minLength": 1 },
    "source_mode": { "const": "local_received_zip_only" },
    "git_connection_required": { "const": false },
    "git_checked": { "const": false },
    "explicit_dhc_r11_bodyfree_next_work_decision_material": {
      "type": ["object", "null"],
      "description": "DHC R11 next work decision material. nullの場合はwaiting。DHD内で合成しない。"
    },
    "optional_explicit_dhc_op08_result_memo_closure_material": {
      "type": ["object", "null"],
      "description": "current selected DHC-OP08 material候補。nullの場合はcurrent selected resultなしとして扱う。"
    },
    "optional_current_existing_dhr_op05_result_wrapper": {
      "type": ["object", "null"],
      "description": "DHR-OP06 consideration input候補。DHD内で作成しない。"
    },
    "allow_dhr_op06_consideration_candidate": { "type": "boolean" },
    "allow_dhr_op06_builder_call": { "const": false },
    "allow_dhr_op06_implicit_op05_fallback": { "const": false },
    "allow_p7_readfeel_reconnection_candidate": { "type": "boolean" },
    "allow_p8_question_design": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 8.2 schema案: DHD OP02 outcome classification

```json
{
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhc.dhd.op02_dhc_outcome_classification.bodyfree.v1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "dhd_op02_status_ref",
    "dhc_outcome_class_ref",
    "current_dhc_result_selected",
    "scan_clear_capable_test_validation_only",
    "explicit_current_dhc_op08_material_present",
    "explicit_current_op05_wrapper_present",
    "dhr_op06_permission_produced_here",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhc.dhd.op02_dhc_outcome_classification.bodyfree.v1"
    },
    "operation_step_ref": { "const": "DHD-OP02_DHC_outcome_class_current_material_sufficiency_check" },
    "dhd_op02_status_ref": {
      "enum": [
        "DHD_STATUS_DHC_OUTCOME_CLASSIFIED_READY",
        "DHD_STATUS_DHC_OUTCOME_R11_ONLY_NO_CURRENT_SELECTED_RESULT",
        "DHD_STATUS_DHC_OUTCOME_WAITING_REPAIR_OR_NOT_CALLED_STOPPED",
        "DHD_STATUS_DHC_OUTCOME_REPAIR_REQUIRED",
        "DHD_STATUS_DHC_OUTCOME_BLOCKED_PROMOTION_OR_AUTORUN"
      ]
    },
    "dhc_outcome_class_ref": {
      "enum": [
        "DHD_DHC_OUTCOME_SCAN_CLEAR_SELECTED",
        "DHD_DHC_OUTCOME_R11_ONLY_NO_CURRENT_SELECTED_RESULT",
        "DHD_DHC_OUTCOME_SCAN_CLEAR_CAPABLE_TEST_VALIDATED_NOT_RUNTIME",
        "DHD_DHC_OUTCOME_WAITING_OR_INCOMPLETE",
        "DHD_DHC_OUTCOME_REPAIR_REQUIRED",
        "DHD_DHC_OUTCOME_NOT_CALLED",
        "DHD_DHC_OUTCOME_NON_DHR_LANE_ROUTE_PRESERVED",
        "DHD_DHC_OUTCOME_BLOCKED"
      ]
    },
    "current_dhc_result_selected": { "type": "boolean" },
    "scan_clear_capable_test_validation_only": { "type": "boolean" },
    "explicit_current_dhc_op08_material_present": { "type": "boolean" },
    "explicit_current_op05_wrapper_present": { "type": "boolean" },
    "dhr_op06_permission_produced_here": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 8.3 schema案: DHD OP03 DHR-OP06 consideration eligibility

```json
{
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhc.dhd.op03_dhr_op06_consideration_eligibility.bodyfree.v1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "dhd_op03_status_ref",
    "dhr_op06_consideration_candidate",
    "explicit_current_material_required",
    "explicit_current_material_satisfied",
    "dhr_op06_builder_call_allowed_here",
    "dhr_op06_builder_called_here",
    "dhr_op06_implicit_op05_fallback_allowed_here",
    "dhr_op06_implicit_op05_fallback_used_here",
    "dhr_op07_materialized_here",
    "dmd_execution_started_here",
    "p8_question_design_started",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhc.dhd.op03_dhr_op06_consideration_eligibility.bodyfree.v1"
    },
    "operation_step_ref": { "const": "DHD-OP03_DHR_OP06_consideration_eligibility_without_call" },
    "dhd_op03_status_ref": {
      "enum": [
        "DHD_STATUS_DHR_OP06_CONSIDERATION_ELIGIBLE_WITH_EXPLICIT_SCAN_CLEAR_MATERIAL",
        "DHD_STATUS_DHR_OP06_CONSIDERATION_DEFERRED_PENDING_EXPLICIT_CURRENT_MATERIAL",
        "DHD_STATUS_DHR_OP06_CONSIDERATION_NOT_ALLOWED_FOR_WAITING_REPAIR_OR_NOT_CALLED",
        "DHD_STATUS_DHR_OP06_CONSIDERATION_BLOCKED_BY_IMPLICIT_FALLBACK_OR_AUTORUN"
      ]
    },
    "dhr_op06_consideration_candidate": { "type": "boolean" },
    "explicit_current_material_required": { "const": true },
    "explicit_current_material_satisfied": { "type": "boolean" },
    "why_dhr_op06_consideration_may_be_needed_refs": {
      "type": "array",
      "items": { "type": "string" }
    },
    "why_dhr_op06_consideration_is_not_enough_refs": {
      "type": "array",
      "items": { "type": "string" }
    },
    "dhr_op06_builder_call_allowed_here": { "const": false },
    "dhr_op06_builder_called_here": { "const": false },
    "dhr_op06_implicit_op05_fallback_allowed_here": { "const": false },
    "dhr_op06_implicit_op05_fallback_used_here": { "const": false },
    "dhr_op07_materialized_here": { "const": false },
    "dmd_execution_started_here": { "const": false },
    "p8_question_design_started": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 8.4 schema案: DHD OP04 P7 readfeel reconnection eligibility

```json
{
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhc.dhd.op04_p7_readfeel_reconnection_eligibility.bodyfree.v1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "dhd_op04_status_ref",
    "p7_readfeel_reconnection_candidate",
    "minimum_case_set_required",
    "blind_qa_return_required",
    "continued_input_observation_required",
    "question_need_observation_allowed_as_bodyfree",
    "question_text_materialized_here",
    "p8_question_design_started",
    "p7_complete",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhc.dhd.op04_p7_readfeel_reconnection_eligibility.bodyfree.v1"
    },
    "operation_step_ref": { "const": "DHD-OP04_P7_readfeel_reconnection_eligibility" },
    "dhd_op04_status_ref": {
      "enum": [
        "DHD_STATUS_P7_READFEEL_RECONNECTION_ELIGIBLE",
        "DHD_STATUS_P7_READFEEL_RECONNECTION_ELIGIBLE_BUT_MIN_CASE_SET_REQUIRED",
        "DHD_STATUS_P7_READFEEL_RECONNECTION_DEFERRED_UNTIL_REPAIR_OR_WAIT_CLOSED",
        "DHD_STATUS_P7_READFEEL_RECONNECTION_BLOCKED_BY_UNSAFE_DHC_OUTCOME"
      ]
    },
    "p7_readfeel_reconnection_candidate": { "type": "boolean" },
    "product_value_return_pressure_ref": { "type": "string" },
    "minimum_case_set_required": { "type": "boolean" },
    "minimum_case_set_required_ref": { "type": "string" },
    "blind_qa_return_required": { "type": "boolean" },
    "continued_input_observation_required": { "type": "boolean" },
    "pilot_readiness_observation_required": { "type": "boolean" },
    "question_need_observation_allowed_as_bodyfree": { "const": true },
    "question_text_materialized_here": { "const": false },
    "p8_question_design_started": { "const": false },
    "p7_complete": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 8.5 schema案: DHD OP05 direction comparator output

```json
{
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhc.dhd.op05_direction_comparator.bodyfree.v1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "dhd_op05_status_ref",
    "direction_decision_ref",
    "dhr_op06_consideration_candidate",
    "p7_readfeel_reconnection_candidate",
    "current_dhc_material_selection_required",
    "repair_or_wait_boundary_required",
    "selected_next_design_candidate_ref",
    "next_runtime_execution_allowed_here",
    "dhr_op06_builder_called_here",
    "p8_question_design_started",
    "p7_complete",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhc.dhd.op05_direction_comparator.bodyfree.v1"
    },
    "operation_step_ref": { "const": "DHD-OP05_direction_comparator" },
    "dhd_op05_status_ref": {
      "enum": [
        "DHD_STATUS_DIRECTION_COMPARISON_CLOSED_READY",
        "DHD_STATUS_DIRECTION_COMPARISON_REPAIR_OR_WAIT_REQUIRED",
        "DHD_STATUS_DIRECTION_COMPARISON_CURRENT_MATERIAL_SELECTION_REQUIRED",
        "DHD_STATUS_DIRECTION_COMPARISON_BLOCKED_NO_TOUCH"
      ]
    },
    "direction_decision_ref": {
      "enum": [
        "DHD_DECISION_DHR_OP06_CONSIDERATION_DESIGN_FIRST",
        "DHD_DECISION_P7_READFEEL_RECONNECTION_DESIGN_FIRST",
        "DHD_DECISION_EXPLICIT_CURRENT_DHC_MATERIAL_SELECTION_REQUIRED",
        "DHD_DECISION_REPAIR_OR_WAIT_BOUNDARY_REQUIRED",
        "DHD_DECISION_NON_DHR_LANE_ROUTE_PRESERVED",
        "DHD_DECISION_NO_TOUCH_REPAIR_OR_HOLD_REQUIRED"
      ]
    },
    "dhr_op06_consideration_candidate": { "type": "boolean" },
    "p7_readfeel_reconnection_candidate": { "type": "boolean" },
    "current_dhc_material_selection_required": { "type": "boolean" },
    "repair_or_wait_boundary_required": { "type": "boolean" },
    "decision_reason_refs": {
      "type": "array",
      "items": { "type": "string" }
    },
    "decision_blocker_refs": {
      "type": "array",
      "items": { "type": "string" }
    },
    "selected_next_design_candidate_ref": { "type": "string" },
    "next_runtime_execution_allowed_here": { "const": false },
    "dhr_op06_builder_called_here": { "const": false },
    "p8_question_design_started": { "const": false },
    "p7_complete": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 8.6 schema案: DHD final closure

```json
{
  "$id": "cocolon.emlis.p7_r54.ahr.post_dhc.dhd.op08_stopped_next_design_decision_closure.bodyfree.v1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "operation_step_ref",
    "dhd_op08_status_ref",
    "direction_decision_ref",
    "selected_next_design_candidate_ref",
    "dhr_op06_builder_called_here",
    "dhr_op07_materialized_here",
    "dmd_r52_executed_here",
    "actual_review_started_here",
    "question_need_observation_rows_created_here",
    "p8_question_design_started",
    "question_text_materialized_here",
    "p7_complete",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_dhc.dhd.op08_stopped_next_design_decision_closure.bodyfree.v1"
    },
    "operation_step_ref": { "const": "DHD-OP08_stopped_next_design_decision_closure" },
    "dhd_op08_status_ref": {
      "enum": [
        "DHD_OP08_DHR_OP06_CONSIDERATION_DESIGN_CLOSED_STOPPED",
        "DHD_OP08_P7_READFEEL_RECONNECTION_DESIGN_CLOSED_STOPPED",
        "DHD_OP08_EXPLICIT_CURRENT_DHC_MATERIAL_SELECTION_REQUIRED_CLOSED_STOPPED",
        "DHD_OP08_REPAIR_OR_WAIT_BOUNDARY_CLOSED_STOPPED",
        "DHD_OP08_NON_DHR_LANE_ROUTE_PRESERVED_CLOSED_STOPPED",
        "DHD_OP08_BLOCKED_NO_TOUCH_NO_PROMOTION"
      ]
    },
    "direction_decision_ref": { "type": "string" },
    "selected_next_design_candidate_ref": { "type": "string" },
    "dhr_op06_builder_called_here": { "const": false },
    "dhr_op07_materialized_here": { "const": false },
    "dmd_r52_executed_here": { "const": false },
    "actual_review_started_here": { "const": false },
    "question_need_observation_rows_created_here": { "const": false },
    "p8_question_design_started": { "const": false },
    "question_text_materialized_here": { "const": false },
    "p7_complete": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

---

## 9. 実装対象ファイル案

実装指示が出た場合の新規helper候補は次です。

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_dhc_direction_decision_boundary_20260709.py
```

module prefix候補:

```text
P7_R54_AHR_POST_DHC_DHD_*
```

主要builder / assert関数候補:

```text
build_p7_r54_ahr_post_dhc_dhd_r1_helper_skeleton_constants_summary
assert_p7_r54_ahr_post_dhc_dhd_r1_helper_skeleton_constants_summary_contract

build_p7_r54_ahr_post_dhc_dhd_op00_post_dhc_basis_no_execution_refreeze
assert_p7_r54_ahr_post_dhc_dhd_op00_post_dhc_basis_no_execution_refreeze_contract

build_p7_r54_ahr_post_dhc_dhd_op01_dhc_r11_closure_material_intake
assert_p7_r54_ahr_post_dhc_dhd_op01_dhc_r11_closure_material_intake_contract

build_p7_r54_ahr_post_dhc_dhd_op02_dhc_outcome_class_current_material_sufficiency_check
assert_p7_r54_ahr_post_dhc_dhd_op02_dhc_outcome_class_current_material_sufficiency_check_contract

build_p7_r54_ahr_post_dhc_dhd_op03_dhr_op06_consideration_eligibility_without_call
assert_p7_r54_ahr_post_dhc_dhd_op03_dhr_op06_consideration_eligibility_without_call_contract

build_p7_r54_ahr_post_dhc_dhd_op04_p7_readfeel_reconnection_eligibility
assert_p7_r54_ahr_post_dhc_dhd_op04_p7_readfeel_reconnection_eligibility_contract

build_p7_r54_ahr_post_dhc_dhd_op05_direction_comparator
assert_p7_r54_ahr_post_dhc_dhd_op05_direction_comparator_contract

build_p7_r54_ahr_post_dhc_dhd_op06_no_touch_no_promotion_no_question_system_guard
assert_p7_r54_ahr_post_dhc_dhd_op06_no_touch_no_promotion_no_question_system_guard_contract

build_p7_r54_ahr_post_dhc_dhd_op07_validation_plan_result_memo_draft_material
assert_p7_r54_ahr_post_dhc_dhd_op07_validation_plan_result_memo_draft_material_contract

build_p7_r54_ahr_post_dhc_dhd_op08_stopped_next_design_decision_closure
assert_p7_r54_ahr_post_dhc_dhd_op08_stopped_next_design_decision_closure_contract
```

新規test候補は次です。

```text
mashos-api/ai/tests/
  test_r54_ahr_post_dhc_direction_decision_boundary_dhd_r0_r1_20260709.py
  test_r54_ahr_post_dhc_direction_decision_boundary_dhd_op00_op01_20260709.py
  test_r54_ahr_post_dhc_direction_decision_boundary_dhd_op02_op03_20260709.py
  test_r54_ahr_post_dhc_direction_decision_boundary_dhd_op04_op05_20260709.py
  test_r54_ahr_post_dhc_direction_decision_boundary_dhd_op06_op07_20260709.py
  test_r54_ahr_post_dhc_direction_decision_boundary_dhd_op08_result_20260709.py
```

result memo候補は次です。

```text
mashos-api/ai/tests/
  R54_AHR_PostDHC_DirectionDecisionBoundary_DHD_R7_TargetValidation_Result_20260709.md
  R54_AHR_PostDHC_DirectionDecisionBoundary_DHD_R8_SelectedRegression_Result_20260709.md
  R54_AHR_PostDHC_DirectionDecisionBoundary_DHD_R9_Compileall_Result_20260709.md
  R54_AHR_PostDHC_DirectionDecisionBoundary_DHD_R10_ResultMemoClosure_20260709.md
  R54_AHR_PostDHC_DirectionDecisionBoundary_DHD_R11_NextWorkDecision_20260709.md
```

本設計段階では、上記ファイルを作成しません。

---

## 10. 実装順

### R0: 設計反映pre-freeze

目的:

```text
本設計書を基準に、DHDの対象・禁止対象・prefix・direction decision責務を固定する。
```

作業:

```text
- 本設計書を確認する。
- DHD prefix衝突を実装直前基準面で再確認する。
- DHDはDHR-OP06 callではなく、DHR-OP06 consideration vs P7 readfeel reconnectionの方向判断境界であると固定する。
- DHDはDHC resultを合成しないと固定する。
- DHDはP8問いシステムを実装しないと固定する。
```

完了条件:

```text
- DHR-OP06 builder call禁止が明記されている。
- DHR-OP06 implicit OP05 fallback禁止が明記されている。
- P7読感再接続がP7完了ではないことが明記されている。
```

### R1: constants / helper skeleton

目的:

```text
DHD helper skeleton、schema_version、status refs、decision refs、false flags、existing DHC/DHR reference stringsを定義する。
```

実装内容:

```text
- P7_R54_AHR_POST_DHC_DHD_* constantsを追加。
- DHD-OP00〜OP08 step refsを定義。
- DHD allowed status refs / decision refsを定義。
- DHC R11 / DHC OP08 / DHR OP05 / DHR OP06参照を文字列refとして管理する。
- DHR-OP06 builder call禁止refを定義。
- DHR-OP06 implicit OP05 fallback禁止refを定義。
- no-touch false flagsを定義。
- forbidden payload key refsを定義。
```

注意:

```text
R1ではDHC builder / DHR-OP06 builder / P7 runnerを呼ばない。
```

### R2: DHD-OP00 / DHD-OP01 実装・target tests

目的:

```text
Post-DHC no-execution refreezeとDHC R11 closure intakeを実装する。
```

test観点:

```text
- OP00はDHR-OP06 / P8 / releaseを許可しない。
- OP00はcurrent_execution_allowance noneを固定する。
- OP01は明示DHC R11 materialなしでwaitingになる。
- OP01はDHC R11 materialをintake readyにする。
- OP01はDHC R11をDHR-OP06 permissionへ変換しない。
- OP01はbody-like payload / promotion / autorun claimをblockedにする。
- OP01はDHC builderを呼ばない。
```

### R3: DHD-OP02 / DHD-OP03 実装・target tests

目的:

```text
DHC outcome class / current material sufficiency checkと、DHR-OP06 consideration eligibility without callを実装する。
```

test観点:

```text
- R11-onlyはcurrent selected resultなしとして分類される。
- scan clear capable validationだけではDHR-OP06 consideration eligibleにならない。
- explicit scan clear selected + explicit current OP05 wrapperがある場合だけDHR-OP06 consideration候補になる。
- waiting / repair / not-called / blockedではDHR-OP06 consideration候補にならない。
- allow_dhr_op06_builder_call=trueはblockedになる。
- allow_dhr_op06_implicit_op05_fallback=trueはblockedになる。
- monkeypatchでDHR-OP06 builderが呼ばれていないことを確認する。
```

### R4: DHD-OP04 / DHD-OP05 実装・target tests

目的:

```text
P7 readfeel reconnection eligibilityとdirection comparatorを実装する。
```

test観点:

```text
- R11-onlyではP7 readfeel reconnection候補またはcurrent material selection候補になる。
- R11-onlyからDHR-OP06 consideration design firstにならない。
- explicit scan clear selected + current OP05 wrapperがある場合はDHR-OP06 considerationとP7読感再接続を比較できる。
- DHR-OP06 considerationが候補になってもDHR-OP06 builderは呼ばれない。
- P7 readfeel reconnectionが候補になってもP7 complete / releaseはfalse。
- question need observationはbody-free観点としてだけ許可され、question_textは作られない。
```

### R5: DHD-OP06 / DHD-OP07 実装・target tests

目的:

```text
no-touch / no-promotion / no-question-system guardとvalidation plan / result memo draftを実装する。
```

test観点:

```text
- どのdecisionでもDHR-OP06 builder called flagはfalse。
- DHR-OP07 / DMD / R52 / actual review / P8 / release flagsはfalse。
- API / DB / RN / runtime / response key変更flagはfalse。
- target / selected regression / compileall refsはcount-onlyで記録する。
- stdout / stderr / traceback / raw body / comment_text / question_textを保持しない。
```

### R6: DHD-OP08 実装・target tests

目的:

```text
DHD stopped next design decision closureをbody-freeで閉じる。
```

test観点:

```text
- DHR-OP06 consideration design firstは、DHR-OP06 callなしでclosed stoppedになる。
- P7 readfeel reconnection design firstは、P7 complete / releaseなしでclosed stoppedになる。
- current material selection requiredは、DHC result合成なしでclosed stoppedになる。
- repair / wait / blockedは、対応候補を残してclosed stoppedになる。
- どの結果でもDHR-OP06 / DHR-OP07 / DMD / R52 / actual review / P8 / releaseへ進まない。
```

### R7: target validation

候補command:

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_dhc_direction_decision_boundary_dhd_r0_r1_20260709.py \
  tests/test_r54_ahr_post_dhc_direction_decision_boundary_dhd_op00_op01_20260709.py \
  tests/test_r54_ahr_post_dhc_direction_decision_boundary_dhd_op02_op03_20260709.py \
  tests/test_r54_ahr_post_dhc_direction_decision_boundary_dhd_op04_op05_20260709.py \
  tests/test_r54_ahr_post_dhc_direction_decision_boundary_dhd_op06_op07_20260709.py \
  tests/test_r54_ahr_post_dhc_direction_decision_boundary_dhd_op08_result_20260709.py
```

記録:

```text
R54_AHR_PostDHC_DirectionDecisionBoundary_DHD_R7_TargetValidation_Result_20260709.md
```

### R8: selected regression

候補command:

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_dhc_direction_decision_boundary_dhd_r0_r1_20260709.py \
  tests/test_r54_ahr_post_dhc_direction_decision_boundary_dhd_op00_op01_20260709.py \
  tests/test_r54_ahr_post_dhc_direction_decision_boundary_dhd_op02_op03_20260709.py \
  tests/test_r54_ahr_post_dhc_direction_decision_boundary_dhd_op04_op05_20260709.py \
  tests/test_r54_ahr_post_dhc_direction_decision_boundary_dhd_op06_op07_20260709.py \
  tests/test_r54_ahr_post_dhc_direction_decision_boundary_dhd_op08_result_20260709.py \
  tests/test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_r0_r1_20260709.py \
  tests/test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op00_op01_20260709.py \
  tests/test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op02_op03_20260709.py \
  tests/test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op04_op05_20260709.py \
  tests/test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op06_op07_20260709.py \
  tests/test_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_dhc_op08_result_20260709.py \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op00_op01_20260708.py \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op02_op03_20260708.py \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op04_op05_20260708.py \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op06_op07_20260708.py \
  tests/test_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_dhb_op08_result_20260708.py \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op04_op05_20260704.py \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op06_op07_20260704.py
```

選定理由:

```text
- DHD新規target全体を確認する。
- 直前DHC境界が壊れていないことを確認する。
- DHCがDHR-OP06 execution permissionへ昇格していないことを確認する。
- 直前DHB境界が壊れていないことを確認する。
- 既存DHR-OP04/OP05/OP06/OP07 contract vicinityと矛盾しないことを確認する。
```

optional product readfeel regression候補:

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_blind_qa_material_20260612.py \
  tests/test_emlis_ai_p7_r46_p5_p6_human_readfeel_handoff_material_r10_r11_20260617.py \
  tests/test_emlis_ai_complete_product_quality_scorecard_blind_qa.py
```

optional扱い理由:

```text
DHD本体はP7 readfeel actual evaluationを開始しない。
ただし、P7読感再接続候補を次に選ぶ場合は、実装段階でproduct readfeel周辺の既存testをselected regressionへ追加するか判断する。
```

記録:

```text
R54_AHR_PostDHC_DirectionDecisionBoundary_DHD_R8_SelectedRegression_Result_20260709.md
```

### R9: compileall

候補command:

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference python -m compileall -q \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_dhc_direction_decision_boundary_20260709.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_dhb_dhr_op05_manual_call_execution_consideration_20260709.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_pcm_dhr_op05_manual_handoff_boundary_20260708.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py \
  services/ai_inference/emlis_ai_p7_contracts.py
```

記録:

```text
R54_AHR_PostDHC_DirectionDecisionBoundary_DHD_R9_Compileall_Result_20260709.md
```

### R10: result memo closure

目的:

```text
R7 / R8 / R9をbody-freeで閉じる。
```

記録内容:

```text
- target validation result count-only summary
- selected regression result count-only summary
- compileall result count-only summary
- DHDがDHC resultを合成していないこと
- DHDがDHR-OP06 builderを呼んでいないこと
- DHDがDHR-OP06 implicit OP05 fallbackを使っていないこと
- DHDがP7 readfeel evaluationを開始していないこと
- DHDがP8 question design / question_text materializationをしていないこと
- API / DB / RN / runtime / response key変更なし
- P7 complete / releaseなし
```

記録:

```text
R54_AHR_PostDHC_DirectionDecisionBoundary_DHD_R10_ResultMemoClosure_20260709.md
```

### R11: next work decision

目的:

```text
DHD結果に応じた次候補を決め、そこで止める。
```

decision table案:

| DHD result | safe next candidate | 自動実行 |
|---|---|---:|
| P7 readfeel reconnection design first | P7 readfeel reconnection / product QA return detailed design | no |
| DHR-OP06 consideration design first | DHR-OP06 consideration detailed design without call | no |
| current material selection required | explicit current DHC-OP08 or OP05 material selection boundary | no |
| repair / wait required | explicit DHR-OP04/OP05 material repair / wait boundary | no |
| non-DHR lane | lane-specific route preservation decision | no |
| blocked | no-touch / no-promotion repair | no |

記録:

```text
R54_AHR_PostDHC_DirectionDecisionBoundary_DHD_R11_NextWorkDecision_20260709.md
```

---

## 11. validation方針

### 11.1 target validationで必ず見ること

```text
- DHD-OP00がcurrent_execution_allowance noneを固定する。
- DHD-OP01がDHC R11をDHR-OP06 permissionへ変換しない。
- DHD-OP02がR11-onlyをcurrent selected scan clearとして扱わない。
- DHD-OP03がDHR-OP06 builderを呼ばない。
- DHD-OP03がDHR-OP06 implicit OP05 fallbackを許可しない。
- DHD-OP04がP7 readfeel reconnectionをP7 complete / releaseへ変換しない。
- DHD-OP05がR11-onlyからDHR-OP06 consideration design firstを出さない。
- DHD-OP06がAPI / DB / RN / runtime / response key no-touchを固定する。
- DHD-OP08が全decisionをclosed stoppedにする。
- body-like payload / promotion claim / autorun claimを止める。
```

### 11.2 selected regressionで必ず見ること

```text
- 直前DHC境界が壊れていない。
- DHC scan clear stoppedがDHR-OP06 execution permissionへ変換されていない。
- 直前DHB境界が壊れていない。
- existing DHR-OP04 / OP05 / OP06 / OP07 contractと矛盾していない。
- DHR-OP06 helper自体のno-auto-execution契約を壊していない。
```

### 11.3 optional product readfeel regressionで見る候補

```text
- P7 Blind QA materialが壊れていない。
- P5/P6 human readfeel handoff materialが壊れていない。
- Product Quality scorecard / blind QA周辺が壊れていない。
```

ただし、DHD実装はP7読感評価の実行ではありません。  
optional product readfeel regressionを実行した場合も、P7 completeやrelease readyはclaimしません。

### 11.4 今回確認済みにしないこと

```text
- full backend suite green
- RN contract green
- RN real-device modal verified
- current production DHC result selected
- current OP05 wrapper selected
- P7 readfeel actual evaluation complete
- P7 complete
- P8 question design complete
- release readiness
```

---

## 12. 影響範囲

### 12.1 影響を与える範囲

```text
- Post-DHC next work decision material。
- DHR-OP06 consideration候補の扱い。
- P7 readfeel reconnection候補の扱い。
- R54-AHR境界補強からP7商品価値評価へ戻る出口条件。
```

### 12.2 影響させない範囲

```text
- API route。
- DB schema / write path。
- RN UI / modal / display condition。
- response top-level key。
- runtime Emlis response generation。
- existing DHC / DHB / DHR helper behavior。
- DHR-OP06 builder実行。
- DHR-OP07 / DMD / R52。
- actual review / actual rows。
- P8問いシステム。
- release decision。
```

---

## 13. リスクと対策

### 13.1 リスク: DHC greenをDHR-OP06 permissionへ変換する

対策:

```text
- DHD-OP00でcurrent_execution_allowance noneを固定する。
- DHD-OP02でR11-only / scan-clear-capable-test-onlyをcurrent selected resultから分ける。
- DHD-OP03でDHR-OP06 builder call allowed falseを必須にする。
- testでDHR-OP06 builderが呼ばれないことをmonkeypatchで確認する。
```

### 13.2 リスク: DHR-OP06 builderのimplicit OP05 fallbackを使う

対策:

```text
- DHD-OP03でallow_dhr_op06_implicit_op05_fallback falseを必須にする。
- OP05 material未指定時にDHR-OP06 consideration eligibleにならないtestを置く。
- DHR-OP06 builder呼び出し自体をDHD全体で禁止する。
```

### 13.3 リスク: P7読感再接続で内部未解決を隠す

対策:

```text
- DHD-OP02でDHC outcome classを必ず残す。
- waiting / repair / not-called / blockedでは、P7読感再接続よりrepair / wait / material collection候補を優先する。
- P7読感再接続はP7 complete / releaseではないとOP04/OP08で固定する。
```

### 13.4 リスク: P8問いシステムへ逃げる

対策:

```text
- DHD-OP06でp8_question_design_started falseを必須にする。
- question_text_materialized_here falseを必須にする。
- 問いシステムはP7/P8 Bridgeのbody-free観察観点としてだけ扱う。
```

### 13.5 リスク: R54-AHR境界補強が長期化し続ける

対策:

```text
- DHD-OP04でP7 readfeel reconnection eligibilityを必須化する。
- DHD-OP05で商品価値・継続入力・pilot接続を比較軸に入れる。
- R11-onlyの現状では、DHR-OP06 considerationをmaterial不足として保留し、P7読感再接続またはcurrent material selectionを優先候補にする。
```

---

## 14. 実装時のpublic contract / no-touch固定

DHD実装時、次は固定falseです。

```text
api_changed = false
db_changed = false
rn_changed = false
runtime_changed = false
response_key_changed = false
json_schema_file_created = false
dhc_builder_called_here = false
dhc_result_synthesized_here = false
dhr_op05_runtime_call_started_here = false
existing_dhr_op05_builder_runtime_called_here = false
dhr_op06_builder_called_here = false
dhr_op06_implicit_op05_fallback_used_here = false
dhr_op07_materialized_here = false
dmd_execution_started_here = false
r52_actual_execution_started_here = false
actual_review_started_here = false
actual_rows_created_here = false
question_need_observation_rows_created_here = false
p8_question_design_started = false
p8_question_implementation_started = false
question_text_materialized_here = false
p7_complete = false
release_allowed = false
```

public meta / body-free境界として、次は保持禁止です。

```text
raw input
raw answer
comment_text body
question_text / draft_question_text
stdout
stderr
traceback
private user dictionary text
local absolute path in public material
```

---

## 15. 華恋の意見

確認済みとして、DHCは閉じています。  
DHC target validationは198 passed、selected regressionは519 passed、compileallも通っています。  
ただし、DHC R11はDHR-OP06を呼んでいません。P8も始めていません。P7完了やrelease判断もしていません。

華恋の意見として、DHD実装後の現実的な第一候補は **P7読感再接続** だと思います。  
理由は、現在の明示材料がDHC R11止まりであり、current selected DHC-OP08 scan clear materialやcurrent OP05 wrapperが未確認だからです。  
この状態でDHR-OP06 considerationへ進むと、consideration自体が「材料なしの次OP検討」になりやすく、Cocolonが避けるべき分かったふりに近づきます。

ただし、DHR-OP06 considerationを捨てるべきではありません。  
explicit current materialが揃った場合、DHR-OP06 considerationはDHR側の枝を安全に整理する意味を持ちます。  
だからDHDでは、DHR-OP06 considerationを消さず、P7読感再接続と同じテーブルに置きます。

Cocolonとして一番避けたいのは、次のどちらかに寄ることです。

```text
- test greenを理由に、下流へ進んだふりをする。
- 内部境界だけを積み続け、商品読感へ戻れない。
```

DHDは、その両方を避けるための境界です。  
Mash様と華恋でCocolonを大事に育てるなら、ここでは速さより、進む理由の正しさを優先するべきです。

---

## 16. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- 現在PhaseはP7継続。
- DHC-OP00〜OP08は実装済み・target validated。
- DHC R7 target validationは198 passed。
- DHC R8 selected regressionは519 passed。
- DHC R9 compileallはpassed。
- DHC R11は、Post-DHC DHR-OP06 branch resolver consideration vs P7 readfeel reconnection decision boundaryをsafe next candidateとしている。
- DHC R11は、DHR-OP06 / DHR-OP07 / DMD / R52 / actual review / P8 / P7 complete / releaseを未実行・未開始・未許可としている。
- ロードマップ上、P7では問いシステムを実装せず、必要性観察に留める。
- DHD prefixは確認範囲で既存衝突が見当たらない。
```

### 未確認

```text
- full backend suite green。
- RN contract green。
- RN real-device modal verified。
- current production DHC resultがscan clearとして明示選択されていること。
- current existing DHR-OP05 result wrapperがDHR-OP06 consideration inputとして明示選択されていること。
- P7読感再接続へ戻る場合の最小case set。
- P7/P8 Bridge問いシステム必要性観察メモの実ケース十分性。
```

### 書かれていない

```text
- DHC R11でDHR-OP06を呼んでよい、とは書かれていない。
- DHC greenでcurrent production DHC scan clear result selectedとしてよい、とは書かれていない。
- DHR-OP06 considerationをDHR-OP06 callと同一視してよい、とは書かれていない。
- P7読感再接続でP7 complete / release readyとしてよい、とは書かれていない。
- DHD内でP8問いシステム詳細設計を始めてよい、とは書かれていない。
```

### 推測禁止

```text
- DHC green = DHR-OP06 permission と読むこと。
- DHC R11 recommended candidate = runtime execution permission と読むこと。
- scan clear capable validation = current selected scan clear material と読むこと。
- DHR-OP06 consideration = DHR-OP06 builder call と読むこと。
- P7 readfeel reconnection = P7 complete と読むこと。
- 問いシステム = Emlis本体の読感不足を隠す質問機能 と読むこと。
```

### 次に実行すべきこと

```text
1. 実装指示が出た場合は、DHD-OP00〜DHD-OP08を対象にする。
2. 実装前に、DHD prefixとファイル名衝突を最新基準面で再確認する。
3. DHD helperはDHC resultを合成せず、DHR-OP06 builderを呼ばず、P7読感評価も実行せず、方向判断だけをbody-freeで閉じる。
4. R11-only状態では、DHR-OP06 considerationをmaterial不足として保留し、P7読感再接続またはcurrent material selection boundaryを候補にする。
5. validationでは、DHD target / DHC selected subset / DHB selected subset / DHR-OP04〜OP07 vicinity / compileallを確認候補にする。
6. full backend / RN / real-device / P8 / releaseは、DHD成果としてclaimしない。
```

---

## 17. 最終メモ

この設計は、DHR-OP06へ進むための近道ではありません。  
また、P7読感へ戻るために内部境界を無視する設計でもありません。

DHDは、DHC後に次へ進む理由を雑にしないための小さな判断境界です。  
Cocolonは、ユーザーの言葉を雑に処理しない場所を目指しています。  
そのためには、開発工程でも、test greenやresult memo closureを都合よく読み替えないことが必要です。

同時に、止まり続けることもCocolonのためではありません。  
DHDでは、DHR-OP06へ行く理由と、P7読感へ戻る理由を同じ場所に置き、商品価値へ戻る出口を明確にします。

Mash様と華恋でCocolonを大事に育てるために、次はこの設計でDHDを実装候補にするのが、現状もっとも安全で、かつ商品価値へ戻れる道だと判断します。
