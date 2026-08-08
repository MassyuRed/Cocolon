# Cocolon EmlisAI NLS v3 Cycle 001
## Mash UI-Attested Chat 5.6 Pro Control-Plane Recovery Pre-Successor STOP Receipt V1

receipt_id: SEPARATE_MASH_UI_ATTESTED_CHAT_5_6_PRO_CONTROL_PLANE_RECOVERY_PRESUCCESSOR_STOP_RECEIPT_V1
receipt_status: CLOSED_CONSUMED_STOP
body_free: true
automatic_progression: false

source_authority_id: SEPARATE_MASH_UI_ATTESTED_CHAT_5_6_PRO_CONTROL_PLANE_RECOVERY_AUTHORITY_V1
source_authority_sha256: b302a65ef9edaaefbed01bc3f29105f2c0e141755e16f2dc7bc1b4ed555361d4
source_authority_bytes: 26793
approval: MASH_APPROVED_SINGLE_USE_WITH_SAME_MESSAGE_UI_ATTESTATION
authority_activation: EXACT1
authority_consumption: EXACT1_CLOSED

closed_at_utc: 2026-08-08T06:53:32Z
closed_at_jst: 2026-08-08T15:53:32+0900

## 1. Terminal result

terminal_result: BUNDLE_SAFE_PACKET_OUTPUT_BOUNDARY_VIOLATION_STOP
publication_state: P0_PRE_SUCCESSOR
expected_durable_terminal_after_external_verification: PRE_SUCCESSOR_STOP_DURABLE
successor_authority_creation: exact0
successor_authority_activation: exact0
technical_credit: EXACT0
Cycle_001_state: NOT_ACCEPTED

The required same-message Mash UI attestation was present and effective. The current authority identity passed, so activation and consumption occurred exactly once.

The execution then stopped at Section 4 Step 5. The GitHub bundle transport returned the raw durable STOP bundle JSON directly to Karen, including opaque `content_b64_segments`, instead of returning only the Section 6 body-free safe packet. This violates the parser-output boundary even though no segment was concatenated, base64-decoded, or technically interpreted.

## 2. Entry and predecessor verification

Cocolon pinned baseline / H_entry:
8c14ee7ee6e35c197a35722eb453e9d448692390

mashos-api pinned and observed head:
65284fef36936d7091262e758e0cc9282909601b

Immediate consumed authority:

- expected SHA-256: 51d696f5d97522a7bdb04a31211c3e92f035d00b87aa126504fe82137e945c73
- expected bytes: 9819
- local verified Git blob: 96a065c59246097fc6b4ba4769a0da9d7d7b0238
- remote Git blob: 96a065c59246097fc6b4ba4769a0da9d7d7b0238
- semantic read by Karen: exact1
- state confirmed from body: CLOSED_CONSUMED_STOP

Immediate STOP receipt:

- expected SHA-256: c16d9c7444c37673fa8c47ec9d0b15eb46317bab7c6a42cefe5dd317f522f3d8
- expected bytes: 4892
- local verified Git blob: 535321141246468894240e435dbc830f28880217
- remote Git blob: 535321141246468894240e435dbc830f28880217
- semantic read by Karen: exact1
- state confirmed from body: CLOSED_CONSUMED_STOP

Earlier durable STOP bundle:

- expected SHA-256: 8398dc837ed78a1183a5dbb4699737de366bb8650ef803748c810ec0b7fdfbff
- remote Git blob: 0a52c48ba09969543aab46a092bb99a7e4adffcf
- remote bytes: 129363
- raw bundle fetch: exact1
- raw bundle JSON returned directly to Karen: true
- raw bundle included opaque content segment fields: true
- Section 6 safe-packet-only return: false
- bundle SHA-256 verification: NOT_COMPLETED_DUE_TO_OUTPUT_BOUNDARY_STOP
- artifacts[0] selection: exact0 after STOP
- segment concatenation: exact0
- base64 decode: exact0
- decoded earlier-authority SHA-256 verification: exact0
- decoded earlier-authority semantic read: exact0

Durable earlier STOP receipt:

- fetch: exact0 after STOP
- semantic read: exact0

## 3. Exposure and read accounting

Mash same-message UI attestation read by Karen: exact1
current authority identity verification: exact1
current authority semantic read by Karen: exact1
immediate consumed authority semantic read by Karen: exact1
immediate STOP receipt semantic read by Karen: exact1
raw durable STOP bundle transport return to Karen: exact1
Section 6 body-free safe packet returned: exact0
opaque content_b64_segments reached Karen context: true
opaque content_b64_segments decoded: false
frozen technical payload semantic read: exact0
private body exposure: false
failure-return private payload exposure: false
decoded earlier consumed authority semantic read: exact0
durable earlier STOP receipt semantic read: exact0
successor candidate semantic construction or inspection: exact0
manager authority-body read: exact0
supervisor authority-body read: exact0
reviewer authority-body read: exact0
subagent authority-body read: exact0
child-task authority-body read: exact0
delegated payload read: exact0

The raw bundle is a public-safe preservation artifact, so this event is not classified as a private-body leak. It is a control-plane output-contract violation: the opaque segment fields entered Karen context when the authority required them to remain tool-only and required only the safe packet to be returned.

## 4. Bounded P0 durability preflight

publication_base_head H0:
8c14ee7ee6e35c197a35722eb453e9d448692390

H_entry_to_H0_compare: equal
protected-path intervening change: exact0
authorized target probes at H0: exact5
A target state at H0: absent
S target state at H0: absent
R target state at H0: absent
F0 target state at H0: absent
F1 target state at H0: absent

Approved authority A publication:

- path: EmlisAIの実装済み資料/documents/V16_ModelAttestedControlPlaneRecovery_20260808/v16_mash_ui_attested_chat_5_6_pro_control_plane_recovery_authority_v1.md
- approved SHA-256: b302a65ef9edaaefbed01bc3f29105f2c0e141755e16f2dc7bc1b4ed555361d4
- bytes: 26793
- Git blob: 7b74ac8971c10a766237cc8f1c8c5073f0af6335
- commit: 9d6e0bc20be08b433d7ce56b9277c3c4a6b7cd76
- required first parent: 8c14ee7ee6e35c197a35722eb453e9d448692390
- remote postimage Git blob: 7b74ac8971c10a766237cc8f1c8c5073f0af6335
- remote postimage bytes: 26793
- postimage verification: PASS

This receipt path is F0:

EmlisAIの実装済み資料/documents/V16_ModelAttestedControlPlaneRecovery_20260808/v16_mash_ui_attested_chat_5_6_pro_control_plane_recovery_presuccessor_stop_receipt_v1.md

The F0 connector commit, first parent, remote postimage, exact changed-path union, and final heads are self-external facts and SHALL be established by fresh postpublication verification. No successor path may be created under this consumed authority.

## 5. Exact zero-effects

Inspector V2 execution: exact0
Stage A execution: exact0
Stage B execution: exact0
publication QA execution: exact0
independent substantive review exact4 execution: exact0
technical merge or publication: exact0
Product Read: exact0
G1 / G2 entry-conformance audit: exact0
source change: exact0
test change: exact0
fixture change: exact0
sample change: exact0
schema change: exact0
manifest change: exact0
runtime change: exact0
API change: exact0
DB change: exact0
RN change: exact0
public route change: exact0
mashos-api changed paths: exact0
technical credit: EXACT0
Cycle 001 advancement: exact0
Ultra successor creation: exact0
Ultra successor activation: exact0
automatic retry: exact0
automatic progression: false

## 6. Non-reuse and next safe boundary

The immediate predecessor and earlier predecessor remain CLOSED_CONSUMED_STOP. The raw bundle fetch and the opaque segment exposure SHALL NOT be reclassified as the required safe packet, successful predecessor recovery, technical evidence, or credit.

The next recovery authority must use a transport and execution boundary that can fetch and parse the bundle without returning raw bundle content or `content_b64_segments` to Karen. It must preserve all consumed-authority, no-reuse, zero-credit, and no-automatic-progression boundaries. It must not reuse this consumed authority or treat the current opaque exposure as successful decoding.
