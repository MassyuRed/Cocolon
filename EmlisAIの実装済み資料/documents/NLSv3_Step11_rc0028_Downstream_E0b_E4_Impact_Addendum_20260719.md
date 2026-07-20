# NLS v3 Step 11 rc0028 — downstream E0b〜E4 影響範囲補遺

## 0. 結論 / 文書状態

- document status: `IMPACT_SCOPE_DEFINED / IMPLEMENTATION_REQUIRES_EXPLICIT_ACCEPTANCE`
- target lane: `rc0028 experiment-only downstream E0b -> E2 -> E3 -> E4`
- GitHub source baseline: `31d3cf183589b27481338277574f90500f3c5b11`
- baseline tree: `c826c3ed5587356f313a90a5b67611e3972abd42`
- E1b successor disposition: `UPSTREAM INFORMATION CLOSURE PREDECESSOR`
- E0b: `NOT_STARTED`
- E2: `NOT_STARTED / NOT AUTHORIZED BY THIS DOCUMENT`
- E3: `NOT_STARTED / GATED BY E2`
- E4: `NOT_STARTED / GATED BY E3 PRODUCT READ`
- existing Step 9 manifest 20 owner: `BYTE_IMMUTABLE`
- rc0027 default behavior: `BYTE-EQUIVALENT REGRESSION REQUIRED`
- shared runtime / public route: `UNCHANGED / DISCONNECTED`
- formal candidate: `NOT AUTHORIZED`
- Cycle 001: `NOT ACCEPTED`
- secure material: `NOT REQUIRED FOR E0b〜E4`
- body-free: `true`

本補遺は、E1b successorが閉じたupstream relation / construction / lexical-role情報を、forward、Body-only Parser、Independent Matcher、Hard Gateが独立に消費できるか検証するための**影響範囲だけ**を定義する。source実装、E0b RED追加、E2、E3、E4を開始するreceiptではない。

Mashの現指示は全体sequenceを最後まで進める意向を示しているが、先行するE1b successor補遺はE0b / E2を別authorityとして明示的に除外している。狭いauthorityを黙って拡大しないため、本補遺のexact allowlistとgateをMashが明示承認した後にだけ実装へ進む。

設計書本文は変更しない。本補遺は設計20.3が要求する「変更が必要な場合の別影響範囲提示」である。

## 1. authorityの継承順位

1. revised detailed designの非変更contract、forward / inverse独立性、Hard Gate非弱化を最優先する。
2. `NLSv3_Step11_rc0028_E1b_SuccessorAuthority_Impact_Addendum_20260719.md`のStep 9全20 owner byte不変、resource、privacy、origin、STOPを全て継承する。
3. 先行`NLSv3_Step11_rc0028_Design20_3_Impact_Addendum_20260719.md`のdownstream一般許可を、本補遺のexact 4 modify ownerとexact new pathへ狭める。
4. E1b successorのA0〜A6 evidenceと独立experiment manifestをappend-only predecessorとして扱い、downstream都合で書き換えない。
5. 本補遺と先行文書が競合する場合、byte不変、runtime非接続、resource非拡張、狭いowner scopeを優先する。

## 2. 判断根拠

### 2.1 確認した事実

1. GitHub baseline `31d3cf183589b27481338277574f90500f3c5b11`では、E1b predecessorがcross-span、owner overlap、relation endpoint / direction、explicit unknown、`covered != semantic coverage`の5論点をRED固定している。
2. E1b successorのlocal実装checkpointでは、Step 9 validatorがPASSし、Step 9全20 ownerとv1 predecessorを変更せずに、専用authority test `9 passed`、successor / E1b統合対象`23 passed`、既存v1対象`49 passed`を確認した。
3. frozen 100をauthorityだけでread-only再構築した結果は100 / 100件でbuild / validate成功し、Plan relation 165、semantic unit 10、semantic link 5、source-explicit unknown 27をaccountした。
4. E1b successorは`experimental_only=True`、`runtime_connected=False`であり、現行Step 11 Surface / Parser / Matcher / Gate / runtimeからreverse importされない。
5. 現行rc0027 downstreamは、少なくとも次の4 ownerへ責任が分かれている。
   - lexical featureからforward phraseを作る`emlis_ai_step11_grounded_lexicalization_v3.py`
   - AST / final bytesを作る`emlis_ai_step11_natural_surface_v3.py`
   - final bytesのparseと独立bindingを行う`emlis_ai_step11_natural_surface_matcher_v3.py`
   - candidateをhard evaluate / selectする`emlis_ai_step11_hard_gate_v3.py`
6. 現行shared runtime entrypointは`emlis_ai_step11_runtime_adapter_v3.py`であり、上記rc0027 ownerを直接使用する。ここへrc0028を接続するとexperiment-only境界を越える。
7. rc0027の代表8件はmachine上8 / 8 selectedだったが、Product Readは`PASS 2 / MINOR 1 / MAJOR 5`。frozen 100は`selected 56 / no-valid-candidate 2 / fail-close 42`だった。
8. Step 10 dependency closureには本successor以前から2件の既知driftがある。このdriftはE1b / downstream experimentで修復・正当化できず、formal前に別のversioned reconciliationが必要である。
9. 設計12 / 13は、Parserがcandidate metadataを読まないこと、Matcherがcandidate AST / generator span map / candidate-declared coverageを読まないこと、Hard Gateがgeneric bodyやrelation反転をfail-closeすることを要求する。
10. 設計18.4 / 18.5はmachine PASSをProduct Readの代用にせず、BLOCKER / MAJORをbatch acceptance不可とする。

### 2.2 推測

1. E1bのtyped relation / construction / unknownをforwardだけへ渡すと、metadataは正しく本文はgenericという自己認証が再発する可能性が高い。
2. 現行rc0027 APIを置換せず、同じ4 ownerへadditive experiment APIを置き、別runtime adapterからだけ呼ぶことで、forward / inverseの責任分離とrc0027 default非回帰を同時に保てる可能性がある。
3. E1b successorのconstruction slotをそのまま可視anchor数へ変換する必要はない。closed lexical featureとしてclause構成へ使い、最終本文からParserが復元できたものだけをMatcher / Gateがsemantic realizationとして認めれば、一候補一anchorを維持できる可能性がある。
4. E3代表8だけで改善しても、case cueまたは狭いgrammarへ過適合した可能性は残る。E4で代表外の新規selectedと既存56件非回帰を同時に要求する必要がある。

### 2.3 華恋の意見

次はE0b REDを先に固定するべきであり、いきなりSurface文言を直すべきではない。upstream typed authorityが増えたことで、forwardとinverseが同じhelperを共有してしまう誘惑も増えている。だからE0bでgeneric-body retained-metadata、endpoint swap、direction reverse、unknown drop、overlap flatten、coverage自己認証を先に落とし、その後だけE2を許可する。

また、既存4 ownerを全面forkするとrc0027との重複が大きく、逆に既存default APIを置換するとrollback不能になる。既存4 ownerへstrict additive experiment APIだけを追加し、新runtime adapterからしか到達させない構成が最小である。

E4の`selected > 56`はbounded experiment viabilityであってformal品質ではない。formalへ進むには別authority、新run ID、security / Step 0〜9 /正式100件 / Known28 / Development42 / invalid16 / 100件全件Product Read / evidence finalizationが必要であり、100 / 100のformal gateを下げてはならない。

## 3. phaseとcheckpointの意味

| phase | 目的 | 許可する表記 | 次へ進む条件 |
|---|---|---|---|
| `D0 Impact Scope` | owner / test / resource / STOPを閉じる | `IMPACT_SCOPE_DEFINED` | Mashの明示承認 |
| `E0b Downstream RED` | downstream不足と攻撃を実装前に固定 | `E0b RED LOCKED` | REDが期待論点で失敗し、collection事故でない |
| `E2 Independent Consumption` | forward / Parser / Matcher / Gateをadditive experiment APIで同期 | `rc0028 implementation checkpoint` | E0b全GREEN、E1b非回帰、runtime disconnect |
| `E3 Representative 8` | machine + Product Read | `rc0028 representative experiment passed` | §9全条件 |
| `E4 Frozen 100` | preformal read-only viability | `rc0028 bounded experiment viable` | §10全条件 |

どのcheckpointも`rc0028 accepted`、`Cycle 001 accepted`、`formal candidate`、`production ready`を意味しない。

## 4. exact owner scope

### 4.1 条件付きMODIFYを許可する既存owner — exactly 4

| path | additive experiment responsibility | 必要性 | 不変条件 |
|---|---|---|---|
| `ai/services/ai_inference/emlis_ai_step11_grounded_lexicalization_v3.py` | successor facet / construction / participationからbody-recoverableなclosed phrase specを作るexperiment API | lexical roleをSurface側raw再解析なしで使う | 既存function、rc0027 profile選択、default出力bytesを変更しない |
| `ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py` | rc0028 experiment AST / candidate / final bytesを構成するadditive API | typed roleをforward本文へ実現する | `STEP11_CANDIDATE_VERSION_ID="nls_v3_rc_0027"`等の既存default constant / schema / APIを置換しない |
| `ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py` | final bytesだけを読むrc0028 Parser APIと、successor sourceへ独立bindingするMatcher API | forward metadata自己認証を防ぐ | forward renderer / lexicalizerのphrase選択、AST traversal、span map、coverage helperをimportしない |
| `ai/services/ai_inference/emlis_ai_step11_hard_gate_v3.py` | rc0028 Parsed Witness / Verified Binding / successor commitmentsを検査するadditive Gate / selector API | role mismatch / endpoint / unknown / overlapをhard failにする | 既存Gate failureをPASSへ変えず、既存selector / recovery / default resultを変更しない |

許可は**新しいexperiment-prefixed / rc0028-prefixed API追加だけ**である。既存APIの引数、return type、default、constant、rc0027 catalog参照、候補順、bytesを変更しない。既存API内へrc0028分岐を入れない。

experiment API内だけで必要なsuccessor importは、default call graphで実行されないlocal importに限定する。通常の`emlis_ai_step11_runtime_adapter_v3.py`をimport / 実行した時にE1b successorがtransitive runtime importされる構成を拒否する。

### 4.2 NEW owner / tool / fixture allowlist

#### services

| exact path | responsibility |
|---|---|
| `ai/services/ai_inference/emlis_ai_step11_rc0028_experiment_runtime_adapter_v3.py` | unchanged upstream planからE1b successor snapshotをbuildし、4 additive APIを一方向に呼ぶexperiment-only entrypoint。public runtimeへ接続しない |
| `ai/services/ai_inference/emlis_ai_rc0028_downstream_experiment_dependency_manifest_v3.py` | E1b manifestをparentにしたdownstream exact closure / validator |
| `ai/services/ai_inference/emlis_ai_step11_rc0028_experiment_surface_catalog_v3.py` | E0b REDで既存declarative catalogだけではclosed lexical role atomを表現できないと証明した場合だけ追加できるoptional catalog |

optional catalogを使わない場合、そのpathは存在させない。使う場合は最初の実装edit前にchange ledgerへ`CATALOG_REQUIRED`と不足atom codeを記録する。既存`emlis_ai_step11_surface_catalog_v3.py`またはStep 7 / 8 catalogを変更して代用しない。新catalogはtoken / morphology / semantic atom codeだけを持ち、完成文、case / family cue、任意topic phraseを持たない。

#### tools

| exact path | responsibility |
|---|---|
| `ai/tools/emlis_nls_v3_rc0028_downstream_experiment_dependency_manifest.py` | exact allowlistからdownstream experiment manifestを生成 / 検証する |
| `ai/tools/emlis_nls_v3_rc0028_bounded_experiment.py` | E3代表8 / E4 frozen 100を新experiment adapter経由でread-only実行し、private diagnosticとbody-free集計を分離する |

#### fixtures

| exact path | content boundary |
|---|---|
| `ai/tests/fixtures/emlis_nls_v3/cycle_001/rc0028_representative8_body_free.json` | representative ID、rc0027 baseline severity、control / improvement role、source fixture commitmentだけ。入力 / 出力本文を複製しない |
| `ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_dependency_manifest_rc0028_downstream_experiment.json` | generated downstream experiment dependency manifest。self-hashを自身へ含めず外側receiptがbindする |

#### tests

1. `ai/tests/test_emlis_nls_v3_s11_rc0028_e0b_downstream_red.py`
2. `ai/tests/test_emlis_nls_v3_s11_rc0028_e0b_downstream_mutation.py`
3. `ai/tests/test_emlis_nls_v3_s11_rc0028_e2_downstream_integration.py`
4. `ai/tests/test_emlis_nls_v3_s11_rc0028_e2_forward_inverse_independence.py`
5. `ai/tests/test_emlis_nls_v3_s11_rc0028_e2_runtime_disconnect.py`
6. `ai/tests/test_emlis_nls_v3_s11_rc0028_e3_representative8.py`
7. `ai/tests/test_emlis_nls_v3_s11_rc0028_e4_frozen100_read_only.py`
8. `ai/tests/test_emlis_nls_v3_s11_rc0028_downstream_dependency_closure.py`
9. `ai/tests/test_emlis_nls_v3_s11_rc0028_rc0027_default_behavior_regression.py`

test名、期待論点、fixture pathをE0b最初のRED実行前にmanifest change ledgerへ固定し、その後のfilesystem discovery追加を禁止する。

### 4.3 read-only input fixture / predecessor

次は既存bytesを変更せず読む。

- `ai/tests/fixtures/emlis_nls_v3/generated/batch_001.jsonl`
- `ai/tests/fixtures/emlis_nls_v3/generated/batch_001_manifest.json`
- `ai/tests/fixtures/emlis_nls_v3/generated/batch_001_coverage_matrix.json`
- `ai/tests/fixtures/emlis_nls_v3/generated/batch_001_duplicate_report.json`
- `ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_dependency_manifest_rc0027.json`
- `ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_dependency_manifest_rc0028_experiment.json`
- E1b successor source / test / tool / fixture / receipt一式
- rc0027代表8 / frozen 100のbody-free baseline countsとProduct Read severity

既存body-containing fixtureを別fixtureへ複製しない。representative fixtureはIDとcommitmentだけで既存batch rowを参照する。

## 5. byte / behavior immutable owner

### 5.1 byte immutable

次は1 byteも変更しない。

1. Step 9 manifest全20 source ownerと`emlis_ai_step9_dependency_manifest_v3.py`。
2. `emlis_ai_step10_dependency_manifest_v3.py`、Step 10 evidence / app-reachable contract。
3. `emlis_ai_step11_runtime_adapter_v3.py`。
4. `emlis_ai_step11_cycle_evidence_v3.py`。
5. `emlis_ai_step11_semantic_overlay_v3.py`、`emlis_ai_step11_planning_frontier_v3.py`、既存Step 11 surface catalog。
6. `ai/tools/emlis_nls_v3_step11_dependency_manifest.py`、既存batch / regression / cycle finalizer / receipt tool。
7. E1b predecessor v1、E1b successor accepted source / test / manifest bytes。
8. public API / reply route / DB / RN production / Safety / question / subscription / account / naming owner。
9.既存batch 001、Known28、Development42、invalid16、historical cycle evidence / Product Read artifact。

### 5.2 rc0027 behavior immutable

§4.1の4 sourceはadditive editによりfile hashが変わり得るため、source byte immutableとはしない。その代わり、既存default call graphについて次をexact回帰固定する。

- candidate version、schema、catalog hash、policy hashがrc0027と一致する。
- frozen inputに対するcandidate IDs、AST material、rendered UTF-8 bytes、Parsed Witness、Binding、Gate outcome、selection dispositionがbyte / value equivalentである。
- candidate上限12、replan 1、recovery、one-anchor、depth、selector tie-breakが一致する。
- public / shared runtimeからnew adapterへのimport / callは0件である。
- default runtimeをisolated import / executeしてもE1b successor moduleがloadされない。

default behaviorが1件でも変わる場合、additive editではなくtext-affecting successor変更であるためSTOPし、別影響範囲を提示する。

## 6. E0b RED contract

E0b testを4 ownerの最初のcode editより先に追加し、次をRED固定する。collection error、常時fail mock、`skip` / `xfail`ではなく、旧downstreamがsuccessor情報を消費できない意味論点で失敗しなければならない。

### 6.1 forward / inverse closure

1. construction instanceをcardinality ownerとして、同一semantic unitへ複数constructionが参加しても全roleを保持する。
2. effective relationごとにfrom / to exactly 2 endpointとdirectionを本文から復元・bindする。
3. coexistence refinementはsourceの`uncertain_connection / bounded_structural_inference / should`を保持し、experiment-required refinementとしてのみ実現する。
4. semantic linkをfrozen linkへ1対1 bindする。
5. source-explicit unknownをdimension、source span、affected owner、required statusまで1対1 bindする。
6. facet presenceをsemantic coverageへ昇格しない。
7. final bytesが変わればParsed Witness / Binding / Gate commitmentも変わる。

### 6.2 必須attack

- generic bodyへ置換してforward metadataだけ保持
- candidate metadata / covered IDs / generator span mapを全削除
- relation from / to swap、endpoint role swap、direction reverse
- source relation typeまたはeffective relation type mutation
- coexistence refinementをbase required relationへ偽装
- inner construction削除、overlapを一つへflatten、slot duplicate / orphan
- participation owner / range / semantic-equivalence flag mutation
- semantic link endpoint / type / direction mutation
- explicit unknown drop / duplicate / valid別dimension / affected owner order mutation
- `semantic_coverage_authorized=True`、`1`、`"false"`、unknown field、stale hash
- valid別input source owner / Evidence aliasのcross-input swap
- catalog token / atom code mutation
- forward helperをParser / Matcherへ共有するimport attack
- resource bound +1、candidate 13、replan 2
- raw body / output / source fragment / unsalted body digestのshareable material混入

各attackはclosed failure codeで落ちる。assertion削除、空集合許容、old Gate failureのseverity downgradeを禁止する。

## 7. E2 responsibility boundary

### 7.1 forward lexicalization / Surface

- inputはvalidated successor experiment snapshotと既存content / discourse authorityだけ。
- raw inputをgrammar選択のtopic辞書として再解析しない。
- construction slot、relation、unknownをclosed atom / morphologyへ投影する。
- one visible source anchorを超えない。全slotをquote / anchorとして列挙しない。
- final AST / bytesはrc0028 experiment schema / candidate versionへbindし、rc0027 default objectへ偽装しない。
- Gate後のtrim、substring replacement、追記、greeting挿入を行わない。

### 7.2 Body-only Parser

- inputはfinal UTF-8 bytesとversioned declarative experiment catalogだけ。
- candidate、AST、forward span map、source snapshot、case ID、expected text、review verdictを読まない。
- source IDを本文から復元したと主張せず、closed lexical-role / relation / unknown atomとUTF-8 rangeだけを出す。
- unknown bytes、曖昧parse、複数parse、range不正をfail-closeする。

### 7.3 Independent Matcher

- inputはParsed Witness、validated successor snapshot、frozen obligation / source authorityだけ。
- candidate AST、forward phrase spec、forward profile、generator span map、candidate-declared role / coverage / owner IDを読まない。
- atomからsource候補を独立再計算し、0件を`NO_SEMANTIC_BINDING`、2件以上を`AMBIGUOUS_SEMANTIC_BINDING`で拒否する。
- relation endpoint / direction、semantic link、explicit unknown、construction participationをsourceとexact照合する。

### 7.4 Hard Gate / selector

- final bytes、Parsed Witness、Verified Binding、source commitmentsを再検証する。
-既存20 Gateのfailure集合を減らさず、successor mismatchをadditive hard failureへする。
- `facet_present`、candidate metadata、machine selectedをsemantic / Product Read coverageとして信用しない。
- hard failureをsoft scoreで救わない。
- recoveryはsame-discourse safer ASTへ戻し、本文文字列を修理しない。

### 7.5 experiment runtime adapter

許可するcall graphは一方向である。

```text
frozen upstream + request-local Evidence
  -> E1b successor authority / witness / snapshot
  -> additive forward API
  -> final bytes
  -> additive body-only Parser API
  -> additive independent Matcher API
  -> additive Hard Gate / selector API
  -> private experiment execution
```

new adapterは`experimental_only=True`、`runtime_connected=False`、`public_owner_unchanged=True`を固定する。`emlis_ai_step11_runtime_adapter_v3.py`、reply service、API routeからnew adapterへのedgeは0件とする。

## 8. resource / determinism contract

E1bで固定した分母を使う。

- `N`: required text parent nucleus count
- `S`: admitted construction slot count、`S <= 6N`
- `R`: effective relation count、frozen Plan relation countとexact一致
- `L`: frozen semantic link count
- `X`: source-explicit unknown count

downstream追加上限:

1. visible lexical-role atom `<= S`。
2. relation endpoint binding `= 2R`。
3. semantic link binding `= L`。
4. explicit unknown binding `= X`。
5. experimental parsed / matchable atomの追加総数 `<= S + 2R + L + X`。
6. construction participationはbinding証拠であり、可視anchor数またはatom分母を増やさない。
7. candidate総数`<=12`、replan`<=1`、既存recovery / depth / one-anchor上限を変更しない。
8. 同一final bytes / source commitments / catalog hashから、AST、Parsed Witness、Binding、Gate、selectionをdeterministicに再構築する。
9. candidate list permutationでselected candidate IDを変えない。
10. parser / matcherは入力bytesと上記fixed recordsに線形なbounded処理とし、外部model、embedding、network、runtime学習、再帰的unbounded searchを追加しない。

bound超過時はtruncate、first-match勝ち、score順間引き、後勝ちをせず、candidate単位でclosed failする。分母または既存上限の拡張が必要ならSTOPする。

## 9. E3 Representative 8 gate

representative IDはbody-free fixtureにexact固定する。

- controls: `0001`, `0002`, `0009`
- former MAJOR: `0019`, `0035`, `0043`, `0063`, `0100`

IDはevaluation runnerだけが既存batch fixtureのrow解決に使い、generation ownerへ渡さない。

E3通過条件:

1. machine `8 / 8 selected`。
2. old MAJOR 5件が全て`PASS`または`MINOR`。
3. control 3件はrc0027 Product Read severityより悪化しない。
4. 8件全体で新規`MAJOR / BLOCKER = 0`。
5. relation endpoint / direction、unknown、action lifecycle、semantic distinctionのmachine attackが全GREEN。
6. exact duplicate 0、one anchor以下、generic-only required coverage 0。
7. 華恋が設計18.4の全軸で本文を読み、machine PASSを自然さの代替にしない。
8. Product Readのbody-full noteはrepo / ZIP / Libraryへ出さず、body-free severity / reason codeだけをreceipt化する。

1件でも未達ならE4を開始しない。E3本文を見てcase / family /語句専用branchを足さない。共通修正が必要ならE2へ戻り、E0b / E1b / rc0027 default回帰を再実行する。

## 10. E4 Frozen 100 read-only / preformal gate

E4は既存frozen batch 001を変更せず、新experiment adapterで全100件をread-only実行する。formal packet、formal manifest、security keyを作らない。

### 10.1 100 / 100 accounting

- input row 100 / 100をexactly 1回処理する。
- 各rowを`selected | no_valid_candidate | fail_close | valid_safety_delegation`のexactly 1 dispositionへaccountする。
- exception、missing row、duplicate execution、unaccounted rowは0。
- fixture、manifest、semantic contract、emotion、categoryを実装結果に合わせて変更しない。

### 10.2 viability criteria

1. selected数はrc0027 baseline 56を超える。
2. rc0027 selected 56件へmachine regressionを作らない。
3. representative 8以外で新規selectedが1件以上ある。
4. changed selectedとnew selectedを華恋が全件読み、`MAJOR / BLOCKER = 0`。
5. exact duplicate 0、one anchor以下、generic-only required coverage 0。
6. old Gate / security / source authority / privacy failure集合を増やさない。
7. E1b whole100 authority count（Plan relation 165、semantic unit 10、semantic link 5、source-explicit unknown 27）をlosslessにaccountする。
8. rc0027 default behavior regression、E1b、E0b、E2、Known regression対象が全GREEN。

### 10.3 acceptance非主張

E4の`selected > 56`は`rc0028 bounded experiment viable`だけを意味する。selectedでないrowが残る状態やchanged/newだけのProduct Readを、正式100件全件合格へ読み替えない。

formal candidateへ進むには、別authorityと新run IDで少なくとも次を再実行する。

- security / privacy / dependency reconciliation
- Step 0〜9全contract
- 正式100件machine 100 / 100
- Known28、Development42、invalid16
- 100件全件Product Read 100 / 100
- evidence graph / receipt finalization

formal gateの100 / 100を、E4 selected数またはchanged/new subsetで代替しない。

## 11. downstream dependency closure

downstream manifestはE1b experiment manifestをimmutable parentとして、append-onlyに作る。

必須field:

- Git baseline commit / tree
- E1b experiment manifest artifact hashと全source hash
- §4.1 modified 4 pathのpredecessor hashとcurrent hash
- §4.2 new path exact allowlist
- E0b RED predecessor test hash
- optional catalogの`present / absent` disposition
- `experimental_only=true`
- `runtime_connected=false`
- `public_owner_unchanged=true`
- `rc0027_default_behavior_equivalent=true`
- `eligible_for_formal=false`
- `eligible_for_production=false`
- canonical deterministic rebuild
- unexpected file / unbound import / forbidden reverse import 0

manifestはfilesystem discoveryでsourceを自動追加しない。generated manifest自身を自身の`file_hashes`へ含めず、外側body-free receiptがartifact hashをbindする。

既存Step 11 manifest、Step 10 manifest、cycle final evidenceを更新しない。既知Step 10 driftをdownstream manifestで正当化しない。

## 12. privacy / security / local evidence

### 12.1 E0b〜E4で許可

- repo: schema、source、test、tool、body-free representative IDs、dependency manifest
- shareable receipt: counts、closed failure / reason code、severity、source artifact hash、dependency closure、latency aggregate
- local private diagnostic: input / output本文、Parsed range、Binding detail、Product Read note

### 12.2 private diagnostic contract

- repo外の明示指定local directoryへだけ書く。
- file mode `0600`、directory mode `0700`。
- overwriteせずrun ID別append-only。
- body-full pathをstdout、traceback、body-free summaryへ出さない。
- ZIP、Git、Library、GitHubへ含めない。
- E3 / E4終了後も自動upload / external messageを行わない。

E3 / E4の実行自体にsecure keyは不要である。shareableなbody-derived永続commitment、formal HMAC、random nonce、encrypted review packetが必要になった時点でSTOPし、Mashへ具体的なlocal作業を依頼する。unsalted raw / output body digestをshareable materialへ出さない。

Supabase実ユーザーraw corpus、個人情報、private exportはE0b〜E4 scope外である。

## 13. regression / validation order

実装が明示承認された場合、次の順序を変えない。

1. `D1 Freeze`: E1b final receipt、4 owner predecessor hash、rc0027 default behavior、exact path ledgerを固定。
2. `E0b RED`: §6のtestを追加し、期待論点でREDを保存。
3. `E2a Forward`: lexicalization / Surface additive APIだけをGREEN。
4. `E2b Inverse`: Parser / Matcher additive APIをforward helper非共有でGREEN。
5. `E2c Gate`: additive Hard Gate / selectorをGREEN。既存failure非弱化を証明。
6. `E2d Adapter / Closure`: new runtime adapter、runtime disconnect、dependency manifest、default behavior regressionをGREEN。
7. `E3 Machine`: representative 8 machine。
8. `E3 Product Read`: 華恋の8件read。未達ならE2へ戻る。
9. `E4 Machine`: frozen 100 read-only / 100-accounting。
10. `E4 Product Read`: changed / new selected全件read。
11. `E4 Closure Audit`: dependency、privacy、resource、performance、forbidden workaround、default behaviorを再確認。

各text-affecting E2修正後、E1b successor、E0b、E2、rc0027 default behavior、representative 8を再実行する。E3通過前にE4を先行実行しない。

## 14. STOP条件

次のいずれか一つで停止し、影響ownerと理由をMashへ提示する。

1. Step 9 source / manifestまたはE1b predecessor / successor bytesの変更が必要。
2. §4.1以外の既存downstream source変更が必要。
3. shared runtime adapter、reply service、public API / DB / RN / Safety / question owner接続が必要。
4. rc0027 default output / Gate / selectionが1件でも変わる。
5. forwardとParser / Matcherがphrase選択、AST traversal、span map、coverage helperを共有しないとGREENにならない。
6. candidate metadata、case ID、family、expected text、review verdictをParser / Matcher / Gateへ渡さないとbindできない。
7. Plan required coverage、relation retention、semantic coverageを偽装する必要がある。
8. candidate 12、replan 1、recovery、depth、one-anchor、E1b resource denominatorの拡張が必要。
9. Gate downgrade、assertion弱化、skip / xfail、mock-only GREENが必要。
10. arbitrary phrase bank、topic dictionary、case / family-specific branch、完成文固定が必要。
11. raw / private body、source fragment、unsalted digest、secure keyをrepo / shareable artifactへ出す必要がある。
12. E3 former MAJOR 5のいずれかがMAJOR / BLOCKER、control悪化、新規MAJOR / BLOCKERが残る。
13. E4 selectedが56以下、old selected 56の回帰、representative外新規selected 0、changed/new MAJOR / BLOCKERがある。
14. E4 100件にexception / missing / duplicate / unaccounted rowがある。
15. 既知Step 10 driftの修復またはformal source / security artifactが必要になる。

STOP時にfailureを隠すためfixture、expected、severity、baseline、denominatorを変更しない。

## 15. rollback

rollback対象は次だけである。

- §4.1の4 ownerに追加したexperiment API部分
- §4.2のnew service / tool / fixture / test
- downstream experiment manifest / body-free receipt

保持するもの:

- GitHub baselineとrc0027 predecessor
- rc0027 default behavior evidence
- E1b RED predecessor、E1b successor source / tests / manifest / receipt
- E0b RED testとfailure reasonのappend-only evidence
-既存batch / historical evidence

rollback後はpublic / shared runtime diff 0、Cycle 001 `NOT_ACCEPTED`を維持する。E2失敗をE1b upstream失敗へ書き換えない。

## 16. 根拠と必要性の対応

| action | 根拠 | 必要性 |
|---|---|---|
| additive 4 ownerだけを許可 | 現rc0027でforward / inverse / Gate責任が既に分離 |全面forkとdefault置換を避ける |
| new experiment runtime adapter | shared adapterはpublic-adjacentなrc0027 owner |runtime非接続で同じend-to-end bytesを検証する |
| E0b RED先行 | E1bは情報閉包だけで本文実現を証明しない |metadata自己認証とGate弱化を実装前に固定する |
| separate downstream manifest | Step 9 / Step 10 / formal manifestはimmutable |preformal lineageを混ぜずrollback可能にする |
| E3 machine + Product Read | machine Gateは自然さを証明しない |旧MAJOR 5改善とcontrol非悪化を人間読解で確認する |
| E4 frozen 100 |代表8だけでは過適合を除外できない |old 56非回帰と代表外改善を同時確認する |
| formalを別authorityにする | E4はchanged/new subset readとselected>56のviability |securityと正式100件全件100 / 100を省略しない |

## 17. 次の明示指示案

実装へ進む場合の正確な指示案:

> 「D0 downstream影響範囲補遺を承認する。GitHub commit `31d3cf183589b27481338277574f90500f3c5b11`とE1b successor final receiptをpredecessorとして、exact 4 additive owner、new experiment runtime / manifest / tool / fixture / testだけでE0b REDを開始する。E0b GREEN後だけE2、E2 GREEN後だけE3、E3 Product Read通過後だけE4へ進む。Step 9全20 owner、rc0027 default behavior、shared runtime / public routeを不変にし、既存authority外が必要なら停止して影響範囲を提示する。」

この指示にもformal candidate、Step 10 reconciliation、production接続、Cycle 001 ACCEPTEDは含まれない。

## Appendix A. rc0027 additive-owner predecessor SHA-256

GitHub baseline `31d3cf183589b27481338277574f90500f3c5b11`で固定する。

| path | SHA-256 |
|---|---|
| `ai/services/ai_inference/emlis_ai_step11_grounded_lexicalization_v3.py` | `2207ce37b13dd98d13433721c259f9854c2e3e70d5dc579cf9661cab6c7a81aa` |
| `ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py` | `f397675a4cf88d94b40c5e4363f1ba182fe19c98becea546f06b564f43aa1ba9` |
| `ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py` | `c9cacd3112f90f8f38fb7163a52ced248af78da2670459f7f418311a848f48b0` |
| `ai/services/ai_inference/emlis_ai_step11_hard_gate_v3.py` | `6e8000b58bb9679cec4c95519fec0154fa525649f1115e9f92fa4da74e26ebe9` |

## Appendix B. immutable runtime / tool SHA-256

| path | SHA-256 |
|---|---|
| `ai/services/ai_inference/emlis_ai_step11_runtime_adapter_v3.py` | `012d09ab82ff526a9d854c845a7930eb8836e1dbd41c67428644c2c3a02bfbc7` |
| `ai/services/ai_inference/emlis_ai_step11_surface_catalog_v3.py` | `63cfd9b1677062dcfe10368b2b75aeaeba4a990f6ec1993c0b3fa9ae04a210db` |
| `ai/tools/emlis_nls_v3_step11_batch_run.py` | `9699ad86d1a3fd7df7afa54c55c4614e50d2f05ee5306e9cc4995aae66a0787c` |
| `ai/tools/emlis_nls_v3_step11_regression.py` | `b3e893a96a2bc768c8f7fcff1cc3ca35ca5d325bba7101f4aecda94448a82418` |
| `ai/tools/emlis_nls_v3_step11_cycle_finalize.py` | `a0a59442cf683630ee655dfc2099daf450ab0e6d81c45f0cf144f239a0740a90` |
| `ai/tests/fixtures/emlis_nls_v3/generated/batch_001.jsonl` | `013dd2ad1c1f446f843f400b3eb16231e8f32649e30114e70039b4cb709e8414` |
