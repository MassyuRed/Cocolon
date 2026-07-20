# Cocolon / EmlisAI 根拠接続型・臨機応変観測応答中核 再設計詳細設計書・実装順

- 作成日: 2026-07-10 JST
- 対象: `mashos-api` EmlisAI current-input immediate observation
- 状態: **設計のみ。実装未着手**
- 再確認日: 2026-07-10 JST（受領local snapshot）
- 再確認結果: **中核設計は妥当。実装順・対象inventory・Safety境界に差分補強あり（§16.1〜§16.6）**
- 主対象Phase: P3 / P4 current-input baseline repair → P7 Product Quality Gate復帰
- 非対象: P8問いシステム実装、DB変更、API public contract変更、RN表示変更、外部AI追加

---

## 0. 結論

今回行う修正は、実機確認したA〜Dに対する個別回答の作成ではない。

EmlisAIの現行実装には、入力正規化、Evidence Ledger、観測材料、Perspective Observer、Observation Graph、Meaning Block、Focus / Relation / SentencePlan、各種Gateという汎用化の土台が存在する。一方、**入力から取得した意味を最終本文まで保持する一つの正本契約がなく、終盤のSurface生成・復旧経路で、意味がID・role・category・emotion・action labelへ縮退している**。

その結果、次が起きている。

1. 固定された完成文をmodeやsemantic IDで選ぶ。
2. fixtureに含まれる語句cueで専用の意味IDを立てる。
3. 入力本文を読めなかった場合にcategory / emotion / action labelを接続する。
4. 低情報扱いでは、既に書かれている状態よりunknown slotを優先し、「何があったか」という質問へ逃げる。
5. 自己否定では、Safety Triageの結果から2種類の固定本文を返す。
6. 実装実態が固定文・cue経路であっても、metadataでは `fixed_sentence_template_used=false`、`case_specific_route_used=false`、`composer_source=ai_generated` と記録される箇所がある。
7. public `observation_status=passed` と本文存在を確認するテストが、商品読感合格のように扱われている。

本設計では、既存の基盤を捨てて別の巨大システムを追加しない。**Evidence Spanから、入力内の意味核・関係・不明領域・人間的フォロー対象・事実境界を一つの内部計画へ束ね、その同じ計画をSentencePlan、Surface Realizer、Gate Recovery、metadataまで一貫して使う。**

A〜Dは、実装条件・runtime cue・期待完成文には使わない。現行不具合を再発させない既知回帰ケースとしてのみ保持する。

---

## 1. 本設計で固定する判断

### 1.1 EmlisAIが返すもの

EmlisAIは、入力内容を要約するだけの機能でも、感情labelへ共感文を足す機能でもない。

ユーザーが入力内で置いた、出来事、状態、反応、願い、止まり、葛藤、変化、行動、自己評価、価値判断を、入力内の根拠から組み直し、**「自分の入力が読まれた形」**として返す。

そのため、出力本文の実質的な意味は必ず次のいずれかから来なければならない。

- 入力本文または行動本文のEvidence Span
- ユーザー自身が明示した関係
- 接続詞、時制、否定、比較、変化表現から限定的に導ける構造関係
- 選択感情・category。ただし本文に意味核がある場合、これらを本文理解の代替にしてはならない
- 安全境界で必要な、明示claimと事実を分けるための限定的なboundary policy

一般論、人格評価、診断、入力外原因、固定された励まし、event語彙から選ばれた完成文は、本文の意味源にしない。

### 1.2 「どんな入力にも臨機応変」の定義

本設計における「どんな入力にも臨機応変」は、全入力を完全に理解できると保証する意味ではない。

次を保証対象にする。

- 既知fixture語彙の有無で専用routeへ入らない。
- 未知の名詞・固有表現があっても、その語をEvidenceとして保持し、既知modeへ無理に分類しない。
- 明示された状態と関係は、入力の長短やtopicにかかわらず同じ汎用契約で処理する。
- 根拠が足りない部分は、内部でunknownとして分離し、分かったふりをしない。
- 情報が少なくても、見えている状態を先に観測し、質問だけへ逃げない。
- 長文では複数の意味核と関係を保持し、一つのlabelへ圧縮しない。
- Safety対象でも、固定安全文へ置換するのではなく、同じ意味計画にSafety policyを重ねる。

### 1.3 固定文とSurface grammarの境界

禁止するもの:

- mode別の完成済み観測文
- family別の完成済みフォロー文
- A〜Dまたは過去fixtureの語句をruntime条件にした分岐
- event nounからreception modeを決め、そのmodeの本文を返す構造
- category / emotion / actionのlabelを並べただけの本文
- Gate failure時に、元の意味計画と無関係なfallback本文へ切り替える構造

許可するもの:

- 接続詞、助詞、句読点、敬体、hedge、時制調整などの機能的Surface atom
- 「見えたこと」「Emlisから」等、既存UI上のsection label
- 根拠boundされた意味核を、日本語として接続する構文rule
- Emergency safetyなど、法務・安全上固定が必要な運用文。ただし通常観測の本文bankとは分離する

判断基準は、文字列が固定かどうかだけではない。**本文の中心的意味が入力のEvidenceと関係から生成されているか**で判断する。

---

## 2. 確認した資料・実ファイル・証拠

### 2.1 前提資料・作業ルール

本設計では、少なくとも次を確認対象にした。

- `Cocolon_前提資料/00_karen_read_first.md`
- `Cocolon_前提資料/cocolon_thought_material_for_karen.md`
- `Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md`
- `Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md`
- `Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt`
- 同 `03_forbidden_insufficient_premise_and_actual_file_check.txt`
- 同 `04_forbidden_mixing_design_and_implementation.txt`
- 同 `05_forbidden_unrequested_completion_and_structure_addition.txt`
- 同 `07_forbidden_shifting_burden_to_user.txt`
- 同 `09_work_start_checklist.txt`
- 同 `10_stop_judgment_and_unwritten_rules.txt`
- 同 `11_cocolon_area_specific_do_not_break.txt`
- 同 `13_forbidden_reasking_existing_design_and_design_term_escape.txt`
- 同 `14_cocolon_joint_development_and_karen_thought_boundary.txt`
- 同 `15_trust_based_joint_development_boundary_2026_06_05.txt`

固定した前提は次のとおり。

- EmlisAIは即時観測を返す本体であり、Gate通過だけを目的にしない。
- fixtureは回帰確認用であり、runtime条件にしない。
- case専用mode / cue / surface / 完成文を追加しない。
- Gate failureは、意味を保った短縮・限定・断定弱化・再構成へ戻す。
- `pytest green`、fixture green、RN contract greenは商品成果ではない。
- 実装と設計を混ぜない。本書ではコード変更をしない。
- EmlisAI本体の弱さを、問いだけで補わない。
- API / DB / RNの既存契約を不用意に変えない。

### 2.2 ロードマップ

確認対象:

- `Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md`

本設計に直接関係する固定事項:

- P3はProduct Read Feelであり、Blind QAでread feeling、whole-input structure、感情温度、follow depth、non-template、自然さ、距離感、insight seed、継続入力意欲を確認する。
- P4ではlow information、limited grounding、self denial、long meaning arcなどのfamilyを、case専用routeなしで扱う。
- P7では、EmlisAI本体の不足を問いで先送りしない。
- P8問いシステムは本設計の実装対象ではない。
- R54系の境界補強は出口を持ち、商品読感確認へ戻る。

### 2.3 実機証拠

確認対象:

- `EmlisAI 実機4件確認・実装照合結果（2026-07-10）`
- 入力サンプルA〜D原文
- A〜Dの画面表示
- 同一実行のbackend log

確認できたこと:

- RNは本文を切り詰めていない。
- 画面の短さはbackend本文そのもの。
- A〜Dは現行buildを商品読感不合格として修正へ戻す証拠として十分。
- A〜Dだけでは、修正後の一般化合格を証明できない。
- A〜Dは既に既存test fixtureと一致しており、blind入力ではない。

### 2.4 現行API実ファイル

主に確認したファイル:

- `ai/services/ai_inference/emlis_ai_reply_service.py`
- `emlis_ai_types.py`
- `emlis_ai_current_input_bundle.py`
- `emlis_ai_evidence_ledger_service.py`
- `emlis_ai_input_material_bundle.py`
- `emlis_ai_safety_triage.py`
- `emlis_ai_input_meaning_block_service.py`
- `emlis_ai_observation_structure_material_service.py`
- `emlis_ai_perspective_observers.py`
- `emlis_ai_observation_integrator_service.py`
- `emlis_ai_complete_material_service.py`
- `emlis_ai_complete_composer_types.py`
- `emlis_ai_complete_focus_selector.py`
- `emlis_ai_complete_relation_graph_service.py`
- `emlis_ai_complete_sentence_planner.py`
- `emlis_ai_complete_surface_realizer.py`
- `emlis_ai_complete_initial_surface_recomposition.py`
- `emlis_ai_limited_grounding_reception_surface.py`
- `emlis_ai_limited_composer_client.py`
- `emlis_ai_low_information_observation_composer.py`
- `emlis_ai_self_denial_safe_state_answer.py`
- `emlis_ai_human_follow_selector.py`
- `emlis_ai_state_answer_ratio_policy.py`
- `config/emlis_observation_dictionary.v1.json`
- `config/emlis_observation_structure_dictionary.v1.json`
- `config/emlis_reception_assistance_dictionary.v1.json`
- `emlis_ai_response_contract_qa_matrix.py`
- `ai/tests/test_emlis_ai_phase20_10_real_device_recheck.py`

### 2.5 現行RN実ファイル

- `Cocolon/screens/input/InputFeedbackReplyModal.js`
- `Cocolon/screens/input/inputFeedbackModel.js`

確認結果:

- `input_feedback.comment_text` をそのままScrollViewへ表示する。
- `observation_status=passed` かつ本文ありの場合にmodalを出す。
- 本修正のためにRN契約を変更する必要はない。

### 2.6 未確認・本設計で断定しないこと

- zip取得後のproduction差分
- 削除済みcommitを含む完全なGit履歴
- production負荷・latencyの実測値
- A〜D以外の全familyの実機本文品質
- 既存全testの実行結果
- 本設計だけで未知の全入力が必ず商品合格になること

したがって、本書は「全EmlisAIが何も構築されていない」とは断定しない。一方、実機4件と実装照合から、current-inputの商品中核が現状のままでは合格できないことは設計前提にする。

---

## 3. 変更しない外部契約

以下は変更しない。

| 境界 | 維持内容 |
|---|---|
| API route | `/emotion/submit` |
| public body | `input_feedback.comment_text` |
| public status | `input_feedback.emlis_ai.observation_status` |
| RN表示条件 | `observation_status === passed` かつ本文あり |
| RN modal | `Emlisの観測` / ScrollView本文 |
| DB physical schema | 変更しない |
| 課金tier contract | 現行capabilityを維持する |
| greeting | 既存の `Emlisです。` / name handlingを維持する |
| external AI | 新規前提にしない |
| raw body境界 | public meta、release material、body-free evidenceへ漏らさない |

内部metadataは追加・整理できるが、public keyやenumは増やさない。

---

## 4. 現行処理の確認結果

### 4.1 現行mainline

`emlis_ai_reply_service.py` の現行mainlineは、概ね次の順で動く。

```text
current_input normalize
  -> source bundle
  -> Evidence Ledger
  -> Observation Structure Material
  -> Perspective Observers
  -> Perspective Board
  -> Observation Graph
  -> Safety Triage
  -> Material Eligibility Route
  -> Composer Candidate
  -> Reader / Grounding / Template / Display Gates
  -> bounded reroute
  -> low-information repair
  -> Gate Recovery
  -> complete initial surface recomposition
  -> final pre-return gates
  -> post-final recovery
  -> self-denial safe-state path
  -> P5/P6 overlay
  -> public reply
```

入力をEvidenceへ分解し、観測claimとrelationを持つ前半は存在している。問題は、この意味を最終本文へ渡す経路が一つに固定されていないことにある。

### 4.2 既に残す価値がある基盤

次は再利用する。

- `EmlisCurrentInputBundle`: current inputの型境界
- `EvidenceSpan`: source field、位置、type、confidenceを持つ根拠
- `ObservationClaim`: evidence-boundされた観測候補
- `RelationEdge`: claim間の関係
- `InputMeaningBlock`: 長文の意味単位
- `MeaningCoveragePlan` / `MajorMeaningRetentionPlan`: 長文の落とし防止
- `WholeInputMeaningArc`: 入力順序と意味の流れ
- Safety Triage / emergency boundary
- Reader / Grounding / Template / Visible / Display gateのfail-closed思想
- P5 User Label Connection / P6 Structure Insightのoverlay境界

### 4.3 現行の構造欠陥

#### 4.3.1 意味の正本が複数に分かれている

現行には、Evidence Span、Observation Claim、Meaning Block、Focus Item、Relation Graph Node、Sentence Planなど複数の表現がある。しかし、Surface生成が参照する後半のobjectでは、実質的な意味内容より、`material_id`、`phrase_unit_id`、`role`、`relation_type`といった識別子が中心になる。

そのため、入力固有の意味を自然文へ戻す材料が足りず、Surface layerが完成文bankまたはlabel assemblyへ依存する。

#### 4.3.2 role判定が入力例に近い語彙表へ依存している

`emlis_ai_input_meaning_block_service.py` は、段落・節を分ける基盤を持つ一方、巨大な `_ROLE_DEFINITIONS` のkeyword hit数でroleを選ぶ。ここには、過去入力や特定familyに近いphraseが多数含まれる。

「段落を意味単位として保持する」概念は残すが、「例に近い語句があればroleを確定する」方式は、構造operatorとsource anchorを中心に再設計する。

#### 4.3.3 Focus / Relation / SentencePlanがpropositionを持たない

現行Focus ItemやRelation Graph Nodeは、ID、role、rank、relation typeを持つが、次のような意味命題を正本として持っていない。

- 誰／何についての状態か
- 何がどう変化したか
- 何を望んでいるか
- 何が妨げになっているか
- ユーザー自身がどの因果・対比を明示したか
- どのEvidence Spanがその命題を支えるか

relation typeだけが残り、relationの両端にある意味が失われるため、本文で関係を再現できない。

再照合では、complete composer系で最初に明確に確認できる内容消失点が、`CompleteMaterialUnit` から `CompleteFocusItem` へ変換する境界にあることを確認した。前者の `as_focus_seed()` は `material_text` を渡すが、後者のdataclassと `_focus_items_for_rows()` はその内容を保持せず、以後のRelation Graph Node / SentencePlan Lineも命題本文を持たない。したがって、Surface修正より先に、この境界からcanonical nucleus / relation参照を通す必要がある。

#### 4.3.4 Surface / Recoveryに内容を持つ完成文がある

現行5ファイルを同一条件で機械的に再走査すると、日本語literalを含むfunctionは45件確認できる。UI label、正規表現、機能atomも含むため、この件数自体は撤回対象数ではない。少なくとも次は内容を持つ完成文bankまたは完成文に近い。

- `emlis_ai_complete_surface_realizer.py`
  - `_daily_unpleasant_surface_text_for_line`
  - `_self_denial_support_surface_text_for_line`
  - `_daily_positive_surface_text_for_line`
  - `_self_understanding_surface_text_for_line`
  - `_effort_pace_surface_text_for_line`
  - `_structure_insight_surface_text_for_line`
- `emlis_ai_complete_initial_surface_recomposition.py`
  - `_compose_observation_sentence`
  - `_compose_reception_sentence`
- `emlis_ai_limited_grounding_reception_surface.py`
  - `_compose_observation_section`
  - `_compose_reception_section`
- `emlis_ai_low_information_observation_composer.py`
  - question / known-scope / bridgeの完成Surface群
- `emlis_ai_self_denial_safe_state_answer.py`
  - `_compose_body`

これらは、文章が完全一致するかではなく、入力固有の意味を持たないままmode / cue / labelから内容を供給する点が問題である。

#### 4.3.5 fixture語彙がruntime条件に入っている

`emlis_ai_complete_initial_surface_recomposition.py` の `_SEMANTIC_MATERIAL_PATTERNS` には、次のような過去fixtureに近いphraseが入っている。

- 「昨日の自分」
- 「人と比べ」
- 「小さな変化」
- 「少し勇気」
- 「ほんの少し前」

`emlis_reception_assistance_dictionary.v1.json` の `event_hints` にも、「立ちション」「配信」「誰かとお話」「別れた」「怒ってくれて」等の具体event語彙があり、reception mode選択を補助している。

さらに、`emlis_ai_input_material_bundle.py::_SEMANTIC_MATERIAL_PATTERNS` にも、「昨日の自分」「人と比べ」「小さな変化」「少し勇気」「ほんの少し前」等があり、Surface以前にsemantic material IDを生成する。にもかかわらず同moduleのmetadataは、case / cue runtime未使用を示すflagを返している。後段Surfaceだけを撤回しても、前段で同じcase寄りsemantic IDが再生成されるため、inventoryと撤回対象をmaterial routeまで広げる。

具体名詞はEvidenceとして保持してよい。しかし、具体名詞が、観測内容や完成Surfaceを選ぶswitchになってはならない。

#### 4.3.6 label assemblyが入力理解の代替になっている

`emlis_ai_complete_initial_surface_recomposition.py` では、semantic IDに当たらなければ、category、emotion、actionをphrase化し、

```text
topicについて、feelingとactionが重なっている状態
```

という形へ落ちる。

選択labelは補助Evidenceであり、本文に明確な意味核がある場合、その理解を置き換えてはならない。

#### 4.3.7 低情報判定が「短い状態入力」を失っている

現行low-information pathは、unknown event / cause / targetを優先し、「何があったか」を作る。これにより、短くても意味がある「全部だるい」「何もしたくない」のようなstate nucleusが中心観測から落ちる。

文字数が短いことと、意味がないことは同じではない。

#### 4.3.8 自己否定Safe Stateが固定2本文である

`emlis_ai_self_denial_safe_state_answer.py::_compose_body` は、continuation refusalの有無により2種類の本文を返す。Safety境界自体は必要だが、通常のself-denial responseも、入力内の状態・自己評価・ユーザー自身の反証・負荷・意図を読んで組む必要がある。

また、`emlis_ai_safety_triage.py` のnon-emergency self-denial判定には、D相当の「自分を傷つけてるのは私」「いい事なんて絶対にない」に近い完全句が含まれる。emergency / support-requiredのSafety分離は維持するが、既知fixture句そのものを通常self-denial routeの正本条件にしてはならない。self-reference、self-directed negative evaluation、continuation refusal等の広い構造へ置換し、先にSafety paraphrase / false-positive回帰を固定する。

#### 4.3.9 synthetic Evidence IDがある

`emlis_ai_complete_initial_surface_recomposition.py::_evidence_span_ids` は、visible slotやrelation IDから `p5_*` 形式のIDを生成する。これはEvidence Ledgerの実在span IDではない。

Sentence bindingは、実在Evidence Spanへ解決できなければならない。metadata上だけ根拠があるように見せるID生成は禁止する。

#### 4.3.10 delivery passと商品合格が混ざっている

`test_emlis_ai_phase20_10_real_device_recheck.py` は、public status、本文存在、modal表示、見出し、特定substringを確認する。これは表示経路の回帰として必要だが、read feeling、whole-input structure、follow depth、non-template、insight deltaを確認していない。

public `passed` は外部契約として維持するが、内部では次を分離する。

- delivery/display gate result
- automated semantic quality result
- human product readfeel result

---

## 5. 目標アーキテクチャ

### 5.1 一つの正本経路

```text
EmlisCurrentInputBundle
  -> EvidenceLedger
  -> Source-preserving Clause Units
  -> Semantic Nuclei
  -> Explicit / Bounded Relations
  -> GroundedObservationPlan  ← 内部意味正本
      -> Safety / Fact Boundary Policy
      -> Human Follow Target Selection
      -> Required Coverage Contract
      -> Length / Surface Shape Policy
  -> GroundedSentencePlan
  -> Generic Surface Realizer
  -> Sentence-Evidence Binding
  -> Semantic Coverage / Grounding / Anti-template / Safety Gates
  -> Plan-preserving Recovery
  -> public comment_text
  -> P5/P6 overlay（base品質合格後のみ）
```

### 5.2 新しいparallel systemを作らない

`GroundedObservationPlan` は、既存Evidence、ObservationClaim、RelationEdge、MeaningBlock、CoveragePlanを捨てるための別システムではない。

目的は次のとおり。

- 既存の複数objectから必要情報を一つの正本へ束ねる。
- 後半のFocus / Relation / SentencePlan / Surfaceが、IDだけでなく意味命題を参照できるようにする。
- Recoveryも同じplanを使う。
- P5/P6も、base planを弱い本文の救済として使わず、合格したbaseへ追加する。

実装時に、既存classを拡張するか、新しいinternal dataclass fileへ分けるかは、import循環と変更範囲を確認して決める。本設計段階では物理ファイルを固定しない。

---

## 6. 内部意味モデル

### 6.1 Semantic Nucleus

入力内で、応答時に独立して失ってはいけない意味単位。

| 項目 | 内容 |
|---|---|
| `nucleus_id` | request内で一意 |
| `kind` | event / state / reaction / wish / constraint / action / change / self_evaluation / value / uncertainty / conclusion / other_explicit |
| `source_span_ids` | 実在Evidence Ledger IDのみ |
| `source_fields` | memo / memo_action / emotions / categories等 |
| `surface_anchor_ids` | 安全に再表現できるphrase unit |
| `semantic_frame` | actor、predicate、target、polarity、modality、time、degree等 |
| `grounding_kind` | explicit / user_stated_relation / bounded_structural_inference |
| `certainty` | claim強度 |
| `priority` | 入力内中心度 |
| `retention` | required / should / optional |
| `allowed_claim_scope` | Surfaceで言える範囲 |
| `forbidden_inference_codes` | 原因・人格・診断等の禁止 |

`kind` は安定した広い分類だけを持ち、具体eventやtopicをenum化しない。未知語・固有名詞はsource anchorとして残す。

### 6.2 Semantic Relation

意味核同士の関係。

主なrelation type:

- `temporal_before_after`
- `shift_from_to`
- `contrast`
- `coexistence`
- `user_stated_cause`
- `user_stated_result`
- `attempt_and_block`
- `wish_and_constraint`
- `action_supports_change`
- `evaluation_about_event`
- `self_evaluation_about_state`
- `preserves_despite`
- `uncertain_connection`
- `continuation_or_refusal`

relationは必ず `from_nucleus_id` と `to_nucleus_id` を持つ。単に `relation_type=change` だけを持つnodeは合格にしない。

### 6.3 Unknown Boundary

不明領域は、質問文の素材ではなく、Surface claimの上限を決める内部境界として保持する。

例:

- event unknown
- cause unknown
- target unknown
- duration unknown
- relation uncertain
- selected emotion target unknown

P7 current-input base responseでは、unknownが存在しても質問を主出力にしない。見えているnucleusを先に返し、不明領域に踏み込まない。

### 6.4 Grounded Observation Plan

最終本文を作る前の意味正本。

- 何を中心観測にするか
- 何を補助観測にするか
- どのrelationを本文に残すか
- どの事実境界が必須か
- 何をhuman followの対象にするか
- 何を省略してよいか
- どの長さ・section形状にするか
- どのclaimは不明のため出してはいけないか

を持つ。

### 6.5 Grounded Sentence Binding

各出力文は、最低一つのnucleusまたはrelationへ結びつく。

- `sentence_id`
- `line_role`
- `nucleus_ids`
- `relation_ids`
- `evidence_span_ids`
- `claim_scope`
- `functional_atom_ids`
- `contains_question`
- `required`

`evidence_span_ids` はEvidence Ledgerへ解決できなければGate failureとする。

### 6.6 Coverage Report

本文生成後に、計画とSurfaceを照合する。

- required nuclei covered / missing
- required relations covered / missing
- fact boundary covered / missing
- follow target covered / missing
- unbound sentence count
- text-present inputでlabel-onlyになっていないか
- questionが観測を押しのけていないか
- fixed semantic surface / example cue path使用有無
- output depthが意味複雑度に足りるか

---

## 7. JSON / Schema案

以下は内部contract案であり、本設計段階では実ファイルを作らない。実装時にPython dataclassを正本とするか、JSON Schemaを併設するかを決める。

### 7.1 GroundedObservationPlan Schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.grounded_observation_plan.v1",
  "type": "object",
  "required": [
    "schema_version",
    "input_profile",
    "nuclei",
    "relations",
    "unknown_boundaries",
    "response_plan",
    "coverage_requirements",
    "surface_policy",
    "safety_policy"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.grounded_observation_plan.v1"
    },
    "input_profile": {
      "type": "object",
      "required": [
        "text_presence",
        "material_quality",
        "semantic_complexity",
        "nucleus_count",
        "relation_count",
        "safety_kind"
      ],
      "properties": {
        "text_presence": {
          "enum": ["text_present", "labels_only", "empty"]
        },
        "material_quality": {
          "enum": [
            "grounded",
            "short_state_sufficient",
            "limited_grounding",
            "labels_only_limited",
            "empty",
            "safety_routed"
          ]
        },
        "semantic_complexity": {
          "enum": ["minimal", "single", "multi", "long_arc"]
        },
        "nucleus_count": {"type": "integer", "minimum": 0},
        "relation_count": {"type": "integer", "minimum": 0},
        "safety_kind": {"type": "string"}
      },
      "additionalProperties": false
    },
    "nuclei": {
      "type": "array",
      "items": {"$ref": "#/$defs/nucleus"}
    },
    "relations": {
      "type": "array",
      "items": {"$ref": "#/$defs/relation"}
    },
    "unknown_boundaries": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["unknown_id", "dimension", "surface_policy"],
        "properties": {
          "unknown_id": {"type": "string"},
          "dimension": {"type": "string"},
          "affected_nucleus_ids": {
            "type": "array",
            "items": {"type": "string"}
          },
          "surface_policy": {
            "enum": ["do_not_claim", "hedge_only", "omit"]
          }
        },
        "additionalProperties": false
      }
    },
    "response_plan": {
      "type": "object",
      "required": [
        "response_kind",
        "primary_nucleus_ids",
        "supporting_nucleus_ids",
        "relation_ids",
        "fact_boundary_nucleus_ids",
        "human_follow_target_ids",
        "required_nucleus_ids",
        "optional_nucleus_ids",
        "question_policy",
        "surface_shape"
      ],
      "properties": {
        "response_kind": {
          "enum": [
            "normal_observation",
            "short_state_observation",
            "limited_grounding_observation",
            "labels_only_limited_observation",
            "self_denial_safe_state_answer",
            "emergency_safety",
            "unavailable"
          ]
        },
        "primary_nucleus_ids": {
          "type": "array",
          "items": {"type": "string"}
        },
        "supporting_nucleus_ids": {
          "type": "array",
          "items": {"type": "string"}
        },
        "relation_ids": {
          "type": "array",
          "items": {"type": "string"}
        },
        "fact_boundary_nucleus_ids": {
          "type": "array",
          "items": {"type": "string"}
        },
        "human_follow_target_ids": {
          "type": "array",
          "items": {"type": "string"}
        },
        "required_nucleus_ids": {
          "type": "array",
          "items": {"type": "string"}
        },
        "optional_nucleus_ids": {
          "type": "array",
          "items": {"type": "string"}
        },
        "question_policy": {
          "type": "object",
          "required": ["allowed", "reason"],
          "properties": {
            "allowed": {"const": false},
            "reason": {"const": "p7_base_observation_must_not_be_replaced_by_question"}
          },
          "additionalProperties": false
        },
        "surface_shape": {
          "enum": ["plain", "two_stage", "multi_paragraph"]
        }
      },
      "additionalProperties": false
    },
    "coverage_requirements": {
      "type": "object",
      "required": [
        "all_required_nuclei_must_be_covered",
        "all_required_relations_must_be_covered",
        "all_sentence_evidence_ids_must_resolve",
        "label_only_allowed_only_without_text_nuclei"
      ],
      "properties": {
        "all_required_nuclei_must_be_covered": {"const": true},
        "all_required_relations_must_be_covered": {"const": true},
        "all_sentence_evidence_ids_must_resolve": {"const": true},
        "label_only_allowed_only_without_text_nuclei": {"const": true},
        "human_follow_required": {"type": "boolean"},
        "fact_boundary_required": {"type": "boolean"}
      },
      "additionalProperties": false
    },
    "surface_policy": {
      "type": "object",
      "required": [
        "content_source",
        "completed_semantic_template_allowed",
        "example_cue_route_allowed",
        "synthetic_evidence_id_allowed",
        "unknown_word_policy"
      ],
      "properties": {
        "content_source": {"const": "grounded_plan_only"},
        "completed_semantic_template_allowed": {"const": false},
        "example_cue_route_allowed": {"const": false},
        "synthetic_evidence_id_allowed": {"const": false},
        "unknown_word_policy": {
          "enum": ["retain_as_source_anchor", "omit_without_inference"]
        },
        "tone_family": {"type": "string"},
        "hedge_policy": {"type": "string"}
      },
      "additionalProperties": false
    },
    "safety_policy": {
      "type": "object",
      "required": [
        "safety_kind",
        "identity_claim_must_not_be_accepted_as_fact",
        "emergency_path_must_not_be_overridden"
      ],
      "properties": {
        "safety_kind": {"type": "string"},
        "identity_claim_must_not_be_accepted_as_fact": {"type": "boolean"},
        "emergency_path_must_not_be_overridden": {"const": true},
        "required_boundary_codes": {
          "type": "array",
          "items": {"type": "string"}
        }
      },
      "additionalProperties": false
    }
  },
  "$defs": {
    "nucleus": {
      "type": "object",
      "required": [
        "nucleus_id",
        "kind",
        "source_span_ids",
        "source_fields",
        "semantic_frame",
        "grounding_kind",
        "certainty",
        "priority",
        "retention",
        "allowed_claim_scope",
        "forbidden_inference_codes"
      ],
      "properties": {
        "nucleus_id": {"type": "string"},
        "kind": {
          "enum": [
            "event",
            "state",
            "reaction",
            "wish",
            "constraint",
            "action",
            "change",
            "self_evaluation",
            "value",
            "uncertainty",
            "conclusion",
            "other_explicit"
          ]
        },
        "source_span_ids": {
          "type": "array",
          "minItems": 1,
          "items": {"type": "string"}
        },
        "source_fields": {
          "type": "array",
          "minItems": 1,
          "items": {"type": "string"}
        },
        "surface_anchor_ids": {
          "type": "array",
          "items": {"type": "string"}
        },
        "semantic_frame": {
          "type": "object",
          "required": ["predicate_kind", "polarity", "modality"],
          "properties": {
            "actor": {"type": "string"},
            "predicate_kind": {"type": "string"},
            "target_anchor_ids": {
              "type": "array",
              "items": {"type": "string"}
            },
            "polarity": {"enum": ["positive", "negative", "mixed", "neutral"]},
            "modality": {
              "enum": ["fact", "feeling", "wish", "possibility", "uncertain", "refusal", "intention"]
            },
            "time_scope": {"type": "string"},
            "degree": {"type": "string"},
            "attributes": {"type": "object"}
          },
          "additionalProperties": false
        },
        "grounding_kind": {
          "enum": ["explicit", "user_stated_relation", "bounded_structural_inference"]
        },
        "certainty": {"type": "number", "minimum": 0, "maximum": 1},
        "priority": {"type": "number", "minimum": 0, "maximum": 1},
        "retention": {"enum": ["required", "should", "optional"]},
        "allowed_claim_scope": {"type": "string"},
        "forbidden_inference_codes": {
          "type": "array",
          "items": {"type": "string"}
        }
      },
      "additionalProperties": false
    },
    "relation": {
      "type": "object",
      "required": [
        "relation_id",
        "type",
        "from_nucleus_id",
        "to_nucleus_id",
        "source_span_ids",
        "grounding_kind",
        "certainty",
        "retention"
      ],
      "properties": {
        "relation_id": {"type": "string"},
        "type": {
          "enum": [
            "temporal_before_after",
            "shift_from_to",
            "contrast",
            "coexistence",
            "user_stated_cause",
            "user_stated_result",
            "attempt_and_block",
            "wish_and_constraint",
            "action_supports_change",
            "evaluation_about_event",
            "self_evaluation_about_state",
            "preserves_despite",
            "uncertain_connection",
            "continuation_or_refusal"
          ]
        },
        "from_nucleus_id": {"type": "string"},
        "to_nucleus_id": {"type": "string"},
        "source_span_ids": {
          "type": "array",
          "minItems": 1,
          "items": {"type": "string"}
        },
        "grounding_kind": {
          "enum": ["explicit", "user_stated_relation", "bounded_structural_inference"]
        },
        "certainty": {"type": "number", "minimum": 0, "maximum": 1},
        "retention": {"enum": ["required", "should", "optional"]}
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

### 7.2 SentenceBinding案

```json
{
  "schema_version": "cocolon.emlis.grounded_sentence_binding.v1",
  "sentence_id": "sentence:1",
  "line_role": "primary_observation",
  "nucleus_ids": ["nucleus:1", "nucleus:2"],
  "relation_ids": ["relation:1"],
  "evidence_span_ids": ["s1", "s2"],
  "claim_scope": "single_input_bounded_observation",
  "functional_atom_ids": ["contrast_connector", "soft_observation_ending"],
  "contains_question": false,
  "required": true,
  "body_text_in_meta": false
}
```

### 7.3 CoverageReport案

```json
{
  "schema_version": "cocolon.emlis.observation_coverage_report.v1",
  "required_nucleus_ids": ["nucleus:1", "nucleus:2"],
  "covered_required_nucleus_ids": ["nucleus:1", "nucleus:2"],
  "missing_required_nucleus_ids": [],
  "required_relation_ids": ["relation:1"],
  "covered_required_relation_ids": ["relation:1"],
  "missing_required_relation_ids": [],
  "unresolved_evidence_span_ids": [],
  "unbound_sentence_ids": [],
  "text_nucleus_present": true,
  "label_only_assembly_used": false,
  "example_cue_route_used": false,
  "fixed_semantic_surface_used": false,
  "question_dominates_observation": false,
  "fact_boundary_required": false,
  "fact_boundary_covered": true,
  "human_follow_required": true,
  "human_follow_covered": true,
  "automated_semantic_gate": "passed",
  "product_readfeel_status": "not_evaluated",
  "body_free": true
}
```

---

## 8. 入力から意味計画までの処理

### 8.1 Source-preserving分割

入力を次のfield単位で分けたまま扱う。

- `memo`
- `memo_action`
- selected emotions
- categories
- timestamp / record context
- P5/P6が許可された場合のみowned history

本文は、改行、句読点、接続表現、引用境界でclause unitへ分ける。各unitはsource offsetとfieldを保持する。

禁止:

- normalize時に否定・程度・時制を落とす。
- 具体名詞をrole名へ置き換えて原文との接続を失う。
- action本文をtopic labelへ要約して、thought本文との関係を失う。

### 8.2 構造operatorの抽出

特定event語彙ではなく、言語上の広い構造を取る。

対象例:

- 対比: でも、けれど、一方で、〜のに
- 変化: 今までは／今は、〜になった、減った、増えた、戻った
- 因果: 〜ことで、〜から、〜ので、結果として
- 意図: したい、していきたい、しようと思う
- 行動不能: したくない、できない、動けない
- 不確実: 気がする、かもしれない、わからない
- 評価: 良い変化、嫌だった、大切にしたい
- 継続／拒否: 続けている、もう続けたくない、いいことはない

これらはfixture cueではなく、意味関係を取るための文法・機能表現である。

### 8.3 Semantic Nucleus抽出

各clauseから、明示されている内容をnucleusへする。

抽出順:

1. 明示state / event / action / wish / evaluationを取る。
2. 否定・modality・timeを保持する。
3. 選択emotion / categoryを補助Evidenceとして接続する。
4. clause間operatorからrelationを作る。
5. relationが曖昧なら `uncertain_connection` とし、原因へ断定しない。
6. unknown wordはsource anchorのまま保持し、意味を勝手に補うことをしない。

### 8.4 選択emotion・categoryの扱い

- 本文にsemantic nucleusがある場合、emotion / categoryは中心内容を置き換えない。
- 本文と選択labelが異なる場合、どちらかを正しいと決めず、toneまたはsecondary contextとして扱う。
- 本文なし・labelのみの場合は、label自体が唯一の明示Evidenceである。その場合に限り `labels_only_limited_observation` を許可する。
- labelのみの入力で、出来事・原因・人格・希望を補わない。

### 8.5 Required / Should / Optional判定

#### Required

- 入力の中心state
- ユーザー自身が明示した変化
- 明示された願いと制約の対
- 長文を成立させる主要な対比・因果・shift
- 自己否定と、それを続けることへの本人の評価
- Safety / fact boundaryに必要な核
- thoughtとactionをつなぐ明示relation

#### Should

- secondary emotion
- contextとなるevent
- 補助的な行動
- 入力内で繰り返された価値

#### Optional

- category label
- 同じ内容の反復
- Surfaceに出さなくても主要構造を壊さない背景

Requiredを落として短文化することは禁止する。文字数を減らす必要がある場合は、文法を圧縮し、同じsentenceへ複数nucleusをrelation付きで統合する。

---

## 9. Observation Content Planner

### 9.1 基本構成

response planは、入力に応じて次を組む。

1. `primary observation`
2. `supporting relation / whole-input structure`
3. 必要な `fact boundary`
4. `human follow`
5. optional close

すべての入力で同じsentence数・section数にはしない。

### 9.2 primary observation

入力の中心nucleusまたは中心relationを置く。

- 短い状態入力: 明示stateを中心にする。
- 長文: 一つのtopicではなく、全体を成立させるshift / contrast / wish-constraint等を中心にする。
- 自己否定: identity factとして受けず、self-evaluationの強さとユーザー自身の認識を分ける。

### 9.3 supporting relation

「なぜそう見えたか」を解説調で列挙するのではなく、入力の流れを保持するために使う。

- before → now
- attention / 기준のshift
- action → observation → self-recognized change
- wish ↔ constraint
- pain ↔ remaining value

### 9.4 human follow

Human followは、一般共感文ではなく、入力内に置かれた人間的な重さを受け取る層。

候補target:

- 明示された負荷
- 続けてきた努力
- 小さくても消したくない変化
- 言葉に置いたこと自体
- 望みと怖さを同時に持っていること
- 自分を傷つける流れへの本人の違和感
- 勇気を出した／行動したという入力内事実

禁止:

- 「あなたはすごい」等の人格保証
- 「大丈夫」等の根拠のない保証
- 「休んでください」等の行動指示を通常観測へ混ぜる
- categoryやemotionだけからフォロー内容を選ぶ

### 9.5 question policy

P7 current-input base responseでは、質問を観測の代わりにしない。

- `question_policy.allowed=false`
- unknownはclaim上限として内部利用する。
- P8問いシステム実装時に、別の承認済み設計で扱う。

---

## 10. family別の汎用処理

### 10.1 short / low information

#### 判定を二つへ分ける

1. `short_state_sufficient`
   - 文字数は短いが、state、wish、拒否、感情反応等が明示されている。
   - 例: 疲労、何もしたくない、怖い、嬉しい、行きたくない等。
   - event / causeが不明でも、stateを観測できる。

2. `truly_limited`
   - 具体的なstateもrelationもほぼない。
   - labelのみ、単語一つ、意味が壊れている等。

`short_state_sufficient` を `unknown event` へ潰さない。

#### Surface義務

- 明示stateを残す。
- 行動意欲の有無、負荷、拒否等が書かれていれば保持する。
- 原因を作らない。
- 「何があったか」を主出力にしない。
- label-onlyの場合は、選ばれたlabelだけを限定的に扱い、理解したふりをしない。

### 10.2 long meaning arc

長文は、character countだけでなく、nucleus数とrequired relation数で複雑度を決める。

処理:

1. source orderを保持する。
2. major nucleiを列挙する。
3. relation graphを作る。
4. whole-input thesisを、入力内relationから作る。
5. required nucleiを全てSentencePlanへ割り当てる。
6. 一つのtopic / emotion / action labelに圧縮しない。
7. required coverageを満たせない短さなら、本文を短くするのではなく、planを再編する。

長文で出力が短いこと自体を一律不合格にはしない。ただし、required nucleiやrelationが落ちた短文化は不合格にする。

### 10.3 self denial / safe-state

普通の自己否定、自己評価の厳しさ、emergencyを分けるSafety Triageは維持する。

通常のself-denial safe-stateでは、同じGroundedObservationPlanへ次を追加する。

- self-evaluation claimをidentity factとして扱わない。
- 入力内に本人の反証・違和感・継続拒否・望みがあればrequired nucleusにする。
- fact boundaryを必須にする。
- limited oppositionは、入力内Evidenceに基づく場合のみ許可する。
- human followを必須にする。
- 2種類の固定bodyへ置換しない。

Emergencyは既存安全経路を優先し、通常観測の修正で上書きしない。

### 10.4 uncertainty

- 不確実表現を事実へ変換しない。
- 「わからない」「気がする」をmodalityとして保持する。
- 不確実さの中で、何を確かめようとしているかが明示されていれば、その意図を観測する。
- 成功・失敗を保証しない。

### 10.5 positive / change

- positivity labelだけで回復・成長を断定しない。
- before / now、action / change、user evaluationを分ける。
- ユーザー自身が「良い変化」「進歩」と書いた場合、その評価はEvidenceとして扱える。ただし恒常的な人格変化へ広げない。

### 10.6 anger / boundary / relationship

- 相手の意図・善悪を断定しない。
- user reaction、boundary wish、event、remaining wishを分ける。
- event nounでfamily専用文を選ばない。

---

## 11. Surface Realizer設計

### 11.1 content source

Surface Realizerは、次だけを受け取る。

- GroundedObservationPlan
- GroundedSentencePlan
- safe shaped phrase anchors
- functional grammar atoms
- tone / distance / hedge policy

raw input全体、fixture ID、case ID、event hint mode、完成文bankを直接参照しない。

### 11.2 SentencePlanの抽象形

完成文ではなく、意味slotを持つ。

```text
Sentence 1:
  role = primary_observation
  content = nucleus:n1 + relation:r1 + nucleus:n2
  hedge = bounded_single_input

Sentence 2:
  role = human_follow
  content = follow_target:n4 + evidence:n4.source
  tone = receiving_without_praise
```

実装の構文rule例:

- nucleus単体をstate phraseへ変換する。
- relationのfrom / toを接続詞でつなぐ。
- polarity / modalityを助動詞へ反映する。
- source phraseを必要な範囲だけ言い換える。
- 同じsource phraseの復唱だけにならないよう、relationまたは観測上の整理を一つ加える。

### 11.3 unknown word

未知の語・固有名詞は、次のどちらかにする。

- source phraseとして中立に保持する。
- 意味を断定できない場合はSurfaceから省略する。

一般辞書やevent modeで勝手に意味を付けない。

### 11.4 section shape

> 2026-07-12 訂正  
> ここに以前記載されていた「常に二段を強制しない」「short stateはplain可」という判断は、Mash様の指示・承認によるものではなく、華恋が独断で追加した誤りであるため撤回する。

通常のEmlis観測は、入力長・semantic complexity・material qualityにかかわらず、同一の`input_feedback.comment_text`内で次の二段を常時必須とする。

1. `見えたこと：`
   - 入力根拠から言える事実、状態、変化、対比、因果・順序などを、単なる復唱ではなく観測として整理する。
2. `Emlisから：`
   - 同じ入力根拠を見たEmlisの受け取り、感想、印象を、人間的な温度を持って返す。

適用範囲:

- short state: 短いtwo-stage
- normal: two-stage
- long arc: 二段を維持し、必要な複数段落は各sectionの内部に置く
- self-denial safe state answer: `見えたこと：`内でfact boundaryを保ち、`Emlisから：`を別sectionとして必ず持つ
- separate Safety owner / emergency: 通常観測の二段生成とは別のSafety perimeterを維持する

section labelは**必要条件だが十分条件ではない**。  
ラベルの存在・順序・両sectionの非空をGateでfail-closed確認し、それとは別に、入力復唱だけになっていないこと、観測上の整理があること、Emlisからが観測文の言い換えではなく別の受け取り責任を持つことを品質条件として確認する。

### 11.5 static content inventory

実装時、production Surface関連ファイルを静的走査し、次を分類する。

1. 機能atomとして許可
2. UI labelとして許可
3. Emergency固定文として別管理
4. substantive completed sentenceとして撤回・汎用化対象
5. fixture / event-specific cueとして撤回対象

「日本語literalがある」だけで全削除しない。意味を供給しているかで判定する。

---

## 12. Recovery / Gate failure設計

### 12.1 Recoveryは同じplanを縮退する

Gate failure時に別の本文生成系へ飛ばない。

順序:

1. optional nucleusを外す。
2. should nucleusのうち重複を統合する。
3. relation表現を単純化する。
4. claim certaintyを弱める。
5. human followを一つのEvidence-bound targetへ絞る。
6. 各section内部を圧縮する。ただし`見えたこと：`と`Emlisから：`の二段契約は削除しない。
7. required nucleus + required boundaryだけのminimal grounded surfaceへする。

禁止:

- label assemblyへ切り替える。
- mode完成文へ切り替える。
- fixture cueで別文を選ぶ。
- synthetic Evidence IDを作る。
- 観測を捨てて質問へ置き換える。

### 12.2 required内容はRecoveryでも落とさない

次は縮退対象外。

- primary state
- required relation
- self-denial fact boundary
- emergency safety boundary
- text-present inputにおける主要thought nucleus

これらを表現できない場合は、`passed`へ偽装せず、internal unavailable reasonを残す。最後の通常復旧は、highest-priority Evidence-bound nucleusを使うminimal surfaceとする。

### 12.3 existing recovery moduleの扱い

- `emlis_ai_complete_initial_surface_recomposition.py`
  - label assembly、fixture pattern、synthetic evidence IDを撤回する。
  - 同じGroundedObservationPlanを再Surface化する役割へ変えるか、統合後に退役する。
- `emlis_ai_limited_grounding_reception_surface.py`
  - fixed reception文を廃止し、limited policyの決定だけへ縮小する。
- `emlis_ai_low_information_observation_composer.py`
  - unknown slot質問generatorを主役から外し、short-state / truly-limited plan builderへ置き換える。
- `emlis_ai_self_denial_safe_state_answer.py`
  - fixed body generatorを廃止し、Safety overlay + required boundary contractへ変える。

物理削除・rename・統合は、実装時にimport参照とtestを確認して決める。

---

## 13. Gateとmetadata

### 13.1 既存Gateに追加する内部Gate

#### Plan validity gate

- nucleus IDの重複なし
- relationのfrom / toが実在nucleusへ解決
- required nucleusが存在
- Safety policy整合

#### Evidence resolution gate

- 全SentenceBindingのEvidence IDがEvidence Ledgerへ解決
- synthetic IDなし
- source field整合

#### Required coverage gate

- required nucleus 100% coverage
- required relation 100% coverage
- fact boundary必須時にcoverageあり
- human follow必須時にcoverageあり

#### Text semantic retention gate

- text-presentなのにcategory / emotion / action labelだけで本文を作っていない
- long inputのmajor nucleiが落ちていない
- negation / modality / change directionを反転していない

#### Anti-template gate

- example cue route不使用
- substantive completed sentence bank不使用
- semantically異なる複数入力へ同一内容文を返していない
- modeが本文内容を供給していない

#### Question dominance gate

- P7 base responseで質問なし
- 観測が質問に置き換わっていない

#### Depth adequacy gate

- output depthがrequired nucleus / relation数に足りる
- 長文を一つのtopic labelへ圧縮していない
- low-infoへ不要な深読みをしていない

#### Two-stage visible contract gate

- separate Safety ownerを除く通常のEmlis観測は、short-stateを含めて`surface_shape=two_stage`である。
- 同一`comment_text`内に`見えたこと：`と`Emlisから：`がそれぞれ一度だけ存在する。
- `見えたこと：`が先、`Emlisから：`が後であり、両sectionが非空である。
- SentencePlan上でも観測lineと`human_follow` lineが分離され、内部atomや観測末尾のsuffixを第二段の代用にしない。
- Recovery後も二段を残し、Gate接続またはsectionが欠けた場合はfail-closedで`passed`にしない。

#### Mechanical restatement gate

- `「○○」が記されています`、`同じ記録にあります`等、sourceの存在を読み上げるだけのledger narrationを通常観測本文として許可しない。
- `見えたこと：`は、状態、変化、対比、順序、本人が示した因果等のうち、入力根拠から成立する整理を少なくとも一つ持つ。
- `Emlisから：`は、観測sectionの言い換えではなく、同じEvidenceに結びついた受け取り・感想・印象の責任を持つ。
- ラベルを付けただけでは本Gateを通過させない。

#### Runtime final visible-contract guard

- `emlis_ai_reply_service.py`は、semantic Gate後に、二段Gate、Mechanical Restatement Gate、両section存在を独立に再確認する。
- いずれかが未接続、未評価、失敗の場合、`comment_text`をpublicへ返さず`rejected`とする。
- Gate metaがgreenでも、runtime guardが本文形状を確認できなければ表示可にしない。

### 13.2 deliveryとproduct qualityの分離

public contractは維持する。

内部metadataでは、最低限次を分ける。

```text
public_observation_status: passed / rejected
public_comment_present: true / false
semantic_quality_gate: passed / failed / not_evaluated
product_readfeel_status: not_evaluated / human_pass / human_fail
```

`public_observation_status=passed` をProduct Read Feel合格とは呼ばない。

### 13.3 body-free metadata案

- `semantic_plan_schema_version`
- `generation_path`
- `material_quality`
- `nucleus_count`
- `required_nucleus_count`
- `covered_required_nucleus_count`
- `relation_count`
- `required_relation_count`
- `covered_required_relation_count`
- `human_follow_required`
- `human_follow_covered`
- `fact_boundary_required`
- `fact_boundary_covered`
- `recovery_steps`
- `fixed_semantic_surface_used`
- `example_cue_route_used`
- `label_only_assembly_used`
- `synthetic_evidence_id_used`
- `semantic_quality_gate`
- `two_stage_contract_gate`
- `mechanical_restatement_gate`
- `two_stage_observation_section_present`
- `two_stage_reception_section_present`
- `runtime_visible_contract_guard`
- `product_readfeel_status`

raw input、raw text、comment body、safe phrase本文はmetadataへ入れない。

### 13.4 metadata truth

- 完成文bankを使った場合に `fixed=false` と書かない。
- 実在しないEvidence IDをbindingへ載せない。
- rule-based生成を `ai_generated` とだけ表現して誤解させない。
- `generation_method` は実際のpathを示す。
- Product QA未実施なら `not_evaluated` とする。
- body-freeな軸表だけを、可視本文を読んだ証拠として扱わない。
- local review receiptは、実際に読んだ本文のSHA-256、文字数、行数へ結びつけ、本文変更後は自動的に無効とする。
- 実機結果がlocal判定と矛盾した場合、旧review・Gate decision・device packet・後続lane許可を同じ時点で撤回する。

### 13.5 可視契約の変更承認境界

可視本文のsection、順序、適用範囲、責務は、華恋が設計上の都合で変更してよい内部実装詳細ではない。

次を固定する。

1. Cocolon前提資料とMash様が明示した可視契約を正本とする。
2. 華恋が作成した後発設計、実装メモ、仮説は、日付が新しいだけでは正本を上書きしない。
3. `見えたこと：` / `Emlisから：`の有無・順序・適用範囲・役割を変える場合、Mash様の明示的な承認を必要とする。
4. 資料間に実質的な競合を見つけた場合、華恋は勝手に片方を採用せず、資料名・該当記述・影響範囲を分けて停止判断を出す。
5. test green、internal roleの存在、metadata passを、仕様変更の承認とみなさない。
6. `正本根拠 -> Plan契約 -> SentencePlan責務 -> Surface形状 -> Gate -> runtime final guard -> 構造test -> 本文を読んだlocal review -> 実機証拠`の追跡が全て接続した場合だけ次laneへ進む。

本境界に反して華恋が独断で追加した`short state: plain可`は撤回済みであり、将来の互換選択肢として残さない。

---

## 14. P5 / P6との接続

### 14.1 base current-inputを先に合格させる

P5 User Label ConnectionとP6 Structure Insightは、弱いcurrent-input responseを救済するために使わない。

順序:

1. current-input GroundedObservationPlanを作る。
2. base Surfaceを生成する。
3. base semantic quality gateを通す。
4. capabilityとownership条件が合う場合だけP5/P6 materialを追加する。
5. overlay後に再度coverage / grounding / safetyを確認する。

### 14.2 historyで現在入力を上書きしない

- current-input required nucleusはoverlay後も残す。
- historyは補助線であり、原因断定・人格断定・trend断定へ使わない。
- low-info current inputをhistoryだけで深く読まない。

### 14.3 P8問いシステム

本設計では実装しない。

P7 current responseを弱いままにして質問で補うことは禁止する。P8では、別設計に基づき、base observationを返した後に必要な一点だけを問う。

---

## 15. 実ファイル単位の変更方針

| 実ファイル | 設計上の扱い |
|---|---|
| `emlis_ai_current_input_bundle.py` | 維持。field境界・source identityを保つ。 |
| `emlis_ai_evidence_ledger_service.py` | 維持・拡張。既存のrequest内 `sN` ID、source field、offsetを正本にし、新しいEvidence ID体系は作らない。 |
| `emlis_ai_types.py` | 既存typesを利用。Grounded plan関連dataclassの配置候補。物理分割は実装時判断。 |
| `emlis_ai_complete_material_service.py` | `material_text` / source anchor / polarity / must-keepを保持する既存資産として維持。canonical planの唯一の正本にはしない。 |
| `emlis_ai_complete_composer_types.py` | `CompleteSentencePlanLine`へnucleus / relation ID参照を追加する候補。raw bodyをmetaへ複製しない。 |
| `emlis_ai_input_material_bundle.py` | material quality判定を維持。fixture近似semantic patternによるID生成を撤回し、short-state sufficientを追加する。 |
| `emlis_ai_safety_triage.py` | emergency / support-required分離を維持。non-emergency self-denialのfixture完全句条件を広い構造判定へ置換する。 |
| `emlis_ai_input_meaning_block_service.py` | block / coverage概念を維持。example-heavy `_ROLE_DEFINITIONS` を構造operator中心へ置換。 |
| `emlis_ai_observation_structure_material_service.py` | nuclei / relation candidateの主要入口へ接続。ID/flagだけでなく命題を渡す。 |
| `emlis_ai_perspective_observers.py` | evidence-bound claim生成を維持。claimをcanonical nucleusへadapterする。 |
| `emlis_ai_observation_integrator_service.py` | relation統合を維持。relation両端の意味を落とさない。 |
| `emlis_ai_complete_focus_selector.py` | opaque material IDではなくnucleus / relation / retentionを選ぶ。 |
| `emlis_ai_complete_relation_graph_service.py` | from/to nucleusを持つ明示relation graphへ変更。 |
| `emlis_ai_complete_sentence_planner.py` | sentenceごとのnucleus / relation / evidence bindingを作る。 |
| `emlis_ai_complete_surface_realizer.py` | substantive completed sentence bankを撤回。functional grammar atom + grounded contentのみ。 |
| `emlis_ai_human_follow_selector.py` | input Evidenceに基づくfollow target選択へ固定。 |
| `emlis_ai_state_answer_ratio_policy.py` | input lengthだけでなくsemantic complexity / required coverageを使う。 |
| `emlis_ai_low_information_observation_composer.py` | short-state sufficientとtruly-limitedを分離。質問主導を撤回。 |
| `emlis_ai_limited_grounding_reception_surface.py` | fixed Surfaceを撤回し、limited scope policyへ縮小または統合。 |
| `emlis_ai_limited_composer_client.py` | phrase shapingをinventoryし、source-preserving整形だけを残す。具体語cueが内容を供給する処理は撤回する。 |
| `emlis_ai_complete_initial_surface_recomposition.py` | fixture pattern、label assembly、synthetic Evidence IDを撤回。同plan再Surface化へ変更または退役。 |
| `emlis_ai_self_denial_safe_state_answer.py` | fixed 2本文を撤回。Safety overlay / fact-boundary contractへ変更。 |
| `emlis_ai_reply_service.py` | orchestrationを一つのcanonical plan経路へ接続。新しいwrapper chainを増やさない。 |
| `emlis_observation_dictionary.v1.json` | substantive完成文を持たない。functional phrase / guardだけに限定。 |
| `emlis_observation_structure_dictionary.v1.json` | relation・allowed/forbidden inferenceの正本候補。example語彙条件を禁止。 |
| `emlis_reception_assistance_dictionary.v1.json` | event-specific hintとmode本文供給を撤回。broad reaction operatorとpolicyだけへ整理。 |
| `emlis_ai_response_contract_qa_matrix.py` | QA corpusはtest / diagnostic ownerへ隔離し、production reply routeからruntime条件として参照しない。 |
| `test_emlis_ai_phase20_10_real_device_recheck.py` | display回帰として残すが、商品品質testに使わない。exact content assertを構造assertへ分離。 |
| RN `InputFeedbackReplyModal.js` / `inputFeedbackModel.js` | 変更しない。 |

---

## 16. 実装順

実装単位を増殖させない。次の8単位で、各単位に商品中核へ戻る出口を持たせる。

### I0. 不具合証拠固定とruntime content inventory

作業:

- A〜Dの入力、現行本文、log、到達pathを回帰証拠として固定する。
- production Surface関連fileの完成文、event cue、label assembly、synthetic Evidence、metadata不一致を一覧化する。
- A〜Dの語句をruntime条件へ追加しないことをtestで固定する。

変更範囲:

- test / inventory only
- production挙動は変えない

終了条件:

- 撤回対象がファイル・function・参照元単位で一覧化されている。
- A〜Dが「expected exact text」ではなく「失ってはいけない構造」で記述されている。

### I1. Canonical GroundedObservationPlan

作業:

- 既存Evidence / Claim / Relation / MeaningBlockをcanonical planへ変換するadapterを作る。
- Semantic Nucleus、Semantic Relation、Unknown Boundary、Coverage Requirementを内部型として定義する。
- 全Evidence IDのresolve検査を作る。

変更範囲:

- internal types / adapter / unit tests
- Surfaceはまだ切り替えない

終了条件:

- A〜Dを含む代表入力で、本文生成前にnucleusとrelationを確認できる。
- synthetic IDが0。
- B相当の長文で、主要shift・action・change relationが別々に残る。

### I2. 汎用意味抽出とretention

作業:

- clause分割、negation、modality、time、contrast、shift、cause/result、wish/constraintを抽出する。
- example-heavy role keywordを、構造operator + source anchor中心へ置換する。
- required / should / optionalを決める。
- short-state sufficientをmaterial qualityへ反映する。

終了条件:

- event nounを入れ替えても、同じ関係構造なら同じplan familyになる。
- 文意のnegationを変えた場合、planのpolarityが変わる。
- category / emotionを変えても本文nucleusが消えない。
- long inputのrequired nucleiがcoverage planへ全て入る。

### I3. Grounded SentencePlan / Surface Realizer

作業:

- sentenceごとのnucleus / relation / Evidence bindingを作る。
- Surface Realizerをfunctional atom中心へ変更する。
- mode-specific completed sentence functionを撤回・汎用化する。
- human followをEvidence-bound targetから生成する。

終了条件:

- substantive completed sentence bankを通らない。
- 生成文ごとにEvidence bindingがある。
- semantically異なる入力が同じ完成内容へ収束しない。
- exact fixture語彙がなくても自然文を作れる。

### I4. low-info / limited / self-denial / recovery統合

作業:

- low-informationをshort-state sufficientとtruly-limitedへ分ける。
- limited groundingを同planのclaim制限として扱う。
- self-denialをSafety overlay化する。
- Recoveryをplan-preserving shrinkへ統一する。
- label assembly、fixed 2 body、fixture semantic patternsを撤回する。

終了条件:

- A相当でevent質問へ逃げない。
- D相当でfact boundary + input-grounded limited opposition + human followを持つ。
- Recovery前後でrequired nucleusが失われない。
- Recovery pathにもsynthetic Evidence IDがない。

### I5. reply service接続・Gate・metadata truth

作業:

- `emlis_ai_reply_service.py` をcanonical planへ接続する。
- 既存Gateにplan validity / coverage / evidence resolve / anti-template / depth adequacyを追加する。
- delivery statusとproduct readfeel statusを分離する。
- metadataを実際のgeneration pathと一致させる。

禁止:

- 新しいhandoff / retry / decision helper chainを増殖させる。
- 新feature flagで古い固定文pathを長期併存させる。

終了条件:

- public contractは無変更。
- `passed`でもproduct QA未実施なら `not_evaluated`。
- fixed pathを使っていないことが静的・動的に確認できる。
- body-free境界が維持される。

### I6. 自動試験・metamorphic試験

作業:

- A〜Dを既知回帰として実行する。
- fixtureと語彙が重ならないblind 12件を、4つの問題familyに3件ずつ用意する。
- その後、P4主要family matrixへ広げる。
- exact textではなく構造を検査する。

終了条件:

- known 4に旧欠陥がない。
- unseen 12でfatal欠陥がない。
- paraphrase / noun replacement / clause reorder / negation changeでplanが期待どおり変化・保持する。
- static anti-template scanがgreen。

### I7. local Product Read Feel → 実機 → P5 formal 24

順序:

1. localでknown 4 + unseen 12の**可視本文そのもの**を華恋側で全件読む。
2. 各reviewを、読んだ本文のSHA-256・文字数・行数へ結びつけ、P3 / P4のread-feel axesでfatalを除く。
3. `見えたこと：` / `Emlisから：`、機械的復唱不在、自然さ、whole-input balanceを本文上で確認する。body-free軸表だけでは完了にしない。
4. known 4 + unseen 4を実機で確認し、実機本文hashとlocal本文hash、二段Gate、Mechanical Restatement Gate、runtime final guardを照合する。
5. current-input baseline合格後にP5 formal 24-case owned-history Blind QAへ進む。
6. P6 limited human readfeelを行う。
7. P7完了条件でP8可否を判断する。

Mashへ、既知欠陥が残った本文を追加確認として渡さない。実機で一件でも矛盾した場合、local passと後続packetを撤回し、current-input Surface repairへ戻す。

### 16.1 正当性再確認結果（2026-07-10 local snapshot）

受領した前提資料、作業姿勢、ロードマップ、EmlisAI実装済み資料、`mashos-api` / RN実ファイル、A〜D入力、画面表示、backend logを再照合した。

結論は次のとおり。

```text
設計中核:
  妥当。

維持する中心判断:
  既存Evidence / Claim / Relation / MeaningBlockを捨てず、
  入力固有の意味を一つのGroundedObservationPlanへ束ね、
  SentencePlan / Surface / Recovery / Gate / metadataまで同じ正本を使う。

そのまま実装開始してはいけない点:
  実装順に、Evidence ID正本固定、意味消失境界の先行修復、
  Safety分離、runtime到達性inventory、単一cutoverを追加する。
```

設計の必要性は、思想資料だけでなく現行実装からも確認できる。

- Evidence Ledgerは既にsource field、source offset、request内実在IDを保持している。
- `CompleteMaterialUnit` は `material_text` を持ち、`as_focus_seed()` でも渡している。
- しかし `CompleteFocusItem` 生成時に `material_text` と意味命題が保持されず、以後のRelation Graph / SentencePlanは主にID、role、relation typeへ縮退する。
- Surface / Recoveryには、semantic ID別完成文、fixture近似語句、label assembly、質問Surface、固定self-denial本文がある。
- `emlis_ai_input_material_bundle.py` にもC相当語句を含む `_SEMANTIC_MATERIAL_PATTERNS` があり、後段Surfaceより前にsemantic material IDを作っている。
- `emlis_ai_safety_triage.py` にはD相当の完全一致に近い句がnon-emergency self-denial判定へ含まれる。Safety境界は維持するが、fixture由来の句そのものを判定正本にしてはならない。
- RNは`passed + comment_text`をそのまま表示しており、画面短縮が原因ではない。

したがって、本設計の方向は維持する。ただし、以下の5点を実装拘束として追加する。

1. **Evidence IDを作り直さない。** 現行 `s1`, `s2`, ... とsource offsetを正本にし、canonical planはresolver経由で参照する。
2. **Surfaceより先に意味伝播を直す。** 最初に確認できる内容消失点である `CompleteMaterialUnit -> CompleteFocusItem` 境界から、nucleus / relation / semantic frame参照をSentencePlanまで通す。
3. **Safetyをgeneric Surfaceへ取り込まない。** `safety_support_required` / `safety_blocked_emergency` は既存の分離経路を維持し、通常観測Surfaceが上書きしない。non-emergency self-denialだけをGroundedObservationPlan overlay対象にする。
4. **旧経路と新経路を長期併存させない。** publicへは一度だけ切り替え、同じ実装単位で旧substantive pathを参照不能にする。pre-cutover比較はtest / local non-publicだけで行う。
5. **`question_policy.allowed=false` はP7 current-input base responseの境界である。** 将来のP8問いシステム全体を永久禁止するschemaではない。P7では観測を質問へ置換せず、P8は別設計・別承認で扱う。

### 16.2 §15へ追加する実ファイル差分

| 実ファイル | 再確認で追加した扱い |
|---|---|
| `emlis_ai_complete_material_service.py` | `material_text`、source anchor、polarity、must-keepを持つ既存資産として維持。canonical planの唯一の正本にはせず、Evidence / Graph / MeaningBlockと併せてadapter入力にする。 |
| `emlis_ai_complete_composer_types.py` | `CompleteSentencePlanLine`へnucleus / semantic relation参照を通す変更候補。raw textをbody-free metaへ複製せず、ID参照で保持する。 |
| `emlis_ai_input_material_bundle.py` | material qualityとvisible / unknown slotの境界は維持。fixture近似 `_SEMANTIC_MATERIAL_PATTERNS` によるsemantic ID生成と、実態に反するcase/cue未使用flagを撤回・是正する。 |
| `emlis_ai_safety_triage.py` | emergency / support-required / non-emergency self-denialの分離は維持。D相当完全句ではなく、self-reference、self-directed negative evaluation、continuation refusal等の広い構造で判定し、Safety回帰matrixを先に固定する。 |
| `emlis_ai_limited_composer_client.py` | phrase shapingを全件inventoryし、source phraseの安全な整形と、具体語cueから内容を供給する処理を分離する。後者は撤回対象。 |
| `emlis_ai_response_contract_qa_matrix.py` | A〜D等のcase本文を持つ場合はQA corpusとして隔離し、production reply routeのruntime判断から到達不能であることを静的に検査する。 |

### 16.3 既存I0〜I7へ差分追加する拘束実装順

既存I0〜I7は上位単位として維持する。実装時は、以下のsubstep順を入れ替えずに進める。

| 差分Step | 既存Stepへの位置 | 作業 | 根拠 | 必要性 | 終了条件 |
|---|---|---|---|---|---|
| `D-I0-1` | I0先頭 | current snapshot fingerprint、対象import、caller / callee、test ownerを固定する。 | recoveryとSurfaceが複数経路から呼ばれる。 | 局所修正で別経路が旧本文へ逃げることを防ぐ。 | 対象moduleごとにruntime reachable / diagnostic-only / test-onlyが分類済み。 |
| `D-I0-2` | I0内 | 日本語literal、event cue、semantic material pattern、label assembly、synthetic ID、metadata自己申告をproduction全域で棚卸しする。 | 5ファイル外のinput material / safety triage / limited composerにも該当処理がある。 | 撤回漏れと、無関係なgrammar atomの過剰削除を同時に防ぐ。 | 全hitに `keep_functional / keep_safety / remove_substantive / isolate_fixture` の判定がある。 |
| `D-I0-3` | I0末尾 | legacy defect characterization testと新structural expectationを分離する。 | 現行testには「何があったか」や固定substringを要求するものがある。 | 旧欠陥をgreen条件として残さず、同時にpublic表示回帰を失わない。 | display contract testとsemantic quality testが別test ownerになっている。 |
| `D-I1-1` | I1先頭 | Evidence Ledger ID / offset / source-field契約を凍結し、resolverを作る。 | 現行Ledgerに実在 `sN` IDとoffsetが既にある。 | 新ID体系の増設とsynthetic binding再発を防ぐ。 | 全plan / sentence binding IDがresolverで実在spanへ解決する。 |
| `D-I1-2` | I1内 | GroundedObservationPlan型配置とimport方向を決める。 | `emlis_ai_types.py` とcomplete composer typesの双方が広く参照される。 | 循環importと新wrapper chainを避ける。 | dependency graphが一方向で、public type / enum変更がない。 |
| `D-I1-3` | I1内 | Safety perimeterを先に固定する。 | emergencyは通常観測へ変換禁止、self-denialは安全overlay対象。 | generic Surfaceがemergencyを上書きする事故を防ぐ。 | safe observation / self-denial / support-required / emergencyの4分岐matrixがgreen。 |
| `D-I1-4` | I1末尾 | canonical plan builderをnon-public shadowとして実装する。 | Surface切替前にnucleus / relation / unknown / retentionを検証できる。 | 意味抽出と文章品質の不具合を分離する。 | known 4と語彙非重複代表入力でbody-free plan reportを確認できる。 |
| `D-I1.5-1` | I1とI2の間 | `CompleteMaterialUnit -> CompleteFocusItem` の意味消失境界を修復する。 | `material_text`はmaterial seedにあるがFocus Itemへ保持されない。 | Surfaceを直しても材料がIDだけなら再び完成文bankへ依存する。 | Focus itemがcanonical nucleus / relation IDを参照し、source anchorへ逆引きできる。 |
| `D-I1.5-2` | I1とI2の間 | Relation Graph Node / EdgeとSentencePlan Lineまで同じ参照を伝播する。 | 現行後半objectはrole / relation type / ID中心で命題両端を持たない。 | relation typeだけでなく「何と何の関係か」を本文へ戻すため。 | 全required sentence lineにnucleus IDs、relation IDs、実在Evidence IDsがある。 |
| `D-I2-1` | I2前半 | clause / negation / modality / time / contrast / shift / explicit cause-result / wish-constraint抽出を実装する。 | fixture名詞ではなく構造operatorで読む必要がある。 | paraphraseと未知名詞へ一般化するため。 | paraphrase / noun replacement / negation metamorphic testがgreen。 |
| `D-I2-2` | I2内 | `input_material_bundle`のfixture近似semantic patternを撤回し、material qualityだけへ責務を狭める。 | 現状はSurface以前にC相当phraseからsemantic IDを立てる。 | cue routeを後段だけ削除しても前段で再生成されるため。 | text-present入力の意味はcanonical nucleiからのみ供給される。 |
| `D-I2-3` | I2内 | `input_meaning_block_service`のexample-heavy role判定をstructure operator + source anchor中心へ置換する。 | keyword hit数でroleを決めている。 | 新しいfixture tableへの置換を防ぐ。 | event noun置換でrelation / retentionが保たれ、topic専用roleへ流れない。 |
| `D-I2-4` | I2末尾 | non-emergency self-denial classifierをfixture句から広い構造へ置換する。 | D相当句がSafety Triage正規表現へ直接含まれる。 | case routeを撤回しつつ、Safety検出を弱めないため。 | emergency false-negativeなし、expression-difficulty false-positiveなし、self-denial paraphrase matrix green。 |
| `D-I3-1` | I3前半 | required coverageを満たすGroundedSentencePlanを先に完成する。 | Surfaceより前に「何を言うか」を閉じる必要がある。 | 文法調整で意味欠落を隠すことを防ぐ。 | required nuclei / relations / boundary / follow targetの割当100%。 |
| `D-I3-2` | I3後半 | generic Surface Realizerをisolated test対象として作る。 | 現行realizerにmode別完成文がある。 | public切替前に、planだけから自然文を作れることを確認する。 | completed semantic bank、example cue、label-only assemblyを使わず全lineがbinding済み。 |
| `D-I3-3` | I3末尾 | Human FollowをEvidence-bound targetから生成する。 | human followは一般共感ではなく入力内の負荷・努力・願い等を受け取る層。 | 観測だけの機械文、または根拠なし励ましを防ぐ。 | follow文がtarget nucleus / Evidenceへ結びつき、人格保証・行動指示がない。 |
| `D-I4-1` | I4前半 | policy接続順を `normal/long + short-state -> truly-limited -> self-denial overlay` に固定する。 | short state、limited、self-denialは同じplanへの制約差分である。 | familyごとの別composerを再増殖させない。 | 各familyが同一plan contractを使い、固有Surface bankを持たない。 |
| `D-I4-2` | I4後半 | plan-preserving Recoveryを新Surfaceの後に実装する。 | 旧Recoveryを先に再利用すると固定文・label assemblyへ戻る。 | failure時もrequired意味を保持するため。 | optional除去→統合→hedge→minimal groundedの各段階でrequired coverage維持。 |
| `D-I4-3` | I4末尾 | support-required / emergency既存経路のnon-regressionを確認する。 | 通常観測修正の対象外で、別安全surface ownerがある。 | current-input repairで安全導線を壊さない。 | emergencyをgeneric observationへ変換する経路が0。 |
| `D-I5-1` | I5前半 | 新Gateとmetadataをnon-public比較で接続する。 | path truthとcoverage truthをcutover前に検証する必要がある。 | `fixed=false`等の自己申告再発を防ぐ。 | runtime factからmetadataが生成され、body-free boundaryがgreen。 |
| `D-I5-2` | I5内 | `emlis_ai_reply_service.py`を一度だけcanonical pathへ切り替える。 | 長期dual pathは禁止。 | path不明化と旧fallback逃げを防ぐ。 | public route / key / status / RN条件不変、base gate後だけP5/P6 overlay。 |
| `D-I5-3` | I5末尾 | 同じ実装単位で旧substantive pathのimport / call / dictionary selectionを撤回する。 | feature flagで残すとRecoveryが旧経路へ戻る。 | single source of truthを実体化する。 | production call graphから旧完成文・cue・synthetic ID pathへ到達不能。 |
| `D-I6-1` | I6前半 | unit→structural→metamorphic→static reachability→reply integrationの順で自動試験する。 | failure層を分離して原因を局所化する。 | test greenの意味を明確にする。 | 各層のgreen範囲と未確認範囲が別記録。 |
| `D-I6-2` | I6後半 | known 4 + unseen 12、Safety paraphrase matrix、cross-input repetitionを実行する。 | known fixtureだけでは一般化を証明できない。 | case最適化と別表現でのSafety欠落を検出する。 | fatal 0、static anti-template green、required coverage欠落0。 |
| `D-I6-3` | I6末尾 | selected regression後にfull backend collect / suiteを実行する。 | current repairが周辺P5/P6/P7 contractを壊す可能性がある。 | local読感だけでintegration破損を見落とさない。 | collect error 0。suite結果と既存赤を分離し、新規赤0。 |
| `D-I7-1` | I7 | local human readfeel→実機→P5 formal 24→P6→P7 Gateの順を維持する。 | Post-DHD設計はP5成立前にP6 / 問いへ進まない。 | 商品読感を問い・履歴overlayで救済しない。 | 前lane不成立なら次laneへ進まずrepairへ戻る。 |

### 16.4 実装commit / rollback単位

実装commitは、次の順でreversibleに分ける。

```text
C0  characterization / inventory / reachability test
C1  Evidence resolver + canonical types
C2  shadow GroundedObservationPlan builder
C3  Focus / Relation / SentencePlan semantic reference propagation
C4  generic extraction / retention / short-state classification / Safety classifier repair
C5  GroundedSentencePlan + coverage gate
C6  generic Surface + Human Follow
C7  family policy overlays + plan-preserving Recovery
C8  Gate / metadata truth connection
C9  reply service single cutover
C10 legacy substantive path retirement + old exact-content test migration
C11 automated QA records + local Product Read Feel material
```

rollbackは、失敗したcommitを一つ前のcanonical段階へ戻す。固定文fallbackを復活させること、旧pathをfeature flagで常設すること、public契約を変えて不具合を隠すことはrollbackに使わない。

### 16.5 実装開始時の停止条件

次のいずれかが起きた場合、そのunitで停止し、先へ進まない。

- Evidence IDを現行Ledgerへ解決できない。
- canonical planを作るためにraw bodyをbody-free metaへ保存する必要が生じる。
- Safety Triageのemergency / support-required分離を弱める必要が生じる。
- Focus / Relation / SentencePlanへsemantic referenceを通さないままSurface修正へ進もうとしている。
- 旧substantive pathを残したままpublic cutoverする必要が生じる。
- API / DB / RN public contract変更が必要になる。
- P8 question system、external AI、新規長期feature flagが必要になる。

この場合は、華恋単体で仕様を拡張せず、確認済み事実、不足責務、変更が必要な外部境界をMashへ提示して判断を求める。

### 16.6 Mash作業境界

本設計書の再確認と実装順差分追加は、受領local snapshotだけで完結するため、現時点でMashへ追加作業は求めない。

実装後にMashへ必要になる作業は、華恋側でknown 4 + unseen 12の自動試験とlocal Product Read Feelを完了し、既知fatalを除去した後の実機確認だけである。旧欠陥が残る本文、未分類のSafety結果、localで再現できるfailureをMashへ確認負担として渡さない。

---

## 17. テスト設計

### 17.1 unit test

- Evidence Span IDが実在する。
- source offset / fieldが正しい。
- clause negation / modality / timeが保持される。
- relationのfrom / toが実在nucleusへ解決する。
- required retentionが入力構造に応じて決まる。
- text-present入力でlabel-only planにならない。
- label-only入力では、label以上のclaimを作らない。

### 17.2 structural test

expected exact textは持たない。ただし、`見えたこと：`と`Emlisから：`は可視契約literalとして固定し、exact presence / order / single occurrenceを検査する。

検査するもの:

- short-stateを含む全通常観測でmandatory two-stage contract
- 観測lineとhuman-follow lineの責務分離
- `記されています`型のmechanical ledger narration不在
- runtime final visible-contract guard
- primary state retained
- required relation retained
- whole-input nuclei retained
- human follow target grounded
- fact boundary present when required
- no unsupported cause / personality / diagnosis
- no question dominance
- no synthetic Evidence
- no fixed semantic path
- no example cue route

### 17.3 metamorphic test

#### Paraphrase

同じ意味を別表現へ変えた場合:

- nucleus / relation構造は同等
- Surface wordingは入力に合わせて変わる

#### Event noun replacement

人、物、仕事、学校、趣味等の名詞を置換した場合:

- event-specific modeへ入らない
- relation構造だけが維持される
- 元の名詞を別fixtureの意味へ寄せない

#### Clause reorder

時間・因果を壊さない範囲で節順を変えた場合:

- source orderは変わる
- 明示relationは保持される

#### Negation / modality

「できた」→「できなかった」、「思う」→「気がする」等:

- polarity / certaintyが変わる
- 元claimを使い回さない

#### Field removal

memo_actionを外した場合:

- action nucleus / relationが消える
- actionを本文へ残さない

#### Label perturbation

emotion / categoryを変更した場合:

- toneは変化し得る
- thought本文の主要nucleusは消えない

### 17.4 anti-template static test

- production runtime decision tableにA〜D原文phraseがない。
- fixture text hash / case IDがproduction importされていない。
- substantive completed sentence functionのallowlist外Japanese literalを検出する。
- dictionary `event_hints`がSurface modeや完成文を選択しない。
- metadata false declarationを検出する。

allowlist対象:

- UI label
- grammar atom
- public contract固定値
- emergency operational copy

allowlistは文字列単位ではなく、用途とfunction単位でレビューする。

### 17.5 repetition / cross-input test

semantically異なる入力群へ対し、次を確認する。

- 同一のsubstantive sentenceが反復していない。
- 同じsection structureでも、中心意味が各入力Evidenceへ接続する。
- generic phraseの割合が高くても、required nucleus / relationが本文に残る。

単純な文字列類似率だけでtemplate判定を終えない。meaning coverageと併用する。

### 17.6 human Product Read Feel

既存ロードマップの軸を使う。local reviewerは可視本文を実際に読み、review receiptをその本文hashへ結びつける。本文を含まないreceipt自体は保存境界として維持できるが、hash未接続のreceiptを「本文を読んだ合格証明」として扱わない。

- 読まれた感
- 入力全体構造
- 感情温度
- 人間的フォローの深さ
- non-template
- 自然さ
- 距離感
- insight seed
- もう一度入力したいか
- 有料品質

新しい恣意的な点数基準は本設計で追加しない。既存P7 scorecardとfatal条件を使う。

---

## 18. A〜Dの扱い

A〜Dはruntime条件にしない。期待完成文も作らない。

各caseについて、失ってはいけない構造だけを回帰条件にする。

### A: short state / fatigue

required:

- 現在の全般的なだるさ
- 何もしたくないという行動意欲低下
- 悲しみ・不安は補助Evidence
- event / causeはunknown
- 観測を先に返す
- 質問で置き換えない

prohibited:

- 「何があったか」を主出力にする
- 詳しい出来事が不明という説明を中心にする
- category「生活」だけの本文にする

### B: long self-understanding / change / action

required:

- 疑問の対象が人から物へ移ったshift
- 対人過思考の減少という本人の認識
- 授業の視点を日常観察とメモへ移したaction
- 人との話し方・即時行動の勇気が戻ってきた変化
- 本人が良い変化・進歩と評価していること
- 各核の関係

prohibited:

- 「学習」「自己理解」「メモ」のlabel assembly
- 一つの成長文へ圧縮
- 恒常的な人格変化の断定

### C: comparison baseline / small change

required:

- 他者比較から昨日の自分へ基準を移したこと
- 大変化より小さな前進を重視する意図
- できたこと、勇気、言語化を小さな変化として保持したいこと
- 焦りとの対比

prohibited:

- 「昨日の自分」等の語句cueで固定本文を選ぶ
- 入力の言い換えだけで終わる

### D: self-denial safe-state

required:

- 自分を傷つけているというself-evaluation
- それを続けても良いことはないという本人自身の認識
- identity factとして確定しないboundary
- 本人の違和感・止めたい方向に根拠を置いたlimited opposition
- 人間的フォロー

prohibited:

- fixed 2本文
- 「自己否定が強い」で終わる
- 根拠のない人格保証

これらは、同じ汎用処理が正しく動いた結果として満たす。case IDを見て満たしてはならない。

---

## 19. 受入条件

### 19.1 hard fatal

一つでも該当すれば実装不合格。

- A〜Dまたは既存fixture語彙のruntime専用分岐がある。
- mode / family別完成文bankが通常観測の意味を供給する。
- text-present入力がcategory / emotion / action label assemblyへ落ちる。
- required nucleusまたはrequired relationが欠落する。
- synthetic Evidence IDがある。
- SentenceBindingがEvidence Ledgerへ解決できない。
- low-infoで観測より質問が主になる。
- self-denialを事実として受ける、または固定generic boundaryだけで終わる。
- metadataが実装実態と異なる。
- public body / raw inputがbody-free metaへ漏れる。
- emergency safetyを通常観測が上書きする。
- API / DB / RN public contractを変更する。
- short-stateを含む通常観測で二段label、順序、両sectionのいずれかが欠ける。
- internal `human_follow` atomまたは観測末尾suffixを、可視`Emlisから：` sectionの代用にする。
- `○○が記されています`等、入力をledgerとして読み上げるだけの本文を通す。
- 華恋が、Mash様の承認なしに可視契約の適用範囲を緩和する。
- 読んだ本文hashへ結びつかないbody-free receiptでhuman Product Read Feel passを確定する。
- 実機結果がlocal passと矛盾した後も、旧pass・packet・後続lane許可を有効扱いする。

### 19.2 current-input repair合格条件

- known 4で旧欠陥が消えている。
- known 4 + unseen 12の全通常観測で、同一`comment_text`内の`見えたこと：`→`Emlisから：`が成立する。
- 機械的復唱・ledger narrationがなく、各sectionが別の責任を持つ。
- unseen 12でfatalがない。
- P4主要familyのblind local reviewで、既存P3/P4基準を満たす候補がある。
- long inputでwhole-input structureが残る。
- short-stateで見えている状態を先に返す。
- self-denialでfact boundaryとgrounded followが成立する。
- static anti-template scanがgreen。
- public display regressionがgreen。
- product readfeelは人間評価で確認済み。

### 19.3 P8へ進む条件ではないもの

次だけではP8へ進まない。

- pytest green
- known 4 green
- modal表示
- `observation_status=passed`
- metadata coverage 100%
- local text生成成功

current-input repair後も、P5 formal 24、P6 limited readfeel、P7全体Gateが別に必要である。

---

## 20. Rollback / fail-closed

### 20.1 rollback方針

- 小さなreversible commit単位で実装する。
- I1 / I2ではSurfaceを切り替えない。
- I3以降も、integration commitと旧path撤回commitを分ける。
- 新path不合格時はintegration commitをrevertする。
- 固定文fallbackへ戻すことをrollback手段にしない。
- DB / RNを触らないため、rollback対象をAPI内部に限定する。

### 20.2 dual pathを長期維持しない

一時的adapterは許可するが、旧完成文pathと新canonical pathをfeature flagで長期間併存させない。

理由:

- metadataと実pathが再び乖離する。
- Gate Recoveryが旧pathへ逃げる。
- testがどちらを保証しているか不明になる。

新pathのlocal / blind / device確認後、旧substantive pathを参照不能にする。物理削除は参照・test確認後に判断する。

### 20.3 fail-closed

- required coverage欠落時にproduct quality passを付けない。
- public表示可否は既存安全境界を維持する。
- minimal grounded responseさえ作れない場合は、本文を捏造しない。
- unavailable reasonはbody-free metaで残す。

---

## 21. 主なリスクと抑止

| リスク | 抑止 |
|---|---|
| 新しい巨大基盤を増やす | 既存Evidence / Claim / Relation / MeaningBlockをcanonical planへadapterし、parallel systemを作らない。 |
| 汎用化の名で別のkeyword tableを作る | event nounではなく文法operator・polarity・modality・source anchorsを使う。 |
| Source復唱だけになる | relation / whole-input structure / bounded observation deltaをSentencePlan必須にする。 |
| 自然さが落ちる | functional grammar atomとsafe phrase shapingを使い、human Blind QAで確認する。 |
| 長文が冗長になる | required coverageを維持しつつ、重複nucleus統合とrelation圧縮を行う。 |
| low-infoで分かったふりをする | short-state sufficientとtruly-limitedを分け、unknown boundaryをclaim上限に使う。 |
| safetyがgeneric固定文へ戻る | Safetyをplan overlayにし、emergencyだけを別運用境界にする。 |
| metadataがまた偽る | path・coverage・fixed/cue使用をruntime factから生成し、自己申告flagだけにしない。 |
| testがfixture最適化する | exact text禁止、metamorphic / unseen / cross-input testを必須化する。 |
| Mashの確認負担が増える | local known 4 + unseen 12を先に全件確認し、本文hashへ結びついたreviewを作り、fatalを除いてから実機8件だけ渡す。 |
| 華恋が後発設計で可視契約を勝手に緩和する | 前提資料とMash様の明示指示を正本とし、可視契約変更は明示承認必須、資料競合時は停止する。 |
| body-free greenを読感合格と誤認する | technical delivery、可視本文のlocal read、実機証拠を別Gateにし、本文hash不一致または実機矛盾で下流を全撤回する。 |

---

## 22. 本設計で明示的に行わないこと

- A〜D向けの答えを作る。
- A〜Dの語句から専用modeへ入る。
- 完成文bankを言い換えて残す。
- P8問いシステムを先行実装する。
- 新endpoint、DB column、public response keyを追加する。
- RN modalを変更してbackend品質を隠す。
- 外部LLM / external AIを新規前提にする。
- P5/P6 historyでcurrent inputの弱さを救済する。
- test greenを商品合格と呼ぶ。
- internal `human_follow` roleがあることを、可視二段構成が成立した証拠にする。
- 後発の華恋作成資料を根拠に、Mash様未承認の可視契約変更を行う。
- body-free review receiptだけで、本文を読んだProduct Read Feel合格とする。
- 実装段階で必要か未確認のJSON / schemaを、設計時点で実ファイル化する。
- 既存helperを包むだけの新helper chainを追加する。

---

## 23. 実装段階へ持ち越す物理判断

次は設計方針では確定しているが、物理ファイル構成は実装開始時に参照関係を確認して決める。

- GroundedObservationPlan型を `emlis_ai_types.py` へ置くか、専用internal contract fileへ分けるか。
- JSON Schemaをtest fixtureとして置くか、Python dataclass validationだけにするか。
- `emlis_ai_complete_initial_surface_recomposition.py` を再利用するか退役するか。
- `emlis_ai_limited_grounding_reception_surface.py` をpolicy moduleへ縮小するか統合するか。
- 完成文撤回後のdictionary file split。
- static anti-template allowlistの配置。
- test file名と分割単位。

ただし、次は持ち越さない。

- substantive completed sentence bankを残さない。
- example cue routeを残さない。
- synthetic Evidence IDを残さない。
- label assemblyをtext-present入力のfallbackにしない。
- Recoveryを同じGroundedObservationPlanから行う。

---

## 24. 実装開始前チェック

実装へ入る前に、次を一度だけ固定する。

- [ ] A〜Dの現行本文・log・入力がfailure evidenceとして保存されている。
- [ ] production Surface / cue / fixed body inventoryがある。
- [ ] 外部契約無変更が確認されている。
- [ ] GroundedObservationPlanの型配置が決まっている。
- [ ] 既存Evidence ID形式とresolve方法が確認されている。
- [ ] I1のadapter範囲が確定している。
- [ ] implementation unitごとの終了条件がtestへ落ちている。
- [ ] short-stateを含むmandatory two-stage contractがPlan / SentencePlan / Surface / Gate / runtime final guardへ落ちている。
- [ ] 可視契約変更がMash様の明示承認なしでは通らないことが固定されている。
- [ ] local reviewが可視本文hashへ結びつき、旧hashのreceiptを再利用できない。
- [ ] 実機矛盾時に旧pass・packet・後続laneを撤回する手順がある。
- [ ] P8質問機能を混ぜないことが固定されている。
- [ ] Mashへ追加実機確認を依頼する前に、local QA完了を必須にしている。

---

## 25. 最終設計判断

現行EmlisAIは、入力を受け取る前半基盤と表示・安全境界を持っている。しかし、入力固有の意味をSurfaceまで保持する正本がなく、終盤で固定文、fixture cue、label assembly、質問、fixed safe-stateへ縮退している。

修正の中心は、文章を長くすることでも、A〜Dに良い文章を手書きすることでもない。

**入力内Evidenceから意味核と関係を作り、required内容を選び、human followとfact boundaryを重ね、その同じ意味計画から自然文を作り、Recoveryでも意味計画を捨てず、coverageを検査すること**である。

これにより、EmlisAIは「既知の文章へ既知の返答を返す仕組み」から、入力ごとに見えている内容・関係・不明領域を組み直すcurrent-input observationへ戻る。

本書は当初設計のみとして作成されたが、2026-07-12の実機不合格とMash様の明示指示を受け、下記の是正実装記録を追補する。

---

## 26. 2026-07-12 mandatory two-stage是正実装

### 26.1 撤回した判断

- `short state: plain可`を撤回した。これはMash様の指示ではなく、華恋の独断だった。
- internal `human_follow` roleや観測末尾suffixで、可視`Emlisから：`を代用できるという判断を撤回した。
- semantic Gate greenとbody-free review receiptを、Product Read Feel合格と扱ったGA7 / GA8判断を撤回した。

### 26.2 実装した拘束

- GroundedObservationPlanで、separate Safety owner以外の全通常観測を`two_stage`かつ`human_follow_required`へ固定した。
- GroundedSentencePlanで、観測lineとhuman-follow lineを別責務として必須化し、integrated followを禁止した。
- Grounded Surfaceで、`見えたこと：`→`Emlisから：`を同一本文へ必ず組み立てる。
- Grounded Gateで、二段契約とmechanical restatementを独立Gateとして検査する。
- reply serviceで、Gate後にもruntime final visible-contract guardを行い、欠落・未評価・失敗時は本文を返さない。
- I7 local reviewを可視本文SHA-256へ結びつけ、本文変更後のreceipt再利用を止める。
- 実機証拠はgeneration pathだけでなく、二段Gate、mechanical Gate、runtime guard、local本文hash一致を必要とする。

### 26.3 2026-07-12時点の停止位置

localではknown 4 + unseen 12について二段契約とmechanical restatement regressionを確認する。
ただし、local technical passをProduct Read Feelまたは実機合格とは呼ばない。修正版が実機へ反映された後、known 4 + unseen 4の可視本文とmetaを再確認するまでは、P5 formal 24、P6、P8へ進まない。

---

## 付録A. 直接照合箇所

以下のline rangeは、本設計時に受領したsnapshot内の実ファイルを基準にする。後続snapshotで行番号が変わった場合は、function名と内容を優先して再照合する。

### A.1 前提資料・ロードマップ

| 資料 | 主な照合範囲 | 本設計で使った判断 |
|---|---:|---|
| `cocolon_thought_material_for_karen.md` | 118-199 | 入力を読む順序、一般論・テンプレへ逃げないこと、入力の箱詰め工程を見ること。 |
| 同 | 649-866 | 状態・願い・止まり・疲労等を「読んだ形」で返すこと、内部問いを外部質問へ直結させないこと、低情報境界。 |
| `emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md` | 88-108 | Phase19 case専用route撤回、fixtureは回帰のみ、Gateを沈黙で終わらせないこと。 |
| 同 | 171-212 | 固定文でなくてもcase route、cue-only surface、mode完成文はテンプレであること。 |
| 同 | 494-513 | runtime例文条件・cue一致Surface・fixture目標化の禁止。 |
| 同 | 556-593 | Gate failureの縮退順とテンプレ新定義。 |
| 同 | 754-857 | response contract、Safety、low-info、Gate Recovery、Surface Realizer再設計。 |
| 同 | 1598-1629 | API / DB / RN不変、external AIを前提にしないこと、停止条件。 |
| 同 | 1654-1704 | test greenと商品価値の分離、最終合格条件。 |
| `emlis_ai_state_answer_human_follow_definition_2026_05_26.md` | 245-256 | 意図→表面状態→未確認領域→一段深い状態→事実境界→human followの層。 |
| 同 | 319-397 | 負荷、努力、存在尊重、自己否定・消耗時にfollowを厚くすること。 |
| 同 | 1192-1252 | exact正解文ではなく構造test、固有語を雑に扱わないこと、完成文template禁止。 |
| roadmap | 663-735 | P3 Product Read Feelの目的・評価軸。 |
| roadmap | 761-855 | P4 family、low information、self denial、long meaning arcの要件。 |
| roadmap | 1041-1154 | P7 Product Quality Gate、P7で問い実装をしないこと、問いで本体不足を補わないこと。 |
| roadmap | 1527-1576 | 毎回の開発loop、代表入力、Blind QA、完了条件未達時に次へ進まないこと。 |
| roadmap | 1838-1845 | 追加境界作業に出口を持ち、商品読感へ戻すこと。 |

### A.2 現行runtime / Surface

| 実ファイル | 主な照合範囲 | 確認事実 |
|---|---:|---|
| `emlis_ai_reply_service.py` | 6393-6456 | normalize → source bundle → Evidence → Structure Material → Observer / Graph → Safety → Material Route。 |
| 同 | 6540-6665 | Composer / Reader / Grounding / Template / Display Gateのmainline。 |
| 同 | 6673以降 | bounded reroute、low-info、Gate Recovery、Surface recompositionへ進む複数復旧経路。 |
| `emlis_ai_types.py` | 143-219 | `InputMeaningBlock`、`MeaningCoveragePlan`、`WholeInputMeaningArc`、`MajorMeaningRetentionPlan`が既に存在。 |
| `emlis_ai_input_meaning_block_service.py` | 45-103 | 多数のkeyword-based role定義。 |
| 同 | 125-167 | clause分割とkeyword hit数によるrole選択。 |
| `emlis_ai_complete_initial_surface_recomposition.py` | 619-625 | fixed / case-specific / exact fixture不使用というmetadata宣言。 |
| 同 | 671-701 | semantic ID別完成文とtopic / feeling / action label assembly。 |
| 同 | 704-727 | fixtureに近いruntime phrase pattern。 |
| 同 | 765-822 | category / emotion / actionからtopic / feeling / action phraseを作る。 |
| 同 | 980-988 | visible slot / relation IDから `p5_*` synthetic Evidence IDを生成。 |
| `emlis_ai_limited_grounding_reception_surface.py` | 103-183 | phrase cueによるsemantic material判定。 |
| 同 | 429-459 | semantic ID別の完成Observation / Reception文。 |
| `emlis_ai_low_information_observation_composer.py` | 375-442 | unknown slotからquestion kind / question Surfaceを作る。 |
| 同 | 544-569 | visible slot labelとunknownからknown-scope完成文を作る。 |
| `emlis_ai_self_denial_safe_state_answer.py` | 64-76 | continuation refusal有無による固定2本文。 |
| 同 | 123-163 | `composer_source=ai_generated`、`fixed_fallback_used=false` 等のmetadata。 |
| `emlis_reception_assistance_dictionary.v1.json` | `reaction_cues`, `event_hints`, `reception_modes`, `follow_shape_families` | 特定event phraseがmode補助材料に入り、mode側に内容意図が定義されている。 |

### A.3 public / RN / test

| 実ファイル | 主な照合範囲 | 確認事実 |
|---|---:|---|
| `InputFeedbackReplyModal.js` | 18-27 | `passed`かつ本文ありでmodal表示。 |
| 同 | 58-67 | ScrollView内へ本文をそのまま表示し、行数切り詰めなし。 |
| `inputFeedbackModel.js` | 120-159 | public statusと`input_feedback.comment_text`を取得。 |
| `test_emlis_ai_phase20_10_real_device_recheck.py` | 4-10 | test対象がpublic behaviorとlog field中心であることを明記。 |
| 同 | 198-211 | Aで`passed`、本文、modal、「何があったか」を要求。 |
| 同 | 241-254 | B/C/Dでstatus、本文、modal、固定substring / 見出しを要求。 |

### A.4 実機4件

- A〜Dの入力原文、画面本文、backend logを同一caseで照合した。
- A〜Dは、現在のbuildを不合格として修正へ戻す根拠に使う。
- A〜Dを、runtime route、phrase cue、expected exact responseには使わない。
- 修正後は、known 4に加えてfixture語彙と重ならないunseen入力で一般化を確認する。
