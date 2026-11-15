---
doc_id: piece_source_role_matrix_20260807
title: "Piece cross-core source role matrix"
created_at: "2026-08-07 JST"
revision_date: "2026-11-15 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece / EmlisAI / Analysis"
phase: "PCE-2 Cross-Core Source Handoff"
document_status: "PCE2_COMPLETE_DESIGN_ONLY"
contract_id: "cocolon.cross_core.source_role_matrix.v1"
parent_contract_id: "cocolon.cross_core.source_handoff.v1"
source_cocolon_head: "1ea6fe60a2b43c11d02f15c63babf4ce0b75a469"
source_mashos_api_head: "315813c7bd3372462de926ddad74df567254a6b5"
automatic_progression: false
production_effect: "exact0"
---

# Piece cross-core source role matrix

## 1. role class

2026-11-15の限定実装差分は`corrected_observation`だけに追加する。normal／pre-question／refinedの既存契約と保存済みlineageは変更しない。source実装・RN境界と、検証・SQL適用・通常反映・CIの成否を分け、最終結果は[補助設計§9.72](../../Cocolon_前提資料/designs/cmee/Cocolon_CMEE_AuxiliaryAsset_Reuse_ImplementationDesign_20261108.md#piece-answer-corrections-normal-rollout-20261115)へ戻る。build／TestFlight／本人実機は保留し、新実4B・一般品質の成立へ換算しない。 8月のdesign-only／runtime exact0は当時のPCE-2単位の状態として保持する。

PCE-2では、`source role`を一つの配列へ潰さず、次の2 classへ分ける。

```text
semantic source role:
  Piece content ownerが、認証済みsource bodyを読むためのrole。

lineage control role:
  stage / ordering / admissionを証明するidentity。
  Piece本文の意味材料にはしない。
```

## 2. canonical roles

| role | class | body owner | normal | pre-question | refined | corrected | Piece text material | persisted body-free lineage |
|---|---|---|---:|---:|---:|---:|---|---|
| `original_input` | semantic | saved input owner | exact1 | exact1 | exact1 | exact1 | allowed | required |
| `supplemental_answer` | semantic | question / answer owner | exact0 | exact0 | exact1 | ANSWER0:0／併存:1..3 | 別partition。選択最新の有効部分と先行有効REVISEだけ | latest answerの条件付きidentity／commitment、全回答はprivate fence |
| `interpretation_correction` | semantic | saved interpretation-correction owner | exact0 | exact0 | exact0 | 1..N | 各本人説明の現在有効な範囲だけ | latest-only private four-key binding、全履歴はprivate fence |
| `emlis_observation_result` | control | Emlis result owner | exact1 | exact1 | exact1 | exact1 | forbidden | required |
| `question_need_decision` | control | question system owner | exact0 | exact1 | exact1 | ANSWER0:0／併存:1 | forbidden | 明示選択した最新回答の実QUESTION event |
| `ai_interpretation_target` | control | Emlis saved target owner | exact0 | exact0 | exact0 | exact1 | forbidden | target event identity only |
| `piece_generation_eligibility` | control | cross-core adapter | exact1 | exact1 | exact1 | exact1 | forbidden | required |
| `analysis_inference` | forbidden | Analysis | exact0 | exact0 | exact0 | exact0 | forbidden | forbidden |
| `analysis_route` | forbidden | Analysis | exact0 | exact0 | exact0 | exact0 | forbidden | forbidden |
| `simulated_route` | forbidden | simulation owner | exact0 | exact0 | exact0 | exact0 | forbidden | forbidden |
| `emlis_visible_body` | forbidden | Emlis surface owner | exact0 | exact0 | exact0 | exact0 | forbidden | forbidden |
| `emlis_internal_artifact` | forbidden | Emlis internal owner | exact0 | exact0 | exact0 | exact0 | forbidden | forbidden |
| `public_hidden_meta` | forbidden | public boundary owner | exact0 | exact0 | exact0 | exact0 | forbidden | forbidden |

## 3. original_input

```text
cardinality:
  exact1 in every supported stage

identity:
  source_input_id
  source_input_version
  source_input_bundle_commitment

ownership:
  saved source owner

control-plane owner:
  yes

overwrite:
  prohibited
```

`original_input`は、current user inputの保存正本である。Piece textはoriginal bodyそのものでも短縮copyでもないが、Piece content ownerがmeaningを組み立てるprimary source rootである。

次を禁止する。

- raw client payloadだけで成功する。
- Emlis visible bodyをoriginalの代替にする。
- supplemental answerをoriginal identityへ書き戻す。
- Analysis outputをoriginal inputとして扱う。
- simulated routeをobserved inputとして扱う。

## 4. supplemental_answer

```text
cardinality:
  normal exact0
  pre-question exact0
  refined exact1
  corrected ANSWER0: exact0 / explicit answer selection: 1..3 real envelopes

identity:
  supplemental_answer_identity
  supplemental_answer_version
  supplemental_answer_bundle_commitment

ownership:
  question / answer owner

control-plane owner:
  no
```

refinedおよび実回答併存corrected stageでは、supplemental answerをoriginalと別のsemantic partitionとして扱う。併存correctedの複数実回答envelopeを、そのまま全て本文へ連結する意味ではない。

必須条件:

1. originalと別identityである。
2. originalと別commitmentである。
3. corresponding `question_need_decision_identity`が存在する。
4. 該当refined／corrected Emlis result identityが元sourceと選択回答のcommitmentにbindされる。
5. source roleを失わず、本文生成後もlineageへ残る。
6. originalの欠落を補うplaceholderとして使わない。

### correctedの本人説明とAI対象

`interpretation_correction`は実`USER_INTERPRETATION_CORRECTION` envelopeの本人説明、`supplemental_answer`は実ANSWERの別roleである。AI対象引用は`ai_interpretation_target` controlだけに保持する。ANSWER0の既存2 semantic／2 controlsと、nullのquestion／supplemental identity・version／commitmentは保持する。

実ANSWER1〜3の後にproper訂正を保存した併存時だけ、semantic rolesは`[original_input,supplemental_answer,interpretation_correction]`、controlsは`[emlis_observation_result,question_need_decision,ai_interpretation_target]`。公開source-ref7keysは増やさず、最新CORRECTED OBSと、明示した最新実ANSWER／その実QUESTION eventの条件付きpairを結ぶ。最新ANSWERのversion／commitmentはprivate observation lineageへ保持する。

corrected-only `interpretation_correction_source`は従来4keys（correction_id／source_version／explanation_commitment／target_event_id）のまま最新訂正を指す。全訂正はprivate fenceのsource／prior_sources／prefix／全events／thread_dataへ、全実回答とcheckpointは同fence内の`answer_sources`／`answer_checkpoints`へ保持する。これらは公開lineage／DTOではなく、外側の`meaning_checkpoint(s)`へ混在させない。

最新の読めるADDまたは原完全節へのREVISE／WITHDRAWを明示選択する。先行REVISEの有効置換は保持するが、先行独立ADDは本文へ加えない。読める先行ADDは既存shared compatibility検査に残し、opaqueな先行ADDは履歴controlのみ、opaqueな選択最新回答は拒否する。proper訂正は全回答の後で、異なる原入力の完全な節に対する単一REVISE／WITHDRAWに限る。回答／置換節への再訂正、曖昧な原／回答対象、既撤回節の復活、一般自由文は未対応。

COMPLETED／FINAL・最新CORRECTED OBS、原active nonempty・3body block・short_essay・独立S7・権利を保持する。訂正回数へ問いの3回上限を流用しない。各sourceと受領／完了・prefix・本人説明時刻を全履歴で再照合し、RN取得・preview・結果不明save復元では最新ANSWERと表示OBSの両IDを固定する。API `24bc228dbf54abc983906323c0ae7d937fae1fd6`／RN `70527711e92821c0ae6f8704be5331f6c8011147`をsource反映済み。通常DBへmigration20261115011424を適用し、API／workerとも24bc228dでLive、Piece／AnalysisとRNのCI成功を確認した。併存経路の通常DB／API反映と対応RN sourceの限定単位は完了。§9.71のANSWER0経路と通常d10c3f86の先行完了を維持する。 検証／通常反映の終状態は[補助設計§9.72](../../Cocolon_前提資料/designs/cmee/Cocolon_CMEE_AuxiliaryAsset_Reuse_ImplementationDesign_20261108.md#piece-answer-corrections-normal-rollout-20261115)へ集約する。

## 5. question_need_decision

```text
class:
  lineage control only

semantic source:
  false

required:
  pre-question exact1
  refined exact1
  corrected explicit answer selection exact1

forbidden:
  normal
  corrected ANSWER0
```

question need decisionは、なぜfuture stageへ進んだかを証明するcontrol-plane identityである。質問本文、回答候補、判断理由をPiece contentへ渡さない。

current Emlis NLS v3でも、refined source partitionはquestion decisionをsemantic sourceではないと扱う。PCE-2はこの境界をcross-core contractへ継承する。

## 6. emlis_observation_result

```text
class:
  lineage control only

required:
  exact1 in all stages

fields:
  emlis_observation_stage
  emlis_observation_result_identity
  emlis_observation_result_state
```

Emlis result identityは、次を証明する。

- exact source commitmentに対する結果である。
- exact stageに対する結果である。
- terminal stateへ到達した。
- Piece eligibility発行より前に成立した。

証明しないもの:

- Emlis visible textがPiece textに適している。
- Emlis内部artifactをPieceが読める。
- Analysisが完了した。
- Piece content safetyが成立した。

## 7. piece_generation_eligibility

```text
class:
  lineage control only

contract:
  piece.generation_eligibility.v1

decision:
  eligible | ineligible

missing default:
  ineligible
```

decision ownerは上位cross-core adapterである。Emlis内部module、Piece generation owner、RN clientのいずれも独断でtrueへ変えない。

`eligible`はsource handoff admissionであり、quota、visibility、format、public safety、render成功を意味しない。

## 8. stage matrix

| invariant | normal | pre-question | refined | corrected |
|---|---:|---:|---:|---:|
| original input identity | exact1 | exact1 | exact1 | exact1 |
| original bundle commitment | exact1 | exact1 | exact1 | exact1 |
| Emlis result identity | exact1 | exact1 | exact1 | exact1, latest CORRECTED OBS |
| terminal success required for eligibility | yes | yes | yes | yes |
| question decision identity | exact0 | exact1 | exact1 | exact0/null |
| supplemental identity | exact0 | exact0 | exact1 | exact0/null |
| supplemental bundle commitment | exact0 | exact0 | exact1 | exact0/null |
| semantic roles | `[original]` | `[original]` | `[original,supplemental]` | `[original,interpretation_correction]` |
| original remains root | yes | yes | yes | yes |
| answer assumed | no | no | yes, separately saved | no, first correction1/ANSWER0 |
| Analysis dependency | exact0 | exact0 | exact0 | exact0 |

## 9. identity / body matrix

| material | handoff may carry | Piece source_lineage may persist | Piece content owner may retrieve body | public API exposure fixed by PCE-2 |
|---|---:|---:|---:|---:|
| source input ID/version/commitment | yes | yes | ID-authorized only | no |
| original input body | no | no | yes, internal authorized retrieval | no |
| supplemental ID/version/commitment | refined only | refined only | refined internal retrieval | no |
| supplemental body | no | no | refined internal retrieval | no |
| corrected explanation identity/version/commitment and target event ID | corrected private only | corrected private four-key binding only | explanation only, authenticated separate source | no additional public key |
| corrected explanation / AI target body | no | no | qualified explanation only; AI target is control | no |
| question decision identity | conditional | conditional | no body retrieval for Piece | no |
| question decision body | no | no | no | no |
| Emlis result identity/state | yes | yes | no body retrieval for Piece | no |
| Emlis visible body | no | no | no | no |
| Analysis identity/result | no | no | no | no |
| eligibility decision/reasons | yes | yes | no body | no |

PCE-2はpublic response shapeを変更しない。将来publicへ必要な最小CTA materialはPCE-6で別に決める。

## 10. owner equality

```text
saved_input.owner_user_id
  == requested Piece.owner_user_id
  == authenticated principal
```

このequalityを満たさないsource referenceは、bodyを読まずにrejectする。RNから送られたowner IDだけで成立させない。

supplemental answerも同じauthenticated principalへbindされなければならない。cross-user original/supplemental combinationは禁止する。correctedの本人説明も同じowner・original source・thread・対象eventへ束縛し、別人／別版／別訂正との組合せを拒否する。

## 11. version and immutability

```text
source_input_version:
  source bundle schema version

source_input_bundle_commitment:
  exact source body version identity

record mutation:
  commitmentが変われば別source versionとして扱う。
  existing Piece lineageを暗黙更新しない。
```

correctedでは説明・対象・訂正版の変更を旧lineageへ上書きせず、最新CORRECTED OBSと訂正sourceの版／commitmentを再照合する。RNの明示選択・source GET・保存不明の復元は同OBS／stageだけを認める。

現在のadapter candidateは`emlis.current_input_bundle.v1`である。将来saved source schemaが変わる場合、旧versionの意味を上書きせず、新versionを追加する。

## 12. Analysis reuse boundary

Analysis roadmapが再利用してよいもの:

```text
source_input_id / version / commitment semantics
original / supplemental role separation
stage names
event ordering
owner equality
body-free lineage
negative codes
```

再利用してはいけないもの:

```text
Piece eligibilityをAnalysis eligibilityへ流用する
Piece textをAnalysis factにする
Analysis routeをPiece sourceにする
Piece lifecycle / visibility / quotaをAnalysisへ持ち込む
```

## 13. closure

```text
SEMANTIC_AND_CONTROL_ROLES_SEPARATED
ORIGINAL_INPUT_EXACT1_ALL_STAGES
SUPPLEMENTAL_ANSWER_REFINED_EXACT1_ONLY
QUESTION_DECISION_CONTROL_ONLY
EMLIS_RESULT_CONTROL_ONLY
ANALYSIS_ROLE_IN_PIECE_SOURCE_EXACT0
SIMULATED_ROLE_IN_OBSERVED_SOURCE_EXACT0
CROSS_USER_SOURCE_REFERENCE_FORBIDDEN
SOURCE_BODY_IN_LINEAGE_EXACT0
PCE2_SOURCE_ROLE_MATRIX_COMPLETE_DESIGN_ONLY
```
