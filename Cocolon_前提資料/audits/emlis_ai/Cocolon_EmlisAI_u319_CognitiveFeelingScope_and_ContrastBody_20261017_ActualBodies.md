# u319：未加工本文・入力・保存表示の確認原物（2026-10-17）

公開合成入力のみ。既存MeaningExperienceEngine.generate / EMLIS_APPLICATION / Q3_FREE。生成本文の手編集・代替作者・外部生成AIなし。基準API 9d62ab2。本文提供数は商品合格数ではない。

## 最終source SHA-256

| Path | SHA-256 |
|---|---|
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | `d4c6be787c3743444ee9129214a81530fcdac2adc0428d3112db59015ea2fbfa` |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | `649c2e7f4d379137af80d22e8234b8c794677a06713ae590f0c1bb915b731a38` |
| `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | `dd0916b4b63b06de76985a194d15dc220942b8259abaa9c91ad95358420ad66d` |
| `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | `e6b12470b26be89aeb0f79f2037e886504f588e966c7cba4e6194659401389cb` |
| `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py` | `34763abab5dbfb10b50254a3b48fe0da2157264a7a5c5aeccba708b9cfcb5604` |
| `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | `68caab634c9c3d286713b318b704c22c9a74bf51ddb0444e32c4a1db939a7d84` |
| `ai/tests/test_cmee_emlis_source_scope_regressions.py` | `27d3b087c75caf2ff10a0101e1253ff6a89514238c58cb9b62fb7930d4ca71bc` |

language identity `309764e13b9f26b9d02a14291020fa25e4e8d417b2509c5dc58484b7064d86f9`、runtime identity `9f5e5259fe29fa454e275f57280e86403c077322c0fcab43375393f4f026d157`。

## 元10例

入力SHA-256 `be05dd099acb6fcd20c1d312376a0ee1e79dfbbf9b4d4d0b39b0c8182585a567`、source日時 `2026-10-17T09:16:32+00:00`。

### 01

入力：
```json
{
  "id": "emlis-demo-input-01",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "今日は久しぶりに友達と会えて嬉しかった。気を遣わずに話せて、帰り道も気持ちが軽かった。",
  "memo_action": "",
  "category": [
    "生活"
  ],
  "emotions": [
    "自己理解"
  ],
  "emotion_details": [
    {
      "type": "自己理解",
      "strength": "medium"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「今日は久しぶりに友達と会えて嬉しかった」と「気を遣わずに話せて、帰り道も気持ちが軽かった」が、今感じている変化としてつながっています。

Emlisから：
その反応を背景に、今ここに置かれた言葉を小さくせずに受け止めています。
```

質問：なし
question disposition：END

### 02

入力：
```json
{
  "id": "emlis-demo-input-02",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "一週間かけて作った資料を上司に見せたら、ありがとうと言われた。でも会議では使われなくて、自分の頑張りには意味がなかった気がした。",
  "memo_action": "",
  "category": [
    "生活"
  ],
  "emotions": [
    "自己理解"
  ],
  "emotion_details": [
    {
      "type": "自己理解",
      "strength": "medium"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「一週間かけて作った資料を上司に見せたら、ありがとうと言われた」という行動と「会議では使われなくて、自分の頑張りには意味がなかった気がした」が、異なる向きのまま同時にあります。

Emlisから：
一週間かけて作った資料を上司に見せたら、ありがとうと言われたことと会議では使われなくて、自分の頑張りには意味がなかった気がしたこととの違いに目が留まり、それをどちらの側も残したまま、大切に思っています。
```

質問：なし
question disposition：END

### 03

入力：
```json
{
  "id": "emlis-demo-input-03",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。",
  "memo_action": "",
  "category": [
    "生活"
  ],
  "emotions": [
    "自己理解"
  ],
  "emotion_details": [
    {
      "type": "自己理解",
      "strength": "medium"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。

Emlisから：
友達からの誘いを断って、一人で休めたことにほっとしたという気持ちともう誘ってもらえなくなるかもしれないと思うと寂しいこととの違いをどちらの側も残したまま、感じています。
```

質問：なし
question disposition：END

### 04

入力：
```json
{
  "id": "emlis-demo-input-04",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "なんだかしんどい。何が嫌なのか、自分でもよくわからない。",
  "memo_action": "",
  "category": [
    "生活"
  ],
  "emotions": [
    "自己理解"
  ],
  "emotion_details": [
    {
      "type": "自己理解",
      "strength": "medium"
    }
  ],
  "is_secret": false
}
```

initial: status=LIMITED, body_state=FINAL, sufficiency=LIMITED。

```text
見えたこと：
今は、「なんだかしんどい」という感覚や状態が前に出ています。
今回の中心には、「何が嫌なのか、自分でもよくわからない」があります。

Emlisから：
その反応を背景に、今ここに置かれた言葉を小さくせずに受け止めています。
```

質問：なし
question disposition：END

### 05

入力：
```json
{
  "id": "emlis-demo-input-05",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "探しやすくなったので、資料を分類したことに満足した。",
  "memo_action": "",
  "category": [
    "生活"
  ],
  "emotions": [
    "自己理解"
  ],
  "emotion_details": [
    {
      "type": "自己理解",
      "strength": "medium"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「探しやすくなった」を理由に、「資料を分類した」という出来事への評価は「満足した」とあります。

Emlisから：
資料を分類したことには、探しやすくなったという点で、当時ご自身の中に満たされた感覚があったのですね。
```

質問：なし
question disposition：END

### 06

入力：
```json
{
  "id": "emlis-demo-input-06",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "結論は出ていないが、考えを言葉にできて満足した。",
  "memo_action": "",
  "category": [
    "生活"
  ],
  "emotions": [
    "自己理解"
  ],
  "emotion_details": [
    {
      "type": "自己理解",
      "strength": "medium"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「結論は出ていない」の一方で「満足した」とあります。 「考えを言葉にできて」という出来事に対する評価は、「満足した」とあります。

Emlisから：
結論は出ていないという点と切り分けて、当時の満足を、考えを言葉にできたことに向けられた充足として受け取りました。
```

質問：なし
question disposition：END

### 07

入力：
```json
{
  "id": "emlis-demo-input-07",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "誘われたのに、悲しかったです。探しやすくなったので、資料を分類したことに満足した。",
  "memo_action": "",
  "category": [
    "生活"
  ],
  "emotions": [
    "自己理解"
  ],
  "emotion_details": [
    {
      "type": "自己理解",
      "strength": "medium"
    }
  ],
  "is_secret": false
}
```

initial: status=QUESTION_PENDING, body_state=PRE_QUESTION, sufficiency=SUFFICIENT。

```text
見えたこと：
「誘われた」の一方で「悲しかったです」とあります。
「探しやすくなった」を理由に、「資料を分類した」という出来事への評価は「満足した」とあります。

Emlisから：
資料を分類したことには、探しやすくなったという点で、当時ご自身の中に満たされた感覚があったのですね。誘われたことは、あなたにとって悲しさを伴う経験だったのですね。
```

質問：「誘われた」は、あなたにはどんな意味として届きましたか。
question disposition：ASK

回答：今は嬉しい。

after_answer: status=GENERATED, body_state=REFINED, sufficiency=SUFFICIENT。

```text
見えたこと：
「誘われた」のに「悲しかったです」、回答した時点では「嬉しい」とあります。
「探しやすくなった」を理由に、「資料を分類した」という出来事への評価は「満足した」とあります。

Emlisから：
資料を分類したことには、探しやすくなったという点で、当時ご自身の中に満たされた感覚があったのですね。誘われたのに、悲しかったのですね。回答した時点では嬉しいのですね。
```

質問：なし
question disposition：END

### 08

入力：
```json
{
  "id": "emlis-demo-input-08",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "資料を種類ごとに分けたら、必要なものをすぐ見つけられるようになった。やってよかったし、けっこう満たされた気分。",
  "memo_action": "",
  "category": [
    "生活"
  ],
  "emotions": [
    "自己理解"
  ],
  "emotion_details": [
    {
      "type": "自己理解",
      "strength": "medium"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「資料を種類ごとに分けた」という行動から「必要なものをすぐ見つけられるようになった」へつながっています。
今回の中心には、「やってよかったし、けっこう満たされた気分」があります。

Emlisから：
資料を種類ごとに分けたことが支えている、必要なものをすぐ見つけられるようになったという変化に目が留まり、それをどちらの側も残したまま、大切に思っています。
```

質問：なし
question disposition：END

### 09

入力：
```json
{
  "id": "emlis-demo-input-09",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "前は失敗すると何日も引きずっていたけど、今日は少し落ち込んだあと、次に試すことを考えられた。自分でもちょっと驚いている。",
  "memo_action": "",
  "category": [
    "生活"
  ],
  "emotions": [
    "自己理解"
  ],
  "emotion_details": [
    {
      "type": "自己理解",
      "strength": "medium"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今回の中心には、「今日は少し落ち込んだあと、次に試すことを考えられた」があります。
今は、「自分でもちょっと驚いている」と自分を見ている状態です。

Emlisから：
今ここに置かれた言葉を小さくせずに受け止めています。
```

質問：なし
question disposition：END

### 10

入力：
```json
{
  "id": "emlis-demo-input-10",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "友達は転職が決まって嬉しいと言っていた。私は応援したいけど、離れてしまうのは寂しい。",
  "memo_action": "",
  "category": [
    "生活"
  ],
  "emotions": [
    "自己理解"
  ],
  "emotion_details": [
    {
      "type": "自己理解",
      "strength": "medium"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「友達は転職が決まって嬉しいと言っていた」という感覚や状態が前に出ています。
「私は応援したい」という願いと、「離れてしまうのは寂しい」という制約が並んでいます。

Emlisから：
その願いを背景に、その気持ちに目が留まり、それを受け止めています。私は応援したいという願いと離れてしまうのは寂しいことを、その重なりも含めて見失わずに、大切に受け止めています。
```

質問：なし
question disposition：END

## 固定100例

入力SHA-256 `013dd2ad1c1f446f843f400b3eb16231e8f32649e30114e70039b4cb709e8414`、source日時 `2026-10-17T09:16:32+00:00`。

### nls3s_b001_0001

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0001",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "なんとなく、落ち着かない。",
  "memo_action": "",
  "category": [
    "生活"
  ],
  "emotions": [
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「なんとなく、落ち着かない」という感覚が前に出ています。

Emlisから：
なんとなくの落ち着かなさを小さくせずに受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0002

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0002",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "",
  "memo_action": "今日は少し早めに休む。",
  "category": [
    "健康"
  ],
  "emotions": [
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今の入力には、「今日は少し早めに休む」という、これからの行動があります。

Emlisから：
これからの行動に目が留まり、それを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0003

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0003",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "まあ、悪くないかも。",
  "memo_action": "窓を少し開けた。",
  "category": [
    "生活"
  ],
  "emotions": [
    "喜び",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "喜び"
    },
    {
      "strength": "medium",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0004

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0004",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "まだよく分からない。",
  "memo_action": "",
  "category": [
    "価値観"
  ],
  "emotions": [
    "自己理解"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "自己理解"
    }
  ],
  "is_secret": false
}
```

initial: status=LIMITED, body_state=FINAL, sufficiency=LIMITED。

```text
見えたこと：
まだよく分からないのですね。

Emlisから：
結論を急がずに、まだよく分からないことを小さくせずに受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0005

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0005",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "",
  "memo_action": "机の上を片づけた。",
  "category": [
    "生活"
  ],
  "emotions": [
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今の入力には、「机の上を片づけた」という行動があります。

Emlisから：
机の上を片づけたことを見過ごさず、大切に受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0006

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0006",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "あの件が少し気になる。",
  "memo_action": "",
  "category": [
    "仕事"
  ],
  "emotions": [
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今回の中心には、「あの件が少し気になる」があります。

Emlisから：
少し気になるあの件を小さくせずに受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0007

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0007",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "たぶん疲れている。",
  "memo_action": "帰ってから何もしなかった。",
  "category": [
    "生活",
    "健康"
  ],
  "emotions": [
    "悲しみ",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "悲しみ"
    },
    {
      "strength": "medium",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0008

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0008",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "",
  "memo_action": "とりあえずメモだけ残した。",
  "category": [
    "学習"
  ],
  "emotions": [
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今の入力には、「とりあえずメモだけ残した」という行動があります。

Emlisから：
とりあえずメモだけ残したことを見過ごさず、大切に受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0009

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0009",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "朝から予定がずれて、ずっと気持ちがせわしない。",
  "memo_action": "",
  "category": [
    "生活"
  ],
  "emotions": [
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「朝から予定がずれて、ずっと気持ちがせわしない」という感覚が前に出ています。

Emlisから：
朝から予定がずれて、ずっと気持ちがせわしないという言葉を小さくせずに受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0010

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0010",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "楽しみにしていた配信を見逃して、がっかりした。",
  "memo_action": "あとで見られるか確認した。",
  "category": [
    "趣味"
  ],
  "emotions": [
    "悲しみ"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "悲しみ"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「楽しみにしていた配信を見逃して、がっかりした」という感覚や状態が前に出ています。
今の入力には、「あとで見られるか確認した」という行動があります。

Emlisから：
楽しみにしていた配信を見逃して、がっかりしたことを小さくせずに受け止めています。あとで見られるか確認したことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0011

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0011",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "説明を途中で遮られて、悔しさと怒りが残っている。",
  "memo_action": "その場では言い返さずに終えた。",
  "category": [
    "仕事",
    "人間関係"
  ],
  "emotions": [
    "悲しみ",
    "怒り"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "悲しみ"
    },
    {
      "strength": "strong",
      "type": "怒り"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「説明を途中で遮られて、悔しさと怒りが残っている」という感覚や状態が前に出ています。
今の入力には、「その場では言い返さずに終えた」という行動があります。

Emlisから：
説明を途中で遮られて、悔しさと怒りが残っていることを小さくせずに受け止めています。その場では言い返さずに終えたことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0012

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0012",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "雨で洗濯物を取り込むのが遅れてしまい、少しへこんだ。",
  "memo_action": "濡れたものを干し直した。",
  "category": [
    "生活"
  ],
  "emotions": [
    "悲しみ"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "悲しみ"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今回の中心には、「雨で洗濯物を取り込むのが遅れてしまい、少しへこんだ」があります。
今の入力には、「濡れたものを干し直した」という行動があります。

Emlisから：
雨で洗濯物を取り込むのが遅れてしまい、少しへこんだという言葉を小さくせずに受け止めています。濡れたものを干し直したことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0013

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0013",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "返信が来ないだけなのに、嫌われたのかもって考えちゃう。",
  "memo_action": "追いかけて送るのはやめて、今日は待つことにした。",
  "category": [
    "人間関係"
  ],
  "emotions": [
    "悲しみ",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "悲しみ"
    },
    {
      "strength": "strong",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「返信が来ないだけなのに、嫌われたのかもって考えちゃう」という感覚が前に出ています。
今の入力には、「追いかけて送るのはやめて、今日は待つことにした」という、これからの行動があります。

Emlisから：
返信が来ないだけなのに、嫌われたのかもって考えちゃうという言葉を小さくせずに受け止めています。追いかけて送るのはやめて、今日は待つことにしたというこれからの行動を大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0014

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0014",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "頑張って読んだのに内容が頭に入らなくて、焦っている。",
  "memo_action": "いったん本を閉じて水を飲んだ。",
  "category": [
    "健康",
    "学習"
  ],
  "emotions": [
    "悲しみ",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "悲しみ"
    },
    {
      "strength": "strong",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「頑張って読んだのに内容が頭に入らなくて、焦っている」という感覚や状態が前に出ています。
今の入力には、「いったん本を閉じて水を飲んだ」という行動があります。

Emlisから：
頑張って読んだのに内容が頭に入らなくて、焦っていることを小さくせずに受け止めています。いったん本を閉じて水を飲んだことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0015

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0015",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "朝の光が部屋に入ってきて、今日は気分が軽い。",
  "memo_action": "",
  "category": [
    "生活"
  ],
  "emotions": [
    "喜び",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "喜び"
    },
    {
      "strength": "medium",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「朝の光が部屋に入ってきて、今日は気分が軽い」という感覚や状態が前に出ています。

Emlisから：
朝の光が部屋に入ってきて、今日は気分が軽いという気持ちを受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0016

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0016",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "昨日より少しだけ作業が進んで、ほっとした。",
  "memo_action": "次にやる箇所へ付箋を貼った。",
  "category": [
    "仕事"
  ],
  "emotions": [
    "喜び",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "喜び"
    },
    {
      "strength": "strong",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今回の中心には、「昨日より少しだけ作業が進んで、ほっとした」があります。
今の入力には、「次にやる箇所へ付箋を貼った」という行動があります。

Emlisから：
昨日より少しだけ作業が進んで、ほっとしたという言葉を小さくせずに受け止めています。次にやる箇所へ付箋を貼ったことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0017

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0017",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "久しぶりに描く時間を取れて、夢中になれた。",
  "memo_action": "途中の絵を机に出したままにした。",
  "category": [
    "趣味"
  ],
  "emotions": [
    "喜び"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "喜び"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今回の中心には、「久しぶりに描く時間を取れて、夢中になれた」があります。
今の入力には、「途中の絵を机に出したままにした」という行動があります。

Emlisから：
久しぶりに描く時間を取れて、夢中になれたという言葉を小さくせずに受け止めています。途中の絵を机に出したままにしたことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0018

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0018",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "話してみたら、思っていたより穏やかに聞いてもらえた。",
  "memo_action": "帰ってからお礼を短く送った。",
  "category": [
    "人間関係"
  ],
  "emotions": [
    "喜び",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "喜び"
    },
    {
      "strength": "medium",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今回の中心には、「話してみたら、思っていたより穏やかに聞いてもらえた」があります。
今の入力には、「帰ってからお礼を短く送った」という行動があります。

Emlisから：
話してみたら、思っていたより穏やかに聞いてもらえたという言葉を小さくせずに受け止めています。帰ってからお礼を短く送ったことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0019

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0019",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "新しいやり方の方が、自分には覚えやすそうだ。",
  "memo_action": "例題を一つだけ試してみた。",
  "category": [
    "学習"
  ],
  "emotions": [
    "喜び",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "喜び"
    },
    {
      "strength": "weak",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0020

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0020",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "夕方に少し歩いたら、頭の切り替えができた感じ。",
  "memo_action": "帰宅して温かい飲み物をいれた。",
  "category": [
    "生活",
    "健康"
  ],
  "emotions": [
    "喜び",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "喜び"
    },
    {
      "strength": "strong",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「夕方に少し歩いたら、頭の切り替えができた感じ」という感覚や状態が前に出ています。
今の入力には、「帰宅して温かい飲み物をいれた」という行動があります。

Emlisから：
夕方に少し歩いたら、頭の切り替えができた感じという変化を見過ごさず、受け止めています。帰宅して温かい飲み物をいれたことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0021

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0021",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "決められないまま時間だけ過ぎた。やっぱり私は、何を選んでも間違える人なのかもしれない。",
  "memo_action": "",
  "category": [
    "価値観"
  ],
  "emotions": [
    "自己理解"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "自己理解"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0022

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0022",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "こんな簡単なことも続かない自分が情けない。",
  "memo_action": "それでも今日は五分だけ練習した。",
  "category": [
    "趣味",
    "学習"
  ],
  "emotions": [
    "悲しみ"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "悲しみ"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「こんな簡単なことも続かない自分が情けない」という自分への見方が書かれています。
今の入力には、「今日は五分だけ練習した」という行動があります。

Emlisから：
こんな簡単なことも続かない自分が情けないという言葉を小さくせずに受け止めています。それでも今日は五分だけ練習したことを見過ごさず、大切に受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0023

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0023",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "仕事では周りが先へ進んで見える。これから何を大事にしたいのかも決められず、自分だけ止まっている気がする。",
  "memo_action": "帰宅して鞄を床に置いたまま、しばらく玄関に座っていた。",
  "category": [
    "仕事",
    "価値観",
    "人生"
  ],
  "emotions": [
    "悲しみ",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "悲しみ"
    },
    {
      "strength": "medium",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0024

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0024",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "断ったくらいで冷たい人だと思われそう。",
  "memo_action": "今週は余裕がないと伝えて誘いを断った。",
  "category": [
    "人間関係",
    "価値観"
  ],
  "emotions": [
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今回の中心には、「断ったくらいで冷たい人だと思われそう」があります。
今の入力には、「今週は余裕がないと伝えて誘いを断った」という行動があります。

Emlisから：
今週は余裕がないと伝えて誘いを断ったことを見過ごさず、大切に受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0025

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0025",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "ミスを一つ見つけただけで、全部だめにしたような気分になる。",
  "memo_action": "影響する箇所を確認して、直せる部分を修正した。",
  "category": [
    "仕事"
  ],
  "emotions": [
    "悲しみ",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "悲しみ"
    },
    {
      "strength": "medium",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「ミスを一つ見つけただけで、全部だめにしたような気分になる」という感覚や状態が前に出ています。
今の入力には、「影響する箇所を確認して、直せる部分を修正した」という行動があります。

Emlisから：
ミスを一つ見つけただけで、全部だめにしたような気分になるという言葉を小さくせずに受け止めています。影響する箇所を確認して、直せる部分を修正したことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0026

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0026",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "分かんないって言えないんだよね。頼ったら『できない人』って思われそうで、結局まだ聞けてない。",
  "memo_action": "",
  "category": [
    "仕事",
    "学習",
    "価値観"
  ],
  "emotions": [
    "怒り",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "怒り"
    },
    {
      "strength": "strong",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「分かんないって言えないんだよね」と「頼ったら『できない人』って思われそうで、結局まだ聞けてない」が重なり、今は一つの状態として前に出ています。

Emlisから：
その制約を背景に、今ここに置かれた言葉を小さくせずに受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0027

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0027",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "やりたいと言ったのに迷うなんて、覚悟が足りないのかな。",
  "memo_action": "決める前に条件をもう一度読み直すことにした。",
  "category": [
    "仕事",
    "価値観",
    "人生"
  ],
  "emotions": [
    "自己理解"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "自己理解"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0028

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0028",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "急に予定を変えられて、こちらの都合は見えていないのかと腹が立った。",
  "memo_action": "今日は対応できないと伝えた。",
  "category": [
    "仕事",
    "人間関係"
  ],
  "emotions": [
    "怒り"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "怒り"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「急に予定を変えられて、こちらの都合は見えていないのかと腹が立った」という感覚や状態が前に出ています。
今の入力には、「今日は対応できないと伝えた」という行動があります。

Emlisから：
急に予定を変えられて、こちらの都合は見えていないのかと腹が立ったことを小さくせずに受け止めています。今日は対応できないと伝えたことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0029

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0029",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "冗談みたいに扱われたのが、まだ引っかかってる。",
  "memo_action": "次に同じことがあったら笑わずに止めたい。",
  "category": [
    "人間関係"
  ],
  "emotions": [
    "悲しみ",
    "怒り"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "悲しみ"
    },
    {
      "strength": "strong",
      "type": "怒り"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「冗談みたいに扱われたのが、まだ引っかかってる」という感覚や状態が前に出ています。
「次に同じことがあったら笑わずに止めたい」という行動に移しています。

Emlisから：
次に同じことがあったら笑わずに止めたいという願いを見失わず、大切に受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0030

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0030",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "手伝うのが当然みたいに話が進むと、置いていかれた気持ちになる。",
  "memo_action": "何を引き受けるかは自分で決めたいと話した。",
  "category": [
    "生活",
    "人間関係",
    "価値観"
  ],
  "emotions": [
    "悲しみ",
    "怒り"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "悲しみ"
    },
    {
      "strength": "medium",
      "type": "怒り"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「手伝うのが当然みたいに話が進むと、置いていかれた気持ちになる」という感覚や状態が前に出ています。
今の入力には、「何を引き受けるかは自分で決めたいと話した」という行動があります。

Emlisから：
何を引き受けるかは自分で決めたいと話したことを見過ごさず、大切に受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0031

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0031",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "何度も同じ説明を求められて、もう疲れたし苛立っている。",
  "memo_action": "続きは明日にしたいと区切った。",
  "category": [
    "仕事"
  ],
  "emotions": [
    "怒り",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "怒り"
    },
    {
      "strength": "weak",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「何度も同じ説明を求められて、もう疲れたし苛立っている」という感覚や状態が前に出ています。
今の入力には、「続きは明日にしたいと区切った」という行動があります。

Emlisから：
何度も同じ説明を求められて、もう疲れたし苛立っているという言葉を小さくせずに受け止めています。続きは明日にしたいと区切ったことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0032

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0032",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "言い方が強かったかもしれない。でも黙って受け入れるのも違う。",
  "memo_action": "落ち着いてから要点だけ伝え直した。",
  "category": [
    "人間関係",
    "価値観"
  ],
  "emotions": [
    "怒り",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "怒り"
    },
    {
      "strength": "medium",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「言い方が強かったかもしれない」と「黙って受け入れるのも違う」が、異なる向きのまま同時にあります。
今の入力には、「落ち着いてから要点だけ伝え直した」という行動があります。

Emlisから：
言い方が強かったかもしれないという今ここに置かれた言葉と黙って受け入れるのも違うこととの違いを小さくせずに受け止めています。落ち着いてから要点だけ伝え直したことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0033

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0033",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "休んでいる時間まで予定を聞かれると、少し息苦しい。",
  "memo_action": "今夜は通知を切ることにした。",
  "category": [
    "生活",
    "仕事",
    "健康"
  ],
  "emotions": [
    "怒り",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "怒り"
    },
    {
      "strength": "medium",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「休んでいる時間まで予定を聞かれると、少し息苦しい」という感覚や状態が前に出ています。
今の入力には、「今夜は通知を切ることにした」という、これからの行動があります。

Emlisから：
休んでいる時間まで予定を聞かれると、少し息苦しいという言葉を小さくせずに受け止めています。今夜は通知を切ることにしたというこれからの行動を見過ごさず、大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0034

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0034",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "勝手に触られたの、やっぱり嫌だった。",
  "memo_action": "次から先に声をかけてほしいと伝えた。",
  "category": [
    "生活",
    "人間関係"
  ],
  "emotions": [
    "怒り"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "怒り"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「勝手に触られたの、やっぱり嫌だった」という感覚や状態が前に出ています。
今の入力には、「次から先に声をかけてほしいと伝えた」という行動があります。

Emlisから：
勝手に触られたの、やっぱり嫌だったことを小さくせずに受け止めています。次から先に声をかけてほしいと伝えたことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0035

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0035",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "今の仕事を続けるか迷っている。それとは別に、住む場所を変えることを考え始める時期も決められない。",
  "memo_action": "二つを混ぜないよう、判断材料を別々の欄に書いている。",
  "category": [
    "生活",
    "仕事",
    "人生"
  ],
  "emotions": [
    "喜び",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "喜び"
    },
    {
      "strength": "strong",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=LIMITED, body_state=FINAL, sufficiency=LIMITED。

```text
見えたこと：
今の仕事を続けるか迷っているのですね。
それとは別に、住む場所を変えることを考え始める時期も決められないのですね。
今の入力には、「二つを混ぜないよう、判断材料を別々の欄に書いている」という行動があります。

Emlisから：
今の仕事を続けるか迷っていることとは別に、住む場所を変えることを考え始める時期も決められないのですね。二つを混ぜないよう、判断材料を別々の欄に書いていることを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0036

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0036",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "昔好きだったことを、今も本当に好きなのか分からない。嫌いになったのか、ただ時間がないだけなのかも決められない。",
  "memo_action": "以前残した記録を一つ読み返したが、再開するかは決めなかった。",
  "category": [
    "趣味",
    "価値観"
  ],
  "emotions": [
    "悲しみ",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "悲しみ"
    },
    {
      "strength": "medium",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0037

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0037",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "これが不調なのか、ただ眠いだけなのか、自分でも区別がつかない。",
  "memo_action": "今の状態を短く記録した。",
  "category": [
    "健康"
  ],
  "emotions": [
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0038

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0038",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "嬉しいはずなのに、なんで不安なのかはまだ言葉にできない。",
  "memo_action": "",
  "category": [
    "恋愛"
  ],
  "emotions": [
    "喜び",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "喜び"
    },
    {
      "strength": "medium",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「嬉しいはずなのに、なんで不安なのかはまだ言葉にできない」という感覚が前に出ています。

Emlisから：
今ここに置かれた言葉を小さくせずに受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0039

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0039",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "続けたい気持ちはある。でも今のやり方でいいか分からなくなった。",
  "memo_action": "別の進め方を一つ調べた。",
  "category": [
    "趣味",
    "学習"
  ],
  "emotions": [
    "悲しみ",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "悲しみ"
    },
    {
      "strength": "strong",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「続けたい気持ちはある」という見方だけでなく、「今のやり方でいいか分からなくなった」という変化という具体的な変化も同時にあります。
今の入力には、「別の進め方を一つ調べた」という行動があります。

Emlisから：
続けたい気持ちはある一方で、分からなくなったのは、今のやり方でいいかという点なのですね。別の進め方を一つ調べたことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0040

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0040",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "たぶん断りたい、でも本当にそれでいいのか…",
  "memo_action": "返事は明日まで待ってもらうよう頼んだ。",
  "category": [
    "仕事",
    "人間関係"
  ],
  "emotions": [
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0041

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0041",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "褒められたのは嬉しい。ただ、どの部分を見てもらえたのかは分からない。",
  "memo_action": "",
  "category": [
    "仕事"
  ],
  "emotions": [
    "喜び",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "喜び"
    },
    {
      "strength": "weak",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=LIMITED, body_state=FINAL, sufficiency=LIMITED。

```text
見えたこと：
「褒められたのは嬉しい」と「どの部分を見てもらえたのかは分からない」が、異なる向きのまま同時にあります。

Emlisから：
まだ定まらないことが重なる中で、今ここに置かれた言葉ともう一方の向きとの違いをどちらの側も残したまま、小さくせずに受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0042

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0042",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "前より楽になった気はするけど、もう大丈夫と言えるほどではない。",
  "memo_action": "無理のない範囲で日課を続けている。",
  "category": [
    "生活",
    "健康"
  ],
  "emotions": [
    "喜び",
    "不安",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "喜び"
    },
    {
      "strength": "medium",
      "type": "不安"
    },
    {
      "strength": "weak",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
前より楽になった気はするけど、もう大丈夫と言えるほどではないのですね。
今の入力には、「無理のない範囲で日課を続けている」という行動があります。

Emlisから：
前より楽になった気はするけど、もう大丈夫と言えるほどではないという言葉を小さくせずに受け止めています。無理のない範囲で日課を続けていることを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0043

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0043",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "移動が続いて少し疲れているけれど、次の予定まで時間はある。",
  "memo_action": "駅のベンチでしばらく休んでから、次の場所へ向かった。",
  "category": [
    "生活",
    "健康"
  ],
  "emotions": [
    "不安",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "不安"
    },
    {
      "strength": "medium",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「移動が続いて少し疲れているけれど、次の予定まで時間はある」という感覚や状態が前に出ています。
今の入力には、「駅のベンチでしばらく休んでから、次の場所へ向かった」という行動があります。

Emlisから：
今も、移動が続いて少し疲れているけれど、次の予定まで時間はあるという言葉を小さくせずに受け止めています。駅のベンチでしばらく休んでから、次の場所へ向かったことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0044

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0044",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "少し緊張しているけれど、準備したことは出せそうだ。",
  "memo_action": "開始前に要点を一度読み返す。",
  "category": [
    "仕事"
  ],
  "emotions": [
    "喜び",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "喜び"
    },
    {
      "strength": "medium",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今回の中心には、「少し緊張しているけれど、準備したことは出せそうだ」があります。
今の入力には、「開始前に要点を一度読み返す」という、これからの行動があります。

Emlisから：
少し緊張しているけれど、準備したことは出せそうだという今ここに置かれた言葉を小さくせずに受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0045

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0045",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "最近は寝る前まで画面を見ていて、朝が重い。",
  "memo_action": "今夜は充電器をベッドから離れた場所に置く。",
  "category": [
    "生活",
    "健康"
  ],
  "emotions": [
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「最近は寝る前まで画面を見ていて、朝が重い」という感覚や状態が前に出ています。
今の入力には、「今夜は充電器をベッドから離れた場所に置く」という、これからの行動があります。

Emlisから：
今夜は充電器をベッドから離れた場所に置くことを見過ごさず、大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0046

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0046",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "前は避けていた話題だけど、今なら少し話せる気がする。",
  "memo_action": "伝えたいことを箇条書きにした。",
  "category": [
    "人間関係",
    "価値観"
  ],
  "emotions": [
    "喜び",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "喜び"
    },
    {
      "strength": "medium",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「前は避けていた話題だけど、今なら少し話せる気がする」という感覚が前に出ています。
今の入力には、「伝えたいことを箇条書きにした」という行動があります。

Emlisから：
前は避けていた話題だけど、今なら少し話せる気がするという言葉を小さくせずに受け止めています。伝えたいことを箇条書きにしたことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0047

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0047",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "週末の集まりは楽しみだけど、大人数だと途中で疲れそうでもある。",
  "memo_action": "帰る時間を先に決めておく。",
  "category": [
    "生活",
    "人間関係"
  ],
  "emotions": [
    "喜び",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "喜び"
    },
    {
      "strength": "weak",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「週末の集まりは楽しみだけど、大人数だと途中で疲れそうでもある」という感覚や状態が前に出ています。
今の入力には、「帰る時間を先に決めておく」という、これからの行動があります。

Emlisから：
週末の集まりは楽しみだけど、大人数だと途中で疲れそうでもあるという言葉を小さくせずに受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0048

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0048",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "大きく変えたいわけじゃないけど、今のままも少し違う。",
  "memo_action": "まず週末の過ごし方を一つ変えてみる。",
  "category": [
    "生活",
    "価値観",
    "人生"
  ],
  "emotions": [
    "不安",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "不安"
    },
    {
      "strength": "medium",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今回の中心には、「大きく変えたいわけじゃないけど、今のままも少し違う」があります。
今の入力には、「まず週末の過ごし方を一つ変えてみる」という、これからの行動があります。

Emlisから：
大きく変えたいわけじゃないけど、今のままも少し違うという言葉を小さくせずに受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0049

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0049",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "あのとき黙ったことを後悔しているけど、今からでも伝えたい。",
  "memo_action": "送る前に文章を一晩置くことにした。",
  "category": [
    "人間関係"
  ],
  "emotions": [
    "悲しみ",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "悲しみ"
    },
    {
      "strength": "medium",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今回の中心には、「あのとき黙ったことを後悔しているけど、今からでも伝えたい」があります。
今の入力には、「送る前に文章を一晩置くことにした」という、これからの行動があります。

Emlisから：
あのとき黙ったことを後悔しているけど、今からでも伝えたいという願いに目が留まり、それを見失わずに、大切に受け止めています。送る前に文章を一晩置くことにしたというこれからの行動を大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0050

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0050",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "忙しさは変わっていないけど、優先順位が見えて少し安心した。",
  "memo_action": "急がない用事を来週へ移した。",
  "category": [
    "生活",
    "仕事"
  ],
  "emotions": [
    "喜び",
    "不安",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "喜び"
    },
    {
      "strength": "weak",
      "type": "不安"
    },
    {
      "strength": "medium",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「忙しさは変わっていないけど、優先順位が見えて少し安心した」という変化を、自分でも感じています。
今の入力には、「急がない用事を来週へ移した」という行動があります。

Emlisから：
忙しさは変わっていないけど、優先順位が見えて少し安心したという言葉を小さくせずに受け止めています。急がない用事を来週へ移したことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0051

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0051",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "どうして予定を決めた後になると、急に別の選択のほうがよかった気がするんだろう。",
  "memo_action": "",
  "category": [
    "生活"
  ],
  "emotions": [
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0052

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0052",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "この選び方で本当に大事な点を見落としていないかな。",
  "memo_action": "迷った理由を確かめるために、候補を三つに絞って違いを書き出した。",
  "category": [
    "仕事",
    "学習"
  ],
  "emotions": [
    "不安",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "不安"
    },
    {
      "strength": "weak",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0053

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0053",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "休むべきか、今の作業だけ終えるべきか。どちらも必要に思えて決められない。",
  "memo_action": "結論が出ないまま、同じ二つの選択肢をノートに書き直した。",
  "category": [
    "仕事",
    "健康"
  ],
  "emotions": [
    "不安",
    "怒り"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "不安"
    },
    {
      "strength": "medium",
      "type": "怒り"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今回の中心には、「休むべきか、今の作業だけ終えるべきか」があります。
「どちらも必要に思えて決められない」という行動に移しています。
今の入力には、「結論が出ないまま、同じ二つの選択肢をノートに書き直した」という行動があります。

Emlisから：
結論が出ないまま、同じ二つの選択肢をノートに書き直したことを見過ごさず、大切に受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0054

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0054",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "楽しかったのに、帰ってから寂しくなったのはなぜだろう。",
  "memo_action": "",
  "category": [
    "趣味"
  ],
  "emotions": [
    "喜び",
    "悲しみ"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "喜び"
    },
    {
      "strength": "medium",
      "type": "悲しみ"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0055

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0055",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "協力して仕上げたものを褒められてうれしかった。でも、助けてもらった部分も大きく、自分だけの成果として受け取ってよいのか迷っている。",
  "memo_action": "自分が担った部分と、助けてもらった部分を分けてメモした。",
  "category": [
    "仕事",
    "人間関係"
  ],
  "emotions": [
    "喜び",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "喜び"
    },
    {
      "strength": "medium",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「協力して仕上げたものを褒められてうれしかった」と「助けてもらった部分も大きく、自分だけの成果として受け取ってよいのか迷っている」が、異なる向きのまま同時にあります。
今の入力には、「自分が担った部分と、助けてもらった部分を分けてメモした」という行動があります。

Emlisから：
協力して仕上げたものを褒められてうれしかった一方で、迷っているのは、助けてもらった部分も大きく、自分だけの成果として受け取ってよいのかという点なのですね。自分が担った部分と、助けてもらった部分を分けてメモしたことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0056

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0056",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "今は答えを決めるより、何に引っかかっているのかを見ていたい。",
  "memo_action": "忘れないように、答えではなく問いだけをメモした。",
  "category": [
    "価値観"
  ],
  "emotions": [
    "自己理解"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "自己理解"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「今は答えを決めるより、何に引っかかっているのかを見ていたい」という方向を望んでいます。
今の入力には、「忘れないように、答えではなく問いだけをメモした」という行動があります。

Emlisから：
その願いに目が留まり、それを見失わずに、大切に受け止めています。忘れないように、答えではなく問いだけをメモしたことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0057

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0057",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "最初は新しい役割を任されたことがうれしくて、期待に応えたい気持ちだけで走っていた。でも、少しずつ自分の考えを言う前に正解を探すようになり、最近は何を大切にして取り組みたかったのか分からなくなってきた。",
  "memo_action": "今日は作業を増やす代わりに、始めた頃に残したメモと今の記録を並べ、変わった点を三つ書き出した。",
  "category": [
    "仕事",
    "価値観"
  ],
  "emotions": [
    "喜び",
    "不安",
    "悲しみ"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "喜び"
    },
    {
      "strength": "strong",
      "type": "不安"
    },
    {
      "strength": "medium",
      "type": "悲しみ"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「最初は新しい役割を任されたことがうれしくて、期待に応えたい気持ちだけで走っていた」という見方だけでなく、「少しずつ自分の考えを言う前に正解を探すようになり、最近は何を大切にして取り組みたかったのか分からなくなってきた」という変化という具体的な変化も同時にあります。
「今日は作業を増やす代わりに、始めた頃に残したメモと今の記録を並べ、変わった点を三つ書き出した」という行動に移しています。

Emlisから：
最初は新しい役割を任されたことがうれしくて、期待に応えたい気持ちだけで走っていたことに表れた願いと少しずつ自分の考えを言う前に正解を探すようになり、最近は何を大切にして取り組みたかったのか分からなくなってきたことを見過ごさず、その違いも含めて見失わずに、大切に受け止めています。今日は作業を増やす代わりに、始めた頃に残したメモと今の記録を並べ、変わった点を三つ書き出したことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0058

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0058",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "体調を整えようと思って早く寝る日を増やしたら、朝に余白ができて気分は落ち着いた。一方で、夜に続けていた好きなことを中断する日も増え、整ってきたはずなのに自分の時間を失っているような寂しさもある。どちらも本当で、まだちょうどよい形は見つかっていない。",
  "memo_action": "一週間だけ、睡眠時間と夜にできたことを同じ表へ記録して、無理なく続く範囲を確かめることにした。",
  "category": [
    "生活",
    "趣味",
    "健康"
  ],
  "emotions": [
    "平穏",
    "悲しみ",
    "喜び"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "平穏"
    },
    {
      "strength": "medium",
      "type": "悲しみ"
    },
    {
      "strength": "weak",
      "type": "喜び"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「朝に余白ができて気分は落ち着いた」という変化と「夜に続けていた好きなことを中断する日も増え、整ってきたはずなのに自分の時間を失っているような寂しさもある」が、異なる向きのまま同時にあります。 「体調を整えようと思って早く寝る日を増やした」という行動からその変化へつながっています。
今回の中心には、「どちらも本当で、まだちょうどよい形は見つかっていない」があります。
今の入力には、「一週間だけ、睡眠時間と夜にできたことを同じ表へ記録して、無理なく続く範囲を確かめることにした」という、これからの行動があります。

Emlisから：
体調を整えようと思って早く寝る日を増やしたら、朝に余白ができて気分は落ち着いたのですね。その一方で、今も、夜に続けていた好きなことを中断する日も増え、整ってきたはずなのに自分の時間を失っているような寂しさもあることを見過ごさず、小さくせずに受け止めています。どちらも本当で、まだちょうどよい形は見つかっていないことを小さくせずに受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0059

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0059",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "学び直しを始めた頃は、知らなかったことが分かるたびに世界が広がる感じがしていた。続けるうちに理解できない箇所が目立ち、周りの進み方と比べて焦るようになったけれど、それでも昨日まで読めなかった説明を自分の言葉でまとめられた瞬間はうれしかった。進みが遅いという気持ちと、確かに進んでいる実感が同時にある。",
  "memo_action": "次の範囲へ急がず、今日まとめた一ページだけを明日もう一度説明できるか確かめる。",
  "category": [
    "学習",
    "人生"
  ],
  "emotions": [
    "喜び",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "喜び"
    },
    {
      "strength": "medium",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「学び直しを始めた頃は、知らなかったことが分かるたびに世界が広がる感じがしていた」と「続けるうちに理解できない箇所が目立ち」が重なり、今は一つの状態として前に出ています。
「周りの進み方と比べて焦るようになったけれど」という見方だけでなく、「昨日まで読めなかった説明を自分の言葉でまとめられた瞬間はうれしかった」という具体的な変化も同時にあります。
今の入力には、「次の範囲へ急がず、今日まとめた一ページだけを明日もう一度説明できるか確かめる」という、これからの行動があります。

Emlisから：
周りの進み方と比べて焦るようになったという変化とそれでも昨日まで読めなかった説明を自分の言葉でまとめられた瞬間はうれしかったことを見過ごさず、その違いも含めて受け止めています。次の範囲へ急がず、今日まとめた一ページだけを明日もう一度説明できるか確かめることを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0060

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0060",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "長く続けてきた活動をやめようと考えたときは、疲れから離れられる安心しか見えていなかった。実際に回数を減らすと余裕は戻ったけれど、そこで知り合った人たちとのつながりや、少しずつ上達してきた時間まで手放すように感じた。続けるかやめるかの二択ではなく、距離を変える方法もあるのかもしれないと思い始めている。",
  "memo_action": "次の予定には参加せず、その後の一回だけ短時間で参加できるかを確認した。",
  "category": [
    "趣味",
    "人間関係",
    "健康"
  ],
  "emotions": [
    "平穏",
    "悲しみ",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "平穏"
    },
    {
      "strength": "strong",
      "type": "悲しみ"
    },
    {
      "strength": "medium",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0061

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0061",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "前は予定が空いていると何かで埋めなければ落ち着かなかった。忙しくしていれば前へ進んでいると思えたからだと思う。最近、何もしない午後を一度過ごしてみたら、焦りは出たけれど、考えがゆっくりほどける感覚もあった。立ち止まることを怠けと決めずにいられる時間が、少しだけ増えた気がする。",
  "memo_action": "来週も一時間だけ予定を入れない枠を残し、その後の気分を短く記録するつもり。",
  "category": [
    "生活",
    "価値観"
  ],
  "emotions": [
    "平穏",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "平穏"
    },
    {
      "strength": "weak",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0062

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0062",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "意見が違うと関係まで壊れる気がして、以前は相手に合わせることが多かった。先日の話し合いでは、小さな違いだけれど自分の希望を伝えた。すぐに納得し合えたわけではなく、少し気まずい時間もあった。それでも話が終わった後、違うままでも会話を続けられたことにほっとした。怖さが消えたわけではないけれど、合わせる以外の関わり方もありそうだと思えた。",
  "memo_action": "次に話すときは、賛成できる点と違う点を分けて一つずつ伝えるため、先に要点を二つだけ書いておいた。",
  "category": [
    "人間関係",
    "価値観"
  ],
  "emotions": [
    "不安",
    "平穏",
    "喜び"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "不安"
    },
    {
      "strength": "medium",
      "type": "平穏"
    },
    {
      "strength": "weak",
      "type": "喜び"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「意見が違うと関係まで壊れる気がして、以前は相手に合わせることが多かった」と「先日の話し合いでは、小さな違いだけれど自分の希望を伝えた」が、同じ入力に置かれた出来事として並んでいます。
「すぐに納得し合えたわけではなく、少し気まずい時間もあった」と「話が終わった後、違うままでも会話を続けられたことにほっとした」が、異なる向きのまま同時にあります。
怖さが消えたわけではないけれど、合わせる以外の関わり方もありそうだと思えたのですね。
今の入力には、「次に話すときは、賛成できる点と違う点を分けて一つずつ伝えるため、先に要点を二つだけ書いておいた」という行動があります。

Emlisから：
怖さが消えたわけではないけれど、合わせる以外の関わり方もありそうだと思えたという言葉を小さくせずに受け止めています。すぐに納得し合えたわけではなく、少し気まずい時間もあったけれど、それでもほっとしたのは、話が終わった後、違うままでも会話を続けられたことなのですね。次に話すときは、賛成できる点と違う点を分けて一つずつ伝えるため、先に要点を二つだけ書いておいたことを見過ごさず、大切に受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0063

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0063",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "失敗した直後は、自分には向いていないとしか思えなかった。時間を置いて記録を読み返すと、準備不足だった部分と、初めてでもできていた部分が両方あった。それでも次を考えると怖いし、同じことになる可能性も否定できない。ただ、失敗したという一つの出来事だけで、続ける資格まで決めなくてもいいのかもしれない。",
  "memo_action": "すぐに再挑戦を決めず、足りなかった準備を一項目だけ試してから判断することにした。",
  "category": [
    "仕事",
    "学習",
    "価値観"
  ],
  "emotions": [
    "悲しみ",
    "不安",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "悲しみ"
    },
    {
      "strength": "medium",
      "type": "不安"
    },
    {
      "strength": "weak",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0064

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0064",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "暮らしを変えたいと思って、持ち物を減らし、予定も見直し、使う時間を選び直してきた。最初は身軽になることがただうれしかったけれど、続けるほど、昔の自分が大切にしていたものまで急いで手放していないか不安になった。変化を止めたいわけではない。ただ、新しくすることと、残したいものを見分ける時間の両方が必要だと感じている。",
  "memo_action": "今日は処分を進めず、残すか迷った物に理由を書いた付箋を付けて一晩置いた。",
  "category": [
    "生活",
    "価値観",
    "人生"
  ],
  "emotions": [
    "喜び",
    "不安",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "喜び"
    },
    {
      "strength": "strong",
      "type": "不安"
    },
    {
      "strength": "weak",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「暮らしを変えたいと思って、持ち物を減らし、予定も見直し、使う時間を選び直してきた」という方向を望んでいます。
「変化を止めたいわけではない」の一方で「新しくすることと、残したいものを見分ける時間の両方が必要だと感じている」、また「続けるほど、昔の自分が大切にしていたものまで急いで手放していないか不安になった」の一方で「変化を止めたいわけではない」という、それぞれ異なる向きが並んでいます。 「新しくすることと、残したいものを見分ける時間の両方が必要だと感じている」という願いと、「続けるほど、昔の自分が大切にしていたものまで急いで手放していないか不安になった」という制約が並んでいます。
今の入力には、「今日は処分を進めず、残すか迷った物に理由を書いた付箋を付けて一晩置いた」という行動があります。

Emlisから：
そこまでの出来事が重なる中で、その変化とその願いがともにあること、また、残る向きがその制約の中にも失われないことに目が留まり、それを見失わずに、大切に受け止めています。今日は処分を進めず、残すか迷った物に理由を書いた付箋を付けて一晩置いたことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0065

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0065",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "落ち込んでいたとき、答えを急がず話を聞いてもらえたことがありがたかった。一人で抱えている感じは少し薄れたけれど、困っていること自体はまだ残っている。",
  "memo_action": "",
  "category": [
    "人間関係"
  ],
  "emotions": [
    "喜び",
    "悲しみ",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "喜び"
    },
    {
      "strength": "medium",
      "type": "悲しみ"
    },
    {
      "strength": "weak",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今回の中心には、「落ち込んでいたとき、答えを急がず話を聞いてもらえたことがありがたかった」があります。
今は、「一人で抱えている感じは少し薄れたけれど、困っていること自体はまだ残っている」という感覚や状態が前に出ています。

Emlisから：
一人で抱えている感じは少し薄れたけれど、困っていること自体はまだ残っていることを背景に、落ち込んでいたとき、答えを急がず話を聞いてもらえたことがありがたかったという助けについて置かれた言葉を大切に受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0066

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0066",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "すれ違った後も、こちらの話を聞く時間を作ってくれたことがうれしかった。全部分かり合えたとは思わないけれど、関係を諦めずに話せたことで少し安心した。",
  "memo_action": "自分の言い方で傷つけた部分を認め、言い直したかった内容を伝えた。",
  "category": [
    "人間関係"
  ],
  "emotions": [
    "喜び",
    "不安",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "喜び"
    },
    {
      "strength": "weak",
      "type": "不安"
    },
    {
      "strength": "medium",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「すれ違った後も、こちらの話を聞く時間を作ってくれたことがうれしかった」と「全部分かり合えたとは思わないけれど、関係を諦めずに話せたことで少し安心した」という、それぞれの気持ちが書かれています。
今の入力には、「自分の言い方で傷つけた部分を認め、言い直したかった内容を伝えた」という行動があります。

Emlisから：
すれ違った後も、こちらの話を聞く時間を作ってくれたことがうれしかったという気持ちも、全部分かり合えたとは思わないけれど、関係を諦めずに話せたことで少し安心したという気持ちも、見過ごさず、受け止めています。自分の言い方で傷つけた部分を認め、言い直したかった内容を伝えたことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0067

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0067",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "",
  "memo_action": "作業で詰まった箇所を一緒に確認してもらい、途中まで進められた。終わる前に、助かった点をその場で一つ伝えた。",
  "category": [
    "仕事",
    "人間関係"
  ],
  "emotions": [
    "喜び",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "喜び"
    },
    {
      "strength": "medium",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0068

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0068",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "無理な頼みを断ったとき、距離を置かれるのではと怖かった。でも、理由を聞いた上で別の方法を一緒に考えてもらえて、断ることと関係を大切にすることは両立するのかもしれないと思えた。",
  "memo_action": "考えてくれたことへのお礼と、今回できる範囲を改めて伝えた。",
  "category": [
    "人間関係",
    "価値観"
  ],
  "emotions": [
    "不安",
    "喜び",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "不安"
    },
    {
      "strength": "strong",
      "type": "喜び"
    },
    {
      "strength": "weak",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0069

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0069",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "短い便り、ありがたかった。返したい。でも今はまだ長く話せなくて。",
  "memo_action": "下書きに「読んだよ」まで。送信はまだ",
  "category": [
    "恋愛",
    "健康"
  ],
  "emotions": [
    "悲しみ",
    "喜び",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "悲しみ"
    },
    {
      "strength": "weak",
      "type": "喜び"
    },
    {
      "strength": "strong",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0070

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0070",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "参加できない時期が続いたのに、戻ったときに責めず迎えてもらえてほっとした。空いた時間を埋めるように頑張らなくても、また関われると思えたことがうれしい。",
  "memo_action": "休んでいた間のことを無理に取り戻さず、今できる小さな担当を一つ引き受けた。",
  "category": [
    "趣味",
    "人間関係"
  ],
  "emotions": [
    "喜び",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "喜び"
    },
    {
      "strength": "medium",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「参加できない時期が続いたのに、戻ったときに責めず迎えてもらえてほっとした」と「空いた時間を埋めるように頑張らなくても、また関われると思えたことがうれしい」という、それぞれの気持ちが書かれています。
今の入力には、「休んでいた間のことを無理に取り戻さず、今できる小さな担当を一つ引き受けた」という行動があります。

Emlisから：
参加できない時期が続いたのに、戻ったときに責めず迎えてもらえてほっとしたという気持ちも、空いた時間を埋めるように頑張らなくても、また関われると思えたことがうれしいという気持ちも、見過ごさず、受け止めています。休んでいた間のことを無理に取り戻さず、今できる小さな担当を一つ引き受けたことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0071

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0071",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "",
  "memo_action": "調子を崩して家のことが進まなかった間、代わりに片づけてもらった。動けるようになってから、お礼を伝えて自分ができる分を少しずつ戻した。",
  "category": [
    "生活",
    "人間関係",
    "健康"
  ],
  "emotions": [
    "喜び",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "喜び"
    },
    {
      "strength": "weak",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0072

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0072",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "困っていると伝えるのが苦手だったけれど、勇気を出して話したときに、すぐ解決策を押しつけず一緒に整理してもらえた。その関わりがありがたくて、頼ることを弱さだけで見なくなった。",
  "memo_action": "",
  "category": [
    "人間関係",
    "価値観"
  ],
  "emotions": [
    "自己理解"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "自己理解"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0073

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0073",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "朝の慌ただしさを当然だと思っていたけれど、準備を夜へ少し移すだけでも余裕が変わると気づいた。全部を一度に直すのではなく、まず一つだけ続けたい。",
  "memo_action": "今夜から三日間、持ち物だけ先にそろえてみる。",
  "category": [
    "生活"
  ],
  "emotions": [
    "喜び",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "喜び"
    },
    {
      "strength": "weak",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0074

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0074",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "このまま同じやり方で働くの、たぶん違う。でも何を変えたいかはまだぼんやり。",
  "memo_action": "気になった場面だけ一週間メモしてから、変える範囲を決めようかな。",
  "category": [
    "仕事",
    "価値観"
  ],
  "emotions": [
    "不安",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "不安"
    },
    {
      "strength": "weak",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0075

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0075",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "毎回完璧に記録しようとして続かなかったので、抜ける日があっても戻ればいい方法へ変えた。",
  "memo_action": "今日の分は一行だけ書き、書けなかった昨日の欄は空けたままにした。",
  "category": [
    "生活",
    "健康"
  ],
  "emotions": [
    "平穏",
    "喜び"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "平穏"
    },
    {
      "strength": "medium",
      "type": "喜び"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今回の中心には、「毎回完璧に記録しようとして続かなかったので、抜ける日があっても戻ればいい方法へ変えた」があります。
今の入力には、「今日の分は一行だけ書き、書けなかった昨日の欄は空けたままにした」という行動があります。

Emlisから：
今日の分は一行だけ書き、書けなかった昨日の欄は空けたままにしたことを見過ごさず、大切に受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0076

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0076",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "今いる場所を離れて新しい環境を試したい気持ちが強くなっている。ただ、今あるつながりを失う怖さもあって、勢いだけで決めたくない。",
  "memo_action": "候補を決める前に、変えたいことと残したいことを別々の紙に書く。",
  "category": [
    "生活",
    "人間関係",
    "人生"
  ],
  "emotions": [
    "喜び",
    "不安",
    "悲しみ"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "喜び"
    },
    {
      "strength": "strong",
      "type": "不安"
    },
    {
      "strength": "weak",
      "type": "悲しみ"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「今いる場所を離れて新しい環境を試したい気持ちが強くなっている」という願いと、「今あるつながりを失う怖さもあって、勢いだけで決めたくない」という制約が並んでいます。
「候補を決める前に、変えたいことと残したいことを別々の紙に書く」という行動に移しています。

Emlisから：
今いる場所を離れて新しい環境を試したい気持ちが強くなっていることと今あるつながりを失う怖さもあって、勢いだけで決めたくないことの両方を見失わず、大切に受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0077

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0077",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "次に写真を撮る流れになったら、写りたくないって先に言いたい。空気を止めそうで、まだちょっと怖いけど。",
  "memo_action": "その場で使う短い言い方を一つメモした",
  "category": [
    "人間関係",
    "価値観"
  ],
  "emotions": [
    "怒り",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "怒り"
    },
    {
      "strength": "medium",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「次に写真を撮る流れになったら、写りたくないって先に言いたい」という願いと、「空気を止めそうで、まだちょっと怖いけど」という制約が並んでいます。
今の入力には、「その場で使う短い言い方を一つメモした」という行動があります。

Emlisから：
次に写真を撮る流れになったら、写りたくないって先に言いたいという願いと空気を止めそうで、まだちょっと怖いけどということを見過ごさず、その重なりも含めて見失わずに、大切に受け止めています。その場で使う短い言い方を一つメモしたことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0078

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0078",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "覚える量を増やすより、わからない所を言葉にする練習が必要かもしれない。焦って先へ進むやり方を変えてみたい。",
  "memo_action": "明日は一つの章だけ読み、疑問を三つまで書いてから次へ進む予定。",
  "category": [
    "学習"
  ],
  "emotions": [
    "不安",
    "喜び"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "不安"
    },
    {
      "strength": "weak",
      "type": "喜び"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0079

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0079",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "調子がいい日にまとめて動いて、その後に休み続ける波を小さくしたい。急に全部変えるのは不安だから、まずは…",
  "memo_action": "一日の予定に、やめる時刻を先に書くつもり。",
  "category": [
    "生活",
    "健康"
  ],
  "emotions": [
    "不安",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "不安"
    },
    {
      "strength": "weak",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「調子がいい日にまとめて動いて、その後に休み続ける波を小さくしたい」という願いと、「急に全部変えるのは不安だから、まずは…」という制約が並んでいます。
「一日の予定に、やめる時刻を先に書くつもり」という行動に移しています。

Emlisから：
調子がいい日にまとめて動いて、その後に休み続ける波を小さくしたいという願いと急に全部変えるのは不安だから、まずは…ということの両方を見失わず、大切に受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0080

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0080",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "これまで役に立つかどうかを基準に選ぶことが多かったけれど、すぐ形にならなくても心が動くことへ時間を使いたいと思うようになった。まだ生活との折り合いは見えていない。",
  "memo_action": "来月の予定を埋める前に、成果を決めない時間を半日だけ確保する。",
  "category": [
    "趣味",
    "価値観",
    "人生"
  ],
  "emotions": [
    "自己理解"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "自己理解"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0081

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0081",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "いろいろ重なっている気はする。でも、どれが一番つらいのかも、何から話せばいいのかも今は分からない。",
  "memo_action": "書こうとして、出来事を決められないまま画面を閉じた。",
  "category": [
    "生活",
    "仕事",
    "人間関係"
  ],
  "emotions": [
    "悲しみ",
    "不安",
    "怒り"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "悲しみ"
    },
    {
      "strength": "strong",
      "type": "不安"
    },
    {
      "strength": "weak",
      "type": "怒り"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0082

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0082",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "",
  "memo_action": "何度も書き始めては消した。どのことを書こうとしていたのか、自分でもまとまっていない。",
  "category": [
    "人間関係",
    "恋愛"
  ],
  "emotions": [
    "不安",
    "悲しみ"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "不安"
    },
    {
      "strength": "medium",
      "type": "悲しみ"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0083

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0083",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "前のことも、この先のことも気になる。うれしかった感じも腹が立った感じも残っているのに、肝心の出来事は言葉にすると違う気がして書けない。何かを決めたいのか、ただ分かってほしいのかも定まっていない。",
  "memo_action": "思いついた単語だけをいくつか残した。",
  "category": [
    "仕事",
    "人間関係",
    "価値観",
    "人生"
  ],
  "emotions": [
    "喜び",
    "怒り",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "喜び"
    },
    {
      "strength": "strong",
      "type": "怒り"
    },
    {
      "strength": "medium",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0084

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0084",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "何かが変わってきたのは分かる。でも、それが自分の考えなのか、疲れているだけなのか、周りとのことなのかは判断できない。今は変化があるという感覚だけ。",
  "memo_action": "",
  "category": [
    "生活",
    "仕事",
    "健康",
    "価値観"
  ],
  "emotions": [
    "自己理解"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "自己理解"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「何かが変わってきたのは分かる」と「それが自分の考えなのか、疲れているだけなのか、周りとのことなのかは判断できない」が、異なる向きのまま同時にあります。
今回の中心には、「今は変化があるという感覚だけ」があります。

Emlisから：
何かが変わってきたのは分かるという今ここに置かれた言葉とそれが自分の考えなのか、疲れているだけなのか、周りとのことなのかは判断できないことの両方を、その違いも含めて小さくせずに受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0085

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0085",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "あれもこれも、なんか無理。どこがって聞かれるとまだ…",
  "memo_action": "とりあえず全部の予定を見ただけで、触れずに戻った",
  "category": [
    "生活",
    "仕事",
    "学習"
  ],
  "emotions": [
    "悲しみ",
    "怒り",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "悲しみ"
    },
    {
      "strength": "medium",
      "type": "怒り"
    },
    {
      "strength": "strong",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「あれもこれも、なんか無理」という感覚が前に出ています。
今回の中心には、「どこがって聞かれるとまだ…」があります。
今の入力には、「とりあえず全部の予定を見ただけで、触れずに戻った」という行動があります。

Emlisから：
あれもこれも、なんか無理という言葉を小さくせずに受け止めています。とりあえず全部の予定を見ただけで、触れずに戻ったことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0086

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0086",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "理由はうまく説明できないけれど、安心した感じと身構える感じが同時にある。対象も一つではない気がする。",
  "memo_action": "判断はせず、今ある感覚だけ二列に分けて書いた。",
  "category": [
    "人間関係",
    "恋愛",
    "価値観"
  ],
  "emotions": [
    "平穏",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "平穏"
    },
    {
      "strength": "medium",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「理由はうまく説明できないけれど、安心した感じと身構える感じが同時にある」という感覚が前に出ています。
今は、「対象も一つではない気がする」という感覚が前に出ています。
今の入力には、「判断はせず、今ある感覚だけ二列に分けて書いた」という行動があります。

Emlisから：
理由はうまく説明できないけれど、安心した感じと身構える感じが同時にあり、対象も一つではない気がするのですね。判断はせず、今ある感覚だけ二列に分けて書いたことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0087

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0087",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "以前も朝に焦ることはあったけれど、今日は出かける直前に鍵が見つからず、予定に遅れそうで不安になった。",
  "memo_action": "今朝使った鞄と上着のポケットを順に確認した。",
  "category": [
    "生活"
  ],
  "emotions": [
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「今日は出かける直前に鍵が見つからず、予定に遅れそうで不安になった」という変化を、自分でも感じています。
今の入力には、「今朝使った鞄と上着のポケットを順に確認した」という行動があります。

Emlisから：
以前も朝に焦ることはあったけれど、今日は出かける直前に鍵が見つからず、予定に遅れそうで不安になったという変化を見過ごさず、受け止めています。今朝使った鞄と上着のポケットを順に確認したことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0088

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0088",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "前にも説明の途中で言葉が止まったことを思い出した。今日の発表では、最初の要点は伝えられたけれど、質問を受けたところで頭が真っ白になった。",
  "memo_action": "終わった後、答えられなかった質問を一つだけ記録した。",
  "category": [
    "仕事",
    "学習"
  ],
  "emotions": [
    "不安",
    "悲しみ"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "不安"
    },
    {
      "strength": "medium",
      "type": "悲しみ"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今回の中心には、「前にも説明の途中で言葉が止まったことを思い出した」があります。
「質問を受けたところで頭が真っ白になった」という変化を、自分でも感じています。
「終わった後、答えられなかった質問を一つだけ記録した」という行動に移しています。

Emlisから：
前にも説明の途中で言葉が止まったことを思い出したことを背景に、今日の発表では、最初の要点は伝えられたけれど、質問を受けたところで頭が真っ白になったことに表れた変化に目が留まり、それを受け止めています。終わった後、答えられなかった質問を一つだけ記録したことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0089

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0089",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "前にも苦手な話題で黙ったまま座り続けたことがある。今日は同じ話題が始まったとき、少し席を外すとだけ伝えた。",
  "memo_action": "理由を詳しく説明せず、その場を離れて水を飲んだ。",
  "category": [
    "人間関係",
    "価値観"
  ],
  "emotions": [
    "不安",
    "怒り"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "不安"
    },
    {
      "strength": "weak",
      "type": "怒り"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「前にも苦手な話題で黙ったまま座り続けたことがある」と「今日は同じ話題が始まったとき、少し席を外すとだけ伝えた」が、同じ入力に置かれた出来事として並んでいます。
今の入力には、「理由を詳しく説明せず、その場を離れて水を飲んだ」という行動があります。

Emlisから：
理由を詳しく説明せず、その場を離れて水を飲んだことを見過ごさず、大切に受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0090

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0090",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "",
  "memo_action": "以前は朝になると必要な物を探していた。今日は決めた箱からすぐ取り出し、使ったあと同じ場所へ戻した。",
  "category": [
    "生活"
  ],
  "emotions": [
    "喜び",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "喜び"
    },
    {
      "strength": "weak",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「以前は朝になると必要な物を探していた」という行動から「今日は決めた箱からすぐ取り出し、使ったあと同じ場所へ戻した」という行動へ、前から後への変化として、捉え方や動きが移っています。

Emlisから：
以前は朝になると必要な物を探していたことから今日は決めた箱からすぐ取り出し、使ったあと同じ場所へ戻したことへの移り変わりに目が留まり、それをどちらの側も残したまま、大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0091

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0091",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "前にも気持ちを飲み込んだあとで苦しくなったことがある。今日は、返事をする前に今は考える時間がほしいと伝えられた。",
  "memo_action": "その場で結論を出さず、明日まで待ってもらえるか確認した。",
  "category": [
    "人間関係"
  ],
  "emotions": [
    "不安",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "不安"
    },
    {
      "strength": "weak",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

### nls3s_b001_0092

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0092",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "前に同じようなだるさがあった日を思い出したけれど、今日の理由が同じかは分からない。今は少し休むと楽になり、まだ重さも残っている。",
  "memo_action": "今日の食事と睡眠の時間だけ記録し、予定を一つ減らした。",
  "category": [
    "生活",
    "健康"
  ],
  "emotions": [
    "不安",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "不安"
    },
    {
      "strength": "medium",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=LIMITED, body_state=FINAL, sufficiency=LIMITED。

```text
見えたこと：
前に同じようなだるさがあった日を思い出したけれど、今日の理由が同じかは分からないのですね。
今の入力には、「今は少し休むと楽になり、まだ重さも残っている」という変化があります。
「今日の食事と睡眠の時間だけ記録し、予定を一つ減らした」という行動に移しています。

Emlisから：
今は少し休むと楽になり、まだ重さも残っていて、前に同じようなだるさがあった日を思い出したけれど、今日の理由が同じかは分からないのですね。今日の食事と睡眠の時間だけ記録し、予定を一つ減らしたことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0093

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0093",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "やった、終わった。あれ。",
  "memo_action": "終わらせた、それだけ",
  "category": [
    "人生"
  ],
  "emotions": [
    "喜び"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "喜び"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
「やった、終わった」と「あれ」が、同じ入力に置かれた出来事として並んでいます。
今の入力には、「終わらせた、それだけ」という行動があります。

Emlisから：
終わらせた、それだけという言葉に表れた実際の行動に目が留まり、それを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0094

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0094",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "またダメって思った。言うつもりだったのに、結局言えなくて。",
  "memo_action": "でも、伝えたい要点は一個だけメモした",
  "category": [
    "仕事"
  ],
  "emotions": [
    "悲しみ",
    "怒り"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "悲しみ"
    },
    {
      "strength": "weak",
      "type": "怒り"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今回の中心には、「またダメって思った」があります。
「言うつもりだったのに、結局言えなくて」という方向を望んでいます。
今の入力には、「伝えたい要点は一個だけメモした」という行動があります。

Emlisから：
そこまでの出来事を背景に、その願いに目が留まり、それを見失わずに、大切に受け止めています。伝えたい要点は一個だけメモしたことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0095

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0095",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "きのう焼いたパンが思ったより固くて、ちょっと落ちこんだ。",
  "memo_action": "きょうは薄く切ってスープに添えたら、最後まで食べられた。",
  "category": [
    "生活",
    "趣味"
  ],
  "emotions": [
    "悲しみ",
    "喜び"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "悲しみ"
    },
    {
      "strength": "weak",
      "type": "喜び"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今回の中心には、「きのう焼いたパンが思ったより固くて、ちょっと落ちこんだ」があります。
今の入力には、「きょうは薄く切ってスープに添えたら、最後まで食べられた」という行動があります。

Emlisから：
きのう焼いたパンが思ったより固くて、ちょっと落ちこんだという言葉を小さくせずに受け止めています。きょうは薄く切ってスープに添えたら、最後まで食べられたことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0096

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0096",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "あの件、もう考えたくないのか、まだ考えたいのか、自分でも…",
  "memo_action": "画面を開いたまま手が止まった",
  "category": [
    "仕事",
    "人間関係"
  ],
  "emotions": [
    "不安",
    "怒り"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "不安"
    },
    {
      "strength": "medium",
      "type": "怒り"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「あの件、もう考えたくないのか、まだ考えたいのか、自分でも…」と自分を見ている状態です。
「画面を開いたまま手が止まった」という行動に移しています。

Emlisから：
あの件、もう考えたくないのか、まだ考えたいのか、自分でも…という今ここに置かれた言葉を小さくせずに受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0097

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0097",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "二つの誘いのどちらにも惹かれる点と不安な点があり、今の情報だけでは選べない。断った後のことも気になる。",
  "memo_action": "それぞれについて確認したいことを一つずつ書き、返事は明日にすると伝えるつもり。",
  "category": [
    "趣味",
    "人間関係"
  ],
  "emotions": [
    "喜び",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "medium",
      "type": "喜び"
    },
    {
      "strength": "strong",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今は、「二つの誘いのどちらにも惹かれる点と不安な点があり、今の情報だけでは選べない」という感覚や状態が前に出ています。
今回の中心には、「断った後のことも気になる」があります。
「それぞれについて確認したいことを一つずつ書き、返事は明日にすると伝えるつもり」という行動に移しています。

Emlisから：
それぞれについて確認したいことを一つずつ書き、返事は明日にすると伝えるつもりということに表れた願いを見失わず、大切に受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0098

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0098",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "鉢を明るい場所へ移した。",
  "memo_action": "窓辺へ鉢を移した。",
  "category": [
    "趣味"
  ],
  "emotions": [
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=GENERATED, body_state=FINAL, sufficiency=SUFFICIENT。

```text
見えたこと：
今回の中心には、「鉢を明るい場所へ移した」があります。
今の入力には、「窓辺へ鉢を移した」という行動があります。

Emlisから：
窓辺へ鉢を移したことを見過ごさず、大切に受け止めています。
```

質問：なし
question disposition：END

### nls3s_b001_0099

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0099",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "近くに人がいても、自分だけつながれていない感じがする。なぜそう感じるのかは分からない。",
  "memo_action": "昼の誘いには行かず、静かな場所で一人で過ごした。",
  "category": [
    "生活",
    "人間関係"
  ],
  "emotions": [
    "悲しみ",
    "不安"
  ],
  "emotion_details": [
    {
      "strength": "strong",
      "type": "悲しみ"
    },
    {
      "strength": "weak",
      "type": "不安"
    }
  ],
  "is_secret": false
}
```

initial: status=LIMITED, body_state=FINAL, sufficiency=LIMITED。

```text
見えたこと：
今は、「近くに人がいても、自分だけつながれていない感じがする」という感覚が前に出ています。
なぜそう感じるのかは分からないのですね。
今の入力には、「昼の誘いには行かず、静かな場所で一人で過ごした」という行動があります。

Emlisから：
近くに人がいても、自分だけつながれていない感じがして、なぜそう感じるのかは分からないのですね。昼の誘いには行かず、静かな場所で一人で過ごしたことを大切に思っています。
```

質問：なし
question disposition：END

### nls3s_b001_0100

入力：
```json
{
  "id": "emlis-demo-input-nls3s_b001_0100",
  "created_at": "2026-10-17T09:16:32+00:00",
  "memo": "頼まれるとすぐ引き受けるやり方を変えたいと思っていた。昨日は返事を保留できなかったけれど、後から無理な範囲に気づいた。次は相手との関係も自分の余裕も、どちらか一方だけにしないで考えたい。",
  "memo_action": "今日は追加の依頼へすぐ返事をせず、締切と必要な時間を確認してから明日答えると伝えた。",
  "category": [
    "仕事",
    "人間関係",
    "健康",
    "価値観"
  ],
  "emotions": [
    "怒り",
    "不安",
    "平穏"
  ],
  "emotion_details": [
    {
      "strength": "weak",
      "type": "怒り"
    },
    {
      "strength": "medium",
      "type": "不安"
    },
    {
      "strength": "medium",
      "type": "平穏"
    }
  ],
  "is_secret": false
}
```

initial: status=UNAVAILABLE, body_state=UNAVAILABLE, sufficiency=None。

```text
[本文未提供]
```

質問：なし
question disposition：BLOCKED

## 実保存DTOの自然表現6例と旧保存の境界

### current-original-01

initial: state=COMPLETED, body_state=FINAL, failure=None, can_retry=False、timeline=1。

### current-original-02

initial: state=COMPLETED, body_state=FINAL, failure=None, can_retry=False、timeline=1。

### current-original-03

initial: state=COMPLETED, body_state=FINAL, failure=None, can_retry=False、timeline=1。

### current-original-04

initial: state=COMPLETED, body_state=FINAL, failure=None, can_retry=False、timeline=1。

### current-original-05

initial: state=COMPLETED, body_state=FINAL, failure=None, can_retry=False、timeline=1。

### current-original-06

initial: state=COMPLETED, body_state=FINAL, failure=None, can_retry=False、timeline=1。

### current-original-07

initial: state=AWAITING_ANSWER, body_state=PRE_QUESTION, failure=None, can_retry=False、timeline=2。

updated: state=COMPLETED, body_state=REFINED, failure=None, can_retry=False、timeline=4。

### current-original-08

initial: state=COMPLETED, body_state=FINAL, failure=None, can_retry=False、timeline=1。

### current-original-09

initial: state=COMPLETED, body_state=FINAL, failure=None, can_retry=False、timeline=1。

### current-original-10

initial: state=COMPLETED, body_state=FINAL, failure=None, can_retry=False、timeline=1。

### natural-03a

initial: state=COMPLETED, body_state=FINAL, failure=None, can_retry=False、timeline=1。

入力：友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。何が不安なのか、私にもまだわからない。

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
今回の中心には、「何が不安なのか、私にもまだわからない」があります。

Emlisから：
友達からの誘いを断って、一人で休めたことにほっとしたという気持ちともう誘ってもらえなくなるかもしれないと思うと寂しいこととの違いをどちらの側も残したまま、感じています。
```

### natural-03b

initial: state=COMPLETED, body_state=FINAL, failure=None, can_retry=False、timeline=1。

入力：予定を調整して、家で過ごせたことに安心した。でも、失敗するかもしれないと考えると不安だ。

```text
見えたこと：
「予定を調整して、家で過ごせたことに安心した」の一方で「失敗するかもしれないと考えると不安だ」とあります。

Emlisから：
予定を調整して、家で過ごせたことに安心したという気持ちと失敗するかもしれないと考えると不安だということとの違いをどちらの側も残したまま、感じています。
```

### natural-03c

initial: state=COMPLETED, body_state=FINAL, failure=None, can_retry=False、timeline=1。

入力：宿題を終えて、庭で遊べたことにうれしかった。でも、参加できないかもしれないと思うと悲しい。

```text
見えたこと：
「宿題を終えて、庭で遊べたことにうれしかった」の一方で「参加できないかもしれないと思うと悲しい」とあります。

Emlisから：
宿題を終えて、庭で遊べたことにうれしかったという気持ちと参加できないかもしれないと思うと悲しいこととの違いをどちらの側も残したまま、感じています。
```

### natural-03d

initial: state=COMPLETED, body_state=FINAL, failure=None, can_retry=False、timeline=1。

入力：資料を片づけて、机で読めたことにほっとした。

```text
見えたこと：
「資料を片づけて、机で読めたことにほっとした」という気持ちが書かれています。

Emlisから：
資料を片づけて、机で読めたことにほっとしたという気持ちを受け止めています。
```

### natural-04-self

initial: state=COMPLETED, body_state=FINAL, failure=None, can_retry=False、timeline=1。

入力：なんだかしんどい。何が嫌なのか、私にもまだわからない。

```text
見えたこと：
今は、「なんだかしんどい」という感覚や状態が前に出ています。
今回の中心には、「何が嫌なのか、私にもまだわからない」があります。

Emlisから：
まだ定まらないことを背景に、今ここに置かれた言葉を小さくせずに受け止めています。
```

### natural-04-reaction

initial: state=COMPLETED, body_state=FINAL, failure=None, can_retry=False、timeline=1。

入力：なんだかしんどい。何が不安なのか、自分でもよくわからない。

```text
見えたこと：
今は、「なんだかしんどい」という感覚や状態が前に出ています。
今回の中心には、「何が不安なのか、自分でもよくわからない」があります。

Emlisから：
その反応を背景に、今ここに置かれた言葉を小さくせずに受け止めています。
```

### old-saved-07

initial: state=AWAITING_ANSWER, body_state=PRE_QUESTION, failure=None, can_retry=False、timeline=2。

updated: state=COMPLETED, body_state=REFINED, failure=None, can_retry=False、timeline=4。

### old-pending-07

initial: state=AWAITING_ANSWER, body_state=PRE_QUESTION, failure=None, can_retry=False、timeline=2。

updated: state=COMPLETED, body_state=REFINED, failure=None, can_retry=False、timeline=4。

### old-failed-03

initial: state=RESPONSE_FAILED, body_state=UNAVAILABLE, failure=body_not_validated, can_retry=False、timeline=0。

### old-interrupted-03-retry

initial: state=RESPONSE_FAILED, body_state=UNAVAILABLE, failure=worker_interrupted, can_retry=True、timeline=0。

updated: state=RESPONSE_FAILED, body_state=UNAVAILABLE, failure=body_not_validated, can_retry=False、timeline=0。

全20ケース/24 DTOにRN hook/modalを適用。表示・履歴・close/reopen・retry可否表示を確認。serviceでは旧03通常失敗のretry拒否と旧03中断checkpointの許可retryを別検証。private user bodyは含めていない。
