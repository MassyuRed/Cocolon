# Cocolon / EmlisAI P7-R53 R51 Actual Local-Only Human Review Execution Evidence Materialization 詳細設計書・実装順

作成日: 2026-06-21 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書 / 実装順  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / P5 Human Blind QA / R51 actual local-only human review / R52 return-to-R51 decision / P7-P8 Bridge question need observation  
GitHub接続確認: Mash指定により不要。未実施。  
コード変更: なし。  
body-full review packet生成: なし。  
P5 Human Blind QA実レビュー: なし。  
reviewer rating記入: なし。  
question need observation row実記入: なし。  
body-full packet / reviewer notes purge実行: なし。  
API / DB / RN UI / public response key / runtime変更: なし。  
P8観測補助問い詳細設計: なし。  
release判断: なし。  

---

## 0. この設計書の結論

今回の正式採番は、次で固定します。

```text
Phase:
  P7 Product Quality Runner / Long-run Product Gate

Step:
  P7-R53

正式名:
  R51 Actual Local-Only Human Review Execution Evidence Materialization

作業意味:
  R52後に、P8へ進まず、R51 actual local-only human review required へ戻る。
  ただし、今回受領snapshotへ再固定したうえで、body-full local-only実読みに必要な器、
  body-free evidence、purge receipt、post-review decision materialを実体化できるようにする。
```

このR53は、**P8観測補助問いの詳細設計ではありません**。  
このR53は、**P5履歴線を人間が実際に読むためのlocal-only evidence materialization工程**です。

R53の中心は次です。

```text
1. current received snapshot refreeze
2. R51 helper / R52 helper の古いsource refsとの差分をbody-freeで記録
3. R49 timeoutを隠さず、actual review前preflightへ戻す
4. explicit allow / local root / purge plan をbody-full生成前に必須化
5. 24-case actual reviewをlocal-onlyで実行できる材料を固定
6. rating rows / blockers / question need observation rowsをbody-free化
7. body-full packet / reviewer notes をpurgeし、disposal receiptを作る
8. P5 confirmed candidate / repair return / inconclusive を分離
9. P6 candidate / P8 material candidate / P8 start allowed を分離
10. R52に再投入できるbody-free handoff evidenceを作る
```

R53で最終的に許可されるのは、最大でも以下です。

```text
- P5 confirmed candidate
- P5 repair return candidate
- P5 review inconclusive
- P6 limited human readfeel candidate
- P8 question design material candidate
```

R53で許可しないものは以下です。

```text
- P5 confirmed final
- P6 limited human readfeel start allowed
- P8 start allowed
- P7 complete
- release_allowed
- API / DB / RN UI / response key / runtime変更
- 観測補助問いの発生ロジック / 保存schema / 実装仕様確定
```

---

## 1. なぜR53を行うのか

Cocolonの中核価値は、ユーザーが残した言葉・感情・カテゴリ・行動・時点・過去記録が、入力直後に「読まれた形」として返ることです。  
P5 User Label Connectionは、その価値が最も商品差分として出る箇所です。

しかし、履歴線は強い分だけ危険です。

```text
- 監視されている感じが出る。
- 「あなたはいつも」へ寄る。
- 原因断定・性格断定へ寄る。
- 現在入力を履歴で上書きする。
- 低情報入力を履歴で深読みする。
- 自己責めを増幅する。
- 安全寄りすぎて、Cocolon固有価値ではなく汎用説明に見える。
```

R50 / R51 / R52 helper と target tests は境界を守る器として存在しています。  
ただし、まだ **P5 actual human Blind QAの実レビュー結果** は揃っていません。

そのため、次に必要なのは新しい問い機能ではなく、P5履歴線を人間が読み、Cocolonの商品体験として成立しているかをbody-free evidenceへ落とすことです。

華恋の判断として、ここでP8へ進むと、P5の弱さを「問いがあれば補える」という形に逃がしてしまいます。  
R53は、その逃げ道を塞ぎ、Cocolonが「人間の言葉を雑に処理しない場所」として成立しているかを確認する工程です。

---

## 2. 参照・確認範囲

### 2.1 今回受領した資料

```text
/mnt/data/Cocolon_前提資料(245).zip
/mnt/data/EmlisAIの実装済み資料(75).zip
/mnt/data/Cocolon(248).zip
/mnt/data/mashos-api(161).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(6).md
/mnt/data/Cocolon_EmlisAI_P7_R53Candidate_R51ActualLocalReview_PreDesignMemo_20260621(1).md
```

### 2.2 作業姿勢として確認した前提

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
```

確認した作業姿勢:

```text
- 前提資料だけで判断しない。実ファイルを現物として見る。
- 見ていないものを確認済みにしない。
- 設計と実装を混ぜない。
- test greenを商品価値合格へ変換しない。
- Cocolonをメンタル問題にせず、商品品質として扱う。
- EmlisAIをテンプレ共感・浅い復唱・診断ラベルへ逃がさない。
- public contract / DB write path / RN表示条件 / ユーザーデータ保護を勝手に変えない。
- 例文・問い案・schema案は、実装段階で現物配置とGuardを見て判断する。
```

### 2.3 参照した実装済み資料

```text
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R50_P5HumanBlindQAActualReviewManualRunDecision_詳細設計書_実装順_20260620.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R51_P5HumanBlindQA_LocalOnlyManualRun_DetailedDesign_ImplementationOrder_20260620.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R52_R51HandoffEvidenceDecisionGate_DetailedDesign_ImplementationOrder_20260621.md
```

確認した中心:

```text
- R50はmanual run decisionであり、actual review実施ではない。
- R51はactual local-only manual runの器を持つが、source refsが今回受領zipより古い。
- R52はR51 body-free handoff evidenceを見て、P6/P8へ自動昇格しないdecision gateである。
- R52の現状decisionは、actual review evidence不足によりR51 actual reviewへ戻る読みである。
```

### 2.4 参照した現行実ファイル

backend側:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r47_local_review_packet_policy.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate.py
```

RN側:

```text
Cocolon/package.json
Cocolon/tests/rn-screen-contracts.test.js
Cocolon/screens/InputScreen.js
Cocolon/screens/input/useInputFeedbackModal.js
Cocolon/screens/input/inputFeedbackModel.js
Cocolon/screens/input/InputFeedbackReplyModal.js
```

---

## 3. 現在地

### 3.1 検討メモ時点の確認済み結果

この設計書作成時点で、以下は検討メモから引き継ぐ確認結果です。今回の設計書作成中に再実行したものではありません。

```text
RN contract:
  36 passed

R52 target:
  219 passed

R51 target:
  125 passed

R50 target:
  99 passed

backend collect-only:
  3810 tests collected / 1 warning

R49 wildcard一括:
  timeout

R49 split再確認:
  途中timeoutのため、今回セッションでは完全green扱いしない
```

読み方:

```text
- RN contract greenは、RN表示契約が壊れていない確認である。
- R50/R51/R52 target greenは、internal boundaryが壊れていない確認である。
- backend collect-onlyはfull backend suite greenではない。
- R49 wildcard timeoutはgreen扱い禁止である。
- どれもP5商品価値合格、P7完了、P8開始許可、release readinessではない。
```

### 3.2 未確認

```text
- P5 actual human Blind QAの実レビュー結果。
- body-full review packetの実生成。
- reviewer rating rowsの実記入。
- question need observation rowsの実記入。
- body-full packet / reviewer notesの実廃棄。
- disposal receiptの実作成。
- P5 confirmed candidateの実判定。
- P5 repair returnの実判定。
- P6 limited human readfeel candidateの実判定。
- P8 question design material candidate summaryの実内容。
- 実機modal読感。
- full backend suite execution green。
- R49 wildcard / splitの現行セッション完全green。
```

### 3.3 書かれていない

```text
- R52完了をもってP8開始してよい、とは書かれていない。
- R51 helper readyをactual review実施済みとして扱ってよい、とは書かれていない。
- body-free question need observationの器があるだけでP8詳細設計材料が揃った、とは書かれていない。
- collect-onlyをfull backend suite greenとして扱ってよい、とは書かれていない。
- R53でAPI / DB / RN / public response key / runtimeを変更してよい、とは書かれていない。
```

### 3.4 推測禁止

```text
- P5履歴線は、たぶん読感が良いはず、と推測しない。
- safeでbody-freeだから商品価値もある、と推測しない。
- 問いがあればP5の弱さを補える、と推測しない。
- 実レビュー未実施なのにP5 confirmed candidateをfinal扱いしない。
- R49 timeoutを環境要因と断定しない。
```

---

## 4. R53の設計方針

### 4.1 R53はR51の再実装ではなく、R51 actual reviewの実体化層

現行R51 helperには、R51-0〜R51-20のbody-free contractが存在します。  
ただし、R51 helper内のsource refsは今回受領zipより古く、かつ実レビュー証拠は未作成です。

したがってR53は、R51 helperを捨てて作り直すのではなく、次の役割を持ちます。

```text
R53 = 今回受領snapshotを基準に、R51 actual local-only manual reviewを実行可能な証拠列へ落とすmaterialization layer
```

実装段階では、次のどちらかを選びます。

```text
原則案:
  新規helper `emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization.py` を作る。
  既存R51 helperのbuilder / assert contractをimportし、current snapshot overrideとactual evidence materializationを束ねる。

避けたい案:
  R51 helper定数を広範囲に直接書き換える。
  R51/R52の既存target testsを壊す可能性が高いため、必要最小限に留める。
```

R53は、R51のsource refsが古いことを「実装regression」と断定しません。  
ただし、今回actual reviewの根拠として古いrefsをそのまま使うことは不可にします。

### 4.2 R53の現在受領snapshot

R53で固定するcurrent received snapshot refsは次です。

```json
{
  "premise_zip_ref": "Cocolon_前提資料(245).zip",
  "implemented_materials_zip_ref": "EmlisAIの実装済み資料(75).zip",
  "rn_zip_ref": "Cocolon(248).zip",
  "backend_zip_ref": "mashos-api(161).zip",
  "roadmap_ref": "Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(6).md",
  "pre_design_memo_ref": "Cocolon_EmlisAI_P7_R53Candidate_R51ActualLocalReview_PreDesignMemo_20260621(1).md",
  "detailed_design_ref": "Cocolon_EmlisAI_P7_R53_R51ActualLocalReviewExecutionEvidenceMaterialization_DetailedDesign_ImplementationOrder_20260621.md"
}
```

### 4.3 R53で採用する既存R51境界

R51 helper上の明示許可境界:

```text
env var:
  COCOLON_EMLIS_P7_R51_ALLOW_ACTUAL_LOCAL_MANUAL_RUN

allow token:
  LOCAL_ONLY_ACTUAL_REVIEW_CONFIRMED
```

R47 local root境界:

```text
env var:
  COCOLON_EMLIS_LOCAL_REVIEW_ROOT

storage root ref:
  external_local_review_root
```

R47 retention:

```text
body-full packet retention max:
  72 hours

reviewer notes retention after rating finalized max:
  24 hours

delete triggers:
  - rating_rows_finalized
  - blocker_rows_finalized
  - review_session_cancelled
  - retention_deadline_reached
```

R53では、body-full local materialを扱う前に、必ず以下を満たす必要があります。

```text
- local review root configured
- local review root valid
- explicit allow token present
- purge plan ready
- export denylist violation 0
- R49 split green evidence present, or actual review generation is blocked
- R49 wildcard timeout is visible and not claimed as green
```

---

## 5. R53のno-touch境界

### 5.1 変更禁止

R53では以下を変更しません。

```text
API:
  /emotion/submit route
  public response top-level key
  input_feedback contract

DB:
  physical table name
  migration
  write path
  user history persistence

RN:
  InputScreen
  useInputFeedbackModal
  inputFeedbackModel
  InputFeedbackReplyModal
  observation_status == passed && comment_text non-empty 表示条件

Runtime:
  emlis_ai_reply_service.py runtime flow
  User Label Connection runtime
  Gate threshold
  Surface composer
  public meta sanitizer

P8:
  観測補助問いのAPI
  観測補助問いのDB schema
  観測補助問いのRN UI
  response key
  trigger logic
  answer persistence
  plan guard
```

### 5.2 R53で触ってよい候補

実装段階で触る候補は以下です。最終的な実ファイル化は、実装時に既存配置・import循環・test構成を見て判断します。

```text
追加候補:
  mashos-api/ai/services/ai_inference/emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization.py

追加候補test:
  mashos-api/ai/tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_r0_r3_20260621.py
  mashos-api/ai/tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_r4_r8_20260621.py
  mashos-api/ai/tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_r9_r15_20260621.py
  mashos-api/ai/tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_r16_r21_20260621.py
  mashos-api/ai/tests/test_emlis_ai_p7_r53_no_body_leak_no_touch_boundary_20260621.py

追加候補doc:
  EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R53_R51ActualLocalReviewExecutionEvidenceMaterialization_DetailedDesign_ImplementationOrder_20260621.md
```

### 5.3 R53で成果物化してよいもの

```text
- body-free current snapshot refreeze
- body-free R51/R52 source ref delta row
- body-free preflight result
- body-free controller manifest
- body-free reviewer-facing case index
- body-free rating rows
- body-free readfeel blocker rows
- body-free execution blocker rows
- body-free question need observation rows
- body-free post-review summary
- body-free disposal receipt
- body-free no-body-leak/no-touch validation
- body-free R52 re-intake handoff material
```

### 5.4 成果物化してはいけないもの

```text
- raw input
- raw answer
- comment_text body
- returned Emlis surface
- bounded owned history surface
- current input review surface
- reviewer free text
- reviewer notes
- question text
- draft question text
- local absolute path
- body content hash
- packet content hash
- terminal output
- stdout / stderr / traceback
- body-full packet
- reviewer form body-full
```

---

## 6. 24-case actual review設計

### 6.1 case distribution

R53で扱うcase数は、R50/R51と同じく24件です。  
R48 first formal distributionを継承します。

```text
history_line_eligible_input:                 4 / positive_history_line
standard_state_answer_owned_history:          4 / positive_owned_history
self_understanding_owned_history:             3 / positive_owned_history
uncertainty_support_owned_history:            3 / positive_owned_history
change_future_intention_owned_history:        3 / positive_owned_history
relationship_gratitude_recovery_owned_history:3 / positive_owned_history
low_information_history_not_eligible:         2 / boundary_no_history_line
free_tier_history_present_not_allowed:        2 / boundary_no_history_line
```

このdistributionの意味:

```text
- 履歴線が自然に出るべきpositive casesを見る。
- low informationでは履歴深読みが出ていないかを見る。
- Free tierでは履歴線が出ていないかを見る。
- P5が「出せる時だけ出す」境界を守れているかを見る。
```

### 6.2 reviewer blind policy

reviewerへ見せるのは、原則として次です。

```text
見せる:
  - blind_case_id
  - current input review surface
  - returned Emlis surface
  - bounded owned history review surface
  - rating form
  - question need observation selection form
  - disposal reminder

見せない:
  - family
  - subscription tier
  - expected result
  - gate result
  - db record id
  - raw user id
  - case_ref_id
  - controller expected result
  - P5 confirmed条件
  - P8 material candidate条件
```

ただし、controller manifestにはfamily / tier / expected boundaryをbody-free identifierとして保持してよいです。  
reviewer-facing indexには出しません。

### 6.3 reviewerが評価するP5軸

R53では、P5履歴線の読感を次の6軸で評価します。

```json
{
  "history_connection_naturalness": 0.90,
  "creepy_absence": 0.95,
  "overclaim_absence": 0.95,
  "self_blame_non_amplification": 0.95,
  "wants_more_input_or_accumulation": 0.85,
  "non_shallow_repeat": 0.90
}
```

数値は必要ですが、数値だけで商品合格扱いしません。  
必ず以下の読みを中心に置きます。

```text
ユーザーが「自分の記録が線として返ってきた」と感じるか。
ただし、監視・決めつけ・過剰読解・自己責め増幅になっていないか。
```

### 6.4 verdict

```text
PASS:
  P5履歴線が自然で、creepy / overclaim / self blame / shallow repeatがない。

YELLOW:
  致命的ではないが、商品体験として弱い、温度が合わない、汎用説明に見える。

REPAIR_REQUIRED:
  P5 surface / Emlis readfeel / Gate boundary の修正へ戻す必要がある。

RED:
  creepy、overclaim、self blame amplification、Free tier履歴漏れ、低情報履歴深読み、現在入力上書きなど。
```

---

## 7. question need observation memo設計

### 7.1 目的

R53では観測補助問いを実装しません。  
ただし、P8で勘の設計をしないために、各caseへbody-freeの問い必要性観察メモを残します。

記録する観点:

```text
- 問いなしで十分観測できたか。
- 問いがあれば補完リスクを下げられたか。
- 問いを出すと入力直後の観測体験を重くしないか。
- 1問で足りる曖昧さか。
- 問いではなくEmlis本体/P5/Gateを直すべきか。
- Plus向け1問候補か、Premium深掘り候補か。
```

### 7.2 primary class

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

### 7.3 ambiguity kind

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

### 7.4 one question fit

```text
not_needed
fits_one_question
needs_more_than_one_question_not_p7
would_delay_immediate_observation
unsafe_or_boundary_not_question
repair_required_not_question
insufficient_material
```

### 7.5 禁止

```text
- question textを確定しない。
- draft question textを保存しない。
- P8 API / DB / RN UI / response key / trigger logic / plan guardを決めない。
- P5の読感不足を質問不足へ転嫁しない。
- raw input / raw answer / comment_text body / reviewer free textを成果物へ出さない。
```

---

## 8. R53実装順

R53は、R51の既存contractを最大限再利用しつつ、今回受領snapshotとactual evidence materializationを追加する工程として設計します。

### R53-0: scope / current received snapshot refreeze

目的:

```text
今回受領zipを、R53のactual review基準として固定する。
R51 helper / R52 helperの古いsource refsと混同しない。
```

実装候補:

```text
P7_R53_CURRENT_RECEIVED_SNAPSHOT_REFS
P7_R53_CURRENT_RECEIVED_SNAPSHOT_REFREEZE_SCHEMA_VERSION
build_p7_r53_current_received_snapshot_refreeze()
assert_p7_r53_current_received_snapshot_refreeze_contract()
```

成功条件:

```text
- current refsが premise(245) / docs(75) / Cocolon(248) / mashos-api(161) / roadmap(6) を指す。
- GitHub check required false。
- API / DB / RN / runtime / P8 / release flagsはすべてfalse。
```

blocker:

```text
- current refsが古い。
- R51/R52 helper refsを今回受領refsとして扱っている。
```

### R53-1: R51/R52 helper source delta freeze

目的:

```text
R51 helper source refs、R52 helper current received refs、R53 current received refsを並べ、
古いrefsをactual review根拠にしないことをbody-freeで固定する。
```

実装候補:

```text
build_p7_r53_r51_r52_source_delta_freeze()
assert_p7_r53_r51_r52_source_delta_freeze_contract()
```

出力:

```json
{
  "schema_version": "cocolon.emlis.p7_r53.r51_r52_source_delta_freeze.bodyfree.v1",
  "r51_helper_refs_are_current_received_refs": false,
  "r52_helper_refs_are_current_received_refs": false,
  "r53_current_received_refs_frozen": true,
  "old_refs_allowed_as_actual_review_basis": false,
  "r51_builder_snapshot_override_required": true,
  "body_free": true
}
```

### R53-2: R49 timeout / validation evidence preflight

目的:

```text
R49 wildcard timeoutをgreen扱いせず、actual review前のpreflightとしてR49 split green evidenceを要求する。
```

実装候補:

```text
build_p7_r53_validation_evidence_r49_timeout_preflight()
assert_p7_r53_validation_evidence_r49_timeout_preflight_contract()
```

R49 split再確認候補:

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r0_r1_20260619.py \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r2_r3_20260619.py \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r4_r5_20260619.py \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r6_r7_20260619.py \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r8_r9_20260619.py \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r10_r11_20260619.py \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r12_r13_20260619.py \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r14_r15_20260619.py \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r16_r17_20260619.py \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r18_20260619.py
```

成功条件:

```text
- required evidence groups are present。
- R49 split matrix green evidence present。
- R49 wildcard bulk timeout_unclassified remains visible。
- R49 wildcard green claim allowed false。
- backend collect-only is not claimed as full backend green。
```

blocker:

```text
- r53_missing_r49_split_green_evidence
- r53_r49_wildcard_timeout_misclaimed_as_green
- r53_missing_r50_r51_r52_target_green_evidence
- r53_missing_rn_contract_green_evidence
```

### R53-3: R51 R0/R1 adoption with current snapshot override

目的:

```text
既存R51 helperを使う場合でも、R51_SOURCE_SNAPSHOT_REFSの古い定数をそのまま根拠にしない。
R51 builderへR53 current refsをsnapshot_refs overrideとして渡す。
```

実装候補:

```python
build_p7_r51_current_source_r50_handoff_refreeze(
    snapshot_refs=P7_R53_CURRENT_RECEIVED_SNAPSHOT_REFS,
    review_session_id=P7_R53_DEFAULT_REVIEW_SESSION_ID,
)

build_p7_r51_validation_evidence_r49_timeout_handling_freeze(
    current_source_r50_handoff_refreeze=r51_r0,
    validation_evidence_overrides=r53_validation_overrides,
)
```

成功条件:

```text
- R51 R0 source_snapshot_refsがR53 current refsで上書きされる。
- R51 R1 validation_evidence_ready_for_r51_2_preflight true。
- actual review / body-full generation flagsはまだfalse。
```

### R53-4: explicit allow / local root / purge plan preflight

目的:

```text
body-full local-only packet生成前に、明示許可、local root、purge planを必須化する。
```

必要な入力:

```text
COCOLON_EMLIS_LOCAL_REVIEW_ROOT
COCOLON_EMLIS_P7_R51_ALLOW_ACTUAL_LOCAL_MANUAL_RUN=LOCAL_ONLY_ACTUAL_REVIEW_CONFIRMED
purge_plan body-free object
```

実装候補:

```python
build_p7_r51_default_local_only_purge_plan_bodyfree()
build_p7_r51_local_root_explicit_allow_purge_plan_preflight(
    validation_evidence_r49_timeout_handling_freeze=r51_r1,
    local_review_root=local_review_root,
    repo_roots=[...],
    export_roots=[...],
    explicit_allow_token=explicit_allow_token,
    purge_plan=purge_plan,
)
```

成功条件:

```text
- preflight_status == PASSED
- local_review_root_valid true
- explicit_allow_present true
- purge_plan_ready true
- body_full_packet_export_allowed false
- reviewer_notes_export_allowed false
- body_full_packet_zip_inclusion_allowed false
- local_only_body_full_generation_allowed true
```

blocker:

```text
- r53_local_review_root_missing
- r53_local_review_root_invalid
- r53_explicit_allow_missing
- r53_disposal_plan_missing
- r53_export_denylist_violation
```

### R53-5: actual review session envelope

目的:

```text
local-only actual review sessionのcontroller materialをbody-freeで作る。
reviewerへ渡すbody-full内容はここでは成果物化しない。
```

実装候補:

```python
build_p7_r51_actual_review_session_envelope_bodyfree(
    local_root_explicit_allow_purge_plan_preflight=r51_r2,
    snapshot_refs=P7_R53_CURRENT_RECEIVED_SNAPSHOT_REFS,
    reviewer_ref="pseudonymous_reviewer_r53_local_manual_run"
)
```

成功条件:

```text
- envelope_status == READY_FOR_24_CASE_MANIFEST_FREEZE
- reviewer_ref_pseudonymous true
- reviewer blind policy true
- body_full_generation_allowed true
- local_absolute_path_included false
```

### R53-6: 24-case manifest freeze

目的:

```text
R48 case matrixを継承し、controller manifestとreviewer-facing case indexを分離する。
```

成功条件:

```text
- case_count == 24
- blind_case_ids_unique true
- case_ref_ids_unique true
- blind_case_id_case_ref_separated true
- reviewer receives blind_case_id only
- reviewer-facing family/tier/expected result exposed false
```

blocker:

```text
- r53_case_manifest_incomplete
- r53_blind_case_id_case_ref_boundary_violation
- r53_reviewer_facing_manifest_leak_detected
```

### R53-7: local-only body-full packet generation request and optional writer

目的:

```text
body-full packetsをlocal-onlyで生成するためのrequestを作る。
実装段階でwriterを置く場合も、実行にはexplicit allow / local root / purge planが必須。
```

既存R51は、generation requestを作るが実ファイルを書かない設計です。  
R53ではactual reviewを進めるため、実装段階で次のどちらかを選びます。

```text
A. R53 writerなし:
   R51 R5 requestだけ作り、外部local packet生成はmanualに委ねる。
   ただし実レビュー証拠materializationは進まない可能性が高い。

B. R53 local-only writerあり:
   明示許可とlocal rootが揃った場合だけ、local root配下へbody-full packetを生成する。
   writer自体はpublic/runtimeから呼ばれない。
   成果物zip・前提資料・実装済み資料・public metaへbody-fullを混ぜない。
```

華恋の推奨は **B** です。  
理由は、R51 helperは器として完成していますが、actual reviewを本当に進めるにはbody-full packetを読む必要があるためです。  
ただしBを採用する場合、writerの入口はlocal-only明示許可で強く閉じます。

writer採用時のlocal-only layout案:

```text
$COCOLON_EMLIS_LOCAL_REVIEW_ROOT/
  p7_r53/{review_session_id}/
    controller_manifest.bodyfree.json
    reviewer_case_index.bodyfree.json
    body_full_packets.local_only/
      {blind_case_id}.local_review_packet.json
    reviewer_forms.local_only/
      {blind_case_id}.reviewer_form.json
    reviewer_notes.local_only/
      {blind_case_id}.reviewer_notes.json
    body_free_results/
      rating_rows.bodyfree.jsonl
      question_need_observation_rows.bodyfree.jsonl
      readfeel_blocker_rows.bodyfree.jsonl
      execution_blocker_rows.bodyfree.jsonl
      post_review_summary.bodyfree.json
      disposal_receipt.bodyfree.json
    audit.bodyfree/
      export_denylist_check.bodyfree.json
      no_body_leak_validation.bodyfree.json
```

成功条件:

```text
- local root外へ書かない。
- repo / docs / tests / services / premise / implemented docs / artifact export pathへ書かない。
- body-full packet pathは成果物に出さない。
- body content hashを保存しない。
- writer実行後、R53-8以降でcompletion scanとpurgeが必須。
```

### R53-8: packet completeness / export denylist scan

目的:

```text
local-only body-full packetsが24件揃っているかをbody-freeで確認する。
body-full内容、path、hashは出さない。
```

成功条件:

```text
- all_required_packets_present true
- all_required_fields_present true
- all_local_only_markers_present true
- all_must_not_export_markers_present true
- all_disposal_required_markers_present true
- body_full_packet_export_violation_detected false
- packet_body_included_here false
- local_absolute_path_included false
- body_content_hash_stored_here false
```

### R53-9: reviewer instruction / rating form freeze

目的:

```text
reviewerが何を見るか、どの評価軸で読むか、question need observationをどう選ぶかを固定する。
```

成功条件:

```text
- rating_axis_refsがP5の6軸と一致。
- rating_score_min/maxが固定。
- machine auto score allowed false。
- question need observation selection required true。
- question text required false。
- draft question text allowed false。
- reviewer free textはlocal-only、body-free export不可。
- P5 weakness must not be hidden by question candidate true。
```

### R53-10: actual human review result capture

目的:

```text
reviewerが24件を読み、body-full内容を含まないsanitized selectionsだけを取り込む。
```

取り込むもの:

```text
- blind_case_id
- axis_scores
- verdict
- sanitized_reason_ids
- blocker_ids
- question_need_primary_class
- ambiguity_kind_refs
- one_question_fit_ref
- repair_required_refs
```

取り込まないもの:

```text
- raw input
- returned Emlis surface
- owned history body
- reviewer free text
- question text
- local path
- body hash
```

成功条件:

```text
- all_24_cases_reviewed true
- rating selections captured body-free true
- question need observation selections captured body-free true
- raw_input_or_returned_surface_included false
- reviewer_free_text_included false
- question_text_included false
- machine_auto_score_used false
```

### R53-11: rating row normalization

目的:

```text
R53-10のcapture rowsを、R51互換のbody-free rating rowsへ正規化する。
```

成功条件:

```text
- rating_row_count == 24
- all_required_rating_rows_present true
- rating_case_ref_sets_match_review_capture true
- pass requires targets and no blockers
- red_or_repair_requires_blocker true
- body_free true
```

### R53-12: readfeel blocker / execution blocker ingestion

目的:

```text
商品読感blockerと実行blockerを分ける。
```

readfeel blocker例:

```text
- p5_history_creepy_or_surveillance_feeling
- p5_history_scope_overclaim
- p5_history_line_self_blame_amplification
- p5_free_tier_history_boundary_violation
- p5_low_information_history_overread
- p5_current_input_overridden_by_history
- p5_boundary_history_line_leak_suspected
```

execution blocker例:

```text
- missing rating rows
- missing question observation rows
- disposal receipt missing
- body-free leak detected
- manifest incomplete
- packet completeness scan failed
```

成功条件:

```text
- readfeel blocker rows body-free
- execution blocker rows body-free
- readfeel blockerをexecution blockerとして誤分類しない
- execution blockerがある場合はP5 confirmed candidateへ進めない
```

### R53-13: question need observation row normalization

目的:

```text
P7/P8 Bridgeの問い必要性観察メモを、24件分body-freeで正規化する。
```

成功条件:

```text
- question_observation_row_count == 24
- question text absent true
- draft question text absent true
- raw input absent true
- returned surface absent true
- reviewer free text absent true
- primary class / ambiguity / one question fit がcanonical refs
```

### R53-14: rating/question consistency guard

目的:

```text
P5の弱さをquestion candidateへ逃がしていないかを検査する。
```

blocker例:

```text
- PASS ratingなのに not_question_repair が付いている。
- RED / REPAIR_REQUIREDをplus/premium question candidateへ逃がしている。
- creepy / overclaim / current input override をquestion candidateとして扱っている。
- insufficient materialなのにexecution blockerがない。
- rating rowとquestion rowのcase setが一致しない。
```

成功条件:

```text
- rating_question_consistency_guard_ready true
- issue count 0
- P5 weakness not hidden by question candidates true
```

### R53-15: pause / abort / expiration protocol

目的:

```text
レビュー中断時もbody-full packet / notesを保持しっぱなしにしない。
```

action:

```text
CONTINUE_TO_R51_14_PURGE
PAUSE_LOCAL_ONLY_REVIEW
ABORT_LOCAL_ONLY_REVIEW
EXPIRE_LOCAL_ONLY_REVIEW
```

成功条件:

```text
- review completedならpurgeへ進む。
- pauseでもretention deadlineが明確。
- abort / expireならpurge required。
```

### R53-16: purge / disposal receipt

目的:

```text
body-full packet / reviewer form / reviewer notesを廃棄し、body-free receiptだけを残す。
```

成功条件:

```text
- body_full_packets removed and verified
- reviewer_forms removed and verified
- reviewer_notes removed and verified
- body_removed true
- reviewer_notes_removed true
- local_packet_exported false
- content_hash_of_body_stored false
- disposal_receipt body-free
```

この工程が完了しない限り、次へ進めません。

```text
- P5 confirmed candidate不可
- P5 repair return candidate不可
- P6 candidate不可
- P8 material candidate不可
```

### R53-17: body-free post-review summary

目的:

```text
実レビューの結果を、body-free counts / refs / booleansだけに集約する。
```

集約するもの:

```text
- verdict counts
- axis score averages
- axis target met / missed refs
- readfeel blocker counts
- execution blocker counts
- question primary class counts
- ambiguity kind counts
- one question fit counts
- repair required counts
- red / repair / yellow / pass count
- disposal status
```

含めないもの:

```text
- raw input
- returned surface
- comment_text
- reviewer free text
- question text
- local path
- body hash
```

### R53-18: P5 decision candidate separation

目的:

```text
P5 confirmed candidate / P5 repair return / P5 inconclusive を分離する。
```

confirmed candidate条件:

```text
- 24件全review済み
- rating rows 24件 complete
- question observation rows 24件 complete
- rating/question case sets match
- disposal verified
- body removed
- reviewer notes removed
- open execution blocker 0
- pass_count == 24
- all_axis_targets_met true
- red_count == 0
- repair_required_count == 0
- yellow_count == 0
- critical repair blocker 0
- repair observation count 0
```

repair return条件:

```text
- REDあり
- REPAIR_REQUIREDあり
- critical repair blockerあり
- axis target missedあり
- readfeel blockerあり
- not_question_*_repair_required observationあり
```

inconclusive条件:

```text
- summary incomplete
- disposal未検証
- execution blocker open
- yellowあり
- case set mismatch
- rating/question rows不足
```

重要:

```text
P5 confirmed candidate は final ではない。
P5 repair return は失敗ではなく、P5を直すための戻り材料である。
P5 inconclusive は無理に良し悪しを決めないための保留である。
```

### R53-19: P6 limited human readfeel candidate handoff

目的:

```text
P5がconfirmed candidateになった場合だけ、P6 limited human readfeel candidateをbody-freeで作る。
```

成功条件:

```text
- p5_human_blind_qa_confirmed_candidate true
- p5 repair/inconclusive false
- disposal verified
- rows complete
- open blockers 0
- all axis targets met
- yellow/red/repair 0
- repair observations 0
- critical blockers 0
```

ただし:

```text
p6_limited_human_readfeel_start_allowed = false
```

### R53-20: P8 question design material candidate handoff

目的:

```text
P7/P8 Bridgeの問い必要性観察メモを、P8開始時の材料候補としてbody-free countsだけで渡す。
```

candidate ready条件:

```text
- p5 confirmed candidate true
- p5 repair/inconclusive false
- p6 candidate handoff ready
- question observation rows 24件 complete
- question primary / ambiguity / one question / repair counts available
- repair_required_not_question がP8 materialへ混ざっていない
- disposal and body-free boundary clean
```

ただし:

```text
p8_question_design_material_candidate = true の可能性はある
p8_start_allowed = false のまま
P8 detail design started = false のまま
question implementation spec finalized = false のまま
```

### R53-21: final no-body-leak / no-question-text / no-touch validation and R52 re-intake handoff

目的:

```text
R53が作ったbody-free evidenceをR52へ再投入できる状態にする。
```

成功条件:

```text
- no raw input
- no raw answer
- no comment_text body
- no returned surface
- no owned history body
- no reviewer free text
- no reviewer notes
- no question text
- no draft question text
- no local path
- no body hash
- API / DB / RN / response key / runtime no-touch
- P8 start false
- P7 complete false
- release_allowed false
```

R52再投入の意味:

```text
R53後にR52相当のdecision gateを再度通す。
R52がP6/P8へのcandidate separationを読む。
ただし、R52が通ってもP8 start allowedへ自動変換しない。
```

---

## 9. JSON / schema案

この章のJSON / schemaは、実装時に使う案です。  
実ファイル化するかどうか、どのファイルに置くか、既存R51 schema/constantsへ寄せるか、新規R53 constantsへ置くかは、実装段階で現物コード・既存Guard・test構成を見て判断します。

### 9.1 R53 current snapshot refreeze body-free schema案

```json
{
  "schema_version": "cocolon.emlis.p7_r53.current_received_snapshot_refreeze.bodyfree.v1",
  "phase": "P7",
  "step": "R53_R51ActualLocalReviewExecutionEvidenceMaterialization_20260621",
  "scope": "r51_actual_local_review_execution_evidence_materialization",
  "policy_kind": "r51_actual_local_review_execution_evidence_materialization_policy",
  "source_mode": "local_snapshot",
  "git_connection_required": false,
  "git_checked": false,
  "current_received_snapshot_refs": {
    "premise_zip_ref": "Cocolon_前提資料(245).zip",
    "implemented_materials_zip_ref": "EmlisAIの実装済み資料(75).zip",
    "rn_zip_ref": "Cocolon(248).zip",
    "backend_zip_ref": "mashos-api(161).zip",
    "roadmap_ref": "Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(6).md",
    "pre_design_memo_ref": "Cocolon_EmlisAI_P7_R53Candidate_R51ActualLocalReview_PreDesignMemo_20260621(1).md",
    "detailed_design_ref": "Cocolon_EmlisAI_P7_R53_R51ActualLocalReviewExecutionEvidenceMaterialization_DetailedDesign_ImplementationOrder_20260621.md"
  },
  "r51_helper_source_refs_are_current": false,
  "r52_helper_source_refs_are_current": false,
  "r51_builder_snapshot_override_required": true,
  "api_db_rn_response_key_changed_here": false,
  "runtime_changed_here": false,
  "p8_start_allowed": false,
  "p7_complete": false,
  "release_allowed": false,
  "body_free": true
}
```

### 9.2 local-only body-full packet schema案

このschemaはbody-full local-onlyです。  
成果物・public meta・docs・patch zipへ出してはいけません。

```json
{
  "schema_version": "cocolon.emlis.p7_r53.body_full_reviewer_packet.local_only.v1",
  "review_session_id": "p7_r53_r51_actual_local_review_session",
  "blind_case_id": "B001",
  "packet_ref_id": "packet_B001",
  "review_kind": "p5_human_blind_qa_actual_local_only_manual_review",
  "review_prompt_version": "p7_r53_p5_human_blind_qa_actual_review_prompt_v1",
  "local_only": true,
  "must_not_export": true,
  "disposal_required": true,
  "current_input_review_surface": "<body-full local only>",
  "returned_emlis_surface": "<body-full local only>",
  "bounded_owned_history_review_surface": "<body-full local only or null>",
  "reviewer_rating_form": {
    "axis_score_min": 0.0,
    "axis_score_max": 1.0,
    "axes": [
      "history_connection_naturalness",
      "creepy_absence",
      "overclaim_absence",
      "self_blame_non_amplification",
      "wants_more_input_or_accumulation",
      "non_shallow_repeat"
    ],
    "verdict_refs": ["PASS", "YELLOW", "REPAIR_REQUIRED", "RED"],
    "machine_auto_score_allowed": false
  },
  "question_need_observation_selection_form": {
    "question_text_required": false,
    "draft_question_text_allowed": false,
    "primary_class_required": true,
    "ambiguity_kind_refs_required": true,
    "one_question_fit_ref_required": true,
    "repair_required_refs_required": true
  },
  "disposal_reminder": {
    "purge_required": true,
    "body_full_packet_retention_max_hours": 72,
    "reviewer_notes_retention_after_rating_finalized_max_hours": 24
  }
}
```

### 9.3 sanitized review capture row schema案

```json
{
  "schema_version": "cocolon.emlis.p7_r53.actual_review_capture_row.bodyfree.v1",
  "review_session_id": "p7_r53_r51_actual_local_review_session",
  "blind_case_id": "B001",
  "case_ref_id": "case_ref_controller_only",
  "packet_ref_id": "packet_B001",
  "family": "history_line_eligible_input",
  "case_role": "positive_history_line",
  "reviewer_ref": "pseudonymous_reviewer_r53_local_manual_run",
  "reviewed_at_ref": "local_review_time_ref_only",
  "axis_scores": {
    "history_connection_naturalness": 0.0,
    "creepy_absence": 0.0,
    "overclaim_absence": 0.0,
    "self_blame_non_amplification": 0.0,
    "wants_more_input_or_accumulation": 0.0,
    "non_shallow_repeat": 0.0
  },
  "verdict": "PASS",
  "sanitized_reason_ids": [],
  "blocker_ids": [],
  "question_need_primary_class": "no_question_needed_emlis_can_observe",
  "ambiguity_kind_refs": ["no_material_ambiguity"],
  "one_question_fit_ref": "not_needed",
  "repair_required_refs": ["no_repair_required"],
  "reviewer_free_text_included": false,
  "question_text_included": false,
  "draft_question_text_included": false,
  "machine_auto_score_used": false,
  "raw_input_or_returned_surface_included": false,
  "local_absolute_path_included": false,
  "body_hash_included": false,
  "body_removed": false,
  "body_free": true
}
```

### 9.4 question need observation row schema案

```json
{
  "schema_version": "cocolon.emlis.p7_r53.question_need_observation_row.bodyfree.v1",
  "review_session_id": "p7_r53_r51_actual_local_review_session",
  "blind_case_id": "B001",
  "case_ref_id": "case_ref_controller_only",
  "question_need_primary_class": "question_may_reduce_overread_risk",
  "ambiguity_kind_refs": ["missing_relation_context"],
  "one_question_fit_ref": "fits_one_question",
  "repair_required_refs": ["no_repair_required"],
  "plan_candidate_flags": {
    "plus_single_question_candidate_later": true,
    "premium_deep_dive_candidate_later": false,
    "not_question_repair_required": false
  },
  "question_text_absent": true,
  "draft_question_text_absent": true,
  "raw_input_absent": true,
  "returned_surface_absent": true,
  "reviewer_free_text_absent": true,
  "local_path_absent": true,
  "body_hash_absent": true,
  "body_free": true
}
```

### 9.5 disposal receipt schema案

```json
{
  "schema_version": "cocolon.emlis.p7_r53.disposal_receipt.bodyfree.v1",
  "review_session_id": "p7_r53_r51_actual_local_review_session",
  "disposal_status": "DISPOSAL_VERIFIED",
  "purge_evidence_rows": [
    {
      "target_ref": "body_full_packets.local_only",
      "status_ref": "REMOVED_AND_VERIFIED",
      "local_absolute_path_included": false,
      "content_hash_stored": false,
      "body_free": true
    },
    {
      "target_ref": "reviewer_forms.local_only",
      "status_ref": "REMOVED_AND_VERIFIED",
      "local_absolute_path_included": false,
      "content_hash_stored": false,
      "body_free": true
    },
    {
      "target_ref": "reviewer_notes.local_only",
      "status_ref": "REMOVED_AND_VERIFIED",
      "local_absolute_path_included": false,
      "content_hash_stored": false,
      "body_free": true
    }
  ],
  "body_removed": true,
  "reviewer_forms_removed": true,
  "reviewer_notes_removed": true,
  "local_packet_exported": false,
  "content_hash_of_body_stored": false,
  "disposal_receipt_materialized_here": true,
  "body_free": true
}
```

### 9.6 R52 re-intake handoff schema案

```json
{
  "schema_version": "cocolon.emlis.p7_r53.r52_reintake_handoff.bodyfree.v1",
  "review_session_id": "p7_r53_r51_actual_local_review_session",
  "r53_current_snapshot_refrozen": true,
  "r51_actual_review_evidence_complete": true,
  "r51_bodyfree_handoff_components": [
    "post_review_summary",
    "p5_confirmed_repair_return_inconclusive_decision",
    "p6_limited_human_readfeel_candidate_handoff",
    "p8_question_design_material_candidate_handoff",
    "no_body_leak_no_question_text_no_touch_boundary_validation"
  ],
  "p5_human_blind_qa_confirmed_candidate": false,
  "p5_repair_return_candidate": false,
  "p5_review_inconclusive": true,
  "p6_limited_human_readfeel_start_allowed_candidate": false,
  "p6_limited_human_readfeel_start_allowed": false,
  "p8_question_design_material_candidate": false,
  "p8_start_allowed": false,
  "p7_complete": false,
  "release_allowed": false,
  "api_db_rn_response_key_changed_here": false,
  "runtime_changed_here": false,
  "question_implementation_started_here": false,
  "body_free": true
}
```

---

## 10. validation / test設計

### 10.1 R53 target tests

R53実装時は、少なくとも次のtestを作ります。

```text
r0_r3:
  - current received snapshot refreeze
  - R51/R52 source delta freeze
  - R49 timeout preflight
  - R51 R0/R1 current snapshot override

r4_r8:
  - explicit allow / local root / purge plan preflight
  - session envelope
  - 24-case manifest
  - local-only packet generation request
  - packet completeness/export denylist scan

r9_r15:
  - reviewer instruction/rating form
  - actual review capture row sanitizer
  - rating row normalizer
  - readfeel/execution blocker ingestion
  - question need observation normalizer
  - rating/question consistency guard
  - pause/abort/expiration protocol

r16_r21:
  - purge/disposal receipt
  - post-review summary
  - P5 decision separation
  - P6 candidate handoff
  - P8 material candidate handoff
  - R52 re-intake handoff

no_body_leak_no_touch:
  - forbidden key deep scan
  - no raw input / raw answer / comment_text body
  - no reviewer notes / question text / local path / body hash
  - API / DB / RN / response key / runtime no-touch
```

### 10.2 local writer tests

local writerを実装する場合、testではbody-full実データを使いません。  
一時directoryとdummy textでlocal-only marker / purge / no-exportだけを確認します。

必須test:

```text
- explicit allowなしではwriterが動かない。
- local rootなしではwriterが動かない。
- repo/docs/tests/services/premise配下をlocal rootに指定できない。
- writer実行時もartifact/export pathへ出ない。
- purge後にbody-full local filesが残っていないことをbody-freeで確認できる。
- body content hashを保存しない。
```

### 10.3 regression commands

実装後に確認する候補:

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r53_r51_actual_local_review_execution_evidence_materialization_*.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_*.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r52_r51_handoff_p6_p8_start_decision_gate_*.py

PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_*.py

PYTHONPATH=services/ai_inference pytest --collect-only -q
```

RN no-touch確認候補:

```bash
cd Cocolon
npm run test:rn-screens --silent
```

R49 timeout扱い確認候補:

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r0_r1_20260619.py \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r2_r3_20260619.py \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r4_r5_20260619.py \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r6_r7_20260619.py \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r8_r9_20260619.py \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r10_r11_20260619.py \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r12_r13_20260619.py \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r14_r15_20260619.py \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r16_r17_20260619.py \
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r18_20260619.py
```

### 10.4 greenの読み方

```text
- R53 target green = R53 helper / material boundary green。
- R51/R52 target green =既存helperとの互換 green。
- RN contract green = RN no-touch green。
- collect-only = test collection greenであり、full backend greenではない。
- R49 wildcard timeout = greenではない。
- どれもP5 confirmed final / P7 complete / P8 start / release_allowedではない。
```

---

## 11. 実装時のblocker判断

### 11.1 body-full生成前blocker

```text
- current snapshot refreeze未完了
- R51/R52 source delta未記録
- R49 split green evidenceなし
- R49 wildcard timeoutをgreen扱いしている
- local root missing/invalid
- explicit allow token missing
- purge plan missing/unsafe
- export denylist violationあり
```

この場合:

```text
body-full packetを生成しない。
actual review run captured扱いにしない。
P5 confirmed / P6 candidate / P8 material candidateへ進めない。
R53 outputはBLOCKED evidenceとしてbody-freeで残す。
```

### 11.2 review後blocker

```text
- 24件未review
- rating rows incomplete
- question observation rows incomplete
- rating/question case set mismatch
- readfeel blocker unresolved
- execution blocker open
- disposal未検証
- body-full file / notesが残存
- body-free leakあり
```

この場合:

```text
P5 confirmed candidateへ進めない。
P5 repair returnまたはinconclusiveへ分離する。
P6 candidate / P8 material candidateへ進めない。
```

### 11.3 no-leak blocker

```text
- raw inputがbody-free成果物に出た
- returned Emlis surfaceが出た
- comment_text bodyが出た
- question textが出た
- reviewer free textが出た
- local pathが出た
- body hashが出た
```

この場合:

```text
即blocker。
該当成果物は採用不可。
purge / regeneration / no-leak guard修正が必要。
```

---

## 12. R53完了条件

R53を完了候補にする条件:

```text
1. current received snapshotがR53基準で固定されている。
2. R51/R52 helper refsとの差分がbody-freeで記録されている。
3. R49 timeout扱いが隠されていない。
4. explicit allow / local root / purge plan preflightが通っている、またはblockedとして正しく止まっている。
5. 24-case actual reviewがbody-free evidenceへ落ちている、またはreview前blockerが正しく記録されている。
6. rating rows / blockers / question need observation rowsがbody-freeで揃っている。
7. body-full packet / reviewer notesがpurgeされ、disposal receiptがある。
8. no-body-leak / no-question-text / no-touch validationが通っている。
9. P5 decision candidateがconfirmed / repair / inconclusiveに分離されている。
10. P6 candidate / P8 material candidate / P8 start allowedが分離されている。
11. R52 re-intake可能なbody-free handoff materialがある。
```

R53完了でも次はまだ不可:

```text
- P5 confirmed final
- P6 limited human readfeel start allowed
- P8 start allowed
- P7 complete
- release_allowed
```

---

## 13. R53後の次工程

R53後は、結果により分岐します。

### 13.1 P5 confirmed candidateの場合

```text
1. R52 re-intake decision gateへ渡す。
2. R52でdisposal / blockers / consistency / P5 readfeel blockerを再確認する。
3. R52がP6 limited human readfeel candidateを読む。
4. P6 start allowedは別途明示判断にする。
5. P8 material candidateがあっても、P8 start allowedへ自動変換しない。
```

### 13.2 P5 repair returnの場合

```text
1. repair blockerを分類する。
2. Emlis本体 / P5 surface / Gate boundary のどこへ戻すか決める。
3. P8 question designへ逃がさない。
4. 修正設計を別Rで作る。
```

### 13.3 P5 inconclusiveの場合

```text
1. inconclusive理由を分ける。
2. 実行blockerならR53/R51 local review手順を修正する。
3. review材料不足ならpacket / manifest / reviewer formを修正する。
4. 読感の揺れならadditional blind readを設計する。
```

### 13.4 P8 material candidateだけがある場合

```text
P8 start allowedにはしない。
P7/P8 Bridge materialとして保留する。
P7のP5/P6確認が完了してから、P8開始可否を再判断する。
```

---

## 14. 華恋の意見

華恋としては、R53は面倒でも必要です。

R51 helperは既にかなり細かく境界を持っています。  
でも、器があることと、ユーザーが「自分の記録が返ってきた」と感じることは別です。

今、P8観測補助問いへ進むのは、Cocolonとして危ないです。  
問い機能は後で必要になる可能性があります。けれど、P5履歴線を読まないまま問いへ進むと、Emlis本体が読めていない弱さを「質問すれば埋まる」と誤解できます。

Cocolonが今見るべきなのは、質問の賢さではありません。  
ユーザーが残した記録が、Emlisの言葉として返ったときに、またCocolonへ残したいと思えるかです。

だから、R53では実読みを避けない設計にします。  
body-fullを扱うので危険ですが、だからこそlocal-only / explicit allow / purge / body-free receiptを先に固定します。  
Cocolonを「人間の言葉を雑に処理しない場所」にするなら、この地味な実読みを飛ばしてはいけません。

---

## 15. 最終判断

```text
正式採番:
  P7-R53

正式名:
  R51 Actual Local-Only Human Review Execution Evidence Materialization

今回の実装方針:
  新規R53 helperを追加し、R51 helperを再利用しながら、今回受領snapshot基準のactual review evidence materializationを設計する。

P8開始:
  不可。

P6開始:
  不可。

P5 confirmed final:
  不可。

P7 complete:
  不可。

release_allowed:
  不可。
```

この設計書は、実装前の詳細設計です。  
コード変更、actual local review、body-full packet生成、reviewer rating記入、question need observation row実記入、purge実行、P8詳細設計開始は行っていません。
