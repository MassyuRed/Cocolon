# Cocolon EmlisAI Model-Free Natural Language Surface v3 詳細設計・実装順序

作成日: 2026-07-14 JST  
改訂日: 2026-07-14 JST  
改訂理由: 現行アプリ入力contract準拠、100件単位・最低1000件の累積評価、実機確認時点、問いシステム接続境界を正式反映  
文書種別: 詳細設計・実装順序  
対象version: `Natural Language Surface v3`（以下 `NLS v3`）  
設計状態: `design_revised / implementation_not_started`  
正本前提: `Cocolon_前提資料(337).zip`  
現行production owner: `grounded_sentence_surface_canonical_v1`  
停止済み履歴: `NLS v2 = offline_only_stopped`  

---

## 0. この設計書の結論

現行NLS v2は変更しない。停止済みv2のsource、fixture、receipt、既知cohortをNLS v3へ付け替えない。

NLS v3は、v2の意味欠落・汎用文収束・metadata自己申告・証拠不足を、次の構造で修正する。

1. Surfaceより前に、現在入力へEmlisが負う意味責任を `Semantic Obligation` として列挙する。
2. 候補が「実現した」と自己申告するmetadataをHard Gateの根拠にしない。型付きSurface ASTから本文を生成し、Body-only ParserとIndependent Matcherが最終本文から意味を再構成して照合する。
3. 候補差を語尾や同義語の差ではなく、意味順序・文の結合分割・指示対象・Emlisの受け取り位置の差として作る。
4. case別・理由別・hash別の証拠を残し、手入力aggregateやfixture greenだけで完了にしない。
5. 華恋が現行アプリ仕様に適合する新規サンプルを100件単位で作成し、確認・構造修正・累積全件再実行を繰り返す。華恋作成の有効サンプルを最低1000件まで積み上げ、安定条件を満たした後にだけNLS v3の実機確認へ進む。

サンプル本文は華恋が読んでよい。入力とEmlisAIの実応答を照合しなければ、意味欠落、勝手な補完、不自然さ、定型化を評価できないためである。本設計では、評価独立性の証明を目的とした秘密入力、open-once cohort、暗号鍵、外部reviewer、adjudicatorを必須にしない。

新規100件は、既存サンプルの単なる言い換えにしない。既存corpus、過去の失敗、未使用の意味構造・thought/action関係・長さ・崩れ方・感情/category組合せを確認して作る。修正後は新規100件だけでなく、それまでの有効サンプル全件を再実行する。

最低1000件は実機確認へ入るための必要条件であり、完成を保証する数字ではない。1000件到達時点で新しい重大な構造欠陥が出る場合は1100件、1200件と100件単位で継続する。

100件ごとにMash様へ実機確認を求めない。大量確認は華恋側のlocal実行・local Product QAで行い、NLS v3の本格的な実機確認はlocal安定後の代表20件を初期値とする。実機でcontent failureが見つかった場合は、そのcaseを回帰集合へ加え、local累積ループへ戻る。

NLS v3は問いシステム全体を実装する作業ではない。ただし、最終的なEmlisAI完成に問いシステムが必要であることを前提に、`normal_observation`、`pre_question_observation`、`refined_observation`のSurface境界を持つ。問いの必要性判定・問い文・回答保存・RN導線は別ownerであり、NLS v3が勝手に決めない。

本設計はモデル非使用条件を継続するが、無期限の前提にはしない。大量反復を行っても共通構造として解消できず、case専用分岐・固定文・入力語cueだけが解決手段になる場合は、NLS v3を延命せず、モデル非使用条件そのものをMash様と再判断する。

この文書で行うのは設計修正だけである。source、fixture、JSON、Schema、receipt、前提資料、runtimeは変更しない。本文中のJSON / Schemaは実装候補であり、実ファイル化・配置・分割は各実装Stepの入口でactual treeを再確認して決める。

---

## 1. 確認状態

### 1.1 確認済みの正本・実ファイル

| 対象 | 確認結果 |
|---|---|
| `Cocolon_前提資料(337).zip` | ZIP integrity確認済み、1,342,207 bytes、SHA-256 `c2c2f3d4d71127b5ee7e029f3240dfb2b8f33c3e34b1c0b47c28c20ec73d4d5b` |
| `Cocolon(298).zip` | 217 files、SHA-256 `2287550897799bee5ce1ac8a4235f4aa364ed7ef088c1bd3ef7d84fd2d009100`。現行RN実ファイルを確認 |
| `mashos-api(223).zip` | 1,792 files、SHA-256 `f97df95b5f7065854826051636d7d8223db49f7b1fce958697c4ae20f6a42415`。現行backend実ファイルを確認 |
| 改訂元NLS v3設計 | 158,776 bytes、SHA-256 `575b647e828c01d8369b54a1c0cf78eece4010b3c5c1c6d6b1ee78db42b9eb60` |
| 問いシステム長期ロードマップ | SHA-256 `04fb9e4e11af2b1530d03d95d8e959ba644503722f72094a289bde1d4368ce5b` |

確認した主な前提資料:

- `00_karen_read_first.md`
- `01_cocolon_overall_structure.md`
- `02_cocolon_national_system.md`
- `03_cocolon_naming_system.md`
- `05_cocolon_rule_file_index.md`
- `07_latest_snapshot_diff.md`
- `cocolon_thought_material_for_karen.md`
- `emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md`
- `emlis_ai_state_answer_human_follow_definition_2026_05_26.md`
- `work_attitude_rules_for_karen/*`

確認した主な現行入力実ファイル:

- `Cocolon/screens/InputScreen.js`
- `Cocolon/screens/input/InputEmotionSection.js`
- `Cocolon/screens/input/InputCategorySection.js`
- `Cocolon/screens/input/InputMemoSection.js`
- `Cocolon/screens/input/inputOptions.js`
- `Cocolon/screens/input/inputDraftModel.js`
- `mashos-api/ai/services/ai_inference/api_emotion_submit.py`

確認した主なEmlisAI owner:

- `ai/services/ai_inference/emlis_ai_reply_service.py`
- `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py`
- `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py`
- `ai/services/ai_inference/emlis_ai_grounded_human_reception.py`
- 停止済みNLS v2の4 moduleと監査資料

### 1.2 確認済みの現在状態

- production runtime ownerは `grounded_sentence_surface_canonical_v1` である。
- R8 Grounded Human Reception repairはRR0〜RR9実装済み、RR10 local readiness実装済みである。
- R8 RR10 actual deviceは `not_run` であり、RR11 / RR12は未完了である。
- NLS v2は `offline_only_stopped` である。
- v2の最初の確定未達はStep 3、最初の明確なSurface商品品質破綻はStep 5である。
- v2 Step 7の完了・freezeは監査で撤回済みである。
- v2の既知cohortはNLS v3の未知証拠として扱わない。使用可能な既知fixtureは回帰材料に限定する。
- NLS v3 source、fixture、runner、receipt、runtime adapterは未実装である。
- NLS v3は設計改訂中であり、Step 0未開始である。

### 1.3 確認済みの現行アプリ入力contract

通常の有効サンプルは、現行RNから到達可能な入力に限定する。

- `memo`または`memo_action`の少なくとも一方がtrim後non-empty。
- 感情を1件以上選択する。
- 選択可能な感情は `喜び / 悲しみ / 怒り / 不安 / 平穏 / 自己理解`。
- `自己理解`は単独選択のみ。選択時は他感情が消え、自己理解選択中に他感情を追加できない。
- `自己理解`のpayload strengthは現行RNどおり`medium`。
- 自己理解以外の感情は複数選択可能で、strengthは `weak / medium / strong`。
- categoryを1件以上選択する。
- 選択可能なcategoryは `生活 / 仕事 / 趣味 / 人間関係 / 恋愛 / 健康 / 学習 / 価値観 / 人生`。
- categoryは複数選択可能である。

backendへ直接流すlocal runnerではRNで到達不能な組合せも作れてしまうため、sample validatorがこのcontractを独立に強制する。到達不能入力は通常1000件へ数えず、invalid-input防御testへ分ける。

### 1.4 問いシステムについて確認済みのこと

長期ロードマップでは、問いシステムは次の二層として位置付けられている。

```text
EmlisAI core quality gate:
  問いなしで観測できるか
  限定観測で止めるべきか
  問いが必要か
  問いを出すと負担が大きいか

P8 問いUX:
  仮観測
  問い
  問い回答
  refined observation
```

問いシステムは現時点でproduction実装されていない。NLS v3は、問いシステムの必要性を隠すために勝手な補完や質問を行わず、将来の3つの観測stageを受けられるSurface contractだけを先に固定する。

### 1.5 未確認・この設計書だけでは確定できないこと

- Supabaseに残る過去の実ユーザー入力の正確な有効件数、重複、欠損、legacy比率、個人情報・利用条件。
- NLS v3の1件あたり実行時間と、累積1000件再実行に必要な実測時間。
- controlled grammarだけで商品上必要な自然さへ届くか。
- 問いシステムのAPI / DB / RN / plan guard /課金境界の最終仕様。
- actual device代表20件で十分か。20件は最初の実機packetであり、実機でcoverage不足が判明すれば追加する。

### 1.6 推測・因果仮説

v2の失敗は、入力固有の意味責任とEmlis自身の受け取りがContent層から落ち、実質的な談話variationを作れず、Surfaceが汎用骨格へ収束し、Gateが本文ではなく自己申告metadataを信じ、case別証拠のない集計で完了に見せた連鎖だと考えるのが最も整合する。

これは監査事実と整合するが、唯一の原因だとは断定しない。NLS v3では大量の異なる入力を実際に流し、どの層で壊れるかをcase evidenceで確認する。

### 1.7 華恋の設計判断

- 新identityは `NLS v2.1` ではなく `NLS v3` とする。v2の停止境界を曖昧にしないためである。
- v3はv2 moduleをimportしない。既知fixtureは回帰入力としてのみ使う。
- 固定少数fixtureと一回限りの評価ではなく、100件単位の新規入力追加と累積回帰を開発の中心にする。
- 華恋作成の有効サンプル1000件を最低線にする。Supabase実ユーザー入力、既存fixture、invalid-input testは追加集合であり、この1000件を減らす根拠にしない。
- サンプル本文は華恋が読み、入力と応答を照合する。秘密入力の独立性を商品品質の代替証拠にしない。
- 修正回数を一回に制限しない。ただし、各修正は共通構造へ効く理由、変更範囲、全件回帰を必要とし、case専用語句・分岐・完成文を禁止する。
- 最低1000件後、直近2つの新規100件batchで初回実行時に新しい重大構造欠陥が出ないことを、実機確認入口の一条件にする。満たさなければ100件単位で継続する。
- NLS v3 owner切替前には、R8 RR10現行v1代表4件を別のrollback baselineとして実機確認する。
- NLS v3の完成とEmlisAI全体の完成を同一視しない。問いシステム導入・refined observation・最終実機確認まで完了してEmlisAI完成とする。

---

## 2. 目的・対象・非対象

### 2.1 目的

NLS v3の目的は、入力語を別の言い回しで返すことではない。

現在入力の思考、行動、感情選択、カテゴリ選択、その間の関係、分からない境界を保持した上で、次を同時に満たすことである。

1. `見えたこと`は、入力の列挙や引用ではなく、入力内で成立する状態・関係・変化を観測として形にする。
2. `Emlisから`は、短い一般文ではなく、観測した特定の意味へEmlisがどう向き合うかを固有に返す。
3. 二つのsectionは同じ内容の言い換えにならない。
4. 入力にない原因、人格、診断、未来、他者の意図を足さない。
5. 自己否定をユーザーの事実として採用・増幅しない。
6. 低情報入力でも無理に膨らませず、今ある情報の狭さそのものを限定的に観測する。
7. Gate不合格を通常入力の沈黙へ直結させず、意味責任を保持した安全な縮退を試みる。
8. 問いが必要な可能性のある入力でも、足りない情報を勝手に埋めず、問いシステムへ接続できる限定観測を作れる。
9. 多様な入力を100件単位で累積し、実応答を観測・修正・全件回帰することで、固定少数caseだけに適合した実装を避ける。

### 2.2 対象

- `GroundedObservationPlan`以降、public `comment_text`へ至る自然言語Surfaceの新しいoffline candidate branch
- `normal_observation / pre_question_observation / refined_observation`を区別するSurface context
- Semantic Obligationの列挙・選択
- 談話構造候補
- 型付きSurface AST
- canonical renderer
- Body-only Semantic Atom Parser / Independent Semantic Matcher
- Hard Gate、deterministic selector、限定recovery
- 現行RN入力contractに準拠するsample validator
- 100件単位・最低1000件の生成、実行、local Product QA、累積回帰、change ledger
- 既知回帰、実ユーザー回帰、invalid-input防御test
- local安定後のshadow、tester-only actual device、owner switch、rollback
- 問いシステム実装へ渡すSurface contractと評価材料

### 2.3 非対象

- 観測owner、Evidence抽出、Relation抽出、Unknown Boundary、Safety Triageの全面再設計
- public API、DB schema、DB physical name、write path、RN表示条件の変更
- 問い必要性判定、問い文生成、問い回答保存、問いUI、課金別問い回数の実装
- account、subscription、entitlement、access policy、削除導線の変更
- 外部LLM、外部API、runtime random、自由生成モデルの導入
- history-line / P5履歴の新規接続
- case専用mode、case専用cue、case専用完成文、期待本文一致fixture
- v2 module、v2 fixture、v2 receipt、v2停止履歴の修正
- R8 RR10 actual-device実施そのもの
- 100件ごとのMash様実機確認
- 秘密入力、open-once評価、鍵管理、外部reviewerによる第三者認証
- 本設計時点でのJSON / Schema実ファイル作成

---

## 3. 変更してはいけないcontract

### 3.1 public / RN / DB

| contract | 固定内容 |
|---|---|
| route | `POST /emotion/submit` |
| public本文 | `input_feedback.comment_text` |
| public状態 | `input_feedback.emlis_ai.observation_status` |
| RN表示条件 | `observation_status == "passed"` かつ `comment_text` non-empty |
| section順 | `見えたこと：` → 空行 → `Emlisから：` |
| DB | physical name、write path、保存責任を変更しない |
| account / subscription | 判定、access、削除、entitlementを変更しない |
| public meta | candidate本文、raw input、内部plan、Gate理由本文を追加しない |

`passed + comment_text`は表示contractであって、EmlisAIの目的ではない。表示できたことだけを成功にしない。

Hard Gate後に本文をcompose、trim、追記、greeting挿入してはならない。section label、greeting、addressが表示本文に入る場合は全てSurface AST / Canonical Rendererの対象に含め、最終public mapperは検証済みUTF-8 bytesを`input_feedback.comment_text`へbyte-preservingに割り当てるだけとする。request-localで `verified_final_bytes == public_comment_text_bytes`を再照合する。

### 3.2 Emlisの表示名・呼称

- 既存の `Emlisです。` 基本自己紹介とaccount name / 許可済み敬称の扱いを変更しない。
- v3 plan / receiptへusernameや敬称本文を永続化しない。
- v3がユーザー名を発明、別人へretarget、固定呼称化しない。
- 既存greeting / address ownerが与える許可済みtokenをSurface ASTの入力として、既存contractの範囲でだけ消費する。Gate後には追加しない。

### 3.3 Safety

- 緊急安全応答ownerは別ownerのまま維持する。
- safety隣接入力を一律に非表示へ潰さない。
- 自己否定の採用・増幅、診断、人格断定、原因創作、未来保証、関係方向反転、極性反転、参照対象混同を禁止する。
- unknownはunknownのまま保持する。
- Gateは沈黙許可装置ではない。通常入力で候補が落ちた場合は、同じ意味責任を保持する限定recoveryへ進む。

### 3.4 決定性・privacy

- runtime randomnessを使わない。
- candidate ID、obligation ID、plan IDはcanonical contentから導出し、実行順やobject addressへ依存しない。
- candidate順序を入れ替えても選択結果が変わらない。
- candidate本文、raw input、visible body、実ユーザー入力本文、問い回答本文をpublic meta、body-free receipt、score reason、runtime lineageへ残さない。
- 本文が必要なlocal review packetと、body-free summary receiptを分離する。実ユーザー入力のraw packetはrepoへ置かず、private local workspaceでだけ扱う。

---

## 4. version identityとowner境界

### 4.1 identity

推奨ID:

```text
product_name: Cocolon EmlisAI
feature_name: Natural Language Surface
candidate_version: nls_v3
generation_path: grounded_natural_language_surface_v3
runtime_state: disabled | offline | shadow | tester_only_preview | owner | stopped
observation_stage: normal_observation | pre_question_observation | refined_observation
```

`v3`は意味contract、Surface構造、sample policy、評価protocolを含むversion identityである。sourceだけ同じでも、次のいずれかが変われば別release candidateとして扱う。

- upstream Observation / Evidence / Relation / Unknown / Safetyのtransitive dependency
- observation stage context adapter
- obligation / content / discourse / AST / renderer / verifier / Gate / selector
- lexical catalog、config、depth policy、recovery policy
- sample validator、batch runner、review rubric、failure taxonomy
- dormant runtime adapter、v1 fallback、owner state machine
- source dependency closure、test closure、performance protocol

100件batchを追加すること自体はversion変更ではない。text-affecting sourceを変更した場合は同じNLS v3内の新release candidateとし、累積全件を新run IDで再実行する。

### 4.2 owner map

| 層 | v3での扱い |
|---|---|
| 現在入力bundle | 既存ownerから受領。thought、action、emotion、categoryの欠落も明示的absenceとして保持 |
| 現行RN入力contract | sample validatorのauthority。runtime semantic ownerにはしない |
| Observation Stage Context | currentは`normal_observation`。将来は問いシステムcore gateからstageとsource lineageを受領 |
| Evidence / Nucleus / Relation / Unknown | v3の根拠authorityとして再利用 |
| Safety Policy | 別Safety ownerの結果を拘束条件として再利用 |
| Question Need Decision | NLS v3の外部owner。v3は問い要否を自己決定しない |
| R8 Reception Opportunity | obligation候補を作る補助hintとして利用可 |
| R8 MovePlan / primary move | v3 obligationの必須authorityとしては使わない |
| v1 Surface | production owner、paired baseline、rollback owner |
| v2 modules | 停止済み履歴。v3からimport禁止 |
| v3 Surface | 最低1000件とlocal安定条件までoffline。以後shadow、tester-only preview、ownerの順 |

### 4.3 v2隔離

- 停止済みNLS v2の4 module、NLS v2 schema ID、fixture prefix、candidate ID namespaceを再利用しない。
- 対象4 moduleは `emlis_ai_grounded_reception_content_plan_v2.py`、`emlis_ai_grounded_reception_candidate_plan_v2.py`、`emlis_ai_grounded_human_reception_v2.py`、`emlis_ai_grounded_reception_candidate_selector_v2.py`である。
- v2 moduleをv3のcompatibility façadeにしない。
- v2停止cohortの本文を今回再開封・再生成・NLS v3実行へ流用しない。
- v2 Development 42、exact8、unseen12、既知実機4件等、既に本文を知っている使用可能fixtureは回帰集合としてだけ扱う。
- v2停止履歴はbody-free historical receiptとprovenanceを参照し、NLS v3の合格件数へ混ぜない。

---

## 5. v2欠陥とv3の対応

| v2または現行評価で確認した欠陥 | v3の構造対応 | 完了証拠 |
|---|---|---|
| validatorがinvalid enum、非bool、誤policy、異常上限、unknown strategyを受理 | runtime strict validator、`additionalProperties: false`相当、全field mutation | field単位negative test |
| 現行UIで到達不能な感情組合せをsampleへ混ぜられる | RN実ファイル由来のApp-Reachable Input Validator。自己理解排他を強制 | valid / invalid corpus分離receipt |
| `felt_response` 0 / 42なのに全件でfelt strategy許可 | `BoundEmlisReceptionObligation`をnormal responseの必須意味責任にする | obligation ledger case行 |
| 213候補でもmerged group 0 / 42、文数variation 0 / 42 | discourse graphとsentence partitionをcandidate identityへ含める | structural signature差分 |
| 汎用referent / predicate / terminalとanchorへ収束 | evidence-bound semantic referent + role-specific predicate、anchor加点廃止 | input-swap / generic-body test |
| Gateが`realized_unit_ids`を信用 | candidateにcoverage自己申告fieldを持たせず、Body-only ParserとIndependent Matcherが再計算 | AST / render / Parsed Witness / Binding照合 |
| 汎用3文でもmetadata維持でGate PASS | 本文置換で`RENDER_MISMATCH`または`VERIFIED_BINDING_COVERAGE_MISSING` | generic-body retained-metadata attack |
| 手入力aggregateで完了に見える | case別hash、failure code、local review rowからaggregate生成 | receipt recomputation test |
| 少数の固定caseだけを見て修正する | 新規100件追加、修正、累積全件再実行を最低10巡 | batch / cumulative regression receipt |
| 新しいcaseで直した結果、過去caseが壊れる | text-affecting changeごとに全累積caseを再実行し、changed-outputを再読 | regression diff receipt |
| sampleの言い換えだけで件数を増やす | semantic / structural / surface diversity matrixとnovelty check | batch novelty report |
| 問いが必要そうな曖昧さをSurfaceが補完する | Observation Stage Context、Unknown保持、pre-question適格性annotation | unsupported completion negative test |
| 1000件を数字だけで完了扱いする | 最低件数に加え、直近2 batchの初回runで重大新規欠陥0を要求 | saturation gate receipt |

---

## 6. 全体pipeline

```text
Current Input Bundle
  + V3 Observation Stage Context
  + GroundedObservationPlan
  + Evidence / Nucleus / Relation / Unknown / Safety
        |
        v
Semantic Obligation Inventory v3
        |
        v
Content Selection Plan v3
        |
        v
Discourse Graph / Sentence Partition Candidates v3
        |
        v
Typed Surface AST v3
        |
        +-------------------+
        |                   |
        v                   v
Canonical Renderer     Independent AST Validator
        |
        v
Final Candidate Text
        |
        v
Body-only Semantic Atom Parser
        |
        v
Parsed Surface Witness（internal IDなし）
        |
        v
Independent Semantic Matcher
  + source Evidence / Obligation Ledger
        |
        v
Verified Surface Binding
        |
        v
Semantic Hard Gate v3
        |
        v
Deterministic Lexicographic Selector
        |
        v
Byte-preserving Public Envelope Mapper
```

`V3 Observation Stage Context`は、Surfaceが何を返す段階かを指定する。NLS v3はstageを自分で変更しない。

```text
normal_observation:
  現在入力だけで成立する通常観測

pre_question_observation:
  問い前に、見えている範囲だけを返す仮観測
  足りない一点を勝手に補完しない

refined_observation:
  元入力と問い回答を別sourceとして保持し
  回答で追加された範囲だけ観測を深める
```

現行production接続時点でruntime到達可能なのは`normal_observation`だけである。`pre_question_observation`と`refined_observation`は将来の問いシステムownerから明示された場合にだけ使う。NLS v3が入力の曖昧さを見て勝手に問いを発生させたり、stageを昇格させたりしてはならない。

Machine verificationの限界を明示する。

v3のBody-only Semantic Atom Parserは、任意の日本語を完全に意味解析するownerではない。v3 rendererが生成できる制御文法だけを独立に逆解析し、本文内のreferent feature、極性、関係型・方向、modality、Emlis stance、spanを復元する。この時点では本文に存在しないobligation ID、Evidence ID、Relation IDを復元したと主張しない。

その後、別のIndependent Semantic MatcherがParsed Surface Witnessとsource Evidence / Obligation Ledgerを照合し、候補側metadataを使わず、一意に対応できたclaimだけへinternal IDをbindする。機械的に証明できるのは「v3の型付き表現が最終bytesへ正しく出たこと」と「最終bytesから復元した制御文法上の意味がsource obligationへ一意に対応すること」である。

自然さ、読まれた感覚、薄っぺらさ、template臭は機械Gateが証明したと主張しない。新規100件は華恋が入力と応答を全件読み、累積再実行では全件machine checkに加え、本文bytesが変わったcase、過去failure、影響familyを再読する。最終的な端末上の読感はlocal安定後にMash様が代表caseで確認する。

---

## 7. 入力境界

### 7.1 消費する入力

v3はmemo本文だけを入力とみなさない。現行の入力bundleとObservation Planを通じ、少なくとも次を区別して扱う。

既存mappingは `thought_text <- memo`、`action_text <- memo_action`、`emotions <- emotion_details / emotions`、`categories <- category`であり、public keyを変更しない。

- 思考内容
- 行動内容
- 感情選択と既存detail
- カテゴリ選択
- 各fieldの明示的absence
- Evidence span
- Semantic nucleus
- Relation
- Unknown boundary
- Safety boundary
- Reception opportunity
- depth eligibility
- observation stage
- refined observation時のoriginal sourceとsupplemental answer sourceの区別

emotion/categoryはユーザーが選択した観測材料であり、原因、性格、診断、将来を断定する根拠へ昇格させない。thoughtとactionが両方ある場合、同じ内容の重複か、異なる意味責任かをRelationで区別する。

### 7.2 通常サンプルのApp-Reachable Input Contract

華恋作成の通常サンプル1000件は、現行RNから送信できる形だけを有効件数へ数える。

```text
thought_text:
  string

action_text:
  string

emotions:
  1件以上
  type ∈ 喜び / 悲しみ / 怒り / 不安 / 平穏 / 自己理解

categories:
  1件以上
  value ∈ 生活 / 仕事 / 趣味 / 人間関係 / 恋愛 / 健康 / 学習 / 価値観 / 人生
```

追加規則:

1. `thought_text.strip()`または`action_text.strip()`の少なくとも一方がnon-empty。
2. emotion typeは重複不可。
3. `自己理解`がある場合、emotion配列は自己理解1件だけ。
4. `自己理解.strength == "medium"`。
5. 自己理解以外のstrengthは`weak / medium / strong`。
6. categoryは重複不可で1件以上。
7. unknown emotion / category、空type、空category、非配列を拒否する。
8. 現行UIで入力上限が実ファイルに存在しない項目へ、設計上の文字数上限を勝手に追加しない。実装時はAPI側の実制約を別途確認する。

sample validatorはRN production codeをimportしてtestを通すだけの構造にしない。実ファイルから確認したcontractを閉じたversion policyへ写し、RN contract testが両者の差分を検出する。

### 7.3 invalid / legacy入力の扱い

次は通常1000件へ数えない。

- `自己理解`と他感情の同時選択
- thought/action両方空
- emotion 0件
- category 0件
- unknown emotion / category / strength
- duplicate emotion / category
- 現在のUIから到達不能な旧payload

これらは`invalid_contract`または`legacy_input`として別集合へ置く。

- `invalid_contract`: sample validatorとbackend防御のnegative test。
- `legacy_input`: 過去版から保存され、現行UI contractと異なる可能性がある実データ。通常商品品質件数と混ぜず、互換性・migration判断用に記録する。

### 7.4 plannerの禁止入力

次をplannerの意味選択根拠にしない。

- case ID、family ID、fixture名、batch番号
- expected text、expected terminal、expected predicate
- v2停止cohort identity / body
- raw username / honorific text
- test-only cue
- random seed
- v1 / v2が過去に選んだ完成文
- review verdict、failure severity、過去修正理由
- question-system relevance annotation
- R8 `primary_reception_act` / `secondary_reception_act`だけを理由にした必須選択

評価annotationはrunnerと華恋のlocal review toolingが使い、NLS v3 generation pathへ渡さない。

### 7.5 問いシステム接続境界

NLS v3へ渡すstage contextは閉じたartifactとする。

```json
{
  "schema_version": "cocolon.emlis.nls_v3.observation_stage_context.v1",
  "stage": "normal_observation",
  "original_input_bundle_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "question_need_decision_sha256": null,
  "supplemental_answer_bundle_sha256": null,
  "allowed_source_roles": ["original_input"],
  "body_free": true
}
```

stage別規則:

| stage | 必須source | 禁止 |
|---|---|---|
| `normal_observation` | original input | 問いの発明、足りない原因の補完 |
| `pre_question_observation` | original input + upstream question need decision | 問い回答がある前提の断定、問いだけ返して観測を省略 |
| `refined_observation` | original input + question need decision + supplemental answer | 元入力の上書き、回答範囲を越える深化、source role混同 |

現在のNLS v3実装では`normal_observation`を実動対象にする。将来stageのschema / negative test / source分離contractは先に作るが、問いowner不在のままvisible runtimeへ到達させない。

### 7.6 metamorphic boundary

同じemotion/categoryでもthought/actionの意味を入れ替えた入力では、obligation、Parsed Surface Witness、Verified Surface Bindingが対応して変わらなければならない。逆に、空白・改行・Unicode正規化だけの差ではcanonical identityが不必要に変わらない。

必須metamorphic test:

1. thoughtだけを別意味へswapする。
2. actionだけを別意味へswapする。
3. emotion選択だけを変える。
4. categoryだけを変える。
5. thought/actionの関係方向を反転する。
6. positiveとself-denialを入れ替える。
7. unknown boundaryを除く。
8. evidence IDだけを別caseへswapする。
9. normalからpre-questionへstageだけを変える。
10. refinedでsupplemental answer sourceだけを別caseへswapする。

各mutationについて、変わるべきartifactと変わってはいけないpublic contractを先に表へ固定する。

### 7.7 response eligibilityはupstream ownerが決める

`normal response`をv3が自己申告してbound reception義務を回避できる構造にしない。既存のSafety / routing / `GroundedObservationPlan.surface_policy.content_source`をauthorityとし、adapterが閉じた`V3ResponseEligibility`へ写像する。

```text
normal_surface
separate_safety_owner
source_unavailable
```

- v3はeligibility値を生成・変更・downgradeしない。
- `normal_surface`と、v3がvisible textを返す`source_unavailable`ではbound Emlis receptionを必須にする。
- `separate_safety_owner`では別Safety ownerへ委譲し、v3成功件数に混ぜない。
- `source_unavailable`では既存の低情報 / unavailable境界に従い、利用可能なemotion / category / explicit absence / unknown obligationへ限定してreceptionをbindする。具体sourceがないのに原因や出来事を発明しない。bind可能なobligationがなければv3 visible successにせず、既存outer unavailable / fallback境界へ返す。
- source policy hash、stage context hash、adapter version、eligibility valueをObligation Ledger lineageへ残す。
- unknown enum、source hash不一致、v3側のrelabelはHard failにする。

---

## 8. Semantic Obligation Inventory v3

### 8.1 意味責任の定義

`Semantic Obligation`は「この入力へ返すなら、最終本文で保持・区別・限定しなければならない意味上の責任」である。完成文、語句、語尾ではない。

v3は、Contentを選ぶ前にobligation候補を列挙する。これにより「見つけなかった意味」と「見つけたが安全・量の理由で選ばなかった意味」を区別する。

初期kind候補:

| kind | 責任 |
|---|---|
| `grounded_nucleus_notice` | 現在入力の具体的な状態・出来事・行動を、極性とmodalityを保って受ける |
| `grounded_relation_preservation` | thought/action、二つの意味、前後、対立、継続、変化等のrelationを方向付きで保つ |
| `unknown_boundary_preservation` | 分からない原因・対象・未来を分からないまま限定する |
| `significance_or_shift` | 入力内で明示された大切さ、評価変化、意味の移りを保持する |
| `intention_or_next_action` | 入力内にある具体行動、残っている意図、次の一歩を未来保証せず保持する |
| `self_denial_boundary` | 自己否定と観測可能な行動・状態を切り離し、自己否定を事実化しない |
| `bounded_counterposition` | 許可された範囲で自己否定等へ限定的に反対する |
| `bound_emlis_reception` | 特定の非stance obligationへ、Emlisがどう向き合うかを結び付ける |

`bound_emlis_reception`は「Emlisは受け取りました」のような独立一般文では成立しない。必ず対象obligation、根拠Evidence、許可されたreception actを持つ。

各obligationはpolarity / modalityだけでなく、`temporal_scope`、`topic_scope_ids`、`referent_scope`を持つ。これにより過去報告を現在事実へ変えること、意図を完了行動へ変えること、あるtopicの意味を別topicへ移すことをGateで検出する。

例:

- `hold_in_attention`: 具体点を気に留める。
- `do_not_dismiss`: 具体点を軽く扱わない。
- `receive_without_deciding`: unknownを決めつけず受け取る。
- `honor_concrete_action`: 自己否定と切り離して具体行動を受ける。
- `stay_with_mixed_meaning`: 正負を一方へ潰さず、併存を受ける。

これらは完成文bankではなく、Emlisの意味上のstance codeである。

### 8.2 必須規則

1. `separate_safety_owner`以外でv3 visible textを返すresponseには `bound_emlis_reception`を1件以上含める。
2. `bound_emlis_reception.target_obligation_ids`は空にしない。
3. targetは同じledger内の非stance obligationでなければならない。
4. targetがrelationならrelation endpoint、direction、polarityを引き継ぐ。
5. `required`はstrict booleanであり、truthy文字列を許可しない。
6. 全Evidence / Nucleus / Relation / Unknown / Safety参照がsource planへ解決する。
7. `must_not_merge_with`と`distinctness_group`で、同じ文へ畳むと意味が消える責任を拘束する。
8. raw input、case ID、expected surface、usernameを格納しない。
9. required obligationが作れない、またはsourceへ解決できない場合、Surfaceで一般文を補わずplanner failureにする。
10. Reception Opportunityをhintとして一件でも読んだ場合、使用したReception Plan artifact hashとopportunity refをlineageへ残す。Observation Plan hashだけで全入力を表したことにしない。
11. `pre_question_observation`では、unknown boundaryを消して原因・対象・意図を補完しない。見えているobligationだけで仮観測を成立させる。
12. `refined_observation`では、original input由来obligationとsupplemental answer由来obligationをsource roleで区別し、回答が追加した範囲だけを深化させる。
13. NLS v3は問い要否、問い文、問い回数を決めない。stage contextのauthority hashがなければfuture stageを拒否する。

Inventory件数をcandidate上限12と混同しない。Schemaで意味責任を12件へ切り捨てず、Step 1で実sourceのNucleus / Relation / Unknown / Safety / Reception Opportunity各上限からlosslessなresource boundを導出し、version policyへ固定する。bound超過時はtruncateせず`OBLIGATION_INVENTORY_OVERFLOW`としてcase failureにする。bound直前・bound一致・bound+1のtestを持つ。

### 8.3 Schema案

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.emlis.nls_v3.semantic_obligation_ledger.v1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "ledger_id",
    "source_observation_plan_sha256",
    "source_observation_stage_context_sha256",
    "source_reception_opportunity_plan_sha256",
    "response_eligibility_source_sha256",
    "response_eligibility",
    "source_policy_sha256",
    "allowed_source_owners",
    "obligations",
    "required_obligation_ids",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.nls_v3.semantic_obligation_ledger.v1"
    },
    "ledger_id": {
      "type": "string",
      "pattern": "^nls3obl_[0-9a-f]{16,64}$"
    },
    "source_observation_plan_sha256": {
      "type": "string",
      "pattern": "^[0-9a-f]{64}$"
    },
    "source_observation_stage_context_sha256": {
      "type": "string",
      "pattern": "^[0-9a-f]{64}$"
    },
    "source_reception_opportunity_plan_sha256": {
      "type": ["string", "null"],
      "pattern": "^[0-9a-f]{64}$"
    },
    "response_eligibility_source_sha256": {
      "type": "string",
      "pattern": "^[0-9a-f]{64}$"
    },
    "response_eligibility": {
      "enum": ["normal_surface", "separate_safety_owner", "source_unavailable"]
    },
    "source_policy_sha256": {
      "type": "string",
      "pattern": "^[0-9a-f]{64}$"
    },
    "allowed_source_owners": {
      "const": [
          "nuclei",
          "relations",
          "unknown_boundaries",
          "safety_policy",
          "human_reception_plan.opportunities"
      ]
    },
    "obligations": {
      "type": "array",
      "minItems": 1,
      "items": {
        "$ref": "#/$defs/obligation"
      }
    },
    "required_obligation_ids": {
      "type": "array",
      "minItems": 1,
      "uniqueItems": true,
      "items": {
        "type": "string"
      }
    },
    "body_free": {
      "const": true
    }
  },
  "$defs": {
    "obligation": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "obligation_id",
        "kind",
        "required",
        "evidence_ids",
        "nucleus_ids",
        "relation_ids",
        "unknown_boundary_ids",
        "target_obligation_ids",
        "polarity",
        "modality",
        "temporal_scope",
        "topic_scope_ids",
        "referent_scope",
        "distinctness_group",
        "must_not_merge_with",
        "allowed_response_acts",
        "forbidden_claim_codes",
        "source_authority_codes"
      ],
      "properties": {
        "obligation_id": {
          "type": "string",
          "pattern": "^obl_[0-9a-f]{16,64}$"
        },
        "kind": {
          "enum": [
            "grounded_nucleus_notice",
            "grounded_relation_preservation",
            "unknown_boundary_preservation",
            "significance_or_shift",
            "intention_or_next_action",
            "self_denial_boundary",
            "bounded_counterposition",
            "bound_emlis_reception"
          ]
        },
        "required": {
          "type": "boolean"
        },
        "evidence_ids": {
          "type": "array",
          "uniqueItems": true,
          "items": {
            "type": "string"
          }
        },
        "nucleus_ids": {
          "type": "array",
          "uniqueItems": true,
          "items": {
            "type": "string"
          }
        },
        "relation_ids": {
          "type": "array",
          "uniqueItems": true,
          "items": {
            "type": "string"
          }
        },
        "unknown_boundary_ids": {
          "type": "array",
          "uniqueItems": true,
          "items": {
            "type": "string"
          }
        },
        "target_obligation_ids": {
          "type": "array",
          "uniqueItems": true,
          "items": {
            "type": "string"
          }
        },
        "polarity": {
          "enum": ["positive", "negative", "mixed", "neutral", "unknown"]
        },
        "modality": {
          "enum": ["observed", "reported", "intended", "possible", "unknown"]
        },
        "temporal_scope": {
          "enum": ["current_input", "reported_past", "intended_future", "atemporal", "unknown"]
        },
        "topic_scope_ids": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "items": {
            "type": "string"
          }
        },
        "referent_scope": {
          "enum": ["self", "other", "event", "action", "state", "relation", "unknown"]
        },
        "distinctness_group": {
          "type": "string"
        },
        "must_not_merge_with": {
          "type": "array",
          "uniqueItems": true,
          "items": {
            "type": "string"
          }
        },
        "allowed_response_acts": {
          "type": "array",
          "uniqueItems": true,
          "items": {
            "enum": [
              "notice",
              "preserve_relation",
              "preserve_unknown",
              "mark_shift",
              "honor_action",
              "separate_self_denial",
              "bounded_counterposition",
              "hold_in_attention",
              "do_not_dismiss",
              "receive_without_deciding",
              "honor_concrete_action",
              "stay_with_mixed_meaning"
            ]
          }
        },
        "forbidden_claim_codes": {
          "type": "array",
          "uniqueItems": true,
          "items": {
            "type": "string"
          }
        },
        "source_authority_codes": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "items": {
            "enum": ["nucleus", "relation", "unknown_boundary", "safety_policy", "reception_opportunity"]
          }
        }
      }
    }
  }
}
```

Schemaだけでは表せない相互参照条件はruntime validatorで検証する。`source_policy_sha256`はRCのfrozen policyと一致しなければならず、artifact自身がallowed ownerを狭めて意味を落とすことを許さない。`human_reception_plan.opportunities`または`reception_opportunity`を一件でも使う場合はReception Plan hashをnon-nullにし、未使用ならnullにする。JSON Schema greenだけをcontract完了と呼ばない。

---

## 9. Content Selection Plan v3

### 9.1 discoveryとselectionの分離

Inventoryは意味責任の発見、Content Planは表示対象の選択を担う。各obligationを次の一つへ分類する。

- `selected`
- `integrated_into`
- `deferred_by_budget`
- `omitted_redundant`
- `blocked_by_safety`
- `unrealizable`

required obligationへ `deferred_by_budget`、`omitted_redundant`、`unrealizable`を付けて正常完了にしてはならない。`integrated_into`は統合先で意味Witnessを別々に復元できる場合だけ許可する。

### 9.2 depth

depthは文字数や入力長だけで決めない。選択されたdistinct obligation、relationの数、topic数、unknown、安全境界、Emlis stanceの分離必要性から決める。

| depth | 意味構造 | sentence目安 | 条件 |
|---|---|---:|---|
| `minimal` | 独立した主意味1 + それに結び付くEmlis stance | 1〜2 | 低情報、関係が少ない、安全な統合が可能 |
| `focused` | 主意味1〜2 + relation / shift + bound reception | 2〜3 | 一つの焦点を複数責任で受ける |
| `layered` | 互いに潰せない意味2以上 + relation / unknown + reception | 3〜5 | 長文、mixed、複数topic、自己否定+行動等 |

句読点や同義反復でsentence数を満たさない。minimalを水増ししない。layeredを一文へ押し込んで責任を消さない。

### 9.3 二段量・表示比率

既存の観測6 : 人間的フォロー4は思想上の基準であり、文字数を常に6:4へ揃える規則ではない。v3では次の順に決める。

1. `見えたこと`がObservation側のrequired semantic keysを満たす。
2. `Emlisから`が少なくとも1つのbound receptionを満たす。
3. 同じsemantic keyの単純再掲を除く。
4. depth別のsection量上限内で、意味責任が欠けない最短構造を選ぶ。

比率候補は100件単位のlocal反復中にだけ調整する。調整理由をchange ledgerへ残し、変更後は累積全件を再実行する。最終local gateでrelease candidateをfreezeした後に生成本文、depth、selector、section比率を変えた場合、そのRC証拠は無効とし、Step 11の累積ループへ戻る。presentation-onlyの余白やfont等、本文bytesへ影響しない変更だけを別分類で扱う。

### 9.4 Content Plan JSON案

```json
{
  "schema_version": "cocolon.emlis.nls_v3.content_selection_plan.v1",
  "content_plan_id": "nls3cp_0123456789abcdef",
  "source_obligation_ledger_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "depth": "focused",
  "section_budget": {
    "observation_sentence_min": 1,
    "observation_sentence_max": 2,
    "reception_sentence_min": 1,
    "reception_sentence_max": 2,
    "total_sentence_max": 4
  },
  "decisions": [
    {
      "obligation_id": "obl_0123456789abcdef",
      "status": "selected",
      "reason_code": "REQUIRED_GROUNDED_RELATION"
    },
    {
      "obligation_id": "obl_fedcba9876543210",
      "status": "selected",
      "reason_code": "BOUND_RECEPTION_REQUIRED"
    }
  ],
  "required_coverage_obligation_ids": [
    "obl_0123456789abcdef",
    "obl_fedcba9876543210"
  ],
  "body_free": true
}
```

---

## 10. Discourse Graph Planner v3

### 10.1 責任

Discourse Plannerは、選択されたobligationをどの順で、どの文へ、どのrelationで配置するかを決める。完成文や語尾を決めない。

graph node:

- obligation reference
- section role: `observation` / `reception`
- clause role
- antecedent binding
- merge eligibility
- must-separate constraint

edge候補:

- `precedes`
- `explains_without_causation`
- `contrasts_with`
- `coexists_with`
- `qualifies`
- `receives`
- `separates_self_denial_from`
- `preserves_unknown_before`

### 10.2 順序拘束

- 指示語のantecedentは先に出す。
- unknownがactionの確定度を限定する場合、unknown boundaryをaction断定より前または同一clause内へ置く。
- 自己否定と具体行動が併存する場合、自己否定を事実化する前に両者を分離する。
- contrast endpointは離しすぎず、方向を保持する。
- reception nodeは対象obligationと同一文へmergeするか、対象の直後へ置く。
- sectionを跨いで同じ命題だけを反復しない。

### 10.3 実質variation

候補のstructural signatureは次を含む。

```text
obligation order
+ sentence partition
+ rhetorical edge set
+ observation/reception section assignment
+ reception target position
+ antecedent binding plan
```

opening、語尾、Emlisという単語の有無、同義語だけの差は別structureに数えない。

候補数に一律minimumを置かない。制約が強いminimal入力では1候補が正しい場合がある。代わりに次をsample annotationと構造testで検査する。

- 独立obligationが2件以上あり、順序交換が安全なら2つ以上のstructural signatureを作る。
- merge可能なobligation対があるなら、safe mergeとsafe splitを各1候補以上作る。
- topo orderが複数あるなら、そのうち意味上異なるものを最低2つ作る。
- variationを作れない場合、`NO_SAFE_STRUCTURAL_ALTERNATIVE`等の機械可読理由を残す。
- candidate上限は12。上限を埋めるための同義語候補を作らない。

### 10.4 Discourse Plan JSON案

```json
{
  "schema_version": "cocolon.emlis.nls_v3.discourse_plan.v1",
  "discourse_plan_id": "nls3dp_0123456789abcdef",
  "source_content_plan_sha256": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  "structural_signature": "nls3sig_fedcba9876543210",
  "nodes": [
    {
      "node_id": "dn_01",
      "obligation_id": "obl_0123456789abcdef",
      "section_role": "observation",
      "clause_role": "relation_notice",
      "antecedent_node_ids": []
    },
    {
      "node_id": "dn_02",
      "obligation_id": "obl_fedcba9876543210",
      "section_role": "reception",
      "clause_role": "bound_reception",
      "antecedent_node_ids": ["dn_01"]
    }
  ],
  "edges": [
    {
      "from": "dn_01",
      "to": "dn_02",
      "type": "receives"
    }
  ],
  "sentence_groups": [
    {
      "section_role": "observation",
      "node_ids": ["dn_01"]
    },
    {
      "section_role": "reception",
      "node_ids": ["dn_02"]
    }
  ],
  "body_free": true
}
```

---

## 11. Typed Surface ASTとCanonical Renderer

### 11.1 任意本文をcandidate contractにしない

v2のような `(text, realized_unit_ids, score metadata)`をcandidateのauthorityにしない。

v3の`SurfaceCandidate`は型付きASTをauthorityとし、`final_text`はASTのcanonical render結果としてだけ得る。production constructorは外部から任意の`final_text`を受け取らない。

推奨node:

| node | 役割 |
|---|---|
| `GroundedReferentNode` | Evidence / Nucleusから入力固有の指示対象を作る |
| `GroundedRelationNode` | relation type、endpoint、directionを表す |
| `UnknownBoundaryNode` | 不明・未確定のscopeを表す |
| `ObservationPredicateNode` | 観測としてのrole-specific predicate |
| `EmlisStanceNode` | target obligationへ結び付くEmlis stance |
| `SelfDenialBoundaryNode` | 自己否定と観測可能事実の分離 |
| `ModalityNode` | reported / possible / unknown等を実現 |
| `ConnectorNode` | graph edgeに対応する接続 |
| `TerminalNode` | section / clause roleに適合する終止 |

`GroundedReferentNode`だけではobligation coverageにならない。入力固有referentと、compatibleなpredicate / relation / stanceが組になって初めてmeaning claimになる。

### 11.2 lexicalization境界

- raw inputの長い引用を第一選択にしない。
- semantic featureから短いgrounded phraseを組み立てる。
- source anchorは一候補1件以下、必要性を理由codeで記録する。
- anchor利用をselectorで加点しない。
- generic referentだけでrequired obligationを満たさない。
- sentence bank、完成文bank、case cue、random synonymを使わない。
- topic-specific名詞を発明しない。
- 比喩は初期v3の対象外とする。既存の安全比喩contractを勝手に拡張しない。

### 11.3 Surface AST JSON案

```json
{
  "schema_version": "cocolon.emlis.nls_v3.surface_ast.v1",
  "surface_ast_id": "nls3ast_0123456789abcdef",
  "source_discourse_plan_sha256": "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
  "sections": [
    {
      "role": "observation",
      "sentences": [
        {
          "clauses": [
            {
              "clause_id": "cl_01",
              "obligation_id": "obl_0123456789abcdef",
              "nodes": [
                {
                  "node_type": "grounded_referent",
                  "evidence_ids": ["thought_01"],
                  "nucleus_ids": ["n_02"],
                  "form": "semantic_phrase"
                },
                {
                  "node_type": "grounded_relation",
                  "relation_id": "rel_03",
                  "direction": "source_to_target"
                },
                {
                  "node_type": "observation_predicate",
                  "form": "coexisting_meanings_observed"
                }
              ]
            }
          ],
          "terminal": "plain_bounded"
        }
      ]
    },
    {
      "role": "reception",
      "sentences": [
        {
          "clauses": [
            {
              "clause_id": "cl_02",
              "obligation_id": "obl_fedcba9876543210",
              "nodes": [
                {
                  "node_type": "grounded_referent",
                  "antecedent_clause_id": "cl_01",
                  "form": "unique_antecedent"
                },
                {
                  "node_type": "emlis_stance",
                  "target_obligation_ids": ["obl_0123456789abcdef"],
                  "form": "stay_with_mixed_meaning"
                }
              ]
            }
          ],
          "terminal": "plain_restrained"
        }
      ]
    }
  ]
}
```

実Schemaではnode typeごとに`oneOf`を分け、node typeと無関係なfieldを拒否する。上のJSONは形の説明用であり、そのまま実装Schemaと確定しない。

### 11.4 canonical render

rendererは次を決定論的に行う。

1. AST strict validation
2. referent resolution
3. nodeごとのbounded lexicalization
4. Japanese clause composition
5. connector insertion
6. sentence integration
7. section label composition
8. punctuation / whitespace canonicalization
9. final UTF-8 bytesとSHA-256生成

rendererは同時にprocess-local span mapを生成できるが、Gateはその自己申告だけを信用しない。span mapは独立parser結果との照合対象である。

---

## 12. Body-only Semantic Atom Parser / Independent Semantic Matcher

### 12.1 二系統の一致

最終候補は次の二系統が一致した場合だけHard Gateへ進む。

```text
forward proof:
  Obligation -> Discourse -> AST -> Canonical Renderer -> final bytes

independent proof:
  final bytes -> Body-only Semantic Atom Parser
             -> Parsed Surface Witness（internal IDなし）
             -> Independent Semantic Matcher
             -> Verified Surface Binding
```

Body-only Parserはcandidateの`covered_obligation_ids`、generator span map、soft score、Gate status、Obligation Ledgerを入力にしない。final bytesとfrozen grammar catalogだけを読む。

Independent MatcherはParsed Surface Witnessとsource Evidence / Nucleus / Relation / Unknown / Obligation Ledgerを読むが、candidate AST、generator span map、candidate-declared IDを読まない。本文semantic featureから一致候補を再計算し、一意性が1でないbindingを拒否する。

forward rendererとinverse parserが共有してよいのは、version固定されたdeclarative surface grammar catalogのtoken / semantic atom code / morphology ruleだけである。renderer関数、AST traversal、span map、coverage計算、binding helperを共有しない。別moduleであることだけを独立性の証拠にせず、次を要求する。

- renderer implementationをmutationしてもparserが同じbugをそのまま追認しないdifferential test
- parser implementationをmutationするとround-tripが落ちるtest
- declarative catalogの一項目mutationでRC hash driftとmismatchが出るtest
- generator metadataを全削除してもparser / matcher判定が同じであるtest

### 12.2 Witness

Parsed Witnessは最終本文から復元したsemantic atomを持つ。本文に現れないinternal IDは持たない。

```json
{
  "schema_version": "cocolon.emlis.nls_v3.parsed_surface_witness.v1",
  "candidate_text_sha256": "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  "parse_status": "parsed",
  "semantic_atoms": [
    {
      "atom_id": "atom_01",
      "kind": "grounded_relation",
      "referent_fingerprint": "semantic_ref_0123456789abcdef",
      "relation_type": "coexists_with",
      "direction": "source_to_target",
      "polarity": "mixed",
      "modality": "observed",
      "temporal_scope": "current_input",
      "topic_fingerprints": ["topic_0123456789abcdef"],
      "referent_scope": "relation",
      "utf8_byte_start": 7,
      "utf8_byte_end": 31,
      "span_sha256": "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    },
    {
      "atom_id": "atom_02",
      "kind": "bound_emlis_reception",
      "target_atom_ids": ["atom_01"],
      "reception_act": "stay_with_mixed_meaning",
      "temporal_scope": "current_input",
      "topic_fingerprints": ["topic_0123456789abcdef"],
      "referent_scope": "relation",
      "utf8_byte_start": 43,
      "utf8_byte_end": 65,
      "span_sha256": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    }
  ],
  "body_free_export_allowed": false
}
```

Independent Matcherは別artifactとしてbindingを出す。

```json
{
  "schema_version": "cocolon.emlis.nls_v3.verified_surface_binding.v1",
  "parsed_surface_witness_sha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "source_obligation_ledger_sha256": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  "bindings": [
    {
      "atom_id": "atom_01",
      "obligation_id": "obl_0123456789abcdef",
      "evidence_ids": ["thought_01"],
      "relation_id": "rel_03",
      "topic_scope_ids": ["topic_01"],
      "match_basis": "UNIQUE_REFERENT_RELATION_POLARITY_MATCH",
      "match_candidate_count": 1
    },
    {
      "atom_id": "atom_02",
      "obligation_id": "obl_fedcba9876543210",
      "target_obligation_ids": ["obl_0123456789abcdef"],
      "topic_scope_ids": ["topic_01"],
      "match_basis": "UNIQUE_BOUND_RECEPTION_TARGET_MATCH",
      "match_candidate_count": 1
    }
  ],
  "binding_status": "matched",
  "body_free_export_allowed": false
}
```

Parsed Witnessのspanはcanonical final UTF-8 bytes上の0始まり・半開区間 `[utf8_byte_start, utf8_byte_end)` とする。両端はUTF-8 scalar境界、`start < end`、本文範囲内でなければならない。Parsed WitnessとVerified Bindingはこのbyte range、本文由来fingerprint、source bindingを持つためprocess-local / encrypted review evidenceであり、public metaへ出さない。body-free receiptにはsecret nonce付きcommitment、atom / claim kind count、obligation coverage codeだけを出す。

### 12.3 改ざん耐性

次を必ず拒否する。

- ASTを残して本文だけ汎用3文へ変更
- 本文を残して外側serialized objectへ別obligation ID / evidence IDを付与
- ASTと本文を同時に別意味へ変更
- clauseを削除して古いgenerator span mapを保持
- 二つのantecedentがあるのに「それ」で参照
- relation endpointを逆にする
- mixedをpositiveだけへ変える
- unknown hedgeを削る
- stance targetをgeneric referentへ変える
- metadataへcoverage fieldを後付け

production constructorで任意本文差替えを不可能にし、serialized objectのtamper testも別に持つ。Matcherの一致候補が0または2件以上なら、それぞれ`NO_SEMANTIC_BINDING`、`AMBIGUOUS_SEMANTIC_BINDING`で拒否する。

---

## 13. Semantic Hard Gate v3

### 13.1 原則

- Hard Gateはfinal bytes、source evidence、obligation ledger、frozen grammarから判定する。
- generatorのcoverage、score、選択希望を入力にしない。
- 一つでもhard failureがあればSoft Selectorへ渡さない。
- machine Gateは自然さを証明したと主張しない。
- Gate failureは候補単位であり、通常入力全体を直ちに無応答へしない。別candidateまたは限定recoveryを試す。

### 13.2 Gate一覧

| # | Gate | authority | 主なfailure code |
|---:|---|---|---|
| 1 | Artifact / Schema / Parent Hash | artifact bytes | `INVALID_SCHEMA`, `PARENT_HASH_MISMATCH` |
| 2 | Version / Dependency Closure | RC manifest | `DEPENDENCY_DRIFT` |
| 3 | Canonical Render Equality | AST + renderer + final bytes | `RENDER_TEXT_MISMATCH` |
| 4 | Body Parseability | final bytes + parser grammar | `UNPARSABLE_CONTROLLED_SURFACE` |
| 5 | Evidence Resolution | Parsed Witness + Independent Binding + source Evidence | `UNKNOWN_EVIDENCE_REF`, `AMBIGUOUS_SEMANTIC_BINDING` |
| 6 | Required Obligation Coverage | Verified Binding + ledger | `REQUIRED_OBLIGATION_MISSING` |
| 7 | Bound Emlis Reception | Verified target binding | `UNBOUND_EMLIS_RECEPTION` |
| 8 | Polarity / Modality / Time | Parsed Witness + source | `POLARITY_INVERSION`, `MODALITY_OVERCLAIM` |
| 9 | Relation Type / Direction | Parsed Witness + Independent Binding + Relation | `RELATION_DIRECTION_INVERSION` |
| 10 | Referent / Topic Scope | Parsed Witness antecedent graph + Matcher | `AMBIGUOUS_REFERENT`, `TOPIC_MIX` |
| 11 | Unknown Boundary | Parsed Witness + Unknown | `UNKNOWN_BOUNDARY_DROPPED` |
| 12 | Self-denial Boundary | Parsed Witness + Verified Binding + Safety | `SELF_DENIAL_ADOPTED`, `SELF_DENIAL_AMPLIFIED` |
| 13 | Unsupported Claim | claim whitelist + source | `INVENTED_CAUSE`, `PERSONALITY_CLAIM`, `DIAGNOSIS_CLAIM`, `FUTURE_GUARANTEE` |
| 14 | Observation / Reception Distinctness | section claim keys | `SECTION_SEMANTIC_REPLAY` |
| 15 | Input Enumeration / Shallow Mirror | claim structure + surface | `INPUT_ENUMERATION`, `ANCHOR_REPLAY` |
| 16 | Contribution Distinctness | obligation / claim groups | `DISTINCT_OBLIGATIONS_COLLAPSED` |
| 17 | Depth Proportionality | Content Plan + Parsed Witness / Binding | `DEPTH_INFLATED`, `DEPTH_TRUNCATED` |
| 18 | Surface Integrity | final bytes | `BROKEN_GRAMMAR`, `DUPLICATE_FRAGMENT`, `LABEL_ORDER_INVALID` |
| 19 | Naming / Address Contract | outer address owner + final bytes | `USER_NAME_INVENTED`, `ADDRESS_RETARGETED` |
| 20 | Body-free / Public Contract | export / response envelope | `RAW_BODY_LEAK`, `PUBLIC_CONTRACT_DIFF` |

### 13.3 coverageの成立条件

required obligationがcoveredになるのは、Body-only Parserが最終本文からsemantic atomを復元し、Independent Matcherが次を候補metadataなしで一意bindingできた場合だけである。

1. obligationと互換なclaim kind
2. source semantic featureへ一意に対応するEvidence / Nucleus / Relation
3. 正しいpolarity / modality / direction
4. 入力固有referentまたは一意antecedent
5. role-specific predicate / stance
6. obligationごとのfinal span

generic terminal、Emlisという語の出現、入力語の引用だけではcoverageにならない。

### 13.4 Observation / Reception distinctness

単純な文字列差ではなくsemantic keyで検査する。

```text
semantic key =
  claim kind
  + evidence/relation identity
  + polarity/modality
  + role contribution
  + reception target
```

`Emlisから`が`見えたこと`と同じclaimを語尾だけ変えて再掲し、固有のreception stanceを持たない場合は失敗する。逆に、同じ対象を参照していても「観測」と「その対象を軽く扱わないstance」が別claimとして成立すれば通せる。

---

## 14. SelectorとRecovery

### 14.1 Hard pass後だけ選ぶ

Selectorへ入る候補は20 Gateを全て通過したものだけである。Softな良さでhard failureを救わない。

v2のような調整しやすい総合weighted scoreを初期ownerにしない。v3は、独立に計算した属性のlexicographic orderを使う。

推奨優先順:

1. required obligation coverage completeness
2. bound reception specificity
3. distinct obligation preservation
4. observation / reception semantic separation
5. grounded specificity
6. referent clarity
7. repetition restraint
8. quote / source-anchor restraint
9. depth fit
10. stable content-derived candidate ID

1〜4はHard Gate通過候補間でも同値確認用に残すが、欠損候補を通さない。自然さ、non-template、読まれた感覚をruntime scoreが証明したと書かない。

実装時は曖昧な名称のままscore化せず、次のcanonical attributeへ固定する。

| 順 | attribute | 算出authority | 方向 |
|---:|---|---|---|
| 1 | `required_binding_count` | Verified Bindingとrequired obligation setの積集合 | 最大。ただし全required未達はHard fail |
| 2 | `required_distinctness_group_count` | Content Plan distinctness groupとBinding | 最大 |
| 3 | `bound_reception_target_count` | reception atomから一意bindingしたrequired non-stance target | 最大。targetなしはHard fail |
| 4 | `section_semantic_replay_count` | observation / reception semantic keyの完全一致数 | 最小 |
| 5 | `generic_referent_count` | Parsed Witnessのgeneric / unbound referent atom数 | 最小。required target上はHard fail |
| 6 | `unnecessary_source_anchor_count` | AST anchor nodeのうち一意semantic phraseで代替可能な数 | 最小 |
| 7 | `redundant_atom_count` | 同一section内の同じsemantic key反復数 | 最小 |
| 8 | `depth_deviation` | target sentence group数とactual group数の絶対差 | 最小 |
| 9 | `anaphora_distance` | antecedentからanaphoraまでのclause距離合計 | 最小 |
| 10 | `candidate_id` | obligation / discourse / AST canonical hash | byte昇順 |

各attributeのfunction、input field、enum registry、tie directionをselector policy artifactへ入れ、そのhashをRCへ固定する。attribute名だけを残して後から計算式を変えない。

### 14.2 tie-breakと順序独立

- candidate list順をselectorへ意味として渡さない。
- candidateを全順列またはproperty-based permutationしても同じcandidate IDを選ぶ。
- 最終tieはcanonical content hashの昇順とする。
- candidate IDは本文だけでなく、obligation ledger hash、structural signature、AST hashへ結び付ける。
- case別weight、family別boost、特定語cueを禁止する。

### 14.3 Recovery

Hard Gate failure時は、元candidate本文を部分文字列置換して修理しない。失敗layerへ戻り、同じrequired obligationを保持した別ASTを作る。

```text
candidate failure
  -> same discourse / safer AST alternative
  -> safe split candidate
  -> reduced optional obligations
  -> minimal but required-complete plan
  -> low-information bounded observation
  -> separate safety owner when Safety says so
```

recovery上限は初期生成を含めてboundedにする。推奨はcandidate総数12、同一discourseからのAST recovery 2回以下、planner全体のreplan 1回以下である。実数は100件単位の反復で実測し、最終local gateのrelease candidate freeze前に固定する。変更した場合は累積全件を再実行する。

required obligationを削ることでGateを通すrecoveryは禁止する。全候補が失敗した場合は `v3_no_valid_candidate`としてcase failureに記録し、v1 fallbackでv3成功に見せない。runtime owner切替後はユーザーへの可用性を守るためv1へfallbackできるが、v3品質指標ではfailureのまま数える。

---

## 15. Test / Mutation / Metamorphic設計

### 15.1 RED先行

各実装ownerは正常builder testより先に、不正artifactが必ず拒否されるREDを置く。builderが作った正常objectを同じvalidatorへ戻すだけでは完了にしない。

### 15.2 App-Reachable Input Validatorのnegative test

最低限、次を独立に拒否する。

- thought/action両方空
- emotion 0件
- category 0件
- unknown emotion / category / strength
- duplicate emotion / category
- `自己理解 + 他感情`
- `自己理解`のstrengthが`medium`以外
- arrayではないemotion / category
- 空白だけのthought/action

RN実ファイル側のoptionまたは排他条件が変わった場合、sample validatorとの差分testが赤になることを確認する。backendが受理することを、現行UIから到達可能である証拠にしない。

### 15.3 Gate別negative mutation

| Gate | 独立mutation |
|---|---|
| Artifact / Schema | invalid enum、未知field、非bool、duplicate ID、range外、誤parent hash |
| Dependency | upstream ownerのhashを1byte変更 |
| Stage Context | authority hashなしでfuture stageを指定、refinedでsupplemental source欠落 |
| Render equality | ASTを残して本文だけ汎用3文へ置換 |
| Parseability | 制御文法外の任意完成文を注入 |
| Evidence | 存在しないEvidence、別case Evidenceへswap |
| Coverage | required clause削除後に再render |
| Bound reception | targetを外し「そのことを受け取りました」へ変更 |
| Polarity / modality | negative/mixedをpositive、possibleをfactへ変更 |
| Relation | endpointまたはdirectionを反転 |
| Referent | 二つのantecedent後に曖昧な指示語を置く |
| Unknown | uncertainty nodeだけ削除、pre-questionで原因を補完 |
| Refined source | 問い回答を元入力へ上書き、回答範囲を越えるclaim追加 |
| Self-denial | 自己否定を観測事実として採用するpredicateへ変更 |
| Unsupported claim | 原因、人格、診断、未来保証を各1件追加 |
| Section distinctness | `見えたこと`のclaimだけを`Emlisから`へ再掲 |
| Enumeration | thought/action/emotion/categoryを同型文で列挙 |
| Contribution | distinctness groupを一つのgeneric claimへ畳む |
| Depth | layeredを一文へ圧縮、minimalを同義反復で膨張 |
| Surface | label逆転、句読点破壊、fragment重複 |
| Naming | username発明、敬称retarget |
| Body-free | receiptへraw input / comment_text / candidate textを注入 |

各Gateに最低1本の専用negative pathを持たせる。一つのmutationで複数Gateが落ちても、それだけで他Gateの拒否能力を証明したことにしない。

### 15.4 v2再発防止attack

次はrelease blocking testである。

1. generic 3文 + 元metadata保持
2. 元本文 + 別obligation metadata
3. 元本文 + 別case Evidence
4. clause deletion + stale span map
5. AST変更 + 本文不変更
6. ASTと本文を同時に別意味へ変更
7. candidate permutation
8. 同じ本文を複数入力へreuse
9. source anchorだけ残してpredicateをgeneric化
10. `Emlis`の語だけ追加してreception扱い
11. valid bodyへfake `covered_obligation_ids`を追加
12. receiptへ本文を混入
13. batch / family / case IDをgeneration cueとして渡す
14. 過去failureだけに反応する語句分岐を追加する

v3 contractに`covered_obligation_ids`を設けない。serialized payloadへ後付けされればunknown fieldとして拒否する。

### 15.5 structural variation test

valid sampleに、次のeligibility annotationを本文とは別のsemantic contractとして持たせる。

- `order_variation_eligible`
- `merge_split_eligible`
- `reception_position_variation_eligible`
- `minimal_single_structure_expected`

eligible caseではstructural signature差を要求する。候補数やterminal種類の多さを代替証拠にしない。

### 15.6 property / determinism

- 全dataclass / schema fieldを一つずつmutationする。
- Unicode NFC、LF、JSON key orderを変えてcanonical identityを検査する。
- 100回以上のcandidate permutationでselection不変を検査する。
- process restart、hash seed差、timezone差でoutput hash不変を検査する。
- dependency drift、catalog drift、config driftでRC manifest validationが落ちることを検査する。
- v3 core moduleが停止済みv2 module、停止artifact loader、runtime reply serviceをimportしないことをAST / call graphで検査する。Step 10ではreply service側のdormant adapterからv3を一方向に参照し、default call pathを`disabled`のままにする。
- sample順序を変えてもcase output hashとaggregateが変わらないことを検査する。
- text-affecting source change後に、累積corpusの一部だけを実行してformal PASSにできないことをrunner stateで検査する。

禁止文字列をtest source自身が拾う自己一致guardは使わない。AST、import graph、実call target、artifact lineageを検査する。

---

## 16. Case別Evidenceとbody-free receipt

### 16.1 手入力aggregateを禁止

新規batch、累積回帰、shadow、actual deviceのaggregateはcase decision rowからscriptで再計算する。aggregate値を直接編集してPASSへ変えられない構造にする。

case receiptに必要なbody-free lineage:

- version / release candidate ID
- source dependency closure hash
- sample source / batch ID
- input identity commitment
- app-reachable validation result
- observation stage context commitment
- source Observation Plan commitment
- obligation ledger commitment
- content plan commitment
- candidate set commitment
- selected discourse / AST commitment
- final body commitment
- Parsed Witness / Verified Binding commitment
- Hard Gate pass/failure code
- selector decision attributes
- v1 baseline body commitment
- local review reason code / verdict
- prior output commitmentとchanged / unchanged
- environment / runner / rubric hash

本文、raw input、local-review free-text noteはbody-free summary receiptへ入れない。華恋が入力と応答を読むためのbody-full local review packetは別に持つ。

Karen-generated sampleは個人情報を含めない。Supabase実ユーザー入力はraw packetをrepoへ置かず、private local workspaceで匿名化・重複確認・利用範囲確認を行う。body-free summaryだけを共有可能artifactへ出す。

短い入力へraw SHA-256だけを使うとdictionary推測が可能である。body-free summaryのinput / candidate / v1 / body-derived artifactは、domain separatorとartifactごとのrandom 256-bit nonceを使うsalted commitmentまたはversion固定HMACにする。nonce / keyとraw SHA-256はprivate full evidence側だけに置く。

### 16.2 case receipt案

```json
{
  "schema_version": "cocolon.emlis.nls_v3.case_evidence_receipt.v2",
  "candidate_version_id": "nls_v3_rc_0042",
  "run_id": "nls3run_0123456789abcdef",
  "batch_id": "nls3_batch_007",
  "sample_source": "karen_generated",
  "case_identity_commitment": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "app_reachable_validation": {
    "status": "passed",
    "contract_version": "cocolon.input_contract.20260714"
  },
  "observation_stage": "normal_observation",
  "source_dependency_closure_sha256": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  "obligation_ledger_commitment": "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
  "selected_candidate_body_commitment": "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  "parsed_witness_binding_commitment": "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  "hard_gate": {
    "status": "passed",
    "failed_codes": []
  },
  "local_product_review": {
    "status": "passed",
    "reason_codes": [
      "INPUT_SPECIFIC",
      "BOUND_EMLIS_RECEPTION",
      "NATURAL_ENOUGH"
    ]
  },
  "previous_output": {
    "commitment": null,
    "changed": null
  },
  "body_free": true
}
```

### 16.3 change ledger

反復中の構造変更は、次を一つのappend-only rowで結ぶ。

```text
before source closure hash
-> failure case commitment / batch
-> failure layer / severity / code
-> shared structural hypothesis
-> changed file hashes
-> forbidden case-specific workaround check
-> after source closure hash
-> cumulative rerun receipt hash
-> new-batch first-run result
-> accepted / rejected
```

修正回数を一回に制限しない。NLS v3は大量確認と修正の反復で完成させる。ただし、次を全て満たさない変更は受理しない。

1. 一つの入力専用ではなく、同じ原因を持つ入力群へ効く説明がある。
2. case ID、family、固有語、期待文をgeneration分岐へ追加していない。
3. 変更後に累積valid corpus全件を新run IDで再実行している。
4. output bytesが変わった過去case、過去failure、影響familyを華恋が再読している。
5. 変更後に新しい100件を追加し、既存caseだけへの適合ではないかを確認する。

最終local gateでRCをfreezeした後にtext-affecting changeが必要になった場合、同じRCの証拠を継承しない。新RCとしてStep 11の累積ループへ戻る。

---

## 17. 評価集合の全体設計

### 17.1 集合

| 集合 | 件数 | 使用目的 | 1000件への算入 |
|---|---:|---|---|
| Karen-generated cumulative samples | 最低1000 | 100件×最低10巡。新規入力で問題発見・修正・累積回帰 | 算入する |
| Known regression | 既存全件 | v2 Development等、使用可能な既知caseと過去failureの再発確認 | 算入しない |
| Supabase real-user regression | 取得後の有効全件 | 実際の人間入力でAI生成sampleの偏りを補う | 算入しない。追加で全件実行 |
| Legacy input | 取得後に分類 | 旧版payload、現行UI到達不能caseの互換性確認 | 算入しない |
| Invalid-contract suite | 必要数 | sample validator、backend防御、UI到達不能入力の拒否確認 | 算入しない |
| Actual-device representative | 初期20 | local安定後のRN表示・API/DB接続・端末読感 | 算入しない |

`最低1000件`は、華恋が現行アプリ仕様に適合させて作成し、重複・near duplicateを除いたvalid sample件数である。修正後の再実行回数は件数へ重複算入しない。実際のEmlisAI実行回数は累積回帰により1000回を大きく超える。

### 17.2 coverage family

初期taxonomyは次の14 familyを保持する。familyは評価coverage labelであり、runtime cueではない。

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
11. `relationship_gratitude_recovery`
12. `change_future_intention_transition`
13. `source_unavailable_high_information`
14. `history_eligible_current_input_only`

`structure_question`は「NLS v3が問いを出すfamily」ではない。入力だけで断定できない構造を保持し、限定観測または将来の問いシステムへ接続できるかを見る評価labelである。

### 17.3 familyと直交して持つ多様性軸

件数を増やすだけで同型入力へ偏らないよう、各caseへ評価用annotationを付ける。

- thought only / action only / both
- thoughtとactionの一致 / 補完 / 対立 / 時間差 / 因果不明
- 1 topic / multi topic
- short / medium / long / very long
- complete sentence / fragments / 口語 / 誤字・表記揺れ / 途中で切れる
- positive / negative / mixed / neutral / self-denial adjacent
- emotion単一 / 複数 / strength差 / 自己理解単独
- category単一 / 複数 / 本文との強一致 / 弱一致
- explicit cause / unknown cause
- explicit intention / uncertain intention / completed action
- referent明確 / 複数候補 / 省略
- past / current / future intention / 時間混在
- question-system relevance: `not_needed / possible / burden_risk / future_refined_candidate`
- depth: minimal / focused / layered

annotationは評価とbatch設計にだけ使い、generation pathへ渡さない。

### 17.4 sample case形式

Karen-generated corpusはJSONLを第一候補とする。nested emotion/categoryとannotationを保ちやすく、100件単位で追記・diffできるためである。

```json
{
  "schema_version": "cocolon.emlis.nls_v3.sample_case.v1",
  "case_id": "nls3s_b003_0042",
  "batch_id": "nls3_batch_003",
  "source": "karen_generated",
  "input": {
    "thought_text": "うまく説明できないけど、たぶん嫌だった。",
    "action_text": "その場では笑って流した。",
    "emotions": [
      {"type": "不安", "strength": "medium"},
      {"type": "怒り", "strength": "weak"}
    ],
    "categories": ["人間関係"]
  },
  "semantic_contract": {
    "required_meaning_codes": ["DISCOMFORT_UNCERTAIN", "OUTWARDLY_LAUGHED_OFF"],
    "forbidden_claim_codes": ["OTHER_PERSON_INTENT", "CAUSE_ASSERTION", "PERSONALITY_DIAGNOSIS"],
    "relation_codes": ["INNER_OUTER_CONTRAST"],
    "unknown_codes": ["CAUSE_NOT_EXPLICIT"],
    "expected_depth_range": ["focused", "layered"]
  },
  "coverage": {
    "families": ["uncertainty_support", "anger_or_boundary"],
    "thought_action_relation": "contrast",
    "length_class": "short",
    "surface_shape": "colloquial_fragment",
    "question_system_relevance": "possible"
  }
}
```

expected final text、expected terminal、固定語句、完成文一致を持たせない。semantic contractは、何を保持し、何を断定してはいけないかを評価するために使う。

### 17.5 100件batchの作成規則

各batchは、作成前に次を読む。

- それまでの全sample manifest
- coverage matrix
- exact / normalized / near-duplicate report
- 過去failureと修正layer
- emotion/category使用分布
- length / relation / ambiguity / surface-shape分布
- 問いシステム関連case分布

新規100件は次を満たす。

1. App-Reachable Input Validator 100 / 100 PASS。
2. exact duplicate 0。
3. 単なる名詞・動詞差し替えだけのnear duplicateを除外する。
4. 既存で不足しているcoverage cellを優先する。
5. 直前修正が壊れそうな境界caseを含める。
6. 同じstory templateを大量に使わない。
7. 自己理解は単独選択だけにする。
8. expected EmlisAI回答を作らない。
9. 個人情報、実在人物を特定する情報、実ユーザー文のコピーを入れない。
10. batch作成後にmanifestをfreezeし、実行中に都合よくcaseを差し替えない。誤ったcaseはinvalidとして理由を残し、別IDのreplacementを追加する。

### 17.6 Supabase実ユーザー入力

Supabaseデータは、実際の人間の言葉の崩れ方を確認する追加回帰集合として使う。

- CSV受領後、header、件数、欠損、重複、legacy値、個人情報候補を先に検査する。
- raw `user_id`、認証情報、メール、通知情報、EmlisAI過去出力は取り込まない。
- 現行UI contractに適合するものを`real_user_current_valid`へ分類する。
- 現行UIに到達不能なものを`real_user_legacy`へ分ける。
- 個人情報が含まれる場合は匿名化する。意味評価に必要な関係を壊す置換はしない。
- raw corpusをrepo、public log、body-free receiptへ置かない。
- 実ユーザー入力は1000件を置き換えず、追加で全件実行する。

### 17.7 他AIによるsample生成

他AIは必須ではない。華恋が100件単位で作成できる。

華恋作成sampleに同じ文章癖が残る、Supabase件数が少ない、coverage gapが埋まらない場合は、他AIを追加の入力発生源として使ってよい。ただし、他AIへCocolon code、実ユーザーraw本文、期待回答生成、評価・修正権限を渡さない。出力は華恋がApp-Reachable Validatorとnovelty checkを通した後にだけcorpusへ追加する。

---

## 18. 100件単位の累積確認・修正ループ

### 18.1 基本ループ

```text
既存corpus / coverage / failureを確認
        ↓
華恋が新規100件を作成
        ↓
App-Reachable / schema / duplicate / noveltyを検証
        ↓
修正前RCで新規100件を初回実行
        ↓
華恋が入力と応答を100件全件確認
        ↓
failureをlayer / severity / shared causeへ分類
        ↓
共通構造を修正
        ↓
累積valid corpus全件を再実行
        ↓
changed-output / 過去failure / 影響familyを再読
        ↓
batch acceptance
        ↓
次の新規100件
```

このループを最低10巡行う。途中で重大欠陥が出ること自体はNLS v3停止理由ではない。欠陥を見つけ、共通構造として修正し、回帰で守ることがこの工程の目的である。

### 18.2 batch state

```text
DRAFT
  -> VALIDATED
  -> INITIAL_RUN_LOCKED
  -> REVIEWED
  -> CORRECTION_IN_PROGRESS
  -> CUMULATIVE_RERUN_COMPLETE
  -> ACCEPTED

DRAFT / VALIDATED
  -> REJECTED_INVALID_CORPUS

INITIAL_RUN_LOCKED以後
  -> ACCEPTED_WITHOUT_SOURCE_CHANGE
  -> またはCORRECTION_IN_PROGRESS
```

- `INITIAL_RUN_LOCKED`は新規100件に対する修正前結果を保存した状態である。
- 結果を見た後にcase本文、emotion、category、semantic contractを差し替えない。
- case自体が現行UI contract違反だった場合はそのcaseをinvalidとして残し、別IDのreplacementを追加する。
- source change後はnew RC IDを発行し、累積全件を実行する。

### 18.3 初回runで記録するもの

各新規100件について、修正前RCで次を記録する。

- execution success / exception
- v3 candidate existence
- final public bytes
- Hard Gate code
- semantic coverage
- unsupported claim
- bound Emlis reception
- section distinctness
- depth / sentence count
- v1 baseline bytes
- output duplicate / near-duplicate cluster
- opening / ending / predicate / reception act分布
- latency
- local Product QA verdict

初回runの結果は、修正後に上書きしない。修正前後を比較できるappend-only artifactにする。

### 18.4 華恋のlocal Product QA

新規100件は、華恋が入力とv3応答を全件読む。必要に応じてv1応答も比較する。

評価軸:

1. 入力の主要意味が残っている。
2. thought/actionの関係方向を誤っていない。
3. emotion/categoryを原因・人格・診断へ昇格していない。
4. unknownを勝手に埋めていない。
5. 自己否定を事実として採用・増幅していない。
6. `Emlisから`が入力固有の意味へ結び付いている。
7. `見えたこと`と`Emlisから`が同じ命題の言い換えではない。
8. 不自然な断片、同義反復、過剰引用、説明文調になっていない。
9. 同じopening / terminal / predicateへ過集中していない。
10. 入力量と意味構造にdepthが合っている。
11. 問いが必要そうな曖昧入力で、理解したふりの補完をしていない。
12. Cocolonの入力直後観測として、読まれた形になっている。

完成文一致では評価しない。

### 18.5 failure severity

| severity | 例 | 扱い |
|---|---|---|
| `BLOCKER` | public contract破壊、raw本文leak、Safety owner逸脱、relation反転、自己否定採用、原因・診断・人格断定、required meaning欠落、無応答 | source correction必須。batch acceptance不可 |
| `MAJOR` | 入力固有性不足、Emlis reception非結合、意味の一方を潰す、著しい不自然さ、同型文集中、depth不適合 | 共通構造を修正。batch acceptance不可 |
| `MINOR` | 局所的な語感、句読点、より良い順序候補 | 共通原因があれば修正。単なる好みなら理由を記録 |
| `NOTE` | 将来の問いシステム、history、UIで再確認すべき材料 | 現NLS v3のfailureと混同しない |

### 18.6 correction rule

修正はfailure caseの語句を直接判定する条件にしない。

禁止例:

```text
「仕事」と「失敗」がある場合だけ専用文を使う
case_id == nls3s_b004_0087 の場合だけ順序を変える
family == self_denial の場合だけ固定terminalを付ける
```

許可される修正は、Evidence binding、obligation discovery、relation direction、unknown preservation、discourse partition、referent resolution、lexical role、Gate、selector等の共通ownerへ行う。

各修正で、少なくとも次を説明する。

```text
failureの見え方
壊れたlayer
共通原因
修正するowner
同じ原因を持つ他case
新たに壊れる可能性
必要なnegative test
```

### 18.7 累積全件再実行

text-affecting change後は、新規100件だけでなく次を全件実行する。

```text
Karen-generated accepted batches all
+ current new batch
+ Known regression all
+ available real-user current-valid all
+ applicable legacy compatibility set
+ invalid-contract negative suite
```

machine checkは全件。華恋の本文再読は次を必須にする。

- output bytesが変わった全case
- 過去にBLOCKER / MAJORだった全case
- 修正ownerと同じcoverage family / relation / depthを持つ代表case
- duplicate clusterの代表と新規cluster
- new batch 100件全件

output bytesが不変の過去caseを毎回一から全読することを必須にしない。確認量を減らすためではなく、変更影響へ読感確認を集中しながら、machine回帰は全件維持するためである。

### 18.8 batch acceptance

一つのbatchを`ACCEPTED`にする条件:

- 有効sample 100件。
- App-Reachable validation 100 / 100。
- exact duplicate 0。
- corpus manifestとinitial resultがlock済み。
- 累積全件のexception 0。
- valid semantic corpusは、machine Hard Gate PASSまたは別Safety ownerへの正当な委譲。
- invalid-contract negative suiteは、定義された拒否結果100%。
- unresolved BLOCKER 0。
- unresolved MAJOR 0。
- case専用分岐・固定文・期待回答cue 0。
- output change review完了。
- change ledgerとrun receiptが再計算可能。

MINORは、共通構造欠陥でないと説明でき、actual deviceまたは将来問いシステムで確認するNOTEへ正しく分離された場合だけ残せる。

### 18.9 1000件到達とsaturation gate

実機確認入口は次を全て満たす。

1. Karen-generated valid samplesが1000件以上。
2. 100件×10 batch以上が`ACCEPTED`。
3. Known regression全件PASS。
4. 取得済みSupabase real-user current-valid全件PASS。
5. 累積全件のBLOCKER / MAJOR unresolved 0。
6. 最終RCで全累積caseを再実行済み。
7. 直近2つの新規100件batchの初回runで、新しいBLOCKERまたは新しい共通MAJOR構造欠陥が0。
8. output distributionに、単一opening / terminal / sentence skeletonへの新しい異常集中がない。
9. performanceがfreeze済みbudget内。
10. question-system relevance caseで勝手な補完がない。

7を満たさない場合、1000件に達していても100件単位で継続する。重大欠陥が最後に出たbatchを起点として、以後2つの連続batchで新規重大欠陥0になるまで実機確認へ進まない。

### 18.10 秘密入力を使わない理由と限界

本設計の目的は第三者認証ではなく、EmlisAIの壊れ方を大量に発見し、修正することである。華恋が入力本文を読み、応答と照合することが必要である。

したがって、次を要求しない。

- 華恋に本文を隠すこと
- 暗号化cohort
- open-once実行
- key custodian
- 外部reviewer / adjudicator
- 修正禁止の一回限り評価

この方式は「実装者が一度も見ていない入力による独立評価」を証明しない。その代わり、毎回新しい100件を作り、既存と異なる構造を要求し、修正後に全累積回帰を行い、実機でMash様の読感を確認する。Cocolonの現在の開発目的にはこの証拠の方が直接的である。

---

## 19. Runtime / Shadow / Actual Device / Owner Switch

### 19.1 dormant integrationを大量確認前に実装する

local batchで確認したbytesと実runtime接続bytesが別物にならないよう、次はStep 10で実装し、default-offで保持する。

- `emlis_ai_reply_service.py`からv3 adapterへの一方向参照
- v1 production owner維持
- v3 disabled / offline state
- byte-preserving public envelope mapper
- v1 fallback
- tester-only allowlist gate
- owner state machine
- rollback switch
- observation stage context adapter

public API、DB write path、RN表示条件は変更しない。

### 19.2 local integration / E2E

100件ごとの実機確認の代わりに、各RCで次を自動確認する。

- actual request shape相当のpayloadからv3を実行できる。
- `input_feedback.comment_text`へverified bytesがそのまま入る。
- `observation_status == passed`とnon-empty本文のcontractを守る。
- rejected / exception / fallbackをv3成功に数えない。
- DB write mock / contractで既存physical nameとkeyを変えていない。
- RN contract testでsection順、改行、表示条件が変わっていない。
- tester-only flagが一般accountへ開かない。

この自動確認は端末上の読感を代替しないが、100件ごとにMash様へ接続確認を求めずにintegration regressionを止める。

### 19.3 shadow

Section 18のsaturation gate後、frozen RCをshadowへ進める。

- public ownerはv1のまま。
- v3本文をユーザーへ表示しない。
- raw input / v3本文をpublic metaへ追加しない。
- v1 / v3のbody-free outcome、failure code、latency、fallbackだけをprivate evidenceへ残す。
- actual trafficを使う場合は既存privacy / retention / access境界を守る。

shadowのsample / duration / latency budgetはStep 1のactual baselineと現行SLAからStep 15で固定する。実traffic不足で必要sampleへ届かなければPASSではなく`MONITORING_INCOMPLETE`とする。

### 19.4 R8 rollback baseline

NLS v3 owner切替前に、R8 RR10代表4件を現行v1で実機確認し、rollback ownerの端末baselineを確定する。

これはNLS v3の1000件評価または実機20件と合算しない。R8の未完了をNLS v3で完了扱いにしない。

### 19.5 NLS v3 tester-only actual device

NLS v3の本格的な実機確認は、最低1000件とSection 18.9を満たした後に行う。100件ごとには行わない。

初期packetは代表20件とする。

選定条件:

- 14 familyを可能な範囲で覆う。
- minimal / focused / layeredを含む。
- thought only / action only / bothを含む。
- emotion単一 / 複数 / 自己理解単独を含む。
- category単一 / 複数を含む。
- short / long /口語 /曖昧 / mixedを含む。
- question-system relevanceの`possible`と`burden_risk`を含む。
- past failureと、最後の新規batchからの代表を含む。

確認対象:

- RN上の改行、欠け、modal表示、スクロール
- API / DB / Auth / submit path
- 表示速度
- Mash様が端末で読んだ自然さ・読まれた感覚
- v1と比べた商品価値
- 問いが必要そうな入力で、わかったふりをしていないか

20件でcoverage不足が判明すれば追加する。

### 19.6 実機failure時の扱い

実機でcontent quality failureが1件でも出た場合:

1. owner switchへ進まない。
2. その入力と出力を回帰caseへ追加する。
3. failure layerと共通原因を特定する。
4. 修正後、累積全件を再実行する。
5. 新規100件を追加して、既知caseだけへの適合でないことを確認する。
6. saturation gateを再度満たした後、新しいactual-device packetを作る。

RN表示だけのpresentation failureで本文bytesに影響しない場合も、public contractと責任ownerを分けて修正・再確認する。

### 19.7 owner switch

owner switch条件:

- Section 18.9 local saturation PASS
- final cumulative run PASS
- local E2E PASS
- performance PASS
- shadow PASS
- R8 RR10 v1 baseline PASS
- NLS v3 actual-device packet PASS
- public contract diff 0
- release candidate hashとruntime dependency closure一致
- Mash様のrelease authority承認

切替はstate変更だけで行い、切替時にtext-affecting codeを追加しない。

### 19.8 monitoring / rollback

rollback trigger:

- fatal semantic / safety / public contract failure 1件
- v3 no-valid-candidate率がfreeze済み上限超過
- latency / error率がbudget超過
- raw input / candidate body / question answerのpublic meta leak
- tester-only gate bypass
- Mash様が実機で再現する重大content failure

rollback後もfailure caseを回帰へ追加する。同じRCをそのまま再昇格せず、local累積ループから新RCを作る。

### 19.9 問いシステムとEmlisAI完成境界

NLS v3 owner switchは、Natural Language Surfaceの完成であり、EmlisAI全体の完成ではない。

EmlisAI全体の完成には、別工程で少なくとも次が必要である。

- 問い必要性core gate
- `pre_question_observation`
- 問い文・負担抑制
- 回答保存とoriginal inputとのsource分離
- `refined_observation`
- RN同一カード内の表示導線
- plan / subscription境界
- public meta / privacy / deletion境界
- 問いなし / 問いあり / refinedの大量local評価
- 問い導線を含む最終実機確認

NLS v3は、この後続工程でSurfaceを作り直さずに済むsource roleとstage contractを提供する。

---

## 20. 実装時のファイル責任案

これは新規・修正候補であり、設計段階の実ファイル指示ではない。実装Stepごとにactual treeと命名体系を再確認して最小化する。

### 20.1 新規module候補

```text
ai/services/ai_inference/
  emlis_ai_nls_v3_observation_stage_context.py
  emlis_ai_nls_v3_semantic_obligation.py
  emlis_ai_nls_v3_content_plan.py
  emlis_ai_nls_v3_discourse_plan.py
  emlis_ai_nls_v3_surface_ast.py
  emlis_ai_nls_v3_surface_renderer.py
  emlis_ai_nls_v3_surface_atom_parser.py
  emlis_ai_nls_v3_semantic_matcher.py
  emlis_ai_nls_v3_hard_gate.py
  emlis_ai_nls_v3_selector.py
  emlis_ai_nls_v3_runtime_adapter.py
```

分割しすぎて循環dependencyを作る場合は統合する。ただしforward renderer、Body-only Semantic Atom Parser、Independent Semantic Matcherは責任を混ぜず、rendererとparserは別module / 別coverage実装にする。

### 20.2 fixture / test / tool候補

```text
ai/tests/fixtures/emlis_nls_v3/
  generated/batch_001.jsonl
  generated/batch_002.jsonl
  ...
  known_regression/*.jsonl
  invalid_contract/*.jsonl
  manifests/*.json

ai/tests/
  test_emlis_nls_v3_*.py

ai/tools/
  emlis_nls_v3_sample_validate.py
  emlis_nls_v3_batch_run.py
  emlis_nls_v3_cumulative_regression.py
  emlis_nls_v3_output_diff.py
  emlis_nls_v3_receipt_verify.py
  emlis_nls_v3_actual_device_packet.py
```

Karen-generated sampleは個人情報を含まないことを確認した上でrepo fixture化できる。Supabase実ユーザーraw corpus、匿名化前本文、private review packetはrepo treeへ置かない。local ignored workspaceとbody-free manifestを分離する。

### 20.3 修正候補

- `emlis_ai_reply_service.py`: dormant adapter / owner state switchの最小接続。Step 17までpublic owner不変。
- public response / visible acceptance tests: contract diff 0のguard追加。
- test manifest / dependency closure helper: RC hash固定。
- RN contract test: input option /自己理解排他 / submit conditionとsample validatorの一致確認。

`emlis_ai_grounded_observation_plan.py`、public API、DB migration、RN production codeは初期v3で変更しない方針とする。実装中に変更が必要と判明した場合、影響範囲を別に提示し、v3 Surfaceだけの変更として黙って進めない。

---

## 21. 実装順序

### 21.1 全体順序

```text
Step 0   revised design / version boundary freeze
Step 1   baseline / actual input contract freeze
Step 2   sample schema / App-Reachable Validator / corpus registry
Step 3   strict artifact contract / RED negative suite
Step 4   Semantic Obligation Inventory
Step 5   Content Selection / Observation Stage Context
Step 6   Discourse Graph Planner
Step 7   Typed Surface AST / Canonical Renderer
Step 8   Body-only Parser / Independent Matcher
Step 9   Hard Gate / Selector / Recovery
Step 10  dormant runtime integration / batch runner / evidence tooling
Step 11  100件単位の累積評価ループ
  Cycle 001  new 100 / cumulative 100
  Cycle 002  new 100 / cumulative 200
  Cycle 003  new 100 / cumulative 300
  Cycle 004  new 100 / cumulative 400
  Cycle 005  new 100 / cumulative 500
  Cycle 006  new 100 / cumulative 600
  Cycle 007  new 100 / cumulative 700
  Cycle 008  new 100 / cumulative 800
  Cycle 009  new 100 / cumulative 900
  Cycle 010  new 100 / cumulative 1000
Step 14  saturation continuation / final local gate
Step 15  final RC freeze / local E2E / performance protocol
Step 16  shadow
Step 17  R8 baseline / NLS v3 tester-only actual device
Step 18  owner switch / monitoring / question-system handoff
```

Step 11の各CycleとStep 14は一方向のウォーターフォールではない。各Cycleで問題を見つけ、共通構造を修正し、累積全件を再実行する。前Cycleが`ACCEPTED`になるまで次Cycleへ進まず、進行のためにfailureを隠さない。

### Step 0. revised design / version boundary freeze

目的:

- 本改訂方針とv2停止境界を固定する。

作業:

1. 本設計書のhashを記録する。
2. NLS v3 identity、runtime state、observation stage enumを固定する。
3. v2 source / fixture / receiptのimmutable listを作る。
4. public API / DB / RN / naming / Safety非変更境界を記録する。
5. 100件×最低10巡、秘密入力不要、実機はlocal安定後という方針を実装指示へ反映する。

完了:

- design receiptと変更禁止境界がある。
- Step 1へ進むauthorityがある。

STOP:

- 本設計と実装指示が矛盾する。
- v2修正または再開が必要になる。

### Step 1. baseline / actual input contract freeze

目的:

- sourceを触る前のv1、入力contract、性能、既知回帰を固定する。

作業:

1. latest source snapshotとdependency closureを記録する。
2. v1 output / Gate / latency baselineを使用可能な既知fixtureで取得する。
3. RNのemotion / category option、自己理解排他、submit conditionを実ファイルから固定する。
4. backendがUI到達不能payloadを受理し得る境界を記録する。
5. Known regression inventoryを作る。
6. Supabase corpusは未受領でもStepを止めない。受領時の追加手順だけ固定する。

完了:

- source baseline、v1 baseline、input contract、Known regression listがある。
- 数値を実測せず発明していない。

STOP:

- snapshotが前提資料と一致しない。
- UI option / submit contractを特定できない。

### Step 2. sample schema / App-Reachable Validator / corpus registry

目的:

- サンプル作成前に、現行アプリから到達可能な入力だけを数える仕組みを作る。

作業:

1. `sample_case.v1` JSONL schemaを作る。
2. emotion / strength / category / thought-action requirementを検証するvalidatorを作る。
3. `自己理解 + 他感情`を独立REDで拒否する。
4. exact / normalized / near-duplicate checkerを作る。
5. coverage matrixとbatch manifest schemaを作る。
6. `invalid_contract`、`legacy_input`、`real_user_current_valid`を分離する。
7. sample annotationがgeneration pathへ渡らないguardを作る。

完了:

- valid / invalid fixtureのpositive / negative testがgreen。
- RN contractとの一致testがgreen。
- batch 001を作れる。

Step 2完了直後の移行作業:

1. 華恋が既知corpusとcoverage matrixを読んでbatch 001の100件を作成する。
2. validator / duplicate / novelty checkを通す。
3. batch 001 corpus manifestをfreezeする。
4. NLS v3 source完成前にEmlisAI結果を作ったことにはしない。初回実行はStep 10完了後のStep 11で行う。

STOP:

- validatorが現行UI到達不能caseをvalidにする。
- test-only annotationがruntime inputへ入る。

### Step 3. strict artifact contract / RED negative suite

目的:

- v3 artifactが不正状態を受理しないことを先に証明する。

作業:

1. observation stage / obligation / content / discourse / AST / Parsed Witness / Binding / receiptのstrict validatorを設計・実装する。
2. unknown field、invalid enum、非bool、duplicate ID、parent hash mismatchをREDから閉じる。
3. v3からv2 moduleをimportしないguardを作る。
4. generic-body retained-metadata attackをREDとして置く。
5. future stage authorityなしの`pre_question / refined`を拒否する。

完了:

- Section 15の独立negative testがowner別にgreen。
- canonical serializerが一つである。

STOP:

- builderとvalidatorが同じ自己申告fieldを信用する。
- schemaを緩めないと正常caseを作れない。

### Step 4. Semantic Obligation Inventory

目的:

- Surfaceより前に意味責任をlosslessに列挙する。

作業:

1. Evidence / Nucleus / Relation / Unknown / Safety / Reception Opportunityからobligationを作る。
2. `bound_emlis_reception`をnormal visible responseの必須責任にする。
3. required / optional、distinctness、must-not-merge、source roleを固定する。
4. source limitsからinventory upper boundを導出する。
5. stage別にunknown / supplemental answerの扱いをtestする。

完了:

- 使用可能な既知normal caseでrequired obligationが作れる。
- self-denial、relation、unknown、source-unavailableのnegative testがgreen。

STOP:

- required meaningをSurfaceで後付けする必要がある。
- original / supplemental sourceを区別できない。

### Step 5. Content Selection / Observation Stage Context

目的:

- 見つけた意味責任を、stageとdepthに応じて欠落なく選ぶ。

作業:

1. selected / integrated / blocked等のdecisionをstrict化する。
2. required obligationをbudgetで落とさない。
3. minimal / focused / layeredを意味構造から決める。
4. `normal / pre_question / refined`のstage policyを接続する。
5. pre-questionで問いだけ返す、refinedで元入力を上書きするnegative testを置く。

完了:

- required coverage 100%。
- stage別source role test green。

STOP:

- depthを満たすために同義反復が必要になる。
- pre-questionでunknown補完が必要になる。

### Step 6. Discourse Graph Planner

目的:

- 語尾差ではない意味順序・結合分割・reception位置のvariationを作る。

作業:

1. graph node / edge / must-separateを実装する。
2. structural signatureをcontent-derivedにする。
3. safe merge / split / order variationを作る。
4. case / family / batch cueを参照しない。

完了:

- eligible known caseで実質variationが出る。
- input swapでsignatureが対応して変わる。

STOP:

- 同義語候補を候補数として水増しする。
- family別固定structureが必要になる。

### Step 7. Typed Surface AST / Canonical Renderer

目的:

- 任意完成文ではなく、意味責任へ結び付く型付き構造から本文を作る。

作業:

1. closed node unionを実装する。
2. source-bound referent、relation、unknown、reception nodeを持たせる。
3. label / greeting / addressを含め、Gate後追記をなくす。
4. canonical UTF-8 rendererを作る。
5. expected sentence bankを作らない。

完了:

- AST / bytes一致test green。
- label順、空行、greeting contractを守る。

STOP:

- arbitrary text nodeが必要になる。
- Gate後の文字列修理が必要になる。

### Step 8. Body-only Parser / Independent Matcher

目的:

- 最終本文から意味を独立に復元し、source obligationへbindする。

作業:

1. rendererと別module / 別coverageでparserを作る。
2. parserはcandidate metadata、case ID、expected textを読まない。
3. Parsed Witnessをsource IDなしで作る。
4. Matcherがsource Evidence / Obligationへ一意bindする。
5. stage / source role / span / polarity / modalityを照合する。

完了:

- generic-body retained-metadata attackが落ちる。
- source swap、relation reversal、refined source swapが落ちる。

STOP:

- candidate metadataを読まないとcoverageを判定できない。

### Step 9. Hard Gate / Selector / Recovery

目的:

- 必須意味を保持した候補だけを選び、failure時も入力を捨てない。

作業:

1. Section 13のGateを独立実装する。
2. lexicographic selectorを実装する。
3. candidate permutation不変をtestする。
4. same-discourse safer AST、safe split、minimal required-complete recoveryを実装する。
5. v1 fallbackをv3 successへ数えない。

完了:

- Gate別negative test green。
- no-valid-candidateがcase failureとして残る。

STOP:

- required obligation削除でしか通らない。
- weighted scoreでhard failureを救う。

### Step 10. dormant runtime integration / batch runner / evidence tooling

目的:

- local大量確認と将来runtimeが同じbytesを通る状態にする。

作業:

1. disabled v3 adapterを`emlis_ai_reply_service.py`へ一方向接続する。
2. public ownerをv1のまま保持する。
3. batch runner、cumulative runner、output diff、receipt generatorを作る。
4. local body-full packetとbody-free summaryを分離する。
5. tester-only / shadow / rollback state machineを実装する。
6. local E2EとRN contractを追加する。

完了:

- default production path diff 0。
- fixture入力から実runtime adapter経由でv3 bytesを取得できる。
- private bodyとpublic/body-free artifactが分離される。

STOP:

- v3を有効化しないとrunnerが動かない。
- public API / DB / RN変更が必要になる。

### Step 11. 100件単位の累積評価ループ

#### Cycle 001. new 100 / cumulative 100

目的:

- 最初の100件で、設計と実装の壊れ方を広く確認する。

作業:

1. Step 2直後に作成・freezeしたbatch 001のmanifestとvalidator結果を再検証する。
2. 実装結果を見てcase本文・emotion・category・semantic contractを作り直さない。
3. 修正前RCで100件を初回実行・lockする。
4. 華恋が100件全入力・全応答を読む。
5. BLOCKER / MAJORを共通構造として修正する。
6. Known regression + batch 001全件を再実行する。
7. changed-outputを再読する。

完了:

- batch 001 ACCEPTED。
- unresolved BLOCKER / MAJOR 0。
- change ledgerがある。

STOP:

- case専用分岐・固定文でしか直せない。
- validator違反sampleを件数へ数える。

#### Cycle 002〜005

```text
Cycle 002  new 100 / cumulative 200
Cycle 003  new 100 / cumulative 300
Cycle 004  new 100 / cumulative 400
Cycle 005  new 100 / cumulative 500
```

目的:

- 既存sampleと異なる入力を追加し、修正・回帰ループを安定させる。

各CycleでCycle 001と同じ流れを行い、前Cycleが`ACCEPTED`になるまで次Cycleへ進まない。

追加条件:

- 直前までのcoverage gapを埋める。
- 直前修正の境界caseを含める。
- emotion/category/length/relation/question relevance分布を更新する。
- 各修正後、累積全件を再実行する。

完了:

- batch 001〜005 ACCEPTED。
- Karen-generated valid 500件。
- Known regression全件PASS。

STOP:

- 新規caseが既存の言い換え中心になる。
- full cumulative rerunを省略する。

#### Cycle 006〜010

```text
Cycle 006  new 100 / cumulative 600
Cycle 007  new 100 / cumulative 700
Cycle 008  new 100 / cumulative 800
Cycle 009  new 100 / cumulative 900
Cycle 010  new 100 / cumulative 1000
```

目的:

- 最低1000件まで入力空間を広げ、後半で新規重大欠陥が収束するか確認する。

各CycleでCycle 001と同じ流れを行い、前Cycleが`ACCEPTED`になるまで次Cycleへ進まない。

追加条件:

- long / fragment / mixed / self-insight / multi-emotion / multi-categoryを十分に含める。
- question-system relevanceのpossible / burden-riskを増やす。
- Supabase corpus受領済みなら、各RCで追加全件回帰する。
- Cycle 009 / 010の初回runで新規重大欠陥の有無を明示する。

完了:

- batch 001〜010 ACCEPTED。
- Karen-generated valid 1000件。
- cumulative machine / local review条件PASS。

次:

- Section 18.9を満たせばStep 14のfinal local gateへ。
- 満たさなければCycle 011以降を100件単位で継続。

### Step 14. saturation continuation / final local gate

目的:

- 1000という件数ではなく、重大欠陥の収束を確認する。

作業:

1. 直近2 batchの初回runを確認する。
2. 新規BLOCKER / 新規共通MAJORがあれば、新しい100件batchを追加する。
3. 最後の重大欠陥後、連続2 batchで新規重大欠陥0になるまで継続する。
4. final candidateで累積全件を新run IDで実行する。
5. duplicate / distribution / latency / fallback / failureを再集計する。

完了:

- Section 18.9全条件PASS。
- final local evidenceが再計算可能。

STOP:

- 共通構造として直せず、case cueだけが解決手段になる。
- 100件を増やしても同じ重大欠陥が修正後に再発し続ける。

### Step 15. final RC freeze / local E2E / performance protocol

目的:

- shadowと実機へ渡すexact bytesとprotocolを固定する。

作業:

1. source / dependency / config / schema / test / runner / rubricをRC manifestへ束ねる。
2. final cumulative runを再確認する。
3. actual request shape local E2Eを実行する。
4. RN contract、DB write mock、fallback、tester-only gateを確認する。
5. v1 baselineからlatency budgetとshadow protocolを固定する。
6. actual-device代表20件の選定規則を固定する。本文は秘密にしない。

完了:

- RC manifest、performance protocol、actual-device packet manifestがある。
- text-affecting artifact hashが固定される。

STOP:

- freeze後にsource修正が必要。Step 11へ戻り新RCにする。

### Step 16. shadow

目的:

- production ownerを変えず、actual traffic条件でfailure / latencyを確認する。

作業:

1. v1をpublic ownerのまま維持する。
2. frozen RCをshadowで実行する。
3. body-free metricsとprivate evidenceを収集する。
4. sample / duration / error / latency条件を判定する。

完了:

- shadow protocol PASS。
- public body leak 0。

STOP:

- latency / error / semantic fatalがthreshold超過。
- privacy境界を守れない。

### Step 17. R8 baseline / NLS v3 tester-only actual device

目的:

- rollback ownerとNLS v3の端末上の商品品質を別々に確認する。

作業:

1. R8 RR10代表4件を現行v1で実機確認する。
2. frozen RCをtester-onlyへ切り替える。
3. NLS v3代表20件を実機で確認する。
4. RN表示、API/DB接続、速度、Mash様の読感を記録する。

完了:

- R8 baseline PASS。
- NLS v3 actual-device packet PASS。
- public contract diff 0。

STOP / return:

- content failureはStep 11へ戻る。
- presentation / integration failureはownerを切り分け、修正後に該当gateを再実行する。

### Step 18. owner switch / monitoring / question-system handoff

目的:

- v3をproduction ownerへ切り替え、rollback可能に監視し、問いシステムへ接続材料を渡す。

作業:

1. Mash様のrelease承認を記録する。
2. state変更だけでv3 ownerへ切り替える。
3. monitoring windowを実行する。
4. rollback triggerを監視する。
5. question-system relevance annotation、unknown failure、pre-question候補をbody-free handoffへまとめる。
6. NLS v3完成とEmlisAI全体未完成を資料へ明記する。

完了:

- owner switch / monitoring PASS。
- v1 rollbackが有効。
- question-system handoffがある。

STOP / rollback:

- Section 19.8のいずれか。
- rollback後はlocal累積ループから新RCを作る。

---

## 22. 完了判定と停止判定

### 22.1 「実装済み」と呼べる単位

各Stepは次を全て持って初めて完了とする。

- 実owner
- strict contract
- positive test
- 独立negative test
- case別またはartifact別receipt
- parent / source hash
- completion condition
- next-step authority

ファイルが存在する、正常caseが生成できる、pytestがgreenというだけでは完了にしない。

### 22.2 通常のsample failureはSTOPではない

新規100件で意味欠落、不自然さ、定型化が見つかることは、反復工程の入力である。次の条件を満たす限り、failureを隠さず修正・全件回帰へ進む。

- 共通構造の原因を説明できる。
- case専用cueを使わない。
- public / Safety / privacy contractを壊さない。
- 累積全件再実行が可能。

### 22.3 batch reject

次はそのbatchを拒否し、valid 100件へ数えない。

- App-Reachable contract違反
- duplicate / near duplicate中心
- semantic contractが本文と一致しない
- 個人情報または実ユーザー文の無断コピー
- expected final textを含む
- coverage manifestを作れない

### 22.4 RC invalidation

次は同じNLS v3内でRCを無効にし、Step 11へ戻る。

- final local gate後のtext-affecting change
- shadowまたは実機でcontent failure
- dependency / config / catalog drift
- cumulative rerun不足
- actual-device packetへ渡したbytesとsource closure不一致

### 22.5 NLS v3即時STOP /方式再判断

- v2 source /停止artifactの変更またはimportが必要になった
- public API / DB / RN / naming / Safety ownerをSurface修正として黙って変える必要がある
- Semantic Obligationがfinal bodyまで追跡できない
- generic body + metadata attackを止められない
- required meaningを削るrecoveryが必要
- case / family /語句専用分岐または完成文bankが必要
- original inputとquestion answer sourceを分離できない
- raw user input / candidate body / question answerがpublic metaへ漏れる
- model-free controlled grammarでは共通構造として解消できない同一重大欠陥が、修正と新規batch後も反復する
- 外部model導入が必要だがMash様の判断がない

停止時は、進捗を作るための周辺資料・追加caseを無制限に増やさない。何が不足し、どの方式判断が必要かを明示する。

### 22.6 STOP後の扱い

- runtime ownerはv1のまま、または即v1へrollbackする。
- v3 artifact、failure case、receipt、change ledgerを停止済み履歴として保持する。
- raw実ユーザー本文はprivacy / deletion方針に従い、履歴保持を自動で正当化しない。
- 将来versionはbody-free failure code、aggregate、共通構造上の結論、使用許可された回帰caseだけを参照する。
- model-free方式の限界なら、外部modelを勝手に追加せずMash様と再判断する。

---

## 23. JSON / Schema実ファイル化の判断

本設計ではSchema案を文書内に置く。実装Step 2 / 3でactual treeと既存dependencyを確認して決める。

### 案A: Python strict dataclass + runtime validator

適する条件:

- artifactがprocess内だけで完結する。
- serializationがreceipt / test用に限定される。
- node typeごとのclosed unionをPythonで安全に表せる。

必須条件:

- type hintだけで済ませない。
- unknown field、非bool、enum外、parent hash、相互参照をruntimeで拒否する。
- canonical serializerを一つにする。

### 案B: JSON Schema / JSONL + Python runtime validator

適する条件:

- 100件batch、manifest、case result、review decision、actual-device packetをprocess間で交換する。
- schema hashをRC manifestへ独立固定する。
- nested emotion / category / annotationをlosslessに保持する。

必須条件:

- `additionalProperties: false`
- node typeごとの`oneOf`
- Schema外の相互参照validator
- canonical JSONとschema version migration禁止
- JSONLの1行1case、LF、UTF-8、安定key order

### 華恋の推奨

process内のobligation / content / discourse / ASTは案A、sample corpus / batch manifest / case result / receiptは案Bが適している。Schema libraryを増やすためだけの新dependency追加は避ける。

候補schema ID:

```text
cocolon.emlis.nls_v3.observation_stage_context.v1
cocolon.emlis.nls_v3.semantic_obligation_ledger.v1
cocolon.emlis.nls_v3.content_selection_plan.v1
cocolon.emlis.nls_v3.discourse_plan.v1
cocolon.emlis.nls_v3.surface_ast.v1
cocolon.emlis.nls_v3.parsed_surface_witness.v1
cocolon.emlis.nls_v3.verified_surface_binding.v1
cocolon.emlis.nls_v3.sample_case.v1
cocolon.emlis.nls_v3.sample_batch_manifest.v1
cocolon.emlis.nls_v3.sample_validation_result.v1
cocolon.emlis.nls_v3.case_evidence_receipt.v2
cocolon.emlis.nls_v3.local_product_review.v1
cocolon.emlis.nls_v3.change_ledger_row.v1
cocolon.emlis.nls_v3.cumulative_run_manifest.v1
cocolon.emlis.nls_v3.actual_device_packet.v1
cocolon.emlis.nls_v3.runtime_validation_protocol.v1
```

実ユーザーraw corpus用schemaは共有artifactのID一覧へ含めない。private local path、access、retention、deletionを別に管理する。

---

## 24. Mash様側に必要な作業

大量sample作成、local実行、応答確認、修正、累積回帰は華恋が行う。Mash様へ100件ごとの実機確認、外部人員の確保、鍵管理を要求しない。

### 実装・local評価中

原則としてMash様側の作業はない。

Supabaseの過去入力を利用する段階で、可能なときに必要列だけのUTF-8 CSVを渡していただく。CSVが未取得でも、NLS v3設計・validator・Karen-generated 100件batchを止めない。

実ユーザーデータについて、利用不可、削除対象、匿名化上の注意がある場合は、その明示条件を最優先する。

### local安定後のactual device

- R8 RR10代表4件の現行v1 baseline確認。
- NLS v3代表20件のtester-only実機確認。
- RN表示、速度、読感、v1比較の判断。

Mash様が全1000件を実機で確認する必要はない。華恋側の大量確認を前提に、実機でしか分からない表示・接続・端末読感へ作業を限定する。

### release時

- owner switchのrelease authority判断。
- rollback後の再昇格可否判断。

### 問いシステム時

NLS v3とは別工程で、問いの負担、仮観測、問い回答後のrefined observation、plan差、RN導線を実機確認する。これはEmlisAI全体完成の最終境界である。

---

## 25. リスクと設計上の限界

### 25.1 controlled grammarの上限

Typed ASTとBody-only Parserは、metadataだけ正しく本文が汎用でも通る欠陥を止める。一方、制御文法そのものが狭く、別の形のtemplate臭を生む可能性は残る。

machine coverage PASSを商品自然さPASSへ読み替えない。華恋の全新規case reviewとMash様のactual-device読感で確認する。大量反復後も自然さへ届かなければ、Gateを弱めたり語句bankを増やして延命せず、model-free方式を再判断する。

### 25.2 1000件の意味

1000件は母集団一般化の統計証明ではない。固定少数fixtureより広い壊れ方を発見し、修正後の回帰を積み上げる最低線である。1000件到達だけで終了せず、直近2 batchの新規重大欠陥0を追加条件にする。

### 25.3 華恋作成sampleの偏り

華恋が作るsampleには語彙、文章の整い方、題材の選び方の偏りが残り得る。

対策:

- 既存全corpusとcoverage gapを見て新規100件を作る。
- surface shape、誤字、口語、断片、矛盾、長文、topic混在を意図的に含める。
- Supabase実ユーザー入力を追加回帰する。
- 必要なら他AIを入力発生源として追加する。
- output distributionだけでなくinput distributionもreceipt化する。

### 25.4 manual review fatigue

1000件と累積再実行を毎回全文再読すると、見落としが増える。

対策:

- 新規100件は全件読む。
- machine checkは累積全件。
- 修正後はchanged-output、過去failure、影響familyを全件読む。
- unchanged bytesを毎回同じ密度で再読する代わりに、hashとmachine resultで守る。
- review reason codeを固定し、自由文だけで判定しない。

### 25.5 実ユーザーデータ

実ユーザー入力は最も価値のある回帰材料だが、privacy、利用目的、legacy payload、個人情報の問題がある。raw corpusをrepoやpublic artifactへ置かない。取得できない場合も勝手に存在を仮定しない。

### 25.6 performance

候補上限12、inverse parser、Hard Gateはv1より計算量が増える可能性がある。source実測なしに「十分速い」と断定しない。Step 1 baseline、各batch latency、Step 15 final RC、Step 16 shadowで拘束する。

### 25.7 Safetyと通常応答

Hard Gateを強化するとno valid candidateが増える危険がある。required obligationを落とさないbounded recoveryとv1 fallbackを分ける。v1 fallbackはユーザー可用性を守るruntime機構であり、v3品質成功の計上には使わない。

### 25.8 問いシステム未実装

NLS v3だけでは、足りない情報を実際にユーザーへ尋ね、回答後に観測を深める体験は完成しない。NLS v3が問いを勝手に発明して先取りしない一方、future stage contractを形だけにせず、問いシステム工程で実際に接続・大量評価・実機確認する必要がある。

---

## 26. Cocolon思想との接続

確認済み:

- Cocolonはユーザー入力を文字列として処理するだけでなく、言葉へ情報が箱詰めされた工程を観測し、ユーザーの辞書へ近づくことを中核にしている。
- EmlisAIは一般回答者ではなく、入力直後の観測返答として「読まれた形」を返すownerである。
- 自然な返答は綺麗な文だけではなく、ユーザーが読まれたと感じられる構造である。
- 問いシステムは、読めていないことを読めたふりで埋めず、必要な一点を確認して回答分だけ観測を深める中核品質境界である。

未確認:

- v3のmodel-free typed grammarだけで、その商品体験へ届くかは未証明である。
- 最低1000件の反復で、実ユーザー入力の十分な多様性まで覆えるかは未証明である。

Cocolon思想との関係:

- Semantic Obligationは、入力の複数意味をSurfaceの都合で一つへ潰さないための責任である。
- bound Emlis receptionは、一般的な共感を足すのではなく、Emlisが入力のどの意味へ向き合ったかを明らかにする。
- Parsed Surface WitnessとVerified Surface Bindingは、内部metadataが理解したように見えるだけで、ユーザーが見る本文から意味が消えることを止める。
- 100件単位の累積ループは、少数の都合のよい入力で「動いているように見える」状態を完了にしない。
- App-Reachable Validatorは、実際のユーザーが作れない入力で商品品質を評価したことにしない。
- 問いシステムstage境界は、分からないことを勝手に埋めず、将来の仮観測・問い・refined observationへ接続する。

華恋の意見:

v3で最優先にするのは文章の長さや語彙数ではない。

1. Emlisの受け取りを入力固有の意味へ必ず結び付けること。
2. 最終本文から、その意味が本当に残っているかを別ownerが再証明すること。
3. 多様な新規入力を実際に流し、問題発見・共通修正・全件回帰を積み重ねること。
4. 実ファイル上の入力contractを守り、存在しない利用状態で評価しないこと。
5. 読めない部分を補完せず、問いシステムへ渡せる境界を守ること。

この五点を守れば、v2で起きた「意味を落とす→Gateが見逃す→集計だけgreenにする」という連鎖だけでなく、「固定caseだけ直す→別入力で壊れる」という問題も減らせる。一方、1000件以上を回しても読感が薄いなら、語句を継ぎ足して延命すべきではない。そこがmodel-free方式を再判断する境界である。

---

## 27. 実装開始チェックリスト

- [ ] `Cocolon_前提資料(337).zip`のhashが一致する。
- [ ] 最新source snapshotがStep 1 baselineと一致する。
- [ ] v1 production ownerが変わっていない。
- [ ] v2 module / fixture / receiptのimmutable hashが固定されている。
- [ ] R8 statusとv2 / v3 statusを混同していない。
- [ ] public API / DB / RN / naming / Safety contractがfreezeされている。
- [ ] 現行emotion / category optionを実ファイルから確認している。
- [ ] 自己理解単独選択をsample validatorが強制する。
- [ ] thought/action、emotion、categoryのsubmit conditionをvalidatorが強制する。
- [ ] invalid / legacy / current-valid corpusを分離する。
- [ ] Schema / validatorのnegative testから開始する。
- [ ] v3からv2 importがない。
- [ ] Observation Stage Contextがfirst-class artifactである。
- [ ] 問い要否をNLS v3が自己決定しない。
- [ ] bound Emlis receptionがfirst-class obligationである。
- [ ] candidate coverage自己申告をGateへ渡さない。
- [ ] rendererとBody-only Parserのcoverage実装が独立し、Independent Matcherがcandidate metadataを読まない。
- [ ] generic-body retained-metadata attackがrelease blockingである。
- [ ] 100件batch schema、manifest、novelty checkがある。
- [ ] Karen-generated valid 1000件を最低線にする。
- [ ] text-affecting changeごとに累積全件を再実行する。
- [ ] 新規100件は華恋が入力と応答を全件確認する。
- [ ] case / family /固有語専用分岐を禁止する。
- [ ] 直近2 batchの初回run重大欠陥0を実機入口にする。
- [ ] 100件ごとのMash様実機確認を要求しない。
- [ ] dormant runtime integrationをlocal大量評価へ含める。
- [ ] owner切替前にR8 v1 baselineとNLS v3代表20件を別証拠で確認する。
- [ ] Supabase raw corpusをrepo / public artifactへ置かない。
- [ ] v1 rollback ownerを残す。
- [ ] NLS v3完成とEmlisAI全体完成を分離する。

---

## 28. 次に実行すべきこと

本設計改訂を正本として採用した後、次はStep 0とStep 1を行う。

その後、サンプル本文を作り始める前にStep 2のApp-Reachable Input Validator、sample schema、coverage matrixを実装する。自己理解排他を含む現行UI contractを機械的に通せない状態で、100件作成へ進まない。

Step 2完了直後、華恋がbatch 001の100件を作成・validation・freezeする。Step 3〜10でNLS v3 coreとrunnerを実装し、Step 11でfreeze済みbatch 001を初回実行する。実装結果を見てbatch 001を都合よく作り直さない。

Supabase CSVは追加回帰材料として受領時に取り込み、未受領を理由にStep 0〜batch 001を止めない。

この設計書の修正だけではNLS v3実装開始、sample 100件作成、source変更を完了扱いにしない。次の実装指示でStep単位に進める。

---

## 29. この設計で変更していないもの

- 現行NLS v2の全source / test / fixture / receipt
- v2停止履歴と既知cohort本文
- v1 production owner
- R8 source / readiness / actual-device status
- public API / DB / RN / naming / Safety owner
- account / subscription / access / deletion contract
- Cocolon前提資料
- 実装用JSON / Schema実ファイル
- runtime config
- 問いシステムのAPI / DB / RN /課金仕様

本成果物はこのMarkdown設計書1ファイルだけである。
