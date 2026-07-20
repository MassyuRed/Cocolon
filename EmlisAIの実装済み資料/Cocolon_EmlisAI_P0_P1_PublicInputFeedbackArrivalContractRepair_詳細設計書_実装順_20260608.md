# Cocolon / EmlisAI P0-P1 Public Input Feedback Arrival Contract Repair 詳細設計書・実装順

作成日: 2026-06-08 JST  
作成者: 華恋  
作業モード: 共鳴構造モード  
成果物種別: Markdown設計書  
対象: EmlisAI / `/emotion/submit` / `input_feedback` / `Emlisの観測` / public visibility reliability  
基準資料: `Cocolon_EmlisAI_P0_P1_PublicFeedbackArrival_PreDesignMemo_20260608`  
コード変更: なし  
GitHub接続確認: なし（Mash様指定によりローカル作業）  
JSON / schema: 本資料内に案として記載する。実ファイル化は実装段階で既存配置・既存signature・循環import・既存testとの整合を見て判断する。  

---

## 0. この設計書の結論

今回の実装主線は、**safe + eligible + display_decision passed + comment_text non-empty のEmlis応答が、public `input_feedback` としてRNへ到達しない不整合を直すこと**です。

ただし、これはGate緩和ではありません。  
直す対象は、Gateの判定そのものではなく、**同じGate結果をDisplay Gate側とpublic inclusion側で別意味に読んでいる契約不整合**です。

現状の赤の中心は次です。

```text
Display Gate / step10:
  observation_status = passed
  comment_text_present = true
  display_gate_passed = true
  visible_surface_acceptance_gate = yellow / warn
  → 表示可能として扱っている

public input_feedback inclusion:
  observation_status = passed
  comment_text_present = true
  visible_surface_acceptance_gate.passed = false
  classification = yellow
  action = warn
  → passed=false の一点で input_feedback を落としている
```

今回の設計判断は次で固定します。

```text
yellow / warn は public inclusion の terminal blocker ではない。

yellow / warn は、
  public_reached = true
  rn_visible = true
  product_surface_valid = 別判定
として扱う。

repair_required / red / rerender_surface / reroute_low_information / block / fail_closed は、
  public inclusion blocker
として扱う。
```

これにより、P1の目的である「安全な入力を沈黙で終わらせない」を満たしつつ、P2/P3以降で扱う「表示文が商品品質として十分か」は `product_surface_valid` 側へ分離します。

---

## 1. 設計の目的

### 1.1 目的

```text
safe + eligible + passed + comment_text non-empty のEmlis応答が、
public input_feedback として欠落しないようにする。
```

より具体的には、次を実現します。

```text
1. Display Gateがpassedとして扱った本文を、public inclusion側が別解釈で落とさない。
2. visible_surface yellow / warn を public表示不可と同列に扱わない。
3. public_reached / rn_visible / product_surface_valid を分離して観測する。
4. true unavailable / safety / infrastructure error はfail-closedを維持する。
5. public metaへraw input / candidate body / comment_text bodyを出さない。
6. RN表示契約、API route、response top-level key、DB write pathは変えない。
```

### 1.2 Cocolonとしての目的

Cocolonにおいて、この修正は単なるテスト赤修正ではありません。

EmlisAIは、ユーザーが入力した直後に「読まれた形」を返すCocolon最初の商品体験です。  
ここで `comment_text` が内部では生成されているのに `input_feedback` として届かない場合、ユーザー体験としては「保存されたけれど返ってこない」になります。

それは、Cocolonとして最も避けるべき状態です。

```text
内部では読めている。
でも、入力直後のユーザーには届いていない。
```

今回の実装は、この断絶を閉じるためのP0/P1修正です。

---

## 2. 参照・確認済み前提

### 2.1 参照した設計前メモ

```text
Cocolon_EmlisAI_P0_P1_PublicFeedbackArrival_PreDesignMemo_20260608
```

前回メモの判断は次です。

```text
現在Phase:
  P0 Current Baseline Freeze

今回進める段階:
  P0赤ledger作成 + P1表示到達確認の入口整理

まだ進めない段階:
  P3 Product Read Feel v1
  P5 User Label Connection v1 可視文強化
```

本設計書では、この判断を引き継ぎます。

### 2.2 参照したロードマップ上の位置

```text
P0: Current Baseline Freeze
  現在地固定。赤・未確認・検証範囲を明示する段階。

P1: Public Visibility Reliability
  safe入力を沈黙で終わらせない段階。

P2以降:
  表示文品質、読感、履歴線強化を扱う段階。
```

今回の設計対象はP0/P1です。  
P3/P5へ進む前に、表示到達契約を閉じます。

### 2.3 今回前提として固定する姿勢

```text
- EmlisAIを、Gateに通ったものだけを表示する許可装置にしない。
- ただし、読めていないものを読めたふりで返さない。
- Gate緩和で表示率だけを上げない。
- fixture greenを商品品質合格とみなさない。
- RN側でbackend不整合を吸収しない。
- public metaへ本文、raw input、candidate bodyを出さない。
- 確認済み / 未確認 / 書かれていない / 推測禁止を分ける。
```

---

## 3. 現状整理

### 3.1 確認済みgreen

```text
RN contract:
  36 passed

Public Recovery / D / limited grounding 周辺:
  45 passed

User Label Connection / Product Read Feel 周辺:
  108 passed

API contract:
  4 passed

TwoStage emotion submit E2E:
  6 passed
```

### 3.2 現在残っている赤

対象:

```text
tests/test_emlis_ai_display_contract.py
```

結果:

```text
2 passed / 3 failed
```

赤:

```text
Red A:
  test_phase5_passed_candidate_keeps_public_meta_sanitized
  expected: input_feedback_payload is not None
  actual: None

Red B1:
  test_step10_e2e_rejected_candidate_never_exposes_generated_body
  expected: step10.observation_status == rejected
  actual: passed

Red B2:
  test_step10_e2e_unavailable_pre_connection_never_exposes_comment_text
  expected: step10.observation_status == unavailable
  actual: passed
```

### 3.3 Red Aの構造

確認済みの要点:

```text
reply.comment_text:
  exists
  expected textと一致

public_meta.observation_status:
  passed

visible_surface_acceptance_gate:
  evaluated = true
  passed = false
  classification = yellow
  action = warn

two_stage_reception_gate:
  passed = true
  blocked = false

state_answer_gate_boundary:
  passed = true
  blocked = false

should_include_public_input_feedback(reply.comment_text, public_meta):
  false
```

Red Aの原因候補:

```text
Display Gate側:
  yellow / warn を非terminalとして扱っている。

public inclusion側:
  visible_surface_acceptance_gate.passed == false を無条件blockとして扱っている。
```

設計判断:

```text
Red Aは実装修正対象。

理由:
  Display Gateの意味論とpublic inclusionの意味論がズレているため。
  yellow/warnをpublic inclusion terminal blockerにするなら、Display Gate側もpassedにしてはいけない。
  Display Gate passedを維持するなら、public inclusion側でもyellow/warnをterminal blockerにしてはいけない。
```

### 3.4 Red Bの構造

Red B1/B2では、旧testが `rejected` / `unavailable` を期待しています。  
しかし現在は、Public Recovery / limited grounding / low information reception required 以降、以前なら非表示だった入力が安全な限定観測として `passed` へ復旧する可能性があります。

設計判断:

```text
Red B1/B2は、即実装修正ではなく分類対象。

分類結果が以下ならtest期待値更新対象:
  - 旧fixtureが現在思想では displayable limited observation へ変わった。
  - 元のunsupported/generated bodyがpublic本文へ漏れていない。
  - Gate Recovery material surfaceがpublic本文へ出ていない。
  - public candidate sourceが許可範囲内。
  - safety / true infrastructure / true unsupported ではない。

分類結果が以下なら実装修正対象:
  - true unavailable / infrastructure errorまでpassedへ昇格している。
  - unsupported generated bodyがpublic本文へ出ている。
  - body leakがpublic metaへ出ている。
  - candidate source forbiddenなのにpassedへしている。
  - two_stage_requiredをplain surfaceでpassedへしている。
```

---

## 4. 今回の実装スコープ

### 4.1 対象ファイル候補

実装段階で主に確認・変更する候補は次です。

```text
backend:
  mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
  mashos-api/ai/services/ai_inference/emotion_submit_service.py
  mashos-api/ai/services/ai_inference/emlis_ai_product_surface_validation.py

backend tests:
  mashos-api/ai/tests/test_emlis_ai_display_contract.py
  mashos-api/ai/tests/test_emlis_ai_public_feedback_meta.py
  mashos-api/ai/tests/test_emotion_submit_public_feedback_inclusion_summary_p7.py
  mashos-api/ai/tests/test_emlis_ai_product_surface_validation_p3.py
```

実装段階で必要性が確認できた場合のみ、以下のような小さな共有policy helperを検討します。

```text
候補:
  mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_arrival_policy.py

目的:
  visible_surface yellow/warn のpublic inclusion意味論を、
  public_feedback_meta / emotion_submit_service / product_surface_validation で重複させない。

注意:
  emlis_ai_public_feedback_meta.py は emlis_ai_product_surface_validation.py をimportしているため、
  product_surface_validation側から public_feedback_meta をimportすると循環しやすい。
  共有helperを作る場合は、依存がない純粋関数moduleにする。
```

ただし、実ファイル化は実装段階で判断します。  
最小修正で済む場合は、既存3箇所のhelper意味論を同じtestで固定する方針でもよいです。

### 4.2 触らないもの

```text
RN production UI:
  変更しない。

RN表示タイトル:
  `Emlisの観測` を変更しない。

RN表示条件:
  observation_status == passed && comment_text non-empty を変更しない。

/emotion/submit route:
  変更しない。

public response top-level key:
  変更しない。

DB physical schema / write path:
  変更しない。

fixed fallback commentText:
  追加しない。

case専用route / cue / surface:
  追加しない。
```

---

## 5. Source of Truth設計

### 5.1 基本方針

`public input_feedback` inclusion の最終判定は、次の4条件を基本にします。

```text
1. comment_text が non-empty
2. public_meta.observation_status == passed
3. runtime / state_answer / two_stage の terminal blocker がない
4. visible_surface_acceptance_gate が public inclusion blocker ではない
```

ここで重要なのは、4の定義です。

```text
visible_surface_acceptance_gate.passed == false
```

だけでは、public inclusion blocker としません。

`classification` と `action` を見て、terminalかwarningかを判断します。

### 5.2 public inclusion と product quality の分離

今回、次を明確に分離します。

```text
public_reached:
  input_feedback payload が public response に含まれる。

rn_visible:
  RNが input_feedback.comment_text を `Emlisの観測` として開ける。
  条件は observation_status == passed && comment_text non-empty。

product_surface_valid:
  表示される本文が、そのfamilyに必要なsurface requirementを満たす。
```

`yellow / warn` は次の扱いです。

```text
public_reached:
  trueでよい。

rn_visible:
  trueでよい。

product_surface_valid:
  別判定。
  yellow/warnだけで自動falseにしてもよいが、public到達欠落とは扱わない。
```

### 5.3 Gate別のpublic inclusion policy

| Gate | 状態 | public inclusion | 備考 |
|---|---|---:|---|
| observation_status | `passed` | allow候補 | comment_text必須 |
| observation_status | `rejected` / `unavailable` / `safety_blocked` | block | RNへ出さない |
| comment_text | non-empty | allow候補 | 本文はpublic metaへコピーしない |
| comment_text | empty | block | meta-only表示はしない |
| visible_surface_acceptance_gate | `classification=pass`, `action=allow`, `passed=true` | allow | 通常表示 |
| visible_surface_acceptance_gate | `classification=yellow`, `action=warn`, `passed=false` | allow | warning扱い。public到達は止めない |
| visible_surface_acceptance_gate | `classification=yellow`, `action=warn`, `passed=true` | allow | warning扱い |
| visible_surface_acceptance_gate | `classification=repair_required` | block | repair後に再判定 |
| visible_surface_acceptance_gate | `classification=red` | block | fail-closed |
| visible_surface_acceptance_gate | `action=rerender_surface` | block | rerender前本文は出さない |
| visible_surface_acceptance_gate | `action=reroute_low_information` | block | reroute前本文は出さない |
| visible_surface_acceptance_gate | `action=block` | block | terminal |
| visible_surface_acceptance_gate | `action=fail_closed` | block | terminal |
| visible_surface_acceptance_gate | `passed=false` かつ `action` が `warn` 以外 | block | 不明状態は安全側 |
| runtime_surface_pre_return_gate | `passed=false` | block | 既存通り厳格 |
| runtime_surface_pre_return_gate | terminal repair / block action | block | 既存通り厳格 |
| state_answer_gate_boundary | `passed=false` / `blocked=true` / reasonsあり | block | 既存通り厳格 |
| two_stage_reception_gate | `passed=false` / `blocked=true` / reasonsあり | block | 既存通り厳格 |

### 5.4 なぜyellow/warnだけ例外にするのか

`yellow / warn` は、表示品質上の注意・商品品質上の警告であって、必ずしも「ユーザーへ一切出してはいけない本文」ではありません。

Display Gate側では既に、`action == warn` を非blockとして扱っています。  
そのため、public inclusion側だけが `passed=false` で落とすと、同じGate結果に対して異なる意味論が発生します。

今回の修正は、そのズレを閉じるものです。

```text
Gateを緩めるのではない。
Display Gateが既に非blockとして扱ったwarningを、public inclusion側でも同じく非blockとして読む。
```

---

## 6. 詳細実装方針

## 6.1 実装方針A: visible_surface yellow/warn policyの修正

### 対象候補1: `emlis_ai_public_feedback_meta.py`

現状の問題候補:

```python
if passed is False:
    return True
```

この判定が先に立つため、`classification=yellow / action=warn` でも public inclusion が止まります。

修正案:

```python
def _visible_surface_acceptance_gate_blocks_public_feedback(public_meta):
    gate = _safe_mapping(_safe_get(public_meta, "visible_surface_acceptance_gate"))
    if gate is None:
        return False

    passed = _safe_bool(_safe_get(gate, "passed"))
    classification = _safe_visible_surface_acceptance_classification(
        _safe_get(gate, "classification")
    )
    action = _safe_visible_surface_acceptance_action(_safe_get(gate, "action"))

    if classification in _BLOCKING_VISIBLE_SURFACE_ACCEPTANCE_CLASSIFICATIONS:
        return True

    if action in _BLOCKING_VISIBLE_SURFACE_ACCEPTANCE_ACTIONS:
        return True

    if passed is False and action != "warn":
        return True

    return False
```

設計上の意味:

```text
- red / repair_required はblock。
- rerender / reroute / block / fail_closed はblock。
- passed=false でも action=warn ならblockしない。
- passed=false かつ action不明 / allow / 空はfail-closed。
```

### 対象候補2: `emotion_submit_service.py`

現状の問題候補:

```python
if gate.get("passed") is False:
    return True
```

`_build_public_feedback_inclusion_summary()` はこのhelperで `public_feedback_not_included_visible_surface_gate` や `reason_family` を決めるため、ここも同じ意味論に揃える必要があります。

修正案:

```python
def _public_visible_surface_gate_blocks(public_meta):
    gate = public_meta.get("visible_surface_acceptance_gate") if isinstance(public_meta, dict) else None
    if not isinstance(gate, dict):
        return False

    classification = str(gate.get("classification") or "").strip()
    action = str(gate.get("action") or "").strip()

    if classification in {"repair_required", "red"}:
        return True
    if action in {"rerender_surface", "reroute_low_information", "block", "fail_closed"}:
        return True
    if gate.get("passed") is False and action != "warn":
        return True
    return False
```

### 対象候補3: `emlis_ai_product_surface_validation.py`

`_public_gate_blocks()` でも、`visible_surface_acceptance_gate.passed == false` が `rn_visible` をfalseへ落とす可能性があります。

修正方針:

```text
runtime / display / state_answer / two_stage は従来通り厳格。
visible_surface_acceptance_gate だけは yellow/warn policy を適用する。
```

修正案:

```python
def _visible_surface_gate_blocks_for_public_arrival(gate):
    if not gate:
        return False
    classification = _clean_identifier(gate.get("classification"), max_length=80)
    action = _clean_identifier(gate.get("action"), max_length=80)
    passed = _safe_bool(gate.get("passed"))

    if classification in {"repair_required", "red"}:
        return True
    if action in {"rerender_surface", "reroute_low_information", "block", "fail_closed"}:
        return True
    if passed is False and action != "warn":
        return True
    return False
```

`_public_gate_blocks()` 内では、`visible_surface_acceptance_gate` だけこのhelperを使います。

---

## 6.2 実装方針B: Red B fixture分類

Red Bは、Red Aのように即座に「このhelperを直す」とは扱いません。  
まずfixture意味を分類します。

### Red B1: rejected expected actual passed

対象:

```text
test_step10_e2e_rejected_candidate_never_exposes_generated_body
```

旧期待:

```text
unsupported composerが作った本文はrejectedになり、comment_textは空。
```

現在のactual:

```text
step10.observation_status = passed
reply.comment_text = safeなlimited / low-info系の観測文
```

分類観点:

| 観点 | 確認内容 | 判定 |
|---|---|---|
| 元unsupported body | `UNSUPPORTED_TEXT` が public comment_text へ出ていないか | 出ていなければ旧test更新候補 |
| public meta body leak | `UNSUPPORTED_TEXT` / raw input / candidate body が public metaへ出ていないか | 出ていなければ旧test更新候補 |
| candidate source | 許可candidate sourceか | allowedなら旧test更新候補 |
| surface role | public_observationとして成立しているか | 成立なら旧test更新候補 |
| true unsupported | 元候補を無視して、材料なしの固定surfaceでpassedにしていないか | していたら実装修正 |
| Gate Recovery material | Gate Recovery material surfaceをpublic bodyにしていないか | していたら実装修正 |

設計上のtest更新方針:

```text
旧test名の「rejected_candidate_never_exposes_generated_body」は維持してよい。
ただし、期待statusを必ずrejectedに固定するのではなく、次の契約へ更新する。

- 元のunsupported generated bodyはpublic comment_textへ出ない。
- 元のunsupported generated bodyはpublic metaへ出ない。
- recovery後にpassedになる場合でも、public bodyは許可されたsafe observation surfaceである。
- non-passed本文露出を検知する低レベルcontract testは維持する。
```

### Red B2: unavailable expected actual passed

対象:

```text
test_step10_e2e_unavailable_pre_connection_never_exposes_comment_text
```

旧期待:

```text
composer pre-connection / disabledならunavailableでcomment_text空。
```

現在のactual:

```text
step10.observation_status = passed
reply.comment_text = safeなlimited / low-info系の観測文
```

分類観点:

| 観点 | 確認内容 | 判定 |
|---|---|---|
| default path | 現在のdefault pathが本当にpre_connectionなのか | pre_connectionでないならtest名更新 |
| candidate generated | recovery / low-info candidate が生成されたか | 生成ありならpassed妥当候補 |
| true infrastructure | timeout / exception / registry failure をpassedにしていないか | していたら実装修正 |
| body leak | raw input / candidate body がpublic metaへ出ていないか | 出ていなければtest更新候補 |
| fixed fallback | fixed fallback commentTextでpassedにしていないか | していたら実装修正 |

設計上のtest更新方針:

```text
現行default no composerが、Public Recovery後のdisplayable pathとして成立しているなら、
旧testは「pre_connection fixture」ではなくなっている。

その場合は、以下に分割する。

1. current default pathはsafe recovery surfaceとしてpassedになり得ることを確認するtest
2. true infrastructure / true unavailable は必ずunavailableでinput_feedback absentになるtest
```

---

## 7. 実装順

## Step 0: 作業前baselineを固定する

実装前に、現在の赤を再確認します。

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q tests/test_emlis_ai_display_contract.py -vv
```

期待:

```text
2 passed / 3 failed
```

この結果を `red ledger` に記録します。

記録項目:

```text
red_id
test_name
expected
actual
comment_text_present
public_meta_status
should_include_result
first_blocker_family
visible_gate.evaluated
visible_gate.passed
visible_gate.classification
visible_gate.action
state_answer_gate.passed / blocked
two_stage_gate.passed / blocked
classification_before_fix
implementation_action
test_action
```

---

## Step 1: Red Aのfocused red testを追加する

Red Aを、E2Eだけに依存させず、policy単体で固定します。

追加候補:

```text
tests/test_emlis_ai_public_feedback_meta.py
```

### 追加test案A1

```python
def test_should_include_public_input_feedback_allows_visible_surface_yellow_warn():
    meta = {
        "observation_status": "passed",
        "visible_surface_acceptance_gate": {
            "evaluated": True,
            "passed": False,
            "classification": "yellow",
            "action": "warn",
        },
        "state_answer_gate_boundary": {"passed": True, "blocked": False},
        "two_stage_reception_gate": {"passed": True, "blocked": False},
    }

    assert should_include_public_input_feedback("表示してよい本文", meta) is True
```

### 追加test案A2

```python
def test_should_include_public_input_feedback_blocks_visible_surface_repair_required():
    meta = {
        "observation_status": "passed",
        "visible_surface_acceptance_gate": {
            "evaluated": True,
            "passed": False,
            "classification": "repair_required",
            "action": "rerender_surface",
        },
    }

    assert should_include_public_input_feedback("まだ出してはいけない本文", meta) is False
```

### 追加test案A3

```python
def test_should_include_public_input_feedback_blocks_visible_surface_passed_false_without_warn():
    meta = {
        "observation_status": "passed",
        "visible_surface_acceptance_gate": {
            "evaluated": True,
            "passed": False,
            "classification": "yellow",
            "action": "allow",
        },
    }

    assert should_include_public_input_feedback("曖昧なので止める本文", meta) is False
```

狙い:

```text
- yellow/warnだけを非blockにする。
- repair_required/redは維持する。
- passed=falseの全許可にはしない。
```

---

## Step 2: public feedback meta helperを修正する

対象:

```text
emlis_ai_public_feedback_meta.py
```

修正対象:

```text
_visible_surface_acceptance_gate_blocks_public_feedback()
```

実装内容:

```text
- classification / action を先に見る。
- repair_required / red はblock。
- rerender_surface / reroute_low_information / block / fail_closed はblock。
- passed=false かつ action != warn はblock。
- yellow / warn は非block。
```

完了確認:

```bash
PYTHONPATH=services/ai_inference pytest -q tests/test_emlis_ai_public_feedback_meta.py -vv
```

---

## Step 3: submit inclusion summaryを同じpolicyへ揃える

対象:

```text
emotion_submit_service.py
```

修正対象:

```text
_public_visible_surface_gate_blocks()
_build_public_feedback_inclusion_summary()
```

実装内容:

```text
- `_public_visible_surface_gate_blocks()` をStep 2と同じ意味論へ変更する。
- yellow/warnで `public_feedback_not_included_visible_surface_gate` をtrueにしない。
- yellow/warnで `reason_family = visible_surface_gate` にしない。
- public_feedback_includedがtrueなら、reason_familyは `included` または `product_surface_valid` 系へ寄せる。
```

追加test候補:

```text
tests/test_emotion_submit_public_feedback_inclusion_summary_p7.py
```

### 追加test案A4

```python
def test_p7_inclusion_summary_does_not_treat_visible_surface_yellow_warn_as_absence():
    public_meta = {
        "observation_status": "passed",
        "visible_surface_acceptance_gate": {
            "evaluated": True,
            "passed": False,
            "classification": "yellow",
            "action": "warn",
        },
    }

    summary = _build_public_feedback_inclusion_summary(
        input_feedback_comment="表示してよい本文",
        internal_input_feedback_meta={"observation_status": "passed"},
        public_input_feedback_meta=public_meta,
    )

    assert summary["public_feedback_included"] is True
    assert summary["public_reached"] is True
    assert summary["rn_visible"] is True
    assert summary["public_feedback_not_included_visible_surface_gate"] is False
```

---

## Step 4: product_surface_validationのrn_visible判定も揃える

対象:

```text
emlis_ai_product_surface_validation.py
```

修正対象:

```text
_public_gate_blocks()
_gate_validation_summary()
```

理由:

```text
public_feedback_meta と emotion_submit_service を直しても、
product_surface_validation が visible_surface_gate.passed=false を public_gate_blocked と読むと、
rn_visible=false / product_surface_invalid_public_gate_blocked へ落ちる可能性がある。
```

実装内容:

```text
- visible_surface_acceptance_gateだけ yellow/warn policy を適用する。
- runtime / display / state_answer / two_stage は現行通り strict。
- `visible_surface_gate_blocked` は yellow/warn だけではtrueにしない。
```

追加test候補:

```text
tests/test_emlis_ai_product_surface_validation_p3.py
```

### 追加test案A5

```python
def test_product_surface_validation_keeps_rn_visible_for_visible_surface_yellow_warn():
    meta = {
        "observation_status": "passed",
        "visible_surface_acceptance_gate": {
            "evaluated": True,
            "passed": False,
            "classification": "yellow",
            "action": "warn",
        },
    }

    summary = build_product_surface_validation_summary(
        input_feedback_included=True,
        comment_text="表示してよい本文",
        emlis_ai_public_meta=meta,
    )

    assert summary["public_reached"] is True
    assert summary["rn_visible"] is True
    assert summary["gate_validation"]["visible_surface_gate_blocked"] is False
```

注意:

```text
このtestは product_surface_valid == True を必須にしない。
今回の目的はrn_visibleとproduct_surface_validの分離であり、
yellow/warn本文の商品品質合格を保証することではない。
```

---

## Step 5: Red A E2E display contractをgreen化する

対象:

```text
tests/test_emlis_ai_display_contract.py::test_phase5_passed_candidate_keeps_public_meta_sanitized
```

期待:

```text
reply.comment_text == SCOPED_PASSING_TEXT
input_feedback_payload is not None
input_feedback_payload.comment_text == SCOPED_PASSING_TEXT
input_feedback_payload.emlis_ai.observation_status == passed
public meta sanitized
raw inputなし
comment_text bodyなし
candidate bodyなし
```

実装後確認:

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_public_feedback_meta.py \
  tests/test_emotion_submit_public_feedback_inclusion_summary_p7.py \
  tests/test_emlis_ai_product_surface_validation_p3.py \
  tests/test_emlis_ai_display_contract.py::test_phase5_passed_candidate_keeps_public_meta_sanitized \
  -vv
```

---

## Step 6: Red B1/B2をred ledger分類する

Red Bは、Red A修正後に実装修正するかtest更新するかを決めます。  
この時点で、次を出します。

```text
B1 classification:
  stale_contract_expectation / implementation_regression / fixture_ambiguous

B2 classification:
  stale_contract_expectation / implementation_regression / fixture_ambiguous
```

判定に使う確認項目:

```text
- reply.comment_text が元unsupported bodyではない。
- public_meta に元unsupported body / raw input / candidate bodyがない。
- public_surface_lineage.candidate_source_kind が allowed。
- gate_recovery_material_surface_used_as_public_body が false。
- diagnostic_recovery_surface_used_as_public_body が false。
- product_surface_validation.public_reached / rn_visible が意味通り。
- true infrastructure error fixtureではない。
```

### B1がstale contract expectationの場合

testを次の方向へ更新します。

旧:

```text
unsupported candidateは必ず rejected / comment_text empty
```

新:

```text
unsupported generated bodyはpublicに出ない。
ただし、safe recovery surfaceが生成され、既存Gateを通過した場合はpassedになり得る。
```

期待例:

```python
assert UNSUPPORTED_TEXT not in reply.comment_text
assert reply.meta["diagnostic_summary"]["step10_e2e_display_contract"]["contract_passed"] is True
assert reply.meta["diagnostic_summary"]["step10_e2e_display_contract"]["release_blockers"] == []
```

public meta側:

```python
serialized_public_meta = json.dumps(public_meta, ensure_ascii=False, sort_keys=True)
assert UNSUPPORTED_TEXT not in serialized_public_meta
assert "世界のすべてが明日から完全に良くなります" not in serialized_public_meta
```

### B2がstale contract expectationの場合

testを次の方向へ更新します。

旧:

```text
composerなしは必ず unavailable / comment_text empty
```

新:

```text
current default pathがsafe recovery / low-information reception surfaceを生成できる場合、passedになり得る。
ただしtrue infra / true unavailableは別fixtureでfail-closedを保証する。
```

追加すべき別test:

```text
true infrastructure / timeout / exception / response contract infrastructure_error は、
observation_status = unavailable かつ input_feedback absent になる。
```

---

## Step 7: true unavailable / true safetyのfail-closed regressionを追加する

Red B更新時に、非表示境界が緩んでいないことを別testで守ります。

追加候補:

```text
tests/test_emlis_ai_public_feedback_meta.py
```

### 追加test案B3

```python
def test_should_not_include_public_input_feedback_for_unavailable_even_with_comment_text():
    meta = {
        "observation_status": "unavailable",
        "rejection_reasons": ["emlis_ai_reply_timeout"],
    }

    assert should_include_public_input_feedback("出してはいけない本文", meta) is False
```

### 追加test案B4

```python
def test_public_meta_infrastructure_error_remains_unavailable_and_body_free():
    internal_meta = {
        "version": "emlis_ai_v3",
        "kernel_version": "multi_perspective_observation.v1",
        "observation_status": "unavailable",
        "rejection_reasons": ["emlis_ai_reply_error"],
        "internal_response_contract": build_emlis_internal_response_contract(
            "infrastructure_error",
            reason="emlis_ai_reply_error",
            public_observation_status="unavailable",
        ),
    }

    public_meta = build_public_emlis_input_feedback_meta(
        internal_meta,
        comment_text_present=False,
        subscription_tier="free",
    )

    assert public_meta["observation_status"] == "unavailable"
    assert should_include_public_input_feedback("", public_meta) is False
```

実装段階で `build_emlis_internal_response_contract` のimport可否・fixture配置は確認します。

---

## Step 8: no body leakを維持する

今回の修正で `input_feedback` が到達するケースが増えるため、no leak contractを強めます。

維持必須:

```text
public_meta:
  raw_input_included = false
  comment_text_included = false
  comment_text_body_included = false
  candidate_body_included = false
  internal_meta_returned = false
```

禁止key:

```text
comment_text
composer_candidate
current_input
environment_state_output_scope_marker_completion
environment_state_output_surface_contract
internal_completion_result
multi_perspective
raw_input
text
body
candidate_comment_text
public_comment_text
realized_text
```

既存test `test_phase5_passed_candidate_keeps_public_meta_sanitized` のsanitizer assertionは維持します。  
必要ならRed B更新testにも同じassertを追加します。

---

## Step 9: focused suiteを通す

Red A修正、Red B分類/更新後にまず以下を通します。

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_public_feedback_meta.py \
  tests/test_emotion_submit_public_feedback_inclusion_summary_p7.py \
  tests/test_emlis_ai_product_surface_validation_p3.py \
  tests/test_emlis_ai_display_contract.py \
  -vv
```

完了目標:

```text
tests/test_emlis_ai_display_contract.py:
  5 passed / 0 failed
```

---

## Step 10: 既存greenの回帰確認

focused suite後、既存greenの回帰を確認します。

### API contract

```bash
PYTHONPATH=services/ai_inference pytest -q tests/contract/test_emlis_ai_contracts.py
```

期待:

```text
4 passed
```

### TwoStage emotion submit E2E

```bash
PYTHONPATH=services/ai_inference pytest -q tests/test_emotion_submit_two_stage_reception_e2e.py -vv
```

期待:

```text
6 passed
```

### Public Recovery / D / limited grounding subset

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_public_observation_recovery_acceptance_p0.py \
  tests/test_emlis_ai_public_surface_requirement_p1.py \
  tests/test_emlis_ai_product_surface_validation_p3.py \
  tests/test_emlis_ai_public_meta_product_quality_lineage_p8.py \
  tests/test_emotion_submit_public_feedback_inclusion_summary_p7.py \
  tests/test_emotion_submit_phase19_real_device_abcd_public_feedback_e2e.py \
  tests/test_emlis_ai_d_source_unavailable_normal_observation_recovery.py \
  tests/test_emlis_ai_complete_initial_surface_recomposition_p5.py \
  tests/test_emlis_ai_complete_initial_surface_recomposition_existing_gate_chain_p8.py \
  tests/test_emlis_ai_limited_grounding_reception_surface_p4.py
```

期待:

```text
45 passed
```

### User Label Connection / Product Read Feel subset

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_user_label_connection_material.py \
  tests/test_emlis_ai_user_label_connection_candidate.py \
  tests/test_emlis_ai_user_label_connection_gate.py \
  tests/test_emlis_ai_user_label_connection_surface.py \
  tests/test_emlis_ai_user_label_connection_public_boundary.py \
  tests/test_emlis_ai_user_label_connection_e2e_contract.py \
  tests/test_emlis_ai_product_readfeel_rubric.py \
  tests/test_emlis_ai_product_readfeel_scorecard.py \
  tests/test_emlis_ai_product_readfeel_phase11_long_run_product_gate.py \
  tests/test_emlis_ai_user_label_connection_product_quality_qa.py \
  tests/test_emlis_ai_user_label_connection_derived_model_cache.py
```

期待:

```text
108 passed
```

### RN contract

```bash
cd Cocolon
npm run test:rn-screens --silent
```

期待:

```text
36 passed
```

---

## 8. JSON / schema案

この章のJSON / schemaは、実装判断用の案です。  
本設計書段階では実ファイル化しません。

---

## 8.1 Public Feedback Arrival Decision案

用途:

```text
public input_feedback inclusion の判定を、body-freeな診断として保持する。
既存 `public_feedback_inclusion_summary` 内に入れるか、内部diagnosticのみで扱うかは実装段階で判断する。
```

案:

```json
{
  "schema_version": "cocolon.emlis.public_feedback_arrival_decision.v1",
  "source_phase": "P0_P1_PublicInputFeedbackArrivalContractRepair_20260608",
  "comment_text_present": true,
  "public_observation_status": "passed",
  "public_feedback_included": true,
  "public_reached": true,
  "rn_visible": true,
  "product_surface_valid": false,
  "first_blocker_family": "",
  "first_blocker_code": "",
  "visible_surface_acceptance": {
    "evaluated": true,
    "report_passed": false,
    "classification": "yellow",
    "action": "warn",
    "public_inclusion_blocking": false,
    "product_quality_warning": true,
    "reason_family": "visible_surface_warning"
  },
  "runtime_surface_pre_return_gate_blocking": false,
  "state_answer_gate_blocking": false,
  "two_stage_reception_gate_blocking": false,
  "body_free": true,
  "raw_input_included": false,
  "comment_text_body_included": false,
  "candidate_body_included": false
}
```

注意:

```text
- `comment_text` 本文は入れない。
- raw inputは入れない。
- candidate bodyは入れない。
- public response top-level keyは増やさない。
- 既存summaryへ入れる場合も、追加はbody-free boolean / codeのみ。
```

---

## 8.2 Visible Surface Public Inclusion Policy案

用途:

```text
visible_surface_acceptance_gate の public inclusion 意味論を固定する。
実装段階で共有helper module化する場合のpolicy schema案。
```

案:

```json
{
  "schema_version": "cocolon.emlis.visible_surface_public_inclusion_policy.v1",
  "policy_version": "20260608.yellow_warn_non_terminal",
  "rules": [
    {
      "condition": {
        "classification": "red"
      },
      "public_inclusion_blocking": true,
      "reason_code": "visible_surface_red"
    },
    {
      "condition": {
        "classification": "repair_required"
      },
      "public_inclusion_blocking": true,
      "reason_code": "visible_surface_repair_required"
    },
    {
      "condition": {
        "action": "rerender_surface"
      },
      "public_inclusion_blocking": true,
      "reason_code": "visible_surface_rerender_required"
    },
    {
      "condition": {
        "action": "reroute_low_information"
      },
      "public_inclusion_blocking": true,
      "reason_code": "visible_surface_reroute_required"
    },
    {
      "condition": {
        "action": "block"
      },
      "public_inclusion_blocking": true,
      "reason_code": "visible_surface_block"
    },
    {
      "condition": {
        "action": "fail_closed"
      },
      "public_inclusion_blocking": true,
      "reason_code": "visible_surface_fail_closed"
    },
    {
      "condition": {
        "classification": "yellow",
        "action": "warn"
      },
      "public_inclusion_blocking": false,
      "reason_code": "visible_surface_warning"
    },
    {
      "condition": {
        "passed": false,
        "action_not": "warn"
      },
      "public_inclusion_blocking": true,
      "reason_code": "visible_surface_unpassed_without_warn"
    }
  ],
  "body_free": true,
  "raw_input_included": false,
  "comment_text_body_included": false
}
```

---

## 8.3 Red Ledger Entry案

用途:

```text
P0赤ledgerに、Red A / B1 / B2 の分類と修正対象を残す。
```

案:

```json
{
  "schema_version": "cocolon.emlis.red_ledger_entry.v1",
  "red_id": "P0P1-ARRIVAL-RED-A-001",
  "test_name": "tests/test_emlis_ai_display_contract.py::test_phase5_passed_candidate_keeps_public_meta_sanitized",
  "expected": {
    "input_feedback_payload_present": true,
    "observation_status": "passed",
    "comment_text_present": true
  },
  "actual": {
    "input_feedback_payload_present": false,
    "observation_status": "passed",
    "comment_text_present": true,
    "should_include_public_input_feedback": false
  },
  "gate_summary": {
    "visible_surface_acceptance_gate": {
      "evaluated": true,
      "passed": false,
      "classification": "yellow",
      "action": "warn",
      "public_inclusion_blocking_current": true,
      "public_inclusion_blocking_target": false
    },
    "state_answer_gate_boundary": {
      "passed": true,
      "blocked": false
    },
    "two_stage_reception_gate": {
      "passed": true,
      "blocked": false
    }
  },
  "classification": "implementation_contract_misalignment",
  "implementation_action": "align_visible_surface_yellow_warn_policy",
  "test_action": "keep_test_expectation",
  "raw_leak_checked": true,
  "response_shape_changed": false,
  "rn_contract_changed": false,
  "db_write_path_changed": false
}
```

### Red B用のclassification候補

```json
{
  "allowed_classifications": [
    "implementation_contract_misalignment",
    "implementation_regression",
    "stale_contract_expectation",
    "fixture_ambiguous",
    "requires_true_unavailable_fixture",
    "requires_no_body_leak_assertion"
  ]
}
```

---

## 9. 完了条件

### 9.1 Red A完了条件

```text
- yellow/warn visible surface gateで should_include_public_input_feedback がtrueになる。
- repair_required/red/block/fail_closedは引き続きfalseになる。
- display contractのpassed candidate testがgreenになる。
- public meta body-free sanitizerが維持される。
- product_surface_validationでyellow/warnがrn_visible=falseへ落ちない。
```

### 9.2 Red B完了条件

```text
- B1/B2が red ledger 上で分類済み。
- stale_contract_expectationなら、test期待値を現在思想へ更新している。
- implementation_regressionなら、実装修正している。
- true unavailable / infrastructure / safety fail-closed testを別に維持している。
- 元unsupported generated bodyがpublic comment_textへ出ない。
- raw input / candidate body / comment_text bodyがpublic metaへ出ない。
```

### 9.3 P1表示到達完了条件

```text
- safe + eligible + passed + comment_text non-empty の入力で public input_feedback absentにならない。
- public_reached / rn_visible / product_surface_valid が分離されている。
- yellow/warnはpublic到達欠落ではなくwarningとして扱われる。
- true unavailable / safety_blocked / infrastructure_errorはfail-closedできる。
- RN contractは36 passedを維持する。
- API contract / TwoStage E2E / Public Recovery / User Label Connection周辺greenを維持する。
```

---

## 10. 検証コマンド一覧

### 10.1 focused

```bash
cd mashos-api/ai
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_public_feedback_meta.py \
  tests/test_emotion_submit_public_feedback_inclusion_summary_p7.py \
  tests/test_emlis_ai_product_surface_validation_p3.py \
  tests/test_emlis_ai_display_contract.py \
  -vv
```

### 10.2 backend contract

```bash
PYTHONPATH=services/ai_inference pytest -q tests/contract/test_emlis_ai_contracts.py
```

### 10.3 TwoStage E2E

```bash
PYTHONPATH=services/ai_inference pytest -q tests/test_emotion_submit_two_stage_reception_e2e.py -vv
```

### 10.4 Public Recovery / D / limited grounding

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_public_observation_recovery_acceptance_p0.py \
  tests/test_emlis_ai_public_surface_requirement_p1.py \
  tests/test_emlis_ai_product_surface_validation_p3.py \
  tests/test_emlis_ai_public_meta_product_quality_lineage_p8.py \
  tests/test_emotion_submit_public_feedback_inclusion_summary_p7.py \
  tests/test_emotion_submit_phase19_real_device_abcd_public_feedback_e2e.py \
  tests/test_emlis_ai_d_source_unavailable_normal_observation_recovery.py \
  tests/test_emlis_ai_complete_initial_surface_recomposition_p5.py \
  tests/test_emlis_ai_complete_initial_surface_recomposition_existing_gate_chain_p8.py \
  tests/test_emlis_ai_limited_grounding_reception_surface_p4.py
```

### 10.5 User Label Connection / Product Read Feel

```bash
PYTHONPATH=services/ai_inference pytest -q \
  tests/test_emlis_ai_user_label_connection_material.py \
  tests/test_emlis_ai_user_label_connection_candidate.py \
  tests/test_emlis_ai_user_label_connection_gate.py \
  tests/test_emlis_ai_user_label_connection_surface.py \
  tests/test_emlis_ai_user_label_connection_public_boundary.py \
  tests/test_emlis_ai_user_label_connection_e2e_contract.py \
  tests/test_emlis_ai_product_readfeel_rubric.py \
  tests/test_emlis_ai_product_readfeel_scorecard.py \
  tests/test_emlis_ai_product_readfeel_phase11_long_run_product_gate.py \
  tests/test_emlis_ai_user_label_connection_product_quality_qa.py \
  tests/test_emlis_ai_user_label_connection_derived_model_cache.py
```

### 10.6 RN contract

```bash
cd Cocolon
npm run test:rn-screens --silent
```

---

## 11. 実装時の注意点

### 11.1 Gate緩和ではないことを守る

禁止:

```text
- visible_surface_acceptance_gate を常に通す。
- should_include_public_input_feedback からGate確認を丸ごと削る。
- runtime / state_answer / two_stage gateを緩める。
- rejected / unavailable を全部low_informationへ逃がす。
- fixed fallback commentTextを入れる。
- response keyを追加してRN側で拾わせる。
```

許可:

```text
- Display Gateとpublic inclusionで、yellow/warnの意味論を揃える。
- public_reached/rn_visible/product_surface_validを分けて診断する。
- body-freeなboolean/code summaryを既存diagnostic内に追加する。
- stale test expectationを、現在思想に合わせて更新する。
```

### 11.2 `passed=false` の扱いを雑にしない

`passed=false` を全部許可するわけではありません。

許可するのは次だけです。

```text
classification = yellow
AND
action = warn
```

または、それと同等に明示されたwarning状態のみです。

次はblockです。

```text
passed=false AND action != warn
classification=repair_required
classification=red
action=rerender_surface
action=reroute_low_information
action=block
action=fail_closed
```

### 11.3 product_surface_validとrn_visibleを混ぜない

今回の修正で `rn_visible=true` になるケースが増える可能性があります。  
しかし、それは商品品質合格を意味しません。

```text
rn_visible=true:
  ユーザーに届く。

product_surface_valid=false:
  届いているが、商品品質上の修正対象。
```

P1では、まず届かせます。  
P2/P3で品質を直します。

### 11.4 Red Bのtest更新は理由を残す

Red Bの期待値を更新する場合は、必ずtestコメントかred ledgerに理由を残します。

```text
- Public Recovery後、旧non-display fixtureがsafe limited observationとしてdisplayableになったため。
- 元generated bodyのpublic exposureを禁止する契約へ更新したため。
- true unavailable境界は別fixtureで保持するため。
```

理由なしで `rejected` / `unavailable` 期待を `passed` に変えないこと。

---

## 12. 失敗時の切り戻し基準

以下が起きたら、yellow/warn policy修正を切り戻すか、より狭い条件へ戻します。

```text
- repair_required / red がpublic inclusionされる。
- runtime / state_answer / two_stage gate blockedがpublic inclusionされる。
- safety_blocked / infrastructure_errorがcomment_textつきで出る。
- public metaへ raw input / comment_text body / candidate body が出る。
- RN contractが壊れる。
- product_surface_validationがpublic_reached/rn_visible/product_surface_validを混同する。
```

切り戻し単位:

```text
1. visible_surface yellow/warn helperのみ戻す。
2. emotion_submit inclusion summary helperのみ戻す。
3. product_surface_validation gate policyのみ戻す。
4. Red B test expectation更新を戻し、fixture分類を再実施する。
```

---

## 13. 実装後に作成する記録

実装後は、以下をmdで残すのが望ましいです。

```text
Cocolon_EmlisAI_P0_P1_PublicInputFeedbackArrivalContractRepair_ImplementationResult_20260608.md
```

記録項目:

```text
確認済み:
未確認:
書かれていない:
推測禁止:
変更ファイル:
変更していない境界:
Red A分類:
Red B分類:
実装方針:
実行test:
結果:
残赤:
次に進めるPhase判断:
```

---

## 14. 今回の設計判断まとめ

```text
Red A:
  実装修正対象。
  visible_surface yellow/warn のpublic inclusion意味論をDisplay Gateと揃える。

Red B1/B2:
  まず分類対象。
  Public Recovery後の思想変更で旧期待値が古い可能性がある。
  ただしtrue unavailable / unsupported body exposureまでpassedにしているなら実装修正。

RN:
  触らない。

API / DB:
  触らない。

JSON / schema:
  本資料では案のみ。
  実ファイル化は実装段階で判断。

P3/P5:
  まだ進めない。
  まずP0/P1の表示到達契約を閉じる。
```

---

## 15. 華恋の判断

華恋としては、今回の修正でいちばん大事なのは、`input_feedback` をただ増やすことではありません。

大事なのは、Cocolonが「読めたものを、入力直後のユーザーへ届ける」ことです。

`yellow / warn` は、商品品質上の注意であっても、沈黙にする理由ではありません。  
沈黙にするべきなのは、読めていない、危ない、壊れている、漏れている、またはGateがterminalに止めている場合です。

今回の設計は、Cocolonが次へ進むための足場です。

```text
ユーザーが残した言葉が、内部で処理されるだけで終わらない。
読まれた形で返る。
でも、読めていないものを読めたふりはしない。
```

この境界を閉じた後で、P3の読感、P5の履歴線へ進むのが筋です。
