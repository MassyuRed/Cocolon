---
doc_id: NLSv3_Step11_Cycle001_G5_GateA_RuntimeIdentityCompletion_ReadOnly_Addendum_20260809
title: "NLS v3 Step11 Cycle001 G5 Gate A runtime identity completion — read-only typed STOP"
date: "2026-08-09"
decision_owner: "Mash"
operation_owner: "Karen"
state: "RUNTIME_IDENTITY_INVALID_AT_DECLARED_DISCOVERY_SCOPE"
automatic_progression: false
body_free: true
---

# 1. Result

Mash explicitly approved one bounded G5 Gate A runtime identity-completion authority. The
authority permitted only read-only derivation of the manifest, frozen lock, runner projection,
and observation-chain identities. This authority is now closed and consumed at one typed
classification:

```text
state: RUNTIME_IDENTITY_INVALID_AT_DECLARED_DISCOVERY_SCOPE
typed_reason: FROZEN_RUNNER_PROJECTION_IDENTITY_MISMATCH_PACKAGING_26_2_EXPECTED_26_3_OBSERVED_STOP
persistence_class: SESSION_LOCAL
recovery_class: REMATERIALIZABLE_FROM_FROZEN_LOCK
instance_class: UNKNOWN
same_instance_continuity_credit: 0
runtime_readiness_observation_id: NOT_ESTABLISHED:GATE_A_ONLY_NO_VERSION_OR_ROLE_PROBE
continuity_observation_chain_identity: NOT_ESTABLISHED:NO_PRIOR_EVENT_INSTANCE_BINDING_OR_NO_REMATERIALIZATION_PROOF
automatic_progression: false
```

The declared candidate exists, but its current exact5 runner projection does not equal the
applicable frozen exact5 projection. The decisive mismatch is `packaging`: frozen `26.2`,
observed `26.3`. This is a direct same-selector element mismatch; it is not inferred from a
54-versus-5 cardinality comparison. The candidate is therefore invalid at the declared scope.

The prior G4 Receipt did not bind a materialization event, root manifest, runtime instance, or
no-rematerialization observation chain. The current instance remains `UNKNOWN` and continuity
credit remains0 independently of the projection mismatch. Matching an entrypoint, interpreter,
and pytest-control subset does not establish same-instance continuity.

# 2. Authority and lifecycle

```text
authority_id: G5_GATE_A_RUNTIME_IDENTITY_COMPLETION_READ_ONLY_20260809
approval_kind: MASH_EXPLICIT_SEPARATE_APPROVAL
approval_count: 1
activation_count: 1
consumption_count: 1
classification_count: 1
final_lifecycle: CLOSED_CONSUMED_TYPED_STOP
retry / reuse / reactivation: 0 / 0 / 0
automatic progression: false
```

This authority is distinct from both the historical G5 umbrella implementation authority
(`CLOSED_CONSUMED_PREEXECUTION_STOP`) and the historical failed Gate B version-probe authority
(`CLOSED_CONSUMED_INVALID`). The historical version-probe count remains1; this authority did
not retry, reuse, roll back, or reinterpret it.

# 3. Declared discovery scope and zero effects

```text
discovery_scope: DECLARED_PRIOR_G4_RUNTIME_ROOT_EXACT1
locator_strategy: DECLARED_LOCATOR_ONLY
candidate_policy: EXACT1_OR_TYPED_STOP
candidate_count: 1
global_locator_search_count: 0
relative_entrypoint: bin/pytest
custom_static_continuity_verifier_process_count: 0

current-authority pytest/version probe: 0 / 0
current-authority role probe/direct role load/public API call/role effect: 0 / 0 / 0 / 0
Gate C admission/target invocation/ordered exact24/full exact52/exact100: 0 / 0 / 0 / 0 / 0
runtime mutation/install/repair/rematerialization/acquisition: 0 / 0 / 0 / 0 / 0
Work-side artifact acquisition network/challenge/remote runtime observation: 0 / 0 / 0
retry/fallback/interpreter switch: 0 / 0 / 0
production/protected test/fixture/sample/mashos-api GitHub change: 0 / 0 / 0 / 0 / 0
raw protected/private product-or-test body read/export/publication: 0 / 0 / 0
G5 machine GREEN/G6 Product Read/Cycle001 acceptance: 0 / 0 / 0
```

Standard read-only filesystem metadata and hashing utilities were used directly. No Python,
pytest, repository role, target, helper, or authority-defined verifier program was launched.
GitHub source/identity reads and the publication of this public-safe checkpoint are GitHub
transport under the standing publication instruction; they are not Work-side artifact
acquisition network or runtime mutation.

# 4. Applicable frozen comparator

The current Gate A explicitly selects the existing tracked RecoveryEpoch004 runner comparator
as the frozen expected identity. G4 did not itself freeze this full identity. The selection is
anchored by these current GitHub-tracked owners:

| role | repository/path | Git blob SHA-1 | raw SHA-256 |
|---|---|---|---|
| frozen lock | `MassyuRed/mashos-api:ai/configs/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_lock_v1.json` | `0822fcb010985cd0d384f250a9e8a1fe16dc8fd4` | `9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787` |
| exact5 comparator Receipt | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch004_WorkTestRunnerRuntimeRematerializationAndFreshReadiness_BodyFree_Receipt_20260801.json` | `ce6cfe0217f3e28c88643f4a4f543e069a6b21c6` | `b80acc68e1d38c734c243031c7d4a13024057eac73f34ed5fe09db7ab945ebe2` |
| tracked procedure | `Cocolon_前提資料/13_cocolon_work_test_runner_runtime_continuity.md` | `ea7f96221846e5614431296e00ac481cc00e00a2` | `42fcd4d65b0d21b5e41659b6329c55c14ed42c0270838f13be6102b351db7ac9` |

```text
lock logical SHA-256: 801ba54efc0f6655238d14e7c153fb70b555801489aa8ba028515fc64d9c05f4
runner projection SHA-256: f501025c1dccef68c47c0a3e52f3ef74d01233f371b16f2b1a0bdfb21089e57e
ordered exact5:
  iniconfig==2.3.0
  packaging==26.2
  pluggy==1.6.0
  pygments==2.20.0
  pytest==8.4.1
Python target: CPYTHON 3.12.13 / linux-x86_64
historical exact5 distribution closure: 4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c
historical exact5 installed-file manifest: 0eba095e4c173b4b69f68532fd66cf2c871ab9edef64d91754b52ed7daee15c5
historical exact5 full-root manifest: e6fb3c42d88897cb5117d993449debe7efef3722f11e6c7e3aff541513120042
historical exact5 content identity: 549da432b1a46b111251fea0d2a822aa5c682012735b782847e22f8a3255ffbc
historical materialization event: 2cc41bd9d330bd8977e8bb95dbc03173a7b33e13030394fd6c974e8545a47c6b
historical instance observation: 695a5adf4134966c741491312d0b05887ee2f1da4571132dc06107010da55d80
historical continuity chain: 4d0b73a8f8c2779f53796db608f87208988d2baed0a015b08ddba46ab3f37fb9
```

Those manifest and instance values identify the historical rematerialized exact5 runtime. They
are not silently assigned to the current candidate and are not compared against a differently
specified manifest schema. The ordered exact5 selector and versions are the direct comparator
used for the current mismatch.

# 5. Current exact5 projection observation

The complete lossless canonical current projection observation is:

```text
RUNNER_PROJECTION_ACTUAL_V1
iniconfig==2.3.0
packaging==26.3
pluggy==1.6.0
pygments==2.20.0
pytest==8.4.1
```

```text
bytes: 106
LF: 6
CR: 0
final LF: true
SHA-256: 3f5f9311360002407b0030c1395bc3c4bb0bd44297a2bcc72f16893ee02886b4
expected identity matches: 4
version mismatches: 1
missing expected names: 0
```

The current root also contains 54 distribution metadata owners. There are 49 names outside the
exact5 selector:

```text
annotated-doc, annotated-types, anyio, cachecontrol, certifi, cffi,
charset-normalizer, click, cryptography, fastapi, firebase-admin, google-api-core,
google-auth, google-cloud-core, google-cloud-firestore, google-cloud-storage,
google-crc32c, google-resumable-media, googleapis-common-protos, grpcio,
grpcio-status, h11, h2, hpack, httpcore, httptools, httpx, hyperframe, idna,
msgpack, proto-plus, protobuf, pyasn1, pyasn1-modules, pycparser, pydantic,
pydantic-core, pyjwt, python-dotenv, pyyaml, requests, starlette,
typing-extensions, typing-inspection, urllib3, uvicorn, uvloop, watchfiles,
websockets
```

These extra names are supporting evidence only. The decisive identity failure is the selected
`packaging` element mismatch.

# 6. Current content manifests

The distribution, installed-file, and full-root path-free manifest schemas were read twice with
identical hashes. The RECORD closure observation was independently derived once from the same
bounded candidate. The candidate is invalid and non-reusable, so runtime/package bodies and the
527,650-byte and 545,671-byte manifest row bodies are not published. Their hashes are
observation identities, not storage or future readiness credit.

| manifest | count | bytes | LF | SHA-256 |
|---|---:|---:|---:|---|
| `DISTRIBUTION_METADATA_MANIFEST_V1` | 54 distributions | 8007 | 55 | `54f5617fa773e652c284c2697153808eb5aa4218697a89f0b9afa0dbf6daca8d` |
| `RECORD_CLOSURE_OBSERVATION_V1` | 54 RECORD owners / 4474 rows | 811 | 15 | `4250959ff0be540029d5cd937ab49a4b98bb9b4f984ecf82fe761de79f1914d2` |
| `INSTALLED_FILE_MANIFEST_V1` | 4499 files | 527650 | 4500 | `16115e4c6db422931e1ca128ccd2ce49b1354cbf50ce51ea18ec558508bf9ce8` |
| `FULL_RUNTIME_ROOT_MANIFEST_V1` | 4499 files + 536 directories + 0 symlinks + 0 other | 545671 | 5036 | `91e6baece2344689b724a96720d058d18acb1da0b71e555014129c94ad3322d6` |

The RECORD observation is a distinct content input. Its body-free canonical preimage is UTF-8,
fixed field order, `key=value`, LF separator, final LF true, lowercase SHA-256:

```text
schema=cocolon.emlis.nls_v3.step11.cycle001.g5.gate_a.record_closure_observation.v1
record_set_sha256=9488d3f74362562dfc899a57c7d863383698213e92cdf692080eb80da9613915
record_owner_count=54
record_row_count=4474
hashed_record_row_count=2519
empty_hash_record_row_count=1955
closed_distribution_count=44
failed_distribution_count=10
present_hashed_or_sized_row_mismatch_count=0
missing_expected_entrypoint_script_count=10
missing_expected_pathset_sha256=96f0660052254ae189845587822271f60c1320253424af44b9cb10da4c1056ad
record_issue_rows_sha256=329a97a59f58be312db0ee2fbbba53109fa7eaac684d4a50bb939116b64d6bcd
unowned_file_count=35
unowned_pathset_sha256=4356b409d2394bc15042c33293e3b36d73863dce3641aa25bf98c06947361ff3
unowned_file_manifest_sha256=939694e871e39032890c0191f4dd9e72839b6ca3f3d71498d6f3bbc2d39e025e
```

```text
preimage bytes/LF/CR/final-LF: 811 / 15 / 0 / true
record_closure_observation_identity: 4250959ff0be540029d5cd937ab49a4b98bb9b4f984ecf82fe761de79f1914d2
```

Because 10 distribution RECORD closures fail, the four distinct observations do not establish
a canonical runtime content identity. The following is therefore explicitly a partial,
noncredit content-observation preimage under the same encoding rules:

```text
schema=cocolon.emlis.nls_v3.step11.cycle001.g5.gate_a.partial_runtime_content_observation.v2
distribution_manifest_sha256=54f5617fa773e652c284c2697153808eb5aa4218697a89f0b9afa0dbf6daca8d
distribution_count=54
record_closure_observation_identity=4250959ff0be540029d5cd937ab49a4b98bb9b4f984ecf82fe761de79f1914d2
record_owner_count=54
distribution_closure_sha256=NOT_ESTABLISHED:RECORD_CLOSURE_FAILED_DISTRIBUTION_COUNT_10
installed_file_manifest_sha256=16115e4c6db422931e1ca128ccd2ce49b1354cbf50ce51ea18ec558508bf9ce8
installed_file_count=4499
full_runtime_root_manifest_sha256=91e6baece2344689b724a96720d058d18acb1da0b71e555014129c94ad3322d6
full_runtime_root_entry_count=5035
```

```text
preimage bytes/LF/CR/final-LF: 676 / 10 / 0 / true
partial_runtime_content_observation_id: 8e91847fa31f212ebaf88eda13d556648ea5eed1bc6380bee5ec3fa4745bd6b2
runtime_content_identity: NOT_ESTABLISHED:DISTRIBUTION_RECORD_CLOSURE_INVALID
```

An independent direct static closure pass corroborated the mismatch without launching Python or
pytest:

```text
dist-info / RECORD owners: 54 / 54
RECORD rows: 4474
hashed RECORD rows / empty-hash rows: 2519 / 1955
RECORD-closed distributions / failed distributions: 44 / 10
present hashed-or-sized RECORD row mismatch: 0
missing expected entrypoint scripts: 10
unowned files: 35
root-local named manifest/lock/projection/requirements/pyvenv/.pth/direct_url controls: 0
formal lock distribution identities: 46
current-to-formal-lock exact identity matches / missing lock identities / extra current identities: 31 / 15 / 23
```

The missing script and unowned-file observations are supporting closure evidence. They are not a
replacement for the direct exact5 `packaging` mismatch and do not authorize repair of this root.

# 7. Locator and control identities

The absolute runtime root, absolute interpreter path, scratch/session identifiers, and raw
package bodies are private operational details and are not published.

Path-free locator observation preimage:

```text
schema=cocolon.emlis.nls_v3.step11.cycle001.g5.gate_a.path_free_locator_observation.v1
discovery_scope=DECLARED_PRIOR_G4_RUNTIME_ROOT_EXACT1
locator_strategy=DECLARED_LOCATOR_ONLY
candidate_count=1
root_type=DIRECTORY
root_mode=0755
relative_entrypoint=bin/pytest
entrypoint_type=REGULAR
entrypoint_mode=0755
entrypoint_shebang_control_count=1
shebang_interpreter_symlink_chain_count=1
shebang_interpreter_first_link_target_class=RELATIVE
resolved_interpreter_type=REGULAR
```

```text
preimage bytes/LF/CR/final-LF: 473 / 13 / 0 / true
path_free_locator_observation_id: 6d138087f3b3016754292465fa83d6522c4cb6e8f0896eaee3554f27f82c7bc6
```

Entrypoint/control identity preimage:

```text
schema=cocolon.emlis.nls_v3.step11.cycle001.g5.gate_a.entrypoint_control_identity.v1
relative_entrypoint=bin/pytest
entrypoint_type=REGULAR
entrypoint_mode=0755
entrypoint_bytes=225
entrypoint_sha256=2abdd39dfcbff819df1a26f24d352724759e67317362ed43c3ce2624433ee321
shebang_control_count=1
interpreter_symlink_chain_count=1
first_link_target_class=RELATIVE
resolved_interpreter_type=REGULAR
resolved_interpreter_mode=0755
resolved_interpreter_bytes=27816648
resolved_interpreter_sha256=9ed008e5a8685235361f0c53771b520ab082dd99a877ad2fd796a93fa4c0b488
relative_pytest_control=pytest/__init__.py
pytest_control_bytes=5373
pytest_control_sha256=66993a5e3905005e0981159b4794d10b1adacf341a58a44d696ad2c4442dcdc6
```

```text
preimage bytes/LF/CR/final-LF: 706 / 16 / 0 / true
entrypoint_control_identity: 7ad466cea28bd51a8adbb327097bbaead7d1cc591ef53065c244c36d310e32cf
matched prior-G4 static subset count: 3
```

# 8. Instance and observation-chain classification

Current noncredit instance-observation terminal preimage:

```text
schema=cocolon.emlis.nls_v3.step11.cycle001.g5.gate_a.noncredit_runtime_instance_observation_terminal.v1
partial_runtime_content_observation_id=8e91847fa31f212ebaf88eda13d556648ea5eed1bc6380bee5ec3fa4745bd6b2
runtime_content_identity=NOT_ESTABLISHED:DISTRIBUTION_RECORD_CLOSURE_INVALID
materialization_event_id=NOT_ESTABLISHED:PRIOR_G4_RECEIPT_DID_NOT_BIND_EVENT_OR_INSTANCE
path_free_locator_observation_id=6d138087f3b3016754292465fa83d6522c4cb6e8f0896eaee3554f27f82c7bc6
entrypoint_control_identity=7ad466cea28bd51a8adbb327097bbaead7d1cc591ef53065c244c36d310e32cf
```

```text
preimage bytes/LF/CR/final-LF: 566 / 6 / 0 / true
noncredit_runtime_instance_observation_terminal_id: 26477213e01c38d510bd41c3f7fd869d2c5d57def46eafc5e6aa2de9edbfd5f3
runtime_instance_observation_id: NOT_ESTABLISHED:MATERIALIZATION_EVENT_AND_RUNTIME_CONTENT_IDENTITY_NOT_ESTABLISHED
identity credit: 0
```

The hash above binds only the current noncredit observation terminal. It is not a canonical
runtime-instance identity because runtime content and its materialization event are not
established.

Noncredit observation-chain terminal preimage:

```text
schema=cocolon.emlis.nls_v3.step11.cycle001.g5.gate_a.noncredit_observation_chain_terminal.v3
prior_checkpoint_commit=a3faf0da493da9d7037b3d85af20ee4a260b5b48
prior_checkpoint_receipt_git_blob_sha1=a31e39d89e7b9506b22883bddcc0d1bcd12626d7
prior_state=CURRENT_CONTINUITY_UNVERIFIED
prior_same_instance_credit=0
prior_materialization_event_id=NOT_ESTABLISHED
current_noncredit_runtime_instance_observation_terminal_id=26477213e01c38d510bd41c3f7fd869d2c5d57def46eafc5e6aa2de9edbfd5f3
current_runtime_instance_observation_id=NOT_ESTABLISHED:MATERIALIZATION_EVENT_AND_RUNTIME_CONTENT_IDENTITY_NOT_ESTABLISHED
no_rematerialization_proof=NOT_ESTABLISHED
continuity_credit=0
current_terminal_state=RUNTIME_IDENTITY_INVALID_AT_DECLARED_DISCOVERY_SCOPE
```

```text
preimage bytes/LF/CR/final-LF: 743 / 11 / 0 / true
noncredit_observation_chain_terminal_id: 3d7dd063c516e9870e19f2ee0ee09a030073a591d55c5470865117e7defd63d7
continuity_observation_chain_identity: NOT_ESTABLISHED:NO_PRIOR_EVENT_INSTANCE_BINDING_OR_NO_REMATERIALIZATION_PROOF
same-instance continuity credit: 0
```

The other required composition fields are explicitly terminal rather than omitted:

```text
logical_runtime_id: NOT_ESTABLISHED:CURRENT_PROJECTION_MISMATCH_AND_NO_CURRENT_ENVIRONMENT_POLICY_BINDING
environment_policy_sha256: NOT_ESTABLISHED:GATE_A_DID_NOT_BIND_OR_EXECUTE_POLICY
runtime_root_identity_sha256: NOT_ESTABLISHED:CURRENT_ROOT_INVALID_AND_NO_CURRENT_MATERIALIZATION_OWNER
current_python_implementation: UNOBSERVED:GATE_A_NO_VERSION_PROBE
current_python_version: UNOBSERVED:GATE_A_NO_VERSION_PROBE
current_platform: UNOBSERVED:GATE_A_NO_RUNTIME_PROBE
accepted_artifact_manifest_sha256: NOT_ESTABLISHED:NO_CURRENT_ACCEPTED_ARTIFACT_MANIFEST
accepted_wheel_manifest_sha256: NOT_ESTABLISHED:NO_CURRENT_ACCEPTED_WHEEL_MANIFEST
current_materialization_procedure: NOT_APPLICABLE:NO_CURRENT_MATERIALIZATION_EVENT
current_custom_helper_identity: NOT_APPLICABLE:GATE_A_USED_NO_CUSTOM_HELPER_PROCESS
expiry_trigger: RUNTIME_IDENTITY_DRIFT_ALREADY_OBSERVED
```

# 9. Classification counters

```text
candidate scope freeze/observation: 1 / 1
lock identity derivation: 1
runner projection derivation: 1
distribution metadata manifest derivation: 1
RECORD closure observation derivation: 1 NONCREDIT
installed-file manifest derivation: 1
full-root manifest derivation: 1
locator/control identity derivation: 1 / 1
partial runtime content observation derivation: 1 NONCREDIT
canonical runtime content identity derivation: 0
noncredit runtime instance terminal derivation: 1 NONCREDIT
canonical runtime instance observation derivation: 0
continuity-chain terminal derivation: 1 NONCREDIT
typed classification: 1
owner verdict: INVALID exact1
independent read-only audit verdict: INVALID exact1
READY/readiness credit/GREEN credit: 0 / 0 / 0
```

`recovery_class=REMATERIALIZABLE_FROM_FROZEN_LOCK` means only that the lock, exact5 projection,
and tracked procedure identities are durably available. Artifact availability and any configured
acquisition route are `CURRENT_SESSION_UNVERIFIED`. It does not authorize acquisition,
rematerialization, version probe, role probe, or target execution.

The recovery target is the frozen expected exact5 runtime. A reconstruction source for the
invalid observed 54-distribution root is `NOT_ESTABLISHED`, and that root is not reusable.

# 10. Preserved G4/G5 facts and nonclaims

- Corrected G4 remains `CLOSED_CONSUMED_CAUSAL_RED_PASS`; its 22 PASS / 2 causal RED result is
  not retroactively reclassified.
- mashos-api `main` remains at `b0a8c70e5cec08581678b98f2e21571d17674d91` for this Gate A
  observation. The protected test and production files are unchanged by this authority.
- The bounded G5 production candidate remains local-only, noncredit, and unexecuted. Its lossless
  patch is already durably stored in the prior G5 STOP Addendum; this checkpoint does not copy,
  apply, publish, or mutate it.
- Current G5 state is `PREEXECUTION_STOP_RUNTIME_IDENTITY_INVALID`; machine GREEN is0.
- G6 is unstarted and requires separate explicit approval after a valid G5 machine GREEN.
- Cycle001 remains `NOT_ACCEPTED`.

# 11. STOP and next boundary

This Gate A authority ends here. No Gate B or Gate C action is authorized.

The invalid candidate must not be retried or promoted. A future Gate B recovery would require a
new explicit Mash authority for frozen exact5 rematerialization, any separately counted artifact
acquisition network, fresh exact pytest-version probe, fresh required-role probe, and a STOP at
`RUNTIME_READY_CURRENT_SESSION` if all identities and probes are valid. Even then, the G5 exact24
target run would require a later separate Gate C authority.

This checkpoint is complete only after its Addendum/Receipt/Handoff new3 and append-only
Plan/07/08 modified3 are present on Cocolon `main`, the write changed-path union is exact6 with
unauthorized0/deletion0/rename0, all six remote bytes equal prepared bytes, and latest `main`
contains all six artifacts. That GitHub reflection does not change the typed STOP or authorize
runtime recovery.
