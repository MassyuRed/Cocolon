# NLS v3 Step11 Cycle001 G4 post-G6 shared structural correction — Gate B recovery after typed failure V1 Result

- Date: 2026-08-10
- Decision owner: Mash
- Operation owner: Karen
- Authority: `NLS_V3_STEP11_CYCLE001_G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_RECOVERY_AFTER_TYPED_FAILURE_V1`
- Result: `G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_RECOVERY_TYPED_FAILURE`
- Exactly-one cause: `FAILED_ROOT_NOT_AVAILABLE_FOR_CAUSAL_DIAGNOSIS`
- Lifecycle: `CLOSED_CONSUMED_TYPED_FAILURE`
- Body-free: true
- Automatic progression: false

## 1. Disposition

承認された recovery authority を Stage R0 の read-only exact diagnosis として一度だけ実行した。
作業開始前の GitHub fresh gate は一致した。Cocolon main、mashos-api main / tree、production /
protected-test blobs、current Gate B V1 Result / Receipt / Handoff blobs、typed state / reason /
lifecycle / nonreuse はすべて承認値どおりであった。前回 exact6 は latest main に含まれ、remote
prepared-byte equality、unauthorized path 0、deletion 0、rename 0 も再確認した。

failed Gate B V1 の session-local root は current Work session に残っていなかった。declared
session-local locator と current-session candidate inventory の read-only availability observation は
exact1、candidate count は 0 である。raw absolute locator は公開しない。authority-bound V1 helper
source exact5 は残っていたが、failed root を入力にできないため owner diagnostic と independently
implemented diagnostic はいずれも実行しなかった。

したがって actual installed-file manifest、row / file-kind / ownership / duplicate counts、canonical
preimage size、expected comparator match、mismatch-family counts、pathset digest、mismatch-row digestは
導出不能である。cause は承認された exactly-one taxonomy の
`FAILED_ROOT_NOT_AVAILABLE_FOR_CAUSAL_DIAGNOSIS` に閉じる。actual mismatch を current V1 helper defect、
expected-owner defect、actual content defectのいずれかへ推測で付け替えない。

Stage R1 の admission 条件は成立しない。new root、network acquisition、helper freeze / execution、
materialization、readiness probe、role smoke、identity reconciliation は全て 0 のまま typed STOP する。

```text
G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_RECOVERY_TYPED_FAILURE
EXACT_TYPED_CAUSE_RECORDED
CURRENT_GATE_B_RECOVERY_AUTHORITY_CLOSED_CONSUMED_TYPED_FAILURE
SAME_SERIES_FURTHER_RETRY_NOT_AUTHORIZED
NEXT_AUTHORITY_UNSELECTED_SEPARATE_MASH_APPROVAL_REQUIRED
CURRENT_AUTHORITY_STOP
AUTOMATIC_PROGRESSION_FALSE
```

## 2. Fresh entry gate

```text
Cocolon main:
  6d14b1dad31407999a27918873d6aa69e248c456

mashos-api main / tree:
  45bf98f9034261d3adb3e808d6d759f2334e2d25
  23f1684ed5430cafef955d7af9fc6bde75a4c62f

production / protected-test blobs:
  f10ce7948e5570ee8ad27ee2af00a9caf3867d49
  c302dd99e143967fed6edd65b429373e87453fc6

current Gate B V1 Result / Receipt / Handoff blobs:
  bbd1c96efb02121dcea472423d04a4938d14df6e
  fe610a3614deac5a1d1961ac276ec6470ef18160
  1dbad1c85a08124af8aa29ea1836d10641718d91

current state / typed reason / lifecycle:
  G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_TYPED_MATERIALIZATION_FAILURE
  INSTALLED_FILE_MANIFEST_IDENTITY_MISMATCH
  CLOSED_CONSUMED_TYPED_FAILURE

current V1 reuse:
  false

previous exact6 latest-main inclusion / prepared-byte equality:
  true / true

previous exact6 unauthorized / deletion / rename:
  0 / 0 / 0
```

No related drift was found. The single-use recovery authority was activated once, technically consumed by
the exact R0 availability classification, classified once, and closed once. Historical authorities and the
failed Gate B V1 were not reopened, retried, reused, reactivated, or reclassified.

## 3. Immutable inputs

The formal lock remained at the fixed mashos-api path with the approved identities.

```text
formal lock blob / raw / logical SHA-256:
  0822fcb010985cd0d384f250a9e8a1fe16dc8fd4
  9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787
  801ba54efc0f6655238d14e7c153fb70b555801489aa8ba028515fc64d9c05f4

corrected exact7 projection bytes / SHA-256:
  2185
  f501025c1dccef68c47c0a3e52f3ef74d01233f371b16f2b1a0bdfb21089e57e

requirements bytes / LF / SHA-256:
  473 / 5
  4f7218509a20e42850afe75597f2abfdf447035001847621d4637faa246065f1

accepted exact5 wheel manifest:
  00d2df98c8cda7f1473794892bafe7ccd18cc816c79ccb346f3e21ff629b136d

expected distribution closure:
  4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c

expected installed-file manifest:
  9c6925ed94b8eb1ccd22d2d4aeccc5dde35c7c23915ae6d367fcaff17bf09de6

base / interpreter / environment-policy:
  CPython 3.12.13 / Linux x86_64
  9ed008e5a8685235361f0c53771b520ab082dd99a877ad2fd796a93fa4c0b488
  8a43751b49a8db1d024063608405f9b169e829f3c0be3488433b31800d44b1a4

required role-path ordered SHA-256:
  e01f5e587ba1884b988075eee1c162454d3a6a1d4b10febc3b7111c2b5c1b248
```

Applicable tracked procedure owners remained:

| Path | Git blob | Raw SHA-256 |
|---|---|---|
| `Cocolon_前提資料/13_cocolon_work_test_runner_runtime_continuity.md` | `ea7f96221846e5614431296e00ac481cc00e00a2` | `42fcd4d65b0d21b5e41659b6329c55c14ed42c0270838f13be6102b351db7ac9` |
| `Cocolon_前提資料/work_attitude_rules_for_karen/16_test_runner_runtime_continuity_and_one_shot_prelaunch.txt` | `5c3b7dd03c84a84a2717f57f0d2c99c39b2ed6d8` | `895ea1f130e331d4e89f857835b4477d949c1ff63c0adea11276bc97b4c717b2` |

## 4. Lossless static freeze of the current V1 canonicalization

The current V1 materializer source, frozen at raw SHA-256
`ca48283fa60e1597a8ef9b773bfaf845f57cc7aa4a08a90f70981a99f41954aa`, used the following rule.
This is a static source observation only; it is not an actual-root causal derivation.

| Required element | Current V1 rule |
|---|---|
| schema version | No durable versioned single schema; `UNVERSIONED_EXPECTED_HASH_CANDIDATE_ORACLE_EXACT11` |
| root inclusion / exclusion | site-packages root excluded; RECORD-selected in-site payloads included; RECORD itself and verified external entrypoint payloads excluded |
| row fields | Candidate-dependent: exact3 `path/sha256/size`, exact5 owner extension, frozen exact4 `normalized_distribution_name/relative_path/byte_count/raw_sha256`, distribution rows, or closure rows |
| field order | JSON object keys lexicographic; semantic field sets differ by candidate |
| relative-path normalization | lexical normpath with runtime containment, then site-relative POSIX path |
| file-type handling | regular files only; nonregular entries rejected |
| unix-mode handling | omitted from every installed-manifest candidate |
| byte-count handling | actual byte length in `size` or `byte_count`; absent from closure-only candidates |
| raw SHA-256 handling | actual lowercase SHA-256 in `sha256` or `raw_sha256`; absent from closure-only candidates |
| symlink handling | any traversed or leaf symlink rejected |
| RECORD-owned / unowned | RECORD-owned payloads only; unowned filesystem payloads are not inventoried |
| pyc / cache | RECORD path ending `.pyc` or containing `/__pycache__/` skipped; post-install cache count separately required zero |
| row ordering | RECORD entries by path; flat entries by path or path+owner; frozen exact4 by exact5 distribution order then path; distribution rows by selected exact5 order |
| JSON / separator / UTF-8 | `ensure_ascii=false`, keys sorted, compact `,` / `:`, UTF-8 |
| final LF | none |

The candidate rule names were exact11:

```text
FROZEN_DISTRIBUTION_ORDER_THEN_POSIX_PATH_EXACT4
FLAT_RECORD_ENTRIES_ARRAY
RECORD_ENTRIES_OBJECT
INSTALLED_FILES_OBJECT
FLAT_OWNER_RECORD_ENTRIES_ARRAY
OWNER_RECORD_ENTRIES_OBJECT
INSTALLED_OWNER_FILES_OBJECT
DISTRIBUTION_RECORD_ENTRIES_ARRAY
DISTRIBUTIONS_RECORD_ENTRIES_OBJECT
DISTRIBUTION_CLOSURE_ROWS_ARRAY
DISTRIBUTION_CLOSURE_ROWS_OBJECT
```

The materializer selected a candidate only when exactly one candidate hash equalled the frozen expected
identity. The V1 mismatch happened before a rule name or an actual aggregate manifest identity was emitted.
The V1 owner helper depended on the materializer-selected rule; the independent helper encoded the frozen
exact4 form but was not reached. Helper-hash difference alone is not used as causal proof.

## 5. Exact R0 diagnosis

```text
failed-root availability observation:
  1

failed-root candidate count in current Work session:
  0

V1 helper-source presence count:
  5

failed-root mutation / repair / cache deletion / readiness reuse:
  0 / 0 / 0 / 0

owner diagnostic execution:
  0

independently implemented diagnostic execution:
  0

actual installed-file manifest SHA-256:
  NOT_DERIVABLE_FAILED_ROOT_ABSENT

row total / regular / symlink / other:
  NOT_DERIVABLE_FAILED_ROOT_ABSENT

owned / unowned / duplicate relative path:
  NOT_DERIVABLE_FAILED_ROOT_ABSENT

canonical preimage bytes / LF:
  NOT_DERIVABLE_FAILED_ROOT_ABSENT

owner / independent equality:
  NOT_OBSERVED

expected identity match:
  NOT_OBSERVED

mismatch-family counts / pathset digest / mismatch-row digest:
  NOT_DERIVABLE_FAILED_ROOT_ABSENT

exactly-one cause:
  FAILED_ROOT_NOT_AVAILABLE_FOR_CAUSAL_DIAGNOSIS
```

The prior successful G5 Gate B READY Receipt, current V1 Result / Receipt / Handoff, formal lock, and
tracked procedure exact2 were compared. The expected SHA-256 value is durable as evidence, but the available
formal lock, public READY Receipt, and tracked procedure do not durably contain a versioned aggregate
installed-file schema and canonical preimage owner. This is a durable-evidence conflict, not a second causal
classification: without the failed root, it cannot establish why the V1 actual content failed to match.

A historical read-only design at Git blob `94fda6f067e5b63f09476fc895d7906958a55202` does preserve a generic
frozen-distribution-order / POSIX-path exact4 canonical rule. Its earlier lineage binds a different installed
manifest identity, however; no inspected successor evidence binds that schema to current expected
`9c6925ed94b8eb1ccd22d2d4aeccc5dde35c7c23915ae6d367fcaff17bf09de6`. It is therefore not silently
promoted to the missing current owner.

## 6. Stage R1 non-admission and zero effects

The Stage R1 gate required a cause of exactly one bounded current-V1 defect, two corrected derivations on
the failed root, match to the unchanged expected owner, closure exact5 continuity, content-defect counts all
zero, and corrected helper exact5 frozen before the fresh attempt. Those predicates were not established.

```text
Stage R1 admission / attempt:
  0 / 0

new private staging / download / runtime root:
  0 / 0 / 0

configured acquisition / network process / accepted wheel:
  0 / 0 / 0

new helper creation / execution:
  0 / 0

venv creation / install process:
  0 / 0

owner-before-probe / pytest probe / role smoke / independent-after-probe:
  0 / 0 / 0 / 0

runtime READY admission:
  0

failed V1 retry / reuse / reactivation / repair / re-admission:
  0 / 0 / 0 / 0 / 0

target import / collection / call:
  0 / 0 / 0

targeted pytest / ordered exact24 / full52 / full54 / whole collection / exact100:
  0 / 0 / 0 / 0 / 0 / 0

protected-test append / production / fixture / sample / corpus changes:
  0 / 0 / 0 / 0 / 0

mashos-api changed path / Product Read / G5 / G6 / G7 / Cycle001 acceptance:
  0 / 0 / 0 / 0 / 0 / 0
```

No API, DB, RN, public/shared runtime, or Safety owner was changed. The expected manifest identity, formal
lock, acceptance conditions, and canonical owner were not changed.

## 7. Durable publication scope and next boundary

This checkpoint is published body-free to Cocolon only: new Result / Receipt / Handoff exact3, Plan / 07
append-only exact2, and 08 current-navigation update exact1. New paths were absent at prewrite; Plan / 07 /
08 preimages and every prepared byte sequence were frozen. mashos-api writes, unauthorized paths, deletion,
and rename are zero.

Publication does not authorize a same-series retry. The exact conflict is that causal diagnosis requires the
failed root while that root is unavailable, and the available tracked evidence does not own a lossless,
versioned installed-file canonical schema. The minimal alternative closure for a future separate Mash
decision is:

1. freeze a versioned, tracked, path-free installed-file manifest canonical owner;
2. authorize one diagnostic-only, nonadmitted fresh root without readiness credit;
3. run separately implemented owner and independent derivations exact1 each under that schema;
4. require a separate Mash decision before any comparator refreeze or readiness rematerialization.

The next authority is unselected. Gate C, target/protected-test work, fresh rematerialization, and automatic
progression remain unauthorized.
