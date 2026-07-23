# NLS v3 Step 11 Cycle 001 Recovery Epoch 001
## Step 5 cross-role unmatched optional selection / CONTENT_DEPTH_ONLY contract reconciliation

- date: 2026-07-23
- authority:
  `NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_UNMATCHED_OPTIONAL_SELECTION_AND_CONTENT_DEPTH_ONLY_CONTRACT_RECONCILIATION_READ_ONLY`
- execution class: read-only contract reconciliation plus body-free evidence recording
- result:
  `TARGETED_EXACT7_MACHINE_GREEN_CONFIRMED_UNMATCHED_OPTIONAL_SELECTION_PARENT_CONTRACT_CONFLICT_CONFIRMED_IMPLEMENTATION_GREEN_REJECTED_STEP5_NOT_COMPLETED_AUTHORITY_STOP`

## 1. 結論

前権限
`NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_BOUND_SELECTED_INTERSECTION_AND_CONTENT_DEPTH_ONLY_CONTRACT_RECONCILIATION_IMPLEMENTATION_AND_GREEN_ONLY`
による mashos-api 実装は、指定 exact7 を
`7 passed / 0 failed / 0 error`
へ到達させた。

しかし、この machine GREEN は Step 5 の親契約 GREEN として受理できない。
現行 Content Selection は、effect scope が `CONTENT_DEPTH_ONLY` の cross-role
witness から unmatched obligation を `forced_active_ids` へ加え、required では
ない optional obligation まで `selected` に変更する。現行 S5 test も、この
変更を明示的に要求している。

親設計は witness による次の変更を禁止している。

- obligation decision status
- selected / deferred / integrated-into policy
- required coverage IDs
- source refs / source roles
- original reception target / owner
- question-decision boundary

したがって、現行 exact7 は誤ったテスト期待と実装が同時に成立した
`TARGETED_MACHINE_GREEN` であり、contract GREEN ではない。

## 2. 開始 pin と実体同一性

### 2.1 GitHub entry heads

- Cocolon main:
  `a9be4960aca76427cb0dcd66730dce8c4a84d7dc`
- mashos-api main:
  `b43f84a6b868e983a91c40e73735e03865806818`

開始時と証拠判定前に両 head を再取得し、関連 drift がないことを確認した。

### 2.2 predecessor / implementation delta

- predecessor mashos-api:
  `4abc06bc544709f359ad4984357af0cd60fe083f`
- implementation mashos-api:
  `b43f84a6b868e983a91c40e73735e03865806818`
- compare:
  `ahead_by=1 / behind_by=0 / total_commits=1`
- changed path exact3:
  1. `ai/services/ai_inference/emlis_ai_grounded_observation_semantic_restatement_v3.py`
  2. `ai/services/ai_inference/emlis_ai_semantic_obligation_inventory_v3.py`
  3. `ai/services/ai_inference/emlis_ai_content_selection_v3.py`
- test path change:
  exact0

### 2.3 verification materialization

ローカル検証材は predecessor `4abc06bc...` に、GitHub
`b43f84a6...` の source exact3 を重ねたものだった。source exact3 と
authoritative exact7 test exact4 の Git object blob は、GitHub
`b43f84a6...` の各実ファイルと一致した。

| role | path | Git blob | SHA-256 |
|---|---|---|---|
| semantic owner | `ai/services/ai_inference/emlis_ai_grounded_observation_semantic_restatement_v3.py` | `cd2caeac0dfa4b502c798e1e5f65653033c96e2c` | `348003adbe7991de1717a8a2a7ca9d26a04e7f42caccdef2e4a0f31634f171b6` |
| inventory owner | `ai/services/ai_inference/emlis_ai_semantic_obligation_inventory_v3.py` | `241d38331b00fd6c7bd17d4c8a30b6b52b0c3f69` | `ddc42e6f30c46876b4ccc6c7f936c6cc7dcc6f394cbc2d9825694c7617b465f9` |
| content consumer | `ai/services/ai_inference/emlis_ai_content_selection_v3.py` | `6096dd41e46fe9d9abc7695b49b3125b2f87cea1` | `3c9c51a9e514169a1b17d408329b3d2d526bab08b8663e0fb2606ae358eec3bb` |
| semantic direct test | `ai/tests/test_emlis_ai_grounded_observation_semantic_restatement.py` | `49864c6ee6a944c603da21ebd18ba60633e56fb9` | `28e74e82e7351a4e3f92345a30cf21e0a59aeb1b820a639baad509316ff3215b` |
| inventory direct test | `ai/tests/test_emlis_nls_v3_s4_semantic_obligation_inventory.py` | `3f0bd59facec541d8bad09d1af9410344c753e45` | `6aeba82aae9615f089a7fcf034efc317be4988011c6c7239460b6f5538fee3b0` |
| content direct test | `ai/tests/test_emlis_nls_v3_s5_content_selection_stage_context.py` | `f2e702a75c2294d689e3f55a6b7b7b8da149fa2a` | `cb55178ca5df4746074b7d1c242d46463c5335d7d0a7962900933e5c11cf62f9` |
| recovery test | `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py` | `51454fe9d1f0f6267d04e5f9872689be0072bed7` | `0ddbe5c7e1aef2f56276775694e0b016c5902e367fa1de98e7848cc6ab6e3cb1` |

ローカルの既存未追跡ファイル、仮想環境、cache は GitHub 証拠ではなく、
変更・削除・反映していない。

## 3. 参照した上位契約

### 3.1 parent design

- path:
  `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_Step5CrossRoleSemanticRestatementWitnessAndDepthNoninflation_ParentDesignAddendum_ReadOnly_20260723.md`
- blob:
  `df8d2e49287554b3da2867afde634b3afbec4a37`

固定済みの意味は次のとおり。

1. witness は body-free typed-component equivalence の証拠である。
2. witness の効果は `CONTENT_DEPTH_ONLY` に限る。
3. obligation は削除・統合・延期・role変更しない。
4. Content Selection の decision status と selection policy は変更しない。
5. unmatched component / meaning は role-local に distinct のまま残す。
6. witness を omit / defer / integrate の根拠にする false collapse は拒否する。

### 3.2 corrected RED predecessor

- result blob:
  `6559b60f7a9041e754111d02b11ae59114319a43`
- receipt blob:
  `a88a76a0c7f9e0a6aada8e473ec9407fa20a4279`
- handoff blob:
  `d7698ae68fcbbe423e55de4c60789e52caa13435`

この predecessor は bound-obligation set の non-empty を保持し、
selected intersection を不要とした。一方、optional selection を witness
authority 外へ置く親契約は変更していない。

## 4. authoritative exact7 再実行

### 4.1 exact node order

1. recovery authority / surface
2. semantic owner direct
3. semantic owner recovery
4. inventory owner direct
5. inventory owner recovery
6. content consumer direct
7. content consumer recovery

### 4.2 result

- collected: 7
- passed: 7
- failed: 0
- errors: 0
- unexpected: 0
- warning: 0
- duration: 8.22 seconds

この結果は、GitHub `b43f84a6...` と同一の exact7 materialization に対する
machine result である。broad regression、canonical closure、formal
exact100、Product Read は実行していない。

## 5. parent-contract conflict の body-free 証拠

### 5.1 現行実装の因果 chain

`emlis_ai_content_selection_v3.py` では、次の chain が成立する。

1. `_cross_role_unmatched_obligation_ids(...)` が witness の bound component
   以外を参照する obligation IDs を返す。
2. builder と validator の両方で、その IDs を
   `_required_stance_target_closure(...)` と union し、
   `forced_active_ids` とする。
3. `_expected_decision(...)` は required でない obligation でも
   `forced_active_ids` に含まれれば `selected` とする。
4. S5 direct test は `unmatched_obligation_ids <= unmatched_selected_ids`
   を要求する。

この chain は「unmatched meaning を distinct に保持する」ことを、
「unmatched optional obligation を selected にする」ことへ拡張している。
前者は親契約で必要だが、後者は `CONTENT_DEPTH_ONLY` の権限外である。

### 5.2 body-free aggregate

raw input/output、引用、識別可能な言い換え、individual mapping、body digest
は記録していない。

| field | value |
|---|---:|
| partition issue count | 0 |
| effect scope | `CONTENT_DEPTH_ONLY` |
| unmatched obligation count | 33 |
| required unmatched count | 10 |
| optional unmatched count | 23 |
| unmatched selected count | 33 |
| optional unmatched selected count | 23 |
| optional reception selected count | 1 |

optional unmatched selected の kind aggregate:

- `bound_emlis_reception`: 1
- `grounded_nucleus_notice`: 10
- `grounded_relation_preservation`: 1
- `significance_or_shift`: 1
- `unknown_boundary_preservation`: 10

### 5.3 read-only counterfactual diagnostic

witness 由来の unmatched forcing だけを検証プロセス内で無効化し、ファイルを
変更せず同じ inventory から plan を再構築・再検証した。

| field | value |
|---|---:|
| selected count | 10 |
| required count | 10 |
| required all selected | true |
| optional selected count | 0 |
| depth | `layered` |
| policy issue count | 0 |

これは implementation result ではなく、因果局在のための read-only
diagnostic である。これにより、optional 23件の選択化は required coverage
または depth floor の成立に必要ではなく、witness-derived forcing によることが
確認できる。

## 6. owner 別判定

| owner / role | machine | parent-contract | disposition |
|---|---|---|---|
| semantic witness owner | GREEN | witness / false-collapse / tamper 境界と整合 | current bytesを次REDで保護 |
| inventory / snapshot owner | GREEN | lineage / alias / role-local distinctness と整合 | current bytesを次REDで保護 |
| content consumer | GREEN | optional decision status を witness により変更 | conflict / correction required |
| S5 direct test | GREEN | forbidden optional-selection expectation を要求 | test correction required |
| recovery content test | GREEN | conflict を検出しない | lineage/causal RED correction required |

衝突は semantic proof や inventory binding の存在ではなく、Content Selection
が witness を decision authority として使用する箇所に局在する。

## 7. acceptance / closure disposition

- targeted exact7 machine GREEN:
  `CONFIRMED`
- parent-contract GREEN:
  `REJECTED`
- prior implementation authority:
  `EXECUTED_BUT_NOT_ACCEPTED_AS_STEP5_COMPLETION`
- Step 5:
  `NOT_COMPLETED`
- successful Step 0–10 completion receipt count:
  0
- source baseline:
  `UNLOCKED`
- P1 retry002:
  `NOT_AUTHORIZED`
- G2 / P2 / fresh batch:
  `NOT_AUTHORIZED` / `RESERVED_NOT_CREATED`
- formal exact100:
  `NOT_RUN`
- Product Read:
  `NOT_RUN`
- correction / B6:
  `NOT_AUTHORIZED`
- Cycle 001:
  `NOT_ACCEPTED`

## 8. 次 RED correction / refreeze の exact boundary

次の別権限で許可すべき test surface は exact2 に限る。

1. `ai/tests/test_emlis_nls_v3_s5_content_selection_stage_context.py`
2. `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py`

固定すべき causal contract:

1. witness の有無は obligation ledger の distinctness を変更しない。
2. witness の有無だけを理由に optional obligation を
   `selected / deferred / integrated_into` 間で移動しない。
3. required coverage は 100% を維持する。
4. unmatched role-local obligations は消去・統合せず distinct に残す。
5. original reception/control owner と source role/ref を維持する。
6. normal と refined の depth equality/floor を維持する。
7. current source では optional unmatched selection leak を
   causal RED として検出する。

次 RED の authoritative exact7 期待:

- collected: 7
- passed: 5
- causal failed: 2
- errors: 0
- unexpected: 0
- stable causal code:
  `RECOVERY_EPOCH001_S5_CROSS_ROLE_UNMATCHED_OPTIONAL_SELECTION_POLICY_NOT_PROVED`

次 RED authority では production source change は exact0 とする。
その後の別 implementation authority に限り、将来の source change 候補を
次の exact1 に限定する。

- `ai/services/ai_inference/emlis_ai_content_selection_v3.py`

semantic source、inventory source、semantic direct test、S4 direct test、
fixture/sample/manifest、partition owner、artifact contract、API/DB/RN/runtime/
public/shared route は protected exact0 とする。

## 9. 確認済み事実

1. GitHub の開始 head は Cocolon `a9be4960...`、mashos-api
   `b43f84a6...` だった。
2. implementation commit は predecessor に対し source exact3 のみを変更した。
3. exact7 は 7/7 pass した。
4. current S5 source は unmatched IDs を `forced_active_ids` に加える。
5. current S5 test は unmatched obligation の全選択を要求する。
6. body-free aggregate では optional unmatched 23/23 が selected だった。
7. witness-derived forcing を除く read-only diagnostic では required 10件だけが
   selected、optional selected 0、depth layered、policy issue 0 だった。
8. parent design は witness effect を `CONTENT_DEPTH_ONLY` に限定し、
   selection / defer / integrate policy の変更を禁止する。

## 10. 推測

なし。上記 disposition は GitHub 実ファイル、親設計、exact7 実行、
body-free aggregate の直接照合による。

## 11. 未確認事項

- corrected test exact2 の未作成 bytes / Git blob / SHA-256
- corrected RED の実測 5 pass / 2 causal fail
- future content-selection source exact1 の未作成 bytes / Git blob / SHA-256
- future implementation 後の exact7 GREEN
- broad regression、formal exact100、Product Read

## 12. 書かれていないこと / 推測禁止境界

- machine GREEN は Step 5 completion receipt ではない。
- current mashos-api main を黙示的に rollback または accept しない。
- counterfactual diagnostic を実装済み証拠として扱わない。
- optional content を常に deferred とする一般規則は凍結していない。
  禁止するのは witness の存在だけを decision authority とすることである。
- next RED、future implementation、broad GREEN、baseline lock、P1 retry002、
  G2、formal exact100、Product Read、B6、Cycle acceptance を自動承認しない。

## 13. 華恋の意見

machine GREEN を証拠固定するだけでは、親契約違反を「成功」として後工程へ
運ぶため不適切である。semantic proof と inventory binding は機能しており、
衝突は Content Selection の decision authority に局在しているため、次は
test exact2 で causal RED を再固定し、その後に source exact1 だけを修正する
二段階が最小かつ追跡可能である。

## 14. STOP と次候補

この authority では mashos-api source/test を変更しない。GREEN受理、
completion receipt、baseline lock、後続工程へ進まない。

Exactly one next separate authority candidate:

`NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_UNMATCHED_OPTIONAL_SELECTION_AND_CONTENT_DEPTH_ONLY_CONTRACT_RECONCILIATION_RED_CORRECTION_AND_REFREEZE_ONLY`

Automatic progression is false.
