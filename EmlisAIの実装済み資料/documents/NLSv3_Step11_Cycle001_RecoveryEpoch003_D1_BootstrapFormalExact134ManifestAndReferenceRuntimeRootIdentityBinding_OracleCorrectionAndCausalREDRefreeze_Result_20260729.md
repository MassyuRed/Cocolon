---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch003_d1_bootstrap_oracle_correction_causal_red_refreeze_result
title: "NLS v3 Step 11 Cycle001 Recovery Epoch003 D1 bootstrap oracle correction and causal RED refreeze result"
recorded_on_jst: "2026-07-29"
body_free: true
---

# Recovery Epoch003 D1 bootstrap oracle correction and causal RED refreeze result

## 1. Authority and boundary

Mash explicitly approved:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_D1_BOOTSTRAP_FORMAL_EXACT134_MANIFEST_AND_REFERENCE_RUNTIME_ROOT_IDENTITY_BINDING_ORACLE_CORRECTION_AND_CAUSAL_RED_REFREEZE_ONLY
```

This authority permits correction of exactly one existing D1 oracle path,
one corrected targeted causal RED execution, independent read-only
verification, and append-only Cocolon reflection.

It does not permit production implementation or GREEN, an external fixture,
config, schema, dependency, lock, or other existing-test change, reference
or operational runtime materialization, candidate allocation, Event1,
readiness publication, reservation, attempt, formal exact134 invocation,
P2, Product Read, or Cycle001 acceptance.

## 2. Confirmed facts

### 2.1 Fixed entry and governing identities

| Repository / authority | Fixed identity |
|---|---|
| Karen-Diary | `700f749f5149cac1f8bd4bab8a364d524a56985b` |
| Cocolon entry | `8979e353c7c3cc02d3ecfcce409703f247b10cb7` |
| mashos-api entry | `bcf164ce208fc8ebbf6c24bbfea42e3bd1a6ca98` |
| mashos-api entry tree | `ac813f00af0d4e4b587d916daf4513782c50918f` |
| Recovery Epoch003 P0 external identity | `74286b862eeee1663d2758ee18d1e848316da6fc27b12fef38c149c5a2b52f36` |
| historical D1 receipt external identity | `e4ae6128eed6e20f2efdb9e302345ecaeec93a3cc395453b64d7faeb1454c777` |

The historical D1 receipt and its published bytes are retained. They are
history of the first RED freeze, not authority to preserve the two incorrect
fixture bindings.

### 2.2 Detected contract conflict exact2

The first D1 oracle had two contradictions with the P0 parent design:

1. The exact30 D1 oracle node list was also used as the future bootstrap
   `formal_test_node_ids` and formal-worker argv. P0 requires the
   authoritative Step00--10 formal exact134 sequence.
2. The operational observation field
   `reference_runtime_root_identity_sha256` contained the reference
   artifact external-identity hash instead of the reference
   materialization root identity.

The original D1 test identity was:

```text
Git blob:
a469f4a71a69972f278b3a2cc1f6802c2f1bfa97

raw SHA-256:
3274af7cce8ad2d6cbbacee33aac28eddff1fc4ed90274d7fa190d54763c72df

lines / bytes:
2148 / 78447
```

A P0-strict D2 validator could not accept that fixture and also make the
exact30 GREEN. Therefore D2 remained unstarted and production exact7
remained unchanged.

### 2.3 Corrected exact1 test publication

Exactly one path was modified:

```text
ai/tests/test_emlis_nls_v3_recovery_epoch003_bootstrap_source_runtime_expected_observed_contract_red.py
```

| Field | Value |
|---|---|
| Repository | `MassyuRed/mashos-api` |
| Parent commit | `bcf164ce208fc8ebbf6c24bbfea42e3bd1a6ca98` |
| Publication commit | `a9f0a89b89afd6b9270034b5e44aa53aca7bf1ef` |
| Publication tree | `6bc1bf20d967f7a99ff92e6276a574e8f0fbd860` |
| Git blob SHA-1 | `dda02f15be90387dd045ef117a5961961e2cae2b` |
| Raw SHA-256 | `8c8fcaf5211064ca59127a8081dc41ae8b9207472f070746c84a8e4b591a07e5` |
| Lines / bytes / trailing LF | `2222 / 80981 / exact1` |
| Diff | `86 additions / 12 deletions` |
| Compare | `ahead 1 / behind 0 / total commits 1` |
| Changed test / production paths | `exact1 / exact0` |
| Force update | `false` |

GitHub postfetch content equals the locally executed final bytes. The
recomputed Git blob equals the GitHub blob.

The original D1 authority remains present for lineage. The exact correction
authority is separately frozen in the test and checked by the embedded
static contract.

### 2.4 Oracle exact30 and formal-worker exact134 separation

The D1 oracle denominator remains exact30. Its node names, order, test
bodies, case matrix, failure classes, STOP code, readiness/failure
assertions, and canonical array hash remain unchanged:

```text
D1 oracle node count:
30

D1 oracle ordered node-array SHA-256:
0bef6ece47573ce982f8beb57c0c711fa907b927f310760b286f6dd2a594bb0a
```

The future formal-worker bootstrap fixture now binds the authoritative
Step00--10 registry:

```text
registry path:
ai/services/ai_inference/emlis_ai_recovery_epoch001_current_step_requirement_registry_v3.py

registry Git blob:
c2bef050d410cd823a8605bb86a44d13793fe06e

registry raw SHA-256:
b5d40243578d7b6118cafd827f07de1b181ea9c1274f686447c9d031e112a8f9

Step00..10 counts:
4 / 9 / 14 / 23 / 19 / 16 / 5 / 8 / 9 / 11 / 16

formal node count / unique count:
134 / 134

ordered exact134 node-array SHA-256:
0ab1039a35b8621a257617688cc5d63bb331f5c32dd08f34df1173a6b9e57118

formal test source-manifest path count:
21

formal test manifest SHA-256:
4c277ea65b85cccb2ea779d4a2cc9dbd168d4c2a825c847c28f5a08d4b1b4dfb

formal-worker argv:
prefix exact6 + formal nodes exact134
```

The exact30 list is now named as the oracle list. It is not used as the
future formal-worker manifest.

### 2.5 Corrected reference runtime-root binding

The reference observation supplies:

```text
reference runtime-root identity SHA-256:
a300e3153933fdc893ad259ce99a8c493f20ccf7d57dbece09b130501d80270f
```

The operational observation now binds that exact value in:

```text
reference_runtime_root_identity_sha256
```

Its own operational runtime root remains:

```text
e6f5b328dcafe9bdb0b0d79e9e98097426c113d50e54b6ba9f8fa79d4405fdde
```

The two materialization-root identities are distinct. The reference
external identity remains separately bound through the source/bootstrap and
Event1 contracts; it is no longer substituted for a runtime-root identity.

### 2.6 Corrected targeted causal RED

The isolated runner distributions were:

```text
pytest 8.4.1
iniconfig 2.3.0
packaging 26.2
pluggy 1.6.0
pygments 2.20.0
```

Before execution:

```text
Python syntax:
PASS

correction authority:
PASS

embedded exact30 / exact134 / exact21 / root-binding contract:
PASS

pytest collection:
30 collected / 0 collection errors
```

The targeted execution used:

```text
PYTHONDONTWRITEBYTECODE=1
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1
python -m pytest -q --tb=short --disable-warnings --noconftest \
  -p no:cacheprovider \
  ai/tests/test_emlis_nls_v3_recovery_epoch003_bootstrap_source_runtime_expected_observed_contract_red.py
```

Authoritative result:

```text
collected: 30
passed: 0
causal failed: 30
errors: 0
skipped / xfailed / xpassed / deselected: 0 / 0 / 0 / 0
unexpected failures: 0
exit code: 1
elapsed: 0.51s
```

Every node failed at its unique `S01..S04`, `R01..R06`, `E01..E04`,
`I01..I03`, `F01..F05`, `P01..P04`, or `A01..A04` signature followed by:

```text
RECOVERY_EPOCH003_BOOTSTRAP_SOURCE_RUNTIME_CONTRACT_NOT_IMPLEMENTED
```

The ordered signature-array SHA-256 remains:

```text
ecdc0031b2e93255b0e1a6384502843a0307c3791558d08d94dd77f79cccc852
```

There was no syntax, import, collection, fixture-construction, plugin,
static-contract, or assertion-oracle failure before the missing-contract
boundary.

### 2.7 Unchanged production and external surfaces

The strict exact7 future D2 production owner manifest is unchanged. Its
canonical identity remains:

```text
6cc92b69bf85b1ad903cfcccb7860e324f84823d8f3c23f4a97b6831f182f1d3
```

The entry-to-publication compare contains exactly one modified D1 test.
There are no production, external fixture, config, schema, dependency,
lock, API, DB, RN, account, subscription, access-policy, or user-data
changes.

### 2.8 Independent verification

Two read-only subagent lanes checked:

- P0 contract resolution and correction-authority traceability;
- exact path scope, final bytes, exact30 preservation, exact134 binding,
  root binding, and production invariance.

Their edits, test runs, commits, and GitHub writes were exact0. Karen
rechecked their findings against the governing files, executed the final
static and targeted tests, performed the GitHub write, and postfetched the
published target.

## 3. Inference

After separating the D1 oracle denominator from the future formal-worker
manifest and binding the actual reference materialization root, the two P0
contradictions are absent. The corrected exact30 still reaches only the
missing additive Epoch003 API boundary. Therefore the RED again isolates
the intended absent D2 production contract rather than a malformed oracle.

## 4. Karen's opinion

The correct repair was to amend the oracle, not weaken future validators.
Keeping the historical receipt while issuing new correction evidence
preserves why the first freeze was wrong without pretending it never
occurred.

D1 is now usable as a D2 implementation contract. D2 must still be a
separate authority and must not start automatically.

## 5. Scope and stop

```text
mashos-api:
exact1 existing D1 test correction / exact0 production

Cocolon:
exact5 append-only correction reflection paths

reference / operational runtime materialization:
0 / 0

candidate / Event1 / readiness:
0 / 0 / 0

reservation / attempt / formal exact134 invocation:
0 / 0 / 0

source baseline:
UNLOCKED

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

It requires a new explicit approval after this correction checkpoint.
