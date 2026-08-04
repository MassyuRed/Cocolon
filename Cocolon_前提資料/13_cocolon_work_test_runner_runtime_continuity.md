---
doc_id: cocolon_work_test_runner_runtime_continuity
title: "Cocolon Work test-runner runtime continuity contract"
revision_date: "2026-08-02"
status: "CURRENT_NORMATIVE_CONTRACT"
scope: "WORK_LOCAL_PYTHON_PYTEST_TEST_RUNNER_ONLY"
decision_owner: "Mash"
operation_owner: "Karen"
execution_location: "current Work environment"
historical_result_reparse: false
automatic_progression: false
body_free: true
---

# Cocolon Work test-runner runtime continuity contract

## 0. この資料の役割

この資料は、Cocolon / EmlisAI作業で使用するWork-localのPython / pytest
test-runnerについて、sessionを跨いだ実在性確認、再発見、readiness、
rematerialization、targeted one-shot実行前の境界を固定するcurrent正本です。

対象はtest-runnerだけです。Cocolonのproduct runtime、React Native runtime、
backend production runtime、GitHub反映方法を変更しません。

GitHub反映方法と完了判定の正本は、引き続き
`11_cocolon_github_transport_and_session_continuity.md`の
`CURRENT_NORMATIVE_CONTRACT`です。本書は`11`へruntime durability条件を
追加しません。

華恋用の強制実行規則は
`work_attitude_rules_for_karen/16_test_runner_runtime_continuity_and_one_shot_prelaunch.txt`
です。技術定義は本書、毎回の実行checkは`16`を正とし、全文を複製しません。

## 1. 固定owner

- test-runner runtimeの発見、取得、materialization、verification、rediscovery、
  rematerialization、current-session locator管理の実行ownerは華恋です。
- `current Work environment`は実行場所であり、判断ownerまたは責任actorではありません。
- Mash様の役割は、既存authorityの承認境界を越える別作業が必要な場合の
  明示承認です。
- 華恋はMash様へ、Work-local absolute path、Python環境、venv、wheel、
  pytest installation、runtime directoryの提供を要求しません。
- runtime未発見、華恋のlocator確認不足、interpreter選択ミスをMash様の作業へ
  変換しません。

## 2. 過去のreadinessとcurrent eligibilityを分ける

過去の`RUNTIME_READY`は、その時点で成立した確認済み事実として保持します。
後日のsession切替、runtime消失、rematerializationは、過去のreadinessを
遡及的に無効化しません。

一方、過去のreadinessはfuture availabilityまたはcurrent execution eligibilityを
保証しません。session境界ではcurrent stateを自動的に
`CURRENT_CONTINUITY_UNVERIFIED`へ戻します。

同じ遷移は、workspace root変更、Work environment rebuild、prior locator不明、
runtime root / entrypoint不在、frozen lock変更、required role source変更を
確認した場合にも適用します。

```text
RUNTIME_READY_CURRENT_SESSION
  -- session boundary --> CURRENT_CONTINUITY_UNVERIFIED

CURRENT_CONTINUITY_UNVERIFIED
  -- same instance candidate rediscovered and all static identities match -->
     CROSS_SESSION_REDISCOVERED_PENDING_READINESS
  -- candidate absent in declared discovery scope -->
     RUNTIME_NOT_FOUND_AT_DECLARED_DISCOVERY_SCOPE
  -- candidate present but identity mismatch -->
     RUNTIME_IDENTITY_INVALID_AT_DECLARED_DISCOVERY_SCOPE

RUNTIME_NOT_FOUND_AT_DECLARED_DISCOVERY_SCOPE
or RUNTIME_IDENTITY_INVALID_AT_DECLARED_DISCOVERY_SCOPE
  -- separately approved rematerialization -->
     REMATERIALIZED_NEW_INSTANCE_PENDING_READINESS

CROSS_SESSION_REDISCOVERED_PENDING_READINESS
or REMATERIALIZED_NEW_INSTANCE_PENDING_READINESS
  -- separately authorized fresh identity/readiness verification valid -->
     RUNTIME_READY_CURRENT_SESSION
```

session境界だけでruntime実体の物理的消失を断定しません。
まずcontinuityを未確認へ戻し、read-only discoveryで実在とidentityを確認します。

## 3. persistence classとinstance表現

persistence classは次に限定します。

```text
SESSION_LOCAL
DURABLE_CROSS_SESSION_VERIFIED
UNKNOWN
```

`DURABLE_CROSS_SESSION_VERIFIED`は、別Work sessionからnon-secret locator
contractにより同一instanceを再発見し、必要identityを再導出して一致を実測した
場合だけ成立します。このclassでもprelaunch再確認は省略しません。

同じcontent hash、同じlogical runtime ID、同じabsolute pathだけでは
同一instanceのcross-session continuityを証明しません。rematerializationが
行われていないことを含むinstance observation chainを成立させられない場合は、
`CROSS_SESSION_REDISCOVERED`ではなく`REMATERIALIZED_NEW_INSTANCE`または
`UNKNOWN`として扱います。

recovery classはpersistence classと分け、次に限定します。

```text
NOT_ESTABLISHED
REDISCOVERABLE_BY_TRACKED_LOCATOR
REMATERIALIZABLE_FROM_FROZEN_LOCK
```

session-local runtimeでも、frozen lockとmaterialization contractが残っていれば
`REMATERIALIZABLE_FROM_FROZEN_LOCK`になり得ます。cross-sessionで見つかったことと、
消失後に同じcontentから再構築できることを同一視しません。

runtime instanceは次のいずれかで表現します。

```text
CURRENT_SESSION_RETAINED
CROSS_SESSION_REDISCOVERED
REMATERIALIZED_NEW_INSTANCE
```

今後は無修飾の`retained runtime`をcurrent状態名として使用しません。
同一content identityから作り直したruntimeも、同じretained instanceへ自動昇格
させません。過去資料の`retained session-local runtime`は、当時session内の
歴史的記録として保持し、遡及再解釈しません。

## 4. absolute pathの位置づけ

absolute runtime rootとabsolute executable pathは、current Work session内の
private operational locatorです。runtime identity、persistence証明、
future-session availability証明ではありません。

GitHubへ次を記録しません。

- absolute Work path、scratch identifier、session identifier
- runtime / venv directory本体
- wheel、cache、package、RECORD等のbody
- configured-route URL、raw acquisition output、host / cache identity
- credential、token、secret、environment variable value、acquisition trace

GitHubへ残すものはbody-freeな次のcontractです。

- frozen lockとsource identity
- path-free locator strategyとexecutable relative path
- persistence classとsession expiry trigger
- required identity schema
- rematerialization source contractと手順
- GitHub-tracked materialization / verification procedure identity
- tracked helperがある場合はそのmaterializer / verifierのrepository-relative identity
- tracked helperがない場合はauthority-bound local helperのraw hashと適用したtracked procedure identity
- readiness / discovery / recoveryのtyped result

absolute pathをGitHubへ記録するだけでは、runtimeを永続化したことになりません。

## 5. readiness evidence

runtime readinessはschemaとcanonical preimageを固定し、適用される項目を
曖昧な総称へまとめず別fieldとして記録します。

- lock repository path / Git blob SHA-1 / raw SHA-256 / logical SHA-256
- authority-specified runner projection SHA-256
- accepted artifactまたはwheel manifest SHA-256
- Python implementation / exact version / platform
- admitted executable relative path
- entrypoint、symlink chain、control file identity
- resolved interpreter executable SHA-256
- authority-specified exact pytest version
- distribution closure SHA-256
- installed-file manifest SHA-256
- full runtime-root manifest SHA-256
- runtime-root identity SHA-256
- environment-policy SHA-256
- GitHub-tracked materialization / verification procedure path、blob、raw hash
- tracked helperがある場合はhelper path、blob、raw hash
- tracked helperがない場合はauthority-bound local helper raw hash、creation count、tracked procedure identity
- logical runtime ID / runtime content identity
- runtime instance observation ID / runtime readiness observation ID
- materialization event ID / continuity observation-chain identity
- owner verdict / independent verifier verdict
- readiness observation / receipt identity
- persistence class、recovery class、instance class、locator strategy、expiry trigger
- rematerialization source contractとartifact availability class

active authorityが特定項目を`NOT_APPLICABLE`とする場合は、schema上の理由を
明記します。`logical runtime ID`、`dependency closure`、interpreter hashの
単独値だけで複数identityを代用しません。

identityの役割は次のように分けます。

- `logical_runtime_id`: frozen lock、projection、platform、environment policyの論理同一性。
- `runtime_content_identity`: distribution / RECORD / installed-file / full-rootのcontent同一性。
- `runtime_instance_observation_id`: content identity、materialization event、path-free locator
  observation、entrypoint / control identityを結合した観測同一性。
- `runtime_readiness_observation_id`: instance observation、version probe、role smoke、
  owner / independent verdictを結合したcurrent-session readiness。
- `continuity_observation_chain_identity`: prior observationとcurrent observation、
  rematerialization不実行またはnew eventを結合するchain。

各preimage field order、separator、encoding、empty / NOT_APPLICABLE表現は個別authorityで
canonicalに固定し、raw pathやsecretを混ぜません。

venv entrypointとbase interpreterが同じresolved executable bytesを共有しても、
package tree、control identity、runtime-rootは異なり得ます。そのためresolved
interpreter executable SHA-256単独ではreadinessまたはcontinuityを成立させません。

## 6. Gate A: RUNTIME_CONTINUITY_DISCOVERY

新しいWork session、またはpytestを必要とするtargeted authorityを提示する前に、
まずruntime continuity discoveryを行います。

探索前にcandidate discovery scopeをbody-freeに固定します。candidate countを
記録するときは、そのscopeを必ず同じreceiptに記録し、未探索locatorを
含むWork環境全体の不在として表現しません。

このgateで許可するのは、candidate locatorの探索と次のread-only確認です。

- root / entrypointの実在性
- file type、permission metadata、stat
- relative locator、readlink、symlink chain
- control file、entrypoint、manifest、lock / projection identityの静的再導出
- current stateのtyped classification

このgateでは次を許可しません。

```text
pytest process invocation: 0
target / required-role repository code import / execution: 0
authority-defined static continuity verifier process: declared exact count or 0
target import / collection / test call: 0 / 0 / 0
production change: 0
published test change: 0
runtime mutation / installation / repair: 0
Work-side artifact acquisition network: 0
challenge / remote observation: 0 / 0
```

static continuity verifierを使う場合は、read-onlyであること、target / required
roleをimportまたは実行しないこと、そのprocess countをdiscovery authorityで
固定します。

candidate不在は`RUNTIME_NOT_FOUND_AT_DECLARED_DISCOVERY_SCOPE`、identity不一致は
`RUNTIME_IDENTITY_INVALID_AT_DECLARED_DISCOVERY_SCOPE`としてSTOPします。
candidateの静的identityが一致しても`CROSS_SESSION_REDISCOVERED_PENDING_READINESS`
までであり、Gate AだけでREADYへ昇格させません。targeted authorityのactivation、
admission、consumptionへ進みません。

## 7. Gate B: RUNTIME_READINESS_RECOVERY

discoveryでcurrent readinessを成立させられない場合、target executionとは別の
authorityでrediscoveryまたはrematerializationを行います。

- cross-session rediscoveryも新しいsessionのreadiness creditを自動継承しません。
  exact pytest version probe、required role smoke、必要identityのfresh再導出を
  別authorityで成立させてから`RUNTIME_READY_CURRENT_SESSION`へ進みます。
- rematerializationはfrozen lockとauthority-specified projectionから行います。
- artifact acquisitionにnetworkが必要な場合、そのroute、artifact identity、
  network countを別authorityで明示します。
- fallback runtime、unfrozen dependency、silent installation、retry、
  interpreter switchへ進みません。
- rematerializationは`REMATERIALIZED_NEW_INSTANCE`です。旧readiness creditを
  継承せず、新instanceについて全identityとreadinessを再導出します。

`python -m pytest --version`を含む全てのpytest起動はpytest process invocation
として数えます。pytest version probeはtargeted executionとは別のreadiness
authorityで明示し、`readiness_pytest_version_probe_count`として記録します。

required role import probeもrepository code executionです。source identity、
process count、direct role-load count、public API call count、effect countを
readiness authorityで固定します。

version probe、role import probe、targeted invocationは別counterです。
未修飾の`pytest invocation exact1`で複数の目的をまとめません。

readinessを確定した時点でSTOPし、targeted one-shotへ自動進行しません。

### 7.1 materialization / verification procedureの永続性

session-local helperのabsolute pathだけを再構築ownerにしません。GitHubに残る
tracked procedureは、少なくとも次のordered operationとSTOP条件を固定します。

1. frozen lock、projection、source identityを先に検証する。
2. tracked helperがない場合は、authority-bound local materializer / independent
   verifier helperをtracked procedureから固定countで作成し、raw hashを固定する。
3. authorityが固定したconfigured routeとcountでwheel-only exact projectionだけを受け入れ、
   sdist、build、substitution、unconfigured source、retry、fallbackを0にする。
4. acquisition success後にcurrent private empty staging rootを割り当てる。
   このempty root allocation自体はmaterialization countへ0である。
5. target外の固定materializerでhashes-required、no-index、no-dependency、
   no-compileのisolated materializationを行う。
6. distribution / RECORD closure、installed-file、full-root、interpreter、
   entrypoint / control、environment-policy identityを再導出する。
7. exact pytest version probeとrequired role smokeを別counterで行い、結果を
   body-free receiptに固定してSTOPする。

repository-tracked helperがない場合、別authorityはこのtracked procedureと、
authority-bound local helperのraw hash、creation / execution count、適用した
procedure blob / raw hashを記録します。local helper本体やabsolute pathはGitHubへ
残さず、そのhelperの消失時はtracked procedureからnew helperとして再作成します。

## 8. Gate C: TARGET_EXECUTION_ADMISSION

targeted authorityは、current-session runtime readinessが別checkpointでVALIDと
なった後だけ提示できます。

activation / admission / consumptionの直前に、current private locatorから
解決したroot、entrypoint、control identity、required manifestsを静的に再導出
します。成立後は、その確認済みabsolute executable pathを直接launchします。

次を禁止します。

- generic `python`または`python3`
- `py`、`/usr/bin/env python`、PATH search、`which`、`command -v`の結果、
  default interpreter
- admitted executable以外へのfallbackまたはinterpreter switch
- target authority内でのdependency installation、runtime repair、rematerialization
- admission後の隠れたpytest version probeまたはrole import probe
- environment failure後のretryまたは別runtimeによる再実行

prelaunchで不在または不一致を確認した場合は、targeted invocationを0のまま
STOPし、Gate Aまたは別のGate B authorityへ戻ります。

activation、admission、consumptionは次のstateで分けます。

```text
RUNTIME_READY_CURRENT_SESSION
  -- Gate C static identity rederivation valid --> PRELAUNCH_ADMITTED
  -- Gate C invalid --> PRELAUNCH_REJECTED_STOP_TARGET_INVOCATION_EXACT0

PRELAUNCH_ADMITTED
  -- exact admitted absolute executable launch request issued -->
     TARGET_AUTHORITY_CONSUMED

TARGET_AUTHORITY_CONSUMED
  -- OS accepted child start --> TARGET_PROCESS_STARTED
  -- OS rejected child start --> TARGET_LAUNCH_REJECTED_STOP_CONSUMED_NO_RETRY
```

authority consumptionは、確認済みabsolute executableのlaunch requestをOSへ渡した
遷移でexact1とします。childがpytest frameworkへ到達したかとは別に数え、
OS reject、entrypoint内部failure、pytest-start exact0でも消費を巻き戻しません。
その場合もretry、fallback、別interpreterのlaunchは0です。

## 9. STOPとMash様への作業要求

STOPは、未確認runtimeでtargetを消費しないための正常なfail-closed境界です。
目的はSTOPをなくすことではなく、target admissionより前にruntime問題を検出し、
Work側のrecoveryへ分類することです。

runtime continuity failure時は次を行いません。

- causal RED / GREEN / creditへの昇格
- historical resultの再parseまたは再credit
- Mash様へのabsolute path、venv、pytest installation要求
- generic interpreterによる代替実行
- retry、fallback、silent repair

必要な別authority候補を華恋が具体化してMash様へ承認を求めることはできます。
その承認要求は、runtime本体やpathの提供要求ではありません。

## 10. historical resultとadditive correction

runtime喪失または後日の判断訂正によって、既存Result / Receipt / Handoffの
観測事実を書き換えません。誤ったfuture directionまたはuser action要求が
含まれる場合は、historical bytesを保持したままadditive correctionで
`SUPERSEDED_NON_CURRENT`とします。

訂正は次を分離して記録します。

- prior position
- proposed current position
- new observationまたはexact judgment error
- preserved historical facts
- superseded direction
- current ownerと次のseparate authority boundary

## 11. current checkpointへの適用

2026-08-01時点のNLS v3 Step 11 Cycle001 Recovery Epoch004では、
authority-specified test-runnerはlock-derived exact5、pytest versionは8.4.1です。

この値はcurrent checkpoint固有です。本書自体が全future taskのpytest versionを
8.4.1へ永久固定するものではありません。future checkpointは、その時点の
frozen lockと明示authorityによりexact version / projectionを固定します。

current旧session-local instanceは、既知prior runtime locatorとcurrent checkpointが
明示したlocator setで発見されていないため、current stateは
`RUNTIME_NOT_FOUND_AT_KNOWN_PRIOR_LOCATORS`です。このstateは当該探索scopeだけを
分類し、未探索locatorに同一instanceがないことまで断定しません。
これは過去readinessの否定ではなく、
current execution eligibilityがないことを意味します。

current target test、production、既存D1、published RED testは、このrule反映だけで
変更または実行しません。次のrematerializationは別のMash様承認を必要とし、
自動進行しません。

## 12. 2026-08-02 current application correction

§11は2026-08-01時点のhistorical application snapshotです。本書§0-10のnormative runtime
continuity contractは変更しません。その後の別authority lineageは進み、current technical
terminalは次です。

```text
RUNTIME_NOT_READY_STATIC_VERIFIER_LAUNCHER_EXACT_NODE_VERSION_SELECTION_OBSERVATION_INVALID_NO_DESIGN_VALID_EXACT_VERSION_STOP
```

catalogue observation V2はactivation binding invalidによりpre-network STOPしました。これは
旧runtime不在checkpointの再評価ではありません。current authorityでnetwork、Node/version
probe、engine、verifier/helper、Gate B runtime、pytest、target executionはexact0、Full R1は
`UNKNOWN_PRESERVED`です。

最新状態と次のdesign-only authorityは07 / tracked Planを正本とします。no retry、no fallback、
no historical recredit、Mash様へのruntime path / venv / pytest要求禁止は維持します。

## 13. 2026-08-05 current application pointer correction — exact47 incident remediation

- incident id: `NLSV3_STEP11_CYCLE001_20260804_EXACT47_CROSS_AUDIT`
- payload role: `STALE_TECHNICAL_SNAPSHOT_SUPERSESSION_POINTER_ONLY`; global remediation state is resolved only from canonical 07 and is not claimed by this file; closure state: `NOT_CLOSED`.
- §12 is retained byte-for-byte as the 2026-08-02 historical application snapshot. Its exact-Node catalogue observation V2 terminal and related current-state direction are `HISTORICAL_SUPERSEDED_NON_CURRENT`.
- §§0–10 and the front-matter status `CURRENT_NORMATIVE_CONTRACT` remain current for Work-local test-runner runtime continuity; this correction does not supersede or relax them.
- Resolve the current Step11 technical state only from the last complete EOF-side `CURRENT` H1 in `Cocolon_前提資料/07_latest_snapshot_diff.md`, then use the tracked Step11 ExecutionAndClosurePlan for detail.
- This is a pointer only: no terminal, authority token, Receipt identity, counter, or execution fact is duplicated, and this file is not a technical-current owner.
- technical activation / admission / consumption: `0 / 0 / 0`; V15 start authority: `0`.
- runtime / pytest / target / private analyzer / implementation / production / mashos-api effect: `0 / 0 / 0 / 0 / 0 / 0 / 0`.
- Only a later separately authorized additive marker, after immediate postwrite verification and a read-only re-audit, may state `REMEDIATION_CLOSED`.
