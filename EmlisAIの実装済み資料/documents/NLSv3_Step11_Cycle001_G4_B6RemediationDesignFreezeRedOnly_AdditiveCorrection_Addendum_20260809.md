# NLS v3 Step11 Cycle001 G4 B6 Remediation Design Freeze RED-only — Additive Correction Addendum

created_at_jst: 2026-08-09
authority_owner: Mash
correction_gate: G4_B6_REMEDIATION_DESIGN_FREEZE_RED_ONLY_ADDITIVE_CORRECTION
automatic_progression: false

## 1. corrected result

```text
prior G4 technical credit: WITHDRAWN_NONCREDIT
prior G4 lifecycle: CLOSED_NOT_REOPENED
additive correction: CLOSED_CONSUMED_CAUSAL_RED_PASS
corrected G4: CLOSED_CONSUMED_CAUSAL_RED_PASS
G5 authority received: exact1
G5 activation/consumption at this checkpoint: 0/0
Cycle001: NOT_ACCEPTED
```

Mash explicitly approved one additive G4 correction: correct the protected test exact1, complete a fresh GitHub refreeze, and only then continue through G5. This did not reactivate, reuse, or retry the prior G4 authority. It created and consumed one new correction authority. The historical G4 artifacts remain immutable lineage records; their technical-completion claim is superseded only by this additive correction.

## 2. exact defect and prior noncredit

The prior protected-test postimage at mashos-api `dab99efc12907fed82185ed3f9b5a5ba260094c2` did not satisfy the G3-frozen G4 contract:

1. it appended two new pytest methods and increased the static test-node count from52 to54 instead of strengthening the existing body-recovery exact2 with node count unchanged;
2. each new RED included a full-production-blob equality against `1c19b6c293e20a9094b9180fded8c167daaaf5eb`, making any lawful G5 production byte change necessarily fail and therefore making future `24 PASS` impossible;
3. its P3 final-inverse excluded exact7 names were not the actual existing top-level exact7;
4. its static shape checks did not causally freeze the full G3 owner/head/dimension/Reception behavior; and
5. its ordered exact24 used the two newly added nodes rather than the two G3-frozen existing body-recovery nodes.

Therefore the prior `22 PASS / 2 RED` execution and the prior G4 completion position receive technical credit0. The mechanically correct facts that remain preserved are the G3 production window, the two intended RED signatures, production change0, privacy boundaries, and Cycle001 `NOT_ACCEPTED`.

## 3. corrected protected-test identity

```text
repository: MassyuRed/mashos-api
parent commit: dab99efc12907fed82185ed3f9b5a5ba260094c2
correction commit: b0a8c70e5cec08581678b98f2e21571d17674d91
changed path exact1:
  ai/tests/test_emlis_nls_v3_s11_rc0031_forward_inverse_independence.py

preimage Git blob: 91bc9a5602f06056fa6f3b9289a3b710698c6b1f
postimage bytes: 432022
postimage LF: 11322
postimage CR: 0
postimage final-LF: true
postimage mode: 100644
postimage SHA-256: 22d59c362210b7020eddf34c43bfbd74f0c83cd78e9c8326ab03abe12fe5f5d6
postimage Git blob: 25f302a35d9e00df96f69d2eca26cc3caccc0e35

immutable predecessor prefix bytes: 408068
immutable predecessor prefix SHA-256:
  ac457122e12e87c95fb0f5e9b2d8d2eddc5d7bce7430dcdfb14bdfc03c5a6b19
immutable predecessor prefix Git blob:
  0b49a7ae02234a9b8741b6bc7d1c8580630e099b
corrected G4 suffix bytes: 23954
corrected G4 suffix cap: 24000
static pytest node definitions: 52
new pytest node definitions in correction suffix: 0
```

The existing body-recovery exact2 are monkeypatched in place. The corrected ordered exact24 contains22 existing controls plus those same two existing class-method node IDs. It has24 distinct, resolvable IDs and SHA-256 `ea5f4afb819210eac771db02287c02475afb19cf9cff0408c7ce3dd866df10b9` under the material rule “each ordered node ID plus LF”. The corrected excluded exact7 are the actual top-level P3 final-inverse exact7 and are disjoint from the ordered exact24.

## 4. future-GREEN window and causal oracle

The correction removes the old full-production-blob pin. It freezes the G3 Natural Surface window instead:

```text
production path:
  ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py
current production bytes: 548866
current production SHA-256:
  22295885af5c25d1738988a06846b3c70ab86f8d1ee88a6e6db7767e8774cd39
current production Git blob:
  1c19b6c293e20a9094b9180fded8c167daaaf5eb
immutable prefix bytes: 537842
immutable prefix SHA-256:
  18ad33095754c0132d22a7f2e004f00d5e1655a825e366ade5778adb1bc134d4
immutable prefix Git blob:
  478454a1c5fb5b15e0c281ae93a63aa058bf8e26
current suffix bytes: 11024
post-G5 suffix cap: 11090
body-only masked immutable-remainder SHA-256:
  c448d8f514669a7b0379e3a85b79fc5aabf29d00cbe002725592f74e9f60fc1d
```

Only the bodies of `_rc0031_rt_cluster`, `_step11_rc0031_product_render_cluster`, and `_step11_rc0031_build_owner_role_inflected_typed_recomposition_candidate` may change. Their signatures, the top-level function sequence, `_rc0031_rt_plan`, constants, marker, and every other suffix byte are frozen by a body-only mask.

The corrected oracle causally freezes all four dimension registries with changed-value/body-difference and missing-key/fail-close controls; declared-head-first identity per binding; typed non-head attachment and non-head full-bundle0; owner role/kind realization; modifier locus20, multiplicity18x1+2x2, depth2; semantic atom38/family22・13・1・2/head12/other finite4/owner24/modifier22/Reception11/rebuild6/reuse1 conservation; accepted focus→root→unique declared-head→actual body-parser association; target/support/effective-act causality; aspect consistency; integrated rerendering without a pre-rendered tail splice; resource and privacy boundaries; and prohibited selector0. Missing mapping has no generic unknown fallback.

## 5. corrected single-use execution

Current-session readiness was established fresh; the prior G4 READY state was not inherited.

```text
Python: 3.12.13
pytest: 8.4.1
pytest executable: /tmp/cocolon-g4-pytest/bin/pytest
pytest executable bytes/SHA-256:
  225 / 2abdd39dfcbff819df1a26f24d352724759e67317362ed43c3ce2624433ee321
interpreter bytes/SHA-256:
  27816648 / 9ed008e5a8685235361f0c53771b520ab082dd99a877ad2fd796a93fa4c0b488
pytest package init bytes/SHA-256:
  5373 / 66993a5e3905005e0981159b4794d10b1adacf341a58a44d696ad2c4442dcdc6
version probe / role probe / target invocation: 1 / 1 / 1
retry / fallback / interpreter switch: 0 / 0 / 0
target: corrected ordered exact24 only
exit: 1, expected causal RED
wall seconds: 903.38
PASS / CAUSAL_RED / UNEXPECTED / ERROR: 22 / 2 / 0 / 0
full exact52 / exact100: 0 / 0
```

Exact causal RED signatures:

```text
REACHABLE_DIMENSION_EQUIVALENCE_LOCUS_NOT_PROVED
HEAD_DOMINANT_TYPED_ATTACHMENT_NOT_PROVED
```

The first22 nodes passed. Only the existing body-recovery exact2 failed, with the exact approved signatures. This is causal current-production RED, not symbol-only or unconditional failure, and the same corrected exact24 is statically reachable as `24 PASS` through the exact3 G5 body window.

## 6. exact effects and next boundary

```text
G4 correction protected-test path change: exact1
G4 correction production change: exact0
fixture/case/sample/input-body change: exact0
other mashos-api path change: exact0
raw private body export/publication: exact0
Parser/Matcher/Hard Gate/P4+/API/DB/RN/public/shared runtime: exact0
G6 Product Read: exact0
Cycle001 acceptance credit: 0
```

GitHub postverification confirmed remote blob `25f302a35d9e00df96f69d2eca26cc3caccc0e35`, latest `main` `b0a8c70e5cec08581678b98f2e21571d17674d91`, one fast-forward commit, changed-path union exact1, unauthorized0, deletion0, rename0, and latest-main inclusion. The correction authority is closed and cannot be reused. G5 is separately approved by the same direct Mash instruction but activates only after this additive correction new3 plus Plan/07/08 exact6 are durably reflected and verified. G6 remains separately approved nowhere and unstarted.
