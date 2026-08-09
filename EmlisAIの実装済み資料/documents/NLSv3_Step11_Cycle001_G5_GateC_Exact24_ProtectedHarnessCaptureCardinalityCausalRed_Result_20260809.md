# NLSv3 Step11 Cycle001 G5 Gate C — exact24 protected-harness causal RED

- Date: 2026-08-09
- Decision owner: Mash
- Operation owner: Karen
- Scope: Gate C and G5 implementation/GREEN judgment only
- State: `G5_GATE_C_EXACT24_PROTECTED_HARNESS_CAPTURE_CARDINALITY_CAUSAL_RED_STOP`
- G5 machine GREEN: false
- Automatic progression: false
- Body-free: true

## 1. Terminal judgment

Gate B reached the remotely checkpointed READY cut at Cocolon commit
`44fca3acfe0457979b7daaeee183d04dbafdc7d7`. Gate C then admitted the same
runtime/source/candidate/test identities and executed the frozen ordered exact24.

The target result was:

```text
22 passed / 2 failed
exit: 1
duration: 904.56 seconds

REACHABLE_DIMENSION_EQUIVALENCE_LOCUS_NOT_PROVED
HEAD_DOMINANT_TYPED_ATTACHMENT_NOT_PROVED
```

This is not G5 GREEN. The bounded production candidate was therefore not
published to `MassyuRed/mashos-api`; its remote `main` remains
`b0a8c70e5cec08581678b98f2e21571d17674d91`.

## 2. Admitted identities

```text
mashos-api source commit:
b0a8c70e5cec08581678b98f2e21571d17674d91

runtime instance:
3de94a120c3a58a72a2a6e3159233ffa47c1b4a9ca5c26373af94f9634a60066

runtime content:
65cc52184bfed4e11f3e5a3686a49c0f6fef9b50040ac8c226e661e3b4039729

candidate SHA-256 / Git blob:
af6f0a818b822381e6b03395b1d1250799d0a1465ac56a9c578eacf3c7e16088
f10ce7948e5570ee8ad27ee2af00a9caf3867d49

protected-test SHA-256 / Git blob:
22d59c362210b7020eddf34c43bfbd74f0c83cd78e9c8326ab03abe12fe5f5d6
25f302a35d9e00df96f69d2eca26cc3caccc0e35

ordered exact24 SHA-256 / count:
ea5f4afb819210eac771db02287c02475afb19cf9cff0408c7ce3dd866df10b9 / 24
```

The production immutable prefix, bounded suffix, mutable exact3 function order,
masked SHA-256, selector count0, protected-test byte identity, exact24 order,
and excluded final-inverse exact7 were all statically exact. Candidate suffix
length was 9,823 bytes within the 11,090-byte bound.

## 3. Launcher disclosure

The first direct pytest process reached repository conftest bootstrap before
target collection and stopped because a transitive plugin dependency was absent
from the frozen exact5 runtime. It exited 1 with safe classification
`REPOSITORY_CONFTST_PLUGIN_TRANSITIVE_DEPENDENCY_UNAVAILABLE_BEFORE_TARGET_COLLECTION`.
Target import, collection, and call were all0 in that process; runtime/source
tree changes were0.

The bootstrap controls were then made explicit with `--noconftest`, cache
disabled, and the frozen service import root. Static identities were rederived
without install, repair, fallback runtime, interpreter switch, or source change.
The corrected direct process collected and called the ordered exact24 once and
produced the 22/2 result above. Both process observations are retained; the
pretarget failure is not silently discarded or reclassified as target evidence.

## 4. Causal diagnosis

Post-target body-free diagnosis proved that the G5 production implementation is
not the cause of the two failures. The aggregate evidence was fully GREEN:

```text
contexts / bindings / source atoms / modifiers: 10 / 12 / 38 / 22
declared heads body-first: 12 / 12
other finite / typed-dependent joins: 4 / 4
expected vs actual atom counter: exact
expected vs actual role counter: exact
Reception expected vs actual: 11 / 11
Reception rebuild-required: 6
unparsed / ambiguous: 0 / 0
owner GREEN / recomposition GREEN: true / true
```

Direct controlled production behavior also satisfied dimension effect4,
dimension-missing fail4, morphology/role/kind/head controls, stale-render-tail
closure, Reception target/support/act mutations3, and selector exactness.

The common failure occurs in the frozen protected-test helper
`_g4_b6_controlled_behavior_evidence` before those values can be returned:

1. the helper monkeypatches the public Reception-authority build function and
   captures every call;
2. `_b6_reception_focus_evidence` calls that public build once per context;
3. its validator rebuilds the expected authority through the same patched
   public function once more per context;
4. the capture therefore contains 20 authorities for 10 contexts;
5. `zip(captured, contexts, strict=True)` raises `ValueError`;
6. the helper's broad outer exception handler converts this to `(0,) * 11`;
7. both final exact24 assertions consume that same zero tuple and fail.

This causal chain is independent of the three mutable G5 production bodies.
A production-side workaround would require an improper test-aware global
side-effect against authority validation. That workaround was not made.

## 5. Scope and effects

```text
Cocolon new Result/Receipt/Handoff: 3
Cocolon append-only Plan/07/08: 3
mashos-api published changed paths: 0
production publish: 0
protected-test change: 0
fixture/sample change: 0 / 0
full52 / exact100: 0 / 0
G6 Product Read: 0
Cycle001 acceptance: 0
```

Two post-target body-free diagnostic Python processes were observed. The first
completed the aggregate/controlled projection; the second trace-only process
was interrupted after the static double-capture cause was independently proven.
Neither process changed runtime or repository bytes. Raw bodies, absolute
runtime/helper paths, tracebacks, credentials, and environment values are not
published.

## 6. STOP boundary

The exact24 authority is closed at causal RED. G5 GREEN cannot be truthfully
issued against the current protected test. The first required change is a
separately authorized correction of the protected G4 controlled-capture helper
so that exactly one authority per context reaches the strict zip, followed by a
new frozen identity and a newly authorized Gate C execution.

That correction is outside this request's permitted G5 production scope and was
not performed. G6 and Cycle001 acceptance remain unstarted.
