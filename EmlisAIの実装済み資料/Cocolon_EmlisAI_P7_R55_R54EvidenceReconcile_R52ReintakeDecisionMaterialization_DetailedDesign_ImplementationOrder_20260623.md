# Cocolon / EmlisAI P7-R55 R54 Evidence Reconcile / Current Received Snapshot Refreeze / R52 Re-intake Decision Materialization 詳細設計書・実装順

作成日: 2026-06-23 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書 / 実装順 / body-free schema案内包  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / R54 body-free result handoff / R52 re-intake decision / P5 Human Blind QA / P7-P8 Bridge question need observation  
基準検討メモ: `Cocolon_EmlisAI_P7_R55Candidate_R54EvidenceReconcile_R52ReintakeDecision_PreDesignMemo_20260623.md`  
実装扱い: 本資料は設計書。コード変更、json実ファイル作成、schema実ファイル作成、patch作成、実装zip作成は行わない。  
json / schema実ファイル化: なし。本文内の案のみ。実ファイル化は実装段階で現物コード・既存helper・既存test配置を見て判断する。  
GitHub接続確認: Mash指定により不要。未実施。  

---

## 0. この設計書の結論

今回設計するR55は、P8観測補助問いの詳細設計ではありません。  
R55は、R54で作られたbody-free result handoffを、今回受領したcurrent snapshot上の事実へ戻し、R52 re-intakeへ渡す判断材料を整理する工程です。

正式候補名は次で固定します。

```text
P7-R55:
R54 Evidence Reconcile
+ Current Received Snapshot Refreeze
+ R52 Re-intake Decision Materialization
```

今回のR55で最も重要な判断は次です。

```text
R54 helper / R54 target split green は、P5 actual human Blind QA実レビュー完了ではない。
R54 default handoffは actual review evidence missing で止まっている。
今回受領snapshot refsはR54 helper内部refsより進んでいる。
そのため、P8へ進まず、R52 re-intake判断材料として
R55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIRED をmaterializeする。
```

R55の現状想定decisionは次です。

```text
r55_decision_ref:
  R55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIRED

r52_existing_decision_equivalent:
  R52_RETURN_TO_R51_ACTUAL_REVIEW_REQUIRED

meaning:
  actual human Blind QA実レビュー evidence が不足しているため、
  P6 limited human readfeel / P8 question design / release へは進めず、
  R54 actual local-only human review operationへ戻す。
```

R52既存enumにはR54名のreturn先がないため、R55ではR52本体のdecision enumを初期実装で変更しません。  
R55-owned decisionとして `R55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIRED` を持ち、R52既存decisionとの対応を `r52_existing_decision_equivalent` としてbody-freeに残します。

R55で絶対にtrue化しないもの:

```text
p5_human_blind_qa_confirmed = false
p5_human_blind_qa_confirmed_final = false
p6_limited_human_readfeel_start_allowed = false
p8_start_allowed = false
p7_complete = false
release_allowed = false
question_implementation_started_here = false
api_db_rn_response_key_changed_here = false
runtime_changed_here = false
```

R55で絶対に作らないもの:

```text
body-full packet
reviewer rating actual rows
question need observation actual rows
reviewer notes
question text / draft question text
P8 question trigger logic
API route
DB schema / migration
RN UI / RN表示条件
public response top-level key
Emlis runtime本文差分
User Label Connection runtime差分
Gate threshold差分
```

---

## 1. なぜこの作業を行うのか

Cocolonの価値は、ユーザーが残した言葉・感情・カテゴリ・行動・時点・過去記録が、入力直後に「読まれた形」として返ることです。  
P5 User Label Connectionは、その価値の中核です。

ただし、P5履歴線は強い機能です。  
人間の読感で確認しないまま進めると、次の事故が起きます。

```text
- 履歴で見られすぎて怖い。
- 「あなたはいつも」「原因は」「性格です」に寄る。
- 低情報入力を履歴で深読みする。
- 現在入力を履歴で上書きする。
- P5の弱さをP8の問いで補ってしまう。
- 「記録が線として返る体験」ではなく「質問される体験」が前に出る。
```

R52 / R53 / R54で、actual local-only human reviewをbody-freeに扱う器は整っています。  
しかし、器があることと、実際にP5履歴線を人間が読んで評価したことは違います。

R55の役割は、この混同を止めることです。

```text
R52 target green = P6/P8開始許可、ではない。
R53 split green = actual human review完了、ではない。
R54 split green = P5 confirmed final、ではない。
R54 helper default chain = review not started / evidence missing。
P7/P8 Bridgeの観察メモ器 = P8詳細設計材料が揃った、ではない。
```

華恋の判断として、R55は「進めるための工程」ではなく、**進めてはいけないものを正しく止めるための工程**です。  
Cocolonを、人間の言葉を雑に処理しない場所にするためには、ここでP5履歴線の未確認を未確認として固定する必要があります。

---

## 2. 参照・確認範囲

### 2.1 今回受領したローカル資料

```text
/mnt/data/Cocolon_前提資料(248).zip
/mnt/data/EmlisAIの実装済み資料(77).zip
/mnt/data/Cocolon(250).zip
/mnt/data/mashos-api(163).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(9).md
/mnt/data/Cocolon_EmlisAI_P7_R55Candidate_R54EvidenceReconcile_R52ReintakeDecision_PreDesignMemo_20260623.md
```

zip内のfile count確認:

```text
Cocolon_前提資料(248).zip: 71 files
EmlisAIの実装済み資料(77).zip: 27 files
Cocolon(250).zip: 217 files
mashos-api(163).zip: 1149 files
```

### 2.2 作業姿勢として確認した前提資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/10_cocolon_joint_development_karen_thought_boundary_2026_05_24.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
```

確認した作業姿勢上の要点:

```text
- 前提資料・実ファイル・ログを確認せずに断定しない。
- 設計と実装を混同しない。
- EmlisAIをGateに通ったものだけ表示する許可装置として扱わない。
- pytest green / fixture green / RN contract greenだけを商品成果と呼ばない。
- case専用mode / cue / surface / fixed commentTextを増やして解決しない。
- Cocolonの主体はMashの思想と構想。華恋の思想は補助思想として扱う。
- Cocolonを「人間の言葉を雑に処理しない場所」にする。
```

### 2.3 ロードマップ確認

確認したロードマップ:

```text
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(9).md
```

ロードマップ上、P7は次です。

```text
Product Quality Runner / Long-run Product Gate:
  EmlisAIの商品品質を、単発fixture greenではなく、継続測定できる形にする。
```

P7/P8 Bridgeでは、観測補助問いをP7途中で実装しません。  
P7では、P5 human Blind QA、P6 limited human readfeel、実機modal確認の中で、body-freeの「問い必要性観察メモ」を残すだけです。

P8開始時に決める対象は、観測補助問いの発生判定ロジック、API / DB / RN UI / response contract影響、問い回答と元入力の紐づけ、User Label Connection / Derived User Modelとの接続、plan guard、test計画などです。

現時点では、P8開始の根拠になる実caseの観察メモが不足しています。  
したがってR55では、P8詳細設計を行いません。

### 2.4 参照した実装済み資料

```text
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R52_R51HandoffEvidenceDecisionGate_DetailedDesign_ImplementationOrder_20260621.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R53_R51ActualLocalReviewExecutionEvidenceMaterialization_DetailedDesign_ImplementationOrder_20260621.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R54_P5HumanBlindQAActualLocalReviewExecution_BodyFreeResultHandoff_DetailedDesign_ImplementationOrder_20260622.md
```

参照した意味:

```text
R52:
  R51 handoff evidenceを見てP6/P8へ自動昇格しないdecision gate。

R53:
  R52後にP8へ進まず、R51 actual local-only human reviewへ戻るためのbody-free materialization層。

R54:
  P5 actual local-only human review resultをbody-freeでR52へ戻すためのhandoff層。
```

### 2.5 参照した現行実ファイル

backend:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff.py
```

tests:

```text
mashos-api/ai/tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_*.py
mashos-api/ai/tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_*.py
mashos-api/ai/tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_*.py
Cocolon/tests/rn-screen-contracts.test.js
```

---

## 3. 現在地の固定

### 3.1 今回受領snapshot refs

R55では、今回受領した資料をcurrent received snapshotとしてbody-freeに固定します。

```json
{
  "premise_zip_ref": "Cocolon_前提資料(248).zip",
  "implemented_materials_zip_ref": "EmlisAIの実装済み資料(77).zip",
  "rn_zip_ref": "Cocolon(250).zip",
  "backend_zip_ref": "mashos-api(163).zip",
  "roadmap_ref": "Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(9).md",
  "pre_design_memo_ref": "Cocolon_EmlisAI_P7_R55Candidate_R54EvidenceReconcile_R52ReintakeDecision_PreDesignMemo_20260623.md",
  "detailed_design_ref": "Cocolon_EmlisAI_P7_R55_R54EvidenceReconcile_R52ReintakeDecisionMaterialization_DetailedDesign_ImplementationOrder_20260623.md"
}
```

### 3.2 R52 / R53 / R54 helper内部refs

現行helperで確認したsource refsは次です。

```text
R52 helper current refs:
  Cocolon_前提資料(243)
  EmlisAIの実装済み資料(74)
  Cocolon(247)
  mashos-api(160)
  roadmap(4)

R53 helper current refs:
  Cocolon_前提資料(245)
  EmlisAIの実装済み資料(75)
  Cocolon(248)
  mashos-api(161)
  roadmap(6)

R54 helper current refs:
  Cocolon_前提資料(246)
  EmlisAIの実装済み資料(76)
  Cocolon(249)
  mashos-api(162)
  roadmap(8)
```

R55では、これらを次のように扱います。

```text
- R52 / R53 / R54 helper内部refsは historical / regression context。
- 今回受領refs 248/77/250/163/roadmap(9) を current work basis として凍結する。
- R54 helper内部refsを actual review basis として直接採用しない。
- 旧refsと今回refsの差分を、body-free source delta row として残す。
- 旧helperを即rename / 即書き換えしない。
```

### 3.3 ローカル検証結果の扱い

検討メモから引き継ぐ検証結果は次です。  
R55設計書内では、これを「今回の設計前確認済み材料」として扱い、R55実装時には再実行または差分明記が必要です。

```text
RN contract:
  36 passed
  ただし実機modal読感確認ではない。

R52 target:
  219 passed
  ただしP6/P8開始許可ではない。

R53 target:
  split executionで合計291 passed相当
  ただしone-shot green / full backend suite greenではない。

R54 target:
  helper py_compile passed
  collect-only 309 tests collected
  split executionで合計309 passed
  ただしone-shot green / full backend suite greenではない。
```

R55では、claim levelを次のように固定します。

| claim level | 意味 | green扱い可否 |
|---|---|---:|
| `PASSED_SPLIT_TARGET` | 対象testを分割で通過 | 対象契約の局所確認として可 |
| `PASSED_TARGET` | 対象testを一括で通過 | 対象契約の局所確認として可 |
| `COLLECT_ONLY` | collect-onlyのみ | 実行green不可 |
| `TIMEOUT_ONE_SHOT` | 一括実行timeout | green不可 |
| `NOT_RUN` | 未実行 | green不可 |
| `UNCONFIRMED` | 証拠不足 | green不可 |

### 3.4 R54 default handoffの現在地

現行R54 helperをdefaultでたどると、actual review evidenceが未成立のまま止まります。  
設計上、R55は次を固定して扱います。

```text
review_operation_state_ref:
  not_started

p5_decision_candidate_ref:
  P5_NOT_REVIEWED

actual_review_evidence_complete:
  false

r52_reintake_handoff_status:
  R54_R52_REINTAKE_BLOCKED_BY_ACTUAL_REVIEW_EVIDENCE_MISSING

validation_documentation_status:
  VALIDATION_DOCUMENTATION_BLOCKED_BY_R54_22_R52_REINTAKE_HANDOFF

p6_limited_human_readfeel_start_allowed:
  false

p8_start_allowed:
  false

release_allowed:
  false

p7_complete:
  false
```

この状態は「R54実装が壊れている」ではありません。  
R54の器は存在していますが、actual human reviewが未実行なので、R52 re-intake readyにはならないという正しい停止状態です。

---

## 4. R55の対象 / 非対象

### 4.1 R55で扱う対象

```text
- current received snapshot refsの再凍結。
- R52 / R53 / R54 helper内部refsと今回受領refsの差分分類。
- R52 / R53 / R54 / RN検証結果のclaim level分類。
- R54 default R52 re-intake handoffのbody-free intake。
- actual review evidence missingのgap assessment。
- R52 re-intakeに渡すdecision materialization。
- P5 / P6 / P8 / releaseの誤昇格防止。
- no body leak / no question text / no-touch境界確認。
- R55後のnext required step固定。
```

### 4.2 R55で扱わない対象

```text
- P8観測補助問いの詳細設計。
- P8 question text / draft question text。
- question trigger logic。
- question answer保存schema。
- API route / DB schema / RN UI。
- public response top-level key。
- Emlis runtime本文生成差分。
- User Label Connection runtime差分。
- Gate threshold変更。
- actual body-full packet生成。
- actual human review実行。
- reviewer notes生成。
- purge実行。
- full backend suite green主張。
- 実機modal読感完了主張。
```

### 4.3 R55の成果物分類

R55では、設計・実装・運用を混同しません。

```text
R55 detailed design completion:
  本mdが作成され、実装順 / schema案 / no-touch境界が固定される。

R55 implementation completion:
  R55 helper / tests / body-free contract / validation command matrixが実装される。
  ただしactual human review完了ではない。

R55 operation completion:
  current snapshot基準でR54 evidence gapとR52 re-intake decision materialがbody-freeで生成される。
  現状では R55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIRED になる想定。
```

---

## 5. R55の基本構造

### 5.1 R55で扱う八層

```text
Layer 1: Current snapshot refreeze
  今回受領refs 248/77/250/163/roadmap(9)をbody-freeに固定する。

Layer 2: Prior helper source reconcile
  R52/R53/R54 helper内部refsとの差分をhistorical / regression / current basisに分ける。

Layer 3: Validation evidence reconcile
  RN/R52/R53/R54の検証結果をclaim levelつきで整理する。
  split green / one-shot timeout / collect-only / not runを混同しない。

Layer 4: R54 handoff intake
  R54 default R52 re-intake handoffをbody-freeで受ける。
  raw input / comment_text / question text / local path / hashは受けない。

Layer 5: Actual review evidence gap assessment
  P5 actual human Blind QA実レビュー証拠が成立しているかを判定する。
  現状はmissing。

Layer 6: R52 re-intake decision materialization
  R55-owned decisionとR52既存decision equivalentを分けて作る。

Layer 7: P5 / P6 / P8 / release separation
  P5 candidate / P5 final / P6 start / P8 start / releaseを混同しない。

Layer 8: Final no-touch validation and documentation output
  R55がAPI/DB/RN/runtime/public key/question実装を触っていないことをbody-freeに固定する。
```

### 5.2 R55 decision優先順位

複数問題が同時にある場合、R55は次の優先順位でdecisionします。

```text
1. R55_BLOCKED_BY_BODY_FREE_BOUNDARY_RISK
   - raw input / returned surface / comment_text / history body / reviewer free text / question text / local path / body hash / terminal outputが混入。

2. R55_BLOCKED_BY_NO_TOUCH_VIOLATION
   - API / DB / RN / public response key / runtime / question implementation / Gate thresholdが変更された形跡がある。

3. R55_BLOCKED_BY_CURRENT_SNAPSHOT_UNCLASSIFIED
   - 今回受領refsとhelper refsの差分がbody-freeに分類できない。

4. R55_BLOCKED_BY_VALIDATION_EVIDENCE_INCOMPLETE
   - R52/R53/R54/RNの検証結果分類が不足し、R54 handoffを評価できない。

5. R55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIRED
   - R54 handoffが actual review evidence missing。
   - 現状の想定decision。

6. R55_BLOCKED_BY_DISPOSAL_SAFETY
   - actual reviewはあるが、purge / disposal safetyが未成立。

7. R55_R52_RETURN_TO_P5_REPAIR_REQUIRED
   - actual review evidenceはあるが、P5履歴線読感がrepair required。
   - P8質問へ逃がさずP5 repairへ戻す。

8. R55_R52_INCONCLUSIVE
   - evidenceや判断が中途半端で、P5 confirmedにもrepairにも振り切れない。

9. R55_R52_P5_CONFIRMED_CANDIDATE_ONLY
   - P5 confirmed candidateとして扱える。
   - ただしP5 confirmed final / P6 start / P8 start / releaseへは自動昇格しない。
```

現時点では、5番の `R55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIRED` が想定結果です。

### 5.3 R55でbody-freeに残してよいもの

```text
- schema_version
- material_id
- review_session_id
- source refs / source delta refs
- step / scope / policy_kind
- test group refs
- test claim level refs
- passed count / collected count / warning count
- timeout / collect-only / not-run status refs
- handoff status refs
- decision refs
- missing evidence refs
- blocker refs
- boolean flags
- counts
- enum-only question need observation class counts
- next required step refs
```

### 5.4 R55でbody-freeに残してはいけないもの

```text
- raw input
- returned surface body
- comment_text body
- history body
- reviewer free text
- reviewer notes body
- body-full packet body
- question text
- draft question text
- answer text
- local absolute path
- body content hash
- packet content hash
- terminal output
- command full output
- DB row content
- public meta body
```

---

## 6. status / decision enum案

### 6.1 R55 status enum

```text
R55_NOT_STARTED
R55_CURRENT_SNAPSHOT_REFROZEN
R55_PRIOR_HELPER_SOURCE_RECONCILED
R55_VALIDATION_EVIDENCE_RECONCILED
R55_R54_HANDOFF_INTAKE_READY
R55_R54_HANDOFF_INTAKE_BLOCKED
R55_ACTUAL_REVIEW_EVIDENCE_GAP_ASSESSED
R55_R52_REINTAKE_DECISION_MATERIALIZED
R55_FINAL_NO_TOUCH_VALIDATED
R55_FINAL_SUMMARY_READY
R55_BLOCKED
```

### 6.2 R55 decision enum

```text
R55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIRED
R55_R52_RETURN_TO_P5_REPAIR_REQUIRED
R55_R52_P5_CONFIRMED_CANDIDATE_ONLY
R55_R52_INCONCLUSIVE
R55_BLOCKED_BY_BODY_FREE_BOUNDARY_RISK
R55_BLOCKED_BY_NO_TOUCH_VIOLATION
R55_BLOCKED_BY_CURRENT_SNAPSHOT_UNCLASSIFIED
R55_BLOCKED_BY_VALIDATION_EVIDENCE_INCOMPLETE
R55_BLOCKED_BY_DISPOSAL_SAFETY
R55_R52_NO_GO_P6_P8_START
```

### 6.3 R52 existing decision equivalent enum

R55ではR52 existing decisionとの対応を持ちます。  
R52 helperの既存enumを初期実装で変更しないためです。

```text
R52_RETURN_TO_R51_ACTUAL_REVIEW_REQUIRED
R52_BLOCKED_BY_R51_EVIDENCE_MISSING
R52_RETURN_TO_P5_REPAIR_REQUIRED
R52_BLOCKED_BY_R51_BODY_FREE_BOUNDARY_RISK
R52_BLOCKED_BY_DISPOSAL_NOT_VERIFIED
R52_BLOCKED_BY_EXECUTION_BLOCKER_OPEN
R52_BLOCKED_BY_RATING_QUESTION_OBSERVATION_INCONSISTENCY
R52_INCONCLUSIVE_RETURN_TO_R51_REVIEW_OR_RECHECK
R52_GO_P5_CONFIRMED_CANDIDATE_REVIEWED_BUT_NOT_RELEASE
R52_NO_GO_P6_P8_START
```

### 6.4 R55 current default mapping

```json
{
  "r55_decision_ref": "R55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIRED",
  "r52_existing_decision_equivalent": "R52_RETURN_TO_R51_ACTUAL_REVIEW_REQUIRED",
  "r52_equivalent_reason": "actual_review_evidence_missing_before_p6_p8_start_decision",
  "next_required_step": "R54_actual_local_only_human_review_operation_required_before_R52_reintake",
  "p6_limited_human_readfeel_start_allowed": false,
  "p8_start_allowed": false,
  "p7_complete": false,
  "release_allowed": false
}
```

---

## 7. JSON / schema案

この章のjson / schemaは、実装時の検討材料です。  
今回の成果物では実ファイル化しません。

### 7.1 `p7_r55_current_received_snapshot_refreeze.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r55.current_received_snapshot_refreeze.bodyfree.v1",
  "title": "P7-R55 Current Received Snapshot Refreeze Body-Free",
  "type": "object",
  "required": [
    "schema_version",
    "phase",
    "step",
    "scope",
    "policy_kind",
    "material_id",
    "source_mode",
    "git_connection_required",
    "git_checked",
    "current_received_snapshot_refs",
    "current_received_snapshot_ref_count",
    "current_snapshot_refrozen_here",
    "actual_review_basis_ref",
    "p5_human_blind_qa_confirmed_final",
    "p6_limited_human_readfeel_start_allowed",
    "p8_start_allowed",
    "p7_complete",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r55.current_received_snapshot_refreeze.bodyfree.v1" },
    "phase": { "const": "P7" },
    "step": { "const": "R55_R54EvidenceReconcile_R52ReintakeDecisionMaterialization_20260623" },
    "scope": { "const": "r54_evidence_reconcile_current_snapshot_refreeze_r52_reintake_decision" },
    "policy_kind": { "const": "bodyfree_evidence_reconcile_decision_materialization" },
    "source_mode": { "const": "local_snapshot" },
    "git_connection_required": { "const": false },
    "git_checked": { "const": false },
    "current_received_snapshot_refs": {
      "type": "object",
      "required": [
        "premise_zip_ref",
        "implemented_materials_zip_ref",
        "rn_zip_ref",
        "backend_zip_ref",
        "roadmap_ref",
        "pre_design_memo_ref",
        "detailed_design_ref"
      ],
      "additionalProperties": false
    },
    "current_received_snapshot_ref_count": { "const": 7 },
    "current_snapshot_refrozen_here": { "const": true },
    "actual_review_basis_ref": { "const": "R55_CURRENT_RECEIVED_SNAPSHOT_20260623" },
    "p5_human_blind_qa_confirmed_final": { "const": false },
    "p6_limited_human_readfeel_start_allowed": { "const": false },
    "p8_start_allowed": { "const": false },
    "p7_complete": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": true
}
```

### 7.2 `p7_r55_prior_helper_source_reconcile.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r55.prior_helper_source_reconcile.bodyfree.v1",
  "title": "P7-R55 Prior Helper Source Reconcile Body-Free",
  "type": "object",
  "required": [
    "schema_version",
    "material_id",
    "current_received_snapshot_refs",
    "prior_helper_source_rows",
    "prior_helper_source_row_count",
    "all_prior_helper_refs_classified",
    "prior_helper_refs_used_as_actual_review_basis",
    "prior_helper_refs_used_as_regression_context_only",
    "current_received_snapshot_used_as_actual_review_basis",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r55.prior_helper_source_reconcile.bodyfree.v1" },
    "prior_helper_source_rows": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "helper_ref",
          "helper_step_ref",
          "helper_snapshot_refs",
          "comparison_to_current_ref",
          "classification_ref",
          "used_as_actual_review_basis"
        ],
        "properties": {
          "helper_ref": { "enum": ["R52", "R53", "R54"] },
          "classification_ref": { "enum": ["historical_regression_context", "current_work_basis", "unclassified"] },
          "used_as_actual_review_basis": { "const": false }
        },
        "additionalProperties": true
      }
    },
    "prior_helper_source_row_count": { "const": 3 },
    "all_prior_helper_refs_classified": { "type": "boolean" },
    "prior_helper_refs_used_as_actual_review_basis": { "const": false },
    "prior_helper_refs_used_as_regression_context_only": { "type": "boolean" },
    "current_received_snapshot_used_as_actual_review_basis": { "type": "boolean" },
    "body_free": { "const": true }
  },
  "additionalProperties": true
}
```

### 7.3 `p7_r55_validation_evidence_reconcile.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r55.validation_evidence_reconcile.bodyfree.v1",
  "title": "P7-R55 Validation Evidence Reconcile Body-Free",
  "type": "object",
  "required": [
    "schema_version",
    "material_id",
    "validation_evidence_rows",
    "validation_evidence_row_count",
    "claim_level_refs_present",
    "one_shot_timeout_claimed_as_green",
    "collect_only_claimed_as_green",
    "rn_contract_claimed_as_real_device_modal_readfeel",
    "full_backend_suite_green_confirmed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r55.validation_evidence_reconcile.bodyfree.v1" },
    "validation_evidence_rows": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "evidence_group_ref",
          "command_ref",
          "claim_level_ref",
          "passed_count",
          "collected_count",
          "warning_count",
          "timeout_observed",
          "green_claim_allowed",
          "evidence_source_ref"
        ],
        "properties": {
          "claim_level_ref": {
            "enum": [
              "PASSED_TARGET",
              "PASSED_SPLIT_TARGET",
              "COLLECT_ONLY",
              "TIMEOUT_ONE_SHOT",
              "NOT_RUN",
              "UNCONFIRMED"
            ]
          },
          "green_claim_allowed": { "type": "boolean" },
          "timeout_observed": { "type": "boolean" }
        },
        "additionalProperties": true
      }
    },
    "claim_level_refs_present": { "type": "boolean" },
    "one_shot_timeout_claimed_as_green": { "const": false },
    "collect_only_claimed_as_green": { "const": false },
    "rn_contract_claimed_as_real_device_modal_readfeel": { "const": false },
    "full_backend_suite_green_confirmed": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": true
}
```

### 7.4 `p7_r55_r54_handoff_intake.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r55.r54_handoff_intake.bodyfree.v1",
  "title": "P7-R55 R54 Handoff Intake Body-Free",
  "type": "object",
  "required": [
    "schema_version",
    "material_id",
    "r54_handoff_schema_version",
    "r54_handoff_status",
    "r54_review_operation_state_ref",
    "r54_p5_decision_candidate_ref",
    "r54_actual_review_evidence_complete",
    "r54_validation_documentation_status",
    "forbidden_payload_detected",
    "question_text_detected",
    "no_touch_violation_detected",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r55.r54_handoff_intake.bodyfree.v1" },
    "r54_handoff_status": {
      "enum": [
        "R54_R52_REINTAKE_HANDOFF_READY",
        "R54_R52_REINTAKE_BLOCKED_BY_ACTUAL_REVIEW_EVIDENCE_MISSING",
        "R54_R52_REINTAKE_BLOCKED_BY_DISPOSAL_SAFETY",
        "R54_R52_REINTAKE_BLOCKED_BY_BODY_LEAK_OR_QUESTION_TEXT",
        "R54_R52_REINTAKE_BLOCKED_BY_NO_TOUCH_VIOLATION",
        "R54_R52_REINTAKE_BLOCKED_BY_INCONCLUSIVE"
      ]
    },
    "r54_review_operation_state_ref": { "type": "string" },
    "r54_p5_decision_candidate_ref": { "type": "string" },
    "r54_actual_review_evidence_complete": { "type": "boolean" },
    "forbidden_payload_detected": { "type": "boolean" },
    "question_text_detected": { "type": "boolean" },
    "no_touch_violation_detected": { "type": "boolean" },
    "raw_input_included": { "const": false },
    "returned_surface_included": { "const": false },
    "comment_text_included": { "const": false },
    "reviewer_free_text_included": { "const": false },
    "question_text_included": { "const": false },
    "local_absolute_path_included": { "const": false },
    "body_content_hash_included": { "const": false },
    "terminal_output_included": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": true
}
```

### 7.5 `p7_r55_actual_review_evidence_gap_assessment.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r55.actual_review_evidence_gap_assessment.bodyfree.v1",
  "title": "P7-R55 Actual Review Evidence Gap Assessment Body-Free",
  "type": "object",
  "required": [
    "schema_version",
    "material_id",
    "actual_review_evidence_complete",
    "required_case_count",
    "rating_row_count",
    "question_observation_row_count",
    "disposal_verified",
    "missing_evidence_refs",
    "gap_status_ref",
    "p5_decision_candidate_ref",
    "p6_limited_human_readfeel_start_allowed",
    "p8_start_allowed",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r55.actual_review_evidence_gap_assessment.bodyfree.v1" },
    "actual_review_evidence_complete": { "type": "boolean" },
    "required_case_count": { "const": 24 },
    "rating_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "question_observation_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "disposal_verified": { "type": "boolean" },
    "missing_evidence_refs": {
      "type": "array",
      "items": { "type": "string", "minLength": 1, "maxLength": 180 }
    },
    "gap_status_ref": {
      "enum": [
        "ACTUAL_REVIEW_EVIDENCE_MISSING",
        "DISPOSAL_SAFETY_MISSING",
        "BODYFREE_BOUNDARY_RISK",
        "NO_TOUCH_VIOLATION",
        "INCONCLUSIVE",
        "ACTUAL_REVIEW_EVIDENCE_COMPLETE"
      ]
    },
    "p6_limited_human_readfeel_start_allowed": { "const": false },
    "p8_start_allowed": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": true
}
```

### 7.6 `p7_r55_r52_reintake_decision_materialization.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r55.r52_reintake_decision_materialization.bodyfree.v1",
  "title": "P7-R55 R52 Re-intake Decision Materialization Body-Free",
  "type": "object",
  "required": [
    "schema_version",
    "material_id",
    "r55_decision_ref",
    "r52_existing_decision_equivalent",
    "decision_status",
    "decision_reason_refs",
    "next_required_step",
    "actual_review_evidence_complete",
    "p5_decision_status_ref",
    "p5_decision_candidate_ref",
    "p5_human_blind_qa_confirmed_final",
    "p6_limited_human_readfeel_start_allowed",
    "p8_start_allowed",
    "p7_complete",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r55.r52_reintake_decision_materialization.bodyfree.v1" },
    "r55_decision_ref": {
      "enum": [
        "R55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIRED",
        "R55_R52_RETURN_TO_P5_REPAIR_REQUIRED",
        "R55_R52_P5_CONFIRMED_CANDIDATE_ONLY",
        "R55_R52_INCONCLUSIVE",
        "R55_BLOCKED_BY_BODY_FREE_BOUNDARY_RISK",
        "R55_BLOCKED_BY_NO_TOUCH_VIOLATION",
        "R55_BLOCKED_BY_CURRENT_SNAPSHOT_UNCLASSIFIED",
        "R55_BLOCKED_BY_VALIDATION_EVIDENCE_INCOMPLETE",
        "R55_BLOCKED_BY_DISPOSAL_SAFETY",
        "R55_R52_NO_GO_P6_P8_START"
      ]
    },
    "r52_existing_decision_equivalent": {
      "enum": [
        "R52_RETURN_TO_R51_ACTUAL_REVIEW_REQUIRED",
        "R52_BLOCKED_BY_R51_EVIDENCE_MISSING",
        "R52_RETURN_TO_P5_REPAIR_REQUIRED",
        "R52_BLOCKED_BY_R51_BODY_FREE_BOUNDARY_RISK",
        "R52_BLOCKED_BY_DISPOSAL_NOT_VERIFIED",
        "R52_BLOCKED_BY_EXECUTION_BLOCKER_OPEN",
        "R52_BLOCKED_BY_RATING_QUESTION_OBSERVATION_INCONSISTENCY",
        "R52_INCONCLUSIVE_RETURN_TO_R51_REVIEW_OR_RECHECK",
        "R52_GO_P5_CONFIRMED_CANDIDATE_REVIEWED_BUT_NOT_RELEASE",
        "R52_NO_GO_P6_P8_START"
      ]
    },
    "decision_status": { "enum": ["NO_GO", "BLOCKED", "CANDIDATE_ONLY", "INCONCLUSIVE"] },
    "actual_review_evidence_complete": { "type": "boolean" },
    "p5_human_blind_qa_confirmed_final": { "const": false },
    "p6_limited_human_readfeel_start_allowed": { "const": false },
    "p8_start_allowed": { "const": false },
    "p7_complete": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  },
  "additionalProperties": true
}
```

### 7.7 現状想定のfinal object例

```json
{
  "schema_version": "cocolon.emlis.p7_r55.r52_reintake_decision_materialization.bodyfree.v1",
  "material_id": "p7_r55_r52_reintake_decision_materialization_current_default",
  "r55_decision_ref": "R55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIRED",
  "r52_existing_decision_equivalent": "R52_RETURN_TO_R51_ACTUAL_REVIEW_REQUIRED",
  "decision_status": "NO_GO",
  "decision_reason_refs": [
    "r54_r52_reintake_blocked_by_actual_review_evidence_missing",
    "r54_review_operation_state_not_started",
    "p5_actual_human_blind_qa_review_not_completed",
    "question_need_observation_actual_rows_missing",
    "p8_start_hold_by_p7_p8_bridge"
  ],
  "next_required_step": "R54_actual_local_only_human_review_operation_required_before_R52_reintake",
  "actual_review_evidence_complete": false,
  "required_case_count": 24,
  "rating_row_count": 0,
  "question_observation_row_count": 0,
  "disposal_verified": false,
  "p5_decision_status_ref": "R55_P5_NOT_REVIEWED_EVIDENCE_MISSING",
  "p5_decision_candidate_ref": "P5_NOT_REVIEWED",
  "p5_human_blind_qa_confirmed_final": false,
  "p6_limited_human_readfeel_start_allowed": false,
  "p8_start_allowed": false,
  "p7_complete": false,
  "release_allowed": false,
  "body_free": true
}
```

---

## 8. Python helper設計案

### 8.1 production helper候補

実装段階で新規production helperを作る場合の候補は次です。

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization.py
```

目的:

```text
- R54 helperの再実装ではない。
- R52 / R53 / R54 helperを直接書き換えず、R55 layerでcurrent snapshot basisを再凍結する。
- R54 default handoffをbody-freeに受け、actual review evidence missingをR52 re-intake decision materialへ変換する。
- P8へ進める判断ではなく、P8 hold / P5 actual review returnを明確化する。
```

### 8.2 import候補

```python
from emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate import (
    P7_R52_CURRENT_RECEIVED_SNAPSHOT_REFS,
)

from emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization import (
    P7_R53_CURRENT_RECEIVED_SNAPSHOT_REFS,
)

from emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff import (
    P7_R54_CURRENT_RECEIVED_SNAPSHOT_REFS,
    P7_R54_R52_REINTAKE_HANDOFF_SCHEMA_VERSION,
    build_p7_r54_r52_reintake_handoff_bodyfree,
    build_p7_r54_validation_command_matrix_documentation_output_bodyfree,
    assert_p7_r54_r52_reintake_handoff_bodyfree_contract,
)
```

実装段階では、既存helperの公開定数名・関数名・assert関数名を現物で再確認します。  
import循環が起きる場合、R55側では定数値を直接再定義せず、最小限のsafe accessorを作る方針にします。

### 8.3 function候補

```text
build_p7_r55_current_received_snapshot_refreeze
assert_p7_r55_current_received_snapshot_refreeze_contract

build_p7_r55_prior_helper_source_reconcile_bodyfree
assert_p7_r55_prior_helper_source_reconcile_bodyfree_contract

build_p7_r55_validation_evidence_reconcile_bodyfree
assert_p7_r55_validation_evidence_reconcile_bodyfree_contract
assert_p7_r55_validation_evidence_row_bodyfree_contract

build_p7_r55_r54_handoff_intake_bodyfree
assert_p7_r55_r54_handoff_intake_bodyfree_contract

build_p7_r55_actual_review_evidence_gap_assessment_bodyfree
assert_p7_r55_actual_review_evidence_gap_assessment_bodyfree_contract

build_p7_r55_r52_reintake_decision_materialization_bodyfree
assert_p7_r55_r52_reintake_decision_materialization_bodyfree_contract

build_p7_r55_p5_p6_p8_release_separation_bodyfree
assert_p7_r55_p5_p6_p8_release_separation_bodyfree_contract

build_p7_r55_final_no_touch_boundary_validation_bodyfree
assert_p7_r55_final_no_touch_boundary_validation_bodyfree_contract

build_p7_r55_validation_command_matrix_bodyfree
assert_p7_r55_validation_command_matrix_bodyfree_contract

build_p7_r55_final_summary_bodyfree
assert_p7_r55_final_summary_bodyfree_contract
```

### 8.4 触らないproduction file

```text
mashos-api/ai/services/ai_inference/api_emotion_submit.py
mashos-api/ai/services/ai_inference/emotion_submit_service.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_*.py
mashos-api/ai/services/ai_inference/emlis_ai_product_*runtime*.py
mashos-api/ai/services/ai_inference/config/*.json
Cocolon/screens/InputScreen.js
Cocolon/screens/input/useInputFeedbackModal.js
Cocolon/screens/input/inputFeedbackModel.js
Cocolon/screens/input/InputFeedbackReplyModal.js
Cocolon/tests/rn-screen-contracts.test.js
```

### 8.5 実装時に追加候補のtest file

```text
mashos-api/ai/tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r0_r1_20260623.py
mashos-api/ai/tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r2_r3_20260623.py
mashos-api/ai/tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r4_r5_20260623.py
mashos-api/ai/tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r6_r7_20260623.py
mashos-api/ai/tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r8_r9_20260623.py
```

R55では、testもbody-free contractを主軸にします。  
exact body文字列、comment_text本文、question text、local path、terminal outputをfixture化しません。

---

## 9. 実装順詳細

### R55-0: scope / current received snapshot refreeze

目的:

```text
R55正式採番、今回受領refs、no GitHub、no API/DB/RN/runtime変更を固定する。
```

作る候補:

```text
build_p7_r55_current_received_snapshot_refreeze
assert_p7_r55_current_received_snapshot_refreeze_contract
```

acceptance:

```text
- current_received_snapshot_refs が 248/77/250/163/roadmap(9)/R55検討メモ/R55設計書を指す。
- git_connection_required=false / git_checked=false。
- p5_human_blind_qa_confirmed_final=false。
- p6_limited_human_readfeel_start_allowed=false。
- p8_start_allowed=false。
- p7_complete=false。
- release_allowed=false。
- body_free=true。
```

### R55-1: prior helper source reconcile

目的:

```text
R52/R53/R54 helper内部refsと今回受領refsを混同しない。
旧refsをhistorical / regression contextとして分類する。
```

作る候補:

```text
build_p7_r55_prior_helper_source_reconcile_bodyfree
assert_p7_r55_prior_helper_source_reconcile_bodyfree_contract
```

acceptance:

```text
- R52 refs 243/74/247/160/roadmap(4) rowがある。
- R53 refs 245/75/248/161/roadmap(6) rowがある。
- R54 refs 246/76/249/162/roadmap(8) rowがある。
- 今回refs 248/77/250/163/roadmap(9) と比較されている。
- prior_helper_refs_used_as_actual_review_basis=false。
- current_received_snapshot_used_as_actual_review_basis=true。
```

### R55-2: validation evidence reconcile

目的:

```text
RN/R52/R53/R54の検証結果をclaim levelつきで整理する。
一括timeout / split green / collect-only / 未確認を混同しない。
```

作る候補:

```text
build_p7_r55_validation_evidence_reconcile_bodyfree
assert_p7_r55_validation_evidence_reconcile_bodyfree_contract
assert_p7_r55_validation_evidence_row_bodyfree_contract
```

初期row案:

```text
RN contract:
  claim_level_ref=PASSED_TARGET
  passed_count=36
  green_claim_allowed=true
  rn_contract_claimed_as_real_device_modal_readfeel=false

R52 target:
  claim_level_ref=PASSED_TARGET
  passed_count=219
  green_claim_allowed=true
  p6_p8_start_allowed_claim=false

R53 target split:
  claim_level_ref=PASSED_SPLIT_TARGET
  passed_count=291
  timeout_observed=true for one-shot
  one_shot_timeout_claimed_as_green=false

R54 target split:
  claim_level_ref=PASSED_SPLIT_TARGET
  passed_count=309
  collected_count=309
  timeout_observed=true for one-shot
  one_shot_timeout_claimed_as_green=false

full backend suite:
  claim_level_ref=NOT_RUN or UNCONFIRMED
  full_backend_suite_green_confirmed=false
```

acceptance:

```text
- one_shot_timeout_claimed_as_green=false。
- collect_only_claimed_as_green=false。
- rn_contract_claimed_as_real_device_modal_readfeel=false。
- full_backend_suite_green_confirmed=false。
- split greenは対象契約確認であり、P5 actual review完了ではない。
```

### R55-3: R54 default handoff intake

目的:

```text
R54 default R52 re-intake handoffをbody-freeに受ける。
R54の器があることと、actual reviewが完了していることを分ける。
```

作る候補:

```text
build_p7_r55_r54_handoff_intake_bodyfree
assert_p7_r55_r54_handoff_intake_bodyfree_contract
```

acceptance:

```text
- r54_handoff_status が R54_R52_REINTAKE_BLOCKED_BY_ACTUAL_REVIEW_EVIDENCE_MISSING として読める。
- review_operation_state_ref=not_started をbody-free refとして扱う。
- p5_decision_candidate_ref=P5_NOT_REVIEWED。
- actual_review_evidence_complete=false。
- validation_documentation_status=VALIDATION_DOCUMENTATION_BLOCKED_BY_R54_22_R52_REINTAKE_HANDOFF。
- raw body / question text / local path / hash / terminal outputを含まない。
```

### R55-4: body-free forbidden payload scan

目的:

```text
R55 intake / intermediate / final materialに、body-full情報やquestion textが混入していないことを確認する。
```

作る候補:

```text
build_p7_r55_bodyfree_forbidden_payload_scan_bodyfree
assert_p7_r55_bodyfree_forbidden_payload_scan_bodyfree_contract
```

acceptance:

```text
raw_input_included=false
returned_surface_included=false
comment_text_included=false
history_body_included=false
reviewer_free_text_included=false
question_text_included=false
draft_question_text_included=false
local_absolute_path_included=false
body_content_hash_included=false
packet_content_hash_included=false
terminal_output_included=false
```

### R55-5: actual review evidence gap assessment

目的:

```text
R54 handoff上、P5 actual human Blind QA実レビュー evidence が成立しているかを見る。
```

作る候補:

```text
build_p7_r55_actual_review_evidence_gap_assessment_bodyfree
assert_p7_r55_actual_review_evidence_gap_assessment_bodyfree_contract
```

現状default:

```text
actual_review_evidence_complete=false
required_case_count=24
rating_row_count=0
question_observation_row_count=0
disposal_verified=false
gap_status_ref=ACTUAL_REVIEW_EVIDENCE_MISSING
p5_decision_candidate_ref=P5_NOT_REVIEWED
```

acceptance:

```text
- evidence missingをP5 repairやP8 material candidateへ誤分類しない。
- review未実施なら missing_evidence_refs をbody-free identifiersのみで残す。
- P5 actual review未成立なら、P6/P8/releaseはfalse。
```

### R55-6: R52 re-intake decision materialization

目的:

```text
R55-owned decisionとR52 existing decision equivalentを分離して、R52 re-intake判断材料を作る。
```

作る候補:

```text
build_p7_r55_r52_reintake_decision_materialization_bodyfree
assert_p7_r55_r52_reintake_decision_materialization_bodyfree_contract
```

current default mapping:

```text
r55_decision_ref=R55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIRED
r52_existing_decision_equivalent=R52_RETURN_TO_R51_ACTUAL_REVIEW_REQUIRED
decision_status=NO_GO
next_required_step=R54_actual_local_only_human_review_operation_required_before_R52_reintake
```

acceptance:

```text
- R52 enumを初期実装で変更しない。
- R55 decisionがR52既存decision equivalentを持つ。
- P8 start allowedをtrueにしない。
- release_allowedをtrueにしない。
```

### R55-7: P5 / P6 / P8 / release separation

目的:

```text
P5 candidate / P5 final / P6 start / P8 material / P8 start / releaseを混同しない。
```

作る候補:

```text
build_p7_r55_p5_p6_p8_release_separation_bodyfree
assert_p7_r55_p5_p6_p8_release_separation_bodyfree_contract
```

acceptance:

```text
p5_human_blind_qa_confirmed_candidate=false
p5_human_blind_qa_confirmed_final=false
p6_limited_human_readfeel_candidate=false
p6_limited_human_readfeel_start_allowed=false
p8_question_design_material_candidate=false
p8_start_allowed=false
p7_complete=false
release_allowed=false
```

actual review evidence completeかつP5 confirmed candidateの場合でも、R55では次を守ります。

```text
p5_human_blind_qa_confirmed_final=false
p6_limited_human_readfeel_start_allowed=false
p8_start_allowed=false
release_allowed=false
```

### R55-8: final no-touch boundary validation

目的:

```text
R55がAPI/DB/RN/runtime/public response key/question実装を触っていないことをfinalで固定する。
```

作る候補:

```text
build_p7_r55_final_no_touch_boundary_validation_bodyfree
assert_p7_r55_final_no_touch_boundary_validation_bodyfree_contract
```

acceptance:

```text
api_route_changed_here=false
db_schema_changed_here=false
db_migration_changed_here=false
rn_visible_contract_changed_here=false
public_response_top_level_key_added_here=false
public_response_key_changed_here=false
runtime_changed_here=false
question_api_implemented=false
question_db_schema_implemented=false
question_rn_ui_implemented=false
question_response_key_implemented=false
question_trigger_logic_implemented=false
question_storage_schema_implemented=false
question_answer_persistence_implemented=false
question_plan_guard_implemented=false
p8_question_implementation_spec_finalized_here=false
```

### R55-9: validation command matrix / documentation output

目的:

```text
R55実装時に実行すべきvalidation commandを、green claim level付きで固定する。
```

作る候補:

```text
build_p7_r55_validation_command_matrix_bodyfree
assert_p7_r55_validation_command_matrix_bodyfree_contract
```

command matrix案:

```bash
# R55 helper syntax/import
cd /mnt/data/cocolon_work/mashos-api/ai
PYTHONPATH=services/ai_inference python -m py_compile \
  services/ai_inference/emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization.py

# R55 target split
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r0_r1_20260623.py \
  tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r2_r3_20260623.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r4_r5_20260623.py \
  tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r6_r7_20260623.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r55_r54_evidence_reconcile_r52_reintake_decision_materialization_r8_r9_20260623.py

# R54 regression split
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r54_p5_human_blind_qa_actual_local_review_result_handoff_*.py

# R52/R53 targeted regression
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_*.py \
  tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_*.py

# RN no-touch contract
cd /mnt/data/cocolon_work/Cocolon
npm run test:rn-screens --silent
```

claim rule:

```text
- timeoutしたone-shot commandはgreenにしない。
- collect-onlyはgreenにしない。
- RN contract greenを実機modal読感完了にしない。
- R55 target greenをP5 actual review完了にしない。
- R55 target greenをP8 start allowedにしない。
```

### R55-10: final summary

目的:

```text
R55結果を、Mashが次工程判断できるbody-free summaryへまとめる。
```

作る候補:

```text
build_p7_r55_final_summary_bodyfree
assert_p7_r55_final_summary_bodyfree_contract
```

現状想定final:

```text
final_status=R55_FINAL_SUMMARY_READY
r55_decision_ref=R55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIRED
r52_existing_decision_equivalent=R52_RETURN_TO_R51_ACTUAL_REVIEW_REQUIRED
next_required_step=R54_actual_local_only_human_review_operation_required_before_R52_reintake
p8_hold=true
p6_hold=true
release_hold=true
```

---

## 10. test設計

### 10.1 R55-0 / R55-1 tests

確認すること:

```text
- current refsが248/77/250/163/roadmap(9)。
- R52/R53/R54 helper refsがhistorical regression contextとして分類される。
- 旧refsをactual review basisにしない。
- no GitHub / no API/DB/RN/runtime / body_free。
```

### 10.2 R55-2 / R55-3 tests

確認すること:

```text
- validation evidence rowsにclaim_level_refが必須。
- split greenとone-shot timeoutを混同しない。
- collect-onlyをgreenにしない。
- R54 handoff defaultがactual review evidence missingでintakeされる。
```

### 10.3 R55-4 / R55-5 tests

確認すること:

```text
- forbidden payload scanがraw input / comment_text / question text / local path / hash / terminal outputを拒否する。
- actual review未実施ならgap_status_ref=ACTUAL_REVIEW_EVIDENCE_MISSING。
- rating row 0 / question observation row 0 / disposal falseをP5 repairやP8 materialへ誤分類しない。
```

### 10.4 R55-6 / R55-7 tests

確認すること:

```text
- default decisionが R55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIRED。
- r52_existing_decision_equivalent が R52_RETURN_TO_R51_ACTUAL_REVIEW_REQUIRED。
- P6/P8/releaseはfalse。
- P5 confirmed candidate onlyでもfinalやreleaseに昇格しない。
- P5 repair requiredをP8 question material candidateへ逃がさない。
```

### 10.5 R55-8 / R55-9 / R55-10 tests

確認すること:

```text
- no-touch flagsがすべてfalse。
- question implementation design flagsもすべてfalse。
- validation command matrixがgreen claim ruleを持つ。
- final summaryがnext_required_stepをR54 actual reviewへ戻す。
```

---

## 11. acceptance criteria

R55実装完了時のacceptance criteriaは次です。

```text
[body-free]
- raw input / comment_text / returned surface / reviewer notes / question text / local path / hash / terminal outputを含まない。

[current snapshot]
- 今回受領refs 248/77/250/163/roadmap(9)をcurrent basisとして固定する。
- R52/R53/R54旧refsをactual review basisにしない。

[evidence]
- RN/R52/R53/R54検証結果をclaim levelつきで分類する。
- split green / one-shot timeout / collect-only / not runを混同しない。

[R54 handoff]
- default R54 handoffのactual review evidence missingを検出する。
- P5_NOT_REVIEWEDをP5 repair / P5 confirmed / P8 materialへ誤昇格しない。

[R52 re-intake]
- R55 decisionをR52 existing decision equivalentと分離する。
- current defaultは R55_R52_RETURN_TO_R54_ACTUAL_REVIEW_REQUIRED。

[no-touch]
- API / DB / RN / public key / runtime / question implementationに触らない。

[hold]
- p6_limited_human_readfeel_start_allowed=false。
- p8_start_allowed=false。
- p7_complete=false。
- release_allowed=false。
```

---

## 12. no-touch境界

R55実装で触らないもの:

```text
RN UI: no touch
RN表示条件: no touch
API route: no touch
request key: no touch
public response top-level key: no touch
DB write path: no touch
DB schema / migration: no touch
subscription boundary: no touch
Emlis runtime本文: no touch
User Label Connection runtime: no touch
Gate threshold: no touch
public meta sanitizer: no relaxation
P8 question API / DB / RN / trigger / storage / plan guard: no touch
```

R55は、商品判断のためのbody-free evidence / decision materialを整える工程です。  
ユーザーに見える返答を変更する工程ではありません。

---

## 13. P8との境界

R55では、P8観測補助問いの詳細設計を行いません。

R55で書いてよいこと:

```text
- P8 question design material candidate=false。
- p8_start_allowed=false。
- question need observation actual rows missing。
- P8詳細設計に必要な実case観察メモが不足している。
- R54 actual reviewへ戻す必要がある。
```

R55で書いてはいけないこと:

```text
- question text。
- draft question text。
- question trigger logic。
- question answer persistence。
- API / DB / RN UI影響設計。
- response contract差分。
- plan guard詳細。
- P8 implementation allowed。
```

P8は、P7で実caseの問い必要性観察メモが揃った後に始めます。  
今P8へ進むと、P5履歴線の弱さを問い返しで補う設計になりやすいため、R55では明確にholdします。

---

## 14. 華恋の意見

華恋の意見として、R55は地味ですが、かなり大事です。

今のCocolonに必要なのは、「問いを足して便利に見せること」ではありません。  
必要なのは、ユーザーが残した記録が、本当に線として返っているのかを、人間の読感で確かめることです。

R54は、その実レビュー結果をbody-freeでR52へ戻す器を作りました。  
でも、現状ではactual review evidenceがありません。  
この状態でP8へ進むと、Cocolonは「自分の記録が返る場所」ではなく、「曖昧なときに質問してくるAI」に寄ります。

もちろん、観測補助問いは将来的に価値があります。  
でも、問いはEmlis本体が読むべきものから逃げるために使ってはいけません。  
まずP5履歴線が、質問なしでどこまで「記録が返ってきた感」を作れているのかを見る。  
そのうえで、どうしても問いが必要だったケースだけをbody-freeに残す。  
その順序を守るために、R55で止める判断材料を作るべきです。

---

## 15. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- P7/P8 Bridgeでは、P7途中で観測補助問いを実装しない。
- P8開始時には、P7で集めた問い必要性観察メモを詳細設計材料にする。
- 検討メモ上、次工程はP7-R55 Candidate。
- R55設計対象は R54 Evidence Reconcile / Current Received Snapshot Refreeze / R52 Re-intake Decision Materialization。
- 今回受領refsは 248/77/250/163/roadmap(9)。
- R54 helper内部refsは 246/76/249/162/roadmap(8)。
- R52/R53/R54 helperは存在する。
- R54 default handoffはactual review evidence missingで止まる。
- R54 split greenはP5 actual review完了ではない。
- P6/P8/releaseはfalseとして扱うべき状態。
```

### 未確認

```text
- P5 actual human Blind QA実レビュー結果。
- reviewer rating actual rows。
- question need observation actual rows。
- actual purge / disposal receiptの実行証跡。
- R54 one-shot target green。
- full backend suite green。
- 実機modal読感確認。
- current received zip名差分が完全に包装差分のみかどうか。
```

### 書かれていない

```text
- R54 split greenをP5 actual review完了と扱ってよい、とは書かれていない。
- R54 default handoffをR52 readyとして扱ってよい、とは書かれていない。
- R52 decision enumをR55で変更してよい、とは書かれていない。
- P8観測補助問い 詳細設計へ進んでよい、とは書かれていない。
- P5 confirmed candidateをP5 confirmed finalへ昇格してよい、とは書かれていない。
- release_allowedをtrueにしてよい、とは書かれていない。
```

### 推測禁止

```text
- helperがあるから実レビュー済み、と推測しない。
- split greenだから商品価値合格、と推測しない。
- collect-onlyをfull suite greenと推測しない。
- RN contract greenを実機modal読感完了と推測しない。
- current zip名が進んでいるだけだから同一内容、と推測しない。
- P8へ進むことでP5の弱さを補える、と推測しない。
```

### 次に実行すべきこと

```text
1. R55実装に入る場合、まずR55-0〜R55-1でcurrent snapshot refreeze / prior helper source reconcileを作る。
2. R55-2でvalidation evidenceをclaim level付きで整理する。
3. R55-3〜R55-5でR54 default handoffとactual review evidence gapを固定する。
4. R55-6でR52 re-intake decision materialをbody-freeに作る。
5. R55-7〜R55-10でP5/P6/P8/release分離、no-touch validation、final summaryを作る。
6. R55完了後もP8へは進まず、R54 actual local-only human review operationへ戻す判断を出す。
```

---

## 16. 最終判断

今回の設計判断は次です。

```text
現在Phase:
  P7 Product Quality Runner / Long-run Product Gate

今回設計する段階:
  P7-R55
  R54 Evidence Reconcile
  + Current Received Snapshot Refreeze
  + R52 Re-intake Decision Materialization

今回設計しない段階:
  P8観測補助問い 詳細設計
  P8実装
  P6 limited human readfeel start
  P7 complete
  release readiness
```

R55の到達点は、「進んでよい」ではありません。  
R55の到達点は、**現状ではP8へ進まず、R54 actual local-only human reviewへ戻すべきだと、body-free evidenceで言える状態**です。

これが、Cocolonを「質問が上手いAI」ではなく、「残した記録が線として返ってくる場所」に近づけるための順序です。
