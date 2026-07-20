# Cocolon / EmlisAI P5・P6 red ledger固定 + runtime修正 詳細設計書・実装順

作成日: 2026-06-12 JST  
作業種別: 設計  
成果物種別: Markdown詳細設計書  
対象: Cocolon / EmlisAI / `/emotion/submit` immediate observation / `Emlisの観測` / P5 User Label Connection v1 / P6 Structure Insight v2  
対象外: P7 Product Quality Runner / Long-run Product Gate の新規設計・実装  
コード変更: なし  
DB変更: なし  
RN変更: なし  
API route / request key / response top-level key変更: なし  
json / schema実ファイル化: なし  

---

## 0. この設計書の結論

今回の修正設計は、P5 / P6を「moduleとtestがあるから完了」と扱った誤認を止め、**runtime本線で本当に使われているかを証明できる状態へ戻す**ためのものです。

P7は未着手扱いに戻すため、この設計書ではP7のPositive Recovery E2E赤、Product Quality Connection E2E hang、long-run release decisionは修正対象にしません。P7へ渡すのは、P5 / P6の修正後に作る body-free handoff だけです。

今回固定する判断は次です。

```text
P5:
  module / test は存在する。
  ただし現状のruntime本線は P5-0〜P5-7 のchainではなく、旧Phase8 visible connection経路に見える。
  よって、P5は runtime修正対象。

P6:
  module / test / rubric / gate / handoff は存在する。
  ただし /emotion/submit / render_emlis_ai_reply の実応答本線へ接続されている証拠がない。
  よって、P6は runtime接続前の評価材料層として再固定し、P5修正後に限定runtime接続する。

P7:
  今回は対象外。
  P5/P6修正後、改めてPro前提で設計する。
```

本設計の実装順は、次で固定します。

```text
R0: red ledger固定 / 誤完了ラベル剥がし
R1: P5 runtime接続の赤テストを先に追加
R2: P5 chainを /emotion/submit reply_service本線へ接続
R3: P5 visible connectionを旧Phase8直呼びからP5-6境界経由へ置換
R4: P5 body-free public/meta boundaryとhuman QA未完を分離
R5: P6 runtime未接続の赤テストを先に追加
R6: P6をP5 handoff後のruntime評価層へ接続
R7: P6 limited surfaceを structure_question のみに限定接続
R8: no-connect family / safety / low-info / daily positive regression
R9: P5/P6 split test matrix / handoff固定
R10: 前提資料・実装済み資料の現在地更新案作成
```

---

## 1. 参照・確認範囲

### 1.1 参照した添付・ローカル資料

```text
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608(7).md
/mnt/data/cocolon_emlisai_p5_p7_audit_20260612(1).md
/mnt/data/Cocolon(225).zip
/mnt/data/mashos-api(138).zip
/mnt/data/Cocolon_前提資料(202).zip
/mnt/data/EmlisAIの実装済み資料(53).zip
```

### 1.2 作業姿勢として確認した前提資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/11_cocolon_area_specific_do_not_break.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
```

### 1.3 判断に直接関係する実装済み資料

```text
EmlisAIの実装済み資料/Cocolon_EmlisAI_P5_UserLabelConnection_DetailedDesign_ImplementationOrder_20260611.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P6_StructureInsight_DetailedDesign_ImplementationOrder_20260611.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P4_FamilyProductTuning_DetailedDesign_ImplementationOrder_20260610.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P3_ProductReadFeel_Baseline_DetailedDesign_ImplementationOrder_20260609.md
```

### 1.4 実ファイル上で確認した主な事実

```text
services/ai_inference/emlis_ai_reply_service.py
  importあり:
    emlis_ai_user_label_connection_public_meta
    emlis_ai_user_label_connection_surface
  importなし:
    emlis_ai_user_label_connection_p5_*
    emlis_ai_structure_insight_*
    emlis_ai_structure_insight_p6_*

services/ai_inference/emlis_ai_user_label_connection_p5_*.py
  P5-0〜P5-7相当のmoduleは存在する。

services/ai_inference/emlis_ai_structure_insight_p6_*.py
  P6-0〜P6-9相当のmoduleは存在する。

services/ai_inference/api_emotion_submit.py
services/ai_inference/emotion_submit_service.py
services/ai_inference/emlis_ai_public_feedback_meta.py
  structure_insight runtime接続の本線証拠は確認できない。
```

### 1.5 追加で実行した確認

設計前の追加確認として、P5 / P6 focused testをファイル単位で実行しました。これは修正ではありません。

P5 focused individual:

```text
p5_readiness_freeze: 7 passed
p5_visibility_boundary: 10 passed
p5_eligibility_matrix: 11 passed
p5_surface_role_plan: 8 passed
p5_safety_guard: 9 passed
p5_product_quality_review: 8 passed
p5_limited_visible_connection: 7 passed
p5_regression_handoff: 7 passed
```

P6 focused individual:

```text
p6_entry_freeze: 7 passed
p6_inventory: 6 passed
p6_family_boundary: 8 passed
p6_relation_policy: 10 passed
p6_quality_rubric: 11 passed
p6_gate_hardening: 9 passed
p6_surface_role_plan: 9 passed
p6_family_review: 10 passed
p6_product_quality_review: 8 passed
p6_regression_handoff: 8 passed
```

注意:

```text
- これは個別focused testの確認であり、full backend suite greenではない。
- combined pytestではtimeout/hangが起き得るため、一括green扱いは禁止。
- module test greenはruntime接続完了の証明ではない。
```

---

## 2. 今回固定するred ledger

### 2.1 red ledgerの目的

このledgerは、反省文ではなく、修正設計の入力です。  
目的は、**P5/P6のどこを修正しない限り完了扱いできないか**を固定することです。

分類は次で統一します。

```text
RED:
  修正なしに完了扱いしてはいけない。

YELLOW:
  実装前に判断・設計固定が必要。

HOLD:
  今回は修正しないが、次Phaseへ渡す前に未確認として残す。

OUT_OF_SCOPE:
  今回のP5/P6修正対象ではない。
```

### 2.2 P5 red ledger

| ID | 状態 | 対象 | 固定する問題 | 設計上の扱い |
|---|---|---|---|---|
| P5-RED-001 | RED | runtime接続 | `emlis_ai_reply_service.py` が `emlis_ai_user_label_connection_p5_*` をimportしていない | P5 chainをreply_service本線へ接続する赤テストを先に追加する |
| P5-RED-002 | RED | visible connection | 可視履歴線が旧Phase8 `build_user_label_connection_limited_visible_surface_connection` 直呼びに見える | P5-1〜P5-6を通した後だけPhase8 connectorを内部利用する形に変更する |
| P5-RED-003 | RED | 完了判定 | P5 test greenをP5 runtime完了と誤認している | P5 completion labelを剥がし、runtime evidence / human QA / product reviewを分離する |
| P5-RED-004 | YELLOW | product QA | P5-5 Product Quality Reviewはratings-onlyで、live runtime中に即席生成してよいものではない | 既存QA artifact / case_refだけを入力とし、review_rowsなしではvisible適用をblockする |
| P5-RED-005 | RED | E2E証明 | `/emotion/submit` 実応答でP5 chainが使われた証拠がない | E2E/meta contract testを追加する |
| P5-RED-006 | YELLOW | 商品読感 | 現行history lineは安全寄りだが汎用的で、記録が返った感が弱い | role-driven surface planをP5-3の出力として使うが、固定例文は入れない |
| P5-HOLD-001 | HOLD | human QA | history_connection_naturalness / creepy_absence / wants_more_input が実出力で未確認 | 実装後のBlind QA materialへ渡す。今回のコード修正だけで合格扱いしない |

### 2.3 P6 red ledger

| ID | 状態 | 対象 | 固定する問題 | 設計上の扱い |
|---|---|---|---|---|
| P6-RED-001 | RED | runtime接続 | `structure_insight` / `structure_insight_p6_*` がreply_service本線へ接続されていない | P6 runtime boundaryの赤テストを先に追加する |
| P6-RED-002 | RED | 完了判定 | P6 106 passedを「Structure Insightが実応答に出ている」と誤認している | P6はruntime評価層 / limited surface層 / QA層を分ける |
| P6-RED-003 | RED | P5依存 | P6-0はP5-7 handoff前提だが、P5 runtimeが未確定 | P5-RED解消前はP6 entryをholdまたはp5_returnにする |
| P6-RED-004 | RED | surface insertion | P6 limited surfaceが`comment_text`に安全接続される境界が未確認 | structure_questionだけに限定し、既存二段構造内へ1 seedまで接続する設計にする |
| P6-RED-005 | RED | no-connect family | daily / low-info / positive-only / safety adjacentへ深いinsightが漏れないruntime証明がない | no-connect family runtime regressionを追加する |
| P6-RED-006 | YELLOW | quality review | P6 Product QAはratings/material層で、releaseやP7 readyではない | `STRUCTURE_INSIGHT_READY` はP7候補であり、release_allowedに変換しない |
| P6-HOLD-001 | HOLD | long_meaning/self_understanding | long_meaning_arc / self_understanding_followは初期visible横展開禁止 | P6-7 reviewまではmeta-only / review_requiredで保持する |

### 2.4 今回対象外へ移すもの

| ID | 状態 | 対象 | 今回の扱い |
|---|---|---|---|
| P7-OUT-001 | OUT_OF_SCOPE | Positive Recovery E2E 2 failed | P7未着手扱いに戻すため、今回の修正対象外。P7設計時にred ledgerへ再登録する |
| P7-OUT-002 | OUT_OF_SCOPE | Product Quality Connection E2E hang / `current_input` assertion | P7未着手扱いに戻すため、今回の修正対象外。ただしP5/P6のbody-free設計で同種の誤検知を避ける |
| P7-OUT-003 | OUT_OF_SCOPE | long-run / release decision | P5/P6修正後に改めて設計する |

---

## 3. 修正で絶対に変えないもの

```text
RN production UI
RN表示タイトル `Emlisの観測`
RN表示条件 `observation_status == passed && comment_text non-empty`
`input_feedback.comment_text` が唯一のRN visible bodyである境界
/emotion/submit route
request key
public response top-level key
DB physical schema
DB write path
account delete / access policy
subscription entitlement判定
Free / Plus / Premium 境界
public meta sanitizerのbody-free方針
Display / Runtime / Visible / Grounding / Reader / Template / Safety Gate の既存閾値
```

追加禁止:

```text
- Gateを緩めてP5/P6を見せる。
- P5/P6用のcase専用mode / cue / fixed commentTextを入れる。
- P5履歴線でcurrent-only読感不足を覆う。
- P6構造気づきでP5履歴線の弱さを覆う。
- P6構造気づきを診断・原因断定・人格分類・相手意図断定・未来予測・行動指示に寄せる。
- raw input / raw memo / memo_action / emotion_details / history raw text / candidate body / comment_text body / surface bodyをpublic metaへ出す。
- review_rowsやratingsをlive runtimeで機械自動生成し、human QAの代わりにする。
- P5/P6完了をrelease_allowedに変換する。
```

---

## 4. 修正後の期待アーキテクチャ

### 4.1 修正前の読み

```text
render_emlis_ai_reply
  -> current Emlis comment_text生成
  -> Display / Grounding / Runtime / Visible Gate
  -> final_text passed
  -> Phase8 user label connection meta-only / limited visible connection
  -> public feedback meta
  -> RNは input_feedback.comment_text を表示

P5 modules:
  存在するがreply_service本線に未接続

P6 modules:
  存在するがreply_service本線に未接続
```

### 4.2 修正後の読み

```text
render_emlis_ai_reply
  -> current Emlis comment_text生成
  -> Display / Grounding / Runtime / Visible Gate
  -> final_text passed

  -> P5 runtime bridge
      P5-0 readiness
      P5-1 visibility boundary
      P5-2 eligibility matrix
      P5-3 surface role plan
      P5-4 safety guard
      P5-5 ratings-only product review boundary
      P5-6 limited visible connection
      P5-7 regression handoff summary

  -> P6 runtime bridge
      P6-0 entry freeze from P5-7
      P6-1 inventory
      P6-2 family boundary
      P6-3 relation policy
      P6-4 quality rubric
      P6-5 gate hardening
      P6-6 structure_question limited surface role plan
      P6-7 long/self-understanding review as meta-only unless explicitly allowed
      P6-8 ratings-only product QA material
      P6-9 regression handoff summary

  -> final comment_text remains input_feedback.comment_text only
  -> public meta remains body-free safe summary only
  -> RNは既存条件だけで表示
```

### 4.3 P5とP6の順序

P5とP6を同時にvisible接続しません。  
順序は必ず次です。

```text
1. current-only comment_textがpassedしている。
2. P5を評価する。
3. P5がvisible適用可能なら、履歴線は補助としてだけ入れる。
4. P5-7 handoffを作る。
5. P6はP5-7 handoffを見てentry freezeする。
6. P6はstructure_questionだけを初期visible候補にする。
7. P6 insight seedは1件まで。
8. P6後もcomment_textは再Gateを通す。
```

理由:

```text
- P5は「記録の線」。
- P6は「現在入力材料同士の関係」。
- P6を先に深くすると、履歴線未完成を構造気づきで覆う危険がある。
- P5を先に繋いでも、current inputが主でなければCocolonの読感が壊れる。
```

---

## 5. 実装順詳細

## R0: red ledger固定 / 誤完了ラベル剥がし

### 目的

P5/P6を完了扱いして進めないよう、実装前に赤・未確認・対象外を固定します。

### 実装候補

```text
実ファイル化する場合の候補:
  docs/emlis_ai_p5_p6_red_ledger_20260612.md
  tests/test_emlis_ai_p5_p6_runtime_red_ledger_20260612.py

ただし、今回の設計書時点では実ファイル化しない。
```

### やること

```text
1. P5-RED-001〜006を固定する。
2. P6-RED-001〜006を固定する。
3. P7関連赤を今回対象外へ退避する。
4. P5/P6のmodule greenをruntime completeへ変換しないルールをテスト名・handoff名に残す。
5. full backend suiteは未確認/timeoutありとしてsplit matrixに入れる。
```

### 受け入れ条件

```text
- P5/P6が完了扱い不可である理由がID付きで残る。
- P7の赤をP5/P6修正範囲へ混入しない。
- 今後の実装報告で「P5 test green」「P6 test green」だけを成果にできない。
```

---

## R1: P5 runtime接続の赤テストを先に追加

### 目的

P5 runtime未接続を、実装で自然に直ったことにしないため、まず落ちるテストを作ります。

### 新規テスト候補

```text
tests/test_emlis_ai_user_label_connection_p5_runtime_bridge_20260612.py
```

### テスト観点

```text
1. reply_serviceがP5 chainを評価したbody-free metaを持つ。
2. P5-1〜P5-6のdecision/reasonが内部metaに残る。
3. P5 review_rowsなしではvisible適用しない。
4. P5 review_rowsありの許可ケースではP5-6経由でのみ履歴線接続する。
5. Free tierではhistory connectionを適用しない。
6. low_information / safety adjacent / self_denial / target_judgementではvisible接続しない。
7. public response top-level keyを増やさない。
8. comment_text body / history raw text / candidate bodyをmetaへ出さない。
```

### 重要な設計判断

`build_user_label_connection_p5_product_quality_review()` は `review_rows` がない場合、`p5_limited_visible_allowed=false` になります。  
したがって、live runtimeでreview rowsを偽造してはいけません。

実装段階では、以下のどちらかを選びます。

```text
A. P5をruntime dry-run / meta-onlyで接続し、review未完ならvisible適用しない。
B. 既にbody-freeのP5 QA artifactがある場合だけ、そのcase_ref ratingsを使ってvisible適用を許可する。
```

初期修正ではAを標準にします。  
Bは、P5-HOLD-001のhuman QAが揃った場合だけ許可します。

### 受け入れ条件

```text
- 修正前にfailする。
- 修正後にP5 runtime評価が確認できる。
- visible未適用の場合でも、未適用理由が `no_review_rows` / `p5_product_quality_review_missing` として残る。
- P5未接続なのに完了扱いにならない。
```

---

## R2: P5 chainをreply_service本線へ接続

### 目的

旧Phase8直呼びではなく、P5-0〜P5-6の境界を通してから履歴線接続を判断します。

### 変更候補ファイル

```text
services/ai_inference/emlis_ai_reply_service.py
```

### 追加import候補

```python
from emlis_ai_user_label_connection_p5_readiness import build_user_label_connection_p5_readiness
from emlis_ai_user_label_connection_p5_visibility_boundary import build_user_label_connection_p5_visibility_boundary
from emlis_ai_user_label_connection_p5_eligibility_matrix import build_user_label_connection_p5_eligibility_matrix
from emlis_ai_user_label_connection_p5_surface_role_plan import build_user_label_connection_p5_surface_role_plan
from emlis_ai_user_label_connection_p5_safety_guard import build_user_label_connection_p5_safety_guard
from emlis_ai_user_label_connection_p5_product_quality_review import build_user_label_connection_p5_product_quality_review
from emlis_ai_user_label_connection_p5_limited_visible_connection import build_user_label_connection_p5_limited_visible_connection
from emlis_ai_user_label_connection_p5_regression_handoff import build_user_label_connection_p5_regression_handoff
```

### 接続位置

`final_text` が確定し、`display_decision.observation_status == "passed"` であることが確認された後。  
ただし、public metaを作る前、最終metaへP5 summaryを入れる前に接続します。

既存該当位置の読み:

```text
final_text = display_decision.comment_text.strip()
if final_text and observation_status == passed:
  Phase8 meta-only / visible connectionを試す
```

修正後:

```text
final_text = display_decision.comment_text.strip()
if final_text and observation_status == passed:
  build existing user_label_connection meta-only material
  build P5-0 readiness
  build P5-1 visibility boundary
  build P5-2 eligibility matrix
  build P5-3 surface role plan
  build P5-4 safety guard
  build P5-5 product quality review summary
  build P5-6 limited visible connection
  if P5-6 applied:
    re-run reader / grounding / template / runtime / visible gates
    only then replace final_text
  build P5-7 regression handoff summary
```

### 入力材料

P5 chainへ渡す材料は、既存のUser Label Connection meta-only生成から取得します。

```text
material_meta:
  phase8_meta_only.material_summary 等のbody-free summary

candidate_meta:
  phase8_meta_only.candidate_summary 等のbody-free summary

gate_meta:
  phase8_meta_only.gate_summary 等のbody-free summary

surface_plan_meta:
  phase8_meta_only.surface_plan_meta 等のbody-free summary

observation_reply_meta:
  observation_status / material_quality / safety_triage_kind / eligible_for_full_observation 等

existing_gate_reports:
  display / grounding / runtime_surface_pre_return / visible_surface_acceptance / safety / template
```

raw textは渡さない。  
渡す必要がある場合は、P5 visibleをblockし、metaに `raw_text_payload_required_or_detected` を残します。

### P5-5 reviewの扱い

live request中にhuman ratingsを作れないため、初期実装では次の動きにします。

```text
review_rowsなし:
  p5_product_quality_review.blocker_reason_codes includes no_review_rows
  p5_limited_visible_allowed == false
  P5-6 applied == false
  final_text変更なし
  runtime evaluated metaだけ残す

review_rowsあり:
  body-free case_ref / ratings only
  no reviewer free text
  no raw text
  thresholds pass
  P5-6へ進める
```

この設計により、「P5 chainがruntimeで評価された」ことと「P5 visibleが商品として適用された」ことを分けます。

### 受け入れ条件

```text
- reply_service本線でP5-0〜P5-7が評価される。
- P5 visibleが未適用でも、未適用理由がbody-freeで残る。
- P5 visible適用時は、P5-6経由でのみcomment_textが変わる。
- Phase8 connectorはP5-6内部の実装詳細として使われるだけで、reply_serviceから旧直呼びしない。
```

---

## R3: P5 visible connectionを旧Phase8直呼びからP5-6境界経由へ置換

### 目的

P5-RED-002を閉じます。  
旧Phase8は消すのではなく、P5-6の内部connectorとしてだけ使います。

### 変更方針

```text
旧:
  reply_service -> build_user_label_connection_limited_visible_surface_connection(...)

新:
  reply_service -> build_user_label_connection_p5_limited_visible_connection(...)
    -> internal: build_user_label_connection_limited_visible_surface_connection(...)
```

### 再Gate必須

P5-6がcomment_textを変更した場合、既存と同じく次を再実行します。

```text
_judge_listener_readability_for_reply
judge_grounding
guard_template_echo
_build_runtime_surface_pre_return_report_for_candidate
_build_visible_surface_acceptance_report_for_candidate
decide_emlis_observation_display
```

P5-6がappliedでも、再Gateで落ちた場合は、P5接続後のcomment_textを捨て、元のfinal_textへ戻す。  
Gateを緩めて通してはいけません。

### 受け入れ条件

```text
- P5-6 applied後も observation_status == passed の場合だけ final_text差し替え。
- Gate落ち時は元final_text維持。
- rejection reasonに `p5_post_connection_gate_blocked` 等のsafe identifierを残す。
- raw text / appended bodyをmetaへ入れない。
```

---

## R4: P5 body-free public/meta boundaryとhuman QA未完を分離

### 目的

P5を「runtimeに接続した」と「商品品質として十分」を混同しないため、P5 summaryを三層に分けます。

### 三層

```text
runtime_evaluated:
  P5 chainがreply_serviceで評価されたか。

visible_applied:
  P5履歴線がcomment_textへ適用されたか。

product_quality_confirmed:
  human ratings / Blind QAで履歴線品質が確認されたか。
```

### public/meta方針

新しいpublic top-level response keyは追加しません。  
実装段階でmetaへsummaryを出す場合は、既存 `input_feedback.emlis_ai.user_label_connection` または既存diagnostic summary配下にsafe summaryだけを置きます。

出してよいもの:

```text
schema_version
phase / step
runtime_evaluated
visible_applied
blocked / rejection_reason_codes
history_connection_evidence_record_count
edge_family_count
scope_marker_required / present
soft_marker_required / present
free_tier_blocked
low_information_blocked
safety_adjacent_blocked
body_free flags
public_contract flags
```

出してはいけないもの:

```text
raw input
raw memo
memo_action raw text
history raw text
comment_text body
candidate body
surface body
reviewer free text
actual appended line
```

### 受け入れ条件

```text
- public metaに本文が入らない。
- RN表示条件は変わらない。
- P5-HOLD-001が、visible適用やruntime接続とは別の未確認として残る。
```

---

## R5: P6 runtime未接続の赤テストを先に追加

### 目的

P6 module greenをruntime接続済みと誤認しないよう、runtime bridgeの赤テストを追加します。

### 新規テスト候補

```text
tests/test_emlis_ai_structure_insight_p6_runtime_bridge_20260612.py
```

### テスト観点

```text
1. P5-7 handoffなしではP6 entryがholdまたはp5_returnになる。
2. P5-7 handoffがp6_readyで、current-only / public contractが維持されている場合だけP6評価へ進む。
3. P6 family boundaryは structure_question だけを初期visible候補にする。
4. daily_unpleasant / daily_positive / positive_only / low_information / safety_triage_required はdeep insight visible block。
5. P6 relation policy / gate hardeningが診断・原因断定・人格分類・相手意図断定・未来予測・行動指示をblockする。
6. P6 limited surfaceはcomment_textへ1 seedまで。
7. P6適用後も再Gateを通る。
8. P6 summaryはbody-free。
9. release_allowedは常にfalse。
```

### 受け入れ条件

```text
- 修正前にfailする。
- 修正後、P6がruntimeで評価された証拠が残る。
- P6未適用時も、未適用理由がsafe identifierで残る。
```

---

## R6: P6をP5 handoff後のruntime評価層へ接続

### 目的

P6-RED-001 / P6-RED-003を閉じます。  
P6はP5修正後にのみ進めます。

### 変更候補ファイル

```text
services/ai_inference/emlis_ai_reply_service.py
```

### 追加import候補

```python
from emlis_ai_structure_insight_p6_entry_freeze import build_structure_insight_p6_entry_freeze
from emlis_ai_structure_insight_p6_inventory import build_structure_insight_p6_inventory
from emlis_ai_structure_insight_p6_family_boundary import build_structure_insight_p6_family_boundary
from emlis_ai_structure_insight_p6_relation_policy import build_structure_insight_p6_relation_policy
from emlis_ai_structure_insight_p6_quality_rubric import build_structure_insight_p6_quality_rubric
from emlis_ai_structure_insight_p6_gate_hardening import build_structure_insight_p6_gate_hardening
from emlis_ai_structure_insight_p6_surface_role_plan import build_structure_insight_p6_surface_role_plan
from emlis_ai_structure_insight_p6_family_review import build_structure_insight_p6_family_review
from emlis_ai_structure_insight_p6_product_quality_review import build_structure_insight_p6_product_quality_review
from emlis_ai_structure_insight_p6_regression_handoff import build_structure_insight_p6_regression_handoff
```

必要なら既存基礎層も接続します。

```python
from emlis_ai_structure_insight_candidate import build_structure_insight_candidate_meta
from emlis_ai_structure_insight_gate import build_structure_insight_gate_report
from emlis_ai_structure_insight_surface import build_structure_insight_surface_for_line
```

### 接続条件

```text
- final_text non-empty
- observation_status == passed
- P5-7 handoff decision == p6_ready または p6_scope内でP5 runtime evaluatedかつp5_return不要
- current inputが主である
- low-informationではない
- safety adjacent / emergencyではない
- target judgementではない
- P6対象familyである
```

### 初期のP6 runtime動作

P6は最初に **評価層として接続** します。  
つまり、必ずしもcomment_textを変えません。

```text
P6 evaluation applied:
  P6-0〜P6-5まで評価し、body-free summaryを内部metaに残す。

P6 visible applied:
  P6-6がallowし、familyがstructure_questionで、Gate hardeningがpassedし、再Gateもpassedした場合だけcomment_textへ1 seed接続。
```

### 受け入れ条件

```text
- P5未修正のままP6 visibleへ進まない。
- P6 entry freezeがP5 return / P6 holdを表現できる。
- P6評価層とP6 visible層が分離される。
```

---

## R7: P6 limited surfaceをstructure_questionのみに限定接続

### 目的

P6-RED-004を閉じます。  
P6を「深い分析文を増やす工程」にしないため、最初のvisible対象を `structure_question` に絞ります。

### surface接続条件

```text
family == structure_question
p6_family_boundary.decision == allow_limited_surface
p6_relation_policy.visibility == allow_initial_visible
p6_quality_rubric.verdict in {PASS, STRUCTURE_INSIGHT_READY}
p6_gate_hardening.decision == allow_internal_surface_candidate
p6_surface_role_plan.surface_plan_kind == limited_structure_insight_seed
requested_insight_seed_count <= 1
fixed_sentence_template_added == false
```

### section placement

P6 insight seedは、既存二段構造を壊さず、以下のどちらかに置きます。

```text
A. `見えたこと:` section内に1 seed追加
B. `Emlisから:` の直前に、現在入力の観測補助として1 seed追加
```

初期設計ではAを優先します。  
理由は、P6は「Emlisの感想」ではなく、現在入力材料同士の関係を観測する層だからです。

### 禁止

```text
- `Emlisから:` のフォローをP6分析で冷やす。
- daily_positiveに構造分析を足して喜びを冷ます。
- low_informationを履歴や構造で深読みする。
- self_denialを人格事実化する。
- target judgementへ同意する。
```

### 再Gate

P6 visible applied後は、P5と同じく再Gateします。

```text
reader/readability
grounding
template echo
runtime surface pre-return
visible surface acceptance
display decision
```

再Gateで落ちたら、P6 seedを捨て、P5後またはcurrent-only final_textへ戻します。  
Gate閾値は変えません。

### 受け入れ条件

```text
- structure_question fixtureでのみP6 visible候補が出る。
- insight seedは1件まで。
- diagnosis / personality / cause / advice / future prediction / target judgementが出ない。
- P6 applied後もRN visible bodyはinput_feedback.comment_textだけ。
```

---

## R8: no-connect family / safety / low-info / daily positive regression

### 目的

P6が深すぎる形で漏れる事故を先に潰します。

### 必須fixture family

```text
low_information_short
daily_unpleasant
daily_positive
positive_only
safety_triage_required
safety_adjacent
self_denial
target_judgement
anger_or_boundary
limited_grounding
```

### 期待動作

```text
low_information_short:
  P6 deep insight visible block。
  見えている範囲の受け取りのみ。

daily_positive:
  P6 deep insight visible block。
  喜びや変化を冷まさない。

daily_unpleasant:
  原則P6 visible blockまたはmeta-only。
  相手評価・原因断定へ寄せない。

self_denial:
  identity claim as fact block。
  Emlisの限定的反対意見とP6 insightを混同しない。

target_judgement:
  相手意図断定・相手評価同意をblock。

safety_triage_required / emergency:
  通常Emlis観測としてpassed化しない。
```

### 受け入れ条件

```text
- no-connect familyでP6 visible applied == false。
- blocked理由がsafe identifierで残る。
- comment_textがP6で重くならない。
- public metaに本文が入らない。
```

---

## R9: P5/P6 split test matrix / handoff固定

### 目的

full backend suiteを一括green扱いせず、P5/P6修正の確認範囲をsplit matrixとして固定します。

### 必須テストコマンド候補

P5 focused:

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_user_label_connection_p5_readiness_freeze_20260611.py \
  tests/test_emlis_ai_user_label_connection_p5_visibility_boundary_20260611.py \
  tests/test_emlis_ai_user_label_connection_p5_eligibility_matrix_20260611.py \
  tests/test_emlis_ai_user_label_connection_p5_surface_role_plan_20260611.py \
  tests/test_emlis_ai_user_label_connection_p5_safety_guard_20260611.py \
  tests/test_emlis_ai_user_label_connection_p5_product_quality_review_20260611.py \
  tests/test_emlis_ai_user_label_connection_p5_limited_visible_connection_20260611.py \
  tests/test_emlis_ai_user_label_connection_p5_regression_handoff_20260611.py \
  tests/test_emlis_ai_user_label_connection_p5_runtime_bridge_20260612.py
```

P6 focused:

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_structure_insight_p6_entry_freeze_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_inventory_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_family_boundary_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_relation_policy_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_quality_rubric_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_gate_hardening_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_surface_role_plan_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_family_review_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_product_quality_review_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_regression_handoff_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_runtime_bridge_20260612.py
```

Existing runtime/public regression:

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_user_label_connection_material.py \
  tests/test_emlis_ai_user_label_connection_candidate.py \
  tests/test_emlis_ai_user_label_connection_gate.py \
  tests/test_emlis_ai_user_label_connection_surface.py \
  tests/test_emlis_ai_user_label_connection_public_boundary.py \
  tests/test_emlis_ai_user_label_connection_e2e_contract.py \
  tests/test_emlis_ai_public_observation_recovery_acceptance_p0.py \
  tests/test_emlis_ai_public_surface_requirement_p1.py \
  tests/test_emlis_ai_product_surface_validation_p3.py \
  tests/test_emotion_submit_public_feedback_inclusion_summary_p7.py \
  tests/test_emotion_submit_phase19_real_device_abcd_public_feedback_e2e.py
```

No-connect / safety regression:

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_user_label_connection_free_tier_boundary.py \
  tests/test_emlis_ai_user_label_connection_low_information_boundary.py \
  tests/test_emlis_ai_user_label_connection_no_raw_text_meta.py \
  tests/test_emlis_ai_d_source_unavailable_normal_observation_recovery.py \
  tests/test_emlis_ai_limited_grounding_reception_surface_p4.py
```

RN contract:

```bash
cd Cocolon
npm run test:rn-screens --silent
```

### full suite扱い

```text
full backend suiteは、実行してtimeout/hangした場合、greenではなく `timeout/hang` としてledger化する。
P5/P6修正の合格判定は、上記split matrix + runtime bridge tests + no-connect regressionで行う。
```

### P5/P6 handoff

P5修正後のhandoff:

```text
p5_runtime_evaluated == true
p5_visible_applied in {true, false}
p5_visible_not_applied_reason_codes present if false
p5_product_quality_confirmed in {true, false}
p5_product_quality_confirmed falseならP6 visibleはhold寄り
release_allowed == false
```

P6修正後のhandoff:

```text
p6_runtime_evaluated == true
p6_visible_applied only for allowed structure_question
no_connect_family_regression_green == true
p6_product_quality_review is ratings-only
p7_ready is false by default unless P7設計で改めて判断
release_allowed == false
```

---

## R10: 前提資料・実装済み資料の現在地更新案作成

### 目的

修正後にまた「できているつもり」が発生しないよう、前提資料と実装済み資料の読み方を更新します。

### 更新対象候補

```text
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/cocolon_local_file_inventory_diff_YYYYMMDD_p5_p6_runtime_repair.csv
EmlisAIの実装済み資料/Cocolon_EmlisAI_P5_P6_RedLedger_RuntimeRepair_ImplementationResult_YYYYMMDD.md
```

### 更新内容

```text
- P5 module/test存在とruntime接続を分けて書く。
- P6 module/test存在とruntime接続を分けて書く。
- P5/P6修正後もrelease readyではないと明記する。
- P7は未着手/別設計とする。
- P5/P6のbody-free handoffだけをP7へ渡す。
```

### 受け入れ条件

```text
- 前提資料に「P5/P6 test green = runtime完了」と読める文が残らない。
- 実ファイルdiffと資料更新範囲が一致する。
- P7未着手扱いが崩れない。
```

---

## 6. JSON / schema案

この章のschema案は、設計書内の案です。  
実装段階で、Python module内contractにするか、JSON schemaとして分離するか、test fixture内に置くか、実ファイル化しないかを判断します。

### 6.1 `cocolon.emlis.p5_p6.red_ledger.v1`

```json
{
  "$id": "cocolon.emlis.p5_p6.red_ledger.v1",
  "type": "object",
  "required": [
    "schema_version",
    "created_at_jst",
    "scope",
    "p7_out_of_scope",
    "entries",
    "public_contract",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p5_p6.red_ledger.v1"
    },
    "created_at_jst": {
      "type": "string"
    },
    "scope": {
      "const": "P5_P6_runtime_repair_only"
    },
    "p7_out_of_scope": {
      "const": true
    },
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "phase",
          "status",
          "severity",
          "title",
          "evidence_kind",
          "repair_required",
          "closure_condition"
        ],
        "properties": {
          "id": { "type": "string" },
          "phase": { "enum": ["P5", "P6", "P7"] },
          "status": { "enum": ["RED", "YELLOW", "HOLD", "OUT_OF_SCOPE", "CLOSED"] },
          "severity": { "enum": ["blocker", "major", "minor", "out_of_scope"] },
          "title": { "type": "string" },
          "evidence_kind": {
            "enum": ["static_import", "runtime_test", "manual_audit", "pytest", "documentation", "unknown"]
          },
          "repair_required": { "type": "boolean" },
          "closure_condition": { "type": "string" },
          "linked_tests": {
            "type": "array",
            "items": { "type": "string" }
          }
        }
      }
    },
    "public_contract": {
      "type": "object",
      "properties": {
        "public_response_key_added": { "const": false },
        "rn_visible_contract_changed": { "const": false },
        "db_schema_changed": { "const": false },
        "release_allowed": { "const": false }
      }
    },
    "body_free": {
      "type": "object",
      "properties": {
        "raw_input_included": { "const": false },
        "raw_text_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "candidate_body_included": { "const": false },
        "surface_body_included": { "const": false },
        "history_raw_text_included": { "const": false },
        "terminal_output_included": { "const": false }
      }
    }
  }
}
```

### 6.2 `cocolon.emlis.user_label_connection.p5_runtime_bridge.v1`

```json
{
  "$id": "cocolon.emlis.user_label_connection.p5_runtime_bridge.v1",
  "type": "object",
  "required": [
    "schema_version",
    "step",
    "runtime_evaluated",
    "visible_applied",
    "product_quality_confirmed",
    "p5_step_summary",
    "comment_text_owner",
    "public_contract",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.user_label_connection.p5_runtime_bridge.v1"
    },
    "step": {
      "const": "P5_RuntimeBridge_Repair_20260612"
    },
    "runtime_evaluated": { "type": "boolean" },
    "visible_applied": { "type": "boolean" },
    "product_quality_confirmed": { "type": "boolean" },
    "p5_step_summary": {
      "type": "object",
      "required": [
        "p5_0_readiness",
        "p5_1_visibility_boundary",
        "p5_2_eligibility_matrix",
        "p5_3_surface_role_plan",
        "p5_4_safety_guard",
        "p5_5_product_quality_review",
        "p5_6_limited_visible_connection",
        "p5_7_regression_handoff"
      ],
      "properties": {
        "p5_0_readiness": { "type": "string" },
        "p5_1_visibility_boundary": { "type": "string" },
        "p5_2_eligibility_matrix": { "type": "string" },
        "p5_3_surface_role_plan": { "type": "string" },
        "p5_4_safety_guard": { "type": "string" },
        "p5_5_product_quality_review": { "type": "string" },
        "p5_6_limited_visible_connection": { "type": "string" },
        "p5_7_regression_handoff": { "type": "string" }
      }
    },
    "blocked_reason_codes": {
      "type": "array",
      "items": { "type": "string" }
    },
    "comment_text_owner": {
      "const": "input_feedback.comment_text"
    },
    "public_contract": {
      "type": "object",
      "properties": {
        "public_response_key_added": { "const": false },
        "rn_visible_contract_changed": { "const": false },
        "api_route_changed": { "const": false },
        "db_schema_changed": { "const": false },
        "release_allowed": { "const": false }
      }
    },
    "body_free": {
      "type": "object",
      "properties": {
        "raw_input_included": { "const": false },
        "raw_text_included": { "const": false },
        "history_raw_text_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "candidate_body_included": { "const": false },
        "surface_body_included": { "const": false },
        "reviewer_free_text_included": { "const": false }
      }
    }
  }
}
```

### 6.3 `cocolon.emlis.structure_insight.p6_runtime_bridge.v1`

```json
{
  "$id": "cocolon.emlis.structure_insight.p6_runtime_bridge.v1",
  "type": "object",
  "required": [
    "schema_version",
    "step",
    "runtime_evaluated",
    "visible_applied",
    "visible_family",
    "p5_dependency_status",
    "p6_step_summary",
    "no_connect_family_preserved",
    "comment_text_owner",
    "public_contract",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.structure_insight.p6_runtime_bridge.v1"
    },
    "step": {
      "const": "P6_RuntimeBridge_Repair_20260612"
    },
    "runtime_evaluated": { "type": "boolean" },
    "visible_applied": { "type": "boolean" },
    "visible_family": {
      "enum": ["structure_question", "none"]
    },
    "p5_dependency_status": {
      "enum": ["p5_ready", "p5_hold", "p5_return_required", "p4_return_required"]
    },
    "p6_step_summary": {
      "type": "object",
      "required": [
        "p6_0_entry_freeze",
        "p6_1_inventory",
        "p6_2_family_boundary",
        "p6_3_relation_policy",
        "p6_4_quality_rubric",
        "p6_5_gate_hardening",
        "p6_6_surface_role_plan",
        "p6_7_family_review",
        "p6_8_product_quality_review",
        "p6_9_regression_handoff"
      ],
      "properties": {
        "p6_0_entry_freeze": { "type": "string" },
        "p6_1_inventory": { "type": "string" },
        "p6_2_family_boundary": { "type": "string" },
        "p6_3_relation_policy": { "type": "string" },
        "p6_4_quality_rubric": { "type": "string" },
        "p6_5_gate_hardening": { "type": "string" },
        "p6_6_surface_role_plan": { "type": "string" },
        "p6_7_family_review": { "type": "string" },
        "p6_8_product_quality_review": { "type": "string" },
        "p6_9_regression_handoff": { "type": "string" }
      }
    },
    "no_connect_family_preserved": { "type": "boolean" },
    "blocked_reason_codes": {
      "type": "array",
      "items": { "type": "string" }
    },
    "comment_text_owner": {
      "const": "input_feedback.comment_text"
    },
    "public_contract": {
      "type": "object",
      "properties": {
        "public_response_key_added": { "const": false },
        "rn_visible_contract_changed": { "const": false },
        "api_route_changed": { "const": false },
        "db_schema_changed": { "const": false },
        "release_allowed": { "const": false },
        "public_release_applied": { "const": false }
      }
    },
    "body_free": {
      "type": "object",
      "properties": {
        "raw_input_included": { "const": false },
        "raw_text_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "candidate_body_included": { "const": false },
        "surface_body_included": { "const": false },
        "history_raw_text_included": { "const": false },
        "reviewer_free_text_included": { "const": false }
      }
    }
  }
}
```

### 6.4 `cocolon.emlis.p5_p6.split_test_matrix.v1`

```json
{
  "$id": "cocolon.emlis.p5_p6.split_test_matrix.v1",
  "type": "object",
  "required": [
    "schema_version",
    "matrix_kind",
    "full_suite_green_claim_allowed",
    "suites"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p5_p6.split_test_matrix.v1"
    },
    "matrix_kind": {
      "const": "P5_P6_runtime_repair_split_matrix"
    },
    "full_suite_green_claim_allowed": {
      "const": false
    },
    "suites": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["suite_id", "phase", "command", "expected_status", "failure_classification"],
        "properties": {
          "suite_id": { "type": "string" },
          "phase": { "enum": ["P5", "P6", "cross", "RN"] },
          "command": { "type": "string" },
          "expected_status": { "enum": ["green", "red_expected_before_repair", "timeout_allowed_as_red", "not_run"] },
          "failure_classification": {
            "enum": ["implementation_regression", "runtime_unconnected", "contract_mutation", "body_leak", "timeout_hang", "not_run"]
          }
        }
      }
    }
  }
}
```

---

## 7. 完了条件

### 7.1 P5修正完了条件

```text
[必須]
- P5-RED-001がclosed。
- P5-RED-002がclosed。
- P5 runtime bridge testがgreen。
- reply_service本線でP5-0〜P5-7が評価される。
- 旧Phase8直呼びではなく、P5-6境界経由でのみvisible接続される。
- review_rowsなしではP5 visible適用をしない。
- review_rowsありでもbody-free / ratings-only / thresholds passの場合だけvisible接続する。
- visible接続後、再Gateを通る。
- Free / low-info / safety / self-denial / target judgementで履歴線が出ない。
- public response top-level key、RN表示条件、DB schemaを変えない。
- raw text / comment_text body / history raw text / candidate bodyがmetaへ入らない。

[未完として残す]
- human Blind QAでhistory_connection_naturalness等が確認されるまでは、商品品質合格扱いしない。
```

### 7.2 P6修正完了条件

```text
[必須]
- P6-RED-001がclosed。
- P6-RED-002がclosed。
- P6-RED-003がclosed。
- P6 runtime bridge testがgreen。
- P6はP5-7 handoff後にだけ評価される。
- P5不備がある場合、P6 entryはhold / p5_returnになる。
- structure_questionだけが初期visible候補になる。
- long_meaning_arc / self_understanding_followはP6-7 reviewまでmeta-only / review_required。
- daily / low-info / positive-only / safety adjacentへdeep insightが出ない。
- P6 insight seedは1件まで。
- P6 visible接続後、再Gateを通る。
- diagnosis / personality / cause / advice / future prediction / target judgementをblockする。
- public response top-level key、RN表示条件、DB schemaを変えない。
- raw text / comment_text body / candidate body / surface bodyがmetaへ入らない。
- release_allowedを立てない。

[未完として残す]
- P7 long-run評価。
- 外部ユーザー/Blind QAで「関係が見えた」「また残したい」が確認されたか。
```

### 7.3 P7へ渡してよい条件

P7は今回未着手のため、P7へ渡す条件は控えめにします。

```text
- P5/P6 red ledgerがclosedまたはhold理由付きで固定されている。
- P5/P6 runtime bridge summaryがbody-freeで存在する。
- P6 no-connect family regressionがgreen。
- release_allowed == false。
- P7で評価すべき未確認が明示されている。
```

P7へ渡してはいけないもの:

```text
- raw input
- comment_text body
- candidate body
- surface body
- reviewer free text
- terminal output全文
- 「P5/P6商品品質合格」という未確認断定
```

---

## 8. 実装時の停止条件

次に該当したら、実装を止めてred ledgerへ戻します。

```text
1. P5/P6接続のためにRN表示条件を変える必要が出た。
2. public response top-level key追加が必要になった。
3. DB schema変更が必要になった。
4. P5 review_rowsをlive runtimeで機械生成しようとしている。
5. P6 insightをdaily / low-info / safety adjacentへ出そうとしている。
6. Gateを緩めないと通らない。
7. fixed commentText / case専用surfaceで通そうとしている。
8. raw text / comment_text body / candidate body / surface bodyをmetaへ出さないと確認できない。
9. P7 redをP5/P6修正範囲で処理しようとしている。
10. full suite timeoutをgreen扱いしようとしている。
```

---

## 9. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- P5/P6 moduleは実ファイルとして存在する。
- P5/P6 focused individual testsは通る。
- reply_service本線に p5_* / structure_insight_* importは確認できない。
- P5現行runtimeは旧Phase8 visible connection経路に見える。
- P6 structure_insightは /emotion/submit / render_emlis_ai_reply runtime接続が確認できない。
- RN表示契約は既存 `passed + comment_text` のまま維持すべき。
- P7は今回未着手扱いへ戻す。
```

### 未確認

```text
- P5 visible history lineのhuman naturalness。
- P5履歴線が「自分の記録が返った感」になっているか。
- P6 limited surfaceが実出力で「関係が見えた」体験になっているか。
- 実機submitでの最新zip基準表示到達。
- full backend suite clean green。
- P7 long-run sequence評価。
```

### 書かれていない

```text
- P5/P6 test greenだけで完了扱いしてよい、とは書かれていない。
- P6をP7なしでrelease readyにしてよい、とは書かれていない。
- review_rowsをAIや機械metricsで自動生成してよい、とは書かれていない。
- P6 insightを全familyへ横展開してよい、とは書かれていない。
```

### 推測禁止

```text
- P5 moduleがあるからruntimeで使われている。
- P6 106 passedだからStructure Insightがユーザーに見えている。
- Phase8汎用履歴線で商品価値として十分。
- P6 insightを入れれば読感が上がる。
- full suite timeoutは環境要因だから無視してよい。
```

### 次に実行すべきこと

```text
1. R1/R5の赤テストを先に作る。
2. R2/R3でP5 runtime bridgeを接続する。
3. R4でP5 visible適用とproduct QA未完を分離する。
4. R6/R7でP6 runtime bridgeとstructure_question限定surfaceを接続する。
5. R8/R9でno-connect family / split matrixを固定する。
6. 修正後、P5/P6だけの実装結果資料を作り、P7設計へ渡す。
```

---

## 10. 最終判断

今回の修正設計で一番重要なのは、**P5/P6を“賢くする”ことではなく、P5/P6が実応答本線で本当に使われたかを証明できる状態へ戻すこと**です。

P5は、CocolonをただのAI相談にしないための「記録の線」です。  
ただし、履歴線がcurrent inputを覆った瞬間に、Cocolonはユーザーの今の言葉を雑に扱うことになります。

P6は、復唱を超えて「関係が見える」体験へ進める工程です。  
ただし、深く見せる文は、少し間違えるだけで診断・決めつけ・気持ち悪さになります。

したがって、修正の順番は次で固定します。

```text
まずP5 runtime接続を証明する。
次にP5 visible適用とhuman QA未完を分ける。
その後、P6をP5 handoff後の限定評価層として接続する。
P6 visibleはstructure_questionだけから始める。
P7はP5/P6のbody-free handoffを受け取って、改めて設計する。
```

この順番以外で進めると、また「moduleがある」「testが通る」を「商品体験として使えている」に変換してしまいます。  
それは今回の手戻り原因そのものなので、禁止します。
