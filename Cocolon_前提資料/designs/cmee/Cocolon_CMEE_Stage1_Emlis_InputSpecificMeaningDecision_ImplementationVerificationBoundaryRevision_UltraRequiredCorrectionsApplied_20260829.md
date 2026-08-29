# Cocolon CMEE Stage 1 / Emlis 入力固有意味決定
## 実装順・検証境界・STOP規則 — Pro必須修正 exact8 反映版

```yaml
document_class: PRO_REQUIRED_CORRECTIONS_APPLIED_BOUNDED_CONFIRMATION_CANDIDATE
proposal_owner: Ultra_Karen
review_target: Pro_Karen_DELTA_ONLY_EXACT8
date: 2026-08-29
normative_effect: NONE
github_reflection: CORRECTED_PROPOSAL_ONLY
github_write_effect: CORRECTED_PROPOSAL_CREATE_EXACT1
canonical_write: 0
structure_map_delta: NONE_PROPOSAL_ONLY_NO_CURRENT_OWNER_CHANGE
runtime_source_test_change: 0
production_activation: 0
historical_rewrite: 0
target_design: Cocolon_CMEE_Stage1_Emlis_InputSpecificMeaningDecision_KarenDesigned_FinalTechnicalDesignAndImplementationOrder_20260828
target_design_blob_sha: a6fb61a66002b323b4ecd1b11971c3f0917dc6d3
scope: implementation_order_verification_authority_consumption_stop_boundary_and_checkpoint_ownership
product_principles_change: 0
meaning_validity_contract_change: MATERIAL_PROPOSED
normal_limited_reachability_change: MATERIAL_PROPOSED
technical_owner_and_construction_change: MATERIAL_PROPOSED
provider_route_a_change: 0
implementation_evaluation_authority_route_change: MATERIAL_PROPOSED
external_ai_provider_network_fallback: 0
new_subsystem_helper_runner_scanner_receipt_family: 0
application: PROSPECTIVE_AFTER_MASH_APPROVAL
prior_pro_review_verdict: PASS_WITH_REQUIRED_CORRECTIONS
required_corrections_applied: 8_OF_8
full_second_review_required: false
bounded_delta_confirmation_required: true
current_document_status: PRO_BOUNDED_DELTA_CONFIRMATION_PENDING
mash_approval_topology: PACKET_A_EXACT1_THEN_PACKET_B_EXACT1_THEN_SEPARATE_IM10
```

---

## 0. Ultra華恋の結論

今回、作り直すべきなのは意味構造の中核ではない。

`Foreground Scope`、`Observed Difference`、`Required Difference`、`Difference Configuration`、`InputSpecificityEvidence`、`WholeReadingConsequence`、候補選択、`meaning-before-Reception`、`LIMITED`、Route A providerless-onlyという商品上の構造は維持できる。

修正必須なのは、次の四点である。

1. **実装順**
   - contract shellを先に作り、actual producer／consumerを後続IMへ送る横切り順をやめる。
   - 特に、IM02で発行するとされた`WholeReadingConsequenceRow`がIM03の`candidate.semantic_signature`を必要とする依存逆転を解消する。
   - IM03～IM05を、一つのend-to-end vertical constructionとして連続実行し、IM05までにdevelopment用の可視artifactへ到達させる。

2. **開発検証と正式評価の分離**
   - historical IM00～IM02を含むcumulative pytestとIM03～IM06 focused pytestを、承認済みIM03～IM06範囲内で実装を収束させるdevelopment verificationとする。
   - IM07以降だけを、identity／input／test／denominator／criteriaを固定したformal one-shot evaluationとする。

3. **authority消費点**
   - pre-admission operationのprocess launchはformal attemptを消費しない。
   - runtime、dependency、conftest／plugin、collect-only、selector countをformal前のpre-admissionで成立させる。
   - pre-admission PASS後、frozen evaluation bundleのformal commandをOSへ渡した時点をformal attempt開始とする。
   - 同じfrozen evaluation bundleの無変更再実行はexact0のまま維持する。
   - IM03～IM06で原因を修正したsource／test状態はnew working stateであり、承認済みatomic implementation unit内の開発継続であってformal authority retryではない。ただし、この反復許可は現行Rule 18 literalから自動導出せず、限定的applicability changeとしてPro review／Mash明示承認対象にする。

4. **STOP境界**
   - prospective IM03～IM06のdevelopment RED／readiness NOT READYをfailure countだけでSTOPにしない。
   - permission外path、新product dependency、contract／acceptance変更、protected denominator／fixture meaning変更、external AI／fallback、新helper／scanner／runner family、不可逆effect不明などは既存named STOPへ送る。
   - actual named STOP後のR10.2 exact6、R10.3 owner内exact4／repair count、counter 2/2は変更しない。R10.3 applicabilityと、IM03～IM06 development verificationに対するRule 18 applicabilityはmaterial revisionとして明示する。

この修正により、G4-B由来の「失敗ごとにhelper、launcher、scanner、runtime、fallbackを増やさない」という防御は弱めない。変えるのは、防御対象を**試行回数**から**変更可能なscopeとstate identity**へ戻すことである。

### 0.1 現在地に対する判断

- IM00、IM01、IM02で作成・push済みのsource／test bytesは捨てない。
- IM02のhistorical `32/32 PASS`とtargeted `7/7 PASS`は、不変の実行履歴として保持する。ただし、修正版設計への適合証拠として再利用できるassertionと、修正版でsupersedeされるassertionを分ける。
- ただし、現行設計がIM02へ置いたactual candidate-bound `WholeReadingConsequenceRow`発行は未完了である。
- したがって、historical completion recordとcurrent revised-design conformanceを別fieldで併記する。

```text
HISTORICAL_RECORDED_STATUS = IM02_COMPLETE_NONTERMINAL_CHECKPOINT
HISTORICAL_GATE_RESULT = 32/32_TOTAL_WITH_SUBSET_TARGETED_7/7_SEPARATE_COMMAND
CURRENT_REVISED_DESIGN_CONFORMANCE = PARTIAL
REVISED_IM03_06_GREEN = NOT_ESTABLISHED
PROPOSED_REVISED_DISPOSITION_OF_EXPANDED_EXACT32 = UNCHANGED_EXACT21_PLUS_REBASE_REQUIRED_EXACT11
TARGETED_RERUN_EXACT7 = SUBSET_OF_RECORDED_TOTAL_EXACT32_AND_SEPARATE_COMMAND
SUPERSEDED_ASSERTION_GROUPS_EXACT5 = NON_ADDITIVE_GROUPS_WITHIN_REBASE_REQUIRED_EXACT11
IM00_IM02_SOURCE_ROLLBACK_OR_REPLAY = 0
NEXT_IMPLEMENTATION_UNIT = REVISED_IM03_THROUGH_IM06_ATOMIC
```

これは過去履歴の改竄ではない。`IM02 COMPLETE`を当時のnonterminal checkpoint recordとして保持しつつ、新しいvertical closure基準ではPARTIALであることを加算記録する。historical PASS全体をそのままrevised conformanceへ昇格させない。

### 0.2 Pro華恋の初回判定と、今回の差分限定確認

Pro華恋は初回レビューで、次の中心判断を承認した。

> IM03～IM06の承認済みatomic development unit内では、因果修正後のnew working stateを完了まで検証できる。同じfrozen evaluation bundleに対するIM07以降のformal gateはexact1であり、nonclear後の補正はfresh Mash Level 3 correction authorityなしに行わない。

初回判定は`PASS_WITH_REQUIRED_CORRECTIONS`であり、中心方針の作り直しは要求されていない。本版は指定された`REQUIRED_CORRECTIONS exact8`だけを反映した。次のPro確認は全文再レビューではなく、§16のexact8対応表に限定する。

---

## 1. 確認範囲とcurrent preimage

### 1.1 読んだ正本

今回の判断は、添付された次の三資料だけでなく、GitHub上のcurrent ownerを直接読んで行った。

- `Cocolon_CMEE_Stage1_Emlis_InputSpecificMeaningDecision_ImplementationVerificationBoundaryRevision_UltraProposalForProReview_20260829(1).md`
- `Pro華恋レビュー(2).txt`
- `期限確定宣言.txt`
- `CURRENT_RULES.md`
- Work attitude rulesの`00_read_first`、Rule 16、Rule 18
- `13_cocolon_work_test_runner_runtime_continuity.md`
- `09_work_start_checklist.txt`
- `99_integrated_paste_each_time.txt`
- `current_structure/00_three_core_and_cmee_read_first.md`
- `current_structure/01_emlis_ai_current_structure.md`
- `current_structure/04_cmee_current_structure.md`
- `designs/cmee/v1/00_read_first.md`
- `designs/cmee/v1/06_implementation_order_migration_and_verification.md`
- 対象の最終技術設計書全文
- mashos-api上のIM00～IM02 runtime／test／handoff実装

System Context v1は、current entryがcanonical originalのdirect-read fallbackを許しているため、今回はgenerated contextを判断根拠にせず、canonical originalを直接読んだ。System Context自体の更新は本案の対象外である。

### 1.2 設計判断のGitHub preimage heads

| repository / PR | state | decision preimage head |
|---|---|---|
| Cocolon PR #30 | Draft / open / unmerged | `2c4543d0357c8932fddf6fbad5b1917b477ab86e` |
| mashos-api PR #3 | Draft / open / unmerged | `540ed76d9ae39b9fa6eafc4dbc028e50f52dc3df` |
| System Context PR #37 | Draft / open / unmerged | `d5de2bd8945544a44b4ef3d10136010f88ce23ad` |

上表は設計判断を行ったpreimageである。本修正版proposal fileのGitHub create exact1によりCocolon branch headだけは前進するが、PR state、canonical target design、rules、runtime、source、test、fixtureには変更を加えない。reflection後のactual commitはGit historyとremote postverificationが所有する。

### 1.3 実装checkpoint

| checkpoint | mashos-api runtime commit | mashos-api receipt/minimization | Cocolon checkpoint commit | current evidence |
|---|---|---|---|---|
| IM00 | `61eae9b…` | `2c607f0…` | `ac1ccfce…` | contracts／validators foundation |
| IM01 | `d426962…` | — | `c2d819f…` | `25/25 PASS` claim、pipeline split／Foreground Scope connection |
| IM02 | `540ed76…` | — | `2c4543d…` | final `32/32 PASS`、targeted `7/7 PASS` |

公開API、DB、RN、production effectは0のままである。

### 1.4 source間の履歴分類不一致

添付作業ログは`No module named pytest`と`No module named fastapi`をIM01停止として記録する。一方、GitHub current ownerは`fastapi` precollection failureをIM02 formal historyに含める。

したがって本案では、事故をIM01またはIM02へ恣意的に寄せない。次の期間名を用いる。

```text
IM01正式検証開始からIM02 completionまでの実装期間
```

履歴のsource差は保持し、事後にどちらかへ書き換えない。

---

## 2. 観測された失敗と正しい分類

### 2.1 事実表

| 観測事象 | 実態 | 当時の扱い | 本来の分類 | formal attempt |
|---|---|---|---|---:|
| 旧IM00 fixtureの型不整合 | contract／caller／fixture移行が同一checkpointで閉じていない | test failure後STOP | harness／compatibility closure defect | 0、またはdevelopment RED |
| `No module named pytest` | runtime readiness不足、collection 0 | formal exact1消費、STOP | prelaunch runtime NOT READY | 0 |
| launcher import path不備 | command construction不成立 | formal failure／repair authority対象 | historical evidenceからactual helper／launcher invocationとR10.3 exact4 eventを復元できる範囲で§7.1 exclusive classifierへ送る。事後に一律NOT READYへ寄せない | 0 |
| `No module named fastapi` | conftest pluginが辿るrepository-declared dependency closure不足 | formal exact1消費、STOP | precollection dependency NOT READY | 0 |
| `28/32` | source／test／fixture統合途中 | formal failure | working implementation state RED | formal 0 |
| `24/32` | 同上 | second failure相当 | working implementation state RED | formal 0 |
| `25/32` | 同上 | additional failure | working implementation state RED | formal 0 |
| fixture選択修正 | approved caseの選択整合 | failure後repair | in-scope causal repair | — |
| exact17 identity同期 | changed approved bytesとのidentity整合 | failure後repair | in-scope derived identity update | — |
| `32/32 PASS` | historical checkpoint gate GREEN | formal PASS | immutable historical result、revised evidenceはreuse／rebase／supersedeへ分割 | formal implementation／evaluation bundle未freeze |
| targeted `7/7 PASS` | historical IM02 focused GREEN | IM02 completion evidence | immutable historical result、assertion単位で再分類 | formal implementation／evaluation bundle未freeze |

### 2.2 失敗回数ではなく、到達phaseを記録する

`pytest`や`fastapi`がない状態は、意味決定ロジックを一件も評価していない。collection 0を「商品candidateが一回失敗した」と数えることはできない。

同様に、`28/32 → 24/32 → 25/32 → 32/32`は、同じcandidateを祈るように再実行した履歴ではない。source／test／fixture／identityを修正しながら新しいstateを検証した通常の開発収束である。

ここを区別しないと、次の誤変換が起きる。

```text
normal development evidence
  -> formal one-shot failure
  -> authority consumed
  -> fresh Mash approval required
  -> unfinished STOP
```

問題は失敗したことではなく、失敗のownerとphaseを失ったことである。

---

## 3. STOP多発の根本原因

### 3.1 nonseparable設計意図とactual authority fragmentationの乖離

対象設計書§17.1はIM00～IM09を一つの`nonseparable bounded implementation unit`とする。また§17.3は各IMをauthority terminalへしない趣旨を持つ。

しかしactual checkpointは各IM後に、次のようなstateを置いた。

```text
FRESH_MASH_EXPLICIT_START_REQUIRED
CURRENT_AUTHORIZED_NEXT_IMPLEMENTATION = NONE_AFTER_IM00
CURRENT_AUTHORIZED_NEXT_IMPLEMENTATION = NONE_AFTER_IM01
CURRENT_AUTHORIZED_NEXT_IMPLEMENTATION = NONE_AFTER_IM02
```

checkpointを保存点として置くこと自体は`nonseparable`と矛盾しない。問題はactual運用で、各保存点をfresh approvalがないと再開できないauthority terminalとして扱ったことである。

さらに`CURRENT_RULES` R1.5、`current_structure/04`、`v1/06`は、technical前段を独立packet／terminalにせず、actual product artifact改善まで同一unitで閉じることを要求している。IM00～IM02はProduct／technical credit 0で、可視AFTERをIM07へ送ったため、現行運用はこの要求とも衝突する。

本案はここを単なる説明変更として扱わない。prior topologyの`IM00～IM09 single nonseparable unit`から、historical IM00～IM02を再開せず`IM03～IM06 atomic development unit`、その後にfresh IM07 formal authority、個別one-shot IM08／IM09 review authorityを置くtopologyへ変える。また、target §17.3でIM06 failureを直ちにSTOPへ送るapplicabilityを、IM03～IM06内のcausal development returnへ変える。これは`IMPLEMENTATION_EVALUATION_AUTHORITY_ROUTE_CHANGE=MATERIAL_PROPOSED`であり、Pro reviewとMash明示承認なしに正典へ反映しない。

### 3.2 通常開発へone-shot規則を誤適用した

R10.3 `BOUNDED_MECHANICAL_REPAIR`の本来の目的は、失敗ごとにhelper、launcher、scanner、runtime、fallbackを増やして、商品本体ではなく実行基盤の修復を主作業にしないことである。

ところが現行運用では、次まで同じexact1枠に入った。

- source実装後のfocused test
- fixture互換移行後の再検証
- derived identity更新後の再検証
- runtime readiness不足
- conftest／plugin dependency不足
- collection 0

これにより、「scopeを増やすことの禁止」が「正しいscopeを完了するための因果修正禁止」へ変質した。

### 3.3 formalと呼ぶ時点が早すぎた

runtime正本とRule 16の「formal commandをOSへ渡した時点でconsumption」は維持できる。誤りは、version probe、required-role smoke、target dependency、conftest／plugin import、collect-only、expected denominator照合を閉じる前のcommandを`formal`と呼んだことである。

修正後は次のexact2 operationを分ける。

| operation | 目的 | failure時 | formal attempt |
|---|---|---|---:|
| pre-admission operation | runtime／harness／collection／denominatorをfreeze前に閉じる | §7.1 exclusive classifier exact1でdevelopment return／R10.3／named STOPへ分岐 | 0 |
| formal command | pre-admission PASS済みのfrozen bundleを一回評価する | authorityを閉じ、fresh Level 3 correction待ち | OS launch request時に1 |

formal command起動後は、pytest setup／callへ到達しなくても消費を巻き戻さない。pytest内部eventを観測する新hookは追加しない。

### 3.4 横切りの実装順がmigration failureを作った

IM00は、actual producerがない段階で`ForegroundScope`型／validatorや`WholeReadingConsequenceRow` validatorをsynthetic fixture中心で先行実装した。

IM01でactual producer接続を行う際、旧IM00 fixtureの型移行が必要となり、その完了前にtestが起動された。これは偶然のfixture事故ではなく、contract shellとactual producerを別checkpointへ切った順序が作った事故である。

以後は次を同じcheckpointで閉じる必要がある。

```text
contract
+ actual producer
+ actual consumer
+ existing caller/fixture/serializer/comparator migration
+ focused test
```

### 3.5 IM02とIM03に依存逆転がある

対象設計§6.5は、次を必須にする。

```text
WholeReadingConsequenceRow.baseline_semantic_signature
  == 当該 candidate.semantic_signature
```

また`InputSpecificityEvidence.whole_reading_consequence_refs`は、candidateが保持するRequired Differenceへbindされる。

しかし§17では、IM02がWholeReadingConsequence row発行を完了し、IM03がcandidate、semantic signature、evidence、hard validity、selectionを実装する。つまりproducerが必要inputより先に置かれている。

actual runtimeはこの矛盾を避けるため、`derive_input_specific_meaning_structure()`で次を返す。

```text
whole_reading_consequence_rows = ()
```

code commentも、candidate semantic signaturesはIM03で来るためIM02でpre-candidate baselineを捏造しないと明示する。

`issue_whole_reading_consequence_row()`関数とdirect unit testは存在する。しかしproduction disabled pipelineからactual rowは一件も発行されない。validatorもrowsをfor-loop検査するだけで、Required Differenceがある場合のnonzero／coverageを要求しないため、row exact0のままGREENになる。

したがって、現行IM02の正確な到達点は次である。

```text
implemented:
  DifferenceConfiguration
  ObservedDifference
  RequiredDifference
  mutation
  RequirementBundle
  WholeReadingConsequence issuer callable

not_yet_integrated:
  candidate-bound WholeReadingConsequence actual issuance
  evidence back-bind
  nonempty/full-coverage hard validity
```

これは意味構造の否定ではなく、実装順の誤りである。

### 3.6 compositionの再導出はsecond-owner riskを持つ

current response pathはpre-Receptionで`InputSpecificMeaningStructure`を一度deriveして保存する。composition `_validate_phase_A()`は同じderive関数を再実行し、exact equalityを要求する。

IM02までは純関数の二重callで一致できる。しかしIM03でcandidate signature、row発行、selectionを導入した場合、compositionも同じ意味決定を再実行しない限り一致できない。再実行すれば意味決定ownerが二箇所になり、再実行しなければrowが空のままになる。

Ultra案では、technical ownerを次へ確定する。

```text
emlis_input_specific_meaning.py
  candidate core construction
  candidate semantic signature
  WholeReadingConsequenceRow issuance
  InputSpecificityEvidence construction
  hard validity
  candidate selection / LIMITED decision
  sealed InputSpecificMeaningStructure
  = sole meaning owner

emlis_stage1_response.py
  sole ownerをexact1回orchestrate
  sealed typed artifactをresponse stateへcarry
  candidate enumerate/select/reselect = 0

emlis_stage1_composition.py
  schema validation
  identity recomputation/verification
  binding/non-mutation validation
  tagged dispatch
  candidate derive/enumerate/select/reselect = 0
```

現行`InputSpecificMeaningStructure`はschemaを含むexact9 fieldのIM02 aggregateであり、candidate、evidence、`MeaningDecisionOutcome`を保持できない。このまま「既存typeを使う」だけではevidence refがdanglingし、compositionは再導出なしに検証できない。

Ultra案はparallel carrierやregistry serviceを新設せず、既存`InputSpecificMeaningStructure`をcurrent forward root `v1.1` exact12へ一括migrationする。先頭exact9のfield名と宣言順は保持するが、current runtimeがadmitするroot shapeはv1.1 exact12だけである。

```text
InputSpecificMeaningStructure v1.1 exact12 = (
  # existing exact9 field names/order retained inside current v1.1
  schema_version = "1.1",
  difference_configuration_derivation,
  configurations,
  observed_distinction_rows,
  counterfactual_mutation_rows,
  required_difference_rows,
  requirement_bundle_derivation,
  requirement_bundles,
  whole_reading_consequence_rows,

  # additive exact3
  candidate_records: tuple[InputSpecificMeaningCandidate, ...],
  input_specificity_evidence_records: tuple[InputSpecificityEvidence, ...],
  meaning_decision_outcome: MeaningDecisionOutcome,
)
```

rootの`schema_version="1.1"`だけを上げ、nested existing contractの各`schema_version`は現行`"1.0"`のまま保つ。current runtimeはrootとnestedで`_FOREGROUND_SCOPE_SCHEMA_VERSION="1.0"`を共有しているため、そのconstantをglobalに`1.1`へ変えてはならない。single Python dataclassは末尾exact3を含むrequired exact12へ一度だけmigrationし、additive exact3に`Optional`、constructor default `None`、omit branchを置かない。current caller／fixture／serializer／comparator／tuple-field assertionをIM03～IM06 atomic unit内で同時migrationする。

current forward admission matrixは次のexact1だけである。

| root serialized/logical payload | additive exact3 | nested existing versions | current admission |
|---|---:|---|---|
| `1.1` exact12 | all required/present | 全て`1.0` | admit |
| `1.0` exact9 | not applicable | 全て`1.0` | reject; historical Git evidence only |
| `1.1` with any additive missing／null | missing／null | any | reject incomplete migration |
| any other root version／shape | any | any | reject foreign root contract |
| `1.1` exact12 | all present | nestedに`1.1`混入 | reject unintended global bump |

既存`validate_input_specific_meaning_structure`はcurrent root `1.1` exact12だけをadmitし、先頭exact9の既存validator logicをnested-v1.0 modeとして再利用した後、additive exact3を検証する。root v1.0 decoder／validator branch、別v1.0 dataclass、parallel carrierは作らない。

```text
CURRENT_FORWARD_ROOT_VERSION = "1.1"

ROOT_TUPLE_FIELDS_V1_1 = (
  configurations,
  observed_distinction_rows,
  counterfactual_mutation_rows,
  required_difference_rows,
  requirement_bundles,
  whole_reading_consequence_rows,
  candidate_records,
  input_specificity_evidence_records,
)

input_specific_meaning_structure_canonical_payload(root):
  require root.schema_version == CURRENT_FORWARD_ROOT_VERSION
  require all exact12 fields present and non-null
  return declaration-name/value map of exact12
```

rootのcanonical bytes／manifest identity／serializerは必ずcurrent exact12 payloadを通し、generic root serializationとnon-versioned `_STAGE1_TUPLE_FIELDS`判定を禁止する。dataclass `fields()` assertionとlogical／serialized key assertionはいずれもexact12へrebaseする。nested canonicalizationは現行helperを変更しない。historical v1.0はGit history、historical receipt、既存commit／test resultだけで保持し、current production-disabled runtimeでdecode／admitしない。実在する永続済みv1.0 consumerがfreshに発見された場合だけ、対象と必要期間を明示した別のmaterial decisionへ戻す。

`MeaningDecisionOutcome`は対象設計既存の`SelectedEmlisProvisionalReading | LimitedMeaningOutcome`をそのまま使う。別のoutcome familyを作らない。`input_specificity_evidence_records`に新しい`evidence_id` fieldは足さず、§3.6のderived `EVIDENCE_ID`をrequest-local lookup keyにする。

`candidate_records`はhard validityを通ってselectionへ入ったdeterministic candidate setだけを持つ。row欠落等でhard-invalidとなったdraft candidateを、不正なevidence ref付きの`InputSpecificMeaningCandidate`としてcarrierへsealしない。reject理由はdeterministic enumeratorのdevelopment test evidenceまたはbody-free diagnosticだけに残し、`meaning_decision_outcome.decision_trace`、selected reading identity、formal result identityへ混ぜない。reject inventoryをcarrierへ追加せず、carrier直下の第13 fieldやparallel trace ownerも作らない。NORMALではselected refがこのsetのexact1へ解決し、`LIMITED_COMPETING_MATERIAL_READINGS`では競合するhard-valid candidatesを保持できる。structure-insufficient／no-required-difference LIMITEDではcandidate／evidence／whole-reading row records exact0を許す。

carrier tuple orderもselectorにしないまま決定的に閉じる。dedupe keyは保存済みIDやsignature単独ではなく、actual sourceからrecomputedした`CANDIDATE_CORE_ID_PREIMAGE_EXACT19`のcanonical bytes／そこから導出した`CANDIDATE_CORE_ID`である。exact19 core projectionが完全一致するdraftだけをseal前にdedupe exact1とする。同じsemantic signatureでもsource evidence、basis provenance、epistemic tier、approved derivation、material unknown、protected difference、source qualifierのいずれかが異なるcandidateはdistinctのままselectionまで保持する。tuple orderはrecomputed signature bytes、次にrecomputed exact19 canonical bytesで閉じ、ID／hash／列挙順をselection keyにしない。同一core projectionなのにderived evidenceが異なる場合は任意の一方を残さず`IM03_THROUGH_IM06_IMPLEMENTATION_RED`とする。同じ可視意味へ到達する複数candidateはdedupeではなくtier partition、minimal sufficiency、compatible aggregation、selection reasonで処理する。`input_specificity_evidence_records`はcandidate orderへ1対1で追従し、独立sortしない。`whole_reading_consequence_rows`は後述する現行runtime semantic row orderをそのまま使う。

sole ownerはtupleを一度構築してimmutable v1.1 carrierへ格納する。responseは同じobject/refをexact1 carryする。compositionは受領tupleからrequest-local read-only mapをその場で作るだけで、永続registry、service、file、second carrierを作らない。

```text
candidate_id uniqueness = exact
derived EVIDENCE_ID uniqueness = exact
consequence_id uniqueness = exact
every candidate evidence ref resolves = exact1
every evidence candidate ref resolves = exact1
every evidence consequence ref resolves = exact1
every candidate is reverse-owned by evidence = exact1
every evidence is reverse-owned by candidate = exact1
every consequence row is owned by evidence/candidate = exact1

for every candidate c:
  exact1 evidence e exists where EVIDENCE_ID(e) == c.input_specificity_evidence_ref
  e.candidate_ref == c.candidate_id

for every evidence e:
  exact1 candidate c exists where c.candidate_id == e.candidate_ref
  c.input_specificity_evidence_ref == EVIDENCE_ID(e)

carrier candidate ID set
  == canonical reverse-owner set of all evidence.candidate_ref
carrier derived evidence ID set
  == canonical union of all candidate.input_specificity_evidence_ref
carrier consequence ID set
  == canonical union of all evidence.whole_reading_consequence_refs

orphan/extra candidate = 0
orphan/extra evidence = 0
orphan/extra consequence row = 0

NORMAL outcome:
  candidate_records cardinality = exact1+
  selected_candidate_ref resolves = exact1
  selected candidate evidence resolves = exact1
  selected candidate primary_component_refs cardinality = 1..5
  primary_reading_focus_ref == selected candidate.primary_component_refs[0]
  supporting_facet_refs == selected candidate.primary_component_refs[1:]  # 0..4
  reading_component_refs == selected candidate.primary_component_refs
  reading_relation_refs == selected candidate.relation_path_refs
  qualified_event_state_refs == selected candidate.qualified_event_state_refs
  basis_provenance_rows == selected candidate.basis_provenance_rows
  basis_epistemic_tier == selected candidate.basis_epistemic_tier
  reading_status == selected candidate.emlis_reading_status
  unresolved_alternative_refs == selected candidate.material_unknown_refs
  every unresolved_alternative_ref resolves in the same source/unknown owner graph
  reading_id == SELECTED_READING_ID(recomputed declared projection)

LIMITED outcome:
  selected_candidate_ref field = absent by tagged union
  ReadingConsequence = 0 until IM04 LIMITED branch remains 0

LIMITED_COMPETING_MATERIAL_READINGS:
  product_acceptance_eligible = true

  upstream scope-competition subcase:
    derivation_state_ref = COMPETING_MATERIAL_SCOPES
    candidate/evidence/consequence-row records = exact0
    unresolved_alternative_refs
      == ForegroundScopeDerivation.unresolved_scope_refs
    retained foreground source refs
      == ForegroundScopeDerivation.retained_foreground_source_object_refs

  downstream candidate-competition subcase:
    derivation_state_ref = LIMITED_COMPETING_MATERIAL_READINGS
    candidate/evidence records = exact2+
    every candidate is hard-valid
    every candidate has consequence rows exact1+
    unresolved_alternative_refs == canonical candidate ID set

LIMITED_NO_SAFE_INPUT_SPECIFIC_CONFIGURATION:
  candidate/evidence/consequence-row records = exact0
  derivation_state_ref in (THIN_NO_SAFE_CONFIGURATION, NO_REQUIRED_DIFFERENCE)
  product_acceptance_eligible = true

LIMITED_STRUCTURE_INSUFFICIENT:
  candidate/evidence/consequence-row records = exact0
  derivation_state_ref = UPSTREAM_STRUCTURE_INSUFFICIENT
  product_acceptance_eligible = false
```

次の空白状態をNORMALまたはLIMITEDへ変換しない。

```text
Foreground / configuration = AVAILABLE
Required Difference cardinality = exact1+
deterministic candidate pool generation = COMPLETE
candidate pool cardinality = exact1+
hard-valid candidate cardinality = exact0
existing closed LIMITED derivation state cardinality = exact0

=> IM03_THROUGH_IM06_IMPLEMENTATION_RED
=> InputSpecificMeaningStructure seal = 0
=> Reception = 0
=> visible artifact = 0
```

これは入力の意味不足ではなく、candidate generator、mutation producer、evidence construction、hard-validity implementationの未完成である。新しいLIMITED reasonを作らない。downstream `LIMITED_COMPETING_MATERIAL_READINGS`へ進めるのはhard-valid candidate exact2+が残り、商品上のmaterial tieを解消できない場合だけである。

同じ`LIMITED_COMPETING_MATERIAL_READINGS` tagには、IM01でscopeをexact1へ閉じる前の競合と、IM03でhard-valid candidateを比較した後の競合がある。`derivation_state_ref`は既存のdistinct literal `COMPETING_MATERIAL_SCOPES`／`LIMITED_COMPETING_MATERIAL_READINGS`をそのまま使い、新prefix grammar、field、outcome tag、enumを増やさず両者を区別する。upstream subcaseへ架空candidateを作らず、downstream subcaseからrowsを落とさない。

candidateの`primary_component_refs`はtarget §6.3の「primary focus exact1＋supporting facets 0..4」を運ぶ既存fieldとして、宣言順の先頭exact1をprimary、残り0..4をsupportingと明記する。別のfacet carrier fieldをcandidateへ追加しない。sole ownerは`project_selected_reading(candidate, carrier lookup)`という同module内pure projectionをexact1回使い、上のfieldsと`selection_reason_codes`を構築する。compositionは同じpure projectionによるexact equalityだけを検証し、候補比較やwinner再選択をしない。

`SELECTED_READING_ID`は`reading_id`を除く`SelectedEmlisProvisionalReading`全declared fieldsのcanonical bytesからversioned domain-separatedに導出する。`decision_trace`はreading IDを参照せずcandidate／source refsだけを持たせ、identity cycleを作らない。保存済みoutcomeについて、projection、trace、reading IDの順で再計算する。

target設計は`MeaningDecisionTrace`を参照するがfield宣言を持たないため、実装前に同じoutcome内のbody-free nested value objectとして次へ閉じる。

```text
MeaningDecisionTrace exact2 = (
  schema_version = "1.0",
  rows: tuple[MeaningDecisionTraceRow, ...],
)

MeaningDecisionTraceRow exact4 = (
  trace_kind: SELECTED | NONSELECTED_VALID | LIMITED_BASIS,
  candidate_ref: Optional[str],
  reason_codes: tuple[str, ...],  # closed, exact1+
  source_refs: tuple[str, ...],   # exact1+
)
```

`reason_codes`を自由文字列にしない。sealed wireでは同じversioned `MeaningDecisionReasonCode` exact10をtrace、`selection_reason_codes`、`outcome_reason_codes`で共用し、別registryを作らない。

```text
SEL00 = target §8.2 basis-provenance-tier partition
SEL01..SEL06 = target §8.2 selection items 1..6とone-to-one
LIM01 = LIMITED_NO_SAFE_INPUT_SPECIFIC_CONFIGURATION
LIM02 = LIMITED_STRUCTURE_INSUFFICIENT
LIM03 = LIMITED_COMPETING_MATERIAL_READINGS

WIRE_MEANING_DECISION_REASON_CODE_EXACT10 = SEL00..SEL06 + LIM01..LIM03

HV01..HV12 = development-only hard-validity evidence code
HV01..HV12 in sealed trace / carrier / reading identity / formal result identity = 0
```

tuple orderは上のdomain declaration orderとし、unknown code、free text、case ID、surface tokenをrejectする。

`trace_kind`ごとのreason-code domainを次へ固定し、異なるdomainのcodeを混ぜない。

```text
SELECTED.reason_codes          = nonempty subset of SEL00..SEL06
NONSELECTED_VALID.reason_codes = nonempty subset of SEL00..SEL06
LIMITED_BASIS.reason_codes     = exact1 of LIM01 | LIM02 | LIM03

NORMAL:
  SELECTED row = exact1
  selection_reason_codes
    == selected row.reason_codes in MeaningDecisionReasonCode declaration order

each LIMITED outcome:
  LIMITED_BASIS summary row = exact1
  outcome_reason_codes
    == that summary row.reason_codes in MeaningDecisionReasonCode declaration order

downstream LIMITED_COMPETING_MATERIAL_READINGS:
  LIMITED_BASIS(candidate_ref absent, reason_codes=(LIM03,)) = exact1
  NONSELECTED_VALID(candidate_ref present) = exact1 per competing carrier candidate
  SELECTED row = 0
```

これにより、candidateごとの非選択理由とbranch全体の`LIM03`を混同せず、outcome側の理由tupleをtraceと別生成しない。

trace row orderもidentity-relevantなので次へ閉じる。

```text
TRACE_KIND_ORDER = (SELECTED, NONSELECTED_VALID, LIMITED_BASIS)

TRACE_SOURCE_OWNER_PRECEDENCE = (
  observation contribution,
  source relation,
  interpretation candidate,
  source qualifier,
  material unknown,
  approved derivation rule,
  grounded graph object/edge,
  foreground derivation/scope source,
  carrier configuration,
  carrier requirement bundle,
  carrier required difference,
  carrier counterfactual mutation,
  carrier whole-reading consequence,
)

canonical source_refs = stable order by (
  TRACE_SOURCE_OWNER_PRECEDENCE index,
  resolved owner's semantic declaration position,
)

each source ref resolves in exact1 owner/domain across the full union

TRACE_ROW_CANONICAL_KEY = (
  TRACE_KIND_ORDER index,
  carrier candidate order index or ABSENT sentinel,
  canonical source_refs rank tuple,
  MeaningDecisionReasonCode declaration-order tuple,
)

decision_trace.rows == stable_sort(rows, TRACE_ROW_CANONICAL_KEY)
duplicate full row/key = 0
```

新service／registry／carrierにはしない。`LIMITED_BASIS`はcandidate_ref absent、`SELECTED`／`NONSELECTED_VALID`のrowはcarrier candidateへexact1解決させる。NORMAL traceは`SELECTED` exact1とcarrier内unselected candidateの`NONSELECTED_VALID` dispositionを閉じる。downstream candidate-competition traceは`LIM03`の`LIMITED_BASIS` summary exact1に加え、candidate set exact2+を各`NONSELECTED_VALID` row exact1、winner 0で閉じる。upstream scope-competition／NO_SAFE／STRUCTURE_INSUFFICIENT traceは対応する`LIM03`／`LIM01`／`LIM02`の`LIMITED_BASIS` summary exact1、candidate ref 0でderivation state／source refへbindする。

compositionがexact completenessを検証するのは、carrierへsealされたselected／nonselected candidate setとtag別`LIMITED_BASIS` summaryだけである。hard-invalid draftはsealed traceへ存在しない。enumerated draft、reject reason、duplicate rejectの完全性はsole ownerのdeterministic development test evidenceまたはbody-free diagnosticが所有し、sealed carrier／selected reading identity／formal result identityへ入れない。compositionはcandidate enumeration／hard-validityを再実行せず、sealed rowのshape、wire exact10 closed code、source resolution、canonical order、sealed trace ID bindingだけを検証する。foreign、carried-candidate／branch-summaryのmissing、duplicate、noncanonical-order、post-seal trace tamperをrejectする。

target設計で参照だけされ、PR #3 headでsymbol exact0の`BasisProvenanceRow`と`SemanticLossCode`も、IM03開始前に同じcontract内で最小closureする。未定義symbolを実装者ごとのdict／free stringにしない。

```text
BasisProvenanceRow exact6 = (
  schema_version = "1.0",
  basis_kind: RELATION_BRIDGE | QUALIFIED_EVENT_STATE,
  basis_ref: str,
  basis_epistemic_tier: SOURCE_EXPLICIT | RULE_ADMITTED_PROVISIONAL,
  source_evidence_refs: tuple[str, ...],       # exact1+
  approved_derivation_refs: tuple[str, ...],  # SOURCE_EXPLICIT=0, PROVISIONAL=exact1+
)

SemanticLossCode = existing DifferenceInvariantCode alias  # exact10, no new enum
```

provenance rowはcandidateの各`relation_path_ref`、次に各`qualified_event_state_ref`へexact1ずつ対応し、そのcandidate ref orderに従う。`basis_ref`はsame Phase-A ownerへexact1解決し、source evidenceはownerのevidenceとexact一致する。`SOURCE_EXPLICIT` rowはapproved derivation ref 0、`RULE_ADMITTED_PROVISIONAL` rowはexisting approved derivation rule ref exact1+とする。candidate tierは全row SOURCE_EXPLICITならSOURCE_EXPLICIT、それ以外はRULE_ADMITTED_PROVISIONALへ再計算する。selected readingは同じtupleをexact carryする。

`SemanticLossCode`は新enumにせず、existing `DifferenceInvariantCode` exact10のversioned type aliasとする。protected invariantは`preserved_difference_refs`が解決する`RequiredDifferenceRow.invariant_codes`からその場で導出し、duplicate fieldへ保存しない。candidateの`semantic_loss_codes`はcandidate constructionで実際にlost／collapsedしたinvariant codeのcanonical declaration-order unionである。unsealed draftのhard-validity判定まではnonemptyになり得るが、required invariant loss exact1+はhard-invalidでseal／select 0とするため、carrierへ入る全hard-valid candidateは`semantic_loss_codes=()`でなければならない。保存軸の一覧をこのfieldへ入れず、foreign code、実損失とのmissing／extra、別順序をrejectし、別loss registry／`protected_invariant_codes` fieldを作らない。`BasisProvenanceRow` definitionとこのalias closureはtechnical／validity material proposalとしてPro／Mash承認対象に含める。

actual lossの導出を実装者判断へ残さない。sole meaning owner内のpure function `derive_candidate_semantic_loss_codes()`は、別registryを作らず、carrier／Phase-A lookup、既存`DifferenceInvariantCode` declaration order、`RequiredDifferenceRow`、`CounterfactualMutationRow`、recomputed typed signatureだけを使う。

```text
PROTECTED_DIFFERENCE_ROWS =
  preserved_difference_refsをcarrier RequiredDifference semantic orderでexact1 resolve

PROTECTED_INVARIANT_CODES =
  PROTECTED_DIFFERENCE_ROWS.invariant_codesの
  DifferenceInvariantCode declaration-order union
  # derived only; candidate fieldとして保存しない

ACTUAL_SEMANTIC_LOSS_CODES = derive_candidate_semantic_loss_codes(
  candidate source refs without candidate_id/evidence_ref/semantic_loss_codes,
  recomputed MeaningSemanticSignature exact13,
  PROTECTED_DIFFERENCE_ROWS,
  each row's exact1 CounterfactualMutationRow,
  request-local Phase-A/carrier lookup,
)
```

各invariant codeのpreservation predicateは次のexact10で固定する。必要leaf setは`RequiredDifferenceRow`→`CounterfactualMutationRow.target_component_refs`／`retention_duty_refs`をPhase-Aへ解決し、同じownerのtyped source-to-signature projectionで作る。raw text、surface token、candidate ID、hash、enumeration orderによる推定は0である。

| `DifferenceInvariantCode` | recomputed candidateでexact比較するowner／lane |
|---|---|
| `ENDPOINT_COLLAPSE` | source-bound endpoint/component semantic keysと`input_center_keys` |
| `DIRECTION_REVERSAL` | source-bound relation refsと`relation_direction_keys` |
| `WORLD_COLLAPSE` | source-bound world／owner refsと`world_or_owner_distinction_keys` |
| `ROLE_COLLAPSE` | source-bound role refsと`component_role_keys`／component role keys |
| `TEMPORAL_COLLAPSE` | source-bound time／aspect refsと`temporal_state_keys`／`episodicity_boundary_keys` |
| `POLARITY_REVERSAL` | source-bound polarity refsと`modality_polarity_or_limitation_keys` |
| `MODALITY_PROMOTION` | source-bound modality／epistemic refsと`epistemic_state_keys`／`modality_polarity_or_limitation_keys` |
| `UNKNOWN_ERASURE` | source-bound material-unknown refsと`material_unknown_refs`／`resolution_treatment_keys` |
| `EXPLICIT_LIMIT_ERASURE` | source-bound limit／scope／qualifier refsと`modality_polarity_or_limitation_keys`／`qualifier_keys` |
| `REQUIRED_RETENTION_ERASURE` | rowの全`retention_duty_refs`がcandidate source projectionとtyped signature leafへexact1解決 |

処理順は次へ固定する。

1. candidate skeletonのsource refsとprovenanceをowner mapへexact1解決する。
2. actual typed sourceから`MeaningSemanticSignature` exact13を再構築する。
3. protected difference row／mutation／retention dutyを解決し、上のexact10 predicateをcodeごとに評価する。
4. source側required leafがcandidate projectionでmissing／collapsedなら、そのcodeだけをloss setへ加える。
5. source target exact1なのにclosed mutation applicationがno-op／code `None`、predicate mapping不能、ref ambiguousならlossへ推定せず`IM03_THROUGH_IM06_IMPLEMENTATION_RED`とする。
6. actual loss setを`DifferenceInvariantCode` declaration orderへcanonicalizeし、draftの`semantic_loss_codes`へexact比較する。missing／extra／foreign／permutationはrejectする。
7. expected loss exact1+ならhard-invalidとしてsealed candidate ID／evidence／selectionを作らない。
8. expected loss exact0のhard-valid draftだけ、`semantic_loss_codes=()`を含むsource projection exact18→recomputed signatureを加えたexact19→`CANDIDATE_CORE_ID`の順で算出する。

validatorも同じpure functionと同じ順序を使い、stored loss tupleやstored signatureからlossを正当化しない。これにより`semantic_loss_codes`はcore IDより前に決まり、未定義値をexact19へ入れない。

`WholeReadingConsequenceRow.baseline_semantic_signature`とcounterfactualはcandidate-boundなので、v1.1 carrier内の同一rowを複数candidate／evidenceで共有してはならない。candidate exact1 ↔ evidence exact1を閉じ、そのevidenceが参照するrow集合もcandidateごとにdisjointとする。このinverse closureまで満たして初めてrequest-local lookupをclosedと判定する。

compositionはschema、identity、ref resolution、binding、non-mutation、tagged outcomeを検証し、candidate列挙、hard-validity判定、winner selection、LIMITED decisionを再実行しない。current runtimeがadmitするforward carrierはv1.1 exact12 requiredのexact1だけである。historical v1.0はGit history／historical receipt／existing commitで保持し、current runtimeでdecodeしない。constructor、serializer、fixture、tuple-field validation allowlistのmigrationをIM03～IM06 atomic allowlist内で一度に行う。

candidateとevidenceの非循環identityは、対象設計書§6.4とruntimeで実在するcontractの宣言順へexactに合わせる。曖昧な`candidate semantic fields`という集合名は使わない。

重要なcurrent factとして、mashos-api PR #3 headでは`InputSpecificMeaningCandidate`と`InputSpecificityEvidence`はまだruntime未実装であり、symbol exact0である。candidate exact21／evidence exact5は対象設計blob `a6fb61…`のproposed contract、`MeaningSemanticSignature` exact13／`WholeReadingConsequenceRow` exact9はruntime実在contractである。以下はその両者を接続する**proposed additive construction clarification**であり、既存実装済みidentityであるかのように扱わない。

`InputSpecificMeaningCandidate`はexact21 fieldである。最終core identityには次のexact18だけをこの順で使う。ただしconstructionは、`semantic_loss_codes`を除く宣言順exact17でactual sourceを解決し、signature再構築→loss導出→hard validityの後にexact18を完成させる。未導出lossをsignatureやIDの入力にしない。

```text
CANDIDATE_SEMANTIC_SOURCE_PROJECTION_EXACT18 = (
  schema_version,
  reading_operation,
  basis_contribution_refs,
  basis_configuration_refs,
  requirement_bundle_refs,
  primary_component_refs,
  relation_path_refs,
  qualified_event_state_refs,
  basis_provenance_rows,
  basis_epistemic_tier,
  basis_derivation_refs,
  source_qualifier_refs,
  preserved_difference_refs,
  material_unknown_refs,
  forbidden_promotion_codes,
  forbidden_semantic_collapse_refs,
  semantic_loss_codes,
  emlis_reading_status,
)

CANDIDATE_SEMANTIC_SOURCE_PROJECTION_EXCLUDED_EXACT3 = (
  candidate_id,
  input_specificity_evidence_ref,
  semantic_signature,
)

CANDIDATE_PRELOSS_SOURCE_PROJECTION_EXACT17 =
  CANDIDATE_SEMANTIC_SOURCE_PROJECTION_EXACT18
  minus semantic_loss_codes
  # remaining declaration order unchanged
```

candidate contractに`mutable runtime metadata` fieldはないため、実装者判断で追加の除外fieldを作らない。field追加、順序変更、canonicalization変更はcontract changeとしてSTOPする。

`semantic_signature`はdigest文字列へ置換しない。現行`MeaningSemanticSignature` exact13のtyped structureを、次の宣言順で構築する。

```text
CANDIDATE_SEMANTIC_SIGNATURE_EXACT13 = MeaningSemanticSignature(
  schema_version,
  reading_operation,
  input_center_keys,
  component_role_keys,
  relation_direction_keys,
  epistemic_state_keys,
  temporal_state_keys,
  resolution_treatment_keys,
  world_or_owner_distinction_keys,
  modality_polarity_or_limitation_keys,
  episodicity_boundary_keys,
  qualifier_keys,
  component_semantic_keys,
)

MeaningComponentSemanticKey_EXACT5 = (
  typed_predicate_key,
  semantic_kind_key,
  owner_key,
  scope_key,
  role_key,
)
```

signatureはcandidateのpreloss exact17が参照するactual typed component／relation／qualified event-stateからcontent-bearing keyを正規化して作る。`semantic_loss_codes`、`candidate_id`、request-local ID、raw text、fixture ID、evidence ref、hash、列挙順をsignature inputにしない。validatorはpreloss exact17から到達するactual source structureからsignature exact13を**再構築**し、保存済み`semantic_signature`とexact比較する。その後に同じsignatureとprotected difference graphからlossを再導出する。保存値そのものを入力にして保存値を正当化する自己hashは禁止する。

core identityはsignatureを除外したexact18だけではunder-boundになる。したがって、保存値ではなく上で再構築・検証したtyped signatureを最後に加えたexact19を使う。

```text
CANDIDATE_CORE_ID_PREIMAGE_EXACT19 = (
  CANDIDATE_SEMANTIC_SOURCE_PROJECTION_EXACT18 in declaration order,
  recomputed CANDIDATE_SEMANTIC_SIGNATURE_EXACT13,
)

CANDIDATE_CORE_ID_PREIMAGE_EXCLUDED_EXACT2 = (
  candidate_id,
  input_specificity_evidence_ref,
)

CANDIDATE_CORE_ID_PAYLOAD = {
    "schema_version": schema_version,
    "reading_operation": reading_operation,
    "basis_contribution_refs": basis_contribution_refs,
    "basis_configuration_refs": basis_configuration_refs,
    "requirement_bundle_refs": requirement_bundle_refs,
    "primary_component_refs": primary_component_refs,
    "relation_path_refs": relation_path_refs,
    "qualified_event_state_refs": qualified_event_state_refs,
    "basis_provenance_rows": canonical validated basis_provenance_rows,
    "basis_epistemic_tier": basis_epistemic_tier,
    "basis_derivation_refs": basis_derivation_refs,
    "source_qualifier_refs": source_qualifier_refs,
    "preserved_difference_refs": preserved_difference_refs,
    "material_unknown_refs": material_unknown_refs,
    "forbidden_promotion_codes": forbidden_promotion_codes,
    "forbidden_semantic_collapse_refs": forbidden_semantic_collapse_refs,
    "semantic_loss_codes": semantic_loss_codes,
    "emlis_reading_status": emlis_reading_status,
  "semantic_signature": recomputed CANDIDATE_SEMANTIC_SIGNATURE_EXACT13,
}

CANDIDATE_CORE_DIGEST =
  sha256(stage1_canonical_json_bytes(CANDIDATE_CORE_ID_PAYLOAD)).hexdigest()

CANDIDATE_CORE_ID =
  "input-specific-meaning-candidate:"
  + CANDIDATE_CORE_DIGEST
  + "@cocolon.cmee.emlis.input_specific_meaning_candidate.v1"
```

上の`payload` commentはtupleの文字列連結を意味しない。実装はexact18の各field name/valueと`semantic_signature`を持つsingle mappingを構築し、`stage1_canonical_json_bytes`へ一回だけ渡す。digestはlowercase SHA-256 hex exact64、prefix／suffixは上のliteral exactとする。

各`WholeReadingConsequenceRow`は現行exact9 fieldを保持する。row identityだけを次の非循環順で作る。

```text
WHOLE_READING_ROW_PREIMAGE_EXACT8 = (
  schema_version,
  consequence_code,
  foreground_scope_ref,
  required_difference_ref,
  source_evidence_refs,
  counterfactual_mutation_ref,
  baseline_semantic_signature,
  mutated_semantic_signature,
)

consequence_id = existing whole_reading_consequence_id(row)
  = "whole-reading-consequence:"
    + sha256(stage1_canonical_json_bytes(EXACT8_DECLARATION_NAME_TO_VALUE_MAP)).hexdigest()
    + "@cocolon.cmee.emlis.whole_reading_consequence.v1"

required_semantic_order = order of carrier.required_difference_rows
consequence_code_order = declaration order of WholeReadingConsequenceCode

WHOLE_READING_ROWS = existing semantic order:
  stable_sort(
    full rows,
    key=(
      required_semantic_order[row.required_difference_ref],
      consequence_code_order[row.consequence_code],
      stage1_canonical_json_bytes(row.baseline_semantic_signature),
      stage1_canonical_json_bytes(row.mutated_semantic_signature),
    ),
  )
```

ここは新しいdomain separator、ID prefix、ID sortへ置換しない。PR #3 headの`_whole_reading_consequence_identity_payload()`、`whole_reading_consequence_id()`、`validate_input_specific_meaning_structure()`が持つcurrent ID／semantic orderをliteral reuseする。candidate別`whole_reading_consequence_refs`は上のglobal carrier orderをfilterした順とexact一致させ、ID／hash／列挙順をselection根拠には使わない。

`baseline_semantic_signature`は上のcandidate signatureとexact一致し、`mutated_semantic_signature`はowned counterfactual適用後の同じexact13 typeである。

ここにはcurrent runtimeのcapability gapがある。PR #3 headの`_mutation_spec()`はclosed exact12を発行する一方、`apply_counterfactual_mutation()`は次のexact5を常にbaselineのまま返す。

```text
DELETE_PREDICATE
DELETE_MODALITY
DELETE_ASPECT
DELETE_SCOPE
DELETE_QUALIFIER
```

特に`QUALIFIED_PREDICATE_OWNER_MODIFIER`は`DELETE_PREDICATE`を必ず発行するため、これはrare inputだけの話ではない。full-row coverageだけを先に有効化すると、正当なtarget inputのcandidateが実装欠落により全てhard-invalidとなり、設計済みLIMITEDにも安全に入れない。したがってIM03～IM06は、exact12 mutation kindから`MeaningSemanticSignature` exact13のtyped deltaとclosed exact7 consequence codeまでを同じatomic changeで閉じる。

| `CounterfactualMutationKind` | target-present時のexact13 delta | `WholeReadingConsequenceCode` |
|---|---|---|
| `DELETE_ENDPOINT` | bound endpoint componentと、そのrole依存relation／qualifier summaryを除去して再計算 | `RELATION_STRUCTURE_CHANGED` |
| `SWAP_ENDPOINTS` | bound exact2 endpoint roleとrole-bound qualifierを同時swap | `RELATION_STRUCTURE_CHANGED` |
| `DELETE_PREDICATE` | bound typed predicateを持つcomponent semantic keyを除去し、input-center／role／relation summaryを再計算 | `INPUT_CENTER_CHANGED` |
| `DELETE_OWNER` | bound ownerを`owner:unknown`へ置換しowner summaryを再計算 | `WORLD_OR_OWNER_DISTINCTION_CHANGED` |
| `REPLACE_WORLD` | bound world keyをclosed replacementへexact1置換 | `WORLD_OR_OWNER_DISTINCTION_CHANGED` |
| `REPLACE_ROLE` | bound roleとrole-bound qualifierをclosed replacementへ置換 | `RELATION_STRUCTURE_CHANGED` |
| `REPLACE_TIME` | bound time keyとtime-bound qualifierをclosed replacementへ置換 | `TEMPORAL_FLOW_CHANGED` |
| `DELETE_MODALITY` | bound modality keyと対応するtyped qualifier summaryを除去 | `MODALITY_POLARITY_OR_LIMITATION_CHANGED` |
| `DELETE_ASPECT` | bound aspect keyをepisodicity boundary／qualifier summaryから除去 | `EPISODICITY_BOUNDARY_CHANGED` |
| `DELETE_SCOPE` | bound scope／explicit limitation keyと対応するtyped qualifier summaryを除去 | `MODALITY_POLARITY_OR_LIMITATION_CHANGED` |
| `DELETE_QUALIFIER` | bound qualifierを除去してtyped summaryを再計算。`qualifier:not_generalized`はepisodicity、それ以外はmodality／polarity／limitation lane | target discriminatorにより`EPISODICITY_BOUNDARY_CHANGED`または`MODALITY_POLARITY_OR_LIMITATION_CHANGED` |
| `PROMOTE_UNKNOWN` | exact `resolution:unresolved`を`resolution:resolved`へ置換 | `RESOLUTION_TREATMENT_CHANGED` |

この表はfree-form推測を許すものではない。各mutationはsource ref→signature leafのclosed bindingを先に解決し、target presentなら表のdelta exact1とcode exact1を必ず返す。`DELETE_QUALIFIER`のcode分岐も上記target namespace／literalだけで決める。複数code、未知target namespace、別axisの副作用をrejectする。

```text
TARGET_ABSENT_FOR_THIS_CANDIDATE:
  source-bound target resolver = exact0
  mutation application result = None allowed
  WholeReadingConsequenceRow = 0 for that candidate/difference
  candidate draft = hard-invalid under full-coverage rule
  seal/select/Reception = 0

TARGET_PRESENT_CAPABILITY_DEFECT:
  source-bound target resolver = exact1
  but mutated signature == baseline or consequence code == None
  = IM03_THROUGH_IM06_IMPLEMENTATION_RED
  = not candidate-local None, not LIMITED, not formal attempt
```

`TARGET_PRESENT_CAPABILITY_DEFECT`をcandidate rejectへ落とすと、実装未完了を商品上の意味不足へ偽装できるため禁止する。producerとvalidatorの双方に、exact12全kindのtarget-present positive test、single intended delta、expected code、target-absent negative testを置く。full-union／per-difference exact1 validity strengtheningのactivationは、このclosureと同じcommit／atomic unitより先行させない。

対象設計の`InputSpecificityEvidence` exact5 fieldを宣言順のまま使う。contractに新しい`evidence_id` fieldを足さず、candidateの`input_specificity_evidence_ref`が参照するderived identityを次で作る。

```text
EVIDENCE_DECLARED_FIELDS_EXACT5 = (
  candidate_ref = CANDIDATE_CORE_ID,
  foreground_scope_ref,
  required_difference_refs,
  discriminative_necessity_refs,
  whole_reading_consequence_refs,
)

EVIDENCE_ID_PAYLOAD = {
    "candidate_ref": candidate_ref,
    "foreground_scope_ref": foreground_scope_ref,
    "required_difference_refs": required_difference_refs,
    "discriminative_necessity_refs": discriminative_necessity_refs,
    "whole_reading_consequence_refs": whole_reading_consequence_refs,
  "whole_reading_consequence_rows": full rows resolved in canonical ref order,
}

EVIDENCE_DIGEST =
  sha256(stage1_canonical_json_bytes(EVIDENCE_ID_PAYLOAD)).hexdigest()

EVIDENCE_ID =
  "input-specificity-evidence:"
  + EVIDENCE_DIGEST
  + "@cocolon.cmee.emlis.input_specificity_evidence.v1"
```

refsのtuple orderはidentity-relevantであり、実装者都合でsortし直さない。`whole_reading_consequence_refs`は上で定義したcanonical row orderとexact一致させる。full rowsをID preimageへ含めるため、ref先差替えでも同じevidence IDを再利用できない。

selected readingもprose-only hashにせず、projection／trace validation後に次のwire identityを使う。

```text
SELECTED_READING_ID_PAYLOAD = {
    "schema_version": schema_version,
    "selected_candidate_ref": selected_candidate_ref,
    "primary_reading_focus_ref": primary_reading_focus_ref,
    "supporting_facet_refs": supporting_facet_refs,
    "reading_component_refs": reading_component_refs,
    "reading_relation_refs": reading_relation_refs,
    "qualified_event_state_refs": qualified_event_state_refs,
    "basis_provenance_rows": basis_provenance_rows,
    "basis_epistemic_tier": basis_epistemic_tier,
    "reading_status": reading_status,
    "unresolved_alternative_refs": unresolved_alternative_refs,
    "selection_reason_codes": selection_reason_codes,
  "decision_trace": canonical validated decision_trace,
}

SELECTED_READING_DIGEST =
  sha256(stage1_canonical_json_bytes(SELECTED_READING_ID_PAYLOAD)).hexdigest()

SELECTED_READING_ID =
  "selected-emlis-provisional-reading:"
  + SELECTED_READING_DIGEST
  + "@cocolon.cmee.emlis.selected_emlis_provisional_reading.v1"
```

三つのnew IDはraw concatenation、generic `H`、implementation-default serializationを使わない。validatorはdomain／payload map、canonical bytes、lowercase exact64 digest、prefix、version suffixをfresh再計算する。各preimage leafのsingle mutationでID不一致、prefix／suffix／digest tamper、cross-domain ID swap、tuple permutation、stored signature／trace自己正当化をrejectするdedicated testsをIM03へ置く。

candidate IDをevidence ref込みの第二hashへ変換しない。対象設計の`candidate_ref` back-bind意味を保ち、candidate semantic/core identityをcandidate IDとして使う。

```text
SEALED_CANDIDATE = InputSpecificMeaningCandidate(
  candidate_id = CANDIDATE_CORE_ID,
  input_specificity_evidence_ref = EVIDENCE_ID,
  semantic_signature = CANDIDATE_SEMANTIC_SIGNATURE_EXACT13,
  remaining fields = CANDIDATE_SEMANTIC_SOURCE_PROJECTION_EXACT18,
)

EVIDENCE_CANDIDATE_BINDING =
  InputSpecificityEvidence.candidate_ref
  == InputSpecificMeaningCandidate.candidate_id
  == CANDIDATE_CORE_ID

EVIDENCE_DIFFERENCE_BINDING =
  ordered(InputSpecificityEvidence.required_difference_refs)
    == canonical_union(
         RequiredDifference refs owned by candidate.requirement_bundle_refs
       )
  and set(InputSpecificityEvidence.required_difference_refs)
        is_subset_of set(InputSpecificMeaningCandidate.preserved_difference_refs)
  and every evidence whole_reading_consequence_ref resolves to a row whose
      required_difference_ref is in evidence.required_difference_refs
```

candidate-bearing routeでは`carrier.requirement_bundle_derivation.bundle_set`をselectorへ渡したsame `RequirementBundleSet`のsole ownerとし、graph／scope membershipを次で閉じる。

```text
SELECTOR_BUNDLE_SET = carrier.requirement_bundle_derivation.bundle_set  # exact1

set(carrier.requirement_bundles.bundle_id)
  == set(SELECTOR_BUNDLE_SET.bundle_refs)

for every candidate c:
  set(c.requirement_bundle_refs)
    is_nonempty_subset_of set(SELECTOR_BUNDLE_SET.bundle_refs)

  every ref in c.basis_configuration_refs resolves exact1 in carrier.configurations
  every ref in c.basis_configuration_refs is reachable from
    canonical_union(
      bundle.anchor_configuration_ref + bundle.adjacent_configuration_refs
      for bundle in c.requirement_bundle_refs
    )

  every referenced bundle.foreground_scope_ref
    == SELECTOR_BUNDLE_SET.foreground_scope_ref

for candidate evidence e:
  e.foreground_scope_ref == SELECTOR_BUNDLE_SET.foreground_scope_ref

  e.discriminative_necessity_refs
    == canonical tuple, in evidence.required_difference semantic order, of
       each required difference's counterfactual_mutation_ref

  every discriminative necessity ref resolves exact1 in
    carrier.counterfactual_mutation_rows

  every resolved mutation is owned by exact1 e.required_difference_ref and
    is used by exact1 candidate-bound WholeReadingConsequenceRow for that difference

foreign bundle/scope/configuration/difference/mutation ref = 0
```

`discriminative_necessity_refs`のtarget domainを新proof typeへ広げず、既存`CounterfactualMutationRow.mutation_id`へ閉じる。これにより、hashだけ整合するforeign scope／foreign mutationをsealできない。target設計でこのfieldのref domainが未定義だった点を埋めるmaterial construction clarificationであり、Pro review／Mash承認前に実装既成事実としない。

hash-valid foreign refを残さないため、candidate／outcomeの全ref-bearing fieldを、sole ownerが既に受け取るimmutable Phase-A ownersとcarrierへ次のclosed mapでbindする。

| field | exact existing owner/domain |
|---|---|
| `basis_contribution_refs` | `PreMeaningGroundedInputs.observation_contribution_rows[].contribution_id`／`ordered_observation_refs` |
| `basis_configuration_refs` | carrier `DifferenceConfiguration.configuration_id` |
| `requirement_bundle_refs` | same selector `RequirementBundleSet.bundle_refs` |
| `primary_component_refs` | `GroundedMeaningGraph` object refsまたは`EmlisMeaningField.entries[].semantic_refs`のclosed union |
| `relation_path_refs` | `PreMeaningGroundedInputs.source_relation_rows[].relation_ref`またはsame graphのadmitted edge ref |
| `qualified_event_state_refs` | `PreMeaningGroundedInputs.interpretation_candidate_rows[].candidate_id`のうちtyped predicate＋owner＋required qualifierを持つqualified event/state lane |
| `basis_provenance_rows[].basis_ref` | candidateの`relation_path_refs | qualified_event_state_refs` exact1 |
| `basis_provenance_rows[].source_evidence_refs` | resolved basis ownerのsource/evidence refs exact set |
| `basis_derivation_refs`／provenance `approved_derivation_refs` | resolved interpretation/contribution ownerのexisting approved `derivation_rule_id` set |
| `source_qualifier_refs` | `PreMeaningGroundedInputs.source_qualifier_rows[].qualifier_refs` |
| `preserved_difference_refs` | carrier `RequiredDifferenceRow.difference_id` |
| `material_unknown_refs` | `PreMeaningGroundedInputs.material_unknown_refs` |
| `forbidden_promotion_codes` | resolved Phase-A interpretation candidatesの`forbidden_promotions` closed union |
| `forbidden_semantic_collapse_refs` | same component／relation／qualifier／unknown owner unionだけ |
| `semantic_loss_codes` | 本節の`DifferenceInvariantCode` alias exact10。candidate constructionで実際にlost／collapsedしたcodeのcanonical union。hard-valid sealed candidateはempty exact0。protected invariantは`preserved_difference_refs`から導出し、このfieldへ複製しない |
| LIMITED `retained_layer1_refs` | same observation contribution／ordered observation owner |
| LIMITED `foreground_source_object_refs` | `ForegroundScopeDerivation.retained_foreground_source_object_refs`かsame graph object refs |
| LIMITED `retained_qualifier_refs` | same source qualifier owner |
| trace `source_refs` | 上記Phase-A source/evidence/derivation ownersまたはcarrier内typed refのclosed union |

各tupleはowner semantic orderでcanonical dedupeする。複数owner domainを許すtrace `source_refs`だけは上記`TRACE_SOURCE_OWNER_PRECEDENCE`、次に各owner内semantic positionでcanonical化する。各ref exact1 resolution、expected namespace/type、candidate／scope lineageを要求する。missing、duplicate、foreign owner、同じbytesの別namespace解決をrejectする。request-local lookupは新registryではなく、carrierと、response／compositionが既に受け取るsealed `PreMeaningGroundedInputs`、`ForegroundScopeDerivation`、`GroundedMeaningGraph`のimmutable tupleからその場で作る。compositionはref resolution／projection equalityだけを行い、Phase-A derivationやcandidate selectionを再実行しない。

`whole_reading_consequence_refs`はcanonical row setの全`consequence_id`とexact一致し、`EVIDENCE_ID`はrefsだけでなく対応するfull row recordsにもbindする。validator順は `preloss source projection exact17 → typed signature exact13 → protected difference graph／actual loss再導出 → loss hard-validity gate → final source projection exact18 → candidate/core ID exact19 → row IDs exact8 → evidence ID exact5＋full rows → remaining sealed field/binding verification` である。candidate IDはevidence refをhashしないが、candidateのevidence ref、evidence ID再計算、candidate back-bind、difference／row full-set bindingを全部満たさなければsealed-validにしない。candidate全recordとevidence全recordのmutual hashは禁止する。

ここは二つを分けて開示する。

```text
PRODUCT_PRINCIPLES_CHANGE = 0
VALIDITY_CONTRACT_STRENGTHENING = MATERIAL_PROPOSED
```

Foreground Scope、Required Difference、meaning-before-Reception、no generic fallbackというproduct principlesは変えない。一方、target設計§6.4はevidence required refsをcandidate preserved refsのsubset、§6.5はcandidate全体でrow exact1+としているのに対し、本案は「参照bundleのrequired difference canonical unionをevidenceへexact一致させ、各differenceへmatching row exact1」を要求する。これはtechnical owner変更だけでなく、hard-valid candidate集合とNORMAL／LIMITED到達性を狭めるmaterial acceptance strengtheningである。Ultra推奨はfull coverage採用だが、Pro華恋が商品上の必要性を判定し、Mash明示承認なしには適用しない。採用しない場合は、full-union／per-difference exact1 assertionを設計・testから一括で外し、曖昧な半適用をしない。

### 3.7 working integration identityとformal bundle identityを混同した

current testはsource exact8＋manifest exact9のexact17 framed identityを持ち、source exact8のhash／byte count等をhardcodeする。IM02でも正常なsource変更後にexpected digest同期が必要だった。

開発中の変更を検知するexact17 identity自体は必要であり、IM06まで延期または廃止しない。各committed checkpointで次を行う。

- 対象path集合がapproved exact setである。
- current bytesからidentityを決定的に再計算できる。
- 同一bytesから同一identityが得られる。
- permission外pathやsource omissionがない。
- approved source変更と同じcheckpointでexpected hash／byte countを同期する。
- commit／push前にworking integration identityをGREENにする。

過去digestとの永続一致を、将来のapproved source変更を禁止するcompletion条件にはしない。working exact17はcheckpointごとにcurrent bytesへ同期し、`PRODUCT_IMPLEMENTATION_ID`とformal test／input／runtime／command bundleだけをIM07 entryでfreezeする。

既存N3 candidate runnerはhistorical frozen identity／proof constantsを保持する。これらをlive successor payloadへmonkeypatchまたは上書きしてsuccessor proofにしてはならない。

```text
HISTORICAL_N3_CONSTANT_REBIND_OR_MONKEYPATCH_AS_SUCCESSOR_PROOF = 0
N3_HISTORICAL_FAIL_CLOSED_TEST = RETAIN
IM03_06_SUCCESSOR_CURRENT_IDENTITY = DISTINCT_VERSIONED_SEAM
NEW_RUNNER_FAMILY = 0
```

IM06では同じrunner family内のdistinct versioned seamへsuccessor identityをbindする。これは既知のin-scope integration deltaであり、failure後にfresh scopeへ送らない。

### 3.8 current stateの重複記録がstale stateを作る

IM01／IM02 stateが`v1/00`、`v1/06`、current structure 01、current structure 04、mashos-api handoffへ複製されている。

PR #30 headはpush済みである一方、同一head内の一部current docsには`PENDING_PUSH`相当の古いstateが残る。

失敗ごとにReceipt／Handoff／attempt ledgerを増やしてはならない。ただしglobalな`current state owner exact1`も新設しない。

既存owner hierarchyを維持する。

- product design：意味contractと実装順の正本。
- Cocolon current structure：Cocolonから見たcurrent architecture／route。
- mashos-api runtime handoff：runtime current stateとresume情報。
- actual source／test：実装bytesとmachine evidence。

削るのは同じowner責務内の全文重複であり、異なるownerの必要なprojectionではない。

---

## 4. 維持する意味原則と、materialに変えるvalidity

本案は、以下を変更しない。

1. Route A providerless-only。
2. external AI、provider、network inference、fallback exact0。
3. source-grounded input固有意味決定。
4. `Foreground Scope`は意味決定前に閉じる。
5. `Observed Difference`と`Required Difference`を区別する。
6. `WholeReadingConsequence`を局所言い換えではなく全文読後差として扱う。
7. meaning決定はReceptionより前に完了する。
8. Reception、affect、style、realizer結果からmeaning selectorへ逆流しない。
9. request-localのpost-binding failureで別meaningへreselectionしない。
10. sufficient meaningがない時にgeneric fallbackで埋めない。
11. `LIMITED` Layer 2 exact1の責務を維持する。
12. machine GREEN、Ultra prescreen、Pro prescreen、Mash Product Readを相互変換しない。
13. public API、DB、RN、persistence、production activationを本案へ混ぜない。
14. private source、private output、user dataをGitHubへ出さない。
15. 次product authorityへのautomatic progressionはfalse。

上のproduct principlesに対する`PRODUCT_PRINCIPLES_CHANGE`は0である。ただし変更は工程境界だけではない。次はmaterial proposalとして別に承認する。

- candidate／evidence／outcomeをcarryするcurrent-forward-only root v1.1 required exact12。historical v1.0 live admission 0。
- candidate/evidence noncyclic identityとscope／graph closure。
- `MeaningDecisionTrace`のsealed exact3 kind／wire reason exact10 closure。HARD_INVALIDはdevelopment evidenceだけでsealed identityへ含めない。
- `BasisProvenanceRow` exact6の最小closureと、`SemanticLossCode`をexisting `DifferenceInvariantCode` exact10 aliasへ閉じること。
- bundle-required differenceごとのwhole-reading row exact1とevidence full-union一致。
- NORMAL／LIMITED tag別carrier cardinalityとoutcome projection。
- exact12 counterfactual mutation kindのtarget-present producer／validator closure。

特に最後から二つはhard-valid集合と商品到達性を狭める`VALIDITY_CONTRACT_STRENGTHENING=MATERIAL_PROPOSED`であり、既存meaning semantics不変という表現で隠さない。

---

## 5. 新しい構造を増やさないための修正原則

### 5.1 追加は既存contractのclosureと文書分類に限定する

以下で使う`readiness`、`development`、`freeze-ready working state`、`formal evaluation bundle`、`formal result`、`prescreen`という語は、既存工程のphaseを説明するための文書上の分類である。

runtime側のmaterial追加は、対象設計が既に要求するcandidate／evidence／outcomeを既存rootでcarryするcurrent-forward-only required exact12 migration、対象設計が名前だけ参照して未定義だった`MeaningDecisionTrace`と`BasisProvenanceRow`のshared nested value closure、`SemanticLossCode`のexisting enum aliasに限定する。`MeaningDecisionTrace`はsealed `SELECTED | NONSELECTED_VALID | LIMITED_BASIS`だけを持ち、HARD_INVALID inventoryをcarrierへ追加しない。加えて、すでにclosed exact12として宣言・発行されるcounterfactual mutationの既存producer／validator欠落を同じowner内で閉じる。いずれも新owner／service／registry／file familyではない。これ以上のruntime structureは本案から承認しない。

`PRODUCT_IMPLEMENTATION_ID`、`FORMAL_EVALUATION_BUNDLE_ID`、`FORMAL_RESULT_ID`は新しいsource型、service、file、helperではない。既存checkpointがすでに所有するsource／configuration／test／harness／runtime／input／selector／denominator／criteria／comparator／command／result identityを、prelaunch implementation、formal proof input、launch後resultの順で参照するためのderived identityである。

次は作らない。

- 新subsystem
- 新service
- 新provider
- 新runner family
- 新helper
- 新launcher
- 新scanner
- 新Receipt family
- failureごとの新rule file
- attemptごとの新handoff file
- parallel runtime
- fallback interpreter

### 5.2 試行回数ではなく変更可能scopeを固定する

```text
SAME_STATE_RERUN = 0
FORMAL_ATTEMPT_PER_FROZEN_EVALUATION_BUNDLE = 1
FAILED_FORMAL_RESULT_REUSE = 0
HUMAN_READ_PER_REVIEWER_PER_REVIEW_OBJECT = 1
SCOPE_GROWTH_WITHOUT_MASH = 0
NEW_HELPER_OR_SUBSYSTEM = 0
CONTRACT_OR_ACCEPTANCE_CHANGE_WITHOUT_MASH = 0
CAUSAL_REPAIR_WITHIN_APPROVED_ENVELOPE = ALLOWED_IM03_THROUGH_IM06_ONLY
```

`DEVELOPMENT_EXECUTION_ID`は新しいruntime field／fileではなく、各checkpointがすでに持つ次のworking identity tupleの文書上の参照名である。

```text
DEVELOPMENT_EXECUTION_ID = (
  phase/purpose,
  working source bytes identity,
  product configuration identity,
  candidate/meaning construction contract identity,
  projection/realizer configuration identity,
  working source integration identity,
  working test bytes identity,
  fixture semantics identity,
  exact input set identity,
  selector and expected denominator identity,
  protected acceptance axes identity,
  protected comparator identity,
  runtime identity,
  dependency projection identity,
  command bytes/identity,
)
```

configuration／contract／projection／axes等がsource bytesやtest bytesへ物理的に埋め込まれていても、比較時に暗黙包含へ畳まず独立したsemantic leafとして再計算する。これにより、bytesが変わっただけでcriteria changeをcausal repairと誤認することと、bytes不変の外部設定driftを見落とすことを同時に防ぐ。

同じ`DEVELOPMENT_EXECUTION_ID`を原因変更なしに再実行することは引き続き禁止する。causal repairによりこのtupleの少なくともexact1 leafが変わり、その変更がapproved allowlist内かつcriteria不変である場合だけchanged-state verificationとする。timestamp、session、actor、commit labelだけではnew identityにならない。

Rule 18のduplicate effect判定でもこのidentityを使う、というのは現行ruleの単なる解釈ではなく、本案が提案するmaterial applicability changeである。Mash明示承認後に限り、IM03～IM06 approved atomic envelope内では`DEVELOPMENT_EXECUTION_ID`ごとにdevelopment／pre-admission invocation exact1を許す。source等のsubstantive leafがapproved causal repairで変わっても、同じtarget／testを実行する点が現行Rule 18 §11.7 items 4／5／7のliteral boundaryに触れるため、承認前は実行権限にならない。同一identityの再送、counter reset、formal effectの再生成、effect成否不明時の再送は引き続き0である。

一方、IM03～IM06ではfailure evidenceに基づき、承認済みallowlist内のownerを修正した後のverificationは新しいworking stateの検証であり、blind retryではない。IM07以降にはこの継続権限を持ち込まない。

ただし、`DEVELOPMENT_EXECUTION_ID`が変わっただけでは進捗としない。無限thrashを新ID列で隠さないため、§10の既存ordered steps／acceptance checklistを有限のprogress latticeとして使う。

```text
STRICT_CAUSAL_PROGRESS = exact1 of:
  A. previous earliest failed invariant becomes satisfied,
     every earlier satisfied invariant remains satisfied,
     and the new earliest failure is strictly downstream; or
  B. within the same invariant, its unresolved obligations become a strict
     proper subset of the prior obligations, where obligations come only
     from the already-approved finite checklist.

NOT_PROGRESS = any of:
  same normalized failure signature and same unresolved obligations,
  earlier protected GREEN invariant reopens,
  new obligation/owner invented outside the approved checklist,
  bytes/ID changed without A or B.
```

各development resultは新ledgerではなく既存checkpoint／handoffへ、earliest failed invariant、normalized failure signature、finite unresolved obligation set、causal owner、R10.1 exact1 primary outcomeを記録する。`TECHNICAL_CREDIT`または`BLOCKER_NARROWED`だけが次changed-state verificationのprogress根拠になる。`ADMINISTRATIVE_ONLY`を二回連続させた場合は現行R10.2 item 1の`DETOUR_RISK_STOP`へ送る。approved causal owner exact0、protected contract変更が必要、またはnext actionを既存checklistへ対応付けられない場合も、該当する既存design／contract／scope STOPまたはR10.2 item 5／6へ送り、新しい`CAUSAL_EXHAUSTION` enum／counter／ledgerを作らない。

IM00～IM02はhistorical checkpointであり、authorityを再開、rollback、replayしない。IM03～IM06 allowlistに明示されたcompatibility migrationとしてIM00～IM02由来source／testを修正することはできるが、それはIM03～IM06のforward workであり、過去IMの再実行権限ではない。

### 5.3 atomic unit completeの定義を変える

型、validator、issuer関数、test fixtureが存在するだけではcompleteにしない。

```text
ACTUAL_VERTICAL_UNIT_CLOSURE

IM03～IM06 atomic unit COMPLETEには、少なくとも次が必要である。

1. actual producerがproduction-disabled pipelineへ接続されている。
2. actual consumerが同じtyped artifactを受け取る。
3. placeholder、empty固定、synthetic-only shortcutでない。
4. actual inputから必要cardinalityのartifactが発行される。
5. focused testがproducer-to-consumer pathを通る。
6. 次IMへ渡すinputがnon-placeholderである。
```

IM03～IM05のdurable checkpointは`IN_PROGRESS_UNIT_NOT_COMPLETE`の保存点であり、独立COMPLETE、Product credit、fresh approval Gateではない。各checkpointは`ATOMIC_UNIT_COMPLETE=false`、`PRODUCT_CREDIT=0`を維持し、`TECHNICAL_CREDIT`はremote保存・postverify済みのactual reusable evidenceに従ってexactに分類する。

さらに型、constructor、required field、identity preimage、call signatureを変更した内部checkpointは、同じIM03～IM06 bounded deltaで既存caller、fixture、serializer、comparator、runner bindingを移行する。

```text
TYPE_OR_SIGNATURE_CHANGE_UNIT_CLOSURE

旧shapeをIM06 exitへ残したままatomic unitをCOMPLETEにしない。
fixture意味を変えないcompatibility migrationはacceptance変更ではない。
```

---

## 6. 実行phaseとauthority lifecycle

### 6.1 phase表

| phase | 対象 | 反復 | failure時 | one-shot |
|---|---|---|---|---|
| Development runtime / harness pre-admission | IM03～IM06 `ACTIVE_IN_PROGRESS`内だけ | §7.0 exclusive classifier Aだけ因果補正可 | A=development return、B=Packet A conditional R10.3、C／不能=named STOP | なし |
| Pre-IM07 current-session Rule 16 admission | IM06 COMPLETE後、IM07 activate前 | Packet Bに条件付きでbindしたGate B exact1以外のrepair／rerun 0 | invalidはRule 16既存STOP。Packet B外の追加承認0 | targeted invocation 0 |
| Development construction / closure | IM03～IM06 | allowlist内のcausal repair後に可 | cause ownerへ戻る | なし |
| Frozen machine proof | IM07 | 同じevaluation bundleは1回 | any nonclearでcurrent formal authorityを閉じる | bundleごとexact1 |
| Ultra / Pro internal prescreen | IM08／IM09 | 同じreviewer・同じreview objectの読み直し0 | material defectでcurrent review authorityを閉じる | reviewer×review objectごとexact1 |
| Mash formal Product Read | IM10 | 同じpresented candidateの再読0 | non-PASSはterminal STOP | exact1 |

IM08／IM09はMashへ低品質candidateを送らないためのone-shot prescreenである。material defectを見つけた時は同じauthority内で修正／再生成／再読せず、current review objectとauthorityを閉じる。corrected candidateを扱えるのは、Mashがexact scope／input reuse／generation count／review countを持つfresh Level 3 correction authorityを明示した場合だけである。

`REVIEW_OBJECT_ID`も新しいruntime型ではない。private owner内で、ordered frozen input identity、visible body bytes identity、review axes identity、trace identityをbindした既存evidenceの参照名である。metadataだけ、commitだけ、timestampだけを変えてnew review objectにしてはならない。

### 6.2 authority lifecycle

```text
AUTHORITY_LIFECYCLE
  ACTIVE_IN_PROGRESS
    -> UNIT_COMPLETE
    -> TERMINAL_STOP
    -> MASH_EXPLICIT_CANCEL

EXECUTION_SUBSTATE while ACTIVE_IN_PROGRESS
  RUNNING <-> PAUSED_CONTINUABLE

UNIT_AUTHORITY_CONSUMPTION
  first approved effectでexact1
  以後terminalまでACTIVE_IN_PROGRESS

FORMAL_ATTEMPT_CONSUMPTION
  frozen evaluation bundleごとの内側counter。formal OS launchで1
```

approved allowlist内のdevelopment test REDは、それ自体ではIM03～IM06 authorityをterminalにしない。runtime／readiness NOT READYを一律に同じ扱いへ入れず、必ず§7.0 exclusive classifier exact1へ送る。Aの全条件を満たす場合だけnonterminal development return、BはPacket A conditional R10.3 sole owner、C／classifier不能はnamed STOPとする。session終了、context切替、Work処理落ちは、command launch exact0を確認できるもの、既存processへ再接続できるもの、またはimmutable resultを回収済みのものだけnonterminalとする。IM07 formal nonclear、IM08／IM09 material defectには同じ継続規則を適用しない。

sessionだけが変わりexecution actorが同じ場合にexecution resumeできるのは、IM03～IM06 authorityが`ACTIVE_IN_PROGRESS`で、formal attempt 0、human read 0、effect stateが全て`CONFIRMED_ZERO`または既知のreversible development `PERFORMED`である時だけである。verified durable checkpoint、head、preimage、allowlistを再照合して同じunitをresumeする。これはauthority reactivationではない。

launch済みdevelopment／pre-admission processが既存handleでaddressableなら、そのprocessへのpoll／output回収／foreground再接続はnew invocation exact0であり、same `DEVELOPMENT_EXECUTION_ID`のrerunではない。既存processを新しく起動せず、同じprocess identityとeffect recordを引き継ぐ。known REDならapproved causal repair後のchanged-state verificationへ、known PASSなら次checkpointへ進める。

process handleが消失し、launch exact0もcompleted resultも証明できない場合はeffect stateを`UNKNOWN`とする。同一`DEVELOPMENT_EXECUTION_ID`の再送は0、当該execution checkpointはnon-reusable、current IM03～IM06 authorityは既存named STOP ownerへterminal closeとする。単なるsession変更として`PAUSED_CONTINUABLE`に戻さず、fresh Mash correction authorityなしにnew command identityを作らない。新しいinterruption ledger／STOP familyは作らない。

actorが変わる場合は単純resumeにしない。execution handoffでincoming actorが作業継続できる範囲も`ACTIVE_IN_PROGRESS`のIM03～IM06だけである。既存handoff ownerで、outgoing actor、incoming actor、last safe head、working-state identity、allowlist、effect state exact3（`PERFORMED | CONFIRMED_ZERO | UNKNOWN`）、formal attempt、human read count、R10.2／R10.3／COMMON_DEFECT counter、non-reusable evidence、next exact actionを明示する。ただし継続可能集合は`PERFORMED | CONFIRMED_ZERO` exact2だけであり、`UNKNOWN`はclosure-onlyでincoming actorが実行を引き継げない。incoming actorがfreshに照合してexecution ownerを引き受け、outgoingとincomingの同時single-unit execution ownerを許さず、handoff前後でeffect／attemptを重複させない。これはauthority scopeの譲渡であってclosed authorityのreactivationではなく、新Handoff familyも作らない。

`UNKNOWN` effectは未実行とは扱わずconsumedとして閉じる。IM07 prelaunch attempt 0のsession／actor changeは、identity leafの変化を意味する`full-preimage drift`ではなく`authority-owner continuity break`である。current IM07 authority allocationはunconsumed closeする。session／workspace／environment changeでruntime continuityも失効した場合だけRule 16 Gate A／Packet Bに条件付きでbindしたGate B exact1へ進む。runtime continuityを維持したactor-only changeは、Packet Bにbindした`ACTOR_HANDOFF_REPLACEMENT_EXACT1`だけを使い、existing owner-handoffへincoming actorをbindしてreplacement IM07 allocation exact1を同じPacket B内で作る。追加Mash approval 0、old＋replacementを通じたformal OS launch total exact1、second actor break 0とする。条件不成立、UNKNOWN、drift nonzeroはPacket B terminal STOPであり、Rule 16へ誤分類しない。IM07 attempt 1、formal effect unknown、IM08／IM09 human read開始後はexecution handoff／resume 0であり、incoming actorができるのはclosure／named STOP／counterの既存owner記録だけである。

### 6.3 `AUTOMATIC_PROGRESSION=false`の意味

これを次の二つに分けて読む。

- 承認済みIM03～IM06 atomic unitをcompleteにするための内部継続：許可。
- ユーザーが依頼していない次IM、Product Read、production effectへの移行：禁止。

minimum implementation authorityをIM03～IM06 atomic unitへ固定する。IM03単独をCOMPLETEにする選択肢は置かない。IM03～IM05はdurable `IN_PROGRESS_UNIT_NOT_COMPLETE` checkpointであり、IM06 GREENとformal pre-admission PASSでunitを閉じる。中間technical creditはactual reusable evidenceに従うが、atomic completionやproduct creditへ変換しない。

IM07は別のfresh formal authority、IM08／IM09もそれぞれ現行authority／counter規則に従うone-shot gateとする。formal／human failure後のcorrection budgetをIM03～IM06 authorityへ暗黙に含めない。

checkpointは保存点であり、authorityを消費する承認Gateではない。

---

## 7. formal attemptの正確な消費境界

formal routeへ入る前に、target testが実際に辿る既存dependencyだけを`AUTHORITY_FROZEN_TARGET_DEPENDENCY_PROJECTION`としてauthorityへ固定する。これはrequirements全体やoptional dependency全体への包括許可ではない。

- projectionに含まれる既存dependency不足も§7.0のexclusive classifier exact1へ通す。既にmaterializeしたruntimeを再構築せず、追加acquisition 0で既存runtime内のcommand／environment bindingだけを直せる場合に限り、Aの全条件を満たせばsame-unit readinessへ戻す。runtime再materialization、reinstall、追加acquisitionが必要ならCのnamed STOPとする。
- projection外dependencyはnew dependency scope driftとしてSTOPする。
- IM03～IM06中にnew dependency importを追加しない。
- alternate interpreter、別network route、unfrozen version、silent installを禁止する。
- runtime materialization／network acquisition／GitHub writeをRule 18 development applicability例外へ暗黙に含めない。
- dependency artifactが既存runtime/cacheで閉じる場合は`NETWORK_ACQUISITION_COUNT=0`をPacket Aへ固定する。network取得が実際に必要な場合だけ、Packet Aでfrozen repository lock、既存approved acquisition route、`NETWORK_ACQUISITION_COUNT=1`、runtime materialization count exact1、target dependency projectionを明示する。これはdependency artifact取得だけであり、Route Aのexternal AI／provider／network inferenceは0のまま。未承認route／countでは自動取得しない。

runtimeより先にdependency projectionを閉じる順序は次のexact8である。

```text
1. actual target selectorを固定
2. target source / conftest / pytest plugin / import chainを静的解決
3. authority-frozen target dependency projectionを確定
4. repository lock / metadataとの対応を確認
5. projection内dependencyを含むruntimeをexact1 materialize
6. pytest version / required role / conftest plugin smoke
7. collect-onlyとexpected denominator照合
8. focused development test
```

### 7.0 pre-admission exclusive classifier exact1

全pre-admission resultは、formal attempt 0のまま次のexactly oneへ分類する。phase名だけでAへdefaultしない。

```text
A. DEVELOPMENT_RETURN
  actual concrete helper / launcher invocation = 0
  R10.3 exact4 event = 0
  required correction is inside approved source / test / fixture /
    dependency projection
  additional acquisition / reinstall / runtime rematerialization = 0
  development implementation or readiness is incomplete

B. R10_3_BOUNDED_MECHANICAL_REPAIR
  actual concrete helper / launcher invocation = 1
  measured event is exact1 of current R10.3 exact4
  development returnとの二重計上 = 0

C. NAMED_STOP
  dependency projection外
  or new product dependency
  or scope / contract / denominator / comparator / fixture meaning change
  or external route / fallback
  or new helper family
  or additional acquisition / reinstall / runtime rematerialization required
```

AだけがIM03～IM06 developmentへ戻る。BはPacket Aに条件付きでbindしたR10.3 authority exact1、mechanical repair exact1、fresh rerun exact1、second failure STOPへ進む。実行時のfresh Mash approvalは要求しない。Cはrepairせず該当する既存named STOPへ進む。classifier不能、effect evidence不足、複数branch一致はAへ落とさずexisting design／contract gap STOPとする。同一eventをAとBへ二重計上しない。

### 7.1 非消費条件

次はformal commandとは別のpre-admission operationとして実行するため、formal evaluation bundle attemptを消費しない。

- interpreter解決失敗
- `pytest` import／version probe失敗
- authority-frozen target dependency projection内の既存dependency不足
- required role smoke失敗
- conftest／plugin import failure
- launcher／command construction不成立
- collection開始前のfailure
- collection 0
- selector不成立
- collected countとapproved expected denominatorの不一致
- candidate外のfixture construction failure
- pre-admission operation自体のdevelopment-tool failure

これらがFAILした時点ではIM07 formal authorityを開始しない。必ず§7.0のexclusive classifier exact1を適用する。AだけをIM03～IM06 atomic development unit内のcausal owner修正、working identity更新、pre-admissionやり直しへ送る。ただしAは追加acquisition／reinstall／runtime rematerialization exact0を必須とする。具体的な既存helper／launcher exact1がR10.3 exact4を観測したBはR10.3だけがownerであり、developmentへ戻さない。projection／contract／scope外またはruntime再materialization／追加acquisitionが必要なCはrepairせずexisting named STOPへ送る。同じeventを複数branchへ数えない。

formal-frozen implementation／bundleという呼称はIM07 freezeまで使わない。product source自身のsyntax／import defectがcollectionを壊した場合も§7.0へ送り、helper／launcher invocation 0、R10.3 event 0、approved allowlist内というAの全条件を満たす時だけworking stateをinvalidとしてIM03～IM06へ戻す。

### 7.2 formal machine attempt開始条件

prelaunch identityとlaunch後のresult identityを混ぜない。private frozen inputに対するsealed semantic artifactとvisible bodyはIM07 formal commandの実行結果であり、OS launch前には存在しない。したがって、prelaunchでfreezeするexact2は次である。

```text
PRODUCT_IMPLEMENTATION_ID =
  product source bytes identity
  + product configuration identity
  + candidate/meaning construction contract identity
  + projection/realizer configuration identity
  + final working source integration identity

FORMAL_EVALUATION_BUNDLE_ID =
  PRODUCT_IMPLEMENTATION_ID
  + test bytes identity
  + fixture semantics/input set identity
  + selector identity
  + denominator
  + acceptance axes identity
  + comparator identity
  + runtime identity
  + authority-frozen target dependency projection identity
  + pre-admission result identity
  + current-session Rule16 runtime admission identity
  + command identity
```

`PRODUCT_IMPLEMENTATION_ID`へgenerated sealed artifact、visible body、visible traceを入れない。これらはlaunch後のimmutable resultだけへbindする。

IM06は次を`FREEZE_READY`として保存するが、formal bundle自体をfreezeしない。

```text
working source/test/config/fixture/input identities synchronized
pytest/version valid
authority-frozen target dependency projection valid
conftest/plugin closure valid
collect-only successful
collected count == expected denominator
pre-admission PASS identity persisted
unlaunched formal command candidate bytes/argv/identity constructed and persisted
```

pre-admission commandとunlaunched formal command candidateは別identityである。後者はIM06で構築・静的検証するがOSへ渡さず、targeted invocation 0、formal attempt 0を維持する。formal commandは`FORMAL_EVALUATION_BUNDLE_ID`自身をargv／environmentへ埋め込まず、bundleがcommand identityを一方向に参照するためidentity cycleを作らない。

IM06のpre-admission PASSは、product／test／commandのfreeze-ready baselineを証明するが、future sessionのruntime eligibilityまでは証明しない。session、workspace root、Work environmentのいずれかが変われば、IM06 bytes／identityはimmutable baselineとして保持したままruntime continuityだけを`CURRENT_CONTINUITY_UNVERIFIED`へ戻す。fresh IM07 activation前に、Rule 16のcurrent procedureでGate A read-only discoveryを行い、cross-session candidateがstatic matchしても`CROSS_SESSION_REDISCOVERED_PENDING_READINESS`に留め、Packet Bに条件付きでbindしたGate B exact1のversion probe、required role smoke、fresh static identity再導出がVALIDになるまでREADYとしない。

`CURRENT_SESSION_RULE16_RUNTIME_ADMISSION_ID`は新runtime type／fileではなく、Rule 16既存admission／same-instance handoff evidenceを本案から参照する文書aliasである。same sessionでもtarget activation直前のfresh static identity再導出へbindし、cross-sessionでは上記Gate A／Gate Bのfresh resultへbindする。formal bundleはこのevidence identityと、それが観測したruntime／dependency projection／exact executableがIM06 baselineへexact一致することの双方を含む。fresh observation IDそのものをhistorical pre-admission result IDとbyte-equalにする必要はない。

pre-IM07 Rule 16 admissionと、そのPASS後だけactivateするfresh IM07 authorityは次の順序を飛ばさない。

```text
PRE_IM07_RULE16_ADMISSION_AUTHORITY（fresh IM07は未activate）:
0. Rule 16 current-session runtime admission VALIDを確認
   - continuity expiry時はGate A read-only discovery
   - cross-session時はPacket Bに条件付きでbindしたGate B exact1のversion probe／role smoke／fresh identity derivation
   - targeted invocation 0、formal attempt 0

VALID後だけFRESH_IM07_FORMAL_AUTHORITYをactivate:
1. IM06 FREEZE_READYから、次の全subject/preimage leafのdrift exact0を確認
   - product source bytes
   - product configuration
   - candidate/meaning construction contract
   - projection/realizer configuration
   - final working source integration identity
   - test bytes
   - fixture semantics and exact input set
   - selector and denominator
   - acceptance axes and comparator
   - runtime identity
   - authority-frozen target dependency projection identity
   - pre-admission result identity
   - formal command bytes/identity
   - current-session admissionが観測したruntime／dependency／executableと上記baselineのexact一致
2. PRODUCT_IMPLEMENTATION_IDをderiveしてfreeze
3. test/fixture/input/selector/denominator/axes/comparator/runtime/current-session admission/commandをfreeze
4. FORMAL_EVALUATION_BUNDLE_IDをderiveしてfreeze
5. atomic transitionとして、frozen bundleのformal commandをOSへ渡すのと同時に
   FORMAL_ATTEMPT_COUNT 0 -> 1、FORMAL_EVALUATION_BUNDLE = CONSUMEDへ遷移
6. process outcomeを同じbundleへimmutable bind
7. MACHINE_CLEAR時だけFORMAL_RESULT_IDをderive／seal
8. sealed FORMAL_RESULT_IDからREVIEW_OBJECT_IDをderive／seal
```

`FORMAL_EVALUATION_BUNDLE_ID`のpreimageへ同ID自身を含めない。IM06の`freeze-ready`とIM07の`freeze`を同じstate名にしない。

launch後にmachine-clear outputが成立した場合、次を作る。

```text
FORMAL_RESULT_ID =
  FORMAL_EVALUATION_BUNDLE_ID
  + ordered per-input formal dispositions
  + ordered generated sealed semantic artifact identities
  + ordered visible body bytes identities
  + ordered visible trace identities
  + immutable formal process outcome identity
```

launch後にFAIL／ERROR／未到達なら、生成物がなくてもformal process outcomeをconsumed bundleへimmutable bindしてcurrent authorityを閉じる。存在しないsealed artifactを補うためのplaceholder IDは作らない。

state transitionは次へ固定する。

```text
PRE_ADMISSION_OPERATION
  -> FAIL
  -> FORMAL_ATTEMPT_COUNT = 0
  -> PRE_ADMISSION_EXCLUSIVE_CLASSIFIER_EXACT1
     A.DEVELOPMENT_RETURN
       -> IM03_THROUGH_IM06_DEVELOPMENT_RETURN
     B.R10_3_BOUNDED_MECHANICAL_REPAIR
       -> R10_3_OWNER_ONLY
       -> DEVELOPMENT_RETURN = 0
     C.NAMED_STOP
       -> REPAIR = 0
       -> EXISTING_NAMED_STOP

PRE_ADMISSION_OPERATION
  -> PASS
  -> IM03_THROUGH_IM06_COMPLETE_FREEZE_READY

IM07_PREACTIVATION_RULE16_CURRENT_SESSION_ADMISSION
  -> CURRENT_CONTINUITY_UNVERIFIEDならGATE_A_READ_ONLY_DISCOVERY
  -> CROSS_SESSIONならPACKET_B_CONDITIONAL_GATE_B_EXACT1_VERSION_ROLE_FRESH_IDENTITY
  -> INVALID_OR_NOT_AUTHORIZED
  -> TARGETED_INVOCATION_COUNT = 0
  -> FORMAL_ATTEMPT_COUNT = 0
  -> IM07_NOT_ACTIVATED_OR_ALLOCATED_AUTHORITY_CLOSED_UNCONSUMED
  -> RULE16_EXISTING_STOP_OR_RETURN

IM07_PREACTIVATION_RULE16_CURRENT_SESSION_ADMISSION
  -> VALID_AND_BASELINE_SUBJECT_MATCH
  -> DERIVE_CURRENT_SESSION_RULE16_RUNTIME_ADMISSION_ID
  -> ACTIVATE_FRESH_IM07_FORMAL_AUTHORITY

FRESH_IM07_FORMAL_AUTHORITY
  -> VERIFY_ZERO_DRIFT_FROM_IM06
  -> FREEZE_PRODUCT_IMPLEMENTATION_ID
  -> DERIVE_AND_FREEZE_FORMAL_EVALUATION_BUNDLE_ID
  -> ATOMIC(
       FORMAL_COMMAND_OS_LAUNCH_REQUEST,
       FORMAL_ATTEMPT_COUNT: 0 -> 1,
       FORMAL_EVALUATION_BUNDLE: FROZEN -> CONSUMED
     )

FRESH_IM07_FORMAL_AUTHORITY
  -> VERIFY_ZERO_DRIFT_FROM_IM06 = FAIL
     or PRODUCT_IMPLEMENTATION_ID_FREEZE = FAIL
     or FORMAL_EVALUATION_BUNDLE_ID_DERIVATION_FREEZE = FAIL
  -> FORMAL_ATTEMPT_COUNT = 0
  -> TARGETED_INVOCATION_COUNT = 0
  -> CURRENT_IM07_AUTHORITY_CLOSED_UNCONSUMED
  -> TARGET_DESIGN_SECTION_17_3_NAMED_STOP
  -> FRESH_LEVEL3_CORRECTION_AUTHORITY_REQUIRED
```

上のatomic transitionは記録操作の順番を意味しない。OS launch APIへrequestを渡すeffectとcounter transitionを一つのlogical eventとして扱う。OS reject、pytest start exact0、process setup未到達、counter記録直前のsession interruptionでもattemptは1であり、巻き戻さない。

この境界の回復判定は既存formal handoff／result ownerのeffect stateへ記録する。`OS launch request handoff = CONFIRMED_ZERO`を証明できる場合だけattempt 0側に残せる。handoff exact0を証明できず、requestがOSへ渡った可能性が残る場合は`UNKNOWN`を未実行扱いせず、bundleをCONSUMED、formal attempt 1としてcurrent authorityを閉じnamed STOPへ送る。専用launch ledger、recovery file、second counterは作らない。

- formal attemptは`FORMAL_EVALUATION_BUNDLE_ID`ごとexact1。
- formal OS launch後はsetup／call未到達でもattemptを巻き戻さない。
- formal OS launch後のFAIL／ERROR／0 executed／tool interruptionを同じauthorityで修復／再実行しない。
- source、test、fixture、harness、runtime、commandを変えたnew bundleを同じauthorityで作らない。
- corrected candidate／bundleを扱うにはfresh Mash Level 3 correction authorityが必要。
- `COMMON_DEFECT_RETURN_COUNT=2/2`をcandidate、bundle、reviewer、session変更でresetしない。

### 7.3 failure後の処理

| phase / result | formal attempt | same authority | result |
|---|---:|---:|---|
| pre-admission A: helper／launcher invocation 0、R10.3 event 0、approved projection内のruntime／dependency／collection／product／harness未成立 | 0 | IM03～IM06で継続 | causal repair後にchanged-state pre-admissionを実行 |
| pre-admission B: helper／launcher invocation 1、R10.3 exact4実測 | 0 | development継続0 | R10.3 ownerだけでbounded repair exact1＋fresh rerun exact1。second failure STOP |
| pre-admission C: dependency projection／scope／contract／denominator／comparator／fixture meaning外、新product dependency、external route／fallback、新helper family | 0 | 継続不可 | repairせずexisting named STOP |
| pre-admission classifier不能／effect evidence不足／複数branch一致 | 0 | 継続不可 | Aへdefaultせずexisting design／contract gap STOP |
| IM06後のsession／workspace／environment boundary | 0 | IM07未activate | `CURRENT_CONTINUITY_UNVERIFIED`からRule 16 Gate A／Packet B conditional Gate B exact1をfresh実行。static matchだけではREADYにしない |
| pre-IM07 Rule16 runtime／executable admission invalid | 0 | IM07未activate | Rule 16既存STOP。IM03～IM06 COMPLETEへ戻らず、Packet B外の追加Gate／approval 0 |
| IM07 entryのnon-runtime product／test／contract／config／criteria drift、implementation ID freeze failure、bundle derive-freeze failure | 0 | 継続不可 | targeted invocation 0、current IM07 authorityをunconsumed closeし、target設計§17.3 named STOP／fresh Level 3 correction待ち。Rule 16へ送らない |
| formal OS launch後のPASS | 1 | 完了 | immutable formal result |
| formal OS launch後のFAIL／ERROR／未到達 | 1 | 継続不可 | current formal authorityを閉じnamed STOP |
| IM08／IM09 material defect | human exact1 | 継続不可 | current review authorityを閉じnamed STOP |
| correction proposal | — | fresh authorityのみ | Mash Level 3がscope／countを明示した場合だけ |

### 7.4 test gaming防止

開発反復を許す代わりに、次は承認なしに変更しない。

- failing selectorの削除
- denominatorの減少
- inputの除外
- assertionの弱化／削除
- expected meaningの結果観測後変更
- comparatorの緩和
- fixture semanticsの変更
- acceptance axisの変更
- public regressionの除外
- source-of-truthの差替え

fixture変更は、approved contractへ旧shapeを整合させ、case meaningを保存するcompatibility migrationだけ許可する。

derived identity変更は、approved current bytesから同一規則で機械再計算する場合だけ許可する。identity対象path、framing、hash方式を変える場合はSTOPする。

---

## 8. STOP分類の整理

`STOP`という語が、request-local outcome、candidate rejection、development evidence、authority terminalにまたがっていることが混乱の一因である。新enumを実装するのではなく、文書上で次を区別する。

### 8.1 authority terminalではないもの

| 状態 | 意味 | 処理 |
|---|---|---|
| request-local `LIMITED_*` | その入力で十分な意味を安全に作れない商品出力 | 設計どおり返す。作業authorityは止めない |
| candidate reject | hard validityを満たさないpre-selection候補 | deterministic pool内の別候補へ。全候補reject後、既存closed LIMITED derivation state exact1が成立する既存branchだけ`LimitedMeaningOutcome`へ進む。AVAILABLE＋Required Difference exact1+＋pool nonempty＋hard-valid exact0＋closed LIMITED state exact0はimplementation REDでseal／Reception／visible artifact 0。post-binding／post-realizer failureからのreselectionは禁止 |
| development RED | approved contract／allowlist内の実装途中 | scope／contract外でないことを確認し、cause ownerを直して同一unitで継続 |
| readiness NOT READY | 実行環境／harness未成立 | §7.0 classifier exact1へ送り、Aだけreadinessへ戻す。BはR10.3、C／不能はnamed STOP |
| paused continuable | session／context変更 | durable checkpointから同一unitを再開 |

### 8.2 既存named STOPを再定義しない

本案は`CURRENT_RULES.md` R10.2のexact6、R10.3 owner内exact4、Rule 18のformal／human／irreversible exactly-once、R1.1／R1.6のcounter／比例性を変更しない。ただし、**R10.3の適用範囲と、Rule 18のIM03～IM06 development verificationへの適用範囲はmaterialに変更する提案**である。規則全体が不変だとは主張しない。

保持するのはR10.3 owner内のexact4 error setと、該当するbounded mechanical repairに対するhelper／launcher exact1、repair exact1、fresh rerun exact1、second failure STOPである。具体的helper／launcher invocation exact1がcommand constructionを含むR10.3 exact4 eventを実測した時は必ずBへ送り、R10.3を起動する。Aへ送れるのはhelper／launcher invocation exact0、R10.3 event exact0、approved envelope内、追加acquisition／runtime rematerialization exact0の未成立だけである。このapplicabilityを正典へ反映するにはPro reviewとMash approvalが必要である。

非重複分類は§7.0のexclusive classifier exact1へ固定する。A／B／Cは文書上のphase classificationであり、新runtime enumではない。

| condition | classification / owner |
|---|---|
| A: concrete helper／launcher invocation 0、R10.3 exact4 event 0、approved source／test／fixture／dependency projection内、追加acquisition／reinstall／runtime rematerialization 0のimplementation／readiness未成立 | `DEVELOPMENT_RETURN`。same atomic development owner |
| B: concrete helper／launcher invocation 1、現行R10.3 exact4のexact1を実測 | `R10_3_BOUNDED_MECHANICAL_REPAIR`だけ。Packet Aにbindしたconditional authority exact1→repair exact1→fresh rerun exact1／second failure STOP。development return 0 |
| C: dependency projection外、新product dependency、scope／contract／denominator／comparator／fixture meaning変更、external route／fallback、新helper family、追加acquisition／reinstall／runtime rematerialization必要 | repair 0、該当するexisting named STOP |
| classifier不能、effect evidence不足、複数branch一致 | Aへdefault 0、existing design／contract gap STOP |
| pre-IM07 runtime／executable admission invalid | Rule 16既存STOP。targeted invocation 0、formal attempt 0、Packet B外の追加Gate／approval 0 |
| IM07 entryのnon-runtime source／test／contract／config／criteria driftまたはimplementation／bundle derive-freeze不成立 | target設計§17.3 named STOP。targeted invocation 0、formal attempt 0、fresh Level 3 correction待ち。Rule 16へ送らない |
| IM07 atomic OS launch transition後のcommand／runtime／test nonclear | formal attempt 1。R10.3へ戻さずcurrent formal authority close |

同じeventをdevelopment returnとR10.3の両方へ数えない。authority close後にAへ再分類してunitへ戻すことも禁止する。

- IM03～IM06のapproved contract／allowlist内development REDはauthority STOPではないため、R10.2のsame blocker family countへ入れない。scope外ならCへ送る。
- formal前のreadiness NOT READYは§7.0 Aに分類された場合だけauthority STOPではなく、same blocker countへ入れない。B／C／classifier不能をこの例外へ入れない。
- actual named STOPが成立した後、同じblocker familyで二回連続した場合は現行どおり`DETOUR_RISK_STOP`。
- R10.3 `BOUNDED_MECHANICAL_REPAIR`は現行exact4 error type、helper／launcher exact1、repair exact1、fresh rerun exact1を保持する。
- dependency不足、fixture統合、development RED、formal one-shot evaluationをphase名だけでR10.3のownerへ拡張しない。ただしconcrete helper／launcher exact1＋R10.3 exact4実測は原因ラベルにかかわらずBへ送る。
- IM03～IM06 atomic authorityが`ACTIVE_IN_PROGRESS`でAの全条件を満たす場合だけdevelopment ownerへ戻し、R10.3を起動しない。Bを観測した時点からR10.3へexclusiveに送り、Packet Aが事前にbindしたconditional bounded repair exact1だけを使用する。未使用枠を別eventへ転用せず、second failureまたは枠外eventはSTOPする。atomic authorityが閉じた後またはactual named STOP後にAで再入場しない。
- 必須工程数、期間、Product Readまでの作業量がmaterialに増える場合は、現行R1.1／R10.2の判断を維持する。
- `COMMON_DEFECT_RETURN_COUNT=2/2`をcandidate／bundle／reviewer／session変更でresetしない。

### 8.3 development returnとformal STOPの境界

| event | disposition |
|---|---|
| IM03～IM06 allowlist内implementation RED | same atomic unitでcausal repair |
| IM03～IM06 pre-admission A | same atomic unitでreadiness closure |
| IM03～IM06 pre-admission B | R10.3 sole owner。Packet A conditional exact1のrepair／fresh rerun。development return 0 |
| IM03～IM06 pre-admission Cまたはclassifier不能 | repairせずexisting named STOP |
| pre-IM07 runtime／executable admission invalid | Rule 16既存STOP。attempt 0、targeted invocation 0、IM07未activate、Packet B外の追加Gate／approval 0 |
| IM07 prelaunch non-runtime source／test／contract／config／criteria driftまたはimplementation／bundle derive-freeze不成立 | target設計§17.3 named STOP。attempt 0、targeted invocation 0、current IM07 authority unconsumed close、fresh Level 3 correction待ち。Rule 16へ送らない |
| IM07 prelaunch actor-only continuity break | current allocation unconsumed close。runtime continuity維持・attempt／human read 0・drift 0ならPacket B `ACTOR_HANDOFF_REPLACEMENT_EXACT1`でsame-packet replacement allocation exact1、追加Mash approval 0。条件不成立／second breakはPacket B terminal STOP |
| IM07 formal command OS launch後のnonclear | current formal authorityを閉じnamed STOP |
| IM08 Ultra material defect | current review authorityを閉じnamed STOP |
| IM09 Pro material defect | current review authorityを閉じnamed STOP |
| IM10 Mash non-PASS | current Product Read authorityを閉じnamed STOP |
| formal／human correction | fresh Mash Level 3 correction authorityのexact scope／countだけ |

---

## 9. 修正版IM00～IM10

IM番号は増やさない。過去commitもrebase／rewriteしない。責務とauthority境界だけを整える。

### 9.1 全体表

| IM | revised responsibility | actual product artifact | verification | authority treatment |
|---|---|---|---|---|
| IM00 | historical contract foundation | typed seams／validators | existing evidence保持 | 履歴保持、再実装0 |
| IM01 | Scope vertical closure | GroundedView→ForegroundScope actual connection | existing cumulative GREEN保持 | 履歴保持、再実装0 |
| IM02 | historical Difference checkpoint | Difference Config／Observed・Required Difference／mutation／bundle／issuer callable | historical `32/32`、`7/7` immutable | revised conformance PARTIAL |
| IM03 | Candidate + consequence + evidence + selection vertical | actual candidate、signature、candidate-bound rows、evidence、NORMAL selected meaningまたはclosed `LimitedMeaningOutcome` | focused＋cumulative development evidence | IM03～IM06 atomic unitの`IN_PROGRESS_UNIT_NOT_COMPLETE` checkpoint。technical creditはactual reusable evidenceに従う |
| IM04 | ReadingConsequence + Reception binding | NORMAL=`ReadingConsequence` exact1＋normal Reception、LIMITED=`ReadingConsequence` 0＋bounded LIMITED Reception | focused＋cumulative development evidence | 同上 |
| IM05 | Projection + realizer + visible trace | tagged projection、case-frame、visible development artifact | lossless trace＋visible binding evidence | 同上 |
| IM06 | cross-layer convergence + formal pre-admission | property／contrastive／paraphrase／oracle完了working candidate | full development GREEN、working exact17同期、pre-admission PASS | IM03～IM06 atomic COMPLETE／freeze-ready |
| IM07 | frozen machine proof | frozen exact AFTER／formal evidence | formal OS launch exact1 per evaluation bundle | any nonclearでnamed STOP、same authority correction 0 |
| IM08 | Ultra full-body prescreen | technical＋product prescreen judgment | same review object read exact1 | material defectでnamed STOP |
| IM09 | Pro early language viability | independent product-language judgment | same review object read exact1 | material defectでnamed STOP |
| IM10 | Mash formal Product Read | final human acceptance | exact1 | non-PASS terminal STOP |

### 9.2 IM00～IM02のhistorical disposition

#### IM00

- 既存type／validator bytesを保持する。
- `WholeReadingConsequence`はtype／validator seamのfoundationであり、actual issuer completionではなかったと加算記録する。
- future実装ではcontract shellだけを独立completeにする前例として使わない。

#### IM01

- PreMeaning／AllowedEnvelope分離、GroundedView→ForegroundScope actual connectionを保持する。
- 旧fixture移行が次checkpointへ漏れた事故を、`TYPE_OR_SIGNATURE_CHANGE_UNIT_CLOSURE`の根拠として残す。

#### IM02

- historical `IM02_COMPLETE_NONTERMINAL_CHECKPOINT`と`32/32 total（subset targeted exact7を別commandでも7/7）`をimmutable recordとして保持する。
- revised design conformanceは`PARTIAL`、revised IM03～IM06 GREENは`NOT_ESTABLISHED`とする。
- Difference／Bundle foundationとissuer callableのactual bytesをrollbackせず、IM03～IM06のpreimageとして使う。
- candidate-bound actual row発行はIM03へ移す。
- historical suiteのうちreusable assertionとsuperseded assertionをexact selector単位で分ける。
- actual row exact0、composition rederive、premature fixed identityに依存するPASSをrevised candidate closure creditに使わない。
- 過去Receipt本文を成功へ書き換えない。

#### Current-source reconstruction of historical gate shape: exact9 selectors / expanded 32

歴史事実として保持できるのは、添付handoffが記録するtotal `32/32`と、そのsubset exact7を別targeted commandでも`7/7`実行したことまでである。下表のexact9 selector shapeはPR #3 current source／collection構造からのreconstructionであり、当時のexact argv／collect receiptが保存されていたという主張ではない。また`REUSE_UNCHANGED_EXACT21`／`REUSE_AFTER_ASSERTION_OR_FIXTURE_REBASE_EXACT11`は本修正案が行うprospective dispositionであり、historical result自身の分類ではない。Pro／Mash承認とcurrent collection再確認前にformal denominatorへ昇格させない。

| # | selector | expanded count | revised disposition |
|---:|---|---:|---|
| 1 | `ai/tests/test_cmee_v1a_i1sx_contracts.py::CMEESubjectiveMeaningPlannerIM00ContractsTest` | 18 | mixed：16 unchanged、2 assertion rebase |
| 2 | `ai/tests/test_cmee_v1a_i1sx_contracts.py::CMEEStage1AdditionalCorrectionStep2CompositionTest::test_runtime_integration_identity_is_independent_exact17_framed_digest` | 1 | `REUSE_AFTER_ASSERTION_REBASE` |
| 3 | `ai/tests/test_cmee_v1a_i1sx_contracts.py::CMEEStage1AdditionalCorrectionStep2CompositionTest::test_language_core_identity_is_transitive_exact17_owner_ast_and_step4_isolated` | 1 | `REUSE_AFTER_ASSERTION_REBASE` |
| 4 | `ai/tests/test_cocolon_text_generation_core_boundary.py::test_core_boundary_contract_registry_keeps_three_outputs_separated` | 1 | `REUSE_UNCHANGED` |
| 5 | `ai/tests/test_cocolon_text_generation_core_boundary.py::test_emlis_boundary_rejects_ungrounded_supplementation` | 1 | `REUSE_UNCHANGED` |
| 6 | `ai/tests/test_cocolon_text_generation_core_boundary.py::test_piece_boundary_rejects_overcompression_when_must_keep_claims_disappear` | 1 | `REUSE_UNCHANGED` |
| 7 | `ai/tests/test_cocolon_text_generation_core_boundary.py::test_analysis_boundary_rejects_emlis_temperature_and_diagnostic_surface` | 1 | `REUSE_UNCHANGED` |
| 8 | `ai/tests/test_cocolon_text_generation_core_boundary.py::test_common_analysis_payload_rejects_piece_voice_at_core_boundary` | 1 | `REUSE_UNCHANGED` |
| 9 | `ai/tests/test_cmee_v1a_i1sx_contracts.py::CMEESubjectiveMeaningPlannerIM02ContractsTest` | 7 | `REUSE_AFTER_ASSERTION_OR_FIXTURE_REBASE` |

```text
REUSE_UNCHANGED_EXACT21
  = IM00/IM01 class expanded exact16
  + three-core boundary exact5

REUSE_AFTER_ASSERTION_OR_FIXTURE_REBASE_EXACT11
  = IM00/IM01 class exact2
  + identity exact2
  + IM02 targeted exact7

RECONSTRUCTED_EXPANDED_TEST_CASES_EXACT32
  = REUSE_UNCHANGED_EXACT21
  + REUSE_AFTER_ASSERTION_OR_FIXTURE_REBASE_EXACT11

TARGETED_EXACT7
  is_subset_of RECONSTRUCTED_EXPANDED_TEST_CASES_EXACT32
  and was also executed as a separate targeted 7/7 command
```

IM00／IM01 class内でassertion rebaseが必要なexact2は次である。

1. `test_im00_scope_and_consequence_have_zero_reception_backflow`
   - source textからdownstream type tokenの不存在を要求するassertionを、typed dependency directionとReception／surface backflow 0のassertionへ置換する。
2. `test_im01_actual_pipeline_derives_scope_before_reception_and_stops_at_phase_a`
   - fresh derive equalityをcompletion proofにせず、sole meaning builder exact1、sealed artifact lineage、IM03～IM05 positive exact-once continuationへ置換する。

IM02 targeted exact7 selectorは次である。

1. `test_im02_closed_types_exact_sets_and_zero_reception_backflow`
2. `test_im02_actual_source_bound_configurations_cover_exact5_origins`
3. `test_im02_exact4_configuration_states_are_derived_fail_closed`
4. `test_im02_required_differences_own_exact_one_closed_mutation`
5. `test_im02_requirement_bundles_exclude_optional_and_shared_evidence`
6. `test_im02_whole_reading_issuer_binds_owned_mutation_exactly`
7. `test_im02_response_stores_and_composition_revalidates_aggregate`

exact7のうち、closed enum／field、Reception backflow 0、source evidence、configuration exact1..5、observed origin exact5、state exact4、RequiredDifference↔mutation 1:1、bundle adjacency、optional exclusion、issuerのowned mutation／semantic order／malformed mutation fail-closed、stored artifact tamper rejectionは再利用する。

#### `SUPERSEDED_ASSERTIONS` exact5 groups

次のexact5はtest case数ではなくassertion意味のgroup数である。`REUSE_AFTER_ASSERTION_OR_FIXTURE_REBASE_EXACT11`に内包されるnon-additive分類であり、`32 + 5`や`11 + 5`とは数えない。

| ID | superseded assertion | revised assertion |
|---|---|---|
| S1 | `AVAILABLE`かつRequired Differenceありでも`whole_reading_consequence_rows=()`をaggregate-validとする | candidate × bundle-required difference matching row exact1、rows nonempty、baseline==candidate signature、evidence full-set bind |
| S2 | issuerがrowを返せないRequired Differenceを持つcandidateもvalid／selectedへ流せる | source-bound target exact0のcandidate-local `None`は当該draftをhard-invalid／no select／no Receptionにする。一方、target exact1なのにclosed exact12 producerがno-op／code `None`ならcandidate defectではなくIM03～IM06 implementation RED。既存closed derivation stateだけLIMITED可 |
| S3 | response保存後にcompositionがfresh rederiveし、`rederive.call_count == 1`とexact equalityを要求 | meaning owner derive exact1、composition derive call exact0、same sealed artifact/ref/identity carry、schema／provenance／nonmutation／tamper reject |
| S4 | IM03～IM06予定変更中もhistorical literal SHA／byte count／symbol countをそのままsuccessor completion sealにする | approved path set、actual bytes、framing determinism、uniqueness、mutation sensitivityを各checkpointで検証し、successor formal literalsはIM07 freeze時に確定 |
| S5 | historical N3 frozen constantsをlive successor payloadへmonkeypatch／rebindしてsuccessor proofにする | N3 historical constants／fail-closed testはimmutable。successor current identityは同一runner family内のdistinct versioned seamへbind |

S2で既存testが持つ`no_rows／upstream_rows／thin_rows == ()`はconfiguration rowsの正当なclosed stateであり、WholeReadingConsequence exact0とは別である。削除しない。`NO_FOREGROUND_OBJECT`は既存`STRUCTURE_INSUFFICIENT_STOP`、`UPSTREAM_STRUCTURE_INSUFFICIENT`はnormal candidate非適格のstructure gap、`THIN_NO_SAFE_CONFIGURATION`／`NO_REQUIRED_DIFFERENCE`は設計済みclosed LIMITED routeだけへbindし、normal hard-valid candidateへ流さない。PR #3で現在no-opとなる`DELETE_PREDICATE`／`DELETE_MODALITY`／`DELETE_ASPECT`／`DELETE_SCOPE`／`DELETE_QUALIFIER`を「legitimate None」へ分類することは禁止し、§3.6のtarget-present exact12 positive closureを先に成立させる。

S4でもunique names、actual bytes一致、nonempty／64hex、length-framed deterministic digest、AST transitivity、mutation sensitivity、activation-owner exclusionは再利用する。historical literal SHA、byte counts、logical contract count、owner／behavior／per-path symbol countsはsuccessor source確定後に再baseする。

さらにIM03～IM06には、candidate／rows／evidence／selection → ReadingConsequence／Reception → projection／sealのpositive exact-once order testを追加する。既存のdownstream non-call testだけをintegration proofにしない。textual token absence assertionがforward typed consumptionを妨げる場合は、意味を弱めずtyped dependency-direction assertionへ置き換える。

### 9.3 Revised IM03 exact internal order

IM03内で次を順番どおり構築し、IM03～IM06 atomic unitのdurable internal checkpointへ保存する。IM03単独のCOMPLETE／creditにはしない。

1. operation applicabilityをactual sourceから判定する。
2. candidate semantic coreを生成する。
3. §3.6のsource projection exact18からactual content-bearing `MeaningSemanticSignature` exact13を再構築し、保存値とexact比較する。その再構築値を加えたexact19から`CANDIDATE_CORE_ID`を作る。dedupeはrecomputed exact19完全一致だけに行い、same signature＋different provenance／evidence／tier／unknown／qualifierはdistinctに保持する。同一coreなのにderived evidenceが異なる場合はimplementation REDとする。
4. candidate draftがpreserveすると主張する各`preserved_difference_ref`にowned mutation exact1を適用する前に、source-bound target presenceをtypedに判定する。
5. closed exact12の各kindについて、target presentなら§3.6表のexact13 delta exact1＋exact7 consequence code exact1を要求する。target presentのno-op／code `None`はcandidate rejectではなくatomic unitのimplementation REDとする。
6. source-bound target exact0だけはcandidate-local `None`を許すが、そのdraftはfull-coverage hard validityを満たさずseal／selectしない。
7. candidate semantic signatureをbaselineとして、candidateが参照するRequirement Bundlesの各required differenceにmatching `WholeReadingConsequenceRow` exact1を発行する。
8. 各rowをclosed exact7 dimension、Foreground Scope、matching Required／Preserved Difference、source evidenceへ一致bindする。
9. `EVIDENCE_ID`をcandidate core ID、scope、`required_difference_refs`、`discriminative_necessity_refs`、全row refs、canonical full row recordsから構築する。
10. sealed candidateの`candidate_id`を`CANDIDATE_CORE_ID`、evidence refを`EVIDENCE_ID`、signatureをrecomputed typed signatureとし、`evidence.candidate_ref == candidate.candidate_id`を検証する。
11. evidence required differencesがcandidate requirement bundlesのrequired difference canonical unionとexact一致し、かつcandidate preserved differencesのsubsetであり、`whole_reading_consequence_refs`が当該required differencesのcanonical full row setとexact一致することを検証する。
12. missing row、extra row、別candidate signatureのrow、duplicate difference row、scope／source mismatchをhard-invalidにする。
13. bundle-required difference full coverage、candidate preservation、discriminative necessity、whole consequence nonemptyをhard validityにする。
14. valid candidateをtier partitionする。
15. minimal sufficiency、compatible aggregation、deterministic ordering、overflow／tieを処理する。
16. sufficient candidateがない場合でも、既存のclosed derivation state exact1が成立する既存branchだけ`LimitedMeaningOutcome`へ進む。AVAILABLE＋Required Difference exact1+＋pool nonempty＋hard-valid exact0＋closed LIMITED state exact0はimplementation RED、seal／Reception／visible artifact 0とする。downstream `LIMITED_COMPETING_MATERIAL_READINGS`はhard-valid exact2+のmaterial tieだけに使い、LIMITEDをselected candidateへ変換しない。
17. existing exact9 field names/order＋candidate／evidence／outcome exact3を、current-forward-only required `InputSpecificMeaningStructure v1.1` exact12へassembleする。v1.0 live decode／admission、Optional、default Noneは0。
18. response exact1 carry→composition ref-resolution／identity／binding validation-onlyまでのactual producer→consumer→sealed structure pathをfocused testする。

次を禁止する。

- rows exact0のcandidateをhard-validとすること。
- row欠落、rich candidate実装不良、validator不良をLIMITEDへ落とすこと。
- IM03でpost-selection `ReadingConsequence`を作ること。これはIM04 sole ownerである。
- full-record相互hashでcandidateとevidenceを循環identity化すること。
- Reception、affect、style、realizer outputをcandidate selectionへ入れること。
- fixture ID、hash、列挙順でsemantic winnerを決めること。
- selection不成立をgeneric abstentionへ置換すること。

### 9.4 IM04

IM03 outcome tagを先に分岐し、NORMALとLIMITEDを同じselected-reading laneへ入れない。

```text
NORMAL_SELECTED_READING
  -> selected candidate exact1
  -> ReadingConsequence exact1
  -> MeaningBoundReceptionSet 1..4
  -> validate_response_consequence_binding

LIMITED_MEANING_OUTCOME
  -> selected candidate 0
  -> ReadingConsequence 0
  -> BoundedLimitedReception exact1
  -> validate_response_consequence_binding call 0
  -> Limited constructor invariants
```

1. NORMALはIM03のselected semantic artifactを入力にし、selected `ReadingConsequence` exact1を構築する。
2. NORMALだけを`MeaningBoundReceptionSet` 1..4へbindし、meaning artifactを変更せずpost-binding acceptanceを行う。
3. LIMITEDはIM03のclosed `LimitedMeaningOutcome`を入力にし、`BoundedLimitedReception` exact1を構築する。
4. LIMITEDにdummy candidate、synthetic selected reading、`ReadingConsequence`を作らない。
5. allowed envelope不一致やReception不成立で別meaningへreselectしない。
6. branch tag、ReadingConsequence exact1/0、validator call exact1/0、backflow、reselection、LIMITED、cardinalityをfocused testする。

### 9.5 IM05

1. IM04 outcome tagをそのまま受け、NORMALとLIMITEDを別projection branchにする。
2. NORMALはselected meaning＋`ReadingConsequence`＋`MeaningBoundReceptionSet`をtagged projectionへ運ぶ。
3. LIMITEDは`LimitedMeaningOutcome`＋`BoundedLimitedReception`を運び、selected meaning 0、`ReadingConsequence` 0を維持する。
4. approved case-frame inventoryへlossless投影する。
5. 各branchのmeaning outcome／Reception／source lineageをvisible traceへ保持する。
6. generic fallback、silent field drop、meaning flattening、LIMITEDへのdummy selected reading挿入を拒否する。
7. development用のrepresentative artifactでvisible bindingを確認する。
8. actual registry内で既知のbounded extensionが必要なら、unit開始時にconditional allowlistへ含める。開始後に新familyが必要と判明した場合はSTOPする。

private single-use actual inputの正式生成はIM07まで行わない。

### 9.6 IM06

IM06を「初めて統合testをする場所」から、「各IMですでにGREENのvertical sliceを横断的に収束させる場所」へ変更する。

- property tests
- contrastive tests
- paraphrase tests
- source-grounding oracle
- deterministic ordering
- full preserved/required difference coverage
- candidate × bundle-required difference matching row exact1
- current-forward root v1.1 required exact12 only、v1.0 live admission／decode 0
- dedupe exact19完全一致だけ、same signature＋different provenance／tier／unknown／qualifier exact2保持
- preloss exact17→signature exact13→DifferenceInvariantCode exact10 predicate→semantic loss→hard validity→exact19／core IDのconstruction／validator同順序
- hard-valid candidate `semantic_loss_codes=()`、required invariant loss exact1+はhard-invalid。stored loss missing／extra／foreign／permutation、source target-present no-opのimplementation REDをfocused test
- AVAILABLE＋Required Difference exact1+＋pool nonempty＋hard-valid exact0＋closed LIMITED state exact0でseal／Reception／visible artifact 0
- exact12全mutation kindのtarget-present positive delta／expected exact7 code、target-absent negative、target-present no-op implementation RED
- response→composition carry equality／identity
- no rederive by composition
- historical N3 immutable fail-closed＋same runner familyのsuccessor versioned seam binding
- exact17 working integration identity recomputation／synchronization
- full development regression
- formal target dependency／conftest／plugin readiness
- collect-only expected denominator一致
- unlaunched formal command candidateのbytes／argv／identity構築・静的検証・保存（OS launch exact0）

IM03～IM05の各committed internal checkpointでもworking exact17をcurrent bytesへ再計算／同期する。IM06でhistorical N3 constantsを変更せず、同じrunner familyのsuccessor versioned seamをfinal working sourceへbindし、full development GREENとformal pre-admission PASSを同じatomic unit内で閉じる。

その後、source／test／fixture／input／denominator／criteria／runtimeとunlaunched formal command candidateをfreeze可能状態にする。formal command candidateはIM06でbaselineとして保存するだけで、formal bundleのfreezeとOS launchはIM07 fresh authorityまで行わない。

### 9.7 IM07

IM07 entryで次をexactに固定する。

- `PRODUCT_IMPLEMENTATION_ID`
- `FORMAL_EVALUATION_BUNDLE_ID`
- source bytes
- test bytes
- fixture semantics
- exact input set
- expected denominator
- acceptance axes
- comparator
- runtime identity
- current-session Rule 16 runtime admission identity
- command identity
- final source integration identity

IM07 activation前にcurrent sessionのRule 16 admissionを成立させる。session／workspace／environment boundary後は`CURRENT_CONTINUITY_UNVERIFIED`へ戻し、Gate A discoveryとPacket Bに条件付きでbindしたGate B exact1のversion probe／role smoke／fresh identity derivationを経ないstatic matchだけではREADYにしない。runtime／executable admission invalidならformal attempt 0／targeted invocation 0、IM07未activateのままRule 16既存STOPとし、Packet B外の追加Gate／approvalを要求しない。admission VALID後だけfresh IM07 authorityをactivateし、current-session admissionが観測したsubjectとIM06 baselineの一致、IM06 pre-admission PASS、§7.2のnon-runtime full-preimage drift exact0を確認して`PRODUCT_IMPLEMENTATION_ID`をfreezeし、`FORMAL_EVALUATION_BUNDLE_ID`をderive／freezeする。ここでsource／test／contract／config／criteria drift nonzero、implementation ID freeze failure、bundle derive／freeze failureならattempt 0／targeted invocation 0のままcurrent IM07 authorityをunconsumed closeし、target設計§17.3 named STOP／fresh Level 3 correction待ちとする。これはRule 16へ送らない。fresh IM07 formal authorityのformal generation／machine commandをOSへ渡すeffect、attempt 0→1、bundle FROZEN→CONSUMEDは一つのatomic transitionとする。同じfrozen evaluation bundleはexact1。

private frozen inputを使うactual generationはIM07 authorityでexact1とする。

```text
PRIVATE_GENERATION_PER_FORMAL_EVALUATION_BUNDLE = exact1
SAME_FORMAL_EVALUATION_BUNDLE_REGENERATION = 0
INPUT_SET_CHANGE = 0
PRIVATE_BODY_PUBLICATION = 0
PHYSICAL_LOCATOR_PUBLICATION = 0
```

formal OS launch後、MACHINE CLEARならgenerated sealed artifact、visible body、visible trace、process outcomeを同じbundleへbindして`FORMAL_RESULT_ID`を作る。FAIL／ERROR／0 executed／generation failureは、原因がproduct、runtime、harness、toolのどれであってもattemptを巻き戻さない。同じauthority内のsource／test／runtime修正、new bundle、再生成、再実行は0。corrected implementationを扱うにはfresh Mash Level 3 correction authorityが必要である。

### 9.8 IM08／IM09

IM08 Ultra、IM09 Proはそれぞれsame `REVIEW_OBJECT_ID`を一度だけ全文readする。

```text
REVIEW_OBJECT_ID =
  FORMAL_RESULT_ID
  + ordered frozen input identity
  + ordered visible body bytes identity
  + visible trace identity
  + frozen review axes identity
```

visible body bytes不変、metadata-only delta、commit／timestamp／IDだけの変更ではnew review objectは成立しない。ただし本案は、IM08／IM09 defect後にnew review objectを同じauthorityで作る権限を与えない。

human review routeは次へ固定する。

```text
IM07_MACHINE_CLEAR(candidate C, review object R)
  -> IM08 reads R exact1

IM08_CLEAR(R)
  -> IM09 reads the exact same R exact1

IM08_DEFECT(R)
  -> IM09 read = 0
  -> CURRENT_REVIEW_AUTHORITY_CLOSED
  -> NAMED_STOP

IM09_DEFECT(R)
  -> CURRENT_REVIEW_AUTHORITY_CLOSED
  -> NAMED_STOP
```

- IM09はIM08が読んだものとbyte-identicalなprivate packetを読む。
- IM08／IM09の途中でsource、semantic artifact、visible body、traceを変えない。
- frozen review axes、case order、denominatorを変えない。
- Pro華恋にはreview前、`IM08_CLEAR`とpacket identityだけを渡す。Ultraのper-case verdict、reasoning、候補比較は先に渡さない。
- corrected candidateのgeneration／machine proof／human readはfresh Mash Level 3 correction authorityのexact scope／countだけに従う。
- `COMMON_DEFECT_RETURN_COUNT=2/2`をcandidate／review object変更でresetしない。

### 9.9 IM10

Mash Product Readはseparate formal gateとして維持する。

- machine GREENをProduct PASSへ変換しない。
- Ultra／Pro CLEARをMash PASSへ変換しない。
- IM10はIM09 CLEARと同じ`REVIEW_OBJECT_ID`を読み、再生成packetへ差し替えない。
- non-PASSはterminal STOP。
- correctionが必要なら、Mashが新しいproduct-correction authorityを明示する。
- activation／productionはさらに別判断。

---

## 10. 各checkpoint共通の実装順

次を、revised IM03～IM06 atomic implementation unitに適用する。IM03～IM05は内部保存点であり独立COMPLETEではない。

1. current head、preimage、Packet Aのexact changed paths／allowlist／contract／protected criteriaを固定する。
2. actual target selector、exact input set、expected denominatorを固定する。
3. target source、conftest、pytest plugin、import chainをruntime起動なしで静的に解決する。
4. `AUTHORITY_FROZEN_TARGET_DEPENDENCY_PROJECTION`を確定し、IM03～IM06中のnew dependency importを0へ固定する。
5. frozen repository lock／metadataとdependency projectionのexact mapping、approved acquisition route、network acquisition count exact0または明示exact1、materialization count exact1を確認する。projection外dependency、別route、承認count外の追加取得が必要ならruntimeを作らずnamed STOPする。
6. actual production-disabled source接続、type／schema／constructor／projection接続を完了する。
7. current caller／fixture／serializer／comparatorをmeaning不変でcompatibility migrationする。
8. derived working identityをcurrent bytesから再計算する。
9. projection内dependencyを含むcanonical runtimeをapproved routeからexact1 materializeする。runtime materialization／network acquisitionをRule 18 development例外として扱わない。
10. pytest version、required role/import、conftest／plugin smokeを行う。
11. collect-onlyを実行し、collected selector／countをstep 2のexpected denominatorへexact一致させる。
12. pre-admission resultを§7.0のexclusive classifier exact1へ通す。追加acquisition／reinstall／runtime rematerialization 0を含むAの全条件を満たす場合だけdevelopmentへ戻し、BはPacket A conditional R10.3 owner、C／classifier不能はnamed STOPとする。
13. focused development testを実行する。
14. REDならexisting ordered checklist上のearliest failed invariant、finite unresolved obligations、causal owner、normalized failure signatureを決める。
15. resultをR10.1 exact1へ分類し、`TECHNICAL_CREDIT | BLOCKER_NARROWED`かを確認する。
16. approved causal owner exact0、scope／contract変更必要、または既存checklistへnext actionを対応付け不能なら既存named STOPへ送る。
17. approved envelope内なら因果箇所だけ修正する。
18. substantive leafが変わった`DEVELOPMENT_EXECUTION_ID`を作り、focused testをexact1実行する。
19. prior GREENを再openせず、earliest failureのdownstream移動またはfinite unresolved setのstrict subset化が成立したか確認する。
20. non-progressならR10.1 `ADMINISTRATIVE_ONLY`とし、二回連続で現行R10.2 item 1 `DETOUR_RISK_STOP`。IDだけ変えて続けない。
21. cumulative development suiteをGREENまで閉じる。
22. actual artifact type、cardinality、downstream preconditionを確認する。
23. working exact17をcurrent bytesへ同期する。
24. stable durable `IN_PROGRESS_UNIT_NOT_COMPLETE` checkpointをPacket AのGitHub write scope／count内でcommit／pushし、remote bytesをpostverifyする。`ATOMIC_UNIT_COMPLETE=false`、`PRODUCT_CREDIT=0`、technical creditはactual reusable evidenceに従う。
25. fresh approvalを挟まず、IM03～IM06 atomic unit内の次phaseへ進む。
26. IM06 full GREEN後、same frozen projection／runtimeでsmoke、collect-only、expected countをfinal pre-admissionとして再確認し、unlaunched formal command candidateを保存する。
27. pre-admission PASS後にatomic unitをCOMPLETE／freeze-readyとし、Packet B待ちで止まる。

Step 4まで閉じていない旧fixtureでdiagnostic pytestを起動しない。

ただしsource syntax、import、type errorを早く見つけるためのstatic／import-level診断自体を禁止しない。それをformal acceptanceと呼ばず、failure後にauthorityを失わせない。

---

## 11. 証拠記録を増殖させない

### 11.1 既存owner hierarchyを維持する

globalな`current state owner exact1`、新checkpoint schema、新ledgerを作らない。

| existing owner | 保持する責務 |
|---|---|
| product design | 意味contract、technical owner、IM03～IM10順、Gate境界 |
| Cocolon current structure | Cocolon側current architecture／route／dependency |
| mashos-api runtime handoff | runtime head、resume state、actual next work |
| actual source／test | executable behavior、selector、machine evidence |
| Git history | intermediate commit／attemptの時系列 |

異なるownerの必要なprojectionを一つへ押し込まない。同じowner責務内の全文重複、stale copy、failureごとのappendだけを削減する。

### 11.2 既存format内の最小記録

新しい必須field setは導入しない。各ownerの既存formatで、既に責務を持つ情報だけを更新する。

- IM03～IM05：`IN_PROGRESS_UNIT_NOT_COMPLETE`、`ATOMIC_UNIT_COMPLETE=false`、`PRODUCT_CREDIT=0`、actual reusable evidenceに従うtechnical credit、head、changed paths、actual artifact、unresolved exact list。
- IM06：atomic unit GREEN、working exact17、pre-admission result、freeze-ready state。
- IM07：frozen bundle identity、OS launch consumption、immutable formal result。
- IM08／IM09：private owner内のreview object identityとimmutable judgment。private body／locatorはpublic ownerへ出さない。
- pause：last safe headとresume owner。
- actual named STOP：既存STOP／handoff ownerへexact blockerを一回記録。

### 11.3 記録しないもの

- diagnostic commandごとの新Receipt／Result。
- failureごとの新Handoff。
- Git historyにすでにあるattemptの全文再掲。
- private body、private locator、Pro／Ultraのper-case reasoningのpublic copy。
- new candidate／bundle／review counterを作るためだけの管理file。

---

## 12. current ownerごとの修正案

### 12.1 対象設計書

主修正対象は§16～§17である。

| current clause | problem | proposed correction |
|---|---|---|
| §17.1 | actual運用が内部checkpointをauthority terminal化 | IM03～IM06 atomic、IM03～05はnonterminal saveと明文化 |
| §17.2 IM00～IM05 | horizontal shell-first、focused feedback不足 | IM03～IM06でactual producer／consumer／fixture migration／focused testをvertical統合 |
| §17.2 IM02 | candidate signature前にrow発行完了 | historical COMPLETEを保持し、revised conformance PARTIAL／actual rows IM03と併記 |
| §17.2 IM03 | candidate／selectionだけ | candidate signature→rows→evidence→validity→selectionへ拡張 |
| §17.2 IM06 | 初回横断test、failure即STOP | development convergence、IM06 exitをfreeze-readyとする |
| §17.2 IM07 | readinessとformalが同一command | pre-admissionをIM06で閉じ、IM07 OS launch exact1を明記 |
| §17.2 IM08／09 | one-shot prescreen | current STOP／fresh correction boundaryを維持し、same-authority returnを禁止 |
| §17.3 | developmentとformalのfailureが同じSTOP文 | IM03～06 development returnとIM07～10 named STOPを分離 |
| §16 identity | working exact17とformal bundle freezeが混在 | exact17は各checkpoint同期、formal bundleだけIM07 freeze |
| meaning owner | response／compositionで二重derive | sole owner exact1＋typed carry＋composition validation-onlyへ変更 |

product meaning semanticsは維持する。ただしcandidate／evidence identity、sole-owner call graph、composition再導出廃止はmaterial technical architecture changeとして§3.6のUltra案を反映する。

### 12.2 `CURRENT_RULES.md` R10.2／R10.3

R10.2 exact6を一字も減らさず保持する。ただし、次のうちapproved contract／allowlist内かつ§7.0 Aに該当するものだけはauthority STOPではないためsame blocker countの入力にしない。

- classifier Aのreadiness NOT READY
- development RED
- source修正後のIM03～IM06 working-state verification

R10.3のexact4 error type、helper／launcher exact1、repair exact1、fresh rerun exact1は、R10.3がownerとなるbounded mechanical repair内で保持する。ただし適用範囲はmaterial revisionである。通常のbounded implementation developmentはR10.3 repair authorityではない。IM03～IM06 `ACTIVE_IN_PROGRESS`でapproved integration未完了のため実行可能command candidateが存在せず、helper／launcher invocation exact0かつR10.3 event exact0の時だけNOT READYとしてdevelopmentへ戻す。具体的helper／launcher exact1がparse／call／serialize／command-buildでexact4を出した時点からR10.3だけがownerとなる。authority close／actual named STOP後のclosed／prior mechanical defectにはNOT READY例外を使わず、該当時は現行R10.3だけに従う。

### 12.3 runtime正本

`13_cocolon_work_test_runner_runtime_continuity.md`の§7.3、§7.4、§8を中心に、次を修正する。

- development／pre-admission commandとformal commandを分ける。
- pytest／target dependency projection／conftest plugin／collect-onlyをIM06 pre-admissionで閉じる。
- pre-admission failureはformal attempt 0だが、必ずA／B／C exclusive classifier exact1でownerを決める。
- pre-admission PASS後のIM07 formal OS launch requestでattempt exact1を消費する現行境界を維持する。
- formal OS launch後はsetup／call未到達でも消費を戻さない。

### 12.4 Rule 16

Rule 16 items 12～13相当の「launchで消費」は維持し、formal前のpre-admissionを分離する。

```text
formal attempt consumption
  = full bundle preimage drift exact0
  + product implementation / evaluation bundle identity freeze成立済み
  + dependency/harness readiness成立済み
  + collect-only count一致済み
  + ATOMIC(formal command OS launch request,
           attempt 0 -> 1,
           bundle FROZEN -> CONSUMED)
```

private generationや不可逆operationのone-shot消費境界は弱めない。

### 12.5 Rule 18

Rule 18のcounter、formal／human／network／runtime acquisition／GitHub write／irreversible effectのexactly-onceは変更しない。ただし、IM03～IM06のsame target／testをchanged source stateごとに検証する権限は、現行Rule 18 §11.7 items 4／5／7のliteralからは得られない。したがって本節はclarificationではなく、R10.3と並ぶ**material applicability change**であり、Pro reviewとMash明示承認なしには実行しない。

提案する限定変更は次のexact範囲だけである。

```text
scope = approved IM03_THROUGH_IM06_ATOMIC_DEVELOPMENT_ENVELOPE only
DEVELOPMENT_INVOCATION_PER_DEVELOPMENT_EXECUTION_ID = exact1
SAME_DEVELOPMENT_EXECUTION_ID_RERUN = 0
SUBSTANTIVE_CAUSAL_LEAF_CHANGE_REQUIRED = exact1_or_more
TIMESTAMP_SESSION_ACTOR_COMMIT_LABEL_ONLY_DELTA = not_new_identity
COUNTER_RESET = 0
FORMAL_OR_HUMAN_OR_IRREVERSIBLE_EFFECT_EXCEPTION = 0
IM07_OR_LATER_INHERITANCE = 0
```

changed stateで同じtarget／testを使う場合も、旧invocationとnew invocationを別`DEVELOPMENT_EXECUTION_ID`へbindし、performed／zero／unknown effectsとnon-reuseを保持する。各IDのinvocationはexact1である。source／test／fixture／input／selector／denominator／axes／comparator／runtime／dependency／commandのうちapproved causal ownerのsubstantive leaf exact1以上が変化し、かつprotected criteriaが不変でなければnew identityを認めない。

保持する禁止は次である。

- 同じeffect requestを成否不明のまま再送しない。
- 同じfrozen evaluation bundleのformal evaluationを結果観測後にやり直さない。
- 同じreviewerが同じreview objectを読み直してjudgmentを上書きしない。
- actor、session、stage、candidate変更でcounterをresetしない。
- network acquisition、runtime materialization、GitHub writeをこの例外へ混ぜない。

approved causal repairとchanged-state development verificationを許すのは、上のprospective changeがcanonical Rule 18、checklist、runtime ownerへ同期され、Mashがその変更条文とbounded atomic envelopeを明示承認した後だけである。

formal failure後のnew candidate proofはこの例外に含めず、fresh Level 3 correction authorityだけに従う。`COMMON_DEFECT_RETURN_COUNT=2/2`は不変である。

### 12.6 checklist／output gate

`09_work_start_checklist`と`99_integrated_paste_each_time`には新Gateを増やさない。既存欄の意味を次へ同期する。

- work unit authority scope
- current phase
- readiness status
- working／frozen identity
- formal attempt 0/1
- return-within-unitかterminal STOPか

### 12.7 v1／current structure／handoff

- `v1/00_read_first.md`：IM00～IM02履歴を不変保持し、prospective process correctionへのpointerを追記。
- `v1/06_implementation_order_migration_and_verification.md`：長いattempt historyを増やさず、revised final designをcurrent ownerとして参照。
- `current_structure/01`：Emlis actual structure差分だけ同期。
- `current_structure/04`：historical IM02 COMPLETEとrevised conformance PARTIAL、candidate-bound rows deferred、next atomic IM03～IM06をreplace-currentで同期。
- mashos-api handoff：current next atomic unitとIM03～IM05 nonterminal checkpoint semanticsを同期。
- System Context：canonical owner更新後に通常の同期対象となるまで、本案だけのための新entry／新familyを作らない。

---

## 13. 既存規範へ入れる修正文案

以下はProレビュー後にcanonical ownerへ移植するためのdraftである。本案自体にはnormative effectがない。

### 13.1 設計書§17へのdraft

```markdown
### 開発検証、formal evaluation bundle、one-shotの分離

IM03–IM06は一つのnonseparable atomic development unitである。
IM03–IM05はIN_PROGRESS_UNIT_NOT_COMPLETEのdurable checkpointであり、独立COMPLETE、Product credit、
fresh approval Gateではない。ATOMIC_UNIT_COMPLETE=false、PRODUCT_CREDIT=0を維持し、technical creditはactual reusable evidenceに従う。IM06でactual producer、consumer、caller／fixture／serializer／
comparator migration、focused／cumulative verification、working exact17、formal pre-admissionを閉じる。

AUTOMATIC_RETRY=0は、同一source state、同一test state、同一runtime identity、
同一command identityを、原因変更なしに再実行することを禁止する。
approved allowlist内でapproved contract、test meaning、fixture semantics、denominator、
comparator、acceptance axis、public／privacy／production boundaryを変えずに行う
IM03–IM06のcausal repairとchanged working-state verificationはretryではない。
ただし、この扱いはRule 18 §11.7 items 4／5／7のmaterial applicability changeとして
Mashが明示承認しcanonical Rule 18へ反映した後だけ有効であり、本draft単体はexecution authorityにならない。

PRODUCT_IMPLEMENTATION_IDはproduct source bytes、configuration、candidate/meaning construction contract、
projection／realizer configuration、final working source integration identityへbindする。
FORMAL_EVALUATION_BUNDLE_IDはPRODUCT_IMPLEMENTATION_IDにtest、fixture/input、selector、
expected denominator、acceptance axes、comparator、runtime、target dependency projection、
pre-admission result、current-session Rule 16 runtime admission、command identityを加えてbindする。launch後にしか存在しないsealed semantic artifact、
visible body、visible traceをprelaunch IDへ入れない。

actual target selector／expected denominator、target source／conftest／pytest plugin／import chainの静的解決、
authority-frozen target dependency projection、frozen lock／metadata mappingをruntime materializationより先に閉じる。
Packet Aにbindされたapproved acquisition routeとnetwork acquisition count exact0または明示exact1の範囲でprojection内dependency込みruntimeをexact1 materializeし、
pytest version、required role、conftest／plugin smoke、collect-only、expected denominator一致をpre-admissionで閉じる。
failureはformal attempt 0のままexclusive classifier exact1へ通す。helper／launcher invocation 0かつR10.3 event 0で
approved projection内、追加acquisition／reinstall／runtime rematerialization 0の未成立だけdevelopmentへ戻す。helper／launcher invocation 1＋R10.3 exact4実測はPacket A conditional
R10.3 ownerだけ、projection／scope／contract外またはruntime再materialization／追加acquisition必要はrepairせずnamed STOPとする。

pre-admission PASS後、unlaunched formal command candidateのbytes／argv／identityを構築・静的検証・保存する。
ここではOSへ渡さずformal attempt 0を保つ。その後IM03–IM06をCOMPLETE／freeze-readyとし、
APPROVAL_PACKET_Bを待つ。

session、workspace root、Work environmentが変わった場合、IM06 baseline bytesは保持するがruntime eligibilityを
CURRENT_CONTINUITY_UNVERIFIEDへ戻す。Packet Bの条件付きscopeでIM07 activation前にRule 16 Gate A read-only discoveryを行い、
cross-sessionでは同じPacket BにbindしたGate B exact1のversion probe、required role smoke、fresh identity再導出が
VALIDになるまでREADYにしない。targeted invocation 0、formal attempt 0を維持し、current-session admissionが
観測したruntime／dependency／exact executableとIM06 baselineのexact一致を要求する。

runtime／exact executable admission invalidならRule 16既存STOPとし、IM07をactivateしない。Packet B外の追加Gate B、repair、rerunは0である。
VALID後だけfresh IM07 authorityをactivateする。IM07ではIM06からのnon-runtime drift exact0を確認し、PRODUCT_IMPLEMENTATION_IDをfreezeし、
FORMAL_EVALUATION_BUNDLE_IDをderive／freezeしてからformal commandをOSへ渡す。その時点でattempt exact1を消費する。
source／test／contract／config／criteria driftまたはimplementation／bundle derive／freeze failureはattempt 0でcurrent IM07 authorityをunconsumed closeし、
target §17.3 named STOP／fresh Level 3 correctionへ送る。Rule 16へ送らない。actor-only continuity breakもRule 16へ送らない。
OS launch後はsetup／call未到達でも消費を戻さない。PASS以外はcurrent formal authorityを閉じnamed STOPとし、
same-authority correction、new bundle、regeneration、rerunを行わない。

MACHINE CLEAR後だけ、bundle、ordered disposition、generated sealed semantic artifact、visible body bytes、
visible trace、process outcomeへbindしたFORMAL_RESULT_IDを作る。

IM08／IM09はinternal prescreenである。同一reviewerによる同一REVIEW_OBJECT_ID rereadは0。
REVIEW_OBJECT_IDはFORMAL_RESULT_ID、ordered input、ordered visible body bytes、visible trace、
frozen review axesへbindする。metadata-only deltaやvisible body不変ではnew review objectを作れない。
material defectはcurrent review authorityを閉じnamed STOPとする。同じauthorityで修正／再生成／再読しない。

IM10のMash formal Product Read、production／irreversible effect、private single-use generation、
明示されたsensitive one-shot operationはseparate authorityとone-shot terminalを維持する。

IM07以降のcorrectionはfresh Mash Level 3 correction authorityのexact scope／countだけに従う。
COMMON_DEFECT_RETURN_COUNT=2/2をcandidate、bundle、reviewer、session変更でresetしない。
```

### 13.2 returnとterminal STOPのdraft

```markdown
### RETURN_WITHIN_UNIT、PRE_IM07_RULE16_ADMISSION_STOP、IM07_PRELAUNCH_NONRUNTIME_STOP、TERMINAL_STOP

次はRETURN_WITHIN_UNITである。

- §7.0 classifier Aを満たすIM03～IM06のruntime／dependency／collection／harness／fixture readinessまたはimplementation defect
- IM03～IM06のapproved contract内product implementation defect（concrete helper／launcher invocation 0、R10.3 event 0）
- IM03～IM06のcriterion不変test implementation defect（同上）
- IM03～IM06でsame actorのsession／context変更後、effect state != UNKNOWNかつverified durable checkpointからのresume
- IM03～IM06でactor handoff後、effect stateが`PERFORMED | CONFIRMED_ZERO` exact2のいずれか、single execution owner移譲済み、verified durable checkpointからのresume

RETURN_WITHIN_UNITは、既存ordered checklist上でearliest failed invariant、finite unresolved obligation set、
normalized failure signature、approved causal ownerを固定できる場合だけ許す。各repair後は、earlier GREENを
再openせずfailureがstrictly downstreamへ移るか、同一invariantのfinite unresolved setがstrict subsetに
なることを要求する。bytes／DEVELOPMENT_EXECUTION_ID変更だけではprogressではない。
各resultは既存checkpointのR10.1 exact1へ分類し、ADMINISTRATIVE_ONLY二回連続は現行R10.2 item 1の
DETOUR_RISK_STOPとする。新progress ledger／exhaustion enum／counterを作らない。

次はPRE_IM07_RULE16_ADMISSION_STOPである。新runtime enumではなく、Rule 16がownerとなる範囲を区別する文書分類である。

- IM06 COMPLETE後、IM07 activation前のruntime／exact executable continuity admission invalidだけ
- formal attempt 0、targeted invocation 0、IM07未activate
- Rule 16既存STOP
- same-authority repair 0、Packet Bに条件付きでbindしたGate B exact1以外の追加Gate B 0

次はIM07_PRELAUNCH_NONRUNTIME_STOPである。これも新runtime enumではない。

- IM07 activation後のsource／test／contract／configuration／criteria drift
- PRODUCT_IMPLEMENTATION_ID freeze failureまたはFORMAL_EVALUATION_BUNDLE_ID derive／freeze failure
- formal attempt 0、targeted invocation 0、current IM07 authorityをunconsumed close
- target設計§17.3 named STOP、fresh Level 3 correction authority待ち
- Rule 16 Gate A／Bへ送らない

IM07 attempt 0のactor-only continuity breakは上二つのどちらにも混ぜない。current allocationをunconsumed closeし、runtime continuity維持、formal attempt／human read 0、drift 0を確認できる場合だけ、Packet Bにbindした`ACTOR_HANDOFF_REPLACEMENT_EXACT1`で既存owner-handoffへincoming actorをbindし、replacement IM07 allocation exact1を同じPacket B内で作る。追加Mash approval 0、old＋replacementを通じたformal OS launch total exact1、second actor break 0とする。条件不成立はPacket B terminal STOPである。session／workspace／environment changeも同時に起きruntime continuityが失効した場合だけ、Packet B conditional Rule 16 admissionをfreshに要求する。

次はTERMINAL_STOPである。

- design／contract gap
- authority／path／dependency／method family／acceptance scope drift
- protected denominator／comparator／fixture semantics変更
- external AI／provider／fallback、安全／privacy／public／production境界変更
- irreversible effectの成否不明
- approved envelope内のcausal correction exhaustion
- detourとなるhelper／scanner／runner／subsystem追加要求
- materialな費用、期間、必須工程数増加
- IM07 formal OS launch後のnonclear
- IM08／IM09 material defect
- IM10 non-PASS
- Mash explicit cancel
```

### 13.3 R10.3へのdraft

```markdown
CURRENT_RULES R10.3のerror type exact4、helper／launcher exact1、
mechanical repair exact1、fresh rerun exact1、second failure時の処理は、R10.3 owner内で変更しない。
ただしR10.3 applicabilityはmaterial revisionであり、rule全体不変とは扱わない。

R10.3は、その規則が現在ownerとするbounded mechanical repairにだけ適用する。
dependency不足、fixture integration、IM03～IM06 development RED、
IM07以降のformal／human one-shotへphase名だけでownerを拡張しない。ただしconcrete helper／launcher exact1＋R10.3 exact4実測はBとしてR10.3 sole ownerへ送る。

IM03～IM06 atomic authorityがACTIVE_IN_PROGRESSの間、具体的helper／launcher invocation exact0、
R10.3 exact4 event exact0、approved source／test／fixture／dependency projection内、追加acquisition／reinstall／runtime rematerialization exact0の未成立というclassifier Aだけを
development ownerへ戻す。authority closeまたはactual named STOP後はAで再入場しない。

同じACTIVE_IN_PROGRESS phaseでも、具体的な既存helper／launcher exact1のparse／call／serialize／command-buildで
現行R10.3 exact4を観測したclassifier BはR10.3だけをownerとし、development ownerでrepair／rerunしない。
Packet Aはこのclosed exact4に限るconditional R10.3 authority exact1、helper／launcher exact1、mechanical repair exact1、
fresh rerun exact1を事前にbindする。未使用枠の転用、second event、second failure後の追加repairは0でSTOPする。
classifier Cまたはclassifier不能はR10.3でrepairせずexisting named STOPへ送る。
同一eventをdevelopment returnとR10.3の双方へ計上しない。

R10.2 exact6も変更しない。approved contract／allowlist内development REDとclassifier Aのformal前readiness NOT READYだけは
authority STOPではないためsame blocker countへ入れない。B／C／classifier不能またはactual named STOP後はこの例外を使わず現行R10.2に従う。
```

### 13.3.1 Rule 18へのdraft

```markdown
Rule 18 §11.7 items 4／5／7のnumeric counter carry、single execution owner、UNKNOWN effect再送0、
formal／human／network acquisition／runtime materialization／GitHub write／irreversible effectの
exactly-onceは変更しない。ただし、IM03～IM06 development verificationへのeffect identity／
applicabilityはmaterial revisionであり、clarificationとは扱わない。

Mashがexact scopeを明示承認したIM03_THROUGH_IM06_ATOMIC_DEVELOPMENT_ENVELOPE内だけ、
DEVELOPMENT_EXECUTION_IDごとのdevelopment／pre-admission invocationをexact1許可する。
approved causal repairによりsubstantive semantic leaf exact1以上が変わり、protected contract、
test meaning、fixture/input semantics、selector/denominator、acceptance axes、comparator、
Safety／privacy／public／production boundaryが不変の場合だけnew working identityとする。

same DEVELOPMENT_EXECUTION_IDのrerun、UNKNOWN effectの再送、timestamp／session／actor／candidate label／
commit labelだけによるnew identity、counter resetは0である。この例外をIM07以降、formal／human、
network acquisition、runtime materialization、GitHub write、production／irreversible effectへ継承しない。
Mash承認とcanonical Rule 18同期前のsame target／test再launchは0である。
```

### 13.4 runtime consumptionへのdraft

```markdown
IM06のpre-admission operationとIM07のformal commandを別command identityにする。

IM03～IM06内のdevelopment pre-admissionは、actual target selector／expected denominator固定、target source／
conftest／pytest plugin／import chain静的解決、authority-frozen target dependency projection、frozen lock／metadata mappingを
runtimeより先に閉じる。Packet A approved routeからprojection内dependency込みruntimeをexact1 materializeした後、
pytest/version、required role、conftest／plugin smoke、collect-onlyを確認する。failure時はformal attempt 0で、
§7.0 classifier AだけIM03～IM06 developmentへ戻す。Aは追加acquisition／reinstall／runtime rematerialization exact0を必須とする。BはPacket A conditional R10.3 ownerだけ、Cまたはclassifier不能はnamed STOPとする。

pre-admission PASS後、IM07 activation前にcurrent-session Rule 16 runtime admissionを成立させる。
session／workspace／environment boundaryではCURRENT_CONTINUITY_UNVERIFIEDからGate A、cross-sessionなら
Packet Bに条件付きでbindしたGate B exact1のversion probe／role smoke／fresh identity derivationを経る。
runtime／executable admission invalidならIM07をactivateせず、formal attempt 0、targeted invocation 0のまま
Rule 16既存STOPとする。Packet B外の追加Gate B、repair、rerunは0である。

admission VALID後だけfresh IM07 authorityをactivateし、product source/configuration/contract、projection/realizer、working integration、test、fixture/input、
selector/denominator、axes/comparator、runtime、target dependency projection、pre-admission result、
current-session admissionが観測したsubject、formal commandのdrift exact0を確認する。
その後PRODUCT_IMPLEMENTATION_IDをfreezeし、FORMAL_EVALUATION_BUNDLE_IDをderive／freezeする。

non-runtime drift nonzeroまたはimplementation／bundle derive／freeze failureならformal attempt 0、targeted invocation 0のまま
current IM07 authorityをunconsumed closeし、target設計§17.3 named STOP／fresh Level 3 correction待ちとする。
Rule 16 Gate A／Bへ送らない。actor-only continuity breakもRule 16へ送らず、runtime continuity維持・attempt／human read 0・drift 0ならPacket B `ACTOR_HANDOFF_REPLACEMENT_EXACT1`でsame-packet replacement allocationへ進む。追加Mash approval 0、second breakはPacket B terminal STOPとする。

formal commandをOSへ渡すeffect、FORMAL_EVALUATION_BUNDLE_ATTEMPT_COUNT 0→1、
bundle FROZEN→CONSUMEDを一つのatomic transitionとする。
OS launch後はsetup／call未到達でも消費を戻さない。同じauthorityのrepair／rerunは0。
MACHINE CLEAR後だけgenerated artifact／body／trace／process outcomeをbindしたFORMAL_RESULT_IDを作る。

atomic launch境界は既存formal handoff／result ownerのeffect stateで回復判定する。
OS request handoff exact0を証明できない場合はUNKNOWNを未実行扱いせず、attempt 1、bundle CONSUMED、
current authority close／named STOPとする。新launch ledger／recovery file／counterは作らない。
```

### 13.5 sole meaning owner／identityへのdraft

```markdown
emlis_input_specific_meaning.pyはcandidate core、semantic signature、
WholeReadingConsequenceRow、InputSpecificityEvidence、hard validity、selection／LIMITED、
sealed InputSpecificMeaningStructureのsole ownerである。

emlis_stage1_response.pyはsole ownerをexact1回orchestrateし、sealed typed artifactをcarryする。
emlis_stage1_composition.pyはschema、identity、binding、non-mutation、tagged dispatchだけを検証し、
candidate derive／enumerate／select／reselectを行わない。

現行InputSpecificMeaningStructureのexact9 fieldsだけではcandidate／evidence／outcomeをcarryできないため、
既存exact9のfield名／宣言順を先頭で保持し、candidate_records、input_specificity_evidence_records、
meaning_decision_outcomeのexact3を末尾へ持つcurrent-forward root v1.1 required exact12へ一括migrationする。
MeaningDecisionOutcomeは既存設計のSelectedEmlisProvisionalReading | LimitedMeaningOutcomeを使う。
responseはv1.1 exact1をcarryし、compositionはtupleからrequest-local read-only lookupを作って
全candidate／evidence／row refのexact1 resolutionを検証する。新registry service／file、parallel carrier、
dual live versionを作らない。current runtimeのv1.0 admission／decode／validate／serializeは0である。

rootだけにschema version 1.1 constantを追加し、nested IM02 contractsは全て1.0のまま保つ。
root 1.1 exact12 requiredだけをadmitし、root-version／shape mismatch、missing／null additive field、nested 1.1をrejectする。
現行shared `_FOREGROUND_SCOPE_SCHEMA_VERSION`をglobal bumpしない。single physical dataclassはexact12全fieldをrequiredとし、
additive exact3のOptional／default None／serializer omit branchを置かない。caller／fixture／serializer／comparator／
tuple-field assertionをIM03～IM06 atomic unit内で一括migrationする。historical v1.0はGit history、historical commit、
receipt／test resultだけで保持し、current runtimeでdecodeしない。実在する永続済みv1.0 consumerがfreshに発見された場合だけ、
対象exact listと必要期間を示した別material decisionへ戻る。

candidate_recordsはrecomputed semantic signature bytes→recomputed CANDIDATE_CORE_ID_PREIMAGE exact19 canonical bytesの順、
evidence recordsはcandidate orderへの1対1追従、whole-reading rowsは現行runtime semantic orderとする。
dedupeはrecomputed exact19が完全一致するdraftだけに行う。同じsignatureでもprovenance／evidence／tier／unknown／
protected difference／qualifierが異なるcandidateはdistinctに保持する。同一coreなのにderived evidenceが異なる場合はimplementation REDとする。
ID／hash／列挙順をselection根拠にしない。

rejectされたdraftの理由はdeterministic enumerator development test evidenceまたはbody-free diagnosticだけに残し、
decision_trace、selected reading identity、formal result identityへ含めない。reject inventory、carrier直下のhidden field、parallel traceを作らない。各candidate cにはEVIDENCE_ID(e)が
c.input_specificity_evidence_refと一致し、e.candidate_ref == c.candidate_idとなるevidence eをexact1要求する。
各evidence eにも、そのe.candidate_refを持ちinput_specificity_evidence_ref == EVIDENCE_ID(e)となるcandidate cを
exact1要求する。carrier candidate ID setは全evidence.candidate_refのcanonical reverse-owner set、
carrier evidence ID setは全candidate.input_specificity_evidence_refのcanonical union、carrier row ID setは
全evidence.whole_reading_consequence_refsのcanonical unionとexact一致させる。
baseline signatureがcandidate-boundなのでrowのcandidate間共有は0とし、orphan／extra candidate、evidence、rowは0とする。

NORMALはcandidate exact1+、selected ref exact1とし、primary/supporting、component/relation/qualified refs、
provenance、tier、statusをselected candidateからpure projectionしてreading IDを再計算する。
LIMITED_COMPETING_MATERIAL_READINGSはderivation stateでexact dispatchする。upstream
`COMPETING_MATERIAL_SCOPES`はcandidate／evidence／row exact0、scope unresolved refsを保持する。downstream
`LIMITED_COMPETING_MATERIAL_READINGS`だけhard-valid candidate／evidence exact2+、candidateごとのrow exact1+、winner 0とする。
NO_SAFE／STRUCTURE_INSUFFICIENTはcandidate／evidence／row 0とし、STRUCTURE_INSUFFICIENTだけ
product_acceptance_eligible=falseである。AVAILABLE＋Required Difference exact1+＋pool nonempty＋hard-valid exact0＋
existing closed LIMITED derivation state exact0はIM03～IM06 implementation REDであり、carrier seal／Reception／visible artifact 0とする。

MeaningDecisionTraceはoutcome内のbody-free nested valueとして、trace exact2／row exact4、closed
MeaningDecisionReasonCode exact10で閉じる。sealed trace kindはSELECTED／NONSELECTED_VALID／LIMITED_BASIS exact3だけとする。
SELECTED／NONSELECTED_VALIDはSEL00..SEL06、LIMITED_BASISは対応するLIM01..LIM03 exact1だけを許す。HV01..HV12は
development-only hard-validity evidence codeとして保持可能だがsealed carrier／trace／reading identity／formal result identityへ含めない。NORMAL selection_reason_codesは
sole SELECTED row reason codes、各LIMITED outcome_reason_codesはsole LIMITED_BASIS summary reason codesとexact一致する。
downstream competitionにもcandidate-refなしLIM03 summary exact1と、candidateごとのNONSELECTED_VALID exact1を要求する。
row orderはtrace-kind、candidate order／absent sentinel、§3.6のfixed source-owner precedence＋owner内semantic position、
reason declaration orderのcanonical keyとする。全source refはPhase-A／carrierの§3.6 closed owner mapへexact1解決する。

InputSpecificMeaningCandidate exact21のうち、candidate_id、input_specificity_evidence_ref、
semantic_signatureのexact3を除外した§3.6の宣言順exact18をsemantic source projectionとする。

semantic_signatureはhashへ置換せず、MeaningSemanticSignature exact13のtyped content-bearing structureとして
actual component／relation／qualified event-stateから構築する。request-local ID、raw text、fixture ID、
candidate ID、evidence ref、hash、列挙順をsignature inputにしない。
保存済みsignatureではなくactual sourceから再構築したsignatureをexact18の末尾へ加え、
candidate_idとinput_specificity_evidence_refだけを除外したexact19からCANDIDATE_CORE_IDを算出する。

BasisProvenanceRowはschema version、basis kind、basis ref、epistemic tier、source evidence refs、approved
derivation refsのexact6 shared nested valueとする。candidate relation refs→qualified event-state refsの順でexact1対応し、
same Phase-A ownerへ解決する。SemanticLossCodeは新enumではなくDifferenceInvariantCode exact10 aliasとし、
protected invariantはcandidate preserved differencesから導出しduplicate fieldへ保存しない。semantic_loss_codesはcandidate constructionで
実際にlost／collapsedしたcodeのcanonical unionとする。required invariant loss exact1+はhard-invalidでseal／select 0、
全hard-valid sealed candidateはsemantic_loss_codes=()とする。actual lossとのmissing／extra／foreign／order mismatchをrejectする。

lossはstored fieldから推定しない。candidate exact18からsemantic_loss_codesを除くpreloss exact17を先にowner mapへ解決し、
そこからMeaningSemanticSignature exact13を再構築する。preserved_difference_refsをRequiredDifference semantic orderでexact1解決し、
各rowのinvariant_codes、counterfactual mutation target、retention dutyを§3.6のDifferenceInvariantCode exact10 predicateへ通して
actual missing／collapsed codeをdeclaration-order unionする。source target presentなのにmutation no-op／code None、predicate mapping不能、
ambiguous refはlossへ推定せずIM03～IM06 implementation REDとする。expected loss exact1+はhard-invalidでID／evidence／selection 0。
expected loss exact0のdraftだけsemantic_loss_codes=()を確定し、final exact18→recomputed signatureを加えたexact19→CANDIDATE_CORE_IDの順で作る。
validatorも同じpure functionと順序でsignature、loss、hard validity、exact19、IDを再計算する。

counterfactual producerはclosed exact12全kindを§3.6表のMeaningSemanticSignature exact13 deltaとexact7 consequence codeへ閉じる。
source-bound target exact0だけcandidate-local Noneを許し、そのdraftはhard-invalidとする。target exact1のno-op／code Noneは
IM03～IM06 implementation REDであり、candidate reject／LIMITEDへ変換しない。全kindのtarget-present positive testをIM06 exit条件にする。

各WholeReadingConsequenceRowはcandidate semantic signatureとbundle-required differenceへexact bindする。
各row IDはconsequence_idを除く現行field exact8 mapを`stage1_canonical_json_bytes`へ渡す既存
`whole_reading_consequence_id()`から算出し、prefix／suffixも変更しない。row orderはcarrierの
RequiredDifference semantic order→WholeReadingConsequenceCode declaration order→baseline／mutated
signature canonical bytesという現行validator順をliteral reuseし、ID sortへ置換しない。
evidence IDはcandidate core ID、foreground_scope_ref、required_difference_refs、
discriminative_necessity_refs、whole_reading_consequence_refs、canonical full row recordsから算出する。
sealed candidateのcandidate_idはCANDIDATE_CORE_IDとし、
InputSpecificityEvidence.candidate_ref == InputSpecificMeaningCandidate.candidate_idを維持する。
evidence required_difference_refsはcandidate preserved_difference_refsのsubsetで、candidate requirement bundlesから
到達可能でなければならず、各whole-reading rowのrequired_difference_refも同じevidence setに属する。
candidate requirement_bundle_refsはsame selector RequirementBundleSet.bundle_refsのnonempty subset、
basis_configuration_refsは参照bundleのanchor／adjacentから到達、evidence foreground_scope_refはsame bundle-set
scopeとexact一致させる。discriminative_necessity_refsは各required differenceが所有する既存
CounterfactualMutationRow.mutation_idのcanonical tupleとし、各refのexact1解決とcandidate-bound row使用を要求する。
validatorはpreloss exact17、typed signature exact13、protected difference／actual loss、loss hard-validity、final exact18、core ID exact19、row ID exact8、
evidence ID exact5＋full rows、remaining sealed field／back-bind／difference bindingの順で再計算する。
full-record mutual hashを禁止する。

CANDIDATE_CORE_ID、EVIDENCE_ID、SELECTED_READING_IDは§3.6のexact payload mapを
`stage1_canonical_json_bytes`へexact1回渡し、lowercase SHA-256 exact64と同節のliteral prefix／version suffixで作る。
raw concatenation、generic H、stored signature／traceによる自己正当化を禁止し、single-leaf mutation／prefix／suffix／digest／
cross-domain swap／tuple permutationをrejectする。

candidate／outcomeの全ref-bearing fieldは§3.6のPhase-A／carrier owner-domain mapへexact1解決し、
mixed-owner trace sourceだけfixed owner precedence→owner内semantic positionでcanonical化する。新registryを作らず、
response／compositionが既に持つimmutable Phase-A owners、ForegroundScopeDerivation、GroundedMeaningGraph、carrierからrequest-local lookupを作る。

各hard-valid candidateについて、参照Requirement Bundlesが所有する各required differenceにmatching row exact1を要求する。
evidence required_difference_refsはそのcanonical unionとexact一致し、candidate preserved_difference_refsのsubsetでなければならない。
missing／extra／duplicate／foreign-candidate row、scope／source mismatchをhard-invalidにする。
row欠落やrich candidate実装不良をLIMITEDへ変換しない。
post-selection ReadingConsequenceはIM04だけが所有する。
NORMALだけがselected candidate exact1、ReadingConsequence exact1、MeaningBoundReceptionSet 1..4へ進む。
LIMITEDはLimitedMeaningOutcome、selected candidate 0、ReadingConsequence 0、
BoundedLimitedReception exact1であり、validate_response_consequence_bindingを呼ばない。
```

---

## 14. IM03開始前の移行手順

本版はPro初回判定の`REQUIRED_CORRECTIONS exact8`を反映済みである。次は全文再レビューや同一採用事項への重複承認を置かず、次の順で適用する。

1. Cocolon／mashos-api／System Contextのcurrent headsと、対象設計、rules、runtime正本、source、test、fixture、selector、denominatorのpreimageをremoteからfresh取得する。
2. Pro華恋は§16のexact8対応差分だけをbounded confirmationし、未解消required correction exact0または明示一覧を返す。全文二回目review、既承認中心方針の再審査、human credit resetは0とする。
3. approval-affecting driftがあればcanonical sync／implementationを0とし、そのdriftに必要な最小差分だけをUltra修正→Pro差分確認へ戻す。無関係driftはexact evidenceを同packetへ記録する。
4. `APPROVAL_PACKET_A` exact1を、次の全subjectへ一括bindして作る。
   - 本修正版のexact identity、fresh preimage、canonical rule／design／map／handoffのexact changed paths
   - R10.3 applicability revisionと、closed exact4に限るconditional bounded mechanical repair authority exact1、helper／launcher exact1、repair exact1、fresh rerun exact1、second failure STOP
   - Rule 18 development applicability revision
   - validity、current-forward root v1.1 exact12、carrier、identity exact19、trace sealed exact3／wire exact10、semantic-loss、full-coverage、blank-state closure
   - `IM03～IM06` atomic implementation authorityと、source／test／fixture／runner allowlist
   - selector、input、protected denominator、axes、comparator
   - static target dependency projection、frozen repository lock、approved acquisition route、network acquisition count exact0または明示exact1、runtime materialization exact1
   - canonical sync、runtime materialization／acquisition、GitHub checkpoint writesのeffect identity、exact paths、count、remote postverify
5. Mashは`APPROVAL_PACKET_A`をexact1回承認する。canonical同期とIM03～IM06実装を別承認に分割しない。
6. canonical write／implementation直前に同preimageをfresh取得し、approval-affecting drift exact0を確認する。Packet A内で`CURRENT_RULES.md`、runtime正本、Rule 16、Rule 18、対象設計§16～§17、v1 index、current structure、handoffを同期する。過去IM00～IM02 commit、test result、STOP履歴は書き換えない。
7. 同じPacket A authorityでIM03～IM06を実装する。IM03～IM05は`IN_PROGRESS_UNIT_NOT_COMPLETE`のdurable checkpointであり、追加Mash承認0、独立COMPLETE 0、Product credit 0とする。technical creditはremote保存・postverify済みactual reusable evidenceに従う。
8. 各checkpointでworking exact17を同期し、IM06 development GREEN＋formal pre-admission PASSを`FREEZE_READY`として保存する。formal evaluation bundle自体はまだlaunchしない。
9. IM06 freeze-ready後、`APPROVAL_PACKET_B` exact1を作る。Packet Bはpre-IM07 Rule 16 Gate A read-only discovery、cross-session時のconditional Gate B exact1、attempt／human read 0・runtime continuity維持・drift 0の場合だけ使えるactor-only `ACTOR_HANDOFF_REPLACEMENT_EXACT1`、IM07 machine formal exact1、MACHINE CLEAR時だけIM08 Ultra read exact1、IM08 CLEAR時だけIM09 Pro read exact1へbindする。old＋replacementを通じたformal launch totalはexact1、second actor breakは0とする。各counterとreviewer独立性は分離維持し、いずれかnonclearでremaining effectを0、correction／regeneration／rereadを0とする。
10. Mashは`APPROVAL_PACKET_B`をexact1回承認する。Gate A／conditional Gate B／IM07／IM08／IM09ごとの追加承認は0とする。
11. IM10 Mash formal Product ReadだけはPacket A／Bへ含めず、別のexact1 authorityとする。

Packet A／Bは承認回数を減らすだけであり、effect counter、machine／Ultra／Proの独立性、nonclear後のterminal STOPを統合しない。

current stateは次へ固定する。

```text
IM00 = HISTORICAL_RECORDED_STATUS_RETAINED
IM01 = HISTORICAL_RECORDED_STATUS_RETAINED
HISTORICAL_RECORDED_STATUS = IM02_COMPLETE_NONTERMINAL_CHECKPOINT
HISTORICAL_GATE_RESULT = 32/32_TOTAL_WITH_SUBSET_TARGETED_7/7_SEPARATE_COMMAND
CURRENT_REVISED_DESIGN_CONFORMANCE = PARTIAL
REVISED_IM03_06_GREEN = NOT_ESTABLISHED
NEXT = REVISED_IM03_THROUGH_IM06_ATOMIC
```

### 14.1 やらないこと

- IM00～IM02 sourceのrollback。
- 過去PASSの削除。
- actual row exact0をcandidate closure PASSへ流用。
- 本案だけを根拠にIM03 implementationを開始。
- Pro bounded delta confirmation／Packet A approval前のcanonical rule変更。
- Pro全文レビューのやり直し。
- canonical同期とIM03～IM06実装に対するMash承認の二重化。
- Packet B内のGate A／conditional Gate B／IM07／IM08／IM09に対する個別の追加Mash承認。
- failure対策用の新helper／launcher／scanner作成。
- System Context専用の新構造追加。
- 本修正版proposalのGitHub反映をcanonical採用・実装authorityとみなすこと。
- GitHubへのprivate output記録。

---

## 15. 設計修正のacceptance examples

Proレビューでは、少なくとも次の例が一意に処理できるか確認する。

| example | expected disposition |
|---|---|
| selector／source／conftest／plugin／import chainの静的解決でFastAPIがrequiredと判明 | runtime構築前にtarget dependency projectionとfrozen lock mappingへ含め、approved routeでruntimeをexact1 materializeする。formal attempt 0 |
| requirementsにはあるがactual target projection外のoptional dependency | 自動取得0。追加不要ならprojection外のまま、必要ならclassifier Cのscope drift／new dependency named STOP |
| projection内の`pytest`がmaterialized runtimeで見つからず、helper／launcher invocation 0、R10.3 event 0、effect state既知 | command／environment bindingだけで同一runtime内に閉じ、追加acquisition／reinstall／rematerialization 0ならclassifier A。再materializationまたは追加acquisitionが必要ならclassifier C named STOP。formal attempt 0 |
| concrete launcher exact1がcommand construction errorを実測 | classifier Bだけ。Packet A conditional R10.3 exact1でmechanical repair exact1＋fresh rerun exact1。development return 0、second failure STOP |
| IM06 pre-admissionのconftest plugin import failure | 全条件を§7.0 classifier exact1へ送る。Aだけdevelopment return、BだけR10.3、projection外／new dependencyはC named STOP |
| collect-onlyが0件 | selector／harnessがapproved projection内、helper invocation 0、R10.3 event 0ならA。それ以外はB／C／classifier不能STOP。formal attempt 0 |
| pre-IM07 current-session admissionでruntime／exact executable continuity invalid | targeted invocation 0、formal attempt 0、IM07未activate、Rule 16既存STOP。Packet B外の追加Gate／approval 0 |
| Rule 16 admission VALID後、IM07 entryでsource／test／contract／config／criteriaまたはbundle non-runtime leafにdrift／freeze failure | targeted invocation 0、formal attempt 0、current IM07 authorityをunconsumed close、target §17.3 named STOP、fresh Level 3待ち。Rule 16へ送らない |
| IM07 attempt 0でactorだけ変更、runtime continuity／drift 0は維持 | current allocationをunconsumed closeし、Packet B `ACTOR_HANDOFF_REPLACEMENT_EXACT1`でexisting owner-handoff＋same-packet replacement allocation exact1。追加Mash approval 0、formal launch total exact1、second actor breakはPacket B terminal STOP |
| pre-admission PASS後、formal OS launchしてsetup前error | formal attempt 1、current authorityを閉じnamed STOP |
| formal OS launch requestを渡したがOS reject／pytest start 0 | atomic transitionでformal attempt 1、巻戻し0 |
| IM04 focused test `6/8` | approved ownerを修正しchanged stateを検証。fresh Mash approvalなし |
| 同じbytes／runtime／commandを変更なしで再実行 | 禁止 |
| failing selectorを削ってGREENにする | STOP |
| denominatorを32から28へ減らす | STOP |
| fixtureの旧constructorをnew approved typeへ意味不変移行 | same-unit causal repair |
| expected meaningを結果観測後に変更 | STOP |
| derived digestをcurrent approved bytesから同じ規則で再計算 | development中は許可 |
| identity対象pathを変更 | STOP |
| permission外sourceが必要 | STOP |
| 新product dependency／external serviceが必要 | STOP |
| IM03 working candidateのrowsがexact0 | working candidate hard-invalid、IM03～IM06 atomic unit未完了 |
| same semantic signatureだがprovenance／evidence／tier／unknown／source projectionが異なる | dedupe 0。distinct candidateとしてselectionまで保持 |
| recomputed `CANDIDATE_CORE_ID_PREIMAGE` exact19が完全一致 | seal前dedupe exact1。stored signatureやIDだけではdedupeしない |
| candidate constructionでrequired invariant loss exact1+、`semantic_loss_codes` nonempty | hard-invalid、seal／select 0。protected invariant一覧をloss fieldへ入れない |
| hard-valid candidate | `semantic_loss_codes=()`、protected invariantsは`preserved_difference_refs`から導出 |
| AVAILABLE＋Required Difference exact1+＋pool nonempty＋hard-valid exact0＋closed LIMITED state exact0 | `IM03_THROUGH_IM06_IMPLEMENTATION_RED`。carrier seal 0、Reception 0、visible artifact 0 |
| current runtimeへroot v1.0 exact9 payload | decode／admit／validate 0。historical Git evidenceだけで保持 |
| sealed MeaningDecisionTraceへ`HARD_INVALID`またはHV01..HV12を入れる | reject。sealed kind exact3／wire reason exact10だけ。HVはdevelopment-only evidence |
| IM07 product assertion failure | formal attempt 1、current authorityを閉じnamed STOP、fresh Level 3待ち |
| IM07 harness errorでproduct verdict不成立 | formal attempt 1、current authorityを閉じnamed STOP、same-authority new bundle 0 |
| IM08／IM09がin-scope genericity defectを発見 | review judgmentを閉じnamed STOP、same-authority return／reread 0 |
| metadataだけ変えvisible bodyが同じ | new review object不成立、再review禁止 |
| corrected candidateでprivate outputを再生成 | fresh Mash Level 3 correction authorityがinput reuse／generation countを明示した場合だけ |
| IM08／IM09がcontract gapを発見 | terminal STOP |
| IM10 non-PASS | terminal STOP、fresh product-correction authority待ち |
| IM03～IM05 development GREEN | `IN_PROGRESS_UNIT_NOT_COMPLETE`。`ATOMIC_UNIT_COMPLETE=false`、`PRODUCT_CREDIT=0`、`TECHNICAL_CREDIT=actual reusable evidence` |
| IM03～IM06中にsessionが終了 | launch exact0、既存processへ再接続可能、またはresult既知ならPAUSED_CONTINUABLE。launch/result不明はUNKNOWNとしてcurrent authority terminal close |
| IM07 formal launch後にsession／tool interruption | attempt 1、effect不明を含めnamed STOP。same-authority rerun 0 |

### 15.1 修正案自体の合格条件

1. product principles change 0と、validity／carrier／identity contractのmaterial proposed changeを分離し、後者をPro／Mash承認事項として明示する。
2. Route A-only、external AI／provider／network／fallback 0を維持。
3. IM02→IM03のcandidate signature依存逆転が解消される。
4. actual producer／consumerなしのplaceholderをatomic unit completeにしない。
5. IM03～IM06にcausal development loopがある。
6. same-state blind rerunは0。
7. formal attempt消費点が一意。
8. prelaunch `PRODUCT_IMPLEMENTATION_ID`、`FORMAL_EVALUATION_BUNDLE_ID`、launch後`FORMAL_RESULT_ID`、`REVIEW_OBJECT_ID`が順序どおり分離される。
9. test／fixture／denominator gamingの抜け道0。
10. IM07 formal commandはOS launch時にexact1を消費し、same-authority correction 0。
11. REVIEW_OBJECT_IDがvisible bodyとtraceへbindされ、metadata-only rereadができない。
12. IM08／IM09の独立one-shotとnamed STOPを維持。
13. IM10のformal性を維持。
14. R10.2 exact6、R10.3 owner内exact4／bounded repair count、Rule 18のnumeric counter carry、counter 2/2を保持しつつ、R10.3 applicabilityとRule 18 development effect identity／applicabilityのmaterial changeを明示する。
15. exact17 working identityを各checkpointで同期する。
16. new helper／runner／scanner／Receipt family 0。
17. 既存owner hierarchyを維持する。
18. IM00～IM02のremote bytesとhistorical evidenceを保持する。
19. candidate-bound consequence未実装を隠さない。
20. 次formal／human gateへautomatic progressionを発生させない。
21. current-forward `InputSpecificMeaningStructure` v1.1 required exact12だけがcandidate／evidence／outcomeをdangling refなしでcarryし、root v1.0 live decode／admit／validate／serialize、Optional／default None、parallel carrier／registry serviceは0である。
22. pre-IM07 runtime／executable admission invalidだけがRule 16既存STOPへ進み、Packet Bに条件付きでbindしたGate B exact1以外の追加Gate／approvalは0、admission VALID後のnon-runtime drift／freeze failureはtarget §17.3 named STOP／fresh Level 3へ分離される。
23. OS launch request、attempt 0→1、bundle CONSUMEDが一つのatomic transitionである。
24. current rootはv1.1 exact12だけをadmitし、nested IM02 contracts v1.0と現行row ID／semantic orderを保持する。historical root v1.0はGit history／receipt／commitだけで保持する。
25. candidate bundle-set／configuration／scope／difference／mutation graphとNORMAL／LIMITED tag closureにforeign／orphan refがない。
26. closed exact12 mutationのtarget-present positive delta／exact7 codeが全kindで成立し、target-present no-opをcandidate reject／LIMITEDへ偽装しない。
27. sealed trace kindは`SELECTED | NONSELECTED_VALID | LIMITED_BASIS` exact3、wire reasonはSEL00..SEL06＋LIM01..LIM03 exact10で閉じ、`HARD_INVALID`／HV01..HV12をsealed identityへ含めない。
28. dedupeはrecomputed candidate core projection exact19完全一致だけで行い、same semantic signatureでもprovenance／evidence／tier／unknown／source projectionが異なるcandidateを保持する。
29. `semantic_loss_codes`はpreloss exact17→signature→protected difference exact10 predicateでcore ID前に再計算したactual lost／collapsed invariant codeだけを表し、hard-valid candidateはempty、protected invariantsは`preserved_difference_refs`から導出する。constructorとvalidatorは同じpure function／順序を使う。
30. AVAILABLE＋Required Difference exact1+＋pool nonempty＋hard-valid exact0＋closed LIMITED state exact0をimplementation REDとし、seal／Reception／visible artifactを0にする。
31. 全pre-admission resultはexclusive classifier A／B／C exact1へ入り、Aだけdevelopment return、BだけPacket A conditional R10.3、C／classifier不能はnamed STOPとなる。
32. selector→static import chain→target dependency projection→frozen lock mappingをruntime materializationより先に閉じ、projection外dependencyを自動取得しない。
33. Mash承認はPacket A exact1＋Packet B exact1＋separate IM10 exact1であり、IM03～IM06 checkpointやIM07／IM08／IM09ごとの重複承認は0である。

---

## 16. Pro華恋の差分限定確認 exact8

Pro華恋の初回`PASS_WITH_REQUIRED_CORRECTIONS`で中心方針は承認済みである。確認対象は次のexact8だけとし、technical design全文の再考案、全文二回目review、既承認項目のcredit resetは0とする。

| # | 初回required correction | 本版の反映箇所 | bounded confirmation criterion |
|---:|---|---|---|
| 1 | root v1.0 live compatibility削除 | §3.6、§9.3、§9.6、§13.5、§15、D21 | current-forward rootはv1.1 required exact12 only。root v1.0 live decode／admit／validate／serialize、Optional／default Noneは0 |
| 2 | sealed traceから`HARD_INVALID`を除外 | §3.6、§9.3、§9.6、§13.5、§15、D23 | sealed kind exact3、wire reason exact10。HV01..HV12はdevelopment-onlyでsealed／selected／formal identityへ入らない |
| 3 | semantic signatureだけのdedupe禁止 | §3.6、§9.3、§9.6、§13.5、§15、D24 | recomputed core projection exact19完全一致だけdedupe。same signature＋different source projectionはdistinct |
| 4 | `semantic_loss_codes`意味修正 | §3.6、§9.3、§9.6、§13.5、§15、D25 | preloss exact17→signature→exact10 predicateでcore ID前にactual lossを再計算。hard-validはempty、protected invariantsはpreserved refsから導出 |
| 5 | pre-admission classifier統一 | §6、§7、§8.2～§8.3、§10、§13.2～§13.4、§15、D26 | every resultはA／B／C exact1。Aだけdevelopment、BだけR10.3、C／不能はnamed STOP |
| 6 | dependency projectionをruntimeより先に閉じる | §7、§10、§13、§14、§15、D27 | selector／static import chain／projection／lock mappingの後にruntime exact1 materialization。projection外dependency自動取得0 |
| 7 | NORMAL／LIMITED空白state closure | §3.6、§8.1、§9.3、§9.6、§13.5、§15、D28 | specified all-invalid／no-closed-LIMITED stateはimplementation RED、seal／Reception／visible exact0 |
| 8 | Mash重複承認の除去 | §6、§13、§14、§15、D29 | Packet A exact1、Packet B exact1、IM10 separate。IM03～IM06／Gate A-B／IM07-09の追加承認0 |

bounded confirmationの期待結果は次である。

```text
REQUIRED_CORRECTIONS_EXACT8 = 8/8_APPLIED
IDENTITY_CONSTRUCTION = CLEAR
CARRIER_V1_1_EXACT12 = ACCEPT
NORMAL_LIMITED_REACHABILITY_CHANGE = ACCEPT
TECHNICAL_ARCHITECTURE_CHANGE = ACCEPT
IMPLEMENTATION_EVALUATION_AUTHORITY_ROUTE_CHANGE = ACCEPT
STOP_BOUNDARY = CLEAR
R10_3_APPLICABILITY_REVISION = ACCEPT
MASH_APPROVAL_BURDEN = REDUCED_WITHOUT_SAFETY_LOSS
NEW_STRUCTURE_PROLIFERATION = 0
FULL_SECOND_REVIEW = 0
```

---

## 17. Pro華恋の差分限定返答形式

抽象的な感想や全文レビュー結果ではなく、exact8の解消だけを次の形式で返す。

```text
VERDICT = PASS | PASS_WITH_UNRESOLVED_REQUIRED_CORRECTIONS
REQUIRED_CORRECTIONS_EXACT8 = 8/8_APPLIED | exact unresolved count

RC01_CURRENT_FORWARD_ROOT_V1_1_ONLY = CLEAR | NOT_CLEAR
RC02_SEALED_TRACE_EXACT3_WIRE_EXACT10 = CLEAR | NOT_CLEAR
RC03_DEDUPE_RECOMPUTED_CORE_EXACT19 = CLEAR | NOT_CLEAR
RC04_SEMANTIC_LOSS_ACTUAL_ONLY = CLEAR | NOT_CLEAR
RC05_EXCLUSIVE_PRE_ADMISSION_CLASSIFIER = CLEAR | NOT_CLEAR
RC06_DEPENDENCY_PROJECTION_BEFORE_RUNTIME = CLEAR | NOT_CLEAR
RC07_ALL_INVALID_BLANK_STATE_CLOSED = CLEAR | NOT_CLEAR
RC08_APPROVAL_PACKET_TOPOLOGY = CLEAR | NOT_CLEAR

IDENTITY_CONSTRUCTION = CLEAR | NOT_CLEAR
CARRIER_V1_1_EXACT12 = ACCEPT | REVISE
STOP_BOUNDARY = CLEAR | NOT_CLEAR
R10_3_APPLICABILITY_REVISION = ACCEPT | REVISE
MASH_APPROVAL_BURDEN = REDUCED_WITHOUT_SAFETY_LOSS | NOT_ESTABLISHED
NEW_STRUCTURE_PROLIFERATION = 0 | FOUND
FOUND_STRUCTURE = exact list

UNRESOLVED_REQUIRED_CORRECTIONS = exact clause / exact problem / exact replacement intent | NONE
FULL_SECOND_REVIEW = 0
OPTIONAL_COMMENTS = exact list | NONE
PRODUCT_REASON = plain Japanese, delta-only
```

`PASS_WITH_UNRESOLVED_REQUIRED_CORRECTIONS`の場合だけ、未解消IDと本版のexact章番号を列挙する。初回に承認済みの中心方針を新規required correctionへ戻さない。

---

## 18. Ultra華恋の最終disposition

```text
PRIOR_PRO_VERDICT = PASS_WITH_REQUIRED_CORRECTIONS
REQUIRED_CORRECTIONS_EXACT8 = 8/8_APPLIED
CURRENT_DOCUMENT_STATUS = PRO_BOUNDED_DELTA_CONFIRMATION_PENDING
FULL_SECOND_REVIEW_REQUIRED = 0
NORMATIVE_EFFECT = NONE
CANONICAL_WRITE = 0
RUNTIME_SOURCE_TEST_CHANGE = 0
IMPLEMENTATION_AUTHORITY = 0
MASH_APPROVAL_TOPOLOGY = PACKET_A_EXACT1_THEN_PACKET_B_EXACT1_THEN_SEPARATE_IM10
```

本版は、初回Proレビューが承認した中心方針を維持したまま、指定exact8を次のように閉じた。

1. current runtimeのroot carrierはv1.1 required exact12だけとし、historical root v1.0 live pathを削除した。
2. sealed traceをexact3／wire exact10へ縮め、検証不能な`HARD_INVALID`をdevelopment-only evidenceへ戻した。
3. dedupeをrecomputed core exact19へ固定し、same visible semanticsでも異なる根拠を失わない。
4. `semantic_loss_codes`をactual lossだけへ戻し、hard-valid candidateをemptyへ固定した。
5. pre-admissionをA／B／C exclusive classifier exact1へ統一した。
6. dependency projectionとlock mappingをruntime exact1 materializationより先へ置いた。
7. all-candidate-invalid／no-closed-LIMITEDの空白stateをimplementation REDで閉じた。
8. Mash承認をPacket A exact1、Packet B exact1、separate IM10へ集約した。

このproposalのGitHub反映は、修正版をPro差分限定確認へ渡すためのexact1 writeである。canonical採用、rule同期、IM03開始、private generation、Product Read、production activationのauthorityには変換しない。

2027年3月23日の商品完成期限に対し、design／evidence／test／partial implementation／STOP消化を完成扱いしない。実ユーザー入力、意味保存、根拠のない断定0、入力固有で自然な応答、実機／pilot／実アプリの商品価値確認、releaseして対価を受け取れる状態という完成定義を維持する。

---

## Appendix A. Decision log

| ID | decision |
|---|---|
| D01 | product meaning principlesは維持し、validity／carrier／identity contract changeはmaterial proposalとして分離する |
| D02 | IM番号exact11は増やさない |
| D03 | IM00～IM02 bytes／historical test resultは保持する |
| D04 | historical IM02 COMPLETEとrevised conformance PARTIALを分離する |
| D05 | candidate-bound consequence actual issuanceをIM03へ移す |
| D06 | IM03～IM06をminimum atomic development authorityにする |
| D07 | IM06を初回testではなくdevelopment convergence／freeze-readyにする |
| D08 | IM03～IM06はcausal development loopを許可する |
| D09 | same-state blind rerunは0を維持する |
| D10 | formal proofはfrozen evaluation bundleごとOS launch exact1 |
| D11 | pre-admission failureはformal attempt 0、formal OS launch後は巻戻し0 |
| D12 | IM07以降のnonclearはsame-authority correction 0、fresh Level 3待ち |
| D13 | development REDをR10.2 blocker countへ入れず、R10.2 exact6／R10.3 owner内exact4とrepair count／Rule 18 numeric counter carryを維持しつつ、R10.3 applicabilityとRule 18 development effect identity／applicabilityをmaterial revisionする |
| D14 | scope／contract／effect driftはterminal STOP |
| D15 | IM08／IM09はreview objectごとの独立read、material defect時named STOP |
| D16 | IM10 non-PASSはterminal STOP |
| D17 | compositionは意味を再導出せずsealed artifactを検証する |
| D18 | working exact17は各checkpoint同期、formal bundleはIM07 freeze |
| D19 | 既存owner hierarchyを維持し同責務内重複だけを削る |
| D20 | new subsystem／helper／runner／scanner／Receipt familyを作らない |
| D21 | current-forward rootはv1.1 required exact12だけをadmitし、historical root v1.0はGit history／receipt／commitだけで保持する。nested v1.0と現行whole-reading row ID／semantic orderは維持する |
| D22 | IM06→IM07のsession境界ではRule 16 current-session admissionをfreshに成立させ、Packet B conditional Gate B exact1以外の追加Gate／approvalを作らない |
| D23 | MeaningDecisionTraceはsealed kind exact3／wire reason exact10だけで閉じ、`HARD_INVALID`／HV01..HV12はdevelopment-only evidenceとする |
| D24 | candidate dedupe keyはrecomputed `CANDIDATE_CORE_ID_PREIMAGE` exact19完全一致だけとする |
| D25 | preloss exact17→signature exact13→preserved refsのexact10 predicateでactual lossをcore ID前に導出し、`semantic_loss_codes`はそのcodeだけを持つ。hard-validはempty、constructor／validatorは同じpure functionと順序を使う |
| D26 | pre-admissionはA development return／B Packet A conditional R10.3／C named STOPのexclusive classifier exact1へ統一する |
| D27 | target selectorとstatic import chainからdependency projection／lock mappingを先に固定し、その後runtimeをexact1 materializeする |
| D28 | AVAILABLE＋Required Difference exact1+＋pool nonempty＋hard-valid exact0＋closed LIMITED exact0はimplementation RED、seal／Reception／visible exact0とする |
| D29 | Mash approvalはPacket A exact1＋Packet B exact1＋separate IM10 exact1とし、checkpoint／Gate／IMごとの重複承認を0にする |

## Appendix B. 見落とし防止checklist

- [ ] §17だけ直し、R10.2／R10.3、runtime正本、Rule 16、Rule 18の適用範囲を未同期にしていないか。
- [ ] R10.2 exact6、R10.3 owner内exact4／repair count、Rule 18のnumeric counter carry、COMMON_DEFECT_RETURN_COUNT 2/2を保持し、R10.3とRule 18 development applicabilityのmaterial changeを隠していないか。
- [ ] pre-admission commandとformal OS launch commandを混同していないか。
- [ ] 全pre-admission resultをA／B／C exclusive classifier exact1へ通し、同一eventをdevelopment returnとR10.3へ二重計上していないか。
- [ ] Packet Aがconditional R10.3 exact1とsecond failure STOPまでbindし、実行時の追加承認を要求していないか。
- [ ] authority-frozen target dependency projectionをrequirements全体へ拡大していないか。
- [ ] selector／source／conftest／plugin／import chain→projection→lock mappingをruntime materializationより先に閉じているか。
- [ ] Packet Aのfrozen lock／approved acquisition route／network acquisition count exact0または明示exact1／runtime materialization exact1を超える取得・再構築を暗黙に許していないか。
- [ ] candidate source defectとcandidate外runtime defectをphaseだけで決めていないか。
- [ ] IM02のrow exact0を隠していないか。
- [ ] IM03でcandidate signatureより先にrowを作っていないか。
- [ ] evidence／candidate identityが循環していないか。
- [ ] current-forward rootはv1.1 required exact12だけで、root v1.0 live decode／admit／validate／serialize、Optional／default Noneが0か。
- [ ] historical root v1.0をGit history／receipt／commit以外のcurrent live branchへ戻していないか。
- [ ] root v1.1 migrationでnested schema versionや現行whole-reading row ID／orderを誤って変更していないか。
- [ ] sealed MeaningDecisionTraceをexact3／wire exact10で閉じ、`HARD_INVALID`／HV01..HV12をsealed identityへ入れていないか。
- [ ] candidate dedupeをstored signature／IDで行わず、recomputed core exact19完全一致だけに限定しているか。
- [ ] same semantic signatureでもprovenance／evidence／tier／unknown／source projectionが異なるcandidateを保持しているか。
- [ ] `semantic_loss_codes`を保存済みinvariant一覧にせずactual lossだけとし、hard-validをemptyにしているか。
- [ ] candidate bundle-set／configuration／scope／difference／mutation graphにforeign refがないか。
- [ ] NORMAL／LIMITED tagごとのcandidate／evidence／row／outcome／trace cardinalityを閉じているか。
- [ ] AVAILABLE＋Required Difference exact1+＋pool nonempty＋hard-valid exact0＋closed LIMITED exact0をimplementation REDとしてseal／Reception／visible exact0にしているか。
- [ ] validity full coverage strengtheningをproduct semantics不変と誤表示していないか。
- [ ] compositionがmeaning selectionを再実行していないか。
- [ ] old fixture shapeをIM06 exitへ持ち越していないか。
- [ ] IM03～IM05を独立COMPLETE／credit／fresh approval Gateにしていないか。
- [ ] IM03～IM05を`IN_PROGRESS_UNIT_NOT_COMPLETE`とし、Product credit 0とactual technical evidenceを分離しているか。
- [ ] IM03～IM06 atomic unitにactual producer／consumer／focused／cumulative testがあるか。
- [ ] IM06が初回統合test工程のままではないか。
- [ ] working exact17を各checkpointでcurrent bytesへ同期しているか。
- [ ] formal bundleをIM06以前にfreezeしていないか。
- [ ] formal freeze後にsource／test／fixture／denominatorを同じcandidateのまま変更できないか。
- [ ] same-state rerunを`fresh run`と言い換えて復活させていないか。
- [ ] IM03～IM06 new working-state verificationをretryとしてSTOPさせていないか。
- [ ] IM07以降のnew candidate／bundleをsame authorityで作っていないか。
- [ ] failing selector／denominatorを減らす抜け道がないか。
- [ ] IM08／IM09のsame-review-object rereadを許していないか。
- [ ] IM08／IM09 material defectをsame-authority returnさせていないか。
- [ ] Mash approvalをPacket A exact1、Packet B exact1、separate IM10 exact1へ限定し、canonical sync／checkpoint／Gate A-B／IM07-09で重複させていないか。
- [ ] machine GREENをProduct PASSへ昇格していないか。
- [ ] Route B、external AI、provider、network、fallbackを復活させていないか。
- [ ] 新helper、launcher、scanner、runner、Receipt familyを追加していないか。
- [ ] global current owner exact1や新checkpoint schemaを作っていないか。
- [ ] 既存owner hierarchy内で同じ責務の全文を重複していないか。
- [ ] IM00～IM02の過去failure／PASS履歴を遡及改変していないか。
- [ ] IM07／IM08／IM09／IM10やproductionへautomatic progressionしていないか。

## Appendix C. 本案の非権限宣言

本案は、Pro華恋の初回`REQUIRED_CORRECTIONS exact8`を反映したbounded delta confirmation candidateである。今回ユーザーが明示したGitHub反映authorityは、この修正版proposal fileのcreate exact1とremote postverifyにだけ適用する。

`STRUCTURE_MAP_DELTA = NONE`である。理由は、本writeが未採用・非normativeなcorrected proposalの新規配置だけで、current architecture、owner、contract、必読routing、名称境界をまだ変更しないためである。

本案だけでは、次を許可しない。

- canonical design変更
- CURRENT_RULES変更
- runtime rule変更
- source／test変更
- canonical／runtime／source／test／private outputのGitHub更新
- corrected proposal exact1以外のPR差分
- IM03開始
- private input生成
- Product Read実行
- production activation

Pro華恋のexact8差分限定確認後、Mashが`APPROVAL_PACKET_A`をexact1承認してからcanonical owner同期とIM03～IM06 atomic implementationへ進む。IM06 freeze-ready後は`APPROVAL_PACKET_B` exact1、IM10は別authorityとする。
