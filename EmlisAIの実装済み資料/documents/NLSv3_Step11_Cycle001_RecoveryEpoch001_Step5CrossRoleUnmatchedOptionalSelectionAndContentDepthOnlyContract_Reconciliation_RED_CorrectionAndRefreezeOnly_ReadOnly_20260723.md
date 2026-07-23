# NLS v3 Step 11 Cycle 001 Recovery Epoch 001
## Step 5 unmatched optional selection / CONTENT_DEPTH_ONLY contract
## RED correction and refreeze result

- date: 2026-07-23
- authority:
  `NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_UNMATCHED_OPTIONAL_SELECTION_AND_CONTENT_DEPTH_ONLY_CONTRACT_RECONCILIATION_RED_CORRECTION_AND_REFREEZE_ONLY`
- execution class:
  test-contract correction, causal RED refreeze, body-free evidence recording
- result:
  `UNMATCHED_OPTIONAL_SELECTION_POLICY_CORRECTED_AND_CAUSAL_RED_REFROZEN_AUTHORITY_STOP`

## 1. 結論

親契約と衝突していた次の旧S5 test契約を撤回した。

```text
all unmatched obligations are selected
```

代わりに、witnessとは独立した既存Content Selection policyからdecisionを
導くbody-free oracleをtest ownerへ固定した。

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

このoracleは、unmatched meaningのledger/reference保持を要求し続ける一方、
effect scopeが`CONTENT_DEPTH_ONLY`のwitnessをoptional selection authority
として使用することを拒否する。

現行source commit `b43f84a6...` に対するauthoritative exact7は、
予定どおり次のcausal REDとなった。

```text
7 collected
5 passed
2 causal failed
0 error
0 unexpected
0 warning
```

両failureのstable causal codeは同一である。

```text
RECOVERY_EPOCH001_S5_CROSS_ROLE_UNMATCHED_OPTIONAL_SELECTION_POLICY_NOT_PROVED
```

## 2. entry pin / predecessor

### 2.1 GitHub entry heads

- Cocolon:
  `d2c50d5559ee69303c1e93ab6074eea40c25b0b7`
- mashos-api:
  `b43f84a6b868e983a91c40e73735e03865806818`

### 2.2 current authority evidence

- current authority blob:
  `8762def982bc16417b617faf45161d77b9e9bb01`
- Execution and Closure Plan blob:
  `5a561b315426d6a3d67302619f740804fc6829aa`
- reconciliation result blob:
  `d624d99c81eb6234bab0807e623ef5b187b4d0c0`
- reconciliation receipt blob:
  `b6efcd9252b9b1a7e0cd09aad0491d1c58c9d57a`
- reconciliation handoff blob:
  `223b6d4c82a71642476cdea1686bf37b4e23c8ad`
- parent design blob:
  `df8d2e49287554b3da2867afde634b3afbec4a37`

### 2.3 frozen parent meaning

1. cross-role witness effectは`CONTENT_DEPTH_ONLY`。
2. unmatched component / meaningはdistinctのまま保持する。
3. witnessはobligation decision statusを変更しない。
4. witnessはselected / deferred / integrated-into policyを変更しない。
5. required coverage、source refs/roles、original reception/control ownerを
   変更しない。

## 3. exact changed surface

### 3.1 mashos-api atomic result

- parent:
  `b43f84a6b868e983a91c40e73735e03865806818`
- tree:
  `1ee1c3cfa6bd7dc809d81c02cc9a04e6a8978c46`
- commit:
  `a3d43433841f58313c3cd381ce779fa0a14cdbd7`
- commit message:
  `test(nls-v3): refreeze Step 5 optional selection boundary`
- compare:
  `ahead_by=1 / behind_by=0 / total_commits=1`

### 3.2 changed path exact2

| path | entry blob | result blob | entry SHA-256 | result SHA-256 |
|---|---|---|---|---|
| `ai/tests/test_emlis_nls_v3_s5_content_selection_stage_context.py` | `f2e702a75c2294d689e3f55a6b7b7b8da149fa2a` | `52e1b069f21861a89a1a22bc97de422cd2ac314d` | `cb55178ca5df4746074b7d1c242d46463c5335d7d0a7962900933e5c11cf62f9` | `ea18716e54a1e85c84b78d85fe8a8ff269d14c911deef08b89013277293fa475` |
| `ai/tests/test_emlis_nls_v3_recovery_epoch001_current_closure_completion_red.py` | `51454fe9d1f0f6267d04e5f9872689be0072bed7` | `7f7f82a048562034189a2514c281c7853c754024` | `0ddbe5c7e1aef2f56276775694e0b016c5902e367fa1de98e7848cc6ab6e3cb1` | `3893ac2333b5ae0fe970cef705c331ffb92d6e3913eb785218afa92f7604859d` |

Diff aggregate:

- additions: 410
- deletions: 1
- changed path count: 2
- source changed path count: 0

## 4. corrected S5 contract

### 4.1 independent body-free oracle

test ownerはproductionの
`_cross_role_unmatched_obligation_ids(...)`
をoracleとして使用しない。

次の順で独立に導く。

1. refined snapshotのoriginal / supplemental別全typed component IDsを得る。
2. witness bindingのrole-local IDsを差し引き、unmatched source IDsを得る。
3. obligation ledgerのsource refsから、unmatched sourceを参照する
   obligation IDsを得る。
4. required obligation IDsを得る。
5. required `bound_emlis_reception` rowsのtarget obligation IDsを得る。
6. §1の式によりindependently selected unmatched IDsを得る。
7. その他のoptional unmatched IDsが
   `deferred_by_budget / OPTIONAL_DEFERRED_BY_BUDGET /
   integrated_into_obligation_id=None`
   を保つことを確認する。

### 4.2 non-vacuous boundary

original / supplementalのいずれかでunmatched sourceまたはunmatched obligation
が空の場合、またはoptional unmatched setが空の場合は、同じstable causal
codeでfailする。これにより、empty setでcontractが見かけ上通ることを防ぐ。

### 4.3 preserved assertions

- witness-bound graph closure
- unmatched source reference coverage
- role-local source separation
- unmatched obligation ledger/decision presence
- required selection
- required coverage 100%
- original reception/control owner
- depth `layered` / normal-refined floor
- semantic inventory validation
- Content Selection policy validation
- determinism / body-free / lineage

## 5. recovery lineage correction

recovery ownerへappend-onlyで次を追加した。

- current unmatched-optional reconciliation authority / RED authority
- Cocolon entry heads
- mashos-api entry head
- current authority / plan / result / receipt / handoff blobs
- current source exact3 entry blobs / SHA-256
- changed test exact2 entry blobs / SHA-256
- next RED changed test surface exact2
- future implementation source candidate exact1
- protected semantic / inventory source exact2
- authoritative exact7 expectation:
  `5 pass / 2 causal fail`
- stable causal code binding
- content recovery nodeから同じtest-owned oracleへの接続

historical `1 lineage pass / 6 causal fail` RED expectationと、
attempted implementation `7/7 machine GREEN` expectationは書き換えていない。

## 6. authoritative execution

### 6.1 node order

1. recovery authority / surface
2. semantic direct
3. semantic recovery
4. inventory direct
5. inventory recovery
6. content direct
7. content recovery

### 6.2 result

- collected: 7
- passed: 5
- causal failed: 2
- errors: 0
- unexpected: 0
- warnings: 0
- duration: 11.03 seconds

Causal failed exact2:

1. `test_s5_cross_role_depth_noninflation_floor_and_effect_scope_red`
2. `test_recovery_epoch001_s5_cross_role_content_consumer_is_resolved_or_red`

両方のfailure body:

```text
RECOVERY_EPOCH001_S5_CROSS_ROLE_UNMATCHED_OPTIONAL_SELECTION_POLICY_NOT_PROVED
```

semantic direct/recovery、inventory direct/recovery、authority/surfaceの5 nodeは
passした。

### 6.3 diagnostic executions

authoritative run前に、必要最小限の局所確認を行った。

- S5 direct:
  `1 failed / stable causal code一致 / 5.64 seconds`
- authority/surface + recovery content:
  `1 passed / 1 failed / stable causal code一致 / 3.89 seconds`

これらをauthoritative resultへ合算していない。

## 7. protected surface verification

### 7.1 source exact3 unchanged

| path | Git blob | SHA-256 |
|---|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_semantic_restatement_v3.py` | `cd2caeac0dfa4b502c798e1e5f65653033c96e2c` | `348003adbe7991de1717a8a2a7ca9d26a04e7f42caccdef2e4a0f31634f171b6` |
| `ai/services/ai_inference/emlis_ai_semantic_obligation_inventory_v3.py` | `241d38331b00fd6c7bd17d4c8a30b6b52b0c3f69` | `ddc42e6f30c46876b4ccc6c7f936c6cc7dcc6f394cbc2d9825694c7617b465f9` |
| `ai/services/ai_inference/emlis_ai_content_selection_v3.py` | `6096dd41e46fe9d9abc7695b49b3125b2f87cea1` | `3c9c51a9e514169a1b17d408329b3d2d526bab08b8663e0fb2606ae358eec3bb` |

### 7.2 other protected owners unchanged

- semantic direct test blob:
  `49864c6ee6a944c603da21ebd18ba60633e56fb9`
- S4 inventory direct test blob:
  `3f0bd59facec541d8bad09d1af9410344c753e45`
- refined partition blob:
  `fb6f4c299f5e61c6527acc86323a610b416c8e1d`
- artifact contract blob:
  `953d062fa858870e65d96cf03694d68c99003594`

fixture/sample/manifest、API/DB/RN/runtime/public/shared route、historical
RC/receipt、Detailed Design、parent design、accepted authority historyは
変更していない。

## 8. causal disposition

### 8.1 current RED meaning

current sourceがunmatched optional IDsをwitness由来で`forced_active_ids`へ
追加し、optional decisionsをselectedへ変更するため、corrected oracleが
direct/recovery exact2で拒否している。

これは、unmatched meaningの存在・distinctness・depthを拒否するREDではない。
decision authorityの越境だけを拒否するREDである。

### 8.2 future implementation candidate — not authorized here

別承認後のfuture source surfaceはexact1に限定する。

```text
ai/services/ai_inference/emlis_ai_content_selection_v3.py
```

future correctionの意味は、witness-derived unmatched IDsを
`forced_active_ids`から外し、independent required / required reception target
policyを維持しながら、cross-role depth rowsとoriginal depth floorを保持する
ことである。

これは今回実装していない。

## 9. closure state

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

1. 両entry headとcurrent authority evidenceをGitHubから再取得した。
2. local test exact2 entry bytesはGitHub `b43f84a6...` と一致した。
3. patch後、GitHub compareはchanged path exact2だけだった。
4. authoritative exact7は5 pass / 2 causal fail / 0 errorだった。
5. stable causal codeはfailure exact2で一致した。
6. mashos-api result commitはatomicで、source exact3は不変だった。
7. GitHub上のresult test exact2本文は検証済みlocal bytesと一致した。

## 11. 未確認

- future source exact1の未作成bytes / Git blob / SHA-256
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

## 13. 推測禁止

- REDをimplementation completionへ昇格しない。
- expected future fixを実装済みと扱わない。
- targeted exact7をbroad regressionへ昇格しない。
- Step 5、source baseline、Cycle 001を完了・accept扱いしない。
- next implementation/GREENへ自動進行しない。

## 14. 華恋の意見

このREDは、unmatched meaningを捨てずに残すことと、optional contentを選ぶこと
を分離できている。人間の言葉を雑に削らないためには前者が必要であり、
親契約にない判断を勝手に増やさないためには後者の抑制が必要である。

次の修正をContent Selection source exact1へ限定できたことで、既に成立して
いるsemantic witnessとinventory lineageを再び壊す危険を避けられる。

## 15. STOP / exactly one next authority candidate

`NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP5_CROSS_ROLE_UNMATCHED_OPTIONAL_SELECTION_AND_CONTENT_DEPTH_ONLY_CONTRACT_RECONCILIATION_IMPLEMENTATION_AND_GREEN_ONLY`

この候補は未承認である。Automatic progression is false.
