# NLS v3 Step 11 rc0031 P3 Product Surface Owner Boundary Redesign / Read-Only Addendum

作成日: 2026-07-21 JST  
対象: `Step 11 / Cycle 001 / rc0031 / P3_PRODUCT_SURFACE_OWNER_EXPRESSION_DENSITY_AND_RECEPTION_BOUNDARY_REDESIGN_READ_ONLY`  
開始点: Cocolon `1c10c5a26644bb8c3a05e6c5f458958a94f61aed` / mashos-api `a904ba192b05ca1445e32006b64fc87e7cda48bf`  
本文境界: `BODY-FREE / SHAREABLE`  
状態: `MINIMUM OWNER BOUNDARY IDENTIFIED / COUNTERFACTUAL PRODUCT READ VIABLE / IMPLEMENTATION NOT AUTHORIZED`

## 1. 結論

前回STOPの4 concernをread-onlyで分離比較した結果、単独修正では成立せず、次の組合せが最小境界である。

```text
B5_SOURCE_GROUNDED_PROPOSITION_CLUSTER_WITH_AST_BOUND_RECEPTION
```

実装責任は4つの新ownerへ分散せず、既存exact4内の2 locusへ閉じられる。

1. `emlis_ai_step11_grounded_lexicalization_v3.py`
   - immutable base ASTのowner-connected `exact_source_span`から、Product用owner expressionを導出する。
2. `emlis_ai_step11_natural_surface_v3.py`
   - semantic atomをrelation-connected Product propositionへ集約する。
   - endpoint-specific relation groupingを行う。
   - Receptionはbase AST antecedent bindingを優先し、未表現のrequired opportunityだけを追加する。

今回の10 contextでは、E1b relation authority、Content Selection、Discourse Planner、Planning Frontier、Grounded Human Receptionの変更は必要と判定しない。Catalog / Natural Surface、Parser / Matcher、Hard Gate、runtime等の実装は一切開始していない。

## 2. frozen boundary

今回維持した分母と境界は次である。

| item | frozen value |
|---|---:|
| final candidate context | 10 |
| unique case | 8 |
| new semantic atom | 38 |
| verified base reuse | 1 |
| required / safety Reception opportunity | 11 |
| construction / relation / semantic link / explicit unknown | 22 / 13 / 1 / 2 |
| visible clauses / grammatical sentence max | 2 |
| grammatical complexity load max | 4 |
| repeated joiner / group max | 2 |
| realization unit / group max | 4 |

P1 / P2 / P3 RED、fixture、test、Catalog、production source、runtime、manifest、API、DB、RN、public / shared routeは変更していない。Cycle 001は`NOT_ACCEPTED`のままである。

current P3 testは`161,191 bytes / SHA-256 045ca06e...`でmashos-api `a904ba...`正本と一致した。今回の環境にはpytest実行moduleがないためsuite再実行結果は新規主張せず、current `15 PASS / 9 intentional RED`は既存frozen receiptから継承する。

## 3. evidence-backed owner diagnosis

### 3.1 owner expression

10 contextのclause-ready lexeme occurrenceは24件である。24 / 24件すべてについて、同じbase nucleusに結び付いた`exact_source_span` source fragmentがimmutable base AST内にexactly one存在する。

一方、current rc0030 clause-ready projectionは24 / 24件で次を固定する。

```text
referent_text == grounded_phrase_text
```

したがって、Product固有性の不足はsource authority欠落ではない。current projectionが入力根拠fragmentを使わず、既存generic phraseだけをreferentへ採用している境界にある。

必要変更ownerは新しいupstream semantic ownerではなく、existing Grounded Lexicalization末尾のProduct lexical projectionである。source fragmentから閉じた形態規則でcanonical referent / finite-clause nucleusを作り、一意に作れない場合はfail-closeする。

### 3.2 density / visibility

current 38 new atomは18 proposition unitへ分配される。7 / 10 / 8 atomの高密度contextでは、G2でdimension scopeをliftしても、relation説明とevidential endingが4 / 5 / 4 unitに残った。

B5は`one atom = one explanatory clause`を要求しない。atomはbody-onlyで別々に回収できるまま、relation-connected Product propositionへ統合する。

read-only partition:

| context | new atom | B5 cluster load |
|---|---:|---|
| 0001 | 0 + reuse 1 | reuse only |
| 0002 | 0 | none |
| 0009 | 1 | 1 |
| 0019 candidate 01 | 3 | 3 |
| 0019 candidate 02 | 3 | 3 |
| 0035 | 7 | 3 + 4 |
| 0043 candidate 01 | 3 | 3 |
| 0043 candidate 02 | 3 | 3 |
| 0063 | 10 | 3 + 4 + 3 |
| 0100 | 8 | 3 + 2 + 3 |

合計38 atomを13 Product proposition clusterへ投影でき、最大loadは4である。existing observation sentence group、visible clause、complexity、joiner、unit boundの拡張は不要である。

### 3.3 relation grouping

current E1b / rc0028 authorityは、全relation atomについてendpoint、effective type、directionを保持している。欠けているのは意味authorityではなく、人が読むendpoint expressionと、複数atomを一つのpropositionへ置くSurface groupingである。

relation変更ownerはNatural SurfaceのProduct proposition planへ置く。

- owner expressionをgeneric nounへ潰さない。
- source-to-targetをclause order / connectiveへ反映する。
- construction dimensionとrelationを同じclusterの異なる形態locusから回収する。
- 因果、診断、人格、新事実へ昇格しない。
- endpoint / direction / typeがcurrent authorityから一意導出できなければSTOPする。

E1b relation authorityの変更は今回不要である。

### 3.4 Reception boundary

current denominatorはrequired / safety source opportunity 11件である。immutable base ASTにはReception antecedent bindingが10件あり、その10件は10 opportunityを表す。0100にbase AST bindingへ未表現のadditional required opportunityが1件ある。

また2 contextでは、selected base AST bindingのtarget / supportがraw opportunityより意味的に豊かである。current rc0031 projectionはraw opportunityからtarget / supportを再構成するため、そのbindingを弱めていた。

B5の順序を次へ固定する。

1. base AST Reception antecedent bindingをselected bound Receptionのauthorityとする。
2. bindingのtarget obligation / target nucleus / antecedent / support / actを保持する。
3. required / safety opportunityのうち、base bindingに未表現のものだけをadditional predicationとして追加する。
4. exact denominatorを`10 AST-bound + 1 additional = 11`で維持する。

この順序ならGrounded Human Receptionのtarget / support / act authorityを変更しない。Product Read後も既存bindingでは入力固有性が不足する場合だけ、実装前STOPでupstream authorityを再提示する。

## 4. alternative comparison

| candidate | owner expression | density | relation readability | Reception | result |
|---|---|---|---|---|---|
| B1 expression only | repair | unchanged | endpoint genericity残存 | unchanged | insufficient |
| B2 aggregation only | generic | repair | endpoint ambiguity残存 | unchanged | insufficient |
| B3 relation only | generic | unchanged | local repair | unchanged | insufficient |
| B4 Reception only | unchanged | unchanged | unchanged | binding lossを局所修正 | insufficient |
| B5 combined | source-grounded | proposition cluster | endpoint-specific grouping | AST-first + unmatched required | viable at design read |

B5からいずれか一つを外すと、前回MAJORの共通原因が少なくとも一つ残る。B5を最小combined boundaryとする。

## 5. B5 Product contract

### 5.1 source-grounded Product lexical projection

- input word、case、family、review result、severityによるbranchを持たない。
- owner nucleusへexactly one接続されたsource fragmentだけを読む。
- content wordを保持し、closed declarative morphologyでnoun phraseまたはfinite clauseへ変える。
- raw source全体の過剰引用を避け、visible source anchor `<= 1`を維持する。
- canonical expressionが一意でない、または安全な長さへ収まらない場合はgeneric phraseへfallbackせずfail-closeする。
- body-only Parserはcandidate metadataを読まず、frozen grammarだけで形態を復元する。
- Independent Matcherはfinal witnessとimmutable source evidenceを照合する。

### 5.2 Product proposition cluster

- G2のscope-lifted family inflectionを維持する。
- exact38 atomをdrop、generic coverage、hidden marker、schema語へ逃がさない。
- clusterはrelation-connectedで、load `<= 4`とする。
- construction、relation、semantic link、explicit unknownを、同じproposition内の別predicate / modifier / connective / terminal locusから回収できる。
- existing sentence groupとresource maximaを拡張しない。
- required atomを配置できなければ`SURFACE_PLAN_DENSITY_UNSATISFIABLE`相当でfail-closeする。

### 5.3 AST-bound Reception

- selected Receptionはbase AST bindingをauthorityとする。
- raw opportunityはselected bindingを上書きしない。
- unmatched required / safety opportunityだけを追加する。
- target、support、act、scope、visible antecedentをone natural predicationへ結ぶ。
- generic stanceだけでcoverageを成立させない。

## 6. body-full private counterfactual Product Read

10 final candidate contextへB5をpaper-renderし、1 reviewerがsemantic-safetyとproduct-surfaceの2 passで確認した。2 reviewer独立一致は主張しない。

```text
candidate severity:                 PASS 4 / MINOR 6 / MAJOR 0 / BLOCKER 0
unique-case maximum severity:       PASS 2 / MINOR 6 / MAJOR 0 / BLOCKER 0
former MAJOR PASS-or-MINOR:         5 / 5
controls not worse:                 3 / 3
new MAJOR control:                  0
self-denial non-promotion:          met
relation non-regression:            met at design-specimen read
unknown non-regression:             met at design-specimen read
required-meaning non-regression:    met at design-specimen read
exact38 / reuse1 / Reception11:     accounted
```

private本文、raw input、引用、free-text note、raw SHA-256、verification keyはshareable artifactへ出していない。receiptにはlocal-only packetのHMAC commitmentだけを残す。

このreadは設計候補の存在可能性を示す。deterministic totality、production correctness、Parser / Matcher GREEN、E3 acceptance、large corpus、2 reviewer agreementは示さない。

## 7. decision / STOP boundary

decision:

```text
MINIMUM_OWNER_BOUNDARY_IDENTIFIED
COUNTERFACTUAL_PRODUCT_READ_VIABLE
IMPLEMENTATION_NOT_AUTHORIZED
```

今回、次は開始していない。

- Catalog / Natural Surface append
- Product lexical projection実装
- P3 Surface successor / dimension append実装
- Parser / Matcher / Hard Gate
- P4、runtime、dependency manifest
- E2以降
- API、DB、RN、public / shared runtime

次へ進む場合も自動実装しない。まずB5-specific REDへowner expression uniqueness、cluster exact38、AST-first Reception 10 + additional 1、resource不変、case branch 0をfreezeする別承認が必要である。そのRED freeze後だけ実装承認を判断する。

候補authority:

```text
P3_PRODUCT_SURFACE_B5_OWNER_BOUNDARY_DESIGN_FREEZE_AND_RED_ONLY
```

このauthorityが明示されるまで、production sourceとcurrent P3 REDを変更しない。
