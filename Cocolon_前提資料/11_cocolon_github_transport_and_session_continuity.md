---
doc_id: cocolon_github_transport_and_session_continuity
title: "Cocolon GitHub transport / session continuity owner"
revision_date: "2026-07-26"
repository_scope: "MassyuRed/Cocolon"
secret_material_allowed: false
---

# 目的

この資料は、Cocolonのformal GitHub反映に必要なtransport前提をsession間で失わないためのownerです。

登録済みdeploy keyというGitHub側の継続事実と、現在のWork sessionに秘密鍵が存在して実際に使えるというsession限定事実を分けます。秘密鍵、passphrase、token、環境変数値、agent socket、credential traceは記録しません。

# 継続して参照する非秘密情報

## 旧key identityの登録・検証履歴

```text
repository: MassyuRed/Cocolon
deploy_key_title: Karen Work Cocolon Lease 2026-07-25
key_algorithm: ssh-ed25519
public_key_sha256_fingerprint: SHA256:gCA4W3puVpLcATfGVc9f97n8l4allD0kzc5x5mml9OA
github_write_access: enabled at registration
continuity_state: REGISTERED_HISTORY_CURRENT_SESSION_NOT_VERIFIED
ssh_endpoint: ssh.github.com:443
ssh_repository_url: ssh://git@ssh.github.com:443/MassyuRed/Cocolon.git
github_ed25519_host_key_sha256_fingerprint: SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU
purpose: exact expected-old-SHA lease publication for Cocolon main
```

このidentityは2026-07-25に登録・検証した履歴です。Replacement 01登録後も削除・失効・認証失敗は確認していませんが、対応する秘密鍵をcurrent sessionで利用できないため、current sessionのactive keyとは扱いません。

## Replacement 01 current-session verified identity

```text
repository: MassyuRed/Cocolon
deploy_key_title: Karen Work Cocolon Lease 2026-07-25 Replacement 01
key_algorithm: ssh-ed25519
public_key_sha256_fingerprint: SHA256:GO/Q1Aro3b9iQYrNXjbgKNK554rq+Y/7WnMN9jvwzPo
github_write_access: enabled at registration
continuity_state: ACTIVE_CURRENT_SESSION_AUTHENTICATED
ssh_endpoint: ssh.github.com:443
ssh_repository_url: ssh://git@ssh.github.com:443/MassyuRed/Cocolon.git
github_ed25519_host_key_sha256_fingerprint: SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU
purpose: exact expected-old-SHA lease publication for Cocolon main
```

公開鍵本文は秘密ではありませんが、continuity identityはtitle、algorithm、SHA-256 fingerprint、repository scope、write accessで固定します。秘密鍵本文、保存path、credential traceは記録しません。`ACTIVE_CURRENT_SESSION_AUTHENTICATED`は2026-07-25の当該Work sessionだけの実測であり、将来sessionへ無検証継承しません。

# 2026-07-25旧keyで確認した履歴事実

確認対象:

```text
Cocolon main before transport verification:
94fe7bbdfd88f5b7899e530056b9ed9e46d0bdce

Cocolon tree:
8724181820e1cff1d060a48f0ccdf206e7d639bd

tracked path count:
824
```

確認結果:

- Work内の一時秘密鍵から導出した公開鍵fingerprintが、上記deploy key fingerprintとexact一致した。
- 秘密鍵fileはowner-only permissionで、group / other permissionは0だった。
- GitHub公式ED25519 host key fingerprintとのexact一致を確認した。
- `ssh.github.com:443`経由で`MassyuRed/Cocolon`へのdeploy-key authenticationが成功した。
- authenticated `git ls-remote`が上記Cocolon mainを返した。
- receive-packへのnew temporary ref dry-runが受理され、直後のremote確認で実refは作成されていなかった。
- `--force-with-lease=refs/heads/main:94fe7bbdfd88f5b7899e530056b9ed9e46d0bdce` dry-runが受理された。
- stale expected old SHA `75d1b02b5fa50969425ec307e353499074233f82`を指定した同dry-runは`stale info`で拒否された。
- current commit / recursive tree /全blobをfetchでき、`git fsck`で欠落を検出しなかった。
- 上記検証の前後でremote mainは`94fe7bbdfd88f5b7899e530056b9ed9e46d0bdce`のままで、GitHub上のfile / ref変更は0だった。

この確認は「transport能力が2026-07-25の当該Work環境で成立した」という事実です。formal artifactのpublish成功、server-side更新成功、formal completionを意味しません。

# 2026-07-25 Replacement 01登録後にcurrent sessionで確認した事実

確認対象:

```text
Cocolon main:
f3e2e405e2536188ee4d166753f1a823afd99e0b

Cocolon tree:
bff819e3cf3dcc22442ba56d93fff1c37ef26732

recursive blob count:
845
```

確認結果:

- Mash様がGitHub Deploy keys一覧で、Replacement 01のtitle、公開fingerprint、Read/write登録を確認した。
- current Workの一時秘密鍵から導出した公開fingerprintが、Replacement 01 fingerprintとexact一致した。
- 一時秘密鍵directoryはowner-only `0700`、秘密鍵fileはowner-only `0600`だった。
- GitHub公式ED25519 host key fingerprintとのexact一致を確認した。
- `ssh.github.com:443`経由で`MassyuRed/Cocolon`へのdeploy-key authenticationが成功した。
- authenticated `git ls-remote`とGitHub connectorが、同じCocolon mainを返した。
- current commit / recursive tree / 845 blobをfetchでき、欠落または破損blobを検出しなかった。
- receive-packへのnew temporary ref dry-runが受理され、直後のremote確認で実refは作成されていなかった。
- current sessionでは、mainに対するexact expected-old-SHA lease dry-runまたはformal publish成功をまだ確認していない。

この確認でReplacement 01の認証、repository scope、registered write capability、current bytes取得までは成立しました。formal exact lease更新、server-side main更新、post-fetch、formal completionは別の確認対象です。

# 2026-07-25 Replacement 01による最初のformal exact lease publish成立

上記観測の後、Mash様が承認した前提資料・作業ルールcheckpointを、同じcurrent sessionのReplacement 01 routeでformal publishした。

```text
expected old main:
f3e2e405e2536188ee4d166753f1a823afd99e0b

published direct child:
f04343129ac927639d7d0a5e1b8d52731e0e0a68

published tree:
fbeb6b7273640c348259c65c19273826b9bface8

changed path count:
10

recursive blob count after post-fetch:
845
```

確認結果:

- write直前のremote mainはexpected old mainとexact一致した。
- `--force-with-lease=refs/heads/main:f3e2e405e2536188ee4d166753f1a823afd99e0b`で、verified direct childだけを`main`へ反映した。
- server-side mainは`f04343129ac927639d7d0a5e1b8d52731e0e0a68`へ更新された。
- post-fetch後のremote commit、parent exact1、tree、exact 10 changed pathsはlocal publish対象と一致した。
- exact 10 pathsのremote blob SHA-1、local blob SHA-1、local bytesを照合し、blob SHA-1は全件一致した。
- recursive 845 blobは全て取得済みで、missing / corrupt objectを検出しなかった。
- GitHub connectorでもpublished commit上のowner fileを取得し、expected blobを確認した。

この節はReplacement 01が2026-07-25 current sessionでformal exact lease routeとして実際に成立した証拠である。将来sessionのprivate counterpart利用可能性、認証成功、live main、lease成立を保証しない。将来のwriteは毎回、下記のsession開始手順とexact lease contractを再実行する。

# session開始時の必須手順

1. このownerと`07_latest_snapshot_diff.md`の最新追記を先に読む。
2. 登録済みdeploy keyのtitle / fingerprint / repository scope / write accessを、存在しないものとして扱わない。
3. current sessionで利用可能な秘密鍵候補を、内容を表示せず、導出公開鍵fingerprintで照合する。
4. 秘密鍵fileのgroup / other permissionが0であることを確認する。0400 / 0600等のowner-onlyを許容する。
5. verified `known_hosts`を使い、`BatchMode=yes`、`IdentitiesOnly=yes`、`StrictHostKeyChecking=yes`で接続する。
6. exact repository URLへのauthenticated `ls-remote`でlive main `H0`を取得する。
7. current commit、base tree、recursive tree、全blobを取得できることを確認する。
8. writeが承認されたformal contractだけ、exact ref / exact `H0` / verified direct child / exact changed pathsを固定し、`--force-with-lease=refs/heads/main:<H0>`を使う。
9. push直前にlive mainが`H0`のままか再確認し、lease拒否・drift時は変更せずSTOPする。
10. push後はremote main、parent exact1、tree、exact changed paths、全対象bytes / blob / hashをpost-fetchで再確認する。

# 読み違え禁止

- GitHub connectorにexpected-old-SHA引数がないことを、登録済みSSH routeが存在しない証拠にしない。
- current sessionで秘密鍵fileを見つけられないことを、GitHub側のdeploy key登録が消えた証拠にしない。その場合は「登録identityは記録あり / local private counterpartは未確認または利用不能」と分ける。
- 前sessionの成功を、次sessionの認証成功として無検証継承しない。毎session fingerprint / host / repository / live head / fetch / leaseを再確認する。
- dry-run成功を、formal ref更新成功や`EXPECTED_OLD_SHA_MATCHED_AND_UPDATED`と同値扱いしない。
- normal fast-forward push、expected old OIDを省略した`--force-with-lease`、`--force`をformal CASの代用にしない。
- exact leaseの`force`という名前を、history rewrite許可へ読み替えない。targetは必ず`H0`のverified direct childとする。
- 秘密鍵、passphrase、token、credential内容をGitHub、前提資料、Library、chat、receipt、logへ残さない。

# local private counterpartが利用不能な場合

登録identityとlocal availabilityを分けてSTOPします。勝手に鍵を差し替えません。

Mash様へ求める作業は、既存秘密鍵の安全な再provision、またはreplacement public keyのdeploy key更新が本当に必要な場合だけです。認証情報をchatへ貼るよう求めません。

# Mash様へtransport作業を依頼する場合の説明contract

`再provisionしてください`、`replacement keyを登録してください`等の技術用語だけで依頼してはいけません。
Mash様が説明文だけで安全に完了できるよう、`work_attitude_rules_for_karen/07_forbidden_shifting_burden_to_user.txt`の必須説明項目を全て満たします。

current sessionでlocal private counterpart利用不能を再確認し、GitHub connector等の代替経路では承認済みformal contractを満たせない場合に限り、次を省略しません。

- 当該sessionで確認できている状態と、止まっている承認済みformal反映。
- local private counterpart利用不能が直接原因であること。
- replacement公開鍵登録により、current Workの新しい秘密鍵とGitHub側を対応させられること。
- connector writeや旧公開鍵だけではexact lease認証を代替できないこと。
- 未実施なら承認済みformal成果物をGitHubへ反映できず、完了後は華恋がそのformal反映を再開できること。
- なぜGitHub書込みが止まっているか。
- Mash様の操作が必要な理由。
- PC / browser等の使用端末。
- 同じWork session内で完了する等の時間・session制約。
- 開始URLと、URLを使わない場合のmenu順。
- button、入力欄、入力値、checkboxを一操作ずつ。
- 秘密鍵、password、tokenをchatへ貼らないこと。
- 成功画面、error時の伝え方、完了後に返す言葉。
- その返答後に華恋が認証確認、lease確認、GitHub反映、post-fetchを引き取ること。

# local private counterpart利用不能をcurrent sessionで再確認した場合の推奨復旧手順

以下はconditional recovery templateです。Replacement 01の認証に成功した2026-07-25 current sessionでは、この復旧条件は解消済みです。将来sessionでlocal private counterpart利用不能を再確認し、Mash様側にも既存秘密鍵を安全に再配置する仕組みがない場合、最も簡単な方法は、華恋がcurrent Work内でreplacement key pairを作り、Mash様が公開鍵だけをCocolonのDeploy keysへ追加する方法です。

この方法では、Mash様にterminal、PowerShell、SSH、秘密鍵fileの操作を求めません。

## なぜreplacement公開鍵の登録が必要か

GitHubのDeploy keyは、GitHubへ登録した公開鍵と、書込みを行うWork側の秘密鍵が対になった時だけ認証できます。

この復旧手順を使う前に確認する状態:

- GitHub側には対象公開鍵の登録記録がある。
- 対応する秘密鍵はcurrent Workでは利用できない。
- 公開鍵から秘密鍵を復元することはできない。
- GitHub connectorのwrite機能には、Cocolon formal contractが要求するexpected-old-SHA指定がない。

したがって、対応秘密鍵を利用できない登録済み公開鍵だけでも、connector writeだけでも、current Workからformal exact lease pushはできません。

replacementでは、current Workが保持する新しい秘密鍵に対応する公開鍵をGitHubへ登録します。これによりGitHubがcurrent Workの書込みを認証でき、華恋が承認済みexact lease、成果物反映、post-fetchを再開できます。

登録しない場合、local成果物は残せてもGitHub上のcurrent authorityにはできず、当該承認済みformal成果物の成立も進みません。

## 0. 華恋が先に行うこと

1. Mash様へ「新しい鍵を作ってよいか」を平易な一問で確認する。
2. 承認後、華恋がWorkの一時領域にowner-onlyの新しいED25519 key pairを生成する。
3. 華恋は公開鍵本文、公開fingerprint、登録用titleだけをMash様へ提示する。
4. 秘密鍵本文、保存内容、credential traceは表示しない。
5. 鍵生成後は別sessionへ移らず、同じWork会話内で登録とtransport確認を完了するよう説明する。

## 1. Mash様が行うGitHub画面操作

使用端末:

```text
PCのWeb browserを推奨
```

repositoryの`Settings`、`Deploy keys`、title、write accessを同じ画面幅で確認しやすく、公開鍵一行の貼り付けミスを避けやすいためです。スマートフォンしか使えない場合でも実行可能ですが、同じ項目名と完了条件を一つずつ確認します。

時間・session制約:

- 華恋が公開鍵を提示した後は、別のWork sessionへ切り替えない。
- 同じ会話のままGitHub登録を行い、`登録したよ`と返す。
- 中断して一時秘密鍵が失われた場合、その公開鍵では認証できず、再度replacementが必要になる。

開始URL:

```text
https://github.com/MassyuRed/Cocolon/settings/keys
```

直接URLを使わない場合:

1. GitHubで`MassyuRed/Cocolon`を開く。
2. repository上部の`Settings`を押す。
3. 左menuの`Deploy keys`を押す。
4. `Add deploy key`を押す。
5. `Title`へ、華恋が指定したtitleをそのまま入力する。
6. `Key`へ、華恋が提示した`ssh-ed25519`で始まる公開鍵一行だけを貼る。
7. `Allow write access`をONにする。
8. `Add key`を押す。
9. GitHubがpasswordまたは2段階認証を求めた場合、Mash様自身のGitHub画面内だけで入力し、chatへ貼らない。

完了条件:

- Deploy keys一覧に指定titleが表示される。
- write accessが有効である。

完了後にMash様が返す言葉:

```text
登録したよ
```

error時:

- 秘密鍵、password、tokenは送らない。
- GitHub画面に表示されたerror文だけを、そのまま伝える。
- `Settings`または`Deploy keys`が見つからない場合は、その事実だけを伝える。

## 2. 登録後に華恋が引き取る作業

1. 公開fingerprintの一致を確認する。
2. private key permission、GitHub公式host identity、exact repositoryを確認する。
3. authenticated `ls-remote`、full fetch、exact lease dry-runを行う。
4. live mainを再取得して、承認済み成果物だけをexact expected-old-SHA leaseで反映する。
5. remote head、parent、tree、exact changed paths、全対象bytes / blob / hashをpost-fetchする。
6. commit SHA、final HEAD、exact pathsをMash様へ報告する。

新しい鍵の認証成功を確認する前に、既存deploy keyを削除するよう求めません。旧鍵の整理が必要な場合は、replacement routeの成功後に別途、削除対象titleとGitHub画面操作を同じ説明粒度で示します。

# 2026-07-25 Replacement 02 / Actions guardian bootstrap identity

Mash様は、次の公開identityをCocolon repositoryのRead/write Deploy keyとして
登録したことを確認しました。

```text
repository:
MassyuRed/Cocolon

deploy_key_title:
Karen Work Cocolon Lease 2026-07-25 Replacement 02

key_algorithm:
ssh-ed25519

public_key_sha256_fingerprint:
SHA256:juey2q+Jw9m06eetJi9yiexE7r9/zB1u//OvD15nyXE

github_write_access:
enabled at registration

ssh_endpoint:
ssh.github.com:443

ssh_repository_url:
ssh://git@ssh.github.com:443/MassyuRed/Cocolon.git

github_ed25519_host_key_sha256_fingerprint:
SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU

purpose:
GitHub Actions publication guardian bootstrap / maintenance / activation /
forward disable or fix / SSH fallback
```

current sessionで秘密鍵本文を表示せず、次を実測しました。

- 一時directoryはowner-only `0700`、秘密鍵fileはowner-only `0600`。
- 秘密鍵から導出した公開fingerprintは上記Replacement 02とexact一致。
- GitHub公式current ED25519 host fingerprintと接続先host keyがexact一致。
- `ssh.github.com:443`経由で`MassyuRed/Cocolon`へのrepository認証が成功。
- authenticated `ls-remote`の`main`は
  `bbe13d85923f8dc197bc8b19e3a1fe1eace77f21`。
- current commitと全remote / tag refsをfetchし、`git fsck --full --strict`で
  missing / corrupt objectを検出しなかった。
- fetch時点のcommit countは503、remote / tag ref countは5。

秘密鍵本文、公開鍵本文、秘密鍵保存path、token、credential traceは記録しません。
この認証状態はcurrent Work sessionだけの事実で、future sessionへ無検証継承しません。

このownerを含むguardian bootstrap revisionは、上記mainをexpected oldとする
exact lease、verified direct child、exact 12 changed paths、full post-fetchが
全て成功した時だけformal installとします。

guardianのcurrent ownerは
`12_cocolon_github_actions_publication_guard.md`です。bootstrap後もActions routeは
`OBSERVE_ONLY / NOT_ACTIVE`で、SSH routeを置き換えません。Replacement 02は
actor allowlist maintenance、sandbox有効化、5試験中の番人修正、production
activation、canary、active owner finalizationまで維持します。削除はMash様の
別cleanup承認後だけです。

# 2026-07-25 Replacement 02 bootstrap publishとsandbox maintenance継続

## disabled bootstrapのformal反映

Replacement 02で、次の一回のformal exact lease publishとfull post-fetchが
成立しました。

```text
expected old main:
bbe13d85923f8dc197bc8b19e3a1fe1eace77f21

published direct child:
208f2b278baf81f558fa67ec84892542177a8886

published tree:
5c2c6fadd713937338f70c8096558315d9412c6c

parent count:
exactly 1

changed path count:
exactly 12
```

remote head、parent exact1、tree、exact path set、全12対象のGit blob SHA-1、
raw SHA-256、sizeをfull fetch後に照合し、
`git fsck --full --strict`でもmissing / corrupt objectを検出しませんでした。
GitHub connectorからownerとpolicyを独立取得し、同じbootstrap commitのblobと
一致することも確認しました。

## actor observe-onlyの実動結果

```text
Issue:
https://github.com/MassyuRed/Cocolon/issues/2

Actions run ID:
30159464499

workflow SHA:
208f2b278baf81f558fa67ec84892542177a8886

sender / issue creator:
175191163 / MassyuRed / User

outcome:
OBSERVE_ONLY_ACTOR_CAPTURE

write attempted:
false
```

実行後も`main`は
`208f2b278baf81f558fa67ec84892542177a8886`で不変でした。

## 次のReplacement 02 maintenance

sandbox試験開始revisionは上記`main`をexpected oldとし、変更を次の8 pathsへ
限定します。

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

このmaintenanceではsandbox writeだけを有効化し、production writeはpolicyと
workflowの二箇所で停止したままにします。local guardian tests 54件成功後、
stale expected oldの拒否とcurrent expected oldのdry-run acceptanceを再確認し、
一回だけformal exact leaseを試行します。

guardian本体の変更は、publish jobがskipされる重複・事前head競合でも、
preflightのtyped resultをremote-first reportへ安全にbindingするためです。
job成功とrequest / candidate identityが一致しないoutputは信用しません。

5 sandbox試験、production activation、canary、active owner finalizationが
終わるまでReplacement 02を通常のformal main routeとして維持します。
鍵を通常運用から外す条件はActions canaryのfull postverification成功であり、
sandbox有効化だけでは満たしません。秘密鍵本文、公開鍵本文、保存pathは記録しません。

# 2026-07-25 Replacement 02 request ID binding maintenance

sandbox-only enable revisionは次のformal identityで成立しました。

```text
expected old:
208f2b278baf81f558fa67ec84892542177a8886

published direct child:
a5fb4fd9467e23f7fc6420260f6a96e2d0513a65

tree:
66520565ccd4536af96f358b3f58b1e5470aa39f

changed paths:
exactly 8
```

parent exact1、tree、exact 8 paths、全対象blob / raw SHA-256 / size、
full fetch、strict fsckをpost-fetchで確認し、connectorからpolicy / workflowも
独立確認しました。

5 sandbox試験Issueを作る前に、同じrequest IDへ別manifestを完全整合させる
再利用経路を確認したため、試験を0/5のまま停止しました。

次のmaintenanceは`a5fb4fd9467e23f7fc6420260f6a96e2d0513a65`をexpected oldとし、
request IDをtarget ref、expected old、files SHA-256へ決定的にbindingします。
変更は次のexact 7 pathsです。

```text
.github/cocolon_formal_publication_guard/guardian.py
.github/cocolon_formal_publication_guard/request_v1.schema.json
.github/cocolon_formal_publication_guard/test_guardian.py
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md
Cocolon_前提資料/12_cocolon_github_actions_publication_guard.md
Cocolon_前提資料/manifest.json
```

local guardian tests 56件成功後、stale lease拒否とcurrent lease dry-runを再確認し、
Replacement 02で一回だけ反映します。

production flagと`publish-main`の静的停止は変更しません。
正常case用に作成済みのsandbox / staging準備refには秘密情報がなく、
Issue未作成・guardian write未実施です。sandbox target refは再確認後に利用できます。
旧opaque ID名のstaging refは新contractでは利用せず、binding revision反映後の
workflow SHAで依頼票を再生成し、計算された`g1-<64 hex>`とexact一致する
新しいstaging refを作成します。

# 2026-07-25 Replacement 02 receipt observation maintenance

request ID binding revisionは次のformal identityで成立しました。

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

parent exact1、tree、exact 7 paths、全対象blob / raw SHA-256 / size、
full fetch、strict fsckをpost-fetchで確認しました。GitHub connectorでも
guardianとrequest schemaのblob identityを独立確認しました。

新contractの正常case targetと
`refs/heads/guardian/staging/g1-5ee9e6ef21c3de886c2829d839a2ae89b565baefc85a86963c2dfaf7e5457adb`
は準備済みですが、Issue作成とActions guardian writeはまだ0件です。
stagingには秘密情報がなく、final workflow SHAを含むrequest body /
request SHA-256 / candidate SHA-1は今回maintenance反映後に再計算します。

Issue作成前の最終監査で、次の二つのreceipt不足を確認しました。

1. publish / preflight jobが見たtargetの`observed_before / after`が、
   final reportで保存時のpairとして残らない。
2. sandbox suite前後のproduction mainをActions側Gitで観測した証拠が
   receiptに残らない。

次のReplacement 02 maintenanceはcurrent main
`c333b0c032b20a1ecbde2426de9894b57d6be70a`をexpected oldとし、
変更を次のexact 7 pathsへ限定します。

```text
.github/workflows/cocolon_formal_publication_guard.yml
.github/cocolon_formal_publication_guard/guardian.py
.github/cocolon_formal_publication_guard/test_guardian.py
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md
Cocolon_前提資料/12_cocolon_github_actions_publication_guard.md
Cocolon_前提資料/manifest.json
```

job側の観測pairは、reportがremote-firstで全内容を再確認し、request、
candidate、job success、outcome、write attempted、postverifiedと
SHA関係が全て一致した時だけ保持します。失敗jobや不一致outputは信用しません。
no-writeのtarget pairもrefを二回実取得して作り、二回目の不存在、取得不能、
またはSHA変化は`RESULT_UNKNOWN_STOP / TARGET_OBSERVATION`で停止します。

reportはreconciliationの前後でproduction mainをActions側Gitから取得し、
固定fieldとしてIssue receiptへ残します。suiteの前後に
`request_mode=reconcile`のread-only boundary Issueを一件ずつ実行し、
両方のActions観測をconnectorとReplacement 02 full fetchへ照合します。

local guardian testsは64件成功しています。production flagと
`publish-main`の静的停止は変更しません。GitHub sandbox試験は
`0 / 5 NOT_RUN`で、今回maintenance自体を試験成功へ数えません。

# 2026-07-26 Replacement 03 guardian report localization maintenance reflection boundary

## 確認した事実

- Issue #10 / #11のreport jobはworkflowで
  `GH_TOKEN: ${{ github.token }}`を受け取り、実行ごとにGitHubが発行する
  Actions tokenでIssue comment / close APIを呼ぶ。
- このreport経路は、deploy keyの秘密鍵を使うSSH exact lease経路とは
  別である。したがって、Issue #10 / #11の
  `RESULT_UNKNOWN_STOP / GIT`はdeploy keyの登録不良や秘密鍵不一致の
  証拠ではない。
- LOCAL_GREEN_ONLY完了時点の承認範囲はローカル実装とローカル試験だけであり、
  Replacement 02秘密鍵の探索、fingerprint再照合、SSH認証、full fetch、
  live head観測、lease、push、post-fetchは実行していない。
- Replacement 02の追加、変更、削除も行っていない。
- ローカルguardian試験は72件成功した。LOCAL_GREEN_ONLY完了時点では、
  GitHub反映とActions実地試験は未実行だった。
- Replacement 02の公開identityはGitHubに残るが、current sessionで対応する
  秘密鍵を利用できなかったため、Mash様の承認後に次をCocolon Read/write
  Deploy keyとして登録した。

```text
deploy_key_title:
Karen Work Cocolon Lease 2026-07-26 Replacement 03

key_algorithm:
ssh-ed25519

public_key_sha256_fingerprint:
SHA256:Mm6YWPYIqZGna0vHC5YXl/XP9CxHFkzVATD7pUCPUEM

github_write_access:
enabled at registration

ssh_endpoint:
ssh.github.com:443

ssh_repository_url:
ssh://git@ssh.github.com:443/MassyuRed/Cocolon.git
```

- current sessionの秘密鍵本文を表示せず、導出公開fingerprintが
  Replacement 03とexact一致し、秘密鍵`0600`、保管directory`0700`、
  GitHub公式ED25519 host fingerprint、repository認証を確認した。
- authenticated `ls-remote`と全branch / tagのfull fetch後の`main`は
  `b9c0edd192569f91dae999927955eac5e5ba560f`でexact一致し、
  `git fsck --full --strict --no-dangling`でfindingは0件だった。
- 秘密鍵本文、公開鍵本文、秘密鍵保存path、passphrase、token、
  credential traceは記録しない。

## 今回のtransport境界

このmaintenanceはcandidate inspection内のread-only Git failureを
固定stageへ分けるだけで、SSH route、Actions token権限、remote URL、
鍵管理、exact lease、write permit、retry policyを変更しない。

Replacement 02 / 03は、Mash様の別cleanup承認またはformal route切替完了まで
登録状態を勝手に変更しない。current formal maintenance routeは
Replacement 03とするが、その認証成功はcurrent sessionだけの事実である。
future sessionでは秘密鍵本文を表示せずtitle / fingerprint、認証、full fetch、
live expected-old、exact lease、post-fetchを改めて確認し、過去sessionの
成功を継承しない。

GitHub反映authorityは次だけである。

```text
COCOLON_GITHUB_ACTIONS_PUBLICATION_GUARDIAN_REPORT_GIT_FAILURE_LOCALIZATION_MAINTENANCE_GITHUB_REFLECTION_AND_POST_FETCH_ONLY
```

GitHub `main`が
`b9c0edd192569f91dae999927955eac5e5ba560f`のままで、そのdirect childを
exact 6 paths、一回のexact leaseで反映し、full post-fetchが成立した場合だけ
formal反映とする。失敗または結果不明なら未反映で停止する。
このauthorityはIssue作成、Actions実行、試験branch / ref操作、
sandbox再試験、production有効化を許可しない。

## 未確認

- formal反映状態は上記conditional reflection contractだけで確定する。
- 反映後のfresh sandbox suiteは`0 / 5 NOT_RUN`である。
- Replacement 03のcurrent-session認証成功をfuture sessionで再利用できるか。

## 華恋の意見

Issue #10 / #11のreport失敗を鍵問題へ読み替えず、Actions内Gitの四操作へ
診断範囲を保つべきである。Replacement 03は旧report失敗の修正ではなく、
番人自身のlocked pathをformal反映するためのbootstrap / maintenance
transportである。通常成果物のActions routeと混同しない。

# 2026-07-26 publish target fetch failure diagnostic evidence maintenance / local GREEN transport boundary

## 確認済み

authority:

```text
COCOLON_GITHUB_ACTIONS_PUBLICATION_GUARDIAN_PUBLISH_TARGET_FETCH_FAILURE_DIAGNOSTIC_EVIDENCE_MAINTENANCE_IMPLEMENTATION_AND_LOCAL_GREEN_ONLY
```

設計:

```text
Cocolon_GitHub_Actions_Publication_Guardian_Publish_Target_Fetch_Failure_Diagnostic_Evidence_Maintenance_Design_ReadOnly_20260726.md

UTF-8 SHA-256:
30da6647b976b4e7930584c2f852fa2daf32ed3804e4f8c9cabc11d3fe748858
```

implementation predecessor / current GitHub main at work start:

```text
44b61fcf3e6d5e61ca381b6247e9d35a4b56e0f4
```

GitHub compareは上記commitと`main`を`identical`として返し、
local checkoutと対象guardian / test / workflow blobも一致した。

Issue #13 / run `30179774714`の
`RESULT_UNKNOWN_STOP / CANDIDATE_TARGET_REF_FETCH`は、
publish-sandbox job内でGitHub Actionsが発行した`GITHUB_TOKEN`を使う
HTTPS Git経路のread-only candidate fetchで発生した。

これはWork側のSSH maintenance routeと別経路である。
Issue #13をReplacement 03の秘密鍵不良、公開鍵登録不良、
SSH endpoint不良の証拠へ読み替えない。
Issue #12 / #13とfresh suiteのstaging / target refsはrerun・改変・削除せず
証拠として保持し、fresh suiteは`0 / 5 STOPPED`のままとする。

今回のLOCAL_GREEN_ONLYでは、Replacement 03の秘密鍵探索、
fingerprint照合、SSH認証、`ls-remote`、full fetch、receive-pack、
lease、push、post-fetchを行っていない。
Replacement 02 / 03の登録、変更、削除、再登録も行っていない。

今回追加したfixed diagnosticはActions内target fetchのstderrを
memory内で最大64 KiBだけ分類する。次をrepository、Issue、Actions output、
receipt、前提資料へ残さない。

```text
raw stderr
Git command
remote URL
ref / local path
token / credential / private key
exit / signal / errno / exception message
stderr hash / length / timing
```

workflowへ追加したのはpublish-sandboxからreportへの次の固定値だけである。

```text
failure_stage
git_failure_kind
git_stderr_hint
result_uncertain
```

Actions route、SSH route、remote URL、鍵管理、exact lease、
write permit、retry policyを変更していない。
local testは76件成功し、GitHub writeは0件である。

## current transport境界

このrevisionは`LOCAL_GREEN_NOT_REFLECTED`である。
GitHub反映とfull post-fetchは、次の別authority候補が明示承認された場合だけ
検討する。

```text
COCOLON_GITHUB_ACTIONS_PUBLICATION_GUARDIAN_PUBLISH_TARGET_FETCH_FAILURE_DIAGNOSTIC_EVIDENCE_MAINTENANCE_GITHUB_REFLECTION_AND_POST_FETCH_ONLY
```

そのsessionでは、過去sessionのReplacement 03認証成功を継承しない。
`main`のexpected old、利用可能なcurrent transport、
認証、full fetch、exact lease、post-fetchを再確認する。

GitHub `main`が
`44b61fcf3e6d5e61ca381b6247e9d35a4b56e0f4`と一致し、
verified direct child / exact 7 paths / one exact lease / full post-fetchが
全て成立した場合だけformal反映とする。

失敗または結果不明ならGitHub refを追加操作せず、
`LOCAL_GREEN_NOT_REFLECTED_STOP`で停止する。

## 未確認

- Issue #13のexact subprocess kindとstderr hint。
- 新fixed outputのGitHub Actions上の到達性。
- 次sessionでReplacement 03のlocal private counterpartが利用可能か。
- reflection authority、fresh suite authority、cleanup authorityの承認。

## 推測禁止

Issue #13の失敗理由を鍵、network、GitHub service、runner、token、
ref、object transferのいずれかへ断定しない。
Replacement 03の再登録・削除・rotationを今回の結果から要求しない。

## 華恋の意見

通常成果物を保存するActions routeと、番人自身を保守反映するSSH routeを
分離したまま維持する。今回の診断はActions route内の失敗証拠を狭めるための
ものであり、鍵運用を通常成果物へ戻す変更ではない。

## 2026-07-26 current transport: guardian retirement

GitHub Actions publication guardianはcurrent publication routeではありません。
workflowはrepository metadataで`disabled_manually`です。

guardianのための新しいReplacement keyを作成しません。
guardian maintenanceを理由にMash様へdeploy key登録を求めません。
既存deploy keyは本作業だけを理由に削除せず、現行の別formal Git transportで
使用中かを確認せずrevokeしません。

future GitHub reflectionは、その作業時点で利用可能なcurrent routeを確認し、
次の最小条件だけを維持します。

```text
HEAD確認
承認済みexact scope
一つの承認済みreflection checkpoint
force rewrite禁止
postverification
結果不明時の自動retry禁止
```

一つのreflection checkpointは、文字どおり一回のnetwork callを意味しません。
connector上で複数のbounded operationが必要な場合は、同じ承認scope内で
current remote stateを追跡し、結果不明を残さず完了させます。

番人のretirementと一般のGitHub transport安全条件を混同せず、番人workflow、
Issue-driven publication、sandbox publication、guardian diagnostic maintenanceを
通常成果物の保存経路へ戻しません。
