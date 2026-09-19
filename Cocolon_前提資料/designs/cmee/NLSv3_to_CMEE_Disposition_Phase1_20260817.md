---
document_id: COCOLON_NLSV3_TO_CMEE_DISPOSITION_PHASE1_REVIEWED_20260817
title: "NLSv3 → CMEE Disposition表 — 第1段階 再確認・補正版"
created_at: "2026-08-17 JST"
reviewed_at: "2026-08-17 JST"
decision_owner: "Mash"
work_partner: "華恋"
document_role: "NLSV3_TO_CMEE_MIGRATION_INPUT"
normative_status: "REVIEWED_NONAUTHORITY"
lifecycle: "PHASE1_REVIEWED_CORRECTED_READY_FOR_GITHUB_REFLECTION"
phase2_readiness: "READY_AFTER_DURABLE_GITHUB_REFLECTION"
recommended_github_path: "Cocolon_前提資料/designs/cmee/NLSv3_to_CMEE_Disposition_Phase1_20260817.md"
design_authority: false
implementation_authority: false
github_write: 0
automatic_progression: false
---

# NLSv3 → CMEE Disposition表  
## 第1段階 — NLSv3からCMEEへの継承照合結果（再確認・補正版）

## 0. 結論

Mashの認識どおり、最初に行う作業は **「NLSv3 → CMEE Disposition表」を作ること** で間違いありません。

ただし、表を先に想像で埋めるのではなく、次の確認を先に行いました。

1. `Cocolon_前提資料` と `Cocolon_前提資料/work_attitude_rules_for_karen/CURRENT_RULES.md` を確認。
2. freshなCocolon / mashos-api main、NLSv3関連Draft PR、CMEE関連Draft PRを確認。
3. NLSv3の設計、current alignment、Cycle001 current state、PR #2の実装・runner・failure情報を確認。
4. CMEEのFinal/Detailed Design、shared kernel、Emlis、Piece、Analysis、migration designを確認。
5. CMEE disabled WIP PR #3の実装とProduct Read FAILを確認。
6. current production、NLSv3 offline WIP、CMEE disabled WIPを別経路として分離。
7. その上で、architecture-level責任・資産を一度ずつ分類。

この時点でMashへ確認しなければ進められない質問はありませんでした。

**GitHub write、設計書修正、実装変更、Cycle001再開、Product Read再実行は行っていません。**

### 0.1 再確認で補正した点

初版の大方向と主要判断は維持できます。ただし、Ultra華恋が第2段階の実行資料として直接使うには、次の補正が必要でした。

1. Cycle001 candidate ingressの切替とproduction generation ownerの切替を、別の段階・別のMash判断として明示しました。
2. current CMEE設計に存在しない旧候補名を、current canonical contract名へ置換しました。
3. NLSv3のartifact identity／schema／version／lineage責任をDispositionへ追加しました。
4. safety triage／separate safety owner境界をDispositionへ追加しました。
5. machine判定とhuman Product Readの分離を、単なるfailure knowledgeではなくCMEE共通acceptance boundaryへ補正しました。
6. NLSv3の責任・資産と、移管時のdecision／gapを同じ分母に混ぜないよう、`責任・資産 exact46`と`migration boundary / gap exact5`へ分けました。
7. Ultra華恋が再導出せずに作業できるよう、source pathとCMEE target ownerの実行用indexを追加しました。
8. 第2段階のdesign修正と、第3段階のcurrent structure map修正を分離しました。

---

## 1. fresh確認基準

| 対象 | fresh確認ref | 今回の扱い |
|---|---|---|
| `MassyuRed/Cocolon` main | `de9c3d985053bbaaa7fc0d396e688cc2097ece40` | current main |
| Cocolon CMEE design Draft PR #30 | head `6beb496e46490e9d3c5804e468d2bdb133ac032a` | current CMEE design candidate |
| Cocolon Cycle001 Draft PR #29 | head `0854e21f92f841fd2cfdcef08b9e3117fc93f96a` | current Cycle001 terminal/current-state source |
| `MassyuRed/mashos-api` main | `a8ca4ddf7b7ae76bf7b3d73e74e3a5808d623428` | current production baseline |
| mashos-api NLSv3 Draft PR #2 | head `958c1b53f5b5894691e0b10e2d991fb8236d9f6f` | current NLSv3/Cycle001 offline WIP |
| mashos-api CMEE Draft PR #3 | head `06ce311b3ea728b06f83439d268a34bed917c01c` | disabled CMEE V1-A WIP / Product Read FAIL |

### current lane separation

```text
CURRENT PRODUCTION
  current RN/API
  -> current Emlis orchestration / generation owner
  -> current response contract / RN display

ACTIVE OFFLINE WIP
  NLSv3 / Cycle001
  -> mashos-api PR #2
  -> production ownerではない

DISABLED CMEE WIP
  CMEE V1-A
  -> mashos-api PR #3
  -> production ownerではない
  -> machine structural GREEN
  -> private human Product Read FAIL

TARGET — 二つの切替を混ぜない
  Phase A / Cycle001 re-entry:
    NLSv3の有効責任・資産をCMEEへ移管
    -> CMEE Cycle candidate ingress exact1
    -> NLSv3 direct recovery ingress 0

  Phase B / production cutover:
    Cycle proofと別のMash判断後
    -> CMEE Emlis generation owner exact1
    -> current production I5 direct generation ingress 0

  Phase AとPhase Bは別approval・別cutoverであり、同時実行を前提にしない
```

---

## 2. 用語上の重要な区別

本表では、次の三つを同じ意味にしません。

| 状態 | 意味 |
|---|---|
| **受け皿あり** | CMEE設計に、その責任を置けるownerまたはcontractがある |
| **一部実装あり** | disabled PR #3等に、責任の一部を実コードとして確認できる |
| **継承済み** | NLSv3の責任・symbol・test・assetがCMEEへ移され、旧ownerが退役条件まで固定された |

現時点で、CMEEは多くの**設計受け皿**を持っています。  
しかし、NLSv3からの**継承完了**を示すexact asset migrationとone-owner cutoverはまだ成立していません。

---

## 3. CMEE側の受け皿一覧

### 3.1 shared kernel

| 受け皿 | 受け持つ責任 | current状態 |
|---|---|---|
| `GenerationRequest`／`CoreSourceAdapter`／`SourceEnvelope` | owner、source role、version、privacy、original/supplemental分離 | designあり。PR #3に限定実装 |
| `EvidenceGraph`／evidence refs | source range、hash、根拠、元情報への帰還 | designあり。PR #3では`EvidenceRef`として限定実装 |
| `GroundedMeaningGraph` | meaning node、relation、unknown、epistemic state | designあり。PR #3に限定実装 |
| `ExperiencePlan`内のsemantic duties | required／optional／deferred duty、forbidden promotion、artifact plan | designあり。PR #3では`SourceOwnerUniverse`と`ExperiencePlan`へ一部集約 |
| `ExperiencePlan` | dutyを完成物の役割・順序・形式へbind | designあり。PR #3に限定実装 |
| `RealizationCandidateSet`／plan-bound realization | raw sourceではなくplanから候補・完成物を作る | designあり。Emlis限定実装 |
| `PositiveRealizationTrace`／`RealizationTraceItem` | visible unitをsource/meaning/duty/planへ戻す | designあり。PR #3では`VisibleUnitTrace`として限定実装 |
| trust／selection／`EngineOutcome` | added meaning、meaning loss、unknown promotion、hard validity、fail-closed | designあり。PR #3に限定実装 |
| `GenerationArtifactBundle`／artifact identity | product artifact identity、schema/version/lineage、private/public境界 | designあり。production接続0 |

### 3.2 EmlisAI専用ルート

| 受け皿 | 受け持つ責任 | current状態 |
|---|---|---|
| Emlis source adapter | current Emlis input、history、supplemental answerの変換 | designあり。PR #3はoriginal中心 |
| Emlis meaning extension | observation role、retention、Reception eligibility | designあり。限定実装 |
| sufficiency / clarification | NORMAL/LIMITED/ASK/UNAVAILABLE、問いの一点・負担 | designあり。interactive production未実装 |
| Observation duties | 何を見るか、relation/change/unknownをどう扱うか | designあり。限定実装 |
| bound Human Reception | visible observationへ具体的にbindした受け取り | designあり。限定実装だが商品FAIL |
| Emlis response plan | 「見えたこと」「Emlisから」、必要時unknown/question | designあり。production mapping未実施 |
| Emlis natural surface | 自然な日本語、非template、入力固有性、声、距離、深さ | designあり。PR #3 Product Read FAIL |
| body-only reverse | 完成本文からmeaning保持を逆確認 | design受け皿あり。PR #3 current WIPにはNLS相当owner未収容 |
| Emlis Product Read | body-fullで自然さ、読まれた感、商品価値を読む | 実施済みだがFAIL |

### 3.3 Piece専用ルート

| 受け皿 | 受け持つ責任 | current状態 |
|---|---|---|
| saved-input source adapter | 本人の保存入力をexact sourceとして採用 | future designのみ |
| Piece artifact intent | 他者へ何をどう伝えるか、must-keep、publicization | future designのみ |
| canonical Piece text | 本人の意味を保つ共有文 | future designのみ |
| visual specification | text、recipe、layout、renderer境界 | future designのみ |
| Piece meaning verification | 文＋画像で意味が薄まらず、食い違わないこと | future designのみ |
| Piece Product Read | 保存・共有したい品質、actual device可読性 | future designのみ |

### 3.4 分析構造専用ルート

| 受け皿 | 受け持つ責任 | current状態 |
|---|---|---|
| period source set | 採用記録、original/supplemental、期間、conflict | future designのみ |
| event frame / observed graph | 記録から点・関係・流れを作る | future designのみ |
| observed route | orderとcooccurrenceを因果へ昇格しない | future designのみ |
| unknown / annotation / conflict | 不明、仮説、protective/burdenを分離 | future designのみ |
| hypothetical IF graph | observedを変更せず、別identityでIFを作る | future designのみ |
| text/visual projection | mapの点・線・方向・分岐を表示 | future designのみ |
| Analysis reverse verification | node/edge/direction/IFをsource evidenceへ戻す | future designのみ |
| Analysis Product Read | 診断・予測に見えず、本人が理解・活用できる品質 | future designのみ |

---

## 4. NLSv3 → CMEE Disposition表

### 4.1 分類件数

- `CMEE共通部へ継承`: **18件**
- `EmlisAI専用ルートへ継承`: **15件**
- `Test / failure knowledgeとして保持`: **6件**
- `重複・競合`: **3件**
- `履歴として保持`: **1件**
- `運用外殻として退役`: **2件**
- `Piece用に将来改良`: **1件**
- `分析構造用に将来改良`: **1件**
- `Mash判断が必要`: **3件**
- `受け皿なし`: **1件**

合計は**exact51 classification rows**です。

- NLSv3の責任・資産とcross-core継承責任: **exact46**
- migration decision／prohibited duplicate／受け皿gap: **exact5**
  - D40、D46、D47、D48、D49

D40とD46–D49はNLSv3 assetそのものではなく、移管時にUltra華恋が守るdecision／gap行です。  
したがって、`architecture-level責任・資産の分母`と混ぜて「NLSv3に51個のassetがある」とは読みません。

### 4.2 classification rows exact51

| ID | NLSv3の責任・資産 | 現在の役割 | CMEE側の受け皿 | Disposition | 現在地 | 将来owner | 理由 | Mash確認 |
|---|---|---|---|---|---|---|---|---|
| D01 | App-Reachable Input Contract／current input projection | RN/APIから到達可能なEmlis入力形を固定し、offline corpusを実商品入力から逸脱させない。 | Emlis `source_adapter`。shared側はsource identityだけを受け持つ。 | **EmlisAI専用ルートへ継承** | 設計受け皿あり。PR #3 `source_kernel.py`に一部実装。ただしcurrent production接続0。 | CMEE Emlis route | 入力shapeはEmlis商品固有。owner/version/role等の一般則だけsharedへ分離する。 | 方針確定済み |
| D02 | original／supplemental／history等のsource role分離 | 元入力、追加回答、過去情報を混ぜず、originalを上書きしない。 | `GenerationRequest`／`CoreSourceAdapter`／`SourceEnvelope`／`EvidenceGraph`。PR #3では`SourceEnvelope`／`EvidenceRef`。 | **CMEE共通部へ継承** | 設計受け皿あり。PR #3はoriginal text slice中心に一部実装。三core共通化は未実測。 | CMEE shared kernel | 三商品すべてでsourceの役割混同を防ぐ基礎責任。 | 方針確定済み |
| D03 | exact evidence span／UTF-8・scalar range／hash／provenance | 意味・出力を元情報のexact箇所へ戻せるようにする。 | shared provenance/evidence contract。PR #3では`EvidenceRef`とsource freeze。 | **CMEE共通部へ継承** | PR #3で一部実装済み。ただしPiece画像・Analysis mapまでの共通性は未実測。 | CMEE shared kernel | 文章・画像・mapの全てで根拠追跡に必要。 | 方針確定済み |
| D04 | Semantic Obligation Inventoryの一般責任 | 入力に対し、残す意味、許される推論、unknown、禁止内容を列挙する。 | `ExperiencePlan`内のsemantic duties。PR #3では`SourceOwnerUniverse`／`SourceOwnerObligation`／`ExperiencePlan`。 | **CMEE共通部へ継承** | 受け皿あり・一部実装。NLSとCMEEに同種ownerが並ぶため重複解消が必要。 | CMEE shared kernel | must-keep／unknown／forbidden claimは三商品共通。ただし商品固有dutyは各routeへ残す。 | 方針確定済み |
| D05 | Emlis固有Semantic Obligation（Reception、Emlis構造、観測depth等） | Emlisとして何を観測し、どう受け取り、どこまで深めるかを決める。 | Emlis observation duties／`ExperiencePlan`／`ConversationalObservationPayload`。 | **EmlisAI専用ルートへ継承** | 設計受け皿あり。PR #3に一部実装。ただし商品品質FAIL。 | CMEE Emlis route | Piece・分析構造へEmlisの声や観測方式を押しつけない。 | 方針確定済み |
| D06 | semantic units／meaning nodes | 入力から意味単位を作り、文字列の寄せ集めではなく構造として扱う。 | `GroundedMeaningGraph`／`MeaningNode`。 | **CMEE共通部へ継承** | 設計・PR #3に受け皿あり。PR #2側にも別実装があり重複中。 | CMEE shared kernel | 三商品が同じsource-bound meaning基礎を利用できる。 | 方針確定済み |
| D07 | relation construction／predicate・argument・scope・polarity・time | 誰が何をどうしたか、条件、対比、時制、否定等の関係を保持する。 | shared meaning relations＋Emlis Japanese structure admission。 | **CMEE共通部へ継承** | 設計受け皿あり。PR #2に詳細知識、PR #3に限定実装。exact移管未実施。 | CMEE shared kernel（初期実証はEmlis route） | 意味関係は共通基礎。日本語解析の具体方式はEmlis先行で実測後に共通化判断。 | 方針確定済み |
| D08 | unknown／open slot／ambiguityの保持 | 分からないことを既知へ昇格せず、未確定範囲を残す。 | `GroundedMeaningGraph`の`UNKNOWN`／`CONFLICT`、Route B disposition、route固有unknown表示。 | **CMEE共通部へ継承** | 設計・PR #3に一部実装。PR #2のfailure knowledgeは未移管。 | CMEE shared kernel＋各route projection | unknownの存在は共通、見せ方と質問判断は商品固有。 | 方針確定済み |
| D09 | forbidden inference／negative knowledge | 原因、性格、診断、未来、意図等をsourceなしで足さない。 | `ExperiencePlan.forbidden_promotions`／Trust checks／route-specific hard reject。 | **CMEE共通部へ継承** | 設計受け皿あり。PR #3にguard連携あり。三core統一contractは未実測。 | CMEE shared kernel | 意味を足さない原則は三商品共通。 | 方針確定済み |
| D10 | Content Selectionの一般責任 | どのdutyを今回の完成物へ出すか、何を出さないかを決める。 | `ExperiencePlan.required_duties`／`optional_duties`／`deferred_duties`／`artifact_plans`。 | **CMEE共通部へ継承** | 設計受け皿あり。PR #3ではEmlis plan内に一部集約。 | CMEE shared kernel | surfaceより先に意味とdutyを選ぶ責任は共通。商品価値判断はroute owner。 | 方針確定済み |
| D11 | Emlis固有Content Selection／sufficiency／depth | NORMAL／LIMITED／ASK／UNAVAILABLE等、Emlisとして返す深さを決める。 | Emlis sufficiency decision／intent compiler。 | **EmlisAI専用ルートへ継承** | 設計受け皿あり。PR #3はLIMITED中心のdisabled実装。 | CMEE Emlis route | 同じ意味でもPiece・Analysisとは商品目的が異なる。 | 方針確定済み |
| D12 | Discourse Plan／plan-before-surface／duty binding | 本文を先に書かず、意味・順序・役割・必須dutyをplanへ固定する。 | `ExperiencePlan`のduties／ordering constraints／artifact plansとplan-bound realization。 | **CMEE共通部へ継承** | 設計・PR #3に一部実装。NLS側と二重owner。 | CMEE shared kernel | 文章・画像仕様・map projectionの全てで完成物前の計画が必要。 | 方針確定済み |
| D13 | Emlis visible block order／二段構成 | 「見えたこと」「Emlisから」、必要時のunknown／questionの並びを決める。 | `ConversationalObservationPayload`／Emlis response plan。 | **EmlisAI専用ルートへ継承** | 設計・PR #3に一部実装。現行表示契約への接続0。 | CMEE Emlis route | Emlisの商品形式であり、他coreの共通仕様にしない。 | 方針確定済み |
| D14 | typed AST／中間構造 | 文字列置換ではなく、型を持つ意味・計画・surface構造を経由させる。 | `GroundedMeaningGraph`＋`CoreProductIntent`＋`ExperiencePlan`＋typed artifact contracts。 | **CMEE共通部へ継承** | 責任の受け皿あり。NLSのAST class／schemaそのものを移す判断は未実施。 | CMEE shared kernel | 継承対象は「型付き中間構造を持つ責任」。NLSの具体AST bytesを正本にしない。 | 方針確定済み |
| D15 | semantic anchors／must-keep contract | 出力中の各意味をsource、duty、relationへ結び、意味落ちを検出する。 | meaning refs／source commitments／plan bindings／trace。 | **CMEE共通部へ継承** | 設計・PR #3に一部実装。PR #2のanchor failure knowledgeは未移管。 | CMEE shared kernel | 三商品の完成物を元情報へ戻す共通基盤。 | 方針確定済み |
| D16 | plan-bound realizationの一般責任 | surface generatorがraw sourceを自由に読み直さず、approved planから完成物を作る。 | `RealizationCandidateSet`／`GenerationArtifactBundle`／positive trace。 | **CMEE共通部へ継承** | 設計受け皿あり。PR #3でEmlis限定実装。第2consumerで共通性を再確認。 | CMEE shared kernel（最初はEmlis route内） | 意味の勝手な追加やraw replayを防ぐ共通原則。 | 方針確定済み |
| D17 | 日本語自然化／Emlis voice／anti-template／repetition reduction | 意味を保ったまま自然で、入力固有で、Emlisらしい文章へする。 | Emlis observation realizer＋Emlis Product Read。 | **EmlisAI専用ルートへ継承** | 設計受け皿あり。PR #3はmachine GREENだがProduct Read FAIL。 | CMEE Emlis route | 現時点ではEmlis商品品質の中核。第2consumer実測前にsharedへ固定しない。 | 方針確定済み |
| D18 | Emlis natural-surface multi-candidate generation | 同じ意味を保つ複数surface候補を作り、単一templateへの固定を避ける。 | Emlis realization candidate set／candidate generation stage。 | **EmlisAI専用ルートへ継承** | 設計上の受け皿あり。PR #3 exact8は完成したmulti-candidate ownerではない。 | CMEE Emlis route | まずEmlisで商品効果を実証し、他coreへ先回り共通化しない。 | 方針確定済み |
| D19 | candidate comparator／selection | 意味保持と商品品質を満たす候補を選び、意味の違う候補をsurface点だけで混同しない。 | Emlis candidate selector／TrustAssessment／human Product Read。 | **EmlisAI専用ルートへ継承** | 設計受け皿あり。PR #3のrunner comparatorは構造確認で、商品selection ownerではない。 | CMEE Emlis route | machine selectionと人間の商品確認を分ける必要がある。 | 方針確定済み |
| D20 | Hard Gate／semantic validation | 意味落ち、意味追加、unknown確定、relation破壊、raw replay等をrejectする。 | shared trust pipeline＋route-specific trust checks。 | **CMEE共通部へ継承** | 設計・PR #3に一部実装。NLSのGate名・運用chainは継承しない。 | CMEE shared kernel＋各route | 検査責任は必要だが、補助運用外殻ではなく商品生成unit内に置く。 | 方針確定済み |
| D21 | body-only inverse／完成文からの意味保持再確認 | 完成した本文だけを読み、元入力のmust-keep meaningが残るかを逆確認する。 | Emlis body-only reverse check／Emlis Product Read前提。 | **EmlisAI専用ルートへ継承** | 設計受け皿あり。PR #3 current exact8にはNLS相当の独立body-only inverse ownerが未収容。 | CMEE Emlis route | 最優先でEmlisへ移す。PieceとAnalysisは別方式へ改良する。 | 方針確定済み |
| D22 | safe abstention／fail closed／UNAVAILABLE | 意味ある安全な完成物を作れないとき、generic fillerや旧route fallbackを返さない。 | common `EngineOutcome` semantics＋route-specific failure dispositions。 | **CMEE共通部へ継承** | 設計・PR #3に一部実装。 | CMEE shared kernel | 三商品に共通する結果境界。 | 方針確定済み |
| D23 | Observation taxonomy／観測duty | CURRENT_STATE、RELATION、CHANGE、INTENTION、CONSTRAINT等、Emlisが何を見るかを決める。 | `EmlisMeaningGraph` extension／Observation duties。 | **EmlisAI専用ルートへ継承** | 設計・PR #3に限定実装。 | CMEE Emlis route | 観測対象と深さはEmlisの商品責任。 | 方針確定済み |
| D24 | Human Reception binding | Receptionをgeneric共感ではなく、visible observationの具体claimへ結びつける。 | `BOUND_HUMAN_RECEPTION` duty／`ConversationalObservationPayload.reception_block`。 | **EmlisAI専用ルートへ継承** | 設計・PR #3に一部実装。ただしProduct Read FAIL。 | CMEE Emlis route | Emlisらしさと「読まれた感」の中核。他coreへ持ち込まない。 | 方針確定済み |
| D25 | 「見えたこと」「Emlisから」の商品構成 | 観測とEmlisの受け取りを分け、同義反復を防ぐ。 | Emlis visible payload／response plan。 | **EmlisAI専用ルートへ継承** | 設計・PR #3に一部実装。current production mapping未実施。 | CMEE Emlis route | Emlisの商品形式そのもの。 | 方針確定済み |
| D26 | question need／一点確認／回数・負担 | 不足を埋めるためだけに問いを出し、質問でgeneratorの弱さを隠さない。 | Emlis sufficiency／clarification contract／V1-B。 | **EmlisAI専用ルートへ継承** | 設計受け皿あり。production interactive questionは未実装・未承認。 | CMEE Emlis route | 問いはEmlis専用の商品責任。 | 方針確定済み |
| D27 | supplemental answer refinement | 回答をoriginalと別sourceとして追加し、target unknownだけを深める。 | shared supplemental source role＋Emlis refined graph／artifact lineage。 | **EmlisAI専用ルートへ継承** | 設計受け皿あり。PR #3／productionでは未完成。 | CMEE Emlis route（source roleはshared） | source分離は共通、問い後の深化はEmlis固有。 | 方針確定済み |
| D28 | positive realization trace | 完成物の各visible unitをsource／meaning／duty／planへ戻す。 | `PositiveRealizationTrace`／`RealizationTraceItem`／`GenerationArtifactBundle`。PR #3では`VisibleUnitTrace`。 | **CMEE共通部へ継承** | 設計・PR #3に一部実装。design typeとPR #3 typeの名称・境界driftあり。 | CMEE shared kernel | 三商品で完成物の根拠を確認する共通責任。 | 方針確定済み |
| D29 | private body-full／public body-free分離 | 商品本文を人間が読める一方、GitHub等へprivate raw bodyを残さない。 | shared privacy classification／body-free projection。 | **CMEE共通部へ継承** | 設計・PR #2 runner・PR #3に実装知識あり。 | CMEE shared kernel＋evaluation tooling | 三商品と評価資産に共通するprivacy境界。 | 方針確定済み |
| D30 | Cycle001 current100 corpus／case identity／App-Reachable Input | 実商品へ到達可能な100件を固定し、評価母集団を保つ。 | CMEE Cycle re-entry用test vector／acceptance source。 | **Test / failure knowledgeとして保持** | NLS側に現存。CMEEへのexact asset owner・import pathは未定。 | CMEE Emlis acceptance assets | generation ownerにはせず、同じ入力でbefore／afterを比較するために継承。 | 方針確定済み |
| D31 | 100件単位の累積確認／過去入力再検証 | 修正が新規caseだけでなく過去caseを壊していないか確認する。 | CMEE Emlis Cycle acceptance procedure。 | **Test / failure knowledgeとして保持** | NLS側に現存。CMEE migration docは方針を持つがexact procedure owner未固定。 | CMEE Emlis acceptance | 商品回帰確認として有効。Gate chainとしては持ち込まない。 | 方針確定済み |
| D32 | changed-output reread | 修正で変わった回答を人間が再読し、machine差分だけで受入しない。 | CMEE Emlis Product Read workflow。 | **Test / failure knowledgeとして保持** | 評価知識として有効。CMEE exact tooling owner未固定。 | CMEE Emlis acceptance | 商品品質の直接確認に必要。 | 方針確定済み |
| D33 | machine判定とhuman商品確認の分離 | 構造GREENを商品品質PASSへ読み替えない。 | CMEE implementation order／Product Read boundary。 | **CMEE共通部へ継承** | CMEE設計・PR #3 FAIL記録に反映済み。運用の定着は今後。 | CMEE共通acceptance boundary＋各route Product Read owner | 三商品共通の受入境界として固定し、PR #3でmachine 8/8でも商品FAILした事実を回帰知識として保持する。 | 方針確定済み |
| D34 | Emlis Product Read軸／body-full全件読取 | 自然さ、非template、入力固有性、Reception、depth、また入力したさを読む。 | Emlis Product Read／private actual before-after review。 | **EmlisAI専用ルートへ継承** | PR #3で実施しFAIL。受け皿はあるが合格済みではない。 | CMEE Emlis route＋Mash/華恋 | Emlisの商品受入はEmlis専用。machine oracleへ置換しない。 | 方針確定済み |
| D35 | recurring failure family／before-after比較 | 復唱、テンプレ、意味落ち、generic Reception等の再発と改善を追う。 | failure knowledge／regression vectors／product correction input。 | **Test / failure knowledgeとして保持** | NLS・incident・PR #3に分散。CMEE exact failure catalog owner未固定。 | CMEE Emlis acceptance assets | 補助経路ではなく、実際の商品修正へ直結する知識として残す。 | 方針確定済み |
| D36 | lexical／attachment authority matrixとcurrent blocker | predicate・argument・case・governor・open slot等の不足を分類する。 | Emlis Japanese structure実装知識＋negative/adversarial test vectors。 | **Test / failure knowledgeとして保持** | PR #2／Cycle001に現存。CMEEへimplementationとして丸ごと移していない。 | CMEE Emlis route tests／implementation knowledge | 過去のblockerをcurrent prerequisiteへせず、商品意味保持の失敗知識として使う。 | 方針確定済み |
| D37 | 自然文失敗例／anti-template corpus／minor-major分類 | 入力固有性、自然さ、意味保持、商品読後感の失敗を再現する。 | Emlis Product Read corpus／regression vectors。 | **Test / failure knowledgeとして保持** | 概念受け皿はあるが、NLS assetのexact migration ownerは未収容。 | CMEE Emlis acceptance assets | PR #3 Product Read FAIL修正へ直結する。exact asset mappingはPhase 2設計補正対象。 | 方針確定済み |
| D38 | PR #2 semantic／relation／mutation modules | 意味単位、relation、semantic restatement、failure mutationを実装する。 | shared graph／relation contracts＋Emlis tests。 | **重複・競合** | PR #2とCMEE設計／PR #3が同種責任を別ownerで保持。 | 最終ownerはCMEE。PR #2からconcept／usable symbol／test vectorだけ抽出。 | migration docの既定どおり`EXTRACT_CONCEPT_OR_TEST_VECTOR`。二重現役化しない。 | 方針確定済み |
| D39 | PR #2 large recovery／natural surface／semantic overlay | source、meaning、Reception、plan、surface、inverseを一つのoffline recovery候補へ抱える。 | CMEE shared＋Emlis routeへ責任分解。 | **重複・競合** | 現在PR #2のoffline WIP。CMEE packageから丸ごと呼ぶと責任境界が崩れる。 | 最終ownerはCMEE。direct recovery ingressはCycle cutover時に退役。 | migration docの既定どおり`DO_NOT_WRAP_AS_CMEE`。 | 方針確定済み |
| D40 | NLSv3を独立した第二active生成エンジンとして残すこと | CMEE移管後もNLS direct candidate ingressが現役ownerになる状態。 | 受け皿不要。CMEE `MeaningExperienceEngine.generate()` exact1へ一本化。 | **重複・競合** | 現在はproductionではなくoffline PR #2 WIP。将来の二重active化は禁止。 | CMEE exact1 | final active generation owner exact1を守る。 | 方針確定済み |
| D41 | 旧NLS設計step／RC番号／過去snapshot | 当時の設計・試行・停止理由を復元する。 | historical baseline／Git history。 | **履歴として保持** | Cocolon historical baselines／Git historyに保持。 | historical only | current routeやimplementation prerequisiteにしない。 | 方針確定済み |
| D42 | 長いGate／Receipt／authority／handoff chain | 過去の承認・証明・停止を連鎖管理する運用外殻。 | NLSv3固有の長いchainはcurrent routeへ継承しない。一般ruleが要求する最小durable recordingは既存canonical ownerに残す。 | **運用外殻として退役** | CMEE migration designで`RETIRED_HISTORICAL_NONREUSABLE`。 | historical only（最小durable recordingは既存一般owner） | chain増殖をcurrent prerequisiteへ戻さない。必要な最小記録まで廃止する意味ではない。 | 方針確定済み |
| D43 | G0–G10 checker／controller／executor／FD／transport family | 実行環境・証明・補助経路を管理する大規模外殻。 | current routeの受け皿不要。 | **運用外殻として退役** | CMEE migration designで退役済み。失敗知識だけ保持。 | historical only | 必要な確認はactual product improvement unit内の最小確認へ戻す。 | 方針確定済み |
| D44 | NLS body-only reverse思想のPiece適用 | 共有文・画像へ変換後も本人の意味、条件、文章と画像の整合が残るか確認する。 | Piece must-keep coverage／canonical text＋visual spec verification。 | **Piece用に将来改良** | Piece詳細設計に受け皿あり。runtime未実装・未承認。 | CMEE Piece route | Emlis本文逆読をそのまま流用せず、文章＋画像artifact向けに作り替える。 | 方針確定済み |
| D45 | NLS reverse verification思想の分析構造適用 | mapの点・線・方向・unknown・IFを元記録とevidenceへ戻す。 | Analysis evidence-bound node/edge／unknown gap／observed-hypothetical separation。 | **分析構造用に将来改良** | Analysis詳細設計に受け皿あり。runtime未実装・未承認。 | CMEE Analysis route | 文章逆読ではなく、graph provenanceとepistemic partition確認へ作り替える。 | 方針確定済み |
| D46 | 将来の外部AIによる自然表現補助 | CMEEが決めた意味を変えず、自然な候補表現を作る可能性。 | 将来のroute-local candidate provider。meaning authorityにはしない。 | **Mash判断が必要** | 現在はモデルなし。dependency／provider採用0。 | Mash decision＋CMEE route owner | 品質・費用・提携・収益条件が変わった場合だけ再判断。 | 将来判断 |
| D47 | Cycle001 acceptance contract変更／CMEE ingress re-entry | NLS current100のcandidate ingressをCMEE exact1へ切り替え、旧recovery ingressを止める。 | CMEE migration §C0–C2／fresh `08_cycle001_current_state.md`。 | **Mash判断が必要** | 未承認。CMEE design／PR #3はCycle navigation ownerではない。 | Mash＋Cycle001 current owner | acceptance denominator・fixture・契約を無断変更しないため。 | 別途明示判断 |
| D48 | current production I5からCMEEへのone-owner cutover | 現行Emlis生成ownerをCMEE exact1へ切り替え、旧direct ownerを同一packetでunreachableにする。 | CMEE production cutover／ReplyEnvelope mapping／current structure map。 | **Mash判断が必要** | current productionは変更なし。NLS PR #2もCMEE PR #3もproduction ownerではない。 | Mash＋CMEE Emlis cutover owner | actual Product Read・Cycle proof・API/RN mapping後にのみ判断できる。 | 別途明示判断 |
| D49 | NLSv3→CMEE exact asset migration manifest | どのsymbol、test、fixture、failure vectorを、どのCMEE ownerへ移すかを一意に記録する。 | 現行CMEE docsにはfamily-level dispositionはあるが、asset-level exact owner表がない。 | **受け皿なし** | 今回のDisposition表が最初のarchitecture-level受け皿。symbol/test単位は未作成。 | Phase 2のImplementation/Migration design owner | 丸ごとwrap・二重owner・test資産の取りこぼしを防ぐため必要。 | 今回の表確認後に設計補正 |
| D50 | artifact identity／schema／version／parent lineage | candidate、AST、rendered surface、evidence、resultのidentityと親子関係を固定し、変更後も同じartifactを指せるようにする。 | `GenerationArtifactBundle.artifact_id@artifact_version`、schema/version sets、`lifecycle_bindings`、`projection_of`、`EngineOutcome`。 | **CMEE共通部へ継承** | NLS側にartifact contract／candidate version知識が存在し、CMEE設計にも受け皿がある。ただしexact asset移管は未実施。 | CMEE shared kernel | 三商品にversioned artifact identityが必要。過去RC番号そのものはD41どおり履歴へ残し、current identity ownerへしない。 | 方針確定済み |
| D51 | safety triage／separate safety owner境界 | high-care／emergency材料を通常Observationへ混ぜず、normal generationとseparate safety ownerを分離する。 | shared `EngineOutcome.SEPARATE_SAFETY` semantics＋Emlis route固有のsafety triage／既存safety boundary owner。 | **EmlisAI専用ルートへ継承** | current productionにsafety ownerがあり、CMEE設計にも受け皿がある。PR #3はproduction未接続でありcutover済みではない。 | CMEE Emlis route＋既存Emlis safety boundary owner | outcome statusの形は共通でも、何をseparate safetyへ渡し、何を表示するかはEmlisの商品・Safety責任。 | 方針確定済み |
---

## 5. 重複・競合の具体箇所

| 競合ID | NLSv3側 | CMEE側 | 現在の問題 | 解消方針 |
|---|---|---|---|---|
| C01 | Semantic Obligation Inventory | `ExperiencePlan`内のsemantic duties、PR #3 `SourceOwnerUniverse`／`ExperiencePlan` | 同じ「残す意味・unknown・禁止内容」を複数ownerが持つ | generic dutyはshared exact1、Emlis dutyはEmlis exact1へ分割 |
| C02 | semantic units／relation authority／open slots | `GroundedMeaningGraph`／Japanese structure | PR #2とPR #3に別実装が存在 | PR #2からconcept・usable symbol・mutation testを抽出し、CMEE ownerへ移す |
| C03 | Content Selection／Discourse Plan | `ExperiencePlan`のduties／ordering／artifact plans／Emlis response plan | duty、plan、visible orderの境界が重なる | shared planとEmlis product planを明示分離 |
| C04 | NLS natural surface／product recovery | CMEE plan-bound realizer／Emlis realizer | PR #2 large moduleを呼ぶとCMEEがwrapper化する | large moduleは呼ばず、必要責任だけCMEE final topologyへ移す |
| C05 | body-only inverse／semantic overlay | CMEE trace／trust／Emlis reverse check | design受け皿はあるがPR #3にNLS相当ownerがない | Emlis routeへ独立責任として移管し、Product Read前に実行 |
| C06 | PR #2 direct recovery ingress | `MeaningExperienceEngine.generate()` | Cycle再開時に二つのcandidate ingressが生まれる危険 | CMEE ingress exact1と同時に旧direct ingress 0 |
| C07 | current production generation owner | target CMEE generation owner | production、NLS、CMEEの三経路が見えにくい | actual受入後、同一cutoverでCMEE exact1へ一本化 |
| C08 | NLS guards／test helpers | CMEE trust pipeline／existing common guards | helperやtestがmeaning authority化する危険 | guardはnon-regression、意味ownerはsource/graph/plan exact1 |

---

## 6. 未収容・曖昧・設計補正が必要な点

### 6.1 明確な未収容

1. **NLSv3 → CMEE exact asset migration manifest**
   - family-level方針はCMEE migration designにあります。
   - しかし、symbol、test、fixture、runner、failure vector単位の「移管先／保持／退役」はまだありません。
   - D49をPhase 2の中心補正にします。

2. **NLS body-only inverseのcurrent CMEE実装owner**
   - CMEE Emlis designには受け皿があります。
   - PR #3 current exact8はplan-bound trace／validationを持ちますが、NLSv3相当の独立body-only inverseをcurrent responsibilityとして列挙していません。
   - 設計と実装順に明記が必要です。

3. **NLSの商品失敗assetのexact owner**
   - natural Japanese、anti-template、minor/major、changed-output reread、recurring failure familyは有効です。
   - ただし、どのcorpus／test／Product Read ownerへ移すかがexactではありません。

4. **artifact identity／schema／version／lineageの移管**
   - NLSv3にはartifact contract、candidate version、AST/rendered identity、parent hashの知識があります。
   - CMEEには`GenerationArtifactBundle`、artifact version、projection lineageの受け皿があります。
   - old RC番号は履歴化しつつ、identity責任とusable test vectorだけをCMEEへ移すexact mappingが必要です。

5. **separate safety ownerの非破壊移管**
   - normal Observationとhigh-care／emergencyのseparate ownerを混ぜない責任は、商品経路上の必須境界です。
   - shared outcome statusだけでなく、current Emlis safety triage／boundary ownerをproduction cutoverまで維持する記述が必要です。

### 6.2 設計とcurrent WIPのdrift

| 項目 | CMEE design | PR #3 current WIP | 補正必要性 |
|---|---|---|---|
| source/evidence contract | design: `GenerationRequest`／`CoreSourceAdapter`／`SourceEnvelope`／`EvidenceGraph` | PR #3: `GenerationRequest`／`SourceEnvelope`／`EvidenceRef`を`source_kernel.py`へ集中 | adapter、evidence graph、source kernelの責任境界をreconcile |
| duty contract | design: `ExperiencePlan`内のsemantic duties | PR #3: `SourceOwnerUniverse`＋`ExperiencePlan` | denominator、owner universe、product duty、planのexact ownerを一意化 |
| trace/evidence | design: `PositiveRealizationTrace`／`RealizationTraceItem`／`GenerationArtifactBundle` | PR #3: `VisibleUnitTrace`／`CommonGuardProof` | product traceとguard proofを混同しない |
| target topology | shared files＋`cores/emlis/*` | `source_kernel.py`＋`emlis_v1a.py`へ集中 | current WIPを最終形と誤認せず、actual product correction時に責任分離 |
| reverse verification | Emlis body-only reverseを設計 | current handoffの実装責任一覧に明示なし | NLSからの継承ownerを追加 |
| Product quality | actual high-quality outputがcompletion | machine exact8 GREEN、Product Read FAIL | 技術GREENを商品成果にしない |

### 6.3 将来設計であり、current実装ではないもの

- Pieceの文章＋画像向けmeaning verification。
- 分析構造のnode／edge／direction／unknown／IF reverse verification。
- external AIによる自然表現補助。
- Cycle001 ingress cutover。
- production one-owner cutover。

これらを「受け皿が設計にある」ことだけで「継承済み」「実装済み」としません。

---

## 7. CMEE設計書の修正候補

第2段階では、以下を**Disposition結果に必要な範囲だけ**修正候補とします。  
この文書作成時点では、まだ修正していません。

| 優先 | 第2段階の修正対象候補 | 必要な補正 | 修正理由 |
|---:|---|---|---|
| 1 | CMEE Final Technical Design | NLSv3から継承する区分、Cycle cutoverとproduction cutoverの分離、CMEE exact1への最終一本化、旧owner退役原則 | 最上位の移管方針を一意にする |
| 2 | `designs/cmee/v1/00_read_first.md` | current production／NLS PR #2／CMEE PR #3／target、Disposition表のnon-authority lifecycle | 旧snapshotやWIP混同を防ぐ |
| 3 | Shared Kernel / Runtime Contracts | D02–D04、D06–D10、D12、D14–D16、D20、D22、D28–D29、D33、D50のcanonical owner mapping | generic責任の二重ownerと旧候補名を解消 |
| 4 | Emlis V1-A Detailed Design | D01、D05、D11、D13、D17–D27、D34、D51のNLS継承、特にbody-only inverseとseparate safety | NLSの商品中核をEmlis routeへ落とす |
| 5 | JSON Schema / Versioning | D14、D28、D29、D50のartifact identity／schema／lineage mapping | old RC identityをcurrent CMEE identity ownerへ誤継承しない |
| 6 | Implementation Order / Migration / Verification | D30–D43、D47–D51のasset-level mapping、二段階cutover、retirement | 丸ごとwrap、test取りこぼし、二重ingressを防ぐ |
| 7 | Piece Detailed Design | D44のNLS reverse思想を文章＋画像用へ改良する明示 | Emlis実装の流用ではなくPiece ownerへ継承 |
| 8 | Analysis Detailed Design | D45のreverse思想をmap provenance／epistemic partitionへ改良する明示 | 点・線・IFを文章逆読で扱わない |

### 7.1 第3段階へ送るmap修正

次は第2段階の設計補正が確定した後に行い、第2段階へ混ぜません。

- `current_structure/00_three_core_and_cmee_read_first.md`
- `current_structure/01_emlis_ai_current_structure.md`
- `current_structure/04_cmee_current_structure.md`
- 必要な場合だけ`00_karen_read_first.md`のrouting pointer

第3段階では、current production、NLSv3 offline WIP、CMEE disabled WIP、Cycle cutover target、production cutover targetを一目で分離します。

### 修正しないもの

- NLSv3を丸ごとCMEE packageから呼ぶ記述。
- PR #2 large recovery modulesをCMEEの正式subengineにする記述。
- Gate／Receipt／authority chainの再導入。
- provider／dependency／executorだけを先行させるphase。
- Piece／AnalysisをEmlisと同時に実装する記述。
- Product Read FAILのままcandidate readyとする記述。

---

## 8. Mashへ普通の言葉で説明すると

NLSv3で作ったものは、捨てる対象ではありません。  
ただし、NLSv3という大きな塊をそのままCMEEの中へ入れるのも違います。

NLSv3の中には、実際には四種類のものが混ざっています。

### 8.1 CMEEの土台へ移すもの

- 元の情報を守る仕組み。
- 誰の情報か、何がoriginalかを混ぜない仕組み。
- 残す意味、分からないこと、言ってはいけないことを決める仕組み。
- 意味から計画を作り、計画から完成物を作る仕組み。
- 完成物を元の意味へ戻して確認するための根拠。

これはEmlis、Piece、分析構造で共通して使える土台です。

### 8.2 EmlisAIだけへ移すもの

- 何を観測するか。
- 「見えたこと」と「Emlisから」。
- Emlisの声、距離、深さ。
- Human Reception。
- 問いが必要か、何を一点だけ聞くか。
- 自然な日本語と非template品質。
- Emlis本文を完成後に逆に読み、意味が残っているか確認すること。
- Emlisの商品として読み、Mashと華恋が受け入れること。

これはPieceや分析構造へ共通化しません。

### 8.3 testと失敗知識として残すもの

- current100 corpus。
- App-Reachable Input Contract。
- 100件単位の再確認。
- changed outputの再読。
- machineとhumanの分離。
- recurring failure family。
- natural Japanese／anti-templateの失敗例。
- lexical／relation／attachmentの失敗知識。
- before／after比較。

これらは生成ownerではありませんが、CMEEが同じ失敗を繰り返さないために重要です。

### 8.4 current routeへ持ち込まないもの

- 過去RC番号。
- 長いGate／Receipt／authority chain。
- controller／executor／FD／transport。
- G0–G10の運用外殻。
- 過去STOPをcurrent prerequisiteにすること。
- PR #2 large recovery moduleを丸ごとCMEEから呼ぶこと。

履歴は消しませんが、現役の仕事へ戻しません。

---

## 9. 今回の最重要発見

1. **NLSv3の主要思想には、CMEE設計上の受け皿が概ねあります。**
2. **しかし「受け皿あり」と「継承済み」は別です。**
3. **PR #3はNLS継承の完成形ではなく、shared責任とEmlis責任が少数fileへ集中したdisabled WIPです。**
4. **PR #3はmachine structural GREENでも、private human Product ReadはFAILです。**
5. **最優先で足りないのは、NLS body-only inverseの商品責任と、natural Japanese／anti-template／current100 assetのexact移管です。**
6. **PR #2を丸ごとCMEEへ包むと、同じ責任を二つの現役ownerへしてしまいます。**
7. **最終形はCMEE exact1への一本化ですが、先にCycle candidate ingressを切り替え、別の受入・Mash判断後にproduction generation ownerを切り替えます。二つを同時cutoverにしません。**
8. **Pieceと分析構造には思想を継承しますが、Emlis本文の方式をそのまま流用しません。**
9. **今回の照合で、NLSv3の責任・資産とcross-core継承責任exact46、migration decision／gap exact5、合計exact51を分類しました。**
10. **次はこの表を基に、必要なCMEE設計書だけを修正する第2段階です。**

---

## 10. Mash判断が必要になる時点

今回のDisposition作成を進めるための追加質問はありませんでした。

今後、Mashの別判断が必要なのは次の境界です。

1. 再確認・補正版をCocolon Draft PR #30へnon-authority migration inputとして置き、第2段階の設計修正根拠として採用するか。
2. Cycle001のcandidate ingressをCMEE exact1へ変える時。
3. current productionをCMEE exact1へcutoverする時。
4. 将来、外部AIを自然表現の候補生成に使う時。
5. Piece／分析構造の実装・activationを開始する時。

それまでは、設計受け皿の確認を実装承認やproduction変更へ自動変換しません。

---

## 11. Ultra華恋 実行用evidence index

このindexは、各行を再び一から探索せず、第2段階でactual sourceとtarget design ownerへ到達するためのものです。  
pathは上記fresh refで読むものとし、main／PR headが進んだ場合は新headを再確認します。

| 対象Disposition | NLSv3／current evidence owner | CMEE target owner | 第2段階で行うこと |
|---|---|---|---|
| D01–D05、D23–D27、D51 | immutable NLSv3 Detailed Design、Current Alignment、fresh `08_cycle001_current_state.md`、`emlis_ai_current_input_bundle.py`、`emlis_ai_grounded_observation_plan.py`、`emlis_ai_safety_triage.py`、`emlis_ai_safety_boundary_service.py` | `01_shared_kernel_and_runtime_contracts.md`、`02_emlis_v1a_detailed_design.md` | Emlis固有責任とshared source責任、separate safety境界を明示分離 |
| D06–D16、D20–D22、D28–D29、D33、D50 | `emlis_ai_evidence_ledger_service.py`、`emlis_ai_nls_v3_artifact_contract.py`、`emlis_ai_semantic_obligation_inventory_v3.py`、`emlis_ai_content_selection_v3.py`、PR #2 semantic restatement／relation／overlay／surface files | shared contracts、`05_json_schema_and_versioning.md`、CMEE Final Technical Design | canonical current名でsource→meaning→plan→realization→trace→artifactを一意化 |
| D17–D21、D30–D37 | PR #2 natural surface／surface catalog／product recovery、six tests、current100 runner、batch fixture／manifest、NLS design §18 Product QA | `02_emlis_v1a_detailed_design.md`、`06_implementation_order_migration_and_verification.md` | body-only inverse、naturalness、anti-template、corpus、changed-output rereadのexact移管先を固定 |
| D38–D43 | mashos-api PR #2 changed paths、NLS historical baseline、G0–G10／incident records | `06_implementation_order_migration_and_verification.md` | usable symbol／test vectorだけを抽出し、large recovery wrapperと運用外殻をcurrent ownerへしない |
| D44–D45 | NLS body-only inverse思想とProduct Read failure knowledge | Piece／Analysis detailed design | Pieceはtext＋visual、Analysisはnode／edge／direction／IF provenanceへ改良 |
| D40、D46–D49 | 本引継ぎ資料、fresh Cycle001 `08`、CMEE migration design、current structure maps | CMEE Final Design＋Migration Design | future decision、二段階cutover、受け皿gapをasset分母と分離 |
| PR #3 current actual | `contracts.py`、`source_kernel.py`、`emlis_v1a.py`、`engine.py`、tests exact2、runner exact1、handoff／Product Read Receipt | 上記CMEE design owner | current WIPとtarget topologyの差を事実として反映し、Product Read FAILを合格へ変換しない |

## 12. 保存場所に関する華恋の推奨

### 12.1 原引継ぎ資料

`NLSv3からCMEEへの継承確認・設計修正・商品経路地図修正 引継ぎ資料`は、Mashと華恋の会話・確認順序を復元する`LOCAL_SESSION_HANDOFF`として、引き続きMashのローカル保持で問題ありません。

### 12.2 本Disposition表

本表はUltra華恋が第2段階で直接使用するmigration inputであり、ローカルだけに置くべきではありません。  
次へ反映することを推奨します。

```text
repository:
  MassyuRed/Cocolon

branch / PR:
  existing Draft PR #30
  agent/three-core-cmee-current-structure-20260815

path:
  Cocolon_前提資料/designs/cmee/NLSv3_to_CMEE_Disposition_Phase1_20260817.md
```

理由:

1. 第2段階のdesign ownerと同じPRに置ける。
2. Ultra華恋がsessionごとの再uploadなしでfresh参照できる。
3. Phase 2の変更理由をDisposition IDへ結び付けられる。
4. mainへ直接置かず、Draft上で修正と整合確認を続けられる。
5. 新しいPR、Gate、Receipt、authority familyを増やさない。

本表は設計正本やimplementation authorityにはしません。  
第2段階後のcurrent設計判断は、修正されたFinal／Detailed Designが所有します。本表は`REVIEWED_NONAUTHORITY / MIGRATION_INPUT`として残します。

### 12.3 第2段階への進行条件

次の順で進めます。

```text
1. 本補正版をCocolon Draft PR #30へexact1 fileとして反映
2. remote bytes／path／PR headをfresh確認
3. 同じPR上で第2段階のCMEE設計修正を開始
4. 第2段階完了後に第3段階のcurrent structure map修正へ進む
```

Disposition表のGitHub反映は、設計修正や実装を自動承認しません。  
第2段階のdesign editはMashの今回の方針に基づき進められますが、implementation、Cycle001 re-entry、production cutoverは別境界です。

---

## 13. 現在の停止点

```text
PHASE1_REVIEWED_CORRECTED_READY_FOR_GITHUB_REFLECTION

GitHub write = 0
CMEE design edit = 0
NLS implementation edit = 0
CMEE implementation edit = 0
Cycle001 execution = 0
Product Read rerun = 0
production effect = 0
automatic progression = false
```

Mashの方針どおり、まず本補正版をCocolon Draft PR #30へ置き、fresh postverify後に、

```text
第2段階 — CMEE設計書の必要箇所だけを修正
```

へ進めます。原引継ぎ資料はローカル保持のままで問題ありません。
