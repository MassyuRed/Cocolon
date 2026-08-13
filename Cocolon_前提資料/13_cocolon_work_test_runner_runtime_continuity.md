---
doc_id: cocolon_work_test_runner_runtime_continuity
title: "Cocolon Work test-runner runtime continuity contract"
revision_date: "2026-08-11"
status: "CURRENT_EFFECTIVE"
effective_boundary: "PHASE5_CHECKPOINT_B_ATOMIC_CURRENT_OWNER_CUTOVER_REMOTE_POSTVERIFIED"
effective_status_after_boundary: "CURRENT_NORMATIVE_CONTRACT"
current_g4b_method_effective_when: "G4B_GITHUB_TRACKED_RUNTIME_ADMISSION_CHECKER_V1_EXACT11_IMPLEMENTATION_REMOTE_POSTVERIFIED"
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

### 0.1 current effect boundary

Phase 5 Checkpoint Bのatomic current-owner cutoverはremote postverify済みです。
本2026-08-11 revisionは、G4 GitHub-tracked runtime admission checker V1のexact11
implementation reflectionを含むcommitがremote postverifyされた時点で
`CURRENT_NORMATIVE_CONTRACT`として有効になります。それ以前はremote predecessor
ruleが有効であり、local postimageをtechnical authorityまたは実行許可として
先行適用しません。

本revisionの反映authorityはtracked checker / test exact5の実装とCocolon exact6の同期だけです。
checker / test process、synthetic actual-call、runtime、pytest、network、wheel、fresh root、venv、
install、Gate B execution、Gate C以降を許可しません。

### 0.2 Cycle001 navigation owner separation

current effective boundary後、Cycle001のownerは次に分離します。

- `08_cycle001_current_state.md`: current Gate、blocker、next exact1を選ぶ唯一の
  current navigation owner。
- `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_CurrentClosureRoute.md`:
  remaining Gate sequence、entry / exit / STOP、retired routeのowner。
- `07_latest_snapshot_diff.md`: 節目履歴とevidence pointer。
- current same-name Execution and Closure Plan: historical evidence map。

本書はtest-runner runtime contractだけを所有します。`07`、Plan、historical
Handoff / Receiptの`next authority`からcurrent actionを選びません。

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

### 7.2 actual entrypoint / read path pre-freeze preflight

materializer、independent verifier、launcherをfreezeする前、かつacquisition、
materialization、readiness、target effectの前に、次をexactにpreflightします。

1. actual entrypoint owner identity、callable名、positional / keyword-only parameter、
   required / optional field、default shape、return shape、exact invocation formを
   actual implementationから導出し、call signatureとしてpre-freezeする。
2. helper / launcherをcompile・importし、freeze対象と同じactual entrypointを
   authority-local synthetic file exact1に対して実際にcallする。importだけ、
   symbol存在だけ、mock entrypointだけではpreflight PASSにしない。
3. synthetic fileはproduction inputと同じreader、同じcall chain、同じargument
   constructionで実読する。preflight専用のalternate readerやread shortcutで
   production read pathを代替しない。
4. synthetic fileについてraw bytes、byte count、SHA-256、strict UTF-8 decode、
   newline form / count、final LFを固定する。raw bytes identityとactual text readを
   別々に確認し、newline normalizationの有無と期待値を明示する。
5. `Path.read_text`または同等APIを使う場合、actual runtimeで受理される引数だけを
   call signatureへ固定する。unsupported `newline`等のargumentを渡さないことを
   actual callで確認する。
6. actual outputをfrozen schemaへvalidateする。required / optional key、type、enum、
   cardinality、ordering、empty / NOT_APPLICABLE表現、unknown-field policy、
   body-free boundaryを確認する。serialization成功だけではPASSにしない。

synthetic fileはprivate authority-local preflight materialであり、production fixture、
sample、protected test、acceptance denominatorへ加えません。synthetic bodyまたは
absolute locatorをGitHubへ記録しません。

一項目でも不成立ならhelper / launcherをfreezeせず、runtime / target effect 0のまま
`PREFREEZE_EXECUTABLE_PREFLIGHT_INVALID`としてSTOPします。

### 7.3 bounded mechanical repair

bounded mechanical repairは、closed authority内のretryではありません。prior failure
を閉じた後にMash様が明示承認した**new authority exact1**だけで使用できます。

対象reasonは次のexact4だけです。

```text
SYNTAX_ERROR
API_ARGUMENT_ERROR
SERIALIZATION_FORMAT_ERROR
COMMAND_CONSTRUCTION_ERROR
```

全条件:

- repair対象はhelperまたはlauncher exact1だけ。
- same Gate、same purpose、same contractのまま。
- product semantics、test意味、acceptance、production、protected test、fixture、sample、
  target、denominator、comparator、input identityを変更しない。
- dependency projection、network route / count、runtime roleを変更しない。
- source / test / fixture / sampleの変更や、別系列helper / scanner / carrierの追加で
  scopeを広げない。

new authorityが許可できるsequenceは次の一回だけです。

```text
mechanical repair exact1
-> repaired helper / launcher pre-freeze preflight
-> fully fresh root / wheel / helper
-> same Gate fresh rerun exact1
-> success or terminal STOP
```

prior root、wheel、helper、readiness、closed authorityを再利用しません。fresh rerunを
同authority retry、reactivation、credit inheritanceとして数えません。

repair後のfresh rerunが再び失敗した場合、reason familyを問わずsecond repair、
third launch、alternate helper、fallbackを0にし、次でSTOPします。

```text
DETOUR_RISK_STOP
NO_SECOND_REPAIR
CURRENT_AUTHORITY_STOP
```

### 7.4 retry / no-retry vocabulary

本書の`retry禁止`は、同じclosed / consumed authority、同じfailed instance、同じ
root / wheel / helper、fallback interpreterで再実行することを禁止します。

§7.3の`fresh rerun exact1`は、new authority、same Gate、mechanical repair exact1、
fully fresh root / wheel / helperという全条件を満たす場合だけの別operationです。
これはretry例外ではありません。

target launch requestをOSへ渡してauthorityがconsumedになった後のfailure、semantic
failure、test failure、identity / comparator / denominator conflict、dependency / network /
runtime-role changeはbounded mechanical repair対象外であり、従来どおりno retryです。

### 7.5 historical G4-B direct-native-process method

本sectionは、2026-08-11のprior G4-B
`G4_POST_G6_SHARED_STRUCTURAL_CORRECTION_GATE_B`に適用されたhistorical method overrideです。
このrouteはclosed / nonreusableであり、current methodは§7.6を正とします。
§§7.1〜7.4の一般contractとhistorical observationは保持しますが、current G4-Bでは
authority-local / session-local helper file・helper callable・helper Path API boundaryを
退役済みとし、helper修正、V3化、再利用へ戻りません。

```text
method id:
GATE_B_DIRECT_NATIVE_PROCESS_ROUTE_V1

retired:
authority-local helper file
session-local helper callable
helper Path API boundary
helper repair / V3 / reuse
additional scanner
additional carrier

future technical authority process cardinality:
direct native owner process exact1
direct native independent process exact1

persisted helper / scanner / carrier:
exact0 / exact0 / exact0
```

future technical authorityは、同じauthority本文でprocess body exact2をfreezeし、各bodyを
OS processとして直接起動します。入力はstrict UTF-8 JSON stdinだけとし、runtime-rootは
plain JSON string fieldで渡します。`Path` object、abstract `Path` class、helper callable、
command-line path coercionをprocess間contractにしません。

owner processは`importlib.metadata`側からidentityを導出します。independent processは
`dist-info / RECORD / actual filesystem`側から別手順で導出します。両processが共有して
よいものはfrozen comparator schemaだけです。owner / independent implementation、
coverage計算、filesystem traversal、intermediate stateを共有しません。

acquisition、materialization、readiness、pytest、role smoke、target effectの前に、freeze対象と
同じprocess body exact2をsynthetic mini-rootへstrict UTF-8 JSON stdinでactual-callします。
preflightとfuture runtime derivationは同じprocess body bytesを使用し、preflight専用body、
alternate reader、mock call、shared derivationへ差し替えません。synthetic mini-rootはprivate
authority-local materialであり、fixture、sample、corpus、protected test、acceptance denominatorへ
加えません。

owner / independentの各outputはfuture technical authorityがfreezeするstrict schemaへ個別に
validateします。required / optional field、type、enum、cardinality、ordering、empty /
`NOT_APPLICABLE`表現、unknown-field policy、body-free境界の一項目でも不成立ならPASSに
しません。serialization成功、process exit 0、owner-only resultをvalidityまたはreadinessへ
変換しません。

preflight不成立時はruntime / target effect 0のまま次でSTOPします。

```text
DIRECT_NATIVE_PROCESS_ROUTE_INVALID
HELPER_FALLBACK_0
ADDITIONAL_SCANNER_0
ADDITIONAL_CARRIER_0
PROCESS_BODY_REPAIR_0
SECOND_METHOD_REPAIR_0
THIRD_NORMAL_AUTHORITY_0
CURRENT_AUTHORITY_STOP
AUTOMATIC_PROGRESSION_FALSE
```

このmethod変更は次を変更しません。

```text
comparator:
NLS_V3_INSTALLED_FILE_MANIFEST_CANONICAL_V1
0eba095e4c173b4b69f68532fd66cf2c871ab9edef64d91754b52ed7daee15c5

frozen lock / authority-specified exact5 projection:
UNCHANGED / UNCHANGED

accepted wheel manifest / distribution closure / acceptance denominator:
UNCHANGED / UNCHANGED / UNCHANGED

configured network route and count / runtime role and required-role order:
UNCHANGED / UNCHANGED

runtime READY / readiness credit / Gate B:
false / 0 / NOT_CLOSED
```

このhistorical 2026-08-11 reflectionではprocess bodyの実装・freeze・実行を行いませんでした。direct native
owner / independent process actual-call、runtime、pytest、network、wheel取得、venv、install、
Gate B executionはすべて0です。future technical authorityは別のMash様明示承認を必要とし、
本sectionから自動進行しません。

### 7.6 current G4-B GitHub-tracked runtime admission checker method

Mash様の2026-08-11 explicit approvalにより、current G4-Bのmethodを次へ置換します。

```text
method id:
GATE_B_GITHUB_TRACKED_RUNTIME_ADMISSION_CHECKER_V1

tracked checker family:
exact1

logical responsibility / file:
exact5 / exact5

owner / independent execution design:
separate file / separate OS process / separate derivation

legacy helper / additional scanner / additional carrier:
exact0 / exact0 / exact0
```

V1のtracked filesは次のexact5です。

```text
ai/tools/emlis_nls_v3_s11_g4b_runtime_admission_contract_v1.py
ai/tools/emlis_nls_v3_s11_g4b_runtime_admission_checker_v1.py
ai/tools/emlis_nls_v3_s11_g4b_runtime_admission_owner_v1.py
ai/tools/emlis_nls_v3_s11_g4b_runtime_admission_independent_v1.py
ai/tests/test_emlis_nls_v3_s11_g4b_runtime_admission_checker_v1.py
```

existing materialization procedure exact2のV1 input identifierは、順序を含めて次へ固定します。

```text
COCOLON_RULE13_RUNTIME_CONTINUITY_V20260811
COCOLON_RULE16_ONE_SHOT_PRELAUNCH_V20260811
```

このidentifierは手順本体の代替ではなく、このRule 13とcurrent Rule 16に従って外部で
materializationしたfresh instanceのprovenanceをchecker inputへ束縛するlabelです。

contractはstrict UTF-8 JSON、unknown-field rejection、fixed check order、canonical
serialization、versioned request / owner result / independent result / public result /
private handoff schemaを所有します。V1のfield意味とcheck順序は変更せず、V2はPro華恋と
Ultra華恋の相互確認、変更理由、Mash様の別承認がある場合だけ追加します。

orchestratorは、external existing procedureでfresh materialization済みのinstanceと
body-free materialization evidenceだけを入力にします。acquisition、materialization、
install、download、venv作成をcheckerへ再実装しません。ownerは`importlib.metadata`起点の
distribution-first record claim、independentは`dist-info / RECORD / actual filesystem`起点の
filesystem-first reverse ownershipから導出します。両者は別file・別OS process・別PID・
別call graphとし、導出関数、filesystem traversal、coverage計算、intermediate stateを
共有しません。共有可能なのはimmutable contract / schemaと同一raw inputだけです。

freshnessのhistorical nonexistence / materialization completionはexisting procedure exact2が
観測するexternal trust boundaryです。private requestはroot locator SHA-256とexpected
full-root manifest SHA-256を持ち、materialization event IDはauthority、observation session、
ordered procedure exact2、fresh true、prior reuse 0、root locator、expected full-root、fixed
site / executable relative locatorのversioned canonical preimageからcheckerが再導出します。
checkerはこのattestationを受理したうえでactual full-rootをorchestrator / owner / independentの
別実装から導出し、expectedを含む4者のexact matchとpre/post不変を要求します。checker単独が
materialization前のroot不存在を再観測した、または過去artifact不存在を証明したとはclaimしません。

`INPUT_SCHEMA_AND_HEAD_BINDING`はrequest内の40-hex label確認ではありません。actual checkoutの
HEAD commitをGit metadataから、treeをtracked indexとactual tracked bytesからstdlibだけで
read-only再導出し、request frozen commit / treeへexact matchさせます。Git subprocess、network、
write、unsupported Git formへのfallbackは0で、解決不能または不一致はfail-closed STOPです。
formal lock tracked JSONのactual raw SHA-256もpre / smoke後 / post bindingでfrozen identityへ照合します。
required-role smokeはPython audit hookでfilesystem write / process launch / networkをdenyし、
required source exact3のpre/post identityも一致した場合だけeffect 0をclaimします。

admission creditを発行できるsurfaceはtracked bytesのunmodified CLI exact1だけです。
library call、injected runner、monkeypatch、fake completed processはnon-admissibleです。CLIは
actual Popen child PIDを取得してchild result PIDへ照合し、owner / pytest / smoke / independentの
ordered stage ledger exact4からprocess countと順序を導出します。hardcoded countまたはchildの
自己申告だけから別process成立をclaimしません。

official parent argvはrepository rootをcwdとする
`python -E -s -S -B -m ai.tools.emlis_nls_v3_s11_g4b_runtime_admission_checker_v1`です。
checkerはignore-environment / no-user-site / no-site / dont-write-bytecode flags、module spec、cwdを
開始時に再確認します。この形以外のscript / import / library invocationはcredit 0です。

Git object readerはloose commitまたはnon-delta packed commitをstdlibで検証します。delta packed
HEAD、unsupported index / Git object form、commit-tree結合を証明できない状態ではfallback、git
subprocess、repackを行わず`BASE_OR_PREIMAGE_DRIFT`でSTOPします。

check orderは次のexact9です。

```text
INPUT_SCHEMA_AND_HEAD_BINDING
FRESH_MATERIALIZATION_EVIDENCE
PRE_ROOT_AND_FROZEN_IDENTITIES
OWNER_DERIVATION
PYTEST_VERSION_PROBE
REQUIRED_ROLE_SMOKE
INDEPENDENT_DERIVATION
RECONCILIATION_AND_POST_ROOT
SAME_INSTANCE_HANDOFF_BINDING
```

checkerは全modeでtarget filesystemへwriteしません。repair、retry、fallback、alternate
interpreter、external service、daemon、CI control plane、DB、API、新transport、stdlib外
dependency、production EmlisAI import、100件runner、sample / fixture / corpusの変更または
100件生成・実行・評価は0です。

same-instance claimはcurrent sessionのprivate locator、materialization event、root / executable /
control identity、pre/post full-root identityを結んだ`HANDOFF_BOUND_CURRENT_SESSION`までです。
future Gate Cがexact admitted executableとidentityを直前再導出して実launchした場合だけ
`HANDOFF_CONSUMED`をclaimできます。checker成功だけでfuture consumptionをclaimしません。
private locatorを保持するcurrent-session callerがbindingの受領境界です。public resultはlocatorを
返さずbinding digestだけを返すため、receiver processによるfuture consumption事実は証明しません。
binding preimageはabsolute root / executableのlocator SHA-256を含み、current-session callerは
保持中のprivate requestからbindingを再計算できます。locator digest単体もpublicへ出しません。

このimplementation reflectionではtracked exact5の実装とCocolon exact6の同期だけを行います。
checker process、dedicated test process、synthetic actual-call、network、runtime、wheel取得、
materialization、pytest probe、role smoke、target、100件、Gate B executionは0です。したがって
Runtime READYはfalse、readiness observation IDは`NOT_DERIVED`、Gate Bはopen、readiness /
technical / product creditは0で、future verification / fresh admissionはMash様の別承認を
必要とし、Gate C以降へ自動進行しません。

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

上記effective boundary成立後の最新状態は`08_cycle001_current_state.md`、remaining routeは
Current Closure Routeを正本とします。`07` / tracked Planはevidence / historical ownerです。
no retry、no fallback、
no historical recredit、Mash様へのruntime path / venv / pytest要求禁止は維持します。

## 13. 2026-08-05 current application pointer correction — exact47 incident remediation

- incident id: `NLSV3_STEP11_CYCLE001_20260804_EXACT47_CROSS_AUDIT`
- payload role: `STALE_TECHNICAL_SNAPSHOT_SUPERSESSION_POINTER_ONLY`; the exact47 administrative remediation / closure history is resolved from `07` as milestone evidence and is not claimed by this file. That historical owner does not select the current Gate or next action; closure state at this 2026-08-05 checkpoint: `NOT_CLOSED`.
- §12 remains the 2026-08-02 historical application snapshot except for its closing current-navigation pointer, which this Phase 4 postimage corrects to `08` / Current Closure Route. Its exact-Node catalogue observation V2 terminal and prior current-state direction are `HISTORICAL_SUPERSEDED_NON_CURRENT`.
- §§0–10 remain the Work-local test-runner runtime continuity contract; after the stated effective boundary, the front-matter `effective_status_after_boundary: CURRENT_NORMATIVE_CONTRACT` applies. This correction does not supersede or relax them.
- After the stated effective boundary, resolve the current Step11 position only from `Cocolon_前提資料/08_cycle001_current_state.md`, then use the Current Closure Route for remaining Gate detail. `07` and the tracked Step11 ExecutionAndClosurePlan are milestone / historical evidence only.
- This is a pointer only: no terminal, authority token, Receipt identity, counter, or execution fact is duplicated, and this file is not a technical-current owner.
- technical activation / admission / consumption: `0 / 0 / 0`; V15 start authority: `0`.
- runtime / pytest / target / private analyzer / implementation / production / mashos-api effect: `0 / 0 / 0 / 0 / 0 / 0 / 0`.
- Only a later separately authorized additive marker, after immediate postwrite verification and a read-only re-audit, may state `REMEDIATION_CLOSED`.

## 14. Phase 4 current-owner and mechanical-preflight cutover history

Phase 5 Checkpoint B remote postverifyにより、§13のcurrent-navigation pointerと
front-matter statusに関する旧記述はsuperseded済みです。§13のincident事実と§§0〜10の
historical observationsは書き換えません。current G4-B methodは§7.6を正とします。

effective boundary後のroutingは次です。

```text
current position / blocker / next exact1:
  Cocolon_前提資料/08_cycle001_current_state.md

remaining Gate sequence / entry / exit / STOP / retired route:
  EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_CurrentClosureRoute.md

milestone / evidence history:
  Cocolon_前提資料/07_latest_snapshot_diff.md

historical evidence map:
  EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md
```

actual entrypoint signature、production-same read path synthetic execution、UTF-8 /
newline / bytes、output schemaのpre-freeze proofがないhelper / launcherを一般contractで
freezeしません。current G4-Bには§7.6のGitHub-tracked admission checker contractを適用し、
§7.3のhelper repair、closed §7.5 route、second method repairへ戻りません。

```text
CURRENT_EFFECTIVE
PHASE5_CHECKPOINT_B_ATOMIC_CURRENT_OWNER_CUTOVER_REMOTE_POSTVERIFIED
CURRENT_G4_B_METHOD_GATE_B_DIRECT_NATIVE_PROCESS_ROUTE_V1
TECHNICAL_EXECUTION_0
METHOD_REFLECTION_GITHUB_PUBLICATION_REMOTE_POSTVERIFIED
AUTOMATIC_PROGRESSION_FALSE
```

### 7.7 Current G4-B preparation ingress — V7 remote-postverified exact3

Current G4-B preparation ingress is controller-family V1 with platform-opened exec-time inherited read-only FD mapping, followed by tracked checker V1. Existing procedure identifiers and sections remain intact. This file remains a runtime-continuity contract, not the current navigation owner.

```text
CURRENT_PRECEDENCE_EFFECTIVE_DATE = 2026-08-12
CURRENT_NAVIGATION_OWNER = Cocolon_前提資料/08_cycle001_current_state.md
CURRENT_SELECTED_METHOD = GATE_B_RUNTIME_PREPARATION_CONTROLLER_FAMILY_V1_USING_PLATFORM_OPENED_EXEC_TIME_INHERITED_READ_ONLY_FD_MAPPING_V1_THEN_GITHUB_TRACKED_RUNTIME_ADMISSION_CHECKER_V1
FUNCTIONAL_PREPARATION_STATE = CONTROLLER_FAMILY_V1_FUNCTIONAL_EXACT7_WITH_PLATFORM_OPENED_EXEC_TIME_INHERITED_READ_ONLY_FD_MAPPING_V1_IMPLEMENTED_VERIFIED_REMOTE_POSTVERIFIED
LIVE_RUNTIME_EXECUTION_STATE = UNEXECUTED
CURRENT_BLOCKER = PLATFORM_EXEC_TIME_FD_MAPPING_SURFACE_AND_ALL_OTHER_ONE_SHOT_LIVE_PRECONDITIONS_NOT_FRESHLY_ESTABLISHED
CURRENT_AUTHORITY = NONE
LATER_LIVE_AUTHORITY = NOT_AUTHORED_NOT_APPROVED
NEXT_EXACT1 = NLS_V3_STEP11_CYCLE001_G4_GATE_B_PLATFORM_EXEC_TIME_FD_MAPPING_SURFACE_AND_ONE_SHOT_LIVE_NETWORK_RUNTIME_READINESS_ADMISSION_CANDIDATE
NEXT_CANDIDATE_CLASS = TECHNICAL_AUTHORITY_CANDIDATE
NEXT_CANDIDATE_SCOPE = LEVEL_3_MASH_DECISION_AND_APPROVAL_REQUIRED_SCOPE
NEXT_CANDIDATE_STATE = DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED
RUNTIME_READY = FALSE
READINESS_OBSERVATION_ID = NOT_DERIVED
GATE_B = OPEN
READINESS_GATE_B_TECHNICAL_PRODUCT_CREDIT = 0 / 0 / 0
GATE_C = NOT_AUTHORIZED
AUTOMATIC_PROGRESSION = FALSE
```

V7の`TECHNICAL_CREDIT`はconsumer-side source / contract / portable test / actual-DACの再利用可能な補正証拠だけを指します。Gate-B admissionのtechnical creditではなく、上記のGate creditは`0 / 0 / 0`のままです。

Evidence:
- mashos-api final head / tree: `99afecb1a30880bf42b9fde4932e5bba7e01e7d4` / `6f92113264ffef515bd2feba3c7e8ba82d0c0188`
- qualified-runner Actions run / job: `31608210201` / `94152538969`
- V7 Decision: `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4B_QualifiedRunnerV6PostimageVerificationAndPublicationV7_Decision_20260812.md`
- V7 Receipt: `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4B_QualifiedRunnerV6PostimageVerificationAndPublicationV7_BodyFree_Receipt_20260812.json`

### 7.8 Current G4-B minimal preflight precedence — 2026-08-13

Mash様のcurrent explicit instructionにより§7.7のcurrent ingress routeを置換します。
既存checker / controller / FD codeは削除・変更せず、追加開発を停止します。prior G4-Bは
`DETOUR_RISK_STOP`、current G4-B completionはexact100 runnerへ到達するための一回限り
minimum preflightです。

```text
CHECK_SCOPE = COMMIT / PYTHON_DEPENDENCY / RUNNER_LAUNCH / PRIVATE_BODY_PROTECTION / RESULT_SAVING
RESULT = PASS
PYTHON = 3.12.13
PYTEST = 8.4.1
NEW_CHECKER_CONTROLLER_FD = 0
NEXT = G4_C_WITHOUT_NEW_SAFETY_DEVICE
```

このprecedenceは一般runtime continuity contractを削除せず、current operationだけの
proportionality correctionです。G8 body-full resultはrepository外0600、public evidenceは
body-freeです。
