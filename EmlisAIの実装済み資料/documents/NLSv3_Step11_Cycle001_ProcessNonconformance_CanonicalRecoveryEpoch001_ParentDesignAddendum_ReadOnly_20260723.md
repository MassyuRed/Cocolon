---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_process_nonconformance_canonical_recovery_epoch001_parent_design_addendum
title: "NLS v3 Step 11 Cycle 001 Process Nonconformance Canonical Recovery Epoch 001 Parent Design Addendum"
revision_date: "2026-07-23"
status: "PARENT_DESIGN_ADDENDUM_FROZEN_READ_ONLY"
document_authority: "NLS_V3_STEP11_CYCLE001_PROCESS_NONCONFORMANCE_CANONICAL_RECOVERY_EPOCH_PARENT_DESIGN_ADDENDUM_READ_ONLY"
body_free: true
automatic_progression: false
cycle001_status: "NOT_ACCEPTED"
recovery_epoch_status: "DEFINED_NOT_STARTED"
---

# NLS v3 Step 11 Cycle 001 Process Nonconformance Canonical Recovery Epoch 001 Parent Design Addendum

## 0. decision

本addendumは、Revised Cycle Detailed Designが定めていないinitial-process nonconformance後の回復経路だけを補うscoped parent-design addendumである。既存Detailed Designを上書きせず、受入条件を緩和せず、過去の不足を遡及補完しない。

採用済みR5 routeを次のcanonical recovery epochとして定義する。

```text
RECOVERY_EPOCH_ID_DEFINED
HISTORICAL_ATTEMPT_PRESERVED
OLD_BATCH_NO_INITIAL_ACCEPTANCE_CREDIT
CURRENT_SOURCE_ONLY_A_CANDIDATE_PREDECESSOR
FRESH_EXACT100_REQUIRED
PRE_RUN_STEP0_10_CLOSURE_REQUIRED
INITIAL_LOCK_FULL_READ_CORRECTION_ORDER_REQUIRED
RECOVERY_EPOCH_DEFINED_NOT_STARTED
NLS_V3_METHOD_STOP_FALSE
CURRENT_B6_STOP_PRESERVED
CYCLE001_NOT_ACCEPTED
AUTOMATIC_PROGRESSION_FALSE
AUTHORITY_STOP
```

本authorityではsource、test、fixture、sample、manifest、runtimeを変更せず、test、exact100、Product Read、private body生成を実行しない。

## 1. precedence and fixed identity

| item | identity |
|---|---|
| normative parent | Revised Cycle Detailed Design / 132,892 bytes / SHA-256 `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc` |
| selected route receipt | blob `4090f57332d01523b8f15d413b85d37a07fc93c4` |
| Execution and Closure Plan | blob `bcf5f7313bfa7edd69b05720be9d0e44c7d5d4d1` |
| current authority at entry | blob `b60fb7288d980f80c1bd7074ba88a05757b8f194` |
| Cocolon entry | `0fa9cf72f36ceff5e179c6102c80c67440da75ad` |
| mashos-api entry | `c9739a0e2de5632d08607636656ada2f712c62b9` |

Precedence:

1. Revised Cycle Detailed Design。
2. 本addendumは、parentが未定義のprocess-nonconformance recoveryだけを補う。
3. Execution and Closure Planはnavigation surfaceであり、進行authorityではない。
4. actual receipt / source closureは実行事実を示し、設計要件を緩和しない。

parentと競合する場合は解釈で埋めず、`PARENT_DESIGN_CONFLICT_STOP`とする。

## 2. identity model

| identity | value | state |
|---|---|---|
| logical cycle | `NLS_V3_CYCLE_001` | `NOT_ACCEPTED` |
| historical attempt classification | `NLS_V3_CYCLE001_HISTORICAL_ATTEMPT_001` | `PROCESS_NONCONFORMING_HISTORY` |
| recovery epoch | `NLS_V3_CYCLE001_RECOVERY_EPOCH_001` | `DEFINED_NOT_STARTED` |
| reserved fresh batch | `NLS_V3_CYCLE001_RECOVERY_EPOCH001_BATCH_001` | `RESERVED_NOT_CREATED` |
| recovery source baseline | assigned by future P1 authority | `UNLOCKED` |
| formal initial run ID | assigned after fresh batch freeze | `UNALLOCATED` |

Historical classificationは既存file、batch ID、RC IDをrenameしない。navigation上の扱いを固定するだけである。

## 3. historical evidence disposition

### 3.1 retained

- current batch001 validation/freeze provenance。
- rc0010以降のmachine evidence、Product Read aggregate、correction lineage。
- rc0031/B6 diagnostics、tests、source、body-free receipts。
- Step 0–3 completion evidence、Step 4–10 source/test candidates。

### 3.2 not inherited as acceptance credit

- historical formal initial lock。
- historical initial exact100 full read。
- historical lock/full-read/first-correction sequence。
- historical Step 4–10 canonical completion。
- current B6 Product Readをrecovery epochのinitialまたはacceptance reviewとすること。

### 3.3 permitted future use

Historical valid casesはfresh initial denominatorへ含めない。recovery epochのinitial full read完了後に限り、別authorityでcumulative regression inputとして使用できる。historical body-free failure familyはrisk inventoryに使えるが、fresh review verdictを先取りしない。

## 4. recovery epoch state machine

```text
DEFINED_NOT_STARTED
  -> SOURCE_BASELINE_LOCKED
  -> STEP0_10_PREREQUISITES_PROVED
  -> FRESH_BATCH_DRAFT
  -> FRESH_BATCH_VALIDATED
  -> FRESH_BATCH_FROZEN
  -> INITIAL_RUN_LOCKED
  -> INITIAL_EXACT100_FULL_READ_COMPLETE
  -> CORRECTION_IN_PROGRESS | NO_TEXT_CHANGE_REQUIRED
  -> CUMULATIVE_RERUN_COMPLETE
  -> MANDATORY_REREAD_COMPLETE
  -> ACCEPTANCE_RECOMPUTED
  -> ACCEPTED | REJECTED | EPOCH_INVALIDATED
```

各transitionはappend-only receiptと前stateのartifact identityを必要とする。stateを飛ばさず、後発artifactで前stateを作らない。

## 5. gate order and authority split

| gate | purpose | allowed work | exit | automatic next |
|---|---|---|---|---|
| P0 parent addendum | recovery semanticsをfreeze | body-free design/receipt/handoff | `DEFINED_NOT_STARTED` | none |
| P1 source/prerequisite closure | source baselineとStep 0–10 current completionを証明 | source read、named test実行、body-free completion receipt生成のみ | `STEP0_10_PREREQUISITES_PROVED` | none |
| P2 fresh exact100 freeze | separate-ID corpusを作成・validate・freeze | local-only body生成/確認、validator/duplicate/novelty/coverage/privacy、body-free freeze receipt | `FRESH_BATCH_FROZEN` | none |
| P3 initial run lock | frozen sourceとbatchでexact100を一度実行・lock | run/lockのみ、review/correctionなし | `INITIAL_RUN_LOCKED` | none |
| P4 initial full read | 同じlocked exact100を12軸でcase-level全読 | private Product Read、body-free result | `INITIAL_EXACT100_FULL_READ_COMPLETE` | none |
| P5 correction decision | shared causeとownerを決定 | read-only design only | correction authorityまたはno-change authorityを一つ提示 | none |
| P6 correction/rerun | approved ownerだけを修正しcumulative rerun | new RC、tests、machine rerun | `CUMULATIVE_RERUN_COMPLETE` | none |
| P7 mandatory reread | changed/affected/history-risk rowsを読む | private review、body-free receipt | `MANDATORY_REREAD_COMPLETE` | none |
| P8 acceptance recomputation | §18.8とrecovery-specific条件を再計算 | read-only evidence audit | `ACCEPTED`またはSTOP | none |

一つのauthorityでP1〜P8を束ねない。各gate終了後は必ずSTOPする。

## 6. P1 source baseline and Step 0–10 prerequisite contract

### 6.1 source baseline

P1開始時のmashos-api head、relevant source/test/tool/config closure、Detailed Design hashを一つのbaseline IDへ固定する。現在の`c9739a...`はdesign時点candidateであり、本addendumだけではbaseline lockにならない。

### 6.2 Step receipt row

Step 0–10の各rowは次を全て持つ。

1. actual owner path/blob。
2. strict contract identity。
3. positive testと実行結果。
4. independent negative testと実行結果。
5. case/artifact receipt。
6. parent/source hash。
7. completion condition。
8. next-step authority。
9. 当該Stepの全STOP=false。

Step 0–3のhistorical receiptは、current baselineとcontract/hashが一致する場合だけ参照継承できる。Step 4–10はcurrent baselineに対するstandalone completion receiptを必要とし、historical completionへbackdateしない。

### 6.3 P1 STOP

- 一rowでも`NOT_PROVED / FAILED / CONFLICT`。
- named positive/negative testが実行不能または失敗。
- receipt生成にsource/test修正が必要。
- owner、contract、source closure、STOP判定が競合。

修正が必要ならP1内で直さず、body-free gap matrixと別remediation authority候補を一つ提示してSTOPする。

## 7. P2 fresh exact100 contract

### 7.1 identity and novelty

- reserved batch identityをmaterializeする。同名上書きは禁止。
- exact100はhistorical batch001のcaseを含めない。
- exact/normalized duplicate 0、unresolved near-duplicate 0。
- mere noun/verb substitutionをnew caseへ数えない。
- App-Reachable 100/100、coverage、privacy、expected-answer cue 0を満たす。

### 7.2 source separation

P1 source baselineをlockした後にfresh batchを作る。P2開始後からP4 full-read receipt完了まで、text-affecting source/test-fixture coupling/config/catalog/runner changeを禁止する。

source closureが変わった場合、そのfresh batchはinitial denominator資格を失い、body-free historyとして保持する。別batch IDとP1再実行なしに継続しない。

### 7.3 privacy and freeze

raw case body、raw output、private review note、parsed span、individual mapping、body digest、keyはGitHubへ出さない。private/local manifestとshareable body-free receiptを分離する。

Shareable receiptはepoch/batch ID、case ID/count、validation/coverage/novelty/privacy結果、freeze event、owner、source baseline IDだけを持つ。outputを見る前にfreeze receiptを確定する。

### 7.4 P2 STOP

- exact100、App-Reachable、duplicate/novelty、coverage、privacy、cue 0の一つでも不成立。
- source baseline drift。
- output生成がmanifest freezeより先行。
- historical caseまたはoutputをnew initial denominatorへ混入。
- private evidence境界を守れない。

## 8. P3 initial run lock contract

- P1 source baselineとP2 frozen batch identityが一致する。
- exact100を同じruntime adapter/runnerで実行する。
- reviewまたはcorrectionより先にcase-level initial resultをappend-only lockする。
- body-full outputはprivate/local、GitHubはbody-free summaryだけとする。
- execution、candidate、Gate、coverage、distribution、latency、local QA placeholderをcaseごとに復元可能にする。
- `formal_initial_run_locked=true`と`step10_smoke_only=false`をexplicit fieldで持つ。

P3ではProduct Read、source change、B6 remediationを行わない。

P3 STOP:

- 100件未満、重複case ID、exception evidence欠落。
- source/batch/runner drift。
- lock前にreview/correctionを開始。
- formal lockとsmoke境界が曖昧。

## 9. P4 initial exact100 full read contract

P3でlockedした同じ100 input/outputを華恋が12軸で全件読む。各case rowはcase ID、12-axis completion、severity、failed axes、closed reason code、shared-cause class、review stateを持つ。raw body/free text noteはprivate/localに留める。

Completion:

- exact100 rows。
- 12-axis complete 100/100。
- `not_reviewed=0`。
- shared-cause classification complete。
- P3 lock identityへのbinding。
- correction開始前のP4 receipt確定。

P4 STOP:

- missing/duplicate row、axis未確認、late review。
- locked outputとreview対象の不一致。
- correction/source changeがP4 completionより先行。

P4不成立時はbackfillせず、epochを`EPOCH_INVALIDATED`として別recovery epoch判断へ戻す。

## 10. sequence ledger

Shareable append-only ledgerは少なくとも次のeventを順序固定する。

| ordinal | event |
|---:|---|
| 0 | parent addendum frozen |
| 1 | source baseline locked |
| 2 | Step 0–10 prerequisites proved |
| 3 | fresh batch frozen |
| 4 | formal initial run locked |
| 5 | exact100 full read complete |
| 6 | first text-affecting correction authorized |
| 7 | first text-affecting correction committed |
| 8 | cumulative rerun complete |
| 9 | mandatory reread complete |
| 10 | acceptance recomputed |

各eventはepoch ID、state、timestamp、authority、repository/source closure、prior event identity、body-free artifact path/blobを持つ。body/digest/keyは持たない。ordinal 4/5/7の順序が崩れた場合、そのepochでacceptanceを回復しない。

## 11. correction, rerun, and B6 boundary

- P4完了後にだけfirst correction authorityを発行できる。
- text-affecting changeはnew RC IDを必要とする。
- correctionはcase ID/family/固有語 cue、fixed final text、required meaning削除を使わない。
- correction後はfresh exact100、permitted historical regression、Known regression、invalid-contract negativeを含むcumulative rerunを行う。
- current rc0031/B6はhistorical diagnostic/risk evidenceであり、recovery epoch P5へ自動継承しない。
- fresh P4が同じfailure familyを示した場合も、current outputに対して改めてownerを局所化する。
- B6 authorityはG1/G2 recovery evidence成立前に戻さない。

## 12. recovery-specific acceptance

Detailed Design §18.8の全条件に加え、次を全て満たす場合だけCycle 001 acceptanceを計算できる。

1. recovery epoch IDとfresh batch IDが一意。
2. P1 Step 0–10全row `PROVED`。
3. P1 source baselineからP4 receiptまで禁止drift 0。
4. fresh batch exact100がhistorical initial denominatorと重複しない。
5. sequence ledger ordinal 0–10が欠落・逆転なし。
6. formal initial lockとfull readがfirst correctionより前。
7. old attempt/batch/rc0010/B6 acceptance credit 0。
8. unresolved BLOCKER/MAJOR 0。
9. cumulative rerun、mandatory reread、change ledgerが再計算可能。
10. privacy/public boundary violation 0。

全条件成立時だけ`CYCLE001_ACCEPTED_UNDER_RECOVERY_EPOCH001`を記録できる。Cycle 002は別承認であり、自動開始しない。

## 13. invalidation and method STOP

### 13.1 epoch invalidation

- P1後P4前のrelevant source closure drift。
- freeze前output生成またはfreeze後case semantic replacement。
- formal initial lock前のreview/correction。
- full read完了前のtext-affecting correction。
- locked outputとreview対象の不一致。
- sequence ledgerの欠落/逆転/競合。

Invalidated epochはhistoryとして保持し、late artifactで修復しない。新epoch IDは別authorityでのみ発行する。

### 13.2 NLS v3 method STOP

Detailed Design §22.5の条件をそのまま用いる。本addendumはmethod STOP条件を追加・緩和しない。epoch process failureだけでmethod STOPへ昇格しない。

## 14. confirmed facts / inference / Karen opinion

### 14.1 confirmed facts

- historical G1/G2は不成立であり、R5 routeが選択済みである。
- current sourceはrecovery baselineとして未lockである。
- recovery batch、run、review、sequence ledgerは未作成・未実行である。
- Cycle 001は`NOT_ACCEPTED`、current B6はblockedである。

### 14.2 inference

current source/testはP1で再利用できる可能性がある。しかしcurrent closureに対するreceipt/test結果がない限り、再利用可能性をStep completionへ変換しない。

### 14.3 Karen opinion

華恋は、fresh batchを作る前にsourceとStep責任を固定し、outputを見るまでsourceを動かさない順序が必要だと判断する。これにより、過去の失敗を隠さず、次の100件から得た失敗を共通構造の修正へ正しく結べる。

## 15. repository/privacy boundary for this authority

- mashos-api変更: exact0
- Cocolon source/test/fixture/sample/manifest変更: exact0
- Detailed Design既存file変更: exact0
- test/exact100/Product Read/private body生成: 0
- API/DB/RN/runtime/public/shared route変更: 0
- GitHub反映: body-free addendum/receipt/handoff、receipt確認後のplan ledger、current authority appendだけ

## 16. next authority

次の別承認候補は一つだけである。

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_SOURCE_BASELINE_AND_STEP0_10_COMPLETION_RECEIPT_GENERATION_AND_VERIFICATION_ONLY
```

この候補はP1だけを扱う。current source/test/tool closure固定、既存named positive/negative test実行、Step 0–10 current completion receipt生成・検証を許可候補とする。source/test修正、fresh batch作成、exact100、Product Read、correction、B6へ自動進行しない。

STOP. Separate approval required.
