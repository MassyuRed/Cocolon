# NLS v3 Step11 Cycle001 G4 B6 Remediation Design Freeze RED-only Addendum

created_at_jst: 2026-08-09
gate: G4_B6_REMEDIATION_DESIGN_FREEZE_RED_ONLY
authority_owner: Mash
automatic_progression: false

## 1. result

```text
G3: COMPLETE_REMEDIATION_CONTRACT_FROZEN_READ_ONLY
G4: CLOSED_CONSUMED_CAUSAL_RED_PASS
G5: READY_SEPARATE_APPROVAL_REQUIRED
Cycle001: NOT_ACCEPTED
```

G4はG3で凍結されたB6 remediation contractに従い、protected P3 test exact1だけへexact-new append sectionを追加した。production source、fixture、sample、catalog、matcher、reception authority、API、DB、RN、public/shared runtime、mashos-apiの他pathは変更していない。

## 2. source and test pins

```text
mashos-api pre-G4 commit: 65284fef36936d7091262e758e0cc9282909601b
mashos-api final G4 commit: dab99efc12907fed82185ed3f9b5a5ba260094c2
intermediate same-path commit: 55141ff5f841e38aded6c1fd96d4632dd9f112ff

changed path exact1:
ai/tests/test_emlis_nls_v3_s11_rc0031_forward_inverse_independence.py

final test bytes: 418422
final test lines: 10897
final test SHA-256: 03eaaa4688c82e1da15829a39d5c50f03db8927e084a7b2c189800d99b97bee6
final test Git blob: 91bc9a5602f06056fa6f3b9289a3b710698c6b1f

production Natural Surface Git blob unchanged:
1c19b6c293e20a9094b9180fded8c167daaaf5eb
production change count: 0
```

The intermediate commit used a wrong historical class-method projection and its execution result is NONCREDIT. The final commit corrected only the ordered direct-node projection and the reachable duplicate-symbol selection. No production source was changed.

## 3. frozen ordered direct exact24

The final G4 section freezes exactly 24 ordered pytest node IDs in `_G4_B6_DIRECT_ORDERED_NODE_IDS_EXACT24`.

```text
ordered node count: 24
ordered-list material: each node ID + LF, in tuple order
ordered-list SHA-256:
efad5c20407db72dea12cd726ea3bace95b755efe182c03bd71cd45e49c670fc

existing control nodes: 22
new G4 causal RED nodes: 2
P3 final-inverse excluded nodes: 7
full exact52 execution: 0
```

The 22 controls are the current top-level direct Product Surface controls after excluding the historical initial scope seam and the P3 final-inverse exact7. The two new nodes inspect the reachable private builder and its actual cluster callee rather than stopping at the wrapper.

## 4. final execution

Runtime:

```text
Python: 3.12.13
pytest: 8.4.1
invocation count credited: exact1
wall time: 585.22 seconds
exit: 1, expected causal RED
collection/error stop: 0
```

Final projection:

```text
PASS: 22
CAUSAL_RED: 2
UNEXPECTED: 0
ERROR: 0
```

Exact RED signatures:

```text
REACHABLE_DIMENSION_EQUIVALENCE_LOCUS_NOT_PROVED
HEAD_DOMINANT_TYPED_ATTACHMENT_NOT_PROVED
```

The first RED proves the actual reachable cluster still renders atom-local dimension cue bundles and permits generic unknown fallback. The second proves root/head dominance, owner-role/kind behavioral consumption, typed subordinate attachment, and integrated Reception realization are not yet established in the current production owner. These are causal failures of the G3-localized owner; they are not unconditional failures or symbol-presence-only tests.

## 5. boundary and disposition

```text
test path change: exact1
production source change: exact0
new case/fixture/input body: exact0
raw private body read/export: exact0
helper/scanner/Inspector/harness/diagnostic file: exact0
full exact52/exact100/Product Read: exact0/exact0/exact0
G5 implementation/GREEN: exact0
automatic progression: false
```

G4 is complete because the test design, ordered exact24 denominator, ordered-list hash, causal RED signatures, and actual final projection are all frozen and durably published. The next unfinished technical gate is G5, which may change only the G3-bounded Natural Surface suffix under separate Mash approval.
