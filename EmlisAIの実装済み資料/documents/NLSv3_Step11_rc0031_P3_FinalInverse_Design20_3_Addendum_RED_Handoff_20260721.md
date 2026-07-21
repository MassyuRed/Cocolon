# NLS v3 Step 11 rc0031 P3 Final Inverse PRE-FREEZE DESIGN BLOCKER Handoff

作成日: 2026-07-21 JST  
対象: `Step 11 / Cycle 001 / rc0031 / P3 final Body-only Parser + Independent Matcher`  
composition GREEN authority: `f7caf169c36d6097a63ca389706a75eb98783116`  
immutable Matcher predecessor: `722,658 bytes / SHA-256 648a3a6690f8df860053c811a5416fcfc9983524e5ff880a0e6921a122a52e30`  
mashos-api P3 pre-freeze probe commit: `82bfbf15d93dfcf865c99c11fa24b517c2396074`（freeze対象ではない）  
設計正本SHA-256: `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc`  
privacy: `BODY-FREE`  
状態: `PRE-FREEZE DESIGN BLOCKER / PRODUCTION SOURCE UNCHANGED / STOP BEFORE IMPLEMENTATION`

## 0. 結論

現在のP3 final inverse案は、production実装へ進める状態でも、RED commitとしてfreezeできる状態でもない。

理由は、production API不在とは別に、次の二つの構造的blockerが確認されたためである。

1. P2/source authority側にはStep 8照合に必要な次元が存在する一方、final bytesだけからそれらを復元するための承認済みbody recovery mappingがない。
2. base bodyとsource-authoritative `discourse_plan_set`だけからplanをexact-oneに決める案は、representative 10 context中4 contextで非一意になり成立しない。

frozen rc0031 catalogには次の契約がまだ存在しない。

```text
STEP11_RC0031_EXPERIMENT_BODY_DIMENSION_RECOVERY_CONTRACT
```

現在のtest working copyは、既存exact10を保持したままexact9を追加したpre-freeze probeである。

test file authorityは`115,353 bytes / SHA-256 aa87e58b65aec4d3a40ea9d2f589d12369e4f4d2d93759c8d9fcaa09de322c4d`である。

```text
retained composition exact10 = 10 PASS
added pre-freeze exact9:
  structural exact2:
    exact1 = STEP11_RC0031_P3_STEP8_DIMENSION_CONTRACT_NOT_AVAILABLE
    exact1 = STEP11_RC0031_P3_BASE_DISCOURSE_BINDING_NOT_UNIQUE
  exact7 = STEP11_RC0031_P3_FINAL_INVERSE_NOT_AVAILABLE
total exact19
production source change = 0
mashos-api pre-freeze probe commit = 82bfbf15d93dfcf865c99c11fa24b517c2396074
full exact19 run = 9 failed, 10 passed in 295.19s
```

この結果が示すのは、単にproduction symbolがないことだけではない。Body-only Parserが何を本文から復元するかに加え、final parsed witnessとsource-authoritative plan setから、candidate metadataなしでどうexact-one solutionへ到達するかを先に確定する必要がある。

次に必要なのはproduction実装承認ではなく、production sourceを変更しないbody-dimension、final-witness-to-plan-set exact-one照合、schemaの設計補遺と、その設計に合わせたRED改訂の承認である。

## 1. 確認した事実

### 1.1 GitHub authorityと変更境界

1. `MassyuRed/mashos-api`のcomposition GREEN authorityは`f7caf169c36d6097a63ca389706a75eb98783116`である。
2. Natural Surface finalは`485,490 bytes / SHA-256 ee2f4bc0ab260e8cf1ce2b87acf499e84712ed6b3e639a6a1a6a0141bd3ea520`である。
3. Natural Surface private validator slotは`5,178 bytes / SHA-256 3356cecd99d65009c34e512966ae154857c4f167afe714c6907744d68a33ddea`でGREEN固定されている。
4. Matcher predecessor全体は`722,658 bytes / SHA-256 648a3a6690f8df860053c811a5416fcfc9983524e5ff880a0e6921a122a52e30`である。
5. Matcherにはrc0030 Parser / Matcherが存在するが、rc0031 final Parser / Matcherのproduction symbolは存在しない。
6. public non-empty reuseは拒否されたままで、private composition seamは`__all__`へexportされていない。
7. 今回のpre-freeze probeではproduction sourceを変更していない。
8. GitHubへ反映した`82bfbf15d93dfcf865c99c11fa24b517c2396074`は、診断を保持するpre-freeze probe commitであり、P3 RED freeze commitではない。

### 1.2 source authority側に存在する次元

current P2/source authorityには、少なくとも次が存在する。

- source snapshotの`observation_stage`
- source snapshotの`semantic_source_roles`
- obligationの`polarity`
- obligationの`modality`
- obligationの`temporal_scope`
- obligationの`topic_scope_ids`
- obligationの`referent_scope`
- obligationの`evidence_ids`
- obligationの`source_refs`

したがって、source側の比較対象が全面的に欠落しているわけではない。

### 1.3 body側に存在しない承認済み契約

frozen rc0031 declarative catalogには、次のsymbolがない。

```text
STEP11_RC0031_EXPERIMENT_BODY_DIMENSION_RECOVERY_CONTRACT
```

また、次の各body dimensionをfinal bytes上のどの可視形式から、どの規則で、一意に復元するかという承認済みmappingがない。

```text
observation_stage
source_role
polarity
modality
temporal_scope
topic_fingerprint
referent_scope
```

source authorityに値があることと、Body-only Parserがfinal bytesだけから同じ値を復元できることは別である。後者の契約なしにsource値をParser結果へ転記すると、body-only独立性を証明できない。

### 1.4 base-only discourse bindingが非一意になる事実

base body witnessとsource-authoritative `discourse_plan_set`だけを使ってdiscourse planをexact-oneに決めるpre-freeze probeは、10 context中6 contextではexact-oneになったが、4 contextでは複数のplanが同じbase-side条件を満たした。

| representative context | matching source plans |
|---|---:|
| `0009` | 4 |
| `0035` | 6 |
| `0063` | 4 |
| `0100` | 4 |

closed codeは次である。

```text
STEP11_RC0031_P3_BASE_DISCOURSE_BINDING_NOT_UNIQUE
```

したがって、「base bodyだけからsource discourse planを一意に選び、そのplanをfinal Matcherへ渡す」という案は機械的に反証された。

一方、candidateが実際に選んだplanを正解として渡せば一意性を作れても、それはforward metadataの追認になる。candidate-selected planとsurface-realization planをMatcherへ入力しない境界は維持する。

未確定なのは、final parsed witnessの可視構造とsource-authoritative `discourse_plan_set`をどの規則で照合し、candidate metadataなしでunique solution countをexact-oneにするかである。

### 1.5 pre-freeze exact19の内訳

test working copyは次の構成である。

| group | count | current result |
|---|---:|---|
| retained composition | exact10 | `10 PASS` |
| Step 8 body-dimension contract | exact1 | intentional RED: `STEP11_RC0031_P3_STEP8_DIMENSION_CONTRACT_NOT_AVAILABLE` |
| base/source discourse exact-one | exact1 | intentional RED: `STEP11_RC0031_P3_BASE_DISCOURSE_BINDING_NOT_UNIQUE` |
| final inverse draft contract | exact7 | intentional RED: `STEP11_RC0031_P3_FINAL_INVERSE_NOT_AVAILABLE` |
| total | exact19 | `9 failed, 10 passed in 295.19s` / pre-freeze only |

test file authority:

```text
bytes = 115,353
SHA-256 = aa87e58b65aec4d3a40ea9d2f589d12369e4f4d2d93759c8d9fcaa09de322c4d
```

final inverse draft exact7が現在確認する範囲は次である。

1. rc0031 inverse symbol、schema、export、Parser / Matcher signature
2. representative10 final round-trip、determinism、body-only、resource field
3. `0001` final reuseの独立再導出とsource XOR
4. forward metadata、hidden marker、UTF-8、body bound攻撃
5. renderer mutationとgenerator metadataの差分隔離
6. rehash済みwitness、base、source authority移植攻撃
7. relation / distribution / Reception / reuse本文mutationとprivacy

exact7が同じavailability codeへ閉じるのは、rc0031 production APIが存在しないためである。これは未完成production placeholderを追加した結果ではない。

ただし、exact7のschemaと期待値はbody-dimension recovery contractおよびfinal witnessによるplan disambiguation確定前のdraftであり、現時点ではfreeze対象ではない。

### 1.6 current rc0030 inverse predecessor

current Matcher末尾には、次のrc0030 inverse-side ownerがある。

- final body parser
- base body parser
- source authority revalidation
- independently allowed base reuseの再導出
- final parsed atomとbase reuseのXOR検査
- Reception schedule / binding
- witness origin registry
- body-free material validator

composition後の`0001` final bytesをcurrent rc0030 final parserへ入力すると、本文を出力せず次で拒否される。

```text
STEP11_RC0030_RECEPTION_ACT_AMBIGUOUS
```

`0001`のpredecessor baseとcomposition finalは同一bytesではない。

| material | bytes | SHA-256 |
|---|---:|---|
| predecessor base | 231 | `4975ce7291e3ff056c47987012b6f2c088a0e3817b0d421e5308854e5981df91` |
| composition final | 198 | `a3603b8c5af1ae3833542c2b4a53115cf823f3826d0dfd4dc2a8886022e99ab6` |

また、rc0030 parsed atomにはRevised Cycle §12.2が要求するUTF-8 byte spanがない。したがって、rc0030 public final parserを名前だけ流用してrc0031 final inverse完成とすることはできない。

### 1.7 representative denominator

current representative authorityは次である。

| item | exact value |
|---|---:|
| representative case | 8 |
| predecessor base candidate | 13 |
| emitted final candidate | 10 |
| source semantic atom | 39 |
| final bytesからparse予定のadded atom | 38 |
| base bodyから独立再導出予定のreuse | 1 |
| final Reception binding | 11 |

current composition上の`0001`は`parsed S=0 / reuse=1 / Reception=1`、`0063`は`S=10 / R=1 / exact reuse=0`である。これはforward compositionの事実であり、final inverseがすでに再証明したという意味ではない。

## 2. 推測

1. body-dimension recovery contractを先に固定すれば、Parserがfinal bytesから作るsource-ID-free witnessと、Matcherがsource authorityから再検証する次元の境界を機械的に分離できる可能性が高い。
2. current rc0030 inverseのsource revalidation、base witness origin、allowed reuse再導出は、forward metadataを信用しないinverse-side helperに限定すれば、immutable predecessorとして消費できる可能性がある。
3. current rc0030 final parser全体は`0001`をparseできずUTF-8 byte spanも作れないため、rc0031固有のParser ownerは必要になる可能性が高い。
4. base bodyだけによるunique-plan proposalは反証されたが、final parsed witnessが持つ可視owner、group、Reception、body dimensionをsource-authoritative `discourse_plan_set`へ照合すれば、候補集合をexact-oneまで狭められる可能性は残っている。
5. `content_plan`と`discourse_plan_set`をcandidate-selected planとして扱わず、source authority候補集合として再検証してからfinal witnessとの照合に使う設計なら、candidate realizationからの独立性を維持できる可能性がある。
6. Matcher末尾へのappend-only実装は変更範囲を限定できる可能性があるが、現在は実装方式を承認する段階ではない。

これらは設計上の推測であり、production codeで成立した事実ではない。

## 3. 華恋の意見

現在のexact19は、実装開始の根拠としてfreezeすべきではない。欠けているのは単なるproduction symbolではなく、Body-only Parserの意味復元根拠と、final witnessからsource planを一意照合する根拠だからである。

まず、visible bodyとsource authorityの間を何で照合するか、さらにfinal parsed witnessとsource-authoritative plan setからどうexact-one solutionを得るかをbody-dimension/schema設計補遺として明文化し、その後にexact9を改訂してREDを再実行するのが妥当である。mappingと一意照合が成立しなければ、production実装へ進むべきではない。

reuseについても、根拠のない転記は認めない。許可候補はimmutable rc0030 predecessorが持つsource再検証、base witness origin、base reuse再導出などのinverse-side責任に限る。hashは署名として扱わず、fieldとhashを同時に作り直したwitnessもoriginとcurrent authorityで拒否する必要がある。

また、`content_plan`と`discourse_plan_set`は「選ばれたcandidateの正解情報」ではなく、source-side authority候補として扱うべきである。baseだけで一意に選べない事実を隠さず、Matcher自身がsource snapshot、inventory、current inputとの整合を再検証したうえで、final parsed witnessとの照合により一意性を証明すべきである。candidate-selected planやsurface-realization planを入力してはならない。

## 4. 次の設計補遺で確定すべき契約

### 4.1 body-dimension recovery mapping

次の各項目について、少なくとも「可視body根拠」「canonical form」「曖昧時のclosed code」「source authorityとの比較方法」を定義する必要がある。

| body dimension | source-side comparison candidate | design question |
|---|---|---|
| `observation_stage` | source snapshot stage | bodyのどの構造がstageを表すか |
| `source_role` | semantic source roles | roleを可視形式からどう区別するか |
| `polarity` | obligation polarity | 否定・肯定をどう一意化するか |
| `modality` | obligation modality | modality標識と無標識をどう扱うか |
| `temporal_scope` | obligation temporal scope | 時制・時間scopeをどこまで復元するか |
| `topic_fingerprint` | topic scope authority | source IDをwitnessへ出さず何を比較するか |
| `referent_scope` | obligation referent scope | 指示対象の一意性をどう閉じるか |

`evidence_ids`と`source_refs`はsource authority再検証に必要だが、source ID-free parsed witnessへそのまま格納してはならない。本文から復元するbody dimensionと、Matcher内部だけで確認するsource associationを分離する必要がある。

catalog constantを単に追加するだけでは不十分である。mappingがforward metadataやcase IDを参照せず、final bytesだけで決定可能であることをREDで機械検査できなければならない。

### 4.2 final witnessとsource plan setの一意照合

base bodyだけによるplan選択は`0009 / 0035 / 0063 / 0100`で非一意になったため、次の設計ではこの案を前提にしない。

代わりに、次を定義する必要がある。

1. `discourse_plan_set`全体をsource snapshot、inventory、content authority、current inputから再検証する。
2. final parsed witnessが持つ可視owner、group ordinal、Reception、approved body dimensionだけをplan照合keyへ投影する。
3. 各source-authoritative planについて、final witnessとの適合・不適合を同一規則で評価する。
4. 適合planがexact-oneのときだけ先へ進み、0件と2件以上を別のbody-free closed codeで拒否する。
5. candidate ID、candidate-selected plan、surface-realization plan、forward-only realization metadata、covered obligation申告を照合keyに含めない。

この規則でrepresentative 10 contextすべてがexact-oneになり、donor/transplant/mutationでもfail-closeすることをproduction未変更のREDで先に確認する。

### 4.3 owner境界

予定するindependent flowは次である。ただし、body-dimension/schema補遺とplan-set一意照合が成立するまではpreliminaryである。

```text
base final bytes
  -> existing body-only base parser
  -> parser-issued base witness

rc0031 final bytes
  -> proposed rc0031 Body-only Parser
  -> source-ID-free witness + UTF-8 spans + approved body dimensions

parsed witness + base witness + revalidated source-authoritative plan set
  -> proposed rc0031 Independent Matcher
  -> final witnessからcompatible planをexact-one照合
  -> allowed base reuseを内部再導出
  -> parsed / reuse exact XORを照合
  -> body-free verified binding
```

Parserが読める候補はexact final bytesとversion-fixed declarative catalogだけである。

Parserへ渡してはならないもの:

- candidate / candidate metadata
- AST / forward plan / generator span map
- covered obligation ID
- Gate status / soft score
- source Evidence / Obligation Ledger
- case ID / expected output

Matcherはparsed witness、base witness、revalidated source authorityだけを責任境界とする。

Matcherへ渡してはならないもの:

- final bytesの別渡し
- base body raw bytes
- candidate / candidate AST / rendered surface
- candidate-selected plan / surface-realization plan
- lexical atom specs
- caller作成reuse proof
- verified base reuse binding tuple
- candidate-declared ID

## 5. preliminary APIとschema

この節はcurrent test working copyのdraftを記録するものであり、freezeではない。body-dimension recovery設計により変更され得る。

### 5.1 proposed Parser signature

```python
parse_step11_rc0031_experiment_surface(body)
```

### 5.2 proposed Matcher signature

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

Matcher draftはsingular `discourse_plan`ではなく`discourse_plan_set`を受ける。`content_plan`と`discourse_plan_set`はsource authority候補として再検証するための入力候補であり、candidateが採用したplanやsurface realizationの正解情報として消費してはならない。

base bodyだけからset内のplanをexact-oneに決める案は、4 contextで非一意になり反証済みである。次のschema draftは、final parsed witnessからplan compatibilityを証明するために必要なbody-derived fieldを再検討しなければならない。

### 5.3 proposed schema names

```text
cocolon.emlis.nls_v3.step11.rc0031_experiment_parsed_witness.v1
cocolon.emlis.nls_v3.step11.rc0031_experiment_verified_binding.v1
```

### 5.4 current preliminary field groups

Parsed semantic atom draft:

```text
atom_id
semantic_family / semantic_key / direction
owner_expressions
sentence_group_ordinal / grammatical_chunk_ordinal
pack_ordinal / item_ordinal
utf8_byte_start / utf8_byte_end / span_sha256
owner_expression_candidate_commitments
owner_expression_prefix_sha256
```

Parsed Reception binding draft:

```text
binding_id
reception_line_ordinal / move_ordinal / reception_act
target_expression / supporting_expression
target_expression_sha256 / supporting_expression_sha256
utf8_byte_start / utf8_byte_end / span_sha256
```

Parsed witness draft:

```text
schema_version / body_sha256 / experiment_catalog_sha256
semantic_atoms / reception_bindings
observation_group_count / reception_group_count
base_prefix_commitments
decomposition_locus_count / evaluated_decomposition_count
peak_stored_decomposition_count / body_scan_pass_count
body_free_export_allowed
```

Verified binding draftはsource atom association、parsed/reuse XOR、Reception association、authority commitments、unique solution、hard verificationをbody-free materialとして保持する案である。

次のsource/candidate identifiersはParsed schemaへ入れない。

- source atom ID
- obligation ID
- Evidence ID
- Relation ID
- source Reception opportunity ID
- candidate ID / covered obligation ID

UTF-8 spanはfinal bytes上の0始まり半開区間とし、scalar boundary、`0 <= start < end <= len(body)`、slice SHA-256一致を満たす案である。ただし、body dimensionsをatom fieldへ持たせるか別のparsed dimension rowへ分離するか、source plan compatibilityをどのbody-derived projectionで表すかは未確定である。

したがって、current field order、schema version、material projectionはまだfreezeしない。

## 6. reuseのpreliminary境界

### 6.1 限定reuse候補

immutable 722,658-byte predecessorのうち、次のinverse-side責任は設計候補である。

- base witnessのorigin / material検証
- source snapshot / authority / obligation parentの再検証
- owner visible phrase registry
- independently allowed base reuseの再導出
- Reception scheduleとsource association
- source-based placement検査

これらを採用する場合も、次を満たす必要がある。

1. predecessorの既存bytesを変更しない。
2. forward module、candidate metadata、caller proofへ依存しない。
3. rc0031 Matcher側でbody-dimension contractを含む最終整合を再検査する。
4. helper reuseを理由にrc0031固有span、grammar、attack testを省略しない。

### 6.2 禁止候補

- `parse_step11_rc0030_experiment_surface`をrc0031 Parserとして呼ぶこと
- `match_step11_rc0030_experiment_surface`をrc0031 Matcherとして呼ぶこと
- rc0030 schemaをrc0031 schemaと呼び替えること
- §6.1で個別にallowlistされていないprivate rc0030 helperを呼ぶこと
- forward renderer / AST traversal / coverage helperを共有すること
- projected reuse hashを発行元認証として信用すること
- candidate planのreuse列をfinal bindingへ転記すること

## 7. append allowlist principle

将来append方式を検討する場合は、禁止語のdenylistだけではなく、許可する構文とownerを狭く列挙するallowlistを先に固定する。

current pre-freeze probeが置いている原則は次である。

- Matcher先頭`722,658 bytes`をimmutable prefixとしてexact SHA確認する。
- append先頭marker候補を`# rc0031 experiment-only final body inverse`とする。
- top-levelはrc0031専用constant、dataclass、error、function、`__all__ +=`だけを許可候補とする。
- 既存symbolのshadow / redefinitionを許可しない。
- module-level side effect、arbitrary import、I/O、process、network、loggingを許可しない。
- catalog参照が必要な場合も、exact rc0031 catalogだけを関数内で取得する限定方式とする。
- rc0030 public final Parser / Matcherへのdelegateを許可しない。
- 個別にallowlistされたinverse-side helper以外のprivate rc0030 helperを許可しない。
- candidate ID、expected output、review oracle literal、source payload literalを許可しない。
- recursion、dynamic evaluation、runtime introspectionでallowlistを迂回できないようにする。

current probeにはappend最大`131,072 bytes`というdraft ceilingがあるが、これはproduction appendの承認でも、十分性の証明でもない。body-dimension/schema設計後のREDで再評価する。

## 8. resourceと監査限界

current predecessorの既存上限は次である。

| resource | current maximum |
|---|---:|
| final / base body | 1,000,000 bytes |
| decomposition loci | 38 |
| evaluated decomposition | 76 |
| stored decomposition | 2 |
| body scan | 2 |
| owner | 24 |
| owner comparison | 576 |
| Reception move | 3 |
| Reception move / sentence | 2 |

pre-freeze final inverse draftは、representative上のpreplanning base 13 + final candidate 10 = 23を根拠に、Parser / Matcher invocationを各24以内、body byte inspectionを48,000,000以内に保つ案を置いている。これは既存resourceやdenominatorを拡張する承認ではない。

重要な監査限界として、production Parser / Matcherが存在しない現在、実際のscan回数、byte inspection、owner comparisonを独立に計測できない。将来productionが返すresource fieldだけを自己申告として読むtestでは十分ではない。

次の設計補遺と改訂REDでは、少なくとも次を決める必要がある。

- どのresourceを外部instrumentationで数えるか
- どのresourceをimmutable code-path / bounded-loop監査で証明するか
- witness materialのcounterと独立観測値をどう照合するか
- body-dimension recoveryを追加しても既存上限を増やさないことをどう証明するか

したがって、現時点でresource contractが機械的に成立したとは結論しない。

## 9. attack contract候補

改訂REDでは少なくとも次をfail-close対象とする。

- invalid UTF-8 / non-NFC / BOM / CRLF / trailing newline
- zero-width / hidden metadata / visible schema marker
- body > 1,000,000 bytes
- forward metadata kwarg投入
- body-dimension markerの欠落 / duplicate / contradiction / ambiguity
- dataclass replace + digest再計算済みwitness
- base witness / source authority / successor transplant
- `content_plan` / `discourse_plan_set`のsource authority不整合
- final witnessとのcompatible planが0件または2件以上になる場合
- candidate-selected plan / surface-realization planの注入
- semantic atom drop / duplicate / reorder / donor replacement
- relation endpoint / direction / type mutation
- Reception act / target / support / scope mutation
- reuse意味の削除 / duplicate re-exposition
- generic body + retained metadata

errorは`STEP11_RC0031_*`のcode-onlyとし、本文、span text、source payload、stdout / stderrを出さない方針を維持する。

## 10. 今回維持したもの

- composition GREEN commit `f7caf169c36d6097a63ca389706a75eb98783116`
- Natural Surface全bytes
- Matcher predecessor全`722,658 bytes`
- public reuse拒否
- P1 source / test
- P2 source / test
- fixture
- catalogの現行bytes
- Gate
- control / attack / closed code
- representative denominator
- resource `4 / 2 / 4 / 2`
- runtime
- manifest
- P4
- E2以降

この列挙は「変更していない」という意味であり、P3 final inverseが完成したという意味ではない。

## 11. 保留した将来課題

Matcherへ実際にappendする段階になれば、P2のwhole-file size sentinelとrc0030 dependency closureがhistorical driftになる可能性がある。

ただし、次に求める作業はproduction source不変の設計補遺とRED改訂だけである。そのため、P2 testやmanifestの扱いを今回決定する必要はなく、変更も行わない。

これらはproduction実装が別途承認される前に再提示し、その時点のauthorityで判断する。

## 12. 根拠と必要性

### 根拠

- Revised Cycle §12はfinal bytesだけを読むParserと、candidate metadataを読まないMatcherを要求する。
- P2/source authorityにはstage、source roles、polarity、modality、time/topic/referent、evidence、source refsがある。
- frozen rc0031 catalogにはbody-dimension recovery contractがない。
- current rc0030 parserは`0001` final bytesを`RECEPTION_ACT_AMBIGUOUS`で拒否する。
- rc0030 parsed atomにはrequired UTF-8 spanがない。
- current compositionはforward側で`added 38 + reuse 1 = source 39`を成立させているが、final inverseによる再証明はまだない。
- base body + source-authoritative `discourse_plan_set`のunique-plan proposalは、10 context中4 contextで4〜6件のplanが適合して反証された。
- pre-freeze structural exact2はdimension contract不在とbase discourse binding非一意、exact7はfinal inverse API不在へ閉じた。

### 必要性

- body recovery mappingがなければ、Parserがsource値を本文から得たのか、別authorityから転記したのかを区別できない。
- baseだけでplanを選ぶと4 contextで非一意になり、candidate-selected planを使うとforward申告の追認になるため、final witnessとsource plan setの独立照合が必要である。
- schemaを先にfreezeすると、dimensionを後付けして互換性またはprivacy境界を崩す可能性がある。
- candidate-selected planをMatcherへ渡すと、independent matcherではなくforward申告の追認になる。
- caller reuse proofをMatcherへ渡すと、hashを署名と誤認し、fieldとhashを同時再計算した偽造を閉じられない。
- resource自己申告だけではbounded processingを独立証明できない。
- production未変更の設計補遺とRED改訂を先に行えば、成立しない設計をproductionへ持ち込まずに済む。

## 13. STOP境界

今回開始・承認していないもの:

- rc0031 production Parser / Matcher
- Matcher append
- Natural Surface追加変更
- catalog production変更
- P1 / P2 / fixture変更
- Gate変更
- dependency manifest変更
- runtime接続
- public reuse coordinator
- P4
- E2以降

次の設計補遺・RED改訂中も、次が必要になれば即時STOPする。

- production source変更
- immutable Matcher prefix変更
- forward Surface / AST / candidate metadataへの依存
- candidate-selected plan / surface-realization plan入力
- caller reuse proof入力
- resource / denominator拡張
- public reuse API開放
- P4 owner前倒し

## 14. 次の明示承認

次に求めるのはproduction実装承認ではない。current exact19をfreezeする承認でもない。GitHubへ反映するpre-freeze probe commitは診断の保存点であり、P3 RED freezeではない。

推奨する承認文:

> composition GREEN commit `f7caf169c36d6097a63ca389706a75eb98783116`とMatcher predecessor `722,658 bytes / SHA-256 648a3a6690f8df860053c811a5416fcfc9983524e5ff880a0e6921a122a52e30`を維持したまま、production source不変で、P3 final inverseのbody-dimension recovery contract、final parsed witnessとsource-authoritative `discourse_plan_set`のexact-one照合契約、preliminary Parsed / Verified schemaを再検討する設計補遺作成、およびその設計に合わせたRED先行test改訂を開始してよい。base bodyだけによるunique-plan proposalは採用しない。`content_plan`と`discourse_plan_set`はsource authority候補集合として再検証し、candidate-selected plan、surface-realization plan、candidate metadataは使用しない。P1、P2、fixture、Gate、runtime、manifest、P4、E2以降は変更・開始しない。production Parser / Matcher実装、Matcher append、catalog production変更、current exact19のfreezeは別承認まで行わない。

この承認後も、まずbody-onlyで各dimensionを復元できるか、final parsed witnessとsource-authoritative plan setからcandidate metadataなしでexact-one solutionを得られるか、schemaとresourceを独立監査できるかをproduction未変更のREDで確認する。成立した場合だけ、RED freezeとproduction実装について別途承認を求める。
