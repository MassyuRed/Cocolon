---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch003_prestart_d2_identity_preimage_mismatch_downstream_credit_partial_epoch004_p0_disposition_reconciliation_handoff
title: "Recovery Epoch003 prestart D2 receipt identity-preimage mismatch and partial Recovery Epoch004 P0 disposition reconciliation handoff"
revision_date: "2026-07-30"
status: "READ_ONLY_HANDOFF_AUTHORITY_STOP"
body_free: true
automatic_progression: false
---

# Recovery Epoch003 D2 identity-preimage reconciliation handoff

## 0. Authority and decision

Approved authority:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_PRESTART_D2_RECEIPT_SELF_HASH_AND_EXTERNAL_IDENTITY_PREIMAGE_CONTRACT_MISMATCH_DOWNSTREAM_ACTIVE_CREDIT_IMPACT_AND_PARTIAL_RECOVERY_EPOCH004_P0_PUBLICATION_DISPOSITION_CONTRACT_RECONCILIATION_DESIGN_ISSUANCE_INDEPENDENT_VERIFICATION_AND_DESIGN_ONLY
```

Closed decision:

```text
prestart D2 receipt bytes:
IMMUTABLE_HISTORICAL

declared 0160be... / 97f62f...:
EMPTY_SELF_REPRODUCIBLE
DELETE_SELF_CONTRACT_MISMATCH
NON_CREDIT

final issuance / Reference / OA v2 / source reconciliation:
IMMUTABLE_HISTORICAL
INTRINSIC_IDENTITY_MATH_RETAINED
ACTIVE_EXECUTION_CREDIT_NOT_ESTABLISHED

partial Recovery Epoch004 P0 exact3:
IMMUTABLE_PUBLISHED_PARTIAL_INCOMPLETE_NON_CREDIT

Recovery Epoch004 P0 / Epoch004:
NOT_ESTABLISHED / NOT_STARTED

source baseline:
UNLOCKED

Candidate / Event1:
UNALLOCATED / NOT_CREATED

automatic progression:
false
```

No existing artifact was rewritten, reissued, replaced, renamed, or
completed.

## 1. Confirmed entry

```text
Cocolon clean local HEAD / tree:
1942156b9f14967a1c7eb3ab9eff14960a08bb0d
88dd394fa71e64ea353cb25e97c234353d445b6e

connected GitHub app observed Cocolon main:
1942156b9f14967a1c7eb3ab9eff14960a08bb0d

mashos-api clean HEAD / tree / origin-main:
97e8dd4d7021b8a1781d534aaa603f71dffa41b9
cd3fc3da0976bbbcb708319e4bc8cbbb6a73ec19
97e8dd4d7021b8a1781d534aaa603f71dffa41b9
```

The Cocolon materialization's stale remote-tracking `origin/main` was not
used for current credit.  The connected GitHub app established current
main, and the clean local HEAD/tree matched it exactly.

```text
Epoch003 Event1 path:
ABSENT

Candidate count:
exact0

source baseline:
UNLOCKED

operational runtime / Readiness / Failure:
0 / 0 / 0

Reservation / Attempt / formal exact134:
0 / 0 / 0
```

mashos-api source has not drifted from the fixed commit/tree.

## 2. Prestart D2 receipt

Actual immutable publication:

```text
commit / tree / parent:
15b38f2db38359bd88ecd3e0a8d8c3ed36a16156
b47fc75be54e9649f2b12f4e45a5b2590b34e584
d43df1d94b196daa810a52e3d233c8656b8ad84d

blob / raw:
119b79321c1ad0420d4b1aea79ed10c70c399ed1
e0cbd49b6c1e041608a7dcc9a7ddbb4cf7111e57361af0bf9053ff370b70a7ac

bytes / CR / trailing LF:
4139 / 0 / exact1
```

The complete bytes are canonical sorted compact JSON plus one LF.  The
mismatch is only the self-preimage mode:

| Identity | Declared / empty-self result | Frozen delete-self result | Disposition |
|---|---|---|---|
| receipt logical | `0160be7034f29ae3dcc3d0ddd6d3d92741a0bfa984e98417ca324d078ba70118` | `b93940c6c8d98f9627f366b4ae957a8b0953d30ff2d9f44c8209560cc72d4f00` | declared non-credit; delete-self diagnostic only |
| external exact10 | `97f62f881ac8035bb8fcba15d153ca38637bc659196a74f5f0f0e4849a4686c6` | `8cd628fdd881803def2699edad56806b91357897779623f44c6721c69e3165e3` | declared non-credit; delete-self diagnostic only |

Actual source owner and independent lanes delete the self field before
canonical hashing.  They contain no empty-self compatibility lane.
`b93940...` and `8cd628...` are not newly issued identities.

## 3. Downstream credit boundary

The final-issuance fixed entry directly binds `97f62f...`.  Therefore its
contract-valid issuance credit is not established.  The Reference and OA
v2 bodies, and the OA predecessor exact8, do not directly contain that
literal.

Correct typed disposition:

| Evidence | Intrinsic math | Current credit |
|---|---|---|
| final issuance `2c52bb...` | valid for its exact historical bytes | causal issuance credit not established |
| Reference `190cb3...` | body/logical/external valid | active Reference credit not established |
| OA v2 `80af08...` | body/exact8/logical/external valid | active admission credit not established |
| source reconciliation `2931b8...` | corrected self/external identity valid | active reconciliation credit not established |

Reference and OA are not declared false or revoked.  Their historical
bytes and mathematical identities remain immutable.  The broken
D2-to-final-issuance authority edge cannot be repaired by a downstream
object hashing its own bytes successfully.

## 4. Partial Recovery Epoch004 P0

Published exact3:

```text
Design / receipt commit and tree:
734aa36ecba8012b21860d4df3d3700b8164409d
419d1c5cd11488af79e4668f5fdf42b1e52dd2bb

Handoff commit and tree:
1942156b9f14967a1c7eb3ab9eff14960a08bb0d
88dd394fa71e64ea353cb25e97c234353d445b6e

aggregate changed path count:
exact3

aggregate ordered-path-array SHA-256:
ad2874295816b007ca15521a01bc32ee873289fb83ee95fc526cfd95682f3b5f
```

The partial receipt logical self-hash `dc553491...` and the mathematical
exact2 P0 object `e6659e9366b2c03b0ceef16bf2e0f8604d5e11226bbfd3fb1b070f9ab8bcac6a`
reproduce.

The P0 nevertheless was not established:

- its own effectiveness condition required exact5 on main;
- actual aggregate publication was exact3;
- Plan and latest snapshot were not modified;
- its exact16 recorded the D2 row as
  `IMMUTABLE_HISTORICAL_NOT_ACTIVE_EXECUTION_CREDIT` but treated the
  mismatched logical/external values as verified; and
- it reported `identity_state_issue_count=0` and `blocker_count=0`.

The exact3 and `e6659e...` remain immutable mathematical history, not
current P0 credit.  They are not modified or retroactively completed.

The old embedded D1 token is:

```text
HISTORICAL_LITERAL_NON_CREDIT
NOT_ISSUED
NOT_CURRENT_NEXT_AUTHORITY
```

## 5. Current reconciliation publication anchor

Design and body-free receipt were bound together in the publication
anchor:

```text
commit / tree / parent:
ae3a90d50d2411cc548008c58a21b345ebfc9a29
f766faac8163b410c7d5270745dbca75ec2b8aa5
1942156b9f14967a1c7eb3ab9eff14960a08bb0d

changed path count:
exact2
```

Design:

```text
blob / raw / bytes:
00fcf95d97cb1e994d2a98c4acdf15f2c9790d7d
bc0bdd6e134517e90f82a9012de418f6d6c06498a3b29cf94dab7347fe02f985
29159
```

Receipt:

```text
blob / raw / logical:
71798663e56d77e4b092dd5efd6d8999fb9fd81e
8ee1149049dc3f37d974baf707fff784848c6105de0ab7557853bc09b327716a
b8a8789988b57961ccfc8edb84e8612ed38b5205153da651fc3886e4ca5ebf24

external identity:
c9eb76e54e6d956e9f082f46fdaf71abe6068a33a379fcb3c4b6c3c267542649
```

Strict exact10:

```json
{"artifact_role":"RECOVERY_EPOCH003_PRESTART_D2_IDENTITY_PREIMAGE_MISMATCH_DOWNSTREAM_CREDIT_PARTIAL_EPOCH004_P0_DISPOSITION_RECONCILIATION_RECEIPT","body_free":true,"git_blob_sha1":"71798663e56d77e4b092dd5efd6d8999fb9fd81e","identity_sha256":"c9eb76e54e6d956e9f082f46fdaf71abe6068a33a379fcb3c4b6c3c267542649","logical_artifact_sha256":"b8a8789988b57961ccfc8edb84e8612ed38b5205153da651fc3886e4ca5ebf24","path":"EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch003_PrestartD2ReceiptIdentityPreimageContractMismatch_DownstreamActiveCreditAndPartialRecoveryEpoch004P0PublicationDisposition_ContractReconciliation_Design_ReadOnly_BodyFree_Receipt_20260730.json","publication_commit_sha1":"ae3a90d50d2411cc548008c58a21b345ebfc9a29","raw_sha256":"8ee1149049dc3f37d974baf707fff784848c6105de0ab7557853bc09b327716a","repository_full_name":"MassyuRed/Cocolon","schema_version":"cocolon.emlis.nls_v3.step11.cycle001.recovery_epoch003.prestart_d2_receipt_identity_preimage_mismatch_downstream_credit_partial_epoch004_p0_disposition_reconciliation_receipt.v1"}
```

The receipt logical identity deletes `receipt_sha256`; the external
identity deletes `identity_sha256`.  Both preimages are sorted compact
UTF-8 JSON with no LF.  Connector refetch at the publication commit
returned the exact local blobs.

## 6. Corrected state and next authority

```text
Recovery Epoch003:
IMMUTABLE_HISTORICAL
ACTIVE_EXECUTION_CREDIT_NOT_ESTABLISHED

partial administrative invalidation state transition:
NOT_ESTABLISHED

Recovery Epoch004 P0 / Epoch004:
NOT_ESTABLISHED / NOT_STARTED

source baseline:
UNLOCKED

Candidate:
UNALLOCATED_DISTINCT_FROM_ALL_PRIOR_CANDIDATES

Event1 / runtime / Readiness / Failure:
NOT_CREATED / NOT_MATERIALIZED / NOT_CREATED / NOT_CREATED

Reservation / Attempt / formal exact134:
NOT_CREATED / NOT_CREATED / NOT_INVOKED

P2 / Product Read / Cycle001:
NOT_STARTED / NOT_STARTED / NOT_ACCEPTED

automatic progression:
false
```

Exactly one next authority is defined:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_ADDITIVE_CORRECTIVE_P0_PARENT_DESIGN_AFTER_EPOCH003_PRESTART_D2_RECEIPT_IDENTITY_PREIMAGE_CONTRACT_MISMATCH_AND_PARTIAL_P0_NON_CREDIT_ISSUANCE_INDEPENDENT_VERIFICATION_AND_DESIGN_ONLY
```

Its state is:

```text
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED
```

It is not issued or usable by this handoff.  It must receive separate
Mash approval.  No D1, D2, final issuance, Candidate/Event1, or later
authority is activated.

## 7. Facts, inference, and 華恋の意見

### Confirmed facts

- `0160be... / 97f62f...` reproduce only under empty-self preimages.
- Frozen designs and actual source require delete-self preimages.
- final issuance directly binds `97f62f...`.
- Reference/OA intrinsic identities reproduce and do not directly include
  the prestart D2 identity.
- partial P0 exact3 and `e6659e...` are mathematically reproducible, but
  the exact5 effectiveness condition was not met.
- Event1 is absent, Candidate exact0, baseline unlocked, and mashos-api
  source unchanged.

### Actual-source-derived inference

The defect removes the causal authority credit for final issuance and
therefore for active use of its downstream Reference/OA route, without
changing the bytes or intrinsic identity mathematics of those objects.
The partial P0 cannot cure that defect and independently failed its own
exact5 closure condition.

### 華恋の意見

既存artifactを「正しい値に読替える」より、bytesの事実と実行creditを分離する方が
履歴を守れます。Reference/OAのhashが再現できることは保持しつつ、D2から渡される
authority edgeだけをfail-closedにするのが正確です。

同様に、partial P0へ残り2 pathを後付けして完成扱いにはしません。次はこの
dispositionを最初から含むadditive corrective P0を別承認で作り、その完全な
publicationを確認してからEpoch004を定義するべきだと判断します。

## 8. Effect boundary and required STOP

```text
mashos-api production / test / fixture / dependency changes:
0 / 0 / 0 / 0

pytest collect / execution / pytest.main:
0 / 0 / false

runtime materialization:
0

existing receipt / Reference / OA / reconciliation / partial P0 rewrites:
0 / 0 / 0 / 0 / 0

Candidate / Event1:
0 / 0

source-baseline lock:
0

Readiness / Failure / Reservation / Attempt / formal exact134:
0 / 0 / 0 / 0 / 0

corrective P0 execution:
0

automatic progression:
false
```

Required stop:

```text
RECOVERY_EPOCH003_PRESTART_D2_RECEIPT_DELETE_SELF_CONTRACT_MISMATCH_RECORDED_DECLARED_EMPTY_SELF_IDENTITIES_IMMUTABLE_NON_CREDIT_FINAL_ISSUANCE_REFERENCE_OPERATIONAL_ADMISSION_V2_AND_RECONCILIATION_IMMUTABLE_HISTORICAL_ACTIVE_EXECUTION_CREDIT_NOT_ESTABLISHED_RECOVERY_EPOCH004_PARTIAL_P0_EXACT3_IMMUTABLE_NON_CREDIT_P0_NOT_ESTABLISHED_NOT_STARTED_SOURCE_BASELINE_UNLOCKED_CANDIDATE_UNALLOCATED_EVENT1_NOT_CREATED_CORRECTIVE_P0_NOT_AUTHORIZED_AUTOMATIC_PROGRESSION_FALSE_AUTHORITY_STOP
```
