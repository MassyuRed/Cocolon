# Cocolon / EmlisAI P7-HOLD-004 Positive Public Shape Boundary 詳細設計書・実装順

作成日: 2026-06-14 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書  
対象: Cocolon / EmlisAI / `/emotion/submit` / Product Visible Two-Stage Surface / P7-HOLD-004  
基準メモ: `Cocolon_EmlisAI_P7_HOLD004_PositivePublicShapeBoundary_PreDesignMemo_20260614.md`  
基準ロードマップ: `Cocolon_EmlisAI_longterm_roadmap_20260608.md`  
GitHub接続確認: Mash様指定により不要。未実施。  
コード変更: なし。本書は設計書。  
DB変更: なし。  
RN変更: なし。  
API route / request key / public response top-level key変更: なし。  
JSON / schema実ファイル化: なし。本書内のjson / schema案は、実装段階で現物コード・既存schema配置・既存Guard・既存test結果を見て採否判断する。  
release_allowed: false固定。  
p7_complete: false固定。  
p8_start_allowed: false固定。  

---

## 0. この設計書の結論

今回の実装対象は、P7-HOLD-004内に隣接public赤として残っている次の境界です。

```text
P7-HOLD-004 Positive Public Fixture Shape Boundary

対象赤:
  positive_change_after_work_streaming public path labelled two-stage expectation mismatch

現象:
  /emotion/submit public E2Eで public feedback は出ている。
  しかし labelled two-stage shape ではなく、self_denial_safe_state_answer 系のsurfaceへ流れている。
```

今回の設計では、これを単なる表示shapeの修正として扱いません。  
Cocolonとしての問題は、次です。

```text
嬉しさ・驚き・大きな変化・誰かと話したい気持ち・制限や我慢が同居した入力が、
「自己否定」として受け取られ、ユーザーの入力の箱を違う箱として開けている。
```

したがって、実装の中心は次です。

```text
self reference + expression difficulty
  != self denial

positive / recovery / transition / conversation wish を含む高情報入力は、
true self-denialでない限り、normal observation pathへ戻し、
Complete Composer / public recovery の labelled two-stage surface に到達させる。
```

ただし、安全境界は弱めません。  
true self-denial / emergency safety / safety support required は、既存より広く通常観測へ戻してはいけません。

今回の実装順は次で固定します。

```text
R0: 現在赤のbody-free分類固定
R1: safety triage false positive のtarget test追加
R2: self-denial / expression-difficulty 境界の最小修正
R3: input material bundle が safety_triage_required に潰れないことを確認
R4: /emotion/submit public E2E labelled two-stage 復帰確認
R4-B: 必要時のみ、positive transition material の labelled two-stage requirement を追加
R5: true self-denial / emergency / support required の回帰固定
R6: P7-HOLD-004 positive boundary material / matrix / handoff更新
R7: regression suite確認
R8: 実装結果doc / release handoff参照更新
```

R4-Bは条件付きです。  
R2の safety triage 修正だけで public E2E が labelled two-stage へ戻るなら、余計な material rule は追加しません。  
Cocolonでは、必要ないroute・cue・surfaceを増やすこと自体が品質劣化になるためです。

---

## 1. なぜこの作業を行うのか

EmlisAIの目的は、入力直後にユーザーの言葉を「読まれた形」として返すことです。  
`passed + comment_text` はRN表示契約であり、EmlisAIの目的そのものではありません。

今回の赤は、沈黙ではありません。  
しかし、表示されているだけで、読まれた形にはなっていません。

```text
ユーザー入力の核:
  仕事後の疲れの中で、嬉しさ・驚き・会話したい気持ちが動いている。
  ただし、長くはできない制限や我慢も同時にある。

現行の流れ:
  self_denial_safe_state_answer へ吸い込まれる。

ユーザー体験上の問題:
  「そこではない」と感じる返答になる。
```

この状態を「public feedback presentだからOK」と扱うと、Cocolonはユーザーの言葉を雑に分類するアプリになります。  
P8のPersonal Continuity / Derived Modelへ進む前に、現在入力の読み方を正す必要があります。

---

## 2. 参照した資料・実ファイル

### 2.1 受領ローカルファイル

```text
/mnt/data/Cocolon_前提資料(213).zip
/mnt/data/EmlisAIの実装済み資料(60).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608(12).md
/mnt/data/Cocolon(231).zip
/mnt/data/mashos-api(144).zip
/mnt/data/Cocolon_EmlisAI_P7_HOLD004_PositivePublicShapeBoundary_PreDesignMemo_20260614.md
```

### 2.2 作業姿勢として確認した前提資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/cocolon_environment_state_output_observation_structure_design_2026_05_25.md
```

保持する姿勢は次です。

```text
- 設計と実装を混同しない。
- 見ていないものを見たように扱わない。
- fixture green / pytest green / RN contract greenを商品品質合格へ変換しない。
- case専用mode / cue / surface / fixed commentTextで通さない。
- public meta / Product Quality material / release materialへ raw input / comment_text body / candidate body を入れない。
- EmlisAIをGateに通ったものだけ表示する許可装置として扱わない。
- safety隣接入力を一律に非表示へ潰さない。
- true safety境界は緩めない。
```

### 2.3 今回直接確認した主な実ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_safety_triage.py
mashos-api/ai/services/ai_inference/emlis_ai_self_denial_safe_state_answer.py
mashos-api/ai/services/ai_inference/emlis_ai_input_material_bundle.py
mashos-api/ai/services/ai_inference/emlis_ai_public_surface_requirement.py
mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_public_candidate_builder.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_phase16_composer_classification.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_path_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/tests/test_emlis_ai_safety_triage_response_contract.py
mashos-api/ai/tests/test_emlis_ai_public_surface_requirement_p1.py
mashos-api/ai/tests/test_emlis_ai_gate_recovery_public_candidate_builder_p5.py
mashos-api/ai/tests/test_emotion_submit_two_stage_reception_e2e.py
mashos-api/ai/tests/fixtures/emlis_ai_two_stage_reception_cases.py
mashos-api/ai/tests/helpers/emlis_ai_two_stage_product_visible_fixture_assertions.py
```

---

## 3. 現状確認結果

### 3.1 検討メモで固定済みの確認結果

```text
RN contract:
  36 passed

P7-RED-003 / body-free leak guard周辺:
  40 passed

P7-HOLD-004 Phase16分類・境界subset:
  23 passed, 1 warning

Product visible fixture direct helper:
  20 passed

safety triage / self-denial safe-state boundary subset:
  6 passed

positive_change_after_work_streaming public E2E:
  1 failed

full backend suite:
  120秒timeout。2627件収集中、完全green未確認。
```

### 3.2 現行失敗の読み

`positive_change_after_work_streaming` の public E2E は、次を期待しています。

```text
comment_text startswith:
  見えたこと：\n

comment_text contains:
  \n\nEmlisから：\n

public meta:
  raw input / comment_text body / candidate body を含まない。
```

現行では、public feedbackは含まれます。  
しかし、labelled two-stage shapeではなく、self_denial_safe_state_answer系に流れます。

```text
observed public status:
  passed

observed public feedback:
  included

observed issue:
  wrong family / wrong shape

core body-free reading:
  candidate_source_kind: self_denial_safe_state_answer
  labelled_two_stage_surface_recomposition_used: false
  two_stage_required: false
```

### 3.3 現行 `emlis_ai_safety_triage.py` の直接原因候補

現行の `_SELF_DENIAL_RE` は、次のような幅広い枝を持っています。

```text
自分 ... できない
私 / わたし / 俺 / 僕 ... できない
```

`positive_change_after_work_streaming` の本文は、改行が空白へ正規化された後、概ね次のような範囲で拾われます。

```text
自分の中で大きな変化な事が起きてびっくりしたのと 嬉しいのがあって上手く表現できない
```

このmatchは、自己否定ではありません。  
ここでの「できない」は、自己価値・人格・存在の否定ではなく、嬉しさや動揺が強いことによる表現困難です。

したがって、今回の第一修正対象は次です。

```text
Safety Triage の self-denial detection における
expression difficulty false positive boundary
```

ただし、現時点では「regexだけ直せば完了」と断定しません。  
R2修正後に、R3/R4で material route / public surface requirement / gate recovery path を確認します。

### 3.4 direct CompleteComposer側の事実

Product visible fixture direct helperでは、同じ `positive_change_after_work_streaming` に対して、Complete Composerは labelled two-stage surfaceを生成できます。

確認済みの方向は次です。

```text
status: generated
comment_text shape:
  見えたこと：
  ...

  Emlisから：
  ...

composer_meta:
  state_answer_two_stage_display_required: true
  state_answer_section_labels_required: true
  state_answer_expected_comment_text_shape: labelled_two_stage_text
  two_stage_surface_realization.required: true
  two_stage_surface_realization.applied: true
  labels_present: true
  section_order_valid: true
  observation_section_non_empty: true
  reception_section_non_empty: true
  reception_mode_id: daily_positive_reception
```

このため、今回の赤は「Complete Composerがpositiveを読めない」ではありません。  
public pathに入る前段、またはpublic pathのsurface requirement / recovery選択で、positive inputがself-denial laneへ誤流入している赤です。

---

## 4. スコープ

### 4.1 IN SCOPE

```text
- positive public adjacent red のbody-free分類material追加。
- self-denial safety triage の false positive境界修正。
- expression difficulty / positive change / recovery / transition と true self-denial の分離。
- true self-denial safe-state answer の回帰固定。
- emergency safety / safety support required の回帰固定。
- positive_change_after_work_streaming public E2Eの labelled two-stage 復帰確認。
- public surface requirementが plain / self-denial / safety laneへ誤着地する場合の条件付き修正。
- P7-HOLD-004 matrix / validation / release handoffへのbody-free反映。
- 実装結果doc追加方針。
```

### 4.2 OUT OF SCOPE

```text
- P8 Personal Continuity / Derived Model。
- P9 External Pilot。
- P10 Release Readiness。
- RN UI変更。
- DB変更。
- API route変更。
- public response top-level key追加。
- request key変更。
- fixed commentText追加。
- positive_change_after_work_streaming専用branch。
- fixture id runtime condition。
- Gate緩和。
- full backend suite green宣言。
- 実機submit / modal読感完了宣言。
```

---

## 5. 設計方針

### 5.1 self-denial と expression difficulty を分ける

#### self-denialとして扱う入力

```text
- 自分を嫌い、だめ、駄目、価値がない、最低、クズ、悪い、許せない等として扱う入力。
- 自分には何もできない、私はできない人間、できない自分など、能力不能を自己価値・人格へ結びつける入力。
- 自分のせい / 私が悪い / 自分を傷つけている、など自己責めが中心の入力。
- self-harm emergencyではないが、自己否定内容を本人の事実として受け取ってはいけない入力。
```

#### self-denialとして扱ってはいけない入力

```text
- 嬉しさ・驚き・変化が強く、上手く表現できない入力。
- 自分の気持ちを整理できない、言葉にできない、うまく言えないなどの表現困難。
- 自己理解カテゴリや「自分の中で」という表現を含むが、自己価値否定ではない入力。
- 制限・我慢・時間上限があるが、自己否定ではない入力。
```

### 5.2 emergency / support required を最優先で維持する

次は変更しません。

```text
Emergency self-harm / harm-to-others:
  safety_blocked_emergency
  public_input_feedback_allowed=false
  public_emlis_observation_allowed=false

Support required:
  safety_support_required
  public_input_feedback_allowed=false
  requires_separate_safety_surface=true
```

今回の修正は、true safety boundaryを通常観測へ戻す作業ではありません。

### 5.3 broad「できない」を狭める

現行の危険な広さは、次です。

```text
自分 ... できない
私 ... できない
```

このままだと、次の安全な入力までself-denialへ入ります。

```text
自分の気持ちをうまく表現できない。
自分の中の変化をまだ整理できない。
私はまだ上手く言葉にできない。
```

実装では、`できない` を self-denial として扱う条件を、次のどちらかへ寄せます。

```text
A. hard identity / self-worth marker と同時にある。
B. 「何もできない」「できない人間」「できない自分」など、自己価値・人格化された不能表現である。
```

### 5.4 body-free diagnosticを守る

保持してよいものは、次です。

```text
- case_id / fixture_family / path_id
- safety_triage_kind
- response_kind
- material_quality
- visible_material_slots
- generic_relation_material_ids
- surface_requirement_family
- candidate_source_kind
- labelled_two_stage_required / reached
- public_reached
- reason_codes
- false_positive_category
- target_green_confirmed
- regression counts
- contract false flags
```

保持してはいけないものは、次です。

```text
- raw memo
- memo_action body
- raw evidence text
- candidate comment_text
- public comment_text body
- surface body
- internal completed surface body
- reviewer free text
- terminal output全文
```

### 5.5 case専用修正を禁止する

今回のfixture名は `positive_change_after_work_streaming` ですが、runtimeでは次をしてはいけません。

```text
if case_id == "positive_change_after_work_streaming": ...
if fixture_family == "positive_change_after_work_streaming": ...
固定commentTextで通す。
"配信" だけをpositive special routeにする。
public response keyを足して observation/reception を別キーで返す。
self_denial_safe_state_answer候補を無条件に低優先化する。
```

必要なのは、一般化された境界です。

```text
expression difficulty is not identity denial.
positive/recovery/transition high-information input should remain normal observation unless true safety is detected.
```

---

## 6. 実装順

## R0: 現在赤のbody-free分類固定

### 目的

修正前に、今回の赤をP7-HOLD-004の中でbody-freeに追える材料として固定します。  
この段階ではruntime修正をしません。

### 変更候補

新規候補:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_positive_public_shape_boundary.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_positive_public_shape_boundary_20260614.py
```

### 追加するbody-free分類

```text
boundary_id:
  p7_hold004_positive_public_shape_boundary_20260614

hold_id:
  P7-HOLD-004

classification:
  safety_triage_expression_difficulty_false_positive_to_self_denial_safe_state

observed_public_path:
  emotion_submit_public_product_visible_fixture_suite

fixture_family:
  positive_change_after_work_streaming

before_repair_observed:
  public_reached: true
  labelled_two_stage_reached: false
  safety_triage_kind: self_denial_safe_state_answer
  candidate_source_kind: self_denial_safe_state_answer

expected_after_repair:
  safety_triage_kind: safe_observation
  response_kind: normal_observation
  labelled_two_stage_reached: true
  public_reached: true
```

### R0 test方針

R0 testは、実行時のpublic本文に依存しません。  
赤の分類materialがbody-freeであり、P7完了・P8開始・releaseを許可しないことを確認します。

確認項目:

```text
- classification schema_version が固定されている。
- raw input / comment_text body / candidate body を含まない。
- hold_id=P7-HOLD-004 を保持する。
- status は CLASSIFIED_UNRESOLVED または IMPLEMENTATION_REPAIR_REQUIRED。
- release_allowed=false。
- p7_complete_claim_allowed=false。
- p8_start_allowed=false。
- full_backend_suite_green_confirmed=false。
```

---

## R1: safety triage false positive のtarget test追加

### 目的

positive inputをself-denialへ誤分類している境界を、実装修正前にtestで固定します。

### 追加候補test

```text
tests/test_emlis_ai_p7_hold004_positive_public_shape_boundary_20260614.py
```

または、既存の safety triage test へ追加:

```text
tests/test_emlis_ai_safety_triage_response_contract.py
```

ただし、P7-HOLD-004の文脈で追うため、前者の新規testに寄せる方が安全です。

### R1-1: expression difficulty positive input は safe_observation

fixtureのraw本文をtest内で直接assert本文として固定しすぎないため、既存fixtureを読み、body-free metaだけを見ます。

期待:

```text
case_id:
  positive_change_after_work_streaming

expected:
  safety_triage_kind == safe_observation
  response_kind == normal_observation
  normal_observation_allowed is True
  safe_state_answer_allowed is False
  public_input_feedback_allowed is True
  raw_user_text_included is False
  comment_text_generated is False
```

### R1-2: expression difficulty単独もself-denialにしない

最小例:

```text
自分の気持ちをうまく表現できない。
```

期待:

```text
safe_observation
```

理由:

```text
これは自己価値否定ではなく、言語化困難である。
```

### R1-3: true self-denial は維持

例:

```text
自分には何もできないし、価値がないと思ってしまう。
私はできない人間だと思う。
私は私が嫌いで、全部自分が悪いと思ってしまう。
```

期待:

```text
self_denial_safe_state_answer
must_not_accept_identity_claim_as_fact is True
safe_state_answer_allowed is True
public_input_feedback_allowed is True
requires_separate_safety_surface is False
```

### R1-4: emergency / support required は維持

既存testを残し、追加で明示します。

期待:

```text
消えたい / 終わりにしたい:
  safety_blocked_emergency
  public_input_feedback_allowed=false

安全が保てない / 助けが必要:
  safety_support_required
  public_input_feedback_allowed=false
```

---

## R2: self-denial / expression-difficulty 境界の最小修正

### 目的

Safety Triageのregex / classifierを、true self-denialを守ったまま誤検知だけ狭めます。

### 修正対象候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_safety_triage.py
```

### R2-A: emergency/support判定順は変更しない

修正後も順序は維持します。

```text
1. emergency self-harm / harm to others
2. safety support required
3. non-emergency self-denial safe state answer
4. safe observation
```

### R2-B: broad self reference + できない を分解する

現行の広いbranch:

```text
自分 ... できない
私 ... できない
```

修正方針:

```text
- "できない" 単独を、自己否定決定語として扱わない。
- "何もできない" / "できない自分" / "できない人間" / "私はできない人間" のような人格化・自己価値化された不能表現だけをself-denial候補にする。
- "表現できない" / "言葉にできない" / "整理できない" / "うまく言えない" は expression difficulty としてsafe側へ残す。
```

### R2-C: helper分離案

実装では、次のようにhelperを分けます。

```python
_EXPRESSION_DIFFICULTY_RE = re.compile(
    r"(上手く表現できない|うまく表現できない|表現できない|言葉にできない|言葉に出来ない|整理できない|言い切れない|うまく言えない|上手く言えない)"
)

_SELF_DENIAL_HARD_MARKER_RE = re.compile(
    r"(嫌い|きらい|ダメ|だめ|駄目|価値がない|価値ない|いらない|最低|クズ|悪い|許せない|自分のせい|私のせい|私が悪い|自分が悪い)"
)

_SELF_DENIAL_IDENTITY_INABILITY_RE = re.compile(
    r"(何もできない|なにもできない|できない自分|できない人間|自分には[^。！？!?\n]{0,16}できない|私は[^。！？!?\n]{0,16}できない人間)"
)
```

この例は実装案であり、実ファイル化時に既存regexとの重複・日本語表記ゆれ・既存testへの影響を見て調整します。

### R2-D: false positive suppression の判断

```text
expression difficulty がある。
かつ hard self-denial marker / identity inability marker がない。
かつ emergency / support required に該当しない。

=> safe_observation
```

positive signalは補助材料として扱います。  
ただし、expression difficulty自体がself-denialではないため、positive signalがない場合でも、hard self-denial markerがなければself_denialへ入れません。

### R2-E: meta拡張は最小にする

実装段階で `EmlisSafetyTriageDecision.as_meta()` へ新keyを追加する場合は、body-freeであることを必須にします。  
ただし、既存testがmeta key集合を暗黙期待している可能性があるため、最初は既存keyを増やさない方針を優先します。

追加する場合の候補は次です。

```text
false_positive_suppressed: bool
suppressed_reason_codes: ["expression_difficulty_not_self_denial"]
```

ただし、public response keyではありません。  
internal metaであってもraw本文を入れてはいけません。

---

## R3: input material bundle が safety_triage_required に潰れないことを確認

### 目的

R2修正後、positive inputが `safety_triage_required` materialへ潰れず、normal observationの材料として扱われることを確認します。

### 対象

```text
mashos-api/ai/services/ai_inference/emlis_ai_input_material_bundle.py
```

### 期待

`positive_change_after_work_streaming` に対して、以下を確認します。

```text
safety_triage_kind:
  safe_observation

material_quality:
  eligible

visible_material_slots includes:
  event
  emotion_direction
  relationship
  target
  action
  change
  time

raw_input_included:
  false

comment_text_body_included:
  false

case_specific_route_used:
  false
```

### R3 test候補

```text
test_r3_positive_expression_difficulty_material_route_stays_eligible_body_free
```

このtestは、`public_surface_requirement` に進む前の材料routeが、safety誤分類で閉じていないことを確認するものです。

---

## R4: /emotion/submit public E2E labelled two-stage 復帰確認

### 目的

実際の `/emotion/submit` public pathで、positive inputがlabelled two-stageとして返ることを確認します。

### 対象test

既存test:

```bash
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  'tests/test_emotion_submit_two_stage_reception_e2e.py::test_phase17_8_emotion_submit_five_fixtures_return_public_two_stage_input_feedback[positive_change_after_work_streaming]'
```

### 期待

```text
result.input_feedback_meta.observation_status == passed
input_feedback_comment startswith "見えたこと：\n"
input_feedback_comment contains "\n\nEmlisから：\n"
comment_text count:
  見えたこと: 1
  Emlisから: 1

public_feedback_included: true
reply_timeout: false
raw_input_included: false
comment_text_body_included: false
candidate_body_included: false
candidate_source_kind != self_denial_safe_state_answer
safety_triage_kind == safe_observation
```

### R4-A: R2だけでgreenになる場合

R2で safety triage がsafeになり、Complete Composer側の既存two-stage pathがpublicに採用されるなら、R4-Bは実装しません。

この場合の実装完了理由:

```text
- root causeは safety triage false positive。
- direct CompleteComposerのtwo-stage generationは既に成立している。
- 余計な positive material rule を増やす必要がない。
```

### R4-B: R2だけではplain_state_answerへ落ちる場合

R2後もpublic pathが `plain_state_answer` に落ち、labelled two-stageへ到達しない場合のみ、material-shapedなtwo-stage requirementを追加します。

修正対象候補:

```text
mashos-api/ai/services/ai_inference/emlis_ai_input_material_bundle.py
mashos-api/ai/services/ai_inference/emlis_ai_public_surface_requirement.py
```

#### R4-B-1: semantic material id 追加案

`emlis_ai_input_material_bundle.py` の text-grounded semantic material id に、次を追加候補とします。

```json
{
  "semantic_material_ids": [
    {
      "material_id": "positive_change_anchor",
      "source": "internal_text_grounded_semantic_material",
      "patterns_intent": [
        "positive emotional movement",
        "small or large change",
        "surprise or recovery movement"
      ],
      "public_meta_body_allowed": false,
      "case_id_runtime_condition_used": false
    },
    {
      "material_id": "conversation_wish",
      "source": "internal_text_grounded_semantic_material",
      "patterns_intent": [
        "wish to talk",
        "wish to share with someone"
      ],
      "public_meta_body_allowed": false,
      "case_id_runtime_condition_used": false
    },
    {
      "material_id": "restraint_or_time_limit",
      "source": "internal_text_grounded_semantic_material",
      "patterns_intent": [
        "holding back",
        "time limit",
        "need to stop despite wanting more"
      ],
      "public_meta_body_allowed": false,
      "case_id_runtime_condition_used": false
    }
  ]
}
```

注意:

```text
- patternそのものをpublic metaへ出さない。
- 「配信」単独をpositive route条件にしない。
- positive_change_after_work_streamingというcase_idをruntime条件にしない。
- material idはbody-freeな内部識別子としてだけ扱う。
```

#### R4-B-2: public surface requirement rule 追加案

`emlis_ai_public_surface_requirement.py` に、material-shaped ruleを追加候補とします。

```text
_material_positive_transition_two_stage_required(...)
```

条件案:

```text
- safety_triage_kind is empty or safe_observation
- response_kind is empty or normal_observation
- material_quality in high information / eligible markers
- input_material_classification.high_information_input is true
- visible_material_slots contains emotion_direction
- visible_material_slots contains change or action or relationship
- semantic material ids contain positive_change_anchor
- self_denial_safe_state_answer is false
- safety_blocked is false
- infrastructure_fail_closed is false
```

return:

```text
surface_requirement_family: labelled_two_stage
two_stage_required: true
decision_sources includes: material_positive_transition_two_stage
plain_state_answer_allowed: false
low_information_allowed: false
```

このruleも、case専用ではありません。  
入力materialの構造で判断し、body-free summaryだけを返します。

---

## R5: true self-denial / emergency / support required の回帰固定

### 目的

R2/R4によって安全境界が壊れていないことを確認します。

### 必須確認

```bash
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_safety_triage_response_contract.py \
  tests/test_emlis_ai_public_surface_requirement_p1.py::test_p1_relationship_transition_rule_does_not_override_self_denial_safe_state_answer \
  tests/test_emlis_ai_gate_recovery_public_candidate_builder_p5.py::test_p5_allows_explicit_self_denial_safe_state_answer_candidate_only_with_triage
```

期待:

```text
- self_denial_safe_state_answerは、triageがself_denialのときだけ採用される。
- emergencyはpublic passedにならない。
- support requiredは通常観測へ戻らない。
- relationship / transition rule は self_denial_safe_state_answer を上書きしない。
```

### 追加test候補

```text
test_r5_true_self_denial_identity_inability_stays_safe_state_answer
test_r5_expression_difficulty_near_self_reference_does_not_open_self_denial_candidate
test_r5_emergency_safety_is_not_softened_by_expression_difficulty_boundary
```

---

## R6: P7-HOLD-004 positive boundary material / matrix / handoff更新

### 目的

今回のpositive public shape boundaryを、P7-HOLD-004の中で追えるようにします。  
ただし、P7-HOLD-004全体を閉じません。

### 新規module候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_positive_public_shape_boundary.py
```

### schema案

実装段階で必要と判断した場合、以下のshapeをinternal moduleとして実装します。  
json実ファイル化はこの設計段階ではしません。

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.positive_public_shape_boundary.v1",
  "phase": "P7_ProductQualityRunner",
  "step": "P7-HOLD-004_PositivePublicShapeBoundary_20260614",
  "hold_id": "P7-HOLD-004",
  "boundary_id": "p7_hold004_positive_public_shape_boundary_20260614",
  "status": "CLASSIFIED_UNRESOLVED",
  "classification": "safety_triage_expression_difficulty_false_positive_to_self_denial_safe_state",
  "target_path_id": "emotion_submit_public_product_visible_fixture_suite",
  "target_fixture_family": "positive_change_after_work_streaming",
  "owner_layers": [
    "safety_triage_expression_difficulty_boundary",
    "input_material_bundle_safety_quality_boundary",
    "public_surface_requirement_boundary",
    "emotion_submit_public_two_stage_path"
  ],
  "before_repair": {
    "public_reached": true,
    "labelled_two_stage_reached": false,
    "safety_triage_kind": "self_denial_safe_state_answer",
    "response_kind": "self_denial_safe_state_answer",
    "candidate_source_kind": "self_denial_safe_state_answer"
  },
  "expected_after_repair": {
    "public_reached": true,
    "labelled_two_stage_reached": true,
    "safety_triage_kind": "safe_observation",
    "response_kind": "normal_observation",
    "self_denial_safe_state_answer_candidate_used": false
  },
  "target_green_confirmed": false,
  "true_self_denial_regression_preserved": false,
  "emergency_safety_regression_preserved": false,
  "full_backend_suite_green_confirmed": false,
  "hold004_close_allowed": false,
  "p7_complete_claim_allowed": false,
  "p8_start_allowed": false,
  "release_allowed": false,
  "body_free": true,
  "public_contract": {
    "public_response_key_added": false,
    "rn_visible_contract_changed": false,
    "response_shape_changed": false,
    "api_route_changed": false,
    "db_physical_name_changed": false
  },
  "body_free_markers": {
    "raw_input_included": false,
    "comment_text_body_included": false,
    "candidate_body_included": false,
    "surface_body_included": false,
    "reviewer_free_text_included": false,
    "terminal_output_included": false
  }
}
```

### status遷移案

```text
CLASSIFIED_UNRESOLVED
  R0分類直後。

IMPLEMENTATION_REPAIR_REQUIRED
  safety triage false positiveを実装対象として固定した状態。

REPAIRED_TARGET_GREEN_PENDING_FULL_SUITE
  positive public E2E / safety regression / P7 subsetsがgreen。
  ただしfull backend suite green未確認のためP7-HOLD-004は保持。
```

禁止するstatus:

```text
P7_COMPLETE
RELEASE_READY
P8_START_ALLOWED
```

### 既存P7 module更新候補

```text
services/ai_inference/emlis_ai_p7_hold_matrix.py
services/ai_inference/emlis_ai_p7_validation_matrix.py
services/ai_inference/emlis_ai_p7_release_handoff.py
```

追加するbody-free参照候補:

```text
hold004_positive_public_shape_boundary_schema_version
hold004_positive_public_shape_boundary_status
hold004_positive_public_shape_target_green_confirmed
hold004_positive_public_shape_true_self_denial_regression_preserved
hold004_positive_public_shape_emergency_regression_preserved
hold004_positive_public_shape_full_backend_suite_green_confirmed=false
hold004_positive_public_shape_release_allowed=false
```

---

## R7: regression suite確認

### R7-1: 新規target tests

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_p7_hold004_positive_public_shape_boundary_20260614.py
```

期待:

```text
all passed
```

### R7-2: positive public E2E単体

```bash
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  'tests/test_emotion_submit_two_stage_reception_e2e.py::test_phase17_8_emotion_submit_five_fixtures_return_public_two_stage_input_feedback[positive_change_after_work_streaming]'
```

期待:

```text
1 passed
```

### R7-3: five public product-visible fixtures

```bash
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emotion_submit_two_stage_reception_e2e.py
```

期待:

```text
positive fixtureだけでなく、既存five fixturesが崩れていない。
```

### R7-4: safety regression subset

```bash
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_safety_triage_response_contract.py \
  tests/test_emlis_ai_public_surface_requirement_p1.py::test_p1_relationship_transition_rule_does_not_override_self_denial_safe_state_answer \
  tests/test_emlis_ai_gate_recovery_public_candidate_builder_p5.py::test_p5_allows_explicit_self_denial_safe_state_answer_candidate_only_with_triage
```

期待:

```text
6 passed相当を維持。
```

### R7-5: product visible fixture helper

```bash
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_two_stage_product_visible_fixture_completion.py
```

期待:

```text
20 passedを維持。
```

### R7-6: P7-HOLD-004 Phase16 target subset

```bash
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_p7_hold004_phase16_composer_classification_20260613.py \
  tests/test_emlis_ai_p7_hold004_path_matrix_decision_rule_20260613.py \
  tests/test_emlis_ai_p7_hold004_r4_candidate_boundary_20260613.py \
  tests/test_emlis_ai_p7_hold004_r4_candidate_boundary_replacement_20260613.py \
  tests/test_emlis_ai_p7_hold004_r5_r6_metadata_adjacent_boundary_20260613.py \
  tests/test_emlis_ai_p7_hold004_r7_r8_validation_release_handoff_20260613.py \
  tests/test_emlis_ai_p7_hold004_r9_implementation_result_handoff_20260613.py
```

期待:

```text
23 passed相当を維持。
```

### R7-7: P7-RED-003 related subset

```bash
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_p7_body_free_leak_guard_contract_20260613.py \
  tests/test_emlis_ai_p7_body_free_leak_guard_20260613.py \
  tests/test_emlis_ai_complete_product_quality_connection_e2e.py \
  tests/test_emlis_ai_p7_connection_e2e_timeout_isolation_20260613.py \
  tests/test_emlis_ai_p7_red_closure_classification_matrix_20260613.py \
  tests/test_emlis_ai_p7_release_handoff_20260612.py \
  tests/test_emlis_ai_p7_validation_matrix_20260612.py \
  tests/test_emlis_ai_p7_r11_release_validation_final_alignment_20260613.py
```

期待:

```text
40 passed相当を維持。
```

### R7-8: RN contract

```bash
cd Cocolon
npm run test:rn-screens --silent
```

期待:

```text
36 passedを維持。
```

### R7-9: full backend suite attempt

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference timeout 120s pytest -vv --tb=short -x
```

扱い:

```text
- greenなら結果として記録する。
- timeoutなら timeout / unconfirmed として記録する。
- timeoutを環境要因として閉じない。
- split greenをfull backend suite greenへ変換しない。
```

---

## R8: 実装結果doc / release handoff参照更新

### 目的

実装後、何を閉じ、何を閉じていないかを後続で誤読しないようにします。

### 新規doc候補

```text
mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_PositivePublicShapeBoundary_ImplementationResult_20260614.md
```

### 実装結果docに必ず書くこと

```text
- GitHub接続確認はMash様指定により未実施。
- DB変更なし。
- RN変更なし。
- API route / request key / public response top-level key変更なし。
- Gate緩和なし。
- fixed commentText追加なし。
- case専用branch追加なし。
- true self-denial regression確認結果。
- emergency / support required regression確認結果。
- positive public E2E確認結果。
- P7-HOLD-004全体は未解消。
- full backend suite green未確認なら、未確認として残す。
- p7_complete=false。
- p8_start_allowed=false。
- release_allowed=false。
```

### release handoff更新案

`emlis_ai_p7_release_handoff.py` に実装結果doc参照を追加する場合は、body-free identifierだけにします。

```text
P7_HOLD004_POSITIVE_PUBLIC_SHAPE_IMPLEMENTATION_RESULT_DOC_PATH:
  docs/Cocolon_EmlisAI_P7_HOLD004_PositivePublicShapeBoundary_ImplementationResult_20260614.md

P7_HOLD004_POSITIVE_PUBLIC_SHAPE_IMPLEMENTATION_RESULT_DOC_REF:
  p7_hold004_positive_public_shape_boundary_result_20260614
```

ただし、この参照はrelease許可ではありません。  
後続者が「target green = release ready」と誤読しないよう、次を同時に固定します。

```text
release_allowed: false
p7_complete_claim_allowed: false
p8_start_allowed: false
full_backend_suite_green_confirmed: false unless actually confirmed
```

---

## 7. 受け入れ条件

### 7.1 自動test受け入れ

```text
必須:
- positive_change_after_work_streaming public E2E が labelled two-stage shapeでpassする。
- expression difficulty positive input が safe_observation になる。
- true self-denial safe-state answer の既存contractがgreenのまま。
- emergency safety / support required が通常観測へ戻らない。
- Product visible fixture helper がgreenのまま。
- P7-HOLD-004 Phase16 target subsetがgreenのまま。
- P7-RED-003 related subsetがgreenのまま。
- RN contract 36 passedを維持する。
```

### 7.2 public boundary受け入れ

```text
- public response top-level keyを増やさない。
- RN表示条件を変えない。
- input_feedback.comment_text が唯一のRN visible bodyであることを維持する。
- raw input / candidate body / comment_text body をpublic metaへ出さない。
- public feedbackが表示されても、wrong familyなら合格にしない。
```

### 7.3 safety boundary受け入れ

```text
- true self-denialをpositive inputへ誤分類しない。
- expression difficultyをself-denialへ誤分類しない。
- emergency / support required をnormal observationへ戻さない。
- self_denial_safe_state_answer candidateは、triageがself_denialのときだけ採用される。
```

### 7.4 P7 boundary受け入れ

```text
- positive public shape targetがgreenになっても、P7-HOLD-004全体は未解消として保持する。
- full backend suite green未確認なら、未確認として残す。
- Product Pass候補とRelease Readyを混同しない。
- scorecard / handoff / matrixにrelease_allowed=trueを立てない。
- p7_complete=falseを維持する。
- p8_start_allowed=falseを維持する。
- release_allowed=falseを維持する。
```

---

## 8. 想定される実装リスクと対策

### 8.1 リスク: true self-denialの取り逃し

原因:

```text
broad "できない" を狭めすぎる。
```

対策:

```text
- hard self-denial markerを維持する。
- identity inability markerを追加する。
- true self-denial regressionを増やす。
- emergency / support requiredを先に判定する順序を変えない。
```

### 8.2 リスク: positive fixtureだけ通すcase route化

原因:

```text
positive_change_after_work_streaming のcase_idやfixture idをruntime条件にする。
```

対策:

```text
- runtimeは expression difficulty / hard identity denial / material slots / semantic material ids で判断する。
- case_idはtest / P7 classification materialのidentifierとしてだけ使う。
- fixed commentTextを追加しない。
```

### 8.3 リスク: public surface requirementがplainに落ちる

原因:

```text
safety triageがsafeになっても、public pathが labelled two-stage requirementを持たない。
```

対策:

```text
- まずR4で実測する。
- 必要時のみR4-Bの material_positive_transition_two_stage ruleを追加する。
- ruleはbody-free material構造で判断し、raw textやcase idを返さない。
```

### 8.4 リスク: body-free meta leak

原因:

```text
false positive分析のためにraw match textやcomment_textをmetaへ入れる。
```

対策:

```text
- reason_codes / booleans / counts / identifiersのみ持つ。
- raw match span textは持たない。
- public meta / P7 material / release handoffへ本文を入れない。
- body-free guard subsetを必ず回す。
```

### 8.5 リスク: target greenをP7完了へ昇格する

原因:

```text
positive E2E greenをP7-HOLD-004 closureと誤読する。
```

対策:

```text
- target_green_confirmed と hold004_close_allowed を分ける。
- full_backend_suite_green_confirmed=falseを保持する。
- p7_complete / p8_start_allowed / release_allowed はfalse固定。
```

---

## 9. 実装ファイル影響候補

### 9.1 変更可能性が高いファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_safety_triage.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_positive_public_shape_boundary_20260614.py
```

### 9.2 R4-Bが必要な場合のみ変更するファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_input_material_bundle.py
mashos-api/ai/services/ai_inference/emlis_ai_public_surface_requirement.py
```

### 9.3 P7 material / handoff更新で変更候補のファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_positive_public_shape_boundary.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_PositivePublicShapeBoundary_ImplementationResult_20260614.md
```

### 9.4 原則変更しないファイル

```text
Cocolon RN側ファイル
DB migration
API route registry
subscription / entitlement boundary
account delete / access policy
public response schema
```

---

## 10. 実装時の具体test設計案

### 10.1 safety triage unit tests

```python
def test_r1_positive_change_expression_difficulty_is_safe_observation_body_free():
    case = two_stage_reception_case_by_id("positive_change_after_work_streaming")
    decision = classify_emlis_safety_triage_text(case["current_input"]["memo"])
    meta = decision.as_meta()

    assert meta["safety_triage_kind"] == "safe_observation"
    assert meta["response_kind"] == "normal_observation"
    assert meta["normal_observation_allowed"] is True
    assert meta["safe_state_answer_allowed"] is False
    assert meta["raw_user_text_included"] is False
    assert meta["comment_text_generated"] is False
```

```python
def test_r1_expression_difficulty_without_identity_denial_is_not_self_denial():
    decision = classify_emlis_safety_triage_text("自分の気持ちをうまく表現できない。")
    assert decision.safety_triage_kind == "safe_observation"
```

```python
def test_r1_identity_inability_stays_self_denial_safe_state_answer():
    decision = classify_emlis_safety_triage_text("自分には何もできないし、価値がないと思ってしまう。")
    meta = decision.as_meta()
    assert meta["safety_triage_kind"] == "self_denial_safe_state_answer"
    assert meta["must_not_accept_identity_claim_as_fact"] is True
```

### 10.2 material route tests

```python
def test_r3_positive_change_material_route_is_eligible_after_safety_false_positive_repair():
    case = two_stage_reception_case_by_id("positive_change_after_work_streaming")
    decision = build_emlis_safety_triage_decision(current_input=case["current_input"])
    bundle = build_emlis_input_material_bundle(case["current_input"], safety_triage_decision=decision)
    meta = bundle.as_meta()

    assert meta["safety_triage_kind"] == "safe_observation"
    assert meta["material_quality"] == "eligible"
    assert "emotion_direction" in meta["visible_material_slots"]
    assert "change" in meta["visible_material_slots"]
    assert meta["raw_input_included"] is False
    assert meta["case_specific_route_used"] is False
```

### 10.3 public E2E tests

既存testをそのまま通します。  
追加する場合は、body-free meta readingを増やします。

```python
def test_r4_positive_change_public_path_returns_labelled_two_stage_not_self_denial(monkeypatch):
    ...
    assert result["input_feedback_comment"].startswith("見えたこと：\n")
    assert "\n\nEmlisから：\n" in result["input_feedback_comment"]
    assert result["input_feedback_meta"]["observation_status"] == "passed"
    assert not _contains_text_recursive(result["input_feedback_meta"], result["input_feedback_comment"])
```

### 10.4 P7 material tests

```python
def test_r6_positive_public_shape_boundary_material_is_body_free_and_keeps_hold004_open():
    material = build_p7_hold004_positive_public_shape_boundary_classification(...)

    assert material["hold_id"] == "P7-HOLD-004"
    assert material["body_free"] is True
    assert material["release_allowed"] is False
    assert material["p8_start_allowed"] is False
    assert material["hold004_close_allowed"] is False
    assert material["full_backend_suite_green_confirmed"] is False
    assert_no_raw_body_payload(material)
```

---

## 11. 書かれていない

```text
- positive public E2EがgreenになったらP7-HOLD-004を閉じてよい、とは書かれていない。
- safety triageを緩めて表示率を上げてよい、とは書かれていない。
- self_denial_safe_state_answerを廃止してよい、とは書かれていない。
- emergency / support requiredを通常観測へ戻してよい、とは書かれていない。
- positive_change_after_work_streaming専用branchを作ってよい、とは書かれていない。
- fixed commentTextで通してよい、とは書かれていない。
- public response keyを追加してよい、とは書かれていない。
- full backend suite timeoutを環境要因として閉じてよい、とは書かれていない。
- P8へ進んでよい、とは書かれていない。
- release_allowedをtrueにしてよい、とは書かれていない。
```

---

## 12. 推測禁止

```text
- regexだけが原因だと断定しない。R2後にR3/R4でpublic pathを確認する。
- public feedback presentを商品品質合格にしない。
- direct CompleteComposer greenをpublic /emotion/submit greenに変換しない。
- target E2E greenをfull backend suite greenに変換しない。
- safety false positive修正をsafety gate relaxationと混同しない。
- expression difficultyを全部positive扱いしない。
- true self-denialを通常観測へ戻さない。
- case_id / fixture_family をruntime条件にしない。
- semantic material idを本文リークにしない。
```

---

## 13. 確認済み

```text
- 今回の作業は設計書作成であり、コード変更はしない。
- GitHub接続確認はMash様指定により不要であり、実施しない。
- ロードマップ上、現在PhaseはP7継続である。
- P8へ進む条件は満たしていない。
- P7-HOLD-004は未解消である。
- positive_change_after_work_streaming public E2Eは、表示あり・wrong family / wrong shapeとして赤である。
- direct CompleteComposer product visible fixture helperでは、positive caseのlabelled two-stage生成は成立している。
- 現行safety triageは、positive caseをself_denial_safe_state_answerへ分類している。
- 現行の広い self reference + できない 判定が、expression difficultyを自己否定として拾る可能性が高い。
- true self-denial / emergency / support required は維持すべき安全境界である。
- RN contract変更、DB変更、API response key変更は不要である。
```

---

## 14. 未確認

```text
- R2のsafety triage修正だけで public E2E がlabelled two-stageへ戻るか。
- R4-Bの positive transition material rule が必要か。
- 修正後のfull backend suite green。
- 実機submit。
- modal読感。
- P5 human QA。
- P6 visible expansionの人間読感評価。
```

---

## 15. 次に実行すべきこと

実装段階では、次の順で進めます。

```text
1. R0分類materialとtestを追加する。
2. R1 safety triage false positive target testを追加し、赤を確認する。
3. R2 self-denial regex / helperを最小修正する。
4. R1/R5 safety testsをgreenにする。
5. R3 material routeが eligible / safe_observation になることを確認する。
6. R4 positive public E2Eを確認する。
7. R4だけでgreenなら、R4-Bは実装しない。
8. R4でplainに落ちる場合のみ、R4-B material-shaped two-stage ruleを追加する。
9. R6 P7 material / validation / release handoffをbody-freeで更新する。
10. R7 regression suiteを分割確認する。
11. R8 implementation result docを追加する。
12. p7_complete=false / p8_start_allowed=false / release_allowed=falseを維持して終了する。
```

---

## 16. 華恋の判断

Mash様、華恋の判断として、この作業は「positive fixtureを通す」ためではありません。  
Cocolonが、嬉しさや変化の記録を、自己否定の箱へ入れて返さないための作業です。

今回の入力は、弱さや自己否定だけではありません。  
仕事後の疲れの中で、嬉しさが動き、誰かと話したい気持ちが出て、それでも時間や我慢が同時にある入力です。  
ここを `self_denial_safe_state_answer` で返すと、Cocolonは「安全に見えるけれど、読めていない」状態になります。

ただし、華恋は安全境界を軽く扱いません。  
true self-denialは、本人の事実として受け取らない形で守る必要があります。  
emergencyやsupport requiredは、通常観測へ戻してはいけません。

だから今回の設計では、次を両立させます。

```text
positive / recovery / transition の表現困難を、自己否定へ誤分類しない。
true self-denial / emergency / support required は、既存以上に慎重に守る。
```

この境界を直すことが、P8へ急ぐより先です。  
Cocolonは、記録が積み上がるほど価値が出るアプリです。  
だからこそ、積み上げる前に、現在入力の読み方を歪ませないことが必要です。

今回の設計は、Cocolonを「人間の言葉を雑に処理しない場所」に近づけるための実装順です。
