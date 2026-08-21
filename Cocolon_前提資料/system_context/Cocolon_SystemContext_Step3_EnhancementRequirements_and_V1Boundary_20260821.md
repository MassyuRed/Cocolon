---
document_id: COCOLON_SYSTEM_CONTEXT_STEP3_ENHANCEMENT_REQUIREMENTS_AND_V1_BOUNDARY_20260821
title: "Cocolon System Context — Step 3 強化requirements / V1境界 共同推奨"
created_at: "2026-08-21 JST"
decision_owner: "Mash"
product_and_operator_experience_owner: "Pro華恋"
technical_input_owner: "Ultra華恋"
execution_owner: "Pro華恋"
document_role: "STEP3_LEVEL3_DECISION_BRIEF_AND_PRO_ULTRA_INPUT_RECONCILIATION"
normative_status: "JOINT_REQUIREMENT_RECOMMENDATION__MASH_DECISION_PENDING"
scope_classification: "MASH_DECISION_AND_APPROVAL_REQUIRED_SCOPE_LEVEL_3"
primary_outcome: "BLOCKER_NARROWED"
source_plan: "USER_ATTACHMENT__Cocolon_SystemContext_EnhancementPlan_ProUltraJoint_20260821(6).md"
source_pro_operator_needs: "USER_ATTACHMENT__Pro華恋側 Operator Needs 抽出結果.txt"
source_ultra_audit_pr: 32
source_ultra_audit_head: "218cb8eedec85dd37b6277c8a79bb6da9e158fa1"
source_ultra_audit_path: "Cocolon_前提資料/system_context/Cocolon_SystemContext_UltraOperatorNeeds_and_CMEEActualUseGap_20260821.md"
source_ultra_audit_blob: "286e7af7685d6a717e3d3f9dbbaec8439c8923b4"
current_system_context_pr: 31
current_system_context_head: "bd3b6f9ab846f97edb2178a5623165b1927649d7"
current_cmee_design_pr: 30
current_cmee_design_head: "ce2b9beca61c2293ed2828a8caf964392f8eb9f4"
current_rules_blob: "1f77473d3afa137b32a3325e74ff16fbb55d6a4b"
mandatory_incident_blob: "1d0decca5ea2684541f4a03a257b4315646b1cff"
github_effect: "EXACT1_NEW_DOCUMENT_ON_SEPARATE_STACKED_DRAFT_PR"
implementation_effect: 0
source_effect: 0
test_runtime_effect: 0
product_effect: 0
product_credit: 0
technical_credit: 0
structure_map_delta: "STRUCTURE_MAP_DELTA_NONE"
automatic_progression: false
---

# Cocolon System Context — Step 3 強化requirements / V1境界 共同推奨

## 0. 結論

Pro華恋のOperator Needsと、Ultra華恋がactual repository、current System Context、最近のCMEE既存資産継承から独立抽出したOperator Needs／実使用gapを、役割を混ぜずに照合した。

共同推奨は次である。

> **System Context V1強化は、新しい情報倉庫や判断systemを作ることではない。既存のInventory／graph／Task Contextの上へ、canonical task-owner freshness、責任単位の正本関係、必読前提の充足、claim provenance、役割別の短い判断面を最小追加する。**

目的はSystem Contextを大きくすることではなく、Pro華恋とUltra華恋がCocolon本体へ使える能力を増やすことである。file数、metadata量、checker数、graph規模は成果にしない。

Step 1／Step 2から、次はactual gapとして成立している。

1. PR #31内ではfreshでも、CMEE canonical ownerであるPR #30 Step 10 headに対してstaleになり得る。
2. System Contextの`CURRENT_OWNER 14`とStep 10 exact14は、countが同じでも集合差exact1ずつの別集合である。
3. 2,016 files／60,279,123 bytesを選択しながら、actual判断に必要だった前提資料exact7を未選択だった。
4. 今回のoperator判断に不要だった具体例としてfont binary exact1が初期Contextへ含まれた。
5. `CMEE-ACTUAL-001`はexternal asset identityの検証には有効だったが、conclusion／Dispositionはoperator suppliedであり、machine discoveryではなかった。
6. 現行Step 5自体のbugは確認されていない。Step 5を再修正するのではなく、強化requirementsとして扱う。
7. 過去のPro／Ultra重複再確認回数はdurable evidenceから確定していないため、削減量を捏造しない。

この結果から、V1へ採用するrequirement exact9、defer exact5、恒久的な非対象exact12を共同推奨として固定する。ただし、Mashが管理入口、自動化境界、V1 scope、原本非置換を確認するまでLevel 3のfinal decisionは成立しない。

```text
STEP3_PRO_ULTRA_INPUT_RECONCILED = 1
STEP3_REQUIREMENT_RECOMMENDATION_COMPLETE = 1
MASH_LEVEL3_DECISION = 0
V1_SCOPE_APPROVED = 0
INITIAL_TECHNICAL_DESIGN = 0
IMPLEMENTATION = 0
AUTOMATIC_PROGRESSION = false
STOP_BEFORE_STEP4
```

---

## 1. 最終目的との接続と必要性境界

### 1.1 このStepで完成させるもの

このStep 3が完成させるのはSystem Context実装ではない。

> **actualに観測されたoperator gapだけを対象に、System Context V1が解く責任と解かない責任を有限なrequirementsへ固定し、MashがLevel 3判断できる状態にする。**

System Context強化はEmlisAI／Piece／分析構造／CMEEの商品品質を直接改善しないため、product creditは0である。一方、最近のCMEE既存資産継承で、設計・実装判断へ入る前の事実復元を誤らせるactual gapが確認された。

```text
canonical task-owner branchを見ないfreshness
+ responsibility ownerをcountで取り違え得る
+ required premise exact7のsilent missing
+ 2,016 files / 約60.3 MBの過大なoperator surface
+ machine factとoperator conclusionの混同可能性
```

したがって、V1実装候補は`OBSERVED_BLOCKER_MINIMAL_FIX`としてだけ成立し得る。

### 1.2 必要性A〜Fの拘束

| 条件 | actual根拠 | V1への拘束 |
|---|---|---|
| A. current未完了条件 | canonical owner freshness、required premise、responsibility owner、claim provenance、bounded role outputが未成立 | このgap以外を追加しない |
| B. 直接因果 | task profileがcanonical owner ref／required identity／責任関係を持たず、selected graphを短い判断面へ縮約しない | existing System Contextへ最小統合する |
| C. 成功時のevidence | CMEE Step 11で最新owner、必読資料、role Context、protected scope、unresolved routingを一度に復元できる | machine testに加えてPro／Ultra actual useを確認する |
| D. より小さい手段 | one-shot manual確認は一件を救うが、標準入口ごとの再構成負荷を残す | new serviceではなく既存manifest／profile／graphを第一候補とする |
| E. 費用・Mash負担 | new service／recurring cost／Mash操作を必要とする根拠はない | defaultは全て0。逸脱は別Level 3へ戻す |
| F. 完了・打切り | CMEE exact1、非CMEE exact1、changed-refでoperator effectを検証可能 | 負担が減らない、保守が増える、商品作業を圧迫する場合はSTOP／retire |

### 1.3 DETOUR防止

次を禁止する。

- requirementsをschema、stub、空directory、authority、Receiptへ分割し、それぞれを進捗にすること。
- 「まず全資料を完全分類する」「まずdashboardを作る」等、actual operator outputを伴わないPhase 0／P0を作ること。
- Unit名だけを先に作り、Pro／Ultraの実作業が軽くならないtechnical skeletonを反映すること。
- System Context保守がCMEE／Cocolon本体の作業より大きくなること。

最初のimplementation unitは、actual CMEE taskで`fresh canonical owner + required premise + bounded role view`を同時に返すusable resultを持つ必要がある。変更path、component分割、test、処理順はStep 4のUltra華恋が所有する。

---

## 2. Pro／Ultra意見の統合原則

### 2.1 混ぜない責任

- Pro華恋は、Mashの意図、商品目的、利用者価値、説明負担、質問routingを所有する。
- Ultra華恋は、actual ref、source／test／route、owner、protected boundary、technical feasibilityを所有する。
- System Contextは両者の代わりに判断しない。
- 本書はUltra華恋のtechnical designを代筆しない。
- 本書はPro華恋のproduct judgmentをmachine requirementへ変換しない。

### 2.2 同じ事実として共有するもの

次だけは同一manifestへbindする。

```text
repository / commit / path / blob
canonical task-owner ref
responsibility / lifecycle / authority / publication
supersession / conflict
selection reason / claim boundary
machine / manual / operator provenance
external / private locator state
```

Pro／Ultraでviewは変えてよいが、head、owner relation、current／historical分類、external availabilityという事実を別々に持たない。

### 2.3 Shared Needs exact6

1. 同じfresh canonical fact baseへbindする。
2. current／Draft／historical／externalとresponsibility分類を共通化する。
3. 選択理由、到達経路、claim boundaryを共通で持つ。
4. changed-refでmaterialな再読範囲を限定する。
5. unresolvedをPro／Ultra／Mash／external retrievalへroutingする。
6. actual-use feedbackでoperator valueを確認する。

---

## 3. V1採用requirements exact9

## SCV1-R01 — Canonical Task-Owner Ref / Freshness Binding

Task Contextはworkspace refだけでなく、taskごとのcanonical owner ref exact1以上を持ち、次を表示する。

```text
canonical task-owner repository / PR / branch / commit
context source ref
ancestor / diverged / missing relation
canonical owner側の未包含commit / changed paths
fresh / stale / unresolved
stale時のfail-close reason
```

自動化してよいのはref取得、ancestor比較、changed-path差分、未包含commitの提示までである。merge／rebase、正本選択、owner変更、stale例外は人間判断へ残す。

**Acceptance:** canonical owner側が更新されたとき、旧Contextを`FRESH`としてsilent reuseしない。

## SCV1-R02 — Responsibility / Lifecycle / Authority / Supersession

file単位の一語分類ではなく、責任単位で次を辿れるようにする。

```text
product purpose owner
current structure owner
detailed design owner
current actual source owner
protected test / contract owner
navigation owner
historical predecessor
publication state
authority / design_authority / effective condition
supersedes / superseded_by
conflicting current owner
manual overlay provenance
```

front matter、explicit metadata、Git history、task profileからの抽出とconflict可視化は自動化してよい。current ownerの自動確定、資料統合、authority付与、rename／削除／書換えは行わない。

**Acceptance:** owner候補が複数、nonauthority、Draft、historicalの場合、黙って一つへ統合せずreason付きで表示する。

## SCV1-R03 — Required Premise Identity / Mandatory Entry Chain

Task profileは最低件数やpath globだけでなく、required responsibilityとidentity／entry chainを持つ。

```text
required responsibility
expected canonical owner identity
mandatory read-first / manifest / roadmap / design entry
selected / not selected
fresh / stale / unresolved
missing reason
read-order inclusion
```

expected identityの存在、selection、freshness、read-order inclusionは検証してよい。filename近似だけによるrequired source決定や未記載responsibilityの推測は行わない。

**Acceptance:** 宣言済みrequired premiseがtreeに存在するのにsilent未選択となる件数は0。取得不能はabsenceへ変換せずreason付きunresolvedにする。

## SCV1-R04 — Claim Provenance / Mash Decision Lineage

claim単位で次を区別する。

```text
MACHINE_DISCOVERED
MACHINE_VERIFIED
MANUAL_PROFILE_ASSERTION
OPERATOR_SUPPLIED_CONCLUSION
MASH_EXPLICIT_DECISION
KAREN_PROPOSAL_NOT_MASH_DECISION
EXTERNAL_ASSET_VERIFIED
UNRESOLVED
```

Mash decision lineageは原文を複製せず、参照関係として表示する。

```text
Mash decision source
→ product / intent constraint
→ canonical design section
→ actual source / test / route
→ current implementation state
```

反映状態は少なくとも次へ分類する。

```text
DECIDED_UNREFLECTED
DESIGN_REFLECTED_NOT_IMPLEMENTED
IMPLEMENTED_NOT_ACCEPTED
ACCEPTED_CURRENT
SUPERSEDED
KAREN_PROPOSAL_NOT_MASH_DECISION
UNRESOLVED
```

明示source間のlink、path／blob／symbol verification、未接続箇所の可視化は自動化してよい。Mashの未明示意図・感情の推測、operator conclusionのmachine conclusion化、final Disposition、acceptanceは行わない。

**Acceptance:** machineが確認した範囲と、Pro／Ultra／Mashが判断した範囲を同じclaimとして表示しない。

## SCV1-R05 — Shared Manifest / Role-Specific Decision Surfaces

同じmanifest fingerprintから、Pro ContextとUltra Contextを生成する。

### Pro Context

```text
今回の目的 / bounded scope / freshness
Mashの固定条件とdecision source
商品目的 / user-visible route / current product owner
current / future / historical
必読原本と選択理由
product routeへ影響するtechnical finding
何が変わるか / 何の証明には使えないか
Ultra technical gap / Mash normative decision / external gap
普通の言葉のresult
```

### Ultra Context

```text
exact repository / PR / commit refs
canonical owner freshness
required premise completeness
changed paths / source / symbol / call chain
related test / contract / route
allowed / protected / forbidden / review-only
current owner / duplicate / conflict
claim provenance
impact / minimal readback surface
technical gap / implementation candidate surface / STOP
```

**Acceptance:** Pro／Ultra viewが同じexact refsとmanifestへ戻れ、roleごとの結論を自動統合しない。

## SCV1-R06 — Selection Explanation / Bounded Read Surface

2,016-file closureを初期operator outputにしない。選択を次へ段階化する。

```text
DECISION_SURFACE
MUST_READ_FULL
REFERENCE_ON_TRIGGER
EXCLUDED_WITH_REASON
UNRESOLVED_IMPACT
```

各selected fileへ、選択理由、到達元、current／historical、判断用途、証明できないこと、関連ownerを付ける。bytes、理由数、file数のbudgetを表示し、超過時は初期packetを縮約する。

**Acceptance:** 初期Pro／Ultra Contextが全closure／約60.3 MBの直接読解を前提にせず、原本full readへ辿れる。

## SCV1-R07 — Protected Scope / High-Confidence Drift / Minimal Impact

Ultra向けにfile／symbol／routeごとのowner、usage、changeability、required approval、write targetを示す。

```text
ALLOWED_WRITE_CANDIDATE
PROTECTED_REVIEW_REQUIRED
FORBIDDEN
REVIEW_ONLY_EXTERNAL
RELATED_NOT_WRITE_AUTHORIZED
UNRESOLVED
```

V1のdrift detectionはhigh-confidenceな事実に限定する。

- owner path不存在。
- exact ref／blobのstale。
- rename／delete後もcurrent ownerが旧pathを指す。
- retired routeがactive call chainへ残る。
- declared test／contract ownerとactual route closureの不一致。
- design-onlyをruntime actualとして扱う。

change impactはdirect、probable、unchanged、manual reviewへ分け、minimal readback surfaceを返す。不明影響を`NO_IMPACT`へ推測しない。

**Acceptance:** 関連fileであることを変更許可へ変換せず、changed-refで必要な再読だけを理由付きで示す。

## SCV1-R08 — External / Private / Other-Workspace Locator

本文を複製せず、次を区別する。

```text
CURRENT_WORKSPACE
OTHER_DRAFT_OR_BRANCH
OTHER_WORKSPACE
GIT_HISTORY_ONLY
LIBRARY_OR_ATTACHMENT
LOCAL_ONLY
PRIVATE_LOCATOR_ONLY
EXISTENCE_UNVERIFIED
RETRIEVAL_GAP
ACTUAL_ABSENCE
```

最低metadataはlocator、expected ref／hash、availability、privacy、canonicality、adoption state、retrieval owner、claim boundaryとする。

**Acceptance:** private body leakage 0。取得不可を不存在と表示しない。未採用knowledgeを自動採用しない。

## SCV1-R09 — Thin Collaboration Outputs / Actual-Use Feedback

R01〜R08の同じmanifestから、別subsystemを作らずthin projectionとして次を生成可能にする。

### Short restart packet

```text
current refs / canonical owner refs
performed / zero effects
changed paths
verified facts
unresolved exact points
next bounded work
prohibited scope
required model / environment
```

### Ultra subagent read-only packet

```text
subtask purpose
exact refs
selected files / symbols / routes
selection reason
question to answer
prohibited inference
prohibited write / effect
expected output shape
coverage boundary / overlap
unresolved handback
```

### Actual-use feedback

```text
SELECTED_AND_USED
SELECTED_BUT_NOT_NEEDED
MANUALLY_FOUND_ADDITIONAL
NEEDED_BUT_NOT_SELECTED
SELECTION_REASON_INSUFFICIENT
ROLE_OUTPUT_INSUFFICIENT
NOT_A_TOOL_PROBLEM
```

packet案、coverage map、operator feedbackの軽量記録は許可する。subagent生成／model選択／実行／final採否や、machine PASSによるoperator value確定は行わない。

**Acceptance:** 独立database、dashboard、orchestrator、approval ledgerにならず、同じcurrent graphから再生成できる。

---

## 4. V1でdeferするもの exact5

| ID | 内容 | defer理由 | 再検討条件 |
|---|---|---|---|
| DEF-01 | AIによる設計本文のsemantic drift判定 | false positiveで正本判断を代替し得る | high-confidence identity driftだけでは解けないactual task exact1 |
| DEF-02 | causal failure／log／noiseのdiagnostic integration | CI／test／log toolingと重複しやすい | produced result locatorとownerの手動接続blockerが再発 |
| DEF-03 | asset conclusion／Dispositionの自動発見 | machine verificationとoperator conclusionが別だった | human judgmentを保った独立discoveryの必要性が実証された場合 |
| DEF-04 | 全domainのtask profile大量展開 | CMEE固有path collectionまたは保守増大の危険 | CMEE＋性質の異なる非CMEE task exact1の実証後 |
| DEF-05 | operator analytics／dashboard／自動最適化 | System Context自身が巨大倉庫になり得る | lightweight feedbackで不足するactual gapが確認された場合 |

`defer`は将来自動採用を意味しない。再検討には別のactual pain pointと、より小さい既存手段がないことを必要とする。

---

## 5. V1の恒久的な非対象 exact12

1. Mashの思想、判断、感情、商品目的を新たに生成すること。
2. Pro／Ultraのfinal judgment、asset Disposition、採用／非採用を自動決定すること。
3. human Product Read、商品品質PASS、acceptance、candidate-readyを判定すること。
4. 前提資料、設計書、source、test、private knowledge本文を第二の正本へ複製すること。
5. current owner／authorityを機械が自動確定すること。
6. document／source／testを自動削除、rename、統合、修正すること。
7. auto merge／rebase／fix／retry／GitHub write／workflow executionを行うこと。
8. subagentの生成、model選択、実行制御、最終統合を独自system化すること。
9. private bodyのpublic copy／公開hash化、未採用knowledgeの自動採用を行うこと。
10. external vector DB、search service、常駐daemon、new recurring cost、dashboardをactual blockerなしに導入すること。
11. 全file全文を毎回model contextへ投入すること。
12. 新しいapproval ledger、Receipt family、authority familyを作ること、またはSystem Context PASSをCocolon商品品質PASSへ変換すること。

---

## 6. 管理入口と原本の境界

### 6.1 共同推奨

管理入口移行は、次の形で**方向として承認し、activationはV1 acceptance後へ遅延**することを推奨する。

```text
作業開始:
  System Context standard entry
  → canonical refs / required premise / role Contextを生成
  → selected原本をactual full read
  → Pro / Ultraが各責任で判断

fallback:
  stale / tool failure時はfail-close
  → direct GitHub readで原本へ到達
```

### 6.2 System Contextへ移すもの

- file管理、探索、正本候補、lifecycle、supersession、影響把握の入口。
- task別の読む順とrole-specific view。
- external assetのbody-free locator。
- current ref／stale／unresolvedの可視化。

### 6.3 System Contextへ移さないもの

- Mash判断の原文とnormative authority。
- 前提資料／設計書の本文正本。
- source／test／contractのactual bytes。
- Pro／Ultra／Mashの判断。
- human Product Read。

System Contextは原本へのroutingと矛盾検出を担う。第二の正本にはしない。

---

## 7. 自動化境界のplain-language固定

### System Contextに任せること

- 最新の対象refとcanonical owner側との差を取る。
- 明示metadataからowner候補、lifecycle、authority、supersessionを並べる。
- required premiseが選択されているか確認する。
- source／test／route／documentの直接関係を辿る。
- fileが選ばれた理由と、何の証明には使えないかを示す。
- ProとUltraへ同じ事実から別の読みやすいviewを返す。
- unresolvedを担当者別に分ける。
- private本文を出さず、所在と取得状態だけを示す。

### 華恋／Mashが判断すること

- conflicting ownerのどれを正本にするか。
- Mashの言葉が何を意味し、商品へどう反映するか。
- technical assetを採用、部分継承、retireするか。
- source／testをどう設計・実装・変更するか。
- 商品品質、Product Read、acceptance。
- private knowledgeをCocolonへ採用するか。
- new method／scope／service／費用／privacy boundary。

> **System Contextは「何を読めばよいか、なぜ読むか、どこがfreshでないか、誰が判断すべきか」を揃える。何が正しい商品判断か、どう実装するか、採用するかは決めない。**

---

## 8. V1 acceptance criteria

### Correctness

- canonical task-owner refに対するstale Context使用 0。
- declared required premiseのsilent missing 0。
- current owner conflictは0、またはreason付きunresolved。
- superseded／historical／nonauthorityをsilent current owner化しない。
- selected fileはexact ref／path／blob／selection reasonへ戻れる。
- machine／manual／operator／Mash claim provenanceを混ぜない。
- private body leakage 0。

### Operator value

- Pro華恋が、Mash判断、商品目的、current／historical、product-route finding、Mash decision pointを一つの短いContextで確認できる。
- Ultra華恋が、exact refs、required premise、source／test／route、protected scope、impact、technical gapを一つの短いContextで確認できる。
- 初期Contextが2,016-file closure／約60.3 MBの直接読解を前提にしない。
- fileの選択理由とclaim boundaryを人間が理解できる。
- Mashへhash、manifest、更新command、低レベルowner判定を依頼しない。
- actual-use feedbackで不要選択と選択漏れを記録できる。

### Maintainability

- existing System Contextへの最小統合をdefaultとする。
- current generated outputはreplace-current、historyはGit history。
- external service 0、new recurring cost 0をdefaultとする。
- auto delete／rename／rewrite／merge／retry 0。
- System Context failure時も原本をdirect readできる。
- V1後のSystem Context専用作業がCocolon本体より大きくならない。

### Actual proof exact3

1. CMEE Step 11で実使用PASS。
2. 性質の異なる非CMEE read-only task exact1で実使用PASS。
3. same-ref／canonical-owner changed-ref／source・test・premise rename-delete fixture／fresh cloneで更新PASS。

加えて、Pro／Ultra双方がactual作業上の明確な改善を確認し、Mashの技術監視・情報再構成負担が増えていないことを確認する。machine testだけでOperator valueを確定しない。

---

## 9. STOP / retire条件

次のいずれかでscopeを増やさずSTOPまたはretire判断へ戻す。

1. canonical freshness、required premise、role viewという中心gapを解かず、metadata／schema／dashboardだけが増える。
2. 初期Contextが再び大量closureの直接読解を要求する。
3. Pro／Ultraが同じmanual owner／lifecycle／selection再構成を継続する。
4. external service、new dependency、recurring cost、private body ingestionが必要になる。
5. System Context保守がCMEE／Cocolon本体の作業を継続的に遅らせる。
6. operator feedbackで負担削減が確認できず、選択漏れまたは不要選択が改善しない。
7. original sourceを読まなくてよいsystem、または判断を自動化するsystemへscopeが広がる。
8. Step 4 technical designでV1 exact9を同一bounded architectureへ安全に閉じられない。

STOP時は新しいhelper／scanner／authority familyを追加せず、成立しないrequirementと最小代替routeを示す。

---

## 10. Mash Level 3 decision exact4 — 共同推奨

### DECISION-01 — 管理入口移行方針

**推奨:** `APPROVE_DIRECTION__ACTIVATE_ONLY_AFTER_V1_ACCEPTANCE`

前提資料探索、正本候補確認、Task Context生成をSystem Contextから開始する方向を承認する。ただしStep 3時点では移行しない。V1 actual proofとfreeze後にactivationし、direct GitHub read fallbackを残す。

### DECISION-02 — 自動化境界

**推奨:** `APPROVE_FACT_ROUTING_AUTOMATION__HUMAN_JUDGMENT_RETAINED`

identity、freshness、明示metadata、関係、selection、claim provenance、role view、unresolved routingだけを自動化する。owner確定、Mash意図、product judgment、technical design、Disposition、Product Read、acceptance、writeは自動化しない。

### DECISION-03 — V1 scope

**推奨:** `APPROVE_V1_EXACT9__DEFER_EXACT5__REJECT_EXACT12`

本書§3のSCV1-R01〜R09だけをV1候補とする。§4はdefer、§5は非対象とする。Step 4のUltra華恋はrequirementsを増やさず、existing System Contextへ統合できる最小technical designを作る。new componentが必要な場合は、actual evidenceと既存統合で不可能な理由を示しLevel 3へ戻す。

### DECISION-04 — 原本非置換方針

**推奨:** `APPROVE_ORIGINALS_REMAIN_CANONICAL`

前提資料、設計書、source、test、Mash判断、private knowledgeは各current ownerへ残す。System Contextはidentity／relation／routing／conflict／read orderを持つが、本文の第二正本にならない。

上記exact4を承認する場合も、次は自動承認されない。

```text
new external service = 0
new recurring cost = 0
Mash manual operation = 0 default
implementation permission = 0
GitHub source / test change permission = 0
automatic progression = false
```

---

## 11. Mash承認後のnext exact1

MashがDECISION-01〜04を承認した場合だけ、次のbounded workは以下となる。

> **Step 4 — Ultra華恋が、current PR #31／#32／本書のstable identityとactual sourceをfresh確認し、SCV1-R01〜R09をexisting architectureへ最小統合するinitial technical design exact1を作る。**

Step 4はimplementationではない。Pro reviewはstable initial technical designへ一回だけ行い、Mashのfinal technical approval前に実装へ進まない。

---

## 12. Completion / STOP

```text
STEP0_CURRENT_SYSTEM_CONTEXT_STEPS1_TO_5 = COMPLETE_AT_PR31_HEAD_bd3b6f9
STEP1_PRO_OPERATOR_NEEDS = COMPLETE
STEP1_ULTRA_OPERATOR_NEEDS = COMPLETE_AT_PR32_HEAD_218cb8e
STEP2_CMEE_ACTUAL_USE_AUDIT = COMPLETE_AT_PR32_HEAD_218cb8e

PRO_OPERATOR_NEEDS_REAUTHORED_BY_ULTRA = 0
ULTRA_TECHNICAL_DESIGN_REAUTHORED_BY_PRO = 0
PRO_ULTRA_SHARED_FACTS_RECONCILED = 1
ACTUAL_GAP_TO_REQUIREMENT_MAPPING = COMPLETE
V1_REQUIREMENT_CANDIDATE = EXACT9
V1_DEFERRED = EXACT5
NOT_SYSTEM_CONTEXT_SCOPE = EXACT12

MASH_LEVEL3_DECISION = PENDING
V1_SCOPE_APPROVED = 0
MANAGEMENT_ENTRY_ACTIVATED = 0
INITIAL_TECHNICAL_DESIGN = 0
IMPLEMENTATION = 0
TEST_RUNTIME_EFFECT = 0
PRODUCT_EFFECT = 0
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
PRIMARY_OUTCOME = BLOCKER_NARROWED
STRUCTURE_MAP_DELTA_NONE
AUTOMATIC_PROGRESSION = false
STOP_BEFORE_STEP4
```
