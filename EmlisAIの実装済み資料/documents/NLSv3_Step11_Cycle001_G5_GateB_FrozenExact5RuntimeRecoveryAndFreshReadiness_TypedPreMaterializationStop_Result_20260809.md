---
doc_id: NLSv3_Step11_Cycle001_G5_GateB_FrozenExact5RuntimeRecoveryAndFreshReadiness_TypedPreMaterializationStop_Result_20260809
date: "2026-08-09"
state: "G5_GATE_B_MATERIALIZER_SCHEMA_INVALID_PREMATERIALIZATION_STOP"
body_free: true
automatic_progression: false
---

# G5 Gate B frozen-exact5 recovery / fresh-readiness Result

## 0. 結論

Mash様が別途明示承認した G5 Gate B recovery は、frozen exact5 wheel の configured-route
取得までは成立しましたが、authority-bound materializer の projection preimage schema が
凍結契約と一致せず、fresh runtime を作る前に exit 1 で停止しました。

```text
terminal:
G5_GATE_B_MATERIALIZER_SCHEMA_INVALID_PREMATERIALIZATION_STOP

typed reason:
AUTHORITY_BOUND_MATERIALIZER_PROJECTION_PREIMAGE_SCHEMA_INVALID_PREMATERIALIZATION_STOP

automatic progression:
false
```

materializer は lock の exact5 row から凍結 exact7 projection を作るべきところ、lock row の
補助 field を含む full exact9 row を hash 対象にしました。observed full-row SHA-256
`0d8c1584d30eb417142e1afac13b776a235def0112ef58e928f8322ad781e13f` は、required projected-row
SHA-256 `f501025c1dccef68c47c0a3e52f3ef74d01233f371b16f2b1a0bdfb21089e57e`
と一致しないため、helper 自身が `PROJECTION_IDENTITY` で fail-close しました。

凍結 exact7 row key は次の ordered exact7 です。

```text
distribution_version
installed_record_closure_sha256
normalized_distribution_name
selected_dependency_names
wheel_filename
wheel_record_sha256
wheel_sha256
```

lock 順 exact5 rows を維持し、各 row は上記 exact7 key だけを選択して object key を
lexicographic order にし、UTF-8 compact JSON array、final LF なしで canonicalize します。
full exact9 row にのみ存在して誤って含めた excluded exact2 は `requires_dist` と
`top_level_imports` です。

これは lock、wheel、GitHub source の不一致ではなく、今回作成した local helper の semantic
contract defect です。helper AST exact3 の static parse は VALID でしたが、この row-key
projection defect を検出できなかったため、その static validation は readiness credit になりません。

## 1. Authority lifecycle

```text
authority ID:
G5_GATE_B_FROZEN_EXACT5_RUNTIME_RECOVERY_AND_FRESH_READINESS_20260809

decision owner / operation owner:
Mash / Karen

approval / activation / consumption / typed classification / close:
exact1 / exact1 / exact1 / exact1 / exact1

final lifecycle:
CLOSED_CONSUMED_TYPED_STOP

retry / reuse / reactivation / reclassification:
exact0 / exact0 / exact0 / exact0
```

この authority は、過去の failed Gate B version-probe authority を再利用または再開していません。
historical failed version-probe count exact1 は closed noncredit のままです。

## 2. GitHub/source cut and frozen inputs

```text
Cocolon main:
57b64ec9ca95dd991badac96fe9c2f53b1bc57a9

mashos-api main:
b0a8c70e5cec08581678b98f2e21571d17674d91

formal lock blob / raw / logical SHA-256:
0822fcb010985cd0d384f250a9e8a1fe16dc8fd4
9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787
801ba54efc0f6655238d14e7c153fb70b555801489aa8ba028515fc64d9c05f4

tracked procedure blob / raw SHA-256:
ea7f96221846e5614431296e00ac481cc00e00a2
42fcd4d65b0d21b5e41659b6329c55c14ed42c0270838f13be6102b351db7ac9

frozen exact5 projection SHA-256:
f501025c1dccef68c47c0a3e52f3ef74d01233f371b16f2b1a0bdfb21089e57e

historical accepted-wheel manifest SHA-256:
00d2df98c8cda7f1473794892bafe7ccd18cc816c79ccb346f3e21ff629b136d
```

Current required-source exact6 は fresh GitHub read で blob exact-match でした。production
blob `1c19b6c293e20a9094b9180fded8c167daaaf5eb`、corrected protected-test blob
`25f302a35d9e00df96f69d2eca26cc3caccc0e35`、ordered exact24 SHA-256
`ea5f4afb819210eac771db02287c02475afb19cf9cff0408c7ce3dd866df10b9`
はいずれも不変です。

## 3. Frozen exact5 acquisition input and result

| distribution | version | wheel filename | raw SHA-256 | wheel RECORD SHA-256 |
|---|---:|---|---|---|
| iniconfig | 2.3.0 | `iniconfig-2.3.0-py3-none-any.whl` | `f631c04d2c48c52b84d0d0549c99ff3859c98df65b3101406327ecc7d53fbf12` | `06144d1d47c00e05c46b66ee3503fc35022bbce0a18089371d0bcd24de9abcad` |
| packaging | 26.2 | `packaging-26.2-py3-none-any.whl` | `5fc45236b9446107ff2415ce77c807cee2862cb6fac22b8a73826d0693b0980e` | `f8970ce9313b03142296fcbb8c9db6df7836e66710a71ae07b99939fc49f30cf` |
| pluggy | 1.6.0 | `pluggy-1.6.0-py3-none-any.whl` | `e920276dd6813095e9377c0bc5566d94c932c33b27a3e3945d8389c374dd4746` | `e3f054e6e651035e45561a2f97427e0cd24205e6c1ee6c9c38cc59424b743c90` |
| pygments | 2.20.0 | `pygments-2.20.0-py3-none-any.whl` | `81a9e26dd42fd28a23a2d169d86d7ac03b46e2f8b59ed4698fb4785f946d0176` | `cbcfe0f4255177b43aad099d47a0551c6304fa6a3dd8d5d65d6ff0d2f53ff804` |
| pytest | 8.4.1 | `pytest-8.4.1-py3-none-any.whl` | `539c70ba6fcead8e78eebbf1115e8b589e7565830d7d006a8723f19ac8a0afb7` | `73ca68976a7a39a5127f1ad03216d55b1f6a1bda49e509543a8288c45310237c` |

```text
requirements preimage raw SHA-256 / bytes / LF:
4f7218509a20e42850afe75597f2abfdf447035001847621d4637faa246065f1
473 / 5

configured-route policy identity SHA-256:
d45bde54a7a6860180ad9c805874b162b2a40c52c5c98916061088782a48c61c

acquisition logical argv SHA-256:
560a13e661344479eaf5065507056ca1d3f50fe4c9d2893c8725a2983da5e33b

configured-route acquisition / network process / exit:
exact1 / exact1 / 0

accepted wheel count / total bytes / manifest SHA-256:
exact5 / 1724842 /
00d2df98c8cda7f1473794892bafe7ccd18cc816c79ccb346f3e21ff629b136d

rejected / sdist / build / substitution / unconfigured source:
exact0 / exact0 / exact0 / exact0 / exact0

acquisition stdout / stderr bytes:
0 / 0

acquisition stdout / stderr SHA-256:
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

The configured route, URL, credentials, private wheel locator, wheel bytes, and raw acquisition
body are not published. The acquired bytes are session-local noncredit input and are not reusable
after this closed authority. A later authority must reacquire fresh bytes or independently establish
a distinct authorized source under its own exact counters; these session-local files remain prohibited.

## 4. Helpers and attempted materialization

```text
materializer helper creation / execution / raw SHA-256:
exact1 / exact1 /
ad4ad342b5501b73bb012e30ef4003c99d270138f02a21fabd947153cbfbba6f

independent verifier helper creation / execution / raw SHA-256:
exact1 / exact0 /
acd530c40c31879aedf48e6e82cd6b017871e424bdf29e36d0ab9d328927e8f5

role-probe program creation / execution / raw SHA-256:
exact1 / exact0 /
1b3d73e8557e17ca38218df3788045bd4060725af10c3756171ac3f6917736a6

helper static AST verifier process / parsed helper count / result:
exact1 / exact3 / VALID_SYNTAX_ONLY_NONCREDIT

static verifier program SHA-256:
05b7c32f4c8c5f913ec8edd9f8bf5b9ba966c7fc174955bc57a4907b446b9150

fresh empty root allocation / entries before helper:
exact1 / 0

materializer logical argv SHA-256:
a14f287a972d2697919221eb9c4d2e38f63b71e4a4ae5445c23d681c08669c6e

materializer process / exit / stdout bytes:
exact1 / 1 / 0

materializer stdout SHA-256:
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855

materializer private stderr bytes / SHA-256:
478 /
09b0d2ab0c894d4d8f7baa3ec42da02e2eac3223300f1f22cf4ff8ceb5f4629f

sanitized failure projection bytes / SHA-256:
88 /
8932237ae2a68c03dce042e42c7f62e8d6cb99e78c25f15ece67e6fde316b7ba

fresh root entries after helper / rematerialization count:
0 / exact0

materializer internal pip process / runtime file write / owner identity output:
exact0 / exact0 / exact0
```

Sanitized failure projection actual bytes are the following one LF-terminated line:

```text
AUTHORITY_BOUND_MATERIALIZER_PROJECTION_PREIMAGE_SCHEMA_INVALID_PREMATERIALIZATION_STOP
```

The raw private stderr, traceback body, absolute helper/runtime paths, helper bodies, session IDs,
and environment values are not published. Failed helper bytes are nonreusable and no future action
depends on them; raw hash and the exact semantic defect above are sufficient to prevent reuse.

## 5. Readiness, target, and product zeros

```text
owner full-identity derivation / independent full-identity derivation:
exact0 / exact0

runtime content / root / materialization event / instance / continuity identity:
NOT_ESTABLISHED / NOT_ESTABLISHED / NOT_ESTABLISHED / NOT_ESTABLISHED / NOT_ESTABLISHED

current Gate B pytest version probe / role smoke / direct role load:
exact0 / exact0 / exact0

public API call / role effect:
exact0 / exact0

target import / collection / call / targeted pytest:
exact0 / exact0 / exact0 / exact0

ordered exact24 / full exact52 / exact100:
exact0 / exact0 / exact0

Gate C admission / target authority issuance / target authority consumption:
exact0 / exact0 / exact0

prior-runtime reuse / retry / fallback / interpreter switch / repair / silent install:
exact0 / exact0 / exact0 / exact0 / exact0 / exact0

mashos-api / production / protected test / fixture / sample change:
exact0 / exact0 / exact0 / exact0 / exact0

G5 machine GREEN / G6 Product Read / Cycle001 acceptance:
exact0 / exact0 / exact0
```

Corrected G4 remains `CLOSED_CONSUMED_CAUSAL_RED_PASS` with 22 PASS / 2 causal RED.
The local bounded G5 production patch remains unexecuted, unpublished, and noncredit.

## 6. Next authority and STOP

```text
current G5 state:
G5_GATE_B_PREMATERIALIZATION_TYPED_STOP

first unfinished gate:
G5_GATE_B_CORRECTED_PROJECTION_SCHEMA_FRESH_RECOVERY_ONLY

next authority state:
SEPARATE_MASH_APPROVAL_REQUIRED

Gate C:
UNISSUED_INACTIVE

automatic progression:
false
```

A later recovery must use a newly created helper whose projection preimage selects the ordered exact7
keys and canonical rule frozen above before hashing, statically verify that semantic projection,
reacquire or independently establish
exact5 artifact availability, then start a new isolated rematerialization authority. This closed
authority, its acquired wheel bytes, materializer launch, or failure output must not be retried,
reused, repaired, or reclassified.
