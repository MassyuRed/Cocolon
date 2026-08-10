# Handoff — G4 post-G6 shared structural correction Gate A runtime identity invalid preactivation STOP V1

- Date: 2026-08-10
- Decision owner: Mash
- Operation owner: Karen
- State: `G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_PREACTIVATION_STOP_RUNTIME_IDENTITY_INVALID`
- G4 lifecycle: `CLOSED_UNCONSUMED_PREACTIVATION_STOP`
- Automatic progression: false
- Body-free: true

## Handoff verdict

Mash承認済みG4 authorityのGate Aで、declared exact1 runtime candidateのfull-root identity
不一致を検出した。entrypoint、same-root interpreter、pytest package、exact5 versionsは一致したが、
過去READY時files498 / site-files487に対しcurrentは600 / 589であり、16 `__pycache__`
directories / 102 `.pyc` filesの増加を確認した。cache entryもnormative manifest対象である。
current full-root manifestは650 rows / 157,431 bytes / SHA-256
`6371e805b68cb5d27e75e6f7b6ebe64b482e14418d1a0b108a1b62037129a6f1`で、
cache exclusion0である。

G4はactivation0 / admission0 / technical consumption0、target invocation0で閉じた。
pytest、repository import、collection、test call、protected-test append、mashos-api writeは全て0である。

```text
G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_PREACTIVATION_STOP_RUNTIME_IDENTITY_INVALID
RUNTIME_IDENTITY_INVALID_AT_DECLARED_DISCOVERY_SCOPE
CURRENT_G4_AUTHORITY_CLOSED_UNCONSUMED
NEXT_G4_GATE_B_FRESH_RUNTIME_REMATERIALIZATION_AND_READINESS_RECONCILIATION_SEPARATE_APPROVAL_REQUIRED
CURRENT_AUTHORITY_STOP
AUTOMATIC_PROGRESSION_FALSE
```

G4 causal REDは未実行・未分類であり、承認内容2のsuccess terminalまたはG5 permissionは成立しない。
G3 post-G6 frozen contractと旧G3〜G6 historical evidenceは変更していない。

## Preserved immutable entry

```text
Cocolon predecessor:
  f05bcda3f7ce9166c7ff350d8d1e97d407de41ff

mashos-api main / tree:
  45bf98f9034261d3adb3e808d6d759f2334e2d25
  23f1684ed5430cafef955d7af9fc6bde75a4c62f

production blob:
  f10ce7948e5570ee8ad27ee2af00a9caf3867d49

protected-test blob:
  c302dd99e143967fed6edd65b429373e87453fc6

future ordered exact24 ID+LF SHA-256:
  b3ac62fee89d554a2e30e507cfc211cb157130553a9eb7c8d42b762a53c6b0ef
```

protected testは431,357 bytesのcurrent preimageのままでappend0である。new dynamic exact2、
versioned replacement freeze helper、oracle、lossless patchまたはlocal unpublished candidateは作成していない。

## Durable owners

| role | path | bytes | LF | SHA-256 | Git blob |
|---|---|---:|---:|---|---|
| Result | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4_PostG6SharedStructuralCorrection_GateA_FullRootCacheManifestDrift_RuntimeIdentityInvalid_PreactivationStop_V1_Result_20260810.md` | 8318 | 177 | `04967830a2b061239a2f847d5f8073703d38e687b4c03fb483e0daa80b44d538` | `7aab4bbb37447468e47fd6e2c2e1a1aba0fe8ab9` |
| body-free Receipt | `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4_PostG6SharedStructuralCorrection_GateA_FullRootCacheManifestDrift_RuntimeIdentityInvalid_PreactivationStop_V1_BodyFree_Receipt_20260810.json` | 15523 | 331 | `689b4967935366114291157654b52bbb93094b756fe008c6f5b7abf69c991e98` | `77c3b7c012c22bbee2bb0939efc5c15319def484` |
| Receipt logical | sorted compact JSON with self field empty / no final LF | — | — | `28921fc6667a8d75a01c441b454d5e0d5ce2a688ec5cfbff0db555f1a8504cd2` | — |
| Handoff | this path | self identity omitted to avoid a hash cycle | — | — | — |

## Required next approval boundary

次のauthorityはG4 target retryではなく、別Gate Bのfresh runtime rematerialization and readiness
reconciliationだけである。

```text
authority:
NLS_V3_STEP11_CYCLE001_G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B_FRESH_RUNTIME_REMATERIALIZATION_AND_READINESS_RECONCILIATION_V1

state before approval:
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
false
```

入口はこのSTOP exact6のpostverified latest-main inclusionと、mashos-api
`45bf98f9034261d3adb3e808d6d759f2334e2d25` / tree
`23f1684ed5430cafef955d7af9fc6bde75a4c62f`のfresh一致である。

Gate B source exact identities:

```text
formal lock:
  ai/configs/emlis_nls_v3_recovery_epoch002_formal_worker_bootstrap_lock_v1.json
  blob 0822fcb010985cd0d384f250a9e8a1fe16dc8fd4
  raw SHA-256 9bb2875541a6d959c1dca47cb5b96de5b0041ccf5288e849c469c15a8b310787
  logical SHA-256 801ba54efc0f6655238d14e7c153fb70b555801489aa8ba028515fc64d9c05f4

exact7 projection:
  bytes 2185
  SHA-256 f501025c1dccef68c47c0a3e52f3ef74d01233f371b16f2b1a0bdfb21089e57e

fresh requirements:
  bytes 473 / LF 5
  SHA-256 4f7218509a20e42850afe75597f2abfdf447035001847621d4637faa246065f1

accepted wheel manifest / expected distribution closure:
  00d2df98c8cda7f1473794892bafe7ccd18cc816c79ccb346f3e21ff629b136d /
  4d3d6afdac2b9a606d4797ff5fbe65010faddf0de9788202798ddb8d95e6556c

base runtime:
  CPython 3.12.13 / Linux x86_64
  interpreter SHA-256 9ed008e5a8685235361f0c53771b520ab082dd99a877ad2fd796a93fa4c0b488
  base pip 26.0.1
  venv --without-pip --copies

fresh entrypoint / pyvenv / full-root:
  FRESH_DERIVATION_REQUIRED / PRIOR_INSTANCE_EQUALITY_NOT_REQUIRED

expected path-free installed-file manifest:
  9c6925ed94b8eb1ccd22d2d4aeccc5dde35c7c23915ae6d367fcaff17bf09de6

environment-policy SHA-256:
  8a43751b49a8db1d024063608405f9b169e829f3c0be3488433b31800d44b1a4

required role-path ordered SHA-256:
  e01f5e587ba1884b988075eee1c162454d3a6a1d4b10febc3b7111c2b5c1b248
```

許可するのは次だけである。

1. frozen lock / exact7 projection / mashos source exact identitiesのread-only preflight。
2. fresh private empty staging/download/runtime rootの割当。
3. configured route exact1 / network process exact1によるwheel-only exact5 fresh acquisition。
4. hashes-required / no-index / no-dependency / no-compileのisolated rematerialization exact1。
5. authority-bound new helper exact5を、tracked procedureからexecution前に作成し、raw hashを
   freezeする。projection verifier / materializer / owner identity verifier / independent identity
   verifier / role-smoke helperを各creation1 / execution1とし、helper reuse0とする。
6. distribution/RECORD/installed-file/full-root/interpreter/entrypoint/control/environment-policy
   identitiesのowner-before-probe exact1 + independent-after-probe exact1 reconciliation。
   fresh rootのentrypoint shebang、pyvenv.cfg、full-root manifestはpath-dependentであるため、
   prior instance equalityを要求せず、new instance内owner=independentとpre/post equalityを要求する。
7. empty non-repository cwd、fixed environment、exact admitted interpreterによるpytest version probe
   exact1。`-I -B -m pytest --version -p no:cacheprovider`、exit0、stdout exact
   `pytest 8.4.1` + LFを必須にする。
8. frozen exact3 role sourceをdirect-load3、public API call0、role effect0とするrequired-role smoke
   process exact1。
9. probes前後のfull-root manifest一致、runtime tree change0、cache生成0を再確認する。
10. Result / Receipt / Handoff + Plan/07/08 Cocolon exact6のbody-free publication。
11. `RUNTIME_READY_CURRENT_SESSION`またはtyped failureでSTOP。

tracked procedure exact2:

| role | path | blob | raw SHA-256 |
|---|---|---|---|
| normative runtime contract | `Cocolon_前提資料/13_cocolon_work_test_runner_runtime_continuity.md` | `ea7f96221846e5614431296e00ac481cc00e00a2` | `42fcd4d65b0d21b5e41659b6329c55c14ed42c0270838f13be6102b351db7ac9` |
| mandatory prelaunch rules | `Cocolon_前提資料/work_attitude_rules_for_karen/16_test_runner_runtime_continuity_and_one_shot_prelaunch.txt` | `5c3b7dd03c84a84a2717f57f0d2c99c39b2ed6d8` | `895ea1f130e331d4e89f857835b4477d949c1ff63c0adea11276bc97b4c717b2` |

required role exact3:

| role | path | blob | raw SHA-256 |
|---|---|---|---|
| owner | `ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py` | `044287009b1fd155689bded46628b8fc91b73c06` | `13aa675be1356ab524a69066f861c2d27a8d8e32f0d690811b2b3308f199057d` |
| independent | `ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py` | `0fae71a29f8fe44d31c18af42aaf53cc34beac6c` | `634ddb104e0b7630c695e032bb54726912fcfc9ad4351ab0eb6da7901671fc2b` |
| parent | `ai/tools/emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py` | `fdea3dc18d81ca9ce1e3a842e802d21d0019a8c5` | `14fedde39823d90253a6adec6fc05ccde29f05a659edbac7edc007b28eab5793` |

禁止するのはprior runtime/wheel/helper/readiness creditのreuse、current invalid rootのcache削除・repair・
re-admission、sdist/build/substitution/unconfigured source/retry/fallback/interpreter switch、target import/
collection/call、protected-test append、mashos-api write、production/fixture/sample/corpus change、
historical full52、whole-file full54、ordered exact24、exact100、fresh Product Read、G5、G6、G7、
Cycle001 acceptanceである。

GitHubへabsolute runtime/helper path、configured route/URL、credentialまたはenvironment value、
wheel/package/RECORD body、raw acquisition output、helper body、runtime bodyを公開しない。

Gate B READY後も自動進行しない。READY exact6をpostverifyした後、protected-test append、static oracle
admission、ordered exact24 one-shot、causal RED classificationには別のG4 Gate C Mash承認が必要である。
approval2または今回のclosed G4 authorityはretry/reuseしない。

## STOP closure rule

このcheckpointはCocolon new3 + Plan/07/08 modified3のexact6だけで閉じる。prepared-byte equality、
changed-path exact6、unauthorized0、deletion0、rename0、latest-main inclusionをfresh postverifyする。
mashos-api changed pathは0である。
