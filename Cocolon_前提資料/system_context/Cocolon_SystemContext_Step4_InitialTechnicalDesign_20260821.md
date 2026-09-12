---
document_id: COCOLON_SYSTEM_CONTEXT_STEP4_INITIAL_TECHNICAL_DESIGN_20260821
title: "Cocolon System Context — Enhancement Step 4 Initial Technical Design"
created_at: "2026-08-21 JST"
decision_owner: "Mash"
technical_design_owner: "Ultra華恋"
product_and_operator_route_review_owner: "Pro華恋"
execution_owner: "Ultra華恋"
document_role: "ENHANCEMENT_STEP4_INITIAL_TECHNICAL_DESIGN"
normative_status: "INITIAL_TECHNICAL_DESIGN__STEP5_PRO_REVIEW_PENDING"
scope_classification: "MASH_DECISION_AND_APPROVAL_REQUIRED_SCOPE_LEVEL_3"
primary_outcome: "BLOCKER_NARROWED"
source_plan: "USER_ATTACHMENT__Cocolon_SystemContext_EnhancementPlan_ProUltraJoint_20260821(5).md"
source_step3_pr: 33
source_step3_approved_head: "d8652770598caaee3cdb1cf88c3520a44c4412b3"
source_step3_path: "Cocolon_前提資料/system_context/Cocolon_SystemContext_Step3_EnhancementRequirements_and_V1Boundary_20260821.md"
source_step3_blob: "7dedee31ee0150e4d6081585fb16d7cff5dcd842"
source_ultra_audit_pr: 32
source_ultra_audit_head: "218cb8eedec85dd37b6277c8a79bb6da9e158fa1"
source_current_system_context_pr: 31
source_current_system_context_head: "bd3b6f9ab846f97edb2178a5623165b1927649d7"
source_current_cmee_owner_pr: 30
source_current_cmee_owner_head: "ce2b9beca61c2293ed2828a8caf964392f8eb9f4"
source_current_cmee_owner_branch: "agent/three-core-cmee-current-structure-20260815"
step3_approved_head_owner_relation: "DIVERGED__STEP3_SIDE_AHEAD185__CANONICAL_OWNER_SIDE_AHEAD1"
github_effect: "EXACT1_INITIAL_DESIGN_DOCUMENT_ON_NEW_STACKED_DRAFT_PR"
implementation_effect: 0
source_effect: 0
test_effect: 0
workflow_effect: 0
generated_output_effect: 0
runtime_effect: 0
product_effect: 0
product_credit: 0
technical_credit: 0
structure_map_delta: "STRUCTURE_MAP_DELTA_NONE"
automatic_progression: false
---

# Cocolon System Context — Enhancement Step 4 Initial Technical Design

## 0. 結論

Step 3でMashが承認したSCV1-R01〜R09は、新しい情報倉庫、authority system、service、database、daemon、dashboardを作らず、existing System Context pipelineへin-placeで統合できる。

Ultra華恋のinitial technical verdictは次である。

> **`task_profiles.v2`を一つのtask-scoped routing contractとし、existing `prepare`がcanonical task-owner refまでfresh解決し、existing Task Context compilerが一つのshared operator modelを作る。現行full evidenceは保持し、Pro／Ultra／restart／subagent向けの短いoutputは同じmodelからだけ派生する。**

変更の中心はexact2 existing Python componentである。

```text
tools/cocolon_context_prepare.py
→ workspace refに加えてcanonical task-owner refを解決
→ task dependency fingerprintとstale relationを固定
→ complete sibling workspaceでcompile / pack / verify後だけcurrent workspaceを置換

tools/cocolon_context_task.py
→ responsibility / premise / provenance / connection / scopeを検証
→ full closureを保持
→ shared operator_contextを一度だけ生成
→ role / collaboration projectionを派生
```

Inventory、Code Index、Route GraphはV1でschemaを変えない。publication transportはmanifest-drivenであるため、新しいsmall logical outputの追加だけなら変更しない。standard CLI commandも変えない。

ただし、current implementationをそのまま実装へ進められる状態ではない。設計baselineとしてfresh比較したStep 3 approved head `d8652770598caaee3cdb1cf88c3520a44c4412b3`とCMEE canonical owner PR #30 head `ce2b9beca61c2293ed2828a8caf964392f8eb9f4`はmerge base `d29042f44e882110514b74dcc6a1b3f31ec746e6`からdivergedしている。

```text
Step 3 approved baseline side unique commits = 185
CMEE canonical owner side unique commits = 1
CMEE canonical owner side unique changed paths = exact14
correct V1 freshness result = DIVERGED / STALE_RELATIVE_TO_CANONICAL_OWNER
```

したがって、future CMEE actual proofはMashが承認したintegration baseなしに`FRESH`をclaimできない。V1はこれを自動merge／rebaseせず、blocked operator Contextとして返す。

また、current executable exact3 workflowはhistorical branch `agent/cocolon-system-context-index-20260818`へのwrite／dispatchをhard-codeし、primary workflowはPR #31編集もhard-codeしている。pytest bootstrapはsourceをauto-repairして同branchへpushするwriterである。future implementation branchで誤writeしないよう、exact3すべてをcurrent event identityへ安全にbindまたはread-only化／retireする補正をimplementation exact pathへ含める。

```text
STEP3_REQUIREMENTS_AND_V1_BOUNDARY_APPROVED = 1
STEP4_START_PERMISSION = 1
STEP4_INITIAL_TECHNICAL_DESIGN_BODY = COMPLETE
INITIAL_TECHNICAL_DESIGN_FEASIBLE = YES
EXISTING_PIPELINE_EXTENSION = YES
NEW_STANDALONE_SUBSYSTEM_REQUIRED = 0
NEW_EXTERNAL_SERVICE_REQUIRED = 0
NEW_DEPENDENCY_REQUIRED = 0

CURRENT_IMPLEMENTATION_READY = NO
CURRENT_BLOCKER_1 = CANONICAL_CMEE_OWNER_REF_DIVERGED
CURRENT_BLOCKER_2 = EXECUTABLE_WORKFLOW_WRITERS_TARGET_HISTORICAL_BRANCH_AND_PR31

STEP5_PRO_PRODUCT_OPERATOR_ROUTE_REVIEW = PENDING
FINAL_TECHNICAL_BODY = 0
IMPLEMENTATION = 0
V1_ACTIVATION = 0
MANAGEMENT_ENTRY_ACTIVATION = 0
PRODUCT_EFFECT = 0
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
PRIMARY_OUTCOME = BLOCKER_NARROWED
STRUCTURE_MAP_DELTA_NONE
AUTOMATIC_PROGRESSION = false
STOP_AFTER_STEP4_BEFORE_STEP5
```

---

## 1. Authority、scope、名称の分離

### 1.1 Mash approval input

本設計のauthority inputはPR #33 exact1のapproved Step 3 documentである。Mashの2026-08-21 JST指示は、次のexact4とStep 4開始を承認した。

```text
APPROVE_PRIMARY_ROUTING_ENTRY_DIRECTION__NO_AUTOMATIC_ACTIVATION
APPROVE_DETERMINISTIC_FACT_ROUTING_ONLY
APPROVE_V1_REQUIREMENT_FAMILIES_EXACT9__DEFER_EXACT5__KEEP_EXACT12_OUT_OF_CURRENT_V1
APPROVE_ORIGINALS_REMAIN_CANONICAL_AND_DIRECTLY_READABLE
```

この承認はinitial designまでであり、implementation、source／test変更、workflow実行、generated output更新、Pro review消費、final technical approval、V1 activation、management entry migration、ready、mergeを含まない。

### 1.2 二つのStep 4／Step 5を混同しない

existing implementationには既に次の名称がある。

```text
existing System Context Step 4 = Task Context compiler
existing System Context Step 5 = standard prepare entry
```

本書の名称は次である。

```text
enhancement plan Step 4 = Ultra initial technical design
enhancement plan Step 5 = Pro exact1 Product / Operator Route Review
```

以下で単に`Task Context compiler`と書く場合はexisting implementationを指す。`Step 4`と書く場合は本design phaseを指す。

### 1.3 Zero-effect boundary

本書はdesign exact1だけである。

- source／test／profile／workflow／generated output change: 0。
- RN／API／DB／migration／public contract／dependency／deployment effect: 0。
- CMEE／EmlisAI／Piece／Analysis product output effect: 0。
- private body access／copy／summary／hash generation: 0。
- GitHub ready／merge／activation effect: 0。
- Mash manual technical operation: 0。
- product／technical credit: 0／0。

---

## 2. Fresh current architectureとobserved gap

### 2.1 Existing processing path

current standard commandは変えない。

```bash
python3 -m tools.cocolon_context prepare \
  --workspace cmee_working \
  --task cmee
```

current architectureは次である。

```text
workspace_profiles.json
→ prepare._resolve_refs / workspace_lock.json
→ Inventory files.jsonl
→ Code Index
→ Route Graph
→ task_profiles.json
→ Task Context fixed-point compiler
→ context_manifest.json + logical output exact7
→ publication_transport.json
→ prepare_summary.json / .md
→ single-writer GitHub workflow
```

| Existing owner | Current responsibility | Current strength | V1 gap |
|---|---|---|---|
| `workspace_profiles.json` | workspace repository／expected ref | Cocolon＋mashos-api exact ref | task canonical sibling ownerを持たない |
| `tools/cocolon_context_prepare.py` | same／changed ref、incremental refresh、receipt | same-ref、non-code、source closure、full fallback | canonical owner-only movementをdependencyとして見ない |
| `tools/cocolon_context_inventory.py` | all tracked path／blob／content／heuristic lifecycle | exact identityとbinary／text区別 | premise authorityはpath heuristicだけでは確定不能 |
| Code Index／Route Graph | symbol／reference／import／route／test relation | deterministic actual connection | decision、permission、semantic correctnessは持たない |
| `task_profiles.json` v1 | seed glob、current-owner glob、category exact10、actual review | task-scoped selectionとexternal exact asset | owner ref、required identity、claim provenance、role policyがない |
| `tools/cocolon_context_task.py` | fixed-point closure、exact7 output、manifest | full evidence、external commit/blob/content/symbol verification | shared operator modelとbounded role surfaceがない |
| publication transport | large logical file pack／verify | missing／reorder／tamper fail-close | manifestが宣言する新small outputは既に扱える |
| executable workflows exact3 | remote seal／fresh clone／export／bootstrap repair | existing Steps 1–5 terminal proof | historical branch write／dispatch、PR #31 edit、source auto-repair writer |

### 2.2 Current actual numbers

PR #31 terminal actualは成立している。

```text
STEP5_COCOLON_STANDARD_ENTRY_CONNECTED
COCOLON_SYSTEM_CONTEXT_STEPS1_TO_5_COMPLETE
selected files = 2,016
closure edges = 759,989
selected source bytes = 60,279,123
REFERENCE_AS_NEEDED = 1,913
blocking unresolved = 0
actual unincorporated finding = 1
```

これはexisting contractのcompletionであり、V1 operator enhancementのcompletionではない。

### 2.3 Current causal gaps

1. `SELF + expected_ancestor`はcanonical sibling PR headをfreshness denominatorにしない。
2. `CURRENT_OWNER`はpath glob／priorityで決まり、front matterの`REVIEWED_NONAUTHORITY`や`design_authority:false`を表さない。
3. category count／minimum source-like PASSは、required premise identity／entry chain exact7を保証しない。
4. `actual_review`はexternal identity verificationとoperator conclusion／Dispositionを同じobjectに持つ。
5. full closureとinitial operator surfaceが分離されていない。
6. standard `prepare`は`manual_overlay_path=None`であり、V1をmanual overlayへ置くだけではstandard entryに接続されない。
7. compilerはlive task outputへ移した後にverifyし、packはその後である。さらにchanged-ref refreshはtask compile前にlive workspace layerを更新し得るため、task directoryだけでなくworkspace全体のcoherent last-good保持をprepare側で強化する必要がある。
8. executable exact3 workflowがhistorical branchへのwrite／dispatchを持ち、primary workflowのPR edit targetがhistorical PR #31へ固定され、bootstrap workflowがsource auto-repair writerになっている。

---

## 3. Initial architecture

### 3.1 V1 component flow

```text
workspace_profiles.v1（変更なし）
→ task_profiles.v2（task-scoped operator contract）
→ prepare canonical-owner resolver
→ workspace / owner ref relation + task_dependency_fingerprint
→ existing Inventory / Code Index / Route Graph（schema変更なし）
→ enhanced existing Task Context compiler
→ operator_context.json（shared fact model exact1）
→ Pro / Ultra / collaboration thin projections
→ context_manifest.v2
→ existing publication transport
→ prepare receipt v2
→ current-PR-bound single writer
```

### 3.2 Component ownership

| Component | V1で追加する責任 | 追加しない責任 |
|---|---|---|
| `task_profiles.json` | canonical owner、premise、responsibility、claim、connection、scope、locator、role budget、feedbackのexplicit routing contract | second canonical body、automatic authority、append-only ledger |
| `prepare` | public Git remoteからdeclared owner refをread-only解決、relation／changed paths／dependency fingerprint、task-only semantic refresh、complete sibling workspace publication | merge、rebase、checkout、working-tree rewrite、remote write |
| Task Context compiler | exact blob metadata verification、conflict、required premise、shared operator model、role projection、privacy guard | semantic design judgment、Mash意図推測、Product Read |
| Inventory | existing exact file identity | front matterを新しいcanonical authorityへ昇格 |
| Code／Route graph | existing deterministic source／symbol／route／test edges | relationからwrite permissionを付与 |
| publication transport | manifest-declared logical bytesのexisting pack／verify | new storage service、history DB |
| executable workflow group exact3 | current PR branchだけへのsingle writer／read-only verifier、current PRだけのsummary | PR #31固定write、historical ref update、source auto-repair、force push、auto retry、activation |

### 3.3 One shared fact base

`operator_context.json`だけがV1 operator factsのmachine-readable shared modelである。Pro／Ultra／restart／subagentは別manifestや別owner truthを作らない。

```text
workspace and canonical refs
+ responsibility / premise / claim / connection
+ existing full evidence identity
+ bounded selection / scope / locator / feedback
= operator_context.json

operator_context.json
→ pro_context.md
→ ultra_context.md
→ collaboration_packets.json
```

role outputは独自のfactや結論を追加できない。各projectionは`operator_context_sha256`と`operator_model_fingerprint`へ戻り、`context_manifest.json`がprojection自身を含む全output SHAとfinal `context_fingerprint`をbindする。projectionへfinal fingerprintを埋め込む循環参照は作らない。

---

## 4. SCV1-R01〜R09 technical trace

| Req | Input owner | Existing integration point | New derived output | Fail-close condition | Primary test owner |
|---|---|---|---|---|---|
| SCV1-R01 canonical owner freshness | `task_profiles.v2.canonical_owner_refs` | `prepare`／Task Context input binding | relation、owner head、changed paths、freshness reason | ahead／diverged／missing／moved during runをreadyにしない | `test_prepare.py` |
| SCV1-R02 responsibility／lifecycle／authority／supersession | explicit profile＋restricted exact-blob metadata＋Inventory | Task Context compiler | responsibility records、conflicts、supersession graph | duplicate ID／cycleはinvalid、multiple current authorityはblocked unresolved | `test_task_context.py` |
| SCV1-R03 required premise／entry chain | `required_premises` | seed selection／coverage／read order | selected／fresh／read tier／missing reason | required itemのmissing／stale／unselected／not-in-read-order | `test_task_context.py` |
| SCV1-R04 claim provenance／Mash lineage | `claim_nodes`＋`connections` | external asset verifier＋exact endpoint verifier | assertion provenanceとmachine verified scopeを分離 | provenance／Mash source／required endpoint不足 | `test_task_context.py` |
| SCV1-R05 shared manifest／role context | operator model | manifest／Markdown renderer | common model＋Pro／Ultra view | projectionがcommon model外のfactを追加 | `test_task_context.py` |
| SCV1-R06 bounded selection | existing selected rows／reasons／size | selection projection | decision surface／trigger ref／excluded reason／budget | required surfaceだけでbudget超過、silent truncate | `test_task_context.py` |
| SCV1-R07 protected scope／drift／impact | explicit scope＋existing graph＋changed paths | Task Context compiler | changeability、drift facts、minimal readback | relatedをallowedへ昇格、不明をno-impact化 | `test_task_context.py` |
| SCV1-R08 external／private locator | body-free `external_locators` | existing external asset verifier＋public serializer | location／availability／privacy／canonicalityの直交軸＋retrieval owner | private body／summary／derived hash／sensitive locator output | `test_task_context.py` |
| SCV1-R09 collaboration／feedback | same operator model＋bounded profile feedback | projection renderer | restart＋read-only subagent packets＋feedback summary | execution／model selection／write authority／analytics DB化 | `test_task_context.py` |

exact9は同じcompile boundaryへ閉じる。requirementごとのservice、registry、authority file、Receipt、checkerを作らない。

---

## 5. `task_profiles.v2` data / metadata model

### 5.1 Top-level shape

existing v1 fieldsはmigration期間中に読み取り、V2 taskは一つの`operator_contract`を追加する。

```json
{
  "schema_version": "cocolon.system_context.task_profiles.v2",
  "persistent_primary_task": "cmee",
  "tasks": {
    "cmee": {
      "publication_mode": "PERSISTENT_PRIMARY",
      "purpose": "...",
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

V1はworkspaceごとに`PERSISTENT_PRIMARY`をexact1だけ許す。それ以外のprofile taskは`EPHEMERAL_VERIFY_ONLY`で、candidate temp rootにcompile／verify後に破棄し、`current/<workspace>`、prepare receipt、publication transport、Git diffへ残さない。initial CMEE workspaceのprimaryは`cmee`、§18の`piece_navigation_read_only`はephemeralである。multi-task persistent publicationはreceipt／root transportの別設計なしに有効化しない。

これはtask routing contractであり、前提資料、設計書、source、test、Mash判断の第二正本ではない。semantic assertionは必ずsource locatorとprovenanceを持つ。

### 5.2 Canonical task-owner ref

```text
owner_id
responsibility
repository_key
remote_ref
public_pr_number_or_locator
required
freshness_policy
claim_boundary
assertion_provenance
source_locator
```

CMEE initial recordは次のbranchを指す。

```text
repository_key = Cocolon
remote_ref = refs/heads/agent/three-core-cmee-current-structure-20260815
freshness_policy = OWNER_MUST_BE_ANCESTOR_OR_EQUAL_TO_WORKSPACE
```

repository identity／transport URLは`workspace_profiles.json`のsame `repository_key`からだけ導出する。task profileへ`MassyuRed/Cocolon`やremote URLを重複truthとして持たない。`public_pr_number_or_locator`はhuman-readable routing用であり、ref resolution authorityには使わない。

`resolved_head`はprofileへ固定保存せず、各runでread-only解決してmanifestへbindする。relationはexactly oneである。

```text
SAME_REF
WORKSPACE_CONTAINS_OWNER_REF
OWNER_REF_AHEAD
DIVERGED
REMOTE_UNRESOLVED
```

ready候補は`SAME_REF`と`WORKSPACE_CONTAINS_OWNER_REF`だけである。ただしowner refからworkspace material commitまでのdiffがdeclared owner-owned path／required premise／responsibility subjectを変更している場合、raw ancestryは`WORKSPACE_CONTAINS_OWNER_REF`のまま、readinessを`OWNER_OWNED_PATH_CHANGED_AFTER_INTEGRATION`としてmanual review／requiredならblockedにする。unrelated System Context-only commitとowner-owned changeを同一freshnessへしない。cached refはremote取得失敗時のevidenceにはできるが、freshness PASSには使わない。

### 5.3 Required premise

```text
premise_id
responsibility
repository_key
path
owner_id
required
entry_chain_order
read_tier
expected_identity_policy
expected_identity_locator_id
required_roles
assertion_provenance
source_locator
```

`expected_identity_policy`はV1で次の二つだけを許す。

```text
BIND_EXACT_IDENTITY_AT_RESOLVED_OWNER_REF
FIXED_PUBLIC_COMMIT_BLOB_IDENTITY
```

`BIND_EXACT_IDENTITY_AT_RESOLVED_OWNER_REF`は`owner_id`をrequired、`expected_identity_locator_id`をnullとし、resolved owner head＋record pathからexpected blobを毎run固定する。`FIXED_PUBLIC_COMMIT_BLOB_IDENTITY`は`owner_id`をnull、`expected_identity_locator_id`をrequiredとし、そのIDが§5.9のpublic Git tagged locatorへresolveしてexact repository key、40-hex commit、path、40-hex blobを持つことを要求する。両方指定／両方欠落、commit／path／blob不一致はinvalidまたはrequired blocked reasonとしてpublish 0／ready falseにする。`source_locator`はこのpremise assertionのprovenance sourceであり、検証target identityには兼用しない。

current-workspace required premiseはclosure seedへ必ず追加する。canonical sibling refにだけ存在するpremiseはcurrent Inventoryへ偽装混入せず、`OTHER_DRAFT_OR_BRANCH`としてexact ref／path／blobへroutingし、workspaceがそのownerを含まない限りoperator-readyをblockする。

今回のactual missing exact7を最初のCMEE migration fixtureにする。

1. `Cocolon_Piece/00_read_first.md`
2. `Cocolon_Piece/manifest.json`
3. `Cocolon_Piece/roadmap/Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807_CleanCutover_Revised.md`
4. `Cocolon_Piece/design_sources/Cocolon_Piece_Card_Image_Export_Redesign_DesignNote_20260707.md`
5. `Cocolon_Analysis/roadmap/Cocolon_Analysis_ProFirst_CurrentActual_ProductQualityClosure_Roadmap_20260807.md`
6. `Cocolon_Analysis/simulation/Cocolon_WatashiSimulation_RouteBranch_DesignNote_20260708.md`
7. `Cocolon_前提資料/Cocolon_EmlisAI_longterm_roadmap_CURRENT.md`

Pieceは`00_read_first → manifest → roadmap → design source`、Analysisは`roadmap → simulation design`、Emlisはcurrent structure ownerからlong-term roadmapへ入るordered chainとして宣言する。count一致だけではPASSしない。

### 5.4 Document responsibility

```text
responsibility_id
subject_locator
responsibility_kind
lifecycle
publication_state
authority_kind
effective_condition
supersedes[]
superseded_by[]
metadata_assertions[]
assertion_provenance
source_locator
```

`responsibility_kind`は次に限定する。

```text
PRODUCT_PURPOSE_OWNER
CURRENT_STRUCTURE_OWNER
DETAILED_DESIGN_OWNER
CURRENT_ACTUAL_SOURCE_OWNER
PROTECTED_TEST_OR_CONTRACT_OWNER
NAVIGATION_OWNER
HISTORICAL_PREDECESSOR
```

`authority_kind`はroleを表すfactであり、新しいapproval authorityではない。

```text
NORMATIVE_AUTHORITY
DESIGN_AUTHORITY
ACTUAL_SOURCE_AUTHORITY
TEST_CONTRACT_AUTHORITY
NAVIGATION_AUTHORITY
REVIEWED_NONAUTHORITY
NO_AUTHORITY_CLAIM
UNRESOLVED
```

同じresponsibilityへ複数のcurrent authority candidateがある場合、priorityで一つを選ばない。全candidateとsourceを`UNRESOLVED_OWNER_OR_LIFECYCLE_CONFLICT`として返し、requiredならoperator-readyをblockする。

### 5.5 Restricted metadata verification

Task Context compilerはInventory rowのexact `object_sha`からpublic tracked document blobを読む。YAML libraryは追加せず、先頭`---` blockのallowlist scalar／boolean／single-line listと、declared JSON pointerだけをstdlibで読む。

allowlistは次である。

```text
doc_id / document_id
document_role
normative_status / status
lifecycle
effective_when
publication_state
decision_owner
operational_owner
technical_owner
design_authority
implementation_authority
technical_authority
supersedes
superseded_by
automatic_progression
```

複雑なYAML、本文意味、heading近似、filename近似は推測しない。parse不能またはprofile assertionとの不一致は`UNRESOLVED_METADATA`として表示する。

Inventory heuristic、front matter verified value、manual profile assertionは別claimとして保持する。たとえばDisposition文書がpath globにより`CURRENT_OWNER`でも、front matterが`REVIEWED_NONAUTHORITY / design_authority:false`ならsilent current owner化せずconflictを出す。

### 5.6 Claim provenance

claimはassertionとmachine verification scopeを分ける。

```text
claim_id
claim_kind
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

Step 3 exact enumをそのまま使う。

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

`OPERATOR_SUPPLIED_CONCLUSION`のsource path／blobをmachine verifyしても、conclusion自体を`MACHINE_DISCOVERED`へ変えない。`MASH_EXPLICIT_DECISION`は`asserted_by=Mash`、durable source locator、decision ownerの全てがあるrowだけ許す。Mashの原文は複製しない。

adoption stateは次に限定し、authorized human assertionなしにmachine derivationしない。

```text
DECIDED_UNREFLECTED
DESIGN_REFLECTED_NOT_IMPLEMENTED
IMPLEMENTED_NOT_ACCEPTED
ACCEPTED_CURRENT
SUPERSEDED
KAREN_PROPOSAL_NOT_MASH_DECISION
UNRESOLVED
```

### 5.7 Design–actual–test connection

```text
connection_id
source_claim_id
relation_kind
target_locator
target_symbol_or_route
required
assertion_provenance
endpoint_verification
verified_scope[]
```

relationは次に限定する。

```text
CONSTRAINS_PRODUCT_PURPOSE
REFLECTED_BY_DESIGN
IMPLEMENTED_BY_ACTUAL
COVERED_BY_TEST_OR_CONTRACT
EXPOSED_BY_ROUTE
SUPERSEDES
```

compilerはInventory、symbol、route、test graphでendpointを確認し、次だけを返す。

```text
ALL_ENDPOINTS_VERIFIED
MISSING_ENDPOINT
STALE_REF
UNRESOLVED_RELATION
```

endpoint verificationは「設計どおり実装済み」「商品品質PASS」「Mashの意図を満たす」を意味しない。

### 5.8 Scope rule

```text
scope_rule_id
target_locator
target_symbol_or_route
changeability
required_approval
write_target
assertion_provenance
source_locator
```

`changeability`はStep 3 exact enumを使う。

```text
ALLOWED_WRITE_CANDIDATE
PROTECTED_REVIEW_REQUIRED
FORBIDDEN
REVIEW_ONLY_EXTERNAL
RELATED_NOT_WRITE_AUTHORIZED
UNRESOLVED
```

graphで関連しただけのnodeはdefault `RELATED_NOT_WRITE_AUTHORIZED`である。`ALLOWED_WRITE_CANDIDATE`もimplementation permissionではなく、future design candidateの表示にすぎない。

### 5.9 External / private locator

```text
locator_id
location_kind
public_locator_or_opaque_id
availability_state
privacy_state
canonicality
adoption_state
retrieval_owner
claim_boundary
public_identity_allowed
assertion_provenance
```

Step 3の場所、取得可否、privacy、canonicalityを一語へ潰さず、次の直交軸へ固定する。

```text
location_kind =
CURRENT_WORKSPACE
OTHER_DRAFT_OR_BRANCH
OTHER_WORKSPACE
GIT_HISTORY_ONLY
LIBRARY_OR_ATTACHMENT
LOCAL_ONLY
PRIVATE_LOCATOR_ONLY

availability_state =
AVAILABLE
EXISTENCE_UNVERIFIED
RETRIEVAL_GAP
ACTUAL_ABSENCE

privacy_state =
PUBLIC
PUBLIC_METADATA_ONLY
PRIVATE_LOCATOR_ONLY
SENSITIVE_OPAQUE_ID_ONLY

canonicality =
CANONICAL
CANDIDATE
NONCANONICAL
UNRESOLVED

public_identity_allowed = true | false
```

一つのassetは各軸をexact1ずつ持つ。exact commit／tree／blob／content／symbolまで検証したpublic Cycle001 source／testは`availability_state=AVAILABLE`である。たとえばprivate assetが見つからない場合も、`location_kind=PRIVATE_LOCATOR_ONLY`、`availability_state=RETRIEVAL_GAP`、`privacy_state=SENSITIVE_OPAQUE_ID_ONLY`、`canonicality=UNRESOLVED`を別々に保持する。これにより`AVAILABLE`、`EXISTENCE_UNVERIFIED`、`RETRIEVAL_GAP`、`ACTUAL_ABSENCE`を相互変換しない。

`public_identity_allowed=false`、またはactual locator自体がsensitiveなら、public profileにはopaque `locator_id`とretrieval ownerだけを置く。private body、要約、quote、content-derived hash、secret URIをprofileへ入れない。

### 5.10 Role policy and feedback

role policyはitem count、referenced source bytes、reason count、projection bytesを持つ。initial candidateは次である。

| View | max items | max referenced source bytes | max reasons / item | max projection UTF-8 bytes |
|---|---:|---:|---:|---:|
| Pro | 24 | 1.5 MiB | 8 | 96 KiB |
| Ultra | 80 | 4 MiB | 12 | 192 KiB |
| collaboration | 32 | 2 MiB | 8 | 128 KiB |

Ultra 80-item candidateは、current `CURRENT_OWNER 14`、`MUST_READ_FULL 53`、actual missing premise exact7の単純上限74をdeduplicate前でも受け、6-item headroomを持つ初期値である。これはsemanticな価値scoreでも十分性の証明でもない。Step 5 Pro reviewと§18 actual-useで実際のdeduplicate後item／byte数を確認し、required surfaceが上限を超える場合は自動増枠やtruncationをせずblockする。

required item／blockerをbudget都合で落とさない。essential setだけでbudget超過なら`BUDGET_EXCEEDED_REQUIRED_SURFACE`でblockする。reasonはdeterministic priorityで上限まで表示し、`additional_reason_count`とfull evidence pointerを必ず残す。

actual-use feedbackは`task_profiles.json`内のreplace-current bounded snapshotとする。

```text
feedback_id
observed_task_instance
observed_at
role
target_id
disposition
source_locator
reason_code
```

dispositionはStep 3 exact7だけを許す。

```text
SELECTED_AND_USED
SELECTED_BUT_NOT_NEEDED
MANUALLY_FOUND_ADDITIONAL
NEEDED_BUT_NOT_SELECTED
SELECTION_REASON_INSUFFICIENT
ROLE_OUTPUT_INSUFFICIENT
NOT_A_TOOL_PROBLEM
```

feedback snapshotはmaximum 64 rowsとし、`feedback_id`と`(observed_task_instance, role, target_id)`の重複をinvalid inputにする。更新はauthorized humanがprofileのsnapshot全体をreplace-currentするexact1 operationだけであり、append APIを設けない。feedbackはhuman-authoredであり、自動selection変更、自動rank／score、自動authority、自動profile mutationを行わない。historyはGit historyであり、append-only analytics ledgerを作らない。

### 5.11 Collaboration contract

`collaboration`はfree-form objectにせず、次のbounded schemaへ固定する。

```text
max_subagent_packets = 3

restart_packet:
  purpose_code
  next_work_source_claim_ids[]
  prohibited_scope_rule_ids[]
  environment_requirement_claim_id
  max_items

subagent_packets[]:
  packet_id
  purpose_code
  question_code
  question_text
  selected_target_ids[]
  prohibited_inference_codes[]
  prohibited_effect_codes[]
  expected_output_schema
  coverage_boundary_ids[]
  overlap_policy
  unresolved_handback_owner
```

`next_work_source_claim_ids`は`MASH_EXPLICIT_DECISION`または明示承認済みtask claimだけを参照でき、compiler推測からnext workを作らない。purpose、question、coverage、overlap、prohibited scope／effect、environment requirementはhuman-authored profile claimとsource provenanceを必要とする。packetにmodel、tool、execute、write target、permission fieldを置かない。packet count超過、unknown ID、同一coverageのunresolved overlapはinvalid inputとしてpublish 0にする。

### 5.12 Schema cardinality and restricted grammar

V2 profileは次のfinite boundをschemaで強制する。

```text
tasks: 1..32
canonical_owner_refs per task: 1..8
required_premises per task: 0..256
document_responsibilities per task: 1..512
claim_nodes per task: 0..1024
connections per task: 0..2048
scope_rules per task: 0..1024
external_locators per task: 0..256
actual_use_feedback per task: 0..64
subagent_packets per task: 0..3
```

全IDはASCII `^[A-Z][A-Z0-9_.:-]{0,127}$`、repository keyはdeclared workspace profile key、pathはstrict UTF-8／NFCのrepository-relative POSIX path maximum 1024 bytesとする。absolute path、backslash、NUL、empty segment、`.`／`..` segmentを拒否する。全IDはkind内unique、全owner／premise／claim／connection／scope／packet参照はsame task内の既知IDへexactにresolveし、dangling／cross-task implicit referenceを拒否する。locatorは`location_kind`によるtagged unionであり、public Git locatorはrepository key／exact safe ref／path／optional exact object ID、private locatorはopaque ID／retrieval ownerだけを許す。union外fieldとarbitrary pass-through fieldを拒否する。

restricted front matterはdocument先頭のexact `---`から16 KiB／256 lines以内のexact closing `---`まで、strict UTF-8、duplicate keyなし、allowlist top-level keyだけを読む。scalarはmaximum 2 KiB、single-line listはmaximum 64 items／item 512 bytesとし、nested map、multiline scalar、anchor、alias、tag、merge key、escapeで作るcontrol characterを拒否する。duplicate keyはlast-winsにせず`UNRESOLVED_METADATA`である。declared JSON pointer対象もpublic exact blob maximum 64 KiB、maximum depth 16、duplicate key rejectで読む。このparserはauthorityを決めず、verified field valueだけを返す。

---

## 6. Ref resolution、processing、fingerprint

### 6.1 Canonical ref resolver

`prepare`はversion-controlled profileにあるsafe Git refだけを扱う。repository identityは`workspace_profiles.json`から取得し、strict allowlistでexisting GitHub source URLを導出する。

1. `repository_key`、profile repository、`refs/heads/...`をstrict validateする。
2. `workspace_profiles`の`owner/name`からallowlisted GitHub URLを導出する。local fresh cloneの`origin`がfilesystem pathでも、このtransport ownerを使う。
3. `git ls-remote --exit-code <allowlisted-url> <exact-ref>`で`first_resolved_head` exact1を解決する。
4. exact refをworking treeへcheckoutせず、task専用local namespaceへread-only fetchする。
5. fetched namespace headが`first_resolved_head`とexact一致することを確認する。
6. workspace material commitと`merge-base --is-ancestor`を両方向に確認する。
7. ahead／diverged時は`git diff --name-status -M`でowner-side changed pathsを返す。
8. workspace contains owner時はowner→workspace diffを取り、owner-owned path driftを別判定する。
9. publish直前にsame URL／refを再解決し、`pre_publish_resolved_head`を得る。
10. `first_resolved_head == fetched_namespace_head == pre_publish_resolved_head`を要求する。一つでも異なれば`REMOTE_REF_MOVED_DURING_RUN`で停止する。

Git remote accessはexisting GitHub source transportのread-only利用であり、新external serviceではない。fetchはremote write、merge、rebase、checkout、reset、working-tree changeを行わない。network／permission／ref absenceはcached valueをfreshへ昇格させず`REMOTE_UNRESOLVED`にする。fresh-clone proofでもlocal `origin`の形に依存せず、same allowlisted transportからcanonical refを再現する。

`python3 -m tools.cocolon_context prepare`だけがresolved owner bundleをTask Context compilerへ渡すstandard entryである。direct `python3 -m tools.cocolon_context context ...`がV2 taskをresolved bundleなしで呼んだ場合、existing `tools/cocolon_context.py`へ新resolverやremote authorityを足さず、compiler側で`CANONICAL_OWNER_BUNDLE_REQUIRED_USE_PREPARE`としてpublish 0でfail-closeする。v1／manual-overlay diagnostic compatibilityは§11.4の非completion boundaryに限定する。

### 6.2 Task dependency fingerprint

current `context_fingerprint`とは別に、output生成前に比較できる`task_dependency_fingerprint`を追加する。

```text
workspace Step 1 / 2 / 3 manifest identities
publication transport identity
task profile document hash
resolved canonical owner refs
owner/workspace relation and owner-side changed-path digest
required premise resolved identities
role projection policy
public external/private locator metadata
actual-use feedback snapshot
```

`operator_model_fingerprint`は、同fieldを除いたcanonical shared operator payloadから計算する。`operator_context.json`はこのfingerprintを持ち、各projectionは先に確定した`operator_context_sha256`と`operator_model_fingerprint`を持つ。

final `context_fingerprint`は次をbindし、`context_manifest.json`だけが保持する。

```text
task_dependency_fingerprint
+ selected file identities
+ operator_model_fingerprint
+ canonical logical output SHA set
= context_fingerprint
```

この二層構造によりself-hash／projection-hashの循環を作らず、manifestから全projectionへ、projectionからshared modelへexactに戻れる。verify-onlyはremote owner refを再解決し、current dependency fingerprintとmanifestが異なる場合、old outputのhashが正しくてもstaleとして拒否する。

### 6.3 Processing order

V2 prepare plannerは`task_profiles.json`をglobal provider-change ownerから外し、task-input ownerとして扱う。`task_profiles.json`だけの変更は常にInventory row identityをrebindしてTask Contextをcompileするが、Code／Route providerはrerunしない。これに対して`workspace_profiles.json`、tool／schema change、またはtask profileとprovider-owning pathが混在するchange setはexisting full fallbackのままとする。

1. workspace profileとworkspace refsをexisting方法で固定する。
2. task profile v2をschema verifyする。
3. canonical task-owner refをfresh解決する。
4. relationとowner changed pathsを作る。
5. existing Inventory／Code Index／Route Graph manifest chainをverifyする。
6. required premiseをresolveし、task dependency fingerprintを確定する。
7. reuse条件が成立しなければ、v1 seedにrequired current-workspace premiseを追加する。
8. full fixed-point closureをexisting algorithmで作る。
9. public selected documentのrestricted metadataだけをexact blobから読む。
10. Inventory heuristic、metadata、profile claimを別recordにし、conflictを作る。
11. required premise、claim、decision lineage、design–actual–test endpointをverifyする。
12. explicit scopeとexisting graphからdrift／impact／minimal readback surfaceを作る。
13. full closureとbounded decision surfaceを分ける。
14. canonical payloadから`operator_model_fingerprint`を作り、`operator_context.json`を一度だけserializeする。
15. Pro／Ultra／collaboration projectionを`operator_context_sha256`へbindして作る。
16. complete sibling workspace candidate内でtask logical output、workspace／task manifest、nested／root publication transportを全verifyする。
17. prepare receiptをcandidate内へ書き、task dependency、freshness、admission、output identityをbindする。
18. all gates成功後だけ`current/<workspace>`全体をcoherent replace-currentする。

### 6.4 Impact classification

V1はsemantic driftを判定しない。impactはdeterministic factとして次に限定する。

```text
DIRECT
PROBABLE
UNCHANGED
MANUAL_REVIEW
```

- `DIRECT`: exact changed path／symbol／route、またはexplicit direct edge。
- `PROBABLE`: existing bounded route／test／reference closureで到達。
- `UNCHANGED`: compared refsでexact blob identityが同じというfile-level factだけ。
- `MANUAL_REVIEW`: relation不足、dynamic dispatch、external／private、semantic meaningを含む場合。

`UNCHANGED`をproduct no-impactへ読み替えない。不明を`NO_IMPACT`にしない。

### 6.5 Deterministic drift codes

V1がmachine derivationできるdriftは次のexact6に限定する。

| Drift code | Deterministic derivation | Evidence / provenance | Operator result |
|---|---|---|---|
| `OWNER_PATH_MISSING` | resolved owner treeにrequired owner pathがない | exact ref＋path＋tree lookup / `MACHINE_VERIFIED` | requiredならblocked、owner handback |
| `OWNER_PATH_RENAMED_OR_DELETED` | `git diff --name-status -M`がdeclared owner pathの`R*`または`D`を返す | compared exact refs＋old/new path / `MACHINE_DISCOVERED` | locator更新をhumanへ要求 |
| `EXPLICIT_RETIRED_ROUTE_STILL_ACTIVE` | lifecycle=`SUPERSEDED`／`HISTORICAL`のexplicit routeがexisting active route chainに残る | lifecycle claim ID＋Route Graph edge / lifecycle assertion provenanceと`MACHINE_VERIFIED` scopeを分離 | semantic conclusionせずmanual review |
| `DECLARED_TEST_CONTRACT_OWNER_ROUTE_MISMATCH` | declared protected test／contract owner endpointとexisting route/test closure endpointが一致しない | claim／connection ID＋symbol／route／test exact identity / `MACHINE_VERIFIED` | required connection blocked |
| `DESIGN_ONLY_CLASSIFIED_AS_RUNTIME_ACTUAL` | explicit lifecycle=`DESIGN_ONLY`とInventory／routeによるruntime actual candidateが同一subjectに併存 | responsibility claim＋Inventory／route record / sources別provenance | owner/lifecycle conflict blocked |
| `OWNER_OWNED_PATH_CHANGED_AFTER_INTEGRATION` | workspace contains owner refだがowner→workspace diffにdeclared owner-owned path、required premise、responsibility subjectの変更がある | exact refs＋changed path digest / `MACHINE_DISCOVERED` | ancestry PASSと分けてrequired manual review／blocked |

各recordは`drift_code`、subject ID、exact evidence locator、assertion provenance、verified scope、impact class、required owner handbackを持つ。file date、heading類似、本文要約、AI semantic comparisonからdrift codeを生成しない。stale commit／blobはfreshnessまたはendpoint verification reasonとして別に保持し、driftへ曖昧に重複させない。

---

## 7. Canonical output and role-specific Context

### 7.1 Output migration exact set

common base logical output exact5を保持する。

```text
selected_files.jsonl
closure_edges.jsonl
required_category_coverage.json
unresolved_context.jsonl
full_text_read_order.md
```

V1 shared／projection logical output exact4を追加する。

```text
operator_context.json
pro_context.md
ultra_context.md
collaboration_packets.json
```

CMEE taskではexisting compatibility output exact2をrename／deleteせず保持する。

```text
cmee_context_overview.md
cmee_unincorporated_actual_findings.md
```

したがってCMEE canonical logical outputはexact11、non-CMEE taskはexact9である。`context_manifest.json`と`publication_transport.json`はこのlogical output countの外にあるowner manifestである。

V2でもcommon exact5のfile名は維持するが、legacy分類の意味をV1 authorityへ昇格しない。

- `selected_files.jsonl`のexisting `read_classification`はread order／migration compatibility用に保持する。各rowへ`classification_provenance=LEGACY_PATH_RULE`、`authority_claim=false`、V2 `responsibility_ids`、`conflict_ids`、`selection_tier`を追加し、path glob由来`CURRENT_OWNER`をnormative authorityにしない。
- `required_category_coverage.json`の`all_pass`はdeclared category coverageだけを意味する。required premise identity、canonical owner freshness、responsibility conflict、operator-readyを意味しない。
- CMEE compatibility exact2の先頭とmanifest declarationへ`LEGACY_COMPATIBILITY_VIEW__NOT_OPERATOR_AUTHORITY`を固定表示する。actual findingのmachine verification、operator conclusion、Disposition／design sourceのprovenanceを別rowで表示する。
- existing exact7のlogical set、order、hash verificationは維持するが、legacy completion claimとOperator V1 completion claimを相互に昇格させない。

### 7.2 `operator_context.json`

```text
schema / workspace / task / integrity_status / legacy_context / operator_v1
task_dependency_fingerprint / operator_model_fingerprint
workspace_refs / canonical_owner_refs / freshness
responsibilities / conflicts / supersession
required_premises / entry_chains
claims / verification_scopes / decision_lineage
design_actual_test_connections
decision_surface / read tiers / budgets
scope_rules / drift / impact / minimal_readback
external_locators
actual_use_feedback
unresolved_by_owner
completion_gates
product_credit / automatic_progression
```

これは原本本文を持たない。path／ref／blob／relation／reason／claim boundaryから原本へ戻る。final `context_fingerprint`は循環を避けるためmanifestだけに置き、manifestの`output_sha256`が本fileと全projectionをbindする。

### 7.3 Pro Context

`pro_context.md`は次だけをordinary languageで投影する。

- task目的、bounded scope、freshness。
- Mashの固定条件とdecision source locator。
- product purpose／user-visible route／current product owner。
- current／Draft／historical／externalの区別。
- required originals、読む理由、claim boundary。
- product routeへ関係するverified technical finding。
- 何が変わる候補か、何の証明には使えないか。
- Ultra technical gap／Mash normative decision／external retrieval gap。
- unresolvedを誰へ戻すか。

technical hashesの羅列を初期surfaceにしない。ただし各rowからexact identityへ辿れる。

### 7.4 Ultra Context

`ultra_context.md`は次を投影する。

- exact repository／PR locator／branch／commit／blob。
- canonical owner freshnessとowner-side changed paths。
- required premise completeness／entry chain。
- source／symbol／route／test／contract connection。
- allowed candidate／protected／forbidden／review-only／related-only。
- owner conflict／duplicate／supersession／claim provenance。
- direct／probable／unchanged-file／manual-review impact。
- minimal readback surface、technical gap、STOP。

Ultra Contextもimplementation decisionやpermissionを生成しない。

### 7.5 Collaboration packets

`collaboration_packets.json`は同じoperator modelからexact2 packet kindを派生する。

#### Restart packet

```text
current refs / canonical owner refs
performed / zero effects
changed paths
verified facts
unresolved exact points
next bounded work
prohibited scope
required execution environment copied from approved task metadata
```

#### Read-only subagent packet

```text
packet_id / subtask purpose
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

packet生成はsubagent生成、model選択、execution、tool call、final adoptionを行わない。`required execution environment`はhuman-approved task metadataの表示であり、modelを自動選択しない。

### 7.6 Selection tiers

```text
DECISION_SURFACE
MUST_READ_FULL
REFERENCE_ON_TRIGGER
EXCLUDED_WITH_REASON
UNRESOLVED_IMPACT
```

full `selected_files.jsonl`／`closure_edges.jsonl`はtrace evidenceとして残る。初期role outputだけを縮約する。

actual font example `assets/fonts/SpaceMono-Regular.ttf`はfull graphから削除せず、declared decision useがない限り初期surfaceで`EXCLUDED_WITH_REASON / ASSET_WITH_NO_DECLARED_DECISION_USE`とする。これは他の1,912 `REFERENCE_AS_NEEDED` fileを不要と決める根拠にはしない。

decision surfaceへのadmissionはsemantic score、file date、feedback countを使わず、次のpriority exact7で行う。

1. canonical freshness blocker、required unresolved。
2. required premiseとordered entry chain。
3. Mash explicit decision locator、current product-purpose／structure owner。
4. exact changed pathとexplicit scope rule／protected test。
5. verified design–actual–test endpoint。
6. existing graphからの`PROBABLE` impact。
7. declared trigger referenceとreason付きexclusion。

同priority内は`required=true`、bounded graph distance、`repository_key`、normalized path、stable IDの順でsortする。Pro／Ultraは同じadmitted setからrole policyが許すfieldだけを投影し、別々のsemantic selectionを行わない。feedbackはreason付きhuman evidenceとして表示するだけで、admission／rankを自動変更しない。required setがbudgetを超えた場合、priorityの低いrequired itemをsilently落とさず`BUDGET_EXCEEDED_REQUIRED_SURFACE`でblockする。

### 7.7 Deterministic projection renderer

projection rendererはcanonical `operator_context.json`とversioned role policyだけを入力にするpure functionとする。Markdownのfactual contentはstable ID、enum、reason code、fixed template、またはoperator modelに既に含まれるpublic source textだけに限定し、rendererがAI生成文、要約、推測、新しいclaimを追加しない。verifierはsame inputから各projectionを再renderし、byte exact一致、`operator_context_sha256`、`operator_model_fingerprint`を確認する。異なればpublish 0である。

---

## 8. Premise classification、owner、supersession

### 8.1 No automatic truth precedence

V1は「front matterがprofileより常に強い」「最新日付がauthority」といったsemantic precedenceを作らない。

```text
machine exact identity verification
≠ semantic authority

Mash explicit decision locator
≠ every technical factの自動上書き

newer Git commit
≠ automatic supersession
```

同一asserted valueのevidenceはdeduplicateしてよい。不一致はsource別に残し、human ownerへrouteする。

### 8.2 Lifecycle / publication

```text
CURRENT
DRAFT
DESIGN_ONLY
IMPLEMENTED_DISABLED
ACTIVE_ACTUAL
HISTORICAL
SUPERSEDED
OTHER_WORKSPACE
PRIVATE_LOCATOR_ONLY
UNRESOLVED
```

Inventory heuristicはcandidate lifecycleであり、profile／front matterと一致しない場合は確定値にしない。

### 8.3 Supersession

supersession edgeはexplicit locator／metadata assertionだけから作る。

- endpoint path／blob存在をmachine verifyする。
- cycle／self-edge／duplicate edgeはinvalid configurationとしてpublishしない。
- sourceが存在してもsemantic supersessionの意味はhuman assertionとして表示する。
- `superseded_by`不存在をcurrent authorityへ変換しない。
- historical predecessorはfull evidenceへ残し、initial viewではtrigger付きにできる。

### 8.4 Actual conflict fixtures

最初のCMEE migrationで最低次をfixture化する。

1. NLSv3 Dispositionは重要なmigration inputだが`REVIEWED_NONAUTHORITY / design_authority:false`であり、path-glob `CURRENT_OWNER`とのconflictをsilentに隠さない。
2. `08_cycle001_current_state.md`はcurrent navigation responsibilityとhistorical subject lifecycleを別fieldで表し、file一語分類へ潰さない。
3. CMEE canonical owner Step 10 exact14とcurrent System Context `CURRENT_OWNER 14`の集合差exact1ずつをcount一致でPASSしない。
4. required premise exact7はtreeに存在してもselected／fresh／read-orderの全条件が揃わなければPASSしない。

---

## 9. Claim lineage and CMEE design–actual–test example

### 9.1 Lineage graph

```text
Mash decision source locator
→ product / intent constraint claim
→ canonical design section locator
→ actual source / symbol / route locator
→ protected test / contract locator
→ current implementation/adoption state assertion
```

各nodeとedgeは独立provenanceを持つ。machineはendpointとexisting deterministic edgeをverifyするが、Mashの意味、design adequacy、implementation correctness、acceptanceを判定しない。

### 9.2 `CMEE-ACTUAL-001` migration

current `actual_review`を少なくとも次のclaimへ分ける。

#### Machine-verifiable external facts

- Cycle001 source exact1とprotected test exact1。
- repository／workspace／commit／path／blob／content／declared symbol。
- provenance: `EXTERNAL_ASSET_VERIFIED`。
- verified scope: Git commit、tree entry、blob、content hash、symbol presence。

#### Operator conclusion

- whole recovery moduleをactive CMEE subengineとしてwrap／promoteしない。
- usable symbol-level migration sourceとprotected test vectorとして保持する。
- provenance: `OPERATOR_SUPPLIED_CONCLUSION`。
- machine verified scope: conclusion source locatorのidentityだけ。

#### Design connection

- CMEE current structure。
- `NLSv3_to_CMEE_Disposition_Phase1_20260817.md`。
- Emlis V1-A detailed design。
- implementation order／migration／verification。
- external Cycle001 source／test。

endpoint存在をverifyしても、Disposition自体をmachine discoveryへ昇格しない。`DESIGN_REFLECTED_NOT_IMPLEMENTED`はauthorized human annotationとしてだけ保持する。

---

## 10. Incremental update and stale behavior

| Change | Execution mode | Provider reuse | Operator result |
|---|---|---|---|
| workspace refs、canonical refs、dependency fingerprint不変 | `SAME_REF_REUSE` | exact current bytesを全verifyしてreuse | ready stateを維持可能 |
| canonical owner refだけ移動 | `TASK_OWNER_REF_REFRESH` | Inventory／Code／Route rerun 0、Task Context再compile | relation／changed pathsを更新。ahead／divergedならblocked |
| `task_profiles.json`だけ変更 | `INCREMENTAL_NON_CODE_REBIND` | Inventory row rebind＋Task Context。Code／Route provider rerun 0 | new profile hashへbind |
| ordinary premise document modified | existing non-code rebind | Inventory＋Task Context | premise identity／metadata／read order更新 |
| ordinary source modified | existing `INCREMENTAL_SOURCE_DEPENDENT_CLOSURE` | affected provider／reverse dependent／route closure | minimal readback更新 |
| add／delete／rename／type change | existing bounded full fallback | stale semantic reuse禁止 | required premise欠落／renameをreason付きblock |
| toolchain／workspace profile／global route owner change | existing full fallback | full provider rebuild | new schema／ownerへrebind |
| private body-free locator metadata change | task profile non-code rebind | body取得0 | availability_state／adoption metadataだけ更新 |
| canonical ref取得不能 | no fresh reuse | cached valueはevidence only | `REMOTE_UNRESOLVED`、operator-ready false |
| canonical refがrun中に再移動 | no auto retry | publish 0 | `REMOTE_REF_MOVED_DURING_RUN` |

### 10.1 Step 3 approved baseline / PR #30 expected result

V1 resolverをStep 3 approved baseline refsへ適用した正しい結果は次である。

```text
Step 3 approved baseline = d8652770598caaee3cdb1cf88c3520a44c4412b3
canonical CMEE owner = ce2b9beca61c2293ed2828a8caf964392f8eb9f4
merge base = d29042f44e882110514b74dcc6a1b3f31ec746e6
relation = DIVERGED
Step 3 baseline-side unique commits = 185
owner-side unique commits = 1
owner-side changed paths = exact14
admission = STALE_RELATIVE_TO_CANONICAL_OWNER
```

V1がこれを`FRESH`へ変換した場合はtest failureである。future implementation／CMEE actual proofは、Mash-approved integration baseが両headを含むまでSTOPする。System Context自身はintegration branchを作成、merge、rebaseしない。

本Step 4 documentをpublishするcommitは`d865277`の子になるため、published headとPR #30のahead countはremote postverificationで改めて記録する。design-only commitが増えてもrelationは`DIVERGED`のままであり、本書はself-referentialなfuture head SHA／countをcurrent factとして埋め込まない。

### 10.2 Minimal readback

changed-refでは次だけを初期readback candidateにする。

```text
changed path / symbol / route
+ required owner / premise
+ directly connected protected test / contract
+ probable graph dependent with reason
+ unresolved impact handback
```

full closureはevidenceとして保持するが、初期operator outputへ再展開しない。

---

## 11. Public / private boundary

### 11.1 Public generated output whitelist

public tracked outputへ出せるのは次だけである。

- stable IDs、enum、reason code、counts。
- publication-approved public repository／ref／path／blob identity。
- machine verification status／verified scope。
- public source locator／section locator。
- lifecycle／authority／adoption assertion codeとprovenance。
- retrieval owner、claim boundary、availability_state。
- hashes of public generated output and public source identity。

### 11.2 Forbidden fields

- private body／excerpt／quote／summary／embedding。
- private bodyまたはsummaryから導いたhash。
- secret／credential／token／signed URL。
- sensitive repository／path／Library identifier when public identity is not allowed。
- free-form private-derived reason text。
- 未採用private knowledgeのsemantic claim。

serializerはwhitelist objectからだけoutputを作り、arbitrary profile objectをpass-throughしない。test sentinelがpublic logical output、manifest、fingerprint payload、publication transportのどこにも現れないことを確認する。

public profile parserはprivate locator objectに`body`、`summary`、`excerpt`、`quote`、`content_hash`、または`public_identity_allowed=false`のsensitive locator値が存在すればschema errorとしてpublish 0にする。compiler／resolverはprivate bytesをopen、fetch、read、hashしない。task dependency／operator model／manifest fingerprintへ寄与できるのはbody-free whitelist metadataだけであり、unavailable private bodyを別byte列へ変えても全public fingerprintは不変でなければならない。

### 11.3 Availability is not existence

`availability_state`の`AVAILABLE`、`EXISTENCE_UNVERIFIED`、`RETRIEVAL_GAP`、`ACTUAL_ABSENCE`を相互排他的なexact enumとして保持する。これは§5.9の`location_kind`、`privacy_state`、`canonicality`と直交する。network／permission／privacyで取得できないものをabsenceへ変換しない。private assetの採用はMash／authorized humanだけが決める。

### 11.4 Manual overlay

current standard `prepare`はmanual overlayを使用しない。V1 contractをoverlayへ隠さず、`task_profiles.v2`へ置く。

direct `context --manual-overlay`はdiagnostic compatibilityとして残す。ただしV1 standard entry、V1 completion input、authority、canonical owner resolution、feedback mutationには使用しない。public manifestへhashが出るため、private body／private-derived dataをoverlayへ入れることを禁止する。

---

## 12. Existing output migration、publication、rollback

### 12.1 Schema migration

```text
task_profiles.v1 → task_profiles.v2
task_context_manifest.v1 → task_context_manifest.v2
prepare_receipt.v1 → prepare_receipt.v2
required_category_coverage.v1 → required_category_coverage.v1をstructure／schemaとも変更せず保持
```

V2 verifierはmigration／rollback確認のためcomplete v1 outputをverifyできる。ただしv1 manifestからV2 completion claimを出さない。v1／v2 mixed output、undeclared output、missing output、hash mismatchは拒否する。

manifest v2とprepare receipt v2は、publishable byte integrity、legacy completion、Operator V1 readinessを次の三層に分ける。

```text
integrity_status = VALID | INVALID

legacy_context:
  status = <existing legacy status value, unchanged>
  completion_claim = <existing Steps 1–5 / CMEE compatibility claim or null>
  completion_gates = <existing exact legacy gate map>

operator_v1:
  status = V1_OPERATOR_CONTEXT_READY | V1_OPERATOR_CONTEXT_BLOCKED | V1_OPERATOR_CONTEXT_INVALID
  completion_candidate_status = NOT_EVALUATED | MACHINE_GATES_PASS | ACTUAL_EVIDENCE_PRESENT_NOT_APPROVED
  completion_claim = SYSTEM_CONTEXT_V1_OPERATOR_CONTEXT_ACTUAL_PROOF_COMPLETE | null
  completion_gates = <V2 generic gate map>
  blocking_reason_codes[]
```

`integrity_status=VALID`かつ`legacy_context`がexisting PASS、同時に`operator_v1.status=V1_OPERATOR_CONTEXT_BLOCKED`である状態を正当な移行状態として許す。これは今回のcanonical-owner divergenceのexpected stateである。existing Step 5／CMEE claimはOperator V1を自動promoteせず、Operator V1のblocked／invalidもremote identityを伴うhistorical legacy claimを遡及的に無効化しない。workflow／verifier／summaryは三層を別fieldで表示し、一つの`status`へfoldしない。

compiler／workflowはmachine gatesが揃っても`completion_claim`を自動付与しない。Step 7 candidateでは常にnullである。Step 8 exact3のdurable result、Pro／Ultra双方のactual-use confirmation、Mashの「技術監視・情報再構成負担が増えていない」明示確認がsource identity付きclaimとして揃うまでは、最大でも`completion_candidate_status=ACTUAL_EVIDENCE_PRESENT_NOT_APPROVED`、`completion_claim=null`とする。Mashがそのdurable evidenceを明示承認した後だけ、human-authored profile claim `MASH_EXPLICIT_DECISION`を通じてsubsequent approved compileが`SYSTEM_CONTEXT_V1_OPERATOR_CONTEXT_ACTUAL_PROOF_COMPLETE`を表示できる。これはStep 9 activation／mergeを自動許可しない。

manifest v2のcategory gate名はtask genericにする。

```text
required_categories_recovered
required_categories_all_pass
```

CMEEでは`expected=10`を維持し、non-CMEE taskではprofileのfinite exact countを使う。current hard-coded `required_category_exact10_*`をnon-CMEE completionへ流用しない。Operator V1 statusは`operator_v1.status`だけに置き、existing CMEE Step 4 claimは`legacy_context`のcompatibility fieldとしてだけ保持する。

V2 generic completion gatesは次を持つ。

```text
canonical_owner_freshness_ready
required_premises_complete
required_categories_recovered
required_categories_all_pass
required_responsibility_conflicts_zero
claim_provenance_complete
required_connections_verified
required_protected_scope_complete
bounded_surface_ready
private_publication_guard_pass
shared_projection_binding_verified
full_evidence_preserved
generated_output_remote_hash_verified
```

`required_responsibility_conflicts_zero`はrequired responsibilityのowner／lifecycle／authority conflict exact0を要求し、reason付き表示だけではreadyにしない。`required_protected_scope_complete`はrequired targetすべてにexplicit changeabilityとapproval ownerがあり、`UNRESOLVED` exact0を要求する。current CMEE-specific gates `actual_unincorporated_finding_extracted`と`finding_used_for_cmee_review`は、CMEE taskがdeclared compatibility contractを持つ場合だけ`legacy_context.completion_gates`へ追加でrequiredにする。non-CMEE taskへCMEE finding exact1を要求しない。

CMEE existing exact7はrename／deleteしない。new exact4を追加し、manifest v2がexact11をbindする。historyはGit history、currentはreplace-currentであり、archive DBやparallel current truthを作らない。

task verifierはmanifest-declared logical output、manifest、publication transport、declared part filesのphysical setを列挙し、task directory内のそれ以外のordinary file、stale prior-schema output、undeclared partを拒否する。logical exact9／exact11だけでなくphysical file setも閉じ、rogue fileをhash対象外へ残さない。

### 12.2 Complete sibling workspace publication

future implementationではlive task directoryやlive workspace layerを直接更新しない。task-only stagingでは、先行するInventory／Code／Route refresh失敗後のcoherenceを保証できないため、publication unitは`current/<workspace>`全体とする。

prepare receipt v2は`primary_task`、primary task manifest SHA、primary task dependency fingerprint、workspace manifest set、nested primary task transport SHAをbindする。workspace verifierはdeclared primary task directory exact1を再verifyし、undeclared sibling task directoryを拒否する。ephemeral taskは別temp rootでverifyし、receiptとlive workspaceへ一切書かない。このV1制約により、current singleton `prepare_summary`を複数taskが上書きする状態や、root receiptから未bindのstale sibling taskを残す状態を作らない。

1. liveと同じfilesystemへcomplete sibling workspace candidateを作る。
2. full rebuildはcandidateへfrom-scratch buildする。incremental／owner-only refreshはverified live workspaceをcandidateへcopyし、candidateだけを更新する。
3. candidate内でInventory、Code Index、Route Graph、Task Contextの必要layerを実行する。
4. candidate内でtask logical exact setとworkspace／task publication transportをpackする。
5. candidateをlogical materializeし、workspace／task manifests、privacy、dependency fingerprint、receiptを全verifyする。
6. 全gate成功後だけlive workspaceをbounded backupへrenameし、candidateをliveへrenameする。
7. swap例外時はbackupをrestoreする。
8. promoted liveをもう一度full verifyし、failureならliveをquarantine名へrenameしてbackupをrestoreする。
9. final live verify成功後だけbackupとtransaction markerを削除する。

same filesystemのparentにbody-free transaction marker exact1を置き、`txn_id`、expected live／candidate／backup basename、pre-swap manifest SHA、candidate manifest SHA、phaseをbindする。phaseは`CANDIDATE_VERIFIED`、`LIVE_MOVED_TO_BACKUP`、`CANDIDATE_PROMOTED`、`FINAL_VERIFIED`のexact4である。rename前後にmarkerをfsyncして更新する。

次回runはwriter lock取得後、通常compileより先にexact1 markerとbounded basenameを検査する。`CANDIDATE_VERIFIED`ならliveをverifyしてcandidateをquarantine／cleanupし、`LIVE_MOVED_TO_BACKUP`ならbackupをliveへrestoreし、`CANDIDATE_PROMOTED`ならliveがcandidate SHAでfull PASSした時だけfinalizeし、failureならbackupをrestoreする。markerなしでcandidate／backupがある、複数marker／backup、identity mismatch、liveとbackupの両方がinvalidなら推測せず`PUBLICATION_RECOVERY_AMBIGUOUS`でSTOPする。compile／pack／verify failureではlive workspaceを変更しない。remote workflowは全verify成功前にcommit／pushしないため、previous remote checkpointがlast-goodである。

candidate seedでhardlinkを使うとin-place writerがlive inodeまで変更し得るため、V1 defaultは独立copyとする。copy cost／disk peakはactual testで測り、System Context専用負担がoperator benefitを上回る場合はsilent optimizationせずSTOP／retireへ戻す。

### 12.3 Rollback

- Design段階: document revertだけ。runtime／DB rollback不要。
- Future implementation: Draft branch上のimplementation commitをrevertし、v1-compatible existing toolからgenerated currentを再生成する。
- workflow failure: commit／push 0、previous remote checkpointを保持。
- owner divergence／private failure: stale outputへsilent fallbackせず、original direct GitHub readへ戻る。
- `mashos-api`、production、DB、migration、API、RNへのrollback effect: 0。

---

## 13. Workflow single-writer design

current executable workflow exact3を一つのwriter boundaryとして扱う。

```text
.github/workflows/cocolon-system-context-inventory.yml
  - TARGET_BRANCH = agent/cocolon-system-context-index-20260818
  - gh pr edit 31

.github/workflows/cocolon-system-context-step5-export.yml
  - TARGET_BRANCH = agent/cocolon-system-context-index-20260818
  - historical branchへのworkflow dispatch / poll / ref update

.github/workflows/cocolon-system-context-step5-pytest-bootstrap.yml
  - historical branch trigger / TARGET_BRANCH
  - source auto-repair commit / push
```

future behaviorは次へ固定する。

1. pull-request eventでは`TARGET_BRANCH`をcurrent event head refへbindする。
2. event head repositoryがcurrent repositoryと同一でない場合、writerを起動せずread-only verificationへSTOPする。
3. write前にremote target headがworkflow checkout headと一致することを再確認する。
4. current branchが動いていればforce／retryせずSTOPする。
5. generated commitはcurrent target branchへfast-forward pushだけを許す。
6. PR summary更新はcurrent event PR numberだけに行う。
7. workflow-dispatchではcurrent selected branchへbindし、PR numberがなければPR editを行わない。
8. `github-actions[bot]` generated commitはsecond writerを開始しないexisting guardを保持する。
9. concurrencyはcurrent branch単位を保持する。
10. export workflowはcurrent selected branchとcurrent run identityだけをdispatch／pollするread-only verifierへ変える。直接Git refを更新しない。current event identityへ安全にbindできないmanual dispatchはSTOPする。
11. pytest bootstrapのauto-repair／source commit／pushをV1 writerとしてretireする。必要なdependency install後のpytestはread-only checkとしてprimary matrixへ統合するか、同workflowをread-only verifierへ変え、source patch 0／commit 0／push 0をassertする。
12. repository内の`Cocolon_前提資料/system_context/.step5_corrected_standard_entry_workflow.yml`はhistorical non-executable copyであり、dispatch／writer sourceとして使用しない。V1 current truthは`.github/workflows/**` exact3だけから判定する。

このexact3 workflow補正はV1 implementation前のhard blockerである。Step 4 design PRではworkflowを変更・起動しない。

---

## 14. Exact changed-path candidate

### 14.1 This Step 4 reflection exact1

```text
Cocolon_前提資料/system_context/Cocolon_SystemContext_Step4_InitialTechnicalDesign_20260821.md
```

### 14.2 Future implementation hand-authored exact10

| Exact path | Phase boundary | Intended change |
|---|---|---|
| `.github/workflows/cocolon-system-context-inventory.yml` | Step 7 candidate | current branch／PR single writer、V2 remote matrix |
| `.github/workflows/cocolon-system-context-step5-export.yml` | Step 7 candidate | historical targetを除去し、current run identityだけのread-only dispatch／poll |
| `.github/workflows/cocolon-system-context-step5-pytest-bootstrap.yml` | Step 7 candidate | source auto-repair／pushをretireし、read-only verificationだけへ限定 |
| `tools/cocolon_context_prepare.py` | Step 7 candidate | canonical ref resolver、dependency fingerprint、task-only refresh、staged publication |
| `tools/cocolon_context_task.py` | Step 7 candidate | v2 contract、metadata／claim／connection／scope、exact4 output、V2 verify |
| `Cocolon_前提資料/system_context/task_profiles.json` | Step 7 Draft candidate | CMEE v2 contract＋non-CMEE ephemeral read-only exact1 task profile。merge／activation前はcurrent normative inputではない |
| `tests/cocolon_context/test_prepare.py` | Step 7 candidate | ref relation／refresh／staging／writer-plan unit tests |
| `tests/cocolon_context/test_task_context.py` | Step 7 candidate | v2 schema／output／privacy／role／migration tests |
| `Cocolon_前提資料/system_context/00_read_first.md` | Step 9 only | Mashの別approval後にだけcurrent standard entryのV2 activation／fallbackをoperator向けに更新 |
| `Cocolon_前提資料/system_context/Cocolon_SystemContext_ImplementationContract_20260818.md` | Step 7 candidate then Step 9 status flip | candidate contractと`V1_ACTIVATION=0`を先に記録し、activation stateは別approval後だけ変更 |

### 14.3 No-change candidate

```text
Cocolon_前提資料/system_context/workspace_profiles.json
tools/cocolon_context.py
tools/cocolon_context_inventory.py
tools/cocolon_context_code_index*.py
tools/cocolon_context_routes*.py
tools/cocolon_context_publish_transport.py
mashos-api/**
RN / API / DB / migration / production dependency paths
```

`workspace_profiles`はrepository transport ownerのまま、task-specific canonical ownerは`task_profiles`へ置く。CLI commandとpublication protocolは変えない。restricted metadata verificationはTask Context compilerがexisting Inventory blob identityから行うため、Inventory schemaを増やさない。

non-executable historical copy `Cocolon_前提資料/system_context/.step5_corrected_standard_entry_workflow.yml`はfuture exact10へ含めず、実行sourceにも復帰させない。

Step 7 Draft上でcandidate commandを実行できることと、repositoryのcurrent standard entryとして有効であることは別である。Step 7／8では全manifest／receiptへ`V1_ACTIVATION=0`を保持し、`00_read_first.md`のcurrent entry switch、management entry migration、ready／mergeはStep 9のMash明示判断まで行わない。

### 14.4 Generated output

approved future implementation runでは次のallowed rootだけをgeneratorが更新する。

```text
Cocolon_前提資料/system_context/current/cmee_working/**
```

physical part countはactual bytesで決まるため、design段階で架空のexact countを置かない。implementation直前にbefore physical setをfreezeし、approved fresh run後にexact changed pathsを取得し、remote postverifyする。generated fileを手編集しない。

---

## 15. Test matrix

### 15.1 Profile / metadata / provenance

| ID | Case | Expected |
|---|---|---|
| T01 | valid task_profiles.v2 | exact operator contractをload |
| T02 | duplicate ID／unsafe path／unsupported enum | compile abort、publish 0 |
| T03 | restricted scalar／boolean／single-line list front matter | exact blob valueをverify |
| T04 | malformed／complex unapproved front matter | inference 0、reason付きunresolved |
| T05 | Inventory heuristic current vs front matter nonauthority | conflict visible、silent owner 0 |
| T06 | multiple current authority candidate | reason付きblocked unresolved |
| T07 | supersession self-edge／cycle | invalid configuration、publish 0 |
| T08 | operator conclusion source identity verified | conclusion provenanceはoperatorのまま |
| T09 | Mash sourceなしの`MASH_EXPLICIT_DECISION` | reject |
| T10 | machine／manual／operator／Mash／external provenance mixed | claimごとに分離 |

### 15.2 Canonical ref / refresh

| ID | Case | Expected |
|---|---|---|
| T11 | same owner/workspace commit | `SAME_REF` ready候補 |
| T12 | workspace contains owner | `WORKSPACE_CONTAINS_OWNER_REF` ready候補 |
| T13 | owner ahead | stale blocked、auto merge 0 |
| T14 | diverged | stale blocked、両側count／changed paths |
| T15 | missing／network／permission failure | `REMOTE_UNRESOLVED`、cached fresh 0 |
| T16 | ref moves during run | publish 0、auto retry 0 |
| T17 | PR #33 / PR #30 actual relation fixture | `DIVERGED`以外をreject |
| T18 | owner-only head movement | Code／Route provider rerun 0、Task Context refresh |
| T19 | task profile only change | non-code rebind、provider rerun 0 |
| T20 | source change | existing reverse-dependent／route closure behaviorを保持 |
| T21 | required premise rename／delete | silent missing 0、blocked reason |

### 15.3 Premise / connection / scope / surface

| ID | Case | Expected |
|---|---|---|
| T22 | actual missing premise exact7 | selected／fresh／read-order全てPASS時だけcomplete |
| T23 | category count PASS but required identity missing | completion blocked |
| T24 | design／actual symbol／test endpoint valid | `ALL_ENDPOINTS_VERIFIED`、semantic PASS claim 0 |
| T25 | endpoint missing／stale | exact reasonとowner handback |
| T26 | related graph file without explicit scope | `RELATED_NOT_WRITE_AUTHORIZED` |
| T27 | internal protected exact6＋external protected exact1 | protected／review-onlyを分離 |
| T28 | 2,016-file closure | full evidence保持、initial viewへ全展開0 |
| T29 | font actual fixture | initial viewからreason付き除外、closure保持 |
| T30 | required surface budget overflow | silent truncate 0、blocked |
| T31 | reason count overflow | additional count＋full evidence pointer |

### 15.4 Role / collaboration / privacy

| ID | Case | Expected |
|---|---|---|
| T32 | Pro／Ultra／collaboration output | same operator context SHA／operator model fingerprint。manifestが各projection SHAをbind |
| T33 | projection attempts new fact | verify failure |
| T34 | role-specific conclusion auto merge | 0 |
| T35 | restart packet | refs、zero effects、next、prohibited scope |
| T36 | subagent packet | question、coverage、no write／inference、handback |
| T37 | packet generation | subagent execution／model selection／tool call 0 |
| T38 | feedback enum valid | summary only、自動selection mutation 0 |
| T39 | forbidden private body／summary／hash／sensitive locator field | profile parse reject、publish 0 |
| T40 | unavailable private asset | `RETRIEVAL_GAP`、absence化0 |

### 15.5 Migration / publication / remote

| ID | Case | Expected |
|---|---|---|
| T41 | complete v1 last-good verify | v1 verify可、V2 completion 0 |
| T42 | CMEE v2 exact11 | all declared hashes／operator model binding PASS |
| T43 | non-CMEE v2 exact9 | CMEE compat exact2なしでPASS |
| T44 | v1/v2 mixed／missing／tamper／part reorder | reject |
| T45 | workspace／task compile、pack、verify failure in candidate | live complete workspace byte unchanged |
| T46 | whole-workspace swap exception | bounded backup restore、partial live claim 0 |
| T47 | workflow pull request event | current branch／current PRだけwrite candidate |
| T48 | fork／branch moved／PR number absent | writer STOP、wrong PR edit 0 |
| T49 | same-ref／non-code／source／owner-only／fresh clone | deterministic remote PASS |
| T50 | full existing System Context regression | existing Steps 1–5 contractを弱めない |
| T51 | final generated diff | allowed rootだけ、`mashos-api` write 0 |
| T52 | terminal metadata | product credit 0、automatic progression false |

### 15.6 Closure tests for identified design risks

| ID | Case | Expected |
|---|---|---|
| T53 | fingerprint one-pass fixture | self-reference 0、same payloadからsame model／final manifest identity |
| T54 | non-code／source／full rebuild candidate failure | live workspace全byte、manifest、receipt unchanged |
| T55 | legacy exact7 PASS＋canonical owner diverged | `integrity_status=VALID`、legacy PASS、Operator V1 BLOCKEDを同時保持 |
| T56 | `piece_navigation_read_only` | non-CMEE exact9をtempでverify、CMEE exact2要求0、current／receipt／Git diff 0 |
| T57 | fresh cloneのlocal originがfilesystem path | workspace profile由来allowlisted canonical GitHub URLだけを使用 |
| T58 | resolver time-of-check／fetch／prepublish | resolved head exact3 equality。不一致はpublish 0 |
| T59 | rogue ordinary file／stale part／undeclared sibling task | physical set verify reject |
| T60 | projection re-render | operator model＋policyからbyte exact再現。AI／free-form新fact 0 |
| T61 | workspace contains ownerだがowner-owned path変更 | ancestry PASSとreadyを分離し、`OWNER_OWNED_PATH_CHANGED_AFTER_INTEGRATION` |
| T62 | public fixture sentinel scan | profile bytes、logical exact set、manifest、receipt、transport、workflow summary／PR body／log／exceptionにsentinel 0 |
| T63 | unavailable private body A→B | bodyをread／hashせずtask dependency、operator model、manifest fingerprintすべて不変 |
| T64 | deterministic drift exact6 fixtures | exact evidence／provenance／impact／handback、semantic drift claim 0 |
| T65 | selection priority／tie break | exact7 orderとstable sort、feedbackによるauto rank 0、required silent truncation 0 |
| T66 | collaboration／feedback bounds | packet max3、feedback max64、dangling／duplicate／append attempt reject |
| T67 | executable workflow exact3 | historical branch／PR #31／auto-repair write 0、current identity以外STOP |
| T68 | transaction crash at each phase／final verify failure | unique recovery、last-good restore。ambiguous orphanはfail-close |
| T69 | direct V2 `context` without resolved owner bundle | `CANONICAL_OWNER_BUNDLE_REQUIRED_USE_PREPARE`、publish 0 |
| T70 | profile cardinality／locator union／front matter limits | duplicate／dangling／oversize／invalid UTF-8／duplicate key reject |
| T71 | second persistent task requested | schema reject。ephemeral proofだけ許し、singleton receipt上書き0 |
| T72 | Cycle001 external source／test exact identity verified | `availability_state=AVAILABLE`。existence／retrieval／absence stateへの誤分類0 |
| T73 | fixed premise wrong／missing commit・path・blob、またはBIND/FIXED locator混在 | target identityとprovenance sourceを分離し、schema reject／ready false |
| T74 | machine／actual evidence PASSだがMash approved claim locatorなし | `completion_claim=null`、compiler／workflow auto-award 0 |

Machine testsだけでOperator valueを確定しない。actual-use proofは§18で別に要求する。

---

## 16. Failure、STOP、rollback boundary

### 16.1 Invalid input / integrity failure

次はoutputをpublishせずcompileを失敗させる。

- unsupported schema／enum／unsafe ref／unsafe path。
- duplicate identifier、supersession cycle、invalid Git identity。
- manifest／logical hash／transport tamper。
- required claim provenance欠落。
- private forbidden fieldをpublic profile／serializerへ渡すこと。
- projectionがshared modelにないfactを追加すること。

### 16.2 Valid blocked Context

次はactual gapを消さず、blocked manifest／operator Contextを生成できる。

- canonical owner ahead／diverged／remote unresolved。
- required premise missing／stale／other-branch-only。
- owner／lifecycle／authority conflict。
- design／actual／test endpoint missing。
- external locator unavailable。
- required decision surface budget超過。
- impact unknown／manual review required。

blocked outputは判断routingに使えるが、operator-ready／V1 complete／activation claimには使えない。

### 16.3 Design / implementation STOP

次のいずれかが必要になった時点でscopeを増やさずSTOPし、新しいactual evidenceとLevel 3判断へ戻す。

1. exact9をexisting pipeline内へ閉じられず、新subsystem／service／database／daemonが必要。
2. PyYAML、vector DB、external search、new runtime dependency、recurring costが必要。
3. canonical ownerをfresh解決できず、cached refをfreshへ偽装する必要。
4. owner／authority／supersession／Dispositionをmachineが自動決定する必要。
5. private body／summary／public hash ingestionが必要。
6. role viewを同一operator modelから作れず、別fact baseが必要。
7. required operator surfaceがbounded policyへ安全に閉じない。
8. full evidence exact7のrename／deleteが必要。
9. workflowがcurrent branch／PRだけへ安全にbindできない。
10. CMEE actual proof前にcanonical owner divergenceを自動merge／rebaseする必要。
11. source／test／workflow／generated outputをStep 4 design中に変更する必要。
12. System Context保守がCocolon本体の作業を継続的に圧迫する。

---

## 17. No new service / dependency feasibility

| Item | V1 decision |
|---|---|
| Python runtime | existing stdlib only |
| Git | existing required binaryをread-only ref resolutionにも使用 |
| GitHub | existing source remote／Actions。new serviceではない |
| YAML parser |追加しない。restricted allowlist parser only |
| Database／vector store／search service | 0 |
| Daemon／dashboard／orchestrator | 0 |
| New module／empty directory／stub | 0 |
| Recurring cost | 0 default |
| Mash manual operation | 0 default |
| `mashos-api` write | 0 |

V1のnew technical surfaceはexisting exact2 Python owner、existing exact2 tests、task profile exact1、executable workflow exact3、operator docs exact2に限定できる。external service／dependencyが必要と判明した場合、本designはfeasible verdictを撤回してSTOPする。

---

## 18. Finite V1 completion

### 18.1 Publishable integrity and Operator V1 readiness

`integrity_status=VALID`はschema、hash、privacy、projection binding、declared physical setがvalidであり、blocked evidenceを安全にpublishできることだけを意味する。`operator_v1.status=V1_OPERATOR_CONTEXT_READY`は以下のmachine correctness gateが全てPASSした場合だけ許す。required gapをreason付きで正しく表したContextはpublishableでも`V1_OPERATOR_CONTEXT_BLOCKED`である。

1. required canonical ownerのsilent stale use 0。
2. required premiseのsilent missing／unselected／not-in-read-order 0。
3. required responsibilityのowner／lifecycle／authority conflict 0、blocking unresolved 0。
4. supersession self-edge／cycle／silent authority selection 0。
5. claim provenance conflation 0。
6. required decision lineage endpoint missing 0。
7. required protected scopeの`UNRESOLVED` 0、related evidenceからwrite permission推定 0。
8. Pro／Ultra／collaboration viewがsame operator model identityへbind。
9. required initial surfaceがapproved budget内。
10. private body／summary／content-derived public hash leakage 0。
11. CMEE legacy exact7 preserved、V2 exact11 hash verified。
12. same-ref、owner-only、non-code、source、rename-delete、fresh clone deterministic PASS。
13. workflow wrong branch／wrong PR write 0。
14. undeclared ordinary／stale／part file 0、projection byte re-render exact match。
15. source／runtime／public contract／DB／product output effect 0。
16. `product_credit=0`、`automatic_progression=false`。

### 18.2 Actual proof exact3

1. **CMEE Step 11 actual-use:** Mash-approved integration baseがCMEE canonical owner headを含む状態で、fresh owner、required exact7、claim provenance、protected scope、bounded role viewをPro／Ultraが実使用する。
2. **Non-CMEE ephemeral read-only exact1:** `piece_navigation_read_only` taskをtemp candidateでcompile／verifyし、Piece `00_read_first`／manifest／roadmap／existing design sourceをbody-originalのまま辿り、role outputがCMEE-specific path collectionへ過学習していないことを確認する。`current/<workspace>`、receipt、publication transport、Git diffへのwriteは0とし、全domain bulk expansionは行わない。
3. **Refresh actual:** same-ref、canonical owner-only changed-ref、source／test change、premise rename-delete、fresh cloneをremoteで確認する。

### 18.3 Operator value gates

- Pro華恋がMash判断、product purpose、current／historical、product-route finding、decision pointを一つの短いContextで確認できる。
- Ultra華恋がrefs、premise、source／test／route、protected scope、impact、STOPを一つの短いContextで確認できる。
- actual-use feedbackで不要選択と追加発見をrecordできる。
- initial viewが2,016-file closure／約60.3 MBの直接読解を要求しない。
- originalsのactual full readを省略するsystemになっていない。
- Mashのhash／manifest／command／technical monitoring負担が増えていない。

machine gate、actual proof exact3、Pro／Ultra actual-use確認、Mashの負担非増加確認が全てdurable exact identityで成立した時だけ、Ultra華恋は次をMash承認候補として提示できる。

```text
SYSTEM_CONTEXT_V1_OPERATOR_CONTEXT_ACTUAL_PROOF_COMPLETE
```

compiler／workflowはこのclaimをawardしない。Mash明示承認前のgenerated `completion_claim`はnullのままである。これはCocolon product quality、Product Read、implementation acceptance、management entry activation、mergeを意味しない。入口activationはenhancement Step 9の別bounded workとMash明示判断を必要とする。

---

## 19. Enhancement Step 5 exact1 handoff

Step 5でPro華恋へ渡す対象は、本書のremote exact identity一つだけである。

```text
repository / Draft PR
head commit
exact path
blob SHA
```

reviewは同じstable identityへexact1とし、次を確認する。

1. Mashの目的がfile management system完成へ縮小されていないか。
2. Pro／Ultra actual burdenを減らすか。
3. System Contextが第二の正本になっていないか。
4. original full readの代替になっていないか。
5. automatic owner／write／merge／activationへ広がっていないか。
6. subagent packetがcontrol systemになっていないか。
7. Pro／Ultra budgetsとplain-language outputが実用的か。
8. `piece_navigation_read_only`がnon-CMEE actual proofとして妥当か。
9. V1 completionが有限か。
10. Mashの確認・操作負担を増やさないか。

Pro reviewはtechnical implementation、changed path、test algorithm、final go／STOPを再設計しない。Ultra華恋はStep 6でreviewをactual evidenceから反映／非反映判断し、final technical body exact1を作る。Step 5／6は本書から自動開始しない。

---

## 20. Completion / STOP

```text
STEP0_CURRENT_SYSTEM_CONTEXT_STEPS1_TO_5 = COMPLETE_AT_PR31_HEAD_bd3b6f9
STEP1_PRO_OPERATOR_NEEDS = COMPLETE
STEP1_ULTRA_OPERATOR_NEEDS = COMPLETE_AT_PR32_HEAD_218cb8e
STEP2_CMEE_ACTUAL_USE_AUDIT = COMPLETE_AT_PR32_HEAD_218cb8e
STEP3_REQUIREMENTS_AND_V1_BOUNDARY = APPROVED_AT_PR33_HEAD_d865277

ENHANCEMENT_STEP4_INITIAL_TECHNICAL_DESIGN_BODY = COMPLETE
INITIAL_ARCHITECTURE = EXISTING_PIPELINE_IN_PLACE_EXTENSION
TASK_PROFILE_TARGET = V2
SHARED_OPERATOR_MODEL = EXACT1
NEW_V1_LOGICAL_OUTPUT = EXACT4
CMEE_CANONICAL_LOGICAL_OUTPUT = EXACT11
NON_CMEE_CANONICAL_LOGICAL_OUTPUT = EXACT9
FUTURE_IMPLEMENTATION_HAND_AUTHORED_PATH_CANDIDATE = EXACT10
NEW_STANDALONE_SUBSYSTEM_REQUIRED = 0
NEW_EXTERNAL_SERVICE_REQUIRED = 0
NEW_DEPENDENCY_REQUIRED = 0

STEP3_APPROVED_BASELINE_CANONICAL_OWNER_RELATION = DIVERGED
STEP3_APPROVED_BASELINE_SIDE_UNIQUE_COMMITS = 185
STEP3_APPROVED_BASELINE_CANONICAL_OWNER_SIDE_UNIQUE_COMMITS = 1
STEP3_APPROVED_BASELINE_CANONICAL_OWNER_SIDE_CHANGED_PATHS = EXACT14
PUBLISHED_STEP4_HEAD_RELATION = REMOTE_POSTVERIFY_REQUIRED
CURRENT_IMPLEMENTATION_READY = NO
CURRENT_BLOCKER_1 = CANONICAL_CMEE_OWNER_INTEGRATION_BASE_NOT_APPROVED
CURRENT_BLOCKER_2 = EXECUTABLE_WORKFLOW_EXACT3_HISTORICAL_TARGET_OR_AUTO_REPAIR_WRITER

STEP5_PRO_PRODUCT_OPERATOR_ROUTE_REVIEW = PENDING
STEP6_FINAL_TECHNICAL_BODY = 0
IMPLEMENTATION_PERMISSION = 0
IMPLEMENTATION = 0
SOURCE_TEST_WORKFLOW_CHANGE = 0
GENERATED_OUTPUT_CHANGE = 0
V1_ACTIVATION = 0
MANAGEMENT_ENTRY_ACTIVATION = 0
READY_MERGE_EFFECT = 0
PRODUCT_EFFECT = 0
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
PRIMARY_OUTCOME = BLOCKER_NARROWED
STRUCTURE_MAP_DELTA_NONE
AUTOMATIC_PROGRESSION = false
STOP_AFTER_STEP4_BEFORE_STEP5
```
