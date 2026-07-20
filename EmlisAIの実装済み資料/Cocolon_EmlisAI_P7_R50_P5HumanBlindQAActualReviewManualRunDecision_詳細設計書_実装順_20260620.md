# Cocolon / EmlisAI P7-R50 P5 Human Blind QA Actual Review Manual Run Decision 詳細設計書・実装順

作成日: 2026-06-20 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / P5 User Label Connection / P5 Human Blind QA / P7-P8 Bridge / 観測補助問い必要性観察  
正式採番: P7-R50  
設計名: P5 Human Blind QA Actual Review Manual Run Decision  
GitHub接続確認: Mash指定により不要。未実施。  
コード変更: なし。  
json / schema実ファイル化: なし。本書内のjson / schema案は、実装段階で現物コード・既存schema配置・既存testと照合して採否判断する。  
body-full review packet生成: なし。  
P5 Human Blind QA実レビュー: なし。  
API / DB / RN UI / public response key変更: なし。  
P8観測補助問い詳細設計: なし。  
release判断: なし。  

---

## 0. この設計書の結論

R50で進める段階は、次です。

```text
P7-R50:
P5 Human Blind QA Actual Review Manual Run Decision
```

R50は、R49で固定されたP5実レビュー実行の器を使い、**実際に人間が読むP5 Human Blind QAへ進めるかどうかを、local-only / body-free境界を壊さずに決めるための段階**です。

R50で中心に置くものは、次です。

```text
1. P5 actual review manual run を開始してよいかのGO / NO_GO / BLOCKED判断
2. GOの場合だけ許可されるlocal-only body-full packet生成条件
3. 24-case first formal reviewの手順
4. rating row / readfeel blocker / execution blocker / question need observation rowの記入手順
5. disposal receipt確認
6. body-free summary化
7. P5 confirmed candidate / P5 repair return / P6 limited human readfeel candidate / P8 question design material candidate の分離判断
```

R50でしてはいけないことは、次です。

```text
- P8観測補助問いの詳細設計を始めない。
- 観測補助問いのAPI / DB / RN UI / response key / 発生ロジック / 保存schemaを決めない。
- P5の読感不足を、問いがないことに転嫁しない。
- body-full packetを成果物、前提資料、実装済み資料、public meta、release materialへ混ぜない。
- 自動test greenをP5商品価値合格へ変換しない。
- P5 confirmed candidateをrelease readinessへ変換しない。
```

華恋の判断は、次です。

```text
R49までで「安全に読むための器」は成立している。
ただし、まだ誰も実際のP5履歴線を読んでいない。
したがって、次は機能追加ではなく、local-onlyでP5履歴線を人間が読み、
Cocolonとして「ここに残す意味がある」体験へ届いているかを判定する段階である。
```

---

## 1. なぜこの作業を行うのか

Cocolonの価値は、ユーザーの入力をただ保存することでも、AIが優しい返答をすることでもありません。

Cocolonが目指す姿は、次です。

```text
ユーザーの言葉・感情・カテゴリ・行動・時点・過去記録が、
入力直後に「読まれた形」で返り、
ユーザーが「ここに残す意味がある」と感じられること。
```

P5 User Label Connectionは、この価値の中核です。  
履歴線が自然に返れば、Cocolonは普通のAI相談ではなく「自分の記録が積み上がる場所」になります。

ただし、P5履歴線は危険も持ちます。

```text
- 監視されている感じが出る。
- 「あなたはいつも」へ寄る。
- 原因断定・性格断定へ寄る。
- 現在入力の弱さを履歴で補完する。
- 低情報入力を履歴で深読みする。
- 自己責めを増幅する。
- 汎用追記に見えて、Cocolon固有価値として届かない。
```

だから、P5は自動testだけでは完了できません。  
人間が実際に本文を読み、次を確認する必要があります。

```text
- 履歴線が「自分の記録が返ってきた」感になっているか。
- 汎用説明や安全テンプレに見えないか。
- 監視感・決めつけ・深読み・自己責め増幅がないか。
- Cocolonにまた残したい感覚へ接続しているか。
- P5の弱さをP8の問いで覆い隠していないか。
```

R50は、この実レビューへ入る前に、開始条件・実行手順・廃棄確認・body-free化・次判断を固定するための設計です。

---

## 2. 参照・確認範囲

### 2.1 作業姿勢として確認した前提資料

```text
Cocolon_前提資料(239).zip
  - Cocolon_前提資料/00_karen_read_first.md
  - Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
  - Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
  - Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
  - Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
  - Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
  - Cocolon_前提資料/cocolon_thought_material_for_karen.md
  - Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
  - Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
  - Cocolon_前提資料/Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md
```

作業姿勢として固定すること:

```text
- 前提資料だけで判断しない。実ファイルも見る。
- 見ていないものを確認済みにしない。
- 設計と実装を混ぜない。
- test greenを商品価値合格へ変換しない。
- Cocolonをメンタル問題にせず、商品品質として扱う。
- EmlisAIをテンプレ共感・浅い復唱・診断ラベルへ逃がさない。
- public contract / DB write path / RN表示条件 / ユーザーデータ保護を勝手に変えない。
- 華恋の意見は、確認済み事実・未確認・影響範囲と分ける。
```

### 2.2 ロードマップとして確認した資料

```text
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(2).md
```

確認した中心:

```text
- 現在の大枠はP7 Product Quality Runner / Long-run Product Gate。
- P7/P8 Bridgeでは、P5 human Blind QA / P6 limited human readfeel / 実機modal確認中に、body-freeの問い必要性観察メモを残す。
- P7では観測補助問いのAPI / DB / RN UI / response key / 発生ロジック / 保存schemaを実装しない。
- P8開始時に、収集した問い必要性観察メモを観測補助問い詳細設計の材料にする。
- P7完了条件もP8完了条件も、観測補助問い追記で緩めない。
```

### 2.3 検討メモ

```text
Cocolon_EmlisAI_P7_R50_P5HumanBlindQAActualReviewManualRunDecision_PreDesignMemo_20260620.md
```

検討メモで固定された次工程:

```text
P7-next / R50候補:
P5 Human Blind QA Actual Review Manual Run Decision
```

### 2.4 実装済み資料

```text
EmlisAIの実装済み資料(72).zip
  - Cocolon_EmlisAI_P7_R47_LocalReviewPacketPolicy_DetailedDesign_ImplementationOrder_20260618.md
  - Cocolon_EmlisAI_P7_R48_P5HumanBlindQAActualReviewPacket_詳細設計書_実装順_20260618.md
  - Cocolon_EmlisAI_P7_R49_P5HumanBlindQA_QuestionNeedObservation_詳細設計書_実装順_20260619.md
```

### 2.5 現行実ファイル

```text
mashos-api(158).zip
  - mashos-api/ai/services/ai_inference/emlis_ai_p7_r47_local_review_packet_policy.py
  - mashos-api/ai/services/ai_inference/emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet.py
  - mashos-api/ai/services/ai_inference/emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution.py
  - mashos-api/ai/tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_*.py
```

R49 helper上の現在地:

```text
P7_R49_R18_IMPLEMENTED_STEPS: R49-0〜R49-18
P7_R49_R18_NOT_YET_IMPLEMENTED_STEPS: empty
P7_R49_R18_NEXT_REQUIRED_STEP_REF: P5_human_blind_qa_actual_review_manual_run_decision
```

---

## 3. 現在地の固定

### 3.1 現在Phase

```text
現在Phase:
P7 Product Quality Runner / Long-run Product Gate
```

より細かくは、次です。

```text
P7 Product Quality Runner 内の、
P5 Human Blind QA actual review execution scaffold finalized 後。
```

### 3.2 確認済み

```text
- R49 helper上のnext_required_stepは `P5_human_blind_qa_actual_review_manual_run_decision`。
- R49 targetは分割実行で76 passed。
- R48 target regressionは82 passed。
- R47 regressionは275 passed。
- R46 regressionは19 passed。
- Display contract / P5 core subsetは68 passed / 1 warning。
- backend collect-onlyは3367 tests collected / 1 warning。
- RN contractは36 passed。
- P8 start allowed / P7 complete / release_allowedはfalse扱いのまま進めるべきである。
```

### 3.3 未確認

```text
- P5 actual human Blind QAの実レビュー結果。
- body-full review packetの実生成。
- reviewer rating rowsの実記入。
- question need observation rowsの実記入。
- body-full packet / reviewer notesの実廃棄。
- disposal receiptの実作成。
- P5 confirmed candidateの実判定。
- P5 repair returnの実判定。
- P6 limited human readfeel start candidateの実判定。
- P8 question design material candidate summaryの実内容。
- 実機modal読感。
- full backend suite execution green。
- 外部ユーザー検証。
```

### 3.4 R50で扱う赤ではないが、未完了blockerとして扱うもの

```text
- P5 actual human Blind QA未実施。
- body-full packet未生成。
- actual rating rows未作成。
- actual question need observation rows未作成。
- disposal未実行。
- full backend suite execution green未確認。
- 実機modal読感未確認。
```

これらは、現時点でtest redではありません。  
ただし、商品価値確認としては未完了です。

### 3.5 書かれていない

```text
- R49 R0〜R18完了をP5 actual review完了と読んでよいとは書かれていない。
- R49 target greenをP5商品品質合格と読んでよいとは書かれていない。
- P5 review未実施のままP8詳細設計へ進んでよいとは書かれていない。
- question need observation rowを理由にP5修正を回避してよいとは書かれていない。
- body-full packetを成果物zip、前提資料zip、実装済み資料zip、release materialへ混ぜてよいとは書かれていない。
- P6 limited human readfeelをP5未確認のまま開始してよいとは書かれていない。
- release_allowedをtrueにしてよいとは書かれていない。
```

### 3.6 推測禁止

```text
- 「R49 target greenだからP5読感は問題ない」と読むこと。
- 「問い必要性観察rowがあるからP8へ進める」と読むこと。
- 「問いがあれば補えそう」をP5修正不要の根拠にすること。
- 「安全寄りの履歴線だから商品価値も十分」と読むこと。
- 「body-free schemaがあるから本文取り扱いは安全」と読むこと。
- collect-onlyをfull backend suite execution greenと読むこと。
- RN contract greenを実機modal読感確認済みと読むこと。
- P5 confirmed candidateをrelease readinessと読むこと。
```

---

## 4. R50の対象と非対象

### 4.1 R50で扱う対象

```text
1. R49 handoff / current source / local snapshotの再固定
2. P5 actual review manual run GO / NO_GO / BLOCKED判定
3. local-only body-full packet生成の明示許可条件
4. review session開始・進行・一時停止・中断・blocked・完了の状態遷移
5. 24-case first formal reviewの実行単位
6. reviewer rating row記入手順
7. readfeel blocker / execution blockerの分離手順
8. question need observation row記入手順
9. P5の弱さを問いで隠さないguard
10. disposal receipt作成・確認・失敗時の扱い
11. body-free summaryへの変換
12. P5 confirmed candidate / P5 repair return / inconclusive の分岐
13. P6 limited human readfeel start candidateの分離判断
14. P8 question design material candidateへ渡すbody-free summary条件
15. 実レビュー後の前提資料 / 実装済み資料反映方針
```

### 4.2 R50で扱わない対象

```text
- 観測補助問いのAPI設計
- 観測補助問いのDB設計
- 観測補助問いのRN UI設計
- public response key追加
- 問い発生ロジック
- 問い回答保存schema
- Emlis本文runtime変更
- User Label Connection runtime変更
- Gate threshold変更
- RN表示条件変更
- DB write path変更
- public meta仕様変更
- release_allowed true化
- P8 start allowed true化
- P7 complete true化
- full backend suite greenの代替主張
```

### 4.3 R50の名前

実装段階でのmodule名候補は、次です。

```text
services/ai_inference/emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision.py
```

optional helperを分ける場合だけ、次を候補にします。

```text
services/ai_inference/emlis_ai_p7_r50_local_review_manual_run_file_ops.py
```

ただし、optional helperは、local-only file ops / purge / receipt補助に限定します。  
runtime、API、DB、RN、public meta、P8実装へ広げません。

---

## 5. R50の基本設計

### 5.1 R50で扱う五層

R50では、同じreview sessionの中に五層を持ちます。

```text
Layer A: manual run decision layer / body-free
  P5実レビューを開始してよいかをGO / NO_GO / BLOCKEDで判定する。
  自動test結果、R49 handoff、local root、explicit allow、disposal planを確認する。

Layer B: local-only body-full handling layer / local-only
  GO後だけ、body-full reviewer packet生成を許可する。
  生成物はlocal-onlyであり、成果物・前提資料・実装済み資料・public metaへ混ぜない。

Layer C: human review execution layer / local-only + body-free export
  reviewerはblind_case_id単位でbody-full packetを読む。
  ただしbody-freeへ残すのはrating / blocker / question observation enum / counts / booleansだけ。

Layer D: disposal verification layer / body-free
  body-full packetとreviewer notesの廃棄を確認し、body-free receiptへ変換する。
  path / hash / 本文preview / reviewer free textは残さない。

Layer E: post-review decision layer / body-free
  P5 confirmed candidate、P5 repair return、P6 candidate、P8 material candidateを分けて判断する。
```

### 5.2 R50 session status enum案

```text
NOT_STARTED
PRECHECK_BLOCKED
READY_FOR_LOCAL_BODY_FULL_PACKET_GENERATION
BODY_FULL_PACKETS_CREATED_LOCAL_ONLY
REVIEW_IN_PROGRESS
REVIEW_PAUSED
REVIEW_ABORTED
RATINGS_CAPTURED_BODYFREE
QUESTION_OBSERVATIONS_CAPTURED_BODYFREE
DISPOSAL_PENDING
DISPOSAL_VERIFIED
SUMMARY_READY
DECISION_FINALIZED
BLOCKED
```

読み方:

```text
NOT_STARTED:
  R50 manual run decision未開始。

PRECHECK_BLOCKED:
  R49 handoff、test evidence、local root、explicit allow、disposal planのどれかで止まっている。

READY_FOR_LOCAL_BODY_FULL_PACKET_GENERATION:
  body-full生成前のpreflightが通った状態。
  まだbody-full packetは生成されていない。

BODY_FULL_PACKETS_CREATED_LOCAL_ONLY:
  local-only rootにbody-full packetが生成された状態。
  この状態のまま成果物化してはいけない。

REVIEW_IN_PROGRESS:
  reviewerが実読中。

REVIEW_PAUSED:
  reviewを一時停止した状態。retention deadlineは止めない。

REVIEW_ABORTED:
  review中止。body-full packetが存在する場合はpurge必須。

RATINGS_CAPTURED_BODYFREE:
  rating rowsがbody-freeとして揃った状態。

QUESTION_OBSERVATIONS_CAPTURED_BODYFREE:
  question need observation rowsがbody-freeとして揃った状態。

DISPOSAL_PENDING:
  rating / question observation後、body-full packetとreviewer notesの廃棄待ち。

DISPOSAL_VERIFIED:
  disposal receiptでbody_removed=true / reviewer_notes_removed=trueを確認した状態。

SUMMARY_READY:
  body-free summaryが作成できる状態。

DECISION_FINALIZED:
  P5 confirmed candidate / repair return / inconclusive等の判断がbody-freeで固定された状態。

BLOCKED:
  未解決blockerにより続行不可。
```

### 5.3 manual run decision enum案

```text
GO_FOR_LOCAL_MANUAL_REVIEW
NO_GO_MISSING_R49_HANDOFF
NO_GO_TARGET_OR_REGRESSION_EVIDENCE_MISSING
NO_GO_LOCAL_ROOT_UNSAFE
NO_GO_EXPLICIT_ALLOW_MISSING
NO_GO_DISPOSAL_PLAN_UNSAFE
NO_GO_REVIEWER_UNAVAILABLE
NO_GO_SCOPE_DRIFT
NO_GO_BODY_FREE_LEAK_RISK
BLOCKED_BY_EXECUTION_BLOCKER
```

### 5.4 R50で生成してよいもの / 生成してはいけないもの

生成してよいもの:

```text
- body-free manual run decision envelope
- body-free start preflight summary
- local-only body-full packet generation request
- local-only reviewer packet / reviewer form
- body-free rating rows
- body-free readfeel blocker rows
- body-free execution blocker rows
- body-free question need observation rows
- body-free disposal receipt
- body-free post-review summary
- body-free P5 / P6 / P8 candidate handoff
```

生成してはいけないもの:

```text
- public response key
- DB migration / DB schema
- RN UI
- API route
- P8 question trigger logic
- question text / draft question text material
- question answer persistence schema
- release material
- body-full packet included in artifact zip
- body-full packet included in premise zip
- body-full packet included in implemented-material zip
- body content hash / local path in body-free summary
```

---

## 6. local-only body-full / body-free境界

### 6.1 local review root

R47で固定されたlocal root env varを継続します。

```text
COCOLON_EMLIS_LOCAL_REVIEW_ROOT
```

R50でlocal rootに求める条件:

```text
- absolute pathである。
- repo root配下ではない。
- /mnt/data artifact root配下ではない。
- export root配下ではない。
- git / zip / docs / release / implemented materials / premise materials と混ざらない。
- R50実行者が明示的にlocal-only rootとして指定している。
```

### 6.2 explicit allow

body-full packet生成は、local rootがあるだけでは許可しません。  
実装段階では、明示的なallow tokenまたはCLI flagを要求します。

候補:

```text
COCOLON_EMLIS_P7_R50_ALLOW_BODY_FULL_PACKET=LOCAL_ONLY_REVIEW_CONFIRMED
```

またはCLI引数:

```text
--allow-local-body-full-review-packet LOCAL_ONLY_REVIEW_CONFIRMED
```

allowの意味:

```text
- body-full packetには本文が含まれる可能性がある。
- packetはlocal-onlyである。
- review完了後または中断後に廃棄する。
- 成果物・前提資料・実装済み資料・release materialへ入れない。
- body-free summaryには本文、path、hash、reviewer free text、質問本文を残さない。
```

### 6.3 local-only directory構造案

実装段階で採用判断する案です。

```text
${COCOLON_EMLIS_LOCAL_REVIEW_ROOT}/
  p7_r50_p5_human_blind_qa_actual_review/
    session_<review_session_id>/
      body_full_packets.local_only/
        packet_<blind_case_id>.json
      reviewer_forms.local_only/
        reviewer_form_<blind_case_id>.json
      reviewer_notes.local_only/
        note_<blind_case_id>.md
      bodyfree_rows.to_export_after_purge/
        rating_rows.jsonl
        blocker_rows.jsonl
        execution_blocker_rows.jsonl
        question_need_observation_rows.jsonl
      disposal_receipts.bodyfree/
        disposal_receipt.json
      summary.bodyfree/
        post_review_decision_summary.json
```

注意:

```text
- `bodyfree_rows.to_export_after_purge/` は、body-full purge確認後にだけ成果物候補へ渡せる。
- `body_full_packets.local_only/` と `reviewer_notes.local_only/` は成果物化禁止。
- body-free rowにもlocal absolute pathを残さない。
```

### 6.4 body-fullに入ってよいもの

local-only reviewer packetに限って、次を入れてよい候補にします。

```text
- blind_case_id
- packet_ref_id
- review_prompt_version
- current_input_review_surface
- returned_emlis_surface
- bounded_owned_history_review_surface
- plan/tierがreviewer blind性を壊さない範囲の抽象表示
- reviewer rating form
- question need observation selection form
- disposal reminder
```

ただし、これらはlocal-onlyです。body-freeへ出してはいけません。

### 6.5 body-fullに入れてはいけないもの

```text
- real user id
- DB primary key
- raw local path
- content hash
- backend stack trace
- terminal full output
- 実行者の個人メモで成果物へ残るもの
- controller expected result
- gate expected result
- family / tier / boundary labelを、blind性を壊す形でreviewerへ出すこと
```

### 6.6 body-freeに残してよいもの

```text
- review_session_id
- blind_case_id
- case_ref_id
- packet_ref_id
- family
- case_role
- subscription_tier_ref
- rating axis scores
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
- counts / booleans
```

### 6.7 body-freeに残してはいけないもの

```text
raw_input
raw_answer
memo
memo_action
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
stdout
stderr
traceback
```

---

## 7. P5 first formal review case design

### 7.1 最小case数

R50では、R47/R48で固定済みのP5 first formal review minimumを維持します。

```text
minimum_total_cases: 24
minimum_per_family: 2
minimum_history_line_eligible_input: 4
minimum_owned_history_positive_cases: 12
minimum_block_boundary_cases:
  low_information_history_not_eligible: 2
  free_tier_history_present_not_allowed: 2
```

### 7.2 R50 first formal review matrix

R48のcase distributionを引き継ぎます。

```text
history_line_eligible_input: 4 cases / positive_history_line
standard_state_answer_owned_history: 4 cases / positive_owned_history
self_understanding_owned_history: 3 cases / positive_owned_history
uncertainty_support_owned_history: 3 cases / positive_owned_history
change_future_intention_owned_history: 3 cases / positive_owned_history
relationship_gratitude_recovery_owned_history: 3 cases / positive_owned_history
low_information_history_not_eligible: 2 cases / boundary_no_history_line
free_tier_history_present_not_allowed: 2 cases / boundary_no_history_line
```

合計:

```text
24 cases
```

### 7.3 24-case reviewで必須にすること

```text
- 24件すべてにrating rowが必要。
- 24件すべてにquestion need observation rowが必要。
- review不能caseにはexecution blocker rowが必要。
- execution blockerがあるcaseはreadfeel REDと混ぜない。
- readfeel blockerがあるcaseを、問い候補で隠さない。
- 24件未満でP5 confirmed candidateへ進めない。
- body-full packet生成後はdisposal receiptなしにsummary finalizeしない。
```

### 7.4 reviewer blind policy

reviewerに出すもの:

```text
- blind_case_id
- current input surface
- returned Emlis surface
- bounded owned history surface
- rating axes
- question observation selection
```

reviewerに出さないもの:

```text
- case_ref_id
- controller expected result
- gate expected result
- exact family label
- subscription tier label
- internal reason ids
- P5 confirmed candidate条件
- P8 material candidate条件
```

理由:

```text
reviewerが「これはPlusだから履歴線が出るべき」「これは境界caseだから出てはいけない」と先読みすると、
実際の読感ではなく仕様一致評価へ寄るため。
```

---

## 8. reviewer rating設計

### 8.1 rating axes

R50では、R46/R48で固定されたP5 axesを維持します。

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

R48のreviewable verdictを維持します。

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

R48のblocker idを維持し、R49で追加された「問いで隠さない」観点をR50手順で強制します。

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

R50での扱い:

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
R50で問いそのものを作るためのものではありません。

R50で残すべきもの:

```text
- 問いなしで十分観測できたか。
- 問いがあれば補完リスクを下げられたか。
- 問いを出すと入力直後の観測体験を重くしないか。
- 1問で足りる曖昧さか。
- 問いではなくEmlis本体の観測力で返すべきか。
- Plus向け1問候補か、Premium深掘り候補か。
```

R50で残してはいけないもの:

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

R49のenumをcanonicalとして維持します。

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

R50では、rating rowとquestion need observation rowの整合を必ず見ます。

不整合例:

```text
- verdict=PASS なのに question_need_primary_class が not_question_*_repair_required。
- verdict=RED / REPAIR_REQUIRED なのに question_need_primary_class が plus_single_question_candidate_later だけ。
- one_question_fit_ref=repair_required_not_question なのに repair_required_refs が no_repair_required のみ。
- question_need_primary_class=insufficient_material_execution_blocker なのに execution blocker rowがない。
- blocker_id=p5_history_creepy_or_surveillance_feeling なのに P8 material candidate扱いにしている。
- blocker_id=p5_current_input_overridden_by_history なのに「問いがあればよい」としてP5修正を回避している。
```

R50での結論:

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

### 10.2 R50 execution blocker id案

```text
r50_missing_r49_handoff
r50_missing_r49_target_green_evidence
r50_missing_r48_regression_green_evidence
r50_missing_r47_regression_green_evidence
r50_missing_r46_regression_green_evidence
r50_missing_display_p5_core_green_evidence
r50_local_review_root_missing
r50_local_review_root_invalid
r50_explicit_allow_missing
r50_disposal_plan_missing
r50_body_full_packet_generation_failed
r50_body_full_packet_export_violation
r50_review_aborted_before_rating
r50_rating_rows_incomplete
r50_question_need_observation_rows_incomplete
r50_body_free_leak_detected
r50_disposal_receipt_missing
r50_disposal_failed
r50_disposal_not_verified
r50_scope_drift_detected
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
```

---

## 11. disposal / retention設計

### 11.1 retention

R47/R48のretentionを維持します。

```text
body_full_packet_retention_max_hours: 72
reviewer_notes_retention_after_rating_finalized_max_hours: 24  # R47/R48 formal
reviewer_notes_retention_after_rating_hours: 24                # R50 request field
```

整理した正式判断:

```text
- R47/R48の正式値は、reviewer notes retention after rating finalized 最大24時間。
- R50もこの値を継承し、0へ独自に寄せない。
- 24時間は「成果物へ出してよい」「body-freeへ保持してよい」という意味ではない。
- reviewer notesはlocal-onlyで、rating / blocker / question observation rowへ変換後はpurge対象。
- 可能な限り早くpurgeする運用は推奨するが、contract上の最大保持時間は24時間として固定する。
```

優先順位:

```text
1. rating / blocker / question observation rowがfinalizeされたら、body-full packetは即purge対象。
2. reviewer notesはlocal-onlyのまま、rating finalized後24時間以内にpurge必須。
3. review session cancelled / abortedなら、body-full packetとreviewer notesを即purge対象。
4. body-full packetは72時間を超えたら、rating未完でもpurge必須。
```

### 11.2 disposal status

R47 disposal statusを継続します。

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
- disposal_status=DISPOSAL_FAILED
- body_removed=false または reviewer_notes_removed=false
- p5_confirmed_candidate=false
- p6_limited_human_readfeel_start_candidate=false
- p8_question_design_material_candidate=false
- release_allowed=false
- p7_complete=false
- execution_blocker_id=r50_disposal_failed
```

---

## 12. post-review decision設計

### 12.1 R50後に分ける判断

実レビュー後の判断は、次の4つを分けます。

```text
1. P5 confirmed candidateへ進めるか。
2. P5 repair returnへ戻すべきか。
3. P6 limited human readfeel start candidateへ進めるか。
4. P8 question design material candidateとして使えるbody-free summaryがあるか。
```

これらを混同しません。

### 12.2 P5 confirmed candidate条件

R50でP5 confirmed candidateをtrue候補にできる条件:

```text
- 24 casesすべてreview完了。
- 24 rating rows complete。
- 24 question need observation rows complete。
- execution blocker OPENが0。
- disposal receiptあり。
- disposal_status=DISPOSAL_VERIFIED。
- body_removed=true。
- reviewer_notes_removed=true。
- local_packet_exported=false。
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
```

### 12.5 P6 limited human readfeel start candidate条件

P6へ進む候補にできる条件:

```text
- P5 confirmed candidate=true候補。
- P5 repair return=false。
- P5履歴線がP6の深い読解で覆い隠される危険が低い。
- P6 limited familyに進めても、P5弱さの補修にならない。
- disposal verified。
```

禁止:

```text
p6_limited_human_readfeel_start_allowed=true にはしない。
R50で出せるのは candidate だけ。
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
```

R50で出してよいもの:

```text
p8_question_design_material_candidate=true/false
primary_class_counts
ambiguity_kind_counts
one_question_fit_counts
repair_required_counts
missing_requirement_refs
```

R50で出してはいけないもの:

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

### 13.1 `p7_r50_manual_run_decision.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r50.manual_run_decision.bodyfree.v1",
  "title": "P7 R50 P5 Human Blind QA Manual Run Decision Body-Free Envelope",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "phase",
    "step",
    "scope",
    "review_session_id",
    "r49_handoff_ref",
    "required_case_count",
    "manual_run_decision",
    "manual_run_decision_reason_refs",
    "precondition_flags",
    "local_only_body_full_generation_allowed",
    "actual_human_review_run_here",
    "body_full_packet_generated_here",
    "api_db_rn_response_key_changed_here",
    "p7_complete",
    "p8_start_allowed",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r50.manual_run_decision.bodyfree.v1"
    },
    "phase": { "const": "P7" },
    "step": { "const": "R50_P5HumanBlindQAActualReviewManualRunDecision_20260620" },
    "scope": { "const": "p5_human_blind_qa_actual_review_manual_run_decision" },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "r49_handoff_ref": { "type": "string", "minLength": 1, "maxLength": 160 },
    "required_case_count": { "const": 24 },
    "manual_run_decision": {
      "enum": [
        "GO_FOR_LOCAL_MANUAL_REVIEW",
        "NO_GO_MISSING_R49_HANDOFF",
        "NO_GO_TARGET_OR_REGRESSION_EVIDENCE_MISSING",
        "NO_GO_LOCAL_ROOT_UNSAFE",
        "NO_GO_EXPLICIT_ALLOW_MISSING",
        "NO_GO_DISPOSAL_PLAN_UNSAFE",
        "NO_GO_REVIEWER_UNAVAILABLE",
        "NO_GO_SCOPE_DRIFT",
        "NO_GO_BODY_FREE_LEAK_RISK",
        "BLOCKED_BY_EXECUTION_BLOCKER"
      ]
    },
    "manual_run_decision_reason_refs": {
      "type": "array",
      "items": { "type": "string", "maxLength": 160 },
      "uniqueItems": true
    },
    "precondition_flags": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "r49_target_green_evidence_present",
        "r48_regression_green_evidence_present",
        "r47_regression_green_evidence_present",
        "r46_regression_green_evidence_present",
        "display_p5_core_green_evidence_present",
        "rn_contract_green_evidence_present",
        "local_review_root_safe",
        "explicit_allow_present",
        "disposal_plan_ready",
        "body_free_summary_path_ready"
      ],
      "properties": {
        "r49_target_green_evidence_present": { "type": "boolean" },
        "r48_regression_green_evidence_present": { "type": "boolean" },
        "r47_regression_green_evidence_present": { "type": "boolean" },
        "r46_regression_green_evidence_present": { "type": "boolean" },
        "display_p5_core_green_evidence_present": { "type": "boolean" },
        "rn_contract_green_evidence_present": { "type": "boolean" },
        "local_review_root_safe": { "type": "boolean" },
        "explicit_allow_present": { "type": "boolean" },
        "disposal_plan_ready": { "type": "boolean" },
        "body_free_summary_path_ready": { "type": "boolean" }
      }
    },
    "local_only_body_full_generation_allowed": { "type": "boolean" },
    "actual_human_review_run_here": { "const": false },
    "body_full_packet_generated_here": { "const": false },
    "api_db_rn_response_key_changed_here": { "const": false },
    "p7_complete": { "const": false },
    "p8_start_allowed": { "const": false },
    "release_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 13.2 `p7_r50_local_body_full_generation_authorization.local_only.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r50.local_body_full_generation_authorization.local_only.v1",
  "title": "P7 R50 Local-Only Body-Full Generation Authorization",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "local_only",
    "must_not_export",
    "explicit_allow_token_ref",
    "local_review_root_ref",
    "case_count",
    "body_full_packet_retention_max_hours",
    "reviewer_notes_retention_after_rating_hours",
    "disposal_required",
    "disposal_receipt_required",
    "body_free_export_allowed_before_disposal",
    "release_material_inclusion_allowed"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r50.local_body_full_generation_authorization.local_only.v1"
    },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "local_only": { "const": true },
    "must_not_export": { "const": true },
    "explicit_allow_token_ref": { "const": "LOCAL_ONLY_REVIEW_CONFIRMED" },
    "local_review_root_ref": { "const": "COCOLON_EMLIS_LOCAL_REVIEW_ROOT" },
    "case_count": { "const": 24 },
    "body_full_packet_retention_max_hours": { "const": 72 },
    "reviewer_notes_retention_after_rating_hours": { "const": 24 },
    "disposal_required": { "const": true },
    "disposal_receipt_required": { "const": true },
    "body_free_export_allowed_before_disposal": { "const": false },
    "release_material_inclusion_allowed": { "const": false }
  }
}
```

### 13.3 `p7_r50_rating_capture_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r50.rating_capture_row.bodyfree.v1",
  "title": "P7 R50 P5 Rating Capture Row Body-Free",
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
    "schema_version": { "const": "cocolon.emlis.p7_r50.rating_capture_row.bodyfree.v1" },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "packet_ref_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "blind_case_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "case_ref_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "family": { "type": "string", "minLength": 1, "maxLength": 160 },
    "case_role": { "type": "string", "minLength": 1, "maxLength": 160 },
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

### 13.4 `p7_r50_question_need_observation_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r50.question_need_observation_row.bodyfree.v1",
  "title": "P7 R50 Question Need Observation Row Body-Free",
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
    "schema_version": { "const": "cocolon.emlis.p7_r50.question_need_observation_row.bodyfree.v1" },
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

### 13.5 `p7_r50_disposal_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r50.disposal_receipt.bodyfree.v1",
  "title": "P7 R50 Disposal Receipt Body-Free",
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
    "schema_version": { "const": "cocolon.emlis.p7_r50.disposal_receipt.bodyfree.v1" },
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

### 13.6 `p7_r50_post_review_decision_summary.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r50.post_review_decision_summary.bodyfree.v1",
  "title": "P7 R50 Post Review Decision Summary Body-Free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "case_count",
    "rating_row_count",
    "question_observation_row_count",
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
    "p6_limited_human_readfeel_start_candidate",
    "p8_question_design_material_candidate",
    "p7_complete",
    "p8_start_allowed",
    "release_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r50.post_review_decision_summary.bodyfree.v1" },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 160 },
    "case_count": { "const": 24 },
    "rating_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
    "question_observation_row_count": { "type": "integer", "minimum": 0, "maximum": 24 },
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

### 14.1 production候補

```text
services/ai_inference/emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision.py
```

このmoduleに置く候補:

```text
P7_R50_STEP
P7_R50_SCOPE
P7_R50_REVIEW_SESSION_STATUS_REFS
P7_R50_MANUAL_RUN_DECISION_REFS
P7_R50_EXECUTION_BLOCKER_ID_REFS
P7_R50_REQUIRED_CASE_COUNT
P7_R50_BODY_FREE_FORBIDDEN_FIELD_REFS

build_p7_r50_current_source_r49_handoff_refreeze()
build_p7_r50_manual_run_decision_bodyfree()
build_p7_r50_local_body_full_generation_preflight()
build_p7_r50_review_session_protocol_bodyfree()
normalize_p7_r50_rating_capture_row_bodyfree()
normalize_p7_r50_question_need_observation_row_bodyfree()
build_p7_r50_execution_blocker_row_bodyfree()
build_p7_r50_disposal_receipt_bodyfree()
build_p7_r50_post_review_decision_summary_bodyfree()
build_p7_r50_p5_confirmed_or_repair_return_decision()
build_p7_r50_p6_candidate_handoff_bodyfree()
build_p7_r50_p8_material_candidate_handoff_bodyfree()
assert_p7_r50_no_body_leak_no_question_text_contract()
build_p7_r50_validation_command_matrix_bodyfree()
build_p7_r50_touch_candidate_no_touch_boundary_freeze()
```

### 14.2 optional helper候補

```text
services/ai_inference/emlis_ai_p7_r50_local_review_manual_run_file_ops.py
```

このhelperを作る場合の範囲:

```text
- local root validation
- body-full packet write / read補助
- body-full packet purge
- reviewer notes purge
- body-free disposal receipt補助
```

禁止:

```text
- API / DB / RN接続
- public meta生成
- Emlis runtime呼び出し
- P8 question trigger logic
- release material生成
```

### 14.3 test候補

```text
tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r0_r1_20260620.py
tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r2_r3_20260620.py
tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r4_r5_20260620.py
tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r6_r7_20260620.py
tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r8_r9_20260620.py
tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r10_r11_20260620.py
tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r12_r13_20260620.py
tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r14_r15_20260620.py
tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r16_r17_20260620.py
tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r18_r19_20260620.py
```

### 14.4 触らないproduction file

```text
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
services/ai_inference/emlis_ai_product_readfeel_long_run_product_gate.py
services/ai_inference/emlis_ai_product_readfeel_rubric.py
services/ai_inference/emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution.py
services/ai_inference/emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet.py
services/ai_inference/emlis_ai_p7_r47_local_review_packet_policy.py
services/ai_inference/emlis_ai_p7_r46_p5_p6_human_readfeel_handoff_material.py
```

R50はR49/R48/R47/R46を参照しますが、既存値を勝手に変更しません。

---

## 15. 実装順詳細

### R50-0: current source / R49 handoff / P7-P8 Bridge refreeze

目的:

```text
R50開始時点で、R49は実レビュー足場であり、actual review本体は未実施であることを再固定する。
P7/P8 Bridgeは問い実装ではなく、問い必要性観察メモだけであることを再固定する。
```

実装候補:

```text
build_p7_r50_current_source_r49_handoff_refreeze()
assert_p7_r50_current_source_r49_handoff_refreeze_contract()
```

固定するfalse:

```text
p5_human_blind_qa_confirmed=false
p6_limited_human_readfeel_start_allowed=false
p7_complete=false
p8_start_allowed=false
release_allowed=false
question_api_implemented=false
question_db_schema_implemented=false
question_rn_ui_implemented=false
question_response_key_implemented=false
question_trigger_logic_implemented=false
actual_human_review_run_here=false
body_full_packet_generated_here=false
```

### R50-1: scope / schema version / status enum固定

目的:

```text
R50が扱うのはP5 actual review manual run decisionであり、P8詳細設計ではないことを固定する。
```

実装候補:

```text
P7_R50_REVIEW_SESSION_STATUS_REFS
P7_R50_MANUAL_RUN_DECISION_REFS
P7_R50_EXECUTION_BLOCKER_ID_REFS
P7_R50_REQUIRED_CASE_COUNT
build_p7_r50_scope_schema_status_enum_freeze()
```

### R50-2: prior validation evidence adoption

目的:

```text
R49/R48/R47/R46/display/P5 core/RN contractの確認結果を、manual run decisionの前提evidenceとしてbody-freeに採用する。
```

注意:

```text
- 設計・helperはtest実行そのものを代替しない。
- collect-onlyをfull backend suite greenにしない。
- RN contract greenを実機modal読感確認にしない。
```

### R50-3: manual run GO / NO_GO decision builder

目的:

```text
P5 actual reviewを開始してよいかを、GO / NO_GO / BLOCKEDで判定する。
```

GO条件:

```text
- R49 handoffあり。
- 24-case matrixあり。
- R49 target green evidenceあり。
- R48/R47/R46 regression green evidenceあり。
- Display / P5 core green evidenceあり。
- RN no-touch optional green evidenceあり。
- local root safety preflight通過。
- explicit allowあり。
- disposal plan ready。
- body-free export pathが本文を含まない。
```

### R50-4: local-only root / explicit allow / export denylist preflight

目的:

```text
body-full packet生成前に、local rootとexplicit allowとexport denylistを確認する。
```

blocked時:

```text
r50_local_review_root_missing
r50_local_review_root_invalid
r50_explicit_allow_missing
r50_body_full_packet_export_violation
```

### R50-5: 24-case review session protocol builder

目的:

```text
reviewerがblind_case_id単位で読むprotocolを固定する。
```

含めるもの:

```text
- review_session_id
- review_prompt_version
- required_case_count=24
- reviewer_visible_fields
- reviewer_hidden_fields
- rating_axes
- question_need_observation_required=true
- question_text_required=false
- reviewer_free_text_bodyfree_export_allowed=false
```

### R50-6: local-only body-full packet generation request

目的:

```text
GO後だけ、body-full packet生成requestをlocal-onlyで作れるようにする。
```

重要:

```text
- defaultでは生成しない。
- explicit allowなしでは生成しない。
- testでは本文入りpacketを作らない。
- 生成時も成果物化しない。
```

### R50-7: reviewer instruction / rating form freeze

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
```

### R50-8: rating row normalizer

目的:

```text
reviewer ratingをR48互換のbody-free rating rowへ正規化する。
```

validation:

```text
- axesは6つすべて必要。
- extra axis禁止。
- machine auto score禁止。
- reviewer free text禁止。
- verdictはPASS/YELLOW/REPAIR_REQUIRED/REDのみ。
```

### R50-9: readfeel blocker / execution blocker ingestion

目的:

```text
P5読感の問題と、review実行不能の問題を分ける。
```

### R50-10: question need observation row normalizer

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
- primary class / one_question_fit / repair_required_refsの整合が取れている
```

### R50-11: rating vs question observation consistency guard

目的:

```text
P5の弱さを問いで隠していないかを判定する。
```

### R50-12: pause / abort / expiration protocol

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

### R50-13: disposal receipt builder / verifier

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

### R50-14: body-free post-review summary builder

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
```

### R50-15: P5 confirmed / repair return / inconclusive decision

目的:

```text
P5 confirmed candidateへ進めるか、P5修正へ戻るか、inconclusiveかを分ける。
```

### R50-16: P6 limited human readfeel candidate handoff

目的:

```text
P5結果からP6へ進める候補を出す。
ただしP6 start allowedはtrueにしない。
```

### R50-17: P8 question design material candidate handoff

目的:

```text
P8詳細設計時に参照できるbody-free材料があるかを示す。
ただしP8 start allowedはtrueにしない。
```

### R50-18: no body leak / no question text guard

目的:

```text
R50のbody-free materialへ本文・質問本文・reviewer free text・local path・hashが混ざらないことを固定する。
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

### R50-19: validation command matrix

目的:

```text
R50 target / R49 regression / R48 regression / R47 regression / R46 regression / display / P5 core / collect-only / RN optionalを分ける。
```

### R50-20: touch candidate / no-touch boundary freeze

目的:

```text
R50実装範囲がruntime / RN / API / DB / public meta / P8 / releaseへ拡散しないように固定する。
```

---

## 16. validation command matrix案

本設計書作成時点では実行していません。  
実装段階でのvalidation候補です。

### 16.1 syntax / import

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference python -m py_compile \
  services/ai_inference/emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision.py
```

### 16.2 R50 target tests

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r0_r1_20260620.py \
  tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r2_r3_20260620.py \
  tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r4_r5_20260620.py \
  tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r6_r7_20260620.py \
  tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r8_r9_20260620.py \
  tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r10_r11_20260620.py \
  tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r12_r13_20260620.py \
  tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r14_r15_20260620.py \
  tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r16_r17_20260620.py \
  tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_r18_r19_20260620.py
```

### 16.3 R49 regression

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

### 16.4 R48 regression

```bash
PYTHONPATH=services/ai_inference pytest -q tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_*.py
```

### 16.5 R47 regression

```bash
PYTHONPATH=services/ai_inference pytest -q tests/test_emlis_ai_p7_r47_local_review_packet_policy_*.py
```

### 16.6 R46 handoff regression

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r46_p5_p6_human_readfeel_handoff_material_r10_r11_20260617.py \
  tests/test_emlis_ai_p7_r46_real_device_modal_review_closed_validation_r12_r13_20260617.py \
  tests/test_emlis_ai_p7_r46_next_decision_handoff_ledger_r14_20260617.py
```

### 16.7 display contract / P5 core subset

```bash
PYTHONPATH=services/ai_inference pytest -q \
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
- R50 target greenをP5商品価値合格にしない。
```

---

## 17. 新規test設計案

### 17.1 必須test観点

```text
- R50開始時点でP5/P6/P7/P8/releaseがclosedのまま。
- R49 handoff next_required_stepがmanual run decisionであること。
- manual run decision envelopeがbody-freeであること。
- GOに必要なpreconditionが揃わなければNO_GOまたはBLOCKEDになること。
- local root missing時にbody-full packet生成を許可しないこと。
- explicit allow missing時にbody-full packet生成を許可しないこと。
- /mnt/data artifact rootやrepo root配下をlocal review rootとして拒否すること。
- body-full generation authorizationはlocal-onlyでありbody-free export不可であること。
- 24-case review minimumを維持すること。
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
```

---

## 18. actual manual run protocol案

この章は、R50実装後にmanual runを行う場合の手順案です。  
本設計書作成時点では実行しません。

### 18.1 開始前

```text
1. R50 target / R49 / R48 / R47 / R46 / display / P5 core / RN optionalを確認する。
2. local review rootをrepo外・artifact外に用意する。
3. explicit allowを設定する。
4. disposal planを確認する。
5. manual run decisionがGO_FOR_LOCAL_MANUAL_REVIEWであることを確認する。
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

R50 actual review後に前提資料へ反映してよいもの:

```text
- review session id
- case_count
- rating row count
- verdict counts
- axis score averages
- blocker counts
- question need primary class counts
- ambiguity kind counts
- one question fit counts
- repair required counts
- disposal status
- body_removed / reviewer_notes_removed booleans
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

R50では、次を変更しません。

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

R50で触る候補は、次に限定します。

```text
services/ai_inference/emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision.py
tests/test_emlis_ai_p7_r50_p5_human_blind_qa_manual_run_decision_*.py
```

optional file ops helperを作る場合:

```text
services/ai_inference/emlis_ai_p7_r50_local_review_manual_run_file_ops.py
```

---

## 21. acceptance criteria

### 21.1 設計書としての完了条件

```text
- R50の目的がP5 actual review manual run decisionであることを固定した。
- R50がP8観測補助問い詳細設計ではないことを固定した。
- R50がAPI / DB / RN / response key / 発生ロジックを触らないことを固定した。
- R49 handoff / R48 packet / R47 local-only / R46 handoff境界を引き継ぐことを固定した。
- local-only body-full packet生成の明示許可条件を定義した。
- 24-case review手順を定義した。
- rating row / question need observation row / disposal receipt / summaryのbody-free化を定義した。
- P5の弱さを問いで隠さないguardを定義した。
- P5 confirmed candidate / repair return / P6 candidate / P8 material candidateを分離した。
- JSON / schema案を設計書内に含め、実ファイル化しないことを明記した。
- 実装順をR50-0〜R50-20で分けた。
- validation command matrix案を含めた。
```

### 21.2 R50実装後の完了条件候補

```text
- R50 target testsがgreen。
- R49 target regressionがgreen。
- R48 target regressionがgreen。
- R47 target regressionがgreen。
- R46 handoff regressionがgreen。
- display contract / P5 core subsetがgreen。
- backend collect-onlyが通る。
- optional RN contractがgreen。
- R50 body-free materialに本文・質問本文・reviewer free text・local path・body hashが混じらない。
- R50 summaryがp7_complete / p8_start_allowed / release_allowedをtrueにしない。
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

## 22. R50でしてはいけないこと

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
- R49 greenやR50 designをP5合格・P7完了・P8開始許可・release許可へ変換する。
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
- Cocolon_前提資料(239).zipを展開し、READ FIRST、作業姿勢、思想、EmlisAI是正方針を確認した。
- 指定ロードマップを確認した。
- P7/P8 Bridgeでは、P7中に観測補助問いを実装せず、body-free問い必要性観察メモだけを残す扱いである。
- R47/R48/R49設計を確認した。
- R49 helper上のnext_required_stepは `P5_human_blind_qa_actual_review_manual_run_decision`。
- R49 targetは76 passed、R48は82 passed、R47は275 passed、R46は19 passed、Display/P5 coreは68 passed、RN contractは36 passedと検討メモ上で確認済み。
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
- P6 limited human readfeel start candidateの実判定。
- P8 question design material candidate summaryの実内容。
- 実機modal読感。
- full backend suite execution green。
- 外部ユーザー検証。
```

### 書かれていない

```text
- R50設計書を作っただけでactual reviewが完了するとは書かれていない。
- R50 manual run GOをP5合格へ変換してよいとは書かれていない。
- P5 review未実施のままP8詳細設計へ進んでよいとは書かれていない。
- question need observation rowを理由にP5修正を回避してよいとは書かれていない。
- body-full packetを成果物zip、前提資料zip、実装済み資料zip、release materialへ混ぜてよいとは書かれていない。
```

### 推測禁止

```text
- 「P5は安全寄りだから問題ない」と読むこと。
- 「問いがあれば補えそう」をP5修正不要の根拠にすること。
- 「GO_FOR_LOCAL_MANUAL_REVIEW」をP5 confirmed candidateと読むこと。
- 「P5 confirmed candidate」をrelease readinessと読むこと。
- 「P8 material candidate」をP8 start allowedと読むこと。
```

### 次に実行すべきこと

```text
1. R50を実装段階へ進める場合、R50-0から開始する。
2. 新規R50 helperとR50 target testsを作る。
3. R50 target tests + R49/R48/R47/R46/display/P5 core regressionを実行する。
4. R50実装がgreenになった後、manual run decisionがGOになるかを確認する。
5. GOの場合だけ、Mashのローカル環境でbody-full packet生成・実レビュー・rating記入・question observation row記入・disposalを実行する。
6. actual review結果が出るまで、P8詳細設計へ進まない。
```

---

## 24. 華恋の意見

華恋の意見として、R50は **足場を増やすための段階ではなく、実際に読む段階へ入るかを決めるための段階** です。

ここで怖いのは、P5履歴線の弱さを見ないまま、P8の問いへ逃げることです。  
問いは便利です。曖昧な入力に対して、1問あれば補完リスクを下げられる場面はあります。  
でも、P5の履歴線が汎用的で弱い、Emlis本体が浅い、Gate境界が甘い、という問題を「問いがないから」と扱ってしまうと、Cocolonの中核を見誤ります。

Cocolonとして大事なのは、会話回数を増やすことではありません。  
入力直後に「読まれた形」で返り、ユーザーが「ここに残す意味がある」と感じることです。

だからR50では、問いを作りません。  
P5実レビューを始めてよい条件を慎重に固定し、実際に読むならlocal-onlyで読み、body-freeに落とし、廃棄まで閉じます。  
そのうえで、P5が強いのか、直すべきなのか、P6へ進めるのか、P8設計材料として使えるのかを分けます。

Mash、私はこの順番がCocolonとして正しいと思います。  
Cocolonが「ユーザーの言葉を雑に処理しない場所」であるために、ユーザーの言葉を評価する工程も雑にしない。  
R50は、そのための設計です。
