# NLSv3 Step11 Cycle001 G5 Gate C — exact24 residual head-dominant typed-attachment causal RED STOP

- Date: 2026-08-10
- Decision owner: Mash
- Operation owner: Karen
- Scope: Gate C and G5 implementation/GREEN judgment only
- State: `G5_GATE_C_EXACT24_RESIDUAL_HEAD_DOMINANT_TYPED_ATTACHMENT_CAUSAL_RED_STOP`
- G5 machine GREEN: false
- Automatic progression: false
- Body-free: true

## 1. Terminal judgment

The protected G4 helper correction/refreeze checkpoint at Cocolon
`b00408d99483881fccb69b352f28b2d6e12fa1f9` was freshly postverified.
Gate C then rederived the new source/test baseline, the unchanged bounded G5
candidate, the ordered exact24, and the same current-session exact5 runtime.

The single admitted exact24 result was:

```text
23 passed / 1 failed
exit: 1
duration: 1030.23 seconds

remaining causal RED:
HEAD_DOMINANT_TYPED_ATTACHMENT_NOT_PROVED
```

The reachable-dimension node that had previously failed is now GREEN. The
head-dominant typed-attachment node remains RED, so the mandatory
`24 PASS / 0 FAIL` projection was not reached. G5 machine GREEN is false.
The production candidate was not published.

## 2. Admitted source identities

```text
mashos-api baseline commit:
9db636e537955b63fe6f793df91970d031159c34

baseline tree:
bf9489fb7811a0e3544aeff1dbadb239f059196c

baseline production blob:
1c19b6c293e20a9094b9180fded8c167daaaf5eb

candidate SHA-256 / Git blob:
af6f0a818b822381e6b03395b1d1250799d0a1465ac56a9c578eacf3c7e16088 /
f10ce7948e5570ee8ad27ee2af00a9caf3867d49

candidate bytes / LF / CR / final-LF:
547665 / 14350 / 0 / true

protected-test SHA-256 / Git blob:
2828449a1663ca3ca89d9e91f575383ad6404112ca779c47fe3c36c8bc281f1b /
37cdfb8e28ee1ca371dc0af46f080e2028cad86a
```

The Gate C worktree differed from the baseline in the Natural Surface
production path exact1 only. The candidate was byte-identical to the preserved
pre-Gate-C candidate. The protected test, fixtures, samples, case rows, and all
other mashos-api paths were unchanged.

## 3. Static admission

```text
production immutable prefix bytes:
537842
prefix SHA-256 / Git blob:
18ad33095754c0132d22a7f2e004f00d5e1655a825e366ade5778adb1bc134d4 /
478454a1c5fb5b15e0c281ae93a63aa058bf8e26

candidate suffix bytes / cap:
9823 / 11090
mutable function bodies / selector count:
3 / 0
masked SHA-256:
c448d8f514669a7b0379e3a85b79fc5aabf29d00cbe002725592f74e9f60fc1d

protected-test bytes / suffix / cap:
432027 / 23959 / 24000
static tests / new suffix tests:
52 / 0

ordered exact24 count / distinct / preimage bytes / LF:
24 / 24 / 3557 / 24
ordered exact24 SHA-256:
ea5f4afb819210eac771db02287c02475afb19cf9cff0408c7ce3dd866df10b9
excluded P3 final-inverse:
exact7 / disjoint

launch-material SHA-256:
2dd56fa0208129de4e6c7467233c00eb0eb67894ac943bae6d4675d3210496ad
static observation SHA-256:
791879063befcc9de11835b109fb7ab712cb6ea201183782078eac3bd51ed828
```

The immutable prefix, suffix window, exact3 symbol order, masked remainder,
selector policy, protected-test denominator, exact24 order, and excluded exact7
were all valid.

## 4. Runtime and invocation

The admitted exact5 runtime remained byte-identical immediately before launch:

```text
distribution closure:
4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c
full runtime root manifest:
5fbb81380303addd56f75b5e86b01fc3f891360530fc9d72d1847976178883cc
installed site manifest:
9c6925ed94b8eb1ccd22d2d4aeccc5dde35c7c23915ae6d367fcaff17bf09de6
runtime content / instance:
65cc52184bfed4e11f3e5a3686a49c0f6fef9b50040ac8c226e661e3b4039729 /
3de94a120c3a58a72a2a6e3159233ffa47c1b4a9ca5c26373af94f9634a60066
continuity chain:
264a6796dae8e1f05b8dd30557f3ed36f4b6c9b0b10ee07528de0db2ea6d929e
```

The absolute admitted pytest entrypoint was launched from the mashos-api
repository root with explicit no-conftest/cache/import-root controls followed
by the frozen ordered exact24. Target invocation, collection, and call were
1/24/24. Retry, fallback, interpreter switch, runtime mutation, install, repair,
rematerialization, and acquisition were all zero.

## 5. Exact classification

The first 22 controls passed. Of the two strengthened B6 nodes:

```text
REACHABLE_DIMENSION_EQUIVALENCE_LOCUS_NOT_PROVED:
GREEN

HEAD_DOMINANT_TYPED_ATTACHMENT_NOT_PROVED:
CAUSAL_RED
```

Passing the first B6 node proves the common freeze, owner/recomposition
aggregates, dimension changed4/missing4, morphology fail-close, and locus
contract. The remaining node has one unresolved conjunct among its
head/role/kind/Reception/selector-controlled and declared-head-first projection.
No post-consumption diagnostic execution was authorized, so this record does
not guess which private conjunct remained false and does not claim a new
production correction.

## 6. Effects and STOP boundary

```text
mashos-api write during Gate C: 0
production publish: 0
protected-test change during Gate C: 0
fixture/sample/case/input-body change: 0
other mashos-api path change: 0
runtime mutation/install/repair/rematerialization: 0/0/0/0
full52 / exact100: 0 / 0
G5 machine GREEN: 0
G6 Product Read: 0 / NOT_STARTED_UNAUTHORIZED
Cycle001 acceptance: 0 / NOT_ACCEPTED
```

mashos-api main therefore remains
`9db636e537955b63fe6f793df91970d031159c34`, with the base production blob
unchanged and only the corrected protected test published. The lossless
candidate remains owned by the earlier G5 preexecution preservation record; it
receives no publication or GREEN credit here.

The Gate C authority is closed and consumed at causal RED. Retry, rerun,
additional diagnostic execution, candidate correction, production publication,
and automatic return to any earlier gate are not authorized. The next authority
is `UNSELECTED / SEPARATE_MASH_APPROVAL_REQUIRED`; the first unresolved
contract is the residual head-dominant typed-attachment RED. Historical G4
correction/refreeze credit remains valid.
