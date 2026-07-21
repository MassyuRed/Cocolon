# NLS v3 Step 11 rc0031 P3 Surface Grammar Injectivity / Impact Design 20.3 Addendum RED Handoff

作成日: 2026-07-21 JST  
対象: `Step 11 / Cycle 001 / rc0031 / P3 Surface grammar impact design`  
P2 freeze predecessor: `9f8a816a66e75cedb6fcc09ddec00e4bf78bbb4d`  
composition GREEN predecessor: `f7caf169c36d6097a63ca389706a75eb98783116`  
前回mashos-api pre-freeze probe: `df8dcd3a672ef76f454282c4980b47272962f53e`  
今回mashos-api pre-freeze probe: `b8e6fb59710a8b7ea15c6e5f016da275d4d3c54b`  
immutable Matcher predecessor: `722,658 bytes / SHA-256 648a3a6690f8df860053c811a5416fcfc9983524e5ff880a0e6921a122a52e30`  
設計正本SHA-256: `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc`  
privacy: `BODY-FREE`  
状態: `PRE-FREEZE RED / MATHEMATICAL SURFACE GRAMMAR FEASIBLE / PRODUCTION STOP`

## 0. 結論

承認された範囲で、production sourceを変更せず、7 body dimensionを一意にできるSurface grammar候補と影響範囲を設計し、RED先行検証を行った。

結果は次のとおりである。

1. current production grammarは前回確認どおり非単射であり、`STEP11_RC0031_P3_BODY_DIMENSION_RECOVERY_NOT_INJECTIVE`のintentional REDを維持した。
2. `temporal_scope / modality / polarity / referent_scope`を、非空の自然語tokenで固定順に並べるtest-local Surface prefixは、closed domain全875通りで一意かつprefix-freeになった。
3. `observation_stage / source_role`は、現行rc0031 catalog versionが受け付けるsingleton domainをそれぞれ`normal_observation / original_input`に閉じれば、candidate metadataなしで一意に扱える。
4. `topic_fingerprint_sha256`は、本文からparseしたordered owner expressionのSHA-256列をcanonical化するbody-derived commitmentとして定義できる。representative 10 context / source semantic atom 39件では、同じfingerprintが異なるsource topic集合へ衝突した例は0件だった。
5. 39件のsource dimension authorityは、Nucleus 1-owner、Relation parent、Semantic Linkのexact relation parent、Unknown parentから一意に再構成できた。candidate-selected plan、candidate metadata、forward coverage申告は使用していない。
6. 39件のうち38件は新しいvisible prefixの対象であり、`0001`の1件はverified base reuseである。reuse atomはvisible unknown terminalから4値をすべて`unknown`へ構造導出し、stage / roleをcatalog domain、topicをowner expressionから導出するため、base body bytesを変更しない。

したがって、数学設計は成立可能である。ただし、今回の自然語tokenはimpact probe用の候補であり、商品文言のfreezeではない。実装すると38 semantic atomのfinal bytesが変わり、反復感・template感への影響があるため、production Parser / Matcherへ先行してはいけない。

今回のexact21は次になった。

```text
retained composition exact10 = 10 PASS
current body-dimension injectivity exact1 = intentional RED
proposed Surface lattice exact1 = PASS
source dimension / topic projection exact1 = PASS
source plan-set projection exact1 = PASS
final inverse availability exact7 = intentional RED
total exact21 = 13 PASS / 8 intentional RED
```

closed code:

```text
STEP11_RC0031_P3_BODY_DIMENSION_RECOVERY_NOT_INJECTIVE
STEP11_RC0031_P3_FINAL_INVERSE_NOT_AVAILABLE
```

このexact21をfreezeしてはならない。production Parser / Matcher、Matcher append、catalog production append、Natural Surface production append、P4、runtime、manifest、E2以降は開始していない。

## 1. 今回の実施境界

### 1.1 実施したこと

- GitHub mainの前回pre-freeze probeとproduction authorityを再確認
- Revised Cycle詳細設計正本を再確認
- current grammarの非単射REDを維持
- 4 visible dimensionのclosed domainとtest-local natural-language token latticeを設計
- 全875 codewordのexact round-trip、重複0、prefix collision 0を機械検証
- token deletion、slot reorder、delimiter mutation、foreign prefix、valid-value substitutionを検証
- stage / source roleのcatalog-derived singleton domainを設計
- source semantic familyごとのdimension authority ownerを設計
- ordered owner expressionだけからtopic fingerprintを再構成
- representative 10 context / source semantic atom 39件を機械検証
- `0001` exact reuseの別経路を設計
- production ownerとfreeze影響を監査
- exact21、P1 exact7、P2 exact24を回帰
- P3 test 1ファイルだけをmashos-apiへpre-freeze probeとして反映

### 1.2 実施していないこと

- rc0031 production Surface dimension catalog
- rc0031 production Surface prefix renderer
- production Parser / Matcher
- Matcher append
- current catalog v1 objectの変更
- current P2 renderer pathの変更
- P1 / P2 test変更
- fixture変更
- base surface catalog変更
- grounded lexicalization変更
- Gate、runtime、manifest変更
- public reuse API開放
- P4 / E2以降
- current exact21 freeze
- candidate metadata、candidate-selected plan、source値のParsed witnessへの転記

## 2. 確認した事実

### 2.1 production authorityは不変

| authority | bytes / SHA-256 |
|---|---|
| Natural Surface | `485,490 / ee2f4bc0ab260e8cf1ce2b87acf499e84712ed6b3e639a6a1a6a0141bd3ea520` |
| rc0031 catalog source | `19,951 / a4e8bc9753a1398571d511d5d0c1219a886c498661b3a4f702d3b20b5672c6cc` |
| Matcher predecessor | `722,658 / 648a3a6690f8df860053c811a5416fcfc9983524e5ff880a0e6921a122a52e30` |

今回変更したrepository fileは次の1件だけである。

```text
MODIFY ai/tests/test_emlis_nls_v3_s11_rc0031_forward_inverse_independence.py
```

test authority:

```text
bytes = 148,564
SHA-256 = b60f1870e3efd10fc27c55c7d9605395b583e2e3e10c0d502a9cba46a6245e92
GitHub blob = fc7814d00cd2ca717cd33c318eb44a8e7cd700fe
```

### 2.2 candidate Surface lattice

test-local grammarは次である。

```text
temporal token
+ modality token
+ polarity token
+ referent-scope token
+ 「、」
+ existing semantic item
```

closed domain:

| dimension | values | count |
|---|---|---:|
| temporal | `current_input / reported_past / intended_future / atemporal / unknown` | 5 |
| modality | `observed / reported / intended / possible / unknown` | 5 |
| polarity | `positive / negative / mixed / neutral / unknown` | 5 |
| referent | `self / other / event / action / state / relation / unknown` | 7 |

直積は`5 × 5 × 5 × 7 = 875`である。

検証結果:

```text
codeword count = 875
exact duplicate = 0
prefix collision = 0
round-trip mismatch = 0
empty token = 0
NFC/control violation = 0
```

prefixのUTF-8長は最小66 bytes、最大111 bytesだった。38 atomすべてが最大長を取る保守上限でも増分は4,218 bytesであり、既存1,000,000-byte body boundを拡張する必要はない。

### 2.3 test-local token候補

以下は一意性・impactを測るための候補であり、production文言のfreezeではない。

| dimension | value | candidate token |
|---|---|---|
| temporal | current_input | `今の入力で` |
| temporal | reported_past | `過去から` |
| temporal | intended_future | `先の時点に向けて` |
| temporal | atemporal | `時点を限らず` |
| temporal | unknown | `時点を決めず` |
| modality | observed | `見えている` |
| modality | reported | `伝えられた` |
| modality | intended | `これからに向けた` |
| modality | possible | `可能性として示された` |
| modality | unknown | `まだ確定しない` |
| polarity | positive | `明るさを帯びた` |
| polarity | negative | `重さを帯びた` |
| polarity | mixed | `異なる向きをともに含む` |
| polarity | neutral | `どちらにも寄せない` |
| polarity | unknown | `向きをまだ定めない` |
| referent | self | `自分について` |
| referent | other | `相手について` |
| referent | event | `出来事について` |
| referent | action | `行動について` |
| referent | state | `状態について` |
| referent | relation | `関係について` |
| referent | unknown | `対象を決めず` |

この候補は、値が省略されないことと機械的な一意性を証明するために置いた。自然さ、反復感、Emlisの声としての適切さは機械testが証明しない。

### 2.4 stage / source role

現行rc0031で受理するcatalog-derived domainは次に閉じる候補である。

```text
observation_stage = normal_observation only
source_role       = original_input only
```

`pre_question_observation / refined_observation / supplemental_answer`は現行catalogでは拒否する。将来stageを同じcatalogへ暗黙追加せず、別catalog versionまたは別の明示的なvisible grammarを必要とする。

Parserがこの2値を出す場合、field originは`catalog_domain`であり、`body_token`と偽ってはならない。Matcherはsource stage / roleがsingleton domainとexact一致するかを別に確認する。

### 2.5 source dimension authority

candidate metadataを使わず、source atom familyごとに次からdimensionを再構成した。

| family | source authority |
|---|---|
| construction | exact one owner aliasに対応するNucleus |
| relation | successor relation authorityが指すexact parent Relation |
| semantic_link | `source_semantic_link_id`とexact一致するparent Relation |
| explicit_unknown | exact parent Unknown。4 visible dimensionはすべて`unknown` |

各source objectから`source_role / polarity / modality / temporal_scope / topic_scope_ids`を取得し、referentはNucleusの値、Relationは`relation`、Unknownは`unknown`とした。

representative結果:

```text
context source atom counts = 1 / 0 / 1 / 3 / 3 / 7 / 3 / 3 / 10 / 8
total source semantic atom = 39
dimension-prefixed atom = 38
verified base reuse atom = 1
authority resolution 0 / 2+ = 0
```

観測されたdimension domain:

```text
polarity = positive / negative / mixed / neutral / unknown
modality = observed / reported / intended / possible / unknown
temporal = current_input / reported_past / unknown
referent = event / state / action / relation / unknown
```

未出のfuture値も875-latticeのclosed domainでは検証したが、representative evidenceがあると誤記しない。

### 2.6 topic fingerprint

Parsed側にsource topic IDを入れない。bodyからparseしたordered owner expressionについて、raw textそのものではなく各expressionのSHA-256を次のcanonical materialへ入れ、全体をSHA-256にする。

```json
{
  "schema_version": "cocolon.emlis.nls_v3.step11.rc0031_body_topic_projection.v1",
  "owner_expression_sha256": ["<sha256>"]
}
```

これは署名ではない。発行元認証、forward申告の信頼、plan選択には使わない。

representative 10 contextでは次だった。

```text
same body-derived fingerprint -> different source topic set = 0
full semantic signature collision within one context = 0
```

full semantic signatureは次で比較した。

```text
semantic family / key / direction
+ topic fingerprint
+ polarity / modality / temporal scope / referent scope
```

この結果はrepresentative内の成立証拠であり、将来100件・1000件で衝突しない保証ではない。Matcherは衝突時にtopic IDを推測せず、0 / 2+としてfail-closeする必要がある。

### 2.7 0001 exact reuse

`0001`のsource semantic atom 1件は`explicit_unknown / explicit_cause_unknown`であり、base bodyのexact reuseを維持する。

このatomでは新しいprefixをbase bodyへ付けない。

```text
polarity       = unknown
modality       = unknown
temporal_scope = unknown
referent_scope = unknown
```

4値はvisible unknown terminalのclosed grammarから構造導出し、stage / roleはcatalog singleton、topic fingerprintはbase parsed owner expressionから導出する。source値をParsed witnessへ転記しない。

### 2.8 attack結果

| attack | result |
|---|---|
| first token deletion | unparseable |
| temporal/modality slot reorder | unparseable |
| delimiter mutation | unparseable |
| foreign prefix injection | unparseable |
| valid polarity token substitution | parseは別値、source exact comparisonで不一致 |
| owner expression transplant | topic fingerprint mismatch |
| pre-question/refined stage | current catalog domain外 |
| supplemental-answer role | current catalog domain外 |

hashを再計算しても意味値またはowner expressionが変わればsource exact comparisonは一致しない。hash自体を署名として信用しない。

## 3. production impact設計

### 3.1 最小のowner構成

productionへ進む場合も、P2既存挙動を上書きする必要はない。最小案は次である。

1. `emlis_ai_step11_rc0031_experiment_surface_catalog_v3.py`
   - current v1 catalog objectと先頭19,951 bytesをimmutable predecessorとして維持する。
   - P3 dimension catalog v1を同じfile末尾へappendする。
   - stage/role singleton、4 token map、fixed order、delimiter、topic material schema、resource boundを所有する。
2. `emlis_ai_step11_natural_surface_v3.py`
   - current P2 renderer pathを変更しない。
   - P3 successor composer / source-dimension projector / prefix rendererをappendする。
   - existing P2 candidateを入力authorityの一部として再利用しても、candidate metadataをcoverage根拠にしない。
3. `test_emlis_nls_v3_s11_rc0031_forward_inverse_independence.py`
   - current predecessor segment hashを固定したまま、append-only production ownerのRED/GREENを追加する。
   - current exact10はP2 behavior regressionとして保持する。

この構成なら、P1 test、P2 test、fixture、base surface catalog、grounded lexicalizationを変更せずに進められる見込みである。

### 3.2 後続owner

Surface prefixがGREENになった後の別承認でのみ、次を開始できる。

- `emlis_ai_step11_natural_surface_matcher_v3.py`へのP3 Body-only Parser / Independent Matcher append
- preliminary Parsed / Verified schemaのproduction化
- final round-trip exact7のGREEN化

今回これらは開始していない。

### 3.3 変わるもの

- P3 successor candidateのfinal bytes
- rc0031 catalog source file bytes / SHA-256。ただしcurrent v1 objectとpredecessor prefixは不変にできる。
- Natural Surface source file bytes / SHA-256。ただしcurrent P2 pathとpredecessor segmentsは不変にできる。
- P3 test bytes / SHA-256

### 3.4 変えないもの

- P2 freeze commit identity
- current P2 catalog v1 object / artifact hash
- current P2 renderer behavior
- P1 / P2 test file
- representative fixture
- base surface catalog
- grounded lexicalization
- Matcher predecessor
- closed code policy
- control / attack denominators
- source semantic denominator 39
- parsed予定atom 38
- verified base reuse 1
- Reception 11
- forward resource `4 / 2 / 4 / 2`
- 0063 `S=10 / R=1 / exact reuse=0`
- body max 1,000,000 bytes

## 4. exact21とregression

### 4.1 exact21

```text
21 collected
13 PASS
8 intentional RED
elapsed 371.03s
```

intentional RED:

```text
1 × STEP11_RC0031_P3_BODY_DIMENSION_RECOVERY_NOT_INJECTIVE
7 × STEP11_RC0031_P3_FINAL_INVERSE_NOT_AVAILABLE
```

### 4.2 P1 / P2

```text
P1 exact7 = 1 PASS / 6 intentional RED in 94.28s
P2 exact24 = 23 PASS / 1 historical path-scope RED in 434.04s
```

P2 historical code:

```text
STEP11_RC0031_P2_PATH_SCOPE_INVALID
```

## 5. 推測

以下は確認済み事実ではなく、次のproduction候補に関する推測である。

1. append-only P3 successorなら、P2 current pathを壊さずにvisible dimension grammarを追加できる可能性が高い。
2. 4値prefixは数学的には成立するが、38 atomへ繰り返すと実際の本文で冗長さやtemplate感が出る可能性がある。
3. exact tokenをsemantic familyごとに自然に屈折させても、canonical semantic valueが一つであり、全variantをcatalogがclosedに所有し、Parserがexactに逆解析できるなら、同じ数学contractを保てる可能性がある。
4. family別の自然化がrealization alternativesを増やし、同じsource valueから複数bodyが出る設計になる場合は、現行`realization_alternatives_per_semantic_key = 1`と衝突する可能性がある。
5. representativeではtopic fingerprint衝突0だったが、大量sampleでは同じowner表現が別topic集合へ対応するcaseが現れる可能性がある。その場合はtopic ID転記やcandidate metadataで救わず、visible owner grammarまたはsource topic設計へ戻る必要がある。

## 6. 華恋の意見

数学設計は成立したので、current grammarの非単射を理由にP3全体を諦める必要はない。一方で、875通りが一意だからといって、そのままのtoken列がEmlisの自然な声になるとは限らない。

次はproduction Parser / Matcherではなく、append-onlyのP3 Surface successorを最小実装し、まずfinal bytes上で38 atomが本当に一意復元できることと、P2 behaviorが不変であることをGREENにするのが妥当である。その時点で本文を華恋が読み、反復感が強ければtokenの自然化へ戻るべきである。

source値をParsed witnessへ転記すること、candidate-selected planで一意性を作ること、hashを署名として扱うことには引き続き反対する。

また、P2 freeze commitは履歴上immutable predecessorとして維持すべきである。current P2関数を直接書き換えるより、同じproduction owner fileへP3 successorをappendし、P2 pathを回帰として残す方が境界が明確である。

## 7. 根拠と必要性

### 7.1 Surface prefixの根拠

- current 42 profileは4 dimensionすべてを可視化するprofileが0だった。
- default値を空tokenにすると省略と値の区別ができない。
- 4 fieldをすべて非空tokenとし、固定順で出せば875直積がexactに一意になった。
- prefix-freeであればParserはsemantic item先頭からexact-oneで復元できる。

### 7.2 Surface prefixの必要性

- current bodyからsource値を一意に復元できないままParserを実装すると、source転記または推測になる。
- source転記はBody-only Parserの独立性を壊す。
- schemaを先にfreezeすると、visible grammar改訂後にfield semanticsを壊す。

### 7.3 source projectionの根拠

- 39 atomすべてがNucleus / Relation / Semantic Link parent / Unknownのexact authorityへ1件で解決した。
- topic fingerprintは本文から得たowner expressionだけで計算した。
- same fingerprintから異なるtopic集合への衝突はrepresentativeで0だった。

### 7.4 append-only impact設計の必要性

- P2 freezeを直接書き換えると、predecessorとsuccessorの境界が曖昧になる。
- current catalog v1とP2 renderer behaviorは、P3の回帰authorityとして残せる。
- new fileを増やすより同じowner fileへappendすれば、P1/P2 path scopeを拡張せずに済む。
- P3 testだけでpredecessor prefixとsuccessor appendを同時に検証できる。

## 8. STOP境界

今回、次をfreezeまたは開始していない。

- current exact21
- candidate token wording
- P3 dimension catalog
- P3 Surface successor composer
- preliminary Parsed / Verified schema
- production Parser / Matcher
- Matcher append
- P4
- runtime
- manifest
- E2以降

production source変更には別の明示承認が必要である。

## 9. 次の承認候補

次へ進む場合は、production Parser / Matcher承認ではなく、次を推奨する。

> P2 freeze commit `9f8a816a66e75cedb6fcc09ddec00e4bf78bbb4d`とcomposition GREEN predecessor `f7caf169c36d6097a63ca389706a75eb98783116`をimmutable predecessorとして維持する。current P2 catalog v1 object、current P2 renderer path、P1/P2 test、fixture、base catalog、grounded lexicalization、Matcher predecessor、closed code、control、attack、resource、denominatorは変更しない。`emlis_ai_step11_rc0031_experiment_surface_catalog_v3.py`と`emlis_ai_step11_natural_surface_v3.py`の末尾へ、P3 dimension catalogとP3 Surface successorをappendするRED/GREEN作業を開始してよい。4 visible dimensionはnon-empty fixed-order prefix、stage/source roleはcurrent singleton catalog domain、topicはbody-derived owner-expression commitmentとする。candidate metadata、candidate-selected plan、source値転記、hash-as-signatureは使用しない。まずcurrent P2 behavior不変と38 atomのround-tripをGREENにし、本文読感に問題があればSTOPする。production Parser / Matcher、Matcher append、P4、runtime、manifest、E2以降は開始しない。

この承認後も、Surface successorがGREENになるまでParser / Matcherへ進まない。

## 10. Mashにお願いする作業

現時点でMashのPC操作は不要である。

今回のtestと本補遺は華恋がGitHubへ反映する。GitHub反映に成功した場合、ZIPは作成しない。
