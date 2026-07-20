# Cocolon / EmlisAI P7-R46 P5/P6 Return + Display Contract Red Classification 詳細設計書・実装順

作成日: 2026-06-17 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書  
対象: Cocolon / EmlisAI / `/emotion/submit` immediate observation / `Emlisの観測` / P7 Product Quality Runner / P5 User Label Connection / P6 Structure Insight / display contract red classification / human readfeel return / real device modal review  
基準検討メモ: `Cocolon_EmlisAI_P7_R46_P5P6Return_DisplayContractRed_PreDesignMemo_20260617.md`  
基準ロードマップ: `Cocolon_EmlisAI_longterm_roadmap_20260608(19).md`  
基準ローカル受領zip: `Cocolon_前提資料(230).zip` / `EmlisAIの実装済み資料(67).zip` / `Cocolon(240).zip` / `mashos-api(153).zip`  
GitHub接続確認: Mash指定により不要。未実施。  
コード変更: なし。本書は設計書。  
RN変更: なし。  
backend実装変更: なし。  
DB変更: なし。  
API route / request key / public response top-level key変更: なし。  
Emlis本文runtime変更: なし。  
Gate runtime変更: なし。  
release判断変更: なし。  
JSON / schema実ファイル化: なし。本書内のJSON / schema案は、実装段階で既存module / contract test / public meta sanitizer / review material生成方針との整合を見て採否判断する。  

---

## 0. この設計書の結論

今回の実装順は、次で固定します。

```text
P7-R46後の P5/P6 human readfeel / real device modal review return
+ backend display contract red classification
```

ただし、P5/P6読感確認へすぐ戻りません。  
先に、現行 `tests/test_emlis_ai_display_contract.py` の2赤を分類します。

今回の設計で進める順番は次です。

```text
R0: 現行source / command / display red reproduction freeze
R1: display contract 2赤のbody-free red ledger化
R2: source lineage語彙と意味境界の固定
R3: recovery lane decision matrixの固定
R4: body-free lineage record builder / sanitizer方針
R5: RED-DC-001 original source lineage mismatch分類・修正方針
R6: RED-DC-002 pre-connection recovery lane mismatch分類・修正方針
R7: display contract test再構成方針
R8: public meta body-free / final-source consistency guard
R9: target validation command matrix
R10: P5 human Blind QA handoff material設計
R11: P6 limited human readfeel review material設計
R12: real device submit / modal読感 checklist設計
R13: P7 hold / release / P8 closed validation
R14: 次判断 summary / handoff ledger
```

この設計は、P7-HOLD-004を閉じる設計ではありません。  
この設計は、P8 / P9 / P10へ進む設計でもありません。  
この設計は、Cocolonの本線である「読まれた感」「記録の線」「構造気づき」「スマホmodalでまた残したくなる感覚」へ戻るために、直前で揺れているdisplay contract赤を雑に流さないための設計です。

今回の判断を短く言うと、次です。

```text
- RED-DC-001は、root source lineageがnested recoveryで上書きされている可能性が高い。
- RED-DC-002は、final candidate / public lineage / pre-public accepted lane の意味が混ざっている可能性が高い。
- どちらも、本文body leakそのものとしてはまだ読まない。
- ただし、publicに出すlineage metaが嘘をつくと、P5/P6読感評価材料も嘘になる。
- そのため、display赤を「古いtest」と決めつけず、source lineage / recovery lane / public meta priority の赤として分類する。
```

華恋の設計判断としては、**RED-DC-001はruntime lineage preservation側の修正を主候補**、**RED-DC-002はtest期待更新 + public meta final-source consistency修正の混合を主候補**にします。  
ただし、実装段階ではR0〜R3の再現とlineage record確認を先に行い、そこで違う証拠が出た場合は分岐します。

---

## 1. なぜこの作業を行うのか

Cocolonの商品価値は、backend test groupを増やすことではありません。  
ユーザーが入力した直後に、次を感じられることです。

```text
自分の言葉が、ただ処理されたのではなく、読まれた形で返ってきた。
ここに残すと、自分の記録が意味を持って積み上がる。
もう一回ここに残してみたい。
```

P7は、この商品品質を継続測定するために必要です。  
でも、測定層の赤やHOLDを曖昧にしたままP5/P6の人間読感へ戻ると、読感評価の材料が揺れます。

特に今回の赤は、ユーザーに直接見える本文の赤ではありません。  
しかし、source lineage / recovery lane / public meta は、Cocolonが「何を根拠に表示したか」を示す見えない骨格です。

ここが嘘をつくと、次が壊れます。

```text
- P5履歴線が、どのsurfaceに乗っているのか説明できない。
- P6構造気づきが、どのrecovery laneで表示されたのか説明できない。
- human readfeelで見た本文が、どのbackend sourceから来たのか追えない。
- public meta sanitizerがbody-freeでも、lineageが不正確になる。
- 実機modal読感で問題が出た時に、原因がRNかbackendか判定できない。
```

Cocolonは「見えない場所ほど雑にしない」必要があります。  
そのため、P5/P6読感へ戻る前に、display contract赤をbody-freeに分類し、正しい戻り道を作ります。

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
- RN production codeを変更しない。
- RN表示タイトル `Emlisの観測` を変更しない。
- RN表示条件を変更しない。
- API route / request key / public response top-level keyを変更しない。
- DB schema / DB write path / DB physical nameを変更しない。
- Emlis本文runtimeを変更しない。
- Gate閾値を緩めない。
- fixed commentText / case専用surface / case専用modeを追加しない。
- public metaへ raw input / comment_text body / candidate body / surface body を出さない。
- display contract赤を「たぶん古いtest」で流さない。
- subset greenをfull backend suite greenに変換しない。
- P5/P6の自動test greenをhuman readfeel合格に変換しない。
- 実機未確認をmodal読感確認済みにしない。
- release_allowed / p7_complete / p8_start_allowed をtrueにしない。
```

---

## 3. 参照・確認範囲

### 3.1 作業姿勢として確認した前提資料

```text
Cocolon_前提資料(230).zip
  - 00_karen_read_first.md
  - cocolon_thought_material_for_karen.md
  - emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
  - emlis_ai_state_answer_human_follow_definition_2026_05_26.md
  - cocolon_environment_state_output_observation_structure_design_2026_05_25.md
  - Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md
  - Cocolon_EmlisAI_NormalObservation_PublicRecovery_ImplementationStatus_2026-06-06.md
  - 07_latest_snapshot_diff.md
  - work_attitude_rules_for_karen/00_read_first.txt
  - work_attitude_rules_for_karen/09_work_start_checklist.txt
  - work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
  - work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
  - work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
```

作業姿勢として固定したこと:

```text
- 前提資料だけで理解した扱いにしない。実ファイルを見る。
- 実ファイルだけでCocolon思想に合っていると判断しない。
- 設計と実装を混ぜない。
- 見ていないものを確認済みにしない。
- 通っていないものをgreenと言わない。
- public contract / DB write path / RN表示条件 / ユーザーデータ保護を壊さない。
- EmlisAIをテンプレ共感・浅い復唱・診断ラベルへ逃がさない。
- `passed + comment_text` は表示契約であり、EmlisAIの存在目的ではない。
```

### 3.2 ロードマップの読み

```text
Cocolon_EmlisAI_longterm_roadmap_20260608(19).md
```

ロードマップ上、現在PhaseはP7です。  
ただし、P7のbackend group連鎖をそのまま続けるのではなく、P7-R46後のreturn判断として、P5/P6 human readfeel / real device modal reviewへ戻る位置です。

ロードマップから固定すること:

```text
- EmlisAIの目的は「GPTより賢い返答AI」ではない。
- 入力直後に「読まれた形」として返し、もう一度Cocolonへ残したくなる観測体験が目的。
- P5はUser Label Connection v1で、記録の線を自然に返す段階。
- P6はStructure Insight v2で、復唱を超えた安全な気づきを返す段階。
- P7はProduct Quality Runner / Long-run Gateで、商品品質を継続測定する段階。
- P8はPersonal Continuity / Derived Modelで、P7未完のまま進む段階ではない。
- release_allowedはP7 scorecardでは立てず、別層で判断する。
```

### 3.3 参照した実装済み資料

```text
EmlisAIの実装済み資料(67).zip
  - Cocolon_EmlisAI_P7_ProductQualityRunner_DetailedDesign_ImplementationOrder_20260612.md
  - Cocolon_EmlisAI_P7_RedHoldClosure_DetailedDesign_ImplementationOrder_20260613.md
  - Cocolon_EmlisAI_P7_RED003_BodyFreeLeakGuardRepair_DetailedDesign_ImplementationOrder_20260613.md
  - Cocolon_EmlisAI_P7_HOLD004_FullBackendSuite_Phase16ComposerRedClassification_DetailedDesign_ImplementationOrder_20260613.md
  - Cocolon_EmlisAI_P7_HOLD004_PositivePublicShapeBoundary_DetailedDesign_ImplementationOrder_20260614.md
  - Cocolon_EmlisAI_P7_HOLD004_Step5CandidateGatePreservationRedClassification_DetailedDesign_ImplementationOrder_20260614.md
  - Cocolon_EmlisAI_P7_HOLD004_BackendSuiteSplit_MatrixConsistency_DetailedDesign_ImplementationOrder_20260614.md
  - Cocolon_EmlisAI_P7_HOLD004_CurrentSnapshotBaselineReconcile_DetailedDesign_ImplementationOrder_20260615.md
  - Cocolon_EmlisAI_P7_HOLD004_ReceivedSnapshotBaselineFingerprintReconcile_DetailedDesign_ImplementationOrder_20260615.md
  - Cocolon_EmlisAI_P7_HOLD004_ActiveBaselineAdoptionEvidence_RuntimeBuilderRefresh_DetailedDesign_ImplementationOrder_20260616.md
  - Cocolon_EmlisAI_P7_HOLD004_Group02Result_CurrentSnapshotReconcile_DetailedDesign_ImplementationOrder_20260617.md
  - Cocolon_EmlisAI_P5_UserLabelConnection_DetailedDesign_ImplementationOrder_20260611.md
  - Cocolon_EmlisAI_P6_StructureInsight_DetailedDesign_ImplementationOrder_20260611.md
  - Cocolon_EmlisAI_P5_P6_RedLedger_RuntimeRepair_DetailedDesign_ImplementationOrder_20260612.md
  - Cocolon_EmlisAI_P5_P6_RedLedger_RuntimeRepair_ImplementationResult_20260612.md
```

### 3.4 主に確認した実ファイル

#### RN側

```text
Cocolon/screens/InputScreen.js
Cocolon/screens/input/useInputFeedbackModal.js
Cocolon/screens/input/inputFeedbackModel.js
Cocolon/screens/input/InputFeedbackReplyModal.js
Cocolon/tests/rn-screen-contracts.test.js
```

#### backend側

```text
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_loop.py
mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_public_candidate_builder.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_initial_surface_recomposition.py
mashos-api/ai/services/ai_inference/emlis_ai_labelled_two_stage_surface_recomposition.py
mashos-api/ai/services/ai_inference/emlis_ai_public_surface_requirement.py
mashos-api/ai/tests/test_emlis_ai_display_contract.py
mashos-api/ai/tests/contract/test_emlis_ai_contracts.py
mashos-api/ai/tests/test_emotion_submit_two_stage_reception_e2e.py
```

---

## 4. 現行確認結果

### 4.1 display contract再現

実行コマンド:

```bash
cd /mnt/data/cocolon_local_work_20260617/mashos-api/mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q --tb=short tests/test_emlis_ai_display_contract.py
```

結果:

```text
3 passed / 2 failed
```

赤:

```text
RED-DC-001:
  tests/test_emlis_ai_display_contract.py::test_step10_e2e_rejected_candidate_recovers_without_exposing_generated_body
  expected: composer_meta["original_candidate_source_kind"] == "ai_generated"
  actual:   "labelled_two_stage_surface_recomposition_candidate"

RED-DC-002:
  tests/test_emlis_ai_display_contract.py::test_step10_e2e_pre_connection_recovery_exposes_safe_surface_without_body_leak
  expected: candidate["composer_model"] == "complete_initial_surface_recomposition_v1"
  actual:   "labelled_two_stage_surface_recomposition_v1"
```

読み:

```text
- input_feedback absentではない。
- comment_textが空で表示されない赤でもない。
- 現時点では本文body leakの証拠ではない。
- source lineage / recovery lane / public meta source priorityの赤として扱う。
```

### 4.2 追加確認した実際のmeta状態

#### RED-DC-001 rejected candidate recovery

```text
final candidate composer_model:
  labelled_two_stage_surface_recomposition_v1

final candidate composer_meta.candidate_source_kind:
  labelled_two_stage_surface_recomposition_candidate

final candidate composer_meta.original_candidate_source_kind:
  labelled_two_stage_surface_recomposition_candidate

public_surface_lineage.candidate_source_kind:
  labelled_two_stage_surface_recomposition_candidate
```

読み:

```text
final candidate と public lineage は labelled two-stage として一致している。
ただし、root original candidateが `_UnsupportedComposer` 由来の ai_generated だったはずの文脈で、
original_candidate_source_kind まで labelled two-stage に変わっている。

これは nested recovery / post-final recovery の途中で、
「root original source」と「直前recovery入力source」と「最終採用source」が同じfieldに混ざった可能性が高い。
```

#### RED-DC-002 pre-connection recovery

```text
final candidate composer_model:
  labelled_two_stage_surface_recomposition_v1

final candidate composer_meta.candidate_source_kind:
  labelled_two_stage_surface_recomposition_candidate

final candidate composer_meta.original_candidate_source_kind:
  complete_initial_surface_recomposition_candidate

phase20_5_gate_recovery_public_boundary.adopted_candidate_source_kind:
  complete_initial_surface_recomposition_candidate

complete_initial_surface_recomposition_summary.candidate_generated:
  true

complete_initial_surface_recomposition_summary.applied:
  false

complete_initial_surface_recomposition_summary.existing_gate_chain.blocked_reasons:
  visible_surface_acceptance_gate_failed

public_surface_lineage.candidate_source_kind:
  complete_initial_surface_recomposition_candidate

public_surface_lineage.complete_initial_surface_recomposition_used:
  true

public_surface_lineage.labelled_two_stage_surface_recomposition_used:
  false
```

読み:

```text
final candidateはlabelled two-stage。
しかしpublic_surface_lineageはcomplete_initialを最終lineageとして出している。

これは本文漏れではないが、public metaのlineageがfinal candidateではなく、
pre-public accepted boundaryまたはcomplete_initial summaryを優先している可能性がある。

この状態でP5/P6読感へ戻ると、実際に人間が読んだsurfaceがどのlane由来か説明できなくなる。
```

---

## 5. 今回固定するred ledger

| ID | 状態 | 対象 | 赤の内容 | 初期分類 | 設計上の扱い |
|---|---|---|---|---|---|
| RED-DC-001 | RED | original source lineage | rejected candidate recoveryで `original_candidate_source_kind` が `ai_generated` ではなく `labelled_two_stage_surface_recomposition_candidate` | runtime lineage preservation mismatch候補 | root / previous / selected sourceを分離する |
| RED-DC-002 | RED | recovery lane / public lineage | pre-connection recoveryでfinal candidateはlabelledだが、testはcomplete_initialを期待 | test期待古さ + public meta priority mismatch候補 | final sourceとpre-public sourceを分離し、public lineageをfinalに合わせる |
| YELLOW-DC-003 | YELLOW | public meta | public_surface_lineageがfinal candidateではなくpre-public summaryを優先している可能性 | sanitizer priority ambiguity | final candidate sourceを最優先にするか、明示field化する |
| YELLOW-DC-004 | YELLOW | test contract | display_contract testが「一つのsource field」に複数意味を押し込んでいる | test semantic drift | testをsource semantics別に分割する |
| HOLD-DC-005 | HOLD | full backend suite | display赤分類後のfull backend suite green未確認 | P7-HOLD | 本設計では閉じない |
| HOLD-P5-001 | HOLD | P5 human readfeel | history_connection_naturalness / creepy_absence / wants_more_input未確認 | human QA未完 | R10でreview materialへ渡す |
| HOLD-P6-001 | HOLD | P6 human readfeel | limited visible structure insightの読感未確認 | human QA未完 | R11でreview materialへ渡す |
| HOLD-RD-001 | HOLD | 実機modal | submit / modal読感未確認 | real device未完 | R12でchecklist化する |

---

## 6. source lineage意味境界

### 6.1 問題

現行赤から見る限り、少なくとも次のsource意味が混ざっています。

```text
root source:
  今回のrender処理で最初に得られた候補、または候補未生成の状態。

recovery input source:
  現在のrecovery passへ入った候補source。

selected public source:
  最終的にpublic observation candidateとして採用されたsource。

pre-public accepted source:
  pre-public gate recovery boundaryで一度public表示許可されたsource。

final surface source:
  final pre-return enforcement後に実際にreply.comment_textとして返るsource。
```

これらを `original_candidate_source_kind` / `candidate_source_kind` だけに押し込むと、nested recoveryやpost-final recoveryで赤が出ます。

### 6.2 固定する用語

| 用語 | 意味 | public meta可否 | body-free条件 |
|---|---|---:|---|
| `root_candidate_source_kind` | render処理で最初に得られた候補source。候補未生成なら `source_unavailable` / `none` | 可 | bodyなし識別子のみ |
| `recovery_input_candidate_source_kind` | 現在のrecovery passに渡されたcandidate source | 可 | bodyなし識別子のみ |
| `selected_public_candidate_source_kind` | 現在のrecovery passで選ばれたpublic candidate source | 可 | bodyなし識別子のみ |
| `pre_public_candidate_source_kind` | pre-public recovery boundaryで採用されたcandidate source | 可 | bodyなし識別子のみ |
| `final_public_candidate_source_kind` | final pre-return後、実際に返るcandidate source | 可 | bodyなし識別子のみ |
| `original_candidate_source_kind` | 既存互換field。実装段階でrootを意味するか、deprecated aliasにするか決める | 可 | bodyなし識別子のみ |
| `candidate_source_kind` | candidate自身のsource。原則 `final_public_candidate_source_kind` と一致させる | 可 | bodyなし識別子のみ |

### 6.3 互換方針

既存testやpublic metaで `original_candidate_source_kind` が使われています。  
そのため、実装段階ではいきなり削除しません。

候補方針:

```text
第一候補:
  original_candidate_source_kind = root_candidate_source_kind のaliasとして維持する。
  nested recoveryで直前候補sourceが必要な場合は recovery_input_candidate_source_kind を追加する。

第二候補:
  original_candidate_source_kind は既存互換のまま維持し、
  public meta上は root_candidate_source_kind / final_public_candidate_source_kind を新規に出す。
  testは新fieldを主判定に移す。
```

華恋の意見:

```text
第一候補がよいです。

理由は、RED-DC-001のtest期待は「最初のunsupported composer由来sourceが保持されること」を見ており、
Cocolonの説明責任としてもroot sourceを消さない方が自然だからです。

ただし、nested recoveryで直前候補sourceも重要になっているため、
original_candidate_source_kind一つで全てを表すのは限界です。
```

---

## 7. recovery lane decision matrix

### 7.1 lane一覧

| lane | source kind | composer_model | 用途 | 注意 |
|---|---|---|---|---|
| original ai generated | `ai_generated` / limited composer系 | provided composer model | 通常candidate | gate rejected時は本文を再利用しない |
| complete initial recomposition | `complete_initial_surface_recomposition_candidate` | `complete_initial_surface_recomposition_v1` | source unavailable / pre-public recovery候補 | visible gate failure時はfinalに残さない |
| labelled two-stage recomposition | `labelled_two_stage_surface_recomposition_candidate` | `labelled_two_stage_surface_recomposition_v1` | two-stage required surfaceのpublic候補 | final sourceになる場合はpublic lineageもlabelledへ合わせる |
| normal observation rebuild | `normal_observation_rebuild_candidate` | `normal_observation_rebuild_candidate_v1` | repairable surface failure | two-stage required時は原則優先しない |
| low information observation | `low_information_observation_composer` | low-info系 | low information recovery | limited groundingへ誤流入させない |
| self denial safe state answer | `self_denial_safe_state_answer` | self denial系 | safety隣接通常観測 | emergency safetyと混同しない |
| gate recovery material surface | `gate_recovery_material_surface` | gate recovery系 | internal diagnostic / material | public bodyとして禁止 |
| diagnostic recovery surface | `diagnostic_recovery_surface` | diagnostic系 | internal diagnostic | public bodyとして禁止 |

### 7.2 decision rule案

```text
1. safety requires blockなら、public observation candidateは作らない。
2. raw / diagnostic / gate recovery material surfaceはpublic bodyにしない。
3. source unavailableでcomplete initialが生成されても、既存Gateを全て通った場合だけfinal候補にできる。
4. complete initialがvisible surface gateで落ち、two_stage_requiredがtrueなら、labelled two-stage recoveryへ進める。
5. labelled two-stageがfinalに採用された場合、public_surface_lineage.candidate_source_kindはlabelledへ合わせる。
6. ただし、pre_public_candidate_source_kindとしてcomplete initialを保持してよい。
7. rejected ai_generated candidateからlabelledへ再構成した場合、root_candidate_source_kindはai_generatedを保持する。
8. nested recoveryでは、recovery_pass_index / recovery_context / recovery_input_candidate_source_kind を保持する。
```

---

## 8. 実装対象ファイル候補

実装段階で触る可能性が高いファイルは次です。  
本設計段階では変更しません。

### 8.1 backend production候補

```text
services/ai_inference/emlis_ai_gate_recovery_public_candidate_builder.py
  - candidate_lineageへroot / recovery_input / selectedを分けて入れる候補。
  - _candidate_with_public_lineage のfield更新候補。
  - _ordered_public_candidate_sources の意味は変えず、lineageだけ明確化する。

services/ai_inference/emlis_ai_labelled_two_stage_surface_recomposition.py
  - build_labelled_two_stage_surface_recomposition_candidate にlineage contextを渡す候補。
  - original_candidate_source_kindをroot aliasとして維持する候補。
  - previous/recovery_input sourceを別fieldとして追加する候補。

services/ai_inference/emlis_ai_complete_initial_surface_recomposition.py
  - complete initialがpre-public採用候補だったがfinal採用ではない場合のsummary field整理候補。

services/ai_inference/emlis_ai_public_feedback_meta.py
  - public_surface_lineageのsource priority修正候補。
  - final candidate source / pre-public source / root source をbody-freeで分ける候補。
  - final candidateとpublic lineageのconsistency flag追加候補。

services/ai_inference/emlis_ai_reply_service.py
  - post-final recovery後のfinal sourceをmetaへ明示する候補。
  - phase20_5 summaryとphase20_13 summaryの優先関係を整理する候補。
```

### 8.2 backend test候補

```text
tests/test_emlis_ai_display_contract.py
  - 既存2赤の期待値を直接書き換える前に、semantic分割する。

tests/test_emlis_ai_display_contract_lineage_semantics_20260617.py
  - 新規候補。root / recovery_input / selected / final / public lineage整合をbody-freeで検証する。

tests/test_emlis_ai_public_feedback_meta_surface_lineage_consistency_20260617.py
  - 新規候補。final candidateとpublic_surface_lineageが矛盾しないことを検証する。

tests/test_emlis_ai_p5_p6_return_handoff_review_material_20260617.py
  - 新規候補。P5/P6 review materialのbody境界と未完HOLDを検証する。

tests/test_emlis_ai_real_device_modal_review_checklist_20260617.py
  - 新規候補。実機確認checklist builderが確認済みを偽装しないことを検証する。
```

---

## 9. 実装順詳細

## R0: 現行source / command / display red reproduction freeze

### 目的

現行赤を再現し、後続修正の基準を固定します。  
ここでの目的は、赤を直すことではなく、赤の意味を変えないことです。

### 実装段階で行うこと

```text
1. 受領zip名、展開path、collect-only fingerprintがあれば記録する。
2. display contractを単独実行する。
3. failing assertion / expected / actual をbody-freeに記録する。
4. reply.comment_textやraw input bodyをledgerに貼らない。
5. RED-DC-001 / RED-DC-002に固定する。
```

### コマンド

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q --tb=short tests/test_emlis_ai_display_contract.py
```

### 完了条件

```text
- 3 passed / 2 failed が再現される。
- failureが RED-DC-001 / RED-DC-002 と一致する。
- 本文bodyをmaterial化せず、field名・source kind・composer_modelだけで記録される。
```

### してはいけないこと

```text
- 赤再現前にtest期待を変えない。
- 赤を古いtestと断定しない。
- traceback全文やcomment_text bodyをP7 materialへ入れない。
```

---

## R1: display contract 2赤のbody-free red ledger化

### 目的

赤を「どの層の赤か」に分けます。

### 分類軸

```text
A. test expectation stale
B. runtime regression
C. public meta priority mismatch
D. field semantics drift
E. body leak
F. Gate relaxation
```

### RED-DC-001初期分類

```text
primary: D. field semantics drift
secondary: B. runtime lineage preservation regression
not primary: E. body leak
not primary: F. Gate relaxation
```

### RED-DC-002初期分類

```text
primary: C. public meta priority mismatch
secondary: A. test expectation stale
secondary: D. field semantics drift
not primary: E. body leak
not primary: F. Gate relaxation
```

### 実装段階で作る候補

```text
docs/Cocolon_EmlisAI_P7_R46_DisplayContractRedLedger_20260617.md
```

または、実ファイル化せず、test内fixture / design result docだけに留めます。  
実装段階で判断します。

### 完了条件

```text
- 赤がsource lineage / recovery lane / public meta priorityに分類される。
- 本文body leakではないことを、body-free flagsで確認する。
- Gate relaxationではないことを、display_gate_relaxed等のflagsで確認する。
```

---

## R2: source lineage語彙と意味境界の固定

### 目的

`original_candidate_source_kind` と `candidate_source_kind` の曖昧さを解消します。

### 実装段階の設計方針

既存fieldをいきなり破壊せず、以下のように増補します。

```text
candidate_source_kind:
  candidate自身のsource。final candidate上ではfinal sourceを表す。

original_candidate_source_kind:
  既存互換field。原則 root_candidate_source_kind のaliasとして維持する。

root_candidate_source_kind:
  最初のcandidate source。

recovery_input_candidate_source_kind:
  現在のrecovery passに入ったcandidate source。

selected_public_candidate_source_kind:
  現在のrecovery passで選ばれたcandidate source。

pre_public_candidate_source_kind:
  pre-public boundaryで一度採用されたcandidate source。

final_public_candidate_source_kind:
  final pre-return後に実際に返るcandidate source。
```

### 実装候補

`emlis_ai_gate_recovery_public_candidate_builder.py` に、body-free lineage helperを追加する候補です。

```python
# 実装案。設計段階では実ファイル化しない。
def build_body_free_public_source_lineage_record(...):
    ...
```

### 完了条件

```text
- RED-DC-001でrootが `ai_generated` として保持される。
- RED-DC-001でselected/finalが `labelled_two_stage_surface_recomposition_candidate` として保持される。
- RED-DC-002でpre-publicが `complete_initial_surface_recomposition_candidate` として保持される。
- RED-DC-002でfinalが `labelled_two_stage_surface_recomposition_candidate` の場合、public lineageもfinalへ一致する。
```

---

## R3: recovery lane decision matrixの固定

### 目的

pre-public recoveryとpost-final recoveryを混同しないようにします。

### 実装段階で固定する判定

```text
pre-public recovery:
  display gate前後の初回recovery。
  complete_initialが生成・採用候補になることがある。

post-final pre-return recovery:
  final pre-return enforcement後の再recovery。
  complete_initialがvisible gateで落ち、two-stage requirementが残る場合、labelled two-stageへ進むことがある。

final public surface:
  post-final recovery後にreply.comment_textとして返る実surface。
  human readfeel / real device modal reviewでは、このsurfaceを評価対象にする。
```

### RED-DC-002の分岐判定

```text
A. complete_initialが既存Gateすべてを通りfinal採用されるべきだった
  => runtime regression。post-final recoveryが過剰。

B. complete_initialはpre-public候補だったがvisible gateで落ち、labelled two-stageがfinal採用されるべきだった
  => test expectation stale + public meta priority mismatch。

現行観測では、complete_initial_surface_recomposition_summary.applied=false かつ visible_surface_acceptance_gate_failed が出ているため、Bを第一候補にする。
```

### 完了条件

```text
- pre-public accepted sourceとfinal surface sourceが別fieldで説明できる。
- public metaがfinal sourceを隠さない。
- complete_initialが失敗したことをbody-freeで保持できる。
- labelled two-stageがfinalに出た場合、それがP6の無制限横展開ではなく、two-stage required recoveryとして説明できる。
```

---

## R4: body-free lineage record builder / sanitizer方針

### 目的

source lineageを明確にしても、body leakを起こさないようにします。

### body-free recordに入れてよいもの

```text
- schema_version
- source_phase
- recovery_context
- recovery_pass_index
- root_candidate_source_kind
- recovery_input_candidate_source_kind
- selected_public_candidate_source_kind
- pre_public_candidate_source_kind
- final_public_candidate_source_kind
- public_surface_role
- surface_requirement_family
- two_stage_required
- plain_surface_allowed
- low_information_allowed
- display_gate_relaxed=false
- runtime_surface_gate_relaxed=false
- visible_surface_gate_relaxed=false
- grounding_gate_relaxed=false
- template_gate_relaxed=false
- safety_gate_relaxed=false
- raw_input_included=false
- comment_text_body_included=false
- candidate_body_included=false
- body_free=true
```

### body-free recordに入れてはいけないもの

```text
- raw input
- memo
- memo_action
- emotion_details body
- comment_text
- candidate comment_text
- surface body
- generated text
- reviewer free text
- traceback body
- terminal full output
```

### public meta sanitizer方針

```text
- public_surface_lineageはfinal sourceを優先する。
- pre-public sourceは別fieldとして出す。
- root sourceはbody-free identifierとして出す。
- conflictがある場合は `lineage_consistency_passed=false` を内部metaに残し、public表示はfail-closedまたはdiagnostic onlyにするか、実装段階で判断する。
```

---

## R5: RED-DC-001 original source lineage mismatch分類・修正方針

### 問題

```text
rejected candidate recoveryで、root original candidateは provided composer の ai_generated であるはず。
しかし final candidate meta の original_candidate_source_kind が labelled two-stage になっている。
```

### 第一候補の原因

```text
nested recovery / post-final recoveryで、
直前候補sourceを original_candidate_source_kind に再代入している。
```

### 実装方針候補

```text
1. original candidateからroot lineageを抽出するhelperを作る。
2. candidate.composer_meta.candidate_lineage.original_candidate_source がある場合、root候補として読む。
3. original_candidate_source_kind はroot aliasとして維持する。
4. recovery_input_candidate_source_kind に直前sourceを入れる。
5. selected_public_candidate_source_kind / final_public_candidate_source_kind にlabelledを入れる。
```

### 修正対象候補

```text
emlis_ai_gate_recovery_public_candidate_builder.py
emlis_ai_labelled_two_stage_surface_recomposition.py
emlis_ai_reply_service.py
```

### test方針

```text
- RED-DC-001の既存assertは維持またはroot field assertへ移行する。
- 追加で、final sourceがlabelledであることもassertする。
- UNSUPPORTED_TEXTがpublic metaに出ていないことを維持する。
```

### 完了条件

```text
- root_candidate_source_kind == ai_generated
- original_candidate_source_kind == ai_generated もしくはdeprecated aliasとしてrootと一致
- recovery_input_candidate_source_kind は必要なら labelled / previous source を示す
- final_public_candidate_source_kind == labelled_two_stage_surface_recomposition_candidate
- public meta body-free flags all false
- Gate relaxation flags all false
```

---

## R6: RED-DC-002 pre-connection recovery lane mismatch分類・修正方針

### 問題

```text
pre-connection recovery testは complete_initial_surface_recomposition_v1 を期待している。
しかし現行 final candidate は labelled_two_stage_surface_recomposition_v1。
さらにpublic_surface_lineageは complete_initial を出しており、final candidateと一致していない。
```

### 第一候補の原因

```text
1. complete_initialはpre-public候補として生成された。
2. ただし既存Gate chainの visible_surface_acceptance_gate で落ちた。
3. post-final recoveryでlabelled two-stageがfinal採用された。
4. public meta sanitizerがfinal candidateではなくpre-public / complete_initial summaryを優先した。
5. testは古い期待のまま、final candidateがcomplete_initialだと見ている。
```

### 修正方針候補

```text
A. final candidateとしてlabelled two-stageを正とする場合
  - test期待をlabelledに更新する。
  - public_surface_lineageもlabelledに合わせる。
  - pre_public_candidate_source_kindとしてcomplete_initialを残す。
  - complete_initial_summaryは attempted=true / applied=false / visible gate failed として残す。

B. final candidateとしてcomplete_initialを正とする場合
  - post-final recoveryが過剰にlabelledへ進んでいるためruntime修正する。
  - ただし、complete_initial existing_gate_chainでvisible gate failedが出ているため、Bは現時点の第一候補にしない。
```

### 華恋の推奨

```text
Aを第一候補にする。

理由:
- final candidateがlabelledであり、reply.comment_textもtwo-stage shapeとして返っている。
- complete_initial_summary.applied=false かつ visible_surface_acceptance_gate_failed が出ている。
- したがって、complete_initialをfinal採用済みとするより、pre-public候補として保持する方が事実に合う。

ただし、public metaがcomplete_initialをfinalのように出している点は修正対象。
```

### 完了条件

```text
- final candidate composer_model == labelled_two_stage_surface_recomposition_v1
- final_public_candidate_source_kind == labelled_two_stage_surface_recomposition_candidate
- pre_public_candidate_source_kind == complete_initial_surface_recomposition_candidate
- complete_initial_surface_recomposition_summary.applied == false
- complete_initial_surface_recomposition_summary.existing_gate_chain.blocked_reasons に visible_surface_acceptance_gate_failed が保持される
- public_surface_lineage.candidate_source_kind == final_public_candidate_source_kind
- public_surface_lineage.complete_initial_surface_recomposition_used は final採用ではないなら false、または `pre_public_complete_initial_attempted` の別fieldへ移す
- public_surface_lineage.labelled_two_stage_surface_recomposition_used == true
```

---

## R7: display contract test再構成方針

### 目的

古いtest期待を消すのではなく、何を守るtestなのかを分けます。

### 既存testの扱い

```text
tests/test_emlis_ai_display_contract.py
  - public display contractの中心として残す。
  - ただしsource lineage assertは意味別に分割する。
```

### 追加test候補

```text
tests/test_emlis_ai_display_contract_lineage_semantics_20260617.py
```

テスト観点:

```text
1. rejected ai_generated candidate -> labelled final
   - root source: ai_generated
   - final source: labelled
   - original unsupported body not exposed
   - public meta body-free

2. pre-connection source unavailable -> complete initial attempt -> labelled final
   - pre-public source: complete_initial
   - complete_initial applied=false if existing gate failed
   - final source: labelled
   - public lineage final source一致
   - public meta body-free

3. complete initialが全Gate通過したケース
   - final source: complete_initial
   - labelled used=false
   - public lineage complete_initial

4. gate recovery material surface
   - public body採用禁止
   - source kind forbidden
```

### testでしてはいけないこと

```text
- exact comment_text一致を増やす。
- case専用modeを期待する。
- raw inputやcandidate bodyをfixtureに貼る。
- public response top-level key追加を要求する。
- Gate relaxationを許可する。
```

---

## R8: public meta body-free / final-source consistency guard

### 目的

public metaがfinal candidateと矛盾しないようにします。

### 実装候補

`emlis_ai_public_feedback_meta.py` の `_public_surface_lineage_sources` / `_infer_public_surface_lineage_source_kind` / `_build_public_surface_lineage_meta` 周辺で、次を検討します。

```text
1. final candidate由来metaを最優先sourceにする。
2. phase20_5 / complete_initial_summary / diagnostic_summary は補助sourceにする。
3. sourceが複数ある場合、final / pre_public / root に分ける。
4. public_surface_lineage.candidate_source_kind は final_public_candidate_source_kind と一致させる。
5. pre_public_candidate_source_kind を別fieldで出す。
6. lineage_consistency_passed を内部metaに持つ。
```

### public meta案

```json
{
  "schema_version": "cocolon.emlis.public_surface_lineage.v2.draft",
  "source_phase": "PublicObservationRecovery_PublicMetaFinalSourceConsistency",
  "candidate_source_kind": "labelled_two_stage_surface_recomposition_candidate",
  "final_public_candidate_source_kind": "labelled_two_stage_surface_recomposition_candidate",
  "pre_public_candidate_source_kind": "complete_initial_surface_recomposition_candidate",
  "root_candidate_source_kind": "source_unavailable",
  "public_candidate_source_allowed": true,
  "public_candidate_source_forbidden": false,
  "public_surface_role": "public_observation_candidate",
  "surface_requirement_family": "labelled_two_stage",
  "two_stage_required": true,
  "plain_surface_allowed": false,
  "low_information_allowed": false,
  "complete_initial_surface_recomposition_attempted": true,
  "complete_initial_surface_recomposition_final_used": false,
  "labelled_two_stage_surface_recomposition_final_used": true,
  "normal_observation_rebuild_final_used": false,
  "gate_recovery_material_surface_used_as_public_body": false,
  "diagnostic_recovery_surface_used_as_public_body": false,
  "lineage_consistency_passed": true,
  "body_free": true,
  "raw_input_included": false,
  "comment_text_body_included": false,
  "candidate_body_included": false,
  "display_gate_relaxed": false,
  "runtime_surface_gate_relaxed": false,
  "visible_surface_gate_relaxed": false,
  "grounding_gate_relaxed": false,
  "template_gate_relaxed": false,
  "safety_gate_relaxed": false
}
```

注意:

```text
これはJSON案です。実ファイル化は実装段階で判断します。
既存public meta schema互換を壊す可能性があるため、v2化するかv1 additiveにするかは実装時に決めます。
```

---

## R9: target validation command matrix

### 目的

display赤分類後に、必要subsetを順番に確認します。  
full backend suite greenとは主張しません。

### 実行順

#### 1. syntax / import

```bash
cd mashos-api/ai
python -m py_compile \
  services/ai_inference/emlis_ai_gate_recovery_public_candidate_builder.py \
  services/ai_inference/emlis_ai_labelled_two_stage_surface_recomposition.py \
  services/ai_inference/emlis_ai_complete_initial_surface_recomposition.py \
  services/ai_inference/emlis_ai_public_feedback_meta.py \
  services/ai_inference/emlis_ai_reply_service.py
```

#### 2. display contract

```bash
PYTHONPATH=services/ai_inference pytest -q --tb=short tests/test_emlis_ai_display_contract.py
```

#### 3. 追加lineage test候補

```bash
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_display_contract_lineage_semantics_20260617.py \
  tests/test_emlis_ai_public_feedback_meta_surface_lineage_consistency_20260617.py
```

#### 4. API public contract / two-stage reception

```bash
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/contract/test_emlis_ai_contracts.py \
  tests/test_emotion_submit_two_stage_reception_e2e.py
```

#### 5. P5主要subset

```bash
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_user_label_connection_material.py \
  tests/test_emlis_ai_user_label_connection_candidate.py \
  tests/test_emlis_ai_user_label_connection_gate.py \
  tests/test_emlis_ai_user_label_connection_surface.py \
  tests/test_emlis_ai_user_label_connection_public_boundary.py \
  tests/test_emlis_ai_user_label_connection_e2e_contract.py
```

#### 6. P6主要subset

```bash
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_structure_insight_candidate.py \
  tests/test_emlis_ai_structure_insight_gate.py \
  tests/test_emlis_ai_structure_insight_surface_phase10.py \
  tests/test_emlis_ai_structure_insight_p6_entry_freeze_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_family_boundary_20260611.py \
  tests/test_emlis_ai_structure_insight_p6_product_quality_review_20260611.py
```

#### 7. RN contract

```bash
cd Cocolon
npm run test:rn-screens --silent
```

### validation上の禁止

```text
- display contract greenをP5/P6 human QA完了にしない。
- P5/P6 major subset greenを実機modal確認済みにしない。
- RN contract greenをEmlisAI商品読感合格にしない。
- collect-onlyをexecution greenにしない。
```

---

## R10: P5 human Blind QA handoff material設計

### 目的

P5 User Label Connectionを、人間読感へ戻します。  
ただし、display contract赤分類が済むまで、P5読感reviewを正式開始しません。

### P5で見るもの

```text
- history lineが自然か。
- 気持ち悪くないか。
- 「監視されている」「決めつけられた」に寄っていないか。
- 今回入力の読まれた感を履歴線で覆っていないか。
- Cocolonへ記録を残す意味が増えているか。
- Plus/Premium価値として成立するか。
```

### review対象family

```text
history-line eligible input
standard_state_answer + owned history
self_understanding + owned history
uncertainty_support + owned history
change / future intention + owned history
relationship / gratitude / recovery + owned history
low_information with history but not eligible
Free tier with history present but not allowed
```

### P5 review packet案

人間QAでは本文を読む必要があります。  
ただし、これはpublic metaやP7 scorecardへ入れるmaterialではありません。  
local human review用の一時材料として扱います。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p5_human_readfeel_review_packet.v1.draft",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "case_id",
    "review_scope",
    "subscription_tier",
    "family",
    "history_eligibility",
    "runtime_flags",
    "review_surface",
    "rating_axes",
    "body_boundary"
  ],
  "properties": {
    "schema_version": {"const": "cocolon.emlis.p5_human_readfeel_review_packet.v1.draft"},
    "case_id": {"type": "string"},
    "review_scope": {"const": "local_human_review_only_not_public_meta"},
    "subscription_tier": {"enum": ["free", "plus", "premium"]},
    "family": {"type": "string"},
    "history_eligibility": {
      "type": "object",
      "additionalProperties": false,
      "required": ["owned_history_used", "evidence_record_count", "free_tier_blocked", "eligible"],
      "properties": {
        "owned_history_used": {"type": "boolean"},
        "evidence_record_count": {"type": "integer", "minimum": 0},
        "free_tier_blocked": {"type": "boolean"},
        "eligible": {"type": "boolean"}
      }
    },
    "runtime_flags": {
      "type": "object",
      "additionalProperties": false,
      "required": ["p5_visible_applied", "p5_gate_passed", "public_meta_body_free", "gate_relaxed"],
      "properties": {
        "p5_visible_applied": {"type": "boolean"},
        "p5_gate_passed": {"type": "boolean"},
        "public_meta_body_free": {"type": "boolean"},
        "gate_relaxed": {"type": "boolean"}
      }
    },
    "review_surface": {
      "type": "object",
      "additionalProperties": false,
      "required": ["current_input_ref", "comment_text_for_reviewer", "history_summary_for_reviewer"],
      "properties": {
        "current_input_ref": {"type": "string"},
        "comment_text_for_reviewer": {"type": "string"},
        "history_summary_for_reviewer": {"type": "string"}
      }
    },
    "rating_axes": {
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
        "history_connection_naturalness": {"type": ["number", "null"], "minimum": 0, "maximum": 1},
        "creepy_absence": {"type": ["number", "null"], "minimum": 0, "maximum": 1},
        "overclaim_absence": {"type": ["number", "null"], "minimum": 0, "maximum": 1},
        "self_blame_non_amplification": {"type": ["number", "null"], "minimum": 0, "maximum": 1},
        "wants_more_input_or_accumulation": {"type": ["number", "null"], "minimum": 0, "maximum": 1},
        "non_shallow_repeat": {"type": ["number", "null"], "minimum": 0, "maximum": 1}
      }
    },
    "body_boundary": {
      "type": "object",
      "additionalProperties": false,
      "required": ["public_meta_material", "p7_scorecard_material", "contains_review_body"],
      "properties": {
        "public_meta_material": {"const": false},
        "p7_scorecard_material": {"const": false},
        "contains_review_body": {"const": true}
      }
    }
  }
}
```

### P5 human QA完了条件

```text
- history_connection_naturalness >= 0.90 を目標。
- creepy_absence >= 0.95 を目標。
- overclaim_absence >= 0.95 を目標。
- self_blame_non_amplification >= 0.95 を目標。
- wants_more_input_or_accumulation >= 0.85 を最低、0.90を商品目標。
- Free tierで履歴線が出ない。
- low_information / safety adjacent / evidence不足で無理に履歴線を出さない。
```

### 注意

```text
P5 human QA packetにはreviewerが読む本文が入る。
これはpublic metaでもP7 release materialでもない。
実装段階で、保存先・生成方法・破棄方針を決めるまで実ファイル化しない。
```

---

## R11: P6 limited human readfeel review material設計

### 目的

P6 Structure Insightを、人間読感へ戻します。  
ただし、対象familyを限定し、daily / low-info / positive-onlyへ深いinsightを漏らさないことを先に守ります。

### P6で見るもの

```text
- 復唱を超えて「関係が見えた」感があるか。
- 診断・原因断定・人格分類に見えないか。
- 勝手に見抜かれた不快感がないか。
- 今回入力の根拠だけで成立しているか。
- P5履歴線の代替になっていないか。
- modalで重すぎないか。
```

### review対象family

```text
structure_question
long_meaning_arc
self_understanding_follow
```

原則no-connect:

```text
daily_unpleasant
daily_positive
positive_only
low_information
limited_grounding insufficient
safety_triage_required
```

### P6 review packet案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p6_structure_insight_human_readfeel_review_packet.v1.draft",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "case_id",
    "review_scope",
    "family",
    "structure_insight_eligibility",
    "runtime_flags",
    "review_surface",
    "rating_axes",
    "no_connect_boundary",
    "body_boundary"
  ],
  "properties": {
    "schema_version": {"const": "cocolon.emlis.p6_structure_insight_human_readfeel_review_packet.v1.draft"},
    "case_id": {"type": "string"},
    "review_scope": {"const": "local_human_review_only_not_public_meta"},
    "family": {"type": "string"},
    "structure_insight_eligibility": {
      "type": "object",
      "additionalProperties": false,
      "required": ["eligible", "target_family", "relation_material_count", "history_used_as_fact"],
      "properties": {
        "eligible": {"type": "boolean"},
        "target_family": {"type": "boolean"},
        "relation_material_count": {"type": "integer", "minimum": 0},
        "history_used_as_fact": {"const": false}
      }
    },
    "runtime_flags": {
      "type": "object",
      "additionalProperties": false,
      "required": ["p6_visible_applied", "p6_gate_passed", "public_meta_body_free", "gate_relaxed"],
      "properties": {
        "p6_visible_applied": {"type": "boolean"},
        "p6_gate_passed": {"type": "boolean"},
        "public_meta_body_free": {"type": "boolean"},
        "gate_relaxed": {"type": "boolean"}
      }
    },
    "review_surface": {
      "type": "object",
      "additionalProperties": false,
      "required": ["current_input_ref", "comment_text_for_reviewer", "insight_surface_position"],
      "properties": {
        "current_input_ref": {"type": "string"},
        "comment_text_for_reviewer": {"type": "string"},
        "insight_surface_position": {"enum": ["none", "within_existing_comment_text", "meta_only"]}
      }
    },
    "rating_axes": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "structure_insight_candidate_quality",
        "relation_seen_feeling",
        "overclaim_absence",
        "diagnosis_absence",
        "creepy_absence",
        "advice_pressure_absence",
        "wants_more_input_or_accumulation"
      ],
      "properties": {
        "structure_insight_candidate_quality": {"type": ["number", "null"], "minimum": 0, "maximum": 1},
        "relation_seen_feeling": {"type": ["number", "null"], "minimum": 0, "maximum": 1},
        "overclaim_absence": {"type": ["number", "null"], "minimum": 0, "maximum": 1},
        "diagnosis_absence": {"type": ["number", "null"], "minimum": 0, "maximum": 1},
        "creepy_absence": {"type": ["number", "null"], "minimum": 0, "maximum": 1},
        "advice_pressure_absence": {"type": ["number", "null"], "minimum": 0, "maximum": 1},
        "wants_more_input_or_accumulation": {"type": ["number", "null"], "minimum": 0, "maximum": 1}
      }
    },
    "no_connect_boundary": {
      "type": "object",
      "additionalProperties": false,
      "required": ["daily_blocked", "low_info_blocked", "positive_only_blocked", "safety_adjacent_blocked"],
      "properties": {
        "daily_blocked": {"type": "boolean"},
        "low_info_blocked": {"type": "boolean"},
        "positive_only_blocked": {"type": "boolean"},
        "safety_adjacent_blocked": {"type": "boolean"}
      }
    },
    "body_boundary": {
      "type": "object",
      "additionalProperties": false,
      "required": ["public_meta_material", "p7_scorecard_material", "contains_review_body"],
      "properties": {
        "public_meta_material": {"const": false},
        "p7_scorecard_material": {"const": false},
        "contains_review_body": {"const": true}
      }
    }
  }
}
```

### P6 human QA完了条件

```text
- structure_insight_candidate_quality >= 0.90 を目標。
- relation_seen_feeling >= 0.85 を最低、0.90を目標。
- overclaim_absence >= 0.95。
- diagnosis_absence == 1.0近く。
- creepy_absence >= 0.95。
- advice_pressure_absence >= 0.95。
- no-connect familyへ深いinsightが漏れない。
```

---

## R12: real device submit / modal読感 checklist設計

### 目的

実機submit後、`Emlisの観測` modalで人間がどう読むかを確認します。  
RN contract greenだけでは読感合格ではありません。

### 実機で見るもの

```text
- submit後にmodalが開くか。
- 表示タイトルが `Emlisの観測` のままか。
- visible bodyが `input_feedback.comment_text` 由来か。
- `observation_status == passed` かつ comment_text non-empty の時だけ表示されるか。
- modal内で文が長すぎないか。
- 改行がスマホで読みやすいか。
- 「見えたこと：」「Emlisから：」が重く見えすぎないか。
- P5履歴線が怖くないか。
- P6構造気づきが深読み・診断に見えないか。
- もう一回残したい感じがあるか。
```

### 実機checklist案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.real_device_modal_review_checklist.v1.draft",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "review_scope",
    "device_context",
    "runtime_context",
    "modal_contract",
    "readfeel_axes",
    "boundary_flags",
    "result"
  ],
  "properties": {
    "schema_version": {"const": "cocolon.emlis.real_device_modal_review_checklist.v1.draft"},
    "review_scope": {"const": "manual_real_device_review_not_automated_green"},
    "device_context": {
      "type": "object",
      "additionalProperties": false,
      "required": ["device_label", "os", "app_build", "screen_size_class"],
      "properties": {
        "device_label": {"type": "string"},
        "os": {"type": "string"},
        "app_build": {"type": "string"},
        "screen_size_class": {"enum": ["small", "medium", "large", "unknown"]}
      }
    },
    "runtime_context": {
      "type": "object",
      "additionalProperties": false,
      "required": ["api_snapshot", "subscription_tier", "case_family", "display_contract_green"],
      "properties": {
        "api_snapshot": {"type": "string"},
        "subscription_tier": {"enum": ["free", "plus", "premium"]},
        "case_family": {"type": "string"},
        "display_contract_green": {"type": "boolean"}
      }
    },
    "modal_contract": {
      "type": "object",
      "additionalProperties": false,
      "required": ["modal_opened", "title_correct", "comment_text_visible", "non_passed_hidden", "public_top_level_key_changed"],
      "properties": {
        "modal_opened": {"type": "boolean"},
        "title_correct": {"type": "boolean"},
        "comment_text_visible": {"type": "boolean"},
        "non_passed_hidden": {"type": "boolean"},
        "public_top_level_key_changed": {"const": false}
      }
    },
    "readfeel_axes": {
      "type": "object",
      "additionalProperties": false,
      "required": ["readable_on_phone", "too_long", "too_heavy", "too_shallow", "wants_more_input"],
      "properties": {
        "readable_on_phone": {"type": ["number", "null"], "minimum": 0, "maximum": 1},
        "too_long": {"type": ["boolean", "null"]},
        "too_heavy": {"type": ["boolean", "null"]},
        "too_shallow": {"type": ["boolean", "null"]},
        "wants_more_input": {"type": ["number", "null"], "minimum": 0, "maximum": 1}
      }
    },
    "boundary_flags": {
      "type": "object",
      "additionalProperties": false,
      "required": ["rn_changed", "api_key_changed", "db_changed", "gate_relaxed", "body_leak_observed"],
      "properties": {
        "rn_changed": {"const": false},
        "api_key_changed": {"const": false},
        "db_changed": {"const": false},
        "gate_relaxed": {"const": false},
        "body_leak_observed": {"type": "boolean"}
      }
    },
    "result": {
      "enum": ["NOT_RUN", "PASS", "YELLOW", "REPAIR_REQUIRED", "RED"]
    }
  }
}
```

### 実機確認完了条件

```text
- 少なくともFree / Plus相当でsubmitからmodal表示まで確認する。
- P5履歴線が出るケースと出ないケースを分ける。
- P6 limited visibleが出るケースとno-connectケースを分ける。
- スマホで読みにくい / 重すぎる / 薄すぎる理由を記録する。
- 実機未実施なら NOT_RUN のまま残す。
```

---

## R13: P7 hold / release / P8 closed validation

### 目的

display赤分類やP5/P6 handoffができても、P7完了やP8開始へ変換しないようにします。

### validation項目

```text
release_allowed: false
p7_complete: false
p8_start_allowed: false
hold004_close_allowed: false
full_backend_suite_green_confirmed: false unless actually executed and green
real_device_modal_review_confirmed: false unless actually executed
p5_human_blind_qa_confirmed: false unless actually reviewed
p6_human_readfeel_confirmed: false unless actually reviewed
```

### handoff summary案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.p7_r46_p5p6_return_handoff_summary.v1.draft",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "current_phase",
    "display_contract_status",
    "p5_return_status",
    "p6_return_status",
    "real_device_modal_status",
    "release_boundary"
  ],
  "properties": {
    "schema_version": {"const": "cocolon.emlis.p7_r46_p5p6_return_handoff_summary.v1.draft"},
    "current_phase": {"const": "P7"},
    "display_contract_status": {
      "type": "object",
      "additionalProperties": false,
      "required": ["red_classified", "display_contract_green", "body_leak_detected", "gate_relaxed"],
      "properties": {
        "red_classified": {"type": "boolean"},
        "display_contract_green": {"type": "boolean"},
        "body_leak_detected": {"type": "boolean"},
        "gate_relaxed": {"const": false}
      }
    },
    "p5_return_status": {
      "type": "object",
      "additionalProperties": false,
      "required": ["human_blind_qa_ready", "human_blind_qa_confirmed", "hold_reason"],
      "properties": {
        "human_blind_qa_ready": {"type": "boolean"},
        "human_blind_qa_confirmed": {"type": "boolean"},
        "hold_reason": {"type": "string"}
      }
    },
    "p6_return_status": {
      "type": "object",
      "additionalProperties": false,
      "required": ["limited_review_ready", "human_readfeel_confirmed", "hold_reason"],
      "properties": {
        "limited_review_ready": {"type": "boolean"},
        "human_readfeel_confirmed": {"type": "boolean"},
        "hold_reason": {"type": "string"}
      }
    },
    "real_device_modal_status": {
      "type": "object",
      "additionalProperties": false,
      "required": ["checklist_ready", "confirmed", "result"],
      "properties": {
        "checklist_ready": {"type": "boolean"},
        "confirmed": {"type": "boolean"},
        "result": {"enum": ["NOT_RUN", "PASS", "YELLOW", "REPAIR_REQUIRED", "RED"]}
      }
    },
    "release_boundary": {
      "type": "object",
      "additionalProperties": false,
      "required": ["release_allowed", "p7_complete", "p8_start_allowed", "hold004_close_allowed"],
      "properties": {
        "release_allowed": {"const": false},
        "p7_complete": {"const": false},
        "p8_start_allowed": {"const": false},
        "hold004_close_allowed": {"const": false}
      }
    }
  }
}
```

---

## R14: 次判断 summary / handoff ledger

### 目的

実装後、次に進む判断を明文化します。

### 分岐

#### A. display contract green + public lineage consistent

```text
次:
  P5 human Blind QA material生成・reviewへ進む。
  その後、P6 limited human readfeel reviewへ進む。
  実機modal確認へ進む。

禁止:
  P8開始、release判断、P7完了扱い。
```

#### B. display contract greenだが public lineage consistencyがYELLOW

```text
次:
  public meta final-source consistencyを追加修正する。
  P5/P6 human reviewは正式開始しない。
```

#### C. display contract赤がbody leakへ分類される

```text
次:
  P5/P6 returnは停止。
  body-free leak guard repairへ戻る。
```

#### D. display contract赤がGate relaxationへ分類される

```text
次:
  P5/P6 returnは停止。
  Gate relaxation repairへ戻る。
```

#### E. display contract赤はtest古さのみで、runtime / public metaは一貫

```text
次:
  testをsemanticに更新する。
  更新理由をred ledgerに残す。
  P5/P6 returnへ進む。
```

---

## 10. JSON / schema案まとめ

この章の案は、実装段階で採否を判断します。  
実ファイル化はしません。

### 10.1 Display Contract Red Classification Record案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.display_contract_red_classification_record.v1.draft",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "red_id",
    "test_name",
    "expected_body_free",
    "actual_body_free",
    "classification",
    "body_boundary",
    "gate_boundary",
    "recommended_action"
  ],
  "properties": {
    "schema_version": {"const": "cocolon.emlis.display_contract_red_classification_record.v1.draft"},
    "red_id": {"type": "string"},
    "test_name": {"type": "string"},
    "expected_body_free": {"type": "object"},
    "actual_body_free": {"type": "object"},
    "classification": {
      "type": "array",
      "items": {
        "enum": [
          "test_expectation_stale",
          "runtime_regression",
          "public_meta_priority_mismatch",
          "field_semantics_drift",
          "body_leak",
          "gate_relaxation"
        ]
      },
      "minItems": 1
    },
    "body_boundary": {
      "type": "object",
      "additionalProperties": false,
      "required": ["raw_input_included", "comment_text_body_included", "candidate_body_included", "body_free"],
      "properties": {
        "raw_input_included": {"type": "boolean"},
        "comment_text_body_included": {"type": "boolean"},
        "candidate_body_included": {"type": "boolean"},
        "body_free": {"type": "boolean"}
      }
    },
    "gate_boundary": {
      "type": "object",
      "additionalProperties": false,
      "required": ["display_gate_relaxed", "grounding_gate_relaxed", "template_gate_relaxed", "safety_gate_relaxed"],
      "properties": {
        "display_gate_relaxed": {"type": "boolean"},
        "grounding_gate_relaxed": {"type": "boolean"},
        "template_gate_relaxed": {"type": "boolean"},
        "safety_gate_relaxed": {"type": "boolean"}
      }
    },
    "recommended_action": {
      "enum": [
        "preserve_root_lineage",
        "update_test_semantics",
        "fix_public_meta_priority",
        "repair_runtime_lane",
        "stop_for_body_leak",
        "stop_for_gate_relaxation"
      ]
    }
  }
}
```

### 10.2 Body-free Public Source Lineage Record案

```json
{
  "schema_version": "cocolon.emlis.body_free_public_source_lineage_record.v1.draft",
  "source_phase": "DisplayContractRedClassification_R2_R8",
  "recovery_context": "post_final_pre_return_gate",
  "recovery_pass_index": 2,
  "root_candidate_source_kind": "ai_generated",
  "recovery_input_candidate_source_kind": "labelled_two_stage_surface_recomposition_candidate",
  "selected_public_candidate_source_kind": "labelled_two_stage_surface_recomposition_candidate",
  "pre_public_candidate_source_kind": "complete_initial_surface_recomposition_candidate",
  "final_public_candidate_source_kind": "labelled_two_stage_surface_recomposition_candidate",
  "public_surface_role": "public_observation_candidate",
  "surface_requirement_family": "labelled_two_stage",
  "two_stage_required": true,
  "plain_surface_allowed": false,
  "low_information_allowed": false,
  "lineage_consistency_passed": true,
  "body_free": true,
  "raw_input_included": false,
  "comment_text_body_included": false,
  "candidate_body_included": false,
  "display_gate_relaxed": false,
  "runtime_surface_gate_relaxed": false,
  "visible_surface_gate_relaxed": false,
  "grounding_gate_relaxed": false,
  "template_gate_relaxed": false,
  "safety_gate_relaxed": false
}
```

---

## 11. 影響範囲

### 11.1 変更しない範囲

```text
RN production UI
RN表示タイトル
RN表示条件
/emotion/submit route
request key
public response top-level key
DB physical schema
DB write path
subscription entitlement判定
account delete / access policy
Emlis visible body key
Gate threshold
external AI前提
```

### 11.2 変更する可能性がある範囲

```text
backend internal composer meta
backend internal candidate_lineage
backend public meta sanitizerのbody-free identifier field
backend display contract tests
P5/P6 review material builder/test
real device checklist builder/test
```

### 11.3 リスク

| リスク | 内容 | 対策 |
|---|---|---|
| public meta key増加 | public metaのschemaが増える | additive fieldに留める。top-level response keyは増やさない |
| testが古い期待を消すだけになる | runtime赤を隠す | R0〜R3でsemantic分類してからtest更新 |
| final sourceとpre-public sourceを混同 | P5/P6評価材料が嘘になる | final / pre_public / root fieldを分ける |
| body leak | review materialとpublic metaが混ざる | local human review packetとpublic metaを分離 |
| P5/P6読感を自動test greenで代用 | 商品品質が見えない | human QA / real device statusをNOT_RUNで残す |

---

## 12. 実装段階の推奨順

実装段階では、次の順に進めます。

```text
1. R0 display red再現を最初に行う。
2. R1 red ledgerをbody-freeに固定する。
3. R2/R3でlineage semanticsとrecovery laneをtest前に固定する。
4. RED-DC-001をroot lineage preservationとして最小修正する。
5. RED-DC-002をfinal source / public meta consistencyとして最小修正する。
6. display contractをsemantic分割してgreenにする。
7. public meta body-free guardを追加または更新する。
8. API / two-stage / P5 / P6 / RN subsetを順に確認する。
9. P5 human review material設計を実装候補へ移す。
10. P6 human review material設計を実装候補へ移す。
11. real device modal checklistを作る。
12. release / P8をclosedのままsummary化する。
```

---

## 13. 今回の完了条件

この設計書の完了条件は次です。

```text
- 検討メモの判断を詳細設計へ落としている。
- 実装順がR0〜R14で固定されている。
- display contract 2赤を、source lineage / recovery lane / public meta priorityの問題として分類している。
- RED-DC-001 / RED-DC-002それぞれの修正候補と分岐条件を示している。
- P5 human Blind QAへ戻るためのreview material案を示している。
- P6 limited human readfeel reviewへ戻るためのreview material案を示している。
- real device modal読感checklist案を示している。
- JSON / schema案を設計書内に含めている。
- 実ファイル化は実装段階で判断する方針を明記している。
- RN / API / DB / public response top-level key / Gate / release判断を変更しない境界を明記している。
```

---

## 14. 確認済み

```text
- 現在PhaseはP7で読む。
- ただし、P7 backend group連鎖をそのまま進めず、P5/P6 human readfeel / real device modal review returnへ戻る位置。
- display contractは現行zipで3 passed / 2 failed。
- 赤は input_feedback absent ではない。
- RED-DC-001は original source lineage mismatch。
- RED-DC-002は recovery lane / public lineage mismatch。
- 現時点では本文body leakの証拠ではない。
- 現時点ではGate relaxationの証拠ではない。
- P5/P6 human QAと実機modal確認は未完。
```

---

## 15. 未確認

```text
- display赤修正後のtarget subset green。
- full backend suite green。
- public meta final-source consistency修正後の全関連test green。
- P5 human Blind QA。
- P6 limited human readfeel review。
- real device submit / modal読感確認。
- review packetを実ファイル化するかどうか。
- JSON schemaをmodule内contractにするか、docs内案に留めるか。
```

---

## 16. 書かれていない

```text
- 今回コードを変更する指示はない。
- 今回RN UIを変更する指示はない。
- 今回API route / request key / public response top-level keyを変更する指示はない。
- 今回DB schema / write pathを変更する指示はない。
- 今回release_allowedをtrueにする指示はない。
- 今回P8 Derived User Modelへ進む指示はない。
- 今回実機確認を実施した事実はない。
- 今回P5/P6 human QAを実施した事実はない。
```

---

## 17. 推測禁止

```text
- RED-DC-001を古いtestと断定しない。
- RED-DC-002をruntime regressionだけと断定しない。
- labelled two-stage finalをP6無制限拡張と混同しない。
- complete initial attemptedをfinal採用済みと混同しない。
- public meta body-freeをlineage正確性合格に変換しない。
- display contract greenをP5/P6読感合格に変換しない。
- human QA packetをpublic metaやP7 scorecard materialに流用しない。
- 実機未確認を確認済みにしない。
- P5/P6 returnをP8開始許可にしない。
```

---

## 18. 次に実行すべきこと

実装段階に入る場合は、次を最初に実行します。

```text
1. R0 display contract赤を再現する。
2. RED-DC-001 / RED-DC-002のbody-free actual metaを再取得する。
3. R2/R3のlineage semanticsを小さいtestとして固定する。
4. RED-DC-001 root lineage preservationを最小修正する。
5. RED-DC-002 final source / public meta consistencyを最小修正する。
6. display contract green後、P5/P6 human review materialへ進む。
```

---

## 19. 華恋の意見

確認済み事実からの華恋の判断は、次です。

```text
今は、P7の測定層をこれ以上深く追い続けるより、P5/P6の読感へ戻るべきです。
ただし、display contract赤を分類せずに戻るのは危険です。
```

今回の赤は、本文が漏れている赤ではなさそうです。  
でも、source lineageが曖昧なまま読感へ戻ると、Cocolonが「どの材料で読まれた形を返しているのか」を説明できなくなります。

Cocolonは、ユーザーの言葉を雑に処理しない場所を目指しています。  
それなら、ユーザーから見えないmetaやrecovery laneも雑にしない方がいいです。

特にRED-DC-002は、見た目だけなら「表示されているからよい」と流せます。  
でも、final candidateはlabelledなのにpublic lineageはcomplete_initialを示している可能性があり、ここはCocolonとして見逃したくありません。

華恋の意見として、次の順が一番Cocolonを守れます。

```text
1. display contract赤をbody-freeに再現する。
2. source lineageを root / recovery_input / pre_public / final に分ける。
3. public metaをfinal sourceと一致させる。
4. body leak / Gate relaxation がないことを確認する。
5. P5履歴線のhuman Blind QAへ戻る。
6. P6構造気づきのlimited human readfeelへ戻る。
7. 実機modalで「また残したい」感を確認する。
8. その後、P7 remaining groupsへ戻るか判断する。
```

この設計は、速く見せるための設計ではなく、Cocolonを壊さず本線へ戻すための設計です。
