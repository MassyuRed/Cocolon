# NLS v3 Step 11 Cycle001 Recovery Epoch003
# Prestart Predecessor Actual Git Bytes exact6 Canonical Mismatch
# Additive Identity-Bound Historical Receipt Byte-Form Remediation
# Design Read Only

Date: 2026-07-30 JST

## 0. Authority and exact1 decision

This document is produced only under:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_PRESTART_PREDECESSOR_CANONICAL_BYTES_REMEDIATION_ACTUAL_GIT_BYTES_EXACT6_ADDITIVE_IDENTITY_BOUND_HISTORICAL_RECEIPT_BYTE_FORM_ROUTE_DECISION_DESIGN_READ_ONLY
```

Fixed entry:

```text
Cocolon commit / tree:
7795950eefc4a925d18e44ac1dbc94fbd90033d0
e7226b8a39860b7b57577c877898b317e02d6ebd

mashos-api commit / tree:
1c3bdd73df68699cbc14b3ccc41c94149f0b6255
1be763a89c82a40a97e0696e1639a3474c45d806

failure receipt external identity:
7905659fd5ef68f795204792dddd7507e828540dcd0d9d75e75d37911afd4247
```

Entry state and blocker:

```text
RECOVERY_EPOCH003_FINAL_ISSUANCE_PRESTART_PREDECESSOR_CANONICAL_BYTES_MISMATCH_MATERIALIZATION_NOT_STARTED_AUTHORITY_STOP

BLOCKED_BY_ACTUAL_GIT_BYTES_EXACT6_CANONICAL_BYTES_MISMATCH_AND_ADDITIVE_BINDING_ROUTE_UNSELECTED
```

Selected route exact1:

```text
OPERATIONAL_ADMISSION_V2_EXACT16_SCHEMA_DISPATCH_WITH_TRANSIENT_IDENTITY_BOUND_HISTORICAL_RECEIPT_BYTE_FORM_DERIVATION
```

The route is additive because it introduces a versioned current-only
OperationalAdmission v2 owner/verifier/pre-Event1-parent path while leaving
all v1 APIs and semantics intact.  It does not add a field to the
OperationalAdmission body: v2 keeps the v1 top-level exact16 keyset and the
v1 predecessor exact8 object, while the distinct v2 schema selects the new
identity-first historical byte-form validation profile.

```text
historical receipt rewrite / replacement:
0 / 0

standalone compatibility artifact:
0

additional OperationalAdmission field:
0

production implementation / CAUSAL RED:
NOT_AUTHORIZED / NOT_AUTHORIZED
```

No authority automatically progresses from this decision.

## 1. Confirmed facts

### 1.1 Repository state

Both local repositories were clean at their fixed entries.

```text
Cocolon HEAD / tree / dirty path count:
7795950eefc4a925d18e44ac1dbc94fbd90033d0
e7226b8a39860b7b57577c877898b317e02d6ebd
0

mashos-api HEAD / tree / dirty path count:
1c3bdd73df68699cbc14b3ccc41c94149f0b6255
1be763a89c82a40a97e0696e1639a3474c45d806
0
```

The GitHub default-branch comparison at design start was:

```text
MassyuRed/Cocolon
7795950eefc4a925d18e44ac1dbc94fbd90033d0..main
status: identical
ahead / behind: 0 / 0
```

The fixed failure receipt was fetched from GitHub.  Its blob is:

```text
2a554644c50ba2b5791137cbf858dfbfc035c1f4
```

It records `CANONICAL_BYTES_MISMATCH exact6`, reference path absent,
OperationalAdmission path absent, and materialization start/success
`0 / 0`.

### 1.2 Active canonical contract

The fixed `load_canonical_json_bytes` requires:

1. bytes input;
2. no UTF-8 BOM;
3. no CR;
4. exactly one trailing LF;
5. strict UTF-8;
6. duplicate-key rejection;
7. non-finite-value rejection; and
8. exact equality with NFC-normalized, key-sorted, compact
   `canonical_json_bytes(value) + LF`.

Failure of item 8 is `CANONICAL_BYTES_MISMATCH`.

```text
path:
ai/services/ai_inference/emlis_ai_nls_v3_artifact_contract.py

blob:
953d062fa858870e65d96cf03694d68c99003594

raw SHA-256:
c20b262495276c9b549b257380e1a7c28069c316a7aca4b6e00a49de03d1512b
```

The selected route does not change this file or the active/current
canonical contract.

### 1.3 Actual Git exact6 rederivation

The main derivation and a separate read-only independent derivation
reproduced the same exact6.  Every publication commit:

- has one parent;
- changes exactly the receipt path;
- introduces that path;
- is an ancestor of fixed Cocolon HEAD;
- has exact0 later changes to that path; and
- resolves to the same blob/bytes at publication and fixed HEAD.

Every receipt:

- is strict JSON;
- has no BOM or CR;
- is NFC-stable;
- is body-free;
- reproduces its logical `receipt_sha256`; and
- differs from the active canonical byte representation.

The confirmed cause is noncanonical serialization, not a logical
self-hash failure.  This does not reduce the byte difference to whitespace
alone: ordering, indentation, line breaks, and equivalent JSON
serialization choices are part of the actual bytes.

| Binding | Publication commit | Blob | Raw SHA-256 | Logical SHA-256 | Container identity | Actual bytes | Canonical + LF bytes | Canonical + LF SHA-256 |
|---|---|---|---|---|---|---:|---:|---|
| P0 receipt | `a4bdbc9fe144932fb445afcba81096f666d99d69` | `7139227bbb5cb67102024786059c13a069dfb3f8` | `dd4af55855eb82fc1de5725a6c10873967def2a0e8e56d4ebc293be4258bd045` | `904baff49d3efd09a4a1486298962646d7c56a7f90e3ce8191d7e26072cf66db` | `74286b862eeee1663d2758ee18d1e848316da6fc27b12fef38c149c5a2b52f36` | 14291 | 12971 | `4a44a527d8072676d6db076b04e3fdbe2f0b30b7b556e76335598eb7f01b6a14` |
| Parent Addendum receipt | `1ed317111f64075d08e4a91d467dff7b9ebc3841` | `15f35643c01be32ae4e56e9312c1e67b32075623` | `fe4804fedae2f67e0fdd12199c0cc07439888103afc6e4b3738736b71d97eb69` | `de707a6947537c6c2335586f7a5990850dbbbcd62c89e7fe6e3427d42635f404` | `e8cc49a4983bb1c7e46948fb92ea605ce8fde7aa3a07926fbf047725e14bbf43` | 18822 | 17010 | `44a233452f612a8ba4518752b68e1c1b0f85d6107a5e99d94eaad420f2d6ff33` |
| bootstrap corrected D1 receipt | `31601a4f5ea3583ef1e9a839c55a8ace7677fd3e` | `1ad1d3610916f48a3d7adafac76fcb93c4d47538` | `0b6e491dedeb684b3f7d32b3a3acd231fbc724b994a75b1419c855428894a405` | `cabe7aa0d50e94083edfd95b4641383aaa9ff11e44e60e7ea538e93252490370` | `d9164d82715abb519b549a7581737a37ebd3bf153b53284697cbe4573a8edb9e` | 7788 | 6845 | `83070db351bc17b509f96c1ef1fa85c57ab89fdf91fb8139a77e73c6df897e4b` |
| bootstrap D2 receipt | `1da49a13ee8a0a16d9c856861af55a3deb7468e4` | `fd2396953e1a3fe6d8e2172f1cdf30a197406b0a` | `a24184570ce97d46d4e13652c2417e77b41f730832861aa0cbddb9a9b3e5d6dd` | `39ffbe4a791624c550eeb5d70d5326a26c88fee9e0a3880ae93e53066db570db` | `cbd665b12b3af16b251a66073222d12823fb8776207922616718290e4bddc738` | 6747 | 5887 | `49ff4dfe7a57d9fcad12063f3f19074e3fd526b354e541d4d0e296cd1596d5cd` |
| OperationalAdmission D1 receipt | `7204220e366227182c78b44d254854c33e738147` | `96cd768000f39738e95402b12aea0ca22dfbef50` | `b859e4d6c89ca2912c4459d5d4a1844b2fd439b8fad71a4242d84b062d69bccd` | `5a085d47b04fc75d5c4191261f1c9b8c00655932ac7e32bfe2096c43bd7e6650` | `d1897d23f89d8df0fce8fd5591b77aeb3e2832197d1474aa8827b810805c174b` | 7963 | 6959 | `6a334b730afd263423b34ec12c3fa06742c25ee823c527cb418f1077e4242fd7` |
| OperationalAdmission D2 receipt | `520d406102a31625be942fbbc903b0e01660c598` | `7e0926d01e8d8b447ca110a0a09ff7b17e2ef488` | `ccf3f5d5bb789910cdb3f7ff3fe10c208b5ce1ca91dffde117b5f01025604066` | `922af50cc7475247cc95cb4199a54fd76c3649b87f8bf36e9b723326a9df9b61` | `85dc3b8d64a12fa62f390e1c9ba654162c3f404122d0eb92f949647d6fcb3e30` | 10219 | 8820 | `739c3bb9de53e6b51518de55c9e0291c0f3d6d8402344f6b9e6243a1ba3cc734` |

Paths in the same order:

```text
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_Lineage02_Event1V2_BootstrapPreflightContractUnreachable_SourceBaselineInvalidationAndRecoveryEpoch003_ParentDesign_ReadOnly_BodyFree_Receipt_20260729.json

EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_FinalSourceBootstrapReferenceRuntimeClosureAndOperationalAdmissionContractUnreachable_P0ParentAddendum_Design_ReadOnly_BodyFree_Receipt_20260729.json

EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_D1_BootstrapFormalExact134ManifestAndReferenceRuntimeRootIdentityBinding_OracleCorrectionAndCausalREDRefreeze_BodyFree_Receipt_20260729.json

EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_D2_BootstrapSourceRuntimeExpectedObservedSeparationSchemaPairDispatchEvent1ImmutabilityAndIndependentOperationalProjection_ImplementationAndTargetedGREEN_BodyFree_Receipt_20260729.json

EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_PostP0ParentAddendum_D1_OperationalAdmissionSourceBootstrapCarrierReferenceMaterializerEvent1BindingAndPhaseEvidenceContract_CausalRED_FreezeOnly_BodyFree_Receipt_20260729.json

EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_PostP0ParentAddendum_D2_OperationalAdmissionSourceBootstrapCarrierReferenceMaterializerEvent1BindingAndPhaseEvidenceContract_ImplementationAndTargetedGREEN_BodyFree_Receipt_20260729.json
```

The canonical projection values are diagnostic commitments.  They are not
alternate raw identities, logical receipt identities, external identities,
or replacement artifacts.

### 1.4 Actual call graph

Fixed source identities:

| Path | Blob | Raw SHA-256 | Role |
|---|---|---|---|
| `ai/services/ai_inference/emlis_ai_nls_v3_artifact_contract.py` | `953d062fa858870e65d96cf03694d68c99003594` | `c20b262495276c9b549b257380e1a7c28069c316a7aca4b6e00a49de03d1512b` | active serializer/loader |
| `ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py` | `a8f84e71990e36606c1316b51fe45e7591758f14` | `16ef4ff0e4ac2c3e06f6d07723890a716c766c73374dec93d62a09691e70e7bd` | owner builder |
| `ai/services/ai_inference/emlis_ai_recovery_epoch002_canonical_current_closure_v3.py` | `bfc42250d4ac0c065d8dd3b5131766411ec6fb67` | `b68a50c0cb194f979b56e20ca20d1c878dbf366366a537171aa8eda3683f25ee` | source/bootstrap closure |
| `ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py` | `c90ebf00f11390a274ecdd4a71f6c0a95b68fc89` | `3b0d861c8f25807bbff890364585b48a5cd2a3419e8fa0e29070d7b71a93839a` | independent verifier |
| `ai/tools/emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py` | `f2e08df3f251f22531909d80fc6499751bc599a6` | `2ef1f9721d3a84458cbf6727df1f6d0d16214cdd3252299dde1d16cab9ba25e5` | parent phase connection |
| `ai/tools/emlis_nls_v3_recovery_epoch002_atomic_publication_bundle_v3.py` | `a7e0de1b7e048a647b95eccfbd03cdd7e198500b` | `f2625be00933f2c72b1094a9546e08e3c0de7c6bd28b56e01d4c67f625af023d` | role/path publication contract |
| `ai/tools/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_preflight.py` | `da9f786015a6a56c574efd4b2901610da62bc5ea` | `1658386bf0c5b67834880853a5a045c192a04c98d68a87e93195298224684f1d` | post-Event1 current-strict preflight |

Owner actual-Git path:

```text
external final-issuance caller
→ build_recovery_epoch003_operational_admission
→ _recovery_epoch003_predecessors_at_base_valid
→ _recovery_epoch003_p0_at_base_valid
  + _recovery_epoch003_identity_at_base_valid exact5
→ load_canonical_json_bytes
→ CANONICAL_BYTES_MISMATCH
```

There is no fixed-source production caller of the owner builder; the
final-issuance operation is external.

Independent public mode split:

```text
BODY_ONLY_BEFORE_PUBLICATION
→ body/source/reference shape validation
→ return before _recovery_epoch003_predecessors_at_base_valid

BODY_AND_POSTFETCH
→ _recovery_epoch003_predecessors_at_base_valid
→ _recovery_epoch003_p0_at_base_valid
  + _recovery_epoch003_predecessor_at_base_valid exact5
→ load_canonical_json_bytes
→ CANONICAL_BYTES_MISMATCH
```

The independent prestart rederivation recorded in this design was a
separate read-only derivation, not success of the current public
`BODY_ONLY_BEFORE_PUBLICATION` mode.

Formal-parent path:

```text
validate_recovery_epoch003_parent_phase_evidence_state
→ _e3_admission_phase_valid
→ verify_recovery_epoch003_operational_admission_contract
→ BODY_AND_POSTFETCH actual-Git path
```

The current parent pins OperationalAdmission v1, top-level exact16,
predecessor exact8, and the v1 verifier.  The post-Event1 current-strict
parent v1 calls the same v1 evidence validator.

The atomic publication bundle maps the OperationalAdmission role to its
existing path and does not validate a separate compatibility role.  No new
publication path is required by the selected route.

## 2. Inferences

1. The owner cannot build v1 from the actual exact6.  The independent
   `BODY_AND_POSTFETCH` path cannot grant postfetch credit for those same
   bytes.  The two failures have the same byte-form cause.
2. Relaxing the active loader would weaken every current/new artifact,
   rather than define a closed historical exception.
3. Reformatting or reissuing exact6 would alter raw SHA-256, blob,
   publication history, and external identity.
4. The v2 schema plus the unchanged exact8 full identities durably selects
   a deterministic validation function over actual Git bytes.  A stored
   projection field is therefore redundant: any projection change requires
   a raw identity change, which exact8 already binds.
5. Keeping schema v1 while changing its acceptance behavior would make the
   same v1 body/identity reject under the historical verifier and accept
   under a new verifier.  That overload is ambiguous and violates v1
   preservation.
6. Before reference publication, complete predecessor exact8 does not
   exist.  A distinct prestart seed is required; after reference
   publication, the complete exact8 must be used and the historical core
   must equal the prestart result.

These are design inferences, not RED, implementation, or GREEN evidence.

## 3. Route comparison and uniqueness

| Route | Durable profile selection | Historical identity preserved | New artifact | New OA field | Main defect | Decision |
|---|---|---|---:|---:|---|---|
| globally relax canonical loader | no | yes | 0 | 0 | weakens all active artifacts | rejected |
| existing v1 exact16 plus deterministic rederivation | no; same v1 identity gains two meanings | yes | 0 | 0 | overloads historical v1 semantics | rejected |
| v2 exact16 schema dispatch plus transient derivation | yes; schema v2 selects one closed profile | yes | 0 | 0 | none under the frozen predicates below | selected |
| v2 exact17 with inline projection contract | yes | yes | 0 | 1 | duplicates facts already bound by exact8 raw identities | rejected as nonminimal |
| v1 plus side validator result | no durable binding to the selected profile | yes | 0 | 0 | side-result/fallback ambiguity | rejected |
| standalone aggregate carrier plus OA successor | yes | yes | 1 | at least 1 identity binding | extra publication/identity lifecycle | rejected |
| per-receipt successor carrier exact6 | yes | yes | 6 | at least 1 set binding | partial publication and highest maintenance | rejected |
| rewrite/canonical reissue exact6 | ambiguous replacement | no | 6 or more | contract-dependent | replaces history | rejected |
| filename/role exception list | no | yes | 0 | 0 | prohibited name-only special case | rejected |

The exact16 v2 route is the unique minimum that both:

- gives the artifact a durable, versioned acceptance meaning; and
- adds no artifact and no OperationalAdmission field.

## 4. Two-stage causal topology

### 4.1 Prestart historical predecessor seed v1

The prestart gate cannot require the future reference identity.  It consumes
an explicit, body-free historical predecessor seed.

Schema:

```text
cocolon.emlis.nls_v3.recovery_epoch003.historical_predecessor_seed.v1
```

Strict top-level exact6:

```text
schema_version
logical_cycle_id
recovery_epoch_id
p0_external_identity
historical_receipt_external_identities
historical_predecessor_seed_sha256
```

`historical_receipt_external_identities` has strict exact5:

```text
operational_admission_parent_addendum_receipt_external_identity
bootstrap_contract_d1_receipt_external_identity
bootstrap_contract_d2_receipt_external_identity
operational_admission_contract_d1_receipt_external_identity
operational_admission_contract_d2_receipt_external_identity
```

Each direct member is the existing strict exact10 external identity.  P0 is
the existing strict composite exact6 identity.  No reference key, profile,
manifest, search root, filename allowlist, mock, or fallback key is allowed.

The frozen seed self-hash is:

```text
3a08461e6f06c820038a29c5c547476842560f41865929e4c05454b220afaa00
```

Preimage rule:

```text
SHA256(
  canonical_json_bytes(
    historical predecessor seed
    after deleting historical_predecessor_seed_sha256
  )
)
```

This hash was reproduced from the full P0 identity and the five full
exact10 identities listed in section 1.3.  It is a closed input contract,
not an artifact publication, replacement identity, or compatibility
manifest.  A caller cannot select members by filename or role.  Owner and
independent modules validate the same frozen seed but derive their own rows
and core hash separately.

### 4.2 Prestart strict input exact8

Both owner and independent prestart APIs use the same strict keyset exact8:

```text
artifact_repository_root
expected_artifact_head_commit_sha1
expected_artifact_head_tree_sha1
historical_predecessor_seed
source_repository_root
expected_source_head_commit_sha1
expected_source_head_tree_sha1
automatic_progression
```

Required:

```text
automatic_progression:
false

artifact/source HEAD and tree:
actual exact match

both worktrees:
clean
```

The input has no compatibility profile or caller-supplied derived rows.

Additive future APIs:

```text
owner:
derive_recovery_epoch003_prestart_historical_receipt_byte_form_eligibility_v1

independent:
verify_recovery_epoch003_prestart_historical_receipt_byte_form_eligibility_v1
```

Both validate the repository, frozen seed, full identities, actual Git
history, raw/logical identity, and canonical projection.  The independent
implementation does not import or consume the owner result.

The owner module and independent module each own their identity-first
historical JSON decoder.  They share the unchanged low-level
`canonical_json_bytes` primitive, but do not share parsed bodies, rows,
core hashes, eligibility results, repository observations, or a new
historical-loader helper.

### 4.3 Post-reference complete exact8

After reference publication, owner and independent derive the same
historical exact6 from the completed predecessor exact8:

```text
p0_external_identity.receipt
+ every direct historical receipt exact10 member
- reference_runtime_observation_external_identity
- predecessor_bindings_sha256
```

Eligibility is structural:

- P0 contributes its typed `receipt` member;
- the exact5 direct members are the strict historical receipt members
  already defined by the predecessor schema;
- the typed current reference member is excluded; and
- extra/missing keys fail the exact8 contract.

The fixed binding-key semantics above are schema semantics.  They are not a
runtime filename/name allowlist.  Filename, role text, or an `exact6` label
never independently grants eligibility.

Prestart owner, prestart independent, post-reference owner, and
post-reference independent must all produce the same
`historical_binding_core_sha256`.  Base/HEAD/topology eligibility is
revalidated at each phase; the core itself contains only immutable
historical identity and byte/projection facts.

### 4.4 Future operation order

This design executes none of these steps:

1. freeze a separately approved CAUSAL RED;
2. implement only RED-proven additive v2 paths and targeted GREEN, then
   STOP;
3. under a separately approved v2 final-issuance authority, run owner and
   independent prestart derivation;
4. require prestart owner/independent core exact equality;
5. only then start one-shot reference materialization;
6. build the reference observation with the v2 identifier;
7. independent reference v2 prepublication mode verifies the materialization
   request/result, runtime root identity, and reference body;
8. publish and postfetch the reference observation;
9. independent reference v2 postfetch mode re-verifies its external
   identity, canonical Git bytes, and publication ancestry;
10. at the reference publication commit/tree, build complete predecessor
   exact8 and independently rederive the historical core;
11. require prestart/post-reference/owner/independent core exact equality;
12. owner builds OperationalAdmission v2;
13. independent strict prepublication v2 mode reads actual Git and verifies
    the complete body before publication;
14. publish one canonical OperationalAdmission v2 file;
15. independent strict postfetch v2 mode verifies actual Git, v2 external
    identity, and publication;
16. additive pre-Event1 parent v2 verifies phase exact2; and
17. STOP before Candidate/Event1.

## 5. Typed raw-identity / canonical-projection relation

The derivation uses transient rows.  They are not published inside
OperationalAdmission and are not accepted as alternate identities.

Rows are sorted lexicographically by `binding_path`.  Derived order:

```text
bootstrap_contract_d1_receipt_external_identity
bootstrap_contract_d2_receipt_external_identity
operational_admission_contract_d1_receipt_external_identity
operational_admission_contract_d2_receipt_external_identity
operational_admission_parent_addendum_receipt_external_identity
p0_external_identity.receipt
```

Strict transient row exact17:

```text
binding_path
container_identity_kind
container_identity_sha256
receipt_schema_version
path
publication_commit_sha1
git_blob_sha1
raw_sha256
logical_hash_field
logical_artifact_sha256
actual_byte_count
canonical_projection_byte_count_with_lf
canonical_projection_sha256_with_lf
canonical_loader_error
byte_form_state
body_free
row_sha256
```

Rules:

```text
container_identity_kind:
P0_EXTERNAL_IDENTITY_V1
or
EXACT10_EXTERNAL_IDENTITY_V1

container_identity_sha256:
P0 row = p0_external_identity_sha256
direct exact5 rows = identity_sha256

logical_hash_field:
receipt_sha256

canonical_loader_error:
CANONICAL_BYTES_MISMATCH

byte_form_state:
IDENTITY_BOUND_HISTORICAL_NONCANONICAL_JSON

body_free:
true
```

Hashes:

```text
row_sha256 =
SHA256(canonical_json_bytes(row after deleting row_sha256))

historical_binding_core_sha256 =
SHA256(canonical_json_bytes(ordered transient rows exact6))
```

`canonical_projection_sha256_with_lf` is:

```text
SHA256(canonical_json_bytes(parsed historical receipt) + LF)
```

It is a derived diagnostic commitment only.  The original blob, raw
SHA-256, logical hash, publication commit, and container external identity
remain the primary identity.

## 6. Eligibility and tamper/drift rejection

Owner and independent implementations must separately perform, in order:

1. validate strict request keyset and repository identity;
2. verify expected HEAD, tree, and clean state;
3. validate the frozen prestart seed or complete post-reference exact8;
4. validate every full external/container identity and its self-hash;
5. derive the exact6 structurally;
6. verify publication parent exact1, changed path exact1, path absence in
   the publication parent, ancestry to validation base, no intervening path
   change, and no relevant post-base path change;
7. verify validation-base and HEAD blob against the identity;
8. verify raw SHA-256 against the identity;
9. only after steps 1 through 8, parse historical JSON;
10. reject BOM, CR, invalid UTF-8, missing/excess LF, duplicate keys,
    non-finite values, non-NFC scalar changes, normalized-key collision, and
    invalid nesting;
11. verify receipt schema, body-free state, logical field, and logical
    self-hash;
12. require the unchanged active loader to reject original bytes with
    exactly `CANONICAL_BYTES_MISMATCH`;
13. derive projection count/hash, rows, and core hash; and
14. require owner/independent and prestart/post-reference core equality.

All of the following fail closed:

- wrong seed self-hash;
- missing/extra/duplicated/injected member;
- caller-selected profile or derived rows;
- unknown or active/current artifact in the historical set;
- repository, HEAD, tree, or clean-state drift;
- publication topology or ancestry drift;
- blob/raw/logical/self-hash drift;
- JSON structural or normalization failure;
- canonical disposition or projection mismatch;
- v1 fallback;
- fixture-only or mock state for current credit; and
- owner/independent or phase-to-phase core mismatch.

## 7. Body-free derivation result and failure codes

Both prestart and post-reference derivation lanes return the same strict
result schema:

```text
cocolon.emlis.nls_v3.recovery_epoch003.historical_receipt_byte_form_derivation_result.v1
```

Strict keyset exact25:

```text
schema_version
derivation_owner
derivation_phase
state
failure_code
input_binding_sha256
historical_binding_core_sha256
source_baseline_state
body_free
automatic_progression
pytest_main_called
reference_runtime_materialization_count_delta
operational_runtime_materialization_count_delta
reference_observation_publication_count_delta
operational_admission_publication_count_delta
runtime_publication_count_delta
candidate_publication_count_delta
event1_publication_count_delta
readiness_publication_count_delta
failure_publication_count_delta
reservation_count_delta
attempt_count_delta
formal_exact134_invocation_count_delta
formal_collection_count_delta
formal_execution_count_delta
```

Closed values:

```text
derivation_owner:
OWNER
or
INDEPENDENT_VERIFIER

derivation_phase:
PRESTART
or
POST_REFERENCE

input_binding_sha256:
PRESTART after seed validation =
historical_predecessor_seed_sha256

POST_REFERENCE after completed exact8 validation =
predecessor_bindings_sha256

before the applicable input self-hash has validated =
null
```

No other `input_binding_sha256` value is permitted.  Once the applicable
input self-hash has validated, a later-phase failure retains that verified
64-lowercase-hex value; it never substitutes an unverified caller value.

Success:

```text
state: VALID
failure_code: null
historical_binding_core_sha256: 64 lowercase hex
```

Failure:

```text
state: INVALID
failure_code: one closed code
historical_binding_core_sha256: null
```

Every result is:

```text
source_baseline_state: UNLOCKED
body_free: true
automatic_progression: false
pytest_main_called: false
all fourteen *_count_delta fields: 0
```

The counters are invocation-caused deltas, not global observed historical
counts.  Thus a post-reference derivation still has publication deltas
exact0 because the derivation call itself performs no publication.

Closed codes:

```text
RECOVERY_EPOCH003_HISTORICAL_BYTE_FORM_INPUT_INVALID
RECOVERY_EPOCH003_HISTORICAL_BYTE_FORM_SEED_INVALID
RECOVERY_EPOCH003_HISTORICAL_BYTE_FORM_REPOSITORY_OR_BASE_DRIFT
RECOVERY_EPOCH003_HISTORICAL_BYTE_FORM_BINDING_SET_INVALID
RECOVERY_EPOCH003_HISTORICAL_BYTE_FORM_GIT_IDENTITY_MISMATCH
RECOVERY_EPOCH003_HISTORICAL_BYTE_FORM_HISTORY_TOPOLOGY_INVALID
RECOVERY_EPOCH003_HISTORICAL_BYTE_FORM_STRICT_JSON_INVALID
RECOVERY_EPOCH003_HISTORICAL_BYTE_FORM_LOGICAL_HASH_MISMATCH
RECOVERY_EPOCH003_HISTORICAL_BYTE_FORM_CANONICAL_DISPOSITION_MISMATCH
RECOVERY_EPOCH003_HISTORICAL_BYTE_FORM_PROJECTION_MISMATCH
RECOVERY_EPOCH003_HISTORICAL_BYTE_FORM_CROSS_LANE_MISMATCH
RECOVERY_EPOCH003_HISTORICAL_BYTE_FORM_HISTORICAL_FALLBACK_FORBIDDEN
RECOVERY_EPOCH003_OPERATIONAL_ADMISSION_V2_BUILD_INVALID
RECOVERY_EPOCH003_OPERATIONAL_ADMISSION_V2_VERIFICATION_INVALID
RECOVERY_EPOCH003_PARENT_PRE_EVENT1_V2_INVALID
```

Unexpected exceptions map to the applicable wrapper invalid code.  They do
not escape and do not become success.

## 8. OperationalAdmission v2 contract

### 8.1 v1 preservation

Unchanged:

```text
schema:
cocolon.emlis.nls_v3.recovery_epoch003.operational_admission.v1

top-level key count:
16

predecessor key count:
8

owner API:
build_recovery_epoch003_operational_admission

independent API:
verify_recovery_epoch003_operational_admission_contract

formal-parent v1 API and Event1 v1 dispatch:
unchanged
```

The v1 owner continues to reject actual exact6.  The v1 BODY_ONLY verifier
keeps its historical shape-only meaning.  No v2 call falls back to v1.

### 8.2 v2 exact16

Schema:

```text
cocolon.emlis.nls_v3.recovery_epoch003.operational_admission.v2
```

Strict top-level exact16:

```text
schema_version
logical_cycle_id
recovery_epoch_id
predecessor_bindings
source_closure
bootstrap_closure
authority
scope
freshness
effect_boundary
owner_validation_state
independent_verification_state
state
automatic_progression
body_free
operational_admission_sha256
```

Predecessor exact8 and its hash preimage are unchanged:

```text
p0_external_identity
operational_admission_parent_addendum_receipt_external_identity
bootstrap_contract_d1_receipt_external_identity
bootstrap_contract_d2_receipt_external_identity
operational_admission_contract_d1_receipt_external_identity
operational_admission_contract_d2_receipt_external_identity
reference_runtime_observation_external_identity
predecessor_bindings_sha256
```

OperationalAdmission v2 logical hash:

```text
operational_admission_sha256 =
SHA256(
  canonical_json_bytes(
    OperationalAdmission v2
    after deleting operational_admission_sha256
  )
)
```

Published file bytes:

```text
canonical_json_bytes(OperationalAdmission v2) + exactly one LF
```

The distinct v2 schema plus exact8 full raw identities is the durable typed
binding to the transient derivation profile.  Projection values are not
stored as substitute identities.

Fixed v2 state scalars:

```text
owner_validation_state:
PROVED

independent_verification_state:
PROVED

state:
SOURCE_BOOTSTRAP_REFERENCE_RUNTIME_CLOSED_AWAITING_SEPARATE_V2_EVENT1_CONNECTION_DESIGN_AND_AUTHORITY

automatic_progression:
false

body_free:
true
```

The body may be published only after independent strict prepublication
success.  The stored states do not permit publication before that external
ordering condition is met.

### 8.3 Inactive expected final-authority identifier

Production must not accept a caller-chosen token.  The future v2 path
therefore freezes this code-side expected scalar:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_PRESTART_PREDECESSOR_CANONICAL_BYTES_REMEDIATED_FINAL_PRE_EVENT1_REFERENCE_RUNTIME_OBSERVATION_AND_OPERATIONAL_ADMISSION_V2_ISSUANCE_ONLY
```

Status in this design:

```text
INACTIVE_EXPECTED_IDENTIFIER_NOT_APPROVED_AUTHORITY
```

Naming the expected scalar does not approve its use.  A later Mash message
must separately and explicitly approve that exact token before final
issuance.  This DESIGN READ ONLY authority, the future RED authority, and a
future implementation authority do not activate it.

Nested `authority` keeps strict exact4:

```text
approval_kind
admission_authority_token
publication_authority_token
authority_sha256
```

Both token fields must equal the inactive expected scalar, and external
workflow authority must separately be active.  Reusing the old final,
design, RED, or implementation token is invalid.

The new scalar is also causally required before OperationalAdmission:

```text
materialize_recovery_epoch003_reference_runtime
build_recovery_epoch003_reference_runtime_observation
build_recovery_epoch003_source_bootstrap_closure
```

currently pin the old final token directly or through reference validation.
The v2 route therefore requires additive current-only counterparts:

```text
materialize_recovery_epoch003_reference_runtime_v2
build_recovery_epoch003_reference_runtime_observation_v2
build_recovery_epoch003_source_bootstrap_closure_v2
validate_recovery_epoch003_source_bootstrap_contract_state_v2
```

They bind the inactive v2 scalar and reject fallback to the old final token.
The reference observation remains strictly canonical and carries the v2
scalar in its existing `authority_token` field; its body identity therefore
differs from an old-token observation.  Existing v1 materializer,
observation builder, and closure APIs remain unchanged.

The published reference schema is explicitly retained as:

```text
cocolon.emlis.nls_v3.recovery_epoch003.reference_runtime_observation.v1
```

Its strict exact21 keyset remains:

```text
authority_token
body_free
collection_state
dependency_lock_identity
environment_policy
environment_policy_sha256
formal_exact134_invocation_count
installed_distributions
installed_distributions_sha256
logical_cycle_id
pytest_distribution_identity
python_runtime_identity
recovery_epoch_id
reference_runtime_observation_sha256
reservation_count_delta
runtime_materialization
schema_version
source_commit_sha1
source_tree_sha1
test_execution_state
wheel_bundle_manifest_sha256
```

Its hash preimage remains the canonical JSON bytes of the preceding exact20
fields, and its published bytes remain that canonical body followed by
exactly one LF.  The durable
current discriminator is the exact pair:

```text
(reference_runtime_observation.v1, inactive v2 final identifier)
```

That pair is covered by the reference logical hash and external identity.
The historical v1 verifier continues to require the old identifier; the
additive v2 verifier requires only the new identifier.  They never accept
the same reference identity through two profiles.

### 8.4 Scope v2 exact12

Strict keyset:

```text
artifact_repository_full_name
source_repository_full_name
source_ref
source_commit_sha1
source_tree_sha1
source_closure_sha256
bootstrap_closure_sha256
reference_runtime_observation_external_identity_sha256
next_authority_token
operation_set
separate_explicit_authority_required
scope_sha256
```

Narrow values:

```text
operation_set:
["OPERATIONAL_ADMISSION_PUBLICATION"]

next_authority_token:
null

separate_explicit_authority_required:
true
```

All repository/source/reference fields remain exact-bound.  An Event1 token
or wider operation set supplied by payload is invalid.

### 8.5 Freshness v2 exact11

The v1 keyset is retained:

```text
issued_at_utc
expires_at_utc
validity_mode
bound_source_commit_sha1
bound_source_tree_sha1
bound_reference_runtime_observation_external_identity_sha256
event1_path_state_at_issuance
maximum_event1_consumption_count
invalidation_conditions
reuse_allowed
freshness_sha256
```

v2-specific values:

```text
expires_at_utc:
null

validity_mode:
IDENTITY_STABLE_SINGLE_FUTURE_EVENT1_CAPABILITY

event1_path_state_at_issuance:
ABSENT

maximum_event1_consumption_count:
1

reuse_allowed:
false
```

Closed invalidation conditions:

```text
REFERENCE_OR_PREDECESSOR_IDENTITY_NOT_REACHABLE_OR_BYTE_DRIFTED
SOURCE_COMMIT_OR_TREE_DRIFTED_OR_WORKTREE_NOT_CLEAN
SOURCE_OR_BOOTSTRAP_CLOSURE_MISMATCH
HISTORICAL_RECEIPT_BYTE_FORM_CROSS_LANE_MISMATCH
EVENT1_PATH_PRESENT_WITHOUT_SEPARATE_V2_CONNECTION_AUTHORITY
```

`maximum_event1_consumption_count: 1` is only an immutable upper capability
bound.  It is not current Event1 authority.  Current scope has no Event1
operation or token, current Event1 dispatch does not accept v2, and this
design performs consumption exact0.  A future exact1 consumption requires
both a separately approved v2 Event1 connection and additive production
dispatch.

### 8.6 Effect boundary v2 exact15

The v1 keyset is retained.  The future successful final-issuance artifact
records historical effects already caused by that final-issuance sequence:

```text
reference_runtime_materialization_count_delta:
1

reference_runtime_observation_publication_count:
1

operational_admission_publication_count:
1

operational_runtime_materialization_count:
0

candidate_allocation_count:
0

sequence_event1_count:
0

readiness_artifact_count:
0

formal_reservation_count:
0

formal_attempt_count:
0

formal_exact134_invocation_count:
0

formal_test_collection_count:
0

test_execution_count:
0

pytest_main_call_count:
0

source_baseline_state:
UNLOCKED

effect_boundary_sha256:
hash of the exact14 preceding fields
```

This artifact evidence is distinct from the derivation/test invocation
deltas in section 7.  Future RED oracle “effect exact0” means the tested
derivation/validation call causes no effect; it does not require the future
OA v2 historical `effect_boundary` to contain all zeros.

## 9. v2 owner and independent input/mode boundary

### 9.1 Independent reference v2

Additive API:

```text
verify_recovery_epoch003_reference_runtime_observation_v2
```

Strict input exact6:

```text
verification_mode
materialization_request
materialization_result
reference_runtime_observation
reference_runtime_observation_external_identity
reference_publication_state
```

Closed modes:

```text
STRICT_REFERENCE_BODY_BEFORE_PUBLICATION
STRICT_REFERENCE_BODY_AND_POSTFETCH
```

Both modes independently validate:

- the inactive v2 final identifier and reject the old-token fallback;
- materialization request/result;
- dependency lock, wheel set, installed distributions, runtime target,
  runtime root identity, and environment policy;
- the exact21 reference body, logical hash, and canonical bytes; and
- invocation-caused materialization/publication/effect deltas exact0.

Prepublication requires identity/publication state null and gives
publication credit exact0.  Postfetch repeats the body/runtime checks and
also validates the v2-bound reference external identity, canonical Git
bytes, exact one-path publication, ancestry, HEAD/blob/raw identity, and
postfetch body equality.

The independent v2 verifier does not consume an owner builder result,
owner runtime projection, or forwarded owner validation result.

### 9.2 Owner v2

Additive API:

```text
build_recovery_epoch003_operational_admission_v2
```

Strict input exact8:

```text
predecessor_bindings
source_closure
bootstrap_closure
authority
scope
freshness_policy
reference_publication_state
source_repository_observation
```

It requires complete predecessor exact8 and actual repositories.  It
privately performs POST_REFERENCE derivation.  It accepts no profile,
precomputed rows/core, mock, or fallback input.  Its success does not
publish.

### 9.3 Independent OperationalAdmission v2

Additive API:

```text
verify_recovery_epoch003_operational_admission_contract_v2
```

Strict input exact7:

```text
verification_mode
artifact_repository_root
source_repository_observation
operational_admission
operational_admission_external_identity
reference_runtime_observation
reference_publication_state
```

Closed modes:

```text
STRICT_PREPUBLICATION_ACTUAL
STRICT_POSTFETCH_ACTUAL
```

Both modes require:

- expected Cocolon repository;
- actual base/tree/HEAD/clean state;
- actual source repository commit/tree/clean state;
- actual reference publication;
- complete predecessor exact8;
- independent actual-Git exact6 history/raw/logical/projection derivation;
- v2 authority/scope/freshness/effect semantics; and
- no v1 fallback.

`STRICT_PREPUBLICATION_ACTUAL` requires
`operational_admission_external_identity` to be null, requires the OA path
absent at the admission base, and grants publication/postfetch credit
exact0.

`STRICT_POSTFETCH_ACTUAL` repeats the same actual exact6 derivation and also
requires the v2 external identity, exact one-path OA publication, canonical
postfetch bytes/body, and reference-to-OA publication ancestry.

No v2 mode has the v1 BODY_ONLY shape-only meaning.

## 10. Formal parent and Event1 boundary

Additive pre-Event1 API:

```text
validate_recovery_epoch003_parent_pre_event1_phase_evidence_state_v2
```

Strict input envelope exact4:

```text
parent_phase_evidence_state
reference_materialization_request
reference_materialization_result
automatic_progression
```

`parent_phase_evidence_state` retains the existing strict exact9 state and
phase-row/artifact-record shapes.  The two materialization values are the
original immutable inputs required to reconstruct the independent reference
v2 exact6 call; they are not an owner validation result or a forwarded
independent result.  `automatic_progression` must be false.

The v2 parent:

- accepts only reference and OperationalAdmission phases;
- deep-copies the exact4 input before validation;
- at phase exact1, constructs the reference publication state from the
  reference artifact record plus actual Git, then calls
  `verify_recovery_epoch003_reference_runtime_observation_v2` in
  `STRICT_REFERENCE_BODY_AND_POSTFETCH` mode with the original
  materialization request/result;
- at phase exact2, repeats that independent reference v2 call at the
  OperationalAdmission base and separately calls
  `verify_recovery_epoch003_operational_admission_contract_v2` in
  `STRICT_POSTFETCH_ACTUAL` mode;
- derives both calls from phase records and actual repositories rather than
  trusting `owner_validation_state`, `independent_verification_state`, an
  owner result, or a forwarded validation result;
- rejects completed phase count greater than 2;
- requires both verifier calls and the parent call to cause all invocation
  effect deltas exact0; and
- never calls Event1, runtime materialization, readiness, reservation, or
  formal execution.

Existing v1 parent APIs remain unchanged and do not accept v2.

Event1 validation currently pins OperationalAdmission v1.  Event1 v2
connection is intentionally absent.  Any later connection requires a
separate design/authority after postverified OA v2 STOP.

## 11. Future CAUSAL RED

Candidate test path:

```text
ai/tests/test_emlis_nls_v3_recovery_epoch003_prestart_predecessor_actual_git_bytes_exact6_operational_admission_v2_schema_dispatch_red.py
```

Candidate ordered oracle exact11:

```text
01 PRESTART_OWNER_DERIVES_FROZEN_SEED_ACTUAL_EXACT6
02 PRESTART_INDEPENDENT_DERIVES_SAME_CORE_WITHOUT_OWNER_RESULT
03 POST_REFERENCE_OWNER_DERIVES_COMPLETE_EXACT8_SAME_CORE
04 V2_FINAL_IDENTIFIER_CONNECTS_REFERENCE_OWNER_INDEPENDENT_MATERIALIZER_OBSERVATION_CLOSURE_AND_PARENT_PHASE1
05 V2_STRICT_PREPUBLICATION_INDEPENDENT_READS_ACTUAL_GIT_EXACT6
06 V2_STRICT_POSTFETCH_AND_PRE_EVENT1_PARENT_PHASES1_AND2_REEXECUTE_INDEPENDENT_ACTUAL_PATHS
07 ORIGINAL_IDENTITIES_REMAIN_PRIMARY_AND_PROJECTION_IS_NOT_SUBSTITUTE
08 UNKNOWN_INJECTED_PROFILE_NAME_SELECTED_OR_FIXTURE_ONLY_INPUT_REJECTED
09 GIT_JSON_LOGICAL_PROJECTION_BASE_HEAD_AND_CROSS_LANE_DRIFT_FAIL_CLOSED
10 V1_EXACT16_EXACT8_CANONICAL_LOADER_AND_APIS_REMAIN_UNCHANGED
11 DERIVATION_VALIDATION_SUCCESS_AND_FAILURE_INVOCATION_EFFECT_DELTAS_EXACT0
```

“Name-selected” in oracle 08 means a runtime filename/role/exact6 label used
as an eligibility shortcut.  It does not prohibit the frozen typed binding
keys of the predecessor schema.

The future RED must freeze all node IDs, exactN, ordered node-list SHA-256,
test blob/raw SHA-256, commands, and fixed repository entries before any
implementation.

No test was created, collected, or executed by this design.

Candidate production exact5 derived from the actual call graph:

```text
ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py
ai/services/ai_inference/emlis_ai_recovery_epoch002_canonical_current_closure_v3.py
ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py
ai/tools/emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py
ai/tools/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_preflight.py
```

Ordered-path SHA-256:

```text
41d9979825bb3b2d3577196f983089197e8535c9c568733f9c3b8e0e624169e7
```

Preimage:

```text
SHA256(canonical_json_bytes(ordered path list exact5))
```

The artifact contract, existing tests, fixtures, proof, lock, registry,
dependency, exact6 receipts, and atomic publication bundle are excluded.

The future RED must independently confirm this design candidate exact5 and
hash before freezing it.  If actual RED reachability proves exact5
insufficient, implementation remains unauthorized pending a new
path-boundary approval.

## 12. Rollback, retirement, and reevaluation

Failure before future publication:

- body-free failure result;
- artifact publication exact0; and
- STOP without cleanup mutation.

Publication outcome unknown:

- read-only reconciliation only;
- no automatic retry; and
- STOP until reachability is known.

v2 commit confirmed absent from `main`:

- no overwrite exists;
- a separately authorized v2 publication retry may be considered.

Reachable valid v2 whose transport/postfetch confirmation was incomplete:

- read-only re-postfetch/reconciliation may be considered under explicit
  authority;
- no content rewrite.

Reachable contract-invalid v2:

- do not overwrite or delete it;
- publish only a separately authorized body-free failure record; and
- any remediation must use a successor v3 schema on an additive new path,
  not the existing v2 path.

Retention:

- v1 APIs and exact6 identities remain;
- v2 new issuance may retire only after no reachable current flow needs it;
- v2 historical verification remains while any later artifact depends on a
  v2 identity; and
- projection values never replace original identities.

Reevaluation is mandatory if:

- frozen seed or complete exact8 no longer derives exact6;
- owner/independent or prestart/post-reference cores differ;
- any identity/history/base/HEAD/clean state drifts;
- an active/current artifact would require historical compatibility;
- exact5 is insufficient;
- hidden lookup, implicit manifest, payload profile, or fallback becomes
  necessary;
- active canonical loader relaxation becomes necessary; or
- this route becomes a new stopping cause.

Any such condition keeps implementation unauthorized.

## 13. Confirmed zero-effect boundary for this design

```text
mashos-api production changes:
0

test / fixture / proof / lock / registry / dependency changes:
0 / 0 / 0 / 0 / 0 / 0

test collect / execution / pytest.main:
0 / 0 / false

compatibility artifact / successor receipt / manifest issuance:
0 / 0 / 0

reference materialization start / success:
0 / 0

reference observation / OperationalAdmission publication:
0 / 0

operational runtime materialization / publication:
0 / 0

Candidate / Event1:
0 / 0

Readiness / Failure:
0 / 0

Reservation / Attempt / formal exact134:
0 / 0 / 0

source baseline:
UNLOCKED

P2 / Product Read / Cycle001:
NOT_STARTED / NOT_STARTED / NOT_ACCEPTED

automatic progression:
false
```

## 14. 華恋の意見

既存exact6を整形し直すと、実際に公開された歴史を消して別identityへ置き換える
ことになります。一方、その歴史を守るためにactive canonical loaderを緩めると、
今後のartifact全体の境界が弱くなります。どちらも選ぶべきではありません。

実際のraw identityをprimaryのまま保持し、v2 schemaが
「このclosed exact6だけをidentity-firstで再導出する」と明示する方法なら、
歴史とcurrent strictnessを同時に守れます。canonical projectionをOAへ重複保存
する必要もなく、ownerとindependentが別々にactual Gitから再導出できます。

prestartとpost-referenceを分け、両laneのcoreが一致しなければ進まないこと、
Event1を接続せず再度STOPすることが、今回の目的に対して最小で誠実なrouteです。

## 15. Stop

After limited reflection and postfetch, the state is:

```text
RECOVERY_EPOCH003_PRESTART_PREDECESSOR_CANONICAL_BYTES_REMEDIATION_ROUTE_SELECTED_DESIGN_FROZEN_CAUSAL_RED_NOT_AUTHORIZED_MATERIALIZATION_NOT_STARTED_AUTHORITY_STOP
```

The next possible class is CAUSAL RED FREEZE.  It requires separate explicit
Mash approval.  This document does not issue its authority token and does
not automatically progress.
