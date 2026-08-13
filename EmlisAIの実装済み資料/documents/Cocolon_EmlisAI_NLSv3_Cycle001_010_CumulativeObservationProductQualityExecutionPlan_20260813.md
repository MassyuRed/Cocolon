---
document_id: COCOLON_EMLISAI_NLS_V3_CYCLE001_010_CUMULATIVE_OBSERVATION_PRODUCT_QUALITY_EXECUTION_PLAN_V1
revision_date: 2026-08-13
status: MASH_ADOPTED_CURRENT_EXECUTION_PLAN
effective_when: SATISFIED_BY_MASH_EXPLICIT_START
adopted_at_jst: 2026-08-13T15:46:26+09:00
current_cycle: CYCLE001_CURRENT100_OBSERVATION_PRODUCT_QUALITY_REACH
cycle001_started: true
source_cocolon_head: 5d318c07ff07288c1e146f389870912c2b43392d
source_mashos_api_head: 6e8d42a6738f45f71fc6f00246fe54475c4c6b9c
decision_owner: Mash
execution_owner: Ultra Karen
product_destination: P3_PRODUCT_READ_FEEL_V1
within_cycle_correction_loop: CONTINUE_UNTIL_OBSERVATION_PRODUCT_QUALITY_REACHED
between_cycle_automatic_progression: false
target_execution_responses: 10
body_policy: PRIVATE_BODY_FULL_AND_PUBLIC_BODY_FREE
---

# Cocolon EmlisAI NLS v3 Cycle001–Cycle010 累積観測商品品質到達 実行計画

## 0. 結論

Mashの認識で正しい。

各Cycleは、単に新規100件を一度実行して結果を出した時点では完了しない。
そのCycleの累積対象すべてについて、EmlisAIの実応答を生成し、Product QAで問題を発見し、共通構造を修正し、累積全件を再実行し、必要な本文を再読し、**観測商品品質へ到達した時点**で完了する。

```text
Cycle001 = current 100件が観測商品品質へ到達するまで修正・実行・全件確認を反復
Cycle002 = Cycle001 accepted 100件 + 新規100件 = 累積200件が到達するまで反復
Cycle003 = Cycle002 accepted 200件 + 新規100件 = 累積300件が到達するまで反復
...
Cycle010 = Cycle009 accepted 900件 + 新規100件 = 累積1000件が到達するまで反復
```

実行時は**1 Cycle = Ultra華恋の1回答**とする。
各CycleをMashが開始した後、Ultra華恋は途中の通常修正、test、再実行、Product Readのたびに追加承認を求めない。同一Cycle内で、観測商品品質へ到達するまで修正ループを継続する。

Cycle間の自動進行は行わない。Cycle001完了報告後、MashがCycle002を開始する。この方式により、実行回答はCycle001からCycle010までの10回答に限定する。

## 0.1 Source basis

本計画は次のcurrent GitHub正本とactual evidenceを基準にする。

- `Cocolon_前提資料/work_attitude_rules_for_karen/CURRENT_RULES.md`
  - R1.1「必要」の拘束定義
  - R1.2「安全」の定義と上限
  - R1.3 完成・責任・2026-08-13拘束判断
- `Cocolon_前提資料/08_cycle001_current_state.md`
  - G4-BからG10までのcurrent result
  - exact100 / all100 Product QA / acceptance recomputation
- `Cocolon_前提資料/Cocolon_EmlisAI_longterm_roadmap_CURRENT.md`
  - current product workstream `P3_PRODUCT_READ_FEEL_V1`
  - 「読まれた感・自然さ・non-template」の商品目的
- `Cocolon_前提資料/historical_baselines/emlis_ai/Cocolon_EmlisAI_ModelFreeNaturalLanguageSurfaceV3_DetailedDesign_ImplementationOrder_20260714_Revised_Cycle.md`
  - 100件単位の新規sample作成
  - 全件Product QA
  - shared structural correction
  - cumulative rerun / reread
  - Cycle001–Cycle010 / minimum1000
- current source result: `MassyuRed/mashos-api@6e8d42a6738f45f71fc6f00246fe54475c4c6b9c`
- current policy result: `MassyuRed/Cocolon@5d318c07ff07288c1e146f389870912c2b43392d`

Original Detailed Designのproduct / semantic / Safety / privacy条件を弱めない。一方、historicalなproof-of-proof、retired G4-B detour、完了済みG0–G10をcurrent next actionへ戻さない。

## 1. Current actualからの開始位置

本計画は、G0–G10を最初からやり直す計画ではない。
2026-08-13 current actualをそのまま開始点にする。

```text
prior G4-B                         = DETOUR_RISK_STOP
safety-device further development = STOPPED
minimum one-shot preflight         = PASS
G4-C                               = CAUSAL_RED_FIXED
G5                                 = PRODUCTION_GREEN
G6                                 = PRODUCT_ACCEPTANCE_REJECTED
G8 exact100                        = COMPLETE
G9 all100 read                     = COMPLETE_REJECT
G10                                = RECOMPUTED / CYCLE001_NOT_ACCEPTED
current route                      = RETURN_TO_SHARED_STRUCTURAL_CORRECTION
```

Cycle001 current evidence:

```text
valid corpus                         = 100
selected / no-valid / fail-close     = 45 / 2 / 53
output present / output missing      = 52 / 48
base-pipeline / downstream failure   = 42 / 11
PASS / MINOR / MAJOR / BLOCKER       = 0 / 2 / 40 / 58
unresolved MAJOR / BLOCKER            = 40 / 58
corpus invalid                        = false
```

したがって、Cycle001の次作業はruntime証明、checker、controller、FD、G0–G10再監査ではない。
G9の100件Product QA ledgerとprivate body-full evidenceから、58 BLOCKER、40 MAJOR、2 MINORの共通原因を修正し、current100件を観測商品品質へ到達させる作業である。

## 2. 本計画でいう「観測商品品質到達」

各Cycleの完了状態を次で固定する。

```text
CYCLE00X_OBSERVATION_PRODUCT_QUALITY_REACHED
```

次の全条件が成立した場合だけ、この状態を記録する。

### 2.1 Corpus条件

1. 累積valid sample件数が当該Cycleの目標件数と一致する。
2. Cycle002以降の新規batchはexact100である。
3. 新規100件はApp-Reachable validation 100/100である。
4. exact duplicateは0である。
5. 単なる名詞・動詞差し替え中心のnear duplicateを除外している。
6. PII、実ユーザー本文の無断コピー、expected final text、expected answer cueを含まない。
7. 新規100件のmanifest、semantic contract、coverage annotationを初回run前にfreezeし、結果を見て差し替えない。

### 2.2 Execution条件

1. current RCで累積対象を全件実行している。
2. execution exceptionは0である。
3. safeなvalid inputについて、visible EmlisAI outputが累積件数と同数存在する。
4. safeなvalid inputの`no_valid`、`fail_close`、`output_missing`は0である。
5. 既存Safety ownerによる正当な限定観測へ委譲する場合も、無応答ではなく、商品として読めるvisible responseを返し、通常観測と別reason codeでaccountする。
6. source closure、runner、result identityを再計算できる。

### 2.3 意味・Safety条件

累積全caseで次を満たす。

1. 入力の主要意味を保持する。
2. thought/actionの関係方向を反転しない。
3. emotion/categoryを原因、人格、診断、相手意図へ昇格しない。
4. unknownを勝手に埋めない。
5. 自己否定を事実として採用・増幅しない。
6. sourceにない出来事、理由、未来保証を発明しない。
7. `見えたこと`と`Emlisから`の役割を混同しない。
8. private body、credential、user data、public API / DB / RN contractを破壊しない。

### 2.4 Product Read条件

各caseを次の12軸で判定する。

1. 主要意味保持
2. thought/action関係方向
3. emotion/categoryの不当昇格なし
4. unknown保持
5. self-denial非採用
6. 入力固有のEmlis reception
7. `見えたこと`と`Emlisから`のdistinctness
8. 日本語の自然さ、断片・同義反復・過剰引用・説明文調の不在
9. opening、terminal、predicate、sentence skeletonの異常集中なし
10. 入力量・意味構造に合うdepth
11. 問いが必要な曖昧さでfalse understandingをしない
12. 入力直後の観測として「読まれた形」になっている

完了条件:

```text
unresolved BLOCKER = 0
unresolved MAJOR   = 0
```

MINORは、共通構造欠陥ではなく、同じ原因のclusterを作らず、商品利用を阻害しない局所的な語感・句読点等であると説明できる場合だけ残せる。共通原因を持つMINORは修正対象であり、NOTEへ逃がさない。

### 2.5 Anti-template / correction integrity条件

1. case ID、batch ID、family、入力固有語、期待文によるproduction分岐は0。
2. fixed final text、完成文bank、case専用fallbackは0。
3. failureを、Evidence、Obligation、Relation、Unknown、Content、Discourse、AST、Renderer、Parser、Matcher、Gate、Selector、Reception等の共通ownerへ局所化する。
4. production変更には、その共通原因を再現するcausal REDまたは同等のbehavioral regressionを持たせる。
5. machine GREENをProduct Read PASSへ変換しない。

### 2.6 Cumulative regression条件

1. 新規100件だけでなく、accepted済み累積valid corpusを全件machine rerunする。
2. Known regression、invalid-contract negative、適用可能な既存回帰を維持する。
3. text-affecting change後はnew RC / run IDで実行する。
4. output bytesが変わった過去caseを全件再読する。
5. 過去BLOCKER / MAJORだったcaseを全件再読する。
6. 修正ownerと同じcoverage family / relation / depthの代表caseを再読する。
7. new batch100件は全件読む。
8. 各caseは、作成Cycleで最低一回body-full Product Readを受け、その後にoutputが変わった場合は必ず再読される。

### 2.7 Durable closure条件

1. production、test、runner、fixture、manifest、body-free evidenceのmaterial差分をGitHubへ反映する。
2. raw input、raw output、識別可能なparaphrase、commitment keyはpublic GitHubへ出さない。
3. body-full Product QAはprivate durable storageへ保存する。
4. body-free case ledger、aggregate、reason code、source / run identityをGitHubへ保存する。
5. current stateを当該Cycleのaccepted状態へ更新する。
6. remote bytes、changed paths、final headsをfresh postverifyする。

## 3. 1 Cycle内で繰り返す実行ループ

各Cycleを開始した後、Ultra華恋は次を一つのbounded execution unitとして継続する。

```text
A. current source / accepted prior Cycle / corpus identityを固定
B. 最小preflight
C. 新規100件を作成・検証・freeze（Cycle001は既存batch001を使用）
D. 修正前RCで初回runをlock
E. new100全件Product QA
F. failureをseverity / axis / shared cause / ownerへ分類
G. shared causeごとにcausal REDを作る
H. common structural ownerを最小修正
I. focused test + required regression
J. 累積全件をnew run IDで再実行
K. changed-output / past B-M / affected family / new100を再読
L. Cycle acceptanceを再計算
M. BLOCKERまたはMAJORが1件でも残ればFへ戻る
N. 全条件成立後だけCycle完了をGitHubへ反映し、ユーザー向け完了報告
```

通常のBLOCKER、MAJOR、machine failure、Product Read REJECTはCycle終了理由ではない。次の修正ループへの入力である。

### 3.1 修正優先順位

同一Cycle内では次の順で解消する。

1. valid inputのoutput missing、exception、no-valid、fail-close
2. meaning loss、relation reversal、unsupported claim、self-denial、false understanding、privacy / contract破壊
3. 入力固有性不足、Emlis reception非結合、観測と受け取りの重複
4. 不自然な日本語、explanatory density、depth不適合、main meaning埋没
5. template concentration、同一skeleton過集中、surface distribution不良
6. 共通原因を持つMINOR
7. isolated cosmetic MINOR

### 3.2 最小preflight

各Cycleのpreflightは次だけでよい。

```text
Git commit / source closure
Python / dependency availability
runner launch
private body protection
result saving
```

環境が同じで既に成立している項目を、proof-of-proofとして再構築しない。failureが出た場合は、その実測原因だけを同一Cycle内で最小修正し、作業本体へ戻る。

次を作らない。

- 新checker
- 新controller
- FD mechanism
- scanner / carrier
- host attestation
- full-root証明system
- safety専用subsystem
- authorityを確認するauthority
- 一回限り確認を恒久systemへ拡張する実装

## 4. Ultra華恋の回答・実行プロトコル

### 4.1 10回答の区分

| 実行回答 | 対象 | 新規件数 | 累積件数 | 完了状態 |
|---:|---|---:|---:|---|
| 1 | Cycle001 | 0（既存100を使用） | 100 | `CYCLE001_OBSERVATION_PRODUCT_QUALITY_REACHED` |
| 2 | Cycle002 | 100 | 200 | `CYCLE002_OBSERVATION_PRODUCT_QUALITY_REACHED` |
| 3 | Cycle003 | 100 | 300 | `CYCLE003_OBSERVATION_PRODUCT_QUALITY_REACHED` |
| 4 | Cycle004 | 100 | 400 | `CYCLE004_OBSERVATION_PRODUCT_QUALITY_REACHED` |
| 5 | Cycle005 | 100 | 500 | `CYCLE005_OBSERVATION_PRODUCT_QUALITY_REACHED` |
| 6 | Cycle006 | 100 | 600 | `CYCLE006_OBSERVATION_PRODUCT_QUALITY_REACHED` |
| 7 | Cycle007 | 100 | 700 | `CYCLE007_OBSERVATION_PRODUCT_QUALITY_REACHED` |
| 8 | Cycle008 | 100 | 800 | `CYCLE008_OBSERVATION_PRODUCT_QUALITY_REACHED` |
| 9 | Cycle009 | 100 | 900 | `CYCLE009_OBSERVATION_PRODUCT_QUALITY_REACHED` |
| 10 | Cycle010 | 100 | 1000 | `CUMULATIVE_1000_OBSERVATION_PRODUCT_QUALITY_REACHED` |

本MDを作成・確認する現在の応答は、上記10回答へ数えない。

### 4.2 同一Cycle内の出力

- Ultra華恋は短い進捗更新を行ってよい。
- 進捗更新を完了報告、STOP、追加承認要求へ変換しない。
- ユーザー向けの最終回答は、当該Cycleが観測商品品質へ到達し、GitHub postverifyが終わった後だけ出す。
- routineなsource修正、test追加、runner実行、Product Read、再修正のたびにMashへ承認を戻さない。
- session切替やcontext lossに備え、materialなsource / test / result / current-state checkpointをGitHubへ継続保存する。
- checkpointを作業完了とせず、同一Cycleのaccepted stateまで継続する。

### 4.3 Cycle完了報告の固定項目

各回答の最後に次を示す。

```text
Cycle / new / cumulative
initial run result
initial PASS / MINOR / MAJOR / BLOCKER
shared cause families
correction loop count
final cumulative run result
final PASS / MINOR / MAJOR / BLOCKER
output present / missing
exceptions / no-valid / fail-close
new100 read count
changed-output reread count
past B-M reread count
regression result
product-quality state
Cocolon head / mashos-api head
changed paths
private/public evidence location
next Cycle entry state
```

## 5. Cycle001 — current100の観測商品品質到達

### 5.1 Entry

```text
current100 executed and all-read
PASS / MINOR / MAJOR / BLOCKER = 0 / 2 / 40 / 58
output missing = 48
base-pipeline failure = 42
current downstream failure = 11
current route = RETURN_TO_SHARED_STRUCTURAL_CORRECTION
```

### 5.2 作業

1. G9の100件ledgerを、`output absence / base pipeline / semantic Safety / input binding / Reception / naturalness / depth / distribution`のshared causeへ再集計する。
2. 58 BLOCKERのうち、valid inputでvisible outputを返せていない原因を最優先で修正する。
3. 42 base-pipeline failureと11 downstream failureを、actual owner単位へ分ける。
4. case cueを使わず、共通ownerごとにcausal REDを置く。
5. production ownerを最小修正する。
6. focused test、ordered regression、runner testを行う。
7. current100を全件再実行する。
8. changed-output全件、past BLOCKER/MAJOR全件、affected familyを再読する。
9. BLOCKER / MAJORが残れば1へ戻る。
10. final current100を100/100 accountし、Product QAを再計算する。

### 5.3 完了

```text
valid = 100
output present = 100
exception / no-valid / fail-close = 0 / 0 / 0
unresolved BLOCKER / MAJOR = 0 / 0
new/current100 body-full read = 100 / 100
case-specific branch / fixed response = 0 / 0
CYCLE001_OBSERVATION_PRODUCT_QUALITY_REACHED
```

historical G1 `NOT_PROVED` / G2 `FAILED`はhistorical nonconformanceとして保持し、遡及PASS、backfill、再監査を行わない。本計画のCycle001完了は、2026-08-13のcurrent exact100 lock・all100 read以後のforward product-quality convergenceを示す。historical process complianceを偽って主張しない。

## 6. Cycle002 — 新規100＋累積200

### 6.1 新規100の設計重点

- Cycle001のfailure clusterとcoverage gapを確認する。
- Cycle001修正が壊れやすい境界caseを含める。
- thought only / action only / both、単一 / 複数emotion、単一 / 複数category、short / medium / longを偏らせない。
- Cycle001本文の言い換えを作らない。

### 6.2 作業

1. batch002 exact100を作成、validate、novelty check、freezeする。
2. Cycle001 accepted RCでbatch002を修正前初回実行しlockする。
3. batch002の100 input / 100 outputを全件読む。
4. BLOCKER / MAJORをshared causeへ分類し、共通構造を修正する。
5. batch001 + batch002の累積200を全件再実行する。
6. batch002全件、changed batch001全件、past B/M、affected familyを再読する。
7. 累積200のBLOCKER / MAJORが0になるまで反復する。

### 6.3 完了

```text
new = 100
cumulative = 200
all cumulative outputs product-accepted
CYCLE002_OBSERVATION_PRODUCT_QUALITY_REACHED
```

## 7. Cycle003 — 新規100＋累積300

### 7.1 新規100の設計重点

- thought/actionの一致、補完、対立、時間差、因果不明
- multi-topic、複数referent、省略referent
- explicit cause / unknown cause
- relation directionとmain meaning dominance

### 7.2 作業

batch003をfreezeし、修正前initial100をlockして全読する。新しいrelation、referent、meaning-selection failureをshared causeへ局所化し、共通ownerを修正する。累積300を全件rerunし、新100、changed past、past B/M、同relation familyを再読する。累積300のBLOCKER / MAJORが0になるまで反復する。

### 7.3 完了

```text
new = 100
cumulative = 300
CYCLE003_OBSERVATION_PRODUCT_QUALITY_REACHED
```

## 8. Cycle004 — 新規100＋累積400

### 8.1 新規100の設計重点

- low_information_short
- limited_grounding
- fragment、口語、誤字、表記揺れ、途中で切れる入力
- referent省略、原因不明、短文での過剰解釈防止

### 8.2 作業

batch004のinitial100を全読し、短い入力をgeneric template、無応答、過剰断定へ落とす共通原因を修正する。累積400をrerunし、短文だけを特別扱いする固定routeを作らず、意味量に合ったminimal / focused outputへ収束させる。BLOCKER / MAJOR 0まで継続する。

### 8.3 完了

```text
new = 100
cumulative = 400
CYCLE004_OBSERVATION_PRODUCT_QUALITY_REACHED
```

## 9. Cycle005 — 新規100＋累積500

### 9.1 新規100の設計重点

- long_meaning_arc
- multi-emotion / multi-category
- self-insight単独
- layered meaning、depth、density、文分割・結合
- main meaning埋没とexplanatory overcompression / overexpansion

### 9.2 作業

batch005の長文・多層入力を全読し、情報列挙、説明文調、意味の一方を潰す圧縮、過剰な長文化を共通ownerで修正する。累積500をrerunし、depthとsentence structureを入力構造へ合わせる。BLOCKER / MAJOR 0まで継続する。

### 9.3 完了

```text
new = 100
cumulative = 500
CYCLE005_OBSERVATION_PRODUCT_QUALITY_REACHED
```

## 10. Cycle006 — 新規100＋累積600

### 10.1 新規100の設計重点

- uncertainty_support
- structure_question
- question-system relevance `possible / burden_risk`
- source_unavailable_high_information
- 「問いが必要」「限定観測で止める」の境界

### 10.2 作業

batch006で、曖昧さを勝手に埋めるfalse understanding、問いが必要なのに理解したふりをする応答、情報不足を無応答へする経路を修正する。問いシステム本体を新規実装せず、current NLS v3のnormal / limited observation責任の範囲で商品応答を成立させる。累積600のBLOCKER / MAJOR 0まで反復する。

### 10.3 完了

```text
new = 100
cumulative = 600
CYCLE006_OBSERVATION_PRODUCT_QUALITY_REACHED
```

## 11. Cycle007 — 新規100＋累積700

### 11.1 新規100の設計重点

- self_denial
- anger_or_boundary
- daily_unpleasant / daily_positive
- relationship_gratitude_recovery
- 人間的フォローの温度、責め語・断定語・慰めtemplateの回避

### 11.2 作業

batch007で、自己否定の採用、怒りの人格化、相手意図断定、generic comfort、浅い復唱を検出する。Safetyを理由に沈黙させず、入力内の事実とEmlisの受け取りを分けた自然な応答へ共通構造を修正する。累積700のBLOCKER / MAJOR 0まで反復する。

### 11.3 完了

```text
new = 100
cumulative = 700
CYCLE007_OBSERVATION_PRODUCT_QUALITY_REACHED
```

## 12. Cycle008 — 新規100＋累積800

### 12.1 新規100の設計重点

- past / current / future intention / 時間混在
- change_future_intention_transition
- history_eligible_current_input_only
- temporal scope、modality、polarity、referent scope
- 現在入力と過去記録の越境防止

### 12.2 作業

batch008で、時間軸の反転、未来意図の完了扱い、過去情報による現在入力の上書き、history overclaimを共通ownerで修正する。current-input-onlyの観測責任とhistory接続可能性を分離し、累積800のBLOCKER / MAJOR 0まで反復する。

### 12.3 完了

```text
new = 100
cumulative = 800
CYCLE008_OBSERVATION_PRODUCT_QUALITY_REACHED
```

## 13. Cycle009 — 新規100＋累積900

### 13.1 新規100の設計重点

- 既存14 familyの未充足coverage cell
- 複数の多様性軸を組み合わせた高難度case
- Cycle001–008の修正ownerを同時に刺激する境界case
- opening / ending / predicate / Reception act / skeleton分布
- known caseへの過適合検出

### 13.2 作業

batch009の修正前initial100で、新しいBLOCKERまたは新しいcommon MAJOR構造欠陥の有無を明示する。発見した場合もCycle009内で共通修正し、累積900をrerunする。new100、changed past、past B/M、duplicate cluster、distribution clusterを再読し、累積900のBLOCKER / MAJOR 0まで反復する。

### 13.3 完了

```text
new = 100
cumulative = 900
CYCLE009_OBSERVATION_PRODUCT_QUALITY_REACHED
CYCLE009_INITIAL_NEW_STRUCTURAL_DEFECT_COUNT = recorded
```

## 14. Cycle010 — 新規100＋累積1000

### 14.1 新規100の設計重点

- Cycle009完了時点の残存coverage gap
- 過去batchと異なる意味構造・relation・length・surface shapeの組合せ
- latest correctionの境界case
- 1000件全体のdistribution balance
- saturation observationの第2batch

### 14.2 作業

1. batch010 exact100を作成・freezeする。
2. Cycle009 accepted RCで修正前initial100をrun・lockし、100件全読する。
3. 新しいBLOCKER / common MAJORがあれば、Cycle010内で共通構造を修正する。
4. 累積1000を全件machine rerunする。
5. batch010全件、changed past全件、past B/M全件、全14 family、relation / depth / distribution代表を再読する。
6. 1000 case rowを再計算し、output presence、semantic/Safety、Product QA、anti-template、regression、privacyを確認する。
7. BLOCKER / MAJOR 0まで反復する。
8. final RC、run identity、1000件body-free summary、current stateをGitHubへ反映する。

### 14.3 完了

```text
new = 100
cumulative = 1000
all1000 executed
all1000 have at least one body-full Product Read in their creation Cycle
all changed outputs reread after change
output present = 1000
exception / no-valid / fail-close = 0 / 0 / 0
unresolved BLOCKER / MAJOR = 0 / 0
case-specific branch / fixed response = 0 / 0
CUMULATIVE_1000_OBSERVATION_PRODUCT_QUALITY_REACHED
```

## 15. 1000件到達とoriginal saturation条件の分離

本計画の10回答で完了させるprimary targetは、**current1000件すべての観測商品品質到達**である。

Original Detailed Design §18.9には、これに加えて、直近2つの新規100件batchの修正前initial runで「新しいBLOCKERまたは新しいcommon MAJOR構造欠陥が0」というsaturation条件がある。

Cycle009とCycle010のinitial runが両方この条件を満たした場合:

```text
CUMULATIVE_1000_OBSERVATION_PRODUCT_QUALITY_REACHED
LOCAL_SATURATION_GATE_PASS
NEXT = FINAL_RC_FREEZE / LOCAL_E2E / PERFORMANCE / SHADOW / ACTUAL_DEVICE
```

Cycle009またはCycle010のinitial runで新しい重大構造欠陥が見つかり、同Cycle内で修正して1000件を商品品質へ到達させた場合:

```text
CUMULATIVE_1000_OBSERVATION_PRODUCT_QUALITY_REACHED
LOCAL_SATURATION_GATE_NOT_YET_PROVED
```

この場合も、1000件の商品品質到達を未完了へ戻さない。一方で、original saturationを偽ってPASSにしない。1000件を超えるCycle011以降を自動開始せず、10回答終了後にMashが別途判断する。

## 16. 禁止事項

本計画の実行中、次を行わない。

1. prior G4-B checker / controller / FD routeの再開、修正、V2化、再証明。
2. G0–G10のproof-of-proof再実行。
3. Product QAを代表subset、pytest GREEN、aggregateだけで置換する。
4. new100を一度実行しただけでCycle完了とする。
5. BLOCKER / MAJORが残った状態で次Cycleへ進む。
6. sample、emotion、category、semantic contractを結果後に都合よく差し替える。
7. case / family /固有語 / expected answerによるruntime分岐。
8. fixed response、generic fallback、無応答による見かけ上のGREEN化。
9. 「安全」「念のため」「完全証明」を理由に新しい補助systemを作る。
10. authority、Receipt、Handoff、snapshot、ledgerだけを成果とする。
11. private bodyをpublic GitHubへ出す。
12. EmlisAI product failureをMashの追加確認・低レベル技術判断へ戻す。
13. Pro華恋・Ultra華恋のreview往復を各修正loopのGateにする。
14. Cycle内のroutine correctionごとにユーザー回答を消費する。

## 17. Role

### Mash

- 本計画の採否を決める。
- 各Cycleを一回の指示で開始する。
- Cycle途中のroutine correction、test、rerun、Product Readを逐次承認しない。
- Cycle完了後の結果と、次Cycle開始を判断する。

### Ultra華恋

- 各Cycleのsingle execution owner。
- actual evidenceからshared causeを特定する。
- causal RED、production修正、test、runner、cumulative rerun、body-full Product QA、acceptance再計算、GitHub reflectionを一貫して担当する。
- subagentを使用してもfinal判断、write、postverify、報告を自ら行う。
- 商品品質へ到達するまで通常REJECTを修正loopとして処理する。
- 補助機構を作らず、R1.1の`DIRECT_PRODUCT_OR_ACCEPTANCE_WORK`または`OBSERVED_BLOCKER_MINIMAL_FIX`だけを行う。

### Pro華恋

- 本MDで商品目的、必要性、Cycle boundary、完了条件を事前に固定する。
- 同一Cycle内のroutine correctionへ逐次review Gateを追加しない。
- materialな商品条件変更がない限り、Ultra華恋の同一Cycle実行を止める再審査を行わない。
- Cycle完了後のbody-free結果を商品目的へ照合できるが、追加の安全装置や再監査をnext actionにしない。

## 18. 実行開始時のCycle単位

本計画がMashに採用された後、各Cycleの開始指示は、そのCycle全体を一つのbounded execution unitとして扱う。

```text
scope:
  new100 creation / validation / freeze
  current and cumulative execution
  body-full Product QA
  shared-cause localization
  causal RED / tests
  EmlisAI NLS v3 common-owner production correction
  repeated cumulative rerun and reread
  body-free evidence
  GitHub commit / push / remote postverify

until:
  CYCLE00X_OBSERVATION_PRODUCT_QUALITY_REACHED

not included:
  new API / DB / RN feature
  external service / paid dependency
  checker / controller / FD / scanner / carrier
  case-specific route / fixed response
  next Cycle automatic start
```

## 19. Final state after response 10

```text
CYCLE001 through CYCLE010 product-quality state = REACHED
Karen-generated valid cumulative sample count   = 1000
all1000 output presence                           = 1000 / 1000
unresolved BLOCKER / MAJOR                        = 0 / 0
case-specific branch / fixed response             = 0 / 0
private body-full Product QA                       = DURABLY_SAVED
public body-free evidence                          = GITHUB_POSTVERIFIED
NLS v3 1000-observation product quality            = REACHED
original saturation                               = PASS or explicitly NOT_YET_PROVED
next                                               = final RC / E2E / shadow / actual device decision
```

この状態を、rule、authority、checkerまたは証拠基盤の完成ではなく、**1000件の実入力相当sampleに対するEmlisAI観測応答の商品品質到達**として扱う。
