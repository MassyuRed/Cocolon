---
document_id: COCOLON_EMLISAI_NLS_V3_CYCLE001_REMAINING60_THREE_RESPONSE_EXECUTION_PLAN_V1
revision_date: 2026-08-14
status: MASH_ADOPTED_CURRENT_EXECUTION_PLAN
effective_when: SATISFIED_BY_MASH_EXPLICIT_START
adopted_on_jst: 2026-08-14
scope: CYCLE001_CURRENT100_REMAINING_WORK_ONLY
parent_plan: Cocolon_EmlisAI_NLSv3_Cycle001_010_CumulativeObservationProductQualityExecutionPlan_20260813.md
source_cocolon_head: 0386d0af5602f1cf828b396595c4136a3b439ddd
source_mashos_api_head: 6e8d42a6738f45f71fc6f00246fe54475c4c6b9c
decision_owner: Mash
execution_owner: Ultra Karen
target_execution_responses: 3
starting_progress_marker: APPROX_40_PERCENT
remaining_progress_marker: APPROX_60_PERCENT
body_policy: PRIVATE_BODY_FULL_AND_PUBLIC_BODY_FREE
automatic_cycle002_progression: false
---

# Cocolon EmlisAI NLS v3 Cycle001 残り60％・3回答分割実行計画

## 0. 結論

本計画は、Cycle001 current100の残り作業を、Ultra華恋の長時間処理落ちと
session切替リスクを考慮して、次の3回答へ分ける。

```text
第1回答:
  失われた後半実装の再構築
  + actual production / test / runnerの修正
  + focused検証
  + 可能な範囲のfresh exact100
  + GitHub上の完全な再開地点

第2回答:
  machine側のcurrent100収束
  + fixed closureのfresh exact100
  + 本文100件の12軸Product Read
  + shared product causeの最初の共通修正
  + GitHub上の完全な再開地点

第3回答:
  文章商品品質の共通修正ループ
  + current100再実行・再読
  + BLOCKER / MAJOR 0
  + 最終acceptance再計算
  + Cycle001完了のGitHub反映
```

進捗の目安は次とする。

```text
現在        = 約40％
第1回答後  = 約60％を目標
第2回答後  = 約80％を目標
第3回答後  = 100％を目標
```

この割合は作業分割の目安であり、Product Read PASS、machine credit、
Cycle acceptanceを割合から推測しない。actual resultに応じて各回答の作業配分は
Ultra華恋が調整する。

本計画は、親計画の「Cycle001はcurrent100が観測商品品質へ到達するまで反復する」
という商品条件を変更しない。変更するのは、Cycle001を一回答で終える前提だけである。

---

## 1. current固定事実

### 1.1 remote正本

```text
Cocolon:
0386d0af5602f1cf828b396595c4136a3b439ddd

mashos-api:
6e8d42a6738f45f71fc6f00246fe54475c4c6b9c
```

### 1.2 exact bytes回収結果

旧Workセッションに対する一回限りの回収確認は完了した。

```text
EXACT_BYTES_RECOVERY = COMPLETED
RESULT = EXACT_BYTES_NOT_RECOVERED
BASELINE_AFTER_RECOVERY = UNCHANGED
REPEAT_RECOVERY_CHECK = PROHIBITED
```

したがって、r1=`88/2/10/88`、r2=`92/0/8/92`は、
原因理解と再実装の参考には使えるが、current production、
再現可能なrun、正式なacceptance evidenceとしては使わない。

### 1.3 durable current actual

GitHubで再現可能なcurrent100の正式開始点は次である。

```text
valid corpus                       = 100
selected / no-valid / fail-close   = 45 / 2 / 53
output present / missing           = 52 / 48
PASS / MINOR / MAJOR / BLOCKER     = 0 / 2 / 40 / 58
Cycle001                            = NOT_ACCEPTED
current route                      = RETURN_TO_SHARED_STRUCTURAL_CORRECTION
```

### 1.4 引継ぎ済みの知識

後半で扱った共通修正family、machine failure family、runner evidence family、
途中Product Readで見えた文章品質問題は、Cocolonのcurrent handoffと
machine-readable checkpointに保存済みである。

ただし、引継ぎ資料は失われたsource bytesの代用品ではない。
Ultra華恋はactual sourceとfresh test resultから再設計・再実装する。

---

## 2. 本計画の設計粒度

本計画は、変更する関数、行番号、test node、実装順を完全固定しない。

固定するのは次だけである。

1. 各回答の目的。
2. 各回答で最低限増やすactual成果。
3. 回答終了時に失ってはいけないGitHub上の再開情報。
4. Cycle001の商品品質完了条件。
5. 禁止するdetour。

Ultra華恋はactual evidenceに応じて、次を判断してよい。

- shared causeの分け方と修正順。
- production owner、test owner、runner ownerの最小変更範囲。
- causal REDの形。
- focused testとregressionの組合せ。
- machine修正と文章品質修正を切り替える地点。
- 一つの原因を先に深く閉じるか、複数原因をまとめて閉じるか。
- response内で実施可能なexact100回数と再読範囲。
- coherentなcommit単位。

ただし、case ID、入力固有語、expected final text、固定応答による
production分岐は判断余地に含めない。

---

## 3. 3回答に共通する実行原則

### 3.1 商品へ直接接続する

許可する作業は次のいずれかに限定する。

```text
DIRECT_PRODUCT_OR_ACCEPTANCE_WORK
OBSERVED_BLOCKER_MINIMAL_FIX
MANDATORY_DAMAGE_PREVENTION
```

新checker、新controller、FD mechanism、proof-of-proof、G0–G10再監査、
追加authority chainは行わない。

### 3.2 actual fileを資料より優先する

各回答では、説明資料を作る前に、可能な限り次を実ファイルで進める。

- production source
- causal / product test
- runner / evidence implementation
- corpus・manifestに必要な既存file
- actual result generation

資料だけを増やして実ファイルが進んでいない状態を成果にしない。

### 3.3 通常REJECTは修正入力

次は回答を途中終了する理由ではない。

- focused test RED
- exact100のno-valid / fail-close
- Product Read BLOCKER / MAJOR
- naturalness REJECT
- distribution不良
- shared causeの追加発見

これらは同じ回答内で、時間とsession状態が許す限り修正ループへ戻す。

### 3.4 privacy

次はpublic GitHubへ出さない。

- raw input
- raw output
- 識別可能なparaphrase
- private review note
- HMAC key / commitment key
- secret / credential

public GitHubには、source、test、runner、body-free counts、reason codes、
identity、changed paths、再開条件だけを保存する。

---

## 4. 第1回答 — 再構築・実ファイル化・machine回復開始

### 4.1 目的

失われた後半実装を文章からコピーするのではなく、
`mashos-api@6e8d42a...`のactual sourceから再設計・再実装し、
次回答がGitHubだけから正確に続行できる状態を作る。

第1回答の主目的は、Cycle001のmachine側とrunner側を再び前進させ、
**今回こそactual bytesを失わないこと**である。

### 4.2 主な作業

Ultra華恋は、current handoffのchange familyとactual failureを読み、
必要なものから優先して扱う。

対象候補は概ね次である。

- owner / obligation / refined semantic unitのlineage。
- multiple unknownの分離とowner導入順。
- construction instance、slot、owner incidenceのforward / inverse。
- finite head、same-group base head、sentence partition。
- typed relation junction。
- dimension scopeとjoin parsing。
- candidate envelopeの独立再計算。
- exact100 runnerとbody-free evidence envelope。

これは実装チェックリストではない。
actual sourceを確認し、不要・重複・誤った候補は採用しなくてよい。

### 4.3 第1回答で優先する成果

優先順位は次とする。

1. causal failureを再現できるtest。
2. productionの共通構造修正。
3. inverse / independent checkの対応。
4. runner / evidenceの再実装。
5. focused tests。
6. 可能な範囲のfresh exact100と残存failure分類。

可能なら第1回答内でmachine `100 / 0 / 0`へ進む。
ただし、無理に見かけ上の100へ合わせるためにGate、意味責任、
Safety、Product Read条件を弱めない。

### 4.4 第1回答のGitHub反映

第1回答の出力前に、次を必ずGitHub上へ耐久保存する。

#### A. coherentな実装単位が成立した場合

- production / test / runnerのactual fileをcommit・pushする。
- focused test結果をbody-freeで保存する。
- current Cocolon stateへmashos-api head、changed paths、成立範囲、
  残存failure、次の一作業を反映する。
- remote bytes、changed paths、final headsをfresh確認する。

#### B. production currentとしてcommitできない途中状態の場合

壊れたproductionをcurrent mainへ昇格しない。
その代わり、Ultra華恋が最も安全で再開性の高い方法を選び、
次のいずれかをGitHubへ保存する。

- coherentなtest / runner単位だけを先に反映。
- exact lossless patch / bundleと適用preimageをrecovery artifactとして保存。
- current stateと一つのbounded handoffへ、exact paths、hash、
  成立test、未成立箇所、適用順を保存。

local worktree、chat本文、terminal bufferだけを再開根拠にしない。

### 4.5 第1回答の完了状態

計画上の目標状態は次である。

```text
SESSION_LATE_CHANGE_FAMILIES = REIMPLEMENTED_OR_EXPLICITLY_REJECTED
ACTUAL_SOURCE_TEST_RUNNER_BYTES = GITHUB_DURABLE
FOCUSED_CAUSAL_TESTS = EXECUTED
FRESH_EXACT100 = EXECUTED_IF_FEASIBLE
NEXT_RESTART_POINT = REMOTE_EXACT
APPROX_PROGRESS_MARKER = 60_PERCENT
```

第1回答の完了はCycle001完了ではない。
次回答がremoteだけから迷わず開始できることを完了条件とする。

---

## 5. 第2回答 — machine100件成立・全件Product Read・商品修正開始

### 5.1 目的

第1回答で保存されたactual sourceからmachine側のcurrent100を閉じ、
固定したclosureの本文100件を全読し、
文章商品品質のshared causeをactual outputから確定する。

### 5.2 主な作業

1. remote heads、actual changed files、前回答のcheckpointをfresh取得する。
2. 残存するno-valid、fail-close、exception、output missingを共通原因で修正する。
3. source closureを固定し、new run IDでfresh exact100を実行する。
4. machine状態を100件accountする。
5. outputが100件揃ったclosureを、本文100件・12軸で全読する。
6. BLOCKER / MAJOR / MINORをshared causeへ再分類する。
7. 読後品質を壊す共通ownerを修正する。
8. 可能な範囲で再実行・変更出力再読まで進める。

### 5.3 machine側の目標

第2回答では、原則として次を成立させる。

```text
valid                         = 100
output present                = 100
exception                     = 0
no_valid                      = 0
fail_close                    = 0
output missing                = 0
source / run identity         = RECOMPUTABLE
private / body-free pair      = DURABLE
```

Safety上の限定観測が必要なvalid inputも、無応答ではなく
商品として読めるvisible responseとしてaccountする。

### 5.4 Product Readの重点

第2回答では少なくとも次を確認する。

- 型説明語の列挙。
- 一律名詞化。
- modifierの機械連結。
- Receptionの再要約・重複。
- 単一sentence skeletonへの集中。
- typed OwnerPhraseの自然さ。
- dimension cueとReception layout。
- 主要意味保持、unknown保持、false understanding。
- 入力固有のEmlis reception。
- depth、density、main meaning dominance。

この一覧に拘束されず、actual100件から新しいshared causeが見えた場合は追加する。

### 5.5 第2回答のGitHub反映

出力前に、次をGitHubへ反映する。

- 第2回答で変更したactual production / test / runner。
- fresh exact100のbody-free identityとcounts。
- Product Read 100件完了のbody-free ledger / aggregate。
- shared cause familyと、実装済み・未実装の区分。
- current exact heads、changed paths、test結果。
- 第3回答のexact restart point。

第1回答と同じく、完成していないactual bytesをlocal-onlyにしない。
coherentなproduction commitが難しい場合は、losslessな再開artifactをGitHubへ置く。

### 5.6 第2回答の完了状態

計画上の目標状態は次である。

```text
CURRENT100_MACHINE_OUTPUT = 100 / 100
MACHINE_EXCEPTION_NO_VALID_FAIL_CLOSE = 0 / 0 / 0
BODY_FULL_PRODUCT_READ = 100 / 100
SHARED_PRODUCT_CAUSES = CLASSIFIED
PRODUCT_CORRECTION = STARTED_AND_GITHUB_DURABLE
NEXT_RESTART_POINT = REMOTE_EXACT
APPROX_PROGRESS_MARKER = 80_PERCENT
```

第2回答終了時にBLOCKER / MAJORが残っていても、
それをCycle001 PASSとは扱わない。
第3回答へ、actual sourceとcase-level causeをlosslessに渡す。

---

## 6. 第3回答 — 商品品質収束・最終100件・Cycle001受入

### 6.1 目的

本文100件のProduct Readで得たshared causeを、
case専用分岐なしで共通構造へ修正し、
current100件すべてを観測商品品質へ到達させる。

### 6.2 実行ループ

Ultra華恋は、次を必要な回数だけ反復する。

```text
Product Read failureをshared causeへ分類
→ causal RED / behavioral regression
→ common ownerの最小修正
→ focused test / regression
→ new run IDでcurrent100再実行
→ changed output全件再読
→ past BLOCKER / MAJOR全件再読
→ affected family / distribution再読
→ acceptance再計算
```

通常のProduct Read REJECTはterminalではない。
同じ回答内で修正ループへ戻る。

### 6.3 Ultra華恋の判断余地

第3回答では、actual failureに応じて次を判断してよい。

- Renderer、Discourse、AST、Reception、Parser、Matcher、Gate、
  Selector等のどのownerへ戻すか。
- naturalnessとsemantic preservationを一度に閉じるか、段階的に閉じるか。
- changed-output全件のほかに、どのcontrol / family / distributionを再読するか。
- final RCを発行する地点。
- isolated MINORを残せるか、共通原因として修正すべきか。

ただし、machineを通すために意味を削除すること、
generic fallback、固定応答、case cue、無応答は許可しない。

### 6.4 Cycle001完了条件

次をすべて満たした場合だけ、Cycle001完了を記録する。

```text
valid current samples                    = 100
output present                           = 100
exception / no-valid / fail-close        = 0 / 0 / 0
unresolved BLOCKER / MAJOR               = 0 / 0
current100 body-full Product Read        = COMPLETE
all changed outputs after final change   = REREAD
past BLOCKER / MAJOR after final change  = REREAD
case-specific branch                     = 0
fixed response / answer cue              = 0
private evidence                         = DURABLY_SAVED
public body-free evidence                = GITHUB_POSTVERIFIED
CYCLE001_OBSERVATION_PRODUCT_QUALITY_REACHED
```

共通原因を持つMINORは修正する。
孤立した局所MINORを残す場合は、商品利用を阻害せず、
同一clusterを作らないことをcase-level evidenceから説明する。

### 6.5 最終GitHub反映

第3回答の出力前に、少なくとも次を行う。

1. production / test / runnerのfinal actual bytesをmashos-apiへ反映。
2. final exact100のrun identityとbody-free resultを保存。
3. final Product Read ledger / aggregateを保存。
4. Cycle001 acceptanceを再計算。
5. Cocolon current stateをCycle001到達へ更新。
6. changed paths、remote bytes、Cocolon head、mashos-api headをfresh確認。
7. private本文・raw input/output・keyがpublicへ出ていないことを確認。

Cycle002は自動開始しない。

---

## 7. 各回答終了時の継続性contract

第1回答と第2回答は、途中工程であるため、
出力前のGitHub durable checkpointを必須とする。

ただし、checkpoint資料を増殖させない。

原則として次だけを使う。

1. actual code repositoryのcommitまたはlossless patch/bundle。
2. current stateの更新。
3. 必要な場合だけ一つのbounded body-free checkpoint / handoff。

各checkpointには次を含める。

```text
Cocolon head
mashos-api head
base / preimage
actual changed paths
各pathの状態
focused test result
latest exact100 run result if any
Product Read count if any
shared cause families
成立したもの
未成立のもの
private evidence location class
public body-free evidence path
次に最初に行う一作業
禁止する再開経路
```

次を再開根拠にしない。

- chatの説明だけ。
- 「だいたい直した」という記録。
- hashのない不明file。
- local-only worktree。
- session-reported aggregateだけ。
- 推測したr1 / r2 result identity。

---

## 8. 禁止事項

本計画の3回答では次を行わない。

1. exact bytes recoveryの再試行。
2. prior G4-B checker / controller / FD routeへの復帰。
3. G0–G10のproof-of-proof再実行。
4. 新しい安全専用system。
5. 新しい外部service、課金dependency、API、DB、RN機能。
6. case ID、batch ID、family、入力固有語によるproduction分岐。
7. fixed final text、固定fallback、expected answer cue。
8. machine GREENをProduct Read PASSへ変換すること。
9. 代表subsetだけで100件Product Readを置換すること。
10. raw input、raw output、private note、keyのpublic GitHub保存。
11. 文書だけを成果としてactual fileを後回しにすること。
12. response間の再開をMashの低レベル判断へ戻すこと。
13. 第3回答完了前のCycle002自動開始。

---

## 9. 各回答のユーザー向け報告項目

### 第1回答

```text
再実装したchange families
採用しなかったchange familiesと理由
production / test / runner changed paths
focused test結果
fresh exact100実行有無と結果
coherent commitまたはlossless recovery artifact
Cocolon / mashos-api heads
第2回答のrestart point
```

### 第2回答

```text
machine final counts
fresh run identity
Product Read 100 / 100
PASS / MINOR / MAJOR / BLOCKER
shared product cause families
実装済み商品修正
changed paths / tests
Cocolon / mashos-api heads
第3回答のrestart point
```

### 第3回答

```text
correction loop count
final exact100 result
final PASS / MINOR / MAJOR / BLOCKER
output present / missing
exception / no-valid / fail-close
changed-output reread count
past B-M reread count
anti-template result
Cycle001 acceptance result
Cocolon / mashos-api final heads
final changed paths
private / public evidence location
Cycle002 entry state
```

---

## 10. 親計画との関係

本計画は、親計画の次を維持する。

- current100が観測商品品質へ到達するまでCycle001を終えない。
- unresolved BLOCKER / MAJORを0にする。
- machineとProduct Readを分離する。
- common structural correctionだけを行う。
- body-full private / body-free publicを分離する。
- final materialをGitHubへ反映する。
- Cycle002へ自動進行しない。

本計画が限定的に置換するのは次だけである。

```text
parent:
Cycle001 = Ultra華恋の1回答

current scoped replacement:
Cycle001 remaining work = Ultra華恋の3回答
```

Cycle002–Cycle010の件数、累積評価、商品品質条件は変更しない。

---

## 11. 実行開始時の短い指示

### 第1回答

```text
@GitHub

Cycle001残り60％・3回答分割計画の第1回答を実行する。
0386d0af / 6e8d42aをremote正本とし、exact bytes回収は再試行しない。
失われた後半共通修正をactual evidenceから再設計・再実装し、
production / test / runnerを可能な限り進める。
出力前に、coherentな実ファイルまたはlosslessな再開materialと、
正確なcurrent stateをGitHubへ反映・postverifyする。
```

### 第2回答

```text
@GitHub

Cycle001残り60％・3回答分割計画の第2回答を実行する。
第1回答のremote checkpointから、current100のmachine収束、
fresh exact100、本文100件Product Read、shared product cause修正を進める。
出力前にactual files、run identity、Product Read結果、
第3回答のexact restart pointをGitHubへ反映・postverifyする。
```

### 第3回答

```text
@GitHub

Cycle001残り60％・3回答分割計画の第3回答を実行する。
current100の文章商品品質修正、再実行、再読、acceptance再計算を反復し、
unresolved BLOCKER / MAJOR 0、output100、machine failure0、
Cycle001観測商品品質到達まで完了する。
final actual filesとbody-free evidenceをGitHubへ反映・postverifyし、
Cycle002前で停止する。
```

---

## 12. 最終状態

第3回答終了時の目標は次である。

```text
CYCLE001_CURRENT100_OBSERVATION_PRODUCT_QUALITY = REACHED
VALID = 100
OUTPUT_PRESENT = 100
EXCEPTION / NO_VALID / FAIL_CLOSE = 0 / 0 / 0
UNRESOLVED_BLOCKER / MAJOR = 0 / 0
CASE_SPECIFIC_BRANCH / FIXED_RESPONSE = 0 / 0
ACTUAL_SOURCE_TEST_RUNNER = GITHUB_DURABLE
PRIVATE_BODY_FULL_EVIDENCE = DURABLY_SAVED
PUBLIC_BODY_FREE_EVIDENCE = GITHUB_POSTVERIFIED
CYCLE002 = NOT_STARTED
AUTOMATIC_PROGRESSION = FALSE
```

