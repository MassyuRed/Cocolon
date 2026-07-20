# Cocolon / EmlisAI P4 Runtime Backfill / H Future Direction Surface Repair 詳細設計書・実装順

作成日: 2026-06-24 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown設計書  
対象: Cocolon / EmlisAI / `/emotion/submit` immediate observation / `Emlisの観測` / P4 Family別商品チューニング runtime backfill / H/I/J reception-required regression  
作業基準: ローカルzipのみ  
GitHub接続確認: なし  
コード変更: なし  
DB変更: なし  
RN変更: なし  
API route / request key / response key変更: なし  
json / schema 実ファイル化: なし  

---

## 0. 本資料の結論

今回の実装対象は、P5〜P7継続ではなく、**P4 Family別商品チューニングの runtime backfill / red repair** とする。

より狭く言うと、今回の主対象は次である。

```text
P4-HIJ Future Direction Surface Repair

対象red:
  tests/test_emlis_ai_hij_reception_required_regression_p8.py
  test_p8_hij_submit_e2e_returns_reception_required_public_feedback
  case: p8_H_recovered_energy_future_direction

修正目的:
  eligible / plain_state_answer 相当の high-information future-direction 入力が、
  post-final の labelled two-stage recomposition lane を通った場合でも、
  current input内の具体核を generic surface へ潰さず、本文へ残す。
```

このredは、表示到達の問題ではない。  
`input_feedback.comment_text` は返っており、`observation_status == passed` も成立している。  
しかし、入力内の「やってみたい」「出来るかもしれない」「次の頑張り方」相当の核が、表示本文では次のように潰れている。

```text
この記録では、生活について、平穏の動きと次にどう扱うかを探している動きが重なっている状態として見えます。
```

これはCocolonとして危ない。  
理由は、ユーザーが残した言葉が「カテゴリ・感情・汎用動作」に圧縮され、入力直後の「読まれた形」になっていないからである。

したがって、今回の修正は **Gateを緩める修正** ではない。  
**P5履歴線で補う修正** でもない。  
**H case専用の固定文を足す修正** でもない。

今回行うべきことは、P4の目的どおり、次である。

```text
current inputだけで読めている材料を、
family / semantic focus / surface role によって、
実submitで選ばれるpublic surface laneまで落とす。
```

---

## 1. 作業種別と守る境界

### 1.1 今回の作業種別

```text
作業種別:
  設計

成果物:
  md設計書

今回しないこと:
  コード変更
  patch作成
  実装zip作成
  DB変更
  RN変更
  API route変更
  request key変更
  response key変更
  public meta key追加
  json/schema実ファイル追加
  fixture実ファイル追加
```

本資料内に json / schema 案を含める。  
ただし、実ファイル化は実装段階で、既存module配置・既存test配置・既存meta boundary・raw text混入リスクを確認してから判断する。

### 1.2 今回変更してはいけないcontract

```text
RN:
  - RN production UI
  - RN表示タイトル `Emlisの観測`
  - RN表示条件 `observation_status == passed && comment_text non-empty`

API:
  - `/emotion/submit` route
  - request key
  - public response top-level key
  - `input_feedback.comment_text` visible body契約
  - `input_feedback.emlis_ai` public meta契約

DB:
  - DB physical schema
  - write path
  - existing row insert path

EmlisAI boundary:
  - Display Gate
  - Runtime Surface Pre-Return Gate
  - Visible Surface Acceptance Gate
  - Grounding / Reader / Template / Safety Gate threshold
  - public meta sanitizer
  - Free / Plus / Premium history boundary
```

### 1.3 今回してはいけないこと

```text
- case_id専用分岐を追加する。
- H/I/J専用routeを追加する。
- exact fixed comment_textをruntimeに入れる。
- expected fragmentだけを満たす貼り付け文を追加する。
- Gateを緩める。
- material_qualityを雑にeligibleへ上げる。
- H caseを無理にlimited_groundingへ落とす。
- P5 User Label Connectionを使ってcurrent inputの弱さを隠す。
- public metaへraw input / comment_text body / candidate body / surface textを入れる。
- response shapeを変える。
- RN表示条件を変える。
- DB/APIの命名やkeyを変える。
```

---

## 2. 参照・確認範囲

### 2.1 参照したローカル添付

```text
/mnt/data/Cocolon_前提資料(250).zip
/mnt/data/EmlisAIの実装済み資料(78).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(10).md
/mnt/data/Cocolon_EmlisAI_current_phase_decision_20260624(1).md
/mnt/data/Cocolon(251).zip
/mnt/data/mashos-api(164).zip
```

### 2.2 作業姿勢として確認した資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/03_forbidden_insufficient_premise_and_actual_file_check.txt
Cocolon_前提資料/work_attitude_rules_for_karen/04_forbidden_mixing_design_and_implementation.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/10_stop_judgment_and_unwritten_rules.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/cocolon_environment_state_output_observation_structure_design_2026_05_25.md
```

### 2.3 実装済み資料として確認した資料

```text
EmlisAIの実装済み資料/Cocolon_EmlisAI_P0_P1_PublicInputFeedbackArrivalContractRepair_詳細設計書_実装順_20260608.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P3_ProductReadFeel_Baseline_DetailedDesign_ImplementationOrder_20260609.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P4_FamilyProductTuning_DetailedDesign_ImplementationOrder_20260610.md
EmlisAIの実装済み資料/EmlisAI_LimitedGrounding_LowInfo_ReceptionRequired_DetailedDesign_2026-06-06.md
EmlisAIの実装済み資料/EmlisAI_PublicObservationRecovery_詳細設計書_実装順_2026-06-06.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_P7_R55_R54EvidenceReconcile_R52ReintakeDecisionMaterialization_DetailedDesign_ImplementationOrder_20260623.md
```

### 2.4 主に確認した実ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_input_material_bundle.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_initial_surface_recomposition.py
mashos-api/ai/services/ai_inference/emlis_ai_labelled_two_stage_surface_recomposition.py
mashos-api/ai/services/ai_inference/emlis_ai_limited_grounding_reception_surface.py
mashos-api/ai/services/ai_inference/emlis_ai_public_surface_requirement.py
mashos-api/ai/services/ai_inference/emlis_ai_observation_eligibility_router.py
mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
mashos-api/ai/services/ai_inference/emlis_ai_product_surface_validation.py
mashos-api/ai/tests/test_emlis_ai_hij_reception_required_regression_p8.py
```

### 2.5 今回実行した確認

```bash
cd /mnt/data/cocolon_local_work/api/mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_hij_reception_required_regression_p8.py::test_p8_hij_submit_e2e_returns_reception_required_public_feedback \
  --tb=short -vv
```

結果:

```text
3 collected
p8_H_recovered_energy_future_direction: FAILED
p8_I_limited_recovered_energy_relationship_wish: PASSED
p8_J_limited_comparison_baseline_small_change: PASSED

1 failed / 2 passed / 1 warning
```

---

## 3. 現在地

### 3.1 ロードマップ上の位置

現在位置は次で固定する。

```text
現在Phase:
  P4 Family別商品チューニング runtime backfill / red repair

進めないPhase:
  P5 User Label Connection visible strengthening
  P6 limited human readfeel
  P7継続判断
  P8観測補助問い詳細設計
```

P4の目的は、familyごとの温度・比率・応答shapeを安定させること。  
P5以降の履歴線や長期観測は、current inputが読めている前提で乗せる。

今回のredは、現在入力だけで読めているべき材料がsurface上で潰れているため、P4へ戻す。

### 3.2 今回のredの性質

```text
red classification:
  P4 current-only readfeel / family surface specificity red

red kind:
  public response shape intact
  comment_text present
  observation_status passed
  public meta body-free boundary intact
  but current input material nucleus not visible enough

main blocker:
  generic_reception_surface
  current_input_material_surface_drop
  eligible_future_direction_surface_specificity_missing
```

### 3.3 赤で守れているもの

```text
- `/emotion/submit` response shapeは壊れていない。
- `input_feedback.comment_text` は存在している。
- `observation_status == passed` は返っている。
- public meta sanitizerはraw input / comment_text bodyを返していない。
- I/Jのlimited_grounding系reception-requiredケースは通っている。
- direct route上、H caseは `material_quality == eligible` として扱えている。
```

### 3.4 赤で守れていないもの

```text
- H caseのcurrent input核が表示本文に残っていない。
- recovered_energy / future_intention / value_preservation / self_observation が、visible surfaceの主語や述語へ十分に降りていない。
- category `生活` と emotion `平穏` がsurfaceの中心になり、memo本文の核より勝っている。
- `memo_action` が空のため、generic action phrase `次にどう扱うか` へ落ちている。
- positive / recovered energy 系の温度が `良かった動きも迷いも` へ汎用化されている。
```

---

## 4. 実ファイルから見える原因整理

### 4.1 material層は完全に空ではない

H caseを直接material routeへ通すと、以下は確認できる。

```text
material_quality:
  eligible

visible_material_slots:
  event
  emotion_direction
  target
  action
  time
  value

relation_material_ids:
  recovered_energy
  future_intention
  value_preservation
  self_observation
```

つまり、入力材料層で「やってみたい」「出来るかもしれない」「次をどう頑張るか」相当の方向が完全に失われているわけではない。

### 4.2 limited_grounding laneにはfuture-direction surfaceがある

`emlis_ai_limited_grounding_reception_surface.py` には、limited_grounding向けに次のようなsemantic branchが存在している。

```text
recovered_energy + future_intention:
  気力が戻ってきたタイミング
  人と近くありたい願い
  挑戦

recovered_energy + self_observation/value/future_intention:
  やってみたいと思えた気持ち
  次の頑張り方
  自分にも出来るかもしれないと思えた瞬間
```

I/Jがgreenなのは、このlimited reception surface側のsemantic preservationが効いているためと見てよい。

ただし、H caseはdirect route上 `eligible / plain_state_answer` であり、limited_groundingへ寄せて直すべきではない。

### 4.3 complete_initial recompositionにもsemantic branchはある

`emlis_ai_complete_initial_surface_recomposition.py` には、eligible / future-direction向けに次の分岐が既に存在している。

```text
if recovered_energy and self_observation/value_preservation/future_intention:
  observation:
    やってみたいと思えた気持ち
    次の頑張り方
  reception:
    出来るかもしれないと思えた瞬間
```

この層だけを見ると、H caseで期待される方向は存在している。

### 4.4 実submitで選ばれているvisible candidateは labelled two-stage recomposition

実submit debugでは、visible public candidateは次の系統になっていた。

```text
selected_public_candidate_source_kind:
  labelled_two_stage_surface_recomposition_candidate

labelled_two_stage_surface_recomposition_used:
  true

limited_grounding_reception_surface_used:
  false

comment_text:
  見えたこと：
  この記録では、生活について、平穏の動きと次にどう扱うかを探している動きが重なっている状態として見えます。

  Emlisから：
  良かった動きも迷いもどちらかに寄せず、そのまま確かめようとしているところを、Emlisは受け取りました。
```

### 4.5 `emlis_ai_labelled_two_stage_surface_recomposition.py` のgeneric化

`emlis_ai_labelled_two_stage_surface_recomposition.py` は、limited_groundingの場合のみ `compose_limited_grounding_labelled_two_stage_comment()` へ渡す。

それ以外は次のgeneric helperで本文を作る。

```text
observation:
  この記録では、{topic}について、{feeling}と{action}が重なっている状態として見えます。

reception:
  自己否定markerがあれば self_denial寄り
  嬉/楽/よかった/できた markerがあれば positive generic
  それ以外は generic reception
```

このgeneric helperには、eligibleの `relation_material_ids` / semantic material ids をsurfaceへ反映するbranchがない。  
そのため、material routeでは `recovered_energy / future_intention / value_preservation / self_observation` が見えていても、post-finalのlabelled two-stage recompositionで選ばれた時点でsurfaceが汎用化される。

### 4.6 現時点の原因仮説

```text
確認済み:
  - H caseはroute上eligibleである。
  - material routeにはrecovered_energy / future_intention / value_preservation / self_observationが残っている。
  - 実submitのvisible candidateはlabelled_two_stage_surface_recomposition_candidateである。
  - labelled_two_stage_surface_recompositionのeligible non-limited pathはgeneric helper中心である。

未確定:
  - complete_initial candidateがなぜpost-finalでlabelled two-stage recompositionへ回るかの完全な内部理由。
  - surface_requirement_familyがdirect resolveではplain_state_answerなのに、runtime metaではlabelled_two_stageとして扱われる箇所の正確な分岐。

実装前に確認すること:
  - selected candidate lineageをred ledgerへbody-freeで固定する。
  - complete_initial candidate生成後、どのGate / surface requirement summaryによりlabelled two-stage recompositionへ移るかを見る。

ただし今回の修正入口:
  - post-finalでlabelled two-stage recompositionが選ばれても、material routeに残っているsemantic idsをsurfaceへ反映できるようにする。
```

---

## 5. 修正方針

### 5.1 主方針

```text
eligible high-information future-direction入力のsemantic material idsを、
labelled two-stage recomposition laneでも失わない。
```

### 5.2 実装の中心

最小修正の中心は、次のいずれか、または両方である。

```text
候補A:
  emlis_ai_labelled_two_stage_surface_recomposition.py に、
  eligible non-limited向けのsemantic material extraction / focus branchを追加する。

候補B:
  emlis_ai_complete_initial_surface_recomposition.py と
  emlis_ai_labelled_two_stage_surface_recomposition.py が共通利用できる
  body-free semantic focus helperを追加する。
```

華恋の推奨は **候補Aから開始し、重複が増えすぎる場合のみ候補Bへ拡張** である。

理由:

```text
- 今回は設計上P4 runtime red repairであり、大規模共通化が目的ではない。
- complete_initial側には既にfuture-direction branchがある。
- redはpost-final labelled recomposition pathで起きている。
- まずred pathを最小修正し、後続で共通helper化する方が影響範囲が狭い。
```

### 5.3 surfaceの到達方向

H case専用文ではなく、semantic focus単位で次のsurfaceを許容する。

```text
semantic_focus:
  recovered_energy_future_direction

required input-side material ids:
  recovered_energy
  future_intention

supporting material ids:
  value_preservation
  self_observation
  small_change_preservation

observation section should include at least one of:
  - やってみたいと思えた気持ち
  - 次の頑張り方
  - 挑戦したい気持ち
  - 回復してきた気力

reception section should include at least one of:
  - 出来るかもしれないと思えた瞬間
  - その気持ちを流さず確かめようとしている
  - また頑張りたいと思えたこと
```

ただし、実装では「この文字列を固定で返す」ではなく、semantic focusに応じてPhraseUnit / helper branchの選択を変える。

### 5.4 generic surfaceとして検知・抑制するもの

今回のH redでは、次をgeneric surface signatureとして扱う。

```text
generic_topic_emotion_action_surface:
  - {category}について
  - {emotion}の動き
  - 次にどう扱うかを探している動き

positive_generic_reception_surface:
  - 良かった動きも迷いもどちらかに寄せず
  - そのまま確かめようとしているところ
```

これらの表現は、low-informationや材料不足では許容される場合がある。  
しかし、H caseのようにsemantic idsが `recovered_energy / future_intention / value_preservation / self_observation` まで出ている場合は、主surfaceにしてはいけない。

---

## 6. 実装順

---

## R0: Red Ledger Freeze / 赤の固定

### 目的

実装修正前に、H redを「表示到達赤」ではなく「current-only surface specificity red」として固定する。

### 対象

```text
mashos-api/ai/tests/test_emlis_ai_hij_reception_required_regression_p8.py
必要なら新規test:
  tests/test_emlis_ai_p4_runtime_backfill_hij_future_direction_surface_repair_20260624.py
```

### 実装内容候補

```text
- 既存H/I/J e2e testは変更しない。
- 新規red ledger testまたはfixture summary testで、以下をbody-freeに固定する。
  - red_id
  - case_id
  - expected material_quality
  - expected surface_requirement_family
  - selected_public_candidate_source_kind
  - generic_surface_detected
  - missing_expected_fragment_ids
  - public_contract_changed false
```

### 完了条件

```text
- redの分類がP4 surface specificity redとして固定されている。
- public response shape / meta boundary / gate relaxation有無が同時に確認できる。
- raw input / comment_text bodyをred ledger public-safe summaryへ入れていない。
```

---

## R1: Material / Candidate Lineage Audit

### 目的

H caseの材料がどこで落ちるかを切り分ける。

### 確認すること

```text
1. route_emlis_observation_material_eligibility(current_input)
   - material_quality
   - visible_material_slots
   - relation_material_ids

2. resolve_public_surface_requirement(...)
   - direct surface_requirement_family
   - two_stage_required
   - plain_state_answer_allowed

3. render_emlis_ai_reply / persist_emotion_submission path
   - complete_initial candidate generatedか
   - post-final labelled recompositionへ回ったか
   - selected_public_candidate_source_kind
   - root_candidate_source_kind
   - Gate relaxed flags

4. public meta boundary
   - raw_input_included false
   - comment_text_body_included false
   - public_response_key_added false
```

### 実装内容候補

```text
新規moduleを作らず、test helper内でauditする。
または、body-free helperとして以下を作る。

services/ai_inference/emlis_ai_p4_runtime_backfill_surface_audit.py
```

華恋の推奨は、まずtest helper内でauditし、複数testで必要になったらmodule化すること。

### 完了条件

```text
- material層でsemantic idsが存在することを確認する。
- selected visible surface laneがどれか確認する。
- redの主原因を、material absence / requirement mismatch / recomposition surface drop に分けられる。
```

---

## R2: Eligible Future Direction Semantic Focus Helper

### 目的

case専用ではなく、入力材料から `recovered_energy_future_direction` というsurface focusを判定する。

### 実装対象候補

最小案:

```text
mashos-api/ai/services/ai_inference/emlis_ai_labelled_two_stage_surface_recomposition.py
```

拡張案:

```text
mashos-api/ai/services/ai_inference/emlis_ai_surface_semantic_focus.py
```

### 推奨設計

最初は `emlis_ai_labelled_two_stage_surface_recomposition.py` 内にprivate helperとして置く。

```python
# 実装段階の案。設計書内の説明用であり、このまま実ファイル化するとは限らない。

def _semantic_material_ids_for_recomposition(
    *,
    current_input: Mapping[str, Any] | None,
    material_route: Any,
) -> tuple[str, ...]:
    ...


def _surface_semantic_focus(
    semantic_ids: Sequence[str],
) -> str:
    if "recovered_energy" in semantic_ids and "future_intention" in semantic_ids:
        return "recovered_energy_future_direction"
    if {"comparison_baseline_shift", "small_change_preservation"}.issubset(set(semantic_ids)):
        return "comparison_baseline_small_change"
    if "relationship_wish" in semantic_ids and "recovered_energy" in semantic_ids:
        return "recovered_energy_relationship_wish"
    return "generic_visible_material"
```

### 注意

```text
- case_idを見ない。
- expected fragmentを条件にしない。
- raw memoをmetaへ出さない。
- surface focus idはbody-free summaryへ出してよいが、raw textやcomment_text bodyは出さない。
- Hをlimited_groundingへ分類変更しない。
```

### 完了条件

```text
- H caseのsemantic focusが `recovered_energy_future_direction` になる。
- I/Jのlimited_grounding branchを壊さない。
- semantic focus helperのsummaryがbody-freeである。
```

---

## R3: Labelled Two-stage Eligible Surface Specificity

### 目的

eligible non-limited pathで、generic observation / receptionへ落ちる前にsemantic focusを見てsurfaceを作る。

### 対象

```text
mashos-api/ai/services/ai_inference/emlis_ai_labelled_two_stage_surface_recomposition.py
```

### 修正候補箇所

```text
_compose_labelled_two_stage_comment()
_compose_observation_sentence()
_compose_reception_sentence()
```

### 設計

`_compose_observation_sentence()` の冒頭でsemantic focusを見る。

```python
# 実装段階の案。設計書内の説明用であり、このまま実ファイル化するとは限らない。

def _compose_observation_sentence(*, current_input: Mapping[str, Any] | None, material_route: Any) -> str:
    semantic_ids = _semantic_material_ids_for_recomposition(
        current_input=current_input,
        material_route=material_route,
    )
    focus = _surface_semantic_focus(semantic_ids)

    if focus == "recovered_energy_future_direction":
        return _compose_recovered_energy_future_direction_observation()

    # existing generic fallback
    topic = _topic_phrase(current_input=current_input, material_route=material_route)
    feeling = _feeling_phrase(current_input=current_input)
    action = _action_phrase(current_input=current_input)
    return f"この記録では、{topic}について、{feeling}と{action}が重なっている状態として見えます。"
```

`_compose_reception_sentence()` でも同じfocusを見る。

```python
# 実装段階の案。設計書内の説明用であり、このまま実ファイル化するとは限らない。

def _compose_reception_sentence(*, current_input: Mapping[str, Any] | None, material_route: Any) -> str:
    semantic_ids = _semantic_material_ids_for_recomposition(
        current_input=current_input,
        material_route=material_route,
    )
    focus = _surface_semantic_focus(semantic_ids)

    if focus == "recovered_energy_future_direction":
        return _compose_recovered_energy_future_direction_reception()

    # existing self-denial / positive / generic fallback
    ...
```

### surface案

固定文としてではなく、到達方向の例として置く。

```text
observation方向:
  今は、やってみたいと思えた気持ちを大事にしながら、次の頑張り方を探している状態に見えます。

reception方向:
  自分にも出来るかもしれないと思えた瞬間を流さず、その気持ちを確かめようとしているところを、Emlisは受け取りました。
```

### 重要判断

このsurface方向は、H case専用ではない。  
条件はcase idではなく、以下のsemantic material idsである。

```text
required:
  recovered_energy
  future_intention

supporting:
  value_preservation
  self_observation
```

### 完了条件

```text
- H caseで `やってみたい` / `次の頑張り方` / `出来るかもしれない` 相当が本文へ残る。
- `生活について、平穏の動き` がHの本文中心に出ない。
- I/Jのlimited_grounding pathは既存greenを維持する。
- labelled two-stage shapeを維持する。
- public meta body-free boundaryを維持する。
```

---

## R4: Generic Surface Guard for Eligible Semantic Material

### 目的

semantic material idsが十分あるeligible入力で、category/emotion/action generic surfaceが主surfaceになるのを検知する。

### 対象候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_product_surface_validation.py
mashos-api/ai/services/ai_inference/emlis_ai_question_dominance_guard.py
mashos-api/ai/services/ai_inference/emlis_ai_visible_surface_acceptance_gate.py
または新規test helperのみ
```

### 推奨

今回の初回実装では、runtime Gateに新しいblockerを追加しない。  
まずtest側のauditとして検知する。

理由:

```text
- runtime Gateを増やすと、別familyの表示到達へ影響する。
- 今回のredは、candidateを止めるよりsurfaceを具体化する方が直接的である。
- generic検知はP4 ratings / audit側で先に固定し、必要になったらVisible Gateへ接続する。
```

### test helper案

```python
# 実装段階の案。設計書内の説明用であり、このまま実ファイル化するとは限らない。

def assert_no_generic_future_direction_surface(comment_text: str, *, focus: str) -> None:
    if focus != "recovered_energy_future_direction":
        return
    forbidden_fragments = (
        "生活について、平穏の動き",
        "次にどう扱うかを探している動き",
        "良かった動きも迷いもどちらかに寄せず",
    )
    for fragment in forbidden_fragments:
        assert fragment not in comment_text
```

### 完了条件

```text
- H red再発時に、単にexpected fragment missingではなくgeneric surface blockerとして読める。
- runtime Gateは緩めていない。
- public metaへcomment_text bodyを出していない。
```

---

## R5: H/I/J E2E Green

### 目的

H/I/J submit E2Eをgreenへ戻す。

### 対象

```text
mashos-api/ai/tests/test_emlis_ai_hij_reception_required_regression_p8.py
```

### 実行コマンド

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_hij_reception_required_regression_p8.py \
  -vv
```

### 完了条件

```text
- p8_H_recovered_energy_future_direction green
- p8_I_limited_recovered_energy_relationship_wish green維持
- p8_J_limited_comparison_baseline_small_change green維持
- public response shape unchanged
- public meta body-free
- question dominance guard passed
- display_gate_relaxed false
- fixed_fallback_used false
- case_specific_route_used false
- case_id_runtime_condition_used false
```

---

## R6: P0〜P4周辺回帰

### 目的

H red修正で、P0/P1/P2/P3/P4周辺の既存境界を壊していないか確認する。

### 実行対象

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
 tests/test_emlis_ai_public_observation_recovery_acceptance_p0.py \
 tests/test_emlis_ai_public_surface_requirement_p1.py \
 tests/test_emlis_ai_public_surface_requirement_limited_lowinfo_reception_p1.py \
 tests/test_emlis_ai_gate_recovery_limited_lowinfo_reception_p2.py \
 tests/test_emlis_ai_labelled_two_stage_limited_reception_p3.py \
 tests/test_emlis_ai_limited_grounding_reception_surface_p4.py \
 tests/test_emlis_ai_product_surface_validation_p3.py \
 tests/test_emlis_ai_existing_regression_contract_p9.py \
 tests/test_emlis_ai_hij_input_material_bundle_current_p0.py \
 tests/test_emlis_ai_low_information_reception_required_p5.py \
 tests/test_emlis_ai_product_surface_question_dominance_guard_p6.py \
 tests/test_emlis_ai_hij_reception_required_regression_p8.py
```

### 完了条件

```text
- 対象subset green
- H/I/J red resolved
- low_information / limited_grounding / question dominance / existing contractを壊していない
```

---

## R7: P3 / P4 Product Read Feel Regression

### 目的

P4修正が、P3/P4の既存測定器を壊していないか確認する。

### P3実行対象

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
 tests/test_emlis_ai_product_readfeel_p3_contract_freeze_20260609.py \
 tests/test_emlis_ai_product_readfeel_baseline_case_matrix_20260609.py \
 tests/test_emlis_ai_product_readfeel_p3_local_output_capture_20260609.py \
 tests/test_emlis_ai_product_readfeel_p3_inventory_connection_20260609.py \
 tests/test_emlis_ai_product_readfeel_p3_verdict_split_20260609.py \
 tests/test_emlis_ai_product_readfeel_p3_blind_qa_ratings_review_20260609.py \
 tests/test_emlis_ai_product_readfeel_p3_repair_priority_ledger_20260609.py \
 tests/test_emlis_ai_product_readfeel_p3_first_repair_design_20260609.py \
 tests/test_emlis_ai_product_readfeel_p3_regression_20260609.py \
 tests/test_emlis_ai_product_readfeel_p3_p4_p5_connection_decision_20260609.py
```

### P4実行対象

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
 tests/test_emlis_ai_product_readfeel_p4_connection_freeze_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_target_case_selection_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_material_audit_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_surface_requirement_boundary_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_family_tuning_policy_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_surface_signature_audit_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_daily_unpleasant_family_tuning_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_structure_question_family_tuning_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_self_denial_yellow_review_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_ratings_review_20260610.py \
 tests/test_emlis_ai_product_readfeel_p4_regression_handoff_20260610.py
```

### 完了条件

```text
- P3 59 tests green維持
- P4 60 tests green維持
- P3/P4 greenをProduct Read Feel完了とは扱わない
- P5 hold判断を解除しない
```

---

## R8: RN Contract Regression

### 目的

backend surface修正がRN contractを変えていないことを確認する。

### 実行対象

```bash
cd Cocolon
npm run test:rn-screens --silent
```

### 完了条件

```text
- 36 passed維持
- `input_feedback.comment_text` visible body契約維持
- RN表示条件変更なし
```

---

## R9: Compile / Collect-only

### 目的

実装差分が構文・collectionを壊していないことを確認する。

### 実行対象

```bash
cd mashos-api/ai
python3 -m compileall -q services/ai_inference tests
PYTHONPATH=services/ai_inference pytest --collect-only -q
```

### 完了条件

```text
- compileall pass
- collect-onlyが通る
- test countの増減があれば理由を記録する
```

---

## R10: Result Memo / Handoff

### 目的

修正結果を、P4 runtime red repair結果として残す。

### 成果物候補

```text
Cocolon_EmlisAI_P4_RuntimeBackfill_HIJ_FutureDirectionSurfaceRepair_ImplementationResult_20260624.md
```

### 記載すること

```text
確認済み:
  - red再現結果
  - 修正対象ファイル
  - 実行test結果
  - H/I/J green結果
  - P0〜P4周辺結果
  - P3/P4結果
  - RN結果

未確認:
  - full backend suite green
  - 実機submit
  - 外部ユーザーreadfeel
  - P5 human Blind QA evidence

書かれていない:
  - P5/P6/P8へ進んでよい根拠
  - release_allowed true根拠

推測禁止:
  - H/I/J greenだけでP4完了と扱うこと
  - P3/P4 helper greenだけで商品読感合格と扱うこと

次に実行すべきこと:
  - P4残red / daily_positive / future_direction family拡張
  - actual human readfeelへ進めるかの再判定
```

---

## 7. JSON / schema 案

この章のschemaは設計案であり、今回実ファイル化しない。  
実装段階で、既存test helper内に置くか、新規moduleにするか、json fixture化するか、ファイル化せずmd内の実装基準だけに留めるかを判断する。

---

### 7.1 Body-free Red Repair Case Audit Schema案

目的: redの分類・surface path・contract flagsをbody-freeに固定する。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p4_runtime_red_repair.case_audit.v1",
  "title": "EmlisAI P4 Runtime Red Repair Case Audit",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "red_id",
    "case_id",
    "phase",
    "target_scope",
    "material_audit",
    "surface_path_audit",
    "surface_specificity_audit",
    "public_contract_flags",
    "body_boundary"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p4_runtime_red_repair.case_audit.v1"
    },
    "red_id": {
      "type": "string",
      "pattern": "^P4-HIJ-[A-Z0-9_-]+$"
    },
    "case_id": {
      "type": "string",
      "minLength": 1,
      "maxLength": 128
    },
    "phase": {
      "const": "P4_runtime_backfill_red_repair"
    },
    "target_scope": {
      "type": "object",
      "additionalProperties": false,
      "required": ["family", "repair_kind", "not_release_decision"],
      "properties": {
        "family": {
          "enum": [
            "change_future_intention",
            "daily_positive",
            "limited_grounding",
            "standard_state_answer",
            "unknown"
          ]
        },
        "repair_kind": {
          "enum": [
            "current_only_surface_specificity",
            "material_surface_drop",
            "generic_reception_surface",
            "candidate_lineage_audit"
          ]
        },
        "not_release_decision": { "const": true }
      }
    },
    "material_audit": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "material_quality",
        "visible_material_slot_ids",
        "semantic_material_ids",
        "semantic_focus_id",
        "semantic_material_count"
      ],
      "properties": {
        "material_quality": {
          "enum": ["eligible", "limited_grounding", "low_information", "safety_triage_required"]
        },
        "visible_material_slot_ids": {
          "type": "array",
          "items": { "type": "string", "maxLength": 64 },
          "uniqueItems": true
        },
        "semantic_material_ids": {
          "type": "array",
          "items": {
            "enum": [
              "recovered_energy",
              "future_intention",
              "value_preservation",
              "self_observation",
              "relationship_wish",
              "comparison_baseline_shift",
              "small_change_preservation"
            ]
          },
          "uniqueItems": true
        },
        "semantic_focus_id": {
          "enum": [
            "recovered_energy_future_direction",
            "recovered_energy_relationship_wish",
            "comparison_baseline_small_change",
            "generic_visible_material"
          ]
        },
        "semantic_material_count": {
          "type": "integer",
          "minimum": 0
        }
      }
    },
    "surface_path_audit": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "selected_public_candidate_source_kind",
        "root_candidate_source_kind",
        "complete_initial_surface_recomposition_used",
        "labelled_two_stage_surface_recomposition_used",
        "limited_grounding_reception_surface_used"
      ],
      "properties": {
        "selected_public_candidate_source_kind": { "type": "string", "maxLength": 128 },
        "root_candidate_source_kind": { "type": "string", "maxLength": 128 },
        "complete_initial_surface_recomposition_used": { "type": "boolean" },
        "labelled_two_stage_surface_recomposition_used": { "type": "boolean" },
        "limited_grounding_reception_surface_used": { "type": "boolean" }
      }
    },
    "surface_specificity_audit": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "specificity_required",
        "specificity_met",
        "generic_surface_detected",
        "missing_surface_role_ids",
        "forbidden_generic_signature_ids"
      ],
      "properties": {
        "specificity_required": { "type": "boolean" },
        "specificity_met": { "type": "boolean" },
        "generic_surface_detected": { "type": "boolean" },
        "missing_surface_role_ids": {
          "type": "array",
          "items": {
            "enum": [
              "recovered_energy_visible",
              "future_direction_visible",
              "self_possibility_visible",
              "value_preservation_visible"
            ]
          },
          "uniqueItems": true
        },
        "forbidden_generic_signature_ids": {
          "type": "array",
          "items": {
            "enum": [
              "category_emotion_action_generic",
              "next_handling_generic",
              "positive_generic_reception"
            ]
          },
          "uniqueItems": true
        }
      }
    },
    "public_contract_flags": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "public_response_key_added",
        "response_shape_changed",
        "api_route_changed",
        "db_physical_name_changed",
        "rn_visible_contract_changed",
        "display_gate_relaxed",
        "fixed_fallback_used",
        "case_specific_route_used",
        "case_id_runtime_condition_used"
      ],
      "properties": {
        "public_response_key_added": { "const": false },
        "response_shape_changed": { "const": false },
        "api_route_changed": { "const": false },
        "db_physical_name_changed": { "const": false },
        "rn_visible_contract_changed": { "const": false },
        "display_gate_relaxed": { "const": false },
        "fixed_fallback_used": { "const": false },
        "case_specific_route_used": { "const": false },
        "case_id_runtime_condition_used": { "const": false }
      }
    },
    "body_boundary": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "body_free",
        "raw_input_included",
        "raw_text_included",
        "comment_text_body_included",
        "candidate_body_included"
      ],
      "properties": {
        "body_free": { "const": true },
        "raw_input_included": { "const": false },
        "raw_text_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "candidate_body_included": { "const": false }
      }
    }
  }
}
```

---

### 7.2 Surface Semantic Focus Schema案

目的: raw textではなく、surfaceへ使ってよい材料方向をidで固定する。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.surface_semantic_focus.v1",
  "title": "EmlisAI Surface Semantic Focus",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "semantic_focus_id",
    "semantic_material_ids",
    "surface_role_requirements",
    "blocked_generic_signature_ids",
    "body_boundary"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.surface_semantic_focus.v1"
    },
    "semantic_focus_id": {
      "enum": [
        "recovered_energy_future_direction",
        "recovered_energy_relationship_wish",
        "comparison_baseline_small_change",
        "self_observation_value_preservation",
        "generic_visible_material"
      ]
    },
    "semantic_material_ids": {
      "type": "array",
      "items": {
        "enum": [
          "recovered_energy",
          "future_intention",
          "relationship_wish",
          "comparison_baseline_shift",
          "small_change_preservation",
          "value_preservation",
          "self_observation"
        ]
      },
      "uniqueItems": true
    },
    "surface_role_requirements": {
      "type": "array",
      "items": {
        "enum": [
          "show_recovered_energy_as_current_state",
          "show_future_direction_as_next_effort",
          "show_self_possibility_without_prediction",
          "show_value_preservation_without_advice",
          "keep_observation_and_reception_sections"
        ]
      },
      "uniqueItems": true
    },
    "blocked_generic_signature_ids": {
      "type": "array",
      "items": {
        "enum": [
          "category_emotion_action_generic",
          "next_handling_generic",
          "generic_positive_reception",
          "question_dominant_surface"
        ]
      },
      "uniqueItems": true
    },
    "body_boundary": {
      "type": "object",
      "additionalProperties": false,
      "required": ["body_free", "raw_input_included", "comment_text_body_included"],
      "properties": {
        "body_free": { "const": true },
        "raw_input_included": { "const": false },
        "comment_text_body_included": { "const": false }
      }
    }
  }
}
```

---

### 7.3 Local-only Expected Surface Fragment Fixture案

目的: test localでのみ、期待fragmentを持つ。public meta / scorecardへ出さない。

```json
{
  "schema_version": "cocolon.emlis.p4_runtime_red_repair.local_expected_fragments.v1",
  "local_only": true,
  "public_meta_allowed": false,
  "case_id": "p8_H_recovered_energy_future_direction",
  "semantic_focus_id": "recovered_energy_future_direction",
  "expected_comment_fragments": [
    "やってみたい",
    "次の頑張り方",
    "出来るかもしれない"
  ],
  "forbidden_comment_fragments": [
    "生活について、平穏の動き",
    "次にどう扱うかを探している動き",
    "良かった動きも迷いもどちらかに寄せず"
  ],
  "body_boundary": {
    "body_free": false,
    "contains_expected_surface_text": true,
    "raw_input_included": false,
    "comment_text_body_included": false,
    "must_not_enter_public_meta": true
  }
}
```

注意:

```text
- これはlocal test fixtureとしてだけ許容する。
- public meta / product scorecard / release materialへ入れてはいけない。
- 実装段階で既存test内のtupleで十分なら、json化しない。
```

---

## 8. Test設計

### 8.1 新規test候補

```text
tests/test_emlis_ai_p4_runtime_backfill_hij_future_direction_surface_repair_20260624.py
```

### 8.2 test case 1: material semantic focus

目的: H caseが `recovered_energy_future_direction` として読めることを固定する。

```text
assert material_quality == eligible
assert relation_material_ids contains recovered_energy
assert relation_material_ids contains future_intention
assert relation_material_ids contains value_preservation
assert relation_material_ids contains self_observation
assert semantic_focus_id == recovered_energy_future_direction
```

### 8.3 test case 2: labelled two-stage recomposition surface

目的: eligible non-limited pathでもfuture-direction核がgenericへ落ちないことを固定する。

```text
build_labelled_two_stage_surface_recomposition_candidate(...)

assert comment_text startswith 見えたこと：
assert comment_text contains Emlisから：
assert comment_text contains やってみたい
assert comment_text contains 次の頑張り方
assert comment_text contains 出来るかもしれない
assert comment_text not contains 生活について、平穏の動き
assert comment_text not contains 次にどう扱うかを探している動き
assert meta raw_input_included is False
assert meta comment_text_body_included is False
assert case_specific_route_used is False
```

### 8.4 test case 3: existing limited grounding I/J preserved

目的: limited_grounding branchの既存greenを壊していないことを確認する。

```text
p8_I_limited_recovered_energy_relationship_wish remains green
p8_J_limited_comparison_baseline_small_change remains green
limited_grounding_reception_surface_used remains allowed for limited cases
```

### 8.5 test case 4: no contract change

目的: public contract境界を維持する。

```text
public_response_key_added false
response_shape_changed false
api_route_changed false
db_physical_name_changed false
rn_visible_contract_changed false
raw_input_included false
comment_text_body_included false
```

### 8.6 既存testで守ること

```text
- test_emlis_ai_hij_reception_required_regression_p8.py
- test_emlis_ai_hij_input_material_bundle_current_p0.py
- test_emlis_ai_limited_grounding_reception_surface_p4.py
- test_emlis_ai_public_surface_requirement_p1.py
- test_emlis_ai_product_surface_validation_p3.py
- test_emlis_ai_product_surface_question_dominance_guard_p6.py
```

---

## 9. 実装時のファイル判断

### 9.1 最小変更で済む場合

```text
変更候補:
  services/ai_inference/emlis_ai_labelled_two_stage_surface_recomposition.py
  tests/test_emlis_ai_p4_runtime_backfill_hij_future_direction_surface_repair_20260624.py

既存test変更:
  原則しない。
  既存testの期待値を緩めない。
```

### 9.2 共通helper化が必要な場合

```text
追加候補:
  services/ai_inference/emlis_ai_surface_semantic_focus.py

変更候補:
  services/ai_inference/emlis_ai_complete_initial_surface_recomposition.py
  services/ai_inference/emlis_ai_labelled_two_stage_surface_recomposition.py
  services/ai_inference/emlis_ai_limited_grounding_reception_surface.py
```

ただし、初回修正では共通helper化を急がない。  
3 moduleのsemantic patternを一気に統合すると、limited_groundingやcomplete_initialの既存greenへ影響が広がるためである。

### 9.3 json / schemaを実ファイル化する判断基準

実装段階で次のどれかに該当する場合のみ、json/schema実ファイル化を検討する。

```text
- 複数testで同じbody-free audit schemaを使う。
- P4 red ledgerへ継続的にcaseを追加する。
- P4 ratings / audit runnerがこのsummaryを読む必要がある。
- raw bodyを含まないことをschemaで強制する必要がある。
```

次の場合は実ファイル化しない。

```text
- H red単体の修正で終わる。
- test helper内のassertで十分。
- schema化すると実装範囲が広がる。
- public metaへ誤って接続されるリスクが上がる。
```

---

## 10. Rollback / fail-closed条件

### 10.1 rollback条件

実装後、次が出た場合は差分を戻す。

```text
- I/J limited_grounding greenが壊れる。
- low_informationがeligibleへ過剰昇格する。
- self_denial系がpositive / future_direction surfaceへ誤分類される。
- public metaへraw input / comment_text bodyが入る。
- display_gate_relaxedがtrueになる。
- fixed_fallback_usedがtrueになる。
- case_specific_route_usedがtrueになる。
- RN contractがredになる。
- response shapeが変わる。
```

### 10.2 fail-closed方針

この修正は、表示率を上げるためのfail-openではない。  
semantic focusが判定できない場合は、既存generic fallbackへ戻す。  
ただし、semantic material idsが十分ある入力をgenericへ落とした場合はP4 audit上のrepair targetとして残す。

```text
semantic focus判定できる:
  family-specific / semantic-specific surfaceへ進む

semantic focus判定できない:
  既存generic fallbackを使う
  ただしP4 auditでgeneric surface signatureを記録する
```

---

## 11. 完了条件

今回の完了条件は狭く固定する。

```text
1. H/I/J submit E2E redを再現済みとして固定する。
2. H caseのmaterial routeがeligibleであり、semantic idsを保持していることを確認する。
3. 実submitで選ばれるlabelled two-stage recomposition laneでも、future-direction核を本文へ残す。
4. H caseで以下の核が本文へ残る。
   - やってみたい
   - 次の頑張り方
   - 出来るかもしれない
5. H caseで以下のgeneric surfaceを中心にしない。
   - 生活について、平穏の動き
   - 次にどう扱うかを探している動き
6. I/Jのlimited_grounding greenを維持する。
7. public response shapeを変えない。
8. public meta body-free境界を維持する。
9. Gateを緩めない。
10. case専用route / fixed fallbackを使わない。
11. P0〜P4周辺subsetをgreenに戻す。
12. P3/P4既存測定器greenを維持する。
13. RN contract greenを維持する。
```

---

## 12. 完了しても言ってはいけないこと

この修正が完了しても、次は言わない。

```text
- P4が完了した。
- Product Read Feel v1が商品合格した。
- P5へ進んでよい。
- P6 limited human readfeelへ進んでよい。
- P8観測補助問い詳細設計へ進んでよい。
- release_allowedをtrueにしてよい。
```

今回の修正で言ってよいのは、次までである。

```text
H/I/J submit E2E上のH future-direction surface redを修正した。
P4 current-only readfeel / surface specificity の一部をruntimeへbackfillした。
次に、P4残familyと実機/人間読感確認へ進めるか再判定する材料が増えた。
```

---

## 13. 書かれていない

```text
- H/I/J greenだけでP4完了としてよい、とは書かれていない。
- P3/P4 helper greenだけで商品品質合格としてよい、とは書かれていない。
- P5履歴線でcurrent input読感不足を補ってよい、とは書かれていない。
- H caseをlimited_groundingへ分類変更してよい、とは書かれていない。
- public metaへsemantic surface textやexpected fragmentを出してよい、とは書かれていない。
- 観測補助問いでH redを補ってよい、とは書かれていない。
- RN/API/DB/response keyを変えてよい、とは書かれていない。
```

---

## 14. 推測禁止

```text
- 「表示されているから読感も大丈夫」と扱わない。
- 「I/Jが通っているからHも同じ設計で大丈夫」と扱わない。
- 「complete_initial側にsemantic branchがあるから実submitも大丈夫」と扱わない。
- 「labelled two-stageに回る理由が未確定だから、surface修正できない」と扱わない。
- 「Hだけ通すためにcase分岐すればよい」と扱わない。
- 「P7/R55 greenだからP8へ進める」と扱わない。
```

---

## 15. 華恋の判断

華恋の判断として、今回の赤は小さい文言差分ではありません。

H caseの入力には、次の流れがあります。

```text
落ち込んでいた
何もしたくなかった
自信をなくして諦めていた
それでも、ふと「やってみたい」「出来るかもしれない」と思えた
その気持ちを大事にしたい
次にどう頑張るか知っていきたい
```

これを、

```text
生活について、平穏の動きと次にどう扱うか
```

へ潰すのは、Cocolonの「人間の言葉を雑に処理しない場所」という方向から外れます。

しかも、材料層にはsemantic idsが残っています。  
つまり、読める材料がなかったのではなく、**読めていた材料を、visible surfaceへ最後まで運べていない**可能性が高いです。

だから、今回の実装順はP5でもP7でもP8でもなく、P4のruntime backfillです。  
Cocolonとして在るべき姿に戻すなら、ここを先に直します。

---

## 16. 次に実装へ入る場合の最初の作業

実装段階の最初の作業は、次に固定する。

```text
Step 1:
  H redを再実行し、red ledgerとして固定する。

Step 2:
  H caseのmaterial route / requirement / selected candidate lineageをbody-freeでauditする。

Step 3:
  emlis_ai_labelled_two_stage_surface_recomposition.py のeligible non-limited pathへ、
  recovered_energy_future_direction semantic focus branchを追加する。

Step 4:
  H/I/J E2Eをgreenへ戻す。

Step 5:
  P0〜P4 surrounding subset / P3 / P4 / RN contractを再実行する。
```

この順で進める。  
先に共通helper化やP5/P7拡張へ行かない。
