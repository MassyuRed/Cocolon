---
doc_id: cocolon_github_transport_and_session_continuity
title: "Cocolon GitHub reflection contract / historical transport record"
revision_date: "2026-08-07"
repository_scope: "MassyuRed/Cocolon"
secret_material_allowed: false
---

# 目的

この資料は、Cocolonとmashos-apiのGitHub反映方法および反映完了判定の唯一のcurrent契約と、旧transport記録のhistorical ownerです。秘密鍵、passphrase、token、環境変数値、agent socket、credential traceは記録しません。

# CURRENT_NORMATIVE_CONTRACT: Cocolon GitHub反映契約

normative_status: `CURRENT`

この節だけを、Cocolonとmashos-apiのGitHub反映方法および反映完了判定のcurrent正本とする。

ここでいう`exact path`は、対象repository内の同一完全pathを意味する。

## 1. 作業者とwrite authority

Cocolonとmashos-apiへ書き込む作業者は華恋だけとする。

通常のtechnical/product writeは、Mash様が承認した作業範囲に限る。

ただし、continuous durable recordingのためのpublic-safe administrative checkpoint、handoff、ledger、result/STOP記録、既存ownerへのcurrent-state記録については、次の全条件を満たす場合、Mash様が既に承認したtask scopeをstanding checkpoint-write authorityとして扱う。

- technical execution、product progression、code / DB / API / RN / migration / runtime変更を伴わない。
- rule / contract変更を伴わない。
- scope expansionを伴わない。
- 新しいtechnical ownerを作らず、既存のpremise / implemented-document / task-specific durable ownerへ保存する。
- public-safeであり、secret / body-full private evidenceを含まない。

このstanding authorityは保存だけを許可し、technical PASS、credit、completion、automatic progressionを生まない。

既存durable ownerがない、または保存先・scopeが明確でない場合は、local-only成果物を完成扱いせずowner/approval gapとしてSTOPする。

## 2. 書き込み前に確認すること

華恋は書き込み直前に、次だけを確認する。

- 現在のGitHub最新版。
- 承認されたtechnical target、または上記standing authorityに該当するadministrative checkpoint exact path。
- 新規ファイルなら、同じexact pathに既存ファイルがないこと。
- 修正ファイルなら、現在の内容が作業時に確認した内容と一致すること。
- scope外のファイルを変更しないこと。

## 3. 書き込み方法

現在利用できるGitHub機能を使って書き込む。
特定の鍵、特定の通信方法、特定のコマンドを必須にしない。
GitHub機能の都合で複数回の書き込みになることを許容する。
一つのcommitへ強制しない。
scope外のファイルを混ぜない。

## 4. 書き込み後に確認すること

書き込み後は、次をGitHubから取得して確認する。

- 対象ファイルが存在すること。
- 対象ファイルの内容が、作成した成果物と一致すること。
- 華恋が今回生成したwrite commit群のchanged-path setにscope外のファイルが含まれていないこと。
- GitHubの最新版に対象成果物が含まれていること。

repository全体、全tree、全blob、全unchanged pathを毎回取得・検証する必要はない。

## 5. 作業を止める条件

華恋が停止してよいのは、次の事実が確認された場合だけとする。

- 対象ファイルが確認後に別内容へ変更されていた。
- scope外fileを変更しなければ完了できない。
- GitHubへの書き込みが実際に失敗した。
- 書き込み結果が成功か失敗か確認できない。
- GitHub write権限が実際にない。
- 削除、履歴の書き換え、承認外の不可逆操作が必要になった。
- administrative checkpointについて既存durable ownerまたは保存scopeを確定できない。

最新版が進んでいても、対象fileに衝突がなければ最新版を読み直して続行する。

書き込み応答だけで成功・失敗が確定しない場合は対象exact pathを再取得する。成果物と一致すれば成功、書き込み前の内容または不存在のままなら未反映、別内容または取得不能なら結果不明として停止する。結果不明targetを自動再writeしない。

## 6. 必須にしてはいけない条件

次を通常のGitHub反映の必須条件にしてはいけない。

- 特定の秘密鍵がcurrent sessionに存在すること。
- 特定のSSH経路、通信方法、書き込みcommandを使うこと。
- expected-old ref CASまたはexact lease。
- direct-child commit。
- single-tree / single-commit。
- GitHub全体、全tree、全blob、全unchanged pathの毎回検証。
- full recursive postfetch。
- durable store自体をtechnical publication開始条件にすること。
- future-scaleの複数writer前提。

## 7. 他資料との優先関係

この契約をGitHub反映方法と完了判定の唯一の正本とする。
`work_attitude_rules_for_karen/00_read_first.txt`はactive行動Gateの入口だが、GitHub transportの技術詳細は本契約を優先する。
過去資料、設計書、test、receiptは本契約を勝手に厳格化できない。

## 8. 変更権限

華恋は、この契約を独断で変更できない。
変更できるのは、Mash様が変更scopeを明示して承認した場合だけとする。

# CURRENT_NORMATIVE_CONTRACT: continuous durable work recording / emergency handoff

normative_status: `CURRENT`
decision_owner: `Mash`
canonical_detail_owner: `14_cocolon_continuous_work_recording_and_emergency_handoff.md`

この節は、強制session切替、context limit、tool failure、scratch消失に備えて、作業中の確認・成果物・STOP・次工程を継続的にdurable化する契約です。Mash様がsession終了を指示することを保存開始条件にしません。

local file、chat、subagent出力、session cache、scratch absolute path、SHA-256だけは永続保存ではありません。後続作業が依存するlocal-only byteが生じた場合は、public-safeな実byteまたはlossless bundle、checksum ledger、authority lifecycle、確認済み事実、未確認、非再利用evidence、STOP理由、次のexact actionを、上記standing authorityまたは別途承認されたdurable ownerへ作業途中で保存します。

checkpointはtechnical execution、authority approval、technical credit、completion、closure、automatic progressionの代替ではありません。invalid/STOP artifactは成功へ昇格させずhistorical/noncreditとして保存します。

# HISTORICAL_NON_NORMATIVE_TRANSPORT_RECORDS

2026-08-07より前の鍵、SSH、expected-old、Guardian、receipt、run、過去commit等の記録はhistorical ownerとして保持します。current GitHub反映条件・停止条件・正式性条件には使用しません。
