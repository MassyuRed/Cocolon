---
doc_id: cocolon_system_context_implementation_contract_20260818
title: "Cocolon System Context — Steps 1–5 and Step 7 Candidate Contract"
revision_date: "2026-08-22 JST"
implementation_steps: [1, 2, 3, 4, 5, 7]
step7_candidate_status: "UNIT_A_INTERNAL_CHECKPOINT"
v1_activation: 0
scope: "Cocolon + mashos-api full file inventory, code index, and RN/API/backend/test/domain route graph"
product_runtime_effect: 0
api_db_rn_contract_effect: 0
automatic_progression: false
---

# Cocolon System Context — Steps 1–5 and Step 7 Candidate Contract

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

Steps 1–5で使用したwriter workflowは履歴であり、Step 7 candidateのworkflow exact3はcurrent same-repository Draft PR headだけを前後照合するread-only verifierへretireする。Unit A時点ではgenerated output、source、PR本文、branch refをworkflowから変更しない。bounded writerはwhole-workspace transaction、V2 logical exact11、privacy scan、T01–T74が同じStep 7 candidate内で揃う後続checkpointまで再導入しない。

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
