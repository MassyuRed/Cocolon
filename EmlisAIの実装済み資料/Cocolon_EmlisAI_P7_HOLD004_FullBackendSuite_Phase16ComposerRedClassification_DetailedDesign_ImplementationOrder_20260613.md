# Cocolon / EmlisAI P7-HOLD-004 Full Backend Suite Phase16 Composer Red Classification 詳細設計書・実装順

作成日: 2026-06-13 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / Long-run Product Gate / P7-HOLD-004 / Full Backend Suite / Phase16 Complete Composer Two-Stage Surface Connection  
GitHub接続確認: 不要。Mash様指定により未実施。  
コード変更: なし。本書は設計書。  
DB変更: なし。  
RN変更: なし。  
API route / request key / public response top-level key変更: なし。  
JSON / schema実ファイル化: しない。本書内のschema案は実装段階で採否判断する。  
release_allowed: false固定。  
p8_start_allowed: false固定。  

---

## 0. 結論

次に進める実装対象は、次です。

```text
P7-HOLD-004:
  full backend suite green未確認の切り分け

今回の具体対象:
  Phase16 Complete Composer Two-Stage Surface Connection red

設計名:
  P7-HOLD-004 Full Backend Suite Phase16 Composer Red Classification
```

今回の赤は、単純な「二段surface生成失敗」ではありません。  
現行zipで確認した限り、Complete Composer direct pathでは `status=unavailable` になりますが、内部診断では二段surface自体は次を満たしています。

```text
two_stage_surface_realization.required: true
two_stage_surface_realization.applied: true
two_stage_surface_realization.labels_present: true
section_line_counts:
  observation: 1
  reception: 2
validation_errors in two_stage_surface_realization: []
daily_unpleasant_surface_quality_applied: true
mode_specific_surface_policy_applied: true
```

直接の停止理由は、surface構造の欠落ではなく、次です。

```text
Complete Composer response:
  status: unavailable
  primary_reason: complete_initial_surface_unavailable

surface_realizer:
  status: ready
  ready property: false
  validation_errors:
    - tone_guard:ending_family_repetition

phase17 reason codes:
  - phase17_surface_mode_policy_missing
  - phase17_product_visible_fixture_not_reached

self repair handoff reason codes:
  - phase17_surface_mode_policy_missing
  - template_like
```

したがって、実装ではまず次を分けます。

```text
A. two-stage section / label / comment_text shape が本当に欠けている赤
B. two-stage surfaceは作れているが、tone/display品質Gateがcandidate generation前に混ざっている赤
C. public emotion_submit pathでは回復できており、direct path test期待だけが古い赤
D. public pathでもsafe入力が沈黙・非labelled化する赤
```

現時点の華恋の判断は、**Bが第一候補**です。  
理由は、Phase18設計で `candidate_generated == true` と `public reply.comment_text == ""` を分ける方針が既に存在し、候補生成と表示判定を分離する方向になっているためです。

ただし、いきなり修正しません。  
次実装では、まずP7-HOLD-004の中に、このPhase16赤をbody-freeで分類する材料を作ります。  
そのうえで、最小修復またはcontract置換へ進みます。

---

## 1. この作業を行う理由

CocolonにとってEmlisAIは、入力直後にユーザーの言葉を「読まれた形」として返す入口です。  
P7は、その入口が商品品質として安定しているかを継続測定する工程です。

今回の赤を雑に扱うと、次のどちらかの事故になります。

```text
事故1:
  safeでeligibleな入力を、内部都合でunavailableへ落としたままにする。

事故2:
  tone / display品質で止めるべき候補を、generatedという言葉だけでpublic表示可能と誤認する。

事故3:
  public pathで回復できているから、internal candidate pathの契約崩れを見なかったことにする。

事故4:
  古いtest期待を絶対視して、後続Phaseのfail-closed / recovery設計を壊す。
```

Cocolonとして守る中心は、次です。

```text
読めていないものを、読めた形で返さない。
しかし、読めるはずのsafe入力を、内部分類やGate混線のためにunavailableへ落としたままにしない。
```

今回の設計は、testを通すためではありません。  
どの層が `unavailable` のownerなのかを分け、P7-HOLD-004を「full suite未確認」という曖昧な箱から、「どの赤がどこにあるか分かる状態」へ進めるためです。

---

## 2. 参照した資料・実ファイル

### 2.1 受領ローカルファイル

```text
/mnt/data/Cocolon_前提資料(211).zip
/mnt/data/EmlisAIの実装済み資料(59).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608(11).md
/mnt/data/Cocolon(230).zip
/mnt/data/mashos-api(143).zip
/mnt/data/Cocolon_EmlisAI_P7_HOLD004_FullBackendSuite_PreDesign_ConsiderationMemo_20260613.md
```

### 2.2 作業姿勢として確認した前提資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/07_latest_snapshot_diff.md
```

保持する姿勢は次です。

```text
- 未確認断定しない。
- 見ていないファイルを見たように言わない。
- 設計と実装を混同しない。
- pytest green / fixture green / RN contract greenを商品品質合格へ変換しない。
- EmlisAIをGateに通ったものだけ表示する許可装置にしない。
- case専用mode / cue / surface / fixed commentTextを足さない。
- raw input / comment_text body / candidate body / surface bodyをpublic metaやrelease materialへ流さない。
- Mash様から見えにくいbackend internal-only領域ほど雑にしない。
```

### 2.3 ロードマップ上の位置

```text
現在Phase:
  P7 Product Quality Runner / Long-run Product Gate

進める対象:
  P7-HOLD-004 full backend suite green未確認の切り分け

進めない対象:
  P8 Personal Continuity / Derived User Model
  P9 External Pilot
  P10 Release Readiness
```

P7の役割は、商品品質を継続測定することであり、release_allowedを立てることではありません。  
P8はユーザー辞書・価値anchorの長期運用段階なので、P7-HOLD-004が未分類のままでは進みません。

### 2.4 今回直接確認した主な実ファイル

```text
mashos-api/ai/tests/test_emlis_ai_complete_composer_two_stage_surface_connection.py
mashos-api/ai/tests/test_emotion_submit_two_stage_reception_e2e.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_composer_client.py
mashos-api/ai/services/ai_inference/emlis_ai_conversation_composer_service.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py
mashos-api/ai/services/ai_inference/emlis_ai_two_stage_section_surface_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_self_repair_service.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_red_closure_classification.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
```

---

## 3. 現状確認結果

### 3.1 検討メモ時点の確認結果

検討メモで固定されている確認結果は次です。

```text
R13 related minimum subset:
  40 passed

RN contract:
  36 passed

P7 core + R6〜R11 subset:
  72 passed

Product Quality reuse subset:
  31 passed

backend full suite collect-only:
  2604 tests collected

backend full suite maxfail=1:
  1 failed, 246 passed, 2 skipped, 4 warnings

first failure:
  tests/test_emlis_ai_complete_composer_two_stage_surface_connection.py

該当test file単体:
  2 failed
```

### 3.2 本設計書作成時の追加再確認

現行zipで、該当test file単体を再実行しました。

```bash
cd /mnt/data/cocolon_p7_hold004_design_work_20260613/mashos_api_zip/mashos-api/ai
export PYTHONPATH=services/ai_inference
pytest -q --tb=short tests/test_emlis_ai_complete_composer_two_stage_surface_connection.py
```

結果:

```text
2 failed in 2.91s

failed:
  test_phase16_6_complete_composer_direct_output_reaches_labelled_two_stage_text
  test_phase16_6_conversation_composer_path_reaches_labelled_two_stage_text

expected:
  generated

actual:
  unavailable
```

### 3.3 direct generate診断

同一fixture familyで、`CocolonCompleteComposerClient(ap0_green=True, rollout_allowed=True).generate(payload)` を直接確認しました。

確認結果:

```text
result.status:
  unavailable

result.composer_source:
  unavailable

composer_meta.primary_reason:
  complete_initial_surface_unavailable

composer_meta.phase17_7_unavailable_reason_codes:
  - phase17_surface_mode_policy_missing
  - phase17_product_visible_fixture_not_reached

composer_meta.phase17_7_self_repair_handoff_reason_codes:
  - phase17_surface_mode_policy_missing
  - template_like
```

重要なのは、二段surfaceの診断が次を満たしていた点です。

```text
surface_realizer.status:
  ready

surface_realizer.ready property:
  false

surface_realizer.validation_errors:
  - tone_guard:ending_family_repetition

two_stage_surface_realization:
  required: true
  applied: true
  labels_present: true
  observation_section_non_empty: true
  reception_section_non_empty: true
  section_line_counts:
    observation: 1
    reception: 2
  validation_errors: []
  daily_unpleasant_surface_quality_applied: true
  daily_unpleasant_surface_quality_forbidden_hits: []
  two_stage_mode_specific_surface_applied: true
  phase20_6_generic_sentence_surface_applied: false
```

読み:

```text
二段section / label / shapeの生成そのものは成立している。
しかし tone_guard が CompleteSurfaceRealization.ready を false にし、
CompleteComposerClient が candidate生成前に unavailable を返している。
```

### 3.4 public emotion_submit daily path確認

同じ `daily_unpleasant_encounter_A` familyのpublic path相当testを単体で確認しました。

```bash
pytest -q --tb=short \
  tests/test_emotion_submit_two_stage_reception_e2e.py::test_phase16_8_emotion_submit_path_returns_public_two_stage_input_feedback
```

結果:

```text
1 passed, 1 warning
```

読み:

```text
少なくとも daily_unpleasant_encounter_A の public emotion_submit path は、
現行zipでも labelled two-stage input_feedback へ到達している。
```

したがって、今回の最初の赤は、現時点では「ユーザー表示daily pathが沈黙している赤」とは読まない。  
ただし、Complete Composer direct / Conversation Composer pathが `unavailable` になる状態は、P7測定・candidate path contractとして未分類のまま残せません。

### 3.5 public two-stage fixture suiteの隣接赤

`tests/test_emotion_submit_two_stage_reception_e2e.py` 全体を実行すると、別fixtureで1件赤を確認しました。

```text
5 passed / 1 failed / 1 warning

failed fixture family:
  positive_change_after_work_streaming

赤の形:
  public input_feedback は存在するが、expected labelled two-stage shapeではない。
```

この赤は、本書の主対象である `daily_unpleasant_encounter_A` direct/conversation path赤とは分けます。  
ただし、R2のpath matrixでは隣接public path赤としてbody-freeに登録します。  
実装時に、これを同じ修正で雑に塞いではいけません。

---

## 4. 赤の正体仮説

### 4.1 旧仮説

検討メモ段階では、主に次が疑われていました。

```text
surface mode policy missing による Complete Composer二段surface生成不可。
```

### 4.2 設計書時点の補正

追加診断により、より正確には次です。

```text
two-stage surfaceは生成できている。
labelsもsectionも揃っている。
ただし tone_guard:ending_family_repetition が surface validation_errors に入り、
CompleteSurfaceRealization.ready が false になり、
CompleteComposerClient が candidate生成前に unavailable を返している。
```

つまり、赤の中心は次です。

```text
candidate generation readiness と display/tone quality readiness の境界混線
```

### 4.3 classification候補

| 分類 | 内容 | 現時点の評価 |
|---|---|---|
| `implementation_regression` | Phase18で分離したはずのcandidate generationとdisplay/tone判定が、surface.readyで再結合している | 第一候補 |
| `stale_contract_expectation` | 後続Phaseでdirect Complete Composerはtone_guard時にunavailableでよい契約になった | 第二候補。ただしPhase18設計とはやや不整合 |
| `metadata_summary_gap` | unavailable responseでstate_answer / two_stage plan metaがtop-levelに残らず、診断が深い階層に潜る | 補助赤候補 |
| `public_recovery_layer_expected` | public pathが本線で、direct pathはpublic回復前の失敗を許容する | daily_A単体ではあり得るが、P7測定契約としては未分類のまま不可 |
| `surface_mode_policy_missing` | surface policy自体がない | 低い。mode policyはapplied=trueを確認済み |
| `two_stage_section_plan_missing` | section planがlineへ伝搬していない | 低い。section count / label / appliedを確認済み |

---

## 5. IN SCOPE / OUT OF SCOPE

### 5.1 IN SCOPE

```text
1. P7-HOLD-004内で、Phase16 Complete Composer redをbody-free分類する。

2. direct path / conversation path / public emotion_submit path / recovery pathを分ける。

3. two-stage surface生成失敗と、tone/display readiness混線を分ける。

4. stale contract expectationかimplementation regressionかを判断する材料を作る。

5. implementation regressionの場合、candidate generationとdisplay/tone readinessの境界を最小修復する。

6. stale contractの場合、旧direct generated期待を現行contractへ置換する。

7. P7 hold matrix / validation matrix / release handoffへ、HOLD-004 classified unresolvedとして渡す。

8. full backend suiteを分割して次の赤へ進めるためのmatrixを作る。
```

### 5.2 OUT OF SCOPE

```text
- P8 Derived User Model / Personal Continuity
- P9 External Pilot
- P10 Release Readiness
- release_allowed true化
- p8_start_allowed true化
- RN UI変更
- RN表示条件変更
- API route変更
- request key変更
- public response top-level key追加
- DB schema / write path変更
- fixed commentText追加
- case専用mode / cue / surface追加
- Gate / Display / Grounding / Template / Tone の閾値緩和
- public metaへraw input / comment_text body / candidate body / surface bodyを出すこと
- full backend suite greenの捏造
```

---

## 6. 設計方針

### 6.1 body-free分類を先に作る

P7-HOLD-004の赤分類材料は、次のみを持ちます。

```text
- test file id
- test case id
- path id
- observed status
- expected status kind
- owner layer
- reason codes
- validation error codes
- boolean flags
- counts
- public contract flags
- body-free markers
```

次は持ちません。

```text
- raw input body
- memo / memo_action body
- comment_text body
- candidate body
- surface body
- terminal output全文
- reviewer free text
```

### 6.2 `generated` と `public display allowed` を混同しない

今回の候補修復では、次を分けます。

```text
candidate_generated_before_display_gate:
  Complete Composerが内部候補を作れたか。

candidate_status_before_display_gate:
  generated / unavailable / schema_invalid など。

candidate_status_after_internal_gate:
  generated / rejected など。

display_ready:
  public表示に進める品質か。

public_comment_text_present:
  public responseへcomment_textが載るか。
```

`generated` に戻す場合でも、public表示を許可するとは限りません。  
`tone_guard:ending_family_repetition` が残るなら、public側はrejected / repair / recoveryへ回してよいです。

### 6.3 two-stage構造赤とtone赤を分ける

```text
two_stage structural red:
  - section missing
  - label missing
  - section order invalid
  - observation/reception body empty
  - forbidden skeleton leak

surface quality / tone red:
  - ending family repetition
  - template_like
  - tone guard major
  - surface mode policy repair target
```

前者はComplete Composer candidate生成不可でよい場合があります。  
後者は、candidate生成済みだがdisplay不可・repair対象として扱う余地があります。

### 6.4 public path passを理由にinternal赤を捨てない

`daily_unpleasant_encounter_A` のpublic pathが通っていることは重要です。  
ただし、それでdirect path赤を捨てません。

P7測定では、次のように読む必要があります。

```text
public path:
  user-facing recoveryとして成立しているか。

direct / conversation path:
  Complete Composer candidate generation contractとして成立しているか。

release / P8判断:
  どちらか一方のgreenだけでは不可。
```

---

## 7. 実装順

## R0: Baseline freeze / 再現固定

### 目的

実装修正前に、今回の赤をbody-freeで再現固定します。

### 対象

```text
tests/test_emlis_ai_complete_composer_two_stage_surface_connection.py
CocolonCompleteComposerClient.generate(...)
compose_emlis_conversation_candidate(...)
tests/test_emotion_submit_two_stage_reception_e2e.py::test_phase16_8_...
```

### 作業

```text
1. target test file 2 failedを固定する。
2. direct generateのreason code / validation error / two_stage flagsを固定する。
3. public daily emotion_submit pathがpassすることを固定する。
4. public full fixture suiteの隣接赤を別行として記録する。
5. terminal出力全文ではなく、件数・test id・reason codeのみ残す。
```

### 完了条件

```text
- Phase16赤が再現済みである。
- two-stage surface applied=trueとtone_guard由来のready=falseが分かれている。
- public daily path passが分かれている。
- raw body / comment_text bodyを分類材料に入れていない。
```

### 実装時の追加test候補

```text
mashos-api/ai/tests/test_emlis_ai_p7_hold004_phase16_baseline_freeze_20260613.py
```

このtestは、赤を閉じるためではなく、分類材料がbody-freeで作れることを確認します。

---

## R1: P7-HOLD-004 Phase16 red classification material追加

### 目的

P7-HOLD-004の中に、Phase16 Complete Composer redをclassified unresolvedとして登録できる材料を作ります。

### 新規module候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_phase16_composer_classification.py
```

### 新規test候補

```text
mashos-api/ai/tests/test_emlis_ai_p7_hold004_phase16_composer_classification_20260613.py
```

### 関数候補

```python
build_p7_hold004_phase16_composer_observation(...)
classify_p7_hold004_phase16_composer_red(...)
build_p7_hold004_phase16_composer_classification(...)
assert_p7_hold004_phase16_composer_classification_contract(...)
```

### owner_layer候補

```text
complete_composer_candidate_boundary
complete_surface_realizer_tone_boundary
two_stage_surface_structural_boundary
phase17_self_repair_handoff_boundary
public_recovery_layer
stale_contract_expectation
metadata_summary_boundary
unknown
```

### classification候補

```text
candidate_readiness_display_gate_boundary_mixed
tone_guard_surface_readiness_regression
two_stage_surface_structural_failure
public_recovery_expected_direct_contract_stale
metadata_summary_gap
classified_unresolved
closed_after_repair
```

### 完了条件

```text
- status=CLASSIFIED_UNRESOLVED を表現できる。
- release_allowed=false。
- p8_start_allowed=false。
- body_free=true。
- comment_text_body / candidate_body / surface_body / raw_input を含まない。
- classificationだけでP7-HOLD-004を閉じない。
```

---

## R2: path matrix追加

### 目的

同じfamily / fixture群が、どのpathで失敗し、どのpathでpublic到達しているかを分けます。

### 新規module候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_path_matrix.py
```

またはR1 module内に含めます。  
実装段階では、ファイル増加が過剰ならR1 moduleへ統合します。

### path_id候補

```text
complete_composer_direct_daily_unpleasant_A
conversation_composer_daily_unpleasant_A
emotion_submit_public_daily_unpleasant_A
emotion_submit_public_product_visible_fixture_suite
complete_initial_recomposition_subset
limited_grounding_public_repair_subset
p7_core_subset
product_quality_reuse_subset
full_backend_suite_maxfail1
```

### rowに持つ情報

```text
path_id
test_ref
fixture_family
observed_status
expected_contract_status
public_reached
labelled_two_stage_reached
candidate_generated_before_display_gate
surface_structural_ready
surface_display_ready
owner_layer
reason_codes
validation_error_codes
red_refs
hold_refs
body_free flags
```

### 完了条件

```text
- direct / conversation pathがunavailableであることを分けて持てる。
- public daily pathがpassであることを分けて持てる。
- public full fixture suiteの隣接赤を別rowで持てる。
- path間の差をrelease readyに変換しない。
```

---

## R3: decision rule固定

### 目的

実装修正へ入る前に、今回の赤をどの分類で扱うかを決めます。

### 判定ルール

#### implementation regression とする条件

```text
以下をすべて満たす場合:

1. two_stage_surface_realization.applied == true
2. labels_present == true
3. section validation_errors == []
4. comment_text shape materialは作れている
5. unavailable理由が tone_guard / template_like / surface_mode_policy_missing 系
6. Phase18のcandidate generation / display gate分離方針と矛盾する

=> candidate_readiness_display_gate_boundary_mixed と分類する。
```

#### stale contract expectation とする条件

```text
以下を満たす場合:

1. 後続設計で、tone_guard major時はComplete Composer direct pathが
   candidate生成前にunavailableでよいと明記されている。
2. public emotion_submit recoveryのみが商品本線で、direct generated契約は廃止と確認できる。
3. direct testをgenerated期待で残すことが、Gate / Recovery設計を壊す。

=> public_recovery_expected_direct_contract_stale と分類する。
```

#### structural failure とする条件

```text
以下のいずれかがある場合:

- labels_present == false
- observation / reception section missing
- section order invalid
- two_stage validation_errorsあり
- daily_unpleasant forbidden surface hitあり

=> two_stage_surface_structural_failure と分類する。
```

### 現時点の暫定判定

```text
classification:
  candidate_readiness_display_gate_boundary_mixed

owner_layer:
  complete_surface_realizer_tone_boundary
  complete_composer_candidate_boundary

repair direction:
  candidate生成とdisplay/tone readinessを再分離する。
```

### 完了条件

```text
- 修正する場合とtest置換する場合の分岐条件が明示されている。
- generatedをpublic表示許可に誤変換していない。
- unavailableを安全成功扱いしていない。
```

---

## R4-A: implementation regressionの場合の最小修復

### 目的

two-stage surfaceが構造的に生成できている場合、tone/display品質の赤でcandidate generationそのものを `unavailable` にしないようにします。  
ただしpublic表示Gateは緩めません。

### 変更候補ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_complete_composer_client.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_self_repair_service.py
```

### 修正方針

現在の流れは概ね次です。

```text
surface_realization = build_complete_surface_realization_v2(...)
if not surface_realization.ready:
    return unavailable
```

ここを、次のように分類してから扱います。

```text
surface_structural_ready:
  surface statusがready相当で、two_stage section / label / body / structural validationが通っている。

surface_display_quality_blocked:
  tone_guard / template_like / ending repetition / surface mode policy repair targetがある。

candidate_generation_allowed_before_display_gate:
  surface_structural_ready == true
  and surface_display_quality_blocked may be true
  and safety / AP0 / rollout / evidence / material / section structural failure is false
```

疑似コード案:

```python
surface_meta = surface_realization.as_meta(include_realized_text=False)
classification = classify_complete_surface_readiness_for_candidate_path(surface_meta)

if classification["structural_ready"] is False:
    return _unavailable_response(
        "complete_initial_surface_unavailable",
        coverage_scope=coverage_group,
        extra_meta={...body_free_summary...},
    )

if classification["candidate_generation_allowed_before_display_gate"] is True:
    # continue to candidate creation
    # display_ready may be false
    # public comment_text is not assigned here
    pass
```

### 禁止

```text
- tone_guardを消す。
- ending repetitionを無視してpublic表示させる。
- display_readyをtrueにするためにGateを緩める。
- fixed sentenceでvariationだけを変える。
- case_id branchでdaily_Aだけ通す。
```

### 必須meta

```text
candidate_generated_before_display_gate: true
candidate_status_before_display_gate: generated
candidate_status_after_internal_gate: rejected または generated
complete_initial_internal_tone_guard_failed_before_display_gate: true/false
surface_display_quality_blocked_before_display_gate: true/false
surface_structural_ready_before_display_gate: true
public_comment_text_assigned: false
comment_text_publicly_assigned: false
display_gate_relaxed: false
grounding_gate_relaxed: false
```

### 完了条件

```text
- direct Complete Composer pathが generated へ戻る。
- Conversation Composer pathが generated へ戻る。
- two_stage_surface_realization.applied == true を維持する。
- comment_text bodyはcomposer_metaへ入れない。
- public response shapeを変えない。
- tone/display blockerはbody-free reasonとして残る。
- public daily emotion_submit pathは引き続きpass。
```

---

## R4-B: stale contract expectationの場合の置換設計

### 目的

もし現行設計としてdirect Complete Composerはtone_guard時に `unavailable` でよいと確認された場合、旧Phase16 test期待を現行contractへ置換します。

### 変更候補

```text
mashos-api/ai/tests/test_emlis_ai_complete_composer_two_stage_surface_connection.py
```

または、新規P7-HOLD-004分類testへ移行し、旧testを削除せず期待を書き換えます。

### 置換後に守ること

```text
- direct path unavailable理由がbody-freeに説明される。
- two_stage surface applied / tone blocker / public recovery path が区別される。
- public emotion_submit safe daily pathがlabelled two-stageへ到達する。
- public pathが沈黙しないことを別testで守る。
- generatedを要求しない代わりに、unavailableを成功扱いしない。
```

### 完了条件

```text
- stale expectationとしての根拠が設計資料または実装コメントに明示されている。
- public pathの契約testが残る。
- P7-HOLD-004は閉じず、classified unresolvedまたはpartial classifiedになる。
```

---

## R5: metadata summary gap修復

### 目的

unavailable responseでも、Phase16/17の必要なbody-free診断がtop-level composer_metaで読めるようにします。

現状、surface_unavailable時に、`state_answer_two_stage_display_required` 等がtop-levelに残らず、深い `surface_realizer` metaを見ないと判断できない場合があります。

### 変更候補ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_complete_composer_client.py
```

### 追加するbody-free meta候補

```text
state_answer_two_stage_display_required
state_answer_section_labels_required
state_answer_expected_comment_text_shape
two_stage_section_surface_plan_connected
two_stage_section_surface_plan_required
two_stage_section_surface_plan_section_ids
two_stage_surface_realization_required
two_stage_surface_realization_applied
two_stage_surface_structural_ready
surface_display_quality_blocked_before_display_gate
```

### 禁止

```text
- comment_textをmetaへ入れない。
- surface_textをmetaへ入れない。
- raw inputをmetaへ入れない。
- public response keyを追加しない。
```

### 完了条件

```text
- P7分類moduleが深いbodyに依存せず、summaryだけで分類できる。
- body-free guardが通る。
```

---

## R6: public path adjacent redの分離登録

### 目的

`tests/test_emotion_submit_two_stage_reception_e2e.py` 全体で見える別fixture赤を、今回のdirect daily redと混ぜないようにします。

### 扱い

```text
primary target:
  daily_unpleasant_encounter_A direct / conversation path unavailable

adjacent red:
  positive_change_after_work_streaming public path labelled two-stage expectation mismatch
```

### 実装方針

```text
1. R2 path matrixへadjacent rowとして登録する。
2. 今回のR4-A修復で偶然通ったとしても、closure claimしない。
3. 別途public product-visible fixture redとして次のP7-HOLD-004分割対象に回す。
```

### 完了条件

```text
- daily_A direct red修復と、positive public shape redが分けて見える。
- full backend suite greenを主張しない。
```

---

## R7: P7 hold matrix / validation matrix / release handoff連携

### 目的

P7-HOLD-004を「未確認」から「classified redあり」に進めます。  
ただし、P7-HOLD-004を閉じません。

### 変更候補ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
```

### 連携方針

```text
build_p7_backend_suite_split_matrix(...)
  に hold004_phase16_classification を optional inputとして追加検討。

build_p7_validation_regression_matrix(...)
  に hold004_path_matrix を optional inputとして追加検討。

build_p7_release_decision_handoff(...)
  に unresolved_hold_refs / required_followup_fixes / release_blockers として反映。
```

### 重要

既存の `emlis_ai_p7_red_closure_classification.py` は、P7-RED-001〜003のclosure matrixです。  
今回のPhase16赤は、初期P7-RED-003とは別であり、P7-HOLD-004内のfull suite red分類として扱うのが安全です。

### 完了条件

```text
- P7-HOLD-004 remains unresolved。
- full_backend_suite_green_confirmed == false。
- split_green_can_close_p7_hold004 == false。
- release_allowed == false。
- p8_start_allowed == false。
- required_followup_fixes に phase16_complete_composer_candidate_boundary が入る。
```

---

## R8: regression suite確認

### 目的

修正またはcontract置換後に、既存のP7 / R13 / RN contractを壊していないことを確認します。

### 最小確認コマンド

```bash
cd mashos-api/ai
export PYTHONPATH=services/ai_inference

pytest -q --tb=short \
  tests/test_emlis_ai_p7_hold004_phase16_composer_classification_20260613.py

pytest -q --tb=short \
  tests/test_emlis_ai_complete_composer_two_stage_surface_connection.py

pytest -q --tb=short \
  tests/test_emotion_submit_two_stage_reception_e2e.py::test_phase16_8_emotion_submit_path_returns_public_two_stage_input_feedback
```

### R13 related subset維持

```bash
pytest -q --tb=short \
  tests/test_emlis_ai_p7_body_free_leak_guard_contract_20260613.py \
  tests/test_emlis_ai_p7_body_free_leak_guard_20260613.py \
  tests/test_emlis_ai_complete_product_quality_connection_e2e.py \
  tests/test_emlis_ai_p7_connection_e2e_timeout_isolation_20260613.py \
  tests/test_emlis_ai_p7_red_closure_classification_matrix_20260613.py \
  tests/test_emlis_ai_p7_release_handoff_20260612.py \
  tests/test_emlis_ai_p7_validation_matrix_20260612.py \
  tests/test_emlis_ai_p7_r11_release_validation_final_alignment_20260613.py
```

### P7 core + R6〜R11 subset維持

```bash
pytest -q --tb=short \
  tests/test_emlis_ai_p7_handoff_normalizer_20260612.py \
  tests/test_emlis_ai_p7_red_ledger_20260612.py \
  tests/test_emlis_ai_p7_module_inventory_20260612.py \
  tests/test_emlis_ai_p7_runner_plan_20260612.py \
  tests/test_emlis_ai_p7_event_bridge_20260612.py \
  tests/test_emlis_ai_p7_evaluation_matrix_20260612.py \
  tests/test_emlis_ai_p7_blind_qa_material_20260612.py \
  tests/test_emlis_ai_p7_long_run_gate_handoff_20260612.py \
  tests/test_emlis_ai_p7_release_handoff_20260612.py \
  tests/test_emlis_ai_p7_validation_matrix_20260612.py \
  tests/test_emlis_ai_p7_connection_e2e_timeout_isolation_20260613.py \
  tests/test_emlis_ai_p7_red_closure_classification_matrix_20260613.py \
  tests/test_emlis_ai_p7_r8_human_qa_material_boundary_20260613.py \
  tests/test_emlis_ai_p7_r9_p6_visible_expansion_boundary_20260613.py \
  tests/test_emlis_ai_p7_r10_real_device_full_backend_hold_matrix_20260613.py \
  tests/test_emlis_ai_p7_r11_release_validation_final_alignment_20260613.py
```

### RN contract維持

```bash
cd Cocolon
npm run test:rn-screens --silent
```

### full suite次赤確認

```bash
cd mashos-api/ai
export PYTHONPATH=services/ai_inference
timeout 120s pytest -q --tb=short --maxfail=1
```

### 完了条件

```text
- target redがgreenまたはclassified replacement greenになる。
- public daily pathが壊れない。
- R13 related subsetがgreen。
- P7 core subsetがgreen。
- Product Quality reuse subsetがgreen。
- RN contractがgreen。
- full suiteは、次の赤が出れば次のP7-HOLD-004分割対象として扱う。
- full suite greenでなければP7-HOLD-004は閉じない。
```

---

## R9: 実装結果document / handoff更新

### 目的

実装後、何を閉じ、何を残すかを明確にします。

### 成果物候補

```text
mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_Phase16ComposerRedClassification_ImplementationResult_20260613.md
```

### 書くこと

```text
確認済み:
  - 対象赤の再現
  - 分類結果
  - 修正またはcontract置換内容
  - test結果

未確認:
  - full backend suite全赤一覧
  - 実機submit / modal読感
  - P5 human QA

書かれていない:
  - P7 complete
  - P8 start allowed
  - release allowed

推測禁止:
  - target file greenだけでfull backend suite green扱いしない
  - public daily path passだけでComplete Composer direct赤を消さない
```

---

## 8. JSON / schema案

このsectionのschemaは、設計上の案です。  
実装段階で、単一moduleに入れるか、既存P7 hold matrixへ統合するかを判断します。  
現段階では実ファイル化しません。

### 8.1 `p7_hold004_phase16_composer_classification.v1` schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7.hold004.phase16_composer_classification.v1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "phase",
    "hold_id",
    "classification_id",
    "status",
    "classification",
    "owner_layers",
    "source_test_refs",
    "path_statuses",
    "two_stage_surface_summary",
    "surface_quality_summary",
    "decision",
    "release_allowed",
    "p8_start_allowed",
    "body_free",
    "public_contract",
    "body_free_markers"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7.hold004.phase16_composer_classification.v1"
    },
    "phase": {
      "const": "P7_ProductQualityRunner_LongRunGate"
    },
    "hold_id": {
      "const": "P7-HOLD-004"
    },
    "classification_id": {
      "type": "string",
      "pattern": "^p7_hold004_phase16_complete_composer_[a-z0-9_]+$"
    },
    "status": {
      "enum": [
        "CLASSIFIED_UNRESOLVED",
        "IMPLEMENTATION_REPAIR_REQUIRED",
        "STALE_CONTRACT_REPLACEMENT_REQUIRED",
        "REPAIRED_PENDING_REGRESSION",
        "CLASSIFIED_CLOSED_FOR_TARGET_ONLY"
      ]
    },
    "classification": {
      "enum": [
        "candidate_readiness_display_gate_boundary_mixed",
        "tone_guard_surface_readiness_regression",
        "two_stage_surface_structural_failure",
        "public_recovery_expected_direct_contract_stale",
        "metadata_summary_gap",
        "classified_unresolved"
      ]
    },
    "owner_layers": {
      "type": "array",
      "items": {
        "enum": [
          "complete_composer_candidate_boundary",
          "complete_surface_realizer_tone_boundary",
          "two_stage_surface_structural_boundary",
          "phase17_self_repair_handoff_boundary",
          "public_recovery_layer",
          "stale_contract_expectation",
          "metadata_summary_boundary",
          "unknown"
        ]
      },
      "uniqueItems": true
    },
    "source_test_refs": {
      "type": "array",
      "items": { "type": "string", "maxLength": 220 },
      "uniqueItems": true
    },
    "path_statuses": {
      "type": "array",
      "items": { "$ref": "#/$defs/path_status" }
    },
    "two_stage_surface_summary": {
      "$ref": "#/$defs/two_stage_surface_summary"
    },
    "surface_quality_summary": {
      "$ref": "#/$defs/surface_quality_summary"
    },
    "decision": {
      "$ref": "#/$defs/decision"
    },
    "release_allowed": { "const": false },
    "p8_start_allowed": { "const": false },
    "body_free": { "const": true },
    "public_contract": { "$ref": "#/$defs/public_contract" },
    "body_free_markers": { "$ref": "#/$defs/body_free_markers" }
  },
  "$defs": {
    "path_status": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "path_id",
        "observed_status",
        "expected_status_kind",
        "public_reached",
        "labelled_two_stage_reached",
        "candidate_generated_before_display_gate",
        "reason_codes"
      ],
      "properties": {
        "path_id": { "type": "string", "maxLength": 160 },
        "observed_status": {
          "enum": [
            "generated",
            "unavailable",
            "passed",
            "failed",
            "public_feedback_labelled",
            "public_feedback_unlabelled",
            "not_run",
            "blocked"
          ]
        },
        "expected_status_kind": { "type": "string", "maxLength": 160 },
        "public_reached": { "type": "boolean" },
        "labelled_two_stage_reached": { "type": "boolean" },
        "candidate_generated_before_display_gate": { "type": "boolean" },
        "reason_codes": {
          "type": "array",
          "items": { "type": "string", "maxLength": 160 },
          "uniqueItems": true
        }
      }
    },
    "two_stage_surface_summary": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "required",
        "applied",
        "labels_present",
        "section_order_valid",
        "observation_section_non_empty",
        "reception_section_non_empty",
        "validation_error_codes",
        "comment_text_body_included",
        "raw_input_included"
      ],
      "properties": {
        "required": { "type": "boolean" },
        "applied": { "type": "boolean" },
        "labels_present": { "type": "boolean" },
        "section_order_valid": { "type": "boolean" },
        "observation_section_non_empty": { "type": "boolean" },
        "reception_section_non_empty": { "type": "boolean" },
        "section_line_counts": {
          "type": "object",
          "additionalProperties": { "type": "integer", "minimum": 0 }
        },
        "validation_error_codes": {
          "type": "array",
          "items": { "type": "string", "maxLength": 160 },
          "uniqueItems": true
        },
        "comment_text_body_included": { "const": false },
        "raw_input_included": { "const": false }
      }
    },
    "surface_quality_summary": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "surface_status",
        "surface_ready",
        "surface_structural_ready",
        "surface_display_quality_blocked",
        "validation_error_codes",
        "phase17_reason_codes",
        "self_repair_handoff_reason_codes",
        "gate_relaxed"
      ],
      "properties": {
        "surface_status": { "type": "string", "maxLength": 80 },
        "surface_ready": { "type": "boolean" },
        "surface_structural_ready": { "type": "boolean" },
        "surface_display_quality_blocked": { "type": "boolean" },
        "validation_error_codes": {
          "type": "array",
          "items": { "type": "string", "maxLength": 160 },
          "uniqueItems": true
        },
        "phase17_reason_codes": {
          "type": "array",
          "items": { "type": "string", "maxLength": 160 },
          "uniqueItems": true
        },
        "self_repair_handoff_reason_codes": {
          "type": "array",
          "items": { "type": "string", "maxLength": 160 },
          "uniqueItems": true
        },
        "gate_relaxed": { "const": false }
      }
    },
    "decision": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "decision_kind",
        "repair_branch",
        "full_suite_green_claim_allowed",
        "hold004_close_allowed"
      ],
      "properties": {
        "decision_kind": {
          "enum": [
            "repair_candidate_display_boundary",
            "replace_stale_direct_contract",
            "structural_repair_required",
            "classification_only"
          ]
        },
        "repair_branch": {
          "enum": ["R4-A", "R4-B", "R4-structural", "none"]
        },
        "full_suite_green_claim_allowed": { "const": false },
        "hold004_close_allowed": { "const": false }
      }
    },
    "public_contract": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "api_route_changed",
        "public_response_key_added",
        "rn_visible_contract_changed",
        "db_schema_changed",
        "release_allowed"
      ],
      "properties": {
        "api_route_changed": { "const": false },
        "public_response_key_added": { "const": false },
        "rn_visible_contract_changed": { "const": false },
        "db_schema_changed": { "const": false },
        "release_allowed": { "const": false }
      }
    },
    "body_free_markers": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "raw_input_included",
        "comment_text_body_included",
        "candidate_body_included",
        "surface_body_included",
        "terminal_output_body_included",
        "reviewer_free_text_included"
      ],
      "properties": {
        "raw_input_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "candidate_body_included": { "const": false },
        "surface_body_included": { "const": false },
        "terminal_output_body_included": { "const": false },
        "reviewer_free_text_included": { "const": false }
      }
    }
  }
}
```

### 8.2 sample object案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.phase16_composer_classification.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "hold_id": "P7-HOLD-004",
  "classification_id": "p7_hold004_phase16_complete_composer_daily_unpleasant_A",
  "status": "IMPLEMENTATION_REPAIR_REQUIRED",
  "classification": "candidate_readiness_display_gate_boundary_mixed",
  "owner_layers": [
    "complete_surface_realizer_tone_boundary",
    "complete_composer_candidate_boundary"
  ],
  "source_test_refs": [
    "tests/test_emlis_ai_complete_composer_two_stage_surface_connection.py",
    "tests/test_emotion_submit_two_stage_reception_e2e.py::test_phase16_8_emotion_submit_path_returns_public_two_stage_input_feedback"
  ],
  "path_statuses": [
    {
      "path_id": "complete_composer_direct_daily_unpleasant_A",
      "observed_status": "unavailable",
      "expected_status_kind": "generated_candidate_before_display_gate",
      "public_reached": false,
      "labelled_two_stage_reached": false,
      "candidate_generated_before_display_gate": false,
      "reason_codes": [
        "complete_initial_surface_unavailable",
        "phase17_surface_mode_policy_missing",
        "template_like"
      ]
    },
    {
      "path_id": "emotion_submit_public_daily_unpleasant_A",
      "observed_status": "public_feedback_labelled",
      "expected_status_kind": "public_labelled_two_stage_input_feedback",
      "public_reached": true,
      "labelled_two_stage_reached": true,
      "candidate_generated_before_display_gate": false,
      "reason_codes": []
    }
  ],
  "two_stage_surface_summary": {
    "required": true,
    "applied": true,
    "labels_present": true,
    "section_order_valid": true,
    "observation_section_non_empty": true,
    "reception_section_non_empty": true,
    "section_line_counts": {
      "observation": 1,
      "reception": 2
    },
    "validation_error_codes": [],
    "comment_text_body_included": false,
    "raw_input_included": false
  },
  "surface_quality_summary": {
    "surface_status": "ready",
    "surface_ready": false,
    "surface_structural_ready": true,
    "surface_display_quality_blocked": true,
    "validation_error_codes": [
      "tone_guard:ending_family_repetition"
    ],
    "phase17_reason_codes": [
      "phase17_surface_mode_policy_missing",
      "phase17_product_visible_fixture_not_reached"
    ],
    "self_repair_handoff_reason_codes": [
      "phase17_surface_mode_policy_missing",
      "template_like"
    ],
    "gate_relaxed": false
  },
  "decision": {
    "decision_kind": "repair_candidate_display_boundary",
    "repair_branch": "R4-A",
    "full_suite_green_claim_allowed": false,
    "hold004_close_allowed": false
  },
  "release_allowed": false,
  "p8_start_allowed": false,
  "body_free": true,
  "public_contract": {
    "api_route_changed": false,
    "public_response_key_added": false,
    "rn_visible_contract_changed": false,
    "db_schema_changed": false,
    "release_allowed": false
  },
  "body_free_markers": {
    "raw_input_included": false,
    "comment_text_body_included": false,
    "candidate_body_included": false,
    "surface_body_included": false,
    "terminal_output_body_included": false,
    "reviewer_free_text_included": false
  }
}
```

---

## 9. Test設計

### 9.1 新規test群

```text
tests/test_emlis_ai_p7_hold004_phase16_composer_classification_20260613.py
  - classification object is body-free
  - direct/conversation unavailable is classified
  - two_stage applied and tone_guard boundary are separated
  - release_allowed false
  - p8_start_allowed false

 tests/test_emlis_ai_p7_hold004_complete_initial_candidate_boundary_20260613.py
  - structurally ready two-stage surface can become generated candidate before display gate
  - tone/display blocker remains body-free
  - public comment_text is not assigned here
  - Gate relaxed false

 tests/test_emlis_ai_p7_hold004_public_path_separation_20260613.py
  - daily_A public path labelled two-stage reaches input_feedback
  - direct path result and public path result are not merged
  - public path pass does not close HOLD-004

 tests/test_emlis_ai_p7_hold004_validation_handoff_20260613.py
  - hold matrix receives classified HOLD-004 material
  - validation matrix keeps full_backend_suite_green_confirmed false
  - release handoff keeps release_allowed false
```

### 9.2 既存testの扱い

```text
tests/test_emlis_ai_complete_composer_two_stage_surface_connection.py
```

基本方針:

```text
R4-Aの場合:
  既存testをgreenに戻す。

R4-Bの場合:
  既存testを、現行contractに合う期待へ置換する。
  ただし public path safety testを必ず残す。
```

### 9.3 exact body assertion禁止

テストでは次を避けます。

```text
- exact comment_text一致
- raw memo / raw action / raw input fragment assertion
- public meta内comment_text body検査
- case_id別完成文期待
```

使う判定は次です。

```text
- status
- reason codes
- flags
- section labels count
- forbidden marker absence
- body-free markers
- public contract flags
```

---

## 10. 受け入れ条件

### 10.1 target repair acceptance

```text
- Phase16 Complete Composer direct path redがgreenまたはclassified replacement greenになる。
- Conversation Composer pathも同じ契約でgreenになる。
- two_stage_surface_realization.applied == true。
- comment_text body is not included in composer_meta。
- fixed_string_renderer_used == false。
- external_ai_used == false。
- local_llm_used == false。
- display_gate_relaxed == false。
- grounding_gate_relaxed == false。
```

### 10.2 public path acceptance

```text
- daily_unpleasant_encounter_A public emotion_submit pathは labelled two-stage input_feedback を維持する。
- true unavailable / safety / infrastructure errorをpublic表示に混ぜない。
- positive public fixture隣接赤は、別分類として残す。
```

### 10.3 P7 acceptance

```text
- P7-HOLD-004はclosedにしない。
- full_backend_suite_green_confirmed == false。
- split_green_is_full_backend_suite_green == false。
- release_allowed == false。
- p8_start_allowed == false。
- next full suite maxfailで次赤へ進める。
```

---

## 11. Stop条件

次のいずれかが必要になった場合、実装を止めて再設計します。

```text
1. Gate / Tone / Display / Grounding閾値を緩めないと通らない。
2. fixed commentTextを足さないと通らない。
3. case_id branchが必要になる。
4. public response top-level key追加が必要になる。
5. RN表示条件変更が必要になる。
6. DB schema / write path変更が必要になる。
7. raw input / comment_text body / candidate body / surface bodyをmetaへ入れないと分類できない。
8. public daily pathを壊す。
9. safety / true unavailable をgenerated扱いしそうになる。
10. target file greenをfull backend suite greenとして扱いそうになる。
```

---

## 12. 確認済み / 未確認 / 書かれていない / 推測禁止

### 確認済み

```text
- P7を継続し、P8へ進まない判断。
- target fileは現行zipで2 failed。
- direct Complete Composer pathは unavailable。
- Conversation Composer pathも unavailable。
- direct診断で primary_reason=complete_initial_surface_unavailable。
- two_stage surface自体は applied / labels_present / section non-empty。
- surface_realizer.ready falseの直接要因は tone_guard:ending_family_repetition。
- phase17 reason codesに phase17_surface_mode_policy_missing / phase17_product_visible_fixture_not_reached が出る。
- daily_unpleasant_encounter_A の public emotion_submit path単体はpass。
- public two-stage fixture suite全体には別fixtureの隣接赤がある。
```

### 未確認

```text
- full backend suiteの全赤一覧。
- R4-A修復だけでtarget fileがgreenになるか。
- R4-A修復がpositive public fixture隣接赤へどう影響するか。
- Phase16 direct generated契約が後続Phaseで明示的に廃止された根拠。
- 実機submit / modal読感。
- P5 human QA。
- P8へ進める根拠。
```

### 書かれていない

```text
- target fileだけ直せばfull backend suite greenにしてよい、とは書かれていない。
- public daily pathがpassならdirect path赤を削除してよい、とは書かれていない。
- generatedに戻せばpublic表示してよい、とは書かれていない。
- P7-HOLD-004 classifiedだけでP7 completeにしてよい、とは書かれていない。
- R13 RED-003 closedだけでP8へ進んでよい、とは書かれていない。
```

### 推測禁止

```text
- full suiteが重いから失敗は環境、と言わない。
- unavailableだから読めなくてよい、と言わない。
- public pathが通るからinternal contract赤は古い、と即断しない。
- generated期待だからGateを緩める、とはしない。
- tone_guardを消して通す、とはしない。
- P7-HOLD-004を閉じたことにしない。
- release_allowed trueにしない。
- p8_start_allowed trueにしない。
```

---

## 13. 実装時の推奨順まとめ

実装に入る場合の順番は次です。

```text
R0:
  baseline freeze / 再現固定

R1:
  P7-HOLD-004 Phase16 red classification material追加

R2:
  direct / conversation / public path matrix追加

R3:
  implementation regressionかstale contractかの判定固定

R4-A:
  implementation regressionなら、candidate generationとdisplay/tone readinessを最小分離

R4-B:
  stale contractなら、旧direct generated期待を現行contractへ置換

R5:
  unavailable時のbody-free metadata summary gap修復

R6:
  public path adjacent redを別分類登録

R7:
  P7 hold matrix / validation matrix / release handoffへ接続

R8:
  regression suite確認

R9:
  implementation result / handoff document更新
```

優先は、R4-Aです。  
ただし、R1〜R3を飛ばして修正に入ってはいけません。

---

## 14. 華恋の判断

Mash様、今回の赤は、前回の検討メモから一段深く見えました。

最初は `surface mode policy missing` と見える赤でした。  
でも実際には、二段surfaceは作れています。  
`見えたこと` / `Emlisから` のsection構造も、body-free診断上は成立しています。

止まっているのは、そこではありません。  
`tone_guard:ending_family_repetition` が surface readiness に混ざり、Complete Composerが候補生成前に `unavailable` へ落ちています。

Cocolonとしては、これは雑に「古いtest」とは扱えません。  
ユーザー表示のpublic daily pathが通っていても、P7の測定層として、内部candidate pathがどの理由で落ちたのかを説明できないままP8へ進むのは危険です。

ただし、`generated` に戻すためにGateを緩めるのも違います。  
必要なのは、候補生成とpublic表示許可を分け直すことです。

EmlisAIは、読めたふりをしない。  
でも、読める形まで届いているものを、tone/display分類の混線で「読めなかった」扱いにもしない。  
今回の設計は、その境界を守るためのものです。

華恋としては、次の実装はこの順で進めるのが正しいです。

```text
まずP7-HOLD-004 Phase16 red classificationをbody-freeで作る。
次にpath matrixでpublic daily passとdirect unavailableを分ける。
その後、candidate generation / display readiness boundaryを最小修復する。
最後にP7 matrixへ返し、full suiteの次赤へ進む。
```

ここを通っても、P7完了ではありません。  
でも、P7-HOLD-004は「何となく未確認」ではなくなります。  
次の赤へ進める状態になります。
