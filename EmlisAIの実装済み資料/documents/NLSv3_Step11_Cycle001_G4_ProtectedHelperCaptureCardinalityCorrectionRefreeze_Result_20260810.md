# NLSv3 Step11 Cycle001 G4 — protected-helper capture-cardinality correction/refreeze

- Date: 2026-08-10
- Decision owner: Mash
- Operation owner: Karen
- Scope: protected G4 helper correction/refreeze, then Gate C and G5 GREEN judgment only
- State: `G4_PROTECTED_HELPER_CAPTURE_CARDINALITY_CORRECTED_REFROZEN_CAUSAL_RED_PASS`
- Automatic progression: false
- Body-free: true

## 1. Result

Mash explicitly approved the separately required protected G4 helper correction
and refreeze. The helper was corrected at one protected-test line, published to
`MassyuRed/mashos-api`, and the frozen ordered exact24 was run once against
the unchanged base production.

```text
ordered exact24: 22 PASS / 2 CAUSAL_RED / 0 UNEXPECTED / 0 ERROR
exit: 1 (expected causal RED)
duration: 1033.49 seconds
full52 / exact100: 0 / 0
```

The only failures were:

```text
REACHABLE_DIMENSION_EQUIVALENCE_LOCUS_NOT_PROVED
HEAD_DOMINANT_TYPED_ATTACHMENT_NOT_PROVED
```

This restores a causal G4 RED oracle. It does not grant G5 GREEN by itself.

## 2. Corrected defect

The protected helper `_g4_b6_controlled_behavior_evidence` monkeypatches the
public Reception-focus authority builder. For each of the ten candidate
contexts, the evidence path calls that public builder once directly and its
validator calls it once again. The old helper retained twenty captures and
strict-zipped them with ten contexts, raised `ValueError`, and fail-closed to
an all-zero exact11 tuple.

The approved correction is exact:

```diff
-            captured, _rc0031_final_candidate_contexts(), strict=True))
+            captured[::2], _rc0031_final_candidate_contexts(), strict=True))
```

The stride selects the direct call from each adjacent direct/validator pair,
yielding ten authorities for ten contexts. Production, fixtures, samples, case
rows, Parser, Matcher, Hard Gate, API, DB, RN, and public/shared runtime were
not changed.

## 3. GitHub source identity

```text
repository: MassyuRed/mashos-api
parent commit: b0a8c70e5cec08581678b98f2e21571d17674d91
correction commit: 9db636e537955b63fe6f793df91970d031159c34
correction tree: bf9489fb7811a0e3544aeff1dbadb239f059196c
changed path count: 1
changed path:
  ai/tests/test_emlis_nls_v3_s11_rc0031_forward_inverse_independence.py
production changed path count: 0
```

Remote postverification found a one-commit fast-forward, modified exact1,
unauthorized0, deletion0, rename0, corrected protected-test blob
`37cdfb8e28ee1ca371dc0af46f080e2028cad86a`, and unchanged production blob
`1c19b6c293e20a9094b9180fded8c167daaaf5eb`.

## 4. Protected-test refreeze identity

```text
preimage SHA-256:
22d59c362210b7020eddf34c43bfbd74f0c83cd78e9c8326ab03abe12fe5f5d6
preimage Git blob:
25f302a35d9e00df96f69d2eca26cc3caccc0e35

postimage bytes / LF / CR / final-LF:
432027 / 11322 / 0 / true
postimage SHA-256:
2828449a1663ca3ca89d9e91f575383ad6404112ca779c47fe3c36c8bc281f1b
postimage Git blob:
37cdfb8e28ee1ca371dc0af46f080e2028cad86a

immutable prefix bytes / suffix bytes / suffix cap:
408068 / 23959 / 24000
immutable prefix SHA-256:
ac457122e12e87c95fb0f5e9b2d8d2eddc5d7bce7430dcdfb14bdfc03c5a6b19
static pytest definitions / new suffix definitions:
52 / 0
```

The ordered exact24 remains 24 distinct resolvable node IDs. Its canonical
material is each full repository-root-relative node ID followed by LF:
3557 bytes, 24 LF, SHA-256
`ea5f4afb819210eac771db02287c02475afb19cf9cff0408c7ce3dd866df10b9`.
The excluded P3 final-inverse exact7 remains disjoint.

## 5. Base production and runtime

The refreeze used the unchanged base production:

```text
bytes / SHA-256:
548866 /
22295885af5c25d1738988a06846b3c70ab86f8d1ee88a6e6db7767e8774cd39
Git blob:
1c19b6c293e20a9094b9180fded8c167daaaf5eb
```

Before execution, the current exact5 runtime was independently rederived with
the same frozen identities:

```text
distribution closure:
4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c
full runtime root manifest:
5fbb81380303addd56f75b5e86b01fc3f891360530fc9d72d1847976178883cc
installed site manifest:
9c6925ed94b8eb1ccd22d2d4aeccc5dde35c7c23915ae6d367fcaff17bf09de6
runtime content:
65cc52184bfed4e11f3e5a3686a49c0f6fef9b50040ac8c226e661e3b4039729
runtime instance:
3de94a120c3a58a72a2a6e3159233ffa47c1b4a9ca5c26373af94f9634a60066
continuity chain:
264a6796dae8e1f05b8dd30557f3ed36f4b6c9b0b10ee07528de0db2ea6d929e
```

Runtime mutation, install, repair, rematerialization, acquisition, fallback,
interpreter switch, target retry, and source-body publication were all zero.

## 6. Boundary

This correction/refreeze authority is closed and consumed. It supersedes only
the defective protected-helper capture projection; all historical records
remain immutable.

The user's current instruction separately authorizes continuation through the
new Gate C and G5 GREEN judgment, but Gate C remains inactive until this new
Result/Receipt/Handoff plus append-only Plan/07/08 exact6 is present on GitHub
and freshly postverified. Gate C must then use the same candidate, the new
protected-test identity, the same runtime identity, and the unchanged ordered
exact24. Required GREEN is `24 PASS / 0 FAIL`.

Full52, exact100, G6 Product Read, and Cycle001 acceptance remain outside scope
and unstarted.
