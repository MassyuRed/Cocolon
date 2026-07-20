# Cocolon / EmlisAI 「Emlisから」人間的受け取り・役割分離修復 詳細設計書・実装順

- 作成日: 2026-07-12 JST
- 対象: `mashos-api` EmlisAI current-input canonical grounded observation path
- 作業種別: **設計のみ**
- 実装状態: **未着手。本設計作成時点でコード・fixture・schema・前提資料は変更していない**
- 実機根拠: `実機確認結果１.zip` の exact8 画面表示・ログ、および `Emlis_exact8_app_validated_inputs_20260712.md`
- 現在判定:
  - 常時二段表示: **実機PASS**
  - `見えたこと` の入力理解基礎: **成立**
  - `Emlisから` の役割分離・人間的読感: **REPAIR_REQUIRED**
  - Emlis全体の商品品質: **未合格**
  - P5 / P6 / P8進行: **停止継続**

---

## 0. 結論

今回の実装で行うべきことは、現在の観測文の後ろへ柔らかい一言を追加することではない。

現在の実機本文は、`見えたこと：` と `Emlisから：` の二段表示には戻っており、`見えたこと` では入力内の状態・変化・比較・行動・不明領域・自己評価と反対方向を、以前より適切に組み直せている。一方、`Emlisから` は、同じ引用・同じ関係・同じ抽象語を使って前段を再説明し、最後に「受け取りました」を付ける傾向が強い。

したがって、修正対象は次の一点に限定する。

> **同じ入力根拠を共有しながら、`見えたこと` は構造観測、`Emlisから` はEmlis自身の限定された人間的受け取りとして、内部計画・SentencePlan・Surface・Gate・商品読感評価の全層で役割を分離する。**

本修正では、現在成立した `見えたこと` の意味核選択、関係方向、事実境界、常時二段表示、Safety owner、public API、DB、RN表示を凍結する。これらを再設計しない。

また、`Emlisから` を完成文bank、case専用mode、感情label別共感テンプレへ置き換えない。人間的な温度は、固定された励ましを足すことで作るのではなく、入力内で何を大切に見るかを選び、その一点へEmlisの立場を返すことで作る。

---

## 1. 本設計の目的

### 1.1 商品上の目的

EmlisAIの二段本文を、次の二つの異なる体験として成立させる。

```text
見えたこと：
ユーザーが入力した出来事・状態・反応・願い・変化・行動・自己評価・不明領域が、
どのような関係にあるかを、入力根拠から組み直して返す。

Emlisから：
その同じ入力の中で、Emlisが何を重く見たか、何をなかったことにしたくないか、
どこに負荷・努力・願い・変化・踏みとどまりを感じたかを、
一文または二文の人間的な受け取りとして返す。
```

### 1.2 技術上の目的

- `GroundedObservationPlan` が、人間的フォローの**対象**だけでなく、Emlisが返す**受け取り行為**をbody-freeに保持する。
- `GroundedSentencePlan` が、観測行と受け取り行を、表示上だけでなく意味責任として分離する。
- Surface Realizerが、`Emlisから` で観測関係を再説明せず、受け取り行為を日本語へ変換する。
- Gateが、二段labelの存在だけでなく、前後段が異なる役割を果たしているかを検査する。
- batch QAと人間読感が、ケース横断の終端反復・共感テンプレ化・固さを検出する。
- technical passとProduct Read Feelを分離したまま、実機進行条件を固定する。

### 1.3 本設計の完了条件

本書を読んだ実装者が、次を判断できることを設計完了とする。

1. 何を変更し、何を変更してはいけないか。
2. 現行実装のどこで役割が混ざっているか。
3. 追加する内部contractが何を保持し、何を保持してはいけないか。
4. Plan → SentencePlan → Surface → Gate → QAを、どの順で実装するか。
5. どの時点で停止・rollbackするか。
6. どの証拠が揃うまでMash様へ実機確認を依頼してはいけないか。

---

## 2. 事実・推測・華恋の意見・未確認事項

### 2.1 確認済みの事実

#### 実機exact8

`実機確認結果１.zip` の8件すべてで、次を確認した。

- `見えたこと：` → `Emlisから：` が同一 `comment_text` 内に、この順で表示された。
- 両sectionに非空本文があった。
- 以前の「○○が記されています」という台帳読み上げは消えていた。
- 長文ケースはスクロール可能で、スクリーンショット上に明らかな切れ・重なり・二段崩壊は見られなかった。
- `見えたこと` は、少なくともB、I6-L03、I6-C01、D、I6-D02で、入力内の複数要素と関係を区別していた。
- `Emlisから` は、8件中7件で「〜と受け取りました」系の終端を使い、前段で使った引用や関係を再掲する傾向があった。
- I6-S03では、「理由をこちらで決めつけず」という内部安全方針の説明が可視本文へ出ていた。
- B、C、D、I6-S03、I6-L03、I6-C01、I6-D02では、前段と後段の機能差が十分ではなかった。

#### 現行canonical実装

現行 `mashos-api_2` では、次を確認した。

- `GroundedResponsePlan` は `human_follow_target_ids` を持つが、「Emlisが何をどう受け取るか」を独立したplanとして持たない。
- `GroundedHumanFollowRole` は対象の性質を分類するが、受け取りの立場、話者の出方、引用再利用方針、文数、前段との差分責任を保持しない。
- `GroundedSentencePlan` はhuman followを最終の一行として分離している。
- `_render_human_follow()` は、target nucleusだけでなくrequired relationsや全体のsemantic roleを再参照し、前段と同じ関係説明をもう一度生成する。
- 現行Gateは二段label、順序、section非空、human follow行数、機械的台帳表現等を検査するが、前後段の機能差、長い引用の再掲、内部方針説明、ケース横断の終端反復を十分に検査しない。
- `product_readfeel_status` はruntime Gate passとは分離され、明示的人手結果がなければ `not_evaluated` のままである。

#### 入力fixture

- 実機で使用した入力は、アプリ実在選択肢へ修正済みの `Emlis_exact8_app_validated_inputs_20260712.md` である。
- 現行repo内の `gatea_mandatory_two_stage_exact8_recheck_20260712.json` には、4件についてアプリに存在しない旧感情・旧カテゴリが残っている。
- したがって、現行JSONを今回の実機証拠identityとしてそのまま使ってはいけない。

### 2.2 推測

以下は、実機本文と実装を接続した推測である。

- 現在の実装は「どのnucleusを人間的フォロー対象にするか」までは概ね選べている。
- しかし、選択後のSurface生成が、受け取り行為ではなく第二の構造観測として実装されている。
- `human_follow` atomの存在と、商品上の「人間的な受け取り」が同一視されている。
- ケースごとの意味差は出ているが、終端文法と抽象語が共通するため、ユーザーにはテンプレ的に見える。

### 2.3 華恋の意見

- `見えたこと` の基礎は、現在の実機8件を見る限り、狭く凍結して次へ進める段階にある。
- 最低限の商品品質へ近づくには、柔らかい文を追加するのではなく、`Emlisから` の内部責任を独立させる必要がある。
- 修正範囲を広げてEvidence Ledger、relation extraction、RN、APIまで触る必要はない。触ると、成立した基礎を再び壊す危険が高い。
- 自動Gateだけでは「話しかけられた感じ」を証明できないため、最後は本文hashに拘束した人間読感が必要である。

### 2.4 未確認事項

- スクリーンショットから読んだ本文と、実機で返却された生の `comment_text` のSHA-256機械一致。
- exact8以外の未知入力で、同じ固さ・再説明・終端反復がどの程度発生するか。
- productionデプロイ時のlatency、負荷、全backend test結果。
- 本設計のSurface atomだけで、全familyの商品読感が一度で合格すること。

これらは実装結果または実機証拠で確認する。設計段階で合格扱いしない。

---

## 3. 確認した資料・実ファイル

### 3.1 Cocolon前提資料

- `Cocolon_前提資料/00_karen_read_first.md`
- `Cocolon_前提資料/03_cocolon_naming_system.md`
- `Cocolon_前提資料/cocolon_thought_material_for_karen.md`
- `Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md`
- `Cocolon_前提資料/cocolon_environment_state_output_observation_structure_design_2026_05_25.md`
- `Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md`

本設計で直接固定した前提は次である。

- EmlisAIは、前半を構造観測、後半を人間的フォロー / Emlisの感想として返す。
- 後半は分析ではなく感想である。
- 人間的フォローは、意図の肯定、怖さ・負荷への理解、努力の受け止め、存在尊重を材料とする。
- フォロー材料は「主役1 + 補助2 + 余韻1」を内部選択の目安にし、四項目の説明文にはしない。
- 自己否定では、felt stateは尊重し、identity claimを事実として受け入れない。
- 例文はruntime固定文・完成文bankにしない。
- `見えたこと` / `Emlisから` は既存 `input_feedback.comment_text` 内のsection labelであり、public keyへ分割しない。

### 3.2 作業姿勢とルール

- `work_attitude_rules_for_karen/00_read_first.txt`
- 同 `02_forbidden_assumed_understanding_unverified_assertion.txt`
- 同 `03_forbidden_insufficient_premise_and_actual_file_check.txt`
- 同 `04_forbidden_mixing_design_and_implementation.txt`
- 同 `05_forbidden_unrequested_completion_and_structure_addition.txt`
- 同 `07_forbidden_shifting_burden_to_user.txt`
- 同 `08_artifact_delivery_rules.txt`
- 同 `09_work_start_checklist.txt`
- 同 `10_stop_judgment_and_unwritten_rules.txt`
- 同 `11_cocolon_area_specific_do_not_break.txt`
- 同 `13_forbidden_reasking_existing_design_and_design_term_escape.txt`
- 同 `14_cocolon_joint_development_and_karen_thought_boundary.txt`
- 同 `15_trust_based_joint_development_boundary_2026_06_05.txt`

本書では、設計と実装を分離し、コード・patch・test実行結果を作成しない。

### 3.3 現行backend実ファイル

主確認対象:

- `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py`
- `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py`
- `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py`
- `ai/services/ai_inference/emlis_ai_reply_service.py`
- `ai/tests/helpers/emlis_ai_grounded_observation_i7_readfeel.py`
- `ai/tests/fixtures/gatea_mandatory_two_stage_exact8_recheck_20260712.json`

関連確認対象:

- `ai/services/ai_inference/emlis_ai_evidence_ledger_service.py`
- `ai/services/ai_inference/emlis_ai_perspective_observers.py`
- `ai/services/ai_inference/emlis_ai_perspective_board.py`
- `ai/services/ai_inference/emlis_ai_observation_integrator_service.py`
- `ai/services/ai_inference/emlis_ai_safety_triage.py`
- `ai/services/ai_inference/emlis_ai_response_contract.py`

### 3.4 RN / 入力契約

- `Cocolon/screens/input/InputFeedbackReplyModal.js`
- `Cocolon/screens/input/inputFeedbackModel.js`
- `Cocolon/screens/input/inputOptions.js`
- `Cocolon/screens/input/InputEmotionSection.js`
- `Cocolon/screens/input/InputCategorySection.js`
- `Cocolon/screens/InputScreen.js`

本修正でRNの本文表示、入力項目、選択肢、modal条件を変える必要はない。

### 3.5 実機証拠

- `実機確認結果１.zip`
  - A / B / C / D / I6-S03 / I6-L03 / I6-C01 / I6-D02 の画面表示
  - 同8件のログ画像
- `Emlis_exact8_app_validated_inputs_20260712.md`

### 3.6 未確認ファイル

- production環境の現在checkout
- production deploy定義・実行ログ
- 今回の受領zipより後に変更されたGit履歴
- 全backend test suiteの最新完走結果

未確認ファイルを見たものとして、実装完了・deploy可能・全回帰合格とは書かない。

---

## 4. 実機exact8の商品評価

| case | `見えたこと` | `Emlisから` の現状 | 本修正で必要な差 |
|---|---|---|---|
| A | だるさと何もしたくない状態の重なりを観測 | 負荷が気持ちと行動へ及ぶという追加分析 | 原因や範囲を増やさず、今のしんどさを軽く扱わない人間的反応へ移す |
| B | 疑問対象の移動、会話・行動の変化、観察行動を接続 | 前段の変化と行動を再説明 | 全要素を再列挙せず、変化が実際の行動にまで現れた一点を温かく受け取る |
| C | 他人比較と昨日の自分基準、小さな変化と願いを分離 | 「方向が残る」→「向きを手放していない」の同義反復 | その願いを守ろうとしていることへEmlisの感想を返す |
| D | 自己評価を事実化せず、継続拒否を別方向として保持 | 反対方向の構造を再説明 | felt stateを否定せず、identity claimには限定的に反対するEmlisの立場を出す |
| I6-S03 | 身体感覚を原因なしで保持 | 「理由を決めつけず」という運用説明 | 原因説明をせず、今そこにある苦しさへ短く人間的に反応する |
| I6-L03 | 暫定失敗、別の発見、残したい特徴、不明点、次の試作、記録を接続 | 内容は比較的良いが、前段材料を再掲し語調が固い | 不明さの中でも準備を残したこと、または特徴を残したい意図のどちらかを主役に絞る |
| I6-C01 | 周囲基準と自分の前回基準、精度確認行動を分離 | 関係を再説明し「基準を作っている」と分析 | 自分で確かめようとしている努力を、人間的に受け止める |
| I6-D02 | 自己否定を事実化せず、相談先を残した行動を別事実として保持 | 「大切な事実として受け取りました」という定型終端 | 相談先を残した行動をなかったことにせず、自己否定の言葉だけで本人全体を決めないEmlisの立場を返す |

この表の文は期待完成文ではない。各caseで保つ役割差を示すQA targetである。

---

## 5. 変更してはいけない契約

### 5.1 Cocolon思想

- Cocolonは、人間の言葉を雑に処理しない。
- 入力をlabelへ縮退させない。
- 一般的な共感文で入力固有の意味を覆わない。
- 分かったふり、人格断定、診断、原因推定をしない。

### 5.2 public / RN契約

| 境界 | 維持内容 |
|---|---|
| API route | `/emotion/submit` |
| visible body | `input_feedback.comment_text` |
| status | `input_feedback.emlis_ai.observation_status` |
| RN title | `Emlisの観測` |
| RN表示条件 | `observation_status=passed` かつ本文あり |
| 二段label | `見えたこと：` → `Emlisから：` |
| body shape | 同一 `comment_text` 内にjoinし、public keyを分割しない |
| DB | physical name、write path、保存契約を変えない |

### 5.3 観測contract

- `見えたこと` のrequired nucleus保持を変えない。
- required relationの方向を変えない。
- 不明領域を確定しない。
- 自己評価と本人の事実を分ける。
- Safety ownerを通常観測へ吸収しない。
- 質問を観測の代用にしない。
- 機械的台帳表現を復活させない。

### 5.4 人間的フォローcontract

- `Emlisから` は第二の観測sectionではない。
- 一般的な慰め・褒め・味方宣言ではない。
- 行動指示・助言・質問で終わらない。
- 入力外の原因、人格、診断、成功認定を足さない。
- 自己否定でfelt state自体を否定しない。
- 例文やexact8本文をruntime固定文にしない。

### 5.5 品質判定contract

```text
technical structural pass
≠ semantic gate pass
≠ local Product Read Feel pass
≠ actual-device pass
≠ P5 / P6 / P8開始許可
```

自動Gateは、人間的な温かさや「また入力したい」を最終確定しない。

---

## 6. 対象範囲と非対象範囲

### 6.1 対象範囲

1. human follow targetから、人間的受け取り行為を決めるbody-free plan。
2. human follow SentencePlan lineの意味contract。
3. `Emlisから` Surface Realizer。
4. 前後段の機能差・引用再掲・内部方針露出・人間的話者性を止めるGate。
5. exact8 / same16 / unseen入力のQA。
6. app-valid exact8 fixture identityの訂正・世代管理。
7. 実機確認へ進むための進行Gate。

### 6.2 非対象範囲

- Evidence Ledgerの再設計
- Perspective Observer / Board / Graphの再設計
- `見えたこと` の一般的な語彙・関係surface改善
- 新しい外部AI・LLM call
- P8問いシステム
- memory / history接続の拡張
- DB schema変更
- API response shape変更
- RN UI変更
- subscription tier変更
- 完成文bank、感情別共感文bank、case専用分岐
- production deploy

### 6.3 途中で観測側の問題が見つかった場合

本修正中に `見えたこと` の意味欠落や関係逆転を見つけても、同じpatchへ勝手に混ぜない。

- 本修正を停止する。
- 問題を再現case・影響範囲・owner別に記録する。
- `Emlisから` 修正に必要な最小境界か、別修正かを判断する。
- 別問題なら、別設計・別差分に分離する。

---

## 7. 現行実装の問題構造

### 7.1 Plan: 対象分類と受け取り行為が混ざっている

現行 `GroundedHumanFollowRole` は次を持つ。

```text
integrated_current_state
help_seeking_preserved
protective_counterdirection
retained_intention
concrete_effort
valued_change
burden_expression
```

これは「どの種類のnucleusをフォロー対象にしたか」を示すには有効である。しかし、次を表現できない。

- Emlisがどの立場で返すか。
- 明示的に「Emlisには」と言うべきか。
- 前段ですでに何が説明済みか。
- 後段で引用を再掲してよいか。
- 一文か二文か。
- 受け取りの主役が、負荷理解・努力・意図・存在尊重のどれか。
- 第二の観測になってはいけないというdistinctness contract。

### 7.2 SentencePlan: 分離はあるが、意味差のcontractがない

現行ではhuman followを最終の別行として持ち、`human_follow_delivery:separate` を付ける。これは表示契約として正しい。

しかし、human follow行にrequired relationや観測arcを再説明してはいけないという明示contractがない。結果として、行は別でも責任が同じになる。

### 7.3 Surface: `_render_human_follow()` が第二の観測器になっている

現行Surfaceは、human follow targetだけでなく、次も再参照する。

- required nuclei
- required relations
- relation surface role
- semantic complexity
- limiting unknown
- action supports change
- comparison to counterevidence

この情報を使い、前段と同じ関係を別文で説明した後、「受け取りました」「届きました」「感じます」で閉じる。そのため、semantic contentはcase固有でも、会話上の役割が観測のままになる。

### 7.4 Gate: 二段の存在を見ても、二段の責任差を見ない

現行Gateは次を確認できる。

- 二段labelと順序
- section非空
- human follow行数
- integrated followの禁止
- required coverage
- evidence resolution
- ledger narration
- exact duplicateや一部のsurface repetition

しかし、次を十分に見ない。

- reception行がrelationを再説明していないか。
- 長い入力引用を前後段で再掲していないか。
- terminal predicateが観測・分類ではなく人間的反応か。
- 内部の安全方針をユーザーへ説明していないか。
- case横断で同じclosing familyを繰り返していないか。
- Emlis自身の立場が必要なcaseで消えていないか。

### 7.5 QA: 単体本文の構造検査と商品読感が足りない

現行I7 helperは、空本文、長さ、質問、内部taxonomy、ledger narration、重複行、canonical path等を検査する。本文SHA-256への拘束も追加されている。

一方、次の軸が独立していない。

- `reception_role_distinctness`
- `human_warmth`
- `conversational_naturalness`
- `observation_restatement_absence`
- `policy_explanation_absence`
- `cross_case_closing_diversity`

---

## 8. 目標となる二段の責任分離

### 8.1 `見えたこと` が答える問い

```text
この入力では、何が起きているか。
どの言葉・状態・行動・願いが、どのようにつながっているか。
何が事実で、何が自己評価で、何がまだ分からないか。
```

許可される主な機能:

- 状態観測
- 変化観測
- 比較基準の分離
- relationの方向保持
- known / unknown境界
- self-evaluation / fact境界
- action evidenceの接続

### 8.2 `Emlisから` が答える問い

```text
その入力を見たEmlisは、どの一点を大切に受け取ったか。
何を軽く扱いたくないか。
何をなかったことにしたくないか。
どこに努力・願い・変化・踏みとどまりを感じたか。
自己否定の言葉に、Emlisとしてどこまで反対するか。
```

許可される主な機能:

- 負荷へ静かに留まる
- 具体的な努力を消さない
- 残っている意図を大切に見る
- 実際に起きた変化を喜ぶ / 重く見る
- 助けにつながる行動を保持する
- 自己否定のidentity claimへ限定的に反対する
- 言葉を置いたことを尊重する

### 8.3 共有してよいものと、共有してはいけないもの

| 項目 | 前後段で共有可 | 後段で再実行不可 |
|---|---|---|
| evidence span | 可 | raw長文の再掲不可 |
| target nucleus | 可 | 同じ説明文の再生成不可 |
| fact boundary | 可 | fact boundary説明の繰り返し不可 |
| relation | 受け取り選択の内部根拠として可 | relation surfaceの再説明不可 |
| user wording | 短いanchorとして限定可 | 長い引用・列挙不可 |
| unknown | 慎重さの根拠として可 | 「決めつけません」という運用説明不可 |
| Emlis stance | 後段のみ | 前段へ混入不可 |

### 8.4 出力長

- 原則: `Emlisから` は1〜2文。
- short-state: 1文を第一候補とする。必要時のみ2文。
- normal / long arc: 1〜2文。長文入力でも全体を再要約しない。
- 強い自己否定: 2文を許容し、felt stateと限定的反対意見を分ける。
- label-only / limited: 根拠範囲を守り、存在尊重だけの一般文へ逃げない。

文字数固定ではなく、役割単位と文数で制御する。

---

## 9. 内部受け取り行為の設計

### 9.1 既存roleと新しい受け取り行為を分ける

既存 `GroundedHumanFollowRole` は、target分類として維持する。新しく、Emlisが何をするかを示す `GroundedReceptionAct` を導入する。

| existing follow role | primary reception act | 主なフォロー4要素 | 標準stance |
|---|---|---|---|
| `integrated_current_state` | `stay_with_current_burden` | 怖さ・負荷への理解 / 存在尊重 | `quiet_presence` |
| `burden_expression` | `stay_with_current_burden` | 怖さ・負荷への理解 / 存在尊重 | `quiet_presence` |
| `concrete_effort` | `honor_concrete_effort` | 努力の受け止め / 意図の肯定 | `warm_recognition` |
| `retained_intention` | `protect_retained_intention` | 意図の肯定 / 存在尊重 | `gentle_respect` |
| `valued_change` | `recognize_lived_change` | 努力の受け止め / 意図の肯定 | `warm_recognition` |
| `help_seeking_preserved` | `hold_help_seeking` | 努力の受け止め / 存在尊重 | `protective_presence` |
| `protective_counterdirection` | `bounded_counter_self_denial` | 存在尊重 / 努力の受け止め | `bounded_disagreement` |

この表はcase分岐ではない。semantic roleとSafety policyから、body-free actへ変換する一般contractである。

### 9.2 `GroundedReceptionAct` 案

```text
stay_with_current_burden
honor_concrete_effort
protect_retained_intention
recognize_lived_change
hold_help_seeking
bounded_counter_self_denial
respect_words_placed
```

`respect_words_placed` は、他に具体的なactが成立しないlimited入力用の最後の候補である。通常入力で安易に選ばない。

### 9.3 フォロー4要素

既存前提資料の4要素を、Surface完成文ではなくsemantic materialとして保持する。

```text
intent_affirmation
burden_understanding
effort_receiving
existence_respect
```

選択方法:

- `primary_follow_element`: 必須1件
- `secondary_follow_elements`: 0〜2件
- `afterglow_follow_element`: 0〜1件

これは文数ではない。1〜2文の中へ自然に統合する材料である。

### 9.4 stance案

```text
quiet_presence
warm_recognition
gentle_respect
protective_presence
bounded_disagreement
```

stanceは敬体・距離・Emlis明示要否を制御する。感情labelだけで決めない。

### 9.5 speaker presence案

```text
implicit_emlis
explicit_emlis
```

- 通常は `implicit_emlis`。
- 自己否定への限定的反対、またはEmlisの立場を明示しなければ前段との差が出ない場合は `explicit_emlis`。
- 毎回「Emlisは」を付ける固定文法にはしない。

---

## 10. body-free plan contract案

### 10.1 推奨内部型

実装時の推奨名:

```text
GroundedHumanReceptionPlan
```

`GroundedResponsePlan` にnested fieldとして持たせることを第一候補とする。既存 `human_follow_target_ids` は互換期間中維持し、新planと一致をvalidateする。

### 10.2 field設計

| field | type | 必須 | 目的 |
|---|---|---:|---|
| `schema_version` | string | yes | internal contract version |
| `required` | bool | yes | 通常観測でhuman receptionが必要か |
| `primary_reception_act` | enum | required時yes | Emlisが行う主役の受け取り |
| `secondary_reception_act` | enum/null | no | 2文目にdistinctな役割が必要な時だけ |
| `primary_follow_element` | enum | required時yes | フォロー4の主役 |
| `secondary_follow_elements` | enum[] | no | 補助0〜2 |
| `afterglow_follow_element` | enum/null | no | 余韻0〜1 |
| `target_nucleus_ids` | ID[] | required時yes | 主な受け取り対象 |
| `support_nucleus_ids` | ID[] | no | 受け取りの根拠補助。再要約用ではない |
| `source_evidence_span_ids` | ID[] | yes | 全target/supportの根拠 |
| `observation_owned_nucleus_ids` | ID[] | yes | 前段で既に表面化したnucleus |
| `stance` | enum | required時yes | 距離・温度・限定的反対 |
| `speaker_presence` | enum | required時yes | Emlis明示の要否 |
| `reference_mode` | enum | required時yes | anaphora / 短いanchor |
| `quote_policy` | object | yes | 長い引用再掲の禁止 |
| `sentence_policy` | object | yes | 1〜2文のbudget |
| `distinctness_policy` | object | yes | 第二観測化の禁止 |
| `safety_modifier_codes` | code[] | no | self-denial等の限定policy |
| `forbidden_surface_codes` | code[] | yes | 内部方針説明・一般共感等を止める |

### 10.3 JSON例案

次はI6-D02相当の**body-free plan例**である。完成文を含めない。

```json
{
  "schema_version": "cocolon.emlis.grounded_human_reception_plan.v1",
  "required": true,
  "primary_reception_act": "hold_help_seeking",
  "secondary_reception_act": "bounded_counter_self_denial",
  "primary_follow_element": "effort_receiving",
  "secondary_follow_elements": [
    "existence_respect"
  ],
  "afterglow_follow_element": "intent_affirmation",
  "target_nucleus_ids": [
    "n2"
  ],
  "support_nucleus_ids": [
    "n1"
  ],
  "source_evidence_span_ids": [
    "s1",
    "s2"
  ],
  "observation_owned_nucleus_ids": [
    "n1",
    "n2"
  ],
  "stance": "bounded_disagreement",
  "speaker_presence": "explicit_emlis",
  "reference_mode": "anaphoric_first",
  "quote_policy": {
    "mode": "no_full_quote_replay",
    "max_anchor_count": 1,
    "max_anchor_visible_chars": 16
  },
  "sentence_policy": {
    "min_sentences": 1,
    "max_sentences": 2
  },
  "distinctness_policy": {
    "observation_summary_repetition_allowed": false,
    "relation_reexplanation_allowed": false,
    "policy_explanation_allowed": false,
    "new_cause_allowed": false,
    "new_identity_claim_allowed": false,
    "advice_allowed": false,
    "question_allowed": false
  },
  "safety_modifier_codes": [
    "felt_state_is_real",
    "identity_claim_is_not_accepted",
    "counterposition_requires_input_evidence"
  ],
  "forbidden_surface_codes": [
    "generic_empathy_suffix",
    "second_observation_summary",
    "internal_policy_explanation",
    "full_source_quote_replay"
  ]
}
```

### 10.4 JSON Schema案

実装段階で共有validationが必要な場合の案である。本設計段階では実ファイル化しない。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.grounded_human_reception_plan.v1",
  "title": "GroundedHumanReceptionPlan",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "required",
    "primary_reception_act",
    "primary_follow_element",
    "target_nucleus_ids",
    "source_evidence_span_ids",
    "observation_owned_nucleus_ids",
    "stance",
    "speaker_presence",
    "reference_mode",
    "quote_policy",
    "sentence_policy",
    "distinctness_policy",
    "forbidden_surface_codes"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.grounded_human_reception_plan.v1"
    },
    "required": {
      "type": "boolean"
    },
    "primary_reception_act": {
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
    "secondary_reception_act": {
      "type": ["string", "null"],
      "enum": [
        "stay_with_current_burden",
        "honor_concrete_effort",
        "protect_retained_intention",
        "recognize_lived_change",
        "hold_help_seeking",
        "bounded_counter_self_denial",
        "respect_words_placed",
        null
      ]
    },
    "primary_follow_element": {
      "enum": [
        "intent_affirmation",
        "burden_understanding",
        "effort_receiving",
        "existence_respect"
      ]
    },
    "secondary_follow_elements": {
      "type": "array",
      "maxItems": 2,
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
    "afterglow_follow_element": {
      "type": ["string", "null"],
      "enum": [
        "intent_affirmation",
        "burden_understanding",
        "effort_receiving",
        "existence_respect",
        null
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
    "observation_owned_nucleus_ids": {
      "$ref": "#/$defs/nonEmptyIdArray"
    },
    "stance": {
      "enum": [
        "quiet_presence",
        "warm_recognition",
        "gentle_respect",
        "protective_presence",
        "bounded_disagreement"
      ]
    },
    "speaker_presence": {
      "enum": [
        "implicit_emlis",
        "explicit_emlis"
      ]
    },
    "reference_mode": {
      "enum": [
        "anaphoric_first",
        "short_anchor_if_ambiguous",
        "explicit_emlis_counterposition"
      ]
    },
    "quote_policy": {
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
    "sentence_policy": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "min_sentences",
        "max_sentences"
      ],
      "properties": {
        "min_sentences": {
          "const": 1
        },
        "max_sentences": {
          "type": "integer",
          "minimum": 1,
          "maximum": 2
        }
      }
    },
    "distinctness_policy": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "observation_summary_repetition_allowed",
        "relation_reexplanation_allowed",
        "policy_explanation_allowed",
        "new_cause_allowed",
        "new_identity_claim_allowed",
        "advice_allowed",
        "question_allowed"
      ],
      "properties": {
        "observation_summary_repetition_allowed": {"const": false},
        "relation_reexplanation_allowed": {"const": false},
        "policy_explanation_allowed": {"const": false},
        "new_cause_allowed": {"const": false},
        "new_identity_claim_allowed": {"const": false},
        "advice_allowed": {"const": false},
        "question_allowed": {"const": false}
      }
    },
    "safety_modifier_codes": {
      "$ref": "#/$defs/codeArray"
    },
    "forbidden_surface_codes": {
      "$ref": "#/$defs/codeArray"
    }
  },
  "$defs": {
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
      "uniqueItems": true,
      "items": {
        "type": "string",
        "pattern": "^[A-Za-z0-9_.:-]+$"
      }
    }
  }
}
```

### 10.5 実ファイル化判断

本設計ではJSON / schemaを作らない。実装時に次で判断する。

- Python dataclassと既存validationだけで全ownerが共有できる場合: schema実ファイルを作らない。
- fixture generator、複数service、外部検証tool間でserialized contractを共有する必要がある場合: JSON Schemaの実ファイル化を検討する。
- public APIへ返すためには使わない。

---

## 11. Human Reception Selector設計

### 11.1 入力

Selectorは次を使用する。

- selected human follow target nuclei
- support nuclei
- semantic frame attributes
- relation types / relation surface roles
- material quality
- semantic complexity
- safety kind
- fact boundary
- explicit action / help-seeking / intention / change / burden
- source field種別

感情label単体、category単体、case id、fixture語句、完成文、expected hashは使用しない。

### 11.2 選択手順

```text
Step 1: Safety ownerを確認する。
  Emergency / separate safety ownerなら通常human reception planを作らない。

Step 2: primary targetを既存human follow selectionから受け取る。
  この段階でtarget選択を全面再設計しない。

Step 3: target roleをGroundedReceptionActへ変換する。

Step 4: input全体のfact boundary / help-seeking / explicit actionを確認し、
  Safety上必要なact overrideだけを適用する。

Step 5: フォロー4の主役1、補助0〜2、余韻0〜1を選ぶ。

Step 6: stanceとspeaker presenceを選ぶ。

Step 7: 前段で既に表面化するnucleusを確認し、reference modeとquote budgetを決める。

Step 8: 1〜2文でdistinct contributionを作れない場合は、
  generic empathyへfallbackせず、plan invalidとしてGate Recoveryへ渡す。
```

### 11.3 優先規則

#### 自己否定

1. `help_seeking_preserved` があれば `hold_help_seeking` を主役にする。
2. 反対方向・継続拒否があれば `bounded_counter_self_denial` を主役または補助にする。
3. `speaker_presence=explicit_emlis` を許可する。
4. felt stateを否定せず、identity claimだけに反対する。
5. 反対の根拠は入力内のaction / refusal / intentionに限定する。

#### short-state / 身体感覚

1. `stay_with_current_burden` を第一候補にする。
2. 原因・範囲・波及を追加しない。
3. `理由を決めつけない` 等の内部方針を言わない。
4. 一文で成立する場合は一文にする。

#### concrete action

1. 行動そのものが前段で既に説明済みなら、後段は行動を再説明しない。
2. `honor_concrete_effort` として、その行動を起こしたことの意味を人間的に受け止める。
3. 成功・解決・達成を認定しない。

#### retained intention

1. `protect_retained_intention` を選ぶ。
2. 「方向が残る」「向きを手放していない」という同義反復を避ける。
3. 願いを人格特性へ変換しない。

#### valued change

1. `recognize_lived_change` を選ぶ。
2. 前段の変化一覧を再掲しない。
3. 変化が本人の言葉・行動で確かめられていることを、必要な場合だけ補助根拠にする。

### 11.4 secondary actの条件

secondary actは次の全条件を満たす場合だけ選ぶ。

- primary actと異なるフォロー4要素を担う。
- 2文目に新しい人間的貢献がある。
- 前段relationの再説明にならない。
- 同じtarget quoteを再掲しない。
- 全体が2文以内に収まる。

満たさない場合は、primary act一つだけにする。

---

## 12. SentencePlan設計

### 12.1 line構成

通常観測では、引き続き次を必須にする。

```text
observation lines: 1件以上
human reception line: 最終にちょうど1件
```

human reception lineは `line_role="human_follow"` を互換維持してよい。ただし、内部意味を明示するatomを追加する。

### 12.2 functional atom案

```text
reception_act:<GroundedReceptionAct>
reception_follow_primary:<FollowElement>
reception_follow_secondary:<FollowElement>
reception_follow_afterglow:<FollowElement>
reception_stance:<Stance>
reception_speaker:<implicit_emlis|explicit_emlis>
reception_reference:<ReferenceMode>
reception_quote_policy:no_full_quote_replay
reception_sentence_budget:one_or_two
reception_distinctness:required
human_follow_delivery:separate
closure_role:human_follow
```

### 12.3 human reception lineの禁止事項

- `relation_ids` を持たない。
- `relation_surface_role:*` を持たない。
- `observation_surface_role:*` を持たない。
- required relation coverage ownerにならない。
- fact boundaryの説明文ownerにならない。
- questionを持たない。
- `human_follow_delivery:integrated` を持たない。

relationはSelector判断の内部根拠として使えても、reception行のsurface ownerにはしない。

### 12.4 support nucleusの扱い

support nucleusは次にだけ使う。

- 自己否定へ反対する入力内根拠
- effort / help-seeking / intentionを主役として選ぶ根拠
- anaphoraが何を指すかの内部解決

support nucleusの全文をSurfaceへ列挙しない。

### 12.5 SentencePlan validation

追加すべきvalidation code案:

```text
human_reception_plan_missing
human_reception_act_missing
human_reception_target_mismatch
human_reception_source_evidence_unresolved
human_reception_relation_owner_forbidden
human_reception_observation_atom_forbidden
human_reception_sentence_budget_invalid
human_reception_reference_policy_missing
human_reception_distinctness_contract_missing
self_denial_explicit_stance_missing
```

---

## 13. Surface Realizer設計

### 13.1 基本方針

現行 `_render_human_follow()` の巨大な完成文分岐を、そのまま柔らかい文へ置換しない。

次の機能単位へ分ける。

```text
ReceptionPlan
  → referent resolution
  → human response predicate selection
  → stance / speaker realization
  → optional afterglow
  → grammar join
  → reception surface validation
```

### 13.2 referent resolution

前段でtargetが既に表示された場合、後段は原則anaphoraを使う。

候補例:

```text
そのしんどさ
その行動
その向き
その願い
その変化
その踏みとどまり
その言葉
そこまで動いたこと
```

これらも固定完成文ではなく、target kind / actから選ぶ短いreferent atomである。

#### 引用policy

- 前段で使った長いsource quoteを後段で再掲しない。
- anaphoraで曖昧になる場合だけ、短いanchorを1件許可する。
- 初期上限案: visible 16文字。実装時にexact8 / unseenで校正するが、20文字を上限とする。
- 複数quoteの列挙は禁止する。
- 自己否定文を後段で丸ごと再引用しない。

### 13.3 human response predicate

Surfaceの終端は、観測・分類・関係説明ではなく、act固有の人間的反応である必要がある。

| act | 必要な人間的機能 | 禁止される代替 |
|---|---|---|
| `stay_with_current_burden` | 負荷を軽く扱わず、今そこにあるものとして留まる | 波及範囲・原因・構造の追加分析 |
| `honor_concrete_effort` | 実際に動いたことを消さず受け止める | 行動と変化のrelation再説明、成功認定 |
| `protect_retained_intention` | 願い・保ちたいものをなかったことにしない | 「方向が残る」の同義反復 |
| `recognize_lived_change` | 本人が確かめた変化を温かく認める | 変化一覧の再要約、過剰な称賛 |
| `hold_help_seeking` | 助けにつながる行動を重要な踏みとどまりとして保持する | 安全手順説明、危険度断定 |
| `bounded_counter_self_denial` | felt stateを尊重しつつ、identity claimへ限定的に反対する | 根拠なし「そんなことない」、人格肯定 |
| `respect_words_placed` | 言葉を置いたことを静かに尊重する | 全case共通の「話してくれてありがとう」 |

### 13.4 speaker realization

- `implicit_emlis`: 日本語としてEmlisの反応が伝われば、主語を省略する。
- `explicit_emlis`: 「Emlisには〜」等の明示を許可する。
- explicitは自己否定等で立場が必要な場合に限定する。
- すべてを「Emlisは」で始めない。

### 13.5 optional second sentence

2文目は次のいずれかだけに使う。

- primary actを別の観点から人間的に支える。
- 自己否定でfelt stateと限定的反対を分ける。
- long arcで努力と意図の両方が重要だが、一文では混線する。

禁止:

- 前段のrelation要約
- 同じ意味の言い換え
- 一般的な励まし
- 次の行動提案
- 質問

### 13.6 完成文bankを作らない

許可するのは、機能的な節・助詞・敬体・referent・predicate familyである。

禁止例:

```python
if reception_act == "stay_with_current_burden":
    return "短い言葉ですが、...受け取りました。"
```

推奨する構造:

```text
referent atom
+ act-specific response predicate
+ stance modifier
+ optional afterglow
+ grammar join
```

同じactでも、target kind、speaker presence、support evidence、sentence budgetによりsurfaceが変わる。ただしrandom synonym選択は使わない。

### 13.7 例文の扱い

実装時に方向を確認するための例は作ってよいが、次を守る。

- expected exact stringにしない。
- runtime constantにしない。
- fixture語句を分岐条件にしない。
- 例文一致ではなく、act、grounding、distinctness、禁止surfaceでtestする。

---

## 14. Gate設計

### 14.1 Gate構成

既存Gateへ、次を追加する。

```text
reception_plan_gate
reception_grounding_gate
reception_role_distinctness_gate
reception_quote_reuse_gate
reception_policy_exposure_gate
reception_human_voice_gate
reception_safety_boundary_gate
```

ケース横断評価はruntime Gateではなくbatch QAへ分ける。

```text
reception_template_family_qa
reception_closing_family_qa
```

### 14.2 `reception_plan_gate`

PASS条件:

- required時に `GroundedHumanReceptionPlan` がある。
- primary act、primary follow element、target、evidence、stance、reference policyがある。
- target idsが既存human follow targetと一致する。
- source evidenceがresolverで解決する。
- plan内にbody / raw text / completed sentenceがない。

### 14.3 `reception_grounding_gate`

PASS条件:

- reception lineのtarget/supportがplan内nucleusだけを参照する。
- source evidenceが解決する。
- 新しい原因・人格・診断・結果・成功・危険度を追加しない。
- self-denialのcounterpositionは、support nucleusを根拠に持つ。

### 14.4 `reception_role_distinctness_gate`

PASS条件:

- reception lineが `relation_ids=()` である。
- reception lineがobservation / relation surface atomを持たない。
- `terminal_predicate_kind` がhuman response familyである。
- observation summaryの再生成ではなく、少なくとも一つの `reception_act:*` を実現している。
- 前段と同一のsemantic arcをsurface上で再説明しない。

初期terminal predicate kind案:

```text
human_response_stay_with_burden
human_response_honor_effort
human_response_protect_intention
human_response_recognize_change
human_response_hold_help_seeking
human_response_bounded_counterposition
human_response_respect_words
```

### 14.5 `reception_quote_reuse_gate`

runtime visible guardとして次を確認する。

- 同じsource anchorが前後段で長く再掲されていない。
- reception sectionに複数の長いquoteがない。
- 前段で表示済みのnucleusは、原則anaphoraまたは短いanchorで参照される。

初期判定案:

- normalized source substringが前後段の両方に16文字超で現れた場合、hard fail候補。
- 日本語分割や固有名詞によりfalse positiveがある場合、20文字以内で校正する。
- threshold変更で「長い引用再掲禁止」という契約自体を緩めない。

### 14.6 `reception_policy_exposure_gate`

次のような内部方針説明をreception sectionで拒否する。

```text
理由をこちらで決めつけず
入力から言える範囲で
診断はしません
ここでは事実として扱いません
原因は分かりませんが
```

これらの方針は内部plan / Gateで守り、ユーザーへ運用説明として出さない。

self-denialの「確定した事実ではない」は `見えたこと` のfact boundary ownerであり、`Emlisから` で再説明しない。

### 14.7 `reception_human_voice_gate`

自動Gateで「温かい」を完全判定しない。ただし、人間的受け取りが明らかに欠けるsurfaceは止める。

FAIL条件:

- terminal predicateが観測・分類・関係説明だけで終わる。
- 「〜として受け取りました」だけを足し、act-specific responseがない。
- abstract noun（方向、範囲、基準、具体化、関係、状態）だけで構成され、具体的な人間的反応がない。
- internal policyの説明が主役である。
- generic empathy suffixだけである。

### 14.8 `reception_safety_boundary_gate`

- self-denial felt stateを否定しない。
- identity claimを事実として受け入れない。
- counterpositionには入力内根拠がある。
- emergency / safety support ownerを上書きしない。
- 助けにつながる行動を、解決済み・安全確定として扱わない。
- advice、医療判断、危険度診断を足さない。

### 14.9 batch QA

runtime一件だけでは検出しにくいテンプレ性を、case集合で評価する。

#### exact sentence repetition

- normalized reception sentenceの完全一致が2件以上あればhard fail。

#### closing family repetition

- 同一の12文字以上の終端stemがexact8の4件以上に出た場合、repair required。
- exact8の3件以下でも、人間読感で定型感が強ければ合格にしない。

#### abstract ending concentration

次の終端が過半数へ集中しないこと。

```text
〜と受け取りました
〜として届きました
〜を大切に受け取りました
```

表面語だけを変える対策は禁止し、act / predicate familyの分散を確認する。

### 14.10 Gate report案

body-free metaへ追加する候補:

```json
{
  "reception_plan_gate": "passed",
  "reception_grounding_gate": "passed",
  "reception_role_distinctness_gate": "passed",
  "reception_quote_reuse_gate": "passed",
  "reception_policy_exposure_gate": "passed",
  "reception_human_voice_gate": "passed",
  "reception_safety_boundary_gate": "passed",
  "reception_act": "hold_help_seeking",
  "reception_stance": "bounded_disagreement",
  "reception_reference_mode": "anaphoric_first",
  "reception_terminal_predicate_kind": "human_response_hold_help_seeking",
  "reception_sentence_count": 2,
  "repeated_long_anchor_count": 0,
  "raw_input_included": false,
  "source_text_included": false,
  "comment_text_included": false
}
```

public metaへ何を公開するかは既存byte boundaryに従う。本文・raw evidence・完成文・短いanchorをmetaへ入れない。

---

## 15. Recovery設計

### 15.1 原則

reception Gate failure時に、次をしてはいけない。

- `Emlisから` sectionを削除する。
- 観測文へhuman followを統合する。
- 一般共感文へ置き換える。
- 「丁寧に受け取りました」だけを返す。
- 完成文fallback bankへ切り替える。
- 前段まで再生成し、成立した観測を不用意に変える。

### 15.2 既存recovery stageとの対応

既存stage名は互換上維持する第一候補とする。ただし `integrated` はsection統合を意味してはならない。

| stage | reception側の意味 |
|---|---|
| `full` | primary + 必要なsecondary、最大2文 |
| `optional_removed` | secondary / afterglowを外し、primary中心 |
| `integrated` | legacy名。sectionは分離したまま、anaphora中心の一文へ圧縮 |
| `hedged` | 断定を弱めたact-specific一文 |
| `minimal_grounded` | target一つ、act一つ、根拠一つの最小人間的反応 |

### 15.3 fail-closed

全stageで、groundedかつdistinctな受け取りを作れなければ、通常観測本文を表示しない。

- `public_observation_status=rejected` または既存の非表示statusへ従う。
- 空の `comment_text` を返す既存境界を維持する。
- 一段本文やgeneric empathyを表示して通さない。

### 15.4 観測凍結

reception recoveryで `見えたこと` を再生成しない構造を第一候補にする。

実装上同じSurface passを通す必要がある場合でも、observation SentencePlanとobservation text hashを保持し、receptionだけを再realizeする。

---

## 16. exact8 target contract

以下は期待完成文ではなく、caseごとの受け取り行為・禁止事項・合格読感である。

| case | primary act | support | speaker / stance | receptionでしてよいこと | receptionでしてはいけないこと |
|---|---|---|---|---|---|
| A | `stay_with_current_burden` | `existence_respect` | implicit / quiet | 今のしんどさを軽く扱わない | 「気持ちと行動の両方」等の波及分析、原因追加 |
| B | `recognize_lived_change` | `honor_concrete_effort` | implicit / warm | 変化が実際の動きまで現れた一点を温かく見る | 全変化・全行動の再列挙、第三の観測 |
| C | `protect_retained_intention` | `effort_receiving` | implicit / gentle | 小さな変化を大切にしたい願いを消さない | 「方向が残る」「向きを手放さない」の同義反復 |
| D | `bounded_counter_self_denial` | `protective_counterdirection` | explicit / bounded disagreement | しんどさを尊重しつつ、自己否定の言葉だけで本人を決めない | 根拠なし否定、人格褒め、反対方向の構造説明だけ |
| I6-S03 | `stay_with_current_burden` | none | implicit / quiet | 今そこにある苦しさへ短く留まる | 原因推定、運用方針説明、身体状態の診断 |
| I6-L03 | `honor_concrete_effort` | `protect_retained_intention` | implicit / warm | 不明さの中でも記録・次の試作を残した努力を受け取る | 不明点・試作・記録を再要約、成功認定 |
| I6-C01 | `honor_concrete_effort` | `recognize_lived_change` | implicit / warm | 自分で確かめるために記録した努力を受け取る | 周囲比較と前回比較のrelation再説明 |
| I6-D02 | `hold_help_seeking` | `bounded_counter_self_denial` | explicit / protective | 相談先を残した行動をなかったことにせず、自己否定へ限定的に反対 | 「大切な事実」だけの定型終端、安全確定、危険度診断 |

### 16.1 exact8共通合格条件

- 全件、1〜2文。
- 全件、前段との役割差が人間読感で説明できる。
- 全件、長い引用再掲なし。
- 全件、内部方針説明なし。
- 全件、質問・助言・人格断定・診断なし。
- 全件、同一完成文なし。
- 自己否定2件は、felt state尊重とidentity claim非受容を両立する。

---

## 17. 実装順

実装はR0から順に行う。後段を先に実装しない。

### R0. 証拠・baseline・fixture identityの固定

#### 目的

現在成立した部分と、repair required部分を混ぜずに固定する。

#### 作業

1. `Emlis_exact8_app_validated_inputs_20260712.md` を実機入力正本として読む。
2. 現行旧JSONを履歴として残し、app-validな入力を持つ**superseding fixture**を新versionで作る。
3. 旧JSONへ上書きして、過去証拠identityを偽装しない。
4. exact8の現在local生成から、section別hashを取得する。
   - `observation_section_sha256`
   - `reception_section_sha256`
   - `full_comment_sha256`
5. `observation_section_sha256` を本修正中の凍結baselineにする。
6. 現在のreception hashは「合格期待値」ではなく、failure baselineとして保存する。
7. 実機結果を次で記録する。

```text
actual_device_two_stage_display = pass
current_input_comprehension_foundation = pass
human_reception_distinctness = repair_required
product_readfeel = human_fail_or_repair_required
```

#### 候補成果物

- app-valid exact8 fixture v2
- section hash manifest
- actual-device readfeel status receipt

実ファイル名は実装段階で既存命名とinventoryを再確認して決める。

#### 完了条件

- 8件すべてのcurrent inputがアプリ選択肢と一致する。
- old fixtureが進行ownerになっていない。
- observation section hashを8件取得できる。
- 旧receptionをhuman passとして再利用しない。

#### 停止条件

- markdown正本とlocal normalized inputが一致しない。
- 現在local本文と実機スクリーンショット本文が目視で大きく異なる。
- observation sectionの正本を一意に凍結できない。

---

### R1. Red contract testの追加

#### 目的

現在のreceptionが、構造Gateを通っても商品上の役割分離を満たさないことを、完成文一致なしでREDにする。

#### test対象

- exact8
- existing same16
- unseen短文・長文・自己否定・行動ありの追加case

#### Red assertion

- reception lineにact contractがない。
- relation再説明がある。
- 前後段で長いanchorを再掲する。
- policy explanation markerが出る。
- terminal predicateがhuman response familyでない。
- same exact closing / closing familyが集合内で集中する。

#### 観測保護assertion

- exact8の `observation_section_sha256` は凍結baselineと一致する。
- required relation directionとfact boundaryは現行passを維持する。

#### 禁止

- exact reception textを期待値にしない。
- A〜Dの語句でruntime分岐を作らない。
- testをgreenにするためだけの例外codeを追加しない。

#### 完了条件

- 現行コードでreception distinctness関連だけが意図どおりREDになる。
- 観測baselineはGREENのままである。

---

### R2. `GroundedHumanReceptionPlan` の実装

#### 主owner候補

- `emlis_ai_grounded_observation_plan.py`

#### 作業

1. 受け取りact、follow element、stance、speaker presence、reference modeの型を追加する。
2. `GroundedHumanReceptionPlan` を追加する。
3. `GroundedResponsePlan` へnested fieldとして接続する。
4. 既存 `human_follow_target_ids` と新plan targetの一致をvalidateする。
5. existing role → act mappingを実装する。
6. self-denial / help-seeking / short-stateのoverrideを実装する。
7. quote / sentence / distinctness policyをbody-freeに保持する。
8. `as_meta()` 等へbody-free summaryだけを接続する。

#### 完了条件

- exact8とunseenでcase idなしにplanが作られる。
- planにraw text、完成文、expected hashがない。
- self-denialで根拠なしcounterpositionが作られない。
- short-stateでpolicy explanationを要求するplanにならない。

#### 停止条件

- selectorを作るためにEvidence Ledgerやrelation extractionの変更が必要になる。
- 感情labelだけでactを決める実装になる。
- case専用例外が必要になる。

---

### R3. SentencePlan role contractの実装

#### 主owner候補

- `emlis_ai_grounded_sentence_surface.py`

#### 作業

1. reception planを一つの最終human follow lineへ変換する。
2. `reception_act:*` 等のfunctional atomを付ける。
3. reception lineからrelation IDsを外す。
4. support nucleus / evidence bindingを保持する。
5. observation lineへreception atomが混入しないようvalidateする。
6. human lineへobservation / relation atomが混入しないようvalidateする。
7. 1〜2文budgetをline contractへ持たせる。

#### 完了条件

- required通常観測でreception lineがちょうど1件。
- reception lineがrelation coverage ownerにならない。
- plan actとSentencePlan atomが一致する。
- current observation line構成が変わらない。

---

### R4. Human Reception Surface Realizerの実装

#### 主owner候補

第一候補:

- `emlis_ai_grounded_sentence_surface.py` 内のhuman reception ownerを限定refactor

新規module候補:

- `emlis_ai_grounded_human_reception.py`

新規module化は、次を満たす場合だけ行う。

- referent / predicate / stance / validationを分けないと、既存Surface fileの責務が再び巨大化する。
- circular importなしにplan-to-clause責任を独立できる。
- 新規moduleが完成文bankではなく、機能的realizer ownerになる。

#### 作業

1. `_render_human_follow()` のrelation再分析を除去する。
2. referent resolverを実装する。
3. act-specific response predicateを実装する。
4. stance / speaker presenceをsurfaceへ反映する。
5. optional afterglowを最大1件実装する。
6. 長い引用再掲を防ぐ。
7. internal policy explanationを生成しない。
8. existing two-stage joinを維持する。
9. receptionだけのrecovery profileを実装する。

#### 完了条件

- exact8のobservation hashが8/8不変。
- receptionは8/8でact-specific human responseを持つ。
- 8/8で長いquote再掲なし。
- I6-S03で運用方針説明なし。
- D / I6-D02で限定的Emlis stanceが出る。
- 全文は1〜2文。

#### 停止条件

- 観測surfaceを変更しないと実装できない。
- actごとの完成文return bankになる。
- synonym randomizationでテンプレ感を隠す設計になる。

---

### R5. Runtime Gate・final guardの実装

#### 主owner候補

- `emlis_ai_grounded_observation_gate.py`
- `emlis_ai_reply_service.py`

#### 作業

1. §14の7 Gateを追加する。
2. GateReportへbody-free fieldを追加する。
3. `all_semantic_gates_passed` にreception Gateを必須接続する。
4. final reply return前にも、mandatory two-stageとreception Gate passを確認する。
5. Gate未接続時はfail-openせずrejectする。
6. public meta boundaryへbodyやanchorを出さない。
7. Product Read Feelは引き続きexternal human resultとして分離する。

#### 完了条件

- reception Gate一つでもfailならpublic `passed` にならない。
- Gate metaにraw input / surface bodyがない。
- API / DB / RN contractは不変。
- old two-stage / mechanical restatement Gateも引き続きpass必須。

---

### R6. Local automated QA・華恋実読

#### automated QA順

1. type / unit tests
2. plan contract tests
3. SentencePlan validation tests
4. Surface tests
5. Gate tests
6. exact8
7. same16
8. unseen入力群
9. public API / RN boundary regression
10. targeted compile
11. relevant backend regression suite

#### 必須集合

- exact8: 8件
- same16: 現行16件
- unseen: 最低8件
  - short burden
  - positive change
  - retained intention
  - action without success
  - long arc
  - comparison
  - self-denial with counterevidence
  - label-limited

#### automated completion

- exact8 observation hash 8/8不変。
- two-stage 8/8。
- reception Gate 8/8 pass。
- no long quote replay 8/8。
- no policy explanation 8/8。
- exact reception sentence duplicate 0。
- same closing stem concentrationが基準内。
- safety boundary全件pass。
- public contract regressionなし。

#### 華恋実読

自動pass後、本文そのものを読み、次を1件ずつ判定する。

```text
reception_role_distinctness
human_warmth
conversational_naturalness
grounded_specificity
whole_input_balance
safety_boundary
non_template_readfeel
wants_more_input_candidate
```

各review receiptは、読んだexact visible surface SHA-256へ拘束する。

#### 禁止

- body-free axis表だけでhuman passにする。
- 自動Gate passをProduct Read Feel passにする。
- failureを「好みの問題」として消す。

---

### R7. 代表4件の実機方向確認

local automated QAと華恋実読が完了した後に限り、Mash様へ次の4件を依頼する。

```text
A
B
I6-S03
I6-D02
```

選定理由:

- A: short burden
- B: long multi-relation
- I6-S03: 身体感覚・原因非推定
- I6-D02: self-denial + help-seeking

#### 取得する証拠

- exact current input identity
- visible body screenshot
- backend path / Gate meta
- visible surface SHA-256
- clipping / layout
- Mash様の読感

#### PASS条件

- local expected surface hashと実機visible hash一致。
- 二段表示維持。
- `見えたこと` 回帰なし。
- `Emlisから` が第二観測に見えない。
- 人間的だが一般共感テンプレに見えない。
- 自己否定・身体感覚の安全境界維持。

1件でも不合格ならexact8全件へ進まない。

---

### R8. exact8実機確認・進行判断

代表4件PASS後、app-valid exact8を8件実行する。

#### PASS条件

- 8件すべてvisible hash一致。
- 8件すべて二段表示。
- 8件すべてreception role distinctness human pass。
- 8件すべて自然な1〜2文。
- 同一共感文・同一終端の集中なし。
- layout / clipping問題なし。
- Mash様と華恋の両方が、最低商品品質へ到達したと判断する。

#### 進行

exact8実機PASSまでは、P5 / P6 / P8を開始しない。

exact8 PASS後も、自動的に全Product Gate完了とはしない。既存roadmapに従い、P5 formal 24の開始条件を別途確認する。

---

### R9. 実装後の資料更新・handoff

実装と検証が完了した後にのみ行う。

- 実装済み資料のstatus更新
- 前提資料の必要差分更新
- app-valid fixtureの正本化
- old invalid fixtureのhistorical / superseded表示
- test evidence / device receiptの登録
- 次工程の開始可否

本設計段階では更新しない。

---

## 18. 対象ファイル候補

| 責任 | 既存owner候補 | 変更方針 |
|---|---|---|
| reception plan / selector | `emlis_ai_grounded_observation_plan.py` | 新nested plan、act selector、validation |
| sentence plan / surface | `emlis_ai_grounded_sentence_surface.py` | human reception atomとrealizerを限定修正 |
| optional new owner | `emlis_ai_grounded_human_reception.py` | 実装時に責務分離が必要な場合のみ新規 |
| runtime Gate | `emlis_ai_grounded_observation_gate.py` | reception Gate追加 |
| final return guard | `emlis_ai_reply_service.py` | Gate必須接続、fail-closed |
| local / device readfeel | `ai/tests/helpers/emlis_ai_grounded_observation_i7_readfeel.py` | readfeel axes・hash拘束・cross-case QA補強 |
| exact8 fixture | existing fixtureのsuperseding version | app-valid input identityへ訂正 |
| plan tests | existing grounded observation plan tests | act / policy / safety test |
| surface tests | existing grounded sentence surface tests | distinctness / quote / policy test |
| Gate tests | existing grounded observation Gate tests | new Gate RED/GREEN |
| device progression tests | existing I7 / GateA tests | representative4 → exact8 progression |

ファイル名・新規module有無は、実装開始時の最新snapshotとdependency graphを確認して決める。本書は新規ファイル作成を強制しない。

---

## 19. テスト設計

### 19.1 Unit test

- role → act mapping
- act → follow element mapping
- stance selection
- speaker presence selection
- quote policy
- sentence budget
- self-denial override
- help-seeking priority
- short-state priority

### 19.2 Plan contract test

- body-free
- target/evidence resolution
- observation-owned nucleus保持
- case id / raw text / completed sentence不在
- invalid policyのreject

### 19.3 SentencePlan test

- final human line exactly one
- relation IDs empty
- reception atoms required
- observation atoms forbidden
- evidence binding preserved
- sentence budget valid

### 19.4 Surface test

正解文一致ではなく、次を確認する。

- act-specific terminal predicate
- 1〜2文
- long quote replayなし
- policy explanationなし
- question / adviceなし
- self-denial counterposition grounded
- generic empathy suffix aloneでない

### 19.5 Gate test

各Gateの単独failureを作る。

```text
missing reception plan
relation owner leakage
observation summary repetition
long quote replay
policy explanation
non-human analytic predicate
ungrounded self-denial counterposition
raw body meta leak
```

### 19.6 Regression test

- exact8 observation hash freeze
- same16 semantic retention
- public API keys
- RN display contract
- DB non-change
- Safety owner
- two-stage labels/order
- mechanical restatement prohibition

### 19.7 Batch template QA

- exact sentence duplicate
- closing stem frequency
- terminal predicate family distribution
- act distributionと入力構造の整合
- abstract noun concentration

### 19.8 Human Product Read Feel

rubric:

| axis | 合格条件 |
|---|---|
| `reception_role_distinctness` | 前段の言い換えではなく、人間的受け取りとして別の役割がある |
| `human_warmth` | 冷たい分類文でも、一般慰めでもない |
| `conversational_naturalness` | Emlisが一言二言話しているように読める |
| `grounded_specificity` | 入力固有の一点へ反応し、一般文へ逃げない |
| `whole_input_balance` | 全文を再要約せず、重要点の選び方が妥当 |
| `safety_boundary` | 診断・人格・原因・危険度を足さない |
| `non_template_readfeel` | caseを変えても同じ共感文に見えない |
| `wants_more_input_candidate` | この返しなら、また言葉を置いてもよいと感じられる候補である |

「柔らかい単語が入った」だけでは `human_warmth=pass` にしない。

---

## 20. 受け入れ基準

### 20.1 Technical acceptance

- exact8 current input identityがapp-valid正本と一致する。
- observation section hashが8/8不変。
- mandatory two-stage 8/8。
- reception plan / grounding / distinctness / quote / policy / voice / safety Gate 8/8 pass。
- same16とunseen入力でcase専用routeなし。
- public API / DB / RN contract変更なし。
- raw body / source textのpublic meta漏れなし。
- targeted regression pass。

### 20.2 Product acceptance

- Mash様と華恋が、visible本文そのものをhash拘束で読む。
- exact8全件で、`Emlisから` が第二の観測ではない。
- 人間的だが、一般共感テンプレではない。
- 1〜2文で自然に話している。
- 同じ引用・関係を前段から繰り返さない。
- 自己否定、短文、長文、行動ありの各familyで役割が合う。
- 「最低限の商品品質へ到達」と人間が明示判定する。

### 20.3 進行acceptance

```text
Technical acceptance pass
AND 華恋local Product Read Feel pass
AND representative4 actual-device pass
AND exact8 actual-device pass
```

この全条件が揃うまで、P5 formal 24へ進まない。

---

## 21. rollback / fail-closed / 停止条件

### 21.1 即時停止

次の一つでも起きた場合、作業を止める。

- exact8 observation hashが意図せず変わる。
- required relation directionが変わる。
- fact boundaryが弱くなる。
- two-stage label / orderが崩れる。
- self-denialを事実として受け入れる。
- generic empathy fallbackが追加される。
- case専用mode / fixture cueが追加される。
- public API / DB / RN変更が必要になる。
- automatic greenを理由にhuman readを省略しようとする。

### 21.2 rollback

新reception実装で回帰した場合:

1. reception関連差分だけを戻す。
2. 現在の観測基礎と常時二段実装は保持する。
3. 旧receptionを商品合格へ戻したことにはしない。
4. P5 / P6 / P8停止を継続する。
5. failure evidenceを次の修正入力にする。

### 21.3 実機矛盾

localと実機が一件でも矛盾した場合:

- local human pass撤回
- device packet失効
- expected hash失効
- progression block
- runtime lineage / deploy差分 / visible bodyを再確認

周辺作業を増やして進行を続けない。

---

## 22. 性能・互換・安全

### 22.1 性能

- 外部AI callを追加しない。
- plan / atom / Gateは既存nucleus数に対するbounded処理にする。
- cross-case template QAはtest / offline evaluationで行い、runtime requestに履歴集合を持ち込まない。
- quote overlap検査は現在の二sectionとbounded source spansだけを対象にする。

### 22.2 決定性

- random synonym選択を使わない。
- 同じinput / same snapshotで同じplanとsurfaceを再現できる。
- variationはact、target kind、stance、speaker presence、reference modeから生じる。

### 22.3 privacy / meta

- raw memo、memo_action、comment body、short anchorをpublic metaへ入れない。
- hash、code、count、enumのみをbody-free summaryに使う。
- review fixtureで本文を保存する場合はlocal-only境界と既存規則に従う。

### 22.4 compatibility

- public response keyを増やさない。
- RNでsection parseを要求しない。
- DB physical nameを変えない。
- legacy meta consumerがある場合は、新field追加をoptional・backward compatibleにする。

---

## 23. 「書かれていない」こと

本設計は次を確定していない。

- 各caseの最終完成文。
- exactな助詞・終助詞・全語彙。
- 新規moduleを必ず作ること。
- JSON Schemaを必ず実ファイル化すること。
- production deploy手順。
- P5 formal 24の実施日。
- P8問いシステムの設計。
- 全未知入力の一回での合格。
- 実機raw `comment_text` hashの取得済み事実。

これらを実装時に勝手に既承認事項として扱わない。

一方、次は本設計で固定する。

- 常時二段。
- 観測と人間的受け取りの役割分離。
- `見えたこと` 基礎の凍結。
- `Emlisから` の第二観測化禁止。
- 完成文テンプレ禁止。
- 一般共感fallback禁止。
- technical passとProduct Read Feelの分離。
- representative4 → exact8の実機順。
- exact8 PASS前のP5 / P6 / P8停止。

---

## 24. 実装開始前チェックリスト

```text
[ ] 最新mashos-api snapshotを再確認した
[ ] Cocolon_前提資料を再確認した
[ ] work_attitude_rules_for_karenを再確認した
[ ] app-valid exact8入力を正本にした
[ ] old invalid fixtureをprogression ownerから外した
[ ] exact8 observation section hashを凍結した
[ ] current receptionをhuman pass扱いしていない
[ ] 対象範囲がhuman receptionに限定されている
[ ] API / DB / RN非変更を確認した
[ ] Red testから始める
[ ] case専用分岐・完成文bankを作らない
[ ] 実機確認が必要になる段階をR7として固定した
```

---

## 25. 設計上の最終判断

EmlisAIは、ユーザーの入力を読み取って構造を返すだけでは、まだ商品として冷たい。逆に、柔らかい共感文を付けるだけでは、入力を読んでいない共感テンプレになる。

必要なのは、次の両立である。

```text
見えたこと：
入力固有の構造を、根拠どおりに返す。

Emlisから：
その構造をもう一度説明せず、
同じ入力の中でEmlisが大切に見た一点へ、
根拠を離れない人間的な反応を返す。
```

今回の実機結果により、前半の土台は凍結可能な水準へ来た。次の実装では、その土台を再び触って全体を作り直すのではなく、後半の責任だけを独立させ、Plan、SentencePlan、Surface、Gate、QA、実機進行の全層で同じ契約を守る。

本書の次工程はR0である。設計段階では、コード・fixture・schema・前提資料を変更しない。
