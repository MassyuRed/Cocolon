---
doc_id: cocolon_cycle001_post_g2_system_architecture_reusability_audit_20260814
title: "Cycle001 G2後システム全体構造・過剰化境界・再活用可能性監査"
created_at: "2026-08-14 JST"
repository: "MassyuRed/Cocolon"
related_repository: "MassyuRed/mashos-api"
preimage_cocolon_head: "c22469ec50a6141d11c680da8dc01611d05adb4a"
record_class: "INTENDED_SCOPE_CORRECTION_AND_REUSE_ASSESSMENT"
normative_status: "AUDIT_AND_DESIGN_PROPOSAL_NON_NORMATIVE"
decision_owner: "Mash"
operation_owner: "Karen"
automatic_progression: false
production_effect: 0
source_test_runtime_effect: 0
supersedes_scope_interpretation_of:
  - "Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_安全装置全履歴_20260701_20260813.md"
---

# Cycle001 G2後システム全体構造・過剰化境界・再活用可能性監査

## 0. 結論

### 0.1 前回資料は、Mashが指していた対象を完全には捉えていなかった

前回の

```text
Cocolon_前提資料/audits/emlis_ai/
Cocolon_EmlisAI_安全装置全履歴_20260701_20260813.md
```

は、2026年7月1日から8月13日までのCocolon / mashos-api全コミットを期間で列挙し、privacy、human provenance、Gate、authority、runtime identity、publication、Inspector等を安全・統制機能として分類した資料である。

したがって、単にファイル名や本文へ`安全`という語を検索しただけではない。期間内のGitHub履歴を全区間取得し、主要commit、source、test、Receipt、Handoff、current ownerを調べている。

しかし、分類軸が「安全効果を持つ系列」だったため、Mashが実際に指していた次の対象を、一つのsystem architectureとして復元できていなかった。

```text
Cycle001 G1 / G2後
  -> G3 failure localization
  -> G4 causal RED freeze
  -> G5 bounded implementation / machine GREEN
  -> G6 human Product Read
  -> reject時のG3再局所化
  -> G4-B runtime readiness detour
  -> checker / comparator / controller / FD proof / authority chain
  -> 8月13日のdetour stop
  -> G4-C / G5 / G6 / G8 / G9 / G10
```

前回資料には上記の部品は多く含まれていたが、次が不足していた。

1. G2後の正式routeを起点とした依存構造。
2. 本来のProduct Quality Systemと、後から増殖したControl Planeの分離。
3. G3〜G6で実際に成立した価値の抽出。
4. G6 REJECT後、どこから過剰化したかの境界。
5. EmlisAI構造・分析構造・Piece構造・問いシステムへの転用表。
6. 残すcode / 残す思想 / offline化する装置 / 廃止する運用の切り分け。
7. Cocolonの新しい共通品質基盤として再設計する案。

よって、前回資料は**期間全体の広域インベントリとしては有効**だが、Mashが求めた「G2後に作り続けたシステムの全貌」としては**不十分**だった。

### 0.2 廃止すべきなのは全体ではない

G2後に形成されたものは、一つの安全装置ではない。実体は次の二層である。

```text
A. Product Quality Intelligence Core
   商品出力の失敗を観測し、原因を構造へ局所化し、因果testを作り、
   修正後にmachineとhumanの両方で再判定する基盤。

B. Reproducibility / Governance Control Plane
   source、runtime、manifest、environment、authority、publication、
   execution identityを証明し、実行前後を止める統制基盤。
```

AはCocolonへ高い再利用価値がある。  
Bは一部をrelease前benchmarkまたはforensic用途へ縮小転用できるが、日常のEmlisAI改善経路へ戻してはならない。

結論は次である。

```text
WHOLE_SYSTEM_DELETE = NO
WHOLE_SYSTEM_REACTIVATE_AS_GATE = NO
PRODUCT_QUALITY_CORE_EXTRACT_AND_REUSE = YES
SEMANTIC_GRAPH_AND_SURFACE_COMPILER_REUSE = HIGH
QUESTION_SYSTEM_REUSE = HIGH
ANALYSIS_REUSE = HIGH
PIECE_REUSE = HIGH
RUNTIME_CONTROL_PLANE_DAILY_USE = NO
RUNTIME_CONTROL_PLANE_OPTIONAL_BENCHMARK_USE = CONDITIONAL
AUTHORITY_RECEIPT_CHAIN_REUSE_AS_PRODUCT_FEATURE = NO
```

---

# 1. 正しい対象範囲

## 1.1 Original G0〜G10 route

`NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md`のoriginal routeは次である。

```text
G0  READ-ONLY PLAN / SOURCE IDENTITY FREEZE
 |
G1  CANONICAL STEP 0–10 HISTORICAL READINESS RECONCILIATION
 |
G2  BATCH001 PROVENANCE + INITIAL EXACT100 PROCESS-CONFORMANCE AUDIT
 |
G3  CURRENT B6 FAILURE LOCALIZATION / REMEDIATION DESIGN READ-ONLY
 |
G4  B6 REMEDIATION DESIGN FREEZE RED-ONLY
 |
G5  B6 REMEDIATION IMPLEMENTATION / GREEN-ONLY
 |
G6  B6 REPRESENTATIVE PRODUCT READ RECHECK
 |    `- B/M -> RETURN_TO_G3; NLS_V3_METHOD_STOP_FALSE
 |
G7  POST-INITIAL-RUN RC0031 CORRECTIVE LANE
 |    |- P3 inverse / Parser / Matcher
 |    |- P4 / P5 / E2
 |    |- E3 representative8
 |    `- E4 frozen100
 |
G8  FINAL CURRENT-RC CUMULATIVE MACHINE RERUN
 |
G9  MANDATORY HUMAN PRODUCT QA / REREAD
 |    `- B/M -> common correction owner; text change -> new RC -> G8
 |
G10 DETAILED DESIGN §18.8 BATCH ACCEPTANCE RECOMPUTATION
```

このroute自体は安全装置ではない。

本来は、次の一連の商品品質改善systemである。

```text
品質不合格を読む
  -> 共通原因を探す
  -> 原因だけを失敗させるtestを固定する
  -> 最小実装する
  -> machine contractを通す
  -> 人間が実際の言葉を読む
  -> 不合格なら共通原因へ戻す
  -> 最終的に100件を再生成・全読・acceptance再計算する
```

Mashが「G2までは終わり、G3から作り続けていた」と指している対象は、このG3以後の全routeと、そのrouteへ後から接続された補助基盤である。

## 1.2 今回の監査対象

今回の対象は次のexact3である。

1. **G3〜G10 Product Quality route本体**
2. **G6 REJECT後のshared structural correction再iteration**
3. **そのG4に挿入され、肥大化したruntime / authority / publication control plane**

7月全体のprivacy mechanismや、G2以前のhistorical recoveryを主対象にはしない。ただし、G3以後が実際に再利用したものはdependencyとして扱う。

---

# 2. G2後システムの全体構造

## 2.1 Layer 1 — Semantic Evidence and Authority Model

G3以後のsystemは、入力と出力を単なる文字列として扱っていない。少なくとも次をtyped materialとして保持する。

```text
source evidence
semantic atom
semantic family
owner
owner role
owner kind
relation
semantic link
explicit unknown
construction modifier
head / root
finite predicate
modality
polarity
temporal scope
referent scope
Reception focus
Reception target
Reception support
Reception act
surface realization plan
candidate identity
```

この層の役割は「危険な出力を止める」だけではない。

本質は、Cocolonが人間の入力から見つけた意味を、生成前に構造化し、どの意味がどの文へ現れたか追跡できるようにすることである。

再利用価値:

```text
EmlisAI = 即時観測の意味構造
問い = 不足・曖昧・未確定slotの構造
分析 = 時間をまたいだ意味構造の集積
Piece = 意味構造を表現へ変換する創作骨格
```

## 2.2 Layer 2 — Plan-Owned Surface Realization

G3が局所化したbroken layerは、Natural Surface final serializerだった。

初回G3で確認されたcommon causeは、structured root / owner-role / Reception authorityが、atom-localなpeer explanatory clausesとlate-spliced textへ平坦化されていたことである。

G6 REJECT後の二回目G3では、さらに正確に次へ局所化された。

```text
FINAL_B6_PLAN_OWNED_INTEGRATED_NATURAL_LANGUAGE_SURFACE_REALIZATION
```

共通原因:

```text
accepted typed plan / authority is consumed as validation, counting, and order
metadata, but is not the sole grammatical owner of the visible surface;
already-completed base prose and generic peer-clause / Reception frames remain
the actual serializer owners.
```

これは、Cocolon全体へ転用できる重要な知見である。

```text
意味構造を作っても、最終文章をgeneric rendererや後付けspliceが所有すれば、
構造は本文へ正しく現れない。
```

したがって必要なのはSafety Gateの増設ではなく、**planを最終文章の唯一の構造ownerにするcompiler**である。

## 2.3 Layer 3 — Causal Failure Localization

G3は、Product Readの不合格を単なるscoreとして扱わず、次へ変換した。

```text
failure aggregate
  -> broken layer
  -> common structural cause
  -> production owner
  -> bounded change window
  -> regression risk
  -> future causal RED
  -> human Product Read acceptance gate
```

初回G3のcausal REDは次だった。

```text
REACHABLE_DIMENSION_EQUIVALENCE_LOCUS_NOT_PROVED
HEAD_DOMINANT_TYPED_ATTACHMENT_NOT_PROVED
```

二回目G3では、初回G3/G4/G5/G6をcrosswalkし、machine proofがproduct causalityを証明していなかった理由をexact3へ分けた。

```text
PRIOR_G3_RED_SPEC_VALID_MUTATION_DOMAIN_GAP
G4_BASE_FINAL_BODY_LATE_SPLICE_AND_POSITIVE_REALIZATION_ORACLE_IMPLEMENTATION_GAP
G5_LEGACY_RENDERER_SELECTION_AND_VALIDATION_GUARD_SUBSTITUTION
```

このfailure-localization形式は、EmlisAIだけでなく、分析レポート、Piece、問いの品質改善へそのまま使える。

## 2.4 Layer 4 — Causal RED / GREEN Harness

G4は、修正前にfuture behaviorを因果testとして固定した。

初回はordered exact24を固定し、次を成立させた。

```text
before G5 = 22 PASS / 2 causal RED
production change = 0
```

G5後はsame ordered exact24が次になった。

```text
24 PASS / 0 FAIL / 0 ERROR
```

この発想自体は価値が高い。

価値:

- 修正前に「何を直したら成功か」を固定する。
- case IDやexpected final textではなく、構造behaviorを検査する。
-同じdenominatorでRED→GREENを見る。
- production変更とtest変更を分離する。

問題:

- 初回G4は、positive realizationではなく「参照した／例外を出した」proxyをGREENとして数えた。
- headの位置やseparator countを、文法的主従関係の代用にした。
- stale-tail testが`base_candidate.final_utf8_bytes`のlate spliceを除外できなかった。
- machine GREENは成立したが、G6 human Product Readは不合格だった。

したがって、再利用時は**positive realization oracle**へ改良する必要がある。

## 2.5 Layer 5 — Human Product Read Engine

G6は、G5 machine GREENを商品合格へ変換しなかった。

actual exact10を同じproduction blobから生成し、12軸を二passで読んだ結果は次だった。

```text
candidate PASS / MINOR / MAJOR / BLOCKER = 0 / 2 / 8 / 0
unique   PASS / MINOR / MAJOR / BLOCKER = 0 / 2 / 6 / 0
former-MAJOR cases PASS-or-MINOR = 0 / 5
former-MAJOR contexts PASS-or-MINOR = 0 / 7
controls not worse = 1 / 3
new MAJOR control = 1
semantic / safety preservation = preserved
```

この分離は極めて価値がある。

```text
machine contract = 構造が壊れていないか
Product Read = 人間の言葉として良いか
```

再利用すべきなのは、authority chainではなくこの評価思想と12軸・reason family・comparison modelである。

## 2.6 Layer 6 — Batch Evaluation and Evidence Envelope

G8 / G9 / G10では、最終的に次を行った。

- exact100 machine rerun。
- private body / body-free summary分離。
- source closure。
- case manifest。
- selected / no-valid / fail-closeの排他。
- HMACによるprivate / public対応。
- 100 input / output全読。
- severity / failed axes / reason / shared cause付与。
- acceptance exact14再計算。

8月13日の結果:

```text
SELECTED / NO_VALID / FAIL_CLOSE = 45 / 2 / 53
OUTPUT PRESENT / MISSING = 52 / 48
PASS / MINOR / MAJOR / BLOCKER = 0 / 2 / 40 / 58
G10 = TTTFFFTFFTTTFF
CYCLE001 = NOT_ACCEPTED
```

このLayerは、Cocolonの品質測定基盤として再利用価値がある。

ただし、日常の一回答生成でHMACやfull source closureを毎回要求する必要はない。batch評価、release候補比較、障害調査へ限定する。

## 2.7 Layer 7 — Reproducibility Control Plane

G6 REJECT後、本来は二回目G3で局所化したproduct causeをG4 causal REDへ変えるはずだった。

しかし、G4前に次が問題化した。

```text
full-root cache manifest drift
runtime identity invalid
installed file manifest mismatch
comparator identity mismatch
fresh runtime readiness
materialization provenance
owner / independent derivation
interpreter / dependency / wheel identity
```

その結果、次が連鎖した。

```text
Gate A runtime identity
Gate B recovery
installed manifest canonical owner
comparator V1 / V2
fresh rematerialization
fresh readiness
Direct Native Process
GitHub-tracked runtime admission checker
runtime preparation controller exact7
one-shot acquisition policy
FD9 inherited descriptor proof
credential drop
execve
cwd / DAC / descriptor / source identity proof
```

このLayerが、Mashが「G3からずっと作り続けていた」と感じた主な過剰部分である。

## 2.8 Layer 8 — Governance / Publication Control Plane

さらに各技術stepへ次が付随した。

```text
candidate authority
approval body
bytes / LF / SHA-256
activation
admission
consumption
STOP
Result
Receipt
Handoff
Plan append
07 append
08 update
postverification
retirement / noncredit classification
```

これらは誤実行や成果消失を防ぐ意図を持っていたが、日常の品質修正では重複が大きかった。

---

# 3. どこまでが価値で、どこからが過剰だったか

## 3.1 価値がある本体

次は保持・抽出対象である。

| 機能 | 再利用価値 | 理由 |
|---|---|---|
| typed semantic evidence graph | 最重要 | 三大中核構造と問いが共有できる |
| source anchor / lineage | 最重要 | 人の言葉を機械の推測へ置換しない |
| owner / relation / dimension / unknown model | 高 | 文章・問い・分析・Pieceの構造骨格になる |
| Reception focus authority | 高 | Emlisらしい受け取りを構造から作れる |
| plan-owned surface compiler思想 | 最重要 | 構造と実際の日本語を一致させる |
| failure localization matrix | 高 | 不合格を修正可能なownerへ変換する |
| causal RED→GREEN | 高 | regressionではなく因果修正を証明できる |
| positive realization oracle | 最重要・要改良 | 値を読むだけでなく本文へ正しく現す |
| Product Read 12軸 | 最重要 | machineと商品価値を分ける |
| exact100 batch evaluator | 高 | release前・Cycle評価へ使える |
| reason family / shared cause | 高 | 100件を共通修正へ集約できる |
| private/public evidence split | 高 | 利用者本文を公開せず評価できる |
| versioned case manifest | 中〜高 | 比較可能なbenchmarkを作れる |

## 3.2 optional capsuleへ縮小するもの

| 機能 | 扱い |
|---|---|
| exact dependency / interpreter lock | release候補の再現benchmark時だけ |
| owner / independent runtime derivation | benchmark結果の独立確認時だけ |
| installed manifest comparator | 環境差が実際に結果へ影響した時だけ |
| source closure | batch結果・release candidateへ限定 |
| HMAC evidence | private batch evidenceの公的summaryが必要な時だけ |
| one-shot clean runtime materialization |月次／release前のcanonical runだけ |
| FD / credential-drop proof | 高riskな外部実行またはsecurity auditだけ |

## 3.3 日常経路から廃止するもの

| 機能 | 廃止理由 |
|---|---|
| 各小stepのauthority body / SHA approval | 商品修正速度と比例しない |
| approval→activation→consumptionの全件記録 | product featureではない |
|同一eventのResult + Receipt + Handoff + Plan + 07 + 08重複 | 情報量より記録量が増える |
| GitHub exact lease / direct childを通常反映の必須条件にする | current GitHub contractで既に廃止済み |
| Inspector / scanner / harness系列の復活 | final result credit 0、current route retired |
| runtime checkerを各G4実装の前提にする | product cause修正を止める |
| controller / FD proofをEmlis応答生成へ接続 | 利用者価値へ直接寄与しない |
| technical GREENだけでnext gateを増やす | G6がproduct不合格を実証した |

---

# 4. 新しい読み替え — 「安全装置」ではなく品質知能基盤

再利用時は、旧systemを一つの名前で残さない。責任ごとに次へ分ける。

## 4.1 Cocolon Semantic Evidence Graph

役割:

- current inputをtyped evidenceへ変換。
- source anchor、owner、relation、dimension、unknown、value、Reception opportunityを保持。
- EmlisAI、分析、Piece、問いへread-only materialを渡す。

既存資産:

- `EmlisCurrentInputBundle`
- Evidence Ledger
- semantic atoms / families
- owner-role / owner-kind
- relation / semantic link
- explicit unknown
- environment-state-output frame
- ValueObservationSignal / Plan
- User Label Connection

禁止:

- graphから完成返答を直接返さない。
- AI summaryをuser source anchorへ昇格しない。
-一件入力から人格・傾向を確定しない。

## 4.2 Cocolon Plan-Owned Surface Compiler

役割:

- typed planを最終文章の唯一のstructural ownerにする。
- generic late spliceを使わない。
-各中核構造専用adapterで文章化する。

```text
EmlisObservationComposer
AnalysisComposer
PieceComposer
QuestionComposer
```

重要:

共通Coreは共通rendererではない。

```text
shared = evidence / plan / quality vocabulary / trace
separate = tone / purpose / visible shape / length / public boundary
```

Emlis、分析、Piece、問いを同じ文章型へ潰さない。

## 4.3 Cocolon Product Quality Observatory

役割:

- machine metricとhuman Product Readを別々に収集。
- case rowを12軸、severity、reason family、shared causeへ変換。
- version間comparison。
- common failure ownerの抽出。
-修正後の改善・悪化を可視化。

用途:

- EmlisAI exact100。
-問い候補の圧迫感・答えやすさ評価。
-分析レポートの根拠・密度・読みやすさ。
-Pieceの原文保持・独自性・共有価値。

## 4.4 Cocolon Causal Repair Planner

役割:

```text
Product Read failure
  -> body-free failure aggregate
  -> broken layer
  -> common cause
  -> code owner
  -> minimal change window
  -> positive causal RED
  -> regression risk
```

旧G3の最も価値が高い部分である。

## 4.5 Cocolon Question Need Engine

役割:

Semantic Evidence Graphの「止める理由」を、必要な場合だけ「人へ確かめる問い」へ変換する。

入力候補:

```text
unknown_slots
explicit_unknown
owner specificity unresolved
input anchor unresolved
state_text_gap
emotion_nesting
thought_action_discrepancy
category_parallel
category_overlap
relation direction ambiguity
referent scope ambiguity
value observation uncertainty
repeated unresolved label connection
```

出力:

```text
NO_QUESTION_NEEDED
OPTIONAL_FOLLOWUP_NOW
SAVE_PERSONAL_FOLLOWUP
ASK_AFTER_REPEATED_PATTERN
BLOCK_QUESTION_AS_INTRUSIVE_OR_UNGROUNDED
```

## 4.6 Cocolon Evaluation Evidence Envelope

役割:

- versioned run ID。
- source / corpus / case manifest identity。
- private resultとbody-free summaryの対応。
- no-overwrite。
- exact denominator。
- aggregate再計算可能性。

日常の一回答ではなく、batch評価とrelease判断へ限定する。

## 4.7 Cocolon Reproducible Benchmark Capsule

旧runtime checker / controller / manifest / FD proofを縮小したoptional layer。

用途:

- release候補比較。
-環境差で結果が変わった障害調査。
-重大なregressionの再現。
-外部委託先またはCIでcanonical benchmarkを再実行。

非用途:

- Emlisの一回の修正前に毎回起動。
-問い候補生成のlive path。
-日常Product Readの前提。
-通常GitHub反映の正式性条件。

---

# 5. EmlisAI構造への活用

三大中核構造の一つ目は`EmlisAI構造`である。

## 5.1 応答品質の原因診断

現状の100件結果を、単なるMAJOR / BLOCKER集計で終わらせず、次の因果mapへ変える。

```text
source extraction failure
semantic ownership failure
relation direction failure
head / subordinate hierarchy failure
dimension placement failure
Reception specificity failure
overcompression
explanatory density
late splice / generic frame
surface distribution concentration
```

各caseのfailed axesを同じproduction ownerへ束ね、修正単位を作る。

## 5.2 positive realization oracle

旧G4の問題は、「値を参照した」「mutationで例外になった」を本文実現とみなしたことだった。

改良後は次を検査する。

```text
semantic value changed
  -> intended visible locusだけが変化
  -> unintended locusは不変
  -> sentence remains valid
  -> source meaning preserved
  -> Reception relation preserved
```

これにより、本文へ本当に意味が出たかをtestできる。

## 5.3 candidate tournament

同じSemantic Evidence Graphから複数candidateを生成し、次で比較する。

- source congruence。
- main meaning dominance。
- relation readability。
- owner / pronoun clarity。
- Reception specificity。
- density。
- repetition。
- naturalness。
- human Product Read preference。

固定正解文を使わず、構造保持と読感を組み合わせてcandidateを選べる。

## 5.4 surface diversity controller

exact100全体で次を観測する。

- opening strategy concentration。
- sentence skeleton concentration。
- predicate family concentration。
- closing family concentration。
- Reception act concentration。
-同じtyped topologyに対する表現variation。

これはテンプレ回避を「語尾をランダムに変える」問題ではなく、構造と表現の対応分布として扱える。

## 5.5 response version diff

旧outputと新outputを、本文差分だけでなく次で比較する。

```text
preserved semantic atoms
added / lost owner
relation direction delta
dimension locus delta
Reception target/support/act delta
visible sentence hierarchy delta
Product Read severity delta
```

「何を変えた結果、何が良くなったか」を説明できる。

## 5.6 runtime Gateからdeveloper observabilityへ移す

多くの検査をlive fail-closeにせず、developer dashboardへ出す。

例:

```text
response returned normally
+ internal quality trace stored body-free
+ high-risk violationだけruntime block
+ naturalness / density / diversityはoffline score
```

これにより安全を保ちながら、表示率と改善速度を落とさない。

---

# 6. 問いシステムへの活用

問いシステムは、G3以後の資産と特に相性が良い。

安全装置では`unresolved`は停止理由だった。問いシステムでは、適切な条件下で`unresolved`は「本人にしか決められない意味」になる。

## 6.1 QuestionNeedSignal

次の内部型を作れる。

```text
QuestionNeedSignal:
  source_anchor
  missing_semantic_slot
  ambiguity_family
  consequence_if_unresolved
  answerability
  emotional_pressure
  timing
  repetition_count
  allowed_question_shape
  forbidden_inference
```

## 6.2 問いの発生源

### owner不明

```text
誰の状態・希望・判断かが曖昧
```

問い例の責任:

- ownerを決めつけず、一つだけ確認。
-人間関係の相手を勝手に補わない。

### relation不明

```text
変化、対比、原因、順序、願い、怖さの接続が複数あり得る
```

問い例の責任:

-「原因は何ですか」ではなく、本人が感じた接続を選べる。

### dimension不明

```text
過去／今／今後、可能性／事実、肯定／否定、範囲が不明
```

問い例の責任:

-一度に一dimensionだけ確かめる。

### explicit unknown

本人が「わからない」と書いたこと自体を、問いの必要性へ使える。

ただし、すぐに答えを要求せず、`わからないまま置く`選択肢も持つ。

## 6.3 問いを出すtiming

```text
NOW:
  回答すると現在のEmlis応答が大きく正確になる。

LATER:
  即時応答の主役を奪うため、Personal Follow-upへ保存。

AFTER_REPEAT:
  一回だけでは傾向と呼べず、複数入力で同じunresolvedが現れた時に聞く。

NEVER:
  診断、責任追及、相手評価、本人が望まない深掘りになる。
```

## 6.4 source_anchor拘束

既存のpersonal question contractと接続できる。

```text
source_anchor = ユーザー入力に実在する短いliteral text
```

AI要約を本人の発言としてquestionへ入れない。

## 6.5 選択式question compiler

Semantic Evidence Graphから次を作る。

```text
source anchor
+ missing slot exact1
+ neutral prompt
+ 2〜4 choices
+ none / not sure / skip
```

例:

```text
「少し楽になった」のは、
A. 状況が変わったから
B. 自分の受け取り方が変わったから
C. まだ理由はわからない
D. 今は答えない
```

固定例文をruntime templateとして使うのではなく、question role planとして生成する。

## 6.6 question dominance guard

既存の`question_dominance_guard`を活用し、Emlisの観測を問いへ置換しない。

```text
Emlis response = primary
question = optional separate affordance
```

## 6.7 問い回答をauthorityへ戻す

本人の回答後は、machine assumptionより強いsourceとしてSemantic Evidence Graphへ戻す。

```text
question candidate
  -> user answer
  -> explicit owner / relation / dimension
  -> future Emlis / Analysis / Pieceへ共有
```

これにより、問いが単独機能ではなく三大中核構造の精度を上げる循環になる。

## 6.8 Premium personal follow-up

複数回現れるunresolvedや、value / role / transitionの反復を集約し、Premiumの`personal_followup`へ使える。

候補:

- repeated thought-action discrepancy。
-同じ環境で変わるrole。
-楽になる前後の共通label。
-本人が何度も保留した願い。
-価値と行動のずれ。
-「わからない」が形を持ち始めた地点。

---

# 7. 分析構造への活用

三大中核構造の二つ目は`分析構造`である。

## 7.1 longitudinal semantic graph

EmlisAIが一件入力で使うSemantic Evidence Graphを、期間単位へ集積する。

```text
environment
state
output / action
relation
value signal
role
wish / fear
change direction
temporal scope
uncertainty
```

一件入力では「観測」、複数回でのみ「傾向候補」へ昇格する。

## 7.2 environment-state-output構造

既存の`環境状態出力観測構造`を分析へ本格活用できる。

```text
environment label
  -> state label
  -> output / action
  -> later state
```

用途:

- conditional_output_tendency。
- recovery_label_path。
-場面ごとの役割スイッチ。
-よく通るルート。
-迷いやすい分かれ道。

## 7.3 traceable analysis report

各analysis sectionへ内部traceを持たせる。

```text
report claim
  -> supporting event IDs
  -> counterexample event IDs
  -> confidence
  -> time range
  -> missing evidence
```

利用者へraw traceを見せる必要はないが、内部で「なぜこの分析になったか」を復元できる。

## 7.4 tendency promotion gate

旧systemのno-promotion思想を商品仕様へ転用する。

```text
single event -> observation only
repeated same structure -> tendency candidate
repeated + counterexample accounted -> reportable tendency
strong contradiction -> mixed pattern
insufficient denominator -> keep as note
```

これはSafety Gateではなく、分析の誠実さを作るspecである。

## 7.5 report failure localizer

Product Readで分析レポートが不合格なら、次へ局所化する。

- evidence selection。
- trend aggregation。
- counterexample handling。
- section hierarchy。
- explanation density。
- user-readable wording。
- visual payload。

EmlisAIと同じG3形式で修正ownerへ接続できる。

## 7.6 問いとの循環

分析で根拠不足だった箇所を、問い候補へ渡す。

例:

```text
仕事の日だけ負荷が高いように見える
but environment labelが粗い
-> personal follow-upで場面を確認
-> answer後にanalysis confidence更新
```

---

# 8. Piece構造への活用

三大中核構造の三つ目は`Piece構造`である。

## 8.1 semantic-to-creative compiler

PieceはEmlisの説明文とは違う。しかし、同じSemantic Evidence Graphを創作骨格へ使える。

```text
main theme / head
supporting motifs
relation movement
temporal movement
value signal
contrast
unknown /余白
emotional temperature
public privacy boundary
```

## 8.2 PieceCandidateLab

一つの意味planから複数の表現candidateを生成する。

候補style:

- short fragment。
- layered prose。
- symbolic image。
- scene-based。
- quiet reflection。
- movement-focused。

評価:

- source fidelity。
- overcompression。
- emotional congruence。
- originality。
- template concentration。
- shareability。
- privacy。
- user preference。

## 8.3 source fidelity without source exposure

body-free lineageを活用し、公開Pieceにraw inputを出さず、内部ではどのsemantic materialを使ったか追跡する。

```text
raw source = private
semantic plan = private / protected
public Piece = publishable
body-free lineage = internal audit
```

## 8.4 resonance lineage

PieceがNexus / Resonanceで変化する場合、次をversioned lineageとして保持できる。

- preserved theme。
- added motif。
- changed relation。
- changed emotional temperature。
- removed private anchor。
- public transformation boundary。

## 8.5 anti-template system

exact100で使ったdistribution観測をPieceへ適用する。

-同じopening。
-同じmetaphor。
-同じending。
-同じsentence skeleton。
-同じemotional arc。

ただし単純random化ではなく、semantic topologyとstyle choiceの対応分布を見る。

## 8.6 Piece失敗のG3 localizer

Piece Product Readの不合格を次へ局所化する。

```text
material selection
creative plan
surface realization
privacy transform
preview formatting
publish transformation
resonance variation
```

これにより「Pieceがテンプレっぽい」を、修正可能なownerへ変換できる。

---

# 9. 三大中核構造をつなぐ共通仕様

## 9.1 Shared Observation Signal Layer

`value observation`は四つ目の中核ではなく、三大中核が共有するsignal layerとして既に定義されている。

この考えを広げる。

```text
CurrentInput
  -> Semantic Evidence Graph
  -> shared signals
       value
       relation
       change
       conflict
       wish
       fear
       effort
       role
       environment-state-output
       unknown
  -> core-specific plan
       Emlis
       Analysis
       Piece
       Question
```

## 9.2 cross-core consistency

同じ入力に対し、次が矛盾しないか確認する。

```text
Emlis immediate observation
Analysis accumulated claim
Piece transformed theme
Question missing-slot assumption
```

例:

- Emlisでは「本人が良い変化と明示」と読んだのに、Analysisでnegative trendへ反転しない。
- Pieceがprivate relationship detailをpublic metaphorへ漏らさない。
-問いがEmlisで確定していないcauseを前提にしない。

## 9.3 shared quality vocabulary

三大中核で共通に使える軸:

```text
grounding
source congruence
main meaning dominance
relation readability
owner clarity
temporal scope
modality / uncertainty
value preservation
overcompression
repetition / diversity
human readability
privacy
```

core-specific axisは別に持つ。

## 9.4 user feedback learning loop

```text
Emlis response reaction
question answer
Analysis report reaction
Piece preview choice / publish / resonance
```

これをbody-free preference signalへ変え、次のcandidate rankingへ使う。

ユーザー本文やprivate reactionを無断でpublic benchmarkへ入れない。

---

# 10. その他の活用案

## 10.1 Developer Quality Console

caseごとに次を表示する内部tool。

```text
input identity
semantic graph
selected plan
surface trace
machine gates
Product Read axes
reason family
shared cause
owner file
version comparison
```

長大なReceiptを読む代わりに、品質改善へ直接使う。

## 10.2 Semantic Corpus Curator

100件をランダム集合ではなく、semantic topologyでcoverage管理する。

coverage例:

- owner count。
- relation family。
- explicit unknown。
- chained modifier。
- temporal shift。
- thought-action discrepancy。
- self-denial boundary。
- positive / unpleasant / mixed Reception。
- short / long / layered input。

## 10.3 Regression Selector

変更したowner / relation / dimension / surface roleから、必要なcaseだけを選ぶ。

日常修正:

```text
focused causal set
+ representative human read
```

release前:

```text
full exact100
+ all100 reread
```

毎回full runtime proofを要求しない。

## 10.4 Algorithm / model comparison bench

将来、別Composer、別algorithm、外部modelを比較する場合にも使える。

同じSemantic Evidence Graph、同じcase manifest、同じProduct Read axesで比較し、model名ではなく出力品質で判断する。

## 10.5 user complaint forensic trace

利用者から「なぜこの返答になったのか」と問い合わせがあった時、raw本文を不用意に複製せず、内部で次を確認できる。

- source event。
- selected semantic material。
- relation / owner。
- surface plan。
- Gate result。
- version。

## 10.6 release quality dashboard

```text
machine selected rate
fail-close rate
output presence
human severity distribution
shared-cause distribution
regression count
new-MAJOR count
diversity concentration
question pressure
analysis unsupported claim
Piece privacy rejection
```

三大中核を一つの品質dashboardで見る。

## 10.7 active learning without fixed answer

machineが自信のないcase、人読で意見が割れたcase、問い回答で意味が確定したcaseを、次の改善corpusへ追加する。

expected final textを正解にせず、semantic obligationsとhuman preferenceを学習材料にする。

## 10.8 design review assistant

新仕様が三大中核へ与える影響をtyped graphで確認する。

例:

- new question signalがEmlis outputを圧迫しないか。
- new Analysis tendencyがsingle-event observationを誤昇格しないか。
- new Piece styleがsource fidelityを落とさないか。

---

# 11. 改良が必要な箇所

## 11.1 Safety semanticsをproduct semanticsへ置換する

旧:

```text
unresolved -> STOP
mutation -> exceptionでもcredit
runtime mismatch -> authority STOP
```

新:

```text
unresolved -> question candidate / low-confidence / keep unknown
valid mutation -> visible positive realizationを証明
runtime mismatch -> benchmark invalid、product修正は別環境で継続可能
```

## 11.2 exact identityを日常仕様にしない

SHA-256、blob、manifest、runtime identityは、結果比較と再現性には使う。  
しかし、Cocolonの商品仕様そのものにはしない。

## 11.3 body-freeを情報不足にしない

public artifactはbody-freeでよいが、改善者が原因を理解するためのprivate review packetは必要である。

```text
public / durable = body-free summary
private / bounded = actual output + review
```

private materialを作らないままreason codeだけ増やす構造へ戻らない。

## 11.4 proxy metricをpositive behaviorへ変える

禁止するproxy:

- symbol exists。
- value read count。
- mutation throws。
- separator count。
- head first position。
- helper returns VALID。

必要なbehavior:

-本文の正しい場所へ意味が出る。
-主従関係が読める。
-別の意味を失わない。
-自然さが改善する。
-人読severityが下がる。

## 11.5 one event one owner

通常の評価runは次だけでよい。

```text
run result exact1
current state update only when navigation changes
```

Result / Receipt / Handoff / Plan / 07 / 08を毎回全部作らない。

---

# 12. 推奨する再利用順

## Priority 1 — Emlis Product Quality Observatory

現在のCycle001へ直接接続する。

抽出対象:

- 12軸。
- severity / reason family。
- shared-cause classifier。
- version comparator。
- distribution metrics。
- positive realization oracle。
- G3 failure localizer。

目的:

```text
BLOCKER 58 / MAJOR 40を、共通修正ownerへ変換する
```

新しいruntime checkerを作らない。

## Priority 2 — Plan-Owned Surface Compiler

二回目G3で確定した根本原因を直す。

目的:

- accepted planをsole grammatical ownerにする。
- late spliceを除く。
- owner / relation / dimension / Receptionをvisible bodyへpositive realizationする。

これは現在のEmlisAI品質改善そのものである。

## Priority 3 — Question Need Engine prototype

Semantic Evidence Graphのunresolvedを、質問exact1へ変換するprototypeを作る。

最初の対象:

```text
owner specificity unresolved
relation ambiguity
thought-action discrepancy
explicit unknown
```

一度に全問いシステムを作らない。

## Priority 4 — Analysis adapter

同じgraphを時間集積し、single event / tendency / mixed patternを分離する。

## Priority 5 — Piece adapter

同じgraphから複数creative planを生成し、fidelity / originality / privacyを比較する。

## Priority 6 — optional Benchmark Capsule

release前だけ、checker / controllerから必要最小限を抽出する。

---

# 13. 実装へ進む場合の最小構成案

## 13.1 shared package

```text
cocolon_semantic_quality/
  evidence_graph.py
  source_lineage.py
  plan_contract.py
  quality_axes.py
  failure_localizer.py
  version_compare.py
```

## 13.2 core adapters

```text
emlis_quality_adapter.py
question_need_adapter.py
analysis_quality_adapter.py
piece_quality_adapter.py
```

## 13.3 offline tooling

```text
quality_observatory_runner.py
product_read_packet.py
corpus_coverage.py
release_benchmark.py
```

## 13.4 最初は移植ではなく抽出

旧sourceを丸ごとcopyしない。

1. responsibility inventory。
2. generic contract抽出。
3. Cocolon固有semantic type保持。
4. authority / publication / runtime identity依存除去。
5. focused tests。
6. current Emlis exact100で価値確認。

---

# 14. 捨ててはいけない知見

1. **Machine GREENはProduct PASSではない。**
2. **構造をmetaで保持しても、本文rendererが所有しなければ意味は現れない。**
3. **mutationで壊れることと、正しく表現されることは別である。**
4. **不合格はcase単位で直すのではなく、shared causeへ集約する。**
5. **本人にしか決められないunknownは、推測で埋めず、問いへ変えられる。**
6. **Emlis・分析・Pieceは意味基盤を共有できるが、文章目的は共有しない。**
7. **body-free証拠とprivate Product Readの両方が必要である。**
8. **再現性の証明は必要な時だけ行い、商品改善の常時前提にしない。**
9. **記録量、test数、authority数は進捗ではない。**
10. **Cocolonの進捗は、人が受け取る言葉と商品判断が改善したかで測る。**

---

# 15. 前回監査資料との関係

前回資料の位置づけを次へ補正する。

```text
Cocolon_EmlisAI_安全装置全履歴_20260701_20260813.md
  = 期間全体の広域インベントリ
  = 975 commitを安全・統制効果で分類
  = G2後systemの部品を多数含む
  != G2後system architectureの正本
  != 再利用設計
```

本資料:

```text
Cocolon_Cycle001_PostG2_SystemArchitecture_Reusability_Audit_20260814.md
  = Mashが指したG2後systemの構造監査
  = Product Quality Core / Control Plane分離
  = 三大中核構造・問いへのreuse map
  = 残す／縮小／廃止の判断
```

両方を保持する。前回資料を削除しない。

---

# 16. 最終判断

## 16.1 事実

- Original G3〜G10はProduct Quality improvement / acceptance systemだった。
- 初回G3はNatural Surface serializerへ共通原因を局所化した。
- G4はcausal RED、G5はsame exact24 GREENを成立させた。
- G6 human Product Readは不合格だった。
- 二回目G3はmachine testのproxy gapとlegacy renderer ownershipをさらに正確に局所化した。
- その後のG4前段がruntime identity / manifest / checker / controller / FD proofへ拡大した。
- 8月13日にそのdetourを止めると、G4-CからG10まで進んだ。
- exact100 Product ReadはCycle001不合格を示した。

## 16.2 華恋の判断

このsystemを「安全装置だから不要」と一括廃止するのは間違いである。

作りすぎたのは、意味構造、因果局所化、Product Read、batch evidenceではない。  
作りすぎたのは、それらを実行する前提として膨張したruntime / authority / publication control planeである。

残すべき中心は次である。

```text
Semantic Evidence Graph
Plan-Owned Surface Compiler
Causal Failure Localizer
Positive Realization Oracle
Product Quality Observatory
Question Need Engine
Evaluation Evidence Envelope
```

これらを安全装置ではなく、**Cocolon意味品質基盤**として再設計する価値がある。

一方、次はcurrent Product routeへ戻さない。

```text
Inspector / scanner lineage
per-step authority chain
mandatory runtime identity Gate
controller / FD proof as daily prerequisite
transport proof as product validity
technical GREEN as progression substitute
```

推奨方針は次である。

```text
DELETE_NOT_ALL
REACTIVATE_NOT_AS_OLD_GATE
EXTRACT_PRODUCT_INTELLIGENCE_CORE
RETIRE_DAILY_CONTROL_PLANE
REUSE_ACROSS_EMLIS_ANALYSIS_PIECE_QUESTION
FIRST_USE_CURRENT_EMLIS_BLOCKER58_MAJOR40
```

---

# 17. この資料で行っていないこと

```text
production source change = 0
test change = 0
runtime execution = 0
exact100 rerun = 0
Cycle001 position change = 0
old authority reactivation = 0
checker / controller / FD reactivation = 0
three-core specification mutation = 0
question-system implementation = 0
automatic progression = false
```

本資料は、前回監査のscope不足を補正し、再利用可能性を実ファイルの系譜から設計したread-only監査・提案である。
