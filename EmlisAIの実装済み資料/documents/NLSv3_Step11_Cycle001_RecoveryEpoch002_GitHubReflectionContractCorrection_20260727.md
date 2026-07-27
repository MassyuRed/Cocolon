---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch002_current_github_reflection_contract_correction
title: "NLS v3 Step 11 Cycle 001 Recovery Epoch 002 current GitHub reflection contract correction"
revision_date: "2026-07-27"
status: "APPROVED_CURRENT_GITHUB_REFLECTION_CONTRACT_CORRECTION_DESIGN"
document_authority: "COCOLON_GITHUB_REFLECTION_CONTRACT_CURRENT_ACTUAL_ENVIRONMENT_REPLACEMENT_AND_ACTIVE_TRANSPORT_GATE_REMOVAL_ONLY"
planned_repository_path: "EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_GitHubReflectionContractCorrection_20260727.md"
body_free: true
automatic_progression: false
---

# 0. Decision

Mash様が2026-07-27に明示承認した作業に基づき、Cocolonと
`mashos-api`のGitHub反映方法を、華恋が単独で作業するcurrent actual
environmentへ整合させる。

このcorrectionの決定は次のとおり。

```text
CURRENT_GITHUB_REFLECTION_CONTRACT:
Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md
の2026-07-27 current contract

CURRENT_WRITER:
KAREN_ONLY

REQUIRED_PUBLICATION_ROUTE:
ANY_CURRENTLY_AVAILABLE_GITHUB_FUNCTION

SPECIAL_EXPECTED_OLD_TRANSPORT:
NOT_REQUIRED

DIRECT_CHILD / ONE_TREE / ONE_COMMIT:
NOT_REQUIRED

FULL_REPOSITORY / ALL_UNCHANGED_PATH VERIFICATION:
NOT_REQUIRED

DURABLE_STORE_AS_GITHUB_REFLECTION_PREREQUISITE:
FORBIDDEN

GUARDIAN:
RETIRED_DISABLED_NOT_REINTRODUCED

AUTOMATIC_PROGRESSION:
false
```

このcorrectionは、旧contractを上から一枚追加するだけの変更ではない。
current rule owner、current navigation pointer、active mashos-api
validator、active causal testを旧transport条件から切り離す。

旧Parent Design、Parent Addendum、correction、RED/GREEN result、receipt、
handoffは当時の事実を示す履歴として保持するが、current GitHub reflection
methodまたはcurrent作業停止条件を決めるauthorityにはしない。

# 1. Authority and separate work units

## 1.1 Explicit authority basis

Mash様は次の二つを明示的に承認した。

1. current GitHub reflection contractの置換と、rule、design、
   mashos-api implementation、active testの整合修正。
2. その完了・反映後に、欠落しているS1 successor causal RED result
   JSON exact1を通常のGitHub機能で反映し、postverifyすること。

契約変更を他作業へ混ぜないため、二つは別work unit、別reflection
checkpointとして扱う。同じ承認messageに含まれていても、変更path、
write結果、postverification、完了判定を混ぜない。

```text
WORK UNIT A:
COCOLON_GITHUB_REFLECTION_CONTRACT_CURRENT_ACTUAL_ENVIRONMENT_REPLACEMENT_AND_ACTIVE_TRANSPORT_GATE_REMOVAL_ONLY

WORK UNIT B:
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_POST_D2_S1_SUCCESSOR_CAUSAL_RED_RESULT_ARTIFACT_PUBLICATION_AND_POSTVERIFICATION_REMEDIATION_ONLY
```

Work Unit BはWork Unit AのGitHub反映とpostverificationが完了するまで開始
しない。Work Unit B完了後もS2、P1、candidate、Event1、formal exact134、
Event2、P2、Cycle001 acceptanceへ自動進行しない。

## 1.2 Work Unit A allowed scope

Work Unit Aは次だけを許可する。

- `Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md`
  のcurrent contractを本書§3の8条へ置換する。
- 複製されたcurrent ruleとindex/manifest/current navigationを同じ意味へ
  整合する。
- 本correctionをcurrent downstream designとして追加する。
- `mashos-api`のactive Epoch002 owner/verifier/orchestrator/testから、
  GitHub reflectionの成立条件としてのspecial transport gateを除去する。
- transport以外のNLS因果契約を維持する。
- targeted testとcurrent denominatorを再検証する。
- 現在利用可能なGitHub機能で反映し、対象pathと反映内容をpostverifyする。

Work Unit AのCocolon exact changed-path inventoryは次の15 pathsである。

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/05_cocolon_rule_file_index.md
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md
Cocolon_前提資料/manifest.json
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/03_forbidden_insufficient_premise_and_actual_file_check.txt
Cocolon_前提資料/work_attitude_rules_for_karen/08_artifact_delivery_rules.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/10_stop_judgment_and_unwritten_rules.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/work_attitude_rules_for_karen/manifest.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_GitHubReflectionContractCorrection_20260727.md
```

Work Unit Aは次を許可しない。

- 欠落S1 JSONの同時反映
- P1 capability proof
- deploy key、秘密鍵、SSH route、POSIX領域の要求
- candidate/Event1/readiness/reservation/attempt/terminalの発行または実行
- formal exact134 invocation
- S2、Event2、P2、Cycle001 acceptance
- Guardian再導入
- historical receipt/result/handoff bytesの変更

# 2. Confirmed facts and position correction

## 2.1 Confirmed facts at the inspected entry

```text
Cocolon current main:
7f29fadcadd3a3682a1243f5ed48149d40ae2a92

mashos-api current main:
61547113629ac3143be237ec79800da790c78970

Karen-Diary current:
700f749f5149cac1f8bd4bab8a364d524a56985b
```

`Cocolon_前提資料/07_latest_snapshot_diff.md`のcurrent tailは、欠落S1
JSONのpublicationへ次を要求している。

```text
expected-old direct child exact1 + full postfetch
```

post-D2 Parent Addendumとactive mashos-api exact64 causal testは、さらに
次をcurrent validityへ入れている。

```text
特定transport capability
server-side expected-old CAS
direct child
one tree / one commit
recursive full-tree read
all unchanged-path verification
durable write-once store capability
```

一方、current actual environmentではCocolonとmashos-apiへ書き込む作業者は
華恋だけであり、`11_cocolon_github_transport_and_session_continuity.md`
のGuardian retirement current sectionは、通常反映に必要な条件を
HEAD、approved scope、no force rewrite、postverification、unknown-result
no blind retryへ限定している。

## 2.2 Prior position

```text
欠落S1 JSONを反映するには、
expected-old ref transaction capabilityが必要である。

後続P1へ進むには、
durable write-once recovery storeをMash様が指定または提供する必要がある。
```

## 2.3 Corrected position

```text
repositoryへの成果物反映は、current GitHub機能で実行する。
special expected-old transportは必要条件ではない。
durable storeはGitHub reflectionの必要条件ではない。
```

## 2.4 Change basis

変更根拠は次の三つである。

1. Mash様が、変更するcontract条項と変更後の8条を明示し、独立した
   contract correctionとして承認した。
2. current actual environmentは華恋単独writerであり、仮想的な複数writerや
   future scaleをcurrent requirementへ昇格させる根拠がない。
3. 旧special transportは、対象content、authority、scope、hash、
   postverificationというNLSの非transport真実性を強くしたのではなく、
   current connectorで満たせない書込方法を正式性条件にして作業を停止した。

過去の判断と停止は当時のcurrent contractに従った記録として残す。
ただし、そのcontractをcurrentへ継続する根拠にはしない。

# 3. Cocolon GitHub reflection contract

## 3.1 作業者

1. Cocolonとmashos-apiへ書き込む作業者は華恋だけとする。
2. 書き込みは、Mash様が承認した作業範囲に限る。
3. 他の作業者が同時に書き込むことを、事実確認なしに前提へ入れない。
4. 将来の複数人作業や大規模運用を理由に、現在の書き込み条件を厳しく
   しない。

## 3.2 書き込み前に確認すること

華恋は書き込み直前に次だけを確認する。

1. 現在のGitHub最新版。
2. 承認された対象ファイル。
3. 新規ファイルなら、同一exact pathに既存ファイルがないこと。
4. 修正ファイルなら、現在の内容が作業時に確認した内容と一致すること。
5. 承認外のファイルを変更しないこと。

## 3.3 書き込み方法

1. 現在利用できるGitHub機能を使って書き込む。
2. 特定の鍵、通信方法、commandを必須にしない。
3. GitHub機能の都合で複数回の書き込みになることを許容する。
4. 一回の承認を必ず一つのcommitにまとめることを要求しない。
5. 承認されたファイル以外を混ぜない。
6. force rewrite、履歴書換え、承認外削除は行わない。

## 3.4 書き込み後に確認すること

1. 対象ファイルが存在すること。
2. 対象ファイルの内容が作成した成果物と一致すること。
3. 華恋の当該write commitに承認外pathが含まれないこと。
4. GitHubの最新版に承認された全成果物が含まれること。
5. 対象pathと華恋の当該write commitを確認できればよく、repository全体、
   全file、全unchanged pathを毎回取得・検証する必要はない。

## 3.5 作業を止める条件

華恋が停止してよいのは、次の事実が確認された場合だけとする。

1. 対象ファイルが、確認後に別内容へ変更されていた。
2. 承認外のファイルを変更しなければ完了できない。
3. GitHubへの書き込みが実際に失敗した。
4. 書き込み結果が成功か失敗か確認できない。
5. 書き込み権限が実際にない。
6. 削除、履歴書換え、承認外の不可逆操作が必要になった。

最新版が進んでも、対象pathに衝突がなければ最新版を読み直して続行する。
最新版が変わったことだけでは停止しない。

write結果が不明な場合は、最初に対象pathをGitHubから再取得する。

```text
作成予定bytesと一致:
SUCCESSとして扱い、retryしない

書込前の内容または新規path不存在を確認:
NOT_APPLIEDとして扱う

別内容または取得不能:
UNKNOWN_OR_CONFLICT_STOP
```

結果不明のまま同じtargetへ盲目的にretryしない。複数targetの一部だけが
成功した場合は、全targetを再取得し、同じ承認scope内で未反映が確認できた
targetだけを続ける。

## 3.6 必須にしてはいけない条件

次を通常のGitHub反映の必須条件にしてはいけない。

- 特定の秘密鍵が現在sessionに存在すること。
- 特定の書き込みcommandを使うこと。
- 特定のSSH、receive-pack、GitHub App、connector routeを使うこと。
- expected-old ref CASまたはexact leaseを使うこと。
- direct-child commitを作ること。
- one-tree / one-commitで完了すること。
- repository全体を毎回取得すること。
- 全fileまたは全unchanged pathを毎回検証すること。
- 複数作業者を前提にした競合防止機構。
- 将来の大規模運用を前提にした証明作業。
- durable write-once recovery storeが存在すること。
- 書き込み方法そのものを成果物の正式性条件にすること。

これらを利用できないことだけを理由に作業を停止してはいけない。

## 3.7 他資料との優先関係

`Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md`
のcurrent contractを、Cocolonとmashos-apiのGitHub反映方法および反映完了
判定の唯一の正本とする。

設計書、追加資料、test、成果物、receipt、handoff、後続計画は、この
contractを厳しく変更できない。このcontractより厳しいGitHub反映条件を
後続資料へ入れた場合、その条件はcurrentでは無効とする。

古いstrict transport条件だけを理由にactive testが失敗した場合、作業停止
理由ではなくtest側の不具合として扱う。「より安全になる」という理由でも
条件追加を認めない。

runtime product contract、artifact schema、hash、因果関係、owner graphは、
GitHub反映方法とは別の検証対象である。runtime側の要件をGitHub反映方法へ
逆輸入してはいけない。

## 3.8 変更権限

1. 華恋は、このcontractを独断で変更できない。
2. 設計作業の一部として変更できない。
3. testを通すために変更できない。
4. より厳しい条件を追加することもcontract変更とみなす。
5. 変更できるのは、Mash様が変更する条文と変更後の内容を明示し、別作業
   として承認した場合だけとする。
6. 他作業の承認へcontract変更を混ぜてはいけない。

# 4. Historical/non-normative disposition

## 4.1 Bytesを変更しない資料

次は当時のdesign、result、receipt、handoffとして保持する。current
GitHub reflection method、current stop condition、current next authorityを
決定しない。

```text
EmlisAIの実装済み資料/documents/
NLSv3_Step11_Cycle001_RecoveryEpoch001_AttemptConsumptionUnknownPostReservationRetryLineageAndFormalWorkerBootstrapNonconformance_EpochInvalidationAndRecoveryEpoch002_ParentDesign_ReadOnly_20260725.md

NLSv3_Step11_Cycle001_RecoveryEpoch001_AttemptConsumptionUnknownPostReservationRetryLineageAndFormalWorkerBootstrapNonconformance_EpochInvalidationAndRecoveryEpoch002_ParentDesign_ReadOnly_BodyFree_Receipt_20260725.json

NLSv3_Step11_Cycle001_RecoveryEpoch001_AttemptConsumptionUnknownPostReservationRetryLineageAndFormalWorkerBootstrapNonconformance_EpochInvalidationAndRecoveryEpoch002_ParentDesign_ReadOnly_Handoff_20260725.md

NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2SourceBaselineEligibilitySuccessorAndSuccessOwnerFormalParentContinuation_ParentAddendum_ReadOnly_20260726.md

NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2SourceBaselineEligibilitySuccessorAndSuccessOwnerFormalParentContinuation_ParentAddendum_ReadOnly_BodyFree_Receipt_20260726.json

NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2SourceBaselineEligibilitySuccessorAndSuccessOwnerFormalParentContinuation_ParentAddendum_ReadOnly_Handoff_20260726.md

NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2ParentAddendumExternalIdentitySourceClosureCompletionAndEvent1BindingContractCorrection_Design_ReadOnly_20260727.md

NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2ParentAddendumExternalIdentitySourceClosureCompletionAndEvent1BindingContractCorrection_Design_ReadOnly_BodyFree_Receipt_20260727.json

NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2ParentAddendumExternalIdentitySourceClosureCompletionAndEvent1BindingContractCorrection_Design_ReadOnly_Handoff_20260727.md

NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2SourceBaselineEligibilitySuccessionAcceptedStep0_10All11Event2AtomicSuccessOwnerGraphAndFormalParentContinuation_Remediation_RED_FreezeOnly_20260727.md

NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2SourceBaselineEligibilitySuccessionAcceptedStep0_10All11Event2AtomicSuccessOwnerGraphAndFormalParentContinuation_Remediation_RED_FreezeOnly_BodyFree_Receipt_20260727.json

NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2SourceBaselineEligibilitySuccessionAcceptedStep0_10All11Event2AtomicSuccessOwnerGraphAndFormalParentContinuation_Remediation_RED_FreezeOnly_Handoff_20260727.md

NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2SourceBaselineEligibilitySuccessionAcceptedStep0_10All11Event2AtomicSuccessOwnerGraphAndFormalParentContinuation_Implementation_Targeted_GREEN_And_SuccessorCompletion_Only_20260727.md

NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2SourceBaselineEligibilitySuccessionAcceptedStep0_10All11Event2AtomicSuccessOwnerGraphAndFormalParentContinuation_Implementation_Targeted_GREEN_And_SuccessorCompletion_Only_BodyFree_Receipt_20260727.json

NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2SourceBaselineEligibilitySuccessionAcceptedStep0_10All11Event2AtomicSuccessOwnerGraphAndFormalParentContinuation_Implementation_Targeted_GREEN_And_SuccessorCompletion_Only_Handoff_20260727.md
```

この分類は、過去に実行したRED `64 failed`、実装後のexact110 GREEN、
当時のcommit/blob/hash、当時の停止判断を否定しない。無効にするのは、
旧special transportをcurrentへ要求する効力だけである。

## 4.2 Carried-forward nontransport facts

旧資料からcurrentへ引き継ぐのは次だけである。

- historical D2 bytes、receipt、closure、commit identityは履歴として不変。
- Recovery Epoch002のsource baselineはまだ`UNLOCKED`。
- candidate、Event1、readiness、reservation、attempt、terminal、
  accepted、Step00..10、all11、manifest、Event2は未発行。
- successor source implementation exact10と、当時の
  historical46 + successor64 exact110 GREEN結果は存在する。
- body-free、canonical JSON、schema、logical/raw/blob hash検証を維持する。
- source、runtime、bootstrap、formal-node registry、owner graphの
  identityと因果関係を維持する。
- terminal exact134 outcome、accepted、Step00..10、all11、Event2の
  意味的lineageを維持する。
- ownerとindependent verifierを分離する。
- attemptを実行していないのに結果を合成しない。
- no automatic progression、P2 separate approval、Cycle001
  `NOT_ACCEPTED`を維持する。

# 5. Removed active transport gates

current design、implementation、testから次を正式性条件として除去する。

```text
EXPECTED_OLD_CAS_CAPABLE_GITHUB_TRANSPORT
EXPECTED_OLD_SHA_LEASE_WITH_VERIFIED_DIRECT_CHILD
expected_old_compare_and_swap
requested_expected_old_sha1
server_side_expected_old_applied
commit_parent_tree_and_recursive_read
recursive_tree_read
complete_unchanged_path_verification
full_changed_and_unchanged_postfetch_verification
ONE_TREE_ONE_COMMIT
SUCCESS_COMMIT_DIRECT_PARENT_T
EXPECTED_OLD_T_LEASE
FULL_POSTFETCH_AND_UNCHANGED_PATHS
OWNER_CONTROLLED_WRITE_ONCE_DURABLE_EVIDENCE_STORE
```

次のobjectまたはfieldは、GitHub reflectionのadmission、validity、
completion、stopを決める必須objectとして使用しない。

```text
transport_capability
transaction_capability
durable_store_capability
ref_update_mode
operational_admission as a transport/store proof gate
```

既に発行されたhistorical artifact内の文字列は変更しない。active code/testが
それらをcurrent requirementとして要求しない状態へ修正する。

runtime内のcheckpoint順序、monotonicity、source binding、観測捏造禁止は
GitHub transportとは別なので残す。ただし、外部のowner-controlled POSIX
storeまたはsessionを越えるstoreの指定・capability proofを、repository
reflectionまたは欠落JSON反映の前提にしない。

将来、実formal runのためにruntime persistence変更が必要になった場合は、
実観測されたruntime risk、変更対象、必要性を示した別作業として扱う。
その変更は§3のGitHub reflection contractを変更できない。

# 6. Active mashos-api remapping

## 6.1 Current active paths

次のcurrent source/testはtransport条件を実装しているため、Work Unit Aで
必要箇所だけを修正する。

```text
ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py
ai/services/ai_inference/emlis_ai_recovery_epoch002_accepted_test_run_receipt_v3.py
ai/tools/emlis_nls_v3_recovery_epoch002_atomic_publication_bundle_v3.py
ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py
ai/tools/emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py
ai/tools/emlis_nls_v3_recovery_epoch002_formal_worker_evidence_v3.py
ai/tools/emlis_nls_v3_recovery_epoch002_current_step_proof_run.py
ai/tests/test_emlis_nls_v3_recovery_epoch002_post_d2_success_owner_graph_and_formal_parent_continuation_red.py
```

他のproduction ownerへ変更を広げるのは、import、schema、call siteの
整合に本当に必要な場合だけとする。

`emlis_ai_recovery_epoch002_canonical_current_closure_v3.py`が旧Parent
Addendum exact10をimmutable historical ancestorとしてbindするだけなら、
そのbindingは残せる。旧文書内のtransport条項をcurrent validityとして
解釈してはならない。active test名変更またはmanifest再計算に伴う実変更が
必要な場合だけ、このownerを追加scopeへ含める。

## 6.2 Current/legacy route discriminator

active current reflection recordは次のmarkerで識別する。

```text
reflection_contract_version:
COCOLON_GITHUB_REFLECTION_CONTRACT_V1
```

markerがあるrecordは本書§3のcurrent routeで検証する。markerがない既発行D1 recordは`HISTORICAL_NON_NORMATIVE` legacy routeとして、当時のbytesと検証互換性を保持する。legacy routeのstrict transport fieldをcurrent recordへ要求しない。

## 6.3 Owner responsibility remapping

| current owner | remove | retain / replace with |
|---|---|---|
| sequence ledger | transport/durable capabilityをEvent/admissionのvalidityにする条件 | Mash authority、candidate/source/receipt lineage、body-free、self-hash |
| accepted-test-run receipt | expected-old/direct-parent/full-tree evidence | exact134実結果、source/runtime/bootstrap、reservation/terminal lineage |
| atomic publication bundle | one-tree/one-commit、expected-old lease、all-unchanged proof | approved exact15 membership、artifact bytes/hash、final current包含、write commit scope |
| independent closure verifier | transport provider class、CAS flag、recursive tree、durable provider | target existence/content/hash、approved target set、unapproved path exact0、semantic lineage |
| formal parent | P1 transport/store admission phaseとresource request | 明示authority、phase order、実write failure/unknown-result停止、no auto progression |
| formal worker evidence | expected-old/full-treeをformal result truthにする条件 | read-only source identity、exact134 observation、checkpoint/terminal semantics |
| current-step proof runner | readiness/reservation publication parent/lease条件 | accepted/Step proof lineage、current source identity |
| active exact64 test | old transport gateを正解とするoracle | §6.4のcurrent reflection contract oracle |

`operational_admission`がauthorityまたはscopeの情報を保持している場合でも、
transport/store capability receiptであることをvalidity条件にしない。
既存authority fieldで同じ意味を表せるなら、重複gateを作らない。

## 6.4 Exact64 case remapping

historical RED resultのold blobと`64 failed`記録は変更しない。current active
test pathはcontract correctionにより新しいblobになる。case ID
`C01..P08`とsuccessor count exact64を維持し、transport関連caseの意味を
次へ置き換える。

| ID | old active meaning | current meaning |
|---|---|---|
| C10 | operational admission exact20 + transport/durable proof | Mash authority、successor closure、candidate/Event1 semantic binding。transport/store proofは不要 |
| T10 | durable-store capability付きterminal publication | terminal targetのschema/bytes/hashとcurrent存在をpostverify |
| B08 | one tree / one commit | approved exact15は一回以上のbounded GitHub writeでよく、最終currentに全targetが存在 |
| B09 | success commit direct parent `T` | head advanceだけでは失敗しない。approved targetの実content conflictだけを拒否 |
| B10 | expected-old `T` lease | currently available GitHub functionを使用でき、特定transportを要求しない |
| B11 | full postfetch + all unchanged paths | approved target bytes/hashと華恋の当該write commitのchanged pathsを確認 |
| B12 | same frozen `S` reconciliation only | unknown時はtargetを再取得し、success/not-applied/conflictを分類してblind retryを禁止 |
| I05 | full Git graph/bytes/hash independent proof | target bytes/hash、approved path set、unapproved path exact0をindependent verify |

必要ならtest名を次へ変更する。

```text
test_c10_allocation_event1_owner_authority_and_current_reflection_contract
test_t10_terminal_target_content_postverified
test_b08_multi_commit_approved_scope_allowed
test_b09_non_target_head_advance_allowed_target_conflict_rejected
test_b10_current_github_function_transport_neutral
test_b11_target_bytes_hashes_and_write_scope_postverified
test_b12_unknown_result_refetch_before_retry
test_i05_target_bytes_hashes_and_scope_independent
```

旧test名、旧fixture、旧closed codeだけが原因でfailureになる場合は、
productionを旧contractへ戻さず、test/fixture/manifest側をcurrent contractへ
修正する。

## 6.5 Denominator and verification

current successor testはexact64を維持できる。したがって、

```text
historical D1 exact46
+ current successor exact64
= targeted exact110
```

を維持する。

Work Unit Aの実装後は少なくとも次を同一source snapshotで確認する。

1. current successor exact64。
2. historical D1 exact46。
3. cumulative targeted exact110。
4. active source/testに、§5の禁止markerをcurrent requirementとして残して
   いないこと。
5. schema/hash/body-free/owner graph/lineageの非transport testがgreenであること。
6. old historical document/receipt/result bytesを変更していないこと。

# 7. Current pointer switch

## 7.1 Rule owner and indexes

次をWork Unit Aのcurrent contractへ整合する。

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/05_cocolon_rule_file_index.md
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/03_forbidden_insufficient_premise_and_actual_file_check.txt
Cocolon_前提資料/work_attitude_rules_for_karen/08_artifact_delivery_rules.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/10_stop_judgment_and_unwritten_rules.txt
Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/work_attitude_rules_for_karen/manifest.json
Cocolon_前提資料/manifest.json
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_GitHubReflectionContractCorrection_20260727.md
```

manifestはcurrent ownership / status / indexを更新する。各write commitのpathと
remote blobは`07_latest_snapshot_diff.md`の実測evidenceで記録する。変更していない
historical fileは改変しない。

## 7.2 Execution Plan

`NLSv3_Step11_Cycle001_ExecutionAndClosurePlan_ReadOnly_20260723.md`の
既存§12.30～12.48は当時のledgerとして書き換えない。

末尾へcurrent correction entryを追加し、次を明記する。

```text
OLD EXPECTED-OLD / DIRECT-CHILD / FULL-TREE / DURABLE-STORE NEXT:
HISTORICAL_NON_NORMATIVE

CURRENT REFLECTION CONTRACT:
本書 + Cocolon_前提資料/11... current contract

CURRENT NLS STATE:
POST_D2_SUCCESS_OWNER_GRAPH_EXACT10_IMPLEMENTED_EXACT110_GREEN
S1_RESULT_ARTIFACT_PUBLICATION_PENDING

NEXT WORK:
Work Unit B exact1 only
```

## 7.3 Latest snapshot

`Cocolon_前提資料/07_latest_snapshot_diff.md`の既存tailは履歴として残し、
新current entryで次をsupersedeする。

```text
RETIRED NEXT:
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_POST_D2_S1_SUCCESSOR_CAUSAL_RED_RESULT_ARTIFACT_ISSUANCE_EXPECTED_OLD_PUBLICATION_AND_POSTVERIFICATION_REMEDIATION_ONLY

RETIRED PUBLICATION CONDITION:
expected-old direct child exact1 + full postfetch

CURRENT NEXT AFTER WORK UNIT A POSTVERIFICATION:
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH002_POST_D2_S1_SUCCESSOR_CAUSAL_RED_RESULT_ARTIFACT_PUBLICATION_AND_POSTVERIFICATION_REMEDIATION_ONLY

CURRENT PUBLICATION CONDITION:
current GitHub function + approved exact1 + target postverification
```

`07`は、本書、`11` current contract、mashos-api correction commit/test
result、historical/non-normative分類をcurrent pointerとして記録する。

## 7.4 Completion marker

Work Unit Aの完了markerは次とする。

```text
COCOLON_GITHUB_REFLECTION_CONTRACT_CURRENT_ACTUAL_ENVIRONMENT_REPLACED
ACTIVE_SPECIAL_TRANSPORT_GATES_REMOVED
ACTIVE_TARGETED_TESTS_GREEN
HISTORICAL_ARTIFACTS_PRESERVED
S1_RESULT_ARTIFACT_NOT_YET_PUBLISHED
AUTHORITY_STOP
```

Work Unit Aで欠落JSONを成功扱いしない。

# 8. Work Unit B: missing S1 JSON exact1

## 8.1 Exact target

```text
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2_Successor_RED_Result_20260726.json
```

Work Unit Bはこのexact1新規pathだけを対象とする。rule、design、
mashos-api source/test、他のCocolon documentを混ぜない。

## 8.2 Verified local source identity

検証済みZIP:

```text
Cocolon_S1_Successor_RED_Result_GitHubFallback_20260727.zip
```

ZIPはexact1 entryを含み、archive integrity testは成功した。

```text
entry count:
exact1

entry path:
EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch002_PostD2_Successor_RED_Result_20260726.json

byte count:
1045

raw SHA-256:
f03bf71f267813d25664ceacd1344d74fb354156a9c65b19c14a3c7f315e4c03

Git blob SHA-1:
fa2ac8978294e9eb92211147c09989ae7583455e

logical receipt SHA-256:
7b3b6d0890038642d69feb18e46630fbf97a5918fe0e95db766b8c8175e2d179

trailing LF:
exact1
```

logical hashは、JSONから`receipt_sha256`を除き、sorted-key compact
canonical JSONをtrailing LFなしでSHA-256計算した結果と一致する。

主要状態は次と一致する。

```text
schema:
cocolon.emlis.nls_v3.recovery_epoch002.post_d2_successor_red_result.v1

state:
SUCCESSOR_CAUSAL_RED_FROZEN

successor_node_count / collected / failed / passed / collection_errors:
64 / 64 / 64 / 0 / 0

owner_issue_codes / independent_issue_codes:
[] / []

body_free / automatic_progression:
true / false

successor test blob:
1616de8b9f738b7037b6e18a64113280fa6ec478
```

このJSONは、当時のS1 RED exact64実行を記録する欠落historical result
artifactである。そのため、Work Unit A後のcurrent active testが新しい
contractへremapされて別blobになっても、JSON内の旧test blobは変更しない。
旧blobをcurrent contract oracleへ戻す意味にはならない。

Cocolon entry
`7f29fadcadd3a3682a1243f5ed48149d40ae2a92`では、このexact targetは
GitHub API `404 NOT_FOUND`であり、新規pathとして不存在を確認した。
実write直前にcurrent mainで再確認する。

## 8.3 Write and postverification

1. current Cocolon mainを取得する。
2. target exact pathの不存在を確認する。
3. 現在利用できるGitHub機能でexact bytesを作成する。
4. write結果が返ったら、targetをGitHubから再取得する。
5. byte count、raw SHA-256、Git blob SHA-1、parsed schema/state、
   logical receipt SHA-256を確認する。
6. 華恋のwrite commitのchanged pathがtarget exact1だけであることを確認する。
7. current mainにtargetが含まれることを確認する。

この作業にexpected-old、direct-child、one-tree/one-commit、full
repository fetch、unchanged-tree proof、durable store proofを要求しない。

## 8.4 Work Unit B completion marker

```text
S1_SUCCESSOR_CAUSAL_RED_RESULT_ARTIFACT_PUBLISHED_AND_POSTVERIFIED
TARGET_EXACT1_PRESENT
TARGET_BYTES_HASHES_MATCHED
UNAPPROVED_WRITE_PATHS_EXACT0
CURRENT_MAIN_CONTAINS_TARGET
AUTOMATIC_PROGRESSION_FALSE
AUTHORITY_STOP
```

このmarkerはS1 result artifactのpublication gapだけを閉じる。
S2 successor completion、P1、candidate、Event1、formal exact134、
Event2、P2、Cycle001 acceptanceを完了しない。

# 9. Completion criteria for the over-safety correction

次の全てが成立した場合だけ、過剰安全条件を実運用上も解消したと判定する。

1. §3の8条が`11` current contractへ実際に置換された。
2. 複製rule、index、manifest、Execution Plan、`07` current pointerが整合した。
3. old Parent/Addendum/result/receipt/handoffが
   `HISTORICAL_NON_NORMATIVE`としてcurrent validityから切り離された。
4. active mashos-api owner/verifier/orchestrator/testが旧special transportを
   current validityへ要求しない。
5. nontransport exact64/exact46/exact110検証がgreenである。
6. Work Unit Aが通常のGitHub機能で反映され、対象pathとwrite scopeを
   postverifyできた。
7. Work Unit Bの欠落JSON exact1が同じ通常機能で反映された。
8. 欠落JSONのtarget bytes/hashとcurrent包含をpostverifyできた。
9. expected-old transportまたはdurable store不存在を理由に同じ停止を
   繰り返さなかった。

文書を更新しただけでは完了としない。active implementation/testの修正と、
欠落JSONの実反映・postverificationまでを完了条件とする。


# 10. Work Unit A mashos-api verified implementation evidence

実装sourceはlocal review commit `fa856de824610fb51bd9e9b417ba90fbe04f60a`で
確定し、通常のGitHub contents機能による8回のbounded writeでmainへ反映した。

```text
mashos-api baseline:
61547113629ac3143be237ec79800da790c78970

mashos-api current head after exact8 writes:
05e63ae05bb91f94725b0e6ef37a5bd9a76bcd8b

write commit and exact changed path:
298665c10f27cfee48038ada615c63a2a99f4c00  ai/services/ai_inference/emlis_ai_recovery_epoch002_accepted_test_run_receipt_v3.py
1826f723804c6ab8ae78eb0c41b2d993d45d4fe4  ai/services/ai_inference/emlis_ai_recovery_epoch002_sequence_ledger_v3.py
ce635d27b0fbd0c1c6cd65ac7866bdd7090e1f06  ai/tests/test_emlis_nls_v3_recovery_epoch002_post_d2_success_owner_graph_and_formal_parent_continuation_red.py
80cc2939360df853f9d070df8c09dc0564b73666  ai/tools/emlis_nls_v3_recovery_epoch002_atomic_publication_bundle_v3.py
e9449a2c7367ad80c642ebcfe12095fc9ad2ebed  ai/tools/emlis_nls_v3_recovery_epoch002_closure_receipt_verify.py
52e781f348578637ffd56ce52a1bd0163011cb07  ai/tools/emlis_nls_v3_recovery_epoch002_current_step_proof_run.py
ee89220f6c0421c067eb9dca2bd3d807574623d1  ai/tools/emlis_nls_v3_recovery_epoch002_formal_parent_orchestrator_v3.py
05e63ae05bb91f94725b0e6ef37a5bd9a76bcd8b  ai/tools/emlis_nls_v3_recovery_epoch002_formal_worker_evidence_v3.py
```

各commitはbase/head compareでtotal commit exact1、changed path exact1を確認し、
current mainの各target blob/contentをlocal `fa856de`と照合した。

```text
reflection marker:
COCOLON_GITHUB_REFLECTION_CONTRACT_V1

targeted C10/A06:
2 passed in 100.41s

subagent exact110:
110 passed in 455.41s

Karen independent exact110:
110 passed, 1 warning in 456.65s

semantic audit:
blocker exact0
```

このevidenceはWork Unit Aだけを成立させる。欠落S1 JSONのpublicationは
Work Unit Bまで未成立であり、P1、Event1、formal exact134、Event2、P2へは進めない。
