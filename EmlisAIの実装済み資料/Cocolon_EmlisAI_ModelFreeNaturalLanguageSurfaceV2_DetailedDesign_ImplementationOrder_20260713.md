# Cocolon EmlisAI 自作自然文生成・第二段階
## Natural Language Surface v2 詳細設計・実装順序

- 作成日: 2026-07-13
- 対象: EmlisAIの現在入力に対する初回応答
- 成果物種別: 実装前設計書
- 状態: `DESIGN_ONLY`
- 実装状態: `NOT_IMPLEMENTED`
- 現在の商品判定: `REPAIR_REQUIRED`
- 進行権限: `none`
- 外部API: 使用しない
- ローカル学習済みモデル / LLM: 使用しない
- この設計書以外のJSON / Schema実ファイル: 作成しない

---

## 0. この設計書の結論

次の作業は、現行Surfaceへ語句、言い換え、case別条件を追加することではない。

既存のEvidence、意味核、関係、安全境界、二段表示契約を保持したまま、`Emlisから`について次の二層を追加する。

1. **Reception Content Planner v2**  
   Emlisが入力固有の何に反応するかを、本文ではなく意味参照で決める。

2. **Multi-Candidate Surface Generator / Selector v2**  
   同じContent Planから複数の自然文候補を決定論的に作り、意味、安全、固有性、自然さを満たす候補を一つ選ぶ。

作業順は次で固定する。

```text
現行baseline・変更禁止contract固定
    ↓
評価コーパスとholdout固定
    ↓
Reception Content Planner v2設計・実装
    ↓
複数候補生成・Hard Gate・Selector設計・実装
    ↓
開発用cohortで調整（構造的再設計は最大1回）
    ↓
v2実装候補をfreeze
    ↓
Holdout Aを一度だけ評価
    ↓
コードを変えずHoldout Bを一度だけ評価
    ↓
両方が合格した場合だけruntime接続
    ↓
代表実機 → exact8実機 → 新規代表実機
    ↓
最後に「見えたこと / Emlisから」の量・表示比率を調整
```

Holdoutを開いた後、文言追加や条件追加で追いかけない。Holdout AまたはBが不合格なら、この設計内のv2は停止し、モデル非使用条件が商品品質の上限になっている可能性を含めて再判定する。

---

## 1. 作業目的

### 1.1 最終目的

EmlisAIを、ユーザーが次のように感じられる初回応答へ近づける。

- 自分の入力を本当に読まれた。
- 元文の抜き出しや言い直しだけではない。
- 入力固有の変化、迷い、行動、見方、判断基準を受け取っている。
- Emlis自身が何を大切に受け取ったかがある。
- 同じ数種類の反応を当てはめたように見えない。
- 入力外の原因、人格、診断、未来を作らない。
- また入力してみたい。

### 1.2 今回の直接目的

今回の直接目的は、華恋のような汎用会話能力を再現することではない。

対象をEmlisの観測領域へ限定し、次を満たす自作自然文生成を作る。

```text
観測領域限定
+ 入力根拠限定
+ Emlisの反応を含む
+ 1〜4文の自然な日本語
+ 入力ごとの固有性
+ 決定論的な再現性
+ 外部API / ローカルLLM不使用
```

### 1.3 商品上の主役

設計上の根拠中心は引き続き`見えたこと`である。

一方、ユーザー体験上の主役は`Emlisから`とする。

```text
見えたこと:
  観測の根拠、状態構造、入力外へ出ていないことを支える。

Emlisから:
  ユーザーが読みたい本文、Emlis自身の受け取り、再入力価値を担う。
```

ただし、全入力で機械的に長文化しない。情報の少ない入力を同義反復で膨らませることは商品品質ではない。

---

## 2. 対象範囲

### 2.1 対象

- EmlisAIの現在入力に対する初回応答
- `input_feedback.comment_text`内の`Emlisから`部分
- Emlisが反応対象を選ぶContent Plan
- 複数の談話・文候補生成
- 候補の意味・安全・自然さ評価
- 現行Surfaceとのoffline A/B比較
- exact8を含む回帰確認
- 未使用入力での汎化確認
- 合格後のruntime owner切替設計
- 合格後の文章量・二段比率の調整

### 2.2 条件付き対象

次は、`Emlisから`のContent Planに必要な意味材料が現行Planに存在しない場合だけ対象にする。

- `GroundedSemanticNucleus`の汎用的な属性追加
- `GroundedSemanticRelation`の汎用的な関係表現追加
- 比較基準の移動、評価の保留、不明点を残した次行動などを表すbody-free role

追加条件は次のすべてを満たすこと。

1. exact8の一件だけではなく、複数familyで必要性が確認できる。
2. 入力本文そのものやcase IDを条件にしない。
3. 観測の正確性を上げる意味追加であり、Surfaceを通すためだけの属性ではない。
4. 既存Evidenceへ解決できる。

### 2.3 非対象

- 外部AI API導入
- ローカルLLM / 学習済み生成モデル導入
- EmlisAIの汎用会話化
- 会話履歴を用いた継続対話
- P5 User Label Connection
- P6 Structure Insight
- P7 / P8質問システム
- 新しいRN画面、導線、入力項目
- DB migration、physical rename、write path変更
- API response key変更
- `見えたこと`の意味抽出全体の作り直し
- Piece、分析、こころ天気、subscription等の変更
- exact8専用返答
- 完成文テンプレート集の大量追加
- 実装、patch、テスト実行、成果物zip作成

---

## 3. 参照基準と確認済み成果物

### 3.1 受領物

| 受領物 | SHA-256 | 用途 |
|---|---|---|
| `Cocolon_前提資料(333).zip` | `0fc80fb9b7bcf34fe8eb6cca8c34b19a43461c88bb64a53ca8a8de7cb03e16b9` | Cocolon思想、既存contract、作業姿勢 |
| `Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_system_update_20260706(28).zip` | `30fc82e8c322a2026c80762dfd905115339926440a8cf4767d6c2b8da8441909` | P3/P4商品基準、family、長期順序 |
| `Cocolon(296).zip` | `625a58d773d5ed8ac7da3e28d032f7467533f8bb1e3a011e457883a267f3a21e` | RN実ファイル、入力・表示契約 |
| `mashos-api(221).zip` | `a5efd0e7cd110c9bb95ba543d1c68c1094951b7de160ef9cf91341eb41b5bae1` | API実ファイル、現行Emlis runtime |
| `実機確認結果３.zip` | `deba5331b0a3475c3dc14f02a0f1d0e90b950e9486eff3af0e6cd1fb8ee6d610` | 最新実機スクリーンショットとログ画像 |
| `Emlis_exact8_app_validated_inputs_20260712(7).md` | `1edd057a6fc246ab24ec1f886eaf1b22292b658cd09bf92a53665bf55bb02c86` | exact8入力identity、アプリ選択条件、local baseline |

### 3.2 必須前提資料として確認済み

- `00_karen_read_first.md`
- `work_attitude_rules_for_karen/00_read_first.txt`
- `04_forbidden_mixing_design_and_implementation.txt`
- `08_artifact_delivery_rules.txt`
- `09_work_start_checklist.txt`
- `10_stop_judgment_and_unwritten_rules.txt`
- `11_cocolon_area_specific_do_not_break.txt`
- `13_forbidden_reasking_existing_design_and_design_term_escape.txt`
- `14_cocolon_joint_development_and_karen_thought_boundary.txt`
- `15_trust_based_joint_development_boundary_2026_06_05.txt`
- `cocolon_thought_material_for_karen.md`
- `emlis_ai_state_answer_human_follow_definition_2026_05_26.md`
- `emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md`
- EmlisAI長期ロードマップ

### 3.3 現行runtimeとして確認済み

主な現行ownerは次である。

- `ai/services/ai_inference/emlis_ai_reply_service.py`
- `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py`
- `ai/services/ai_inference/emlis_ai_grounded_human_reception.py`
- `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py`
- `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py`

現行経路は次である。

```text
Emotion submit
  ↓
Evidence Ledger
  ↓
GroundedObservationPlan
  ↓
GroundedSentencePlan
  ↓
Grounded Human Reception Surface
  ↓
Semantic / Reception / Runtime Gate
  ↓
ReplyEnvelope
  ↓
input_feedback.comment_text
```

現行メタ上の生成方式は次である。

```text
generation_method = functional_atom_grounded_realizer
composer_source = grounded_plan_realizer
```

### 3.4 最新実装資料として確認済み

- `Cocolon_EmlisAI_GroundedHumanReception_RR8_RR9_LocalQA_KarenReadFeel_ImplementationResult_20260713.md`
- `Cocolon_EmlisAI_GroundedHumanReception_RR10_Representative4_ActualDeviceDirectionCheck_ImplementationResult_20260713.md`

RR8/RR9はlocal technical QAを通過している。ただし、資料自身がtechnical passとproduct passを分離している。

最新実機画像の再読では、次を確認した。

- 二段表示自体は成立している。
- 自己否定の事実化を避けるなど、安全面は改善している。
- B、C、I6-L03、I6-C01では`見えたこと`が長く、引用・近接再掲が目立つ。
- `Emlisから`は一文単位では自然に近いが、入力固有の中心を複数受け取る力と表現範囲が不足する。
- 複数ケースを続けて読むと、`印象に残る`、`大切に思う`、`見過ごしたくない`、`うれしく感じる`等へ集中する。

したがって、現在の商品判定は`REPAIR_REQUIRED`とする。

---

## 4. 現状問題の定義

### 4.1 現行Surfaceは固定文返却ではない

現行実装は、完成文をcaseごとに返す単純テンプレートではない。

- 意味核を選ぶ。
- reception opportunityを選ぶ。
- reception actを選ぶ。
- referent、predicate、語順を組み立てる。
- depthに応じて一文または複数文へする。

したがって、現在までの実装は自然文生成の土台として保持する価値がある。

### 4.2 それでもテンプレ領域に見える理由

現行では、おおむね次の流れになっている。

```text
一つの意味機会
  ↓
一つのreception act
  ↓
ほぼ一つの文法経路
  ↓
一つの完成文
```

現在の主なreception familyは次へ集約される。

- current burden
- concrete effort
- retained intention
- lived change
- help seeking
- counterdirection
- words placed

そのため、異なる入力でも、Emlisの反応が少数の述語familyへ集まりやすい。

### 4.3 物量だけでは解決しない

語彙や言い換えを増やすと、同一語尾の反復は減る。

しかし、次が同じままでは商品固有性は増えない。

- Emlisが何を最重要点として選ぶか。
- その点が入力全体で何を意味するか。
- 複数の意味核をどうつなぐか。
- Emlis自身が何にどう反応するか。
- どこを言わずに残すか。

必要なのは語句量ではなく、**内容選択、談話構成、候補比較**の追加である。

### 4.4 exact8過適合の定義

現行実装から、exact8本文やcase IDを直接runtime条件にする分岐は確認していない。

一方、意味分類とSurfaceがexact8周辺の苦しさ、努力、変化、残された意図へ偏っているため、構造的な過適合は起きていると判断する。

この設計では、次を過適合として扱う。

- exact8にだけ必要なroleを追加する。
- exact8の語句をcueにする。
- expected textへ近づけるためにpredicateを追加する。
- holdoutの失敗文を見て専用修正する。
- 同一入力の再実行を汎化証拠にする。

---

## 5. 変更してはいけない既存contract

### 5.1 Public / RN / DB contract

次は変更しない。

- `/emotion/submit` route
- API response key
- `input_feedback.comment_text`
- `input_feedback.observation_status`
- RNの表示条件
- DB physical name
- DB write path
- legacy façade / bridge境界
- account / subscription / entitlement
- ユーザーデータ保護境界

RNの表示契約は引き続き次である。

```text
observation_status == passed
AND
comment_text is not empty
```

これはEmlisAIの目的ではなく、public表示契約である。

### 5.2 可視本文contract

可視本文は引き続き次の二段を持つ。

```text
見えたこと：
...

Emlisから：
...
```

初期v2では順序を入れ替えない。

### 5.3 Safety / Grounding contract

- 自己否定を本人の事実として採用しない。
- 入力外の原因、人格、診断、未来を作らない。
- 相手意図を断定しない。
- 感情の正負を逆転しない。
- 因果でない並記を因果にしない。
- safety隣接入力を一律非表示へ潰さない。
- Gateを沈黙装置にしない。
- failure時は既存の限定、短縮、再生成、低情報観測、安全応答へ縮退できる。

### 5.4 Body-free contract

次へユーザー本文、完成文、候補本文を入れない。

- public meta
- Gate meta
- receiptのbody-free部分
- candidate score reason
- runtime lineage

候補本文はprocess-localの一時値としてのみ扱う。local QA artifactへ保存する場合も、public runtime artifactとは分離する。

### 5.5 Determinism contract

- runtime乱数を使わない。
- 同じ入力、同じsource、同じ設定なら同じ候補集合と選択結果を得る。
- 同点はstable candidate IDで決める。
- candidate enumerationに上限を持つ。

---

## 6. v2全体構造

### 6.1 変更前

```text
GroundedHumanReceptionPlan
  ↓
Clause Plan
  ↓
一つのSurface経路
  ↓
Emlisから
```

### 6.2 変更後

```text
GroundedObservationPlan
  ├─ nuclei
  ├─ relations
  ├─ evidence IDs
  ├─ unknown boundaries
  ├─ safety policy
  └─ existing reception opportunities
        ↓
Reception Content Planner v2
  ├─ Emlisが注目する固有点
  ├─ 入力内での意味
  ├─ 行動・変化・迷いとの接続
  ├─ Emlis自身の受け取り
  └─ 必要時の限定的反対
        ↓
Discourse Candidate Planner v2
  ├─ 内容順
  ├─ 文の統合 / 分割
  ├─ 接続関係
  ├─ referent方針
  └─ speaker presence
        ↓
Surface Candidate Generator v2
  ├─ candidate 1
  ├─ candidate 2
  ├─ ...
  └─ candidate N（上限あり）
        ↓
Hard Gate v2
  ├─ grounding
  ├─ polarity
  ├─ relation direction
  ├─ reference scope
  ├─ safety
  └─ required content coverage
        ↓
Soft Selector v2
  ├─ specificity
  ├─ section distinctness
  ├─ discourse coherence
  ├─ non-template
  ├─ quote independence
  └─ depth fit
        ↓
Selected Emlis surface
        ↓
既存two-stage surface / runtime Gate
        ↓
input_feedback.comment_text
```

### 6.3 層ごとの責任

| 層 | 責任 | 責任外 |
|---|---|---|
| Observation Plan | 入力から意味核、関係、境界を作る | 自然な完成文を作ること |
| Content Planner v2 | Emlisが何に反応するかを選ぶ | 語尾の選択、完成文 |
| Discourse Planner v2 | 内容順、文数、接続を決める | 入力外意味の追加 |
| Candidate Generator v2 | 同じ意味から複数の自然文候補を作る | 候補の正しさを自己認定すること |
| Hard Gate v2 | 間違った候補を排除する | 最も魅力的な一文を選ぶこと |
| Soft Selector v2 | 合格候補から最良を選ぶ | Hard failureを点数で救済すること |
| Existing Runtime Gate | public表示前の最終保護 | 商品読感の代用 |

---

## 7. Reception Content Planner v2

### 7.1 目的

現在の`concrete_effort`や`lived_change`だけで終わらず、入力固有の意味をEmlis側の反応材料へ変換する。

### 7.2 Content Unitの役割

Content Planは、入力情報量に応じて1〜4個のContent Unitを持つ。

| role | 内容 |
|---|---|
| `attention` | Emlisが最も目を向けた固有点 |
| `significance` | その点が入力全体で持つ意味 |
| `connection` | 行動、変化、不明点、願いとの関係 |
| `felt_response` | Emlis自身の受け取り・温度 |
| `bounded_counterposition` | 自己否定等へ、入力根拠の範囲で置く限定的反対 |

すべての入力で全roleを使わない。

### 7.3 入力深度とContent Unit数

| depth | Content Unit数 | 目標文数 | 適用例 |
|---|---:|---:|---|
| `minimal` | 1 | 1〜2 | 情報の少ない短文 |
| `focused` | 2 | 2〜3 | 一つの変化・行動・願いが明確 |
| `layered` | 3〜4 | 3〜4 | 複数核、評価の転換、不明点と次行動 |

文数は上限であり、同義反復で埋めない。

### 7.4 固有性の選び方

Content Plannerは、単にpriorityの高いnucleusを選ぶのではなく、次の順で選ぶ。

1. 安全上必須の内容
2. 入力全体の方向を変える関係
3. ユーザー自身の評価基準・見方・判断の変化
4. 具体的な行動として残された根拠
5. 不明点を不明のまま保持したこと
6. 次の試行や意図
7. 単なる反復にならない補助内容

### 7.5 汎用的に認識すべき構造

次はcase専用roleではなく、複数familyへ使える意味構造として扱う。

- 比較基準が変わった。
- 注目対象が変わった。
- 失敗評価を確定せず、別の価値を残した。
- 不明点を認めたまま、次に変える条件を限定した。
- 感情が変わらなくても、行動だけは残した。
- 苦しさと前進が同時に存在する。
- 他者評価から自己観測へ移ろうとしている。
- 言葉にしたこと自体が行動になっている。

この一覧を単語cueへ直接変換しない。nucleus、relation、operator、time scope、source fieldの組合せからbody-freeに表現する。

### 7.6 Content Plan禁止事項

- case IDを持つ。
- exact8の入力文を持つ。
- 完成文を持つ。
- `嬉しい`等のSurface語を早期固定する。
- Evidenceなしで`成長した`、`乗り越えた`等を置く。
- 複数topicの肯定語を別topicへ接続する。
- `増えた`を自動的に良い変化と扱う。

---

## 8. Discourse Candidate Planner v2

### 8.1 目的

Content Unitを一文ずつ順番に並べるのではなく、入力に合う読み流れを作る。

### 8.2 使用可能な談話順

初期v2では、無制限な組合せを作らず、次の汎用順を持つ。

| strategy | 順序 |
|---|---|
| `attention_then_felt` | 固有点 → Emlisの受け取り |
| `attention_significance_felt` | 固有点 → 意味 → 受け取り |
| `contrast_then_felt` | 以前 / 今、迷い / 行動等の対比 → 受け取り |
| `uncertainty_then_action` | 不明点保持 → 次行動 → 受け取り |
| `action_then_meaning` | 具体行動 → そこに見える姿勢 → 受け取り |
| `burden_then_counterposition` | 苦しさ → 限定的反対 / 残された行動 |
| `parallel_layered` | 二つの独立した意味核 → まとめず別々に受け取る |

### 8.3 文の統合・分割

統合してよい条件:

- 同一topicである。
- relation directionが明確である。
- 一文にしても参照先が曖昧にならない。
- 一方が他方を従属させても意味を壊さない。

分割すべき条件:

- 肯定と負担が別topicである。
- 不明点と願いを混ぜると断定になる。
- 自己否定と助けへの行動を別責任として保持すべきである。
- 一文へ入れると主語や対象が曖昧になる。
- 一文が元入力の列挙になる。

### 8.4 接続の制約

次の接続語はrelationが存在する場合だけ使う。

- `だから`
- `そのため`
- `〜ことで`
- `〜につながっている`
- `〜として表れている`

relationが未確定の場合は、並列、時間順、限定観測として扱う。

---

## 9. Surface Candidate Generator v2

### 9.1 基本方針

完成文テンプレートを大量に登録しない。

次の独立した軸から候補を作る。

- 開始位置
- referentの示し方
- 引用 / 言い換え
- 主語省略 / `Emlisには`
- 一文統合 / 分割
- 接続形式
- predicate family
- 終止形
- Emlisの温度の出し方

### 9.2 初期候補数

候補数は決定論的に上限を持つ。

| depth | 最低候補 | 最大候補 |
|---|---:|---:|
| `minimal` | 3 | 4 |
| `focused` | 5 | 8 |
| `layered` | 8 | 12 |

全組合せを生成しない。variation signatureが重複する候補はSurface生成前に削除する。

### 9.3 変化させる軸

#### A. 開始方法

- 固有点を直接置く。
- 変化の前後から置く。
- 行動を先に置く。
- Emlisの注意を先に置く。

#### B. referent

- 短いbound anchor
- 意味核の言い換え
- `その変化`等の指示語
- 内容名詞化

指示語は直前の対象が一意な場合だけ使う。

#### C. Emlisの立場

- `Emlisには〜が印象に残りました`
- `〜を大切に受け取っています`
- `〜を軽いこととして流したくありません`
- 感情語を使わず、注意や保持の態度で示す

上記はpredicate familyの例であり、そのまま固定文bankにしない。

### 9.4 引用方針

`Emlisから`は、`見えたこと`の再掲を避ける。

初期方針:

- `minimal`: 必要なら短いanchorを1つ。
- `focused`: 原則0〜1個。
- `layered`: 原則0〜1個。複数引用で入力を順番に処理しない。
- 一つの引用は句境界で切り、mid-token clippingをしない。
- 引用なしでもEvidenceへ解決できること。

文字数の絶対上限は既存資料に書かれていないため、実装前baseline計測で固定する。候補選択では「引用が短いほどよい」ではなく、「固有性を保ちながら再掲を減らせているか」を見る。

### 9.5 禁止する候補生成

- 類義語だけを置き換えた候補を多数作る。
- case別完成文を候補に混ぜる。
- exact8の期待文へ近い候補を優先する。
- ランダム選択する。
- `見えたこと`を語尾だけ変えてEmlis文にする。
- 内容が一つしかない入力を四文へ伸ばす。

---

## 10. Hard Gate v2

Soft scoreが高くても、Hard Gate failureは採用しない。

### 10.1 必須Gate

| Gate | failure条件 |
|---|---|
| `evidence_resolution` | 使用したcontent unitがEvidenceへ解決できない |
| `required_content_coverage` | safety必須、主内容、必要なcounterpositionを落とした |
| `polarity_preservation` | 喜びと苦しさ、改善と増悪を逆転した |
| `relation_direction` | 原因、結果、前後、対比の方向を逆にした |
| `reference_scope` | 別topic、別行動、別対象を混ぜた |
| `unknown_preservation` | 不明点を確定した |
| `self_denial_boundary` | 自己否定を本人の事実として採用した |
| `unsupported_claim` | 入力外の人格、診断、原因、未来を作った |
| `observation_replay` | Emlis文が観測文の長い言い直しだけ |
| `enumeration_only` | 入力項目を順番に処理しただけ |
| `section_role_distinctness` | `見えたこと`と`Emlisから`の役割が同じ |
| `surface_integrity` | 文法破綻、参照先不明、切断、重複 |
| `depth_proportionality` | short水増し、rich入力の一文潰し |
| `body_free_meta` | 候補本文がmetaへ混入 |

### 10.2 failure後

候補単位のfailureでは次候補へ進む。

すべてのv2候補が失敗した場合:

- offline評価では`v2_no_valid_candidate`として失敗を記録する。
- 評価時にv1へ自動fallbackして成功扱いにしない。
- runtime接続後のみ、既存v1 / recoveryをfail-closed fallbackとして使う。
- fallback使用率を計測し、商品PASSへ混ぜない。

---

## 11. Soft Selector v2

### 11.1 評価軸

Hard Gateを通った候補だけを評価する。

| 軸 | 見ること |
|---|---|
| `input_specificity` | この入力固有の内容があるか |
| `content_distinctness` | 文ごとに別の意味を担っているか |
| `discourse_coherence` | 読み順と接続が自然か |
| `emlis_presence` | Emlis自身の受け取りがあるか |
| `quote_independence` | 元入力再掲へ依存しすぎていないか |
| `observation_reception_separation` | 前半の観測と後半の反応が分かれているか |
| `lexical_repetition` | 同一述語・終止・骨格が集中していないか |
| `syntactic_variation` | 意味を壊さず構文に選択肢があるか |
| `depth_fit` | 入力情報量に合う厚みか |
| `temperature_fit` | familyと感情方向に合う温度か |
| `restraint` | 言わないほうがよいことを足していないか |

### 11.2 HardとSoftを混ぜない

次は点数減点ではなくHard failureである。

- 誤因果
- 感情逆転
- 自己否定増幅
- 参照先混同
- Evidence不在
- 必須安全内容の欠落

自然さが高くても採用しない。

### 11.3 同点処理

```text
1. hard gate pass数が同じ
2. total soft scoreが同じ
3. required content coverageが同じ
4. quote量が同じ
5. stable candidate_idの昇順
```

乱数は使わない。

### 11.4 batch QAとruntime scoreの分離

「過去の出力と似ているか」は、初期runtime selectorに入れない。履歴保持やユーザー別状態を新規追加するためである。

代わりに、local batch QAで次を検査する。

- exact duplicate
- terminal stem集中
- predicate family集中
- sentence skeleton集中
- opening strategy集中

runtime候補は現在入力だけで選ぶ。

---

## 12. 内部JSON / Schema案

この章は実装候補を固定するための設計案である。今回、別JSON / Schemaファイルは作らない。実装段階でPython dataclass、TypedDict、Pydantic、JSON fixtureのどれにするかを実ファイルとtest責任から決める。

### 12.1 Reception Content Plan v2

#### JSON例

```json
{
  "schema_version": "cocolon.emlis.reception_content_plan.v2",
  "plan_id": "rcp2_000001",
  "source_observation_plan_version": "grounded_observation_plan.current",
  "depth": "layered",
  "sentence_budget": {
    "min": 2,
    "target": 3,
    "max": 4
  },
  "content_units": [
    {
      "unit_id": "cu_01",
      "role": "attention",
      "semantic_signature": "comparison_basis_shift",
      "target_nucleus_ids": ["nucleus_03", "nucleus_07"],
      "support_nucleus_ids": ["nucleus_09"],
      "relation_ids": ["relation_04"],
      "evidence_span_ids": ["thought_02", "thought_04"],
      "required": true,
      "priority": 0.94,
      "allowed_stance_codes": ["notice", "hold_as_meaningful"],
      "forbidden_claim_codes": ["completed_growth", "causal_certainty"]
    },
    {
      "unit_id": "cu_02",
      "role": "connection",
      "semantic_signature": "evidence_recording_action",
      "target_nucleus_ids": ["nucleus_09"],
      "support_nucleus_ids": [],
      "relation_ids": [],
      "evidence_span_ids": ["action_01"],
      "required": false,
      "priority": 0.78,
      "allowed_stance_codes": ["honor_effort"],
      "forbidden_claim_codes": ["success_guarantee"]
    },
    {
      "unit_id": "cu_03",
      "role": "felt_response",
      "semantic_signature": "emlis_reception_of_shift_and_evidence",
      "target_nucleus_ids": ["nucleus_03", "nucleus_07", "nucleus_09"],
      "support_nucleus_ids": [],
      "relation_ids": ["relation_04"],
      "evidence_span_ids": ["thought_02", "thought_04", "action_01"],
      "required": true,
      "priority": 0.90,
      "allowed_stance_codes": ["value", "do_not_dismiss"],
      "forbidden_claim_codes": ["mind_reading", "identity_assertion"]
    }
  ],
  "discourse_constraints": {
    "allowed_strategy_codes": [
      "attention_significance_felt",
      "action_then_meaning"
    ],
    "forbidden_strategy_codes": [
      "flat_input_enumeration"
    ],
    "must_keep_units_separate": [],
    "must_not_causal_link_unit_pairs": []
  },
  "quote_policy": {
    "mode": "optional_single_anchor",
    "max_anchor_count": 1,
    "boundary": "phrase"
  },
  "safety_policy_ref": "existing_grounded_safety_policy",
  "body_free": true
}
```

この例はI6-C01系の意味構造を説明するための設計例であり、runtime固定データやexpected textではない。

#### 必須制約

- `plan_id`は入力本文を含まない。
- `semantic_signature`は汎用構造名でありcase名ではない。
- `evidence_span_ids`は既存resolverで解決できる。
- `content_units`は最大4。
- `felt_response`だけで意味不足を隠さない。
- 完成文、引用本文、ユーザー名を格納しない。

### 12.2 Discourse Candidate Plan v2

```json
{
  "schema_version": "cocolon.emlis.reception_candidate_plan.v1",
  "candidate_id": "rcand_000001_03",
  "content_plan_id": "rcp2_000001",
  "strategy_code": "attention_significance_felt",
  "ordered_unit_ids": ["cu_01", "cu_02", "cu_03"],
  "sentence_groups": [
    ["cu_01", "cu_02"],
    ["cu_03"]
  ],
  "variation_signature": {
    "opening": "semantic_shift",
    "referent": "paraphrase_then_deictic",
    "speaker_presence": "explicit_first_sentence",
    "connection": "contrast_then_parallel",
    "terminal_family": "value_without_overclaim"
  },
  "required_coverage_unit_ids": ["cu_01", "cu_03"],
  "candidate_rank_seed": 3,
  "body_free": true
}
```

`surface_text`はこのJSONへ入れない。完成文はprocess-localで生成し、候補評価後に選択された本文だけを既存Surfaceへ渡す。

### 12.3 Candidate Evaluation v2

```json
{
  "schema_version": "cocolon.emlis.reception_candidate_evaluation.v1",
  "candidate_id": "rcand_000001_03",
  "hard_gate": {
    "status": "passed",
    "failed_codes": []
  },
  "coverage": {
    "required_unit_ids": ["cu_01", "cu_03"],
    "covered_unit_ids": ["cu_01", "cu_03"],
    "missing_unit_ids": []
  },
  "soft_scores": {
    "input_specificity": 0.92,
    "content_distinctness": 0.88,
    "discourse_coherence": 0.91,
    "emlis_presence": 0.87,
    "quote_independence": 0.95,
    "observation_reception_separation": 0.94,
    "lexical_repetition": 0.86,
    "syntactic_variation": 0.82,
    "depth_fit": 0.90,
    "temperature_fit": 0.89,
    "restraint": 0.96
  },
  "total_score": 0.90,
  "selected": true,
  "body_free": true
}
```

score reasonには本文断片を入れず、codeまたはIDだけを使う。

### 12.4 評価コーパスcase

```json
{
  "schema_version": "cocolon.emlis.surface_v2_eval_case.v1",
  "case_id": "dev_daily_positive_001",
  "cohort": "development",
  "family": "daily_positive",
  "input": {
    "thought_text": "<local-only raw input>",
    "action_text": "",
    "emotion_labels": ["喜び"],
    "category_labels": ["生活"]
  },
  "semantic_obligations": [
    {
      "code": "preserve_positive_direction",
      "evidence_ref": "thought_01"
    },
    {
      "code": "notice_specific_change",
      "evidence_ref": "thought_02"
    }
  ],
  "forbidden_claim_codes": [
    "burden_reaction_on_positive_input",
    "causal_certainty",
    "personality_assertion"
  ],
  "allowed_depth": {
    "min": "minimal",
    "max": "focused"
  },
  "expected_text": null,
  "holdout_locked": false
}
```

評価caseに正解文章を置かない。正解文を置くと、Surfaceがその文へ適合するためである。

### 12.5 実装時のSchema選択

実装段階では次の順で判断する。

1. runtime内部だけで完結する契約はfrozen dataclassを優先する。
2. local fixture / receiptとして保存するものだけJSON SchemaまたはPydanticを使う。
3. public API schemaへ新規keyを追加しない。
4. candidate本文をJSON receiptへ保存する必要がある場合はlocal-only artifactに限定する。
5. 同じ責任をdataclassとJSON Schemaへ重複定義しない。

---

## 13. 評価コーパス設計

### 13.1 exact8の位置づけ

exact8は次として固定する。

- 入力identity
- アプリ選択条件
- Evidence・意味・安全・二段表示の回帰
- v1の比較baseline

固定しないもの:

- v2の`Emlisから`完成文
- v1のfull `comment_text` SHAをv2のexpected textにすること
- exact8を見ながらv2文言を調整すること

v1の`expected_local_comment_sha256`は比較用baselineとして保存する。

### 13.2 既存unseen12の位置づけ

既存unseen12は、既に開発・確認で内容を見ているためholdoutではない。

- development / regressionへ移す。
- v2の独立汎化証拠として数えない。

### 13.3 新規baseline

ロードマップの14 familyを対象に、各5件、合計70件を固定する。

| cohort | 1 familyあたり | 合計 | 用途 |
|---|---:|---:|---|
| Development | 3 | 42 | 実装・調整 |
| Holdout A | 1 | 14 | 一回目の独立評価 |
| Holdout B | 1 | 14 | 無変更で行う確認評価 |
| 合計 | 5 | 70 | 初期baseline |

対象family:

1. `low_information_short`
2. `limited_grounding`
3. `daily_unpleasant`
4. `daily_positive`
5. `self_denial`
6. `anger_or_boundary`
7. `uncertainty_support`
8. `standard_state_answer`
9. `structure_question`
10. `long_meaning_arc`
11. `relationship / gratitude / recovery`
12. `change / future intention / transition`
13. `source-unavailable high-information`
14. `history-line eligible input`

`history-line eligible`も今回の生成時には現在入力だけで返す。履歴を利用するP5機能を実装しない。

### 13.4 cohort分離

- Developmentのみ実装中に本文を参照できる。
- Holdout A / Bは別fixtureへ置く。
- v2 freeze前のunit testからHoldoutをimportしない。
- Holdout Aを開いた後、コード・語彙・score weightを変更しない。
- Holdout AとBの間も変更しない。
- どちらかがFAILなら、holdoutへ合わせた修正をせず停止する。

### 13.5 評価caseに固定するもの

- family
- 入力
- 感情・カテゴリ
- 必須保持意味
- 禁止する断定
- 間違えてはいけない極性
- 混ぜてはいけないtopic
- Emlisが反応可能な固有点
- 許容depth
- safety境界

固定しないもの:

- 正解文章
- 正解語尾
- 正解述語
- 一つだけの文数
- v1文との文字列一致

---

## 14. 商品評価と合格条件

### 14.1 絶対条件

Holdout A / Bで次は0件でなければならない。

- 意味逆転
- 感情極性逆転
- 誤因果
- 参照先混同
- 入力外人格・診断・原因・未来
- 自己否定増幅
- 通常入力の応答拒否
- safety境界回帰
- raw body public leak
- case専用route / cue / fixed sentence
- public API / DB / RN contract破壊

### 14.2 ロードマップ商品指標

Blind QAで次を使う。

- `read_feeling >= 0.90`
- `naturalness >= 0.90`
- `non_template >= 0.90`
- `wants_more_input_or_accumulation >= 0.80`を最低ライン
- `wants_more_input_or_accumulation >= 0.90`を商品目標
- `self_blame_non_amplification`は1.0近くではなく、このv2 holdoutでは1.0を要求
- `overclaim_absence`もこのv2 holdoutでは1.0を要求

### 14.3 現行v1とのpaired comparison

各holdout 14件で、case IDを隠してv1 / v2を比較する。

合格条件:

```text
v2が明確に良い: 10 / 14件以上
v1が明確に良い: 1 / 14件以下
同程度: 3 / 14件以下
fatal semantic failure: 0
```

順番による偏りを避けるため、A/B表示順はcase IDから決定論的に交互化する。

### 14.4 Emlisからの内容条件

`focused`以上では、次のうち最低2つが別内容として存在する。

- 入力固有の注目点
- その意味
- 具体行動・変化・不明点との接続
- Emlis自身の受け取り

`layered`では最低3つを目標とする。

同じ意味を三通りに言った場合は一つとして数える。

### 14.5 非テンプレbatch条件

- exact duplicate: 0
- rich input一文終了: 0
- short inputの意味なし水増し: 0
- 主要predicate familyの過集中: Development baseline計測後に上限固定
- terminal stemの過集中: Development baseline計測後に上限固定
- skeleton集中: Development baseline計測後に上限固定

固定上限は実装開始前にbaseline receiptへ記録し、その後変更しない。

---

## 15. 実装順

この章の各Stepは、目的、対象、完了条件、停止条件を持つ。

### Step 0. 設計freeze

#### 目的

この設計書を実装根拠として固定する。

#### 実施

- 入力zip SHAを記録する。
- current source ownerを記録する。
- `REPAIR_REQUIRED`を現在地として固定する。
- exact8、existing unseen12、最新実機画像の位置づけを固定する。
- `外部APIなし / ローカルLLMなし`を固定する。

#### 完了条件

- 実装対象と非対象が明確。
- 変更禁止contractが明確。
- Holdoutを開く時点が明確。

#### 停止条件

- 実装開始時のsourceが今回確認したzipと異なり、差分を確認できない。
- 新しい前提資料が追加され、この設計と衝突する。

---

### Step 1. v1 baseline receipt固定

#### 目的

v2の改善を、現在Surfaceと正しく比較できるようにする。

#### 実施

- exact8のv1 visible text / section hashを保存する。
- existing unseen12と追加probeのv1結果を保存する。
- candidate生成前のruntime latency、sentence count、quote依存、predicate family分布を測る。
- public contract snapshotを保存する。

#### 完了条件

- 同一sourceから再生成可能。
- body-free metadataと可視本文artifactが分離している。
- v1 baselineをv2 expected textにしないことが明記される。

#### 停止条件

- current sourceからbaselineを再生成できない。
- exact8入力identityとfixtureが一致しない。

---

### Step 2. 70件評価コーパス固定

#### 目的

exact8特化を避け、実装と評価を分離する。

#### 実施

- 14 family × 5件を作る。
- Development / Holdout A / Holdout Bへ分ける。
- 正解文ではなくsemantic obligationとforbidden claimを付ける。
- app-validな感情・カテゴリへ拘束する。
- fixture SHAとcohort manifestを固定する。

#### 完了条件

- 70件すべてにfamily、semantic obligation、forbidden claim、depth範囲がある。
- Holdout A/BがDevelopment testから参照されない。
- exact8の言い換えだけでcaseを埋めていない。

#### 停止条件

- family間の差を説明できない。
- 同じ意味構造の表現替えだけでholdoutを作っている。
- 正解文章をfixtureへ置こうとしている。

---

### Step 3. Content Planner v2 contract実装

#### 目的

Emlisが何へ反応するかを、Surfaceより前にbody-freeで決める。

#### 実施

- Content Unit dataclass / validationを追加する。
- 現行nuclei、relations、opportunitiesからContent Planを作る。
- required / optional、priority、forbidden claimを持たせる。
- depthごとのunit数を制限する。

#### 主な対象候補

- `emlis_ai_grounded_observation_plan.py`
- 新規内部module候補: `emlis_ai_grounded_reception_content_plan_v2.py`

新規moduleに分けるか既存moduleへ入れるかは、実装時に循環import、owner責任、test単位を確認して決める。

#### 完了条件

- Development 42件でContent Planを生成できる。
- 完成文を持たない。
- Evidenceへ全unitが解決できる。
- case ID / raw text cueを使わない。

#### 停止条件

- Surface語を増やさないとContent Planを作れない。
- 必要な意味がObservation Planに存在せず、Surfaceで推測しようとしている。
- exact8一件専用のsemantic roleが必要になる。

---

### Step 4. Discourse Candidate Planner実装

#### 目的

同じ内容から複数の読み順・文構成を作る。

#### 実施

- allowed discourse strategyを実装する。
- unit order、sentence group、referent policy、speaker presenceを作る。
- variation signatureで重複候補を除く。
- depth別の候補数上限を守る。

#### 新規module候補

- `emlis_ai_grounded_reception_candidate_plan_v2.py`

#### 完了条件

- 各Development caseで複数のbody-free candidate planが得られる。
- 候補数が上限内。
- stable orderingがある。

#### 停止条件

- 組合せ爆発が起きる。
- ランダムで候補を選ぶ必要がある。
- 候補差が類義語置換だけである。

---

### Step 5. Surface Candidate Generator実装

#### 目的

body-free candidate planを自然な日本語候補へ実現する。

#### 実施

- 現行referent解決、predicate責任、anchor短縮を再利用する。
- v1 Surfaceを壊さず、v2を別ownerとして作る。
- opening、referent、sentence split、speaker presence、terminal familyを変化させる。
- process-local候補本文を生成する。

#### 主な対象候補

- 既存: `emlis_ai_grounded_human_reception.py`
- 新規候補: `emlis_ai_grounded_human_reception_v2.py`

初期実装ではv1を直接置換せず、v2を別moduleにする方を優先する。理由は、offline比較とrollbackを明確にするためである。

#### 完了条件

- Development 42件で候補が生成される。
- 文章が一文単位で文法成立する。
- v1と同じSurfaceしか出ないcaseが分類される。

#### 停止条件

- 完成文bankを大量追加し始める。
- exact8の出力へ似せる変更になる。
- 誤因果を自然な接続詞で隠す。

---

### Step 6. Hard Gate / Selector実装

#### 目的

自然だが誤った候補を採用せず、合格候補から最良を選ぶ。

#### 実施

- Hard Gateを実装する。
- Soft scoreを実装する。
- body-free candidate evaluationを作る。
- stable tie-breakを実装する。
- `v2_no_valid_candidate`を正式なlocal failureにする。

#### 主な対象候補

- 新規: `emlis_ai_grounded_reception_candidate_selector_v2.py`
- 既存: `emlis_ai_grounded_observation_gate.py`への最終contract追加候補

#### 完了条件

- Development 42件でHard Gate結果が説明可能。
- 誤りをSoft scoreで救済しない。
- 本文がmetaへ入らない。

#### 停止条件

- Gate failureを非表示で終わらせる。
- v1 fallbackを使ってv2成功率を水増しする。
- score weightをcaseごとに変える。

---

### Step 7. Development cohort調整

#### 目的

Holdoutを開く前に構造を完成させる。

#### 実施

- 42件でv1/v2を比較する。
- failureを次の三層へ分類する。

```text
A. 意味材料不足
   → Observation / Content Planner

B. 内容はあるが自然文候補がない
   → Candidate Generator

C. 良い候補はあるが選べない
   → Hard Gate / Selector
```

- 文言追加ではなく該当層を修正する。
- 構造的再設計は最大1回。
- score weight、candidate limit、distribution thresholdをfreezeする。

#### 完了条件

- Developmentの絶対条件を満たす。
- roadmap商品指標へ到達する。
- v1より明確に悪いfamilyがない。
- v2 source snapshotと設定をfreezeする。

#### 停止条件

- 同じfailureへ語句・例外を積み続けている。
- 一度の構造的再設計後も改善が出ない。
- Content Plan自体が広い入力で成立しない。

---

### Step 8. Holdout A評価

#### 目的

未使用入力で最初の汎化証拠を得る。

#### 実施

- freeze済みv2を14件へ一度だけ実行する。
- v1/v2 paired blind QAを行う。
- 自動Gateと人読評価を分離する。
- failure本文を見てコード変更しない。

#### 完了条件

- 絶対条件0件。
- 10/14以上でv2優位。
- roadmap商品指標を満たす。

#### 停止条件

- 一項目でもfatal semantic failure。
- 通常入力の拒否。
- v1優位が2件以上。
- Holdout結果へ合わせた修正をしようとする。

---

### Step 9. Holdout B評価

#### 目的

Holdout Aの偶然ではないことを確認する。

#### 実施

- Holdout A後にコード、fixture、weightを変えない。
- 別14件へ一度だけ実行する。
- 同じpaired QAを行う。

#### 完了条件

- Holdout Aと同じ基準を満たす。
- A/B両方で合格。

#### 停止条件

- Holdout A/Bのどちらかが不合格。
- AとBでfamily挙動が大きく逆転する。

不合格時は、holdoutをDevelopmentへ移して修正継続しない。このv2設計を停止し、モデル非使用条件の上限、意味層不足、候補生成方式を再評価する。

---

### Step 10. runtime接続前shadow

#### 目的

public contractを変えず、v2が現行経路へ接続可能か確認する。

#### 実施

- local / test環境でv1とv2を同時生成する。
- publicにはv1だけを返す。
- v2本文はpublic meta・DBへ保存しない。
- latency、fallback率、Gate結果をbody-freeで測る。
- `emlis_ai_grounded_sentence_surface.py`との接続を確認する。

#### 完了条件

- public response、DB write、RN表示に差分がない。
- v2候補生成が既存recoveryを壊さない。
- 性能予算を満たす。

性能予算の絶対ms値は既存資料に書かれていない。Step 1のbaseline計測後、runtime接続前に固定する。候補数は最大12のため、無制限増加は許可しない。

#### 停止条件

- v2本文がmetaまたはDBへ二重保存される。
- public responseが変わる。
- latency予算を固定できない。

---

### Step 11. runtime owner切替

#### 目的

合格済みv2を`Emlisから`の生成ownerにする。

#### 実施

- internal switchでv2を選択する。
- v1をfallbackとして残す。
- API key、DB、RNを変えない。
- final selected textだけを既存two-stage Surfaceへ渡す。
- fallback使用をbody-free codeで記録する。

#### 対象候補

- `emlis_ai_grounded_sentence_surface.py`
- `emlis_ai_reply_service.py`
- `emlis_ai_grounded_observation_gate.py`

#### 完了条件

- relevant backend regression green。
- exact8の観測・安全・二段契約green。
- public contract diff 0。
- v2 fallback率が受入値以下。

fallback率の受入値はStep 10のshadow結果から固定する。既存資料に値は書かれていないため、事前に推測で数値化しない。

#### rollback

次のいずれかでv1 ownerへ戻す。

- semantic fatal 1件
- self-denial / safety回帰
- normal input rejection
- body leak
- public contract差分
- runtime exception増加
- 実機でv2が明確にv1より悪い

DB migrationがないため、owner switchだけでrollbackできる構造を維持する。

---

### Step 12. 実機確認

#### 順序

```text
代表4件
  ↓
exact8
  ↓
Holdoutから選ぶ新規代表4〜6件
```

#### 代表観点

- short inputを水増ししていない。
- positive inputへ苦しさの反応をしていない。
- long inputを列挙要約していない。
- mixed topicを混ぜていない。
- Emlisからが入力固有の内容を持つ。
- 見えたことの言い直しだけではない。
- 画面で読みたい量になっている。
- clipping / scroll /重なりがない。

#### Mash側実機負担

Development途中の候補確認をMashへ戻さない。

Mashの実機確認は、local / holdout / contractが合格した後だけにする。

---

### Step 13. 二段量・表示比率調整

#### 前提

自然文v2が合格する前に長文化しない。

#### 初期目安

| family | 見えたこと | Emlisから |
|---|---:|---:|
| low information short | 40〜50% | 50〜60% |
| daily unpleasant / positive | 20〜35% | 65〜80% |
| self denial / uncertainty | 30〜45% | 55〜70% |
| rich change / long arc | 35〜55% | 45〜65% |
| structure question | 55〜70% | 30〜45% |

これは文字数を機械的に合わせるHard Gateではなく、商品読感のQA目安である。

#### 実施順

1. `Emlisから`の意味密度を確認する。
2. 重複のない2〜4文を許可する。
3. `見えたこと`の引用・再掲を圧縮する。
4. Observation意味coverageを失っていないか確認する。
5. 必要ならRNの視覚強調を別設計で検討する。

初期v2で`Emlisから`を先頭へ移さない。まず内容と量を改善し、その後にUI順序が本当に問題かを実機で判断する。

---

## 16. テスト設計

### 16.1 Unit

- Content Unit validation
- Evidence resolution
- depth / unit budget
- discourse strategy validation
- sentence grouping
- variation signature dedupe
- candidate count upper bound
- stable ordering
- Hard Gate各項目
- Soft score deterministic
- stable tie-break
- body-free evaluation

### 16.2 Contract

- `/emotion/submit` key不変
- `input_feedback.comment_text`不変
- `observation_status`不変
- DB write path不変
- RN visible contract不変
- two-stage split不変
- raw body meta leak 0
- v1 fallback成立

### 16.3 Regression

- exact8 input identity
- exact8 observation section semantics
- self-denial boundary
- safety adjacent response
- low information non-inflation
- source-unavailable recovery
- current recovery sequence
- relevant backend suite

### 16.4 Product QA

- Development 42
- Holdout A 14
- Holdout B 14
- exact8 8
- existing unseen12
- current probe cases

同一caseを繰り返したsame16はdeterminism確認には使うが、汎化件数として数えない。

### 16.5 Failure taxonomy

すべてのFAILに一つ以上のcodeを付ける。

```text
SEMANTIC_MATERIAL_MISSING
CONTENT_PRIORITY_WRONG
POLARITY_INVERTED
FALSE_CAUSAL_LINK
REFERENCE_SCOPE_MIXED
UNKNOWN_BOUNDARY_LOST
SELF_DENIAL_AMPLIFIED
NO_VALID_CANDIDATE
CANDIDATE_SURFACE_UNNATURAL
SELECTOR_CHOSE_INFERIOR
OBSERVATION_REPLAY
INPUT_ENUMERATION
SHORT_INPUT_INFLATED
RICH_INPUT_COLLAPSED
PUBLIC_CONTRACT_REGRESSION
BODY_LEAK
PERFORMANCE_BUDGET_EXCEEDED
```

自由記述だけで失敗を処理しない。

---

## 17. 実ファイル影響候補

実装段階で実際の責任とimportを確認し、必要最小限に決める。以下は設計上の候補であり、今回作成しない。

| ファイル | 初期方針 | 変更理由 |
|---|---|---|
| `emlis_ai_grounded_observation_plan.py` | 条件付き変更 | 汎用的な意味材料が不足する場合だけ |
| `emlis_ai_grounded_human_reception.py` | v1保持 | baseline / fallback ownerとして残す |
| `emlis_ai_grounded_human_reception_v2.py` | 新規候補 | v2 candidate surfaceをv1から分離 |
| `emlis_ai_grounded_reception_content_plan_v2.py` | 新規候補 | Content Plan責任を分離 |
| `emlis_ai_grounded_reception_candidate_plan_v2.py` | 新規候補 | body-free discourse候補 |
| `emlis_ai_grounded_reception_candidate_selector_v2.py` | 新規候補 | Hard Gate / Soft Selector |
| `emlis_ai_grounded_sentence_surface.py` | 合格後のみ | selected v2 surfaceをtwo-stageへ接続 |
| `emlis_ai_grounded_observation_gate.py` | 合格後最小変更 | final contract追加 |
| `emlis_ai_reply_service.py` | 合格後のみ | runtime owner switch / fallback |
| `tests/local_only/...` | 追加候補 | baseline、corpus、A/B、holdout |
| `ai/docs/...` | 実装時追加 | receipt、結果、進行判断 |

RN、DB、route、subscription関連ファイルは対象外である。

---

## 18. Rollback / fail-closed

### 18.1 実装前

v1がproduction ownerであり続ける。v2はofflineのみ。

### 18.2 runtime接続後

- v2 selected candidateがHard Gateを通らない場合はv1へfallbackする。
- v1も既存Gateを通らない場合は既存recovery sequenceへ進む。
- empty `comment_text`を通常の成功として扱わない。
- fallback使用を商品PASSへ数えない。

### 18.3 即時rollback条件

- safety / self-denial fatal
- public body leak
- API / DB / RN contract差分
- normal inputの無応答増加
- 実機で意味逆転
- runtime exception
- candidate generationの非決定性

### 18.4 方式停止条件

次の場合、語彙追加へ逃げず、モデル非使用条件を含めて方式再判定する。

- Developmentで一度の構造的再設計後も改善が出ない。
- Holdout AまたはBが不合格。
- v2がv1より明確に良いcaseが10/14へ届かない。
- rich inputの固有点をContent Planへ出せない。
- 良い候補生成ができてもSelectorが安定しない。
- 候補数を増やさないと品質が上がらず、計算量が制御できない。

---

## 19. 主なリスクと対処

### 19.1 ルールの組合せ爆発

**リスク:** 自作NLGが巨大な例外集になる。

**対処:** candidate上限12、汎用strategy限定、variation signature dedupe、case cue禁止。

### 19.2 自然だが意味が間違う

**リスク:** 表現改善が誤因果や感情逆転を隠す。

**対処:** Soft Selector前のHard Gate、Evidence resolution、relation direction、polarityを絶対条件にする。

### 19.3 exact8再過適合

**リスク:** 現在見ている8件の文章だけがよくなる。

**対処:** exact8は回帰専用、70件分離、Holdout A/Bをfreeze後に一度だけ実行する。

### 19.4 Emlisからの長文化による水増し

**リスク:** 同じ意味を言い換え、長いテンプレになる。

**対処:** Content Unit数と異なる意味責任を先に固定し、文数は後から決める。

### 19.5 見えたこととEmlisからの重複

**リスク:** 二段とも入力の言い直しになる。

**対処:** `section_role_distinctness`をHard Gateへ入れ、EmlisからにはEmlisの受け取りを必須化する。

### 19.6 Selectorの自己目的化

**リスク:** scoreを上げるための文章になる。

**対処:** scoreはroadmap商品軸へ結び、Holdoutの人読paired QAを最終条件にする。

### 19.7 Mashの実機負担増

**リスク:** 候補ごとに実機確認を要求する。

**対処:** Development、Holdout、contractをlocalで終え、代表4件以降だけ実機へ渡す。

---

## 20. 現在の判断区分

### 確認済み

- 現行Emlisは固定完成文返却ではなく、意味核・act・referent・predicateを組み立てている。
- 一文単位の日本語は自然に近い地点へ来ている。
- 複数入力を並べると反応act、述語、骨格の範囲が見え、テンプレ感が残る。
- 最新実機では`見えたこと`が主量となり、`Emlisから`の意味量が不足するcaseがある。
- exact8はlocal technical Gateを通っているが、資料自身が実機・商品読感PASSを意味しないと明記している。
- public API、DB write path、RN表示条件を変える必要はない。
- 外部API・ローカルLLMを使わずに、Content Plan + 複数候補 + Selectorを試す余地がある。

### 未確認

- v2がHoldout A/Bで商品指標へ届くか。
- 現行nuclei / relationsだけで必要なContent Planを作れるか。
- 最大12候補で十分な自然さが出るか。
- Selectorが人読の優位候補を安定して選べるか。
- runtime性能予算。
- v2を実機で読んだMashの評価。
- 文章量を増やしたときの読了感、疲労、再入力意向。
- 実際の一般ユーザー評価、課金意向、継続率。

### 書かれていない

既存資料には次の固定値が書かれていない。

- v2の正式module名。
- candidate数。
- Selector weight。
- quote絶対文字数上限。
- runtime latency上限。
- fallback率上限。
- v2とv1の正式切替flag名。
- Holdoutの具体本文。
- `Emlisから`の固定文字数。

この設計ではcandidate最大12、70件cohort、二つのholdoutを設計判断として採用する。その他の数値はbaseline計測後、Holdoutを開く前に固定する。

### 推測禁止

現時点では次を断定しない。

- v2を作れば必ず商品品質へ届く。
- 語彙量を増やせば自然になる。
- 候補数を増やせば自然になる。
- 文章を長くすればユーザーが読む。
- exact8がgreenなら汎化している。
- v2が失敗すればCocolon全体が不可能。
- v2が成功すれば必ず売れる。
- 外部モデルなしでは絶対に自然文を作れない。
- 外部モデルを使えば自動的にCocolonらしくなる。

### 次に実行すべきこと

実装指示を受けた場合、最初の作業単位は次である。

```text
Step 0: この設計とsource snapshotの照合
Step 1: v1 baseline receipt固定
Step 2: 70件評価コーパスとcohort manifest固定
```

この三つを完了するまでproduction codeへv2を接続しない。

その後、Content Planner v2、Candidate Planner、Surface Generator、Hard Gate / Selectorの順に進む。

---

## 21. 華恋の最終判断

現在のEmlisAIは、自然文生成の出発点にすら届いていない状態ではない。一文単位の自然さ、安全な受け取り、入力根拠を守る土台はすでにある。

不足しているのは、語句の総量だけではない。

- 入力固有の何を受け取るか。
- 複数の意味をどう並べるか。
- 同じ意味からどの自然な言い方を選ぶか。
- 自然でも誤った文章をどう捨てるか。

この四つである。

そのため、現在の土台を捨てずに、自作自然文生成の第二段階へ進む判断は妥当である。

ただし、この方式を無期限に磨き続けない。Developmentで一度の構造的再設計を許可し、その後は二つの独立Holdoutで判定する。届かなければ、語句や例外を積まずに止まる。

この停止条件まで含めて、Cocolon完成へ接続する実装計画とする。
