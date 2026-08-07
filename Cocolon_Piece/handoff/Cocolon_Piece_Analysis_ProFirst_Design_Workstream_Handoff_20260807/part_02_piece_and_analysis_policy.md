# 3. Pieceロードマップの要点

## 3.1 Phase一覧

```text
PCE-0  Current Contract Pin
PCE-1  Piece Identity / Compatibility
PCE-2  Cross-Core Source Handoff
PCE-3  Record Lifecycle / Visibility / Quota
PCE-4  Content / Format / Safety
PCE-5  Visual Recipe / Export Design
PCE-6  API / DB / RN / Migration Design
PCE-7  Test / Monitoring / Rollback
PCE-8  Design Freeze / Work Package Split
PCE-9A Backend Additive Contract
PCE-9B Format Owner
PCE-9C Post-Emlis Adapter
PCE-9D RN Preview / History / Visibility
PCE-9E Export Prototype
PCE-9F Nexus Compatibility
PCE-U1 Independent Cross-Repo Audit
PCE-10 Audit Correction
PCE-11 Integrated E2E / Actual Device
PCE-U2 Final Independent Acceptance
PCE-12 Release Closure
```

## 3.2 Pro-first runway

Work Ultraを使わずに先行可能な列:

```text
PCE-0
PCE-1
PCE-2
PCE-3
PCE-4
PCE-5
PCE-6
PCE-7
PCE-8
PCE-9A
PCE-9B
PCE-9C
PCE-9D
PCE-9E code-side prototype
PCE-9F
```

ただし、実装Phaseはロードマップだけでは開始しない。

各実装には、次が別途必要である。

- bounded implementation authority。
- approved exact paths。
- RED / contract freeze。
- GitHub write承認。
- test / postverification。
- durable checkpoint。

## 3.3 Ultra候補

```text
PCE-U1:
  Emlis / Piece / Analysis source role、privacy、DB / API / RN / Nexusを
  複数の独立系統で横断監査する。

PCE-U2:
  final release candidateの独立受入れを行う。
```

これらは、Work利用可能になっただけで自動開始しない。

```text
EmlisAI Work優先
+ Pieceが該当gateへ到達
+ 前提Phase完了
+ bounded authority
+ Mashの明示判断
```

が必要である。

## 3.4 Piece identityの初期推奨

PCE-1で正式決定する初期仮説:

```text
current Q&A Piece:
  historical-onlyにはしない。
  現役のqna formatとして残す。

new Piece:
  versioned additive contract。

existing record:
  一括migrationしない。
  read adapter / default projectionで保持する。

Nexus:
  record version / format_type / visual_recipeに応じて旧新cardを描き分ける。

old route / field / storage:
  発売安定までcompatibility ownerとして残す。
  deprecationは別判断にする。
```

## 3.5 PCE-2の役割

PCE-2は、Pieceだけの細部を決めるPhaseではない。

三大中核の共通source / handoff境界を一度だけ固定するPhaseである。

採用する責任分離:

```text
saved input record:
  EmlisAI -> current input observation
  Piece    -> expression / save / share
  Analysis -> period observation / current route
```

Pieceが受け取る候補:

```text
source_input_id
source_input_version
source_input_bundle_commitment
emlis_observation_stage
emlis_observation_result_identity
question_need_decision_identity (if any)
supplemental_answer_identity (if any)
allowed_source_roles
piece_generation_eligibility
```

Piece本文sourceとして使わないもの:

```text
Emlis visible comment_text
Emlis human-follow temperature
Emlis internal obligation / AST / candidate body
Analysis inference
simulated route
public meta hidden field
```

stage境界:

```text
normal_observation:
  original inputのみ。

pre_question_observation:
  original inputのみ。
  question answerがある前提にしない。

refined_observation:
  original inputとsupplemental answerを別source roleで保持する。
  answerでoriginal inputを上書きしない。
```

PCE-2ではabstract handoff contractをProで固定する。

current Emlis ownerへexact import / runtime hookをbindするのはPCE-9Cであり、Emlis側current contractが安定した後に行う。

---

# 4. Analysisロードマップ方針

## 4.1 結論

```text
Analysisロードマップも作成する。
ただし、Pieceと同時に今すぐ独立フルロードマップを作らない。
Piece PCE-2完了後に作成する。
```

これは、AnalysisをPiece完成後まで待たせる意味ではない。

```text
待つ範囲:
  Piece PCE-0 -> PCE-1 -> PCE-2

待たない範囲:
  Piece PCE-3以降の全設計
  Piece implementation
  Piece Ultra audit
  Piece release closure
```

つまり、Analysisロードマップ作成に必要なのは、Piece全体の完成ではなく、**PCE-2で共通source / handoff境界が固定されること**である。

## 4.2 PCE-2後にする理由

PieceとAnalysisは互いの完了に依存しない。

```text
AnalysisはPiece完了に依存しない。
PieceはAnalysis完了に依存しない。
```

ただし、両者は次を共有する。

- saved input identity。
- source role。
- original / supplemental separation。
- cross-core event ordering。
- privacy boundary。
- body-free lineage。
- no-mixing negative codes。
- Emlisとの接続位置。

PCE-2より前にAnalysisロードマップをフル作成すると、次が起こる可能性がある。

- Piece側とAnalysis側でsaved input identityを別定義する。
- Emlis stageの扱いを二重定義する。
- original / supplemental source境界がずれる。
- Piece textをAnalysis factへ誤昇格する危険が残る。
- privacy / body-free lineageを別々に設計し、後で統合が必要になる。
- 三大中核のevent orderingを二重管理する。

したがって、PCE-2を共通foundationとして一度固定し、その後Analysisロードマップへ再利用する。

## 4.3 Analysisロードマップ作成タイミング

exact trigger:

```text
PCE-0 Current Contract Pin: COMPLETE
PCE-1 Piece Identity / Compatibility: COMPLETE
PCE-2 Cross-Core Source Handoff: COMPLETE
```

上記がそろった時点で、次のbounded作業としてAnalysis Pro-Firstロードマップを作成する。

PCE-3以降へ先に進むこと自体は禁止しないが、Analysis roadmapを無期限に後回しにしない。

推奨順:

```text
PCE-0
-> PCE-1
-> PCE-2
-> Analysis Pro-First roadmap作成
-> Piece PCE-3以降とAnalysis Pro Phaseを、依存関係に応じて並行・交互に進める
```

## 4.4 Analysisロードマップの発売前scope

Analysisの発売前ロードマップは、current Watashi Mapを捨てるgreenfield計画にしない。

中心scope:

```text
actual output inventory
role label quality
route step grounding
scene -> role -> action -> result direction
protective meaning / burden meaning
insufficient-data boundary
generic fallback detection
self-denial / diagnosis / personality overclaim prevention
root period / observation amount / confidence相当
time-change minimum
Free / Plus / Premium projection
latest / history consistency
cache / refresh / dirty boundary
RN actual-device display
Product Read
monitoring / rollback
```

発売時必須表示候補:

```text
今のわたしマップoverview
よく立ち上がる場面
role switch
current route
守っているもの
負荷になりやすいところ
根拠期間
観測量 / confidence相当
unknown / not enough
```

## 4.5 時間変化

発売前の第一目標:

```text
前回からの変化を、断定せず表示する。
```

候補:

- 既存content textのchange sectionを正式surface化。
- Watashi Map payloadへadditive `change_summary`。
- monthly / latest差分owner。

3月23日最低線:

```text
current routeは必須。
時間変化は、安全で根拠のある簡易差分まで。
```

## 4.6 わたしシミュレーションの扱い

わたしシミュレーションはAnalysis発売前quality closureと分ける。

```text
発売前:
  current Watashi Mapの商品品質閉包。

発売後:
  branch point
  simulated route
  saved route
  target route
  route comparison
  post-input verification
  simulation Piece
```

最重要境界:

```text
今の自己ルートを消さない。
別ルートを正解にしない。
分岐は仮想である。
ユーザーが選ぶ余地を残す。
observedとsimulatedを混ぜない。
```

Analysis roadmap作成時には、発売前Analysisと発売後simulationを一冊へ混ぜず、少なくとも明確な別laneとして扱う。

## 4.7 AnalysisのPro / Ultra配分

Analysis roadmapもPro-firstとする。

Pro候補:

- current actual owner inventory。
- actual output taxonomy。
- evidence / claim contract。
- route fidelity contract。
- protective / burden meaning contract。
- insufficient-data contract。
- time-change design。
- tier / history / latest design。
- RN / API / DB impact design。
- test / Product Read rubric。
- bounded implementation packets。

Ultra候補:

- cross-repository independent audit。
- route evidence / display / tier / historyの独立複数系統review。
- final release candidate acceptance。
- 分割不能なsimulation safety audit。

当面のAnalysis Ultra作業も、EmlisAI Work優先を守ってqueueへ置く。

---
