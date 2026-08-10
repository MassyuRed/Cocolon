# Handoff — G4 post-G6 Gate B fresh runtime rematerialization typed failure V1

- Date: 2026-08-10
- Decision owner: Mash
- Operation owner: Karen
- Authority: `NLS_V3_STEP11_CYCLE001_G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_FRESH_RUNTIME_REMATERIALIZATION_AND_READINESS_RECONCILIATION_V1`
- State: `G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_TYPED_MATERIALIZATION_FAILURE`
- Typed reason: `INSTALLED_FILE_MANIFEST_IDENTITY_MISMATCH`
- Lifecycle: `CLOSED_CONSUMED_TYPED_FAILURE`
- Automatic progression: false
- Body-free: true

## Handoff verdict

Gate B の corrected exact7 preflight と fresh exact5 acquisition は成功した。fresh venv 作成 exact1、
accepted wheel だけを使う local installation exact1、および per-distribution installed RECORD closure
exact5 / distribution closure の照合まで成立した。

aggregate installed-file manifest が承認済み expected SHA-256
`9c6925ed94b8eb1ccd22d2d4aeccc5dde35c7c23915ae6d367fcaff17bf09de6`
に一致しなかったため、materializer execution exact1 は fail-closed した。owner-before-probe、
pytest version probe、required-role smoke、independent-after-probe、pre/post full-root reconciliation は
未実施である。fresh runtime は READY または admitted と分類しない。

```text
G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_TYPED_MATERIALIZATION_FAILURE
INSTALLED_FILE_MANIFEST_IDENTITY_MISMATCH
CURRENT_G4_GATE_B_AUTHORITY_CLOSED_CONSUMED_TYPED_FAILURE
NEXT_G4_GATE_B_RECOVERY_SEPARATE_MASH_APPROVAL_REQUIRED
CURRENT_AUTHORITY_STOP
AUTOMATIC_PROGRESSION_FALSE
```

current V1 authority は消費済みである。同一 authority 内の helper 修正、再取得、再 materialization、
runtime repair、cache deletion、retry、fallback、interpreter switch は 0 のまま閉じた。

## Preserved immutable entry

```text
Cocolon predecessor:
  97be1644455deb5bd069a9dff02f0440a5c2ad48

mashos-api commit / tree:
  45bf98f9034261d3adb3e808d6d759f2334e2d25
  23f1684ed5430cafef955d7af9fc6bde75a4c62f

production / protected-test blobs:
  f10ce7948e5570ee8ad27ee2af00a9caf3867d49
  c302dd99e143967fed6edd65b429373e87453fc6

predecessor STOP Result / Receipt / Handoff blobs:
  7aab4bbb37447468e47fd6e2c2e1a1aba0fe8ab9
  77c3b7c012c22bbee2bb0939efc5c15319def484
  f83fbe993b7b8efacc19f760cc0212e35e6ef9b4
```

formal lock は Cocolon ではなく mashos-api の fixed path にあり、blob / raw / logical identities は
`0822fcb010985cd0d384f250a9e8a1fe16dc8fd4` /
`9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787` /
`801ba54efc0f6655238d14e7c153fb70b555801489aa8ba028515fc64d9c05f4` で一致した。

## Execution checkpoint

```text
corrected exact7 projection:
  2185 bytes
  f501025c1dccef68c47c0a3e52f3ef74d01233f371b16f2b1a0bdfb21089e57e

requirements:
  473 bytes / LF5
  4f7218509a20e42850afe75597f2abfdf447035001847621d4637faa246065f1

configured-route acquisition / network process / exit:
  1 / 1 / 0

accepted wheel count / total bytes / manifest:
  5 / 1724842
  00d2df98c8cda7f1473794892bafe7ccd18cc816c79ccb346f3e21ff629b136d

fresh venv / local install:
  1 / 1

installed distribution / RECORD closure match:
  5 / 5

distribution closure:
  4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c

aggregate installed-file manifest match:
  false

owner / pytest probe / role smoke / independent:
  0 / 0 / 0 / 0

runtime READY admission:
  0
```

Authority-bound helper exact5 の frozen raw SHA-256 と execution count は次のとおりである。

| Role | Creation | Execution | Raw SHA-256 |
|---|---:|---:|---|
| PROJECTION_VERIFIER | 1 | 1 | `aa8c1f90c7c113816b10fdb7b584cc824dbac7ae2d985a33d9799a6e16604ea1` |
| MATERIALIZER | 1 | 1 | `ca48283fa60e1597a8ef9b773bfaf845f57cc7aa4a08a90f70981a99f41954aa` |
| OWNER_IDENTITY_VERIFIER | 1 | 0 | `2b899778257ed55e8865543c7a9e63845fe02127ba6b3e65ecfd3d8a2fa87f84` |
| INDEPENDENT_IDENTITY_VERIFIER | 1 | 0 | `4a2f512c906f9f0b0848c0c112c78aeee5a6522acc576bac9104492d79c3e37c` |
| ROLE_SMOKE | 1 | 0 | `b368d273fab15400964617489b72a48274c7081e3556eb4086e7256ef3d5d2a2` |

## Durable owners

| Role | Path | Bytes | LF | Raw SHA-256 | Git blob |
|---|---|---:|---:|---|---|
| Result | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4_PostG6SharedStructuralCorrection_GateB_FreshRuntimeRematerializationAndReadinessReconciliation_V1_Result_20260810.md` | 7928 | 192 | `870842e33e7b2df8b3073f3a01aecebc79a3aec95ba44eaf561f708c2870cd27` | `bbd1c96efb02121dcea472423d04a4938d14df6e` |
| Body-free Receipt | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4_PostG6SharedStructuralCorrection_GateB_FreshRuntimeRematerializationAndReadinessReconciliation_V1_BodyFree_Receipt_20260810.json` | 16305 | 370 | `a1ad0d689abdbb669d652e0007d6fa3023a6a9ea07bc54855457d252a0246aa8` | `fe610a3614deac5a1d1961ac276ec6470ef18160` |
| Receipt logical | sorted compact JSON with self field empty / no final LF | — | — | `a2f978bf7b27f565147eeeaab4fc9e25d5ea3797318924fb376554eef47fb120` | — |
| Handoff | this path | self identity omitted to avoid a hash cycle | — | — | — |

## Zero-effect boundary

target import/collection/call、targeted pytest、ordered exact24、full52、full54、exact100、
protected-test append、production/fixture/sample/corpus change、mashos-api write、fresh Product Read、
G5/G6/G7、Cycle001 acceptance は全て 0 である。configured route/URL、credential、environment value、
wheel/package/RECORD body、raw acquisition output、helper/runtime body、absolute private path は公開しない。

## Required next approval boundary

次の authority はまだ発行されていない。必要なのは自動 retry ではなく、この typed failure を入口に、
aggregate installed-file identity の不一致をどう扱うかと、new nonreuse fresh attempt または alternative
closure を明示する separate Mash approval である。

```text
proposed authority label:
NLS_V3_STEP11_CYCLE001_G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_RECOVERY_AFTER_TYPED_FAILURE_V1

state:
NOT_ISSUED_SEPARATE_MASH_APPROVAL_REQUIRED

current V1 reuse:
false

Gate C / target / protected-test append:
NOT_AUTHORIZED

automatic progression:
false
```

この exact6 が GitHub latest main に含まれ、prepared-byte equality と changed-path union exact6 が
fresh postverify されるまで次の technical authority を開始しない。
