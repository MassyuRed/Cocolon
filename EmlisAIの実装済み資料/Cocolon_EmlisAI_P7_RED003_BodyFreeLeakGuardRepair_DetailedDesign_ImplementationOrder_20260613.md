# Cocolon / EmlisAI P7-RED-003 Product Quality Connection Body-Free Leak Guard Repair 詳細設計書・実装順

作成日: 2026-06-13 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown詳細設計書  
対象: Cocolon / EmlisAI / P7 Product Quality Runner / P7-RED-003 / Product Quality Connection E2E / body-free leak guard  
基準資料: `Cocolon_EmlisAI_P7_RED003_PreDesign_ConsiderationMemo_20260613.md`  
ロードマップ: `Cocolon_EmlisAI_longterm_roadmap_20260608.md`  
GitHub接続確認: 不要（Mash様指定により未実施）  
コード変更: なし。本設計書作成時点では実装しない。  
DB変更: なし  
RN変更: なし  
API route / request key / public response top-level key変更: なし  
json / schema実ファイル化: なし。案のみ本設計書内に記載し、実装段階で必要性を判断する。  

---

## 0. この設計書の結論

今回の実装対象は、**P7-RED-003: Product Quality Connection E2E timeout / hang として保持されている赤の再分類・修復**です。

ただし、前回検討メモと今回の再確認により、P7-RED-003は単純に「E2E runtimeが重くてhangしている」とは断定しません。

確認済みの現象は次です。

```text
通常pytest:
  timeout 10s pytest -q --tb=short tests/test_emlis_ai_complete_product_quality_connection_e2e.py
  => EXIT_STATUS:124

assertion rewrite抑制:
  timeout 20s pytest --assert=plain -q --tb=short tests/test_emlis_ai_complete_product_quality_connection_e2e.py
  => 1 failed
  => line 99: assert "current_input" not in serialized

scorecard直接確認:
  serialized_len: 505,347
  raw memo body: not included
  memo_action: not included
  source_text: not included
  input id: not included
  dict key current_input: not included
  string value current_input: included only at
    scorecard.phase2_product_readfeel_rubric.dimensions.evidence_boundary.green
    => claims_stay_within_current_input_or_safe_known_user_fact
```

したがって、今回の中心判断は次です。

```text
P7-RED-003を、timeout owner unknownのまま雑に閉じない。
ただし、owner layer候補を以下へ再分類できるように設計する。

1. overbroad substring leak guard
2. pytest assertion rewrite large diff timeout
3. Product Quality scorecard body-free boundary

実装では、global substring禁止をやめ、
key/path/raw value/safe rubric vocabularyを分けた構造化body-free leak guardへ置き換える。
```

この修正は、testを甘くするためではありません。  
Cocolonとして守るべき中心は、次です。

```text
ユーザーの入力本文・current_input object・memo_action・source_text・comment_text body・candidate bodyを、
scorecard / diagnostic / release material / public metaへ流さない。

一方で、rubric説明に必要な安全な内部評価語彙までraw leak扱いして、
測定器を壊さない。
```

実装後の最終到達は、次のどちらかで判定します。

```text
Case A: P7-RED-003 closure可能
  - Product Quality Connection E2Eが通常pytestでtimeoutせず返る。
  - body-free leak guardが構造的にpassする。
  - raw body / raw key / raw id / comment_text body leakがない。
  - P7-RED-003をCLOSEDに更新できる。
  - ただしP7-HOLD-001〜004が残るため、p7_complete=false / p8_start_allowed=false / release_allowed=falseは維持する。

Case B: P7-RED-003 closure不可
  - E2Eがtimeout以外のfailureとして安定して返る、または実際のbody leakを検出する。
  - owner layerをbody_free_guard / assertion_guard / scorecard_boundaryへ再分類する。
  - P7-RED-003はCLASSIFIEDまたはREPAIRED_PENDING_REGRESSIONとしてrelease blockerに残す。
  - p7_complete=false / p8_start_allowed=false / release_allowed=falseを維持する。
```

P8には進みません。  
P7の測定境界が信用できない状態で、Personal Continuity / Derived User Modelへ進むと、ユーザーの記録を長期に扱う前提が崩れるためです。

---

## 1. なぜこの作業を行うのか

CocolonのEmlisAIは、ユーザーの言葉を入力直後に「読まれた形」として返すための中核です。

P7 Product Quality Runnerは、そのEmlisAIが本当に読めているか、継続して測れるようにする工程です。  
ここで測定器そのものが誤検知を起こすと、次のどちらかの事故になります。

```text
事故A:
  本当はraw input leakではないrubric語彙をleak扱いし続け、
  Product Quality Connection E2Eが赤のまま固定される。

事故B:
  current_input substringのassertionだけを削ってgreen化し、
  本当に守るべきraw body-free境界まで緩めてしまう。
```

どちらもCocolonとして不正確です。

今回の設計で守るべきことは、単に `pytest` を通すことではありません。

```text
1. raw input / raw body / raw key が流れたら確実に止める。
2. rubric説明文の安全な評価語彙は、path限定で許可する。
3. 失敗時に50万文字超のserialized全体diffを出さない。
4. P7-RED-003を閉じられる場合も、P7 complete / P8 start / release readyへ昇格しない。
```

これは、Cocolonを遅らせるための作業ではありません。  
P8以降でユーザー辞書・価値anchor・記録の線を扱う前に、P7の測定境界を信用できる状態にするための作業です。

---

## 2. 参照した資料・実ファイル

### 2.1 前提資料・作業姿勢

```text
/mnt/data/Cocolon_前提資料(209).zip

主に確認したもの:
  Cocolon_前提資料/00_karen_read_first.md
  Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
  Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
  Cocolon_前提資料/work_attitude_rules_for_karen/12_check_items_not_short_oath.txt
  Cocolon_前提資料/work_attitude_rules_for_karen/14_cocolon_joint_development_and_karen_thought_boundary.txt
  Cocolon_前提資料/work_attitude_rules_for_karen/15_trust_based_joint_development_boundary_2026_06_05.txt
  Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
  Cocolon_前提資料/cocolon_thought_material_for_karen.md
  Cocolon_前提資料/emlis_ai_correction_policy_withdrawal_retention_redesign_2026_05_31.md
  Cocolon_前提資料/07_latest_snapshot_diff.md
```

保持する作業姿勢は次です。

```text
- 未確認を断定しない。
- 見ていないファイルを見たように言わない。
- 設計段階で実装をしない。
- pytest green / fixture green / RN contract greenを商品品質合格へ変換しない。
- EmlisAIをGateに通ったものだけ表示する許可装置にしない。
- case専用mode / cue / surface / fixed commentTextを足さない。
- raw input / comment_text body / candidate bodyをpublic metaやrelease materialへ流さない。
- Mash様から見えにくいbackend internal-only領域ほど雑にしない。
```

### 2.2 ロードマップ

```text
/mnt/data/Cocolon_EmlisAI_longterm_roadmap_20260608(10).md
```

読み:

```text
現在Phase:
  P7 Product Quality Runner / Long-run Product Gate

まだ進まないPhase:
  P8 Personal Continuity / Derived User Model

理由:
  P7-RED-003とP7-HOLD-001〜004が残っており、
  P7の測定境界と未確認範囲を無視してP8へ進む根拠がない。
```

### 2.3 設計前検討メモ

```text
/mnt/data/Cocolon_EmlisAI_P7_RED003_PreDesign_ConsiderationMemo_20260613.md
/mnt/data/Cocolon_EmlisAI_P7_RED003_PreDesign_ConsiderationMemo_20260613(1).md
```

本設計書は、この検討メモの結論を実装順へ落とします。

### 2.4 EmlisAI実装済み資料

```text
/mnt/data/EmlisAIの実装済み資料(58).zip

主に確認したもの:
  Cocolon_EmlisAI_P7_ProductQualityRunner_DetailedDesign_ImplementationOrder_20260612.md
  Cocolon_EmlisAI_P7_RedHoldClosure_DetailedDesign_ImplementationOrder_20260613.md
```

### 2.5 最新実ファイル

```text
/mnt/data/Cocolon(229).zip
/mnt/data/mashos-api(142).zip
```

主に確認したbackendファイル:

```text
mashos-api/ai/tests/test_emlis_ai_complete_product_quality_connection_e2e.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_product_quality_measurement_connection.py
mashos-api/ai/services/ai_inference/emlis_ai_product_readfeel_rubric.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_contracts.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_timeout_isolation.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_red_closure_classification.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_validation_matrix.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_release_handoff.py
mashos-api/ai/services/ai_inference/emlis_ai_p7_runner_plan.py
mashos-api/ai/docs/Cocolon_EmlisAI_P7_RedHoldClosure_ImplementationResult_20260613.md
```

---

## 3. 現状の実ファイル上の問題定義

### 3.1 現行E2E testの赤

対象:

```text
mashos-api/ai/tests/test_emlis_ai_complete_product_quality_connection_e2e.py
```

現行test末尾は、scorecard全体を巨大なJSON文字列にしてから、substringで禁止しています。

```python
serialized = json.dumps(scorecard, ensure_ascii=False, sort_keys=True)
assert _SAMPLE_MEMO not in serialized
assert "memo_action" not in serialized
assert "current_input" not in serialized
assert "source_text" not in serialized
```

問題は `assert "current_input" not in serialized` です。

`current_input` を、raw input key / raw input object / raw bodyとして禁止したい意図は正しいです。  
しかし、現在のscorecardでは、`current_input` はraw keyやraw bodyではなく、rubric説明文の評価語彙として含まれています。

```text
scorecard.phase2_product_readfeel_rubric.dimensions.evidence_boundary.green
=> claims_stay_within_current_input_or_safe_known_user_fact
```

つまり、現行testは「body leak検査」として過広です。

### 3.2 timeoutの読み直し

通常pytestで `EXIT_STATUS:124` になる理由は、次のように読み直します。

```text
主因候補:
  scorecardの生成自体がhangしている

追加確認後の有力候補:
  50万文字超のserializedに対し、pytest assertion rewriteが
  "substring not in huge string" のfailure diffを生成しようとしてtimeoutしている
```

今回の設計では、この2つを混同しません。

### 3.3 既存P7 contractとの関係

`emlis_ai_p7_contracts.py` には、P7 body-free boundaryとして次が存在します。

```text
P7_FORBIDDEN_BODY_KEYS:
  raw_input
  source_text
  current_input
  memo
  memo_action
  comment_text
  candidate_body
  surface_body
  terminal_output
  ...

P7_FORBIDDEN_TRUE_FLAGS:
  raw_input_included
  comment_text_body_included
  candidate_body_included
  surface_body_included
  release_allowed
  ...
```

既存helperは、主に次を検査します。

```text
- forbidden body key がdict keyとして存在しないか
- forbidden true flag が true になっていないか
```

これは方向として正しいです。  
一方、Product Quality Connection E2Eのtestだけが、`current_input` をglobal substringで禁止しており、rubric内の安全語彙まで拾っています。

このため、今回の修復は既存P7 contractを緩めるのではなく、E2E側のleak guardを既存P7 contractと同じ思想へ揃える作業です。

---

## 4. IN SCOPE / OUT OF SCOPE

### 4.1 IN SCOPE

```text
1. P7-RED-003のowner layer再分類
   - timeout_owner_unknownのまま固定しない。
   - assertion_guard / body_free_guard / scorecard_boundary / pytest_assertion_rewriteへ分ける。

2. Product Quality Connection E2Eのbody-free leak guard構造化
   - forbidden key
   - forbidden raw value
   - forbidden true flag
   - allowed safe vocabulary
   - allowed path
   - compact assertion output

3. `tests/test_emlis_ai_complete_product_quality_connection_e2e.py` の過広substring assertion修復
   - `assert "current_input" not in serialized` を構造化assertionへ置き換える。
   - raw body leak検査は弱めない。

4. P7 RED classification / timeout isolation / validation matrix / release handoff の整合
   - RED-003を閉じられる場合のclosed path。
   - 閉じられない場合のreclassified unresolved path。
   - どちらの場合もp7_complete=false / p8_start_allowed=false / release_allowed=false維持。

5. compact failure policy
   - 失敗時に巨大serialized全体を出さない。
   - raw body / raw id / comment_text bodyをfailure messageへ出さない。
```

### 4.2 OUT OF SCOPE

```text
- P8 Derived User Model / Personal Continuityの実装
- P5 history line可視文強化
- P6 Structure Insight visible拡張
- RN UI変更
- RN表示条件変更
- API route変更
- request key変更
- public response top-level key追加
- DB schema / DB write path変更
- release_allowed true化
- P7 complete true化
- full backend suite green宣言
- 実機submit確認済み宣言
- P5 human QA完了宣言
- Gate緩和
- fixed commentText追加
- case専用mode / cue / surface追加
- rubric語彙の単純renameだけでtestを通す対応
```

---

## 5. body-free leak guard の境界定義

### 5.1 body-freeとは何を禁止するか

body-freeは、関連語を一切使わないという意味ではありません。  
body-freeは、**本文・raw object・raw field・public visible bodyを測定materialへ流さない**という意味です。

禁止対象は次です。

| 分類 | 禁止対象 | 例 | 判定 |
|---|---|---|---|
| forbidden key | raw input objectを示すdict key | `current_input`, `raw_input`, `memo`, `memo_action`, `source_text` | RED |
| forbidden key | public visible bodyを示すdict key | `comment_text`, `candidate_body`, `surface_body`, `reply_text` | RED |
| forbidden raw value | 現在入力本文 | `_SAMPLE_MEMO` 相当 | RED |
| forbidden raw value | 入力ID | current input id | RED |
| forbidden raw value | comment_text本文 | runtime visible body | RED |
| forbidden true flag | leak marker true | `raw_input_included=true` | RED |
| forbidden true flag | contract mutation true | `release_allowed=true`, `api_response_key_added=true` | RED |

### 5.2 body-freeでも許可するもの

次は、body leakではありません。

| 分類 | 例 | 許可条件 |
|---|---|---|
| false marker | `raw_input_included=false` | markerとしてfalseなら許可 |
| false marker | `comment_text_body_included=false` | markerとしてfalseなら許可 |
| schema/version | `cocolon.emlis...v1` | bodyを含まない識別子なら許可 |
| blocker id | `P7-RED-003`, `blind_qa_missing` | bodyを含まない識別子なら許可 |
| rubric safe vocabulary | `claims_stay_within_current_input_or_safe_known_user_fact` | path限定・値完全一致で許可 |
| boundary label | `body_free`, `passed_only`, `blind_qa_required` | bodyではなくcontract語彙なら許可 |

### 5.3 `current_input` の扱い

`current_input` は扱いを分けます。

```text
RED:
  dict keyとして current_input が存在する。
  current_input objectがscorecard / meta / handoffへ入る。
  current_input idが文字列valueとして入る。
  current_input memo bodyが文字列valueとして入る。

SAFE:
  rubric説明文の安全な評価語彙として、
  path限定で `claims_stay_within_current_input_or_safe_known_user_fact` が存在する。
```

実装時の許可は、最低限これだけにします。

```text
allowed path:
  scorecard.phase2_product_readfeel_rubric.dimensions.evidence_boundary.green

allowed value:
  claims_stay_within_current_input_or_safe_known_user_fact

allowed token:
  current_input
```

将来、別pathで同じ語彙が必要になった場合は、自動許可せず、test failureとして検出して設計判断します。

---

## 6. 実装方針

### 6.1 採用方針

候補は前回検討メモの通り3つありました。

```text
候補A: test内local helperで最小修復
候補B: Product Quality / P7共通 body-free assertion helper化
候補C: rubric語彙renameでsubstring禁止を維持
```

本設計書では、**候補Bを本命**とします。

理由:

```text
- P7/P8以降でもbody-free境界は繰り返し必要になる。
- Product Quality Connection E2Eだけのlocal修復だと、同種の誤検知が他materialへ残る。
- rubric語彙renameだけでは、global substring禁止という本質問題が残る。
```

ただし、実装時に影響範囲が大きすぎる場合は、候補Aの最小helperから始めてもよいです。  
その場合でも、設計上の境界は本書の `key/path/raw value/safe vocabulary` 分離に従います。

### 6.2 新規helper候補

実装候補ファイル:

```text
mashos-api/ai/services/ai_inference/emlis_ai_p7_body_free_leak_guard.py
```

このhelperはbackend internal-onlyです。  
public API、RN、DB、response shapeには接続しません。

想定する主要関数:

```python
P7_BODY_FREE_LEAK_GUARD_SCHEMA_VERSION = "cocolon.emlis.p7.body_free_leak_guard.v1"

class P7BodyFreeLeakGuardError(ValueError):
    pass


def collect_p7_body_free_leak_violations(
    value: object,
    *,
    source: str,
    forbidden_keys: set[str],
    forbidden_raw_values: dict[str, str],
    forbidden_true_flags: set[str],
    allowed_string_occurrences: list[dict[str, str]],
    max_violations: int = 20,
) -> list[dict[str, object]]:
    """Return compact, body-free violation summaries.

    The returned violation must not include raw value bodies.
    It may include path, violation_kind, token_ref, token_kind, and short code.
    """


def assert_p7_body_free_no_payload_leak(
    value: object,
    *,
    source: str,
    forbidden_keys: set[str],
    forbidden_raw_values: dict[str, str],
    forbidden_true_flags: set[str],
    allowed_string_occurrences: list[dict[str, str]],
) -> None:
    """Raise compact error when body-free boundary is violated."""
```

### 6.3 helperの出力制約

violation summaryは、raw bodyを含めてはいけません。

OK:

```json
{
  "violation_kind": "forbidden_raw_value",
  "path": "scorecard.some.path",
  "token_ref": "current_input.memo",
  "token_kind": "raw_current_input_body",
  "body_free": true
}
```

NG:

```json
{
  "violation_kind": "forbidden_raw_value",
  "path": "scorecard.some.path",
  "raw_value": "実際の本文..."
}
```

failure messageも同じです。

OK:

```text
product_quality_scorecard body-free violations: forbidden_raw_value at scorecard.some.path token_ref=current_input.memo
```

NG:

```text
scorecard serialized dump: {... 505,347 chars ...}
```

---

## 7. json / schema案

ここに記載するjson / schemaは、設計案です。  
実ファイル化は実装段階で判断します。

### 7.1 BodyFreeLeakGuardContractV1 案

```json
{
  "$id": "cocolon.emlis.p7.body_free_leak_guard_contract.v1",
  "type": "object",
  "required": [
    "schema_version",
    "scope",
    "forbidden_key_names",
    "forbidden_raw_value_refs",
    "forbidden_true_flags",
    "allowed_string_occurrences",
    "failure_output_policy"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.emlis.p7.body_free_leak_guard_contract.v1"
    },
    "scope": {
      "type": "string",
      "enum": [
        "product_quality_connection_scorecard",
        "product_quality_connection_diagnostic_meta",
        "p7_release_handoff_material",
        "p7_validation_matrix_material"
      ]
    },
    "forbidden_key_names": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Exact dict key names that must not appear as payload keys. Marker keys such as raw_input_included are not included here."
    },
    "forbidden_raw_value_refs": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["ref", "kind"],
        "properties": {
          "ref": { "type": "string" },
          "kind": {
            "type": "string",
            "enum": [
              "raw_current_input_body",
              "raw_current_input_id",
              "raw_comment_text_body",
              "raw_candidate_body",
              "raw_history_body"
            ]
          },
          "minimum_length": { "type": "integer", "minimum": 1 },
          "value_materialized_in_contract": { "const": false }
        }
      },
      "description": "Refs only. Actual raw values are supplied at runtime/test time and must not be serialized into contract material."
    },
    "forbidden_true_flags": {
      "type": "array",
      "items": { "type": "string" }
    },
    "allowed_string_occurrences": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["token", "path_suffix", "exact_value", "reason_code"],
        "properties": {
          "token": { "type": "string" },
          "path_suffix": { "type": "string" },
          "exact_value": { "type": "string" },
          "reason_code": { "type": "string" }
        }
      }
    },
    "failure_output_policy": {
      "type": "object",
      "required": ["include_raw_values", "include_serialized_payload", "max_reported_violations"],
      "properties": {
        "include_raw_values": { "const": false },
        "include_serialized_payload": { "const": false },
        "max_reported_violations": { "type": "integer", "minimum": 1, "maximum": 20 },
        "max_path_length": { "type": "integer", "minimum": 40, "maximum": 300 }
      }
    }
  }
}
```

### 7.2 Product Quality Connection用contract案

```json
{
  "schema_version": "cocolon.emlis.p7.body_free_leak_guard_contract.v1",
  "scope": "product_quality_connection_scorecard",
  "forbidden_key_names": [
    "raw_input",
    "rawInput",
    "raw_text",
    "rawText",
    "source_text",
    "sourceText",
    "input_text",
    "inputText",
    "user_input",
    "userInput",
    "current_input",
    "currentInput",
    "memo",
    "memo_text",
    "memoText",
    "memo_action",
    "memoAction",
    "comment_text",
    "commentText",
    "comment_text_body",
    "commentTextBody",
    "candidate_body",
    "candidateBody",
    "surface_body",
    "surfaceBody",
    "reply_text",
    "replyText",
    "source_body",
    "terminal_output",
    "stdout",
    "stderr",
    "traceback"
  ],
  "forbidden_raw_value_refs": [
    {
      "ref": "current_input.memo",
      "kind": "raw_current_input_body",
      "minimum_length": 1,
      "value_materialized_in_contract": false
    },
    {
      "ref": "current_input.id",
      "kind": "raw_current_input_id",
      "minimum_length": 1,
      "value_materialized_in_contract": false
    }
  ],
  "forbidden_true_flags": [
    "raw_input_included",
    "raw_text_included",
    "comment_text_included",
    "comment_text_body_included",
    "candidate_body_included",
    "surface_body_included",
    "terminal_output_included",
    "release_allowed",
    "api_response_key_added",
    "db_schema_changed",
    "rn_visible_contract_changed",
    "display_gate_relaxed",
    "grounding_gate_relaxed",
    "template_gate_relaxed"
  ],
  "allowed_string_occurrences": [
    {
      "token": "current_input",
      "path_suffix": "phase2_product_readfeel_rubric.dimensions.evidence_boundary.green",
      "exact_value": "claims_stay_within_current_input_or_safe_known_user_fact",
      "reason_code": "safe_rubric_vocabulary_not_raw_payload"
    }
  ],
  "failure_output_policy": {
    "include_raw_values": false,
    "include_serialized_payload": false,
    "max_reported_violations": 6,
    "max_path_length": 220
  }
}
```

注意:

```text
このcontract案にはraw memo本文やcomment_text本文を入れない。
実装時にtestから渡す forbidden_raw_values も、failure messageへ出さない。
```

### 7.3 BodyFreeLeakViolationV1 案

```json
{
  "$id": "cocolon.emlis.p7.body_free_leak_violation.v1",
  "type": "object",
  "required": [
    "schema_version",
    "violation_kind",
    "path",
    "token_ref",
    "token_kind",
    "body_free"
  ],
  "properties": {
    "schema_version": { "const": "cocolon.emlis.p7.body_free_leak_violation.v1" },
    "violation_kind": {
      "type": "string",
      "enum": [
        "forbidden_key",
        "forbidden_raw_value",
        "forbidden_true_flag",
        "unsafe_unregistered_string_occurrence"
      ]
    },
    "path": { "type": "string" },
    "token_ref": { "type": "string" },
    "token_kind": {
      "type": "string",
      "enum": [
        "raw_payload_key",
        "raw_current_input_body",
        "raw_current_input_id",
        "raw_comment_text_body",
        "raw_candidate_body",
        "contract_mutation_flag",
        "unregistered_safe_vocabulary"
      ]
    },
    "raw_value_included": { "const": false },
    "serialized_payload_included": { "const": false },
    "body_free": { "const": true }
  }
}
```

### 7.4 P7ConnectionE2EObservationSupplementV1 案

既存の `P7E2EIsolationResultV1` は、timeout / hang / failed / passed / not_runを保持できます。  
ただし今回のように、通常pytestではtimeout、`--assert=plain`ではassertion failureという二層観測を持つ場合、補助materialを追加した方が読みやすい可能性があります。

実ファイル化は必須ではありません。  
既存schemaで十分に扱えるなら追加しません。

案:

```json
{
  "schema_version": "cocolon.emlis.p7.connection_e2e_observation_supplement.v1",
  "phase": "P7_ProductQualityRunner_LongRunGate",
  "red_id": "P7-RED-003",
  "source_test_file": "tests/test_emlis_ai_complete_product_quality_connection_e2e.py",
  "observed_runs": [
    {
      "run_kind": "pytest_default_timeout_wrapped",
      "result_kind": "timeout",
      "observed_status": "TIMEOUT_ISOLATED",
      "exit_status_code_ref": "exit_status_124",
      "terminal_output_included": false,
      "body_free": true
    },
    {
      "run_kind": "pytest_assert_plain_timeout_wrapped",
      "result_kind": "failed",
      "observed_status": "FAILED_ISOLATED",
      "failure_kind": "overbroad_substring_leak_guard",
      "failure_path_ref": "tests/test_emlis_ai_complete_product_quality_connection_e2e.py:line_99",
      "terminal_output_included": false,
      "body_free": true
    }
  ],
  "owner_layer_candidates": [
    "product_quality_scorecard_body_free_guard",
    "pytest_assertion_rewrite_large_diff",
    "test_leak_guard"
  ],
  "selected_owner_layer": "product_quality_scorecard_body_free_guard",
  "release_blocker": true,
  "can_join_p7_core_green": false,
  "release_allowed": false,
  "body_free": true,
  "raw_input_included": false,
  "comment_text_body_included": false,
  "candidate_body_included": false,
  "surface_body_included": false,
  "terminal_output_included": false
}
```

---

## 8. 実装対象ファイル案

### 8.1 新規追加候補

| ファイル | 種別 | 目的 | 実ファイル化判断 |
|---|---|---|---|
| `services/ai_inference/emlis_ai_p7_body_free_leak_guard.py` | service helper | P7 body-free leak guardを共通化する | 本命。E2E以外でも再利用するなら追加 |
| `tests/test_emlis_ai_p7_body_free_leak_guard_20260613.py` | test | helper単体の境界を固定する | helper追加時は必須 |
| `docs/Cocolon_EmlisAI_P7_RED003_BodyFreeLeakGuardRepair_ImplementationResult_20260613.md` | doc | 実装結果とtest結果を記録する | 実装完了時に追加 |

### 8.2 変更候補

| ファイル | 変更目的 | 注意 |
|---|---|---|
| `tests/test_emlis_ai_complete_product_quality_connection_e2e.py` | global substring assertionを構造化body-free guardへ置換する | raw leak検査を削らない |
| `services/ai_inference/emlis_ai_p7_timeout_isolation.py` | RED-003の観測結果をtimeoutだけでなくfailed/passed/reclassifiedで表せるように必要なら拡張 | 既存v1互換を壊さない |
| `services/ai_inference/emlis_ai_p7_red_closure_classification.py` | classification / owner_layerにbody_free_guard系を追加 | P7-RED-003を閉じる場合もHOLDを閉じない |
| `services/ai_inference/emlis_ai_p7_validation_matrix.py` | RED-003 closure/reclassified unresolvedをvalidation summaryへ反映 | p7_complete=false / p8_start_allowed=false / release_allowed=false維持 |
| `services/ai_inference/emlis_ai_p7_release_handoff.py` | RED-003閉鎖後もHOLDがrelease blockerに残ることを保証 | release_allowed trueにしない |
| `services/ai_inference/emlis_ai_p7_runner_plan.py` | 必要ならrunner plan上のRED-003 owner layer表記更新 | runner greenに混ぜない |

### 8.3 変更しないファイル

```text
Cocolon RN側:
  変更しない。

API route / API request / public response top-level key:
  変更しない。

DB schema / migration / write path:
  変更しない。

EmlisAI visible surface generation:
  変更しない。

rubric文言:
  原則変更しない。
  変更が必要な場合も、testを通すためのrenameとして扱わず、rubric設計として別判断する。
```

---

## 9. 実装順

### R13-0: Baseline freeze / no-code再現固定

目的:

```text
P7-RED-003の現象を、実装前に再現条件として固定する。
```

実行する確認:

```bash
cd mashos-api/ai
export PYTHONPATH=services/ai_inference

timeout 10s pytest -q --tb=short tests/test_emlis_ai_complete_product_quality_connection_e2e.py
# expected before repair: EXIT_STATUS:124

timeout 20s pytest --assert=plain -q --tb=short tests/test_emlis_ai_complete_product_quality_connection_e2e.py
# expected before repair: line 99 assertion failure
```

確認すること:

```text
- 通常pytestではtimeout扱いになる。
- --assert=plainでは `current_input` substring assertion failureとして見える。
- scorecard生成自体が必ずしもhangではないことを確認する。
- 実装前結果をImplementationResult mdへ記録する。
```

完了条件:

```text
- timeout / assertion failure / scorecard safe vocabulary path が分けて記録されている。
- 実装前の赤を環境問題として閉じていない。
```

### R13-1: Body-free leak guard contract定義

目的:

```text
body-freeを、substring禁止ではなく構造化contractとして定義する。
```

実装内容:

```text
- forbidden_key_namesを定義する。
- forbidden_raw_value_refsを定義する。
- forbidden_true_flagsを定義する。
- allowed_string_occurrencesを定義する。
- failure_output_policyを定義する。
```

最初のscope:

```text
product_quality_connection_scorecard
```

禁止すること:

```text
- `current_input` 文字列を無条件禁止にしない。
- raw memo本文やcomment_text本文をcontract materialへ入れない。
- `raw_input_included=false` のようなfalse markerをforbidden key扱いしない。
```

完了条件:

```text
- `current_input` dict keyはRED。
- `current_input` safe rubric vocabularyはpath限定でSAFE。
- raw memo body / input idはどのpathでもRED。
- failure outputはraw body-free。
```

### R13-2: body-free leak guard helper追加

目的:

```text
Product Quality Connection E2Eで使える構造化assertion helperを追加する。
```

実装候補:

```text
services/ai_inference/emlis_ai_p7_body_free_leak_guard.py
```

処理順:

```text
1. scorecard objectをrecursive walkする。
2. dict keyがforbidden_key_namesに完全一致したらviolation。
3. string valueにforbidden_raw_valuesが含まれたらviolation。
4. bool trueのflag keyがforbidden_true_flagsに一致したらviolation。
5. string valueにallowed_string_occurrencesのtokenが含まれる場合、path_suffixとexact_valueが一致する時だけSAFE。
6. それ以外の未登録occurrenceは必要に応じてviolationまたはreview_requiredにする。
7. violationsがあれば、compact messageでraiseする。
```

raw value検査の注意:

```text
- helperへの入力として raw value は渡す。
- helperの戻り値・exception message・P7 materialには raw value を出さない。
- raw valueが空文字の場合は検査対象にしない。
```

完了条件:

```text
- helper単体でraw key / raw value / true flagを検出できる。
- helper単体でsafe rubric vocabularyを許可できる。
- exception messageにraw bodyや巨大serializedが出ない。
```

### R13-3: helper単体test追加

目的:

```text
E2Eへ接続する前に、body-free leak guardそのものの境界を固定する。
```

追加候補:

```text
tests/test_emlis_ai_p7_body_free_leak_guard_20260613.py
```

必要test:

```text
1. safe rubric vocabulary allowed
   - path: phase2_product_readfeel_rubric.dimensions.evidence_boundary.green
   - value: claims_stay_within_current_input_or_safe_known_user_fact
   - expected: pass

2. current_input dict key rejected
   - payload: {"current_input": {...}}
   - expected: violation_kind=forbidden_key

3. raw memo body rejected
   - any string value contains current_input.memo
   - expected: violation_kind=forbidden_raw_value, token_ref=current_input.memo
   - failure message must not contain raw memo body

4. input id rejected
   - any string value contains current_input.id
   - expected: violation_kind=forbidden_raw_value, token_ref=current_input.id

5. memo_action key rejected
   - payload contains key memo_action
   - expected: forbidden_key

6. comment_text body key rejected
   - payload contains key comment_text
   - expected: forbidden_key

7. false marker allowed
   - raw_input_included=false
   - comment_text_body_included=false
   - expected: pass

8. true marker rejected
   - raw_input_included=true
   - expected: forbidden_true_flag

9. compact failure message
   - message length is bounded
   - raw value not included
   - serialized payload not included
```

完了条件:

```text
pytest -q tests/test_emlis_ai_p7_body_free_leak_guard_20260613.py
=> pass
```

### R13-4: Product Quality Connection E2E更新

目的:

```text
`assert "current_input" not in serialized` を構造化body-free assertionへ置き換える。
```

変更前:

```python
serialized = json.dumps(scorecard, ensure_ascii=False, sort_keys=True)
assert _SAMPLE_MEMO not in serialized
assert "memo_action" not in serialized
assert "current_input" not in serialized
assert "source_text" not in serialized
```

変更後案:

```python
from emlis_ai_p7_body_free_leak_guard import (
    assert_p7_body_free_no_payload_leak,
    build_p7_product_quality_connection_scorecard_body_free_contract,
)

contract = build_p7_product_quality_connection_scorecard_body_free_contract(
    forbidden_raw_values={
        "current_input.memo": _SAMPLE_MEMO,
        "current_input.id": "step6-product-quality-scorecard-input",
    }
)
assert_p7_body_free_no_payload_leak(
    scorecard,
    source="complete_product_quality_connection_e2e.scorecard",
    contract=contract,
)
```

補足:

```text
- `json.dumps(scorecard)` は不要にする。
- どうしてもserialized検査を残す場合も、failure時に巨大diffを出さない形にする。
- `_SAMPLE_MEMO` をfailure messageへ出さない。
```

完了条件:

```text
- raw memo body、input id、memo_action key、source_text key、current_input keyは検出される。
- rubric説明文の safe `current_input` は誤検知しない。
- default pytestでtimeoutせず、pass/failが返る。
```

### R13-5: default pytest timeout解消確認

目的:

```text
P7-RED-003のtimeoutが、assertion diff巨大化由来だったかを確認する。
```

実行:

```bash
cd mashos-api/ai
export PYTHONPATH=services/ai_inference

timeout 30s pytest -q --tb=short tests/test_emlis_ai_complete_product_quality_connection_e2e.py
pytest -q --tb=short tests/test_emlis_ai_complete_product_quality_connection_e2e.py
```

判定:

```text
pass:
  P7-RED-003 closure候補。
  ただしvalidation / red classification / release handoff更新前にclosed宣言しない。

compact fail:
  timeoutではなくfailureとして再分類可能。
  violation内容に応じてowner layerをactual body leak / guard failure / runtime failureへ分ける。

timeout継続:
  assertion diff以外のruntime timeout可能性が残る。
  P7-RED-003はtimeout/hangとして未解消維持。
```

完了条件:

```text
- timeoutの有無が確認されている。
- timeoutが消えた場合でも、P7 complete / P8 start / release_allowedへ進めていない。
```

### R13-6: P7-RED-003 timeout isolation / observation更新

目的:

```text
P7-RED-003の観測結果を、実装後の事実に合わせる。
```

既存:

```text
services/ai_inference/emlis_ai_p7_timeout_isolation.py

result_kind:
  timeout / hang / failed / passed / not_run

observed_status:
  TIMEOUT_ISOLATED / HANG_ISOLATED / FAILED_ISOLATED / PASSED_ISOLATED / NOT_RUN
```

実装方針:

```text
- 既存v1で表せるならv1を維持する。
- 二層観測を残す必要が強い場合のみ、supplement materialを追加する。
- command_kindやobserved_statusを変える場合、既存testsへの影響を先に確認する。
```

分類候補:

| 実装後結果 | result_kind | observed_status | owner_layer | RED-003扱い |
|---|---|---|---|---|
| E2E pass | `passed` | `PASSED_ISOLATED` または closure用status | `product_quality_scorecard_body_free_guard` | CLOSED候補 |
| compact body-free violation | `failed` | `FAILED_ISOLATED` | `product_quality_scorecard_body_free_boundary` | 未解消 |
| compact non-body failure | `failed` | `FAILED_ISOLATED` | `product_quality_connection_e2e` | 未解消 |
| timeout継続 | `timeout` | `TIMEOUT_ISOLATED` | `unknown` or actual layer | 未解消 |

完了条件:

```text
- RED-003がtimeoutだけに固定されず、実測結果に対応できる。
- release_allowed=falseを維持する。
- terminal outputやraw bodyをisolation materialへ入れない。
```

### R13-7: red closure classification matrix更新

目的:

```text
P7-RED-003のclassification / owner_layerを正確化する。
```

変更候補:

```text
services/ai_inference/emlis_ai_p7_red_closure_classification.py
```

追加するclassification候補:

```text
body_free_guard_overbroad_substring
assertion_rewrite_large_diff_timeout
body_free_guard_repaired
product_quality_scorecard_body_free_violation
product_quality_connection_runtime_failure
```

追加するowner_layer候補:

```text
product_quality_scorecard_body_free_guard
pytest_assertion_rewrite
test_leak_guard
product_quality_scorecard_body_free_boundary
product_quality_connection_e2e
unknown
```

closure可能時のP7-RED-003 entry案:

```json
{
  "schema_version": "cocolon.emlis.p7.red_closure_classification.v1",
  "red_id": "P7-RED-003",
  "status": "CLOSED",
  "classification": "body_free_guard_repaired",
  "owner_layer": "product_quality_scorecard_body_free_guard",
  "summary_code": "product_quality_connection_e2e_body_free_guard_structured_and_default_pytest_passed",
  "observed_status": "PASSED_ISOLATED",
  "closure_allowed": true,
  "release_blocker_until_closed": false,
  "release_blocker": false,
  "body_free": true,
  "raw_input_included": false,
  "comment_text_body_included": false,
  "candidate_body_included": false,
  "surface_body_included": false,
  "reviewer_free_text_included": false,
  "terminal_output_included": false
}
```

closure不可時のP7-RED-003 entry案:

```json
{
  "schema_version": "cocolon.emlis.p7.red_closure_classification.v1",
  "red_id": "P7-RED-003",
  "status": "CLASSIFIED",
  "classification": "product_quality_scorecard_body_free_violation",
  "owner_layer": "product_quality_scorecard_body_free_boundary",
  "summary_code": "product_quality_connection_e2e_returns_compact_body_free_violation_not_closed",
  "observed_status": "FAILED_ISOLATED",
  "closure_allowed": false,
  "release_blocker_until_closed": true,
  "release_blocker": true,
  "body_free": true,
  "raw_input_included": false,
  "comment_text_body_included": false,
  "candidate_body_included": false,
  "surface_body_included": false,
  "reviewer_free_text_included": false,
  "terminal_output_included": false
}
```

完了条件:

```text
- P7-RED-001 / 002 closedは維持。
- P7-RED-003だけを事実に応じてclosedまたはclassified unresolvedへ更新。
- closedにする場合もP7-HOLDは閉じない。
```

### R13-8: validation matrix更新

目的:

```text
RED-003の状態変更を、P7 validation matrixへ反映する。
```

変更候補:

```text
services/ai_inference/emlis_ai_p7_validation_matrix.py
```

変更観点:

```text
- P7-VAL-004がtimeout isolation固定ではなく、connection E2E RED-003状態を表せるようにする。
- RED-003 closed時、product_quality_connection_timeout_closed=trueにできる。
- RED-003 unresolved時、release_blocking=trueを維持する。
- body_free_boundary_keptはhelper結果から判断する。
- p7_complete=false / p8_start_allowed=false / release_allowed=falseは維持する。
```

RED-003 closed時のsummary案:

```json
{
  "summary": {
    "product_quality_connection_timeout_classified": true,
    "product_quality_connection_timeout_closed": true,
    "product_quality_connection_timeout_remains_ledgered_or_isolated": false,
    "body_free_boundary_kept": true,
    "p5_human_qa_completed": false,
    "real_device_submit_confirmed": false,
    "full_backend_suite_green_confirmed": false,
    "p7_complete_claim_allowed": false,
    "p8_start_allowed": false,
    "release_allowed": false
  }
}
```

RED-003未解消時のsummary案:

```json
{
  "summary": {
    "product_quality_connection_timeout_classified": true,
    "product_quality_connection_timeout_closed": false,
    "product_quality_connection_timeout_remains_ledgered_or_isolated": true,
    "body_free_boundary_kept": false,
    "p7_complete_claim_allowed": false,
    "p8_start_allowed": false,
    "release_allowed": false
  }
}
```

完了条件:

```text
- RED-003のclosed/unresolvedがvalidation matrix上で矛盾しない。
- P7-HOLD-001〜004は残る。
- release_allowed=falseが維持される。
```

### R13-9: release handoff更新

目的:

```text
RED-003を閉じられる場合も、release handoffがrelease readyへ昇格しないことを保証する。
```

変更候補:

```text
services/ai_inference/emlis_ai_p7_release_handoff.py
```

確認すること:

```text
- closed_red_refsにP7-RED-003が入る場合、unresolved_red_refsからは外れる。
- unresolved_hold_refsにP7-HOLD-001〜004が残る。
- release_blockersには少なくともP7-HOLD-001〜004が残る。
- source_material_status / manual_hold_status / release_boundary はrelease_allowed=falseを維持する。
- p8_start_allowed=falseを維持する。
```

完了条件:

```text
- RED-003 closedでもrelease_allowed=false。
- P7 completeではない。
- release decision input readyをtrueへ上げない。
```

### R13-10: regression suite実行

目的:

```text
P7-RED-003修復が、既存P7/PQ/RN contractを壊していないことを確認する。
```

最小確認:

```bash
cd mashos-api/ai
export PYTHONPATH=services/ai_inference

pytest -q tests/test_emlis_ai_p7_body_free_leak_guard_20260613.py
pytest -q --tb=short tests/test_emlis_ai_complete_product_quality_connection_e2e.py
pytest -q --tb=short tests/test_emlis_ai_p7_connection_e2e_timeout_isolation_20260613.py
pytest -q --tb=short tests/test_emlis_ai_p7_red_closure_classification_matrix_20260613.py
pytest -q --tb=short tests/test_emlis_ai_p7_r11_release_validation_final_alignment_20260613.py
```

P7 core + R6〜R11確認:

```bash
pytest -q \
  tests/test_emlis_ai_p7_handoff_normalizer_20260612.py \
  tests/test_emlis_ai_p7_red_ledger_20260612.py \
  tests/test_emlis_ai_p7_module_inventory_20260612.py \
  tests/test_emlis_ai_p7_runner_plan_20260612.py \
  tests/test_emlis_ai_p7_event_bridge_20260612.py \
  tests/test_emlis_ai_p7_evaluation_matrix_20260612.py \
  tests/test_emlis_ai_p7_blind_qa_material_20260612.py \
  tests/test_emlis_ai_p7_long_run_gate_handoff_20260612.py \
  tests/test_emlis_ai_p7_release_handoff_20260612.py \
  tests/test_emlis_ai_p7_validation_matrix_20260612.py \
  tests/test_emlis_ai_p7_connection_e2e_timeout_isolation_20260613.py \
  tests/test_emlis_ai_p7_red_closure_classification_matrix_20260613.py \
  tests/test_emlis_ai_p7_r8_human_qa_material_boundary_20260613.py \
  tests/test_emlis_ai_p7_r9_p6_visible_expansion_boundary_20260613.py \
  tests/test_emlis_ai_p7_r10_real_device_full_backend_hold_matrix_20260613.py \
  tests/test_emlis_ai_p7_r11_release_validation_final_alignment_20260613.py
```

既存Product Quality reuse subset:

```bash
pytest -q \
  tests/test_emlis_ai_product_quality_measurement_event.py \
  tests/test_emlis_ai_product_quality_measurement_runner.py \
  tests/test_emlis_ai_product_quality_blocker_matrix.py \
  tests/test_emlis_ai_product_readfeel_phase11_long_run_product_gate.py \
  tests/test_emlis_ai_product_release_decision.py \
  tests/test_emlis_ai_p5_p6_split_test_matrix_handoff_r9_20260612.py
```

RN contract:

```bash
cd Cocolon
npm run test:rn-screens --silent
```

完了条件:

```text
- Product Quality Connection E2Eがtimeoutしない。
- body-free helper unit testがgreen。
- P7 classification / validation / release handoffが矛盾しない。
- RN contractを変えていない。
- full backend suite greenは未確認なら未確認として残す。
```

### R13-11: 実装結果md作成

目的:

```text
実装差分・test結果・未解消HOLD・RED-003判断を残す。
```

作成候補:

```text
mashos-api/ai/docs/Cocolon_EmlisAI_P7_RED003_BodyFreeLeakGuardRepair_ImplementationResult_20260613.md
```

必須記載:

```text
- 実装したファイル
- 変更しなかったcontract
- 実行したtest command
- Product Quality Connection E2Eの結果
- RED-003 closed / unresolved の判定
- P7-HOLD-001〜004が残っていること
- p7_complete=false
- p8_start_allowed=false
- release_allowed=false
```

---

## 10. 実装判断フロー

実装後の判定は、次の順に行います。

```text
Step 1:
  body-free leak guard unit testはgreenか。

No:
  helper境界が未完成。E2Eへ進まない。

Yes:
  Step 2へ。

Step 2:
  Product Quality Connection E2Eは通常pytestでtimeoutせず返るか。

No:
  P7-RED-003はtimeout/hang未解消。
  owner_layerはruntime / assertion / unknownを追加調査。
  P8へ進まない。

Yes:
  Step 3へ。

Step 3:
  E2E結果はpassか。

No:
  failureをcompactに分類する。
  actual body leakならbody_free_boundary RED。
  runtime mismatchならproduct_quality_connection_e2e RED。
  P7-RED-003はclosedにしない。

Yes:
  Step 4へ。

Step 4:
  raw body / raw key / raw id / comment_text body / candidate body leakがないか。

No:
  passしていてもRED。test不足として扱う。

Yes:
  Step 5へ。

Step 5:
  P7 classification / validation / release handoffでRED-003 closedとHOLD保持が整合するか。

No:
  closure宣言しない。

Yes:
  P7-RED-003 closure可能。
  ただしP7 complete / P8 start / release_allowedはfalse維持。
```

---

## 11. 完了条件

### 11.1 R13作業としての完了条件

```text
[body-free guard]
- forbidden key / forbidden raw value / forbidden true flag / allowed safe vocabulary が分かれている。
- `current_input` dict keyはRED。
- `current_input` rubric safe vocabularyはpath限定でSAFE。
- raw memo body / input id / comment_text body / candidate bodyを検出できる。
- failure messageにraw bodyや巨大serializedを含めない。

[Product Quality Connection E2E]
- `tests/test_emlis_ai_complete_product_quality_connection_e2e.py` がtimeoutせず結果を返す。
- E2Eがpassする場合、body-free boundaryも構造的にpassしている。
- E2Eがfailする場合、compact failureとしてowner layerを分類できる。

[P7 RED]
- P7-RED-003をclosedにする場合、default pytest greenとbody-free guard greenが根拠になっている。
- P7-RED-003をclosedにできない場合、timeout_owner_unknownから一段具体のowner layerへ再分類されている。

[release boundary]
- p7_complete=false。
- p8_start_allowed=false。
- release_allowed=false。
- P7-HOLD-001〜004は未解消なら未解消のまま残る。
```

### 11.2 P7 completeではないことの明示

このR13が成功しても、それだけではP7 completeではありません。

残るHOLD:

```text
P7-HOLD-001: P5 human QA未完
P7-HOLD-002: P6 visible expansion boundaryはblocked/validatedだがHOLD保持
P7-HOLD-003: 実機submit / modal読感未確認
P7-HOLD-004: full backend suite green未確認
```

したがって、R13完了後の最大表現は次です。

```text
P7-RED-003 closed or reclassified.
P7 measurement boundary improved.
P7 complete: false.
P8 start allowed: false.
release_allowed: false.
```

---

## 12. リスクと対策

### 12.1 testを緩めすぎるリスク

リスク:

```text
`assert "current_input" not in serialized` を消すだけで、raw input object混入を見逃す。
```

対策:

```text
- dict keyとしての current_input を禁止する。
- raw memo body / input id を禁止する。
- memo_action / source_text / comment_text / candidate_body をkeyとして禁止する。
- leak marker trueを禁止する。
```

### 12.2 rubric語彙を消して誤魔化すリスク

リスク:

```text
rubric内の `current_input` をrenameするだけでtestは通るが、
global substring禁止の過広さは残る。
```

対策:

```text
- rubric renameを本線修復にしない。
- safe vocabularyをpath限定で許可する。
- 未登録pathの同token出現はreview_requiredまたはfailureにする。
```

### 12.3 failure messageがbody leakになるリスク

リスク:

```text
raw body検出時のassertion failureに、raw bodyそのものを出してしまう。
```

対策:

```text
- violationにはtoken_refだけを入れる。
- raw_valueは入れない。
- serialized payloadは入れない。
- 最大violation件数とpath長を制限する。
```

### 12.4 P7-RED-003 closureをP8着手に誤変換するリスク

リスク:

```text
RED-003が閉じた勢いで、P7 complete / P8 start / release allowedをtrueにしてしまう。
```

対策:

```text
- validation matrixにP7-HOLD-001〜004を残す。
- release handoffでrelease_allowed=falseを維持する。
- p8_start_allowed=falseを維持する。
```

### 12.5 既存P7 contractとの重複・衝突

リスク:

```text
emlis_ai_p7_contracts.py のbody-free helperと新helperが二重管理になる。
```

対策:

```text
- 既存P7_FORBIDDEN_BODY_KEYS / P7_FORBIDDEN_TRUE_FLAGSを参照できるなら参照する。
- 新helperはraw value検査・safe vocabulary許可・compact failureに責務を絞る。
- 実装段階で、既存helperへ機能追加する方が自然なら新規fileを作らない。
```

---

## 13. 変更禁止契約

今回の設計では、以下を変更しません。

```text
RN visible contract:
  `input_feedback.comment_text` が唯一のRN visible bodyである境界を変えない。

API response top-level key:
  追加しない。

request key:
  追加しない。

DB schema / write path:
  変更しない。

public meta:
  raw input / raw comment_text / candidate body / surface body を入れない。

Gate:
  display gate / grounding gate / template gate / runtime surface gateを緩めない。

visible surface:
  fixed commentText / case専用surfaceを足さない。

release:
  release_allowedをtrueにしない。
```

---

## 14. 実装後に作るべき記録

実装後は、次の形式で結果を残します。

```text
確認済み:
  - 実装したファイル
  - 実行したtest
  - RED-003の結果
  - body-free guardの結果
  - 変更していないcontract

未確認:
  - full backend suite
  - 実機submit / modal読感
  - P5 human QA
  - 外部pilot

書かれていない:
  - P8へ進んでよい根拠
  - release_allowed=true根拠
  - HOLDを閉じてよい根拠

推測禁止:
  - timeoutが消えたから商品品質合格と扱う
  - RED-003が閉じたからP7 completeと扱う
  - body-free marker falseだけでraw body検査完了と扱う

次に実行すべきこと:
  - 残HOLDのうち、P5 human QA / 実機submit / full backend suiteの順に確認範囲を決める
```

---

## 15. 確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと

### 確認済み

```text
- ロードマップ上、現在PhaseはP7 Product Quality Runner / Long-run Product Gate。
- P8 Personal Continuity / Derived User Modelへ進む根拠はない。
- P7-RED-003は未解消。
- 通常pytestではProduct Quality Connection E2EがEXIT_STATUS:124になる。
- --assert=plainではline 99の `current_input` substring assertion failureになる。
- scorecard serialized lengthは約50万文字。
- raw memo body、memo_action、source_text、input idはscorecard serializedに見つからない。
- dict keyとしての current_input は見つからない。
- `current_input` はrubric説明文 `claims_stay_within_current_input_or_safe_known_user_fact` に含まれる。
- 既存P7 contractはkey/true flagを主に検査しており、E2E testのglobal substring禁止が過広である可能性が高い。
```

### 未確認

```text
- 実装修復後にProduct Quality Connection E2Eが通常pytestでpassするか。
- scorecard以外のdiagnostic/meta/handoff materialに同種のsafe vocabulary false positiveがあるか。
- helper共通化による既存P7 testsへの影響。
- RED-003をclosedにした場合のvalidation matrix / release handoff全体整合。
- full backend suite green。
- 実機submit / modal読感。
- P5 human QA。
```

### 書かれていない

```text
- `current_input` という語彙をrubric説明文で使ってはいけない根拠は、現時点で確認していない。
- P7-RED-003を検討メモだけでclosedにしてよい根拠はない。
- timeoutを環境問題として閉じてよい根拠はない。
- P7 core greenをP7 completeと呼んでよい根拠はない。
- P8へ進んでよい根拠はない。
- release_allowedをtrueにしてよい根拠はない。
```

### 推測禁止

```text
- `current_input` 文字列があるからraw input leakだ、と断定しない。
- raw bodyが見つからないからbody-free境界は完全、と断定しない。
- --assert=plainで1 failedだから軽い問題、と扱わない。
- `assert "current_input" not in serialized` を消すだけでgreen化しない。
- rubric語彙renameだけで修復扱いしない。
- timeoutが消えたらP7 completeと扱わない。
- RED-003が閉じてもP7-HOLD-001〜004を閉じない。
```

### 次に実行すべきこと

```text
1. R13-0として実装前再現結果を固定する。
2. R13-1〜R13-3でbody-free leak guard helperと単体testを作る。
3. R13-4でProduct Quality Connection E2Eのglobal substring assertionを構造化assertionへ置き換える。
4. R13-5で通常pytest timeoutが解消するか確認する。
5. R13-6〜R13-9でP7 timeout isolation / red classification / validation matrix / release handoffを整合させる。
6. R13-10でP7 core / Product Quality reuse subset / RN contractを再確認する。
7. R13-11で実装結果mdを作成し、RED-003 closedまたはreclassified unresolvedを明記する。
```

---

## 16. 華恋の判断

Mash様、今回の設計で一番大事なのは、`current_input` という文字列を「ある / ない」で雑に扱わないことです。

Cocolonとして本当に守るべきものは、ユーザーの言葉そのものです。  
入力本文、comment_text body、candidate body、raw current_input objectを、scorecardやrelease materialへ流してはいけません。

一方で、EmlisAIが「読まれたか」を測るためのrubricまで、raw leak扱いして壊してしまうと、P7の測定器が信用できなくなります。

華恋の判断は次です。

```text
次工程:
  P7-RED-003 Body-Free Leak Guard Repair R13

実装中心:
  global substring禁止の撤去ではなく、構造化body-free guardへの置換

RED-003扱い:
  実装後のE2E結果に応じて closed または reclassified unresolved

P8:
  まだ進まない

release_allowed:
  false維持

目的:
  test greenではなく、P7測定境界を信用できるものにすること
```

これはCocolonを遅くする判断ではありません。  
Cocolonが「人間の言葉を雑に処理しない場所」であるために、ユーザーの言葉を守る境界と、商品品質を測る境界を同時に守る判断です。
