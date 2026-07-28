---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch003_d1_bootstrap_oracle_correction_causal_red_refreeze_handoff
title: "NLS v3 Step 11 Cycle001 Recovery Epoch003 D1 bootstrap oracle correction and causal RED refreeze handoff"
recorded_on_jst: "2026-07-29"
body_free: true
---

# Recovery Epoch003 D1 bootstrap oracle correction and causal RED refreeze handoff

## Confirmed facts

Mash approved and Karen completed:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_D1_BOOTSTRAP_FORMAL_EXACT134_MANIFEST_AND_REFERENCE_RUNTIME_ROOT_IDENTITY_BINDING_ORACLE_CORRECTION_AND_CAUSAL_RED_REFREEZE_ONLY
```

The governing P0 external identity remains:

```text
74286b862eeee1663d2758ee18d1e848316da6fc27b12fef38c149c5a2b52f36
```

The first D1 receipt external identity is retained as historical evidence:

```text
e4ae6128eed6e20f2efdb9e302345ecaeec93a3cc395453b64d7faeb1454c777
```

It is not the current oracle authority.

### Corrected exact1 D1 test

Exactly one existing mashos-api test was corrected:

```text
path:
ai/tests/test_emlis_nls_v3_recovery_epoch003_bootstrap_source_runtime_expected_observed_contract_red.py

entry / parent commit:
bcf164ce208fc8ebbf6c24bbfea42e3bd1a6ca98

entry tree:
ac813f00af0d4e4b587d916daf4513782c50918f

publication commit:
a9f0a89b89afd6b9270034b5e44aa53aca7bf1ef

publication tree:
6bc1bf20d967f7a99ff92e6276a574e8f0fbd860

Git blob:
dda02f15be90387dd045ef117a5961961e2cae2b

raw SHA-256:
8c8fcaf5211064ca59127a8081dc41ae8b9207472f070746c84a8e4b591a07e5

lines / bytes / trailing LF:
2222 / 80981 / exact1
```

Entry-to-publication compare is ahead one, behind zero, total one. The only
changed path is the D1 test, with 86 additions and 12 deletions. Production
change count is zero. Postfetch content is byte-identical to the locally
verified test.

### Exact2 oracle corrections

1. The future formal-worker bootstrap manifest and argv now use the
   authoritative Step00--10 formal exact134 ordered sequence instead of the
   D1 exact30 oracle denominator.
2. The operational observation now binds the reference materialization-root
   identity instead of the reference artifact external-identity hash.

The exact30 D1 oracle denominator remains independent and unchanged:

```text
ordered exact30 full-node array SHA-256:
0bef6ece47573ce982f8beb57c0c711fa907b927f310760b286f6dd2a594bb0a

ordered exact30 failure-signature array SHA-256:
ecdc0031b2e93255b0e1a6384502843a0307c3791558d08d94dd77f79cccc852
```

The corrected future bootstrap manifest is:

```text
formal nodes:
exact134 / exact134 unique

Step00--10 counts:
4 / 9 / 14 / 23 / 19 / 16 / 5 / 8 / 9 / 11 / 16

ordered exact134 node-array SHA-256:
0ab1039a35b8621a257617688cc5d63bb331f5c32dd08f34df1173a6b9e57118

formal test-source manifest:
exact21

formal test-source manifest SHA-256:
4c277ea65b85cccb2ea779d4a2cc9dbd168d4c2a825c847c28f5a08d4b1b4dfb
```

The runtime-root bindings are:

```text
reference materialization root:
a300e3153933fdc893ad259ce99a8c493f20ccf7d57dbece09b130501d80270f

operational materialization root:
e6f5b328dcafe9bdb0b0d79e9e98097426c113d50e54b6ba9f8fa79d4405fdde

distinct:
true
```

The authoritative registry used to derive exact134 is:

```text
path:
ai/services/ai_inference/emlis_ai_recovery_epoch001_current_step_requirement_registry_v3.py

Git blob:
c2bef050d410cd823a8605bb86a44d13793fe06e

raw SHA-256:
b5d40243578d7b6118cafd827f07de1b181ea9c1274f686447c9d031e112a8f9
```

### Corrected causal RED

Syntax, correction-authority checks, embedded static contracts, exact30 /
exact134 / exact21 separation checks, root-binding checks, and collection
passed before execution.

```text
30 collected
0 passed
30 causal failed
0 errors
0 skipped / xfailed / xpassed / deselected
0 unexpected
exit 1
collection 0.19s
targeted pytest 0.51s
```

Every exact30 node ended at its unique case marker and
`RECOVERY_EPOCH003_BOOTSTRAP_SOURCE_RUNTIME_CONTRACT_NOT_IMPLEMENTED`.
The exact7 production owners remain byte-identical. Their canonical
manifest SHA-256 remains:

```text
6cc92b69bf85b1ad903cfcccb7860e324f84823d8f3c23f4a97b6831f182f1d3
```

Independent read-only contract and scope audits both passed. Subagents did
not edit files, execute tests, make commits, or write to GitHub. Karen
performed the final verification and every GitHub write.

### Result evidence

```text
path:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_D1_BootstrapFormalExact134ManifestAndReferenceRuntimeRootIdentityBinding_OracleCorrectionAndCausalREDRefreeze_Result_20260729.md

publication commit:
644cbb6972dbb49be2b8d6a37596f27a807f172c

Git blob:
25915d7f273ee428bc78c9bd5c3473b700490e1f

raw SHA-256:
c75cac41c6a2845983943bbc92a1daa69c360b12d207dc8c2b2bfb8155c01107
```

### Body-free receipt

```text
path:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_D1_BootstrapFormalExact134ManifestAndReferenceRuntimeRootIdentityBinding_OracleCorrectionAndCausalREDRefreeze_BodyFree_Receipt_20260729.json

publication commit:
31601a4f5ea3583ef1e9a839c55a8ace7677fd3e

Git blob:
1ad1d3610916f48a3d7adafac76fcb93c4d47538

raw SHA-256:
0b6e491dedeb684b3f7d32b3a3acd231fbc724b994a75b1419c855428894a405

logical receipt SHA-256:
cabe7aa0d50e94083edfd95b4641383aaa9ff11e44e60e7ea538e93252490370

top-level / logical preimage:
exact25 / exact24
```

The corrected receipt external identity is strict exact10:

```json
{"artifact_role":"RECOVERY_EPOCH003_D1_BOOTSTRAP_ORACLE_CORRECTION_CAUSAL_RED_REFREEZE_RECEIPT","body_free":true,"git_blob_sha1":"1ad1d3610916f48a3d7adafac76fcb93c4d47538","identity_sha256":"d9164d82715abb519b549a7581737a37ebd3bf153b53284697cbe4573a8edb9e","logical_artifact_sha256":"cabe7aa0d50e94083edfd95b4641383aaa9ff11e44e60e7ea538e93252490370","path":"EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_D1_BootstrapFormalExact134ManifestAndReferenceRuntimeRootIdentityBinding_OracleCorrectionAndCausalREDRefreeze_BodyFree_Receipt_20260729.json","publication_commit_sha1":"31601a4f5ea3583ef1e9a839c55a8ace7677fd3e","raw_sha256":"0b6e491dedeb684b3f7d32b3a3acd231fbc724b994a75b1419c855428894a405","repository_full_name":"MassyuRed/Cocolon","schema_version":"cocolon.emlis.nls_v3.recovery_epoch003.d1_bootstrap_oracle_correction_causal_red_refreeze_receipt.v1"}
```

Its exact9 canonical preimage derives:

```text
d9164d82715abb519b549a7581737a37ebd3bf153b53284697cbe4573a8edb9e
```

The result and corrected receipt are the checkpoint evidence. This handoff,
the tracked-plan append, and the latest-snapshot append are reflection
records. The original D1 artifacts remain preserved as historical evidence;
no file was deleted or rewritten.

## Inference

Because all exact30 independent oracle nodes reach their intended missing
production boundary after the exact134-manifest and reference-root
corrections, while exact7 production bytes remain unchanged, the corrected
RED isolates the absent additive Epoch003 contract. The run no longer
depends on either of the two P0-inconsistent oracle substitutions.

## Karen's opinion

The responsible state is to treat the corrected bytes, not the first D1
bytes, as the sole input to any future D2 implementation. The earlier D2
approval preceded this correction checkpoint and must not be silently
reused. A new explicit D2 approval is necessary so that implementation is
reviewed against the corrected exact1 immutable oracle.

## Scope and stop

```text
mashos-api:
exact1 corrected test / exact0 production

Cocolon:
exact5 append-only correction/reflection paths

reference / operational runtime materialization:
0 / 0

candidate / Event1 / readiness:
0 / 0 / 0

reservation / attempt / exact134 invocation:
0 / 0 / 0

private body:
0

P2 / Product Read / Cycle001:
NOT_STARTED / NOT_STARTED / NOT_ACCEPTED

state:
RECOVERY_EPOCH003_D1_ORACLE_CORRECTED_CAUSAL_RED_REFROZEN_AUTHORITY_STOP

automatic progression:
false
```

Exactly one next logical authority:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_D2_BOOTSTRAP_SOURCE_RUNTIME_EXPECTED_OBSERVED_SEPARATION_SCHEMA_PAIR_DISPATCH_EVENT1_IMMUTABILITY_AND_INDEPENDENT_OPERATIONAL_PROJECTION_IMPLEMENTATION_AND_TARGETED_GREEN_ONLY
```

It requires a new, separate explicit approval after this correction
checkpoint.
