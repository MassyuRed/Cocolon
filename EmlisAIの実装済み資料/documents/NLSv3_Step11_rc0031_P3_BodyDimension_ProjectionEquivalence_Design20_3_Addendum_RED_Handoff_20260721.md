# NLS v3 Step 11 rc0031 P3 Body-Dimension / Projection-Equivalence Design 20.3 Addendum RED Handoff

作成日: 2026-07-21 JST  
対象: `Step 11 / Cycle 001 / rc0031 / P3 final Body-only Parser + Independent Matcher`  
composition GREEN predecessor: `f7caf169c36d6097a63ca389706a75eb98783116`  
immutable Matcher predecessor: `722,658 bytes / SHA-256 648a3a6690f8df860053c811a5416fcfc9983524e5ff880a0e6921a122a52e30`  
前回pre-freeze probe: `82bfbf15d93dfcf865c99c11fa24b517c2396074`  
今回mashos-api pre-freeze probe: `df8dcd3a672ef76f454282c4980b47272962f53e`  
設計正本SHA-256: `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc`  
privacy: `BODY-FREE`  
状態: `PRE-FREEZE RED / PLAN PROJECTION FEASIBLE / BODY DIMENSION NON-INJECTIVE / STOP BEFORE PRODUCTION`

## 0. 結論

承認された範囲で、production sourceを変更せずに設計補遺とRED改訂を行った。

結果は二つに分かれた。

1. source-authoritative `discourse_plan_set`との照合は、plan identityを正解として数えず、body-relevant verified solutionの同値類を数える設計なら、representative 10 contextすべてでexact-oneが成立した。
2. current final bytesとcurrent catalogから、`observation_stage / source_role / polarity / modality / temporal_scope / topic fingerprint / referent_scope`の7次元をすべて一意に復元する契約は成立しなかった。現行可視文法が複数のsource次元値を同じ可視phraseへ写すため、数学的に非単射である。

したがって、前回補遺の「planが複数残るためexact-one設計自体がblocker」という評価は、次のように訂正する。

```text
plan identity exact-one                 = 不成立、採用しない
body-relevant verified solution exact-one = 成立、10 / 10 context
7 body dimensions full recovery          = 不成立、current grammarが非単射
```

今回のexact19は次になった。

```text
retained composition exact10 = 10 PASS
body-dimension injectivity exact1 = intentional RED
source plan-set projection exact1 = PASS
final inverse availability exact7 = intentional RED
total exact19 = 11 PASS / 8 intentional RED
```

closed code:

```text
STEP11_RC0031_P3_BODY_DIMENSION_RECOVERY_NOT_INJECTIVE
STEP11_RC0031_P3_FINAL_INVERSE_NOT_AVAILABLE
```

このexact19をfreezeしてはならない。production Parser / Matcher、Matcher append、catalog production変更、current exact19 freeze、P4、runtime、manifest、E2以降は開始していない。

## 1. 今回の実施境界

### 1.1 実施したこと

- GitHub mainのGREEN predecessorとpre-freeze probeを再確認
- Matcher predecessor `722,658 bytes`のSHA-256再確認
- Revised Cycle詳細設計正本のSHA-256再確認
- current rc0031 renderer、rc0031 catalog、base declarative surface catalog、source authorityを全体監査
- 7 body dimensionの可視写像が単射かをproduction不変で機械検証
- canonical `discourse_plan_set`全体を再検証し、各planを同一規則でbase witnessへ照合
- plan identityを除いたbody-relevant verified projection同値類を機械検証
- plan subset、reorder、duplicate、structural-signature mutationをfail-close検証
- preliminary Parsed semantic atom schemaへ7 dimension field候補を明示
- exact19、P1 exact7、P2 exact24を回帰実行
- test 1ファイルだけをmashos-apiへpre-freeze probeとして反映

### 1.2 実施していないこと

- rc0031 production Parser / Matcher
- Matcher append
- Natural Surface production変更
- catalog production変更
- fixture変更
- P1 / P2 sourceまたはtest変更
- Gate、runtime、manifest変更
- public reuse API開放
- P4 / E2以降
- current exact19のfreeze
- candidate metadata、candidate-selected plan、surface-realization planの使用

## 2. 確認した事実

### 2.1 authorityと不変境界

| authority | exact value |
|---|---|
| composition GREEN predecessor | `f7caf169c36d6097a63ca389706a75eb98783116` |
| previous pre-freeze probe | `82bfbf15d93dfcf865c99c11fa24b517c2396074` |
| current pre-freeze probe | `df8dcd3a672ef76f454282c4980b47272962f53e` |
| Natural Surface | `485,490 bytes / SHA-256 ee2f4bc0ab260e8cf1ce2b87acf499e84712ed6b3e639a6a1a6a0141bd3ea520` |
| Matcher predecessor | `722,658 bytes / SHA-256 648a3a6690f8df860053c811a5416fcfc9983524e5ff880a0e6921a122a52e30` |
| rc0031 catalog source | `19,951 bytes / SHA-256 a4e8bc9753a1398571d511d5d0c1219a886c498661b3a4f702d3b20b5672c6cc` |
| rc0031 catalog artifact | `bc3aa6217df6d62d4e867b6958d8b95a8ff2c769f33bf7066987f7875efa5287` |
| base surface catalog artifact | `1beec18839ed77abd1e52b0a06eb60c5867223fd54183c251a8f0efbc37ccc08` |
| Revised Cycle design authority | `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc` |

今回変更したrepository fileは次の1件だけである。

```text
MODIFY ai/tests/test_emlis_nls_v3_s11_rc0031_forward_inverse_independence.py
```

test authority:

```text
bytes = 127,123
SHA-256 = bafb733721fa846a3a22b72c896fc0cf06a0b92fe6ced0a87a5868ba94ab690c
GitHub blob = b849dd8e45918b6138fb741329c24d99f3957926
```

### 2.2 source側にある7次元候補

source authorityには次が存在する。

- source snapshotの`observation_stage`
- source snapshotの`semantic_source_roles`
- obligationの`polarity`
- obligationの`modality`
- obligationの`temporal_scope`
- obligationの`topic_scope_ids`
- obligationの`referent_scope`
- obligationの`evidence_ids`
- obligationの`source_refs`

ただし、source側に値があることは、Body-only Parserがfinal bytesから同じ値を復元できることを意味しない。

### 2.3 current rc0031 renderer/catalogに7次元keyがない

rc0031 Natural Surface append領域には、次の描画key参照が0件である。

```text
observation_stage
source_role / semantic_source_roles
polarity
modality
temporal_scope
topic_scope
referent_scope
```

current rc0031 catalogにも次のproduction contractは存在しない。

```text
STEP11_RC0031_EXPERIMENT_BODY_DIMENSION_RECOVERY_CONTRACT
```

したがって、current rc0031追加predicate morphologyだけから7次元を復元することはできない。

### 2.4 base declarative grammarの可視性

base declarative surface catalogには42 profileがある。可視fieldの実測は次である。

| field | visible profile / 42 |
|---|---:|
| `polarity` | 15 |
| `modality` | 5 |
| `temporal_scope` | 4 |
| `referent_scope` | 0 |
| 4 fieldすべてvisible | 0 |
| 4 fieldすべてnon-visible | 23 |

`event_continuation` profileは次の条件だけで選ばれる。

```text
nucleus_kind = event
attribute code = operator:continuation
visible feature = nucleus_kind only
```

representative `0035` final bytesには、このprofileの可視phraseが実在することを本文非出力で確認した。

同じprofile条件と同じ可視projectionに、少なくとも次の異なるsource dimension tupleが残る。

```text
(positive, observed, current_input, event)
(negative, reported, reported_past, event)
```

したがって、polarity、modality、temporal scopeはこの可視phraseから一意に復元できない。

さらに`constraint_possible` profileは、同じ可視phraseへ`possible`と`unknown`の二つのmodalityを許すが、`modality`をvisible fieldにしていない。これは直接的な非単射例である。

一方、`action_completed`と`action_intended`はlifecycle projectionによりmodality / temporal scopeを可視化するcontrolになる。つまり、全profileが復元不能なのではなく、現行grammarのprofileごとに可視性が不均一であり、7次元全体のtotal functionが成立しない。

### 2.5 7次元ごとのcurrent判定

| dimension | current body-only判定 | 根拠 |
|---|---|---|
| `observation_stage` | 不成立 | representativeではsource側がnormalでも、body cueではない |
| `source_role` | 不成立 | representativeではoriginal_inputでも、body cueではない |
| `polarity` | 非単射 | visible 15 / 42、`event_continuation`で欠落 |
| `modality` | 非単射 | visible 5 / 42、`constraint_possible`が2値を同一phraseへ写す |
| `temporal_scope` | 非単射 | visible 4 / 42、`event_continuation`で欠落 |
| `topic_fingerprint` | 未定義 | source topic IDをbodyから復元できない |
| `referent_scope` | 条件付き構造導出候補 | family + single visible nucleus kindからのmapping候補のみ |

`observation_stage`と`source_role`は、catalog versionが受理するdomainを明示し、それ以外を拒否する設計なら条件付きで扱える可能性がある。しかし、それはbody phraseからの復元ではなくversion-fixed grammar domainの宣言であるため、Parser fieldの由来を明記しなければならない。

`topic_fingerprint`はsource IDをParsed witnessへ入れない。body-derived owner expression commitmentからcanonical fingerprintを作り、Matcher内部でsource topic authorityへbindする設計候補だけが残る。

### 2.6 plan identityとsolution identityは別である

canonical `discourse_plan_set`内でbase bodyへ適合するraw plan数は次である。

| context | source plans | compatible plans | body-relevant solution classes |
|---|---:|---:|---:|
| `0001` | 1 | 1 | 1 |
| `0002` | 1 | 1 | 1 |
| `0009` | 8 | 4 | 1 |
| `0019-A` | 2 | 1 | 1 |
| `0019-B` | 2 | 1 | 1 |
| `0035` | 12 | 6 | 1 |
| `0043-A` | 2 | 1 | 1 |
| `0043-B` | 2 | 1 | 1 |
| `0063` | 12 | 4 | 1 |
| `0100` | 12 | 4 | 1 |

`0009 / 0035 / 0063 / 0100`ではplan内部group layoutがそれぞれ2 / 3 / 2 / 3 classに分かれる。しかし、次のbody-relevant verified materialはcompatible plan間で同一だった。

- verified binding rows
- required obligation IDs
- integrated relation / unknown / mixed-emotion / Reception IDs
- grounded phrase source binding
- source fragment count
- base parsed atomの明示placement
  - `section_role`
  - `sentence_ordinal`
  - `grammatical_chunk_ordinal`
  - `clause_ordinal`
- source semantic binding projection
- Reception schedule projection

`atom_id`単独には`grammatical_chunk_ordinal`が入らないため、chunk placementは同値projectionへ明示的に含めた。

### 2.7 exact-one solution contract

採用するpreliminary contractは次である。

1. `discourse_plan_set`をinventory / content authorityからcanonicalに完全再導出し、入力集合とのexact equalityを確認する。
2. set内のすべてのplanを同じindependent base matcherへ渡す。
3. `verified=True / issue_codes=()`のbindingだけをcompatibleとする。
4. plan identityを除いたbody-relevant materialと明示placementをcanonical化する。
5. 各planについてsource semantic projectionとReception schedule projectionも再導出する。
6. それらを一つのsolution projectionとしてexact equalityで同値類化する。
7. 同値類数がexact-oneの場合だけ続行する。
8. 0 classと2 class以上を別のcode-only errorへ閉じる。

除外するもの:

- plan ID
- `discourse_plan_sha256`
- `structural_signature`
- plan内部group identity / layout
- candidate ID
- candidate-selected plan
- surface-realization plan
- candidate metadata
- forward AST / generator span map
- caller申告coverage

authority orderの先頭compatible planは、同値性証明後の計算用representativeとしてのみ使える。正解plan、元plan、candidate-selected planとして扱ってはならない。

### 2.8 plan-set attack結果

| attack | result |
|---|---|
| plan subset | `DISCOURSE_PLAN_SET_MISMATCH` |
| plan reorder | `DISCOURSE_PLAN_SET_MISMATCH` |
| plan duplicate | `DISCOURSE_PLAN_SET_MISMATCH` + `DISCOURSE_SIGNATURE_SET_INVALID` |
| structural signature mutation | `DISCOURSE_PLAN_SET_MISMATCH` + `DISCOURSE_CONTRACT_REJECTED` |
| body section-role flip | compatible solution 0 |

これにより、candidate-selected singletonやcaller提供subsetをcanonical plan setとして受理しない境界を確認した。

hashは同値projectionのcanonical commitmentとして利用できるが、署名、発行元認証、plan選択keyとして扱わない。今回のtestはcanonical JSON materialのexact equalityを先に比較している。

### 2.9 current exact19

```text
19 collected
11 PASS
8 intentional RED
elapsed 355.78s
```

内訳:

| group | result |
|---|---:|
| retained composition exact10 | `10 PASS` |
| body-dimension injectivity exact1 | `1 intentional RED` |
| source plan-set projection exact1 | `1 PASS` |
| final inverse exact7 | `7 intentional RED` |

body-dimension RED:

```text
STEP11_RC0031_P3_BODY_DIMENSION_RECOVERY_NOT_INJECTIVE
```

final inverse exact7:

```text
STEP11_RC0031_P3_FINAL_INVERSE_NOT_AVAILABLE
```

### 2.10 regression

| suite | result |
|---|---:|
| syntax / py_compile | PASS |
| exact19 collection | `19 collected` |
| current exact19 | `11 PASS / 8 intentional RED` |
| P1 exact7 | `1 PASS / 6 intentional RED` |
| P2 exact24 | `23 PASS / 1 historical path-scope RED` |

P2 historical code:

```text
STEP11_RC0031_P2_PATH_SCOPE_INVALID
```

P1、P2、fixture、catalog、Matcher predecessor、Natural Surfaceのbytes / SHA-256は変更していない。

## 3. preliminary Parsed / Verified schema

この節は設計候補であり、freezeではない。current grammarが7次元について非単射であるため、production dataclassやschema versionをまだ実装・固定しない。

### 3.1 Parser signature候補

```python
parse_step11_rc0031_experiment_surface(body)
```

Parser入力はexact final bytesだけである。source snapshot、candidate metadata、plan、AST、case IDを渡さない。

### 3.2 Parsed semantic atom field候補

```text
atom_id
semantic_family
semantic_key
direction

observation_stage
source_role
polarity
modality
temporal_scope
topic_fingerprint_sha256
referent_scope

owner_expressions
sentence_group_ordinal
grammatical_chunk_ordinal
pack_ordinal
item_ordinal
utf8_byte_start
utf8_byte_end
span_sha256
owner_expression_candidate_commitments
owner_expression_prefix_sha256
```

7 dimension fieldはRED側のrequired候補として明示したが、current grammarで値を埋めるproduction codeは作っていない。

`topic_fingerprint_sha256`はbody-derived canonical materialのcommitment候補であり、署名ではない。source topic IDやobligation IDをParsed schemaへ入れない。

### 3.3 Parsed Reception field候補

```text
binding_id
reception_line_ordinal
move_ordinal
reception_act
target_expression
supporting_expression
target_expression_sha256
supporting_expression_sha256
utf8_byte_start
utf8_byte_end
span_sha256
```

### 3.4 Parsed witness field候補

```text
schema_version
body_sha256
experiment_catalog_sha256
semantic_atoms
reception_bindings
observation_group_count
reception_group_count
base_prefix_commitments
decomposition_locus_count
evaluated_decomposition_count
peak_stored_decomposition_count
body_scan_pass_count
body_free_export_allowed
```

### 3.5 Matcher signature候補

```python
match_step11_rc0031_experiment_surface(
    witness,
    *,
    base_body_witness,
    successor_snapshot,
    inventory_result,
    content_plan,
    discourse_plan_set,
    current_input,
)
```

Matcherはsingular planを受けない。canonical plan set全体を再検証し、solution projection exact-oneを内部で証明する。

### 3.6 final parsed witnessとの将来照合

今回production Parserは作っていないため、final parsed witnessを実際に生成するround-trip exact7はavailability REDのままである。

production実装前に、final parsed semantic atomについても次をsolution projectionへ含める必要がある。

```text
semantic family / key / direction
owner body-derived commitment
sentence group
grammatical chunk
pack / item
UTF-8 span commitment
approved 7 body dimensions
Reception line / move / act / target / support association
```

したがって、今回のplan-set PASSは「final inverse完成」を意味しない。plan identity ambiguityをsolution equivalenceで安全に処理できることを、base/source projection層で先行確認した結果である。

## 4. preliminary closed-code contract

### 4.1 pre-freeze design probe

```text
STEP11_RC0031_P3_BODY_DIMENSION_PROBE_DRIFT
STEP11_RC0031_P3_BODY_DIMENSION_RECOVERY_NOT_INJECTIVE
STEP11_RC0031_P3_SOURCE_PLAN_SET_INVALID
STEP11_RC0031_P3_SOURCE_PLAN_SOLUTION_NOT_FOUND
STEP11_RC0031_P3_SOURCE_PLAN_SOLUTION_AMBIGUOUS
STEP11_RC0031_P3_SOURCE_PLAN_PROJECTION_INVALID
STEP11_RC0031_P3_SOURCE_PLAN_DENOMINATOR_DRIFT
STEP11_RC0031_P3_SOURCE_PLAN_SET_ATTACK_NOT_CLOSED
```

### 4.2 future production候補

```text
STEP11_RC0031_BODY_DIMENSION_MISSING
STEP11_RC0031_BODY_DIMENSION_AMBIGUOUS
STEP11_RC0031_BODY_DIMENSION_PROFILE_MISMATCH
STEP11_RC0031_SOURCE_PLAN_SOLUTION_NOT_FOUND
STEP11_RC0031_SOURCE_PLAN_SOLUTION_AMBIGUOUS
```

errorはcode-onlyとし、body、span text、source payload、case IDを含めない。

## 5. 推測

以下は確認済み事実ではなく、次の設計候補である。

1. `referent_scope`はsemantic familyとsingle visible nucleus kindから構造導出できる可能性が高い。
2. `topic_fingerprint_sha256`はbody-derived owner expression commitmentをcanonical化し、Matcher側でsource topic authorityへbindする方式ならsource-ID-free境界を保てる可能性がある。
3. `observation_stage`と`source_role`はcatalog-version domainを明示し、domain外sourceを拒否する方式ならcurrent representative domainを条件付きで扱える可能性がある。
4. polarity / modality / temporal scopeは、current final bytesを変えずに全profileで復元することは難しく、dimension-keyed visible morphologyまたは同等の可視grammar追加が必要になる可能性が高い。
5. visible grammarを変える場合、Natural Surface、catalog、P1/P2 expected behavior、representative final bytesへの影響評価が必要になる可能性が高い。
6. solution projection contractは成立したが、final parsed witnessの7 dimensionが成立しない限りproduction Matcherへ進めない。

## 6. 華恋の意見

plan identityをexact-oneにするためにcandidate-selected planを使うべきではない。複数planが同じbody-relevant verified solutionを表すなら、それらは観測上同じ解として扱い、内部構造の違いを正解判定へ持ち込まない方がRevised Cycleの独立性に合う。

一方、7次元をsource authorityからParsed witnessへ転記して見かけ上GREENにすることには反対する。それではBody-only Parserが本文から意味を復元したことにならない。

現在のSTOP理由は明確である。plan-set exact-oneの数学設計は成立したが、visible body grammarが7次元について非単射である。したがって、次にproduction Parser / Matcherを実装するのではなく、どの次元をどの可視形式で一意化するかをSurface grammar側で先に決めるべきである。

また、hashを署名として扱わない方針を維持する。canonical commitmentは比較を安定させるために使えても、発行元認証、plan選択、forward申告の信頼根拠にはならない。

## 7. production実装前に追加すべきRED監査

body-dimension grammarが別承認で決まった後も、production実装前または同時REDに少なくとも次が必要である。

1. Parser / Matcher別のAST owner・call graph partition
2. generic helper、alias、closure、default、container call、再帰によるallowlist迂回拒否
3. body長、digest、count literalをoracleとして分岐する実装の拒否
4. Parser cold importでbody + exact catalog以外を読まないこと
5. canonical full plan set、projection exact1 / 0 / 2、subset attack
6. hash/source-ID coherent forgery、origin transplant attack
7. production自己申告ではない外部resource accounting

これらは今回のexact19へ無理に追加してfreezeしない。body-dimension contractが成立した後のRED scopeとして別途確定する。

## 8. 維持したresource / denominator

| item | value |
|---|---:|
| representative case | 8 |
| emitted final context | 10 |
| source semantic atom | 39 |
| parsed予定atom | 38 |
| verified base reuse | 1 |
| Reception | 11 |
| final/base body max | 1,000,000 bytes |
| decomposition loci max | 38 |
| evaluated decomposition max | 76 |
| stored decomposition max | 2 |
| body scan max | 2 |
| owner max | 24 |
| owner comparison max | 576 |
| Reception move max | 3 |
| Reception move / sentence max | 2 |
| forward resource | `4 / 2 / 4 / 2` |

0063の`S=10 / R=1 / exact reuse=0`を変更していない。

## 9. 根拠と必要性

### 9.1 plan projection改訂の根拠

- raw compatible plan数は4 contextで複数だった。
- しかしverified binding、body placement、source semantic projection、Reception scheduleはcompatible plan間で同一だった。
- candidate-selected planを使わずに10 contextすべて1 solution classになった。
- canonical plan set validatorはsubset、reorder、duplicate、signature mutationを拒否した。

### 9.2 plan projection改訂の必要性

- plan identityを正解にすると、観測上同じ解を内部layout差だけで誤ってambiguousにする。
- candidate-selected planを正解にすると、Independent Matcherがforward申告を追認するだけになる。
- exact-oneをbody-relevant solution classで定義すれば、source-authoritative full setを維持しながらcandidate metadataを排除できる。

### 9.3 body-dimension STOPの根拠

- rc0031 renderer/catalogは7次元を描画keyにしていない。
- base grammarの42 profile中、4 dimensionすべてvisibleなprofileは0である。
- `event_continuation`は異なるpolarity / modality / temporal tupleを同じvisible projectionへ写す。
- `constraint_possible`は二つのmodalityを同じvisible phraseへ写す。

### 9.4 body-dimension STOPの必要性

- 非単射mappingではBody-only Parserが一意なwitnessを作れない。
- source値を後から埋めるとParser / Matcher owner境界が壊れる。
- schemaを先にfreezeすると、可視grammar改訂後にfield semanticsまたはcompatibilityを壊す。
- production未変更の段階でSTOPすれば、成立しないParser placeholderや根拠のないMatcher reuseを作らずに済む。

## 10. STOP境界

今回、次をfreezeまたは開始していない。

- current exact19
- preliminary Parsed / Verified schema
- body-dimension recovery contract
- production Parser / Matcher
- Matcher append
- Natural Surface変更
- catalog production変更
- P1 / P2 / fixture変更
- P4
- runtime
- manifest
- E2以降

次へ進むには、少なくともcurrent final bytesの非単射を解消するSurface grammar方針について別の明示承認が必要である。

## 11. 次の承認候補

production実装承認ではなく、次の設計・RED承認を推奨する。

> composition GREEN predecessor `f7caf169c36d6097a63ca389706a75eb98783116`、mashos-api pre-freeze probe `df8dcd3a672ef76f454282c4980b47272962f53e`、Matcher predecessor `722,658 bytes / SHA-256 648a3a6690f8df860053c811a5416fcfc9983524e5ff880a0e6921a122a52e30`を維持する。production Parser / Matcherは開始せず、current grammarで非単射だったpolarity / modality / temporal scopeを含む7 body dimensionをfinal bytes上で一意にするSurface grammar改訂候補について、impact design addendumとproduction source不変のRED先行検証を開始してよい。observation stage / source roleのcatalog-version domain、topic fingerprintのbody-derived定義、referent scopeの構造導出を個別に明示する。candidate metadata、candidate-selected plan、hash-as-signatureは使用しない。Natural Surface、catalog、P1/P2、fixture、denominatorまたはresourceのproduction変更が必要と判明した時点でSTOPし、変更ownerと影響を提示して別承認を求める。current exact19はfreezeせず、P4、runtime、manifest、E2以降は開始しない。

この承認でもproduction file editは許可しない。まず可視grammarが7次元について単射になり得るかをREDで確認し、成立する設計だけを次のproduction承認候補にする。

## 12. Mashにお願いする作業

現時点でMashのPC操作は不要である。

今回のtestと本補遺は華恋がGitHubへ反映する。次の作業は、上記Surface grammar design / REDの明示承認だけで開始できる。

