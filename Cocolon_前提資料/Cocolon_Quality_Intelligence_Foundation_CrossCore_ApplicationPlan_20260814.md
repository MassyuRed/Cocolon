---
doc_id: cocolon_quality_intelligence_foundation_crosscore_application_plan_20260814
title: "Cocolon Quality Intelligence Foundation — 品質基盤・Piece・分析構造・アプリ全体 活用計画"
created_at: "2026-08-14 JST"
decision_owner: "Mash"
operational_owner: "Karen"
repository: "MassyuRed/Cocolon"
related_repository: "MassyuRed/mashos-api"
record_class: "CROSS_CORE_PRODUCT_QUALITY_FOUNDATION_APPLICATION_PLAN"
normative_status: "DESIGN_PROPOSAL_NON_NORMATIVE"
implementation_authority: false
production_effect: 0
source_test_runtime_effect: 0
automatic_progression: false
cocolon_preimage_head: "25c65dada7e669df2dccc03263d3c3f952eaa469"
mashos_api_observed_head: "d3066e38383b884406737efb976d745df0a5a74f"
source_materials:
  post_g2_audit:
    path: "Cocolon_前提資料/audits/emlis_ai/Cocolon_Cycle001_PostG2_SystemArchitecture_Reusability_Audit_20260814.md"
  piece_roadmap:
    supplied_filename: "Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807_CleanCutover_Revised(3).md"
    sha256: "2eb8d7b4b58ef5fa21f2643ca381f8efb3bfdf08bde29432e746972f7d4f6939"
    lines: 1973
  analysis_roadmap:
    supplied_filename: "Cocolon_Analysis_ProFirst_CurrentActual_ProductQualityClosure_Roadmap_20260807(2).md"
    sha256: "633190b8685143aaca8215c35a876017b32fd00393e42ee94a81a6eb561bd5ba"
    lines: 3042
current_state_preservation:
  cycle001: "NOT_ACCEPTED"
  current_route: "RETURN_TO_SHARED_STRUCTURAL_CORRECTION"
  piece_next_group: "B2_A_NOT_ACTIVATED_SEPARATE_MASH_APPROVAL_REQUIRED"
  analysis_roadmap: "NOT_ACTIVATED_SEPARATE_MASH_APPROVAL_REQUIRED"
---

# Cocolon Quality Intelligence Foundation
## 品質基盤・Piece・分析構造・アプリ全体 活用計画

# 0. この資料の決定

## 0.1 結論

Cycle001のG2後に構築された仕組みは、全体を廃止する対象ではない。

実体は次の二系統である。

```text
A. Product Quality Intelligence Core
   意味を構造化し、出力との対応を追跡し、
   不合格を共通原因へ局所化し、
   因果test、machine評価、human Product Read、batch再評価へ接続する知能基盤。

B. Reproducibility / Governance Control Plane
   source、runtime、manifest、environment、authority、publication、
   execution identityを証明し、実行前後を止める統制基盤。
```

採用方針:

```text
A:
  Cocolonの本命品質基盤として抽出・改良・再利用する。

B:
  日常の商品改善経路から外す。
  release candidate、重大incident、migration、再現不能障害に限定した
  optional Reproducibility Capsuleへ縮小する。

旧全体:
  そのまま再稼働しない。
  全廃もしない。
```

この品質基盤はEmlisAI専用にしない。

```text
EmlisAI構造:
  今回入力の意味を、自然で入力固有の即時観測へする。

Piece構造:
  保存済み入力の核を、他者へ届くcanonical textとvisual artifactへする。

分析構造:
  複数入力の蓄積を、場面・役割・current route・意味・変化へする。

問いシステム:
  unknown / ambiguity / insufficient dataを、
  本人にしか確定できない短い問いへ変える。

Cocolonアプリ全体:
  source、artifact、version、tier、history、device、release、feedbackを、
  同じ品質語彙で観測・比較・改善する。
```

## 0.2 この資料が行うこと

本資料は、次のexact4を具体化する。

1. **本命の品質基盤での活用案**
2. **Pieceでの活用案**
3. **分析構造での活用案**
4. **三大中核構造だけではないCocolonアプリ全体での活用案**

各案について、次を示す。

```text
- 何を再利用するか
- 何を改良するか
- 何を再利用しないか
- どのcurrent contract / ownerへ接続するか
- どの品質問題を解くか
- machineとhumanのどちらで判定するか
- daily / milestone / releaseのどこで使うか
- どうすれば再びdetour化しないか
- 実装候補の順序
```

## 0.3 この資料が許可しないこと

この資料だけでは、次を許可しない。

```text
- EmlisAI production source変更
- Piece production source変更
- Analysis production source変更
- DB migration
- API / RN変更
- current Piece B2-A activation
- Analysis roadmap activation
- Cycle001 current route変更
- 新しい恒久checker / controller / scanner / FD route
- authority / activation / consumption chainの復活
- Work Ultra利用
- production deploy
- automatic progression
```

本資料のprimary outcomeは`ADMINISTRATIVE_ONLY / DESIGN_PROPOSAL`である。

ただし、単なるアイデア列挙ではなく、将来のbounded design / implementationへ直接使える
architecture、contract候補、adapter境界、評価軸、導入順を固定する。

---

# 1. sourceとcurrent actualの読み分け

## 1.1 受領Piece資料

受領したPieceロードマップは、new visual Pieceへのclean cutover、source handoff、record lifecycle、
visibility、quota、content / format、visual recipe、export、API / DB / RN、test、monitoring、
rollback、Work allocationを一冊へまとめている。

中心決定:

```text
Piece =
  自分の内側にあったものを、
  他者に届く表現物として持ち出せる形にする機能。

source:
  saved input

canonical visible body:
  Piece text

image:
  record source-of-truthではなくderived export artifact

Q&A:
  pre-release legacy
  new active formatではない
```

受領資料のfrontmatter上は、PCE-0 complete、PCE-1以降はfuture、
implementation not startedである。

しかしcurrent GitHubでは、Piece workstreamはその後進んでいる。

```text
PCE-0: COMPLETE
PCE-1..PCE-8: COMPLETE_DESIGN_ONLY
PCE-9A B01-R: COMPLETE_TEST_ONLY_CAUSAL_RED
PCE-9A B01-I: COMPLETE_CODE_DISABLED_TARGETED_GREEN
next: B2-A NOT_ACTIVATED / SEPARATE_MASH_APPROVAL_REQUIRED
```

したがって本資料では、次の優先関係を使う。

```text
Pieceの商品思想・全体roadmap:
  受領Pieceロードマップを使用する。

Pieceのcurrent phase / actual implementation:
  Cocolon_Piece/00_read_first.md
  Cocolon_Piece/manifest.json
  current source / test
  を使用する。
```

受領ロードマップの古いphase statusをcurrent actualへ遡及採用しない。

## 1.2 受領Analysis資料

受領したAnalysisロードマップは、greenfield再構築ではなく、
current Watashi Map actualのproduct-quality closureを中心にしている。

current product identity:

```text
Analysis tab:
  分析

emotion history surface:
  こころ天気

self-structure core:
  わたしマップ
```

Watashi Mapの定義:

```text
保存済み入力の蓄積から、
場面ごとに立ち上がりやすい役割、
その役割から続きやすい思考・行動・結果のcurrent route、
守っているもの、負荷、まだ分からない場所、変化を、
断定ではなく根拠付き観測として見せるsurface。
```

主要設計:

```text
- period source set
- claim / evidence / confidence / unknown
- scene / role / current route fidelity
- protective meaning / burden meaning
- time change
- latest / history / detail identity
- tier / access / unread / dirty / refresh
- RN information hierarchy
- human Product Read
- actual-device review
```

Watashi Simulationはpost-release separate laneであり、
observed / simulated / savedを混ぜない。

current GitHub上では、Analysis roadmapはまだ`NOT_ACTIVATED`である。
本資料はAnalysis実装開始を意味しない。

## 1.3 G2後system監査

直前のPost-G2監査では、G3以後を次の二層へ分離した。

```text
Product Quality Intelligence Core:
  reuse high

Runtime / Governance Control Plane:
  daily use no
  optional benchmark / forensic use conditional
```

本資料は、この監査結果へPieceとAnalysisの最新版を接続し、
Cocolon全体の活用計画へ拡張する。

## 1.4 三大中核構造

Cocolon前提資料上の三大中核構造は次である。

```text
1. EmlisAI構造
2. 分析構造
3. Piece構造
```

問いシステムは四つ目の中核として独立させるのではなく、
三大中核へsource clarificationと本人authorityを供給する横断層として扱う。

## 1.5 working name

本資料では、再構成後の基盤を次のworking nameで呼ぶ。

```text
Cocolon Quality Intelligence Foundation
略称候補:
  CQIF

日本語:
  Cocolon意味品質基盤
  または
  華恋の品質基盤
```

これは現時点のuser-facing product名、package名、API名、DB名ではない。

---

# 2. 再利用するsystemの正体

## 2.1 Layer A — Source Identity and Lineage

既存資産:

```text
- saved input identity
- source input version
- original / supplemental source role
- source commitment
- body-free lineage
- case manifest
- reviewed surface hash
- private / public evidence separation
```

本質:

```text
どの入力・どのversion・どのsource roleから、
どのartifactが作られたかを追える。
```

安全だけの機能ではない。

活用価値:

```text
Emlis:
  今回の観測が何を根拠にしたか。

Piece:
  Emlis本文ではなくsaved inputのどの意味を使ったか。

Analysis:
  どのperiod source setからどのclaimを作ったか。

問い:
  どのunknownを確定するための問いか。

support:
  どのversionのartifactが表示されたか。
```

## 2.2 Layer B — Semantic Evidence Graph

既存NLS v3が扱っていた主要material:

```text
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

本質:

```text
入力を完成文へ直行させず、
意味・関係・不確定・出力役割へ分解する。
```

これは三大中核の共通意味層になり得る。

## 2.3 Layer C — Plan-Owned Surface Realization

G3 / post-G6 G3の最重要知見:

```text
意味構造が存在しても、
最終文章をgeneric rendererやcompleted base proseが所有していれば、
構造はvisible textへ正しく現れない。
```

再利用する思想:

```text
最終surfaceは、typed planが唯一のstructural ownerになる。
```

改良点:

```text
- metadataを読んだだけではcredit 0
- valueをguardに使い、mutationで例外を出しただけではcredit 0
- visible bodyの正しいlocusへpositive realizationされた場合だけcredit
- head位置やseparator数を文法階層の代用にしない
- base body late spliceを許さない
```

## 2.4 Layer D — Causal Failure Localization

G3が作った変換:

```text
Product Read failure
  -> failure aggregate
  -> broken layer
  -> common structural cause
  -> production owner
  -> bounded change window
  -> regression risk
  -> causal RED
  -> Product Read acceptance
```

これはCocolonのどの生成物にも使える。

例:

```text
Emlis:
  「説明臭い」-> final surface owner / clause hierarchy

Piece:
  「自分の核が消えた」-> meaning selection / transformation / format owner

Analysis:
  「routeが飛んでいる」-> claim evidence / route ordering owner

問い:
  「尋問されている感じ」-> question need / timing / wording owner

RN:
  「読めない」-> payload density / information hierarchy / component owner
```

## 2.5 Layer E — Causal RED / GREEN

再利用価値:

```text
- 実装前にfailureの意味を固定する
- case IDやexpected final textをoracleにしない
- same denominatorでRED -> GREENを比較する
- production変更とtest変更を分離する
```

改良が必要な点:

```text
- positive realization oracle
- mutation domainをvalid / invalidへ分離
- output differenceだけでなく、意味の正しい位置・役割を検証
- proxy countによるfalse GREENを禁止
- human Product Readで必ず後段判定
```

## 2.6 Layer F — Human Product Read

最も重要な再利用asset。

```text
machine contract:
  意味・契約・構造・identityが壊れていないか。

Product Read:
  人間の言葉・表現・画面として、価値があるか。
```

machine GREENをProduct PASSへ変換しない。

Product Readが担うもの:

```text
- 読まれた感
- 入力固有性
- 自然さ
- 説明密度
- 距離感
- 言葉の所有感
- shareしたいか
- また見たいか
- 支払う価値があるか
- UIの読み順
```

## 2.7 Layer G — Batch / Corpus Evaluation

既存asset:

```text
- exact ordered corpus
- selected / no-valid / fail-close accounting
- private body / body-free summary
- HMAC correspondence
- source closure
- no-overwrite
- case-level severity
- aggregate recomputation
- full reread
```

活用先:

```text
- Emlis current100
- Piece meaning-shape corpus
- Analysis period / route corpus
- Question timing corpus
- RN / tier / device matrix
- release candidate snapshot
```

## 2.8 Layer H — Reproducibility Control Plane

既存asset:

```text
- interpreter / dependency lock
- installed manifest comparator
- owner / independent derivation
- clean runtime materialization
- source / wheel identity
- result unknown handling
```

扱い:

```text
daily product work:
  使用しない。

release candidate:
  必要な場合だけ一回実行。

重大incident:
  reproduction capsuleとして使用。

migration:
  isolated DB / staging identity確認へ限定利用。
```

再利用しない日常運用:

```text
- Inspector / scanner chain
- authority exact body / bytes / SHA approvalの反復
- activation / consumption ledgerの全件記録
- FD9 proofの常時前提化
- proof-of-proof
- same resultのための恒久subsystem追加
```

---

# 3. 本命の品質基盤での活用案

# 3.1 目的

CQIFの目的は、Cocolonの各機能を止めることではない。

```text
actual output / artifact / screenを観測し、
なぜ良い・悪いかを共通語彙で記録し、
共通原因をactual ownerへ返し、
修正後の改善をmachineとhumanの両方で確認する。
```

## 3.2 最終的な位置づけ

```text
runtime safety gate:
  ではない。

Cocolon全体のgeneric text generator:
  ではない。

開発・QA・releaseのための
意味品質観測 / 原因局所化 / 比較 / 受入れ基盤:
  である。
```

## 3.3 foundation architecture

推奨architecture:

```text
1. Source Lineage
2. Semantic Evidence Graph
3. Core-specific Artifact Plan
4. Plan-Owned Compiler / Renderer
5. Positive Realization Verifier
6. Machine Quality Measurements
7. Human Product Read
8. Causal Issue Localizer
9. Corpus / Batch Evaluator
10. Version Diff / Release Snapshot
11. Body-Free Quality Telemetry
12. Optional Reproducibility Capsule
```

## 3.4 1 — Source Lineage

入力:

```text
source identity
source version
source role
owner user
stage
period
privacy class
commitment
```

出力:

```text
artifact lineage
body retrieval permission
body-free public-safe identity
cross-core no-mixing verdict
```

必要な分離:

```text
original_input
supplemental_answer
question_need_decision
Emlis observation artifact
Piece artifact
Analysis claim
simulated route
saved route intent
```

## 3.5 2 — Semantic Evidence Graph

共通node候補:

```text
source_evidence
semantic_atom
entity_or_referent
owner
role
relation
value_signal
emotion_signal
action
state
time_scope
unknown
support
boundary
```

共通edge候補:

```text
supports
qualifies
contrasts
precedes
follows
belongs_to
observed_in
unknown_about
transformed_into
expressed_by
```

core-specific extension:

```text
Emlis:
  Reception focus / act / support

Piece:
  meaning nucleus / expression intent / public transformation

Analysis:
  scene / role / route step / protective / burden / change

Question:
  unresolved slot / answer authority / answered-by-user
```

## 3.6 3 — Core-specific Artifact Plan

共通plan field候補:

```text
artifact_kind
purpose
source_graph_version
selected_meaning_ids
required_meaning_ids
optional_meaning_ids
forbidden_claim_ids
ordering
main_owner
support_owner
unknown_policy
depth_budget
surface_budget
audience
visibility
```

adapter:

```text
EmlisObservationPlan
PieceExpressionPlan
WatashiMapPlan
QuestionPlan
```

共通planを一つ作り、全coreが同じ文章になる設計は禁止する。

## 3.7 4 — Plan-Owned Compiler / Renderer

共通責任:

```text
- planで選ばれた意味だけを使用
- main owner / supporting ownerをvisible hierarchyへ反映
- relation / time / unknownを適切なsurfaceへ反映
- generic completed bodyのlate spliceを禁止
- core-specific目的を守る
```

adapter責任:

```text
Emlis:
  immediate observation + Reception

Piece:
  expression artifact + format + visual plan

Analysis:
  overview + role + route + meaning + unknown + change

Question:
  one clear question + choices / answer role
```

## 3.8 5 — Positive Realization Verifier

旧machine Gateの最大改良点。

検証するもの:

```text
- plan fieldを読んだか、ではない
- visible text / visual / UIに正しく現れたか
- 正しいlocusへ現れたか
- main / supportのhierarchyが現れたか
- relation directionが現れたか
- unknownが断定へ変わっていないか
- omitted reasonがあるか
- raw / hidden metaが漏れていないか
```

出力例:

```json
{
  "required_meaning_total": 8,
  "positively_realized": 7,
  "missing": 1,
  "wrong_locus": 0,
  "wrong_role": 0,
  "unsupported_visible_claim": 0,
  "late_splice_detected": false
}
```

## 3.9 6 — 共通machine quality measurements

共通軸候補:

| ID | axis | machineで見られる主項目 |
|---|---|---|
| Q01 | source fidelity | source / commitment / evidence refs |
| Q02 | meaning coverage | required meaning realization |
| Q03 | unsupported claim | source外claim、cause、diagnosis、future |
| Q04 | owner / role | main owner、support owner、role consistency |
| Q05 | relation / time | direction、order、temporal scope |
| Q06 | unknown integrity | unknownの断定化、generic隠蔽 |
| Q07 | depth proportionality | input / evidence量と出力量 |
| Q08 | repetition | duplicate、stem、skeleton、layout repetition |
| Q09 | contract identity | version、hash、preview/record/export等 |
| Q10 | privacy / access | body leak、tier leak、visibility |
| Q11 | device / UI precheck | overflow、missing section、empty state |
| Q12 | runtime outcome | exception、missing、stale、retry |

machineで判定しないもの:

```text
- 本当に自然か
- 本当に自分の言葉に感じるか
- 本当に理解されたと感じるか
- 本当にshareしたいか
- 本当に支払う価値があるか
```

## 3.10 7 — 共通Human Product Read

共通Product Read候補:

| ID | question |
|---|---|
| H01 | sourceを読んだ出力に見えるか |
| H02 | sourceの核を落としていないか |
| H03 | sourceにないことを言っていないか |
| H04 | main meaningが分かるか |
| H05 | relation / time / roleに飛躍がないか |
| H06 | 自然な日本語・表示か |
| H07 | 説明しすぎ／短く潰しすぎでないか |
| H08 | generic templateに見えないか |
| H09 | coreの目的に合っているか |
| H10 | 距離感・圧・断定が適切か |
| H11 | userが所有できるartifactに見えるか |
| H12 | また入力・保存・閲覧・共有したいか |

core-specific追加軸はadapterが持つ。

## 3.11 8 — Causal Issue Localizer

input:

```text
machine measurements
Product Read rows
version diff
source / plan / surface trace
```

output:

```text
issue family
severity
shared cause candidate
broken layer
owner repository
owner path / symbol candidate
affected coverage
minimal correction window
future causal RED requirement
human reread requirement
```

例:

```json
{
  "issue_family": "MAIN_MEANING_FLATTENED_BY_GENERIC_PEER_CLAUSES",
  "severity": "MAJOR",
  "broken_layer": "SURFACE_REALIZATION",
  "common_cause": "typed plan is validation metadata, not grammatical owner",
  "owner_candidate": "core-specific surface compiler",
  "requires_human_reread": true
}
```

## 3.12 9 — Corpus / Batch Evaluator

daily:

```text
changed ownerに対応するfocused corpus
```

milestone:

```text
core-specific representative set
```

release candidate:

```text
full corpus
all changed outputs
past BLOCKER / MAJOR
coverage neighbors
tier / device / visibility matrix
```

禁止:

```text
- test node countをsample countへ変換
- fixture passをactual Product Readへ変換
- subsetをfull corpusへ変換
- old output reviewをnew outputへ再利用
```

## 3.13 10 — Version Diff / Release Snapshot

artifact version間で比較するもの:

```text
source identity
semantic graph
plan
visible body
visual recipe
claim set
route steps
unknown
machine measurements
human severity
device evidence
```

利用:

```text
- regression原因
- release note
- rollback
- old report / old Piece / old Emlis evidenceの扱い
- support
```

## 3.14 11 — Body-Free Quality Telemetry

eventに入れてよいもの:

```text
core
artifact kind
contract version
status
reason code
counts
severity
latency
tier
device class
visibility class
version identity
```

入れてはいけないもの:

```text
raw input
Emlis body
Piece body
Analysis report body
question text
free-form review note
secret
credential
private locator
```

## 3.15 12 — Optional Reproducibility Capsule

起動条件:

```text
- release candidate
- actual migration
-重大incident
- environment差がactual resultを変えたと観測された
- same commitで再現不能
```

含める候補:

```text
source commit / tree
interpreter
dependency lock
installed manifest
runner version
corpus identity
artifact schema version
result checksum
```

含めないもの:

```text
daily authority lifecycle
FD proofの常時実行
Inspector / scanner chain
full runtime再構築をevery changeへ要求
```

## 3.16 quality case candidate

共通internal schema候補:

```json
{
  "quality_case_id": "qcase:...",
  "core": "emlis|piece|analysis|question|app_surface",
  "artifact_kind": "...",
  "source_lineage_id": "...",
  "semantic_graph_version": "...",
  "artifact_plan_version": "...",
  "artifact_version": "...",
  "machine_measurements": {},
  "product_read": {},
  "issue_families": [],
  "owner_candidates": [],
  "privacy_class": "private_body_public_summary",
  "device_evidence": null,
  "release_credit": "none|technical|product|device|release"
}
```

これはcandidateであり、current API / DB contractではない。

## 3.17 credit separation

```text
TECHNICAL_CREDIT:
  schema、identity、machine invariant

PRODUCT_CREDIT:
  actual output human Product Read

DEVICE_CREDIT:
  actual iOS / Android visibility and operation

RELEASE_CREDIT:
  product + device + access + monitoring + rollback
```

一つを他へ変換しない。

## 3.18 implementation shape candidate

将来のmashos-api package候補:

```text
ai/services/quality_intelligence/
  source_lineage.py
  semantic_graph.py
  artifact_plan.py
  realization_trace.py
  machine_measurements.py
  product_read_schema.py
  issue_localizer.py
  batch_evaluator.py
  version_diff.py
  body_free_evidence.py
  adapters/
    emlis_adapter.py
    piece_adapter.py
    analysis_adapter.py
    question_adapter.py
```

tool候補:

```text
ai/tools/cocolon_quality_run.py
ai/tools/cocolon_quality_compare.py
ai/tools/cocolon_quality_report.py
```

ただし、最初から上記exact packageを一括実装しない。

## 3.19 product-first extraction rule

再びdetour化しないための最重要原則:

```text
1. foundation単独projectを先に作らない。
2. current product failureを直接直す作業から始める。
3. 同じ能力が二つ目のcoreで必要になった時だけshared化する。
4. shared化は最小contractとpure helperから始める。
5. daily pathはnon-blocking observationをdefaultにする。
6. full corpus / reproducibilityはmilestoneまたはreleaseだけ。
7. human Product Readを自動化したと主張しない。
8. success時に商品状態が変わらないfoundation作業を開始しない。
```

## 3.20 recommended first application

最初の実利用は、独立した新system構築ではなく、
current EmlisAIのBLOCKER 58 / MAJOR 40を減らす作業へ入れる。

```text
existing all100 Product Read
-> issue family clustering
-> semantic graph / surface traceとのcrosswalk
-> shared cause
-> owner / minimal correction
-> positive causal RED
-> production fix
-> focused reread
-> current100 reread
```

ここで実証された最小schemaだけをCQIFへ抽出する。

---

# 4. Pieceでの活用案

## 4.1 current Pieceとの整合

current Piece identity:

```text
source:
  saved input

artifact:
  piece.record.v2

canonical visible body:
  piece_text

image:
  versioned visual recipeから作るderived export

active formats:
  short_essay / quote / declaration

visibility:
  private default
  publicはallowed viewer relation内

quota:
  first successful save exact1

Q&A:
  pre-release legacy
```

CQIFは、このidentityを変更しない。

## 4.2 Pieceへの接続map

| Piece owner / phase | CQIF活用 |
|---|---|
| PCE-2 source handoff | Source Lineage / no-mixing |
| PCE-3 lifecycle / visibility / quota | Artifact identity / state integrity |
| PCE-4 content / format / safety | Semantic Graph / format fit / transformation trace |
| PCE-5 visual / export | Artifact Plan / visual recipe QA / re-export identity |
| PCE-6 API / DB / RN | version / projection / access verification |
| PCE-7 test / monitoring / rollback | Causal RED / quality events / release snapshot |
| PCE-8 work packages | capability単位のbounded adapter |
| PCE-9A B01 | existing pure contract ownerをidentity基盤として再利用 |
| PCE-11 | Product Read / actual-device visual QA |
| PCE-U1/U2 | optional independent release audit |

## 4.3 Piece Meaning Graph

Piece専用graph候補:

```text
source meaning nucleus
supporting context
expression intent
audience assumption
privacy-sensitive detail
public transformation
relation
value signal
emotion tone
desired distance
format affordance
visual emphasis
```

目的:

```text
短縮要約ではなく、
何を残し、何を一般化し、何を非公開にし、
どの表現形式へ変えたかを追える。
```

## 4.4 Piece Source Transformation Trace

Pieceはraw inputをそのまま公開しない。
一方、過剰な安全化で核を消してもいけない。

transformation class候補:

```text
PRESERVED
GENERALIZED_FOR_PUBLIC
OMITTED_PRIVATE_DETAIL
REPHRASED_FOR_CONTEXT
SPLIT_FOR_READABILITY
MERGED_SUPPORTING_DETAIL
NOT_SELECTED
FORBIDDEN_TO_EXPORT
```

必要な検証:

```text
- required meaningがPRESERVEDまたは正当なGENERALIZED
- private detailがvisible bodyへ漏れていない
- omitted reasonがある
- public safety transformationが意味反転していない
- Emlis body / Analysis inferenceをsourceにしていない
```

## 4.5 Format Fit Selector

current候補:

```text
short_essay
quote
declaration
```

選択根拠:

```text
meaning shape
relation structure
expression intent
source length
public context clarity
required nuance
visual budget
```

禁止:

```text
case ID
固有語
特定fixture phrase
family名だけの固定分岐
```

selector output例:

```json
{
  "recommended_format": "short_essay",
  "alternates": ["quote"],
  "reasons": [
    "MULTI_STEP_MEANING",
    "CONTEXT_REQUIRED",
    "DECLARATION_OVERSTATES"
  ]
}
```

## 4.6 Piece Candidate Tournament

同じsemantic graphから、複数候補を生成できる。

比較軸:

```text
meaning coverage
public safety
format fit
naturalness
share context clarity
text density
visual fit
template similarity
user ownership
```

初期運用:

```text
developer / QA only
```

将来:

```text
Plus / Premiumの候補選択へ接続可能
```

ただしcandidate数を増やすこと自体を品質としない。

## 4.7 Plan-Owned Piece Text Compiler

Piece本文を、generic safety summaryやEmlis本文の加工にしない。

入力:

```text
Piece Meaning Graph
format plan
audience
visibility
surface budget
```

出力:

```text
piece_text
meaning realization trace
format realization trace
```

必須:

```text
- main meaning exact1を中心へ置く
- supporting meaningをformatに合う位置へ置く
- unknownを断定へ変えない
- public transformationをtraceする
- fixed final textを使わない
```

## 4.8 Visual Plan-Owned Renderer

Pieceのvisual recipeは装飾metaではなくartifact planの一部として扱える。

plan input:

```text
format_type
text length
line structure
main emphasis
support emphasis
theme
ratio
branding
renderer version
```

verify:

```text
- main meaningが視覚上も中心
- supportがmainを圧迫しない
- line breakで意味が分断されない
- hidden text / clipping 0
- preview / saved / exportの本文同一
- template updateでold recordが変わらない
```

## 4.9 Preview / Record / Export Identity Triad

current Piece roadmapの重要契約をCQIFへ統合する。

```text
preview text hash
record text hash
export text hash

visual recipe hash
template version
renderer version
export contract version
```

判定:

```text
preview == record == export visible body
```

変更がある場合:

```text
new artifact version
```

同じrecordのre-exportで本文を変えない。

## 4.10 Visual QA Engine

code-side machine checks:

```text
text bounds
line count
minimum font size
overflow
clipping
safe area
contrast candidate
ratio
branding placement
Unicode / emoji / URL / newline
empty / long text
```

actual device:

```text
iOS font
Android font
pixel / padding
share sheet
permission
saved file
large text
low memory
```

machine precheckとactual-device creditを分離する。

## 4.11 Piece Product Read

Piece専用Product Read候補:

| ID | question |
|---|---|
| P01 | 元入力の核が残っているか |
| P02 | raw inputの単なる切り抜きでないか |
| P03 | Emlis本文のコピーでないか |
| P04 | public化で意味が平板化していないか |
| P05 | 自分のものとして保存したいか |
| P06 | 他者へ見せても意図が誤解されにくいか |
| P07 | formatが意味に合うか |
| P08 | 文章が自然か |
| P09 | generic motivational cardに見えないか |
| P10 | visual hierarchyが意味に合うか |
| P11 | private / publicの選択に納得できるか |
| P12 | share / re-exportしたい価値があるか |

## 4.12 Piece quality issue families

候補:

```text
MEANING_NUCLEUS_LOST
PUBLIC_GENERALIZATION_OVERFLATTENED
PRIVATE_DETAIL_LEAK
EMLIS_BODY_REUSED
ANALYSIS_INFERENCE_REUSED
FORMAT_MISMATCH
DECLARATION_OVERSTATED
QUOTE_CONTEXT_MISSING
SHORT_ESSAY_EXPLANATORY_DENSITY
TEMPLATE_SKELETON_OVERCONCENTRATED
VISUAL_MAIN_MEANING_NOT_DOMINANT
PREVIEW_RECORD_EXPORT_MISMATCH
DEVICE_LAYOUT_COLLAPSE
VISIBILITY_ACCESS_MISMATCH
```

## 4.13 Behavioral quality signals

user actionはProduct Readの代替ではないが、実利用signalとして使える。

body-free signal:

```text
preview opened
preview abandoned
record saved
private selected
public selected
visibility changed
exported
re-exported
share sheet opened
deleted
Nexus read
resonance
```

注意:

```text
- share数が多い = semantic qualityが高い、とはしない
- private saveも価値として扱う
- deleteを失敗だけに分類しない
- tier差をquality原因へ短絡しない
```

## 4.14 Piece corpus design

coverage軸:

```text
short / long
single nucleus / multiple related meanings
positive / negative / mixed
relationship / work / self / daily event
explicit value
uncertain meaning
private-sensitive
Japanese
Japanese-English mixed
emoji
format exact3
theme exact2
ratio 4:5 / 9:16
Free / Plus / Premium
private / public
preview / save / export / re-export
```

## 4.15 Pieceへの導入順

current Piece orderを変更せず、次の接続を推奨する。

```text
B2-A / migration:
  current planどおり。CQIFを前提条件にしない。

B8 Format Owner:
  Piece Meaning Graph / Format Fitの最初のactual adapter候補。

B9 Visual Recipe:
  Visual Plan / QA / version diffを接続。

B14 monitoring:
  body-free quality event schemaを接続。

B13 export:
  preview / record / export identityとdevice evidenceを接続。

PCE-U1/U2:
  optional Reproducibility Capsuleとrelease snapshotを使用。
```

## 4.16 Pieceで再利用しないもの

```text
- Emlis visible body
- Emlis internal candidate body
- Analysis inference
- simulated routeをoriginal source扱い
- old Q&A compatibilityのためのdual renderer
- daily runtime manifest Gate
- authority lifecycle chain
- popularityをsemantic quality scoreにすること
```

---

# 5. 分析構造での活用案

## 5.1 current Analysisとの整合

CQIFはAnalysisを作り直さない。

維持するもの:

```text
- Analysis home
- こころ天気
- わたしマップ
- latest / history / detail
- Free / Plus / Premium
- light / standard / deep
- role switch
- current route
- crossroad
- unknown area
- report validity gate
- unread / dirty / refresh
```

重点:

```text
Watashi Map actual-product quality closure
```

## 5.2 Analysisへの接続map

| Analysis phase | CQIF活用 |
|---|---|
| ANL-0 actual/output pin | Quality Case inventory |
| ANL-2 period source set | Source Lineage / source set |
| ANL-3 claim/evidence/unknown | Semantic Evidence Graph |
| ANL-4 role/current route | Route Graph / realization trace |
| ANL-5 protective/burden | typed high-care claims |
| ANL-6 time change | Version Diff / comparability |
| ANL-7 tier/history/refresh | artifact identity / access integrity |
| ANL-8 RN readability | UI Product Read / device QA |
| ANL-10 test/Product Read | machine + human quality engine |
| ANL-12A..F | core-specific adapters |
| ANL-U1/U2 | release snapshot / optional capsule |
| SIM lane | observed/simulated/saved adapter |

## 5.3 Period Source Set

Analysisでは一件のinputではなく、period source setが正本になる。

CQIFで共通化する部分:

```text
source input identity
source version
source role
owner
privacy
commitment
```

Analysis固有:

```text
period_start
period_end
included_count
excluded_count
exclusion reasons
stage distribution
source set commitment
```

価値:

```text
- one recordから傾向を断定しない
- 同じrecordの重複を観測数へ数えない
- original / supplementalを区別
- Piece / Emlis / simulationをobserved sourceへ混ぜない
```

## 5.4 Analysis Claim Evidence Graph

claim kind:

```text
scene_observation
role_observation
thought_pattern_observation
action_pattern_observation
relation_observation
current_route_step
protective_meaning
burden_meaning
unknown_boundary
insufficient_data
time_change
```

graph:

```text
period source set
  -> evidence nodes
  -> claim nodes
  -> route graph
  -> Watashi Map plan
  -> visible sections
```

各visible claimから、source set、period、evidence、unknownへ辿れる。

## 5.5 Claim Positive Realization

Analysisでは、claimがJSON metaに存在するだけでは不足。

検証:

```text
- role claimがrole sectionへ現れた
- route stepが正しい順で現れた
- protectiveとburdenが別section / 別役割で現れた
- unknownがgeneric positive summaryへ置換されていない
- evidence period / amountがvisible contextへ現れた
- time changeが成長判定へ変わっていない
```

## 5.6 Current Route Graph

route候補:

```text
scene / trigger
-> role activation
-> thought or attention movement
-> action / non-action
-> relation or immediate result
-> aftermath / burden candidate
```

CQIFで持つもの:

```text
route node ID
node kind
claim IDs
source set
order rationale
unknown / omitted reason
```

利点:

```text
自然な文章に見えるだけの飛躍を検出できる。
```

## 5.7 Role Label Quality Engine

machine candidate:

```text
-同じlabel集中
-人格type語
- always / essence相当
- sceneと無関係
- source actionへ接続しない
- generic label
```

human Product Read:

```text
- sceneと一緒に読むと意味が分かるか
- userを一語で固定していないか
- 不自然な名付けに見えないか
- 自分の経験へ戻れるか
```

## 5.8 Protective / Burden Pairing

typed separation:

```text
protective meaning:
  何かを守ろうとしている可能性

burden meaning:
  そのrouteで負荷になりやすい部分
```

CQIF checks:

```text
- same evidenceから自動で両方を作らない
- protectiveを正当化へ変えない
- burdenを欠陥化へ変えない
- source evidenceなしで作らない
- high-careでcause / action commandへ進まない
```

Product Read:

```text
- 擁護・美化に見えないか
- 欠点・診断に見えないか
- 現在の自分を消すべき対象にしていないか
```

## 5.9 Unknown as First-Class Product Value

unknown class:

```text
not_enough
conflicting_evidence
scene_missing
role_ambiguous
route_incomplete
protective_unknown
burden_unknown
period_not_comparable
```

活用:

```text
Analysis:
  「まだ地図にない場所」として表示。

Question:
  必要性が高いものだけpersonal follow-up候補へ。

Emlis:
  今回入力の範囲を越えない。

Simulation:
  branch前提が不足していることを明示。
```

unknownをfailureや空白へしない。

## 5.10 Time Change Comparator

input:

```text
current report identity
previous report identity
source set identities
period lengths
coverage
claim kinds
contract versions
```

output:

```text
newly_observed
more_visible
less_visible
stable_within_scope
route_step_changed
role_context_shifted
burden_shifted
protective_meaning_shifted
not_comparable
insufficient_data
```

禁止:

```text
growth
worse
healed
true self
future prediction
```

## 5.11 Latest / History / Detail Identity

CQIF artifact identityで検査する。

```text
latest:
  exact report identity

history:
  same identity / version / period

detail:
  same canonical payload

tier projection:
  hidden sectionを除いても別reportへ作り替えない
```

issue family:

```text
LATEST_HISTORY_IDENTITY_MISMATCH
DETAIL_PAYLOAD_DRIFT
TIER_PROJECTION_BODY_LEAK
VIEW_TIME_REGENERATION_CHANGED_ARTIFACT
STALE_LATEST
```

## 5.12 Tier Value Quality

Free / Plus / Premiumを単なるsection数で評価しない。

観測候補:

```text
Free:
  core valueが理解できるか

Plus:
  route / meaningが実用的に深まるか

Premium:
  evidence / change / history / depthに支払う理由があるか
```

Product Read:

```text
- Freeが無価値な広告になっていないか
- Plus / Premiumが同じ文の増量でないか
- tier lockがcontentの代わりになっていないか
- hidden body leakがないか
```

## 5.13 Analysis Product Read

Analysis専用軸:

| ID | question |
|---|---|
| A01 | 入力の蓄積を読んだmapに見えるか |
| A02 | sceneが具体的か |
| A03 | role labelが自然か |
| A04 | current routeに飛躍がないか |
| A05 | sourceにないresultを追加していないか |
| A06 | protectiveが美化・正当化に見えないか |
| A07 | burdenが欠陥・診断に見えないか |
| A08 | unknownが逃げに見えないか |
| A09 | period / observation amountが理解できるか |
| A10 | time changeが成長判定に見えないか |
| A11 | Freeでも中核価値が分かるか |
| A12 | Plus / Premiumに支払う理由があるか |
| A13 | UI上でscene / role / route / meaningを区別できるか |
| A14 | historyをまた見たいか |

## 5.14 Analysis issue families

候補:

```text
SOURCE_SET_IDENTITY_MISSING
ONE_RECORD_PERIOD_OVERCLAIM
ROLE_LABEL_PERSONALITY_TYPE
ROLE_LABEL_GENERIC
ROUTE_STEP_UNGROUNDED
ROUTE_ORDER_UNPROVED
SOURCE_EXTERNAL_RESULT_ADDED
PROTECTIVE_MEANING_OVERCLAIM
BURDEN_PATHOLOGIZED
UNKNOWN_HIDDEN_BY_GENERIC_SUMMARY
TIME_CHANGE_NOT_COMPARABLE
TIME_CHANGE_GROWTH_JUDGMENT
LATEST_HISTORY_IDENTITY_MISMATCH
TIER_VALUE_FLAT
RN_INFORMATION_HIERARCHY_COLLAPSE
```

## 5.15 Analysis corpus design

coverage:

```text
short / long
low-information
positive / negative / mixed
work / relationship / value / family
self-denial adjacent
single / multiple role
route complete / incomplete
protective known / unknown
burden known / unknown
period comparable / not comparable
Free / Plus / Premium
latest / history / detail
light / standard / deep
high-care
iOS / Android
large text
```

## 5.16 Watashi Simulation future use

CQIFはSimulationをrelease前Analysisへ混ぜない。

将来adapter:

```text
observed route:
  evidence graphから作る

simulated route:
  branch intentとseparate planから作る

saved route intent:
  user-owned interest artifact

quality checks:
  identity separation
  no future prediction
  no correct route
  no current-state promotion
  no action command
  high-care
```

question system:

```text
branch intentが曖昧な時だけ使用
```

Piece connection:

```text
simulation-specific source role
explicit user action
simulation labelを失わない
```

## 5.17 Analysisへの導入順

Analysisが別承認でactivatedされた後、次を推奨する。

```text
ANL-0:
  CQIF Quality Case形式でactual output inventoryを作る。

ANL-2:
  shared Source Lineageを採用。

ANL-3:
  Claim Evidence Graphのfirst Analysis adapter。

ANL-4 / 5:
  Route Graph、protective/burden positive realization。

ANL-6 / 7:
  Version Diff、artifact identity、tier integrity。

ANL-10:
  Product Read schemaとCausal Issue Localizer。

ANL-12:
  bounded adapter実装。

ANL-U1/U2:
  release snapshot / optional capsule。
```

## 5.18 Analysisで再利用しないもの

```text
- Emlis visible bodyをevidenceにする
- Piece textをobserved factにする
- simulated routeをcurrent routeへする
- current roleを人格typeへする
- generic safety summaryでunknownを隠す
- daily runtime identity Gate
- Analysis roadmap未activatedのまま実装する
```

---

# 6. Cocolonアプリ全体での活用案

## 6.1 Cross-Core Source Event Graph

Cocolonの上位flowを、body-free event identityで接続する。

```text
input saved
-> Emlis current observation
-> question need decision
-> optional supplemental answer
-> refined observation
-> optional Piece creation
-> Analysis dirty candidate
-> period source-set inclusion
```

各coreは内部ownerを統合しない。

共通化するもの:

```text
source identity
source role
event ordering
artifact identity
privacy
version
```

## 6.2 Question Need Engine

旧systemの`unknown`、`explicit unknown`、`unresolved owner / relation / time scope`を、
停止理由だけでなく問い候補へ変える。

candidate input:

```text
unknown slot
ambiguity type
impact on Emlis / Analysis / Piece
answerability by user
intrusiveness
timing
recent question count
existing answer
```

decision:

```text
NO_QUESTION_NEEDED
OPTIONAL_FOLLOWUP_NOW
SAVE_PERSONAL_FOLLOWUP
ASK_AFTER_REPEATED_PATTERN
BLOCK_AS_INTRUSIVE
```

ranking:

```text
1. user answerで意味が実際に変わる
2. core outputの主要uncertaintyを減らす
3. source anchorが存在する
4. 短く答えられる
5. recent question負担が小さい
6. high-careでない
```

禁止:

```text
- 全unknownを質問する
- Emlis出力を作るための尋問
- AI仮説を本人へ確認する誘導質問
- Analysis人格typeを確定する問い
- Piece作成を促すための営業質問
```

answerは`original_input`を上書きせず、
`supplemental_answer`として別source roleへ保存する。

## 6.3 Unified Artifact Identity

Cocolonの各artifactへ共通identity思想を使う。

```text
Emlis:
  observation artifact version

Piece:
  piece record / visual recipe / export version

Analysis:
  report / claim / latest / history version

Question:
  question / answer / source anchor version

RN:
  rendered artifact identity

support:
  userが実際に見たversion
```

これにより、「見たもの」と「調査したもの」が一致する。

## 6.4 Cocolon Quality Observatory

内部dashboard候補。

core別:

```text
Emlis:
  selected / no-valid / fail-close
  Product Read severity
  issue families

Piece:
  preview / save / export identity
  format fit
  visual/device
  private/public

Analysis:
  claim evidence
  route grounding
  unknown
  latest/history
  tier/device

Question:
  need / asked / answered / skipped
  answer usefulness
  burden
```

app-wide:

```text
release blocker
body leak
tier leak
stale artifact
rollback readiness
device coverage
human review coverage
```

dashboard自体を先に作らず、existing output reportから始める。

## 6.5 Corpus and Coverage Manager

三大中核で別々のcase listを作り続けず、
共通coverage dimensionを持つ。

common dimensions:

```text
input length
language
emotion mix
relation
time
unknown
high-care
tier
device
visibility
artifact stage
history presence
```

core-specific dimensionsはadapterへ残す。

利用:

```text
focused regression selection
representative set
unseen set
release full set
device matrix
```

## 6.6 Algorithm / Composer Comparison Bench

同じsource / semantic graph / Product Read軸で比較できる。

比較対象例:

```text
Emlis composer version
surface compiler version
Piece format selector
Piece theme / renderer
Analysis role labeler
Analysis route builder
Question ranker
```

A/B testをuserへ出す前にoffline比較できる。

禁止:

```text
machine scoreだけでwinnerを決める
```

## 6.7 Product Feedback Loop

Cocolonの実利用行動を、body-free quality signalとして戻す。

候補:

```text
input saved again
Emlis modal read duration
question answered / skipped
Piece saved / exported / re-exported / deleted
Analysis revisited
history opened
tier upgrade after value surface
feature disabled / rollback
```

注意:

```text
- 行動を心情へ断定しない
- retentionを文章品質の唯一の証明にしない
- private behaviorを個人診断へ使わない
```

## 6.8 Home / Input Experience

入力後の全flowをartifact graphとして観測する。

```text
save succeeded
Emlis artifact generated
Emlis visible
question offered
Piece CTA eligible
Analysis dirty emitted
```

解ける問題:

```text
- backend passedなのにRN非表示
- Piece CTAがsource identityなしで出る
- Analysis dirtyが失われる
- questionが多すぎる
-同じ入力で重複artifactができる
```

## 6.9 Subscription / Tier Value Validation

Free / Plus / Premiumの差を、機能数ではなくactual valueで見る。

```text
Emlis:
  core品質はplanで下げない

Piece:
  format / theme / ratio / quota / history / export value

Analysis:
  depth / evidence / history / change value

Question:
  personal follow-upの範囲 /頻度
```

CQIFで確認すること:

```text
- Freeに中核価値がある
- Plus / Premiumが同じ内容の水増しでない
- hidden body leak 0
- downgrade後のidentity / access整合
```

## 6.10 Notification / Unread / Dirty Quality

通知やunreadを、「処理が走った」ではなくmeaningful artifactへbindする。

```text
artifact identity
publish state
viewer eligibility
newness
read state
```

防げるもの:

```text
- publishされていないreportのunread
- private Piece notification
- stale Analysis通知
- visibility変更後のfeed残存
-同一artifactの重複通知
```

## 6.11 Nexus / Feed / Ranking

CQIFの活用:

```text
- artifact version / visibility / accessの整合
-旧renderer誤描画
- feed本文とrecord本文の一致
- quality / popularityの分離
- delete / private化後の残存検出
```

rankingで禁止:

```text
resonanceが多い = userの本質に合っている
```

## 6.12 Support / Forensic Trace

ユーザー問い合わせ時に、bodyを複製せず次を追える。

```text
input event identity
artifact version
core
source lineage
status / reason
displayed version
tier / visibility
renderer version
rollback / flag state
```

利用例:

```text
- なぜEmlisが表示されなかったか
- なぜPiece exportがrecordと違ったか
- なぜAnalysis latestが古かったか
- なぜprivate artifactがfeedに見えたか
```

## 6.13 Release Readiness Snapshot

release candidateごとにexact1 snapshotを作る。

```text
core versions
contract versions
corpus identities
machine result
Product Read result
device result
access / tier result
monitoring
rollback
unresolved BLOCKER / MAJOR
```

これは日常authority chainではない。

release snapshotの目的:

```text
go / no-goの一枚の事実owner
```

## 6.14 Feature Flag / Rollback

Piece / Analysis roadmapで既に設計されているsafe-disable思想をapp-wideへ使える。

```text
new generation OFF
new projection OFF
new RN surface OFF
public publish OFF
export OFF
safe read fallback
```

原則:

```text
rollbackはold unsafe feature復活ではなく、
new feature safe-disable。
```

## 6.15 Accessibility / Actual Device Quality

共通device matrix:

```text
iOS / Android
light / dark
standard / large text
Japanese
Japanese-English mixed
emoji
short / long
Free / Plus / Premium
offline / retry / stale
```

core-specific:

```text
Emlis:
  modal / scroll / two-stage

Piece:
  image / share / save / ratio

Analysis:
  information hierarchy / history / tier lock

Question:
  choices / keyboard / focus / dismiss
```

## 6.16 Privacy / Data Safety

CQIFのbody-free telemetryとartifact lineageを活用する。

守るもの:

```text
raw input
Emlis body
Piece body
Analysis body
question answer
private evidence
secret
credential
```

同時に、privacyを理由にProduct Read不能へしない。

```text
private review packet
body-free public summary
```

を分ける。

## 6.17 App Performance / Reliability

quality caseへ次を追加できる。

```text
latency
timeout
retry
stale
cache hit / miss
missing artifact
duplicate artifact
render failure
export failure
```

ただし、performanceをsemantic qualityへ混ぜない。

## 6.18 Migration Quality

DB migration / bridge / version cutoverで活用。

```text
preimage identity
record count
contract version
read equivalence
access equivalence
rollback
old caller residual
new caller reachability
```

Piece B2-AやAnalysis future migrationで、
optional Reproducibility Capsuleを使う価値が高い。

## 6.19 Growth / Business Validation

product qualityと利用行動を接続する。

候補:

```text
Emlis:
  again-input rate

Piece:
  save / export / share / re-export

Analysis:
  revisit / history / paid-depth usage

Question:
  answer rate / burden / downstream improvement
```

判断:

```text
quality improvement
-> user behavior change
-> retention / conversion
```

の因果を仮説として検証する。

単一metricで「価値がある」と断定しない。

## 6.20 Future KAREN / My World

CQIFの意味graph、artifact identity、Product Read、question needは、
将来KAREN / My Worldへ転用可能である。

ただし現時点ではCocolon completionへ限定する。

```text
Cocolonでactual valueを証明
-> shared contractを安定
-> future chapterへ移植
```

先行共通基盤を理由にCocolonを遅らせない。

---

# 7. 共通contract候補

以下はdesign candidateであり、current public contractではない。

## 7.1 candidate IDs

```text
cocolon.quality_case.v1
cocolon.source_lineage.v1
cocolon.semantic_evidence_graph.v1
cocolon.artifact_plan.v1
cocolon.realization_trace.v1
cocolon.machine_quality_measurement.v1
cocolon.product_read.v1
cocolon.quality_issue.v1
cocolon.quality_event.v1
cocolon.release_quality_snapshot.v1
```

## 7.2 source lineage minimum

```json
{
  "source_lineage_id": "...",
  "owner_user_id": "...",
  "source_kind": "saved_input",
  "source_version": 1,
  "source_roles": ["original_input"],
  "stage": "normal|pre_question|refined",
  "commitment": "...",
  "privacy_class": "private",
  "body_free": true
}
```

## 7.3 artifact identity minimum

```json
{
  "artifact_id": "...",
  "artifact_kind": "emlis_observation|piece_record|analysis_report|question",
  "contract_version": "...",
  "source_lineage_id": "...",
  "semantic_graph_id": "...",
  "artifact_plan_id": "...",
  "visible_body_commitment": "...",
  "renderer_version": "...",
  "created_at": "...",
  "status": "candidate|accepted|rejected|saved|visible|retired"
}
```

## 7.4 Product Read minimum

```json
{
  "review_id": "...",
  "artifact_id": "...",
  "reviewed_artifact_commitment": "...",
  "rubric_version": "...",
  "severity": "PASS|MINOR|MAJOR|BLOCKER",
  "failed_axes": [],
  "reason_codes": [],
  "shared_cause_candidate": null,
  "body_free": true
}
```

## 7.5 issue minimum

```json
{
  "issue_id": "...",
  "core": "...",
  "severity": "MAJOR",
  "issue_family": "...",
  "broken_layer": "...",
  "common_cause": "...",
  "owner_candidates": [],
  "minimal_fix_boundary": "...",
  "causal_red_required": true,
  "human_reread_required": true
}
```

---

# 8. existing asset reuse map

| asset | current / historical owner | reuse decision |
|---|---|---|
| saved input/source role | Piece PCE-2 / Analysis ANL-2 design | common Source Lineageへ |
| Evidence Ledger lineage | Emlis existing service | Semantic Evidence Graphへ |
| NLS v3 typed material | Emlis NLS v3 | graph / plan prototypeへ |
| G3 failure localization | Cycle001 G3 | Causal Issue Localizerへ |
| G4 RED/GREEN | protected tests | positive causal testへ改良 |
| G6 Product Read | Cycle001 G6 | common human review engineへ |
| current100 runner/evidence | mashos-api current100 | Batch Evaluatorへ |
| HMAC private/public evidence | current100 envelope | body-free evidenceへ |
| piece_v2_contract.py | current Piece B01 | artifact identity / canonical JSONへ |
| Piece visual recipe design | PCE-5 | visual plan / version diffへ |
| Piece PCE-7 RED catalog | Piece design | Piece adapter test matrixへ |
| Analysis source-set design | ANL-2 | Analysis lineage adapterへ |
| Analysis claim taxonomy | ANL-3 | claim graphへ |
| Analysis route/protective/burden | ANL-4/5 | route / meaning adapterへ |
| Analysis time change | ANL-6 | version comparatorへ |
| analysis.validity.v1 | current Analysis | harmful claim boundaryとして保持 |
| manifest comparator | prior G4-B | optional capsuleへ |
| runtime controller | prior G4-B | optional capsuleのreferenceへ |
| FD9 proof | prior G4-B | archive / exceptional forensic only |
| Inspector / scanner | retired |再利用しない |
| authority / Receipt chain | historical governance |日常品質基盤へ入れない |

---

# 9. 実装優先順位

## 9.1 Priority 0 — Emlis current product correction

最初に行うべきこと:

```text
all100 Product Read issue clustering
-> common cause
-> owner
-> positive causal RED
-> product fix
-> reread
```

得るCQIF asset:

```text
quality case minimum
issue family minimum
realization trace minimum
Product Read minimum
```

新しい共通packageを先に作らない。

## 9.2 Priority 1 — Minimal Shared Contracts

Emlisでactualに使ったfieldから、次だけをpure contractへ抽出する。

```text
Source Lineage
Quality Case
Product Read
Quality Issue
```

DB / API / dashboardなし。

## 9.3 Priority 2 — Piece Adapter

current Piece implementation orderを守る。

first high-value touchpoints:

```text
B8 Format Owner
B9 Visual Recipe
B14 monitoring
B13 export
```

Piece Meaning Graph、format fit、preview/record/export identityを実証する。

## 9.4 Priority 3 — Analysis Adapter

Analysisが別承認でactivatedされた後:

```text
ANL-0 actual output
ANL-2 source set
ANL-3 claims
ANL-4 route
ANL-5 meaning
ANL-10 Product Read
```

へ接続する。

## 9.5 Priority 4 — Question Need Engine

Emlis / Analysisで実測したunknown classだけから始める。

```text
unknown inventory
-> question value
-> burden
-> source anchor
-> answer effect
```

## 9.6 Priority 5 — Quality Observatory

三大中核のbody-free reportが安定した後に作る。

最初はMarkdown / JSON reportで足りる。
web dashboardを先に作らない。

## 9.7 Priority 6 — Optional Reproducibility Capsule

Piece migration、Analysis migration、release candidateで必要になった時だけ、
prior G4-B assetを縮小再利用する。

---

# 10. 再び過剰化しないための拘束

## 10.1 foundation work admission

CQIF作業を開始してよいのは次のいずれかだけ。

```text
DIRECT_PRODUCT_OR_ACCEPTANCE_WORK
OBSERVED_BLOCKER_MINIMAL_FIX
MANDATORY_DAMAGE_PREVENTION
```

## 10.2 exact questions

開始前に答える。

```text
1. どのcurrent product failureを減らすか。
2. 成功するとどのactual outputが良くなるか。
3. どのProduct Readが変わるか。
4. 既存手段で足りないか。
5. その能力は今、どのcoreが必要としているか。
6. foundation化しない最小実装は何か。
7. second failure時にどこで打ち切るか。
```

## 10.3 prohibited foundation behavior

```text
- shared化自体を成果にする
- schema数を進捗にする
- dashboardを先に作る
- runtime Gateをdaily mandatoryにする
- full corpusをevery commitで回す
- human Product Readをmodel scoreへ置換
-新しいauthority / Receipt / ledger chainを追加
-一回限り確認を恒久subsystemへする
- Piece / Analysis current順序をfoundation都合で変更
- Cocolon完成よりfuture KAREN / My World共通化を優先
```

## 10.4 extraction threshold

推奨:

```text
first use:
  core内のbounded implementation

second real use:
  common fieldを抽出

third use:
  shared helper / adapter architectureを確定
```

抽象化を先行させない。

---

# 11. 期待できるCocolonの商品効果

## 11.1 EmlisAI

```text
- BLOCKER / MAJORの共通原因特定が速くなる
- machine GREENのfalse positiveが減る
- input-specificityを追える
- Natural Surfaceの修正が局所化される
- all100 rereadとversion比較が容易になる
```

## 11.2 Piece

```text
- sourceの核を残したままpublic化できる
- format選択が意味に基づく
- preview / record / exportが一致する
- visualが意味hierarchyを反映する
- save / shareしたいartifactへ近づく
```

## 11.3 Analysis

```text
- claimとevidenceを追える
- current routeの飛躍を検出できる
- protective / burdenを別意味として保てる
- unknownを価値あるsurfaceへできる
- time changeを人格評価へしない
- latest / history / tierの整合を保てる
```

## 11.4 問い

```text
- 質問数を増やさず、意味が変わる問いだけを出せる
- original / supplementalを分けられる
-本人のanswer authorityを三大中核へ戻せる
- repeated patternへ必要な時だけ深掘りできる
```

## 11.5 アプリ全体

```text
- 各artifactのidentityとversionが揃う
- release判断が一枚のsnapshotになる
- support調査が速くなる
- tier / access / notification事故を減らせる
- actual deviceとhuman reviewを忘れない
- qualityとretention / conversionを検証できる
```

---

# 12. 最終推奨

## 12.1 採用する方針

```text
Cocolon Quality Intelligence Foundationを採用候補とする。

ただし:
  独立した巨大共通基盤として先に構築しない。

Emlis current product correctionから能力を抽出し、
Piece、Analysis、Question、app operationへ
adapter形式で段階的に広げる。
```

## 12.2 再利用の中心

```text
HIGH:
  Semantic Evidence Graph
  Source Lineage
  Plan-Owned Compiler
  Positive Realization
  Causal Failure Localization
  Human Product Read
  Batch Evaluation
  Version Diff

MEDIUM / CONDITIONAL:
  HMAC evidence
  manifest comparator
  clean runtime capsule
  owner / independent derivation

NO DAILY REUSE:
  Inspector / scanner
  authority lifecycle chain
  FD proof
  proof-of-proof
```

## 12.3 最初の実装候補

別承認時のfirst bounded candidate:

```text
EMLIS_CURRENT100_QUALITY_CASE_AND_SHARED_CAUSE_LOCALIZATION

input:
  current all100 Product Read result
  current source / output / issue evidence

output:
  quality case rows
  issue family clusters
  shared cause
  owner candidates
  minimal positive causal RED candidates

production change:
  exact0 in first diagnostic step

new runtime subsystem:
  exact0

next:
  direct product correction
```

これは品質基盤のための資料作成ではなく、
current EmlisAIの商品不合格を直接減らす作業にする。

## 12.4 Piece / Analysisのcurrent stateは変えない

```text
Piece:
  B2-A remains inactive.
  current implementation order unchanged.

Analysis:
  roadmap remains not activated.
  implementation exact0.

Cycle001:
  NOT_ACCEPTED.
  current route remains shared structural correction.

automatic progression:
  false.
```

---

# 13. closure statement

```text
POST_G2_VALUABLE_SYSTEM_NOT_DISCARDED
PRODUCT_QUALITY_INTELLIGENCE_CORE_REUSE_RECOMMENDED
CONTROL_PLANE_DAILY_REACTIVATION_REJECTED
OPTIONAL_REPRODUCIBILITY_CAPSULE_CONDITIONAL
EMLIS_PRIMARY_QUALITY_FOUNDATION_USE_DEFINED
PIECE_APPLICATION_DEFINED
ANALYSIS_APPLICATION_DEFINED
QUESTION_SYSTEM_APPLICATION_DEFINED
APP_WIDE_APPLICATION_DEFINED
PRODUCT_FIRST_EXTRACTION_REQUIRED
HUMAN_PRODUCT_READ_REMAINS_MANDATORY
ACTUAL_DEVICE_CREDIT_REMAINS_SEPARATE
CURRENT_PIECE_STATE_UNCHANGED
ANALYSIS_NOT_ACTIVATED
CYCLE001_NOT_ACCEPTED
PRODUCTION_EFFECT_0
AUTOMATIC_PROGRESSION_FALSE
```
