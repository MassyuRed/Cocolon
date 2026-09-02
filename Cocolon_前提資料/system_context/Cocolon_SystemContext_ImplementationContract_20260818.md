---
doc_id: cocolon_system_context_implementation_contract_20260818
title: "Cocolon System Context — Steps 1–5, Step 7, and Step 9 V1 Management Entry Contract"
revision_date: "2026-09-02 JST"
implementation_steps: [1, 2, 3, 4, 5, 7, 9]
step7_candidate_status: "STEP7_BOUNDED_IMPLEMENTATION_COMPLETE"
step8_status: "SKIPPED_BY_MASH_DECISION"
step9_start_basis: "STEP7_BOUNDED_IMPLEMENTATION_COMPLETE + MASH_EXPLICIT_STEP8_SKIP_AND_STEP9_ACTIVATION"
step9_status: "STEP9_MANAGEMENT_ENTRY_MIGRATION_AND_V1_FREEZE_COMPLETE"
v1_activation: 0
v1_activation_semantics: "GENERATED_OPERATOR_PROOF_SELF_CLAIM_NOT_AWARDED"
management_entry_activation: 1
v1_implementation_freeze: 1
operator_proof_activation: 0
operator_actual_proof_completion_claim: null
scope: "Cocolon + mashos-api full file inventory, code index, RN/API/backend/test/domain route graph, and Cocolon V1 management entry"
product_runtime_effect: 0
api_db_rn_contract_effect: 0
product_credit: 0
technical_credit: 0
primary_outcome: "ADMINISTRATIVE_ONLY"
automatic_progression: false
---

# Cocolon System Context — Steps 1–5, Step 7, and Step 9 V1 Management Entry Contract

## 0. Purpose

Cocolon work must not start from only recent files. The system treats `MassyuRed/Cocolon` and `MassyuRed/mashos-api` as one implementation surface, while keeping production, CMEE, and Cycle001 workspaces as separate exact Git trees.

This contract establishes the technical context needed to locate every tracked file, its source-level relationships, and the complete RN-to-backend/test product route needed by Step 4. It does not claim that product quality improved, that every unresolved relation has been resolved, or that any Draft is merge-ready.

## 1. Workspace

Unit A temporary candidateのresolver relation baseは`cmee_working`のcurrent materialを使うが、tracked live Steps 1–5 Inventoryはそのmanifestがlockした既存`source_commit`を保持する。両者は別identityとして検証／表示し、overlay／incorporation／partial refreshしない。

- `Cocolon`: approved PR #36 lineageのcurrent material commit。PR #30 owner exact refとは別identityで、ancestry／incorporationを要求しない。
- `mashos-api`: `agent/cmee-v1a-i1sx-source-explicit-20260815`, exact expected head fixed by `workspace_profiles.json`.

Different Draft PRs are not overlaid into one false tree.

## 2. Step 1 — full tracked-file population

Canonical outputs under `current/cmee_working/`:

- `workspace_lock.json`
- `files.jsonl`
- `classification_summary.json`
- `unresolved.jsonl`
- `manifest.json`

Completion requires one row per Git tracked tree entry, missing path `0`, duplicate repository+path `0`, exact commit/tree/blob/content identity, and visible unresolved classification rather than omission.

## 3. Step 2 — SCIP and syntax index

Required precise providers are:

- `Cocolon` JavaScript/TypeScript: `scip-typescript`.
- `mashos-api` JavaScript/TypeScript: `scip-typescript` when candidate files exist.
- `mashos-api` Python: `scip-python`.

Required-provider failure is not converted into syntax success. Syntax parsing supplements precise SCIP and provides visible fallback or parse-error states.

Canonical outputs under `current/cmee_working/code_index/`:

- `provider_runs.json`
- `file_coverage.jsonl`
- `symbols.jsonl`
- `references.jsonl`
- `import_edges.jsonl`
- `parse_errors.jsonl`
- `unmatched_scip_documents.jsonl`
- `code_index_summary.json`
- `code_index_manifest.json`

Every inventory row must have exactly one coverage row classified as `PRECISE_SCIP`, `SYNTAX_INDEXED`, `PARSE_ERROR_VISIBLE`, `BINARY_REGISTERED`, or `INVENTORY_ONLY_WITH_REASON`. Coverage gaps and duplicate coverage are `0`.

## 4. Step 3 — RN/API/backend/test/domain route graph

### 4.1 RN/API endpoint connection

RN extraction resolves direct paths, imported route constants, nested `Object.freeze` route maps, template paths, imported path-builder functions, query suffixes, transparent wrappers, local method options, URL objects, and bounded config-array endpoints. It records each network call with its method, source file, caller symbol, path candidates, and reverse-import consumer closure.

API extraction reads FastAPI decorators, nested registration functions, `APIRouter` prefixes, `include_router` mounts, request models, and response models from the locked `mashos-api` source tree.

Each detected RN call is either connected or retained with an explicit unresolved reason. Each API route has an explicit consumer classification. Exact and template matches remain distinct.

### 4.2 Backend owner closure — C-1

For each FastAPI route, Python AST and Step 2 import edges trace the bounded call chain:

```text
route handler
→ called function / method
→ application service
→ domain service / engine
→ repository / store / worker
→ DB table / external boundary / terminal owner
```

Cycles close by visited node identity and traversal depth is bounded. Dynamic dispatch, parse failure, or missing owner is never silently cut; the route receives `UNKNOWN_OWNER` and an explicit reason in `unresolved_backend_owners.jsonl`.

Each backend node retains repository, source commit, path, symbol, line, node role, domain, lifecycle, edge source, and resolution status. Node roles include `ROUTE_HANDLER`, `REQUEST_MODEL`, `RESPONSE_MODEL`, `APPLICATION_SERVICE`, `DOMAIN_SERVICE`, `ENGINE`, `STORE_OR_REPOSITORY`, `WORKER`, `SCHEMA_OR_CONTRACT`, `DB_TABLE_REFERENCE`, `EXTERNAL_BOUNDARY`, and `UNKNOWN_OWNER`.

### 4.3 Existing protected test / ordinary test / contract connection — C-2

Existing route-chain coverage is derived from reverse imports, endpoint literals, handler/service/engine/store symbol references, protected-test path metadata, and contract/schema references.

Every API route has one or more existing `PROTECTED_TEST`, `ORDINARY_TEST`, or `CONTRACT` edges, or an explicit `NO_TEST_OR_CONTRACT_WITH_REASON` row. This checkpoint discovers current protection; it does not create product tests in `mashos-api`.

### 4.4 RN visible consumer closure — C-3

The existing reverse-import closure is adjudicated through hook/context/state owners to screens, navigators, and visible components. Every RN call is classified as exactly one of:

- `VISIBLE_SCREEN_CONSUMER`
- `BACKGROUND_OR_CONTEXT_CONSUMER`
- `NO_VISIBLE_CONSUMER_WITH_REASON`

The route does not stop silently at an API adapter.

### 4.5 File domain assignment — C-4

Every inventory file receives one or more tags from the bounded domain set, or explicit `UNRESOLVED_DOMAIN`:

- `EmlisAI`
- `Piece`
- `Analysis`
- `CMEE`
- `shared`
- `account`
- `subscription`
- `notification`
- `history`

Step 1 fields, current structure owners, path, symbol, endpoint, and lifecycle are evidence. Multiple tags are allowed. Unresolved files are not silently classified as `shared`.

### 4.6 Canonical outputs — C-5

Canonical outputs under `current/cmee_working/route_graph/` are:

- `rn_calls.jsonl`
- `api_routes.jsonl`
- `cross_repository_route_edges.jsonl`
- `api_model_edges.jsonl`
- `backend_call_edges.jsonl`
- `route_owner_closures.jsonl`
- `test_contract_edges.jsonl`
- `file_domain_assignments.jsonl`
- `unresolved_rn_calls.jsonl`
- `unresolved_api_consumers.jsonl`
- `unresolved_backend_owners.jsonl`
- `unresolved_test_contracts.jsonl`
- `route_extraction_errors.jsonl`
- `route_graph_summary.json`
- `route_graph_manifest.json`

The v2 manifest binds all canonical outputs to the same Step 1 inventory SHA-256 and Step 2 manifest SHA-256.

### 4.7 Completion — C-6

Step 3 completes only when actual output establishes all of the following:

- all RN calls are connected or explicitly unresolved with reason;
- all API routes have an allowed consumer classification or explicit unresolved reason;
- all RN-connected routes have backend closure or explicit unresolved backend-owner reason;
- all route chains have an existing test/contract edge or `NO_TEST_OR_CONTRACT_WITH_REASON`;
- all RN calls have visible/background/no-visible consumer classification;
- all chain-node files have domain tags or `UNRESOLVED_DOMAIN`;
- all IDs are unique and all output hashes verify;
- `silent_unresolved_count = 0`.

The only full Step 3 completion claim is:

```text
STEP3_RN_API_BACKEND_TEST_ROUTE_GRAPH_CONNECTED
```

The former endpoint-only claim `STEP3_RN_API_CROSS_REPOSITORY_ROUTE_GRAPH_CONNECTED` is an internal predecessor validated before C extension; it is not the final Step 3 claim.

## 5. Operation

The implementation uses these CLIs:

```text
python3 tools/cocolon_context_inventory.py build|verify ...
python3 tools/cocolon_context_code_index.py run-scip|build|verify ...
python3 tools/cocolon_context_routes.py build|verify ...
```

Steps 1–5で使用したunbounded／historical writer workflowは履歴である。Step 7 terminalのworkflow exact3は、current same-repository Draft PR headへbindするprimary bounded publisher、current selected refからそのstandard workflowだけを起動するread-only dispatcher、exact Draft headのread-only pytest verifierへ役割を分離する。publisherがwriteできるのはwhole-workspace transactionで検証済みの`Cocolon_前提資料/system_context/current/cmee_working/**`だけであり、source／profile／test／workflowの自動修正、force、retry、historical ref write、PR Ready化、mergeは行わない。default branchへ未配置の`workflow_dispatch`はsource／static policyだけを検証し、実行成功を主張しない。現Draftのremote verification正本は`pull_request.synchronize`である。

## 6. Boundaries

This implementation does not change RN production behavior, API production behavior, public route contracts, DB, migrations, product dependencies, CMEE output, EmlisAI output, Piece, Analysis, merge state, or release state.

No `mashos-api` write is authorized. Unresolved rows are context evidence, not defects silently reclassified as success. PR-body ready conversion、merge、V1 activation、Step 8 actual-use proofは本candidateの自動処理対象ではない。

`STRUCTURE_MAP_DELTA_NONE`: System Context metadata closure only; product flow, runtime owner, public API, DB, RN behavior, and core boundaries are unchanged.

`product_credit=0`  
`automatic_progression=false`

## 7. Step 7 bounded candidate — Unit A internal checkpoint

### 7.1 Authority and branch boundary

- approved implementation baseline: PR #36 head `5a35c4c3f139c59b028b6a417d2111015a578e87`.
- canonical owner input: PR #30 branch `refs/heads/agent/three-core-cmee-current-structure-20260815`, runごとに`READ_ONLY_EXACT_REF`でfresh resolveする。
- PR #30 relation `DIVERGED`はvisible actualであり、それ単独ではblockerにしない。
- PR #30 merge／rebase／integration／write、`mashos-api` write、product source writeはexact0である。
- Unit Aはone Step 7 branch／one Draft PR candidate内のinternal checkpointであり、別terminal、Gate、completion、technical creditではない。

### 7.2 Unit A owned behavior

`task_profiles.v2`はlegacy selection／category／actual reviewを保持したまま、`purpose`を禁止し、non-authoritativeな`task_orientation`へ移行する。persistent primary taskは`cmee` exact1である。Unit Aの`operator_contract`は次のexact3だけを所有する。

```text
canonical_owner_refs
required_premises
document_responsibilities
```

canonical owner exact1はworkspace profileのallowlisted `MassyuRed/Cocolon` identityからだけGitHub URLを導出し、profileへremote URL／resolved head／blobを固定しない。resolverは次を満たす。

```text
first_resolved_head
= fetched_namespace_head
= pre_publish_resolved_head
```

fetchはtask専用ref namespaceへのread-only fetchだけで、checkout／merge／rebase／reset／remote ref updateは行わない。ref movementはretryせずSTOPする。relationは`SAME_REF / WORKSPACE_CONTAINS_OWNER_REF / OWNER_REF_AHEAD / DIVERGED / REMOTE_UNRESOLVED`のexact1である。

required premiseはPR #30 owner exact ref上のexact7をordered chainでblobへbindする。`BIND_EXACT_IDENTITY_AT_RESOLVED_OWNER_REF`では`owner_id`をrequired、`expected_identity_locator_id=null`とし、provenance locatorをverification targetへ兼用しない。premise missing／rename／unreadableはcached Inventoryへ偽装せずblocked reasonを返す。

document responsibilityはPR #30 owner-side exact14、premise追加exact6、NLSv3 Disposition exact1のexact21である。product purpose、structure、design、navigation、historical predecessorを一語へ統合しない。supersession edgeはexplicit profile／metadataだけを許し、現profileでは推測edge exact0である。

restricted front matterは先頭delimiter、16 KiB／256 lines、scalar 2 KiB、single-line list 64 items／item 512 bytesでparseする。duplicate key、nested／multiline YAML、anchor／alias／tag／merge、control character、invalid UTF-8をunresolved metadataとして可視化する。document body、summary、quote、embedding、body-derived hash、secret、token、signed URLはmodelへ入れない。

declared JSON metadataは64 KiB、depth 16に閉じ、strict UTF-8／duplicate-key／non-finite number reject後にRFC 6901-compatibleな`JSON_POINTER`を解決する。modelへはdeclared pointer、`MATCH / MISMATCH / UNRESOLVED`、fixed reason codeだけを返し、undeclared valueやmismatch actual valueは返さない。profileはunknown fieldをrejectし、task 1..32、owner 1..8、premise 0..256、responsibility 1..512、metadata assertion 0..64をboundedにする。CMEE persistent primaryはUnit Aでexact1／exact7／exact21を強制する。

resolver bundleはcompiler入力時にfingerprintだけで信頼しない。workspace／task／phase／zero-effect boundary、declaration set、local owner namespace、actual Git relation／merge-base／changed paths、premise／responsibility subjectのcommit–path–blob identityを再検証する。owner-ref blobとworkspace Inventory blobは別identityとし、一致しないpremiseはworkspace rowへ種付けせず`OWNER_REF_ROUTING_ONLY`とする。

resolver bundleのowner rowはcurrent checkoutのgenerated-only tailを除いた`workspace_material_commit`を明示し、actual relation／structured diffと同じbundle fingerprintへbindする。legacy `workspace_exact_refs` / Inventory `source_commit`はStep 1–3 manifest snapshotの別identityとし、Unit Aで両者を暗黙に同一視したりlive rootをpartial refreshしたりしない。compilerはそれぞれのidentityを別々に検証し、model上でも分離して表示する。

temporary candidate manifestの`unit_a_premise_management`はcountだけでなく、`publication_mode`、public owner、ordered premise、responsibility、conflict、inventory binding、blockerのfull deterministic modelを含む。そのmodel SHAに加え、canonical `workspace_exact_refs`とUnit A completion-gate projectionもcontext fingerprintにbindする。verifierはprofileから渡されたtrusted `expected_unit_a`／`expected_task`／`expected_publication_mode`を使い、Unit A markerの全削除またはtask renameによるlegacy／ephemeral downgrade、internal row、zero-effect boundary、gateの改変をrejectする。CMEE persistent primaryのexact1／exact7／exact21は`publication_mode=PERSISTENT_PRIMARY`のときだけ強制し、ephemeral taskはbounded schema cardinalityを保持する。

verifierはowner relationを`workspace_material_commit`／owner exact head／merge-baseから再導出し、`DIVERGED`を表示したままincorporation claimへ変換しない。また、required-premise readiness、blocking conflict、responsibility supersession reciprocity、authority enum、derived role fact、selected-row↔identity bindingを再導出し、public model全stringをsecret／email／signed-URL patternでfail closed scanする。

selection rowはlegacy full closureを保持したまま、`classification_provenance`、`authority_claim=false`、`responsibility_ids`、`conflict_ids`、`selection_tier`、non-proof boundaryを持つ。NLSv3 Dispositionのlegacy `CURRENT_OWNER`とverified `REVIEWED_NONAUTHORITY / design_authority=false`、およびowner changed-path exact14とlegacy CURRENT_OWNER exact14の集合差をsilent count PASSにせず表示する。

### 7.3 Workflow and activation boundary

workflow exact3は`pull_request`の`opened / reopened / synchronize`だけを受け、`contents: read`／`pull-requests: read`だけを持つ。same-repository event、open Draft、unmerged、event head ref／SHAをcheckout前後にGitHub APIで照合し、credentialをpersistしない。historical branch、hard-coded PR、dispatch／poll、source repair、`git add / commit / push`、PR editはexact0である。

Unit A時点ではV2 exact11をlive rootへpartial publishしない。public `prepare` entryはprofileをstrict loadした後、ref resolve、fetch、live delete／writeより前に`UNIT_A_LIVE_PUBLICATION_DISABLED_USE_TEMPORARY_CANDIDATE`でSTOPする。source／testsはtemporary candidate actualで検証し、tracked `current/cmee_working/**`はbyte unchangedとする。後続Unit B／Cは同じStep 7 Draft candidateへ積むが、自動開始しない。

```text
V1_ACTIVATION = 0
completion_claim = null
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
AUTOMATIC_PROGRESSION = false
STRUCTURE_MAP_DELTA_NONE
```

## 8. Step 7 bounded candidate — Unit B Work Context Intelligence

### 8.1 Incremental contract and Unit C boundary

Unit BはUnit A exact3を保持し、同じ`task_profiles.v2`／同じDraft PR candidateへ次のexact4だけを追加する。

```text
claim_nodes
connections
scope_rules
role_views
```

Unit B時点の`operator_contract`はexact7である。`external_locators`、`collaboration`、`actual_use_feedback`、non-CMEE ephemeral profileはUnit C所有であり、本checkpointではschema、output、activationを開始しない。Unit A exact3 fixtureはfoundation回帰用にverify-only compilerが引き続き受理するが、repositoryのpersistent `cmee` profileはUnit B exact7を使用する。

Unit Bのtemporary logical outputはlegacy exact7へ次のexact3を追加したexact10である。

```text
operator_context.json
pro_context.md
ultra_context.md
```

`collaboration_packets.json`を含むterminal exact11はUnit Cまで未成立である。したがってexact10はtracked `current/cmee_working/**`へpublishせず、candidate temp rootでcompile／verify後に破棄する。public `prepare`のlive-publication guardとworkflow exact3のread-only境界は変更しない。

### 8.2 Claim, connection, scope, impact, and drift

CMEE persistent Unit Bはsource-bound claim kind exact5をrequiredにする。

```text
PRODUCT_PURPOSE
MASH_FIXED_CONDITION
PRODUCT_ROUTE
CURRENT_PRODUCT_OWNER
ZERO_EFFECT_BOUNDARY
```

claim rowはassertion provenance exact8とadoption state exact7を分離する。全`MASH_EXPLICIT_DECISION` rowは`asserted_by=Mash`、`decision_owner=Mash`、durable public ref locatorを要求し、`MASH_FIXED_CONDITION`は当該provenanceを必須とする。profileは`DECLARED_SOURCE_LOCATOR`とdeclarative scopeだけを記述し、compilerがowner-ref exact responsibility identity、selected workspace Inventory identity、またはdurable public ref declarationへ分離して再導出する。owner-ref claimを同pathのworkspace blobでverifiedへ昇格せず、ownerなしdurable remote refもselected workspace blobでverifiedへ昇格しない。remote refを持たないrequired source unresolvedはreason付きblockとする。owner-scoped connection endpointはUnit Aのexact owner head／responsibility commit／blobへbindし、同pathのworkspace blobで代用しない。required claim sourceとrequired connection targetはUnit B seedとしてfull selected closureへ明示的に含める。原文、summary、quote、body-derived hashをmodelへ複製しない。machine verificationはpublic locator／file／blobのverified scopeだけで、claim意味、受容、商品品質を生成しない。named symbol／routeはUnit B exact10内にstandalone verifierがreplayできるmembership proofを保持しないため、本checkpointでは`UNRESOLVED_RELATION`にfail closedし、compile時のin-memory index lookupだけで`ALL_ENDPOINTS_VERIFIED`へ昇格しない。

connection relationは次のexact6、endpoint resultは次のexact4である。

```text
CONSTRAINS_PRODUCT_PURPOSE
REFLECTED_BY_DESIGN
IMPLEMENTED_BY_ACTUAL
COVERED_BY_TEST_OR_CONTRACT
EXPOSED_BY_ROUTE
SUPERSEDES

ALL_ENDPOINTS_VERIFIED
MISSING_ENDPOINT
STALE_REF
UNRESOLVED_RELATION
```

endpoint存在はdesign adequacy、Mash意図充足、product PASSを意味せず、各rowは`semantic_claim=false / product_quality_credit=0`を保持する。required test／contract endpoint missingまたはrelation unresolvedはexact reasonとowner handbackを持つblocked Contextとして可視化する。

scopeは`ALLOWED_WRITE_CANDIDATE / PROTECTED_REVIEW_REQUIRED / FORBIDDEN / REVIEW_ONLY_EXTERNAL / RELATED_NOT_WRITE_AUTHORIZED / UNRESOLVED`のexact6である。explicit scopeがないconnected targetにはdeterministic `RELATED_NOT_WRITE_AUTHORIZED`を生成し、`permission_claim=false`を固定する。`ALLOWED_WRITE_CANDIDATE`もpermissionではない。

impactは`DIRECT / PROBABLE / UNCHANGED / MANUAL_REVIEW`のexact4だけを許す。`DIRECT`はexact changed pathまたはexplicit verified connection、`PROBABLE`はexisting bounded graph closure、`UNCHANGED`はcompared exact blobが同一というfile factだけ、その他は`MANUAL_REVIEW`とする。`MANUAL_REVIEW`はowner handbackを持つvalid blocked Contextであり、READYへ昇格しない。`UNCHANGED`をproduct no-impactへ、unknownを`NO_IMPACT`へ変換しない。

drift machine codeは次のexact6へ閉じる。

```text
OWNER_PATH_MISSING
OWNER_PATH_RENAMED_OR_DELETED
EXPLICIT_RETIRED_ROUTE_STILL_ACTIVE
DECLARED_TEST_CONTRACT_OWNER_ROUTE_MISMATCH
DESIGN_ONLY_CLASSIFIED_AS_RUNTIME_ACTUAL
OWNER_OWNED_PATH_CHANGED_AFTER_INTEGRATION
```

各rowはsubject ID、exact evidence locator、provenance、verified scope、impact class、required owner handbackを持つ。sixth codeはseparately-authorized owner-write transactionだけが所有し、本read-only PR #30 routingでは生成しない。`DIVERGED / OWNER_REF_AHEAD`はfreshness relationとして表示するが、owner exact headとrequired premise exact blobが読める場合はそれだけでOperator Contextをblockしない。workspace incorporation／merge／rebase／integration／write claimは常にfalseである。

### 8.3 One fact base and bounded role projections

`operator_context.json`はUnit B operator fact base exact1である。model内の`task_profile_declaration`はcompile inputのschema／task／exact profileを保持し、canonical SHAをmanifest `input_sha256.task_profile`へbindする。verifierはclaim、connection、explicit scope、role viewを当該declarationから再照合する。`operator_model_fingerprint`は当該fieldを除くcanonical payloadから一回計算し、manifestの`output_sha256`とUnit B summaryがoperator file SHA、model fingerprint、Pro SHA、Ultra SHAをbindする。final `context_fingerprint`はself-referenceを避けmanifestだけに置く。

`pro_context.md`と`ultra_context.md`は同じoperator SHA／model fingerprintからdeterministicにrenderし、verifierがshared modelからbyte-exact rerenderする。AI summary、role独自fact、semantic ranking、implementation permissionはexact0である。一方のprojectionへの新fact追加、model／projection SHA mismatch、fingerprint tamperはpublish 0である。

Pro first-viewはordered card exact8、maximum 12 decision items、reason maximum 2、locator maximum 3/card、16 KiBである。Pro outer ceilingは24 items／1.5 MiB referenced source／8 reasons／96 KiB、Ultra ceilingは80 items／4 MiB referenced source／12 reasons／192 KiBである。required surface超過は`BUDGET_EXCEEDED_REQUIRED_SURFACE`としてblockし、silent truncation／automatic expansionは行わない。full closureは`closure_edges.jsonl`とshared modelへ保持し、initial role viewへ全展開しない。

decision surfaceはfreshness blocker、premise chain、Mash/product/owner、changed path/scope/protected test、verified connection、PROBABLE impact、trigger/exclusionのpriority exact7でsortする。同priorityはrequired、graph distance、repository key、normalized path、stable IDで決定し、semantic score、date、feedback countを使わない。

minimal readbackはchanged path／symbol／route、required owner／premise、connected protected test／contract、probable dependent＋reason、unresolved owner handback、full closure pointerを持つ。probable dependentはchanged targetごとのbounded graph originへbindし、別変更だけから到達するdependentを全DIRECT rowへ一括複製しない。

Proのfreshness cardはshared modelのexact relationと両側changed-path countを表示し、actual `DIVERGED`を`FRESHNESS_READY_NO_BLOCKER`だけへ潰さない。Ultraはworkspace／owner exact refs、owner-side changed path、required entry chain commit／blob、claim provenance、connection endpoint、scope、conflict、impact、minimal readback、STOPを同じadmitted setからboundedに投影する。

### 8.4 Internal checkpoint and zero-effect boundary

Unit B internal successはUnit A regression、exact7 schema fail-close、temporary exact10 generation、same-model projection binding、endpoint／scope／impact／drift／minimal-readback actual、byte-exact rerender、privacy scan、tamper rejectionを意味する。Unit C、terminal exact11、Step 7全体completion、Step 8 actual-use、Step 9 activationを意味しない。

```text
UNIT_B_TEMPORARY_LOGICAL_OUTPUT_COUNT = 10
UNIT_C_STARTED = false
V1_ACTIVATION = 0
completion_claim = null
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
AUTOMATIC_PROGRESSION = false
STRUCTURE_MAP_DELTA_NONE
```

## 9. Step 7 bounded implementation — Unit C Collaboration Support

### 9.1 Terminal profile and output contract

Unit CはUnit A exact3とUnit B exact4を保持し、同じpersistent `cmee` taskの`operator_contract`へ次のexact3を追加する。

```text
external_locators
collaboration
actual_use_feedback
```

したがってpersistent CMEE contractはexact10である。logical outputはcommon exact5、CMEE compatibility exact2、V1 projection exact4のexact11とし、`collaboration_packets.json`を追加する。`context_manifest.json`と`publication_transport.json`はlogical count外のowner manifestである。

`operator_context.json`だけをshared fact modelとする。Pro、Ultra、collaborationは同じ`operator_context_sha256`と`operator_model_fingerprint`へbindし、verifierが同じmodelからbyte-exactに再生成する。role別fact、AI summary、model/tool選択、subagent実行、write target、permission生成は0である。

### 9.2 External locator and privacy boundary

external locatorは`location_kind / availability_state / privacy_state / canonicality`を直交軸として保持する。current CMEE profileのCycle001 source/test exact2はpublic commit/path/blob/symbol identityへbindした`OTHER_WORKSPACE / AVAILABLE / PUBLIC / NONCANONICAL`であり、active CMEE subengine、canonical adoption、workspace incorporationを意味しない。

`public_identity_allowed=false`またはprivate locatorはopaque IDとretrieval ownerだけを許す。private body、excerpt、quote、summary、embedding、body-derived hash、secret、token、signed URL、sensitive pathをprofile、logical output、manifest、transport、workflow output、PR bodyへ置かない。`RETRIEVAL_GAP`を`ACTUAL_ABSENCE`へ変換しない。

### 9.3 Collaboration and feedback boundary

collaborationはrestart packet exact1とread-only subagent packet 0..3だけを許す。restartのnext workは`MASH_EXPLICIT_DECISION`または明示承認済みclaim IDだけを参照し、compiler推測からStep 8、implementation、activationを開始しない。Step 7 terminalのrestartは`HOLD_AFTER_STEP7_UNTIL_EXPLICIT_NEXT_APPROVAL`と`next_work_source_claim_ids=[]`を表示し、未承認のnext workを生成しない。packetのselected target、coverage、prohibited scope、environment claimはsame task内の既知IDへresolveし、duplicate、dangling、selectedとcoverageを同一packet内またはpacket間で交差させるunresolved overlap、unknown fieldをrejectする。

Unit Cの`role_views` exact3目は`COLLABORATION`とし、budgetはmax items 32、referenced source bytes 2 MiB、reasons/item 8、projection UTF-8 bytes 128 KiBである。required surfaceのtruncateまたは自動増枠は行わず、超過はblockする。

actual-use feedbackは`EVENT_DRIVEN_OPTIONAL`、0..64 row、empty validである。実際の不要選択、選択漏れ、理由不足、role output不足、tool外issueのreview eventだけを許し、routine positive logを禁止する。`SELECTED_AND_USED`は既存gapを閉じる`related_feedback_id`がある場合だけ許す。feedbackによるautomatic rank、selection mutation、authority、profile append API、Mash manual inputは0である。

### 9.4 Non-CMEE exact1 ephemeral proof

`account_profile_read_only`はworkspace内唯一の`EPHEMERAL_VERIFY_ONLY` taskである。`GET /account/profile/me`をRN、API registration／handler、auth／DB read、response contract、protected testsへread-only traceし、direct source exact8とprotected surface exact5を選択する。CMEE compatibility exact2を要求せず、common exact5＋V1 exact4のlogical exact9をtemporary rootでcompile／verifyして破棄する。

shared modelはbackend closureの`RESOLVED_WITH_EXPLICIT_UNKNOWN_EDGES`、route graphの`UNMOUNTED_ROUTER`、direct sourceの`register_account_lifecycle_routes(app)`を別evidenceとして並記し、`MOUNT_VERIFICATION_REQUIRES_DIRECT_SOURCE / manual review`とする。`ACCOUNT-PROTECTED-GAP-001 = AUTH_SELF_FILTER_AND_DB_FIELD_ALLOWLIST_NOT_DIRECTLY_ENDPOINT_TESTED`は`PROTECTED_REVIEW_REQUIRED`、handback ownerはaccount/public API owner、product route GREEN claimは0である。これらmount evidence conflict、dynamic unknown edge、protected gapをsilent GREENへ変えない。PATCH、delete、profile create、visibility update、endpoint invocation、Bearer使用、user-data fetch、DB query/write、RN/API/auth mutation、persistent output、receipt、transport、Git diffはexact0である。

### 9.5 Publication, verification, and completion boundary

persistent `cmee`だけがwhole-workspace sibling transactionからtracked `current/cmee_working/**`へreplace-current publishできる。candidate build、logical/physical exact set、manifest/transport hash、privacy、projection rerender、owner ref pre-publish equality、T01–T74がすべて通る前にlive rootを変更しない。crashまたはfinal verify failureはlast-good whole workspaceへ復元し、partial live claimを作らない。

Unit C source/test/generated actualとfresh remote verificationが揃った時点で、Step 7 bounded implementationだけをtechnical implementation completeと記録できる。これはOperator actual-use、product quality、V1 completionまたはactivationではない。

```text
STEP7_BOUNDED_IMPLEMENTATION = COMPLETE
CMEE_OPERATOR_CONTRACT_KEYS = 10
CMEE_LOGICAL_OUTPUT_COUNT = 11
NON_CMEE_EPHEMERAL_TASK_COUNT = 1
NON_CMEE_LOGICAL_OUTPUT_COUNT = 9
V1_ACTIVATION = 0
completion_claim = null
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
STEP8_STARTED = false
STEP9_STARTED = false
AUTOMATIC_PROGRESSION = false
STRUCTURE_MAP_DELTA_NONE
```

---

## 10. Mash Step 8 skip decision and Step 9 current overlay

### 10.1 Current decision, precedence, and admission

Mashの2026-08-22明示判断により、Step 8は `SKIPPED_BY_MASH_DECISION` とする。このcurrent overlayは、Step 9開始前に必要としていたStep 8 durable actual-task evidence exact3、Pro／Ultra actual-use確認、Mash burden非増加確認だけをStep 9開始条件から削除する。

Step 9のcurrent開始条件は次のexact conjunctionであり、Step 7からのautomatic progressionではない。

```text
STEP7_BOUNDED_IMPLEMENTATION_COMPLETE
+ MASH_EXPLICIT_STEP8_SKIP_AND_STEP9_ACTIVATION
```

Step 4／Step 6が定義したOperator actual-proofの意味、correctness、privacy、freshness、原本full-read boundaryは弱めない。Step 8を実施していないため、`SYSTEM_CONTEXT_V1_OPERATOR_CONTEXT_ACTUAL_PROOF_COMPLETE`は成立せず、主張しない。Step 6 final bodyはapproved historical sourceとしてbyte変更せず、本節だけがcurrent Step 9 admissionとmanagement-entry positionを上書きする。

### 10.2 Management entry migration

`Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt`からrouteされるSystem Context technical entryは、`Cocolon_前提資料/system_context/00_read_first.md` exact1へ固定する。Cocolon作業はそこからworkspace freshness、task Context、role projection、actual original full-text read、human judgmentへ進む。

System Contextは管理・探索・正本候補判定・影響把握の入口であり、原本、product canonical owner、current-structure owner、Mash判断または人間の意味判断を置き換えない。missing、stale、tamper、tool failureはfail closedとし、原本へのdirect read fallbackを常に残す。

### 10.3 Generated Step 7 snapshot and Operator-proof boundary

Step 7 generated actualに残る次の値は変更しない。

```text
operator_v1_activation_approved = false
v1_activation = 0
completion_claim = null
```

これらはgenerated candidate自身がOperator actual-use／acceptance／actual-proof completionを自己主張しない境界であり、Mashが承認したmanagement-entry switchを否定する値ではない。generated restart packetの`HOLD_AFTER_STEP7_UNTIL_EXPLICIT_NEXT_APPROVAL`もStep 7 terminal時点のfrozen snapshotであり、automatic progressionが0だった証拠として保持する。current Step 9 admissionとnavigation ownerは本節およびcurrent `00_read_first.md`である。

Step 8 actual-useを実施したfresh generated bytes、Operator value、Pro／Ultra actual改善、Mash burden非増加は主張しない。

### 10.4 V1 implementation freeze and future enhancement rule

Step 7 source／test／profile／workflow／generated actualをV1 implementation baselineとしてfreezeする。Step 9はそのimplementationを変更せず、current technical management entryとfuture enhancement ceilingだけを固定する。

manual navigation、index、rule、original fileは自動delete／rename／rewrite／retireしない。Step 8 actual-use evidenceがないため、current retirement candidateはexact0である。

future enhancementは次のexact4が同時に成立し、かつ新しいMash明示判断がある場合だけ許す。

```text
actual taskで観測したpain point exact1
+ System Contextの因果不足
+ より小さい既存手段なし
+ Pro／Ultraの作業負担をactualに減らす
```

System Contextの規模、document数、feedback件数、scanner数またはcheck数を成果にしない。new service／DB／daemon／dashboard／recurring cost／automatic rank／automatic owner mutationはdefault 0のまま保持する。

### 10.5 Current terminal

```text
STEP7_BOUNDED_IMPLEMENTATION = COMPLETE
STEP8_STATUS = SKIPPED_BY_MASH_DECISION
STEP8_DURABLE_ARTIFACT_COUNT = 0
PRO_ACTUAL_USE_CONFIRMATION = NOT_PERFORMED
ULTRA_ACTUAL_USE_CONFIRMATION = NOT_PERFORMED
MASH_BURDEN_NONINCREASE_ACTUAL_CONFIRMATION = NOT_PERFORMED
STEP9_MANAGEMENT_ENTRY_MIGRATION_AND_V1_FREEZE = COMPLETE
MANAGEMENT_ENTRY_ACTIVATION = 1
V1_IMPLEMENTATION_FREEZE = 1
FROZEN_STEP7_IMPLEMENTATION_IDENTITY = 92e4ad913f61c064e42320bd62ab13fa0ba97fa7
SYSTEM_CONTEXT_V1_MANAGEMENT_ENTRY_ACTIVATED_AND_IMPLEMENTATION_FROZEN = TRUE
SYSTEM_CONTEXT_V1_OPERATOR_CONTEXT_ACTUAL_PROOF_COMPLETE = NOT_CLAIMED
OPERATOR_PROOF_ACTIVATION = 0
OPERATOR_GENERATED_COMPLETION_CLAIM = null
SOURCE_TEST_PROFILE_WORKFLOW_GENERATED_EFFECT = 0
PRODUCT_RUNTIME_API_DB_RN_MERGE_READY_EFFECT = 0
CONTRACT_MUTATION_EFFECT = 1
POSITION_CHANGE_EFFECT = 1
MANAGEMENT_ENTRY_EFFECT = 1
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
PRIMARY_OUTCOME = ADMINISTRATIVE_ONLY
STRUCTURE_MAP_DELTA_NONE
AUTOMATIC_PROGRESSION = false
```

`SYSTEM_CONTEXT_V1_COMPLETE`、`SYSTEM_CONTEXT_V1_OPERATOR_CONTEXT_ACTUAL_PROOF_COMPLETE`、Operator value PASS、Product Read、merge-ready、release-readyは主張しない。Step 9 terminalから次workへautomatic progressionしない。

---

## 11. 2026-09-02 bounded V1 execution hardening overlay

### 11.1 Authorization and exact identity separation

Mashの2026-09-02明示判断は、現行V1のread-only actualで観測された不足に対し、次のexact4だけを最小修正することを承認する。

```text
exact-ref separation
fixed environment enforcement
stale/cache decision correction
lightweight standard output
```

実行tool、schema、profile、embedded payloadのimplementation rootは、実行中のPR #37 exact checkoutである。`--repo-root`はPR #30 Cocolon materialだけを指し、`--external-workspace-root/mashos-api`はPR #3 materialだけを指す。subprocess toolをmaterial checkoutから起動せず、PR #37 implementation rootから起動する。

current approved material exact headsは`workspace_profiles.json`に固定する。

```text
Cocolon PR #30 = e03d04b78bffb63c26ff5c7b6d3f1ce557f7a3cf
mashos-api PR #3 = 4e8d397843c0381bc94379b71665cf71b80d7d1b
```

PR #37、PR #30、PR #3をoverlay、merge、rebase、incorporation claimで一つの偽treeにしない。PR #30とPR #3はread-only materialであり、そのwrite effectは0である。

### 11.2 Fixed environment and fail-closed gate

`.devcontainer/`はSystem Context専用のPython、Node、TypeScript、`scip`、`scip-typescript`、`scip-python`とtest dependencyをversion、artifact digest、lock integrityで固定する。product runtime dependencyは追加しない。

standard entryはprepare前に`python3 -m tools.cocolon_context doctor`を通し、repository lockとactual executable/module versionの不一致、missing provider、lock tamperをfail closedでSTOPする。required SCIP failureをsyntax fallbackまたはwarningに変換しない。

workflow exact3は従来のsame-repository、open Draft、unmerged、event head ref/SHAの前後照合、read-only permission、credential non-persistenceを保持する。CIは1.46 GBのtracked historical Contextをimage build contextに送らず、`.devcontainer`だけからfixed imageをbuildし、exact checkoutをread-only mountしたruntime network exact0でdoctor、bounded compile、testを実行する。

### 11.3 Freshness, drift, and cache decision

material checkoutは開始前と完了直前にHEAD、tree、tracked/untracked dirty exact0を照合する。実行中のrefまたはimplementation inputが動いた場合はretryせずSTOPし、partial resultをpublishしない。

cache fingerprintは次を結合する。

```text
material exact refs
+ implementation tool and embedded payload bytes
+ workspace/task profiles and schema
+ fixed-environment lock identity
```

saved lock不在は`INITIAL_FULL_BUILD`、commit identityの変更に対しtree diffが0でもfull rebuild、old commit object不在またはlineage不一致はbounded full-rebuild fallbackとする。これらを`SAME_REF_REUSE`と表示しない。same-ref reuseはmanifest、logical bytes、transport、Context fingerprint、execution-input fingerprintがすべてverifyした場合だけ許す。

receiptは`input_freshness`、`output_freshness`、`start_refs`、`end_refs`、`ref_drift`、`cache_decision`、`proof_status`を独立に扱う。fresh local buildとremote proof pendingをstaleと同一視せず、remote proof pendingをfreshness PASSの代替にしない。

standard writable outputはtracked `Cocolon_前提資料/system_context/current/cmee_working/**`ではなく、Git-ignoredの`<cache-root>/cmee_working/**`に置く。defaultはPR #37 implementation rootの`.cocolon-context-cache`であり、`--cache-root`でexplicit local rootを指定できる。tracked 1.46 GB historical snapshotは本hardeningでdelete、rename、rewriteしない。

### 11.4 Lightweight output and original-read boundary

standard stdoutはexact refs、freshness、proof state、bounded count、cache/receipt path、zero-effect boundaryだけのbrief JSONとする。`--output-format full`はexplicit diagnosticである。canonical logical exact11、publication transport、whole-workspace transaction、full closure、original full-text reading orderはcache内に完全に保持し、stdoutを軽量化するために証拠を削除またはsilent truncateしない。

fixed environment、exact ref、freshness、cache verification、tool executionのどれかがmissing、stale、tampered、unverifiableならSystem Contextはfail closedで停止する。その停止は作業そのものを禁止しない。tracked originalは常にcanonicalであり、execution ownerは原本へdirect read fallbackし、関係ファイル本文を実際に読んだ後にhuman judgmentを行う。

### 11.5 Unchanged boundaries

本overlayはV1の実行再現性とlocal navigation costだけを修正する。RN/API/DB/migration/product behavior、CMEE/EmlisAI/Piece/Analysis output、public contract、external service、daemon、dashboard、recurring cost、automatic rank/selection/owner mutation、PR Ready化、merge、deploy、releaseのeffectは0である。Operator actual-use proof、Product Read、`SYSTEM_CONTEXT_V1_COMPLETE`は主張しない。
