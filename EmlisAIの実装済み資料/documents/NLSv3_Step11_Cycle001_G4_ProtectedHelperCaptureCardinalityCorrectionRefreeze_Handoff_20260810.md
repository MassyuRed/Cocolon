# Handoff — G4 protected-helper capture-cardinality correction/refreeze

- Date: 2026-08-10
- State: `G4_PROTECTED_HELPER_CAPTURE_CARDINALITY_CORRECTED_REFROZEN_CAUSAL_RED_PASS`
- Automatic progression: false
- Body-free: true

## Closed correction/refreeze

```text
mashos-api parent:
b0a8c70e5cec08581678b98f2e21571d17674d91

mashos-api correction/current main:
9db636e537955b63fe6f793df91970d031159c34

protected-test preimage/postimage blobs:
25f302a35d9e00df96f69d2eca26cc3caccc0e35 /
37cdfb8e28ee1ca371dc0af46f080e2028cad86a

protected-test bytes / suffix / cap:
432027 / 23959 / 24000

static test definitions / new suffix definitions:
52 / 0

ordered exact24 SHA-256:
ea5f4afb819210eac771db02287c02475afb19cf9cff0408c7ce3dd866df10b9

refreeze:
22 PASS / 2 CAUSAL_RED / 0 UNEXPECTED / 0 ERROR

duration:
1033.49 seconds
```

The approved one-line correction changes the strict-zip input from all twenty
direct/validator captures to the ten direct captures at `captured[::2]`.
Production remained blob `1c19b6c293e20a9094b9180fded8c167daaaf5eb`.
The causal RED signatures remain:

1. `REACHABLE_DIMENSION_EQUIVALENCE_LOCUS_NOT_PROVED`
2. `HEAD_DOMINANT_TYPED_ATTACHMENT_NOT_PROVED`

Runtime manifests, content, instance, and continuity rederived identically.
Runtime mutation, install, repair, rematerialization, fallback, interpreter
switch, retry, full52, exact100, G6, and Cycle001 acceptance were all zero.

## Durable owners

| role | path | bytes | LF | SHA-256 | Git blob |
|---|---|---:|---:|---|---|
| Result | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4_ProtectedHelperCaptureCardinalityCorrectionRefreeze_Result_20260810.md` | 5,233 | 149 | `e812818270968b991ab06dba609c7fda0a5021cede0bd58ac0b478001455c79b` | `59681acd85b3edadf53dcf39f8ee6290997151a2` |
| Receipt | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4_ProtectedHelperCaptureCardinalityCorrectionRefreeze_BodyFree_Receipt_20260810.json` | 6,192 | 155 | `0f0a4c4d4f4a8d8de7e4e80344b4e0baf2a63ba1df2cde631869cb3fec47c1e7` | `f08009abbece8dc7d5b9b5eeef0e46a3d72e57a3` |
| Receipt logical | sorted compact JSON with self field empty | — | — | `08e23bcfff76ac842ad8c35cfdf9608170fab619a512ae81fd41362ed64ca0b3` | — |
| Handoff | this path | self identity omitted to avoid a hash cycle | — | — | — |

Durable closure requires these new3 plus append-only Plan/07/08 exact6 to be
present on Cocolon main with prepared-byte equality, changed-path exact6,
unauthorized0, deletion0, rename0, and latest-main inclusion.

## Gate C entry

After that postverification, the user's current instruction activates one new
Gate C exact24 execution. Its source baseline is the correction commit above;
its only candidate changed path is Natural Surface production with candidate
blob `f10ce7948e5570ee8ad27ee2af00a9caf3867d49`. The protected test must remain
blob `37cdfb8e28ee1ca371dc0af46f080e2028cad86a`; the runtime identity and ordered
exact24 must remain unchanged.

Required Gate C result is `24 PASS / 0 FAIL`. Production publication and G5
closure occur only after that result. Full52, exact100, G6 Product Read, and
Cycle001 acceptance are not authorized.
