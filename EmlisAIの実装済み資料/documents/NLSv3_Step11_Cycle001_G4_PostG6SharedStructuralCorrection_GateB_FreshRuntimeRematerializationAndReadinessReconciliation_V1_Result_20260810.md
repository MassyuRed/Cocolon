# NLS v3 Step11 Cycle001 G4 post-G6 shared structural correction — Gate B fresh runtime rematerialization typed failure V1 Result

- Date: 2026-08-10
- Decision owner: Mash
- Operation owner: Karen
- Authority: `NLS_V3_STEP11_CYCLE001_G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_FRESH_RUNTIME_REMATERIALIZATION_AND_READINESS_RECONCILIATION_V1`
- Result: `G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_TYPED_MATERIALIZATION_FAILURE`
- Typed reason: `INSTALLED_FILE_MANIFEST_IDENTITY_MISMATCH`
- Body-free: true
- Automatic progression: false

## 1. Disposition

承認された Gate B を fresh-root/readiness-only として一度だけ実行した。immutable predecessor、
formal lock、corrected exact7 projection、requirements、base interpreter、required role exact3 は
承認値と一致した。configured route の fresh acquisition は exact1 network process で成功し、
accepted wheel exact5 は filename、raw wheel SHA-256、wheel RECORD SHA-256、distribution name、
version の全受入れ条件に一致した。

fresh root は `venv --without-pip --copies` で exact1 作成され、target 外の base pip 26.0.1 から
accepted wheel exact5 だけを no-index / require-hashes / no-deps / wheel-only / no-compile で
exact1 install した。per-distribution installed RECORD closure exact5 と path-free distribution
closure は frozen lock と一致した。

その後、aggregate installed-file manifest の canonical SHA-256 が承認済み expected identity
`9c6925ed94b8eb1ccd22d2d4aeccc5dde35c7c23915ae6d367fcaff17bf09de6`
に一致せず、materializer は fail-closed した。失敗は full-root identity、owner-before-probe、
pytest version probe、required-role smoke、independent-after-probe より前に成立した。

current authority は materializer execution exact1 で消費済みである。同一 authority 内で helper
修正、runtime repair、cache deletion、re-acquisition、再 materialization、retry、fallback、
interpreter switch を行わず、typed failure で STOP する。

```text
G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_TYPED_MATERIALIZATION_FAILURE
INSTALLED_FILE_MANIFEST_IDENTITY_MISMATCH
CURRENT_G4_GATE_B_AUTHORITY_CLOSED_CONSUMED_TYPED_FAILURE
NEXT_G4_GATE_B_RECOVERY_SEPARATE_MASH_APPROVAL_REQUIRED
CURRENT_AUTHORITY_STOP
AUTOMATIC_PROGRESSION_FALSE
```

`RUNTIME_READY_CURRENT_SESSION` は成立していない。したがって post-READY Gate C、protected-test
append、target exact24、causal RED classification、G5 以降へ進まない。

## 2. Immutable entry

```text
Cocolon predecessor:
  97be1644455deb5bd069a9dff02f0440a5c2ad48

mashos-api commit / tree:
  45bf98f9034261d3adb3e808d6d759f2334e2d25
  23f1684ed5430cafef955d7af9fc6bde75a4c62f

production blob:
  f10ce7948e5570ee8ad27ee2af00a9caf3867d49

protected-test blob:
  c302dd99e143967fed6edd65b429373e87453fc6

predecessor STOP Result / Receipt / Handoff blobs:
  7aab4bbb37447468e47fd6e2c2e1a1aba0fe8ab9
  77c3b7c012c22bbee2bb0939efc5c15319def484
  f83fbe993b7b8efacc19f760cc0212e35e6ef9b4

predecessor STOP Receipt logical SHA-256:
  28921fc6667a8d75a01c441b454d5e0d5ce2a688ec5cfbff0db555f1a8504cd2
```

GitHub prewrite では Cocolon main が exact predecessor のまま、新規 Result / Receipt / Handoff
path は absent、Plan / 07 / 08 の blobs はそれぞれ
`4240668b5fe565217493361e6872d6586b3f3884` /
`8877c22306803789698a90662d99f4f6d63b980b` /
`d28347a19ab31519923d0e56a12f59bb99acc3a8` と一致した。

## 3. Frozen inputs and helpers

formal lock は mashos-api の
`ai/configs/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_lock_v1.json` から read-only に
取得した。

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

required role-path ordered SHA-256:
  e01f5e587ba1884b988075eee1c162454d3a6a1d4b10febc3b7111c2b5c1b248

base runtime:
  CPython 3.12.13 / Linux x86_64 / pip 26.0.1

base and admitted interpreter SHA-256:
  9ed008e5a8685235361f0c53771b520ab082dd99a877ad2fd796a93fa4c0b488
```

authority-bound helper exact5 は execution 前に final body を freeze した。helper body と absolute
path は公開しない。

| Role | Creation | Execution | Frozen raw SHA-256 |
|---|---:|---:|---|
| PROJECTION_VERIFIER | 1 | 1 | `aa8c1f90c7c113816b10fdb7b584cc824dbac7ae2d985a33d9799a6e16604ea1` |
| MATERIALIZER | 1 | 1 | `ca48283fa60e1597a8ef9b773bfaf845f57cc7aa4a08a90f70981a99f41954aa` |
| OWNER_IDENTITY_VERIFIER | 1 | 0 | `2b899778257ed55e8865543c7a9e63845fe02127ba6b3e65ecfd3d8a2fa87f84` |
| INDEPENDENT_IDENTITY_VERIFIER | 1 | 0 | `4a2f512c906f9f0b0848c0c112c78aeee5a6522acc576bac9104492d79c3e37c` |
| ROLE_SMOKE | 1 | 0 | `b368d273fab15400964617489b72a48274c7081e3556eb4086e7256ef3d5d2a2` |

helper reuse、prior runtime/wheel/readiness credit reuse は 0 である。

## 4. Acquisition and materialization observation

```text
configured-route acquisition / network process / exit:
  1 / 1 / 0

accepted / rejected wheel count:
  5 / 0

accepted wheel total bytes:
  1724842

accepted wheel manifest SHA-256:
  00d2df98c8cda7f1473794892bafe7ccd18cc816c79ccb346f3e21ff629b136d

sdist / build / substitution / unconfigured source:
  0 / 0 / 0 / 0

fresh venv creation / local pip install process:
  1 / 1

installed distribution / RECORD-closure matches:
  5 / 5

distribution closure SHA-256:
  4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c

aggregate installed-file expected identity match:
  false

materializer execution / typed failure:
  1 / INSTALLED_FILE_MANIFEST_IDENTITY_MISMATCH
```

configured route、URL、credential、environment value、wheel/package/RECORD body、acquisition raw
output、runtime body は公開しない。private acquisition output は 1,396 bytes、body-free SHA-256
`a2f1f7c587e054d8b54c00d55bb641ddb7f53e118a4815c8226c2439337509aa` としてのみ保持する。

## 5. Downstream non-execution and zero effects

```text
owner identity derivation: 0
pytest version probe: 0
required-role smoke: 0
independent identity derivation: 0
pre/post probe full-root reconciliation: NOT_REACHED
runtime READY admission: 0

target import / collection / test call: 0 / 0 / 0
targeted pytest / ordered exact24 / full52 / full54 / exact100: 0 / 0 / 0 / 0 / 0
protected-test append / production change: 0 / 0
mashos-api changed path: 0
fixture / sample / corpus change: 0 / 0 / 0
fresh Product Read / G5 / G6 / G7: 0 / 0 / 0 / 0
Cycle001 acceptance: 0
retry / fallback / repair / cache deletion / interpreter switch: 0 / 0 / 0 / 0 / 0
```

failed session-local root は READY、admitted runtime、再利用可能な readiness credit のいずれにも
分類しない。現 authority では触れ直さず、absolute locator も公開しない。

## 6. Durable STOP scope

本 checkpoint は Cocolon の Result / body-free Receipt / Handoff new3 と、ExecutionAndClosurePlan /
07 append-only modified2、08 current-navigation modified1 の exact6 だけで閉じる。mashos-api write、
deletion、rename、承認外 path は 0 である。

prepared-byte equality、write commit changed-path union exact6、latest-main inclusion を GitHub から
fresh postverify した場合だけ durable closure とする。この publication は runtime retry、Gate C、
protected-test append、target execution、G5/G6/G7、Cycle001 acceptance を許可しない。

次の作業は自動進行ではない。typed failure の原因と新規 fresh attempt の扱いを含む separate Mash
approval が必要であり、現在の V1 authority は再利用しない。
