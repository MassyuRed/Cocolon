# NLS v3 Step 11 rc0030 — E2 Owner-ready Deferral / Evidence Closure 設計20.3影響範囲補遺

作成日: 2026-07-20 JST  
対象: `Step 11 / Cycle 001 / rc0030 / E2`  
文書状態: `PRE_IMPLEMENTATION_STOP / SUCCESSOR_AUTHORITY_NOT_YET_GRANTED`

## 0. 結論

GitHub main commit `c5c02940a80a7f1238b8983b4657289af19e5790`を
E2 RED repair predecessorとしてexact照合し、clean checkoutで0063のREDを再現した。

前補遺で候補としたNatural Surface単独の共通修復ではE2をGREENにできない。
Independent MatcherがP2 same-group packingをbase-body witnessとsource authorityから
独立再計算し、Surfaceの修復結果を読む前提なしに0063をdensity invalidとして拒否するためである。

これは前補遺の再STOP条件「Natural Surface以外のexisting owner変更が必要」に該当する。
したがってproduction codeを変更せず、本補遺で最小successor authorityを定義する。

- P5: `GREEN / IMMUTABLE`
- E2 RED predecessor: `c5c02940a80a7f1238b8983b4657289af19e5790`
- E2: `RED / PRE-IMPLEMENTATION STOP`
- production owner change: `0`
- E2 successor manifest: `NOT CREATED`
- E3 / E4: `NOT STARTED`
- Cycle 001: `NOT ACCEPTED`
- secure material: `NOT REQUIRED`

本補遺は、次の二つを分離する。

1. 0063 densityを修復できる最小exact 3 path authority
2. density修復だけでは閉じない53 attack / support-positive evidence debt

## 1. 確認した事実

### 1.1 GitHub repair predecessor

1. GitHub mainのlatest commitは
   `c5c02940a80a7f1238b8983b4657289af19e5790`である。
2. parentはP5反映commit
   `924bd458255f226db54c17d84dd4aafc5db2b1e2`である。
3. parentとの差分は次のexact 1 pathの追加だけである。

   `ai/tests/test_emlis_nls_v3_s11_rc0030_e2_integration.py`

4. Git blob SHA-1は`3f76ed7bfe993670dab942ace6109b8a50a1954f`、
   file SHA-256は
   `4edc9845e231e3ba8737c2f8bdd6e2bbe05d504c0e47a8b2343cb7b717518ee9`
   であり、前回E2 RED成果物とbyte一致する。

### 1.2 RED再現

clean checkoutでdensity nodeを独立実行した結果は次である。

```text
1 failed in 58.15s
STEP11_RC0030_E2_FORWARD_DENSITY_NOT_SYNCHRONIZED
```

underlying codeは次である。

`STEP11_RC0030_SURFACE_PLAN_DENSITY_UNSATISFIABLE`

production source、manifest、fixtureは変更していない。

### 1.3 Surface-onlyでは修復不能

Natural Surfaceの現行ownerは次である。

`build_step11_rc0030_surface_realization_plan()`

現行Surfaceはsemantic atomをownerの最新導入groupへ割り当て、最大2 atomの
structure-only packを作る。base unit数とpack数の合計がgroup上限4を超える場合、
candidateをfail-closeする。

Independent Matcherの現行ownerは次である。

`_step11_rc0030_validate_semantic_placement()`

Matcherはforward plan、candidate AST、span mapを受け取らず、base-body witness、
verified base binding、source authorityだけから同じowner position、最大2 atom pack、
same-group placementを独立再構築する。

その再構築中にgroup上限を超えると、parsed bodyとの比較前に次を返す。

`STEP11_RC0030_SEMANTIC_PLACEMENT_DENSITY_INVALID`

よってSurfaceだけでplacementを変更しても、現Matcherは旧scheduleを再構築して拒否する。
index 10を緩和しても、この独立性違反は解消しない。

### 1.4 0063のbounded schedule

0063にはbase candidateが2件ある。

| candidate | group count | base unit / group | current pack / ready group | capacity |
|---|---:|---|---|---|
| 1 | 2 | 3 / 3 | 3 / 3 | 1 / 1 |
| 2 | 3 | 2 / 2 / 2 | 3 / 1 / 2 | 2 / 2 / 2 |

candidate 1は6 packに対して総capacity 2であり、resource内では引き続き
fail-closeしなければならない。

candidate 2は、G1でreadyになる3番目のpackだけをG2へ遅延配置すれば、
`2 / 2 / 2`へ分散できる。

最終peakは次の既存上限内に収まる。

| item | observed | frozen maximum |
|---|---:|---:|
| group units | 4 | 4 |
| visible clauses / grammatical chunk | 2 | 2 |
| grammatical complexity load | 4 | 4 |
| repeated joiner / group | 2 | 2 |
| semantic atoms / pack | 2 | 2 |

atom drop、resource拡張、3 atom opaque pack、case branchは不要である。

### 1.5 owner-connected invariantのsuccessor定義

P2 direct testは、当時のsame-group casesについて次を確認する。

`assigned_group in owner_sentence_group_ordinals`

このequalityはproduction validator、Gate、runtimeでは検査されていない。
0063のbounded deferralでは、ownerがG1で全て導入済みのpackをG2へ置くため、
successor invariantは次へ一般化する必要がある。

`assigned_group >= max(owner_introduction_groups)`

これは「全owner導入後だけ配置」「前方参照禁止」を意味する。
既存P2 direct 4件はsame-group内で成立しているため、現行placementを維持できる。
P2 historical receipt、fixture、testを上書きしない。

### 1.6 53 attack evidence

P1 fixtureはretained 33 IDとpending 20 IDを固定する。
現index 10のfirst nodeはIDと件数、unique 53を確認するが、53 attackを全件実行しない。

- retained 33:
  - rc0029 exact parameterized mutation suiteが存在する。
  - E2ではsuiteを再実行し、attack ID、test node、closed resultをledger化する必要がある。
- pending 20:
  - 既存P2 / P3 / P5 / E2で複数attackは実行される。
  - 少なくとも次の6件はexact executable evidenceが閉じていない。
    - `catalog-token-raw-quote-false-parse`
    - `catalog-token-other-section-false-parse`
    - `reception-support-omission`
    - `reception-target-collision`
    - `reception-scope-borrowing`
    - `sole-line-unmapped-reception-fallback`

bridge endpoint / directionとsymbol duplicate / shadowも、attack IDから実行node・結果への
hash-bound mappingを確定する必要がある。

### 1.7 support-positive full-chain blocker

`batch_001.jsonl`のactual grounded plan 100件をread-onlyで調べた結果、
`opportunity.support_nucleus_ids`が非空のcaseは0件である。
representative 8も全件`reception_supports = 0`である。

既存frozen cohortにはtrue support-positiveが5件ある。

- Known28: `D`, `I6-D02`, `RR8-U11`
- Development42: `NLS2-F05-D01`, `NLS2-F05-D03`

しかし現rc0030 full runtimeでは、5件ともforwardより前で停止する。

| case | current result |
|---|---|
| D | base 2/2 `STEP11_RC0030_BASE_BINDING_REVALIDATION_FAILED` |
| I6-D02 | base 4/4 `STEP11_RC0030_BASE_BINDING_REVALIDATION_FAILED` |
| RR8-U11 | `STEP11_REQUIRED_OWNER_INPUT_SPECIFICITY_UNRESOLVED` |
| NLS2-F05-D01 | `STEP11_INPUT_SPECIFIC_ANCHOR_UNRESOLVED` |
| NLS2-F05-D03 | base 3/3 `STEP11_RC0030_BASE_BINDING_REVALIDATION_FAILED` |

density schedulerはbase inverse後のownerであるため、この5件のpre-forward failureを
修復できない。

これらのsource pathは既存closureに含まれるが、Known28 / Development42を現在の
representative8 E2 denominatorへ取り込むこと、またはupstream/base ownerを変更することは、
今回のdensity repair authorityに含めない。

### 1.8 P5 / manifest lineage

P5 predecessorとE2 RED repair predecessorは別commitである。

- P5 completed phase: `924bd458255f226db54c17d84dd4aafc5db2b1e2`
- E2 RED repair predecessor: `c5c02940a80a7f1238b8983b4657289af19e5790`

E2 successor manifestを作る場合、両者を別fieldでbindしなければならない。
現P5 manifestは次を固定する。

| item | P5 value |
|---|---|
| active / hashed / reserved absent | 14 / 13 / 4 |
| source file count | 222 |
| source closure | `7c905f06c88ed4a19f8ece102cafbb1333dcce1b3e840081952682703ec038e5` |
| manifest file SHA-256 | `4ceb33aa6bb6f15d6ad9b7212bbdcee901edb352707f3f19a90e91ff6d91f62c` |
| artifact SHA-256 | `265418796ec720112ea046014b7dd3c612d392382647a64db5fe7396b4a976b7` |

E2全GREEN後の期待partitionは`15 / 14 / 3`、source count 223である。
実edge数とclosureは最終bytesから再計算し、hardcodeしない。

## 2. 推測

### 2.1 最小共通修復

次のgeneric owner-ready deterministic deferralなら、0063 candidate 2を
既存resource内で修復できると推測する。

1. 現行と同じstable order、最大2 atomでready-group別packを作る。
2. packをearliest-ready group順に処理する。
3. `ready_group .. last_group`を順に走査する。
4. 各destinationについてgroup unit、tail/new chunk、complexity、joinerを
   副作用なしで試算する。
5. 全上限を満たす最初のgroupへcommitする。
6. placementはownerの最新導入groupより前へ戻さない。
7. どのgroupにも置けなければ既存closed codeでfail-closeする。

Matcherはforward planを参照せず、base-body witnessとsource authorityから同じscheduleを
独立再導出する。

### 2.2 owner範囲

density修復だけなら、production変更はNatural SurfaceとIndependent Matcherの
rc0030 suffixで閉じる可能性が高い。Parser、catalog、Gate、runtimeの変更を示す証拠はない。

ただしsupport-positive full-chainをE2 acceptanceに必須とする場合、density exact 3だけでは
閉じない。upstream/base owner変更へ進む前に別authorityが必要である。

## 3. 華恋の意見

Natural Surfaceだけを変更してMatcherの拒否を後から緩める、0063だけを別groupへ送る、
index 10のREDを削除する、またはsupport-positiveを合成してGREENと主張すべきではない。

正確な次工程は、まずdensity repairをexact 3 pathのsuccessor experimentとして承認し、
SurfaceとMatcherが独立に同じowner-ready scheduleを導出できるかを検証することである。

その後、retained 33とpending 20をactual execution ledgerで閉じる。
support-positive full-chainは独立blockerとして扱い、既存authority内で構成不能なら、
E2 manifest前に再STOPするべきである。

Known28 / Development42の正式再実行は後続formal candidate phaseの責任であり、
現在のdensity修復へ無断で混ぜるべきではない。

## 4. 承認後に変更してよい範囲

### 4.1 production exact 2

1. `ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py`
   - `build_step11_rc0030_surface_realization_plan()`のrc0030 scheduling責任
   - 必要なら同fileのrc0030 suffix内だけのgeneric helper
2. `ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py`
   - `_step11_rc0030_validate_semantic_placement()`のrc0030 independent schedule責任
   - 必要なら同fileのrc0030 suffix内だけのgeneric helper

MatcherのParser entry、parse signature、body scan contract、forward-plan禁止parameterは不変とする。

### 4.2 test exact 1

`ai/tests/test_emlis_nls_v3_s11_rc0030_e2_integration.py`

許可:

- 0063 full-chain selected、S=10、reuse=0、R=1
- current ready packs `3/1/2`からassigned packs `2/2/2`
- `assigned_group >= max(owner_introduction_groups)`
- strict deferralが少なくとも1件あること
- candidate 1のbounded fail-closeとcandidate 2のselected
- pack<=2、group/chunk/load/joiner非拡張
- deferred placement / owner readiness / order mutationのMatcher fail-close
- retained33 / pending20 attack IDからactual node/resultへのproof mapping
- P5 commit / manifestとE2 RED commitの別binding

禁止:

- REDの削除、skip、xfail、正常扱い
- case ID、corpus ID、review verdict、failure familyによるproduction branch
- support-positive sourceの捏造

### 4.3 E2全GREEN後だけ更新してよいmanifest exact 4

1. `ai/services/ai_inference/emlis_ai_rc0030_surface_planning_experiment_dependency_manifest_v3.py`
2. `ai/tools/emlis_nls_v3_rc0030_surface_planning_dependency_manifest.py`
3. `ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_dependency_manifest_rc0030_surface_planning_experiment.json`
4. `ai/tests/test_emlis_nls_v3_s11_rc0030_dependency_closure.py`

E2がRED、53 attack ledger未完、またはsupport-positive acceptance未解決の間は更新しない。

### 4.4 new path

新しいrepository pathは許可しない。exact18 closed maximumを維持する。

## 5. 不変条件

- Step 9全20 owner、E1b successor、rc0027〜rc0029 behaviorを変更しない。
- P1〜P5 historical fixture / receipt / testを上書きしない。
- Grounded Lexicalization、Hard Gate、runtime、catalogを変更しない。
- shared runtime / public route / reply / DB / RN / Safetyへ接続しない。
- candidate `<=12`、replan `<=1`、owner `<=24`、body `<=1MB`を維持する。
- group `<=4`、chunk clause `<=2`、complexity `<=4`、joiner `<=2`、pack atom `<=2`。
- Body-only ParserとIndependent Matcherを維持する。
- Matcherはforward plan、candidate AST、span map、covered IDsを読まない。
- atom / owner / endpoint / direction / explicit unknown / Receptionをdropしない。
- semantic coverage self-claimを許可しない。
- experimental-only、runtime-disconnected、formal-ineligibleを維持する。

## 6. Density GREEN条件

1. 0063がcandidate 2でfull chain selectedになる。
2. candidate 1はresource不足でfail-closeを維持する。
3. 0063のS=10、reuse=0、R=1がforward / Parser / Matcher / Gateでexact一致する。
4. assigned pack分布が`2 / 2 / 2`である。
5. strict deferralが存在し、全bindingで
   `assigned_group >= max(owner_introduction_groups)`を満たす。
6. pack<=2、group/chunk/load/joiner上限を維持する。
7. SurfaceとMatcherのscheduleがbyte/plan共有なしに一致する。
8. deferred placement、backward placement、owner swap、order swapをfail-closeする。
9. control 7、P2 direct 4、P3/P4/P5、rc0029 retained33が非回帰である。
10. skip / xfail / mock-only GREENが0である。

Density GREENはE2全GREENと同義ではない。

## 7. E2全GREEN条件

Density GREENに加えて次を満たす。

1. representative 8が全件selected。
2. retained 33のactual executionとattack-ID ledgerが全GREEN。
3. pending 20のactual executionとattack-ID ledgerが全GREEN。
4. support-positive requirementのacceptance authorityが明示される。
5. full-chain support-positiveが必要なら、source-authorized denominatorが
   forward / Parser / Matcher / Gate / selectorを通過する。
6. P5 completed predecessorとE2 RED repair predecessorを別々にbindする。
7. resource、prefix、body-free、case-branch禁止を維持する。
8. E2 successor manifestのclosureが最終bytesと一致する。

## 8. 再STOP条件

次のいずれかが必要なら実装を停止する。

1. Natural Surface / Matcher / index 10以外のdensity repair path変更
2. Parser、catalog、Gate、runtimeの変更
3. resource上限拡張または3 atom以上のopaque pack
4. forward planをMatcherへ渡す変更
5. case / family / corpus branch
6. exact18外のnew path
7. Known28 / Development42を現在のE2 denominatorへ無承認で追加
8. upstream/base failureを無視してsupport-positiveを合成
9. E2全GREEN前のmanifest / E3 / E4開始

## 9. 明示承認の境界

次の指示は、本補遺の明示承認後だけ有効になる。

> rc0030 E2 pre-implementation STOPと設計20.3 owner-ready deferral / evidence closure影響範囲補遺を承認する。GitHub commit c5c02940a80a7f1238b8983b4657289af19e5790をrepair predecessorとして、Natural Surface rc0030 suffix、Independent Matcher rc0030 semantic-placement validator、index 10 E2 testのexact 3 pathだけで、max2 packを維持したearliest-ready deterministic deferralをRED先行実装する。assigned groupは全owner introduction group以上とし、SurfaceとMatcherはforward metadata共有なしに同じscheduleを独立導出する。resource、Parser、catalog、Gate、runtime、Step 9、E1b、rc0027〜rc0029、shared/public、exact18を不変にする。density GREEN後にretained 33とpending 20のactual execution ledgerを閉じ、support-positive full-chainが既存authorityから構成不能ならmanifest前に再STOPする。E2全GREEN後だけmanifest successorを作る。
