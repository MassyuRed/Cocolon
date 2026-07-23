---
doc_id: cocolon_emlis_nls_v3_step11_cycle001_recovery_epoch001_step0_10_prerequisite_nonconformance_remediation_design_read_only_addendum
revision_date: "2026-07-23"
status: "REMEDIATION_DESIGN_FROZEN_P1_RETRY_NOT_AUTHORIZED_AUTHORITY_STOP"
authority: "NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP0_10_PREREQUISITE_NONCONFORMANCE_REMEDIATION_DESIGN_READ_ONLY"
body_free: true
automatic_progression: false
cycle001_status: "NOT_ACCEPTED"
---

# NLS v3 Step 11 Cycle 001 Recovery Epoch 001 Step 0–10 prerequisite nonconformance remediation design

## 0. この文書の決定

本書は、Recovery Epoch 001 P1で確定したStep 0–10 prerequisite nonconformanceを、Detailed Design §22.1と各StepのSTOP条件へ適合させるためのread-only回復設計である。

本書はsource / test / fixture / sample / manifestを変更せず、testを実行せず、completion receiptを成功生成せず、source baselineをlockしない。fresh batch、exact100、Product Read、correction、B6、formal closure、Cycle acceptanceへ自動進行しない。

決定:

```text
HISTORICAL_RECEIPTS_IMMUTABLE
RECOVERY_EPOCH_CURRENT_CHAIN_REQUIRED
STEP4_REFINED_SOURCE_PARTITION_OWNER_REQUIRED
STEP5_DEPENDENCY_GUARD_REDESIGN_REQUIRED
STEP10_VERSIONED_SUCCESSOR_CLOSURE_REQUIRED
P1_RETRY_NOT_AUTHORIZED
CYCLE001_NOT_ACCEPTED
AUTHORITY_STOP
```

## 1. identity / evidence baseline

| item | fixed identity |
|---|---|
| Cocolon entry | `44e249e3d71366fa57db2ed828f159754662bdaa` |
| mashos-api source candidate | `c9739a0e2de5632d08607636656ada2f712c62b9` |
| Detailed Design SHA-256 | `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc` |
| parent-design receipt blob | `bdfbd559535db06ae4af35fe1bb58716d6566126` |
| P1 failure receipt blob | `965f6b9a9467769e24508340c1c59aafa4f40797` |
| P1 state | `P1_FAILED_STOP / SOURCE_BASELINE_UNLOCKED / STEP0_10_NOT_PROVED` |
| fresh batch | `RESERVED_NOT_CREATED` |
| Cycle 001 | `NOT_ACCEPTED` |

Historical result、receipt、RC、manifest、run evidenceは当時の履歴として保持する。current bytesへ合わないhistorical hashを上書きし、当時から成立していたように見せることを禁止する。

## 2. 確認済み事実

1. Detailed Design §22.1は各Stepについて、実owner、strict contract、positive test、independent negative test、case別またはartifact別receipt、parent / source hash、completion condition、next-step authorityを要求する。各Step固有STOP条件もfalseでなければならない。
2. Step 0–3はhistorical completion evidence candidateを持つが、current parent/source hashへ連結したstandalone receipt chainがない。
3. Step 4はcurrent sourceで`REFINED_SOURCE_PARTITION_OWNER_UNAVAILABLE`をfail-closeし、refined observationのoriginal / supplemental source responsibilityを完成できない。Step 4 STOPはtrueである。
4. Step 5 named suiteは11 / 12で、後続のbody-free / runtime-disconnected successor importと、Step 5時点の静的filename allowlistが衝突する。
5. Step 6–9 named testsはGREENだが、Recovery Epoch current parent/source hashへ結ぶstandalone completion receiptがない。
6. Step 10は3 PASS / 12 FAIL / 1 collection errorである。historical frozen closure `2b4cd6cb5ea0f0d69ae7de31930dd6833ba21fce8eb7262f579cad514f14a8e9`とcurrent recomputed closure `d7958aa26a10d598f57f7544b51133edc0ea05c2f45e6767b9c9bdb4fda1d1cd`が一致しない。
7. Step 10 testはimportした`tester_allowlist_policy_sha256`をpytestがtest callableとして収集するため、required argumentをfixture名として解決しようとしてcollection errorになる。
8. source baseline event 1とStep 0–10 proved event 2は作成されていない。P2以降は未承認である。

## 3. 推測と未確定事項

- Step 5 failureの主因は、後続successor追加後もearly-Stepの静的filename allowlistがcurrent closed dependency graphへ更新されなかったことと整合する。ただし、future REDで意図した違反を因果的に再現するまでは確定原因としない。
- Step 10 closure driftは、historical `nls_v3_rc_0010` manifestをcurrent manifestとして使い続けたことと整合する。ただし、新しいcandidate identityとexact closureは別authorityのRED freezeで固定する。
- Step 4の新ownerはquestion systemの実装を必要とせず、disconnectedなbody-free partition contractとして実装できる見込みである。public runtime変更が必要と判明した場合は設計逸脱としてSTOPする。

## 4. 華恋の意見

P1失敗を「テストの期待値更新」だけで消すのは不適切である。Step 4では意味責任を持つownerが必要で、Step 5では禁止対象を弱めずにcurrent dependency closureを表現し直し、Step 10ではhistorical rc0010を改変せずsuccessor closureを作る必要がある。履歴保存とcurrent証明を分離することが、Cocolonの説明責任とDetailed Designの両方に合う。

## 5. Step別 remediation contract

| Step | current verdict | required remediation | future completion proof |
|---:|---|---|---|
| 0 | `NOT_PROVED` | historical resultを変更せず、current helper / test bytesとDetailed Design parentをRecovery Epoch receiptへ再bindingする | current positive / negative result、source hash、parent receipt hash |
| 1 | `NOT_PROVED` | Step 0 receiptをparentとしてcurrent Step 1 contractを再bindingする | strict contract、current test hashes、Step 0 parent receipt hash |
| 2 | `NOT_PROVED` | current owner / testsをStep 1 receiptへappend-onlyで連結する | current artifact receipt、parent / source hashes、STOP false |
| 3 | `NOT_PROVED` | current owner / testsをStep 2 receiptへappend-onlyで連結する | current artifact receipt、parent / source hashes、STOP false |
| 4 | `FAILED` | independent refined-source partition ownerを追加し、original / supplementalを別authorityとしてbindする | positive role partition、independent negative suite、Step 4 STOP false |
| 5 | `FAILED` | stale filename allowlistを、hash-boundなoffline / dormant closed dependency boundaryへ置換する | permitted closure positive、unlisted/public/cue ingress negative、STOP false |
| 6 | `NOT_PROVED` | current GREENをStep 5 completion receiptとcurrent source hashesへ連結する | standalone current receipt |
| 7 | `NOT_PROVED` | current GREENをStep 6 completion receiptとcurrent source hashesへ連結する | standalone current receipt |
| 8 | `NOT_PROVED` | current GREENをStep 7 completion receiptとcurrent source hashesへ連結する | standalone current receipt |
| 9 | `NOT_PROVED` | current GREENをStep 8 completion receiptとcurrent source hashesへ連結する | standalone current receipt |
| 10 | `FAILED` | historical rc0010 manifestを保持し、新candidate identityのversioned successor closureを作る。collection collisionもmechanicalに解消する | exact current closure、default-route diff0、independent negative、standalone receipt |

## 6. Step 4 refined-source partition design

### 6.1 owner boundary

future implementationは、`ai/services/ai_inference/emlis_ai_refined_source_partition_v3.py`をcandidate ownerとする。実装authorityでdependency scanにより同名衝突または既存ownerが確認された場合は、重複ownerを作らずSTOPして再設計する。

ownerは次を満たす。

- original plan / resolver / evidenceとsupplemental plan / resolver / evidenceを別入力として受け取る。
- `TrustedFutureStageAuthority`のquestion-decision commitment、permitted stage、original commitment、supplemental commitmentを照合する。
- question decision自体をsemantic sourceとして扱わない。
- original rowを欠落、上書き、supplementalへ再labelしない。
- supplemental rowをoriginalへ再labelしない。
- ID / alias / evidence bindingをsource roleでnamespaceし、collisionをfail-closeする。
- cross-source relationは明示authorityがない限りfail-closeする。
- outputはbody-free commitment、role、artifact hash、closed reason codeだけを公開境界へ渡す。
- normal observation / pre-question observationの現行contractとdefault public routingを変更しない。

`emlis_ai_semantic_obligation_inventory_v3.py`は、refined stageでこのvalidated partitionだけをconsumeする。owner不在時の現行fail-closeを、unvalidated fallbackへ置換してはならない。

### 6.2 causal RED requirements

positive:

- original / supplementalがdistinct roleとして保持され、original不変、supplemental限定の深化が成立する。
- normal / pre-question regressionがbyte / contract同値である。

independent negative:

- partition owner missing
- role swap
- supplemental-as-original relabel
- original drop / overwrite
- bundle commitment mismatch
- ID / alias collision
- unauthorized cross-source binding
- raw body / private note leakage

negativeはproduction helperと同じvalidatorを呼ぶだけの自己検証にせず、独立fixture / mutationで原因を作る。

## 7. Step 5 dependency guard design

既存successor sourceのimportを一件ずつ削る、または一件ずつfilename allowlistへ足す方法は禁止する。guardの目的は、approved NLS v3 offline / dormant closure以外からの侵入とfixture cue依存を止めることであり、後続の正当なsuccessorをearly-Step時点の固定一覧で拒否することではない。

future guardは次を同時に証明する。

1. declared closureの各path / source hash / roleがversioned manifestに存在する。
2. closure内import edgeはowner contractに一致する。
3. unrelated module、public / shared route、runtime ownerからStep 4 / 5 helperへの直接edgeがない。
4. default public routeはv1 ownerのままで、NLS v3はdisabled / dormantである。
5. fixture、case ID、review label、expected-answer cue、raw bodyをsourceが読まない。
6. unlisted path、hash drift、role mismatch、forbidden edgeはfail-closeする。

`emlis_ai_grounded_relation_construction_authority_successor_v3.py`のbody-free / experimental-only / runtime-disconnected contractは保持候補とする。future REDがこの前提を否定した場合は、source削除へ自動転換せずSTOPする。

## 8. Step 10 successor closure design

historical `emlis_ai_step10_dependency_manifest_v3.py`と`nls_v3_rc_0010` frozen closureをcurrent bytesへ書き換えない。Recovery Epoch implementationでは、次を持つversioned successor closureを新しいcandidate identityで作る。

- current Step 0–10 source / test / tool pathsとexact hashes
- owner role、runtime-connected flag、body-free flag
- parent recovery design receipt / RED receipt / implementation receipt hash
- default routing disabled、v1 owner preservedのcontract
- closure hash再計算とfresh validation
- stale / missing / extra / role-mismatched pathのindependent negative

candidate identityはrc0010を再利用しない。exact identifierは次のRED freeze authorityで予約し、existing identifierとの衝突がないことを確認する。

Step 10 test collection errorは、import名をpytest collection対象外のaliasへ変更するmechanical correctionで解消する。assertion、allowlist、expected closureを同時に緩和してはならない。

dormant adapterまたはprivate bridgeがsuccessor closureを参照する必要がある場合、変更はoffline / dormant boundary内に限定する。API、DB、RN、public / shared route、production enableが必要ならSTOPする。

## 9. Recovery Epoch completion receipt chain

successful P1 retry時だけ、Step 0からStep 10までappend-onlyのcurrent receipt chainを生成する。各rowは次の9 fieldを必須とする。

| field | requirement |
|---|---|
| actual owner | exact path / symbol / role |
| strict contract | versioned contract IDとclosed invariants |
| positive test | test ID、result、test source hash |
| independent negative test | independent mutation / fixture ID、result、hash |
| artifact receipt | body-free artifact ID / hash |
| parent / source hash | prior Step receipt hashとcurrent source closure hash |
| completion condition | Detailed Design §22.1とStep固有条件の判定 |
| next-step authority | next Stepだけを許すexact authority |
| STOP false | Step固有STOP conditionを全列挙しfalseを証明 |

receipt indexは11 rowを順序固定し、各row hashからroot hashを再計算可能にする。Step 0のparentはDetailed Design identityとRecovery Epoch parent-design receipt、Step nのparentはStep n-1 current receiptである。

historical receiptを編集しない。current test GREENだけでreceiptを成功にしない。途中StepがFAILED / NOT_PROVEDなら、そのStep以降のsuccess receiptを発行せず、source baselineをlockしない。

## 10. separated authority sequence

| phase | authority class | permitted result |
|---|---|---|
| R0 | current read-only design | design / receipt / handoff only |
| R1 | RED freeze | causal RED、test collectionのmechanical repair、candidate identity reservation |
| R2 | implementation / GREEN | approved exact source / test / manifest changes、targeted + prerequisite GREEN |
| R3 | P1 retry | no-drift source baseline lockとStep 0–10 current receipt generation / verification |

R0からR1へ自動進行しない。R1、R2、R3はそれぞれ別の明示承認を必要とする。P2はR3成功後も別承認である。

## 11. STOP conditions

次の一つでも成立した場合、scopeを広げずbody-freeでSTOPする。

- Step 4 partition ownerがquestion system runtime、API、DB、RN、public / shared route変更を必要とする。
- original / supplementalのrole separationをbody-free commitmentだけで検証できない。
- Step 5を閉じる方法が、禁止edgeまたはfixture cue検査の削除・弱化しかない。
- historical rc0010 manifest / receiptの改変が必要になる。
- successor closureをcurrent hashesへ一意に固定できない。
- Step 6–9 current regressionがsource remediation後に失敗する。
- raw input / output、private note、individual mapping、body digest、keyをGitHubへ出さなければ判定できない。
- accepted authority外のsource / product behavior変更が必要になる。
- HEAD / path / blob / hashにdriftまたは相互競合がある。

## 12. current authority result / next authority

```text
REMEDIATION_DESIGN_FROZEN
SOURCE_TEST_FIXTURE_SAMPLE_MANIFEST_CHANGE_COUNT_0
TEST_EXECUTION_COUNT_0
P1_RETRY_NOT_AUTHORIZED
SOURCE_BASELINE_UNLOCKED
FRESH_BATCH_RESERVED_NOT_CREATED
B6_REMEDIATION_NOT_STARTED
CYCLE001_NOT_ACCEPTED
AUTHORITY_STOP
```

次の別承認候補は一つだけである。

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_STEP0_10_PREREQUISITE_NONCONFORMANCE_REMEDIATION_RED_FREEZE_ONLY
```

この候補はcausal RED、test collection collisionのassertion-neutralなmechanical repair、new candidate identity予約、exact future implementation surfaceのfreezeだけを扱う。production source implementation、GREEN化、successful completion receipt、baseline lock、P2以降へ自動進行しない。

