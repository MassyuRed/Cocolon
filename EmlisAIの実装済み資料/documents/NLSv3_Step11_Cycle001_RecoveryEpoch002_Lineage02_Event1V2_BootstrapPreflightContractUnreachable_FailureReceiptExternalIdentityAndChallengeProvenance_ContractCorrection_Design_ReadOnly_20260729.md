---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch002_lineage02_event1_v2_bootstrap_preflight_contract_unreachable_failure_receipt_external_identity_challenge_provenance_contract_correction_design_read_only
title: "NLS v3 Step 11 Cycle 001 Recovery Epoch002 preflight-failure receipt external-identity and challenge-provenance correction"
revision_date: "2026-07-29"
status: "RECOVERY_EPOCH002_PREFLIGHT_FAILURE_RECEIPT_EXTERNAL_IDENTITY_AND_CHALLENGE_PROVENANCE_CONTRACT_CORRECTION_DESIGN_FROZEN_AUTHORITY_STOP"
body_free: true
automatic_progression: false
---

# 0. Decision

Approved authority:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_POST_D2_SUCCESSOR_LINEAGE02_EVENT1_POSTVERIFIED_BOOTSTRAP_PREFLIGHT_CONTRACT_UNREACHABLE_FAILURE_CLOSURE_RECEIPT_EXTERNAL_IDENTITY_ARTIFACT_ROLE_AND_PREFLIGHT_CHALLENGE_PROVENANCE_CONTRACT_CORRECTION_DESIGN_ISSUANCE_INDEPENDENT_VERIFICATION_AND_DESIGN_ONLY
```

This append-only correction resolves exactly two ambiguities left after the
immutable preflight-contract-unreachable failure receipt was published:

1. the receipt's external-identity `artifact_role` and strict exact10 object;
2. the provenance meaning of the receipt's design-fixed
   `preflight_challenge_id`.

The corrected external identity is:

```text
target:
the existing immutable exact30 failure receipt

artifact_role:
FORMAL_WORKER_BOOTSTRAP_PREFLIGHT_CONTRACT_UNREACHABLE_FAILURE_RECEIPT

identity_sha256:
c38516c355aa450aecce332b7ad50d3db9daad13ce6f27ebdd942dc0f239a856
```

The corrected challenge-provenance disposition is:

```text
5d58979338cbc30ce603df884d466981895e05198196925e209424a129c4b0f9:
DESIGN_DECLARED_PREFLIGHT_CHALLENGE_ID_WITH_UNPROVED_EXECUTION_PROVENANCE

6c315203ce98f635feb80b04f27ab7dcb43545f2883b8a6fcca36c8c1cb7acf4:
CURRENT_SCRATCH_SCRIPT_EXACT4_PREIMAGE_RECOMPUTED_PREFLIGHT_CHALLENGE_ID

actual executed challenge:
UNRESOLVED_NOT_REPLACEABLE_BY_INFERENCE
```

The existing receipt remains authoritative for the observed failure class,
diagnostics, valid formal-parent result, pre-materialization stop, and all
exact-zero downstream effects. It is not evidence that `5d589793...` was
derived by or observed from the execution script.

The receipt's semantic state is:

```text
VALID_WITH_CHALLENGE_PROVENANCE_QUALIFICATION
```

The existing receipt is not deleted, modified, renamed, or reissued. This
authority does not complete the receipt's corrected external-identity
postverification, resume the stopped issuance authority, invalidate
Recovery Epoch002, define Recovery Epoch003, modify mashos-api, materialize
a runtime, create readiness, reserve a run, or invoke formal exact134.

The result is:

```text
RECOVERY_EPOCH002_PREFLIGHT_FAILURE_RECEIPT_EXTERNAL_IDENTITY_AND_CHALLENGE_PROVENANCE_CONTRACT_CORRECTION_DESIGN_FROZEN_AUTHORITY_STOP
```

# 1. Precedence and fixed entry

## 1.1 Narrow precedence

For the failure receipt's external identity and `preflight_challenge_id`
provenance only, the order is:

1. this correction;
2. the bootstrap/source-runtime baseline-disposition reconciliation design;
3. that design's handoff;
4. the immutable exact30 failure receipt;
5. the current latest-snapshot stop record;
6. the current Execution and Closure Plan and Revised Cycle Detailed Design.

This correction supersedes only:

- the previously unfrozen external-identity role and exact10 tuple;
- the previously unresolved relation among the design-declared challenge,
  the current scratch-script recomputation, and the unproved executed value;
- the scope of the receipt's independent-verification claim; and
- the postverification predicate and resumption boundary.

Every unrelated schema, keyset, receipt byte, failure diagnostic, Event1
identity, source/bootstrap closure, formal-parent result, runtime state,
downstream count, epoch boundary, and authority boundary remains unchanged.

If this correction conflicts with any unrelated governing meaning, work
must stop with:

```text
PREFLIGHT_FAILURE_RECEIPT_CORRECTION_SCOPE_CONFLICT_STOP
```

## 1.2 Repository entry

| repository | fixed entry |
|---|---|
| `MassyuRed/Karen-Diary` | commit `700f749f5149cac1f8bd4bab8a364d524a56985b` |
| `MassyuRed/Cocolon` | commit `7b5fff0650137090436f137ef4604d6ffe15c56a` |
| `MassyuRed/mashos-api` | commit `a70d3c12be235381b4c63fd2f54b5319c1fd1931`, tree `ccddcf1901d2ea3cecddddc037c9c455e35cb36d` |

The Cocolon entry contains the failure receipt and the partial
postverification stop record. The mashos-api source is read-only under this
authority.

## 1.3 Normative and contextual material

| material | identity | role |
|---|---|---|
| Revised Cycle Detailed Design supplied by Mash | SHA-256 `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc` | Step ordering and product boundary |
| long-term roadmap supplied by Mash | SHA-256 `04fb9e4e11af2b1530d03d95d8e959ba644503722f72094a289bde1d4368ce5b` | long-term EmlisAI context |
| supplied historical Execution and Closure Plan | SHA-256 `31682e71ac047ac5f2f329d62ebc51b471bdcb00430a6ab35bcfb934c1438ca7` | historical navigation |
| governing reconciliation design | blob `d19258da18d3b2c8f2071b3b294b110da232d7b7`, raw SHA-256 `39650bba3930178cd96a19394a7bfe11868ef04fb30af6cf298c503c23f34eb9` | exact30 receipt contract |
| immutable failure receipt | blob `11dd115e9dffc5117f8a022000bd1d36866b1959`, raw SHA-256 `96b56a3685230174e6b9a08b6c2067cf09eed09557f8fa544eecff75876067b0`, logical SHA-256 `d7606768178abf9cad8bb3cf17b95a586654d91fb51bfc38d395669846097c27` | correction target |
| current visible local scratch script | SHA-256 `c7cacf83f1904431995aff4462e0fc3892f8a22664a8e75ff40931c206a4d0fa` | non-authority diagnostic recomputation source |

The local scratch script is not a GitHub-published production artifact and
is not treated as publication-bound evidence of the bytes used at execution
time.

# 2. Confirmed ambiguities and why correction is required

## 2.1 External-identity role was not frozen

The governing design froze the receipt path, schema, strict exact30 content,
fixed values, and logical self-hash rule. It required postpublication
external-identity verification, but did not freeze the failure receipt's
`artifact_role`.

Without the role, multiple syntactically valid exact10 objects could bind
the same path/blob/raw/logical/publication tuple and produce different
`identity_sha256` values. A role inferred from a path or schema is not a
frozen contract.

The previous partial postverification therefore correctly stopped before
constructing or claiming an exact10 external identity.

## 2.2 Challenge scalar and visible derivation do not match

The governing design, its handoff, and the immutable exact30 receipt freeze:

```text
preflight_challenge_id:
5d58979338cbc30ce603df884d466981895e05198196925e209424a129c4b0f9
```

The current visible scratch script computes a challenge from strict exact4:

```text
authority_token
event1_challenge_id
event1_identity_sha256
source_closure_sha256
```

Using the current `artifact_sha256` semantics—UTF-8, NFC-normalized strings,
sorted keys, compact JSON, no trailing LF—the visible exact4 preimage
recomputes to:

```text
6c315203ce98f635feb80b04f27ab7dcb43545f2883b8a6fcca36c8c1cb7acf4
```

It does not recompute to `5d589793...`.

The formal-parent result and the pre-correction latest-snapshot execution
record do not contain a challenge scalar or its preimage. No
publication-bound primary execution artifact proves either value as the
value actually derived during the stopped execution.

The cause of the mismatch is therefore unknown. This design does not claim
that the governing design was generated from a particular hidden preimage,
that the current scratch bytes equal the execution-time bytes, or that
either scalar was the actual executed value.

## 2.3 The failure itself is challenge-independent

The current Event1 successor-v2 bootstrap validates with issue exact0.
The preflight path passes the same object to the generic v1 bootstrap
validator, which returns `READINESS_FORBIDDEN`, and passes the successor
source closure to the historical source-closure validator, which returns
`SOURCE_CLOSURE_INVALID`.

The readiness owner requires a syntactically valid lowercase SHA-256
challenge distinct from the Event1 challenge. Both `5d589793...` and
`6c315203...` satisfy that syntactic check. More importantly, the current
owner reaches a non-empty generic-v1 bootstrap validation result and closes
with `READINESS_FORBIDDEN` before any challenge-specific identity acceptance
could make the incompatible bootstrap/source contract valid.

The stopped execution reached the builder with a JSON-compatible challenge
scalar. Regardless of that scalar's exact value—including an unknown value
different from both documented candidates—the same current bootstrap and
source closure produce the same contract failure before readiness can be
accepted.

Therefore the following facts do not depend on choosing between those two
scalars or resolving the unknown actual scalar:

```text
failure class:
BOOTSTRAP_SOURCE_RUNTIME_CONTRACT_UNREACHABLE

stop code:
PRE_RESERVATION_FORMAL_WORKER_BOOTSTRAP_STOP

formal-parent result SHA-256:
4bf8736052e7acd4d7638593f282c8ae0282a7cb94c81590bf222e79879dc6a3

formal-parent validation issues:
exact0

locked runtime materialization:
NOT_STARTED

readiness / attestation / reservation / attempt:
exact0 / exact0 / exact0 / null

formal exact134 invocation count:
0
```

This separation permits the truthful failure closure to remain valid while
forbidding a false execution-provenance claim.

# 3. Corrected failure-receipt external identity

## 3.1 Sole target

The sole external-identity target is the existing immutable receipt:

```text
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_Lineage02_Event1V2_BootstrapPreflightContractUnreachable_Failure_BodyFree_Receipt_20260728.json
```

Invalid targets include:

- the governing reconciliation Markdown;
- its design-freeze receipt;
- the current latest-snapshot record;
- this correction or this correction's receipt;
- a composite assembled from different artifacts;
- any renamed, reissued, or future replacement receipt; and
- a bare logical hash without Git/postfetch identity.

## 3.2 Newly frozen artifact role

The exact artifact role is:

```text
FORMAL_WORKER_BOOTSTRAP_PREFLIGHT_CONTRACT_UNREACHABLE_FAILURE_RECEIPT
```

This value maps the full functional meaning of the receipt's schema to one
unambiguous role. Shorter variants and variants that add
`FAILURE_CLOSURE` are not equivalent.

This role is newly frozen for this documentation/postfetch identity.
At mashos-api commit `a70d3c12...`, the production
`RECOVERY_EPOCH002_PUBLICATION_ROLES` is exact8 and does not contain this
role. The current publication-candidate builder rejects it with
`PUBLICATION_ARTIFACT_ROLE_INVALID`.

That production validator's acceptance must not be used as evidence for
this corrected documentation postverification. This design does not modify
the allowlist. Adopting the role in a future production owner would require
separate D1/D2 authority and is not authorized here.

## 3.3 Strict exact10 object

The strict exact10 keyset is:

```text
artifact_role
schema_version
repository_full_name
path
git_blob_sha1
raw_sha256
logical_artifact_sha256
publication_commit_sha1
body_free
identity_sha256
```

The fixed exact10 object is:

```json
{"artifact_role":"FORMAL_WORKER_BOOTSTRAP_PREFLIGHT_CONTRACT_UNREACHABLE_FAILURE_RECEIPT","body_free":true,"git_blob_sha1":"11dd115e9dffc5117f8a022000bd1d36866b1959","identity_sha256":"c38516c355aa450aecce332b7ad50d3db9daad13ce6f27ebdd942dc0f239a856","logical_artifact_sha256":"d7606768178abf9cad8bb3cf17b95a586654d91fb51bfc38d395669846097c27","path":"EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_Lineage02_Event1V2_BootstrapPreflightContractUnreachable_Failure_BodyFree_Receipt_20260728.json","publication_commit_sha1":"cbfb9e1e939b4d1dde7b4c1df4a59d9d7320e7ab","raw_sha256":"96b56a3685230174e6b9a08b6c2067cf09eed09557f8fa544eecff75876067b0","repository_full_name":"MassyuRed/Cocolon","schema_version":"cocolon.emlis.nls_v3.recovery_epoch002.formal_worker_bootstrap_preflight_contract_unreachable_failure_receipt.v1"}
```

## 3.4 Canonical identity hash

The `identity_sha256` is:

```text
SHA-256(
  canonical JSON of the other exact9 identity keys,
  with no trailing LF
)
```

Canonical JSON is UTF-8 with NFC-normalized and LF-normalized strings,
sorted object keys, compact separators, no duplicate keys, and no
non-finite numbers.

The exact no-LF preimage is:

```json
{"artifact_role":"FORMAL_WORKER_BOOTSTRAP_PREFLIGHT_CONTRACT_UNREACHABLE_FAILURE_RECEIPT","body_free":true,"git_blob_sha1":"11dd115e9dffc5117f8a022000bd1d36866b1959","logical_artifact_sha256":"d7606768178abf9cad8bb3cf17b95a586654d91fb51bfc38d395669846097c27","path":"EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_Lineage02_Event1V2_BootstrapPreflightContractUnreachable_Failure_BodyFree_Receipt_20260728.json","publication_commit_sha1":"cbfb9e1e939b4d1dde7b4c1df4a59d9d7320e7ab","raw_sha256":"96b56a3685230174e6b9a08b6c2067cf09eed09557f8fa544eecff75876067b0","repository_full_name":"MassyuRed/Cocolon","schema_version":"cocolon.emlis.nls_v3.recovery_epoch002.formal_worker_bootstrap_preflight_contract_unreachable_failure_receipt.v1"}
```

Its SHA-256 is:

```text
c38516c355aa450aecce332b7ad50d3db9daad13ce6f27ebdd942dc0f239a856
```

Independent jq/sha256sum and independent stable-serializer/crypto
calculations produce the same value.

The meanings remain distinct:

- `logical_artifact_sha256` is the exact30 receipt's canonical logical hash
  with its own `receipt_sha256` excluded and no trailing LF;
- `raw_sha256` is over the exact published bytes with one trailing LF;
- `git_blob_sha1` is over Git's blob header plus those exact raw bytes; and
- `identity_sha256` binds the postfetch exact9 identity tuple.

## 3.5 Historical publication and current immutability

The failure receipt publication has the following confirmed historical
context:

```text
base commit:
6996f068f95ef04d56f14915ad3e8b7310bf9ee4

publication commit:
cbfb9e1e939b4d1dde7b4c1df4a59d9d7320e7ab

parent count:
exact1

changed path count:
exact1

changed path:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_Lineage02_Event1V2_BootstrapPreflightContractUnreachable_Failure_BodyFree_Receipt_20260728.json
```

At this correction's entry head, the same path still resolves to blob
`11dd115e...` and the same raw/logical bytes.

The base, direct-parent relation, historical exact1 changed-path set, and
base-path absence above are historical observations. They are not
postverification prerequisites and must not be reintroduced as transport or
session guards.

Every later corrected postverification must freshly prove:

1. the exact target path at the frozen publication commit resolves to blob
   `11dd115e...`;
2. the same exact target path at the then-current verification ref resolves
   to the same blob and immutable content;
3. raw SHA-256 is `96b56a...` with exact1 trailing LF;
4. parsed top-level keyset is exact30 and `diagnostics` is exact4;
5. logical receipt SHA-256 independently recomputes to `d760676...`;
6. the fixed failure/stop/downstream-zero bindings match the governing
   design;
7. the exact10 object equals section 3.3;
8. the exact10 self-hash independently recomputes to `c38516c...`; and
9. the challenge-provenance qualification in section 4 is applied without
    rewriting the receipt.

# 4. Corrected challenge-provenance contract

## 4.1 Design-declared identifier

The immutable receipt value remains:

```text
5d58979338cbc30ce603df884d466981895e05198196925e209424a129c4b0f9
```

Its sole corrected meaning is:

```text
DESIGN_DECLARED_PREFLIGHT_CHALLENGE_ID_WITH_UNPROVED_EXECUTION_PROVENANCE
```

It records the identifier frozen by the governing design section 7.6 and
copied into the design-conformant exact30 receipt. It does not prove:

- the execution-time script bytes;
- the execution-time challenge preimage;
- derivation by the visible scratch script;
- observation in a readiness, attestation, reservation, or attempt artifact;
- equivalence to an actual operational preflight identity; or
- suitability as a future formal-run challenge.

The generation preimage for `5d589793...` is:

```text
UNKNOWN
```

## 4.2 Current scratch-script recomputation

The current visible scratch script exposes this exact4 diagnostic preimage:

```json
{"authority_token":"NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_POST_D2_SUCCESSOR_LINEAGE02_EVENT1_POSTVERIFIED_FORMAL_WORKER_BOOTSTRAP_PREFLIGHT_LOCKED_RUNTIME_MATERIALIZATION_BOOTSTRAP_READINESS_RECEIPT_AND_OPERATIONAL_PREFLIGHT_ATTESTATION_GENERATION_INDEPENDENT_VERIFICATION_AND_PREFLIGHT_READY_STOP_ONLY","event1_challenge_id":"2e581607f9aff5ea6a38f509f6dc7ea3626aebdcdf9f612c9646418e25b5cb2b","event1_identity_sha256":"dcb1d29ec5e0546b096111a8f84f6521b7862bc610e30f408cf0c56a29610682","source_closure_sha256":"e6d27de726f71e4f757c597862f4adcb68d2587a9ddaf619cf1dff53d06edf88"}
```

Its canonical SHA-256 is:

```text
6c315203ce98f635feb80b04f27ab7dcb43545f2883b8a6fcca36c8c1cb7acf4
```

Its sole corrected meaning is:

```text
CURRENT_SCRATCH_SCRIPT_EXACT4_PREIMAGE_RECOMPUTED_PREFLIGHT_CHALLENGE_ID
```

Because no publication-bound execution artifact preserved the
execution-time script bytes, exact preimage, or scalar,
`6c315203...` must not replace `5d589793...` in the immutable receipt and
must not be asserted as the actual executed challenge.

## 4.3 Actual executed challenge

The actual executed challenge state is:

```text
UNRESOLVED_NOT_REPLACEABLE_BY_INFERENCE
```

The overall provenance state is:

```text
UNRESOLVED_CURRENT_SCRIPT_RECOMPUTATION_MISMATCH
```

Neither the design-declared value nor the current-script recomputation may
be promoted to an execution fact without a publication-bound primary
artifact. No such artifact exists in the current lineage.

The unresolved actual value is an explicit historical unknown. It does not
authorize a rerun merely to manufacture retroactive provenance.

## 4.4 Effect on the immutable receipt

The immutable exact30 receipt remains authoritative for:

- `BOOTSTRAP_SOURCE_RUNTIME_CONTRACT_UNREACHABLE`;
- the exact4 diagnostics;
- `PRE_RESERVATION_FORMAL_WORKER_BOOTSTRAP_STOP`;
- formal-parent result validity;
- materialization/readiness/attestation non-creation;
- reservation delta exact0;
- null attempt;
- formal exact134 invocation count 0; and
- no automatic retry or progression.

Its state is:

```text
failure_closure_semantic_state:
VALID_WITH_CHALLENGE_PROVENANCE_QUALIFICATION

receipt_mutation:
FORBIDDEN

receipt_rename:
FORBIDDEN

receipt_reissuance:
FORBIDDEN
```

The receipt's:

```text
independent_verification_state:
FAILURE_REPRODUCED_AND_PARENT_RESULT_VALID
```

means exactly that the contract failure was independently reproduced and
the formal-parent result independently validated. It does not include
independent proof of the challenge-generation path.

The challenge-provenance mismatch:

```text
affects failure class:
false

affects downstream execution-identity claims:
true
```

Therefore this correction preserves failure closure while prohibiting any
downstream claim that `5d589793...` is execution-proved. No future readiness,
reservation, attempt, formal authority, or execution identity may inherit
that value as an observed runtime fact.

# 5. Corrected postverification and resumption boundary

## 5.1 Current authority stops at design freeze

This authority may:

- read and independently verify the governing artifacts;
- freeze this correction Design;
- issue this correction's body-free design receipt;
- issue a body-free Handoff;
- append the current latest-snapshot record;
- postfetch those documentation artifacts; and
- compare the entry and final Cocolon heads.

It may not claim that the earlier failure-receipt issuance authority
completed. In particular, it may not claim:

```text
FAILURE_RECEIPT_EXTERNAL_IDENTITY_POSTVERIFIED
AUTHORITY_STOP_WITHOUT_RESERVATION
EPOCH002_INVALIDATION_ELIGIBLE
```

Those claims require the next separate authority.

## 5.2 Next postverification contract

Exactly one next authority candidate is:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_POST_D2_SUCCESSOR_LINEAGE02_EVENT1_POSTVERIFIED_BOOTSTRAP_PREFLIGHT_CONTRACT_UNREACHABLE_FAILURE_CLOSURE_RECEIPT_CORRECTED_EXTERNAL_IDENTITY_AND_PREFLIGHT_CHALLENGE_PROVENANCE_POSTVERIFICATION_AND_AUTHORITY_STOP_WITHOUT_RESERVATION_ONLY
```

If separately approved, that authority must:

1. freshly postfetch the immutable failure receipt at its publication
   commit and the then-current Cocolon ref;
2. validate its exact30 content and logical hash;
3. validate the strict exact10 object and `c38516c...` identity;
4. apply the exact challenge-provenance meanings in section 4;
5. independently reconfirm that the failure is challenge-independent;
6. preserve Event1 and the existing receipt byte-for-byte;
7. create no runtime, readiness, reservation, attempt, or exact134 result;
8. append only the minimal current-authority completion record permitted by
   the then-current reflection contract; and
9. stop with `AUTHORITY_STOP_WITHOUT_RESERVATION`.

That authority may not infer the actual executed challenge, mutate or
reissue the receipt, rerun the same preflight, invalidate Epoch002, define
Epoch003, or begin source repair.

`AUTHORITY_STOP_WITHOUT_RESERVATION` is the terminal result of that newly
approved corrected-postverification authority only. It does not resume,
rewrite, or retroactively mark the earlier issuance authority complete.

Only after successful corrected postverification may the previously frozen
Epoch002-invalidation / Recovery-Epoch003-P0 parent-design authority become
eligible for separate approval. It does not become approved automatically.

# 6. Design-freeze receipt contract

Receipt path:

```text
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_Lineage02_Event1V2_BootstrapPreflightContractUnreachable_FailureReceiptExternalIdentityAndChallengeProvenance_ContractCorrection_Design_ReadOnly_BodyFree_Receipt_20260729.json
```

Schema:

```text
cocolon.emlis.nls_v3.recovery_epoch002.preflight_failure_receipt_external_identity_challenge_provenance_contract_correction_design_frozen_receipt.v1
```

The top-level keyset is strict exact29:

```text
schema_version
approved_authority_token
automatic_progression
body_free
cocolon_entry_commit_sha1
correction_design_path
correction_design_raw_sha256
current_scratch_challenge_recomputation
design_declared_preflight_challenge
failure_closure_semantic_state
failure_receipt_external_identity
failure_receipt_external_identity_postverification_state
failure_receipt_path
failure_receipt_publication_commit_sha1
governing_design_path
governing_design_raw_sha256
actual_executed_challenge_state
challenge_execution_provenance_state
challenge_provenance_affects_failure_class
challenge_provenance_affects_downstream_execution_identity_claim
immutable_receipt_disposition
karen_diary_commit_sha1
mashos_api_change_count
mashos_api_commit_sha1
mashos_api_tree_sha1
next_authority_token
state
test_execution_count
receipt_sha256
```

Nested keysets are:

```text
failure_receipt_external_identity:
strict exact10 from section 3.3

design_declared_preflight_challenge:
strict exact3
identifier
generation_preimage_state
provenance_state

current_scratch_challenge_recomputation:
strict exact6
scratch_script_raw_sha256
authority_token
event1_challenge_id
event1_identity_sha256
source_closure_sha256
recomputed_preflight_challenge_id

immutable_receipt_disposition:
strict exact3
mutation
rename
reissuance
```

Required postverification-state value:

```text
failure_receipt_external_identity_postverification_state:
EXACT10_FROZEN_NOT_YET_POSTVERIFIED_UNDER_CORRECTED_AUTHORITY
```

`receipt_sha256` is the canonical logical SHA-256 over the other exact28
top-level keys with no trailing LF. The published receipt bytes use sorted
compact JSON and exactly one trailing LF.

The correction receipt does not embed its own future publication
commit/blob/raw identity.

# 7. GitHub reflection boundary

The approved Cocolon documentation reflection is exact4 paths:

```text
new correction Design
new correction body-free design receipt
new correction Handoff
modified Cocolon_前提資料/07_latest_snapshot_diff.md
```

Exact counts:

```text
new paths:
3

modified paths:
1

deleted paths:
0

mashos-api paths:
0
```

Each connector write must start from a freshly verified current main, must
confirm a new target is absent or the update target's blob is exact, and
must be postfetched before the next write. The aggregate entry-to-final
compare must contain exactly the four paths above.

The tracked Execution and Closure Plan is not changed because this authority
does not transition epochs, modify production contracts, or authorize
execution.

# 8. Work not permitted

```text
existing failure receipt mutation / rename / reissue:
0 / 0 / 0

mashos-api source / test / config / schema / fixture / lock change:
0 / 0 / 0 / 0 / 0 / 0

test / collection / causal RED / targeted GREEN / formal exact134:
NOT_RUN / NOT_RUN / NOT_RUN / NOT_RUN / NOT_RUN

runtime materialization / readiness / attestation:
0 / 0 / 0

reservation / attempt:
0 / 0

candidate / Event1 / Event2:
0 / 0 / 0

Epoch002 invalidation / Epoch003 definition:
0 / 0

P2 / Product Read / Cycle001 acceptance:
NOT_STARTED / NOT_STARTED / NOT_ACCEPTED

private body:
0
```

# 9. Facts, inference, unknowns, and Karen opinion

## 9.1 Confirmed facts

- the existing receipt is strict exact30 and its logical hash independently
  recomputes;
- its publication path/blob/raw/logical identity is stable at the correction
  entry;
- its `artifact_role` was not previously frozen;
- the newly frozen exact10 identity independently hashes to `c38516c...`;
- the governing design/handoff/receipt contain `5d589793...`;
- the visible scratch exact4 recomputes to `6c315203...`;
- no publication-bound primary execution artifact records the actual
  challenge scalar or preimage;
- the failure diagnostics and stop are caused by bootstrap/source contract
  incompatibility rather than the choice between those two SHA-256 values;
- materialization, readiness, attestation, reservation, attempt, and formal
  exact134 remain absent; and
- this authority makes no mashos-api change and executes no test.

## 9.2 Inference

The role chosen in section 3 is the smallest unambiguous mapping from the
receipt's schema and function. Other shorter roles were possible before this
correction, which is why the role must be explicitly frozen rather than
treated as previously implied.

The current visible scratch recomputation is useful evidence of a mismatch,
but it is insufficient evidence of execution-time provenance. Treating the
actual challenge as unresolved is the only conclusion that does not turn
local current bytes into historical primary evidence.

The failure closure can remain valid because its cause and exact-zero
downstream effects are independent of the disputed challenge scalar.

## 9.3 Unknown and not written

This correction does not know or decide:

- the preimage that generated `5d589793...`;
- the exact execution-time scratch-script bytes;
- the actual executed challenge scalar;
- whether the mismatch began in design drafting, local execution material,
  or later receipt construction;
- any future runtime/readiness/reservation/formal challenge;
- any Epoch003 schema/path/keyset/source/runtime identity;
- any D1/D2 repair bytes or results;
- any future candidate/Event1/terminal/accepted identity; or
- Cycle001 acceptance.

These values may not be inferred from this correction.

## 9.4 Karen opinion

Karen judges it necessary to preserve both sides of the record without
making either more certain than the evidence allows. Replacing
`5d589793...` with `6c315203...` would rewrite an immutable, design-conformant
receipt using non-public current scratch evidence. Calling `5d589793...`
execution-derived would make an equally unsupported claim.

The truthful correction is therefore to preserve the exact30 receipt as the
failure-closure artifact, qualify the challenge field as design-declared,
record the current-script recomputation as a separate diagnostic, and keep
the actual executed value unresolved. That retains the valid failure
history while preventing a false challenge lineage from reaching a future
readiness or formal run.

# 10. Result and authority stop

```text
CURRENT_AUTHORITY_RESULT:
RECOVERY_EPOCH002_PREFLIGHT_FAILURE_RECEIPT_EXTERNAL_IDENTITY_AND_CHALLENGE_PROVENANCE_CONTRACT_CORRECTION_DESIGN_FROZEN_AUTHORITY_STOP

FAILURE_RECEIPT_EXTERNAL_IDENTITY:
EXACT10_FROZEN_NOT_YET_POSTVERIFIED_UNDER_CORRECTED_AUTHORITY

FAILURE_RECEIPT_EXTERNAL_IDENTITY_SHA256:
c38516c355aa450aecce332b7ad50d3db9daad13ce6f27ebdd942dc0f239a856

FAILURE_CLOSURE_SEMANTIC_STATE:
VALID_WITH_CHALLENGE_PROVENANCE_QUALIFICATION

DESIGN_DECLARED_PREFLIGHT_CHALLENGE:
5d58979338cbc30ce603df884d466981895e05198196925e209424a129c4b0f9

CURRENT_SCRATCH_RECOMPUTED_PREFLIGHT_CHALLENGE:
6c315203ce98f635feb80b04f27ab7dcb43545f2883b8a6fcca36c8c1cb7acf4

ACTUAL_EXECUTED_CHALLENGE:
UNRESOLVED_NOT_REPLACEABLE_BY_INFERENCE

CHALLENGE_EXECUTION_PROVENANCE_STATE:
UNRESOLVED_CURRENT_SCRIPT_RECOMPUTATION_MISMATCH

EXISTING_FAILURE_RECEIPT:
BYTE_IMMUTABLE_NO_REISSUANCE

EVENT1:
PUBLISHED_POSTVERIFIED_IMMUTABLE_SOURCE_BASELINE_LOCKED

RUNTIME / READINESS / ATTESTATION / RESERVATION / ATTEMPT / EXACT134:
0 / 0 / 0 / 0 / 0 / 0

EPOCH002_INVALIDATION / EPOCH003:
NOT_ISSUED / NOT_DEFINED

MASHOS_API_WRITE / TEST_EXECUTION:
0 / 0

P2 / PRODUCT_READ / CYCLE001:
NOT_STARTED / NOT_STARTED / NOT_ACCEPTED

AUTOMATIC_PROGRESSION:
false

AUTHORITY_STOP
```

No authority progresses automatically.
