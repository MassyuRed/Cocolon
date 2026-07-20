# NLS v3 Step 11 rc0030 — Surface Planning 設計20.3 影響範囲補遺

作成日: 2026-07-19 JST  
作成者: 華恋  
対象工程: `Step 11 / Cycle 001`  
文書種別: `post-rc0029 E3 STOP / pre-implementation impact scope addendum`

## 0. 結論 / 文書状態

- GitHub branch: `MassyuRed/mashos-api:main`
- immutable GitHub predecessor: `e1e2ec5c17fa165f9972373304899802832ecd5b`
- rc0029: `FROZEN_AS_E3_PRODUCT_READ_STOP_EVIDENCE`
- E4: `NOT_STARTED`
- Cycle 001: `NOT_ACCEPTED`
- candidate RC: `rc0030`
- impact scope: `DEFINED`
- implementation: `NOT_STARTED`
- implementation authority: `NOT_GRANTED_BY_THIS DOCUMENT`
- feasibility: `CONDITIONALLY_FEASIBLE_WITHIN_EXISTING_EXACT4_RESPONSIBILITY_SET`
- new upstream / shared / public owner: `NOT_REQUIRED_ON_CURRENT EVIDENCE`
- new rc0030 literal authority: `REQUIRED`
- secure material: `NOT_REQUIRED_AT_THIS CHECKPOINT`

rc0029は、machine contractではE3代表8件を`8 / 8 selected`にしたが、Product Readでは`PASS 1 / MINOR 1 / MAJOR 6 / BLOCKER 0`となった。machine GREENとProduct Read STOPの両方を比較可能な証拠として残すため、rc0029-prefixed prefix bytes / symbols / behaviorとrc0029 commit・manifest・receiptをこれ以上上書きしない。exact 4 full fileは後続rc0030 appendにより変わり得るため、full-file byte不変を意味しない。

次の対象は、局所語句ではなく次の5つの共通Surface責任である。

1. `main meaning dominance`
2. `schema-free realization`
3. `semantic chunk distribution`
4. `grounded reception naturalization`
5. `control non-regression`

現行treeでは、`emlis_ai_step11_natural_surface_v3.py`が既に`Step11SurfaceRealizationPlan`、sentence-group配分、grammatical chunk balancingを所有する。したがって、別のupstream planner sourceや新しい意味authorityは追加しない。rc0030のversioned realization planを既存Natural Surface owner内のexperiment-only責任として追加するのが最小である。

ただし、旧補遺はrc0029-prefixed APIとrc0029 literal pathだけを許可しており、rc0030を自動では許可しない。本補遺で影響範囲を定義するが、§13の明示指示をMashが承認するまで`STOP_BEFORE_IMPLEMENTATION`とする。

---

## 1. 確認した事実

### 1.1 GitHub / predecessor

1. 2026-07-19 JSTにGitHub連携で確認した`MassyuRed/mashos-api:main`の最新commitは`e1e2ec5c17fa165f9972373304899802832ecd5b`である。
2. 直前の`e069ffd782e4d2b960b2c1e770d9018ab78a8b1d`からの変更はexactly 22 pathである。
3. 22 pathの内訳は、既存4 pathのadditions-only変更と、新規18 pathである。削除pathは0である。
4. このpath集合は、華恋が渡したrc0029 packageのrepository deltaと一致する。
5. rc0029 generated manifestは次を記録する。

| item | commitment |
|---|---|
| manifest file SHA-256 | `9b232da64222f83c33aaf77af2662097cb417ab177f4a1fb374e69a92cae0ad7` |
| manifest artifact SHA-256 | `05365d90ffec011868a6c7b9926505ca71fc675b9285ee6b8c3f4d15f714af8b` |
| source dependency closure SHA-256 | `cd46925c6db478ac07e501acb64c45cae3a122ab0c1d834d06a83f1190cfb082` |
| source file count | `209` |
| unexpected path | `0` |
| unbound project import | `0` |
| forbidden reverse import | `0` |
| experiment-only / runtime-connected | `true / false` |
| public owner unchanged | `true` |
| eligible for formal / production | `false / false` |

### 1.2 rc0029 E3 evidence

1. E3 machineは代表8件を`8 / 8 selected`、fail-close 0としている。
2. E3 Product Readは次の結果である。

| severity | count |
|---|---:|
| PASS | 1 |
| MINOR | 1 |
| MAJOR | 6 |
| BLOCKER | 0 |

3. former MAJOR 5件のPASS/MINOR化は`0 / 5`である。
4. control非悪化は`1 / 3`である。
5. new MAJORは1件、new BLOCKERは0件である。
6. control baselineとrc0029結果は次のとおりである。

| case | rc0027 baseline | rc0029 Product Read | non-regression |
|---|---|---|---|
| `nls3s_b001_0001` | PASS | MINOR | FAIL |
| `nls3s_b001_0002` | PASS | PASS | PASS |
| `nls3s_b001_0009` | MINOR | MAJOR | FAIL |

7. Product Read reason codeには、`MAIN_MEANING_OBSCURED`、`IMMEDIATE_OBSERVATION_NOT_READ`、`SCHEMA_EXPOSITION`、`OPAQUE_ORDINAL_REFERENTS`、`SURFACE_DISTRIBUTION_OVERCONCENTRATED`、`DEPTH_OVERSHOOT`、`EMLIS_RECEPTION_UNBOUND`、`GENERIC_RECEPTION`、relation / unknownの誤読・欠落等が含まれる。
8. E4は開始していない。Cycle 001は`NOT_ACCEPTED`である。

### 1.3 実装責任

1. rc0029 runtimeは、rc0027 base candidateとE1b successor / rc0028 typed lexical atomsからrc0029 candidateを作る。
2. rc0029 rendererは、construction / relation / link / unknownのfamily clauseを作り、base observationの末尾へまとめて付加する。
3. rc0029 Receptionはtarget / support handleを既存Receptionへ結び付けるが、Product Readでは4件に`EMLIS_RECEPTION_UNBOUND`が残った。
4. `emlis_ai_step11_natural_surface_v3.py`には既に次が存在する。

   - `Step11SurfaceRealizationUnit`
   - `Step11SurfaceRealizationPlan`
   - sentence groupへのbounded assignment
   - grammatical chunk assignment
   - maximum clause / complexity / repeated joiner accounting

5. 設計6の正規pipelineは、Content Selection、Discourse Graph / Sentence Partition、Typed Surface AST、Renderer、Body-only Parser、Independent Matcher、Hard Gateの責任を分ける。
6. 設計18.4は、自然さ、読まれた形、主意味、Emlis reception、distribution、depthをProduct QAで読むことを要求し、machine verificationで代替しない。
7. 設計18.6はcase / family / expected-answer cueによる個別分岐を禁止する。
8. 設計18.2はtext-affecting source change後にnew RC IDを発行することを要求する。

---

## 2. 推測

### 2.1 共通原因

E1bで追加されたtyped structureは、rc0029のParser / Independent Matcher / Hard Gateまでmachine上はlosslessに到達している。残る主問題は意味authorityの欠落より、既に選択された意味と構造を本文へどう配分するかというSurface realization方式にあると推測する。

rc0029はbase observationを維持したまま、構造情報を末尾の大きな付加節へ集中させる。この方式ではatom数が増えるほど、元の観測より内部構造の説明が前景化し、主旨埋没、schema exposition、relation誤読、depth overshoot、Reception非結合が同時に現れやすい。

### 2.2 owner境界

新しいContent SelectionまたはDiscourse意味authorityを作らなくても、既存base AST / realization plan / discourse sentence groupを不変入力として、E1b atomをowner-connected chunkへ割り当て直すことは可能と推測する。

一方、`main meaning`を新しいformal priority fieldとしてdownstreamが発明する根拠はない。machine contractで扱えるのは、rc0027 base-leading observationの前面性を維持し、構造専用節がそれを押し退けないことまでである。本当に主意味が前面に読めるかはE3 Product Readで判定する必要がある。

### 2.3 Reception

required reception opportunityのtarget / support / act authority自体は既に存在する。rc0029の問題は、そのbindingをhandle列挙として本文へ足す方式にある可能性が高い。target / support / actを一つのReception predication内部へ統合し、final bytesから独立復元できれば、upstream Reception ownerを変えずに改善できる見込みがある。

---

## 3. 華恋の意見

rc0029を凍結し、E4へ進まない判断は正しい。`8 / 8 selected`でも`MAJOR 6`だった事実は、machine情報閉包とProduct Read品質が別gateであることをはっきり示している。

次の修復を語彙差し替えや付加節の短縮だけに縮めるべきではない。rc0030では、rc0029 final bytesへさらに追記せず、immutableなrc0027 base AST / realization planとE1b typed authorityから、別versionのSurface realization planとfinal bytesを作るべきである。

現時点ではexisting exact 4 responsibility setで条件付き実現可能であり、別のsurface planner sourceを追加する必要はない。新fileを増やして同じplanning責任を二重化すると、Natural Surface ownerとの境界が曖昧になり、forward / inverseの監査面だけが広がる。

ただし、REDでbase orderingからprominence proxyを一意に導出できない、または既存depth内でrequired meaningを保持できないと判明した場合、downstreamで優先順位や省略を捏造してはいけない。その時点でSTOPし、Content Selection / Discourse Planner等の追加影響範囲をMashへ提示する。

---

## 4. predecessor freeze / authority継承

### 4.1 authority順位

1. `Cocolon_EmlisAI_ModelFreeNaturalLanguageSurfaceV3_DetailedDesign_ImplementationOrder_20260714_Revised_Cycle.md`
2. E1b successor authority addendum / final receipt
3. rc0028 downstream authority addendum / E3 STOP evidence
4. rc0029 common Surface repair addendum / machine GREEN / Product Read STOP evidence
5. 本補遺

本補遺は先行authorityの意味範囲を拡張しない。競合時は、versioned predecessor prefix / symbol / behavior不変、body-only recoverability、Independent Matcher、resource bound、case cue禁止、runtime非接続、狭い後発scopeを優先する。

### 4.2 immutable commitments

| artifact | SHA-256 / identity |
|---|---|
| GitHub predecessor | `e1e2ec5c17fa165f9972373304899802832ecd5b` |
| rc0029 source closure | `cd46925c6db478ac07e501acb64c45cae3a122ab0c1d834d06a83f1190cfb082` |
| rc0029 E3 machine receipt file | `38178b8050a545362a712b616a4a25a55b6c7c6d9435899e09a7852050e57659` |
| rc0029 E3 Product Read STOP receipt file | `64f0da11c3983d70a28676749115f712af4c1c49a396d07d9513773ab63c9794` |
| rc0029 R2-R5 final receipt file | `d4f64e7132551d258c1a45ff85ed31281133c7553fb84887d15795ae9ef3de1d` |
| rc0029 E3 STOP package | `c3050923d8f5f1f965fed4ea8a8a308ee7914dc08e2a4538d396be283bc9f769` |
| supplied detailed design copy | `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc` |

### 4.3 exact 4 current prefix commitments

rc0030実装が別途承認された場合も、次のcurrent file全bytesをpredecessor prefixとしてexact保持し、その末尾へrc0030-prefixed APIだけを追加する。既存行の編集、挿入、削除、renameをしない。

| path | frozen prefix bytes | frozen prefix SHA-256 |
|---|---:|---|
| `ai/services/ai_inference/emlis_ai_step11_grounded_lexicalization_v3.py` | 103805 | `43e99c6077e93db61908e11672d08122cb5928fe63fe64ae0ca565659b43bff4` |
| `ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py` | 290131 | `2f797d7aad7f16b234b8a8dad57204b5788e4ae23e43306ac8ca5da790eba7a2` |
| `ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py` | 589793 | `9bdae4b5c3d99e99dd01b622b9b191afbfa0e601789fba082a03c069b70028b5` |
| `ai/services/ai_inference/emlis_ai_step11_hard_gate_v3.py` | 129756 | `6911291682508bcd6df66d39acb7a6b29b1cfc411434d1ff13160125c9af6c9a` |

manifestは各current fileの先頭`frozen prefix bytes`が上表SHA-256と一致することを検査する。full-file hashが変わっても、prefix mismatchは即時STOPとする。

---

## 5. rc0030 common Surface契約

### 5.1 pipeline境界

```text
immutable Content Plan / Discourse Plan / rc0027 base AST
  + immutable E1b successor / rc0028 typed atoms
        |
        v
rc0030 experiment-only Surface Realization Plan
  - base-leading prominence witness
  - owner-connected chunk allocation
  - schema-free clause roles
  - grounded reception predication
        |
        v
rc0030 Typed AST / Canonical Renderer
        |
        v
final bytes only -> rc0030 Body-only Parser
        |
        v
Parsed Witness + immutable source -> Independent Matcher
        |
        v
additive rc0030 Hard Gate / selector
```

rc0030はrc0029 final bytesを修復入力として追記加工しない。rc0029はhistorical evidenceとbehavior-regression targetであり、rc0030の意味authorityではない。

### 5.2 main meaning dominance

1. 新しい`main meaning` semantic flagを発明しない。
2. machine proxyは、validated rc0027 base candidateのleading observation unit / sentence groupが、rc0030でも最初のObservation grammatical chunkに残ることとする。
3. construction / relation / unknownだけを持つ追加unitが、全base observation unitより前へ出ることを禁止する。
4. base-leading meaningを追加構造の言い換えで置換しない。同じmeaningの重複でprominenceを偽装しない。
5. proxyはProduct Read verdictを置き換えない。E3で入力と本文を読み、主要意味が残り、Cocolonの入力直後観測として前面に読めることを判定する。
6. baseからleading observationを一意に導出できない場合、任意score、source順以外の隠れたcue、case IDで決めずfail-closeする。

### 5.3 schema-free realization

1. construction / relation / link / unknownを内部record、owner、slot、ordinal、schemaの説明として本文へ出さない。
2. source-authorized referentとclosed grammatical predicate / modifier / connectiveへ統合する。
3. catalogは形態素、節fragment、closed act / relation morphologyだけを持つ。完成文、case / family / topic cue、reason code、expected outputを持たない。
4. `構造を見ると`、`Nつ目`、`owner`、`relation record`等のmachine taxonomy / schema expositionを許可しない。
5. Parserが復元しやすいことを理由に、不自然なdelimiter、hidden marker、zero-width code、番号表を本文へ出さない。

### 5.4 semantic chunk distribution

1. E1b typed atomを、そのowner nucleusが参加する既存Observation sentence groupへ割り当てる。
2. cross-owner / cross-group relationは、endpointとdirectionを保持したdeterministic bridge clauseへ割り当てる。
3. atomをfamily別の一つの末尾付加節へ集中させない。
4. existing `Step11SurfaceRealizationPlan`のgroup数、depth、maximum clause、complexity、repeated joiner budgetを拡張しない。
5. required atomを省略、generic化、covered扱いすることでbudgetへ収めない。収まらないcandidateはfail-closeする。
6. planはbody-free ownership / dependency / chunk metadataだけを持つ。case body、期待文、Product Read verdictを入力にしない。

### 5.5 grounded reception naturalization

1. required reception opportunityごとのtarget owner、support owner、act、scopeをexact保持する。
2. target / support handleの一覧を既存Receptionの前にprefixする方式を使わない。
3. target / support / actを一つの自然なReception predication内部へ統合する。
4. Parserはfinal bytesだけからactと可視antecedentを復元する。
5. Matcherはcandidate AST、forward plan、span map、candidate-declared owner IDを読まず、Parsed Witnessとvalidated source authorityからtarget / support / actを独立照合する。
6. genericな`受け止めたい`だけではbound receptionとして通さない。
7. reception自然化のために原因、診断、人格、助言、問い、新事実を追加しない。

### 5.6 control non-regression

1. E3 Product Read acceptanceは次を要求する。

   - `nls3s_b001_0001 = PASS`
   - `nls3s_b001_0002 = PASS`
   - `nls3s_b001_0009 = PASS or MINOR`

2. control ID / role / baseline severityを扱えるのはbody-free fixture、test、bounded tool、Product Read receiptだけである。
3. service source、catalog、runtime generation path、selectorがcontrol case ID、input cue、family labelを参照することを禁止する。
4. controlを守るために改善対象を検出して旧Surfaceへfallbackするbranchを作らない。同じcommon contractで全caseを扱う。
5. 禁止する`family branch`はreview / corpus / failure familyによる分岐である。source-authorizedなconstruction / relation / semantic link / unknown / reception等のtyped semantic atomは、case cueを持たないdeclarative catalog経由で共通処理してよい。

### 5.7 existing-body exact reuse / anti-duplication

1. base本文ですでに自然に表現されているsource atomを、machine証明用の別説明として重複追加しない。
2. base本文の既存表現をexact reuseできるのは、Body-only Parserがbase final bytesからatomを復元し、Independent Matcherがsource authorityへ一意bindingできた場合だけである。
3. 単なる語彙一致、部分一致、raw quote、candidate AST、forward `covered`、owner ID、span map、逆方向relationをreuse creditにしない。
4. runtime adapterがbase-body verified witnessをorchestrateしてよいが、forwardへ渡せるのはbody-freeなexact-match commitmentだけである。forward Natural Surface ownerからinverse moduleをimportせず、candidate-declared reuse flag単独ではcreditしない。
5. exact reuseされたatomもfinal rc0030 witnessではexactly onceでなければならない。dropとduplicateを同時に拒否する。
6. canonical rerenderとHard Gateはmutable reuse witnessの自己申告へ依存しない。final rc0030 bytesを別parse / matchで再検証する。
7. base-body reuseを安全にorchestrateできず循環importまたはforward / inverse自己認証が必要になる場合、実装を停止してowner分離案を提示する。

### 5.8 retained semantic contract

5課題修復後も次を維持する。

- cross-span owner / overlapの区別
- relation endpoint / direction / effective type
- semantic linkとconstruction internal linkの分離
- explicit unknown dimension / affected owner / cardinality
- self-denial separation
- `covered != semantic coverage`
- canonical rerender一致
- one visible source anchor以下
- exact duplicate 0
- deterministic selection
- body-only recoverability / Independent Matcher

---

## 6. exact owner / path scope

### 6.1 条件付きMODIFYを許可する既存owner — exact 4

既存current bytesの末尾へ、rc0030-prefixed APIだけをappendする。既存rc0027 / rc0028 / rc0029 constant、schema、class、function、`__all__`の既存部分、default behaviorを変更しない。rc0030 project importはrc0030-prefixed function内部のlocal importに限定し、shared/default importからrc0030 moduleをtransitive loadしない。

| path | rc0030責任 | 根拠 / 必要性 | 不変条件 |
|---|---|---|---|
| `ai/services/ai_inference/emlis_ai_step11_grounded_lexicalization_v3.py` | rc0030 catalogへbindしたclause-ready grounded lexeme / referent projection | schema-free clauseをraw input / case cueから捏造しないため | rc0027 / rc0028 / rc0029 specとsemantic coverage否定authorityを不変にする |
| `ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py` | rc0030 realization plan、prominence witness、owner-connected chunk、schema-free AST / render、grounded Reception | 同fileが既にSurface plan / AST / renderer / chunk balancingを所有し、別planner fileは責任重複になるため | immutable Content / Discourse / base ASTの意味を変更せず、rc0029 final bytesへ追記しない |
| `ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py` | rc0030 Body-only ParserとIndependent Matcher | final bytesから意味保持を独立証明するため | forward module / plan / AST helper / span map / candidate metadataを読まない |
| `ai/services/ai_inference/emlis_ai_step11_hard_gate_v3.py` | prominence proxy、schema-free grammar、chunk distribution、Reception exact bindingのadditive failureとselector | 5課題のmachine proxyとsemantic非回帰をfail-closeするため | 既存Gate / selector / recoveryを弱めず、control IDをgeneration branchにしない |

rc0030-prefixed class / function / constantは各symbol exactly one definitionとする。既存rc0029 shadow definitionを修正または削除してはならないが、rc0030で同じshadow構造を増やさない。static definition auditで安全にappendできない場合はSTOPし、versioned separate ownerへの影響範囲改訂を提示する。

### 6.2 NEW rc0030 exact 18 path

#### services

1. `ai/services/ai_inference/emlis_ai_rc0030_surface_planning_experiment_dependency_manifest_v3.py`
2. `ai/services/ai_inference/emlis_ai_step11_rc0030_experiment_runtime_adapter_v3.py`
3. `ai/services/ai_inference/emlis_ai_step11_rc0030_experiment_surface_catalog_v3.py`

別の`surface_planner` source fileは追加しない。versioned realization planの実装責任は§6.1のNatural Surface ownerに置く。

#### tools

4. `ai/tools/emlis_nls_v3_rc0030_surface_planning_dependency_manifest.py`
5. `ai/tools/emlis_nls_v3_rc0030_surface_planning_bounded_experiment.py`

#### fixtures

6. `ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_dependency_manifest_rc0030_surface_planning_experiment.json`
7. `ai/tests/fixtures/emlis_nls_v3/cycle_001/rc0030_representative8_body_free.json`

#### tests

8. `ai/tests/test_emlis_nls_v3_s11_rc0030_surface_planning_red.py`
9. `ai/tests/test_emlis_nls_v3_s11_rc0030_surface_planning_mutation.py`
10. `ai/tests/test_emlis_nls_v3_s11_rc0030_e2_integration.py`
11. `ai/tests/test_emlis_nls_v3_s11_rc0030_forward_inverse_independence.py`
12. `ai/tests/test_emlis_nls_v3_s11_rc0030_runtime_disconnect.py`
13. `ai/tests/test_emlis_nls_v3_s11_rc0030_predecessor_immutability.py`
14. `ai/tests/test_emlis_nls_v3_s11_rc0030_predecessor_behavior_regression.py`
15. `ai/tests/test_emlis_nls_v3_s11_rc0030_control_non_regression.py`
16. `ai/tests/test_emlis_nls_v3_s11_rc0030_e3_representative8.py`
17. `ai/tests/test_emlis_nls_v3_s11_rc0030_e4_frozen100_read_only.py`
18. `ai/tests/test_emlis_nls_v3_s11_rc0030_dependency_closure.py`

filesystem discoveryでpathを追加しない。必要pathがこのallowlistになければ、実装前に停止して補遺を改訂する。

### 6.3 read-only / immutable

次を変更しない。

- Step 9全20 owner / manifest
- E1b predecessor / successor owner、manifest、receipt
- Content Selection / Discourse Graph Planner / Planning Frontierの既存bytes
- `emlis_ai_grounded_human_reception.py`
- `emlis_ai_step11_runtime_adapter_v3.py`
- rc0027 catalog / default runtime / public-adjacent behavior
- rc0028 existing experiment behavior / evidence
- rc0029 existing API、catalog、runtime、manifest、tool、fixture、test、evidence
- shared runtime / public route / reply / DB / RN / Safety / question owner
- batch 001、Known28、Development42、invalid16、historical Product Read

exact 4 full-file hashはappendにより変わり得るが、§4.3 frozen prefixとrc0027 / rc0028 / rc0029 behaviorを不変にする。

### 6.4 new dependency manifest contract

rc0030 manifestはrc0029 generated manifestをimmutable parentとして、次を固定する。

1. GitHub predecessor `e1e2ec5c17fa165f9972373304899802832ecd5b`
2. parent manifest file / artifact / closure / source count
3. exact 4 frozen prefix byte length / SHA-256とcurrent full-file SHA-256
4. §6.2 new exact 18 path / file hash
5. static / dynamic project import edge
6. unexpected path / unbound import / forbidden reverse import `0`
7. `experimental_only=true`
8. `runtime_connected=false`
9. `public_owner_unchanged=true`
10. `rc0027_default_behavior_equivalent=true`
11. `rc0028_experiment_behavior_equivalent=true`
12. `rc0029_experiment_behavior_equivalent=true`
13. `eligible_for_formal=false`
14. `eligible_for_production=false`
15. filesystem discovery admission `false`
16. canonical path-ascending deterministic rebuild

generated manifest自身は自身のfile-hash集合へ含めず、外側body-free receiptがmanifest file / artifact hashをbindする。

rc0029 historical closureとrc0030 current closureを混同しない。

1. rc0029 manifest closureはcommit `e1e2ec5c17fa165f9972373304899802832ecd5b`のclean checkoutで検証する。
2. rc0030 worktreeではrc0030 manifest closureを検証する。
3. rc0030 worktreeではrc0029 behavior regressionを行うが、rc0029 manifestのcurrent-tree rebuild一致を要求しない。
4. rc0029 parent manifestはhistorical artifactのschema / file hash / artifact hash / closureとして検証し、rc0030 current filesystemへ再適用しない。

---

## 7. RED / mutation contract

production source editより先に、現行rc0029 behaviorが次を満たさないことをsemantic REDとして固定する。collection error、常時fail mock、`skip`、`xfail`、fixture severity改変をREDとしない。

### 7.1 five-concern RED

| concern | REDで固定するfailure | GREENで禁止する近道 |
|---|---|---|
| main meaning dominance | structural-only prefix、base-leading observation displacement / drop / duplicate | 新priorityの捏造、case別先頭文、machine scoreだけでProduct PASS主張 |
| schema-free realization | visible schema marker、family record列挙、opaque ordinal、machine taxonomy | 抽象名詞の言い換え、hidden delimiter、完成文bank |
| semantic chunk distribution | added atomの一節集中、owner group誤配分、depth / load超過 | required atom drop、generic coverage、budget拡張 |
| grounded reception naturalization | generic Reception、target / support / act drop / swap / prefix list | forward metadata自己認証、固定共感文、Reception owner改変 |
| control non-regression | baseline PASS/MINORより悪化したrc0029 receipt | service内control ID branch、旧Surfaceへのcase fallback |

review / corpus / failure familyによるbranchを禁止する。source-authorized typed semantic atomをdeclarative catalogで処理する分岐は、case / expected-answer cueを持たず全入力へ同じcontractで適用される限り許可する。

### 7.2 retained adversarial attacks

- cross-span / overlap flatten
- relation endpoint swap / direction reverse / type mutation
- semantic link / construction internal link混同
- explicit unknown drop / duplicate / dimension / owner swap
- required meaning drop / generic-only coverage
- self-denial separation drop
- `covered != semantic coverage`自己認証
- forward plan / AST / span map / candidate owner injection
- base-body atomへの語彙一致 / partial match / forged covered credit
- base-body exact atomのduplicate re-exposition
- stale source / catalog / plan / parser / binding hash
- chunk reorder / bridge endpoint swap / chunk duplicate
- catalog tokenがraw quoteや別sectionに自然出現した場合のfalse parse
- Reception target collision / support omission / act swap / scope borrowing
- unmapped reception opportunityのsole-line cardinality fallback
- control fixture / baseline severity改変
- rc0027 / rc0028 / rc0029 predecessor behavior drift
- rc0030 symbol duplicate / shadow definition

### 7.3 RED freeze receipt

RED実行後、Git baseline、test hash、attack count、closed failure code、resource denominator、exact path allowlistをbody-free receiptへ固定する。GREENのためにRED意味、分母、fixture、baseline severityを変更しない。

---

## 8. resource / independence / privacy

### 8.1 resource / determinism

- candidate総数 `<= 12`
- replan `<= 1`
- owner数 `<= 24`
- parser body bytes `<= 1,000,000`を維持する。ただし、この大きな安全上限をProduct Read上のdensity proofに使わない
- P1 RED receiptでhandle / construction / relation / link / unknown / clause / reception cardinalityのclosed maximumをsource denominatorから数値固定し、GREEN時に拡張しない
- parse decomposition候補数、parse iteration数、catalog alternative展開数を有限の数値上限としてP1で固定する。上限を提示できないalgorithmは実装しない
- candidate variant生成の全経路を合算しても総数`<= 12`とし、variant間の直積増加を禁止する
- existing Step 11 latency budgetとworst-case parser計測を維持する。時間だけを正しさのauthorityにせず、iteration / decomposition countでもbounded性を証明する
- visible source anchor `<= 1`
- existing depth / sentence group / clause / complexity / recovery budgetを維持
- bounded deterministic algorithmだけを使う
- model、embedding、network、runtime learning、unbounded searchを追加しない
- bound超過時はtruncateせずcandidate fail-close
- input / source / catalog / plan commitmentが同じならAST、bytes、Parsed Witness、Binding、Gate、selectionが同一

### 8.2 forward / inverse独立性

ForwardとParserは同じversioned declarative catalogのimmutable valueを読んでよい。ただしParser / Matcherは、forward module、realization plan、candidate AST、phrase selector、span map、candidate-declared owner / coverageをimportまたは入力にしない。

MatcherはParsed Witnessとvalidated source authorityから期待bindingを独立再計算する。candidate metadataやmachine selectedをsemantic coverageとして信用しない。

### 8.3 privacy / evidence

- repo / shareable ZIP: source、test、tool、body-free fixture、hash、count、closed reason code
- local private: input / output本文、parsed range、binding detail、Product Read note
- body-fullをstdout、traceback、manifest、shareable receiptへ出さない
- Supabase real-user raw、個人情報、unsalted body digest、secure keyを含めない

RED〜E4にsecure materialは不要である。formal candidate化後のbody commitment、HMAC、encrypted packet等が必要になる境界でSTOPし、Mashへ具体的作業を依頼する。

---

## 9. 実装が別途承認された場合の順序

```text
P0 rc0029 freeze / rc0030 authority receipt
  -> P1 five-concern RED + retained attacks
  -> P2 rc0030 forward lexical spec / realization plan / renderer
  -> P3 Body-only Parser / Independent Matcher
  -> P4 Hard Gate / selector / disconnected runtime / manifest
  -> P5 same P1 suite GREEN + E1b / E0b + predecessor regression
  -> E2 integrated synchronization
  -> E3 machine representative 8
  -> E3 Product Read representative 8
  -> E3 GREEN後だけE4 frozen 100
```

1. `P0 Freeze`: GitHub commit、rc0029 manifest / E3 evidence、exact4 prefixを固定する。
2. `P1 RED`: 5 concern、semantic attacks、control baselineをsource edit前にRED固定する。
3. `P2 Forward`: rc0030 lexical projection、Surface realization plan、schema-free rendererを実装する。
4. `P3 Inverse`: final bytesだけを読むParserとIndependent Matcherを実装する。
5. `P4 Gate / Runtime / Closure`: additive Gate、selector、runtime disconnect、new manifestをGREENにする。
6. `P5 Regression`: source edit前にfreezeした同一P1 suiteをGREENにし、E1b、E0b、rc0027 default、rc0028、rc0029 behavior、dependency / resource / privacyを再実行する。rc0029 closureはclean `e1e2ec5c...`、rc0030 closureはcurrent worktreeで分離検証する。
7. `E2`: forward / Parser / Independent Matcher / Hard Gate / selectorを統合同期し、retained attackを全GREENにする。
8. `E3`: E2 GREEN後、machineを実行し、その後に華恋が設計18.4全軸で代表8件をProduct Readする。
9. `E4`: E3全条件を通過した場合だけfrozen 100 read-onlyへ進む。

text-affecting変更ごとにnew run IDを発行し、失敗結果を上書きしない。

---

## 10. gate / acceptance

### 10.1 E3 entry

次を全て満たした場合だけProduct Readへ進む。

1. P1 five-concern / retained mutation suite全GREEN
2. E1b / E0b / E2全GREEN
3. representative machine `8 / 8 selected`
4. Parser / Matcher / Gateのbody-only exact binding
5. rc0027 / rc0028 / rc0029 behavior非回帰
6. exact4 prefix / dependency closure GREEN
7. review / corpus / failure-family / topic / control runtime branch 0。source-authorized typed semantic atomのdeclarative処理はこの禁止に含めない

### 10.2 E3 Product Read acceptance

1. former MAJOR 5件が全て`PASS`または`MINOR`
2. controls:

   - 0001 `PASS`
   - 0002 `PASS`
   - 0009 `PASS / MINOR`

3. new `MAJOR / BLOCKER = 0`
4. relation、unknown、self-denial、required meaning非回帰
5. main meaning、schema-free、distribution、Reception、naturalness、read feelを設計18.4全軸で確認
6. exact duplicate 0、one anchor以下、generic-only required coverage 0

1件でも未達ならE4を開始しない。

### 10.3 E4 frozen 100

E3 GREEN後だけ、既存batch 001を変更せずread-onlyで実行する。

1. `selected > 56`
2. rc0027 old selected 56件のmachine非回帰
3. representative 8以外のnew selected `>= 1`
4. changed / new selected全件Product Readで`MAJOR / BLOCKER = 0`
5. 100 rowsをexactly 1 dispositionへaccount
6. exception / missing / duplicate / unaccounted 0
7. exact duplicate 0、one anchor以下、generic-only required coverage 0
8. E1b whole100 authority countのlossless accounting
9. rc0027 / rc0028 / rc0029 behavior、E1b / E0b / E2、rc0030 dependency closure GREEN。rc0029 historical closureはclean `e1e2ec5c...`で別検証

E4通過は`rc0030 bounded experiment viable`だけを意味し、Cycle 001 ACCEPTEDではない。

### 10.4 formal candidate境界

E4通過後、別authorityと新run IDで次を再実行する。

- security / privacy / Step 10 reconciliation
- Step 0〜9
- 正式100件 machine 100 / 100
- Known28
- Development42
- invalid16
- 正式100件全件Product Read
- evidence graph / finalization

このformal closureを通過するまでCycle 001を`ACCEPTED`または`完了`と表記しない。

---

## 11. STOP / rollback

### 11.1 即時STOP条件

次のいずれか一つで実装を停止し、必要owner、exact path、意味責任、必要性をMashへ提示する。

1. base orderingからprominence proxyを一意導出できず、Content Selection / Discourse Planner変更が必要
2. main meaning dominanceのために新しいsemantic priorityをdownstreamで発明する必要
3. schema-free化に新事実、推測、case / review・corpus・failure-family別完成文bankが必要
4. exact meaningを保つためdepth、sentence group、candidate 12、replan 1等のresource拡張が必要
5. Reception自然化にtarget / support / act authorityの変更、または`emlis_ai_grounded_human_reception.py`変更が必要
6. Parser / Matcherがforward plan、candidate metadata、hidden markerを読まないと復元できない
7. base-body exact reuseにinverse自己認証、循環import、partial / lexical matchが必要
8. unmapped Receptionをsole-line fallbackで補う必要
9. control改善にcase ID、review / corpus / failure family、input cue branchまたは旧Surface case fallbackが必要。source-authorized typed semantic atomのdeclarative処理はこの禁止に含めない
10. Step 9、E1b、rc0027、rc0028、またはrc0029-prefixed prefix bytes / symbols / behaviorの変更が必要
11. §6.1以外の既存source、または§6.2以外のnew pathが必要
12. exact4へrc0030 unique symbolを安全にappendできず、duplicate / shadow definitionが必要
13. shared runtime / public route / reply / DB / RN / Safety / question接続が必要
14. Gate downgrade、assertion弱化、skip / xfail、mock-only GREENが必要
15. required meaning / relation / unknown / self-denialをdrop / generic化する必要
16. E3またはE4 acceptance未達
17. private body / secure materialをshareable artifactへ出す必要

### 11.2 rollback

rollback対象:

- exact4末尾のrc0030-prefixed append-only API
- §6.2のGREEN implementation service / catalog / runtime / manifest / tool
- P2〜E4専用のactive GREEN test / fixture
- active rc0030 generated manifest / GREEN-phase receipt

保持対象:

- GitHub predecessor `e1e2ec5c...`
- rc0027 / rc0028 / rc0029 source、behavior、evidence
- P1 RED test source、body-free fixture、test hash、freeze receipt、failure history。active mainから除く必要がある場合も、byte-for-byte再計算可能なimmutable evidence package / commitへ保持してから行う
- batch / Known / Development / invalid / historical Product Read

rollback後もE4未開始なら`NOT_STARTED`、Cycle 001は`NOT_ACCEPTED`を維持する。E4実行後に失敗した場合は結果を`FAILED / NOT_VIABLE`として残し、未実行へ書き換えない。

---

## 12. acceptance非主張

本補遺が許可する表記:

- `rc0029 frozen as E3 Product Read STOP evidence`
- `rc0030 impact scope defined`
- `conditionally feasible within existing exact4 responsibility set`
- `waiting for explicit rc0030 literal authority`

本補遺だけでは許可しない表記:

- `rc0030 implementation started / GREEN / accepted`
- `E3 passed`
- `E4 started / viable`
- `formal candidate`
- `Cycle 001 accepted / completed`
- `Step 11 completed`
- `production ready`

---

## 13. 次の明示指示案

実装へ進む場合の正確な次指示は次のとおり。

> 「rc0030 Surface Planning設計20.3影響範囲補遺を承認する。GitHub commit `e1e2ec5c17fa165f9972373304899802832ecd5b`、rc0029 manifest closure `cd46925c6db478ac07e501acb64c45cae3a122ab0c1d834d06a83f1190cfb082`、rc0029 E3 machine GREEN / Product Read STOP evidenceをimmutable predecessorとして、exact 4 existing owner末尾へのrc0030-prefixed append-only APIと、補遺§6.2のnew exact 18 pathだけでP1 five-concern REDを開始する。rc0029 final bytesへ追記せず、immutable rc0027 base AST / realization planとE1b typed authorityから別versionのSurfaceを構成する。Step 9、E1b、Content Selection、Discourse Planner、Grounded Human Reception、rc0027 / rc0028 / rc0029-prefixed existing behavior、shared runtime / public routeを不変にする。P1でREDを確認・freezeし、P2〜P4で共通修復、P5で同一P1 suiteとpredecessor regressionをGREENにした後だけE2へ進む。E2 GREEN後だけE3、E3 Product Read通過後だけE4へ進む。rc0029 historical closureはclean `e1e2ec5c...`、rc0030 closureはcurrent worktreeで分離検証する。既存authority外owner、resource拡張、review / corpus / failure family / control runtime branchが必要なら実装前に停止して影響範囲を提示する。」

この指示にformal candidate化、production接続、Cycle 001 ACCEPTEDは含めない。

---

## Appendix A. 根拠と必要性

| action | 根拠 | 必要性 |
|---|---|---|
| rc0029 freeze | machine GREENとProduct Read STOPが同時に成立 | 失敗証拠を上書きせず比較する |
| rc0030 new RC | text-affecting Surface change | 過去RC証拠を誤継承しない |
| exact4に限定 | 現Natural Surface ownerがrealization plan / chunkを所有 | upstream scope creepと責任重複を避ける |
| new planner fileを作らない | existing Natural Surface責任と重複 | owner境界とdependency closureを最小化する |
| main meaning proxyを限定 | formal main-priority authorityがない | downstreamの意味捏造を防ぐ |
| existing-body exact reuse | rc0029がbase意味へmachine説明を追加して重複した | 既存の自然な意味をexactにcreditし、再説明を防ぐ |
| Product Readを残す | machine 8 / 8でもMAJOR 6 | 自然さ、主旨、読まれた形をmachineで代替しない |
| control専用test | 0001 / 0009が悪化 | generation branchなしで非回帰を独立gateにする |
| Body-only Parser / Matcher | candidate自己申告禁止 | final bytesから意味保持を独立証明する |
| E3後だけE4 | E3 STOP evidence | 失敗Surfaceを100件へ拡大しない |

## Appendix B. 5 concernとE3 reason codeの対応

| concern | primary Product Read evidence | retained related evidence |
|---|---|---|
| main meaning dominance | `MAIN_MEANING_OBSCURED`, `IMMEDIATE_OBSERVATION_NOT_READ` | relation / unknown / self-denialの読み違い |
| schema-free realization | `SCHEMA_EXPOSITION`, `OPAQUE_ORDINAL_REFERENTS`, `REPETITIVE_EXPOSITION` | `SURFACE_UNNATURAL_OR_REPETITIVE` |
| semantic chunk distribution | `SURFACE_DISTRIBUTION_OVERCONCENTRATED`, `DEPTH_OVERSHOOT` | relation unreadable / unknown partial |
| grounded reception naturalization | `EMLIS_RECEPTION_UNBOUND`, `GENERIC_RECEPTION` | target / support / act exactness |
| control non-regression | control非悪化`1 / 3`, new MAJOR 1 | 0001 / 0002 / 0009 baseline severity |
