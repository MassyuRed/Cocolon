# Handoff — G5 Gate C exact24 residual head-dominant causal RED STOP

- Date: 2026-08-10
- State: `G5_GATE_C_EXACT24_RESIDUAL_HEAD_DOMINANT_TYPED_ATTACHMENT_CAUSAL_RED_STOP`
- G5 machine GREEN: false
- Automatic progression: false
- Body-free: true

## Exact result

```text
G4 helper refreeze checkpoint:
b00408d99483881fccb69b352f28b2d6e12fa1f9

mashos-api baseline/current main:
9db636e537955b63fe6f793df91970d031159c34

candidate blob:
f10ce7948e5570ee8ad27ee2af00a9caf3867d49

protected-test blob:
37cdfb8e28ee1ca371dc0af46f080e2028cad86a

ordered exact24:
23 PASS / 1 CAUSAL_RED / 0 ERROR

duration:
1030.23 seconds

resolved:
REACHABLE_DIMENSION_EQUIVALENCE_LOCUS_NOT_PROVED

remaining:
HEAD_DOMINANT_TYPED_ATTACHMENT_NOT_PROVED

production publish:
0
```

The one-shot Gate C authority is closed and consumed at causal RED. The
required `24 PASS / 0 FAIL` projection was not reached, so G5 machine GREEN
is false and the candidate was not written to mashos-api.

Runtime manifests/content/instance/continuity stayed identical. Runtime
mutation, install, repair, rematerialization, acquisition, fallback,
interpreter switch, and retry were zero. Full52, exact100, G6 Product Read,
and Cycle001 acceptance were not run or credited.

## Durable owners

| role | path | bytes | LF | SHA-256 | Git blob |
|---|---|---:|---:|---|---|
| Result | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G5_GateC_Exact24_ResidualHeadDominantTypedAttachmentCausalRedStop_Result_20260810.md` | 5,861 | 172 | `4331ebb99d6b04eaf8e64524639b4da25d7af266ce2a89aefcb345641f1dfb5d` | `4891516eb1eed8b1c9c3fec761955547707fb7db` |
| Receipt | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G5_GateC_Exact24_ResidualHeadDominantTypedAttachmentCausalRedStop_BodyFree_Receipt_20260810.json` | 7,477 | 178 | `5f3b88bbb5a11bc89d405467f8dd78429009c94eaa8c7fff3010939dec3e1cc5` | `41c7dacff3479e9ecbd8bd00bd4b38966030d408` |
| Receipt logical | sorted compact JSON with self field empty | — | — | `7775fdb8083bc5f6ddd548cc672387db68440e4569f95aa36c0d1811f7cf4fe9` | — |
| Handoff | this path | self identity omitted to avoid a hash cycle | — | — | — |

Closure requires these new3 plus the append-only post-G4-C1 Plan/07/08
postimages to be present on Cocolon main with changed-path exact6,
unauthorized0, deletion0, rename0, prepared-byte equality, and latest-main
inclusion.

## Re-entry boundary

The first unresolved contract is
`HEAD_DOMINANT_TYPED_ATTACHMENT_NOT_PROVED`. This authority does not choose a
return gate and authorizes no additional diagnostic execution, candidate
correction, protected-test correction, rerun, or new Gate C. The next authority
is:

```text
UNSELECTED
SEPARATE_MASH_APPROVAL_REQUIRED
automatic progression: false
```

The corrected G4 refreeze remains valid. G6 and Cycle001 acceptance remain
outside scope and unstarted.
