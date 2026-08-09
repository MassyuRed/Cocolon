# NLSv3 Step11 Cycle001 G5 Gate B — corrected exact7 / fresh runtime READY

- Date: 2026-08-09
- Decision owner: Mash
- Operation owner: Karen
- Authority source: Mash's explicit instruction to continue through Gate C and G5 GREEN judgment
- Scope: Gate B corrected-projection recovery only
- Result: `RUNTIME_READY_CURRENT_SESSION`
- Automatic progression: false
- Body-free: true

## 1. Source cut

The recovery used a detached clean `MassyuRed/mashos-api` cut.

```text
commit: b0a8c70e5cec08581678b98f2e21571d17674d91
tree: ea4bf747b5491c8d993fc2e92515dcffb0c897c3
production blob: 1c19b6c293e20a9094b9180fded8c167daaaf5eb
protected test blob: 25f302a35d9e00df96f69d2eca26cc3caccc0e35
formal lock blob: 0822fcb010985cd0d384f250a9e8a1fe16dc8fd4
source mismatch: 0
pre/post probe worktree change: 0
```

The protected exact24 ordered-node preimage remains 3,557 bytes / LF24 with
SHA-256 `ea5f4afb819210eac771db02287c02475afb19cf9cff0408c7ce3dd866df10b9`.
No target module was imported or collected in Gate B.

## 2. Corrected projection and acquisition

The authority-bound materializer selected lock-order exact5
`iniconfig, packaging, pluggy, pygments, pytest` and projected only the frozen
ordered exact7 keys:

```text
distribution_version
installed_record_closure_sha256
normalized_distribution_name
selected_dependency_names
wheel_filename
wheel_record_sha256
wheel_sha256
```

Compact sorted-key UTF-8 JSON, no final LF, produced 2,185 bytes and SHA-256
`f501025c1dccef68c47c0a3e52f3ef74d01233f371b16f2b1a0bdfb21089e57e`.
`requires_dist` and `top_level_imports` were excluded. The previous erroneous
full-exact9 preimage was not reused.

Fresh exact5 requirements were 473 bytes / LF5 / SHA-256
`4f7218509a20e42850afe75597f2abfdf447035001847621d4637faa246065f1`.
One configured-route network process acquired five wheels totaling 1,724,842
bytes. Each filename, raw wheel SHA-256, and wheel RECORD SHA-256 matched the
frozen lock; rejected, sdist, build, substitution, and post-acceptance index
access counts were zero. The accepted wheel manifest is
`00d2df98c8cda7f1473794892bafe7ccd18cc816c79ccb346f3e21ff629b136d`.

## 3. Fresh materialization

The admitted base was CPython 3.12.13 / Linux x86_64, executable SHA-256
`9ed008e5a8685235361f0c53771b520ab082dd99a877ad2fd796a93fa4c0b488`.
The new private root did not exist before activation. It was created once with
`venv --without-pip --copies`, then populated once by the base pip using the
fresh exact5 requirements, wheel-only/no-index/require-hashes/no-compile
controls. No runtime repair, fallback, interpreter switch, prior-runtime reuse,
or target execution occurred.

The installed exact5 distribution/RECORD closure identity is
`4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c`.
All five per-distribution installed closure hashes match the frozen lock.

## 4. Probe and identity reconciliation

The fixed environment policy SHA-256 is
`8a43751b49a8db1d024063608405f9b169e829f3c0be3488433b31800d44b1a4`.
The probe working directory was empty and was not a repository.

```text
version probe: exact1 / exit0 / stdout "pytest 8.4.1\n"
required role smoke: exact1 / exit0
ordered role paths: exact3
ordered role-path SHA-256: e01f5e587ba1884b988075eee1c162454d3a6a1d4b10febc3b7111c2b5c1b248
direct role loads: 3
public API calls / role effects: 0 / 0
```

Before the valid role smoke, one helper-schema guard process rejected an
incorrect LF encoding of the role-path identity before loading any role.
It caused direct-load/API/effect counts `0/0/0` and no runtime-tree change.
The actual required role smoke then used the frozen compact-JSON-array
preimage and ran exactly once. This guard observation is retained rather than
silently discarded.

Owner-before-probe and independent-after-probe derivations matched on all 19
compared identity fields:

```text
full runtime-root manifest: 5fbb81380303addd56f75b5e86b01fc3f891360530fc9d72d1847976178883cc
installed-file manifest: 9c6925ed94b8eb1ccd22d2d4aeccc5dde35c7c23915ae6d367fcaff17bf09de6
entrypoint control: 04dc7fea0e1bac9909433fd73dac771c4179fae224897a47fb46f3830e647425
logical runtime: 00320361206493de793726049563b907c82c28cee4c010ab905874d84b613d50
runtime content: 65cc52184bfed4e11f3e5a3686a49c0f6fef9b50040ac8c226e661e3b4039729
materialization event: 446241c92e55775b000e05756da1bdc875f9c822fb40fb610b453a711fd6fbb9
runtime-root identity: fa7591872b3a84abd3bceed78dc0199262920c3ea3ebe7c299a4ff67b10196c0
runtime instance: 3de94a120c3a58a72a2a6e3159233ffa47c1b4a9ca5c26373af94f9634a60066
continuity chain: 264a6796dae8e1f05b8dd30557f3ed36f4b6c9b0b10ee07528de0db2ea6d929e
```

Owner and independent verdicts are `VALID / VALID`. The instance class is
`REMATERIALIZED_NEW_INSTANCE`; persistence remains `SESSION_LOCAL`.

## 5. Gate B terminal

```text
state: RUNTIME_READY_CURRENT_SESSION
Gate B lifecycle: CLOSED_CONSUMED_READY
Gate C admission / target authority / target invocation: 0 / 0 / 0
target import / collection / test call: 0 / 0 / 0
full52 / exact100 / G6 Product Read: 0 / 0 / 0
production / protected-test change in Gate B: 0 / 0
automatic progression: false
```

Gate B stops at this durable READY checkpoint. The user's same explicit
instruction supplies the already-issued, distinct post-READY Gate C authority;
Gate C is not executed until this checkpoint is remotely included and its
prepared bytes are re-fetched.
