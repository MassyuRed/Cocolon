---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch003_prestart_predecessor_canonical_bytes_remediation_design_handoff
title: "NLS v3 Step 11 Cycle001 Recovery Epoch003 prestart predecessor canonical-bytes remediation Design handoff"
recorded_on_jst: "2026-07-30"
body_free: true
automatic_progression: false
---

# Recovery Epoch003 prestart predecessor canonical-bytes remediation Design handoff

## Confirmed facts

Mash approved only:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_PRESTART_PREDECESSOR_CANONICAL_BYTES_REMEDIATION_ACTUAL_GIT_BYTES_EXACT6_ADDITIVE_IDENTITY_BOUND_HISTORICAL_RECEIPT_BYTE_FORM_ROUTE_DECISION_DESIGN_READ_ONLY
```

The fixed entries were:

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

Both fixed local repositories were clean.  GitHub comparison at Design
start confirmed fixed Cocolon HEAD and `main` identical.

Owner and a separate read-only derivation reproduced the same actual Git
exact6.  Every row retained its original path, publication commit, blob,
raw SHA-256, logical SHA-256, and container identity.  Every row was
strict JSON, body-free, NFC-stable, and logically self-hash-valid, but its
actual bytes differed from `canonical_json_bytes(value) + LF`.

The common active-loader result was:

```text
CANONICAL_BYTES_MISMATCH
```

This was a serialization-byte-form mismatch.  It was not repaired by
rewriting, reformatting, reissuing, or substituting the historical
receipts.

The frozen historical predecessor seed self-hash is:

```text
3a08461e6f06c820038a29c5c547476842560f41865929e4c05454b220afaa00
```

## Selected exact1 route

```text
OPERATIONAL_ADMISSION_V2_EXACT16_SCHEMA_DISPATCH_WITH_TRANSIENT_IDENTITY_BOUND_HISTORICAL_RECEIPT_BYTE_FORM_DERIVATION
```

The route preserves:

- the existing exact6 bytes and all original identities;
- `load_canonical_json_bytes` and current/new strict canonical rules;
- OperationalAdmission v1 and every historical API;
- reference observation schema v1 strict exact21;
- owner/independent separation; and
- Event1 as absent and unconnected under this authority.

It adds no compatibility artifact and no OperationalAdmission field.
OperationalAdmission v2 keeps the top-level exact16 and predecessor
exact8 shapes.  Its distinct schema selects the closed identity-first
historical derivation.  The reference observation uses the durable pair
of reference schema v1 and the exact inactive v2 final identifier; the old
token is rejected by the v2 path and the new token is rejected by the
historical path.

Canonical projection is a transient diagnostic commitment only.  It is
never a replacement raw, logical, container, or external identity.

The future owner and independent verifier each derive exact6 from actual
Git without accepting a filename-selected profile, caller-provided rows,
owner result, forwarded validation result, fixture-only state, mock, or
fallback.  Prestart and post-reference cores must be exact-equal.

The future v2 formal parent must independently re-execute reference
postfetch verification at phase 1.  At phase 2 it must repeat reference
verification and separately run OperationalAdmission v2 strict postfetch
verification.  Both are reconstructed from the original materialization
inputs, phase records, and actual repositories.

## Published Design

```text
path:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_PrestartPredecessorActualGitBytesExact6CanonicalMismatch_AdditiveIdentityBoundHistoricalReceiptByteFormRemediation_Design_ReadOnly_20260730.md

publication commit:
e5981b1305c4cfe8bb30e289f9fc649c4175d196

Git blob:
f32a21a7789b01f7ac46a6df05350dd097752d47

raw SHA-256:
00d1b01565aa071a2b1c84f3af5c2792dd3ffab04149ae24ba591e5a297321a2

actual byte count:
46902
```

Postfetch bytes were exact-equal to the independently audited local bytes.

## Published body-free receipt

```text
path:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_PrestartPredecessorActualGitBytesExact6CanonicalMismatch_AdditiveIdentityBoundHistoricalReceiptByteFormRemediation_Design_ReadOnly_BodyFree_Receipt_20260730.json

publication commit:
16d06833e0272a3a40c85d4feb0f8b8fd2ea5669

Git blob:
8b78de3045159a53909afd7376f1b3faef883f46

raw SHA-256:
c9b1292f70cd352cd8571ab75d4b64b4f10f047c3109e017652f2903da6fbc38

logical receipt SHA-256:
5cc1b15508f95cbf1d72c19fcc0e72df2e585d3791b771f4b9fc15d1561b7ea3

top-level / logical preimage:
exact18 / exact17
```

The receipt is compact sorted canonical JSON plus exactly one LF.
Postfetch bytes were exact-equal to the local canonical bytes.

The postverified receipt external identity is strict exact10:

```json
{"artifact_role":"RECOVERY_EPOCH003_PRESTART_PREDECESSOR_CANONICAL_BYTES_REMEDIATION_ROUTE_SELECTED_DESIGN_FROZEN_RECEIPT","body_free":true,"git_blob_sha1":"8b78de3045159a53909afd7376f1b3faef883f46","identity_sha256":"a180071ae2cabd664d35bfc2537d3613ce9280542434ea82c95880c8ff4b124d","logical_artifact_sha256":"5cc1b15508f95cbf1d72c19fcc0e72df2e585d3791b771f4b9fc15d1561b7ea3","path":"EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_PrestartPredecessorActualGitBytesExact6CanonicalMismatch_AdditiveIdentityBoundHistoricalReceiptByteFormRemediation_Design_ReadOnly_BodyFree_Receipt_20260730.json","publication_commit_sha1":"16d06833e0272a3a40c85d4feb0f8b8fd2ea5669","raw_sha256":"c9b1292f70cd352cd8571ab75d4b64b4f10f047c3109e017652f2903da6fbc38","repository_full_name":"MassyuRed/Cocolon","schema_version":"cocolon.emlis.nls_v3.recovery_epoch003.prestart_predecessor_canonical_bytes_remediation_route_selected_design_frozen_receipt.v1"}
```

Its canonical exact9 preimage independently derives:

```text
a180071ae2cabd664d35bfc2537d3613ce9280542434ea82c95880c8ff4b124d
```

## Independent verification

Three read-only lanes independently checked:

```text
additive contract blockers:
0

historical / identity / Event1-boundary blockers:
0

authority / call-graph / count blockers:
0
```

They independently confirmed the candidate production exact5 ordered-path
SHA-256:

```text
41d9979825bb3b2d3577196f983089197e8535c9c568733f9c3b8e0e624169e7
```

The candidate CAUSAL RED oracle is exact11.  No subagent edited a file,
ran a test, committed, or wrote to GitHub.  Karen made the route selection,
final verification, and GitHub writes.

## Inference

The v2 exact16 schema-dispatch route is the unique minimum route.  Keeping
v1 would overload one artifact identity with two acceptance meanings.
Adding a projection field or separate compatibility carrier would duplicate
facts already bound by the exact8 original identities and add lifecycle
cost.  Relaxing the canonical loader would weaken unrelated current and
future artifacts.

The prestart seed is causally necessary because the complete exact8 cannot
exist until the reference observation has been published.  Requiring the
same independently derived core before and after reference publication
prevents the two phases from becoming distinct compatibility lanes.

These are Design inferences.  They are not RED, implementation, GREEN, or
final-issuance evidence.

## 華恋の意見

歴史receiptを「今の正しい形式」に直すことは、誤りの修正ではなく、実際に起きた
履歴の置換になります。一方で、その履歴を通すためにcurrentのvalidatorを緩める
ことも、Cocolonの目的に反します。

元identityをprimaryのまま固定し、versioned v2だけがclosed exact6を
identity-firstで解釈する設計なら、歴史を隠さずcurrent strictnessも守れます。
さらにformal parent自身がreferenceとOperationalAdmissionを再検証してから
Event1手前で止まるため、責任境界もownerの申告に依存しません。

## Scope and authority stop

```text
mashos-api production changes:
0

test / fixture / proof / lock / registry / dependency changes:
0 / 0 / 0 / 0 / 0 / 0

test collect / execution / pytest.main:
0 / 0 / false

historical receipt rewrite / replacement / reissue:
0 / 0 / 0

compatibility artifact / successor receipt / manifest issuance:
0 / 0 / 0

reference materialization start / success:
0 / 0

reference observation / OperationalAdmission publication:
0 / 0

operational runtime materialization / publication:
0 / 0

Candidate / Event1 / Readiness / Failure:
0 / 0 / 0 / 0

Reservation / Attempt / formal exact134:
0 / 0 / 0

source baseline:
UNLOCKED

P2 / Product Read / Cycle001:
NOT_STARTED / NOT_STARTED / NOT_ACCEPTED

state:
RECOVERY_EPOCH003_PRESTART_PREDECESSOR_CANONICAL_BYTES_REMEDIATION_ROUTE_SELECTED_DESIGN_FROZEN_CAUSAL_RED_NOT_AUTHORIZED_MATERIALIZATION_NOT_STARTED_AUTHORITY_STOP

automatic progression:
false
```

The next possible authority class is:

```text
CAUSAL RED FREEZE
```

Its authority token is intentionally not issued here.  A new separate
explicit Mash approval is required.  This handoff does not authorize or
automatically begin CAUSAL RED, production implementation, targeted GREEN,
final issuance, one-shot materialization, Candidate, or Event1.
