# NLSv3 Step11 Cycle001 G6 — B6 representative Product Read recheck rejected

- Date: 2026-08-10
- Decision owner: Mash
- Operation owner: Karen
- Scope: G6 B6 representative actual-output Product Read recheck only
- State: `G6_B6_REPRESENTATIVE_PRODUCT_READ_RECHECK_REJECTED_CLOSED`
- Outcome: `REJECT`
- Automatic progression: false
- Body-free / public-safe: true / true

## 1. Terminal judgment

G5 was first reverified as remotely closed and published. Cocolon `main` was
`6c96736bbb983b0907f40218be2583937e4d2e7c`; mashos-api `main` was
`45bf98f9034261d3adb3e808d6d759f2334e2d25` / tree
`23f1684ed5430cafef955d7af9fc6bde75a4c62f`. The actual-read production blob
was exactly the G5-published blob
`f10ce7948e5570ee8ad27ee2af00a9caf3867d49`, and the protected helper blob was
`c302dd99e143967fed6edd65b429373e87453fc6`.

The frozen exact10 context order and exact8 unique-case denominator matched the
current comparator. A fresh single-process generation then invoked the current
production private G5 typed-recomposition builder for all ten contexts. The
private body-full output was read in two separated passes over all twelve
Product Read axes. No raw input, output body, quotation, identifying
paraphrase, span, mapping, body digest, packet digest, key, or free-text review
note is present in this artifact.

The admitted body-free aggregate was:

```text
candidate exact10 PASS / MINOR / MAJOR / BLOCKER: 0 / 2 / 8 / 0
unique exact8 PASS / MINOR / MAJOR / BLOCKER: 0 / 2 / 6 / 0
former-MAJOR cases PASS-or-MINOR: 0 / 5
former-MAJOR contexts PASS-or-MINOR: 0 / 7
controls not worse: 1 / 3
new MAJOR controls: 1
```

G6 therefore did not reach its conjunctive exit gate. The exact terminal
projection is:

```text
B6_PRODUCT_READ_GATE_REJECTED
RETURN_TO_SHARED_STRUCTURAL_CORRECTION
CURRENT_AUTHORITY_STOP
NLS_V3_METHOD_STOP_FALSE
```

This closes the authorized G6 recheck as rejected. It does not reopen or erase
the closed G3, G4, or G5 evidence, and it does not authorize a production
change, G7, full52, exact100, final inverse, Parser/Matcher, or Cycle001
acceptance.

## 2. Entry and source identities

```text
Cocolon pre-G6 commit / tree:
6c96736bbb983b0907f40218be2583937e4d2e7c /
f733045fd3cfbd227e6d6cdb7c2488dfdfb848fd

mashos-api commit / tree:
45bf98f9034261d3adb3e808d6d759f2334e2d25 /
23f1684ed5430cafef955d7af9fc6bde75a4c62f

production SHA-256 / Git blob:
af6f0a818b822381e6b03395b1d1250799d0a1465ac56a9c578eacf3c7e16088 /
f10ce7948e5570ee8ad27ee2af00a9caf3867d49

protected helper SHA-256 / Git blob:
c9b27c1ec9cb7c0288a837828e9c1d9b011b0876aaa62347beb5633d6ff5a6d7 /
c302dd99e143967fed6edd65b429373e87453fc6

representative8 fixture SHA-256 / Git blob:
15e8047cd95b453fba4a7a677b428955ea2819e6738e4e1fc1488d24952b78a8 /
56e4d96f8559e2411305b1dac83b5932df88d1a8
```

The G5 terminal evidence remained:

```text
state: G5_GATE_C_EXACT24_GREEN_PRODUCTION_PUBLISHED_CLOSED
exact24: 24 PASS / 0 FAIL / 0 ERROR / 0 UNEXPECTED
G5 Result blob: 589756472a958baf06f1bfabf573ec37ef038414
G5 Receipt blob: 0d716942582b54bdc7c643e759ad9185a77b236c
G5 Handoff blob: 81dffb193dc8f8f4ac18f9f486d18d671c124b13
```

No entry drift was detected.

## 3. Frozen representative denominator

The exact10 ordinal was unchanged:

| ord | context | role |
|---:|---|---|
| 1 | `nls3s_b001_0001::candidate_01` | control exact reuse |
| 2 | `nls3s_b001_0002::candidate_01` | control |
| 3 | `nls3s_b001_0009::candidate_01` | control |
| 4 | `nls3s_b001_0019::candidate_01` | former-MAJOR |
| 5 | `nls3s_b001_0019::candidate_02` | former-MAJOR |
| 6 | `nls3s_b001_0035::candidate_01` | former-MAJOR |
| 7 | `nls3s_b001_0043::candidate_01` | former-MAJOR |
| 8 | `nls3s_b001_0043::candidate_02` | former-MAJOR |
| 9 | `nls3s_b001_0063::candidate_01` | former-MAJOR |
| 10 | `nls3s_b001_0100::candidate_01` | former-MAJOR |

The unique exact8 order was `0001, 0002, 0009, 0019, 0035, 0043, 0063,
0100`. Controls were exact3; former-MAJOR was exact5 cases / exact7 contexts.

Freshly remeasured denominator:

```text
candidate contexts / unique cases: 10 / 8
proposition bindings / semantic atoms: 12 / 38
verified exact reuse / Reception predications: 1 / 11
```

The remaining G5 machine denominator was inherited, not falsely relabeled as a
fresh G6 machine rerun: families `22/13/1/2`, heads `12+4`, owner heads
`24=19+5`, modifier/locus `22/20`, depth2, rebuild6, and resource maxima
`(2,4,2,4)`.

## 4. Generation and review execution

The authoritative target generation used the retained CPython 3.12.13 runtime
and the current production private builder in one direct Python process:

```text
target generation process / invocation: 1 / 1
attempted / built / failed: 10 / 10 / 0
private body-full Product Read: 10 / 10
retry / fallback / interpreter switch: 0 / 0 / 0
install / repair / rematerialization / network: 0 / 0 / 0 / 0
exact24 / full52 / exact100 test run: 0 / 0 / 0
exit: 0
```

Before the authoritative target process, one non-authoritative protocol-
discovery process evaluated the base context helper only. It invoked the final
G5 private builder zero times, received no Product Read credit, produced no
persisted packet, and was not used for the decision. A current-session version
observation and exact3 role-import smoke each ran once before target launch.
They were preflight observations, not product or test-gate credit.

The canonical review contract remained one gate reviewer over two separated
passes: semantic/safety axes 1–6, then product-surface axes 7–12. Candidate
severity was the maximum across the twelve axes; unique-case severity was the
maximum across that case's candidates. Two additional private advisory
crosschecks independently agreed on the G6 REJECT outcome; they did not replace
the canonical one-reviewer denominator or alter its per-row ratings.

## 5. Body-free Product Read ratings

| context | severity | failed axes | closed reason codes |
|---|---|---|---|
| `0001::candidate_01` | MINOR | 6, 8 | `RECEPTION_PREDICATION_LOCAL_SPECIFICITY_RESIDUE`; `RECEPTION_PREDICATION_LOCAL_NATURALNESS_RESIDUE` |
| `0002::candidate_01` | MINOR | 8, 12 | `RECEPTION_PREDICATION_LOCAL_NATURALNESS_RESIDUE`; `IMMEDIATE_OBSERVATION_LOCAL_READFEEL_RESIDUE` |
| `0009::candidate_01` | MAJOR | 1, 6, 8, 10, 12 | `MAIN_MEANING_DOMINANCE_OBSCURED`; `RECEPTION_PREDICATION_INSUFFICIENTLY_INPUT_SPECIFIC`; `TYPED_RECOMPOSITION_EXPLANATORY_DENSITY`; `DEPTH_DENSITY_OVERSHOOT`; `IMMEDIATE_OBSERVATION_NOT_READ` |
| `0019::candidate_01` | MAJOR | 1, 2, 6, 8, 10, 12 | `MAIN_MEANING_DOMINANCE_OBSCURED`; `RELATION_TEMPORAL_READABILITY_DISTORTED`; `RECEPTION_PREDICATION_INSUFFICIENTLY_INPUT_SPECIFIC`; `OWNER_ROLE_INFLECTION_GRAMMATICAL_JOIN_FAILURE`; `TYPED_RECOMPOSITION_EXPLANATORY_DENSITY`; `DEPTH_DENSITY_OVERSHOOT`; `IMMEDIATE_OBSERVATION_NOT_READ` |
| `0019::candidate_02` | MAJOR | 1, 2, 6, 8, 10, 12 | same closed codes as candidate_01 |
| `0035::candidate_01` | MAJOR | 1, 2, 6, 8, 9, 10, 12 | the preceding common MAJOR codes plus `SURFACE_DISTRIBUTION_OVERCONCENTRATED` |
| `0043::candidate_01` | MAJOR | 1, 2, 6, 8, 10, 12 | the common MAJOR codes used for `0019` |
| `0043::candidate_02` | MAJOR | 1, 2, 6, 8, 10, 12 | the common MAJOR codes used for `0019` |
| `0063::candidate_01` | MAJOR | 1, 2, 6, 8, 9, 10, 12 | the common MAJOR codes plus `SURFACE_DISTRIBUTION_OVERCONCENTRATED` |
| `0100::candidate_01` | MAJOR | 1, 2, 6, 8, 9, 10, 12 | the common MAJOR codes plus `SURFACE_DISTRIBUTION_OVERCONCENTRATED` |

The Receipt carries the complete exact10 closed-code arrays and derived exact8
rows. This Result intentionally contains no raw or identifying product body.

The B5 control comparator was exact and body-free:

```text
0001 prior MINOR -> current MINOR: not worse
0002 prior PASS  -> current MINOR: worse
0009 prior MINOR -> current MAJOR: worse
```

The five semantic/safety preservation invariants tied to axes 3, 4, 5, 7, and
11 remained true. No BLOCKER was found. That does not override the eight
candidate MAJOR findings.

All eight prior concern families still had at least one MAJOR context. Their
MAJOR-context counts were, in frozen order:

```text
Reception specificity/naturalness: 8
owner-role grammatical join: 7
typed-recomposition explanatory density: 8
main-meaning dominance obscured: 8
relation/temporal readability distortion: 7
depth/density overshoot: 8
immediate-observation failure: 8
surface-distribution overconcentration: 3
```

## 6. Repository, privacy, and next boundary

The fresh generation and Product Read changed no tracked Cocolon or mashos-api
file. Post-run production, protected helper, fixture, runtime executable,
pytest entrypoint, and runtime configuration identities remained unchanged.
No test, fixture, sample, corpus, API, DB, RN, public, shared-runtime, source,
or production mutation was made.

The G6 authority lifecycle is `CLOSED_CONSUMED_REJECTED`, with approval1,
activation1, consumption1, classification1, close1, retry0, reuse0, and
reactivation0.

```text
G6 Product Read: 1 / REJECT
production remediation in this authority: 0 / NOT_AUTHORIZED
G7: 0 / NOT_STARTED_UNAUTHORIZED
full52 / exact100: 0 / 0
Cycle001 acceptance: 0 / NOT_ACCEPTED
automatic progression: false
```

The next technical boundary is a separately authorized shared structural
correction. The current authority stops here. The NLSv3 method is not declared
stopped by this ordinary Product Read rejection.
