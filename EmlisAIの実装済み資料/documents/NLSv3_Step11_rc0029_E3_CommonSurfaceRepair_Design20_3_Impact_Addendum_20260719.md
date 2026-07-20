# NLS v3 Step 11 rc0029 — E3 Common Surface Repair 設計20.3 影響範囲補遺

作成日: 2026-07-19 JST  
作成者: 華恋  
対象工程: `Step 11 / Cycle 001`  
文書種別: `post-E3 repair-only impact scope addendum`  

## 0. 結論 / 文書状態

- impact scope: `DEFINED`
- implementation authority: `NOT_GRANTED_BY_THIS_DOCUMENT`
- implementation start: `REQUIRES_MASH_EXPLICIT_ACCEPTANCE`
- predecessor checkpoint: `rc0028 E3 PRODUCT READ STOP / E4 NOT STARTED`
- repair candidate: `rc0029`
- feasibility decision: `CONDITIONALLY_FEASIBLE_WITHIN_D0_DOWNSTREAM_RESPONSIBILITY_SET`
- upstream / shared owner expansion: `NOT_REQUIRED_ON_CURRENT_EVIDENCE`
- versioned experiment-local exact-path expansion: `REQUIRED`
- Cycle 001: `NOT_ACCEPTED`
- secure material: `NOT_REQUIRED_AT_THIS CHECKPOINT`

本補遺は、rc0028 E3 Product Readで確定した`STOP_BEFORE_E4`を承認済みの前提として、次の共通Surface修復がどのownerへ影響するかを閉じる。

対象は次の4課題である。

1. `schema exposition`
2. `opaque ordinal referent`
3. `depth compaction`
4. `reception binding`

結論は、**意味authorityをupstreamへ追加せず、D0で分離した既存downstream 4責任の範囲内で共通修復できる見込みがある**、である。ただし、D0のexact path allowlistはrc0028用であり、設計18.2はsource change後のnew RC IDを要求する。したがって、rc0028のSTOP証拠を上書きせず、`rc0029`のversioned successor API / catalog / runtime / manifest / tool / fixture / testを別authorityとして明示承認してから実装する。

この文書だけではcode、test、fixture、manifestの変更を開始しない。§13の明示指示をMashが承認するまで`STOP_BEFORE_IMPLEMENTATION`とする。

---

## 1. 発動理由

### 1.1 確認した事実

1. 2026-07-19 JST確認時点の`MassyuRed/mashos-api`最新commitは`e069ffd782e4d2b960b2c1e770d9018ab78a8b1d`である。
2. このcommitの変更20 pathは、rc0028 downstream E0b〜E3 STOP packageのrepository 20 pathとpath集合・Git blob内容が一致している。
3. rc0028の状態は次のとおりである。

   - E0b: `GREEN`
   - E2: `GREEN`
   - E3 machine: `selected 8 / 8`
   - E3 Product Read: `PASS 1 / MINOR 1 / MAJOR 6 / BLOCKER 0`
   - former MAJOR 5件のPASS/MINOR化: `0 / 5`
   - control 3件の非悪化: `1 / 3`
   - new MAJOR / BLOCKER: `1 / 0`
   - E4: `NOT_STARTED`
   - Cycle 001: `NOT_ACCEPTED`

4. body-free E3 Product Read STOP receiptには、次のreason codeが記録されている。

| reason group | 件数 | 本補遺での扱い |
|---|---:|---|
| `MAIN_MEANING_OBSCURED` | 5 | 4課題修復後も必須非回帰 |
| `EMLIS_RECEPTION_UNBOUND` | 4 | 主対象 |
| `SCHEMA_EXPOSITION` | 3 | 主対象 |
| `OPAQUE_ORDINAL_REFERENTS` | 3 | 主対象 |
| `IMMEDIATE_OBSERVATION_NOT_READ` | 3 | Product Read必須非回帰 |
| relation unreadable / misread | 2 | endpoint / direction保持の必須非回帰 |
| unknown dropped / partial / duplicative | 3 | unknown exact保持の必須非回帰 |
| `DEPTH_OVERSHOOT` | 1 | 主対象 |
| self-denial separation underexplicit | 1 | Safety / meaning境界の必須非回帰 |
| repetitive / distribution concentration / generic reception | 複数 | 共通表現方式の必須非回帰 |

5. 現行rc0028 experiment catalogは、source ownerを次の可視tokenへ写像する。

   - 1番目: `その`
   - 2番目: `もう一方の`
   - 3番目: `さらに別の`
   - 4番目以降: `Nつ目の`

6. 同catalogは`構造を見ると`をconstruction lineのprefixにし、relation / semantic link / explicit unknownをclosedな説明tokenとして持つ。
7. 現行`_step11_rc0028_structure_lines()`は、construction、relation、semantic link、explicit unknownの各recordを原則1可視lineずつ追加する。
8. 現行`render_step11_rc0028_experiment_surface()`は、そのline群を`見えたこと`の末尾へ挿入し、base candidateの`Emlisから`本文bytesを再構成しない。
9. 現行Body-only Parserはfinal bytesだけからline種別とowner ordinalを復元し、Independent Matcherはsuccessor authorityへexact cardinality / endpoint / direction / unknownを照合する。
10. machine 8 / 8 GREENは、このforward / Parser / Matcher / Gateの情報閉包を示す。一方、設計18.4のProduct Readを代替しない。
11. 設計18.2はsource change後のnew RC IDを要求し、設計16.3はtext-affecting change後に過去RCのmachine / Product Read証拠を継承することを禁止する。

### 1.2 推測

E1b successorが増やした構造情報そのものは、machine上ではdownstreamへlosslessに到達している。現在の主問題は、そのmachine証明用のcardinality / owner / relation detailを公開本文へほぼ1対1で展開しているため、読み手には内部schemaの説明、順番だけで指す不透明な参照、過剰な深さとして現れる点にあると推測する。

また、rc0028がbase Receptionを保持したまま観測側へ構造lineを追加していることは確認事実である。これが`EMLIS_RECEPTION_UNBOUND`の一因である可能性は高いが、因果そのものはProduct Readと実装構造からの推測であり、formalな意味authorityではない。

語彙だけを言い換え、recordごとの列挙とordinal bindingを維持すると、構造数の多い入力で同じ問題が再発する可能性が高い。必要なのは、final bytesから独立再構築できる範囲で、referent導入、relation、unknown、Receptionを自然なsentence / clauseへ融合する共通Surface契約である。

### 1.3 華恋の意見

E4を開始しなかった判断は正しい。control悪化とformer MAJOR 5件の改善0 / 5は、局所的な語感ではなくSurface表現方式の失敗を示す。

次はrc0028の語句を直接上書きするのではなく、rc0028をimmutable predecessorとして固定し、rc0029で4-family REDを先に作るべきである。現時点では、Step 9、E1b、Content Selection、Discourse Planner、shared runtime、public routeを変更する必要性は確認されていない。

ただし、自然なreferent handleまたはReception antecedentを既存source authorityから一意に導出できないことがREDで判明した場合、downstreamだけで無理に補わない。その時点で実装を停止し、追加ownerと意味責任をMashへ提示する。

---

## 2. authority継承順位 / predecessor freeze

### 2.1 authority継承順位

1. `Cocolon_EmlisAI_ModelFreeNaturalLanguageSurfaceV3_DetailedDesign_ImplementationOrder_20260714_Revised_Cycle.md`
2. `NLSv3_Step11_rc0028_Design20_3_Impact_Addendum_20260719.md`
3. `NLSv3_Step11_rc0028_E1b_SuccessorAuthority_Impact_Addendum_20260719.md`
4. `NLSv3_Step11_rc0028_Downstream_E0b_E4_Impact_Addendum_20260719.md`
5. `NLSv3_Step11_rc0028_Downstream_E0b_E3_STOP_Handoff_20260719.md`
6. 本補遺

本補遺は、先行authorityを拡大解釈せず、E3 STOP後のrepair-only範囲へ狭める。競合時は、byte不変、runtime非接続、body-only recoverability、Independent Matcher、case cue禁止、resource非拡張、後発の狭いscopeを優先する。

### 2.2 predecessor commitment

| artifact | commitment |
|---|---|
| GitHub latest predecessor | `e069ffd782e4d2b960b2c1e770d9018ab78a8b1d` |
| E1b applied predecessor | `1453389dbfb693216c3b45605a4a3366506c397e` |
| D0 requested baseline | `31d3cf183589b27481338277574f90500f3c5b11` |
| E1b successor source closure | `404d0338dd02e573aee0029be68ca72b1fb544d62bf0e34d655b73ce78227e1e` |
| E1b generated manifest file SHA-256 | `ceb524a3d665f4b210005433a0040012fa050acd4f8c6e01bb151b94f94240b3` |
| E1b successor final receipt file SHA-256 | `9518f98dca7a8916a99f8b539ab34d42f0e4976a6dda69bab7dbe7dc0de8301d` |
| rc0028 downstream source closure | `08a83e30954055facdb711e1253a81145101e565afde4327567f239169f2d942` |
| rc0028 generated downstream manifest SHA-256 | `ffe0ff52e7d875e430d0878dced96c7b8994b05e6366ed9b4ff70055e8f2e8d0` |
| E3 machine receipt SHA-256 | `1a473850fc0e13bcb9288713cbe547635a065ec63f28aab0ff407ba9c7565de4` |
| E3 Product Read STOP receipt file SHA-256 | `923b368124b3f40b62488d2b48749b17c56c4aa2a2f0d6853f8e9aa0d84ca767` |
| D1 freeze ledger file SHA-256 | `326a0a990e1cc220d515de1511c34f7f58dbcad70fd33b4e277eb23e8af2691c` |
| E0b〜E3 STOP handoff file SHA-256 | `e38d3b42cd544911f55f9555f57e15514223e877f461f2880a39a4b5caba64b1` |

### 2.3 current exact-owner predecessor SHA-256

| path | SHA-256 at `e069ffd` |
|---|---|
| `ai/services/ai_inference/emlis_ai_step11_grounded_lexicalization_v3.py` | `cec416ee6f222aca6b63e0b355980adaadecc9abc03662272ce3ef745d7f5502` |
| `ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py` | `bb1d02f1e3eb20efb95cb9548798910ee7a9021c2ef174a50bec35029f4b1c4a` |
| `ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py` | `88fbfb603bf8ae32ac1c4f049cfffe444744722c91a702ea56caacb79af90f6b` |
| `ai/services/ai_inference/emlis_ai_step11_hard_gate_v3.py` | `e73a9f148f115f17777cc12b6a21952990d5d7c481ff14b5033c89abba499f58` |
| `ai/services/ai_inference/emlis_ai_step11_rc0028_experiment_surface_catalog_v3.py` | `a8c64cc9955aec460238250d2d538e25e2bc44623d6cbf8118f6592a7d890af3` |
| `ai/services/ai_inference/emlis_ai_step11_rc0028_experiment_runtime_adapter_v3.py` | `624079304970072ee1c078c62d9b25d6bea39d664c6d90508be844c70006ad29` |

rc0028 catalog、runtime、manifest、tool、fixture、test、receiptはimmutable predecessorとする。rc0029実装時に既存rc0028 APIのbytes / behavior / test expectedを修正しない。

---

## 3. 4 failure familyのclosed定義

| family | failureのclosed定義 | REDで固定すること | 禁止する見かけ上の修正 |
|---|---|---|---|
| `SCHEMA_EXPOSITION` | construction / role / relation / unknownのmachine分類を、観測よりschema説明として読める形で列挙する | 既存rc0028代表でschema説明markerとrow-per-line表現を検出しRED | `構造`を別の抽象名詞へ置換するだけ |
| `OPAQUE_ORDINAL_REFERENT` | source-authorizedな初出referentを可視導入せず、`その`、`もう一方`、`Nつ目`等の順番だけでownerを指す | owner順序mutation、同型owner複数、endpoint swapで曖昧参照をRED | ordinalを別のgeneric指示詞へ一括置換する |
| `DEPTH_COMPACTION_FAILURE` | required record数に比例して公開line / sentenceが増え、既存Content Plan depthを超える、または主要意味が埋没する | multi-construction + relation + unknownで、既存depth内のlossless fusionがない状態をRED | required meaning / unknown / endpointをdropして短くする |
| `RECEPTION_BINDING_FAILURE` | `Emlisから`が、観測で可視導入された入力固有referent / relation / unknownのいずれにもbody-onlyで一意bindingしない | generic、antecedent drop、antecedent swap、別owner receptionをRED | 固定の共感文、candidate metadata、forward owner IDで自己認証する |

4 familyの改善だけを理由に、`MAIN_MEANING_OBSCURED`、unknown、self-denial、relation direction、immediate-read、duplicate / distributionのfailureを無視しない。これらはE3の非回帰条件として同時に保持する。

---

## 4. common Surface repair意味契約

### 4.1 natural referent handle

1. referent handleは、E1b successorのtyped owner / construction / relation / unknown authorityと、validated rc0027 base candidateのbody-recoverable AST / grounded phrase projectionからforward専用に導出する。raw current input、case / family / review cueをreferent生成のtopic辞書として読まない。
2. 初出ではsource-authorizedなsemantic headを可視導入する。owner ID、case ID、schema code、registry ordinalを本文へ出さない。
3. 後続anaphoraを使う場合、Body-only Parserが初出handleと後続表現をfinal bytesだけから復元し、Independent Matcherがsource authorityへ候補1件でexact bindingできなければならない。
4. 同型ownerが複数あり一意化できない場合、first-match、source orderだけのordinal、任意score、hidden metadataで選ばずcandidateをfail-closeする。
5. visible source anchorはcandidate全体で既存上限1を維持する。referentを増やすためにraw input quoteを増やさない。

### 4.2 structure fusion / depth compaction

1. construction、relation、semantic link、unknownをrecordごとの説明lineとして列挙せず、source-authorizedなreferentを中心にsentence / clauseへ融合する。
2. 融合後もParsed WitnessとVerified Bindingのconstruction cardinality、role participation、relation endpoint / direction、semantic link、unknown dimension / affected ownerはsource authorityとexact一致する。
3. 既存Content Plan depth、section sentence、candidate 12、replan 1、recovery、one-anchorの上限を拡張しない。
4. depth内へ収めるためにrequired meaningを省略、generic化、semantic-equivalent扱い、covered owner扱いしない。収まらないcandidateはclosed failする。
5. R1 REDで、atom count、connected referent group、visible clause / sentence count、既存depth remaining budgetの決定論的accountingを先に固定する。GREENのために分母やbaselineを変更しない。

### 4.3 relation / unknown / self-denial preservation

1. source relationのfrom / to、direction、effective type、retentionを保持する。
2. semantic linkとconstruction internal linkを同一authorityとして潰さない。
3. source-explicit unknownはdimension、affected owner、required statusを保持し、重複も欠落も許可しない。
4. unknownを自然に圧縮する際も、原因・時点・選択・未言語化の区別を勝手に埋めない。
5. self-denialを入力の事実として採用せず、required separationが既存authorityにある場合は圧縮で弱めない。

### 4.4 Reception antecedent binding

1. 既存base snapshot / base ASTが持つ各required reception obligationについて、既存`reception_opportunity`または`reception_antecedent_binding`のtarget / support nucleusとexact一致するnon-stance targetへbindingする。少なくとも1件は、`見えたこと`で可視導入された入力固有handleへbody-onlyで一意に結ばれなければならない。
2. relationまたはunknownをReception antecedentにできるのは、それが既存required reception targetと同じsource authorityへexactに解決する場合だけである。任意のrelation / unknownへ1件だけ結ぶことでcardinalityを満たしたことにしない。
3. ParserはReception本文からclosed reception actとantecedent surface handleを復元する。Matcherはforwardのphrase spec、candidate AST、forward / candidate-declared owner ID、span mapを読まず、validated successor / base source authorityのowner IDを独立再計算して、全required reception obligationのtarget / support nucleusとcardinalityを照合する。
4. genericな`受け止める`、`大切にする`等だけではbound receptionとして通さない。
5. Receptionを結ぶために新しい原因、診断、人格、事実、問い、助言を追加しない。
6. required obligationごとのexact antecedentが作れない場合、base Receptionをそのまま残してGREENに見せずcandidateをfail-closeする。

### 4.5 public Surface禁止事項

- internal schema / owner / construction / slot / ordinalの説明
- `Nつ目`等、source-authorizedな初出referentを伴わない順番参照
- case / family / topic / reason-code固有branch
- arbitrary phrase bank、完成文fixture、expected output cue
- parser専用の不自然なdelimiter、hidden character、zero-width code、private marker
- required atomを落とすことでだけ成立する短文化
- machine selectedをProduct Read PASSとして扱うこと

### 4.6 non-goal

本repairは、Step 9 frozen owner、E1b successor、Content Selection、Discourse Planner、shared runtime、public route、Safety、question system、DB、RN、formal security、production owner switchを変更しない。

---

## 5. exact owner / path scope

### 5.1 条件付きMODIFYを許可する既存owner — exact 4

既存bytesへ直接分岐を挿入せず、file末尾のappend-only rc0029-prefixed APIだけを許可する。rc0027 / rc0028 API、constant、schema、candidate version、default output、selector、Gate resultを変更しない。rc0029のproject importはrc0029-prefixed function内のlocal importに限定し、shared rc0027 runtimeがexact 4を通常importしただけでrc0029 catalog / runtime / successorがtransitive loadされる構成を拒否する。

rc0029 candidateは`candidate_version_id="nls_v3_rc_0029_experiment"`とdistinctなrc0029 schema / catalog versionへbindする。rc0027 / rc0028 candidate、schema、catalog hashへ偽装しない。

| path | rc0029責任 | 必要性 | 不変条件 |
|---|---|---|---|
| `ai/services/ai_inference/emlis_ai_step11_grounded_lexicalization_v3.py` | E1b typed authorityとvalidated rc0027 base candidateのbody-recoverable AST / grounded phrase projectionから、natural-handle / fusion inputのclosed forward specを作る | Surfaceがraw current inputやcase cueからreferentを捏造しないため | rc0027 / rc0028 lexical spec、semantic coverage否定authorityを変更しない |
| `ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py` | rc0029 AST、natural referent導入、structure fusion、bound Reception、final bytesを構成する | 4 familyのforward共通修復owner | base / rc0027 / rc0028 rendererとcandidate behaviorを変更しない |
| `ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py` | final bytesだけを読むrc0029 Parserと、sourceへ独立bindingするMatcherを追加する | body-only recoverabilityと自己認証禁止を維持する | forward / lexicalizer / Gateのhelper、AST、span map、candidate metadataをimportしない |
| `ai/services/ai_inference/emlis_ai_step11_hard_gate_v3.py` | natural handle一意性、fusion losslessness、depth、Reception antecedentをadditive hard failureで検査する | machine GREENが4-family contractを満たすため | 既存failure集合、selector、recovery、default behaviorを弱めない |

この4 path以外の既存downstream source変更が必要になった場合はSTOPする。

### 5.2 NEW rc0029 exact allowlist

#### services

1. `ai/services/ai_inference/emlis_ai_step11_rc0029_experiment_surface_catalog_v3.py`
2. `ai/services/ai_inference/emlis_ai_step11_rc0029_experiment_runtime_adapter_v3.py`
3. `ai/services/ai_inference/emlis_ai_rc0029_surface_repair_experiment_dependency_manifest_v3.py`

catalogはclosed semantic / morphology / reception atomだけを持ち、完成文、case / family / topic cueを持たない。runtime adapterはexperiment-only、runtime-disconnected、public-owner-unchangedを固定する。

#### tools

1. `ai/tools/emlis_nls_v3_rc0029_surface_repair_dependency_manifest.py`
2. `ai/tools/emlis_nls_v3_rc0029_surface_repair_bounded_experiment.py`

#### fixtures

1. `ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_dependency_manifest_rc0029_surface_repair_experiment.json`
2. `ai/tests/fixtures/emlis_nls_v3/cycle_001/rc0029_representative8_body_free.json`

representative fixtureはexisting 8 IDs、rc0027 baseline、rc0028 STOP receipt commitment、control / improvement roleだけを持つ。input / output本文を複製しない。

#### tests

1. `ai/tests/test_emlis_nls_v3_s11_rc0029_surface_repair_red.py`
2. `ai/tests/test_emlis_nls_v3_s11_rc0029_surface_repair_mutation.py`
3. `ai/tests/test_emlis_nls_v3_s11_rc0029_e2_integration.py`
4. `ai/tests/test_emlis_nls_v3_s11_rc0029_forward_inverse_independence.py`
5. `ai/tests/test_emlis_nls_v3_s11_rc0029_runtime_disconnect.py`
6. `ai/tests/test_emlis_nls_v3_s11_rc0029_predecessor_immutability.py`
7. `ai/tests/test_emlis_nls_v3_s11_rc0029_e3_representative8.py`
8. `ai/tests/test_emlis_nls_v3_s11_rc0029_e4_frozen100_read_only.py`
9. `ai/tests/test_emlis_nls_v3_s11_rc0029_dependency_closure.py`
10. `ai/tests/test_emlis_nls_v3_s11_rc0029_rc0027_default_behavior_regression.py`
11. `ai/tests/test_emlis_nls_v3_s11_rc0029_rc0028_experiment_regression.py`

filesystem discoveryでpathを追加しない。必要pathがこのallowlistにない場合、実装前に停止して補遺を改訂する。

### 5.3 shareable package-only evidence

次はrepository pathではなく、実装packageの`documents/`へだけ置くbody-free evidenceである。input / output本文を含めない。

- `NLSv3_Step11_rc0029_R1_Freeze_Ledger_20260719.md`
- `NLSv3_Step11_rc0029_SurfaceRepair_RED_Receipt_20260719.json`
- 後続phaseのbody-free run receipt / handoff

R1のprivate body / Product Read noteはlocal private artifactに限定する。これらpackage-only evidenceをrepo exact-path allowlistへ数えない。

### 5.4 read-only predecessor

- batch 001 corpus / manifest / coverage / duplicate report
- Known28、Development42、invalid16
- Step 9全20 source owner / manifest
- E1b predecessor / successor source、test、manifest、receipt
- rc0027 default source、catalog、runtime、fixture、test、evidence
- rc0028 exact 4 APIの既存部分
- rc0028 catalog、runtime、manifest、tool、fixture、test、receipt
- E3 private Product Read body / noteはrepoへ取り込まず、local read-onlyのまま扱う

### 5.5 byte / behavior immutable

次を1 byteも変更しない。

1. Step 9全20 ownerとStep 9 manifest
2. Step 10 manifest / evidence / app-reachable contract
3. E1b predecessor / successor全owner
4. `emlis_ai_step11_runtime_adapter_v3.py`
5. rc0027 surface catalog、planning frontier、semantic overlay、cycle evidence
6. rc0028 catalog / runtime / manifest service / tool / fixture / test
7. public API / reply / DB / RN / Safety / question / account / subscription / naming owner
8. batch / Known / Development / invalid / historical Product Read / finalizer artifact

exact 4 sourceはappend-onlyになるためfull-file hashは変わり得る。ただし、`e069ffd`の全既存bytesをprefix-equivalentで保持し、rc0027 defaultとrc0028 experimentのvalue / bytes / dispositionを回帰固定する。

### 5.6 rc0029 delta dependency manifest contract

new rc0029 manifestは、rc0028 downstream generated manifest file SHA-256 `ffe0ff52e7d875e430d0878dced96c7b8994b05e6366ed9b4ff70055e8f2e8d0`をimmutable logical parentとして、次を別delta ledgerへ拘束する。

1. GitHub predecessor `e069ffd782e4d2b960b2c1e770d9018ab78a8b1d`
2. §2.3 exact 4 pathごとのpredecessor SHA-256とrc0029 current SHA-256
3. §5.2 new rc0029 pathのexact allowlist / file hash
4. static / dynamic project import edgeと、unexpected path、unbound import、forbidden reverse import `0`
5. `experimental_only=true`
6. `runtime_connected=false`
7. `public_owner_unchanged=true`
8. `rc0027_default_behavior_equivalent=true`
9. `rc0028_experiment_behavior_equivalent=true`
10. `eligible_for_formal=false`
11. `eligible_for_production=false`
12. filesystem discovery admission `false`、path ascendingのcanonical deterministic rebuild

generated manifest自身を自身の`file_hashes`へ含めず、外側body-free receiptがmanifest file hashをbindする。

rc0029 worktreeで旧rc0028 manifest validatorがexact 4 full-file hash driftを報告することはexpectedであり、隠さない。旧rc0028 closureはclean `e069ffd` checkoutでGREENを再確認する。rc0029 worktreeでは、expected exact-4 drift以外のrc0028 parent driftを`0`にし、rc0028 API behavior / bytes / disposition非回帰とnew rc0029 delta manifest GREENを別々に証明する。旧rc0028 manifestを更新したりvalidatorを弱めたりしない。

同様に、E1b frozen closureはclean `1453389dbfb693216c3b45605a4a3366506c397e`でGREENを再確認する。rc0029 worktreeではE1b successor owner bytesを不変にし、exact 4 downstream appendによるknown parent drift以外を`0`として、E1b functional non-regressionとrc0029 parent-chain accountingを別々に証明する。旧E1b manifestを更新しない。

---

## 6. R1 RED / mutation contract

最初のrc0029 production source editより前に、§5.2のRED / mutation testを追加して次を意味論的REDにする。collection error、常時fail mock、`skip`、`xfail`、expected severity変更をREDとして扱わない。

### 6.1 primary RED

1. **schema exposition**: rc0028のschema説明marker、record-per-line、machine taxonomy露出を代表入力で検出する。
2. **opaque referent**: owner順序permutation、同型owner複数、4 owner超、endpoint swapで、source-authorized headなしのordinal / generic anaphoraを拒否する。
3. **depth compaction**: construction + relation + semantic link + unknownが同時にある入力で、既存depth内のlossless clause fusionが存在しないrc0028をREDにする。
4. **reception binding**: generic Reception、antecedent drop、antecedent swap、別owner bindingを拒否する。Reception bytesがrc0028と同一であること自体はfailureにしない。unchanged Receptionが全required obligationへbody-only exact binding済みならcontrolとして許可し、unboundのまま保持される場合だけREDにする。

### 6.2 retained semantic attacks

- cross-span owner / overlap flatten
- relation endpoint swap / direction reverse / relation type mutation
- semantic linkとconstruction internal linkの混同
- explicit unknown drop / duplicate / dimension swap / affected owner swap
- required meaning drop / generic-only coverage
- self-denial separation drop
- `covered != semantic coverage`の自己認証
- candidate metadata / forward span map injection
- natural handle collision / duplicate / valid別input cross-swap
- Reception antecedent collision / missing / duplicate
- source / catalog / candidate / parser / binding hash stale

### 6.3 RED freeze receipt

RED実行後に、Git baseline、test hash、failure code、attack count、exact path allowlist、resource denominatorをbody-free ledgerへ固定する。GREEN後にREDの意味、denominator、fixture、baseline severityを変更しない。

---

## 7. feasibility / owner判定

### 7.1 条件付き可とする根拠

1. E1b successorはconstruction、owner participation、relation endpoint / direction、semantic link、explicit unknownをbody-free typed authorityとして既に保持する。
2. E0b / E2 / E3 machineは、その情報をforward、Parser、Matcher、Gateへlosslessに通せることを示した。
3. 現在の失敗は、catalog、Surface grouping、inverse grammar、Gate Product contractというdownstream 4責任と一致する。
4. public / shared runtime、upstream planner、Step 9を変更しなくても、experiment-only successor laneで再検証できる。

したがって判定は次のとおりである。

`CONDITIONALLY_FEASIBLE_WITHIN_D0_DOWNSTREAM_RESPONSIBILITY_SET`

### 7.2 即時STOPとなる反証

次のいずれかがREDまたは実装前設計で判明した場合、既存D0責任内では修復不能と判定する。

1. ordinalを除くと、natural referent handleをE1b typed authorityとbase body-recoverable materialから一意導出できない。
2. distinctなReception antecedentを既存authorityから選べず、`emlis_ai_grounded_human_reception.py`、Content Selection、Discourse Planner等の変更が必要。
3. depth compactionでrequired meaning、relation、unknown、self-denial separationのいずれかを落とす必要がある。
4. Body-only Parser / Independent Matcherがforward phrase spec、candidate AST、forward / candidate-declared owner ID、span mapを読まないと一致できない。validated successor / base source authorityのowner IDをMatcherが独立再計算することは必要なsource照合であり、禁止しない。
5. Step 9、E1b、shared runtime、public route、Safety、question ownerの変更が必要。
6. candidate 12、replan 1、recovery、depth、one-anchor、E1b resource denominatorの拡張が必要。

この場合、case branch、generic化、Gate弱化で回避せず、必要owner、意味責任、影響path、rollback境界を提示してMashの判断を求める。

### 7.3 current authority gap

意味責任のowner追加は現時点で不要である。一方、D0はrc0028 exact path allowlistであり、§5.2のrc0029 new pathを自動では許可しない。

したがって、本補遺により影響範囲は定義したが、実装はまだ開始しない。次の必要authorityは、**exact 4 existing ownerへのappend-only rc0029 APIと、§5.2 new pathだけを明示承認すること**である。

---

## 8. resource / determinism / independence / privacy

### 8.1 resource / determinism

- candidate総数 `<= 12`
- replan `<= 1`
- visible source anchor `<= 1`
- existing recovery / depth budgetを維持
- E1b denominator `N / S / R / L / X`を維持
- final bytes、source commitments、catalog hashが同じならAST、Parsed Witness、Binding、Gate、selectionがdeterministic
- parser / matcherはbounded linear処理。外部model、embedding、network、runtime learning、unbounded searchを追加しない
- bound超過時はtruncateせずcandidate fail-close

### 8.2 forward / inverse独立性

ForwardとParserは同じversioned declarative catalogのimmutable valueを読んでよい。ただし、Parser / Matcherはforward module、phrase選択関数、AST traversal、span map、coverage helper、candidate-declared owner / coverageをimportしない。

MatcherはParsed Witnessとvalidated source authorityから期待bindingを独立再計算する。candidate metadataまたはmachine selectedをsemantic coverageとして信用しない。

### 8.3 privacy / evidence

- repo / ZIP: source、test、tool、schema、body-free fixture、hash、count、closed reason code
- local private: input / output本文、parsed range、binding detail、Product Read note
- private directory `0700`、file `0600`、run ID別append-only
- body-full path / contentをstdout、traceback、shareable receiptへ出さない
- Supabase real-user raw、個人情報、unsalted body digest、secure keyを含めない

R1〜E4にsecure materialは不要である。formal body commitment、HMAC、encrypted packetが必要になる境界でSTOPし、Mashへ具体的な作業を依頼する。

---

## 9. 実装が別途承認された場合の順序

```text
R0 rc0028 Freeze
  -> R1 four-family RED / mutation freeze
  -> R2 rc0029 forward lexical spec / natural Surface / Reception
  -> R3 rc0029 Body-only Parser / Independent Matcher
  -> R4 rc0029 Hard Gate / selector / disconnected runtime / closure
  -> R5 R1 repair suite GREEN / E1b / E0b / E2 / rc0027 / rc0028 behavior and predecessor accounting
  -> E3 machine representative 8
  -> E3 Product Read representative 8
  -> E3 GREEN後だけE4 frozen 100
```

1. `R0 Freeze`: `e069ffd`、rc0028 closure、exact 4 hash、rc0027 / rc0028 behaviorを固定する。
2. `R1 RED`: §6をsource edit前に実行し、4 familyとretained semantic attackをRED固定する。
3. `R2 Forward`: lexical specとSurface / ReceptionだけをGREENにする。
4. `R3 Inverse`: Body-only Parser / Matcherをforward helper非共有でGREENにする。
5. `R4 Gate / Adapter / Closure`: additive Gate、selector、runtime disconnect、新manifestをGREENにする。
6. `R5 Repair Closure / Regression`: R1 four-family / mutation suiteを全GREENにした上で、E1b successor、E0b attack、E2、rc0027 default、rc0028 behavior、dependency / privacy / resourceを再実行する。E1b frozen closureはclean `1453389`、rc0028 frozen closureはclean `e069ffd`でGREENを再確認する。rc0029 worktreeのexact 4 full-file hash driftはhistorical manifest failureとして隠さず、E1b / rc0028 functional non-regressionとnew rc0029 manifestのpredecessor→current reconciliationを分離する。
7. `E3`: machine後に華恋が設計18.4全軸で8件をProduct Readする。
8. `E4`: E3全条件を通過した場合だけfrozen 100 read-onlyへ進む。

各text-affecting修正後、R1 repair suite、R3〜R5、E3を新run IDで再実行する。失敗結果を上書きしない。

---

## 10. E3 / E4 gate

### 10.1 E3 entry / acceptance

E3通過条件はD0から変更しない。

1. machine `8 / 8 selected`
2. former MAJOR 5件が全て`PASS`または`MINOR`
3. control 3件がrc0027 baselineより悪化しない
4. new `MAJOR / BLOCKER = 0`
5. relation endpoint / direction、unknown、self-denial、required meaning attackがGREEN
6. R1 four-family RED / mutation suiteが修復後sourceに対して全GREEN
7. exact duplicate 0、one anchor以下、generic-only required coverage 0
8. case / family / topic / expected cue 0
9. 華恋が設計18.4全軸で本文を読む

1件でも未達ならE4を開始しない。4主課題の表面上の改善だけでE3を通さない。

### 10.2 E4 frozen 100

E3 GREEN後だけ、既存batch 001を変更せずread-onlyで実行する。

1. `selected > 56`
2. rc0027 old selected 56件のmachine非回帰
3. representative 8以外のnew selected `>= 1`
4. changed / new selected全件Product Readで`MAJOR / BLOCKER = 0`
5. 100 rowsをexactly 1 dispositionへaccount、exception / missing / duplicate / unaccounted 0
6. exact duplicate 0、one anchor以下、generic-only required coverage 0
7. E1b whole100 authority countのlossless accounting
8. rc0027 default、rc0028 API behavior、E1b、E0b、E2、Known regression GREEN。rc0028 frozen dependency closureはclean `e069ffd`でGREEN、rc0029 worktreeではexpected exact-4 source driftを記録し、new rc0029 dependency closureがGREEN

E4通過は`rc0029 bounded experiment viable`だけを意味し、Cycle 001 ACCEPTEDではない。

---

## 11. STOP / rollback

### 11.1 STOP条件

次のいずれか一つで停止し、影響ownerと理由をMashへ提示する。

1. §5.1以外の既存source変更が必要
2. §5.2以外のnew pathが必要
3. Step 9 / E1b / rc0027の既存bytes、またはrc0028 predecessorの既存bytes部分 / rc0028 API behavior / evidenceの変更が必要。§5.1で明示許可したexact 4末尾へのrc0029 append自体はこのSTOPに含めない
4. shared runtime / reply / public API / DB / RN / Safety / question接続が必要
5. natural handle / Reception antecedentの一意導出不能
6. forward / inverse独立性を維持できない
7. required meaning / relation / unknown / self-denialを圧縮で落とす必要
8. resource bound拡張が必要
9. case / family / topic branch、arbitrary phrase bank、完成文固定が必要
10. Gate downgrade、assertion弱化、skip / xfail、mock-only GREENが必要
11. rc0027 defaultまたはrc0028 experiment behaviorが変わる
12. E3のformer MAJOR、control、新規MAJOR / BLOCKER条件が未達
13. E4 viability条件が未達
14. private body / secure materialをshareable artifactへ出す必要
15. 既知Step 10 driftまたはformal reconciliationをrepair scopeへ混入する必要

### 11.2 rollback

rollback対象:

- exact 4 ownerへ追加したrc0029-prefixed append-only API
- §5.2のnew rc0029 service / tool / fixture / active test source
- active rc0029 dependency manifestとGREEN-phase body-free receipt。R1 REDのhistorical receiptは下記の保持対象とする

保持するもの:

- GitHub predecessor `e069ffd`
- rc0027 / rc0028 sourceとevidence
- E1b RED / successor source、manifest、receipt
- rc0028 E3 machine / Product Read STOP receipt
- rc0029 RED test hash、body-free RED receipt、failure reasonのappend-only historical evidence。rollback後にactive failing RED test sourceをmain worktreeへ残すことは要求しない
- batch / Known / Development / invalid / historical evidence

E4開始前にSTOPした場合、rollback後もE4 `NOT_STARTED`を維持する。E4を実行してviability未達でSTOPした場合、E4結果を`FAILED / NOT_VIABLE`としてappend-only receiptへ保持し、`NOT_STARTED`へ書き換えない。いずれの場合もCycle 001 `NOT_ACCEPTED`を維持する。

---

## 12. acceptance非主張

本補遺が許可する表記:

- `rc0028 E3 Product Read STOP accepted as predecessor`
- `rc0029 repair impact scope defined`
- `common Surface repair conditionally feasible within downstream responsibility set`
- `implementation waiting for explicit acceptance`

本補遺だけでは許可しない表記:

- `rc0029 implementation started / GREEN / accepted`
- `E3 passed`
- `E4 started / viable`
- `formal candidate`
- `Cycle 001 accepted / completed`
- `Step 11 completed`
- `production ready`

E4通過後も、別authorityと新run IDでsecurity / privacy / Step 10 reconciliation、Step 0〜9、正式100件machine 100 / 100、Known28、Development42、invalid16、100件全件Product Read、evidence graph / finalizerを完了して初めてCycle 001 acceptanceを判定する。

---

## 13. 次の明示指示案

実装へ進む場合の正確な次指示は次のとおり。

> 「rc0029 E3 common Surface repair影響範囲補遺を承認する。GitHub commit `e069ffd782e4d2b960b2c1e770d9018ab78a8b1d`とrc0028 E3 Product Read STOP receiptをimmutable predecessorとして、exact 4 downstream ownerへのappend-only rc0029 APIと、補遺のexact allowlistにあるnew rc0029 experiment catalog / runtime / manifest / tool / fixture / testだけでrepair REDを開始する。Step 9全20 owner、E1b successor、rc0027 default、rc0028 experiment behavior、shared runtime / public routeを不変にする。REDが4 failure familyを共通contractとして固定した後だけE2修復し、E1b / E0b / E2 / rc0027 default・rc0028 API behavior非回帰を再実行する。rc0028 frozen closureはclean `e069ffd`で検証し、rc0029 worktreeのexpected exact-4 source driftをnew manifestでreconcileする。E3 Product Read通過後だけE4へ進み、authority外ownerまたは自然referentの一意導出不能が判明したら実装前に停止して影響範囲を提示する。」

この指示にもformal candidate、Step 10 reconciliation、production接続、Cycle 001 ACCEPTEDは含めない。

---

## Appendix A. 根拠と必要性

| action | 根拠 | 必要性 |
|---|---|---|
| rc0028をimmutable predecessor化 | 設計18.2 / 16.3とE3 STOP receipt | 失敗証拠を上書きせず修正前後を比較する |
| rc0029 new RC | text-affecting common Surface repair | 過去machine / Product Read証拠を誤継承しない |
| exact 4 ownerに限定 | failureがlexical spec / Surface / inverse / Gate責任と一致 | upstream / shared ownerへscope creepしない |
| new catalog | rc0028 ordinal / schema tokenを不変保持する | old evidenceを壊さず新grammarをversion化する |
| new disconnected runtime | shared runtimeはrc0027 public-adjacent | public behaviorを変えずend-to-end評価する |
| RED先行 | Product Read failureを語彙patchへ縮小しない | 4 familyとsemantic非回帰を共通contractにする |
| Body-only Parser / Independent Matcher | forward metadata自己認証禁止 | final bytesから意味保持を独立証明する |
| E3再Product Read | machine 8 / 8でもMAJOR 6だった | 自然さと「読まれた形」をmachineで代替しない |
| E3後だけE4 | D0 gateとSTOP receipt | frozen100で不自然さを拡大実行しない |

## Appendix B. source document commitment

| source | SHA-256 |
|---|---|
| detailed design supplied copy | `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc` |
| supplied `documents.zip` | `5a0a9936fdd15539fc459ee3640ab0070209cca46b674bac2d5b7c90b1def2e6` |
