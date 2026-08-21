---
document_id: Cocolon_EmlisAI_longterm_roadmap_CURRENT
canonical_path: Cocolon_前提資料/Cocolon_EmlisAI_longterm_roadmap_CURRENT.md
revision_date: 2026-08-21
observation_date: 2026-08-13 JST
step10_contract_sync_date: 2026-08-21 JST
status: CURRENT_EFFECTIVE
document_role: EmlisAI_LONG_TERM_PRODUCT_CURRENT_ALIGNMENT
effective_when: G4B_TO_G10_EXACT100_BODY_FREE_RECEIPT_REMOTE_POSTVERIFIED
decision_owner: Mash
operation_owner: Karen
body_policy: BODY_FREE
technical_execution_authority: false
automatic_progression: false
---

# Cocolon / EmlisAI 長期開発ロードマップ CURRENT

## 0. この文書の結論

2026-08-13 JST時点のcurrent product workstreamは、**P3: Product Read Feel v1** です。

NLS v3 Step 11 Cycle001は、P3の「読まれた感・自然さ・non-template」を成立させるためのshared structural correction / cumulative product-quality routeです。**Cycle001の累積loopをP7と同一視しません。P7はcurrent Phaseではなく、将来Phaseかつcurrent completion `UNVERIFIED`です。**

現在の確定状態は次です。

```text
CURRENT_PRODUCT_WORKSTREAM = P3_PRODUCT_READ_FEEL_V1
NLS_V3_STEP11_CYCLE001 = NOT_ACCEPTED
G5_TECHNICAL_GATE = GREEN
G6_PRODUCT_READ_GATE = REJECTED
CURRENT_CORRECTION_LANE = SHARED_STRUCTURAL_CORRECTION
CURRENT_GATE_B = CLOSED_MINIMAL_PREFLIGHT_PASS
LAST_GATE_B_METHOD = PRIOR_DETOUR_RISK_STOP_THEN_MINIMUM_PREFLIGHT
CURRENT_SELECTED_METHOD = RETURN_TO_SHARED_STRUCTURAL_CORRECTION
CURRENT_FIRST_UNFINISHED_GATE = G4_C_NEXT_CORRECTION_LOOP_UNSELECTED
RUNTIME_READY / READINESS_CREDIT = FALSE / 0
G8_EXACT100 = COMPLETE
G9_ALL100_READ = COMPLETE
G10_ACCEPTANCE = 7 / 14
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
- 本書単独では、Gate C以降、pytest、次Cycleを開始できません。

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
| `MassyuRed/Cocolon` | `d420d612b7ef778a452341287e3c5081cd7cd836` | direct-native Gate B authorityのentry head |
| `MassyuRed/mashos-api` | `45bf98f9034261d3adb3e808d6d759f2334e2d25` | G5 typed recomposition production source owner |

Phase 2がoriginal exact3だけを追加した事実とそのbytesは保持します。Phase 8のpre-freeze terminalとmethod decisionもhistoryとして保持します。current direct-native Gate Bはcomponent checksを成立させましたが、authority本文にreadiness observation canonical preimage schemaがなくadmissionでtyped STOPしました。runtime / product / technical creditへ変換しません。

### 2.2 current canonical evidence

| role | current source |
|---|---|
| current navigation | `Cocolon_前提資料/08_cycle001_current_state.md` |
| append-only evidence | `Cocolon_前提資料/07_latest_snapshot_diff.md` |
| G5 technical GREEN | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G5_GateC_Exact24Green_ProductionPublished_BodyFree_Receipt_20260810.json` |
| G6 Product Read REJECT | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G6_B6RepresentativeProductReadRecheck_Rejected_BodyFree_Receipt_20260810.json` |
| latest Gate B typed failure | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4_PostG6SharedStructuralCorrection_GateB_CorrectedIndependentVerifierAndFreshRuntimeReadinessUnderComparatorV2_V2_PrefreezeExecutablePreflightInvalid_BodyFree_Receipt_20260810.json` |
| current Gate B terminal | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4_PostG6SharedStructuralCorrection_GateB_DirectNativeProcessFreshRuntimeReadiness_V1_BodyFree_Receipt_20260811.json` |
| NLS v3 immutable design | `Cocolon_前提資料/historical_baselines/emlis_ai/Cocolon_EmlisAI_ModelFreeNaturalLanguageSurfaceV3_DetailedDesign_ImplementationOrder_20260714_Revised_Cycle.md` |
| Cycle001 immutable plan | `Cocolon_前提資料/historical_baselines/emlis_ai/NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md` |

同名のappend-grown current Planはroute / evidence mapです。single current navigation ownerではありません。current nextを決めるときは必ず `08_cycle001_current_state.md` を読みます。

---

## 3. 変えない最終商品目的

### 3.1 final product destination

EmlisAIは、ユーザーがCocolonへ残した言葉・感情・カテゴリ・行動・時点・履歴を、入力直後に「読まれた形」として返し、その人が自分の状態と反応の線を外側から見られるようにする、Cocolonの最初の商品体験です。

返すものは次の三層です。Layer 1／2は全planの基礎であり、Layer 3だけがeligible historyを使うPlus／Premiumの条件付きartifactです。

1. **Layer 1「見えたこと」** — 今の入力で置かれている環境・状態・出力と、その入力内にある出来事・感情・願い・行動・努力・消耗等の関係を返す。
2. **Layer 2「Emlisから」** — Layer 1の具体的な観測claimに結び付けて、入力内に見える怖さ、努力、怒り、願い、迷い、消耗、安心、変化をEmlisの人間的な受け取りとして返す。
3. **Layer 3「記録の線」** — Plus／Premiumで必要条件を満たす場合だけ、今回入力と適格な過去の本人記録の具体的なつながりを0..1返す。

目標体験は、単なる慰めでも診断でもなく、「読まれた」「自分に何が起きているかが少し見えた」「ここに残すと自分の言葉が積み上がる」「もう一度残したい」へつながることです。

#### 3.1.1 Step 10 reviewed product contract

EmlisAIは、original input、各supplemental answer、question、Layer 1／2／3を一つのinput-history threadへ順番に保存します。ただし、同じthreadにあることとsemantic sourceとして再利用できることは別です。originalとsupplemental answerだけをuser-owned sourceとし、question本文とEmlis derived artifactを本人が述べたsourceへ昇格させません。

| Plan | source scope | visible target | question budget |
|---|---|---|---|
| Free | current threadのoriginalとsame-thread supplemental answersだけ | Layer 1、Layer 2。Layer 3なし | thread全体で0..1 |
| Plus | current threadとeligible owned history | Layer 1、Layer 2、条件成立時Layer 3 0..1 | thread全体で0..1 |
| Premium | current thread、eligible owned history、許可済み本人context | Layer 1、Layer 2、条件成立時Layer 3 0..1 | sequential 0..3 |

Premiumの商品contractの中心表現は次のとおりです。

> **Premiumでは、ユーザーの蓄積した本人情報から作られた、根拠付き・暫定的・修正可能な「ユーザー固有の解釈フレーム」を使い、ユーザー本人の辞書により近い位置から観測とReceptionを行う。**

このframeは本人情報から導く処理境界であり、本人が直接述べたsourceでもvisible evidenceでもありません。本人は参照範囲を確認・修正・拒否でき、Piece生成本文、Analysis推定／IF、過去Emlis本文を本人sourceとして使いません。

各roundはLayer 1／2を先に返します。重要unknownが残り、本人が続行を選び、budgetが残る場合だけquestion exact1を出します。一画面へ複数問を一括表示せず、skip、stop、分からない、無回答を正常終了として扱います。

P6 Structure Insightはcurrent input内の関係を見る能力としてLayer 1へ置き、全planに残します。P5 User Label Connectionは今回入力とeligible owned historyをつなぐ能力としてPlus／Premiumの条件付きLayer 3へ置きます。既存capability、context、user model、history search、P5、P6、Free history boundary testsはADAPT_AND_INHERIT候補ですが、generic fixed surfaceをtarget本文としてそのまま再利用しません。

    DOCUMENT_ID = CMEE_STEP10_ULTRA_FINAL_INTEGRATED_REVISION_PROPOSAL_20260821_V2
    DESIGN_IDENTITY = CMEE_THREE_CORE_INTEGRATED_DESIGN_20260821
    FORMAL_PRO_REVIEW = CONSUMED_EXACTLY_ONCE

この同期はlong-term product contractの明確化だけです。question system、thread persistence、Layer 3 product integration、API、DB、RN、runtime、activation、Cycle001、Product Readへのeffectは0であり、実装または次Phaseへ自動進行しません。

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

Step 10 targetでは、P6を全planのLayer 1、P5をPlus／PremiumのLayer 3へ配置します。phase番号は長期能力の発展履歴であり、表示Layer番号や実装順ではありません。P5／P6 familyの存在または実装historyを、target product integrationの完成へ変換しません。

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
| Gate B V1 | owner manifest / probeはvalid、independent verifierは`Path.read_text`へのunsupported `newline` argumentでidentity導出前に停止 | Runtime READY / readiness credit `0 / 0`。helper routeの失敗証拠 |
| latest Gate B V2 | pre-freeze actual-callがprojection verifierのconcrete `pathlib.PosixPath`拒否を検出。wheel取得、venv、install、pytestより前に停止 | `PREFREEZE_EXECUTABLE_PREFLIGHT_INVALID`。Runtime READY / readiness credit `0 / 0`。product / technical creditなし |
| approved method reflection | session-local helper routeをretireし、`GATE_B_DIRECT_NATIVE_PROCESS_ROUTE_V1`をselected methodにした | method decisionのみ。Gate B実行、runtime readiness、product / technical creditは発生しない |
| current direct-native Gate B | same-body synthetic preflight、fresh exact5/root、owner / independent `VALID / VALID / FULL_MATCH`、pytest version probe、required-role smoke、full-root reconciliation成立 | readiness observation canonical preimage未freezeで`RUNTIME_READINESS_OBSERVATION_IDENTITY_NOT_FROZEN`。Runtime READY / credit `false / 0` |
| Cycle001 | G5 technical creditはあるが、G6 reject後のacceptance evidenceなし | `NOT_ACCEPTED` |

### 5.4 current shared structural correction lane

current technical routeの唯一のownerは `08_cycle001_current_state.md` です。Gate B V1 / V2 helper routeはretiredです。Mashのapproved direct-native authorityもpost-preflight typed failureで閉じ、retry / reuseしません。

```text
SESSION_LOCAL_HELPER_ROUTE = RETIRED
LAST_GATE_B_METHOD = GATE_B_DIRECT_NATIVE_PROCESS_ROUTE_V1
LAST_GATE_B_METHOD_LIFECYCLE = CLOSED_CONSUMED_POST_PREFLIGHT_TYPED_FAILURE
CURRENT_SELECTED_METHOD = NONE_PENDING_MASH_METHOD_DECISION
RUNTIME_READY / READINESS_CREDIT = FALSE / 0

next administrative authority candidate exact1:
NLS_V3_STEP11_CYCLE001_G4_GATE_B_RUNTIME_READINESS_OBSERVATION_CANONICAL_PREIMAGE_METHOD_DECISION_V1

state = DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED
```

component PASSはblocker narrowingだけで、product / technical creditは0です。次候補は本書による実行承認ではなく、retry、reacquisition、root repair、fallback、body repair、third normal authority、Gate C以降は未実行です。comparator V2、denominator、acceptanceを変更せず、automatic progressionはfalseのままです。

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
2. **P8 question UX** — Layer 1／2、各roundで足りない一点、短い問い、回答に基づくrefined Layer 1／2を、privacy / plan / continuity境界内で実現する。Free／Plusはthread全体0..1、Premiumは逐次0..3を上限とする。

問いだけを返して即時観測を先送りする、Emlis本体の読感不足を質問ラリーで隠す、回答で元入力を上書きする、raw answerをpublic metaへ出す、問診・診断へ寄せることは禁止です。

### 7.2 current status

| item | current treatment |
|---|---|
| false-understanding prevention | P3でも維持するcurrent quality axis。G6でこの軸が悪化していないことは確認済みだが、問いシステム完成を意味しない |
| NLS v3 scope | `normal_observation` / future `pre_question_observation` / `refined_observation` のSurface境界を守る。問い必要性判定、問い文、回答保存、RN導線をNLS v3が勝手に実装しない |
| question-system implementation | plan別budget、input-history thread、source-role分離をtarget contractとして固定したが、current実装は `UNVERIFIED` |
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
- Gate B direct-native authorityはtyped failureで閉じ、Gate Bは未閉鎖、runtime READY / readiness creditは `false / 0` です。
- current next exact1はreadiness observation schemaに関するadministrative method decision候補で、別Mash承認が必要です。
- release-ready条件は成立していません。

### 9.2 unverified — 完了扱いしない

- P0〜P2のcurrent phase completion。
- P4〜P10のcurrent開始・completion。
- G7〜G10とCycle001 formal acceptanceの後続evidence。
- Cycle002〜010、最低1000件、saturation、final local gate。
- shadow、R8 rollback baseline、tester-only actual device、owner switch。
- question-system implementation / completion、refined observation end-to-end。
- input-history thread persistence、plan別question budget、Premium interpretive frame、P5／P6のtarget Layer product integration。
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
| 2026-08-11 | `CURRENT_ALIGNMENT_JUDGMENT` | Phase 8 pre-freeze terminalを反映。V1 / V2 helper routeをretireし、approved `GATE_B_DIRECT_NATIVE_PROCESS_ROUTE_V1`をselected methodとした。Gate B未閉鎖、Runtime READY false、readiness / product / technical credit 0を保持 |
| 2026-08-11 | `CONFIRMED_CURRENT_FACT` | direct-native Gate Bのcomponent checksは成立したが、authority-frozen readiness observation preimage欠落でtyped STOP。Gate B未閉鎖、readiness / product / technical credit 0 |
| 2026-08-21 | `UNCHANGED_NORMATIVE` | Step 10正式reviewをexactly once反映。input-history thread、Free／Plus／Premium source scope、question budget、Premium interpretive frame、Layer 1／2／3、P6 Layer 1／P5 Layer 3をlong-term product ownerへ同期。implementation／Cycle／Product Read effect 0 |

---

## 12. current terminal summary

```text
FINAL_PRODUCT_DESTINATION = UNCHANGED_NORMATIVE
CURRENT_PRODUCT_WORKSTREAM = P3_PRODUCT_READ_FEEL_V1
NLS_V3_STEP11_CYCLE001_ROLE = P3_SUPPORTING_TECHNICAL_PRODUCT_ROUTE
NLS_V3_STEP11_CYCLE001 = NOT_ACCEPTED
G5_TECHNICAL_GREEN = TRUE
G6_PRODUCT_READ_PASS = FALSE
CURRENT_SHARED_STRUCTURAL_CORRECTION = CURRENT_G4_B_RUNTIME_READINESS_ADMISSION_STOP
CURRENT_GATE_B = NOT_CLOSED
SESSION_LOCAL_HELPER_ROUTE = RETIRED
LAST_GATE_B_METHOD = GATE_B_DIRECT_NATIVE_PROCESS_ROUTE_V1
LAST_GATE_B_METHOD_LIFECYCLE = CLOSED_CONSUMED_POST_PREFLIGHT_TYPED_FAILURE
CURRENT_SELECTED_METHOD = NONE_PENDING_MASH_METHOD_DECISION
NEXT_ADMINISTRATIVE_AUTHORITY = NLS_V3_STEP11_CYCLE001_G4_GATE_B_RUNTIME_READINESS_OBSERVATION_CANONICAL_PREIMAGE_METHOD_DECISION_V1
NEXT_ADMINISTRATIVE_AUTHORITY_STATE = DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED
RUNTIME_READY = FALSE
READINESS_CREDIT = 0
GATE_B_TECHNICAL_CREDIT = 0
GATE_B_PRODUCT_CREDIT = 0
RUNTIME_READINESS_OBSERVATION_IDENTITY = NOT_FROZEN_BY_INDIVIDUAL_AUTHORITY
GATE_C_AUTHORIZATION = FALSE
P7_CURRENT = FALSE
P7_STATUS = FUTURE_UNVERIFIED
QUESTION_SYSTEM_IMPLEMENTATION = UNVERIFIED
STEP10_THREAD_PLAN_LAYER_CONTRACT = REVIEWED_DESIGNED_NOT_IMPLEMENTED
STEP10_PRODUCT_RUNTIME_EFFECT = 0
ACTUAL_DEVICE_COMPLETION = UNVERIFIED_NO_CREDIT
PILOT_COMPLETION = UNVERIFIED_NO_CREDIT
RELEASE_READY = FALSE
AUTOMATIC_PROGRESSION = FALSE
CURRENT_TECHNICAL_NAVIGATION_OWNER = 08_cycle001_current_state.md
```

## 12. 2026-08-11 current product-route update — Gate B phase1 command STOP

P3 Product Read Feel v1はcurrent product workstreamのままです。Cycle001は `NOT_ACCEPTED`、G4-Bはfirst unfinished Gateのままです。

latest single-use authority `NLS_V3_STEP11_CYCLE001_G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_DIRECT_NATIVE_PROCESS_RUNTIME_READINESS_CANONICAL_PREIMAGE_FROZEN_FRESH_ADMISSION_V1` はactivate exact1 / consume 0で、外部phase1 launcher construction errorによりSTOPしました。Python static compile、synthetic preflight、network、wheel、fresh runtime、probe、smoke、independent、reconciliation、40-field instance preimage、readiness observation id derivationは全て0です。Runtime READY、readiness credit、Gate B technical credit、product creditは全て成立していません。

next exact1は `NLS_V3_STEP11_CYCLE001_G4_GATE_B_EXTERNAL_PHASE1_INVOCATION_CONSTRUCTION_EXACT1_SINGLE_EXCEPTION_AND_ONE_FRESH_CANONICAL_PREIMAGE_ADMISSION_METHOD_OR_PRODUCT_DECISION_V1` という未承認の `METHOD_OR_PRODUCT_DECISION_CANDIDATE` です。P3またはCycle acceptanceを進めるauthorityではなく、external phase1 invocation / launcher construction exact1のsingle exceptionを一回だけ許可するかをMashが決める境界です。

```text
CURRENT_PRODUCT_WORKSTREAM = P3_PRODUCT_READ_FEEL_V1
NLS_V3_STEP11_CYCLE001 = NOT_ACCEPTED
CURRENT_SHARED_STRUCTURAL_CORRECTION = CURRENT_G4_B_RUNTIME_READINESS_ADMISSION_STOP
LATEST_GATE_B_AUTHORITY_LIFECYCLE = CLOSED_ACTIVATED_UNCONSUMED_COMMAND_CONSTRUCTION_ERROR_REMOTE_POSTVERIFIED
CURRENT_GATE_B = NOT_CLOSED
CURRENT_SELECTED_METHOD = NONE_PENDING_MASH_METHOD_OR_PRODUCT_DECISION
NEXT_CANDIDATE = NLS_V3_STEP11_CYCLE001_G4_GATE_B_EXTERNAL_PHASE1_INVOCATION_CONSTRUCTION_EXACT1_SINGLE_EXCEPTION_AND_ONE_FRESH_CANONICAL_PREIMAGE_ADMISSION_METHOD_OR_PRODUCT_DECISION_V1
NEXT_CANDIDATE_CLASS = METHOD_OR_PRODUCT_DECISION_CANDIDATE
NEXT_CANDIDATE_STATE = DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED
RUNTIME_READY = FALSE
READINESS_CREDIT = 0
GATE_B_TECHNICAL_CREDIT = 0
GATE_B_PRODUCT_CREDIT = 0
RUNTIME_READINESS_OBSERVATION_ID = NOT_DERIVED
GATE_C_AUTHORIZATION = FALSE
P7_CURRENT = FALSE
RELEASE_READY = FALSE
CURRENT_AUTHORITY_STOP = TRUE
AUTOMATIC_PROGRESSION = FALSE
```

## Current precedence update — 2026-08-12 V7

product destinationとminimum Gate distanceは変更しません。V7はconsumer-side exact3のimplementation / proof / publication sub-blockerだけを除去しました。live platform surface、readiness admission、Gate B closureは未実行です。

```text
CURRENT_PRECEDENCE_EFFECTIVE_DATE = 2026-08-12
CURRENT_NAVIGATION_OWNER = Cocolon_前提資料/08_cycle001_current_state.md
CURRENT_SELECTED_METHOD = GATE_B_RUNTIME_PREPARATION_CONTROLLER_FAMILY_V1_USING_PLATFORM_OPENED_EXEC_TIME_INHERITED_READ_ONLY_FD_MAPPING_V1_THEN_GITHUB_TRACKED_RUNTIME_ADMISSION_CHECKER_V1
FUNCTIONAL_PREPARATION_STATE = CONTROLLER_FAMILY_V1_FUNCTIONAL_EXACT7_WITH_PLATFORM_OPENED_EXEC_TIME_INHERITED_READ_ONLY_FD_MAPPING_V1_IMPLEMENTED_VERIFIED_REMOTE_POSTVERIFIED
LIVE_RUNTIME_EXECUTION_STATE = UNEXECUTED
CURRENT_BLOCKER = PLATFORM_EXEC_TIME_FD_MAPPING_SURFACE_AND_ALL_OTHER_ONE_SHOT_LIVE_PRECONDITIONS_NOT_FRESHLY_ESTABLISHED
CURRENT_AUTHORITY = NONE
LATER_LIVE_AUTHORITY = NOT_AUTHORED_NOT_APPROVED
NEXT_EXACT1 = NLS_V3_STEP11_CYCLE001_G4_GATE_B_PLATFORM_EXEC_TIME_FD_MAPPING_SURFACE_AND_ONE_SHOT_LIVE_NETWORK_RUNTIME_READINESS_ADMISSION_CANDIDATE
NEXT_CANDIDATE_CLASS = TECHNICAL_AUTHORITY_CANDIDATE
NEXT_CANDIDATE_SCOPE = LEVEL_3_MASH_DECISION_AND_APPROVAL_REQUIRED_SCOPE
NEXT_CANDIDATE_STATE = DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED
RUNTIME_READY = FALSE
READINESS_OBSERVATION_ID = NOT_DERIVED
GATE_B = OPEN
READINESS_GATE_B_TECHNICAL_PRODUCT_CREDIT = 0 / 0 / 0
GATE_C = NOT_AUTHORIZED
AUTOMATIC_PROGRESSION = FALSE
```

V7の`TECHNICAL_CREDIT`はconsumer-side source / contract / portable test / actual-DACの再利用可能な補正証拠だけを指します。Gate-B admissionのtechnical creditではなく、上記のGate creditは`0 / 0 / 0`のままです。

Evidence:
- mashos-api final head / tree: `99afecb1a30880bf42b9fde4932e5bba7e01e7d4` / `6f92113264ffef515bd2feba3c7e8ba82d0c0188`
- qualified-runner Actions run / job: `31608210201` / `94152538969`
- V7 Decision: `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4B_QualifiedRunnerV6PostimageVerificationAndPublicationV7_Decision_20260812.md`
- V7 Receipt: `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4B_QualifiedRunnerV6PostimageVerificationAndPublicationV7_BodyFree_Receipt_20260812.json`

## Current precedence update — 2026-08-13 exact100 and acceptance recomputation

P3 Product Read Feel v1 remains the current workstream. The exact100 run and
all100 Product QA are complete, but Cycle001 is not accepted.

```text
G4_B_MINIMUM_PREFLIGHT = PASS
G5_TECHNICAL_GATE = GREEN
G6_PRODUCT_READ_GATE = REJECTED
G8_EXACT100 = COMPLETE
G9_ALL100_READ = COMPLETE
G10_ACCEPTANCE = 7 / 14
G9_PASS_MINOR_MAJOR_BLOCKER = 0 / 2 / 40 / 58
CORPUS_INVALID = FALSE
CURRENT_CORRECTION_LANE = SHARED_STRUCTURAL_CORRECTION
NLS_V3_STEP11_CYCLE001 = NOT_ACCEPTED
P3_PRODUCT_COMPLETE = FALSE
RELEASE_READY = FALSE
AUTOMATIC_PROGRESSION = FALSE
```

This result is a product rejection on a valid frozen corpus, not a corpus
invalidation and not an NLS v3 method STOP.
