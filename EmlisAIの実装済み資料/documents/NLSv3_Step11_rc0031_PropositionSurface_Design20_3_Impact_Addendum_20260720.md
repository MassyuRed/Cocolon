# NLS v3 Step 11 rc0031 — Proposition Surface 設計20.3 影響範囲補遺

作成日: 2026-07-20 JST  
作成者: 華恋  
対象工程: `Cocolon / EmlisAI / NLS v3 / Step 11 / Cycle 001`  
文書種別: `post-rc0030 E3 STOP / pre-implementation impact-scope addendum`  
privacy: `BODY-FREE`

## 0. 結論 / 文書状態

| item | state |
|---|---|
| GitHub repository / branch | `MassyuRed/mashos-api:main` |
| immutable GitHub predecessor | `25b98ec8b59eaff717d1dc3261ff21156ccce7ed` |
| rc0030 | `FROZEN_AS_E3_PRODUCT_READ_STOP_EVIDENCE` |
| rc0031 | `IMPACT_SCOPE_DEFINED` |
| rc0031 implementation | `NOT_STARTED` |
| E4 frozen 100 | `NOT_STARTED / NOT_AUTHORIZED` |
| Cycle 001 | `NOT_ACCEPTED` |
| Cycle 002 | `NOT_AUTHORIZED` |
| secure material | `NOT_REQUIRED_AT_THIS CHECKPOINT` |

GitHub再反映は問題ない。`main`の`25b98ec8b59eaff717d1dc3261ff21156ccce7ed`は、rc0030 E3で承認済みのexact 6だけを、phase predecessor `38ca7fa779065998a363ce9bb581338d98b8f79d`へ追加したcommitである。GitHub上の6 blobは華恋の最終版と一致する。

rc0030はmachine上では代表8件を`8 / 8 selected`、active required suiteを`80 / 80 PASS`にした。しかしProduct Readは`PASS 1 / MINOR 1 / MAJOR 6 / BLOCKER 0`であり、former MAJOR 5件の改善は`0 / 5`、control非悪化は`1 / 3`、new MAJORは1件だった。したがって、設計18.4、18.5、18.8、Step 11 Cycle 001の完了条件を満たさない。

次はE4でもCycle 002でもない。rc0030を失敗証拠として凍結し、次の6 concernを共通Surface責任として扱うrc0031を、別RCとして検討する。

1. source-grounded main proposition / main meaning dominance
2. schema-free proposition realization
3. relation endpoint / direction / legibility
4. semantic chunk distribution / depth compaction
5. grounded Reception target / support / act bindingとnaturalization
6. control baseline / retained improvement non-regression

read-only owner mappingの結果、現時点では新しいupstream semantic authorityは必要ない。closed maximum existing ownerは従来と同じexact 4であり、primary repair ownerはNatural Surfaceと新しいrc0031 catalogである。Parser / Independent Matcher / Hard Gateは新grammarへ同期する。Grounded lexicalizationはsource-grounded referent / role / predicate-ready projectionに限って条件付きで使い、意味、優先順位、新事実を発明しない。

本補遺は影響範囲を定義するだけであり、rc0031 code実装を許可しない。§14の明示指示をMashが承認するまで`STOP_BEFORE_IMPLEMENTATION`とする。

---

## 1. 確認した事実

### 1.1 GitHub再反映

1. `main` headは`25b98ec8b59eaff717d1dc3261ff21156ccce7ed`である。
2. `af59e778f6d6bf4c46a296182803495b5c6181fe`からheadまでの差分は、前回不足していた次のexact 3だけである。

   - `ai/services/ai_inference/emlis_ai_rc0030_surface_planning_experiment_dependency_manifest_v3.py`
   - `ai/tools/emlis_nls_v3_rc0030_surface_planning_dependency_manifest.py`
   - `ai/tools/emlis_nls_v3_rc0030_surface_planning_bounded_experiment.py`

3. phase predecessor `38ca7fa779065998a363ce9bb581338d98b8f79d`からheadまでの差分は、承認済みexact 6だけである。
4. exact 6外の変更は0 pathである。
5. GitHub blob SHAはローカル最終版と`6 / 6`一致する。

| index | repository path | SHA-256 |
|---:|---|---|
| 1 | `ai/services/ai_inference/emlis_ai_rc0030_surface_planning_experiment_dependency_manifest_v3.py` | `4f473c9ccea9088c4372afacd903b1fa0130983acbacdf526bba57488883f5ff` |
| 4 | `ai/tools/emlis_nls_v3_rc0030_surface_planning_dependency_manifest.py` | `5b7440780761106d6972bbfd7f9a62f79b9608f84ca1b01ba04bd20cce73665f` |
| 5 | `ai/tools/emlis_nls_v3_rc0030_surface_planning_bounded_experiment.py` | `e0ca3d39aa43c1fbe1dce493177583200b488241fa1a91ab5954b97a1c6863e5` |
| 6 | `ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_dependency_manifest_rc0030_surface_planning_experiment.json` | `06327f7e0e6d63923bbdf836aa5d25744a83eeb8f8a704aa23c89a3ca057857b` |
| 16 | `ai/tests/test_emlis_nls_v3_s11_rc0030_e3_representative8.py` | `30b2b3043c566631d1329e4d516c9d932a103a70f61609f3237e6a45a9538c2e` |
| 18 | `ai/tests/test_emlis_nls_v3_s11_rc0030_dependency_closure.py` | `926b0e4bd0ebf5604fc08761d8660d8c62efd3d8a7ee255b84d739ad654b8582` |

このcommitをrc0031 predecessorにする理由は、E3 machine GREENとProduct Read STOPを再計算できる完全な証拠境界を、GitHub commitとして固定するためである。

### 1.2 rc0030 E3結果

| evidence | result |
|---|---:|
| representative machine selection | `8 / 8` |
| fail-close / no-valid-candidate | `0 / 0` |
| active required suites | `80 / 80 PASS` |
| Product Read | `PASS 1 / MINOR 1 / MAJOR 6 / BLOCKER 0` |
| former MAJOR -> PASS/MINOR | `0 / 5` |
| control non-regression | `1 / 3` |
| new MAJOR / BLOCKER | `1 / 0` |
| E4 | `NOT_STARTED` |
| Cycle 001 | `NOT_ACCEPTED` |

rc0029からrc0030で改善したのは、0001のunknown重複、opaque ordinal / repetitive exposition、0035・0043・0100の一部unknown、0063のself-denial underexpression等である。一方、次は残った。

- 6件の`MAIN_MEANING_OBSCURED`
- 4件の`EMLIS_RECEPTION_UNBOUND`と、0001・0009のgeneric Reception
- 0009・0019・0035・0043のrelation misread / unreadable
- 0035・0063・0100のdepth / distribution failure
- schema exposition
- 0100の新規`REQUIRED_MEANING_PARTIAL`

machine GREENは、現rc0030 grammarをBody-only ParserとIndependent Matcherが正確に復元できることを証明した。しかし、自然なroot propositionとして読めること、主意味が前面にあること、入力固有のReceptionとして読めることは証明していない。これは設計18.4がmachine verificationとProduct Readを分けている理由と一致する。

### 1.3 現在のdataflowとowner

```text
immutable rc0027 base candidate + E1b successor authority
  -> rc0030 Grounded Lexicalization
  -> rc0030 Surface plan / renderer
  -> final bytes
  -> rc0030 Body-only Parser
  -> rc0030 Independent Matcher + immutable source
  -> rc0030 Hard Gate / selector
  -> disconnected runtime / body-free evidence
```

確認できた責任は次のとおりである。

| concern | current fact | current owner |
|---|---|---|
| main meaning | `base_leading_observation_unit_id`は保持されるが、first assignmentに残ることだけをmachine proxyにする | Natural Surface / Hard Gate |
| schema-free | catalogは抽象noun、role-like referent、`一方向の…つながり`、pack suffix `が見えます`を持つ | rc0030 catalog / Natural Surface |
| relation | exact from/to/effective type/directionはE1b / rc0028 atomに既に存在する | upstream authorityは十分。legibilityはNatural Surface、exact reparseはMatcher/Gate |
| distribution | owner位置を求め、max-2 packをowner-readyなline tailへ付加する | Natural Surface plan / Matcher schedule |
| Reception | required opportunityのtarget/support/actはsourceにあり、rendererがreferent列＋closed generic actへ再構成する | authorityはGrounded Reception、wording/integrationはNatural Surface、verificationはMatcher/Gate |
| controls | case ID / role / baseline severityはfixture・test・tool・receiptだけが所有する | production generation ownerではない |

現rc0030 rendererは、rc0027 base final bytesをdecodeし、typed atomを抽象catalog nounと`が見えます`を使うstructure packとしてline末尾へ付加する。Reception lineはtarget / support referent列とgeneric actへ再構成する。そのため、正確にparse可能でも、「入力内容」より「内部構造の説明」が目立つことがある。

### 1.4 詳細設計との整合

1. 設計18.2はtext-affecting source change後にnew RC IDを要求する。よってrc0030上書きではなくrc0031が必要である。
2. 設計18.4は主意味、relation direction、unknown、Emlis reception、自然さ、depth、読まれた形を華恋が読むことを要求する。
3. 設計18.5はunresolved MAJORをbatch acceptance不可とする。
4. 設計18.6はcase / family / expected-answer cueによる修正を禁止する。
5. 設計18.7はtext-affecting change後の累積全件再実行を要求する。
6. 設計18.8とStep 11 Cycle 001はunresolved BLOCKER / MAJOR 0とchange ledgerを要求する。
7. 設計21.1は前Cycleが`ACCEPTED`になるまで次Cycleへ進まない。
8. 設計20.3は既存Surface範囲を越えるowner変更が必要なら、黙って広げず別の影響範囲提示を要求する。

---

## 2. 推測

### 2.1 共通原因

主因はtyped情報の欠落より、typed atomを「入力に根ざした命題」ではなく「内部関係の説明」として本文化するrealization topologyにあると推測する。

現在はbase sentenceを残し、その後ろへconstruction / relation / unknown等の説明packを足す。その結果、意味が増えるほどschema説明が主旨を押し退け、tail concentration、depth overshoot、relation unreadability、generic Receptionが連動しやすい。

### 2.2 修復可能性

source-grounded referent、E1b endpoint / direction / type、Reception target / support / act、base sentence groupは既に存在する。これらをroot predicate、relation connective、dependent clause、Reception predicationへ統合できれば、Content SelectionやE1b authorityを変更せずに改善できる可能性がある。

ただし、既存authorityからpredicate-ready roleまたはmain propositionを一意に導出できない場合、downstreamで任意のpriorityや新事実を発明してはいけない。その場合は実装前にSTOPし、Content Selection / Discourse / lexical semantic authorityの追加scopeを提示する必要がある。

### 2.3 Product Readの位置

machine proxyは、root propositionのsource binding、schema marker不在、endpoint / direction exactness、chunk cardinality、Reception bindingを検査できる。しかし、「主旨が自然に前面へ読める」「Cocolonの入力直後観測として読まれた形になっている」はmachineだけでは確定できない。E3 Product Readを最終gateとして残す必要がある。

---

## 3. 華恋の意見

rc0030の修復成果とmachine証拠は保持する。しかし同RCを再編集すべきではない。E3 Product Read STOPを失敗証拠として凍結し、rc0031で命題中心のSurfaceを別versionとして作るのが正確である。

この段階でupstreamを広げる根拠はない。relation authorityとReception authorityは既に足りている。まずexisting exact 4をclosed maximumとして、Natural Surface＋new catalogをprimary repairにし、Parser / Matcher / Gateを同期させるべきである。

ただし、rc0031を「語彙の言い換え」だけにしてはいけない。必要なのは次である。

- source-grounded root predicateを先に立てる
- relationをtaxonomy nounではなくendpoint間の自然なconnective / dependent clauseとして出す
- required atomをowner-connected clauseへ分散し、同じ意味を重複説明しない
- Receptionのtarget / support / actを一つの入力固有predicationとして結ぶ
- final bytesからIndependent Matcherがexact意味を復元する

同じMAJOR群がrc0031 E3でも残る場合、rc0032を自動で増やしてはいけない。Surface方式の前提またはupstream authorityを再判定するSTOP境界に戻るべきである。

---

## 4. predecessor freeze / authority継承

### 4.1 authority順位

1. `Cocolon_EmlisAI_ModelFreeNaturalLanguageSurfaceV3_DetailedDesign_ImplementationOrder_20260714_Revised_Cycle.md`
2. E1b successor authority addendum / final receipt
3. rc0028 downstream authority / evidence
4. rc0029 common Surface repair authority / E3 STOP evidence
5. rc0030 Surface Planning authority / P1〜E3 evidence
6. 本rc0031補遺

本補遺は上位authorityの意味を拡張しない。競合時は、狭い後発scope、predecessor不変、body-only recoverability、Independent Matcher、resource bound、case cue禁止、runtime disconnectを優先する。

### 4.2 immutable evidence commitments

| artifact | SHA-256 / identity |
|---|---|
| GitHub predecessor | `25b98ec8b59eaff717d1dc3261ff21156ccce7ed` |
| detailed design supplied copy | `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc` |
| rc0030 source closure | `be45dc1c8a34a231c0726fe1570c24e873f55e93b338e614b912112f1c201fbb` |
| rc0030 manifest file | `06327f7e0e6d63923bbdf836aa5d25744a83eeb8f8a704aa23c89a3ca057857b` |
| rc0030 manifest artifact | `4b59a83b26830504247cd2078611b3aee19a7699e04927633bb4bf549b9ca8f6` |
| rc0030 file-list artifact | `08bb90db3a20b5ecf1f79b4dbad3dcd46e13a151a4e68c263f38467ab020f80c` |
| rc0030 E3 machine body-free receipt | `56fad0a7f96f2af46e94a8b3fe1ca7e6f7500a9605bf8cc7aed8b4a95fd86f7c` |
| rc0030 E3 Product Read STOP receipt | `608a1c73fb94fa67a4df39c78661edadb7ec9ec8e905438cb3716b920ea87f95` |
| rc0030 E3 handoff | `42263731f19ac5426d943407aafecf9412ac03524c29b30e8a148e5b2fd3542e` |
| rc0030 E3 STOP package | `9e0d06b0bd40f570c362878c8ce243446da9452e2b5354022870e4acd2937846` |

private artifactは外部へ本文を出さず、既存body-free receiptのcommitmentだけを継承する。

### 4.3 exact 4 current full-prefix commitments

rc0031 implementationが別途承認された場合、次のcurrent file全bytesをpredecessor prefixとして保持し、その末尾へunique rc0031-prefixed symbolsだけを追加する。既存行の編集、挿入、削除、rename、shadow definitionを禁止する。

| path | frozen prefix bytes | frozen prefix SHA-256 | rc0031で許可される責任 |
|---|---:|---|---|
| `ai/services/ai_inference/emlis_ai_step11_grounded_lexicalization_v3.py` | 129615 | `592f3ab7c90831c3191f51e9e7dd9a1f8c3fe4add1fd31bba9fdc65dccaecc28` | source-grounded referent / role / predicate-ready projectionのみ。必要性はP1 REDで判定 |
| `ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py` | 360675 | `5f548499e05e5a982f375dde5f059d7eba08f06fbc59bd0a76d9ed788a1e8eaf` | root proposition、integrated relation、chunk plan、Reception、canonical render |
| `ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py` | 722658 | `648a3a6690f8df860053c811a5416fcfc9983524e5ff880a0e6921a122a52e30` | new grammarのBody-only Parser / Independent Matcher |
| `ai/services/ai_inference/emlis_ai_step11_hard_gate_v3.py` | 208041 | `88514bb2a179e8d726f36e1666d2618330d95979107403ededc93aa35655943b` | additive join / Hard Gate / deterministic selector |

exact 4はclosed maximumであり、4 file全てを必ず編集する義務ではない。特にGrounded Lexicalizationは、既存projectionを安全に再利用できるなら変更しない。別planner sourceを追加しない。

### 4.4 immutable owner / behavior

次を変更しない。

- Step 9全20 owner / manifest
- E1b predecessor / successor owner、relation endpoint / direction / type authority
- Content Selection / Discourse Graph Planner / Planning Frontier
- `emlis_ai_grounded_human_reception.py`とReception target / support / act authority
- rc0027 default catalog / runtime / public-adjacent behavior
- rc0028 / rc0029 / rc0030-prefixed bytes、symbols、behavior、fixture、test、evidence
- shared Matcher、shared runtime、public route、reply、DB、RN、Safety、question owner
- batch 001、Known28、Development42、invalid16、historical Product Read

---

## 5. failure -> layer -> owner mapping

| failureの見え方 | 壊れたlayer | 共通原因候補 | 修復owner | negative test |
|---|---|---|---|---|
| 主意味が構造説明に埋もれる | Surface plan / render | first-assignment保持をperceptual dominanceとみなす | Natural Surface + Gate proxy | root drop / displacement / duplicate / structure-only substitution |
| schema exposition / abstract noun列 | catalog / render | atomごとにtaxonomy-like nounを本文化 | rc0031 catalog + Natural Surface | taxonomy noun / role label / ordinal marker / generic pack predicate |
| relation misread / unreadable | relation realization | exact endpointを抽象関係名で説明 | Natural Surface + Matcher/Gate | endpoint swap / direction reverse / type mutation / nominalization |
| tail concentration / depth overshoot | chunk plan | owner-ready packをline tailへ集中 | Natural Surface + Matcher placement | wrong group / tail concentration / reorder-duplicate / budget bypass-drop |
| Reception unbound / generic | Reception realization | target/support列とgeneric actを組み合わせる | Natural Surface + Matcher/Gate | target swap / support omission / act-scope swap / generic unbound |
| control悪化 | evaluation boundary | common repairの副作用 | test / tool / Product Read receipt | case branch / severity mutation / P3 bypass / resource expansion |

production serviceはcontrol case ID、review role、baseline severity、failure family、Product Read verdictを読まない。

---

## 6. rc0031 Proposition Surface契約

### 6.1 pipeline

```text
immutable rc0027 base AST / plan
  + immutable E1b / rc0028 typed authority
        |
        v
rc0031 source-grounded lexical projection
        |
        v
rc0031 Proposition Surface plan
  - source-grounded root predicate
  - endpoint-aware relation connective / dependent clause
  - owner-connected semantic chunk distribution
  - grounded Reception predication
        |
        v
rc0031 Typed AST / Canonical Renderer
        |
        v
final bytes only -> rc0031 Body-only Parser
        |
        v
Parsed Witness + immutable source -> Independent Matcher
        |
        v
additive rc0031 Hard Gate / deterministic selector
```

rc0031はrc0030 final bytesを文字列修復入力として加工しない。immutable rc0027 base AST / planとE1b typed authorityから別Surfaceを構成する。rc0030はhistorical evidence / behavior regression targetであり、meaning authorityではない。

### 6.2 main proposition / dominance

1. 新しい`main meaning priority` fieldをdownstreamで発明しない。
2. immutable base orderingから一意に得られるleading observationとsource-grounded predicateをroot propositionとする。
3. construction / relation / unknownだけのstructural noun clauseをrootにしない。
4. root propositionをdrop、duplicate、generic化、structure-only paraphraseで置換しない。
5. machine proxyはsource-root exact binding、first observation placement、structural-only root不在を検査する。
6. 自然なdominanceはE3 Product Readで設計18.4全12軸を読む。
7. base orderingからrootを一意に導出できない場合はfail-closeし、upstream scopeを提示する。

### 6.3 schema-free proposition realization

1. construction / relation / semantic link / unknownをrecord、slot、ordinal、owner、role label、taxonomy説明として本文へ出さない。
2. source-grounded referent、predicate、connective、modifier、dependent clauseへ統合する。
3. catalogはclosed morphology、predicate-role pattern、connective、inflectionだけを持つ。完成文、case / topic / family cue、expected output、reason codeを持たない。
4. `一方向の〜つながり`のようにdirection labelと関係名を名詞列として説明する方式を新catalogへ継承しない。
5. Parser都合のvisible delimiter、numbered record、zero-width marker、hidden tokenを禁止する。

### 6.4 relation endpoint / direction / legibility

1. E1b / rc0028のfrom / to / effective type / directionをexact authorityとして使用する。
2. source-to-targetは自然なclause order / connectiveで方向を保つ。bidirectionalは対称性を保つ。
3. endpointをgeneric nounへ潰さず、source-grounded visible referentへbindする。
4. relationを新事実、因果、診断、人格へ昇格しない。
5. Parser / Matcherはfinal bytesだけからendpointとdirectionを復元し、immutable sourceと独立照合する。
6. relation legibilityのためにE1b owner変更が必要ならSTOPする。

### 6.5 semantic chunk distribution / depth

1. atomをowner nucleusが参加するObservation groupへ割り当てる。
2. root propositionを先に保ち、dependent meaningをowner-connected clauseへ分散する。
3. familyごとの一つの末尾packへrequired atomを集中させない。
4. same meaningをbase bodyとadded clauseへ重複させない。exact reuseはBody-only Parser＋Independent Matcherのexact binding時だけcreditする。
5. existing depth、sentence group、clause、complexity、joiner budgetを拡張しない。
6. budgetへ収めるためrequired meaningをdrop、generic化、covered扱いしない。収まらなければfail-closeする。

### 6.6 grounded Reception

1. required opportunityごとのtarget owner、support owner、act、scopeをexact保持する。
2. target / supportの一覧＋generic actという組み立てを使わず、一つの自然なReception predicationへ統合する。
3. genericな`気に留めます`等だけではbound Receptionとして通さない。
4. Parserはfinal bytesだけからactとvisible antecedentを復元する。
5. Matcherはforward plan、candidate AST、span map、candidate-declared bindingを読まず、Parsed Witnessとsource authorityから独立照合する。
6. 自然化のために助言、問い、原因、診断、人格、新事実を追加しない。
7. source target / support / actが不足していると判明した場合はGrounded Reception ownerを黙って変更せずSTOPする。

### 6.7 retained semantic / safety contract

- cross-span owner / overlapの区別
- relation endpoint / direction / effective type
- semantic linkとconstruction internal linkの分離
- explicit unknown dimension / affected owner / cardinality
- unknown exactly-once
- self-denial separation / non-promotion
- `covered != semantic coverage`
- required meaning exactness
- canonical rerender一致
- one visible source anchor以下
- exact output duplicate 0
- deterministic selection
- body-only recoverability / Independent Matcher

---

## 7. exact owner / path scope

### 7.1 conditional MODIFY exact 4

§4.3の4 pathだけをclosed maximum existing ownerとする。unique rc0031-prefixed APIをcurrent full-file末尾へappendする方式だけを許可する。P1で不要と判定したownerは編集しない。

### 7.2 NEW rc0031 exact 18 closed maximum allowlist

#### services

1. `ai/services/ai_inference/emlis_ai_rc0031_proposition_surface_experiment_dependency_manifest_v3.py`
2. `ai/services/ai_inference/emlis_ai_step11_rc0031_experiment_runtime_adapter_v3.py`
3. `ai/services/ai_inference/emlis_ai_step11_rc0031_experiment_surface_catalog_v3.py`

#### tools

4. `ai/tools/emlis_nls_v3_rc0031_proposition_surface_dependency_manifest.py`
5. `ai/tools/emlis_nls_v3_rc0031_proposition_surface_bounded_experiment.py`

#### fixtures

6. `ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_dependency_manifest_rc0031_proposition_surface_experiment.json`
7. `ai/tests/fixtures/emlis_nls_v3/cycle_001/rc0031_representative8_body_free.json`

#### tests

8. `ai/tests/test_emlis_nls_v3_s11_rc0031_proposition_surface_red.py`
9. `ai/tests/test_emlis_nls_v3_s11_rc0031_proposition_surface_mutation.py`
10. `ai/tests/test_emlis_nls_v3_s11_rc0031_e2_integration.py`
11. `ai/tests/test_emlis_nls_v3_s11_rc0031_forward_inverse_independence.py`
12. `ai/tests/test_emlis_nls_v3_s11_rc0031_runtime_disconnect.py`
13. `ai/tests/test_emlis_nls_v3_s11_rc0031_predecessor_immutability.py`
14. `ai/tests/test_emlis_nls_v3_s11_rc0031_predecessor_behavior_regression.py`
15. `ai/tests/test_emlis_nls_v3_s11_rc0031_control_non_regression.py`
16. `ai/tests/test_emlis_nls_v3_s11_rc0031_e3_representative8.py`
17. `ai/tests/test_emlis_nls_v3_s11_rc0031_e4_frozen100_read_only.py`
18. `ai/tests/test_emlis_nls_v3_s11_rc0031_dependency_closure.py`

exact 18は全rc0031 lifecycleのmaximum allowlistである。phaseごとに必要なindexだけをactiveにし、後続indexを先に作らない。filesystem discoveryでpathを増やさない。別surface planner sourceを追加しない。

### 7.3 new manifest contract

rc0031 manifestは次を固定する。

1. GitHub predecessor `25b98ec8b59eaff717d1dc3261ff21156ccce7ed`
2. rc0030 manifest / closure / E3 STOP evidence
3. exact 4 frozen prefix bytes / SHA-256
4. exact 18 maximum allowlist、phase active / hash-bound / reserved状態
5. static / dynamic project import edge
6. unexpected path / unbound import / forbidden reverse import `0`
7. `experimental_only=true`
8. `runtime_connected=false`
9. `public_owner_unchanged=true`
10. rc0027 default、rc0028、rc0029、rc0030 behavior equivalent
11. `eligible_for_formal=false`
12. `eligible_for_production=false`
13. deterministic canonical rebuild

rc0030 historical closureはclean predecessorで、rc0031 current closureはcurrent worktreeで分離検証する。

---

## 8. P1 RED / mutation freeze contract

### 8.1 exact 7 collected denominator

production source edit前に次のexact 7をcollectionする。

| index | expectation on unchanged rc0030 |
|---:|---|
| 1 | predecessor / source / evidence freeze integrityはPASS |
| 2 | source-root / main meaning dominanceはintentional RED |
| 3 | schema-free proposition realizationはintentional RED |
| 4 | relation endpoint / direction / legibilityはintentional RED |
| 5 | semantic chunk distribution / depthはintentional RED |
| 6 | grounded Reception target / support / act bindingはintentional RED |
| 7 | control / retained improvement non-regressionはintentional RED |

REDはcurrent rc0030を実行してsemantic failureを再現する。collection error、import error、常時fail mock、`skip`、`xfail`、fixture severity改変をREDに数えない。

P1 body-free freeze receiptへ、Git commit、test hash、exact 7結果、source/input/output commitment、closed reason matrix、resource denominator、exact path allowlistを固定する。GREEN化のためにRED意味、分母、fixture、baseline severityを変えない。

### 8.2 new pending attack exact 24

各concern 4 attack、合計24を固定する。

| family | exact 4 attacks |
|---|---|
| root | root drop / displacement / duplicate / structure-only root substitution |
| schema | taxonomy noun / role label / ordinal-record marker / generic-pack predicate |
| relation | endpoint swap / direction reverse / type mutation / taxonomy nominalization |
| distribution | wrong group / tail concentration / reorder-or-duplicate / budget bypass-or-drop |
| Reception | target swap / support omission / act-or-scope swap / generic unbound |
| boundary | case-family-control branch / control fixture-severity mutation / P3 metadata-hidden-marker bypass / resource expansion |

exact 24はrc0030の既存attack denominatorへ追加する。既存suiteやattackを置換・減算しない。

### 8.3 retained control / improvement

Product baseline:

- `nls3s_b001_0001 = PASS`
- `nls3s_b001_0002 = PASS`
- `nls3s_b001_0009 = PASS or MINOR`

さらに次を再発させない。

- 0001 explicit unknown exactly-once
- 0063 self-denial non-promotion
- opaque ordinal / repetitive exposition 0
- 0035・0043・0100で解消済みunknown drop / partialの再発0

control ID / role / severityを扱えるのはbody-free fixture、test、bounded tool、Product Read receiptだけである。service / catalog / runtime / selectorが参照してはならない。

---

## 9. 実装が別途承認された場合の順序

```text
P0  GitHub predecessor + rc0030 evidence freeze
  -> P1 exact 7 RED + new exact 24 attack freeze
  -> P2 source-grounded proposition forward / plan / renderer
  -> P3 new grammar Body-only Parser / Independent Matcher
  -> P4 additive Hard Gate / selector / disconnected runtime / manifest
  -> P5 same P1 exact 7 GREEN + new24 + all retained regression GREEN
  -> E2 forward / Parser / Matcher / Gate / selector integration
  -> E3 representative 8 machine
  -> E3 representative 8 Product Read
  -> E3 GREEN後だけE4 frozen 100 read-only
  -> E4通過後だけ別authorityでformal candidate closure
```

1. `P0`: commit、exact6、manifest、E3 STOP evidence、exact4 current prefixを固定する。
2. `P1`: exact 7とnew24をsource edit前にRED freezeする。
3. `P2`: source-grounded lexical projection、root proposition、relation connective、distributed plan、Reception predication、canonical rendererを実装する。
4. `P3`: final bytesだけを読むParser / Independent Matcherを実装する。P3迂回を禁止する。
5. `P4`: additive Gate、selector、disconnected runtime、phase manifestを実装する。
6. `P5`: P1と同一のexact 7を全GREENにし、new24、全retained attack、predecessor behavior、resource、privacy、closureを全GREENにする。
7. `E2`: forward / inverse / Gate / selectorを同期し、E1b / E0b / predecessor regressionを通す。
8. `E3`: machine 8件通過後、2 reviewerが独立Product Readし、case severityはmaximum-per-caseでmergeする。
9. `E4`: E3 Product Read acceptance後だけfrozen batch 001全100件をread-only実行する。

各text-affecting phaseでnew run IDを発行し、失敗結果を上書きしない。

---

## 10. resource / independence / privacy

### 10.1 resource不変

- candidate `<= 12`
- replan `<= 1`
- source owner `<= 24`
- referent scalar `<= 32`
- parser body `<= 1,000,000 bytes`
- existing parse decomposition / scan / comparison / P3 invocation bounds
- existing depth / sentence group / clause / complexity / repeated joiner bounds
- visible source anchor `<= 1`

variantの直積増加、unbounded search、model、embedding、network、runtime learningを追加しない。bound超過時はtruncateやmeaning dropではなくfail-closeする。

### 10.2 forward / inverse independence

ForwardとParserは同じimmutable declarative rc0031 catalog valueを読んでよい。Parser / Matcherはforward module、realization plan、candidate AST、span map、phrase selector、candidate-declared owner / coverage / bindingをimportまたは入力にしない。

MatcherはParsed Witnessとvalidated source authorityから期待bindingを独立再計算する。canonical rerenderとHard Gateはmutable forward self-claimを信用しない。

### 10.3 privacy

- repo / shareable ZIP: source、test、tool、body-free fixture、hash、count、closed reason code
- local private: input / output本文、parsed span、binding detail、Product Read note
- body-fullをstdout、traceback、manifest、shareable receiptへ出さない
- real-user raw、個人情報、unsalted body digest、secure keyを含めない

このimpact-scope / P1〜E4 bounded experimentにはsecure materialは不要である。formal candidate化後にHMAC、encrypted packet、secure run等が必要になった境界でMashへ具体的作業を依頼する。

---

## 11. gate / acceptance

### 11.1 E3 entry

次を全て満たした場合だけE3 Product Readへ進む。

1. P1 exact 7が同一bytes / denominatorのままP5で全GREEN
2. new exact 24と全retained attack GREEN
3. E1b / E0b / E2 / dependency closure GREEN
4. representative machine `8 / 8 selected`
5. P3 body-only exact binding
6. rc0027 / rc0028 / rc0029 / rc0030 behavior非回帰
7. case / family / topic / input-word / review / control runtime branch 0
8. exact4 prefixとresource / privacy / runtime-disconnect GREEN

### 11.2 E3 Product Read acceptance

1. former MAJOR 5件が全て`PASS`または`MINOR`
2. 0001 `PASS`
3. 0002 `PASS`
4. 0009 `PASS`または`MINOR`
5. new `MAJOR / BLOCKER = 0`
6. relation、unknown、self-denial、required meaning非回帰
7. 設計18.4全12軸を2 reviewerが確認
8. exact duplicate 0
9. visible source anchor `<= 1`
10. generic-only required coverage 0

1件でも未達なら`STOP_BEFORE_E4`とする。

### 11.3 E4 frozen 100

E3 GREEN後だけ、既存batch 001を変更せずread-onlyで実行する。

1. `selected > 56`
2. rc0027 old selected 56件のmachine非回帰
3. representative 8以外のnew selected `>= 1`
4. changed / new selected全件Product Readで`MAJOR / BLOCKER = 0`
5. 100 rowをexactly one dispositionへaccount
6. exception / missing / duplicate / unaccounted `0`
7. exact duplicate 0、anchor `<= 1`、generic-only required coverage 0
8. E1b whole100 authority countのlossless accounting
9. 全predecessor behavior / manifest / closure GREEN

E4通過は`rc0031 bounded experiment viable`だけを意味する。Cycle 001 `ACCEPTED`ではない。

### 11.4 formal candidate境界

E4通過後、別authorityとnew run IDでsecurity、Step 0〜9、正式100件、Known28、Development42、invalid16、全100件Product Read、evidence finalizationを再実行する。このformal closureを通過するまでCycle 001を`ACCEPTED`または`完了`と表記しない。

---

## 12. STOP / rollback

### 12.1 即時STOP条件

次のいずれか一つで実装を停止し、必要owner、exact path、意味責任、必要性をMashへ提示する。

1. existing base orderingからroot / dominanceを一意導出できず、新semantic priorityが必要
2. Content Selection、Discourse Planner、Planning Frontier変更が必要
3. E1b endpoint / direction / type authority変更が必要
4. Grounded Human Receptionのtarget / support / act authority変更が必要
5. source-grounded predicate-ready roleを既存authorityから一意導出できない
6. case / family / topic / input word / review / control branch、完成文bank、旧Surface case fallbackが必要
7. Parser / Matcherがforward plan、AST、metadata、hidden marker、self-claimを読む必要
8. required meaning、relation、unknown、self-denialをdrop / generic化する必要
9. candidate / replan / owner / referent / parser / depth / clause等のresource拡張が必要
10. Gate downgrade、assertion弱化、skip / xfail、mock-only GREENが必要
11. exact4 / new exact18外path、または別planner sourceが必要
12. shared Matcher / runtime、public route、reply、DB、RN、Safety、question接続が必要
13. rc0027 / rc0028 / rc0029 / rc0030 frozen bytes / symbols / behaviorを変更する必要
14. private body / secure materialをshareable artifactへ出す必要
15. rc0031 E3でも同じMAJOR群が残る

15の場合、rc0032を自動開始しない。方式またはupstream authorityを再判断する。これは直ちにmodel-free方式の廃止を意味しないが、同じ修復loopの無条件継続は認めない。

### 12.2 rollback

rollback対象はrc0031-prefixed append-only APIとnew rc0031 active implementation / fixture / test / manifestである。保持対象はGitHub predecessor、rc0030 E3 STOP evidence、P1 RED test / fixture / receipt / failure history、全predecessor behaviorとcorpusである。

rollback後もE4は`NOT_STARTED`、Cycle 001は`NOT_ACCEPTED`を維持する。

---

## 13. acceptance非主張

本補遺が許可する表記:

- `GitHub predecessor 25b98ec8... verified`
- `rc0030 frozen as E3 Product Read STOP evidence`
- `rc0031 impact scope defined`
- `conditionally feasible within existing exact4 responsibility set`
- `waiting for explicit rc0031 implementation authority`

本補遺だけでは許可しない表記:

- `rc0031 implementation started / GREEN / accepted`
- `E3 passed`
- `E4 started / viable`
- `formal candidate`
- `Cycle 001 accepted / completed`
- `Cycle 002 started`
- `Step 11 completed`
- `production ready`

---

## 14. 次の明示指示案

実装へ進む場合の正確な次指示は次のとおり。

> 「rc0031 Proposition Surface設計20.3影響範囲補遺を承認する。GitHub commit `25b98ec8b59eaff717d1dc3261ff21156ccce7ed`、rc0030 source closure `be45dc1c8a34a231c0726fe1570c24e873f55e93b338e614b912112f1c201fbb`、rc0030 E3 machine GREEN / Product Read STOP evidenceをimmutable predecessorとして、補遺§4.3のconditional MODIFY exact 4をclosed maximum、§7.2のNEW exact 18をclosed maximum allowlistとして、P1 exact 7 REDとnew pending attack exact 24を開始する。P1ではproduction sourceを編集せず、current rc0030のsemantic RED、test hash、denominator、resource、body-free evidenceをfreezeする。P1 freeze後だけP2へ進み、P3 Body-only Parser / Independent Matcher、P4 Hard Gate / selector / disconnected runtime / manifest、P5同一P1 suite GREEN、E2、E3 machine、E3 Product Readの順を守る。E3 Product Read通過後だけE4 frozen 100へ進む。Step 9、E1b、Content Selection、Discourse Planner、Grounded Human Reception、rc0027 / rc0028 / rc0029 / rc0030 existing behavior、resource bound、shared/public routeを不変にする。既存authority外owner、exact4 / 18外path、resource拡張、P3迂回、case / family / review / control branchが必要なら実装前にSTOPし、影響範囲を提示する。」

この指示にE4、formal candidate化、production接続、Cycle 001 ACCEPTED、Cycle 002開始は含めない。

---

## Appendix A. 根拠と必要性

| action | 根拠 | 必要性 |
|---|---|---|
| GitHub headをpredecessor固定 | exact6再反映とblob 6/6一致 | E3 STOP evidenceをcommitで再計算可能にする |
| rc0030 freeze | machine GREENとProduct Read MAJOR6が同時成立 | 失敗証拠を上書きしない |
| rc0031 new RC | text-affecting Surface change | 設計18.2に従い旧RC証拠を誤継承しない |
| exact4 closed maximum | current owner mappingで責任が閉じる | scope creepと二重ownerを防ぐ |
| Natural Surface primary |抽象pack付加とReception再構成を所有 | 原因のlayerを直接修復する |
| Parser / Matcher / Gate同期 | new natural grammarは旧grammarと異なる | forward自己認証を防ぎexact意味を守る |
| P1 exact7 / new24 | E3 failureと近道attackをsource edit前に固定 | fixture最適化とfailure隠蔽を防ぐ |
| control production branch禁止 | controlはevaluation役割 | case専用修復を防ぐ |
| Product Read維持 | machine 8/8でもMAJOR6 | 自然さと読まれた形をmachineで代替しない |
| E3後だけE4 | current E3 STOP | 失敗Surfaceをfrozen100へ拡大しない |

## Appendix B. 現在地

```text
Step 11 / Cycle 001
  rc0030 E3 machine                    GREEN
  rc0030 E3 Product Read              STOP
  GitHub exact6 evidence reflection   VERIFIED
  rc0030                              FROZEN
  rc0031 impact scope                 DEFINED
  rc0031 implementation               NOT STARTED
  E4 frozen100                        NOT STARTED
  Cycle 001                           NOT ACCEPTED
  Cycle 002                           NOT AUTHORIZED
```
