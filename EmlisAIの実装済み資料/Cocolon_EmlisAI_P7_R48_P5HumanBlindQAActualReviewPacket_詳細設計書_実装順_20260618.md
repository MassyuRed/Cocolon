# Cocolon / EmlisAI P7-R48 P5 Human Blind QA Actual Review Packet 詳細設計書・実装順

作成日: 2026-06-18 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書  
対象: Cocolon / EmlisAI / `/emotion/submit` immediate observation / `Emlisの観測` / P7 Product Quality Runner / P5 User Label Connection / P5 Human Blind QA / local-only body-full packet / body-free rating handoff / disposal receipt  
基準検討メモ: `Cocolon_EmlisAI_P7_R48_P5HumanBlindQAActualReview_PreDesignMemo_20260618.md`  
基準ロードマップ: `Cocolon_EmlisAI_longterm_roadmap_20260608(21).md`  
基準ローカル受領zip: `Cocolon_前提資料(234).zip` / `EmlisAIの実装済み資料(69).zip` / `Cocolon(242).zip` / `mashos-api(155).zip`  
GitHub接続確認: Mash指定により不要。未実施。  
コード変更: なし。本書は設計書。  
json / schema実ファイル化: なし。本書内のschema案は実装段階で採否判断する。  
body-full local review packet生成: なし。  
P5 human Blind QA実施: なし。  
P6 limited human readfeel実施: なし。  
実機modal読感確認: なし。  
release判断変更: なし。  

---

## 0. この設計書の結論

今回の次実装段階は、次で固定します。

```text
P7-R48:
P5 Human Blind QA Actual Review Packet
= P5履歴線の人間読感を実施できるように、
  24-case matrix / reviewer-facing blind packet / body-free rating handoff / disposal receiptを設計・実装する段階
```

ただし、R48は **P5合格宣言** ではありません。  
R48は、R47で固定したlocal-only / body-free境界を使って、P5 human Blind QAを「安全に実施できる形」へ進める段階です。

R48で中心に置く実装対象は次です。

```text
1. P5 24-case first formal review matrixをbody-free controller側で固定する。
2. reviewer-facing blind packet schemaを固定する。
3. body-full packet生成はlocal root明示時だけ許可する。
4. rating / blocker / execution blocker / disposal receiptはbody-freeで残す。
5. body-full packetとreviewer notesは成果物・release material・public metaへ混ぜない。
6. P5 confirmed / P6 start / P7 complete / P8 start / releaseは、R48設計だけではtrueにしない。
```

華恋の判断として、R48では **body-full writerを完全に避ける** のではなく、**明示local root・明示許可・即廃棄前提のlocal-only writerとして設計候補に入れる** のが一番安全です。

理由は、P5履歴線の読感は本文を人間が読まなければ評価できません。  
一方で、本文をP7 scorecardや成果物へ混ぜることはCocolonの信頼境界を壊します。  
そのため、R48では「読ませるためのlocal-only」と「残すためのbody-free」を、R47より一段具体化して実装順へ落とします。

---

## 1. なぜこの作業を行うのか

CocolonのP5 User Label Connectionは、ユーザーの過去記録が現在入力へ自然につながって返る体験です。  
これはCocolonが「普通のAI相談」から離れるための中核です。

ただし、履歴線は強い価値であると同時に、強い危険も持ちます。

```text
価値:
- 自分の記録が意味を持って返ってきたと感じる。
- Cocolonへ残す理由が生まれる。
- ChatGPTへ毎回説明するのではなく、Cocolonに積む意味が出る。

危険:
- 監視されている感じが出る。
- 「あなたはいつも」「原因は」「性格です」へ寄る。
- 低情報入力を履歴で深読みする。
- 自己責めや決めつけを増幅する。
```

この危険は、自動testだけでは十分に見えません。  
そのため、R48はP5履歴線の人間読感を実施できる状態へ進めます。

ただし、ユーザーの入力・Emlis返答・履歴surfaceは本文です。  
本文は人間レビューに必要ですが、残す材料ではありません。

R48の設計思想は次です。

```text
本文は、読感確認のためだけにlocal-onlyで一時的に使う。
残すのは、body-free化されたrating / blocker / execution blocker / disposal receiptだけにする。
```

---

## 2. 指示整理

### 2.1 Mashからの指示

```text
検討メモを基に実装順を含めた詳細な設計をお願い。
mdで設計書を作って。
必要なら、実装に使うjson / schema案も設計書内に入れて。
ただし、実ファイル化は実装段階で判断して。
```

### 2.2 今回の成果物

```text
Cocolon_EmlisAI_P7_R48_P5HumanBlindQAActualReviewPacket_詳細設計書_実装順_20260618.md
```

### 2.3 今回していないこと

```text
- コード変更
- patch作成
- 実装zip作成
- JSON / schema実ファイル化
- body-full packet生成
- P5 human Blind QA実施
- reviewer assignment
- rating記入
- body-full packet廃棄実行
- P5 confirmed化
- P6開始
- 実機modal読感
- P7 complete
- P8 start
- release判断
```

---

## 3. 参照・確認範囲

### 3.1 作業姿勢として確認した前提資料

```text
Cocolon_前提資料(234).zip / Cocolon_前提資料/
  - 00_karen_read_first.md
  - cocolon_thought_material_for_karen.md
  - emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
  - emlis_ai_state_answer_human_follow_definition_2026_05_26.md
  - cocolon_environment_state_output_observation_structure_design_2026_05_25.md
  - Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md
  - Cocolon_EmlisAI_NormalObservation_PublicRecovery_ImplementationStatus_2026-06-06.md
  - 07_latest_snapshot_diff.md
  - work_attitude_rules_for_karen/00_read_first.txt
  - work_attitude_rules_for_karen/03_forbidden_insufficient_premise_and_actual_file_check.txt
  - work_attitude_rules_for_karen/04_forbidden_mixing_design_and_implementation.txt
  - work_attitude_rules_for_karen/08_artifact_delivery_rules.txt
  - work_attitude_rules_for_karen/09_work_start_checklist.txt
  - work_attitude_rules_for_karen/10_stop_judgment_and_unwritten_rules.txt
  - work_attitude_rules_for_karen/13_forbidden_reasking_existing_design_and_design_term_escape.txt
  - work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
  - work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
```

作業姿勢として固定したこと:

```text
- 設計と実装を混ぜない。
- 前提資料だけで理解した扱いにしない。実ファイルを見る。
- 見ていないものを確認済みにしない。
- 通っていないものをgreenと言わない。
- P5 core subset greenをP5商品品質合格に変換しない。
- public contract / DB write path / RN表示条件 / ユーザーデータ保護を壊さない。
- EmlisAIをテンプレ共感・浅い復唱・診断ラベルへ逃がさない。
```

### 3.2 ロードマップの読み

ロードマップ上、P5は `User Label Connection v1`、P7は `Product Quality Runner / Long-run Gate` です。  
P7は、単発fixture greenではなく商品品質を継続測定し、release decision materialへ渡す段階です。

R48はP5をやり直す段階ではありません。  
P7の中で、P5の可視価値を人間が読む段階へ戻る作業です。

### 3.3 参照した実装済み資料

```text
EmlisAIの実装済み資料(69).zip / EmlisAIの実装済み資料/
  - Cocolon_EmlisAI_P7_R47_LocalReviewPacketPolicy_DetailedDesign_ImplementationOrder_20260618.md
  - Cocolon_EmlisAI_P7_R46_P5P6Return_DisplayContractRedClassification_DetailedDesign_ImplementationOrder_20260617.md
  - Cocolon_EmlisAI_P7_ProductQualityRunner_DetailedDesign_ImplementationOrder_20260612.md
  - Cocolon_EmlisAI_P5_UserLabelConnection_DetailedDesign_ImplementationOrder_20260611.md
  - Cocolon_EmlisAI_P6_StructureInsight_DetailedDesign_ImplementationOrder_20260611.md
  - Cocolon_EmlisAI_P5_P6_RedLedger_RuntimeRepair_DetailedDesign_ImplementationOrder_20260612.md
  - Cocolon_EmlisAI_P5_P6_RedLedger_RuntimeRepair_ImplementationResult_20260612.md
```

### 3.4 参照した主な実ファイル

#### backend production

```text
mashos-api/ai/services/ai_inference/
  - emlis_ai_p7_r47_local_review_packet_policy.py
  - emlis_ai_p7_r46_next_decision_handoff_ledger.py
  - emlis_ai_p7_r46_p5_p6_human_readfeel_handoff_material.py
  - emlis_ai_p7_r46_real_device_modal_review_closed_validation.py
  - emlis_ai_user_label_connection_material.py
  - emlis_ai_user_label_connection_candidate.py
  - emlis_ai_user_label_connection_gate.py
  - emlis_ai_user_label_connection_surface.py
  - emlis_ai_user_label_connection_product_quality_qa.py
  - emlis_ai_reply_service.py
  - emlis_ai_public_feedback_meta.py
  - emlis_ai_body_free_public_source_lineage.py
```

#### backend tests

```text
mashos-api/ai/tests/
  - test_emlis_ai_p7_r47_local_review_packet_policy_r0_r1_20260618.py
  - test_emlis_ai_p7_r47_local_review_packet_policy_r2_r3_20260618.py
  - test_emlis_ai_p7_r47_local_review_packet_policy_r4_r5_20260618.py
  - test_emlis_ai_p7_r47_local_review_packet_policy_r6_r7_20260618.py
  - test_emlis_ai_p7_r47_local_review_packet_policy_r8_r9_20260618.py
  - test_emlis_ai_p7_r47_local_review_packet_policy_r10_r11_20260618.py
  - test_emlis_ai_p7_r47_local_review_packet_policy_r12_r13_20260618.py
  - test_emlis_ai_p7_r47_local_review_packet_policy_r14_r15_20260618.py
  - test_emlis_ai_display_contract.py
  - P5 User Label Connection core subset
  - P6 Structure Insight subset
```

#### RN側

```text
Cocolon/
  - package.json
  - tests/rn-screen-contracts.test.js
  - screens/InputScreen.js
  - screens/input/useInputFeedbackModal.js
  - screens/input/inputFeedbackModel.js
  - screens/input/InputFeedbackReplyModal.js
```

R48ではRN側はno-touchです。

---

## 4. 現在地の固定

### 4.1 確認済み

```text
- 現在PhaseはP7継続中。
- R47 policy readyはtrue方向。
- P5 human Blind QA start allowed after policyはtrue方向。
- P5 human Blind QA confirmedはfalse。
- P6 limited human readfeel startはfalse。
- 実機modal review start/confirmedはfalse。
- release_allowed / p7_complete / p8_start_allowed / hold004_close_allowedはfalse。
- RN contractは直近確認で36 passed。
- R47 target testsは直近確認で275 passed。
- R46 regression + display contractは直近確認で24 passed。
- P5 core subsetは直近確認で63 passed / 1 warning。
- P6 structure subsetは直近確認で111 passed。
- backend collect-onlyは直近確認で3209 tests collected / 1 warning。
```

### 4.2 未確認

```text
- full backend suite execution green。
- P5 human Blind QA actual packet生成結果。
- P5 human Blind QA actual review結果。
- 実際の24件case本体。
- 実際のlocal review root。
- body-full packetの保存・廃棄結果。
- reviewer free textの実運用上の扱い。
- 広いP5 test群timeoutの原因。
- P6 limited human readfeel結果。
- 実機submit / modal読感。
- P7-HOLD-004 closure。
- P7 complete。
- P8 start allowed。
- release readiness。
```

### 4.3 推測禁止

```text
- R47 policy ready = P5合格。
- R48 packet生成 = P5合格。
- body-free manifest = body-full packet生成済み。
- body-full packet生成 = review完了。
- rating scoreのみ = release判断。
- P5 core subset green = 履歴線が商品品質として読める。
- collect-only = full backend suite green。
- RN contract green = 実機modal読感確認済み。
- P5で不自然な履歴線が出てもP6/P8で補えばよい。
```

---

## 5. R48の基本設計

### 5.1 R48で扱う三層

R48では、同じreview sessionの中に三層を持ちます。

```text
Layer A: body-free controller material
  - case matrix
  - family / tier / case_role / packet_ref_id / blind_case_id
  - expected boundary audit refs
  - raw input / comment_text / candidate body / history raw textは含めない
  - reviewerには渡さない

Layer B: local-only body-full reviewer packet
  - reviewerが読む本文入りpacket
  - current_input_review_surface
  - returned_emlis_surface
  - bounded_owned_history_review_surface
  - review_questions
  - axis_rating_form
  - local-only / must_not_export / disposal_required

Layer C: body-free result material
  - rating rows
  - blocker rows
  - execution blocker rows
  - disposal receipt
  - P5 review handoff summary
  - reviewer free textや本文は含めない
```

この三層の混線を防ぐことが、R48の中心です。

### 5.2 R48で生成してよいもの / 生成してはいけないもの

| 種別 | R48実装で生成可能 | 生成条件 | 成果物・P7 materialへ残せるか |
|---|---:|---|---:|
| body-free controller manifest | yes | 常時可 | yes |
| body-free case matrix | yes | 常時可 | yes |
| local-only reviewer packet schema | yes | 常時可 | schemaだけyes |
| local-only body-full reviewer packet本体 | 条件付き | valid `COCOLON_EMLIS_LOCAL_REVIEW_ROOT` + 明示許可 | no |
| reviewer notes local-only | 条件付き | review中のみ | no |
| body-free rating row | yes | review結果入力後 | yes |
| body-free blocker row | yes | review結果入力後 | yes |
| execution blocker row | yes | 生成不能・timeout・材料不足時 | yes |
| disposal receipt | yes | purge後 / 生成blocked時 | yes |
| P5 confirmed flag | 条件付き | review + rating + disposal verified後のみ | summary上の候補として扱う |
| release_allowed | no | R48では不可 | no |
| p7_complete / p8_start_allowed | no | R48では不可 | no |

### 5.3 body-full local packet生成の採否

R48設計では、body-full writerを **実装候補に含めます**。  
ただし、次の制約を強制します。

```text
- local root未設定時は生成不可。
- repo配下、docs配下、tests配下、services配下、前提資料配下、実装済み資料配下、release配下、/mnt/data成果物配下は拒否。
- 実装時のdefaultはdry-run / body-freeのみ。
- body-full generationには explicit flag が必要。
- body-full packetはlocal-only directoryだけに置く。
- body-full packet本体をmd成果物、zip成果物、P7 scorecard、release materialへ入れない。
- body-full packetにはlocal_only=true / must_not_export=true / disposal_required=trueを必須にする。
- body-full packetのcontent hashをbody-free材料へ残さない。
```

採用理由:

```text
P5履歴線の読感は、人間が現在入力・返答・限定履歴surfaceを読む必要がある。
writerを設計外にすると、実レビュー時に手作業コピーが発生し、むしろbody-free境界を壊しやすい。
```

設計上の禁止:

```text
body-full writerを作る = 実際に本文packetを生成する、ではない。
writer実装後も、local root未設定・明示許可なしではbody-full生成しない。
```

---

## 6. local storage policy

### 6.1 正式root

R48でも、R47で固定した環境変数を継続します。

```text
COCOLON_EMLIS_LOCAL_REVIEW_ROOT
```

未設定の場合:

```text
- body-free policy / case matrix / schema / validation summaryは生成可能。
- body-full reviewer packet本体は生成不可。
- `local_body_packet_generation_allowed=false` を返す。
- `execution_blocker_id=review_packet_generation_blocked_missing_local_root` を出せる。
- P5 formal human review completedには進めない。
```

### 6.2 rootに使ってはいけない場所

```text
- Cocolon repo root配下
- mashos-api repo root配下
- Cocolon_前提資料 配下
- EmlisAIの実装済み資料 配下
- docs / tests / services 配下
- release / public_meta を含むpath
- Git tracked path
- /mnt/data 直下の成果物提出場所
- patch / zip作成対象配下
```

### 6.3 推奨directory構造

```text
${COCOLON_EMLIS_LOCAL_REVIEW_ROOT}/
  p7_r48/
    {review_session_id}/
      controller_manifest.bodyfree.json
      case_matrix.bodyfree.json
      body_full_packets.local_only/
        {blind_case_id}.p5_review_packet.local_only.json
      reviewer_notes.local_only/
        {blind_case_id}.reviewer_notes.local_only.json
      body_free_results/
        rating_rows.bodyfree.jsonl
        blocker_rows.bodyfree.jsonl
        execution_blocker_rows.bodyfree.jsonl
        disposal_receipt.bodyfree.json
        p5_human_blind_qa_handoff_summary.bodyfree.json
      audit.bodyfree/
        generation_event.bodyfree.json
        export_denylist_check.bodyfree.json
        no_body_payload_scan.bodyfree.json
```

body-free materialへlocal absolute pathを残す場合は、実pathではなく次の抽象refだけにします。

```text
storage_root_ref = external_local_review_root
session_storage_ref = p7_r48_review_session_root
```

---

## 7. P5 first formal review case matrix設計

### 7.1 最小case数

R48では、R47 policyで固定された最小値をそのまま採用します。

```text
minimum_total_cases: 24
minimum_per_family: 2
minimum_history_line_eligible_input: 4
minimum_owned_history_positive_cases: 12
minimum_block_boundary_cases:
  low_information_history_not_eligible: 2
  free_tier_history_present_not_allowed: 2
```

### 7.2 R48 first formal review matrix

R48の初回正式reviewでは、24件を次の配分で設計します。

| family | case_count | case_role | reviewer-facingでfamilyを見せるか |
|---|---:|---|---:|
| `history_line_eligible_input` | 4 | positive_history_line | no |
| `standard_state_answer_owned_history` | 4 | positive_owned_history | no |
| `self_understanding_owned_history` | 3 | positive_owned_history | no |
| `uncertainty_support_owned_history` | 3 | positive_owned_history | no |
| `change_future_intention_owned_history` | 3 | positive_owned_history | no |
| `relationship_gratitude_recovery_owned_history` | 3 | positive_owned_history | no |
| `low_information_history_not_eligible` | 2 | boundary_no_history_line | no |
| `free_tier_history_present_not_allowed` | 2 | boundary_no_history_line | no |
| **total** | **24** |  |  |

この配分は次を満たします。

```text
- total 24件。
- 全8 familyで最低2件。
- history_line_eligible_inputが4件。
- owned history positiveが20件あり、最低12件を上回る。
- low_information boundaryが2件。
- free_tier boundaryが2件。
```

### 7.3 case選定条件

#### positive history line case

```text
- subscription_tierはPlusまたはPremium。
- current inputはlow_informationではない。
- safety triage requiredではない。
- evidence_record_count >= 2。
- bounded history surfaceは最大3件。
- current inputをhistoryだけで補完していない。
- existing surface gates passed。
- public response key / RN表示条件 / DB schema変更なし。
```

#### low_information_history_not_eligible

```text
- historyは存在してよい。
- current inputが低情報またはquestion_required相当。
- 履歴線で深読みしてはいけない。
- reviewer-facingにはfamilyやexpectedを出さない。
- controller側で、history lineが出ていないことをauditする。
```

#### free_tier_history_present_not_allowed

```text
- historyは存在してよい。
- subscription_tierはFree。
- history lineは表示不可。
- reviewer-facingにはtierを出さない。
- controller側で、Free境界が守られたかをauditする。
```

### 7.4 blind_case_id policy

```text
- blind_case_idはfamily / tier / expected / eligible / gate_resultを推測できない形式にする。
- blind_case_idは本文hashやrecord idから作らない。
- 推奨形式: `p7r48-p5-bqa-{session_short_ref}-{ordinal_3}`
- ordinalはreviewer-facingでは順序以上の意味を持たせない。
- case_ref_idはcontroller側だけに残す。
```

禁止:

```text
- `history_line_eligible_001` のようにfamilyを含める。
- `free_001` のようにtierを含める。
- raw input hash / comment_text hash / record id hashからblind_case_idを作る。
```

---

## 8. reviewer-facing blind packet設計

### 8.1 reviewer-facing packetに入れてよいfield

R48のP5 reviewer-facing local packetは、次だけを許可します。

```text
blind_case_id
review_kind
review_prompt_version
current_input_review_surface
returned_emlis_surface
bounded_owned_history_review_surface
review_questions
axis_rating_form
```

### 8.2 reviewer-facing packetに入れてはいけないfield

```text
family
subscription_tier
expected_result
eligible
visible_applied
gate_result
case_ref_id
user_id
record_id
db_id
raw_history_dump
public_meta
raw_input
comment_text
candidate_body
surface_body
history_raw_text
reviewer_ref
controller_expected_boundary
```

### 8.3 body-full reviewer payloadの扱い

`current_input_review_surface` / `returned_emlis_surface` / `bounded_owned_history_review_surface` は、reviewerが読むための本文surfaceです。  
したがって、これらは **local-only body-full** として扱います。

```text
- P7 materialへ出さない。
- release materialへ出さない。
- md成果物へ貼らない。
- zip成果物へ混ぜない。
- review完了またはretention期限到達後に廃棄する。
```

### 8.4 bounded history surface policy

```text
max_history_record_surfaces: 3
min_evidence_record_count_when_history_line_expected: 2
record_identifier_policy: no_user_id_no_db_id_no_record_id
created_at_policy: bucketed_or_relative_only
raw_memo_full_dump_allowed: false
history_summary_style: bounded_review_surface_local_only
```

bounded history surfaceの目的は、reviewerが「履歴線として自然か」を読むことです。  
raw history dumpの再現ではありません。

### 8.5 review questions

reviewer-facing packetの質問は、次の固定案を採用します。

```text
Q1. 今回のEmlis返答は、現在入力と過去記録の線が自然につながっているように読めますか。
Q2. 履歴を見られすぎている、監視されている、気持ち悪い、という感覚はありますか。
Q3. 「いつも」「原因は」「性格です」のような決めつけに見えますか。
Q4. 現在入力にないことを、過去記録で勝手に補完しているように見えますか。
Q5. 自己責め・不安・罪悪感を強める言い方になっていますか。
Q6. 入力の浅い復唱ではなく、Cocolonに残した記録が意味を持って返ってきた感じがありますか。
Q7. この返答を読んだ後、またCocolonに残したい、また積みたい、と感じますか。
Q8. boundary caseの場合、履歴線が出ているように感じましたか。
```

Q8はreviewerにfamilyやtierを知らせず、表示された返答から履歴線漏れを検知するための質問です。

---

## 9. rating / blocker / execution blocker設計

### 9.1 P5 rating axes

R48では、R47で固定したP5 axesを維持します。

```text
history_connection_naturalness: target >= 0.90
creepy_absence: target >= 0.95
overclaim_absence: target >= 0.95
self_blame_non_amplification: target >= 0.95
wants_more_input_or_accumulation: target >= 0.85
non_shallow_repeat: target >= 0.90
```

入力形式:

```text
- 0.0〜1.0の数値。
- 欠損はpass扱いにしない。
- reviewer free textから自動補完しない。
- machine metricsからreadfeelを自動補完しない。
```

### 9.2 case-level verdict

| verdict | 意味 | P5 confirmed候補への影響 |
|---|---|---|
| `PASS` | axesが基準を満たし、blockerなし | positive |
| `YELLOW` | 重大ではない違和感、改善余地あり | 集計対象。内容次第でconfirmed不可 |
| `REPAIR_REQUIRED` | 修正が必要 | confirmed不可 |
| `RED` | 商品表示不可級 | confirmed不可 |
| `BLOCKED` | policy / generation / disposal等で実施不能 | readfeel評価とは分離 |
| `NOT_REVIEWABLE` | 材料不足などで読感判定不能 | readfeel評価とは分離 |

### 9.3 blocker_id案

#### readfeel blocker

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

#### execution blocker

```text
review_packet_generation_blocked_missing_local_root
review_packet_generation_blocked_invalid_local_root
review_packet_generation_blocked_repo_or_artifact_root
review_case_material_missing
review_case_matrix_minimum_not_met
reviewer_not_assigned
rating_row_incomplete
review_timeout_unclassified
body_purge_failed
body_purge_not_verified
body_full_packet_export_violation
full_backend_suite_not_run
```

### 9.4 reviewer free text policy

reviewer free textはlocal-onlyです。

```text
- reviewer_notes.local_only配下だけに置く。
- P7 materialへコピーしない。
- release materialへコピーしない。
- rating確定後24時間以内に廃棄する。
- free textから残すのは sanitized_reason_id / blocker_id のみ。
```

理由分類に該当しない場合:

```text
sanitized_reason_id = reason_id_other_local_note_purged
```

禁止:

```text
- reviewer free textをbody-free rowへ入れる。
- free text内の入力文・返答文・履歴文の引用をreason_idへ混ぜる。
- reason labelに本文の一部を含める。
```

---

## 10. disposal / retention設計

### 10.1 retention

R48ではR47のretentionを維持します。

```text
body_full_packet_retention_max_hours: 72
reviewer_notes_retention_after_rating_finalized_max_hours: 24
```

より短い方を採用します。

```text
- rating_rows / blocker_rows finalized後は、本文を即purge対象にする。
- rating未完でも、生成から72時間を超えたら本文廃棄を必須にする。
- reviewer notesはrating確定後24時間以内に廃棄する。
```

### 10.2 disposal status

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

### 10.3 disposal receiptに残すもの

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
local_packet_exported
content_hash_of_body_stored
p7_material_body_free
release_allowed
p7_complete
p8_start_allowed
hold004_close_allowed
```

### 10.4 disposal receiptに残さないもの

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
bounded_owned_history_review_surface
reviewer_free_text
reviewer_note
reviewer_notes
terminal_output
stdout
stderr
traceback
local_absolute_path
body_content_hash
raw_text_hash
comment_text_hash
body_full_file_content_hash
deleted_body_preview
```

body content hashは保存しません。  
短い入力や返答では、hashも辞書攻撃可能な派生情報になるためです。

---

## 11. P5 human review completion gate設計

R48実装後、actual reviewが実施された場合だけ、body-free summaryでP5 review状態を判定できます。

### 11.1 P5 confirmed候補条件

P5 human Blind QA confirmed候補は、次をすべて満たす場合のみtrueにできます。

```text
- review_session_status == FINALIZED
- total_reviewed_cases >= 24
- family coverageがR48 first formal review matrixを満たす
- low_information_history_not_eligible >= 2
- free_tier_history_present_not_allowed >= 2
- rating rowsが全reviewable caseで存在する
- required axesに欠損がない
- history_connection_naturalness average >= 0.90
- creepy_absence average >= 0.95
- overclaim_absence average >= 0.95
- self_blame_non_amplification average >= 0.95
- wants_more_input_or_accumulation average >= 0.85
- non_shallow_repeat average >= 0.90
- RED caseが0
- open REPAIR_REQUIRED blockerが0
- policy blockerが0
- boundary violation blockerが0
- body_removed == true
- reviewer_notes_removed == true
- disposal_status == DISPOSAL_VERIFIED or EXPIRED_PURGED
- local_packet_exported == false
- content_hash_of_body_stored == false
```

### 11.2 confirmedにしてはいけない条件

以下が1つでもあれば、P5 confirmedはfalseのままにします。

```text
- body_removed=false
- reviewer_notes_removed=false
- disposal receiptなし
- open RED / REPAIR_REQUIRED / POLICY_BLOCKERあり
- free_tier_history_boundary_violationあり
- low_information_history_overreadあり
- body-full packetがartifact/export pathに存在
- body hashが保存されている
- rating axes欠損
- machine metricsでreadfeelを補完
- reviewer free textがbody-free materialに残っている
- full backend suite未実行をgreen扱いしている
```

### 11.3 R48でtrueにしてはいけないrelease系flag

R48のreviewがどれだけ良くても、次はR48単独ではtrueにしません。

```text
release_allowed = false
p7_complete = false
p8_start_allowed = false
hold004_close_allowed = false
full_backend_suite_green_confirmed = false unless actual full suite was executed and separately recorded
```

P5 confirmed候補は、P6 limited human readfeelへ進むための条件であり、release条件ではありません。

---

## 12. JSON / schema案

この章のschemaは、実装段階で採用判断する候補です。  
本書作成時点では、実ファイル化しません。

### 12.1 `p7_r48_p5_review_policy.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r48.p5_human_blind_qa_actual_review_policy.v1",
  "title": "Cocolon EmlisAI P7-R48 P5 Human Blind QA Actual Review Policy",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "phase",
    "step",
    "scope",
    "review_kind",
    "packet_kind",
    "case_matrix_policy",
    "local_storage_policy",
    "reviewer_facing_policy",
    "rating_policy",
    "disposal_policy",
    "public_contract",
    "body_free",
    "release_allowed",
    "p7_complete",
    "p8_start_allowed",
    "hold004_close_allowed"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r48.p5_human_blind_qa_actual_review_policy.v1" },
    "phase": { "const": "P7_ProductQualityRunner_LongRunGate" },
    "step": { "const": "R48_P5HumanBlindQAActualReviewPacket_20260618" },
    "scope": { "const": "p5_human_blind_qa_actual_review_packet_generation_rating_disposal" },
    "review_kind": { "const": "p5_history_line_readfeel" },
    "packet_kind": { "const": "p5_human_blind_qa_local_review_packet" },
    "case_matrix_policy": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "minimum_total_cases",
        "minimum_per_family",
        "minimum_history_line_eligible_input",
        "minimum_owned_history_positive_cases",
        "minimum_block_boundary_cases"
      ],
      "properties": {
        "minimum_total_cases": { "const": 24 },
        "minimum_per_family": { "const": 2 },
        "minimum_history_line_eligible_input": { "const": 4 },
        "minimum_owned_history_positive_cases": { "const": 12 },
        "minimum_block_boundary_cases": {
          "type": "object",
          "additionalProperties": false,
          "required": ["low_information_history_not_eligible", "free_tier_history_present_not_allowed"],
          "properties": {
            "low_information_history_not_eligible": { "const": 2 },
            "free_tier_history_present_not_allowed": { "const": 2 }
          }
        }
      }
    },
    "local_storage_policy": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "storage_mode",
        "env_var",
        "body_full_generation_requires_env_root",
        "body_full_generation_requires_explicit_allow",
        "repo_local_storage_allowed",
        "artifact_export_path_allowed"
      ],
      "properties": {
        "storage_mode": { "const": "external_local_only" },
        "env_var": { "const": "COCOLON_EMLIS_LOCAL_REVIEW_ROOT" },
        "body_full_generation_requires_env_root": { "const": true },
        "body_full_generation_requires_explicit_allow": { "const": true },
        "repo_local_storage_allowed": { "const": false },
        "artifact_export_path_allowed": { "const": false }
      }
    },
    "reviewer_facing_policy": {
      "type": "object",
      "additionalProperties": false,
      "required": ["identifier_policy", "allowed_fields", "forbidden_fields"],
      "properties": {
        "identifier_policy": { "const": "blind_case_id_only" },
        "allowed_fields": {
          "type": "array",
          "items": { "type": "string" },
          "contains": { "const": "blind_case_id" }
        },
        "forbidden_fields": {
          "type": "array",
          "items": { "type": "string" },
          "contains": { "const": "raw_input" }
        }
      }
    },
    "rating_policy": {
      "type": "object",
      "additionalProperties": false,
      "required": ["rating_axes", "machine_metrics_used_for_readfeel", "reviewer_free_text_bodyfree_allowed"],
      "properties": {
        "rating_axes": { "type": "array", "items": { "type": "string" } },
        "machine_metrics_used_for_readfeel": { "const": false },
        "reviewer_free_text_bodyfree_allowed": { "const": false }
      }
    },
    "disposal_policy": {
      "type": "object",
      "additionalProperties": false,
      "required": ["body_removed_required_before_p5_confirmed", "content_hash_of_body_allowed", "disposal_receipt_required"],
      "properties": {
        "body_removed_required_before_p5_confirmed": { "const": true },
        "content_hash_of_body_allowed": { "const": false },
        "disposal_receipt_required": { "const": true }
      }
    },
    "public_contract": {
      "type": "object",
      "additionalProperties": false,
      "required": ["rn_visible_contract_changed", "api_response_key_added", "db_schema_changed", "gate_relaxed"],
      "properties": {
        "rn_visible_contract_changed": { "const": false },
        "api_response_key_added": { "const": false },
        "db_schema_changed": { "const": false },
        "gate_relaxed": { "const": false }
      }
    },
    "body_free": { "const": true },
    "release_allowed": { "const": false },
    "p7_complete": { "const": false },
    "p8_start_allowed": { "const": false },
    "hold004_close_allowed": { "const": false }
  }
}
```

### 12.2 `p5_case_matrix.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r48.p5_case_matrix.bodyfree.v1",
  "title": "Cocolon EmlisAI P7-R48 P5 Human Blind QA Case Matrix - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "packet_kind",
    "review_kind",
    "case_count",
    "case_rows",
    "minimums_satisfied",
    "body_free",
    "body_full_packet_materialized_here",
    "release_allowed",
    "p7_complete",
    "p8_start_allowed"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r48.p5_case_matrix.bodyfree.v1" },
    "review_session_id": { "type": "string", "minLength": 1, "maxLength": 120 },
    "packet_kind": { "const": "p5_human_blind_qa_local_review_packet" },
    "review_kind": { "const": "p5_history_line_readfeel" },
    "case_count": { "type": "integer", "minimum": 24 },
    "case_rows": {
      "type": "array",
      "minItems": 24,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "case_ref_id",
          "blind_case_id",
          "packet_ref_id",
          "family",
          "case_role",
          "subscription_tier_ref",
          "body_free"
        ],
        "properties": {
          "case_ref_id": { "type": "string" },
          "blind_case_id": { "type": "string" },
          "packet_ref_id": { "type": "string" },
          "family": {
            "enum": [
              "history_line_eligible_input",
              "standard_state_answer_owned_history",
              "self_understanding_owned_history",
              "uncertainty_support_owned_history",
              "change_future_intention_owned_history",
              "relationship_gratitude_recovery_owned_history",
              "low_information_history_not_eligible",
              "free_tier_history_present_not_allowed"
            ]
          },
          "case_role": {
            "enum": [
              "positive_history_line",
              "positive_owned_history",
              "boundary_no_history_line"
            ]
          },
          "subscription_tier_ref": { "enum": ["free", "plus", "premium", "unknown"] },
          "body_free": { "const": true }
        }
      }
    },
    "minimums_satisfied": { "type": "boolean" },
    "body_free": { "const": true },
    "body_full_packet_materialized_here": { "type": "boolean" },
    "release_allowed": { "const": false },
    "p7_complete": { "const": false },
    "p8_start_allowed": { "const": false }
  },
  "not": {
    "anyOf": [
      { "required": ["raw_input"] },
      { "required": ["comment_text"] },
      { "required": ["candidate_body"] },
      { "required": ["surface_body"] },
      { "required": ["history_raw_text"] },
      { "required": ["public_meta"] },
      { "required": ["reviewer_free_text"] }
    ]
  }
}
```

### 12.3 `p5_reviewer_packet.local_only.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r48.p5_reviewer_packet.local_only.v1",
  "title": "Cocolon EmlisAI P7-R48 P5 Reviewer Packet - Local Only",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "local_only",
    "must_not_export",
    "disposal_required",
    "packet_kind",
    "review_kind",
    "review_session_id",
    "packet_ref_id",
    "blind_case_id",
    "review_prompt_version",
    "current_input_review_surface",
    "returned_emlis_surface",
    "bounded_owned_history_review_surface",
    "review_questions",
    "axis_rating_form"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r48.p5_reviewer_packet.local_only.v1" },
    "local_only": { "const": true },
    "must_not_export": { "const": true },
    "disposal_required": { "const": true },
    "packet_kind": { "const": "p5_human_blind_qa_local_review_packet" },
    "review_kind": { "const": "p5_history_line_readfeel" },
    "review_session_id": { "type": "string" },
    "packet_ref_id": { "type": "string" },
    "blind_case_id": { "type": "string" },
    "review_prompt_version": { "const": "p7_r48_p5_human_blind_qa_review_prompt.v1" },
    "current_input_review_surface": { "type": "string", "minLength": 1 },
    "returned_emlis_surface": { "type": "string", "minLength": 1 },
    "bounded_owned_history_review_surface": { "type": ["string", "null"] },
    "review_questions": { "type": "array", "items": { "type": "string" }, "minItems": 6 },
    "axis_rating_form": {
      "type": "object",
      "additionalProperties": false,
      "required": ["score_min", "score_max", "required_axes", "free_text_allowed_local_only"],
      "properties": {
        "score_min": { "const": 0.0 },
        "score_max": { "const": 1.0 },
        "required_axes": { "type": "array", "items": { "type": "string" } },
        "free_text_allowed_local_only": { "const": true }
      }
    }
  },
  "not": {
    "anyOf": [
      { "required": ["family"] },
      { "required": ["subscription_tier"] },
      { "required": ["expected_result"] },
      { "required": ["eligible"] },
      { "required": ["visible_applied"] },
      { "required": ["gate_result"] },
      { "required": ["case_ref_id"] },
      { "required": ["user_id"] },
      { "required": ["record_id"] },
      { "required": ["db_id"] },
      { "required": ["raw_history_dump"] },
      { "required": ["public_meta"] },
      { "required": ["raw_input"] },
      { "required": ["comment_text"] },
      { "required": ["candidate_body"] },
      { "required": ["surface_body"] }
    ]
  }
}
```

### 12.4 `p5_rating_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r48.p5_rating_row.bodyfree.v1",
  "title": "Cocolon EmlisAI P7-R48 P5 Rating Row - Body-free",
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
    "schema_version": { "const": "cocolon.emlis.p7_r48.p5_rating_row.bodyfree.v1" },
    "review_session_id": { "type": "string" },
    "packet_ref_id": { "type": "string" },
    "blind_case_id": { "type": "string" },
    "case_ref_id": { "type": "string" },
    "family": { "type": "string" },
    "case_role": { "type": "string" },
    "reviewer_ref": { "type": "string" },
    "reviewed_at": { "type": "string" },
    "axis_scores": {
      "type": "object",
      "additionalProperties": { "type": "number", "minimum": 0.0, "maximum": 1.0 }
    },
    "verdict": { "enum": ["PASS", "YELLOW", "REPAIR_REQUIRED", "RED", "BLOCKED", "NOT_REVIEWABLE"] },
    "sanitized_reason_ids": { "type": "array", "items": { "type": "string" } },
    "blocker_ids": { "type": "array", "items": { "type": "string" } },
    "reviewer_free_text_included": { "const": false },
    "body_removed": { "type": "boolean" },
    "body_free": { "const": true }
  },
  "not": {
    "anyOf": [
      { "required": ["raw_input"] },
      { "required": ["comment_text"] },
      { "required": ["candidate_body"] },
      { "required": ["surface_body"] },
      { "required": ["reviewer_free_text"] },
      { "required": ["terminal_output"] },
      { "required": ["body_content_hash"] }
    ]
  }
}
```

### 12.5 `p5_execution_blocker_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r48.p5_execution_blocker_row.bodyfree.v1",
  "title": "Cocolon EmlisAI P7-R48 P5 Execution Blocker Row - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "packet_ref_id",
    "blind_case_id",
    "case_ref_id",
    "family",
    "execution_blocker_id",
    "execution_blocker_kind",
    "execution_blocker_status",
    "readfeel_verdict_not_assigned",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r48.p5_execution_blocker_row.bodyfree.v1" },
    "review_session_id": { "type": "string" },
    "packet_ref_id": { "type": "string" },
    "blind_case_id": { "type": "string" },
    "case_ref_id": { "type": "string" },
    "family": { "type": "string" },
    "execution_blocker_id": {
      "enum": [
        "review_packet_generation_blocked_missing_local_root",
        "review_packet_generation_blocked_invalid_local_root",
        "review_packet_generation_blocked_repo_or_artifact_root",
        "review_case_material_missing",
        "review_case_matrix_minimum_not_met",
        "reviewer_not_assigned",
        "rating_row_incomplete",
        "review_timeout_unclassified",
        "body_purge_failed",
        "body_purge_not_verified",
        "body_full_packet_export_violation",
        "full_backend_suite_not_run"
      ]
    },
    "execution_blocker_kind": { "enum": ["GENERATION", "MATERIAL", "REVIEW", "RATING", "DISPOSAL", "VALIDATION"] },
    "execution_blocker_status": { "enum": ["OPEN", "TRIAGED", "RESOLVED", "CLOSED"] },
    "readfeel_verdict_not_assigned": { "const": true },
    "body_free": { "const": true }
  }
}
```

### 12.6 `p5_disposal_receipt.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r48.p5_disposal_receipt.bodyfree.v1",
  "title": "Cocolon EmlisAI P7-R48 P5 Disposal Receipt - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "packet_kind",
    "case_count",
    "deleted_file_count",
    "disposal_status",
    "body_removed",
    "reviewer_notes_removed",
    "local_packet_exported",
    "content_hash_of_body_stored",
    "p7_material_body_free",
    "body_free",
    "release_allowed",
    "p7_complete",
    "p8_start_allowed",
    "hold004_close_allowed"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r48.p5_disposal_receipt.bodyfree.v1" },
    "review_session_id": { "type": "string" },
    "packet_kind": { "const": "p5_human_blind_qa_local_review_packet" },
    "case_count": { "type": "integer", "minimum": 0 },
    "deleted_file_count": { "type": "integer", "minimum": 0 },
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
    "p7_material_body_free": { "const": true },
    "body_free": { "const": true },
    "release_allowed": { "const": false },
    "p7_complete": { "const": false },
    "p8_start_allowed": { "const": false },
    "hold004_close_allowed": { "const": false }
  }
}
```

### 12.7 `p5_review_handoff_summary.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r48.p5_review_handoff_summary.bodyfree.v1",
  "title": "Cocolon EmlisAI P7-R48 P5 Review Handoff Summary - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "review_kind",
    "packet_kind",
    "case_count",
    "reviewed_case_count",
    "family_coverage_satisfied",
    "axis_averages",
    "open_blocker_ids",
    "open_execution_blocker_ids",
    "disposal_status",
    "body_removed",
    "reviewer_notes_removed",
    "p5_human_blind_qa_confirmed_candidate",
    "p6_limited_human_readfeel_start_allowed_candidate",
    "release_allowed",
    "p7_complete",
    "p8_start_allowed",
    "hold004_close_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r48.p5_review_handoff_summary.bodyfree.v1" },
    "review_session_id": { "type": "string" },
    "review_kind": { "const": "p5_history_line_readfeel" },
    "packet_kind": { "const": "p5_human_blind_qa_local_review_packet" },
    "case_count": { "type": "integer", "minimum": 24 },
    "reviewed_case_count": { "type": "integer", "minimum": 0 },
    "family_coverage_satisfied": { "type": "boolean" },
    "axis_averages": {
      "type": "object",
      "additionalProperties": { "type": ["number", "null"], "minimum": 0.0, "maximum": 1.0 }
    },
    "open_blocker_ids": { "type": "array", "items": { "type": "string" } },
    "open_execution_blocker_ids": { "type": "array", "items": { "type": "string" } },
    "disposal_status": { "type": "string" },
    "body_removed": { "type": "boolean" },
    "reviewer_notes_removed": { "type": "boolean" },
    "p5_human_blind_qa_confirmed_candidate": { "type": "boolean" },
    "p6_limited_human_readfeel_start_allowed_candidate": { "type": "boolean" },
    "release_allowed": { "const": false },
    "p7_complete": { "const": false },
    "p8_start_allowed": { "const": false },
    "hold004_close_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

---

## 13. Python module設計案

### 13.1 新規production候補

最小実装候補は1 moduleです。

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet.py
```

このmoduleに置く候補:

```text
constants:
  P7_R48_P5_REVIEW_POLICY_SCHEMA_VERSION
  P7_R48_P5_CASE_MATRIX_SCHEMA_VERSION
  P7_R48_P5_REVIEWER_PACKET_LOCAL_ONLY_SCHEMA_VERSION
  P7_R48_P5_RATING_ROW_BODYFREE_SCHEMA_VERSION
  P7_R48_P5_EXECUTION_BLOCKER_ROW_BODYFREE_SCHEMA_VERSION
  P7_R48_P5_DISPOSAL_RECEIPT_BODYFREE_SCHEMA_VERSION
  P7_R48_P5_REVIEW_HANDOFF_SUMMARY_BODYFREE_SCHEMA_VERSION

builders:
  build_p7_r48_p5_review_policy()
  build_p7_r48_p5_case_matrix()
  build_p7_r48_p5_controller_manifest()
  build_p7_r48_p5_reviewer_packet_schema()
  build_p7_r48_p5_body_full_generation_permission()
  build_p7_r48_p5_reviewer_packet_local_only_payload()
  normalize_p7_r48_p5_rating_row_bodyfree()
  build_p7_r48_p5_blocker_row_bodyfree()
  build_p7_r48_p5_execution_blocker_row_bodyfree()
  build_p7_r48_p5_disposal_receipt_bodyfree()
  build_p7_r48_p5_review_handoff_summary_bodyfree()
  build_p7_r48_validation_command_matrix()
  build_p7_r48_touch_candidate_no_touch_boundary()

assertions:
  assert_p7_r48_body_free_material_contract()
  assert_p7_r48_reviewer_packet_local_only_contract()
  assert_p7_r48_case_matrix_contract()
  assert_p7_r48_rating_row_bodyfree_contract()
  assert_p7_r48_execution_blocker_bodyfree_contract()
  assert_p7_r48_disposal_receipt_bodyfree_contract()
  assert_p7_r48_review_handoff_summary_bodyfree_contract()
```

### 13.2 optional helper module候補

実装時に単一moduleが大きくなりすぎる場合だけ、次を分けます。

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r48_local_review_file_ops.py
```

ただし、file ops moduleを作る場合も、本文入りpacketの生成は明示local root・明示許可時だけにします。

### 13.3 触らないproduction file

R48で触らない候補:

```text
Cocolon/screens/InputScreen.js
Cocolon/screens/input/useInputFeedbackModal.js
Cocolon/screens/input/inputFeedbackModel.js
Cocolon/screens/input/InputFeedbackReplyModal.js
Cocolon/tests/rn-screen-contracts.test.js
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
mashos-api/ai/services/ai_inference/emlis_ai_body_free_public_source_lineage.py
mashos-api/ai/services/ai_inference/api_emotion_submit.py
DB schema / migration files
API route files
runtime Gate threshold files
```

### 13.4 import方針

R48 moduleは、R47/R46の既存定義を参照して境界を一致させます。

```text
from emlis_ai_p7_r47_local_review_packet_policy import:
  P7_R47_LOCAL_REVIEW_ROOT_ENV_VAR
  P7_R47_PACKET_KINDS
  P7_R47_P5_FIRST_FORMAL_MINIMUMS
  P7_R47_P5_REVIEWER_FACING_ALLOWED_FIELD_REFS
  P7_R47_P5_REVIEWER_FACING_FORBIDDEN_FIELD_REFS
  P7_R47_P5_HISTORY_SURFACE_POLICY
  P7_R47_DISPOSAL_STATUSES
  P7_R47_BODY_FULL_PACKET_RETENTION_HOURS
  P7_R47_REVIEWER_NOTES_RETENTION_AFTER_RATING_HOURS

from emlis_ai_p7_r46_p5_p6_human_readfeel_handoff_material import:
  P5_HUMAN_BLIND_QA_FAMILIES
  P5_HUMAN_BLIND_QA_RATING_AXES
  P5_HUMAN_BLIND_QA_TARGETS
```

R47/R46側の既存値をコピーして独自にずらさないことをtestで固定します。

---

## 14. 実装順詳細

### R0: current source / R47 handoff / current HOLD state refreeze

目的:

```text
R48開始時点の状態を、P5未確認・P6閉じ・実機閉じ・release閉じとして再固定する。
```

実装段階で行うこと:

```text
- R47 final freeze helperを参照する。
- r47_policy_ready=true方向を確認する。
- p5_human_blind_qa_start_allowed_after_policy=true方向を確認する。
- p5_human_blind_qa_confirmed=falseを維持する。
- p6 / real_device / release / p7_complete / p8_startはfalseを維持する。
```

完了条件:

```text
- R48開始時点でP5合格扱いにしていない。
- R48開始時点でP6 startを開いていない。
- release系flagがfalse。
```

### R1: R48 scope / schema version / packet kind固定

目的:

```text
R48が扱うのはP5 actual review packetであり、P6・実機・releaseではないことを固定する。
```

実装段階で行うこと:

```text
- R48 schema version群を定義する。
- packet_kind = p5_human_blind_qa_local_review_packet に限定する。
- review_kind = p5_history_line_readfeel に限定する。
- release_allowed / p7_complete / p8_start_allowed / hold004_close_allowedをfalse固定する。
```

### R2: local storage root policy接続

目的:

```text
R47のlocal-only storage root policyをR48 actual packet側で再利用する。
```

実装段階で行うこと:

```text
- COCOLON_EMLIS_LOCAL_REVIEW_ROOT未設定ならgeneration blockedを返す。
- repo/docs/tests/services/release/artifact pathを拒否する。
- body-full generationにはexplicit allow flagを必須にする。
```

完了条件:

```text
- local root未設定時にbody-full packetが生成されない。
- invalid root指定時にexecution blockerへ落ちる。
- body-free case matrixは生成可能。
```

### R3: P5 24-case first formal review matrix builder

目的:

```text
P5 human Blind QAのcase matrixをbody-free controller materialとして作る。
```

実装段階で行うこと:

```text
- R47 minimumsを満たす24件matrixを生成する。
- family / case_role / tier_ref / packet_ref_id / blind_case_idをbody-freeで持つ。
- raw input / comment_text / history body / public metaを入れない。
```

完了条件:

```text
- 24件以上。
- 全family最低2件。
- history_line_eligible_input 4件以上。
- owned history positive 12件以上。
- low_information boundary 2件以上。
- free_tier boundary 2件以上。
```

### R4: blind_case_id / case_ref separation

目的:

```text
reviewer-facingとcontroller-facingの識別子を分離する。
```

実装段階で行うこと:

```text
- reviewer-facingはblind_case_idのみ。
- controller manifestはcase_ref_id / family / tier_refを持つ。
- blind_case_idからfamily / tier / expectedを推測できないことをtestする。
- blind_case_idを本文hashから作らない。
```

### R5: reviewer-facing local packet schema固定

目的:

```text
reviewerが読むpacketの許可field・禁止fieldを固定する。
```

実装段階で行うこと:

```text
- local-only schemaをbuilderで返す。
- allowed fields exactlyを固定する。
- forbidden fieldsをpayloadに入れたらassertで落とす。
- local_only / must_not_export / disposal_requiredを必須にする。
```

### R6: body-full packet materialization guard

目的:

```text
実装時にbody-full packet writerを作る場合でも、defaultで本文を生成しないようにする。
```

実装段階で行うこと:

```text
- build permission helperを作る。
- valid local root + explicit allowがない限りbody-full generation=false。
- unit testはtmp external root以外で本文packetを生成しない。
- generated local packetにはmust_not_export=trueを入れる。
```

### R7: local reviewer notes policy

目的:

```text
reviewer notesをlocal-onlyに閉じ、body-free materialへ残さない。
```

実装段階で行うこと:

```text
- reviewer notes schemaはlocal-only扱いにする。
- body-free rating rowにreviewer_free_text_included=falseを必須にする。
- free textはreason_id / blocker_idへ手動分類後に破棄する設計にする。
```

### R8: rating row normalizer

目的:

```text
review結果をbody-free rating rowへ変換する。
```

実装段階で行うこと:

```text
- 0.0〜1.0 scoreをnormalizeする。
- axes欠損をpass扱いにしない。
- reviewer text payloadをstripではなくrejectに近い扱いで検知する。
- machine metricによるreadfeel補完を禁止する。
```

### R9: blocker / execution blocker row builder

目的:

```text
読感上の問題と、実行不能・生成不能を混ぜない。
```

実装段階で行うこと:

```text
- readfeel blocker rowを作る。
- execution blocker rowを作る。
- timeout / missing local root / material missingをREDではなくexecution blockerにする。
```

### R10: disposal receipt builder

目的:

```text
body-full packetとreviewer notesの廃棄確認をbody-freeで残す。
```

実装段階で行うこと:

```text
- disposal receipt schemaを作る。
- body_removed / reviewer_notes_removed / local_packet_exported=false / content_hash_of_body_stored=falseを必須にする。
- body hash / local absolute path / deleted previewを禁止する。
```

### R11: P5 review handoff summary builder

目的:

```text
P5 human Blind QAの結果を、P6へ進めるかどうかの材料としてbody-freeでまとめる。
```

実装段階で行うこと:

```text
- case coverageを集計する。
- axis averagesを集計する。
- open blockerを集計する。
- disposal statusを確認する。
- p5_human_blind_qa_confirmed_candidateを算出する。
- p6_limited_human_readfeel_start_allowed_candidateを算出する。
- release_allowed / p7_complete / p8_start_allowedはfalseのままにする。
```

### R12: P5 confirmed candidate gate

目的:

```text
P5 confirmed候補を、ratingだけでなくcoverage / blocker / disposalで判断する。
```

実装段階で行うこと:

```text
- confirmed candidate true条件を関数化する。
- body_removed=falseならtrue不可。
- RED / REPAIR_REQUIRED / policy blockerがopenならtrue不可。
- boundary violationがあればtrue不可。
```

### R13: R47 regression / no body-free leak guard

目的:

```text
R48追加でR47のlocal-only / body-free境界を壊していないことを確認する。
```

実装段階で行うこと:

```text
- R47 target testsを再実行対象に入れる。
- body-free materialに本文keyを入れたら落とすtestを追加する。
- reviewer packetをbody-free materialへ渡したら落とすtestを追加する。
```

### R14: R46 handoff regression

目的:

```text
R46で固定したP5/P6/実機HOLDとnext-decision ledgerを壊さない。
```

実装段階で行うこと:

```text
- R46 P5/P6 handoff testsを再実行対象に入れる。
- R46 real-device closed validation testsを再実行対象に入れる。
- R46 next decision ledger testsを再実行対象に入れる。
```

### R15: P5 core subset regression

目的:

```text
R48はP5 runtimeを変えないが、P5の既存境界を壊していないことを確認する。
```

実装段階で行うこと:

```text
- user_label_connection material / candidate / gate / surface / public boundary / e2e contractを対象に入れる。
- product quality QA系は必要に応じて対象に入れる。
```

### R16: display contract / RN no-touch confirmation

目的:

```text
R48がpublic response shapeとRN表示条件を変えていないことを確認する。
```

実装段階で行うこと:

```text
- test_emlis_ai_display_contract.pyを対象に入れる。
- RN contractはno-touch確認として任意または別枠で実行する。
- RN production filesは触らない。
```

### R17: validation command matrix

目的:

```text
実行したものと未実行のものを分け、green未確認をgreenと言わない。
```

実装段階で行うこと:

```text
- py_compile
- R48 target tests
- R47 target regression
- R46 handoff regression
- display contract regression
- P5 core subset regression
- backend collect-only
- RN contract optional
```

### R18: touch candidate / no-touch boundary freeze

目的:

```text
R48実装範囲がruntime / RN / API / DB / releaseへ拡散しないようにする。
```

実装段階で行うこと:

```text
- allowed production file refsを固定する。
- allowed test file refsを固定する。
- explicit no-touch refsを固定する。
- forbidden actual touched refsをtestする。
```

---

## 15. 新規test設計案

### 15.1 test module候補

```text
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r0_r1_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r2_r3_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r4_r5_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r6_r7_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r8_r9_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r10_r12_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r13_r15_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r16_r18_20260618.py
```

### 15.2 必須test観点

```text
- R48 policyはrelease_allowed / p7_complete / p8_start_allowedをtrueにしない。
- R47 policy readyをP5 confirmedへ変換しない。
- case matrixが24件条件を満たす。
- reviewer-facing packetにfamily / tier / expected / case_ref_id / raw_input / comment_textが入らない。
- body-free materialにcurrent_input_review_surface / returned_emlis_surface / bounded_history_review_surfaceが入らない。
- local root未設定ではbody-full packet生成不可。
- invalid rootではbody-full packet生成不可。
- explicit allowなしではbody-full packet生成不可。
- rating rowはreviewer_free_text / terminal_output / body hashを拒否する。
- execution blockerはreadfeel REDと分離される。
- disposal receiptはbody hash / local path / deleted previewを拒否する。
- body_removed=falseではP5 confirmed candidate不可。
- open RED / REPAIR_REQUIRED / boundary violationではP5 confirmed candidate不可。
- no-touch refsに触れた扱いならtestが落ちる。
```

---

## 16. validation command matrix案

実装段階のtarget validation候補は次です。  
本設計書作成時点では実行していません。

### 16.1 syntax / import

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference python -m py_compile \
  services/ai_inference/emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet.py
```

### 16.2 R48 target tests

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r0_r1_20260618.py \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r2_r3_20260618.py \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r4_r5_20260618.py \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r6_r7_20260618.py \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r8_r9_20260618.py \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r10_r12_20260618.py \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r13_r15_20260618.py \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r16_r18_20260618.py
```

### 16.3 R47 regression

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r47_local_review_packet_policy_r0_r1_20260618.py \
  tests/test_emlis_ai_p7_r47_local_review_packet_policy_r2_r3_20260618.py \
  tests/test_emlis_ai_p7_r47_local_review_packet_policy_r4_r5_20260618.py \
  tests/test_emlis_ai_p7_r47_local_review_packet_policy_r6_r7_20260618.py \
  tests/test_emlis_ai_p7_r47_local_review_packet_policy_r8_r9_20260618.py \
  tests/test_emlis_ai_p7_r47_local_review_packet_policy_r10_r11_20260618.py \
  tests/test_emlis_ai_p7_r47_local_review_packet_policy_r12_r13_20260618.py \
  tests/test_emlis_ai_p7_r47_local_review_packet_policy_r14_r15_20260618.py
```

### 16.4 R46 regression + display contract

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r46_next_decision_handoff_ledger_r14_20260617.py \
  tests/test_emlis_ai_p7_r46_p5_p6_human_readfeel_handoff_material_r10_r11_20260617.py \
  tests/test_emlis_ai_p7_r46_real_device_modal_review_closed_validation_r12_r13_20260617.py \
  tests/test_emlis_ai_display_contract.py
```

### 16.5 P5 core subset

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_user_label_connection_material.py \
  tests/test_emlis_ai_user_label_connection_candidate.py \
  tests/test_emlis_ai_user_label_connection_gate.py \
  tests/test_emlis_ai_user_label_connection_surface.py \
  tests/test_emlis_ai_user_label_connection_public_boundary.py \
  tests/test_emlis_ai_user_label_connection_e2e_contract.py
```

### 16.6 backend collect-only

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest --collect-only -q
```

注意:

```text
collect-onlyはfull backend suite greenではない。
```

### 16.7 RN no-touch confirmation

```bash
cd Cocolon
npm run test:rn-screens --silent
```

R48でRNを触らないならoptional扱いでもよいですが、成果物提出前の安心材料として実行候補に入れます。

---

## 17. 実装段階で触る候補 / 触らない境界

### 17.1 production touch candidate

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet.py
```

### 17.2 optional touch candidate

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r48_local_review_file_ops.py
mashos-api/ai/docs/Cocolon_EmlisAI_P7_R48_P5HumanBlindQAActualReviewPacket_20260618.md
```

### 17.3 test touch candidate

```text
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_*.py
```

### 17.4 no-touch boundary

```text
RN production files
RN contract test files
API route files
DB schema / migration files
emlis_ai_reply_service.py
emlis_ai_public_feedback_meta.py
emlis_ai_body_free_public_source_lineage.py
runtime Gate threshold files
release material files
existing user-facing surface composer runtime
```

R48はP5のレビュー準備・review packet・rating handoffの段階であり、Emlis本文runtimeを改善する段階ではありません。

---

## 18. acceptance criteria

### 18.1 設計書としての完了条件

```text
- R48の目的がP5 actual review packet / rating handoff / disposalであることを固定した。
- R48がP5合格・P6開始・release判断ではないことを固定した。
- body-full local packet生成境界を固定した。
- P5 24-case first formal review matrixを固定した。
- reviewer-facing allowed / forbidden fieldsを固定した。
- rating / blocker / execution blocker / disposal receiptのbody-free化を固定した。
- JSON / schema案を設計書内に含め、実ファイル化しないことを明記した。
- 実装順をR0〜R18で分けた。
- validation command matrixを含めた。
- no-touch境界を明記した。
```

### 18.2 実装後の完了条件

```text
- R48 target testsがgreen。
- R47 target regressionがgreen。
- R46 handoff regression + display contractがgreen。
- P5 core subsetがgreen。
- body-free leak guardがbody-full/reviewer text/hash/pathを拒否する。
- local root未設定時にbody-full packetを生成しない。
- invalid local root指定時にbody-full packetを生成しない。
- explicit allowなしにbody-full packetを生成しない。
- release_allowed / p7_complete / p8_start_allowed / hold004_close_allowedがfalse。
```

### 18.3 actual review後のP5 confirmed候補条件

```text
- 24件以上review済み。
- family coverage達成。
- rating axes達成。
- RED / REPAIR_REQUIRED / policy blockerなし。
- low_information / free_tier boundary violationなし。
- body_removed=true。
- reviewer_notes_removed=true。
- disposal_statusがverified系。
- local_packet_exported=false。
- content_hash_of_body_stored=false。
```

---

## 19. R48でしてはいけないこと

```text
- P5 human Blind QAを実施済みにする。
- body-full packet本体をmd成果物へ貼る。
- body-full packet本体を /mnt/data 成果物へ置く。
- body-full packet本体を前提資料zip / 実装済み資料zip / release materialへ混ぜる。
- reviewer free textをP7 scorecard / release materialへ残す。
- raw input / comment_text / candidate body / surface body / raw history dumpをbody-free materialへ残す。
- body content hashを保存する。
- local packet policy readyをP5合格に変換する。
- P5 core subset greenをP5商品品質合格に変換する。
- P6をP5の代替として先に進める。
- 実機modalで違和感を見れば十分という扱いにする。
- full backend collect-onlyをfull backend suite greenに変換する。
- release_allowed / p7_complete / p8_start_allowed / hold004_close_allowedをtrueにする。
- RN表示条件を変える。
- API response top-level keyを増やす。
- DB schemaを変える。
- Gate閾値を緩める。
- fixed commentText / case専用surfaceを追加する。
```

---

## 20. 確認済み / 未確認 / 書かれていない / 次に実行すべきこと

### 確認済み

```text
- R47 policy ready後の次段階はP5 human Blind QA actual review preparationである。
- P5 human Blind QA confirmedはまだfalse。
- P6 / 実機 / P8 / releaseは閉じたまま。
- R48設計では、P5 actual review packet generation / rating handoff / disposalを中心にする。
- R48設計では、body-full local packetとbody-free P7 materialを分ける。
- R48設計では、json / schema案は文書内候補に留める。
```

### 未確認

```text
- R48の実装結果。
- R48 target testsの実行結果。
- actual local root。
- actual body-full packet生成結果。
- actual reviewer assignment。
- actual rating rows。
- actual disposal receipt。
- actual P5 confirmed可否。
```

### 書かれていないためR48設計で固定したこと

```text
- R48正式名を `P5 Human Blind QA Actual Review Packet` として扱う。
- R48 first formal review matrixを24件で配分する。
- body-full writerは明示local root・明示許可時だけの実装候補にする。
- defaultはbody-free / dry-run側に倒す。
- P5 confirmed候補はratingだけでなくdisposal verifiedまで含める。
```

### 次に実行すべきこと

```text
1. R48実装段階に進む場合、この設計書のR0から開始する。
2. まず新規R48 moduleとR48 target testsを作る。
3. body-full writerを作る場合も、default生成不可・explicit allow必須で実装する。
4. R48 target tests + R47/R46/display/P5 core regressionを実行する。
5. 実レビューは、local root・reviewer・packet disposal運用を固定してから別途実施する。
6. P5 confirmed / P6 startは、actual review resultとdisposal receiptを見て別判断する。
```

---

## 21. 華恋の意見

華恋の意見として、R48は **writerを恐れて避ける** より、**writerの危険を境界で縛って正面から扱う** 方がCocolonを守れます。

P5の履歴線は、Cocolonの価値そのものに近い場所です。  
そこを「本文を扱うのが怖いから読まない」にすると、Cocolonは本当に価値が出ているか分からないまま次へ進んでしまいます。

でも、本文を成果物に混ぜるのはもっと危険です。  
だから、R48では次を徹底します。

```text
読むための本文はlocal-only。
残すための材料はbody-free。
P5を守るために読む。
ユーザーの言葉を守るために残さない。
```

P5は、自動testだけで完了扱いにしてはいけません。  
Cocolonとして本当に見たいのは、履歴線が「便利な機能」になっているかではなく、ユーザーが「ここに残した意味があった」と感じられるかです。

そのため、次の実装はR48で進めるべきです。  
ただし、P5の読感で違和感が出たら、P6やP8で補うのではなく、P5の表面化・境界・履歴距離に戻って直すべきです。

Cocolonは、ユーザーの言葉を雑に処理しない場所です。  
過去記録を読む工程こそ、いちばん雑にしてはいけません。
