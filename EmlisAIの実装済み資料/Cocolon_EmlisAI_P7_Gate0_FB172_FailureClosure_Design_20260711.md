# Cocolon / EmlisAI P7 Gate 0
# Full Backend 172 Failures 所有権分類・契約閉包 詳細設計書／実装順

- 作成日: 2026-07-11 JST
- 文書種別: 詳細設計書・実装順
- 設計状態: **DESIGN READY / IMPLEMENTATION NOT STARTED**
- 対象Phase: P7 Gate 0 current-input基盤閉包
- 対象snapshot: `mashos-api(210).zip`
- baseline archive SHA-256: `c2c155d82ba79d7a539efc1b45fd0f1497425b9c994bdc9010633e85917277fb`
- baseline source snapshot fingerprint: `88286e4499bcfa09d23d8db613f775a0890e2781cd22a2a7653badddaa50c340`
- baseline fingerprinted file count: `1353`
- 現在のGate 0停止: `GATE0_TEST_OR_CONTRACT_BLOCKED_STOPPED`
- 現在のP8判定: **NO_GO**
- 本書の実装出口: **V1〜V5 all green → same 16 actual read 16/16 → exact 8 packet生成 → 停止**
- API / DB / RN production変更: 本書の既定範囲ではなし
- Mash様による実機作業: exact 8 packetが生成されるまではなし
- JSON / schema案: 本書内で契約案だけを定義する。実ファイル化は実装時に必要性を再判定する
- CSV新規作成: なし

---

## 参照正本

### Cocolon側

- `Cocolon_前提資料(321).zip`
- `Cocolon_前提資料/00_karen_read_first.md`
- `Cocolon_前提資料/work_attitude_rules_for_karen/`
- `Cocolon_前提資料/01_cocolon_overall_structure.md`
- `Cocolon_前提資料/02_cocolon_national_system.md`
- `Cocolon_前提資料/02C_cocolon_contract_boundary_validation.md`
- `Cocolon_前提資料/07_latest_snapshot_diff.md`
- `Cocolon_前提資料/manifest.json`

### EmlisAI設計・実装資料

- `EmlisAIの実装済み資料(121).zip`
- `Cocolon_EmlisAI_GroundedAdaptiveObservation_CoreRepair_DetailedDesign_20260710(2).md`
- `Cocolon_EmlisAI_P7_Gate0_ReadfeelRepair_GateContractClosure_DetailedDesign_ImplementationOrder_20260711.md`
- `Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md`

### 最新実ファイル

- `mashos-api(210).zip`
- `Cocolon(289).zip`
- `ai/tests/Gate0_RR0_RR2_Result_20260711.md`
- `ai/tests/Gate0_RR3_RR6_Result_20260711.md`
- `ai/tests/Gate0_RR7_RR10_Result_20260711.md`
- `ai/tests/fixtures/gate0_rr8_validation_20260711.json`
- `ai/tests/helpers/emlis_ai_grounded_observation_i0_inventory.py`

`mashos-api(210).zip`は`mashos-api(209).zip`とbyte-identicalであり、今回の受領によってbackend内容が追加変更されたわけではない。したがって、本書は前提資料に記録された172 failuresと同じbaselineを設計起点とする。

---

## 0. 結論

本書は、既に完了したGate 0読感修復を作り直す設計ではない。

現在のofficial Gate 0検証では、V1〜V4が通過し、V5 full backendだけが172 failuresで停止している。本書は、その172件を件数だけ減らすのではなく、**各failureが現在どのownerのどの契約を検査すべきかを確定し、旧実装形状への依存と現行contractの実回帰を分離して閉じる**ための設計である。

実装全体は、次の一方向の工程として行う。

```text
official 172 failure refs + baseline fingerprint freeze
  → official実行条件と補助再現条件のfreeze
  → current canonical owner map確定
  → 172件をnode単位でprovisional classification
  → environment / order varianceを切り分け
  → 172件すべてのfinal classificationを確定
  → unresolved 0を確認
  → current ownerを保護する構造testをREDで追加
  → environment/order contaminationを最小修復
  → 旧owner期待testをcanonical ownerへ移管
  → exact本文期待を構造・意味・public contract assertへ移管
  → current contract実回帰だけをproduction修復
  → baseline 172 + repairで生じた新規failureを0へ閉包
  → sourceをfreeze
  → 同一final snapshotでV1 → V5を公式再実行
  → all green後にsame 16を再生成
  → 華恋が16件すべてを実読
  → 16 / 16合格時だけexact 8 packetを生成
  → GATE0_LOCAL_PASS_DEVICE_PACKET_READY_STOPPEDで停止
```

本設計で固定する最重要判断は次である。

```text
- 172 failuresを一括して「古いtest」と扱わない。
- 172 failuresを一括して「production bug」と扱わない。
- missing private helperや旧metaをproductionへ復活させない。
- stale testの中に残るvalid contractまで削除しない。
- exact完成本文を新しい正解本文へ置き換えてgreenにしない。
- skip / xfail / collection除外 / test削除だけでfailureを消さない。
- source全体の文字列存在をproduction reachabilityの証拠にしない。
- isolated passをofficial passへ読み替えない。
- official full-suite failureをisolated failureだけで説明したことにしない。
- ownerを説明できないfailureが1件でも残る状態で修復へ進まない。
- V1〜V5の途中でsourceが変わった場合、全validation evidenceを無効にする。
- V5がgreenでもsame 16 actual readを省略しない。
- exact 8生成後はP5 / P6 / P8へ進まず、Mash様の実機証拠待ちで停止する。
```

---

## 1. 現在地

### 1.1 official検証結果

最新実ファイルに記録された結果は次である。

| validation | official result | current state |
|---|---:|---|
| V1 compile / targeted | `186 passed / 41 subtests passed` | pass |
| V2 safety / public contract | `77 passed` | pass |
| V3 RN screen contract | `36 passed` | pass |
| V4 full collect | `12,700 collected / 0 errors` | pass |
| V5 full backend | `12,526 passed / 172 failed / 2 skipped / 41 subtests passed` | blocked |

body-free official evidence:

```text
schema:
  cocolon.emlis.gate0.validation.bodyfree.v2

source snapshot fingerprint:
  88286e4499bcfa09d23d8db613f775a0890e2781cd22a2a7653badddaa50c340

unclassified failure refs:
  172

validation all pass:
  false

gate0 stop code:
  GATE0_TEST_OR_CONTRACT_BLOCKED_STOPPED
```

### 1.2 RR9 / RR10の状態

次は未実施である。

```text
same 16 post-repair regeneration
same 16 deterministic recheck
Karen actual read 16件
new body-free review receipt
Gate 0 local pass decision
exact 8 packet
Mash様の実機確認
P5
P6
P8
```

旧`7 pass / 9 repair / 0 fatal`と旧`GATE0_REPAIR_RETURN_STOPPED`はpre-repair履歴であり、現行snapshotのactual read結果ではない。

### 1.3 current canonical production path

現行production正本は次の単一路である。

```text
normalize current input
  → Evidence Ledger
  → GroundedObservationPlan
  → GroundedSentencePlan / Grounded Surface
  → Grounded Observation Gate
  → ReplyEnvelope
  → public feedback meta sanitizer
  → emotion submit response
```

固定値:

```text
Grounded semantic version:
  cocolon.emlis.grounded_semantics.i2.v2

Canonical public generation path:
  grounded_observation_plan_sentence_surface_canonical_v1

Canonical composer source:
  grounded_plan_realizer

reply service public callable:
  render_emlis_ai_reply
```

現行`emlis_ai_reply_service.py`は、旧complete composer、旧recomposition、旧limited substantive route、旧post-final recoveryをpublic body生成へ接続していない。

### 1.4 設計時の補助再現

公式172 node IDを、受領backend tree上で同じ172件だけ選択して補助再実行した結果は次であった。

```text
collected: 172
failed:    170
passed:      2
```

isolatedでpassした2件:

```text
ai/tests/contract/test_api_contract_registry.py::test_registry_routes_exist_in_fastapi_app
ai/tests/contract/test_api_contract_registry.py::test_registry_routes_have_response_models
```

これはofficial V5を置き換える証拠ではない。official full suiteでは失敗し、isolated selectionではpassしたという差分だけを、**environment / order contamination候補**として扱う。

---

## 2. 確認した事実・根拠付き推測・華恋の意見

### 2.1 確認した事実

1. official failure refsは172件で、66 test fileに分散している。
2. `emlis_ai_reply_service.py`には、失敗testがmonkeypatch / importしようとしている多数の旧private symbolが存在しない。
3. I0 inventoryでは、旧complete composer、旧recomposition、旧limited substantive surface、旧low-information composer、旧fixed safe body等が`non_public_shadow`またはdiagnostic/test ownerとして分類されている。
4. 現行reply serviceのdirect substantive calleesは、current input、Evidence Ledger、Grounded Plan、Grounded Sentence Surface、Grounded Gate、Safety、Response Contract等である。
5. 多数の失敗は、`diagnostic_summary`、`multi_perspective`、旧step meta、旧runtime bridge、旧private helper、旧fixed body prefix等を期待している。
6. 一部の失敗testには、旧内部形状へのassertと、public sanitization・fail-closed・Safety・meaning retention等の現行でも有効なassertが同居している。
7. したがって、test file単位の一括削除ではvalid contractまで失う可能性がある。
8. P5 / P6は現行Gate 0後の工程であり、current reply metaではhold / pendingとして扱われ、runtime body routeへ接続されていない。
9. P8問いシステムは未開始であり、current question policyをtrueへ戻す根拠はない。
10. V1〜V4は同じofficial snapshotでpassしているため、172件の修復で既存targeted・Safety・public・RN契約を後退させてはならない。

### 2.2 根拠付き推測

1. 172件の相当部分は、D-I5 single cutover後も旧内部ownerを検査し続けるtestである可能性が高い。
2. ただし、旧内部ownerを参照するtestの中に、current Grounded ownerへ移すべき意味保持・public boundaryが残っている可能性が高い。
3. `diagnostic_summary`や`multi_perspective`のKeyErrorだけを見て旧metaを復活させると、single canonical pathの事実とpublic meta truthが再び分離する可能性が高い。
4. exact本文・prefix・特定語句を期待するtestは、現在の商品読感や意味保持を守るより、過去のsurface実装を固定している可能性が高い。
5. isolatedでpassしたAPI registry 2件は、app/module registryへのtest-order依存の変更、module cache、monkeypatch復元漏れ、global state汚染のいずれかである可能性がある。
6. 172件を修復すると、現在は先頭assertで隠れている二段目以降の失敗が同じnode IDから現れる可能性がある。
7. したがって、baseline node IDが一度別のassertで失敗しただけでは閉包せず、最終snapshotでpassし、valid obligationの移管も確認して初めてclosedとする必要がある。

### 2.3 華恋の意見

この172件は、単に「テストを直す仕事」ではない。

D-I5でproductionを一系統へ切り替えた後に、過去の段階的な実装・診断・回復経路・固定本文を検査するtestが残っているなら、正すべきなのはtestの所有権である。一方、current canonical ownerが本来守るべき意味・Safety・public visibilityを落としているなら、正すべきなのはproductionである。

両者を分けずに件数だけ0へ近づけると、次のどちらかになる。

```text
旧経路を復活させ、current architectureを壊す
または
valid contractまで削除し、greenだが何も守らないsuiteにする
```

そのため、華恋は**全172件のcurrent ownerを説明できる状態を、最初の成果物**とする。ownerを説明できない1件を残したまま、直しやすいtestから触ることはしない。

---

## 3. 最終目的・完了条件・非目的

### 3.1 Cocolon完成への接続

本作業はP8へ直接進むための作業ではない。

current-inputだけでEmlisが観測できる基盤について、局所testだけでなくfull backend全体との契約整合を閉じる。これにより、後続P5 / P6 / P7で観測される人間読感や問い必要性を、壊れた旧test契約・隠れたproduction回帰と混同しない状態を作る。

### 3.2 本作業の完了条件

```text
[baseline freeze]
- official 172 refsが重複・欠落なく固定されている。
- baseline archive hash、source fingerprint、official evidence hashが固定されている。
- official command / environment manifestが固定されている。

[ownership]
- 172件すべてにcurrent ownerが付与されている。
- primary classificationが全件に付与されている。
- valid protected contractが全件で説明されている。
- stale implementation detailとvalid obligationが分離されている。
- UNRESOLVED_STOP = 0。

[repair]
- missing旧private helperのproduction復活 = 0。
- old substantive routeのproduction reachability復活 = 0。
- exact完成本文assertの新規追加 = 0。
- skip / xfail / collection除外によるclosure = 0。
- current contract regressionだけがproduction修復されている。
- stale owner expectationはcanonical ownerへtest移管されている。
- environment/order varianceは汚染ownerが修復されている。
- baseline 172のclosure statusが全件closed。
- repair後のnew failure / regressionが0。

[validation]
- final source snapshotをfreeze。
- 同じfinal fingerprintでV1〜V5を順に実行。
- V1 green。
- V2 green。
- V3 green。
- V4 full collect 0 errors。
- V5 full backend failed 0 / errors 0。

[actual read]
- final validation snapshotと同じsnapshotでsame 16を再生成。
- deterministic 16 / 16。
- 華恋actual read 16 / 16 pass。
- repair required 0。
- hard fatal 0。

[exit]
- exact 8 packetをhelperから生成。
- exact 8以外の任意入力で代替しない。
- P5 / P6 / P8を開始しない。
- GATE0_LOCAL_PASS_DEVICE_PACKET_READY_STOPPEDで停止。
```

### 3.3 非目的

- P8問いシステムの設計・実装
- question policyの有効化
- 旧two-stage reception gateの復活
- 旧complete composer / limited composer / recompositionのpublic復活
- P5 / P6 runtime bridgeの接続
- API response key変更
- DB schema / write path変更
- RN screen production変更
- exact本文bankの作成
- 172件に含まれない機能追加
- test件数の維持自体を目的にした不要test複製
- 前提資料の差分更新
- GitHub commit / push / PR

---

## 4. 変更してはいけない不変条件

### 4.1 architecture

1. current-input意味正本は`GroundedObservationPlan`である。
2. public generation pathは`grounded_observation_plan_sentence_surface_canonical_v1`である。
3. composer sourceは`grounded_plan_realizer`である。
4. recoveryは同じGrounded Planの縮退であり、別substantive routeへの切替ではない。
5. `render_emlis_ai_reply`以外の旧reply service public callableを増やさない。
6. old complete / limited / recomposition / fixed safe body pathをproduction reachableへ戻さない。

### 4.2 external contract

1. API top-level response keysを変更しない。
2. DB physical schema / migration / write pathを変更しない。
3. RN visible contractを変更しない。
4. `input_feedback_comment`と`input_feedback_meta`の外部接続を維持する。
5. raw input、returned body、review commentをpublic metaへ入れない。
6. generation path、composer source、semantic gate等のbody-free truthを偽らない。

### 4.3 semantic / Safety

1. current inputにない診断、人格、原因、未来保証を追加しない。
2. self-denial fact boundaryを維持する。
3. help-seekingを安全保証へ広げない。
4. question system未開始の状態で質問本文へ逃げない。
5. required nucleus、required relation direction、lexical fidelityを後退させない。
6. Product Read Feelのhuman passを自動testだけで生成しない。

### 4.4 test closure

1. `skip`、`xfail`、marker除外を修復扱いしない。
2. collection対象から外すだけのrename / config変更を禁止する。
3. exact本文を別のexact本文へ置換しない。
4. old private symbolをcompatibility wrapperとしてproductionへ戻さない。
5. test file名が歴史的でも、中身はcurrent ownerへ移管できる。
6. test削除は、valid obligation 0を証明し、replacement mappingが不要である場合だけ例外的に許可する。
7. source-global token scanをruntime reachabilityの単独証拠にしない。

---

## 5. current owner map

172件の分類では、historical file名やtest名ではなく、次のcurrent owner mapを基準にする。

| responsibility | current canonical owner | 主な検証対象 |
|---|---|---|
| current input正規化 | `emlis_ai_current_input_bundle.py` | input boundedness、field normalization |
| evidence span / source binding | `emlis_ai_evidence_ledger_service.py` | source span解決、synthetic evidence禁止 |
| semantic nuclei / relation / response plan | `emlis_ai_grounded_observation_plan.py` | required meaning、relation direction、follow role |
| sentence plan / surface / same-plan recovery | `emlis_ai_grounded_sentence_surface.py` | binding、surface、recovery stage、決定性 |
| semantic/public Gate | `emlis_ai_grounded_observation_gate.py` | unresolved evidence、relation、lexical、public pass/fail |
| orchestration / public generation truth | `emlis_ai_reply_service.py` | canonical path、composer、trace、overlay、contract flags |
| response envelope contract | `emlis_ai_response_contract.py` | safe envelope、public status |
| Safety triage | `emlis_ai_safety_triage.py`、`emlis_ai_safety_boundary_service.py` | Safety owner、self-denial境界 |
| public meta sanitization / visibility | `emlis_ai_public_feedback_meta.py` | body-free meta、public include可否 |
| emotion submit接続 | `emotion_submit_service.py` | comment/meta response、display eligibility |
| P5 current state | reply service `p5_p6_overlay` + P5 readiness / gate owners | `human_qa_pending`、not applied |
| P6 current state | reply service `p5_p6_overlay` + P6 entry/gate owners | hold、not applied |
| runtime reachability inventory | `emlis_ai_grounded_observation_i0_inventory.py` | production / shadow / diagnostic / test分類 |
| RN visible contract | `Cocolon` RN model / screens / screen tests | key visibility、modal contract |
| API route registry | FastAPI app / registry contract tests | route existence、response model、global state isolation |

### 5.1 historical conceptからcurrent ownerへの対応

| historical expectation | current扱い |
|---|---|
| `diagnostic_summary`のphase timeline | public必須contractではない。必要なtruthはtop-level trace、grounded observation meta、public sanitizer、P5/P6 overlayへ分解する |
| `multi_perspective` public container | public必須形状ではない。meaning obligationはobserver / board / planのbody-free structureへ移管する |
| complete composer client / registry | public body ownerではない。negative reachabilityまたはdiagnostic-only検査へ移管する |
| initial recomposition adoption | Grounded Plan / Sentence Plan / Grounded Gateのcanonical pathへ移管する |
| post-final gate recovery private helper | same-plan recovery sequenceとGrounded Gateへ移管する |
| visible surface acceptance private helper | Grounded Gate + public feedback inclusionへ移管する |
| source bundle private builder | current input bundle + Evidence Ledgerへ移管する |
| expected relation private helper | Grounded Plan relation type / endpoint / directionへ移管する |
| low-information question body | current bounded observation / non-overclaim / question policy falseを検査する |
| P5/P6 runtime bridge | currentはhold / pending / overlay_applied=falseを検査する |
| fixed `見えたこと：` prefix | semantic binding、line role、public display可否へ移管する |
| old semantic material IDs | Grounded nuclei、semantic roles、relations、functional atomsへ移管する |

### 5.2 current ownerを認定する証拠

current ownerは、単に似た名前のmoduleを選んではならない。少なくとも次のうち2種類以上で認定する。

```text
A. production caller chain
B. I0 runtime reachability inventory
C. public API / emotion submit接続
D. current schema / version / generation path
E. current targeted testのprotected contract
F. body-free runtime evidence
G. design正本のsingle-cutover記述
```

次はcurrent owner証拠として不十分である。

```text
- source tree内に同じ語がある
- historical test名にphase名がある
- old helperと似た関数名がある
- 旧metaのfield名を再現できる
- exact本文が以前と同じになる
```

---

## 6. baseline freeze設計

### 6.1 目的

172 failuresが、修復中にtest名変更・assert移動・順序差によって見失われないようにする。また、後からfailure refsやbaselineを都合よく書き換えられないようにする。

### 6.2 freeze対象

```text
archive:
- mashos-api(210).zip SHA-256
- Cocolon(289).zip SHA-256
- premise archive SHA-256
- implementation material archive SHA-256

source:
- baseline source snapshot fingerprint
- fingerprinted file count
- owner source file SHA-256
- test / helper file SHA-256
- pytest config / requirements / env-affecting config SHA-256

validation:
- validation schema version
- official V1〜V5 result
- official validation artifact SHA-256
- exact 172 failure refs in original order
- official full backend command ref
- official return code / counts

execution environment:
- Python version
- pytest version
- plugin list and versions
- OS / architecture
- cwd
- environment variable names affecting app/test behavior
- xdist / worker count
- random seed / ordering plugin
- import mode
- command line

local auxiliary reproduction:
- selected 172 command
- selected 172 result hash
- isolated pass/fail outcome
- local runをofficial evidenceに使わないflag
```

### 6.3 baseline fingerprintとfinal fingerprint

二つを混同しない。

```text
baseline fingerprint:
  official 172 failuresが発生したsourceの証拠

final candidate fingerprint:
  修復完了後、V1〜V5とsame16を実行するsourceの証拠
```

修復でsourceが変わるため、final fingerprintはbaselineと同じである必要はない。

必要なのは次である。

```text
V1 fingerprint
= V2 fingerprint
= V3 fingerprint
= V4 fingerprint
= V5 fingerprint
= same16 generation fingerprint
= actual review fingerprint
```

### 6.4 freeze artifact案

実装時に実ファイル化する場合の短い候補名:

```text
fb172_freeze.json
fb172_env.json
```

長いCSVは作らない。表形式が必要でも、JSONまたは既存result markdownへ収めることを優先する。

### 6.5 body-free freeze schema案

```json
{
  "schema_version": "cocolon.emlis.gate0.fb172.freeze.bodyfree.v1",
  "cycle_id": "gate0_full_backend_172_closure_20260711",
  "baseline_archive_sha256": "64hex",
  "baseline_source_snapshot_fingerprint": "64hex",
  "baseline_source_snapshot_file_count": 1353,
  "official_validation_artifact_sha256": "64hex",
  "official_full_backend": {
    "command_ref": "RR8_V5_full_backend_20260711",
    "return_code": 1,
    "passed_test_count": 12526,
    "failed_test_count": 172,
    "skipped_test_count": 2,
    "passed_subtest_count": 41
  },
  "official_failure_refs": [
    "ai/tests/example.py::test_example"
  ],
  "official_failure_ref_count": 172,
  "official_failure_ref_sha256": "64hex",
  "environment_manifest_sha256": "64hex",
  "raw_input_included": false,
  "returned_surface_included": false,
  "comment_text_included": false
}
```

### 6.6 freeze完了条件

- official 172 ref countが172。
- duplicate ref 0。
- missing ref 0。
- official evidenceとのhash一致。
- source変更前に完了している。
- baseline freezeを後続artifactから参照できる。

---

## 7. failure分類モデル

### 7.1 primary classification

各baseline node IDへ、次のどれか一つをprimary classificationとして付ける。

```text
CURRENT_CONTRACT_REGRESSION
STALE_OWNER_EXPECTATION
EXACT_SURFACE_EXPECTATION
ENVIRONMENT_OR_ORDER_VARIANCE
UNRESOLVED_STOP
```

複数の性質がある場合は`secondary_tags`へ付ける。

例:

```text
primary:
  STALE_OWNER_EXPECTATION

secondary:
  EXACT_SURFACE_EXPECTATION
  REMOVED_PRIVATE_SYMBOL
  VALID_PUBLIC_SANITIZATION_OBLIGATION_REMAINS
```

### 7.2 `CURRENT_CONTRACT_REGRESSION`

次をすべて満たす場合だけ認定する。

1. 期待している契約がcurrent正本に存在する。
2. old private shapeやexact bodyから独立して表現できる。
3. current canonical path上で再現する。
4. body-free structural / semantic / public testでREDにできる。
5. current production ownerを説明できる。
6. production修復なしではvalid contractを満たせない。

修復方針:

```text
current ownerへ最小production修復
+ current-owner RED test
+ old owner復活なし
```

### 7.3 `STALE_OWNER_EXPECTATION`

次を満たす場合に認定する。

1. failureが旧module、旧private helper、旧internal meta、旧runtime bridgeを期待している。
2. そのownerはcurrent production reachabilityにない、またはpublic正本ではない。
3. testが守るべきvalid riskを抽出できる。
4. valid riskをcurrent canonical ownerで検査できる。
5. productionを変えずにcurrent contractを確認できる。

修復方針:

```text
old assertionを削除
→ valid riskをcurrent ownerへ移管
→ old ownerがproduction absentであるnegative assertionを必要に応じて追加
```

### 7.4 `EXACT_SURFACE_EXPECTATION`

次を含むfailureを対象とする。

```text
body == fixed text
body.startswith(fixed prefix)
fixed phrase in body
fixed line count tied to old composer
old semantic material IDだけを期待
old display labelだけを期待
```

ただし、単に削除しない。まずexact surfaceが何を守ろうとしていたかを分解する。

```text
required meaning
relation direction
Safety boundary
non-overclaim
public visibility
meta sanitization
question prohibition / allowance
line role
source span coverage
```

修復方針:

```text
exact surface assert
→ structural / semantic / public contract assert
```

完成文の自然さはsame16 actual readで確定し、自動testで偽装しない。

### 7.5 `ENVIRONMENT_OR_ORDER_VARIANCE`

次の条件を満たすfailureを対象とする。

```text
official full suite: fail
clean isolated process: pass
```

この差だけでは分類完了ではない。次を特定する。

```text
- contaminating predecessor
- mutated global / module / registry / environment
- fixture teardown漏れ
- module cache差
- app import order差
- worker / parallelization差
```

修復方針:

```text
product contractを変更せず、汚染ownerを最小修復
```

### 7.6 `UNRESOLVED_STOP`

次の場合に使用する。

- current ownerを説明できない。
- design正本と実ファイルが矛盾する。
- valid contractとstale detailを分離できない。
- official環境を再現できず、environment varianceを確定できない。
- API / DB / RN production変更が必要に見えるが、影響設計がない。
- current contractそのものをMash様の判断なしに変更する必要がある。

`UNRESOLVED_STOP`が1件でもあれば、classification後の修復工程へ進まない。

### 7.7 symptomとclassificationを分ける

次はsymptomであり、classificationではない。

```text
KeyError
a missing attribute
ImportError
AssertionError
fixed text mismatch
None returned
source token present
isolated pass
```

同じ`KeyError: diagnostic_summary`でも、testごとにvalid protected contractが異なる。symptom countだけで一括修正しない。

---

## 8. owner解決手順

各node IDを次の順で解析する。

### O1. failure pointを固定

- official traceback / assertion lineを記録する。
- local auxiliary runのfailure pointを別に記録する。
- officialとlocalのfailure pointが異なる場合、差分を未解決のまま進めない。

### O2. test内の全obligationを列挙

最初に落ちたassertだけを見ない。

```text
setup obligation
monkeypatch target
production call
internal meta assertion
public payload assertion
Safety assertion
exact body assertion
negative leak assertion
```

一つのtestに複数obligationがあれば、各obligationを別recordにする。

### O3. historical ownerを特定

- import / monkeypatch対象
- expected meta key
- exact bodyの生成元
- old phase design
- test作成時のruntime route

### O4. current contractを照合

次のいずれかを確定する。

```text
current contract still exists
current contract moved to another owner
current contract intentionally retired
current contract unknown
```

### O5. valid protected riskを抽出

例:

```text
old assertion:
  diagnostic_summary["step10..."] exists

valid protected risk:
  failed canonical artifact is not publicly displayed
```

または:

```text
old assertion:
  comment starts with "見えたこと："

valid protected risk:
  required future intention remains represented without overclaim
```

### O6. current owner proofを作る

最低2種類の証拠でcurrent ownerを確定する。

### O7. classificationを付ける

primary classificationとsecondary tagsを記録する。

### O8. planned closureを定義

```text
test-only migration
production repair + test migration
environment isolation repair
unresolved stop
```

### O9. hidden obligationを考慮

先頭assertを直した後、同じnode IDが別のassertで失敗する可能性を記録する。

baseline nodeは次を満たすまでclosedにしない。

```text
- final snapshotでpass
- valid obligation移管済み
- prohibited old owner復活なし
```

---

## 9. owner ledger設計

### 9.1 ledgerの役割

172件を「修正済み件数」だけで管理せず、baseline failureからfinal evidenceまで追跡する。

### 9.2 artifact案

実ファイル化する場合の短い候補名:

```text
fb172_ledger.json
fb172_batches.json
```

### 9.3 ledger schema案

```json
{
  "schema_version": "cocolon.emlis.gate0.fb172.owner_ledger.bodyfree.v1",
  "cycle_id": "gate0_full_backend_172_closure_20260711",
  "baseline_freeze_sha256": "64hex",
  "baseline_source_snapshot_fingerprint": "64hex",
  "record_count": 172,
  "classification_counts": {
    "CURRENT_CONTRACT_REGRESSION": 0,
    "STALE_OWNER_EXPECTATION": 0,
    "EXACT_SURFACE_EXPECTATION": 0,
    "ENVIRONMENT_OR_ORDER_VARIANCE": 0,
    "UNRESOLVED_STOP": 0
  },
  "records": [
    {
      "failure_ref": "ai/tests/example.py::test_example",
      "official_outcome": "failed",
      "official_failure_signature_sha256": "64hex",
      "auxiliary_isolated_outcome": "failed",
      "symptom_family": "removed_private_symbol",
      "historical_owner_refs": [
        "emlis_ai_reply_service._old_private_helper"
      ],
      "current_owner": {
        "module": "emlis_ai_grounded_observation_gate",
        "symbol_or_contract": "evaluate_grounded_observation_gate",
        "reachability": "production_reachable"
      },
      "current_owner_evidence_refs": [
        "i0_runtime_owner:grounded_gate",
        "caller_chain:reply_service_to_grounded_gate"
      ],
      "valid_protected_obligations": [
        "failed_grounded_artifact_not_publicly_displayed"
      ],
      "stale_implementation_details": [
        "old_private_helper_name"
      ],
      "primary_classification": "STALE_OWNER_EXPECTATION",
      "secondary_tags": [
        "REMOVED_PRIVATE_SYMBOL"
      ],
      "planned_change_scope": "test_only_migration",
      "production_change_allowed": false,
      "replacement_assertion_refs": [
        "current_grounded_gate_fail_closed"
      ],
      "prohibited_action_refs": [
        "do_not_restore_old_private_helper"
      ],
      "closure_status": "classified_not_repaired",
      "attempts": [],
      "final_evidence_refs": []
    }
  ],
  "raw_input_included": false,
  "returned_surface_included": false,
  "comment_text_included": false
}
```

### 9.4 attempt record

同じnodeで別assertが露出した場合、上書きせずattemptを追加する。

```json
{
  "attempt_index": 2,
  "working_source_snapshot_fingerprint": "64hex",
  "observed_failure_signature_sha256": "64hex",
  "obligation_ref": "public_meta_must_be_body_free",
  "action_ref": "migrate_assert_to_public_feedback_sanitizer",
  "result": "passed"
}
```

### 9.5 ledger整合条件

- baseline ref 172件をexact coverage。
- duplicate ref 0。
- primary classification未設定 0。
- current owner未設定 0。
- valid protected obligation空欄 0。ただし「valid obligationなし」を証明したexplicit codeは許可。
- production change allowedは`CURRENT_CONTRACT_REGRESSION`だけtrueにできる。
- `UNRESOLVED_STOP > 0`ならrepair gate false。

---

## 10. category別の修復設計

## 10.1 current contract regression

### 10.1.1 実装前条件

productionを触る前に、次を満たすcurrent-owner RED testを作る。

```text
- exact body非依存
- old private helper非依存
- current canonical path経由
- protected contractが一つに絞られている
- baseline sourceでRED
- 修復後にGREEN
```

### 10.1.2 production変更候補

必要性が証明された場合だけ、次を候補とする。

```text
emlis_ai_current_input_bundle.py
emlis_ai_evidence_ledger_service.py
emlis_ai_grounded_observation_plan.py
emlis_ai_grounded_sentence_surface.py
emlis_ai_grounded_observation_gate.py
emlis_ai_reply_service.py
emlis_ai_response_contract.py
emlis_ai_public_feedback_meta.py
emotion_submit_service.py
emlis_ai_safety_triage.py
emlis_ai_safety_boundary_service.py
```

`emlis_ai_reply_service.py`を変更する場合も、旧phase summaryやcompatibility private helperを追加しない。current canonical orchestration truthだけを修復する。

### 10.1.3 最小修復の定義

```text
- current contractを満たす最小source差分
- new public key 0
- new DB write 0
- RN production差分 0
- old route reachability増加 0
- case / fixture / exact body分岐 0
```

## 10.2 stale owner expectation

### 10.2.1 test migration certificate

各移管で次を記録する。

```text
historical test / assertion
why historical owner is stale
valid protected risk
current canonical owner
new structural/public assertion
negative assertion against old owner restoration
old node → new node mapping
```

### 10.2.2 private monkeypatch移管

禁止:

```python
monkeypatch.setattr(emlis_ai_reply_service, "_removed_private_helper", ...)
```

移管先の例:

```text
- current input normalization boundary
- Grounded Plan builder
- Grounded Surface recovery stage
- Grounded Gate decision
- public feedback sanitizer
- emotion submit public inclusion
```

private関数そのものをtest ownerにせず、可能な限りpublic / module-level canonical contractを検査する。

### 10.2.3 historical filename

ファイル名を残す場合は、docstringへlineageを明示する。

```text
Historical filename retained for lineage.
Current assertions target the Grounded canonical owner.
This test does not restore the former substantive route.
```

## 10.3 exact surface expectation

### 10.3.1 exact textから抽出する軸

| old exact expectation | replacement axis |
|---|---|
| fixed prefix | line role / section contract / public display eligibility |
| fixed phrase | required nucleus / lexical evidence span / non-overclaim |
| fixed complete body | semantic nuclei + relation + binding + Gate |
| fixed question sentence | question policy / bounded observation / P8 hold |
| old semantic ID | Grounded semantic role / functional atom |
| fixed line count | required coverage + max-bound + no duplicate line |

### 10.3.2 exact textを残してよい範囲

次のような外部固定文字列は別である。

```text
API key name
schema version
public enum
RN title contract
reason code
```

商品本文の完成文は固定しない。

### 10.3.3 human readへの責務移管

自然さ、重複感、詰問感、テンプレ感はsame16 actual readで判定する。自動testは構造・意味・Safety・public boundaryを守り、人間読感の代行をしない。

## 10.4 environment / order variance

### 10.4.1 official再現条件

API registry 2件について、次を順に行う。

```text
1. clean subprocessで2件のみ
2. official full-suite commandの先頭から対象直前まで + 2件
3. module単位prefix追加
4. binary searchでcontaminating predecessorを絞る
5. randomized orderで再現率を確認
6. worker / xdist条件を合わせる
7. module cache / app registry / monkeypatch teardownを比較
```

### 10.4.2 environment manifest

```json
{
  "schema_version": "cocolon.emlis.gate0.fb172.environment.bodyfree.v1",
  "python_version": "x.y.z",
  "pytest_version": "x.y.z",
  "plugins": [],
  "os": "...",
  "architecture": "...",
  "cwd": "relative/ref",
  "command_ref": "...",
  "worker_count": 1,
  "import_mode": "...",
  "random_seed": "...",
  "env_var_name_refs": [],
  "env_values_included": false
}
```

秘密値は入れず、環境変数名とset/unsetだけをbody-freeに記録する。

### 10.4.3 修復対象

想定候補:

```text
fixture teardown
monkeypatch restore
FastAPI app singleton mutation
route registry global mutation
module reload dependency
shared cache reset
```

product route / response modelを、order-dependent failureに合わせて変更しない。

## 10.5 unresolved stop

ownerを説明できない場合、次を行わない。

```text
- guessed production patch
- expected valueの緩和
- test削除
- blanket compatibility meta追加
```

必要情報を明示し、そこで停止する。Mash様の判断が必要なのは、current product contract自体を変更する場合だけであり、単なるsource調査をMash様へ押し返さない。

---

## 11. failure family別の具体設計

以下は設計時の表層症状から作る初期laneであり、final classificationではない。

## 11.1 `diagnostic_summary` family

観測された主なfailure:

```text
KeyError: diagnostic_summary
old phase / step summary absent
old rollout / scorecard / composer timeline absent
```

方針:

1. old summary keyをproductionへ戻さない。
2. testごとに、守っていたriskを分解する。
3. public pass/failはGrounded Gate / response contractへ移管する。
4. generation truthは`generation_path`、`composer_source`、`trace`へ移管する。
5. P5 / P6状態は`p5_p6_overlay`へ移管する。
6. old diagnostic-only timelineが商品contractでない場合、negative absenceまたはtest-only diagnostic ownerへ移す。
7. Safetyやpublic sanitization assertionが同居する場合は残す。

## 11.2 `multi_perspective` family

方針:

- public meta containerを復活させない。
- multiple semantic viewsが必要な契約は、observer / perspective board / Grounded Planのnuclei・relationsで検査する。
- publicへ露出すべきでない内部viewはbody-free / non-publicのまま維持する。
- old `multi_perspective` key存在だけを検査するassertは移管する。

## 11.3 removed private symbol family

例:

```text
_reply_service_gate_recovery_public_boundary_decision
_build_visible_surface_acceptance_report_for_candidate
judge_listener_readability
_expected_relation_types_for_reader
build_emlis_ai_source_bundle
_step10_repair_runtime_block_reason
_build_runtime_surface_pre_return_report_for_candidate
recover_emlis_gate_failure
_should_attempt_post_final_gate_recovery
```

方針:

- productionへsymbolを戻さない。
- monkeypatch対象をcurrent canonical boundaryへ移す。
- private実装呼出回数ではなく、observable contractを検査する。
- old symbol absentをI0 / source owner testで確認する。

## 11.4 exact body / fixed prefix family

代表的な旧期待:

```text
SCOPED_PASSING_TEXT
"見えたこと：" prefix
specific low-information question
specific reception wording
```

方針:

- exact本文を削除するだけでなく、valid semantic/public obligationを抽出する。
- required nuclei、relation direction、question policy false、public meta sanitized、Safety boundednessへ移管する。
- current bodyの自然さはsame16で読む。

## 11.5 old semantic material ID family

方針:

```text
old material ID
→ Grounded nucleus kind / modality / semantic role
→ relation type / endpoint direction
→ SentenceBinding functional atoms
```

old ID名をcompatibility fieldとして追加しない。

## 11.6 P5 / P6 runtime bridge family

current state:

```text
P5 formal human QA: not started
P6 structure insight: hold
p5_p6_overlay.overlay_applied: false
```

方針:

- reply serviceへP5/P6 builder import / callを戻さない。
- current hold、pending、no visible applicationを検査する。
- P5/P6候補moduleの単体契約は、それぞれのowner testで維持する。
- Gate 0 pass前のruntime接続を禁止するnegative regressionへ移管する。

## 11.7 low-information / two-stage / question family

current P8はNO_GOである。

方針:

- old question sentenceを戻さない。
- current inputだけでbounded observationを返す。
- material不足時のnon-overclaim、limited status、public fail-closedを検査する。
- question policyがfalseであることをcurrent meta / plan contractで確認する。
- P8問いUXの期待をGate 0 testへ混在させない。

## 11.8 static source / callgraph family

方針:

- source tree全体にtokenがあるだけでproduction reachabilityとしない。
- import graph、direct caller、public routeからの到達性で判定する。
- diagnostic/test/fixture内のhistorical tokenは、production routeと分離する。
- I0 inventoryをcurrent ownerとし、source-global grep testをscope限定する。

## 11.9 public emotion-submit / display family

current owner:

```text
render_emlis_ai_reply
→ build_public_emlis_input_feedback_meta
→ should_include_public_input_feedback
→ emotion submit response
```

保護する契約:

- commentとmetaの接続
- passed-only visibility
- fail-closed
- raw input / body leakなし
- generation truth
- Safety boundary
- top-level API key不変

旧internal metaの存在は保護契約にしない。

## 11.10 API registry order-variance family

isolated passをproduction passとしない。official full-suite失敗の污染元を特定し、fixture/global state ownerを修復する。

---

## 12. test migration設計

### 12.1 migration単位

test file単位ではなく、**obligation単位**で移管する。

一つのold testを次のように分割してよい。

```text
old test:
  old internal meta exists
  + public meta sanitized
  + unsafe body not displayed

new tests:
  current canonical generation truth
  public meta sanitizer body-free
  failed gate not displayed
  old internal meta not required / not restored
```

### 12.2 migration receipt schema案

```json
{
  "schema_version": "cocolon.emlis.gate0.fb172.test_migration.bodyfree.v1",
  "baseline_failure_ref": "ai/tests/old.py::test_old",
  "historical_owner_refs": ["old.private.owner"],
  "stale_assertion_refs": ["old_internal_meta_exists"],
  "valid_protected_obligations": [
    "public_meta_body_free",
    "failed_candidate_not_visible"
  ],
  "current_owner_refs": [
    "emlis_ai_public_feedback_meta.build_public_emlis_input_feedback_meta",
    "emlis_ai_public_feedback_meta.should_include_public_input_feedback"
  ],
  "replacement_test_refs": [
    "ai/tests/new.py::test_public_meta_body_free"
  ],
  "old_owner_restored": false,
  "skip_or_xfail_used": false,
  "exact_body_assert_added": false
}
```

### 12.3 rename / delete rule

- historical filename維持を優先する。
- test名変更時はledgerでold→new mappingを必須にする。
- test削除はvalid obligationが0である明示証拠がある場合だけ。
- 削除件数をprogress指標にしない。

### 12.4 migrated testの品質条件

```text
- current ownerを直接検査
- private implementation detailsへの過度な結合なし
- body-freeまたは構造的
- deterministic
- public / Safety boundaryを必要範囲で保持
- exact product body非依存
- historical routeを暗黙に復活させない
```

---

## 13. production修復設計

### 13.1 production修復を許可するGate

次がすべてtrueの場合だけproduction修復を開始する。

```text
classification_complete = true
unresolved_stop_count = 0
current_contract_regression_count > 0
current_owner_red_tests_exist = true
external_contract_change_required = false
```

### 13.2 allowed change pattern

```text
current structure / meaning / public boundaryの欠落
  → current ownerへ最小修復
  → current-owner test green
  → nearby canonical regression tests green
```

### 13.3 prohibited change pattern

```text
KeyErrorを消すためold meta dictを復活
AttributeErrorを消すためcompat private helperを追加
exact body testを通すためfixture固有branchを追加
old P5/P6 builderをreply serviceへ再接続
old question/two-stage routeを復活
source grep testを通すためdead tokenを追加
```

### 13.4 version / schema

- public API schemaは変更しない。
- DB schemaは変更しない。
- RN schemaは変更しない。
- Grounded semantic versionは、meaning semanticsが実際に変わる場合だけ更新候補とする。
- test移管だけではsemantic versionを上げない。
- current `gate0.validation.bodyfree.v2`は、最終V1〜V5を表現できるため原則維持する。
- closure ledgerは別artifactとし、validation schemaへ172分類情報を過積載しない。

---

## 14. repair batch設計

final classification後、変更を次のbatchへ分ける。node IDはowner ledgerから割り当て、ファイル名だけで自動割当しない。

### B0: environment isolation

対象:

- official fail / clean isolated pass
- global state / registry / cache pollution

原則:

- production contractを変えない。
- 汚染を起こすfixture / test setup / global mutable ownerを修復する。

### B1: removed owner / private symbol migration

対象:

- missing imports
- monkeypatch removed private helper
- old callgraph / phase integration

原則:

- current canonical ownerへtest移管。
- production helper復活0。

### B2: old internal meta migration

対象:

- `diagnostic_summary`
- `multi_perspective`
- old step / rollout / scorecard / lineage summary

原則:

- valid truthをcurrent top-level / grounded meta / overlay / public sanitizerへ分解。

### B3: exact surface / old semantic ID migration

対象:

- fixed body
- fixed prefix / phrase
- old material IDs
- old question sentence

原則:

- structural / semantic / public contractへ移管。

### B4: P5 / P6 hold boundary

対象:

- old runtime bridge
- visible connection before Gate 0
- human QA pending contract

原則:

- current hold / pending / not appliedを検査。

### B5: public E2E / Safety / low-information

対象:

- emotion submit
- visible inclusion
- low-information boundedness
- self-denial / Safety

原則:

- current external contractを保持。
- stale internal assertionsだけ除去。

### B6: true production regression

対象:

- current-owner REDで証明されたfailureのみ

原則:

- production最小修復。

### B7: inventory / negative reachability

対象:

- old route absent
- production reachability 0
- source scan scope

原則:

- I0 inventoryを更新。
- diagnostic/test tokenとproduction reachabilityを分ける。

---

## 15. 詳細実装順

既存RR0〜RR10と混同しないよう、本閉包周期を`FC0`〜`FC14`と呼ぶ。

## FC0: baseline integrity freeze

**目的**

172 failuresの正本とbaselineを固定する。

**変更**

- production変更なし
- tracked test変更なし
- local/body-free evidence生成候補のみ

**実施**

1. archive SHA-256再計算。
2. official source fingerprint再計算。
3. official validation artifact hash再計算。
4. 172 refsのcount / duplicate / order / hash固定。
5. 66 test file分布固定。
6. current owner source hashes固定。

**完了条件**

- official evidenceとの一致。
- source未変更。

**停止条件**

- archive hash不一致。
- official 172 ref集合不一致。

---

## FC1: official execution environment freeze

**目的**

isolated差とofficial full-suite差を比較可能にする。

**実施**

1. Python / pytest / plugin / OS / cwd / commandを記録。
2. worker、import mode、seed、環境変数名を記録。
3. full-suite実行log hashとselected-172 log hashを分ける。
4. secretsを記録しない。

**変更**

- source変更なし。

**完了条件**

- official commandを同条件で再実行できるmanifestがある。

---

## FC2: current owner authority map freeze

**目的**

172件の移管先を、修復都合で後から変えない。

**実施**

1. I0 runtime ownershipを再確認。
2. reply service direct calleesをsourceから再計算。
3. public routeからemotion submitまでのcaller chainを確認。
4. P5/P6 hold状態を確認。
5. shadow / diagnostic / test-only ownerを分類。
6. API/DB/RN external contractをfreeze。

**成果**

- body-free owner map。

**停止条件**

- designと実call graphが矛盾。

---

## FC3: 172 provisional classification

**目的**

sourceを変更する前に、全nodeのfailure pointとobligationを把握する。

**実施**

1. 172件を一件ずつledgerへ登録。
2. official failure pointを記録。
3. test内の全obligationを列挙。
4. historical ownerを記録。
5. current owner候補を付ける。
6. valid protected riskを抽出。
7. provisional classificationを付ける。
8. hidden obligation可能性を記録。

**変更**

- tracked source変更なし。
- 調査scriptが必要ならrepo外local-onlyとする。

**完了条件**

- 172 / 172 provisional record。

---

## FC4: environment / order variance resolution

**目的**

isolated passした2件を含め、officialとの差を説明する。

**実施**

1. API registry 2件をclean subprocessで再確認。
2. official prefix / binary searchで污染元を特定。
3. 同種のisolated/full差が他にないか確認。
4. test order / global state候補を記録。
5. environment classificationをfinalize。

**変更**

- この段階ではsource変更なし。

**停止条件**

- official条件を再現できない。
- 汚染ownerを説明できない。

---

## FC5: final classification gate

**目的**

修復前に全172件のcurrent ownerを確定する。

**実施**

1. provisional recordをfinalへ更新。
2. primary classificationを全件確定。
3. secondary tagsを確定。
4. valid protected obligationを確定。
5. planned repair batchを割り当て。
6. production change allowedを確定。

**repair entry condition**

```text
record_count = 172
unclassified = 0
current_owner_missing = 0
UNRESOLVED_STOP = 0
```

**停止**

上記を満たさなければ、FC6へ進まない。

---

## FC6: current-owner RED / proof tests

**目的**

production修復とtest移管の根拠をコード化する。

**変更**

- testのみ
- exact body assertなし

**実施**

1. current contract regressionごとにcurrent-owner REDを追加。
2. stale owner migration先のstructural/public testを追加または既存testへ移す。
3. old route absentのnegative testを必要分追加。
4. environment contamination再現testを追加。

**完了条件**

- intended REDのみがRED。
- current pass契約を壊す無関係REDなし。

---

## FC7: B0 environment isolation repair

**目的**

full-suite order差をproduct変更なしで閉じる。

**変更候補**

- fixture teardown
- test-scoped app / registry reset
- monkeypatch restore
- cache cleanup

**禁止**

- route削除
- response model緩和
- app production contract変更

**完了条件**

- isolated / prefix / randomized orderで一貫pass。

---

## FC8: B1 / B2 stale owner migration

**目的**

旧private ownerと旧internal metaへの依存をcurrent ownerへ移す。

**実施**

1. removed symbol monkeypatchをcurrent boundaryへ移す。
2. `diagnostic_summary` obligationを分解する。
3. `multi_perspective` obligationをGrounded structureへ移す。
4. old phase / rollout / scorecard timelineをcurrent truthへ移す。
5. migration receiptをledgerへ追加。

**完了条件**

- old private symbol production復活0。
- valid obligation欠落0。

---

## FC9: B3 exact surface / semantic ID migration

**目的**

old本文形状をcurrent構造contractへ置き換える。

**実施**

1. exact body / prefix / phrase assertionを列挙。
2. protected meaning / Safety / public axisへ変換。
3. old material IDをGrounded roleへ移す。
4. question sentence期待をcurrent question policy / bounded observationへ移す。
5. exact body assert新規追加0をscanする。

**完了条件**

- exact本文依存がproduct semantic testsから消える。
- valid required meaning testが残る。

---

## FC10: B4 / B5 hold・public・Safety closure

**目的**

P5/P6未開始、P8未開始、public E2E、Safetyのcurrent状態を閉じる。

**実施**

1. P5/P6 runtime bridge testをhold / pendingへ移す。
2. emotion submit E2Eをcurrent comment/meta ownerへ移す。
3. low-informationをbounded observationで検査する。
4. self-denial / Safety ownerを維持する。
5. public meta body-free / passed-only visibilityを検査する。

**完了条件**

- P5/P6 connection復活0。
- question route復活0。
- external API shape差分0。

---

## FC11: B6 current production regression repair

**目的**

FC5でcurrent regressionと確定したものだけを修復する。

**実施**

1. current-owner REDを一件ずつ修復。
2. nearby canonical testsを実行。
3. source fingerprintをbatchごとに記録。
4. old route reachabilityを再確認。
5. ledger closure attemptを更新。

**完了条件**

- current-owner RED全件green。
- unrelated current targeted regression 0。
- API / DB / RN production差分0。

**停止条件**

- current contractを満たすためexternal contract変更が必要。
- fixture固有branchが必要。
- old helper復活が必要に見える。

---

## FC12: baseline 172 closure + new failure closure

**目的**

baseline 172を、先頭assertだけでなく最終状態まで閉じる。

**実施**

1. baseline 172を同一working snapshotで実行。
2. 同じnodeから新しいassertが露出したらattemptを追加。
3. 新規node failureが出たら`origin=new_after_change`としてledgerへ追加。
4. 全repair batch targeted suiteを実行。
5. I0 inventory / negative reachabilityを更新。

**完了条件**

```text
baseline 172: all closed
selected baseline run: 172 passed
new failure count: 0
unclassified new failure: 0
old substantive production reachability: 0
```

ここでまだofficial V5 passとはしない。

---

## FC13: final source freeze + official V1〜V5

**目的**

局所closureをfull backend正本で確認する。

**実施順**

```text
V1 compile / targeted
→ V2 safety / public contract
→ V3 RN screen contract
→ V4 full collect
→ V5 full backend
```

**重要**

1. FC13開始前にfinal candidate fingerprintを固定する。
2. V1〜V5間でsource変更を禁止する。
3. sourceが変わったらV1からやり直す。
4. V4 collect error 0をV5前提とする。
5. V5 full suite failed 0 / errors 0を必須にする。

**完了条件**

```text
validation_all_pass = true
full_collect_error_count = 0
full_backend_failed_count = 0
full_backend_error_count = 0
fingerprint_checks_all_match = true
```

---

## FC14: same16 actual read → exact8 → stop

### FC14-A same16 generation

- final validation snapshotと同じfingerprintを使う。
- existing helperの16件を変更しない。
- first / second runでdeterministic 16 / 16を確認する。

### FC14-B Karen actual read

華恋が16件すべてを実際に読む。

評価軸:

```text
required_nucleus_retained
required_relation_direction
lexical_fidelity
whole_input_balance
human_follow_fit
natural_japanese
non_template_readfeel
safety_boundary
wants_more_input_candidate
fatal_reason_refs
verdict
```

合格条件:

```text
actual review count = 16
local human pass = 16
repair required = 0
hard fatal = 0
deterministic = 16 / 16
```

一件でも不合格なら該当current ownerへ戻る。sourceを変更した場合、FC13 V1から再実行する。

### FC14-C exact 8

16 / 16の場合だけ、次のexact 8をhelperから生成する。

```text
A
B
C
D
I6-S03
I6-L03
I6-C01
I6-D02
```

生成後の停止コード:

```text
GATE0_LOCAL_PASS_DEVICE_PACKET_READY_STOPPED
```

ここで停止し、Mash様へ実機確認を依頼する。P5 / P6 / P8へ進まない。

---

## 16. V1〜V5検証契約

### V1 compile / targeted

最低対象:

```text
current Grounded Plan / Surface / Gate
Gate0 semantic subchecks
I6 / I7
public feedback meta
emotion submit current E2E
migrated historical tests
environment isolation tests
I0 inventory
```

合格:

- return code 0
- collection error 0
- migrated test green
- current-owner RED green

### V2 safety / public contract

合格:

- Safety owner維持
- self-denial fact boundary維持
- public meta body-free
- failed candidate非表示
- generation truth維持
- API keys差分0

### V3 RN screen contract

```bash
npm run test:rn-screens
```

合格:

- return code 0
- existing RN contract全件pass
- RN production source差分0

### V4 full collect

```bash
python -m pytest --collect-only -q
```

合格:

```text
return code = 0
collection error = 0
collected test count > 0
```

### V5 full backend

```bash
python -m pytest -q
```

合格:

```text
return code = 0
failed = 0
errors = 0
unclassified failure = 0
```

warningは件数とrefを記録するが、error / failureと混同しない。新しいwarningがcontract riskを示す場合は別blockerとして分類する。

---

## 17. same16 / exact8 schema案

既存Gate0 schemaを原則維持する。172 closureとのlinkが必要な場合だけ、body-free refを追加する候補とする。

### 17.1 final validation link案

```json
{
  "schema_version": "cocolon.emlis.gate0.fb172.final_link.bodyfree.v1",
  "baseline_freeze_sha256": "64hex",
  "owner_ledger_sha256": "64hex",
  "final_source_snapshot_fingerprint": "64hex",
  "gate0_validation_sha256": "64hex",
  "baseline_failure_count": 172,
  "baseline_failure_closed_count": 172,
  "new_failure_count": 0,
  "unresolved_stop_count": 0,
  "old_substantive_production_reachability_count": 0
}
```

### 17.2 exact8 guard追加候補

既存exact8 builderは、次を確認する。

```text
Gate0 local pass decision
validation all pass
source/review/validation fingerprint一致
16 / 16 actual read
fb172 final link closed
baseline 172 closed
new failure 0
```

closure artifactを実ファイル化しない判断の場合は、既存decision / validation evidenceへ同等のbody-free reason refを入れる。

---

## 18. ファイル影響候補

### 18.1 まず変更される可能性が高いtest

```text
ai/tests/test_emlis_ai_diagnostic_summary.py
ai/tests/test_emlis_ai_diagnostic_summary_v2.py
ai/tests/test_emlis_ai_complete_initial_entry_route.py
ai/tests/test_emlis_ai_complete_initial_step7_integration.py
ai/tests/test_emlis_ai_post_final_gate_recovery_phase20_13.py
ai/tests/test_emlis_ai_reply_service_gate_recovery_public_boundary_p4.py
ai/tests/test_emlis_ai_reply_service_expected_relation_types.py
ai/tests/test_emlis_ai_display_contract.py
ai/tests/test_emlis_ai_state_answer_visible_surface_qa.py
ai/tests/test_emotion_submit_two_stage_reception_e2e.py
ai/tests/test_emotion_submit_phase18_product_quality_e2e.py
ai/tests/test_emotion_submit_phase19_real_device_abcd_public_feedback_e2e.py
ai/tests/test_emlis_ai_user_label_connection_p5_runtime_bridge_20260612.py
ai/tests/test_emlis_ai_structure_insight_p6_runtime_bridge_20260612.py
ai/tests/contract/test_api_contract_registry.py
```

この一覧は変更確定ではない。final owner ledgerにより、各obligationの変更先を決める。

### 18.2 production変更候補

`CURRENT_CONTRACT_REGRESSION`が証明された場合だけ変更する。

```text
emlis_ai_current_input_bundle.py
emlis_ai_evidence_ledger_service.py
emlis_ai_grounded_observation_plan.py
emlis_ai_grounded_sentence_surface.py
emlis_ai_grounded_observation_gate.py
emlis_ai_reply_service.py
emlis_ai_response_contract.py
emlis_ai_public_feedback_meta.py
emotion_submit_service.py
emlis_ai_safety_triage.py
emlis_ai_safety_boundary_service.py
FastAPI app / registry fixture owner
```

### 18.3 原則変更しないもの

```text
DB schema / migration / write path
API top-level response schema
RN production source
P8 question system
P5 / P6 visible runtime connection
legacy substantive route
```

---

## 19. rollback単位

```text
C0  freeze / environment manifest only
C1  current-owner RED / proof tests
C2  environment isolation
C3  removed private owner migration
C4  internal meta migration
C5  exact surface / semantic ID migration
C6  P5/P6 hold + public E2E migration
C7  true production repairs
C8  inventory / negative reachability
C9  evidence artifacts only
```

rollback条件:

- canonical path変更
- old substantive reachability増加
- public key差分
- DB / RN production差分
- Safety boundary後退
- required meaning後退
- deterministic loss
- exact body bank追加
- fixture-specific branch追加
- skip / xfailでclosure

rollbackは同じcurrent architecture内の直前単位へ戻す。旧routeをfeature flagで復活させない。

---

## 20. 停止条件

次のいずれかで停止する。

### classification前後

- official 172 ref集合を再現できない。
- current ownerを説明できないfailureが1件以上。
- valid protected obligationを分離できない。
- official environmentの必要条件が不明。

### 修復中

- old private helper復活が必要に見える。
- old substantive route復活が必要に見える。
- exact bodyでしかtestを書けない。
- API / DB / RN production変更が必要。
- P5 / P6 / P8開始が必要。
- source-global token scanしか根拠がない。
- test削除 / skip / xfailでしかgreenにできない。

### validation

- V1〜V5のいずれかがfail。
- V4 collection errorが1件以上。
- V5 failed / errorsが1件以上。
- V1〜V5でfingerprint不一致。
- new unclassified failureが1件以上。

### actual read

- deterministic 16 / 16でない。
- 華恋actual readにrepair / fatalが1件以上。

停止時は、別の周辺作業を発明しない。止まったowner・不足証拠・次に必要な一作業だけを明示する。

---

## 21. 完了判定表

| classification | repair | V1-V5 | same16 | decision | exact8 |
|---|---|---|---|---|---|
| unresolvedあり | not allowed | not final | no | `GATE0_TEST_OR_CONTRACT_BLOCKED_STOPPED` | no |
| 172 classified / repair中 | partial | not final | no | `GATE0_TEST_OR_CONTRACT_BLOCKED_STOPPED` | no |
| 172 closed | done | any fail | no | `GATE0_TEST_OR_CONTRACT_BLOCKED_STOPPED` | no |
| 172 closed | done | all green | <16 pass | `GATE0_REPAIR_RETURN_STOPPED` | no |
| 172 closed | done | all green | 16 / 16 | `GATE0_LOCAL_PASS_DEVICE_PACKET_READY_STOPPED` | yes |

部分合格を作らない。

---

## 22. traceability

| Mash様が指定した作業 | 本書 | 実装step | 完了証拠 |
|---|---|---|---|
| 1. official 172とfingerprint固定 | Sections 6, 15 FC0-FC1 | FC0 / FC1 | freeze artifact、hash一致 |
| 2. current owner単位で分類 | Sections 5, 7, 8, 9 | FC2-FC5 | 172/172 ledger、unresolved 0 |
| 3. 分類別の最小修復 | Sections 10-14 | FC6-FC12 | migration receipt、current-owner tests、production diff |
| 4. 同一snapshotでV1〜V5 | Section 16 | FC13 | validation evidence、fingerprint一致 |
| 5. all green後same16実読 | Section 15 FC14 | FC14-A/B | deterministic 16/16、actual review 16/16 |
| 6. 16/16ならexact8、停止 | Sections 15, 17 | FC14-C | exact8 packet、stop code |

---

## 23. 実装前チェックリスト

### freeze

- [ ] archive SHA-256再確認
- [ ] baseline fingerprint再確認
- [ ] official validation artifact hash固定
- [ ] official 172 refs count / duplicate / order確認
- [ ] environment manifest固定
- [ ] source変更前に完了

### ownership

- [ ] 172 / 172 record
- [ ] historical owner記録
- [ ] current owner evidence 2種以上
- [ ] valid protected obligation記録
- [ ] stale implementation detail分離
- [ ] primary classification全件
- [ ] unresolved 0

### test design

- [ ] current-owner REDあり
- [ ] exact body assert追加0
- [ ] old private monkeypatch移管
- [ ] public / Safety valid obligation維持
- [ ] skip / xfail 0
- [ ] old→new node mapping

### production

- [ ] production変更はcurrent regressionだけ
- [ ] old helper復活0
- [ ] old substantive reachability 0
- [ ] API key差分0
- [ ] DB差分0
- [ ] RN production差分0
- [ ] fixture-specific branch 0

### closure

- [ ] baseline 172 all closed
- [ ] hidden obligation未処理0
- [ ] new failure 0
- [ ] I0 inventory更新
- [ ] negative reachability green

### validation

- [ ] final fingerprint freeze
- [ ] V1 green
- [ ] V2 green
- [ ] V3 green
- [ ] V4 collect 0 errors
- [ ] V5 failed 0 / errors 0
- [ ] all fingerprint checks一致

### actual read / exit

- [ ] same16 unchanged
- [ ] deterministic 16/16
- [ ] Karen actual read 16/16
- [ ] repair 0
- [ ] fatal 0
- [ ] exact8 helper-generated
- [ ] P5 false
- [ ] P6 false
- [ ] P8 false
- [ ] device evidence待ちで停止

---

## 24. 本設計時点の未確認事項

- official full-suiteでAPI registry 2件を失敗させた具体的precedessor
- 172件それぞれのfinal primary classification
- stale test内に残るvalid obligationの最終数
- true current production regressionの最終数
- production修復が必要になる具体的ownerと差分
- repair後のfinal source fingerprint
- repair後のfull collect件数
- repair後のfull backend件数
- same16の最終本文
- 華恋actual read結果
- exact8実機結果

これらを設計段階でpass扱いしない。

---

## 25. 本設計だけでは行わないこと

- production code変更
- test変更
- JSON artifact実生成
- schema constant変更
- source fingerprint更新
- 172 ledger実生成
- V1〜V5実行
- same16生成
- 華恋actual read
- exact8生成
- Mash様への実機依頼
- P5 / P6 / P8開始

実装指示を受けた場合、FC0から開始する。最初のtracked source変更は、FC5 final classification gate通過後のFC6 test変更である。

---

## 26. 最終判定

```text
DESIGN_STATUS = READY
IMPLEMENTATION_STATUS = NOT_STARTED
CURRENT_GATE0 = GATE0_TEST_OR_CONTRACT_BLOCKED_STOPPED
CURRENT_P8 = NO_GO
BASELINE_FAILURE_COUNT = 172
FIRST_IMPLEMENTATION_STEP = FC0_BASELINE_INTEGRITY_FREEZE
FIRST_TRACKED_SOURCE_CHANGE = FC6_CURRENT_OWNER_RED_AND_PROOF_TESTS
USER_DEVICE_ACTION_NOW = NONE
DEVICE_REQUEST_POINT = FC14_EXACT8_PACKET_READY
```

本設計の終了地点は、full backendをgreenにしたことだけではない。

```text
172 ownership closure
+ V1〜V5 same-snapshot all green
+ same16 deterministic
+ Karen actual read 16 / 16
+ exact8 packet generated
+ stop
```

ここまで到達した時点でのみ、Mash様へexact 8の実機確認を依頼する。

---

## Appendix A. 設計時に観測した表層症状分布

これはfinal classificationではない。補助再現の先頭failure messageをworkloadの見通しとしてまとめたものである。

| 表層症状 | 件数 | 注意 |
|---|---:|---|
| `diagnostic_summary` missing | 63 | old meta復活を意味しない |
| `multi_perspective` missing | 13 | Grounded structureへの移管候補 |
| removed symbol / private owner | 35 | production復活禁止 |
| runtime summary / lineage missing | 12 | current truthへ分解 |
| static source / callgraph assertion | 10 | reachability scopeを再定義 |
| runtime behavior / semantic assertion | 12 | current regression候補を個別判定 |
| other assertion mismatch | 16 | exact body等を含む。個別解析必須 |
| other legacy meta missing | 9 | old step / reply meta等 |
| isolated pass | 2 | environment/order候補 |
| **total** | **172** | official classificationは別途行う |

---

## Appendix B. official 172 failuresのtest file分布

次の件数は、official failure refをtest file単位で数えたbaseline分布である。分類や修復単位はfileではなくnode / obligationである。

| test file | failure refs |
|---|---:|
| `ai/tests/contract/test_api_contract_registry.py` | 2 |
| `ai/tests/test_cocolon_text_generation_core_emlis_observation_adapter.py` | 1 |
| `ai/tests/test_cocolon_text_generation_core_phase14_final_boundary.py` | 1 |
| `ai/tests/test_cocolon_text_generation_core_step15_stabilization.py` | 1 |
| `ai/tests/test_emlis_ai_complete_e2e_contract.py` | 1 |
| `ai/tests/test_emlis_ai_complete_initial_entry_route.py` | 9 |
| `ai/tests/test_emlis_ai_complete_initial_step7_integration.py` | 5 |
| `ai/tests/test_emlis_ai_complete_initial_step9_fixture_qa.py` | 1 |
| `ai/tests/test_emlis_ai_complete_product_quality_connection_e2e.py` | 1 |
| `ai/tests/test_emlis_ai_complete_product_quality_positive_recovery_e2e.py` | 2 |
| `ai/tests/test_emlis_ai_complete_release_ladder_connection_e2e.py` | 1 |
| `ai/tests/test_emlis_ai_composer_client_registry.py` | 2 |
| `ai/tests/test_emlis_ai_d_source_unavailable_normal_observation_recovery.py` | 3 |
| `ai/tests/test_emlis_ai_diagnostic_summary.py` | 29 |
| `ai/tests/test_emlis_ai_diagnostic_summary_v2.py` | 3 |
| `ai/tests/test_emlis_ai_display_contract.py` | 4 |
| `ai/tests/test_emlis_ai_environment_state_output_surface_contract_completion.py` | 1 |
| `ai/tests/test_emlis_ai_gate_recovery_low_information_recovery_p6.py` | 1 |
| `ai/tests/test_emlis_ai_hij_reception_required_regression_p8.py` | 3 |
| `ai/tests/test_emlis_ai_limited_composer_extension_exit_gate.py` | 2 |
| `ai/tests/test_emlis_ai_limited_composer_extension_steps_0_1.py` | 3 |
| `ai/tests/test_emlis_ai_low_information_red_cases.py` | 3 |
| `ai/tests/test_emlis_ai_low_information_specificity_policy_step6.py` | 1 |
| `ai/tests/test_emlis_ai_multi_perspective_pipeline.py` | 2 |
| `ai/tests/test_emlis_ai_observation_diagnostic_reply_meta.py` | 1 |
| `ai/tests/test_emlis_ai_p4_runtime_backfill_hij_future_direction_generic_surface_guard_20260624.py` | 2 |
| `ai/tests/test_emlis_ai_p4_runtime_backfill_hij_future_direction_surface_audit_20260624.py` | 2 |
| `ai/tests/test_emlis_ai_p4_runtime_backfill_hij_future_direction_surface_repair_20260624.py` | 1 |
| `ai/tests/test_emlis_ai_p5_p6_split_test_matrix_handoff_r9_20260612.py` | 2 |
| `ai/tests/test_emlis_ai_p7_hold004_phase16_composer_classification_20260613.py` | 1 |
| `ai/tests/test_emlis_ai_p7_hold004_positive_public_shape_boundary_20260614.py` | 1 |
| `ai/tests/test_emlis_ai_p7_hold004_step5_candidate_gate_classification_20260614.py` | 1 |
| `ai/tests/test_emlis_ai_p7_hold004_step5_r7_r8_target_subset_validation_20260614.py` | 1 |
| `ai/tests/test_emlis_ai_phase18_complete_initial_candidate_path.py` | 1 |
| `ai/tests/test_emlis_ai_phase18_diagnostic_classification_taxonomy.py` | 1 |
| `ai/tests/test_emlis_ai_phase18_low_information_public_repair_boundary.py` | 3 |
| `ai/tests/test_emlis_ai_phase20_9_phase19_withdrawal.py` | 1 |
| `ai/tests/test_emlis_ai_phase7_staged_release.py` | 4 |
| `ai/tests/test_emlis_ai_phase8_real_input_quality.py` | 1 |
| `ai/tests/test_emlis_ai_post_final_gate_recovery_phase20_13.py` | 6 |
| `ai/tests/test_emlis_ai_product_readfeel_p4_r11_targeted_tests_20260624.py` | 1 |
| `ai/tests/test_emlis_ai_reception_assistance_dictionary.py` | 1 |
| `ai/tests/test_emlis_ai_reply_service_expected_relation_types.py` | 4 |
| `ai/tests/test_emlis_ai_reply_service_gate_recovery_public_boundary_p4.py` | 5 |
| `ai/tests/test_emlis_ai_reply_service_normal_observation_rebuild_p6.py` | 4 |
| `ai/tests/test_emlis_ai_runtime_surface_pre_return_gate_step2.py` | 1 |
| `ai/tests/test_emlis_ai_scoped_grounding.py` | 2 |
| `ai/tests/test_emlis_ai_scorecard_harness.py` | 1 |
| `ai/tests/test_emlis_ai_state_answer_visible_surface_qa.py` | 5 |
| `ai/tests/test_emlis_ai_step16_rollout_metrics.py` | 2 |
| `ai/tests/test_emlis_ai_step18_ap0_migration_decision.py` | 1 |
| `ai/tests/test_emlis_ai_step19_a_plan_equivalent_composer.py` | 1 |
| `ai/tests/test_emlis_ai_step20_long_term_quality.py` | 1 |
| `ai/tests/test_emlis_ai_structure_insight_p6_limited_surface_r7_20260612.py` | 2 |
| `ai/tests/test_emlis_ai_structure_insight_p6_no_connect_regression_r8_20260612.py` | 3 |
| `ai/tests/test_emlis_ai_structure_insight_p6_runtime_bridge_20260612.py` | 4 |
| `ai/tests/test_emlis_ai_two_stage_required_gate_connection.py` | 1 |
| `ai/tests/test_emlis_ai_user_label_connection_e2e_contract.py` | 1 |
| `ai/tests/test_emlis_ai_user_label_connection_p5_body_free_public_meta_boundary_r4_20260612.py` | 1 |
| `ai/tests/test_emlis_ai_user_label_connection_p5_public_meta_human_qa_boundary_r4_20260612.py` | 2 |
| `ai/tests/test_emlis_ai_user_label_connection_p5_runtime_bridge_20260612.py` | 4 |
| `ai/tests/test_emlis_ai_user_label_connection_p5_visible_connection_r3_boundary_20260612.py` | 1 |
| `ai/tests/test_emlis_ai_visible_surface_acceptance_reply_path_step4.py` | 1 |
| `ai/tests/test_emotion_submit_phase18_product_quality_e2e.py` | 3 |
| `ai/tests/test_emotion_submit_phase19_real_device_abcd_public_feedback_e2e.py` | 3 |
| `ai/tests/test_emotion_submit_two_stage_reception_e2e.py` | 6 |

---

## Appendix C. 実装時の短いartifact名候補

長いファイル名による取扱い事故を避けるため、実ファイル化が必要な場合は次の短い候補を使う。

```text
fb172_freeze.json
fb172_env.json
fb172_ledger.json
fb172_batches.json
fb172_final.json
```

CSVは本設計では新規作成しない。
