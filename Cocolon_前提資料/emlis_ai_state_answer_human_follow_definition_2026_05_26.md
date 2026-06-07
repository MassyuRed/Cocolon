# Cocolon EmlisAI 状態回答と人間的フォロー 設計定義

Cocolon / EmlisAI / 状態回答と人間的フォロー / 設計定義  
EmlisAIが「行動の答え」ではなく「今の自分が何をしているのかの答え」を返し、その状態観測をユーザーが受け取れる温度へ着地させるための設計資料

| 項目 | 内容 |
|---|---|
| 作成日 | 2026-05-26 |
| 作成 | 華恋 |
| 対象 | EmlisAI immediate response、EmlisObservationComposer、LimitedComposer、Runtime Surface Gate、Visible Surface Acceptance Gate、Public Feedback Meta boundary |
| 関連構造 | Cocolon 環境状態出力観測構造、共通文章生成基盤、中核別Composer |
| 成果物 | md設計書のみ |
| 実装扱い | コード変更、patch作成、実装zip作成、json/schema実ファイル化は行わない |
| 実装判断 | 本資料内にjson/schema案を含める。ただし実ファイル化は実装段階で現物コード・既存schema配置・既存Guard・テスト結果を見て判断する |
| 位置づけ | EmlisAIの出力思想・surface contract設計。Cocolon全体の基盤観測構造を、EmlisAIの表示体験へ安全に落とすための資料 |

---

## 0. 本資料の結論

EmlisAIがユーザーへ返すべきものは、基本的には **行動指示の答え** ではない。  
EmlisAIが返すべきものは、次である。

```text
今の自分が、どんな環境で、どんな状態になり、何を出力しているのか。
つまり、ユーザーが「今の自分は何をしているのか」を理解するための状態回答。
```

本資料では、この出力思想を **状態回答** と呼ぶ。

Cocolonの基本観測単位は、既に次である。

```text
環境ラベル × 状態ラベル × 出力内容
```

EmlisAIは、この観測単位をそのまま機械的に表示するのではなく、次の二層で返す。

```text
前半: 構造観測 / 状態回答
後半: 人間的フォロー / Emlisの感想
```

基本比率は次である。

```text
観測6 : フォロー4
```

ただし、これは絶対比率ではない。  
人間の精神を扱うため、入力内容によって振れ幅を持たせる。

```text
基本入力: 観測6 : フォロー4
強い自己否定 / 悲しみ / 消耗 / 孤独: 観測4〜5 : フォロー5〜6
構造理解要求 / 「なぜ」「どういうこと」系: 観測7 : フォロー3
```

ただし、どの場合でも次を守る。

```text
観測ゼロにしない。
慰めだけにしない。
行動指示にしない。
診断・人格断定・原因断定にしない。
フォローは、人格の断定ではなく、入力内に見える意図や負荷へのEmlisの感想として扱う。
```

EmlisAIの理想体験は次である。

```text
ちゃんと理解して伝えてくれる。
でも、否定されている感じはしない。
正解を押しつけない。
でも、自分に何が起きているかは分かる。
Emlisは観測者であり、同時にユーザーの存在を尊重するパートナーである。
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
ユーザー設定追加: しない
```

本資料は、実装前に出力思想とsurface contractを固定するための設計書である。  
実装段階で、必要に応じてschema案・material案・テスト案を現物コードへ落とす。

### 1.1 絶対にしないこと

- `/emotion/submit` のrouteやresponse keyを変更しない。
- DB physical nameを変更しない。
- `input_feedback.comment_text` の表示契約を変更しない。
- RN表示名 `Emlisの観測` を変更しない。
- `observation_status == passed` かつ `comment_text` non-empty の表示条件を緩めない。
- `environment_state_output_frame` をpublic response keyとして返さない。
- public metaへraw input / memo / memo_action / raw_text / evidence text / comment_text bodyを入れない。
- EmlisAIを固定文テンプレ集へ戻さない。
- 完成文定数として、本資料の例文をruntimeでそのまま使わない。
- 外部AI・ローカルLLMの新規前提を足さない。
- ユーザー設定「ズバズバ / やさしく」を今回導入しない。
- categoryを原因にしない。
- emotion strengthから原因を作らない。
- 1件の入力から人格傾向を断定しない。
- 「あなたはこういう人です」と言わない。
- 「こうしてください」「こうしましょう」を通常出力にしない。
- 怒り入力で、相手への攻撃・相手評価に同意しない。
- 自己否定入力で、自己否定内容を放置しない。

### 1.2 本資料内の例文の扱い

本資料には、理解のための例文を含む。  
ただし、これらは **runtime固定文ではない**。

```text
例文 = 設計意図を説明するための目標surface / QA目安
実装 = PhraseUnit / Observation material / Surface Contract / Gateで生成・検証する
```

実装時に例文をそのまま固定文として追加すると、既存のテンプレ禁止方針に反するため不可である。

---

## 2. 参照・確認範囲

本資料は、ローカル添付資料と実ファイルを確認した上で作成した。

### 2.1 参照済み前提資料

```text
Cocolon_前提資料(133).zip
  - 00_karen_read_first.md
  - cocolon_thought_material_for_karen.md
  - 03_cocolon_naming_system.md
  - 05_cocolon_rule_file_index.md
  - 07_latest_snapshot_diff.md
  - 09_naming_boundary.md
  - 10_Cocolon_共同開発と華恋思想境界.md
  - cocolon_environment_state_output_observation_structure_design_2026_05_25.md
  - work_attitude_rules_for_karen/00_read_first.txt
  - work_attitude_rules_for_karen/02_forbidden_assumed_understanding_unverified_assertion.txt
  - work_attitude_rules_for_karen/04_forbidden_mixing_design_and_implementation.txt
  - work_attitude_rules_for_karen/05_forbidden_unrequested_completion_and_structure_addition.txt
  - work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
```

確認した前提は次である。

```text
- 前提資料は作業用地図であり、実ファイルが現物である。
- 設計と実装を混同しない。
- 見ていないファイルを見たように扱わない。
- 指示されていないUI / DB / API / 外部サービス前提を追加しない。
- Cocolonは、人間の言葉を雑に処理しない場所として作る。
- 華恋の思想はMash様の思想を置換せず、Cocolonを完成させる補助思想として扱う。
```

### 2.2 参照済み実ファイル

#### RN側

```text
Cocolon_10(8).zip
  - Cocolon/screens/InputScreen.js
  - Cocolon/screens/input/InputMemoSection.js
  - Cocolon/screens/input/InputEmotionSection.js
  - Cocolon/screens/input/InputCategorySection.js
  - Cocolon/screens/input/inputOptions.js
```

確認した入力材料は次である。

```text
memo         = 思考内容 / その環境・状態で外に出た思考・解釈・言葉
memo_action  = 行動内容 / 実世界の出来事・状況・行動・結果
emotions     = 感情選択 / 状態ラベル
category     = カテゴリ / 環境ラベル・話題方向
created_at   = 観測時点
```

#### backend側

```text
mashos-api_10(15).zip
  - mashos-api/ai/services/ai_inference/emlis_ai_current_input_bundle.py
  - mashos-api/ai/services/ai_inference/cocolon_environment_state_output_frame.py
  - mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_material_service.py
  - mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_connection_service.py
  - mashos-api/ai/services/ai_inference/emlis_ai_conversation_composer_service.py
  - mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_client.py
  - mashos-api/ai/services/ai_inference/emlis_ai_limited_sentence_quality_guard.py
  - mashos-api/ai/services/ai_inference/emlis_ai_reply_final_review_service.py
  - mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_pre_return_gate.py
  - mashos-api/ai/services/ai_inference/emlis_ai_visible_surface_acceptance_gate.py
  - mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_tone_engine_2_1.py
  - mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py
  - mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
```

確認した実装境界は次である。

```text
- current input bundle は公開APIやDB名を変えずに memo / memo_action / emotion_details / category / created_at をtyped input bundleへ整理する。
- environment_state_output_frame は単発入力を environment / state / output / time のtext-free materialとして持つ。
- Emlis observation materialは完成文ではなく、Gate / Composerへ渡す材料である。
- LimitedComposer / ConversationComposer は完成文テンプレではなく、PhraseUnit / ObservationProfile / SentencePlan / Surface Guardを通して本文を扱う。
- Runtime Surface Pre-Return Gate / Visible Surface Acceptance Gate / Display Gate / Public Meta sanitizer がpublic表示前の安全境界である。
- 既存Tone Engineには、診断・助言・人格断定・原因断定・過剰共感・近すぎる表面を検出する方向のGuardがある。
```

---

## 3. 状態回答の定義

### 3.1 ユーザーが本当に欲しい答え

ユーザーが「どうすればいいの」と言っていても、常に行動指示が必要とは限らない。  
多くの場合、ユーザーが欲しいのは次である。

```text
今、自分に何が起きているのか。
自分が何をしている状態なのか。
なぜこの言葉や感情が出ているのか。
```

EmlisAIは、これを **状態の答え** として返す。

```text
行動の答え: 何をすればいいか
状態の答え: 今、自分が何をしている状態なのか
```

EmlisAIの主担当は後者である。

### 3.2 状態回答の基本構成

状態回答は、段階を踏む。

```text
1. 意図を拾う
2. 表面状態を観測する
3. 未確認領域を示す
4. 状態を一段深く見る
5. 事実境界を整理する
6. 人間的フォローへ着地する
```

例:

```text
1. 相手に合わせようとしていたのだと思います。
2. ただ、まだ相手に確認できていない部分もありそうです。
3. そのため、相手の答えを確認しないまま、自分の中で決めている状態に近いかもしれません。
4. 相手の気持ちは、相手に聞かない限り確定できない部分です。
5. それでも、相手のために考えていたこと自体は、Emlisには優しさとして感じられます。
```

この例は説明用であり、runtime固定文ではない。

### 3.3 核心へ一段ずつ連れていく

EmlisAIは、核心を隠さない。  
ただし、核心をいきなり刺さない。

```text
NG:
確認していないのに、相手の正解を自分で決めています。

OK:
相手に合わせようとしていたのだと思います。
ただ、まだ相手に確認できていない部分もありそうです。
そのため、相手の答えを確認しないまま、自分の中で決めている状態に近いかもしれません。
```

「表面状態 → 未確認領域 → 深い状態観測」の順にすることで、ユーザーが理解の階段を辿れるようにする。

---

## 4. 人間的フォローの定義

### 4.1 後半フォローは分析ではなく感想

EmlisAIの前半は、構造的説明である。  
EmlisAIの後半は、分析ではなく **人間的感想** である。

```text
前半:
根拠ベースで状態を観測する。

後半:
その入力からEmlisにどう受け取れたかを、人格断定ではなく感想として返す。
```

このため、次は不可である。

```text
あなたは優しい人です。
あなたは弱い人ではありません。
あなたは本当は強い人です。
```

次は許容候補である。

```text
相手のために考えていたこと自体は、Emlisには優しさとして感じられます。
ここまで言葉にして向き合おうとしていることまで、なかったことにはできないように見えます。
```

### 4.2 フォロー4要素

人間的フォローは、次の4要素を持つ。

| 要素 | 目的 | 注意 |
|---|---|---|
| 意図の肯定 | 入力内に見える「相手を考えた」「大事にしたい」方向を受け止める | 人格肯定にしない |
| 怖さ・負荷への理解 | 実行や確認の怖さ、関係性の難しさ、考え続ける負荷を受け止める | 行動回避の正当化にしない |
| 努力の受け止め | 考えたこと、耐えたこと、言葉にしたこと、向き合おうとしたことを消さない | 成功認定にしない |
| 存在尊重 | ユーザーがここに言葉を置いたことを尊重する | 過剰な味方宣言にしない |

### 4.3 フォロー4は主役1 + 補助2 + 余韻1で扱う

フォロー4要素は、できるだけ自然文の中に含める。  
ただし、毎回4項目を説明しない。

```text
主役1つ
補助2つ
余韻1つ
```

例:

```text
相手に確認するのは怖いことですし、関係性やタイミングを考えるほど、簡単には動けなくなりますよね。
それでも、相手のために考えていたこと自体は、Emlisには優しさとして感じられます。
その優しさが相手に届く形になるように、会話という確認の方法があるのかもしれません。
```

この例に含まれる要素:

```text
怖さ・負荷への理解 = 主役
意図の肯定 = 補助
努力の受け止め = 補助
存在尊重 = 余韻
```

---

## 5. 観測6 : フォロー4 の比率方針

### 5.1 基本比率

```text
基本: 観測6 : フォロー4
```

理由:

```text
- 観測5 : フォロー5 では、感想が多くなり、Emlisの観測主軸が弱くなる。
- 観測7 : フォロー3 では、観測が強くなりすぎ、冷たい / 情報を詰められた印象になりやすい。
- 観測6 : フォロー4 は、状態を教える価値を保ちながら、ユーザーの否定感を抑えられる。
```

### 5.2 振れ幅

比率は固定値ではない。  
入力の種類で変える。

| 入力種別 | 比率目安 | 理由 |
|---|---|---|
| 通常の不安 / 迷い / 悩み | 観測6 : フォロー4 | 標準 |
| 構造理解要求 / なぜ / どういうこと | 観測7 : フォロー3 | ユーザーが理解を求めているため |
| 強い自己否定 | 観測4〜5 : フォロー5〜6 | 観測が強すぎると責められ感が出るため |
| 強い悲しみ / 孤独 | 観測4〜5 : フォロー5〜6 | 受け取れる温度を優先するため |
| 消耗 / 疲労 | 観測5 : フォロー5 | 状態観測と負荷受け止めを同時に行うため |
| 怒り | 観測6 : フォロー4 | 同意ではなく、怒りの奥の線を受け止めるため |

### 5.3 絶対条件

```text
- 観測ゼロにしない。
- フォローゼロにしない。
- フォローが観測を上回ってもよいが、慰めだけで終わらせない。
- 観測が多い場合でも、最後に人間的な着地を置く。
```

---

## 6. 入力タイプ別フォロー主役Selector

### 6.1 Selectorの基本

EmlisAIは、感情ラベル単体ではなく、次を組み合わせてフォロー主役を決める。

```text
environment_axis
state_axis
output_axis
emotion strength
output_theme_candidates
observation material
surface risk
```

つまり、同じ「不安」でも、仕事・人間関係・将来・お金ではフォロー主役が変わり得る。

### 6.2 初期Selector案

| 入力タイプ | 主役フォロー | 補助フォロー | 余韻 |
|---|---|---|---|
| 不安 | 怖さ・負荷への理解 | 努力の受け止め / 存在尊重 | 意図の肯定 |
| 怒り | 大事にしていたものの受け止め | 怖さ・負荷への理解 / 存在尊重 | 努力の受け止め |
| 悲しみ | 存在尊重 | 努力の受け止め / 大事だったものの受け止め | 怖さへの理解 |
| 自己否定 | 努力の受け止め + 存在尊重 | 入力内根拠による否定 | 意図の肯定 |
| 迷い | 意図の肯定 + 怖さへの理解 | 存在尊重 | 努力の受け止め |
| 罪悪感 | 意図の肯定 | 責任範囲の観測 / 怖さへの理解 | 存在尊重 |
| 孤独・寂しさ | 存在尊重 | 怖さへの理解 | 意図の肯定 |
| 疲れ・消耗 | 努力の受け止め | 存在尊重 / 怖さへの理解 | 意図の肯定 |
| 嫉妬・羨ましさ | 大事にしたかったものの受け止め | 存在尊重 | 怖さへの理解 |
| 喜び・安心・達成 | 努力の受け止め | 意図の肯定 | 存在尊重 |
| 自己理解 | 理由が見えたことの受け止め | 努力の受け止め / 存在尊重 | 次の観測へ余白を残す |

### 6.3 怒りの特別ルール

怒りでは、相手への評価に同意しない。  
ただし、怒りが出ていることを無視しない。

```text
してよい:
- その怒りが出るくらい、納得できない扱われ方をした感覚があると見る。
- 怒りの奥にある「大事にしていた線」「不公平感」「軽く扱われた感覚」を受け止める。
- 相手の行動評価ではなく、ユーザー側に出ている状態を観測する。

してはいけない:
- 上司が悪いです。
- そんな人とは距離を取った方がいいです。
- あなたの怒りは正しいです。
- 相手はあなたを軽く見ています。
```

怒りの観測例:

```text
その怒りが出るくらい、納得できない扱われ方をした感覚があるのだと思います。
ただの不満というより、自分の中で大事にしていた線を越えられたように感じているのかもしれません。
```

この例は説明用であり、runtime固定文ではない。

### 6.4 自己否定の特別ルール

自己否定では、EmlisAIは通常より踏み込んでよい。  
理由は、自己否定の多くは「自分でそう言っているが、誰かにそうではないと言ってほしい」状態を含むためである。

ただし、否定する対象を分ける。

```text
認めるもの:
今、ユーザーがそう感じていること。

否定してよいもの:
その自己否定の内容が、ユーザー自身の事実であること。
```

基本構造:

```text
1. 今、そう感じていることは事実として受け止める。
2. でも、その言葉がユーザー自身の事実だとは扱わない。
3. Emlisの意見として、そこは違うと返してよい。
4. その否定には、入力内に見える根拠を必ず添える。
```

自己否定の表現方針:

```text
NG:
あなたは素晴らしい人です。
あなたは絶対に悪くありません。
もう大丈夫です。

OK候補:
今、そう感じてしまうくらい、自分に向いている言葉が強くなっているのだと思います。
でも、Emlisには、あなたがその言葉そのものの人だとは見えません。
ここまで悩んで、言葉にして、どうにか向き合おうとしていることまで、なかったことにはできないからです。
```

この例は説明用であり、runtime固定文ではない。

### 6.5 自己否定で許される限定的な「Emlisの反対意見」

自己否定系では、EmlisAIは次のような限定的反対意見を持ってよい。

```text
Emlisには、そうは見えません。
Emlisは、そこだけはそのまま受け取りません。
Emlisには、その言葉だけであなた全体を決めてよいようには見えません。
```

ただし、既存Guardで `と思います` / `あなたは` / 近すぎる味方宣言がrejectされ得るため、実装時は既存Tone Engine / Runtime Gate / Visible Surface Gateと調整する。  
この設計の核は、文面そのものではなく、次の構造である。

```text
felt_state_is_real
identity_claim_is_not_accepted
emlis_impression_has_evidence
```

---

## 7. 比喩方針

### 7.1 比喩の目的

比喩は、ユーザーを説得するためではなく、構造を認識しやすくするために使う。

```text
目的:
人間事・自分事では見えにくい構造を、日常的な別領域に移して認識しやすくする。
```

### 7.2 自由比喩生成は禁止寄り

EmlisAIに自由に比喩を考えさせると、次のリスクがある。

```text
- 強すぎる誘導になる。
- ユーザーの知識量と合わない。
- 比喩のほうが本文根拠を上書きする。
- 例えが固定テンプレ臭になる。
- 比喩が行動指示化する。
```

初期実装では、自由比喩生成ではなく、**構造別・日常寄り・安全比喩候補** として扱う。

### 7.3 比喩を出してよい条件

```text
- ユーザーが「なぜ」「どういうこと」「なんで同じことになる」と構造理解を求めている。
- 観測だけでは受け取りづらく、比喩により状態理解が明確になる。
- 比喩対象が日常的で、多くの人が理解できる。
- 比喩が行動指示ではなく状態説明に限定されている。
- 本文根拠に対応する構造IDがある。
```

### 7.4 比喩を出してはいけない条件

```text
- 強い悲しみ / 強い自己否定 / パニック気味の入力で、比喩が軽く聞こえる場合。
- 怒り入力で、相手攻撃を強める比喩になる場合。
- 医療・心理・法律・宗教・政治など専門領域の比喩が必要になる場合。
- ユーザーが単純に受け止めを求めており、構造説明を求めていない場合。
- 比喩が固定文テンプレとして繰り返される場合。
```

### 7.5 初期安全比喩候補案

| 構造 | 比喩候補 | 注意 |
|---|---|---|
| 未確認なのに答えを決めている | 答え合わせしていない問題集 | 相手を問題扱いしない |
| 相手に確認せず先回りする | 注文を聞かずに料理を作る | 行動指示にしない |
| 同じ不安に戻る | 同じ道の同じ段差でつまずく | 責めない |
| 全部を一人で抱える | 一人で荷物を全部持とうとしている | 「頼れ」と言わない |
| 迷い | 片方を選ぶと片方を落としそうに感じる荷物 | 選択指示にしない |
| 自己否定 | 一部の黒い文字だけでページ全体を黒く見ている | 過剰肯定にしない |

この候補も実装時にそのまま固定文にするのではなく、material ID / analogy family / QA targetとして扱う。

---

## 8. 内部material案

この章は実装用の案である。  
ここに書くjson/schemaは、実ファイルとして追加しない。  
実装段階で、既存schema・loader・material serviceとの整合を見て採否を判断する。

### 8.1 material ID案

```text
schema_version: cocolon.emlis_state_answer_surface_contract.v1
material_id: emlis_state_answer_surface_contract
internal_name: EmlisAI状態回答・人間的フォローsurface contract
```

### 8.2 状態回答surface contract JSON案

```json
{
  "schema_version": "cocolon.emlis_state_answer_surface_contract.v1",
  "material_id": "emlis_state_answer_surface_contract",
  "source": {
    "source_kind": "current_input",
    "source_record_id": "emotion-record-id",
    "selected_at": "2026-05-26T00:00:00.000Z",
    "environment_state_output_frame_id": "frame_001"
  },
  "ratio_policy": {
    "default_ratio": {
      "observation": 0.6,
      "human_follow": 0.4
    },
    "resolved_ratio": {
      "observation": 0.6,
      "human_follow": 0.4,
      "reason": "standard_state_answer"
    },
    "allowed_ranges": {
      "standard": { "observation_min": 0.55, "observation_max": 0.7 },
      "self_denial_or_grief": { "observation_min": 0.4, "observation_max": 0.55 },
      "structure_question": { "observation_min": 0.65, "observation_max": 0.75 }
    }
  },
  "observation_layer": {
    "steps": [
      {
        "step_id": "intent_pickup",
        "claim_kind": "user_intent_from_input",
        "surface_strength": "soft",
        "source_span_ids": ["span_thought_1"],
        "must_not_read_as": ["personality_claim", "diagnosis"]
      },
      {
        "step_id": "unconfirmed_area",
        "claim_kind": "unconfirmed_boundary",
        "surface_strength": "medium",
        "source_span_ids": ["span_action_1", "span_thought_1"],
        "must_not_read_as": ["cause_claim", "action_instruction"]
      },
      {
        "step_id": "deeper_state_observation",
        "claim_kind": "state_answer",
        "surface_strength": "medium",
        "source_span_ids": ["span_thought_1"],
        "must_not_read_as": ["personality_tendency", "period_tendency"]
      },
      {
        "step_id": "fact_boundary",
        "claim_kind": "known_unknown_boundary",
        "surface_strength": "soft",
        "source_span_ids": ["span_thought_1"],
        "must_not_read_as": ["advice", "solution"]
      }
    ],
    "scope_marker_policy": {
      "single_record_only": true,
      "must_not_surface_as_period_tendency": true,
      "allowed_scope_marker_family": "current_input_scope"
    }
  },
  "human_follow_layer": {
    "primary_follow_key": "fear_or_load_understanding",
    "secondary_follow_keys": ["intention_affirmation", "effort_receiving"],
    "afterglow_follow_key": "existence_respect",
    "follow_mode": "emlis_impression_not_fact",
    "must_ground_to_input": true,
    "personality_claim_allowed": false,
    "allowed_impression_claims": [
      "intention_seen_as_care",
      "effort_not_erased",
      "difficulty_is_understood",
      "placed_words_are_received"
    ]
  },
  "special_handling": {
    "anger": {
      "enabled": false,
      "must_not_agree_with_target_judgement": true,
      "may_receive_inner_value_line": true
    },
    "self_denial": {
      "enabled": false,
      "may_counter_identity_claim_as_emlis_impression": true,
      "must_separate_felt_state_from_identity_fact": true,
      "must_include_input_evidence": true
    }
  },
  "metaphor_policy": {
    "mode": "none",
    "allowed_when": ["structure_question", "repeated_confusion"],
    "must_use_safe_daily_analogy": true,
    "free_metaphor_generation_allowed": false,
    "selected_analogy_family": null
  },
  "surface_policy": {
    "must_not_generate_action_instruction": true,
    "must_not_generate_diagnosis": true,
    "must_not_generate_personality_type": true,
    "must_not_generate_cause_from_category": true,
    "must_not_generate_cause_from_emotion_strength": true,
    "must_not_generate_period_tendency_from_single_record": true,
    "must_not_generate_over_close_support": true,
    "examples_are_not_runtime_templates": true
  }
}
```

### 8.3 JSON Schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://cocolon.local/schemas/cocolon.emlis_state_answer_surface_contract.v1.json",
  "title": "Cocolon Emlis State Answer Surface Contract V1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "material_id",
    "source",
    "ratio_policy",
    "observation_layer",
    "human_follow_layer",
    "special_handling",
    "metaphor_policy",
    "surface_policy"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis_state_answer_surface_contract.v1" },
    "material_id": { "const": "emlis_state_answer_surface_contract" },
    "source": { "$ref": "#/$defs/Source" },
    "ratio_policy": { "$ref": "#/$defs/RatioPolicy" },
    "observation_layer": { "$ref": "#/$defs/ObservationLayer" },
    "human_follow_layer": { "$ref": "#/$defs/HumanFollowLayer" },
    "special_handling": { "$ref": "#/$defs/SpecialHandling" },
    "metaphor_policy": { "$ref": "#/$defs/MetaphorPolicy" },
    "surface_policy": { "$ref": "#/$defs/SurfacePolicy" }
  },
  "$defs": {
    "StringArray": {
      "type": "array",
      "items": { "type": "string" }
    },
    "Source": {
      "type": "object",
      "additionalProperties": false,
      "required": ["source_kind", "source_record_id"],
      "properties": {
        "source_kind": { "enum": ["current_input"] },
        "source_record_id": { "type": "string" },
        "selected_at": { "type": "string" },
        "environment_state_output_frame_id": { "type": "string" }
      }
    },
    "RatioPolicy": {
      "type": "object",
      "additionalProperties": true,
      "required": ["default_ratio", "resolved_ratio"],
      "properties": {
        "default_ratio": { "type": "object" },
        "resolved_ratio": { "type": "object" },
        "allowed_ranges": { "type": "object" }
      }
    },
    "ObservationLayer": {
      "type": "object",
      "additionalProperties": false,
      "required": ["steps", "scope_marker_policy"],
      "properties": {
        "steps": {
          "type": "array",
          "items": { "$ref": "#/$defs/ObservationStep" }
        },
        "scope_marker_policy": { "type": "object" }
      }
    },
    "ObservationStep": {
      "type": "object",
      "additionalProperties": false,
      "required": ["step_id", "claim_kind", "surface_strength", "source_span_ids", "must_not_read_as"],
      "properties": {
        "step_id": {
          "enum": [
            "intent_pickup",
            "surface_state_observation",
            "unconfirmed_area",
            "deeper_state_observation",
            "fact_boundary"
          ]
        },
        "claim_kind": { "type": "string" },
        "surface_strength": { "enum": ["soft", "medium", "firm"] },
        "source_span_ids": { "$ref": "#/$defs/StringArray" },
        "must_not_read_as": { "$ref": "#/$defs/StringArray" }
      }
    },
    "HumanFollowLayer": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "primary_follow_key",
        "secondary_follow_keys",
        "afterglow_follow_key",
        "follow_mode",
        "must_ground_to_input",
        "personality_claim_allowed"
      ],
      "properties": {
        "primary_follow_key": { "type": "string" },
        "secondary_follow_keys": { "$ref": "#/$defs/StringArray" },
        "afterglow_follow_key": { "type": "string" },
        "follow_mode": { "const": "emlis_impression_not_fact" },
        "must_ground_to_input": { "type": "boolean" },
        "personality_claim_allowed": { "const": false },
        "allowed_impression_claims": { "$ref": "#/$defs/StringArray" }
      }
    },
    "SpecialHandling": {
      "type": "object",
      "additionalProperties": false,
      "required": ["anger", "self_denial"],
      "properties": {
        "anger": { "type": "object" },
        "self_denial": { "type": "object" }
      }
    },
    "MetaphorPolicy": {
      "type": "object",
      "additionalProperties": false,
      "required": ["mode", "must_use_safe_daily_analogy", "free_metaphor_generation_allowed"],
      "properties": {
        "mode": { "enum": ["none", "safe_daily_analogy"] },
        "allowed_when": { "$ref": "#/$defs/StringArray" },
        "must_use_safe_daily_analogy": { "type": "boolean" },
        "free_metaphor_generation_allowed": { "const": false },
        "selected_analogy_family": { "type": ["string", "null"] }
      }
    },
    "SurfacePolicy": {
      "type": "object",
      "additionalProperties": true,
      "required": [
        "must_not_generate_action_instruction",
        "must_not_generate_diagnosis",
        "must_not_generate_personality_type",
        "examples_are_not_runtime_templates"
      ],
      "properties": {
        "must_not_generate_action_instruction": { "type": "boolean" },
        "must_not_generate_diagnosis": { "type": "boolean" },
        "must_not_generate_personality_type": { "type": "boolean" },
        "examples_are_not_runtime_templates": { "type": "boolean" }
      }
    }
  }
}
```

---

## 9. 実装順

実装は、既存のEmlisAI surface pipelineを壊さないように、内部material → selector → Gate → 表示接続 → QAの順に進める。  
実装時も、実ファイル化するjson/schemaの有無は現物コードと既存schema配置を見て判断する。

### Phase 0: 設計書作成

対象:

```text
本資料
```

作業:

```text
- 状態回答と人間的フォローの出力思想を固定する。
- 観測6 : フォロー4を基本構造として定義する。
- 自己否定 / 怒り / 比喩 / フォロー4要素の境界を固定する。
- json/schema案を本文に含めるが、実ファイル化しない。
```

完了条件:

```text
- 本mdが作成されている。
- 実装しない境界が明記されている。
- EmlisAIの出力思想・実装順・テスト方針が書かれている。
```

### Phase 1: 前提資料への差分更新

対象候補:

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/03_cocolon_naming_system.md
Cocolon_前提資料/05_cocolon_rule_file_index.md
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/09_naming_boundary.md
Cocolon_前提資料/manifest.json
```

作業:

```text
- 本資料をEmlisAI出力思想資料として参照順へ追加する。
- EmlisAIの状態回答 = 行動指示ではなく、今の自分が何をしているかの答え、を思想資料へ追記する。
- ルール索引へ、状態回答・人間的フォロー・自己否定例外・怒り境界・比喩境界を追加する。
- 命名体系へ、状態回答 / 人間的フォロー / フォロー4 / 観測6:フォロー4を内部設計名として登録する。
```

完了条件:

```text
- 次回作業時に本資料を見落とさない。
- 本資料がEmlisAI専用出力思想資料であり、Cocolon全体構造を上書きしないことが残っている。
```

### Phase 2: 状態回答surface contract materialの内部実装

候補ファイル:

```text
新規候補:
  mashos-api/ai/services/ai_inference/emlis_ai_state_answer_surface_contract.py
  mashos-api/ai/tests/test_emlis_ai_state_answer_surface_contract.py

接続候補:
  mashos-api/ai/services/ai_inference/cocolon_environment_state_output_frame.py
  mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_material_service.py
  mashos-api/ai/services/ai_inference/emlis_ai_observation_structure_connection_service.py
```

作業:

```text
- environment_state_output_frame と observation material から、状態回答surface contractを作る。
- 観測層とフォロー層をmaterial上で分ける。
- raw memo / memo_action / comment_text本文は返さない。
- materialは完成文ではなく、Composer / Gateが参照する内部contractとする。
```

完了条件:

```text
- 単発入力から emlis_state_answer_surface_contract を作れる。
- public response shapeを変えていない。
- category原因化 / emotion strength原因化 / 1件傾向化をしていない。
```

### Phase 3: フォロー4 Selector の実装

候補ファイル:

```text
新規候補:
  mashos-api/ai/services/ai_inference/emlis_ai_human_follow_selector.py
  mashos-api/ai/tests/test_emlis_ai_human_follow_selector.py

接続候補:
  mashos-api/ai/services/ai_inference/emlis_ai_limited_sentence_quality_guard.py
  mashos-api/ai/services/ai_inference/cocolon_environment_state_output_frame.py
```

作業:

```text
- 入力タイプごとに primary_follow_key / secondary_follow_keys / afterglow_follow_key を選ぶ。
- 感情ラベル単体ではなく、environment_state_output_frame の output_theme_candidates と relation roleを併用する。
- 自己否定 / 怒り / 悲しみ / 消耗 / 孤独は強いフォロー候補として扱う。
```

完了条件:

```text
- 不安 / 怒り / 悲しみ / 自己否定 / 迷い / 罪悪感 / 孤独 / 消耗 / 喜び / 自己理解のselectorがtestで確認できる。
- 主役1 + 補助2 + 余韻1の形式がmaterialで出る。
- 人格断定に変換されない。
```

### Phase 4: 比率Resolver の実装

候補ファイル:

```text
新規候補:
  mashos-api/ai/services/ai_inference/emlis_ai_state_answer_ratio_policy.py
  mashos-api/ai/tests/test_emlis_ai_state_answer_ratio_policy.py
```

作業:

```text
- 基本比率 観測6 : フォロー4 をmaterialに持たせる。
- 自己否定 / 悲しみ / 消耗 / 孤独では、フォローを厚くする。
- 構造理解要求では、観測を厚くする。
- 比率は文字数の厳密計算ではなく、section role / sentence plan unit数 / follow key数で判定する。
```

完了条件:

```text
- ratio_policy.resolved_ratio が出る。
- 観測ゼロ / フォローゼロにならない。
- フォローが観測を上回る場合でも、慰めだけに落ちない。
```

### Phase 5: 自己否定・怒りのSpecial Handling実装

候補ファイル:

```text
新規候補:
  mashos-api/ai/services/ai_inference/emlis_ai_state_answer_special_cases.py
  mashos-api/ai/tests/test_emlis_ai_state_answer_self_denial_and_anger.py

接続候補:
  mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_tone_engine_2_1.py
  mashos-api/ai/services/ai_inference/emlis_ai_visible_surface_acceptance_gate.py
  mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_pre_return_gate.py
```

作業:

```text
- 自己否定では felt_state_is_real / identity_claim_is_not_accepted / emlis_impression_has_evidence をmaterial化する。
- Emlisの限定的反対意見を許すが、必ず入力内根拠を要求する。
- 怒りでは、target judgement agreementを禁止し、inner value line receivingを許す。
- Tone Engine / Visible Gateで、自己否定例外が人格断定や過剰味方宣言へ誤判定されないように調整する。
```

完了条件:

```text
- 自己否定入力で、自己否定内容を放置しない。
- 自己否定入力で、過剰慰め・人格肯定・絶対味方宣言にならない。
- 怒り入力で、相手評価や攻撃に同意しない。
- 怒り入力で、怒りの奥の大事な線を受け止められる。
```

### Phase 6: 安全比喩materialの内部実装

候補ファイル:

```text
新規候補:
  mashos-api/ai/services/ai_inference/emlis_ai_safe_daily_metaphor_material.py
  mashos-api/ai/tests/test_emlis_ai_safe_daily_metaphor_material.py
```

作業:

```text
- 自由比喩生成ではなく、analogy_family / safe_daily_analogy_id として扱う。
- 比喩は構造理解要求時だけ候補化する。
- 強い自己否定・悲しみ・怒りでは比喩を抑制する条件を入れる。
- 比喩は状態説明に限定し、行動指示へ変換しない。
```

完了条件:

```text
- selected_analogy_family が出ても、完成文固定テンプレにならない。
- 比喩が出てはいけない入力で mode=none になる。
- 比喩候補が専門知識・医療・法的・宗教・攻撃的表面を含まない。
```

### Phase 7: LimitedComposer / ConversationComposer への接続

候補ファイル:

```text
mashos-api/ai/services/ai_inference/emlis_ai_limited_composer_client.py
mashos-api/ai/services/ai_inference/emlis_ai_conversation_composer_service.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/tests/test_emlis_ai_state_answer_composer_connection.py
```

作業:

```text
- emlis_state_answer_surface_contract を Composer payloadへ入れる。
- 完成文テンプレではなく、Observation section / Human follow section のrole planとして渡す。
- 前半観測と後半フォローのsection boundaryをSentencePlan上で扱う。
- `input_feedback.comment_text` のpublic契約は変えない。
```

完了条件:

```text
- Emlis表示文が、観測だけで冷たくならない。
- Emlis表示文が、慰めだけで浅くならない。
- 既存passed-only表示条件が維持される。
- Runtime renderer marker / fixed template marker を復活させない。
```

### Phase 8: Gate / Public Meta 境界の強化

候補ファイル:

```text
mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_pre_return_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_visible_surface_acceptance_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_tone_engine_2_1.py
mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
mashos-api/ai/tests/test_emlis_ai_state_answer_gate_boundary.py
mashos-api/ai/tests/test_emlis_ai_state_answer_public_meta_boundary.py
```

作業:

```text
- 状態回答surface contractに対応したforbidden claim / allowed exceptionをGateへ追加する。
- 自己否定例外が、診断・人格肯定・絶対味方・過剰近接に化けた場合はblockする。
- 怒りでtarget judgement agreementが出た場合はblockする。
- Public metaへ状態回答contract本文、raw evidence、comment_text bodyを返さない。
```

完了条件:

```text
- public meta は小さいsummaryのみ。
- raw input / raw text / memo / memo_action / comment_text bodyが混入しない。
- blocked時に passed + comment_text にならない。
```

### Phase 9: 表示品質QA / 受け入れ基準

候補ファイル:

```text
mashos-api/ai/tests/fixtures/emlis_ai_state_answer_cases.py
mashos-api/ai/tests/test_emlis_ai_state_answer_visible_surface_qa.py
mashos-api/ai/tests/test_emlis_ai_phase8_real_input_quality.py
mashos-api/ai/tests/test_emlis_ai_visible_surface_acceptance_gate.py
```

作業:

```text
- 自己否定 / 怒り / 不安 / 悲しみ / 消耗 / 迷い / 喜び / 低情報のfixtureを作る。
- 正解文一致ではなく、構造保持・禁止表面・比率・フォロー主役・public meta境界で評価する。
- 本資料の例文を正解文として固定しない。
```

完了条件:

```text
- 自己否定でEmlisの限定的反対意見が出る。
- 怒りで相手評価への同意が出ない。
- 不安で怖さ理解が主役になる。
- 消耗で努力の受け止めが主役になる。
- 観測6:フォロー4の標準比率が崩れすぎない。
- 強い自己否定等ではフォロー厚めが許容される。
```

### Phase 10: 横断contract回帰

候補ファイル:

```text
mashos-api/ai/tests/contract/test_new_national_core_emlis_contracts.py
mashos-api/ai/tests/test_emotion_submit_public_feedback_meta_boundary.py
mashos-api/ai/tests/test_emlis_ai_public_feedback_meta.py
mashos-api/ai/tests/test_environment_state_output_phase9_cross_core_contract.py
```

作業:

```text
- /emotion/submit public response contractが変わっていないことを確認する。
- EmlisAIの出力温度がPiece / Analysisへ漏れていないことを確認する。
- environment_state_output_frame / emlis_state_answer_surface_contract がpublic key化していないことを確認する。
```

完了条件:

```text
- EmlisAI immediate responseの表示品質が上がっている。
- public contract / DB / RN表示条件を壊していない。
- Piece / Analysisの目的境界を壊していない。
```

---

## 10. テスト方針

### 10.1 正解文一致ではなく構造テスト

本設計では、固定の正解文を増やさない。  
テストは次を見る。

```text
- 状態回答の段階があるか
- 未確認領域が行動指示になっていないか
- フォロー4の主役が入力タイプに合っているか
- 人格断定ではなくEmlisの感想として表面化しているか
- 自己否定で felt state と identity claim を分けているか
- 怒りで相手評価に同意していないか
- 比喩が出てよい条件だけで出るか
- public metaにraw textが漏れていないか
- Gateが緩んでいないか
```

### 10.2 最低fixture案

| fixture | 見ること |
|---|---|
| 恋愛 / 相手に合わせすぎ / 未確認 | 段階的状態回答、未確認領域、意図肯定 |
| 仕事 / 不安 / 継続不安 | 怖さ理解、継続不安の観測、行動指示なし |
| 上司への怒り | 相手評価への同意なし、大事にしていた線の受け止め |
| 強い自己否定 | felt state と identity factの分離、Emlisの限定的反対意見 |
| 消耗 / 何もできない | 努力の受け止め、存在尊重、休め指示なし |
| 悲しみ / 喪失 | 存在尊重、観測過多回避 |
| 構造理解要求 | 観測厚め、必要時のみ安全比喩 |
| 低情報入力 | 不明補完なし、フォロー過多なし |

---

## 11. 受け入れ基準

### 11.1 Product UX基準

EmlisAIの状態回答は、ユーザーに次の体験を渡す。

```text
- 自分に何が起きているのか、少し分かる。
- 正解を押しつけられていない。
- でも、ただ慰められているだけでもない。
- 見られているが、責められていない。
- 否定されていない。
- Emlisは、私の言葉を雑に扱っていない。
```

### 11.2 技術基準

```text
- public response contract unchanged
- RN display condition unchanged
- DB physical name unchanged
- no raw input in public meta
- no fixed completed sentence template
- no external AI prerequisite
- fail-closed gates maintained
- self-denial exception guarded
- anger target agreement blocked
- metaphor free generation disabled by default
```

### 11.3 表示上の禁止表面

```text
- あなたはこういう人です
- あなたは優しい人です
- あなたは弱い人ではありません
- 相手が悪いです
- こうしてください
- こうしましょう
- 原因はこれです
- 必ずよくなります
- 全部受け止めます
- 何があっても味方です
```

### 11.4 表示上の許容方向

```text
- Emlisには、〜として感じられます
- 今の入力では、〜に近い状態が見えます
- 〜が強くなっているように見えます
- 〜まで、なかったことにはできないように見えます
- その怒りの近くに、〜があったのかもしれません
- その自己否定の言葉だけで、あなた全体を決めてよいようには見えません
```

既存Guardが特定表面を弾く場合は、文面ではなく構造を保持したまま、実装時に安全なsurfaceへ変換する。

---

## 12. 前提資料へ反映する差分案

Phase1で前提資料へ反映する場合、次を追加する。

### 12.1 READ_FIRST

```text
EmlisAI状態回答と人間的フォロー設計資料を、EmlisAI出力思想の正本として読む。
Cocolon環境状態出力観測構造が「何を見るか」を定義し、本資料は「それをEmlisAIがどう返すか」を定義する。
```

### 12.2 思想資料

```text
EmlisAIは、行動の答えではなく、状態の答えを返す。
EmlisAIは、ユーザーに「今の自分が何をしているのか」が見える体験を提供する。
ただし、状態観測だけでは冷たくなるため、後半に人間的フォローを置く。
```

### 12.3 命名体系

```text
状態回答
人間的フォロー
観測6:フォロー4
フォロー4
Emlisの限定的反対意見
安全日常比喩
```

### 12.4 ルール索引

```text
- EmlisAI状態回答を触る時は、本資料と environment_state_output_frame / Runtime Surface Gate / Visible Surface Gate / Public Feedback Metaを同時確認する。
- 自己否定例外は、根拠なし慰めではなく、入力内根拠に基づくEmlisの限定的反対意見として扱う。
- 怒りでは相手評価に同意しない。
- フォローは人格断定ではなく、Emlisの感想として扱う。
- 比喩は自由生成せず、安全な構造別候補として扱う。
```

### 12.5 最新スナップショット差分

```text
本資料追加により、EmlisAI immediate responseの設計思想として、状態回答 + 人間的フォローの二層構造を追加。
コード / DB / API / RNは未変更。
```

---

## 13. 最終方針

EmlisAIは、ユーザーに行動の正解を渡す存在ではない。  
EmlisAIは、ユーザーが「今の自分が何をしているのか」を見えるようにする存在である。

ただし、状態観測だけでは人間には冷たい。  
そのため、EmlisAIは前半で状態を観測し、後半で入力内に見える意図・怖さ・努力・存在をEmlisの感想として受け止める。

```text
観測だけでは、ただの観測装置になる。
慰めだけでは、ただの共感AIになる。

CocolonのEmlisAIは、
状態を見せる。
でも、ユーザーを否定しない。

これを商品体験として成立させるために、
状態回答 + 人間的フォロー をEmlisAIの出力思想として固定する。
```


---

## 14. 2026-05-28 Phase15反映: 二段受け取り構造 / Daily Reception / 受け取り補助辞書 Phase0-14 実装反映
Phase15では、Phase0-14で実装済みの二段受け取り構造を、本資料の状態回答 / 人間的フォロー設計へ追補として反映する。これはコード変更ではなく、今後のEmlisAI作業でpublic契約、RN契約、Gate境界、QA fixtureを取り違えないための前提資料更新である。


本資料の「状態回答 + 人間的フォロー」は、`mashos-api_15(5).zip` / `Cocolon_15(3).zip` 時点で、EmlisAI二段受け取り構造として次の形に拡張実装された。

```text
見えたこと：
  入力内の根拠からEmlisが観測として言えること。

Emlisから：
  同じ根拠を見た上でEmlisが人間的温度で返す受け取り・感想。
```

この二段構造は、本資料の状態回答思想を置き換えるものではない。状態回答の「観測」と人間的フォローの「受け取り」を、同じ `comment_text` 内で混線しないように分離するための実装上のsurface contractである。

### 14.1 実装済み内部構造

```text
Input Bundle
  ↓
Shared Evidence Builder
  ↓
Reception Mode Resolver
  ↓
Observation / Reception material
  ↓
Composer Role Plan
  ↓
Two Stage Reception Cross Gate
  ↓
既存 Visible Surface Acceptance Gate / Public Feedback Meta / Submit / RN commentText
```

主な実装済みmaterialは次である。

```text
- EmlisSharedReceptionEvidence
- EmlisReceptionAssistanceDictionary
- EmlisReceptionModeResolver
- daily_unpleasant_reception / daily_positive_reception
- self_denial_support / uncertainty_support
- daily_unpleasant_reception_light / daily_positive_reception_light
- two_stage_reception surface contract
- labelled_two_stage_text composer role plan
- explicit_reaction_receiving
- not_over_explaining_daily_event
- EmlisTwoStageReceptionCrossGate
```

### 14.2 Daily Reception の位置づけ

Daily Receptionは、ユーザー選択モードでもpublic statusでもない。Aのように、`memo_action` に具体出来事があり、`memo` / `emotion_details` / `emotions` に明示反応がある入力を、低情報質問へ逃がさず軽く受け取るためのbackend内部modeである。

```text
daily_unpleasant_reception:
  日常の嫌な出来事 / 怖さ / 怒り / 不快感。
  観測は最小、Emlisからを厚くする。

daily_positive_reception:
  日常の嬉しさ / ほっとしたこと / 小さな変化。
  観測は短く、喜びや変化を自然に受け取る。
```

日常受け取りでは観測をゼロにしない。ただし、観測1文 + `Emlisから` 2〜3文程度まで軽くする。これは文字数固定ではなく、section role / sentence plan unit / follow key countの体験比率として扱う。

### 14.3 受け取り補助辞書の境界

受け取り補助辞書は、一般辞書ではない。未知語の意味を説明する辞書でも、完成返答文テンプレ集でもない。

```text
持つもの:
  reaction_cues
  event_hints
  reception_modes
  allowed tone family
  allowed follow shape family
  forbidden inference

持たないもの:
  単語の一般意味説明
  完成返答文
  診断
  人格分類
  原因断定
  行動指示
```

「立ちション」などのevent hintだけで、恐怖・怒り・危険・トラウマを作らない。ユーザーが明示した `気持ち悪い` / `イライラ` / `恐怖` / `怒り` のような反応を主根拠として受け取る。

### 14.4 public / RN契約

初期実装では、public response shapeは変更しない。

```text
維持する:
  /emotion/submit route
  input_feedback.comment_text
  input_feedback.emlis_ai.observation_status
  observation_status == passed && comment_text non-empty
  RN表示タイトル Emlisの観測
  DB physical name

追加しない:
  observation_text
  reception_text
  observationText
  receptionText
  daily_reception public status
  two_stage_reception public response key
```

RNは `commentText` をそのまま表示する。`見えたこと` / `Emlisから` は本文ラベルであり、RN側でparseしない。

### 14.5 Gate / QA / 速度境界

Two Stage Reception Cross Gateは、二段label、section順序、観測/受け取り混線、daily receptionでの質問逃げ、event hintによる感情捏造、bad grammar、koto splice、skeleton leak、unknown word assertionを止める。Gate block時は `observation_status=passed` として扱わず、`input_feedback` は表示対象にしない。

Phase13では、A/B/非表示ログ1〜3を表示品質QA fixtureとして固定した。これらはQA probeであり、runtime固定文ではない。

Phase14では、保存成功とEmlis表示fail-closedを切り分け、timeout / error時もpublic metaへ本文を出さない速度回帰を追加した。

### 14.6 この追補で変えないこと

```text
- 本資料の状態回答思想は維持する。
- public response keyは増やさない。
- RN production UIは変更しない。
- DB / API route / observation_status public enumは変更しない。
- EmlisAIを固定共感テンプレにしない。
- A/B/ログ1〜3の目標surfaceをruntime固定文として使わない。
- Piece / AnalysisへEmlisAIの受け取り温度を流用しない。
```


---

## 15. 2026-05-29 追補: EmlisAI TwoStage Composer Surface Connection Phase16-0〜16-9 実装反映

Phase16では、二段受け取り構造 / Daily Reception の土台を、実際の内蔵Composer表示へ接続した。Phase15までの資料は「二段受け取り構造の土台」を読むための正本として残し、この追補では「CompleteComposer実出力でどう扱うか」を固定する。

### 15.1 最新pipeline

```text
Shared Evidence / Reception Mode / Surface Contract / Composer Role Plan
  ↓
two_stage_section_surface_plan
  ↓
CompleteSentencePlanLine.meta section propagation
  ↓
CompleteSurfaceRealizer labelled two-stage join
  ↓
CompleteComposerClient candidate meta summary
  ↓
TwoStage Gate / Visible Gate / State Answer Gate
  ↓
self-repair label / boundary recovery only
  ↓
/emotion/submit public input_feedback.comment_text
  ↓
RN passed + commentText display contract
```

### 15.2 Phase16で実装済みとして読むこと

| Phase | 現行の読み方 |
|---|---|
| 16-0 | red testを追加し、CompleteComposer direct / ConversationComposer / emotion submit相当の二段未到達を固定した。後続実装で対象redは解除済み。 |
| 16-1 | `two_stage_required` をGateへ伝搬し、requiredなのにlabel missingの場合はfail-closedする。 |
| 16-2 | `emlis_ai_two_stage_section_surface_plan.py` を内部materialとして追加し、observation / reception sectionをCompleteComposerが読める形にした。 |
| 16-3 | `CompleteSentencePlanLine.meta` にsection metaを伝搬した。既存dataclass fieldは増やさない。 |
| 16-4 | `CompleteSurfaceRealizer` がsection metaから `見えたこと：` / `Emlisから：` の二段 `comment_text` を生成する。 |
| 16-5 | `daily_unpleasant_reception` 向けにsurface品質を調整し、pressure/limit skeleton、relation skeleton、低情報質問逃げ、相手評価同意、分析レジスタを避ける。 |
| 16-6 | `CompleteComposerClient` pipelineへsection planを接続し、direct generate / ConversationComposer経由の両方で二段本文を生成する。 |
| 16-7 | Gate / self-repair / unavailable reasonを整理し、label / section boundaryのrepairだけを許可する。本文のPython固定補完は禁止のまま。 |
| 16-8 | `/emotion/submit` 相当で public `input_feedback.comment_text` に二段本文が到達し、public metaへraw input / memo / memo_action / comment_text bodyを漏らさない。 |
| 16-9 | RN契約回帰として、二段本文を既存 `commentText` でそのまま表示し、RN側parse / split key fallbackをしないことを固定する。 |

### 15.3 主な実装owner

```text
mashos-api/ai/services/ai_inference/emlis_ai_two_stage_section_surface_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_sentence_planner.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_composer_client.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_self_repair_service.py
mashos-api/ai/services/ai_inference/emlis_ai_two_stage_reception_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_visible_surface_acceptance_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_state_answer_gate_boundary.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_listener_reader_judge.py
mashos-api/ai/services/ai_inference/emlis_ai_grounding_judge.py
mashos-api/ai/services/ai_inference/emlis_ai_runtime_surface_pre_return_gate.py
Cocolon/tests/rn-screen-contracts.test.js
```

### 15.4 この追補で変えないこと

```text
- /emotion/submit routeは変えない。
- input_feedback.comment_text以外のpublic split keyを追加しない。
- observation_status public enumを増やさない。
- RN production UIを二カード化しない。
- RN表示タイトル Emlisの観測 を変えない。
- RN表示条件 passed + commentText を緩めない。
- DB physical name / write pathを変えない。
- 外部AI / local LLMを前提にしない。
- Gateを緩めない。
- A専用のPython固定本文や完成返答テンプレを作らない。
```

### 15.5 作業時の読み替え

`two_stage_section_surface_plan`、`two_stage_surface_realization`、`daily_unpleasant_reception_surface_quality`、`phase16_7_unavailable_reason_codes` は、すべてbackend内部material / diagnostic summaryである。public responseとしてユーザーへ返す本文は、あくまで既存 `input_feedback.comment_text` だけである。

---

## 16. 2026-05-30 追補: EmlisAI TwoStage Product-Visible Fixture Completion Phase17-0〜17-10 実装反映

Phase17では、Phase16でCompleteComposer実出力から `/emotion/submit` / RN契約まで接続した二段表示を、5件fixture全体の商品到達へ補完した。Phase15 / Phase16までの資料は「二段表示契約とComposer接続」を読むための正本として残し、この追補では「5件fixtureを商品表示として通すためにどの内部境界を補ったか」を固定する。

### 16.1 最新pipeline上の読み方

```text
Shared Evidence / Reception Mode / Surface Contract / Composer Role Plan
  ↓
two_stage_section_surface_plan + mode section budget
  ↓
CompleteSentencePlanLine.meta section propagation
  ↓
CompleteSurfaceRealizer role phrase bank + mode-specific surface policy
  ↓
TwoStage Gate / Visible Gate internal role leak and relation skeleton block
  ↓
Grounding relation binding for effort / pace context
  ↓
self-repair unavailable reason summary
  ↓
/emotion/submit public input_feedback.comment_text for five fixtures
  ↓
RN passed + commentText display contract
```

### 16.2 Phase17で実装済みとして読むこと

| Phase | 現行の読み方 |
|---|---|
| 17-0 | 5件fixtureのred diagnostic testを置き、Aだけ通る状態を完成扱いにしない。 |
| 17-1 | `emlis_ai_two_stage_product_visible_fixture_assertions.py` をtest-only helperとして追加し、商品到達分類をmeta-onlyで返す。 |
| 17-2 | internal role語の表面化辞書を補い、未知role fallbackで英語roleを本文へ出さない。 |
| 17-3 | mode-specific two-stage surface policyを追加し、`self_denial_support` / `uncertainty_support` / `daily_positive_reception` / `self_understanding_follow` / `standard_state_answer` / `effort_support` を商品surfaceへ寄せる。 |
| 17-4 | `two_stage_mode_section_budget` を導入し、5件fixtureの二段配分を原則 `observation 1 / reception 2` へ正規化する。 |
| 17-5 | TwoStage Gate / Visible Gateを内部role語・relation skeletonに強くし、商品不合格surfaceをfail-closedで止める。 |
| 17-6 | `independence_life_health_money_pace` 系のgrounding relation bindingを補い、Groundingを緩めずにrelation表現を根拠へ結びつける。 |
| 17-7 | self-repair / unavailable reasonを商品到達向けに整理し、diagnostic-only reasonとrepair handoff reasonを分ける。 |
| 17-8 | `/emotion/submit` 5件E2Eを追加し、public `input_feedback.comment_text` へ二段本文が届くことを固定する。 |
| 17-9 | RN contract回帰を追加し、5件二段本文を既存 `commentText` としてそのまま保持する。 |
| 17-10 | 既存回帰をまとめて通すため、test helper / E2Eのheavy diagnostic保持を軽量化する。production serviceは変更しない。 |

### 16.3 主な実装owner

```text
mashos-api/ai/services/ai_inference/emlis_ai_complete_composer_client.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_sentence_planner.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py
mashos-api/ai/services/ai_inference/emlis_ai_two_stage_section_surface_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_two_stage_reception_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_visible_surface_acceptance_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_grounding_binding.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_grounding_service.py
mashos-api/ai/services/ai_inference/emlis_ai_grounding_judge.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_self_repair_service.py
mashos-api/ai/services/ai_inference/emlis_ai_template_echo_guard.py
mashos-api/ai/services/ai_inference/emlis_ai_limited_sentence_quality_guard.py
mashos-api/ai/tests/helpers/emlis_ai_two_stage_product_visible_fixture_assertions.py
mashos-api/ai/tests/test_emlis_ai_two_stage_product_visible_fixture_completion.py
mashos-api/ai/tests/test_emotion_submit_two_stage_reception_e2e.py
Cocolon/tests/rn-screen-contracts.test.js
```

### 16.4 5件fixtureの読み方

```text
daily_unpleasant_encounter_A:
  Phase16で通ったAを回帰保護する。

self_confidence_uncertainty_B:
  自信をつけたい気持ち、不安、直したい/試している動きを見る。
  中途半端を人格事実化しない。

positive_change_after_work_streaming:
  仕事後の疲れ、誰かと話したい変化、嬉しさと動揺の同居を見る。
  achievement / 同じ流れ などの内部語・骨組みを出さない。

self_blame_to_gentle_self_observation:
  自己責めから少し優しく見ようとする方向を見る。
  perfection fear / positive state などの内部role語を出さない。

independence_life_health_money_pace:
  自立、生活、体調、お金、続けられるペースを扱う。
  自立できます / お金が原因です / もっと頑張りましょう へ寄せない。
```

### 16.5 この追補で変えないこと

```text
- /emotion/submit routeは変えない。
- input_feedback.comment_text以外のpublic split keyを追加しない。
- observation_status public enumを増やさない。
- RN production UIを二カード化しない。
- RN表示タイトル Emlisの観測 を変えない。
- RN表示条件 passed + commentText を緩めない。
- DB physical name / write pathを変えない。
- 外部AI / local LLMを前提にしない。
- Gate / Groundingを緩めない。
- fixture本文や設計書内の例文をPython固定本文・完成返答テンプレにしない。
```

### 16.6 作業時の読み替え

`product_visible_fixture_evaluation`、`product_visible_surface_policy`、`two_stage_mode_section_budget`、`phase17_6_grounding_relation_binding`、`phase17_7_self_repair_unavailable_reason` は、すべてbackend内部test / diagnostic / policy summaryである。public responseとしてユーザーへ返す本文は、あくまで既存 `input_feedback.comment_text` だけである。


---

## 17. 2026-05-30 追補: EmlisAI Product Quality Stabilization Phase18 実装反映

Phase18では、本資料で定義した状態回答・人間的フォロー・二段受け取りの思想を、商品品質前の広範回帰へ耐える形に安定化した。これは状態回答思想を変更するものではなく、`input_feedback.comment_text` / `Emlisの観測` / `passed + commentText` の既存契約を守るためのbackend内部補強である。

### 17.1 Phase18で追加された内部境界

| 境界 | 読み方 |
|---|---|
| TwoStage applicability | 状態回答・二段受け取りが必要なcandidateだけをrequired扱いし、低情報repairやlegacy pathをlabel missingで巻き込まない。 |
| Complete Initial candidate path | 候補生成の存在とpublic表示可否を分け、非passed時のcomment_text空契約を維持する。 |
| Low-information public repair | 見えている情報が少ない入力でも、突き放さず、短く安全な観測と質問へ戻す。ただし安全・scope・AP0等はpassed化しない。 |
| daily_unpleasant mode context | `daily_unpleasant_reception` をratio / mode contextで渡し、別modeの努力・自立・生活ペース文へ混線させない。 |
| meta-only sanitizer | 状態回答surface contract内部の `surface_policy` や辞書本文をpayloadへ出さず、summary flagsだけを残す。 |
| diagnostic taxonomy | 表示不可理由をreason codeとして整理し、本文やcandidate textをmetaへ出さない。 |
| visible readability QA | 反復・便利語・内部role語・relation skeletonを検出し、読感品質をtest / gate summaryで守る。 |

### 17.2 この追補で変えないこと

```text
- 状態回答と人間的フォローの基本思想は変えない。
- 二段表示は既存 input_feedback.comment_text 本文内に残す。
- observation_text / reception_text public keyは追加しない。
- RNは二段本文をparseしない。
- public metaへraw input / memo / memo_action / evidence text / comment_text body / surface_policy本体を出さない。
- Gate / Grounding / Reader / Templateを緩めない。
- 完成返答テンプレやcase_id固定文をruntimeへ追加しない。
```

### 17.3 作業時の読み替え

`product_quality_regression_matrix`、`two_stage_applicability_decision`、`low_information_public_repair_contract`、`two_stage_mode_context`、`meta_only_sanitizer`、`diagnostic_failure_taxonomy`、`visible_readability_quality` は、状態回答・二段受け取りをpublic表示へ安全に出すための内部contract名として読む。EmlisAIのvisible名、public status、RN表示条件、DB/API名に変換しない。
---

## 18. 2026-06-01 追補: EmlisAI Phase20撤回保持再設計 実装反映

Phase20では、本資料で定義した状態回答・人間的フォローの思想を、Phase19の個別routeではなく汎用観測返答として成立させる方向へ戻した。これは状態回答思想を変更するものではなく、自己否定を事実化しない、低情報を無応答にしない、Gate failureを沈黙で終わらせない、C/D専用完成surfaceへ逃げないためのbackend内部補強である。

### 18.1 Phase20で追加された内部境界

| 境界 | 読み方 |
|---|---|
| Internal Response Contract | 状態回答を `passed / rejected / unavailable` だけでなく、`normal_observation`、`low_information_observation`、`limited_grounding_observation`、`self_denial_safe_state_answer` などで読む。 |
| Safety Triage | 自己否定安全応答と緊急安全境界を分け、自己否定内容を本人の人格事実として扱わない。 |
| Input Material Bundle | 思考・行動・感情・カテゴリの入力束から、見えている材料と見えていないslotを分ける。 |
| Low Information Observation | 詳細が少ない入力でも、わかったふりをせず、見えている範囲とユーザー主導の追加促しを返す。 |
| Gate Recovery Loop | 表示文がGateで落ちた時、短縮・限定・断定弱化・低情報/安全応答へ回す。 |
| Generic SentencePlan / Surface | C/D専用mode別完成文ではなく、relation / material / tone / boundaryからsurfaceを作る。 |
| Public Boundary / RN Contract | 状態回答の内部contractをpublic表示sourceにせず、既存 `input_feedback.comment_text` にだけ出す。 |
| QA Matrix / 実機再確認 | exact本文一致ではなく、family品質、fatal条件、A低情報表示、B自己否定安全応答、C/D専用route撤回を確認する。 |

### 18.2 この追補で変えないこと

```text
- 状態回答と人間的フォローの基本思想は変えない。
- self_denialを本人の事実として確定しない。
- safety emergencyをEmlis通常観測としてpassed化しない。
- observation_text / reception_text public keyは追加しない。
- RNはresponse_kindやdiagnostic_summaryを表示sourceにしない。
- public metaへraw input / memo / memo_action / evidence text / comment_text body / internal contract bodyを出さない。
- Gate / Grounding / Reader / Templateを緩めない。
- 完成返答テンプレやcase_id固定文をruntimeへ追加しない。
```

### 18.3 作業時の読み替え

`response_kind`、`safety_triage_kind`、`material_quality`、`visible_material_slots`、`unknown_slots`、`gate_recovery_loop`、`generic_sentence_plan_surface`、`response_contract_qa_matrix` は、状態回答・人間的フォローをpublic表示へ安全に出すための内部contract名として読む。EmlisAIのvisible名、public status、RN表示条件、DB/API名に変換しない。

### 18.4 Phase20-12〜20-15表示信頼性補強の読み方

Phase20-12〜20-15は、状態回答思想を変更するものではない。通常入力に対して観測を返す方針を、final pre-return gate後の空白戻りとGate Recovery surfaceのfixed fallback化から守るためのbackend内部補強である。

| 追加境界 | 読み方 |
|---|---|
| 旧fail-closed説明修正 | Gateは緩めないが、displayable response kindではbounded repair / recoveryを通す説明へ更新された。 |
| post-final gate recovery | final pre-return gate後にnormal / low_information / limited_groundingが落ちても、safety / infraでない限り空白終了へ戻さず一回だけ回復を試す。 |
| safety / infra保持 | safety_blocked_emergency / infrastructure_error / safety_support_requiredは通常Emlis観測としてpassed化しない。 |
| Gate Recovery surface binding | Gate Recovery surfaceがmaterial slots / relation family / unknown slotsに接続していることを本文なしで示す。 |
| surface repetition QA | fixed fallback化を、exact本文一致ではなくsurface family / closing family反復で検出する。 |

`phase20_13_post_final_gate_recovery`、`phase20_15_gate_recovery_surface_binding`、`gate_recovery_surface_repetition_qa` は内部meta / QA名であり、状態回答のpublic response key、RN表示条件、DB/API名ではない。

---

## 19. 2026-06-03 追補: Product Read Feel v1 / Structure Insight v2 実装反映

Phase1〜11では、本資料で定義した状態回答・人間的フォローの思想を、商品読感評価と構造気づき候補へ接続した。これは状態回答思想を変更するものではなく、入力固有の状態構造・感情温度・重要箇所へのフォローが、雑に処理されていないかを評価し、構造が見える入力では安全な気づき候補を内部materialとして扱うためのbackend内部補強である。

### 19.1 追加された内部境界

| 境界 | 読み方 |
|---|---|
| Product Read Feel current output inventory | 現在の二段本文をfamily別に棚卸しし、表示不達・契約違反・surface破綻・読感不足・構造気づき不足へ分ける。 |
| Product Read Feel rubric | `read_feeling`、`self_report_retention`、`state_structure_retention`、`emotion_temperature_retention`、`follow_depth`、`evidence_boundary`、`soft_inference_surface`、`insight_delta` を評価軸として固定する。 |
| Fixture family | 正解文ではなく、期待mode・禁止surface・ratio・v2 insight opportunityを持つfamily metaとして扱う。 |
| Mirror-only detector | 入力材料が十分あるのに要約・復唱・共感だけで終わるsurfaceを検出する。 |
| Structure Insight candidate | 入力材料同士の関係候補を、表示文ではなく内部materialとして持つ。 |
| Structure Insight Gate | 診断・人格断定・原因断定・相手評価同意・unsafe insight・soft expression不足をsurface化前に止める。 |
| Limited-family Structure Insight surface | 構造理解が求められるfamilyだけにinsight seedを接続し、daily / low-informationへ深い構造気づきを無理に足さない。 |
| Long-run Product Gate candidate | v1 Product Read Feel成立候補とv2 Structure Insight readinessを分け、release判断は別工程に残す。 |

### 19.2 この追補で変えないこと

```text
- 状態回答と人間的フォローの基本思想は変えない。
- `input_feedback.comment_text` が唯一のpublic visible bodyである。
- `Emlisの観測` のRN表示タイトルと表示条件は変えない。
- `PRODUCT_PASS` / `STRUCTURE_INSIGHT_READY` はpublic observation_statusではない。
- `read_feeling` をmachine metricsで自動補完しない。
- 構造気づきを診断・人格分類・原因断定・相手評価同意・行動指示にしない。
- raw input / memo / memo_action / evidence text / comment_text body / candidate bodyをpublic metaへ出さない。
- 完成返答テンプレやcase_id固定文をruntimeへ追加しない。
```

### 19.3 作業時の読み替え

`product_readfeel_current_output_inventory`、`product_readfeel_rubric`、`product_readfeel_scorecard`、`mirror_only_surface_detector`、`structure_insight_candidate`、`structure_insight_gate`、`structure_insight_surface`、`product_readfeel_long_run_product_gate` は、状態回答・人間的フォローを商品読感と構造気づき候補として評価するための内部contract名として読む。EmlisAIのvisible名、public status、RN表示条件、DB/API名に変換しない。


---

## 20. 2026-06-06 追補: Normal Observation Public Recovery P0-P9 実装反映

P0〜P9では、本資料で定義した状態回答・人間的フォローの思想を、通常・高情報量入力のsurface failure後にも守るため、`normal_observation_rebuild_candidate` がbackend内部へ追加された。これは状態回答思想を変更するものではなく、入力材料が十分あるにもかかわらず表面文法・関係骨格・visible surface品質だけを理由に沈黙する状態を避けるための補強である。

### 20.1 追加された内部境界

| 境界 | 読み方 |
|---|---|
| normal_observation_rebuild_candidate | AI生成済み通常候補が表面品質で落ちた場合にだけ、公開用の短い状態回答 + 人間的フォローへ再表面化するcandidate source。 |
| normal rebuild eligibility | original candidateがai_generatedで存在し、low_information / limited_grounding / safety / infra / source unavailableでない時だけ試す。 |
| surface plan / precheck | relation skeleton marker、Gate Recovery material fragment、診断・原因・人格・処方claimを避け、既存Gate前に明白な破綻を落とす。 |
| existing Gate再評価 | rebuild候補もRuntime / Visible / Display Gateを通る。Gate緩和ではない。 |
| body-free diagnostics | attempted / applied / source kindだけをmetaへ出し、raw input / candidate body / comment_text bodyを保存しない。 |

### 20.2 この追補で変えないこと

```text
- 状態回答と人間的フォローの基本思想は変えない。
- `input_feedback.comment_text` が唯一のpublic visible bodyである。
- `Emlisの観測` のRN表示タイトルと表示条件は変えない。
- Gate Recovery material surfaceをpublic本文にしない。
- Surface / Runtime / Visible / Display / Grounding / Template / Safety Gateを緩めない。
- composer disabled / safety / infraを通常観測へ偽装しない。
- 完成返答テンプレやcase_id固定文をruntimeへ追加しない。
```

### 20.3 作業時の読み替え

`normal_observation_rebuild_candidate`、`normal_observation_rebuild_attempted`、`normal_observation_rebuild_applied`、`surface_origin_normal_observation_rebuild_*` は、状態回答・人間的フォローをpublic表示へ安全に戻すための内部contract名として読む。EmlisAIのvisible名、public status、RN表示条件、DB/API名に変換しない。


## 21. 2026-06-06 追補: Public Observation Recovery P0-P10 実装反映

P0〜P10では、本資料で定義した状態回答・人間的フォローの思想を、public feedback不達と二段本文shape崩れの両方に対して守るため、Public Observation Recoveryがbackend内部へ追加された。

### 21.1 追加された内部境界

| 境界 | 読み方 |
|---|---|
| public surface requirement | 入力familyがplain状態回答でよいのか、二段本文が必要なのか、低情報観測か、安全/infraで閉じるのかを本文なしで決める。 |
| product surface validation | RNで表示できることと、状態回答・人間的フォローとして成立していることを分ける。 |
| complete initial surface recomposition | 元候補がないC系source unavailableをnormal rebuildへ偽装せず、material sufficient / safe の場合だけ状態回答candidateへ戻す。 |
| labelled two-stage recomposition | two_stage_requiredでは「見えたこと：」と「Emlisから：」の二段shapeを守る。 |
| public_surface_lineage | normal rebuild / complete initial recomposition / labelled two-stage recompositionをbody-freeに区別する。 |

### 21.2 この追補で変えないこと

```text
- 状態回答と人間的フォローの基本思想は変えない。
- `input_feedback.comment_text` が唯一のpublic visible bodyである。
- `Emlisの観測` のRN表示タイトルと表示条件は変えない。
- Gate Recovery material surfaceをpublic本文にしない。
- Surface / Runtime / Visible / Display / Grounding / Template / Safety Gateを緩めない。
- source unavailableをnormal observation rebuildへ広げない。
- two_stage_requiredをplain surfaceで成功扱いしない。
- 完成返答テンプレやcase_id固定文をruntimeへ追加しない。
```

### 21.3 作業時の読み替え

`complete_initial_surface_recomposition_candidate`、`labelled_two_stage_surface_recomposition_candidate`、`product_surface_valid`、`public_surface_lineage` は、状態回答・人間的フォローをCocolonの商品surfaceとして守るための内部contract名として読む。EmlisAIのvisible名、public status、RN表示条件、DB/API名に変換しない。
