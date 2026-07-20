# NLS v3 Step 11 rc0030 — P4 Gate / Runtime / Closure Handoff

作成日: 2026-07-19 JST  
対象: `Step 11 / Cycle 001`  
handoff state: `P4_COMPLETE / STOP_BEFORE_P5`

## 1. 結論

GitHub `MassyuRed/mashos-api` main commit
`afcd089a872d71b07930592b068bdc3d480b8e3b`をP4 phase predecessorとして、
承認済みP4 activation補足のactive pathだけで次を実装した。

- additive rc0030 Hard Gate / selector
- candidate-specific base inverse prepass
- disconnected rc0030 runtime adapter
- P4 phase dependency manifest / tool / generated fixture
- runtime-disconnect / dependency-closure test

P4固有の最終受入は次のとおりである。

- runtime / disconnect: `13 / 13 PASS`
- phase manifest / closure: `5 / 5 PASS`
- generated manifest deterministic rebuild: `PASS`
- unexpected / unbound / forbidden reverse / reserved-present: `0 / 0 / 0 / 0`
- exact 4 frozen prefix: `4 / 4 PASS`
- P2 / P3 behavioral and mutation nodes: `69 PASS`

したがってP4は完了した。ただし、P5入口診断でcontrol 0002が
frozen P3 cardinality契約により`no_valid_candidate`となることを確認した。
P3 verificationを迂回せず、P5を開始せずに停止する。

- P1 diagnostic: `5 PASS / 1 STOP`
- P5: `NOT_STARTED`
- E2 / E3 / E4: `NOT_STARTED`
- Cycle 001: `NOT_ACCEPTED`

## 2. predecessor / activation

| role | commitment |
|---|---|
| historical rc0030 baseline | `e1e2ec5c17fa165f9972373304899802832ecd5b` |
| immutable rc0029 parent closure | `cd46925c6db478ac07e501acb64c45cae3a122ab0c1d834d06a83f1190cfb082` |
| P4 phase predecessor | `afcd089a872d71b07930592b068bdc3d480b8e3b` |
| P4 source closure | `29abbb08da497c902ea56cffbc82703801c7228f86e8a4f0f95d00800c31456b` |

P4 activationは`active 11 / hashed 10 / reserved-absent 7`である。
generated manifest自身は自身のhash集合から除外した。
source file countはrc0029 parent 209件にactive hash 10件を加えた`219`である。

reservedのbounded tool、E2、P5、E3、E4 testは作成していない。

## 3. 変更file、根拠、必要性

### MODIFY — append-only

`ai/services/ai_inference/emlis_ai_step11_hard_gate_v3.py`

- 根拠: 設計20.3 §6.1は、rc0030のprominence、schema-free、chunk、Reception、selector責任を既存Hard Gate ownerへ置く。
- 必要性: forward candidateの自己申告ではなく、base/final ParserとIndependent Matcherの証拠をsource authorityへjoinし、選択をfail-closeするため。
- 変更境界: 先頭129,756 bytesを不変にし、rc0030-prefixed suffix 74,354 bytesだけを追加した。
- frozen prefix SHA-256: `6911291682508bcd6df66d39acb7a6b29b1cfc411434d1ff13160125c9af6c9a`
- P4 suffix SHA-256: `3c1fe149d8265f49689add7be4a893f4a502af2bf4a7ffb9998980b8fed88c8c`
- final file SHA-256: `1926ef12e74f1a9f53015f2d913cbb4b6881606e57e5078c6f8192e2894af4c7`

### NEW — disconnected runtime

`ai/services/ai_inference/emlis_ai_step11_rc0030_experiment_runtime_adapter_v3.py`

- 根拠: P2 forward、P3 inverse、P4 Gateをshared runtimeへ接続せずrequest-localに同期するownerが必要である。
- 必要性: candidateごとのbase exact reuse prepassを一度だけ行い、selectorを唯一のfinal evaluatorにするため。
- SHA-256: `139bd2d052fa3362bde86e6e88b039e9fddbd91caf48155cc738265fc22de9c6`

### NEW — P4 phase manifest

`ai/services/ai_inference/emlis_ai_rc0030_surface_planning_experiment_dependency_manifest_v3.py`

- 根拠: 承認済みactivation補足はexact 18 maximumとphase active subsetを分離して固定する。
- 必要性: reserved pathの早期作成、prefix drift、reverse import、filesystem admissionをfail-closeするため。
- SHA-256: `72c664eec03cf4b29315ae7badc8a85e70f6830d8de745335458c7c633eb5876`

`ai/tools/emlis_nls_v3_rc0030_surface_planning_dependency_manifest.py`

- 根拠: manifestをcanonicalに生成・照合するCLIがP4 active pathとして承認されている。
- 必要性: 手書きfixtureやhash自己申告ではなく同一builderで再計算するため。
- SHA-256: `ace6031aa7882853bca2e3e3606192a36d7177aa5c0907d5474d62c644f61ab8`

`ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_dependency_manifest_rc0030_surface_planning_experiment.json`

- 根拠: P4のexact source closureをbody-freeで固定するgenerated artifactである。
- 必要性: active / reserved、exact4 current hash、import edgeを次phase predecessorへ渡すため。
- file SHA-256: `147c395d6250553aa9fa2fc1c14888b357827f6f8d8bf64f2dae18e71fd33f60`
- artifact SHA-256: `ec0f49f013ac4814749ad928849ff5382c9df97bb5fb78df3e89cb75143932f1`

### NEW — P4 tests

`ai/tests/test_emlis_nls_v3_s11_rc0030_runtime_disconnect.py`

- 根拠: runtime disconnect、resource、request-local context、body-free結果をP4で直接固定する。
- 必要性: shared route非接続、Parser/Matcher重複実行、candidate-local failureの全体abortを回帰可能にするため。
- SHA-256: `8f674cbce686aad20978e7822469d3cb3499e1ad16caf99b9b2a99551db6ac3a`

`ai/tests/test_emlis_nls_v3_s11_rc0030_dependency_closure.py`

- 根拠: P4 active / reserved契約とgenerated manifestの再構築を検証するexact test ownerである。
- 必要性: exact18をP4で全存在させる誤実装とpartial manifestの曖昧さを再発させないため。
- SHA-256: `da348ed69fa192e06973c4f64c6215aa46732be6bb161afb0e25f6e0d4cb298c`

## 4. Hard Gate / selector契約

P4 Gateは次を実装した。

1. base candidateごとにorigin-registered inverse contextを発行する。
2. contextはbase candidate/body、successor、authority、inventory、content、discourse、current inputのcommitmentをbindする。
3. runtimeはcontextのverified reuse rowだけをbody-free forward commitmentへ変換する。
4. selectorが各candidateをexactly once評価する。
5. canonical rerenderとfrozen rc0027 base Gateを再検証する。
6. final bytesをBody-only Parserで一度parseする。
7. final witnessをIndependent Matcherで一度matchする。
8. forward reuse、semantic chunk、relation direction、Reception、base-leading prominenceをinverse証拠へexact joinする。
9. hard verified candidateだけをdeterministic ID順で選択する。
10. recovery / soft rescue / semantic coverage自己認証を行わない。

`dataclasses.replace`等で見かけ上整合させたcontextも、request-local provenanceがないため拒否する。

## 5. resource / failure accounting

| resource | P4 bound |
|---|---:|
| candidates | 12 |
| replans | 1 |
| Parser calls / candidate | 2 |
| Matcher calls / candidate | 2 |
| Parser calls / run | 24 |
| Matcher calls / run | 24 |
| body byte inspections / run | 48,000,000 |

失敗したParser / Matcher callもattemptとしてcountする。
base inverse evaluationは成功contextの有無とattempt ledgerを分離し、
Parser拒否を`1 / 0`、Matcher拒否を`1 / 1`として候補単位で保持する。
final Parser拒否でもGate resultを保持し、`final parse 1 / match 0`を
全体fail-closeや`0 / 0`へ変換しない。
P2 plan density等で一つのbase candidateだけが構築不能な場合、
そのcandidateをbody-free reason countへaccountし、別candidateを評価する。
全候補を一つの局所失敗でabortしない。

代表的なbody-free診断は次のとおりだった。

| case | result | machine note |
|---|---|---|
| 0001 | selected | Gate pass 1 |
| 0002 | no valid | P3 `VERIFIED_BINDING_INVALID` |
| 0009 | selected | Gate pass 1 |
| 0019 | selected | Gate pass 2 |
| 0035 | selected | base 2、forward reject 1、Gate pass 1 |
| 0043 | selected | Gate pass 2 |
| 0063 | no valid | base 2、density reject 2 |
| 0100 | selected | base 2、forward reject 1、Gate pass 1 |

本文、input、owner expression、parsed rangeは出力・保存していない。

## 6. 検証結果

### 6.1 P4固有GREEN

```text
runtime disconnect: 13 passed / 0 failed
dependency closure: 5 passed / 0 failed
manifest tool --check: PASS
py_compile: PASS
```

manifest結果:

```text
source files: 219
active / hashed / reserved: 11 / 10 / 7
static / dynamic project edges: 52 / 18
unexpected / unbound / reverse / reserved-present: 0 / 0 / 0 / 0
source closure: 29abbb08da497c902ea56cffbc82703801c7228f86e8a4f0f95d00800c31456b
```

### 6.2 frozen-stage testの扱い

P2 / P3 mutation・independence suiteは`69 PASS / 2 stage-lock STOP`だった。

- `STEP11_RC0030_P2_RUNTIME_ADAPTER_EARLY`
  - P2完了時点でruntime不存在を固定する過去phase条件であり、P4 runtime追加により予定どおり発火した。
- `STEP11_RC0030_P3_FROZEN_AUTHORITY_DRIFT`
  - P3完了時点のHard Gate full hashを固定する過去phase条件であり、P4 appendにより予定どおり発火した。

freeze済みtestを後から変更してGREENにしていない。残る69 behavioral / mutation nodeは全PASSである。

rc0029 predecessor selected suiteは`10 PASS / 1 stage-lock STOP`だった。
STOPはrc0029 runtime-disconnectのhistorical reverse-import scanが、
承認済みrc0030 manifestからrc0029 parentへのimportをfuture versionとして理解しないためである。
P4 manifest自身のcurrent closure scanは、このversioned historical parent edgeをbindした上でreverse import `0`である。

### 6.3 P1 / P5入口診断

```text
P1 diagnostic: 5 passed / 1 failed
failed node: test_rc0030_p1_controls_share_common_contract_without_regression
closed code: STEP11_RC0030_P1_SUBJECT_NOT_SELECTED
```

これはP4固有testの失敗ではない。P5で同一P1 suiteをGREENにする前に解決すべきSTOPである。

## 7. 0002 P5-entry blocker

### 確認した事実

- 0002のrc0030 candidateはtyped semantic atomが`0`、grounded Reception bindingが`1`である。
- final Body-only Parserは本文をparseできる。
- frozen P3 Independent Matcherはsemantic binding 0件を構成する。
- frozen P3 verified-binding material validatorはsemantic bindingを最低1件要求する。
- そのため`STEP11_RC0030_VERIFIED_BINDING_INVALID`となり、P4 Gateはcandidateを拒否する。
- P4 runtimeはこの拒否を例外へ変換せず、`no_valid_candidate`としてexactly accountする。

### 推測

P3の最低1 semantic binding条件は、typed semantic atomを持つP3代表4件では妥当だったが、
typed atom 0件でもReceptionをexact bindingすべきcontrol 0002をdomainへ含めていなかった可能性が高い。

### 華恋の意見

Hard Gate側で空のsemantic bindingを捏造する、P3 errorを無視する、
またはcontrol 0002だけを旧Surfaceへfallbackするべきではない。
それらはIndependent Matcher、case branch禁止、control非回帰の意味を壊す。

P4は現在のfail-close実装でfreezeし、P5を純粋な回帰phaseとして開始する前に、
`zero typed-semantic + grounded Reception`の正当なcardinalityを扱う
新しい設計20.3影響範囲補遺を作るべきである。

## 8. 変更していないもの

- grounded lexicalization P2 full file: `592f3ab7c90831c3191f51e9e7dd9a1f8c3fe4add1fd31bba9fdc65dccaecc28`
- Natural Surface P2 full file: `8f8ea6f197bac02edc8ee3594165625e1e8f06e5a6a7bb44e41445d880ae9c37`
- P3 Matcher full file: `629305364ac50530265d7d87a6ca28678eb3e1be6ac7289ae770b3b5f871d8c9`
- rc0030 catalog: `d51b8df3a7914aaa095a8b5249dd799f3dab2d8c706b07cea93e71a5b01ceb86`
- representative fixture: `9cfbdafaf43a3caed8b5dc00e68b56cd2b24003a002f0a7cbd1c3ec06d598fa5`
- P1 test: `56bc3603392df982ae748c9c4ae635fc7eca7867213f77bab1de051f35f38191`
- P2 test: `b04e8a6c6038ebc0dfde8b15d520ec9454f290977f611b295c7765299035925e`
- P3 test: `e910ba05b8a272784b3a9704604eec510eb153993b1ab094476d5b19631ba30e`
- Step 9、E1b、rc0027 / rc0028 / rc0029-prefixed existing behavior
- shared runtime / public route / reply / DB / RN / Safety / question owner

## 9. 次の境界

次はP5実行ではなく、次の影響範囲補遺である。

> `rc0030 P4 Gate / Runtime / Closure freezeを承認する。P5を開始せず、P3 frozen symbolとP4 Gate / runtimeを不変にして、zero typed-semantic + grounded Reception candidateのverified binding cardinalityと、P2 / P3 / rc0029 historical stage-lock testのphase-aware successor treatmentを対象とする設計20.3影響範囲補遺を作成する。Independent Matcher、body-only recoverability、case branch禁止、resource boundを維持し、既存symbol変更または新version owner / pathが必要なら実装前に停止してexact影響範囲を提示する。`

この補遺が承認されるまでP5、E2、E3、E4、Cycle 001 acceptanceへ進まない。
