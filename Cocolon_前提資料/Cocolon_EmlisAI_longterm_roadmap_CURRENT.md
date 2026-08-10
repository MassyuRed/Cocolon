---
document_id: Cocolon_EmlisAI_longterm_roadmap_CURRENT
canonical_path: Cocolon_前提資料/Cocolon_EmlisAI_longterm_roadmap_CURRENT.md
revision_date: 2026-08-10
observation_date: 2026-08-10 JST
status: PHASE3_PREPARED_NOT_PUBLISHED
document_role: EmlisAI_LONG_TERM_PRODUCT_CURRENT_ALIGNMENT
effective_when: PHASE5_CHECKPOINT_B_ATOMIC_CURRENT_OWNER_CUTOVER_REMOTE_POSTVERIFIED
decision_owner: Mash
operation_owner: Karen
body_policy: BODY_FREE
technical_execution_authority: false
automatic_progression: false
---

# Cocolon / EmlisAI 長期開発ロードマップ CURRENT

## 0. この文書の結論

2026-08-10 JST時点のcurrent product workstreamは、**P3: Product Read Feel v1** です。

NLS v3 Step 11 Cycle001は、P3の「読まれた感・自然さ・non-template」を成立させるためのshared structural correction / cumulative product-quality routeです。**Cycle001の累積loopをP7と同一視しません。P7はcurrent Phaseではなく、将来Phaseかつcurrent completion `UNVERIFIED`です。**

現在の確定状態は次です。

```text
CURRENT_PRODUCT_WORKSTREAM = P3_PRODUCT_READ_FEEL_V1
NLS_V3_STEP11_CYCLE001 = NOT_ACCEPTED
G5_TECHNICAL_GATE = GREEN
G6_PRODUCT_READ_GATE = REJECTED
CURRENT_CORRECTION_LANE = SHARED_STRUCTURAL_CORRECTION
P7_LONG_RUN_PHASE = FUTURE_UNVERIFIED
PRODUCT_COMPLETE = FALSE
RELEASE_READY = FALSE
AUTOMATIC_PROGRESSION = FALSE
```

Cycle001がacceptedになっても、P3完了を自動宣言しません。P3の長期商品完了条件へ戻り、Blind QA / read-feeling / non-template / 「また入力したい」につながる商品証拠を確認します。次の長期Phaseへの移行には、current evidenceとMash判断が別途必要です。

---

## 1. 文書境界と読み方

### 1.1 owner境界

- 本書は、EmlisAIの変えない最終商品目的、P0〜P10 map、current product Phase、未完了条件を示す長期roadmap current ownerです。
- current技術navigation ownerは `Cocolon_前提資料/08_cycle001_current_state.md` です。本書はGateの実行順、command、runtime authorityを上書きしません。
- `Cocolon_前提資料/07_latest_snapshot_diff.md` はappend-only evidence / historyです。current next actionのownerとして読みません。
- source、test、fixture、runtime、API、DB、RN、問いシステム実装を承認する文書ではありません。
- 本書単独では、Gate B / Gate C、pytest、Phase 4以降、次Cycleを開始できません。

### 1.2 原本との関係

原本は次のimmutable baselineです。

```text
Cocolon_前提資料/historical_baselines/emlis_ai/Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md
SHA-256: 04fb9e4e11af2b1530d03d95d8e959ba644503722f72094a289bde1d4368ce5b
Git blob: d1c3cdd25e31f0a5a18df4217d0ecac9d243ab3c
```

本書は原本を上書きせず、status driftだけをcurrent evidenceへ合わせるderivative ownerです。最終目的、禁止事項、Level 0〜5、P0〜P10の目的と完了条件は弱めません。原本とcurrent evidenceのstatusが一致しない場合は、原本の完成条件を維持したまま、current statusを `UNVERIFIED` または未完了として扱います。

### 1.3 classification

| classification | 意味 |
|---|---|
| `UNCHANGED_NORMATIVE` | 原本の目的・禁止・完了条件として現在も有効 |
| `CONFIRMED_CURRENT_FACT` | current source / Receipt / Git identityで確認済み |
| `CURRENT_ALIGNMENT_JUDGMENT` | 複数のcurrent evidenceを長期Phaseへ対応付けた判断。新しいacceptanceではない |
| `HISTORICAL_POINTER_ONLY` | 当時のhead、test、status、next。current actionへ使用しない |
| `FUTURE_NORMATIVE_BOUNDARY` | 将来も消してはいけない条件だが、current開始・完了を意味しない |
| `UNVERIFIED` | current reviewed evidenceだけでは開始・実装・完了・不成立を確定しない |

---

## 2. current observation identity

### 2.1 GitHub heads

| repository | observed head | current meaning |
|---|---|---|
| `MassyuRed/Cocolon` | `2afcfb87422334c4fdba9c895d619a64fd9d252a` | Phase 2 exact3 immutable baseline publication後の観測head |
| `MassyuRed/mashos-api` | `45bf98f9034261d3adb3e808d6d759f2334e2d25` | G5 typed recomposition production source owner |

`Cocolon`のPhase 2 commitはoriginal exact3の追加だけです。その親 `7548fd47c67bbda2d8c65bab70ea4564218f54c3` から、既存Plan、`07`、`08`、rules、source、test、fixture、`mashos-api`を変更していません。したがって、Phase 2 publication自体を商品品質creditへ変換しません。

### 2.2 current canonical evidence

| role | current source |
|---|---|
| current navigation | `Cocolon_前提資料/08_cycle001_current_state.md` |
| append-only evidence | `Cocolon_前提資料/07_latest_snapshot_diff.md` |
| G5 technical GREEN | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G5_GateC_Exact24Green_ProductionPublished_BodyFree_Receipt_20260810.json` |
| G6 Product Read REJECT | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G6_B6RepresentativeProductReadRecheck_Rejected_BodyFree_Receipt_20260810.json` |
| latest Gate B typed failure | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4_PostG6SharedStructuralCorrection_GateB_FreshRuntimeReadinessUnderComparatorV2_V1_BodyFree_Receipt_20260810.json` |
| NLS v3 immutable design | `Cocolon_前提資料/historical_baselines/emlis_ai/Cocolon_EmlisAI_ModelFreeNaturalLanguageSurfaceV3_DetailedDesign_ImplementationOrder_20260714_Revised_Cycle.md` |
| Cycle001 immutable plan | `Cocolon_前提資料/historical_baselines/emlis_ai/NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md` |

同名のappend-grown current Planはroute / evidence mapです。single current navigation ownerではありません。current nextを決めるときは必ず `08_cycle001_current_state.md` を読みます。

---

## 3. 変えない最終商品目的

### 3.1 final product destination

EmlisAIは、ユーザーがCocolonへ残した言葉・感情・カテゴリ・行動・時点・履歴を、入力直後に「読まれた形」として返し、その人が自分の状態と反応の線を外側から見られるようにする、Cocolonの最初の商品体験です。

返すものは次の三層です。

1. **現在状態の観測** — 今の入力で置かれている環境・状態・出力を返す。
2. **人間的フォロー** — 入力内に見える怖さ、努力、怒り、願い、迷い、消耗、安心、変化を、Emlisの受け取りとして返す。
3. **記録の線 / 構造気づき** — 必要条件を満たす場合だけ、過去記録・ラベル接続・自己情報の線として返す。

目標体験は、単なる慰めでも診断でもなく、「読まれた」「自分に何が起きているかが少し見えた」「ここに残すと自分の言葉が積み上がる」「もう一度残したい」へつながることです。

### 3.2 unchanged completion principles

| Level | 変えない完成原則 |
|---:|---|
| 0 Display Reliability | safeな通常入力を沈黙で終わらせず、public到達・RN表示・product surfaceを分離観測する。ただし読めていないものを読めたふりで返さない |
| 1 Surface Safety | 壊れた日本語、internal role語、diagnostic語、fixed fallback、雑なmirrorを出さない |
| 2 Product Read Feel v1 | 出来事・感情・願い・詰まり・反応を拾い、自然でnon-templateな「読まれた感」をBlind QAで示す |
| 3 User Label Connection v1 | 適格なowned historyをplan境界内で自然につなぎ、overclaim / creepy / 決めつけを出さない |
| 4 Structure Insight v2 | 復唱を超えた関係の気づきを、限定familyから安全に返し、診断・原因断定・人格分類をしない |
| 4.5 False Understanding Prevention | 十分読めるcaseと問いが必要なcaseを分け、仮観測を先に返し、回答を元入力へ上書きせず、plan / privacy境界を守る |
| 5 Retention-Ready | 初回だけでなく3回目・7回目・履歴蓄積後に価値が増え、pilotで「また残したい」を確認する |

禁止事項は維持します。特に、GPTより賢いAIとして売る、診断・原因・人格・相手意図を断定する、通常応答を行動指示中心にする、一般論や復唱だけで閉じる、低情報入力を履歴で深読みする、1件から期間傾向を作る、case専用route / templateを増やす、Gateを緩める、raw bodyをpublic materialへ漏らす、曖昧さをAI側だけで補完して「わかったつもり」で閉じる、という方向へ進みません。

---

## 4. P0〜P10 current phase map

原本のPhase目的と完了判定軸は維持します。status欄だけを2026-08-10 current evidenceへ合わせます。

| Phase | 原本の目的 / 完了判定主軸 | current status |
|---:|---|---|
| P0 Current Baseline Freeze | current契約・test・赤・未確認を固定する | 過去の完了記述は `HISTORICAL_POINTER_ONLY`。current phase completionの再検証は本監査範囲外 |
| P1 Public Visibility Reliability | safe入力を沈黙で終わらせず、public / RN / product surfaceを分離する | 過去のstatusは `HISTORICAL_POINTER_ONLY`。current phase completionは `UNVERIFIED` |
| P2 Surface Safety / 日本語品質 | 壊れた文・内部語・fixed fallbackを止め、Gateを緩めない | current G5/G6でsemantic / safety軸保存は確認したが、P2全体のcurrent completionは `UNVERIFIED` |
| **P3 Product Read Feel v1** | Blind QAでread-feeling / naturalness / non-templateを成立させる | **`CURRENT_PRODUCT_WORKSTREAM` / `INCOMPLETE`。G6 Product Read REJECT** |
| P4 Family別商品チューニング | family別の温度・比率・surface shapeをBlind QAで安定させる | future。独立したphase completionは `UNVERIFIED`。P3から自動進行しない |
| P5 User Label Connection v1 | 履歴線を自然に出し、「記録が積み上がる」価値を作る | 実装historyはあるが、long-term phase completionは `UNVERIFIED` |
| P6 Structure Insight v2 | 復唱を超えた安全な気づきを限定接続する | 実装historyはあるが、long-term phase completionは `UNVERIFIED` |
| **P7 Product Quality Runner / Long-run Gate** | 継続測定、release判断材料、問い必要性のbody-free観察を整える | **future / `UNVERIFIED`。NLS v3 Step11 Cycle001をP7 currentとみなさない** |
| P8 Personal Continuity / Derived Model / 問いシステムUX | ユーザー辞書・価値anchor・問いUXを長期運用可能にする | `FUTURE_NORMATIVE_BOUNDARY` / implementation・completion `UNVERIFIED` |
| P9 External Pilot | 5〜20人・最低7日で価値、継続、問い負荷を確認する | future / pilot実施・completion `UNVERIFIED` |
| P10 Release Readiness | contract・quality・pilot・operationを満たし、release_allowedを別層で判断する | future / completion `UNVERIFIED`。currentはrelease-readyではない |

P3をcurrent workstreamとする判断は、P0〜P2またはP4〜P10の完了を遡及的に認定しません。

---

## 5. current P3 workstreamとNLS v3 Step 11 Cycle001

### 5.1 接続関係

NLS v3 Step 11 Cycle001は、Natural Language Surfaceの構造欠陥を100-case batch、machine proof、representative Product Readで発見・修正する技術routeです。長期roadmap上では、現在のP3 Product Read Feel v1を成立させるためのsub-workstreamとして扱います。

次の二つを混同しません。

```text
NLS_V3_CYCLE_ACCEPTANCE != P3_PHASE_COMPLETION
MACHINE_GREEN != PRODUCT_READ_PASS
```

### 5.2 P3 phase completion conditions

Cycle001 GateをP3完了条件の代用品にしません。原本P3の条件を次のまま保持します。

```text
[automatic]
- RED markerなし
- forbidden claimなし
- raw text public leakなし
- exact comment_text一致を要求しない
- mirror_only_detectedは低情報以外では要修正

[Blind QA]
- read_feeling >= 0.90 を目標
- naturalness >= 0.90 を目標
- non-template >= 0.90 を目標
- wants_more_input_or_accumulation >= 0.80 を最低線、0.90を商品目標
- self_blame_non_amplification / overclaim_absence は原則1.0近く

[family coverage]
- 各family最低10件でYELLOW以下の理由を収集
- PRODUCT_PASS候補が複数familyで出る
- PRODUCT_PASS候補をrelease_allowedへ変換しない
```

### 5.3 evidence typeの分離

| evidence | confirmed current fact | product meaning |
|---|---|---|
| G5 Gate C exact24 | `24 PASS / 0 FAIL / 0 ERROR / 0 UNEXPECTED`。production ownerは `mashos-api@45bf98f9034261d3adb3e808d6d759f2334e2d25` | technical GREENのみ。Product ReadまたはCycle acceptanceではない |
| G6 representative Product Read | candidate `0 PASS / 2 MINOR / 8 MAJOR / 0 BLOCKER`、unique `0 / 2 / 6 / 0` | `B6_PRODUCT_READ_GATE_REJECTED`。P3未完了を示すactual nonconformance |
| G6 recovery disposition | `RETURN_TO_SHARED_STRUCTURAL_CORRECTION`、`CURRENT_AUTHORITY_STOP`、`NLS_V3_METHOD_STOP_FALSE` | model-free方式全体のSTOPではない。通常のshared correction loop |
| latest Gate B | owner manifest / probeはvalid、independent verifierはinvalid。`Path.read_text`へのunsupported `newline` argumentで停止 | Runtime READY / readiness credit `0 / 0`。technical blocker narrowingであり商品creditではない |
| Cycle001 | G5 technical creditはあるが、G6 reject後のacceptance evidenceなし | `NOT_ACCEPTED` |

### 5.4 current shared structural correction lane

current technical routeの唯一のownerは `08_cycle001_current_state.md` です。2026-08-10観測時点の次の最小proposalは、corrected independent verifierを使うentirely fresh Gate Bです。

```text
NLS_V3_STEP11_CYCLE001_G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_CORRECTED_INDEPENDENT_VERIFIER_AND_FRESH_RUNTIME_READINESS_UNDER_COMPARATOR_V2_V2

state = DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED
```

これはproposal identityの記録であり、本書による実行承認ではありません。Gate B、runtime、pytest、Gate Cへ自動進行しません。proposal名、状態、comparator、current headのいずれかが変わった場合は、`08`を再読して本書のstatusを更新します。

### 5.5 current next business / product checkpoint

別authority下のshared structural correctionがeligible candidateを作れた場合、次のbusiness / product checkpointは、G6 representative Product Readの再実施です。合格条件を緩めません。

```text
- candidate MAJOR / BLOCKER = 0
- unique MAJOR / BLOCKER = 0
- former-major cases 5 / 5 が MINOR以下
- required contexts 7 / 7 が MINOR以下
- controls 3 / 3 が not-worse
- new MAJOR = 0
- eight concern families の MAJOR = 0
- semantic / safety / privacy / authority / resource boundaryを保存
```

G6を通過してもCycle001 acceptedではありません。G7〜G10とformal cumulative acceptanceのcurrent evidenceが必要です。G7〜G10は本書の観測範囲では `UNVERIFIED` とします。

---

## 6. Cycle001 accepted後の長期route

Cycle001 accepted後に戻る長期Phaseは、**P3 Product Read Feel v1** です。

1. Cycle001 acceptanceを、P3完了の一つの技術・商品evidenceとして記録する。
2. 原本P3のBlind QA / read-feeling / naturalness / non-template / follow depth / 「また入力したい」条件をcurrent corpusとsurfaceで確認する。
3. P3完了が確認できなければP3に留まり、shared structural correctionまたはP3 product correctionへ戻る。
4. NLS v3でCycle002へ進む場合も、前Cycle accepted、別authority、automatic progression falseを守る。Cycle002をP7開始とみなさない。
5. P3完了がcurrent evidenceで成立した場合だけ、Mash判断とroadmap更新を経て次の長期Phaseをactivateする。P4、P7、P8へ自動で飛ばない。

NLS v3設計上の最低1000件、100件単位の累積再実行、直近2つの新規batchで新規重大構造欠陥0という条件は削減しません。ただし、これらはNLS v3のlocal stability / actual-device入口条件であり、P7 long-run Phaseのcurrent開始証拠ではありません。

---

## 7. 問いシステムのcurrent scope / future boundary

### 7.1 unchanged normative position

問いシステムは二層です。

1. **EmlisAI core quality gate** — 足りない情報をAIが勝手に補完して「わかったつもり」で閉じることを防ぐ。
2. **P8 question UX** — 仮観測、足りない一点、短い問い、回答に基づくrefined observationを、privacy / plan / continuity境界内で実現する。

問いだけを返して即時観測を先送りする、Emlis本体の読感不足を質問ラリーで隠す、回答で元入力を上書きする、raw answerをpublic metaへ出す、問診・診断へ寄せることは禁止です。

### 7.2 current status

| item | current treatment |
|---|---|
| false-understanding prevention | P3でも維持するcurrent quality axis。G6でこの軸が悪化していないことは確認済みだが、問いシステム完成を意味しない |
| NLS v3 scope | `normal_observation` / future `pre_question_observation` / `refined_observation` のSurface境界を守る。問い必要性判定、問い文、回答保存、RN導線をNLS v3が勝手に実装しない |
| question-system implementation | current reviewed evidenceだけでは `UNVERIFIED` |
| question-system completion | `UNVERIFIED`。completion creditなし |
| P7 body-free need observation | future normative boundary。P7 current開始の証拠なし |
| P8 question UX | future normative boundary。API / DB / RN / plan guard /課金境界の実装authorityを本書から出さない |

問いシステムが未完成である可能性を、NLS v3の観測文だけで埋めません。一方、旧設計本文の作成時点statusだけを根拠に「現productionへ存在しない」とも断定せず、current implementation状態は `UNVERIFIED` のままにします。

---

## 8. actual-device / pilot / release state

| boundary | unchanged entry / completion condition | current state |
|---|---|---|
| NLS v3 local stability | Karen-generated valid 1000件以上、各Cycle accepted、累積全件再実行、直近2つの新規100件で新規重大構造欠陥0、frozen RC | Cycle001 `NOT_ACCEPTED`。1000件 / saturation completion evidenceは `UNVERIFIED`。actual-device入口creditなし |
| shadow / tester-only actual device | local saturation後、shadow、rollback baseline、代表20件のNLS v3 actual-device packet。content failure時はlocal cumulative loopへ戻る | current completion `UNVERIFIED`。creditなし |
| owner switch | local saturation、performance、shadow、actual-device、rollback / monitoringを満たす | current completion `UNVERIFIED`。NLS v3完成とEmlisAI全体完成を同一視しない |
| P9 External Pilot | 5〜20人、最低7日、再入力・自由感想・価値・負荷・離脱理由を確認 | implementation / execution / completion `UNVERIFIED`。pilot creditなし |
| P10 Release Readiness | P1〜P7必須Gate、Product Read、contract、privacy、pilot、monitoring、rollback、question boundaryを別層で判断 | P3 incompleteかつCycle001 NOT_ACCEPTEDのため `RELEASE_READY = FALSE` |

NLS v3 owner switchだけではEmlisAI全体は完成しません。問いシステム接続、refined observation、最終actual-device確認、pilot、release判断の条件を残します。

---

## 9. current商品未完了条件

### 9.1 confirmed current incomplete

- P3 Product Read Feel v1はcurrent workstreamで、completion evidenceが成立していません。
- Cycle001は `NOT_ACCEPTED` です。
- G5はtechnical GREENですが、G6 Product ReadはREJECTです。
- latest Gate Bのruntime readiness creditは `0 / 0` です。
- release-ready条件は成立していません。

### 9.2 unverified — 完了扱いしない

- P0〜P2のcurrent phase completion。
- P4〜P10のcurrent開始・completion。
- G7〜G10とCycle001 formal acceptanceの後続evidence。
- Cycle002〜010、最低1000件、saturation、final local gate。
- shadow、R8 rollback baseline、tester-only actual device、owner switch。
- question-system implementation / completion、refined observation end-to-end。
- external pilot、retention evidence、release operation。

`UNVERIFIED`はPASSでもFAILでもありません。必要なcurrent source / Receiptが確認されるまで、開始・完了・creditを付けません。

### 9.3 historical pointer only

次は原本の履歴を読むために残しますが、current actionには使いません。

- 2026-06時点のzip、head、test件数、RED、実機未確認status。
- 原本内のP0 / P1 / P5等の当時の「現在地」「確認済み」。
- 原本§19 `Next 1`〜`Next 5`。
- NLS v3 Detailed Designの作成時点 `implementation_not_started` と当初Step順。
- original Cycle001 Planの旧pin、旧G1 / G2 next authority、旧single navigation owner宣言。

current nextは、NLS v3 current alignment、本書、Cycle001 current closure route、そして最終的に `08_cycle001_current_state.md` のcurrent ownerを突き合わせて決めます。

---

## 10. roadmap update rule

本書を更新するときは、少なくとも次を残します。

```text
- 更新日と観測日
- current GitHub heads
- 参照したimmutable baseline / current source / body-free Receipt
- current product Phaseとsub-workstream
- confirmed current / historical pointer / unverifiedの移動理由
- 完了条件の変更有無
- question-system / actual-device / pilot / releaseへの影響
- automatic progressionの有無
```

禁止します。

- 進捗が難しいことを理由に完了条件を緩める。
- fixture / machine GREENをProduct Read / Phase / Release合格へ変換する。
- actual divergenceをapproved designへ無断昇格する。
- P3を閉じるためにP7、P8、問いシステム、新機能へ逃げる。
- private input / output本文、識別可能な言い換え、secret、keyをroadmapへ記録する。
- source / test / fixture / runtime executionを本書だけで開始する。

---

## 11. update history

| date | classification | update |
|---|---|---|
| 2026-06-08 | `HISTORICAL_POINTER_ONLY` | original long-term roadmap作成。最終商品目的、Level、P0〜P10を固定 |
| 2026-06-19 | `UNCHANGED_NORMATIVE` | P7/P8 bridgeとして問い必要性のbody-free観察境界を追加。既存P7/P8完了条件は緩和せず |
| 2026-07-06 | `UNCHANGED_NORMATIVE` | 問いシステムをcore quality gate + P8 question UXの二層へ正式再配置 |
| 2026-08-10 | `CONFIRMED_CURRENT_FACT` | Phase 2でoriginal exact3をimmutable baselineとしてpublication / postverify。既存current ownersは不変更 |
| 2026-08-10 | `CURRENT_ALIGNMENT_JUDGMENT` | current derivative作成。current product workstreamをP3、Cycle001をP3 supporting route、P7をfuture / `UNVERIFIED`として分離。G5 GREEN / G6 REJECT / Gate B credit 0を反映 |

---

## 12. current terminal summary

```text
FINAL_PRODUCT_DESTINATION = UNCHANGED_NORMATIVE
CURRENT_PRODUCT_WORKSTREAM = P3_PRODUCT_READ_FEEL_V1
NLS_V3_STEP11_CYCLE001_ROLE = P3_SUPPORTING_TECHNICAL_PRODUCT_ROUTE
NLS_V3_STEP11_CYCLE001 = NOT_ACCEPTED
G5_TECHNICAL_GREEN = TRUE
G6_PRODUCT_READ_PASS = FALSE
CURRENT_SHARED_STRUCTURAL_CORRECTION = INACTIVE_SEPARATE_APPROVAL_REQUIRED
P7_CURRENT = FALSE
P7_STATUS = FUTURE_UNVERIFIED
QUESTION_SYSTEM_IMPLEMENTATION = UNVERIFIED
ACTUAL_DEVICE_COMPLETION = UNVERIFIED_NO_CREDIT
PILOT_COMPLETION = UNVERIFIED_NO_CREDIT
RELEASE_READY = FALSE
AUTOMATIC_PROGRESSION = FALSE
CURRENT_TECHNICAL_NAVIGATION_OWNER = 08_cycle001_current_state.md
```
