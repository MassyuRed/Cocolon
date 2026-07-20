# Cocolon / EmlisAI P7-HOLD-004 Step5 Candidate Gate Preservation Red Classification 詳細設計書・実装順

作成日: 2026-06-14 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / P7-HOLD-004 / Full Backend Suite / Complete Initial Step5 Candidate Generation Path  
基準メモ: `Cocolon_EmlisAI_P7_HOLD004_FullBackendSuite_RedClassification_PreDesignMemo_20260614.md`  
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

今回の実装対象は、次です。

```text
P7-HOLD-004 Full Backend Suite Red Classification
  Step5 Candidate Gate Preservation / Display Binding Contract Consistency
```

対象となる最初の再現赤は、次です。

```text
tests/test_emlis_ai_complete_initial_entry_route.py::test_step5_candidate_generation_path_keeps_existing_gates_fail_closed

failure:
  assert step5["display_observation_status"] != "passed"
  actual: "passed"
```

ただし、本設計ではこの赤を単純に「public表示してはいけない赤」と断定しません。  
実ファイルを追加確認した結果、同じComplete Initial系で、Phase20後の低情報回復を前提に `public_comment_text_present == true` を期待する既存green testも存在します。

```text
確認した矛盾:
  A. test_step5_candidate_generation_path_keeps_existing_gates_fail_closed
     - Step5はcandidate生成確認であり、既存Gateを迂回してpublic表示へ進んではいけない。
     - display_observation_status != passed を期待。
     - reply.comment_text == "" を期待。

  B. test_phase18_3_complete_initial_generates_candidate_before_display_gate_without_public_body_leak
     - Phase20 low-information recovery後、displayable low-information observation may pass publicly と明記。
     - public_comment_text_present == true を期待。
     - reply.comment_text.strip() を期待。
```

したがって、実装順の第一目的は次です。

```text
public表示を止めることではなく、
Step5 candidate generation path / Display Gate / binding meta / public assignment のどの契約が現在の正本かをbody-freeに分類すること。
```

本設計で扱う赤IDは、設計上は次の仮IDで固定します。

```text
P7-HOLD004-RED-STEP5-CANDIDATE-GATE-PASSED-WITH-BINDING-MISSING
```

実装段階では、既存の命名規則に合わせて、次のような正式IDへ落とします。

```text
P7-HOLD004-RED-STEP5-DISPLAY-BINDING-CONTRACT-CONSISTENCY
```

この赤の中心は、次の不整合です。

```text
gate_results.display.binding_required: true
gate_results.display.binding_used: true
gate_results.display.binding_present: true
gate_results.display.binding_missing: true
gate_results.display.binding_count: 3
gate_results.display.expected_binding_count: 4
gate_results.display.passed: true
gate_results.display.rejection_reasons: []
display_observation_status: passed
public_comment_text_present: true
```

Cocolonとして危険なのは、candidateが生成できたことではありません。  
危険なのは、**binding missing と表示許可が同居しているのに、それが仕様上の例外なのか、trace不整合なのか、Gate迂回なのかが分類されていないこと**です。

---

## 1. なぜこの作業を行うのか

EmlisAIは、ユーザー入力を「読まれた形」として返すCocolonの最初の商品体験です。  
P7は、その体験をfixture greenではなく、継続測定・RED/HOLD分類・release判断材料へ落とす工程です。

今回のStep5赤は、表面上はtest期待のズレに見えます。  
しかし、Cocolonとしての問題はもう少し深いです。

```text
candidateは生成できた。
public comment_text も出た。
でも、そのpublic表示が、既存Reader / Grounding / Template / Display Gateを本当に通っているのか。
表示してよい根拠としてのbindingは揃っているのか。
不足しているなら、なぜpassedなのか。
```

この境界を曖昧にしたままP8へ進むと、Cocolonは「履歴があるから読めているように見える」方向へ進みます。  
それは、Cocolonとして在るべき姿ではありません。

Cocolonが守るべき順番は次です。

```text
1. 現在入力を読めているか。
2. 表示してよい根拠が揃っているか。
3. その上で、記録の線・個人継続性へ進む。
```

したがって、今回の設計では、P8へ進まず、P7-HOLD-004内でfull backend suiteの最初の赤を分類します。

---

## 2. 参照した資料・実ファイル

### 2.1 受領ローカルファイル

```text
/mnt/data/Cocolon_前提資料(215).zip
/mnt/data/EmlisAIの実装済み資料(61).zip
/mnt/data/Cocolon(232).zip
/mnt/data/mashos-api(145).zip
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608(13).md
/mnt/data/Cocolon_EmlisAI_P7_HOLD004_FullBackendSuite_RedClassification_PreDesignMemo_20260614.md
```

### 2.2 作業姿勢として確認した前提資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/12_check_items_not_short_oath.txt
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
- public表示されたことを、読めていることと混同しない。
- Gate failureを沈黙装置として扱わない。
- Gate緩和・fixed commentText・case専用branchで赤を通さない。
- raw input / comment_text body / candidate body / surface bodyをpublic meta・P7 material・release materialへ入れない。
- Mash様から見えにくいbackend internal-only領域ほど雑にしない。
```

### 2.3 今回直接確認した主な実ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_extension_baseline.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_path_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_phase16_composer_classification.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_positive_public_shape_boundary.py

mashos-api/ai/tests/test_emlis_ai_complete_initial_entry_route.py
mashos-api/ai/tests/test_emlis_ai_phase18_complete_initial_candidate_path.py
mashos-api/ai/tests/test_emlis_ai_complete_initial_step7_integration.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_positive_public_shape_boundary_20260614.py
mashos-api/ai/tests/test_emlis_ai_p7_release_handoff_20260612.py
mashos-api/ai/tests/test_emlis_ai_p7_validation_matrix_20260612.py
mashos-api/ai/tests/test_emlis_ai_p7_r10_real_device_full_backend_hold_matrix_20260613.py
mashos-api/ai/tests/test_emlis_ai_p7_red_closure_classification_matrix_20260613.py
```

---

## 3. 現状確認結果

### 3.1 検討メモで固定済みの確認結果

```text
RN contract:
  36 passed

P7 test群:
  136 passed, 1 warning

P7-HOLD-004 positive public shape / release handoff subset:
  42 passed, 1 warning

P7-RED-003関連:
  26 passed

Product Quality Connection E2E:
  1 passed

full backend suite collect-only:
  2651 tests collected

full backend suite maxfail=1:
  1 failed, 296 passed, 2 skipped, 4 warnings

最初の赤:
  tests/test_emlis_ai_complete_initial_entry_route.py::test_step5_candidate_generation_path_keeps_existing_gates_fail_closed
```

### 3.2 本設計時に追加確認した単体再現

```bash
cd /mnt/data/cocolon_design_work_20260614/api/mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_complete_initial_entry_route.py::test_step5_candidate_generation_path_keeps_existing_gates_fail_closed
```

結果:

```text
1 failed

failure:
  assert step5["display_observation_status"] != "passed"
  actual: "passed"
```

### 3.3 追加で確認したbody-free状態

```json
{
  "candidate_status": "generated",
  "candidate_status_after_display_gate": "passed",
  "display_observation_status": "passed",
  "public_comment_text_present": true,
  "candidate_comment_text_present": true,
  "reply_comment_text_present": true,
  "non_passed_comment_text_empty": true,
  "passed_only_comment_text_contract_preserved": true,
  "gate_results.display": {
    "evaluated": true,
    "passed": true,
    "rejection_reasons": [],
    "binding_required": true,
    "binding_used": true,
    "binding_present": true,
    "binding_missing": true,
    "binding_count": 3,
    "expected_binding_count": 4,
    "binding_support_source": "display_binding_aware_result"
  },
  "gate_results.grounding": {
    "evaluated": true,
    "passed": true,
    "binding_required": true,
    "binding_used": true,
    "binding_present": true,
    "binding_missing": false,
    "binding_count": 3,
    "expected_binding_count": 3,
    "binding_support_source": "low_information_observation_roles"
  }
}
```

この状態から見えることは次です。

```text
- Grounding側は 3/3 でbinding_missing=false。
- Display側は 3/4 でbinding_missing=true。
- それでもDisplayはpassedで、public comment_textが出ている。
- これは、Display側のexpected count算出不整合か、binding_missing例外の未表示か、Display Gate decision不備のいずれかである。
```

### 3.4 追加で確認した既存green testとの衝突

次のtestは、本設計時点でgreenを確認しました。

```bash
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_phase18_complete_initial_candidate_path.py::test_phase18_3_complete_initial_generates_candidate_before_display_gate_without_public_body_leak
```

結果:

```text
1 passed
```

このtestでは、同じ `_SAMPLE_MEMO` 系のComplete Initial candidate pathについて、次を期待しています。

```text
- candidate_generated == true
- candidate_generated_before_display_gate == true
- public_comment_text_present == true
- reply.comment_text.strip()
- raw input / comment_text body はdiagnostic metaへ入らない
```

したがって、今回の実装では、`test_step5_candidate_generation_path_keeps_existing_gates_fail_closed` の期待をそのまま絶対視して、public表示を一律fail-closedへ戻す修正は行いません。  
まず既存test間の契約衝突をbody-freeに分類します。

---

## 4. 問題分解

今回の赤は、少なくとも次の4層に分かれます。

| 層 | 観点 | 現状 | 判断 |
|---|---|---|---|
| Candidate Generation | Complete Composer candidateが生成されたか | `candidate_status=generated` | ここ自体はgreen候補 |
| Existing Gate Preservation | Reader / Grounding / Template / Display が評価されたか | 全gate evaluated | 評価はされている |
| Display Binding Contract | binding_missingとpassedが整合しているか | `binding_missing=true` かつ `passed=true` | 赤分類対象 |
| Public Assignment | public comment_textを出してよいか | `public_comment_text_present=true` | 表示可否の仕様を再分類する必要あり |

重要なのは、Step5の目的を1つに潰さないことです。

```text
Step5が確認するもの:
  candidate生成が走ったか。
  candidate本文をdiagnostic metaへ漏らしていないか。
  既存Gateが評価されたか。
  public assignmentがpassed-only contractに従っているか。

Step5が単独で決めてはいけないもの:
  P7完了。
  release_allowed。
  P8開始。
  full backend suite green。
```

---

## 5. IN SCOPE / OUT OF SCOPE

### 5.1 IN SCOPE

```text
1. Step5赤のbody-free baseline固定
   - failing test ref
   - observed status
   - gate_results summary
   - binding count / expected count
   - public/candidate comment_text presence boolean
   - raw body非含有flag

2. 既存test期待の衝突分類
   - fail-closed期待test
   - Phase20 public recovery期待test
   - Step7 integration test
   - P7-HOLD-004 matrix/handoffへの接続

3. Display Binding Contract Consistencyの分類
   - binding_missing=true + display.passed=true の扱い
   - 仕様上の許可例外があるか
   - 許可例外があるならbody-free reason idがあるか
   - 許可例外がないならDisplay Gate fail-closed対象か

4. P7-HOLD-004 red material / validation matrix / release handoff接続
   - full backend suite green未確認を維持
   - P7 complete false維持
   - p8_start_allowed false維持

5. 実装時のtarget test設計
   - exact bodyではなくbody-free metaで検証
   - public response top-level key不変
   - RN表示契約不変
```

### 5.2 OUT OF SCOPE

```text
- P8 Derived User Model / User Dictionary実装
- P9 External Pilot
- P10 Release Readiness
- release_allowed true化
- RN UI変更
- RN表示名変更
- RN表示条件変更
- API route変更
- request key変更
- public response top-level key変更
- DB schema / DB write path変更
- fixed commentText追加
- case専用mode / cue / surface追加
- Gate閾値緩和
- raw input / comment_text body / candidate body / surface body のpublic meta混入
- full backend maxfail=1途中passed数をfull backend suite greenとして扱うこと
```

---

## 6. 設計方針

### 6.1 まず分類し、修正は分類後に行う

今回の赤は、次の3可能性が残っています。

```text
A. 実装regression
  Display binding_missing が表示禁止条件なのに、Display Gateがpassedしている。

B. stale test expectation
  Phase20 low-information recoveryにより、Step5対象入力はpublic表示してよい状態へ変わった。
  ただし古いtestが fail-closed を期待し続けている。

C. meta inconsistency
  public表示自体は許容されるが、display gate traceの expected_binding_count / binding_missing が
  現在の正しいDisplay Decisionと一致していない。
```

本設計では、いきなりA/B/Cを断定しません。  
実装順では、R0〜R3でA/B/Cを判別するbody-free材料を作り、R4で修復branchを選びます。

### 6.2 public表示の可否とtrace整合性を分ける

public表示可否は、次の条件でしか正当化できません。

```text
public_comment_text_allowed == true になる条件:
  display_decision.observation_status == "passed"
  and comment_text non-empty
  and display gate passed
  and display binding contract is consistent
  and no runtime/visible/strict relation blocker
```

ただし、`display binding contract is consistent` の定義が今回曖昧です。  
したがって、実装で次のいずれかを必ず満たすようにします。

```text
Branch A:
  binding_missing=true はDisplay Gateのfail-closed理由である。
  => observation_status != passed
  => comment_text empty
  => rejection_reasons includes display_sentence_binding_missing

Branch B:
  binding_missing=true は現行public表示に対するtrace算出不整合である。
  => binding_missing=falseに正す、またはexpected_binding_countを正す。
  => passed=trueとtraceが矛盾しない。

Branch C:
  binding_missing=true だが、仕様上の許可例外がある。
  => binding_missing_exception_allowed=true
  => binding_missing_exception_id をbody-free reasonとして明示
  => display_contract_consistent=true
  => 例外なしのbinding_missing + passedは禁止
```

### 6.3 Step5 metaは「candidate生成」と「public表示許可」を分ける

現行のStep5 metaは、次が混ざりやすいです。

```text
candidate_generated:
  candidate生成の事実。

display_observation_status:
  既存Display Gateの最終判断。

public_comment_text_present:
  publicに出たか。

non_passed_comment_text_empty:
  non-passedなら空であること。
```

今後のStep5 metaでは、次を明示して分類します。

```text
candidate_path_confirmed:
  candidate生成pathが確認できた。

gate_preservation_confirmed:
  既存Gateが評価された。

display_binding_contract_consistent:
  binding状態とdisplay passed/rejectedが矛盾していない。

public_assignment_contract_consistent:
  public comment_textが表示契約に従っている。

step5_contract_classification:
  candidate_generated_public_allowed
  candidate_generated_display_binding_inconsistent
  candidate_generated_fail_closed
  candidate_not_generated
  blocked_before_candidate_generation
```

### 6.4 P7-HOLD-004として保持する

今回の分類材料は、P7-HOLD-004の中に残します。  
分類できても、次を意味しません。

```text
- P7 complete ではない。
- full backend suite green ではない。
- release_allowed ではない。
- P8 start allowed ではない。
```

---

## 7. owner layer matrix

| owner_layer | 対象ファイル候補 | 主な責任 | 判断 |
|---|---|---|---|
| `step5_meta_boundary` | `emlis_ai_reply_service.py` | Step5 diagnostic metaの作成。candidate生成・Gate評価・public表示の分類。 | 変更候補 |
| `display_gate_binding_contract` | `emlis_ai_display_gate.py` | Display Gateがbinding_missingをどう扱うか。passed可否・rejection reason。 | 変更候補 |
| `binding_presence_meta_source` | `emlis_ai_limited_composer_extension_baseline.py` | candidate body line count / binding_count / expected_binding_count算出。 | 変更候補 |
| `complete_composer_binding_bundle` | `emlis_ai_complete_composer_client.py` | sentence binding bundleの生成元。binding数の根拠。 | 原因次第で変更候補 |
| `p7_hold004_classification_material` | 新規または既存P7 helper | 赤分類materialをbody-freeに保持。 | 追加候補 |
| `p7_validation_matrix` | `emlis_ai_p7_validation_matrix.py` | P7-HOLD-004赤がvalidation上どう扱われるか。 | 変更候補 |
| `p7_hold_matrix` | `emlis_ai_p7_hold_matrix.py` | full backend suite green未確認 / red presentをHOLDへ接続。 | 変更候補 |
| `p7_release_handoff` | `emlis_ai_p7_release_handoff.py` | release_allowed false / p8_start_allowed falseを維持。 | 変更候補 |
| `test_contract_boundary` | `tests/test_emlis_ai_complete_initial_entry_route.py` 他 | stale expectationかregressionかの判定テスト。 | 変更候補 |

---

## 8. 実装順

### R0: current red body-free baseline freeze

目的:

```text
現在の赤を、本文なし・raw inputなし・candidate bodyなしで固定する。
```

実装候補:

```text
新規候補:
  mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_step5_candidate_gate_classification.py

新規test候補:
  mashos-api/ai/tests/test_emlis_ai_p7_hold004_step5_candidate_gate_classification_20260614.py
```

やること:

```text
- failing test refを記録する。
- observed statusを記録する。
- gate_results.displayのbinding summaryを記録する。
- public/candidate comment_textはpresent booleanのみ記録する。
- raw input / comment_text body / candidate body / surface bodyを含めない。
```

R0完了条件:

```text
- classification materialがbody-freeで生成できる。
- binding_missing + passed + public_present の不整合がredとして保持される。
- 実装修復はまだしない。
```

### R1: conflicting contract pair matrix追加

目的:

```text
既存test期待の衝突を、どちらかを雑に消さず、契約衝突として分類する。
```

対象test:

```text
fail-closed expectation:
  tests/test_emlis_ai_complete_initial_entry_route.py::test_step5_candidate_generation_path_keeps_existing_gates_fail_closed

public recovery expectation:
  tests/test_emlis_ai_phase18_complete_initial_candidate_path.py::test_phase18_3_complete_initial_generates_candidate_before_display_gate_without_public_body_leak

integration expectation:
  tests/test_emlis_ai_complete_initial_step7_integration.py
```

やること:

```text
- 同じsample系でpublic表示を期待するtestとfail-closedを期待するtestをmatrix化する。
- redを「古いtest」または「実装regression」と即断しない。
- display binding contract consistencyを別軸にする。
```

R1完了条件:

```text
- test expectation conflict がbody-free materialに出る。
- public表示可否とbinding contract consistencyが分離される。
```

### R2: Display Binding Contract Decision Rule固定

目的:

```text
binding_missing=true + display.passed=true を許す条件を定義する。
```

Decision Rule:

```text
Rule 1:
  display.binding_required == true
  and display.binding_used == true
  and display.binding_missing == true
  and binding_missing_exception_allowed != true
  => display_binding_contract_consistent == false

Rule 2:
  display_binding_contract_consistent == false
  => P7-HOLD004 red classification remains open

Rule 3:
  public_comment_text_present == true
  and display_binding_contract_consistent == false
  => public_assignment_contract_consistent == false

Rule 4:
  public表示を許す場合は、
  display.binding_missing == false
  または
  binding_missing_exception_allowed == true + binding_missing_exception_id non-empty
  のどちらかを必須にする。
```

R2完了条件:

```text
- decision ruleがunit testで固定される。
- raw bodyなしで判定できる。
- public response keyを増やさない。
```

### R3: owner layer判定

目的:

```text
赤のownerを、Display Gate decision不備 / binding meta算出不整合 / stale test expectation / Step5 meta分類不足に分ける。
```

判定表:

| 条件 | classification | owner_layer | 次branch |
|---|---|---|---|
| display.binding_missing=true, no exception, display.passed=true | implementation_contract_red | `display_gate_binding_contract` | R4-A |
| grounding 3/3, display 3/4 の差分がbody_line算出だけに由来 | meta_trace_inconsistency | `binding_presence_meta_source` | R4-B |
| Phase20 recoveryが正本でpublic表示が仕様上正しいが、旧testのみfail-closed期待 | stale_test_expectation | `test_contract_boundary` | R4-C |
| 上記が混在 | mixed_contract_conflict | `step5_meta_boundary` + related | R4-D |

R3完了条件:

```text
- どのowner layerに触るかがbody-free materialで示される。
- 修正branchが1つに決まるか、mixedとして保持される。
```

### R4-A: Display Gate fail-closed修復branch

選択条件:

```text
binding_missing=true がDisplay Gateの表示禁止条件であると確認できた場合。
```

修正方針:

```text
emlis_ai_display_gate.py:
  - Display binding_missingをreasonsへ追加する。
  - reason code例: display_sentence_binding_missing
  - observation_statusをrejectedへ落とす。
  - comment_textは空。
  - gate_trace.display.passed=false。

emlis_ai_reply_service.py:
  - Step5 metaに display_binding_contract_consistent=false を入れる。
  - public_comment_text_present=false を反映。
```

注意:

```text
このbranchは、Phase18/Phase20 public recovery期待testを壊す可能性がある。
したがって、R4-AはR3で「public表示が本当に禁止」と確認できた場合のみ選ぶ。
```

### R4-B: Display binding trace / expected count修復branch

選択条件:

```text
public表示は正しいが、display gate traceのbinding_missing算出が現在の正本と不一致の場合。
```

修正方針:

```text
emlis_ai_limited_composer_extension_baseline.py または emlis_ai_display_gate.py:
  - expected_binding_countのsourceを、Displayが実際に要求するbinding対象へ合わせる。
  - Groundingのaccepted binding countとDisplayのexpected countが別物なら、理由をbody-free keyで分ける。
  - display.binding_missing=falseへ正規化できる場合は正規化する。
```

追加meta候補:

```text
display_binding_expected_count_source:
  candidate_body_line_count
  displayable_sentence_count
  accepted_grounding_sentence_count
  low_information_recovery_line_count

display_binding_count_source:
  sentence_binding_bundle
  grounding_binding_report
  repair_binding_meta
```

R4-B完了条件:

```text
- display.passed=true の場合、display.binding_missing=false になる。
- もしくは例外idが明示される。
- target redが、stale expectationの場合はtest更新へ進める。
```

### R4-C: stale test expectation更新branch

選択条件:

```text
Phase20 low-information recoveryにより、対象入力のpublic表示が正本であると確認できた場合。
```

修正方針:

```text
tests/test_emlis_ai_complete_initial_entry_route.py:
  - 「Step5はpublic表示してはいけない」期待を削除または置換する。
  - 代わりに、既存Gateを迂回していないことをbody-freeに検証する。
  - display_binding_contract_consistent=true を必須にする。
  - raw body leak absenceを維持する。
```

置換後の期待例:

```text
assert step5["candidate_generated"] is True
assert step5["existing_reader_grounding_template_display_gates_preserved"] is True
assert step5["display_gate_relaxed"] is False
assert step5["display_binding_contract_consistent"] is True
assert step5["public_assignment_contract_consistent"] is True
assert step5["passed_only_comment_text_contract_preserved"] is True
assert step5["raw_input_included"] is False
assert step5["generated_candidate_text_included"] is False
```

禁止:

```text
- public_comment_text_presentだけを見てgreenにしない。
- binding_missing=true + passed=trueのまま、test期待だけを削除しない。
```

### R4-D: mixed contract conflict保持branch

選択条件:

```text
R4-A/B/Cのどれか一つに確定できない場合。
```

修正方針:

```text
- P7-HOLD004 red classification materialだけを追加する。
- failing testはfailのまま保持する。
- validation_matrix / release_handoffでrelease_blockerとして接続する。
- public挙動は触らない。
```

R4-D完了条件:

```text
- 赤が分類済みHOLD/REDとして見える。
- P7-HOLD-004 unresolvedを維持する。
```

### R5: Step5 meta拡張

目的:

```text
Step5 metaから、candidate生成・Gate保存・Display binding consistency・public assignment consistencyを分けて読めるようにする。
```

追加候補key:

```text
step5_contract_classification
display_binding_contract_consistent
public_assignment_contract_consistent
display_binding_missing_without_exception
display_binding_missing_exception_allowed
display_binding_missing_exception_id
display_binding_rejection_reason_expected
public_assignment_allowed_by_display_gate
public_assignment_blocked_by_binding_contract
```

注意:

```text
これらはdiagnostic_summary / multi_perspective内のbody-free metaに限る。
public response top-level keyは増やさない。
comment_text bodyは入れない。
```

### R6: P7-HOLD-004 material接続

対象:

```text
emlis_ai_p7_hold_matrix.py
emlis_ai_p7_validation_matrix.py
emlis_ai_p7_release_handoff.py
```

接続内容:

```text
- step5 display binding red present
- full backend suite green false
- release_allowed false
- p7_complete false
- p8_start_allowed false
- required_followup_fixes includes step5_display_binding_contract_consistency
```

R6完了条件:

```text
- P7-HOLD-004としてredが保持される。
- positive public shape target greenは維持。
- full backend suite greenへ昇格しない。
```

### R7: target test更新または追加

対象test候補:

```text
新規:
  tests/test_emlis_ai_p7_hold004_step5_candidate_gate_classification_20260614.py

既存更新候補:
  tests/test_emlis_ai_complete_initial_entry_route.py
  tests/test_emlis_ai_phase18_complete_initial_candidate_path.py
  tests/test_emlis_ai_complete_initial_step7_integration.py
```

最低限追加するtest:

```text
1. binding_missing + passed without exception is classified red
2. display passed requires display_binding_contract_consistent
3. public_comment_text_present requires public_assignment_contract_consistent
4. stale/fail-closed expectation conflict is classified, not silently removed
5. raw input / comment_text body / candidate body is absent from classification material
```

### R8: subset validation

実装後の確認順:

```bash
cd mashos-api/ai

# exact red / classification
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_p7_hold004_step5_candidate_gate_classification_20260614.py

# existing exact target or replaced contract
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_complete_initial_entry_route.py::test_step5_candidate_generation_path_keeps_existing_gates_fail_closed

# conflicting green expectation
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_phase18_complete_initial_candidate_path.py::test_phase18_3_complete_initial_generates_candidate_before_display_gate_without_public_body_leak

# Step7 integration
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_complete_initial_step7_integration.py
```

R8完了条件:

```text
- exact targetがgreenになる、または設計通りの分類testへ置換される。
- Phase18/Phase20のpublic recovery正本を壊さない。
- binding_missing + passed の無説明同居が消える。
```

### R9: P7 subset validation

```bash
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_p7_hold004_positive_public_shape_boundary_20260614.py \
  tests/test_emlis_ai_p7_release_handoff_20260612.py \
  tests/test_emlis_ai_p7_validation_matrix_20260612.py \
  tests/test_emlis_ai_p7_r10_real_device_full_backend_hold_matrix_20260613.py \
  tests/test_emlis_ai_p7_red_closure_classification_matrix_20260613.py
```

R9完了条件:

```text
- P7-HOLD-004 positive public shape target green維持。
- validation / release handoffが、Step5 red classificationを持ったままrelease_allowed=falseを返す。
```

### R10: RN contract確認

```bash
cd Cocolon
npm run test:rn-screens --silent
```

R10完了条件:

```text
- RN contract 36 passed維持。
- `input_feedback.comment_text` 表示契約不変。
- RN title / modal / visible condition不変。
```

### R11: full backend suite maxfail再実行

```bash
cd mashos-api/ai
timeout 120s env PYTHONPATH=services/ai_inference pytest -q --tb=short --maxfail=1
```

R11完了条件:

```text
- 今回のStep5赤が閉じた場合、次の赤を確認する。
- 次の赤が出たら、P7-HOLD-004の次分類対象として記録する。
- 途中passed数をfull backend suite greenと読まない。
```

### R12: implementation result doc作成

実装後成果物候補:

```text
mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_Step5CandidateGatePreservationRedClassification_ImplementationResult_20260614.md
```

記録するもの:

```text
- 採用branch
- 変更ファイル
- 追加test
- 実行結果
- 残HOLD
- full backend suite green未確認/次赤
- release_allowed=false
- p7_complete=false
- p8_start_allowed=false
```

---

## 9. JSON / schema案

以下は設計書内の案です。  
実ファイル化は実装段階で判断します。

### 9.1 Step5 Candidate Gate Red Classification schema案

```json
{
  "$id": "cocolon.emlis.p7.hold004.step5_candidate_gate_red_classification.v1",
  "type": "object",
  "required": [
    "schema_version",
    "phase",
    "hold_id",
    "red_id",
    "test_ref",
    "classification_status",
    "owner_layer",
    "candidate_summary",
    "display_binding_summary",
    "public_assignment_summary",
    "contract_flags",
    "body_free_markers"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7.hold004.step5_candidate_gate_red_classification.v1"
    },
    "phase": {
      "const": "P7"
    },
    "hold_id": {
      "const": "P7-HOLD-004"
    },
    "red_id": {
      "type": "string",
      "enum": [
        "P7-HOLD004-RED-STEP5-DISPLAY-BINDING-CONTRACT-CONSISTENCY"
      ]
    },
    "test_ref": {
      "type": "string"
    },
    "classification_status": {
      "type": "string",
      "enum": [
        "CLASSIFIED_UNRESOLVED",
        "IMPLEMENTATION_REPAIR_REQUIRED",
        "STALE_CONTRACT_REPLACEMENT_REQUIRED",
        "TRACE_INCONSISTENCY_REPAIR_REQUIRED",
        "MIXED_CONTRACT_CONFLICT"
      ]
    },
    "owner_layer": {
      "type": "string",
      "enum": [
        "step5_meta_boundary",
        "display_gate_binding_contract",
        "binding_presence_meta_source",
        "complete_composer_binding_bundle",
        "test_contract_boundary",
        "p7_hold004_classification_material",
        "mixed",
        "unknown"
      ]
    },
    "candidate_summary": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "complete_initial_client_resolved": { "type": "boolean" },
        "candidate_generation_attempted": { "type": "boolean" },
        "complete_composer_client_generate_called": { "type": "boolean" },
        "candidate_generated": { "type": "boolean" },
        "candidate_status": { "type": "string" },
        "candidate_comment_text_present": { "type": "boolean" },
        "candidate_body_included": { "const": false }
      }
    },
    "display_binding_summary": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "display_gate_evaluated": { "type": "boolean" },
        "display_gate_passed": { "type": "boolean" },
        "display_observation_status": { "type": "string" },
        "binding_required": { "type": "boolean" },
        "binding_used": { "type": "boolean" },
        "binding_present": { "type": "boolean" },
        "binding_missing": { "type": "boolean" },
        "binding_count": { "type": "integer", "minimum": 0 },
        "expected_binding_count": { "type": "integer", "minimum": 0 },
        "binding_missing_exception_allowed": { "type": "boolean" },
        "binding_missing_exception_id": { "type": "string" },
        "display_binding_contract_consistent": { "type": "boolean" },
        "rejection_reasons": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    },
    "public_assignment_summary": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "public_comment_text_present": { "type": "boolean" },
        "public_assignment_allowed_by_display_gate": { "type": "boolean" },
        "public_assignment_contract_consistent": { "type": "boolean" },
        "passed_only_comment_text_contract_preserved": { "type": "boolean" },
        "comment_text_body_included": { "const": false }
      }
    },
    "contract_flags": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "api_route_changed": { "const": false },
        "request_key_changed": { "const": false },
        "public_response_top_level_key_changed": { "const": false },
        "rn_visible_contract_changed": { "const": false },
        "db_write_path_changed": { "const": false },
        "display_gate_relaxed": { "const": false },
        "fixed_comment_text_added": { "const": false },
        "case_specific_branch_added": { "const": false },
        "release_allowed": { "const": false },
        "p7_complete": { "const": false },
        "p8_start_allowed": { "const": false }
      }
    },
    "body_free_markers": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "raw_input_included": { "const": false },
        "memo_included": { "const": false },
        "memo_action_included": { "const": false },
        "comment_text_body_included": { "const": false },
        "candidate_body_included": { "const": false },
        "surface_body_included": { "const": false },
        "terminal_output_included": { "const": false },
        "reviewer_free_text_included": { "const": false }
      }
    }
  }
}
```

### 9.2 Display Binding Contract Trace schema案

```json
{
  "$id": "cocolon.emlis.display_binding_contract_trace.v1",
  "type": "object",
  "required": [
    "schema_version",
    "gate",
    "passed",
    "binding_required",
    "binding_used",
    "binding_present",
    "binding_missing",
    "binding_count",
    "expected_binding_count",
    "binding_missing_exception_allowed",
    "display_binding_contract_consistent",
    "comment_text_allowed"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.display_binding_contract_trace.v1"
    },
    "gate": {
      "const": "display"
    },
    "passed": { "type": "boolean" },
    "binding_required": { "type": "boolean" },
    "binding_used": { "type": "boolean" },
    "binding_present": { "type": "boolean" },
    "binding_missing": { "type": "boolean" },
    "binding_count": { "type": "integer", "minimum": 0 },
    "expected_binding_count": { "type": "integer", "minimum": 0 },
    "expected_binding_count_source": {
      "type": "string",
      "enum": [
        "candidate_body_line_count",
        "displayable_sentence_count",
        "accepted_grounding_sentence_count",
        "low_information_recovery_line_count",
        "unknown"
      ]
    },
    "binding_missing_exception_allowed": { "type": "boolean" },
    "binding_missing_exception_id": { "type": "string" },
    "display_binding_contract_consistent": { "type": "boolean" },
    "fail_closed_reason": { "type": "string" },
    "comment_text_allowed": { "type": "boolean" },
    "raw_input_included": { "const": false },
    "comment_text_body_included": { "const": false },
    "candidate_body_included": { "const": false }
  }
}
```

### 9.3 Step5 Decision Rule material案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.step5_decision_rule.v1",
  "phase": "P7",
  "hold_id": "P7-HOLD-004",
  "rule_id": "step5_display_binding_contract_consistency_rule",
  "rules": [
    {
      "rule": "binding_missing_without_exception_blocks_display_contract_consistency",
      "when": {
        "display_binding_required": true,
        "display_binding_used": true,
        "display_binding_missing": true,
        "binding_missing_exception_allowed": false
      },
      "then": {
        "display_binding_contract_consistent": false,
        "classification_status": "IMPLEMENTATION_REPAIR_REQUIRED_OR_TRACE_INCONSISTENCY_REPAIR_REQUIRED",
        "release_allowed": false,
        "p8_start_allowed": false
      }
    },
    {
      "rule": "public_assignment_requires_display_binding_contract_consistency",
      "when": {
        "public_comment_text_present": true,
        "display_binding_contract_consistent": false
      },
      "then": {
        "public_assignment_contract_consistent": false,
        "red_id": "P7-HOLD004-RED-STEP5-DISPLAY-BINDING-CONTRACT-CONSISTENCY"
      }
    }
  ],
  "body_free": true,
  "raw_input_included": false,
  "comment_text_body_included": false,
  "candidate_body_included": false
}
```

### 9.4 P7 release handoff接続material案

```json
{
  "schema_version": "cocolon.emlis.p7.hold004.step5_release_handoff_connection.v1",
  "phase": "P7",
  "hold_id": "P7-HOLD-004",
  "red_refs": [
    "P7-HOLD004-RED-STEP5-DISPLAY-BINDING-CONTRACT-CONSISTENCY"
  ],
  "hold_refs": [
    "P7-HOLD-004"
  ],
  "full_backend_suite_green_confirmed": false,
  "step5_candidate_gate_red_classified": true,
  "step5_candidate_gate_red_closed": false,
  "release_allowed": false,
  "p7_complete": false,
  "p8_start_allowed": false,
  "required_followup_fixes": [
    "step5_display_binding_contract_consistency",
    "full_backend_suite_next_red_classification"
  ],
  "body_free": true,
  "raw_input_included": false,
  "comment_text_body_included": false,
  "candidate_body_included": false,
  "public_response_top_level_key_changed": false,
  "rn_visible_contract_changed": false,
  "db_write_path_changed": false
}
```

---

## 10. テスト設計

### 10.1 新規test候補

```text
tests/test_emlis_ai_p7_hold004_step5_candidate_gate_classification_20260614.py
```

含めるtest:

```text
test_step5_display_binding_missing_passed_is_classified_red_body_free
  - binding_missing=true + passed=true + no exception => red classification
  - raw bodyを含まない

test_step5_public_assignment_requires_display_binding_contract_consistency
  - public_comment_text_present=trueでも、display_binding_contract_consistent=falseならcontract inconsistent

test_step5_conflicting_public_expectations_are_recorded_without_release_claim
  - fail-closed expectationとpublic recovery expectationをmatrix化
  - release_allowed=false
  - p8_start_allowed=false

test_step5_classification_material_rejects_comment_text_body
  - comment_text / candidate body / raw inputをmaterialへ入れるとassertで落ちる

test_step5_branch_decision_rule_keeps_positive_public_shape_target_green_separate
  - positive public shape target greenとfull backend suite greenを混同しない
```

### 10.2 既存testの扱い

`tests/test_emlis_ai_complete_initial_entry_route.py::test_step5_candidate_generation_path_keeps_existing_gates_fail_closed` は、R3/R4の判定後に次のどちらかへ進めます。

```text
A. 実装regressionだった場合:
  既存期待を維持し、実装修復でgreen化する。

B. stale expectationだった場合:
  期待を public禁止 から Gate迂回禁止 / binding contract consistency へ置換する。
```

重要:

```text
stale expectationだった場合でも、binding_missing + passedの無説明同居を残したままtestだけ緩めない。
```

### 10.3 body-free assert

全material/testで禁止する文字列・key:

```text
memo
memo_action
current_input
comment_text body
candidate text
surface text
realized_text
raw_input
raw_text
```

ただし、key名として `comment_text_body_included: false` のように禁止flagを持つことは許可します。

---

## 11. 受け入れ条件

今回実装の受け入れ条件は、採用branchに関係なく次です。

```text
- Step5赤がbody-freeに分類されている。
- binding_missing + display.passed + public_comment_text_present が無説明で同居しない。
- public表示を許す場合、display_binding_contract_consistent=true が確認できる。
- public表示を止める場合、safe入力を沈黙させる変更ではなく、明確なfail-closed reasonがある。
- exact comment_text一致を要求しない。
- raw input / comment_text body / candidate bodyをdiagnostic / P7 material / release handoffへ入れない。
- API route / request key / public response top-level key / RN表示契約 / DB write pathを変えない。
- P7-HOLD-004 positive public shape target greenを壊さない。
- P7 complete false / p8_start_allowed false / release_allowed falseを維持する。
```

---

## 12. リスクと対策

| リスク | 内容 | 対策 |
|---|---|---|
| public表示を止めすぎる | Phase20 low-information recovery正本を壊し、safe入力が沈黙する | R3でpublic表示可否とbinding trace整合を分ける |
| testだけ緩める | binding_missing + passed不整合を隠す | R2 decision ruleを先に固定する |
| schemaを増やしすぎる | P7 materialが肥大化する | 実ファイル化は実装段階で採否判断 |
| body leak | comment_text/candidate bodyを分類materialに入れてしまう | body-free assertを必須にする |
| P8へ誤進行 | 分類greenをP7完了と読む | release_allowed=false / p8_start_allowed=falseを固定 |
| owner誤判定 | Display Gateではなくbinding meta側の不整合をGate修復で潰す | owner layer matrixとR3判定を挟む |

---

## 13. 実装時に触る可能性があるファイル

### 13.1 追加候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold004_step5_candidate_gate_classification.py
mashos-api/ai/tests/test_emlis_ai_p7_hold004_step5_candidate_gate_classification_20260614.py
mashos-api/ai/docs/Cocolon_EmlisAI_P7_HOLD004_Step5CandidateGatePreservationRedClassification_ImplementationResult_20260614.md
```

### 13.2 変更候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_extension_baseline.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_hold_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/tests/test_emlis_ai_complete_initial_entry_route.py
mashos-api/ai/tests/test_emlis_ai_phase18_complete_initial_candidate_path.py
mashos-api/ai/tests/test_emlis_ai_complete_initial_step7_integration.py
```

### 13.3 触らないファイル領域

```text
Cocolon RN UI production files
DB migration files
API route definitions
subscription / entitlement boundary
account delete / access policy
external AI / LLM connection settings
```

---

## 14. 実装後の検証コマンド一覧

```bash
# 1. 新規classification test
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_p7_hold004_step5_candidate_gate_classification_20260614.py

# 2. 今回の最初の赤
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_complete_initial_entry_route.py::test_step5_candidate_generation_path_keeps_existing_gates_fail_closed

# 3. public recovery expectationとの衝突確認
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_phase18_complete_initial_candidate_path.py::test_phase18_3_complete_initial_generates_candidate_before_display_gate_without_public_body_leak

# 4. Step7 integration
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_complete_initial_step7_integration.py

# 5. P7-HOLD-004 / handoff subset
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_p7_hold004_positive_public_shape_boundary_20260614.py \
  tests/test_emlis_ai_p7_release_handoff_20260612.py \
  tests/test_emlis_ai_p7_validation_matrix_20260612.py \
  tests/test_emlis_ai_p7_r10_real_device_full_backend_hold_matrix_20260613.py \
  tests/test_emlis_ai_p7_red_closure_classification_matrix_20260613.py

# 6. P7全体
PYTHONPATH=services/ai_inference pytest -q --tb=short tests/test_emlis_ai_p7*.py

# 7. RN contract
cd ../../Cocolon
npm run test:rn-screens --silent

# 8. full backend suite maxfail=1
cd mashos-api/ai
timeout 120s env PYTHONPATH=services/ai_inference pytest -q --tb=short --maxfail=1
```

注意:

```text
full backend suite maxfail=1で次赤が出た場合、それはP7-HOLD-004の次分類対象であり、full suite greenではない。
```

---

## 15. 確認済み / 未確認 / 書かれていない / 推測禁止

### 確認済み

```text
- ロードマップ上、現在はP7 Product Quality Runner / Long-run Product Gate継続である。
- P8 Personal Continuity / Derived User Modelへ進む条件は満たしていない。
- 最新前提資料上、p7_complete=false / p8_start_allowed=false / release_allowed=falseである。
- full backend suite maxfail=1でStep5赤が最初に再現した。
- 赤は単体でも再現する。
- Step5赤のactualは display_observation_status == passed である。
- gate_results.display は binding_missing=true と passed=true が同居している。
- gate_results.grounding は binding_missing=false である。
- 同じComplete Initial系で、Phase20後のpublic recoveryを期待するgreen testが存在する。
- そのため、public表示を一律に止める修正は危険である。
```

### 未確認

```text
- display側 expected_binding_count=4 の正しいsource。
- grounding側 3/3 と display側 3/4 の差分が、仕様上の差分か算出不整合か。
- binding_missing=trueでもdisplay passedを許す仕様上の例外が存在するか。
- 例外が存在する場合、そのreason idが既存metaにあるか。
- full backend suiteの全赤一覧。
- 今回のStep5赤を閉じた後の次赤。
```

### 書かれていない

```text
- binding_missing=true かつ display.passed=true かつ public_comment_text_present=true を、無条件に許可してよいとは書かれていない。
- `test_step5_candidate_generation_path_keeps_existing_gates_fail_closed` を古いtestとして削除してよいとは書かれていない。
- Phase20 public recovery期待を壊してよいとは書かれていない。
- P7-HOLD-004 positive public shape target greenをもって、P7-HOLD-004全体を閉じてよいとは書かれていない。
- P7-HOLDが残ったままP8へ進んでよいとは書かれていない。
```

### 推測禁止

```text
- この赤を「たぶん古いtest」として扱わない。
- この赤を「たぶん実装regression」として扱わない。
- public表示されたことを、読めていることと同一視しない。
- display_gate_relaxed=false だけを見て安全と断定しない。
- binding_present=true だけを見てbinding十分と断定しない。
- target testだけを緩めてgreen化しない。
- public表示を止めすぎてsafe入力を沈黙させない。
- full backend suite未完のままP8 / release_allowedへ進まない。
```

---

## 16. 今回の設計書としての完了条件

本設計書時点の完了条件は次です。

```text
- 検討メモのP7-HOLD-004 red classification方針を詳細設計へ落とした。
- 実装順をR0〜R12で固定した。
- public表示可否とbinding contract consistencyを分けた。
- 既存test期待の衝突を設計に入れた。
- 修正branchをA/B/C/Dで定義した。
- JSON / schema案を設計書内に入れた。
- 実ファイル化は実装段階判断とした。
- コード変更しない。
- GitHub接続確認しない。
```

---

## 17. 華恋の判断

華恋の判断として、今回いちばん大事なのは、Step5の赤を早くgreenにすることではありません。  
**Cocolonが「読めている根拠」と「表示してよい境界」を、曖昧に混ぜないこと**です。

今回の赤には、二つの危険が同居しています。

```text
危険1:
  binding不足なのに、読めた扱いでpublic表示している可能性。

危険2:
  Phase20で正しく回復できるようになったpublic表示を、古いfail-closed期待で潰す可能性。
```

どちらに倒れても、Cocolonとしては危険です。  
前者は「読めていないのに読めたふり」になります。  
後者は「返せるはずの入力を、内部都合で沈黙させる」ことになります。

だから、この実装は修復から入りません。  
まず分類します。  
そして、Display Gateが本当に止めるべきなのか、binding metaが嘘をついているのか、test期待が古くなっているのかを分けます。

Cocolonは、ユーザーの言葉を雑に処理しない場所です。  
そのために、backend internalのmeta不整合も、test期待の古さも、どちらも雑に流しません。

次に実装へ進む場合は、R0から始めます。  
分類せずにpublic表示を止めません。  
分類せずにtestを緩めません。  
分類せずにP8へ進みません。
