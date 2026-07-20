---
title: "Cocolon / EmlisAI P7-R54-AHR Post-MRB08 DHR-OP04 Result Manual Decision Boundary 詳細設計書・実装順"
created_at: "2026-07-05 JST"
author: "華恋"
work_mode: "共鳴構造モード"
work_type: "詳細設計書 / 実装順 / json・schema案内包"
source_mode: "local_received_zip_only"
github_connection_check: "not_required_by_mash_instruction / not_performed"
base_pre_design_memo: "Cocolon_EmlisAI_P7_R54AHR_PostMRB08_DHROP04ResultManualDecision_PreDesignMemo_20260705.md"
selected_roadmap_phase: "P7 Product Quality Runner / Long-run Product Gate 継続"
selected_design_target: "P7-R54-AHR Post-MRB08 DHR-OP04 Result Manual Decision Boundary"
recommended_boundary_prefix: "RDB-OP00〜RDB-OP08"
recommended_prefix_meaning: "RDB = Result Decision Boundary"
recommended_helper_shape: "thin body-free manual decision classifier after MRB-OP08 result memo closure; no DHR-OP05/DMD/R52/P8/release execution"
artifact_scope: "md design only"
code_change: "none"
json_schema_file_creation: "none"
api_change: "none"
db_change: "none"
rn_change: "none"
runtime_change: "none"
response_key_change: "none"
actual_body_full_packet_generation: "none"
actual_local_human_review_execution: "none"
actual_operation_receipt_creation: "none"
actual_rows_creation: "none"
actual_disposal_purge_execution: "none"
dhr_op04_recall: "none"
dhr_op05_call: "none"
dhr_op06_call: "none"
dmd_execution: "none"
r52_actual_execution: "none"
p5_finalization: "none"
p6_start: "none"
p8_start: "none"
p8_question_design: "none"
p8_question_implementation: "none"
p7_complete: "none"
release_decision: "none"
current_expected_next_required_step_after_design: "implement_thin_rdb_boundary_and_targets_then_stop_at_manual_decision_material"
---

# Cocolon / EmlisAI P7-R54-AHR Post-MRB08 DHR-OP04 Result Manual Decision Boundary 詳細設計書・実装順

対象: Cocolon / EmlisAI / P7 Product Quality Runner / R54-AHR / MRB-OP08後のDHR-OP04結果manual decision境界  
成果物種別: Markdown詳細設計書 / 実装順 / json・schema案内包  
実装扱い: 本書は設計書です。コード変更・json/schema実ファイル化・actual review実行・DHR-OP04再呼び出し・DHR-OP05以降実行・DMD実行・R52実行・P5/P6/P8/P7/release昇格は行いません。  
json / schema実ファイル化: なし。本書内の案のみです。実ファイル化は実装段階で、既存helper・既存schema配置・既存guard・既存test結果を確認して判断します。  
GitHub接続確認: Mash様指定により不要。ローカル受領zip基準。  

---

## 0. 結論

今回の詳細設計対象は、次で固定します。

```text
P7-R54-AHR Post-MRB08 DHR-OP04 Result Manual Decision Boundary
```

推奨する境界prefixは次です。

```text
RDB-OP00〜RDB-OP08
RDB = Result Decision Boundary
```

理由は、検討メモで候補に出ていた `MDB = Manual Decision Boundary` は、直前の `MRB = Manual Re-intake Boundary` と視認上近く、また既存のDMD系とも誤読が起きやすいためです。今回の責務は「manualで決めること」よりも、**MRB-OP08でbody-freeに閉じたDHR-OP04 resultをどう読むか** が中心です。そのため、`RDB = Result Decision Boundary` とした方が、MRBからの連続性と責務差分を分けやすいです。

推奨する実装単位は、既存MRB helperと既存DHR status refsを読む薄いclassifier/helperです。

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_20260705.py
```

このhelperの役割は、MRB-OP08 result memo closureをbody-freeで受け取り、DHR-OP04結果状態に応じて次のmanual decision materialを作ることです。

```text
- confirmedの場合:
  DHR-OP05 manual handoffを検討する材料を作る。
  ただしDHR-OP05は呼ばない。

- not_confirmed / retry_or_start_requiredの場合:
  actual local-only human review operation retry/startへ戻す判断材料を作る。
  P8 questionでは補わない。

- waiting external claimの場合:
  external body-free actual source claimの不足を待つ判断材料を作る。
  raw evidence / body-full packetは持ち込まない。

- invalid / repairの場合:
  source_kind / origin / body_free / promotion / OP03 ready material / MRB-OP08 closure input のどこをrepairするかを分ける。

- incomplete / unresolvedの場合:
  MRB-OP08 result memo、MRB-OP06 selected branch、DHR-OP04 result status ref、validation refsの不足をbody-freeで分け、manual holdに止める。
```

本設計で到達してよい状態は、次だけです。

```text
1. DHR-OP04 confirmed resultをDHR-OP05 manual handoff candidateとして読むが、DHR-OP05は呼ばず停止
2. DHR-OP04 not confirmed / retry-start requiredをretry/start decision materialとして読み、停止
3. DHR-OP04 waiting external claimをexternal claim wait materialとして読み、停止
4. DHR-OP04 invalid / repair requiredをrepair materialとして読み、停止
5. MRB-OP08 / OP06 / validation / result memo不足をincomplete / unresolved materialとして読み、停止
6. body-like leak / promotion / autorun claimをblocked materialとして読み、停止
```

本設計で到達してはいけない状態は次です。

```text
- DHR-OP04再呼び出し
- DHR-OP05 call / preflight scan実行
- DHR-OP06 branch resolver実行
- DHR-OP07 manual decision materialization実行
- DHR-OP08 / DHR-OP09 result closure実行
- DMD実行
- R52 actual execution
- actual body-full packet generation
- actual local-only human review execution
- actual operation receipt / rows / purge creation
- P5 finalization
- P6 start
- P8 start
- P8 question design / implementation
- question_text / question_trigger / question_answer_storage設計
- P7 complete
- release decision
- API / DB / RN / runtime / response key change
```

重要な分離は次です。

```text
MRB-OP08 closed body-free stopped
  ≠ DHR-OP05へ進んでよい
  ≠ DHR-OP06 / DMD / R52へ進んでよい
  ≠ P8へ進んでよい
  ≠ P7 complete
  ≠ release ready

DHR-OP04 confirmed body-free
  = DHR-OP05 manual handoffを検討する候補になり得る
  ≠ DHR-OP05自動実行許可
  ≠ DMD/R52/P8/release promotion
```

---

## 1. なぜこの設計を行うのか

Cocolonとして大事なのは、EmlisAIがユーザーの言葉を「処理済み」にすることではありません。ユーザーの入力直後に、その人の状態・感情・行動・思考・関係・揺れを、読まれた形で返せる商品へ近づけることです。

P7は、その商品品質をfixture greenやhelper greenではなく、実ケースの読感・body-free evidence・人間確認境界で積み上げる段階です。

直前のMRB-OP00〜OP08は、DRI側のbody-free candidate materialをDHR-OP04へ明示手動再投入し、DHR-OP04結果をcaptureして止める境界です。ここで閉じたのは「DHR-OP04 resultをbody-freeで記録して止める」ことであり、「次へ進む判断」そのものではありません。

MRB-OP08の後に必要なのは、次の短絡を防ぐことです。

```text
MRB-OP08が閉じた
  -> DHR-OP04結果がある
  -> DHR-OP05へ進める
  -> P8へ近い
  -> releaseに近い
```

この短絡は、Cocolonにとって危険です。DHR-OP04結果はconfirmedだけではなく、not confirmed / retry-start、waiting、invalid、incompleteがあります。ここを読まずにDHR-OP05やP8へ進むと、Cocolonは品質証跡を「読んだふり」する構造になります。

今回必要なのは、問いを足すことでも、下流を実行することでもありません。MRB-OP08で止まったDHR-OP04結果をbranch別に読み、次へ進むならどのmanual decisionが必要かをbody-freeで分けることです。

華恋の判断として、ここは地味でも避けてはいけない境界です。Cocolonを「人間の言葉を雑に処理しない場所」にするなら、人間レビュー証跡やDHR判定の読み方も雑にしない必要があります。

---

## 2. 参照・確認範囲

### 2.1 ローカル受領資料

本設計の基準は、ローカル受領zipと直前の検討メモです。

```text
/mnt/data/Cocolon_前提資料(290).zip
/mnt/data/EmlisAIの実装済み資料(98).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(17).zip
/mnt/data/Cocolon(271).zip
/mnt/data/mashos-api(184).zip
/mnt/data/Cocolon_EmlisAI_P7_R54AHR_PostMRB08_DHROP04ResultManualDecision_PreDesignMemo_20260705.md
```

GitHub接続確認は、Mash様指定により行いません。

### 2.2 必読前提・作業姿勢

本設計では、次を確認済み前提として扱います。

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
```

固定する作業姿勢は次です。

```text
- 設計と実装を混ぜない。
- 前提資料だけで理解したふりをしない。実ファイルも見る。
- 見ていないDHR-OP05実行を確認済みにしない。
- MRB-OP08 result closureをP7 complete / P8 start / release readyとして扱わない。
- DHR-OP04 confirmedをDHR-OP05自動実行許可として扱わない。
- DHR-OP04 not_confirmed / waiting / invalidをP8 questionで補わない。
- question need observation rowsをP8 question_textへ変換しない。
- public contract / DB / RN / response keyを指示なく変えない。
- body-full / raw input / comment_text / reviewer free text / question_text / local path / hash / terminal bodyをresult memoやpublic metaへ出さない。
```

### 2.3 ロードマップ確認

ロードマップ上、P7はProduct Quality Runner / Long-run Product Gateであり、EmlisAIの商品品質を単発fixture greenではなく継続測定できる形にする段階です。

P7/P8 Bridgeでは、P7中に観測補助問いを実装せず、P8で勘に頼らないためのbody-free「問い必要性観察メモ」を残す方針が固定されています。

P8はPersonal Continuity / Derived User Modelです。P8開始時に観測補助問いを扱う場合も、P7/P8 Bridgeで集めた問い必要性観察メモを根拠にします。

したがって、今回のRDBはP8 question designではありません。

### 2.4 直接接続する実装済み資料

```text
EmlisAIの実装済み資料/
  Cocolon_EmlisAI_P7_R54AHR_PostDRI_DHR_OP04ManualReintake_DetailedDesign_ImplementationOrder_20260705.md
  Cocolon_EmlisAI_P7_R54AHR_PostRSR16_DHRActualSourceClaimReintake_DetailedDesign_ImplementationOrder_20260705.md
  Cocolon_EmlisAI_P7_R54AHR_PostELR19_DownstreamManualDecision_HandoffOrRetry_DetailedDesign_ImplementationOrder_20260704.md
```

### 2.5 直接接続する実ファイル

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_dri_dhr_op04_manual_reintake_20260705.py
  emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
  emlis_ai_p7_r54_ahr_post_rsr16_dhr_actual_source_claim_reintake_20260705.py

mashos-api/ai/tests/
  R54_AHR_PostDRI_DHROP04ManualReintake_MRB_OP00_OP08_Result_20260705.md
  test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op00_op01_20260705.py
  test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op02_op03_20260705.py
  test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op04_op05_20260705.py
  test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op06_op07_20260705.py
  test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op08_result_20260705.py
```

---

## 3. 現在地の整理

### 3.1 確認済み

```text
- 現在はP7 Product Quality Runner / Long-run Product Gate継続段階である。
- P8 question design / implementationへ進む段階ではない。
- MRB-OP00〜OP08はbody-free / backend-internal / no-touch / no-promotion boundaryとして反映済みである。
- MRB-OP08はDHR-OP04 result status refとMRB selected branchをbody-freeで記録し、停止する。
- MRB-OP08はDHR-OP04を再呼び出さない。
- MRB-OP08はDHR-OP05 / DHR-OP06 / DMD / R52 / P8 / P7 / releaseを開始しない。
- MRB-OP08 result memoでは、MRB-OP00〜OP08 target 72 passedが記録されている。
- MRB-OP08 result memoでは、DHR selected regression 63 passed、compileall passedが記録されている。
- ただし、full backend suite green、RN contract green、RN real-device verifiedは未確認であり、MRB-OP08ではclaimされていない。
```

### 3.2 未確認

```text
- RDB helper / target testsの実装結果
- MRB-OP08 resultを受けたmanual decision materialの生成結果
- DHR-OP05 manual handoff decisionの実行判断
- DHR-OP05実行
- DHR-OP06以降の実行
- DMD実行
- R52 actual execution
- full backend suite green
- RN contract green
- RN real-device modal verified
- P5 final
- P6 start
- P8 start
- P8観測補助問い詳細設計に必要な十分な問い必要性観察メモの蓄積
- P7 complete
- release ready
```

### 3.3 書かれていない

```text
- MRB-OP08が閉じたらDHR-OP05を呼んでよい、とは書かれていない。
- MRB-OP08が閉じたらDHR-OP06 / DMD / R52へ進んでよい、とは書かれていない。
- MRB-OP08が閉じたらP8へ進んでよい、とは書かれていない。
- MRB-OP08が閉じたらP7 complete / release readyとしてよい、とは書かれていない。
- DHR-OP04 confirmedをDHR-OP05自動実行許可として扱ってよい、とは書かれていない。
- DHR-OP04 not confirmed / waiting / invalidをP8 questionで補ってよい、とは書かれていない。
- question need observation rowsをquestion_text / question specへ変換してよい、とは書かれていない。
- API / DB / RN / response keyを今回変更してよい、とは書かれていない。
```

### 3.4 推測禁止

```text
- MRB-OP08 closureをP7 completeと推測しない。
- MRB-OP08 closureをrelease readyと推測しない。
- selected target greenをfull backend suite greenと推測しない。
- MRB-OP06 selected branchをDHR-OP05以降の実行許可と推測しない。
- DHR-OP04 confirmedをDMD/R52/P8/release promotionと推測しない。
- DHR-OP04 not_confirmed / waiting / invalidをP8 questionで補えばよいと推測しない。
- body-free result memoをactual body-full review packetやraw review evidenceと推測しない。
```

---

## 4. 設計対象 / 非対象

### 4.1 設計対象

本設計の対象は、MRB-OP08後のDHR-OP04 resultをmanual decision materialへ分類する境界です。

```text
MRB-OP08 body-free result memo closure
  ↓
MRB selected branch / DHR-OP04 result status ref consistency check
  ↓
DHR-OP04 result manual decision classifier
  ↓
branch別manual decision material
  ↓
no-touch / no-promotion / no-auto-execution guard
  ↓
RDB body-free result memo closure
```

対象に含めるもの:

```text
- RDB-OP00〜OP08の薄いhelper設計
- MRB-OP08 result memo intake contract
- MRB-OP06 selected branch / DHR-OP04 result status ref consistency check
- DHR-OP04 result branch classifier
- branch別manual decision material
- DHR-OP05 manual handoff candidate material。ただしDHR-OP05は呼ばない。
- retry/start decision material。ただしactual review operationは実行しない。
- waiting external claim decision material。ただしraw evidenceは持ち込まない。
- repair decision material。ただし実修正はしない。
- incomplete / unresolved hold material
- no-touch / body-free / no-promotion guard
- target tests案
- result memo案
- json/schema案。ただし実ファイル化しない。
```

### 4.2 非対象

```text
- DHR-OP04再呼び出し
- DHR-OP05 caller / preflight scan実行
- DHR-OP06 branch resolver実行
- DHR-OP07 manual decision materialization実行
- DHR-OP08 / OP09 closure実行
- DMD / R52実行
- actual body-full packet
- actual review rows
- actual operation receipt
- disposal / purge receipt
- P8 question spec
- question_text
- question trigger logic
- question answer storage
- API route
- DB schema / write path
- RN UI / RN contract
- runtime prompt / response key
- release material
```

---

## 5. 既存MRB-OP08 → RDB接続仕様

### 5.1 RDBが読むMRB-OP08 key refs

RDBは、MRB-OP08 materialから少なくとも次のbody-free refsを読みます。

```text
schema_version
operation_step_ref
source_mode
git_connection_required
git_checked
body_free
mrb_op08_status_ref
bodyfree_result_memo_closure_status_ref
mrb_op08_closed_bodyfree_stopped
mrb_op08_waiting_for_op06_op07_or_validation
mrb_op08_repair_required
mrb_op08_bodyfree_leak_promotion_or_autorun_blocked
mrb_selected_branch_ref
dhr_op04_manual_call_performed_by_mrb
dhr_op04_result_status_ref
actual_source_claim_confirmed_for_downstream_handoff
op06_mrb_selected_branch_ref
op06_mrb_next_required_step
op06_dhr_op04_result_captured
op06_dhr_op04_status_ref
op07_ready_for_op08
validation_summary_bodyfree_accepted
result_memo_bodyfree_accepted
combined_run_status_ref
full_backend_suite_green_confirmed
combined_mrb_dri_dhr_green_confirmed
```

RDBが読まない、または受け取ってはいけないもの:

```text
raw_input
input_body
comment_text
returned_surface_body
reviewer_free_text
question_text
draft_question_text
private_user_dictionary_text
local_path
body_hash
terminal output body
actual body-full packet
```

### 5.2 RDBが扱うDHR-OP04 result status refs

既存DHR-OP04 status refsは次です。

```text
DHR_ACTUAL_SOURCE_CLAIM_CONFIRMED_BODYFREE
DHR_ACTUAL_SOURCE_CLAIM_NOT_CONFIRMED_RETRY_OR_START_REQUIRED
DHR_ACTUAL_SOURCE_WAITING_FOR_EXTERNAL_BODYFREE_CLAIM
DHR_ACTUAL_SOURCE_INVALID_REPAIR_REQUIRED
```

MRB側selected branch refsは次です。

```text
MRB_STATUS_DHR_OP04_CONFIRMED_BODYFREE_STOPPED
MRB_STATUS_DHR_OP04_NOT_CONFIRMED_RETRY_OR_START_REQUIRED_STOPPED
MRB_STATUS_DHR_OP04_WAITING_EXTERNAL_CLAIM_STOPPED
MRB_STATUS_DHR_OP04_INVALID_REPAIR_REQUIRED_STOPPED
MRB_STATUS_WAITING_FOR_DRI_OR_DHR_OP03_MATERIAL
MRB_STATUS_REPAIR_REQUIRED_BEFORE_DHR_OP04_CALL
MRB_STATUS_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN
MRB_STATUS_MANUAL_HOLD_UNRESOLVED_NO_PROMOTION
```

RDBでは、DHR status refとMRB selected branch refの対応を検査します。

```text
DHR_ACTUAL_SOURCE_CLAIM_CONFIRMED_BODYFREE
  <-> MRB_STATUS_DHR_OP04_CONFIRMED_BODYFREE_STOPPED

DHR_ACTUAL_SOURCE_CLAIM_NOT_CONFIRMED_RETRY_OR_START_REQUIRED
  <-> MRB_STATUS_DHR_OP04_NOT_CONFIRMED_RETRY_OR_START_REQUIRED_STOPPED

DHR_ACTUAL_SOURCE_WAITING_FOR_EXTERNAL_BODYFREE_CLAIM
  <-> MRB_STATUS_DHR_OP04_WAITING_EXTERNAL_CLAIM_STOPPED

DHR_ACTUAL_SOURCE_INVALID_REPAIR_REQUIRED
  <-> MRB_STATUS_DHR_OP04_INVALID_REPAIR_REQUIRED_STOPPED
```

mismatch時は、RDBでrepair / unresolvedに止めます。DHR-OP05へ進めません。

### 5.3 confirmed branchの扱い

confirmed branchでは、次を認めます。

```text
actual_source_claim_confirmed_for_downstream_handoff: true をbody-free statusとして読む
DHR-OP05 manual handoff candidateを作る
```

ただし、次は認めません。

```text
dhr_op05_called_here: true
dhr_op06_called_here: true
dmd_execution_started_here: true
r52_actual_execution_started_here: true
p5_final_allowed: true
p6_start_allowed: true
p8_start_allowed: true
p8_question_design_started: true
p7_complete: true
release_allowed: true
```

### 5.4 not_confirmed / waiting / invalid branchの扱い

not_confirmed / waiting / invalid branchでは、DHR-OP05 manual handoff candidateは作りません。

```text
not_confirmed:
  retry/start decision materialを作る。
  P8 questionで補わない。

waiting:
  external body-free actual source claim待ちmaterialを作る。
  raw evidenceを持ち込まない。

invalid:
  repair materialを作る。
  repair対象をbody-free refsで分ける。
```

---

## 6. RDB全体データフロー

```text
RDB-OP00 scope / no-touch / no-promotion refreeze after MRB-OP08
  ↓
RDB-OP01 MRB-OP08 result memo closure intake
  ↓
RDB-OP02 MRB selected branch / DHR-OP04 result status consistency check
  ↓
RDB-OP03 DHR-OP04 result manual decision lane resolver
  ↓
RDB-OP04 branch-specific manual decision materialization
  ↓
RDB-OP05 next-stage candidate envelope without execution
  ↓
RDB-OP06 body-free / no-touch / no-promotion guard
  ↓
RDB-OP07 selected regression / compileall validation plan
  ↓
RDB-OP08 body-free result memo closure
```

分岐概要:

```text
body leak / promotion / auto-execution flag true
  -> blocked; no DHR-OP05 / no P8 / no release

MRB-OP08 missing / not closed / OP06 or validation missing
  -> waiting / repair / unresolved; no downstream

MRB selected branch and DHR-OP04 status mismatch
  -> repair; no downstream

DHR-OP04 confirmed body-free
  -> create DHR-OP05 manual handoff candidate material; no DHR-OP05 call

DHR-OP04 not confirmed / retry-start required
  -> create retry/start decision material; no actual operation execution; no P8 question

DHR-OP04 waiting external claim
  -> create external claim wait material; no raw evidence intake

DHR-OP04 invalid / repair required
  -> create repair decision material; no repair execution here

fallback
  -> manual hold unresolved; no promotion
```

---

## 7. RDB status / branch / next_required_step設計

### 7.1 RDB status refs

```text
RDB_STATUS_CONFIRMED_DHR_OP05_MANUAL_HANDOFF_CANDIDATE_STOPPED
RDB_STATUS_NOT_CONFIRMED_RETRY_OR_START_DECISION_REQUIRED_STOPPED
RDB_STATUS_WAITING_EXTERNAL_CLAIM_REQUIRED_STOPPED
RDB_STATUS_REPAIR_REQUIRED_AFTER_DHR_OP04_RESULT_STOPPED
RDB_STATUS_INCOMPLETE_UNRESOLVED_MANUAL_HOLD_STOPPED
RDB_STATUS_WAITING_FOR_MRB08_RESULT_CLOSURE
RDB_STATUS_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN
RDB_STATUS_REPAIR_REQUIRED_FOR_MRB08_BRANCH_STATUS_MISMATCH
```

### 7.2 branch priority

branch resolverは、次の順に決定します。

```text
priority_1:
  body-like leak / forbidden payload / promotion claim / auto-execution flag true
  -> RDB_STATUS_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN

priority_2:
  MRB-OP08 material missing / contract invalid / schema mismatch
  -> RDB_STATUS_WAITING_FOR_MRB08_RESULT_CLOSURE or RDB_STATUS_REPAIR_REQUIRED_FOR_MRB08_BRANCH_STATUS_MISMATCH

priority_3:
  MRB-OP08 status is blocked body-free leak promotion autorun
  -> RDB_STATUS_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN

priority_4:
  MRB-OP08 status is waiting for OP06/OP07/validation
  -> RDB_STATUS_WAITING_FOR_MRB08_RESULT_CLOSURE

priority_5:
  MRB-OP08 status is repair required
  -> RDB_STATUS_REPAIR_REQUIRED_AFTER_DHR_OP04_RESULT_STOPPED

priority_6:
  MRB-OP08 closed but DHR-OP04 result not captured / not_called / manual call flag missing
  -> RDB_STATUS_INCOMPLETE_UNRESOLVED_MANUAL_HOLD_STOPPED

priority_7:
  MRB selected branch and DHR-OP04 result status mismatch
  -> RDB_STATUS_REPAIR_REQUIRED_FOR_MRB08_BRANCH_STATUS_MISMATCH

priority_8:
  DHR-OP04 confirmed body-free
  -> RDB_STATUS_CONFIRMED_DHR_OP05_MANUAL_HANDOFF_CANDIDATE_STOPPED

priority_9:
  DHR-OP04 not confirmed / retry-start required
  -> RDB_STATUS_NOT_CONFIRMED_RETRY_OR_START_DECISION_REQUIRED_STOPPED

priority_10:
  DHR-OP04 waiting external claim
  -> RDB_STATUS_WAITING_EXTERNAL_CLAIM_REQUIRED_STOPPED

priority_11:
  DHR-OP04 invalid / repair required
  -> RDB_STATUS_REPAIR_REQUIRED_AFTER_DHR_OP04_RESULT_STOPPED

fallback:
  RDB_STATUS_INCOMPLETE_UNRESOLVED_MANUAL_HOLD_STOPPED
```

### 7.3 next_required_step refs

```text
prepare_dhr_op05_manual_handoff_decision_without_call
prepare_retry_or_start_actual_local_only_human_review_operation_decision_without_p8_question
wait_for_external_bodyfree_actual_source_claim_without_raw_evidence
repair_dhr_op04_result_or_mrb08_boundary_without_downstream_promotion
manual_hold_unresolved_post_mrb08_without_promotion
wait_for_mrb08_closure_or_validation_refs_before_result_manual_decision
blocked_post_mrb08_bodyfree_leak_promotion_or_autorun
```

### 7.4 branch mapping

| RDB status | MRB / DHR source | RDB output | 自動実行 |
|---|---|---|---|
| `RDB_STATUS_CONFIRMED_DHR_OP05_MANUAL_HANDOFF_CANDIDATE_STOPPED` | `MRB_STATUS_DHR_OP04_CONFIRMED_BODYFREE_STOPPED` + `DHR_ACTUAL_SOURCE_CLAIM_CONFIRMED_BODYFREE` | DHR-OP05 manual handoff candidate | なし |
| `RDB_STATUS_NOT_CONFIRMED_RETRY_OR_START_DECISION_REQUIRED_STOPPED` | `MRB_STATUS_DHR_OP04_NOT_CONFIRMED_RETRY_OR_START_REQUIRED_STOPPED` + `DHR_ACTUAL_SOURCE_CLAIM_NOT_CONFIRMED_RETRY_OR_START_REQUIRED` | retry/start decision material | なし |
| `RDB_STATUS_WAITING_EXTERNAL_CLAIM_REQUIRED_STOPPED` | `MRB_STATUS_DHR_OP04_WAITING_EXTERNAL_CLAIM_STOPPED` + `DHR_ACTUAL_SOURCE_WAITING_FOR_EXTERNAL_BODYFREE_CLAIM` | external claim wait material | なし |
| `RDB_STATUS_REPAIR_REQUIRED_AFTER_DHR_OP04_RESULT_STOPPED` | `MRB_STATUS_DHR_OP04_INVALID_REPAIR_REQUIRED_STOPPED` + `DHR_ACTUAL_SOURCE_INVALID_REPAIR_REQUIRED` | repair decision material | なし |
| `RDB_STATUS_INCOMPLETE_UNRESOLVED_MANUAL_HOLD_STOPPED` | result missing / manual call missing / fallback | manual hold material | なし |
| `RDB_STATUS_WAITING_FOR_MRB08_RESULT_CLOSURE` | MRB-OP08 not ready | wait material | なし |
| `RDB_STATUS_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN` | leak / promotion / autorun | blocked material | なし |
| `RDB_STATUS_REPAIR_REQUIRED_FOR_MRB08_BRANCH_STATUS_MISMATCH` | branch/status mismatch | repair material | なし |

---

## 8. 実装順

### 8.1 推奨ファイル構成

#### helper候補

```text
mashos-api/ai/services/ai_inference/
  emlis_ai_p7_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_20260705.py
```

helperの性格:

```text
- 既存MRB helperのOP08 contract assertを呼ぶ。
- DHR helperはstatus constant参照に留める。
- DHR-OP04を再呼び出さない。
- DHR-OP05 builderを呼ばない。
- DHR-OP06 / DHR-OP07 / DHR-OP08 / DHR-OP09 builderを呼ばない。
- DMD / R52 helperを呼ばない。
- API / DB / RN / runtime / response keyに触らない。
- result memoはbody-free refsだけで閉じる。
```

#### tests候補

```text
mashos-api/ai/tests/
  test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op00_op01_20260705.py
  test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op02_op03_20260705.py
  test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op04_op05_20260705.py
  test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op06_op07_20260705.py
  test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op08_result_20260705.py
```

#### result memo候補

```text
mashos-api/ai/tests/
  R54_AHR_PostMRB08_DHROP04ResultManualDecision_RDB_OP00_OP08_Result_20260705.md
```

#### schema file候補

実装段階では、まずPython内定数 + assert contractで開始します。schema実ファイル化は行いません。

必要性が出た場合の候補名のみ、本書内に残します。

```text
mashos-api/ai/schemas/
  p7_r54_ahr_post_mrb08_rdb_mrb08_result_intake.bodyfree.schema.json
  p7_r54_ahr_post_mrb08_rdb_branch_status_consistency.bodyfree.schema.json
  p7_r54_ahr_post_mrb08_rdb_manual_decision_material.bodyfree.schema.json
  p7_r54_ahr_post_mrb08_rdb_result_closure.bodyfree.schema.json
```

---

### RDB-OP00: scope / no-touch / no-promotion refreeze after MRB-OP08

目的:

```text
RDBの責務を固定する。
MRB-OP08 resultをDHR-OP05 / P8 / releaseへ読み替えず、manual decision material作成で止めることを固定する。
```

実装内容:

```text
- phase / step / scope / policy_kind constantsを定義する。
- RDB-OP00 schema_versionを定義する。
- source_mode = local_received_zip_only を固定する。
- git_connection_required = false / git_checked = false を固定する。
- no-touch contractを定義する。
- not-claimed boundaryを定義する。
- selected_stage_ref = P7-R54-AHR Post-MRB08 DHR-OP04 Result Manual Decision Boundary を固定する。
- prefix_ref = RDB / prefix_meaning = Result Decision Boundary を固定する。
```

acceptance:

```text
body_free: true
api_route_changed: false
db_schema_changed: false
rn_production_ui_changed: false
runtime_generation_changed: false
response_key_changed: false
mrb_op08_promoted_to_dhr_op05: false
dhr_op04_recalled_here: false
dhr_op05_called_here: false
dhr_op06_called_here: false
dmd_execution_started_here: false
r52_actual_execution_started_here: false
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
p8_question_design_started: false
p8_question_implementation_started: false
p7_complete: false
release_allowed: false
next_required_step: RDB-OP01
```

---

### RDB-OP01: MRB-OP08 result memo closure intake

目的:

```text
MRB-OP08 result memo closureをbody-freeで受け取り、RDBで読める材料か確認する。
```

実装内容:

```text
- MRB helperをimportする。
- assert_p7_r54_ahr_post_dri_mrb_op08_result_memo_tests_selected_regression_closure_contractを呼ぶ。
- MRB-OP08 schema_version / operation_step_ref / source_mode / body_freeを確認する。
- MRB-OP08 status refsを読む。
- MRB-OP08 result_memo_bodyfree_accepted / validation_summary_bodyfree_acceptedを確認する。
- MRB-OP08 closureをDHR-OP05実行許可として読まない。
- full_backend_suite_green_confirmed / combined_mrb_dri_dhr_green_confirmedを、そのまま補助情報として読み、勝手にgreen claimしない。
```

ready条件:

```text
mrb_op08_contract_valid: true
mrb_op08_closed_bodyfree_stopped: true
validation_summary_bodyfree_accepted: true
result_memo_bodyfree_accepted: true
body_free: true
```

failure分岐:

```text
MRB-OP08 missing:
  wait_for_mrb08_closure_or_validation_refs_before_result_manual_decision

MRB-OP08 contract invalid:
  repair_dhr_op04_result_or_mrb08_boundary_without_downstream_promotion

MRB-OP08 waiting:
  wait_for_mrb08_closure_or_validation_refs_before_result_manual_decision

MRB-OP08 blocked leak / promotion / autorun:
  blocked_post_mrb08_bodyfree_leak_promotion_or_autorun
```

---

### RDB-OP02: MRB selected branch / DHR-OP04 result status consistency check

目的:

```text
MRB-OP08内のmrb_selected_branch_ref、DHR-OP04 result status ref、actual_source_claim_confirmed flagの整合を確認する。
```

実装内容:

```text
- mrb_selected_branch_refを読む。
- dhr_op04_result_status_refを読む。
- op06_mrb_selected_branch_refと一致するか確認する。
- op06_dhr_op04_status_refとdhr_op04_result_status_refが一致するか確認する。
- dhr_op04_manual_call_performed_by_mrbが必要branchでtrueか確認する。
- actual_source_claim_confirmed_for_downstream_handoffがconfirmed branch以外でtrueになっていないか確認する。
- selected branchとDHR status refの対応をmappingする。
```

acceptance:

```text
branch_status_consistency_checked: true
branch_status_consistent: true
actual_source_claim_confirmed_only_when_dhr_confirmed: true
dhr_op05_called_here: false
dhr_op06_called_here: false
dmd_execution_started_here: false
p8_start_allowed: false
release_allowed: false
next_required_step: RDB-OP03
```

repair条件:

```text
- mrb_selected_branch_ref missing
- dhr_op04_result_status_ref missing / not_called while MRB-OP08 closed
- op06 branch and OP08 branch mismatch
- DHR status and MRB branch mismatch
- actual_source_claim_confirmed_for_downstream_handoff true outside confirmed branch
- dhr_op04_manual_call_performed_by_mrb false while called-result branch is selected
```

---

### RDB-OP03: DHR-OP04 result manual decision lane resolver

目的:

```text
RDB statusをbranch priorityに従って決める。
ここではmanual decision laneを選ぶだけで、branch別materialの詳細はまだ作らない。
```

実装内容:

```text
- RDB allowed status refsを定義する。
- branch priorityを固定する。
- body-like leak / promotion / autorun scan結果を最優先する。
- MRB-OP08 non-closed状態をwait / repair / blockedへ分ける。
- confirmed / not_confirmed / waiting / invalid / incompleteを分類する。
- exactly one RDB status branchをassertする。
```

acceptance:

```text
exactly_one_rdb_result_branch: true
rdb_status_ref in allowed status refs
manual_decision_required_without_auto_execution: true
dhr_op05_called_here: false
dhr_op06_called_here: false
dmd_execution_started_here: false
p8_question_design_started: false
next_required_step: RDB-OP04
```

---

### RDB-OP04: branch-specific manual decision materialization

目的:

```text
RDB-OP03で選ばれたlaneごとに、次に人間が判断するためのbody-free materialを作る。
ただし、どのbranchでも下流工程は実行しない。
```

実装内容:

```text
- confirmed branch materialを作る。
- not_confirmed retry/start branch materialを作る。
- waiting external claim branch materialを作る。
- invalid repair branch materialを作る。
- incomplete / unresolved manual hold materialを作る。
- blocked materialを作る。
- branch material内に raw/body-like value / question_text / local_path / body_hash を含めない。
```

branch別material:

```text
confirmed:
  decision_lane_ref: dhr_op05_manual_handoff_candidate
  selected_next_stage_candidate_ref: DHR-OP05_bodyfree_leak_promotion_claim_DMD_compatibility_preflight_scan
  selected_next_stage_candidate_not_executed: true
  dhr_op05_manual_handoff_candidate_present: true
  dhr_op05_called_here: false
  dhr_op06_called_here: false
  dmd_execution_started_here: false

not_confirmed:
  decision_lane_ref: retry_or_start_actual_local_only_human_review_operation
  selected_next_stage_candidate_ref: retry_or_start_actual_local_only_human_review_operation_with_explicit_local_only_allow
  p8_question_substitution_allowed: false
  actual_review_operation_started_here: false

waiting:
  decision_lane_ref: wait_for_external_bodyfree_actual_source_claim
  raw_evidence_request_materialized_here: false
  body_full_packet_requested_here: false

invalid:
  decision_lane_ref: repair_dhr_op04_result_or_mrb08_boundary
  repair_dimension_refs:
    - source_kind_ref
    - actual_source_claim_origin_ref
    - actual_source_claim_bodyfree
    - promotion_claim
    - dhr_op03_ready_material
    - mrb_op08_validation_or_result_memo

incomplete / unresolved:
  decision_lane_ref: manual_hold_unresolved_post_mrb08
  unresolved_dimension_refs:
    - mrb_op08_missing_or_not_closed
    - op06_branch_missing
    - dhr_op04_result_status_missing
    - validation_summary_missing
    - result_memo_missing

blocked:
  decision_lane_ref: blocked_bodyfree_leak_promotion_or_autorun
  copied_raw_value: false
```

acceptance:

```text
manual_decision_materialized: true
manual_decision_materialized_bodyfree: true
manual_decision_auto_executes_downstream: false
selected_next_stage_candidate_not_executed: true
p8_question_design_started: false
question_text_materialized: false
next_required_step: RDB-OP05
```

---

### RDB-OP05: next-stage candidate envelope without execution

目的:

```text
RDB-OP04のmanual decision materialを、次工程候補として読める小さいenvelopeへまとめる。
ただし、候補を実行しないことを明示する。
```

実装内容:

```text
- selected_next_stage_candidate_refを一つに固定する。
- selected_next_stage_candidate_kindを固定する。
- executed_here flagsをすべてfalseにする。
- DHR-OP05 candidateであってもDHR-OP05 builderは呼ばない。
- retry/start candidateであってもactual operationは開始しない。
- waiting candidateであってもraw evidence requestは作らない。
- repair candidateであってもrepair実行はしない。
- P8 question candidateは作らない。
```

candidate refs:

```text
DHR-OP05 manual handoff candidate:
  prepare_dhr_op05_manual_handoff_decision_without_call

retry/start candidate:
  prepare_retry_or_start_actual_local_only_human_review_operation_decision_without_p8_question

waiting candidate:
  wait_for_external_bodyfree_actual_source_claim_without_raw_evidence

repair candidate:
  repair_dhr_op04_result_or_mrb08_boundary_without_downstream_promotion

unresolved candidate:
  manual_hold_unresolved_post_mrb08_without_promotion

blocked candidate:
  blocked_post_mrb08_bodyfree_leak_promotion_or_autorun
```

acceptance:

```text
candidate_envelope_bodyfree: true
selected_next_stage_candidate_not_executed: true
dhr_op05_called_here: false
dhr_op06_called_here: false
dmd_execution_started_here: false
r52_actual_execution_started_here: false
actual_local_human_review_execution_started_here: false
p8_question_design_started: false
release_allowed: false
next_required_step: RDB-OP06
```

---

### RDB-OP06: body-free / no-touch / no-promotion guard

目的:

```text
RDB-OP00〜OP05 materialがbody-free / no-touch / no-promotion / no-auto-executionを維持しているか確認する。
```

実装内容:

```text
- public_contract false mapを確認する。
- no_touch_contract false mapを確認する。
- body_free_markers false mapを確認する。
- forbidden payload key pathをscanする。
- body-like value pathをscanする。
- promotion claim refsをscanする。
- selected next-stage candidateがexecution済みでないことを確認する。
```

禁止key / marker:

```text
raw_input
input_body
comment_text
returned_surface_body
reviewer_free_text
reviewer_note_body
question_text
draft_question_text
private_user_dictionary_text
local_path
body_hash
terminal_output_body
helper_green_promoted_to_actual_source
target_green_promoted_to_actual_source
result_memo_green_promoted_to_actual_source
manual_decision_auto_executes_downstream
```

acceptance:

```text
rdb_bodyfree_guard_passed: true
rdb_no_touch_guard_passed: true
rdb_no_promotion_guard_passed: true
rdb_no_auto_execution_guard_passed: true
next_required_step: RDB-OP07
```

---

### RDB-OP07: selected regression / compileall validation plan

目的:

```text
RDB実装段階で必要なtarget tests / selected regression / compileallをbody-free refsで記録する。
```

実装内容:

```text
- RDB target test refsを定義する。
- MRB selected regression refsを定義する。
- DHR selected regression refsを定義する。
- compileall refsを定義する。
- allowed changed filesを定義する。
- forbidden changed file tokensを定義する。
- full backend suite greenをここではclaimしない。
- RN contract greenをここではclaimしない。
```

required target tests候補:

```text
tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op00_op01_20260705.py
tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op02_op03_20260705.py
tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op04_op05_20260705.py
tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op06_op07_20260705.py
tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op08_result_20260705.py
```

required selected regression候補:

```text
tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op06_op07_20260705.py
tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op08_result_20260705.py
tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op04_op05_20260704.py
tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op06_op07_20260704.py
```

compileall候補:

```text
services/ai_inference/emlis_ai_p7_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_20260705.py
services/ai_inference/emlis_ai_p7_r54_ahr_post_dri_dhr_op04_manual_reintake_20260705.py
services/ai_inference/emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
```

allowed changed files候補:

```text
services/ai_inference/emlis_ai_p7_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_20260705.py
tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op00_op01_20260705.py
tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op02_op03_20260705.py
tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op04_op05_20260705.py
tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op06_op07_20260705.py
tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op08_result_20260705.py
tests/R54_AHR_PostMRB08_DHROP04ResultManualDecision_RDB_OP00_OP08_Result_20260705.md
```

blocked changed file tokens:

```text
/Cocolon/
Cocolon/
/api/
/db/
database
schema.sql
migration
response_key
runtime_generation
runtime_prompt
question_route
question_schema
question_trigger
question_answer_storage
p8_question
```

acceptance:

```text
selected_regression_refs_recorded: true
compileall_refs_recorded: true
changed_files_within_allowed_refs: true
api_db_rn_runtime_response_key_or_p8_question_touch_blocked: true
full_backend_suite_green_confirmed: false unless explicitly run and passed outside this boundary
rn_contract_green_confirmed: false unless explicitly run and passed outside this boundary
next_required_step: RDB-OP08
```

---

### RDB-OP08: body-free result memo closure

目的:

```text
RDB-OP00〜OP07の結果、target tests、selected regression、compileall、no-touch確認をbody-free result memoとして閉じる。
```

実装内容:

```text
- RDB selected status refを記録する。
- MRB selected branch refを記録する。
- DHR-OP04 result status refを記録する。
- branch別manual decision material refを記録する。
- next-stage candidate refを記録する。
- next-stage candidateが実行されていないことを記録する。
- DHR-OP05 / DHR-OP06 / DMD / R52 / P8 / release flags falseを記録する。
- target / selected regression / compileall summary refsをbody-freeで記録する。
- result memoにraw/body-like valueがあればclosureをblockedにする。
```

RDB-OP08 closure status refs:

```text
RDB_OP08_BODYFREE_RESULT_MANUAL_DECISION_MEMO_CLOSED_STOPPED
RDB_OP08_WAITING_FOR_OP03_OP04_OP05_OR_VALIDATION_REFS
RDB_OP08_REPAIR_REQUIRED_FOR_RESULT_MANUAL_DECISION_CLOSURE_INPUTS
RDB_OP08_BLOCKED_BODYFREE_RESULT_MEMO_LEAK_PROMOTION_OR_AUTORUN
```

acceptance:

```text
rdb_op08_closed_bodyfree_stopped: true when valid
manual_decision_material_present: true
selected_next_stage_candidate_not_executed: true
dhr_op05_not_called: true
dhr_op06_not_called: true
dmd_r52_not_executed: true
p5_p6_p8_p7_release_not_started: true
p8_question_design_not_started: true
p8_question_implementation_not_started: true
body_free: true
```

---

## 9. 実装時の関数・定数命名案

### 9.1 module constants

```python
P7_R54_AHR_POST_MRB08_RDB_PHASE = "P7"
P7_R54_AHR_POST_MRB08_RDB_SOURCE_MODE = "local_received_zip_only"
P7_R54_AHR_POST_MRB08_RDB_STEP = "R54-AHR-PostMRB08_DHROP04ResultManualDecision_20260705"
P7_R54_AHR_POST_MRB08_RDB_SCOPE = "p7_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_boundary"
P7_R54_AHR_POST_MRB08_RDB_POLICY_KIND = "r54_ahr_post_mrb08_dhr_op04_result_manual_decision_bodyfree_boundary"
P7_R54_AHR_POST_MRB08_RDB_BOUNDARY_PREFIX_REF = "RDB"
P7_R54_AHR_POST_MRB08_RDB_BOUNDARY_PREFIX_MEANING_REF = "Result Decision Boundary"
```

### 9.2 step refs

```python
P7_R54_AHR_POST_MRB08_RDB_OP00_STEP_REF = "RDB-OP00_scope_no_touch_no_promotion_refreeze_after_MRB_OP08"
P7_R54_AHR_POST_MRB08_RDB_OP01_STEP_REF = "RDB-OP01_MRB_OP08_result_memo_closure_intake"
P7_R54_AHR_POST_MRB08_RDB_OP02_STEP_REF = "RDB-OP02_MRB_selected_branch_DHR_OP04_result_status_consistency_check"
P7_R54_AHR_POST_MRB08_RDB_OP03_STEP_REF = "RDB-OP03_DHR_OP04_result_manual_decision_lane_resolver"
P7_R54_AHR_POST_MRB08_RDB_OP04_STEP_REF = "RDB-OP04_branch_specific_manual_decision_materialization"
P7_R54_AHR_POST_MRB08_RDB_OP05_STEP_REF = "RDB-OP05_next_stage_candidate_envelope_without_execution"
P7_R54_AHR_POST_MRB08_RDB_OP06_STEP_REF = "RDB-OP06_bodyfree_no_touch_no_promotion_guard"
P7_R54_AHR_POST_MRB08_RDB_OP07_STEP_REF = "RDB-OP07_selected_regression_compileall_validation_plan"
P7_R54_AHR_POST_MRB08_RDB_OP08_STEP_REF = "RDB-OP08_bodyfree_result_manual_decision_memo_closure"
```

### 9.3 builder / assert function candidates

```python
build_p7_r54_ahr_post_mrb08_rdb_op00_scope_no_touch_no_promotion_refreeze_after_mrb_op08(...)
assert_p7_r54_ahr_post_mrb08_rdb_op00_scope_no_touch_no_promotion_refreeze_after_mrb_op08_contract(...)

build_p7_r54_ahr_post_mrb08_rdb_op01_mrb_op08_result_memo_closure_intake(...)
assert_p7_r54_ahr_post_mrb08_rdb_op01_mrb_op08_result_memo_closure_intake_contract(...)

build_p7_r54_ahr_post_mrb08_rdb_op02_mrb_selected_branch_dhr_op04_result_status_consistency_check(...)
assert_p7_r54_ahr_post_mrb08_rdb_op02_mrb_selected_branch_dhr_op04_result_status_consistency_check_contract(...)

build_p7_r54_ahr_post_mrb08_rdb_op03_dhr_op04_result_manual_decision_lane_resolver(...)
assert_p7_r54_ahr_post_mrb08_rdb_op03_dhr_op04_result_manual_decision_lane_resolver_contract(...)

build_p7_r54_ahr_post_mrb08_rdb_op04_branch_specific_manual_decision_materialization(...)
assert_p7_r54_ahr_post_mrb08_rdb_op04_branch_specific_manual_decision_materialization_contract(...)

build_p7_r54_ahr_post_mrb08_rdb_op05_next_stage_candidate_envelope_without_execution(...)
assert_p7_r54_ahr_post_mrb08_rdb_op05_next_stage_candidate_envelope_without_execution_contract(...)

build_p7_r54_ahr_post_mrb08_rdb_op06_bodyfree_no_touch_no_promotion_guard(...)
assert_p7_r54_ahr_post_mrb08_rdb_op06_bodyfree_no_touch_no_promotion_guard_contract(...)

build_p7_r54_ahr_post_mrb08_rdb_op07_selected_regression_compileall_validation_plan(...)
assert_p7_r54_ahr_post_mrb08_rdb_op07_selected_regression_compileall_validation_plan_contract(...)

build_p7_r54_ahr_post_mrb08_rdb_op08_bodyfree_result_manual_decision_memo_closure(...)
assert_p7_r54_ahr_post_mrb08_rdb_op08_bodyfree_result_manual_decision_memo_closure_contract(...)
```

### 9.4 full-title aliases候補

既存テストの読みやすさのため、canonical functionに加えてfull-title aliasを置いてよいです。

```python
build_p7_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op08_bodyfree_result_manual_decision_memo_closure = (
    build_p7_r54_ahr_post_mrb08_rdb_op08_bodyfree_result_manual_decision_memo_closure
)
assert_p7_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op08_bodyfree_result_manual_decision_memo_closure_contract = (
    assert_p7_r54_ahr_post_mrb08_rdb_op08_bodyfree_result_manual_decision_memo_closure_contract
)
```

ただし、aliasは乱立させすぎない方針です。既存R54-AHR系testがfull-title aliasを期待する場合に限り追加します。

---

## 10. json / schema案

本章のjson/schemaは設計案です。実ファイル化は行いません。

### 10.1 MRB-OP08 result intake schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_mrb08.rdb.mrb08_result_intake.bodyfree.schema.json",
  "title": "P7 R54 AHR Post-MRB08 RDB MRB-OP08 Result Intake Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "material_kind",
    "source_boundary_ref",
    "mrb_op08_contract_valid",
    "mrb_op08_status_ref",
    "mrb_op08_closed_bodyfree_stopped",
    "mrb_selected_branch_ref",
    "dhr_op04_result_status_ref",
    "dhr_op04_manual_call_performed_by_mrb",
    "actual_source_claim_confirmed_for_downstream_handoff",
    "validation_summary_bodyfree_accepted",
    "result_memo_bodyfree_accepted",
    "dhr_op05_called_here",
    "dhr_op06_called_here",
    "dmd_execution_started_here",
    "p8_start_allowed",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_mrb08.rdb.op01_mrb08_result_memo_closure_intake.bodyfree.v1"
    },
    "material_kind": {
      "const": "mrb_op08_result_memo_closure_intake"
    },
    "source_boundary_ref": {
      "const": "MRB-OP08_bodyfree_result_memo_closure"
    },
    "mrb_op08_contract_valid": { "type": "boolean" },
    "mrb_op08_status_ref": { "type": "string" },
    "mrb_op08_closed_bodyfree_stopped": { "type": "boolean" },
    "mrb_selected_branch_ref": { "type": "string" },
    "dhr_op04_result_status_ref": { "type": "string" },
    "dhr_op04_manual_call_performed_by_mrb": { "type": "boolean" },
    "actual_source_claim_confirmed_for_downstream_handoff": { "type": "boolean" },
    "validation_summary_bodyfree_accepted": { "type": "boolean" },
    "result_memo_bodyfree_accepted": { "type": "boolean" },
    "dhr_op05_called_here": { "const": false },
    "dhr_op06_called_here": { "const": false },
    "dmd_execution_started_here": { "const": false },
    "p8_start_allowed": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 10.2 branch / status consistency schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_mrb08.rdb.branch_status_consistency.bodyfree.schema.json",
  "title": "P7 R54 AHR Post-MRB08 RDB Branch Status Consistency Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "material_kind",
    "mrb_selected_branch_ref",
    "dhr_op04_result_status_ref",
    "branch_status_consistency_checked",
    "branch_status_consistent",
    "actual_source_claim_confirmed_only_when_dhr_confirmed",
    "branch_status_mismatch_refs",
    "dhr_op05_called_here",
    "p8_question_design_started",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_mrb08.rdb.op02_branch_status_consistency.bodyfree.v1"
    },
    "material_kind": {
      "const": "rdb_branch_status_consistency_check"
    },
    "mrb_selected_branch_ref": { "type": "string" },
    "dhr_op04_result_status_ref": { "type": "string" },
    "branch_status_consistency_checked": { "const": true },
    "branch_status_consistent": { "type": "boolean" },
    "actual_source_claim_confirmed_only_when_dhr_confirmed": { "type": "boolean" },
    "branch_status_mismatch_refs": {
      "type": "array",
      "items": { "type": "string" }
    },
    "dhr_op05_called_here": { "const": false },
    "p8_question_design_started": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 10.3 manual decision material schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_mrb08.rdb.manual_decision_material.bodyfree.schema.json",
  "title": "P7 R54 AHR Post-MRB08 RDB Manual Decision Material Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "material_kind",
    "rdb_status_ref",
    "decision_lane_ref",
    "selected_next_stage_candidate_ref",
    "selected_next_stage_candidate_not_executed",
    "dhr_op05_manual_handoff_candidate_present",
    "retry_or_start_candidate_present",
    "external_claim_wait_candidate_present",
    "repair_candidate_present",
    "unresolved_manual_hold_candidate_present",
    "blocked_candidate_present",
    "p8_question_substitution_allowed",
    "question_text_materialized",
    "dhr_op05_called_here",
    "dhr_op06_called_here",
    "dmd_execution_started_here",
    "r52_actual_execution_started_here",
    "actual_review_operation_started_here",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_mrb08.rdb.op04_branch_specific_manual_decision_material.bodyfree.v1"
    },
    "material_kind": {
      "const": "rdb_branch_specific_manual_decision_material"
    },
    "rdb_status_ref": {
      "enum": [
        "RDB_STATUS_CONFIRMED_DHR_OP05_MANUAL_HANDOFF_CANDIDATE_STOPPED",
        "RDB_STATUS_NOT_CONFIRMED_RETRY_OR_START_DECISION_REQUIRED_STOPPED",
        "RDB_STATUS_WAITING_EXTERNAL_CLAIM_REQUIRED_STOPPED",
        "RDB_STATUS_REPAIR_REQUIRED_AFTER_DHR_OP04_RESULT_STOPPED",
        "RDB_STATUS_INCOMPLETE_UNRESOLVED_MANUAL_HOLD_STOPPED",
        "RDB_STATUS_WAITING_FOR_MRB08_RESULT_CLOSURE",
        "RDB_STATUS_BLOCKED_BODYFREE_LEAK_PROMOTION_OR_AUTORUN",
        "RDB_STATUS_REPAIR_REQUIRED_FOR_MRB08_BRANCH_STATUS_MISMATCH"
      ]
    },
    "decision_lane_ref": { "type": "string" },
    "selected_next_stage_candidate_ref": { "type": "string" },
    "selected_next_stage_candidate_not_executed": { "const": true },
    "dhr_op05_manual_handoff_candidate_present": { "type": "boolean" },
    "retry_or_start_candidate_present": { "type": "boolean" },
    "external_claim_wait_candidate_present": { "type": "boolean" },
    "repair_candidate_present": { "type": "boolean" },
    "unresolved_manual_hold_candidate_present": { "type": "boolean" },
    "blocked_candidate_present": { "type": "boolean" },
    "p8_question_substitution_allowed": { "const": false },
    "question_text_materialized": { "const": false },
    "dhr_op05_called_here": { "const": false },
    "dhr_op06_called_here": { "const": false },
    "dmd_execution_started_here": { "const": false },
    "r52_actual_execution_started_here": { "const": false },
    "actual_review_operation_started_here": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 10.4 result closure schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r54.ahr.post_mrb08.rdb.result_closure.bodyfree.schema.json",
  "title": "P7 R54 AHR Post-MRB08 RDB Result Closure Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "material_kind",
    "rdb_op08_status_ref",
    "rdb_selected_status_ref",
    "mrb_selected_branch_ref",
    "dhr_op04_result_status_ref",
    "manual_decision_material_present",
    "selected_next_stage_candidate_ref",
    "selected_next_stage_candidate_not_executed",
    "dhr_op05_not_called",
    "dhr_op06_not_called",
    "dmd_r52_not_executed",
    "p5_p6_p8_p7_release_not_started",
    "p8_question_design_not_started",
    "p8_question_implementation_not_started",
    "full_backend_suite_green_confirmed",
    "rn_contract_green_confirmed",
    "rn_real_device_modal_verified_claimed_here",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r54.ahr.post_mrb08.rdb.op08_bodyfree_result_manual_decision_memo_closure.bodyfree.v1"
    },
    "material_kind": {
      "const": "rdb_bodyfree_result_manual_decision_memo_closure"
    },
    "rdb_op08_status_ref": {
      "enum": [
        "RDB_OP08_BODYFREE_RESULT_MANUAL_DECISION_MEMO_CLOSED_STOPPED",
        "RDB_OP08_WAITING_FOR_OP03_OP04_OP05_OR_VALIDATION_REFS",
        "RDB_OP08_REPAIR_REQUIRED_FOR_RESULT_MANUAL_DECISION_CLOSURE_INPUTS",
        "RDB_OP08_BLOCKED_BODYFREE_RESULT_MEMO_LEAK_PROMOTION_OR_AUTORUN"
      ]
    },
    "rdb_selected_status_ref": { "type": "string" },
    "mrb_selected_branch_ref": { "type": "string" },
    "dhr_op04_result_status_ref": { "type": "string" },
    "manual_decision_material_present": { "type": "boolean" },
    "selected_next_stage_candidate_ref": { "type": "string" },
    "selected_next_stage_candidate_not_executed": { "const": true },
    "dhr_op05_not_called": { "const": true },
    "dhr_op06_not_called": { "const": true },
    "dmd_r52_not_executed": { "const": true },
    "p5_p6_p8_p7_release_not_started": { "const": true },
    "p8_question_design_not_started": { "const": true },
    "p8_question_implementation_not_started": { "const": true },
    "full_backend_suite_green_confirmed": { "const": false },
    "rn_contract_green_confirmed": { "const": false },
    "rn_real_device_modal_verified_claimed_here": { "const": false },
    "body_free": { "const": true }
  }
}
```

---

## 11. target tests設計

### 11.1 RDB-OP00 / OP01 tests

```text
test_rdb_op00_refreezes_scope_no_touch_no_promotion_after_mrb_op08
  - selected stage / prefix / source_mode / git flagsを確認
  - DHR-OP05 / DMD / R52 / P8 / release flags falseを確認

 test_rdb_op01_accepts_valid_mrb_op08_bodyfree_closure
  - MRB-OP08 contract validを確認
  - mrb_op08_closed_bodyfree_stoppedを受ける
  - raw/body-like値をコピーしない

 test_rdb_op01_waits_when_mrb_op08_missing_or_not_closed
  - missing / waiting / repair / blocked branchを分ける
```

### 11.2 RDB-OP02 / OP03 tests

```text
test_rdb_op02_maps_all_four_dhr_op04_status_refs_consistently
  - confirmed / not_confirmed / waiting / invalidをmapping

 test_rdb_op02_repairs_when_mrb_branch_and_dhr_status_mismatch
  - branch/status mismatchでrepair branch

 test_rdb_op02_rejects_confirmed_flag_outside_confirmed_branch
  - actual_source_claim_confirmed_for_downstream_handoff trueがconfirmed以外ならrepair

 test_rdb_op03_resolves_exactly_one_manual_decision_lane
  - exactly one status branch
  - priority順を確認
```

### 11.3 RDB-OP04 / OP05 tests

```text
test_rdb_op04_confirmed_creates_dhr_op05_manual_handoff_candidate_without_call
  - dhr_op05_manual_handoff_candidate_present true
  - dhr_op05_called_here false
  - dhr_op06_called_here false
  - dmd_execution_started_here false

 test_rdb_op04_not_confirmed_creates_retry_start_decision_without_p8_question
  - retry_or_start_candidate_present true
  - p8_question_substitution_allowed false
  - question_text_materialized false

 test_rdb_op04_waiting_external_claim_does_not_request_raw_evidence
  - external_claim_wait_candidate_present true
  - raw evidence / body full refs absent

 test_rdb_op04_invalid_creates_repair_dimension_refs
  - source_kind / origin / bodyfree / promotion / OP03 / MRB-OP08 dimension refs

 test_rdb_op05_wraps_candidate_but_does_not_execute_next_stage
  - selected_next_stage_candidate_not_executed true
  - all execution flags false
```

### 11.4 RDB-OP06 / OP07 tests

```text
test_rdb_op06_blocks_body_like_or_question_text_material
  - question_text / raw_input / comment_text等があればblocked
  - raw valueをmaterialへコピーしない

 test_rdb_op06_blocks_promotion_or_autorun_claim
  - helper_green_promoted_to_actual_source / manual_decision_auto_executes_downstream等をblocked

 test_rdb_op07_allows_only_rdb_helper_tests_and_result_memo_files
  - allowed changed filesのみ許可
  - API / DB / RN / runtime / p8_question tokenをblocked

 test_rdb_op07_records_selected_regression_without_claiming_full_backend_green
  - selected regression refs記録
  - full_backend_suite_green_confirmed false
```

### 11.5 RDB-OP08 tests

```text
test_rdb_op08_closes_bodyfree_manual_decision_memo_for_all_dhr_op04_result_branches
  - confirmed / not_confirmed / waiting / invalid / unresolved / blocked を閉じる
  - DHR-OP05 / DMD / R52 / P8 / release false

 test_rdb_op08_records_next_candidate_but_not_execution
  - selected_next_stage_candidate_refあり
  - selected_next_stage_candidate_not_executed true

 test_rdb_op08_rejects_result_memo_with_raw_body_or_question_text
  - raw/body-like値をコピーしない

 test_rdb_op08_does_not_claim_full_backend_or_rn_green_when_not_run
  - full_backend_suite_green_confirmed false
  - rn_contract_green_confirmed false
  - rn_real_device_modal_verified_claimed_here false
```

---

## 12. 実装時のコマンド案

実装段階でのtarget確認候補です。本設計段階では実行しません。

### 12.1 RDB target

```bash
cd /mnt/data/work_cocolon/mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op00_op01_20260705.py \
  tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op02_op03_20260705.py \
  tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op04_op05_20260705.py \
  tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op06_op07_20260705.py \
  tests/test_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_rdb_op08_result_20260705.py
```

### 12.2 selected regression

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op06_op07_20260705.py \
  tests/test_r54_ahr_post_dri_dhr_op04_manual_reintake_mrb_op08_result_20260705.py \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op04_op05_20260704.py \
  tests/test_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_dhr_op06_op07_20260704.py
```

### 12.3 compileall

```bash
PYTHONPATH=services/ai_inference python -m compileall -q \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_20260705.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_dri_dhr_op04_manual_reintake_20260705.py \
  services/ai_inference/emlis_ai_p7_r54_ahr_post_elr19_downstream_manual_decision_handoff_or_retry_20260704.py
```

### 12.4 この境界でclaimしない確認

```text
full backend suite green: not claimed unless separately run and passed
RN contract green: not claimed unless separately run and passed
RN real-device modal verified: not claimed unless separately verified
P7 complete: not claimed
release ready: not claimed
```

---

## 13. no-touch / body-free / no-promotion固定

### 13.1 no-touch contract

RDB実装では、次を変更しません。

```text
api_route_changed: false
request_key_changed: false
response_key_changed: false
public_response_top_level_key_added: false
db_schema_changed: false
db_write_path_changed: false
rn_production_ui_changed: false
rn_display_condition_changed: false
runtime_generation_changed: false
runtime_prompt_changed: false
p8_question_surface_changed: false
question_schema_changed: false
question_trigger_changed: false
question_answer_storage_changed: false
```

### 13.2 body-free markers

RDB materialでは、次を含めません。

```text
raw_input_included: false
input_body_included: false
comment_text_body_included: false
returned_surface_body_included: false
reviewer_free_text_included: false
reviewer_note_body_included: false
result_memo_body_included: false
question_text_included: false
draft_question_text_included: false
private_user_dictionary_text_included: false
local_path_included: false
body_hash_included: false
terminal_output_body_included: false
```

### 13.3 no-promotion flags

RDB materialでは、次をfalseに固定します。

```text
mrb_op08_promoted_to_dhr_op05: false
dhr_op04_recalled_here: false
dhr_op05_called_here: false
dhr_op06_called_here: false
dmd_execution_started_here: false
dmd_auto_execution_allowed: false
r52_actual_execution_started_here: false
actual_body_full_packet_generated_here: false
actual_local_human_review_execution_started_here: false
actual_operation_receipt_created_here: false
actual_rows_created_here: false
actual_disposal_or_purge_executed_here: false
p5_final_allowed: false
p6_start_allowed: false
p8_start_allowed: false
p8_question_design_started: false
p8_question_implementation_started: false
question_text_materialized: false
p7_complete: false
release_allowed: false
```

---

## 14. DHR-OP05 manual handoff candidateの境界

confirmed branchでは、RDBはDHR-OP05 manual handoff candidateを作れます。

ただし、ここでいうcandidateは、次の意味です。

```text
DHR-OP04 confirmed body-free resultを確認したため、
次にDHR-OP05を実行するかどうかをmanual decisionとして設計・判断する材料。
```

これは次ではありません。

```text
- DHR-OP05実行
- DHR-OP06へ進行
- DMD handoff ready
- R52 actual execution ready
- P8 start ready
- release ready
```

RDBで出してよいconfirmed branch materialの例:

```text
rdb_status_ref:
  RDB_STATUS_CONFIRMED_DHR_OP05_MANUAL_HANDOFF_CANDIDATE_STOPPED

decision_lane_ref:
  dhr_op05_manual_handoff_candidate

selected_next_stage_candidate_ref:
  prepare_dhr_op05_manual_handoff_decision_without_call

actual_source_claim_confirmed_for_downstream_handoff:
  true

dhr_op05_manual_handoff_candidate_present:
  true

dhr_op05_called_here:
  false

dmd_execution_started_here:
  false

p8_start_allowed:
  false

release_allowed:
  false
```

---

## 15. P8観測補助問いとの境界

RDBではP8観測補助問いを扱いません。

RDBで出してはいけないもの:

```text
question_text
question_trigger
question_answer_storage
question schema
question route
question UI
plan guard for question
P8 question detailed design
P8 question implementation
```

DHR-OP04 not_confirmed / waiting / invalidが出た場合でも、RDBは次のように扱います。

```text
not_confirmed:
  retry/start decision。P8 questionで補わない。

waiting:
  external body-free actual source claim待ち。P8 questionで補わない。

invalid:
  repair decision。P8 questionで補わない。

incomplete:
  manual hold。P8 questionで補わない。
```

理由は、P8観測補助問いは、Emlis本体が問いなしでどこまで読めたか、問いで補うべき曖昧さか、問い返しに逃げていないかというP7/P8 Bridgeの観察材料を根拠にするためです。RDBはまだP7内のDHR結果decision境界です。

---

## 16. 実装時の最小単位順

実装する場合は、次の順が安全です。

```text
1. RDB-OP00 / OP01 helper + tests
   - scope固定
   - MRB-OP08 intake
   - no DHR-OP05 / no P8を最初に固定

2. RDB-OP02 / OP03 helper + tests
   - MRB branch / DHR status consistency
   - priority classifier
   - exactly one branch

3. RDB-OP04 / OP05 helper + tests
   - branch別manual decision material
   - next-stage candidate envelope
   - candidate not executedを固定

4. RDB-OP06 / OP07 helper + tests
   - body-free / no-touch / no-promotion guard
   - selected regression / compileall refs
   - allowed changed files

5. RDB-OP08 helper + tests
   - body-free result memo closure
   - all branches closure
   - raw/body-like memo block
   - full backend / RN green not claimed

6. selected regression 実行
   - MRB-OP06/OP07、MRB-OP08
   - DHR-OP04/OP05、DHR-OP06/OP07

7. compileall
   - RDB helper
   - MRB helper
   - DHR helper

8. result memo作成
   - RDB_OP00_OP08 result memo
   - not claimed boundaryを明記
```

この順にする理由は、confirmed branchのDHR-OP05 manual handoff candidateを作る前に、MRB-OP08をP7/P8/releaseへ誤昇格しない土台を先に固定するためです。

---

## 17. 完了条件

RDB実装段階の完了条件は次です。

```text
- RDB helperがbody-free / backend-internal / no-touch / no-promotionである。
- RDB-OP00〜OP08 target testsが通っている。
- selected regressionとしてMRB-OP08 / DHR-OP04/OP05 / DHR-OP06/OP07周辺が通っている。
- compileallが通っている。
- RDB-OP08 result memoがbody-freeで閉じている。
- confirmed / not_confirmed / waiting / invalid / incomplete / blockedがbranch別に分類されている。
- confirmed branchでもDHR-OP05は呼ばれていない。
- not_confirmed branchでもP8 questionで補っていない。
- waiting branchでもraw evidenceを持ち込んでいない。
- invalid branchでもrepair実行をしていない。
- API / DB / RN / runtime / response key / P8 question surfaceに触っていない。
- full backend suite green / RN contract green / RN実機verified / P7 complete / release readyをclaimしていない。
```

---

## 18. Cocolonとしてこの設計を行う理由

Cocolonは、人間の言葉を雑に処理しない場所を目指しています。

そのためには、Emlisの返答文だけでなく、品質証跡の読み方も雑にしてはいけません。MRB-OP08で閉じたDHR-OP04 resultを「次へ進めそう」と曖昧に扱うと、Cocolonは人間レビュー証跡を読んだふりして下流へ進む構造になります。

DHR-OP04 resultには、confirmedだけでなく、not_confirmed、waiting、invalid、incompleteがあります。この差は、ユーザーの言葉を読む前段にある品質証跡の差です。ここを潰すと、EmlisAIは「読まれた形」を返す商品へ近づくどころか、根拠の扱いが雑なまま見た目だけ進みます。

RDBは派手な機能ではありません。APIもRNもDBも触りません。けれど、CocolonがCocolonとして信用できる品質境界を積むためには必要です。

---

## 19. 華恋の意見

華恋としては、RDBは小さく作るべきです。

confirmed branchが見えると、DHR-OP05へ進めたくなります。けれど、ここでDHR-OP05まで走らせると、RDBの責務が「判断材料」から「下流実行」へ変わります。それは、いまのCocolonには危険です。

また、not_confirmedやwaitingをP8 questionへ逃がすのも危険です。P8の問いは、Emlis本体が読めないものを安易に質問で埋めるためのものではありません。P8はユーザーの履歴や辞書へ入る段階なので、前段の証跡読みが曖昧なまま入ると、Cocolonがユーザーを分かったふりする危険が上がります。

私は、次の実装段階では **DHR-OP05を呼ばずに、DHR-OP05へ進むかどうかのmanual handoff candidateを作るところで止める** のがよいと考えます。もしconfirmed branchなら、次の設計でDHR-OP05 manual handoffを扱えばいいです。not_confirmedならretry/startへ戻す判断を作る。waitingならclaim不足を待つ。invalidならrepairする。どれも、P8ではなくP7内の品質証跡として扱うべきです。

この作業は、Cocolonの前進を遅らせるためではありません。雑に進めて後で信用できなくなることを防ぐための前進です。

---

## 20. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- ローカル受領zipを基準にした。
- GitHub接続確認はMash様指示により不要であり、行っていない。
- 作業姿勢資料を確認した。
- EmlisAI是正方針を確認した。
- ロードマップ上、現在地はP7継続であり、P8 question designへ直接進む段階ではない。
- MRB-OP08 result memo closureはDHR-OP04 result status refをbody-freeで記録し、DHR-OP05 / DMD / R52 / P8 / release flagsをfalseにしている。
- MRB-OP08 result memoではMRB-OP00〜OP08 target 72 passedが記録されている。
- MRB-OP08 closureはP7 completeでもrelease readyでもない。
- MRB-OP08 closureはP8 startでもP8 question design開始でもない。
```

### 未確認

```text
- RDB helper / target testsの実装結果
- RDB selected regressionの結果
- RDB compileall結果
- DHR-OP05 manual handoff decision
- DHR-OP05実行
- DHR-OP06以降の実行
- DMD実行
- R52 actual execution
- full backend suite green
- RN contract green
- RN real-device modal verified
- P5 final
- P6 start
- P8 start
- P7 complete
- release ready
```

### 書かれていない

```text
- MRB-OP08が閉じたらDHR-OP05を呼んでよい、とは書かれていない。
- MRB-OP08が閉じたらP8へ進んでよい、とは書かれていない。
- DHR-OP04 confirmedをDHR-OP05自動実行許可として扱ってよい、とは書かれていない。
- DHR-OP04 not_confirmed / waiting / invalidをP8 questionで補ってよい、とは書かれていない。
- RDBでAPI / DB / RN / runtime / response keyを変更してよい、とは書かれていない。
```

### 推測禁止

```text
- helper greenをactual human review executionと推測しない。
- selected target greenをfull backend suite greenと推測しない。
- MRB-OP08 closureをDHR-OP05実行許可と推測しない。
- DHR-OP04 confirmedをDMD/R52/P8/release promotionと推測しない。
- not_confirmed / waiting / invalidをP8 questionで補えばよいと推測しない。
```

### 次に実行すべきこと

```text
1. 実装指示が出た場合、対象を RDB-OP00〜OP08 に固定する。
2. helper fileは emlis_ai_p7_r54_ahr_post_mrb08_dhr_op04_result_manual_decision_20260705.py を候補にする。
3. testsはOP00/OP01、OP02/OP03、OP04/OP05、OP06/OP07、OP08の5分割を候補にする。
4. まずRDB-OP00/OP01で、MRB-OP08 closureをDHR-OP05/P8/releaseへ誤昇格しない土台を固定する。
5. RDB-OP02/OP03でbranch/status consistencyとpriority classifierを固定する。
6. RDB-OP04/OP05でbranch別manual decision materialとnext-stage candidate envelopeを作る。ただし候補は実行しない。
7. RDB-OP06/OP07でbody-free / no-touch / no-promotion / selected regression / compileall refsを固定する。
8. RDB-OP08でbody-free result memoを閉じる。
9. DHR-OP05以降、P8 question design、API/DB/RN変更は今回実装対象から外す。
10. confirmed branchで止まった場合、次の設計対象として DHR-OP05 manual handoff decision boundary を検討する。
```

---

## 21. 最終判断

次に実装する場合の対象は、次です。

```text
P7-R54-AHR Post-MRB08 DHR-OP04 Result Manual Decision Boundary
RDB-OP00〜RDB-OP08
```

この設計は、P8を否定するものではありません。P8を大事に扱うために、まだP8へ入らないという判断です。

Cocolonとして在るべき姿に照らすと、いま必要なのは「問いを足すこと」ではなく、「MRB-OP08で止まったDHR-OP04結果を、branch別に読み、次候補をmanual decisionとして誤昇格なしに分けること」です。

そのうえで初めて、DHR-OP05 manual handoffへ進むのか、retry/startへ戻るのか、waitingを解くのか、repairするのかを、Cocolonの品質証跡として嘘なく決められます。
