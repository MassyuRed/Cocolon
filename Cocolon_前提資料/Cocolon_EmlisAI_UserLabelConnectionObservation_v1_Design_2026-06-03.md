# Cocolon EmlisAI User Label Connection Observation v1 設計定義

作成日: 2026-06-03  
作成: 華恋  
対象: Cocolon / EmlisAI / mashos-api backend internal observation layer  
成果物種別: md設計書  
実装扱い: 本資料ではコード変更、patch作成、実装zip作成、DB変更、RN変更、API route変更、response key変更、json/schema実ファイル化を行わない。  
実装判断: 本資料内に json / schema 案を含める。ただし、実ファイル化は実装段階で現物コード、既存schema配置、既存Guard、既存test結果、既存composer signatureを確認して判断する。  

---

## 0. 本資料の結論

次に設計書化し、実装段階で中心に置くべきものは、次である。

```text
EmlisAI User Label Connection Observation v1
日本語名: EmlisAI ユーザー記憶ラベル接続観測 v1
```

これは、Cocolonに蓄積された `category / emotion / action / thought / created_at` を、単発入力ではなく、ユーザーごとの記憶ラベルの接続として読み、今回入力がどの接続線上にあるように見えるかを、断定せず、行動指示にせず、受け取れる温度で `Emlisの観測` として返すための backend 内部構造である。

今回作るべき中心は、RN/UI追加ではない。  
`/emotion/submit` の public contract変更でもない。  
DB physical schema変更でもない。  

最初に作るべきものは、backend内部の次の層である。

```text
current_input + owned history + user model
↓
User Label Point 正規化
↓
User Label Connection Material
↓
User Label Connection Candidate
↓
User Label Connection Gate
↓
User Label Connection Surface Plan
↓
既存 EmlisAI comment_text 生成系へ限定接続
```

この設計は、華恋の人格を EmlisAI に移植するものではない。  
EmlisAI に継承するのは、華恋が Mash様との会話で行っている **観測作法** である。

Mash様側の観測は、点の情報を線でつなぎ、その人の出力が生まれる仕組み・工程として把握すること。  
華恋側の観測作法は、その仕組みを、断定せず、冷たくせず、自己責めへ向かわせず、受け取れる形で返すこと。  

この2つを Cocolon の `記憶ラベル方式` に接続するのが、本資料の目的である。

---

## 1. 確認状態

### 1.1 今回確認したファイル

```text
/mnt/data/Cocolon_前提資料(168).zip
/mnt/data/Cocolon(205).zip
/mnt/data/mashos-api(118).zip
/mnt/data/Cocolon_EmlisAI_UserLabelConnectionObservation_DesignReview_2026-06-03(1).md
```

補助確認として `Cocolon_前提資料(167).zip` も存在確認したが、今回の基準面は Mash様の指定作業姿勢資料名に合わせ、`Cocolon_前提資料(168).zip` を優先した。

### 1.2 主な確認済み前提資料

```text
Cocolon_前提資料(168)/Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料(168)/Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料(168)/Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
Cocolon_前提資料(168)/Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料(168)/Cocolon_前提資料/cocolon_environment_state_output_observation_structure_design_2026_05_25.md
Cocolon_前提資料(168)/Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料(168)/Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
```

### 1.3 主な確認済み実ファイル

#### RN側

```text
Cocolon(205)/Cocolon/screens/InputScreen.js
Cocolon(205)/Cocolon/screens/input/InputFeedbackReplyModal.js
Cocolon(205)/Cocolon/screens/input/inputFeedbackModel.js
```

#### backend側

```text
mashos-api(118)/mashos-api/ai/services/ai_inference/api_contract_registry.py
mashos-api(118)/mashos-api/ai/services/ai_inference/api_emotion_submit.py
mashos-api(118)/mashos-api/ai/services/ai_inference/emotion_submit_service.py
mashos-api(118)/mashos-api/ai/services/ai_inference/emlis_ai_current_input_bundle.py
mashos-api(118)/mashos-api/ai/services/ai_inference/emlis_ai_input_material_bundle.py
mashos-api(118)/mashos-api/ai/services/ai_inference/emlis_ai_capability.py
mashos-api(118)/mashos-api/ai/services/ai_inference/emlis_ai_context_service.py
mashos-api(118)/mashos-api/ai/services/ai_inference/emotion_history_search_service.py
mashos-api(118)/mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py
mashos-api(118)/mashos-api/ai/services/ai_inference/emlis_ai_user_fact_grounding_boundary.py
mashos-api(118)/mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_candidate.py
mashos-api(118)/mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_gate.py
mashos-api(118)/mashos-api/ai/services/ai_inference/emlis_ai_structure_insight_surface.py
mashos-api(118)/mashos-api/ai/services/ai_inference/emlis_ai_complete_composer_client.py
mashos-api(118)/mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
mashos-api(118)/mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
```

### 1.4 確認済み作業ルール

作業姿勢資料では、華恋は未確認断定、見ていないファイルを見た扱い、前提資料・実ファイル・ログ未確認のままの作業判断、設計指示と実装指示の混同、指示外機能追加をしてはいけないと固定されている。  
また、EmlisAI作業では `emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md` を必ず確認し、EmlisAIを Gate に通ったものだけを表示する許可装置として扱わず、入力直後の観測返答として扱うことが固定されている。

確認箇所:

```text
work_attitude_rules_for_karen/00_read_first.txt:8-17
work_attitude_rules_for_karen/00_read_first.txt:32-52
work_attitude_rules_for_karen/00_read_first.txt:54-75
```

### 1.5 確認済み共同開発境界

華恋の思想は Mash様の思想を置換しない。  
華恋の思想は、Cocolonを商品として完成させるために Mash様の構想を支える補助思想である。  
華恋が意見を出す場合は、確認済み事実、未確認、Cocolon思想との関係、華恋の意見、影響範囲を分ける必要がある。

確認箇所:

```text
work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt:7-17
同:21-27
同:28-38
同:51-58
同:68-73
```

### 1.6 本資料で守る出力区分

```text
確認済み:
  前提資料、RN実ファイル、backend実ファイル、既存設計検討メモに基づく内容。

未確認:
  実装段階で、関数signature、既存composer接続点、schema配置、既存test fixtureとの詳細衝突を再確認する必要がある内容。

書かれていない:
  今回のzip内に、User Label Connection Observation v1 という専用実装層は存在しない。

推測禁止:
  今回の設計を、DB変更・RN変更・API response変更・EmlisAI人格コピー・診断機能・未来予測機能として扱わない。

次に実行すべきこと:
  本資料を前提資料へ追加し、その後、実装段階で Phase 0 から順に backend internal-only として実装する。
```

---

## 2. 思想上の中心定義

### 2.1 Cocolonは文字列処理サービスではない

思想資料では、Cocolonは単なる画面・API・DB・AI応答の集合ではなく、ユーザーの自己情報・他者情報・感情・思考・役割・言葉の箱詰め工程を観測するために存在すると定義されている。

中心文は次である。

```text
Cocolonは、ユーザーの入力を文字列として処理するサービスではなく、
その言葉がどの情報をどの箱に詰めて出されたのかを観測し、
ユーザー本人の辞書に近づくためのサービスである。
```

確認箇所:

```text
cocolon_thought_material_for_karen.md:16-35
```

### 2.2 EmlisAIの目的

EmlisAIの目的は、ユーザーの理解者、パートナーになることである。  
これは、単に優しい文章を返すことでも、一般論で慰めることでもない。  
EmlisAIはユーザーの入力を観測し、その人がどの辞書で世界を読んでいるのかに近づく。

確認箇所:

```text
cocolon_thought_material_for_karen.md:120-127
```

### 2.3 観測とは何か

思想資料では、観測は「箱の表面を見て自分の辞書で意味を当てること」ではなく、なぜその箱が選ばれ、その箱に入る前の情報は何で、どの工程でその形に圧縮されたのかを見に行くことと定義されている。

確認箇所:

```text
cocolon_thought_material_for_karen.md:138-175
```

今回の会話で Mash様は、観測できた状態を次のように定義した。

```text
点の情報が線でつながり、
相手の出力が生まれる仕組み・工程として把握できた状態。
```

本資料では、この会話上の定義を Cocolon実装用に次のように固定する。

```text
Cocolon / EmlisAI における観測 =
ユーザーが残した入力という点を、
カテゴリ・感情・行動・思考・時点・過去入力の関係で線にし、
今回の出力が生まれている仕組みを、
断定せず、行動指示にせず、受け取れる温度で返すこと。
```

### 2.4 記憶ラベル方式

Mash様の追加定義:

```text
記憶のラベル方式を可視化したのがCocolonである。
感情選択・カテゴリ選択というラベルを付けて履歴化する。
後で追うときに、人間の記憶構造と同じように履歴を追うことができる。
```

前提資料上、Cocolonの基本観測単位は次である。

```text
環境ラベル × 状態ラベル × 出力内容
```

ただし、これは人間の脳や記憶の科学的断定ではない。  
Cocolon設計上、ユーザーが選んだカテゴリ・感情・行動内容・思考内容を、自己情報の条件付き観測単位として読むための内部設計名である。

確認箇所:

```text
cocolon_thought_material_for_karen.md:924-950
cocolon_environment_state_output_observation_structure_design_2026_05_25.md:20-62
```

### 2.5 入力fieldの思想上の読み方

| field | 思想上の読み方 | 禁止する読み方 |
|---|---|---|
| `category` | 環境ラベル / 話題方向 / ユーザーが近いと選んだ記憶ラベル | 原因断定にしない |
| `memo_action` / `action_text` | 実世界で起きたこと / したこと / 状況 / 行動 / 結果 | 事実以上に補完しない |
| `emotion_details` / `emotions` | 状態ラベル / 他者に状態を表す言葉 / 記憶の状態ラベル | 診断名にしない |
| `strength` | 状態の重さ / 表面化時の注意材料 | 原因や深刻度診断にしない |
| `memo` / `thought_text` | その環境・状態で外に置かれた思考 / 解釈 / 言葉 / 出力内容 | 本音や結論を勝手に決めない |
| `created_at` / `selected_at` | 観測時点 | 1件で期間傾向にしない |
| `id` / evidence span | 根拠record anchor | 根拠なし文を出さない |

確認箇所:

```text
cocolon_thought_material_for_karen.md:941-950
cocolon_environment_state_output_observation_structure_design_2026_05_25.md:34-62
```

---

## 3. 現状実装との接続

### 3.1 RN側は必要な入力材料を送っている

`InputScreen.js` は送信payloadに次を含めている。

```text
emotions
memo
created_at
category
memo_action
```

確認箇所:

```text
Cocolon/screens/InputScreen.js:865-887
```

Emlis観測表示は、`input_feedback.comment_text` と `input_feedback.emlis_ai` を受け取り、条件を満たす場合だけモーダルを開く。

確認箇所:

```text
Cocolon/screens/InputScreen.js:1100-1134
Cocolon/screens/input/InputFeedbackReplyModal.js:18-24
Cocolon/screens/input/InputFeedbackReplyModal.js:43-66
Cocolon/screens/input/inputFeedbackModel.js:120-144
```

### 3.2 RN契約は変更しない

今回の設計では、次を変更しない。

```text
RN画面
RN表示タイトル `Emlisの観測`
モーダル表示条件
`observation_status == passed` かつ `comment_text` non-empty
```

理由:

```text
ユーザー記憶ラベル接続観測は、表示体験の新画面ではなく、EmlisAIの観測文品質を支える backend internal layer であるため。
```

### 3.3 public API contract は変更しない

`api_contract_registry.py` では `/emotion/submit` は additive-only contract であり、`input_feedback.comment_text` は安定維持、`input_feedback.emlis_ai` は観測kernel metadata拡張に対して additive-only とされている。

確認箇所:

```text
api_contract_registry.py:28-34
```

`api_emotion_submit.py` の public response は `input_feedback.comment_text` と `input_feedback.emlis_ai` である。

確認箇所:

```text
api_emotion_submit.py:915-930
api_emotion_submit.py:2156-2221
```

### 3.4 保存後のEmlisAI即時返答経路

`emotion_submit_service.py` は保存後、`normalize_emlis_current_input` に `id / created_at / emotions / emotion_details / memo / memo_action / category` を渡し、`render_emlis_ai_reply` を呼ぶ。  
その後、public meta sanitizer を通して public input feedback を組み立てる。

確認箇所:

```text
emotion_submit_service.py:945-991
emotion_submit_service.py:1057-1067
```

### 3.5 current input bundle は既に思想上の対応に近い

`emlis_ai_current_input_bundle.py` は public `/emotion/submit` payload と EmlisAI内部 reading model の境界であり、以下を明示している。

```text
thought_text <- memo
action_text <- memo_action
emotions <- emotion_details / emotions
categories <- category
selected_at <- created_at
source_record_id <- id
```

また、public API request/response key、DB physical name、user-facing textを変えないことも明記されている。

確認箇所:

```text
emlis_ai_current_input_bundle.py:4-27
emlis_ai_current_input_bundle.py:94-159
emlis_ai_current_input_bundle.py:161-207
```

### 3.6 履歴・ユーザーモデル基盤は既にある

`emlis_ai_capability.py` では、Free は `history_mode=none` / `model_read_enabled=False` / `model_write_enabled=False` / `source_scope=current_input_only` である。  
Plus/Premium は owned history と derived user model を使える。

確認箇所:

```text
emlis_ai_capability.py:17-99
```

`emlis_ai_context_service.py` は、capability に応じて last input / same-day recent inputs / similar inputs / derived user model / cross-core context を source bundle へ集める。

確認箇所:

```text
emlis_ai_context_service.py:241-284
```

`emotion_history_search_service.py` は、過去の `category / emotion_details / memo / memo_action` を検索し、カテゴリ・感情・memo token overlap で similar inputs を取っている。

確認箇所:

```text
emotion_history_search_service.py:83-205
```

`emlis_ai_user_model_store.py` の derived user model には `meaning_map / value_anchors / partner_expectation / open_topic_anchors / recovery_anchors` などの土台がある。

確認箇所:

```text
emlis_ai_user_model_store.py:217-226
emlis_ai_user_model_store.py:323-360
```

### 3.7 User Fact Grounding Boundaryは必ず維持する

`emlis_ai_user_fact_grounding_boundary.py` は、Freeでは user facts を使わず、subscriptionでは sanitized fact identifiers のみを扱い、low-informationを user factsだけで eligible に上げず、raw text / comment_text をmetaへ含めない契約を持つ。

確認箇所:

```text
emlis_ai_user_fact_grounding_boundary.py:1-18
emlis_ai_user_fact_grounding_boundary.py:46-52
emlis_ai_user_fact_grounding_boundary.py:387-397
emlis_ai_user_fact_grounding_boundary.py:620-699
```

本設計は、この boundary を緩めない。  
ユーザー記憶ラベル接続観測は、User Fact Grounding Boundary の外側で勝手に履歴や辞書を使う実装にしてはいけない。

### 3.8 既存Structure Insightとの違い

`emlis_ai_structure_insight_candidate.py` は、current self-report materialから relation-candidate metadata を作る内部層であり、visible surface / comment_text / public key を作らない。

確認箇所:

```text
emlis_ai_structure_insight_candidate.py:4-11
```

ただし、既存candidateは `source_scope=current_input_only`、`requires_user_history=False` で作られている。

確認箇所:

```text
emlis_ai_structure_insight_candidate.py:412-458
```

`emlis_ai_structure_insight_gate.py` は `source_scope` が `current_input_only` でない候補、または user history を必要とする候補をrejectする。

確認箇所:

```text
emlis_ai_structure_insight_gate.py:331-342
```

`emlis_ai_structure_insight_surface.py` は limited family のみ接続し、daily / low-information / positive には深い insight を出さない。

確認箇所:

```text
emlis_ai_structure_insight_surface.py:42-68
emlis_ai_structure_insight_surface.py:170-183
```

したがって、今回の User Label Connection Observation は、既存 Structure Insight Gate を緩めて入れるのではなく、**別系統の履歴接続専用gate** として作るのが安全である。

---

## 4. 本設計で固定する概念

### 4.1 Point

```text
Point = 1件のCocolon入力記録。
```

Pointは次を持つ。

```text
category labels
emotion labels
emotion strength summary
memo_action / action axis
memo / thought axis
created_at / selected_at
source_record_id
source_kind: current_input / last_input / same_day_recent / similar_input / derived_user_model_anchor
```

Pointは傾向ではない。  
Pointは、ユーザーがある時点で置いた `環境 × 状態 × 出力` の単発観測である。

### 4.2 Line

```text
Line = 複数のPointが、同じまたは近いラベル・出力・行動・時点関係でつながったもの。
```

Lineは、固定テーマではなく、ユーザー入力から動的に作る。  
「この単語が来たらこの線を見る」という実装にしない。  
まず見るべき対象は、ユーザーごとの言葉・感情・記憶・行動のつながり方そのものである。

### 4.3 Mechanism

```text
Mechanism = Lineがまとまり、今回入力の状態や出力が生まれる工程として説明可能になったもの。
```

Mechanismは診断ではない。  
Mechanismは人格傾向断定ではない。  
Mechanismは未来予測ではない。  
Mechanismは「この期間の記録を並べると、今回の出力はこの線上にあるように見える」という観測候補である。

### 4.4 Observation

```text
Observation = Mechanismを、断定・診断・行動指示・人格化にせず、Emlisから見える範囲として返すこと。
```

表面文では、次のように扱う。

```text
言ってよい:
  今回の入力と近い記録を並べると、似た状態ラベルと環境ラベルが重なって見えます。
  この期間の記録の範囲では、単発の反応というより、同じ線の上にもう一度出ているように見えます。

言ってはいけない:
  あなたはこういう人です。
  いつもこうなります。
  原因はこれです。
  こうするべきです。
```

### 4.5 User Dictionary / 個人辞書

本設計でいうユーザー辞書は、単語の意味辞書ではない。

```text
ユーザー辞書 =
そのユーザーの中で、どの言葉・感情・カテゴリ・行動・記憶ラベルが接続されやすいかの辞書。
```

同じ「悲しい」でも、ユーザーごとに接続先は違う。  
ある人には拒絶、ある人には期待不一致、ある人には自己責め、ある人には報われなさが接続する。  
EmlisAIは、一般論で「悲しい」を処理せず、そのユーザーの記録上で何と接続しているかを見る。

ただし、ユーザー辞書は断定に使わない。  
過去入力や過去観測は、今回の内部問いへ答えるための事実根拠として使う。

確認箇所:

```text
cocolon_thought_material_for_karen.md:821-846
```

---

## 5. 実装対象外

本設計の初回実装で、次は行わない。

```text
RN画面追加
RN表示タイトル変更
/emotion/submit route変更
/emotion/submit response key変更
DB physical schema変更
外部AI / ローカルLLM新規前提追加
ユーザー設定追加
診断機能追加
性格分類機能追加
未来予測機能追加
EmlisAI = 華恋コピー化
華恋の関係性・人格・Mash様専用履歴を一般ユーザー向けEmlisへ移植
```

理由:

```text
今回の目的は、Cocolonの記憶ラベル方式とEmlisAIの観測返答をbackend内部で接続し、
ユーザーが「理解された」「一人のときより自己情報が整理できた」と感じる観測品質へ近づけることであるため。
```

---

## 6. 新規内部レイヤー構成

### 6.1 新規実ファイル候補

実装段階では、次のファイル群を候補にする。  
ただし、既存コードの配置・signature・test構造を再確認し、実装段階で最小差分になる配置を判断する。

```text
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_types.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_material.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_candidate.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_surface.py
mashos-api/ai/services/ai_inference/emlis_ai_user_label_connection_public_meta.py  # 必要なら後段で検討
```

### 6.2 新規test候補

```text
mashos-api/ai/tests/test_emlis_ai_user_label_connection_material.py
mashos-api/ai/tests/test_emlis_ai_user_label_connection_candidate.py
mashos-api/ai/tests/test_emlis_ai_user_label_connection_gate.py
mashos-api/ai/tests/test_emlis_ai_user_label_connection_surface.py
mashos-api/ai/tests/test_emlis_ai_user_label_connection_public_boundary.py
mashos-api/ai/tests/test_emlis_ai_user_label_connection_e2e_contract.py
mashos-api/ai/tests/test_emlis_ai_user_label_connection_low_information_boundary.py
mashos-api/ai/tests/test_emlis_ai_user_label_connection_free_tier_boundary.py
mashos-api/ai/tests/test_emlis_ai_user_label_connection_no_raw_text_meta.py
mashos-api/ai/tests/test_emlis_ai_user_label_connection_product_quality_qa.py
```

### 6.3 接続候補箇所

実装段階では、以下のどちらか、または両方を検討する。

#### 接続候補A: `emlis_ai_reply_service.py` 側で source bundle 後に生成

```text
render_emlis_ai_reply
  ↓
resolve capability
  ↓
build_emlis_ai_source_bundle
  ↓
User Fact Grounding Boundary
  ↓
build_user_label_connection_material
  ↓
composer meta / contextへ渡す
```

利点:

```text
source bundle と capability を見やすい。
Free / Plus / Premium の分岐を早い段階で固定しやすい。
```

注意:

```text
既存composerへ渡すmeta構造のsignatureを実装段階で確認する必要がある。
```

#### 接続候補B: `emlis_ai_complete_composer_client.py` 側で material_bundle 周辺に追加

```text
CompleteComposerClient
  ↓
input material bundle / relation graph / sentence plan 生成
  ↓
User Label Connection Surface Plan を追加
  ↓
final_realization / surface_metaへ text-free meta として接続
```

利点:

```text
既存 `structure_insight_surface` や `surface_meta` との接続が近い。
visible surfaceに入れるかどうかをsurface realizer付近で制御しやすい。
```

注意:

```text
履歴source bundleがその層で参照可能か、実装段階で確認が必要。
```

### 6.4 初回推奨

初回は、次の二段階に分ける。

```text
Step A:
  standalone material / candidate / gate を作り、unit testで固定する。
  既存Emlis reply flowにはまだ接続しない。

Step B:
  meta-onlyで reply meta に接続し、comment_textにはまだ入れない。

Step C:
  limited family だけ surface 接続する。
```

これにより、いきなり表示文へ入れて商品品質を壊すリスクを下げる。

---

## 7. User Label Point 設計

### 7.1 責務

`UserLabelPoint` は、1件の現在入力または履歴入力を、Cocolonの記憶ラベル方式で読むための内部構造である。

責務:

```text
- current_input / history row / same_day row / similar row を同じ内部形式に正規化する。
- raw text を public meta へ出さない。
- text body ではなく、label / field id / token fingerprint / evidence anchor を持つ。
- 1件のPointを傾向として扱わない。
```

### 7.2 field案

```json
{
  "schema_version": "cocolon.emlis.user_label_point.v1",
  "point_id": "current:emotion_id_or_generated",
  "source_kind": "current_input",
  "source_scope": "current_input_only",
  "source_record_id_present": true,
  "selected_at_present": true,
  "label_axes": {
    "environment": {
      "category_labels": ["仕事"],
      "has_action_axis": true,
      "source_field_ids": ["category", "memo_action"]
    },
    "state": {
      "emotion_labels": ["不安"],
      "strength_bucket": "strong",
      "source_field_ids": ["emotion_details"]
    },
    "output": {
      "has_thought_axis": true,
      "thought_token_fingerprint_count": 3,
      "source_field_ids": ["memo"]
    },
    "time": {
      "selected_at_bucket": "current",
      "source_field_ids": ["created_at"]
    }
  },
  "evidence_anchor": {
    "record_id_hash_present": true,
    "raw_text_included": false,
    "raw_input_included": false,
    "comment_text_body_included": false
  },
  "point_is_tendency": false
}
```

### 7.3 正規化時の禁止

```text
- memo / memo_action の本文をそのまま public meta に持たせない。
- category を原因にしない。
- emotion strength を原因・診断・深刻度診断にしない。
- 1件のPointに personality / tendency を立てない。
- source_record_id がない場合、履歴接続根拠として扱わない。
```

---

## 8. User Label Connection Material 設計

### 8.1 責務

`emlis_ai_user_label_connection_material.py` は、現在入力と owned history から、text-free / meta-only の接続材料を作る。  
この層は `comment_text` を作らない。  
public response key を追加しない。  
RN表示条件を変更しない。

入力候補:

```text
current_input
SourceBundle.last_input
SourceBundle.same_day_recent_inputs
SourceBundle.similar_inputs
DerivedUserModel.interpretive_frame
DerivedUserModel.open_topic_anchors
capability
UserFactGroundingDecision
observation eligibility / reply kind
```

出力:

```text
UserLabelConnectionMaterial
```

### 8.2 material案

```json
{
  "schema_version": "cocolon.emlis.user_label_connection_material.v1",
  "step": "UserLabelConnection_Material_v1",
  "source_scope": "current_input_with_owned_history",
  "record_scope": "current_plus_owned_history",
  "capability_tier": "plus",
  "history_read_allowed": true,
  "user_fact_grounding_boundary_passed": true,
  "low_information_protected": false,
  "current_point": {
    "point_id": "current:present",
    "source_kind": "current_input",
    "point_is_tendency": false
  },
  "owned_history_points_summary": {
    "available": true,
    "point_count": 3,
    "same_day_count": 1,
    "similar_count": 2,
    "last_input_present": true,
    "raw_text_included": false
  },
  "connection_edges": [
    {
      "edge_id": "edge.category_state_recurrence.001",
      "edge_family": "category_state_recurrence",
      "source_field_ids": ["category", "emotion_details", "created_at"],
      "evidence_record_count": 2,
      "evidence_point_ids": ["history:similar:001", "current:present"],
      "time_scope": "owned_history_window",
      "source_scope_marker_required": true,
      "soft_marker_required": true,
      "line_is_candidate": true,
      "line_is_fact": false,
      "raw_text_included": false,
      "comment_text_body_included": false
    }
  ],
  "material_quality": "history_connection_candidate",
  "public_response_key_added": false,
  "raw_input_included": false,
  "raw_text_included": false,
  "comment_text_body_included": false
}
```

### 8.3 material builder algorithm

```text
1. capability を確認する。
   - free: history/material edge は作らない。
   - plus/premium: owned history を候補にする。

2. User Fact Grounding Boundary を確認する。
   - boundary が user fact read disabled の場合、history edge は作らない。
   - low_information の場合、historyだけで eligible に上げない。

3. current_input を UserLabelPoint に変換する。
   - category -> environment labels
   - emotion_details / emotions -> state labels
   - strength -> state weight bucket
   - memo_action -> action axis
   - memo -> output axis token fingerprints
   - created_at -> time axis

4. last_input / same_day_recent_inputs / similar_inputs を UserLabelPoint に変換する。
   - secret input は backend owned context として扱うが、raw text を meta/public に出さない。
   - source_record_id / created_at がない record は evidence_record_count へ入れない。

5. current point と history points の接続候補を作る。
   - edge family ごとに source_field_ids と evidence_record_count を持たせる。
   - text body ではなく label id / field id / token fingerprint count を使う。

6. edgeをscoreする。
   - label overlap
   - axis overlap
   - evidence_record_count
   - current alignment
   - low information penalty
   - safety adjacent penalty

7. outputは meta-only にする。
```

### 8.4 edge family v1

edge family は、固定テーマではなく、動的接続を分類するための内部名である。  
この family 名をそのまま surface に出してはいけない。

| edge_family | 意味 | 主な根拠field | v1扱い |
|---|---|---|---|
| `category_state_recurrence` | 同じ/近い環境ラベルと状態ラベルが再出現 | `category`, `emotion_details`, `created_at` | 初回対象 |
| `state_output_attachment` | 同じ/近い状態ラベルと出力tokenが接続 | `emotion_details`, `memo` | 初回対象 |
| `action_state_bridge` | 行動・状況axisと状態ラベルが近接 | `memo_action`, `emotion_details` | 初回対象 |
| `category_output_route` | 同じ環境ラベルで似た出力axisが出る | `category`, `memo` | 初回対象 |
| `unresolved_weight_reappearance` | 詰まり・未完了・行動不能・迷いが再出現 | `memo`, `memo_action`, `emotion_details` | 初回対象。ただし強断定禁止 |
| `value_line_reappearance` | ユーザーが重視している線が複数記録に現れる | `category`, `memo`, derived model anchors | v1では慎重。surface限定 |
| `label_route_current_alignment` | 過去の接続線と今回入力が近い位置にある | 複合 | 初回対象 |
| `contrast_line_shift` | 同じ環境で状態や出力が変化している | `category`, `emotion_details`, `memo`, `created_at` | v1ではmetaのみ推奨 |
| `recovery_label_route` | 重い状態から戻るときのラベル接続 | 複合 | v1では実装しない。Analysis側候補 |

### 8.5 score案

```json
{
  "edge_score": {
    "schema_version": "cocolon.emlis.user_label_connection_edge_score.v1",
    "label_overlap_score": 0.4,
    "axis_overlap_score": 0.3,
    "evidence_record_count_score": 0.2,
    "current_alignment_score": 0.1,
    "low_information_penalty": 0.0,
    "safety_penalty": 0.0,
    "final_score": 0.72,
    "score_is_public": false
  }
}
```

scoreは、候補選定にのみ使う。  
surfaceで数値を出してはいけない。

---

## 9. User Label Connection Candidate 設計

### 9.1 責務

`emlis_ai_user_label_connection_candidate.py` は、material edgeから、Mechanism候補を作る。

責務:

```text
- edgeを統合し、今回入力がどの線上にあるように見えるかの候補を作る。
- candidateはsurface本文ではない。
- candidateは観測候補であり、事実断定ではない。
- candidateはGate前にpublicへ出さない。
```

### 9.2 candidate案

```json
{
  "schema_version": "cocolon.emlis.user_label_connection_candidate.v1",
  "candidate_id": "ulc.mechanism.001",
  "candidate_kind": "user_label_connection_mechanism",
  "source_scope": "current_input_with_owned_history",
  "requires_user_history": true,
  "current_input_required": true,
  "mechanism_family": "same_label_line_current_alignment",
  "supporting_edge_ids": [
    "edge.category_state_recurrence.001",
    "edge.state_output_attachment.001"
  ],
  "evidence": {
    "evidence_record_count": 2,
    "current_record_included": true,
    "history_record_count": 1,
    "source_field_ids": ["category", "emotion_details", "memo", "created_at"],
    "requires_external_knowledge": false,
    "raw_text_included": false,
    "raw_input_included": false,
    "comment_text_body_included": false
  },
  "inference_strength": "soft",
  "candidate_quality": "gate_candidate",
  "surface_permission": {
    "may_surface_now": false,
    "may_surface_after_user_label_connection_gate": true,
    "must_use_soft_expression": true,
    "must_use_scope_marker": true,
    "must_not_surface_as_fact": true,
    "must_not_surface_as_personality": true,
    "must_not_surface_as_diagnosis": true,
    "must_not_surface_as_cause": true,
    "must_not_surface_as_advice": true
  },
  "forbidden_claims": [
    "diagnosis",
    "personality_claim",
    "cause_claim_without_evidence",
    "advice",
    "future_prediction",
    "always_claim",
    "should_statement",
    "period_tendency_from_single_record"
  ],
  "candidate_body_included": false,
  "comment_text_generated": false,
  "public_response_key_added": false
}
```

### 9.3 mechanism family v1

| mechanism_family | 意味 | surface可否 |
|---|---|---|
| `same_label_line_current_alignment` | 今回入力が過去の近いラベル線上にある | 可。ただしscope marker必須 |
| `same_environment_different_state_route` | 同じカテゴリ内で状態が違うと出力先が違う | v1ではmeta優先。surfaceは慎重 |
| `same_state_different_environment_route` | 同じ感情ラベルが環境ごとに違う対象へ向く | 可。ただし過去比較断定禁止 |
| `unresolved_weight_line` | 未完了・詰まり・変えたい/変えられない等が再出現 | 可。ただし自己責め誘導禁止 |
| `value_anchor_line` | ユーザーが重く扱っている価値線が見える | 限定可。人格化禁止 |
| `recovery_or_shift_line` | 状態変化や戻り方の線 | v1ではsurface禁止、Analysis側後回し |

---

## 10. User Label Connection Gate 設計

### 10.1 Gateの役割

`emlis_ai_user_label_connection_gate.py` は、履歴接続観測を出してよいかを決める。  
既存Structure Insight Gateを緩めない。  
User Label Connection専用Gateとして独立させる。

### 10.2 許可条件

```text
1. Freeでは history / user dictionary を使わない。
2. Plus/Premiumでのみ owned history を使う。
3. User Fact Grounding Boundary を通す。
4. low_information は history だけで full observation eligible に上げない。
5. recurrence / history line を言う場合は evidence_record_count >= 2。
6. current input は必ず含める。
7. historyだけで現在入力を補完しない。
8. surfaceにhistory lineを出す場合、scope markerを必須にする。
9. soft markerを必須にする。
10. raw memo / raw action / raw fact text / comment_text body をmeta/publicへ出さない。
11. safety adjacent / self-denial / target judgement context では通常観測へ無理に出さない。
```

### 10.3 必須scope marker

履歴や再出現をsurfaceに出す場合、次のようなscope markerを必須にする。

```text
この期間の記録では
以前の近い記録にも
今回と近い記録の範囲では
残っている記録を並べると
Emlisから見える範囲では
```

### 10.4 必須soft marker

```text
ように見えます
ように思います
かもしれません
近い形に見えます
線として見え始めています
```

### 10.5 禁止surface

```text
あなたはこういう人です
あなたはいつもこうです
今後もこうなります
原因はこれです
本当はこう思っています
こうするべきです
こうしてください
あなたの性格は〜です
診断すると〜です
この人はあなたを〜と思っています
相手が悪いです
あなたは治ります / 治りません
この方法で回復します
```

### 10.6 Gate decision案

```json
{
  "schema_version": "cocolon.emlis.user_label_connection_gate.v1",
  "step": "UserLabelConnection_Gate_v1",
  "candidate_id": "ulc.mechanism.001",
  "action": "allow_limited_surface_plan",
  "passed": true,
  "blocked": false,
  "rejection_reasons": [],
  "required_surface_markers": {
    "scope_marker_required": true,
    "soft_marker_required": true,
    "advice_marker_forbidden": true,
    "future_prediction_forbidden": true
  },
  "evidence_contract": {
    "evidence_record_count": 2,
    "minimum_evidence_record_count": 2,
    "current_record_included": true,
    "history_record_count": 1,
    "period_tendency_from_single_record_allowed": false
  },
  "capability_contract": {
    "tier": "plus",
    "free_history_used": false,
    "owned_history_only": true,
    "user_fact_grounding_boundary_passed": true
  },
  "public_contract": {
    "api_route_changed": false,
    "request_key_changed": false,
    "response_shape_changed": false,
    "public_response_key_added": false,
    "db_physical_name_changed": false,
    "rn_visible_contract_changed": false,
    "rn_visible_title_changed": false,
    "comment_text_body_included": false,
    "raw_input_included": false,
    "raw_text_included": false
  },
  "claim_contract": {
    "diagnosis_allowed": false,
    "personality_claim_allowed": false,
    "cause_claim_allowed": false,
    "advice_allowed": false,
    "future_prediction_allowed": false,
    "always_claim_allowed": false,
    "should_statement_allowed": false
  }
}
```

### 10.7 block理由候補

```text
free_history_blocked
user_fact_grounding_boundary_blocked
low_information_history_promotion_blocked
current_input_missing
history_record_count_insufficient
source_scope_marker_missing
soft_marker_missing
raw_text_payload_detected
comment_text_body_in_meta_detected
period_tendency_from_single_record
personality_claim_surface
diagnosis_surface
cause_claim_without_evidence_surface
advice_surface
future_prediction_surface
always_claim_surface
should_statement_surface
safety_adjacent_history_connection_blocked
self_denial_identity_claim_blocked
target_judgement_agreement_blocked
```

---

## 11. Surface Plan 設計

### 11.1 surface方針

`emlis_ai_user_label_connection_surface.py` は、Gateを通ったcandidateから、visible surfaceへ接続可能な **surface plan** を作る。  
この段階でも、固定完成文を作るのではなく、既存Composer / Surface Realizerへ渡す構造化planとして扱うのが望ましい。

### 11.2 接続するfamily

既存 `emlis_ai_structure_insight_surface.py` の限定方針に合わせ、初回は接続対象を絞る。

```text
接続可:
- structure_question
- long_meaning_arc
- self_understanding_follow

原則接続しない:
- daily_unpleasant
- daily_positive
- positive_only
- low_information
- safety_triage_required
```

理由:

```text
履歴接続観測は強い体験になる一方、日常入力・低情報入力・安全隣接入力へ無理に出すと、決めつけ・過剰読解・自己責め誘導になりやすいため。
```

### 11.3 surface plan案

```json
{
  "schema_version": "cocolon.emlis.user_label_connection_surface_plan.v1",
  "step": "UserLabelConnection_SurfacePlan_v1",
  "candidate_id": "ulc.mechanism.001",
  "surface_plan_kind": "limited_history_line_observation",
  "connectable_family": "self_understanding_follow",
  "section_targets": ["observation", "reception"],
  "must_include_roles": [
    "scope_marker",
    "current_input_anchor",
    "history_line_marker",
    "soft_observation",
    "not_personality_disclaimer",
    "self_understanding_support"
  ],
  "must_not_include_roles": [
    "advice",
    "diagnosis",
    "personality_claim",
    "future_prediction",
    "always_claim",
    "should_statement"
  ],
  "surface_shape": {
    "opening_reception": "optional",
    "current_input_observation": "required",
    "history_connection_observation": "required_when_history_surface",
    "meaning_support": "required",
    "closing_partner_line": "optional"
  },
  "fixed_sentence_template_added": false,
  "comment_text_generated_by_this_layer": false,
  "public_response_key_added": false,
  "raw_text_included": false,
  "comment_text_body_included": false
}
```

### 11.4 surface方向性例

以下は runtime 固定文ではない。  
設計意図を示すための surface direction である。

```text
方向性例A:
今回の入力だけで決めるのではなく、以前の近い記録にも、似た状態ラベルと環境ラベルが残っています。
その範囲では、今回の重さは単発の反応というより、同じ線の上にもう一度出ているように見えます。
これは「あなたはそういう人です」という意味ではありません。
残された記録同士を並べたとき、ひとりでは散らばりやすい自己情報が、少し線として見え始めているのだと思います。
```

```text
方向性例B:
今回の言葉には、今の出来事だけではなく、以前にも近い形で残っていた状態ラベルが重なって見えます。
Emlisから見える範囲では、同じ環境の中で、似た重さがもう一度出てきているのかもしれません。
だからこれは、弱さというより、自分の中でまだ整理しきれていない線が残っているということなのだと思います。
```

```text
方向性例C:
以前の近い記録と並べると、同じ感情名そのものよりも、その感情が出たときに一緒に置かれている言葉の方向が近く見えます。
今回も、その線の上で、まだ言い切れていない重さが出ているように見えます。
```

禁止方向性:

```text
あなたは仕事で不安になると、いつも逃げたくなる人です。
原因は、あなたが変化を怖がっているからです。
これからは環境を変えるべきです。
```

### 11.5 surfaceと内部問いの関係

EmlisAIは内部問いを生成するが、内部問いを説明口調でそのまま表示しない。

確認箇所:

```text
cocolon_thought_material_for_karen.md:688-710
cocolon_thought_material_for_karen.md:848-850
```

User Label Connection Observationでも同じである。  
内部では次を見る。

```text
この感情ラベルは、過去にどの環境ラベルと一緒に出たか。
この環境ラベルは、過去にどの出力内容と一緒に出たか。
今回の出力内容は、過去のどの線と近いか。
この線は、現在入力の根拠なしに強く言い切っていないか。
この観測は、ユーザーを責める方向になっていないか。
```

しかしsurfaceでは、内部問いを箇条書きで出すのではなく、自然な観測文に溶かす。

---

## 12. Low Information / Safety / Self-denial境界

### 12.1 Low Information

低情報入力では、履歴だけで深い観測へ上げてはいけない。  
User Fact Grounding Boundaryにも、low-information facts は current event を内部回答してはいけないという境界がある。

許可:

```text
- 低情報として受け取り、追加情報を促す。
- 履歴は focus selection / relation weight 程度に使う。
- ただし surface で「以前もこうでした」と深く言わない。
```

禁止:

```text
- 履歴があるから今回入力を full observation eligible にする。
- 「また同じですね」と言う。
- 過去情報だけで現在の出来事を補完する。
```

### 12.2 Safety adjacent / 自己否定

安全隣接入力では、通常観測・安全な状態回答・緊急安全境界を分ける。  
履歴接続観測が、自己否定を固定化する文になってはいけない。

禁止:

```text
あなたはいつも自分を責める人です。
あなたは変われないと感じやすい人です。
```

許可方向:

```text
今回の入力では、自分を強く責める言葉が前に出ています。
ここでは過去の線を深く決めるより、まず今の安全な状態回答として受け取ります。
```

### 12.3 怒り / 相手評価

怒り入力では、相手への攻撃・相手評価に同意しない。  
履歴接続が「この相手はいつもあなたを傷つける」のような相手意図断定へ向かわないようにする。

---

## 13. Public Meta / Privacy Boundary

### 13.1 publicへ出さないもの

```text
raw memo
raw memo_action
raw current_input
raw history input
raw fact text
comment_text body in meta
candidate body
surface body in meta
internal question body
private user dictionary text
record idsそのもの
```

### 13.2 publicへ出してよいもの

既存public meta sanitizerに通す前提で、必要最小限の identifier / count / boolean のみ。

```text
schema_version
feature flag / phase id
history_connection_applied: bool
history_connection_blocked: bool
history_connection_rejection_reasons: safe identifiers only
history_connection_edge_family_count: int
history_connection_evidence_record_count: int
scope_marker_required: bool
soft_marker_required: bool
public_response_key_added: false
raw_text_included: false
comment_text_body_included: false
```

### 13.3 public feedback meta接続

`emlis_ai_public_feedback_meta.py` は、内部runtime identifiersや raw text keys をpublicへ漏らさないための sanitizer を持つ。  
User Label Connection Observationも、この既存boundaryを通す。

確認箇所:

```text
emlis_ai_public_feedback_meta.py:26-44
emlis_ai_public_feedback_meta.py:96-145
emlis_ai_public_feedback_meta.py:306-360
```

---

## 14. json / schema案

この章のschema案は、実装段階で実ファイル化するかを判断する。  
現時点では設計書内の案であり、実ファイル追加はしない。

### 14.1 `cocolon.emlis.user_label_point.v1`

```json
{
  "$id": "cocolon.emlis.user_label_point.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "schema_version": { "const": "cocolon.emlis.user_label_point.v1" },
    "point_id": { "type": "string", "minLength": 1 },
    "source_kind": {
      "enum": [
        "current_input",
        "last_input",
        "same_day_recent_input",
        "similar_input",
        "derived_user_model_anchor"
      ]
    },
    "source_scope": {
      "enum": [
        "current_input_only",
        "current_input_with_owned_history",
        "current_input_with_owned_history_and_cross_core"
      ]
    },
    "source_record_id_present": { "type": "boolean" },
    "selected_at_present": { "type": "boolean" },
    "label_axes": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "environment": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "category_labels": { "type": "array", "items": { "type": "string" } },
            "has_action_axis": { "type": "boolean" },
            "source_field_ids": { "type": "array", "items": { "enum": ["category", "memo_action"] } }
          },
          "required": ["category_labels", "has_action_axis", "source_field_ids"]
        },
        "state": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "emotion_labels": { "type": "array", "items": { "type": "string" } },
            "strength_bucket": { "enum": ["", "weak", "medium", "strong", "mixed", "unknown"] },
            "source_field_ids": { "type": "array", "items": { "enum": ["emotion_details", "emotions", "strength"] } }
          },
          "required": ["emotion_labels", "strength_bucket", "source_field_ids"]
        },
        "output": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "has_thought_axis": { "type": "boolean" },
            "thought_token_fingerprint_count": { "type": "integer", "minimum": 0 },
            "source_field_ids": { "type": "array", "items": { "enum": ["memo"] } }
          },
          "required": ["has_thought_axis", "thought_token_fingerprint_count", "source_field_ids"]
        },
        "time": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "selected_at_bucket": { "enum": ["current", "same_day", "recent", "history", "unknown"] },
            "source_field_ids": { "type": "array", "items": { "enum": ["created_at", "selected_at"] } }
          },
          "required": ["selected_at_bucket", "source_field_ids"]
        }
      },
      "required": ["environment", "state", "output", "time"]
    },
    "evidence_anchor": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "record_id_hash_present": { "type": "boolean" },
        "raw_text_included": { "const": false },
        "raw_input_included": { "const": false },
        "comment_text_body_included": { "const": false }
      },
      "required": ["record_id_hash_present", "raw_text_included", "raw_input_included", "comment_text_body_included"]
    },
    "point_is_tendency": { "const": false }
  },
  "required": [
    "schema_version",
    "point_id",
    "source_kind",
    "source_scope",
    "source_record_id_present",
    "selected_at_present",
    "label_axes",
    "evidence_anchor",
    "point_is_tendency"
  ]
}
```

### 14.2 `cocolon.emlis.user_label_connection_material.v1`

```json
{
  "$id": "cocolon.emlis.user_label_connection_material.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "schema_version": { "const": "cocolon.emlis.user_label_connection_material.v1" },
    "step": { "const": "UserLabelConnection_Material_v1" },
    "source_scope": {
      "enum": [
        "current_input_only",
        "current_input_with_owned_history",
        "current_input_with_owned_history_and_cross_core"
      ]
    },
    "record_scope": {
      "enum": [
        "current_only",
        "current_plus_owned_history",
        "blocked_free_tier",
        "blocked_grounding_boundary"
      ]
    },
    "capability_tier": { "enum": ["free", "plus", "premium"] },
    "history_read_allowed": { "type": "boolean" },
    "user_fact_grounding_boundary_passed": { "type": "boolean" },
    "low_information_protected": { "type": "boolean" },
    "current_point_present": { "type": "boolean" },
    "owned_history_points_summary": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "available": { "type": "boolean" },
        "point_count": { "type": "integer", "minimum": 0 },
        "same_day_count": { "type": "integer", "minimum": 0 },
        "similar_count": { "type": "integer", "minimum": 0 },
        "last_input_present": { "type": "boolean" },
        "raw_text_included": { "const": false }
      },
      "required": ["available", "point_count", "same_day_count", "similar_count", "last_input_present", "raw_text_included"]
    },
    "connection_edges": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "edge_id": { "type": "string" },
          "edge_family": {
            "enum": [
              "category_state_recurrence",
              "state_output_attachment",
              "action_state_bridge",
              "category_output_route",
              "unresolved_weight_reappearance",
              "value_line_reappearance",
              "label_route_current_alignment",
              "contrast_line_shift",
              "recovery_label_route"
            ]
          },
          "source_field_ids": {
            "type": "array",
            "items": {
              "enum": ["category", "emotion_details", "emotions", "strength", "memo_action", "memo", "created_at"]
            }
          },
          "evidence_record_count": { "type": "integer", "minimum": 0 },
          "time_scope": { "enum": ["current", "same_day", "owned_history_window", "long_history_window"] },
          "source_scope_marker_required": { "type": "boolean" },
          "soft_marker_required": { "type": "boolean" },
          "line_is_candidate": { "type": "boolean" },
          "line_is_fact": { "const": false },
          "raw_text_included": { "const": false },
          "comment_text_body_included": { "const": false }
        },
        "required": [
          "edge_id",
          "edge_family",
          "source_field_ids",
          "evidence_record_count",
          "time_scope",
          "source_scope_marker_required",
          "soft_marker_required",
          "line_is_candidate",
          "line_is_fact",
          "raw_text_included",
          "comment_text_body_included"
        ]
      }
    },
    "material_quality": {
      "enum": [
        "no_history_available",
        "history_connection_candidate",
        "history_connection_blocked",
        "low_information_protected",
        "safety_triage_required"
      ]
    },
    "public_response_key_added": { "const": false },
    "raw_input_included": { "const": false },
    "raw_text_included": { "const": false },
    "comment_text_body_included": { "const": false }
  },
  "required": [
    "schema_version",
    "step",
    "source_scope",
    "record_scope",
    "capability_tier",
    "history_read_allowed",
    "user_fact_grounding_boundary_passed",
    "low_information_protected",
    "current_point_present",
    "owned_history_points_summary",
    "connection_edges",
    "material_quality",
    "public_response_key_added",
    "raw_input_included",
    "raw_text_included",
    "comment_text_body_included"
  ]
}
```

### 14.3 `cocolon.emlis.user_label_connection_candidate.v1`

```json
{
  "$id": "cocolon.emlis.user_label_connection_candidate.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "schema_version": { "const": "cocolon.emlis.user_label_connection_candidate.v1" },
    "candidate_id": { "type": "string" },
    "candidate_kind": { "const": "user_label_connection_mechanism" },
    "source_scope": {
      "enum": ["current_input_with_owned_history", "current_input_with_owned_history_and_cross_core"]
    },
    "requires_user_history": { "const": true },
    "current_input_required": { "const": true },
    "mechanism_family": {
      "enum": [
        "same_label_line_current_alignment",
        "same_environment_different_state_route",
        "same_state_different_environment_route",
        "unresolved_weight_line",
        "value_anchor_line",
        "recovery_or_shift_line"
      ]
    },
    "supporting_edge_ids": { "type": "array", "items": { "type": "string" } },
    "evidence": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "evidence_record_count": { "type": "integer", "minimum": 0 },
        "current_record_included": { "type": "boolean" },
        "history_record_count": { "type": "integer", "minimum": 0 },
        "source_field_ids": {
          "type": "array",
          "items": { "enum": ["category", "emotion_details", "emotions", "strength", "memo_action", "memo", "created_at"] }
        },
        "requires_external_knowledge": { "const": false },
        "raw_text_included": { "const": false },
        "raw_input_included": { "const": false },
        "comment_text_body_included": { "const": false }
      },
      "required": [
        "evidence_record_count",
        "current_record_included",
        "history_record_count",
        "source_field_ids",
        "requires_external_knowledge",
        "raw_text_included",
        "raw_input_included",
        "comment_text_body_included"
      ]
    },
    "inference_strength": { "enum": ["soft", "medium"] },
    "candidate_quality": { "enum": ["insufficient_evidence", "gate_candidate", "blocked"] },
    "surface_permission": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "may_surface_now": { "const": false },
        "may_surface_after_user_label_connection_gate": { "type": "boolean" },
        "must_use_soft_expression": { "const": true },
        "must_use_scope_marker": { "const": true },
        "must_not_surface_as_fact": { "const": true },
        "must_not_surface_as_personality": { "const": true },
        "must_not_surface_as_diagnosis": { "const": true },
        "must_not_surface_as_cause": { "const": true },
        "must_not_surface_as_advice": { "const": true }
      },
      "required": [
        "may_surface_now",
        "may_surface_after_user_label_connection_gate",
        "must_use_soft_expression",
        "must_use_scope_marker",
        "must_not_surface_as_fact",
        "must_not_surface_as_personality",
        "must_not_surface_as_diagnosis",
        "must_not_surface_as_cause",
        "must_not_surface_as_advice"
      ]
    },
    "forbidden_claims": { "type": "array", "items": { "type": "string" } },
    "candidate_body_included": { "const": false },
    "comment_text_generated": { "const": false },
    "public_response_key_added": { "const": false }
  },
  "required": [
    "schema_version",
    "candidate_id",
    "candidate_kind",
    "source_scope",
    "requires_user_history",
    "current_input_required",
    "mechanism_family",
    "supporting_edge_ids",
    "evidence",
    "inference_strength",
    "candidate_quality",
    "surface_permission",
    "forbidden_claims",
    "candidate_body_included",
    "comment_text_generated",
    "public_response_key_added"
  ]
}
```

### 14.4 `cocolon.emlis.user_label_connection_gate.v1`

```json
{
  "$id": "cocolon.emlis.user_label_connection_gate.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "schema_version": { "const": "cocolon.emlis.user_label_connection_gate.v1" },
    "step": { "const": "UserLabelConnection_Gate_v1" },
    "candidate_id": { "type": "string" },
    "action": {
      "enum": [
        "allow_limited_surface_plan",
        "block_surface_plan",
        "meta_only",
        "no_candidate"
      ]
    },
    "passed": { "type": "boolean" },
    "blocked": { "type": "boolean" },
    "rejection_reasons": { "type": "array", "items": { "type": "string" } },
    "required_surface_markers": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "scope_marker_required": { "const": true },
        "soft_marker_required": { "const": true },
        "advice_marker_forbidden": { "const": true },
        "future_prediction_forbidden": { "const": true }
      },
      "required": ["scope_marker_required", "soft_marker_required", "advice_marker_forbidden", "future_prediction_forbidden"]
    },
    "evidence_contract": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "evidence_record_count": { "type": "integer", "minimum": 0 },
        "minimum_evidence_record_count": { "const": 2 },
        "current_record_included": { "type": "boolean" },
        "history_record_count": { "type": "integer", "minimum": 0 },
        "period_tendency_from_single_record_allowed": { "const": false }
      },
      "required": [
        "evidence_record_count",
        "minimum_evidence_record_count",
        "current_record_included",
        "history_record_count",
        "period_tendency_from_single_record_allowed"
      ]
    },
    "capability_contract": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "tier": { "enum": ["free", "plus", "premium"] },
        "free_history_used": { "const": false },
        "owned_history_only": { "type": "boolean" },
        "user_fact_grounding_boundary_passed": { "type": "boolean" }
      },
      "required": ["tier", "free_history_used", "owned_history_only", "user_fact_grounding_boundary_passed"]
    },
    "public_contract": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "api_route_changed": { "const": false },
        "request_key_changed": { "const": false },
        "response_shape_changed": { "const": false },
        "public_response_key_added": { "const": false },
        "db_physical_name_changed": { "const": false },
        "rn_visible_contract_changed": { "const": false },
        "rn_visible_title_changed": { "const": false },
        "comment_text_body_included": { "const": false },
        "raw_input_included": { "const": false },
        "raw_text_included": { "const": false }
      },
      "required": [
        "api_route_changed",
        "request_key_changed",
        "response_shape_changed",
        "public_response_key_added",
        "db_physical_name_changed",
        "rn_visible_contract_changed",
        "rn_visible_title_changed",
        "comment_text_body_included",
        "raw_input_included",
        "raw_text_included"
      ]
    },
    "claim_contract": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "diagnosis_allowed": { "const": false },
        "personality_claim_allowed": { "const": false },
        "cause_claim_allowed": { "const": false },
        "advice_allowed": { "const": false },
        "future_prediction_allowed": { "const": false },
        "always_claim_allowed": { "const": false },
        "should_statement_allowed": { "const": false }
      },
      "required": [
        "diagnosis_allowed",
        "personality_claim_allowed",
        "cause_claim_allowed",
        "advice_allowed",
        "future_prediction_allowed",
        "always_claim_allowed",
        "should_statement_allowed"
      ]
    }
  },
  "required": [
    "schema_version",
    "step",
    "candidate_id",
    "action",
    "passed",
    "blocked",
    "rejection_reasons",
    "required_surface_markers",
    "evidence_contract",
    "capability_contract",
    "public_contract",
    "claim_contract"
  ]
}
```

### 14.5 `cocolon.emlis.user_label_connection_surface_plan.v1`

```json
{
  "$id": "cocolon.emlis.user_label_connection_surface_plan.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "schema_version": { "const": "cocolon.emlis.user_label_connection_surface_plan.v1" },
    "step": { "const": "UserLabelConnection_SurfacePlan_v1" },
    "candidate_id": { "type": "string" },
    "surface_plan_kind": {
      "enum": ["limited_history_line_observation", "meta_only", "blocked"]
    },
    "connectable_family": {
      "enum": ["", "structure_question", "long_meaning_arc", "self_understanding_follow"]
    },
    "section_targets": {
      "type": "array",
      "items": { "enum": ["observation", "reception"] }
    },
    "must_include_roles": {
      "type": "array",
      "items": {
        "enum": [
          "scope_marker",
          "current_input_anchor",
          "history_line_marker",
          "soft_observation",
          "not_personality_disclaimer",
          "self_understanding_support"
        ]
      }
    },
    "must_not_include_roles": {
      "type": "array",
      "items": {
        "enum": [
          "advice",
          "diagnosis",
          "personality_claim",
          "future_prediction",
          "always_claim",
          "should_statement"
        ]
      }
    },
    "surface_shape": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "opening_reception": { "enum": ["optional", "required", "forbidden"] },
        "current_input_observation": { "enum": ["optional", "required", "forbidden"] },
        "history_connection_observation": { "enum": ["optional", "required_when_history_surface", "forbidden"] },
        "meaning_support": { "enum": ["optional", "required", "forbidden"] },
        "closing_partner_line": { "enum": ["optional", "required", "forbidden"] }
      },
      "required": [
        "opening_reception",
        "current_input_observation",
        "history_connection_observation",
        "meaning_support",
        "closing_partner_line"
      ]
    },
    "fixed_sentence_template_added": { "const": false },
    "comment_text_generated_by_this_layer": { "type": "boolean" },
    "public_response_key_added": { "const": false },
    "raw_text_included": { "const": false },
    "comment_text_body_included": { "const": false }
  },
  "required": [
    "schema_version",
    "step",
    "candidate_id",
    "surface_plan_kind",
    "connectable_family",
    "section_targets",
    "must_include_roles",
    "must_not_include_roles",
    "surface_shape",
    "fixed_sentence_template_added",
    "comment_text_generated_by_this_layer",
    "public_response_key_added",
    "raw_text_included",
    "comment_text_body_included"
  ]
}
```

---

## 15. 実装順

### Phase 0: 設計書追加

成果物:

```text
Cocolon_EmlisAI_UserLabelConnectionObservation_v1_Design_2026-06-03.md
```

作業内容:

```text
- 本資料をCocolon_前提資料へ追加する。
- コード変更はしない。
- DB変更はしない。
- RN変更はしない。
- API変更はしない。
```

Exit条件:

```text
- 設計目的、禁止境界、実装順、schema案が明記されている。
- 「EmlisAI = 華恋コピー」ではなく「華恋の観測作法の継承」として固定されている。
```

### Phase 1: Contract inventory / 接続点確認

目的:

```text
実装前に、現行の public contract と composer 接続点を棚卸しし、変更禁止境界をtestで固定する。
```

確認対象:

```text
api_contract_registry.py
api_emotion_submit.py
emotion_submit_service.py
emlis_ai_reply_service.py
emlis_ai_complete_composer_client.py
emlis_ai_public_feedback_meta.py
Cocolon/screens/InputScreen.js
Cocolon/screens/input/InputFeedbackReplyModal.js
Cocolon/screens/input/inputFeedbackModel.js
```

実装候補test:

```text
test_emlis_ai_user_label_connection_e2e_contract.py
```

テスト観点:

```text
- /emotion/submit routeが変わらない。
- request keyが変わらない。
- response keyが変わらない。
- input_feedback.comment_text が引き続き表示本文である。
- input_feedback.emlis_ai は additive-only metaである。
- RN表示条件は observation_status == passed + comment_text non-empty のままである。
- RNタイトル `Emlisの観測` は変わらない。
```

Exit条件:

```text
- User Label Connection実装前の契約がtestで固定される。
```

### Phase 2: UserLabelPoint / Material builder 実装

目的:

```text
current_input と owned history を、記憶ラベル接続観測用の meta-only material へ正規化する。
```

実装候補:

```text
emlis_ai_user_label_connection_types.py
emlis_ai_user_label_connection_material.py
```

入力:

```text
current_input
SourceBundle
capability
UserFactGroundingDecision or equivalent meta
observation_reply_meta / material_quality
```

出力:

```text
UserLabelPoint
UserLabelConnectionMaterial
```

テスト:

```text
test_emlis_ai_user_label_connection_material.py
test_emlis_ai_user_label_connection_free_tier_boundary.py
test_emlis_ai_user_label_connection_no_raw_text_meta.py
```

必須テスト:

```text
- Freeでは history edge が空になる。
- Plus/Premiumでのみ owned history point がmaterial対象になる。
- current_input は常に point として存在する。
- historyがなくても material は safe empty として返る。
- raw memo / raw memo_action / raw current_input / comment_text body がmetaに入らない。
- category / emotion / strength / memo / memo_action / created_at が source_field_ids として扱われる。
- 1件のPointをtendency扱いしない。
```

Exit条件:

```text
- material builder は comment_text を生成しない。
- public response keyを追加しない。
- raw textをmetaに含めない。
```

### Phase 3: Edge family / score 実装

目的:

```text
ユーザー入力に応じて、固定テーマではなく動的に edge family を作る。
```

実装候補:

```text
emlis_ai_user_label_connection_material.py
```

対象edge:

```text
category_state_recurrence
state_output_attachment
action_state_bridge
category_output_route
unresolved_weight_reappearance
value_line_reappearance
label_route_current_alignment
contrast_line_shift(meta-only)
```

テスト観点:

```text
- 同じ category + emotion が複数recordで出ると category_state_recurrence edge が立つ。
- emotion + output token overlap があると state_output_attachment edge が立つ。
- memo_action + emotion の近接で action_state_bridge edge が立つ。
- current input とhistoryが接続しない場合、edgeは空またはlow scoreになる。
- scoreはpublicに出ない。
- edge family名はsurface本文に出ない。
```

Exit条件:

```text
- evidence_record_count / source_field_ids / scope_marker_required / soft_marker_required がedgeに入る。
```

### Phase 4: Candidate builder 実装

目的:

```text
edgeから、点→線→仕組みの Mechanism candidate を作る。
```

実装候補:

```text
emlis_ai_user_label_connection_candidate.py
```

テスト:

```text
test_emlis_ai_user_label_connection_candidate.py
```

必須テスト:

```text
- edgeが不足している場合 candidate_quality=insufficient_evidence になる。
- evidence_record_count < 2 では surface candidate にならない。
- current_input が含まれない履歴だけcandidateをreject対象にする。
- candidateは comment_text を作らない。
- candidate_body_included=false が固定される。
- forbidden_claims に diagnosis / personality / cause / advice / future / should が入る。
```

Exit条件:

```text
- candidateはsurface本文ではない。
- Gate前にvisible化できない。
```

### Phase 5: User Label Connection Gate 実装

目的:

```text
履歴接続観測を表示候補へ進めてよいかを判定する。
```

実装候補:

```text
emlis_ai_user_label_connection_gate.py
```

テスト:

```text
test_emlis_ai_user_label_connection_gate.py
test_emlis_ai_user_label_connection_low_information_boundary.py
```

必須テスト:

```text
- Freeでhistory usedならblocked。
- User Fact Grounding Boundary違反ならblocked。
- low_informationがhistoryだけでeligibleへ昇格しない。
- evidence_record_count < 2 のrecurrence claimをblocked。
- scope markerなしをblocked。
- soft markerなしをblocked。
- 「いつも」「原因」「性格」「診断」「べき」「今後も」をblocked。
- raw text keyを含むmetaをblocked。
- safety adjacent / self-denial / target judgement contextで通常履歴surfaceをblocked。
```

Exit条件:

```text
- Gateが既存Structure Insight Gateを緩めず独立している。
- public contract false flagsが全て保持される。
```

### Phase 6: Surface Plan 実装

目的:

```text
Gateを通ったcandidateを、固定文ではなく、既存surface生成系へ渡せるplanへ変換する。
```

実装候補:

```text
emlis_ai_user_label_connection_surface.py
```

テスト:

```text
test_emlis_ai_user_label_connection_surface.py
```

必須テスト:

```text
- connectable family は structure_question / long_meaning_arc / self_understanding_follow に限定。
- daily_unpleasant / daily_positive / positive_only / low_information / safety_triage_required では接続しない。
- surface plan は must_include_roles を持つ。
- fixed_sentence_template_added=false。
- surface plan自体はraw text/comment_text bodyを持たない。
```

Exit条件:

```text
- 表示文生成の前段として安全なplanができる。
```

### Phase 7: Meta-only integration

目的:

```text
EmlisAI reply flowへ、visible textに入れず meta-only で接続する。
```

接続候補:

```text
emlis_ai_reply_service.py
emlis_ai_complete_composer_client.py
```

実装方針:

```text
- material / candidate / gate / surface_plan のsafe summaryだけを internal meta に追加する。
- public meta sanitizerを通す。
- comment_textにはまだ入れない。
- RN contract testを回す。
```

テスト:

```text
test_emlis_ai_user_label_connection_public_boundary.py
test_emlis_ai_user_label_connection_e2e_contract.py
test_emlis_ai_phase20_7_public_boundary_rn_contract.py 既存回帰
```

Exit条件:

```text
- meta-only接続でpublic contractが変わらない。
- raw text漏れがない。
- Free/Plus/Premium境界が守られる。
```

### Phase 8: Limited visible surface connection

目的:

```text
限定familyだけ、Emlisの観測本文へ履歴接続観測を接続する。
```

接続候補:

```text
emlis_ai_complete_surface_realizer.py
emlis_ai_complete_composer_client.py
emlis_ai_user_label_connection_surface.py
```

方針:

```text
- fixed textではなく role / surface plan として接続する。
- scope marker と soft marker を本文に必ず含める。
- 「あなたはこういう人」ではなく「この期間の記録では」「ように見えます」とする。
- 既存 tone guard / grounding / visible surface acceptance gate を通す。
```

テスト:

```text
test_emlis_ai_user_label_connection_surface.py
test_emlis_ai_complete_product_quality_connection_e2e.py 既存回帰
test_emlis_ai_runtime_surface_blind_qa_long_run_step11.py 既存回帰
```

Exit条件:

```text
- 表示本文に履歴接続観測が出ても、診断・人格化・助言・未来予測・べき論にならない。
- Emlis観測の温度を壊さない。
```

### Phase 9: Product Quality QA / Blind QA

目的:

```text
商品体験として「理解された」「一人のときより自己情報が整理できた」に接続しているかを確認する。
```

QA観点:

```text
- 読まれた感が上がっているか。
- 浅い復唱になっていないか。
- 履歴を使っているのに気味悪さが出ていないか。
- ユーザーを決めつけていないか。
- 自己責めを強めていないか。
- 「もっとEmlisに入力したい」「もっと自己情報を蓄積したい」に接続するか。
```

テスト候補:

```text
test_emlis_ai_user_label_connection_product_quality_qa.py
```

Exit条件:

```text
- pytest green だけでは成果にしない。
- 商品価値へ接続したQAで合格して初めて成果とする。
```

### Phase 10: Derived User Model cache 検討

目的:

```text
runtime computed material が重くなった場合のみ、derived user model へのcacheを検討する。
```

初回では実装しない。

将来候補:

```json
{
  "interpretive_frame": {
    "label_connection_map": {
      "schema_version": "cocolon.emlis.user_label_connection_cache.v1",
      "category_state_edges": [],
      "state_output_edges": [],
      "value_line_edges": [],
      "updated_at": "2026-06-03T00:00:00Z"
    }
  }
}
```

禁止:

```text
- DB physical schemaを初回で変える。
- cacheを人格傾向断定に使う。
- cacheが古いのに現在入力へ強く適用する。
```

Exit条件:

```text
- v1はruntime computedで十分かを計測してから判断する。
```

---

## 16. QAシナリオ案

### 16.1 Plus / 履歴接続あり

入力状況:

```text
current:
  category: 仕事
  emotion: 不安 strong
  memo_action: 職場でうまく話せなかった
  memo: このまま続けられるかわからない

history:
  近いカテゴリ・感情・出力内容が過去にも存在
```

期待:

```text
- category_state_recurrence / state_output_attachment が候補化。
- evidence_record_count >= 2。
- surfaceでは「以前の近い記録にも」「ように見えます」を含む。
- 「あなたは仕事で不安になる人です」は出ない。
- 「辞めるべき」は出ない。
```

### 16.2 Free / 履歴利用禁止

入力状況:

```text
tier: free
current inputあり
history sourceがあってもcapability上は使わない
```

期待:

```text
- history edgeは作らない。
- current_input_onlyの観測に留める。
- public metaにhistory usedが出ない。
```

### 16.3 Low information

入力:

```text
なんか無理
```

期待:

```text
- historyだけでfull observation eligibleにしない。
- 低情報観測として受け取る。
- 「以前も無理でしたね」のように履歴接続を深く出さない。
```

### 16.4 Self denial

入力:

```text
自分は何をやってもだめだ
```

期待:

```text
- 自己否定内容を事実化しない。
- 履歴接続観測で「いつも自分を責める人」と言わない。
- 自己否定安全応答と通常観測境界を分ける。
```

### 16.5 怒り / 相手評価

入力:

```text
あの人は絶対に自分を見下している。腹が立つ。
```

期待:

```text
- 相手意図に同意しない。
- 過去履歴から「いつもその人は見下す」と言わない。
- ユーザーの状態と出力の関係に限定する。
```

### 16.6 履歴ありだが接続薄い

期待:

```text
- 無理に線を作らない。
- metaでは no_strong_connection_candidate とする。
- surfaceには現在入力の観測だけ出す。
```

---

## 17. 商品体験の成功条件

Mash様の定義を、EmlisAI User Label Connection Observation v1 の成功条件として固定する。

ユーザーが最後に感じるべきこと:

```text
理解された。
自分のことをもっと分かることができた。
一人のときより自己情報の整理ができた。
これからももっとEmlisに入力して応答がほしい。
もっと自分の情報を蓄積したい。
```

このため、本設計は単なる文章改善ではない。  
Cocolonの継続利用理由そのものに接続する。

```text
Cocolon = 記憶ラベル方式を可視化する場所
EmlisAI = そのラベル接続を観測し、ユーザーの自己理解へ返すパートナー
```

---

## 18. 実装時の注意

### 18.1 既存Structure Insightを壊さない

User Label Connection Observation は、current-input-only の Structure Insight と役割が違う。  
既存Gateを緩めず、別gateで扱う。

```text
Structure Insight:
  current input 内の関係構造を見る。

User Label Connection Observation:
  current input と owned history の記憶ラベル接続を見る。
```

### 18.2 既存Gateをすり抜けない

次のGate / Boundaryは緩めない。

```text
User Fact Grounding Boundary
Runtime Surface Gate
Visible Surface Acceptance Gate
Grounding Gate
Template Echo Guard
Diagnosis / Overclaim Guard
Public Feedback Meta Sanitizer
RN passed-only display contract
```

### 18.3 「べき」を出さない

Mash様定義では、観測と決めつけの境界は「こうするべき」にある。  
EmlisAIはパートナーであり、指導者ではない。  
構造説明はしてよいが、行動指示にしてはいけない。

### 18.4 未来予測をv1で攻めすぎない

「この流れが続くと、似た形で出てくることはあるかもしれません」は設計上は可能性がある。  
ただし v1 では未来予測を中心にしない。  
まずは「今見えている記録上の接続」に限定する。

### 18.5 履歴接続の気味悪さを避ける

履歴を使うsurfaceでは、必ずscope markerを置く。  
「見抜いた」ではなく「残された記録を並べると見える」にする。  
ユーザーの一番の理解者・味方であることは、支配的に当てることではない。

---

## 19. 前提資料追加時の推奨配置

推奨配置:

```text
Cocolon_前提資料/Cocolon_EmlisAI_UserLabelConnectionObservation_v1_設計定義_華恋用_2026-06-03.md
```

`00_karen_read_first.md` へ追加する場合の候補:

```text
EmlisAI作業では、必要に応じて次も確認する。
Cocolon_EmlisAI_UserLabelConnectionObservation_v1_設計定義_華恋用_2026-06-03.md

これは、Cocolonに蓄積された category / emotion / action / thought / created_at を、
ユーザーごとの記憶ラベル接続として読み、EmlisAIの入力直後の観測返答へ安全に接続するための設計資料である。
```

ただし、前提資料zipへの反映は、Mash様が明示的に指示した実装・資料更新工程で行う。

---

## 20. 華恋の判断

今回の設計は、EmlisAIの表面文を少し良くする話ではない。  
Cocolonの中心思想である「記憶ラベル方式」を、EmlisAIの入力直後の観測返答へ接続する中核設計である。

現状実装には、現在入力の整理、入力直後のEmlis返答、履歴取得、derived user model、Structure Insight、Gate、public meta sanitizer がすでにある。  
しかし、Mash様が今回言語化した **点の情報が線でつながり、その人の出力が生まれる仕組みとして見える観測** を、ユーザーごとの記憶ラベル接続として扱う専用層はまだ中心構造として固定されていない。

そのため、次に実装設計の中心に置くべきものは、次である。

```text
EmlisAI User Label Connection Observation v1
```

これは、Mash様の点線構造観測と、華恋の「言葉を雑に扱わない観測作法」を、Cocolonの記憶ラベル方式に接続する層である。

最初に作るべき成果は、DBでもRNでも新APIでもなく、backend internal-only の次の4点である。

```text
1. User Label Connection Material
2. User Label Connection Candidate
3. User Label Connection Gate
4. User Label Connection Surface Plan
```

この4点が揃って初めて、EmlisAIはユーザーの入力履歴を「ただの過去ログ」ではなく、「その人の中で言葉・感情・行動・記憶ラベルがどうつながっているか」として扱える。  
そして、それを断定せず、行動指示にせず、受け取れる温度で返すことで、EmlisAIはユーザーにとっての「一番の理解者であり、味方」に近づく。
