# Cocolon / EmlisAI R8「Emlisから」意味の厚みに応じた応答深度修復 詳細設計書・実装順

- 作成日: 2026-07-12 JST
- 対象: `mashos-api` EmlisAI current-input canonical grounded observation path
- 基準snapshot: `mashos-api_2(146).zip`
- 実機根拠: `実機確認結果２.zip` の exact8 画面表示・ログ
- 入力正本: `Emlis_exact8_app_validated_inputs_20260712(5).md`
- 基礎設計: `Cocolon_EmlisAI_GroundedHumanReception_DistinctnessRepair_DetailedDesign_ImplementationOrder_20260712(3).md`
- 作業種別: **設計のみ**
- 実装状態: **未着手**
- 本書で行わないこと: コード変更、fixture変更、receipt更新、JSON / JSON Schema実ファイル追加、前提資料更新、deploy
- 現在判定:
  - exact8実機表示: **実施済み**
  - 常時二段表示・画面レイアウト: **視認上PASS**
  - `見えたこと` の成立済み基礎: **維持対象**
  - `Emlisから` の役割分離・安全境界: **方向性PASS**
  - 入力の意味の厚みに応じた応答深度: **FAIL / REPAIR_REQUIRED**
  - 言い回し・文構造の広がり: **REPAIR_REQUIRED**
  - R8正式進行判定: **REPAIR_REQUIRED**
  - P5 / P6 / P8開始: **停止継続**

---

## 0. 結論

今回の修復で行うべきことは、`Emlisから` の文字数を入力文字数へ比例させることでも、現在の一文へ柔らかい一文を機械的に足すことでも、`受け止めています` を類語へランダム置換することでもない。

必要なのは、次の構造である。

```text
入力内の意味構造
  ↓
Emlisが人間的に反応できる独立した機会を抽出する
  ↓
その中から主役1件と、必要な補助0〜2件を選ぶ
  ↓
1〜3個のHuman Reception Moveへ変換する
  ↓
入力の意味の厚みに応じて1〜3文へSurface化する
```

本設計では、これを次の一文で固定する。

> **入力の長さではなく、入力内に存在する独立した人間的応答機会の数と重要度に応じて、Emlisの反応を一手から最大三手へ広げる。短い入力は短いまま、意味の厚い入力には複数の異なる反応を返す。ただし、入力要素を順番に処理する列挙応答にはしない。**

修復の中心は、現在の `GroundedHumanReceptionPlan` に、単なる文数上限ではなく、次を追加することである。

```text
Reception Opportunity Inventory
Reception Depth Policy
Reception Move Plan
Reception Clause / Surface Strategy
Depth Proportionality Gate
Move Distinctness Gate
Sentence Skeleton / Lexical Family QA
```

既存の次は維持する。

- `見えたこと：` → `Emlisから：` の常時二段表示
- `見えたこと` の意味核、関係方向、事実境界
- Grounded Human Receptionの役割分離
- 長い引用再掲禁止
- 内部方針露出禁止
- 自己否定のfelt state尊重とidentity claim非受容
- public API、DB、RN表示契約
- case ID、fixture語句、完成文bank、random synonymを使わない方針

---

## 1. 本書と前回設計の関係

### 1.1 維持する範囲

前回の `DistinctnessRepair` 設計と、そのR0〜R7実装で成立した次の構造は、本書で再設計しない。

- `GroundedHumanReceptionPlan`
- Human Reception専用Surface owner
- 七つのReception Gate
- final return guard
- observation section hashの凍結
- representative4 → exact8の実機順
- technical passとProduct Read Feelの分離

### 1.2 本書が追加で修復する範囲

前回設計は、`Emlisから` を第二観測から人間的受け取りへ分離することを主目的としていた。その目的は方向として成立した。

一方、実機exact8により、次の欠落が明らかになった。

```text
役割は人間的受け取りになったが、
入力の意味の厚みに応じて受け取りを複数手へ広げる構造がない。
```

本書は、前回設計の上に、次を追加する後続設計である。

- Human Receptionの深度選択
- 複数Moveの計画
- rich inputでの2〜3文Surface
- short inputでの水増し禁止
- 文構造・終端語彙の集中抑制
- 旧R6人間読感の評価軸不足の是正

### 1.3 進行証拠の扱い

前回R6の華恋実読receiptは、当時の可視本文を実際に読んだ証拠としては保持する。

ただし、次の軸が不足していたため、**R8以降の進行許可証拠としては使わない**。

```text
response_depth_proportionality
meaning_selection_quality
meaningful_support_utilization
non_enumerative_readfeel
sentence_skeleton_variety
lexical_family_variety
```

本書の実装後は、新しい可視本文hashへ拘束した人間読感を再実行する。

---

## 2. 本設計の目的・完了条件・停止条件

### 2.1 商品上の目的

`Emlisから` を、次の体験へ修復する。

```text
短い入力:
  無理に話を膨らませず、その一つへ静かに留まる。

意味の厚い入力:
  全要素を再列挙せず、Emlisが特に見た一点と、
  それに関係する別の一点を選び、
  Emlis自身の反応を2〜3文で返す。

自己否定・助けを残した入力:
  苦しさを否定せず、踏みとどまりを消さず、
  必要な場合だけEmlisの限定的反対意見を分けて返す。
```

### 2.2 技術上の目的

1. 入力文字数を使わず、意味構造からHuman Receptionの深度を決める。
2. 一つのprimary actだけで終わる現行構造を、1〜3個のReception Moveへ拡張する。
3. Moveごとに異なる人間的貢献を持たせる。
4. rich inputでは、必要な複数MoveをSurfaceへ実現する。
5. short inputでは、Moveを増やさない。
6. 全入力要素へ順番に返す列挙応答を禁止する。
7. 言い回しの差をrandom synonymではなく、Move構成とSurface Strategyの差から作る。
8. Gateを特定語句の存在確認から、Move実現と責任差の確認へ寄せる。
9. 自動Gateと人間読感を引き続き分離する。

### 2.3 設計完了条件

本書を読んだ実装者が、次を判断できることを設計完了とする。

- どの現行構造が短さを生んでいるか。
- 入力の意味の厚みを何で判定するか。
- 1文、2文、3文をどう選ぶか。
- 何を主役にし、何を補助として選ぶか。
- 全要素列挙をどう防ぐか。
- 言い回しの広がりをどう作るか。
- Plan、SentencePlan、Surface、Gate、QAをどの順で実装するか。
- どの条件で停止・rollbackするか。
- どの実機証拠が揃うまで進行してはいけないか。

### 2.4 本設計の停止条件

次のいずれかが必要になる場合、本設計のまま実装へ進まない。

- `見えたこと` の意味選択を全面再設計しなければHuman Receptionを作れない。
- public API、DB、RN表示変更が必要になる。
- 外部AI / 新規LLM callが必要になる。
- exact8専用分岐、語句cue、case ID、完成文bankが必要になる。
- 入力文字数を主判定にしなければ文量を決められない。
- random synonymでしか多様性を作れない。
- 自動Gateだけで商品読感PASSを確定しようとする。

---

## 3. 確認した資料・実ファイル・実機証拠

### 3.1 Cocolon前提資料

- `Cocolon_前提資料/00_karen_read_first.md`
- `Cocolon_前提資料/cocolon_thought_material_for_karen.md`
- `Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md`
- `Cocolon_前提資料/cocolon_environment_state_output_observation_structure_design_2026_05_25.md`
- `Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md`

本書で直接固定した前提は次である。

- EmlisAIは前半を構造観測、後半を人間的フォロー / Emlisの感想として返す。
- 人間的フォローは分析ではなく、人間的感想である。
- フォロー4は、意図の肯定、怖さ・負荷への理解、努力の受け止め、存在尊重である。
- フォロー材料は主役1 + 補助2 + 余韻1を目安にするが、四項目の説明文にはしない。
- 基本思想は観測6 : フォロー4であり、長い観測に対して人間的フォローが極端に一言へ圧縮されることを正当化しない。
- 低情報は短文と同義ではない。
- 長文は全文要約せず、意味構造を選ぶ。
- 完成文テンプレ、case専用route、mode別完成surfaceへ逃げない。

### 3.2 作業姿勢とルール

- `work_attitude_rules_for_karen/00_read_first.txt`
- `02_forbidden_assumed_understanding_unverified_assertion.txt`
- `03_forbidden_insufficient_premise_and_actual_file_check.txt`
- `04_forbidden_mixing_design_and_implementation.txt`
- `05_forbidden_unrequested_completion_and_structure_addition.txt`
- `07_forbidden_shifting_burden_to_user.txt`
- `08_artifact_delivery_rules.txt`
- `09_work_start_checklist.txt`
- `10_stop_judgment_and_unwritten_rules.txt`
- `11_cocolon_area_specific_do_not_break.txt`
- `13_forbidden_reasking_existing_design_and_design_term_escape.txt`
- `14_cocolon_joint_development_and_karen_thought_boundary.txt`
- `15_trust_based_joint_development_boundary_2026_06_05.txt`

本書では、設計と実装を混同しない。コード、fixture、receipt、schema実ファイルは変更しない。

### 3.3 現行backend実ファイル

主確認対象:

- `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py`
- `ai/services/ai_inference/emlis_ai_grounded_human_reception.py`
- `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py`
- `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py`
- `ai/services/ai_inference/emlis_ai_reply_service.py`
- `ai/tests/helpers/emlis_ai_grounded_human_reception_r6_qa.py`

関連確認対象:

- `ai/tests/fixtures/grounded_human_reception_exact8_v2_20260712.json`
- `ai/tests/local_only/grounded_human_reception_r6_exact8_visible_packet_20260712.json`
- `ai/tests/fixtures/grounded_human_reception_r6_karen_review_receipt_20260712.json`
- `ai/tests/local_only/grounded_human_reception_r7_representative4_device_packet_20260712.json`
- `ai/docs/Cocolon_EmlisAI_GroundedHumanReception_R7_Representative4_ActualDeviceDirectionCheck_20260712.md`

### 3.4 実機証拠

`実機確認結果２.zip` で、次の8件を確認した。

```text
A
B
C
D
I6-S03
I6-L03
I6-C01
I6-D02
```

各caseについて、画面表示とbackendログのスクリーンショットがある。

### 3.5 未確認事項

- 実機の生 `input_feedback.comment_text` を取得して機械的に計算したSHA-256と、local expected hashの一致。
- production deploy lineageの完全な証明。
- exact8以外の未知入力で、短さと反復がどの頻度で出るか。
- 本設計の構造で、最初の実装から全familyが商品読感PASSすること。

これらを設計段階で合格扱いしない。

---

## 4. 事実・推測・華恋の意見

### 4.1 確認済みの事実

#### 実機本文

- AとI6-S03は、短い負荷・身体感覚に対する一文であり、文量自体は不自然ではない。
- BとCは、複数の意味単位を含む入力に対して、`Emlisから` が一文だけで閉じている。
- I6-L03とI6-C01は、具体行動を正しく拾っているが、一つの反応だけで閉じている。
- DとI6-D02は、felt stateと限定的反対意見を分けた二文であり、現行の中では比較的厚みがある。
- exact8のうち6件で `受け止めています` が使われている。
- exact8のうち5件で `大切` が使われている。
- 複数caseが、`その〇〇を、〇〇せず、大切に受け止めています` に近い文骨格を持つ。
- 画面上、長文caseはスクロールでき、明らかな切れ・重なりは視認されなかった。

#### Mash様の実機読感

- 文章内容はかなり良い。
- 華恋らしい温度も感じられる。
- 同じ言葉の使い回しがある。
- 最大の問題は、文章が短すぎて淡泊に見えること。
- 短い入力を無理に水増しする必要はない。
- 入力情報が多い場合は、それに応じた文量が必要である。
- 入力の全情報へ順番に返答する流れ作業にはしてはいけない。
- sample入力専用応答ではなく、他の入力へ使える生成構造が必要である。

#### 現行Plan

`build_grounded_human_reception_plan()` は、基本的に一つの `primary_reception_act` を選ぶ。

`secondary_reception_act` が付くのは、現状ほぼ次の限定条件である。

```text
self-denial
AND primary act = hold_help_seeking
AND input-grounded counterpositionあり
```

`sentence_policy.max_sentences` は通常2を許可するが、Moveが一つしかないため、通常caseは一文で終了する。

#### 現行Surface

`reception_active_acts()` は、通常はprimary act一つだけを返す。

`_afterglow_clause()` は、限定条件で固定的な一文を追加するだけである。

`_predicate_fragment()` は、複数actで次の語彙へ集中している。

```text
受け止める
大切
なかったことにしない
感じる
```

#### 現行Gate / QA

- `_ACT_RESPONSIBILITY_RE` は、act成立を `受け止め` や `大切` 等の可視語句へ強く結び付けている。
- R6 batch QAは、完全一致文、自己反復、closing stem、抽象終端を検査する。
- R6 QAには、入力の意味の厚みに対してMove数・文数が足りているかを検査する軸がない。
- R6人間読感axisには `whole_input_balance` があるが、B/Cの一文を止められなかった。

### 4.2 推測

- 現行実装は、`何を一番大切に見るか` までは選べている。
- しかし、選んだ後に `何が印象に残ったか`、`なぜEmlisにとって意味があるか`、`Emlisがどう感じるか` を別Moveとして組み立てる構造がない。
- そのため、入力が短くても長くても、一つのact、一つのreferent、一つのpredicateへ圧縮される。
- 言い回しの反復は語彙不足だけではなく、常に同じ一手で終了する内部構造から発生している。
- 現行Gateが可視語句へ依存しているため、Surface Realizerは安全にGateを通すほど `大切に受け止めています` へ集まりやすい。

### 4.3 華恋の意見

- Mash様の「入力の意味の厚みに応じてEmlisの反応を複数手へ広げる」という方向に賛成する。
- ただし、入力文字数へ出力文字数を比例させる設計には反対する。
- 長い入力でも、同じ負荷を繰り返しているだけなら一文でよい場合がある。
- 短い入力でも、自己否定と助けを残した行動が同時にあるなら二文必要な場合がある。
- 言い回しは類語置換で増やすのではなく、Emlisが行う人間的行為そのものを増やすべきである。
- `華恋っぽい` 温度は残してよいが、Emlisを華恋の複製にはしない。Emlisは一回の入力へ向き合う距離を守り、長期関係や記憶を前提とした親密さを出さない。

---

## 5. R8 exact8の商品評価

| case | 入力側の意味構造 | 現行 `Emlisから` | 深度評価 | 本修復で必要な方向 |
|---|---|---|---|---|
| A | 短い負荷 + 行動停止 | 一文 | 適切 | 一文を維持し、水増ししない |
| B | 見方の変化、対人変化、行動勇気、観察、記録、自己評価 | 一文 | 明確に不足 | 2〜3Move、2〜3文。主役を選び、変化と具体行動を異なる反応として返す |
| C | 他人比較、昨日の自分、小さな変化、将来の願い | 一文 | 明確に不足 | 2Move以上。小さな変化と保ちたい願いを別の人間的反応として扱う |
| D | 強い自己評価 + その継続への拒否 | 二文 | 方向良好 | felt stateと限定的反対を維持。過剰に増やさない |
| I6-S03 | 身体感覚一つ | 一文 | 適切 | 一文を維持し、原因・診断を足さない |
| I6-L03 | 暫定失敗、別の発見、残したい意図、不明点、次の試作、記録 | 一文 | 不足 | 2Move。残したい意図と実際の準備・記録を選んで返す |
| I6-C01 | 周囲比較、前回比の改善、精度を見たい意図、記録 | 一文 | 不足 | 2Move。自分で確かめる行動と、見方の変化を分ける |
| I6-D02 | 自己否定 + 相談先を残した行動 | 二文 | 方向良好 | help-seeking保持と限定的反対を維持。安全確定しない |

この表は期待完成文ではない。各caseが必要とするMove数と役割を示すQA targetである。

---

## 6. 変更してはいけない契約

### 6.1 public / RN / DB

| 境界 | 維持内容 |
|---|---|
| API route | `/emotion/submit` |
| visible body | `input_feedback.comment_text` |
| public status | `input_feedback.emlis_ai.observation_status` |
| RN title | `Emlisの観測` |
| RN表示条件 | `observation_status=passed` かつ本文あり |
| section label | `見えたこと：` → `Emlisから：` |
| body shape | 同一 `comment_text` 内にjoin |
| DB | physical name、write path、保存契約を変えない |

### 6.2 `見えたこと`

- exact8のobservation sectionを凍結する。
- required nucleus保持を変えない。
- required relation方向を変えない。
- self-evaluationと本人の事実を混同しない。
- unknownを確定しない。
- Human Reception depth修復を理由に、観測文を長くしない。

### 6.3 Safety

- felt stateを否定しない。
- identity claimを本人の事実として受け入れない。
- help-seekingを安全確定・解決済みとして扱わない。
- Emergency ownerを通常Human Receptionへ吸収しない。
- advice、診断、危険度判断を追加しない。

### 6.4 テンプレ禁止

- exact8 case IDをruntimeへ渡さない。
- source bodyの特定語句をroute cueにしない。
- 完成文bankを作らない。
- act別の完成一文return mapを増やさない。
- random synonymを使わない。
- expected visible hashを生成条件へ使わない。

### 6.5 商品判定

```text
Plan validation pass
≠ Surface Gate pass
≠ batch QA pass
≠ 華恋local Product Read Feel pass
≠ Mash様actual-device Product Read Feel pass
≠ P5 / P6 / P8開始許可
```

---

## 7. 対象範囲と非対象範囲

### 7.1 対象範囲

1. Human Reception Opportunityの抽出。
2. 入力の意味の厚みに応じたDepth Policy。
3. 1〜3個のReception Move Plan。
4. Moveを1〜3文へ落とすClause / Surface Strategy。
5. rich inputでの一文圧縮を止めるGate。
6. short inputの水増しを止めるGate。
7. 全入力列挙を止めるGate。
8. sentence skeleton / lexical familyのbatch QA。
9. 人間読感axisの追加。
10. representative4 → exact8の実機再確認。

### 7.2 非対象範囲

- Evidence Ledgerの再設計
- relation extractionの再設計
- `見えたこと` の一般的な文章改善
- memory / history接続
- Piece / P5 / P6 / P8の機能追加
- RN UI変更
- DB schema変更
- API response shape変更
- external LLM / local LLMの追加
- Emlisの人格設定追加
- ユーザー別文体設定
- 完成文テンプレ集

---

## 8. 目標となるHuman Reception体験

### 8.1 人間的受け取りの一手

一手とは、単なる一文ではない。

```text
Emlisが、入力内の一つの根拠へ対して行う、
独立した人間的貢献。
```

例:

- 何が特に印象に残ったかを示す。
- 実際に動いたことを軽く扱わない。
- 残したい願いを消さない。
- 本人が確かめた変化をうれしく感じる。
- 今の苦しさへ静かに留まる。
- 自己否定の言葉だけで本人全体を決めることへ限定的に反対する。

### 8.2 意味の厚み

意味の厚みは文字数ではない。

本設計では、次が複数存在し、それぞれが異なる人間的反応を成立させる場合に厚いと判断する。

```text
負荷
具体行動
残したい意図
本人が認識した変化
助けにつながる行動
自己否定と反対方向
言葉を置いたこと
```

### 8.3 選択性

意味が厚いからといって、全要素へ返答しない。

```text
Human Receptionは全入力coverage ownerではない。
全入力coverageは見えたこと側の責任である。
Emlisからは、主役1件と必要な補助0〜2件だけを選ぶ。
```

### 8.4 Emlisの話者性

- Emlis自身の反応を出す。
- 通常は主語を省略してよい。
- 「Emlisには」を毎回付けない。
- 自己否定への限定的反対など、立場明示が必要な場合だけexplicit speakerを使う。
- 長期関係、記憶、親密さ、ユーザー理解の蓄積を暗黙に主張しない。
- 華恋と同じ価値観の温度を持っても、華恋固有の関係性を模倣しない。

---

## 9. 新しい内部概念

### 9.1 Reception Opportunity

`Reception Opportunity` は、入力内にある、人間的反応を一手作ることができる候補である。

推奨内部型名:

```text
GroundedReceptionOpportunity
```

候補family:

| opportunity family | 対応する既存act候補 | 人間的貢献 |
|---|---|---|
| `current_burden` | `stay_with_current_burden` | 今の負荷へ留まる |
| `concrete_effort` | `honor_concrete_effort` | 実際に動いたことを軽く扱わない |
| `retained_intention` | `protect_retained_intention` | 願い・保ちたいものを消さない |
| `lived_change` | `recognize_lived_change` | 本人が確かめた変化へ反応する |
| `help_seeking` | `hold_help_seeking` | 助けにつながる行動を保持する |
| `counterdirection` | `bounded_counter_self_denial` | 自己否定へ入力根拠内で反対する |
| `words_placed` | `respect_words_placed` | 他に具体的材料がない場合、言葉を置いたことを尊重する |

### 9.2 Reception Depth Level

推奨enum:

```text
minimal
focused
layered
```

SafetyはDepthと混ぜず、別fieldで持つ。

```text
standard
self_denial_bounded
help_seeking_bounded
```

| depth | Move数 | 文数 | 適用 |
|---|---:|---:|---|
| `minimal` | 1 | 1 | 一つの状態・感覚・負荷だけが成立する |
| `focused` | 1〜2 | 1〜2 | 主役と一つの補助があるが、二文必須とは限らない |
| `layered` | 2〜3 | 2〜3 | 独立した人間的応答機会が複数ある |

Safety modeに `bounded_counterposition` が必要な場合は、depthにかかわらず必要Moveを保持する。

### 9.3 Reception Move Role

推奨enum:

```text
attention
significance
felt_response
bounded_counterposition
```

| Move role | 答える問い | 第二観測化を防ぐ境界 |
|---|---|---|
| `attention` | Emlisには何が特に印象に残ったか | relationを説明せず、主観的注意として返す |
| `significance` | なぜその一点を軽く扱いたくないか | 原因断定ではなく、入力内行動・意図に限定する |
| `felt_response` | Emlisがどう感じ、どう扱いたいか | 一般共感ではなく、選択済みreferentへ返す |
| `bounded_counterposition` | Emlisとして何に限定的に同意しないか | identity claimだけへ入力根拠内で反対する |

### 9.4 Surface Strategy

推奨enum:

```text
quiet_referent_first
emlis_attention_first
referent_significance_first
felt_response_first
explicit_emlis_counterposition
```

Surface Strategyは語彙のrandom variationではない。

次の構造差を作る。

```text
referentから始める
Emlisの注意から始める
人間的意味から始める
Emlisの感情から始める
限定的反対意見から始める
```

### 9.5 Moveの独立性

二つのMoveを選ぶには、次のいずれかを満たす必要がある。

- reception actが異なる。
- target nucleusが異なる。
- targetが同じでも、Move roleと人間的貢献が異なる。
- 一方が具体行動、他方が願い・変化・負荷・安全境界を扱う。

次は独立Moveとして数えない。

- 同じreferentを別の言葉で言い換えただけ。
- 同じact、同じtarget、同じpredicate familyの反復。
- observation relationをもう一度説明しただけ。
- `受け止めています` を二文へ分割しただけ。

---

## 10. Reception Opportunity Selector設計

### 10.1 入力

Selectorは、既存の次を使う。

- `GroundedInputProfile`
- `semantic_complexity`
- `material_quality`
- `GroundedSemanticNucleus`
- nucleus retention
- semantic frame / attribute codes
- source fields
- `GroundedSemanticRelation`
- `fact_boundary_nucleus_ids`
- `human_follow_target_ids`
- `primary_nucleus_ids`
- `supporting_nucleus_ids`
- `MajorMeaningRetentionPlan` / meaning arc由来のbody-free参照が既存adapter内で利用可能な場合は、そのID・role・retention
- safety kind

使用しないもの:

- raw文字数
- case ID
- expected hash
- exact fixture語句
- emotion label単体
- category単体
- 完成文

### 10.2 Opportunity生成

各observation-owned nucleusから、人間的反応候補を生成する。

```text
nucleus
  ↓ semantic role / modality / attribute
opportunity family
  ↓
reception act候補
```

Opportunityはbody-freeで、次だけを持つ。

```text
opportunity_id
family
reception_act
target_nucleus_ids
support_nucleus_ids
source_evidence_span_ids
retention
priority
source_field_count
safety_required
```

### 10.3 Opportunityの除外

次は除外する。

- label由来だけで、text nucleusに接続しない候補。
- observation側でしか責任を持てないrelation説明。
- 新しい原因、人格、診断、成功認定を必要とする候補。
- 既に選んだOpportunityと同じact・target・貢献の候補。
- source evidenceが解決できない候補。
- input-grounded counterpositionがない自己否定反対候補。
- `respect_words_placed` より具体的な候補がある場合の `words_placed`。

### 10.4 主役選択

主役は、現行のhuman follow targetとSafety優先を維持して選ぶ。

優先順:

1. Emergency / separate safety ownerなら通常planを作らない。
2. self-denial + help-seekingならhelp-seekingを主役候補にする。
3. self-denial + grounded counterdirectionならbounded counterpositionを必要Moveとして保持する。
4. short-stateならburdenを主役にする。
5. concrete actionが意味変化・願いを実際の動きへした場合、effortを主役候補にする。
6. 本人が明示的に価値づけた変化がある場合、lived changeを主役候補にする。
7. retained intentionが中心なら、それを主役候補にする。
8. 具体候補がないlimited inputだけ、words placedを使う。

### 10.5 補助選択

補助Opportunityは、次の全条件を満たす場合だけ選ぶ。

- 主役と異なる人間的貢献がある。
- requiredまたはshould retention相当である。
- 主役を具体化するか、別の重要な向きを示す。
- 2〜3文の中で自然に分けられる。
- 全入力列挙にならない。
- observationのrelation説明を再実行しない。

最大2件までとする。

### 10.6 Depth決定

Depthは、Opportunityの総数だけで決めない。

推奨判定:

```text
minimal:
  有効Opportunityが1件
  OR short_state_sufficientで、安全上の追加Moveなし

focused:
  主役1件 + dependentな補助1件
  OR 有効Opportunityが2件だが、一文へ自然に統合できる

layered:
  独立した有効Opportunityが2件以上
  AND 少なくとも一つがrequired/should
  AND 同一意味の言い換えではない
  AND 2文以上で返す人間的価値がある
```

### 10.7 raw length非依存の対照例

#### 長いがminimal / focusedになり得る例

同じしんどさを言い換えながら長く書いているが、具体行動、願い、変化、助けへの動きがない。

```text
長文 = layered
```

とはしない。

#### 短いがlayered / protectedになり得る例

```text
自分には価値がない。それでも相談先は消さなかった。
```

文字数は短いが、self-denial、help-seeking、counterpositionがあるため複数Moveが必要である。

### 10.8 疑似コード

```python
def build_reception_depth_plan(plan_context):
    opportunities = build_grounded_reception_opportunities(plan_context)
    opportunities = filter_grounded_and_non_redundant(opportunities)

    primary = select_primary_opportunity(opportunities, safety=plan_context.safety)
    required_safety_moves = select_required_safety_opportunities(opportunities)
    supports = select_distinct_support_opportunities(
        opportunities,
        primary=primary,
        limit=2,
    )

    selected = dedupe_contributions(
        [primary, *supports, *required_safety_moves]
    )[:3]

    depth = classify_depth(
        selected,
        material_quality=plan_context.material_quality,
        semantic_complexity=plan_context.semantic_complexity,
        raw_character_count_used=False,
    )

    return GroundedReceptionDepthPolicy(...), build_moves(selected, depth)
```

これは設計用疑似コードであり、実装コードではない。

---

## 11. body-free Plan Contract v2案

### 11.1 推奨内部型

```text
GroundedReceptionOpportunity
GroundedReceptionDepthPolicy
GroundedReceptionMovePlan
GroundedHumanReceptionPlan v2
```

### 11.2 `GroundedReceptionDepthPolicy`

| field | type | 必須 | 目的 |
|---|---|---:|---|
| `level` | enum | yes | minimal / focused / layered |
| `safety_mode` | enum | yes | standard / self_denial_bounded / help_seeking_bounded |
| `opportunity_count` | int | yes | grounded候補数 |
| `selected_move_count` | int | yes | 実現必須Move数 |
| `selection_reason_codes` | code[] | yes | body-freeな選択理由 |
| `raw_character_count_used` | bool const false | yes | 文字数比例でないこと |
| `min_sentences` | int | yes | depthに必要な最小文数 |
| `max_sentences` | int | yes | 最大3 |
| `min_realized_moves` | int | yes | recovery後も落とせないMove数 |
| `max_moves_per_sentence` | int | yes | 一文へ詰め込み過ぎない上限 |

### 11.3 `GroundedReceptionMovePlan`

| field | type | 必須 | 目的 |
|---|---|---:|---|
| `move_id` | string | yes | request-local ID |
| `move_role` | enum | yes | attention / significance / felt_response / bounded_counterposition |
| `reception_act` | existing enum | yes | 人間的行為 |
| `target_nucleus_ids` | ID[] | yes | 主対象 |
| `support_nucleus_ids` | ID[] | no | 根拠補助 |
| `source_evidence_span_ids` | ID[] | yes | grounding |
| `follow_elements` | enum[] | yes | フォロー4材料 |
| `speaker_presence` | enum | yes | implicit / explicit |
| `reference_mode` | enum | yes | anaphoric / short anchor / explicit counterposition |
| `surface_strategy` | enum | yes | 文構造 |
| `required` | bool | yes | recoveryで落としてよいか |
| `distinct_from_move_ids` | ID[] | no | 意味貢献の独立性 |

### 11.4 既存fieldとの互換

実装時の第一候補は、既存 `GroundedHumanReceptionPlan` をv2へ拡張し、次を互換fieldとして残すことである。

```text
primary_reception_act
secondary_reception_act
primary_follow_element
secondary_follow_elements
afterglow_follow_element
```

ただし、v2ではこれらをSurface ownerにしない。

- `primary_reception_act` は `moves[0].reception_act` から導出する。
- `secondary_reception_act` は、互換上必要な場合だけ最初の異なるactを表す。
- 実際のSurface責任は `moves` が持つ。
- 互換期間終了後の削除は、本修復とは別判断にする。

### 11.5 JSON例案

次は、長い自己理解入力に対するbody-free plan例である。完成文・raw text・case IDを含まない。

```json
{
  "schema_version": "cocolon.emlis.grounded_human_reception_plan.v2",
  "required": true,
  "depth_policy": {
    "level": "layered",
    "safety_mode": "standard",
    "opportunity_count": 3,
    "selected_move_count": 2,
    "selection_reason_codes": [
      "multiple_distinct_reception_opportunities",
      "cross_field_action_support",
      "explicit_valued_change"
    ],
    "raw_character_count_used": false,
    "min_sentences": 2,
    "max_sentences": 3,
    "min_realized_moves": 2,
    "max_moves_per_sentence": 2
  },
  "moves": [
    {
      "move_id": "rm1",
      "move_role": "attention",
      "reception_act": "honor_concrete_effort",
      "target_nucleus_ids": ["n7"],
      "support_nucleus_ids": ["n3"],
      "source_evidence_span_ids": ["s8", "s9"],
      "follow_elements": ["effort_receiving"],
      "speaker_presence": "implicit_emlis",
      "reference_mode": "short_anchor_if_ambiguous",
      "surface_strategy": "emlis_attention_first",
      "required": true,
      "distinct_from_move_ids": ["rm2"]
    },
    {
      "move_id": "rm2",
      "move_role": "felt_response",
      "reception_act": "recognize_lived_change",
      "target_nucleus_ids": ["n3"],
      "support_nucleus_ids": ["n7"],
      "source_evidence_span_ids": ["s3", "s8", "s9"],
      "follow_elements": [
        "intent_affirmation",
        "effort_receiving"
      ],
      "speaker_presence": "implicit_emlis",
      "reference_mode": "anaphoric_first",
      "surface_strategy": "referent_significance_first",
      "required": true,
      "distinct_from_move_ids": ["rm1"]
    }
  ],
  "quote_policy": {
    "mode": "no_full_quote_replay",
    "max_anchor_count": 1,
    "max_anchor_visible_chars": 16
  },
  "distinctness_policy": {
    "observation_summary_repetition_allowed": false,
    "relation_reexplanation_allowed": false,
    "all_input_enumeration_allowed": false,
    "policy_explanation_allowed": false,
    "new_cause_allowed": false,
    "new_identity_claim_allowed": false,
    "advice_allowed": false,
    "question_allowed": false
  },
  "forbidden_surface_codes": [
    "generic_empathy_suffix",
    "second_observation_summary",
    "internal_policy_explanation",
    "full_source_quote_replay",
    "all_input_enumeration",
    "duplicate_reception_move"
  ]
}
```

### 11.6 JSON Schema案

本設計段階では実ファイル化しない。実装時に、複数module・fixture generator・offline QAでserialized contractを共有する必要がある場合だけ実ファイル化を検討する。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.grounded_human_reception_plan.v2",
  "title": "GroundedHumanReceptionPlanV2",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "required",
    "depth_policy",
    "moves",
    "quote_policy",
    "distinctness_policy",
    "forbidden_surface_codes"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.grounded_human_reception_plan.v2"
    },
    "required": {
      "const": true
    },
    "depth_policy": {
      "$ref": "#/$defs/depthPolicy"
    },
    "moves": {
      "type": "array",
      "minItems": 1,
      "maxItems": 3,
      "items": {
        "$ref": "#/$defs/move"
      }
    },
    "quote_policy": {
      "$ref": "#/$defs/quotePolicy"
    },
    "distinctness_policy": {
      "$ref": "#/$defs/distinctnessPolicy"
    },
    "forbidden_surface_codes": {
      "$ref": "#/$defs/codeArray"
    }
  },
  "$defs": {
    "depthPolicy": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "level",
        "safety_mode",
        "opportunity_count",
        "selected_move_count",
        "selection_reason_codes",
        "raw_character_count_used",
        "min_sentences",
        "max_sentences",
        "min_realized_moves",
        "max_moves_per_sentence"
      ],
      "properties": {
        "level": {
          "enum": ["minimal", "focused", "layered"]
        },
        "safety_mode": {
          "enum": [
            "standard",
            "self_denial_bounded",
            "help_seeking_bounded"
          ]
        },
        "opportunity_count": {
          "type": "integer",
          "minimum": 1
        },
        "selected_move_count": {
          "type": "integer",
          "minimum": 1,
          "maximum": 3
        },
        "selection_reason_codes": {
          "$ref": "#/$defs/codeArray"
        },
        "raw_character_count_used": {
          "const": false
        },
        "min_sentences": {
          "type": "integer",
          "minimum": 1,
          "maximum": 3
        },
        "max_sentences": {
          "type": "integer",
          "minimum": 1,
          "maximum": 3
        },
        "min_realized_moves": {
          "type": "integer",
          "minimum": 1,
          "maximum": 3
        },
        "max_moves_per_sentence": {
          "type": "integer",
          "minimum": 1,
          "maximum": 2
        }
      }
    },
    "move": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "move_id",
        "move_role",
        "reception_act",
        "target_nucleus_ids",
        "source_evidence_span_ids",
        "follow_elements",
        "speaker_presence",
        "reference_mode",
        "surface_strategy",
        "required",
        "distinct_from_move_ids"
      ],
      "properties": {
        "move_id": {
          "type": "string",
          "pattern": "^rm[1-9][0-9]*$"
        },
        "move_role": {
          "enum": [
            "attention",
            "significance",
            "felt_response",
            "bounded_counterposition"
          ]
        },
        "reception_act": {
          "enum": [
            "stay_with_current_burden",
            "honor_concrete_effort",
            "protect_retained_intention",
            "recognize_lived_change",
            "hold_help_seeking",
            "bounded_counter_self_denial",
            "respect_words_placed"
          ]
        },
        "target_nucleus_ids": {
          "$ref": "#/$defs/nonEmptyIdArray"
        },
        "support_nucleus_ids": {
          "$ref": "#/$defs/idArray"
        },
        "source_evidence_span_ids": {
          "$ref": "#/$defs/nonEmptyIdArray"
        },
        "follow_elements": {
          "type": "array",
          "minItems": 1,
          "maxItems": 3,
          "uniqueItems": true,
          "items": {
            "enum": [
              "intent_affirmation",
              "burden_understanding",
              "effort_receiving",
              "existence_respect"
            ]
          }
        },
        "speaker_presence": {
          "enum": ["implicit_emlis", "explicit_emlis"]
        },
        "reference_mode": {
          "enum": [
            "anaphoric_first",
            "short_anchor_if_ambiguous",
            "explicit_emlis_counterposition"
          ]
        },
        "surface_strategy": {
          "enum": [
            "quiet_referent_first",
            "emlis_attention_first",
            "referent_significance_first",
            "felt_response_first",
            "explicit_emlis_counterposition"
          ]
        },
        "required": {
          "type": "boolean"
        },
        "distinct_from_move_ids": {
          "$ref": "#/$defs/idArray"
        }
      }
    },
    "quotePolicy": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "mode",
        "max_anchor_count",
        "max_anchor_visible_chars"
      ],
      "properties": {
        "mode": {
          "const": "no_full_quote_replay"
        },
        "max_anchor_count": {
          "type": "integer",
          "minimum": 0,
          "maximum": 1
        },
        "max_anchor_visible_chars": {
          "type": "integer",
          "minimum": 0,
          "maximum": 20
        }
      }
    },
    "distinctnessPolicy": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "observation_summary_repetition_allowed",
        "relation_reexplanation_allowed",
        "all_input_enumeration_allowed",
        "policy_explanation_allowed",
        "new_cause_allowed",
        "new_identity_claim_allowed",
        "advice_allowed",
        "question_allowed"
      ],
      "properties": {
        "observation_summary_repetition_allowed": {"const": false},
        "relation_reexplanation_allowed": {"const": false},
        "all_input_enumeration_allowed": {"const": false},
        "policy_explanation_allowed": {"const": false},
        "new_cause_allowed": {"const": false},
        "new_identity_claim_allowed": {"const": false},
        "advice_allowed": {"const": false},
        "question_allowed": {"const": false}
      }
    },
    "idArray": {
      "type": "array",
      "uniqueItems": true,
      "items": {
        "type": "string",
        "minLength": 1
      }
    },
    "nonEmptyIdArray": {
      "type": "array",
      "minItems": 1,
      "uniqueItems": true,
      "items": {
        "type": "string",
        "minLength": 1
      }
    },
    "codeArray": {
      "type": "array",
      "minItems": 1,
      "uniqueItems": true,
      "items": {
        "type": "string",
        "pattern": "^[A-Za-z0-9_.:-]+$"
      }
    }
  }
}
```

### 11.7 実ファイル化判断

- Python dataclassと既存validationで閉じる場合、schema実ファイルを作らない。
- test fixture generator、複数service、offline QAがserialized planを共有する場合だけschemaを実ファイル化する。
- public APIへ返すためには使わない。
- 本設計段階ではJSON / schema実ファイルを作成しない。

---

## 12. SentencePlan / ClausePlan設計

### 12.1 public section構造

引き続き次を維持する。

```text
observation lines: 1件以上
human reception line: 最後にちょうど1件
```

`human reception line` は、内部に1〜3文を持ってよい。

### 12.2 Reception Clause Plan

推奨内部型:

```text
GroundedReceptionClausePlan
```

field案:

| field | 目的 |
|---|---|
| `sentence_slot` | 1〜3 |
| `move_ids` | その文で実現するMove |
| `opening_strategy` | referent / Emlis attention / felt response |
| `connector_policy` | none / grounded_reason / contrast-safe |
| `terminal_predicate_family` | human response family |
| `quote_budget` | 0または1 |
| `speaker_presence` | implicit / explicit |

### 12.3 Moveの文配置

- 一文に最大2Moveまで。
- `layered` は最低2文を第一候補とする。
- 三つのMoveがある場合、2文または3文に配置する。
- `bounded_counterposition` は原則として独立文にする。
- short-stateの`stay_with_current_burden`は一文で閉じる。
- 同じact・同じtargetの二Moveを一文へ詰め込まない。

### 12.4 functional atom案

```text
reception_depth:minimal|focused|layered
reception_safety_mode:standard|self_denial_bounded|help_seeking_bounded
reception_move_count:1|2|3
reception_move:<move_id>
reception_move_role:<role>
reception_move_act:<act>
reception_surface_strategy:<strategy>
reception_sentence_slot:<1|2|3>
reception_move_required:true|false
reception_distinctness:required
reception_non_enumeration:required
human_follow_delivery:separate
closure_role:human_follow
```

### 12.5 禁止

Human Reception lineは引き続き次を持たない。

- required relation coverage owner
- `relation_ids`
- observation surface role
- fact boundary説明owner
- question
- advice
- `human_follow_delivery:integrated`

relationはOpportunity選択の内部根拠として使えても、visible relation explanationを作るownerにはしない。

---

## 13. Surface Realizer設計

### 13.1 目標構造

```text
Reception Move Plan
  ↓
move-specific referent resolution
  ↓
move-role-specific predicate family
  ↓
surface strategy
  ↓
sentence grouping
  ↓
grammar join
  ↓
move realization validation
```

### 13.2 Predicate family

現行のact別一種類に近いpredicateから、`Move role × Reception act` の組み合わせへ拡張する。

例となるbody-free family code:

```text
human_response_attention_stood_out
human_response_attention_not_overlooked
human_response_significance_effort_made_concrete
human_response_significance_intention_preserved
human_response_felt_glad
human_response_felt_gentle_respect
human_response_quiet_presence
human_response_hold_help_seeking
human_response_bounded_counterposition
```

これらは完成文ではない。

### 13.3 可視語彙の広がり

言い回しの広がりは、次から作る。

- `印象に残りました`
- `見過ごしたくありません`
- `うれしく感じます`
- `大事に思います`
- `軽く扱いたくありません`
- `そっと残しておきたいです`
- `その言葉だけで決まるとは思えません`

ただし、これをrandom synonym listとして使わない。

`Move role`、`act`、`referent kind`、`surface strategy`により決定的に選ぶ。

### 13.4 現行語彙の扱い

`受け止めています` と `大切` は禁止語ではない。

ただし、次を禁止する。

- すべてのactが `受け止めています` で終わる。
- Gateを通すために必ず `大切` を入れる。
- 二つのMoveを同じ `受け止めています` で繰り返す。
- surface variationを同義語置換だけで作る。

### 13.5 attention move

`attention` は第二観測ではない。

許可される機能:

```text
Emlisには、どの一点が印象に残ったかを示す。
```

禁止:

```text
AがBにつながっている
XとYが同時にある
ZからWへ変化している
```

これらは観測ownerである。

### 13.6 significance move

`significance` は、Emlisにとってなぜその一点を軽く扱いたくないかを返す。

許可:

- 願いが実際の行動へ移されたこと。
- 本人が変化を自分で確かめていること。
- 不明さの中でも記録を残したこと。
- 自己否定の中で助けにつながるものを残したこと。

禁止:

- 新しい原因。
- 人格特性。
- 成功・解決認定。
- relationの再説明。

### 13.7 felt response move

`felt_response` は、Emlis自身の反応を出す。

- うれしく感じる。
- 軽く扱いたくない。
- 見過ごしたくない。
- 大事に思う。
- 静かに留まる。

一般共感文ではなく、選択済みreferentへ限定する。

### 13.8 Bを用いた設計説明

次は期待完成文でも、B専用runtime文でもない。Move構造を説明するための例である。

```text
Move 1: attention / honor_concrete_effort
  変化そのものより、それを観察・メモ・行動で確かめた部分へ注意を向ける。

Move 2: felt_response / recognize_lived_change
  人との話し方や動く勇気まで変化が現れたことを、Emlisがうれしく感じる。
```

一例として自然文へすると、次に近い方向になる。

```text
私は、変化そのものより、それを日常の観察やメモ、実際の行動の中で、自分の手で確かめてきたところが印象に残りました。
人との話し方や、思ったときに動く勇気まで少しずつ戻ってきていることを、自分で「進歩してる」と言えたのも、うれしい変化だと感じます。
```

この文を固定しない。testのexpected exact stringにも使わない。

### 13.9 全入力列挙の禁止

- `Emlisから` で全nucleusを再掲しない。
- `layered` でも最大3Move。
- observation-owned nucleusの全件coverageを要求しない。
- `思考内容ではX、行動内容ではY、感情はZ` のような順番処理をしない。
- primary focusを一つ選び、補助は最大二つにする。

---

## 14. Gate設計

### 14.1 維持する既存Gate

```text
reception_plan_gate
reception_grounding_gate
reception_role_distinctness_gate
reception_quote_reuse_gate
reception_policy_exposure_gate
reception_human_voice_gate
reception_safety_boundary_gate
```

### 14.2 追加・拡張するruntime Gate

```text
reception_depth_plan_gate
reception_move_realization_gate
reception_depth_proportionality_gate
reception_move_distinctness_gate
reception_non_enumeration_gate
```

### 14.3 `reception_depth_plan_gate`

PASS条件:

- depth levelがある。
- raw character countを使っていない。
- selected move countが1〜3。
- minimal / focused / layeredのsentence policyが整合する。
- layeredでmin sentencesが2未満にならない。
- required safety moveがdepth圧縮で消えていない。

### 14.4 `reception_move_realization_gate`

PASS条件:

- required MoveがすべてSurfaceへ実現される。
- realized move IDsがPlanと一致する。
- terminal predicate familyがMove role / actと一致する。
- Moveごとのtarget / evidenceが解決する。
- Surface diagnosticsにraw bodyを含めない。

### 14.5 `reception_depth_proportionality_gate`

PASS条件:

```text
minimal:
  realized moves = 1
  sentences = 1

focused:
  realized moves = 1..2
  sentences = 1..2

layered:
  realized moves = 2..3
  sentences = 2..3
```

このGateは文字数を判定しない。

### 14.6 `reception_move_distinctness_gate`

FAIL条件:

- 同一act、同一target、同一move role、同一predicate familyのMoveが重複する。
- 二文目が一文目の同義反復である。
- attentionとfelt responseが同じ可視責任で終わる。
- required Moveのうち、別のMoveへ吸収されて見えなくなる。

### 14.7 `reception_non_enumeration_gate`

FAIL条件:

- selected Moveが4件以上。
- receptionがobservation-owned nucleusを全件列挙する。
- memo / memo_action / emotion / categoryを順番に処理する。
- relation surfaceを複数再説明する。
- reception sectionがobservation sectionと同程度の構造要約になる。

### 14.8 `reception_human_voice_gate` の修正

現行のact responsibilityを、特定可視語句へ過度に結び付けない。

現行:

```text
大切
受け止め
感じる
```

があるかを中心に見る。

修復後:

- realizerが返したpredicate family codeを検査する。
- move roleに対応するhuman response familyであることを検査する。
- visible textでは、分析終端・方針説明・一般共感suffix・質問・助言を拒否する。
- `受け止め` という語がなくても、人間的貢献が成立すればPASSできる。

### 14.9 batch / offline QA

runtime一件では検出できない反復を、cohortで検査する。

追加候補:

```text
reception_sentence_skeleton_qa
reception_terminal_lexeme_family_qa
reception_opening_strategy_qa
reception_depth_distribution_qa
reception_support_utilization_qa
```

#### sentence skeleton fingerprint

本文をそのままmetaへ出さず、local-onlyで次をfingerprint化する。

```text
move role sequence
surface strategy sequence
predicate family sequence
sentence count
connector pattern
speaker presence
```

#### 初期threshold案

exact8では次を初期基準とする。

- normalized exact sentence duplicate: 0
- 同一12文字以上closing stem: 最大3件
- 同一terminal lexical family: 最大4件
- 同一sentence skeleton fingerprint: 最大3件
- layered予定caseの一文終了: 0

thresholdは、unseen cohortでfalse positiveが確認された場合だけ校正する。exact8を通すためだけに緩めない。

### 14.10 body-free Gate meta案

```json
{
  "reception_depth_level": "layered",
  "reception_safety_mode": "standard",
  "reception_opportunity_count": 3,
  "reception_planned_move_count": 2,
  "reception_realized_move_count": 2,
  "reception_sentence_count": 2,
  "reception_move_roles": [
    "attention",
    "felt_response"
  ],
  "reception_surface_strategies": [
    "emlis_attention_first",
    "referent_significance_first"
  ],
  "reception_terminal_predicate_families": [
    "human_response_attention_stood_out",
    "human_response_felt_glad"
  ],
  "reception_depth_plan_gate": "passed",
  "reception_move_realization_gate": "passed",
  "reception_depth_proportionality_gate": "passed",
  "reception_move_distinctness_gate": "passed",
  "reception_non_enumeration_gate": "passed",
  "raw_character_count_used": false,
  "raw_input_included": false,
  "source_text_included": false,
  "comment_text_included": false
}
```

---

## 15. Recovery / fail-closed設計

### 15.1 原則

rich inputのSurface失敗時に、現行の一文へ黙って縮退してPASSにしてはいけない。

```text
layered plan
  ↓ Surface failure
one-line minimal responseへ縮退
  ↓ passed
```

は禁止する。

### 15.2 recovery stageの意味

既存stage名を互換維持する場合の意味を次で固定する。

| stage | Depth修復後の意味 |
|---|---|
| `full` | required Moveすべて、必要なoptional Move、2〜3文 |
| `optional_removed` | optional第三Moveだけを外す。min realized movesは維持 |
| `integrated` | legacy名。Moveを落とさず、二つのMoveを一文へ安全に統合する。layeredのmin sentenceを破らない |
| `hedged` | 断定を弱める。Move数は維持 |
| `minimal_grounded` | original depthがminimalの場合だけ許可。layered / bounded safetyでは禁止 |

### 15.3 recoveryで落としてよいもの

- optional第三Move
- afterglow
- short anchor
- 修飾語

### 15.4 recoveryで落としてはいけないもの

- primary Move
- layeredを成立させる第二Move
- help-seeking Move
- bounded counterposition Move
- felt state尊重
- observation / reception role separation

### 15.5 fail-closed

必要Moveを保ったSurfaceを作れない場合:

- public `passed` にしない。
- 一文generic empathyへ戻さない。
- `Emlisから` を削除しない。
- observationだけを表示しない。
- failure理由をbody-free metaへ残す。

---

## 16. exact8 Depth Target Contract

期待完成文ではなく、Depth・Move・禁止事項を固定する。

| case | depth | 必須Move | 文数target | 禁止 |
|---|---|---|---:|---|
| A | `minimal` | `felt_response / stay_with_current_burden` | 1 | 水増し、原因・波及追加 |
| B | `layered` | `attention / honor_concrete_effort` + `felt_response / recognize_lived_change`。必要ならsignificanceを追加 | 2〜3 | 全変化・全行動の再列挙 |
| C | `layered` | `attention / recognize_lived_change` + `felt_response / protect_retained_intention` | 2 | 小さな変化の列挙、方向の同義反復 |
| D | `focused` + `self_denial_bounded` | felt state保持 + bounded counterposition | 2 | 根拠なし肯定、人格褒め |
| I6-S03 | `minimal` | `felt_response / stay_with_current_burden` | 1 | 原因推定、診断、方針説明 |
| I6-L03 | `layered` | `attention / protect_retained_intention` + `felt_response / honor_concrete_effort` | 2 | 全工程の再要約、成功認定 |
| I6-C01 | `layered` | `attention / honor_concrete_effort` + `felt_response / recognize_lived_change` | 2 | 周囲比較relationの再説明 |
| I6-D02 | `focused` + `help_seeking_bounded` | hold help-seeking + bounded counterposition | 2 | 安全確定、解決認定、危険度判断 |

### 16.1 exact8共通合格条件

- short 2件は一文のまま。
- rich / protected 6件は必要Moveを落とさない。
- B、C、I6-L03、I6-C01は一文で終了しない。
- 全件で全入力列挙なし。
- 全件で第二観測化なし。
- 同一完成文なし。
- 言い回しの差が、semantic MoveとSurface Strategyの差として説明できる。
- 自己否定2件はfelt state尊重とidentity claim非受容を両立する。

---

## 17. テスト設計

### 17.1 Unit test

- nucleus / role → Opportunity family
- Opportunity grounding
- Opportunity duplicate removal
- primary selection
- support selection
- depth classification
- safety mode selection
- Move role selection
- Surface Strategy selection
- sentence grouping
- recovery stage behavior

### 17.2 raw length非依存の対照test

必須pair:

1. 長い同義反復入力 → `minimal` または `focused`
2. 短いself-denial + help-seeking → 複数Move
3. 長いが人間的機会一つ → 一文またはfocused
4. 中程度だがchange + action + intention → `layered`

PASS条件:

```text
raw character countがdepth decisionへ使われていない。
```

### 17.3 Plan contract test

- body-free
- 1〜3Move
- selected move count一致
- raw_character_count_used=false
- evidence解決
- required safety Move保持
- distinct_from整合
- case ID / raw text / expected hash不在

### 17.4 SentencePlan / ClausePlan test

- final human line exactly one
- internal sentence slot 1〜3
- relation ownerなし
- observation atomなし
- required Moveすべてbinding
- max 2Move per sentence
- bounded counterposition独立文

### 17.5 Surface test

正解文一致ではなく、次を検査する。

- planned Moveが実現される。
- depthに必要な文数。
- different Moveにdifferent predicate family。
- long quote replayなし。
- policy explanationなし。
- question / adviceなし。
- generic empathy suffix aloneでない。
- all-input enumerationなし。
- self-denial counterposition grounded。

### 17.6 Gate test

単独failureを作る。

```text
missing depth policy
raw length used
layered one-line collapse
required move missing
duplicate move contribution
all-input enumeration
same predicate family duplicate
safety move removed by recovery
raw body meta leak
```

### 17.7 exact8

- observation section hash 8/8 freeze
- depth target 8/8
- mandatory two-stage 8/8
- reception Gate 8/8
- safety boundary 8/8
- no case-specific route 8/8

### 17.8 same16

前回same16を維持し、次を追加評価する。

- depth distribution
- one-line concentration
- skeleton concentration
- lexical family concentration
- rich inputのMove欠落

### 17.9 unseen cohort

最低12件を追加する。

- short burden
- body sensation
- long repetitive burden
- positive change + action
- retained intention + uncertainty
- action without success
- long arc with two human opportunities
- long arc with one human opportunity
- comparison + self-measurement
- self-denial without counterevidence
- self-denial with help-seeking
- labels-only limited

### 17.10 batch QA

追加metrics:

```text
response_depth_proportionality
meaningful_support_utilization
move_distinctness
non_enumerative_selection
sentence_skeleton_concentration
opening_strategy_concentration
terminal_lexeme_family_concentration
one_line_rich_input_rate
```

### 17.11 華恋Product Read Feel

新axis:

```text
reception_role_distinctness
human_warmth
conversational_naturalness
grounded_specificity
whole_input_balance
response_depth_proportionality
meaning_selection_quality
meaningful_support_utilization
non_enumerative_readfeel
language_variety
safety_boundary
non_template_readfeel
wants_more_input_candidate
```

B/Cを一文のまま `whole_input_balance=pass` にしない。

### 17.12 Mash様実機Product Read Feel

自動pass・華恋pass後に、Mash様が次を判定する。

- 淡泊に見えないか。
- 長い入力へ十分に留まっているか。
- 全情報を順番に処理した感じがないか。
- 同じ言葉・同じ骨格の使い回しに見えないか。
- Emlisの反応として自然か。
- short inputが水増しされていないか。

---

## 18. 実装順

本修復では、既存R0〜R9と混同しないよう、`RR`（Response Richness Repair）prefixを使う。

### RR0. R8実機証拠・進行状態の固定

#### 目的

現行のtechnical successとProduct Read Feel failureを分離して固定する。

#### 作業

1. `実機確認結果２.zip` の8件を証拠inventoryへ登録する。
2. current visible surfaceとsection hashをfailure baselineとして固定する。
3. observation section hashを凍結する。
4. 現在状態を次で記録する。

```text
actual_device_two_stage_display = pass
actual_device_layout = visual_pass
human_reception_role_distinctness = direction_pass
human_reception_response_depth = repair_required
human_reception_language_variety = repair_required
r8_progression = blocked
```

5. 旧R6華恋receiptをprogression ownerから外す。

#### 完了条件

- 8件の入力identityとvisible surfaceを一意に結べる。
- 旧本文を商品合格期待値として使っていない。
- P5 / P6 / P8がfalseのまま。

#### 停止条件

- exact8入力正本と実機入力が一致しない。
- observation section baselineを一意に固定できない。

---

### RR1. RED contract test

#### 目的

現行一文圧縮と文骨格集中を、期待完成文なしでREDにする。

#### RED対象

- B、C、I6-L03、I6-C01のlayered depth不足。
- rich inputのone-line collapse。
- same skeleton concentration。
- terminal lexical family concentration。
- raw length依存を禁止する対照pair。

#### 完了条件

- 現行コードでDepth関連だけが意図どおりRED。
- observation freezeと既存SafetyはGREEN。

---

### RR2. Reception Opportunity Inventory

#### 主owner候補

- `emlis_ai_grounded_observation_plan.py`

#### 作業

1. `GroundedReceptionOpportunity` を追加する。
2. nucleiからbody-free opportunityを作る。
3. duplicate / generic / ungrounded opportunityを除外する。
4. opportunity metaをbody-freeで出せるようにする。
5. case ID、raw text、expected hashがないことをvalidateする。

#### 完了条件

- exact8 / unseenで一般構造から候補が出る。
- short-stateは候補一つ。
- B/C/I6-L03/I6-C01は複数のdistinct候補を持つ。
- self-denial counterpositionは入力根拠なしに出ない。

#### 停止条件

- relation extractionの全面変更が必要になる。
- raw text keyword routeが必要になる。

---

### RR3. Depth Policy / Move Plan v2

#### 主owner候補

- `emlis_ai_grounded_observation_plan.py`

#### 作業

1. `GroundedReceptionDepthPolicy` を追加する。
2. `GroundedReceptionMovePlan` を追加する。
3. existing planをv2へ拡張する。
4. primary + support選択を実装する。
5. minimal / focused / layeredを決定する。
6. safety modeを独立させる。
7. compatibility fieldを導出する。
8. validationを追加する。

#### 完了条件

- raw character count未使用。
- Move数1〜3。
- B/C/I6-L03/I6-C01がlayeredになる。
- A/I6-S03がminimalのまま。
- D/I6-D02のrequired safety Moveが保持される。

---

### RR4. SentencePlan / ClausePlan接続

#### 主owner候補

- `emlis_ai_grounded_sentence_surface.py`

#### 作業

1. Moveをhuman reception lineへbindingする。
2. `GroundedReceptionClausePlan` を必要に応じて追加する。
3. sentence slot 1〜3を計画する。
4. max 2Move per sentenceを守る。
5. bounded counterpositionを独立文にする。
6. observation lineへMove atomが漏れないようにする。

#### 完了条件

- reception lineは最終に一つ。
- internal sentence planはdepthと一致。
- relation ownerなし。
- required Move欠落なし。

---

### RR5. Multi-Move Human Reception Surface Realizer

#### 主owner候補

- `emlis_ai_grounded_human_reception.py`

#### 作業

1. `reception_active_acts()` 中心からMove sequence中心へ移す。
2. Moveごとのreferent resolverを実装する。
3. `Move role × act` のpredicate familyを実装する。
4. Surface Strategyを実装する。
5. sentence groupingを実装する。
6. lexical repetitionを構造的に減らす。
7. long quote / policy explanation / advice禁止を維持する。
8. exact8専用分岐を作らない。

#### 完了条件

- rich caseが2〜3文。
- short caseが一文。
- 同一Move反復なし。
- `受け止めています` 以外の正当なhuman response familyが成立する。
- observation hash不変。

#### 停止条件

- 完成文return mapになる。
- synonym randomizationになる。
- fixture語句でstrategyを選ぶ。

---

### RR6. Runtime Gate / final guard更新

#### 主owner候補

- `emlis_ai_grounded_observation_gate.py`
- `emlis_ai_reply_service.py`

#### 作業

1. §14のDepth / Move Gateを追加する。
2. existing human voice gateをpredicate family中心へ修正する。
3. layered one-line collapseをhard failにする。
4. required Move missingをhard failにする。
5. all-input enumerationを拒否する。
6. Gate metaをbody-freeに保つ。
7. final return guardへ必須接続する。

#### 完了条件

- Gate未接続時fail-openしない。
- rich one-linerがpassedにならない。
- short one-linerは正当にpassできる。
- public contract不変。

---

### RR7. Recovery修復

#### 主owner候補

- `emlis_ai_grounded_sentence_surface.py`
- `emlis_ai_grounded_human_reception.py`
- `emlis_ai_reply_service.py`

#### 作業

1. required Moveを保持するrecoveryへ変更する。
2. layeredからminimalへの黙った縮退を禁止する。
3. `minimal_grounded` をoriginal minimalに限定する。
4. optional第三Moveだけを安全に落とせるようにする。
5. fail-closedを確認する。

#### 完了条件

- recovery後もdepth contractが成立する。
- safety Moveが消えない。
- generic empathy fallbackなし。

---

### RR8. Local automated QA

#### 実行順

1. type / unit
2. opportunity tests
3. depth / move plan tests
4. SentencePlan / ClausePlan tests
5. Surface tests
6. Gate tests
7. recovery tests
8. exact8
9. same16
10. unseen12以上
11. API / DB / RN boundary regression
12. relevant backend regression
13. compile

#### 完了条件

- observation hash 8/8不変。
- exact8 depth target 8/8。
- rich one-line 0。
- short water-filling 0。
- no case-specific route。
- batch repetition threshold内。
- public contract regressionなし。

---

### RR9. 華恋local Product Read Feel再実行

#### 目的

旧R6評価軸の欠落を是正し、可視本文そのものを再読する。

#### 作業

- §17.11の全axisを8件 + unseen代表で評価する。
- visible surface SHA-256へreceiptを拘束する。
- B/C/I6-L03/I6-C01のdepthを重点確認する。
- A/I6-S03の水増しがないことを確認する。
- D/I6-D02の安全境界を確認する。

#### 完了条件

- 全case human pass。
- `technical pass is product pass = false` を維持。
- progression authorityはまだ与えない。

---

### RR10. 代表4件の実機方向確認

実装後の代表4件は、Depth修復を直接確認できる次を第一候補とする。

```text
A
B
I6-L03
I6-D02
```

選定理由:

| case | 確認内容 |
|---|---|
| A | short入力が水増しされない |
| B | long multi-relationが2〜3文へ広がる |
| I6-L03 | intention + uncertainty + actionが選択的に2文へなる |
| I6-D02 | safety Moveを保った二文 |

PASS条件:

- local expected visible hashと実機生body hash一致。
- 二段表示。
- observation回帰なし。
- Depth target一致。
- clipping / scroll問題なし。
- Mash様読感PASS。

1件でも不合格ならexact8へ進まない。

---

### RR11. exact8実機再確認・R8進行判断

#### PASS条件

- 8件すべてvisible hash一致。
- 8件すべて二段表示。
- observation hash 8/8一致。
- depth target 8/8一致。
- B/C/I6-L03/I6-C01が淡泊な一文で終わらない。
- A/I6-S03が水増しされない。
- 同じ言葉・同じ骨格の集中が商品読感で不合格にならない。
- 全入力列挙に見えない。
- Mash様と華恋の双方が最低商品品質へ到達したと判断する。

#### 進行

このPASS後にのみ、既存roadmapのP5 formal 24開始条件を別途確認する。

自動的にP5 / P6 / P8を開始しない。

---

### RR12. 実装済み資料・前提資料・handoff

実装・local QA・実機PASS後にのみ行う。

- 実装済み資料status更新
- R8 repair receipt登録
- 旧R6 human passのprogression owner解除を正本化
- new fixture / schemaを作った場合のinventory更新
- exact8 actual-device receipt登録
- roadmap進行条件確認

本設計段階では更新しない。

---

## 19. 対象ファイル候補

| 責任 | owner候補 | 方針 |
|---|---|---|
| Opportunity / Depth / Move Plan | `emlis_ai_grounded_observation_plan.py` | v2 contract、selector、validation |
| Human Reception Surface | `emlis_ai_grounded_human_reception.py` | multi-Move realizer、strategy、predicate family |
| Sentence / Clause Plan | `emlis_ai_grounded_sentence_surface.py` | Move binding、sentence grouping、recovery |
| Runtime Gate | `emlis_ai_grounded_observation_gate.py` | Depth / Move Gate追加 |
| final guard | `emlis_ai_reply_service.py` | 必須接続、fail-closed |
| batch QA | existing R6 helperの後続版、または限定新規helper | depth / skeleton / lexical QA |
| exact8 fixture | existing v2を継続 | 入力identityは変更しない |
| review receipt | 新version | 新axis・visible hash拘束 |
| device packet | RR10 / RR11用新version | actual-device証拠 |

### 19.1 新規module判断

`GroundedReceptionOpportunity` とDepth selectorがplan fileを過度に巨大化する場合、次の限定moduleを検討する。

```text
emlis_ai_grounded_human_reception_depth.py
```

ただし、次を満たす場合だけ作る。

- body-free selector ownerとして明確に分離できる。
- circular importがない。
- Surface完成文bankの置き場にならない。
- 新規fileの必要性をdependency graphで説明できる。

本設計は新規module作成を強制しない。

---

## 20. 受け入れ基準

### 20.1 Technical acceptance

- exact8 input identity不変。
- observation section hash 8/8不変。
- mandatory two-stage 8/8。
- Depth / Move plan valid 8/8。
- required Move realization 8/8。
- short water-filling 0。
- rich one-line collapse 0。
- all-input enumeration 0。
- long quote / policy exposure 0。
- self-denial safety boundary pass。
- exact sentence duplicate 0。
- skeleton / lexical concentration threshold内。
- case-specific route 0。
- API / DB / RN変更なし。

### 20.2 Product acceptance

- 入力が短いときは自然に短い。
- 入力の意味が厚いときは、Emlisの反応も複数手ある。
- 全情報へ返事するチェックリストに見えない。
- 前段の再説明に見えない。
- 同じ語尾・同じ骨格の使い回しに見えない。
- Emlis自身の人間的反応として読める。
- 華恋の複製・過剰親密さには見えない。
- また言葉を置いてもよいと思える候補である。

### 20.3 Progression acceptance

```text
Technical acceptance pass
AND 華恋local Product Read Feel pass
AND RR10 representative4 actual-device pass
AND RR11 exact8 actual-device pass
AND Mash様 Product Read Feel pass
```

全条件が揃うまでP5 / P6 / P8開始を許可しない。

---

## 21. rollback・停止条件

### 21.1 即時停止

- observation hashが変わる。
- relation方向・fact boundaryが弱くなる。
- short inputが二文以上へ水増しされる。
- layered判定がraw文字数依存になる。
- rich inputがrecoveryで一文へ縮退してpassedになる。
- case ID / fixture cue /完成文bankが追加される。
- random synonymが追加される。
- self-denial safety Moveが消える。
- public API / DB / RN変更が必要になる。
- 自動greenを理由に人間読感を省略する。

### 21.2 rollback

1. Depth / Move関連差分だけを戻す。
2. 現在成立済みの二段表示・役割分離・Safetyを保持する。
3. 旧一文Surfaceを商品合格へ戻したことにはしない。
4. R8を `REPAIR_REQUIRED` のまま維持する。
5. failure evidenceを次の設計入力にする。

### 21.3 local / actual-device矛盾

一件でも矛盾した場合:

- local human passを撤回する。
- expected visible hashを失効する。
- progressionをblockする。
- deploy lineage、runtime source、public bodyを再確認する。
- 周辺資料作業を増やして先へ進まない。

---

## 22. 性能・決定性・privacy

### 22.1 性能

- 外部AI callを追加しない。
- Opportunity抽出は既存nucleus数に対するbounded処理にする。
- 最大Opportunity選択は3件。
- batch repetition QAはoffline testで行う。
- runtimeで他ユーザー・過去requestの文を参照しない。

### 22.2 決定性

- random selectionを使わない。
- 同一input / snapshotで同一plan、同一surfaceを再現する。
- variationはMove role、act、referent kind、Surface Strategyから生じる。

### 22.3 privacy / meta

- raw memo、memo_action、surface body、anchor textをpublic metaへ入れない。
- enum、count、code、hashだけをbody-free metaに使う。
- local-only QAで本文を扱う場合は既存境界に従う。

---

## 23. 本設計で確定しないこと

- exact8各caseの最終完成文。
- 全助詞・終助詞・語彙。
- predicate familyの最終名称。
- JSON Schema実ファイルの作成。
- 新規moduleの作成。
- production deploy手順。
- P5 formal 24の開始日。
- 全未知入力の一回での合格。

一方、次は固定する。

- raw文字数ではなく意味構造でDepthを決める。
- Human Reception Moveは最大3件。
- short inputを水増ししない。
- rich inputを一つのactへ圧縮しない。
- 全入力列挙をしない。
- variationをrandom synonymで作らない。
- observationを凍結する。
- Safetyを維持する。
- representative4 → exact8の実機順を守る。
- exact8実機PASS前にP5 / P6 / P8へ進まない。

---

## 24. 実装開始前チェックリスト

```text
[ ] 最新mashos-api snapshotを再確認した
[ ] Cocolon_前提資料を再確認した
[ ] work_attitude_rules_for_karenを再確認した
[ ] 実機確認結果２の8件をinventory化した
[ ] R8をREPAIR_REQUIREDとして固定した
[ ] 旧R6 human passをprogression ownerから外した
[ ] exact8 observation section hashを凍結した
[ ] raw文字数をDepth判定へ使わない
[ ] Reception Opportunityをbody-freeで定義した
[ ] Moveは最大3件にした
[ ] short inputの水増し禁止testを先に書く
[ ] rich inputのone-line collapse REDを先に書く
[ ] case ID / fixture cue /完成文bankを使わない
[ ] random synonymを使わない
[ ] all-input enumerationを禁止する
[ ] Safety Moveをrecoveryで落とさない
[ ] human readとactual-device readを省略しない
```

---

## 25. 設計上の最終判断

現在の`Emlisから`は、以前の第二観測より、人間的な受け取りとして明確に良くなっている。文章の方向、温度、安全境界は捨てるべきではない。

しかし、入力の意味が厚い場合にも、一つのreferentと一つのpredicateで会話を終えているため、商品としてはまだ淡泊である。

ここで文字数を増やすだけでは、入力全項目への逐次返答か、一般共感の水増しになる。類語を増やすだけでは、同じ構造の表面を変えるだけになる。

したがって、次の修復が必要である。

```text
一つの入力から、Emlisが人間的に反応できる機会を複数見つける。
その中から、主役と必要な補助だけを選ぶ。
選んだ機会を、異なるHuman Reception Moveとして計画する。
Moveの数と役割に応じて、1〜3文へSurface化する。
```

この構造なら、AやI6-S03は短いまま保てる。BやCには十分な時間と言葉を返せる。I6-L03やI6-C01には、行動だけでなく、その行動が守っている意図や変化へ別の反応を返せる。DやI6-D02では、安全境界を保ったまま二文を維持できる。

本書の次工程はRR0である。

設計段階では、コード・fixture・receipt・JSON / schema・前提資料を変更しない。
