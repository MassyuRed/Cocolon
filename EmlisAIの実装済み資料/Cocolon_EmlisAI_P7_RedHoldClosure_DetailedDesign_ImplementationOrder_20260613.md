# Cocolon / EmlisAI P7 RED・HOLD Closure 詳細設計書・実装順

作成日: 2026-06-13 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書  
対象: Cocolon / EmlisAI / Product Quality Runner / Long-run Product Gate / P7 RED・HOLD closure  
基準資料: `Cocolon_EmlisAI_P7_RedHoldClosure_PreDesign_ConsiderationMemo_20260613.md`  
GitHub接続確認: 不要（Mash様指定により未実施）  
コード変更: なし  
DB変更: なし  
RN変更: なし  
API route / request key / public response top-level key変更: なし  
json / schema実ファイル化: なし。案のみ本設計書内に記載。  

---

## 0. この設計書の結論

今回の実装対象は、**P7: Product Quality Runner / Long-run Product Gate のRED/HOLD closure** です。  
P8: Personal Continuity / Derived User Model には進みません。

理由は明確です。

```text
P7 core測定構造は入っている。
しかし、P7-RED-001 / 002 / 003 と P7-HOLD-001〜004 が残っている。
この状態でP8へ進むと、読めていないもの、未確認のもの、実機で見ていないものの上に、個人継続性・ユーザー辞書・価値anchorを積むことになる。
```

Cocolonとして守るべき中心は、次です。

```text
読めていないものを、読めた扱いにしない。
表示されたことを、商品品質と混同しない。
test greenを、ユーザー体験の確認済みに変換しない。
履歴線や構造気づきを、気持ち悪さ・決めつけ・自己責め誘導へ進ませない。
```

したがって、実装順は次の優先度で固定します。

```text
最優先: P7-RED-001 / P7-RED-002
  Positive Recovery relation surface / signal key / fail-closed境界を修復する。

次点: P7-RED-003
  Product Quality Connection E2E timeout / hangを本線greenへ混ぜず、owner layer / timeout budget / validation matrixへ閉じる。

その後: P7-HOLD-001〜004
  P5 human QA、P6 visible横展開禁止、実機submit、full backend suite未実行をgreen化せず、評価材料とvalidation matrixへ保持する。
```

本設計書は、**実装前の詳細設計**です。  
ここに含めるjson / schema案は、実装段階で既存ファイル配置・既存schema・既存Guard・既存test結果を見て、実ファイル化するか判断します。

---

## 1. なぜこの順番で実装するのか

P7に残っている赤のうち、最もCocolonの商品価値に直結するのは **P7-RED-002: Positive Recovery fail-closed regression** です。

現象は次です。

```text
relation surface がまだmissingであるべきケースで、observation_status が rejected ではなく passed になる。
```

これは、単なるtest期待のズレではなく、Cocolonとしては次の危険を持ちます。

```text
EmlisAIが、関係surfaceを読めていないのに、読めた形でユーザーへ返してしまう。
```

Cocolonは、ユーザーの入力を文字列として処理するアプリではありません。  
ユーザーが置いた感情・カテゴリ・行動・思考・時点を観測し、その言葉がどの情報をどの箱に詰めて出されたかを、入力直後に「読まれた形」として返す場所です。

そのため、Positive Recoveryで必要なのは、単に「回復」というrelation typeがあることではありません。

```text
戻ってくる動き
その前にあった負荷・重さ・疲れ・流れ
この二つが同じ流れとしてsurfaceに出ていること
```

この橋が出ていない場合、Emlisは「回復」という広い語を見ているだけで、ユーザーが書いた回復と負荷の関係を読めていません。  
P8の個人継続性は、この「読めているか」の境界が信用できてから進めます。

---

## 2. 確認済みの現在地

### 2.1 参照した主な資料

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
Cocolon_前提資料/cocolon_environment_state_output_observation_structure_design_2026_05_25.md
Cocolon_前提資料/07_latest_snapshot_diff.md
Cocolon_EmlisAI_longterm_roadmap_20260608.md
Cocolon_EmlisAI_P7_RedHoldClosure_PreDesign_ConsiderationMemo_20260613.md
```

### 2.2 参照した主な実ファイル

```text
Cocolon/tests/rn-screen-contracts.test.js

mashos-api/ai/services/ai_inference/emlis_ai_relation_surface_contract.py
mashos-api/ai/services/ai_inference/emlis_ai_listener_reader_judge.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_loop.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_reply_diagnostics_service.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_product_quality_measurement_connection.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_contracts.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_red_ledger.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_runner_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_event_bridge.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_blind_qa_material.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_long_run_gate_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py

mashos-api/ai/tests/test_emlis_ai_complete_product_quality_positive_recovery_e2e.py
mashos-api/ai/tests/test_emlis_ai_complete_product_quality_connection_e2e.py
mashos-api/ai/tests/test_emlis_ai_p7_*_20260612.py
```

### 2.3 現時点のテスト読み

前回検討メモで固定した結果に加えて、本設計書作成中にも Positive Recovery E2E の現象を再確認しました。

```text
Positive Recovery E2E:
  2 failed

失敗1:
  expected: reader_gate["reader_relation_signal_keys"] includes "recovery_load_bridge"
  actual: ["recovery"]

失敗2:
  expected: reply.meta["observation_status"] == "rejected"
  actual: "passed"
```

この結果は、本設計書の実装優先順を補強します。

---

## 3. IN SCOPE / OUT OF SCOPE

### 3.1 IN SCOPE

```text
1. P7-RED-001原因切り分けと修復
   - relation type / relation signal key / relation marker keyを分離する。
   - "recovery" という広いrelation typeを、"recovery_load_bridge" という具体surface signal keyとして扱わない。
   - Reader Gate / Gate Recovery / diagnostics / P7 eventへbody-freeに保持する。

2. P7-RED-002 fail-closed境界修復
   - relation surface missing時にpassedへ進ませない。
   - repair / rerender / gate recovery loop後も、具体signalが出なければfail-closedを維持する。
   - 表示到達率改善として扱わない。

3. P7-RED-003 timeout隔離
   - heavy E2EをP7 core green条件へ混ぜない。
   - timeout / hangをowner layer / timeout budget / blocker refsへ分解する。
   - timeoutしてもrelease readyへ昇格しないことを確認する。

4. P7-HOLD-001 human QA材料境界
   - P5 history lineのhuman QAに必要な本文確認と、release materialのbody-free境界を分ける。
   - reviewer free textをP7 scorecard / release handoffへ入れない。

5. P7-HOLD-002 P6 visible横展開禁止保持
   - structure_question限定visibleを維持する。
   - long_meaning_arc / self_understanding_follow はmaterial-onlyまたはreview_requiredに留める。
   - daily / low-info / positive-only / safety adjacent no-connectを維持する。

6. P7-HOLD-003 / 004 未確認保持
   - 実機submit / スマホmodal読感を自動testで閉じない。
   - full backend suite未実行をgreen化しない。
```

### 3.2 OUT OF SCOPE

```text
- P8 Derived User Model / Personal Continuityの実装
- P9 External Pilot
- P10 Release Readiness
- release_allowed true化
- RN UI変更
- RN表示タイトル変更
- RN表示条件変更
- API route変更
- request key変更
- public response top-level key変更
- DB schema / DB write path変更
- fixed commentText追加
- case専用mode / cue / surface追加
- Gate閾値緩和
- raw input / comment_text body / candidate body / surface body のpublic meta混入
- heavy E2E削除によるgreen化
```

---

## 4. RED / HOLD closure 方針一覧

| id | 現象 | 実装上の扱い | closure条件 | release扱い |
|---|---|---|---|---|
| P7-RED-001 | `reader_relation_signal_keys` が `recovery_load_bridge` ではなく `recovery` になる | relation type と strict surface signal key の分離 | strict recovery bridgeがReader/Gate Recovery/diagnosticでbody-freeに保持される | closureまでrelease blocker |
| P7-RED-002 | relation surface missingでも `passed` になる | strict relation missing時のfail-closed維持 | repair後も具体signalがなければ `rejected` / comment empty / relation_not_expressed保持 | closureまでrelease blocker |
| P7-RED-003 | Product Quality Connection E2E timeout / hang | heavy isolated redとして隔離 | timeout owner / last stage / budget / blocker refsがbody-freeに出る | closureまでrelease blocker |
| P7-HOLD-001 | P5 human Blind QA未完 | ratings-only + local isolated body review境界 | human QA材料とrelease materialが分離される | hold |
| P7-HOLD-002 | P6 visible横展開禁止 | family boundary validation | no-connect / meta-only / review_requiredが保持される | hold |
| P7-HOLD-003 | 実機submit / modal読感未確認 | manual checklist | 自動test greenと分けて実機確認待ちに残る | hold |
| P7-HOLD-004 | full backend suite未実行 | split matrix | 未実行を未実行としてvalidation matrixに残す | hold |

---

## 5. 実装順の全体像

実装は、次の12段階で進めます。

```text
R0: Baseline freeze / no-code reproduction
R1: Positive Recovery strict relation trace追加
R2: relation type / signal key / marker key のcontract分離
R3: Gate Recovery合成ReaderReportのstrict relation修復
R4: Positive Recovery fail-closed境界修復
R5: Positive Recovery E2E red closure test更新・追加
R6: P7-RED-003 timeout isolation設計の実装反映
R7: P7 red closure classification matrix実装
R8: P5 human QA material boundary実装
R9: P6 visible expansion boundary validation実装
R10: 実機submit / full backend suite HOLD matrix実装
R11: release handoff / validation matrixの最終整合
R12: 実装結果md作成
```

この順番は、RED-001 / 002 を先に閉じるためのものです。  
P7-RED-003やHOLDを先に整理しても、読めていないものがpassedになる境界が残る限り、Cocolonの商品価値上はP8へ進めません。

---

## 6. R0: Baseline freeze / no-code reproduction

### 6.1 目的

実装前に、現在の赤を再現できる状態として固定します。  
ここではコード変更しません。

### 6.2 実行対象

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_complete_product_quality_positive_recovery_e2e.py

PYTHONPATH=services/ai_inference timeout 30s pytest -q --tb=short \
  tests/test_emlis_ai_complete_product_quality_connection_e2e.py
```

### 6.3 記録すること

```text
- Positive Recovery E2Eの2 failureが再現するか。
- reader_gate["reader_relation_signal_keys"] のactual。
- reply.meta["observation_status"] のactual。
- Product Quality Connection E2Eがtimeout / fail / pass / hangのどれか。
- コード変更前であること。
```

### 6.4 完了条件

```text
- P7-RED-001 / 002 / 003 の再現または現象変化が記録される。
- test stale / implementation regression / diagnostic mapping issue / runtime route shadowing を、まだ断定しない。
```

---

## 7. R1: Positive Recovery strict relation trace追加

### 7.1 目的

Positive Recoveryで必要な「回復と負荷の橋」が、どの層で消えているかをbody-freeに追跡します。

現在見えている問題は、少なくとも次のどれかです。

```text
A. Composer candidateには `recovery_load_bridge` があるが、Reader Gateへ渡る前に `recovery` へ丸められている。
B. Reader Gate自体はstrict relation contractを読めるが、Gate Recovery Loopが広い `used_relation_ids=["recovery"]` から合成ReaderReportを作っている。
C. diagnostic summaryがReader由来signalではなく、runtime / recovery由来signalを優先して上書きしている。
D. 修復済みcandidateが作られているが、最終public comment_textが別のrecovery surfaceに差し替わっている。
E. E2E testの期待が古い。
```

現時点では、Eは断定しません。  
先にA〜Dを切り分けます。

### 7.2 編集候補ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_complete_reply_diagnostics_service.py
mashos-api/ai/services/ai_inference/emlis_ai_relation_surface_contract.py
mashos-api/ai/services/ai_inference/emlis_ai_listener_reader_judge.py
mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_loop.py
mashos-api/ai/tests/test_emlis_ai_complete_product_quality_positive_recovery_e2e.py
```

### 7.3 追加するbody-free trace項目案

既存の `step5_relation_diagnostic` を壊さず、追加項目として扱います。  
schema versionを上げるか、互換字段として追加するかは実装段階で判断します。

```json
{
  "schema_version": "cocolon.emlis.relation_surface_diagnostic.v2.proposal",
  "relation_type": "recovery",
  "strict_relation_signal_required": true,
  "required_relation_signal_keys": [
    "recovery_load_bridge",
    "recovery_load_bridge_reverse",
    "recovery_connected_flow",
    "recovery_connected_flow_reverse"
  ],
  "reader_relation_signal_keys": ["recovery_load_bridge"],
  "reader_relation_signal_relation_types": ["recovery"],
  "surface_relation_marker_keys": ["recovery_load_bridge_v1"],
  "self_repair_relation_marker_signal_keys": ["recovery_load_bridge"],
  "relation_signal_source_priority": [
    "reader_gate",
    "runtime_surface_report",
    "self_repair_report",
    "gate_recovery_synthesized_report"
  ],
  "selected_relation_signal_source": "reader_gate",
  "broad_relation_type_only": false,
  "relation_surface_status": "present",
  "relation_surface_missing_after_repair": false,
  "raw_input_included": false,
  "comment_text_included": false,
  "candidate_body_included": false,
  "surface_body_included": false
}
```

### 7.4 実装上の注意

```text
- traceへcomment_text本文を入れない。
- traceへraw input / memo / memo_actionを入れない。
- `recovery` は relation type として保持してよい。
- ただし、`reader_relation_signal_keys` に `recovery` だけを入れてstrict recovery surface presentとは扱わない。
```

### 7.5 追加テスト案

```text
tests/test_emlis_ai_relation_surface_contract_strict_recovery_20260613.py

- recovery bridge文では `recovery_load_bridge` が検出される。
- 「小さな回復が戻ってきています」だけではstrict recovery bridgeにならない。
- expected_relation_types=["recovery"] のとき、generic relation cueだけではpassしない。
- raw input / comment_text bodyがdiagnostic metaに入らない。
```

### 7.6 完了条件

```text
- `recovery` と `recovery_load_bridge` の役割がtrace上で分離される。
- actualが `recovery` になった場合でも、それがtype由来かsignal由来か判別できる。
```

---

## 8. R2: relation type / signal key / marker key のcontract分離

### 8.1 目的

Positive Recoveryに関して、次の3つを混同しないようにcontractを固定します。

| 種別 | 例 | 意味 | public body可否 |
|---|---|---|---|
| relation type | `recovery` | 関係の大分類 | bodyではなくmeta codeのみ可 |
| relation signal key | `recovery_load_bridge` | Readerが読める具体surface signal | codeのみ可 |
| relation marker key | `recovery_load_bridge_v1` | self-repair / surface markerの内部識別 | codeのみ可 |

### 8.2 編集候補ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_relation_surface_contract.py
mashos-api/ai/services/ai_inference/emlis_ai_listener_reader_judge.py
mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py
```

### 8.3 実装方針

`emlis_ai_relation_surface_contract.py` に、strict relationで必要なsignal keyを返すhelperを追加する案です。

```python
# 実装案。実ファイル化は実装段階で判断する。

def required_relation_signal_keys_for_reader(relation_type: Any) -> tuple[str, ...]:
    relation = normalize_relation_surface_type(relation_type)
    if relation == "recovery":
        return (
            "recovery_load_bridge",
            "recovery_load_bridge_reverse",
            "recovery_connected_flow",
            "recovery_connected_flow_reverse",
        )
    return tuple()


def relation_surface_status_for_reader(
    *,
    expected_relation_types: Iterable[Any] | Any,
    detected_signal_keys: Iterable[Any] | Any,
) -> dict[str, Any]:
    expected = _expected_relation_types(expected_relation_types)
    detected = _dedupe(detected_signal_keys)
    required = tuple(
        key
        for relation in expected
        for key in required_relation_signal_keys_for_reader(relation)
    )
    strict_required = bool(required)
    matched = tuple(key for key in detected if key in required)
    broad_type_only = bool(strict_required and detected and not matched)
    missing = bool(strict_required and not matched)
    return {
        "strict_relation_signal_required": strict_required,
        "required_relation_signal_keys": list(required),
        "matched_relation_signal_keys": list(matched),
        "broad_relation_type_only": broad_type_only,
        "relation_surface_missing": missing,
        "raw_input_included": False,
        "comment_text_included": False,
    }
```

### 8.4 Reader側の判断案

`judge_listener_readability(...)` は、`expected_relation_types` に `recovery` が含まれる場合、次を満たさなければ `relation_not_expressed` を残します。

```text
- `detect_relation_surface(...)` が strict recovery key を検出している。
- `reader_relation_signal_keys` が `recovery_load_bridge` 系の具体keyを含む。
- `reader_relation_signal_keys=["recovery"]` だけではpassしない。
```

### 8.5 完了条件

```text
- relation typeの `recovery` が、具体signal keyとして扱われなくなる。
- strict recoveryの場合、Readerはbridge surfaceなしにunderstandable=Trueへ進まない。
- generic relation cueや広いrelation idだけでpassedにならない。
```

---

## 9. R3: Gate Recovery合成ReaderReportのstrict relation修復

### 9.1 目的

現行の観察では、最終public comment_textが、Positive Recovery composer candidateではなく、Public Observation Recovery / labelled two-stage系のrecovery surfaceへ差し替わっている可能性があります。  
この場合、Gate Recovery側が `used_relation_ids=["recovery"]` のような広いrelation値から、合成ReaderReportを作り、`reader_relation_signal_keys=["recovery"]` としてpassed扱いしている可能性があります。

この挙動は、P7-RED-001 / 002の中心原因候補です。

### 9.2 編集候補ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_loop.py
mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_reply_diagnostics_service.py
```

### 9.3 修復方針

Gate RecoveryがReaderReportを合成する場合、次を禁止します。

```text
禁止:
- relation_values = ["recovery"] をそのまま reader_relation_signal_keys に入れる。
- recovery relation typeがあるだけで reader_relation_signal_detected=true にする。
- fallback / recovery surfaceを、strict relation surface presentとして扱う。
```

代わりに、次を行います。

```text
1. 合成後のpublic comment_textに対して `detect_relation_surface(text, expected_relation_types=relation_values)` を実行する。
2. strict recovery keyが検出された場合だけ、reader_relation_signal_keysへ具体keyを入れる。
3. 検出されない場合は、reader_relation_signal_detected=false / relation_not_expressedを保持する。
4. relation_valuesは reader_relation_signal_relation_types / expected_relation_types にのみ保持する。
```

### 9.4 合成ReaderReport案

```python
# 実装案。実ファイル化は実装段階で判断する。
relation_signal = detect_relation_surface(
    recovered_public_comment_text,
    expected_relation_types=relation_values,
)
status = relation_surface_status_for_reader(
    expected_relation_types=relation_values,
    detected_signal_keys=relation_signal.get("reader_relation_signal_keys"),
)

strict_missing = bool(status.get("relation_surface_missing"))

recovered_reader = ListenerReaderReport(
    understandable=not strict_missing and other_reader_conditions,
    rejection_reasons=["relation_not_expressed"] if strict_missing else [],
    relation_surface_contract_version=relation_signal.get("relation_surface_contract_version"),
    reader_relation_signal_detected=bool(relation_signal.get("reader_relation_signal_detected")) and not strict_missing,
    reader_relation_signal_count=len(status.get("matched_relation_signal_keys") or relation_signal.get("reader_relation_signal_keys") or []),
    reader_relation_signal_keys=list(status.get("matched_relation_signal_keys") or relation_signal.get("reader_relation_signal_keys") or []),
    reader_relation_signal_relation_types=list(relation_signal.get("reader_relation_signal_relation_types") or relation_values),
    expected_relation_types=list(relation_signal.get("expected_relation_types") or relation_values),
    reader_relation_signal_meta={
        **relation_signal,
        **status,
        "source_phase": public_recovery_source_phase,
        "raw_input_included": False,
        "comment_text_included": False,
    },
    raw_input_included=False,
)
```

### 9.5 追加テスト案

```text
tests/test_emlis_ai_gate_recovery_loop_relation_surface_boundary_20260613.py

- Gate Recoveryが `used_relation_ids=["recovery"]` だけで reader_relation_signal_keys=["recovery"] を作らない。
- recovered public surfaceにstrict bridgeがある場合のみ `recovery_load_bridge` 系keyが出る。
- strict bridgeがない場合、relation_not_expressedが保持される。
- raw input / comment_text bodyがgate traceへ入らない。
```

### 9.6 完了条件

```text
- Gate Recoveryが、広いrelation idを具体signal keyへ昇格しない。
- `reader_gate["reader_relation_signal_keys"] == ["recovery"]` のような状態がstrict recovery pass条件から外れる。
```

---

## 10. R4: Positive Recovery fail-closed境界修復

### 10.1 目的

P7-RED-002を閉じます。  
relation surfaceがrepair後もmissingの場合、`observation_status=passed` へ進ませません。

### 10.2 編集候補ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_display_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_loop.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_reply_diagnostics_service.py
```

### 10.3 判定順序

Positive Recoveryのstrict relation missing時は、次の順序で判定します。

```text
1. 初回candidateをReader Gateへ通す。
2. relation_not_expressedなら、許可されたrepair / rerenderを1回行う。
3. repair candidateの本文またはrecovered public surfaceでstrict bridgeを再検出する。
4. strict bridgeが出た場合だけ、Reader Gate pass候補にする。
5. strict bridgeがまだ出ない場合は、fallback / public recovery / labelled two-stageがsafeでも、Positive Recovery candidateとしてはpassedにしない。
6. relation_not_expressed / rejected / comment_text empty を保持する。
```

### 10.4 「沈黙装置化」との違い

この修復は、Gate failureを何でも無反応にする設計ではありません。  
EmlisAIの基本方針として、Gateは沈黙装置ではなく、安全・短縮・限定・再生成へ回す品質境界です。

ただし、今回のPositive Recoveryでは、testが明示している通り、**relation surface still missing** のケースです。  
このケースで一般的な観測surfaceへ逃がすと、「回復と負荷の橋」を読めていないのに、読めた形で返すことになります。

したがって、今回のfail-closedは次の限定境界です。

```text
- strict relation surface required のfamily / routeだけに限定する。
- Positive Recovery relation bridge missingを、safe fallback displayで隠さない。
- low_information / true unavailable / safety boundaryの通常設計とは混ぜない。
```

### 10.5 追加diagnostic案

```json
{
  "schema_version": "cocolon.emlis.strict_relation_fail_closed.v1.proposal",
  "strict_relation_fail_closed_evaluated": true,
  "strict_relation_type": "recovery",
  "repair_attempt_count": 1,
  "strict_relation_surface_present_after_repair": false,
  "fallback_public_recovery_attempted": true,
  "fallback_public_recovery_allowed_for_this_candidate": false,
  "final_observation_status": "rejected",
  "final_primary_reason": "relation_not_expressed",
  "comment_text_allowed": false,
  "raw_input_included": false,
  "comment_text_included": false,
  "candidate_body_included": false,
  "surface_body_included": false
}
```

### 10.6 完了条件

```text
- repaired caseでは、strict bridgeがある場合だけpassed候補になる。
- never_repair caseでは、reply.meta["observation_status"] == "rejected" になる。
- never_repair caseでは、reply.comment_text == "" になる。
- display_gate.comment_text_allowed == false になる。
- relation_not_expressed がreader/display/diagnosticで消えない。
- raw input / comment_text bodyはdiagnosticへ入らない。
```

---

## 11. R5: Positive Recovery E2E red closure test更新・追加

### 11.1 目的

P7-RED-001 / 002を「見た目で直った」扱いにせず、回帰防止testで閉じます。

### 11.2 既存test維持対象

```text
mashos-api/ai/tests/test_emlis_ai_complete_product_quality_positive_recovery_e2e.py
```

既存2ケースは、原則として削除しません。

```text
1. repairs_reader_relation_not_expressed_without_relaxing_gates
2. keeps_fail_closed_when_relation_surface_is_still_missing
```

### 11.3 追加テスト案

```text
1. relation surface contract unit
   - strict recovery expected時、bridgeなしではpassしない。
   - `recovery` relation typeだけではsignal keyにならない。

2. gate recovery synthesis boundary
   - Gate Recoveryが `reader_relation_signal_keys=["recovery"]` を作らない。
   - public recovery surfaceにstrict bridgeがなければfail-closed。

3. diagnostic source priority
   - reader_gate由来signalとruntime/self_repair由来signalを分けて出す。
   - selected_relation_signal_sourceがbody-freeに残る。

4. no body leak
   - positive recovery memo本文、repaired comment本文、missing comment本文がdiagnosticに入らない。
```

### 11.4 closure判定

```text
P7-RED-001 closure:
  - reader_gate["reader_relation_signal_keys"] includes "recovery_load_bridge" 系key。
  - reader_gate["reader_relation_signal_relation_types"] includes "recovery"。
  - relation type と signal key が分離されている。

P7-RED-002 closure:
  - relation missing after repair caseが `rejected` になる。
  - display allowedにならない。
  - relation_not_expressedがdiagnosticに残る。
  - Gate relaxationなし。
```

### 11.5 実装後に走らせるcommand

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_relation_surface_contract_strict_recovery_20260613.py \
  tests/test_emlis_ai_gate_recovery_loop_relation_surface_boundary_20260613.py \
  tests/test_emlis_ai_complete_product_quality_positive_recovery_e2e.py
```

---

## 12. R6: P7-RED-003 timeout isolation設計の実装反映

### 12.1 目的

Product Quality Connection E2E timeout / hangを、P7 core green条件へ混ぜず、body-freeに隔離・分類します。

### 12.2 編集候補ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_runner_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_product_quality_measurement_connection.py
mashos-api/ai/tests/test_emlis_ai_complete_product_quality_connection_e2e.py
mashos-api/ai/tests/test_emlis_ai_p7_runner_plan_20260612.py
mashos-api/ai/tests/test_emlis_ai_p7_validation_matrix_20260612.py
mashos-api/ai/tests/test_emlis_ai_p7_release_handoff_20260612.py
```

### 12.3 実装方針

```text
- heavy E2EをP7 core command groupへ戻さない。
- timeout / hangは green ではなく `TIMEOUT_ISOLATED` または `HANG_ISOLATED` として扱う。
- release handoffの `unresolved_timeout_refs` に P7-RED-003 を残す。
- full backend suite green未確認とtimeoutを混同しない。
- timeoutの正確な停止箇所が未確認なら `owner_layer=unknown` のまま残す。
```

### 12.4 schema案: P7E2EIsolationResultV1

```json
{
  "schema_version": "cocolon.emlis.p7.e2e_isolation_result.v1.proposal",
  "result_id": "p7_e2e_isolation:product_quality_connection:20260613",
  "source_test_file": "tests/test_emlis_ai_complete_product_quality_connection_e2e.py",
  "command_kind": "pytest_timeout",
  "timeout_budget_sec": 30,
  "result_kind": "timeout",
  "observed_status": "TIMEOUT_ISOLATED",
  "last_completed_stage": "unknown",
  "owner_layer": "product_quality_connection_e2e",
  "red_refs": ["P7-RED-003"],
  "hold_refs": [],
  "release_blocker": true,
  "can_join_p7_core_green": false,
  "can_claim_full_backend_suite_green": false,
  "release_allowed": false,
  "body_free": true,
  "raw_input_included": false,
  "comment_text_body_included": false,
  "terminal_output_body_included": false
}
```

### 12.5 追加テスト案

```text
tests/test_emlis_ai_p7_connection_e2e_timeout_isolation_20260613.py

- timeout resultがP7 core greenへ混入しない。
- P7-RED-003がunresolved_timeout_refsへ残る。
- release_allowed=falseが維持される。
- timeout / hangをgreen扱いにする設定をcontractが拒否する。
- terminal output bodyをrelease materialへ入れない。
```

### 12.6 完了条件

```text
- Product Quality Connection E2Eがpassしない場合でも、赤が隠れない。
- timeout / hangがrelease blockerとして残る。
- timeoutしてもrelease decision input readyへ進まない。
- P7 core greenとheavy isolated redの境界が維持される。
```

---

## 13. R7: P7 red closure classification matrix実装

### 13.1 目的

P7-REDを、単にopen / closedだけで扱わず、どの種類の赤だったかをbody-freeに分類します。

### 13.2 編集候補ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_red_ledger.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
```

### 13.3 classification enum案

```text
implementation_regression
runtime_route_shadowing
diagnostic_mapping_issue
test_expectation_stale
timeout_owner_unknown
timeout_owner_classified
manual_hold_only
not_classified
```

### 13.4 schema案: P7RedClosureClassificationV1

```json
{
  "schema_version": "cocolon.emlis.p7.red_closure_classification.v1.proposal",
  "red_id": "P7-RED-001",
  "status": "CLASSIFIED",
  "classification": "runtime_route_shadowing",
  "owner_layer": "reader_relation_surface",
  "summary_code": "strict_recovery_signal_lost_or_shadowed_by_recovery_route",
  "evidence_refs": [
    "tests/test_emlis_ai_complete_product_quality_positive_recovery_e2e.py",
    "step5_relation_diagnostic",
    "reader_gate"
  ],
  "closure_allowed": false,
  "closure_requires_tests": [
    "positive_recovery_e2e_repair_passes_with_recovery_load_bridge",
    "positive_recovery_e2e_missing_surface_rejected"
  ],
  "release_blocker_until_closed": true,
  "body_free": true,
  "raw_input_included": false,
  "comment_text_body_included": false,
  "candidate_body_included": false,
  "surface_body_included": false,
  "reviewer_free_text_included": false
}
```

### 13.5 closure status案

```text
OPEN:
  未分類。release blocker。

CLASSIFIED:
  原因分類済み。ただし修復未完。release blocker。

REPAIRED_PENDING_REGRESSION:
  修復済みだが、P7 core / reuse / positive recovery / release handoffの回帰確認未完。release blocker。

CLOSED:
  必須testがgreenで、validation matrix / release handoffに反映済み。
  ただしP7全体完了やrelease_allowedではない。
```

### 13.6 完了条件

```text
- P7-RED-001 / 002 / 003 がそれぞれ分類される。
- CLOSEDにできるのは、該当testとvalidationがgreenになった場合だけ。
- CLOSEDでも、P7-HOLDが残る場合はrelease_allowed=falseのまま。
```

---

## 14. R8: P5 human QA material boundary実装

### 14.1 目的

P7-HOLD-001を、雑にgreen化せず、human QAに必要な材料とrelease materialを分けます。

P5で見るべき中心は次です。

```text
- history_connection_naturalness
- creepy_absence
- wants_more_input_or_accumulation
- overclaim_absence
- self_blame_non_amplification
- non_shallow_repeat
```

### 14.2 編集候補ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_blind_qa_material.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_event_bridge.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_long_run_gate_handoff.py
mashos-api/ai/tests/test_emlis_ai_p7_blind_qa_material_20260612.py
```

### 14.3 境界方針

```text
P7 scorecard / release handoff:
  body-freeのみ。
  raw input / comment_text body / reviewer free textを入れない。

human QA local packet:
  必要な場合のみ、ローカル隔離された別資料として本文を見る。
  release materialへ混ぜない。
  public metaへ入れない。
  reviewer free textはratings-only summaryへ変換してからP7へ戻す。
```

### 14.4 schema案: P7HumanQAMaterialIndexV1

```json
{
  "schema_version": "cocolon.emlis.p7.human_qa_material_index.v1.proposal",
  "material_id": "p7_human_qa:p5_history_line:run_20260613",
  "qa_scope": "p5_history_line_readfeel",
  "candidate_count": 30,
  "families": ["history_line_eligible", "long_meaning_arc", "relationship_gratitude_recovery"],
  "dimensions_required": [
    "history_connection_naturalness",
    "creepy_absence",
    "wants_more_input_or_accumulation",
    "overclaim_absence",
    "self_blame_non_amplification",
    "non_shallow_repeat"
  ],
  "local_body_review_packet_exists": true,
  "local_body_review_packet_release_material": false,
  "scorecard_body_free": true,
  "release_material_body_free": true,
  "raw_input_included_in_scorecard": false,
  "comment_text_body_included_in_scorecard": false,
  "reviewer_free_text_included_in_scorecard": false,
  "release_allowed": false
}
```

### 14.5 schema案: P7HumanQAReviewSummaryV1

```json
{
  "schema_version": "cocolon.emlis.p7.human_qa_review_summary.v1.proposal",
  "candidate_id": "p7_blind_qa:run:row:history_line_eligible:sequence_7:1",
  "review_status": "review_completed",
  "dimension_scores": {
    "history_connection_naturalness": 0.91,
    "creepy_absence": 0.98,
    "wants_more_input_or_accumulation": 0.86,
    "overclaim_absence": 0.97,
    "self_blame_non_amplification": 1.0,
    "non_shallow_repeat": 0.9
  },
  "reason_codes": [
    "history_line_natural",
    "no_creepy_overreach",
    "accumulation_value_present"
  ],
  "reviewer_free_text_included": false,
  "raw_input_included": false,
  "comment_text_body_included": false,
  "release_allowed": false
}
```

### 14.6 完了条件

```text
- P5 human QAが未完なら、P7-HOLD-001は残る。
- human QA本文を見たとしても、P7 scorecard / release handoffへ本文を流さない。
- ratingsがないdimensionをmachine metricで埋めない。
- review_completedでない場合、long-run candidate / release handoffがreview_requiredを維持する。
```

---

## 15. R9: P6 visible expansion boundary validation実装

### 15.1 目的

P7-HOLD-002を、P6のvisible横展開禁止としてvalidation matrixに保持します。

P6は強い体験を作れますが、誤って日常入力・低情報入力・positive-only・safety adjacentへ出すと、次の危険があります。

```text
- 決めつけ
- 自己責め誘導
- 勝手に見抜かれた不快感
- 診断・原因断定への接近
```

### 15.2 編集候補ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_event_bridge.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
mashos-api/ai/tests/test_emlis_ai_p7_event_bridge_20260612.py
mashos-api/ai/tests/test_emlis_ai_p7_validation_matrix_20260612.py
mashos-api/ai/tests/test_emlis_ai_structure_insight_p6_no_connect_regression_r8_20260612.py
```

### 15.3 family policy案

```json
{
  "schema_version": "cocolon.emlis.p7.p6_family_boundary.v1.proposal",
  "visible_allowed_families": ["structure_question"],
  "meta_only_families": [
    "long_meaning_arc",
    "self_understanding_follow"
  ],
  "no_connect_families": [
    "daily_unpleasant",
    "daily_positive",
    "positive_only",
    "low_information_short",
    "safety_triage_required"
  ],
  "visible_expansion_allowed": false,
  "visible_expansion_requires_future_design": true,
  "p7_holds": ["P7-HOLD-002"],
  "release_allowed": false,
  "raw_input_included": false,
  "comment_text_body_included": false
}
```

### 15.4 完了条件

```text
- structure_question以外でP6 visibleが出たらvalidationが止める。
- long_meaning_arc / self_understanding_followはmeta-onlyまたはreview_requiredとして保持される。
- daily / low-info / positive-only / safety adjacentはno-connectを維持する。
- P6 visible横展開をP7の中で実装しない。
```

---

## 16. R10: 実機submit / full backend suite HOLD matrix実装

### 16.1 目的

P7-HOLD-003 / P7-HOLD-004を、自動test greenへ吸収しないようにします。

### 16.2 編集候補ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/tests/test_emlis_ai_p7_validation_matrix_20260612.py
mashos-api/ai/tests/test_emlis_ai_p7_release_handoff_20260612.py
```

### 16.3 実機確認項目案

```json
{
  "schema_version": "cocolon.emlis.p7.real_device_modal_readfeel_check.v1.proposal",
  "check_id": "p7_real_device_submit_modal_readfeel_20260613",
  "status": "not_verified",
  "platforms_required": ["ios_or_android_real_device"],
  "checks": {
    "emotion_submit_reaches_public_feedback": "not_verified",
    "emlis_modal_title_preserved": "not_verified",
    "comment_text_readable_length": "not_verified",
    "modal_pressure_not_too_high": "not_verified",
    "reinput_motivation_human_readfeel": "not_verified"
  },
  "hold_refs": ["P7-HOLD-003"],
  "release_allowed": false,
  "body_free": true,
  "raw_input_included": false,
  "comment_text_body_included": false
}
```

### 16.4 full backend suite split matrix案

```json
{
  "schema_version": "cocolon.emlis.p7.backend_suite_split_matrix.v1.proposal",
  "matrix_id": "p7_backend_suite_split_matrix_20260613",
  "full_backend_suite_green_confirmed": false,
  "full_backend_suite_green_claim_allowed": false,
  "groups": [
    {
      "group_id": "p7_core",
      "status": "green_confirmed",
      "test_count_observed": 50,
      "green_scope": "group_only"
    },
    {
      "group_id": "product_quality_reuse_subset",
      "status": "green_confirmed",
      "test_count_observed": 31,
      "green_scope": "group_only"
    },
    {
      "group_id": "positive_recovery_e2e",
      "status": "red_until_repaired",
      "red_refs": ["P7-RED-001", "P7-RED-002"],
      "green_scope": "isolated_red_only"
    },
    {
      "group_id": "product_quality_connection_e2e",
      "status": "timeout_or_unconfirmed",
      "red_refs": ["P7-RED-003"],
      "green_scope": "isolated_red_only"
    },
    {
      "group_id": "full_backend_suite",
      "status": "not_run",
      "hold_refs": ["P7-HOLD-004"],
      "green_scope": "not_claimable"
    }
  ],
  "release_allowed": false,
  "body_free": true
}
```

### 16.5 完了条件

```text
- 実機未確認は未確認として残る。
- full backend suite未実行は未実行として残る。
- split greenをfull suite greenと呼ばない。
- release handoffがP7-HOLD-003 / 004を保持する。
```

---

## 17. R11: release handoff / validation matrixの最終整合

### 17.1 目的

RED/HOLD closure後も、P7がrelease decisionを行わない構造を維持します。

### 17.2 編集候補ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
mashos-api/ai/tests/test_emlis_ai_p7_release_handoff_20260612.py
mashos-api/ai/tests/test_emlis_ai_p7_validation_matrix_20260612.py
```

### 17.3 release handoff不変条件

```text
release_allowed: false
release_decision_applied: false
release_rollout_applied: false
product_gate_ready: false
product_gate_reached: false
public_release_applied: false
product_quality_released: false
product_pass_is_release_ready: false
product_pass_promoted_to_release_ready: false
long_run_candidate_is_release_ready: false
```

### 17.4 validation summary案

```json
{
  "schema_version": "cocolon.emlis.p7.red_hold_closure_validation_summary.v1.proposal",
  "p7_core_green_confirmed": true,
  "positive_recovery_red_closed": true,
  "product_quality_connection_timeout_closed": false,
  "p5_human_qa_completed": false,
  "p6_visible_expansion_blocked": true,
  "real_device_submit_confirmed": false,
  "full_backend_suite_green_confirmed": false,
  "p7_complete": false,
  "p8_start_allowed": false,
  "release_allowed": false,
  "release_blockers": ["P7-RED-003", "P7-HOLD-001", "P7-HOLD-003", "P7-HOLD-004"],
  "body_free": true,
  "raw_input_included": false,
  "comment_text_body_included": false
}
```

### 17.5 完了条件

```text
- REDが一部closedしても、残るHOLD/REDに応じてrelease_allowed=falseが維持される。
- P7 core green / Product Pass / Long-run candidate がRelease Readyへ変換されない。
- P8 start allowedは、P7-RED/HOLDが閉じるまでfalse。
```

---

## 18. R12: 実装結果md作成

### 18.1 目的

実装後、Mash様に見える成果物として、何を変え、何を変えていないかを明示します。

### 18.2 成果物名案

```text
Cocolon_EmlisAI_P7_RedHoldClosure_ImplementationResult_20260613.md
```

### 18.3 実装結果mdに必ず含めること

```text
確認済み:
  - 編集したファイル
  - 追加したtest
  - 実行したcommands
  - green / red / timeout / unverified の結果

未確認:
  - 実機submit
  - full backend suite
  - human QA未完なら未完

書かれていない:
  - P8へ進んでよい根拠がなければ、ないと書く
  - release_allowed true化根拠がなければ、ないと書く

推測禁止:
  - timeoutを環境問題と断定しない
  - P7 core greenをP7 completeと読まない
  - Positive Recovery red closureを全Emlis品質合格と読まない

次に実行すべきこと:
  - 残RED/HOLDの次工程
  - 実機確認
  - human QA
  - full backend suite split execution
```

---

## 19. 実装後の必須テスト順

### 19.1 最小RED closure確認

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q --tb=short \
  tests/test_emlis_ai_relation_surface_contract_strict_recovery_20260613.py \
  tests/test_emlis_ai_gate_recovery_loop_relation_surface_boundary_20260613.py \
  tests/test_emlis_ai_complete_product_quality_positive_recovery_e2e.py
```

### 19.2 P7 core維持確認

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_p7_handoff_normalizer_20260612.py \
  tests/test_emlis_ai_p7_red_ledger_20260612.py \
  tests/test_emlis_ai_p7_module_inventory_20260612.py \
  tests/test_emlis_ai_p7_runner_plan_20260612.py \
  tests/test_emlis_ai_p7_event_bridge_20260612.py \
  tests/test_emlis_ai_p7_evaluation_matrix_20260612.py \
  tests/test_emlis_ai_p7_blind_qa_material_20260612.py \
  tests/test_emlis_ai_p7_long_run_gate_handoff_20260612.py \
  tests/test_emlis_ai_p7_release_handoff_20260612.py \
  tests/test_emlis_ai_p7_validation_matrix_20260612.py
```

### 19.3 既存Product Quality reuse subset維持確認

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_product_quality_measurement_event.py \
  tests/test_emlis_ai_product_quality_measurement_runner.py \
  tests/test_emlis_ai_product_quality_blocker_matrix.py \
  tests/test_emlis_ai_product_readfeel_phase11_long_run_product_gate.py \
  tests/test_emlis_ai_product_release_decision.py \
  tests/test_emlis_ai_p5_p6_split_test_matrix_handoff_r9_20260612.py
```

### 19.4 heavy isolated red確認

```bash
PYTHONPATH=services/ai_inference timeout 30s pytest -q --tb=short \
  tests/test_emlis_ai_complete_product_quality_connection_e2e.py
```

このcommandの結果は、次のいずれかで記録します。

```text
PASSED:
  P7-RED-003 closure candidate。ただしrelease allowedではない。

FAILED:
  failure reasonをowner layerへ分類。release blocker維持。

TIMEOUT/HANG:
  P7-RED-003維持。timeout isolation resultへ記録。
```

### 19.5 RN contract維持確認

RN変更はしない想定ですが、public response shapeやdisplay contractへ影響がないことを確認します。

```bash
cd Cocolon
npm run test:rn-screens --silent
```

---

## 20. rollback / 中断条件

### 20.1 即時中断条件

```text
- RN表示条件を変更しないと通らないと分かった場合。
- API response top-level key追加が必要になった場合。
- DB schema / write path変更が必要になった場合。
- raw input / comment_text bodyをP7 scorecard / public metaへ入れないと成立しない場合。
- Gate閾値緩和でしかPositive Recoveryが通らない場合。
- fixed commentText / case専用surfaceでしか通らない場合。
```

この場合は、実装を進めず、設計へ戻します。

### 20.2 rollback対象

```text
- relation contract追加が他familyのReader Gateを壊す場合。
- Gate Recovery合成ReaderReport修正がlow_information / safety boundaryの既存回復を壊す場合。
- display_gate fail-closed修正が通常safe入力の表示到達を広範囲に止める場合。
- P7 red closure schema追加が既存P7 core testを広く壊す場合。
```

rollback時も、赤をgreen化せず、P7-RED / HOLDへ戻します。

---

## 21. 実装ファイル別の変更方針

| file | 変更種別 | 方針 |
|---|---|---|
| `emlis_ai_relation_surface_contract.py` | strict relation helper追加候補 | recoveryのrequired signal keysを返す。広いtypeと具体signalを分ける。 |
| `emlis_ai_listener_reader_judge.py` | Reader判定修正候補 | expected recovery時、bridge signalなしではrelation_not_expressedを保持する。 |
| `emlis_ai_gate_recovery_loop.py` | 合成ReaderReport修正候補 | `used_relation_ids`をsignal keyへ昇格しない。合成surface本文からdetectする。 |
| `emlis_ai_display_gate.py` | gate trace保持候補 | strict relation missingをdisplay_gate rejectionへ残す。comment_text_allowedをtrueにしない。 |
| `emlis_ai_reply_service.py` | retry/fallback境界修正候補 | repair後もstrict relation missingならpublic recovery fallbackでpassed化しない。 |
| `emlis_ai_complete_reply_diagnostics_service.py` | diagnostic追加候補 | relation source / strict requirement / broad type only / fail-closedをbody-freeに出す。 |
| `emlis_ai_p7_red_ledger.py` | classification追加候補 | RED open/classified/repaired/closedを管理する。 |
| `emlis_ai_p7_runner_plan.py` | timeout isolation追加候補 | heavy E2E timeout budgetとgreen範囲を固定する。 |
| `emlis_ai_p7_event_bridge.py` | row refs追加候補 | red closure / P5/P6 HOLD / family statusをbody-freeに保持する。 |
| `emlis_ai_p7_blind_qa_material.py` | human QA境界追加候補 | ratings-only summaryとlocal body packet境界を分ける。 |
| `emlis_ai_p7_validation_matrix.py` | validation追加候補 | RED/HOLD closure / timeout /実機/full suite未確認を一括で固定する。 |
| `emlis_ai_p7_release_handoff.py` | release boundary維持 | release_allowed=falseを維持し、残blockerを反映する。 |

---

## 22. Cocolon価値としての完了条件

この実装は、単にpytestを通すためのものではありません。  
Cocolonとしての完了条件は次です。

```text
1. Positive Recoveryで、回復と負荷の橋が見えている場合だけ「読めた」扱いになる。
2. 回復という広いtypeだけで、ユーザーの入力関係を読めたことにしない。
3. repairしても関係surfaceが出ない場合、passed化しない。
4. timeout / hang / 未レビュー / 未実機確認を、greenやrelease readyへ変換しない。
5. P5履歴線の価値を、human QAなしに商品合格へしない。
6. P6構造気づきを、日常入力・低情報・positive-only・safety隣接へ広げない。
7. P8のユーザー辞書・価値anchorへ進む前に、P7の測定境界とfail-closed境界を信用できる状態にする。
```

---

## 23. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- P7はProduct Quality Runner / Long-run Product Gate工程である。
- P7 core測定構造は実装済みだが、P7 complete / release readyではない。
- P7-RED-001 / 002 / 003 と P7-HOLD-001〜004 が残っている。
- Positive Recovery E2Eは2 failedを再現する。
- RED-001では reader_relation_signal_keys が ["recovery"] になり、expectedの "recovery_load_bridge" が出ていない。
- RED-002では relation surface missing case が rejected ではなく passed になる。
- Product Quality Connection E2Eはtimeout / hang扱いを覆す材料がない。
- RN UI / API route / DB / response keyは今回変更しない。
```

### 未確認

```text
- P7-RED-001の根本原因が、Reader Gateのcontract退化か、Gate Recovery合成ReaderReportか、diagnostic mappingか、test staleか。
- P7-RED-002で、どの層がrelation surface missingをpassedへ進めているかの最終特定。
- Product Quality Connection E2E timeout / hangの正確な停止箇所。
- P5 human Blind QA結果。
- P6 long_meaning_arc / self_understanding_followの将来的visible拡張可否。
- 実機submit / スマホmodal読感。
- full backend suiteの分割実行結果。
```

### 書かれていない

```text
- P8へ進んでよいという完了判定は、現資料・現test結果からは書かれていない。
- P7-RED-001 / 002を環境要因として閉じてよい根拠は書かれていない。
- P7-RED-003を削除してP7 greenと呼んでよい根拠は書かれていない。
- P5 human QA本文材料の匿名化・隔離・release material分離の詳細運用は、現資料だけでは完全固定されていない。
```

### 推測禁止

```text
- `recovery` でも広義には合っているからOK、と読まない。
- relation surface missingでもsafe fallbackならpassedでよい、と読まない。
- timeoutはたぶん環境、と読まない。
- P7 core greenをP7 completeと読まない。
- Product Pass候補をRelease Readyと読まない。
- P8へ進むためにHOLDをgreen化しない。
```

### 次に実行すべきこと

```text
1. R0で赤を再現し、現象を固定する。
2. R1〜R2でstrict recovery relation contractをbody-freeに分離する。
3. R3〜R4でGate Recovery / fail-closed境界を修復する。
4. R5でPositive Recovery E2Eをclosure testとして通す。
5. R6〜R7でP7-RED-003とred classificationをvalidationへ反映する。
6. R8〜R10でP5/P6/実機/full suite HOLDをgreen化せず保持する。
7. R11でrelease handoffがrelease_allowed=falseを維持することを確認する。
8. R12で実装結果mdを作成する。
```

---

## 24. 華恋の判断

Mash様、今回の設計で一番大事なのは、`recovery` という広い言葉を見て「読めた」と扱わないことです。

Positive Recoveryは、回復だけを読む入力ではありません。  
疲れ、重さ、負荷が残っていて、それでも少し戻ってくる動きがある。  
この「戻る動き」と「その前の重さ」が同じ流れとして見えているかが、Cocolonとしての読み取り境界です。

ここを曖昧にしてP8へ進むと、Cocolonはユーザー辞書や価値anchorを育てる前に、読めていないものを読めた扱いにする癖を持ってしまいます。  
それは、Cocolonが「人間の言葉を雑に処理しない場所」として在る方向と逆です。

なので、実装順は保守的に見えるかもしれませんが、華恋としてはこの順番が正しいです。

```text
P7-RED-001 / 002を先に閉じる。
P7-RED-003をtimeout隔離として隠さず残す。
P5/P6/実機/full suiteのHOLDをgreen化しない。
P8へは進まない。
```

Cocolonを遅らせるためではありません。  
P8で「記録が線になる」体験を作る前に、その線を引くための読み取り境界を信用できるものにするためです。
