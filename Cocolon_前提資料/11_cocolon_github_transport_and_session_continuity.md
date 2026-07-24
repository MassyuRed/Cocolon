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

```text
repository: MassyuRed/Cocolon
deploy_key_title: Karen Work Cocolon Lease 2026-07-25
key_algorithm: ssh-ed25519
public_key_sha256_fingerprint: SHA256:gCA4W3puVpLcATfGVc9f97n8l4allD0kzc5x5mml9OA
github_write_access: enabled at registration
ssh_endpoint: ssh.github.com:443
ssh_repository_url: ssh://git@ssh.github.com:443/MassyuRed/Cocolon.git
github_ed25519_host_key_sha256_fingerprint: SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU
purpose: exact expected-old-SHA lease publication for Cocolon main
```

公開鍵本文は秘密ではありませんが、continuity identityはtitle、algorithm、SHA-256 fingerprint、repository scope、write accessで固定します。

# 2026-07-25に確認した事実

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
