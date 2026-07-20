# NLS v3 Step 11 rc0028 — upstream lexical role bounded experiment E0 / E1a handoff

## 0. 結論 / status

- checkpoint label: `rc0028 upstream bounded experiment started`
- rc0028 status: `EXPERIMENT_ONLY / NOT_FROZEN`
- E0 upstream schema / origin / resource RED: `GREEN`
- E0 downstream forward / matcher mutation RED: `NOT_STARTED`
- E1a upstream witness + isolated body-free experiment snapshot: `GREEN`
- E1 lossless information sufficiency: `NOT_COMPLETE`
- E2 forward / Parser / Matcher / Gate connection: `NOT_STARTED`
- active Surface candidate: `nls_v3_rc_0027`のまま
- Cycle 001: `NOT_ACCEPTED`
- production connection: `UNCHANGED`

今回の成果は、request-local Evidenceから導出したlexical-role witnessをbody-freeに固定し、現行`GroundedSourceSnapshot`のcommitmentと別の実験artifactで結合するところまでである。既存Step 4、Step 9 historical dependency closure、Surface、candidate bytes、formal lineageは変更していない。

## 1. 確認した事実

### 1.1 GitHub baseline

- repository: `MassyuRed/mashos-api`
- HEAD: `5d16f9e87cb90acd8f2d62a71aa39549d40938a3`
- tree: `cba93be590bc4f203568369996aa06b7494fd78f`
- HEAD message: `fix: Updates on what needs to be fixed`
- predecessor Surface candidate: `nls_v3_rc_0027`
- predecessor Surface catalog SHA-256: `1beec18839ed77abd1e52b0a06eb60c5867223fd54183c251a8f0efbc37ccc08`
- 作業終了前のGitHub再照合でもHEADは同一だった。

### 1.2 最終owner境界

1. 新規`emlis_ai_grounded_lexical_role_witness_v3.py`は、validated `GroundedObservationPlan`とrequest-local `EvidenceSpanResolver`だけをauthorityとして使う。
2. facetはsource bodyを保持せず、owner nucleus ID、source span ID、Evidence-span-local half-open range、fragment SHA-256、closed role / construction / position / internal-link codeだけを保持する。
3. 1 nucleus当たり同一role kindは1件以下、最大6 facet。上限超過、role overlap、未分類を順番勝ちやtruncateで採用しない。
4. overlap / 未分類ownerは、body-freeなclosed reason code付きでowner-local `unresolved`になる。request全体は落とさない。
5. public materializerはplan / resolverによる独立revalidationを通過したwitnessだけをserializeする。callerがID等へ本文を混入したdataclassは拒否する。
6. 新規`emlis_ai_grounded_lexical_role_experiment_snapshot_v3.py`は、変更していない`GroundedSourceSnapshot`の全体body-free commitment、既存主要source commitment群、lexical witness、experiment hashを結合する。
7. experiment snapshotはprivate request-local originからbase snapshotとwitnessの両方を独立再構築する。origin欠落、base / witness / hash / unresolved reason改ざんはfail-closeする。
8. experiment snapshotはactive Step 4 ledger、forward lexicalizer、Parser、Matcher、Gateから参照されない。`covered_required_nucleus_ids`はfacet存在だけを示し、semantic obligation coverageを承認しない。

### 1.3 historical dependency境界を保持した理由

最初のlocal試行ではlexical witnessを既存`GroundedSourceSnapshot`へ直接追加した。focused testはgreenだったが、Step 9が`STEP9_DEPENDENCY_SOURCE_BYTES_DRIFT`を検出した。Step 9 manifestはhistorical byte-immutable ownerであり、その更新はStep 10 / Step 11 formal closureまで波及するため、今回のbounded authorityを超える。

この試行は配布前に全てrevertした。最終成果では次を維持する。

- `emlis_ai_semantic_obligation_inventory_v3.py`: GitHub HEADとbyte同一
- 既存Step 4 test: GitHub HEADとbyte同一
- source snapshot schema: `cocolon.emlis.nls_v3.grounded_source_snapshot.v1`
- frozen source policy SHA-256: `de77b13a27e08ae3337d3ea8c11e1ba18ff24fb3f601d7639fe38c3948b8ff8c`
- current Step 9 historical manifest: 非変更

これは回帰を無視したのではなく、依存境界の検出を受けて実験をruntime非接続ownerへ分離した結果である。

### 1.4 frozen 100 read-only structural result

本文や生成文をartifactへ出さず、100件をread-onlyでwitness build / validationした結果:

- rows: `100`
- request-level build error: `0`
- witness validator failure: `0`
- owner partition failure: `0`
- materialization failure: `0`
- required text owners: `240`
- facet-present owners: `94`
- unresolved owners: `146`
- facets: `230`
- zero-facet rows: `37`
- unresolved reason:
  - `LEXICAL_ROLE_NO_CLOSED_CONSTRUCTION`: `145`
  - `LEXICAL_ROLE_AMBIGUOUS_ROLE_OVERLAP`: `1`

代表8件:

- rows: `8`
- facet-present owners: `16`
- unresolved owners: `3`
- facets: `43`
- target 5件の主要13 constructionは検出された。
- control 3件は新witnessでは`NO_CLOSED_CONSTRUCTION`だが、既存Grounded source属性を変更・削除していない。

この数値はstructural diagnosticであり、selected数、Product Read、Surface改善、semantic coverageを表さない。

### 1.5 schema / resource commitments

- witness schema: `cocolon.emlis.nls_v3.grounded_lexical_role_witness.rc0028.experiment.v1`
- witness adapter: `cocolon.emlis.nls_v3.grounded_lexical_role_adapter.20260719.v1`
- experiment snapshot schema: `cocolon.emlis.nls_v3.grounded_lexical_role_experiment_snapshot.rc0028.experiment.v1`
- experiment snapshot adapter: `cocolon.emlis.nls_v3.grounded_lexical_role_experiment_snapshot_adapter.20260719.v1`
- role bound: `6 × adapted nucleus count + 2 × relation count + unknown count`
- per-nucleus bound: maximum `6` facets、同一role kindは1件以下
- overflow / ambiguity policy: truncateせずowner-local closed reasonでfail-close

### 1.6 verification

- rc0028 upstream witness + isolated snapshot + original Step 4 whole100: `49 passed`
- original Step 9 frozen dependency policy spot check: `1 passed`
- full Step 9 hard gate / selector / recovery: `10 passed`（`896.18s`）
- `git diff --check`: `clean`
- 既知warning: Pydantic v1-style `root_validator` deprecation 1件。今回変更由来ではない。

## 2. 推測

1. 代表targetの構造をbody-free facetへ分解できたため、rc0027で失われた比較、choice uncertainty、contrast、coexistence、action order等を、Surface側のcase cueやtopic辞書なしで参照できる可能性はある。
2. 一方、required text ownerの`146 / 240`は未解決であり、現schemaだけで入力意味をlosslessに運べるとはまだ言えない。
3. Evidence spanを跨ぐrelation、1 owner内に複数constructionが重なる構造、relation endpoint / direction、unknown facetは、現witnessの情報だけではE2 matcher closureまで届かない可能性がある。
4. `particle_object`は保守的なambiguity guardを持つが、日本語の複合助詞・修飾範囲をregexだけで一意に決められることは証明されていない。

## 3. 華恋の意見

この版は、Mashが承認した「rc0028でupstream lexical roleのbounded experimentを開始する」への正しいcheckpointとして保持してよい。ただし、これはE1完了ではなくE1aであり、forward / matcherのdownstream mutation REDもまだ実行していない。

次にいきなりE2 Surfaceへ繋ぐべきではない。まず、次のE1b REDを追加し、upstream情報十分性を再判定する必要がある。

1. Evidence spanを跨ぐcontrast / sequence / coexistenceのowner closure。
2. owner-local overlap 1件を、後勝ち・raw replay・6 facet超過なしでlosslessに表現できるか。
3. relation endpoint / directionとexplicit unknownを、既存Grounded authorityからbody-freeにfacet化できるか。
4. `covered`をsemantic coverageと誤認するattackが、snapshot / ledger / future consumerで拒否されるか。

これらを満たせない場合は補遺7の停止条件に従い、role schemaをその場で拡張せずMashへ追加影響範囲を提示する。満たせた場合だけ、E2でforward / Parser / Matcher / Gateを同時に同期する。

## 4. 根拠と必要性

| 変更 | 根拠 | 必要性 |
|---|---|---|
| 独立lexical-role witness module | rc0027 Surface / semantic-restatement schemaをE0で汚さず、失敗時にowner単位でrollbackする | bounded experimentと既存freezeを分離するため |
| range + role + construction + hash | generic phraseだけでは複数referent・順序を区別できない | request-local sourceへ一意に戻り、artifactをbody-freeにするため |
| owner-local unresolved reason | 複合構文を順番勝ちで捨てるとlossy、request全体例外では局所曖昧性が全体障害になる | truncate / 後勝ち禁止とfail-closeを両立するため |
| experiment-only snapshot | 既存snapshotへ直結するとhistorical Step 9 dependency closureが変わる | E1aの情報伝搬診断と現行runtimeを分離するため |
| origin rebuild / closed enum validation | callerがhashを付け替えたself-signed artifactをauthorityにできる | source authorityとtamper rejectionを維持するため |
| ledger / Surface非接続 | 独立matcher契約とlossless sufficiencyが未完成 | E2を黙示的に開始しないため |

## 5. 明示的に変更していないもの

- `emlis_ai_grounded_observation_plan.py`
- `emlis_ai_semantic_obligation_inventory_v3.py`
- Step 9 historical dependency manifest
- Step 11 grounded lexicalizer / Surface catalog / natural Surface / Parser / Matcher / Hard Gate
- active candidate / catalog hash / rendered bytes
- public API、DB、RN、Safety、question system、routing
- candidate 12 / replan 1 / recovery bounds
- one visible anchor上限、raw long quote禁止、generic-only coverage禁止
- cycle finalizer、known28、invalid16、Development42、private verification
- rc0027 / rc0026 evidence lineage

## 6. 適用対象ファイル

GitHub `mashos-api`へ反映するファイルは、次の新規4ファイルだけである。

1. `ai/services/ai_inference/emlis_ai_grounded_lexical_role_witness_v3.py`
2. `ai/services/ai_inference/emlis_ai_grounded_lexical_role_experiment_snapshot_v3.py`
3. `ai/tests/test_emlis_nls_v3_s11_rc0028_upstream_lexical_role_red.py`
4. `ai/tests/test_emlis_nls_v3_s11_rc0028_lexical_role_snapshot_red.py`

repo外の判断資料:

5. `NLSv3_Step11_rc0028_Design20_3_Impact_Addendum_20260719.md`
6. `NLSv3_Step11_rc0028_E0_E1a_handoff_20260719.md`
7. `NLSv3_Step11_rc0028_BoundedExperimentReceipt_20260719.json`

主設計書`Cocolon_EmlisAI_ModelFreeNaturalLanguageSurfaceV3_DetailedDesign_ImplementationOrder_20260714_Revised_Cycle.md`本文は変更していない。本補遺が今回の限定authority receiptであり、現時点で主設計書の改訂は不要である。

## 7. Mash側の必要作業

現時点でsecure material、private corpus、formal packet、DB / RN作業は不要。

ZIP内のrepo新規4ファイルをGitHub `mashos-api`へ反映した後、反映commitを華恋へ知らせてほしい。華恋はそのcommitを再照合してからE1bへ進む。E2開始はこのZIP適用だけでは承認・実行されない。
