# NLS v3 Step 11 rc0030 — E2 Phase B exact 3 Handoff

作成日: 2026-07-20 JST  
対象: `Step 11 / Cycle 001 / rc0030 / E2 integrated synchronization`  
formal predecessor: `a18ceaf9f2d858c59244a12aaca3d798acc36cdd`  
状態: `PHASE_B_GREEN / STOP_BEFORE_E2_PHASE_MANIFEST_SUCCESSOR`

## 0. 結論

承認済み設計20.3 Base-predecessor Gate補遺§8のexact 3内でPhase B repairを完了した。

- E2 integration: `13 / 13 PASS`
- support-positive `D` / `I6-D02`: 両方`selected`
- control / disconnected runtime: `16 / 16 PASS`
- retained rc0029 mandatory attack: `33 / 33 PASS`
- production modified: `2`
- test modified: `1`
- new repository path: `0`
- manifest successor: `NOT STARTED`
- E3 / E4: `NOT STARTED`
- Cycle 001: `NOT ACCEPTED`
- secure material: `NOT REQUIRED`

したがって、Phase Bの機能acceptanceはGREENである。ただし、現manifestはP5 phaseを固定した
historical predecessorであり、今回のexact 3 current hashとE2 path activationをまだ閉じていない。
補遺の境界どおりmanifestを上書きせず、E2 phase-manifest successor前で停止した。

## 1. 確認した事実

### 1.1 predecessorと変更範囲

- repository: `MassyuRed/mashos-api`
- commit: `a18ceaf9f2d858c59244a12aaca3d798acc36cdd`
- parent: `2c789d3fa9f5a7a910c9a9392f2ebfd1bc009ea7`
- commit date: `2026-07-20T12:26:29+09:00`

変更は次のexact 3だけである。

1. `ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py`
2. `ai/services/ai_inference/emlis_ai_step11_hard_gate_v3.py`
3. `ai/tests/test_emlis_nls_v3_s11_rc0030_e2_integration.py`

shared Matcher、shared Step 9全20 owner、Natural Surface、Parser、catalog、Grounded
Lexicalization、runtime、selector、manifest、fixture、resource、exact18、rc0027〜rc0029、E1b、
shared/public routeは変更していない。

### 1.2 Matcher rc0030 suffix

根拠は、support-positive base bindingがglobal `verified=False`でも、witness / ledger / content /
discourse commitment、grounded phrase、source authorityの局所projectionは独立再検証できるという
Phase A/B診断である。

必要性は、global coverageを昇格させず、final bodyへ再利用してよいexact subsetだけを認定する
ためである。実装は次を満たす。

1. shared bindingの`verified`と`issue_codes`を変更しない。
2. witness / ledger / content / discourse hash、required row order、binding shapeを再検証する。
3. parsed phrase keyとbinding keyを全体bijectionで照合し、exact-one ownerだけを認定する。
4. source ID、family、endpoint、direction、dimensionまで一致するbase reuseだけを認定する。
5. unverified base Receptionをforward metadataから読まず、source contractとparsed act / scope /
   statusから一意再構成する。
6. unresolved、surplus、ambiguous、duplicate creditをclosed codeで拒否する。
7. P2 prefix SHA-256
   `9bdae4b5c3d99e99dd01b622b9b191afbfa0e601789fba082a03c069b70028b5`
   を維持する。

### 1.3 rc0030 Hard Gate suffix

根拠は、shared base Gateがbase bodyの旧candidate判定を担当し、rc0030 Gateが再実現後final bodyの
origin-bound full joinを担当するというowner差である。

必要性は、shared Gateの診断を失わず、final candidateの意味充足をbase全体の旧hard-passで代用
しないためである。実装は次を満たす。

1. shared base Gateを必ず実行し、exact failureを`base_gate_failure_codes`へ保持する。
2. defaultではbase failureをfinal failureへmergeし、fail-closeを維持する。
3. base candidate schema / AST / canonical render / input / identityを独立validatorで再検証する。
4. origin-bound context、source commitments、forward validator、canonical rerender、Body-only
   Parser、Independent Matcher、forward/inverse exact join、resource、Gate bindingが全てPASSした
   場合だけ、base-body診断をfinal rejectionへ直結させない。
5. 一つでも欠ければ`STEP11_RC0030_BASE_GATE_REJECTED`で閉じる。

### 1.4 E2 test contract

E2 testは次のdenominatorをsource authorityから独立計算して固定した。

| case | semantic | Reception total | support-bearing Reception |
|---|---:|---:|---:|
| D | 2 | 2 | 1 |
| I6-D02 | 2 | 3 | 1 |
| no-support control 0002 | 0 | 1 | 0 |

source / forward / parsed / verified / Gate joinの全段でexact cardinalityを照合する。さらに、support
omission、forged base schema、forward Reception metadata forge、stale base context、ambiguous phrase
projection、duplicate reuseをfail-closeするnegativeを追加した。

### 1.5 検証結果

```text
E2 integration                    13 passed in 443.58s
control non-regression             3 passed in 42.57s
runtime disconnect                13 passed in 204.64s
retained rc0029 mandatory attack  33 passed, 12 deselected in 364.19s
Phase B support-positive focus     1 passed in 134.94s
python compile                     PASS (exact 3)
git diff --check                   PASS
```

### 1.6 formal evidence境界の診断

logic regressionとphase/historical evidence driftを分離してread-only診断した。

```text
rc0028 forward/inverse                         5 PASS / 0 FAIL
predecessor + rc0029 behavior                 12 PASS / 1 historical FAIL
broader rc0030/rc0029 forward/inverse        108 PASS / 2 historical FAIL
rc0028/rc0030 dependency closure              10 PASS / 7 manifest/hash FAIL
exact 3 execution logic regression             0
```

FAILは次の3分類だけである。

1. exact 3で許可されたMatcher / Hard Gate current hashをP5以前のmanifestが検出する。
2. formal predecessor `a18ceaf9...`ですでに変更済みのNatural SurfaceをP2 / P5 historical
   full-file lockが検出する。Natural Surfaceの今回diffは0である。
3. rc0029 historical scannerがprivate downstream rc0030 manifest ownerからimmutable rc0029 parent
   manifestへのversioned参照をreverse importとして検出する。shared/public runtime接続ではなく、
   今回diffは0である。

したがって、exact 3実行ロジックの回帰は0である一方、formal evidence全体はまだGREENではない。
P3 / rc0029 historical証拠をcurrent bytesで上書きせず、E2 manifest successorと、E4後の別authority
でphase-qualified evidence finalizationを行う。

### 1.7 current file SHA-256

| path | SHA-256 |
|---|---|
| Matcher | `648a3a6690f8df860053c811a5416fcfc9983524e5ff880a0e6921a122a52e30` |
| Hard Gate | `88514bb2a179e8d726f36e1666d2618330d95979107403ededc93aa35655943b` |
| E2 test | `789008643a4d7ba388a26f35fbf2276eea5f1c3702f94ea6089377ce372d5eaa` |

## 2. 推測

P5 phase manifestがcurrent exact 3 hashとE2 activationを拒否するのは、Phase Bの意味修復が誤って
いるからではなく、承認済みphase順序に従いE2 successorをまだ作っていないためと考える。

P3 full-file hashのhistorical stage-lockも、P5以後の許可済みsuffix変更をP3 bytesへ逆適用しない
ための証拠である可能性が高い。P3 historical commitmentを上書きせず、E2 current closureで
predecessorとsuccessorを分離し、広域historical scannerの最終更新はE4後のformal evidence
authorityへ残す必要がある。

## 3. 華恋の意見

今回のexact 3は保持すべきである。`verified=False`の無条件昇格やshared Gate bypassではなく、
より強いorigin-bound final joinを追加し、攻撃negativeも同時に固定できた。

次はE3、E4、Cycle 002ではない。Mashがexact 3をGitHubへ反映したcommitをformal predecessorに
固定し、同梱したE2 phase-manifest影響範囲補遺を承認した後、exact18内のphase successorだけを
実装するのが正確である。

## 4. Mash側に必要な作業

1. ZIPの`mashos-api/`以下exact 3をrepositoryの同じ相対pathへ反映する。
2. commit・pushする。
3. commit SHAを華恋へ伝える。
4. 同梱したE2 phase-manifest補遺を、そのSHAをpredecessorとして明示承認する。

その後、E2 manifest全GREENを確認してからだけE3へ進む。
