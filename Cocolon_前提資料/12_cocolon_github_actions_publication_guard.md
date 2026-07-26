---
doc_id: cocolon_github_actions_publication_guard
title: "Cocolon GitHub Actions formal publication guardian owner"
revision_date: "2026-07-26"
repository_scope: "MassyuRed/Cocolon"
repository_id: 1163713768
secret_material_allowed: false
---

# 目的

この資料は、Cocolonの正式成果物をGitHubへ反映する前に、

> GitHub上の保存先が華恋の確認した状態のままなら一度だけ保存し、
> 少しでも変わっていれば何も保存せず停止する

という安全条件を、GitHub Actions内で再現する番人のownerです。

番人の目的は、Workの一時領域にSSH秘密鍵を置き続けなくても同じ安全確認を
行えるようにすることです。安全条件を弱めること、GitHub ActionsへCocolonの
作業判断を委ねること、Step 11を自動進行させることではありません。

# 承認済み設計

```text
artifact:
Cocolon_GitHub_Actions_Publication_Guardian_Design_ReadOnly_20260725.md

UTF-8 bytes SHA-256:
799f0faeeef316bb456fb6b90f694e57f48c4fc49aa38d4fc41abf9e77f30f35
```

このownerは上記設計のbootstrap実装を固定します。設計だけで未確定だった
request hash、files hash、trusted workflow SHA、sandbox / reconcile入力は、
下記の実装契約で具体化します。

# 実ファイルと責任

| path | 責任 |
|---|---|
| `.github/workflows/cocolon_formal_publication_guard.yml` | default branch上のtrusted codeだけを起動し、job権限とproduction / sandbox到達可否を分離する |
| `.github/cocolon_formal_publication_guard/guardian.py` | event、actor、依頼票、Git object、direct child、exact lease、postverification、reconcile、receiptをfail-closedで処理する |
| `.github/cocolon_formal_publication_guard/policy_v1.json` | repository identity、actor allowlist、branch namespace、locked path、上限、現在modeを固定する |
| `.github/cocolon_formal_publication_guard/request_v1.schema.json` | production / sandbox依頼票の公開schemaを固定する |
| `.github/cocolon_formal_publication_guard/test_guardian.py` | strict parser、path、hash、actor、write gate、Git objectのlocal regressionを固定する |
| `Cocolon_前提資料/12_cocolon_github_actions_publication_guard.md` | 番人の状態、意味、停止条件、移行境界の正本 |

schemaは人とtoolへ依頼票形式を示すmirrorです。security判定の実行正本は
Python標準libraryだけで実装した`guardian.py`のexact validatorです。

# 初回bootstrap状態

このownerを含むbootstrap revisionがCocolon `main`へexact expected-old-SHA
leaseで反映され、post-fetchでexact paths / bytesを確認した後の状態は次です。

```text
guardian files on main:
PRESENT_AND_POSTVERIFIED

mode:
OBSERVE_ONLY

production_main_enabled:
false

sandbox_write_enabled:
false

workflow publish-main job:
STATICALLY_DISABLED

workflow publish-sandbox job:
STATICALLY_DISABLED

actor identity:
UNOBSERVED

local security tests:
51 PASSED

GitHub sandbox tests:
0 / 5 NOT_RUN

production canary:
NOT_RUN

guardian active publication route:
false

current formal publication route:
SSH_EXACT_LEASE_ACTIVE_BOOTSTRAP_MAINTENANCE_AND_FALLBACK

Step 11 D1:
NOT_STARTED

automatic progression:
false
```

policyのfalseだけでなく、書込み権限を持つ二つのjobも`if: ${{ false }}`で
静的に停止します。初回Issueはactor identityの観測と固定receipt記録だけを
行い、`main`、sandbox、stagingのいずれも更新できません。

# trusted入口

入口は次のtitle prefixを持つ新規Issueです。

```text
COCOLON_FORMAL_PUBLICATION_REQUEST_V1 <request_id>
```

GitHubの`issues: opened` eventがdefault branch上のworkflowを起動します。
checkout対象はeventの`github.sha`へ固定し、full commit SHAへpinした
`actions/checkout`だけを使います。

Issue title、body、sender、branch名、commit messageを含むevent値は全て不信入力です。
Issue本文をshellへ展開せず、`GITHUB_EVENT_PATH`をdataとして読みます。

初回のactor observationでは次だけをbody-free receiptへ記録します。

- senderの数値ID、login、type。
- Issue creatorの数値ID、login、type。
- workflow run identity。
- `OBSERVE_ONLY_ACTOR_CAPTURE`。

actor allowlistが空の間、Issue本文はpublication requestとして解析せず、
保存処理へ進みません。観測したidentityを華恋がconnector上のIssue / runと
独立照合し、Replacement 02 maintenance authorityでallowlistへ固定するまで
sandboxも有効化しません。

# 依頼票とcanonical化

Issue bodyはexactly次の二行と末尾LFです。

```text
COCOLON_FORMAL_PUBLICATION_REQUEST_V1
<canonical one-line JSON>
```

canonical JSON:

- UTF-8。
- BOM / CRLF / 空行 / 追加行なし。
- keyをUnicode code point順にsort。
- separatorは`,`と`:`、余分な空白なし。
- JSON一行と末尾LF。
- duplicate key、unknown field、missing field、型違いを全階層で拒否。
- float、指数値、NaN、Infinity、bool-as-int、範囲外integerを拒否。
- 全stringはNFC exact。lone surrogateを拒否。
- `files`はUTF-8 path byte順。

hash:

```text
files_sha256 =
SHA256(canonical_json(files) + LF)

request_sha256 =
SHA256(
  ASCII "cocolon.formal_publication.request.v1" + NUL
  + canonical_json(requestからrequest_sha256 fieldだけを除いたobject)
  + LF
)
```

requestは`workflow_sha1`を持ちます。これは依頼を処理するtrusted default-branch
revisionへbindします。production requestでは
`expected_old_sha1 == workflow_sha1`も要求します。

`request_mode`:

- `publish`: 全検査後に一回だけwrite permitを作れる。
- `reconcile`: remote状態を確認するだけで、write permitを作れない。

# actor契約

publication requestではevent senderとIssue creatorが同一の
`id / login / type` tripleであり、policyのexact allowlistに存在することを
要求します。loginだけ、表示名だけ、推測したIDでは許可しません。

repositoryも次へ固定します。

```text
repository:
MassyuRed/Cocolon

repository ID:
1163713768
```

# candidate非実行とGit object検査

candidateは同repository内の次のrefだけです。

```text
refs/heads/guardian/staging/<request_id>
```

番人はcandidate branchをworking treeとしてcheckoutせず、candidate側code、
dependency、workflow、scriptを実行しません。trusted `main`の
`guardian.py`とGit object読取だけを使います。

検査:

- staging ref headが依頼票のexact SHAと一致。
- `H0`からstaging headまで一本道。
- merge commitなし、parent gapなし、最大64 commits。
- 全intermediate commitのpathを検査。
- final diff path setがmanifestとexact一致。
- add / modifyだけ。delete / rename / copyは禁止。
- symlink、submodule、unknown mode、新規executable、mode変更を拒否。
- old / new mode、old / new blob SHA-1を照合。
- blob raw bytesのsize、SHA-256、Git blob SHA-1を独立照合。
- manifest外pathとmanifest記載漏れを拒否。
- path traversal、absolute path、backslash、control characterを拒否。
- duplicate、casefold、NFC、file/directory collisionを拒否。

常時locked:

```text
.github/**
.gitmodules
Cocolon_前提資料/12_cocolon_github_actions_publication_guard.md
```

policyはlockを追加できますが、built-in lockを解除できません。番人自身、
workflow、policy、schema、test、ownerの変更は通常番人では行わず、
Replacement 02 exact lease maintenance authorityへ戻します。

# direct child

検査済みstaging final treeから、targetのexpected old `H0`を唯一のparentとする
direct child `C1`を再構築します。

固定値:

- tree = staging final tree。
- parent exact1 = `H0`。
- author / committer nameとemail = policy。
- timestamp = requestのUTC秒、timezone `+0000`。
- subject = 一行、control characterなし、最大120文字。
- body = request ID、authority SHA-256、files SHA-256、request SHA-256。
- message末尾LF。
- GPG署名なし。

commit object bytesをPythonで組み、SHA-1を独立計算した後、
Gitが保存したobject ID / bytesとexact一致することを確認します。

# targetとwrite gate

production:

```text
target:
refs/heads/main

必要条件:
policy mode == PRODUCTION_ACTIVE
production_main_enabled is true
workflow publish-main job enabled by reviewed maintenance revision
```

sandbox:

```text
target:
refs/heads/guardian/sandbox/<suite_id>/<case_id>

changed path:
Cocolon_前提資料/github_actions_guardian_sandbox/** only

必要条件:
policy mode == OBSERVE_AND_SANDBOX_ONLY
sandbox_write_enabled is true
workflow publish-sandbox job enabled by reviewed maintenance revision
```

bootstrapでは両方を満たさないため、write permitを生成できません。
productionにsandbox fault fieldがあればschema / codeで拒否します。

# 保存、postverification、結果不明

保存直前にremote targetを取得します。

| remote | 処理 |
|---|---|
| `target == H0` | enabledなpublish requestだけexact leaseを一回試行 |
| `target == C1` | 再保存せずpostverification |
| その他 | `REJECTED_HEAD_DRIFT`で保存せず停止 |
| 取得不能 | `RESULT_UNKNOWN_STOP` |

許可するwriteは一refだけです。

```text
git push origin \
  --force-with-lease=<target_ref>:<H0> \
  <C1>:<target_ref>
```

`--force`、expected old省略、remote-tracking ref任せ、複数ref、delete、tag、
retry loopは禁止です。push直前にもmode / target / boolean flagを独立再確認します。

push exit codeだけで成功にしません。remote head、parent exact1、tree、
changed path set、mode、blob SHA-1、raw SHA-256、sizeを再取得し、
全て一致した場合だけ`APPLIED_AND_POSTVERIFIED`です。

push後のrunner停止・通信断では自動再pushしません。新しいreconcile requestで
remoteを先に読みます。

| remote | reconcile outcome |
|---|---|
| `target == C1`かつ全bytes一致 | `APPLIED_CONFIRMED_AFTER_AMBIGUOUS_RESULT` |
| `target == H0` | `NOT_APPLIED_CONFIRMED_STOP` |
| その他 | `DRIFT_AFTER_ATTEMPT_STOP` |
| 取得不能 | `RESULT_UNKNOWN_STOP` |

`RESULT_UNKNOWN_STOP`のIssueは自動closeしません。

# job権限

workflow全体は`permissions: {}`です。

| job | 権限 |
|---|---|
| `preflight` | `contents: read` |
| `publish-sandbox` | `contents: write`。bootstrapでは静的disabled |
| `publish-main` | `contents: write`。bootstrapでは静的disabled |
| `report` | `contents: read`, `issues: write` |

job間のworkspaceは信用・共有しません。write jobは全検査を独立再実行します。
reportもremote-firstで再評価し、不信Issue本文をreceiptへ転載しません。

publish jobは、trusted codeが確定したoutcome、request SHA-256、candidate SHA-1、
write attempted、postverifiedだけをjob outputとしてreportへ渡します。reportは
先にremoteと全bytesを独立再検査し、request / candidate identityがexact一致した
場合だけ、正常保存`APPLIED_AND_POSTVERIFIED`、重複
`ALREADY_APPLIED_POSTVERIFIED`、head競合`REJECTED_HEAD_DRIFT`の元outcomeを
保持します。output欠落・identity不一致・途中停止では推測せず、
`APPLIED_CONFIRMED_AFTER_AMBIGUOUS_RESULT`等のreconcile outcomeを使います。

# 5種類のGitHub sandbox試験

local test成功を次のGitHub実動試験へ昇格しません。actor allowlistとsandboxだけを
有効化したmaintenance revisionの後、次を全て行います。

1. 正常保存: exact lease、direct child、one text path、postverification。
2. head競合: 保存直前にsandbox targetを進め、古い期待値のwriteを拒否。
3. 改変拒否: manifest外path、hash不一致、staging移動、merge、symlink、
   `.github/**`、unsafe path、同一request ID別manifestを拒否。
4. 重複・同時: 同一requestの二回目は再保存せず、同じH0の競合は一方だけ成功。
5. 保存直後停止: lease成功直後に停止し、別reconcileが再pushせず回収。

全suite前後でCocolon `main`が同じSHAであることを、Actions側GitとGitHub
connectorの二経路で確認します。

# activationとcanary

5試験が全件成功し、華恋がrun、Issue receipt、sandbox ref、main不変を
独立確認するまでproductionを有効化しません。

production activationはReplacement 02の別maintenance commitで、
policyとworkflowの二重停止を同時にreviewして解除します。

activation後の最初のmain保存は通常成果物ではなく、設計指定のnon-executable
two-path canaryです。canaryもexact leaseとfull postverificationが完了するまで
Actions routeをactive扱いしません。

# SSH routeとReplacement 02

bootstrap、actor allowlist maintenance、sandbox有効化、番人修正、production
activation、canary失敗時のforward disable / fix、active owner finalizationは、
`11_cocolon_github_transport_and_session_continuity.md`のReplacement 02 exact
lease routeを使います。

Actions routeがpostverified activeになる前にSSH routeを通常運用から外しません。
canary成功後も、cleanupはMash様の別承認を得てから行います。

# Cocolon作業との境界

このbootstrapはGitHub transport整備だけです。

実行・変更していないもの:

- `NLS_V3_STEP11...RED_FREEZE_ONLY`。
- D1 RED / D2 implementation。
- mashos-api source / test。
- event1 / readiness / reservation / formal attempt。
- exact134 / P2 / Product Read / correction / acceptance。

番人の設置、sandbox成功、activation、canary成功のいずれも、
これらの開始許可へ自動変換しません。

# STOP

次の一つでも該当すれば保存せず停止します。

- actor未観測、不一致、allowlist外。
- trusted workflow SHA不一致。
- repository ID / name不一致。
- noncanonical request、hash不一致、期限切れ。
- staging ref移動、lineage違反、manifest違反、locked path。
- target drift、lease拒否、remote取得不能。
- policy / workflowのrequired gateがdisabled。
- push結果またはpostverificationが不明。
- Actions権限、ruleset、runner挙動が試験で未確認。

安全条件を弱めて通しません。必要なGitHub画面設定が一つに特定できた場合だけ、
Mash様へ目的、必要性、操作、完了条件を平易に説明して依頼します。

# 2026-07-25 bootstrap反映・actor実測・sandbox試験開始状態

## 確認した事実

- disabled bootstrapは、`main`
  `bbe13d85923f8dc197bc8b19e3a1fe1eace77f21`をexpected oldとして、
  direct child `208f2b278baf81f558fa67ec84892542177a8886`へ一回のexact
  leaseで反映された。
- bootstrap treeは`5c2c6fadd713937338f70c8096558315d9412c6c`で、parent
  exact1、exact 12 changed paths、全対象bytes、full fetch、
  `git fsck --full --strict`をpost-fetchで確認した。
- observe-only Issue
  `https://github.com/MassyuRed/Cocolon/issues/2`に対するActions run
  `30159464499`は、workflow SHA
  `208f2b278baf81f558fa67ec84892542177a8886`から実行された。
- event senderとIssue creatorは共に
  `id=175191163 / login=MassyuRed / type=User`だった。
- receipt outcomeは`OBSERVE_ONLY_ACTOR_CAPTURE`、`write_attempted=false`、
  `postverified=false`だった。IssueはActionsによりcloseされた。
- observe-only実行後も`main`は
  `208f2b278baf81f558fa67ec84892542177a8886`のままだった。

## sandbox試験開始maintenance

上記actor三要素をexact allowlistへ固定し、検証用refだけを書き込める状態へ進める。
本節を含むmaintenance revisionのexpected oldは
`208f2b278baf81f558fa67ec84892542177a8886`で、変更を次の8 pathsへ限定する。

```text
.github/workflows/cocolon_formal_publication_guard.yml
.github/cocolon_formal_publication_guard/guardian.py
.github/cocolon_formal_publication_guard/policy_v1.json
.github/cocolon_formal_publication_guard/test_guardian.py
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md
Cocolon_前提資料/12_cocolon_github_actions_publication_guard.md
Cocolon_前提資料/manifest.json
```

反映後の固定状態:

```text
guardian state:
SANDBOX_TESTING_ENABLED_PRODUCTION_DISABLED

actor allowlist:
175191163 / MassyuRed / User

policy mode:
OBSERVE_AND_SANDBOX_ONLY

production_main_enabled:
false

sandbox_write_enabled:
true

sandbox_fault_injection_enabled:
true

workflow publish-main:
STATICALLY_DISABLED

workflow publish-sandbox:
trusted preflightがsandbox requestをPREFLIGHT_PASSEDとした場合だけ実行

local guardian tests:
54 PASSED

GitHub sandbox tests:
0 / 5 NOT_RUN

production canary:
NOT_RUN

Actions guardian active for main:
false

current formal main publication route:
REPLACEMENT_02_SSH_EXACT_LEASE_ACTIVE
```

fault injectionはsandbox test requestだけに許可し、production requestでは引き続き
拒否する。`publish-main`の静的停止は5試験と独立確認が全て終わるまで解除しない。

重複またはhead競合をpreflightで確定した場合、publish jobは起動しない。
preflight / publishのtyped resultはjob成功、request SHA-256、candidate SHA-1、
write attempted、postverifiedを固定してreportへ渡す。reportはremote-firstで
全bytesを再検査し、exact identityが一致した時だけ
`ALREADY_APPLIED_POSTVERIFIED`または`REJECTED_HEAD_DRIFT`を保持する。
job失敗、output欠落、identity不一致ではtyped resultを信用せず、
conservative reconcile outcomeを維持する。

## 未確認

- GitHub Actionsのsandbox `contents: write`とrepository rulesetの実動適合。
- 正常、head競合、改変拒否、重複・同時、保存直後停止の5試験。
- 5試験中の各Issue receipt、run、target ref、main不変。
- production activation、production canary、Actions main routeのactive化。

未確認事項を成功扱いしない。5試験開始時点では0/5であり、
このmaintenance自体をproduction許可やStep 11開始許可へ変換しない。

# 2026-07-25 sandbox試験前request ID / manifest binding閉鎖

## 確認した設計差

sandbox実動Issueを作る直前の再監査で、同じ`request_id`に対して
manifest、hash、staging ref / headを全て整合させて差し替えた場合、
従来contractではrequest ID再利用だけを理由に拒否できないことを確認した。

これは設計Test 3 subcase 8
「同じrequest IDで別manifestを拒否」を完全には満たさない。
GitHub sandbox Issueはまだ作成しておらず、Actions guardianによるsandbox writeは
0件、5試験は`0 / 5 NOT_RUN`のまま停止した。

## 閉鎖contract

request IDを次のdeterministic bindingへ変更する。

```text
binding:
{
  "expected_old_sha1": <exact target old>,
  "files_sha256": <exact manifest hash>,
  "target_ref": <exact target ref>
}

request_id:
g1-<SHA-256(
  "cocolon.formal_publication.request-id.v1" + NUL
  + canonical_json(binding) + LF
)>
```

`request_id`は常に`g1-`とlowercase hex 64文字で構成する。
target、expected old、manifestの一つでも変わればbound IDも変わる。
依頼票のIDが再計算値とexact一致しなければ
`REJECTED_REQUEST_ID_BINDING`で、candidate inspectionとwrite permitより前に拒否する。

同じtarget、expected old、manifestを持つexact同一requestの二回目は同じIDとなり、
従来どおりremote-first postverification後に
`ALREADY_APPLIED_POSTVERIFIED`として扱える。

## Replacement 02 maintenance

expected old:

```text
a5fb4fd9467e23f7fc6420260f6a96e2d0513a65
```

exact changed paths:

```text
.github/cocolon_formal_publication_guard/guardian.py
.github/cocolon_formal_publication_guard/request_v1.schema.json
.github/cocolon_formal_publication_guard/test_guardian.py
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md
Cocolon_前提資料/12_cocolon_github_actions_publication_guard.md
Cocolon_前提資料/manifest.json
```

local guardian testsは56件成功した。production policyはfalse、
`publish-main`は静的disabledのまま変更しない。

事前準備として、正常caseのsandbox target refを上記expected oldへ、
staging refをそのdirect child fixtureへ新規作成したが、Issueは作成していない。
既存target refは再確認後に利用できる。一方、既存staging ref名は旧opaque IDであり、
新しい`g1-<64 hex>` contractでは受付不能なので試験には利用しない。
request ID binding revision反映後、最終workflow SHAで依頼票を再生成し、
計算された新IDとexact一致する新しいstaging refを作成してから試験する。
この準備refを試験成功やguardian writeへ数えない。

# 2026-07-25 sandbox試験前receipt観測完全性閉鎖

## request ID binding revisionの反映

次のformal publishとpost-fetchを確認した。

```text
expected old:
a5fb4fd9467e23f7fc6420260f6a96e2d0513a65

published direct child:
c333b0c032b20a1ecbde2426de9894b57d6be70a

tree:
ccf7e97445347fe0fa8f38816d7b09bfb077d833

changed paths:
exactly 7
```

新しい`g1-<64 hex>`正常case staging refは準備済みだが、
Issue作成とguardian sandbox writeは0件、5試験は`0 / 5 NOT_RUN`である。

## 確認したreceipt差

承認済み設計17節はfinal Issue receiptにtargetの
`observed before / after`を要求する。
しかしrequest ID binding revisionのworkflowでは、preflight / publish jobから
reportへ渡す固定outputがoutcome、request SHA-256、candidate SHA-1、
write attempted、postverifiedだけで、保存時の観測pairを保持できなかった。

また設計20節はsuite前後のproduction main不変を
Actions側GitとGitHub connectorの二経路で確認するが、report完了時に
Actions側Gitが`refs/heads/main`を取得してreceiptへ固定する経路がなかった。

この二点をGitHub Issue実動前のBLOCKERとして扱う。

## target観測pairのtrusted binding

preflight / publish job outputへ次を追加する。

```text
observed_before
observed_after
```

reportはremote-first reconciliationを先に行う。job側pairは次の全条件が
一致した時だけfinal receiptへ保持する。

```text
job result:
success

identity:
request SHA-256 exact
candidate SHA-1 exact

normal:
job H0 -> C1
report C1 -> C1

duplicate:
job C1 -> C1
report C1 -> C1

no-write head drift:
job D -> D
report D -> D

fault-injected head drift:
job H0 -> D
report D -> D

drift exclusion:
D != H0
D != C1
```

outcome、write attempted、postverified、lowercase SHA-1形式もexact一致させる。
job failure、output欠落、identity不一致、観測pair不一致は信用せず、
remote-firstのconservative outcomeを維持する。

no-writeの`D -> D`は同じ変数の複写ではなく、target refを二回実取得する。
二回目が不存在、取得不能、または一回目と異なる場合は
`RESULT_UNKNOWN_STOP / TARGET_OBSERVATION`で停止し、安定pairを主張しない。

`post_push_stop`ではpublish jobが意図的にfailureとなるため、job outputを
成功結果へbindingしない。reportがcandidateをremote-firstで全検証した時だけ
`APPLIED_CONFIRMED_AFTER_AMBIGUOUS_RESULT`、target `C1 -> C1`、
write attempted `unknown`を記録する。

## production mainのActions側境界観測

report jobはreconciliationの直前と直後に`refs/heads/main`を
Actions側Gitから取得し、次をfixed receipt fieldへ含める。

```text
production_main_observed_before
production_main_observed_after
```

取得不能またはref不存在ではreceipt成功扱いにせず
`RESULT_UNKNOWN_STOP / PRODUCTION_MAIN_OBSERVATION`で停止する。

5試験の開始前と終了後には、valid sandbox candidateを対象に
`request_mode=reconcile`としたread-only boundary Issueを一件ずつ実行する。
このrequestはwrite permitを作らず、targetがH0なら
`NOT_APPLIED_CONFIRMED_STOP`となる。

合格条件:

```text
pre-suite Actions main before == after == M0
post-suite Actions main before == after == M0
connector pre-suite main == M0
connector post-suite main == M0
Replacement 02 full-fetch post-suite main == M0
```

boundary Issueは5試験の成功数へ含めない。Issueとreceiptは監査証拠として
close後も削除しない。

## Replacement 02 maintenance

expected old:

```text
c333b0c032b20a1ecbde2426de9894b57d6be70a
```

exact changed paths:

```text
.github/workflows/cocolon_formal_publication_guard.yml
.github/cocolon_formal_publication_guard/guardian.py
.github/cocolon_formal_publication_guard/test_guardian.py
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md
Cocolon_前提資料/12_cocolon_github_actions_publication_guard.md
Cocolon_前提資料/manifest.json
```

local guardian testsは64件成功した。追加確認は、観測pairのpositive /
negative matrix、workflow output forwarding、receipt固定field、
production main boundary観測、`post_push_stop`が一回のpush後にだけ
uncertain stopとなることを含む。

production policyはfalse、`publish-main`は静的disabledのまま変更しない。
このmaintenance反映後のworkflow SHAで全request body / hash / candidateを
再生成してから、pre-suite boundary Issueと5試験を開始する。

# 2026-07-26 sandbox suite partial completion / report Git failure localization maintenance

## GitHub実動で確認した状態

| 証拠 | 確認済み結果 | Issue | 試験判定 |
|---|---|---|---|
| #9 / run 30162841240 | final `REJECTED_GIT_DIFF_FORMAT / CANDIDATE` | closed | Test 3不合格 |
| #10 / run 30163030641 | preflight `REJECTED_NON_LINEAR_LINEAGE / CANDIDATE`、report `RESULT_UNKNOWN_STOP / GIT` | open | partial blocked |
| #11 / run 30176589327 | preflight `REJECTED_NON_LINEAR_LINEAGE / CANDIDATE`、report `RESULT_UNKNOWN_STOP / GIT` | open | 一回だけの再試行を消費しpartial blocked |

旧suiteはTest 1 / 2が合格、Test 3がpartial blocked、Test 4 / 5が
未実行で、`2 / 5`である。Issue #9 / #10 / #11、各run、試験branch、
待機branchは再実行・改変・削除せず証拠として残す。

## 旧`RESULT_UNKNOWN_STOP / GIT`が示す範囲

Issue #10 / #11の旧revisionで、candidate inspectionが
`REJECTED_NON_LINEAR_LINEAGE / CANDIDATE`まで進んだ後、
report reconciliationが同じcandidateを再取得する前段で
`RESULT_UNKNOWN_STOP / GIT`となり得た場所は次の四つである。

```text
staging ref ls-remote
staging ref fetch
target ref ls-remote
target ref fetch
```

これは四つのどれかへ限定する証拠であり、network、credential、runner、
GitHub serviceのどれが原因かを確定する証拠ではない。

## ローカル実装

`git()`へ任意の固定`failure_stage`を受け取るkeyword-only引数を追加した。
candidate inspectionからだけ、次の固定literalを渡す。

```text
CANDIDATE_STAGING_REF_OBSERVATION
CANDIDATE_STAGING_REF_FETCH
CANDIDATE_TARGET_REF_OBSERVATION
CANDIDATE_TARGET_REF_FETCH
```

`remote_ref_sha()`はこのstageを`ls-remote`だけへ渡す。
`_fetch_exact()`は`fetch_failure_stage`をfetchだけへ渡し、
後続local `rev-parse`の既存分類は変えない。

次は変更しない。

- stage未指定nonzeroの`GIT`
- stage未指定OSError / timeoutの`GIT_EXEC`
- malformed remote outputの`REMOTE_REF`
- caller指定failure code
- `write_attempted` / `result_uncertain`
- retryなし
- failure detailからstderr、実行Git command、操作対象remote URL、
  token、credentialをreceiptへ新たに加えないこと
- 既存の許可済み`target_ref` / Actions `run_url` receipt field
- request / receipt schema
- workflow / policy

## ローカル試験

既存64件に次の8件を追加し、合計72件が成功した。

1. staging ref観測失敗を固定stageへ分離する。
2. staging fetch失敗を固定stageへ分離する。
3. target ref観測失敗を固定stageへ分離する。
4. target fetch失敗を固定stageへ分離する。
5. 既定`GIT` / `GIT_EXEC`とsecret非掲載を維持する。
6. 修正済み二親merge fixtureをpreflight / reconcileが同じ
   `REJECTED_NON_LINEAR_LINEAGE / CANDIDATE`で拒否する。
7. `RESULT_UNKNOWN_STOP`はcommentを残すがIssueをcloseしない。
8. unknown preflightはsandbox publishを解放せず、
   production publishも静的falseのままにする。

全ての四stage failureで、write permit、push、postverify-after-writeが
0回であることも確認した。

```text
python .github/cocolon_formal_publication_guard/test_guardian.py -v
Ran 72 tests
OK
```

## 現在の安全境界

- policyは`OBSERVE_AND_SANDBOX_ONLY`、
  `production_main_enabled=false`を維持する。
- workflowの`publish-main`は`if: ${{ false }}`を維持する。
- `publish-sandbox`はpreflight job success、`PREFLIGHT_PASSED`、
  target class sandboxの三条件が揃った場合だけ実行する。
- unknown reportはremote-firstの保守結果をcommentし、Issueをopenのまま残す。
- 今回はworkflow、policy、schemaを変更していない。
- LOCAL_GREEN_ONLY完了時点では、GitHub commit / push、Issue / Actions、
  branch / test ref、main / productionの変更は0件だった。

## Formal reflection contract

authority:

```text
COCOLON_GITHUB_ACTIONS_PUBLICATION_GUARDIAN_REPORT_GIT_FAILURE_LOCALIZATION_MAINTENANCE_GITHUB_REFLECTION_AND_POST_FETCH_ONLY
```

expected old:

```text
b9c0edd192569f91dae999927955eac5e5ba560f
```

current maintenance transportはReplacement 03である。GitHub `main`が
expected oldとexact一致し、そのdirect childを一回のexact leaseと
exact 6 pathsのfull post-fetchで確認できた場合だけ
`REFLECTED_POST_FETCH_VERIFIED_FRESH_SANDBOX_SUITE_NOT_RUN`とする。
失敗または結果不明なら`LOCAL_GREEN_NOT_REFLECTED_STOP`とする。

このauthorityはIssue作成、Actions実行、試験branch / ref操作、
sandbox再試験、production有効化、EmlisAI作業を許可しない。

## 未確認

- formal GitHub反映状態は上記conditional reflection contractだけで確定する。
- GitHub Actions上で四stageのどれが実測されるか。
- 新revisionを基準にしたfresh sandbox suite。現在`0 / 5 NOT_RUN`。
- Test 4 / 5、post-suite boundary、production activation / canary。

guardian revisionが変わったため、次に実地試験を承認する場合は、
旧suiteの残数だけを継続せず、新しいworkflow-bound pre-suite boundary、
新suite ID、新request ID、新staging / target refs、新Issueで
fresh `0 / 5`から行う。旧Issueと旧refは証拠として保持する。

## Step 11境界

このmaintenance revisionはGitHub transport診断保守だけである。
Step 11のsource、worker、reservation、formal attempt、Cycle001 stateを
進めない。

# 2026-07-26 publish target fetch failure diagnostic evidence maintenance / local GREEN

## Authority / baseline

```text
authority:
COCOLON_GITHUB_ACTIONS_PUBLICATION_GUARDIAN_PUBLISH_TARGET_FETCH_FAILURE_DIAGNOSTIC_EVIDENCE_MAINTENANCE_IMPLEMENTATION_AND_LOCAL_GREEN_ONLY

design:
Cocolon_GitHub_Actions_Publication_Guardian_Publish_Target_Fetch_Failure_Diagnostic_Evidence_Maintenance_Design_ReadOnly_20260726.md

design UTF-8 SHA-256:
30da6647b976b4e7930584c2f852fa2daf32ed3804e4f8c9cabc11d3fe748858

predecessor:
44b61fcf3e6d5e61ca381b6247e9d35a4b56e0f4

state:
LOCAL_GREEN_NOT_REFLECTED
```

作業開始時、predecessorとGitHub `main`は`identical`だった。
Issue #12のpre-suite boundaryは成立済み、Issue #13のfresh Test 1は
`CANDIDATE_TARGET_REF_FETCH`でblockedしたため、fresh suiteは`0 / 5`である。

## fixed diagnostic contract

final reconcile resultとfailed publish attemptを別層として扱う。

```text
final:
NOT_APPLIED_CONFIRMED_STOP

failed operation:
CANDIDATE_TARGET_REF_FETCH

optional evidence:
publish_failure
```

`git_failure_kind`:

```text
NONZERO_EXIT
TIMEOUT
SPAWN_OS_ERROR
SIGNAL_TERMINATED
```

`git_stderr_hint`:

```text
REMOTE_REF_MISSING_OR_MOVED
AUTH_OR_ACCESS_REJECTED
NAME_RESOLUTION_FAILURE
NETWORK_CONNECTION_FAILURE
TLS_OR_HOST_IDENTITY_FAILURE
LOCAL_REF_OR_IO_FAILURE
OBJECT_TRANSFER_OR_INTEGRITY_FAILURE
REMOTE_SERVICE_OR_PROTOCOL_FAILURE
UNCLASSIFIED_OR_AMBIGUOUS
NOT_EVALUATED
```

nonzero exitのraw stderrは最大64 KiBをASCII lower-case fixed markerで
memory内照合する。exact一分類だけならfixed hint、0または複数分類なら
`UNCLASSIFIED_OR_AMBIGUOUS`とする。
timeout、spawn OSError、signal terminationではstderrを分類せず
`NOT_EVALUATED`とする。

classifier例外、不正type、unknown enumはfixed ambiguousまたはfield dropへ
fail closedし、arbitrary stringを出力しない。

次は記録しない。

```text
raw stderr / matched marker
command / URL / ref / path
token / credential / secret
exit / signal / errno / exception message
stderr hash / length / timing
```

診断対象はexact `CANDIDATE_TARGET_REF_FETCH`だけである。
他のcandidate Git stageと既定`GIT / GIT_EXEC`には新診断fieldを付けない。

## trusted receipt binding

final receiptへ追加可能なobjectはexact次だけである。

```json
{
  "publish_failure": {
    "job": "publish-sandbox",
    "outcome": "RESULT_UNKNOWN_STOP",
    "stage": "CANDIDATE_TARGET_REF_FETCH",
    "git_failure_kind": "NONZERO_EXIT",
    "git_stderr_hint": "UNCLASSIFIED_OR_AMBIGUOUS",
    "write_attempted": false,
    "result_uncertain": false,
    "postverified": false
  }
}
```

上記kind / hintはshape例であり、Issue #13へ遡及適用しない。

次の三者をexact bindingする。

1. report remote-first result:
   sandbox、`NOT_APPLIED_CONFIRMED_STOP`、H0からH0、
   write unknown、postverified false、valid request / candidate identity。
2. preflight:
   job success、`PREFLIGHT_PASSED`、reportと同じrequest / candidate、
   observed_before H0、write false、postverified false。
3. publish-sandbox:
   job failure、`RESULT_UNKNOWN_STOP`、exact stage、fixed kind / hint、
   write false、result_uncertain false、postverified false。

一条件でも欠落・不一致なら`publish_failure`全体を捨てる。
`fixed_receipt()`はexact 8 keys、fixed literal、allowlisted enum、
三つのexact falseを再検証し、extra key、wrong type、
unknown stringがあればobject全体を捨てる。

診断は次を変更しない。

```text
final outcome
write_attempted
postverified
Issue close decision
retry可否
write permit / exact lease
```

## workflow connection

publish-sandbox job outputとreport envの間に次の4値だけを追加した。

```text
failure_stage
git_failure_kind
git_stderr_hint
result_uncertain
```

Issue #13でfailed publish jobの既存outputがreportへ届くことを確認済みのため、
`continue-on-error`、`if: failure()`、追加failure step、
publish再実行、自動retryは追加していない。

permissions、concurrency、preflight gate、sandbox gate三条件、
checkout SHA pin、publish command、publish-main `if: ${{ false }}`、
report `always()`を変更していない。

## local verification

```text
existing tests:
72

new test definitions:
4

total:
76

result:
OK
```

確認範囲:

- fixed marker classification matrix。
- invalid UTF-8、unknown、複数match、64 KiB limit。
- positive nonzero / negative signal / timeout / OSError。
- target-fetch-only diagnostic。
- raw secret / URL / ref / path / command非掲載。
- safe GITHUB_OUTPUTとworkflow exact4 forwarding。
- trusted binder positive。
- report / preflight / publish各条件のnegative matrix。
- malformed nested receipt全体drop。
- report main end-to-endでfinal state不変。
- 既存APPLIED / ALREADY / HEAD_DRIFT / corrected merge /
  local bare remote / preflight gate回帰。

## unchanged boundary

- candidateをcheckout / executeしない。
- policyは`OBSERVE_AND_SANDBOX_ONLY`。
- `production_main_enabled=false`。
- publish-mainは静的false。
- request schema / policy bytes不変。
- exact expected-old lease / postverification不変。
- no automatic retry。
- Issue #9〜#13と既存refを証拠として保持。
- EmlisAI / Step 11を開始しない。

exact local changed pathsはworkflow、guardian、test、前提資料3点、
manifestの7件である。
GitHub commit / push / Issue / Actions / ref操作は0件である。

## 未確認

- Issue #13のexact process kind / stderr hint。
- GitHub Actions上で新fixed fieldsがfinal receiptへ届くこと。
- maintenanceのGitHub reflection / full post-fetch。
- fresh pre-suite boundary、fresh 5 tests、post-suite boundary。
- production activation / canary。

## 次の境界

次は別authority候補で、GitHub反映とfull post-fetchだけを扱う。

```text
COCOLON_GITHUB_ACTIONS_PUBLICATION_GUARDIAN_PUBLISH_TARGET_FETCH_FAILURE_DIAGNOSTIC_EVIDENCE_MAINTENANCE_GITHUB_REFLECTION_AND_POST_FETCH_ONLY
```

この候補は未承認である。
反映成立後もfresh suiteは`0 / 5 NOT_RUN`から始め、Issue #12 / #13、
現在のstaging / target refsを再利用しない。

## 2026-07-26 guardian retirement

Decision owner:

```text
Mash
```

Decision:

current Cocolon actual environmentに対して、guardianの保証水準と継続保守費が
過剰であるため廃止します。これは華恋の独断による打切りではありません。

```text
Final state:
RETIRED_DISABLED

workflow repository state:
disabled_manually

production activation:
never performed / cancelled

production canary:
not run / cancelled

fresh suite:
3 / 5 stopped / no continuation

unreflected local maintenance:
abandoned / not to be reflected

historical Issues, runs, branches, refs:
preserved / not rerun / not reused / not current authority

active publication route:
none derived from guardian

reactivation:
forbidden without a new explicit Mash authority based on a changed actual environment
```

HEAD drift防止、承認済みscope、one reflection checkpoint、postverification、
結果不明時の自動retry禁止という最小安全条件は通常作業へ残します。

一方、Issue-driven publication、actor / candidate adversarial model、
fresh 5-suite、diagnostic maintenanceはcurrent actual environmentに対して
過剰でした。guardian自身が新しいfailure、保守、停止、handoffを生み、
Cocolon本体作業を止めました。current費用対効果が成立しないためretireします。

番人が危険だった、安全性が無意味だった、という意味ではありません。
実行systemとして再利用せず、最小安全原則だけを通常のGitHub反映へ戻します。
