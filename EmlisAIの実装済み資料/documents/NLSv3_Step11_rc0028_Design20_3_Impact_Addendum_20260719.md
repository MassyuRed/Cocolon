# NLS v3 Step 11 rc0028 — 設計20.3 影響範囲補遺 / bounded experiment authority receipt

## 0. 文書状態

- authority status: `AUTHORIZED_FOR_BOUNDED_EXPERIMENT`
- candidate: `nls_v3_rc_0028`
- target: Step 11 Cycle 001
- Cycle 001 status: `NOT_ACCEPTED`
- rc0028 status: `EXPERIMENT_ONLY / NOT_FROZEN`
- authority decision: Mashによる「Aを承認。設計20.3の影響範囲補遺を作り、rc0028でupstream lexical roleのbounded experimentを開始する」
- GitHub implementation baseline: `5d16f9e87cb90acd8f2d62a71aa39549d40938a3`
- predecessor: `nls_v3_rc_0027`
- predecessor surface catalog SHA-256: `1beec18839ed77abd1e52b0a06eb60c5867223fd54183c251a8f0efbc37ccc08`
- body-free: `true`

本補遺は、設計20.3が原則非変更としているupstream ownerへ、限定された実験変更を行うauthority receiptである。実験開始を承認するものであり、rc0028の採用、formal freeze、Cycle 001の`ACCEPTED`、production接続を承認するものではない。

設計書本文11.2の「raw long quoteを第一選択にしない」「visible source anchorは一候補1件以下」「generic referentだけでrequired obligationをcoverしない」は変更しない。本補遺と設計書本文が競合する場合、非変更contractと安全側の規則を優先する。

## 1. 発動理由

### 1.1 確認した事実

1. rc0027 Tier 1では、代表8件がmachine上`8 / 8 selected`であっても、Product Readは`PASS 2 / MINOR 1 / MAJOR 5`だった。
2. frozen 100件のread-only確認は、`selected 56 / no-valid-candidate 2 / fail-close 42`だった。
3. 未解決MAJORの共通像は、複数referent、意味変化の順序、thoughtとactionの具体的関係が、genericな状態・出来事・望みへ圧縮されることだった。
4. rc0027の`GroundedSourceSnapshot`はsource authority、kind、operator、modality、temporal scope、relation、unknown、lifecycle等を保持する一方、Surfaceが複数の入力固有referentを区別して短いsemantic-feature phraseへ戻すための十分なtyped lexical role / referent facetを持たない。
5. 設計20.3は、`emlis_ai_grounded_observation_plan.py`等を初期v3で変更しない方針とし、変更が必要と判明した場合には影響範囲を別提示してから進めることを要求する。
6. Mashは、上記不足に対する選択肢Aのbounded experimentを明示的に承認した。

### 1.2 推測

rc0027の一候補1anchor制約と現行snapshot属性だけを維持したままcoverageを増やすと、generic phraseで意味を潰すか、specificityを守ってfail-closeするかの二択になりやすい。入力本文をSurface側で再解釈するのではなく、source authority側で型付きroleを確定し、body-free snapshotへ渡すことで、この二択を一部解消できる可能性がある。

### 1.3 華恋の意見

この不足は、Gate弱化、複数anchor化、case別phrase追加より先に、owner境界の情報十分性として検証するべきである。ただし、role追加だけで商品自然さへ届く保証はない。そのため、対象case、変更owner、成功条件、停止条件を先に閉じたrc0028実験として行い、効果がなければ設計25.1のmodel-free再判断へ戻す。

## 2. 許可する意味契約

### 2.1 追加可能な情報

upstream ownerは、既存Evidence / Nucleus / Relation / Unknownのauthorityからだけ、次のbody-safe typed bindingを導出してよい。

- `lexical_role_kind`: closed enum。例は`referent`、`predicate_or_event`、`state_or_quality`、`transition_or_relation`、`action_lifecycle`、`unknown_or_limit`。
- `source_owner_id`: alias化されたnucleus / semantic unit / relation / unknown ID。
- `evidence_alias_ids`:既存source Evidenceへ解決するalias ID。
- `source_field_role`: thought / action / selected label等の既存閉集合への写像。
- `referent_facet_codes`: sourceにより証明できるclosed machine code。任意語句を値にしない。
- `relation_endpoint_role`と`direction`: 既存relation authorityがある場合だけ付与する。
- `polarity`、`modality`、`temporal_scope`、`action_lifecycle`: 既存source属性からlosslessに投影する。
- `visible_authority`: `feature_only`または既存11.2に適合する`sole_anchor_eligible`。anchor数を増やす権限ではない。
- provenance / policy / schema hash: role生成ownerとsource closureをbody-freeに結ぶもの。

role値は完成文、助詞付きphrase、fixture固有語、入力本文substring、expected outputを保持してはならない。本文が必要な処理は、request-localなEvidence resolverを通じてsource authorityへ照合し、snapshot、receipt、repo fixtureへ本文を複製しない。

### 2.2 resource bound

- 1 adapted nucleus / semantic unitにつき、同一`lexical_role_kind`は1件以下とする。
- role binding総数は、`6 × adapted nucleus count + 2 × relation count + unknown count`以下とする。
- bound超過時はtruncate、score順間引き、後勝ちを行わず、閉じたfailure codeでfail-closeする。
- role追加を理由に、candidate総数12、replan 1回、既存recovery boundを増やさない。
- runtime辞書の学習、外部モデル、embedding、ネットワーク問い合わせ、無制限探索を追加しない。

このboundが実入力構造をlosslessに表せないと判明した場合、実装中に拡張せず停止し、別の影響範囲提示を行う。

## 3. authorized owner scope

### 3.1 upstream authority owner

次だけを許可する。

| owner / file | 許可する変更 | 制限 |
|---|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_lexical_role_witness_v3.py`（新規） | validated Grounded planとrequest-local Evidence resolverから、body-freeなrange / role / construction / hash witnessを独立生成・検証する | Step 11 renderer / matcherをimportしない。raw body、完成文、case cueをartifactへ保持しない |
| `ai/services/ai_inference/emlis_ai_grounded_lexical_role_experiment_snapshot_v3.py`（新規） | 現行`GroundedSourceSnapshot`のbody-free commitmentとlexical-role witnessを、runtime非接続のexperiment snapshotへ結ぶ | 現行Step 4 / Step 9 historical closureを変更しない。covered ownerをsemantic coverageとして扱わない |
| `ai/services/ai_inference/emlis_ai_grounded_observation_semantic_restatement_v3.py` | 既存Evidence / Nucleus / Relationからbody-free lexical role witnessを独立生成・検証する | raw body、完成文、case cueをartifactへ保持しない |
| `ai/services/ai_inference/emlis_ai_semantic_obligation_inventory_v3.py` | 独立experimentで情報十分性とStep 9以降のsuccessor dependency closureをREDで証明した後に限り、`GroundedSourceSnapshot`へtyped role binding、hash、resource countを追加する | 現行historical dependency manifestを上書きしない。caller自己申告をauthorityにしない。provenance capabilityを迂回しない |
| `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 上記2 ownerだけではsource meaningを一意に導出できないことをREDで証明した場合に限り、`GroundedSemanticNucleus`等へbody-safe role sourceを最小追加する | response selection、reception、Safety、question、routing、public behaviorを変更しない。変更理由をchange ledgerに記録する |

実装順は、既存semantic restatement layerと同じauthority位置に独立witnessを置き、現行runtimeとは別のexperiment snapshotで情報十分性を先に確認してから、現行snapshotへの伝搬可否を判断する。独立moduleとする理由は、rc0027で使用中のsemantic restatement schema / hashとStep 9 historical closureをE0 / E1aで変更せず、失敗時に新規ownerだけを切り離してrollbackできるためである。`emlis_ai_grounded_observation_plan.py`の変更は包括的承認ではなく、role sourceの型・生成・validation・hash closureに限定した条件付き例外である。

### 3.2 downstream consumer

rc0028の効果を検証するため、次のconsumer変更を許可する。

- Step 11 forward lexicalization / controlled Surface owner: typed roleを入力にし、semantic-feature phraseを構成する。
- Body-only Parser: 最終bytesから、制御文法上visibleなrole witnessだけを復元する。
- Independent Matcher: candidate metadataを信用せず、source snapshotとParsed Surface Witnessを独立照合する。
- Hard Gate: 新しいrole bindingの不足・曖昧さ・source mismatchをhard failへ追加する。既存failureをpassへ変える弱化は許可しない。
- schema / dependency manifest / body-free receipt / RED・regression test / read-only runner: rc0028 closureの固定に必要な範囲。

surface catalogを変更する場合は、roleの共通閉集合を表す最小変更だけを許可する。case用完成文、固有語句、family別例外を追加しない。

### 3.3 forward / inverse独立性

1. forward renderer / lexicalizerとIndependent Matcherは別module・別coverage実装を維持する。
2. Matcherはforward ownerのphrase選択関数、profile選択関数、candidate coverage resultをimportしない。
3. forwardとmatcherが共有してよいのは、closed schema、enum、canonical serialization、frozen policy hashだけである。
4. Matcherは最終本文からParserが復元したvisible witnessをsource snapshotへ照合し、candidateのowner ID、role ID、`realized_unit_ids`を証拠として採用しない。
5. forward側のrole metadataを保持したまま本文をgeneric bodyへ置換するattackは、Parser / Matcher / Gateのいずれかで必ずfailする。
6. source roleの削除、endpoint swap、direction reverse、polarity / modality / lifecycle mutation、evidence alias swapは、期待されたbinding変化またはfail-closeを起こす。

## 4. 明示的に変更しない範囲

本authorityは次を許可しない。

- public API request / response schema、visible envelope、HTTP routing
- DB schema、physical name、migration、write path、保存責任
- RN production code、入力option、submit condition、表示条件、端末接続
- account、subscription、entitlement、access、削除導線
- Safety owner、Safety判定、separate safety routing、identity boundary
- question-system owner、問い要否、問い文、問い回数、observation stageの自己昇格
- v1 / v2 source、停止artifact、停止cohortのimportまたは再利用
- Step 17より前のpublic owner state switch、production接続、feature flag切替
- 設計11.2のone-anchor上限、raw long quote禁止、generic-only coverage禁止
- candidate総数、recovery / replan上限の拡張
- Gate severityのdowngrade、failure codeの黙示的無視、no-validをsuccessへ数える変更
- case ID、family ID、fixture名、batch番号、review verdict、expected textをgeneration pathへ渡すこと
- arbitrary phrase bank、入力固有語辞書、正規表現によるcase専用分岐、完成文固定

この非変更範囲のいずれかが必要になった時点で、rc0028実装を停止し、理由と追加影響範囲をMashへ提示する。

## 5. bounded experiment corpus

case本文や出力本文は本補遺へ記載しない。case IDはevaluation runnerだけが使い、generation pathへ渡さない。

| case ID | rc0027 Product Read | rc0028での役割 |
|---|---|---|
| `0001` | PASS | generic化・自然さの非回帰control |
| `0002` | PASS | action lifecycleの非回帰control |
| `0009` | MINOR | relation / temporal changeの境界control |
| `0019` | MAJOR | thoughtとcompleted actionのreferent分離 |
| `0035` | MAJOR | 複数topicとongoing actionのreferent分離 |
| `0043` | MAJOR | 状態から行動への遷移保持 |
| `0063` | MAJOR | failure、再評価、self-denial、action orderの保持 |
| `0100` | MAJOR | relationship / value / boundary actionの保持 |

実験は次の順で行う。

1. `E0a Upstream RED`: role schema、origin authority、resource bound、body-free、tamper / mutation attackを先に失敗として固定する。
2. `E1 Upstream`: typed roleをupstreamで生成し、まずruntime非接続のbody-free experiment snapshotへ伝搬する。Surface文言は評価理由にしない。losslessな情報十分性とsuccessor dependency closureを証明した場合だけ、現行snapshotへの統合可否を別判定する。
3. `E0b Downstream RED`: forward / Parser / Matcher / Gateへproduction変更を加える前に、forward / matcher独立性、body-only復元、role mutation attack、generic-body置換attackを失敗として固定する。
4. `E2 Independent consumption`: E1とE0bが通過した場合だけ、forward、Parser、Matcher、Gateを独立に同期する。
5. `E3 Representative 8`: 代表8件のmachine checkと華恋のProduct Readを行う。
6. `E4 Frozen 100 read-only`: E3を通過した場合だけ、formal packetを作らずfrozen 100件へ広げる。

E3を通過しない場合、E4へ進まない。E4を通過してもformal acceptanceへ自動移行しない。

## 6. experiment success criteria

### 6.1 structural / machine criteria

- role schemaはclosed、strict typed、canonical serialization可能で、unknown key / enum / duplicate roleを拒否する。
- source snapshotのorigin rebuild、policy hash、resource count、dependency closureへroleが含まれる。
- roleからsource Evidence / Nucleus / Relation / Unknownへ一意に解決できる。
- forward / Parser / Matcher / Gateのmutation suiteがgreenである。
- 代表8件は`8 / 8 selected`を維持し、sole visible anchorは各候補1件以下である。
- rc0027でpassしていた既存Hard Gateを弱化せず、新しいrole mismatchはfail-closeする。
- exact duplicate 0を維持する。
- no case-specific cue、phrase bank、completed sentence、review metadata流入がstatic / dynamic scanで0件である。

### 6.2 Product Read criteria

- rc0027でMAJORだった5件は、全件が`PASS`または`MINOR`になる。
- control 3件は、rc0027よりseverityが悪化しない。
- 入力固有性、意味保持、順序・関係、action lifecycle、自然さのいずれにも新規MAJOR / BLOCKERがない。
- machine PASSだけをProduct Read PASSの代替にしない。

### 6.3 frozen 100 read-only criteria

E3通過後のE4では、rc0027の`selected 56 / no-valid 2 / fail-close 42`を比較基準にする。

- rc0027でselectedだった56件に、新しいmachine regressionを作らない。
- selected数は56を超える。
- 代表8件以外で、rc0027ではspecificity不足によりfail-closeしていたcaseが1件以上新たにselectedになる。
- 新たにselectedになったcaseとoutput bytesが変わったcaseを華恋が読み、MAJOR / BLOCKERが0件である。
- duplicate 0、sole anchor 1件以下、generic-only required coverage禁止を維持する。
- historical / Step 0〜9 regressionのfailure集合を増やさない。rc0027時点の既知failure / errorを無視・削除してgreenと主張しない。

これらはexperiment viabilityの基準であり、Cycle 001 acceptance criteriaではない。

## 7. stop / rollback条件

次のいずれか一つで、rc0028を`EXPERIMENT_REJECTED`として停止する。

1. typed roleをsource authorityから一意に導出できず、Surface側の本文解析やcase cueが必要になる。
2. snapshot / ledger / receiptへraw input、output body、任意substring、個人情報を保持する必要が生じる。
3. 一候補1anchorを超える、raw long quoteを増やす、generic-only coverageを許可する必要が生じる。
4. Matcherがforward ownerの実装結果またはcandidate metadataを信用しないと一致できない。
5. role bound、candidate bound、recovery boundを超えないと代表構造を処理できない。
6. 代表5 MAJORのいずれかがMAJOR / BLOCKERのまま、またはcontrolが悪化する。
7. frozen 100でrc0027-selected caseに新規regressionが出る、または改善が代表caseだけに閉じる。
8. public API / DB / RN / Safety / question / owner switchの変更が必要になる。
9. security、source authority、privacy、append-only lineageの新規regressionが出る。
10. 設計25.1が禁じるGate弱化、phrase bank拡張、case専用修復なしではProduct Readへ届かない。

rollbackは、rc0028で追加したsource / test / manifest / receiptだけを不採用にし、rc0027をimmutable predecessorとして保持する。rc0027の証拠を書き換えず、rc0028の失敗理由をbody-freeなappend-only change ledgerへ残す。rollback後もCycle 001は`NOT_ACCEPTED`のままとする。

## 8. evidence / privacy boundary

### 8.1 repo / 配布ZIPへ含めてよいもの

- schema、enum、validator、source code、test code
- body-free case ID、commitment、SHA-256、件数、latency、failure code、severity集計
- source owner / dependency closure / policy hash / changed file hash
- mutation名、machine判定、Product Readのbody-free reason code
- 本補遺、body-free handoff、append-only change ledger

### 8.2 repo / 配布ZIPへ含めないもの

- frozen corpusの入力本文、生成本文、body-full差分、長い引用
- Supabase実ユーザーraw corpus、匿名化前本文、個人情報
- private review packet、華恋のbody-full読解メモ
- commitment key、HMAC key、secure material、private export
- local ignored workspace、`__pycache__`、`.pyc`、一時実行output

Product Readに必要な本文はlocal private workspaceだけで扱い、repoへはbody-freeなseverity、reason code、commitment、countsだけを残す。formal evidence、secure key、private packetが必要になる境界では自動生成せず、Mashへ具体的な作業を依頼する。

## 9. acceptance非主張

次の表記だけを許可する。

- E0〜E2通過: `rc0028 implementation checkpoint`
- E3通過: `rc0028 representative experiment passed`
- E4通過: `rc0028 bounded experiment viable`

次の表記は、本補遺だけでは許可しない。

- `rc0028 accepted`
- `Cycle 001 accepted / completed`
- `formal candidate frozen`
- `production ready`
- `Step 11 completed`

Cycle 001を`ACCEPTED`へ進めるには、bounded experiment後に、設計18.4 / 18.5、Step 11 cumulative evaluation、全必要regression、body-free evidence graph、formal freezeに必要な別authorityを満たす。rc0028のtext-affecting sourceを変更した場合、過去RCのmachine / Product Read evidenceを継承せず、新run IDで再実行する。

## 10. 実装開始receipt

本補遺により、rc0028はE0 REDから開始してよい。実装者は最初のproduction変更前に、次をchange ledgerへ固定する。

1. baseline commitとrc0027 catalog hash
2. 変更するownerと、そのownerでなければならない理由
3. 追加するrole schema / resource bound
4. 非変更contractとforbidden workaround scan
5. representative 8とmutation suite
6. rollback path

上記範囲を超える必要が判明した場合、このauthorityを拡大解釈せず停止し、Mashへ追加判断を求める。
