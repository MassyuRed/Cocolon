# NLS v3 Step 11 rc0030 — E2 Density Synchronization 設計20.3影響範囲補遺

作成日: 2026-07-20 JST  
対象: `Step 11 / Cycle 001 / rc0030 / E2`  
文書状態: `E2_RED_CONFIRMED / REPAIR_AUTHORITY_NOT_YET_GRANTED`

## 0. 結論

P5成果物を反映したGitHub main commit
`924bd458255f226db54c17d84dd4aafc5db2b1e2`をE2 predecessorとして、
exact18 index 10の統合試験を開始した。

E2はGREENではない。凍結代表`nls3s_b001_0063`が、base inverse後、
Natural Surfaceのrc0030 realization-plan packingで2候補とも拒否される。
Parser、Independent Matcher、Hard Gate、selectorへ到達できないため、
E2の統合同期条件を満たさない。

修復候補ownerは既存exact4内のNatural Surfaceであるが、今回承認された
E2境界はindex 10 activationだけであり、Natural Surface変更はauthority外である。
したがって実装を停止し、本補遺で最小影響範囲を定義する。

- P5: `GREEN / FROZEN AS GITHUB PREDECESSOR`
- E2: `RED / STOP BEFORE NATURAL SURFACE REPAIR`
- E2 phase successor manifest: `NOT CREATED`
- E3 / E4: `NOT STARTED`
- Cycle 001: `NOT ACCEPTED`
- secure material: `NOT REQUIRED`

本補遺は影響範囲を定義する文書であり、単独では修復実装を許可しない。

## 1. 確認した事実

### 1.1 GitHub predecessor

1. GitHub mainのE2 predecessorは
   `924bd458255f226db54c17d84dd4aafc5db2b1e2`である。
2. 同commitはP5 predecessor `3897331a5f605762e09f9953e47801d45d3c5da2`
   に対してahead 1である。
3. 差分はP5で承認されたexact 9 repository pathだけである。
4. GitHub上の9 blobはP5 deliverableとbyte一致する。
5. P5 manifestは次を固定する。

| item | value |
|---|---:|
| phase | `P5_CARDINALITY_REGRESSION` |
| active / hashed / reserved absent | 14 / 13 / 4 |
| source file count | 222 |
| source closure | `7c905f06c88ed4a19f8ece102cafbb1333dcce1b3e840081952682703ec038e5` |
| manifest file SHA-256 | `4ceb33aa6bb6f15d6ad9b7212bbdcee901edb352707f3f19a90e91ff6d91f62c` |
| manifest artifact SHA-256 | `265418796ec720112ea046014b7dd3c612d392382647a64db5fe7396b4a976b7` |

### 1.2 E2 representative execution

rc0030 private runtimeでrepresentative 8をread-only実行した結果は、
`7 selected / 1 no_valid_candidate`である。

唯一の非selectedは`nls3s_b001_0063`である。

| accounting | value |
|---|---:|
| base candidate | 2 |
| base inverse prepass | 2 |
| base inverse reject | 0 |
| forward reject | 2 |
| experiment candidate | 0 |
| final Body-only Parser invocation | 0 |
| final Independent Matcher invocation | 0 |
| Hard Gate evaluation | 0 |
| selected | 0 |

closed failureは次の1 codeだけである。

`STEP11_RC0030_SURFACE_PLAN_DENSITY_UNSATISFIABLE`

index 10は、この状態を正常扱いせず、次のE2専用REDとして固定する。

`STEP11_RC0030_E2_FORWARD_DENSITY_NOT_SYNCHRONIZED`

### 1.3 0063 source denominator

0063のsource-exact denominatorは次である。

| denominator | count |
|---|---:|
| construction instance | 6 |
| relation | 4 |
| semantic link | 0 |
| explicit unknown | 0 |
| semantic set S | 10 |
| required grounded Reception set R | 1 |
| base exact reuse | 0 |

Sはslot数やrelation endpoint数ではなく、
`construction_instances + relations + semantic_links + explicit_unknowns`
で数える。

### 1.4 density不可能性

現在のrc0030 packerは次の契約で動作する。

1. semantic atomを最大2件ずつstructure-only unitへpackする。
2. structure-only unitをexisting base unitへ融合せず、group clauseへ加算する。
3. `maximum_observation_clauses_per_sentence=4`を維持する。

0063の二つのbase候補では次になる。

| base candidate | base unit / group | rc0030 pack / group | resulting pressure |
|---|---|---|---|
| 1 | 3 / 3 | 3 / 3 | 6 / 6 > 4 |
| 2 | 2 / 2 / 2 | 3 / 1 / 2 | first group 5 > 4 |

候補2のfirst groupはsource atom 5件を持つため、最大2 atom / packでは
最低3 packが必要である。一方、base unit 2件に対する残capacityは2である。
atomを落とすかresource上限を広げない限り、現在のstructure-only加算モデルでは
数学的に収まらない。

### 1.5 predecessor責任との関係

rc0029 E2は同じ0063について、複数recordを共有clauseへcoalesceし、
`fused_structure_item_count < record_count`かつ既存content budget内で
GREENにしている。

したがって今回のREDは「0063がもともと表現不能」という事実ではない。
rc0030のsemantic chunk distributionが、rc0029で通過済みのdepth-compaction責任を
E2統合時に保持できていない回帰である。

### 1.6 retained attack evidence

P1 fixtureはretained 33件とrc0030 pending 20件、合計53 attack IDを固定する。
ただし件数とIDの一致は、53件をE2で実行した証拠の代わりにならない。

既存P2 / P3 / P5 testと今回のindex 10で、reuse、chunk、relation、unknown、
Reception、coverage、resource等の多くは実行済みである。一方、E2 acceptance前に
少なくとも次のevidence gapを閉じる必要がある。

- catalog raw-quote false parse
- other-section false parse
- Reception support omission
- target collision
- scope borrowing
- sole-line unmapped fallback
- 既存phase testで実行するpending attackとindex 10のproof mapping / hash binding

### 1.7 support-positive denominator

representative 8のReception support-positive countは0である。
既存frozen authorityのD / I6-D02はsupport-positiveだが、現rc0027 baseでは
`v3_no_valid_candidate`であり、rc0030 full integrated chainへ到達しない。

現authority内ではdirect forward + Body-only Parserによるsupport保持までは確認できる。
Matcher、Gate、selectorを含むpositive full-chainを要求する場合、
base-GREENのsupport-positive denominator authorityが別途必要になる。

case branch、dummy support、D / I6-D02のbase failure無視で代替してはならない。

## 2. 推測

### 2.1 共通原因

現在の計画器は、semantic atomをowner-connected groupへ正しく割り当てた後、
その意味をbase clauseとは別のstructure-only clauseとして数える。
低〜中密度caseでは成立するが、0063ではgroupの既存base clause capacityを使い切る。

原因はcase IDやrelation familyではなく、
`existing base clause + separately counted structure pack`という共通分布モデルにあると
推測する。

### 2.2 最小修復候補

既存base grammatical chunkへ、source-authorized semantic predicationを
body-only recoverableな形で融合できれば、atom dropもresource拡張もせずに
clause capacityへ収められる可能性がある。

これは実装前の仮説である。融合後にParserが一意に分解できない、Matcherが
source setをexact復元できない、complexity / joiner上限を超える場合は、
仮説を棄却して再びSTOPする。

### 2.3 owner境界

現時点の証拠では、修復候補ownerは既存exact4内のNatural Surfaceだけである。
Parser、Matcher、Gate、runtime、catalog、Step 9、E1b、Content Selection、
Discourse Plannerを変更する必要を示す証拠はまだない。

## 3. 華恋の意見

0063だけpack上限を増やす、atomを落とす、case/family branchを作る、
またはdensity failureをcandidate-local成功として扱うべきではない。

それらはsource denominator exactness、resource bound、共通Surface、
retained depth-compaction責任のいずれかを壊す。

最小で妥当な次工程は、Natural Surfaceのrc0030 suffix内だけで、
owner-connected semantic predicationをexisting grammatical chunkへ融合する共通規則の
可否をRED先行で判定することである。

support-positive denominator不足はdensity修復と混ぜて黙認しない。
densityがGREENになった後もfull-chain evidenceが閉じなければ、
support-positive authorityについて別STOPを行うべきである。

## 4. 承認後に変更してよい範囲

### 4.1 existing owner — exact 1

`ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py`

許可候補:

- `build_step11_rc0030_surface_realization_plan()`のrc0030 packing責任
- 必要な場合、同fileのrc0030 suffix内だけに追加する共通helper

禁止:

- rc0027 / rc0028 / rc0029-prefixed symbolの変更
- frozen predecessor prefixの変更
- case ID、corpus ID、failure family、review verdictによるbranch
- atom / owner / relation endpoint / direction / Receptionのdrop
- forward metadataをParser / Matcherへ渡すこと

### 4.2 E2 test — exact 1

`ai/tests/test_emlis_nls_v3_s11_rc0030_e2_integration.py`

許可候補:

- 本RED nodeを不変のacceptance targetとして維持する
- 53 attackのactual execution / proof mappingを閉じる追加assertion
- support-positive evidenceの不足をfail-closeで可視化するassertion

RED codeを削除、緩和、skip、xfailしてGREENにしてはならない。

### 4.3 E2 GREEN後だけ更新してよいmanifest path — exact 4

1. `ai/services/ai_inference/emlis_ai_rc0030_surface_planning_experiment_dependency_manifest_v3.py`
2. `ai/tools/emlis_nls_v3_rc0030_surface_planning_dependency_manifest.py`
3. `ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_dependency_manifest_rc0030_surface_planning_experiment.json`
4. `ai/tests/test_emlis_nls_v3_s11_rc0030_dependency_closure.py`

E2 phase successorはP5 historical manifestを上書きせず、GitHub predecessor、
file SHA-256、artifact SHA-256、source closureを別fieldで保持する。

期待partitionは次である。

| item | E2 expected |
|---|---:|
| exact18 maximum | 18 |
| active | 15 |
| newly active | 1 — index 10 only |
| hashed | 14 |
| reserved absent | 3 — index 5, 16, 17 |
| source file count | 223 |

### 4.4 new path

新しいrepository pathは許可しない。exact18 maximumを維持する。

## 5. 不変条件

- P5 exact two-predicate cardinality repairを変更しない。
- grounded lexicalization、Matcher、Hard Gate、runtime、catalogを変更しない。
- Step 9全20 owner、E1b successor、rc0027〜rc0029 behaviorを変更しない。
- shared runtime / public route / reply / DB / RN / Safety / question ownerへ接続しない。
- candidate `<=12`、replan `<=1`、owner `<=24`、body `<=1MB`を維持する。
- Parser / Matcher invocation、body byte inspectionの既存上限を維持する。
- maximum observation clause、visible clause、complexity、joiner上限を広げない。
- Body-only ParserとIndependent Matcherを維持する。
- semantic coverage self-claimを許可しない。
- experimental-only、runtime-disconnected、formal-ineligibleを維持する。

## 6. 修復後のE2 GREEN条件

1. index 10が全PASSする。
2. 0063が少なくとも1 candidateでfull chain selectedになる。
3. 0063のS=10、R=1、exact reuse=0がforward、Parser、Matcher、Gateでexact一致する。
4. atom drop / duplicate / double credit / cross-owner placementが0である。
5. 0001はS=1 / reuse=1 / R=1、0002はS=0 / reuse=0 / R=1、
   0019はS=3 / reuse=0 / R=1を維持する。
6. representative 8の新規`no_valid_candidate`が0である。
7. retained 33とpending 20についてactual executable evidenceとhash-bound proof mappingが閉じる。
8. support-positive full-chainを必要条件とする場合、そのdenominator authorityが閉じる。
9. P1〜P5、E1b、E0b、rc0027〜rc0029 behavior、controlが非回帰である。
10. E2 successor manifestが期待partitionとbyte-exact closureを満たす。
11. skip / xfail / mock-only GREENが0である。

E2 GREEN後だけE3へ進む。E3、E4、formal candidate、Cycle 001 acceptanceを
本補遺で開始しない。

## 7. 再STOP条件

次のいずれかが必要なら実装を停止する。

1. Natural Surface以外のexisting owner変更
2. exact18外のnew path
3. resource上限拡張
4. atomを3件以上のopaque packへ押し込むだけの修復
5. case / corpus / failure-family / control branch
6. Parserがforward plan、AST、span map、coverage metadataを読む変更
7. Matcher / Gateのexact source-set検査を弱める変更
8. support-positive fixtureを根拠なく追加・改変する変更
9. shared runtime / public route接続
10. E2未GREENでmanifest、E3、E4を先行すること

## 8. 明示承認の境界

次の実装指示は、本補遺の明示承認と、index 10 RED成果物を反映した
GitHub commit SHAの確認後にだけ有効になる。

> rc0030 E2 RED / STOPと設計20.3 density synchronization影響範囲補遺を承認する。index 10 REDを反映したGitHub commit `<E2_RED_COMMIT_SHA>`をrepair predecessorとして、Natural Surfaceのrc0030 suffixとindex 10だけで、existing grammatical chunkへのowner-connected semantic predication fusionをRED先行で検証する。resource、Parser、Matcher、Gate、runtime、catalog、Step 9、E1b、rc0027〜rc0029、shared/publicを不変にする。E2全GREEN後だけmanifest successorを作り、既存authority外が必要なら再停止する。

