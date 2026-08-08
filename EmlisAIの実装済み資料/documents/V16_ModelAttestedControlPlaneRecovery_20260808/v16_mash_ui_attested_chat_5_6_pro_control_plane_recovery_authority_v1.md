# Cocolon EmlisAI NLS v3 Cycle 001
## Separate Mash UI-Attested Chat 5.6 Pro Control-Plane Recovery Authority V1

authority_id: SEPARATE_MASH_UI_ATTESTED_CHAT_5_6_PRO_CONTROL_PLANE_RECOVERY_AUTHORITY_V1
authority_status: FROZEN_APPROVAL_REQUIRED
approval_action: ATTEST_ACTIVE_CHATGPT_UI_MODEL_AND_ENVIRONMENT_THEN_APPROVE_EXACT_SHA256_AND_CONSUME_ONCE
single_use: true
automatic_progression: false
required_runtime_model: GPT-5.6 Pro
required_execution_environment: Chat
required_model_evidence: MASH_EXPLICIT_SAME_MESSAGE_UI_ATTESTATION
authorizes_technical_execution: false
authorizes_downstream_review_execution: false
authorizes_source_or_test_change: false
body_free: true

## 1. Purpose and necessity

This authority recovers from the preactivation model-gate STOP of the consumed immediate predecessor. It corrects exactly two inseparable control-plane defects and nothing technical:

1. model-selection evidence: the execution context did not expose an exact runtime model identity to Karen, so Mash's explicit same-message attestation that the active ChatGPT UI shows GPT-5.6 Pro in Chat becomes the accepted bounded evidence;
2. connector transport: publication uses one additive file per connector commit, so every irreversible serial-publication boundary and partial STOP state is defined instead of pretending that three files publish atomically.

This is not a renamed retry. The immediate predecessor closed before activation, before predecessor recovery, and before frozen-reference recovery. This authority changes the missing evidence source and the publication state machine that the independent static audit found necessary. It preserves the same nontechnical goal: freeze one inactive Ultra successor without judging or executing frozen technical material.

New information obtained on success:

- whether Mash made the required current-session UI attestation;
- whether the immediate consumed authority and STOP receipt remain byte-exact and closed;
- whether the earlier consumed predecessor is deterministically recoverable from the pinned public bundle member;
- whether one inactive Ultra successor can be frozen and serially published with complete read and partial-publication accounting.

What becomes possible after success:

- Mash may separately approve the Ultra successor for the still-unexecuted independent substantive review exact4 lane.

This authority does not perform Inspector V2, publication QA, review4, Product Read, or Cycle 001 acceptance work.

## 2. Preapproval attestation boundary

The approval message MUST contain all four meanings below in the same message:

1. Mash is viewing the active ChatGPT UI for the session in which execution will occur;
2. the UI shows GPT-5.6 Pro;
3. the environment is Chat rather than Work;
4. Mash approves this exact authority SHA-256 for single use.

If any meaning is missing, ambiguous, prior-session-only, or contradicted by the observed context:

- approval_effective: false;
- activation: exact0;
- consumption: exact0;
- GitHub write: exact0;
- STOP receipt: exact0;
- result: APPROVAL_NOT_EFFECTIVE_CURRENT_UI_ATTESTATION_REQUIRED.

This preapproval rejection is not an authority STOP and does not consume the single-use authority. Karen SHALL return only the missing attestation requirement.

A plan name, account tier, remembered model, prior-session model, user-agent string, shell environment variable, or Karen self-assertion is insufficient. Mash UI attestation SHALL be recorded as Mash UI attestation and SHALL NOT be relabelled as backend, cryptographic, or platform runtime proof.

## 3. Pinned entry state

Cocolon pinned baseline head:
8c14ee7ee6e35c197a35722eb453e9d448692390

mashos-api current head:
65284fef36936d7091262e758e0cc9282909601b

Immediate consumed authority:

- id: SEPARATE_CONTROL_PLANE_READ_ACCOUNTING_AND_MODEL_GATE_CORRECTED_FROZEN_REUSE_AUTHORITY_V1
- SHA-256: 51d696f5d97522a7bdb04a31211c3e92f035d00b87aa126504fe82137e945c73
- bytes: 9819
- state: CLOSED_CONSUMED_STOP
- path: EmlisAIの実装済み資料/documents/V16_ControlPlaneCorrection_20260808/v16_control_plane_read_accounting_model_gate_corrected_frozen_reuse_authority_v1.md

Immediate STOP receipt:

- SHA-256: c16d9c7444c37673fa8c47ec9d0b15eb46317bab7c6a42cefe5dd317f522f3d8
- bytes: 4892
- path: EmlisAIの実装済み資料/documents/V16_ControlPlaneCorrection_20260808/v16_control_plane_read_accounting_model_gate_corrected_frozen_reuse_stop_receipt_v1.md

Earlier consumed predecessor authority:

- id: V16_INSPECTOR_V2_BUNDLE_REFETCH_FROZEN_REUSE_PUBLICATION_QA_PREEXEC_REVIEW_AUTHORITY_V1
- SHA-256: f785c5784d31221bdc5f3cbeebc5657899ab02b9f8d9a97ccdef6f9a77682e30
- bytes: 42008
- state: CLOSED_CONSUMED_STOP

Durable earlier STOP bundle:

- SHA-256: 8398dc837ed78a1183a5dbb4699737de366bb8650ef803748c810ec0b7fdfbff
- path: EmlisAIの実装済み資料/documents/V16_Standalone_Preparation_CommandTransport_Stop_20260806/v16_inspector_v2_bundle_refetch_stop_bundle_v1.json

Deterministic earlier-authority bundle locator:

- JSON member: $.artifacts[0]
- artifacts array cardinality: exact2
- selected role: approved_successor_authority
- selected role cardinality: exact1
- member SHA-256: f785c5784d31221bdc5f3cbeebc5657899ab02b9f8d9a97ccdef6f9a77682e30
- member bytes: 42008
- member LF: 735
- member CR: 0
- member final LF: true
- member mode: 0644
- member git blob: d30c422f735e3c2923b9b83a11a22769e85d5dbb
- content encoding: base64_ascii_segments_concat_exact_order
- segment chars: 4096
- segment count: exact14

Durable earlier STOP receipt:

- SHA-256: 5b99ca7e52e614e4f90f9958cbc60fdee0e92320f0f66fe02546c8befbf8b55a
- path: EmlisAIの実装済み資料/documents/V16_Standalone_Preparation_CommandTransport_Stop_20260806/v16_inspector_v2_bundle_refetch_stop_receipt_v1.md

Cycle 001 state: NOT_ACCEPTED
Technical credit: EXACT0

## 4. Activation and gate order

The order is mandatory and non-circular:

0. inspect the approval message only for the Section 2 attestation meanings; if insufficient, apply the preapproval exact0 boundary and end;
1. locate the frozen current authority bytes by exact filename and verify byte count and SHA-256 without semantic reading. If exact source identity cannot be proven, approval activation is not established: activation exact0, consumption exact0, GitHub write exact0, and result APPROVED_SOURCE_IDENTITY_NOT_PROVEN_NO_CONSUMPTION. Only after identity passes does Karen read the current authority body exact1; that semantic read is ACTIVATION_EXACT1 and CONSUMPTION_EXACT1;
2. fetch the current Cocolon entry-observation head H_entry and mashos-api head; require the mashos-api head to equal its pin, and require H_entry to equal the pinned Cocolon baseline or be its proven descendant with no change to the four pinned Cocolon input paths or five authorized target paths defined in Section 8;
3. fetch, hash, and Karen-read the immediate consumed authority exact1;
4. fetch, hash, and Karen-read the immediate STOP receipt exact1;
5. fetch and hash the durable earlier STOP bundle, parse only the allowlisted fields in Section 6, recover $.artifacts[0], decode its exact14 segments tool-only, verify its fixed bytes and SHA-256, then Karen reads the decoded earlier authority exact1;
6. fetch, hash, and Karen-read the durable earlier STOP receipt exact1;
7. recover only immutable frozen-reference identities from Karen's exact1 reading of the decoded earlier authority; do not fetch or read any referenced frozen payload, and keep frozen technical payload semantic read exact0;
8. construct one successor candidate, Karen semantically inspects it exact1, freeze its bytes, then perform tool-only byte/hash verification with semantic reread exact0;
9. fetch candidate publication base H0, compare H_entry to H0, verify that any intervening changes touch none of the four pinned Cocolon input paths or five authorized target paths, probe all five authorized target paths at H0, and enter the serial publication state machine in Section 8 only if the preflight is proven safe.

Any failure after the successful Step 1 semantic read and activation consumes this authority and enters a postactivation STOP state. No later gate may be evaluated after a failure except the bounded durability action and verification explicitly permitted by Section 8.

## 5. Read and operation accounting

### 5.1 Success-path semantic counts

- Mash same-message UI attestation read by Karen: exact1;
- current authority body read by Karen: exact1;
- immediate consumed authority body read by Karen: exact1;
- immediate STOP receipt read by Karen: exact1;
- decoded earlier consumed authority body read by Karen: exact1;
- durable earlier STOP receipt read by Karen: exact1;
- successor candidate semantic construction/inspection by Karen: exact1;
- frozen successor postimage semantic reread: exact0;
- durable earlier STOP bundle payload semantic read: exact0;
- frozen technical payload semantic read: exact0;
- private material semantic read: exact0;
- manager, supervisor, reviewer, subagent, and child-task authority-body read: exact0;
- delegated payload read: exact0.

### 5.2 Success-path tool-only exact counts

- current authority byte fetch / SHA-256 verification: exact1 / exact1;
- entry Cocolon head fetch / mashos-api head fetch: exact1 / exact1;
- pinned-baseline-to-H_entry compare: exact1;
- immediate authority fetch / SHA-256 verification: exact1 / exact1;
- immediate receipt fetch / SHA-256 verification: exact1 / exact1;
- earlier STOP bundle fetch / SHA-256 verification / JSON parse: exact1 / exact1 / exact1;
- artifacts[0] selector / role-cardinality check: exact1 / exact1;
- segment concatenation / base64 decode / decoded-byte SHA-256 verification: exact1 / exact1 / exact1;
- earlier STOP receipt fetch / SHA-256 verification: exact1 / exact1;
- successor prefreeze byte-hash operation / frozen-byte hash verification: exact1 / exact1;
- publication-base head fetch: exact1;
- H_entry-to-publication-base compare: exact1;
- authorized target preexistence probes at publication base H0: exact5;
- branch-head fetch immediately before each attempted connector write: exact1 per attempted write;
- connector write attempts on success: exact3;
- connector commit-metadata fetch / first-parent verification on success: exact3 / exact3;
- remote postimage fetch / SHA-256 verification on success: exact6 / exact6, consisting of A exact1 after its write, S exact1 after its write, R exact1 after its write, and A + S + R exact3 at final verification;
- publication-base-to-final compare: exact1;
- final Cocolon head fetch / final mashos-api head fetch: exact1 / exact1;
- automatic retry: exact0;
- fallback transport: exact0.

### 5.3 Failure and uncertainty accounting

On any postactivation failure, every performed count SHALL be recorded at its actual value. No count may exceed its Section 5.1 or 5.2 success maximum except:

- one unknown-result resolution fetch is allowed for the exact uncertain branch head and target path;
- one bounded STOP-receipt connector write, together with its single required prewrite-head fetch and, if a commit is returned, its single commit-metadata/first-parent and postimage verification, may be attempted when its state-specific path is absent and the state table permits it.

Retrying the failed operation, changing transport, recreating bytes, or performing a second unknown-result resolution is prohibited. A failed or unknown STOP-receipt write remains an explicit durability-unknown terminal; it SHALL NOT trigger another write.

## 6. Tool-only bundle allowlist and safe packet

The bundle parser MAY inspect only:

- $.schema;
- $.status;
- $.selected_branch;
- $.authority_lifecycle.authority_id;
- $.authority_lifecycle.approved_sha256;
- $.authority_lifecycle.activation;
- $.authority_lifecycle.consumption;
- $.authority_lifecycle.terminal;
- $.authority_lifecycle.normal_progression;
- $.authority_lifecycle.automatic_retry;
- $.authority_lifecycle.automatic_progression;
- $.model_gate.required_label;
- $.model_gate.actual_identity_confirmed;
- $.model_gate.disposition;
- $.artifacts length;
- $.artifacts[*].role;
- $.artifacts[0].intended_public_path_json;
- $.artifacts[0].bytes;
- $.artifacts[0].lf;
- $.artifacts[0].cr;
- $.artifacts[0].final_lf;
- $.artifacts[0].mode;
- $.artifacts[0].sha256;
- $.artifacts[0].git_blob;
- $.artifacts[0].content_encoding;
- $.artifacts[0].segment_chars;
- $.artifacts[0].content_b64_segments length;
- $.artifacts[0].content_b64_segments only as opaque tool input for concatenation and decode.

The parser SHALL return to Karen only this body-free schema:

```text
bundle_sha256_match: boolean
bundle_schema_match: boolean
bundle_terminal_closed: boolean
artifacts_cardinality: integer
selected_index: integer
selected_role_match: boolean
selected_role_cardinality: integer
selected_metadata_match: boolean
segment_count: integer
decoded_bytes: integer
decoded_lf: integer
decoded_cr: integer
decoded_final_lf: boolean
decoded_sha256: lowercase_hex64
decoded_git_blob_match: boolean
payload_semantic_exposure: false
private_body_exposure: false
```

The parser SHALL NOT return content segments, decoded earlier-authority bytes, frozen specification content, failure-return content, private body, technical payload strings, or allowlist-external fields. The exact decoded earlier-authority bytes may be delivered once only to Karen through a separate direct exact-byte channel for the Section 4 Step 5 semantic read; they SHALL NOT be sent to a subagent or reviewer.

## 7. Successor contract

Exactly one candidate may be constructed with this id:

V16_INSPECTOR_V2_BUNDLE_REFETCH_FROZEN_REUSE_PUBLICATION_QA_PREEXEC_REVIEW_ULTRA_AUTHORITY_V1

It SHALL:

- remain inactive, single-use, and separately Mash-approval-required;
- preserve the earlier predecessor's technical scope, frozen identities, forbidden boundaries, no-reuse boundary, and zero-credit state;
- make Karen the sole control-plane semantic reader;
- make every delegated review packet body-free and payload-free;
- prohibit manager, supervisor, reviewer, subagent, and child-task authority-body reads;
- require WORK_ULTRA_REQUIRED only for the later independent substantive review exact4 execution;
- authorize no technical execution under this recovery authority;
- record automatic_progression=false.

Karen semantic inspection of the complete candidate is exact1 before freeze. After freeze, candidate postimage inspection is tool-only byte/hash comparison and semantic read exact0. Any postfreeze semantic reread, modification, regeneration, or refreeze SHALL STOP before publication.

## 8. Serial connector publication state machine

Authorized paths:

A — recovery authority:
EmlisAIの実装済み資料/documents/V16_ModelAttestedControlPlaneRecovery_20260808/v16_mash_ui_attested_chat_5_6_pro_control_plane_recovery_authority_v1.md

S — inactive Ultra successor:
EmlisAIの実装済み資料/documents/V16_ModelAttestedControlPlaneRecovery_20260808/v16_inspector_v2_bundle_refetch_frozen_reuse_publication_qa_preexec_review_ultra_authority_v1.md

R — success receipt with state PENDING_SELF_EXTERNAL_POSTVERIFICATION:
EmlisAIの実装済み資料/documents/V16_ModelAttestedControlPlaneRecovery_20260808/v16_mash_ui_attested_chat_5_6_pro_control_plane_recovery_receipt_v1.md

F0 — pre-successor STOP receipt:
EmlisAIの実装済み資料/documents/V16_ModelAttestedControlPlaneRecovery_20260808/v16_mash_ui_attested_chat_5_6_pro_control_plane_recovery_presuccessor_stop_receipt_v1.md

F1 — post-successor partial-publication STOP receipt:
EmlisAIの実装済み資料/documents/V16_ModelAttestedControlPlaneRecovery_20260808/v16_mash_ui_attested_chat_5_6_pro_control_plane_recovery_postsuccessor_stop_receipt_v1.md

All five paths MUST be absent at Step 9 entry. Only one of R, F0, or F1 may ever be created.

### Preflight and immutable head lineage

Step 2 SHALL compare the pinned Cocolon baseline to H_entry exact1, and Step 9 SHALL fetch candidate publication base H0 and compare H_entry to H0 exact1. H_entry and H0 are accepted only along a proven descendant chain whose changed-path sets touch none of these exact4 pinned Cocolon inputs and none of A, S, R, F0, or F1:

- immediate consumed authority path in Section 3;
- immediate STOP receipt path in Section 3;
- durable earlier STOP bundle path in Section 3;
- durable earlier STOP receipt path in Section 3.

An unrelated intervening commit alone is not a blocker. If H_entry, H0, ancestry, or either changed-path set remains unknown, terminate PREFLIGHT_HEAD_OR_DIFF_UNKNOWN_STOP with connector writes exact0. If either descendant relation fails or an intervening change touches a pinned input or authorized target, terminate PREFLIGHT_PROTECTED_PATH_CONFLICT_STOP with connector writes exact0.

All five target probes SHALL be bound to H0. If any target is proven existing, terminate TARGET_PREEXISTENCE_CONFLICT_STOP with authority connector writes exact0. If any target probe fails or remains unknown, terminate TARGET_PREEXISTENCE_UNKNOWN_STOP with authority connector writes exact0. Record the observed head and target states; do not read, overwrite, delete, approve, activate, or credit a preexisting target. These are consumed postactivation terminals, but no repository artifact may be added because a safe receipt path has not been established.

On safe preflight, H0 becomes immutable publication_base_head. A separate fresh branch-head fetch immediately before A MUST equal H0. Each successful connector write SHALL return a commit id C_X; Karen SHALL fetch that commit metadata exact1, prove its first parent equals the required predecessor below, and fetch the written path at C_X for byte/hash verification. Before every attempted write, the fresh branch head MUST equal that required predecessor:

| Write | Required predecessor head |
|---|---|
| A | H0 |
| S | verified C_A |
| R | verified C_S |
| F0 | verified C_A |
| F1 | verified C_S |

If the required prewrite head fetch fails, remains unknown, or differs, do not attempt that write and terminate respectively as PRE_A_HEAD_NOT_PROVEN_STOP, PRE_S_HEAD_DRIFT_OR_UNKNOWN_STOP, PRE_R_HEAD_DRIFT_OR_UNKNOWN_STOP, PRE_F0_HEAD_DRIFT_OR_UNKNOWN_STOP, or PRE_F1_HEAD_DRIFT_OR_UNKNOWN_STOP. Preserve and record only already attributable artifacts: before A, authority connector paths/commits exact0; before S or F0, at most C_A/path exact1/exact1 with its verified or mismatch classification; before R or F1, at most C_A + C_S and their paths exact2/exact2 with their verified or mismatch classifications. No later write is permitted.

If a connector returns a commit whose identity or first parent cannot be proven, or whose first parent differs from the required predecessor, terminate CONNECTOR_COMMIT_IDENTITY_OR_PARENT_INVALID_X_STOP, where X is A, S, R, F0, or F1. Record actual known/unknown path and commit cardinalities and perform no later write. A STOP receipt is attempted only when the preceding C_A or C_S lineage required by the table is already verified.

### State P0 — no publication yet

If a postactivation gate in Section 4 Steps 2 through 8 fails before A is attempted, first perform the same bounded safe preflight defined above. The Step 2 Cocolon observation and pinned-baseline comparison SHALL be reused without refetch or repetition; if that Cocolon portion was not proven, take its exact0-write preflight terminal. Otherwise fetch H0 once, compare it to H_entry once, and probe the targets once. Only if that preflight proves a safe H0 and all five absent may Karen write A exact1, fresh-verify it, then write F0 exact1 and fresh-verify it. A failed or unknown bounded preflight takes its exact0-write preflight terminal. Preapproval rejection and Step 1 source-identity failure remain exact0-write boundaries and do not enter P0.

Expected durable state when both writes verify:

- paths: A + F0 exact2;
- connector commits: exact2;
- successor: exact0;
- terminal: PRE_SUCCESSOR_STOP_DURABLE.

If A is unknown, resolve A once. If A remains unknown, STOP with AUTHORITY_PUBLICATION_DURABILITY_UNKNOWN; actual A path/commit cardinality remains UNKNOWN_EXACT0_OR_EXACT1 and no further write is permitted. If A is proven absent, STOP with AUTHORITY_PUBLICATION_ABSENT after actual paths exact0 and commits exact0; no further write is permitted. If A exists but its bytes or hash mismatch, do not overwrite or retry; classify it UNTRUSTED_MISMATCHED_AUTHORITY_ARTIFACT. Create F0 exact1 only if C_A and its required first parent are already verified; otherwise terminate AUTHORITY_POSTIMAGE_MISMATCH_LINEAGE_UNPROVEN_STOP with no later write. A verified-lineage mismatch followed by F0 records AUTHORITY_POSTIMAGE_MISMATCH_PRESUCCESSOR_STOP and keeps successor exact0. If F0 is unknown, resolve F0 once. If F0 remains unknown, STOP with PRESUCCESSOR_STOP_RECEIPT_DURABILITY_UNKNOWN and no further write. If F0 is proven absent, STOP with PRESUCCESSOR_STOP_RECEIPT_ABSENT and no further write. If F0 exists but its bytes or hash mismatch, STOP with F0_POSTIMAGE_MISMATCH_STOP; do not overwrite, retry, or perform any further write. A verified F0 yields the state-specific exact path/commit cardinality stated above.

### State P1 — A verified, S absent

Create S exact1 and fresh-verify it. If S is proven absent, do not retry and create F0. If S exists but its bytes or hash mismatch, do not overwrite or retry; classify it UNTRUSTED_MISMATCHED_SUCCESSOR_ARTIFACT and prohibit approval, activation, execution, and credit. Create F1 only if C_S and its required first parent are already verified; otherwise terminate SUCCESSOR_POSTIMAGE_MISMATCH_LINEAGE_UNPROVEN_STOP with no receipt write. If S is unknown, resolve once. If still unknown, STOP with SUCCESSOR_PUBLICATION_DURABILITY_UNKNOWN and perform no receipt write.

### State P2 — A and S verified, R absent

If any failure occurs after S verifies but before R creation, create F1 exact1 and fresh-verify it.

Expected durable state when F1 verifies:

- paths: A + S + F1 exact3;
- connector commits: exact3;
- successor exists but remains inactive and unapproved;
- terminal: POST_SUCCESSOR_PARTIAL_PUBLICATION_STOP_DURABLE.

If F1 is unknown, resolve once. If F1 remains unknown, STOP with POSTSUCCESSOR_STOP_RECEIPT_DURABILITY_UNKNOWN and no further write. If F1 is proven absent, STOP with POSTSUCCESSOR_STOP_RECEIPT_ABSENT and no further write. If F1 exists but its bytes or hash mismatch, STOP with F1_POSTIMAGE_MISMATCH_STOP; do not overwrite, retry, or perform any further write.

### State P3 — success receipt publication

Only after A and S remote bytes and hashes verify, create R exact1 with state PENDING_SELF_EXTERNAL_POSTVERIFICATION. If R is proven absent, do not retry; create F1 exact1 and record SUCCESS_RECEIPT_ABSENT_POSTSUCCESSOR_STOP. If R exists but its bytes or hash mismatch, do not overwrite, retry, or create another receipt; record SUCCESS_RECEIPT_POSTIMAGE_MISMATCH_STOP with A + S + R exact3. If R is unknown, resolve once; if still unknown, record SUCCESS_RECEIPT_PUBLICATION_DURABILITY_UNKNOWN and perform no further write. Only when R and C_R lineage verify may Karen fresh-fetch A, S, and R and verify bytes, SHA-256 values, path union, exact3 serial connector commits from publication_base_head, final Cocolon head equal to C_R, and unchanged mashos-api head.

If final postverification passes:

- paths: A + S + R exact3;
- connector commits: exact3;
- terminal: CONTROL_PLANE_RECOVERY_SUCCESSOR_FROZEN;
- R's pending state is resolved by the external verified observation recorded in the execution result;
- successor remains inactive and separately approval-required.

If R is written and final postverification proves any byte, hash, path-union, commit-count, commit-lineage, Cocolon-head, or mashos-api-head mismatch:

- paths may be A + S + R exact3;
- successor remains inactive and unapproved;
- terminal: SUCCESS_RECEIPT_POSTVERIFICATION_MISMATCH_STOP;
- no overwrite, deletion, retry, additional receipt, activation, or credit is permitted.

If R is written but any required final observation remains unresolved or unknown:

- paths may be A + S + R exact3;
- successor remains inactive and unapproved;
- terminal: SUCCESS_RECEIPT_POSTVERIFICATION_UNKNOWN_STOP;
- no overwrite, deletion, retry, additional receipt, activation, or credit is permitted.

## 9. Prohibited effects

This authority SHALL NOT:

- treat Mash UI attestation as backend or cryptographic proof;
- activate on an ineffective approval;
- reuse, reactivate, retry, amend, or consume either consumed predecessor;
- regenerate, edit, normalize, rewrite, or replace frozen technical bytes;
- expose the bundle payload or decoded technical content outside Section 6;
- run Inspector V2, Stage A, Stage B, publication QA, review4, merge, technical publication, or postpublication technical verification;
- inspect private source or private body;
- execute tests, harnesses, runtime paths, Product Read, or Cycle 001 acceptance work;
- modify production source, test, fixture, sample, schema, manifest, runtime, API, DB, RN, or public route;
- grant technical credit;
- advance or accept Cycle 001;
- activate the Ultra successor;
- delete or overwrite any partial-publication artifact;
- progress automatically.

## 10. Success conditions and completion boundary

Success requires all of the following:

1. effective same-message Mash UI attestation and exact-hash approval;
2. activation and gate order exactly as Section 4;
3. all pinned identities and the deterministic bundle locator match;
4. all Section 5 semantic and tool-only success counts match;
5. Section 6 output packet is exact and exposure flags remain false;
6. the Ultra successor is frozen after Karen semantic inspection exact1, with postfreeze semantic read exact0;
7. A + S + R are the exact changed-path union and exact3 serial connector commits;
8. fresh final postverification passes;
9. technical execution, technical credit, successor activation, and Cycle 001 advancement remain exact0.

Terminal success state:

MASH_UI_ATTESTED_MODEL_GATE_ACCEPTED_FOR_BOUNDED_CONTROL_PLANE
SERIAL_PUBLICATION_POSTVERIFIED
CONTROL_PLANE_RECOVERY_SUCCESSOR_FROZEN
CURRENT_RECOVERY_AUTHORITY_CLOSED_CONSUMED
IMMEDIATE_PREDECESSOR_REMAINS_CLOSED_CONSUMED_STOP
EARLIER_PREDECESSOR_REMAINS_CLOSED_CONSUMED_STOP
TECHNICAL_CREDIT_EXACT0
CYCLE001_NOT_ACCEPTED
ULTRA_SUCCESSOR_SEPARATE_APPROVAL_REQUIRED
AUTOMATIC_PROGRESSION_FALSE

Completion means only that the UI-attested bounded model gate and serial-publication control plane are closed and one inactive Ultra successor is frozen. It does not mean Inspector V2 passed, the frozen material was technically judged, publication QA or review4 occurred, Cycle 001 progressed, or G1/G2 entry conformance began.
