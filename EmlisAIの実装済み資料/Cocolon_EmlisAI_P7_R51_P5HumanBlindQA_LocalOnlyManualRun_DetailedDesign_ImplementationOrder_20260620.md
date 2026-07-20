# Cocolon / EmlisAI P7-R51 P5 Human Blind QA Actual Local-Only Manual Run 詳細設計書・実装順

作成日: 2026-06-20 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown設計書  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / P5 User Label Connection / P5 Human Blind QA / Actual Local-Only Manual Run / P7-P8 Bridge Question Need Observation  
基準検討メモ: `Cocolon_EmlisAI_P7_R51_P5HumanBlindQA_LocalOnlyManualRun_PreDesignMemo_20260620.md`  
基準ロードマップ: `Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(3).md`  
基準ローカル受領zip: `Cocolon_前提資料(241).zip` / `EmlisAIの実装済み資料(73).zip` / `Cocolon(246).zip` / `mashos-api(159).zip`  
GitHub接続確認: Mash指定により不要。未実施。  
コード変更: なし。  
json / schema実ファイル化: なし。本書内のjson / schema案は、実装段階で現物コード・既存schema配置・既存Guard・既存test結果を見て採否判断する。  
body-full review packet生成: なし。  
P5 Human Blind QA実レビュー: なし。  
reviewer rating記入: なし。  
question need observation row記入: なし。  
body-full packet / reviewer notes廃棄実行: なし。  
API / DB / RN UI / public response key変更: なし。  
P8観測補助問い詳細設計: なし。  
release判断: なし。  

---

## 0. この設計書の結論

今回進める段階は、次で固定します。

```text
現在Phase:
  P7 Product Quality Runner / Long-run Product Gate

今回設計する段階:
  P7-R51
  P5 Human Blind QA Actual Local-Only Manual Run
```

R51は、R47〜R50で固定された境界を使って、**P5履歴線を実際に人間が読むためのlocal-only manual run**へ進む段階です。

ただし、R51は次ではありません。

```text
- P8観測補助問いの詳細設計ではない。
- 観測補助問いのAPI / DB / RN UI / response key / 発生ロジック / 保存schemaを作る段階ではない。
- Emlis本文runtimeやUser Label Connection runtimeを修正する段階ではない。
- P5 confirmed / P7 complete / P8 start / release allowedを先にtrue化する段階ではない。
```

R51でやることは、P5履歴線を実ケースで読み、以下をbody-freeに残すことです。

```text
1. 24-case actual reviewが実行できたか。
2. P5履歴線が「自分の記録が線として返ってきた感」になっているか。
3. creepy / overclaim / self-blame / shallow repeat がないか。
4. 問いなしで観測できるcaseと、問いがあると補完リスクを下げられそうなcaseを分けられるか。
5. 問いではなく、P5 / Emlis / Gateを修正すべきcaseを隠さず分けられるか。
6. body-full packet / reviewer notesを廃棄し、body-free receiptで確認できるか。
7. P5 confirmed candidate / P5 repair return / inconclusiveを判断できるか。
8. P6 limited human readfeel candidate と P8 question design material candidate を、開始許可ではなく候補として分けられるか。
```

華恋の判断として、R51で一番大事なのは、**「実レビューをした」という事実を作ることではなく、Cocolonの履歴線が商品体験として届いているかを、逃げずに読むこと**です。

---

## 1. なぜこの作業を行うのか

Cocolonは、ユーザーの言葉をただ保存する場所ではありません。  
Cocolonが目指す体験は、ユーザーが残した感情・カテゴリ・行動・思考・時点・過去記録が、入力直後に「読まれた形」として返ってくることです。

P5 User Label Connectionは、その中核です。

```text
現在入力だけではなく、過去に残した記録と自然につながって見える。
そのことで、Cocolonに記録を積む意味が生まれる。
```

ただし、履歴線は強いぶん危険もあります。

```text
- 監視されている感じが出る。
- 「あなたはいつも」「原因は」「性格です」へ寄る。
- 低情報入力を履歴で深読みする。
- 現在入力を履歴で上書きする。
- 自己責めを増幅する。
- 安全寄りすぎて、Cocolon固有価値ではなく汎用説明に見える。
```

自動testは、raw text leak、public response key、Gate境界、body-free制約を守るには有効です。  
でも、ユーザーが「自分の記録が返ってきた」「またここに残したい」と感じるかは、自動testだけでは確認できません。

そのためR51では、local-only / body-free境界を守ったまま、P5 24-caseを実際に読みます。

R51は、Cocolonが普通のAI相談ではなくなるための実読感確認です。  
ここを飛ばしてP8へ進むと、問い返しがP5の弱さを隠す逃げ道になります。

---

## 2. 参照・確認範囲

### 2.1 作業姿勢として確認した前提資料

```text
Cocolon_前提資料(241).zip / Cocolon_前提資料/
  - 00_karen_read_first.md
  - cocolon_thought_material_for_karen.md
  - emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
  - emlis_ai_state_answer_human_follow_definition_2026_05_26.md
  - cocolon_environment_state_output_observation_structure_design_2026_05_25.md
  - Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md
  - Cocolon_EmlisAI_NormalObservation_PublicRecovery_ImplementationStatus_2026-06-06.md
  - work_attitude_rules_for_karen/00_read_first.txt
  - work_attitude_rules_for_karen/09_work_start_checklist.txt
  - work_attitude_rules_for_karen/10_stop_judgment_and_unwritten_rules.txt
  - work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
  - work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
  - work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
```

作業姿勢として固定したこと:

```text
- Cocolonは文字列処理サービスではなく、人間情報の観測構造である。
- EmlisAIは、入力直後の観測返答であり、テンプレ共感や診断ラベルではない。
- Cocolonの主体はMashの思想と構想であり、華恋の意見は補助思想として分ける。
- 設計と実装を混ぜない。
- 前提資料だけで理解した扱いにしない。実ファイルを見る。
- 見ていないものを確認済みにしない。
- 通っていないものをgreenと言わない。
- test greenを商品価値合格へ変換しない。
- API / DB / RN表示条件 / public response key / ユーザーデータ保護を勝手に変えない。
```

### 2.2 ロードマップとして確認した資料

```text
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(3).md
```

確認した中心:

```text
- P7はProduct Quality Runner / Long-run Product Gateである。
- P7の目的は、fixture greenではなく商品品質を継続測定できる形にすること。
- P7/P8 Bridgeでは、P5 human Blind QA、P6 limited human readfeel、実機modal確認中にbody-freeの問い必要性観察メモを残す。
- P7中に観測補助問いのAPI / DB / RN UI / response key / 発生ロジック / 保存schemaを実装しない。
- P8開始時は、P7で集めた実ケースの観察メモを根拠にする。
- Emlis本体の読感不足を問い返しで補う扱いにしない。
```

### 2.3 参照した実装済み資料

```text
EmlisAIの実装済み資料(73).zip / EmlisAIの実装済み資料/
  - Cocolon_EmlisAI_P7_R47_LocalReviewPacketPolicy_DetailedDesign_ImplementationOrder_20260618.md
  - Cocolon_EmlisAI_P7_R48_P5HumanBlindQAActualReviewPacket_詳細設計書_実装順_20260618.md
  - Cocolon_EmlisAI_P7_R49_P5HumanBlindQA_QuestionNeedObservation_詳細設計書_実装順_20260619.md
  - Cocolon_EmlisAI_P7_R50_P5HumanBlindQAActualReviewManualRunDecision_詳細設計書_実装順_20260620.md
```

### 2.4 参照した現行実ファイル

```text
mashos-api(159).zip / mashos-api/ai/services/ai_inference/
  - emlis_ai_p7_r47_local_review_packet_policy.py
  - emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet.py
  - emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution.py
  - emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision.py
```

RN側no-touch確認対象:

```text
Cocolon(246).zip / Cocolon/
  - package.json
  - tests/rn-screen-contracts.test.js
  - screens/InputScreen.js
  - screens/input/useInputFeedbackModal.js
  - screens/input/inputFeedbackModel.js
  - screens/input/InputFeedbackReplyModal.js
```

---

## 3. 現在地の固定

### 3.1 R50後の現在地

現行 `emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision.py` 上で、R50は次まで実装済みとして扱います。

```text
P7_R50_R20_IMPLEMENTED_STEPS:
  R50-0〜R50-20

P7_R50_R20_NOT_YET_IMPLEMENTED_STEPS:
  empty

P7_R50_R20_NEXT_REQUIRED_STEP_REF:
  P5_human_blind_qa_actual_review_local_only_manual_run_after_R50_boundary_freeze
```

したがって、次段階はR51として設計します。

```text
P7-R51:
  P5 Human Blind QA Actual Local-Only Manual Run
```

### 3.2 ローカル確認済みtest結果の扱い

検討メモで固定した直近確認は次です。

```text
RN contract:
  36 passed

R50 target:
  99 passed

R48 target regression:
  82 passed

R47 regression:
  275 passed

R46 / display contract / P5 core subset:
  94 passed / 1 warning

backend collect-only:
  3466 tests collected / 1 warning

R49 split execution:
  76 passed

R49 wildcard一括実行:
  timeout / 原因未分類
```

読み方:

```text
- R50 target greenは、R51へ進むための境界確認である。
- R50 target greenは、P5 actual review完了ではない。
- R49 split greenは、R49契約が分割では通ることを示す。
- R49 wildcard timeoutは、full wildcard greenとは呼ばない。
- collect-onlyはfull backend suite greenではない。
- RN contract greenは実機modal読感確認ではない。
```

### 3.3 R49 wildcard timeoutのR51での扱い

R51では、R49 wildcard timeoutを隠しません。

```text
r49_wildcard_bulk_timeout_unclassified: true
r49_split_matrix_green_required_for_R51: true
r49_wildcard_green_claim_allowed: false
```

R51開始前precheckでの扱い:

```text
- R49 split matrixがgreenなら、R51 actual local-only manual runのGO判定には進める。
- ただし、R49 wildcard一括実行をgreenとは書かない。
- split matrixが失敗した場合はNO_GO_TARGET_OR_REGRESSION_EVIDENCE_MISSINGへ戻す。
- R49 wildcard timeoutはP5 readfeel blockerではなく、validation evidence note / execution evidence uncertaintyとして扱う。
```

---

## 4. R51の対象と非対象

### 4.1 R51で扱う対象

```text
1. R50 handoff / local snapshot / validation evidenceの再固定。
2. R49 wildcard timeoutを未分類のまま隠さず、R49 split matrixで確認する手順。
3. actual local-only manual runのGO / NO_GO / BLOCKED判定。
4. local-only review root / explicit allow / export denylist / purge planの確認。
5. 24-case first formal reviewのactual session envelope作成。
6. local-only body-full reviewer packet生成手順。
7. reviewerが読むfield / 読まないfieldの固定。
8. 6軸rating / verdict / readfeel blocker記入手順。
9. question need observation row記入手順。
10. readfeel blockerとexecution blockerの分離。
11. rating rowとquestion observation rowの整合guard。
12. pause / abort / expiration時のpurge手順。
13. body-full packet / reviewer notesの廃棄手順。
14. body-free disposal receipt作成手順。
15. body-free post-review summary作成手順。
16. P5 confirmed candidate / P5 repair return / inconclusiveの分岐。
17. P6 limited human readfeel candidate handoff。
18. P8 question design material candidate handoff。
19. no body leak / no question text / no local path / no hash scan。
20. R51結果のbody-free handoff material化。
```

### 4.2 R51で扱わない対象

```text
- P8観測補助問いの詳細設計。
- 観測補助問いAPI設計。
- DB migration / DB schema。
- RN UI設計。
- public response key追加。
- 問い発生ロジック。
- 問い回答保存schema。
- Emlis本文runtime変更。
- User Label Connection runtime変更。
- Gate threshold変更。
- RN表示条件変更。
- DB write path変更。
- public meta仕様変更。
- release_allowed true化。
- P8 start allowed true化。
- P7 complete true化。
- full backend suite greenの代替主張。
- body-full packetを成果物・前提資料・実装済み資料・release materialへ混ぜること。
```

---

## 5. R51の基本設計

### 5.1 R51で扱う八層

R51では、同じreview sessionの中に八層を持ちます。

```text
Layer A: admission / evidence layer / body-free
  R50 handoff、test evidence、R49 timeout扱い、local root、explicit allow、purge planを確認する。

Layer B: local-only body-full packet layer / local-only
  reviewerが読むための現在入力surface、返答surface、bounded owned history surfaceを持つ。
  成果物化しない。body-freeへ出さない。

Layer C: human review layer / local-only read + body-free capture
  reviewerはblind_case_id単位で読む。
  残すのはrating / verdict / blocker id / question observation enumだけ。

Layer D: body-free rating and blocker layer / body-free
  6軸score、verdict、readfeel blocker、execution blockerを保存する。
  reviewer free textは残さない。

Layer E: question need observation layer / body-free
  P7/P8 Bridge用の問い必要性観察rowを残す。
  question text / draft question textは作らない。

Layer F: consistency and anti-escape guard layer / body-free
  P5の弱さを問いで隠していないかを見る。
  RED / REPAIR_REQUIREDをP8候補へ逃がさない。

Layer G: disposal verification layer / body-free
  body-full packet / reviewer notesの廃棄を確認し、receipt化する。

Layer H: post-review decision layer / body-free
  P5 confirmed candidate / P5 repair return / inconclusive / P6 candidate / P8 material candidateを分ける。
```

### 5.2 R51で生成してよいもの / 生成してはいけないもの

| 種別 | R51実装・実行で生成可能 | 生成条件 | 成果物・P7 materialへ残せるか |
|---|---:|---|---:|
| body-free R51 admission envelope | yes | 常時可 | yes |
| body-free validation evidence note | yes | 常時可 | yes |
| body-free R49 timeout note | yes | timeout分類用 | yes |
| local-only body-full reviewer packet | 条件付き | valid local root + explicit allow + purge plan | no |
| local-only reviewer form | 条件付き | review中のみ | no |
| local-only reviewer notes | 条件付き | local-only / rating抽出後purge | no |
| body-free rating rows | yes | review結果記入後 | yes |
| body-free readfeel blocker rows | yes | review結果記入後 | yes |
| body-free execution blocker rows | yes | 実行不能・不足・purge失敗時 | yes |
| body-free question need observation rows | yes | 各case review後 | yes |
| body-free disposal receipt | yes | purge後 / generation blocked時 | yes |
| body-free post-review summary | yes | disposal verified後 | yes |
| body-free P5/P6/P8 candidate handoff | yes | summary後 | yes |
| question text / draft question text | no | R51では不可 | no |
| P8 question trigger logic | no | R51では不可 | no |
| API / DB / RN / response key差分 | no | R51では不可 | no |
| release_allowed=true | no | R51では不可 | no |

---

## 6. local-only body-full / body-free境界

### 6.1 local review root

R51でも、R47〜R50で固定したroot方針を継承します。

```text
正式root環境変数:
  COCOLON_EMLIS_LOCAL_REVIEW_ROOT

R50 explicit allow環境変数:
  COCOLON_EMLIS_P7_R50_ALLOW_BODY_FULL_PACKET=LOCAL_ONLY_REVIEW_CONFIRMED

R51で追加する場合の候補:
  COCOLON_EMLIS_P7_R51_ALLOW_ACTUAL_LOCAL_MANUAL_RUN=LOCAL_ONLY_ACTUAL_REVIEW_CONFIRMED
```

R51でlocal rootに求める条件:

```text
- repo配下ではない。
- `/mnt/data` などartifact生成・提出対象配下ではない。
- 前提資料zip / 実装済み資料zip / release material / docs配下ではない。
- Git管理対象ではない。
- export候補・zip候補に含まれていない。
- R51実行者が明示的にlocal-only rootとして指定している。
- purge planが開始前に存在する。
```

local root未設定時:

```text
- body-free admission envelopeは生成してよい。
- body-full reviewer packet本体は生成しない。
- manual run decisionはNO_GOまたはBLOCKEDにする。
- P5 actual review completedへ進めない。
```

### 6.2 explicit allow

body-full packet生成は、local rootがあるだけでは許可しません。

```text
R50 token:
  LOCAL_ONLY_REVIEW_CONFIRMED

R51 actual run token案:
  LOCAL_ONLY_ACTUAL_REVIEW_CONFIRMED
```

R51で確認する意味:

```text
- body-full packetには本文が含まれる可能性がある。
- packetはlocal-onlyである。
- review完了後または中断後に廃棄する。
- body-free summaryには本文、path、hash、reviewer free text、質問本文を残さない。
```

### 6.3 local-only directory構造案

```text
{COCOLON_EMLIS_LOCAL_REVIEW_ROOT}/
  p7_r51_p5_human_blind_qa_actual_local_manual_run/
    session_<review_session_id>/
      controller.bodyfree/
        admission_envelope.json
        case_manifest.bodyfree.json
        validation_evidence_note.bodyfree.json
        r49_timeout_note.bodyfree.json
      body_full_packets.local_only/
        packet_<blind_case_id>.json
      reviewer_forms.local_only/
        reviewer_form_<blind_case_id>.json
      reviewer_notes.local_only/
        reviewer_notes_<blind_case_id>.json
      bodyfree_rows.work/
        rating_rows.jsonl
        readfeel_blocker_rows.jsonl
        execution_blocker_rows.jsonl
        question_need_observation_rows.jsonl
      disposal_receipts.bodyfree/
        disposal_receipt.json
      bodyfree_summary.to_export_after_purge/
        post_review_summary.json
        p5_decision_summary.json
        p6_candidate_handoff.json
        p8_question_design_material_candidate_handoff.json
        no_body_leak_scan.json
```

重要:

```text
- `body_full_packets.local_only/` と `reviewer_notes.local_only/` は成果物化禁止。
- `bodyfree_summary.to_export_after_purge/` は、purge確認後にだけ成果物候補へ渡せる。
- body-free rowにもlocal absolute pathを残さない。
- local pathを扱う場合はlocal-only controller内部だけ。P7 materialへは抽象refのみ。
```

### 6.4 body-fullに入ってよいもの

local-only reviewer packetに限って、次を入れてよい候補にします。

```text
- schema_version
- review_session_id
- blind_case_id
- packet_ref_id
- review_kind
- review_prompt_version
- local_only=true
- must_not_export=true
- disposal_required=true
- current_input_review_surface
- returned_emlis_surface
- bounded_owned_history_review_surface
- reviewer_rating_form
- question_need_observation_selection_form
- disposal_reminder
```

ただし、これらはlocal-onlyです。body-freeへ出してはいけません。

### 6.5 body-fullに入れてはいけないもの

```text
- DB id
- user id
- raw history full dump
- public meta full dump
- system prompt
- model prompt
- exact internal reasoning
- unrelated user records
- reviewerへ期待結果やtierを露骨に示すfield
- family / tier / boundary labelを、blind性を壊す形でreviewerへ出すこと
```

### 6.6 body-freeに残してよいもの

```text
- schema_version
- review_session_id
- blind_case_id
- case_ref_id
- packet_ref_id
- family
- case_role
- subscription_tier_ref  # controller / summary用。reviewer-facingでは隠す。
- review_kind
- reviewer_ref  # pseudonymous only
- axis_scores
- verdict
- sanitized_reason_ids
- blocker_ids
- execution_blocker_ids
- question_need_primary_class
- ambiguity_kind_refs
- one_question_fit_ref
- plan_candidate_flags
- repair_required_refs
- disposal_status
- body_removed
- reviewer_notes_removed
- local_packet_exported=false
- content_hash_of_body_stored=false
- p5_confirmed_candidate
- p5_repair_return_candidate
- p5_review_inconclusive
- p6_limited_human_readfeel_start_candidate
- p8_question_design_material_candidate
- p7_complete=false
- p8_start_allowed=false
- release_allowed=false
- body_free=true
```

### 6.7 body-freeに残してはいけないもの

```text
raw_input
raw_answer
comment_text
comment_text_body
returned_emlis_surface
bounded_owned_history_review_surface
current_input_review_surface
reviewer_free_text
reviewer_note
reviewer_notes
question_text
draft_question_text
question_body
local_absolute_path
body_content_hash
packet_content_hash
terminal_output
traceback
deleted_body_preview
body_full_file_content_hash
raw_text_hash
comment_text_hash
stdout
stderr
```

---

## 7. R51 24-case review case design

### 7.1 最小case数

R51では、R47/R48/R50で固定済みのP5 first formal review minimumを維持します。

```text
required_case_count: 24
minimum_history_line_eligible_input_cases: 4
minimum_owned_history_positive_cases: 12
minimum_block_boundary_cases:
  low_information_history_not_eligible: 2
  free_tier_history_present_not_allowed: 2
```

24件未満では、P5 confirmed candidateへ進みません。

### 7.2 R51 first formal review matrix

R48 matrixを継承します。

| family | case_count | case_role | tier構成 |
|---|---:|---|---|
| history_line_eligible_input | 4 | positive_history_line | plus 2 / premium 2 |
| standard_state_answer_owned_history | 4 | positive_owned_history | plus 2 / premium 2 |
| self_understanding_owned_history | 3 | positive_owned_history | plus 2 / premium 1 |
| uncertainty_support_owned_history | 3 | positive_owned_history | plus 1 / premium 2 |
| change_future_intention_owned_history | 3 | positive_owned_history | plus 2 / premium 1 |
| relationship_gratitude_recovery_owned_history | 3 | positive_owned_history | plus 1 / premium 2 |
| low_information_history_not_eligible | 2 | boundary_no_history_line | plus 1 / premium 1 |
| free_tier_history_present_not_allowed | 2 | boundary_no_history_line | free 2 |
| **total** | **24** |  | plus 11 / premium 11 / free 2 |

### 7.3 reviewで必須にすること

```text
- 24件すべてにrating rowが必要。
- 24件すべてにquestion need observation rowが必要。
- review不能caseにはexecution blocker rowが必要。
- execution blocker caseにreadfeel verdictを付けない。
- 24件未満でP5 confirmed candidateへ進めない。
- body-full packet生成後はdisposal receiptなしにsummary finalizeしない。
```

### 7.4 reviewer blind policy

reviewerに出すもの:

```text
- blind_case_id
- current_input_review_surface
- returned_emlis_surface
- bounded_owned_history_review_surface
- rating form
- question need observation selection
- disposal reminder
```

reviewerに出さないもの:

```text
- family
- subscription_tier_ref
- expected_boundary_audit_ref
- case_role
- P5 confirmed candidate条件
- P8 material candidate条件
- internal gate result
- DB id / user id / record id
```

理由:

```text
reviewerが「これはPlusだから履歴線が出るべき」「これはfreeだから履歴線が出ないべき」と先読みすると、実際の表示読感が歪むため。
```

---

## 8. reviewer rating設計

### 8.1 rating axes

R51では、R50で固定されたP5 axesを維持します。

```text
history_connection_naturalness: target 0.90
creepy_absence: target 0.95
overclaim_absence: target 0.95
self_blame_non_amplification: target 0.95
wants_more_input_or_accumulation: target 0.85
non_shallow_repeat: target 0.90
```

### 8.2 score範囲

```text
0.00 <= axis_score <= 1.00
```

scoreの読み方:

```text
1.00:
  その軸で問題がない。

0.75:
  大きな赤ではないが、商品として弱さがある。

0.50:
  明確に修正対象。

0.00:
  強い赤。表示すると信頼を壊す可能性がある。
```

### 8.3 verdict enum

```text
PASS
YELLOW
REPAIR_REQUIRED
RED
```

verdictの読み方:

```text
PASS:
  P5履歴線として商品候補にできる。
  ただしrelease許可ではない。

YELLOW:
  致命赤ではないが、商品判断には注意が必要。
  P5 confirmed candidateの集計では慎重に扱う。

REPAIR_REQUIRED:
  P5 / Emlis / Gate / surface の修正対象。
  問い候補で覆い隠してはいけない。

RED:
  監視感、決めつけ、過剰読解、自己責め増幅、境界違反等。
  P5 confirmed candidateを止める。
```

### 8.4 readfeel blocker id

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

R51での扱い:

```text
- blocker_idはreadfeel問題にだけ使う。
- local root missing / rating missing / disposal failed はexecution blockerへ分ける。
- blockerがあるcaseを「問いがあれば解決」でPASSにしない。
```

### 8.5 reviewer free text policy

reviewer free textはlocal-onlyです。

```text
- free textをbody-free rowsへ入れない。
- free textを成果物へ入れない。
- free textはrating / reason id / blocker idへ変換した後に廃棄対象にする。
- summaryへはsanitized_reason_idsだけを残す。
```

---

## 9. question need observation設計

### 9.1 目的

question need observation rowは、P8詳細設計を勘で作らないための観察メモです。  
R51で問いそのものを作るためのものではありません。

R51で残すべきもの:

```text
- 問いなしで十分観測できたか。
- 問いがあれば補完リスクを下げられたか。
- 問いを出すと入力直後の観測体験を重くしないか。
- 1問で足りる曖昧さか。
- 問いではなくEmlis本体の観測力で返すべきか。
- Plus向け1問候補か、Premium深掘り候補か。
```

R51で残してはいけないもの:

```text
- question text
- draft question text
- question body
- raw input
- returned Emlis surface
- reviewer free text
- local path
- body hash
```

### 9.2 canonical primary class

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

### 9.3 reviewer向け表示ラベル案

reviewer form上は、次のように短く見せます。  
ただし、body-free rowにはcanonical enumを保存します。

```text
問い不要: Emlis本体で観測できている
1問あると補完リスクを下げられそう
問いを出すと即時観測が重くなる
問いではなくEmlis読感の修正対象
問いではなくP5履歴線surfaceの修正対象
問いではなくGate境界の修正対象
Plus向け1問候補として後で検討
Premium深掘り候補として後で検討
材料不足・実行blocker
```

### 9.4 ambiguity kind refs

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

### 9.5 one question fit refs

```text
not_needed
fits_one_question
needs_more_than_one_question_not_p7
would_delay_immediate_observation
unsafe_or_boundary_not_question
repair_required_not_question
insufficient_material
```

### 9.6 repair required refs

```text
emlis_readfeel_repair_required
p5_surface_repair_required
gate_boundary_repair_required
no_repair_required
```

### 9.7 P5の弱さを問いで隠さないguard

R51では、rating rowとquestion need observation rowの整合を必ず見ます。

不整合例:

```text
- verdict=PASS なのに question_need_primary_class が not_question_*_repair_required。
- verdict=RED / REPAIR_REQUIRED なのに question_need_primary_class が plus_single_question_candidate_later だけ。
- one_question_fit_ref=repair_required_not_question なのに repair_required_refs が no_repair_required のみ。
- question_need_primary_class=insufficient_material_execution_blocker なのに execution blocker rowがない。
- blocker_id=p5_history_creepy_or_surveillance_feeling なのに P8 material candidate扱いにしている。
- blocker_id=p5_current_input_overridden_by_history なのに「問いがあればよい」としてP5修正を回避している。
```

R51での結論:

```text
問いが便利そうに見えても、P5履歴線の表面化が弱いならP5修正へ戻す。
Emlis本体が浅いならEmlis修正へ戻す。
Gate境界が甘いならGate修正へ戻す。
```

---

## 10. execution blocker設計

### 10.1 readfeel blockerとexecution blockerの違い

```text
readfeel blocker:
  実際にEmlis応答を読んだ結果、P5履歴線の商品品質に問題がある。

execution blocker:
  reviewを実行できない、または結果として扱えない。
  P5読感の赤ではない。
```

### 10.2 R51 execution blocker id案

```text
r51_missing_r50_handoff
r51_missing_r50_target_green_evidence
r51_missing_r49_split_green_evidence
r51_r49_wildcard_timeout_unclassified
r51_missing_r48_regression_green_evidence
r51_missing_r47_regression_green_evidence
r51_missing_r46_display_p5_core_green_evidence
r51_missing_rn_contract_green_evidence
r51_local_review_root_missing
r51_local_review_root_invalid
r51_explicit_allow_missing
r51_disposal_plan_missing
r51_case_material_missing
r51_body_full_packet_generation_failed
r51_body_full_packet_export_violation
r51_review_aborted_before_rating
r51_rating_rows_incomplete
r51_question_need_observation_rows_incomplete
r51_rating_question_observation_inconsistent
r51_body_free_leak_detected
r51_disposal_receipt_missing
r51_disposal_failed
r51_disposal_not_verified
r51_scope_drift_detected
```

### 10.3 execution blocker status

```text
OPEN
TRIAGED
RESOLVED
CLOSED
```

### 10.4 execution blocker時の扱い

```text
- execution blockerがOPENなら、P5 confirmed candidateへ進めない。
- execution blockerがあるcaseはreadfeel verdictを付けない。
- review中断時はbody-full packet purgeへ進む。
- disposal未確認ならsummary finalizeしない。
- R49 wildcard timeoutは、split matrix greenがある限り単独ではactual review実行を止めないが、wildcard green claimは許可しない。
```

---

## 11. disposal / retention設計

### 11.1 retention

R47/R48/R50のretentionを維持します。

```text
body_full_packet_retention_max_hours: 72
reviewer_notes_retention_after_rating_finalized_max_hours: 24
```

優先順位:

```text
1. rating / blocker / question observation rowがfinalizeされたら、body-full packetは即purge対象。
2. reviewer notesはlocal-onlyのまま、rating finalized後24時間以内にpurge必須。
3. review session cancelled / abortedなら、body-full packetとreviewer notesを即purge対象。
4. body-full packetは72時間を超えたら、rating未完でもpurge必須。
```

### 11.2 disposal status

```text
NOT_GENERATED
GENERATION_BLOCKED
GENERATED_LOCAL_ONLY
REVIEW_IN_PROGRESS
RATINGS_EXTRACTED
PURGE_REQUIRED
BODY_PURGED
DISPOSAL_VERIFIED
DISPOSAL_FAILED
EXPIRED_PURGED
```

### 11.3 disposal receiptに残すもの

```text
schema_version
review_session_id
packet_kind
case_count
deleted_file_count
purge_started_at
purge_completed_at
disposal_status
body_removed
reviewer_notes_removed
local_packet_exported=false
content_hash_of_body_stored=false
body_free=true
release_allowed=false
p7_complete=false
p8_start_allowed=false
hold004_close_allowed=false
```

### 11.4 disposal receiptに残さないもの

```text
raw_input
current_input
memo
memo_action
history_raw_text
comment_text
comment_text_body
candidate_body
surface_body
review_surface
visible_surface
surface_for_reviewer
current_input_for_reviewer
history_summary_for_reviewer
reviewer_free_text
reviewer_note
reviewer_notes
terminal_output
stdout
stderr
traceback
deleted_body_preview
body_content_hash
body_full_file_content_hash
raw_text_hash
comment_text_hash
local_absolute_path
```

### 11.5 disposal失敗時

```text
disposal_status=DISPOSAL_FAILED
body_removed=false または reviewer_notes_removed=false
p5_confirmed_candidate=false
p5_repair_return_candidate=false # 修正判断以前にexecution blocker扱い
p5_review_inconclusive=true
p6_limited_human_readfeel_start_candidate=false
p8_question_design_material_candidate=false
release_allowed=false
p7_complete=false
p8_start_allowed=false
execution_blocker_id=r51_disposal_failed
```

---

## 12. post-review decision設計

### 12.1 R51後に分ける判断

実レビュー後の判断は、次の5つを分けます。

```text
1. P5 confirmed candidateへ進めるか。
2. P5 repair returnへ戻すべきか。
3. inconclusiveとして再実行・不足解消へ戻すべきか。
4. P6 limited human readfeel start candidateへ進めるか。
5. P8 question design material candidateとして使えるbody-free summaryがあるか。
```

これらを混同しません。

### 12.2 P5 confirmed candidate条件

R51でP5 confirmed candidateをtrue候補にできる条件:

```text
- 24 casesすべてreview完了。
- 24 rating rows complete。
- 24 question need observation rows complete。
- rating rowsとquestion observation rowsのcase setが一致。
- execution blocker OPENが0。
- disposal receiptあり。
- disposal_status=DISPOSAL_VERIFIED。
- body_removed=true。
- reviewer_notes_removed=true。
- local_packet_exported=false。
- content_hash_of_body_stored=false。
- RED 0。
- REPAIR_REQUIRED 0。
- boundary violation blocker 0。
- creepy / surveillance blocker 0。
- overclaim blocker 0。
- self_blame amplification blocker 0。
- not_question_*_repair_required classが0、またはP5修正対象として閉じている。
- history_connection_naturalness平均 >= 0.90。
- creepy_absence平均 >= 0.95。
- overclaim_absence平均 >= 0.95。
- self_blame_non_amplification平均 >= 0.95。
- wants_more_input_or_accumulation平均 >= 0.85。
- non_shallow_repeat平均 >= 0.90。
```

注意:

```text
P5 confirmed candidateは、release_allowedではない。
P5 confirmed candidateは、P7 completeではない。
P5 confirmed candidateは、P8 start allowedではない。
```

### 12.3 P5 repair return条件

次のいずれかがあれば、P5修正へ戻す候補にします。

```text
- REDが1件以上。
- REPAIR_REQUIREDが1件以上。
- creepy / surveillance blockerが1件以上。
- overclaim blockerが1件以上。
- self_blame amplification blockerが1件以上。
- free tier history boundary violationが1件以上。
- low_information history overreadが1件以上。
- current input overridden by historyが1件以上。
- wants_more_input_or_accumulationが目標未満。
- non_shallow_repeatが目標未満。
- not_question_emlis_readfeel_repair_required が1件以上。
- not_question_p5_surface_repair_required が1件以上。
- not_question_gate_boundary_required が1件以上。
```

### 12.4 inconclusive条件

次の状態はP5 confirmedでもrepair returnでもなく、inconclusiveにします。

```text
- 24件未満。
- rating row不足。
- question observation row不足。
- execution blockerがOPEN。
- disposal receipt不足。
- disposal未確認。
- reviewerが途中中断。
- body-free leak riskが未解決。
- R49 split matrixが失敗している。
```

### 12.5 P6 limited human readfeel start candidate条件

P6へ進む候補にできる条件:

```text
- P5 confirmed candidate=true候補。
- P5 repair return=false。
- P5 review inconclusive=false。
- P5履歴線がP6の深い読解で覆い隠される危険が低い。
- P6 limited familyに進めても、P5弱さの補修にならない。
- disposal verified。
- execution blocker OPENが0。
```

禁止:

```text
p6_limited_human_readfeel_start_allowed=true にはしない。
R51で出せるのは candidate だけ。
```

### 12.6 P8 question design material candidate条件

P8材料候補にできる条件:

```text
- question need observation rowsが24件揃っている。
- question text / draft question textが含まれていない。
- raw input / returned surface / reviewer free textが含まれていない。
- primary class counts / ambiguity counts / one question fit countsがある。
- repair_required_not_question をP8候補として誤分類していない。
- P5 repair return対象を、P8材料候補に混ぜていない。
- p8_start_allowed=falseを維持している。
- question implementation not startedを明示できる。
```

R51で出してよいもの:

```text
p8_question_design_material_candidate=true/false
primary_class_counts
ambiguity_kind_counts
one_question_fit_counts
repair_required_counts
missing_requirement_refs
```

R51で出してはいけないもの:

```text
p8_start_allowed=true
question trigger logic
question text
API / DB / RN / response key仕様
```

---

## 13. JSON / schema案

この章のschema案は、設計意図を固定するための案です。  
実ファイル化は、実装段階で現物コード・既存schema配置・既存testと照合して判断します。

### 13.1 `p7_r51_admission_envelope.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r51.admission_envelope.bodyfree.v1",
  "title": "P7 R51 P5 Human Blind QA Actual Local-Only Manual Run Admission Envelope",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "phase",
    "step",
    "scope",
    "review_session_id",
    "r50_handoff_ref",
    "required_case_count",
    "manual_run_decision",
    "r49_split_matrix_green",
    "r49_wildcard_bulk_timeout_unclassified",
    "local_only_body_full_generation_allowed",
    "explicit_allow_present",
    "disposal_plan_ready",
    "actual_human_review_run_here",
    "body_full_packet_generated_here",
    "api_db_rn_response_key_changed_here",
    "p7_complete",
    "p8_start_allowed",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r51.admission_envelope.bodyfree.v1" },
    "phase": { "const": "P7" },
    "step": { "const": "R51_P5HumanBlindQAActualLocalOnlyManualRun_20260620" },
    "scope": { "const": "p5_human_blind_qa_actual_local_only_manual_run" },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "r50_handoff_ref": { "type": "string", "minLength": 1, "maxLength": 160 },
    "required_case_count": { "const": 24 },
    "manual_run_decision": {
      "enum": [
        "GO_FOR_LOCAL_MANUAL_REVIEW",
        "NO_GO_MISSING_R50_HANDOFF",
        "NO_GO_TARGET_OR_REGRESSION_EVIDENCE_MISSING",
        "NO_GO_LOCAL_ROOT_UNSAFE",
        "NO_GO_EXPLICIT_ALLOW_MISSING",
        "NO_GO_DISPOSAL_PLAN_UNSAFE",
        "NO_GO_SCOPE_DRIFT",
        "NO_GO_BODY_FREE_LEAK_RISK",
        "BLOCKED_BY_EXECUTION_BLOCKER"
      ]
    },
    "r49_split_matrix_green": { "type": "boolean" },
    "r49_wildcard_bulk_timeout_unclassified": { "type": "boolean" },
    "local_only_body_full_generation_allowed": { "type": "boolean" },
    "explicit_allow_present": { "type": "boolean" },
    "disposal_plan_ready": { "type": "boolean" },
    "actual_human_review_run_here": { "type": "boolean" },
    "body_full_packet_generated_here": { "type": "boolean" },
    "api_db_rn_response_key_changed_here": { "const": false },
    "p7_complete": { "const": false },
    "p8_start_allowed": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 13.2 `p7_r51_body_full_reviewer_packet.local_only.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r51.body_full_reviewer_packet.local_only.v1",
  "title": "P7 R51 Body-Full Reviewer Packet Local-Only",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "blind_case_id",
    "packet_ref_id",
    "review_kind",
    "review_prompt_version",
    "local_only",
    "must_not_export",
    "disposal_required",
    "current_input_review_surface",
    "returned_emlis_surface",
    "bounded_owned_history_review_surface",
    "reviewer_rating_form",
    "question_need_observation_selection_form",
    "disposal_reminder"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r51.body_full_reviewer_packet.local_only.v1" },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "blind_case_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "packet_ref_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "review_kind": { "const": "p5_history_line_readfeel" },
    "review_prompt_version": { "type": "string", "minLength": 1, "maxLength": 160 },
    "local_only": { "const": true },
    "must_not_export": { "const": true },
    "disposal_required": { "const": true },
    "current_input_review_surface": { "type": "string", "minLength": 1 },
    "returned_emlis_surface": { "type": "string", "minLength": 1 },
    "bounded_owned_history_review_surface": { "type": "array", "maxItems": 3 },
    "reviewer_rating_form": { "type": "object" },
    "question_need_observation_selection_form": { "type": "object" },
    "disposal_reminder": { "type": "string", "minLength": 1 }
  }
}
```

注意:

```text
このschemaはlocal-only用であり、成果物化・P7 material化・release material化しない。
```

### 13.3 `p7_r51_rating_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r51.rating_row.bodyfree.v1",
  "title": "P7 R51 P5 Human Blind QA Rating Row Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "packet_ref_id",
    "blind_case_id",
    "case_ref_id",
    "family",
    "case_role",
    "review_kind",
    "reviewer_ref",
    "reviewed_at",
    "axis_scores",
    "verdict",
    "sanitized_reason_ids",
    "blocker_ids",
    "reviewer_free_text_included",
    "body_removed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r51.rating_row.bodyfree.v1" },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "packet_ref_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "blind_case_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "case_ref_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "family": { "type": "string", "minLength": 1, "maxLength": 160 },
    "case_role": { "type": "string", "minLength": 1, "maxLength": 160 },
    "review_kind": { "const": "p5_history_line_readfeel" },
    "reviewer_ref": { "type": "string", "minLength": 1, "maxLength": 120 },
    "reviewed_at": { "type": "string", "minLength": 1, "maxLength": 120 },
    "axis_scores": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "history_connection_naturalness",
        "creepy_absence",
        "overclaim_absence",
        "self_blame_non_amplification",
        "wants_more_input_or_accumulation",
        "non_shallow_repeat"
      ],
      "properties": {
        "history_connection_naturalness": { "type": "number", "minimum": 0, "maximum": 1 },
        "creepy_absence": { "type": "number", "minimum": 0, "maximum": 1 },
        "overclaim_absence": { "type": "number", "minimum": 0, "maximum": 1 },
        "self_blame_non_amplification": { "type": "number", "minimum": 0, "maximum": 1 },
        "wants_more_input_or_accumulation": { "type": "number", "minimum": 0, "maximum": 1 },
        "non_shallow_repeat": { "type": "number", "minimum": 0, "maximum": 1 }
      }
    },
    "verdict": { "enum": ["PASS", "YELLOW", "REPAIR_REQUIRED", "RED"] },
    "sanitized_reason_ids": {
      "type": "array",
      "items": { "type": "string", "maxLength": 160 },
      "uniqueItems": true
    },
    "blocker_ids": {
      "type": "array",
      "items": {
        "enum": [
          "p5_history_connection_too_generic",
          "p5_history_scope_overclaim",
          "p5_history_creepy_or_surveillance_feeling",
          "p5_history_line_self_blame_amplification",
          "p5_history_line_shallow_repeat",
          "p5_history_line_wants_more_input_low",
          "p5_free_tier_history_boundary_violation",
          "p5_low_information_history_overread",
          "p5_current_input_overridden_by_history",
          "p5_boundary_history_line_leak_suspected",
          "p5_review_not_enough_context"
        ]
      },
      "uniqueItems": true
    },
    "reviewer_free_text_included": { "const": false },
    "body_removed": { "type": "boolean" },
    "body_free": { "const": true }
  }
}
```

### 13.4 `p7_r51_question_need_observation_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r51.question_need_observation_row.bodyfree.v1",
  "title": "P7 R51 Question Need Observation Row Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "packet_ref_id",
    "blind_case_id",
    "case_ref_id",
    "family",
    "case_role",
    "review_kind",
    "observation_stage",
    "question_need_primary_class",
    "ambiguity_kind_refs",
    "one_question_fit_ref",
    "plan_candidate_flags",
    "repair_required_refs",
    "sanitized_reason_ids",
    "question_text_included",
    "draft_question_text_included",
    "reviewer_free_text_included",
    "body_removed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r51.question_need_observation_row.bodyfree.v1" },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "packet_ref_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "blind_case_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "case_ref_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "family": { "type": "string", "minLength": 1, "maxLength": 160 },
    "case_role": { "type": "string", "minLength": 1, "maxLength": 160 },
    "review_kind": { "const": "p5_history_line_readfeel" },
    "observation_stage": { "const": "p7_p8_bridge_question_need_observation" },
    "question_need_primary_class": {
      "enum": [
        "no_question_needed_emlis_can_observe",
        "question_may_reduce_overread_risk",
        "question_would_make_immediate_observation_heavy",
        "not_question_emlis_readfeel_repair_required",
        "not_question_p5_surface_repair_required",
        "not_question_gate_boundary_required",
        "plus_single_question_candidate_later",
        "premium_deep_dive_candidate_later",
        "insufficient_material_execution_blocker"
      ]
    },
    "ambiguity_kind_refs": {
      "type": "array",
      "items": {
        "enum": [
          "no_material_ambiguity",
          "missing_target",
          "missing_time_scope",
          "missing_emotion_intensity",
          "missing_relation_context",
          "missing_action_intention",
          "conflicting_current_and_history_signal",
          "low_information_current_input",
          "boundary_or_tier_unclear",
          "history_connection_basis_unclear",
          "self_blame_or_safety_boundary_unclear"
        ]
      },
      "uniqueItems": true
    },
    "one_question_fit_ref": {
      "enum": [
        "not_needed",
        "fits_one_question",
        "needs_more_than_one_question_not_p7",
        "would_delay_immediate_observation",
        "unsafe_or_boundary_not_question",
        "repair_required_not_question",
        "insufficient_material"
      ]
    },
    "plan_candidate_flags": {
      "type": "array",
      "items": {
        "enum": [
          "plus_single_question_candidate_later",
          "premium_deep_dive_candidate_later",
          "p8_design_material_candidate"
        ]
      },
      "uniqueItems": true
    },
    "repair_required_refs": {
      "type": "array",
      "items": {
        "enum": [
          "emlis_readfeel_repair_required",
          "p5_surface_repair_required",
          "gate_boundary_repair_required",
          "no_repair_required"
        ]
      },
      "uniqueItems": true
    },
    "sanitized_reason_ids": {
      "type": "array",
      "items": { "type": "string", "maxLength": 160 },
      "uniqueItems": true
    },
    "question_text_included": { "const": false },
    "draft_question_text_included": { "const": false },
    "reviewer_free_text_included": { "const": false },
    "body_removed": { "type": "boolean" },
    "body_free": { "const": true }
  }
}
```

### 13.5 `p7_r51_disposal_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r51.disposal_receipt.bodyfree.v1",
  "title": "P7 R51 Disposal Receipt Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "packet_kind",
    "case_count",
    "deleted_file_count",
    "purge_started_at",
    "purge_completed_at",
    "disposal_status",
    "body_removed",
    "reviewer_notes_removed",
    "local_packet_exported",
    "content_hash_of_body_stored",
    "body_free",
    "release_allowed",
    "p7_complete",
    "p8_start_allowed"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r51.disposal_receipt.bodyfree.v1" },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "packet_kind": { "const": "p5_human_blind_qa_local_review_packet" },
    "case_count": { "const": 24 },
    "deleted_file_count": { "type": "integer", "minimum": 0 },
    "purge_started_at": { "type": "string", "minLength": 1, "maxLength": 120 },
    "purge_completed_at": { "type": "string", "minLength": 1, "maxLength": 120 },
    "disposal_status": {
      "enum": [
        "NOT_GENERATED",
        "GENERATION_BLOCKED",
        "GENERATED_LOCAL_ONLY",
        "REVIEW_IN_PROGRESS",
        "RATINGS_EXTRACTED",
        "PURGE_REQUIRED",
        "BODY_PURGED",
        "DISPOSAL_VERIFIED",
        "DISPOSAL_FAILED",
        "EXPIRED_PURGED"
      ]
    },
    "body_removed": { "type": "boolean" },
    "reviewer_notes_removed": { "type": "boolean" },
    "local_packet_exported": { "const": false },
    "content_hash_of_body_stored": { "const": false },
    "body_free": { "const": true },
    "release_allowed": { "const": false },
    "p7_complete": { "const": false },
    "p8_start_allowed": { "const": false }
  }
}
```

### 13.6 `p7_r51_post_review_decision_summary.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r51.post_review_decision_summary.bodyfree.v1",
  "title": "P7 R51 Post Review Decision Summary Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "case_count",
    "rating_row_count",
    "question_observation_row_count",
    "rating_and_question_case_ref_sets_match",
    "execution_blocker_open_count",
    "readfeel_blocker_open_count",
    "verdict_counts",
    "axis_score_averages",
    "question_need_primary_class_counts",
    "repair_required_counts",
    "disposal_status",
    "body_removed",
    "reviewer_notes_removed",
    "p5_confirmed_candidate",
    "p5_repair_return_candidate",
    "p5_review_inconclusive",
    "p6_limited_human_readfeel_start_candidate",
    "p8_question_design_material_candidate",
    "p7_complete",
    "p8_start_allowed",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r51.post_review_decision_summary.bodyfree.v1" },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "case_count": { "const": 24 },
    "rating_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "question_observation_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "rating_and_question_case_ref_sets_match": { "type": "boolean" },
    "execution_blocker_open_count": { "type": "integer", "minimum": 0 },
    "readfeel_blocker_open_count": { "type": "integer", "minimum": 0 },
    "verdict_counts": { "type": "object" },
    "axis_score_averages": { "type": "object" },
    "question_need_primary_class_counts": { "type": "object" },
    "repair_required_counts": { "type": "object" },
    "disposal_status": { "type": "string", "minLength": 1, "maxLength": 80 },
    "body_removed": { "type": "boolean" },
    "reviewer_notes_removed": { "type": "boolean" },
    "p5_confirmed_candidate": { "type": "boolean" },
    "p5_repair_return_candidate": { "type": "boolean" },
    "p5_review_inconclusive": { "type": "boolean" },
    "p6_limited_human_readfeel_start_candidate": { "type": "boolean" },
    "p8_question_design_material_candidate": { "type": "boolean" },
    "p7_complete": { "const": false },
    "p8_start_allowed": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

---

## 14. Python module設計案

R51はactual manual run段階なので、実装段階で既存R50 helperだけで足りるかを先に判断します。  
不足する場合のみ、P7専用helperを追加します。

### 14.1 production候補

```text
services/ai_inference/emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run.py
```

このmoduleに置く候補:

```text
P7_R51_STEP
P7_R51_SCOPE
P7_R51_REVIEW_SESSION_STATUS_REFS
P7_R51_MANUAL_RUN_DECISION_REFS
P7_R51_EXECUTION_BLOCKER_ID_REFS
P7_R51_REQUIRED_CASE_COUNT
P7_R51_BODY_FREE_FORBIDDEN_FIELD_REFS

build_p7_r51_current_source_r50_handoff_refreeze()
build_p7_r51_admission_envelope_bodyfree()
build_p7_r51_validation_evidence_note_bodyfree()
build_p7_r51_r49_timeout_note_bodyfree()
build_p7_r51_local_body_full_generation_preflight()
build_p7_r51_review_session_protocol_bodyfree()
build_p7_r51_local_body_full_packet_request()
normalize_p7_r51_rating_row_bodyfree()
normalize_p7_r51_question_need_observation_row_bodyfree()
build_p7_r51_readfeel_blocker_row_bodyfree()
build_p7_r51_execution_blocker_row_bodyfree()
build_p7_r51_rating_question_observation_consistency_guard()
build_p7_r51_disposal_receipt_bodyfree()
build_p7_r51_post_review_summary_bodyfree()
build_p7_r51_p5_decision_bodyfree()
build_p7_r51_p6_candidate_handoff_bodyfree()
build_p7_r51_p8_material_candidate_handoff_bodyfree()
assert_p7_r51_no_body_leak_no_question_text_contract()
build_p7_r51_validation_command_matrix_bodyfree()
build_p7_r51_touch_candidate_no_touch_boundary_freeze()
```

### 14.2 optional local file ops helper候補

```text
services/ai_inference/emlis_ai_p7_r51_local_review_file_ops.py
```

このhelperを作る場合の範囲:

```text
- local root validation
- body-full packet write / read補助
- reviewer form write補助
- body-full packet purge
- reviewer notes purge
- body-free disposal receipt補助
- no body leak scan補助
```

禁止:

```text
- API / DB / RN接続
- public meta生成
- Emlis runtime変更
- P8 question trigger logic
- release material生成
- 成果物zipへbody-fullを入れる処理
```

### 14.3 test候補

```text
tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r0_r1_20260620.py
tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r2_r3_20260620.py
tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r4_r5_20260620.py
tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r6_r7_20260620.py
tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r8_r9_20260620.py
tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r10_r11_20260620.py
tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r12_r13_20260620.py
tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r14_r15_20260620.py
tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r16_r17_20260620.py
tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_r18_r20_20260620.py
```

### 14.4 触らないproduction file

```text
Cocolon/screens/InputScreen.js
Cocolon/screens/input/useInputFeedbackModal.js
Cocolon/screens/input/inputFeedbackModel.js
Cocolon/screens/input/InputFeedbackReplyModal.js
Cocolon/tests/rn-screen-contracts.test.js

services/ai_inference/api_emotion_submit.py
services/ai_inference/emotion_submit_service.py
services/ai_inference/emlis_ai_reply_service.py
services/ai_inference/emlis_ai_public_feedback_meta.py
services/ai_inference/emlis_ai_body_free_public_source_lineage.py
services/ai_inference/emlis_ai_user_label_connection_material.py
services/ai_inference/emlis_ai_user_label_connection_candidate.py
services/ai_inference/emlis_ai_user_label_connection_gate.py
services/ai_inference/emlis_ai_user_label_connection_surface.py
services/ai_inference/emlis_ai_user_label_connection_public_meta.py
services/ai_inference/emlis_ai_user_label_connection_product_quality_qa.py
services/ai_inference/emlis_ai_product_readfeel_long_run_product_gate.py
services/ai_inference/emlis_ai_product_readfeel_rubric.py
services/ai_inference/emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision.py
services/ai_inference/emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution.py
services/ai_inference/emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet.py
services/ai_inference/emlis_ai_p7_r47_local_review_packet_policy.py
services/ai_inference/emlis_ai_p7_r46_p5_p6_human_readfeel_handoff_material.py
```

R51はR50/R49/R48/R47/R46を参照しますが、既存値を勝手に変更しません。

---

## 15. 実装・実行順詳細

### R51-0: current source / R50 handoff refreeze

目的:

```text
R51開始時点で、R50境界が完了しており、次がactual local-only manual runであることを再固定する。
```

固定すること:

```text
- R50 implemented_steps R50-0〜R50-20。
- R50 not_yet_implemented_steps empty。
- R50 next_required_step = P5_human_blind_qa_actual_review_local_only_manual_run_after_R50_boundary_freeze。
- P5 actual reviewはまだ未実施。
- P8 start allowed / P7 complete / release_allowedはfalse。
```

### R51-1: validation evidence / R49 timeout handling freeze

目的:

```text
R51開始前のtest evidenceを、実レビュー前提として整理する。
R49 wildcard timeoutを隠さず、split matrix採用方針を固定する。
```

必要evidence:

```text
- R50 target green。
- R49 split matrix green。
- R48 target regression green。
- R47 regression green。
- R46 / display / P5 core subset green。
- RN contract green。
- backend collect-only count。
```

R49 timeout note:

```text
r49_wildcard_green_claim_allowed=false
r49_wildcard_bulk_timeout_unclassified=true
r49_split_matrix_green_required=true
```

### R51-2: local root / explicit allow / purge plan preflight

目的:

```text
body-full packet生成前に、local root、explicit allow、purge plan、export denylistを確認する。
```

NO_GO条件:

```text
- local root missing。
- local rootがrepo / artifact / premise / implemented docs / release material配下。
- explicit allow missing。
- purge plan missing。
- export denylistがbody-full packetを含む。
```

### R51-3: actual review session envelope作成

目的:

```text
R51のactual local-only review sessionをbody-freeで開始する。
```

含めるもの:

```text
- review_session_id
- source_snapshot_refs
- r50_handoff_ref
- required_case_count=24
- reviewer_ref=pseudonymous
- local_root_ref=external_local_review_root
- body_full_generation_allowed
- disposal_plan_ref
- p7_complete=false
- p8_start_allowed=false
- release_allowed=false
```

含めないもの:

```text
- local absolute path
- raw input
- returned surface
- comment_text body
- body hash
```

### R51-4: 24-case manifest freeze

目的:

```text
R48/R50の24-case matrixをR51 sessionへ引き継ぐ。
```

確認:

```text
- case_count=24。
- blind_case_idが重複しない。
- case_ref_idとblind_case_idが分離されている。
- reviewer-facingにfamily / tier / expectedが出ない。
- boundary cases 4件が含まれる。
```

### R51-5: local-only body-full packet generation request

目的:

```text
GO後だけ、local-only packet生成requestを作る。
```

重要:

```text
- この段階でも、testでは本文入りpacketを成果物化しない。
- packetはlocal-only root内だけ。
- generation eventはbody-free化してよいが、path / hash / bodyは残さない。
```

### R51-6: body-full packet completeness / export denylist scan

目的:

```text
生成したlocal-only packetが24件揃っているか、かつexport候補へ混入していないかを見る。
```

失敗時:

```text
- r51_body_full_packet_generation_failed
- r51_body_full_packet_export_violation
- r51_case_material_missing
```

### R51-7: reviewer instruction / rating form freeze

目的:

```text
reviewerが何を見て何を採点するかを固定する。
```

必須質問:

```text
- 履歴線は自然か。
- 監視感はないか。
- 決めつけ・過剰読解はないか。
- 自己責めを増幅していないか。
- またCocolonへ残したい感覚につながるか。
- 汎用追記や浅い復唱に見えないか。
- 問いではなくP5 / Emlis / Gateを直すべき弱さではないか。
```

### R51-8: actual human review run

目的:

```text
reviewerがblind_case_id順に24件を読む。
```

手順:

```text
1. packet_<blind_case_id>.jsonをlocal-onlyで読む。
2. current input / returned Emlis / bounded owned historyを比較する。
3. 6軸scoreを記入する。
4. verdictを選ぶ。
5. readfeel blockerがあれば選ぶ。
6. question need observation classを選ぶ。
7. free textを書いた場合はlocal-only notesとして扱い、body-freeへ出さない。
```

### R51-9: rating row normalization

目的:

```text
reviewer ratingをbody-free rating rowへ正規化する。
```

validation:

```text
- axesは6つすべて必要。
- extra axis禁止。
- 0.00〜1.00以外禁止。
- machine auto score禁止。
- reviewer free text禁止。
- verdictはPASS/YELLOW/REPAIR_REQUIRED/REDのみ。
```

### R51-10: readfeel blocker / execution blocker ingestion

目的:

```text
P5読感の問題と、review実行不能の問題を分ける。
```

区別:

```text
readfeel blocker:
  P5履歴線そのものの弱さ。

execution blocker:
  packet不足、rating不足、purge失敗、local root不備など。
```

### R51-11: question need observation row normalization

目的:

```text
reviewer selectionをcanonical enumへ正規化する。
```

validation:

```text
- question_text_included=false
- draft_question_text_included=false
- reviewer_free_text_included=false
- body_free=true
- primary class / one_question_fit / repair_required_refsの整合が取れている。
```

### R51-12: rating vs question observation consistency guard

目的:

```text
P5の弱さを問いで隠していないかを判定する。
```

失敗例:

```text
- RED/REPAIR_REQUIREDなのにP8候補へ送る。
- creepy blockerがあるのにquestion_may_reduce_overread_riskだけで済ませる。
- not_question_p5_surface_repair_requiredなのにP5 repair returnをfalseにする。
```

### R51-13: pause / abort / expiration protocol

目的:

```text
reviewが途中停止した場合でもbody-full packetが残り続けないようにする。
```

方針:

```text
- REVIEW_PAUSEDでもretention deadlineは止めない。
- REVIEW_ABORTEDならpurge必須。
- EXPIRED_PURGEDならrating未完でもbody removedを優先する。
- aborted / expiredはP5 confirmed candidate不可。
```

### R51-14: body-full packet / reviewer notes purge

目的:

```text
rating / question observation capture後、本文を含むlocal-only materialを廃棄する。
```

対象:

```text
- body_full_packets.local_only/
- reviewer_forms.local_only/  # bodyを含む場合
- reviewer_notes.local_only/
```

### R51-15: disposal receipt builder / verifier

目的:

```text
body-full packetとreviewer notesの廃棄確認をbody-freeで残す。
```

必須:

```text
body_removed=true
reviewer_notes_removed=true
local_packet_exported=false
content_hash_of_body_stored=false
```

### R51-16: body-free post-review summary builder

目的:

```text
24-case review結果、question observation結果、disposal状態をbody-free summaryへ集約する。
```

集計:

```text
- verdict_counts
- axis_score_averages
- blocker_counts
- execution_blocker_counts
- question_need_primary_class_counts
- ambiguity_kind_counts
- one_question_fit_counts
- repair_required_counts
- disposal_status
- r49_timeout_note
```

### R51-17: P5 confirmed / repair return / inconclusive decision

目的:

```text
P5 confirmed candidateへ進めるか、P5修正へ戻るか、inconclusiveかを分ける。
```

### R51-18: P6 limited human readfeel candidate handoff

目的:

```text
P5結果からP6へ進める候補を出す。
ただしP6 start allowedはtrueにしない。
```

### R51-19: P8 question design material candidate handoff

目的:

```text
P8詳細設計時に参照できるbody-free材料があるかを示す。
ただしP8 start allowedはtrueにしない。
```

### R51-20: no body leak / no question text / no-touch boundary validation

目的:

```text
R51のbody-free materialへ本文・質問本文・reviewer free text・local path・hashが混ざらないことを固定する。
また、RN / API / DB / runtime / P8実装へ差分が広がっていないことを確認する。
```

forbidden key refs:

```text
raw_input
raw_answer
comment_text
comment_text_body
returned_emlis_surface
bounded_owned_history_review_surface
current_input_review_surface
reviewer_free_text
reviewer_note
reviewer_notes
question_text
draft_question_text
question_body
local_absolute_path
body_content_hash
packet_content_hash
terminal_output
traceback
```

---

## 16. validation command matrix案

### 16.1 syntax / import候補

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference python -m py_compile \
  services/ai_inference/emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run.py
```

R51専用helperを作らない場合は、R50 helper import確認を維持します。

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference python -m py_compile \
  services/ai_inference/emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision.py
```

### 16.2 R51 target tests候補

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_*.py
```

### 16.3 R50 target regression

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_*.py
```

### 16.4 R49 regression split matrix

R49はwildcard一括でtimeoutしたため、R51ではsplit matrixを正式確認として扱います。

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

### 16.5 R48 regression

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_*.py
```

### 16.6 R47 regression

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r47_local_review_packet_policy_*.py
```

### 16.7 R46 / display / P5 core subset

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_projection_next_decision_r45_r46_20260617.py \
  tests/test_emlis_ai_p7_r46_next_decision_handoff_ledger_r14_20260617.py \
  tests/test_emlis_ai_p7_r46_p5_p6_human_readfeel_handoff_material_r10_r11_20260617.py \
  tests/test_emlis_ai_p7_r46_real_device_modal_review_closed_validation_r12_r13_20260617.py \
  tests/test_emlis_ai_display_contract.py \
  tests/test_emlis_ai_user_label_connection_material.py \
  tests/test_emlis_ai_user_label_connection_candidate.py \
  tests/test_emlis_ai_user_label_connection_gate.py \
  tests/test_emlis_ai_user_label_connection_surface.py \
  tests/test_emlis_ai_user_label_connection_public_boundary.py \
  tests/test_emlis_ai_user_label_connection_e2e_contract.py
```

### 16.8 backend collect-only

```bash
PYTHONPATH=services/ai_inference pytest --collect-only -q
```

### 16.9 RN no-touch optional confirmation

```bash
cd Cocolon
npm run test:rn-screens --silent
```

注意:

```text
- collect-onlyをfull backend suite greenにしない。
- RN contract greenを実機modal読感確認にしない。
- R50/R51 target greenをP5商品価値合格にしない。
- R49 split greenをR49 wildcard greenにしない。
```

---

## 17. 新規test設計案

### 17.1 必須test観点

```text
- R51開始時点でP5/P6/P7/P8/releaseがclosedのまま。
- R50 next_required_stepがactual local-only manual runであること。
- R49 wildcard timeout noteが隠されていないこと。
- R49 split matrix greenをR51 required evidenceとして扱うこと。
- admission envelopeがbody-freeであること。
- local root missing時にbody-full packet生成を許可しないこと。
- explicit allow missing時にbody-full packet生成を許可しないこと。
- repo / artifact / premise / implemented docs / release root配下をlocal review rootとして拒否すること。
- body-full generation authorizationはlocal-onlyでありbody-free export不可であること。
- 24-case review minimumを維持すること。
- reviewer-facing packetにfamily / tier / expectedが出ないこと。
- rating rowは6 axesすべてを持つこと。
- rating rowにreviewer free text / returned surface / raw inputが混ざらないこと。
- question observation rowにquestion text / draft question textが混ざらないこと。
- readfeel blockerとexecution blockerを混ぜないこと。
- P5の修正対象をP8 question candidateで隠さないこと。
- disposal receiptなしにsummary finalizeしないこと。
- disposal failedならP5 confirmed candidateがfalseになること。
- P5 confirmed candidateがtrue候補でもp7_complete / p8_start_allowed / release_allowedはfalseのまま。
- no-touch boundaryがRN / API / DB / runtime / public meta / P8実装を守ること。
```

### 17.2 negative test観点

```text
- question_textをbody-free rowに入れると落ちる。
- returned_emlis_surfaceをbody-free summaryに入れると落ちる。
- local_absolute_pathをbody-free receiptに入れると落ちる。
- body_content_hashをreceiptへ入れると落ちる。
- verdict=PASSかつnot_question_p5_surface_repair_requiredで落ちる。
- RED/REPAIR_REQUIREDなのにblocker_idなしで落ちる。
- 24件未満でp5_confirmed_candidate=trueにすると落ちる。
- disposal_status!=DISPOSAL_VERIFIEDでp5_confirmed_candidate=trueにすると落ちる。
- p8_start_allowed=trueにすると落ちる。
- release_allowed=trueにすると落ちる。
- R49 wildcard timeoutをgreen claimにすると落ちる。
```

---

## 18. actual manual run protocol案

この章は、R51実装後にmanual runを行う場合の手順案です。  
本設計書作成時点では実行しません。

### 18.1 開始前

```text
1. R51 target / R50 / R49 split / R48 / R47 / R46 / display / P5 core / RN optionalを確認する。
2. R49 wildcard timeout noteを残す。
3. local review rootをrepo外・artifact外に用意する。
4. explicit allowを設定する。
5. disposal planを確認する。
6. manual run decisionがGO_FOR_LOCAL_MANUAL_REVIEWであることを確認する。
```

### 18.2 packet生成

```text
1. 24-case matrixを読み込む。
2. blind_case_id単位でlocal-only body-full packetを生成する。
3. body-full packetが成果物候補に入っていないことを確認する。
4. body-free manifestにlocal path / hashを残さない。
```

### 18.3 人間レビュー

```text
1. reviewerはblind_case_id順に読む。
2. 各caseで6軸scoreとverdictを付ける。
3. 必要ならreadfeel blockerを選ぶ。
4. 問い必要性観察classを選ぶ。
5. free textを書いた場合もlocal-onlyとし、body-freeへ出さない。
```

### 18.4 body-free capture

```text
1. rating rowsをbody-freeへ正規化する。
2. readfeel blocker rowsをbody-freeへ正規化する。
3. execution blocker rowsをbody-freeへ正規化する。
4. question need observation rowsをbody-freeへ正規化する。
5. consistency guardを通す。
```

### 18.5 disposal

```text
1. rating / question observation capture後、body-full packetをpurgeする。
2. reviewer notesをpurgeする。
3. disposal receiptをbody-freeで作る。
4. body_removed=true / reviewer_notes_removed=true / local_packet_exported=falseを確認する。
```

### 18.6 summary / decision

```text
1. post-review summaryをbody-freeで作る。
2. P5 confirmed candidate / P5 repair return / inconclusiveを分ける。
3. P6 limited human readfeel start candidateを別判断として出す。
4. P8 question design material candidateを別判断として出す。
5. p7_complete=false / p8_start_allowed=false / release_allowed=falseを維持する。
```

---

## 19. 前提資料・実装済み資料反映方針

R51 actual review後に前提資料へ反映してよいもの:

```text
- review session id
- case_count
- rating row count
- verdict counts
- axis score averages
- blocker counts
- execution blocker counts
- question need primary class counts
- ambiguity kind counts
- one question fit counts
- repair required counts
- disposal status
- body_removed / reviewer_notes_removed booleans
- r49_wildcard_timeout_note
- p5 confirmed candidate / repair return / inconclusive
- p6 candidate boolean
- p8 material candidate boolean
- next required step
```

反映してはいけないもの:

```text
- raw input
- raw answer
- Emlis returned surface
- comment_text body
- owned history surface
- reviewer free text
- question text
- local path
- content hash
- terminal full output
```

前提資料更新時の注意:

```text
- P7完了条件を緩めない。
- P8開始条件を緩めない。
- review結果が悪い場合は、P5/P7修正対象として正直に残す。
- P5 confirmed candidateが出ても、release_allowedへ変換しない。
```

---

## 20. no-touch boundary

R51では、次を変更しません。

```text
RN production files
API route files
DB schema / migration files
Emlis reply runtime
User Label Connection runtime files
public feedback meta
public source lineage
runtime gate threshold files
P8 question trigger logic
P8 question API / DB / RN / response key
release material files
```

R51で触る候補は、実装段階でも次に限定します。

```text
services/ai_inference/emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run.py
tests/test_emlis_ai_p7_r51_p5_human_blind_qa_actual_local_manual_run_*.py
```

optional file ops helperを作る場合:

```text
services/ai_inference/emlis_ai_p7_r51_local_review_file_ops.py
```

既存R50 helperだけで足りる場合は、新規production helperを作らず、R51実行protocolとbody-free summaryだけを成果にします。

---

## 21. acceptance criteria

### 21.1 設計書としての完了条件

```text
- R51の目的がP5 actual local-only manual runであることを固定した。
- R51がP8観測補助問い詳細設計ではないことを固定した。
- R51がAPI / DB / RN / response key / 発生ロジックを触らないことを固定した。
- R50 handoff / R49 execution scaffold / R48 packet / R47 local-only / R46 handoff境界を引き継ぐことを固定した。
- R49 wildcard timeoutの扱いを隠さず設計した。
- local-only body-full packet生成の明示許可条件を定義した。
- 24-case actual review手順を定義した。
- rating row / question need observation row / disposal receipt / summaryのbody-free化を定義した。
- P5の弱さを問いで隠さないguardを定義した。
- P5 confirmed candidate / repair return / inconclusive / P6 candidate / P8 material candidateを分離した。
- JSON / schema案を設計書内に含め、実ファイル化しないことを明記した。
- 実装・実行順をR51-0〜R51-20で分けた。
- validation command matrix案を含めた。
```

### 21.2 R51実装後の完了条件候補

```text
- R51 target testsがgreen。
- R50 target regressionがgreen。
- R49 split regressionがgreen。
- R48 target regressionがgreen。
- R47 target regressionがgreen。
- R46 / display / P5 core subsetがgreen。
- backend collect-onlyが通る。
- optional RN contractがgreen。
- R49 wildcard timeout noteがbody-freeに残っている。
- R51 body-free materialに本文・質問本文・reviewer free text・local path・body hashが混じらない。
- R51 summaryがp7_complete / p8_start_allowed / release_allowedをtrueにしない。
```

### 21.3 actual manual review後の完了条件候補

```text
- P5 24-case actual reviewが実施されている。
- 24件すべてにrating rowがある。
- 24件すべてにquestion need observation rowがある。
- execution blockerがOPENで残っていない、または未解決として明示されている。
- RED / REPAIR_REQUIRED / readfeel blockerが0、またはP5/P7修正対象として明示されている。
- question observationのrepair_required classが0、またはP5/P7修正対象として明示されている。
- disposal receiptがあり、body_removed=true / reviewer_notes_removed=true / local_packet_exported=false。
- P5 confirmed candidate / repair return / inconclusiveがbody-freeで説明可能。
- P6 limited human readfeel start candidateが、P5結果に基づき別判断として説明可能。
- P8観測補助問い詳細設計へ渡すbody-free summaryが存在する。
- P8 start allowed / release allowedは別判断としてfalseのまま。
```

---

## 22. R51でしてはいけないこと

```text
- P8観測補助問い詳細設計を始める。
- 観測補助問いのAPI / DB / RN UI / response keyを設計確定する。
- 問い発生ロジックを実装する。
- 問い回答の保存schemaを決める。
- question need observation rowにquestion textを入れる。
- Emlis本体の読感不足を問い返しで補う扱いにする。
- P5履歴線の弱さを、P8の新機能で覆い隠す。
- body-full packetを成果物や前提資料へ混ぜる。
- reviewer free textをbody-free materialへ残す。
- local path / content hashをbody-free materialへ残す。
- R50 greenやR51 designをP5合格・P7完了・P8開始許可・release許可へ変換する。
- R49 split greenをR49 wildcard greenへ変換する。
- full backend collect-onlyをfull backend suite greenへ変換する。
- RN contract greenを実機modal読感確認へ変換する。
- Gateを緩める。
- fixed commentText / case専用surface / case専用modeを追加する。
```

---

## 23. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- Mash指定によりGitHub接続確認は不要。実施していない。
- Cocolon_前提資料(241).zipを展開し、READ FIRST、作業姿勢、思想、EmlisAI是正方針を確認した。
- 指定ロードマップを確認した。
- P7/P8 Bridgeでは、P7中に観測補助問いを実装せず、body-free問い必要性観察メモだけを残す扱いである。
- R47/R48/R49/R50設計を確認した。
- R50 helper上のnext_required_stepは `P5_human_blind_qa_actual_review_local_only_manual_run_after_R50_boundary_freeze`。
- R50 implemented_stepsはR50-0〜R50-20、not_yet_implemented_stepsはempty。
- R48 case matrixは24件で、positive 20件、boundary 4件を持つ。
- R50 target 99 passed、R48 82 passed、R47 275 passed、R46/display/P5 core subset 94 passed、RN contract 36 passed、backend collect-only 3466 collectedと検討メモ上で確認済み。
- R49 split executionは76 passed。
- R49 wildcard一括実行はtimeoutで、原因未分類。
- 現在の大枠PhaseはP7である。
- P8 start allowed / P7 complete / release_allowedはfalse扱いのまま進めるべきである。
```

### 未確認

```text
- P5 actual human Blind QAの実レビュー結果。
- body-full review packetの実生成。
- reviewer rating rowsの実記入。
- question need observation rowsの実記入。
- body-full packet / reviewer notesの実廃棄。
- disposal receiptの実作成。
- P5 confirmed candidateの実判定。
- P5 repair returnの実判定。
- P5 inconclusiveの実判定。
- P6 limited human readfeel start candidateの実判定。
- P8 question design material candidate summaryの実内容。
- 実機modal読感。
- full backend suite execution green。
- 外部ユーザー検証。
- R49 wildcard timeout原因。
```

### 書かれていない

```text
- R51設計書を作っただけでactual reviewが完了するとは書かれていない。
- R51 manual run GOをP5合格へ変換してよいとは書かれていない。
- P5 review未実施のままP8詳細設計へ進んでよいとは書かれていない。
- question need observation rowを理由にP5修正を回避してよいとは書かれていない。
- body-full packetを成果物zip、前提資料zip、実装済み資料zip、release materialへ混ぜてよいとは書かれていない。
- R49 wildcard timeoutをsplit greenでなかったことにしてよいとは書かれていない。
```

### 推測禁止

```text
- 「P5は安全寄りだから問題ない」と読むこと。
- 「問いがあれば補えそう」をP5修正不要の根拠にすること。
- 「GO_FOR_LOCAL_MANUAL_REVIEW」をP5 confirmed candidateと読むこと。
- 「P5 confirmed candidate」をrelease readinessと読むこと。
- 「P8 material candidate」をP8 start allowedと読むこと。
- 「R49 split green」をR49 wildcard greenと読むこと。
```

### 次に実行すべきこと

```text
1. R51を実装段階へ進める場合、R51-0から開始する。
2. 既存R50 helperだけで実レビュー運用に足りるかを確認する。
3. 足りない場合だけ、R51 P7専用helperとR51 target testsを追加する。
4. R51 target tests + R50/R49 split/R48/R47/R46/display/P5 core/RN regressionを実行する。
5. R51 preflightがGOになった場合だけ、local-only body-full packet生成へ進む。
6. 24-case actual review、rating記入、question observation row記入、disposal、body-free summaryを行う。
7. actual review結果が出るまで、P8詳細設計へ進まない。
```

---

## 24. 華恋の意見

華恋の意見として、R51では新しい賢い機能を作るより、**今あるP5履歴線を実際に読むこと**を優先するべきです。

R47〜R50で、local-only / body-free / disposal / no body leak / no question text / no-touch boundaryはかなり細かく固定されています。  
ここまで来てまだ実レビューを避けると、Cocolonは「安全な測定器」は増えても、「記録が返ってきた感」が本当にあるかを確認できません。

R51で一番危ないのは、body-full packetそのものではなく、**body-fullを扱った後に境界が曖昧になること**です。

```text
- packetを成果物に混ぜない。
- reviewer free textをbody-free summaryへ残さない。
- question textを作らない。
- P5の弱さを問いで隠さない。
- R49 wildcard timeoutをなかったことにしない。
```

Cocolonとして見るべきものは、「問いを出せるか」ではありません。  
見るべきものは、P5履歴線が、ユーザーにとって「自分の記録が雑に処理されず、線として返ってきた」と感じられるかです。

だからR51は、Cocolonとして必要な段階です。  
ただし、良い結果を期待して読むのではなく、悪い結果もP5修正対象として正直に残す前提で進めるべきです。
