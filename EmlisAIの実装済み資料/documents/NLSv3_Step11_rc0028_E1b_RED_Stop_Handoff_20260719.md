# NLS v3 Step 11 rc0028 — E1b information-sufficiency RED / STOP handoff

## 0. 結論

- baseline: GitHub `MassyuRed/mashos-api` commit `50f80a4f875b8edd9211025a9094a21ca5363512`
- checkpoint: `rc0028 E1b RED fixed / information sufficiency not satisfied`
- E1b result: `RED_CONFIRMED / STOP`
- rc0028 status: `EXPERIMENT_ONLY / NOT_FROZEN`
- E2 Independent consumption: `NOT_STARTED`
- Cycle 001: `NOT_ACCEPTED`
- production connection: `UNCHANGED`
- secure material / Mash-side file operation: `NOT_REQUIRED`

E1bの5境界を、新規RED test 5件として固定した。現行v1 witnessは5件すべてで期待contractを満たさない。さらに、自然なcross-span coexistenceの一部はcanonical Grounded planにrequiredなcoexistence authorityとして存在せず、lexical witnessだけでendpoint / directionを作るとauthorityの捏造になる。

したがって、今回の指示に従い実行ownerの修復を開始せず停止した。Step 9 frozen owner、historical manifest、Surface / Parser / Matcher / Gateは変更していない。

## 1. 確認した事実

### 1.1 baseline / frozen closure

GitHub commitとlocal worktreeをexact一致させ、次を確認した。

| owner | SHA-256 | Step 9 manifest |
|---|---|---|
| `emlis_ai_grounded_observation_plan.py` | `b422093f907f3a825ec30f687f2f8b1d2688bf89950d9bc7436bfe0b5a67d177` | 一致 |
| `emlis_ai_grounded_observation_semantic_restatement_v3.py` | `a014e942b34c2c8f2a424dda0b0ecd30cb34ff99112e813d2182ad84d34b65fc` | 一致 |
| `emlis_ai_semantic_obligation_inventory_v3.py` | `1dadb411fad46abb617da9ef9fcb48b18d8be987318966616d804c6ec69adbcb` | 一致 |

`validate_step9_dependency_manifest()`は`PASS`。上記3 ownerの1 byte変更でも現行policyでは`STEP9_DEPENDENCY_SOURCE_BYTES_DRIFT`になる。

### 1.2 baseline regression

- rc0028 E0a / E1a witness + experiment snapshot + original Step 4: `49 passed`
- warning: Pydantic v1-style `root_validator` deprecation 1件。今回変更由来ではない。
- tracked production source change: `0`

### 1.3 E1b RED

新規test:

`ai/tests/test_emlis_nls_v3_s11_rc0028_e1b_information_sufficiency_red.py`

結果:

- `5 failed`
- failureは意図したREDであり、collection error / import error / source-body leakではない。

| RED | baselineで確定したfailure |
|---|---|
| cross-span owner closure | contrast / sequenceのendpoint bindingがない。自然なembedded-marker coexistenceはupstream required authority自体がない |
| overlap losslessness | owner-local overlapが`LEXICAL_ROLE_AMBIGUOUS_ROLE_OVERLAP`となり、construction / owner alias / link / unknownを全て落とす |
| relation endpoint-direction mutation | relation endpoint bindingがないためswap / reverse attackを検証できない |
| explicit unknown | semantic-restatementにはexplicit unknownがあるがlexical unknown bindingがない |
| covered misuse | `covered_required_nucleus_ids`がsnapshotへ伝搬し、facet presenceだけという機械強制可能な否定authorityがない |

### 1.4 frozen 100全体監査

case本文・output本文を出力せず、body-freeな件数だけを集計した。

| metric | count |
|---|---:|
| rows | 100 |
| plan relations | 165 |
| required cross-span relations | 68 / 45 rows |
| required relationの両endpointにlexical facetあり | 17 |
| 片endpointだけ | 26 |
| 両endpointなし | 25 |
| plan unknowns | 516 |
| Evidence付きplan unknowns | 0 |
| semantic-restatement explicit unknowns | 27 / 20 rows |
| explicit unknownのaffected ownerが既存`covered`に入るもの | 8 / 7 rows |
| semantic units | 10 |
| semantic links | 5 |
| owner-local ambiguous overlap | 1 row |

required cross-span relation 68件中、lexical roleが両endpointで閉じるのは17件だけである。51件は片側または両側のrole closureを持たない。

plan unknown 516件はEvidenceを持たないmissing-information診断であり、source-explicit unknown 27件の代用にはできない。

### 1.5 cross-span coexistence authority boundary

REDのbody-free構造判定は次のとおり。

- explicit cross-span contrast: `contrast / required / user_stated_relation`あり。
- explicit past-to-current sequence: `shift_from_to / required / user_stated_relation`あり。
- sentence-boundary後のembedded coexistence marker: `coexistence / required`なし。現行結果は`uncertain_connection / should / bounded_structural_inference`。

最後の構造をlexical witnessのregexだけで`coexistence`へ昇格すると、canonical ownerにないrelation type、endpoint、directionを実験witnessが自己発行することになる。

### 1.6 overlap / owner alias boundary

body-free case ID `0054`では、現grammarが認識する2 constructionのrole facetは合計6件で、数値上限6以内に収まる。しかし同じparent nucleusに対し、antecedent / consequent role kindが各2件必要になり、現contractの「同一adapted ownerで同kind 1件以下」に反する。

既存semantic-restatementは2 units、1 link、explicit unknownを保持するが、inner sequence connectorの独立ownerとnested construction関係は保持しない。現witnessは順番勝ちやtruncateをせずowner全体をunresolvedにするため安全側だが、losslessではない。

またbody-free case ID `0038 / 0051`では、lexical facet 5件がbase snapshotのadapted semantic ownerへ一意に解決できない。`0051`ではlexical rangeがsemantic-unit境界を跨ぐため、Evidence一致だけでも一意に割り当てられない。

## 2. 推測

1. 現状の主因は「raw sourceがない」ことではなく、canonical relation / semantic unit / explicit unknownとlexical constructionの間に、losslessなtyped join ownerがないことである。
2. relation endpoint / directionとexplicit unknownの大部分は既存frozen artifactからbody-freeに参照できるため、これらだけならexperiment witness successorで閉じられる可能性が高い。
3. 一方、natural cross-span coexistenceとnested overlapは、現v1 witness field追加だけではauthority sourceが不足する。frozen Planを直接変更せず、experiment-onlyなversioned upstream authority ownerを置く方がhistorical closureを保ちやすい。
4. `covered`の名称変更と否定flagだけではfuture consumerの誤用を完全には証明できない。E1bではfacet-presence-onlyを固定し、実際のconsumer / Gate attackはE0bで独立に証明する必要がある。

## 3. 華恋の意見

ここでは止めるのが正しい。現行Planを変更するとStep 9 live-byte freezeに衝突し、lexical witnessだけでcoexistenceやnested topologyを補うとauthorityを越える。数値bound、Gate、candidate / recovery上限を緩める理由もない。

次へ進むなら、Mashの追加承認対象はproduction修復ではなく、次の影響範囲補遺である。

1. 旧Plan / semantic-restatement / inventoryをbyte不変にした、experiment-only upstream relation / construction authority successor。
2. construction instance ID、nested parent / child graph、parent nucleus→semantic unit alias、range-crossing owner ruleのclosed schema。
3. relation endpoint role / directionとexplicit unknown bindingを持つlexical witness successor schema。
4. `facet_present`と`semantic coverage`を型・validator・snapshotで分離する否定authority。
5. rc0027 historical closureを親にしたappend-only rc0028 experiment dependency closure。

E2、Surface、Parser、Matcher、Gate、active `GroundedSourceSnapshot`統合は、この補遺とE1b修復がGREENになるまで開始しない方がよい。

## 4. 必要な追加authority案

次の指示なら境界が明確である。

> 「rc0028 E1b RED / STOPを承認。既存Step 9 frozen ownerを不変にし、experiment-only upstream relation / nested-construction authority successorの影響範囲補遺を作成する。cross-span coexistence、construction instance graph、parent→semantic-unit alias、relation endpoint-direction、explicit unknown binding、facet-presence-only guardをclosed schemaで定義し、現REDを保持して修復可能性を再判定する。」

この承認はE2開始、production接続、formal candidate化、Cycle 001 ACCEPTEDを含まない。

## 5. 根拠と必要性

| 追加候補 | 根拠 | 必要性 |
|---|---|---|
| experiment-only relation authority | natural cross-span coexistenceがcanonical required relationにない | lexical layerによるrelation捏造を避ける |
| construction instance / nested graph | 6 facet以内でも同owner同kind重複とinner sequence owner欠落がある | overlapを後勝ち・truncateなしでlosslessにする |
| parent→semantic-unit alias | parent nucleusがbase snapshotでunitへ置換され、rangeがunit境界を跨ぐ例がある | roleからsource ownerへ一意に戻す |
| typed relation / unknown binding | base artifactとlexical witnessは同居するだけでjoin invariantがない | endpoint swap、direction reverse、unknown mutationをfail-closeする |
| facet-presence-only guard | explicit unknown未接続でもaffected ownerが`covered`になり得る | semantic coverageの自己申告・誤用を防ぐ |
| versioned dependency closure | frozen ownerのlive bytes変更はStep 9 driftになる |historical closureを上書きせずsuccessorを検証する |

## 6. 明示的に変更していないもの

- `emlis_ai_grounded_observation_plan.py`
- `emlis_ai_grounded_observation_semantic_restatement_v3.py`
- `emlis_ai_semantic_obligation_inventory_v3.py`
- Step 9 historical dependency manifest
- rc0028 E0a / E1a witness / experiment snapshot
- Step 11 Surface / Parser / Matcher / Hard Gate
- candidate / catalog / rendered bytes
- public API、DB、RN、Safety、question system、routing
- candidate 12、replan 1、recovery bound、one-anchor上限

## 7. 配布物

新規ファイルだけをZIPへ含める。

1. `mashos-api/ai/tests/test_emlis_nls_v3_s11_rc0028_e1b_information_sufficiency_red.py`
2. `NLSv3_Step11_rc0028_E1b_RED_Stop_Handoff_20260719.md`
3. `NLSv3_Step11_rc0028_E1b_RED_Receipt_20260719.json`

実行tool / production sourceの差し替えはない。testは意図的なRED checkpointなので、GREENとして扱わないこと。
