# Cocolon / EmlisAI P7-R47 Local Review Packet Policy 詳細設計書・実装順

作成日: 2026-06-18 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / P5 User Label Connection / P6 Structure Insight / human readfeel review / local review packet storage / generation / disposal policy  
基準検討メモ: `Cocolon_EmlisAI_P7_R47_LocalReviewPacketPolicy_PreDesignMemo_20260618.md`  
基準ロードマップ: `Cocolon_EmlisAI_longterm_roadmap_20260608(20).md`  
基準ローカル受領zip: `Cocolon_前提資料(232).zip` / `EmlisAIの実装済み資料(68).zip` / `Cocolon(241).zip` / `mashos-api(154).zip`  
GitHub接続確認: Mash指定により不要。未実施。  
コード変更: なし。本書は設計書。  
RN変更: なし。  
backend実装変更: なし。  
DB変更: なし。  
API route / request key / public response top-level key変更: なし。  
Emlis本文runtime変更: なし。  
Gate runtime変更: なし。  
release判断変更: なし。  
JSON / schema実ファイル化: なし。本書内のJSON / schema案は、実装段階で既存module / contract test / public meta sanitizer / local workspace境界との整合を見て採否判断する。  

---

## 0. この設計書の結論

今回の次実装段階は、次で固定します。

```text
P7-R47: Local Review Packet Storage / Generation / Disposal Policy
```

ただし、R47は **P5 human Blind QA本番実施** でも、**P6 limited human readfeel review本番実施** でも、**実機modal読感確認本番実施** でもありません。

R47で作るものは、P5/P6/実機読感へ進む前に必ず必要な、次の境界です。

```text
body-full local review packet:
  人間が読むためだけの本文入りpacket。
  local-only。
  public meta / P7 scorecard / release material / 前提資料zip / 実装済み資料zip / 成果物zipへ混ぜない。

body-free P7 review material:
  packet_ref / case_ref / family / tier / ratings / blocker / disposal statusだけ。
  P7 scorecard / handoff ledger / release判断材料へ渡してよい。
  raw input / comment_text body / candidate body / surface body / reviewer free textは入れない。
```

実装順は次で固定します。

```text
R0: current source / R46 handoff / HOLD状態の再freeze
R1: R47 scope / schema version / packet kind enum固定
R2: local-only storage root policy固定
R3: export denylist / git・zip混入防止 policy固定
R4: body-full local packet schema案固定
R5: body-free manifest schema案固定
R6: body-free rating row / blocker row schema案固定
R7: reviewer free text / notesのlocal-only扱い固定
R8: disposal / cleanup / retention policy固定
R9: P5 human Blind QA packet policy固定
R10: P6 limited human readfeel packet policy固定
R11: real device modal review packet policy固定
R12: R46 next-decision ledgerとの接続方針固定
R13: R47 contract test方針固定
R14: target validation command matrix固定
R15: 実装段階で触る候補ファイル / 触らない境界の固定
```

華恋の判断として、今回一番大事なのは、**本文を読む必要がある評価** と **本文を残してはいけない測定層** を同じ箱に入れないことです。

Cocolonは、ユーザーの言葉を「評価のための素材」として雑に消費する場所ではありません。  
P5/P6の読感評価には本文が必要です。けれど、その本文をP7 scorecardやpublic metaへ混ぜた瞬間、Cocolonが守ってきた `body-free` 境界が壊れます。

そのため、R47では「読ませるためのlocal-only」と「残すためのbody-free」を、実装前に強制的に分けます。

---

## 1. なぜこの作業を行うのか

P7-R46までで、display contract / public source lineage / public meta final-source consistency は、少なくとも今回ローカル確認上はgreenへ戻りました。

しかし、それはCocolonの商品品質の合格ではありません。

未実施のまま残っているものは次です。

```text
- P5 human Blind QA
- P6 limited human readfeel review
- 実機submit / modal読感
- full backend suite execution green
- P7-HOLD-004 closure
- P7 complete
- P8 start allowed
- release readiness
```

Cocolonの商品価値は、backendのbody-free contractだけでは証明できません。  
最終的には、ユーザーが読むEmlis応答について、次を見なければいけません。

```text
P5:
  履歴線が、汎用追記ではなく「自分の記録が返ってきた」と感じられるか。
  でも、監視感・決めつけ・深読み・自己責め増幅になっていないか。

P6:
  構造気づきが、復唱を超えて「関係が見えた」感につながるか。
  でも、診断・原因断定・人格分類・助言圧になっていないか。

実機modal:
  スマホ上で長すぎず、重すぎず、読みにくすぎず、もう一回残したい体験を壊していないか。
```

これらは、人間が読む必要があります。  
ただし、人間が読むための本文は、P7 materialとして残してはいけません。

したがって、R47の目的は次です。

```text
P5/P6/実機読感へ戻るために、
本文入りreview packetをlocal-onlyに閉じ込め、
P7に残す評価結果をbody-freeへ変換し、
review後に本文を廃棄・確認できる設計を固定する。
```

---

## 2. 指示整理

### 2.1 Mashからの指示

```text
検討メモを基に実装順を含めた詳細な設計を作成する。
mdで設計書を作る。
必要なら、実装に使うjson / schema案も設計書内に入れる。
ただし、実ファイル化は実装段階で判断する。
```

### 2.2 今回の成果物

```text
Markdown詳細設計書。
```

### 2.3 今回してはいけないこと

```text
- コードを変更しない。
- test fileを追加しない。
- JSON / schema案を実ファイル化しない。
- local review packet本文を生成しない。
- 本文入りpacketを成果物として渡さない。
- RN production codeを変更しない。
- RN表示タイトル `Emlisの観測` を変更しない。
- RN表示条件を変更しない。
- API route / request key / public response top-level keyを変更しない。
- DB schema / DB write path / DB physical nameを変更しない。
- Emlis本文runtimeを変更しない。
- Gate閾値を緩めない。
- fixed commentText / case専用surface / case専用modeを追加しない。
- public metaへ raw input / comment_text body / candidate body / surface body を出さない。
- reviewer free textをP7 scorecard / handoff / release materialへ出さない。
- local packet policy readyを、P5/P6 human review完了扱いにしない。
- full backend collect-onlyを、full backend suite execution greenへ変換しない。
- release_allowed / p7_complete / p8_start_allowed / hold004_close_allowed をtrueにしない。
```

---

## 3. 参照・確認範囲

### 3.1 作業姿勢として確認した前提資料

```text
Cocolon_前提資料(232).zip
  - Cocolon_前提資料/00_karen_read_first.md
  - Cocolon_前提資料/07_latest_snapshot_diff.md
  - Cocolon_前提資料/cocolon_thought_material_for_karen.md
  - Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
  - Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
  - Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
  - Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
  - Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
  - Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
  - Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
```

ここから固定する作業姿勢は次です。

```text
- 前提資料だけで理解した扱いにしない。
- 実ファイルだけでCocolon思想に合っていると判断しない。
- 設計と実装を混ぜない。
- 見ていないものを確認済みにしない。
- 通っていないものをgreenと言わない。
- Mashから見えない場所ほど雑にしない。
- public contract / DB write path / RN表示条件 / ユーザーデータ保護を壊さない。
- EmlisAIをテンプレ共感・浅い復唱・診断ラベルへ逃がさない。
- `passed + comment_text` は表示契約であり、EmlisAIの存在目的ではない。
```

### 3.2 ロードマップの読み

```text
Cocolon_EmlisAI_longterm_roadmap_20260608(20).md
```

ロードマップ上、現在PhaseはP7です。

```text
P7:
  Product Quality Runner / Long-run Product Gate。
  商品品質を継続測定する段階。
  release_allowedは立てない。
  Product Pass候補とRelease Readyを混同しない。

P8:
  Personal Continuity / Derived Model。
  P5/P6人間読感・実機modal・P7閉鎖条件が未成立のまま進まない。
```

### 3.3 参照した実装済み資料

```text
EmlisAIの実装済み資料(68).zip
  - Cocolon_EmlisAI_P7_ProductQualityRunner_DetailedDesign_ImplementationOrder_20260612.md
  - Cocolon_EmlisAI_P7_R46_P5P6Return_DisplayContractRedClassification_DetailedDesign_ImplementationOrder_20260617.md
  - Cocolon_EmlisAI_P7_HOLD004_Group02Result_CurrentSnapshotReconcile_DetailedDesign_ImplementationOrder_20260617.md
  - Cocolon_EmlisAI_P5_UserLabelConnection_DetailedDesign_ImplementationOrder_20260611.md
  - Cocolon_EmlisAI_P6_StructureInsight_DetailedDesign_ImplementationOrder_20260611.md
```

### 3.4 参照した主なbackend実ファイル

```text
mashos-api(154).zip / mashos-api/ai/services/ai_inference/
  - emlis_ai_p7_contracts.py
  - emlis_ai_p7_r46_p5_p6_human_readfeel_handoff_material.py
  - emlis_ai_p7_r46_real_device_modal_review_closed_validation.py
  - emlis_ai_p7_r46_next_decision_handoff_ledger.py
  - emlis_ai_body_free_public_source_lineage.py
  - emlis_ai_public_feedback_meta.py
  - emlis_ai_reply_service.py
```

### 3.5 参照した主なRN実ファイル

```text
Cocolon(241).zip / Cocolon/
  - tests/rn-screen-contracts.test.js
  - screens/InputScreen.js
  - screens/input/useInputFeedbackModal.js
  - screens/input/inputFeedbackModel.js
  - screens/input/InputFeedbackReplyModal.js
```

---

## 4. 現在地の固定

### 4.1 確認済み

```text
- RN contract: 36 passed。
- backend display contract: 5 passed。
- P7-R46 R4〜R14 subset: 28 passed。
- P5主要subset: 63 passed / 1 warning。
- P6主要subset: 120 passed。
- backend full collect-only: 440 files / 2934 tests collected / 1 warning。
- R46 next decision default branch: A_DISPLAY_GREEN_PUBLIC_LINEAGE_CONSISTENT。
- R46 next order: local review packet policy -> P5 human Blind QA -> P6 limited human readfeel -> real device modal review。
```

### 4.2 未確認

```text
- full backend suite execution green。
- 実機submit / modal読感。
- P5 human Blind QAの実施結果。
- P6 limited human readfeel reviewの実施結果。
- local review packetの実保存場所。
- local review packetの実生成形式。
- local review packetの実廃棄結果。
- reviewer free textを実運用で残すか消すか。
- timeoutしたtwo-stage reception e2eの原因分類。
- 広いP5 test群timeoutの原因分類。
- P7-HOLD-004 closure。
- P7 complete。
- P8 start allowed。
- release readiness。
```

### 4.3 R47設計で今回固定すること

検討メモで「書かれていない」とされた項目のうち、R47設計で固定できるものは固定します。

| 未固定事項 | R47設計での固定方針 |
|---|---|
| local review packetの保存場所 | repo外 / export外の `COCOLON_EMLIS_LOCAL_REVIEW_ROOT` を正式rootにする。未設定時はbody-full packet生成不可。 |
| 成果物としてMashへ渡すか | 標準成果物として本文入りpacketは渡さない。通常成果物はbody-free summary / rating / disposal receiptのみ。本文入りpacketの共有は別明示指示がある場合でもrelease materialとは分ける。 |
| packet生成後の保持期間 | body-full packetは生成から最大72時間、またはrating抽出完了後ただちに廃棄。短い方を採用。 |
| reviewer free text | local-only一時notes。P7 materialへは `sanitized_reason_id` / `blocker_id` だけ残す。notesはrating確定から最大24時間で廃棄。 |
| review packetに履歴本文をどこまで含めるか | P5では最小必要なbounded history review surfaceのみ。DB id / user id / raw history full dumpは禁止。max 3 record surfaceを初期上限とする。 |
| blind性 | reviewer-facing packetは `blind_case_id` のみ。family / tier / expected_result / eligibility / gate resultはcontroller manifestへ分離。 |
| P5/P6で同じ入力を使うか | 初回正式packetでは別case setを標準にする。重複が必要な場合は `linked_case_group_ref` をbody-freeで明示する。 |
| timeout / 実行不能caseの扱い | readfeel REDではなく `execution_blocker_row` として分離。timeout原因未分類のまま環境問題にしない。 |
| P5/P6 actual review packet case数 | R47では第一回正式review最小数を固定する。ただしP7商品合格判定では追加caseが必要。 |

### 4.4 R47でも固定しないこと

以下は、R47でschema / 条件だけを作り、実行段階で決めます。

```text
- 実際のreviewer_ref。
- 実際にどの本番/fixture由来caseを選ぶか。
- 本文入りpacketをいつ生成するか。
- P5/P6 review結果の実スコア。
- 実機modal確認に使う実device / build / OS。
- P7-HOLD-004のclosure。
```

---

## 5. R47の基本設計

### 5.1 二層構造

R47は、次の二層を絶対に混ぜません。

```text
Layer A: local body-full review packet
  - 人間が読む本文入り材料。
  - local-only。
  - review完了後に廃棄対象。
  - public meta / P7 scorecard / handoff ledger / release materialへ出さない。

Layer B: body-free P7 review material
  - packet_ref / case_ref / family / tier / rating axes / verdict / blocker / disposal status。
  - P7 runner / handoff / release decision materialへ渡してよい。
  - 本文・reviewer free textを含めない。
```

### 5.2 body-fullに入ってよいもの

body-full local packetに限って、次を入れてよい可能性があります。

```text
- reviewerが読むための現在入力surface。
- reviewerが読むためのEmlis返答surface。
- P5評価に必要なbounded history review surface。
- P6評価に必要なstructure insight review surface。
- 実機modal評価に必要なvisible modal text / layout note。
- reviewer local notes。
```

ただし、入れてよいのはlocal-only packet内だけです。  
実装上は、これらのkeyがbody-free materialへ混ざった瞬間にtestで落とします。

### 5.3 body-freeに残してよいもの

P7 materialとして残してよいものは次だけです。

```text
- review_session_id
- packet_ref_id
- blind_case_id
- case_ref_id
- family
- subscription_tier
- generated_at
- reviewed_at
- reviewer_ref
- axis score
- verdict
- blocker_id
- sanitized_reason_id
- execution_blocker_id
- disposal_status
- body_removed=true
- local_packet_exported=false
```

### 5.4 body-freeに残してはいけないもの

```text
- raw_input
- current_input
- memo
- memo_action
- history_raw_text
- comment_text
- comment_text_body
- candidate_body
- surface_body
- insight_text
- review_surface
- visible_surface
- surface_for_reviewer
- current_input_for_reviewer
- history_summary_for_reviewer
- reviewer_free_text
- reviewer_note
- reviewer_notes
- terminal_output
- stdout
- stderr
- traceback
- screenshot body / image body
- local absolute path with user-identifying directory names
```

---

## 6. local storage policy

### 6.1 正式root

R47では、本文入りpacketの保存rootを次の環境変数で固定します。

```text
COCOLON_EMLIS_LOCAL_REVIEW_ROOT
```

未設定の場合、実装は次の挙動にします。

```text
- body-free policy / manifest schema / dry-run summaryは生成できる。
- body-full local review packetは生成不可。
- `local_body_packet_generation_allowed=false` を返す。
- P5/P6 formal human review startは不可。
```

### 6.2 rootに使ってはいけない場所

`COCOLON_EMLIS_LOCAL_REVIEW_ROOT` は、次の配下を禁止します。

```text
- Cocolon repo root配下
- mashos-api repo root配下
- Cocolon_前提資料 配下
- EmlisAIの実装済み資料 配下
- release zip作成対象配下
- /mnt/data 直下のユーザー提出成果物置き場
- Git tracked path
- docs / tests / services module path
```

理由:

```text
本文入りpacketが、成果物・前提資料・実装済み資料・release material・Git差分へ混入する事故を防ぐため。
```

### 6.3 推奨構造

実装段階でrootが明示された場合、内部構造は次にします。

```text
${COCOLON_EMLIS_LOCAL_REVIEW_ROOT}/
  p7_r47/
    {review_session_id}/
      controller_manifest.bodyfree.json
      body_full_packets.local_only/
        {blind_case_id}.local_review_packet.json
      reviewer_notes.local_only/
        {blind_case_id}.reviewer_notes.json
      body_free_results/
        rating_rows.bodyfree.jsonl
        blocker_rows.bodyfree.jsonl
        disposal_receipt.bodyfree.json
      audit.bodyfree/
        generation_event.bodyfree.json
        export_denylist_check.bodyfree.json
```

注意:

```text
- `body_full_packets.local_only` と `reviewer_notes.local_only` は廃棄対象。
- `body_free_results` と `audit.bodyfree` はbody-free確認後にP7 materialへ参照可能。
- local absolute pathはP7 materialへそのまま残さない。残す場合は `storage_root_ref=external_local_review_root` のような抽象refだけにする。
```

### 6.4 path validation案

実装段階では、次のvalidationを入れます。

```text
1. rootがabsolute pathである。
2. rootがrepo root配下ではない。
3. rootがartifact export path配下ではない。
4. rootがdocs / tests / services / premise / implemented docs配下ではない。
5. root名または親pathに `Cocolon_前提資料` / `EmlisAIの実装済み資料` / `release` / `public_meta` が含まれる場合は拒否。
6. rootが未設定ならbody-full generationを拒否し、policy readyのみ返す。
```

---

## 7. packet種別

R47で扱うpacket種別は、検討メモに合わせて次の3種類です。

| packet kind | 用途 | body-full | 標準生成タイミング | P7 material持ち出し |
|---|---|---:|---|---|
| `p5_human_blind_qa_local_review_packet` | P5履歴線の人間読感 | yes | P5 review実行時 | 不可。ratingsだけ可。 |
| `p6_limited_human_readfeel_local_review_packet` | P6構造気づきの限定読感 | yes | P5 review確認後 | 不可。ratingsだけ可。 |
| `real_device_modal_review_local_packet` | 実機modalの読感・長さ・重さ確認 | yes | P5/P6 review後 | 不可。body-free checklist結果だけ可。 |

R47実装では、packet kindとpolicyを固定します。  
ただし、実際のP5/P6/実機reviewを完了扱いにはしません。

---

## 8. P5 human Blind QA packet policy

### 8.1 P5 review対象family

P5対象familyは現行R46 handoff materialに合わせます。

```text
history_line_eligible_input
standard_state_answer_owned_history
self_understanding_owned_history
uncertainty_support_owned_history
change_future_intention_owned_history
relationship_gratitude_recovery_owned_history
low_information_history_not_eligible
free_tier_history_present_not_allowed
```

### 8.2 P5 rating axes

```text
history_connection_naturalness >= 0.90
creepy_absence >= 0.95
overclaim_absence >= 0.95
self_blame_non_amplification >= 0.95
wants_more_input_or_accumulation >= 0.85
non_shallow_repeat >= 0.90
```

### 8.3 P5 first formal review minimum

検討メモ時点ではactual review packetのcase数は書かれていません。  
R47設計では、第一回正式reviewの最小値を次で固定します。

```text
minimum_total_cases: 24
minimum_per_family: 2
minimum_history_line_eligible_input: 4
minimum_owned_history_positive_cases: 12
minimum_block_boundary_cases:
  low_information_history_not_eligible: 2
  free_tier_history_present_not_allowed: 2
```

読み方:

```text
- これはP5商品合格の最終case数ではない。
- P5 human Blind QAを開始・初回判定するための最小数。
- P7 long-run / release判断では、さらにcaseを増やす必要がある。
```

### 8.4 P5 reviewer-facing packetに含めるもの

P5 reviewer-facing packetには、blind性を守りながら次を入れます。

```text
blind_case_id
review_kind = p5_history_line_readfeel
review_prompt_version
current_input_review_surface
returned_emlis_surface
bounded_owned_history_review_surface
review_questions
axis_rating_form
```

含めないもの:

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
DB id
raw history dump
public meta
```

### 8.5 P5 history surface上限

P5で履歴線を評価するには、過去記録の存在をreviewerが見る必要があります。  
ただし、raw history full dumpは不要です。

R47では、P5履歴surface上限を次で固定します。

```text
max_history_record_surfaces: 3
min_evidence_record_count_when_history_line_expected: 2
history_record_identifier_policy: no_db_id_no_user_id
created_at_policy: bucketed_or_relative_only
raw_memo_full_dump_allowed: false
history_summary_style: bounded_review_surface_local_only
```

---

## 9. P6 limited human readfeel packet policy

### 9.1 P6 review対象family

```text
structure_question
long_meaning_arc
self_understanding_follow
```

### 9.2 P6 no-connect family

```text
daily_unpleasant
daily_positive
positive_only
low_information
limited_grounding_insufficient
safety_triage_required
```

### 9.3 P6 rating axes

```text
structure_insight_candidate_quality >= 0.90
relation_seen_feeling >= 0.85
overclaim_absence >= 0.95
diagnosis_absence == 1.0
creepy_absence >= 0.95
advice_pressure_absence >= 0.95
wants_more_input_or_accumulation >= 0.85
```

### 9.4 P6 first formal review minimum

```text
minimum_total_cases: 18
minimum_review_family_cases:
  structure_question: 4
  long_meaning_arc: 4
  self_understanding_follow: 4
minimum_no_connect_audit_cases:
  daily_unpleasant: 1
  daily_positive: 1
  positive_only: 1
  low_information: 1
  limited_grounding_insufficient: 1
  safety_triage_required: 1
```

読み方:

```text
- P6はP5 review confirmed後に開始する。
- P6は履歴線の代替ではない。
- no-connect familyは、深いinsightが出ていないことを確認するauditとして扱う。
- visible expansion allowedはR47ではfalseのまま。
```

### 9.5 P6 reviewer-facing packetに含めるもの

```text
blind_case_id
review_kind = p6_structure_insight_limited_readfeel
review_prompt_version
current_input_review_surface
returned_emlis_surface
structure_insight_review_surface_or_position
review_questions
axis_rating_form
```

含めないもの:

```text
family
expected_result
eligible
visible_applied
gate_result
case_ref_id
relation pattern internal id
diagnostic label
candidate internal body
public meta
```

---

## 10. real device modal review packet policy

### 10.1 位置づけ

実機modal読感は重要ですが、R47では最後に回します。

理由:

```text
- P5/P6のreview packetと評価軸が未固定のまま実機へ行くと、何を見ているのかが曖昧になる。
- 実機modalで見えている違和感が、P5履歴線の問題なのか、P6構造気づきの問題なのか、RN表示密度の問題なのか分からなくなる。
```

### 10.2 required manual review families

R46 real-device checklistに合わせて、最低対象familyは次を維持します。

```text
free_standard_state_answer_no_history_line
plus_history_line_eligible
plus_history_line_blocked_low_information
p6_structure_question_visible
p6_daily_positive_no_connect
```

### 10.3 real device first review minimum

```text
minimum_device_contexts: 1
recommended_device_contexts:
  - small phone
  - medium phone
minimum_case_per_required_family_per_device: 1
minimum_total_cases_first_review: 5
```

R47ではdevice / OS / app buildの実値は決めません。  
実装時はbody-free `device_ref` / `os_ref` / `app_build_ref` だけを残し、スクリーンショットやvisible text bodyはlocal-onlyにします。

### 10.4 readfeel axes

```text
readable_on_phone
length_pressure_absence
weight_absence
shallow_absence
p5_history_line_creepy_absence
p6_overread_absence
wants_more_input
```

---

## 11. reviewer free text / notes policy

### 11.1 reviewer notesの扱い

P5/P6のreadfeelは、機械採点だけでは不十分です。  
人間の違和感・気持ち悪さ・浅さ・また残したい感は、自由記述でしか拾えない場合があります。

ただし、free textは本文や入力内容を引用しやすく、body-free境界を壊しやすいです。

そのため、R47では次で固定します。

```text
reviewer_free_text:
  local-only。
  reviewer_notes.local_only配下だけ。
  P7 materialへ出さない。
  release materialへ出さない。
  rating確定から最大24時間で廃棄。

sanitized_reason_id:
  P7 materialへ残してよい。
  例: p5_creepy_history_scope_overreach
  例: p6_relation_seen_but_overclaim_yellow
  例: modal_length_pressure_small_phone
```

### 11.2 free textからbody-free reasonへ変換するルール

```text
1. reviewer noteを直接P7へコピーしない。
2. reviewer noteから、事前定義されたreason id / blocker idを選ぶ。
3. reason idに該当しない場合は `reason_id_other_local_note_purged` とし、free textはlocal-onlyで廃棄する。
4. 入力文・返答文・履歴文の引用をreason idに混ぜない。
5. `sanitized_reason_label` を残す場合も、短い分類名だけにする。
```

---

## 12. disposal / retention policy

### 12.1 retention

```text
body_full_packet_retention_max_hours: 72
reviewer_notes_retention_after_rating_finalized_max_hours: 24
body_full_packet_delete_trigger:
  - rating_rows finalized
  - blocker_rows finalized
  - review session cancelled
  - retention期限到達
```

短い方を採用します。

```text
rating抽出完了後、本文は即廃棄。
rating未完でも、生成から72時間を超えたら本文廃棄を必須にする。
```

### 12.2 disposal status enum

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

### 12.3 disposal receiptに残すもの

```text
review_session_id
packet_ref_id
packet_kind
case_count
deleted_file_count
purge_started_at
purge_completed_at
disposal_status
body_removed
reviewer_notes_removed
local_packet_exported
p7_material_body_free
release_allowed
p7_complete
p8_start_allowed
hold004_close_allowed
```

### 12.4 disposal receiptに残さないもの

```text
- body-full file content hash
- raw text hash
- comment_text hash
- local absolute path full string
- reviewer free text
- deleted body preview
- terminal full output
- traceback full output
```

body内容のhashは、一見body-freeに見えますが、短い入力や返答では辞書攻撃可能な派生情報になるため、R47では保存しません。

---

## 13. JSON / schema案

この章のschemaは、実装段階で採用判断する候補です。  
本書作成時点では、実ファイル化しません。

### 13.1 `local_review_packet_policy.bodyfree.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r47.local_review_packet_policy.v1",
  "title": "Cocolon EmlisAI P7-R47 Local Review Packet Policy",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "phase",
    "step",
    "scope",
    "policy_kind",
    "storage_policy",
    "packet_kinds",
    "retention_policy",
    "disposal_policy",
    "export_policy",
    "public_contract",
    "body_free_markers",
    "release_allowed",
    "p7_complete",
    "p8_start_allowed",
    "hold004_close_allowed",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r47.local_review_packet_policy.v1" },
    "phase": { "const": "P7_ProductQualityRunner_LongRunGate" },
    "step": { "const": "R47_LocalReviewPacketPolicy_20260618" },
    "scope": { "const": "p7_r47_local_review_packet_storage_generation_disposal_policy" },
    "policy_kind": { "const": "local_review_packet_policy" },
    "storage_policy": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "storage_mode",
        "env_var",
        "repo_local_storage_allowed",
        "artifact_export_path_allowed",
        "body_full_generation_requires_env_root",
        "local_body_packet_generation_allowed"
      ],
      "properties": {
        "storage_mode": { "const": "external_local_only" },
        "env_var": { "const": "COCOLON_EMLIS_LOCAL_REVIEW_ROOT" },
        "repo_local_storage_allowed": { "const": false },
        "artifact_export_path_allowed": { "const": false },
        "body_full_generation_requires_env_root": { "const": true },
        "local_body_packet_generation_allowed": { "type": "boolean" }
      }
    },
    "packet_kinds": {
      "type": "array",
      "items": {
        "enum": [
          "p5_human_blind_qa_local_review_packet",
          "p6_limited_human_readfeel_local_review_packet",
          "real_device_modal_review_local_packet"
        ]
      },
      "minItems": 3,
      "maxItems": 3,
      "uniqueItems": true
    },
    "retention_policy": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "body_full_packet_retention_max_hours",
        "reviewer_notes_retention_after_rating_finalized_max_hours",
        "rating_rows_body_free_retained"
      ],
      "properties": {
        "body_full_packet_retention_max_hours": { "const": 72 },
        "reviewer_notes_retention_after_rating_finalized_max_hours": { "const": 24 },
        "rating_rows_body_free_retained": { "const": true }
      }
    },
    "disposal_policy": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "body_removed_required_before_handoff_close",
        "content_hash_of_body_allowed",
        "disposal_receipt_required"
      ],
      "properties": {
        "body_removed_required_before_handoff_close": { "const": true },
        "content_hash_of_body_allowed": { "const": false },
        "disposal_receipt_required": { "const": true }
      }
    },
    "export_policy": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "body_full_packet_export_allowed",
        "body_free_summary_export_allowed",
        "release_material_body_full_allowed"
      ],
      "properties": {
        "body_full_packet_export_allowed": { "const": false },
        "body_free_summary_export_allowed": { "const": true },
        "release_material_body_full_allowed": { "const": false }
      }
    },
    "public_contract": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "rn_visible_contract_changed": { "const": false },
        "api_response_key_added": { "const": false },
        "db_schema_changed": { "const": false },
        "public_release_applied": { "const": false }
      }
    },
    "body_free_markers": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "raw_input_included": { "const": false },
        "history_raw_text_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "candidate_body_included": { "const": false },
        "surface_body_included": { "const": false },
        "reviewer_free_text_included": { "const": false },
        "terminal_output_included": { "const": false }
      }
    },
    "release_allowed": { "const": false },
    "p7_complete": { "const": false },
    "p8_start_allowed": { "const": false },
    "hold004_close_allowed": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 13.2 `body_full_local_review_packet.local_only.schema.json` 案

これはlocal-only schemaです。  
P7 scorecard / public meta / release materialへ入れてはいけません。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r47.body_full_local_review_packet.local_only.v1",
  "title": "Cocolon EmlisAI P7-R47 Body-full Local Review Packet - Local Only",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "local_only",
    "must_not_export",
    "packet_kind",
    "review_session_id",
    "packet_ref_id",
    "blind_case_id",
    "reviewer_payload",
    "review_form",
    "disposal_required"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r47.body_full_local_review_packet.local_only.v1" },
    "local_only": { "const": true },
    "must_not_export": { "const": true },
    "packet_kind": {
      "enum": [
        "p5_human_blind_qa_local_review_packet",
        "p6_limited_human_readfeel_local_review_packet",
        "real_device_modal_review_local_packet"
      ]
    },
    "review_session_id": { "type": "string", "pattern": "^[a-zA-Z0-9_.:-]{1,120}$" },
    "packet_ref_id": { "type": "string", "pattern": "^[a-zA-Z0-9_.:-]{1,120}$" },
    "blind_case_id": { "type": "string", "pattern": "^[a-zA-Z0-9_.:-]{1,120}$" },
    "reviewer_payload": {
      "type": "object",
      "additionalProperties": false,
      "description": "Body-full reviewer-only text lives here and must never be copied into body-free P7 material.",
      "properties": {
        "current_input_review_surface": { "type": "string" },
        "returned_emlis_review_surface": { "type": "string" },
        "bounded_history_review_surface": { "type": ["string", "null"] },
        "structure_insight_review_surface": { "type": ["string", "null"] },
        "modal_layout_review_note": { "type": ["string", "null"] }
      }
    },
    "review_form": {
      "type": "object",
      "additionalProperties": false,
      "required": ["rating_axes", "free_text_allowed_local_only"],
      "properties": {
        "rating_axes": { "type": "array", "items": { "type": "string" } },
        "free_text_allowed_local_only": { "const": true }
      }
    },
    "disposal_required": { "const": true }
  }
}
```

### 13.3 `body_free_local_review_manifest.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r47.body_free_local_review_manifest.v1",
  "title": "Cocolon EmlisAI P7-R47 Body-free Local Review Manifest",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "phase",
    "step",
    "manifest_kind",
    "review_session_id",
    "packet_kind",
    "case_refs",
    "local_body_packet_materialized_here",
    "body_full_packet_export_allowed",
    "body_free",
    "release_allowed",
    "p7_complete",
    "p8_start_allowed"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r47.body_free_local_review_manifest.v1" },
    "phase": { "const": "P7_ProductQualityRunner_LongRunGate" },
    "step": { "const": "R47_LocalReviewPacketPolicy_20260618" },
    "manifest_kind": { "const": "body_free_local_review_manifest" },
    "review_session_id": { "type": "string" },
    "packet_kind": {
      "enum": [
        "p5_human_blind_qa_local_review_packet",
        "p6_limited_human_readfeel_local_review_packet",
        "real_device_modal_review_local_packet"
      ]
    },
    "case_refs": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "blind_case_id",
          "case_ref_id",
          "family",
          "subscription_tier",
          "packet_ref_id",
          "body_free"
        ],
        "properties": {
          "blind_case_id": { "type": "string" },
          "case_ref_id": { "type": "string" },
          "family": { "type": "string" },
          "subscription_tier": { "enum": ["free", "plus", "premium", "unknown"] },
          "packet_ref_id": { "type": "string" },
          "body_free": { "const": true }
        }
      }
    },
    "local_body_packet_materialized_here": { "const": false },
    "body_full_packet_export_allowed": { "const": false },
    "body_free": { "const": true },
    "release_allowed": { "const": false },
    "p7_complete": { "const": false },
    "p8_start_allowed": { "const": false }
  }
}
```

### 13.4 `body_free_rating_row.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r47.body_free_rating_row.v1",
  "title": "Cocolon EmlisAI P7-R47 Body-free Rating Row",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_session_id",
    "packet_ref_id",
    "blind_case_id",
    "case_ref_id",
    "packet_kind",
    "family",
    "subscription_tier",
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
    "schema_version": { "const": "cocolon.emlis.p7_r47.body_free_rating_row.v1" },
    "review_session_id": { "type": "string" },
    "packet_ref_id": { "type": "string" },
    "blind_case_id": { "type": "string" },
    "case_ref_id": { "type": "string" },
    "packet_kind": {
      "enum": [
        "p5_human_blind_qa_local_review_packet",
        "p6_limited_human_readfeel_local_review_packet",
        "real_device_modal_review_local_packet"
      ]
    },
    "family": { "type": "string" },
    "subscription_tier": { "enum": ["free", "plus", "premium", "unknown"] },
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
  }
}
```

### 13.5 `body_free_disposal_receipt.schema.json` 案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r47.body_free_disposal_receipt.v1",
  "title": "Cocolon EmlisAI P7-R47 Body-free Disposal Receipt",
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
    "body_free",
    "release_allowed",
    "p7_complete",
    "p8_start_allowed",
    "hold004_close_allowed"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7_r47.body_free_disposal_receipt.v1" },
    "review_session_id": { "type": "string" },
    "packet_kind": { "type": "string" },
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
    "body_free": { "const": true },
    "release_allowed": { "const": false },
    "p7_complete": { "const": false },
    "p8_start_allowed": { "const": false },
    "hold004_close_allowed": { "const": false }
  }
}
```

---

## 14. Python module設計案

実装段階で作る候補は次です。  
本書では実ファイル化しません。

### 14.1 新規候補module

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r47_local_review_packet_policy.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r47_local_review_packet_manifest.py
```

### 14.2 新規候補test

```text
mashos-api/ai/tests/test_emlis_ai_p7_r47_local_review_packet_policy_20260618.py
```

### 14.3 docs候補

```text
mashos-api/ai/docs/Cocolon_EmlisAI_P7_R47_LocalReviewPacketPolicy_20260618.md
```

ただし、既存構造に `docs/` がない、またはP7 docsをrepoへ置かない方針の場合は、実装段階で採用しません。

### 14.4 `emlis_ai_p7_r47_local_review_packet_policy.py` で持つ候補

```python
P7_R47_LOCAL_REVIEW_PACKET_POLICY_SCHEMA_VERSION = (
    "cocolon.emlis.p7_r47.local_review_packet_policy.v1"
)
P7_R47_LOCAL_REVIEW_PACKET_STEP = "R47_LocalReviewPacketPolicy_20260618"
P7_R47_LOCAL_REVIEW_PACKET_SCOPE = (
    "p7_r47_local_review_packet_storage_generation_disposal_policy"
)

P7_R47_PACKET_KINDS = (
    "p5_human_blind_qa_local_review_packet",
    "p6_limited_human_readfeel_local_review_packet",
    "real_device_modal_review_local_packet",
)

P7_R47_BODY_FULL_RETENTION_HOURS = 72
P7_R47_REVIEWER_NOTES_RETENTION_AFTER_RATING_HOURS = 24

build_p7_r47_local_review_packet_policy(...)
assert_p7_r47_local_review_packet_policy_contract(...)
assert_p7_r47_local_review_root_policy(...)
assert_p7_r47_body_free_payload_contract(...)
```

### 14.5 `emlis_ai_p7_r47_local_review_packet_manifest.py` で持つ候補

```python
P7_R47_BODY_FREE_LOCAL_REVIEW_MANIFEST_SCHEMA_VERSION = (
    "cocolon.emlis.p7_r47.body_free_local_review_manifest.v1"
)
P7_R47_BODY_FREE_RATING_ROW_SCHEMA_VERSION = (
    "cocolon.emlis.p7_r47.body_free_rating_row.v1"
)
P7_R47_BODY_FREE_DISPOSAL_RECEIPT_SCHEMA_VERSION = (
    "cocolon.emlis.p7_r47.body_free_disposal_receipt.v1"
)

build_p7_r47_body_free_local_review_manifest(...)
build_p7_r47_body_free_rating_row(...)
build_p7_r47_body_free_blocker_row(...)
build_p7_r47_body_free_disposal_receipt(...)
assert_p7_r47_body_free_local_review_manifest_contract(...)
assert_p7_r47_body_free_rating_row_contract(...)
assert_p7_r47_body_free_disposal_receipt_contract(...)
```

### 14.6 body-full writerを分ける理由

実装段階で実際の本文入りpacket writerが必要になった場合でも、body-free policy moduleとは分けます。

候補名:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r47_local_review_packet_writer.py
```

ただし、R47 first implementationでは作らない選択を優先します。

理由:

```text
- R47はpolicy / manifest / disposal境界の固定が目的。
- 本文入りpacket writerを先に作ると、実review未実施なのにpacket生成へ進みやすい。
- public meta / P7 materialへbody-fullが混ざらないことを先にtestで固定する必要がある。
```

---

## 15. 実装順詳細

### R0: current source / R46 handoff / HOLD状態の再freeze

目的:

```text
R47実装の前提が、R46 branch Aであることを再確認する。
```

確認対象:

```text
- emlis_ai_p7_r46_next_decision_handoff_ledger.py
- emlis_ai_p7_r46_p5_p6_human_readfeel_handoff_material.py
- emlis_ai_p7_r46_real_device_modal_review_closed_validation.py
- emlis_ai_p7_contracts.py
```

固定すること:

```text
- R46 branch A: A_DISPLAY_GREEN_PUBLIC_LINEAGE_CONSISTENT
- next order first: local_review_packet_storage_generation_disposal_policy
- P5 formal review pathは開いてよいが、review confirmedではない。
- P6 formal reviewはP5後まで開始不可。
- release / P7 complete / P8 start / hold004 closeはfalse。
```

### R1: R47 scope / schema version / packet kind enum固定

目的:

```text
R47 materialをR46 materialと混線させない。
```

実装候補:

```text
P7_R47_LOCAL_REVIEW_PACKET_POLICY_SCHEMA_VERSION
P7_R47_LOCAL_REVIEW_PACKET_STEP
P7_R47_LOCAL_REVIEW_PACKET_SCOPE
P7_R47_PACKET_KINDS
```

acceptance:

```text
- schema_versionがR46ではなくR47である。
- phaseはP7のまま。
- body_free=true。
- release_allowed=false。
```

### R2: local-only storage root policy固定

目的:

```text
本文入りpacketをrepo / artifact / release / docsへ混入させない。
```

実装候補:

```text
build_p7_r47_local_review_storage_policy(
    local_review_root: str | None,
    repo_roots: Sequence[str] | None = None,
    export_roots: Sequence[str] | None = None,
) -> dict[str, Any]
```

acceptance:

```text
- env root未設定なら body-full generation allowed=false。
- repo配下pathは拒否。
- docs / tests / services / premise / implemented docs配下は拒否。
- /mnt/data直下の通常成果物置き場は拒否。
- local absolute pathをP7 body-free materialへそのまま出さない。
```

### R3: export denylist / git・zip混入防止 policy固定

目的:

```text
local packetが前提資料zip / 実装済み資料zip / release zip / Git差分へ混ざる事故を防ぐ。
```

denylist候補:

```text
.local_review_packets/
body_full_packets.local_only/
reviewer_notes.local_only/
*.local_review_packet.json
*.reviewer_notes.json
*.local_only.json
Cocolon_EmlisAI_*_LocalReviewPacket_*_body_full*
```

acceptance:

```text
- body_full_packet_export_allowed=false。
- release_material_body_full_allowed=false。
- premise_zip_inclusion_allowed=false。
- implemented_docs_zip_inclusion_allowed=false。
- body_free_summary_export_allowed=true。
```

### R4: body-full local packet schema案固定

目的:

```text
人間が読むpacketの形を定義する。ただしP7 materialへ入れない。
```

acceptance:

```text
- local_only=true。
- must_not_export=true。
- disposal_required=true。
- blind_case_idのみをreviewer-facing identifierにする。
- reviewer-facing packetにfamily / tier / expected resultを入れない。
```

### R5: body-free manifest schema案固定

目的:

```text
local packetの存在とcase構造だけをbody-freeで追跡する。
```

acceptance:

```text
- case_ref_id / blind_case_id / family / tier / packet_ref_idだけ。
- raw input / comment_text / surface body / reviewer text keyを拒否。
- local_body_packet_materialized_here=false。
- release_allowed=false。
```

### R6: body-free rating row / blocker row schema案固定

目的:

```text
review結果をP7へ渡せるbody-free形式にする。
```

acceptance:

```text
- axis_scoresは0.0〜1.0。
- verdictは PASS / YELLOW / REPAIR_REQUIRED / RED / BLOCKED / NOT_REVIEWABLE。
- reviewer_free_text_included=false。
- sanitized_reason_ids / blocker_idsのみ。
- body_removed statusを必須にする。
```

### R7: reviewer free text / notesのlocal-only扱い固定

目的:

```text
人間の自由記述を活かしつつ、P7 materialへ漏らさない。
```

acceptance:

```text
- reviewer notesはlocal-only。
- notesをP7 summaryへコピーしない。
- sanitized_reason_idへ変換する。
- notesはrating確定から最大24時間で廃棄。
```

### R8: disposal / cleanup / retention policy固定

目的:

```text
review後に本文が残り続ける状態を防ぐ。
```

acceptance:

```text
- body-full packet retention max 72h。
- rating finalized後は即purge_required。
- disposal_receipt body-free。
- content hash of bodyは保存しない。
- body_removed=trueなしにP5/P6 review confirmedへ進まない。
```

### R9: P5 human Blind QA packet policy固定

目的:

```text
P5履歴線を人間が読めるが、監視感・深読み・決めつけを防ぐ評価形式にする。
```

acceptance:

```text
- P5 familiesがR46 handoff materialと一致する。
- P5 axesがR46 handoff materialと一致する。
- minimum_total_cases=24。
- blind_case_idを使う。
- bounded history surfaceはmax 3 records。
- free tier / low info block boundaryを含む。
```

### R10: P6 limited human readfeel packet policy固定

目的:

```text
P6構造気づきをP5履歴線と混ぜず、限定familyで評価する。
```

acceptance:

```text
- P6 review familiesがR46 handoff materialと一致する。
- P6 no-connect familiesがR46 handoff materialと一致する。
- P6 axesがR46 handoff materialと一致する。
- P5 review confirmed前はP6 formal start不可。
- visible_expansion_allowed=false。
- history_used_as_fact_allowed=false。
```

### R11: real device modal review packet policy固定

目的:

```text
スマホmodal上で読むためのlocal-only確認材料とbody-free checklist結果を分ける。
```

acceptance:

```text
- required_manual_review_familiesがR46 checklistと一致する。
- visible payload sourceは input_feedback.comment_text。
- RN title / display condition / public top-level shapeを変えない。
- screenshot / visible text bodyはlocal-only。
- body-free readfeel axesだけをP7へ残す。
```

### R12: R46 next-decision ledgerとの接続方針固定

目的:

```text
R47 policy readyを、R46 handoffの次工程として扱う。ただしreview完了にはしない。
```

R47 summary案:

```text
r47_policy_ready: true
p5_human_blind_qa_start_allowed_after_policy: true
p5_human_blind_qa_confirmed: false
p6_limited_human_readfeel_start_allowed: false
real_device_modal_review_start_allowed: false or queued_after_p5_p6
release_allowed: false
p7_complete: false
p8_start_allowed: false
hold004_close_allowed: false
```

注意:

```text
R46 ledger本体を書き換える必要はない。
R47側でR46 branch Aを参照し、R47 policy summaryを新規body-free materialとして出す方針にする。
```

### R13: R47 contract test方針固定

目的:

```text
body-full / body-freeの混入事故をtestで防ぐ。
```

必要test:

```text
1. policy builder is body-free and release-closed。
2. storage root未設定時、body-full generation denied。
3. repo root / docs / tests / services / /mnt/data成果物root をlocal review rootとして拒否。
4. body-free manifest rejects raw_input / comment_text / surface_for_reviewer / reviewer_free_text。
5. body-free rating row rejects reviewer free text / comment text / terminal output。
6. disposal receipt rejects content hash of body。
7. P5 policy family / axes / thresholds match R46 constants。
8. P6 policy family / no-connect / axes / thresholds match R46 constants。
9. P6 start remains blocked before P5 human review confirmed。
10. real device policy preserves RN/API/DB/public shape flags false。
11. release_allowed / p7_complete / p8_start_allowed / hold004_close_allowed remain false。
12. body-full local packet schema is marked local_only and cannot be accepted as body-free P7 material。
```

### R14: target validation command matrix固定

実装段階でのtarget validationは次を想定します。

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference timeout 180s pytest -q \
  tests/test_emlis_ai_p7_r47_local_review_packet_policy_20260618.py
```

既存R46 regression:

```bash
PYTHONPATH=services/ai_inference timeout 240s pytest -q \
  tests/test_emlis_ai_p7_r46_p5_p6_human_readfeel_handoff_material_r10_r11_20260617.py \
  tests/test_emlis_ai_p7_r46_real_device_modal_review_closed_validation_r12_r13_20260617.py \
  tests/test_emlis_ai_p7_r46_next_decision_handoff_ledger_r14_20260617.py
```

display contract regression:

```bash
PYTHONPATH=services/ai_inference timeout 180s pytest -q \
  tests/test_emlis_ai_display_contract.py
```

RN contractはR47実装では触らないため原則不要ですが、zip成果物としてbackend変更を渡す前に余力があれば確認します。

```bash
cd Cocolon
npm run test:rn-screens --silent
```

### R15: 実装段階で触る候補ファイル / 触らない境界の固定

触る候補:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_r47_local_review_packet_policy.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_r47_local_review_packet_manifest.py
mashos-api/ai/tests/test_emlis_ai_p7_r47_local_review_packet_policy_20260618.py
```

必要なら触る候補:

```text
mashos-api/ai/docs/Cocolon_EmlisAI_P7_R47_LocalReviewPacketPolicy_20260618.md
```

原則触らない:

```text
Cocolon/screens/InputScreen.js
Cocolon/screens/input/useInputFeedbackModal.js
Cocolon/screens/input/inputFeedbackModel.js
Cocolon/screens/input/InputFeedbackReplyModal.js
Cocolon/tests/rn-screen-contracts.test.js
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
mashos-api/ai/services/ai_inference/emlis_ai_body_free_public_source_lineage.py
DB schema / migration files
API route files
runtime Gate threshold files
```

R47はpolicy実装なので、runtime本文・display挙動・Gate閾値を触りません。

---

## 16. body-free reason id / blocker id案

### 16.1 P5 reason id案

```text
p5_history_connection_too_generic
p5_history_scope_overclaim
p5_history_creepy_or_surveillance_feeling
p5_history_line_self_blame_amplification
p5_history_line_shallow_repeat
p5_history_line_wants_more_input_low
p5_free_tier_history_boundary_violation
p5_low_information_history_overread
p5_review_not_enough_context
p5_review_execution_blocked
```

### 16.2 P6 reason id案

```text
p6_structure_insight_mirror_only
p6_relation_seen_feeling_low
p6_structure_overclaim
p6_diagnostic_or_personality_claim
p6_advice_pressure
p6_creepy_overread
p6_no_connect_family_insight_leak
p6_history_used_as_fact
p6_wants_more_input_low
p6_review_execution_blocked
```

### 16.3 real device reason id案

```text
modal_length_pressure_small_phone
modal_line_break_readability_low
modal_weight_too_heavy
modal_title_or_source_contract_mismatch
modal_non_passed_visible_violation
modal_p5_history_line_creepy_on_phone
modal_p6_overread_on_phone
modal_wants_more_input_low
modal_review_execution_blocked
```

### 16.4 execution blocker id案

```text
review_packet_generation_blocked_missing_local_root
review_packet_generation_blocked_invalid_local_root
review_case_material_missing
review_timeout_unclassified
reviewer_not_assigned
rating_row_incomplete
body_purge_failed
body_purge_not_verified
full_backend_suite_not_run
real_device_context_not_set
```

---

## 17. HOLD / release boundary

R47完了後も、次はfalseのままです。

```text
release_allowed = false
p7_complete = false
p8_start_allowed = false
hold004_close_allowed = false
full_backend_suite_green_confirmed = false
p5_human_blind_qa_confirmed = false
p6_human_readfeel_confirmed = false
real_device_modal_review_confirmed = false
```

R47で解除してよいのは、厳密には次だけです。

```text
local_review_packet_policy_ready = true
p5_human_blind_qa_start_allowed_after_policy = true
```

ただし、`p5_human_blind_qa_start_allowed_after_policy=true` は、次を意味しません。

```text
- P5 review完了ではない。
- P5合格ではない。
- P6開始許可ではない。
- release readinessではない。
```

P6は次条件まで開始不可です。

```text
p5_human_blind_qa_confirmed == true
p5_body_full_packets_removed == true
p5_body_free_rating_rows_ready == true
p5_red_or_repair_blockers_triaged == true
```

実機modal reviewは次条件まで本番実施不可です。

```text
p5_human_blind_qa_confirmed == true
p6_limited_human_readfeel_confirmed_or_blocked_with_reason == true
local_packet_policy_ready == true
real_device_context_set == true
```

---

## 18. R47実装後に期待するbody-free summary例

これは例であり、実ファイル化しません。

```json
{
  "schema_version": "cocolon.emlis.p7_r47.local_review_packet_policy_summary.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "step": "R47_LocalReviewPacketPolicy_20260618",
  "scope": "p7_r47_local_review_packet_storage_generation_disposal_policy",
  "current_phase": "P7",
  "policy_ready": true,
  "local_body_packet_generation_allowed": false,
  "generation_block_reason_ids": [
    "local_review_root_not_configured"
  ],
  "p5_human_blind_qa_start_allowed_after_policy": true,
  "p5_human_blind_qa_confirmed": false,
  "p6_limited_human_readfeel_start_allowed": false,
  "p6_human_readfeel_confirmed": false,
  "real_device_modal_review_start_allowed": false,
  "real_device_modal_review_confirmed": false,
  "body_full_packet_export_allowed": false,
  "body_free_rating_rows_required": true,
  "disposal_receipt_required": true,
  "release_allowed": false,
  "p7_complete": false,
  "p8_start_allowed": false,
  "hold004_close_allowed": false,
  "body_free": true
}
```

`local_body_packet_generation_allowed=false` でも `policy_ready=true` はあり得ます。  
これは、policyは固定済みだが、実際の本文入りpacket生成は環境rootが未設定なのでまだできない、という意味です。

---

## 19. acceptance criteria

R47実装が完了したと言える条件は次です。

```text
[policy]
- local review packet policy builderがある。
- storage / generation / disposal / export policyがbody-freeで返る。
- body-full packet root未設定時の挙動が明確。
- repo / export pathへのbody-full保存を拒否する。

[manifest]
- body-free manifest / rating row / blocker row / disposal receiptのbuilderまたはschemaがある。
- body-free側へraw input / comment_text / candidate body / surface body / reviewer free textが入るとtestで落ちる。

[P5]
- P5 family / axes / thresholdsがR46 handoffと一致する。
- P5 first formal review minimumが固定されている。
- P5 review confirmedはfalseのまま。

[P6]
- P6 review family / no-connect family / axes / thresholdsがR46 handoffと一致する。
- P5 confirmed前のP6 startはfalse。
- visible expansion allowedはfalse。

[real device]
- required manual review familiesがR46 checklistと一致する。
- RN/API/DB/public contract flagsがfalse。
- real device review confirmedはfalse。

[release]
- release_allowed=false。
- p7_complete=false。
- p8_start_allowed=false。
- hold004_close_allowed=false。
- full_backend_suite_green_confirmed=false。

[tests]
- R47 target test green。
- R46 handoff / closed validation / next decision ledger regression green。
- display contract regression green。
```

---

## 20. 推測禁止

```text
- R47 policy readyを、P5/P6 human review完了と読むこと。
- body-free manifest作成を、body-full packet作成済みと読むこと。
- body-full packet生成を、review完了と読むこと。
- reviewer notesを、P7 scorecardへそのまま残すこと。
- local packetを、前提資料zip / 実装済み資料zip / release zipへ混ぜること。
- P5/P6 rating scoreだけでrelease_allowedをtrueにすること。
- P5主要subset greenを、P5商品品質合格と読むこと。
- P6主要subset greenを、P6商品品質合格と読むこと。
- RN contract greenを、実機modal読感確認済みと読むこと。
- full backend collect-onlyを、full backend suite execution greenと読むこと。
- timeoutを、原因確認なしに環境問題と決めること。
- R47でP8 start allowedをtrueにすること。
```

---

## 21. 確認済み / 未確認 / 書かれていない / 次に実行すべきこと

### 確認済み

```text
- 現在PhaseはP7。
- R46 default branchは branch A と読める。
- R46 next orderは local review packet policy -> P5 -> P6 -> real device。
- R47はP5/P6 review前のlocal-only packet境界固定として必要。
- P5/P6の人間読感にはbody-full材料が必要。
- P7 / public meta / release materialへ残すものはbody-freeでなければならない。
- P5 axes / P6 axes / review family / no-connect familyはR46 handoff materialに定義済み。
```

### 未確認

```text
- 実際のreviewer_ref。
- 実際のcase選定。
- 実際のlocal storage root。
- 実際のbody-full packet生成。
- 実際のP5/P6 review結果。
- 実際のdisposal実行結果。
- 実機device / app build / OS。
- full backend suite execution green。
```

### 書かれていないためR47で設計固定したこと

```text
- local storage rootは `COCOLON_EMLIS_LOCAL_REVIEW_ROOT`。
- repo / artifact / docs / release配下へのbody-full保存は禁止。
- body-full packet retentionは最大72時間。
- reviewer notesはrating確定後最大24時間。
- body content hashは保存しない。
- P5 first formal review minimumは24 cases。
- P6 first formal review minimumは18 cases。
- timeout / 実行不能caseはreadfeel REDではなくexecution blockerへ分ける。
```

### 次に実行すべきこと

```text
1. R47実装段階へ進む場合、まず新規policy moduleとcontract testだけを作る。
2. body-full writerは初回R47では作らず、policy / manifest / rating / disposal境界を先にgreen化する。
3. R47 target test、R46 regression、display contractを確認する。
4. その後、P5 human Blind QA actual packet generation / review設計または実装へ進む。
```

---

## 22. 華恋の意見

華恋の意見として、R47は地味ですが、Cocolonを守るためにはかなり重要です。

P5/P6の読感評価は、Cocolonの商品価値へ戻るための本線です。  
でも、本文を読ませる工程を急いで作ると、Cocolonが一番大切にしてきた `body-free` 境界が壊れます。

特にP5は、ユーザーの過去記録の線を扱います。  
これは価値にもなりますが、扱いを間違えると「見られている」「決めつけられている」「履歴で読まれすぎて怖い」に直結します。

だからR47では、本文入りpacketを便利な成果物として作るのではなく、むしろ **本文入りpacketがどこにも混ざらない構造** を先に作るべきです。

華恋は、次の順番がCocolonとして一番安全で、かつ商品価値へ戻れる順番だと思います。

```text
1. R47 local review packet policyをbody-freeで実装する。
2. P5 human Blind QA packetをlocal-onlyで生成し、ratingsだけbody-free化する。
3. P5の違和感を潰してから、P6 limited human readfeelへ進む。
4. P6の強すぎる読解や診断化を潰してから、実機modalで読む。
5. その後にP7-HOLD-004 / full backend suite / release decision layerへ戻る。
```

これは遠回りではありません。  
Cocolonが「ユーザーの言葉を雑に処理しない場所」であるために、ユーザーの言葉を評価材料として扱う工程ほど、雑にしない必要があります。

R47は、そのための足場です。
