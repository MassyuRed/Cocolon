# NLS v3 Step 11 rc0031 P3 Product Surface Grammar Design 20.3 Addendum / Product Read STOP

作成日: 2026-07-21 JST  
対象: `Step 11 / Cycle 001 / rc0031 / P3 Product Surface grammar design + Product Read only`  
Cocolon開始点: `a7f6f9f76e67ebe20662be527e8ce67a9858b19c`  
mashos-api開始点: `a904ba192b05ca1445e32006b64fc87e7cda48bf`  
mashos-api結果commit: `a904ba192b05ca1445e32006b64fc87e7cda48bf`（変更なし）  
P2 immutable predecessor: `9f8a816a66e75cedb6fcc09ddec00e4bf78bbb4d`  
privacy: `BODY-FREE`  
状態: `DESIGN MAPPING ESTABLISHED / PRODUCT READ STOP / IMPLEMENTATION NOT AUTHORIZED`

## 0. 結論

承認範囲どおり、Catalog / Natural Surface実装へ進まず、38新規semantic atomのProduct Surface grammarを設計し、10 final candidate contextをbody-full private境界でProduct Readした。

固定4-slot bundleは採用しなかった。選択した設計候補`G2`は、共通次元を文・sentence groupへscope-liftし、残る次元をfamily、grammatical role、既存predicate nucleus、finite endingへ分散する。

body-only recoveryの設計写像については、次を成立させられる。

- schema名やfield名を商品本文へ出さない。
- candidate metadata、candidate-selected plan、source ID転記を使わない。
- observation stage / source roleはversion-fixed singleton domainから導出する。
- topicはvisible owner-expression列から導出する。
- explicit unknownはvisible unknown terminalから4値を構造導出する。
- 38 atomへ完全な固定slot列を反復しない。

しかしProduct Readは成立しなかった。

```text
candidate severity: PASS 1 / MINOR 2 / MAJOR 7 / BLOCKER 0
case max severity:  PASS 1 / MINOR 2 / MAJOR 5 / BLOCKER 0
former MAJOR PASS-or-MINOR: 0 / 5
controls not worse: 3 / 3
```

schema-free、内部schema非露出、candidate metadata不要は成立候補を得た一方、非template性、main meaning保持、relation可読性、depth fitは成立しなかった。よって`STOP_AT_PRODUCT_SURFACE_GRAMMAR_DESIGN`とし、Catalog / Surface append、Parser / Matcher、P4、runtime、manifest、E2以降へ進まない。

## 1. 凍結した開始条件

開始時にGitHub正本を再確認し、次を固定した。

| owner | current authority |
|---|---|
| Cocolon | `main@a7f6f9f76e67ebe20662be527e8ce67a9858b19c` |
| mashos-api | `main@a904ba192b05ca1445e32006b64fc87e7cda48bf` |
| rc0031 Catalog | `19,951 bytes / a4e8bc9753a1398571d511d5d0c1219a886c498661b3a4f702d3b20b5672c6cc` |
| Natural Surface predecessor | `485,490 bytes / ee2f4bc0ab260e8cf1ce2b87acf499e84712ed6b3e639a6a1a6a0141bd3ea520` |
| P3 test authority | `161,191 bytes / 045ca06eabbff7c6d902174ecf84db75d67b21e27ce9956726467f7d19c36860` |
| Matcher predecessor | `722,658 bytes / 648a3a6690f8df860053c811a5416fcfc9983524e5ff880a0e6921a122a52e30` |

P1 / P2 / P3の開始時状態は変更していない。

```text
P1 exact7:  1 PASS / 6 intentional RED
P2 exact24: 23 PASS / 1 historical path-scope RED
P3 exact24: 15 PASS / 9 intentional RED
```

## 2. denominatorとsource authorityの再確認

representative 10 contextの分母は次のままである。

```text
new visible atom per context = 0 / 0 / 1 / 3 / 3 / 7 / 3 / 3 / 10 / 8
new visible atom total       = 38
verified base reuse          = 1
Reception binding            = 11
maximum new atom per context = 10
```

38新規atomのfamily内訳:

| family | count |
|---|---:|
| construction | 22 |
| relation | 13 |
| semantic_link | 1 |
| explicit_unknown | 2 |

観測されたbody dimension内訳:

| dimension | body-free distribution |
|---|---|
| temporal scope | `current_input 33 / reported_past 1 / unknown 4` |
| modality | `observed 7 / reported 9 / intended 9 / possible 4 / unknown 9` |
| polarity | `positive 1 / negative 16 / mixed 7 / neutral 12 / unknown 2` |
| referent scope | `state 11 / action 9 / event 2 / relation 14 / unknown 2` |

familyと4可視次元のprofileは23種だった。source authorityはcandidate metadataを使わず、Nucleus / Relation parent / Semantic Link exact parent / Unknown parentから再構成した。

## 3. 候補比較

### 3.1 G0: fixed 4-slot prefix

前工程の875 codeword候補である。機械的なinjectivity / prefix-freeは成立するが、最大10回/candidateで完全bundleが反復し得る。Product設計候補から除外した。

### 3.2 G1: per-atom distributed inflection

各atom内でtemporal / modality / polarity / referent scopeを別々の自然語fragmentへ置く候補である。slot名は消えるが、同じdeictic、evidential、polarity fragmentがatom数だけ反復する。body-full化前の設計screenで除外した。

### 3.3 G2: scope-lifted family inflection

Product Read対象に選んだ候補である。

1. 共通temporal cueは、同じ値を持つatom群を支配する最小sentence / sentence groupへ1回だけ置く。
2. local temporal overrideだけを各predicateへ置く。
3. modalityはfinite predicate endingへ屈折する。
4. polarityはpredicate voiceへ屈折する。neutralはclosed zero allomorphとする。
5. constructionのreferent scopeはstate / action / event headとgrammatical roleで表す。
6. relation / semantic linkは二endpointとdirectional connective自体から`relation`を構造導出する。
7. explicit unknownはterminalがfamilyとkeyを一意にし、4可視次元をすべて`unknown`へ構造導出する。
8. semantic key / directionの既存predicate nucleusを削除せず、dimension表現より主節側へ置く。

完全な4-slot bundleは0件であり、次元の共通scopeとlocal overrideが明示された文法木だけをbody-only recoveryへ使う。

## 4. G2 recovery contract

### 4.1 dimension authority

| dimension | recovery authority | Product Surface上の扱い |
|---|---|---|
| observation_stage | catalog version singleton | 本文へfield名を出さない |
| source_role | catalog version singleton | 本文へfield名を出さない |
| temporal_scope | scoped deictic / tense morphology | group inheritance + local override |
| modality | finite predicate morphology | observed / reported / intended / possible / unknown ending |
| polarity | predicate voice | positive / negative / mixed / neutral-zero / unknown |
| referent_scope | family + grammatical head / endpoint structure | constructionはstate/action/event、relation系はstructural、unknownはterminal |
| topic_fingerprint_sha256 | normalized visible owner-expression sequence | raw topic IDやsource IDを本文へ出さない |

### 4.2 family grammar

| family | mandatory nucleus | dimension inflection locus | owner recovery |
|---|---|---|---|
| construction | construction-key固有predicate lemma | scope head + finite ending + voice | visible owner phrase 1件 |
| relation | relation-key固有directed predicate | relation predicate + local tense/evidential/voice | source / target endpoint order |
| semantic_link | link-key固有directed connective | connective + finite ending + voice | source / target endpoint order |
| explicit_unknown | unknown-key固有terminal | terminalから4値unknownをderive | visible owner coordination |

### 4.3 body-only / privacy boundary

許可:

- final UTF-8 bytes
- version-fixed grammar catalog
- visible owner expression
- grammatical scope / finite morphology / endpoint order
- source-authoritative comparisonをMatcher内部で行うこと

禁止:

- candidate metadata
- forward plan、coverage申告、candidate-selected discourse plan
- source ID / topic ID / dimension valueの本文転記
- hash-as-signature
- case / family / input word / review resultによるruntime branch
- private body、raw input、body-full noteのshareable artifact化

## 5. 設計成立確認

body-full specimenを作る前に、exact 38 source rowへG2 ruleをread-only投影した。

| check | result |
|---|---:|
| new semantic atom | `38 / 38 covered` |
| observed profile | `23 / 23 covered` |
| fixed complete 4-slot bundle | `0` |
| candidate metadata read | `0` |
| source ID / dimension field visible transfer | `0` |
| internal schema term in Product Surface | `0` |
| verified base reuse rewrite | `0` |
| visible source anchor | `<= 1 / candidate` |
| final-body exact duplicate in design specimens | `0` |

これはG2の文法写像候補がexact 38を表現できることの確認であり、production Parser / Matcher GREEN、Product承認、large-corpus totalityの証明ではない。

## 6. body-full private Product Read

### 6.1 review境界

- final candidate context 10件を対象にした。
- inputとG2 paper-rendered final bodyをprivate local packetで照合した。
- 設計18.4の12軸を、semantic-safety passとproduct-surface passへ分けて読んだ。
- reviewer identityは1名であり、2 reviewer独立一致は主張しない。
- private body、引用、free-text review note、raw SHA-256はshareable artifactへ出していない。
- body-free receiptはcase ID、severity、axis、reason code、count、key非公開HMAC commitmentだけを持つ。

### 6.2 result

| candidate role | result |
|---|---:|
| control candidate | `PASS 1 / MINOR 2 / MAJOR 0 / BLOCKER 0` |
| former-MAJOR candidate context | `MAJOR 7` |
| all candidate context | `PASS 1 / MINOR 2 / MAJOR 7 / BLOCKER 0` |
| unique case max | `PASS 1 / MINOR 2 / MAJOR 5 / BLOCKER 0` |

non-regression:

```text
controls not worse                  = 3 / 3
former MAJOR PASS-or-MINOR          = 0 / 5
self-denial non-promotion           = met
unknown non-regression              = met
relation non-regression             = not met
required-meaning non-regression     = not met
unresolved MAJOR                    = 5 cases / 7 candidate contexts
```

## 7. Product Readで判明した共通原因

### 7.1 fixed slot以外の制約

G2により完全slot反復とschema語は消せたが、次は残った。

1. visible owner expressionが抽象的で、入力中の具体的な対象・行動・順序へ戻れない。
2. 7〜10 atom contextでは、evidential endingとrelation説明がscope-lift後も集中する。
3. relation nucleusがgeneric owner同士を結ぶため、directionが機械的に正しくても人には別関係として読める。
4. Receptionは今回の38-atom grammar ownerではなく、複数のformer-MAJORで入力固有のthought / stateへ結び付かない。
5. semantic atomを減らさずに語だけ自然化すると、主意味より説明tailが強くなる。

### 7.2 今回の設計だけで閉じない理由

単語の差し替えだけで閉じると、case cue、family cue、review cue、固定文bank、fallbackへ向かう。これらは禁止境界である。

成立させるには、少なくとも次のどれをauthorityとして変更するか、別のread-only設計判断が必要である。

- source-grounded owner expressionの具体性
- multiple atomのsemantic aggregation / visibility obligation
- relationを人が読む単位へ分割・統合する責任
- Reception target / supportの入力固有binding
- depthとatom密度の整合

これはCatalog文言だけの問題ではない可能性が高い。今回の承認で上流ownerやReceptionを変更しない。

## 8. STOP境界

次を開始・変更していない。

- rc0031 Catalog
- Natural Surface / P3 successor / dimension append
- Parser / Matcher / final inverse
- P1 / P2 / P3 test、fixture
- P4 / Gate / selector
- runtime / dependency manifest
- E2以降
- API / DB / RN / public / shared route

Product Read不成立のため、Catalog / Surface appendの実装承認候補を出さない。実装へ自動進行せず、current P3 machine REDも変更しない。

## 9. 次のauthority候補

作業を続ける場合は、実装承認ではなく、次の別承認が必要である。

> `P3_PRODUCT_SURFACE_OWNER_EXPRESSION_DENSITY_AND_RECEPTION_BOUNDARY_REDESIGN_READ_ONLY`として、generic owner expression、multiple-atom visibility、relation grouping、Reception bindingのどこを変更ownerにするかをread-onlyで比較する。production source、Catalog / Surface、Parser / Matcher、P4、runtime / manifest、API / DB / RNを変更しない。current 38 / reuse 1 / Reception 11、resource、P1 / P2 / P3 REDを維持し、成立するowner境界が見つからなければSTOPする。

この候補は今回の承認を拡張しない。明示承認があるまで開始しない。

## 10. Mashにお願いする作業

現時点でMashのPC操作は不要である。GitHub反映と反映後確認に成功した場合、ZIPは作成しない。
