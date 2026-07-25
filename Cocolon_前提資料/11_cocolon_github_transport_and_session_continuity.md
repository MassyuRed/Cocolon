---
doc_id: cocolon_github_transport_and_session_continuity
title: "Cocolon GitHub transport / session continuity owner"
revision_date: "2026-07-25"
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
