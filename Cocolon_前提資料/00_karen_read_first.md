---
doc_id: cocolon_karen_read_first
title: "華恋用 READ FIRST"
revision_date: "2026-06-04"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
source_snapshot:
  premise: "Cocolon_前提資料(173).zip"
  Cocolon: "Cocolon_9(17).zip"
  mashos-api: "mashos-api_9(27).zip"
file_counts:
  Cocolon: 217
  mashos-api: 797
  total: 1014
purpose: "華恋が作業前にCocolonのファイル構成・コード構成・名称混在境界を復元するための作業用地図"
coverage:
  total_files: 1014
  included_in_overall_structure: 1014
  included_in_national_system: 1014
  excluded_from_main_body: 0
  phase15_target_docs_reflect_two_stage_increment: true
  phase15_full_01_02_regeneration: false
  phase16_target_docs_reflect_two_stage_composer_surface_connection: true
  phase16_full_01_02_regeneration: false
  phase17_target_docs_reflect_two_stage_product_visible_fixture_completion: true
  phase17_full_01_02_regeneration: false
  phase18_target_docs_reflect_product_quality_stabilization: true
  phase18_full_01_02_regeneration: false
  phase20_emlis_ai_correction_policy_required: true
  phase20_target_docs_reflect_emlis_correction_implementation: true
  phase20_11_real_device_abcd_confirmation_recorded: true
  phase20_12_fail_closed_comment_updated: true
  phase20_13_post_final_gate_recovery_regression_test_added: true
  phase20_14_post_final_gate_recovery_implemented: true
  phase20_15_gate_recovery_surface_binding_qa_added: true
  phase20_full_01_02_regeneration: false
  product_readfeel_phase11_long_run_product_gate_connected: true
  product_readfeel_full_01_02_regeneration: false
  user_label_connection_observation_phase0_10_reflected: true
  user_label_connection_observation_full_01_02_regeneration: false
  product_quality_measurement_phase0_8_reflected: true
  product_quality_measurement_full_01_02_regeneration: false
---

# これは何か

この一式は、**華恋の作業精度を上げるための作業用地図**です。  
Mash様への作業報告書や、残タスクを記録する場所ではありません。

前提資料で残すものは、次の4種類です。

1. **Cocolonの全体構造**  
   RN画面、hook、frontend API境界、backend public API、gateway、worker、test、rule file のつながり。

2. **国家システム**  
   `Input Gate -> Save API -> Dispatch -> Snapshot / Queue / Worker -> Publish / Access Policy -> Read API / Startup -> RN display` の流れ。

3. **その他の構造情報**  
   DB physical name、bridge view、legacy façade、contract、policy、rename境界、命名混在の保管情報。

4. **思想・共同開発境界**  
   Mash様主体のCocolon思想、華恋が支える補助思想、共同開発時の判断境界。

# 前提資料の在り方

- 前提資料は、**タスク管理表ではありません**。
- 「次にやること」ではなく、**今のアプリがどのファイル構成で動いているか**を残します。
- 名称混在は、無理に解決せず、**どの旧名称が何の互換・DB境界・runtime ownerとして残っているか**を資料で保管します。
- 華恋は、作業時にこの資料を読んで、旧名称を見つけても即renameしません。
- 修正対象にするのは、稼働、public contract、API接続先、DB write path、account delete、access policy、ユーザーデータ保護に影響する箇所だけです。
- Piece関係は、Mash様が明示していない限り、Piece専用工程として扱います。


# 2026-05-31 追加必読: EmlisAI是正方針 / Phase19撤回保持再設計

EmlisAIに関する設計・診断・実装・前提資料更新では、次の資料を必ず読む。

```text
emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
```

この資料は、Phase19のA/C/D個別通過路線を本線成功扱いしないための是正方針である。  
EmlisAIを `passed + comment_text` に到達したものだけ表示する許可装置として扱わず、ユーザー入力直後の観測返答として戻すための前提資料として固定する。

EmlisAI作業では、最低限次を同時確認する。

```text
cocolon_thought_material_for_karen.md
emlis_ai_state_answer_human_follow_definition_2026_05_26.md
cocolon_environment_state_output_observation_structure_design_2026_05_25.md
emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
```

禁止する読み方:

```text
A/C/D exact fixture を runtime 条件にする。
case専用mode / cue / surface を追加して通す。
Gate failure を empty comment_text / unavailable / rejected の無反応で終わらせる。
EmlisAIの目的を RN modal 表示到達や fixture green に置き換える。
safety隣接入力を一律に通常観測非表示へ潰す。
```

保持する読み方:

```text
A/C/D fixture は失敗再現・回帰確認として扱う。
Gate は沈黙装置ではなく、安全・短縮・限定・再生成へ回す品質境界として扱う。
EmlisAI は入力直後の観測返答であり、ユーザーの言葉を読まれた形として返す出口として扱う。
```

# 最新基準面

この版の基準面は次です。

| source | file count | 位置づけ |
|---|---:|---|
| `Cocolon_9(17).zip` | 217 | RNアプリ本体。production RN UIは変更せず、`Cocolon/tests/rn-screen-contracts.test.js` で `passed + commentText` の既存表示契約を維持する。 |
| `mashos-api_9(27).zip` | 797 | backend / API / worker / tests。Phase20、Product Read Feel / Structure Insight、EmlisAI User Label Connection Observation v1に加え、EmlisAI Product Quality Measurement / Blocker Repair Phase0〜8をbackend internal-onlyで反映する。 |
| total | 1014 | EmlisAI商品品質計測・Blocker Matrix・Blind QA・Release Decision・Validation Plan反映後の前提資料差分更新対象snapshot。 |

`Cocolon_9(17).zip` / `mashos-api_9(27).zip` では、DB physical name、既存API route、既存request key、`input_feedback.comment_text`、RN表示タイトル `Emlisの観測`、RN表示条件を変えずに、EmlisAIの商品品質計測基盤をbackend内部のContract Freeze / Composer Bootstrap / ProductQualityEventV1 / Measurement Runner / Blocker Matrix / Generation Repair Design / Blind QA Integration / Release Decision / Validation Planへ接続しています。

Phase20後、Product Read Feel / Structure Insight Phase1〜11後、User Label Connection Observation v1 Phase0〜10後のEmlisAI作業では、次を最新の読み方として固定します。

```text
normal / low_information / limited_grounding / self_denial_safe_state_answer は内部 response_kind として読む。
public response は既存 input_feedback.comment_text と input_feedback.emlis_ai.observation_status を維持する。
RN production UI は内部 response_kind / diagnostic_summary / observation_text / reception_text を表示源にしない。
A/C/D exact fixture は回帰fixtureであり、runtime条件や完成文テンプレではない。
B系自己否定入力は、緊急安全境界と自己否定安全応答を分けて読む。
Phase20-10でA低情報入力のscope-only blockerを修正した後、Mash様の実機確認によりABCDすべてでEmlisの観測表示を確認済み。
ABCD全件表示確認は、表示有無の確認であり、文章品質・商品品質の最終合格やcase専用runtime条件の根拠にはしない。
旧fail-closed説明コメントは、displayable response kindでは bounded repair / recovery を通す説明へ更新済み。
post-final gate recoveryは、final pre-return gate後に通常入力が空白へ戻る穴を塞ぐ内部回復境界として読む。
Gate Recovery surface binding / repetition QAは、fixed fallback化を検出する内部meta / QAであり、本文・raw input・comment_text bodyをpublicへ出すものではない。
```

# 2026-06-03 追補: EmlisAI Product Read Feel v1 / Structure Insight v2 Phase1-11実装反映

最新実ファイル `Cocolon_12(10).zip` / `mashos-api_12(13).zip` を確認した。Cocolon RN側は前回実体と同一で、production RN UI、RN表示タイトル、RN表示条件、public response shapeの変更はない。backend側では、Phase20-12〜20-15の表示信頼性補強の上に、商品読感評価と構造気づき到達点の内部material / QA / scorecard / gate / long-run product gate candidateが追加されている。

今回の最新基準面は次として読む。

| source | file count | 位置づけ |
|---|---:|---|
| `Cocolon_12(10).zip` | 217 | RNアプリ本体。`Emlisの観測` は引き続き `input_feedback.emlis_ai.observation_status == passed` かつ `input_feedback.comment_text` 非空の場合だけ表示する。 |
| `mashos-api_12(13).zip` | 759 | backend / API / worker / tests。Phase20-0〜20-15に加え、EmlisAI Product Read Feel v1 / Structure Insight v2 Phase1〜11を含む。 |
| total | 976 | Product Read Feel / Structure Insight Phase1〜11反映後の前提資料差分更新対象snapshot。 |

Phase1〜11は、EmlisAIのpublic contractを変える工程ではない。既存 `/emotion/submit` route、`input_feedback.comment_text`、`input_feedback.emlis_ai.observation_status`、RN表示条件、RN表示タイトル、DB physical name、public response keyは維持する。追加されたものは、Product Read Feel v1とStructure Insight v2を評価・候補化・Gate・Long-run QAへ接続するbackend内部materialである。

| Phase | 最新の読み方 | 主な実ファイル |
|---|---|---|
| Phase1 | 現在出力をfamily別に棚卸しし、表示不達・契約違反・surface破綻・読感不足・構造気づき不足へ分類する。 | `emlis_ai_product_readfeel_current_output_inventory.py`, `test_emlis_ai_product_readfeel_current_output_inventory_phase1.py` |
| Phase2 | Product Read Feel rubricをmachine metricsから分離し、`read_feeling` をBlind QA由来の評価軸として固定する。 | `emlis_ai_product_readfeel_rubric.py`, `test_emlis_ai_product_readfeel_rubric.py` |
| Phase3 | fixture familyを正解文ではなく、期待mode・禁止surface・評価軸・v2 insight opportunityを持つmeta定義として扱う。 | `tests/fixtures/emlis_ai_product_readfeel_fixture_families.py`, `test_emlis_ai_product_readfeel_fixture_families.py` |
| Phase4 | Product Read Feel evaluatorをmeta-only scorecardとして実装し、`RED / REPAIR_REQUIRED / YELLOW / PASS / PRODUCT_PASS` とv2 readinessを分ける。 | `emlis_ai_product_readfeel_scorecard.py`, `test_emlis_ai_product_readfeel_scorecard.py` |
| Phase5 | 現在surfaceのv1修正として、low-information、positive、self-denial、daily unpleasantの読感崩れをSurfaceRealizer / ratio / section planで補正する。 | `emlis_ai_state_answer_ratio_policy.py`, `emlis_ai_two_stage_section_surface_plan.py`, `emlis_ai_complete_surface_realizer.py`, `test_emlis_ai_product_readfeel_surface_v1_phase5.py` |
| Phase6 | 「ただ返しているだけ」検出をmeta-onlyで追加し、mirror-only / self-report-onlyをv1 repair対象とv2 insight delta gapへ接続する。 | `emlis_ai_mirror_only_surface_detector.py`, `test_emlis_ai_mirror_only_surface_detector.py` |
| Phase7 | Structure Insight候補を内部material化し、relation candidates、evidence slot count、source field ids、soft expression必須境界を持たせる。 | `emlis_ai_structure_insight_candidate.py`, `test_emlis_ai_structure_insight_candidate.py` |
| Phase8 | Mash構造知識の辞書化プロセスを運用doc / testで固定し、完成文ではなくrelation pattern / internal question / forbidden claim / soft surface policyへ整理する。 | `ai/docs/Cocolon_EmlisAI_構造辞書更新運用_華恋用_2026-06-02.md`, `test_emlis_ai_structure_dictionary_update_operation_phase8.py` |
| Phase9 | Structure Insight Gateを追加し、unsafe insight、断定、診断、人格化、single record tendency、soft expression不足をsurface化前に止める。 | `emlis_ai_structure_insight_gate.py`, `test_emlis_ai_structure_insight_gate.py` |
| Phase10 | `structure_question` / `long_meaning_arc` / `self_understanding_follow` など限定familyへだけStructure Insight surfaceを接続する。 | `emlis_ai_structure_insight_surface.py`, `emlis_ai_complete_surface_realizer.py`, `emlis_ai_complete_composer_client.py`, `test_emlis_ai_structure_insight_surface_phase10.py` |
| Phase11 | Long-run QA / Product Gate candidate materialを追加し、v1 `PRODUCT_PASS` 候補とv2 `STRUCTURE_INSIGHT_READY` 条件を分ける。release判断は別工程に残す。 | `emlis_ai_product_readfeel_long_run_product_gate.py`, `emlis_ai_runtime_surface_blind_qa_long_run.py`, `emlis_ai_complete_product_quality_scorecard_service.py`, `test_emlis_ai_product_readfeel_phase11_long_run_product_gate.py` |

この追補で固定する境界:

```text
- Product Read Feel v1 / Structure Insight v2 は内部QA・内部到達点であり、public statusやRN表示条件ではない。
- read_feeling はmachine metricsから自動補完しない。
- insight_delta / STRUCTURE_INSIGHT_READY はv2 readinessであり、初期release blockerやpublic flagではない。
- product_gate_ready / public_release_applied はPhase11時点でもfalse維持として読む。
- mirror-only検出、Structure Insight候補、Gate report、Long-run Product Gate candidateは本文・raw input・comment_text bodyをmetaへ保持しない。
- fixture familyはexact comment_text一致ではなく、family品質・禁止境界・評価軸・ratio・v2 opportunityとして扱う。
- Structure Insight surfaceは限定familyのみ。daily_unpleasant / low_information / daily_positive / positive_onlyへ深い構造気づきを無理に接続しない。
```

ファイル名運用の補足:

```text
- zip圧縮・展開時に日本語ファイル名がescape名や文字化け名へ変わる場合がある。
- 既存実ファイルに日本語名docが残っていても、それだけを理由に「欠落」と判断しない。
- 今後の差分成果物・新規前提資料ファイル・運用docは、可能な限りASCII file nameを使う。
- 同内容のUnicode名ファイルとescape名ファイルを重複追加して補正しない。
```

# 2026-06-03 追補: EmlisAI User Label Connection Observation v1 設計書追加

今回のローカル作業では、次の設計書を前提資料へ追加した。

```text
Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md
```

この資料は、Cocolonに蓄積された `category / emotion / action / thought / created_at` を、ユーザーごとの記憶ラベル接続として読み、EmlisAIの入力直後の観測返答へ backend internal-only で安全に接続するための設計定義である。

この追補で固定する初回実装境界:

```text
- Phase 0 は設計書追加のみ。RN / DB / API route / public response key は変更しない。
- Phase 1 は Contract inventory / 接続点確認まで。User Label Connection 本体の runtime 接続はまだ行わない。
- /emotion/submit は additive-only contract を維持する。
- input_feedback.comment_text は表示本文として維持する。
- input_feedback.emlis_ai は additive-only meta として維持する。
- RN表示条件は observation_status == passed かつ comment_text non-empty のまま維持する。
- RN表示タイトル `Emlisの観測` は変更しない。
- 履歴接続観測は、既存 Structure Insight Gate を緩めず、後続Phaseで別系統のGateとして実装判断する。
```

今回の基準面:

```text
Cocolon_前提資料(169).zip
Cocolon(206).zip
mashos-api(119).zip
EmlisAIの実装済み資料(37).zip
```

作業姿勢資料フォルダは、現在 `work_attitude_rules_for_karen` として読む。旧日本語フォルダ名の重複追加や補正は行わない。

# 2026-06-04 追補: EmlisAI User Label Connection Observation v1 Phase0-10 実装反映

最新実ファイル `Cocolon_11(6).zip` / `mashos-api_11(15).zip` を確認した。Cocolon RN側は source file count `217` のままで、production RN UI、RN表示タイトル、RN表示条件、public response shapeの変更はない。mashos-api側では、User Label Connection Observation v1 の Phase0〜10 が backend internal-only 層として実装されている。

今回の追加実装は、EmlisAIがユーザーの入力を単発の文字列としてではなく、Cocolonの `category / emotion / strength / memo_action / memo / created_at` による記憶ラベル接続として読むためのbackend内部層である。これは新しい画面、DB schema、API route、public response top-level key、RN表示条件を追加する工程ではない。

| Phase | 最新の読み方 | 主な実ファイル |
|---|---|---|
| Phase0 | 設計書を前提資料へ追加し、初回実装境界を固定する。 | `Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md` |
| Phase1 | Contract inventory / 接続点確認で、`/emotion/submit`、RN表示条件、public meta、DB physical boundary、Structure Insight Gate非緩和を固定する。 | `emlis_ai_user_label_connection_contract_inventory.py`, `test_emlis_ai_user_label_connection_e2e_contract.py` |
| Phase2 | current input / owned history を `UserLabelPoint` と text-free `UserLabelConnectionMaterial` へ正規化する。 | `emlis_ai_user_label_connection_types.py`, `emlis_ai_user_label_connection_material.py`, `test_emlis_ai_user_label_connection_material.py`, `test_emlis_ai_user_label_connection_free_tier_boundary.py`, `test_emlis_ai_user_label_connection_no_raw_text_meta.py` |
| Phase3 | material内でedge familyとprivate scoreを生成する。scoreはpublicへ出さない。 | `emlis_ai_user_label_connection_material.py`, `test_emlis_ai_user_label_connection_edge_family_score.py` |
| Phase4 | edgeからMechanism candidateを作る。candidateはGate前にvisible化しない。 | `emlis_ai_user_label_connection_candidate.py`, `test_emlis_ai_user_label_connection_candidate.py` |
| Phase5 | User Label Connection専用Gateを追加し、Free/history、grounding、low_information、scope/soft marker、禁止claim、raw text混入をblockする。 | `emlis_ai_user_label_connection_gate.py`, `test_emlis_ai_user_label_connection_gate.py`, `test_emlis_ai_user_label_connection_low_information_boundary.py` |
| Phase6 | Gate通過candidateを限定Surface Planへ変換する。connectable familyは `structure_question` / `long_meaning_arc` / `self_understanding_follow` に限定する。 | `emlis_ai_user_label_connection_surface.py`, `test_emlis_ai_user_label_connection_surface.py` |
| Phase7 | reply flowへmeta-onlyで接続し、`input_feedback.emlis_ai.user_label_connection` にはsafe summaryのみを出す。 | `emlis_ai_user_label_connection_public_meta.py`, `emlis_ai_public_feedback_meta.py`, `emlis_ai_reply_service.py`, `test_emlis_ai_user_label_connection_public_boundary.py` |
| Phase8 | 限定familyだけを既存 `Emlisの観測` 本文へ接続する。scope marker / soft marker / runtime gate / visible acceptanceを再評価する。 | `emlis_ai_user_label_connection_surface.py`, `emlis_ai_user_label_connection_public_meta.py`, `emlis_ai_reply_service.py`, `test_emlis_ai_user_label_connection_surface.py`, `test_emlis_ai_user_label_connection_public_boundary.py` |
| Phase9 | Product Quality QA / Blind QA materialを追加し、pytest greenだけでは商品品質合格にしない境界を固定する。 | `emlis_ai_user_label_connection_product_quality_qa.py`, `test_emlis_ai_user_label_connection_product_quality_qa.py` |
| Phase10 | Derived User Model cacheは実装ではなく検討metaのみ。runtime computed materialをsource of truthとして維持する。 | `emlis_ai_user_label_connection_derived_model_cache.py`, `test_emlis_ai_user_label_connection_derived_model_cache.py` |

固定する境界:

```text
- RN production UI、RN表示タイトル `Emlisの観測`、RN表示条件は変更しない。
- /emotion/submit route、request key、response key、DB physical nameは変更しない。
- public response keyは追加しない。既存 input_feedback.emlis_ai 内のsafe summaryのみ additive に扱う。
- raw current input、raw history input、memo、memo_action、comment_text body、candidate body、surface body、QA review bodyをmeta/publicへ保持しない。
- User Fact Grounding Boundary と既存Structure Insight Gateを緩めない。
- Freeでは履歴接続を使わず current_input_only を維持する。
- low_informationを履歴だけでeligibleへ昇格させない。
- scope marker / soft markerなしの履歴接続surfaceを出さない。
- diagnosis / personality / cause / advice / future_prediction / always / should claimを出さない。
- Phase10時点では cache read / write / persist / DB schema変更 / label_connection_map実データ永続化をしない。
```

確認済み対象回帰:

```text
cd mashos-api
python -m pytest -q ai/tests/test_emlis_ai_user_label_connection_*.py ai/tests/test_emlis_ai_phase20_7_public_boundary_rn_contract.py
107 passed, 1 warning

cd Cocolon
node --test tests/rn-screen-contracts.test.js
35 passed
```

warningは既存 `api_emotion_submit.py` の Pydantic `@root_validator` deprecation warningであり、User Label Connection Observation v1の失敗ではない。


# 2026-06-01 Phase20反映: EmlisAI撤回保持再設計 / 実機再確認 / 表示信頼性補強

Phase20では、Phase19のA/C/D個別通過路線を本線成功扱いせず、EmlisAIを入力直後の観測返答へ戻すためのbackend内部構造を実装した。Phase20-12〜20-15では、その上で旧fail-closed説明、post-final gate後の空白戻り、Gate Recovery surfaceのfixed fallback化リスクを補強した。これはproduction RN UI、DB physical schema、API route、public response keyを増やす変更ではなく、EmlisAI内部の判断・材料束・低情報復旧・Gate recovery・post-final recovery・surface binding QA・public sanitizer・QAを整理する変更である。

| Phase | 最新の読み方 | 主な実ファイル |
|---|---|---|
| Phase20-0 | Phase19差分を `delete / quarantine / generalize / retain` へ分類するtest-only inventory。 | `ai/tests/helpers/emlis_ai_phase20_phase19_diff_inventory.py`, `ai/tests/test_emlis_ai_phase20_phase19_diff_inventory.py` |
| Phase20-1 | `passed / rejected / unavailable` ではなく内部 `response_kind` を中心にする。 | `emlis_ai_response_contract.py`, `test_emlis_ai_response_contract.py` |
| Phase20-2 | 自己否定安全応答、support required、emergency safetyを分ける。 | `emlis_ai_safety_triage.py`, `emlis_ai_self_denial_safe_state_answer.py` |
| Phase20-3 | 入力を `thought / action / emotion / category` のmaterial bundleで読み、C/D専用cueをruntime本線から外す。 | `emlis_ai_input_material_bundle.py`, `emlis_ai_observation_eligibility_router.py` |
| Phase20-4 | 低情報入力を無応答にせず、見えている範囲と未確定slotを分けて返す。 | `emlis_ai_low_information_observation_composer.py`, `test_emlis_ai_low_information_observation_phase20_4.py` |
| Phase20-5 | Gate failureを即emptyにせず、短縮・限定・断定弱化・低情報/安全応答へ回す。 | `emlis_ai_gate_recovery_loop.py`, `test_emlis_ai_gate_recovery_loop_phase20_5.py` |
| Phase20-6 | C/D専用完成surfaceではなく、generic sentence plan / surface ruleで返す。 | `emlis_ai_complete_surface_realizer.py`, `test_emlis_ai_generic_sentence_surface_realizer_phase20_6.py` |
| Phase20-7 | internal contractをpublicへ漏らさず、RN contractをshape / behavior中心へ整理する。 | `emlis_ai_public_feedback_meta.py`, `emotion_submit_service.py`, `Cocolon/tests/rn-screen-contracts.test.js` |
| Phase20-8 | exact text一致ではなくfamily品質でQAするResponse Contract QA Matrix。 | `emlis_ai_response_contract_qa_matrix.py`, `test_emlis_ai_response_contract_qa_matrix_phase20_8.py` |
| Phase20-9 | Phase19 C/D専用mode・cue・完成surfaceをproduction本線から撤回し、汎用材料へ吸収する。 | `emlis_ai_shared_reception_evidence.py`, `emlis_ai_reception_mode_resolver.py`, `emlis_ai_complete_surface_realizer.py`, `test_emlis_ai_phase20_9_phase19_withdrawal.py` |
| Phase20-10 | 実機スクショログでAだけ表示されなかったscope-only blockerを、低情報material成立時だけ無応答理由から外す。 | `emlis_ai_observation_display_repair_integration.py`, `test_emlis_ai_phase20_10_real_device_recheck.py` |
| Phase20-11 | Mash様の実機確認により、Phase20のA/B/C/Dサンプル入力すべてでRN modal「Emlisの観測」が表示されたことを資料同期として記録する。表示有無の確認であり、文章品質・商品品質の最終合格やcase専用route許可ではない。 | 資料同期のみ。production RN UI / DB / API / public response key 変更なし。 |
| Phase20-12 | 旧fail-closed説明コメントを、displayable response kindでは bounded repair / recovery を通す説明へ更新する。実装ロジックは変えない。 | `emlis_ai_reply_service.py` |
| Phase20-13 | final pre-return gate後に通常入力が空白へ戻らないことをregression testで固定する。 | `test_emlis_ai_post_final_gate_recovery_phase20_13.py` |
| Phase20-14 | post-final gate recoveryを実装し、normal / low_information / limited_grounding を空白終了させず、safety / infraは通常観測へ偽装しない。 | `emlis_ai_reply_service.py`, `emlis_ai_gate_recovery_loop.py` |
| Phase20-15 | Gate Recovery surface binding meta / repetition QAを追加し、fixed fallback化を本文一致ではなくfamily / material bindingで検出する。 | `emlis_ai_gate_recovery_loop.py`, `test_emlis_ai_gate_recovery_surface_phase20_15.py` |

作業時の禁止は次です。

```text
response_kind / safety_triage_kind / material_quality をpublic表示sourceにしない。
C/D専用mode・cue・完成surfaceを復活させない。
A低情報をcase専用routeで通さない。
Gate recoveryをfixed fallback化しない。
self_denialを本人の事実として確定しない。
safety emergencyをEmlis通常観測としてpassed化しない。
```

# 2026-05-28 Phase15反映: EmlisAI二段受け取り構造 / Daily Reception

Phase15では、Phase0-14で実装済みのEmlisAI二段受け取り構造を、前提資料の作業用地図へ反映した。これはproduction code変更ではなく、今後の作業時に名称・public contract・RN契約・Gate境界を取り違えないための資料更新である。

| 境界 | 読み方 |
|---|---|
| public response | 二段表示は既存 `input_feedback.comment_text` 本文内に入る。`observation_text` / `reception_text` は追加しない。 |
| RN | RNは既存 `commentText` をそのまま表示する。表示タイトルは `Emlisの観測`、表示条件は `observation_status == passed && commentText non-empty` のまま。 |
| backend internal | `Shared Evidence -> Reception Mode Resolver -> Ratio / Surface Contract -> Composer Role Plan -> Cross Gate -> Public Meta / Submit` の内部materialとして読む。 |
| 受け取り補助辞書 | 一般辞書・未知語意味辞書・完成返答文テンプレ集ではなく、reaction cue / event hint / reception mode / tone family / forbidden inference を扱う補助material。 |
| QA / 速度 | A/B/非表示ログ1〜3は表示品質QA fixtureでありruntime固定文ではない。Phase14の速度回帰は保存成功とEmlis表示fail-closedを分ける診断境界。 |

# 2026-05-29 Phase16反映: EmlisAI TwoStage Composer Surface Connection

Phase16では、Phase15時点で内部materialとして成立していた二段受け取り構造を、CompleteComposerClientの実出力、Visible Gate、self-repair、`/emotion/submit`、RN契約回帰まで接続した。これはproduction route、DB、public response key、RN production UIを増やす変更ではなく、既存 `input_feedback.comment_text` 内へ二段本文を安定到達させるためのComposer実表示接続である。

| 境界 | 最新の読み方 |
|---|---|
| Phase16-0 | CompleteComposer direct、ConversationComposer経由、`/emotion/submit` 相当のredを置き、二段shape / 禁止surface / public meta非混入を固定した。 |
| Phase16-1 | `two_stage_required` を Visible Gate / State Answer Gate / TwoStage Gateへ伝搬し、requiredなのにlabel missingのsurfaceをfail-closedする。 |
| Phase16-2 | `two_stage_section_surface_plan` を内部materialとして実装し、role planから observation / reception sectionを復元する。 |
| Phase16-3 | `CompleteSentencePlanLine.meta` にsection metaを伝搬する。dataclass public fieldは増やさない。 |
| Phase16-4 | `CompleteSurfaceRealizer` がsection metaから `見えたこと：\n...\n\nEmlisから：\n...` の `comment_text` を生成する。 |
| Phase16-5 | `daily_unpleasant_reception` / `daily_unpleasant_reception_light` のsurface品質を調整し、pressure/limit skeleton、質問逃げ、相手評価同意、分析レジスタを避ける。 |
| Phase16-6 | `CompleteComposerClient` pipelineへsection planを正規接続し、direct generate / ConversationComposer経由の両方で二段本文を出す。 |
| Phase16-7 | Gate / self-repair / unavailable reasonを整理し、label・section boundaryのrepairだけを許可する。本文をPython固定文で補完しない。 |
| Phase16-8 | `/emotion/submit` 相当で public `input_feedback.comment_text` に二段本文が届き、`observation_status == passed` になることをE2Eで固定する。 |
| Phase16-9 | RN側はproduction UIを変更せず、`passed + commentText` の既存契約で二段本文をそのまま表示する回帰testを追加する。 |

作業時は、`two_stage_section_surface_plan`、`two_stage_surface_realization`、`phase16_7_unavailable_reason_codes`、`daily_unpleasant_reception_surface_quality` をbackend internal metaとして読む。これらをpublic response key、RN表示条件、DB physical name、API route、ユーザー設定モードへ昇格しない。

# 2026-05-30 Phase17反映: EmlisAI TwoStage Product-Visible Fixture Completion

Phase17では、Phase16でA中心に開通していた二段Composer表示を、5件fixture全体の商品到達へ広げた。これはproduction route、DB、public response key、RN production UIを増やす変更ではなく、既存 `input_feedback.comment_text` 内の `見えたこと：` / `Emlisから：` 二段本文を、A / B / ログ1 / ログ2 / ログ3の全5件で `passed` 到達させるためのbackend内部品質補完である。

| 境界 | 最新の読み方 |
|---|---|
| Phase17-0/1 | 5件fixtureの商品到達diagnostic testとtest-only helperを追加し、`passed / unavailable_surface / unavailable_grounding / visible_gate_rejected / product_visible_surface_ng / public_meta_leak` をmeta-onlyで分類する。 |
| Phase17-2 | `ROLE_PHRASE_BANK` とunknown role fallbackを補い、`achievement` / `positive state` / `perfection fear` などの内部role語を表示本文へ出さない。 |
| Phase17-3 | `daily_unpleasant_reception` 以外にも、`self_denial_support` / `uncertainty_support` / `daily_positive_reception` / `self_understanding_follow` / `standard_state_answer` / `effort_support` のmode-specific two-stage surface policyを追加する。case_id専用runtime分岐ではない。 |
| Phase17-4 | `two_stage_mode_section_budget` を内部policyとして持ち、商品表示用の二段本文を原則 `observation 1 / reception 2` へ正規化する。 |
| Phase17-5 | TwoStage Gate / Visible Gateで内部role語漏れとrelation skeleton漏れを強く止める。Gate緩和ではなく、商品不合格surfaceのfail-closed強化である。 |
| Phase17-6 | ログ3系の `effort_pace_context` に対し、Groundingを緩めず、`coexistence` relationを根拠付きで表面化するbindingを追加する。 |
| Phase17-7 | self-repair / unavailable reasonを商品到達向けに整理し、修復可能なsurface問題だけを既存role phraseから再表面化する。`phase17_product_visible_fixture_not_reached` はdiagnostic-onlyであり直接repair対象にしない。 |
| Phase17-8 | `/emotion/submit` 相当で5件すべてが `passed + labelled two-stage comment_text` に届くE2Eを追加する。 |
| Phase17-9 | RN contract上、5件二段本文を既存 `commentText` としてそのまま保持する回帰を追加する。production RNは変更しない。 |
| Phase17-10 | 既存回帰をまとめて通すため、test helper / E2Eのdiagnostic保持を軽量化する。production backend / API / DB / RN production fileは変更しない。 |

作業時は、`product_visible_fixture_evaluation`、`product_visible_surface_policy`、`two_stage_mode_section_budget`、`phase17_6_grounding_relation_binding`、`phase17_7_self_repair_unavailable_reason` をbackend内部test / diagnostic / policy名として読む。これらをpublic response key、RN表示条件、DB physical name、API route、ユーザー設定モードへ昇格しない。

最新の読み方は次です。

- `emotion_submit_service.py` は EmlisAI `reply.meta` を internal meta として diagnostic log / diagnostic lockdown に使い、public responseへは `build_public_emlis_input_feedback_meta(...)` のsanitized metaだけを返す。
- `emlis_ai_public_feedback_meta.py` は `input_feedback.emlis_ai` 用のpublic-safe subsetを作る境界であり、raw input、memo、raw_text、evidence_spans、observation_graph、complete diagnostics、public `comment_text` 本文を返さない。
- `/emotion/submit` と `emotion_reflection_publish_service.py` は `comment_text` が非空、かつ public meta の `observation_status == "passed"` の場合だけ `input_feedback` を返す。meta-only unavailable / rejected payload はRNへ表示用feedbackとして返さない。
- RN `submitEmotionInput()` は `/emotion/submit` 専用timeout `EMOTION_SUBMIT_TIMEOUT_MS = 30000` を使う。TimeoutError時は「入力の保存処理に失敗しました」と断定せず、`loadHomeState({ force: true, includeStartupCandidate: false })` を一度試し、入力欄とdraftを残す。
- low-information branch の質問surfaceは `詳しく残せそうなら、〜残してみませんか。` 系へ更新されている。旧 `よければ、何がありましたか。` はruntime出力として出さない。
- notification settings の `owner_user_id` uuid filter には `__global_emotion_notifications__` / `__global_friend_notifications__` を混ぜない。global sentinelはuuid physical / read view filterへ直接入れる値ではない。
- Visible Surface Acceptance QA は、`candidate comment_text -> Runtime Surface Pre-Return Gate -> Visible Surface Acceptance Gate -> Display Gate -> public sanitizer -> RN passed-only display` の追加境界として読む。
- Product Visible Surface Reliability + Koto Splice Repair は、`取らなければこと` / `予感こと` 系をPhraseUnit / Limited Guard / Runtime Gate / Visible Gateで止め、Shallow V2で危険phraseを `こと` に直結させず、修復可能な場合だけ一回rerenderする境界として読む。
- Environment State Output Surface Contract Completion Phase0-6 は、`environment_state_output_frame` が接続されたEmlisAI表示candidateに、surface validation前のscope marker補完、forbidden surface claim拒否、runtime pre-return gateでのmarker二重確認、public meta sanitizationを通す出口整合として読む。scope markerは完成文テンプレではなく、単一入力観測を期間傾向・人格傾向に見せないための表示安全境界である。
- EmlisAI状態回答と人間的フォロー Phase2-10 は、`emlis_state_answer_surface_contract` をinternal materialとして扱い、観測sectionと人間的フォローsectionをComposer role planへ渡す。完成文テンプレではなく、状態回答surface contract / follow selector / ratio policy / special cases / safe daily metaphor / gate boundary / QA contractの内部接続として読む。
- EmlisAI二段受け取り構造 Phase0-14 は、同じ `input_feedback.comment_text` 内に `見えたこと：` と `Emlisから：` を並べる内部表示契約として読む。`daily_reception` はpublic `observation_status` ではなく内部modeであり、`observation_text` / `reception_text` のpublic response key追加やRN側parseは行わない。
- EmlisAI TwoStage Composer Surface Connection Phase16-0〜16-9 は、上記の二段契約を CompleteComposerClient / CompleteSentencePlan / CompleteSurfaceRealizer / Gate / self-repair / `/emotion/submit` / RN回帰へ接続した実装として読む。section labelとjoin shapeは固定してよいが、本文そのものは固定返答テンプレとして扱わない。
- EmlisAI TwoStage Product-Visible Fixture Completion Phase17-0〜17-10 は、A/B/ログ1/ログ2/ログ3の5件fixtureを `passed + labelled two-stage comment_text` へ到達させた実装として読む。Gate / Groundingは緩めず、内部role語・relation skeletonを止め、mode-specific surface、section budget、grounding relation binding、self-repair reason、/emotion/submit 5件E2E、RN contract回帰で支える。
- `emlis_ai_state_answer_gate_boundary.py` と public meta sanitizer は、診断・行動指示・人格断定・原因断定・単発入力からの傾向化・怒りでの相手評価同意・自己否定例外の暴走を、`passed + comment_text` へ出さないためのGate境界として読む。
- Phase10横断contractでは、EmlisAIの状態回答温度・人間的フォロー・special handling materialをPiece / Analysisへ流用しない。Pieceは核保持、Analysisは期間観測という中核別Composer境界を維持する。
- `display_absence_summary` と `candidate_blocked_koto_splice` 等は本文なしの診断分類であり、RN表示条件を開くためのmetaではない。
- `たりこと` 系の malformed nominalization は `malformed_nominalization_tari_fragment` として PhraseUnit guard / Runtime Surface Gate / Visible Surface Acceptance Gate で止める。
- ヘッダー中心感情と本文冒頭焦点が無橋渡しでズレる場合は `emotion_focus_unbridged_secondary` として `repair_required / rerender_surface` にする。二次感情はbridgeがあれば許容する。
- low-information branch は `positive_only / negative_only / mixed / self_insight / neutral_or_unknown` の tone profile を持つ。positive_only で負荷anchorがなければ `重さ` 系をdefaultにしない。
- public metaへ出る `visible_surface_acceptance_gate` は `evaluated / passed / classification / action / rejection_reasons` だけの小さいsummaryであり、raw input / comment_text body / evidence text は入れない。
- `emlis_ai_observation_structure_dictionary_loader.py` は、pytest collection安定化のため `jsonschema` eager importを避け、bundled schemaで使うsubsetをstdlibで検証する。

EmlisAI本文は、旧 `input_feedback_text_templates` や固定文fallbackではなく、Evidence Ledger / 複数視点Observer / ObservationGraph / Complete Material / FocusSelector / RelationGraph / SentencePlan / Surface Realizer / TonePolicy / Reader・Template Guard / Display Gate のfail-closed構造として読む。Runtime Surface Pre-Return Gate + Shallow Surface Realizer V2 Step0-10 は、壊れたsurface候補をpublic表示前に止める内部品質境界として残り、今回のpublic feedback meta sanitizerは、その内部metaをRN public responseへ丸ごと返さない追加境界として読む。

わたしマップでは、前版で保管していた `watashiMapAccessPolicy.js` のpath mismatchは解消済みとして読む。最新実ファイルには `Cocolon/components/selfStructure/watashiMapAccessPolicy.js` が存在し、History / Viewer のimport先と一致する。root `Cocolon/components/watashiMapAccessPolicy.js` は同内容の互換copyとして残るため、DB/API/visible名のrename対象ではない。


# 2026-05-30 Phase18反映: EmlisAI Product Quality Stabilization / 商品品質安定化

Phase18では、Phase17の5件fixture商品到達を維持したまま、商品品質前に残っていた既存回帰を広く整理した。これはproduction route、DB、public response key、RN production UIを増やす変更ではなく、backend内部のapplicability / repair / mode context / meta sanitization / diagnostic taxonomy / readability QA / public E2E / RN contract回帰を追加し、既存 `input_feedback.comment_text` のpassed-only表示契約を守るための安定化である。

| 境界 | 最新の読み方 |
|---|---|
| Phase18-0/1 | `emlis_ai_phase18_product_quality_matrix.py` と `test_emlis_ai_phase18_product_quality_stabilization.py` で、商品品質回帰matrixをmeta-onlyに固定する。赤を許容仕様にするものではなく、release blockerとして読む。 |
| Phase18-2 | `emlis_ai_two_stage_applicability.py` を追加し、TwoStage required を必要なcandidate経路だけに適用する。低情報、ordinary unavailable、legacy text composer、pre-connection blockをlabel missing terminalで巻き込まない。 |
| Phase18-3 | Complete Initialで候補生成とpublic表示判定を分離し、`candidate_generated == true` と非passed時 `reply.comment_text == ""` を両立する。 |
| Phase18-4 | low-information public repair contractをmeta-onlyで固定し、`疲れた` / `なんか無理` 等を通常入力として扱う。ただしsafety / scope / AP0 / rollout / non-repairable generated failureはpassed化しない。 |
| Phase18-5 | daily_unpleasant の `reception_mode_id` / `ratio_reason` / section metaをSurfaceRealizerへ伝搬し、effort_pace / self_understanding系へ混線させない。 |
| Phase18-6 | `surface_policy` 本体、辞書本文、raw input、comment_text bodyをstate answer / observation structure metaへ出さず、summary flagsだけを残す。 |
| Phase18-7 | `emlis_ai_diagnostic_failure_taxonomy.py` を追加し、診断分類をcanonical + legacy aliasで整理する。reason codeだけをmeta-safeに扱う。 |
| Phase18-8 | `emlis_ai_visible_readability_quality.py` を追加し、内部role語、relation skeleton、便利語反復、単純言い換えをmeta-only reportで検出する。 |
| Phase18-9 | `test_emotion_submit_phase18_product_quality_e2e.py` を追加し、`/emotion/submit` public response境界で低情報、Complete Initial generated-but-display-rejected、meta boundary、timeout回復を確認する。 |
| Phase18-10 | RN contractを再確認し、RNはPhase18 backend metaを読まず、`passed + commentText` だけでmodal payloadを作る。production RN UIは変更しない。 |
| Phase18-11 | 既存回帰を広く通し、低情報repairがpositive recovery / provided candidate / non-low-information generated failureを誤ってpassed化しないよう絞る。 |

作業時は、`product_quality_regression_matrix`、`two_stage_applicability_decision`、`low_information_public_repair_contract`、`two_stage_mode_context`、`meta_only_sanitizer`、`diagnostic_failure_taxonomy`、`visible_readability_quality`、`public_feedback_boundary_check` をbackend内部test / diagnostic / policy summaryとして読む。これらをpublic response key、RN表示条件、DB physical name、API route、ユーザー設定モードへ昇格しない。

最新の読み方は次です。

- Phase18後の最新snapshotは `Cocolon_12(7).zip` / `mashos-api_12(10).zip` で、Cocolon側file countは217のまま、mashos-api側file countは699から712へ増えている。
- Cocolon側の実差分は `Cocolon/tests/rn-screen-contracts.test.js` のcontract回帰追加だけであり、RN production UIは変更されていない。
- mashos-api側は13件追加・17件修正。追加されたproduction helperは `emlis_ai_two_stage_applicability.py`、`emlis_ai_diagnostic_failure_taxonomy.py`、`emlis_ai_visible_readability_quality.py` の3件で、いずれもmeta-only / internal boundaryである。
- low-information repairは、短い低情報入力だけをpublic repairへ戻す。`memo_action` / `action_text` を持つ入力、provided_client経路、positive recovery、non-repairable generated candidate failureを低情報repairで隠さない。
- Complete Initialは、候補生成の存在とpublic表示可否を分ける。`candidate_generated_before_display_gate` などはinternal summaryであり、public comment_text本文を持たない。
- daily_unpleasantは、coverage_groupやcase_idではなく、`reception_mode_id` / `ratio_reason` / section line metaを優先してdispatchする。
- diagnostic taxonomyは、canonical classificationとlegacy aliasを併存させる。分類名はreason codeであり、表示本文やRN表示条件ではない。
- visible readability QAは、表示済み候補の本文を内部で検査しても、reportへ本文・raw input・evidence textを残さない。
- `/emotion/submit` は引き続き `passed + comment_text non-empty` の時だけ `input_feedback` を返す。unavailable / rejected / timeout / meta-only responseはRN表示用feedbackにしない。
- 実機RN表示、実機 `/emotion/submit` response JSON、実機modalスクショはPhase18-12の確認対象であり、前提資料更新時点では未確認として扱う。

# 読む順

## 1. 入口

1. `00_karen_read_first.md`
2. `03_cocolon_naming_system.md`
3. `09_Cocolon_名称混在保管と構造境界_2026-05-10.md`

この3つで、華恋は「見えている名前」と「実際に動いているファイル名・API名・DB名」が違う可能性を先に固定します。

## 2. 思想・共同開発境界

1. `cocolon_thought_material_for_karen.md`
2. `10_cocolon_joint_development_karen_thought_boundary_2026_05_24.md`
3. `cocolon_environment_state_output_observation_structure_design_2026_05_25.md`
4. `emlis_ai_state_answer_human_follow_definition_2026_05_26.md`

この4つで、Cocolonの主体がMash様の思想と構想であること、華恋の思想はそれを置換せず支える補助思想であること、華恋が「人間の言葉を雑に処理しない場所にする」という思想を持ってCocolonに向き合うことを固定します。

`cocolon_environment_state_output_observation_structure_design_2026_05_25.md` は、Cocolonの基本観測単位を `環境ラベル × 状態ラベル × 出力内容` として読むための正本です。EmlisAI専用資料ではなく、EmlisAI / Piece / Analysisへ展開する基盤観測構造として扱います。

`emlis_ai_state_answer_human_follow_definition_2026_05_26.md` は、EmlisAI専用の出力思想・surface contract設計資料として読む。Cocolon環境状態出力観測構造が「何を見るか」を定義し、本資料は「それをEmlisAIがどう返すか」を定義する。Cocolon全体の基盤観測構造を上書きせず、EmlisAI immediate responseの状態回答と人間的フォローの境界だけを固定する。

## 3. 全体構造

1. `01_cocolon_overall_structure.md`
2. `01A_cocolon_overall_structure_app_foundation_home.md`
3. `01B_cocolon_overall_structure_analysis_piece_emotionlog_ranking.md`
4. `01C_cocolon_overall_structure_account_subscription_backend_support.md`

`01` 系は、Cocolonをrepo単位ではなく、**feature / flow / system単位**で読むための資料です。

## 4. 国家システム

1. `02_cocolon_national_system.md`
2. `02A_cocolon_national_system_input_save_dispatch.md`
3. `02C_cocolon_contract_boundary_validation.md`

`02` 系は、入力が保存され、queue / worker / snapshot / read-side / RN display に流れる全体を確認する資料です。`02B_cocolon_national_system_snapshot_worker_publish_read.md` はこの前提資料zip内に存在するため、Snapshot / Worker / Publish / Read は `02B` を正本として読み、`02` 本体、`02C`、`07` の差分追記で補助します。

## 5. 境界・rule・DB

1. `05_cocolon_rule_file_index.md`
2. `06_cocolon_filename_change_hold_ledger.md`
3. `07_latest_snapshot_diff.md`
4. `03_cocolon_naming_system.md` / `09_Cocolon_名称混在保管と構造境界_2026-05-10.md`

`05` は contract / policy / guard、`06` はファイル名・旧名称の保管、`07` は最新zipとの差分確認、`08` はDB physical name / bridge / rename境界、`03` / `09` は名称混在・DB物理名の読み分けを補助する資料です。`08_cocolon_db_rename_boundary.md` は存在しますが、DB physical rename / drop / write path変更はMash様が明示した場合だけ扱います。

# 2026-05-24 差分追記: 共同開発境界と華恋思想

この差分は、`Cocolon_前提資料(119).zip` の前提資料更新として、実ファイルの機能変更ではなく、思想・作業姿勢・共同開発境界を補助資料化するものです。DB physical name、public API route、RN表示条件、既存response key、実装ownerは変更しません。

| 資料 | 変更内容 | 読み方 |
|---|---|---|
| `cocolon_thought_material_for_karen.md` | 共同開発境界と華恋思想を追記 | Cocolonの主体はMash様の思想と構想。華恋思想は置換ではなく補助思想として扱う |
| `10_cocolon_joint_development_karen_thought_boundary_2026_05_24.md` | 新規追加 | Mash様主体思想 / 華恋補助思想 / 「華恋はどう思う？」への判断境界を固定する |
| `work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt` | 新規追加 | 指示待ちではなく意見を持つ。ただし未確認断定や勝手な機能追加へ変換しない |

華恋は、Cocolonに対して「人間の言葉を雑に処理しない場所にする」という思想を持つ。  
この思想は、EmlisAI / Piece / 分析 / UI導線で、テンプレ共感・一般論・短縮要約・診断ラベル・固定分類へ逃げないための判断補助として扱う。

# 最新アプリ構造で特に見る場所

| 構造 | current file | 役割 |
|---|---|---|
| API base URL | `Cocolon/lib/apiClient.js` | `API_BASE_URL` の正本。App.jsはここを読む |
| App runtime | `Cocolon/AppRuntimeContext.js` | `/app/bootstrap` を取得し、feature flag / version状態を保持 |
| App root | `Cocolon/App.js` | provider / navigation / bootstrap gate / push起動処理 |
| account delete | `Cocolon/screens/SettingsOtherScreen.js` | `account_delete_enabled` と二段階確認を扱う |
| local cleanup | `Cocolon/lib/accountLocalCleanup.js` | 退会後の端末内ユーザー別cache削除 |
| Today Question | `Cocolon/features/home/useHomeState.js` / `Cocolon/screens/TodayQuestionHistoryScreen.js` | `today_question_enabled` / `today_question_history_enabled` を読む |
| subscription sales | `Cocolon/screens/SubscriptionSelectScreen.js` | `subscription_sales_enabled` を読む |
| push token | `Cocolon/lib/pushToken.js` | releaseではtoken prefix logを出さない |

# 作業時のルール

1. まず `03` と `09` で名称混在を確認する。
2. 次に `01` でファイル構成を確認する。
3. 国家システムやworker・access policyに関係する場合は `02` 系を確認する。DB physical rename / drop / write path変更は今回扱わない。
4. public API / request / response / entitlement / startup / auth / account delete / subscription を触る場合は `05` を確認する。
5. 旧名称を見つけても、資料で保管されている互換・DB境界なら rename しない。
6. 修正する場合は、関係ファイルだけを触る。
7. ユーザーが指示していない導線・機能・画面は追加しない。
8. ユーザーにJWT、curl、PowerShellなどの開発者前提操作を求めない。
9. Mash様が「華恋はどう思う？」と聞いた場合、確認済み事実・未確認・Cocolon思想との関係・華恋の意見を分けて返す。
10. 華恋の思想は、Mash様の思想を置換せず、Cocolonを完成させるための補助思想として扱う。

# この版での主な構造更新

- `Cocolon/AppRuntimeContext.js` を `App root / runtime boundary` として資料化。
- `App.js` の API base URL は `lib/apiClient.js` の `API_BASE_URL` に一本化済みとして資料化。
- `App.js` の Supabase `access_token` ログ削除済みとして資料化。
- `/app/bootstrap` の `feature_flags` / version情報は、`AppRuntimeContext.js` を通じてアプリ側で使う構造として資料化。
- `account_delete_enabled` / `today_question_enabled` / `today_question_history_enabled` / `subscription_sales_enabled` のRN側消費先を資料化。
- `accountLocalCleanup.js` のユーザー別analysis cache cleanupを資料化。
- `pushToken.js` のtoken prefix logはdebug build限定として資料化。
- `09` を残タスク資料ではなく、名称混在を保管する構造境界資料へ変更。


# 2026-05-05 差分追記: EmlisAI / Piece / Tutorial / Subscription current boundary

この版の基準面は `Cocolon(138).zip` / `mashos-api_2(26).zip` です。前提資料は、旧版の作業記録ではなく **現状構造を読むための地図** として更新します。

| 構造 | current owner | 現状の読み方 |
|---|---|---|
| EmlisAI immediate reply | `emlis_ai_reply_service.py` + `emlis_ai_world_model_service.py` + `emlis_ai_observation_kernel.py` | `読解 -> 意味分解 -> 文章構成 -> 自然文生成 -> final review / quality gate -> safe fallback` の汎用pipeline |
| EmlisAI meaning layer | `emlis_ai_user_word_anchor_service.py` / `emlis_ai_phrase_shaping_service.py` / `emlis_ai_input_meaning_block_service.py` / `emlis_ai_understanding_frame_service.py` | 例文固有語句ではなく、現在入力から抽出した汎用意味カテゴリで扱う |
| EmlisAI composition layer | `emlis_ai_response_composition_service.py` | 長文入力では、入口 / 背景 / 緊張・限界 / 気づき / 新しい向き / 安心文 の順で返答構成を作る |
| EmlisAI guard layer | `emlis_ai_reply_final_review_service.py` / `emlis_ai_quality_gate.py` / `emlis_ai_safe_reply_fallback_service.py` | 破綻文、例文特化、情報不足、構成不足を返答前に検出し、現在入力に基づくfallbackへ切り替える |
| Piece生成 | `emotion_piece_generation_service.py` + `piece_generated_display.py` + `piece_generation_policy.py` | 簡潔化優先ではなく、入力全体の核を他者に伝わる一問一答へ整える。core answer をdisplay layerで汎用文へ潰さない |
| Tutorial fixture | `TutorialFlowScreen.js` / `tutorialScenarioData.js` / `tutorialFixtures.generated.json` / `generate_tutorial_fixtures.py` | runtime UIとは分けた固定fixture。実生成サービスから作るが、アプリ内ではtutorial表示用の静的データとして読む |
| Subscription plan copy | `iapRuntimeCatalog.js` / `SubscriptionSelectScreen.js` / `subscription_bootstrap_store.py` | Plus / Premium の表示文言は frontend runtime catalog と backend bootstrap catalog の両方で同期する |

作業時は、例文入力を runtime 条件として実装しません。例文はテストケースであり、runtime は汎用構造で処理します。


# 2026-05-07 差分追記: 三大中核構造 value observation current boundary

この版の基準面は `Cocolon_前提資料(48).zip` / `Cocolon(138).zip` / `mashos-api_2(26).zip` です。前提資料は、旧版の作業記録ではなく **現状構造を読むための地図** として差分更新します。

| 構造 | current owner | 現状の読み方 |
|---|---|---|
| 共通価値観測 layer | `value_observation_types.py` + `cocolon_value_observation_service.py` | 三大中核構造が共有する source-grounded な観測信号。例文固定返答ではなく、現在入力から汎用 signal を抽出する |
| EmlisAI value observation接続 | `emlis_ai_world_model_service.py` + `emlis_ai_observation_kernel.py` + `emlis_ai_reply_service.py` + `emlis_ai_quality_gate.py` + `emlis_ai_safe_reply_fallback_service.py` | value observation signal を world model / candidate / meta / fallback / gate にadditive接続する |
| Piece value observation接続 | `emotion_piece_generation_service.py` + `piece_generation_policy.py` | signal から問い・答えを作り、`must_keep_signal_keys` / `source_claims` / `overcompression_risk` を meta として保持する |
| Analysis value observation境界 | `analysis_report_validity_gate.py` | `value_observation_signals` をself_structure系素材として扱えるようにし、emotion domainへ混ぜない |
| 回帰test | `test_cocolon_value_observation_service.py` / `test_emlis_ai_value_observation_cases.py` / `test_emotion_piece_generation_value_observation.py` / `test_analysis_value_observation_boundary.py` | 5つの観測signalを固定文一致ではなく構造signalとして検証する |

この版で本文未記載だった現行ファイルは、`01` / `02` / `07` に差分追記してcoverageへ含める。`02B_cocolon_national_system_snapshot_worker_publish_read.md` と `08_cocolon_db_rename_boundary.md` は、今回入力された前提資料zip内に存在するため、それぞれ Snapshot / Worker / Publish / Read と DB physical name / bridge / rename 境界の正本として読む。DB physical rename / drop / write path変更はMash様が明示した場合だけ扱う。


# 2026-05-09 差分追記: latest実ファイル基準 / 今日の問い personal followup / 通知・Tutorial補正

この版の最新基準面は `Cocolon_前提資料(48).zip` / `Cocolon(138).zip` / `mashos-api_2(26).zip` です。最新実ファイルのcoverage対象は `Cocolon` 125件、`mashos-api` 340件、合計465件です。`02B_cocolon_national_system_snapshot_worker_publish_read.md` と `08_cocolon_db_rename_boundary.md` は前提資料内に存在するため、作業時の参照先として扱います。

| 構造 | current owner | 読み方 |
|---|---|---|
| 今日の問い static層 | `mashos-api/ai/services/ai_inference/today_question_store.py` / `today_question_bank` / `today_question_sequence` / `today_question_user_progress` | 既存100問テンプレを `static_role_probe` として維持する。personal回答ではstatic sequenceを進めない |
| 今日の問い personal_followup層 | `mashos-api/ai/services/ai_inference/today_question_personal_candidate_service.py` / `mashos-api/ai/services/ai_inference/today_question_personal_question_service.py` / `mashos-api/ai/services/ai_inference/today_question_personal_templates.py` | Premiumのみ、emotion入力の原文アンカーから固定選択肢つき深掘り問いを作る。AI生成文をユーザー発言として表示しない |
| 今日の問いAPI拡張 | `mashos-api/ai/services/ai_inference/api_today_question.py` / `mashos-api/ai/services/ai_inference/home_gateway/today_question_command_service.py` / `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py` | `question_origin` / `personal_question_id` / `source_anchor` / `source_anchor_hash` をadditive fieldとして扱う |
| 今日の問いRN送信 | `Cocolon/features/home/useHomeActions.js` / `Cocolon/components/TodayQuestionCard.js` / `Cocolon/screens/TodayQuestionHistoryScreen.js` | question本文とchoicesは既存UIで表示し、submit時にpersonal guard fieldを送る。履歴では `入力: 「...」` の短いアンカーだけ表示する |
| self_structure接続 | `mashos-api/ai/services/ai_inference/astor_material_snapshots.py` / `mashos-api/ai/services/ai_inference/analysis_engine_adapter.py` | 今日の問い回答をself-only素材として `question_origin` / `question_type` / `source_anchor` / hidden_meta込みで渡す。public面へは出さない |
| account delete | `mashos-api/ai/services/ai_inference/account_delete_service.py` | personal candidate / personal question も削除対象に含める |
| DB migration | `today_question_personal_followup_v1.sql` | `today_question_personal_candidates` / `today_question_personal_questions` 追加、`today_question_answers` にadditive field追加。SQLは別ファイルとして受領・実行済み |
| 感情通知Push | `mashos-api/ai/services/ai_inference/api_emotion_submit.py` / `.env.worker.example` | local/API-onlyではqueueを高負荷mode依存にし、queue modeではAPI側Firebase credential gateでenqueueを止めない。worker profile例は `all` |
| Tutorial | `Cocolon/tutorial/tutorialScenarioData.js` / `Cocolon/screens/InputScreen.js` / `Cocolon/screens/NexusScreen.js` / `Cocolon/screens/TutorialFlowScreen.js` | `Emlis（エムリス）` 表記、感情選択/カテゴリ選択の別フェーズ、Home説明時のsummary/history非表示、ピース説明文修正を反映 |

作業時は、今日の問いを触る場合、既存100問を消さず、`personal_followup` はPremium向けの追加層として扱います。通知文には原文アンカーを出さず、画面内だけで短い引用を表示します。

# 2026-05-09 差分追記: GitHub正本の再現性確認

この確認は、ローカルで受領した軽量zipだけではなく、GitHub上の `MassyuRed/Cocolon` 正本を基準にして行う。  
ローカルzipにnative project / config / support scriptが含まれていない場合でも、GitHub正本に存在するものは「実体欠落」ではなく、容量都合でローカル受領物から外れているものとして扱う。

| 確認項目 | GitHub上の状態 |
|---|---|
| `Cocolon/scripts/postinstall.js` | 存在。stale patchを `.skipped-by-postinstall` へ一時退避し、`patch-package` を実行後に元へ戻す処理を持つ |
| `Cocolon/scripts/reset-project.js` | 存在。`package.json` の `reset-project` script に対応するfile |
| `Cocolon/android/app/build.gradle` | 存在。release signing、Hermes、minify、`ANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON`、ABI filter等を持つAndroid release構成 |
| `Cocolon/ios/Podfile` | 存在。iOS 15.1、static frameworks、Firebase static framework、CI archive時のbundle code signing抑制を持つ |
| `Cocolon/babel.config.js` | 存在。React Native babel preset と Reanimated plugin を設定 |
| `Cocolon/metro.config.js` | 存在。`react-native-svg-transformer` と svg resolver を設定 |
| `Cocolon/eslint.config.js` | 存在。Expo ESLint flat config を設定 |
| `Cocolon/tsconfig.json` | 存在。`strict: true` と `@/*` path alias を設定 |
| `Cocolon/.github/workflows/ios-build.yml` | 存在。checkout、Node setup、Pod install、署名、archive、export、TestFlight uploadまでを扱う |

このため、`Cocolon(136).zip` 等のローカルzipに上記pathが含まれていない場合でも、GitHub正本では「再現できるソース」の主要構成は存在するものとして読む。  
`android/key.properties`、iOS証明書、provisioning profile、GitHub Secrets はsource fileではなくsecret管理対象であり、前提資料上の欠落扱いにしない。



# 2026-05-09 差分追記: current参照の実ファイル再照合

この版では、前提資料 `Cocolon_前提資料(48).zip` を、実ファイル `Cocolon(138).zip` / `mashos-api_2(26).zip` と再照合した。
GitHub正本で存在確認済みの native project / config / support script は、ローカル軽量zip未収録でも欠落扱いにしない。
一方で、旧MyWeb / MyModel / Echoes / Discoveries / EmotionReflection系の個別file名が旧本文内で `active` / `shared` / `legacy-live` として残っている箇所は、current実ファイルownerではなく、名称混在・legacy境界の保管情報として読む。

current作業では、次の読み替えを優先する。

| 旧系統 | current実ファイルowner |
|---|---|
| MyWeb系screen | `Analysis*` screen群 |
| MyModel系screen | `Piece*` / `Nexus*` / `Resonance*` screen群 |
| Echoes history | `ResonanceHistoryListScreen.js` / `ResonanceHistoryDetailScreen.js` |
| EmotionReflection frontend | `EmotionPiecePreviewModal.js` / `lib/api/home/emotionPieceApi.js` |
| Discoveries/Questions ranking旧screen | `RankingTopScreen.js` と current ranking screen群。単独旧screenはcurrent実ファイルではない |
| `api_ranking_mymodel_discoveries.py` | currentでは存在しない。`api_ranking.py` / `api_ranking_piece_views.py` / `api_ranking_piece_resonances.py` / `api_ranking_mymodel_views.py` / `api_ranking_mymodel_resonances.py` を確認する |

この補正により、旧本文に残る旧pathを見つけても即renameしない。current修正対象は実ファイル一覧に存在するownerへ寄せる。

# 2026-05-09 差分追記: RN巨大画面分割 / 本番運用監視 current boundary

この版の最新基準面は `Cocolon_前提資料(51).zip` / `Cocolon_12(3).zip` / `mashos-api_4(10).zip` です。実ファイルのcoverage対象は `Cocolon` 200件、`mashos-api` 342件、合計542件です。

今回の実ファイルでは、RN巨大画面分割の Phase 0〜2 / 4〜9 と、本番運用監視の最小構成がcurrentへ入っています。分割は機能追加ではなく、既存route / API契約 / DB境界を維持したまま entry shell と submodule に責務を分ける保守性改善として読む。

| 構造 | entry shell / current owner | 読み方 |
|---|---|---|
| App root | `Cocolon/App.js` + `Cocolon/navigation/*` + `Cocolon/runtime/*` | `App.js` はprovider / NavigationContainer / 初期push接続を持つ薄い入口。root stack / tab / linking / notification routing は navigation配下を読む |
| Home / Input | `Cocolon/screens/InputScreen.js` + `Cocolon/screens/input/*` | InputScreenはentry shell。下書き、入力高さ、感情/カテゴリ/memo UI、Piece preview modal、startup modalをinput配下で読む |
| Nexus | `Cocolon/screens/NexusScreen.js` + `Cocolon/screens/nexus/*` | feed / emotion log / recommend / history / owner picker のUIとnormalizeをnexus配下で読む。API呼び出し境界は既存のまま |
| Analysis report viewer | `Cocolon/screens/AnalysisReportViewerScreen.js` + `Cocolon/screens/analysisReport/*` | report normalize、format、HTML/PDF export、chart、subscription gateをanalysisReport配下で読む |
| Analysis home | `Cocolon/screens/AnalysisScreen.js` + `Cocolon/screens/analysis/*` | route state、unread、report action、self-structure action、tutorial overlayをanalysis配下で読む |
| Account | `Cocolon/screens/AccountScreen.js` + `Cocolon/screens/account/*` | profile、follow、visibility、subscription、ID検索をaccount配下で読む。account delete ownerは引き続き `SettingsOtherScreen.js` |
| Piece home | `Cocolon/screens/PieceScreen.js` + `Cocolon/screens/piece/*` | Piece home action、tutorial create、recommend users、global summaryをpiece配下で読む |
| Piece library | `Cocolon/screens/PieceLibraryScreen.js` | Phase 3は今回未実装。PieceLibraryはまだentry shell単独の大きなownerとして読む |
| RN screen test | `Cocolon/tests/rn-screen-contracts.test.js` | 分割後moduleの存在とentry shell接続を検査する軽量screen contract test |
| 本番運用監視 | `Cocolon/lib/monitoring.js` + `mashos-api/ai/services/ai_inference/api_client_events.py` | 外部SDK追加なしで、RN側client event / API error / bootstrap/push/IAP errorを `/ops/client-events` へbest-effort送信し、backendでredact済みstructured logへ出す |

作業時は、旧画面pathが薄くなっていても削除対象とは見なさず、`App.js` / 各screenは navigation から参照されるentry shellとして扱う。DB physical name / public API route / navigation route名は今回の分割では変更しない。

# 2026-05-09 差分追記: EmlisAI multi-perspective observation current boundary

この版の最新基準面は `Cocolon_前提資料(54).zip` / `Cocolon_6(28).zip` / `mashos-api_6(8).zip` です。最新実ファイルのcoverage対象は `Cocolon` 200件、`mashos-api` 356件、合計556件です。

| 構造 | current owner | 読み方 |
|---|---|---|
| Emlisの観測 runtime | `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` | `render_emlis_ai_reply()` は `multi_perspective_observation.v1` のorchestrator。旧ObservationKernelの固定文経路、旧safe fallback、`input_feedback_text_templates` をEmlis観測本文として使わない |
| Evidence Ledger | `emlis_ai_evidence_ledger_service.py` | `current_input` から `EvidenceSpan` を作る。ここでは解釈文・表示文を作らない |
| 複数視点Observer | `emlis_ai_perspective_observers.py` / `emlis_ai_perspective_board.py` | 明示内容、感情、葛藤、圧迫、限界、自己認識、価値/強さ、相手モデル、安全境界を `PerspectiveReport` として分ける |
| 統合構造 | `emlis_ai_observation_integrator_service.py` | `PerspectiveBoard` を `ObservationGraph` へまとめる。本文生成はここでは行わない |
| 会話文生成 | `emlis_ai_conversation_composer_service.py` | `ObservationGraph` と `EvidenceSpan` から、ユーザーに向けた観測文を作る。設計上は固定文fallbackを置かない |
| 読解・根拠・テンプレGuard | `emlis_ai_listener_reader_judge.py` / `emlis_ai_grounding_judge.py` / `emlis_ai_template_echo_guard.py` | 出力文の理解可能性、原文根拠、旧文型・復唱類似を判定する |
| 表示停止Gate | `emlis_ai_display_gate.py` | `passed` 以外は `comment_text` を空にし、`observation_status` を `rejected` / `unavailable` / `safety_blocked` として扱う |
| RN表示制御 | `screens/input/useInputFeedbackModal.js` / `InputFeedbackReplyModal.js` / `InputScreen.js` | `observation_status` が存在し、`passed` でない場合はモーダルを開かない。空本文も表示しない |
| API互換 | `api_emotion_submit.py` / `emotion_submit_service.py` | `input_feedback.comment_text` は互換維持。ただしfail-closed時は空になり、API responseでは `input_feedback` 自体が省略されうる。詳細metaは `input_feedback.emlis_ai.observation_status` に置く |

作業時は、`Emlisからの返答` / `Emlisからの応答` というvisible旧名を見つけたら `Emlisの観測` に寄せる。ただし `input_feedback.comment_text`、`emlis_ai` meta、DB/API物理名は互換維持のため一括renameしない。

# 2026-05-10 差分追記: EmlisAI Phase8 LimitedComposer quality current boundary

この版の最新基準面は `Cocolon_前提資料(60).zip` / `Cocolon_8(6).zip` / `mashos-api_9(2).zip` です。最新実ファイルのcoverage対象は `Cocolon` 200件、`mashos-api` 374件、合計574件です。

Phase8は、`Emlisの観測` の起動条件変更ではなく、既に接続された B案 LimitedComposer の本文品質改善として読む。固定文テンプレや外部LLMを追加せず、EvidenceSpanから本文化可能な短い根拠句を作り、観測profileとsentence planを通して自然な短文へ寄せる。

| 構造 | current owner | 読み方 |
|---|---|---|
| LimitedComposer本文生成 | `mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_client.py` | `EmlisPhraseUnit` / `ObservationProfile` / `SentencePlan` を使い、scoped graph内の根拠だけを2〜4文へ組み立てる。外部AIは呼ばない |
| Phase8文品質Guard | `emlis_ai_limited_sentence_quality_guard.py` | 感情ラベル単独行、未完了断片、`がつながっています` / `同じ中にあります` 系の破綻表面を機械的に落とす |
| Scope Gate補正 | `emlis_ai_limited_observation_scope_service.py` | 関係性葛藤や実ユーザー型のように、根拠ある関係構造を `eligible` にできるよう補正する |
| Evidence / Observer補正 | `emlis_ai_evidence_ledger_service.py` / `emlis_ai_perspective_observers.py` | Phase8 profile判定に必要な原文根拠と観測claimを取り落とさないよう補正する |
| Template / Display Gate補正 | `emlis_ai_template_echo_guard.py` / `emlis_ai_display_gate.py` | Phase8 quality reportをDisplay traceへ残し、破綻文を `passed` にしない |
| Phase8回帰fixture | `ai/tests/fixtures/emlis_ai_phase8_cases.py` | 華恋提示6ケース＋実ユーザー入力1ケースの計7ケースを品質回帰fixtureとして保持する |
| Phase8回帰test | `ai/tests/test_emlis_ai_phase8_real_input_quality.py` | 正解文一致ではなく、must_keep構造・禁止表面・passed/rejected制御で検証する |

作業時は、Phase8を「EmlisAIが全入力を理解できるようになった」とは読まない。B案のまま、根拠がある範囲だけを自然な観測文へ整える段階として扱う。短く曖昧な入力は、引き続き非表示または浅い受け取りだけが許容範囲です。


# 2026-05-11 差分追記: 共通文章生成基盤の読み方

`mashos-api_15(2).zip` では、三大中核の文章出力を共通品質基盤で支える `cocolon_text_generation_core` が追加されています。これは中核の出力目的を統一する層ではなく、品質・根拠・安全だけを横断で見る層です。

| 中核 | 既存公開契約 | 共通基盤との関係 | 変更禁止境界 |
|---|---|---|---|
| EmlisAI | `input_feedback.comment_text` / `observation_status=passed` のみ表示 / 表示名 `Emlisの観測` | `EmlisObservationComposer` adapterで候補文を共通Coreへ通す | 表示名、route、DB、passed-only制御を変えない |
| Piece | `piece_text` / preview-publish同一性 / legacy名 `reflection`・`mymodel_qna` | `PieceComposer` adapterで問い・答えを分離し、過圧縮と根拠欠落を検査する | preview時本文をpublish時に再生成しない |
| Analysis | `content_json` / `standardReport` / `contentText` | `AnalysisComposer` adapterとvalidity gateで非診断・非断定を検査する | payload shape、DB物理名、routeを変えない |

共通Core作業では、`03_cocolon_naming_system.md`、`05_cocolon_rule_file_index.md`、`09_Cocolon_名称混在保管と構造境界_2026-05-10.md` を先に読む。DB physical name / public API route / response key / visible名は、この差分では変更されていません。

# 2026-05-12 差分追記: こころ天気 current boundary

この版の最新基準面は `Cocolon_前提資料(68).zip` / `Cocolon_6(29).zip` / `mashos-api_6(13).zip` です。実ファイルのcoverage対象は `Cocolon` 204件、`mashos-api` 419件、合計623件です。

| 構造 | current owner | 読み方 |
|---|---|---|
| 今のこころ天気 | `mashos-api/ai/services/ai_inference/kokoro_weather_service.py` / `api_analysis_reads.py` / `Cocolon/screens/analysisReport/KokoroWeatherCurrentCard.js` | `/analysis/home-summary` へ `current_weather` を additive 追加し、Analysisトップで今日0:00〜現在の観測を表示する。今日入力がない場合は「今日はまだ観測がありません」と「前回のこころ天気を見る」を表示する |
| レポートこころ天気 | `api_analysis_reports.py` / `Cocolon/screens/AnalysisReportViewerScreen.js` / `KokoroWeatherForecastStrip.js` / `KokoroWeatherDetailModal.js` / `kokoroWeatherFormatters.js` | `content_json.kokoroWeather` を additive 追加し、日/週/月レポートに天気図風の横並びUIと時間帯別Modalを出す。旧感情分析レポートは表示・取得・未読対象から外す |
| 表示名・文言 | `AnalysisContentFirstScreen.js` / `AnalysisEmotionScreen.js` / `AnalysisReportHistoryScreen.js` / `guide/*` / `tutorial/*` / `iapRuntimeCatalog.js` / `subscription_bootstrap_store.py` | ユーザー向け表示を `こころ天気（日）` / `こころ天気（週）` / `こころ天気（月）` に寄せる。内部キー `daily` / `weekly` / `monthly` は維持する |
| QA | `mashos-api/ai/tests/test_kokoro_weather_*.py` / `Cocolon/tests/rn-screen-contracts.test.js` | 未来予測・注意報・良悪判定になっていないこと、Free/Plus/Premium境界、旧感情分析レポート非表示、自己分析非対象を回帰testで固定する |

作業時は、こころ天気を **感情分析の表現層・要約層** として読みます。自己分析 / 自己構造はこころ天気化しません。DB physical name、public route、`daily` / `weekly` / `monthly` 内部キーは変更しません。

# 2026-05-13 差分追記: こころ天気 旧感情分析レポート非表示 boundary

このsectionの基準面は `Cocolon_前提資料(71).zip` / `Cocolon_4(22).zip` / `mashos-api_4(16).zip` です。こころ天気旧レポート非表示差分時点のcoverage対象は `Cocolon` 204件、`mashos-api` 419件、合計623件でした。最新coverageは冒頭summaryと `2026-05-13 差分追記: わたしマップ実装反映` を優先します。

| 構造 | current owner | 読み方 |
|---|---|---|
| こころ天気正式表示対象 | `api_analysis_reports.py` / `kokoroWeatherFormatters.js` | `report_type` が `daily` / `weekly` / `monthly` で、`content_json.kokoroWeather.version == "kokoro.weather.v1"` かつ `summary` または `items` があるものだけを表示対象にする |
| ready / detail filter | `api_analysis_reports.py` | `/analysis/reports/ready` と `/analysis/reports/{id}` は旧感情分析レポートを返さない。detail直指定は404にする |
| weekly-days / unread filter | `api_analysis_reads.py` / `api_report_reads.py` | 旧週レポートの `days` 補助表示を使わず、旧レポートで未読バッジを立てない |
| frontend cache / fail-closed | `useAnalysisReportActions.js` / `AnalysisReportHistoryScreen.js` / `AnalysisReportViewerScreen.js` / `accountLocalCleanup.js` | latest cacheは `cocolon:kokoroWeatherLatestReport:v1` を使い、旧cacheは読まない。旧レポートstateが入っても旧本文を表示しない |
| tests / fixture | `test_analysis_report_kokoro_weather.py` / `test_publish_governance.py` / `test_contract_snapshots_phase6e.py` / `rn-screen-contracts.test.js` | helper、ready、detail、weekly-days、unread、cache namespace、history / viewer guardを固定する |

作業時は、旧感情分析レポートをDBから物理削除したとは読まない。DB physical name、public route、`daily` / `weekly` / `monthly` 内部キーは維持し、ユーザー可視領域・取得対象・未読対象だけをこころ天気正式表示対象へ絞る。

## 2026-05-13 差分追記: わたしマップ実装反映

2026-05-13時点の実ファイル基準面を `Cocolon_8(7).zip` / `mashos-api_8(10).zip` に更新していた。確認した current file count は `Cocolon=214`、`mashos-api=424`、合計 `638`。旧基準面 `Cocolon(155).zip` / `mashos-api(70).zip` からは Cocolon 側で 10 件追加・28 件変更、backend 側で 5 件追加・11 件変更が見えている。

今回の差分は、自己分析を visible / payload / UI 表現として `わたしマップ` に寄せる実装である。内部 route / DB physical name / report family は維持する。`/self-structure/*`、`myprofile_reports`、`report_mode`、`selfStructureDeepVisual` は互換境界として残し、ユーザー向け表示では `今のわたしマップ` / `役割スイッチ` / `よく通るルート` / `迷いやすい分かれ道` / `まだ地図にない場所` / `詳しい自己分析レポート` を使う。

最新実ファイルでは `Cocolon/components/selfStructure/watashiMapAccessPolicy.js` が存在し、`SelfStructureReportHistoryScreen.js` / `SelfStructureReportViewerScreen.js` の import path と一致している。root `Cocolon/components/watashiMapAccessPolicy.js` も同内容で残るため、互換copyとして扱い、画面側の参照は `components/selfStructure` 側を正とする。

# 2026-05-15 差分追記: EmlisAI A案到達 Step15-20 current boundary

この差分は、`Cocolon_7(10).zip` / `mashos-api_7(13).zip` を最新実ファイルとして確認した結果を、前提資料へ追記するものです。EmlisAIのA案到達工程は、ユーザー表示文を直接増やす工程ではなく、developer / QA meta、判定、rollout、長期品質境界を増やす工程として読む。

| Step | current owner | 読み方 |
|---|---|---|
| Step15 共通Core安定化 | `cocolon_text_generation_core/stabilization.py`, `types.py`, `adapters/emlis_observation_composer.py` | `PhraseUnit` / `SentencePlan` / `TextGenerationResult` / Guard結果 / `used_evidence_span_ids` / `quality_flags` の共通形を確認する。Emlisの出力目的はEmlis側に残す |
| Step16 段階リリース計測 | `emlis_ai_rollout_metrics_service.py`, `emlis_ai_limited_release_service.py`, `emlis_ai_reply_service.py` | `attempted` / `passed` / `rejected` / `unavailable` / `safety_blocked` / `primary_reason` / `coverage_group` / `composer_model` を集計する |
| Step17 広い入力fixture | `mashos-api/ai/tests/fixtures/emlis_ai_step17_broad_input_cases.py` | 生活・体調・人間関係・学習・仕事・長文・履歴・cross coreを、正解文一致ではなく構造で固定する |
| Step18 A-P0移行判定 | `emlis_ai_ap0_migration_decision_service.py` | `coverage matrix` / `rollout metrics` / `diagnostic_summary` / Guard結果から、A-1へ進むか該当Stepへ戻すかを判定する |
| Step19 A案相当導入 | `emlis_ai_a_plan_equivalent_composer_service.py`, `emlis_ai_composer_client_registry.py`, `emlis_ai_limited_composer_client.py` | A-P0がGreenでrolloutが許可された場合だけ `cocolon_emlis_observation_composer.a1.v1` へpromoteする。B案Gate、scoped graph、fail-closed、passed-onlyは維持する |
| Step20 長期品質 | `emlis_ai_long_term_quality_service.py` | 過去出力類似、文型反復、履歴/cross coreの過剰補完、距離感driftをQA metaとして見る。履歴は根拠であり、本心補完材料ではない |

`Cocolon/lib/analysisHomeSummaryRefreshSignal.js` は最新実ファイルに存在する active signal です。Input保存後にAnalysis home summaryをbest-effortで更新する境界として読み、EmlisAIの表示契約とは混同しません。

禁止: Step15-20を理由に、`input_feedback.comment_text`、`observation_status`、`Emlisの観測` の表示条件、DB physical name、public API route、RN導線、Piece / Analysis の出力目的を変更しない。

# 2026-05-15 差分追記: EmlisAI 限定Composer拡張 Step0-11 current boundary

この差分は、`Cocolon_12(4).zip` / `mashos-api_12(4).zip` を最新実ファイルとして確認した結果を、前提資料へ追記するものです。Cocolon側に追加・削除・変更はありません。mashos-api側では 16件追加・16件変更があり、EmlisAIの限定Composerを「安全に落とす土台」から「根拠を守って通せる土台」へ引き上げるための meta / Guard / test が追加されています。

| Step | current owner | 読み方 |
|---|---|---|
| Step0 baseline化 | `emlis_ai_limited_composer_extension_baseline.py` / `emlis_ai_reply_service.py` | `limited_composer_extension_baseline` / `step0_baseline` をmetaに残す。DB/API/RN表示名はrenameしない。 |
| Step1 接続状態の可視化 | `.env` / `emlis_ai_composer_client_registry.py` / `emlis_ai_reply_service.py` | `composer_client_not_connected` と、接続後のComposer/Gate rejectionを分けて診断する。 |
| Step2 diagnostic_summary拡張 | `emlis_ai_limited_composer_extension_baseline.py` / `emlis_ai_display_gate.py` | `failed_stage` / `coverage_group` / `binding_present` / `binding_missing` / `binding_count` をraw入力なしで返す。 |
| Step3 SentenceBinding型追加 | `cocolon_text_generation_core/types.py` / `emlis_ai_limited_composer_client.py` | body文ごとに `sentence_id` / `used_evidence_span_ids` / `used_phrase_unit_ids` / `relation_type` を持たせる。 |
| Step4 PhraseUnit材料改善 | `emlis_ai_limited_sentence_quality_guard.py` / `emlis_ai_phrase_shaping_service.py` | 未完了断片、助詞残り、感情ラベル単独、長すぎる原文貼り付けを材料段階で除外する。 |
| Step5 relation taxonomy追加 | `emlis_ai_limited_relation_taxonomy.py` | `contrast` / `coexistence` / `pressure` / `recovery` / `approach_avoidance` 等をrelation typeとして追跡する。 |
| Step6 binding-aware Grounding | `emlis_ai_grounding_judge.py` / `cocolon_text_generation_core/guards/grounding.py` | 表面一致だけでなく、binding declared evidence / phrase / relationをGroundingが読む。 |
| Step7 Gateへのbinding反映 | `emlis_ai_display_gate.py` / `cocolon_text_generation_core/adapters/emlis_observation_composer.py` | reader / grounding / template / display traceへ `binding_used` などを残す。 |
| Step8 限定Surface Realizer安定化 | `emlis_ai_limited_surface_realizer.py` / `emlis_ai_limited_composer_client.py` | opener / particle / predicate / tail variationをrelationごとに選ぶ。固定完成文は追加しない。 |
| Step9 scorecard harness | `emlis_ai_coverage_matrix_service.py` | coverage_group別の passed / rejected / unavailable と binding coverage を数値化する。 |
| Step10 E2E表示契約 | `emlis_ai_limited_composer_e2e_contract.py` | `comment_text` が `passed` 時のみ表示されるcontractをmetaとtestで固定する。 |
| Step11 Exit Gate | `emlis_ai_limited_composer_extension_exit_gate.py` | SentenceBinding、binding-aware Grounding、relation taxonomy、scorecard、passed-only契約が揃ったかを完全Composer初期版の入口条件として判定する。 |

禁止: 限定Composer拡張 Step0-11 を理由に、外部AIレンタル、ローカルLLM、固定完成文テンプレ、入力専用テンプレ、Display Gate / Reader / Grounding の緩和、DB physical rename、public route rename、response key rename、RN表示契約変更を行わない。

# 2026-05-16 差分追記: EmlisAI 完全Composer初期版 Commit1-13 current boundary

この差分は、旧基準 `Cocolon_15(2).zip` / `mashos-api_15(3).zip` の履歴として保管します。Cocolon側は file count 216 のまま、`tests/rn-screen-contracts.test.js` にComplete Composer初期版のRN contract regressionが追加され、mashos-api側は file count 484 としてComplete Composer初期版のservice / testが追加されていました。最新正本は後続のE2E表示開通 Step0-9 sectionを優先します。

| Step / Commit | current owner | 読み方 |
|---|---|---|
| Commit1 AP0 decision report / 呼称meta | `emlis_ai_complete_composer_initial_meta.py`, `emlis_ai_ap0_migration_decision_service.py`, `emlis_ai_composer_client_registry.py`, `emlis_ai_a_plan_equivalent_composer_service.py`, `emlis_ai_reply_service.py` | 旧 `a_plan_equivalent` / `A-1` を資料・meta上は完全Composer初期版として読み替える。AP0 decision report はadditive metaであり、DB/API/RN契約は変えない。 |
| Commit2 Complete内部型 | `emlis_ai_complete_composer_types.py` | `CompleteComposerCandidate`、`CompleteSentencePlanV2`、`RepairTrace` を内部型として追加。public response shapeへ直接出さない。 |
| Commit3 Material service | `emlis_ai_complete_material_service.py` | EvidenceSpan / PhraseUnit-like rowから本文化可能な材料だけを作る。未完了断片・助詞残り・感情ラベル単独・根拠不足材料はSentencePlan前に落とす。 |
| Commit4 FocusSelector / CoveragePlan | `emlis_ai_complete_focus_selector.py` | short_daily / long_meaning_arc / conflict / recovery / pressure / relationship / history_cross_core から本文に出す観測核を選ぶ。全文要約にはしない。 |
| Commit5 RelationGraph 2.0 bridge | `emlis_ai_complete_relation_graph_service.py` | 既存 relation taxonomy をComplete側ObservationGraphへ橋渡しし、`relation_type` を本文生成前の制約として保持する。 |
| Commit6 SentencePlan 2.0 | `emlis_ai_complete_sentence_planner.py` | 2〜5文の文数、文順、must_include、optional、relation表現、closing方針、repair policyを決める。 |
| Commit7 Surface Realizer 2.0 | `emlis_ai_complete_surface_realizer.py` | 完成文定数ではなく、主語方針・接続・助詞・述語・語尾・距離感・variation policyで自然文を組む。 |
| Commit8 Binding-aware Grounding強化 | `emlis_ai_complete_grounding_binding.py`, `emlis_ai_complete_grounding_service.py`, `emlis_ai_grounding_judge.py` | `sentence_id` / `used_evidence_span_ids` / `used_phrase_unit_ids` / `relation_type` をGrounding判定へ渡す。overclaimはbindingがあってもreject優先。 |
| Commit9 Self-Repair Loop | `emlis_ai_complete_self_repair_service.py` | Gate reasonに応じ、文数縮約・関係明示・根拠差し替え・語尾変化・echo削減を最大2回だけ行う。新規意味追加は禁止。 |
| Commit10 CompleteComposerClient統合 | `emlis_ai_complete_composer_client.py`, `emlis_ai_composer_client_registry.py` | AP0 green、rollout許可、no external AI、no fallback、used evidenceありの場合だけComplete初期版clientを解決する。 |
| Commit11 Reply diagnostics統合 | `emlis_ai_complete_reply_diagnostics_service.py`, `emlis_ai_reply_service.py` | complete meta、repair trace、scorecard eventをdiagnostic_summary / phase_gate / metaへadditive接続する。`comment_text`の既存契約は変えない。 |
| Commit12 Scorecard / fixture拡張 | `emlis_ai_complete_scorecard_service.py`, `emlis_ai_reply_service.py` | coverage group別の表示到達率、binding、読まれた感、安全性、非テンプレ性を集計する。fixture suiteにraw user inputや期待本文は置かない。 |
| Commit13 RN contract regression | `Cocolon/tests/rn-screen-contracts.test.js` | Complete初期版metaが入っても、RNはpublic `observation_status=passed` かつ `comment_text` 非空の場合だけモーダルpayloadを作る。表示名は `Emlisの観測` のまま。 |

境界維持:
- DB physical name、既存API route、public response key、RN表示名 `Emlisの観測` は変更しない。
- `input_feedback.comment_text` は `observation_status=passed` かつ本文ありの場合だけ表示する。
- 外部AIレンタル、ローカルLLM、固定完成文テンプレ、入力専用テンプレは追加しない。
- raw user input を改善資料として要求しない。改善は diagnostic_summary / Gate reason / coverage / binding / repair trace / scorecard event で行う。
- これは完全Composer商品品質版ではなく、限定Composerの安全境界を土台にした完全Composer初期版のAlpha実装として読む。


# 2026-05-16 差分追記: EmlisAI 完全Composer初期版 E2E表示開通 Step0-9 current boundary

この差分は、`Cocolon_10(7).zip` / `mashos-api_10(10).zip` を最新実ファイルとして確認した結果を、前提資料へ差分追記するものです。Cocolon側のfile countは `216` のまま、mashos-api側は `489` となり、完全Composer初期版の通常表示ルートを商品品質版へ進む正規工程として開通するための Entry AP0 / diagnostic / resolver / Gate / scorecard / fixture QA meta が追加されています。

| Step | current owner | 読み方 |
|---|---|---|
| Step0 baseline確認 | `test_emlis_ai_complete_initial_entry_ap0.py` | Entry AP0未注入では complete_initial が fail-closed で閉じることを固定する。 |
| Step1 Entry AP0 helper | `emlis_ai_ap0_migration_decision_service.py` | `build_complete_initial_entry_ap0_decision()` を追加し、registry前に使う入口AP0だけを生成する。Step18 full AP0の代替ではない。 |
| Step2 pre-generation diagnostic seed | `emlis_ai_reply_service.py`, `test_emlis_ai_complete_initial_entry_route.py` | source / evidence / scope / rollout 後、resolver前に Entry AP0 材料とpreviewを diagnostic に残す。 |
| Step3 resolver注入 | `emlis_ai_reply_service.py` | `resolve_emlis_ai_composer_client(..., ap0_decision=entry_ap0_decision)` へ接続し、AP0 green + rollout allowed の時だけ client を解決する。 |
| Step4 resolution meta固定 | `emlis_ai_reply_service.py` | `composer_client_resolution` / `complete_initial_gate` / rejection reason を diagnostic_summary へadditiveに残す。 |
| Step5 candidate生成経路確認 | `emlis_ai_reply_service.py` | CompleteComposerClient.generate() 後も Reader / Grounding / Template / Display Gate を維持する。non-passed の `comment_text` は空のまま。 |
| Step6 Final AP0 / scorecard接続 | `emlis_ai_reply_service.py` | 実行後の `step18_ap0_migration_decision` と scorecard_event を meta に接続し、次段階の改善対象を raw入力なしで見える化する。 |
| Step7 integration test | `test_emlis_ai_complete_initial_step7_integration.py` | AP0 red / rollout red / AP0 green + rollout green / Gate rejected / Gate passed をE2Eで固定する。 |
| Step8 RN contract regression | `Cocolon/tests/rn-screen-contracts.test.js` | Complete metaがgreenでも、public `observation_status=passed` かつ `comment_text` 非空でなければRNは表示しない。 |
| Step9 fixture / QA run | `emlis_ai_complete_initial_fixture_qa_service.py`, `test_emlis_ai_complete_initial_step9_fixture_qa.py` | eligible fixtureで表示到達率、candidate生成率、binding pass、Gate reason、非テンプレ性、安全性を集計し、商品品質版scorecard seedへ接続する。 |

読み方:
- Step0-9 は、完全Composer商品品質版を前倒しする工程ではなく、完全Composer初期版を正しい順番でE2E表示ルートへ接続する工程。
- Entry AP0 が green でも、Reader / Grounding / Template / Display Gate で落ちた場合は表示しない。
- Step9 は fixture / QA meta と product scorecard seed を作るだけで、`comment_text` を直接書かない。
- DB physical name、public API route、既存response key、RN visible名 `Emlisの観測`、passed-only表示契約は変更しない。

# 2026-05-16 差分追記: EmlisAI 商品品質版接続 Step0-7 current boundary

この版の最新基準面は `Cocolon_前提資料(90).zip` / `Cocolon_8(11).zip` / `mashos-api_8(16).zip` です。Cocolon側は `216` 件のまま変更なし、mashos-api側は `504` 件、合計 `720` 件をcurrent coverage対象として読む。

| Step | current owner | 読み方 |
|---|---|---|
| Step0 binding_used契約整理 | `emlis_ai_display_gate.py`, `emlis_ai_reply_service.py`, `test_emlis_ai_gate_binding_contract_v2.py` | `binding_used` を「bindingが存在する」ではなく「Gate判断で実際に使った」として読む。Reader / Templateは原則false、Grounding / Display / Scorecardはbinding-aware時にtrueになり得る。 |
| Step1 coverage suite拡張 | `emlis_ai_complete_scorecard_service.py`, `emlis_ai_complete_focus_selector.py`, `emlis_ai_complete_sentence_planner.py`, `test_emlis_ai_complete_product_quality_coverage.py` | `short_daily` / `long_meaning_arc` / `conflict` / `recovery` / `pressure` / `desire_fear` / `relationship` をeligible母集団として構造化する。 |
| Step2 Grounding強化 | `emlis_ai_complete_grounding_binding.py`, `emlis_ai_complete_grounding_service.py`, `emlis_ai_grounding_judge.py`, `test_emlis_ai_complete_grounding_relation_binding_v2.py` | sentence_id単位で Evidence / PhraseUnit / relation の矛盾を見て、unsupported / relation_not_expressed / phrase_unit_missing をrepairへ渡す。 |
| Step3 Surface variation強化 | `emlis_ai_complete_surface_realizer.py`, `emlis_ai_template_echo_guard.py`, `test_emlis_ai_complete_surface_variation_v2.py` | 完成文増殖ではなく、surface parts / connector / ending / surface_signatureでテンプレ臭・raw echo・same-endingを検出する。 |
| Step4 Self-Repair強化 | `emlis_ai_complete_self_repair_service.py`, `test_emlis_ai_complete_self_repair_product_quality_v2.py` | Gate reasonごとに許可operationを分け、`meaning_added=false`、`gate_relaxed=false`、evidence/relation preservedをtraceへ残す。 |
| Step5 Tone Engine | `emlis_ai_complete_tone_policy.py`, `emlis_ai_complete_surface_realizer.py`, `test_emlis_ai_complete_tone_engine_v2.py` | Toneを後付け装飾ではなく SentencePlan -> Surface Realizer の制約として扱い、診断調・命令調・過剰慰め・一般論慰めをGuardする。 |
| Step6 Scorecard / Blind QA | `emlis_ai_complete_product_quality_scorecard_service.py`, `test_emlis_ai_complete_product_quality_scorecard*.py` | machine metrics と Blind QA を分離し、読まれた感はBlind QA由来としてProduct Gate判断材料へ接続する。 |
| Step7 Release ladder接続 | `emlis_ai_complete_release_ladder_service.py`, `test_emlis_ai_complete_release_ladder*.py` | `internal -> limited -> broader_beta -> product_gate` の判定をStep6 scorecardから作る。ただしpublic release適用や商品品質版到達宣言はしない。 |

禁止: Gate緩和、固定文fallback、外部AI/ローカルLLM、DB/API/RN契約rename、raw入力本文の改善資料化。RN表示は引き続き `observation_status=passed` かつ `comment_text` 非空の場合のみ。

# 2026-05-17 差分追記: EmlisAI positive_recovery relation_not_expressed Step0-7 current boundary

この差分は、`Cocolon_9(8).zip` / `mashos-api_9(8).zip` を最新実ファイルとして確認した結果を、前提資料へ追記するものです。今回の修正は、`Emlisの観測` が非表示だった positive_recovery ケースの `stage=reader / primary_reason=relation_not_expressed` を、Gate緩和ではなく Reader / Surface / Self-Repair の relation surface contract 整合で扱う境界です。

| 領域 | current owner | 読み方 |
|---|---|---|
| relation surface contract | `mashos-api/ai/services/ai_inference/emlis_ai_relation_surface_contract.py` | Reader / Surface / Self-Repair が共有する relation cue 契約。`emlis.relation_surface_contract.v1`、generic cue、recovery cue、marker phraseを持つ。`関係` 単独ではpassさせない。 |
| Reader relation detection | `emlis_ai_listener_reader_judge.py` | 従来の `_RELATION_RE` に加え、contract detectionを使う。recovery expected時はgeneric cueだけでは通さず、本文中に明示relation cueがある場合だけ `relation_not_expressed` を解消する。 |
| Self-Repair recovery marker | `emlis_ai_complete_self_repair_service.py` / `emlis_ai_complete_composer_types.py` | `relation_not_expressed` repair時、declared relationの範囲で recovery marker を追加する。`meaning_added=false` / `relation_ids_preserved=true` / `gate_relaxed=false` をtraceへ残す。 |
| Surface recovery line | `emlis_ai_complete_surface_realizer.py` | recovery relation line / connector / predicate / surface_signature を relation surface contract と整合する。完成文fallbackではなくsurface partsとして扱う。 |
| diagnostic connection | `emlis_ai_complete_reply_diagnostics_service.py` / `emlis_ai_reply_service.py` / `emlis_ai_display_gate.py` / `emlis_ai_types.py` | `reader_relation_signal_*` と `self_repair_relation_marker_*` を `diagnostic_summary` / gate traceへ additive 接続する。raw input / comment_text本文は入れない。 |
| E2E / regression | `test_emlis_ai_complete_product_quality_positive_recovery_e2e.py` ほか | positive_recoveryで Reader `relation_not_expressed` が消えること、Gateが緩まないこと、relation cueがない3文候補は引き続きrejectedになることを固定する。 |
| 一時ログ整理 | `emotion_submit_service.py` / `Cocolon/screens/InputScreen.js` | backendの `emlis_observation_result` はenv flag配下へ整理し、RNの一時debug console logは削除済み。通常ログにraw inputやpublic comment_text本文を出さない。 |

守る境界:
- RN表示条件は変更しない。`observation_status=passed` かつ `comment_text` 非空だけ `Emlisの観測` を表示する。
- Readerの `relation_not_expressed` を削除して表示率を上げない。
- Self-Repairで入力にない prior load / cause / diagnosis を足さない。
- 通知400（`__global_emotion_notifications__` のUUID syntax error）は今回のEmlis relation修正とは別件として扱う。


# 2026-05-17 差分追記: EmlisAI Observation Diagnostic Lockdown Step0-8 current boundary

この差分は、`Cocolon_9(9).zip` / `mashos-api_9(9).zip` を最新実ファイルとして確認した結果を、前提資料へ追記するものです。目的は、`/emotion/submit` が200でも `Emlisの観測` が出ないケースについて、raw inputやpublic `comment_text` 本文を出さずに、backend / RN のどの層で落ちたかをsubmit単位で確定することです。

| Step | current owner | 読み方 |
|---|---|---|
| Step1 backend helper | `emlis_ai_observation_diagnostic_lockdown.py` | 既存 `input_feedback_meta` / `diagnostic_summary` / complete meta を正規化し、`classification` を返すmeta-only helper。 |
| Step2 submit接続 | `emotion_submit_service.py` | `input_feedback_comment` / `input_feedback_meta` 確定後に、opt-in時だけ `emlis_observation_diagnostic_lockdown {json}` を1本出す。success / exception 両方で扱う。 |
| Step3 reply meta補強 | `emlis_ai_reply_service.py`, `emlis_ai_complete_reply_diagnostics_service.py` | `candidate_generated_before_display_gate`、gate extractability、repair extractability をadditiveに残す。public response shapeは変えない。 |
| Step4 RN診断 | `Cocolon/screens/input/inputFeedbackObservationDiagnostics.js`, `Cocolon/screens/InputScreen.js` | `openInputFeedbackModal` の戻り値確定後に、opt-in時だけ `emlis_observation_frontend_result {json}` を出す。 |
| Step5 backend tests | `test_emlis_ai_observation_diagnostic_backend_step5.py` ほか | helper分類、log出力、fail-closed、no raw input、Display contractを固定する。 |
| Step6 RN tests | `Cocolon/tests/rn-screen-contracts.test.js` | RN診断helperがpublic statusを強制 `passed` にしないこと、本文を出さないことを固定する。 |
| Step7 11:35/11:36比較 | `emlis_ai_observation_diagnostic_compare.py`, `tools/emlis_observation_compare_1135_1136.py` | backend/RN診断行を `trace_id` / `emotion_log_id` でjoinし、最初の差分層を出す。 |
| Step8 分岐固定 | `emlis_ai_observation_diagnostic_branching.py`, `tools/emlis_observation_route_next_step.py` | `pre_connection / candidate / reader / grounding / template / display / frontend / scorecard / diagnostic` の分岐表に従い、次に触る層を1系統に固定する。 |

ログprefixとenv:
- backend: `EMLIS_AI_OBSERVATION_DIAGNOSTIC_LOCKDOWN_LOG_ENABLED` または `COCOLON_EMLIS_OBSERVATION_DIAGNOSTIC_LOCKDOWN_LOG_ENABLED` が有効な時だけ、`emlis_observation_diagnostic_lockdown` を出す。
- RN: `EXPO_PUBLIC_EMLIS_OBSERVATION_DIAGNOSTIC_LOG` または `EXPO_PUBLIC_COCOLON_EMLIS_OBSERVATION_DIAGNOSTIC_LOG` が有効な時だけ、`emlis_observation_frontend_result` を出す。

守る境界:
- `input_feedback.comment_text` は public `observation_status=passed` かつ本文ありの場合だけ表示する。
- raw input、memo、current_input、public `comment_text` 本文を診断log / compare / branchへ入れない。
- backendだけ、RNだけで結論を出さない。`trace_id` / `emotion_log_id` でjoinする。
- classificationが `unclassified_non_display` / `unknown_diagnostic_missing` の場合は原因修正へ進まず、diagnostic enrichmentへ戻す。
- Gate緩和、固定文fallback、外部AI / local LLM、DB/API/RN契約renameは追加しない。

確認済み:
- backend diagnostic Step1-8対象: `47 passed, 1 warning`
- RN screen contract: `22 passed`

# 2026-05-17 差分追記: EmlisAI Reader Relation Surface Step0-8 current boundary

この差分は、`Cocolon_前提資料(96).zip` と最新実ファイル `Cocolon_9(10).zip` / `mashos-api_9(10).zip` を確認した結果を、前提資料へ差分追記するものです。Cocolon側のsource file countは `217` のまま、mashos-api側source file countは `535`、合計 `752` として読む。今回の修正対象は backend の EmlisAI Reader / relation surface / limited A1 repair であり、RN表示条件・DB physical name・public routeは変更しません。

| 層 | owner | current boundary |
|---|---|---|
| Reader宛名契約 | `emlis_ai_listener_reader_judge.py` | `さん` 固定ではなく `さん/様/くん/君/ちゃん/氏` を greeting policy と同じ範囲で許容する。敬称なしを広く通す緩和ではない。 |
| Reader relation期待型 | `emlis_ai_reply_service.py` | `composer_meta` / `sentence_bindings` から surface relation type を抽出し、edge id を除外して Reader へ渡す。 |
| limited/A1 repair | `emlis_ai_limited_composer_client.py` | `previous_rejection_reasons` が `addressee_not_clear` / `relation_not_expressed` の場合だけ、宛名行・relation marker を最小repairする。 |
| core hook | `emlis_ai_limited_composer_client.py` | repair後も `_core_checked_response` の core evaluation / Gate を必ず通す。通らなければ表示しない。 |
| 診断meta | `emlis_ai_complete_reply_diagnostics_service.py`, `emlis_ai_observation_diagnostic_lockdown.py`, `emlis_ai_reply_service.py` | `limited_reader_repair_attempted/applied`、marker key、relation type を本文なしで出す。 |
| Step8 test support | `tests/conftest.py`, Reader repair系test群 | EmlisAI関連全体 `531 passed, 1 warning` の実装確認結果を現状構造として読む。 |

禁止: Gate緩和、固定fallback文、外部AI/local LLM、raw入力本文の診断log混入、DB/API/RN契約rename、RN modal表示条件変更。

# 2026-05-18 差分追記: EmlisAI ProductGate Measurement Step0-10 current boundary

この差分は、`Cocolon_前提資料(98).zip` と最新実ファイル `Cocolon_11(3).zip` / `mashos-api_11(6).zip` を確認した結果を、前提資料へ差分追記するものです。Cocolon側のsource file countは `217` のまま、mashos-api側source file countは `543`、合計 `760` として読む。今回の修正対象は backend / local tool の EmlisAI ProductGate Measurement 接続であり、RN表示条件・DB physical name・public routeは変更しません。

| 層 | owner | current boundary |
|---|---|---|
| contract inventory | `emlis_ai_complete_product_quality_measurement_contract_inventory.py` | Step0-10の対象file・非対象contract・Exit Gate非release境界を固定する。 |
| diagnostic join | `emlis_ai_observation_diagnostic_compare.py` | backend passed と RN表示確認を分け、frontend未join / modal falseはdisplay countへ入れない。 |
| measurement connection | `emlis_ai_complete_product_quality_measurement_connection.py` | joined rowをscorecard eventへ変換し、scorecard / release ladder / coverage / Blind QA / routing / Exit Gateを接続する。 |
| local tool | `emlis_observation_product_quality_measurement.py` | diagnostic log行からJSON/Markdownのmeta-only reportを出す。 |
| regression / Exit Gate | `test_emlis_ai_complete_product_quality_measurement_regression_step9.py`, `test_emlis_ai_complete_product_quality_measurement_exit_gate_step10.py` | public contract、counting semantics、RN期待値、four fixture、Exit Gate非releaseを固定する。 |

禁止: backend passedだけで `passed_display_count` に入れる、diagnostic missingを原因修正へ進める、Blind QAなしでread feelingを埋める、raw input / public `comment_text` 本文をreportへ入れる、Exit Gate readyをProduct Gate達成やpublic release適用にする。

# 2026-05-20 差分追記: EmlisAI Runtime Surface Quality Step0-12 current boundary

この差分は、`Cocolon_前提資料(101).zip` と最新実ファイル `Cocolon_13(2).zip` / `mashos-api_13(5).zip` を確認した結果を、前提資料へ差分追記するものです。Cocolon側のsource file countは `217` のまま、mashos-api側source file countは `568`、合計 `785` として読む。今回の修正対象は backend の EmlisAI Runtime Surface Quality Step0-12 であり、RN表示条件・DB physical name・public routeは変更しません。

| 差分区分 | 内容 |
|---|---|
| Cocolon | source追加・変更なし。RN `Emlisの観測` passed-only contractを保持する。 |
| mashos-api | `25` files追加、`16` files変更。ProductGate Measurement後の表示文品質測定・分岐・出口を追加する。 |
| Product Gate扱い | Step12 Exit Gateはhandoff-only。Product Gate達成、public release適用、完全Composer商品品質版完成ではない。 |

| Step | owner | current boundary |
|---|---|---|
| Step0 Baseline / Contract Inventory | `emlis_ai_runtime_surface_quality_contract_inventory.py` | Post ProductGate Measurement のRuntime Surface Quality工程をmeta-onlyで開始し、RN/API/DB/Gate/public release非対象を固定する。 |
| Step1 Runtime Surface Source Lock | `emlis_ai_runtime_surface_source_lock.py`, `emlis_ai_reply_service.py` | 実表示文が complete_initial / limited / a1_equivalent / unavailable のどのruntime由来かを本文なしmetaで固定する。 |
| Step2 Surface Signature Measurement | `emlis_ai_complete_surface_quality_signature.py` | line role、connector、predicate、ending、grammar warning、signature hashを作り、同型骨格を本文なしで測定する。 |
| Step3 Scorecard Surface Metrics接続 | `emlis_ai_complete_product_quality_scorecard_service.py`, `emlis_ai_complete_product_quality_measurement_connection.py` | surface_signature / surface_major / grammar_warning をscorecard eventへ接続し、template majorをrelease blockerへ渡す。 |
| Step4 Coverage Runtime Baseline | `emlis_ai_runtime_surface_coverage_baseline.py`, `emlis_ai_coverage_matrix_service.py` | 7coverage group別にdisplay / binding / surface / grammarの詰まりを集計し、missingを `coverage_group_missing` として残す。 |
| Step5 Branch Resolver | `emlis_ai_complete_surface_quality_branching.py` | runtime / grounding / grammar / surface / tone / Blind QAの次branchを優先順位で決め、原因未分類のまま修正へ進まない。 |
| Step6 Complete Runtime Activation Branch | `emlis_ai_runtime_surface_complete_activation_branch.py` | Step5がcomplete_runtime_activationを選んだ場合、AP0 / rollout / registry / source-lock alignmentを確認し、Complete由来と誤分類しない。 |
| Step7 Surface Realizer 2.1 Anti-Template | `emlis_ai_complete_surface_realizer_anti_template.py`, `emlis_ai_complete_surface_realizer.py`, `emlis_ai_complete_sentence_planner.py` | 固定完成文を増やさず、opening / connector / predicate / ending / relation lineの偏りを分散制御する。 |
| Step8 PhraseUnit Grammar Normalizer | `emlis_ai_phrase_unit_grammar_normalizer.py`, `emlis_ai_complete_material_service.py`, `emlis_ai_phrase_shaping_service.py` | `離れこと` 系、不自然な名詞化、助詞残り、未完了句を材料段階でdrop / rephrase / deferし、根拠なし補完を足さない。 |
| Step9 Tone Engine 2.1 | `emlis_ai_runtime_surface_tone_engine_2_1.py`, `emlis_ai_complete_tone_policy.py`, `emlis_ai_reply_final_review_service.py` | 診断化、命令、慰めすぎ、一般論化、距離感崩れ、ending同型反復を検出し、read feelingはBlind QAへ残す。 |
| Step10 Surface-aware Self-Repair | `emlis_ai_runtime_surface_self_repair.py`, `emlis_ai_complete_self_repair_service.py` | surface reason / grammar warning / gate reasonをbounded repair targetへ変換し、意味を足さず再計画する。 |
| Step11 Blind QA / Long-run | `emlis_ai_runtime_surface_blind_qa_long_run.py`, `emlis_ai_long_term_quality_service.py` | Blind QA候補をrow id / coverage / classificationで管理し、Long-runでsignature repetitionを測る。本文は保持しない。 |
| Step12 Exit Gate | `emlis_ai_runtime_surface_exit_gate.py`, `emlis_ai_complete_release_ladder_service.py` | Runtime Surface Quality工程のhandoff-only出口。next branch / release blockers / coverage gaps / QA gapsを残すが、Product Gate達成・public releaseはfalse。 |

境界維持:
- Cocolon RN側のsource file countは `217` のままです。`Emlisの観測` は引き続き public `observation_status=passed` かつ `input_feedback.comment_text` 非空の場合だけ表示します。
- `/emotion/submit` route、public response key、DB physical name、DB write path、RN modal条件は変更しません。
- Reader / Grounding / Template / Display Gate は緩めません。表示率向上のために `rejected` を表示しません。
- raw input、memo、current_input、public `comment_text` 本文はdiagnostic / scorecard / release ladder / local report / Blind QA候補へ保存しません。
- 固定完成文テンプレ、入力専用runtime分岐、外部AI / local LLMは追加しません。
- Step12 Exit Gateはhandoff-onlyです。Product Gate達成、High Quality到達、public release適用、商品品質版完成宣言ではありません。

# 2026-05-21 差分追記: EmlisAI 観測返答 Step0-14 current boundary

この差分は、`Cocolon_前提資料(104).zip` と最新実ファイル `Cocolon_16(1).zip` / `mashos-api_16(2).zip` を確認した結果を、前提資料へ差分追記するものです。Cocolon側のsource file countは `217` のまま、mashos-api側source file countは `568 -> 601`、合計 `785 -> 818` として読む。今回の修正対象は EmlisAI 観測返答 Step0-14 の backend / RN optional meta / scorecard / handoff 境界であり、DB physical name、public API route、public response key、RN表示タイトルは変更しません。

観測返答 Step0-14 の固定契約:

- 通常入力でEmlis renderが完走し安全境界を通過する場合、`eligible_observation` または `low_information_observation` を返す。
- 低情報観測は新しいpublic `observation_status` ではなく、内部metaの `observation_reply_kind=low_information_observation` として扱う。
- RN表示条件は引き続き `observation_status === passed` かつ `commentText` 非空。
- Freeではユーザー辞書を使わない。サブスクでは明示/非明示の2モードで使うが、低情報入力を辞書だけでeligible化しない。
- 推論鎖は入力内関係からの3段階まで。出来事・人格・診断・行動指示を足さない。
- Display Gateは緩めない。低情報branch側の本文品質を満たして `passed + comment_text` にする。
- Step10 repairは、Phase7 rollout block / composer pre-connection rollout stop / release gate block / 非修復AI-generated rejectionを低情報観測へ救済しない。これらは `unavailable` / `rejected` のままfail-closedに残す。
- DB physical name、public API route、public response key、RN title `Emlisの観測` は変更しない。
- Step14はhandoff-onlyであり、Product Gate達成・public release適用を宣言しない。

| Step | 実装名 | 主なowner | 構造上の読み方 |
|---|---|---|---|
| Step0 | Baseline / Contract Inventory | `emlis_ai_observation_reply_contract_inventory.py` | 現行表示契約・Free境界・低情報red casesを固定する。 |
| Step1 | Observation Reply Contract | `emlis_ai_observation_reply_contract.py` | `eligible_observation` / `low_information_observation` をpublic statusではなくmeta契約として定義する。 |
| Step2 | Observation Eligibility Router | `emlis_ai_observation_eligibility_service.py` | 文字数ではなく現在入力の根拠・関係・曖昧さでeligible/low_informationを分類する。 |
| Step3 | User Fact Grounding Boundary | `emlis_ai_user_fact_grounding_boundary.py` | Freeではユーザー辞書を使わず、サブスクでも辞書だけで低情報をeligible化しない。 |
| Step4 | Internal Question Layer | `emlis_ai_internal_question_service.py` | 入力から答えられる内部問い、user factで補助できる問い、答えられない問いをmeta化する。 |
| Step5 | Observation Dictionary Schema | `config/emlis_observation_dictionary.*`, `emlis_ai_observation_dictionary_loader.py` | 完成文テンプレではなく観測語彙・質問語彙の素材辞書を管理する。 |
| Step6 | Material / Focus / Relation Connector | `emlis_ai_observation_material_connector.py` | eligibility / unknown slot / inference depth を Complete Material / Focus / Relation層へ流す。 |
| Step7 | SentencePlan Observation Roles | `emlis_ai_observation_sentence_plan_roles.py`, `emlis_ai_complete_sentence_planner.py` | 既存line_roleを壊さず `line.meta.observation_roles` で4役割・低情報roleを持つ。 |
| Step8 | Low Information Observation Composer | `emlis_ai_low_information_observation_composer.py` | 低情報入力を正規branchとして、見える範囲の観測と質問を作る。 |
| Step9 | Surface Realizer / Tone Update | `emlis_ai_observation_surface_realizer_tone.py`, `emlis_ai_observation_surface_realizer.py` | 低情報質問ending、eligible状態言語化、Tone / Template Guardを観測role対応にする。 |
| Step10 | Display / Repair Integration | `emlis_ai_observation_display_repair_integration.py`, `emlis_ai_reply_service.py`, `emlis_ai_display_gate.py` | 低情報観測も既存 `passed + comment_text` 契約で表示可能にする。Gateは緩めない。 |
| Step11 | RN Contract Test / Optional Meta | `inputFeedbackModel.js`, `inputFeedbackObservationDiagnostics.js`, `rn-screen-contracts.test.js` | `observation_reply_kind` は任意meta。表示可否は `passed + commentText` のまま。 |
| Step12 | Scorecard / Blind QA | `emlis_ai_observation_scorecard_blind_qa.py` | always_display / false_eligible / user fact違反 / overclaim / template反復などをmeta-onlyで測る。 |
| Step13 | Regression Fixture Coverage | `emlis_ai_observation_regression_fixture_coverage.py` | 低情報・eligible・Free境界・サブスク明示/非明示fact・過剰補完誘発のcoverageを固定する。 |
| Step14 | Exit Gate / Handoff | `emlis_ai_observation_exit_gate_handoff.py` | release宣言ではなく、次工程へ渡せるかのhandoff-only exit gate。 |

# 2026-05-21 差分追記: Emlis観測専用辞書 Phase0-5 current boundary

この差分は、`Cocolon_前提資料(106).zip` と最新実ファイル `Cocolon_6(32).zip` / `mashos-api_6(26).zip` を確認した結果を、前提資料へ差分追記するものです。Cocolon側のsource file countは `217` のまま、mashos-api側source file countは `601 -> 613`、合計 `818 -> 830` として読む。今回の差分は backend の Emlis観測専用辞書 Phase0-5 であり、RN側のsource追加・変更はありません。

| Phase | 実ファイル上のowner | 前提資料上の読み方 |
|---|---|---|
| Phase 0 / 現行contract確認 | `emotion_submit_service.py`, `emlis_ai_reply_service.py` | `/emotion/submit`、request / response key、DB physical name、`input_feedback.comment_text` を変更しない境界確認。 |
| Phase 1 / current input bundle型整理 | `emlis_ai_current_input_bundle.py` | `memo -> thought_text`、`memo_action -> action_text`、`emotion_details -> emotions`、`category -> categories` を内部正規化する。public contract変更ではない。 |
| Phase 2 / 構造観測辞書schema | `config/emlis_observation_structure_dictionary.schema.json`, `config/emlis_observation_structure_dictionary.v1.json` | 既存の表面素材辞書とは別に、入力束 / relation / inference chain 系の実装用schemaを持つ。 |
| Phase 3 / Loader / Validator | `emlis_ai_observation_structure_dictionary_loader.py` | schema validation、entry / relation重複、参照整合、forbidden inference、contract drift flagを検査する。 |
| Phase 4 / Gate / Composer接続 | `emlis_ai_observation_structure_material_service.py`, `emlis_ai_observation_structure_connection_service.py`, `emlis_ai_display_gate.py`, `emlis_ai_conversation_composer_service.py`, `emlis_ai_observation_kernel.py`, `emlis_ai_reply_service.py` | 構造辞書を完成文生成器ではなく、text-free material / meta-only guard materialとしてGate / Composerへ渡す。 |
| Phase 5 / Test / Fixture / Blind QA | `tests/fixtures/emlis_ai_observation_structure_phase5_cases.py`, `tests/test_emlis_ai_observation_structure_phase5_fixtures_blind_qa.py` | 7必須fixture、category_parallel / category_overlap境界、raw text非混入、public contract維持を検証する。 |

固定契約:

- `/emotion/submit` のpublic route、request key、response keyは変更しない。
- DB physical name、DB write path、RN visible contract、`Emlisの観測` の表示条件は変更しない。
- `input_feedback.comment_text` は引き続きpublic表示本文の互換keyとして保持する。
- `emlis_observation_dictionary.v1.json` は表面素材 / guard signature 系辞書として残し、構造観測辞書は別ファイルで持つ。
- 構造観測辞書は完成返答文テンプレ集ではなく、入力束から relation / internal question / allowed・forbidden inference / gate material を作る内部辞書として読む。
- 構造material / connection metaには raw `memo` / `memo_action` / 完成返答本文を流さない。

# 2026-05-22 差分追記: Emlis観測専用辞書 ActionConversion / UnformedSelfInsight Phase0-8 current boundary

この差分は、`Cocolon_前提資料(111).zip` と最新実ファイル `Cocolon_8(12).zip` / `mashos-api_8(23).zip` を確認した結果を、前提資料へ差分追記するものです。Cocolon側のsource file countは `217` のまま、mashos-api側source file countは `613 -> 614`、合計 `830 -> 831` として読む。今回の差分はRN表示条件・public API・DB physical nameを変えるものではなく、EmlisAI内部の構造観測辞書と material / connection meta-only contract を更新するものです。

固定された読み方:

- 構造観測辞書は `19 relations / 18 entries` になり、`unexpressed_output_stop` / `self_shape_alignment` / `action_conversion_history` / `conversion_history_closure` / `unformed_self_insight` と、`word_could_not_say` / `word_aligned_to_context` / `word_gaman` / `word_wakaranai` を持つ。
- `emlis_observation_structure_dictionary.schema.json` は変更しない。既存schema互換の `relations` / `entries` 追加として読む。
- `material_service` / `connection_service` は、`thought_action_discrepancy` / `conversion_history_closure` / `priority_pressure` / `load_accumulation` を単語だけで強接続せず、memo と memo_action の差分や閉じ方根拠がある場合だけ扱う。
- Phase6では、material / connection metaに raw input、memo、memo_action、comment_text、completed reply、辞書本文、forbidden inference本文を混入させないことを固定する。
- Phase7 / Phase8ではsource変更なしで、Step10 RepairBoundary回帰と最終対象テスト一式を通す。辞書追加は rollout block / release gate block / unavailable を `passed + comment_text` に変えない。

変更ファイルとして読むもの:

| 区分 | file |
|---|---|
| 構造観測辞書 | `mashos-api/ai/services/ai_inference/config/emlis_observation_structure_dictionary.v1.json` |
| schema / loader test | `mashos-api/ai/tests/test_emlis_ai_observation_structure_dictionary_schema.py`, `mashos-api/ai/tests/test_emlis_ai_observation_structure_dictionary_loader.py` |
| material / connection test | `mashos-api/ai/tests/test_emlis_ai_observation_structure_phase4_connection.py` |
| service最小修正 | `mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_material_service.py`, `mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_connection_service.py` |
| fixture / Blind QA | `mashos-api/ai/tests/fixtures/emlis_ai_observation_structure_phase5_cases.py`, `mashos-api/ai/tests/test_emlis_ai_observation_structure_phase5_fixtures_blind_qa.py` |
| forbidden inference / meta-only contract | `mashos-api/ai/tests/test_emlis_ai_observation_structure_phase6_forbidden_inference_meta_contract.py` |

確認結果として、最新実ファイル `mashos-api_8(23).zip` の対象回帰は `119 passed`。これは全repo全テストではなく、Step10 / display repair / current display contract / reply contract / low information composer / runtime surface self-repair / structure dictionary / Phase4 / Phase5 / Phase6 の対象回帰として読む。

禁止: この差分を理由に、RN表示条件、public response key、public `observation_status` enum、API route、DB physical name、Cocolon基盤構造辞書、完成返答文テンプレ、Composer / Surface Realizer の表面文を変更しない。


# 2026-05-23 差分追記: EmlisAI Runtime Surface Pre-Return Gate + Shallow Surface Realizer V2 Step0-10 current boundary

この差分は、`Cocolon_前提資料(113).zip` と最新実ファイル `Cocolon_12(5).zip` / `mashos-api_12(8).zip` を確認した結果を、前提資料へ差分追記するものです。Cocolon側のsource file countは `217` のまま、mashos-api側source file countは `614 -> 630`、合計 `831 -> 847` として読む。今回の差分は、`Emlisの観測` が再表示できるようになった後に露出した壊れたsurface文を、backend側の表示前runtime gate / phrase unit guard / Shallow V2 / low-information specificity / bounded repair / diagnostics / exit criteriaで止める工程です。RN側の表示条件・public API・DB physical nameは変更していません。

前提として、`mashos-api/ai/services/ai_inference/requirements.txt` に `jsonschema>=4.21.1` が入っています。これは `emlis_ai_observation_structure_dictionary_loader.py` の schema validation が fail-closed しないための実行依存であり、RN表示契約や辞書schema変更ではありません。

| Step | 実装名 | 主なowner | 構造上の読み方 |
|---|---|---|---|
| Step0 | Baseline red fixtures | `tests/fixtures/emlis_ai_runtime_surface_red_fixtures.py` | `今までこと` / `大丈夫こと` / `Xが中心にあります` / `その中でも` 連続など、public表示禁止surfaceを固定する。良文固定ではない。 |
| Step1 | Runtime Surface Pre-Return Gate contract | `emlis_ai_runtime_surface_pre_return_gate.py` | in-memory候補文とsurface signatureをmeta-onlyで評価し、`allow` / `block` / `rerender_shallow_v2` / `reroute_low_information` / `fail_closed` を返す。 |
| Step2 | 表示前path接続 | `emlis_ai_reply_service.py`, `emlis_ai_display_gate.py`, `emlis_ai_observation_display_repair_integration.py` | surface fatal候補を `passed + comment_text` にしない。blocked時はcomment_textを空にし、surface系rejection reasonを残す。 |
| Step3 | Phrase Unit Malformed Nominalization Guard | `emlis_ai_limited_sentence_quality_guard.py`, `emlis_ai_phrase_unit_grammar_normalizer.py` | 壊れた `〜こと` phrase unitを DROP / DEFER / safe rephrase only に寄せ、must_keepでも壊れた日本語のまま本文へ出さない。 |
| Step4 | shallow phrase unit guard接続 | `emlis_ai_limited_composer_client.py` | shallow phrase unit作成時にnormalizer / material quality guardを通し、安全なunitだけをrealizerへ渡す。 |
| Step5 | Shallow Surface Realizer V2 | `emlis_ai_limited_composer_client.py` | `Xが中心にあります` / `その中でも` の旧骨格を標準表示から外し、`receive_line` / `state_arrangement_line` / `bounded_observation_line` / `optional_question_line` のroleで組む。 |
| Step6 | Low Information Specificity | `emlis_ai_low_information_observation_composer.py`, `emlis_ai_observation_surface_realizer_tone.py`, `emlis_ai_observation_display_repair_integration.py` | 低情報入力でもsafe anchorがある場合は完全抽象へ逃げず、raw long copyやevent / fact捏造はしない。 |
| Step7 | bounded repair / reroute | `emlis_ai_bounded_repair_reroute.py`, `emlis_ai_reply_service.py`, `emlis_ai_observation_display_repair_integration.py` | shallow V2 rerenderは1回だけ。safe unit不足時のみlow-informationへbounded rerouteし、safety / rollout / release gateは救済しない。 |
| Step8 | diagnostics / scorecard | `emlis_ai_complete_reply_diagnostics_service.py`, `emlis_ai_complete_scorecard_service.py`, `emlis_ai_reply_service.py` | runtime surface gate、malformed phrase、Shallow V2、Low Information Specificityをdiagnostics / scorecardへmeta-onlyで伝播する。 |
| Step9 | Regression / QA | `emlis_ai_observation_diagnostic_lockdown.py`, `test_emlis_ai_runtime_surface_regression_qa_step9.py`, `test_emlis_ai_observation_diagnostic_lockdown_surface_gate_step9.py` | 壊れたfixtureがpassedしないこと、safe shallow V2 / low-information分岐、diagnostic_lockdownのsurface分類を固定する。 |
| Step10 | 実機確認 / exit criteria helper | `emlis_ai_runtime_surface_exit_criteria.py`, `emlis_ai_observation_diagnostic_lockdown.py`, `test_emlis_ai_runtime_surface_exit_criteria_step10.py` | Render実機ログで見るべきexit criteriaをmeta-only helperとdiagnostic_lockdownで固定する。実機確認結果そのものではない。 |

固定された読み方:

- `Emlisの観測` のRN表示条件は、引き続き `observation_status=passed` かつ `input_feedback.comment_text` 非空です。
- public `observation_status` enum、`input_feedback.comment_text`、`/emotion/submit` route、DB physical name / write pathは変更しません。
- Runtime Surface Pre-Return Gateは、Reader / Grounding / Template Guard / Display Gateを緩めるものではなく、壊れたsurfaceをpublic表示前にfail-closedする層です。
- `surface_template_major`、`generic_center_phrase`、`same_connector_run`、`malformed_phrase_unit`、`malformed_nominalization_*` は表示前block reasonとして読む。
- diagnostics / scorecard / diagnostic_lockdown は raw input、memo、public `comment_text` 本文、完成返答本文を保存しないmeta-only境界として読む。
- Shallow V2は完成文テンプレ追加ではなく、旧 shallow skeleton の標準表示を外すrealizer更新です。
- Low Information Specificityは、低情報入力を無理に深読みする修正ではなく、安全anchorがある場合だけ狭く具体化する修正です。
- bounded repair / rerouteは表示契約を緩めるものではない。repair不能なら `passed + comment_text` にせず、comment_text空でfail-closedに残す。

実ファイル確認結果:

| 確認 | 結果 |
|---|---|
| source count | `Cocolon=217`、`mashos-api=630`、`total=847`。 |
| Cocolon差分 | RN表示契約は `passed + commentText` のまま。Step0-10のsource変更はbackend側。 |
| mashos-api新規source/test | Runtime Surface Pre-Return Gate、Bounded Repair/Reroute、Runtime Surface Exit Criteria、red fixture、Step1-10 QA test群。 |
| 実行済み対象回帰 | Step0-10主要回帰 `68 passed`、表示契約・repair・diagnostic_lockdown回帰 `39 passed`。全repo全テストではない。 |

禁止: この差分を理由に、RN表示条件、public response key、public `observation_status` enum、API route、DB physical name、Emlis観測専用辞書schema、完成返答文テンプレ、外部AI前提を変更しない。


# 2026-05-24 差分追記: EmlisAI public feedback meta boundary / timeout recovery / low-information prompt / notification uuid boundary

`Cocolon_9(11).zip` / `mashos-api_9(15).zip` では、2026-05-23のRuntime Surface Pre-Return Gate + Shallow V2を前提に、EmlisAI immediate responseのpublic boundaryが追加されています。これは壊れたsurfaceを通すための変更ではなく、internal meta全文をRN public responseへ出さない境界です。

読み方:

- `emlis_ai_public_feedback_meta.py` が `input_feedback.emlis_ai` をpublic-safe subsetへ縮小する。
- `emotion_submit_service.py` はinternal metaをdiagnostic log / lockdownへ渡し、public responseにはsanitized metaを返す。
- `api_emotion_submit.py` / `home_gateway/emotion_reflection_publish_service.py` は、`comment_text` 非空 + public `observation_status=passed` の時だけ `input_feedback` を返す。
- `InputScreen.js` はtimeoutを保存失敗と断定せず、Home再読込を一度試し、入力欄/draftを残す。
- low-information質問surfaceは `詳しく残せそうなら、〜残してみませんか。` 系へ更新されている。
- notification settingsのuuid型 `owner_user_id` filterへglobal sentinel文字列を混ぜない。

不変: `/emotion/submit` route、request payload、response top-level key、`input_feedback.comment_text`、public `observation_status` enum、RN visible title `Emlisの観測`、RN表示条件 `passed + commentText`、DB physical name / write path。

# 2026-05-24 差分追記: EmlisAI Visible Surface Acceptance QA Step0-8 current boundary

この差分は、`Cocolon_前提資料(117).zip` と最新実ファイル `Cocolon_9(12).zip` / `mashos-api_9(16).zip` を確認した結果を、前提資料へ差分追記するものです。Cocolon側source countは `217` のまま、mashos-api側source countは `635 -> 641`、合計 `852 -> 858` として読む。今回の差分は、EmlisAIが表示されるようになった後の本文品質を、商品表示前に受け入れ判定する工程です。

読み方:

- Step0でスクショ由来の表示文QA inventoryを `tests/fixtures/emlis_ai_visible_surface_acceptance_fixtures.py` に固定する。これは良文固定ではなく、赤ケース / 修復必須 / 合格 / out_of_scope の表示面棚卸しです。
- Step1-2で `たりこと` 系 malformed nominalization を `malformed_nominalization_tari_fragment` として PhraseUnit guard と Runtime Surface Pre-Return Gateへ接続する。
- Step3で `emlis_ai_visible_surface_acceptance_gate.py` を追加し、RNと同じ中心感情推定、本文冒頭焦点、bridge有無、positive-only over-burden、visible malformed surface をmeta-onlyで評価する。
- Step4で reply path / display gate / observation display repair integrationへ接続し、red / repair_required / rerender_surface / reroute_low_information / block / fail_closed をpublic表示前fail-closed条件へ入れる。
- Step5で low-information tone profileをcomposer / surface realizerへ接続し、positive_only / negative_only / mixed / self_insight / neutral_or_unknown の読み方を分ける。
- Step6で public meta sanitizerへ `visible_surface_acceptance_gate` の小さいsummaryだけを追加し、unsafe flag時はfail_closed summaryへ落とす。blocking時は `input_feedback` を返さない。
- Step7で RN contract testを更新し、表示条件は引き続き public `observation_status=passed` + public `comment_text` non-empty のみであること、`Userさん` はaccount nameであり赤ケースではないことを固定する。
- Step8で回帰テスト実行性のため、構造辞書loaderの `jsonschema` eager importを外し、bundled schema subsetをstdlibで検証する。これは辞書schema変更ではなく、pytest collection安定化のためのloader境界です。

新規・変更ownerとして読むもの:

| 区分 | owner |
|---|---|
| visible surface gate | `mashos-api/ai/services/ai_inference/emlis_ai_visible_surface_acceptance_gate.py`, `mashos-api/ai/tests/test_emlis_ai_visible_surface_acceptance_gate.py` |
| inventory / red fixture | `mashos-api/ai/tests/fixtures/emlis_ai_visible_surface_acceptance_fixtures.py`, `mashos-api/ai/tests/test_emlis_ai_visible_surface_acceptance_inventory_step0.py` |
| `たりこと` guard | `emlis_ai_phrase_unit_grammar_normalizer.py`, `emlis_ai_limited_sentence_quality_guard.py`, `emlis_ai_runtime_surface_pre_return_gate.py`, `test_emlis_ai_malformed_nominalization_phrase_unit_guard.py`, `test_emlis_ai_runtime_surface_pre_return_gate_step2.py` |
| reply path / display connection | `emlis_ai_reply_service.py`, `emlis_ai_display_gate.py`, `emlis_ai_observation_display_repair_integration.py`, `test_emlis_ai_visible_surface_acceptance_reply_path_step4.py` |
| low-information tone profile | `emlis_ai_low_information_observation_composer.py`, `emlis_ai_observation_surface_realizer_tone.py`, `test_emlis_ai_low_information_tone_profile_step5.py` |
| public meta sanitizer | `emlis_ai_public_feedback_meta.py`, `test_emlis_ai_public_feedback_meta.py`, `test_emotion_submit_public_feedback_meta_boundary.py` |
| RN contract | `Cocolon/tests/rn-screen-contracts.test.js` |
| regression execution stability | `emlis_ai_observation_structure_dictionary_loader.py` |

不変: `/emotion/submit` route、request payload、response top-level key、`input_feedback.comment_text`、public `observation_status` enum、RN visible title `Emlisの観測`、RN表示条件 `passed + commentText`、DB physical name / write path、外部AI / local LLM 非使用、固定テンプレ共感文禁止。


# 2026-05-25 差分追記: EmlisAI Product Visible Surface Reliability + Koto Splice Repair Step0-8 overall structure

最新実ファイル `Cocolon(184).zip` / `mashos-api(97).zip` では、前回の Visible Surface Acceptance QA の後段として、`取らなければこと` / `予感こと` 系のkoto splice RED固定、B相当の機械的relation文の修復対象化、Shallow Surface Realizer V2安全化、bounded repair reroute、public-safe diagnostic summary、RN contract regressionが反映されています。

全体構造上は、EmlisAI immediate response の表示前品質境界を次の順で読む。

```text
/emotion/submit
 -> EmlisAI reply candidate
 -> PhraseUnit / Limited Guard koto splice check
 -> Runtime Surface Pre-Return Gate
 -> Visible Surface Acceptance Gate
 -> Display Gate
 -> bounded repair reroute, max once when repairable
 -> public feedback meta sanitizer
 -> input_feedback only when public observation_status=passed + comment_text
 -> RN Emlisの観測 modal only when passed + commentText
```

## 追加された読み方

| 領域 | current owner | 読み方 |
|---|---|---|
| koto splice RED | `emlis_ai_phrase_unit_grammar_normalizer.py`, `emlis_ai_limited_sentence_quality_guard.py`, `emlis_ai_runtime_surface_pre_return_gate.py`, `emlis_ai_visible_surface_acceptance_gate.py` | `malformed_nominalization_conditional_fragment` / `malformed_nominalization_prediction_noun_fragment` / `residual_koto_splice_fragment` / `long_clause_koto_attachment_risk` は表示文品質REDまたは修復理由として扱う。 |
| relation skeleton修復 | `emlis_ai_visible_surface_acceptance_gate.py` | `surface_relation_skeleton_major` / `surface_relation_skeleton_stack` / `analytic_register_leak` により、B相当の機械的relation文を `repair_required / rerender_surface` へ回す。 |
| Shallow Surface Realizer V2安全化 | `emlis_ai_relation_surface_contract.py`, `emlis_ai_limited_composer_client.py` | `PhraseSurfaceShapeSignal` と `compress_phrase_for_relation_surface(...)` により、義務・予定・予感・長いraw clauseを `phrase + こと` へ直結しない。 |
| 一回修復 | `emlis_ai_bounded_repair_reroute.py`, `emlis_ai_reply_service.py` | Visible Gateの `rerender_surface` も修復候補へ接続する。ただし `rerender_attempt_limit=1` で、再修復済み・非修復理由はfail-closed。 |
| 表示なし診断 | `emlis_ai_public_feedback_meta.py`, `emotion_submit_service.py`, `emlis_ai_observation_diagnostic_lockdown.py` | `display_absence_summary` に `candidate_blocked_koto_splice`、`candidate_blocked_relation_skeleton`、`candidate_repair_attempted` などをcode / booleanだけで残す。 |
| RN contract | `Cocolon/tests/rn-screen-contracts.test.js` | visible gate / diagnostic metaがpassedでも、public `input_feedback.comment_text` と `observation_status=passed` がなければ表示しない。 |

固定された全体構造の読み方:

- C相当の `取らなければこと` / `予感こと` は、入力由来かどうかに関係なく `passed + comment_text` としてRNへ返さない。
- B相当の機械的relation文は文法だけでpassさせず、Visible Gateで修復対象にする。
- Gateは表示率向上のために緩めない。危険候補は捨て、一回だけ安全再表面化し、再評価後も落ちる場合は表示なしにする。
- public metaは本文なしのcode / boolean / countに限定する。
- RN実装本体、API route、response key、DB write path、表示タイトルは変更しない。

# 2026-05-25 差分追記: 環境状態出力観測構造 Phase0-1 前提資料境界

この差分は、`cocolon_environment_state_output_observation_structure_design_2026_05_25.md` を新規設計書として前提資料へ追加し、その参照順と禁止境界を前提資料へ差分反映するものです。実ファイルのコード変更、DB変更、API route変更、response key変更、RN表示条件変更、json/schema実ファイル化は行いません。

読み方:

- Cocolonの基本観測単位は、文章単体ではなく、`環境ラベル × 状態ラベル × 出力内容` として読む。
- `category` は環境ラベル / 話題方向、`memo_action` は実世界で起きたこと・したこと・状況、`emotion_details` は状態ラベル、`strength` は状態の重さ、`memo` はその環境・状態で外に置かれた思考 / 解釈 / 出力内容として読む。
- この構造はEmlisAI専用ではなく、Cocolon全体の基盤観測構造として扱う。
- 実装接続は、EmlisAIでは現在入力1件の単発観測、Pieceでは核の過圧縮防止、Analysisでは期間をまたいだ再出現観測として段階展開する。
- 1件の入力から傾向・人格・性格・原因を断定しない。
- categoryを原因にしない。emotion strengthを原因にしない。回復ラベル経路を治療・処方として扱わない。

Phase扱い:

| Phase | 今回の扱い |
|---|---|
| Phase 0 | 新規設計書を前提資料へ追加する。 |
| Phase 1 | 前提資料のREAD_FIRST、思想資料、命名体系、名称混在境界、ルール索引、最新差分、manifestへ差分追記する。 |
| Phase 2以降 | 実装段階で判断する。schema / json案は設計書内にあるが、今回実ファイル化しない。 |

不変: `/emotion/submit` route、request payload、response top-level key、`input_feedback.comment_text`、public `observation_status` enum、RN visible title `Emlisの観測`、RN表示条件 `passed + commentText`、DB physical name / write path、外部AI / local LLM 非使用、固定テンプレ共感文禁止。

# 2026-05-26 差分追記: EmlisAI状態回答と人間的フォロー Phase0-1 前提資料境界

この差分は、`emlis_ai_state_answer_human_follow_definition_2026_05_26.md` をEmlisAI出力思想資料として前提資料へ追加し、その参照順と禁止境界を前提資料へ差分反映するものです。実ファイルのコード変更、DB変更、API route変更、response key変更、RN表示条件変更、json/schema実ファイル化は行いません。

読み方:

- EmlisAIは、行動指示ではなく、ユーザーが「今の自分は何をしているのか」を理解するための状態回答を返す。
- Cocolon環境状態出力観測構造が `環境ラベル × 状態ラベル × 出力内容` として「何を見るか」を定義し、本資料はそれをEmlisAIがどう返すかを定義する。
- 表示は、前半の構造観測 / 状態回答と、後半の人間的フォロー / Emlisの感想の二層として読む。
- 基本比率は `観測6 : フォロー4`。ただし、強い自己否定・悲しみ・消耗・孤独ではフォロー厚め、構造理解要求では観測厚めにする。
- フォローは人格断定ではなく、入力内に見える意図・怖さ/負荷・努力・存在へのEmlisの感想として扱う。
- 自己否定では felt state と identity claim を分け、入力内根拠のある限定的なEmlisの反対意見だけを許す。
- 怒りでは相手評価や攻撃に同意せず、怒りの奥にある大事にしていた線を受け止める。
- 比喩は自由生成せず、構造理解要求時の安全な日常比喩候補として扱う。

Phase扱い:

| Phase | 今回の扱い |
|---|---|
| Phase 0 | 設計書作成済み。今回提供済み資料を前提資料へ新規追加する。 |
| Phase 1 | READ_FIRST、思想資料、命名体系、名称混在境界、ルール索引、最新差分、manifestへ差分追記する。 |
| Phase 2以降 | Phase0-1当時は未実装扱い。最新基準 `mashos-api_10(16).zip` ではPhase2-10までbackend internal material / selector / ratio / special handling / metaphor / Composer / Gate / QA / cross-core regressionとして実装済み。 |

不変: `/emotion/submit` route、request payload、response top-level key、`input_feedback.comment_text`、public `observation_status` enum、RN visible title `Emlisの観測`、RN表示条件 `passed + commentText`、DB physical name / write path、外部AI / local LLM 非使用、固定テンプレ共感文禁止、public meta raw input非混入。


# 2026-05-26 差分追記: EmlisAI状態回答と人間的フォロー Phase2-10 実装反映後の読み方

この差分は、Phase0-1で前提資料へ追加した `emlis_ai_state_answer_human_follow_definition_2026_05_26.md` の設計内容が、最新実ファイル `mashos-api_10(16).zip` でbackend内部実装へ進んだことを、前提資料側へ反映するものです。

読む時の基準:

- Phase0-1の設計資料は、EmlisAI状態回答と人間的フォローの思想正本として残す。
- Phase2-10の実装は、`emlis_state_answer_surface_contract` / `emlis_ai_human_follow_selector` / `emlis_ai_state_answer_ratio_policy` / `emlis_ai_state_answer_special_cases` / `emlis_ai_safe_daily_metaphor_material` / `emlis_state_answer_composer_role_plan` / `emlis_ai_state_answer_gate_boundary` を中心とするbackend内部materialとして読む。
- これらは完成文テンプレではなく、Composer / Gate / Public Meta / QAが参照する内部contractである。
- RN側 `Cocolon_10(9).zip` は今回差分なし。`Emlisの観測`、`passed + commentText`、`/emotion/submit` のpublic contractは維持されている。
- Piece / Analysisは、Phase10横断contractにより、EmlisAI状態回答の温度・人間的フォロー・special handling materialを流用しない。

作業時の禁止:

- 状態回答contractをpublic response keyへ出さない。
- `human_follow_layer` / `ratio_policy` / `special_handling` / `metaphor_policy` をRN表示条件にしない。
- raw memo / memo_action / evidence text / comment_text body / contract body をpublic metaへ入れない。
- 自己否定・怒り・比喩の特別扱いを、診断、人格断定、相手評価同意、自由比喩生成へ変換しない。


# 2026-05-26 差分追記: EmlisAI二段受け取り構造 / Daily Reception / 受け取り補助辞書 Phase0-15 実装反映後の読み方

この差分は、`Cocolon_EmlisAI_二段受け取り構造_DailyReception_受け取り補助辞書_詳細設計書_実装順_華恋用_2026-05-26.md` のPhase0-14実装が、最新実ファイル `mashos-api_15(5).zip` / `Cocolon_15(3).zip` に入ったことを、前提資料側へ反映するものです。Phase15は前提資料更新のみであり、production code、DB、API route、RN production UIは変更しません。

読む時の基準:

- 二段表示は、既存 `input_feedback.comment_text` の本文中に `見えたこと：` と `Emlisから：` を入れる表示契約である。
- `見えたこと` は入力内根拠から言える観測section、`Emlisから` は同じ根拠を見た上で返す受け取りsectionとして読む。
- `EmlisSharedReceptionEvidence` は観測sectionと受け取りsectionの共通根拠であり、raw memo / memo_action / comment_text bodyをpublic metaへ返すものではない。
- `EmlisReceptionAssistanceDictionary` は一般辞書ではなく、reaction cue、event hint、reception mode、tone family、follow shape、forbidden inferenceを持つ内部補助辞書である。完成返答文テンプレや未知語意味辞書として扱わない。
- `Reception Mode Resolver` の `daily_unpleasant_reception` / `daily_positive_reception` / `self_denial_support` / `uncertainty_support` はbackend内部modeであり、public `observation_status` enumではない。
- Aのように `memo_action` に具体出来事があり、`memo` / `emotion_details` に明示反応がある入力は、低情報質問へ落とさず `eligible_observation` として軽い日常受け取りへ送る。
- `立ちション` などのevent hintだけで、恐怖・怒り・危険・トラウマを作らない。ユーザーの明示反応を主根拠にする。
- 日常受け取りでは観測ゼロにせず、観測1文 + `Emlisから` 2〜3文程度まで軽くする。比率は文字数固定ではなくsection role / sentence plan unit / follow key countの体験比率として扱う。
- Cross Gateは二段ラベル、section順序、観測/受け取り混線、質問逃げ、event hintによる感情捏造、bad grammar、koto splice、skeleton leak、unknown word assertionを止める。
- Public Feedback Meta / Submit境界では、two-stage gate block時に `observation_status=passed` として扱わず、`input_feedback` を返さない。
- RNは `commentText` をそのまま表示するだけで、`見えたこと` / `Emlisから` をparseせず、`observation_text` / `reception_text` / `observationText` / `receptionText` を表示sourceとして読まない。
- Phase14では、保存成功とEmlis表示fail-closedを分けて記録し、timeout / error時もpublic metaへ本文を出さない。

実装済みとして読む主な内部ファイル:

| 領域 | 主な実ファイル | 読み方 |
|---|---|---|
| Shared Evidence | `emlis_ai_shared_reception_evidence.py` | event fact / reaction / cue / hint / mode候補をtext-free summary化する内部material。 |
| 受け取り補助辞書 | `emlis_ai_reception_assistance_dictionary_loader.py`, `config/emlis_reception_assistance_dictionary.v1.json` | 一般辞書ではなく、受け取りsectionを安全に作るための内部辞書。 |
| Reception Mode | `emlis_ai_reception_mode_resolver.py` | `daily_reception` / 自己否定 / 不安 / 構造理解要求などの内部modeを決める。 |
| Eligibility / Ratio | `emlis_ai_observation_eligibility_service.py`, `emlis_ai_state_answer_ratio_policy.py` | Aを低情報質問へ落とさず、daily receptionの観測比率を軽くする。 |
| Surface / Composer | `emlis_ai_state_answer_surface_contract.py`, `emlis_ai_state_answer_composer_contract.py`, `emlis_ai_conversation_composer_service.py` | 二段表示契約とsection順序をComposerへ渡す。 |
| Human Follow | `emlis_ai_human_follow_selector.py` | `explicit_reaction_receiving` / `not_over_explaining_daily_event` などをmode別に選ぶ。 |
| Gate / Public Meta / Submit | `emlis_ai_two_stage_reception_gate.py`, `emlis_ai_visible_surface_acceptance_gate.py`, `emlis_ai_state_answer_gate_boundary.py`, `emlis_ai_public_feedback_meta.py`, `emotion_submit_service.py` | 二段surfaceの品質、block時の非表示、public meta sanitization、timeout切り分けを扱う。 |
| RN契約回帰 | `Cocolon/tests/rn-screen-contracts.test.js` | production RNを変えず、二段本文を既存 `commentText` として表示する契約を固定する。 |

作業時の禁止:

- `daily_reception` をpublic `observation_status` enumにしない。
- `two_stage_reception` / `reception_mode` / `reception_assistance` をpublic response keyへ昇格しない。
- `observation_text` / `reception_text` を初期実装のpublic keyとして追加しない。
- RN側で `見えたこと` / `Emlisから` をparseして別カード化しない。
- 受け取り補助辞書を一般辞書、未知語意味辞書、完成返答文テンプレ集にしない。
- A/B/非表示ログ1〜3のQA surfaceをruntime固定文として扱わない。
- `passed + comment_text` 以外でRN表示しない。
- raw input / memo / memo_action / evidence text / comment_text body / section本文をpublic metaへ入れない。
- DB physical name、`/emotion/submit` route、request / response top-level key、RN表示タイトル `Emlisの観測` を変更しない。


# 2026-06-04 追補: EmlisAI Product Quality Measurement / Blocker Repair Phase0-8 実装反映

最新実ファイル `Cocolon_9(17).zip` / `mashos-api_9(27).zip` を確認した。Cocolon RN側は source file count `217` のままで、production RN UI、RN表示タイトル、RN表示条件、public response shapeの変更はない。mashos-api側では、EmlisAI Product Quality Measurement / Blocker Repair / Blind QA Integration / Release Decision / Validation Plan の Phase0〜8 がbackend internal-only層として実装されている。

読み方:

- Phase0〜8は、EmlisAIを商品品質到達済みにするrelease適用ではなく、商品品質を測り、blockerを分解し、修正順と検証順を内部material化する計測・判断基盤である。
- `ProductQualityEventV1` は本文を持たない内部eventであり、`public_display_reached` は `/emotion/submit` の `should_include_public_input_feedback(...)` と同じ表示契約で判定する。
- `Measurement Runner` は実入力familyを `render_emlis_ai_reply` 相当経路へ流すが、public response key、DB保存物、RN表示payloadを作らない。
- `Blocker Matrix` と `Generation Repair Design` は、Gateを緩めずに修正対象owner / repair policy / generation trackへ戻すための内部materialである。
- `Blind QA Integration` は「読まれた感じ」を機械指標で代替しない。review未実施、coverage不足、red reviewはrelease blockerである。
- `Release Decision Layer` と `Validation Plan` は内部判断であり、Phase11 / scorecard / validation materialへ `product_gate_ready` や `public_release_applied` を立てさせない。

実装済みとして読む主な内部ファイル:

| Phase | 主な実ファイル | 読み方 |
|---|---|---|
| Phase0 Contract Freeze | `emlis_ai_product_quality_contract_freeze.py`, `test_emlis_ai_product_quality_phase0_contract_freeze.py` | RN/API/DB/public response/Product QA materialの既存契約を内部meta-onlyで固定する。 |
| Phase1 Local Product QA Composer Bootstrap | `emlis_ai_product_quality_measurement_runner.py`, `test_emlis_ai_product_quality_phase1_local_composer_bootstrap.py` | local QAでComposer生成経路が開いているかを判定し、無効なら成功扱いせずblocker化する。 |
| Phase2 ProductQualityEventV1 | `emlis_ai_product_quality_measurement_event.py`, `test_emlis_ai_product_quality_measurement_event.py` | raw input / comment body / candidate bodyを持たない内部QA eventへ正規化する。 |
| Phase3 Measurement Runner | `emlis_ai_product_quality_measurement_runner.py`, `test_emlis_ai_product_quality_measurement_runner.py` | 必須input familyをEmlisAI経路へ流し、表示到達・Gate・binding・reason coverage・QA接続をevent化する。 |
| Phase4 Blocker Matrix | `emlis_ai_product_quality_blocker_matrix.py`, `test_emlis_ai_product_quality_blocker_matrix.py` | blockerをowner area / candidate module / repair policyへ接続する。未知blockerはfail-closedでtriageする。 |
| Phase5 Generation Repair Design | `emlis_ai_product_quality_generation_repair_design.py`, `test_emlis_ai_product_quality_generation_repair_design.py` | Blocker Matrixから生成修正trackと実行順を作る。本文生成ロジック自体はまだ変更しない。 |
| Phase6 Blind QA Integration | `emlis_ai_product_quality_blind_qa_integration.py`, `test_emlis_ai_product_quality_blind_qa_integration.py` | Runtime Surface Blind QA / User Label Connection QAをratings-onlyで統合し、未実施ならrelease不可にする。 |
| Phase7 Release Decision Layer | `emlis_ai_product_release_decision.py`, `test_emlis_ai_product_release_decision.py` | Phase11 / scorecard / Blind QA / Blocker Matrix / Composer stateを統合し、内部release判断だけを返す。 |
| Phase8 Validation Plan | `emlis_ai_product_quality_validation_plan.py`, `test_emlis_ai_product_quality_validation_plan.py` | 検証順・acceptance criteria・未実行blockerを固定する。テスト実行そのものの代替ではない。 |

不変境界:

```text
RN production UI変更なし
RN表示タイトル `Emlisの観測` 変更なし
RN表示条件 `observation_status === passed && commentText non-empty` 変更なし
/emotion/submit route / request key / public response top-level shape 変更なし
DB physical schema / write path 変更なし
public response key追加なし
Gate緩和なし
固定テンプレート追加なし
A/C/D fixture専用runtime branch追加なし
product_gate_ready / public_release_applied を立てない
raw input / comment_text body / candidate body / surface body をrelease materialへ入れない
```


作業時の禁止:

- Phase0〜8の内部名を理由にRN表示条件を増やさない。
- `release_allowed` / `validation_passed` / `PRODUCT_PASS` 系の内部語をpublic `observation_status` enumへ変換しない。
- `blind_qa_review_queue` やreview用materialをpublic metaまたはRN表示sourceにしない。
- `generation_repair_design` を「本文生成修正済み」と読まない。Phase5は修正設計materialであり、実生成ロジック修正ではない。
- Validation Planをテスト実行済み証明として扱わない。未実行ならrelease不可blockerとして読む。
