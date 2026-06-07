# Cocolon EmlisAI Public Observation Recovery 実装反映メモ

作成日: 2026-06-06  
対象: `Cocolon_前提資料(180).zip` / `Cocolon_11(8).zip` / `mashos-api_11(17).zip`  
作業種別: 前提資料差分更新。コード変更なし。  
基準判断: ローカル実ファイル基準。GitHub接続確認不要。  

---

## 0. 結論

最新実ファイルでは、EmlisAI Gate Recovery public surface leak repair P0〜P12とNormal Observation Public Recoveryを土台に、**Public Observation Recovery P0〜P10** が実装済みである。

この実装は、`comment_text` を無条件に出す修正ではない。次の3段階を分ける。

```text
public_reached: input_feedback が public response に含まれる。
rn_visible: observation_status == passed かつ comment_text non-empty でRN modalが開ける。
product_surface_valid: 必要なsurface family / 二段本文shape / Gate / body-free meta境界まで満たす。
```

中心となる追加source kindは次である。

```text
normal_observation_rebuild_candidate
complete_initial_surface_recomposition_candidate
labelled_two_stage_surface_recomposition_candidate
```

役割は分離する。

```text
normal_observation_rebuild_candidate:
  元AI生成候補と本文がある通常surface failureだけを再表面化する。

complete_initial_surface_recomposition_candidate:
  C系の complete_initial_surface_unavailable / source_unavailable を、normal rebuildへ偽装せず、material sufficient / safe の場合だけ別laneでpublic observation candidateへ戻す。

labelled_two_stage_surface_recomposition_candidate:
  D / Phase17 / ProductVisible の two_stage_required 入力を、plain surfaceではなく「見えたこと：」「Emlisから：」の二段surfaceへ戻す。
```

---

## 1. 実ファイル差分

作業開始時実体 `Cocolon(210).zip` / `mashos-api(123).zip` から、最新実体 `Cocolon_11(8).zip` / `mashos-api_11(17).zip` までの差分は次として読む。

| repo | added | changed | removed |
|---|---:|---:|---:|
| Cocolon | 0 | 0 | 0 |
| mashos-api | 16 | 11 | 0 |

差分詳細は `cocolon_local_file_inventory_diff_20260606.csv` に保持する。

---

## 2. 追加・変更された主な構造

| Phase | 追加/変更 |
|---|---|
| P0 | `public_reached` / `rn_visible` / `product_surface_valid` の三段階と失敗名を固定。 |
| P1 | `emlis_ai_public_surface_requirement.py` を追加し、labelled two-stage / plain / low-information / safety / infraをbody-freeに判定。 |
| P2 | normal rebuildのtwo-stage boundaryを補正し、`normal_observation_rebuild_blocked_two_stage_required` を追加。 |
| P3 | `emlis_ai_product_surface_validation.py` を追加し、RN表示到達と商品surface成立を分離。 |
| P4 | `emlis_ai_complete_initial_surface_availability.py` を追加し、`complete_initial_surface_unavailable` の前段原因をsource availabilityとして診断。 |
| P5 | `emlis_ai_complete_initial_surface_recomposition.py` を追加し、C系source unavailableをnormal rebuildではない別laneで回復。 |
| P6 | `emlis_ai_labelled_two_stage_surface_recomposition.py` を追加し、two_stage_requiredをlabelled two-stageへ再構成。 |
| P7 | `emotion_submit_service.py` のpublic feedback inclusion summaryを三段階化。 |
| P8 | `public_surface_lineage` とProductQuality lineageを追加し、P5/P6 sourceをbody-freeに区別。 |
| P9 | `emlis_ai_complete_surface_realizer.py` を補正し、Acceptance E2Eの二段surface / positive-change / effort-pace系を緑化。 |
| P10 | production logicは触らず、P0/Phase19 diagnostic helperをbounded traversal化し、巨大meta検査を安定化。 |

---

## 3. eligibility / boundary

normal rebuildを試す条件:

```text
original_composer_candidate が存在する
composer_source == ai_generated
ai_generated == true
comment_text が空ではない
material_quality が low_information / limited_grounding ではない
Gate Recovery material surface / diagnostic recovery surface lineageではない
surface_grammar / relation_skeleton / visible_surface / runtime_surface / koto_splice系のrepairable reason familyを持つ
safety / source_unavailable / composer_disabled / phase_not_complete / grounding_unsupported / reader_failure / template_echo_major / public_boundary_blocked / infrastructure_errorを含まない
two_stage_required ではない、または plain_state_answer が商品契約として許可されている
```

complete initial surface recompositionを試す条件:

```text
safe
material sufficient
complete initial client resolved または complete initial requested
candidate generation attempted
candidate before display gate が unavailable / not generated
first blocker が source_unavailable / complete_initial_surface_unavailable 系
normal_observation_rebuild_allowed == false
surface requirement decision が存在する
```

labelled two-stage recompositionを試す条件:

```text
two_stage_required == true
元候補が plain surface、または labelled でもsurface invalid
observation_status が既にpassedではない
既存material / section plan / surface realizerから二段本文を再構成できる
```

---

## 4. 不変境界

```text
RN production UI変更なし
RN表示タイトル Emlisの観測 変更なし
RN表示条件 observation_status == passed && comment_text non-empty 変更なし
/emotion/submit route変更なし
request key変更なし
public response top-level key変更なし
DB physical schema / write path変更なし
Gate緩和なし
固定テンプレート追加なし
Gate Recovery material surfaceのpublic昇格なし
source unavailableのnormal rebuild偽装なし
two_stage_requiredのplain surface成功扱いなし
raw input / original body / candidate body / comment_text bodyのpublic meta混入なし
```

---

## 5. 検証記録

P10時点の前回実装確認記録として、次を保持する。

```text
P0〜P8主要確認: 36 passed, 1 warning
normal rebuild / gate recovery / public meta周辺: 17 passed / 14 passed / 33 passed, 1 warning
Phase19 ABCD public feedback E2E: 5 passed, 1 warning
TwoStage reception E2E: 6 passed, 1 warning
TwoStage ProductVisible fixture: 20 passed
RN contract: 36 passed
```

warningは既存の Pydantic `root_validator` deprecation warning系として扱う。P10の実装差分はproduction本文生成・Gate・RN表示契約ではなく、回帰検査用diagnostic走査のbounded化である。
