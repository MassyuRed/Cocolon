# Handoff — G5 Gate C exact24 protected-harness causal RED

- Date: 2026-08-09
- State: `G5_GATE_C_EXACT24_PROTECTED_HARNESS_CAPTURE_CARDINALITY_CAUSAL_RED_STOP`
- G5 machine GREEN: false
- Automatic progression: false
- Body-free: true

## Durable owners

- Result: `NLSv3_Step11_Cycle001_G5_GateC_Exact24_ProtectedHarnessCaptureCardinalityCausalRed_Result_20260809.md`
  - Git blob `24dfbd747aa4a65dcd055f242a2cbf1983405c14`
  - SHA-256 `0a4e0933197b9b74f726f0b403b273cfefb60e0182d5bc655dc3f2b8ed00457d`
- Receipt: `NLSv3_Step11_Cycle001_G5_GateC_Exact24_ProtectedHarnessCaptureCardinalityCausalRed_BodyFree_Receipt_20260809.json`
  - Git blob `e6b1a66716d21f8a3fb66aea9f735ded9d63ac8c`
  - SHA-256 `73412861c6832104c705211d4c7331067ea3ab2fac9a8508cfa90492775f6475`
  - logical SHA-256 `59d9241191c28a554fa77d08d3915a103e0e0631fd0d7fb3e0d4a7d1402dad24`

## Current exact state

```text
Gate B READY commit:
44fca3acfe0457979b7daaeee183d04dbafdc7d7

mashos-api remote main:
b0a8c70e5cec08581678b98f2e21571d17674d91

candidate Git blob:
f10ce7948e5570ee8ad27ee2af00a9caf3867d49

protected-test Git blob:
25f302a35d9e00df96f69d2eca26cc3caccc0e35

ordered exact24:
22 PASS / 2 FAIL / 904.56 seconds

G5 machine GREEN / production publish:
0 / 0

full52 / exact100 / G6 / Cycle001 acceptance:
0 / 0 / 0 / 0
```

The normal G5 evidence is GREEN and the three mutable production bodies satisfy
their direct controlled behaviors. Both final failures share a frozen-harness
cardinality defect: the patched public Reception-authority builder is called by
the evidence function and again by its validator, producing captured20 for
contexts10. The strict zip raises `ValueError`; the helper maps it to zero tuple
exact11.

## Re-entry boundary

Do not publish the production candidate and do not rerun Gate C against the
unchanged protected test. A new authority must first correct and refreeze the G4
controlled-capture helper so exactly one authority per context enters the strict
zip. Only after that correction has its own durable checkpoint may a separate
new Gate C authority be issued.

No production-side global monkeypatch/test-cue workaround is permitted. G6 and
Cycle001 acceptance remain outside scope and unstarted.
