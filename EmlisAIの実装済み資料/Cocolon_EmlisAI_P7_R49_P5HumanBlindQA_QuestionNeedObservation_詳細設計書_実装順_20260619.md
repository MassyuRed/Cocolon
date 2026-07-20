# Cocolon / EmlisAI P7-R49 P5 Human Blind QA 実レビュー実行 + 観測補助問い必要性観察 詳細設計書・実装順

作成日: 2026-06-19 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書  
対象: Cocolon / EmlisAI / `/emotion/submit` immediate observation / `Emlisの観測` / P7 Product Quality Runner / P5 User Label Connection / P5 Human Blind QA / P7-P8 Bridge / 観測補助問い必要性観察  
基準検討メモ: `Cocolon_EmlisAI_P7_R49_P5HumanBlindQA_QuestionNeedObservation_PreDesignMemo_20260619.md`  
基準ロードマップ: `Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(1).md`  
基準ローカル受領zip: `Cocolon_前提資料(237).zip` / `EmlisAIの実装済み資料(71).zip` / `Cocolon(244).zip` / `mashos-api(157).zip`  
GitHub接続確認: Mash指定により不要。未実施。  
コード変更: なし。本書は設計書。  
json / schema実ファイル化: なし。本書内のjson / schema案は実装段階で採否判断する。  
body-full review packet生成: なし。  
P5 Human Blind QA実施: なし。  
reviewer rating記入: なし。  
問い必要性観察メモ実ケース記入: なし。  
body-full packet廃棄実行: なし。  
P8観測補助問い詳細設計: まだ行わない。  
API / DB / RN UI / public response key変更: なし。  
release判断変更: なし。  

---

## 0. この設計書の結論

今回の次実装段階は、次で固定します。

```text
P7-R49:
P5 Human Blind QA Actual Review Execution
+ P7/P8 Bridge Question Need Observation Capture
```

日本語で言うと、R49は次の段階です。

```text
R48で作ったP5人間読感レビューの足場を使い、
P5 24-case first formal reviewを実際に人間が読める実行手順へ進める。
同じreview sessionの各caseに、P8詳細設計の材料となるbody-freeな問い必要性観察rowを残す。
```

ただし、R49は **P8観測補助問いの詳細設計でも実装でもありません**。  
R49で作るのは、問いそのものではなく、問いが必要だったかを安全に観察する器です。

R49で中心に置く実装対象は次です。

```text
1. R48の24-case matrix / local-only packet / rating / blocker / disposal方針を引き継ぐ。
2. P5 actual review sessionの開始・進行・完了・block状態をbody-freeに管理する。
3. body-full reviewer packetはlocal-onlyかつ明示許可時だけ扱う。
4. reviewer rating / blocker / execution blocker / disposal receiptはbody-freeで残す。
5. 各caseにquestion need observation rowをbody-freeで残す。
6. question need observation rowには、raw input / raw answer / comment_text body / returned surface / reviewer free text / 質問本文を残さない。
7. P5 confirmed candidateは、review結果・blocker absence・disposal verified・観察row完備後だけ候補化する。
8. P5 confirmed candidateが出ても、P7 complete / P8 start / release allowedはtrueにしない。
9. P6 limited human readfeel start allowedは、P5 review結果を見た別判断候補としてだけ出す。
10. API / DB / RN / public response key / 発生ロジック / 保存schemaはR49では触らない。
```

華恋の判断として、R49で最も大事なのは、**P5の弱さを問いで隠さないこと**です。  
問いが必要そうに見えるcaseでも、理由が「Emlis本体が浅い」「P5 surfaceが汎用」「Gate境界が弱い」なら、それはP8観測補助問い候補ではなくP5/P7修正対象です。R49は、その分離をレビュー実行の中で残すための設計です。

---

## 1. なぜこの作業を行うのか

Cocolonの価値は、ユーザーがCocolonへ残した言葉・感情・カテゴリ・行動・時点・過去記録が、入力直後に「読まれた形」として返ることです。

P5 User Label Connectionは、その中核です。

```text
現在入力だけではなく、過去に残した記録が自然な線として返る。
そのことで、Cocolonに記録を積む意味が生まれる。
```

ただし、履歴線は価値と同時に危険を持ちます。

```text
- 監視されている感じが出る。
- 「あなたはいつも」「原因は」「性格です」へ寄る。
- 低情報入力を履歴で深読みする。
- 自己責めや不安を増幅する。
- 現在入力の弱さを履歴で補完してしまう。
```

R48は、この危険を人間が読める形で測るための足場です。  
しかし、R48の足場がgreenでも、まだP5 human Blind QAの実レビューは終わっていません。

今回のロードマップには、P7/P8 Bridgeとして次の条件が追加されています。

```text
P7のP5 human Blind QA、P6 limited human readfeel、実機modal確認では、
観測補助問いを実装しない。
ただし、P8で詳細設計を勘で作らないため、各評価ケースに対して、
body-freeの問い必要性観察メモを残す。
```

つまり、今必要なのは次です。

```text
P5履歴線を実際に読む。
その読感の中で、問いなしで観測できるcase、1問あれば補完リスクを下げられるcase、
問いではなくEmlis本体・P5 surface・Gateを直すべきcaseを分ける。
```

この分離がないままP8へ行くと、Cocolonは「入力直後に読まれる体験」ではなく、「問い返しで補う会話AI」へ寄ります。  
R49は、それを防ぐためのP7内作業です。

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
Cocolon_EmlisAI_P7_R49_P5HumanBlindQA_QuestionNeedObservation_詳細設計書_実装順_20260619.md
```

### 2.3 今回していないこと

```text
- コード変更
- patch作成
- 実装zip作成
- JSON / schema案の実ファイル化
- body-full packet生成
- P5 human Blind QA実施
- reviewer rating記入
- reviewer notes生成
- 問い必要性観察メモ実ケース記入
- body-full packet廃棄実行
- P5 confirmed化
- P6 limited human readfeel開始
- P8観測補助問い詳細設計
- 観測補助問いAPI / DB / RN / response key設計
- 実機modal読感確認
- full backend suite実行
- P7 complete / P8 start / release判断変更
```

---

## 3. 参照・確認範囲

### 3.1 作業姿勢として確認した前提資料

```text
Cocolon_前提資料(237).zip / Cocolon_前提資料/
  - 00_karen_read_first.md
  - cocolon_thought_material_for_karen.md
  - emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
  - emlis_ai_state_answer_human_follow_definition_2026_05_26.md
  - cocolon_environment_state_output_observation_structure_design_2026_05_25.md
  - Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md
  - Cocolon_EmlisAI_NormalObservation_PublicRecovery_ImplementationStatus_2026-06-06.md
  - work_attitude_rules_for_karen/00_read_first.txt
  - work_attitude_rules_for_karen/09_work_start_checklist.txt
  - work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
  - work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
  - work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
```

作業姿勢として固定したこと:

```text
- Cocolonは文字列処理サービスではなく、人間情報の観測構造である。
- EmlisAIは、入力直後の観測返答であり、テンプレ共感や診断ラベルではない。
- 設計と実装を混ぜない。
- 前提資料だけで理解した扱いにしない。実ファイルを見る。
- 見ていないものを確認済みにしない。
- 通っていないものをgreenと言わない。
- test greenを商品価値合格へ変換しない。
- API / DB / RN表示条件 / public response key / ユーザーデータ保護を勝手に変えない。
- 華恋の意見は、確認済み事実と分けて出す。
```

### 3.2 対象ロードマップ

```text
Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(1).md
```

確認した中心:

```text
- P7はProduct Quality Runner / Long-run Product Gate。
- P7完了条件は緩めない。
- P7/P8 Bridgeでは、P5 human Blind QA / P6 limited human readfeel / 実機modal確認中に、body-freeの問い必要性観察メモを残す。
- P7では観測補助問いのAPI / DB / RN UI / response key / 発生ロジック / 保存schemaを実装しない。
- P8開始時に、収集した観察メモを観測補助問いの詳細設計材料として使う。
```

### 3.3 参照した実装済み資料

```text
EmlisAIの実装済み資料(71).zip / EmlisAIの実装済み資料/
  - Cocolon_EmlisAI_P7_R48_P5HumanBlindQAActualReviewPacket_詳細設計書_実装順_20260618.md
  - Cocolon_EmlisAI_P7_R47_LocalReviewPacketPolicy_DetailedDesign_ImplementationOrder_20260618.md
  - Cocolon_EmlisAI_P7_R46_P5P6Return_DisplayContractRedClassification_DetailedDesign_ImplementationOrder_20260617.md
  - Cocolon_EmlisAI_P7_ProductQualityRunner_DetailedDesign_ImplementationOrder_20260612.md
```

### 3.4 参照した現行実ファイル

```text
mashos-api(157).zip / mashos-api/ai/services/ai_inference/
  - emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet.py
  - emlis_ai_p7_r47_local_review_packet_policy.py
  - emlis_ai_p7_r46_p5_p6_human_readfeel_handoff_material.py
  - emlis_ai_p7_r46_real_device_modal_review_closed_validation.py
  - emlis_ai_user_label_connection_material.py
  - emlis_ai_user_label_connection_candidate.py
  - emlis_ai_user_label_connection_gate.py
  - emlis_ai_user_label_connection_surface.py
  - emlis_ai_user_label_connection_p5_product_quality_review.py
```

R48関連testファイル:

```text
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r0_r1_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r2_r3_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r4_r5_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r6_r7_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r8_r9_20260618.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r10_r11_20260619.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r12_r13_20260619.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r14_r15_20260619.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r16_r17_20260619.py
mashos-api/ai/tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r18_20260619.py
```

### 3.5 確認済みtest結果の扱い

検討メモ上、直近ローカル確認として次が確認されています。

```text
RN contract: 36 passed
R48 target: 82 passed
Display contract: 5 passed
API contract / two-stage reception E2E: 10 passed / 3 warnings
P5 User Label Connection core subset: 63 passed / 1 warning
P6 Structure Insight subset: 131 passed
backend collect-only: 3291 tests collected / 1 warning
```

読み:

```text
- R48 target greenは、P5 human Blind QA実レビュー完了ではない。
- backend collect-onlyは、full backend suite execution greenではない。
- RN contract greenは、実機modal読感確認ではない。
- P5 core subset greenは、ユーザーが「記録が積み上がった」と感じる確認ではない。
```

---

## 4. 現在地の固定

### 4.1 確認済み

```text
- R47 local-only / body-free review packet policyが存在する。
- R48 P5 Human Blind QA Actual Review Packet helperが存在する。
- R48は24-case matrix / reviewer-facing packet schema / rating row / blocker row / execution blocker row / disposal receipt / P5 confirmed candidate gateの足場を持つ。
- R48 target testsは直近確認で82 passed。
- R48は、P5 human Blind QA actual reviewそのものを実施していない。
- body-full packet本体生成、rating記入、reviewer notes生成、disposal実行は未実施。
- P5 human Blind QA confirmedはfalse扱い。
- P6 limited human readfeel start allowedはfalse扱い。
- 実機modal review start / confirmedはfalse扱い。
- p7_complete / p8_start_allowed / release_allowed / hold004_close_allowedはfalse扱い。
```

### 4.2 未確認

```text
- P5 actual human Blind QA結果。
- R48の24-case first formal review matrixを使った実review session。
- local-only body-full reviewer packet本体の生成結果。
- reviewer rating rowsの実記入結果。
- blocker rows / execution blocker rowsの実生成結果。
- disposal receiptの実生成・実廃棄確認。
- 問い必要性観察メモの実ケース結果。
- P5 confirmed candidate gateの実判定結果。
- P6 limited human readfeel review開始可否。
- 実機submit / modal読感確認。
- full backend suite execution green。
- P7-HOLD-004 closure。
- P7 complete。
- P8 start allowed。
- release readiness。
```

### 4.3 書かれていない

```text
- R48完了後にP5 human Blind QA confirmedをtrueへ上げてよい、とは書かれていない。
- R48 target 82 passedを、P5読感合格として扱ってよい、とは書かれていない。
- P7/P8 Bridgeの観察メモを集める前に、P8観測補助問い詳細設計へ進んでよい、とは書かれていない。
- 観測補助問いのAPI / DB / RN UI / response key / 保存schemaをP7で実装してよい、とは書かれていない。
- 問い返しでEmlis本体の読感不足を補ってよい、とは書かれていない。
- 実機modal確認前にrelease判断へ進めてよい、とは書かれていない。
```

### 4.4 推測禁止

```text
- R48の足場実装 = P5 human Blind QA完了。
- R48 target green = P5履歴線が商品品質として自然。
- P5 core subset green = ユーザーが「記録が積み上がった」と感じる。
- collect-only green = full backend suite execution green。
- RN contract green = 実機modal読感確認済み。
- P7/P8 Bridge追記 = P8を今すぐ始めてよい。
- 問い必要性観察メモ = 観測補助問いの実装仕様。
- 問いが必要そう = Emlis本体を直さなくてよい。
- 観測補助問い = 会話ラリー型AIへの変更。
```

---

## 5. R49の対象と非対象

### 5.1 R49で扱う対象

```text
- R48 handoffの再freeze。
- P5 24-case first formal review sessionのbody-free execution policy。
- local-only body-full reviewer packet生成・review・廃棄の実行手順。
- rating row / blocker row / execution blocker rowのbody-free ingestion。
- disposal receiptのbody-free ingestion。
- question need observation rowのbody-free schema / normalizer / summary。
- P5 confirmed candidate gateへのquestion observation completeness接続。
- P6 limited human readfeel start candidate handoff。
- P8開始時に参照できるbody-free observation summary候補。
- no-touch boundary / validation command matrix。
```

### 5.2 R49で扱わない対象

```text
- 観測補助問いのAPI設計。
- 観測補助問いのDB保存schema設計。
- 観測補助問いのRN UI設計。
- 観測補助問いのpublic response key設計。
- 観測補助問いの発生判定ロジック設計。
- 観測補助問いの質問本文生成。
- 問い回答の保存・元入力への紐づけ。
- P8 Derived User Modelの実装。
- Emlis本文runtime改善。
- User Label Connection runtime gate変更。
- RN modal表示変更。
- DB migration。
- release判断。
```

### 5.3 R49の名前

実装段階でのmodule名候補は次です。

```text
services/ai_inference/emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution.py
```

必要なら、local file operationを分離するoptional helper候補として次を置けます。

```text
services/ai_inference/emlis_ai_p7_r49_local_review_session_file_ops.py
```

ただし、実ファイル化は実装段階で判断します。  
本設計書では、ファイル作成・コード変更は行いません。

---

## 6. R49の基本設計

### 6.1 R49で扱う四層

R49では、同じreview sessionの中に四層を持ちます。

```text
Layer A: body-free controller material
  - review_session_id
  - case matrix refs
  - blind_case_id / packet_ref_id
  - family / case_role / tier_ref
  - session status
  - execution blocker state
  - body-free only

Layer B: local-only body-full reviewer packet
  - reviewerが読む本文入りpacket
  - current_input_review_surface
  - returned_emlis_surface
  - bounded_owned_history_review_surface
  - review_questions
  - axis_rating_form
  - local-only / must_not_export / disposal_required

Layer C: body-free review result material
  - rating rows
  - blocker rows
  - execution blocker rows
  - disposal receipt
  - review handoff summary
  - P5 confirmed candidate gate summary

Layer D: body-free question need observation material
  - question need observation rows
  - question need observation summary
  - P8 design material candidate summary
  - question textなし
  - question trigger logicなし
  - API / DB / RN / response key影響なし
```

この四層の混線を防ぐことが、R49の中心です。

### 6.2 R49で生成してよいもの / 生成してはいけないもの

| 種別 | R49実装で生成可能 | 生成条件 | 成果物・P7 materialへ残せるか |
|---|---:|---|---:|
| body-free review session envelope | yes | 常時可 | yes |
| body-free case manifest | yes | R48 matrix参照 | yes |
| local-only reviewer packet schema | yes | 常時可 | schemaだけyes |
| local-only body-full reviewer packet本体 | 条件付き | valid local root + 明示許可 + no export | no |
| reviewer free text / notes | 条件付き | local-only / rating抽出後廃棄 | no |
| body-free rating row | yes | review結果入力後 | yes |
| body-free blocker row | yes | review結果入力後 | yes |
| execution blocker row | yes | 生成不能・review不能・disposal不能時 | yes |
| body-free disposal receipt | yes | purge後 / 生成blocked時 | yes |
| body-free question need observation row | yes | 各case review後 | yes |
| body-free question need observation summary | yes | rows集計後 | yes |
| question text / draft question text | no | R49では不可 | no |
| P8 question trigger logic | no | R49では不可 | no |
| P5 confirmed candidate | 条件付き | review + blockersなし + disposal verified + observation rows完備後 | summary上の候補のみ |
| P6 start candidate | 条件付き | P5 confirmed candidate後の別判断候補 | summary上の候補のみ |
| p7_complete / p8_start_allowed / release_allowed | no | R49では不可 | no |

---

## 7. P5 actual review execution flow

### 7.1 review session state

R49では、P5 actual review sessionの状態をbody-freeで扱います。

```text
NOT_STARTED
PRECHECK_BLOCKED
LOCAL_PACKETS_READY
REVIEW_IN_PROGRESS
RATINGS_CAPTURED_BODYFREE
QUESTION_OBSERVATIONS_CAPTURED_BODYFREE
DISPOSAL_PENDING
DISPOSAL_VERIFIED
SUMMARY_FINALIZED
BLOCKED
```

各statusの意味:

| status | 意味 | body-full残存可否 | P7 materialへ残すもの |
|---|---|---:|---|
| NOT_STARTED | review session未開始 | no | session envelopeのみ |
| PRECHECK_BLOCKED | local root / explicit allow / case matrix等で開始不能 | no | execution blocker row |
| LOCAL_PACKETS_READY | local-only packetが生成済み | yes, local-only | packet count / statusのみ |
| REVIEW_IN_PROGRESS | reviewerが読んでいる | yes, local-only | progress countのみ |
| RATINGS_CAPTURED_BODYFREE | rating rows抽出済み | 原則purge pending | rating / blocker rows |
| QUESTION_OBSERVATIONS_CAPTURED_BODYFREE | question observation rows抽出済み | 原則purge pending | question rows / summary |
| DISPOSAL_PENDING | disposal前 | yes/no混在しうる | pending statusのみ |
| DISPOSAL_VERIFIED | body-full / notes purge確認済み | no | disposal receipt |
| SUMMARY_FINALIZED | handoff summary確定 | no | body-free summary |
| BLOCKED | review続行不能 | no または要purge | execution blocker row |

### 7.2 実行手順の全体

```text
1. R48 current source / case matrix / local-only policy / no-touch boundaryを再確認する。
2. R49 review_session_idを発行する。
3. R48 24-case first formal review matrixを読み、body-free controller manifestを作る。
4. local root / explicit allow / no repo root / no artifact root / no zip export をpreflightする。
5. body-full reviewer packetをlocal-onlyで生成する。生成不可ならexecution blocker rowを作る。
6. reviewerはblind_case_id単位で本文を読む。
7. reviewerはP5 rating axesへscore / verdict / sanitized_reason_idsを入れる。
8. reviewerは同じcaseにquestion need observation classを入れる。
9. reviewer free textがある場合もlocal-onlyに置き、body-free materialへはsanitized_reason_idsだけを残す。
10. rating rows / blocker rows / question observation rowsをbody-free normalizerへ通す。
11. body-full packet / reviewer notesをpurgeする。
12. disposal receiptをbody-freeで残す。
13. review summary / question observation summary / P5 confirmed candidate gateを作る。
14. P6 limited human readfeel start candidateを、候補としてだけ出す。
15. P8開始時に参照できるquestion observation summaryを候補としてだけ出す。
16. P7 complete / P8 start / release allowedはfalseのまま固定する。
```

### 7.3 reviewerの読み方

reviewerは、P5履歴線について次を読む必要があります。

```text
- 今回のEmlis応答は、現在入力を消していないか。
- 履歴線は自然か。
- 履歴線は「自分の記録が返ってきた」感につながるか。
- 履歴線は監視感・決めつけ・深読みになっていないか。
- Free / low information / safety adjacentで履歴線が漏れていないか。
- またCocolonへ残したくなるか。
```

その後、別軸として次を読む必要があります。

```text
- このcaseは、問いなしで十分観測できるか。
- 1問あれば補完リスクを下げられたか。
- 問いを出すと入力直後の観測体験が重くならないか。
- 問いではなくEmlis本体・P5 surface・Gate境界を直すべきではないか。
```

ここで重要なのは、ratingとquestion need observationを混ぜないことです。

```text
rating = P5履歴線が商品として読めたか。
question need observation = P8で問い補助が必要になる曖昧さがあったか。
```

---

## 8. local-only body-full material handling

### 8.1 local root policy

R49では、R47/R48のlocal root policyを継続します。

```text
COCOLON_EMLIS_LOCAL_REVIEW_ROOT
```

body-full packet本体は、次を満たす場合だけ生成候補になります。

```text
- local rootが明示されている。
- local rootがrepo root / artifact root / `/mnt/data`直下成果物置き場ではない。
- 明示的なbody-full packet generation allowがある。
- packetに local_only=true / must_not_export=true / disposal_required=true が入る。
- packet path / local absolute path / content hashをbody-free materialへ残さない。
```

### 8.2 directory構造案

実装段階で採用判断するlocal-only directory構造案です。

```text
$COCOLON_EMLIS_LOCAL_REVIEW_ROOT/
  p7_r49/
    sessions/
      <review_session_id>/
        local_only_body_full_packets/
          <blind_case_id>.json
        local_only_reviewer_notes/
          <blind_case_id>.local.md
        body_free_extract/
          rating_rows.bodyfree.jsonl
          blocker_rows.bodyfree.jsonl
          question_need_observation_rows.bodyfree.jsonl
          disposal_receipt.bodyfree.json
        DO_NOT_EXPORT.txt
```

注意:

```text
- このdirectory構造はlocal-only実行候補であり、成果物として渡さない。
- `local_only_body_full_packets/` と `local_only_reviewer_notes/` はpurge対象。
- `body_free_extract/` でも、成果物へ入れるかは実装段階の判断にする。
- body-free extractへも、本文・質問本文・reviewer free text・local path・hashを入れない。
```

### 8.3 local-only packetに入れてよいもの

R48のreviewer-facing allowed fieldsを引き継ぎます。

```text
- blind_case_id
- review_kind
- review_prompt_version
- current_input_review_surface
- returned_emlis_surface
- bounded_owned_history_review_surface
- review_questions
- axis_rating_form
```

これはbody-full materialなので、local-onlyです。  
成果物・前提資料・実装済み資料・P7 material・release materialへ混ぜません。

### 8.4 local-only packetに入れてはいけないもの

```text
- user_id
- record_id
- db_id
- raw history dump
- public meta
- controller expected result
- family / subscription_tier / eligible / gate_resultなどreviewerのblind性を壊す情報
- raw input
- raw answer
- comment_text body
- candidate body
- surface body
- reviewer free text
- local absolute path
- body content hash
- terminal output
- traceback
```

---

## 9. body-free rating / blocker / execution blocker / disposal handling

### 9.1 P5 rating axes

R49では、R46/R48で固定されたP5 axesを維持します。

```text
history_connection_naturalness: target 0.90
creepy_absence: target 0.95
overclaim_absence: target 0.95
self_blame_non_amplification: target 0.95
wants_more_input_or_accumulation: target 0.85
non_shallow_repeat: target 0.90
```

R48のreview questionsとして追加的に扱われている次も、R49でreviewer form上は維持します。

```text
current_input_not_overridden_by_history
boundary_history_line_leak_check
```

ただし、target averageの判定は既存P5 targetとの整合を壊さないように、実装段階でR48 helperの現在仕様に従います。

### 9.2 case-level verdict

```text
PASS
YELLOW
REPAIR_REQUIRED
RED
```

読み:

| verdict | 意味 | P5 confirmed candidateへの影響 |
|---|---|---|
| PASS | 商品候補として読める | blockerなしなら候補継続 |
| YELLOW | 弱さはあるが即blockerではない | 集計で要注意。P5 confirmedはaxis target次第 |
| REPAIR_REQUIRED | 修正が必要 | P5 confirmed不可 |
| RED | 商品表示不可級 | P5 confirmed不可 |

### 9.3 readfeel blocker row

R49では、R48のreadfeel blocker idを維持します。

```text
- p5_history_connection_too_generic
- p5_history_scope_overclaim
- p5_history_creepy_or_surveillance_feeling
- p5_history_line_self_blame_amplification
- p5_history_line_shallow_repeat
- p5_history_line_wants_more_input_low
- p5_free_tier_history_boundary_violation
- p5_low_information_history_overread
- p5_current_input_overridden_by_history
- p5_boundary_history_line_leak_suspected
- p5_review_not_enough_context
```

R49で追加候補にするreadfeel blocker id:

```text
- p5_question_need_misclassified_as_readfeel_pass
- p5_question_need_used_to_hide_p5_surface_weakness
```

この追加は、実装段階でR48との整合を見て採否判断します。

### 9.4 execution blocker row

R49で扱うexecution blockerは、P5読感の赤ではなく、review実行不能の赤です。

候補:

```text
- r49_review_session_blocked_missing_r48_handoff
- r49_review_session_blocked_case_matrix_missing
- r49_review_session_blocked_case_matrix_count_mismatch
- r49_review_session_blocked_missing_local_root
- r49_review_session_blocked_invalid_local_root
- r49_review_session_blocked_missing_explicit_allow
- r49_review_session_blocked_body_full_packet_export_violation
- r49_rating_rows_missing
- r49_question_need_observation_rows_missing
- r49_disposal_receipt_missing
- r49_disposal_failed
- r49_body_free_leak_detected
```

### 9.5 disposal receipt

R49 disposal receiptに残してよいもの:

```text
- schema_version
- review_session_id
- packet_kind
- case_count
- deleted_file_count
- purge_started_at
- purge_completed_at
- disposal_status
- body_removed
- reviewer_notes_removed
- local_packet_exported=false
- content_hash_of_body_stored=false
- p7_material_body_free=true
- body_free=true
- release_allowed=false
- p7_complete=false
- p8_start_allowed=false
- hold004_close_allowed=false
```

残してはいけないもの:

```text
- raw input
- raw answer
- comment_text body
- returned_emlis_surface
- bounded_owned_history_review_surface
- reviewer free text
- local packet path
- local absolute path
- packet content hash
- body content hash
- deleted body preview
- terminal output
- traceback
```

---

## 10. P7/P8 Bridge question need observation memo handling

### 10.1 目的

question need observation memoの目的は、P8観測補助問いを勘で設計しないことです。  
ただし、R49で問いを設計・実装するわけではありません。

R49で残すべきもの:

```text
- 問いなしで十分観測できたか。
- 問いがあれば補完リスクを下げられたか。
- 問いを出すと入力直後の観測体験を重くしないか。
- 1問で足りる曖昧さか。
- 問いではなく、Emlis本体の観測力で返すべきか。
- Plus向け1問候補か、Premium深掘り候補か。
```

R49で残してはいけないもの:

```text
- question text
- draft question text
- raw input
- raw answer
- comment_text body
- returned_emlis_surface
- bounded_owned_history_review_surface
- reviewer free text
- local packet path
- body hash
- 問い発生ロジック
- API / DB / RN / response key仕様
```

### 10.2 primary class

question need observation rowのprimary class案です。

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

分類の意味:

| primary class | 意味 | P5 confirmedへの扱い | P8材料への扱い |
|---|---|---|---|
| no_question_needed_emlis_can_observe | 問いなしで観測できるcase | blockしない | 問い不要根拠 |
| question_may_reduce_overread_risk | 1問で補完リスクを下げられそう | 単独ではblockしない | P8候補材料 |
| question_would_make_immediate_observation_heavy | 問うと初回体験が重くなる | blockしない | 問い抑制材料 |
| not_question_emlis_readfeel_repair_required | 問いではなくEmlis本文が弱い | block候補 | 修正対象材料 |
| not_question_p5_surface_repair_required | 問いではなく履歴線surfaceが弱い | block候補 | P5修正材料 |
| not_question_gate_boundary_required | 問いではなくGate境界が弱い | block候補 | Gate修正材料 |
| plus_single_question_candidate_later | Plus向け1問候補 | 単独ではblockしない | P8候補材料 |
| premium_deep_dive_candidate_later | Premium深掘り候補 | 単独ではblockしない | P8/Premium材料 |
| insufficient_material_execution_blocker | 材料不足で観察不能 | execution blocker | P8材料にしない |

注意:

```text
- plus_single_question_candidate_later / premium_deep_dive_candidate_later は、primary classにするより、overlay flagにする方が安全な可能性が高い。
- 実装段階では primary_class + plan_candidate_flags の分離を優先候補にする。
```

### 10.3 ambiguity kind refs

body-freeな曖昧さ分類候補です。

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

これらは本文を持たない分類です。  
`missing_relation_context` などの分類名は、質問本文ではなく、P8で検討する曖昧さの種類です。

### 10.4 one question fit refs

```text
not_needed
fits_one_question
needs_more_than_one_question_not_p7
would_delay_immediate_observation
unsafe_or_boundary_not_question
repair_required_not_question
insufficient_material
```

R49での扱い:

```text
- fits_one_question はP8候補材料。
- needs_more_than_one_question_not_p7 はPremium深掘り候補になり得るが、R49では実装しない。
- would_delay_immediate_observation は問い抑制材料。
- repair_required_not_question はP5/P7修正材料。
```

### 10.5 ratingとquestion observationの分離

次のように扱います。

```text
case A:
  P5 rating PASS
  question_need_class = no_question_needed_emlis_can_observe
  => P5候補継続。P8では問い不要根拠。

case B:
  P5 rating PASS / YELLOW
  question_need_class = question_may_reduce_overread_risk
  => 単独ではP5 blockerではない。P8候補材料。

case C:
  P5 rating REPAIR_REQUIRED
  question_need_class = not_question_p5_surface_repair_required
  => P5 blocker。問いで補わない。

case D:
  P5 rating RED
  question_need_class = not_question_gate_boundary_required
  => Gate / boundary blocker。P8へ渡さない。

case E:
  P5 rating YELLOW
  question_need_class = question_would_make_immediate_observation_heavy
  => 問い抑制材料。P5はrating集計次第。
```

### 10.6 reviewer prompt上の質問文方針

reviewerへの設問は、次のように構成します。

```text
Q1. このcaseは、問いなしでEmlis本体が十分に観測できるcaseでしたか。
Q2. 1問だけ補助問いがあれば、補完・深読みリスクを下げられたcaseでしたか。
Q3. その問いを出すことで、入力直後の観測体験が重くなりそうでしたか。
Q4. これは問いの問題ではなく、Emlis本文 / P5 surface / Gate境界の修正対象でしたか。
Q5. Plus向けの軽い1問候補か、Premium向け深掘り候補か、どちらにも渡さないか。
```

ただし、reviewerは質問本文を書きません。  
R49では、質問本文ではなく分類を残します。

---

## 11. P5 confirmed candidate gate

### 11.1 R49でのP5 confirmed candidate条件

P5 confirmed candidateは、次をすべて満たす場合だけtrue候補にできます。

```text
- review_session_status == SUMMARY_FINALIZED
- required_total_cases >= 24
- reviewed_case_count == required_total_cases
- rating_row_count == required_total_cases
- question_need_observation_row_count == required_total_cases
- family_coverage_satisfied == true
- axis_targets_satisfied == true
- red_case_count == 0
- repair_required_case_count == 0
- open_blocker_ids == []
- open_execution_blocker_ids == []
- boundary_violation_blocker_ids == []
- question_observation_repair_required_count == 0
- question_observation_execution_blocker_count == 0
- disposal_status in [DISPOSAL_VERIFIED, EXPIRED_PURGED]
- body_removed == true
- reviewer_notes_removed == true
- local_packet_exported == false
- content_hash_of_body_stored == false
- body_free == true
```

### 11.2 confirmedにしてはいけない条件

```text
- review session未実施。
- rating rows未記入。
- question need observation rows未記入。
- disposal未確認。
- RED / REPAIR_REQUIRED / open blockerあり。
- question observationで `not_question_*_repair_required` がopenのまま。
- `question_may_reduce_overread_risk` をP5修正不要の免罪符として扱っている。
- body-full packetが成果物・P7 material・前提資料へ混入している。
- reviewer free textがbody-free materialへ混入している。
- local path / content hashがbody-free materialへ混入している。
```

### 11.3 R49でtrueにしてはいけないflag

R49のreview結果が良くても、次はR49単独ではtrueにしません。

```text
p5_human_blind_qa_confirmed
p6_limited_human_readfeel_start_allowed
p6_limited_human_readfeel_confirmed
real_device_modal_review_start_allowed
real_device_modal_review_confirmed
p7_complete
p8_start_allowed
release_allowed
hold004_close_allowed
full_backend_suite_green_confirmed
release_readiness_claim_allowed
p7_completion_claim_allowed
p8_start_claim_allowed
```

R49で出してよいのは、あくまでcandidateです。

```text
p5_human_blind_qa_confirmed_candidate
p6_limited_human_readfeel_start_allowed_candidate
p8_question_design_material_candidate
```

---

## 12. P6 limited human readfeel start candidate handoff

P6 limited human readfeel start candidateは、R49のP5 actual review結果を見て候補化します。

### 12.1 candidate true条件

```text
- p5_human_blind_qa_confirmed_candidate == true
- disposal_verified_for_candidate == true
- body_removed == true
- reviewer_notes_removed == true
- local_packet_exported == false
- open_blocker_ids == []
- open_execution_blocker_ids == []
- question_observation_repair_required_count == 0
- P6 handoffを開いてもP5の未修正を覆い隠さない
```

### 12.2 candidate false条件

```text
- P5 review sessionが未完了。
- P5 ratingがtarget未達。
- P5 RED / REPAIR_REQUIRED / blockerが残る。
- question observationでEmlis本文 / P5 surface / Gate境界の修正対象が残る。
- disposal未確認。
- full backend suite green未確認をP6開始許可に読み替えている。
```

### 12.3 handoffに含めてよいもの

```text
- review_session_id
- case_count
- rating summary counts
- blocker summary counts
- question observation summary counts
- candidate boolean
- missing_requirement_refs
- body_free=true
```

### 12.4 handoffに含めてはいけないもの

```text
- raw input
- raw answer
- comment_text body
- returned_emlis_surface
- history review surface
- reviewer free text
- question text
- local packet path
- content hash
```

---

## 13. P8 observation question design material candidate

R49では、P8開始時に参照できるbody-free summary候補を作ります。  
ただし、P8 start allowedをtrueにはしません。

### 13.1 P8材料候補に含めてよいもの

```text
- total_case_count
- question_observation_row_count
- no_question_needed_count
- question_may_reduce_overread_risk_count
- question_would_make_immediate_observation_heavy_count
- not_question_repair_required_count
- emlis_readfeel_repair_required_count
- p5_surface_repair_required_count
- gate_boundary_repair_required_count
- plus_single_question_candidate_later_count
- premium_deep_dive_candidate_later_count
- ambiguity_kind_counts
- one_question_fit_counts
- p8_question_design_material_candidate
- body_free=true
```

### 13.2 P8材料候補に含めてはいけないもの

```text
- raw input
- raw answer
- comment_text body
- returned_emlis_surface
- bounded_owned_history_review_surface
- reviewer free text
- question text
- draft question text
- local packet path
- packet content hash
- body-full packet existence detail beyond boolean counts
```

### 13.3 P8詳細設計へ渡す時の読み

```text
- no_question_needed_countが多い場合:
  Emlis本体が問いなしで観測できる領域を広げられている。問い機能を過剰実装しない根拠になる。

- question_may_reduce_overread_risk_countが一定ある場合:
  P8で短い1問補助の詳細設計材料になる。

- question_would_make_immediate_observation_heavy_countが多い場合:
  観測補助問いを頻出させるとCocolonの初回体験を重くする危険がある。

- not_question_repair_required_countが多い場合:
  P8へ進む前にEmlis本体 / P5 surface / Gateを直す必要がある。
```

---

## 14. no-touch boundary: API / DB / RN / public response key

R49では、次を変更しません。

```text
- API route
- request key
- public response top-level key
- DB schema
- DB write path
- DB physical table / column name
- RN production files
- RN表示条件
- RN modal title `Emlisの観測`
- Emlis reply runtime
- User Label Connection runtime gate
- Public Feedback meta builder
- public source lineage
- Gate threshold
- fixed commentText / case専用surface / case専用mode
- release material
```

明示no-touch file候補:

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
DB migration files
```

R49で触る候補は、新規R49 helperとR49 testに限定します。

---

## 15. JSON / schema案

この章のschemaは、実装段階で採用判断する候補です。  
本設計書では、json / schemaファイルを作りません。

### 15.1 `p7_r49_review_session_envelope.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r49.review_session_envelope.bodyfree.schema.json",
  "title": "Cocolon EmlisAI P7-R49 P5 Human Blind QA Actual Review Session Envelope - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "phase",
    "step",
    "scope",
    "review_session_id",
    "review_kind",
    "packet_kind",
    "r48_handoff_required",
    "r48_case_matrix_required",
    "required_total_cases",
    "review_session_status",
    "body_full_packet_materialized_here",
    "actual_human_review_run_here",
    "question_need_observation_required",
    "question_need_observation_rows_required",
    "public_contract",
    "body_free",
    "release_allowed",
    "p7_complete",
    "p8_start_allowed"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r49.review_session_envelope.bodyfree.v1"
    },
    "phase": { "const": "P7" },
    "step": { "const": "R49_P5HumanBlindQAActualReviewExecution_QuestionNeedObservation_20260619" },
    "scope": { "const": "p5_human_blind_qa_actual_review_execution_question_need_observation_capture" },
    "review_session_id": { "type": "string", "minLength": 1 },
    "review_kind": { "const": "p5_history_line_readfeel" },
    "packet_kind": { "const": "p5_human_blind_qa_local_review_packet" },
    "r48_handoff_required": { "const": true },
    "r48_case_matrix_required": { "const": true },
    "required_total_cases": { "const": 24 },
    "review_session_status": {
      "enum": [
        "NOT_STARTED",
        "PRECHECK_BLOCKED",
        "LOCAL_PACKETS_READY",
        "REVIEW_IN_PROGRESS",
        "RATINGS_CAPTURED_BODYFREE",
        "QUESTION_OBSERVATIONS_CAPTURED_BODYFREE",
        "DISPOSAL_PENDING",
        "DISPOSAL_VERIFIED",
        "SUMMARY_FINALIZED",
        "BLOCKED"
      ]
    },
    "body_full_packet_materialized_here": { "type": "boolean" },
    "actual_human_review_run_here": { "type": "boolean" },
    "question_need_observation_required": { "const": true },
    "question_need_observation_rows_required": { "const": true },
    "public_contract": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "api_route_changed",
        "request_key_changed",
        "public_response_top_level_key_added",
        "db_schema_changed",
        "rn_visible_contract_changed"
      ],
      "properties": {
        "api_route_changed": { "const": false },
        "request_key_changed": { "const": false },
        "public_response_top_level_key_added": { "const": false },
        "db_schema_changed": { "const": false },
        "rn_visible_contract_changed": { "const": false }
      }
    },
    "body_free": { "const": true },
    "release_allowed": { "const": false },
    "p7_complete": { "const": false },
    "p8_start_allowed": { "const": false }
  }
}
```

### 15.2 `p7_r49_question_need_observation_row.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r49.question_need_observation_row.bodyfree.schema.json",
  "title": "Cocolon EmlisAI P7-R49 Question Need Observation Row - Body-free",
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
    "schema_version": {
      "const": "cocolon.emlis.p7_r49.question_need_observation_row.bodyfree.v1"
    },
    "review_session_id": { "type": "string", "minLength": 1 },
    "packet_ref_id": { "type": "string", "minLength": 1 },
    "blind_case_id": { "type": "string", "minLength": 1 },
    "case_ref_id": { "type": "string", "minLength": 1 },
    "family": { "type": "string", "minLength": 1 },
    "case_role": {
      "enum": [
        "positive_history_line",
        "positive_owned_history",
        "boundary_no_history_line"
      ]
    },
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
      "type": "object",
      "additionalProperties": false,
      "required": [
        "plus_single_question_candidate_later",
        "premium_deep_dive_candidate_later",
        "p8_design_material_candidate",
        "p8_implementation_spec_finalized_here"
      ],
      "properties": {
        "plus_single_question_candidate_later": { "type": "boolean" },
        "premium_deep_dive_candidate_later": { "type": "boolean" },
        "p8_design_material_candidate": { "type": "boolean" },
        "p8_implementation_spec_finalized_here": { "const": false }
      }
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
      "items": { "type": "string", "minLength": 1 },
      "uniqueItems": true
    },
    "question_text_included": { "const": false },
    "draft_question_text_included": { "const": false },
    "reviewer_free_text_included": { "const": false },
    "body_removed": { "const": true },
    "body_free": { "const": true }
  },
  "not": {
    "anyOf": [
      { "required": ["raw_input"] },
      { "required": ["raw_answer"] },
      { "required": ["comment_text"] },
      { "required": ["comment_text_body"] },
      { "required": ["returned_emlis_surface"] },
      { "required": ["bounded_owned_history_review_surface"] },
      { "required": ["reviewer_free_text"] },
      { "required": ["question_text"] },
      { "required": ["draft_question_text"] },
      { "required": ["local_absolute_path"] },
      { "required": ["body_content_hash"] }
    ]
  }
}
```

### 15.3 `p7_r49_question_need_observation_summary.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r49.question_need_observation_summary.bodyfree.schema.json",
  "title": "Cocolon EmlisAI P7-R49 Question Need Observation Summary - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "total_case_count",
    "question_observation_row_count",
    "question_observation_rows_complete",
    "primary_class_counts",
    "ambiguity_kind_counts",
    "one_question_fit_counts",
    "repair_required_counts",
    "p8_question_design_material_candidate",
    "p8_start_allowed",
    "p8_implementation_spec_finalized_here",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r49.question_need_observation_summary.bodyfree.v1"
    },
    "review_session_id": { "type": "string", "minLength": 1 },
    "total_case_count": { "type": "integer", "minimum": 0 },
    "question_observation_row_count": { "type": "integer", "minimum": 0 },
    "question_observation_rows_complete": { "type": "boolean" },
    "primary_class_counts": { "type": "object", "additionalProperties": { "type": "integer", "minimum": 0 } },
    "ambiguity_kind_counts": { "type": "object", "additionalProperties": { "type": "integer", "minimum": 0 } },
    "one_question_fit_counts": { "type": "object", "additionalProperties": { "type": "integer", "minimum": 0 } },
    "repair_required_counts": { "type": "object", "additionalProperties": { "type": "integer", "minimum": 0 } },
    "p8_question_design_material_candidate": { "type": "boolean" },
    "p8_start_allowed": { "const": false },
    "p8_implementation_spec_finalized_here": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 15.4 `p7_r49_review_handoff_summary.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r49.review_handoff_summary.bodyfree.schema.json",
  "title": "Cocolon EmlisAI P7-R49 Review Handoff Summary - Body-free",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "review_session_status",
    "review_kind",
    "packet_kind",
    "case_count",
    "reviewed_case_count",
    "rating_row_count",
    "blocker_row_count",
    "execution_blocker_row_count",
    "question_observation_row_count",
    "question_observation_rows_complete",
    "family_coverage_satisfied",
    "axis_targets_satisfied",
    "red_case_count",
    "repair_required_case_count",
    "open_blocker_ids",
    "open_execution_blocker_ids",
    "question_observation_repair_required_count",
    "disposal_status",
    "body_removed",
    "reviewer_notes_removed",
    "local_packet_exported",
    "content_hash_of_body_stored",
    "p5_human_blind_qa_confirmed_candidate",
    "p6_limited_human_readfeel_start_allowed_candidate",
    "p8_question_design_material_candidate",
    "release_allowed",
    "p7_complete",
    "p8_start_allowed",
    "hold004_close_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7_r49.review_handoff_summary.bodyfree.v1"
    },
    "review_session_id": { "type": "string", "minLength": 1 },
    "review_session_status": {
      "enum": ["NOT_STARTED", "PRECHECK_BLOCKED", "LOCAL_PACKETS_READY", "REVIEW_IN_PROGRESS", "RATINGS_CAPTURED_BODYFREE", "QUESTION_OBSERVATIONS_CAPTURED_BODYFREE", "DISPOSAL_PENDING", "DISPOSAL_VERIFIED", "SUMMARY_FINALIZED", "BLOCKED"]
    },
    "review_kind": { "const": "p5_history_line_readfeel" },
    "packet_kind": { "const": "p5_human_blind_qa_local_review_packet" },
    "case_count": { "type": "integer", "minimum": 0 },
    "reviewed_case_count": { "type": "integer", "minimum": 0 },
    "rating_row_count": { "type": "integer", "minimum": 0 },
    "blocker_row_count": { "type": "integer", "minimum": 0 },
    "execution_blocker_row_count": { "type": "integer", "minimum": 0 },
    "question_observation_row_count": { "type": "integer", "minimum": 0 },
    "question_observation_rows_complete": { "type": "boolean" },
    "family_coverage_satisfied": { "type": "boolean" },
    "axis_targets_satisfied": { "type": "boolean" },
    "red_case_count": { "type": "integer", "minimum": 0 },
    "repair_required_case_count": { "type": "integer", "minimum": 0 },
    "open_blocker_ids": { "type": "array", "items": { "type": "string" }, "uniqueItems": true },
    "open_execution_blocker_ids": { "type": "array", "items": { "type": "string" }, "uniqueItems": true },
    "question_observation_repair_required_count": { "type": "integer", "minimum": 0 },
    "disposal_status": { "enum": ["NOT_GENERATED", "GENERATION_BLOCKED", "GENERATED_LOCAL_ONLY", "REVIEW_IN_PROGRESS", "RATINGS_EXTRACTED", "PURGE_REQUIRED", "BODY_PURGED", "DISPOSAL_VERIFIED", "DISPOSAL_FAILED", "EXPIRED_PURGED"] },
    "body_removed": { "type": "boolean" },
    "reviewer_notes_removed": { "type": "boolean" },
    "local_packet_exported": { "const": false },
    "content_hash_of_body_stored": { "const": false },
    "p5_human_blind_qa_confirmed_candidate": { "type": "boolean" },
    "p6_limited_human_readfeel_start_allowed_candidate": { "type": "boolean" },
    "p8_question_design_material_candidate": { "type": "boolean" },
    "release_allowed": { "const": false },
    "p7_complete": { "const": false },
    "p8_start_allowed": { "const": false },
    "hold004_close_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

---

## 16. Python module設計案

### 16.1 新規production候補

```text
services/ai_inference/emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution.py
```

このmoduleで持つ候補:

```text
P7_R49_REVIEW_SESSION_ENVELOPE_SCHEMA_VERSION
P7_R49_QUESTION_NEED_OBSERVATION_ROW_BODYFREE_SCHEMA_VERSION
P7_R49_QUESTION_NEED_OBSERVATION_SUMMARY_BODYFREE_SCHEMA_VERSION
P7_R49_REVIEW_HANDOFF_SUMMARY_BODYFREE_SCHEMA_VERSION
P7_R49_STEP
P7_R49_SCOPE
P7_R49_REVIEW_SESSION_STATUS_REFS
P7_R49_QUESTION_NEED_PRIMARY_CLASS_REFS
P7_R49_AMBIGUITY_KIND_REFS
P7_R49_ONE_QUESTION_FIT_REFS
P7_R49_REPAIR_REQUIRED_REF_REFS
P7_R49_REQUIRED_UNRESOLVED_HOLD_REFS

build_p7_r49_review_session_envelope()
build_p7_r49_actual_review_preflight()
normalize_p7_r49_question_need_observation_row_bodyfree()
build_p7_r49_question_need_observation_summary_bodyfree()
build_p7_r49_review_handoff_summary_bodyfree()
build_p7_r49_p5_confirmed_candidate_gate()
build_p7_r49_p6_limited_human_readfeel_start_candidate_handoff()
build_p7_r49_p8_question_design_material_candidate_summary()
build_p7_r49_validation_command_matrix()
build_p7_r49_touch_candidate_no_touch_boundary_freeze()

assert_p7_r49_review_session_envelope_contract()
assert_p7_r49_question_need_observation_row_bodyfree_contract()
assert_p7_r49_question_need_observation_summary_bodyfree_contract()
assert_p7_r49_review_handoff_summary_bodyfree_contract()
assert_p7_r49_no_body_payload_or_question_text_contract()
```

### 16.2 optional helper候補

```text
services/ai_inference/emlis_ai_p7_r49_local_review_session_file_ops.py
```

このhelperは、実装段階で必要と判断した場合だけ作ります。  
作る場合も、local-only packet materialization / purge / receipt補助に限定します。

禁止:

```text
- runtime response生成へ接続しない。
- API routeから呼ばない。
- DBへ書かない。
- RNへ渡さない。
- 成果物zipへbody-fullを含めない。
```

### 16.3 触らないproduction file

R49で触らない候補:

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
services/ai_inference/emlis_ai_user_label_connection_product_quality_qa.py
services/ai_inference/emlis_ai_product_readfeel_long_run_product_gate.py
services/ai_inference/emlis_ai_product_readfeel_rubric.py
Cocolon/screens/InputScreen.js
Cocolon/screens/input/useInputFeedbackModal.js
Cocolon/screens/input/inputFeedbackModel.js
Cocolon/screens/input/InputFeedbackReplyModal.js
DB migration files
```

### 16.4 import方針

R49 moduleは、R48/R47/R46の既存定義を参照して境界を一致させます。

```text
from emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet import (
  P7_R48_P5_CASE_MATRIX_SCHEMA_VERSION,
  P7_R48_P5_RATING_ROW_BODYFREE_SCHEMA_VERSION,
  P7_R48_P5_BLOCKER_ROW_BODYFREE_SCHEMA_VERSION,
  P7_R48_P5_EXECUTION_BLOCKER_ROW_BODYFREE_SCHEMA_VERSION,
  P7_R48_P5_DISPOSAL_RECEIPT_BODYFREE_SCHEMA_VERSION,
  P7_R48_P5_REVIEW_HANDOFF_SUMMARY_BODYFREE_SCHEMA_VERSION,
  P7_R48_P5_CONFIRMED_CANDIDATE_REQUIRED_CONDITION_REFS,
  P7_R48_P5_FIRST_FORMAL_CASE_DISTRIBUTION,
  P7_R48_READFEEL_BLOCKER_ID_REFS,
  P7_R48_REQUIRED_UNRESOLVED_HOLD_REFS,
)

from emlis_ai_p7_r47_local_review_packet_policy import (
  P7_R47_LOCAL_REVIEW_ROOT_ENV_VAR,
  P7_R47_DISPOSAL_STATUSES,
  P7_R47_BODY_FULL_PACKET_RETENTION_HOURS,
  P7_R47_REVIEWER_NOTES_RETENTION_AFTER_RATING_HOURS,
)

from emlis_ai_p7_r46_p5_p6_human_readfeel_handoff_material import (
  P5_HUMAN_BLIND_QA_FAMILIES,
  P5_HUMAN_BLIND_QA_RATING_AXES,
  P5_HUMAN_BLIND_QA_TARGETS,
  P6_LIMITED_HUMAN_READFEEL_HOLD_REF,
)
```

R48/R47/R46側の既存値をコピーして独自にずらさないことをtestで固定します。

---

## 17. 実装順詳細

### R49-0: current source / R48 handoff / P7-P8 Bridge rule refreeze

目的:

```text
R49開始時点で、R48は足場でありactual review未実施であること、
P7/P8 Bridgeは観察メモだけであり問い実装ではないことを再固定する。
```

実装候補:

```text
build_p7_r49_current_source_r48_handoff_bridge_refreeze()
assert_p7_r49_current_source_r48_handoff_bridge_refreeze_contract()
```

固定するfalse:

```text
p5_human_blind_qa_confirmed=false
p6_limited_human_readfeel_start_allowed=false
real_device_modal_review_confirmed=false
p7_complete=false
p8_start_allowed=false
release_allowed=false
question_api_implemented=false
question_db_schema_implemented=false
question_rn_ui_implemented=false
question_response_key_implemented=false
question_trigger_logic_implemented=false
```

### R49-1: scope / schema version / status enum固定

目的:

```text
R49が扱うのはP5 actual review executionとquestion need observation captureであり、
P8詳細設計ではないことをschemaとstatus enumで固定する。
```

実装候補:

```text
P7_R49_REVIEW_SESSION_STATUS_REFS
P7_R49_QUESTION_NEED_PRIMARY_CLASS_REFS
P7_R49_AMBIGUITY_KIND_REFS
P7_R49_ONE_QUESTION_FIT_REFS
build_p7_r49_review_session_envelope()
```

### R49-2: R48 case matrix handoff validation

目的:

```text
R48の24-case first formal review matrixを利用し、case_count / family coverage / blind_case_id / packet_ref_idが揃うことを確認する。
```

実装候補:

```text
build_p7_r49_r48_case_matrix_handoff_validation()
```

acceptance:

```text
- required_total_cases == 24
- blind_case_idとcase_ref_idが分離されている
- controller-only refsをreviewer-facing packetへ出さない
- body_full_packet_materialized_here=falseが初期値
```

### R49-3: local-only actual packet generation preflight

目的:

```text
body-full reviewer packet生成前に、local root / explicit allow / export denylist / no repo rootをpreflightする。
```

実装候補:

```text
build_p7_r49_local_only_actual_packet_generation_preflight()
```

blocked時:

```text
execution_blocker_id=r49_review_session_blocked_missing_local_root
execution_blocker_id=r49_review_session_blocked_invalid_local_root
execution_blocker_id=r49_review_session_blocked_missing_explicit_allow
execution_blocker_id=r49_review_session_blocked_body_full_packet_export_violation
```

### R49-4: actual review session protocol builder

目的:

```text
reviewerがblind_case_id単位で読むprotocolを固定する。
```

含めるもの:

```text
- review_session_id
- review_prompt_version
- required_case_count
- reviewer_visible_fields
- reviewer_hidden_fields
- rating_axes
- question_need_observation_required=true
- question_text_required=false
- reviewer_free_text_bodyfree_export_allowed=false
```

### R49-5: rating row ingestion / R48 normalizer接続

目的:

```text
reviewer ratingをR48 body-free rating rowへ正規化する。
```

方針:

```text
- R48 rating axes / targetsを維持する。
- machine metricでreadfeelを自動採点しない。
- reviewer free textはbody-freeへ入れない。
- verdictとscore/blockerの整合をcontractで見る。
```

### R49-6: blocker / execution blocker ingestion

目的:

```text
読感blockerと実行blockerを混ぜない。
```

方針:

```text
readfeel blocker:
  P5履歴線の商品読感の問題。

execution blocker:
  local root missing / packet generation failed / rating missing / disposal failedなど、review実行不能の問題。
```

### R49-7: question need observation row schema / enum固定

目的:

```text
P7/P8 Bridge用のbody-free分類を固定する。
```

実装候補:

```text
P7_R49_QUESTION_NEED_PRIMARY_CLASS_REFS
P7_R49_AMBIGUITY_KIND_REFS
P7_R49_ONE_QUESTION_FIT_REFS
P7_R49_REPAIR_REQUIRED_REF_REFS
```

must not:

```text
question_text
raw_input
returned_emlis_surface
reviewer_free_text
local_path
body_hash
```

### R49-8: question need observation row normalizer

目的:

```text
reviewerが選んだ問い必要性分類をbody-free rowに正規化する。
```

実装候補:

```text
normalize_p7_r49_question_need_observation_row_bodyfree()
assert_p7_r49_question_need_observation_row_bodyfree_contract()
```

validation:

```text
- question_text_included=false
- draft_question_text_included=false
- reviewer_free_text_included=false
- body_removed=true
- body_free=true
- primary class / one_question_fit / repair_required_refsの整合が取れている
```

### R49-9: rating vs question observation consistency guard

目的:

```text
P5の弱さを問いで隠していないかを確認する。
```

guard例:

```text
- verdict=PASS かつ question_need_primary_class=not_question_*_repair_required は不整合。
- verdict=RED/REPAIR_REQUIRED かつ question_need_primary_class=question_may_reduce_overread_risk だけでblockerなしは不整合。
- one_question_fit_ref=repair_required_not_question なら repair_required_refs に no_repair_required 以外が必要。
- question_need_primary_class=insufficient_material_execution_blocker なら execution blocker rowが必要。
```

### R49-10: question need observation summary builder

目的:

```text
P8詳細設計で参照できるbody-free集計を作る。
```

実装候補:

```text
build_p7_r49_question_need_observation_summary_bodyfree()
```

集計:

```text
- primary_class_counts
- ambiguity_kind_counts
- one_question_fit_counts
- repair_required_counts
- p8_question_design_material_candidate
- p8_start_allowed=false
```

### R49-11: disposal receipt connection

目的:

```text
reviewer packet / notesの廃棄確認をbody-freeで残す。
```

方針:

```text
- R48 disposal receipt schemaを引き継ぐ。
- R49 question observation rowsが揃ってからdisposal pendingへ進む。
- disposal receiptにbody / path / hashを残さない。
```

### R49-12: review handoff summary builder

目的:

```text
P5 actual review結果、question observation結果、disposal状態をbody-free summaryへまとめる。
```

実装候補:

```text
build_p7_r49_review_handoff_summary_bodyfree()
assert_p7_r49_review_handoff_summary_bodyfree_contract()
```

### R49-13: P5 confirmed candidate gate接続

目的:

```text
R48のP5 confirmed candidate gateに、R49のactual review completionとquestion observation completenessを接続する。
```

必須:

```text
- rating rows complete
- question observation rows complete
- disposal verified
- no open blockers
- no question observation repair-required blockers
```

### R49-14: P6 limited human readfeel start candidate handoff

目的:

```text
P5 review結果からP6 limited human readfeelへ進める候補だけをbody-freeで出す。
```

禁止:

```text
- p6_limited_human_readfeel_start_allowed=true にしない。
- P5弱さを残したままP6へ進めない。
```

### R49-15: P8 question design material candidate handoff

目的:

```text
P8詳細設計で使える材料があるかをbody-freeに示す。
```

出してよいもの:

```text
p8_question_design_material_candidate=true/false
question observation summary counts
missing_requirement_refs
```

出してはいけないもの:

```text
p8_start_allowed=true
question trigger logic
question text
API / DB / RN / response key仕様
```

### R49-16: no body leak / no question text guard

目的:

```text
R49のbody-free materialへ本文・質問本文・reviewer free textが混ざらないことを固定する。
```

forbidden key refs:

```text
raw_input
raw_answer
comment_text
comment_text_body
returned_emlis_surface
bounded_owned_history_review_surface
reviewer_free_text
reviewer_note
question_text
draft_question_text
question_body
local_absolute_path
body_content_hash
packet_content_hash
terminal_output
traceback
```

### R49-17: validation command matrix

目的:

```text
R49 target / R48 regression / R47 regression / R46 handoff / display / P5 core / collect-only / RN optionalを分ける。
```

詳細は「18. validation command matrix案」に記載します。

### R49-18: touch candidate / no-touch boundary freeze

目的:

```text
R49実装範囲がruntime / RN / API / DB / releaseへ拡散しないように固定する。
```

acceptance:

```text
- production touch candidateはR49 helperだけ。
- optional helperを作る場合もlocal-only file opsだけ。
- testsはR49 target testsだけ。
- RN / API / DB / public meta / runtime composerはno-touch。
```

---

## 18. validation command matrix案

実装段階でのvalidation候補です。  
本設計書作成時点では実行していません。

### 18.1 syntax / import

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference python -m py_compile \
  services/ai_inference/emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution.py
```

### 18.2 R49 target tests

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
  tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r16_r18_20260619.py
```

### 18.3 R48 target regression

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r0_r1_20260618.py \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r2_r3_20260618.py \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r4_r5_20260618.py \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r6_r7_20260618.py \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r8_r9_20260618.py \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r10_r11_20260619.py \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r12_r13_20260619.py \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r14_r15_20260619.py \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r16_r17_20260619.py \
  tests/test_emlis_ai_p7_r48_p5_human_blind_qa_actual_review_packet_r18_20260619.py
```

### 18.4 R47 regression

```bash
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

### 18.5 R46 handoff regression

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_r46_p5_p6_human_readfeel_handoff_material_r10_r11_20260617.py \
  tests/test_emlis_ai_p7_r46_real_device_modal_review_closed_validation_r12_r13_20260617.py \
  tests/test_emlis_ai_p7_r46_next_decision_handoff_ledger_r14_20260617.py
```

### 18.6 display contract / API contract

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/contract/test_emlis_ai_contracts.py \
  tests/test_emlis_ai_display_contract.py \
  tests/test_emotion_submit_two_stage_reception_e2e.py
```

### 18.7 P5 core subset

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_user_label_connection_material.py \
  tests/test_emlis_ai_user_label_connection_candidate.py \
  tests/test_emlis_ai_user_label_connection_gate.py \
  tests/test_emlis_ai_user_label_connection_surface.py \
  tests/test_emlis_ai_user_label_connection_public_boundary.py \
  tests/test_emlis_ai_user_label_connection_e2e_contract.py
```

### 18.8 P6 subset optional regression

```bash
PYTHONPATH=services/ai_inference pytest -q tests/test_emlis_ai_structure_insight*.py
```

### 18.9 backend collect-only

```bash
PYTHONPATH=services/ai_inference pytest --collect-only -q
```

### 18.10 RN no-touch optional confirmation

```bash
cd Cocolon
npm run test:rn-screens --silent
```

R49でRNを触らない場合でも、成果物提出前の安心材料としてoptional実行候補に入れます。  
ただし、RN greenを実機modal読感確認へ変換しません。

---

## 19. 新規test設計案

### 19.1 test module候補

```text
tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r0_r1_20260619.py
tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r2_r3_20260619.py
tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r4_r5_20260619.py
tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r6_r7_20260619.py
tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r8_r9_20260619.py
tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r10_r11_20260619.py
tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r12_r13_20260619.py
tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r14_r15_20260619.py
tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_r16_r18_20260619.py
```

### 19.2 必須test観点

```text
- R49開始時点でP5/P6/実機/P7/P8/releaseがclosedのまま。
- R48 case matrix handoffが24件前提で読み取れる。
- review session envelopeはbody-free。
- local root missing時にbody-full生成せずexecution blockerへ行く。
- question need observation rowはquestion_textを持たない。
- question need observation rowはraw input / comment_text / returned surface / reviewer free textを持たない。
- rating rowとquestion observation rowを混同しない。
- not_question_*_repair_required classはP5 confirmed candidateをblockする。
- question_may_reduce_overread_risk単独ではP5 blockerにしない。
- summaryはp8_question_design_material_candidateを出せるがp8_start_allowedはfalse。
- disposal verifiedなしにP5 confirmed candidateをtrueにしない。
- R49追加でR48/R47/R46/display/P5 core contractを壊さない。
- RN/API/DB/public response key no-touchを固定する。
```

---

## 20. 実装段階で触る候補 / 触らない境界

### 20.1 production touch candidate

```text
services/ai_inference/emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution.py
```

### 20.2 optional touch candidate

```text
services/ai_inference/emlis_ai_p7_r49_local_review_session_file_ops.py
```

optional helperを作る場合も、body-full packetのlocal-only生成・purge・receipt補助に限定します。

### 20.3 test touch candidate

```text
tests/test_emlis_ai_p7_r49_p5_human_blind_qa_actual_review_execution_*.py
```

### 20.4 no-touch boundary

```text
- RN production files
- API route files
- DB schema / migration files
- Emlis reply runtime
- User Label Connection runtime files
- public feedback meta
- public source lineage
- runtime gate threshold files
- release material files
- P8 implementation files
```

---

## 21. acceptance criteria

### 21.1 設計書としての完了条件

```text
- R49の目的がP5 actual review execution + question need observation captureであることを固定した。
- R49がP8観測補助問い詳細設計ではないことを固定した。
- R49がAPI / DB / RN / response key / 発生ロジックを触らないことを固定した。
- R48 handoff / R47 local-only / R46 hold境界を引き継ぐことを固定した。
- question need observation rowのbody-free分類案を定義した。
- rating / blocker / question observationを混ぜない判定方針を定義した。
- P5 confirmed candidate gateにquestion observation completenessを接続した。
- P6 limited human readfeel start candidate handoffを候補としてだけ定義した。
- JSON / schema案を設計書内に含め、実ファイル化しないことを明記した。
- 実装順をR49-0〜R49-18で分けた。
- validation command matrix案を含めた。
```

### 21.2 実装後の完了条件候補

```text
- R49 target testsがgreen。
- R48 target regressionがgreen。
- R47 target regressionがgreen。
- R46 handoff regressionがgreen。
- display contract / API contractがgreen。
- P5 core subset regressionがgreen。
- backend collect-onlyが通る。
- optional RN contractがgreen。
- R49 body-free materialに本文・質問本文・reviewer free text・local path・body hashが混じらない。
- R49 summaryがp7_complete / p8_start_allowed / release_allowedをtrueにしない。
```

### 21.3 actual review後の完了条件候補

```text
- P5 24-case actual reviewが実施されている。
- 24件すべてにrating rowがある。
- 24件すべてにquestion need observation rowがある。
- RED / REPAIR_REQUIRED / open blockerが0、または未解決として明示されている。
- question observationのrepair_required classが0、またはP5/P7修正対象として明示されている。
- disposal receiptがあり、body_removed=true / reviewer_notes_removed=true / local_packet_exported=false。
- P5 confirmed candidate gateの結果がbody-freeで説明可能。
- P6 limited human readfeel start candidateが、P5結果に基づき別判断として説明可能。
- P8観測補助問い詳細設計へ渡すbody-free summaryが存在する。
- P8 start allowed / release allowedは別判断としてfalseのまま。
```

---

## 22. R49でしてはいけないこと

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
- R48 greenやR49 designをP5合格・P7完了・P8開始許可・release許可へ変換する。
- full backend collect-onlyをfull backend suite greenへ変換する。
- RN contract greenを実機modal読感確認へ変換する。
- Gateを緩める。
- fixed commentText / case専用surface / case専用modeを追加する。
```

---

## 23. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- 前提資料、作業姿勢ルール、思想資料、EmlisAI是正方針を確認した。
- 対象ロードマップのP7/P8 Bridgeを確認した。
- P7/P8 Bridgeでは、P7で観測補助問いを実装せず、body-freeな問い必要性観察メモだけを残す。
- 現行実ファイルにR48足場が存在することを確認した。
- R48 target 82 passed、RN contract 36 passed、display contract 5 passed、P5 core 63 passed、P6 subset 131 passed、backend collect-only 3291 collectedが検討メモ上で確認済み。
- P5 human Blind QA confirmed / P6 start / real device / P7 complete / P8 start / releaseはfalse扱いのまま。
```

### 未確認

```text
- P5 actual human Blind QA結果。
- body-full packet生成・rating記入・disposal実行。
- 問い必要性観察メモの実ケース結果。
- R49実装結果。
- R49 target tests結果。
- full backend suite execution green。
- 実機modal読感。
```

### 書かれていない

```text
- R48 greenをP5合格へ変換してよいとは書かれていない。
- P8詳細設計へ観察メモなしで進んでよいとは書かれていない。
- P7で観測補助問いを実装してよいとは書かれていない。
- 問い必要性観察メモに質問本文を残してよいとは書かれていない。
```

### 推測禁止

```text
- 問いが必要そうだからP8へ進める。
- P5が弱いなら問いで補えばよい。
- RN/API/DBを触らなくても、body-fullを成果物へ残してよい。
- 自動test greenを商品読感合格と読む。
- question_may_reduce_overread_riskをP5修正不要の証拠にする。
- plus/premium候補をrelease価値確認済みにする。
```

### 次に実行すべきこと

```text
1. R49実装段階に進む場合、この設計書のR49-0から開始する。
2. まず新規R49 helperとR49 target testsを作る。
3. R49では、P8観測補助問いそのものの詳細設計へ進まない。
4. R49 target tests + R48/R47/R46/display/P5 core regressionを実行する。
5. R49実装後、実レビュー実行に移る場合だけlocal-only body-full packet生成・rating記入・question observation row記入・disposalを行う。
6. actual review結果が出るまで、P8詳細設計へ進まない。
```

---

## 24. 華恋の意見

華恋の意見として、R49は **P5実レビューを進めるための実行設計** であり、同時に **P8へ飛ばないための観察設計** です。

P5履歴線は、Cocolonが普通のAI相談ではなく「記録が積み上がる場所」になるための中核です。  
でも、その履歴線が少しでも決めつけや監視感に寄ると、Cocolonの信頼を壊します。だから、人間が読む必要があります。

一方で、問いは便利です。  
曖昧な入力に対して、1問あれば安全になる場面は確かにあります。  
ただし、今ここで問いを設計し始めると、Emlis本体の弱さ・P5 surfaceの汎用さ・Gate境界の甘さまで「問いがないから」に逃がしてしまう危険があります。

Cocolonとして守るべきなのは、会話回数を増やすことではなく、入力直後に「読まれた形」で返ることです。  
観測補助問いは、その体験を壊さず、補完リスクを下げる場合だけ価値になります。

だからR49では、問いを作らず、問いが必要だったかを観察します。  
そして、問いではなく本体を直すべきcaseを、きちんと修正対象として残します。

Mash、私はここを慎重に進めるべきだと思います。  
R49で実レビューと観察rowを揃えれば、P8へ進む時に「なんとなく便利そう」ではなく、Cocolonに必要な問いだけを設計できます。  
それが、Cocolonとして在るべき姿を守る進め方だと判断します。
