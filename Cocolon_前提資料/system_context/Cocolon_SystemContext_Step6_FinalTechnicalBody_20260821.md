---
document_id: COCOLON_SYSTEM_CONTEXT_STEP6_FINAL_TECHNICAL_BODY_20260821
title: "Cocolon System Context — Enhancement Step 6 Final Technical Body"
created_at: "2026-08-21 JST"
decision_owner: "Mash"
technical_design_owner: "Ultra華恋"
product_operator_review_owner: "Pro華恋"
execution_owner: "Ultra華恋"
document_role: "ENHANCEMENT_STEP6_FINAL_TECHNICAL_BODY"
normative_status: "FINAL_TECHNICAL_CANDIDATE__MASH_APPROVAL_PENDING"
scope_classification: "MASH_DECISION_AND_APPROVAL_REQUIRED_SCOPE_LEVEL_3"
execution_environment: "WORK_ULTRA_REQUIRED"
final_candidate_class: "NEXT_BOUNDED_WORK_CANDIDATE"
ultra_final_verdict: "CANDIDATE_CORRECTED"
source_step3_pr: 33
source_step3_approved_head: "d8652770598caaee3cdb1cf88c3520a44c4412b3"
source_step4_pr: 34
source_step4_head: "41c41f41d11cebb270937349fb2152b4079d6dc2"
source_step4_blob: "adafb8b059f7d0f9f786a3209b2c9eae52effc90"
step4_initial_design_lifecycle: "SUPERSEDED_AS_CURRENT_TECHNICAL_CANDIDATE_BY_THIS_FINAL_BODY"
source_step5_pr: 35
source_step5_head: "87896aec29a639356ca83e2310291db0e0a5d136"
source_step5_blob: "a205aa04e50fa08ea690e4b385a1988c881abbaa"
pro_review_count_for_step4_stable_identity: 1
pro_required_corrections: "PRO-RR-01_TO_05_EXACT5"
pro_required_corrections_disposition: "REFLECTED_EXACT5"
primary_outcome: "BLOCKER_NARROWED"
github_effect: "EXACT1_FINAL_TECHNICAL_BODY_ON_NEW_STACKED_DRAFT_PR"
implementation_effect: 0
source_effect: 0
test_effect: 0
profile_effect: 0
workflow_effect: 0
generated_output_effect: 0
runtime_effect: 0
product_effect: 0
product_credit: 0
technical_credit: 0
structure_map_delta: "STRUCTURE_MAP_DELTA_NONE"
automatic_progression: false
---

# Cocolon System Context — Enhancement Step 6 Final Technical Body

## 0. Final technical verdict

Ultra華恋の最終判定はexactly oneである。

```text
FINAL_CANDIDATE_CLASS = NEXT_BOUNDED_WORK_CANDIDATE
ULTRA_FINAL_VERDICT = CANDIDATE_CORRECTED
PRO_RR_01_TO_05 = REFLECTED_EXACT5
INITIAL_CORE_DESIGN_RETAINED = 1
```

Step 4の中心設計は採用する。

```text
task_profiles.v2
+ existing prepare
+ existing Task Context compiler
+ existing publication transport
```

へのin-place統合、one shared operator fact model、originals remain canonical、automatic owner／merge／rebase／write／activation 0、new service／DB／daemon／dashboard／runtime dependency 0は変えない。

Pro華恋のStep 5 reviewを結論の代用にせず、current source、generated graph、PR actualに戻って`PRO-RR-01`〜`PRO-RR-05`を独立判定した。全5件ともinitial architectureを拡張せずに解け、Operator valueの条件を正すため、`ADOPT_WITH_TECHNICAL_CORRECTION`として本final bodyへ反映する。

ただし、本文書はMashの承認候補であり承認記録ではない。current implementationにはunsafe executable workflow exact3と未実装のV2が残る。PR #30との`DIVERGED`はcanonical owner relationのactual inputであり、Step 7開始blockerまたはmerge／integration requirementではない。

```text
STEP6_ULTRA_FINAL_TECHNICAL_BODY = COMPLETE
MASH_FINAL_TECHNICAL_APPROVAL = PENDING
CURRENT_IMPLEMENTATION_READY = NO
IMPLEMENTATION_PERMISSION = 0
STEP7_START_PERMISSION = 0
```

---

## 1. Authority、lineage、precedence

### 1.1 Exact source lineage

| Role | Durable identity | State used by Step 6 |
|---|---|---|
| Step 3 approved requirement boundary | PR #33 head `d8652770598caaee3cdb1cf88c3520a44c4412b3` | approved input |
| Step 4 initial technical design | PR #34 head `41c41f41d11cebb270937349fb2152b4079d6dc2`, blob `adafb8b059f7d0f9f786a3209b2c9eae52effc90` | initial design baseline |
| Step 5 Pro review | PR #35 head `87896aec29a639356ca83e2310291db0e0a5d136`, blob `a205aa04e50fa08ea690e4b385a1988c881abbaa` | exact1 Product／Operator Route Review |
| CMEE canonical owner | PR #30 head `ce2b9beca61c2293ed2828a8caf964392f8eb9f4` | read-only canonical owner input／freshness denominator; Step 7 merge／integration requirement 0 |
| mashos-api CMEE／route actual | `06ce311b3ea728b06f83439d268a34bed917c01c` | read-only source／test evidence |

PR #34とPR #35は2026-08-21 JSTのfresh確認時点で`Draft / open / unmerged / mergeable`である。PR #35はPR #34 headのexact1 childでchanged path exact1。同じStep 4 stable identityへのPro full reviewはexact1を消費済みである。本exact5反映はProが指定した修正envelope内で、新subsystem、新product scope、新authorityを追加しない。したがって追加のPro full reviewは0である。

### 1.2 Final-body precedence

本書はStep 6のexactly one final technical bodyである。実装者は次の順で解決する。

1. Mashの本final identityに対する将来の明示決定。
2. 本Step 6 final body。
3. 本書が固定参照するStep 4 blobの詳細definition。
4. Step 3 approved requirement boundary。
5. current implementation／generated actual。

Step 4 initial designのstable GitHub identityとhistorical evidenceは不変であるが、current technical candidateとしては本final bodyがこれをsupersedeする。Step 5 review recordはinputでありsupersedeしない。Step 4の次は本書で置換する。

```text
Step 4 §0 divergence／integration blocker conclusion
§5.1 top-level purpose
§5.2 canonical task-owner readiness
§5.10 Pro role policy / feedback
§7.3 Pro Context
§10 top-level canonical-owner-movement row
§10.1 PR #30 expected-result admission
§15.2 T13 / T14 / T17
§15.6 T55 / T61 wording
§16.2 canonical-owner / other-branch blocked cases
§18.2 CMEE / non-CMEE proof
§20 CURRENT_BLOCKER_1
§Step7 implementation unit boundary
```

その他のStep 4の、canonical ref resolver、TOCTOU exact3 equality、responsibility／lifecycle／authority／supersession、required premise identity、claim provenance、design–actual–test connection、scope enum、privacy 4軸、deterministic selection exact7／drift exact6、whole-workspace transaction、output exact counts、test T01〜T74、STOP／rollbackは、本書の補正と矛盾しない限り本final bodyに統合したdefinitionとして保持する。上記blobが取得できない場合は記憶で補完せずSTOPする。

---

## 2. Mashが判断するための普通の言葉

### 2.1 何が楽になるか

- Pro華恋は、大量のfile listを開く前に、今回の作業と商品のつながり、正本の鮮度、Mashの固定条件、今読む原本、未解決の戻し先を一画面で確認できる。
- Ultra華恋は、exact ref、required premise、source／symbol／route／test、変更可否、影響、STOPを同じfact modelから確認できる。
- セッションごとの正本探索とContext再構成を減らし、原本を読むべき箇所へ直接戻れる。
- Mashがhash、manifest、ID、path、更新commandを操作する作業は増えない。

### 2.2 何が変わるか

- existing `task_profiles.json`をV2 routing contractへする。
- existing `prepare`がcanonical task-owner refとworkspace refの関係をfreshに解決する。
- existing Task Context compilerがshared `operator_context.json`を一度だけ作り、Pro／Ultra／collaboration用の薄いprojectionを派生する。
- current executable workflow exact3は、current event branch／PR以外へwriteせず、source auto-repair writerにならない境界へ補正する。

### 2.3 原本はどう守られるか

- System Contextはpath、ref、blob、owner、reason、claim boundaryを持つnavigation／routing layerであり、前提資料、設計書、source、test、Mash判断の本文を複製しない。
- Pro／Ultraの短いContextは原本読了の代替ではなく、どの原本をなぜ読むかの入口である。
- private body／summary／quote／content-derived public hashは読み込まない。公開できないlocatorはopaque IDとretrieval ownerだけを扱う。
- 原本の自動削除、rename、統合、修正は0である。

### 2.4 自動化しないこと

- product purpose、Mashの意図、current owner、semantic correctness、supersession、Disposition、Product Read、acceptanceの自動判定。
- merge／rebase／owner変更／activation／ready／next Stepの自動実行。
- feedbackによる自動rank／selection／profile mutation。
- subagentの生成、model選択、tool実行、write、final採否。
- analytics、KPI、dashboard、vector DB、search service、daemon、新しいapproval／Receipt family。

### 2.5 Joint recommendation

Pro華恋の採用条件とUltra華恋のtechnical correctionを統合した共同推奨は次である。

> Mashが本文書のpublished exact identityと自動化境界を明示承認した場合だけ、Ultra華恋はPR #36 lineageからone bounded Step 7 implementation candidate exact1をfresh admissionする。PR #30はread-only canonical owner refとしてfresh resolveし、Step 7 branchへのmerge／integrationを開始条件にしない。

この推奨は承認、PR #30のmerge／integration、implementation権限を生成しない。

---

## 3. Approved V1 scopeを再固定する

### 3.1 Current V1 requirement exact9

```text
SCV1-R01 Canonical Task-Owner Ref / Freshness Binding
SCV1-R02 Responsibility / Lifecycle / Authority / Supersession
SCV1-R03 Required Premise Identity / Mandatory Entry Chain
SCV1-R04 Claim Provenance / Mash Decision Lineage
SCV1-R05 Shared Manifest / Role-Specific Decision Surfaces
SCV1-R06 Selection Explanation / Bounded Read Surface
SCV1-R07 Protected Scope / High-Confidence Drift / Minimal Impact
SCV1-R08 External / Private / Other-Workspace Locator
SCV1-R09 Thin Collaboration Outputs / Actual-Use Feedback
```

### 3.2 Deferred exact5

```text
DEF-01 semantic drift AI judgment
DEF-02 causal failure / log / noise diagnostic integration
DEF-03 automatic asset conclusion / Disposition discovery
DEF-04 all-domain task-profile expansion
DEF-05 operator analytics / dashboard / automatic optimization
```

`account_profile_read_only` exact1はDEF-04を解除しない。CMEEと性質の異なるnon-CMEE proofを1件だけ確認するephemeral fixtureであり、account、subscription、Piece、Analysisその他全domainのprofile大量展開は0である。

### 3.3 Current V1 excluded exact12

1. Mashの思想、判断、感情、商品目的を新たに生成すること。
2. Pro／Ultraのfinal judgment、Ultra technical design／go・STOP、asset Disposition、採用／非採用を自動決定すること。
3. human Product Read、商品品質PASS、acceptance、candidate-readyを判定すること、または生成要約を原本読了の代替にすること。
4. 前提資料、設計書、source、test、private knowledge本文を第二の正本へ複製すること。
5. current owner／authority／semantic correctness／supersessionをmachineが自動確定すること。
6. document／source／testを自動削除、rename、統合、修正すること。
7. auto merge／rebase／fix／retry／GitHub write／workflow executionを行うこと、またはCI／test／log runnerを再実装すること。
8. subagentの生成、model選択、実行制御、最終統合を独自system化すること。
9. private bodyのpublic copy／公開hash化、未採用knowledgeの自動採用を行うこと。
10. external vector DB、search service、常駐daemon、new recurring cost、dashboardをactual blockerなしに導入すること。
11. 全file全文を毎回model contextへ投入すること。
12. 新しいapproval ledger、Receipt family、authority familyを作ること、またはSystem Context PASSをCocolon商品品質PASS／次Step／implementation／activationへ自動変換すること。

---

## 4. Fresh evidenceとcurrent blocker

### 4.1 Current System Context actual

current durable outputは次を実証済みである。

```text
selected files = 2,016
closure edges = 759,989
selected source bytes = 60,279,123
required category exact10 = PASS
blocking unresolved = 0 under legacy contract
legacy completion = COCOLON_SYSTEM_CONTEXT_STEPS1_TO_5_COMPLETE
```

これはfull traceの完全性を示すが、Pro／Ultraが使う短いdecision surfaceの成立は示さない。category count PASSはrequired premise identity、canonical owner freshness、claim provenance、operator readinessを代替しない。

### 4.2 Canonical CMEE owner relation

PR #35 headとPR #30 canonical owner headのfresh compareは次である。

```text
merge base = d29042f44e882110514b74dcc6a1b3f31ec746e6
relation = DIVERGED
PR #35 side unique commits = 187
canonical owner side unique commits = 1
canonical owner side relevant changed paths = exact14
```

本Step 6 exact1がpublishされるとPR側countは変化するため、published headの関係はpostverificationで再測定する。上記はsource baselineである。

このactualでは、次を直交して表示する。

```text
canonical owner ref resolution = FRESH
workspace / owner relation = DIVERGED
workspace contains canonical owner = false
canonical owner content access = READ_ONLY_EXACT_REF
merge / rebase / integration requirement = 0
write authorization from relation = 0
```

`DIVERGED`はSystem Contextが隠さず返すactual relationである。owner exact refとrequired premisesをfreshに解決してread-only取得できる限り、divergenceだけでOperator Contextをblockせず、Step 7開始もblockしない。ただし、workspaceがownerを取り込み済みとは表示せず、relationからwrite authorityを生成しない。System Contextによる自動merge／rebaseは0である。将来CMEE exact14を変更するowner-owned write taskではtarget／baseを別途明示固定する必要があるが、Step 7 exact9はPR #30 exact14を変更しない。

### 4.3 Executable workflow blocker

current executable exact3には次のunsafe behaviorが残る。

```text
.github/workflows/cocolon-system-context-inventory.yml
  historical branch / PR #31 target

.github/workflows/cocolon-system-context-step5-export.yml
  historical branch dispatch / poll / ref update

.github/workflows/cocolon-system-context-step5-pytest-bootstrap.yml
  source auto-repair / commit / push writer
```

これらはStep 7 candidate内でcurrent event identityへbindし、exportとbootstrapはread-only verifierへ縮小する。補正前のwriter workflowは起動しない。

### 4.4 Step 6 prepare attemptの事実

isolated Step 6 worktreeでcurrent standard `prepare --workspace cmee_working --task cmee`を起動したが、expected sibling `mashos-api`がworktreeの`.cocolon-context-workspace/` 下へmaterializeされていないため、`repository unavailable`で実行前にfail-closeした。

- generated／profile／source／test／workflow changeは採用していない。
- この失敗をprepare PASS、actual proof、implementation blocker解消と表示しない。
- Step 7はPR #36 lineageのCocolon implementation workspaceとapproved mashos-api exact refをmaterializeしたworkspaceで開始する。PR #30はfresh resolved exact refからread-onlyで取得し、Step 7 branchへmerge／integrationしない。Cocolon implementation workspaceまたはmashos-apiが不足すればcandidateをSTOPする。

---

## 5. Final architecture

### 5.1 Component flow

```text
workspace_profiles.v1 (repository transport owner; unchanged)
→ task_profiles.v2 (task-scoped operator routing contract)
→ existing prepare canonical-owner resolver
→ workspace / owner ref relation + task_dependency_fingerprint
→ existing Inventory / Code Index / Route Graph (schema unchanged)
→ enhanced existing Task Context compiler
→ operator_context.json (shared fact model exact1)
→ pro_context.md / ultra_context.md / collaboration_packets.json
→ context_manifest.v2
→ existing publication transport
→ prepare receipt v2
→ current-PR-bound single writer
```

### 5.2 Component ownership

| Component | Final V1 responsibility | Explicit non-responsibility |
|---|---|---|
| `workspace_profiles.json` | repository identity／transport | task purpose／canonical task owner |
| `task_profiles.json` | explicit owner／premise／responsibility／claim／connection／scope／locator／role／event feedback routing | canonical body、semantic authority、automatic adoption |
| `prepare` | read-only remote ref resolve、relation／changed path、dependency fingerprint、staged whole-workspace publication | merge／rebase／working-tree rewrite／remote write |
| Task Context compiler | exact metadata／endpoint verification、conflict、shared model、projection、privacy guard | product judgment、Mash意図推測、Product Read |
| Inventory／Code／Route | existing deterministic identities／edges | authority、permission、semantic correctness |
| publication transport | manifest-declared logical bytesのpack／verify | new storage service／history DB |
| workflow exact3 | current branch／PR-only writerまたはread-only verifier | historical ref write、auto-repair、force／retry／activation |

### 5.3 One fact base

`operator_context.json`だけがV1 operator factのmachine-readable shared modelである。`pro_context.md`、`ultra_context.md`、`collaboration_packets.json`は、それぞれ別fact、別owner、別conclusionを持てない。

projectionは`operator_context_sha256`と`operator_model_fingerprint`へbindし、same inputからbyte-exact再生成できなければpublish 0とする。AI summary、free-formの新fact、roleごとのsemantic selectionは追加しない。

---

## 6. Final `task_profiles.v2` contract

### 6.1 Top-level shape

V2 taskでfree-form `purpose`は禁止し、non-normativeな`task_orientation`へ分離する。

```json
{
  "schema_version": "cocolon.system_context.task_profiles.v2",
  "persistent_primary_task": "cmee",
  "tasks": {
    "cmee": {
      "publication_mode": "PERSISTENT_PRIMARY",
      "task_orientation": "routing-only description",
      "domains": ["CMEE", "EmlisAI", "Piece", "Analysis", "shared"],
      "seed_rules": [],
      "current_owner_rules": [],
      "historical_rules": [],
      "required_categories": [],
      "required_category_exact": 10,
      "operator_contract": {
        "canonical_owner_refs": [],
        "required_premises": [],
        "document_responsibilities": [],
        "claim_nodes": [],
        "connections": [],
        "scope_rules": [],
        "external_locators": [],
        "role_views": {},
        "collaboration": {},
        "actual_use_feedback": []
      }
    }
  }
}
```

V2は`tasks.<id>.purpose`をschema errorにする。v1のlast-good compatibility readに限り、legacy `purpose`を`task_orientation / authority_claim=false`として表示できる。その値からproduct purpose、Mash fixed condition、acceptance、next workを生成しない。

### 6.2 Product purpose／Mash condition provenance

product purposeとMash fixed conditionは`claim_nodes` exact rowからだけprojectionする。少なくとも次を必須にする。

```text
claim_id
claim_kind = PRODUCT_PURPOSE | MASH_FIXED_CONDITION | PRODUCT_ROUTE | CURRENT_PRODUCT_OWNER | ZERO_EFFECT_BOUNDARY
asserted_value_code
asserted_by
decision_owner
assertion_provenance
source_locator
adoption_state
claim_boundary
verification_status
verified_scope[]
```

`PRODUCT_PURPOSE`と`CURRENT_PRODUCT_OWNER`はcurrent product／structure ownerのpublic source locatorを、`MASH_FIXED_CONDITION`は`asserted_by=Mash`、durable source locator、decision ownerを必須にする。Mash原文の複製はせず、fixed renderer codeとlocatorを表示する。machineはsource path／blob／declared valueの検証範囲だけを`verified_scope`に書き、claimの意味や受容を自動判定しない。

### 6.3 Existing final metadata families

以下のStep 4 definitionは本final bodyで維持する。

- canonical owner relation: `SAME_REF | WORKSPACE_CONTAINS_OWNER_REF | OWNER_REF_AHEAD | DIVERGED | REMOTE_UNRESOLVED`。
- expected premise identity: `BIND_EXACT_IDENTITY_AT_RESOLVED_OWNER_REF | FIXED_PUBLIC_COMMIT_BLOB_IDENTITY`。
- assertion provenance exact8: `MACHINE_DISCOVERED | MACHINE_VERIFIED | MANUAL_PROFILE_ASSERTION | OPERATOR_SUPPLIED_CONCLUSION | MASH_EXPLICIT_DECISION | KAREN_PROPOSAL_NOT_MASH_DECISION | EXTERNAL_ASSET_VERIFIED | UNRESOLVED`。
- adoption state: `DECIDED_UNREFLECTED | DESIGN_REFLECTED_NOT_IMPLEMENTED | IMPLEMENTED_NOT_ACCEPTED | ACCEPTED_CURRENT | SUPERSEDED | KAREN_PROPOSAL_NOT_MASH_DECISION | UNRESOLVED`。
- scope: `ALLOWED_WRITE_CANDIDATE | PROTECTED_REVIEW_REQUIRED | FORBIDDEN | REVIEW_ONLY_EXTERNAL | RELATED_NOT_WRITE_AUTHORIZED | UNRESOLVED`。
- selection tier: `DECISION_SURFACE | MUST_READ_FULL | REFERENCE_ON_TRIGGER | EXCLUDED_WITH_REASON | UNRESOLVED_IMPACT`。
- public／private locatorのlocation、availability、privacy、canonicalityの直交4軸。

ただし、Step 4 §5.2の「ready候補は`SAME_REF`／`WORKSPACE_CONTAINS_OWNER_REF`のみ」という定義は本final bodyで置換する。relationとread-only readinessは別軸である。`OWNER_REF_AHEAD`／`DIVERGED`でも、resolved owner headがexactでrequired premisesをそのexact refから取得でき、provenance／locatorが完全ならread-only Operator Contextは`V1_OPERATOR_CONTEXT_READY`になり得る。その場合もwrite authority 0、workspace-incorporation claim 0である。`REMOTE_UNRESOLVED`、またはrequired premiseを取得できない場合は`V1_OPERATOR_CONTEXT_BLOCKED`とする。

duplicate ID、dangling reference、unsafe path／ref、unsupported enum、supersession cycle、required provenance不足、forbidden private fieldはpublishは0である。

### 6.4 Persistence cardinality

workspaceに`PERSISTENT_PRIMARY` taskをexact1だけ許す。initial primaryは`cmee`である。`account_profile_read_only`は`EPHEMERAL_VERIFY_ONLY`で、candidate temp rootでcompile／verify後に破棄する。`current/<workspace>`、prepare receipt、publication transport、Git diffへ残さない。

---

## 7. Pro compact first-viewの最終仕様

### 7.1 Two-level budget

Step 4の`Pro max 24 items / 96 KiB`は全`pro_context.md`のouter hard ceilingとして保持する。それだけで「一つの短いContext」の成立はclaimしない。

`pro_context.md`の先頭に、詳細rowより前にcompact first-view exact1を置く。

```text
first_view_card_exact = 8
first_view_max_decision_items = 12
first_view_max_reasons_per_item = 2
first_view_max_utf8_bytes = 16 KiB
outer_pro_max_items = 24
outer_pro_max_utf8_bytes = 96 KiB
```

この16 KiBは実用性PASSではなくinitial hard ceilingである。Step 8の一回actual useでbefore／afterの読み始め導線と、必要な原本へ迷わず戻れたかをPro華恋が確認するまでOperator valueは未確定である。

### 7.2 Ordered exact8 cards

1. `TASK_ORIENTATION_AND_PRODUCT_CONNECTION`
2. `FRESHNESS_AND_BLOCKER`
3. `MASH_FIXED_CONDITIONS`
4. `CURRENT_PRODUCT_OWNER_AND_ROUTE`
5. `ORIGINALS_TO_READ_NOW`
6. `PRODUCT_ROUTE_FINDINGS_AND_CLAIM_BOUNDARY`
7. `UNRESOLVED_AND_HANDBACK`
8. `EFFECTS_STOP_AND_AUTOMATIC_PROGRESSION`

各cardはshared operator modelのstable ID、fixed label、public locator、reason codeからdeterministicにrenderする。一つのcardで全path／SHAを羅列せず、最大exact3の今読むlocatorを表示し、それ以上は`additional_count`と詳細anchorを残す。必須条件、blocker、handback owner、zero effectを消すtruncationは行わない。

required surfaceを12 items／16 KiBへ閉じられない場合は、

```text
BUDGET_EXCEEDED_REQUIRED_SURFACE
view_scope = PRO_FIRST_VIEW
operator_v1.status = V1_OPERATOR_CONTEXT_BLOCKED
silent truncation = 0
automatic budget expansion = 0
```

とする。blocked Contextはreasonとfull evidence pointerを持ってpublishできるが、Operator ready／V1 completeにしない。

---

## 8. Feedbackの最終仕様

### 8.1 Event-driven optional only

```text
feedback_policy = EVENT_DRIVEN_OPTIONAL
default_rows = 0
empty_feedback_is_valid = true
feedback_required_for_ready = false
feedback_required_per_task = false
Mash_manual_feedback_work = 0
```

新しいrowは、実際に選択漏れ、不要選択、選択理由不足、role output不足が観測された時だけ許す。Pro／Ultraを含むKaren-side operatorが扱い、Mashにrow、ID、path、source locator、commandの入力を依頼しない。

### 8.2 Row shape

```text
feedback_id
observed_task_instance
observed_at
author_role = PRO_KAREN | ULTRA_KAREN
target_role
target_id
trigger_code
disposition
source_locator
reason_code
related_feedback_id?
```

`trigger_code`は次のexact5だけを許す。

```text
OBSERVED_UNNEEDED_SELECTION
OBSERVED_MISSING_SELECTION
OBSERVED_SELECTION_REASON_GAP
OBSERVED_ROLE_OUTPUT_GAP
ISSUE_REVIEWED_NOT_TOOL_CAUSED
```

Step 3のdisposition exact7はcompatibilityのため保持する。`SELECTED_AND_USED`は過去gapを閉じる`related_feedback_id`がある時だけ許し、routine positive loggingに使わない。`NOT_A_TOOL_PROBLEM`は報告済みissueをKarenが調査した時だけ許す。Step 8のone-time actual-use validation resultはfeedback snapshotではなく別の実証記録が所有する。

source locatorはexisting §5.9 tagged unionを再利用する。private observationはopaque ID／retrieval ownerだけを許し、free-form private reason、summary、quote、content hashは入れない。

snapshotは0..64 rows、replace-current、Git historyが履歴である。新API／CLI／append ledger／dashboard／KPI／analytics／auto rank／auto selection／auto mutationは0である。

---

## 9. Canonical output、selection、privacy

### 9.1 Logical output exact counts

common exact5を保持する。

```text
selected_files.jsonl
closure_edges.jsonl
required_category_coverage.json
unresolved_context.jsonl
full_text_read_order.md
```

V1 exact4を追加する。

```text
operator_context.json
pro_context.md
ultra_context.md
collaboration_packets.json
```

CMEE compatibility exact2をrename／deleteせず保持する。

```text
cmee_context_overview.md
cmee_unincorporated_actual_findings.md
```

したがってCMEE logical outputはexact11、non-CMEEはexact9である。compact first-viewは`pro_context.md`内でありnew output file 0。`context_manifest.json`と`publication_transport.json`はlogical count外のowner manifestである。

### 9.2 Deterministic selection

decision surfaceのadmission priority exact7は維持する。

1. canonical freshness blocker／required unresolved。
2. required premise／ordered entry chain。
3. Mash explicit decision locator／current product-purpose／structure owner。
4. exact changed path／explicit scope／protected test。
5. verified design–actual–test endpoint。
6. existing graphからの`PROBABLE` impact。
7. declared trigger reference／reason付きexclusion。

same priorityは`required=true`、bounded graph distance、repository key、normalized path、stable IDでsortする。semantic score、file date、feedback countでrankしない。full closureはevidenceとして保持するが、initial role viewへ全展開しない。

### 9.3 Ultra and collaboration projections

Ultra Contextはexact repository／PR／branch／commit／blob、owner freshness／changed path、premise／entry chain、source／symbol／route／test／contract、scope、conflict／provenance、impact／minimal readback／STOPを投影する。implementation decision／permissionは生成しない。

collaborationはrestart packet exact1とread-only subagent packet maximum exact3だけを許す。packetにmodel、tool、execute、write target、permissionを置かない。生成はpacketの作成だけで、subagent実行を意味しない。

### 9.4 Public/private boundary

public outputはstable ID、enum、reason code、count、publication-approved public repository／ref／path／blob、verified scope、source locator、lifecycle／authority／adoption assertionとprovenance、availabilityに限定する。

private body／excerpt／quote／summary／embedding／body-derived hash／secret／token／signed URL／sensitive path／free-form private-derived reasonはprofile、logical output、manifest、receipt、transport、workflow log／summary／PR bodyへ出さない。

---

## 10. `PRO-RR-01`〜`PRO-RR-05` independent disposition

| Review item | Ultra verdict | Final reflection | Operator effect | Scope effect |
|---|---|---|---|---|
| `PRO-RR-01` compact Pro first-view | `ADOPT_WITH_TECHNICAL_CORRECTION` | §7 exact8 cards、12 items／16 KiBの独立budget、overflow block | 最初に普通の言葉で判断面を見る | `pro_context.md`内、new file／service 0 |
| `PRO-RR-02` purpose provenance | `ADOPT_WITH_TECHNICAL_CORRECTION` | V2 `purpose` reject、`task_orientation` nonauthority、purpose／conditionはsource-bound claim only | task説明を商品目的の正本と誤認しない | schema／rendererのみ、原本複製0 |
| `PRO-RR-03` materially different non-CMEE proof | `ADOPT_WITH_TECHNICAL_CORRECTION` | `piece_navigation_read_only`を`account_profile_read_only`へ置換 | docs再選択ではなくRN–API–auth–DB–contractを検証 | ephemeral exact1、route／DB／RN write 0 |
| `PRO-RR-04` feedback ritual禁止 | `ADOPT_WITH_TECHNICAL_CORRECTION` | `EVENT_DRIVEN_OPTIONAL`、empty valid、Karen-side owner | routine入力／Mash作業0 | existing snapshotのみ、API／analytics 0 |
| `PRO-RR-05` no standalone prework | `ADOPT_WITH_TECHNICAL_CORRECTION` | workflow／transaction／test／actual CMEE projectionsをone Step 7 candidate内で閉じる | technical GREENだけを成果にしない | Unit A／B／C、P0／preflightの別terminal／credit 0 |

```text
PRO_RR_01 = REFLECTED
PRO_RR_02 = REFLECTED
PRO_RR_03 = REFLECTED
PRO_RR_04 = REFLECTED
PRO_RR_05 = REFLECTED
PRO_REVIEW_REOPEN_REQUIRED = 0
```

---

## 11. Non-CMEE actual proof exact1

### 11.1 Selected task

```text
task_id = account_profile_read_only
publication_mode = EPHEMERAL_VERIFY_ONLY
task_orientation = Reconstruct the authenticated self-profile GET route across RN, API, auth, DB read, response contract, and protected tests without executing it.
```

対象は`GET /account/profile/me`のread routeである。同じpathの`PATCH`、account delete、profile create、visibility updateは別routeであり、本fixtureのwrite candidateではない。

canonical owner refはCocolon／mashos-apiの`refs/heads/main`をrunごとにread-only fresh resolveする。profileへ固定するのはallowlisted repository URLとbranch ref nameであり、head SHAはrun時にfresh resolveする。以下のcommit／blobはStep 6 auditのsource baselineであり、将来のcurrent owner identityとしてprofileへ固定しない。blob一致はsemantic freshnessを代替しない。owner refをresolveできない、またはrequired evidenceをそのexact refからread-only取得できない場合はvalid-but-blockedとする。owner refとの`OWNER_REF_AHEAD`／`DIVERGED` relationだけでは本read-only fixtureをblockしない。

### 11.2 Exact evidence shape

Cocolon source sideはPR #35 head `87896aec29a639356ca83e2310291db0e0a5d136`で次のidentityを持つ。

| Role | Path | Blob at source baseline |
|---|---|---|
| visible screen owner | `screens/AccountScreen.js` | `17c2c17c5d9f941aae9c76ebb375ee41a3a234b2` |
| RN read hook／caller | `screens/account/useAccountProfile.js` | `2db9931e645d3c230f76094ad504d10d3b6f5581` |
| visible projection | `screens/account/AccountProfileSection.js` | `294023223639d5d752226c1631e00e9fbd9b1c27` |
| RN auth／HTTP adapter | `lib/apiClient.js` | `9a7392739384407e7a2472a77b781a6d63d97ecf` |
| protected RN contract | `tests/rn-screen-contracts.test.js` | `feecf5f692a80a0d0710232f70be4dc38161abb4` |

mashos-api source sideはhead `06ce311b3ea728b06f83439d268a34bed917c01c`で次を持つ。

| Role | Path | Blob at source baseline |
|---|---|---|
| runtime route registration | `ai/services/ai_inference/app.py` | `f39d4416190564dad07e8e223ba08c811bba461e` |
| GET handler／response allowlist | `ai/services/ai_inference/api_account_lifecycle.py` | `265993a077aaa0aa32afc61dda9251e581a10bac` |
| bearer owner／`profiles` DB read | `ai/services/ai_inference/api_account_visibility.py` | `bedf335780be427380425049ef006155dbb45921` |
| public API contract registry | `ai/services/ai_inference/api_contract_registry.py` | `c33d7595f638c25ec1ecf77a1cd6755f528373f9` |
| route protected test | `ai/tests/contract/test_api_contract_registry.py` | `66404146b3de7bc5f5bf39fb7845054de65265c4` |
| auth／contract-header test | `ai/tests/contract/test_api_contract_headers.py` | `70b7e48cd7a8b70e1e7241c3400d10b6aa02fce5` |
| response snapshot test | `ai/tests/contract/test_contract_snapshots_phase6e.py` | `eb791745d2190cfc6db0674408f36274a10279f7` |
| response shape fixture | `ai/tests/contract/fixtures/account_profile_me_response_shape_v1.json` | `d1c4a53a3cd3824149db31fbf48e3d615abf6585` |

required direct sourceはCocolon exact4／mashos-api exact4のexact8、protected surfaceはCocolon exact1／mashos-api exact4のexact5である。related-only dependency／navigationはfull closureに保持し、initial viewへ無制限展開しない。

current generated route graphはCocolon `d068856e35086cd301c1eaf46b3e5cc27dc1f88c`／mashos-api `06ce311b3ea728b06f83439d268a34bed917c01c`で次を持つ。Cocolon側の上記exact4 blobはPR #35まで不変である。

```text
rn-call:5858afae74ba7accc6d2f62b
  screens/account/useAccountProfile.js GET /account/profile/me

route-edge:b818e40820a8dc19b5f963de
  MATCHED_EXACT RN_CALLS_API_ROUTE

api-route:4e36e54a7f03cb011c09f712
  api_account_lifecycle.py::get_account_profile_me

model-edge:4a7ae5408fcefbea7b08e12a
  RETURNS_RESPONSE_MODEL AccountProfileMeResponse

test-contract-edge:219aa476beada3fee3cd0370
test-contract-edge:25f4b00a2cbae175901e9816
  protected Cocolon / mashos-api tests
```

上記`test-contract-edge` exact2はcurrent graphが直接recoverしたedge例である。これと、source baselineを直接照合したprotected surface exact5は同じcountではない。graphに出ていないtestを自動coveredとせず、exact5はpath／blob証拠として表示する。

backend closureは`_require_user_id → _fetch_profile_me → _get_profile_row → Supabase public.profiles GET`を含み、overallは`RESOLVED_WITH_EXPLICIT_UNKNOWN_EDGES`である。`HTTPException`等のdynamic unresolved edgeを消さず`RELATED_NOT_WRITE_AUTHORIZED / manual review`に残す。

またroute rowの`mount_status=UNMOUNTED_ROUTER`と、`app.py` actualの`register_account_lifecycle_routes(app)`は別evidenceとして並記する。compilerはこれを都合よく`ACTIVE`へ変換せず、`MOUNT_VERIFICATION_REQUIRES_DIRECT_SOURCE / manual review`と表示する。これはcurrent System Contextがrouteとactual registrationの間で不足した箇所をOperator Contextの根拠として返すactual exampleである。

current protected testsはroute literal／registry／contract header／response shape／RN wiringを分担するが、actual Bearer verification、server-resolved self IDの`id=eq.{me}` predicate、DB exact selectからsensitive fieldが除外されることをendpoint経由で一本に固定するprotected testはcurrent searchで確認できない。

```text
ACCOUNT-PROTECTED-GAP-001 =
  AUTH_SELF_FILTER_AND_DB_FIELD_ALLOWLIST_NOT_DIRECTLY_ENDPOINT_TESTED

finding disposition = PROTECTED_REVIEW_REQUIRED
handback owner = account / public API owner
product route green claim = 0
```

無関係な`_require_user_id`のsymbol match testをこのcoverageに水増ししない。本gapを正しく表示できることはSystem Context actual-useの成功候補だが、account product routeのquality／safety PASSではない。owner／handback／protected scopeがexplicitであればread-only review Contextの整合性は成立し得るが、Product／technical creditは0である。

### 11.3 Privacy and protected scope

```text
ALLOWED = public source / graph / contract / test identity read and compile only
PROTECTED_REVIEW_REQUIRED = GET response allowlist and auth / DB boundary
RELATED_NOT_WRITE_AUTHORIZED = PATCH same path and wider account routes
FORBIDDEN_EFFECT = endpoint invocation, bearer use, user-data fetch, DB query/write, RN mutation, auth mutation, local cleanup, production effect
```

generated outputにaccess token、service-role secret、push token、email、actual user ID／display name／code、raw DB row、private response bodyを出さない。schema field name、public path／symbol／contract identityだけを扱う。

### 11.4 Acceptance exact8

1. RN GET callがexact API routeへ接続する。
2. API handler、response model、runtime registrationの別evidenceを追える。
3. self bearer resolution、`public.profiles` physical read、response allowlistを別responsibilityとして追える。
4. RN／API protected testsとresponse fixtureを追える。
5. explicit unknown edgeとmount conflictをsilent PASSにしない。
6. Pro／Ultra viewがsame operator model identityへbindする。
7. CMEE compatibility exact2／Piece premise exact4を要求せずnon-CMEE exact9である。
8. temp compile／verify後のpersistent output、receipt、transport、Git diff、API／DB／RN effectがexact0である。

proof PASSは「Contextがread routeとprotected gapを正しく返し、Operatorが原本とownerへ戻れた」を意味する。endpoint、auth、DB、RN、account productがGREENであることを意味しない。

---

## 12. Resolver、incremental update、publication transaction

### 12.1 Canonical ref resolver

resolverはworkspace profile由来allowlisted canonical GitHub URLだけを使い、次のexact3 equalityを必須にする。

```text
first_resolved_head
= fetched_namespace_head
= pre_publish_resolved_head
```

ref moved、remote unresolved、unsafe ref／URL、local filesystem originはfreshness PASSにしない。cached refはevidenceにはできるがfreshにはできない。owner-only changeはInventory／Code／Route full rerunを自動で行わずTask Contextをrecompileし、source-dependent changeはexisting reverse-dependent closureを使う。不確実な場合はfull rebuild fallbackまたはSTOPとする。

### 12.2 Dual status

```text
integrity_status = VALID | INVALID
legacy_context = existing exact7 state
operator_v1.status = V1_OPERATOR_CONTEXT_READY | V1_OPERATOR_CONTEXT_BLOCKED | V1_OPERATOR_CONTEXT_INVALID
```

canonical owner divergenceだけでは`operator_v1`を`BLOCKED`にしない。owner exact refとrequired premisesをread-only取得できる場合、`integrity_status=VALID + legacy PASS + operator_v1.status=V1_OPERATOR_CONTEXT_READY + relation=DIVERGED`を許す。`V1_OPERATOR_CONTEXT_BLOCKED`はremote unresolved、required premise missing／unreadable、またはrequested effectがowner-owned write baselineを必要とするのにtarget／baseが未固定の場合に限る。`completion_claim`はStep 8のdurable exact3、Pro／Ultra actual-use confirmation、Mash明示確認までnullである。

### 12.3 Whole-workspace transaction

candidate sibling workspaceでcompile、pack、physical set verify、logical hash verify、privacy scanを全て行い、成功後だけlive rootをatomic renameする。body-free transaction markerのphase exact4は保持する。

```text
CANDIDATE_VERIFIED
LIVE_MOVED_TO_BACKUP
CANDIDATE_PROMOTED
FINAL_VERIFIED
```

failureではlast-good live workspaceをbyte unchangedで保持／restoreする。marker／backup／candidateのidentityが一意でない場合は`PUBLICATION_RECOVERY_AMBIGUOUS`でSTOPし、推測cleanupしない。generated currentを手編集しない。

---

## 13. One bounded Step 7 implementation candidate

### 13.1 Admission prerequisites

Step 7開始前に次の全てをfresh確認する。

1. Mashが本Step 6 published exact identityを明示承認している。
2. PR #36 lineageをCocolon implementation baselineとしてexactに固定している。
3. PR #30 canonical owner headをfresh resolveし、required exact14をread-only取得できる。Step 7 branchへのmerge／rebase／integrationは0である。
4. mashos-api approved exact refがworkspaceへmaterialize済みで、approved changed-path scopeが本節のexact9とgenerated allowed rootに閉じる。
5. private body、new dependency／service／cost、product source changeが不要である。

一つでも欠ける場合はStep 7を開始しない。

### 13.2 Hand-authored exact9

| Exact path | Candidate responsibility |
|---|---|
| `.github/workflows/cocolon-system-context-inventory.yml` | current branch／PR-only writer、V2 remote matrix |
| `.github/workflows/cocolon-system-context-step5-export.yml` | historical target除去、current runのread-only dispatch／poll |
| `.github/workflows/cocolon-system-context-step5-pytest-bootstrap.yml` | source auto-repair／commit／pushをretire、read-only verification |
| `tools/cocolon_context_prepare.py` | owner resolver、dependency fingerprint、staged whole-workspace publication |
| `tools/cocolon_context_task.py` | V2 schema／shared model／role projection／privacy／verify |
| `Cocolon_前提資料/system_context/task_profiles.json` | CMEE V2 exact1／`account_profile_read_only` ephemeral exact1 |
| `tests/cocolon_context/test_prepare.py` | resolver／refresh／transaction／writer-plan tests |
| `tests/cocolon_context/test_task_context.py` | V2／projection／privacy／migration／fixture tests |
| `Cocolon_前提資料/system_context/Cocolon_SystemContext_ImplementationContract_20260818.md` | candidate contract、`V1_ACTIVATION=0` |

generated allowed rootは次のexact1だけである。

```text
Cocolon_前提資料/system_context/current/cmee_working/**
```

physical changed-path exact setはcandidate build後、first live／GitHub write前にfreezeし、manifest／remote bytesをpostverifyする。

### 13.3 Explicit no-change set

```text
Cocolon_前提資料/system_context/workspace_profiles.json
Cocolon_前提資料/system_context/00_read_first.md  # Step 9 only
tools/cocolon_context.py
tools/cocolon_context_inventory.py
tools/cocolon_context_code_index*.py
tools/cocolon_context_routes*.py
tools/cocolon_context_publish_transport.py
Cocolon_前提資料/current_structure/**
mashos-api/**
RN / API / DB / migration / production dependency / product source
```

future unique hand-authored surfaceはexact10であるが、`system_context/00_read_first.md`はStep 9 activation-onlyでありStep 7 exact9へ入れない。`ImplementationContract`はStep 7でcandidate／activation 0、Step 9でstatus flip候補となる。Step 9は別Mash判断である。

### 13.4 No standalone prework

Step 7はone branch／one Draft PR／one bounded candidateで行う。内部commit／作業順は分けてよいが、次を全て含むまでterminal、Gate、成果、technical creditは0である。

```text
workflow exact3 correction
+ whole-workspace transaction / crash recovery
+ task_profiles.v2 / compiler / privacy / projection
+ T01–T74
+ generated actual CMEE operator_context.json
+ generated actual CMEE pro_context.md
+ generated actual CMEE ultra_context.md
+ remote postverification
```

generated actual CMEE projectionsは、fresh resolved PR #30 owner ref、`DIVERGED` relation、read-only locatorを同時に表示する。PR #30のmerge／rebase／integrationを要求または実行せず、PR #36 workspaceをowner currentと偽装しない。

Unit A／B／C、P0、preflight、workflow-only、transaction-only、test-only、schema-onlyの別PR／別terminal／creditを作らない。actual CMEE Pro／Ultra Contextまで同じcandidateで到達できなければ、scopeを広げずcandidateをSTOPする。

Step 7 actual outputの生成はStep 8 Operator actual-use proof completeではない。Step 8 exact3は同candidate actualを使う別の明示phaseであり、Step 7から自動開始しない。

---

## 14. Test and verification contract

### 14.1 T01–T74 remains one matrix

Step 4 §15のT01〜T74をone test matrixとして保持する。個別test ID、workflow check、transaction checkを別Gate／approval／Receipt／creditにしない。本exact5 correctionはnew familyを追加せず、次のexisting rowsを置換／強化する。

| Test rows | Final corrected expectation |
|---|---|
| T01 | valid V2は`task_orientation`を`authority_claim=false`でload。V2 `purpose`はreject。v1 purposeはmigration display only |
| T09 | product purpose／Mash fixed conditionは必須source locator／provenance。orientationからのgeneration 0 |
| T13／T14／T17／T55 | owner ahead／divergedをrelationとして表示し、exact owner ref／required premiseがread-only取得可能ならOperator ContextはREADY。workspace-incorporation claim、merge／rebase／integration、write authorityは0。remote unresolved／required premise unavailableはBLOCKED。actual PR #36／PR #30の`DIVERGED`はStep 7 admissionをrejectしない |
| T61 | separately authorized owner-owned write taskだけを対象に、fixed write baselineからowner-owned pathが変化した場合はmanual review。PR #30をStep 7へ取り込む前提にはせず、read-only exact-ref routingをblockしない |
| T30／T31 | outer budgetに加えPro first-view 12 items／16 KiB／reason2。requiredをtruncateせずblock／additional count／detail pointer |
| T32 | same operator SHAからordered exact8 Pro cards／Ultra／collaborationをrender。role独自fact 0 |
| T38 | empty feedback PASS、`EVENT_DRIVEN_OPTIONAL`、Karen author role／observation locator必須、routine row reject |
| T43 | non-CMEE V2 exact9、CMEE compatibility exact2要求0 |
| T56 | `account_profile_read_only`をtemp verify。GET RN–API–auth–DB–contract／test、explicit unknown／mount conflict表示、persistent／runtime／DB write 0 |
| T60 | first-viewを含むprojection byte-exact rerender／AI free-form fact 0 |
| T66 | packet max3／feedback max64／duplicate／dangling／routine append reject、auto rank 0 |
| T67 | workflow exact3のhistorical branch／PR #31／auto-repair write 0、current identity以外STOP |
| T74 | machine／actual evidence PASSでもMash approved claim locatorなしは`completion_claim=null`、auto-award 0 |

その他のT02〜T74の期待値はStep 4 frozen blobのまま保持する。

### 14.2 Step 7 candidate verification

1. profile／schema／provenance／privacy unit tests。
2. same／ahead／diverged／remote unresolved／ref moved／owner-only／non-code／source／rename-delete fixtures。
3. whole-workspace crash phase exact4／ambiguous recovery／last-good byte preservation。
4. CMEE exact11／non-CMEE exact9／manifest／transport／physical set／projection SHA verify。
5. first-view exact8／two-level budget／orientation provenance／event feedback／account-profile ephemeral proof。
6. workflow exact3 wrong-branch／wrong-PR／fork／branch-moved／source-patch 0。
7. existing System Context Steps 1〜5 full regression。
8. remote generated exact bytes／allowed paths／Draft identity postverification。

machine GREENはOperator value、Product Read、Mash acceptance、V1 activationの証明ではない。

### 14.3 Step 8 actual proof exact3

Step 8は別の明示作業として次を確認する。

1. CMEE Step 11: freshly resolved PR #30 canonical owner exact ref、required premise exact7、claim provenance、protected scope、bounded Pro／Ultra view、relation `DIVERGED`／integration 0を実使用。
2. `account_profile_read_only`: 性質の異なるnon-CMEE ephemeral read-only exact1を実使用。
3. refresh actual: same-ref、canonical owner-only changed-ref、source／test change、premise rename-delete、fresh clone。

Pro／Ultraは次を人間のactual-use resultとして別々に確認する。

- 最初のContextから必要な判断面と原本へ戻れたか。
- 2,016 files／約60.3 MBを初手で直接読まなくてよかったか。
- 不要選択／選択漏れ／理由不足があれば、その時だけevent feedbackを残す。
- 原本full readを省略するsystemになっていないか。

Mashが華恋へ戻るtechnical monitoring／Context再構成負担が増えていないと明示確認するまで、`SYSTEM_CONTEXT_V1_OPERATOR_CONTEXT_ACTUAL_PROOF_COMPLETE`は承認候補にすらしない。

---

## 15. Failure、STOP、rollback、retire

### 15.1 Invalid input／integrity failure

次はoutput publish 0でcompileを失敗させる。

- unsupported schema／enum／unsafe ref／path／URL。
- duplicate ID／dangling ref／supersession cycle／invalid Git identity。
- manifest／logical hash／transport／physical set／projection rerender mismatch。
- required claim provenance／source locator不足。
- V2 `purpose`、routine feedback、forbidden private field。
- projectionがshared modelにないfactを追加。

### 15.2 Valid blocked Context

次はreason付きblocked Contextをpublishできるがready／completeにしない。

- remote unresolved、required owner content／premise missing・unreadable、owner-owned write target／base未固定。
- owner ahead／divergedで、requested effectがworkspace-incorporated owner baselineを必要とする場合。read-only routingだけならblockしない。
- required premise stale／declared exact identity unavailable／budget overflow。
- owner／lifecycle／authority conflict、endpoint／test missing。
- route mount conflict／dynamic unresolved edge／external retrieval gap。
- impact unknown／manual review required。

### 15.3 Candidate STOP

次のいずれかが必要になった時点でscopeを増やさずSTOPする。

1. existing pipeline内で閉じずnew subsystem／service／DB／daemonが必要。
2. new runtime dependency／external search／vector DB／recurring costが必要。
3. cached refをfreshに偉装、またはcanonical ownerをauto merge／rebaseする必要。
4. private body／summary／public hash ingestionが必要。
5. role viewがshared modelへ閉じず別fact baseが必要。
6. workflowをcurrent branch／PRだけへ安全にbindできない。
7. Pro first-view／Ultra surfaceがbounded policyへ閉じない。
8. workflow／transaction／testが揃ってもactual CMEE Pro／Ultra Contextまで同candidateで到達できない。
9. non-CMEE proofにroute／DB／RN executionまたはprivate user dataが必要。
10. System Context保守がCocolon本体作業を継続的に圧迫。

### 15.4 Rollback／retire

- Step 7 candidateのpre-publication failureはprevious last-good V1／legacy workspaceをbyte unchangedで保持し、commit／pushを行わない。
- remote candidate failureはDraft／unmerged／`V1_ACTIVATION=0`のまま停止し、current standard entryを切り替えない。
- Step 8でPro／Ultraの明確な負担軽減を確認できない、またはMashの負担が増える場合はV2 activationをreject／retireし、existing System Context Steps 1〜5／original direct readを維持する。
- historical evidenceはGit historyに保持するが、別Gate、successor P0、renamed preflightとして復活させない。

---

## 16. Future maintenance ceiling

V1の保守上限は次である。

```text
persistent primary task per workspace = exact1
non-CMEE proof profile = ephemeral exact1
shared operator fact model = exact1
new logical projections = exact3 from same model
Pro first-view = exact1 inside pro_context.md
subagent packets = 0..3
feedback = 0..64, event-driven optional, default 0
external service / DB / daemon / dashboard = 0
new runtime dependency / recurring cost = 0
Mash routine technical operation = 0
generated history store = 0; Git history only
```

current generated outputはreplace-current、historyはGit historyとする。taskごとのdashboard、daily feedback、大量profile、semantic score、新manifest familyを増やさない。V1後のSystem Context専用作業がCocolon本体作業より大きくなる場合は、機能追加ではなくretire／simplifyを優先する。

---

## 17. Step 6 GitHub reflection boundary

本Step 6のchanged pathはexact1だけである。

```text
Cocolon_前提資料/system_context/Cocolon_SystemContext_Step6_FinalTechnicalBody_20260821.md
```

new stacked Draft PRはPR #35 headをbaseにする。PR #34／#35の本文、branch、review submission、ready／merge stateを更新しない。新しいReceipt、decision brief、authority file、handoffを追加しない。

Step 6のexecution environmentは`WORK_ULTRA_REQUIRED`、technical design／execution／publicationとcandidateのfinal technical verdict ownerはUltra華恋である。そのpublished exact identityへのapproval decision ownerはMashである。subagent outputはread-only candidateであり、final judgment／write／publicationを行わない。

Step 6で行うverificationはMarkdown front matter、fence、diff、exact1 changed path、remote bytes／blob／head／Draft lifecycleだけである。implementation testはsource／test／profile／workflow／generated change 0のため実行しない。

---

## 18. Completion and hard STOP

```text
STEP3_REQUIREMENTS_AND_V1_BOUNDARY = APPROVED_AT_PR33_HEAD_d865277
STEP4_INITIAL_TECHNICAL_DESIGN = COMPLETE_AT_PR34_HEAD_41c41f4
STEP5_PRO_PRODUCT_OPERATOR_ROUTE_REVIEW = COMPLETE_AT_PR35_HEAD_87896ae
STEP5_REVIEW_COUNT_FOR_STEP4_STABLE_IDENTITY = 1

STEP6_ULTRA_FINAL_TECHNICAL_BODY = COMPLETE
FINAL_CANDIDATE_CLASS = NEXT_BOUNDED_WORK_CANDIDATE
ULTRA_FINAL_VERDICT = CANDIDATE_CORRECTED
PRO_RR_01_TO_05 = REFLECTED_EXACT5
INITIAL_CORE_DESIGN_RETAINED = 1
PRO_REVIEW_REOPEN_REQUIRED = 0

V1_REQUIREMENTS = SCV1_R01_TO_R09_EXACT9
V1_DEFERRED = DEF_01_TO_DEF_05_EXACT5
CURRENT_V1_EXCLUDED = EXACT12

MASH_FINAL_TECHNICAL_APPROVAL = PENDING
CANONICAL_CMEE_OWNER_REF = PR30_READ_ONLY_FRESH_RESOLUTION
PR30_MERGE_OR_INTEGRATION_REQUIRED_FOR_STEP7 = NO
PR30_WRITE_EFFECT = 0
CURRENT_IMPLEMENTATION_READY = NO
IMPLEMENTATION_PERMISSION = 0
STEP7_START_PERMISSION = 0
STEP7_IMPLEMENTATION = 0
STEP8_ACTUAL_PROOF = 0
STEP9_MANAGEMENT_ENTRY_ACTIVATION = 0

SOURCE_TEST_PROFILE_WORKFLOW_CHANGE = 0
GENERATED_OUTPUT_CHANGE = 0
RUNTIME_PRODUCT_EFFECT = 0
READY_MERGE_EFFECT = 0
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
PRIMARY_OUTCOME = BLOCKER_NARROWED
STRUCTURE_MAP_DELTA_NONE
AUTOMATIC_PROGRESSION = false
STOP_AFTER_STEP6_BEFORE_MASH_APPROVAL_AND_STEP7
```
