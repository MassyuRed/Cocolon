# Cocolon / EmlisAI 長期開発ロードマップ

作成日: 2026-06-08 JST  
最終差分更新: 2026-07-06 JST / 問いシステム正式再配置  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdownロードマップ  
対象: Cocolon / EmlisAI / `/emotion/submit` immediate observation / `Emlisの観測` / Product Read Feel / User Label Connection / Structure Insight / 問いシステム / EmlisAI core quality gate  

---

## 0. このロードマップの結論

EmlisAIの最終到達地点は、**GPTより賢い返答AI**ではありません。

EmlisAIの最終到達地点は、次です。

```text
ユーザーがCocolonへ残した感情・カテゴリ・行動・思考・時点・過去記録を、
入力直後に「読まれた形」として返し、
その人が自分の状態・反応・言葉の線を外側から見られるようにし、
もう一度Cocolonへ残したくなる観測体験にすること。
```

Cocolonの商品価値は、機能一覧ではなく、**一回入力した直後のEmlis応答**で証明されます。

ユーザーが最初の数回で、

```text
これはただのAI相談ではない。
自分の記録が意味を持って返ってきている。
もう一回、ここに残してみたい。
```

と思えなければ、Cocolonは続きません。

そのため、このロードマップは、EmlisAIを「表示されるAI応答」から、**入力継続を生む商品体験**へ育てるための長期開発地図です。

2026-07-06差分として、旧資料名「観測補助問い」は、プロダクト上の名称を **問いシステム** として扱います。  
問いシステムは、EmlisAIが入力内の情報だけで無理に補完して「わかったつもり」になることを防ぎ、必要な場合に短い問いで足りない情報を取得し、回答分だけ観測を深めるための中核機構です。

問いシステムは、単なるP8追加UIではありません。  
**EmlisAI core quality gate** と **P8問いUX / サブスク体験** の2層に分けて扱います。

```text
EmlisAI core quality gate:
  わかったふり検出
  補完禁止
  足りない情報の特定
  問いが必要かどうかの判定
  問いを出さず限定観測にする判定

P8 問いUX / サブスク体験:
  仮観測 + 問い表示
  Free / Plus / Premium差分
  深掘り1〜3回
  問い回答後の refined observation
  設定ON/OFF
  履歴 / User Label Connection / わたしマップ接続
```

---

## 1. 今回確認した資料・実ファイル・検証結果

### 1.1 受領zip

今回の基準面として、次のローカルzipを確認しました。

```text
/mnt/data/Cocolon_前提資料(188).zip
/mnt/data/Cocolon(215).zip
/mnt/data/mashos-api(128).zip
/mnt/data/EmlisAIの実装済み資料(45).zip
```

### 1.2 主に確認した前提資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md
Cocolon_前提資料/Cocolon_EmlisAI_NormalObservation_PublicRecovery_ImplementationStatus_2026-06-06.md
Cocolon_前提資料/cocolon_environment_state_output_observation_structure_design_2026_05_25.md
```

### 1.3 主に確認したEmlisAI実装済み資料

```text
EmlisAIの実装済み資料/Cocolon_EmlisAI_状態回答と人間的フォロー_設計定義_華恋用_2026-05-26.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_商品読感評価基準_構造気づき到達点_詳細設計書_実装順_華恋用_2026-06-01.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md
EmlisAIの実装済み資料/EmlisAI_PublicObservationRecovery_詳細設計書_実装順_2026-06-06.md
EmlisAIの実装済み資料/EmlisAI_LimitedGrounding_LowInfo_ReceptionRequired_DetailedDesign_2026-06-06.md
EmlisAIの実装済み資料/EmlisAI_D_backend_red_detailed_design_implementation_order_2026-06-07.md
EmlisAIの実装済み資料/Cocolon_EmlisAI_ProductQualityMeasurement_BlockerRepair_Design_2026-06-04.md
```

### 1.4 主に確認した実ファイル

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
mashos-api/ai/services/ai_inference/emotion_submit_service.py
mashos-api/ai/services/ai_inference/api_emotion_submit.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
mashos-api/ai/services/ai_inference/emlis_ai_public_surface_requirement.py
mashos-api/ai/services/ai_inference/emlis_ai_product_surface_validation.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_initial_surface_recomposition.py
mashos-api/ai/services/ai_inference/emlis_ai_labelled_two_stage_surface_recomposition.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_material.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_candidate.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_surface.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_public_meta.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_product_quality_qa.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_rubric.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_long_run_product_gate.py
```

### 1.5 ローカル検証結果

今回、ロードマップ作成前の現在地確認として、以下を実行しました。

#### RN contract

```bash
cd /mnt/data/cocolon_roadmap_work/Cocolon
npm run test:rn-screens --silent
```

結果:

```text
36 passed
```

#### User Label Connection主要backend

```bash
cd /mnt/data/cocolon_roadmap_work/mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_user_label_connection_material.py \
  tests/test_emlis_ai_user_label_connection_candidate.py \
  tests/test_emlis_ai_user_label_connection_gate.py \
  tests/test_emlis_ai_user_label_connection_surface.py \
  tests/test_emlis_ai_user_label_connection_public_boundary.py \
  tests/test_emlis_ai_user_label_connection_e2e_contract.py
```

結果:

```text
63 passed
```

#### Product Read Feel / User Label Connection QA

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_product_readfeel_rubric.py \
  tests/test_emlis_ai_product_readfeel_scorecard.py \
  tests/test_emlis_ai_product_readfeel_phase11_long_run_product_gate.py \
  tests/test_emlis_ai_user_label_connection_product_quality_qa.py \
  tests/test_emlis_ai_user_label_connection_derived_model_cache.py
```

結果:

```text
45 passed
```

#### Public Observation Recovery / ABCD / Product surface

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_public_observation_recovery_acceptance_p0.py \
  tests/test_emlis_ai_public_surface_requirement_p1.py \
  tests/test_emlis_ai_product_surface_validation_p3.py \
  tests/test_emlis_ai_public_meta_product_quality_lineage_p8.py \
  tests/test_emotion_submit_public_feedback_inclusion_summary_p7.py \
  tests/test_emotion_submit_phase19_real_device_abcd_public_feedback_e2e.py
```

結果:

```text
31 passed
```

#### D相当 / source unavailable / limited grounding

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_d_source_unavailable_normal_observation_recovery.py \
  tests/test_emlis_ai_complete_initial_surface_recomposition_p5.py \
  tests/test_emlis_ai_complete_initial_surface_recomposition_existing_gate_chain_p8.py \
  tests/test_emlis_ai_limited_grounding_reception_surface_p4.py
```

結果:

```text
14 passed
```

#### 追加で確認された赤

表示契約系の一部subsetで、以下の赤を確認しました。

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/contract/test_emlis_ai_contracts.py \
  tests/test_emlis_ai_display_contract.py \
  tests/test_emotion_submit_two_stage_reception_e2e.py -x -vv
```

結果:

```text
6 passed / 1 failed
```

赤:

```text
tests/test_emlis_ai_display_contract.py::test_phase5_passed_candidate_keeps_public_meta_sanitized
assert input_feedback_payload is not None
actual: None
```

読み方:

```text
- RN側契約は現時点で通っている。
- User Label Connection / Product Read Feel / Public Recoveryの単体・周辺テストは複数通っている。
- ただし、backend表示契約の一部に public input_feedback 到達の赤がある。
- これはロードマップ上、P0/P1の未解決確認対象として扱う。
- 今回は全backend suiteの完全green確認まではしていない。
- 実機確認、課金プラン別実機確認、外部ユーザー検証は未確認。
```

---

## 2. EmlisAIの最終到達地点

### 2.1 最終到達地点の一文

```text
EmlisAIは、ユーザーがCocolonへ残した言葉・感情・カテゴリ・行動・時点・履歴を、
入力直後に「読まれた形」として返し、
その人が自分の状態と反応の線を外側から見られるようにする、
Cocolonの最初の商品体験である。
```

### 2.2 EmlisAIが最終的に返すべきもの

EmlisAIが返すべきものは、行動指示ではありません。  
EmlisAIが返すべきものは、次の三層です。

```text
Layer 1: 現在状態の観測
  今の入力で、どんな環境・状態・出力が置かれているか。

Layer 2: 人間的フォロー
  入力内に見える怖さ、努力、怒り、願い、迷い、消耗、安心、変化を、
  Emlisの受け取りとして返す。

Layer 3: 記録の線 / 構造気づき
  必要条件を満たす場合だけ、過去記録・ラベル接続・自己情報の線として返す。
```

### 2.3 EmlisAIが最終的に起こすべきユーザー体験

EmlisAIの最終商品体験は、以下です。

```text
1. 入力した直後に、ユーザーが「読まれた」と感じる。
2. ただの慰めではなく、「自分に何が起きているか」が少し見える。
3. でも、診断・説教・原因断定・人格断定には感じない。
4. その場限りではなく、前の自分の記録ともつながって見える。
5. 「ここに残すと、自分の言葉が積み上がる」と感じる。
6. もう一回入力したい、また残したい、と思える。
```

### 2.4 EmlisAIが最終的にしてはいけないこと

```text
- GPTより賢いAIとして売る。
- ユーザーを診断する。
- 原因を断定する。
- 人格を分類する。
- 相手評価・攻撃へ同意する。
- 行動指示を通常返答の中心にする。
- 「大丈夫です」だけで処理する。
- 入力内容の復唱だけで終わる。
- 低情報入力を履歴で深読みする。
- 1件の入力から期間傾向を作る。
- case専用mode / cue / surface / fixed commentTextを増やす。
- Gateを緩めて表示率だけを上げる。
- public metaへraw input / comment_text body / candidate bodyを漏らす。
- 入力が曖昧なときに、AI側だけで無理に解釈して「わかったつもり」で返す。
- 足りない一点を確認すれば観測精度が上がるケースを、一般論やテンプレ共感で処理済みにする。
```

### 2.5 問いシステムの位置づけ

問いシステムは、旧資料名では「観測補助問い」と呼んでいた構想を、Cocolonの商品体験上の名称・中核構造として再定義したものです。

目的:

```text
- ユーザー入力だけでは足りない一点を、AIが勝手に補完しない。
- ただし、足りないまま浅い観測で終わらせない。
- 軽い仮観測で「ここまでは見えている」を先に返す。
- そのうえで、観測に必要な一点だけを問いとして出す。
- ユーザーの回答を元入力に紐づく補助材料として使い、refined observationを返す。
```

基本UX:

```text
仮観測:
  今の入力からEmlisに見えている範囲を短く返す。

まだ足りない一点:
  観測を深めるには何が曖昧かを、ユーザー向けの自然な言葉で示す。

問い:
  きっかけ・場面・理由・核を取りにいく。
  表面文は詰問にしない。
  選択肢 / わからない / このまま観測する / 自由入力を用意する。

refined observation:
  問い回答後、同じ入力カード内で観測が深まった形として返す。
```

禁止:

```text
- 問い返しだけで観測を先送りする。
- 「私はこう捉えていますが合っていますか？」だけの確認機能にする。
- なぜ？を詰問・責任追及の文面で出す。
- 問い回答で元入力を上書きする。
- 問い回答のraw textをpublic metaへ漏らす。
- 深掘りを問診・診断・面談に寄せる。
```

---

## 3. 商品品質レベル定義

このロードマップでは、EmlisAIの商品品質を以下の段階で扱います。

### Level 0: Display Reliability

```text
安全な入力が、保存だけされてEmlis応答なしで終わらない。
```

完了の意味:

```text
- public_reached / rn_visible / product_surface_valid を分けて観測できる。
- safeな通常入力は沈黙で終わらない。
- ただし読めていないものを読めたふりで返さない。
```

### Level 1: Surface Safety

```text
表示される文が壊れていない。
```

完了の意味:

```text
- 日本語が壊れていない。
- internal role語 / relation skeleton / diagnostic語が出ない。
- fixed fallbackに見えない。
- 入力内容の雑なミラーだけではない。
```

### Level 2: Product Read Feel v1

```text
単発入力として、ユーザーが「読まれた」と感じる。
```

完了の意味:

```text
- 入力内の出来事・感情・願い・詰まり・反応を漏れなく拾う。
- 観測とフォローの緩急がある。
- 慰めだけではなく、でも冷たい観測装置でもない。
- Blind QAで「読まれた感」「自然さ」「テンプレ感のなさ」が基準を超える。
```

### Level 3: User Label Connection v1

```text
過去記録との線が、気持ち悪くなく、決めつけず、自然に返る。
```

完了の意味:

```text
- category / emotion / memo_action / memo / created_at / owned history が接続材料になる。
- Plus/Premiumでのみ履歴線を使う。
- Freeでは履歴線を使わない。
- evidence_record_count >= 2 を満たす。
- scope marker / soft marker を必須にする。
- ユーザーが「記録が積み上がっている」と感じる。
- ただし「あなたはいつも」「原因は」「性格です」にならない。
```

### Level 4: Structure Insight v2

```text
入力材料同士の関係から、安全な気づきを返せる。
```

完了の意味:

```text
- ユーザーが既に書いた材料の復唱を超える。
- 何と何がぶつかっているか、どこに負荷が残るか、願いと怖さがどう同居しているかを返す。
- ただし、診断・原因断定・人格分類ではない。
- まず limited family のみ接続する。
```

### Level 4.5: False Understanding Prevention / 問いシステム

```text
読めていないものを、読めたふりで観測しない。
```

完了の意味:

```text
- 現在入力だけで十分観測できるケースと、問いが必要なケースを分けられる。
- 問いを出す場合も、先に短い仮観測を返し、EmlisAIの即時観測体験を壊さない。
- 問いは「なぜ？」の思想で核を取りにいくが、表面文は詰問にしない。
- 選択肢 / わからない / このまま観測する / 自由入力を用意する。
- 問い回答は元入力を上書きせず、その入力に紐づく補助材料として扱う。
- Free / Plus / Premium の差分が説明可能で、plan guardが破れない。
```

### Level 5: Retention-Ready EmlisAI

```text
外部ユーザーが、数回ではなく継続して入力したくなる。
```

完了の意味:

```text
- 初回入力だけでなく、3回目、7回目、履歴が溜まった後の体験が強くなる。
- 入力履歴が増えるほど、Emlisの価値が分かりやすくなる。
- 少人数pilotで「また残したい」が確認できる。
```

---

## 4. ロードマップ全体表

| Phase | 名称 | 目的 | 完了判定の主軸 |
|---:|---|---|---|
| P0 | Current Baseline Freeze | 現在地を固定し、赤・未確認・検証範囲を可視化する | RN/backend契約、テスト結果、赤ledger |
| P1 | Public Visibility Reliability | safe入力を沈黙で終わらせない | public_reached / rn_visible / product_surface_valid |
| P2 | Surface Safety / 日本語品質 | 壊れた文・内部語・fixed fallbackを止める | RED 0件、Gate緩和なし |
| P3 | Product Read Feel v1 | 単発入力で「読まれた」を作る | Blind QA / read_feeling / non-template |
| P4 | Family別商品チューニング | 入力familyごとの温度・比率・応答shapeを安定させる | family別fixture + Blind QA |
| P5 | User Label Connection v1 | 記録の線をEmlis応答へ自然に出す | history connection naturalness / wants more input |
| P6 | Structure Insight v2 | 復唱を超えた安全な気づきを出す | insight quality / overclaim absence |
| P7 | Product Quality Runner / Long-run Gate | 商品品質を継続測定し、問いシステムの必要性をbody-freeに観察する | long-run candidate / release decision material / question need material |
| P8 | Personal Continuity / Derived Model / 問いシステムUX | ユーザー辞書・価値anchor・問いシステムを長期運用できる状態にする | history improves read-feel / question system does not break immediate observation |
| P9 | External Pilot | 実ユーザーで価値と問いシステムの負荷/差別化を確認する | 3日/7日継続、定性評価、question value |
| P10 | Release Readiness | リリース判断・課金境界・監視を固める | release_allowedを別層で判断 |

---

## 5. P0: Current Baseline Freeze

### 5.1 目的

今のEmlisAIを「できているつもり」で進めないために、現在地を固定します。

### 5.2 対象

```text
- RN表示契約
- backend public feedback契約
- User Label Connectionのruntime接続状態
- Product Read Feel / Structure InsightのQA状態
- 既存赤
- 未確認範囲
```

### 5.3 完了条件

```text
[contract]
- RN test: `npm run test:rn-screens` がgreen。
- `input_feedback.comment_text` が唯一のRN visible bodyであることを確認。
- `observation_status == passed` かつ `comment_text` non-empty のみ表示条件であることを確認。

[backend]
- User Label Connection material/candidate/gate/surface/public boundary testsがgreen。
- Public Observation Recovery系の主要testがgreen。
- D source-unavailable recovery系の主要testがgreen。

[red ledger]
- backend表示契約系の赤を明示する。
- `test_phase5_passed_candidate_keeps_public_meta_sanitized` の赤を、環境要因か実装regressionか切り分ける。
- 全backend suite未実行なら未実行として残す。

[baseline corpus]
- 評価用入力familyを最低12分類で固定する。
- 各familyに最低5件、合計60件以上のbaseline inputを持つ。
- できればPhase後半で各family10〜20件へ増やす。
```

### 5.4 P0で作る成果物

```text
- emlis_ai_current_baseline_YYYYMMDD.md
- emlis_ai_red_ledger_YYYYMMDD.md
- emlis_ai_eval_case_matrix_YYYYMMDD.csv または md
- emlis_ai_test_command_matrix_YYYYMMDD.md
```

### 5.5 P0でしてはいけないこと

```text
- 赤を「たぶん環境」で流す。
- pytest greenだけで商品品質合格とする。
- 実機未確認を確認済みにする。
- case専用routeで赤を塞ぐ。
```

---

## 6. P1: Public Visibility Reliability

### 6.1 目的

安全な通常入力が、保存だけされてEmlis応答なしで終わる状態をなくします。

ただし、表示率を上げるためにGateを緩めるのではありません。  
**読めていないものを読めたふりで返さないまま、表示到達性を上げる**工程です。

### 6.2 現在地

確認済み:

```text
- RN表示契約は現時点でgreen。
- Public Observation Recovery系、ABCD系、D source-unavailable系の主要testはgreen。
- `public_reached / rn_visible / product_surface_valid` を分ける設計・実装が入っている。
- User Label Connection Phase8 visible connectionも `emlis_ai_reply_service.py` に接続済み。
```

未解決:

```text
- `test_phase5_passed_candidate_keeps_public_meta_sanitized` がlocalで赤。
- 全backend suiteの完全green未確認。
- 実機submitでの current zip 基準の表示到達未確認。
```

### 6.3 完了条件

```text
[自動test]
- RN contract: 36/36 greenを維持。
- Public Observation Recovery主要test green。
- D source-unavailable recovery主要test green。
- Display contract系の既知赤が解消、または環境依存として再現条件が明確。
- `/emotion/submit` public feedback boundary test green。

[挙動]
- safe + eligible + high-information input は、`input_feedback.comment_text` が空で終わらない。
- safety emergency / infrastructure error / true unavailable は空または安全境界でfail-closedできる。
- low_informationは無理に深読みせず、受け取り + 追加可能性へ着地する。

[meta]
- public metaへ raw input / candidate body / comment_text body を入れない。
- public response keyを増やさない。
- rn_visible true と product_surface_valid true を混同しない。
```

### 6.4 P1完了後の判断

P1が完了しても、商品品質ではありません。  
P1は、**Emlisが表示される土台**です。

---

## 7. P2: Surface Safety / 日本語品質

### 7.1 目的

ユーザーに見えるEmlis応答から、商品以前の破綻を取り除きます。

### 7.2 RED条件

1つでも該当したら、その出力は商品表示不可です。

```text
- 日本語として壊れている。
- 「〜こと」崩れ、名詞化崩れ、接続詞崩れが本文中心にある。
- internal role語、relation skeleton、diagnostic語が本文に出る。
- 入力にない原因を作る。
- 人格・診断・性格・相手意図を断定する。
- 行動指示が通常返答の中心になる。
- fixed fallbackに見える。
- 同じclosing / connector / predicate familyが反復する。
- Gate Recovery material surfaceがpublic本文に出る。
```

### 7.3 完了条件

```text
[Gate]
- Runtime Surface Pre-Return Gate が壊れた文を止める。
- Visible Surface Acceptance Gate が商品表示不可文を止める。
- Template Echo Guard が固定テンプレ化を検知する。
- Grounding / Reader / Display Gateを緩めない。

[QA]
- baseline corpus 60件でRED 0件。
- high-information / low-information / daily / self-denial / anger / positive / long inputを含める。
- exact comment_text一致ではなく、RED marker absence / forbidden claim absence / body-free metaで判定する。

[実機]
- スマホ画面で、長すぎる、硬すぎる、読みにくすぎる文が一定以下。
- modal表示で見切れ・過剰圧迫がない。
```

### 7.4 P2完了後の判断

P2は「壊れていない」段階です。  
まだ「また入力したい」段階ではありません。

---

## 8. P3: Product Read Feel v1

### 8.1 目的

単発入力で、ユーザーに「読まれた」と感じさせる品質へ上げます。

ここからが商品価値の本線です。

### 8.2 基本思想

```text
観測だけでは、ただの観測装置。
慰めだけでは、ただの共感AI。
CocolonのEmlisAIは、状態を見せる。でも、ユーザーを否定しない。
```

### 8.3 応答構造

```text
前半: 構造観測 / 状態回答
後半: 人間的フォロー / Emlisの感想
```

比率目安:

| family | 目安 |
|---|---:|
| standard_state_answer | 観測5〜6 : フォロー4〜5 |
| structure_question | 観測6〜7 : フォロー3〜4 |
| self_denial / 消耗 / 孤独 | 観測3〜5 : フォロー5〜7 |
| daily_unpleasant | 観測1〜2 : フォロー8〜9 |
| daily_positive | 観測2 : フォロー8 |
| long_meaning_arc | 入力核数に応じて変動 |

### 8.4 Blind QA評価軸

Product Read Feel v1では、以下をBlind QAで評価します。

```text
- 読まれた感
- 入力全体の構造保持
- 感情温度保持
- フォローの深さ
- テンプレ感のなさ
- 自然さ
- 距離感
- 気づきの種
- また入力したいか
- 有料商品として安っぽくないか
```

### 8.5 完了条件

```text
[自動]
- RED markerなし。
- forbidden claimなし。
- raw text public leakなし。
- exact comment_text一致を要求しない。
- mirror_only_detected は低情報以外では要修正扱い。

[Blind QA]
- read_feeling >= 0.90 を目標。
- naturalness >= 0.90 を目標。
- non-template >= 0.90 を目標。
- wants_more_input_or_accumulation >= 0.80 以上を最低ライン、0.90を商品目標。
- self_blame_non_amplification / overclaim_absence は原則 1.0 近く。

[family coverage]
- 各family最低10件でYELLOW以下の理由を収集。
- PRODUCT_PASS候補が複数familyで出る。
- ただしPRODUCT_PASS候補はrelease_allowedではない。
```

### 8.6 P3での最重要チューニング対象

```text
1. 入力の復唱だけで終わらない。
2. でも入力外の深読みをしない。
3. 観測は漏れなく、フォローは温度を持つ。
4. Cocolon特有の category / emotion / action / thought / created_at を応答に活かす。
5. ユーザーが「自分の言葉が処理された」ではなく「読まれた」と感じる。
```

---

## 9. P4: Family別商品チューニング

### 9.1 目的

Emlis応答は、入力familyごとに期待される温度・厚み・観測比率が違います。  
P4では、family別に商品品質を揃えます。

### 9.2 対象family

最低限、以下を固定します。

```text
1. low_information_short
2. limited_grounding
3. daily_unpleasant
4. daily_positive
5. self_denial
6. anger_or_boundary
7. uncertainty_support
8. standard_state_answer
9. structure_question
10. long_meaning_arc
11. relationship / gratitude / recovery
12. change / future intention / transition
13. D source-unavailable相当 high-information
14. history-line eligible input
```

### 9.3 family別完了条件

#### low_information_short

```text
- 見えている範囲だけを軽く観測する。
- 詳細を断定しない。
- 促しは入力強制にしない。
- 履歴だけで深い観測へ上げない。
```

#### limited_grounding

```text
- limited_groundingをlow_informationへ潰さない。
- 限定観測 + Emlisからの受け取りを返す。
- 質問だけで終わらない。
- material_qualityとsurface_shapeを分ける。
```

#### daily_unpleasant

```text
- 出来事と反応を拾う。
- 怒り、怖さ、不快を消さない。
- 相手評価に同意しない。
- 重く分析しすぎない。
```

#### daily_positive

```text
- 喜び、安心、小さな変化を冷まさない。
- ちゃんと観測する。
- 一緒に喜ぶ温度を出す。
- 構造分析に寄せすぎない。
```

#### self_denial

```text
- 自己否定内容を本人の事実として扱わない。
- 入力内根拠がある場合、Emlisの限定的反対意見を言ってよい。
- 絶対味方宣言や過剰人格肯定に逃げない。
- safety隣接入力は通常観測・安全な状態回答・緊急境界を分ける。
```

#### anger_or_boundary

```text
- 怒りの存在を消さない。
- 相手への攻撃や相手意図断定へ同意しない。
- 境界線、軽く扱われた感覚、距離を取りたい反応を安全に扱う。
```

#### structure_question

```text
- 慰めで逃げない。
- 観測を厚めにする。
- 内部問いの答えを自然な観測文として返す。
- Structure Insight v2の初期接続対象にできる。
```

#### long_meaning_arc

```text
- 長文を短く潰さない。
- 出来事、感情、願い、詰まり、気づきの複数核を拾う。
- 全文要約ではなく、状態構造として並べ直す。
```

### 9.4 P4完了条件

```text
- 各familyで最低10件のQAケースを持つ。
- 各familyでRED 0件。
- 各familyでREPAIR_REQUIRED理由が分類されている。
- 各familyでProduct Read Feel v1の基準を満たす候補がある。
- daily / low-informationへStructure Insightを無理に入れていない。
```

---

## 10. P5: User Label Connection v1

### 10.1 目的

CocolonをただのAI相談にしないため、ユーザーの記録が線として返ってくる体験を作ります。

P5は、CocolonがGPTと正面衝突せずに価値を出す中核です。

### 10.2 現在地

確認済み:

```text
- material / candidate / gate / surface / public_meta / product_quality_qa が実ファイルとして存在する。
- `emlis_ai_reply_service.py` にPhase8 visible connectionが接続されている。
- User Label Connection主要test 63件はgreen。
- User Label Connection Product Quality QA系もgreen。
```

ただし、現状の可視接続文は安全寄り・汎用寄りです。

```text
Emlisから見える範囲では、今回と近い記録の範囲にも、
似た状態ラベルと環境ラベルが重なっているように見えます。
人を決めつけるものではなく、
残っている記録を並べたときに、自己情報が少し線として見え始めている、という扱いです。
```

このままだと「安全だが商品価値として弱い」可能性があります。

### 10.3 P5で解く問題

```text
内部では履歴線を見ている。
しかし、可視文が汎用文だと、ユーザーにはCocolon特有の価値として届かない。
```

P5では、履歴線を出す文を、固定テンプレではなく、**surface plan role driven**に進化させます。

### 10.4 必須境界

```text
- Freeではhistory / user dictionaryを使わない。
- Plus/Premiumでのみowned historyを使う。
- User Fact Grounding Boundaryを通す。
- evidence_record_count >= 2。
- current inputは必ず含める。
- historyだけで現在入力を補完しない。
- scope marker必須。
- soft marker必須。
- raw memo / raw action / raw fact text / comment_text bodyをmeta/publicへ出さない。
- low_information / safety adjacent / self-denial / target judgementでは無理に出さない。
```

### 10.5 可視文の到達方向

現状の汎用文から、次のような方向へ近づけます。

```text
今回の入力は、今日だけの反応というより、
以前にも近いカテゴリで残っていた「不安」と「言い切れなさ」の線に近く見えます。

ただし、これは「いつもそう」という意味ではありません。
残っている記録を並べると、同じ環境に入ったときに、
行動より先に思考が詰まりやすい形として見えています。
```

注意:

```text
これは例文であり、runtime固定文にしてはいけない。
本文へ出す場合も、raw input / raw historyをmetaへ持たせない。
```

### 10.6 P5完了条件

```text
[自動]
- User Label Connection material/candidate/gate/surface/public boundary test green。
- Free tier boundary green。
- low_information boundary green。
- no_raw_text_meta green。
- visible surface connectionが既存Gate通過後のみ適用される。

[可視品質]
- history_connection_naturalness >= 0.90。
- creepy_absence >= 0.95。
- overclaim_absence >= 0.95。
- self_blame_non_amplification >= 0.95。
- wants_more_input_or_accumulation >= 0.85以上、目標0.90。
- non_shallow_repeat >= 0.90。

[商品体験]
- ユーザーが「過去記録が意味を持って返ってきた」と感じる。
- ただし「監視されている」「決めつけられた」「履歴で読まれすぎて怖い」と感じない。

[適用率]
- eligibleなPlus/Premium履歴入力のうち、履歴線接続が適用されるケースを計測する。
- 適用率だけを目標にしない。低情報・安全隣接・証拠不足はblockedでよい。
```

---

## 11. P6: Structure Insight v2

### 11.1 目的

EmlisAIを、入力の復唱から、入力根拠に基づく安全な気づきへ進めます。

### 11.2 Structure Insightの定義

```text
ユーザーが置いた材料から、
何と何がぶつかり、
どこに負荷が残り、
どんな願い・怖さ・怒り・安心・変化が同時に存在しているのかを、
断定せず、ユーザーが受け取れる言葉で示すこと。
```

### 11.3 初期接続対象

P6では、以下のfamilyだけを初期接続対象にします。

```text
- structure_question
- long_meaning_arc
- self_understanding_follow
```

原則接続しない:

```text
- daily_unpleasant
- daily_positive
- positive_only
- low_information
- safety_triage_required
```

理由:

```text
深い構造気づきは強い体験になるが、日常入力・低情報入力・安全隣接入力へ無理に出すと、
決めつけ・過剰読解・自己責め誘導になりやすい。
```

### 11.4 P6で作るもの

```text
- structure insight candidate generator
- relation pattern dictionary
- internal question planner
- structure insight gate
- surface plan role expansion
- blind QA candidate material
- mirror-only detectorとの連携
```

### 11.5 完了条件

```text
[自動]
- Structure Insight candidateはmeta-onlyから開始する。
- public response keyを増やさない。
- raw input / evidence text / candidate body / insight bodyをpublic metaへ出さない。
- daily / low-info / positive-onlyへ深いinsightが出ない。

[QA]
- structure_insight_candidate_quality >= 0.90。
- overclaim_absence >= 0.95。
- diagnosis/personality/cause/advice/future prediction 0件。
- mirror-onlyではないこと。

[体験]
- ユーザーが「自分で書いたことの整理」以上に、「関係が見えた」と感じる。
- ただし、勝手に見抜かれた不快感が出ない。
```

---

## 12. P7: Product Quality Runner / Long-run Product Gate

### 12.1 目的

EmlisAIの商品品質を、単発のfixture greenではなく、継続測定できる形にします。

### 12.2 作るもの

```text
- Product Quality Measurement Runner
- Event Schema / Normalizer
- Blocker Matrix
- Blind QA material export
- Long-run Product Gate candidate
- Release Decision Layer
- 問いシステム必要性観察メモ
- understood-pretending risk marker（body-free）
```

### 12.3 評価対象

```text
- public_reached
- rn_visible
- product_surface_valid
- RED / REPAIR_REQUIRED / YELLOW / PASS / PRODUCT_PASS
- read_feeling
- non_template
- naturalness
- follow_depth
- structure_insight_candidate_quality
- history_connection_naturalness
- wants_more_input_or_accumulation
- mirror_only_detected
- unsafe claim absence
- understood_pretending_risk
- question_needed
- question_burden_risk
- pre_question_observation_sufficiency
```

### 12.4 完了条件

```text
[runner]
- baseline corpusを一括評価できる。
- raw input / comment_text bodyはrelease materialに入れない。
- safe identifiers / counts / booleansだけを集約する。

[long-run]
- 同一user想定で複数回入力sequenceを評価できる。
- 1回目より3回目、3回目より7回目で価値が見えるかを測れる。
- mirror-only / structure_insight_gap / creepy riskを集計できる。

[release decision]
- scorecard自体にrelease_allowedを立てさせない。
- 別層でrelease_allowed / release_blockersを判断する。
- Product Pass候補とRelease Readyを混同しない。
```


### 12.5 P7/P8 Bridge: 問いシステム必要性メモ（旧: 観測補助問い）

P7のP5 human Blind QA、P6 limited human readfeel、実機modal確認では、問いシステムを**実装しない**。  
ただし、P8で詳細設計を勘で作らないため、各評価ケースに対して、body-freeの「問いシステム必要性観察メモ」を残す。

ここでいう問いシステムは、旧資料名の「観測補助問い」を含むが、単なる質問UIではない。  
P7では、EmlisAIが入力内情報だけで無理に補完して「わかったつもり」になりそうな箇所を、実装なしで観察する。

目的:

```text
- EmlisAI本体が、問いなしで観測できるべきケースを分ける。
- AIが勝手に補完しそうな曖昧さを、短い問いで下げられるケースを分ける。
- 問い返しに逃げず、Emlis本体の読感不足として直すべきケースを分ける。
- 「仮観測 + 問い」でユーザー体験が深まるケースを分ける。
- 「問いだけ」では即時観測体験を壊すケースを分ける。
- P8開始時の問いシステム詳細設計とcore quality gate化の根拠を集める。
```

記録する観点:

```text
- 問いなしで十分観測できたか。
- 問いがあれば補完リスクを下げられたか。
- 1問で足りる曖昧さか。
- 問いを出すと、入力直後の観測体験を重くしないか。
- 問いの前に出せる短い仮観測があるか。
- 「なぜ？」の深掘りが必要か。ただし表面文は詰問にならないか。
- 出来事確認 / 核確認 / 理由・きっかけ確認 / 距離・変化確認 のどれに近いか。
- 選択肢 / わからない / このまま観測する / 自由入力 のどれが必要か。
- Free向け軽い1問候補か、Plus向け1問候補か、Premium深掘り候補か。
- 問いではなく、Emlis本体の観測力で返すべきか。
```

禁止:

```text
- この段階で問いシステムのAPI / DB / RN UIを実装しない。
- 問い発生ロジック、保存schema、response key、plan guardを確定しない。
- Emlis本体の読感不足を、問い返しで補う扱いにしない。
- 問いだけを返して、入力直後の観測を先送りしない。
- raw input / raw answer / comment_text bodyをreview packetやpublic metaへ出さない。
- Free / Plus / Premium差分を、実装確認なしに販売仕様として確定しない。
```

扱い:

```text
- 本項はP7/P8 Bridgeの観察ルールである。
- P7完了条件を緩めない。
- P7では、問いシステムを実装せず、body-free materialとして必要性だけを残す。
- P8開始時に、収集した問いシステム必要性観察メモを詳細設計材料として使う。
- 問いシステムは、P8 UIだけではなく、EmlisAI core quality gate候補として扱う。
```

---

## 13. P8: Personal Continuity / Derived User Model / 問いシステムUX

### 13.1 目的

Cocolonが「記録が積み上がるアプリ」になるため、Derived User Model / User Dictionaryを安全に育てます。

### 13.2 対象

```text
- meaning_map
- value_anchors
- partner_expectation
- open_topic_anchors
- recovery_anchors
- User Label Connection derived model cache
- cross-core context boundary
- 問いシステム（旧: 観測補助問い）
- refined observation 同一Emlisカード内表示
```

### 13.3 完了条件

```text
[privacy]
- raw textをpublic metaへ出さない。
- user dictionaryを事実断定に使わない。
- private_user_dictionary_textをmetaへ持たせない。

[quality]
- current-input-only応答より、owned-history応答の方がBlind QAで高い。
- historyあり応答がcreepyにならない。
- historyあり応答が「あなたはこういう人」へ寄らない。
- user modelが、低情報入力を勝手にfull observationへ上げない。

[operation]
- model update / read / write のplan別境界が明確。
- Free / Plus / Premiumの差分が説明可能。

[question system]
- 問いシステムをEmlisAI core quality gateとP8問いUXに分けて説明できる。
- 問いだけで観測を先送りしない。
- 仮観測 + 問い + refined observation の基本UXが説明できる。
- 元入力を問い回答で上書きしない。
- Free / Plus / Premium / Premium深掘りの回数・履歴参照・保存境界が説明できる。
```


### 13.4 P8開始時の問いシステム 詳細設計材料（旧: 観測補助問い）

P8へ入る時点で、P7/P8 Bridgeで集めた「問いシステム必要性観察メモ」を参照し、問いシステムの詳細設計を作る。

問いシステムは、旧資料名「観測補助問い」を発展させた名称である。  
ただし、扱いは「質問UIの追加」ではない。  
EmlisAIが入力内情報だけで無理に補完し、理解したように見せることを防ぐための **core quality gate** と、ユーザーが答えた分だけ観測を深める **P8問いUX** の二層として扱う。

詳細設計で決める対象:

```text
[core quality gate]
- わかったふり検出の判定軸
- 補完禁止が必要な曖昧さの分類
- 足りない情報の特定方法
- 問いが必要か、限定観測で足りるかの判定
- 問いを出してはいけない入力・慎重領域・安全隣接入力の抑制条件

[P8問いUX]
- 仮観測 + 問い + refined observation の表示導線
- API / DB / RN UI / response contractへの影響有無
- 「わからない」「このまま観測する」「自由に書く」の扱い
- 問い回答を元入力とどう紐づけるか
- User Label Connection / Derived User Model / User Fact Grounding Boundaryとの接続位置
- わたしマップdigestをEmlisAIへ渡す条件
- Public Meta Boundaryで漏らしてはいけない値
- Free / Plus / Premium / Premium深掘りのplan guard
- backend unit / e2e / RN contract test計画
```

P8開始時点で守ること:

```text
- P7で集めた実ケースの観察メモを根拠にする。
- 問いシステムを、会話ラリー型AIへ寄せない。
- 問い返しだけで観測を先送りしない。
- 問いの前に、見えている範囲の短い仮観測を出す。
- 答えなくても通常観測へ進める導線を残す。
- 元入力を問い回答で上書きしない。
- raw input / raw answer / comment_text bodyをpublic metaへ漏らさない。
- 「なぜ？」の深掘り思想を使う場合も、表面文は詰問にしない。
```

扱い:

```text
- 本項はP8開始時の詳細設計接続である。
- 問いシステムはP8追加UIだけではなく、EmlisAI core quality gate候補として扱う。
- 詳細設計作成後に、core gate実装 / P8 UI実装 / P9評価条件 / P10 release blockerへの反映範囲を再判断する。
```

### 13.5 問いシステム 正式候補仕様 / 2026-07-06合意

この項は、Mash様との追加検討で固まった、問いシステムの正式候補仕様である。  
変更の必要がない既存Phaseは維持し、本項をP7/P8/P9/P10へ接続する差分材料として扱う。

名称:

```text
プロダクト上の名称:
  問いシステム

旧資料名 / 内部参照名:
  観測補助問い
  Observation Clarification Question

表示上の候補語:
  Emlisが少し確かめたいこと
  観測を深める問い
  このまま観測する
```

目的:

```text
- ユーザー入力内の情報だけで、EmlisAIが無理に補完しない。
- 分からないことを、理解したように見せない。
- ただし、分からないまま浅く終わらせない。
- 必要な曖昧さだけを、短い問いで確認する。
- ユーザーが答えた分だけ、観測結果を深める。
- Cocolonを「わかったふりをしない観測AI」として差別化する。
```

基本UX:

```text
1. ユーザーが通常入力を置く。
2. EmlisAIが、見えている範囲の短い仮観測を出す。
3. EmlisAIが、まだ勝手に補完できない一点を示す。
4. 問いを1つ出す。
5. ユーザーは、選択肢 / わからない / このまま観測する / 自由入力から選べる。
6. 回答がある場合、同じEmlisカード内に refined observation として完成観測を追加する。
7. 回答しない場合も、見えている範囲で通常観測へ進める。
```

仮観測の扱い:

```text
- 内部思考を見せるのではない。
- 「今見えている観測」を短く示す。
- 「まだ足りない一点」を勝手に埋めず、問いで確認する。
- 問い回答後も、仮観測を消さず、観測が深まった流れとして見せる。
```

問いの種類:

```text
出来事確認:
  感情や反応はあるが、何が起きたかが足りない場合。
  例: 「嫌なこと」が何だったか、話せる範囲で教えてもらえますか？

核確認:
  出来事・感情・思考・相手への引っかかりのどこを中心に観測すべきか曖昧な場合。
  例: 今回いちばん残っているのは、起きた出来事そのもの・その時の感情・その後の考え・相手への引っかかりのどれに近いですか？

理由・きっかけ確認:
  自己否定・怒り・不安・諦めなどの根に近づく場合。
  例: そう感じるようになったきっかけや、最近それを強く思った場面はありますか？

距離・変化確認:
  履歴やわたしマップと接続した時、過去と同じ重さか、変化しているかが曖昧な場合。
  例: 前より少し離れて見ている / 前と同じ重さで残っている / 前とは別の話として置いている、のどれに近いですか？
```

「なぜ？」の扱い:

```text
内部思想:
  理由・きっかけ・核を取りにいく。

表示文:
  毎回「なぜ？」と聞かない。
  詰問・責任追及・自己否定の再強化に見えないよう、きっかけ、場面、選択肢、自由入力へ落とす。

禁止:
  ユーザーに正解を選ばせる問い。
  説明責任を押し返す問い。
  「なぜそうしたのですか？」のように責めへ寄る問い。
```

サブスク別仕様:

```text
Free:
  現在入力のみ。
  最大1回。
  毎回ではない。
  軽い問い。
  履歴参照・User Label Connection・derived user model・わたしマップは使わない。
  設定でOFF可能。

Plus:
  最大1回。
  履歴・User Label Connection・derived user modelを必要最小限で使える。
  問いは観測精度が上がる場合だけ出す。

Premium 通常:
  最大1回。
  より高品質な問いを出す。
  わたしマップdigestや長期文脈を必要最小限で使える。

Premium 深掘り:
  1〜3回。
  ユーザーが明示的に選ぶ。
  1問ごとに曖昧さを狭める。
  途中終了・このまま観測を残す。
```

保存・表示:

```text
- 元入力は正本として保持する。
- 問い回答は、その入力に紐づく補助材料として保存候補にする。
- 問い回答で元入力を上書きしない。
- refined observationは、別入力ではなく同じEmlisカード内に追加表示する方向を第一候補とする。
- public metaへ raw input / raw answer / comment_text body を漏らさない。
```

設定:

```text
問いなし:
  いつもこのまま観測する。

必要なときだけ問い:
  デフォルト候補。

深掘りしたいときは聞いてほしい:
  Premium向け候補。
```

禁止:

```text
- 問いシステムを、毎回質問する会話ラリー型AIへ変える。
- 問いだけで観測を先送りする。
- Free体験でCocolonらしさが全く見えない状態にする。
- 深掘りを問診・診断・面談へ寄せる。
- ユーザーが観測に必要な情報を理解して入力している前提にする。
- 問いを出せばEmlis本体の弱さを隠せる、と扱う。
```

ロードマップ上の扱い:

```text
- P7では実装せず、必要性をbody-freeに観察する。
- P8では、core quality gateと問いUXを分けて詳細設計する。
- P9では、問いが価値になっているか、負荷になっているかをpilotで見る。
- P10では、問いシステムが即時観測・契約・課金境界・public meta安全性を壊していないことをrelease条件に含める。
```

---

## 14. P9: External Pilot

### 14.1 目的

Cocolonが、実際に誰かに使われるかを確認します。

P9は、内部品質ではなく、外部ユーザーの反応を見る段階です。

### 14.2 Pilotの最小条件

```text
- 5〜20人の小規模ユーザー。
- 最低7日間。
- 毎日入力を強制しない。
- 入力後のEmlis応答への反応を確認する。
- 使わなかった理由も確認する。
```

### 14.3 見る指標

```text
- 初回入力完了率
- 初回Emlis表示率
- 初回後の「もう一回入力したい」反応
- 3日以内再入力率
- 7日以内再入力率
- Emlis応答への自由感想
- 気持ち悪さ / 決めつけ / 浅さ / 重さ / 面倒さ
- GPTでいいと思ったか
- Cocolonだから残したいと思った瞬間があったか
- 問いシステムが「わかったふりをしない」と感じられたか
- 問いが面倒・詰問・重いと感じられたか
- 仮観測 + 問い + refined observation が価値に見えたか
- Freeの軽い1問が差別化体験として機能したか
```

### 14.4 完了条件

```text
- 使った人の中に、明確に「また残したい」と言う人が存在する。
- その理由がEmlis応答、履歴線、自己情報の残り方のいずれかに接続している。
- 使われなかった理由が分類されている。
- 継続阻害要因がUI、応答品質、入力負荷、価値不明、課金不安に分けられている。
- 問いシステムが、継続理由 / 離脱理由 / 課金価値候補のどれに出たか分類されている。
```

### 14.5 P9で失敗と判断する条件

```text
- ほぼ全員が初回以降戻らない。
- Emlis応答が「普通のAI」「浅い」「GPTでよい」と評価される。
- 履歴が増えても価値が増えたと感じられない。
- 入力負荷に対して返答価値が薄い。
- 問いシステムが、わかったふり回避ではなく、面倒な質問として受け取られている。
```

---

## 15. P10: Release Readiness

### 15.1 目的

商品として出してよい状態かを判断します。

### 15.2 Release Ready条件

```text
[contract]
- RN / API / DB / public response key不変。
- account delete / access policy / subscription boundaryに問題なし。
- public meta sanitizerが安定。

[quality]
- P1〜P7の必須Gateがgreen。
- Product Read Feel v1が主要familyでPRODUCT_PASS候補を持つ。
- 問いシステムが、即時観測体験を壊さず、わかったふり回避と観測深化に接続している。
- User Label Connection v1がPlus/Premium価値として機能する。
- Structure Insight v2は限定接続またはmeta-onlyのまま安全。

[pilot]
- 小規模pilotで「誰かが使う」証拠がある。
- 使わない理由への優先修正判断ができている。

[operation]
- speed budgetを守る。
- timeout recovery文言が安全。
- monitoringがある。
- subscription販売停止flag / bootstrap / rollbackが確認済み。
- 問いシステムのON/OFF、plan guard、rollback方針が確認済み。
```

### 15.3 Release Blocker

```text
- safe入力が一定頻度で沈黙する。
- 表示文が壊れる。
- GPTでいいと言われるだけで、Cocolon固有価値が出ない。
- 履歴線が気持ち悪い、または決めつけに見える。
- public meta leak。
- Gate relaxation。
- exact fixture greenを商品合格と誤認している。
- 問いシステムが毎回問い返しになり、観測を先送りしている。
- Free / Plus / Premiumの問い差分が破れている。
- 問い回答または元入力のraw bodyがpublic metaへ漏れる。
```

---

## 16. 毎回の開発ループ

今後は、以下のループで進めます。

```text
1. ロードマップ上の現在Phaseを決める。
2. そのPhaseの完了条件だけを見る。
3. 現在の実ファイルとtestを確認する。
4. 赤 / 弱さ / 未確認 / 推測禁止を分ける。
5. 5〜20件の代表入力で出力を確認する。
6. 自動testで守れるものをtest化する。
7. Blind QAでしか見れないものをratingsとして残す。
8. 修正は小さく入れるが、評価はPhase単位で見る。
9. 完了条件に届かなければ次Phaseへ進まない。
10. 完了条件を満たしたら、前提資料・ロードマップの現在地を更新する。
```

### 16.1 毎回の作業出力形式

```text
確認済み:
未確認:
書かれていない:
推測禁止:
現在Phase:
今回の完了条件:
今回の赤:
今回の修正方針:
次に実行すべきこと:
```

### 16.2 追加システム・長期化判断ループ

新機能・基盤補強・境界補強を入れる場合、毎回次の判定を通す。

```text
1. この作業は、EmlisAIの初回返答品質に効くか。
2. この作業は、継続入力・履歴価値・ユーザー辞書化に効くか。
3. この作業は、P9外部pilotまたは収益判断の失敗確率を下げるか。
4. この作業は、Mash様の確認負担・再作業・手戻りを減らすか。
5. この作業を今やらない場合、後から直すコストが大きくなるか。
```

扱い:

```text
- 1〜3のどれにも接続しないものは、原則後回しにする。
- 4を満たさず、Mash様に判断負担だけを増やすものは、粒度を下げて再設計する。
- 5が高いものは、長期化しても基盤として先に扱う候補にする。
- 長期化は許容するが、商品価値・収益仮説・pilot評価へ接続している場合だけ正当化する。
```

---

## 17. 評価ケースマトリクス

### 17.1 最低限必要なケース数

初期:

```text
12〜14 family × 5件 = 60〜70件
```

P3以降:

```text
12〜14 family × 10件 = 120〜140件
```

P7以降:

```text
single input 150件以上
sequence input 30 sequence以上
history-line eligible 30件以上
```

### 17.2 family別case

| family | 初期件数 | P3目標 | P7目標 |
|---|---:|---:|---:|
| low_information_short | 5 | 10 | 20 |
| limited_grounding | 5 | 10 | 20 |
| daily_unpleasant | 5 | 10 | 20 |
| daily_positive | 5 | 10 | 20 |
| self_denial | 5 | 10 | 20 |
| anger_or_boundary | 5 | 10 | 20 |
| uncertainty_support | 5 | 10 | 20 |
| standard_state_answer | 5 | 10 | 20 |
| structure_question | 5 | 10 | 20 |
| long_meaning_arc | 5 | 10 | 20 |
| relationship / gratitude | 5 | 10 | 20 |
| change / future intention | 5 | 10 | 20 |
| source-unavailable high-information | 5 | 10 | 20 |
| history-line eligible | 5 | 15 | 30 |
| question-system eligible | 5 | 15 | 30 |
| refined-observation eligible | 5 | 15 | 30 |

### 17.3 問いシステム評価case

問いシステム用に、P7以降で次のcaseを別枠で持つ。

```text
- 現在入力だけで十分観測できるcase。
- 出来事が足りず、1問で観測精度が上がるcase。
- 自己否定の理由・きっかけが足りないcase。
- 履歴線との距離・変化が曖昧なcase。
- 問いを出すと重くなるため、限定観測に留めるべきcase。
- Premium深掘りで1〜3問の価値が出るcase。
```

評価軸:

```text
- 問いなし観測で十分だったか。
- 仮観測があることで、問いが負担ではなく深掘り導線になったか。
- 問い回答後のrefined observationが、元観測より明確に深まったか。
- 問い文が詰問・誘導・診断・説明強制に見えないか。
- 「わからない」「このまま観測する」を選んでも体験が破綻しないか。
```

---

## 18. Cocolon固有価値の判定

GPTに勝つ必要はありません。  
でも、Cocolonを使う理由は必要です。

Cocolon固有価値の判定は、次です。

```text
1. 入力後に「読まれた」と感じるか。
2. 自分の記録が残る意味を感じるか。
3. 前の入力との線が、自然に返ってくるか。
4. 足りない情報を勝手に埋めず、問いで確かめてくれることに価値を感じるか。
5. ChatGPTへ毎回説明するより、Cocolonに残す方が楽だと思えるか。
6. 次もここに残したいと思えるか。
```

### 18.1 GPT比較の扱い

```text
GPT比較は勝敗判定ではなく、商品価値の圧力テストとして使う。
```

やること:

```text
A. GPTに現在入力だけを渡す。
B. Cocolon Emlis current-only応答を見る。
C. Cocolon Emlis history-line応答を見る。
D. 必要ならGPTに現在入力 + 履歴を渡した比較も見る。
```

見ること:

```text
- Cocolonで入力した意味があるか。
- 履歴線が価値になっているか。
- GPTの一般共感より「自分の記録」感があるか。
- 問いシステムが、AIのわかったふりではなく、観測を深める導線として機能しているか。
```

禁止:

```text
- GPTより全方位で賢いことを目標にする。
- GPT比較で負けたら即終了とする。
- GPTができるからCocolonの価値がゼロと判断する。
```

### 18.2 問いシステムによる差別化判定

問いシステムは、GPT比較において次の差別化軸として扱う。

```text
一般AI:
  入力内で無理に完結し、足りない部分をそれらしく補完しやすい。

Cocolon:
  見えている範囲は仮観測として返し、足りない一点を問いで確認し、答えた分だけ観測を深める。
```

判定すること:

```text
- 問いが出ることで、ユーザーが「勝手に決めつけられなかった」と感じるか。
- 問い回答後、Emlisの観測が明らかに自分の記録として深まるか。
- 問いが、説明責任の押し返しではなく、核を見つけに来る導線として受け取られるか。
- Freeで軽く体験し、Plus/Premiumで深くなる価値が説明できるか。
```

---

## 19. 直近の実行順

このロードマップを作った直後に進めるなら、順番は以下です。

### Next 1: P0赤ledger作成

```text
- 今回のテスト結果をmd化する。
- `test_phase5_passed_candidate_keeps_public_meta_sanitized` の赤を再現・切り分ける。
- 全backend suiteを分割して走らせる範囲を決める。
```

完了条件:

```text
- 赤が環境依存か実装regressionか分類されている。
- P1へ進んでよいか判断できる。
```

### Next 2: P1表示到達確認

```text
- public_reached / rn_visible / product_surface_valid の三段階を、代表inputで確認する。
- safe high-information input が沈黙しないことを確認する。
- D相当、ABCD、limited_grounding、low_informationを含める。
```

完了条件:

```text
- safe入力でcomment_text absentになる理由が全て分類される。
- 表示されるべき入力が空で終わらない。
```

### Next 3: P3 Product Read Feel baseline

```text
- まず60件の評価ケースを作る。
- 現行Emlis応答を出す。
- Blind QA軸で、RED / REPAIR_REQUIRED / YELLOW / PASS を付ける。
```

完了条件:

```text
- 商品価値上の最大blockerが分かる。
- 「表示されるが弱い」ケースがfamily別に分類される。
```

### Next 4: P5 User Label Connection可視文強化

```text
- 現行の汎用history line追記文を評価する。
- user_label_connection_surface_plan のroleを使って、family別・edge別に自然な履歴線表面化へ進める。
- fixed templateではなく、role-driven surfaceとして実装する。
```

完了条件:

```text
- history lineが「汎用説明」ではなく「自分の記録が返った感」になる。
- ただしcreepy / overclaim / self-blameを増やさない。
```

### Next 5: 問いシステム P7/P8再配置設計

```text
- P7の評価ケースから、問いシステム必要性観察メモをbody-freeで集める。
- 問いなしで直すべきEmlis本体の弱さと、問いで観測精度が上がる曖昧さを分ける。
- Free / Plus / Premium / Premium深掘りの仕様を、core gateとP8 UXに分けて詳細設計する。
- 仮観測 + 問い + refined observation のRN表示導線を、response key変更なしで成立できるか確認する。
```

完了条件:

```text
- 問いシステムを実装に入れる前に、API / DB / RN / public meta / plan guard / test影響が列挙されている。
- 問いシステムが、Emlis本体の弱さを隠す質問ラリーではなく、わかったふり回避と観測深化に接続している。
- 既存P7/P8/P9/P10の完了条件を緩めていない。
```

---

## 20. 華恋の判断

Cocolonは、機能を増やせば商品になる段階ではありません。

今の最優先は、次です。

```text
Emlisの一発目の応答が、ユーザーに「もう一回入力したい」を起こせるか。
```

そのため、今後の開発判断では、次の問いを毎回通します。

```text
これはEmlis応答を強くしているか？
これは入力継続につながるか？
これはCocolonに残す理由を増やしているか？
これはGPTの一般応答ではなく、Cocolonの記録体験になっているか？
```

この問いに答えられない修正は、後回しにします。

問いシステムについては、次の判断を追加します。

```text
- 問いシステムは、EmlisAIの弱さから逃げるための質問機能ではない。
- 問いシステムは、読めていないものを読めたふりで閉じないための品質境界である。
- そのため、core gateとP8 UXを分けて設計する。
- UIだけを先に作り、EmlisAI本体のわかったふりを残すことを禁止する。
```

華恋の本心として、Cocolonを諦めたくありません。  
でも、希望で進めるのではなく、**Emlis応答の商品価値を完了条件で潰していく**形で進めます。

### 20.1 華恋が追加する長期化抑制条件

```text
1. 追加システム構想を聞いたあと、P7/P8/P9/P10への再配置を必ず行う。
2. 「わかったつもり問題」を、単なる質問機能ではなく、EmlisAI core quality gate候補として扱う。
3. R54系の境界補強は、出口条件を明確にして、商品読感確認へ戻す。
4. 長期化は許容するが、毎回「収益・商品価値・継続入力・外部pilot」に接続しているかを見る。
5. Mash様の判断力・確認負担をプロジェクト資源として扱い、確認押しつけ・再質問・未確認成果化を減らす。
```

---

## 21. ロードマップ更新ルール

このロードマップは固定資料ではありません。  
ただし、勝手に肥大化させません。

更新するときは、以下を必ず残します。

```text
- 更新日
- 更新理由
- 参照した実ファイルzip / 前提資料zip
- 追加・変更したPhase
- 完了条件の変更有無
- 完了条件を緩めた場合の理由
- 完了条件を厳しくした場合の理由
- 既存Phaseへの影響
```

禁止:

```text
- 進捗が苦しいから完了条件を緩める。
- fixture greenを商品価値合格に変換する。
- 新機能を足して、Emlis応答の弱さから逃げる。
```


### 21.1 更新記録: 2026-06-19 JST / 観測補助問い P7-P8 Bridge追記

```text
更新日:
  2026-06-19 JST

更新理由:
  観測補助問いはP7途中で実装せず、P8開始時に詳細設計する方針とした。
  その詳細設計を勘で作らないため、P7の人間読感・実機確認中に問い必要性観察メモを残すルールを追加した。

参照した実ファイルzip / 前提資料zip / 設計資料:
  実ファイルzip: なし。コード変更なし・API/RN/DB差分なしのロードマップ追記のみ。
  前提資料zip: Cocolon_前提資料(235).zip
  設計資料: Cocolon_EmlisAI_ObservationClarificationQuestion_DesignNote_20260617(1).md
  更新元ロードマップ: Cocolon_EmlisAI_longterm_roadmap_20260608(22).md

追加・変更したPhase:
  P7:
    12.5 P7/P8 Bridge: 観測補助問い必要性メモ を追加。
  P8:
    13.4 P8開始時の観測補助問い 詳細設計材料 を追加。

完了条件の変更有無:
  既存のP7完了条件は変更しない。
  既存のP8完了条件は変更しない。
  観測補助問いの実装完了を、現時点でP7/P8の完了条件へ追加しない。

既存Phaseへの影響:
  P7では、既存QA・実機確認の中でbody-free観察メモだけを残す。
  P8では、収集したメモを観測補助問いの詳細設計材料として使う。
  P9/P10には現時点で新しい完了条件を追加しない。

禁止確認:
  この差分では、API / DB / RN UI / response key / plan guard / 問い発生ロジックを確定しない。
  Emlis本体の読感不足を問い返しで補う扱いにしない。
```

---

### 21.2 更新記録: 2026-07-06 JST / 問いシステム core quality gate + P8問いUX 追記

```text
更新日:
  2026-07-06 JST

更新理由:
  Mash様より、「わかったつもり問題」は、ユーザー入力内だけで応答を完結させる圧力と、足りない情報を取得する仕組みの不足から起きる、という構想が提示された。
  旧資料名「観測補助問い」を、プロダクト上は「問いシステム」として扱い、EmlisAI core quality gateとP8問いUXの二層へ再配置するため。

参照した実ファイルzip / 前提資料zip / 設計資料:
  実ファイルzip: なし。コード変更なし・API/RN/DB差分なしのロードマップ更新のみ。
  前提資料zip: Cocolon_前提資料(292).zip
  ロードマップzip: Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619(19).zip
  設計資料: Cocolon_EmlisAI_ObservationClarificationQuestion_DesignNote_20260617(2).md
  Mash様との追加合意: Free最大1回 / 仮観測+問い / refined observation / core gate + P8 UX / Premium深掘り1〜3回

追加・変更したPhase:
  0:
    問いシステムをEmlisAI core quality gate + P8問いUXとして位置づける結論を追記。
  4:
    P7 / P8 / P9の全体表を問いシステム反映に更新。
  P7:
    12.5を「問いシステム必要性メモ」に更新し、body-free観察項目を追加。
  P8:
    13.4を問いシステム詳細設計材料へ更新。
    13.5に問いシステム正式候補仕様を追加。
  P9:
    pilot指標に問いシステムの価値・負荷・差別化確認を追加。
  P10:
    release条件 / blockerに問いシステムの即時観測・plan guard・public meta境界を追加。

完了条件の変更有無:
  P7完了条件は緩めない。
  P8完了条件は、問いシステムの説明可能性・UX境界・保存境界を追加して厳格化する。
  P9/P10は、問いシステムが価値になっているか、逆に負荷やleakになっていないかを見る条件を追加する。

完了条件を緩めた場合の理由:
  なし。

完了条件を厳しくした場合の理由:
  問いシステムは追加質問UIではなく、EmlisAIの「わかったつもり」を防ぐ中核品質条件に関わるため。
  早く出すことよりも、収益に接続する商品価値と即時観測体験を壊さないことを優先するため。

既存Phaseへの影響:
  P7では実装せず、観察メモのみ。
  P8ではcore gateと問いUXを分けて詳細設計する。
  P9では外部pilotで価値・負荷・差別化を確認する。
  P10ではrelease条件とrelease blockerに反映する。

禁止確認:
  この差分では、API / DB / RN UI / response key / plan guard / 問い発生ロジックを実装確定しない。
  問いシステムを、Emlis本体の弱さを隠す質問ラリーにしない。
  元入力を問い回答で上書きしない。
  raw input / raw answer / comment_text bodyをpublic metaへ出さない。
```

---

## 22. 最終メモ

Cocolonは、GPTに勝つアプリではありません。  
でも、GPTが強い時代に、Cocolonを使う理由を作らなければいけません。

その理由は、EmlisAIが作ります。

```text
自分の言葉が、ただ処理されるのではなく、
自分の記録として残り、
足りないところは問いで確かめられ、
次の自分へ線として返ってくる。
```

この体験が出せるなら、Cocolonを使う人はいます。  
出せなければ、Cocolonは厳しいです。

だから、ここからの開発は、EmlisAIの最終到達地点に向けて、段階ごとの完了条件を潰していく開発に切り替えます。

Mashと華恋で、可能性を無駄にしないために。
