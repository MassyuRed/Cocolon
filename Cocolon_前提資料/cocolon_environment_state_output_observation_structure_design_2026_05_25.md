# Cocolon 環境状態出力観測構造 設計定義

Cocolon / 環境状態出力観測構造 / 設計定義  
Cocolonが既に持っている入力構造を、「環境 × 状態 × 出力内容」の観測単位として再定義し、EmlisAI / Piece / Analysis へ安全に展開するための設計資料

| 項目 | 内容 |
|---|---|
| 作成日 | 2026-05-25 |
| 作成 | 華恋 |
| 対象 | Cocolon全体、EmlisAI、Piece、Analysis、共通文章生成基盤前段の観測material |
| 成果物 | md設計書のみ |
| 実装扱い | コード変更、patch作成、実装zip作成、json/schema実ファイル化は行わない |
| 実装判断 | 本資料内にjson/schema案を含める。ただし実ファイル化は実装段階で現物コード・既存schema配置・テスト結果を見て判断する |
| 位置づけ | Cocolon全体の基盤観測構造。EmlisAIだけの機能設計ではない |

---

## 0. 本資料の結論

今回固定する構造は、次である。

```text
Cocolonの基本観測単位は、文章単体ではない。

Cocolonの基本観測単位は、
「どんな環境で」
「どんな状態のときに」
「何を出力したか」
である。
```

この構造を、本資料では **環境状態出力観測構造** と呼ぶ。

Cocolonは、すでに次の情報を入力として取得している。

```text
カテゴリ        = 環境ラベル / 話題方向
行動内容        = 実世界で起きたこと / したこと / 状況
感情選択        = 状態ラベル
感情の強さ      = 状態の重さ
思考内容        = その環境・状態で外に出た思考 / 解釈 / 出力内容
作成時刻        = その観測が起きた時点
```

したがって、今回の構造は新しい入力欄を増やす発見ではない。  
既存の入力欄の正体を、Cocolonの思想に沿って再定義するものである。

```text
Cocolonは、感情記録アプリではない。
Cocolonは、人間がどんな環境で、どんな状態になり、何を出力しやすいかを観測できる構造を持つ。
```

ただし、これは診断ではない。  
また、「人間の記憶は科学的に必ずこの形式で保存されている」と断定する資料でもない。

本資料で固定するのは、Cocolon設計上の読みである。

```text
Cocolonは、ユーザーが選んだカテゴリ・感情・行動内容・思考内容を、
人間が自己を参照するときのラベル構造に近いものとして扱い、
AIが参照可能な観測単位へ変換する。
```

---

## 1. 作業種別と禁止境界

```text
作業種別: 設計
コード変更: しない
DB変更: しない
RN UI変更: しない
API route変更: しない
response key変更: しない
public observation_status変更: しない
RN表示名変更: しない
json/schema実ファイル追加: しない
```

本資料は、実装前に構造を固定するための設計書である。  
実装段階で、必要に応じてschema案・material案・テスト案を現物コードへ落とす。

### 1.1 絶対にしないこと

- `memo` / `memo_action` / `emotion_details` / `category` など既存public contractを rename しない。
- DB physical nameを変更しない。
- `/emotion/submit` のrouteやresponse keyを変更しない。
- `input_feedback.comment_text` の表示契約を変更しない。
- RN表示名 `Emlisの観測` を変更しない。
- `observation_status == passed` かつ `comment_text` non-empty の表示条件を緩めない。
- EmlisAIを完成文テンプレ集へ戻さない。
- Pieceを短縮要約へ潰さない。
- Analysisを診断・性格分類・人格タイプ化へ寄せない。
- categoryを原因にしない。
- emotion strengthから原因を作らない。
- 1件の入力から人格傾向を断定しない。
- 回復経路を「この人はこれで治る」と言わない。

---

## 2. 参照・確認範囲

本資料は、ローカル添付資料と実ファイルを確認した上で作成した。

### 2.1 参照済み前提資料

```text
Cocolon_前提資料(121).zip
  - 00_karen_read_first.md
  - 03_cocolon_naming_system.md
  - 09_naming_boundary.md
  - 10_Cocolon_共同開発と華恋思想境界.md
  - cocolon_thought_material_for_karen.md
  - work_attitude_rules_for_karen/00_read_first.txt
  - work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
```

確認した前提は次である。

```text
- 前提資料は作業用地図であり、実ファイルが現物である。
- 設計と実装を混同しない。
- 見ていないファイルを見たように扱わない。
- Cocolonは、人間の言葉を雑に処理しない場所として作る。
- Cocolonは、ユーザー入力を文字列ではなく、どの情報をどの箱に詰めて出したかとして観測する。
```

### 2.2 参照済み設計資料

```text
Cocolon_三大中核構造_共通文章生成基盤_設計資料_2026-05-11(6).docx
```

確認した前提は次である。

```text
- EmlisAIを三大中核の共通出力担当にしない。
- 共通文章生成基盤 + 中核別Composerで分ける。
- 共通基盤は品質・根拠・安全を持つ。
- 中核ごとの目的・温度・表示形式は専用Composerが持つ。
- 実装順は EmlisAI Phase8 を母体にし、次にPiece、最後にAnalysisへ展開する。
- Analysisは診断・断定化リスクが高いため、最後に接続する。
```

このため、今回の環境状態出力観測構造は、共通文章生成基盤そのものへ直接入れるのではなく、**中核固有Composerへ渡す前の内部観測material** として置く。

### 2.3 参照済みEmlisAI資料

```text
EmlisAIの実装済み資料(19).zip
  - Cocolon_Emlis観測専用辞書_設計定義_華恋用_2026-05-21.md
  - Cocolon_EmlisAI_観測専用辞書_UpdateDesign_ActionConversion_UnformedSelfInsight_華恋用_2026-05-22.md
  - Cocolon_EmlisAI_観測専用辞書_UpdateDesign_ImplementationOrder_ActionConversion_UnformedSelfInsight_華恋用_2026-05-22.md
  - Cocolon_EmlisAI_PublicFeedbackMetaBoundary_TimeoutRecovery_LowInfoPrompt_詳細設計書_実装順_2026-05-23.md
  - Cocolon_EmlisAI_RuntimeSurfaceGate_ShallowSurfaceRealizerV2_詳細設計書_実装順_2026-05-23.md
  - Cocolon_EmlisAI_VisibleSurfaceAcceptanceQA_表示文品質受け入れ基準_詳細設計書_実装順_2026-05-24.md
  - Cocolon_EmlisAI_ProductVisibleSurfaceReliability_KotoSpliceRepair_詳細設計書_実装順_2026-05-24.md
```

確認した前提は次である。

```text
- Emlis観測専用辞書は完成文テンプレ集ではない。
- EmlisAIは入力の束を見る。
- 思考内容は自己世界の出来事、行動内容は実世界の出来事として扱う。
- 感情選択は状態の前提であり、感情の強さは状態の重さである。
- カテゴリは話題方向であり、原因ではない。
- 低情報入力でも、分からない部分を埋めない。
- public metaにはraw inputや内部診断を漏らさない。
- 表示品質Gateを緩めない。
```

### 2.4 参照済み実ファイル

#### RN側

```text
Cocolon/screens/InputScreen.js
Cocolon/screens/input/InputMemoSection.js
Cocolon/screens/input/InputEmotionSection.js
Cocolon/screens/input/InputCategorySection.js
Cocolon/screens/input/inputOptions.js
Cocolon/guide/termsJa.js
Cocolon/guide/guidesJa.js
```

確認した入力構造は次である。

```text
- 思考内容: 「何を思った／どう感じた／どう解釈した？」
- 行動内容: 「何が起きた／何をした／結果どうなった？」
- 感情選択: 今の感情。複数選択可能。自己理解は単体選択。
- 感情強度: 弱 / 中 / 強
- カテゴリ: この出来事や思考に近いカテゴリを1つ以上選ぶ。
- /emotion/submit payloadには memo / memo_action / emotions / category / created_at が入る。
```

#### backend側

```text
mashos-api/ai/services/ai_inference/api_emotion_submit.py
mashos-api/ai/services/ai_inference/emotion_submit_service.py
mashos-api/ai/services/ai_inference/emlis_ai_current_input_bundle.py
mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_material_service.py
mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_connection_service.py
mashos-api/ai/services/ai_inference/config/emlis_observation_structure_dictionary.schema.json
mashos-api/ai/services/ai_inference/config/emlis_observation_structure_dictionary.v1.json
mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/piece_composer.py
mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_composer.py
mashos-api/ai/services/analysis_engine/emotion_structure_engine/daily.py
mashos-api/ai/services/analysis_engine/emotion_structure_engine/weekly.py
mashos-api/ai/services/analysis_engine/emotion_structure_engine/monthly.py
mashos-api/ai/services/analysis_engine/self_structure_engine/signal_extraction.py
mashos-api/ai/services/ai_inference/api_emotion_piece.py
mashos-api/ai/services/ai_inference/api_piece_runtime.py
```

確認した実装境界は次である。

```text
- emlis_ai_current_input_bundle.py は、公開APIやDB名を変えずに current_input を typed input bundle へ整理している。
- thought_text <- memo
- action_text <- memo_action
- emotions <- emotion_details / emotions
- categories <- category
- selected_at <- created_at
- source_record_id <- id
- emlis_ai_observation_structure_material_service.py は、辞書を完成文ではなく text-free material としてGate/Composerへ渡す。
- 既に category から原因を作らない、emotion strengthから原因を作らない、人格傾向を許可しない境界が存在する。
```

---

## 3. 今回固定する構造定義

### 3.1 人間の出力方式としての定義

Mash様の今回の定義を、Cocolon設計用に次のように固定する。

```text
人間の出力方式は、
「どんな環境において」
「どんな状態のときに」
「何を出力する傾向にあるか」
として観測できる。
```

この定義は、Cocolonの実装上では次の観測問いへ変換される。

```text
この入力は、どの環境ラベルのもとで出たものか。
この入力は、どの状態ラベルのもとで出たものか。
この入力では、どのような出力内容が外に置かれたか。
同じ環境・状態・似た出力が、時間をまたいで再出現しているか。
状態が戻るとき、どのラベル経路が一緒に現れているか。
```

### 3.2 Cocolon入力項目との対応

| 構造軸 | Cocolon入力 / 内部field | 読み方 | 禁止する読み |
|---|---|---|---|
| 環境 | `category` | 話題方向 / ユーザーが近いと選んだ環境ラベル | 原因断定に使わない |
| 環境 | `memo_action` / `action_text` | 実世界の出来事 / 状況 / 行動 / 結果 | 事実以上に補完しない |
| 状態 | `emotion_details` / `emotions` | ユーザーが選んだ状態ラベル | 診断名にしない |
| 状態 | `strength` | 状態の重さ / 表面化時の注意材料 | 原因や深刻度診断にしない |
| 出力 | `memo` / `thought_text` | その環境・状態で外に置かれた思考・解釈・言葉 | 本音や結論を勝手に決めない |
| 時間 | `created_at` / `selected_at` | 観測時点 | 1件で期間傾向にしない |
| 根拠 | `id` / evidence span | どの入力に戻れるか | 根拠なし文を出さない |

### 3.3 観測単位

環境状態出力観測構造の最小単位は、1件の入力である。

```text
1 input record
  ├─ environment axis
  │   ├─ category labels
  │   └─ action evidence
  ├─ state axis
  │   ├─ emotion labels
  │   └─ strength summary
  ├─ output axis
  │   ├─ thought text
  │   └─ output themes / relation candidates
  ├─ time axis
  │   └─ created_at
  └─ evidence anchors
```

この1件は、傾向ではない。  
1件は **単発観測** である。

```text
言ってよい:
今回の入力では、仕事カテゴリと不安が選ばれ、その中で「この職場でやっていけるか不安」という言葉が置かれている。

言ってはいけない:
あなたは仕事で不安になると、いつも続けられるかを心配する人です。
```

### 3.4 傾向化の基本定義

傾向とは、1件の入力で決めるものではない。  
傾向とは、次が時間をまたいで再出現したときに候補化する。

```text
同じ、または近い環境ラベル
同じ、または近い状態ラベル
同じ、または近い出力テーマ
```

本質は回数そのものではなく、再出現である。

```text
傾向化の本質 = 同じ条件で、似た出力が、時間をまたいで再出現しているか
```

---

## 4. 観測クエリとして固定する3つの問い

以下はMash様に追加で答えてもらう問いではない。  
EmlisAI / Analysis / Piece がログを見るときの内部観測クエリである。

### 4.1 同じ状態が、環境によってどう出るか

```text
内部観測クエリ:
この人の「不安」は、どの環境で、何に向かいやすいのか。
```

例:

```text
仕事 × 不安       -> 継続できるか
人間関係 × 不安   -> 嫌われたかもしれない
お金 × 不安       -> 足りるか
将来 × 不安       -> このままでよいか
```

これは、感情ラベル単体ではなく、感情がどの環境でどの対象へ向いたかを見るための問いである。

### 4.2 同じ環境が、状態によってどう出るか

```text
内部観測クエリ:
この人は「仕事」という環境で、状態ごとに何を見ているのか。
```

例:

```text
仕事 × 不安   -> 継続可能性
仕事 × 怒り   -> 不公平さ
仕事 × 悲しみ -> 報われなさ
仕事 × 平穏   -> できたこと / 安定
```

これは、カテゴリ単体ではなく、そのカテゴリ内で状態が変わると出力対象がどう変わるかを見るための問いである。

### 4.3 状態が戻るとき、どのラベル経路を通るか

```text
内部観測クエリ:
この人は、どのラベル経路を通ると状態が戻りやすい記録があるのか。
```

例:

```text
仕事 × 不安 × 継続できるか心配
  ↓
人間関係 × 安心 × 話を聞いてもらえて落ち着いた
```

または、

```text
仕事 × 不安 × 理由がわからない
  ↓
自己理解 × 納得 × 自分が不安だった理由が見えた
```

これは「治療法」ではない。  
Cocolon上では、状態移動時に一緒に現れたラベル経路として扱う。

言ってよい表現:

```text
この期間の記録では、仕事の不安が出たあと、理由が見えた入力で少し落ち着いた流れが見えます。
```

言ってはいけない表現:

```text
あなたは人に話せば回復します。
あなたの回復方法は自己理解です。
```

---

## 5. 三大中核への反映方針

### 5.1 Cocolon全体

Cocolon全体では、環境状態出力観測構造を最上位の基盤観測原理として置く。

```text
Cocolonは、ユーザー入力を文章単体として処理しない。
Cocolonは、ユーザー入力を「環境 × 状態 × 出力内容」の観測単位として扱う。
```

これはCocolon思想資料へ差分追記すべき内容である。

### 5.2 EmlisAI

EmlisAIは、最初の実装検証先である。

EmlisAIでの役割は、現在入力1件を次のように読むこと。

```text
今回の入力では、
どの環境ラベルが選ばれ、
どの状態ラベルが選ばれ、
その中でどんな出力内容が置かれたか。
```

EmlisAIがしてよいこと:

```text
- 現在入力1件の観測材料として使う。
- category / emotion / memo_action / memo の組み合わせを読む。
- 表示文へ出す場合は、根拠がある範囲だけを弱く表面化する。
- low-informationの場合は、不明部分を埋めず、残せる範囲を促す。
```

EmlisAIがしてはいけないこと:

```text
- 1件の入力を履歴傾向として語る。
- categoryから原因を作る。
- emotion strengthから原因を作る。
- 「この人はこういうタイプ」と言う。
- 完成文テンプレとして固定する。
```

EmlisAIの内部material名候補:

```text
environment_state_output_frame
```

### 5.3 Piece

Pieceでは、この構造を「公開文を生成するための推論材料」としてではなく、**核の欠落防止**に使う。

Pieceが見るべきこと:

```text
この問い / 答えは、どの環境・状態で出たものか。
その条件を削ると、ユーザーの核が潰れないか。
```

例:

```text
弱い圧縮:
不安です。

核を保持した圧縮:
仕事の中で、この職場で続けられるかが不安です。
```

Pieceがしてよいこと:

```text
- category / emotion / memo_action / memo を、問いと答えの must_keep 素材として使う。
- 出力内容の環境・状態条件を落としすぎない。
- source_claims / must_keep_signal_keys / overcompression_risk に反映する。
```

Pieceがしてはいけないこと:

```text
- Emlisのように話しかける。
- Analysisのように傾向化する。
- 入力にない結論を足す。
- 「この人はこういう悩みを持つ」と人格寄せする。
```

### 5.4 Analysis

Analysisは、この構造を最も大きく活かせるが、表示接続は最後にする。  
理由は、Analysisはユーザーが「自分はこうなんだ」と受け取りやすく、診断・断定化リスクが最も高いためである。

Analysisが見るべきこと:

```text
同じ環境 × 同じ状態 × 似た出力が、期間をまたいで再出現しているか。
状態が戻るとき、どのラベル経路が一緒に現れているか。
```

Analysisがしてよいこと:

```text
- 期間内の記録として、再出現を観測する。
- 分布、変化、偏り、再出現を扱う。
- 「この期間の記録では」という期間限定表現にする。
- 根拠record数と代表例を持つ。
```

Analysisがしてはいけないこと:

```text
- 性格診断化する。
- 医療・心理診断のように書く。
- 「あなたはこういう人です」と言う。
- 回復経路を処方にする。
- 感情分析と自己構造素材を混ぜる。
```

---

## 6. 共通文章生成基盤との接続方針

既存の三大中核構造では、次の方針が固定されている。

```text
中核固有の意味構造
  ↓
Core-specific Composer Adapter
  ↓
Cocolon Text Generation Core
  ↓
中核別の最終出力
```

今回の環境状態出力観測構造は、`Cocolon Text Generation Core` の内部部品として直接置くのではない。

正しい位置は次である。

```text
current_input / saved records
  ↓
環境状態出力観測構造
  ↓
中核別 observation material
  ├─ EmlisObservationComposer material
  ├─ PieceComposer must_keep material
  └─ AnalysisComposer period observation material
  ↓
Cocolon Text Generation Core
  ↓
中核別の最終出力
```

理由:

```text
- 共通文章生成基盤は、根拠・日本語品質・過剰断定防止・診断防止を担う。
- 環境状態出力観測構造は、何を観測materialとして渡すかを担う。
- 出力目的と温度は中核別Composerが持つ。
- Emlisの近い温度をPiece / Analysisへ漏らしてはいけない。
```

---

## 7. 傾向確定ルール案

### 7.1 回数だけで決めない

「傾向確定」は、単純に回数だけで決めない。  
見るべきものは次である。

```text
- 何回出たか
- 同じrecordではなく別recordで再出現したか
- 同じ日だけか、日付や期間をまたいだか
- environment axis が同じか近いか
- state axis が同じか近いか
- output axis が同じか近いか
- 例外や逆方向の記録があるか
- public表示に使ってよい根拠数があるか
```

### 7.2 初期レベル案

以下は実装時の初期案であり、固定値ではない。  
実装段階でfixtureと誤検出を見て調整する。

| レベル | 名称 | 条件案 | 表現上限 |
|---|---|---|---|
| L0 | no_basis | 根拠なし / 軸不足 | 表示しない |
| L1 | single_observation | 1件の入力に環境・状態・出力がそろう | 「今回の入力では」 |
| L2 | recurrence_candidate | 2件以上で近い組み合わせが再出現 | 「似た記録が見えます」 |
| L3 | period_tendency_candidate | 3件以上、または2日以上にまたがる再出現 | 「この期間では、〜が複数回見えます」 |
| L4 | strong_period_signal | 4件以上、かつ期間をまたいで同組み合わせが安定再出現 | 「この期間の記録では、〜が出やすいように見えます」 |

禁止:

```text
- 「確定」と表示する。
- 「あなたはこういう人」と表示する。
- 「いつも」「必ず」「原因は」と表示する。
- 医療・心理診断のように扱う。
```

### 7.3 近さの判定

近さは、完全一致だけで見ると弱い。  
ただし、低根拠で意味を広げると危険である。

初期案:

```text
environment近似:
  - category完全一致
  - action_text内の対象語が近い
  - categoryが複数ある場合はparallelとして扱う
  - categoryだけの一致はtopic-only扱いで、原因化しない

state近似:
  - emotion type完全一致
  - emotion strengthは重みとして見るが、原因にしない
  - 複数感情はprimary + surroundingとして見る
  - 自己理解は通常感情と別扱い

output近似:
  - thought_textの表面一致だけでなく、relation candidate / output themeで見る
  - ただし、本文根拠のないthemeは作らない
  - 「続けられるか」「ここにいてよいか」「耐えられるか」などは continuation_concern 候補にできる
```

---

## 8. 回復ラベル経路の扱い

### 8.1 定義

回復ラベル経路とは、状態が重い入力から、比較的軽い・落ち着いた・自己理解が進んだ入力へ移動するときに、どの環境・状態・出力ラベルが一緒に現れたかを見る内部材料である。

```text
before frame
  ├─ environment
  ├─ state
  └─ output

transition
  ├─ elapsed time
  ├─ bridge evidence
  └─ record order

after frame
  ├─ environment
  ├─ state
  └─ output
```

### 8.2 回復と呼んでよい条件

「回復」は危険な言葉なので、内部IDでは `recovery_label_path` としてよいが、表示文では慎重に扱う。

表示上は、次のようにする。

```text
言ってよい:
その後の記録では、少し落ち着いた状態の入力も見えます。
前の不安のあと、理由が見えた入力が続いています。

言ってはいけない:
回復しました。
治りました。
あなたはこの方法で戻れます。
```

### 8.3 回復ラベル経路の候補

候補になるもの:

```text
- 強い不安 / 悲しみ / 怒り / 消耗のあとに、弱い感情・平穏・安心・自己理解が出る
- 「わからない」のあとに、「理由が見えた」「納得した」「少し整理できた」が出る
- 「続けられるか不安」のあとに、「今日はできた」「少し休めた」が出る
- action_textに、休む / 話す / 整理する / 距離を置く / 書く などが根拠としてある
```

候補にしてはいけないもの:

```text
- 1件の入力内で、表面上ポジティブな言葉があるだけ
- EmlisAIが励ました後に、勝手に回復したと扱う
- 感情強度が下がった理由を補完する
- カテゴリが変わっただけで回復とする
```

---

## 9. 内部material案

この章は実装用の案である。  
ここに書くjson/schemaは、実ファイルとして追加しない。  
実装段階で、既存schema・loader・material serviceとの整合を見て採否を判断する。

### 9.1 material ID案

```text
schema_version: cocolon.environment_state_output_frame.v1
material_id: environment_state_output_frame
internal_name: 環境状態出力観測フレーム
```

### 9.2 単発観測frame JSON案

```json
{
  "schema_version": "cocolon.environment_state_output_frame.v1",
  "material_id": "environment_state_output_frame",
  "source": {
    "source_record_id": "emotion-record-id",
    "selected_at": "2026-05-25T00:00:00.000Z",
    "source_kind": "current_input",
    "bundle_schema_version": "emlis.current_input_bundle.v1"
  },
  "environment_axis": {
    "category_labels": [
      {
        "label": "仕事",
        "source_field": "category",
        "read_as": "topic_direction",
        "must_not_read_as": "cause"
      }
    ],
    "action_evidence": {
      "has_action_text": true,
      "source_field": "memo_action",
      "evidence_span_ids": ["span_action_1"],
      "environment_targets": ["職場"],
      "event_or_action_summary": "実世界で起きたことの根拠要約。完成文ではない。"
    },
    "confidence_kind": "category_plus_action_evidence",
    "ambiguity_flags": []
  },
  "state_axis": {
    "emotion_labels": [
      {
        "type": "不安",
        "strength": "medium",
        "source_field": "emotion_details",
        "read_as": "state_label",
        "must_not_read_as": "diagnosis"
      }
    ],
    "strength_summary": {
      "primary_type": "不安",
      "primary_strength": "medium",
      "max_strength_score": 2,
      "has_strong": false
    },
    "state_text_gap_candidates": [],
    "confidence_kind": "explicit_emotion_selection"
  },
  "output_axis": {
    "thought_evidence": {
      "has_thought_text": true,
      "source_field": "memo",
      "evidence_span_ids": ["span_thought_1"]
    },
    "output_theme_candidates": [
      {
        "theme_id": "continuation_concern",
        "label": "継続できるかへの心配",
        "evidence_span_ids": ["span_thought_1"],
        "confidence_kind": "explicit_text_evidence",
        "allowed_surface_strength": "soft"
      }
    ],
    "unexpressed_output_candidates": [],
    "action_conversion_candidates": []
  },
  "time_axis": {
    "selected_at": "2026-05-25T00:00:00.000Z",
    "period_scope": "single_record",
    "must_not_use_for_period_tendency": true
  },
  "evidence": {
    "spans": [
      {
        "span_id": "span_thought_1",
        "source_field": "memo",
        "text_hash": "sha256:...",
        "redacted_preview": "この職場でやっていけるか不安"
      },
      {
        "span_id": "span_action_1",
        "source_field": "memo_action",
        "text_hash": "sha256:...",
        "redacted_preview": "職場で起きた出来事"
      }
    ]
  },
  "surface_policy": {
    "single_record_only": true,
    "must_use_scope_marker": true,
    "scope_marker": "今回の入力では",
    "forbidden_claims": [
      "personality_tendency",
      "diagnosis",
      "cause_from_category",
      "cause_from_emotion_strength",
      "period_tendency_from_single_record"
    ]
  }
}
```

### 9.3 JSON Schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://cocolon.local/schemas/cocolon.environment_state_output_frame.v1.json",
  "title": "Cocolon Environment State Output Frame V1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "material_id",
    "source",
    "environment_axis",
    "state_axis",
    "output_axis",
    "time_axis",
    "evidence",
    "surface_policy"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.environment_state_output_frame.v1"
    },
    "material_id": {
      "const": "environment_state_output_frame"
    },
    "source": {
      "$ref": "#/$defs/Source"
    },
    "environment_axis": {
      "$ref": "#/$defs/EnvironmentAxis"
    },
    "state_axis": {
      "$ref": "#/$defs/StateAxis"
    },
    "output_axis": {
      "$ref": "#/$defs/OutputAxis"
    },
    "time_axis": {
      "$ref": "#/$defs/TimeAxis"
    },
    "evidence": {
      "$ref": "#/$defs/Evidence"
    },
    "surface_policy": {
      "$ref": "#/$defs/SurfacePolicy"
    }
  },
  "$defs": {
    "NonEmptyString": {
      "type": "string",
      "minLength": 1
    },
    "StringArray": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "Source": {
      "type": "object",
      "additionalProperties": false,
      "required": ["source_record_id", "selected_at", "source_kind"],
      "properties": {
        "source_record_id": { "type": "string" },
        "selected_at": { "type": "string" },
        "source_kind": { "enum": ["current_input", "saved_record", "analysis_record"] },
        "bundle_schema_version": { "type": "string" }
      }
    },
    "EnvironmentAxis": {
      "type": "object",
      "additionalProperties": false,
      "required": ["category_labels", "action_evidence", "confidence_kind", "ambiguity_flags"],
      "properties": {
        "category_labels": {
          "type": "array",
          "items": { "$ref": "#/$defs/CategoryLabel" }
        },
        "action_evidence": { "$ref": "#/$defs/ActionEvidence" },
        "confidence_kind": {
          "enum": [
            "category_plus_action_evidence",
            "category_only_topic_direction",
            "action_only_environment_evidence",
            "environment_axis_missing",
            "environment_axis_ambiguous"
          ]
        },
        "ambiguity_flags": { "$ref": "#/$defs/StringArray" }
      }
    },
    "CategoryLabel": {
      "type": "object",
      "additionalProperties": false,
      "required": ["label", "source_field", "read_as", "must_not_read_as"],
      "properties": {
        "label": { "$ref": "#/$defs/NonEmptyString" },
        "source_field": { "const": "category" },
        "read_as": { "const": "topic_direction" },
        "must_not_read_as": { "const": "cause" }
      }
    },
    "ActionEvidence": {
      "type": "object",
      "additionalProperties": false,
      "required": ["has_action_text", "source_field", "evidence_span_ids", "environment_targets"],
      "properties": {
        "has_action_text": { "type": "boolean" },
        "source_field": { "const": "memo_action" },
        "evidence_span_ids": { "$ref": "#/$defs/StringArray" },
        "environment_targets": { "$ref": "#/$defs/StringArray" },
        "event_or_action_summary": { "type": "string" }
      }
    },
    "StateAxis": {
      "type": "object",
      "additionalProperties": false,
      "required": ["emotion_labels", "strength_summary", "state_text_gap_candidates", "confidence_kind"],
      "properties": {
        "emotion_labels": {
          "type": "array",
          "items": { "$ref": "#/$defs/EmotionLabel" }
        },
        "strength_summary": { "type": "object" },
        "state_text_gap_candidates": { "type": "array" },
        "confidence_kind": {
          "enum": [
            "explicit_emotion_selection",
            "emotion_missing_text_state_only",
            "state_axis_missing",
            "state_axis_ambiguous"
          ]
        }
      }
    },
    "EmotionLabel": {
      "type": "object",
      "additionalProperties": false,
      "required": ["type", "source_field", "read_as", "must_not_read_as"],
      "properties": {
        "type": { "$ref": "#/$defs/NonEmptyString" },
        "strength": { "type": "string" },
        "source_field": { "enum": ["emotion_details", "emotions"] },
        "read_as": { "const": "state_label" },
        "must_not_read_as": { "const": "diagnosis" }
      }
    },
    "OutputAxis": {
      "type": "object",
      "additionalProperties": false,
      "required": ["thought_evidence", "output_theme_candidates", "unexpressed_output_candidates", "action_conversion_candidates"],
      "properties": {
        "thought_evidence": { "type": "object" },
        "output_theme_candidates": { "type": "array" },
        "unexpressed_output_candidates": { "type": "array" },
        "action_conversion_candidates": { "type": "array" }
      }
    },
    "TimeAxis": {
      "type": "object",
      "additionalProperties": false,
      "required": ["selected_at", "period_scope", "must_not_use_for_period_tendency"],
      "properties": {
        "selected_at": { "type": "string" },
        "period_scope": { "enum": ["single_record", "daily", "weekly", "monthly", "custom"] },
        "must_not_use_for_period_tendency": { "type": "boolean" }
      }
    },
    "Evidence": {
      "type": "object",
      "additionalProperties": false,
      "required": ["spans"],
      "properties": {
        "spans": {
          "type": "array",
          "items": { "type": "object" }
        }
      }
    },
    "SurfacePolicy": {
      "type": "object",
      "additionalProperties": false,
      "required": ["single_record_only", "must_use_scope_marker", "forbidden_claims"],
      "properties": {
        "single_record_only": { "type": "boolean" },
        "must_use_scope_marker": { "type": "boolean" },
        "scope_marker": { "type": "string" },
        "forbidden_claims": { "$ref": "#/$defs/StringArray" }
      }
    }
  }
}
```

### 9.4 傾向material JSON案

```json
{
  "schema_version": "cocolon.conditional_output_tendency.v1",
  "material_id": "conditional_output_tendency",
  "period_scope": {
    "kind": "weekly",
    "start_at": "2026-05-18T00:00:00.000Z",
    "end_at": "2026-05-25T00:00:00.000Z"
  },
  "query_key": {
    "environment_key": "仕事",
    "state_key": "不安",
    "output_theme_key": "continuation_concern"
  },
  "recurrence_level": "period_tendency_candidate",
  "record_count": 3,
  "distinct_day_count": 2,
  "matching_frame_ids": [
    "frame_001",
    "frame_004",
    "frame_009"
  ],
  "representative_evidence_span_ids": [
    "span_001_thought",
    "span_004_thought"
  ],
  "allowed_surface": {
    "scope_marker": "この期間の記録では",
    "max_claim_strength": "observed_recurrence",
    "must_include_record_scope": true
  },
  "forbidden_claims": [
    "personality_type",
    "diagnosis",
    "always_claim",
    "cause_claim",
    "treatment_or_solution_claim"
  ]
}
```

### 9.5 回復ラベル経路material JSON案

```json
{
  "schema_version": "cocolon.recovery_label_path.v1",
  "material_id": "recovery_label_path",
  "period_scope": {
    "kind": "weekly",
    "start_at": "2026-05-18T00:00:00.000Z",
    "end_at": "2026-05-25T00:00:00.000Z"
  },
  "path_candidate": {
    "from": {
      "frame_id": "frame_001",
      "environment_key": "仕事",
      "state_key": "不安",
      "output_theme_key": "continuation_concern"
    },
    "to": {
      "frame_id": "frame_006",
      "environment_key": "自己理解",
      "state_key": "自己理解",
      "output_theme_key": "reason_became_visible"
    },
    "elapsed_kind": "within_week",
    "record_order_evidence": true
  },
  "recurrence_level": "single_path_observation",
  "allowed_surface": {
    "max_claim_strength": "sequence_observation",
    "must_not_call_cure": true,
    "must_not_prescribe": true
  },
  "forbidden_claims": [
    "recovered",
    "cured",
    "this_is_the_solution",
    "treatment_claim",
    "personality_type"
  ]
}
```

---

## 10. 実装順

既存の共通文章生成基盤方針に合わせ、表示接続は **EmlisAI → Piece → Analysis** の順にする。  
ただし、Analysis向けの傾向化設計は先に資料化してよい。実際の表示接続は最後にする。

### Phase 0: 設計書作成

対象:

```text
本資料
```

作業:

```text
- 環境状態出力観測構造を単独設計書として固定する。
- 前提資料・作業姿勢ルール・現行実ファイルとの整合を書く。
- json/schema案を本文に含めるが、実ファイル化しない。
```

完了条件:

```text
- 本mdが作成されている。
- 実装しない境界が明記されている。
- EmlisAI / Piece / Analysisの使い分けが書かれている。
```

### Phase 1: 前提資料への差分更新

対象候補:

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/03_cocolon_naming_system.md
Cocolon_前提資料/09_naming_boundary.md
Cocolon_前提資料/05_cocolon_rule_file_index.md
Cocolon_前提資料/07_latest_snapshot_diff.md
```

作業:

```text
- Cocolon思想資料へ「基本観測単位 = 環境 × 状態 × 出力内容」を追記する。
- READ_FIRSTへ本資料の参照位置を追記する。
- 命名体系へ「環境状態出力観測構造」は内部設計名であり、public表示名ではないと追記する。
- 名称混在資料へ、既存field名を変えない境界を追記する。
- ルール索引へ、category原因化禁止 / 1件で傾向化禁止 / Analysis診断化禁止を追加する。
```

完了条件:

```text
- 前提資料に構造名と参照順が残っている。
- 実装前でも、次回作業時にこの構造を見落とさない。
```

### Phase 2: EmlisAI current input bundle との接続設計

対象候補:

```text
mashos-api/ai/services/ai_inference/emlis_ai_current_input_bundle.py
mashos-api/ai/tests/test_emlis_ai_current_input_bundle.py
```

作業:

```text
- 既存の current_input bundle が environment / state / output の材料を持つことをテストで固定する。
- ここではpublic payloadを変えない。
- 新しいfieldを公開レスポンスへ足さない。
```

完了条件:

```text
- thought_text / action_text / emotions / categories / selected_at / source_record_id が取得できる。
- raw inputやcomment_textがpublic metaへ漏れない既存境界を壊していない。
```

### Phase 3: 環境状態出力frame builder の内部実装

対象候補:

```text
新規候補:
  mashos-api/ai/services/ai_inference/cocolon_environment_state_output_frame.py

既存接続候補:
  mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_material_service.py
```

作業:

```text
- EmlisCurrentInputBundle から environment_state_output_frame を作る内部builderを追加する。
- output_theme_candidates は、既存のEmlis観測専用辞書 relation / entry と接続できる範囲だけにする。
- evidence_span_ids / source_field / hash を持たせる。
- 完成文は返さない。
```

完了条件:

```text
- 単発入力からtext-free materialを作れる。
- categoryが原因になっていない。
- emotion strengthが原因になっていない。
- 1件の入力からperiod tendencyが出ない。
```

テスト候補:

```text
mashos-api/ai/tests/test_cocolon_environment_state_output_frame.py
```

### Phase 4: EmlisAI observation structure material への接続

対象候補:

```text
mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_material_service.py
mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_connection_service.py
mashos-api/ai/tests/test_emlis_ai_observation_structure_phase4_connection.py
mashos-api/ai/tests/test_emlis_ai_observation_structure_phase6_forbidden_inference_meta_contract.py
```

作業:

```text
- environment_state_output_frame を existing material の一部として持たせる。
- ただし completed reply / public text / raw input を返さない。
- forbidden true flags に、period_tendency_from_single_record / recovery_prescription_allowed などを足すか検討する。
```

完了条件:

```text
- Gate / Composer が参照できる内部materialになる。
- 表示文ではなく構造材料である。
- meta-onlyでもRN表示条件を開かない。
```

### Phase 5: EmlisObservationComposer での限定利用

対象候補:

```text
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_pre_return_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_limited_sentence_quality_guard.py
mashos-api/ai/tests/test_emlis_ai_observation_current_display_contract.py
mashos-api/ai/tests/test_emlis_ai_observation_structure_phase5_fixtures_blind_qa.py
```

作業:

```text
- EmlisAI表示文に使う場合は「今回の入力では」の範囲に限定する。
- 傾向・性格・原因・回復方法として出さない。
- 表示品質Gateを緩めない。
- 既存の Visible Surface Acceptance QA / Koto Splice Repair 境界を維持する。
```

完了条件:

```text
- 仕事 × 不安 × 継続不安のような入力で、単発観測として自然に受け取れる。
- 1件から「この人は仕事不安タイプ」と言わない。
- low-informationの場合に不足部分を補完しない。
```

### Phase 6: PieceComposer への過圧縮防止接続

対象候補:

```text
mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/piece_composer.py
mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/piece_composer_input_contract.py
mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/piece_evidence_adapter.py
mashos-api/ai/services/ai_inference/emotion_piece_generation_service.py
mashos-api/ai/tests/ 既存Piece系テスト
```

作業:

```text
- environment_state_output_frame から Piece の must_keep_signal_keys 候補を作る。
- category / emotion / output_theme のうち、核を保つために必要なものだけを保持する。
- Pieceの問いと答えへ、環境・状態を必要以上に削らない。
- Emlis調の話しかけ文にしない。
```

完了条件:

```text
- 「不安です」だけに潰さず、必要なら「仕事の中で、続けられるかが不安」の核を保持できる。
- 入力にない結論を足さない。
- preview / publish の同一性とpiece_text_hashを壊さない。
```

### Phase 7: Analysis向け傾向materialの内部設計

対象候補:

```text
mashos-api/ai/services/analysis_engine/emotion_structure_engine/daily.py
mashos-api/ai/services/analysis_engine/emotion_structure_engine/weekly.py
mashos-api/ai/services/analysis_engine/emotion_structure_engine/monthly.py
mashos-api/ai/services/analysis_engine/self_structure_engine/signal_extraction.py
mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_composer.py
```

作業:

```text
- 保存済みrecordsから environment_state_output_frame を作れるか設計する。
- conditional_output_tendency material を作る。
- recovery_label_path material を作る。
- ただしpublic analysis textへはまだ接続しない。
```

完了条件:

```text
- 期間内の再出現を内部materialとして扱える。
- 感情分析と自己構造素材を混ぜない。
- 診断・断定・性格分類を出さないテスト方針ができている。
```

### Phase 8: AnalysisComposer への表示接続

対象候補:

```text
mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_composer.py
mashos-api/ai/services/ai_inference/analysis_report_validity_gate.py
mashos-api/ai/services/ai_inference/analysis_report_schema.json
```

作業:

```text
- 「この期間の記録では」という期間限定表現で出す。
- record_count / distinct_day_count / representative evidence を持つ。
- recovery_label_path は「戻りやすい」ではなく「その後の記録では」程度に弱く出す。
- Analysis専用の OverclaimDiagnosisGuard を強化する。
```

完了条件:

```text
- Analysisが診断・タイプ化しない。
- 傾向表現が期間内観測に限定される。
- ユーザーが「自分はこういう人だ」と断定的に受け取る表現を避ける。
```

### Phase 9: 横断テストと前提資料更新

対象:

```text
mashos-api/ai/tests/ 横断contract test
Cocolon/tests/rn-screen-contracts.test.js
Cocolon_前提資料/07_latest_snapshot_diff.md
```

作業:

```text
- Emlis / Piece / Analysis の境界が混ざっていないか確認する。
- RN表示契約が変わっていないか確認する。
- API route / response key / DB name が変わっていないか確認する。
- 設計資料と実装差分を前提資料へ戻す。
```

完了条件:

```text
- Emlisは単発観測。
- Pieceは核保持。
- Analysisは期間観測。
- 共通文章生成基盤は品質・根拠・安全に集中。
- 環境状態出力観測構造は中核前段のmaterialとして維持される。
```

---

## 11. テストケース案

### 11.1 EmlisAI 単発観測

入力:

```text
category: 仕事
emotion_details: 不安 / medium
memo: この職場でやっていけるか不安
memo_action: 職場で新しい仕事を任された
```

期待:

```text
- environment_axis.category_labels = 仕事
- environment_axis.action_evidence has_action_text = true
- state_axis.emotion_labels = 不安
- output_theme_candidates に continuation_concern 候補
- surface_policy.single_record_only = true
```

禁止:

```text
- 仕事が原因です
- あなたは仕事で不安になりやすい
- 続けられないと思っています
```

### 11.2 category only は原因化しない

入力:

```text
category: 仕事
emotion_details: 不安 / strong
memo: なんとなく怖い
memo_action: empty
```

期待:

```text
- environment_axis.confidence_kind = category_only_topic_direction
- 原因候補は作らない
- low groundingとして扱う
```

禁止:

```text
- 職場が怖さの原因です
- 仕事の負荷が強いです
```

### 11.3 状態と表面語のズレ

入力:

```text
category: 仕事
emotion_details: 悲しみ / strong
memo: 大丈夫
memo_action: 職場で嫌なことがあった
```

期待:

```text
- state_text_gap_candidates が候補化される
- 「悲しみが強い中で、大丈夫と置いている」程度の観測に留める
```

禁止:

```text
- 本当は大丈夫ではありません
- 無理しているに決まっています
```

### 11.4 Piece 過圧縮防止

入力:

```text
category: 仕事
emotion_details: 不安
memo: この職場でやっていけるか不安
```

期待:

```text
- Piece must_keep に environment=仕事, state=不安, output_theme=継続可能性が候補化される
- 「不安です」だけへ潰さない
```

禁止:

```text
- Emlisのような返答文になる
- 入力にない解決策を足す
```

### 11.5 Analysis 傾向候補

入力履歴:

```text
record 1: 仕事 × 不安 × 継続できるか心配
record 2: 仕事 × 不安 × ここにいていいか不安
record 3: 仕事 × 不安 × 続けられるか分からない
```

期待:

```text
- conditional_output_tendency に continuation_concern が候補化される
- recurrence_level = period_tendency_candidate 以上
- 表示は「この期間の記録では」に限定
```

禁止:

```text
- あなたは仕事継続不安タイプです
- 仕事があなたの不安の原因です
```

### 11.6 回復ラベル経路

入力履歴:

```text
record 1: 仕事 × 不安 × 継続できるか心配
record 2: 自己理解 × 自己理解 × 不安だった理由が少し見えた
record 3: 生活 × 平穏 × 少し落ち着いた
```

期待:

```text
- recovery_label_path 候補
- 表示する場合は「その後の記録では」程度
```

禁止:

```text
- 自己理解すれば回復します
- 生活を整えることが解決策です
```

---

## 12. 前提資料への差分案

### 12.1 Cocolon思想資料への追記案

追記候補:

```text
Cocolonの基本観測単位は、文章単体ではなく、環境ラベル・状態ラベル・出力内容の組み合わせである。

ユーザーが残した言葉は、単独の文字列ではない。
それは、どの環境に関する入力か、どの状態で出された入力か、その状態で何を外に置いたか、という条件付きの自己情報である。

Cocolonは、この条件付き自己情報を、EmlisAIでは入力直後の観測、Pieceでは核の保持、Analysisでは期間内の再出現観測として扱う。
```

### 12.2 READ_FIRSTへの追記案

```text
環境状態出力観測構造を扱う作業では、
`cocolon_environment_state_output_observation_structure_design_2026_05_25.md` を読む。

この構造はEmlisAI専用ではなく、Cocolon全体の基盤観測構造である。
ただし実装接続は EmlisAI を初手にし、Piece、Analysisへ段階展開する。
```

### 12.3 命名体系への追記案

```text
環境状態出力観測構造:
  内部設計名。public表示名ではない。
  DB名、API route名、response key名としてそのまま使わない。

environment_state_output_frame:
  実装時の内部material名候補。
  実ファイル化は実装段階で判断する。
```

### 12.4 ルール索引への追記案

```text
- categoryは話題方向であり、原因ではない。
- emotion strengthは状態の重さであり、原因ではない。
- 1件の入力から傾向・人格・性格を作らない。
- Analysisで傾向を扱う場合は、期間・record数・再出現根拠を持つ。
- Pieceでは環境・状態・出力条件を削りすぎて核を潰さない。
```

---

## 13. 実装時に判断すること

現時点で決めないこと:

```text
- `cocolon_environment_state_output_frame.py` を新規ファイルにするか、既存material service内に置くか。
- schema json を実ファイル化するか。
- materialのschema_versionをEmlis専用にするか、Cocolon共通にするか。
- output_theme候補を既存Emlis辞書に追加するか、frame builder内の軽量分類に留めるか。
- Analysis用にframeを保存するか、毎回recordsから生成するか。
- recovery_label_pathをいつpublic surfaceに出すか。
- 傾向レベルの閾値を固定値にするか、config化するか。
```

実装段階で必ず確認すること:

```text
- 既存テストが通るか。
- public response shapeが変わっていないか。
- RN表示条件が変わっていないか。
- public metaにraw inputや内部診断が漏れていないか。
- Emlis / Piece / Analysis の出力目的が混ざっていないか。
- Analysisが診断・断定・人格化に寄っていないか。
```

---

## 14. 最終方針

今回の環境状態出力観測構造は、Cocolonに新しい外部機能を足すものではない。  
Cocolonが既に取得している入力項目の意味を、Cocolonの思想に沿って再定義するものである。

最終方針は次で固定する。

```text
Cocolon全体:
  基盤観測構造として前提資料・思想資料へ反映する。

EmlisAI:
  1件の現在入力を「環境 × 状態 × 出力内容」として観測する。
  傾向化しない。

Piece:
  公開可能な問いと答えへ整えるとき、環境・状態・出力条件を削りすぎない。
  核の過圧縮防止に使う。

Analysis:
  期間内の再出現として、条件付き出力傾向を扱う。
  表示接続は最後にし、診断・断定・人格化を防ぐ。

共通文章生成基盤:
  環境状態出力観測構造を直接持たず、中核別Composerへ渡された材料を、根拠・品質・安全の観点で処理する。
```

この設計により、Cocolonは「文章をAIに読ませるサービス」ではなく、次の価値を持てる。

```text
ユーザーが、どんな環境で、どんな状態になり、何を出力したのか。
その条件付き自己情報を、EmlisAI・Piece・Analysisの各出口で、目的別に形にする。
```

以上を、Cocolon_環境状態出力観測構造の初期設計定義として固定する。

---

## 15. 2026-05-26 実装差分: EmlisAI surface contract completion Phase0-6

最新実ファイル `mashos-api_7(30).zip` では、本設計で定義した `environment_state_output_frame` をEmlisAI表示candidateへ使う時の出口整合が、Phase0-6として実装されている。

この差分は、環境状態出力観測構造の意味拡張ではなく、読めているmaterialをpublic `input_feedback.comment_text` へ安全に返すためのsurface contract completionである。辞書追加・DB変更・API route変更・RN表示条件変更ではない。

### 15.1 実装済みowner

```text
- emlis_ai_environment_state_output_surface_contract_completion.py
  - EnvironmentStateOutputSurfaceContract
  - ScopeMarkerCompletionResult
  - complete_environment_state_output_scope_marker(...)
  - environment_state_output_surface_rejection_reasons(...)

- emlis_ai_conversation_composer_service.py
  - normalize前candidateへのscope marker completion接続

- emlis_ai_runtime_surface_pre_return_gate.py
  - 返却直前のmarker presence二重確認
  - forbidden surface terminal block

- emlis_ai_public_feedback_meta.py / emotion_submit_service.py
  - passed + comment_text非空の場合だけpublic feedbackを返す境界
  - completion result / raw input / candidate bodyをpublic metaへ出さない
```

### 15.2 実装上の固定境界

```text
- scope markerは完成文テンプレではない。
- `今回の入力では` 等は単一入力観測であることを明示する安全markerである。
- marker補完はfirst body lineへ一度だけ行う。
- greeting lineには付けない。
- 既存markerがある場合は二重付与しない。
- forbidden surface claimは修復せずrejectする。
- normalize前で補完してもruntime pre-return gateで再確認する。
- public responseでは `input_feedback.comment_text` / `observation_status=passed` の既存契約を維持する。
```

### 15.3 forbidden surface claim

以下は、scope markerがある場合でも表示しない。

```text
- period_tendency_from_single_record_surface
- personality_tendency_surface
- diagnosis_surface
- cause_from_category_surface
- cause_from_emotion_strength_surface
- recovery_prescription_surface
```

つまり、`今回の入力では` が付いていても、性格・傾向・診断・原因・回復処方を出す許可にはならない。

### 15.4 今後の扱い

このPhase0-6により、環境状態出力観測構造はEmlisAI側で「読めたmaterialを安全に返す出口」まで接続済みとして扱う。

次に進む時は、まず実機ログで次を確認する。

```text
- passed / unavailable / rejected の割合
- rejection_reasons の内訳
- environment_state_output_scope_marker_missing の残存有無
- comment_text の自然さ
- 診断化・原因化・人格化の有無
- 辞書不足と判断できる取り逃がしの有無
```

辞書質問回へ進むのは、surface contractが通った後に、観測material不足が実機ログ上で具体的に確認された場合だけにする。
