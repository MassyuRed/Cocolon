# NLS v3 Step 11 Cycle 001 Recovery Epoch 001
## Step 5 unmatched optional selection / CONTENT_DEPTH_ONLY contract
## RED correction and refreeze handoff

- date: 2026-07-23
- completed authority:
  `NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_UNMATCHED_OPTIONAL_SELECTION_AND_CONTENT_DEPTH_ONLY_CONTRACT_RECONCILIATION_RED_CORRECTION_AND_REFREEZE_ONLY`
- result:
  `UNMATCHED_OPTIONAL_SELECTION_POLICY_CORRECTED_AND_CAUSAL_RED_REFROZEN_AUTHORITY_STOP`
- automatic progression:
  `false`

## 1. Resume point

旧test契約

```text
all unmatched obligations are selected
```

は、親契約の`CONTENT_DEPTH_ONLY`境界と衝突するため撤回済みである。

test ownerへ、production helperに依存しないbody-free oracleを固定した。

```text
independently selected unmatched obligations
  = unmatched obligations
    ∩ (
        required obligation IDs
        ∪ targets of required bound reception obligations
      )

remaining optional unmatched obligations
  = deferred_by_budget / OPTIONAL_DEFERRED_BY_BUDGET
```

現行sourceに対するauthoritative exact7は5 pass / 2 causal failで再固定済み。
次回は、別承認がある場合に限り、Content Selection source exact1を修正して
同じexact7を7/7 GREENへ戻す。

## 2. Repository pins

### 2.1 entry

- Cocolon:
  `d2c50d5559ee69303c1e93ab6074eea40c25b0b7`
- mashos-api:
  `b43f84a6b868e983a91c40e73735e03865806818`

### 2.2 result

- mashos-api atomic commit:
  `a3d43433841f58313c3cd381ce779fa0a14cdbd7`
- mashos-api result tree:
  `1ee1c3cfa6bd7dc809d81c02cc9a04e6a8978c46`
- Cocolon result commit:
  `7de566fea5e73e4594f17de2aec58b062bc3fa03`
- Cocolon receipt commit:
  `5563eb2d218f287cf01488a125fa404a7c22161b`

## 3. Normative and predecessor pins

- parent design:
  `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_Step5CrossRoleSemanticRestatementWitnessAndDepthNoninflation_ParentDesignAddendum_ReadOnly_20260723.md`
- parent design blob:
  `df8d2e49287554b3da2867afde634b3afbec4a37`
- predecessor current authority blob:
  `8762def982bc16417b617faf45161d77b9e9bb01`
- predecessor plan blob:
  `5a561b315426d6a3d67302619f740804fc6829aa`
- predecessor reconciliation result blob:
  `d624d99c81eb6234bab0807e623ef5b187b4d0c0`
- predecessor reconciliation receipt blob:
  `b6efcd9252b9b1a7e0cd09aad0491d1c58c9d57a`
- predecessor reconciliation handoff blob:
  `223b6d4c82a71642476cdea1686bf37b4e23c8ad`

Frozen parent meaning:

1. witness effectは`CONTENT_DEPTH_ONLY`である。
2. unmatched component / meaningはdistinctのまま保持する。
3. witnessはobligation decision statusを変更しない。
4. witnessはselected / deferred / integrated-into policyを変更しない。
5. required coverage、source refs/roles、original reception/control ownerを
   変更しない。

## 4. Cocolon evidence

### 4.1 result

- path:
  `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_Step5CrossRoleUnmatchedOptionalSelectionAndContentDepthOnlyContract_Reconciliation_RED_CorrectionAndRefreezeOnly_ReadOnly_20260723.md`
- blob:
  `ab1987233c8932398308e5efa323fd6a994fe661`
- SHA-256:
  `97929bb9e230428ce01f706595dfd54cab449c23d2ddfd52aa54f193d23c86ce`

### 4.2 receipt

- path:
  `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_RecoveryEpoch001_Step5CrossRoleUnmatchedOptionalSelectionAndContentDepthOnlyContract_Reconciliation_RED_CorrectionAndRefreezeOnly_ReadOnly_BodyFree_Receipt_20260723.json`
- blob:
  `8475b1b3aa542a1f702186a8e73004085d96054c`
- SHA-256:
  `1a3f13a13dfa6cc3afbf2a76a45198b5ccca51a032a1c225abeaba0224fddaea`

## 5. mashos-api changed surface exact2

| path | result blob | result SHA-256 |
|---|---|---|
| `ai/tests/test_emlis_nls_v3_s5_content_selection_stage_context.py` | `52e1b069f21861a89a1a22bc97de422cd2ac314d` | `ea18716e54a1e85c84b78d85fe8a8ff269d14c911deef08b89013277293fa475` |
| `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py` | `7f7f82a048562034189a2514c281c7853c754024` | `3893ac2333b5ae0fe970cef705c331ffb92d6e3913eb785218afa92f7604859d` |

- additions:
  410
- deletions:
  1
- production source changed path count:
  0

## 6. Authoritative exact7

Execution order:

1. recovery authority / surface
2. semantic direct
3. semantic recovery
4. inventory direct
5. inventory recovery
6. content direct
7. content recovery

Result:

```text
7 collected
5 passed
2 causal failed
0 error
0 unexpected
0 warning
11.03 seconds
```

Causal nodes:

1. `ai/tests/test_emlis_nls_v3_s5_content_selection_stage_context.py::test_s5_cross_role_depth_noninflation_floor_and_effect_scope_red`
2. `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py::test_recovery_epoch001_s5_cross_role_content_consumer_is_resolved_or_red`

Stable causal code:

```text
RECOVERY_EPOCH001_S5_CROSS_ROLE_UNMATCHED_OPTIONAL_SELECTION_POLICY_NOT_PROVED
```

## 7. Protected surface

### 7.1 source exact3 unchanged

| path | Git blob | SHA-256 |
|---|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_semantic_restatement_v3.py` | `cd2caeac0dfa4b502c798e1e5f65653033c96e2c` | `348003adbe7991de1717a8a2a7ca9d26a04e7f42caccdef2e4a0f31634f171b6` |
| `ai/services/ai_inference/emlis_ai_semantic_obligation_inventory_v3.py` | `241d38331b00fd6c7bd17d4c8a30b6b52b0c3f69` | `ddc42e6f30c46876b4ccc6c7f936c6cc7dcc6f394cbc2d9825694c7617b465f9` |
| `ai/services/ai_inference/emlis_ai_content_selection_v3.py` | `6096dd41e46fe9d9abc7695b49b3125b2f87cea1` | `3c9c51a9e514169a1b17d408329b3d2d526bab08b8663e0fb2606ae358eec3bb` |

### 7.2 other protected owners

- semantic direct test:
  `49864c6ee6a944c603da21ebd18ba60633e56fb9`
- S4 inventory direct test:
  `3f0bd59facec541d8bad09d1af9410344c753e45`
- refined partition:
  `fb6f4c299f5e61c6527acc86323a610b416c8e1d`
- artifact contract:
  `953d062fa858870e65d96cf03694d68c99003594`

fixture/sample/manifest、API/DB/RN/runtime/public/shared route、historical
RC/receipt、Detailed Design、parent design、accepted authority historyは
変更していない。

## 8. Next implementation boundary — not authorized here

Future source candidate exact1:

```text
ai/services/ai_inference/emlis_ai_content_selection_v3.py
```

必要な修正意味:

1. witness-derived unmatched IDsを`forced_active_ids`から外す。
2. independent required IDsとrequired reception targetsのselectionを保つ。
3. optional unmatched decisionsを
   `deferred_by_budget / OPTIONAL_DEFERRED_BY_BUDGET`のまま保つ。
4. cross-role depth rowsとoriginal normal-depth floorを保つ。
5. protected semantic / inventory ownerを変更しない。

Expected authoritative exact7:

```text
7 collected
7 passed
0 failed
0 error
0 unexpected
```

## 9. Closure state

- RED correction/refreeze:
  `COMPLETED`
- source implementation:
  `NOT_AUTHORIZED`
- GREEN:
  `NOT_RUN`
- broad regression:
  `NOT_RUN`
- successful Step 0–10 completion receipt count:
  0
- Step 5:
  `NOT_COMPLETED`
- source baseline:
  `UNLOCKED`
- P1 retry002 / G2 / P2:
  `NOT_AUTHORIZED`
- fresh batch:
  `RESERVED_NOT_CREATED`
- formal exact100:
  `NOT_RUN`
- Product Read:
  `NOT_RUN`
- correction / B6:
  `NOT_AUTHORIZED`
- Cycle 001:
  `NOT_ACCEPTED`

## 10. 確認済み

1. entry headsとparent evidenceをGitHubで再取得した。
2. old test contractだけを撤回し、test-owned independent oracleへ置換した。
3. oracleはproduction unmatched helperを期待値生成に使用しない。
4. original / supplemental unmatchedとoptional unmatchedをnon-vacuousに要求する。
5. authoritative exact7は5 pass / 2 causal fail / 0 errorである。
6. failure exact2は同じstable causal codeである。
7. mashos-api commitはexact2だけのatomic commitである。
8. GitHub上のexact2 bytesは検証済みlocal bytesと一致する。
9. source exact3とother protected ownerのblobは不変である。
10. resultとreceiptのGitHub bytes、blob、SHA-256は固定済みである。

## 11. 未確認

- future source exact1の未作成bytes / result blob / SHA-256
- future implementation後のexact7 GREEN
- broad regression
- canonical closure / successful completion receipt
- source baseline lock
- P1 retry002 / G2 / fresh batch
- formal exact100 / Product Read / B6

## 12. 書かれていない

- optional obligationを一般に常時deferredとする規則
- witness以外の将来の正当なselection authority
- current mashos-api resultをrollbackする指示
- current REDをStep 5 completionとする指示
- next authorityの自動承認

## 13. 推測禁止

- REDをimplementation completionへ昇格しない。
- future fixを実装済みと扱わない。
- targeted exact7をbroad regressionへ昇格しない。
- Step 5、source baseline、Cycle 001を完了・accept扱いしない。
- next implementation/GREENへ自動進行しない。

## 14. 華恋の意見

この再固定で、unmatched meaningを保持する責務と、optional contentを選ぶ
権限を分離できた。言葉を落とさず観測することは必要だが、観測したこと自体を
理由に出力選択まで強制すると、EmlisAIが「分かったこと」と「言うべきこと」を
混同する。

次の修正をContent Selection source exact1へ限定し、semantic witnessと
inventory lineageを保護したままGREENを求めるのが最も小さく妥当である。

## 15. STOP / exactly one next authority candidate

`NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_UNMATCHED_OPTIONAL_SELECTION_AND_CONTENT_DEPTH_ONLY_CONTRACT_RECONCILIATION_IMPLEMENTATION_AND_GREEN_ONLY`

この候補は未承認である。Automatic progression is false.
