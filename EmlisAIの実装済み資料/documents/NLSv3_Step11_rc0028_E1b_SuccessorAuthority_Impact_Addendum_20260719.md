# NLS v3 Step 11 rc0028 — E1b successor authority 影響範囲補遺

## 0. 結論 / 文書状態

- document status: `IMPACT_SCOPE_DEFINED`
- GitHub baseline: `MassyuRed/mashos-api` commit `31d3cf183589b27481338277574f90500f3c5b11`
- baseline tree: `c826c3ed5587356f313a90a5b67611e3972abd42`
- checkpoint: `rc0028 E1b RED / STOP ACCEPTED`
- successor implementation: `NOT_STARTED / NOT_AUTHORIZED_BY_THIS DOCUMENT`
- existing Step 9 frozen owner: `BYTE_IMMUTABLE`
- runtime connection: `FALSE`
- E0b / E2: `NOT_STARTED / NOT_AUTHORIZED`
- formal candidate / production: `NOT_AUTHORIZED`
- Cycle 001: `NOT_ACCEPTED`
- secure material / Mash-side file operation: `NOT_REQUIRED AT THIS CHECKPOINT`
- body-free: `true`

本補遺は、E1bで不足が確定したupstream relation / nested-construction authorityを、既存Step 9 frozen ownerへ触れずに検証するための**影響範囲と契約**を閉じる。実装、E2、formal freeze、production接続、Cycle 001 ACCEPTEDを開始・承認する文書ではない。

次回、Mashがsuccessor実装を明示的に指示した場合に限り、§10の順序と§11のGREEN条件でRED→GREENへ進む。

## 1. この補遺が必要な根拠

### 1.1 確認した事実

1. GitHubの最新commitは`31d3cf183589b27481338277574f90500f3c5b11`である。直前baseline `50f80a4f875b8edd9211025a9094a21ca5363512`との差分は、新規E1b RED test 1本だけだった。
2. E1b testのGit blob SHAは`56d24b252ae09acd018bbfb93be8cea3acfa4df3`、file SHA-256は`f449b44ef4bc007fb783a81b1e3884dcdcba017633b09fda3a4771bfd3149d50`である。
3. Step 9 dependency validationは`PASS`。Step 9 manifest全20 source ownerとmanifest sourceを現baselineのbyteのまま保持できる。
4. 既存rc0028 E0a / E1aとStep 4の対象回帰は`49 passed`。E1bは意図した5論点で`5 failed`であり、collection / import errorではない。
5. 現行v1 lexical witnessは、overlapを`LEXICAL_ROLE_AMBIGUOUS_ROLE_OVERLAP`としてfail-closeする既存contractを持つ。一方、E1bは同じv1へoverlap lossless化、relation endpoint、explicit unknown、coverage否定authorityを要求する。この二つは同じv1 schemaのまま同時GREENにできない。
6. cross-span coexistence対象では、frozen Planは`uncertain_connection / bounded_structural_inference / should`を持ち、`coexistence / user_stated_relation / required`を持たない。したがってPlanを不変にしたまま、現E1b testのPlan直参照部分をそのままGREENにはできない。
7. overlap対象は、1 parent nucleus、2 semantic units、1 semantic link、2 source-explicit unknownを持つ。2 constructionのslot総数は6以内だが、同一semantic unitが複数constructionへ正当に参加する。semantic unit単位の「同一role 1件」ではlossless closureにならない。
8. frozen 100のbody-free集計は、required cross-span relation 68件、semantic units 10件、semantic links 5件、source-explicit unknown 27件、owner-local overlap 1件である。plan missing-information unknown 516件はEvidenceを持たず、source-explicit unknownの代用にはならない。
9. Step 10 dependency validationは、このsuccessorより前から`STEP10_DEPENDENCY_SOURCE_BYTES_DRIFT`と`STEP10_SOURCE_CLOSURE_DRIFT`を返す。frozen closure `2b4cd6cb5ea0f0d69ae7de31930dd6833ba21fce8eb7262f579cad514f14a8e9`に対し、現baselineのrecomputed closureは`d7958aa26a10d598f57f7544b51133edc0ea05c2f45e6767b9c9bdb4fda1d1cd`である。
10. Step 10の既知driftは、`emlis_ai_grounded_sentence_surface.py`と`test_emlis_nls_v3_s5_content_selection_stage_context.py`の2 pathに由来する。後者のruntime-disconnect testも、現v1 experiment snapshotをallowlistしていないため、現baselineで`11 passed / 1 failed`になる。

required cross-span 68件のsource relation type内訳は次のとおりであり、contrast / sequenceだけでは閉じない。

| source relation type | count |
|---|---:|
| `action_supports_change` | 33 |
| `wish_and_constraint` | 10 |
| `contrast` | 9 |
| `continuation_or_refusal` | 8 |
| `attempt_and_block` | 4 |
| `preserves_despite` | 2 |
| `shift_from_to` | 2 |
| total | 68 |

### 1.2 推測

1. E1bの不足はSurface文言ではなく、frozen Plan / semantic-restatementとlexical constructionの間に、relation、construction instance、semantic-unit participation、explicit unknownをlosslessに結ぶversioned authority ownerがないことが主因である。
2. contrast / sequenceはfrozen Planからlossless projectionできる。coexistenceだけは、既存`uncertain_connection`を閉じたsource-explicit条件で1対1 refinementするexperiment authorityがあれば、Planのrequired coverageを変更せず閉じられる可能性がある。
3. constructionのcardinality ownerをsemantic unitではなくconstruction instanceへ移し、semantic unitはtyped range-participation targetとして保持すれば、同じsemantic unitが複数constructionへ参加する正当な重なりを、後勝ち・truncateなしで表現できる可能性がある。
4. E1b GREEN後もruntime消費がないため、商品自然さやCycle acceptanceはまだ判定できない。E2は別authorityが必要である。

### 1.3 華恋の意見

今はsuccessor実装へ飛ばず、ownerと上限を先に閉じるのが正しい。特に、coexistenceをlexical regexの自己発行にするとauthority捏造になり、Planを書き換えるとStep 9 freezeを壊す。そこで、Planの意味を変更しない`experiment_required` refinementと、construction instanceを独立ownerにするversioned successorを採る。

また、既知Step 10 driftを今回一緒に直すべきではない。E1bの情報閉包とformal / runtime lineageを混ぜると、何がGREENの原因か分からなくなる。E1b successor、E2、Step 10 reconciliation、formal freezeを別checkpointに分ける。

## 2. authorityの優先順位と前補遺の扱い

1. revised detailed designの非変更contractを最優先する。
2. 本補遺は、先行する`NLSv3_Step11_rc0028_Design20_3_Impact_Addendum_20260719.md`をE1b successor範囲だけ狭める。
3. 先行補遺§3.1のPlan / semantic-restatement / inventory条件付き変更許可、および§3.2のdownstream変更許可は、本E1b successor laneへ**継承しない**。
4. 既に完了したv1 bounded experiment checkpointは履歴として保持する。本補遺はその結果を消さない。
5. 本補遺と先行補遺が競合する場合、Step 9全20 ownerのbyte不変、runtime非接続、狭い方のscopeを優先する。

## 3. owner matrix

### 3.1 byte-immutable owner

次は現baselineのlive bytesを1 byteも変更しない。

- Step 9 manifestに含まれる全20 source owner。
- `ai/services/ai_inference/emlis_ai_step9_dependency_manifest_v3.py`。
- `ai/services/ai_inference/emlis_ai_step10_dependency_manifest_v3.py`。
- `ai/services/ai_inference/emlis_ai_step11_cycle_evidence_v3.py`。
- `ai/tools/emlis_nls_v3_step11_dependency_manifest.py`。
- Step 11 batch / regression / cycle finalizer tool。
- Step 11 semantic overlay、grounded lexicalization、Surface、Parser / Matcher、Hard Gate、catalog、runtime adapter。
- public API、DB、RN、Safety、question system、routing、reply owner switch。

Step 9で特に直接関係する3 ownerとmanifest sourceのSHA-256:

| owner | SHA-256 |
|---|---|
| `emlis_ai_grounded_observation_plan.py` | `b422093f907f3a825ec30f687f2f8b1d2688bf89950d9bc7436bfe0b5a67d177` |
| `emlis_ai_grounded_observation_semantic_restatement_v3.py` | `a014e942b34c2c8f2a424dda0b0ecd30cb34ff99112e813d2182ad84d34b65fc` |
| `emlis_ai_semantic_obligation_inventory_v3.py` | `1dadb411fad46abb617da9ef9fcb48b18d8be987318966616d804c6ec69adbcb` |
| `emlis_ai_step9_dependency_manifest_v3.py` | `19a21d5853c44130c2c874e8b9c6bbbc0a1fc79591c529fb060e7c1e3cd7742e` |

### 3.2 historical v1 checkpoint

次はv1 predecessorとして保持し、successor schemaを上書きしない。

- `ai/services/ai_inference/emlis_ai_grounded_lexical_role_witness_v3.py`
  - SHA-256 `1523690453647bee2a6e61fb91d7b14823baee4e383c006bc2814006a4beb94b`
- `ai/services/ai_inference/emlis_ai_grounded_lexical_role_experiment_snapshot_v3.py`
  - SHA-256 `4671aa22c4e432f907780f0becf900fead57044c53ea3bbc1bf501eb5abc1a27`
- rc0028 E0a / E1a test。

### 3.3 次回の明示承認後に新規追加できるowner

| path | owner responsibility | 必要性 |
|---|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_relation_construction_authority_successor_v3.py` | frozen Plan / Evidence / semantic-restatementから、relation、construction instance、semantic-unit participation、explicit unknown authorityを独立再構築する | lexical witnessによる自己発行を防ぐ |
| `ai/services/ai_inference/emlis_ai_grounded_lexical_role_witness_successor_v3.py` | authority successorをlexical facet / endpoint / link / unknown bindingへlossless projectionする | v1 contractを壊さずE1b不足を閉じる |
| `ai/services/ai_inference/emlis_ai_grounded_lexical_role_experiment_snapshot_successor_v3.py` | unchanged base snapshotと2 successor commitmentをruntime非接続で結ぶ | active `GroundedSourceSnapshot`を変更せず検証する |
| `ai/services/ai_inference/emlis_ai_rc0028_experiment_dependency_manifest_v3.py` | rc0028 experiment-only closure schema / validator | Step 9 / Step 10 / formal manifestを上書きしない |
| `ai/tools/emlis_nls_v3_rc0028_experiment_dependency_manifest.py` | exact allowlistからmanifestを生成・検証する | filesystem discoveryやunbound importを防ぐ |
| `ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_dependency_manifest_rc0027.json` | exact rc0027 source predecessor | append-only parentを固定する |
| successor authority / mutation / dependency / runtime-disconnect tests | closed contractをREDで固定する | 実装より先に失敗条件を証明する |

既存source ownerは変更しない。既存testのうち、E1b RED testだけは§9の条件付きtest-harness migration対象になり得る。

## 4. closed authority schema

successor schemaは`cocolon.emlis.nls_v3.*.rc0028.experiment.v2`系列とし、unknown key、unknown enum、型の暗黙変換、重複IDを拒否する。

### 4.1 `GroundedSourceOwnerParticipation`

- `participation_id`
- `parent_nucleus_id`
- `construction_slot_id`
- `target_owner_kind`: `nucleus | semantic_unit`
- `target_owner_id`
- `owner_resolution`: `exact_semantic_unit | crosses_semantic_unit_boundary | parent_nucleus_fallback`
- `source_span_id`
- `intersection_start_index / intersection_end_index`
- `semantic_equivalence_authorized=False`

これはparent nucleusとsemantic unitが同じ意味であるというaliasではない。construction slotがどのfrozen owner rangeへ参加するかだけを表すstrict tagged recordである。

- semantic unitへ完全包含される場合は、`target_owner_kind=semantic_unit`、`owner_resolution=exact_semantic_unit`を1件だけ持つ。
- semantic-unit boundaryを跨ぐ場合は、交差する各unitを`target_owner_kind=semantic_unit`、`owner_resolution=crosses_semantic_unit_boundary`でsource orderに全保持する。一つへ丸めない。
- frozen semantic unitがない場合だけ、`target_owner_kind=nucleus`、`target_owner_id=parent_nucleus_id`、`owner_resolution=parent_nucleus_fallback`を1件持つ。
- 上記tagとowner kindの組合せが一致しないrecordを拒否する。

`exact_semantic_unit`のintersection rangeはslot rangeとexact一致する。`crosses_semantic_unit_boundary`は各`semantic unit ∩ slot`の非空rangeをexact保持する。`parent_nucleus_fallback`はslot rangeとexact一致する。instanceの`participation_ids`は、その全slotが持つparticipationのcanonical unionとexact一致する。

### 4.2 `GroundedConstructionInstance`

- `construction_instance_id`
- `parent_nucleus_id`
- `construction_code`: 現v1の13種closed enum
- `source_field`: `memo | memo_action`
- `source_field_role`: `thought | action`
- `source_span_id`
- `evidence_alias_ids`
- `instance_start_index / instance_end_index`
- `slot_ids`
- `participation_ids`

rangeは`source_span_id`が指すEvidence span内の0始まり半開区間とする。別spanのoffsetを同一座標として比較しない。

### 4.3 `GroundedConstructionSlot`

- `construction_slot_id`
- `construction_instance_id`
- `lexical_role_kind`: 現v1の9種closed enum
- `construction_position`: 現v1の9種closed enum
- `source_field`: `memo | memo_action`
- `source_field_role`: `thought | action`
- `source_span_id`
- `slot_start_index / slot_end_index`
- `evidence_alias_ids`
- `participation_ids`

lexical facetのcardinality ownerは`construction_instance_id`とする。同一instance内の同一`lexical_role_kind`は1件以下。同じsemantic unitが別instanceへ参加することは、exact rangeとtyped participationが異なる場合に限り許可する。

instance / slotの`evidence_alias_ids`はexactly `(source_span_id,)`とする。slot rangeもEvidence-span-localな0始まり半開区間とし、instanceと同じ`source_span_id`に完全包含されなければならない。multi-span constructionは今回扱わずclosed codeでfail-closeする。

### 4.4 `GroundedConstructionIntervalEdge`

- `left_construction_instance_id / right_construction_instance_id`
- `range_relation`: `disjoint | contains | contained_by | partial_overlap | coextensive`

同一`(parent_nucleus_id, source_span_id)` group内の全instance pairをID canonical orderで一度だけ記録する。異なるsource spanのoffsetは比較せずedgeを作らない。単純なparent / child treeへ偽装しない。span / rangeから独立再計算した関係と完全一致しなければ拒否する。

### 4.5 `GroundedExperimentRelationAuthority`

- `experiment_relation_id`
- `authority_basis`: `grounded_plan_projection | source_explicit_refinement`
- `source_relation_id`
- `refines_source_relation_id`: refinement時は`source_relation_id`とexact一致、projection時は`None`
- `source_relation_type`: frozen Planのclosed `RelationKind` 14種
- `effective_relation_type`: 同じclosed `RelationKind` 14種
- `source_grounding_kind`
- `source_certainty`
- `source_from_nucleus_id / source_to_nucleus_id`
- `source_relation_ids`
- `source_meaning_arc_keys`
- `from_source_owner_id / to_source_owner_id`
- `direction`: `source_to_target | bidirectional`
- `source_retention`
- `experiment_retention`: `source_projection | experiment_required_refinement`
- `evidence_alias_ids`
- `marker_code`: `explicit_simultaneous_connector`（refinement時だけ）
- `marker_policy_version`（refinement時だけ）
- `marker_policy_sha256`（refinement時だけ）
- `marker_source_span_id / marker_start_index / marker_end_index`（refinement時だけ）

frozen Planの全relationを、source type、endpoint、retention、grounding、certainty、Evidence、source relation / meaning arc lineageを変えずにlossless projectionする。required cross-span 68件を含め、Plan projectionでは`effective_relation_type == source_relation_type`、`from/to_source_owner_id == source_from/to_nucleus_id`、`evidence_alias_ids == source relation.source_span_ids`、`experiment_retention=source_projection`でなければならない。source relation material全体をsource IDから独立再解決し、field列挙と完全一致させる。lexical construction codeやsemantic link typeからrelationを捏造しない。

direction mappingは全14種に対して閉じる。`coexistence`だけ`bidirectional`、その他13種はcanonical Planのfrom→toを保つ`source_to_target`とする。

coexistenceだけ、次を全て満たす場合に、既存`uncertain_connection`へ1対1の`coexistence` experiment overlayを作れる。

1. source relationが`uncertain_connection / bounded_structural_inference / should`である。
2. 左右endpointが一意で、隣接するrequired text ownerである。
3. closed generic grammar policyに属するsource-explicit simultaneous markerがEvidence rangeで証明される。
4. Evidence alias、source order、endpointが独立再構築と一致する。
5. 競合するrequired relationまたは複数解釈がない。
6. frozen source rowを削除・置換・再分類せず、successor rowの`refines_source_relation_id`で1対1 overlayする。successor effective viewでは同じsource relationのprojectionとoverlayを二重計上せず、relation件数を増やさない。
7. directionは`bidirectional`である。

`experiment_required_refinement`はbase Planの`required_relation_ids`、production obligation、semantic coverageへ昇格させない。`marker_code`は上記1値だけのmachine codeで、marker本文を保持しない。`marker_policy_sha256`が固定するgeneric grammar policyとexact Evidence-local rangeの両方を独立再構築する。punctuation、隣接、lexical regexだけでの発行は禁止する。今回、他relation typeのrefinementは許可しない。

### 4.6 relation / semantic link binding

`GroundedLexicalRelationEndpointBinding`は各effective relationにつきexactly 2件を持つ。

- `experiment_relation_id`
- `endpoint_role`: `from | to`
- `source_owner_id`
- `direction`
- `evidence_alias_ids`

Plan projectionの`source_owner_id`はfrozen relationのfrom / to ownerとexact一致する。construction participationは別recordであり、endpoint ownerへsemantic equivalenceとして混ぜない。

`GroundedLexicalSemanticLinkBinding`はfrozen semantic-restatement linkを1対1 projectionする。

- `source_semantic_link_id`
- `source_span_id`
- `connective_code`
- `relation_type`
- `from_semantic_unit_id / to_semantic_unit_id`
- `direction`
- `required`

source link IDからfrozen link recordを独立再解決し、上記全field、欠落、重複、canonical orderが完全一致しなければ拒否する。

construction code / lexical internal linkとsemantic link relationは別authorityであり、taxonomyが異なるだけでは競合ではない。例えばlexical `explicit_contrast`とsemantic `coexists_with`は、それぞれのsource authorityが成立する限り併存できる。同一authority claim・同一endpointについてsource、direction、required statusが矛盾する場合だけ、都合よく統合せずfail-closeする。

### 4.7 explicit unknown binding

`GroundedLexicalExplicitUnknownBinding`はfrozen `GroundedExplicitUnknownWitness`を1対1で保持する。

- `source_unknown_id`
- `dimension`: `explicit_cause_unknown | explicit_unverbalized_unknown | explicit_choice_decision_unknown | explicit_temporal_referent_unknown`
- `source_span_id`
- `affected_source_owners`: 各要素は`owner_kind: nucleus | semantic_unit`と`owner_id`のstrict pair
- `lexical_role_kind="unknown_or_limit"`
- `required`

affected ownerはfrozen explicit unknownからsource orderでexact projectionし、別ownerへのfallbackを許さない。plan missing-information unknownとsource-explicit unknownは別型とし、相互代用しない。

### 4.8 `GroundedLexicalRoleFacetSuccessor`

- `facet_id`
- `construction_slot_id`
- `source_owner_id`: `construction_instance_id`とexact一致
- `parent_nucleus_id`
- `source_span_id`
- `source_field_role`: `thought | action`
- `start_index / end_index`
- `lexical_role_kind`
- `construction_code`
- `construction_position`
- `lexical_internal_link`: `none | qualifies | contrast | coexistence | precedes | limits`
- `participation_ids`
- `visible_authority="feature_only"`
- `required=True`

facetとconstruction slotは1対1で、同じspan / range / role / construction / position / participationを持つ。`lexical_internal_link`はclosed construction policyからだけ導出するlexical-only codeであり、Plan relationまたはsemantic link authorityではない。

### 4.9 coverage否定authority

- successor witnessは`facet_present_required_nucleus_ids`を持つ。
- successor witnessは`facet_absent_required_nucleus_ids`と、各absent ownerのclosed unresolved reasonを持つ。
- presentとabsentはfrozen required text parent nucleus IDsのdisjoint / complete partitionであり、canonical orderでなければならない。
- absent reasonは各absent ownerにexactly 1件で、closed enumは`LEXICAL_ROLE_MULTI_SOURCE_OWNER | LEXICAL_ROLE_SOURCE_UNRESOLVED | LEXICAL_ROLE_AMBIGUOUS_ROLE_OVERLAP | LEXICAL_ROLE_RESOURCE_BOUND_EXCEEDED | LEXICAL_ROLE_NO_CLOSED_CONSTRUCTION | LEXICAL_ROLE_CONSTRUCTION_AUTHORITY_CONFLICT | LEXICAL_ROLE_PRIVATE_COMMITMENT_REQUIRED`とする。
- successor witnessは`semantic_coverage_authority="none"`を固定する。
- legacy `covered_required_nucleus_ids`をschema / materialへ含めない。
- successor snapshotは`semantic_coverage_authorized=False`をexact boolとして固定する。
- `True`、`1`、`"false"`、`None`、unknown-field injection、stale hashを拒否する。
- facet presence、E1b information closure、semantic coverage、Product Readを同義にしない。

### 4.10 top-level schema

`GroundedRelationConstructionAuthoritySuccessor`:

- schema / adapter / marker-policy version
- Git baseline、Plan commitment、semantic-restatement commitment
- construction instances / slots / participations / interval edges
- relation authorities / semantic link bindings / explicit unknown authorities
- collection別resource counts / bounds
- authority SHA-256
- `experimental_only=True`
- `body_free=True`

`GroundedLexicalRoleWitnessSuccessor`:

- authority successor commitment
- facets、relation endpoint bindings、semantic link bindings、explicit unknown bindings
- facet present / absent exact partitionとabsence reasons
- resource counts / bounds
- `semantic_coverage_authority="none"`
- witness SHA-256
- `experimental_only=True`
- `body_free=True`

`GroundedLexicalRoleExperimentSnapshotSuccessor`:

- unchanged `GroundedSourceSnapshot` commitment
- authority successor commitment
- lexical witness successor commitment
- source policy / resource commitment
- `semantic_coverage_authorized=False`
- `runtime_connected=False`
- snapshot SHA-256
- private request-local origin capability
- `experimental_only=True`
- `body_free=True`

3 top-level objectは、caller-supplied objectを信用せず、それぞれのsourceから独立再構築したexact valueと比較する。

### 4.11 ID / hash derivation

新規IDとprivate artifact hashへraw substring、完成文、unsalted source-fragment digestを入力しない。domain separator、frozen Plan / semantic-restatement commitment、source span ID、Evidence-span-local half-open range、closed enum / policy versionをcanonical serializationして導出する。

exact rangeを含むID / objectはrequest-local private evidenceに限定し、shareable projectionへ列挙しない。shareableなcase commitmentが必要な場合は設計16のsalted commitment / versioned HMAC境界へ移り、secure materialがなければSTOPする。

## 5. resource accounting

分母はfrozen upstreamから計算し、successorがownerを増やして自己拡張できないようにする。

定義:

- `N`: frozen Planのrequired text parent nucleus count
- `R`: admitted effective relation count。全frozen Plan relationをexactly 1件ずつprojection / overlayするため、`R = frozen Plan relation count`
- `X`: frozen semantic-restatement source-explicit unknown count
- `D`: frozen semantic unit count、既存bound `D <= 4N`
- `L`: frozen semantic link count
- `C_group`: 1つの`(parent nucleus, source span)` group内construction instance count

上限:

1. lexical construction slots: `<= 6N`
2. construction instances: `<= construction slots`かつ各`(parent, source span)` group `<= 6`
3. interval edges: 各`(parent, source span)` groupで`= C_group(C_group-1)/2`、groupごと最大15
4. source-owner participations: 各slotについて交差するfrozen unitを欠落なくexact列挙し、unitなし時はparent fallback exactly 1。各slot `<= 4`、全体`<= 4 × construction slots`
5. relation endpoint bindings: `= 2R`
6. semantic link bindings: `= L`。各parentで`L_parent <= D_parent(D_parent-1)/2`、`D_parent<=4`、全体`L<=6N`。`L`は他boundの分母を増やさない
7. explicit unknown bindings: `= X`
8. chargeable role / endpoint / unknown records: `<= 6N + 2R + X`
9. lexical facets: construction slotsと1対1で`= slot count`
10. candidate 12、replan 1、既存recovery bound、one-anchor上限は変更しない

bound超過時にtruncate、score順間引き、後勝ち、first-match勝ちを行わない。closed failure codeでfail-closeする。bound拡張が必要なら実装を停止し、追加影響範囲をMashへ提示する。

## 6. dependency closure

successorはshared Step 11 manifestを変更せず、独立`rc0028_experiment_dependency_manifest.v1`を持つ。

parent:

- candidate: `nls_v3_rc_0027`
- source file count: `161`
- source closure SHA-256: `1214bb6c586a0aecbb3f7d6b251613c9b05e190057aa276d5c29a045be538dc7`
- manifest artifact SHA-256: `d7a3fc26fd3778f4c08c51e453cebaedd5e0f9674960d403090000b7cccfd450`
- disposition: `SOURCE_PREDECESSOR_ONLY / NOT_A_FORMAL_RC0027_FREEZE_CLAIM`

manifestは次を機械固定する。

- Git baseline commit `31d3cf183589b27481338277574f90500f3c5b11`とtree `c826c3ed5587356f313a90a5b67611e3972abd42`
- `experimental_only=true`
- `runtime_connected=false`
- `eligible_for_e0b=false`
- `eligible_for_e2=false`
- `eligible_for_formal=false`
- `eligible_for_production=false`
- parent 161 pathのexact hashを全継承
- rc0028の全added / changed pathをexplicit allowlistで列挙
- Step 9 validationとbaseline owner hashesをbind
- E1b predecessor SHA-256 `f449b44e...`をbind
- unbound transitive importとunexpected reverse importを拒否
- body-free / canonical deterministic rebuildを要求

許可するimport graphは一方向に閉じる。

```text
frozen Plan / Evidence / semantic-restatement (read-only)
  -> relation-construction authority successor
  -> lexical-role witness successor
  -> experiment snapshot successor
```

既存parent production / runtime / shared Step 11 toolからsuccessorをimportするpathは0件とする。entrypointは新規experiment manifest toolと新規successor testsからのlocal invocationだけに限定する。manifest owner / toolがsuccessorを検証のため読むことはできるが、production behaviorを呼び出さない。

新規testのexact pathとgenerated rc0028 experiment manifest artifact pathは、A1の最初のsource editより前にchange ledgerへ固定し、その後のfilesystem discovery追加を禁止する。

generated experiment manifest自身は自分の`file_hashes`へ含めない。外側のbody-free receiptがartifact hashをbindし、self-hash循環を避ける。

Step 10の既知driftはこのmanifestで正当化・修復しない。formal / productionへ進む前に、別のversioned Step 10 reconciliation authorityが必要である。

## 7. evidence / privacy boundary

full successor authority / witness / snapshotのexact source range recordはrequest-local processまたはencrypted private evidenceに限定する。shareable projectionはschema / policy / artifact commitment、件数、resource count、failure codeだけを出し、per-case range recordを列挙しない。

successorのshareable projection、receipt、repr、error、tracebackへ次を含めない。

- raw input / output body、source fragment、完成文、長い引用
- case / family / batch ID、expected text、review verdict / free-text noteをgeneration ownerへ渡すこと
- unsalted body-derived SHA-256
- HMAC key、random nonce、commitment key
- Supabase実ユーザーraw corpus、個人情報、private packet

既存frozen artifactのID / commitmentは参照できるが、既存`source_fragment_sha256`をsuccessor shareable materialへ複製しない。新しいbody-derived永続commitmentが必要な場合は設計16に従い、domain separator付きrandom 256-bit nonceまたはversion固定HMACを使う。そのsecure materialが必要になった時点で停止し、Mashへ具体的なlocal作業を依頼する。

## 8. 必須independent validation / mutation

### 8.1 origin / determinism

- Plan、Evidence resolver、frozen semantic-restatementから独立再構築し完全一致する。
- schema / adapter / policy / plan / restatement / authority / witness / snapshot hashをcanonical serializationでbindする。
- strict type、unknown key拒否、ID一意性、canonical order、全参照整合性を検証する。
- private request-local origin capabilityなしのclone / replace / forged objectを拒否する。
- materialize前に再検証する。

### 8.2 relation attack

from owner、to owner、endpoint role、owner swap、direction、effective type、retention、Evidence aliasを一つずつ変える。片endpoint削除、重複、別caseのvalid owner混入も独立に拒否する。

### 8.3 construction / topology attack

instance ID、parent、slot role、range、construction code、interval relation、participationを一つずつ変える。orphan、duplicate、edge削除、cycle相当の矛盾、`partial_overlap / coextensive`を`contains`へ偽装、inner construction削除を拒否する。

### 8.4 semantic link / unknown attack

semantic linkのendpoint、direction、type、unit participationを独立に変える。explicit unknownのvalid別dimension、source span、affected owner追加 / 削除 / swap / order、role kind、required、欠落 / 重複を独立に拒否する。

### 8.5 coverage / privacy / resource attack

coverage値のstrict type、unknown field、stale hashを拒否する。raw body、unsalted digest、case cueがmaterial / repr / errorへ混入しないことをscanする。resourceはbound-1、bound一致、bound+1を試し、+1だけをtruncateなしでfail-closeする。

## 9. E1b RED testの将来取扱い

baseline E1b fileは、本補遺作成時点では変更しない。successor実装が別途承認された場合だけ、次のtest-harness migrationを許可する。

許可:

1. import / builderをv2 successorへ向ける。
2. cross-span relation参照先をfrozen `plan.relations`からsuccessor relation authorityへ向ける。
3. Plan projection対象では`source_grounding_kind=user_stated_relation`を維持する。coexistence対象だけ、旧`user_stated_relation / required` assertionを、`authority_basis=source_explicit_refinement`、sourceの`bounded_structural_inference / should`保持、exact marker range / policy、`experiment_required_refinement`の複合assertionへ置き換える。
4. `getattr(row, "source_owner_id", row.owner_nucleus_id)`のdefault先行評価bugを、field existenceを安全に判定する形へ直す。
5. v2 closed field名への機械的な変更。

不変:

- 5つの意味論点。
- sampleと期待relation semantics。
- endpoint、direction、cardinality、unknown、coverage否定の期待。
- predecessor file SHA-256とretarget diffのreceipt記録。

禁止:

- assertion削除 / 弱化、空集合許容、mockだけによるGREEN化。
- `skip` / `xfail` / failure codeの無視。
- Plan required coverageの変更または偽装。
- old RED hashをlineageから消すこと。

## 10. 実装が別途承認された場合の順序

1. `A0 Freeze`: GitHub baseline、Step 9全20 owner、E1b predecessor、rc0027 source parent、既知Step 10 driftをbody-free ledgerへ固定する。
2. `A1 Successor RED`: closed schema、bounds、origin、mutation、runtime-disconnect、privacyを新規testでRED固定する。
3. `A2 Authority GREEN`: relation / construction authority successorだけを実装する。
4. `A3 Witness GREEN`: lexical successorへendpoint / link / unknown / facet-presence-onlyをlossless projectionする。
5. `A4 Snapshot GREEN`: unchanged base snapshotとsuccessor commitmentをruntime非接続で結ぶ。
6. `A5 E1b retarget`: §9の限定diffだけでE1bをsuccessorへ向け、5件をGREENにする。
7. `A6 Closure audit`: independent manifest、reverse import、whole100 body-free count、mutation、privacy、performance boundを再確認する。

A0〜A6の途中でSTOP条件に当たれば、その場で実装を止め、影響ownerと理由をMashへ提示する。E2へ自動で進まない。

## 11. GREEN条件

successor実装checkpointは、次を全て満たした場合だけ`E1b experiment successor information closure GREEN`と表記できる。

1. 既存v1 E0a / E1a / Step 4対象回帰`49 passed`を維持する。
2. successorへ限定retargetしたE1b 5件が全GREENで、assertion / sample / expectationの弱化がない。
3. frozen 100のbody-free authority監査で、required cross-span relation 68件、source-explicit unknown 27件、semantic units 10件、semantic links 5件、overlap 1件がlosslessにaccountされる。
4. 各admitted relationにexactly 2 endpoint bindingがある。
5. semantic link / explicit unknownがfrozen sourceと1対1で一致する。
6. `facet_present`がsemantic coverageを自己認証しない。
7. canonical rebuild、origin、strict schema、unique ID、order、hash、全mutationがGREENである。
8. Step 9全20 source ownerとmanifestのlive bytesがbaseline一致し、validatorがPASSする。
9. runtime reverse import 0、Surface / Parser / Matcher / Gate / runtime change 0である。
10. forbidden workaround scan 0、privacy leak 0、bound超過はclosed failである。

E1b GREENは情報閉包の証明だけである。Product Read、E2開始、rc0028採用、formal freeze、Cycle 001 ACCEPTEDを意味しない。

## 12. STOP / rollback

次のいずれか一つで停止する。

1. Step 9 source ownerまたはhistorical manifestの1 byte変更が必要。
2. base Planのrequired coverage、retention、relationを変更・偽装する必要がある。
3. arbitrary relation、topic dictionary、case cue、fixture metadata、phrase bankが必要。
4. constructionとsemantic relationの競合をsource authorityから一意に解決できない。
5. range crossingを虚偽のsemantic equivalence aliasへ丸めないと閉じない。
6. fixed resource denominator、candidate 12、replan 1、recovery、one-anchor上限を拡張する必要がある。
7. Gate弱化、assertion弱化、skip / xfailが必要。
8. raw / private body、unsalted body digest、secure keyをshareable artifactへ出す必要がある。
9. active `GroundedSourceSnapshot`、Surface、Parser、Matcher、Gate、runtime / production接続が必要。
10. 既存49件を削除・弱化しないとGREENにならない。

rollbackは、successorで追加したv2 owner、独立manifest / tool / fixture / testと、許可されたE1b test-harness diffだけを不採用にする。v1、Step 9 closure、baseline E1b RED commitと失敗理由をappend-only evidenceとして保持する。Cycle 001は`NOT_ACCEPTED`のままとする。

## 13. 次のauthority境界

本補遺の次に実装を開始する場合の正確な指示案:

> 「GitHub commit 31d3cf183589b27481338277574f90500f3c5b11をbaselineとして、rc0028 E1b successorのA0〜A6実装を開始する。本補遺の新規owner、独立experiment manifest、限定E1b test-harness migrationだけを許可し、Step 9全20 owner、v1 checkpoint、downstream runtimeを不変にする。既存authority外が必要なら停止して影響範囲を提示する。」

この次の指示にもE0b、E2、Step 10 reconciliation、formal / production、Cycle 001 acceptanceは含めない。

## Appendix A. Step 9 frozen 20 source owner

1. `emlis_ai_body_semantic_atom_parser_v3.py`
2. `emlis_ai_bounded_recovery_v3.py`
3. `emlis_ai_canonical_renderer_v3.py`
4. `emlis_ai_content_selection_v3.py`
5. `emlis_ai_discourse_graph_planner_v3.py`
6. `emlis_ai_evidence_ledger_service.py`
7. `emlis_ai_grounded_observation_plan.py`
8. `emlis_ai_grounded_observation_semantic_restatement_v3.py`
9. `emlis_ai_independent_semantic_matcher_v3.py`
10. `emlis_ai_lexicographic_selector_v3.py`
11. `emlis_ai_nls_v3_artifact_contract.py`
12. `emlis_ai_observation_stage_context_v3.py`
13. `emlis_ai_reply_service.py`
14. `emlis_ai_semantic_hard_gate_v3.py`
15. `emlis_ai_semantic_obligation_inventory_v3.py`
16. `emlis_ai_step8_artifact_contract_v3.py`
17. `emlis_ai_step9_artifact_contract_v3.py`
18. `emlis_ai_surface_grammar_catalog_v3.py`
19. `emlis_ai_surface_grammar_catalog_v3_step8.py`
20. `emlis_ai_typed_surface_ast_v3.py`
