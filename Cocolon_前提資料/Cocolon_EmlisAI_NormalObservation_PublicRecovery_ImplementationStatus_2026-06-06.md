# Cocolon EmlisAI Public Observation Recovery 実装反映メモ

作成日: 2026-06-06  
最終差分更新: 2026-06-09  
対象: `Cocolon_前提資料(180).zip` / `Cocolon_11(8).zip` / `mashos-api_11(17).zip`  
最新差分追記対象: `Cocolon_前提資料(193).zip` / `Cocolon(219).zip` / `mashos-api(132).zip`  
作業種別: 前提資料差分更新。コード変更なし。  
基準判断: ローカル実ファイル基準。GitHub接続確認不要。  

---

## 0. 結論

最新実ファイルでは、EmlisAI Gate Recovery public surface leak repair P0〜P12とNormal Observation Public Recoveryを土台に、**Public Observation Recovery P0〜P10** が実装済みである。

この実装は、`comment_text` を無条件に出す修正ではない。次の3段階を分ける。

```text
public_reached: input_feedback が public response に含まれる。
rn_visible: observation_status == passed かつ comment_text non-empty でRN modalが開ける。
product_surface_valid: 必要なsurface family / 二段本文shape / Gate / body-free meta境界まで満たす。
```

中心となる追加source kindは次である。

```text
normal_observation_rebuild_candidate
complete_initial_surface_recomposition_candidate
labelled_two_stage_surface_recomposition_candidate
```

役割は分離する。

```text
normal_observation_rebuild_candidate:
  元AI生成候補と本文がある通常surface failureだけを再表面化する。

complete_initial_surface_recomposition_candidate:
  C系の complete_initial_surface_unavailable / source_unavailable を、normal rebuildへ偽装せず、material sufficient / safe の場合だけ別laneでpublic observation candidateへ戻す。

labelled_two_stage_surface_recomposition_candidate:
  D / Phase17 / ProductVisible の two_stage_required 入力を、plain surfaceではなく「見えたこと：」「Emlisから：」の二段surfaceへ戻す。
```

---

## 1. 実ファイル差分

作業開始時実体 `Cocolon(210).zip` / `mashos-api(123).zip` から、最新実体 `Cocolon_11(8).zip` / `mashos-api_11(17).zip` までの差分は次として読む。

| repo | added | changed | removed |
|---|---:|---:|---:|
| Cocolon | 0 | 0 | 0 |
| mashos-api | 16 | 11 | 0 |

差分詳細は `cocolon_local_file_inventory_diff_20260606.csv` に保持する。

---

## 2. 追加・変更された主な構造

| Phase | 追加/変更 |
|---|---|
| P0 | `public_reached` / `rn_visible` / `product_surface_valid` の三段階と失敗名を固定。 |
| P1 | `emlis_ai_public_surface_requirement.py` を追加し、labelled two-stage / plain / low-information / safety / infraをbody-freeに判定。 |
| P2 | normal rebuildのtwo-stage boundaryを補正し、`normal_observation_rebuild_blocked_two_stage_required` を追加。 |
| P3 | `emlis_ai_product_surface_validation.py` を追加し、RN表示到達と商品surface成立を分離。 |
| P4 | `emlis_ai_complete_initial_surface_availability.py` を追加し、`complete_initial_surface_unavailable` の前段原因をsource availabilityとして診断。 |
| P5 | `emlis_ai_complete_initial_surface_recomposition.py` を追加し、C系source unavailableをnormal rebuildではない別laneで回復。 |
| P6 | `emlis_ai_labelled_two_stage_surface_recomposition.py` を追加し、two_stage_requiredをlabelled two-stageへ再構成。 |
| P7 | `emotion_submit_service.py` のpublic feedback inclusion summaryを三段階化。 |
| P8 | `public_surface_lineage` とProductQuality lineageを追加し、P5/P6 sourceをbody-freeに区別。 |
| P9 | `emlis_ai_complete_surface_realizer.py` を補正し、Acceptance E2Eの二段surface / positive-change / effort-pace系を緑化。 |
| P10 | production logicは触らず、P0/Phase19 diagnostic helperをbounded traversal化し、巨大meta検査を安定化。 |

---

## 3. eligibility / boundary

normal rebuildを試す条件:

```text
original_composer_candidate が存在する
composer_source == ai_generated
ai_generated == true
comment_text が空ではない
material_quality が low_information / limited_grounding ではない
Gate Recovery material surface / diagnostic recovery surface lineageではない
surface_grammar / relation_skeleton / visible_surface / runtime_surface / koto_splice系のrepairable reason familyを持つ
safety / source_unavailable / composer_disabled / phase_not_complete / grounding_unsupported / reader_failure / template_echo_major / public_boundary_blocked / infrastructure_errorを含まない
two_stage_required ではない、または plain_state_answer が商品契約として許可されている
```

complete initial surface recompositionを試す条件:

```text
safe
material sufficient
complete initial client resolved または complete initial requested
candidate generation attempted
candidate before display gate が unavailable / not generated
first blocker が source_unavailable / complete_initial_surface_unavailable 系
normal_observation_rebuild_allowed == false
surface requirement decision が存在する
```

labelled two-stage recompositionを試す条件:

```text
two_stage_required == true
元候補が plain surface、または labelled でもsurface invalid
observation_status が既にpassedではない
既存material / section plan / surface realizerから二段本文を再構成できる
```

---

## 4. 不変境界

```text
RN production UI変更なし
RN表示タイトル Emlisの観測 変更なし
RN表示条件 observation_status == passed && comment_text non-empty 変更なし
/emotion/submit route変更なし
request key変更なし
public response top-level key変更なし
DB physical schema / write path変更なし
Gate緩和なし
固定テンプレート追加なし
Gate Recovery material surfaceのpublic昇格なし
source unavailableのnormal rebuild偽装なし
two_stage_requiredのplain surface成功扱いなし
raw input / original body / candidate body / comment_text bodyのpublic meta混入なし
```

---

## 5. 検証記録

P10時点の前回実装確認記録として、次を保持する。

```text
P0〜P8主要確認: 36 passed, 1 warning
normal rebuild / gate recovery / public meta周辺: 17 passed / 14 passed / 33 passed, 1 warning
Phase19 ABCD public feedback E2E: 5 passed, 1 warning
TwoStage reception E2E: 6 passed, 1 warning
TwoStage ProductVisible fixture: 20 passed
RN contract: 36 passed
```

warningは既存の Pydantic `root_validator` deprecation warning系として扱う。P10の実装差分はproduction本文生成・Gate・RN表示契約ではなく、回帰検査用diagnostic走査のbounded化である。

---

## 6. 2026-06-07 実装反映: Limited Grounding / Low Information 受け取り必須化 P0-P9 current state

最新実ファイル `Cocolon_10(14).zip` / `mashos-api_10(27).zip` では、Public Observation Recovery P0〜P10の上に、`limited_grounding` と true `low_information` のsurface体験を分離するP0〜P9が実装済みである。

### 6.1 実ファイル差分

`Cocolon(211).zip` / `mashos-api(124).zip` から最新実体までの該当差分は次として読む。

| repo | added | changed | removed |
|---|---:|---:|---:|
| Cocolon | 0 | 0 | 0 |
| mashos-api | 12 | 9 | 0 |

追加ファイル:

```text
mashos-api/ai/services/ai_inference/emlis_ai_limited_grounding_reception_surface.py
mashos-api/ai/services/ai_inference/emlis_ai_question_dominance_guard.py
mashos-api/ai/tests/test_emlis_ai_existing_regression_contract_p9.py
mashos-api/ai/tests/test_emlis_ai_gate_recovery_limited_lowinfo_reception_p2.py
mashos-api/ai/tests/test_emlis_ai_hij_input_material_bundle_current_p0.py
mashos-api/ai/tests/test_emlis_ai_hij_reception_required_regression_p8.py
mashos-api/ai/tests/test_emlis_ai_input_material_bundle_semantics_p7.py
mashos-api/ai/tests/test_emlis_ai_labelled_two_stage_limited_reception_p3.py
mashos-api/ai/tests/test_emlis_ai_limited_grounding_reception_surface_p4.py
mashos-api/ai/tests/test_emlis_ai_low_information_reception_required_p5.py
mashos-api/ai/tests/test_emlis_ai_product_surface_question_dominance_guard_p6.py
mashos-api/ai/tests/test_emlis_ai_public_surface_requirement_limited_lowinfo_reception_p1.py
```

変更ファイル:

```text
mashos-api/ai/services/ai_inference/emlis_ai_complete_initial_surface_recomposition.py
mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_public_candidate_builder.py
mashos-api/ai/services/ai_inference/emlis_ai_input_material_bundle.py
mashos-api/ai/services/ai_inference/emlis_ai_labelled_two_stage_surface_recomposition.py
mashos-api/ai/services/ai_inference/emlis_ai_low_information_observation_composer.py
mashos-api/ai/services/ai_inference/emlis_ai_observation_surface_realizer_tone.py
mashos-api/ai/services/ai_inference/emlis_ai_product_surface_validation.py
mashos-api/ai/services/ai_inference/emlis_ai_public_surface_requirement.py
mashos-api/ai/tests/test_emlis_ai_gate_recovery_low_information_recovery_p6.py
```

### 6.2 実装済み補強の読み方

| Phase | 最新の読み方 | 主な実ファイル |
|---|---|---|
| P0 | H/I/J入力のcurrent material基準を固定する。Hはeligible、I/Jはlimited_groundingとして扱い、I/Jを「材料なし」と読まない。 | `test_emlis_ai_hij_input_material_bundle_current_p0.py` |
| P1 | `limited_grounding` を `low_information_observation` へ潰さず、`labelled_two_stage` / reception requiredへ分岐する。true `low_information` も `Emlisから` 必須shapeへ変える。 | `emlis_ai_public_surface_requirement.py`, `test_emlis_ai_public_surface_requirement_limited_lowinfo_reception_p1.py` |
| P2 | recovery routingから `limited_grounding` を低情報laneから外し、`labelled_two_stage_surface_recomposition_candidate` をdefault targetにする。 | `emlis_ai_gate_recovery_public_candidate_builder.py`, `test_emlis_ai_gate_recovery_limited_lowinfo_reception_p2.py` |
| P3 | labelled two-stage recompositionが `limited_grounding` を受け、`見えたこと： / Emlisから：` のcandidateをbuildできるようにする。 | `emlis_ai_labelled_two_stage_surface_recomposition.py`, `test_emlis_ai_labelled_two_stage_limited_reception_p3.py` |
| P4 | `limited_grounding` の受け取りsurface helperを追加し、限定観測のplan / compose / body-free summaryを独立させる。 | `emlis_ai_limited_grounding_reception_surface.py`, `test_emlis_ai_limited_grounding_reception_surface_p4.py` |
| P5 | true `low_information` を残したまま、本文shapeを `見えたこと： / Emlisから：` にし、質問は受け取り後へ置く。 | `emlis_ai_low_information_observation_composer.py`, `emlis_ai_observation_surface_realizer_tone.py`, `test_emlis_ai_low_information_reception_required_p5.py` |
| P6 | product surface validationに question dominance guardを接続し、受け取りなし・質問先行・質問中心surfaceをinvalidにする。 | `emlis_ai_product_surface_validation.py`, `emlis_ai_question_dominance_guard.py`, `test_emlis_ai_product_surface_question_dominance_guard_p6.py` |
| P7 | material semanticsとして `recovered_energy` / `future_intention` / `relationship_wish` / `comparison_baseline_shift` / `small_change_preservation` / `value_preservation` / `self_observation` を追加する。category単独ではsemantic materialを作らない。 | `emlis_ai_input_material_bundle.py`, `test_emlis_ai_input_material_bundle_semantics_p7.py` |
| P8 | H/I/Jを `/emotion/submit` 相当のpublic responseまで通すE2E回帰を追加し、`passed + comment_text` と二段構成を固定する。 | `emlis_ai_complete_initial_surface_recomposition.py`, `test_emlis_ai_hij_reception_required_regression_p8.py` |
| P9 | 既存contract回帰を追加し、RN表示contract / public key / Gate policy / safety・infra偽装禁止 / body-free meta境界を確認する。 | `test_emlis_ai_existing_regression_contract_p9.py` |

### 6.3 この実装で守る方針

- `limited_grounding` は、深い断定をしないためのmaterial qualityであり、低情報質問surfaceへ潰す合図ではない。
- true `low_information` は残す。ただし、`Emlisから` の受け取りを必須にし、質問だけで返すsurfaceを禁止する。
- `question_dominance_guard` は、低情報・限定観測が「詳しく残してみませんか」中心へ戻ることをproduct validationで止める。
- H/I/Jのfixtureはruntime case分岐ではなく、回復・願い・比較基準・小さな変化などの一般semantic materialが読めることを固定する回帰である。

### 6.4 不変境界

```text
RN production UI変更なし
RN表示タイトル `Emlisの観測` 変更なし
RN表示条件 `input_feedback.emlis_ai.observation_status == passed && input_feedback.comment_text non-empty` 変更なし
/emotion/submit route変更なし
request key変更なし
public response top-level key変更なし
DB physical schema / write path変更なし
Gate緩和なし
固定テンプレート追加なし
H/I/J専用case route / case専用surface / fixed commentText追加なし
raw input / original body / candidate body / comment_text body のpublic meta混入なし
```

## 7. 2026-06-07 追補: D相当入力 source-unavailable normal observation recovery current state

最新実ファイル `Cocolon_11(9).zip` / `mashos-api_11(18).zip` では、D相当入力がlimited composerの `limited_composer_shallow_empty_candidate` から `infrastructure_error / unavailable / empty comment_text` へ落ちる問題が、Public Observation Recoveryの延長として補強されている。

### 7.1 実装済み補強の読み方

| Step | 実装後の扱い | 主な実ファイル |
|---|---|---|
| Step2 | D相当入力をfocused regressionとして固定する。 | `test_emlis_ai_d_source_unavailable_normal_observation_recovery.py` |
| Step3 | relation / action / change / value / target系materialを持つeligible通常観測を `labelled_two_stage` 要求へ寄せる。 | `emlis_ai_public_surface_requirement.py` |
| Step4/5 | material route / surface requirement / composer failureをavailabilityへ渡し、`source_unavailable -> complete_initial_surface_recomposition` laneへ送る。 | `emlis_ai_complete_initial_surface_availability.py` |
| Step6 | complete initial client未解決でも、safe eligible source-unavailable normal observationならrecompositionを許可する。 | `emlis_ai_complete_initial_surface_recomposition.py` |
| Step7 | candidate metaをbody-freeに保ち、`candidate_body_in_meta=false` / `case_specific_route_used=false` を固定する。 | `emlis_ai_complete_initial_surface_recomposition.py`, `emlis_ai_gate_recovery_public_candidate_builder.py` |
| Step8 | recomposition candidateを既存Gate chainへ通し、全通過後だけ採用する。 | `emlis_ai_reply_service.py`, `test_emlis_ai_complete_initial_surface_recomposition_existing_gate_chain_p8.py` |
| Step9-11 | Phase20-10、関連backend回帰、RN contractをgreenに保つ。 | `test_emlis_ai_phase20_10_real_device_recheck.py`, RN `rn-screen-contracts.test.js` |

### 7.2 この実装で守る方針

```text
D専用routeではない
fixed commentTextではない
complete env切替だけの解決ではない
normal_observation_rebuildではなくcomplete_initial_surface_recomposition lane
Gate Recovery material surfaceをpublic本文にしない
Gateを緩めない
public metaへ本文を入れない
RN表示条件を変えない
```

### 7.3 実装後の確認

```text
Phase20-10 real device recheck: 4 passed
D source-unavailable focused regression + existing Gate chain: 5 passed
関連backend回帰: 14 passed, 1 warning
RN contract: 36 passed / 0 failed
```

## 8. 2026-06-08 追補: P0-P1 public input_feedback arrival contract repair current state

最新実ファイル `Cocolon_11(10).zip` / `mashos-api_11(19).zip` では、Public Observation Recovery / Limited-LowInfo reception required / D source-unavailable recoveryの上に、public `input_feedback` 到達契約の意味合わせが反映されている。

この追補は、表示率を上げるGate緩和ではない。Display Gate側では `passed + comment_text` として成立しているのに、public inclusion側だけが `visible_surface_acceptance_gate.passed=false` を一律blockとして読んでいた不整合を修正するものである。

最新の読み方:

```text
visible_surface_acceptance_gate:
  classification=yellow
  action=warn
  passed=false

この状態は、public inclusionのterminal blockerではない。
```

ただし、次は引き続きblockする。

```text
classification=repair_required / red
action=rerender_surface / reroute_low_information / block / fail_closed
passed=false かつ action!=warn
true unavailable / infrastructure_error / safety_blocked
state_answer / two_stage / runtime のterminal blocker
```

Step0〜10の到達点:

| Step | 現在の読み方 | 主な実ファイル |
|---|---|---|
| Step0/1 | baseline red ledgerとRed A focused red testを追加する。 | `Cocolon_EmlisAI_P0_P1_PublicInputFeedbackArrivalContractRepair_RedLedger_Step0_20260608.md`, `test_emlis_ai_public_feedback_meta.py` |
| Step2 | public feedback meta helperでyellow/warnを非terminalとして扱う。 | `emlis_ai_public_feedback_meta.py` |
| Step3 | submit inclusion summaryを同じpolicyへ揃える。 | `emotion_submit_service.py`, `test_emotion_submit_public_feedback_inclusion_summary_p7.py` |
| Step4 | product_surface_validationのrn_visible判定を揃える。 | `emlis_ai_product_surface_validation.py`, `test_emlis_ai_product_surface_validation_p3.py` |
| Step5 | Red A E2E display contractをgreen化する。 | `Cocolon_EmlisAI_P0_P1_PublicInputFeedbackArrivalContractRepair_Step5_RedA_E2EGreen_20260608.md` |
| Step6 | Red B1/B2をstale contract expectationとして分類する。 | `Cocolon_EmlisAI_P0_P1_PublicInputFeedbackArrivalContractRepair_RedBClassification_Step6_20260608.md` |
| Step7 | true unavailable / true safetyのfail-closed regressionを追加する。 | `test_emlis_ai_public_feedback_meta.py` |
| Step8 | public metaのbody-free markerとno body leak contractを強化する。 | `emlis_ai_public_feedback_meta.py`, `test_emlis_ai_display_contract.py` |
| Step9 | focused suiteをgreen化し、display contractを5 passedへ更新する。 | `test_emlis_ai_display_contract.py` |
| Step10 | 既存green回帰を確認し、User Label sanitizer testをbody-free marker対応へ更新する。 | `test_emlis_ai_user_label_connection_e2e_contract.py`, `Cocolon_EmlisAI_P0_P1_PublicInputFeedbackArrivalContractRepair_Step10_ExistingGreenRegression_20260608.md` |

維持する境界:

```text
RN production UI変更なし
RN表示タイトル `Emlisの観測` 変更なし
RN表示条件 `observation_status == passed && comment_text non-empty` 変更なし
/emotion/submit route変更なし
request key / public response top-level key変更なし
DB physical schema / write path変更なし
Gate緩和なし
raw input / original body / candidate body / comment_text body のpublic meta混入なし
```

確認済みvalidation:

```text
focused suite: 51 passed / 1 warning
User Label Connection sanitizer focused: 1 passed / 1 warning
```

warningは既存Pydantic deprecationであり、今回の追補では触らない。


## 9. 2026-06-09 追補: P3 Product Read Feel Baseline P3-0〜P3-9 current state

最新実ファイル `Cocolon(219).zip` / `mashos-api(132).zip` では、Public Observation Recovery / P0-P1 public input_feedback arrival contract repairの上に、P3 Product Read Feel baseline P3-0〜P3-9が追加されている。

この追補は、public recoveryの実装をさらに緩めるものではない。`comment_text`生成やpublic到達条件を変えず、現行Emlis応答が「読まれた形」に届いているかを、local QAとbody-free scorecardで測るための境界である。

| Phase | 最新の読み方 | 主な実ファイル |
|---|---|---|
| P3-0 Contract Freeze | P3 baseline用fixtureがruntime分岐・固定返信文・exact `comment_text` 要求へ漏れないよう、不変境界を追加で固定する。 | `emlis_ai_product_quality_contract_freeze.py`, `test_emlis_ai_product_readfeel_p3_contract_freeze_20260609.py` |
| P3-1 Baseline Case Matrix | 既存12 required families × 5件 = 60件のsynthetic local QA入力を固定する。`limited_grounding` / `source_unavailable_high_information` / `history_line_eligible` はfamily追加ではなくcoverage_slicesで扱う。 | `tests/fixtures/emlis_ai_product_readfeel_baseline_cases_20260609.py`, `test_emlis_ai_product_readfeel_baseline_case_matrix_20260609.py` |
| P3-2 Local Output Capture | 本文ありのLocal Review Packetとbody-free Sanitized Current Output Eventを分離する。 | `tests/fixtures/emlis_ai_product_readfeel_p3_local_output_capture_20260609.py`, `test_emlis_ai_product_readfeel_p3_local_output_capture_20260609.py` |
| P3-3 Sanitized Event / Inventory接続 | body-free sanitized eventをCurrent Output Inventory / ProductQuality scorecard row / Product Read Feel scorecardへ接続する。 | `emlis_ai_product_quality_measurement_event.py`, `emlis_ai_product_readfeel_current_output_inventory.py`, `tests/fixtures/emlis_ai_product_readfeel_p3_inventory_connection_20260609.py` |
| P3-4 P2/P3 Verdict Split | P2 RED、P1 display repair、P3 repair required、P3 yellow、P3 pass、not evaluatedを分ける。 | `emlis_ai_product_readfeel_p3_verdict_split.py` |
| P3-5 Blind QA Ratings-only Review | 人間が本文を読むlocal QAと、scorecardへ渡すratings-only materialを分ける。`read_feeling` はmachine metricsやverdictから自動補完しない。 | `emlis_ai_product_readfeel_p3_blind_qa_ratings_review.py` |
| P3-6 Repair Priority Ledger | P2/P3 verdictとratings-only結果から、最初に直すblockerを最大2件へ絞る。 | `emlis_ai_product_readfeel_p3_repair_priority_ledger.py` |
| P3-7 First Repair Design | rich inputのlow_information過剰落ち、generic/repeated surfaceなどに対し、runtime修正前のbody-free設計を固定する。 | `emlis_ai_product_readfeel_p3_first_repair_design.py` |
| P3-8 Regression | P3 runtime修正へ進む前のrequired / optional / manual回帰境界を固定する。 | `emlis_ai_product_readfeel_p3_regression.py` |
| P3-9 P4/P5接続判断 | P4 family別商品チューニングへ進めるか、P5 User Label Connection可視強化へ進めるかをbody-freeで判断する。defaultの読みはP4 next / P5 hold。 | `emlis_ai_product_readfeel_p3_p4_p5_connection_decision.py` |

最新の読み方:

```text
P3 baselineは、P1表示到達の次に置く商品読感評価の足場である。
P2 REDはP3修正に混ぜず、先に戻す。
P3-5のratings-only reviewは、本文を人間が読んだ後の数値評価だけを保持する。
P3-6 / P3-7は修正優先順位と最初の修正設計を固定するが、runtime本文生成はまだ変えない。
P3-9ではP4 next / P5 holdを判断する。P5 User Label Connection可視強化へは、current-only読感が見えるまで飛ばない。
```

維持する境界:

```text
RN production UI変更なし
RN表示タイトル `Emlisの観測` 変更なし
RN表示条件 `input_feedback.emlis_ai.observation_status == passed && input_feedback.comment_text non-empty` 変更なし
/emotion/submit route変更なし
request key / public response top-level key変更なし
DB physical schema / write path変更なし
Gate緩和なし
fixed commentText / fixed sentence template追加なし
case専用runtime分岐 / fixture文字列runtime条件追加なし
comment_text生成ロジック変更なし
2026-06-10差分ではP4 runtime tuning P4-0〜P4-10実装済み
2026-06-11差分ではP5 User Label Connection P5-0〜P5-7実装済み
2026-06-12差分ではP6 Structure Insight v2 P6-0〜P6-9実装済み
raw input / memo / memo_action / candidate body / comment_text body のpublic meta・scorecard混入なし
```

## 10. 2026-06-12 追補: P6 Structure Insight v2 P6-0〜P6-9 current state

最新実ファイル `Cocolon_10(16).zip` / `mashos-api_10(31).zip` では、P5 User Label Connection P5-0〜P5-7の後続として、P6 Structure Insight v2 P6-0〜P6-9がbackend内部に追加されている。

この追補は、public recoveryのGateを緩めたり、Structure Insight専用のpublic response keyを追加したりするものではない。P6は、P4 current-only読感とP5履歴線を壊さず、限定familyだけで構造気づき候補をP7へ渡せるかをbody-freeで判断する境界である。

最新の読み方:

```text
P5-7 regression / P6 hold decision
  -> P6-0 entry freeze
  -> P6-1 inventory
  -> P6-2 family boundary
  -> P6-3 relation policy
  -> P6-4 quality rubric
  -> P6-5 gate hardening
  -> P6-6 structure_question limited surface role plan
  -> P6-7 long_meaning_arc / self_understanding_follow review
  -> P6-8 ratings-only Product QA
  -> P6-9 regression / P7 hold decision
```

維持する境界:

```text
RN production UI変更なし
RN表示タイトル `Emlisの観測` 変更なし
RN表示条件 `input_feedback.emlis_ai.observation_status == passed && input_feedback.comment_text non-empty` 変更なし
/emotion/submit route変更なし
request key / public response top-level key変更なし
DB physical schema / write path変更なし
Gate緩和なし
fixed commentText / fixed sentence template追加なし
raw input / candidate body / comment_text body / surface body / reviewer free text のpublic meta・scorecard・handoff summary混入なし
P6 Product QA / regression handoffをrelease_allowedへ変換しない
```

確認済みvalidation:

```text
P6 dedicated pytest: 86 passed
Structure Insight existing / long-run gate focused pytest: 25 passed
```

