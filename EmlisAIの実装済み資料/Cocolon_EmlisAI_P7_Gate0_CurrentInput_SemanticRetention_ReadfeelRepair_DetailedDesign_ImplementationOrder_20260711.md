# Cocolon / EmlisAI P7 Gate 0
# current-input 意味保持・読感修復 詳細設計書・実装順

- 作成日: 2026-07-11 JST
- 文書種別: 詳細設計書・実装順
- 設計状態: **DESIGN READY / IMPLEMENTATION NOT STARTED**
- 対象Phase: P3 / P4 current-input baseline repair → P7 Product Quality Gate復帰
- 親判断書: `Cocolon_EmlisAI_P7_to_P8_QuestionSystem_EntryConditions_20260711.md`
- 現在のP8判定: **NO_GO**
- コード変更: なし
- API / DB / RN変更: なし
- Mash様による実機作業: Gate 0合格まではなし
- 基準ローカル受領物:
  - `Cocolon_前提資料(314).zip`
  - `EmlisAIの実装済み資料(115).zip`
  - `Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_system_update_20260706(15).zip`
  - `Cocolon(285).zip`
  - `mashos-api(203).zip`

---

## 0. 結論

本設計は、次の8項目を別々の小修正として扱わず、**現行canonical Grounded経路をGate 0の商品品質まで戻す一つの修復単位**として実行するための設計である。

1. required nucleusと長文全体保持を修正する。
2. 関係種別・向き・反転を修正する。
3. 短文の語義保持を修正する。
4. human followの対象と役割を修正する。
5. ケース横断のテンプレ反復を抑える。
6. I0台帳と旧実機テストを現行cutoverへ整合させる。
7. 同じ16件を再生成し、華恋が全件を再読する。
8. Gate 0合格後にだけ、exact 8件の実機確認へ進む。

実装の基本判断は次で固定する。

```text
新しい並列生成系を作らない。
問いシステムを使ってcurrent-inputの読み落としを補わない。
case専用mode / cue / surface / completed sentenceを作らない。
既存のGroundedObservationPlanを意味の正本として修復する。
長文を短くするためにrequired意味を落とさず、同一文への統合で圧縮する。
機械Gate通過と人間読感合格を分離する。
localで既知不良が残る間は、Mash様へ実機確認を依頼しない。
```

本設計の実装出口は、**P8開始ではない**。出口は次のいずれかである。

```text
GATE0_LOCAL_PASS_DEVICE_PACKET_READY_STOPPED
GATE0_REPAIR_RETURN_STOPPED
GATE0_TEST_OR_CONTRACT_BLOCKED_STOPPED
GATE0_SAFETY_OR_PUBLIC_CONTRACT_IMPACT_STOPPED
```

`GATE0_LOCAL_PASS_DEVICE_PACKET_READY_STOPPED` の場合に限り、known 4 + unseen 4のexact 8件を実機へ渡す。

---

## 1. 最終目的・今回得る情報・完了条件・停止条件

### 1.1 最終目的への接続

Cocolonの最終目的は、ユーザーの入力を雑に処理せず、商品として継続利用したいと思える観測体験を成立させ、Cocolonを完成・リリース可能な品質へ近づけることである。

今回の修復は、問いシステムや履歴接続で弱さを隠す前に、**current-inputだけで既に書かれている意味を正しく保持して返す基礎能力**を成立させる作業である。

### 1.2 今回新たに得る情報

実装と検証によって、少なくとも次を確定する。

- 長文の中心核・反転・不明領域・次行動を、同一Grounded Planから落とさず本文へ出せるか。
- 短文の状態語を、別の一般語へ置換せず受け取れるか。
- self-denial入力で、本人が残した反対方向を負荷ではなく反対方向として扱えるか。
- 同型入力でも、入力固有の関係を読まずに同じ一般文へ流れないか。
- 現行Gateが、単なるID被覆ではなく、語義・関係方向・follow役割まで不合格にできるか。
- 現行cutoverに合わない旧台帳・旧表示回帰テストを、本文不良を隠さず整合できるか。
- local 16件が、華恋の実読で実機へ渡せる状態になったか。

### 1.3 Gate 0完了条件

Gate 0は、次の全条件を同時に満たしたときだけ合格とする。

```text
[経路]
- canonical generation path一系統のまま。
- legacy substantive routeからpublic本文が供給されない。
- case専用runtime条件・完成文bank・fixture cueがない。

[意味]
- known 4 + unseen 12でrequired nucleusの可視欠落0。
- required relationの種別・向き・反転誤り0。
- short-stateで入力状態語の意味を別概念へ置換する不良0。
- human followの対象・役割誤り0。
- recovery全段でrequired意味が保持される。

[商品読感]
- 16/16を華恋が実際に読み、local human pass。
- hard fatal 0。
- repair required 0。
- 機械的な浅い復唱、同一句の無目的反復、一般語tailによるテンプレ感が商品上残らない。
- 「また入力したいか」が少なくとも候補合格。

[テスト・契約]
- 変更対象のunit / structural / metamorphic / safety / public contract testがgreen。
- I0台帳が現行cutoverの事実と一致。
- 旧実機再確認testがlocal display contract testとして現行metaへ整合。
- full collectが成功。
- 影響範囲suiteに未分類failureがない。
- body不良を隠すための期待値変更がない。

[境界]
- API response key変更なし。
- DB physical name / write path変更なし。
- RN visible contract変更なし。
- raw input / returned bodyのpublic meta混入なし。
- question policyはP7 baseとしてfalseのまま。
```

### 1.4 停止条件

次のいずれかが発生したら、実機へ進まず修復工程へ戻る。

- required意味を残すためにcase専用分岐が必要になった。
- exact fixture語句をproduction条件へ入れようとしている。
- 長文を4核以内へ収めるため、中心核を`should`へ降格しようとしている。
- 関係方向を確定できないのに、自然な文章に見せるため因果・変化を断定しようとしている。
- safety support / emergency ownerをGrounded通常観測が上書きする。
- public response key、DB、RN modal条件へ変更が必要になったが、影響設計がない。
- テスト期待値を変える理由が「現行出力をgreenにするため」だけである。
- 16件のうち1件でもhard fatalまたはrepair requiredが残る。
- 実機でしか得られない情報が真の次工程になった時点。

### 1.5 Mash様の作業境界

Gate 0合格までは、Mash様へ入力・スクリーンショット・ログ取得を求めない。

Gate 0合格後に限り、華恋が作成したexact 8件packetを実機へ入力し、指定された最小証拠を返していただく。任意入力の選定やケース設計をMash様へ戻さない。

---

## 2. 参照した正本と優先順位

### 2.1 行動原理として参照したもの

- GitHub `MassyuRed/Karen-Diary`
  - `00_READ_FIRST.md`
  - `memory/karen_operating_principles.md`
  - `memory/mash_and_karen.md`
  - `diary/2026-07.md`

Karen-DiaryはCocolon仕様の正本ではない。今回の参照目的は、最終目的、停止判断、実機確認の必要時点、事実・推測・意見の分離を失わないためである。

### 2.2 Cocolon作業の正本

- `Cocolon_前提資料/00_karen_read_first.md`
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

### 2.3 Phase・設計の正本

- `Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md`
- `Cocolon_EmlisAI_GroundedAdaptiveObservation_CoreRepair_DetailedDesign_20260710(2).md`
- `Cocolon_EmlisAI_P7_PostDHD_ReadfeelReconnection_ProductQAReturn_DetailedDesign_ImplementationOrder_20260710.md`
- `Cocolon_EmlisAI_P7_to_P8_QuestionSystem_EntryConditions_20260711.md`

### 2.4 現在実装の正本

- `mashos-api(203).zip` 内の現行backend実ファイル
- 現行テスト
- 現行known 4 + unseen 12の実生成本文

### 2.5 優先順位

```text
Phase境界・完了条件:
  承認済みロードマップと最新設計を優先する。

現在何が動くか:
  現行実ファイルと実行結果を優先する。

本文が商品として成立するか:
  自動Gateだけでなく、実本文のlocal human readを必須とする。

Karen-Diary:
  華恋の行動判断には使うが、Cocolon仕様を直接上書きしない。
```

---

## 3. 確認済み・未確認・書かれていない・推測・華恋の意見

### 3.1 確認済みの事実

1. 通常current-input応答は、次の単一経路へcutover済みである。

```text
Evidence Ledger
→ GroundedObservationPlan
→ GroundedSentencePlan
→ functional Surface
→ Grounded Observation Gate
→ ReplyEnvelope
```

2. `emlis_ai_grounded_observation_plan.py::_retention_by_span()` には、長文でrequired text spanが4件を超えると、境界・operator優先で4件へ絞り、残りを`should`へ降格する処理がある。

3. 同関数は、各text fieldの先頭・末尾をrequired候補として強く扱う。中心にある発見・反転・結果が、先頭・末尾より弱くなる可能性がある。

4. `emlis_ai_grounded_observation_plan.py` の関係構築は、近接span、両endpointのoperator集合、既存relation、cross-field action接続を材料にする。L03では、入力の中心反転ではなく「淡い釉薬→失敗扱い」が`shift_from_to`として前景化した。

5. `emlis_ai_grounded_sentence_surface.py::_render_observation()` は、`reaction / state / constraint`を一律に「〜ほどの重さがある状態」とする。S03では、入力の「苦しい感じ」が「重さ」へ置換された。

6. `emlis_ai_grounded_sentence_surface.py::_render_human_follow()` は、target nucleusがnegativeまたはrefusalの場合、一律に「今の負荷を言葉に置いた部分」へ寄せる。Known D・I6-D01では、本人が残した反対方向が負荷として扱われた。

7. 現行Gateの`text_semantic_retention`は、主にrequired nucleus / relation IDがbindingへ存在するかを見る。最初にrequiredへ選ばれた意味が正しいか、語義が保持されたか、relation方向が正しいかまでは判定していない。

8. 現行`anti_template`は、completed semantic templateやfixture routeの使用flagを主に見る。出力内の同一句反復、family横断の一般tail反復は判定していない。

9. 現行I7 local helperは、空本文、過長、質問化、内部taxonomy露出、重複行、canonical metaなどを機械確認するが、実際に人間が本文を読んだとは主張しない。現行16件が`candidate_pass`でも、人間読感合格ではない。

10. `test_emlis_ai_phase20_10_real_device_recheck.py` は歴史的名称のlocal回帰testであり、実機証拠そのものではない。旧material route、visible slots、unknown slots、repair attempts等の旧metaを参照している。

### 3.2 未確認

- 修正後の最終本文の自然な日本語。
- 修正後16件のhuman read結果。
- 修正後の全backend suite結果。
- 実機deploymentがlocalと同じcanonical経路を使うか。
- 実機modalの見切れ・圧迫・行間・長さ。
- P5 formal 24、P6 18、continued sequence、P7 corpusのactual human result。

これらは、本設計時点で合格済みとは扱わない。

### 3.3 書かれていないこと

- 各ケースに対する承認済みのexact完成本文は存在しない。
- 「Known Bならこの固定文」のようなruntime用正解文は存在しない。
- 今回、API endpoint、response key、DB schema、RN UIを変更してよいという指示はない。
- Gate 0未合格のままP8へ進める例外条件は書かれていない。
- 任意のユーザー入力1件で実機確認を代替できるとは書かれていない。

### 3.4 根拠付き推測

- Known B・L01・L03の中心欠落は、required 4件上限と先頭・末尾優先の影響が大きい可能性が高い。
- L02・L03の関係誤りは、operatorの局所scope不足、endpoint選定、relation candidateの先着固定、cross-field自動接続の複合で起きている可能性が高い。
- S01〜S03とC01〜C03のテンプレ感は、同じfunctional grammarを使うこと自体より、入力固有の関係を表現せず、同じ一般tailで閉じる比率が高いことが主因と推測する。

これらは実装前の診断仮説である。test-firstで再現し、仮説と異なる場合は原因を更新する。

### 3.5 華恋の意見

今回必要なのは、新しい表現辞書や問いシステムではなく、**既存Grounded Planが「何を必ず残すか」「何と何がどちら向きにつながるか」「その言葉をどの概念へ言い換えてよいか」「人間的に何を受け取るか」を最後まで失わないようにする修復**である。

同型のケースへ同じ文法骨格が現れること自体は、直ちにテンプレではない。問題は、意味が異なるのに同じ一般文へ潰れ、ユーザー固有の転換・発見・努力が見えなくなることである。そのため、表面的な言い換え乱数ではなく、semantic shapeによって文の役割と閉じ方を変える。

---

## 4. 現行欠陥が本文へ入る位置

| 層 | 現行owner | 確認した欠陥 | 主な影響case |
|---|---|---|---|
| Retention | `_retention_by_span()` | requiredを最大4へ降格、field先頭末尾を優先 | Known B、L01、L03 |
| Nucleus selection | `_build_nuclei()` / `_build_response_and_policies()` | central pivotよりpriority・境界・後半actionが前景化 | Known B、L01、L03 |
| Relation candidate | `_relation_type_for_pair()` / `_build_relations()` | operator scopeが広く、endpointとrelation typeがずれる | L02、L03 |
| Relation dedupe | `_append_relation_seed()` | 誤った先行relationが同endpointを占有し得る | L03 |
| Cross-field relation | `_build_relations()` | memo末尾→memo_action先頭を一般的に接続し得る | B、L01〜L03、C01〜C03 |
| Short surface | `_render_observation()` | state/reaction/constraintを一律「重さ」へ寄せる | S03 |
| Follow selection | `_build_response_and_policies()` | follow対象はあるが、人間的役割分類が弱い | D01〜D03、Known D |
| Follow surface | `_render_human_follow()` | negative/refusalを一律「負荷」にする | Known D、D01 |
| Sentence shape | `_build_regular_lines()` | 同じline role・同じtailを繰り返しやすい | S01〜S03、C01〜C03 |
| Gate | `evaluate_grounded_observation_gate()` | ID被覆を意味保持とみなし、語義・方向・役割を見ない | 全不良がpass |
| I7 | `assess_i7_local_surface()` | deterministic fatal checkでありhuman readではない | 16件全部 |
| Legacy tests | I0 / Phase20-10 | cutover前のfingerprint・owner・metaを期待 | 偽failure |

### 4.1 現行の誤った通過形

```text
中心意味がrequiredへ選ばれない
  ↓
選ばれたrequired IDだけはSentencePlanへbindingされる
  ↓
Surfaceはgeneric grammarで本文を作る
  ↓
Gateは「required IDが存在する」と判定する
  ↓
semantic_quality_gate = passed
  ↓
実本文では中心欠落・語義置換・follow誤役割が残る
```

本修復では、後段だけを言い換えるのではなく、**required選定 → relation → sentence binding → surface → gate → human read**を同じ順に直す。

---

## 5. 対象範囲と非対象範囲

### 5.1 対象範囲

#### production候補

- `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py`
- `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py`
- `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py`
- `ai/services/ai_inference/emlis_ai_reply_service.py`
  - 原則は確認のみ。
  - canonical wiringまたはbody-free meta接続に実害が確認された場合だけ最小変更候補。

#### test / helper候補

- `ai/tests/helpers/emlis_ai_grounded_observation_i0_inventory.py`
- `ai/tests/helpers/emlis_ai_grounded_observation_i6_cases.py`
- `ai/tests/helpers/emlis_ai_grounded_observation_i7_readfeel.py`
- `ai/tests/test_emlis_ai_grounded_observation_plan_i1.py`
- `ai/tests/test_emlis_ai_grounded_observation_i2_i4.py`
- `ai/tests/test_emlis_ai_grounded_observation_i6.py`
- `ai/tests/test_emlis_ai_grounded_observation_i7.py`
- `ai/tests/test_emlis_ai_grounded_observation_i0_inventory.py`
- `ai/tests/test_emlis_ai_phase20_10_real_device_recheck.py`
- safety / response contract / public displayの隣接test

#### local-only成果物候補

- 修正前16本文freeze
- 修正後16本文
- case別before / after比較
- body-free local readfeel receipt
- Gate 0判定書
- Gate 0合格時のexact 8実機packet

### 5.2 非対象範囲

- P8問いシステムの詳細設計・実装
- 仮観測 + 問い + refined observation
- 問い回答の保存・DB schema
- response key追加
- RN問いUI・modal新規導線
- Free / Plus / Premiumの問い回数差分
- P5 formal 24のactual実行
- P6 Structure Insightのactual実行
- continued-input sequence実行
- P7 corpus拡張
- API endpoint変更
- DB physical rename / write path変更
- RN visible contract変更
- Cocolon前提資料更新
- GitHub commit / push / PR

非対象が必要になった場合、この設計へ混在させず、影響が確認された時点で停止して別設計に分ける。

---

## 6. 変更してはいけない不変条件

1. `generation_path = grounded_observation_plan_sentence_surface_canonical_v1` を維持する。
2. `composer_source = grounded_plan_realizer` を維持する。
3. `GroundedObservationPlan`を唯一のcurrent-input意味正本として使う。
4. Recoveryは同じplanを縮退し、別の意味本文へ切り替えない。
5. emergency / safety-supportは既存の別ownerを維持する。
6. self-denial safe-stateでは、自己評価を本人の確定事実にしない。
7. input body、returned body、review commentをpublic metaへ入れない。
8. case ID、fixture語彙、exact sentenceをproduction条件へ入れない。
9. 同一入力は同一snapshotで決定的に同じ出力を返す。ランダム言い換えを使わない。
10. emotion / category labelは補助材料であり、text nucleusを置換しない。
11. 文章量を減らす場合、required retentionを降格せず、relation付き統合で圧縮する。
12. P7 baseではquestion policyをfalseのままにする。
13. `observation_status=passed` と本文存在はdelivery契約であり、商品合格の代替ではない。
14. exact出力本文をテスト期待値へ固定して、将来の自然な改善を塞がない。

---

## 7. 共通内部設計

### 7.1 新しいparallel schemaを作らない

現行dataclassの形を基本維持し、既存の次の領域を使う。

- `GroundedSemanticFrame.attribute_codes`
- `GroundedSemanticNucleus.retention`
- `GroundedSemanticRelation.type / endpoint / source_span_ids / grounding_kind`
- `GroundedResponsePlan.human_follow_target_ids`
- `GroundedCoverageRequirements.required_nucleus_ids / required_relation_ids`
- `GroundedSentenceBinding.functional_atom_ids`

必要な構造意味は、body-free codeとして既存fieldへ記録する。

### 7.2 追加するbody-free code vocabulary

#### semantic arc role

```text
arc:opening_state
arc:major_shift_from
arc:major_shift_to
arc:provisional_evaluation
arc:counterevidence_or_discovery
arc:explicit_result
arc:current_evaluation
arc:remaining_constraint_or_unknown
arc:next_intention
arc:concrete_action_evidence
arc:protective_counterdirection
```

#### lexical policy

```text
lexical:preserve_source_predicate
lexical:source_metaphor_present
lexical:generic_state_noun_allowed
lexical:no_new_sensation_family
```

#### human follow functional atom

```text
human_follow:burden_expression
human_follow:concrete_effort
human_follow:valued_change
human_follow:retained_intention
human_follow:protective_counterdirection
human_follow:help_seeking_preserved
human_follow:integrated_current_state
```

これらは、本文やcase語彙ではない。入力構造から決定する内部codeであり、raw bodyを含まない。

### 7.3 schemaとversion

- dataclass shapeは原則変更しない。
- `GROUND_OBSERVATION_PLAN_SCHEMA_VERSION`、public generation pathは変更しない。
- semantic interpretationが変わるため、`GROUND_OBSERVATION_PLAN_SEMANTIC_VERSION`はrevisionを上げる。
- sentence functional atomの追加は既存tuple内のcode追加として扱い、shapeを変えない。
- I0 fingerprintは最終実装後の実値で更新する。設計段階でhashを推測しない。

### 7.4 runtime cue禁止

上記codeは、Known B、L03等のcase名や入力語を条件に付けない。

悪い実装:

```python
if "釉薬" in text:
    mark_reversal()
```

許可される実装:

```text
provisional negative evaluation
+ explicit contrast marker
+ newly observed positive/valuable property
+ retain wish
```

という構造から、`preserves_despite`とarc roleを決める。

---

## 8. 詳細設計1: required nucleusと長文全体保持

### 8.1 問題

現行`_retention_by_span()`は、長文のrequired text spanが4件を超えると、field境界とoperator優先で4件へ縮める。この処理により、入力の中心にある発見・反転・小さな前進が`should`へ落ち、後段SentencePlanで省略可能になる。

長文の表面量を抑える責務と、意味のrequired判定が混ざっている。

### 8.2 修正owner

- `_operator_codes_for_text()`
- `_clause_signals()`
- `_retention_by_span()`
- `_semantic_frame_for_span()`
- `_build_nuclei()`
- `_build_response_and_policies()`
- `validate_grounded_observation_plan()`
- `_build_regular_lines()`
- Recovery各stage

### 8.3 required判定の新しい順序

```text
1. source-preserving spanを作る。
2. relation marker単体をsurface nucleus候補から分ける。
3. 各substantive spanへlocal operatorとarc roleを付ける。
4. explicit relationのendpointを確定する。
5. major semantic turn groupを作る。
6. groupごとの必須endpointをrequiredへする。
7. explicit conclusion / current evaluation / limiting unknown / next intentionを判定する。
8. memo_actionは、中心memo核を置換せず、具体的evidenceとして追加する。
9. required数で切らない。
10. SentencePlan側で同一relation chainを一文へ統合する。
```

### 8.4 廃止する判断

次をrequired選定の決定条件として使わない。

- 「requiredが4件を超えたから降格する」
- 「fieldの最初・最後だから中心である」
- 「operatorがあるspanを先着順に4件取る」
- 「memo_actionがあるから、memo後半の意味を代表できる」

field先頭・末尾はtie-breakerまたは文脈保持の`should`候補に留める。

### 8.5 major semantic turn group

長文では文字数ではなく、次の構造転換でgroupを区切る。

- past / present / nextの時間転換
- contrast / however
- provisional evaluation → counterevidence
- attempt → block
- cause → result
- self-evaluation → refusal / retained action
- wish → constraint / unknown
- intention → concrete action evidence

required nucleusは、「各文を全部残す」ためではなく、**入力全体を成立させる各主要groupの端点を残す**ために選ぶ。

### 8.6 response planの選択

- `primary_nucleus_ids`は最大件数で切るのではなく、中心relation chainを構成するendpointを優先する。
- `supporting_nucleus_ids`には、required chainを具体化するevidenceと、requiredではない補助文脈を入れる。
- `memo_action`は、入力本文の中心shift / reversal / resultを消してprimaryを占有してはいけない。
- 同一groupの複数required nucleusは、SentencePlanで一つのrelation sentenceへbindingできる。

### 8.7 Recovery

各Recovery stageで許されるのは次だけである。

```text
full:
  required + selected should + relation + follow

optional_removed:
  required + required relation + follow

integrated:
  required chainを少ないsentenceへ統合

hedged:
  同じrequired chainの断定範囲を狭める

minimal_grounded:
  required nucleus + required relation + boundary + required followのみ
```

requiredを`should`へ落とすこと、別のgeneric observationへ置換することは禁止する。

### 8.8 test-only semantic obligation

以下はproduction分岐ではなく、回帰testで期待する構造である。

| case | requiredとして残す中心 |
|---|---|
| Known B | 疑問の対象が人側から物側へ移ったこと、その結果として人について考えすぎる量・人への関心が減ったこと、本人が良い変化と評価したこと、少なくとも一つの具体的な現在変化または行動evidence |
| I6-L01 | 空欄を見て止まった状態、章立てを整えたこと、一節を書けたこと、完成には遠いが入口を作れたという両側、次回も同じ順で進めたい意図、行動記録 |
| I6-L03 | 淡く出た結果、失敗扱いしかけた暫定評価、細かな模様の発見、特徴を残したい意図、焼成条件不明、温度だけ変える次試作、温度と写真番号の記録 |

### 8.9 合格条件

- required text spanの固定4件上限がない。
- Known B、L01、L03のtest-only obligationがrequired nucleus / relationとしてplanへ現れる。
- fullからminimal_groundedまで、required ID集合が減らない。
- 4行以内へ収める必要がある場合、required endpointを統合したsentence bindingになる。
- long inputをledgerの逐語再掲へ戻さない。

---

## 9. 詳細設計2: 関係種別・向き・反転

### 9.1 問題

現行relation判定は、endpoint双方のoperator集合や近接順序へ寄りやすい。局所markerがどの二つを結ぶか、暫定評価と発見のどちらが反転前後か、因果がユーザー明示か単なる順序かが弱い。

その結果、L03では中心反転ではなく「淡い結果→失敗扱い」がshiftとして前景化した。L02では、黙る→違和感→要点整理→短い境界表明の流れが薄くなった。

### 9.2 修正owner

- `_relation_type_for_pair()`
- `_relation_grounding_kind_for_pair()`
- `_relation_retention()`
- `_append_relation_seed()`
- `_build_relations()`
- `_render_observation_with_relations()`
- `_render_relation()`
- relation validation / Gate

### 9.3 operator scope

relation markerは、原則として次の範囲だけを結ぶ。

```text
同一source field内で、marker直前の最も近いsubstantive nucleus
↔
marker直後の最も近いsubstantive nucleus
```

例外は、upstream `RelationEdge`、`WholeInputMeaningArc`、`source_claim_ids`でより明示的なendpointが確認できる場合だけとする。

一つのendpointに`shift` operatorがあるだけでは、任意の隣接pairを`shift_from_to`にしない。

### 9.4 relation candidateの選択

各pairへ先着1件を置くのではなく、candidateを集めて次の順に評価する。

```text
A. user_stated_relation
B. explicit local marker
C. upstream relation / meaning arc
D. bounded structural inference
E. source-order only
```

同一endpointでrelation typeが競合する場合:

- A〜Cの明示根拠が一方にあるなら、それを採用する。
- 同程度で競合し、方向を確定できないなら`uncertain_connection`へ落とす。
- 最初に追加されたrelationを無条件に残さない。

relation seedのdedupeは、少なくとも`from / to / candidate type / grounding strength`を比較して最終決定する。

### 9.5 relation typeの条件

#### `shift_from_to`

次を満たす場合だけ使う。

- old / prior / before側と、current / new / after側のendpointがある。
- または「対象がXからYへ」のように、同一predicate / target dimension上の移動が明示される。
- from / toの順序がsource evidenceと一致する。

#### `preserves_despite`

次の反転に使う。

- negative / failure / lossとして閉じかける評価
- explicit contrast
- その評価だけでは閉じない発見・価値・継続方向

#### `user_stated_cause` / `user_stated_result`

「ので」「ため」「ことで」「その結果」「だから」等が局所的にendpointを結ぶ場合だけ使う。単なるsource orderでは使わない。

#### `wish_and_constraint`

残したい・したい等の意図と、それを確定できない条件・制約・不明領域を結ぶ。

#### `action_supports_change`

memoの意図・変化とmemo_actionの具体行動に、次のいずれかがある場合だけ使う。

- upstream relation / claim linkage
- target anchorの重なり
- 同一meaning block / arc linkage
- 明示的な対象・行為の対応

「memoの最後」と「memo_actionの最初」だけを理由に自動接続しない。根拠が弱ければ`should`の`uncertain_connection`またはrelationなしとする。

### 9.6 L02のtest-only relation graph

最低限、次の向きを保持する。

```text
意見を飲み込んだ / 場を乱したくなかった
  → 黙ったままだと違和感が残った
  → 帰宅後に要点を整理した
  → 相手を否定せず、境界だけ短く伝える意図
  → 三行に縮めて保存した行動evidence
```

すべてを強因果として断定する必要はない。入力が明示した箇所は`user_stated_result`、順序だけの箇所はbounded / uncertainとして分ける。ただし、最終本文が単なる出来事列挙へ戻ってはいけない。

### 9.7 L03のtest-only relation graph

```text
淡く出た結果
  → 失敗だと片づけそうになった暫定評価
  --contrast / preserves_despite-->
細かな模様を見つけた
  → 特徴を残したい意図
  ↔ 焼成条件は不明という制約
  → 温度だけ変える次試作
  → 温度・写真番号を記録した行動evidence
```

「淡い結果→失敗扱い」は出来事への暫定評価であり、中心shiftではない。中心は、失敗で閉じかけた見方が発見によって閉じなかった反転である。

### 9.8 Surfaceの方向保持

`_render_relation()`は、全relationを「別の側面」「流れ」とするだけでなく、relation typeの責務を見える形にする。

- shift: from / toと、変わったdimensionをsource anchorから示す。
- reversal: 閉じかけた評価と、それを閉じなかった発見を同一文で結ぶ。
- cause/result: user-stated directionだけを示す。
- wish/constraint: 意図と未確定条件を同時に残す。
- uncertain: 順序以上を確定しない。

完成文bankは作らず、source anchor、relation type、semantic roleを組み合わせるfunctional grammarにする。

### 9.9 合格条件

- L02・L03のrequired relation endpointと向きがstructural testに一致する。
- `shift_from_to`はlocal evidenceなしに作られない。
- provisional evaluationとcounterevidenceが逆転しない。
- relationのfrom / toをSurfaceで逆に出さない。
- relation不確定時は、自然さのために因果を発明せず、限定または`uncertain_connection`を使う。

---

## 10. 詳細設計3: 短文の語義保持

### 10.1 問題

S03の「胸の内側が苦しい感じ」は、現行generic state surfaceによって「重さがある状態」へ置換された。

「苦しい」と「重い」は近い負荷語に見えても、身体感覚・圧迫・痛み・感情・比喩の違いがある。短文では一語が入力全体の大半を占めるため、この置換は観測全体の変更になる。

### 10.2 修正owner

- `_semantic_frame_for_span()`
- `GroundedSemanticFrame.attribute_codes`
- `_build_regular_lines()`
- `_render_observation()`
- `human_follow_covered`算定
- Gateのtext semantic retention subcheck

### 10.3 lexical anchor policy

short-stateのmain nucleusへ、構造に応じて次を付ける。

```text
lexical:preserve_source_predicate
lexical:no_new_sensation_family
```

入力自身に重さ・鉛・圧力等のmetaphorがある場合だけ、`lexical:source_metaphor_present`を付け、そのmetaphor familyを使える。

### 10.4 Surface原則

short-stateでは、入力の主要predicateまたはsource phraseを保ったまま、次の範囲だけ補う。

許可:

- 「〜という感覚が今の記録に置かれている」
- 「〜と感じている今の状態」
- 入力自身が使ったmetaphorの保持
- 文法上必要な名詞化・助詞調整

禁止:

- 苦しい → 重さ
- 冷たい → 鉛
- しびれる → 圧迫
- 空っぽ → 疲労
- sourceにない身体・感情・原因の追加

### 10.5 short-stateのhuman follow統合

single nucleusでdistinct relationもfact boundaryもないshort-stateでは、同じsource phraseを二行に繰り返さない。

- primary observation lineへ`human_follow:integrated_current_state` atomを付ける。
- `human_follow_required=true`でも、このatomを持つlineをfollow coveredとして扱う。
- 独立した`human_follow` lineは作らない。
- followの役割は、一般励ましではなく「その状態が入力として置かれたことを受け取る」までに限定する。

これにより、S01〜S03は原則1行で成立させる。ただし、safety boundaryやdistinct relationがある場合は別である。

### 10.6 Gate

`text_semantic_retention_gate`内で、次を検査する。

- `lexical:preserve_source_predicate`を持つnucleusのsource anchorがSurfaceへ残る。
- Surfaceが、sourceにない別sensation familyを追加していない。
- 同一source anchorがobservationとfollowで無目的に連続反復されていない。

rejection reasonはbody-free codeのみとする。

```text
lexical_anchor_missing
ungrounded_sensation_family_added
short_state_duplicate_anchor_loop
```

### 10.7 metamorphic test

次のように名詞だけを入れ替えても、特定語へ収束しないことを確認する。

```text
頭の奥が重たく感じる
手足まで鉛みたい
胸の内側が苦しい感じ
息が詰まる感じ
指先が冷たく感じる
身体が空っぽみたい
```

productionへ上記語句をcueとして入れず、fixtureは語義保持の回帰確認だけに使う。

### 10.8 合格条件

- S03本文に、入力にない「重さ」を追加しない。
- S01・S02のsource metaphorは失わない。
- single short-stateで同一quoteを二度出さない。
- labelだけでtext predicateを置換しない。
- 同じ入力は決定的に同じ本文になる。

---

## 11. 詳細設計4: human followの対象と役割

### 11.1 問題

現行follow rendererは、nucleusのnegative polarityまたはrefusal modalityを「負荷」と同一視する。

しかし、次は負荷ではない。

- 傷つけ続けたくない。
- 作業記録を捨てるつもりはない。
- 相談先の番号を消さずに残した。
- 予約した面談には行く。

これらは、自己否定の中に本人が残した**保護方向・継続拒否・助けへつながる行動**である。

### 11.2 修正owner

- `_build_response_and_policies()`
- `_self_denial_opposition_relation()`
- `_build_self_denial_lines()`
- `_build_regular_lines()`
- `_render_limited_opposition()`
- `_render_human_follow()`
- Gateのfollow compatibility check

### 11.3 follow role分類

human followは、polarity単独ではなく、nucleus kind、modality、relation、safety contextで分類する。

| follow role | 条件 | 受け取るもの | 禁止 |
|---|---|---|---|
| `burden_expression` | negative state / reactionで、保護方向やrefusal relationではない | 今置かれた負荷・苦しさ | 人格・原因断定 |
| `concrete_effort` | explicit action / attempt | 実際に動いた部分 | 成功保証 |
| `valued_change` | explicit positive change / evaluation | 本人が変化と見た部分 | 一般的な成長断定 |
| `retained_intention` | wish / next intention | 残したい・続けたい向き | 実行済み扱い |
| `protective_counterdirection` | self-denialに対するrefusal / not-closing direction | 自己否定だけで閉じなかった方向 | 「今の負荷」扱い |
| `help_seeking_preserved` | 相談先保持、面談へ行く等 | 支援につながる具体行動 | 安全保証・危機否定 |
| `integrated_current_state` | single short-state | 今の状態を置いたこと | 同じquoteの再復唱 |

### 11.4 選択優先順位

```text
1. safety contextのprotective counterdirection / help-seeking
2. concrete action / effort
3. explicit valued change
4. explicit retained intention
5. burden expression
6. integrated current state
```

negative/refusalであるだけでは`burden_expression`を選ばない。

### 11.5 self-denial

self-denial safe-stateでは、次の3役を分ける。

```text
fact boundary:
  自己評価を本人の確定事実として扱わない。

limited opposition:
  同じ入力にある、自己評価だけで閉じない反対方向を示す。

human follow:
  その反対方向を、本人が残した保護・継続・助けへの手がかりとして受け取る。
```

同じnucleusをlimited oppositionとhuman followで使う場合でも、二文が同じ内容の言い換えだけにならないよう、役割を分ける。必要ならrelation sentenceへfollowを統合する。

### 11.6 case別test obligation

| case | follow role |
|---|---|
| Known D | 自分を傷つけ続ける方向を肯定していない言葉を`protective_counterdirection`として扱う |
| I6-D01 | 作業記録を捨てないことを`protective_counterdirection`として扱う |
| I6-D02 | 相談先の番号を残したことを`help_seeking_preserved`として扱う |
| I6-D03 | 予約した面談へ行くことを`help_seeking_preserved`または具体的protective actionとして扱う |

### 11.7 Gate

Sentence bindingの`functional_atom_ids`とtarget nucleus / relationの組み合わせを検査する。

不合格例:

```text
refusal relation + human_follow:burden_expression
help-seeking action + generic valued_change
single short-state + separate follow using same exact anchor
```

body-free rejection reason:

```text
human_follow_role_target_mismatch
protective_counterdirection_misclassified_as_burden
help_seeking_role_missing
human_follow_duplicate_anchor
```

### 11.8 合格条件

- Known D・D01の反対方向を「今の負荷」としない。
- D02・D03の相談・面談行動を安全保証へ広げず、具体的行動として受け取る。
- follow targetは必ずEvidenceへ解決する。
- generic encouragement、人格保証、未来保証を追加しない。

---

## 12. 詳細設計5: ケース横断のテンプレ反復抑制

### 12.1 問題

現行はcompleted semantic templateを使っていなくても、同じline role、同じgeneric relation文、同じhuman follow tailが続くため、商品上はテンプレに見える。

特に次が問題である。

- S01〜S03: 同じsource句をobservationとfollowで二度使う。
- C01〜C03: comparison、concrete improvement、次に見たい軸が異なるのに、同じ「別の側面」「大切な基準」で閉じる。

### 12.2 原則

- 表面的な同義語shuffleやrandom variationを行わない。
- case hashで文型を変えない。
- 大量の完成文bankを作らない。
- semantic shape、relation type、follow role、入力長に応じてfunctional grammarを選ぶ。
- 構造が本当に同型なら文法骨格の共通は許容する。ただし、入力固有のaxis・result・intentionが一般語へ消えてはいけない。

### 12.3 semantic shape別surface

```text
single_short_state:
  observation + integrated followを1行

shift_with_result:
  shift endpoint + explicit resultを中心に1行
  concrete current change / actionを補助

reversal_with_unknown:
  provisional evaluation → discoveryの反転
  retain wish + unknown constraint
  next action evidence

comparison_with_self_evidence:
  comparison基準
  本人の具体的改善証拠
  次に見たい別axis

self_denial_with_counterdirection:
  fact boundary
  limited opposition
  protective / help-seeking follow
```

### 12.4 output内反復guard

runtime Gateで次を不合格にする。

- 同じnormalized source anchorを連続二文で再掲し、二文目が新しいrelation・boundary・roleを持たない。
- 一文目と二文目が同じnucleus集合を使い、functional atomだけ変えている。
- short single nucleusに独立follow lineを追加している。
- generic tailがsource-specific observationより長く、入力の新情報を増やさない。

fact boundaryとlimited oppositionのように責務が明確に異なる場合は例外とする。

### 12.5 cross-case signature audit

I6 corpus testで、body-free signatureを作る。

```text
line roles
surface functions
relation types
follow role atom
recovery stage
required nucleus count
required relation count
terminal functional atom
source anchor repeat count
```

anchor-masked signatureが同じであることだけでは自動失格にしない。同型fixtureでは同じ骨格が正しい場合があるためである。

次を組み合わせてfail / review flagを出す。

- 3件すべてで同じgeneric terminal sentenceが使われる。
- 必須の入力固有axisが一つ以上落ちる。
- source anchorを隠すと本文の大半が同一になる。
- follow roleが3件ともgeneric fallbackになる。
- human reviewerが、入力差より定型文を先に感じる。

### 12.6 C01〜C03の必須差分

各caseで最低限、次の三点を見える形にする。

| case | comparison axis | concrete self evidence | 次に見たいaxis |
|---|---|---|---|
| C01 | 周囲の処理速度 | 誤入力が前回より減った | 速さだけでなく確認精度 |
| C02 | 展示された完成品の仕上がり | 接合部のずれが前回より小さい | 仕上がりだけでなく工程安定 |
| C03 | 隣の菜園の収穫量 | 発芽株が先月より増えた | 量だけでなく根付き方 |

同じ比較構造でも、この三項が一般語へ潰れなければ、文法骨格の一部共通は許容する。

### 12.7 static anti-template

production sourceへ次がないことを検査する。

- Known A〜D / I6 case ID
- exact fixture sentence
- fixture固有名詞を条件にしたbranch
- mode別completed comment text dictionary
- case-specific cue table
- random paraphrase list

### 12.8 合格条件

- S01〜S03で無目的な二重quoteがない。
- C01〜C03で各三項が保持される。
- generic fallback followがfamily全件で使われない。
- 同型構造へ不自然な表現差を強制しない。
- 同一入力のdeterminismを維持する。

---

## 13. 詳細設計6: I0台帳と旧実機テストのcutover整合

### 13.1 目的

現行canonical cutoverが正しいのに旧fingerprint・旧owner・旧metaを期待してfailureになる状態を解消する。ただし、本文品質をgreenに見せるための期待値変更は行わない。

### 13.2 I0台帳

#### 実装前

- 現在のfailureをfreezeする。
- failureを次へ分類する。

```text
snapshot fingerprint mismatch
runtime ownership mismatch
legacy phrase reachability mismatch
actual production defect
unclassified
```

`unclassified`がある間は期待値を更新しない。

#### 実装後

- 最終production sourceからfingerprintを再計算する。
- canonical Grounded Plan / Sentence Surface / Gateがpublic pathからreachableであることを台帳へ反映する。
- legacy substantive routeのproduction reachabilityは0を期待する。
- test fixture内の語句存在とproduction runtime reachabilityを分ける。
- 同じbaseline IDでhashだけを書き換えず、新しいsnapshot revisionとして記録する。

### 13.3 旧Phase20-10 testの役割再定義

ファイル名は歴史参照があるため、無理由にrenameしない。docstringとtest責務を次へ分ける。

#### A. historical local display contract regression

確認するもの:

- `observation_status` / public status
- `comment_text`存在
- safety triage kind
- public input feedback inclusion
- RN modal eligibilityのlocal contract
- forbidden legacy substantive route tokenが出ないこと

確認しないもの:

- actual device provenance
- human readfeel
- exact response body
- old material slot / unknown slot / repair attemptの存在

#### B. current canonical runtime integration

`reply.meta["grounded_observation"]`から次を読む。

```text
generation_path
composer_source
semantic_quality_gate
public_reply_path_connected
material_quality
public_observation_status
public_comment_present
```

旧`MATERIAL_QUALITY_LOW_INFORMATION`、`visible_material_slots`、`unknown_slots`、旧gate recovery attemptsを、現行contractに存在しないまま要求しない。

### 13.4 historical case名の衝突防止

Phase20-10のA/B/C/Dと、現行core repairのKnown A/B/C/Dは別caseである。test内では次のように明示する。

```text
legacy_phase20_10_A
legacy_phase20_10_B
legacy_phase20_10_C
legacy_phase20_10_D
```

現行known 4はI0 helperのcase IDをsource of truthにする。意味の異なるA/B/C/Dを暗黙に同一視しない。

### 13.5 limited composer env

旧limited composer flagが残る場合、現行canonical substantive pathを変更しないことをtestする。

```text
flag off → canonical path
flag on  → canonical path
```

旧flagを使って別本文へ分岐させない。不要と確認できても、今回の指示だけで環境変数やlegacy façadeを削除しない。

### 13.6 期待値更新禁止条件

次の変更はしない。

- bad bodyを正解本文としてsubstring assertへ追加する。
- semantic gateの期待値を`failed`から`passed`へ変えるだけで修正扱いする。
- required nucleus期待を現行欠落に合わせて減らす。
- old testをskip / xfailしてfailureを消す。
- runtime ownerが不明なままfingerprintだけ更新する。

### 13.7 合格条件

- I0 failureがcutover事実へ整合し、未分類が0。
- canonical modulesがreachable ownerとして登録される。
- legacy substantive production reachabilityが0。
- historical display contractとcurrent semantic quality testが分離される。
- local RN eligibility testをactual device evidenceと呼ばない。

---

## 14. 詳細設計7: 同じ16件の再生成と華恋による全件再読

### 14.1 exact case set

```text
Known:
  A
  B
  C
  D

Unseen short-state:
  I6-S01
  I6-S02
  I6-S03

Unseen long-meaning-arc:
  I6-L01
  I6-L02
  I6-L03

Unseen comparative-change:
  I6-C01
  I6-C02
  I6-C03

Unseen self-denial:
  I6-D01
  I6-D02
  I6-D03
```

入力のsource of truthは、現行test helperとする。比較中に入力文を修正しない。

### 14.2 baseline freeze

実装開始前に次をfreezeする。

- case ID
- normalized current_input hash
- current comment text
- current body-free Grounded meta
- current plan / relation / sentence bindingのbody-free debug
- 実行snapshot fingerprint

body-fullはlocal-onlyで保持し、public metaやcommitted evidenceへ混ぜない。

### 14.3 修正後生成条件

- 同じ16件
- 同じsubscription tier
- 同じcontext mock / historyなし条件
- 同じtimezone等の非意味条件
- canonical generation path
- 一回目と二回目でdeterministic一致

### 14.4 automated candidateと華恋の実読を分ける

現行`assess_i7_local_surface()`のdeterministic checkは残すが、これだけでhuman passにしない。

#### automated candidate

```text
empty / overlong / too many lines
question substitution
internal taxonomy leak
dependent fragment
duplicate exact line
canonical meta
semantic gate
```

#### 華恋のlocal actual read

華恋がbodyを実際に読み、各caseへ次を記録する。

```text
required_nucleus_retained: pass / fail
required_relation_direction: pass / fail / not_applicable
lexical_fidelity: pass / fail
whole_input_balance: pass / fail
human_follow_fit: pass / fail
natural_japanese: pass / fail
non_template_readfeel: pass / fail
safety_boundary: pass / fail / not_applicable
wants_more_input_candidate: pass / fail
fatal_reason_refs: body-free codes only
verdict: local_human_pass / repair_required / hard_fatal
```

formal external human Blind QAとは区別し、`review_kind = karen_local_product_read`とする。

### 14.5 comparison artifact

local-only本文比較は、caseごとに次の順で出す。

```text
case ID
before body
after body
required nucleus差
relation差
lexical差
follow差
repetition差
華恋の判定
```

body-free receiptには本文を入れず、case ID、axis、verdict、reason code、snapshot fingerprintだけを入れる。

### 14.6 Gate 0 human合格

```text
16 / 16 local_human_pass
hard_fatal = 0
repair_required = 0
required nucleus visible missing = 0
required relation wrong direction = 0
lexical replacement fatal = 0
human follow role mismatch = 0
```

一件でも不合格なら、実機packetを作らず、該当ownerへ戻る。

### 14.7 I7 progression helperの修正

`decide_i7_progression()`は、automated candidate 16件だけで`local_ready`にしない。

新しい成立条件:

```text
automated_candidate_ready
AND
actual_local_review_count == 16
AND
all actual local verdict == local_human_pass
```

bodyをtest fixtureへ固定してhuman passを自動生成しない。華恋が実読して作ったbody-free receiptを明示的に渡す。

---

## 15. 詳細設計8: Gate 0合格後のexact 8実機確認

### 15.1 実行条件

次がすべてtrueの場合だけ実機確認へ進む。

```text
Gate 0 automated = pass
Gate 0 Karen local read = 16 / 16 pass
affected test suites = green
unclassified failure = 0
exact 8 packet = generated from frozen helpers
```

### 15.2 exact 8

```text
Known:
  A
  B
  C
  D

Unseen:
  I6-S03  short lexical fidelity
  I6-L03  reversal / unknown / next action
  I6-C01  comparison vs concrete self evidence
  I6-D02  self-denial + preserved help-seeking
```

入力本文はtest helperからpacket生成し、設計書への手コピーを正本にしない。これにより改行・句読点・labelのずれを防ぐ。

### 15.3 任意入力を使わない理由

- local結果との一致比較ができない。
- 四つのfamilyを通した証拠にならない。
- deployment差と入力差を分離できない。
- 読感不良が出ても、case固有かruntime mismatchか判定しにくい。
- ケース設計負担をMash様へ戻すことになる。

任意入力は、exact 8合格後の探索入力として別に扱う。

### 15.4 実機で確認する責務

実機確認の目的は、localで既に見つかる意味不良を探すことではない。次に限定する。

```text
deployment:
  現在配備されたbackendが修正snapshotか。

public path:
  canonical path / composer / semantic gate / public connectionか。

visible body:
  local合格構造が実機で失われていないか。

modal surface:
  見切れ、圧迫、過長、改行崩れ、読みづらさがないか。
```

### 15.5 Mash様へお願いする最小証拠

各8件について:

- 指定入力をそのまま実機へ入力
- 画面に出たEmlis本文
- modal screenshot。local-onlyで扱う
- body-free meta
  - `generation_path`
  - `composer_source`
  - `semantic_quality_gate`
  - `public_reply_path_connected`
- 見切れ・圧迫・表示崩れの有無

華恋側で確認できるログやコードを先に確認し、追加ログを安易に要求しない。

### 15.6 出口分岐

```text
8 / 8 canonical + visible body + modal pass:
  GATE1_CURRENT_INPUT_DEVICE_VERIFIED_STOPPED
  → P5 formal 24開始候補

runtime path mismatch:
  DEPLOYMENT_OR_PUBLIC_PATH_REPAIR_STOPPED

visible body mismatch / readfeel fail:
  GATE0_CURRENT_INPUT_REPAIR_RETURN_STOPPED

modal layout fail only:
  RN_MODAL_SURFACE_REPAIR_DESIGN_REQUIRED_STOPPED

meta不足で判定不能:
  DEVICE_EVIDENCE_INCONCLUSIVE_STOPPED
```

この時点でもP8は開始しない。P5 / P6 / continued sequence / P7 corpusの前段Gateを維持する。

---

## 16. Gate強化設計

### 16.1 現行fieldを維持したsubcheck追加

新しいtop-level public response keyを増やさず、現行Gateを次の意味へ強化する。

#### `text_semantic_retention_gate`

現行のrequired ID bindingに加え、次を含む。

- major arc roleを持つrequired nucleusがcovered
- required relation endpoint / directionがSentencePlanとSurfaceで保持
- lexical preservation nucleusがsource anchorを保持
- ungrounded sensation familyを追加していない

#### `anti_template_gate`

現行のtemplate / fixture flagに加え、次を含む。

- output内duplicate source anchor loopなし
- 同一nucleus集合を新情報なしで二文へ分けていない
- short-stateに不要な独立followなし

cross-case repetitionはrequest単体で判定できないため、I6 corpus testとhuman readで扱う。

#### `depth_adequacy_gate`

現行count被覆に加え、次を含む。

- long inputのmajor turn groupが本文へ残る
- human follow roleとtargetがcompatible
- required unknown / constraintが、意図を確定結果へ変えず残る

### 16.2 rejection reason

body-free codeだけを追加する。

```text
major_arc_role_missing
required_relation_direction_mismatch
required_reversal_missing
lexical_anchor_missing
ungrounded_sensation_family_added
human_follow_role_target_mismatch
protective_counterdirection_misclassified_as_burden
short_state_duplicate_anchor_loop
surface_semantic_repetition_without_new_role
```

### 16.3 Gateとhuman readの境界

Gateは、構造的不可能・根拠不整合・明白な反復を止める。自然な日本語、距離感、また入力したい感覚を自動で確定しない。

```text
semantic_quality_gate = passed
≠
product_readfeel_status = human_pass
```

runtimeでは`product_readfeel_status=not_evaluated`を維持する。local review receiptを渡した評価工程だけがhuman passを記録する。

---

## 17. テスト設計

### 17.1 test-firstの基本

修正前に、現在の不良を再現するtestを追加または強化する。exact完成本文はassertしない。

assert対象:

- required source span / nucleus
- relation type / endpoint / direction
- semantic role code
- functional atom role
- source lexical anchor保持
- forbidden ungrounded descriptor不在
- recovery coverage
- canonical path / body-free contract

### 17.2 unit test

#### retention

- major turn endpointがrequiredになる。
- required数が4を超えても降格しない。
- field first / lastだけでは中心扱いしない。
- memo_actionがmemoのcentral pivotを置換しない。

#### relation

- local contrast markerが直前・直後substantive nucleusを結ぶ。
- shiftはold/new dimensionがないpairへ付かない。
- provisional failure evaluationとdiscoveryが`preserves_despite`になる。
- uncertain relationを因果へ昇格しない。
- cross-field action relationに実根拠が必要。

#### lexical

- short-state main predicate anchorが残る。
- sourceにないsensation familyを追加しない。
- source metaphorは保持する。

#### follow

- refusal + self-denial oppositionをburdenへ分類しない。
- help-seeking actionが対応roleになる。
- integrated short followがcoveredになる。

### 17.3 structural test

Known B、L01、L02、L03、D01〜D03について、planとSentencePlanを検査する。

- expected source spansがrequired nucleusに含まれる。
- required relation endpointsが正しい。
- from / toが逆でない。
- required nucleiがsurface line bindingへ含まれる。
- minimal_groundedでも同じrequired集合を保つ。

### 17.4 metamorphic test

#### paraphrase

接続詞や語尾を変えてもrelation roleが維持される。

#### event noun replacement

報告書 / 陶器 / 菜園等を別名詞へ変えても、同じfixture語へ依存しない。

#### clause reorder

順序を変えた場合、from / toもsourceに従って変わり、元caseの方向を固定しない。

#### negation / modality

`捨てるつもりはない`を`捨てた`へ変えた場合、protective counterdirectionを維持しない。

#### label perturbation

emotion / categoryを変えても、text nucleusの語義・関係を上書きしない。

### 17.5 recovery test

各caseで全stageを生成する。

```text
full
optional_removed
integrated
hedged
minimal_grounded
```

全stageで:

- required nucleus covered
- required relation covered
- fact boundary保持
- required human follow保持またはintegrated coverage
- synthetic evidenceなし
- questionなし

### 17.6 anti-template test

- production sourceにcase ID / exact fixture / completed body dictionaryがない。
- short-stateでduplicate anchor loopがない。
- C01〜C03のcomparison / evidence / next axisが全件保持される。
- anchor-masked signatureをreportし、3件同一generic tailをfailureにする。
- random moduleやcase hashによるsurface variationがない。

### 17.7 safety / public contract test

- emergency / safety support ownerを維持。
- self-denial fact boundaryを維持。
- `observation_status=passed`時だけpublic commentが表示対象。
- top-level response key不変。
- raw bodyをmetaへ入れない。
- canonical path / composer / public connectionを維持。

### 17.8 I0 / historical test

- source fingerprintは実装完了後に再計算。
- runtime owner graphを現行canonicalへ更新。
- legacy route production reachability 0。
- historical local display testはcurrent metaを読む。
- local testをactual device evidence扱いしない。

### 17.9 suite実行条件

最低限、次の順で実行する。

```text
1. modified unit tests
2. Grounded I1-I7 targeted suite
3. safety / response contract / public feedback suite
4. I0 inventory suite
5. historical Phase20-10 local display suite
6. anti-template static / metamorphic suite
7. full collect-only
8. affected backend group matrix
9. full backend suite、または既存split matrixで全group実行
```

未分類failureが一つでもあればGate 0をpassにしない。明確なpre-existing unrelated failureがある場合も、証拠をfreezeし、今回変更との非関連を説明できなければ停止する。

---

## 18. 実装順

### R0: baseline・owner・不良freeze

**目的**  
修正前事実を固定し、期待値更新で不良を消せない状態にする。

**実行**

- current source fingerprint
- selected test result
- 16件body / meta / plan debug
- I0 failure分類
- historical test failure分類

**完了**

- current failure reasonが分類済み。
- 16 case input hashがfreeze。
- code変更なし。

**停止**

- case sourceが一致しない。
- 現行snapshotが受領zipと異なる。

---

### R1: failing structural testsを先に追加

**目的**  
Known B、L01〜L03、S03、Known D、D01の不良を、exact bodyなしで再現する。

**実行**

- required nucleus expectation
- relation endpoint / direction
- lexical fidelity
- follow role compatibility
- short duplicate anchor

**完了**

- 現行コードで意図したREDが出る。
- REDがcase固有語branchを要求しない。

**停止**

- exact本文assert以外で不良を表現できない場合、test設計を見直す。

---

### R2: required nucleus・whole-input retention修復

**目的**  
長文の中心核を4件上限から解放し、major turn単位でrequiredを決める。

**主ファイル**

- `emlis_ai_grounded_observation_plan.py`

**実行**

- arc role付与
- fixed cap撤回
- boundary heuristic弱化
- response selection修正
- recovery coverage確認

**完了**

- B、L01、L03のrequired tests green。
- long input逐語再掲にならない。

**停止**

- output lengthを理由にrequiredを再降格しようとした場合。

---

### R3: relation種別・方向・反転修復

**目的**  
局所markerとendpointを正しく結び、反転と因果を保持する。

**主ファイル**

- `emlis_ai_grounded_observation_plan.py`
- relation structural tests

**実行**

- local scope
- candidate scoring
- conflict resolution
- cross-field relation根拠化

**完了**

- L02・L03 relation tests green。
- clause reorder / paraphrase test green。

**停止**

- relation不確定を自然文のために断定する必要が出た場合。

---

### R4: Surface lexical fidelity・human follow修復

**目的**  
source predicateを守り、followを人間的役割に合わせる。

**主ファイル**

- `emlis_ai_grounded_sentence_surface.py`

**実行**

- short state generic「重さ」撤回
- integrated short follow
- follow role atom
- protective / help-seeking surface
- relation-specific surface

**完了**

- S03、Known D、D01〜D03 green。
- safety boundary維持。

**停止**

- generic encouragementや人格保証を追加しようとした場合。

---

### R5: Gate semantic subcheck・反復guard

**目的**  
IDがあるだけのfalse passを止める。

**主ファイル**

- `emlis_ai_grounded_observation_gate.py`
- `emlis_ai_grounded_sentence_surface.py` validation

**実行**

- major arc role coverage
- relation direction
- lexical fidelity
- follow compatibility
- duplicate anchor loop

**完了**

- 修正前型のbad plan / bad surfaceをGateがreject。
- good surfaceを過剰rejectしない。

**停止**

- Gateを沈黙装置へ変える場合。

---

### R6: I0・historical display testsを最終cutoverへ整合

**目的**  
production修復後の実態を台帳・回帰testへ正しく反映する。

**実行**

- final fingerprint計算
- owner graph更新
- legacy reachability更新
- Phase20-10 test責務分離
- canonical meta読取

**完了**

- 偽failure 0。
- body不良を隠す期待値変更0。

**停止**

- production修復が未確定のままsnapshotを更新しようとした場合。

---

### R7: targeted → affected matrix検証

**目的**  
局所greenだけでpublic path・safetyを壊していないことを確認する。

**実行**

- Section 17.9の順でsuite実行
- failure分類
- compile / collect

**完了**

- modified / adjacent suite green。
- unclassified failure 0。

**停止**

- response key、RN contract、safety ownerへの意図しない差分。

---

### R8: same 16 regeneration・華恋local read

**目的**  
自動構造greenを商品本文として確認する。

**実行**

- exact 16再生成
- deterministic rerun
- before / after比較
- 華恋による全件実読
- body-free receipt

**完了**

- 16 / 16 local_human_pass。

**停止**

- 1件でもrepair / fatal。

---

### R9: Gate 0判定

**目的**  
実機へ渡してよいかを二値で決める。

**出力**

```text
GATE0_LOCAL_PASS_DEVICE_PACKET_READY_STOPPED
または
GATE0_REPAIR_RETURN_STOPPED
```

pass条件を部分合格で緩めない。

---

### R10: exact 8 device packet生成

**開始条件**  
R9がpassの場合だけ。

**実行**

- helperからexact inputを生成
- case順を固定
- 必要meta項目を固定
- Mash様向け最小手順を作成

**完了**

- packet readyで停止し、実機証拠を待つ。

**禁止**

- 任意入力を求める。
- Gate 0失敗caseを実機へ渡す。
- P8実装へ進む。

---

## 19. commit / rollback単位

実装時は、次を独立rollback可能な単位にする。

```text
C0  failing structural tests / baseline only
C1  retention + major arc roles
C2  relation scope / direction / reversal
C3  lexical fidelity + human follow + sentence shape
C4  semantic Gate + repetition guard
C5  I0 / historical display contract alignment
C6  local 16 review tooling / body-free receipt
```

### rollback条件

- required coverageが後退した。
- emergency / safety supportのownerが変わった。
- public commentが出なくなった。
- raw bodyがmetaへ入った。
- API / DB / RN契約へ未設計差分が出た。
- fixture専用branchがproductionへ入った。
- deterministic outputが失われた。

旧substantive pathをfeature flagで復活させるrollbackは行わない。同じGrounded plan内の直前commitへ戻す。

---

## 20. 変更影響マトリクス

| ファイル | 変更候補 | 変更しないもの |
|---|---|---|
| `emlis_ai_grounded_observation_plan.py` | arc role、retention、relation candidate / direction、response selection | Evidence ID形式、Safety owner、question policy |
| `emlis_ai_grounded_sentence_surface.py` | relation-specific surface、lexical保持、integrated follow、follow role、validation | public response key、completed sentence bank |
| `emlis_ai_grounded_observation_gate.py` | semantic retention subcheck、follow compatibility、duplicate guard | product human readの自動確定 |
| `emlis_ai_reply_service.py` | 原則確認のみ。必要時はbody-free接続最小差分 | canonical path、composer、API route |
| I0 helper / test | final fingerprint、owner、reachability | historical証拠の上書き |
| I6 helper / test | structural expectation、metamorphic、corpus audit | fixture語をproduction cue化 |
| I7 helper / test | automated candidateとactual local reviewの分離 | 自動testでhuman passを捏造 |
| Phase20-10 test | local display contractとcanonical metaへ整合 | actual device evidenceという扱い、exact body assert |
| RN source | 変更なし | modal visible contract |
| DB / migration | 変更なし | physical name / write path |
| API schema | 変更なし | response key |

---

## 21. Gate 0判定チェックリスト

### 21.1 production

- [ ] canonical path一系統
- [ ] legacy substantive route unreachable
- [ ] case専用production条件なし
- [ ] required 4件上限撤回
- [ ] major arc required選定
- [ ] relation local scope / direction保持
- [ ] short lexical fidelity
- [ ] human follow role compatibility
- [ ] same-plan recovery
- [ ] question policy false

### 21.2 tests

- [ ] Known B required nucleus green
- [ ] L01 required nucleus green
- [ ] L02 relation direction green
- [ ] L03 reversal / unknown / action green
- [ ] S03 lexical green
- [ ] Known D / D01 follow green
- [ ] D02 / D03 help-seeking green
- [ ] S01〜S03 duplicate anchor green
- [ ] C01〜C03 specific axis green
- [ ] all recovery stages green
- [ ] safety / public contract green
- [ ] I0 current
- [ ] historical display test current
- [ ] static case-cue 0
- [ ] full collect成功
- [ ] unclassified failure 0

### 21.3 local human read

- [ ] 16件すべて実読
- [ ] hard fatal 0
- [ ] repair required 0
- [ ] whole-input balance pass
- [ ] lexical fidelity pass
- [ ] relation direction pass
- [ ] human follow fit pass
- [ ] natural Japanese pass
- [ ] non-template readfeel pass
- [ ] wants more input candidate pass

### 21.4 device entry

- [ ] Gate 0 binary pass
- [ ] exact 8 helper-generated packet
- [ ] arbitrary sampleなし
- [ ] required meta項目固定
- [ ] local bodyと実機bodyの比較方法固定
- [ ] screenshot local-only境界固定

---

## 22. 8項目とのtraceability

| Mash様指定 | 本設計section | 主owner | 出口証拠 |
|---|---|---|---|
| 1. required nucleusと長文全体保持 | 8 | Plan / SentencePlan / Recovery | B・L01・L03 structural green |
| 2. 関係種別・向き・反転 | 9 | Relation builder / relation surface | L02・L03 direction green |
| 3. 短文の語義保持 | 10 | short-state frame / surface / Gate | S03 lexical green |
| 4. human follow対象と役割 | 11 | response plan / follow surface / Gate | Known D・D01〜D03 green |
| 5. テンプレ反復抑制 | 12 | sentence shape / runtime guard / I6 audit | S / C family audit + human pass |
| 6. I0・旧実機test整合 | 13 | I0 inventory / Phase20-10 tests | false failure 0、unclassified 0 |
| 7. 同じ16件再生成・華恋再読 | 14 | I7 local review | 16 / 16 local_human_pass |
| 8. Gate 0後exact 8実機 | 15 | I7 progression / device packet | packet ready、8/8 device branch |

---

## 23. この設計だけでは実行しないこと

本設計書の作成は、実装開始の代わりではない。今回の成果物には次を含めない。

- production code patch
- test修正
- fingerprint更新
- 16件再生成結果の更新
- Gate 0 pass宣言
- exact 8実機依頼
- P8設計・実装

実装指示を受けた場合、R0から順に進め、途中の停止条件を飛ばさない。

---

## 24. 最終5区分

### 確認済み

- 現行canonical経路、主要owner関数、required 4件上限、generic「重さ」、negative/refusal follow、現行GateのID中心判定、I7 automated candidate境界、旧Phase20-10 meta依存を確認した。
- 8項目は同じGate 0修復単位として依存している。
- local 16件に、P8以前に直すべき不良がある。

### 未確認

- 本設計どおりに実装した際の最終日本語。
- 修正後test結果。
- 修正後16件の華恋判定。
- 実機deployment / modal結果。

### 書かれていない

- exact完成本文。
- API / DB / RNを変更する許可。
- Gate 0未合格でP8へ進む例外。
- 任意1件でexact 8を代替する条件。

### 推測禁止

- 修正前に「このalgorithmで必ず自然になる」と断定しない。
- test greenを商品合格としない。
- local passを実機passとしない。
- device passをP8開始許可としない。

### 次に実行すべきこと

実装指示を受けた場合、**R0 baseline freeze → R1 failing structural tests**から開始する。最初にproduction本文を直接言い換えず、現在の意味欠落・方向誤り・語義置換・follow誤役割を構造testで固定する。
