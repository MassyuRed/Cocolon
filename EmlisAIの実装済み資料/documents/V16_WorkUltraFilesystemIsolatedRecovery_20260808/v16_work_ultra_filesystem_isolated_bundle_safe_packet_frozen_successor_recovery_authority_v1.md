# Cocolon EmlisAI NLS v3 Cycle 001
## Separate Mash UI-Attested Work Ultra Filesystem-Isolated Bundle Safe-Packet and Frozen Successor Recovery Authority V1

authority_id: SEPARATE_MASH_UI_ATTESTED_WORK_ULTRA_FILESYSTEM_ISOLATED_BUNDLE_SAFE_PACKET_AND_FROZEN_SUCCESSOR_RECOVERY_AUTHORITY_V1
authority_status: FROZEN_APPROVAL_REQUIRED
approval_action: ATTEST_ACTIVE_WORK_UI_ULTRA_THEN_APPROVE_EXACT_SHA256_AND_CONSUME_ONCE
single_use: true
automatic_progression: false
required_execution_environment: Work
required_environment_classification: WORK_ULTRA_REQUIRED
required_environment_evidence: MASH_EXPLICIT_SAME_MESSAGE_WORK_ULTRA_UI_ATTESTATION
authorizes_technical_execution: false
authorizes_downstream_review_execution: false
authorizes_source_or_test_change: false
body_free: true

companion_parser_filename: v16_work_ultra_filesystem_isolated_bundle_safe_packet_parser_v1.py
companion_parser_bytes: 12045
companion_parser_sha256: 99498896627945c04db0954b300dfa8d441afd6f4adf96b0e8ec5d50845bebc6
companion_parser_lf: 351
companion_parser_cr: 0
companion_parser_final_lf: true
companion_parser_bom: none

## 1. Purpose and necessity

This authority recovers from the consumed immediate predecessor's durable terminal:

```text
BUNDLE_SAFE_PACKET_OUTPUT_BOUNDARY_VIOLATION_STOP
PRE_SUCCESSOR_STOP_DURABLE
```

The predecessor proved that Chat-side GitHub bundle transport returns the raw durable bundle JSON, including opaque `content_b64_segments`, into Karen context instead of returning only the required body-free safe packet. The raw bundle was not decoded or technically interpreted, but its model-visible return violated the control-plane output boundary. The predecessor therefore created no successor and granted no technical credit.

This authority changes exactly the missing execution boundary:

1. it requires Work Ultra because a filesystem-isolated subprocess and model-output suppression are now authority conditions;
2. it binds actual bundle parsing to one frozen companion parser whose raw input, base64 segments, decoded bytes, stdout, and stderr never enter a model-readable tool result;
3. it lets Karen read only the closed body-free safe packet and, after that packet passes, the exact decoded earlier authority once;
4. it preserves all consumed-authority, no-reuse, zero-credit, privacy, and no-automatic-progression boundaries;
5. it freezes one inactive, separately approval-required Ultra successor without executing Inspector V2, publication QA, or independent review exact4.

This is not a retry or reactivation of any consumed authority. It is a distinct recovery authority with a different required environment, frozen parser identity, transport boundary, and atomic publication contract.

New information obtained on success:

- whether the Work Ultra filesystem boundary can keep the raw bundle and opaque segments outside Karen context;
- whether the fixed durable bundle SHA-256 and member metadata match;
- whether the exact earlier consumed authority can be decoded and read once without technical payload exposure;
- whether one inactive Ultra successor can be reconstructed from the earlier authority's immutable scope and frozen identities;
- whether the recovery authority, parser, successor, and receipt can be published atomically in one branch commit.

What becomes possible after success:

- Mash may separately approve the inactive Ultra successor for the still-unexecuted V16 Inspector V2 publication-QA preexecution independent substantive review exact4 lane.

This authority does not perform that downstream lane.

## 2. Preapproval Work Ultra attestation boundary

The approval message MUST contain all four meanings below in the same Work message:

1. Mash is viewing the active Work UI for the session in which execution will occur;
2. the Work execution mode shown in that UI is `Ultra`;
3. the execution environment is Work rather than Chat;
4. Mash approves this exact authority SHA-256 for single use.

This is a bounded UI attestation of the selected Work execution mode. It is not backend, cryptographic, or platform runtime proof and SHALL NOT be relabelled as such.

If any meaning is missing, ambiguous, prior-session-only, or contradicted by the observed context:

- approval_effective: false;
- activation: exact0;
- consumption: exact0;
- GitHub branch write: exact0;
- STOP receipt: exact0;
- result: APPROVAL_NOT_EFFECTIVE_CURRENT_WORK_ULTRA_UI_ATTESTATION_REQUIRED.

This preapproval rejection is not an authority STOP and does not consume the single-use authority. Karen SHALL return only the missing attestation requirement.

An account tier, remembered mode, Chat UI model, shell environment variable, user-agent string, or Karen self-assertion is insufficient.

## 3. Frozen approval package identity

The approval package contains exactly two local files:

1. this authority Markdown;
2. `v16_work_ultra_filesystem_isolated_bundle_safe_packet_parser_v1.py`.

Before semantic reading or activation, the execution MUST locate both files by exact filename and verify:

```text
parser bytes:      12045
parser SHA-256:    99498896627945c04db0954b300dfa8d441afd6f4adf96b0e8ec5d50845bebc6
parser LF / CR:    351 / 0
parser final LF:   true
parser BOM:        none
```

The current authority byte count and SHA-256 are supplied by the approval sidecar generated with this file.

If either exact local source identity cannot be proven before the authority body is semantically read:

- approval activation is not established;
- activation: exact0;
- consumption: exact0;
- GitHub branch write: exact0;
- result: APPROVED_SOURCE_SET_IDENTITY_NOT_PROVEN_NO_CONSUMPTION.

Only after both identities pass may Karen read this authority body exact1. That semantic read is activation exact1 and consumption exact1.

The parser source is then Karen-read exact1 for static scope inspection before execution. It SHALL NOT be edited, regenerated, normalized, patched, or refrozen under this authority.

## 4. Pinned entry state

Cocolon current head:

```text
74769be66dea44aa956fc58c7fd6e5721edc0a7d
```

Cocolon current tree:

```text
817c51fd44ed37826e0993cd7763170772bc4971
```

mashos-api current head:

```text
65284fef36936d7091262e758e0cc9282909601b
```

The Cocolon head is exactly two commits ahead of the preceding baseline `8c14ee7ee6e35c197a35722eb453e9d448692390`, with the exact changed-path union below and no other path:

1. `EmlisAIの実装済み資料/documents/V16_ModelAttestedControlPlaneRecovery_20260808/v16_mash_ui_attested_chat_5_6_pro_control_plane_recovery_authority_v1.md`
2. `EmlisAIの実装済み資料/documents/V16_ModelAttestedControlPlaneRecovery_20260808/v16_mash_ui_attested_chat_5_6_pro_control_plane_recovery_presuccessor_stop_receipt_v1.md`

### 4.1 Immediate consumed authority

- id: `SEPARATE_MASH_UI_ATTESTED_CHAT_5_6_PRO_CONTROL_PLANE_RECOVERY_AUTHORITY_V1`
- state: `CLOSED_CONSUMED_STOP`
- SHA-256: `b302a65ef9edaaefbed01bc3f29105f2c0e141755e16f2dc7bc1b4ed555361d4`
- bytes: `26793`
- Git blob: `7b74ac8971c10a766237cc8f1c8c5073f0af6335`
- commit: `9d6e0bc20be08b433d7ce56b9277c3c4a6b7cd76`
- required first parent: `8c14ee7ee6e35c197a35722eb453e9d448692390`
- path: `EmlisAIの実装済み資料/documents/V16_ModelAttestedControlPlaneRecovery_20260808/v16_mash_ui_attested_chat_5_6_pro_control_plane_recovery_authority_v1.md`

### 4.2 Immediate durable STOP receipt

- state: `CLOSED_CONSUMED_STOP`
- terminal: `BUNDLE_SAFE_PACKET_OUTPUT_BOUNDARY_VIOLATION_STOP / PRE_SUCCESSOR_STOP_DURABLE`
- SHA-256: `f63aa1269cdb413831d029aec697e12ae721ce862ff312dafe4d4e4e8d01cd59`
- bytes: `7433`
- Git blob: `e8ad1270e6abc695daa63886b7eea5c2e56b065b`
- commit: `74769be66dea44aa956fc58c7fd6e5721edc0a7d`
- required first parent: `9d6e0bc20be08b433d7ce56b9277c3c4a6b7cd76`
- path: `EmlisAIの実装済み資料/documents/V16_ModelAttestedControlPlaneRecovery_20260808/v16_mash_ui_attested_chat_5_6_pro_control_plane_recovery_presuccessor_stop_receipt_v1.md`

### 4.3 Earlier consumed authority and durable evidence

Earlier consumed predecessor authority:

- id: `V16_INSPECTOR_V2_BUNDLE_REFETCH_FROZEN_REUSE_PUBLICATION_QA_PREEXEC_REVIEW_AUTHORITY_V1`
- SHA-256: `f785c5784d31221bdc5f3cbeebc5657899ab02b9f8d9a97ccdef6f9a77682e30`
- bytes: `42008`
- LF / CR / final LF: `735 / 0 / true`
- Git blob: `d30c422f735e3c2923b9b83a11a22769e85d5dbb`
- state: `CLOSED_CONSUMED_STOP`

Durable earlier STOP bundle:

- path: `EmlisAIの実装済み資料/documents/V16_Standalone_Preparation_CommandTransport_Stop_20260806/v16_inspector_v2_bundle_refetch_stop_bundle_v1.json`
- expected Git blob at the pinned head: `0a52c48ba09969543aab46a092bb99a7e4adffcf`
- expected bytes: `129363`
- expected SHA-256: `8398dc837ed78a1183a5dbb4699737de366bb8650ef803748c810ec0b7fdfbff`
- artifacts cardinality: `exact2`
- selected index: `0`
- selected role: `approved_successor_authority`
- selected role cardinality: `exact1`
- content encoding: `base64_ascii_segments_concat_exact_order`
- segment chars: `4096`
- segment count: `exact14`

Durable earlier STOP receipt:

- path: `EmlisAIの実装済み資料/documents/V16_Standalone_Preparation_CommandTransport_Stop_20260806/v16_inspector_v2_bundle_refetch_stop_receipt_v1.md`
- expected SHA-256: `5b99ca7e52e614e4f90f9958cbc60fdee0e92320f0f66fe02546c8befbf8b55a`
- expected Git blob at the pinned head: `b2096ca0ff7554d2ff0418c5ba98aeabc21643d8`

Cycle 001 state:

```text
NOT_ACCEPTED
```

Technical credit:

```text
EXACT0
```

No prior consumed authority, opaque segment exposure, or STOP artifact may be reused as approval, activation, technical evidence, PASS, or credit.

## 5. Why Work Ultra is required

This bounded work unit is `WORK_ULTRA_REQUIRED` because:

1. the raw bundle must be fetched into an isolated filesystem file without appearing in a model-readable connector or shell result;
2. a frozen local parser subprocess must consume that file while its stdout and stderr are redirected and proven empty;
3. the decoded earlier authority must be delivered through a separate exact local file channel only after the body-free safe packet passes;
4. Chat-side GitHub bundle transport has already been proven unsuitable for this boundary;
5. the later successor continues to require independent substantive review exact4, which cannot be replaced by repeated self-review.

Work Ultra is required for capability and evidence separation. This classification does not request or authorize additional credit purchase.

## 6. Activation and mandatory gate order

The following order is mandatory and non-circular.

### Step 0 — approval attestation

Inspect the approval message only for the four Section 2 meanings. If insufficient, apply the preapproval exact0 boundary and end.

### Step 1 — approval package identity and activation

Verify the authority and companion parser exact local identities tool-only. Only after both pass may Karen read this authority exact1. That read activates and consumes this authority exact1.

### Step 2 — current remote heads and protected lineage

Fresh-fetch Cocolon and mashos-api heads. Require mashos-api to equal its pin. Require Cocolon to equal its pin or be a proven descendant whose intervening changed paths touch none of:

- the two immediate consumed input paths in Section 4;
- the two earlier durable evidence paths in Section 4;
- any authorized target path in Section 11.

If ancestry, changed paths, or either head is unknown, STOP before bundle materialization.

### Step 3 — immediate consumed authority and receipt

Fetch, hash, and Karen-read the immediate consumed authority exact1. Fetch, hash, and Karen-read its durable STOP receipt exact1. Require all pinned identities and `CLOSED_CONSUMED_STOP` states to match.

### Step 4 — parser static inspection and filesystem capability gate

Karen reads the frozen parser source exact1 and verifies that it:

- writes no stdout or stderr;
- has a closed safe-packet schema and closed error-code set;
- writes decoded authority bytes only to a distinct `0600` file on PASS;
- never writes raw bundle bytes, opaque segments, decoded bytes, traceback text, or exception messages to the safe packet;
- verifies the fixed bundle and decoded authority identities;
- uses exclusive output creation and refuses preexisting output paths.

Require a Work filesystem tool capable of:

- creating a unique absolute directory with mode `0700`;
- running Python and Git subprocesses;
- redirecting stdout and stderr to files;
- checking file bytes, SHA-256, mode, and emptiness without printing raw bundle content;
- maintaining raw bundle and decoded-authority files outside any model-readable automatic attachment channel.

If any capability is unavailable or uncertain, STOP before raw bundle extraction.

### Step 5 — clean pinned public clone

Create one new unique Work directory and one new clean anonymous HTTPS checkout of `MassyuRed/Cocolon` at the accepted pinned Cocolon head. Do not reuse an earlier checkout, retained runtime, cache, materialized connector response, or Chat container.

Require:

- exact repository identity;
- exact detached head;
- clean status;
- raw bundle Git blob at its exact path equals `0a52c48ba09969543aab46a092bb99a7e4adffcf`;
- earlier STOP receipt Git blob equals `b2096ca0ff7554d2ff0418c5ba98aeabc21643d8`.

Clone and Git diagnostic output may contain only repository-control metadata. It SHALL NOT print either file body.

### Step 6 — raw bundle extraction without model output

Use Git object plumbing to write the exact bundle blob directly to a local file in the `0700` work directory. The command's stdout MUST be redirected to that file and its stderr MUST be redirected to a separate local log.

Prohibited for the raw bundle path or blob:

- GitHub `fetch`, `fetch_blob`, `fetch_file`, Files read/search, or any other tool that returns file content to Karen;
- `cat`, `head`, `tail`, `sed`, `grep`, `jq`, `less`, Python repr, notebook display, logging, shell command substitution, or error echo;
- upload, attachment, artifact publication, or subagent delivery;
- direct semantic read by Karen.

After extraction, only byte count, file mode, and SHA-256 may be returned to Karen. If they differ from the pins, STOP without parser execution.

### Step 7 — frozen parser execution

Copy the approved parser bytes to the isolated directory without modification and verify its exact SHA-256 again. Create fresh absent paths for:

- body-free safe packet;
- decoded earlier authority;
- parser stdout log;
- parser stderr log.

Run the parser exact1 with all stdout and stderr redirected to the two log files. No interactive shell, notebook display, debugger, tracing, or exception propagation is allowed.

After execution, verify tool-only:

- stdout bytes: exact0;
- stderr bytes: exact0;
- safe-packet file mode: `0600`;
- decoded-authority file mode: `0600` if and only if safe packet status is PASS;
- no additional file was created by the parser.

If stdout or stderr is nonempty, if safe packet is missing, if an unexpected file exists, or if decoded output exists on STOP, terminate `PARSER_OUTPUT_OR_FILESYSTEM_CONTRACT_STOP`. Do not display the unexpected bytes.

### Step 8 — safe packet read

Karen reads the safe packet exact1. Its keyset MUST equal the Section 8 schema. Success requires every expected boolean, cardinality, byte count, line count, SHA-256, Git blob match, and exposure flag to have the exact PASS value.

On any parser STOP packet or safe-packet mismatch:

- do not read the decoded-authority path;
- do not fetch the earlier STOP receipt body;
- do not construct a successor;
- enter the pre-successor STOP publication branch.

### Step 9 — decoded earlier authority read

Only after Step 8 PASS, verify the decoded-authority file bytes, SHA-256, line counts, final LF, mode, and Git blob tool-only. Karen then reads the complete decoded earlier authority exact1 through a direct local file channel.

The decoded authority file SHALL NOT be sent to a manager, supervisor, reviewer, subagent, child task, connector, attachment surface, or public artifact.

### Step 10 — earlier STOP receipt and immutable reference recovery

Extract the earlier durable STOP receipt from the clean clone without printing it through Git plumbing, verify its exact identity, then Karen reads it exact1. Recover only immutable frozen-reference identities, technical scope, forbidden boundaries, no-reuse boundary, review cardinality, and zero-credit state from the decoded earlier authority and body-free receipt.

Do not fetch or semantically read any referenced frozen Inspector, specification, source, failure-return payload, private body, or technical payload.

### Step 11 — successor construction and freeze

Construct exactly one successor candidate with this authority id:

```text
V16_INSPECTOR_V2_BUNDLE_REFETCH_FROZEN_REUSE_PUBLICATION_QA_PREEXEC_REVIEW_ULTRA_AUTHORITY_V1
```

Karen semantically inspects the complete candidate exact1 before freeze. Freeze its UTF-8 LF bytes exactly once. After freeze, verification is tool-only byte/hash comparison with semantic reread exact0.

Any postfreeze semantic reread, edit, normalization, regeneration, or refreeze SHALL STOP before publication.

### Step 12 — atomic publication preflight and branch update

Follow the Section 11 state machine. No technical execution or successor activation may occur after publication.

## 7. Read and operation accounting

### 7.1 Success-path semantic counts

- Mash same-message Work Ultra UI attestation read by Karen: exact1;
- current authority body read by Karen: exact1;
- frozen companion parser source read by Karen: exact1;
- immediate consumed authority body read by Karen: exact1;
- immediate durable STOP receipt read by Karen: exact1;
- raw durable bundle semantic read by Karen: exact0;
- raw durable bundle model-readable tool return: exact0;
- opaque `content_b64_segments` model exposure: exact0;
- parser stdout semantic read: exact0;
- parser stderr semantic read: exact0;
- body-free safe packet read by Karen: exact1;
- decoded earlier consumed authority body read by Karen: exact1;
- durable earlier STOP receipt read by Karen: exact1;
- successor candidate semantic construction/inspection by Karen: exact1;
- frozen successor postimage semantic reread: exact0;
- frozen technical payload semantic read: exact0;
- private material semantic read: exact0;
- manager, supervisor, reviewer, subagent, and child-task authority-body read: exact0;
- delegated payload read: exact0.

### 7.2 Success-path tool-only counts

- current approval package file identity checks: exact2;
- entry Cocolon head fetch / mashos-api head fetch: exact1 / exact1;
- baseline-to-entry ancestry and changed-path compare: exact1;
- immediate authority fetch/hash verification: exact1 / exact1;
- immediate receipt fetch/hash verification: exact1 / exact1;
- new clean public clone: exact1;
- raw bundle Git object extraction: exact1;
- raw bundle byte/SHA-256 verification: exact1 / exact1;
- frozen parser SHA-256 verification before execution: exact1;
- parser execution: exact1;
- parser stdout/stderr emptiness checks: exact1 / exact1;
- safe-packet keyset/value verification: exact1;
- decoded authority byte/SHA-256/Git-blob verification: exact1 / exact1 / exact1;
- earlier STOP receipt extraction/hash verification: exact1 / exact1;
- successor prefreeze byte-hash operation: exact1;
- successor frozen-byte hash verification: exact1;
- publication-base head fetch and protected-path compare: exact1 / exact1;
- authorized target preexistence probes: exact6;
- Git blob creation for selected terminal branch: one per selected path;
- Git tree creation / commit creation / fresh pre-ref head fetch / ref update attempt: exact1 / exact1 / exact1 / exact1;
- commit metadata and first-parent verification after successful ref update: exact1 / exact1;
- remote postimage metadata fetch and path/blob/byte verification: exact1 per selected path;
- final changed-path compare / final Cocolon head / final mashos-api head: exact1 / exact1 / exact1;
- automatic retry: exact0;
- fallback transport: exact0;
- second parser execution: exact0;
- second branch ref update attempt: exact0.

All performed failure-path counts SHALL be recorded at actual values. No failed or unknown operation may be silently reclassified as success.

## 8. Frozen parser output contract

### 8.1 PASS safe-packet exact keyset

The parser PASS packet MUST be canonical ASCII JSON with final LF and this exact keyset only:

```text
schema
status
error_code
bundle_sha256_match
bundle_schema_match
bundle_terminal_closed
artifacts_cardinality
selected_index
selected_role_match
selected_role_cardinality
selected_metadata_match
segment_count
decoded_bytes
decoded_lf
decoded_cr
decoded_final_lf
decoded_sha256
decoded_git_blob_match
raw_bundle_model_output
payload_semantic_exposure
private_body_exposure
```

Required PASS values:

```text
schema: cocolon.v16.work_ultra.bundle_safe_packet.v1
status: PASS
error_code: null
bundle_sha256_match: true
bundle_schema_match: true
bundle_terminal_closed: true
artifacts_cardinality: 2
selected_index: 0
selected_role_match: true
selected_role_cardinality: 1
selected_metadata_match: true
segment_count: 14
decoded_bytes: 42008
decoded_lf: 735
decoded_cr: 0
decoded_final_lf: true
decoded_sha256: f785c5784d31221bdc5f3cbeebc5657899ab02b9f8d9a97ccdef6f9a77682e30
decoded_git_blob_match: true
raw_bundle_model_output: false
payload_semantic_exposure: false
private_body_exposure: false
```

No path, segment, base64 text, decoded byte, specification identity, failure-return payload, exception text, traceback, or free-text detail may appear in the safe packet.

### 8.2 STOP safe-packet contract

The STOP packet uses the same exact keyset, `status: STOP`, only one closed error code, zero/default result fields, and all exposure flags false. Allowed error codes are frozen in the companion parser. Karen may read the closed error code but not any raw failure detail.

### 8.3 Decoded authority channel

The decoded earlier authority file:

- is created only on PASS;
- is mode `0600`;
- has exact bytes `42008`;
- has SHA-256 `f785c5784d31221bdc5f3cbeebc5657899ab02b9f8d9a97ccdef6f9a77682e30`;
- has LF / CR / final LF `735 / 0 / true`;
- has Git blob `d30c422f735e3c2923b9b83a11a22769e85d5dbb`;
- is read by Karen exact1 only after safe-packet PASS;
- is never delegated, uploaded, attached, published, or reused after this authority closes.

### 8.4 Parser design evidence

Before authority freeze, GPT-5.6 Pro verified:

- Python syntax compilation: PASS;
- synthetic wrong-bundle negative execution: exit `2`;
- synthetic parser stdout bytes: `0`;
- synthetic parser stderr bytes: `0`;
- synthetic decoded-authority file creation: `false`;
- synthetic safe packet error code: `BUNDLE_FILE_IDENTITY_MISMATCH`;
- actual durable bundle execution: `NOT_RUN_BY_DESIGN`.

These checks establish fail-closed parser shape only. They do not establish that the actual frozen bundle passes and grant no technical credit.

## 9. Successor contract

The candidate in Step 11 SHALL:

- remain inactive, single-use, and separately Mash-approval-required;
- preserve the decoded earlier predecessor's technical scope, exact frozen identities, forbidden boundaries, no-reuse boundary, and zero-credit state;
- make Karen the sole control-plane semantic reader;
- make every delegated review packet body-free and payload-free;
- prohibit manager, supervisor, reviewer, subagent, and child-task authority-body reads;
- prevent raw bundle, base64 segments, decoded authority bytes, and frozen technical payload from entering delegated prompts;
- require `WORK_ULTRA_REQUIRED` for the later independent substantive review exact4 execution;
- preserve independent substantive reviewer cardinality exact4 without replacing it with repeated Karen self-review;
- authorize no technical execution under this recovery authority;
- record `automatic_progression=false`.

The successor may change only control-plane clauses needed to bind the recovered earlier scope to the safe Work Ultra review execution boundary. It SHALL NOT alter Inspector logic, frozen specification bytes, source bytes, QA criteria, technical acceptance, review verdict rules, or publication semantics.

## 10. Prohibited effects

This authority SHALL NOT:

- reuse, reactivate, retry, amend, or reconsume any consumed predecessor;
- use Chat to perform the filesystem-isolated bundle recovery;
- use a GitHub content-returning connector or Files tool to fetch the raw bundle body;
- display, log, quote, summarize, inspect, search, grep, or transmit raw bundle JSON or opaque base64 segments;
- run the parser more than once;
- change, regenerate, normalize, or patch the approved parser;
- treat a parser STOP packet, missing safe packet, nonempty stdout/stderr, or unexpected file as recoverable within the same authority;
- read the decoded authority before safe-packet PASS;
- fetch or semantically read frozen Inspector, specification, source, failure-return, private body, or technical payload;
- run Inspector V2, Stage A, Stage B, publication QA, substantive review exact4, merge, technical publication, or technical postpublication verification;
- execute tests, harnesses, Product Read, G1/G2 entry-conformance, or Cycle 001 acceptance work;
- modify production source, test, fixture, sample, schema, manifest, runtime, API, DB, RN, public route, or mashos-api;
- grant technical credit;
- advance or accept Cycle 001;
- activate the successor;
- overwrite or delete historical or partial artifacts;
- retry branch publication or use fallback transport;
- progress automatically.

## 11. Atomic Git publication state machine

### 11.1 Authorized target paths

All paths are under:

```text
EmlisAIの実装済み資料/documents/V16_WorkUltraFilesystemIsolatedRecovery_20260808/
```

A — this recovery authority:

```text
v16_work_ultra_filesystem_isolated_bundle_safe_packet_frozen_successor_recovery_authority_v1.md
```

P — frozen companion parser:

```text
v16_work_ultra_filesystem_isolated_bundle_safe_packet_parser_v1.py
```

S — inactive Ultra successor:

```text
v16_inspector_v2_bundle_refetch_frozen_reuse_publication_qa_preexec_review_ultra_authority_v1.md
```

R — success receipt with `PENDING_SELF_EXTERNAL_POSTVERIFICATION`:

```text
v16_work_ultra_filesystem_isolated_bundle_safe_packet_frozen_successor_recovery_receipt_v1.md
```

F0 — pre-successor STOP receipt:

```text
v16_work_ultra_filesystem_isolated_bundle_safe_packet_frozen_successor_recovery_presuccessor_stop_receipt_v1.md
```

F1 — post-successor STOP receipt:

```text
v16_work_ultra_filesystem_isolated_bundle_safe_packet_frozen_successor_recovery_postsuccessor_stop_receipt_v1.md
```

All exact6 target paths MUST be absent at publication preflight. Only one terminal set may be selected:

```text
SUCCESS: A + P + S + R exact4
P0 STOP: A + P + F0 exact3
P1 STOP: A + P + S + F1 exact4
```

R, F0, and F1 are mutually exclusive.

### 11.2 Publication base

After the execution result and terminal set are final, fresh-fetch publication base `H_pub`. It must equal the accepted entry head or be its proven descendant with no intervening change to protected inputs or exact6 targets. Probe all exact6 targets at `H_pub` and require all absent.

If head, ancestry, changed paths, or target absence is unknown, STOP with branch writes exact0. If a protected or target path changed, STOP with branch writes exact0. Do not read or overwrite a preexisting target.

### 11.3 One atomic branch mutation

For the selected terminal set only:

1. create one Git blob per selected frozen local file;
2. verify every returned Git blob identity against the local exact bytes;
3. create one tree from `H_pub`'s exact tree with the selected new paths only;
4. create one commit whose only parent is `H_pub`;
5. fresh-fetch `main` immediately before ref update and require it to equal `H_pub`;
6. attempt one non-force ref update to the new commit;
7. do not retry or use another transport.

Git blob, tree, or commit objects created before a failed ref update are not branch-visible project accumulation and SHALL NOT be reported as publication.

### 11.4 Postpublication verification

After a successful ref update:

- fetch commit metadata exact1;
- prove the commit's first parent is `H_pub`;
- fetch every selected remote path metadata and verify Git blob and byte count;
- compare `H_pub` to final head and require the exact selected changed-path union and exactly one commit;
- require final Cocolon head to equal the created commit;
- require final mashos-api head to remain `65284fef36936d7091262e758e0cc9282909601b`.

If any required observation is mismatched or unknown after a branch-visible commit, keep all artifacts unchanged, classify the exact postverification STOP, and do not create another receipt, overwrite, delete, retry, activate, or credit.

### 11.5 Terminal branches

#### SUCCESS

Success requires safe-packet PASS, decoded authority identity PASS, earlier receipt PASS, successor freeze PASS, and atomic publication of A + P + S + R exact4.

Terminal:

```text
WORK_ULTRA_FILESYSTEM_ISOLATION_PASS
BUNDLE_SAFE_PACKET_PASS
EARLIER_AUTHORITY_RECOVERED_EXACT1
CONTROL_PLANE_RECOVERY_SUCCESSOR_FROZEN
CURRENT_AUTHORITY_CLOSED_CONSUMED
ALL_PREDECESSORS_REMAIN_CLOSED_CONSUMED_STOP
TECHNICAL_CREDIT_EXACT0
CYCLE001_NOT_ACCEPTED
ULTRA_SUCCESSOR_SEPARATE_APPROVAL_REQUIRED
AUTOMATIC_PROGRESSION_FALSE
```

#### P0 STOP

Any failure before successor freeze selects A + P + F0 exact3, provided publication preflight is safe. Successor creation and activation remain exact0.

Expected durable terminal:

```text
WORK_ULTRA_FILESYSTEM_RECOVERY_PRESUCCESSOR_STOP_DURABLE
```

#### P1 STOP

Any failure after successor freeze but before successful final publication/postverification selects A + P + S + F1 exact4 if no branch-visible commit has yet occurred and preflight is safe. S remains inactive, unapproved, noncredit, and prohibited from execution.

Expected durable terminal:

```text
WORK_ULTRA_FILESYSTEM_RECOVERY_POSTSUCCESSOR_STOP_DURABLE
```

If the one ref update is failed or unknown, no second ref update is permitted. Record the branch-visible state exactly and return the corresponding durability-unknown terminal.

## 12. Success conditions

This authority succeeds only when all of the following are true:

1. effective same-message Mash Work Ultra UI attestation and exact-hash approval;
2. exact approval package authority and parser identities pass before activation;
3. current heads and protected lineage pass;
4. immediate consumed authority and receipt remain byte-exact and `CLOSED_CONSUMED_STOP`;
5. new clean Work checkout and raw bundle extraction satisfy the filesystem isolation contract;
6. parser stdout and stderr are exact0 bytes;
7. safe packet has the exact PASS keyset and values in Section 8;
8. raw bundle and opaque segments have model-readable exposure exact0;
9. decoded earlier authority exact identity passes and Karen reads it exact1 only;
10. earlier durable STOP receipt exact identity passes and Karen reads it exact1;
11. frozen technical payload semantic read remains exact0;
12. one successor is semantically inspected exact1, frozen once, inactive, and separately approval-required;
13. successor postfreeze semantic reread is exact0;
14. A + P + S + R are atomically published in exact1 branch commit with exact4 changed paths;
15. fresh final postverification passes;
16. technical execution, technical credit, successor activation, mashos-api change, and Cycle 001 advancement remain exact0.

## 13. STOP conditions

STOP immediately on any of the following:

- ineffective Work Ultra attestation;
- authority or parser source-set identity mismatch;
- head, ancestry, protected-path, or target-path mismatch or uncertainty;
- immediate consumed authority or receipt mismatch;
- filesystem isolation capability absent or uncertain;
- reused checkout, cache, retained runtime, or Chat container;
- raw bundle content or opaque segments entering any model-readable result;
- raw bundle extraction through a prohibited tool or command;
- parser source modification or second execution;
- nonempty parser stdout or stderr;
- missing, malformed, expanded, or mismatched safe packet;
- decoded authority file existing on parser STOP;
- decoded authority identity mismatch;
- earlier STOP receipt mismatch;
- any technical payload, private body, or failure-return payload exposure;
- any delegated authority-body or payload read;
- any postfreeze successor reread or mutation;
- independent substantive review exact4 no longer preserved;
- any Inspector, QA, review, test, Product Read, source, API, DB, RN, or Cycle execution;
- selected publication path union or commit cardinality mismatch;
- branch ref drift before update;
- remote postimage, commit parent, changed paths, final head, or mashos-api head mismatch or uncertainty.

No STOP permits automatic retry, fallback transport, current-authority reuse, successor activation, or technical credit.

## 14. Completion boundary

Completion of this authority means only that:

- the raw bundle was recovered through an isolated Work Ultra filesystem boundary;
- only a body-free safe packet and the exact earlier authority reached Karen;
- one inactive Ultra successor was frozen and durably published; or
- the exact bounded STOP branch was durably recorded.

It does not mean:

- Inspector V2 passed or failed;
- frozen technical material was judged;
- publication QA occurred;
- independent substantive review exact4 occurred;
- technical publication or merge occurred;
- G1/G2 entry-conformance began;
- Cycle 001 progressed or was accepted.

On success, the only next candidate is the separately approved inactive successor identified in Section 9. No automatic progression is permitted.
