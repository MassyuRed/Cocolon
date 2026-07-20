# Cocolon / EmlisAI P7 Gate 0
# 読感修復・Gate判定契約閉包 詳細設計書／実装順

- 作成日: 2026-07-11 JST
- 文書種別: 詳細設計書・実装順
- 設計状態: **DESIGN READY / IMPLEMENTATION NOT STARTED**
- 対象Phase: P7 Gate 0 current-input readfeel repair
- 現在のGate 0判定: `GATE0_REPAIR_RETURN_STOPPED`
- 現在のP8判定: **NO_GO**
- 本書の実装出口: **16 / 16 local human pass後のexact 8 device packet生成・停止**
- API / DB / RN production変更: なし
- Mash様による実機作業: Gate 0 local passまではなし
- 新規JSON / schemaの実ファイル化: 実装時に必要性を再確認して決定する。本書では契約案だけを定義する

## 参照正本

- `Cocolon_前提資料(317).zip`
- `Cocolon_前提資料/work_attitude_rules_for_karen/`
- `Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_need_observation_20260619.md`
- `Cocolon_EmlisAI_P7_Gate0_CurrentInput_SemanticRetention_ReadfeelRepair_DetailedDesign_ImplementationOrder_20260711.md`
- `mashos-api(206).zip`
- `Cocolon(287).zip`
- 現行Gate 0 R8 / R9 / R10成果物

---

## 0. 結論

本書は、既に実装済みのGate 0 current-input意味保持修復を作り直す設計ではない。現行16件のうち商品読感で不合格となった9件を、**既存canonical Grounded経路の一般semantic grammarだけで修復し、Gate 0判定契約をfull collect / full backendまで閉じるための追加修復設計**である。

実装は次の一単位として行う。

```text
現行9件とsource fingerprintのfreeze
  → exact本文を固定しない構造testをREDで追加
  → human followのrole / target選択を一般化修復
  → relation surface roleと述語安全な文法を一般化修復
  → duplicate anchor / repeated opening / dependent clause compactionを修復
  → Gate 0判定へfull collect / collection error / full backendを明示入力
  → 旧private helper参照testを現行canonical ownerへ移管
  → targeted
  → safety / public contract
  → RN contract
  → full collect
  → full backend
  → 同じ16件を再生成
  → 華恋が16件すべてを実読
  → 16 / 16合格時だけexact 8 packetを生成
  → 停止してMash様へ実機確認を依頼
```

本書で固定する最重要判断は次である。

```text
- bad bodyを期待値へ採用してgreenにしない。
- exact完成本文をtestの正解にしない。
- case ID、fixture固有語、入力全文をproduction分岐へ入れない。
- 廃止済みprivate helperをproductionへ復活させない。
- 旧substantive routeをtest救済のために復活させない。
- full collectが失敗した状態をaffected_suites_greenの一値で隠さない。
- full backendを実行していない状態をGate 0 passにしない。
- 16 / 16の華恋実読合格前にexact 8を作らない。
- exact 8生成後はP8へ進まず、実機証拠待ちで停止する。
```

---

## 1. 現在地

### 1.1 確認済みの実ファイル事実

最新受領物`mashos-api(206).zip`は、直前の`mashos-api(205).zip`と同一内容である。

```text
archive SHA-256:
cfb378d93a7ff9d65542012ca3176cea6fb5f20f1a49756df16971eb37e93b00

backend file count: 1665
Cocolon RN file count: 217
```

主要ownerの現行SHA-256は次である。RR0 freezeでは、これらを手入力せず再計算して記録する。

| owner | SHA-256 |
|---|---|
| `emlis_ai_grounded_sentence_surface.py` | `dfbb6e8546ab0eca2addfc64c45c1458375a07a1b35df1e17b106a56774e7d98` |
| `emlis_ai_grounded_observation_plan.py` | `1e806a88456f3dfe4f0a6d6bcae1c14472908ac3fb739a4073527ea078bdc484` |
| `emlis_ai_grounded_observation_gate.py` | `737ae4917f2e450668ff99c1b19ca54e5ea27bfe37dbbc25169baa0e4bf0faf8` |
| `emlis_ai_reply_service.py` | `1eb3d7b65c72c6c7ba5aee44c2138ae6e7ea38b20228f16821f1a5d2e17ef80c` |
| `emlis_ai_gate0_r9_r10_boundary.py` | `f4d7eac72529bb783532f575994b053d3ccf60055918dbbb49af3915f1677429` |

現在のcanonical契約は次である。

```text
Grounded plan schema:
  cocolon.emlis.grounded_observation_plan.v1

Grounded semantic version:
  cocolon.emlis.grounded_semantics.i2.v1

Grounded sentence plan schema:
  cocolon.emlis.grounded_sentence_plan.i3.v1

Grounded surface result schema:
  cocolon.emlis.grounded_surface.i4.v1

Canonical public generation path:
  grounded_observation_plan_sentence_surface_canonical_v1

Canonical composer source:
  grounded_plan_realizer
```

本修復ではpublic generation path、composer source、API response key、DB physical contract、RN visible contractを変更しない。

### 1.2 現行Gate 0結果

```text
automated candidate pass: 16 / 16
deterministic match:       16 / 16
華恋local human pass:       7 / 16
repair required:            9 / 16
hard fatal:                 0 / 16
exact 8 packet:             未生成
P5 / P6 / P8:               未開始・未許可
```

現行R8 body-free receipt:

```text
schema:
  cocolon.emlis.gate0.r8.karen_local_review.bodyfree.v1

SHA-256:
  dcb239693644c3c4a2ee7e13903509e0a90e1b1de5aa2bc627a89eeda09036e4
```

現行R9 decision:

```text
schema:
  cocolon.emlis.gate0.local_decision.bodyfree.v1

decision:
  GATE0_REPAIR_RETURN_STOPPED

SHA-256:
  1372eacd2092bfe0d054940898aa1e68b0b196d731ef38f2fff525580d952cfa
```

### 1.3 現行9件

| case | 現行body-free reason | 主な修復責務 |
|---|---|---|
| A | `duplicate_anchor_follow_readfeel` | followを同一anchorの別行へ再掲しない |
| A | `repetitive_state_sentence_opening` | 同種stateを独立した同型文へ分割しない |
| B | `unnatural_dependent_clause_compaction` | 疑問・引用・従属節を文字列連結で壊さない |
| C | `human_follow_role_surface_mismatch` | intentionをgeneric changeとして描かない |
| C | `generic_change_tail_for_intention` | intention用follow surfaceを使う |
| I6-L01 | `relation_surface_awkward_reversal` | 負荷と前進を暫定評価反転の文法へ押し込まない |
| I6-L01 | `human_follow_role_surface_mismatch` | next intentionをretained intentionとして扱う |
| I6-L02 | `human_follow_target_misses_retained_intention` | refusal / burdenより明示された次意図をfollow対象にする |
| I6-L03 | `duplicated_predicate_in_reversal_surface` | 完全文へgeneric述語を二重付加しない |
| I6-L03 | `human_follow_role_surface_mismatch` | wish / intentionをvalued changeへ誤分類しない |
| I6-C01 | `relation_surface_awkward_reversal` | 比較自己評価と具体的改善を発見反転文法へ固定しない |
| I6-C01 | `human_follow_role_surface_mismatch` | 次に見たい評価軸をretained intentionとして扱う |
| I6-C02 | `human_follow_role_surface_mismatch` | 次に見たい評価軸をretained intentionとして扱う |
| I6-C02 | `generic_change_tail_for_intention` | intentionへ「変化」というtailを付けない |
| I6-C03 | `relation_surface_awkward_reversal` | 比較自己評価と具体的改善に適したsurface roleを使う |
| I6-C03 | `human_follow_role_surface_mismatch` | 次に見たい評価軸をretained intentionとして扱う |

### 1.4 collection blocker

次の2件は、対象testだけをcollectして現在も再現する。

```text
ai/tests/test_emlis_ai_bounded_repair_reroute_step7.py
  imports:
    emlis_ai_reply_service._regeneration_reasons_for_retry

ai/tests/test_emlis_ai_complete_initial_surface_recomposition_existing_gate_chain_p8.py
  imports:
    emlis_ai_reply_service._reply_service_recomposition_existing_gate_chain_summary
```

両symbolは現行`emlis_ai_reply_service.py`に存在せず、存在させるべき現行ownerでもない。したがって修正対象はproductionのprivate helper復活ではなく、**testの責務とimport owner**である。

### 1.5 現行R9契約の不足

現行`build_gate0_local_decision()`は次だけを受け取る。

```python
local_assessments
actual_local_reviews
affected_suites_green
unclassified_failure_count
```

さらに現行artifact generatorは次を固定値で渡している。

```python
affected_suites_green=True
unclassified_failure_count=0
```

このため現行契約では、次を独立に証明できない。

- targeted suiteが本当にgreenか
- safety / public contractがgreenか
- RN contractがgreenか
- full collectが成功したか
- collection errorが0か
- full backendがgreenか
- その結果が、レビューしたものと同じsource snapshotか

この不足は9件の文章修復とは別の、Gate 0 pass判定上の実害である。同じ修復周期で閉じる。

---

## 2. 事実・推測・華恋の意見

### 2.1 確認した事実

1. `expected_human_follow_role()`は、現行順序で`positive polarity`または`kind in {change, value}`を`wish / intention`より先に判定する。
2. そのため、意図を示すnucleusがpositive / current change属性も持つ場合、`retained_intention`ではなく`valued_change`になり得る。
3. `_build_response_and_policies()`は通常入力でrefusalを強く評価するため、I6-L02では後半の明示的な次意図ではなく、前半の「場を乱したくない」側がfollow対象になっている。
4. `_render_relation()`は`preserves_despite`を一種類の文法で描くため、負荷と前進、暫定失敗評価と発見、比較自己評価と具体的改善を区別できない。
5. 同文法は右endpointが既に完全文の場合でもgeneric述語を付け、I6-L03の述語重複を生む。
6. `_build_regular_lines()`は`integrated_current_state`以外のfollowを原則独立行にするため、Aでは同一anchorがobservationとfollowに重複する。
7. Bの不自然さは、semantic retentionやrelation方向の欠落ではなく、surface fragmentの従属関係を文字列として圧縮した結果である。
8. 現行9件ではrequired nucleus、required relation direction、lexical fidelityの既存評価はpassしている。今回、これらを再設計して崩す必要はない。

### 2.2 根拠付き推測

1. 9件の大半は、case別本文を増やさず、次の三つを一般化すれば解消できる可能性が高い。
   - role-first follow target selection
   - relation typeとは別のrelation surface role
   - anchor / clause / follow deliveryを考慮したline planning
2. Bだけは主owner一覧に加えて、`_quotes_for_nuclei()`または`_surface_fragment_for_nucleus()`の従属節組立て修正が必要になる可能性が高い。
3. current plan schemaへ新しいfieldを追加しなくても、既存semantic attributesとSentenceBindingの`functional_atom_ids`で必要なroleを表現できる可能性が高い。

### 2.3 華恋の意見

今回、文章を自然にするための同義語辞書や完成文bankを足すべきではない。

不良の中心は語彙不足ではなく、**「何を人間的に受け取るか」「二つの内容がどの種類の関係か」「既に完結した節へ何を足してよいか」「同じanchorを別役割として再度言う必要があるか」**の決定が粗いことである。

したがって、先にbody-freeのroleとline structureを正しくし、その構造から本文を生成する。自然な日本語の最終合格は自動testへ偽装せず、同じ16件の実読で確定する。

---

## 3. 最終目的・完了条件・停止条件

### 3.1 最終目的への接続

本修復の目的は、問いシステムへ進むことではない。current-inputに既に書かれている意味を問いなしで受け取り、P7の観測対象として信頼できる本文を作る基礎を閉じることである。

問いで補う前に本文側の既知不良を0にすることで、P7以降に観測される「問いが必要だったか」を、単なる本文不良と混同しない状態を作る。

### 3.2 完了条件

次をすべて満たした場合だけ、本修復周期を完了とする。

```text
[freeze]
- 現行9件、16入力hash、source snapshot、reason refsが固定されている。
- 既存R8 / R9成果物を上書きしていない。

[structure]
- intention分類testがgreen。
- follow target選択testがgreen。
- relation surface role testがgreen。
- duplicate anchor / repeated opening testがgreen。
- dependent clause compaction testがgreen。
- exact完成本文assertがない。

[production]
- canonical path一系統を維持。
- case専用branch 0。
- fixture cue 0。
- completed body bank 0。
- legacy substantive route復活 0。
- required nucleus / relation / lexical fidelityに回帰 0。

[Gate contract]
- targeted、safety/public、RN、full collect、full backendが明示入力。
- full_collect_success = true。
- collection_error_count = 0。
- full_backend_green = true。
- validation snapshotとreview snapshotが一致。
- generator内のhard-coded greenが0。

[validation]
- targeted green。
- safety / public contract green。
- RN contract green。
- full collect green。
- full backend green。
- unclassified failure 0。

[actual read]
- 同じ16件を再生成。
- deterministic 16 / 16。
- 華恋local human pass 16 / 16。
- repair required 0。
- hard fatal 0。

[exit]
- exact 8 packetをhelperから生成。
- 任意入力代替なし。
- P5 / P6 / P8を開始しない。
- `GATE0_LOCAL_PASS_DEVICE_PACKET_READY_STOPPED`で停止。
```

### 3.3 停止条件

次のいずれかが発生したらexact 8を生成しない。

- 現行9件のreasonを期待値削除だけで消そうとしている。
- exact本文assertが必要になった。
- case IDまたはfixture語をproduction条件へ入れようとしている。
- current canonical path以外を復活させようとしている。
- `emlis_ai_reply_service.py`へ旧private helperを再追加しようとしている。
- role / target / relation directionを構造で説明できない。
- full collectがreturn code 0で完了しない。
- collection errorが1件以上ある。
- full backendが完了しない、またはgreenでない。
- source変更後に古いvalidation receiptを流用しようとしている。
- 16件中1件でも`repair_required`または`hard_fatal`が残る。
- API / DB / RN production変更が必要になった。
- Safety ownerまたはpublic contractへの影響が出た。

API / DB / RN production変更が必要と判明した場合は、この設計へ黙って混在させず、影響設計を別に作るまで停止する。

---

## 4. 対象範囲

### 4.1 production変更候補

```text
ai/services/ai_inference/
  emlis_ai_grounded_observation_plan.py
    - human follow role分類の共通owner
    - _build_response_and_policies

  emlis_ai_grounded_sentence_surface.py
    - expected_human_follow_role
    - _build_regular_lines
    - _render_relation
    - _render_human_follow
    - 必要性がRED testで確認された場合のみ:
      _quotes_for_nuclei
      _surface_fragment_for_nucleus
      _render_observation
```

### 4.2 原則変更しないproduction

```text
emlis_ai_reply_service.py
emlis_ai_grounded_observation_gate.py
API schema
DB schema / migration / write path
RN source
Safety triage / emergency owner
```

`emlis_ai_reply_service.py`は、旧private helperを戻さないことの確認対象であり、修復ownerではない。

`emlis_ai_grounded_observation_gate.py`は、role compatibilityの既存検証で明白な穴がRED testとして再現した場合だけ最小変更候補とする。自然な日本語をruntime Gateだけで判定する変更は行わない。

### 4.3 test / helper変更候補

```text
ai/tests/helpers/
  emlis_ai_gate0_r9_r10_boundary.py
  generate_emlis_ai_gate0_r8_r9_artifacts.py
  emlis_ai_grounded_observation_i0_inventory.py
  emlis_ai_grounded_observation_i6_cases.py
  emlis_ai_grounded_observation_i7_readfeel.py

ai/tests/
  test_emlis_ai_grounded_observation_plan_i1.py
  test_emlis_ai_grounded_observation_i2_i4.py
  test_emlis_ai_grounded_observation_i6.py
  test_emlis_ai_gate0_r5_semantic_subchecks.py
  test_emlis_ai_gate0_r8_r10_boundary.py
  test_emlis_ai_bounded_repair_reroute_step7.py
  test_emlis_ai_complete_initial_surface_recomposition_existing_gate_chain_p8.py
```

新規testファイルが必要な場合の候補名は、長さを抑えた次とする。

```text
test_emlis_ai_gate0_readfeel_repair.py
```

ただし、既存testへ責務を保ったまま収められる場合は、新規ファイルを増やさない。

### 4.4 非対象

- P8問いシステム
- 仮観測、問い、refined observation
- question answer保存
- P5 formal 24
- P6 18
- continued sequence
- P7 corpus expansion
- Free / Plus / Premium問い回数
- RN問いUI
- DB migration
- 実機確認そのもの
- 前提資料更新
- GitHub commit / push / PR

---

## 5. 変更してはいけない不変条件

1. `GroundedObservationPlan`をcurrent-input意味正本として維持する。
2. canonical public generation pathを維持する。
3. `composer_source=grounded_plan_realizer`を維持する。
4. recoveryは同じplanを縮退し、別本文経路へ切り替えない。
5. response keyを追加・削除しない。
6. raw input、returned body、review commentをpublic metaへ入れない。
7. self-denial safe-stateのfact boundaryを維持する。
8. help-seekingを安全保証へ広げない。
9. inputにない診断、人格、原因、未来保証を追加しない。
10. question policyはfalseのままにする。
11. 同一snapshot / 同一入力の決定性を維持する。
12. ランダムな言い換えを使わない。
13. case専用mode、cue、body、hash分岐を作らない。
14. exact本文を自動testの正解としない。
15. current required nucleus / relation / lexical fidelityの合格を後退させない。
16. Product Read Feelのhuman passを自動testだけで生成しない。

---

## 6. RR0 freeze設計

### 6.1 目的

現在の9件を、後から期待値やreceiptを書き換えて「最初から不良ではなかった」ことにできない状態にする。

### 6.2 freezeするもの

```text
source:
- source archive SHA-256
- source snapshot fingerprint
- owner source file SHA-256
- relevant test/helper SHA-256
- canonical schema / semantic / generation path versions

cases:
- exact case order 16件
- normalized current input SHA-256 16件
- repair case ID 9件
- current body SHA-256 16件
- current plan body-free signature 16件
- current sentence-plan body-free signature 16件
- current follow target IDs / follow role atoms
- current relation IDs / relation types / endpoint IDs
- current anchor-to-line occurrence signature

review:
- current R8 receipt SHA-256
- current 7 / 9 / 0 count
- body-free reason refs

validation blockers:
- obsolete import test path
- missing symbol
- current canonical replacement owner
```

### 6.3 source snapshot fingerprint

実装後も同じ規則で再計算できるよう、snapshot fingerprintはzip名ではなく、対象treeから決定的に作る。

推奨規則:

```text
include:
  ai/**/*.py
  ai/tests/**/*.py
  ai/tests/**/*.json
  requirements / pytest config等、実行に影響する設定

exclude:
  __pycache__
  .pytest_cache
  *.pyc
  local_onlyのbody-full生成物
  実行log
  後から生成されるR8 / R9 / R10 receipt

algorithm:
  relative_path + NUL + file_sha256 をpath昇順で連結
  全体をSHA-256
```

review、validation、decision、exact 8はすべてこのfingerprintを参照する。sourceが1byteでも変わった場合、過去のvalidation evidenceを再利用しない。

### 6.4 freeze artifact案

実ファイル化する場合の短い候補名:

```text
gate0_rr0_freeze_20260711.json
gate0_rr0_body_local_20260711.json
```

前者はbody-freeでcommit候補、後者はlocal-only body-fullである。

#### body-free schema案

```json
{
  "schema_version": "cocolon.emlis.gate0.repair_freeze.bodyfree.v1",
  "cycle_id": "gate0_readfeel_repair_20260711",
  "source_archive_sha256": "64hex",
  "source_snapshot_fingerprint": "64hex",
  "source_file_sha256s": {
    "relative/path.py": "64hex"
  },
  "case_order": ["A", "B", "C", "D", "I6-S01"],
  "case_count": 16,
  "repair_case_ids": [
    "A", "B", "C", "I6-L01", "I6-L02", "I6-L03",
    "I6-C01", "I6-C02", "I6-C03"
  ],
  "cases": [
    {
      "case_id": "A",
      "normalized_current_input_sha256": "64hex",
      "current_body_sha256": "64hex",
      "plan_signature_sha256": "64hex",
      "sentence_plan_signature_sha256": "64hex",
      "reason_refs": ["duplicate_anchor_follow_readfeel"]
    }
  ],
  "collection_blockers": [
    {
      "test_path": "relative/test.py",
      "missing_symbol": "symbol_name",
      "production_restore_allowed": false
    }
  ],
  "raw_input_included": false,
  "returned_surface_included": false,
  "comment_text_included": false
}
```

### 6.5 freeze不変ルール

- 現行R8 receiptとR9 decisionを上書きしない。
- 新しい修復周期は新しいartifact revisionとして作る。
- reason refを削除するには、対応するRED testがGREENになり、同じ16件のactual readで確認される必要がある。
- bodyの文言が変わっただけではreason解消としない。
- source fingerprintとcase input hashが一致しないreceiptを受理しない。

### 6.6 RR0完了条件

- 16入力、9不良、2 collection blockerが固定されている。
- current source hashを再計算可能である。
- production code変更はまだない。

---

## 7. RR1 構造test設計

### 7.1 原則

先に本文を書き換えない。現行不良を、次のbody-freeまたは構造的性質としてREDにする。

```text
intention role
follow target
relation surface role
complete-clause handling
duplicate anchor delivery
repeated state line planning
dependent clause unit
```

禁止:

```text
assert body == "承認済み完成文"
assert "ケース固有の長文" in body
Known Bだけを判定するproduction helper
fixture語を使ったruntime branch
```

許可:

```text
assert selected_role == "retained_intention"
assert target has semantic_role:retained_intention
assert relation_surface_role == "comparison_to_counterevidence"
assert right_endpoint_form == "complete_clause"
assert anchor occurrence is one delivery unit
assert no separate follow line when integration is required
assert required span IDs remain covered
```

### 7.2 intention test

対象:

```text
C
I6-L01
I6-L03
I6-C01
I6-C02
I6-C03
```

検査:

- target nucleusが`kind=wish`、`modality=intention`、または`semantic_role:retained_intention`を持つ場合、positive polarityだけを理由に`valued_change`へしない。
- `retained_intention`判定は`valued_change`判定より先に成立する。
- genuine change / valueで、wish / intentionでないcontrol caseは`valued_change`のままにする。
- action nucleus controlは`concrete_effort`のままにする。
- self-denial controlは`protective_counterdirection` / `help_seeking_preserved`を維持する。

### 7.3 follow target test

対象:

```text
I6-L02
```

検査:

- 通常safe observationで、requiredな明示次意図が存在する場合、前半のburden / refusalを無条件に優先しない。
- selected targetは`semantic_role:retained_intention`または同等の明示意図を持つ。
- targetがaction relationに接続している場合、その根拠を加点できる。
- self-denial safe-stateでは同じ優先順位を使わず、protective directionを優先する。
- follow targetは必ずEvidenceSpanResolverで解決できる。

### 7.4 reversal role test

`relation.type`だけではsurface文法を決めず、endpointのsemantic roleから`relation_surface_role`を決める。

対象と期待role:

| case | relation type | expected surface role |
|---|---|---|
| I6-L01 | `preserves_despite` | `burden_or_constraint_with_progress` |
| I6-L03 | `preserves_despite` | `provisional_evaluation_to_counterevidence` |
| I6-C01 | `preserves_despite` | `comparison_to_counterevidence` |
| I6-C03 | `preserves_despite` | `comparison_to_counterevidence` |
| I6-C02 | `contrast` | `coexisting_comparison_and_evidence` |

検査:

- relation endpoint IDと方向は変えない。
- surface roleだけを意味構造に応じて変える。
- complete clauseへ同じ述語を再付加しない。
- provisional evaluation用の「評価が閉じなかった」文法を、burdenやcomparisonへ一律適用しない。
- relation roleが不明な場合、generic断定を増やさず、限定的なcoexistenceへ落とす。

### 7.5 duplicate anchor test

対象:

```text
A
```

検査:

- 同じsurface anchorがobservation lineとhuman follow lineへ重複し、二つ目が新しいrelation / boundary / safety roleを持たない場合は不合格。
- 同じsource fieldの近接したhomogeneous state nucleiは、一つのobservation groupへ統合可能である。
- `human_follow:burden_expression`は、targetが既に観測行へ含まれ、別行にする意味がない場合、同一行へintegrateする。
- adjacent linesが同じopening functionで始まる構造を作らない。

許可例外:

- fact boundaryとlimited oppositionのように、同じanchorでも責務が明確に異なる場合。
- safety supportの別ownerが必要な場合。

### 7.6 dependent clause compaction test

対象:

```text
B
```

検査:

- interrogative fragment、quotative continuation、connector-attached fragmentを独立した名詞anchorとして単純連結しない。
- surface unitは、source span IDを保持した`complete_clause`または`nominal_anchor`として分類される。
- 疑問語と「と考えていた」等の引用継続を結ぶ場合、文法上必要な引用境界を失わない。
- required span coverageを減らさない。
- testはBの完成文を固定せず、clause unitのdependency roleと完成性を検査する。

### 7.7 metamorphic control

case固有分岐を防ぐため、少なくとも次を追加する。

```text
- wishの対象名詞を変えてもretained_intentionになる。
- comparison対象を変えてもcomparison_to_counterevidenceになる。
- counterevidenceを削除した入力ではreversal roleを作らない。
- intentionをfactへ変えた入力ではretained_intentionを作らない。
- clause順序を反転した場合、endpoint方向もsource順に従う。
- help-seeking operatorを削除したcontrolではhelp-seeking roleを残さない。
```

### 7.8 RR1完了条件

- 現行コードで、狙った構造testがREDになる。
- 既にpassしているD / S / self-denial controlを壊すtest設計になっていない。
- exact本文assertが0。

---

## 8. 一般semantic grammar設計

## 8.1 共通role classifier

human followのrole分類とtarget選択を別々の独自ロジックにしない。

`emlis_ai_grounded_observation_plan.py`を共通ownerとし、body-freeな共通関数を追加する。

候補signature:

```python
def classify_grounded_human_follow_role(
    *,
    safety_kind: str,
    material_quality: str,
    required_nucleus_count: int,
    nuclei: Sequence[GroundedSemanticNucleus],
) -> str:
    ...
```

`expected_human_follow_role()`はこの共通関数を呼び、SentencePlan側でrole / target互換性を再確認する。

PlanとSurfaceで同じ判定をコピーしない。循環importを作らないため、classifier ownerはPlan側とする。

### 8.1.1 role vocabulary

既存codeを維持する。

```text
integrated_current_state
help_seeking_preserved
protective_counterdirection
retained_intention
concrete_effort
valued_change
burden_expression
```

### 8.1.2 role priority

#### self-denial / safety context

```text
help_seeking_preserved
  > protective_counterdirection
  > concrete_effort
  > retained_intention
  > burden_expression
```

#### normal safe observation

```text
help_seeking_preserved
  > retained_intention
  > concrete_effort
  > valued_change
  > burden_expression
  > integrated_current_state fallback
```

`integrated_current_state`はshort-stateのdelivery roleであり、明示意図やactionを上書きしない。

### 8.1.3 valued changeの条件

次のどちらかを満たし、wish / intentionではない場合だけ使う。

```text
- kind in {change, value}
- explicit current change / explicit positive evaluation
```

`polarity=positive`だけでは`valued_change`にしない。

### 8.1.4 retained intentionの条件

次のいずれかを満たす。

```text
kind == wish
modality in {wish, intention}
semantic_role:retained_intention
semantic_role:next_intention
```

current change属性と共存しても、follow roleはretained intentionを優先する。

---

## 8.2 `_build_response_and_policies()`

### 8.2.1 現行問題

現行はnucleusの種類とmodalityへ数値を加え、refusalを強くする。通常入力でもrefusalが明示次意図より上位になり、I6-L02のfollow targetを誤る。

### 8.2.2 新しい選択順

```text
1. candidate nucleusを集める。
2. 各candidateを共通classifierでrole分類する。
3. safety contextに応じたrole priorityを適用する。
4. 同role内でevidence strengthとresponse relevanceを比較する。
5. selected target IDsをresponse planへ入れる。
6. Surfaceで同じclassifierを使いroleを再確認する。
```

### 8.2.3 candidate set

原則として次を候補にする。

```text
- primary_nucleus_ids
- supporting_nucleus_ids
- required_nucleus_ids
```

除外:

```text
- relation markerだけのnucleus
- dependent fragment単体
- resolverで解決できないnucleus
- surface anchorを持たないsynthetic candidate
```

### 8.2.4 同role内tie-breaker

順序:

```text
A. required retention
B. explicit semantic role
C. response primary / supportingに採用済み
D. required relationまたはaction_supports_changeへ接続
E. source-bounded explicitness
F. source order
```

source orderは最後の安定tie-breakerであり、前半だから負荷を選ぶ、後半だから必ず意図を選ぶ、という単独規則にしない。

### 8.2.5 I6-L02の構造期待

```text
前半:
  意見を飲み込んだ
  場を乱したくなかった
  黙ったままだと違和感が残った

後半:
  要点を整理した
  相手を否定したいわけではない
  次は境界だけ短く伝えるつもり
  三行に縮めて保存した
```

通常safe observationでは、明示的な次意図があるため、`burden_expression`より`retained_intention`をfollow対象にする。

ただし、前半の意味を本文から削除しない。follow targetの変更はwhole-input retentionの削除ではない。

### 8.2.6 schema判断

`GroundedResponsePlan`へ新しいfieldは追加しない。roleは既存nucleus attributesと共通classifierから決定し、SentenceBindingのfunctional atomへ記録する。

そのため:

```text
GROUND_OBSERVATION_PLAN_SCHEMA_VERSION:
  変更しない

GROUND_OBSERVATION_PLAN_SEMANTIC_VERSION:
  i2.v1 → i2.v2へ更新する
```

semantic version更新はI0 fingerprintと関連testへ反映する。

実装中に新しいpersistent fieldが不可避と判明した場合は、黙ってschemaを増やさず停止し、本書を改訂する。

---

## 8.3 `expected_human_follow_role()`

### 8.3.1 責務

- 共通classifierの結果をSentencePlanで再確認する。
- plan safety kind、material quality、target nucleusを使う。
- roleとtargetの互換性がない場合、generic fallbackで隠さずvalidation errorにする。

### 8.3.2 修正

現行の次の順を廃止する。

```text
action
→ positive / change / value
→ wish / intention
```

次へ変更する。

```text
help seeking
→ self-denial protective
→ retained intention
→ concrete effort
→ genuine valued change
→ burden
→ integrated short state
```

short single-stateだけは、明示的な別roleがない場合に`integrated_current_state`とする。

### 8.3.3 role / target incompatibility

次を構造不合格にする。

```text
wish / intention target + valued_change role
help-seeking target + burden_expression role
self-denial protective target + burden_expression role
action target + retained_intention role without intention evidence
```

reason code候補:

```text
human_follow_role_target_mismatch
intention_misclassified_as_change
help_seeking_role_missing
protective_counterdirection_misclassified
```

---

## 8.4 `_build_regular_lines()`

### 8.4.1 新しい責務

`_build_regular_lines()`は、required coverageを保つだけでなく、次を決める。

```text
- followを既存観測行へ統合するか、独立行にするか
- 同種stateを一つのgroupへ統合するか
- relation surface roleをどのbinding atomへ持たせるか
- 同一anchorの無目的再掲を防ぐか
```

### 8.4.2 follow delivery mode

既存fieldを増やさず、SentenceBindingの`functional_atom_ids`へ次を追加する。

```text
human_follow_delivery:integrated
human_follow_delivery:separate
```

#### integrated条件

次をすべて満たす場合、既存観測行へ統合する。

```text
- follow targetが既に観測行に含まれる。
- separate lineにしても新しいrelation / boundary / safety責務が増えない。
- roleがburden_expression、retained_intention、valued_change、integrated_current_stateのいずれか。
- anchorを再掲するより、観測行自体をhuman followとして扱う方が自然。
```

#### separate条件

```text
- help_seeking_preserved
- protective_counterdirection
- self-denial fact boundaryと役割を分ける必要がある
- targetが既存観測行に含まれない
- concrete actionを別の人間的受け取りとして示す意味がある
```

ただし、concrete actionも既存relation行で十分に受け取れている場合はintegrationを検討する。機械的に常に別行へしない。

### 8.4.3 Aのgrouping

同じsource field、近接順、同種のstate / reaction / constraintで、required relationがないnucleiは、homogeneous state groupとして一行へまとめられる。

これにより、次を防ぐ。

```text
同じopening functionの隣接反復
同一anchorのobservation / follow再掲
```

複数状態をまとめることは、片方を落とすことではない。bindingには両nucleus IDと両evidence span IDを残す。

### 8.4.4 duplicate anchor structural rule

SentencePlan生成後、anchorごとのdelivery signatureを作る。

```text
surface_anchor_id
→ sentence_id
→ line_role
→ surface_function
→ functional atoms
```

次の場合は不合格。

```text
同じanchorが複数行にあり、
後続行に新しいrelation / boundary / safety / distinct follow roleがない。
```

Aでは、burden followを同一観測行へ統合するため、同じanchorの独立follow lineを作らない。

### 8.4.5 relation surface role atom

relation lineへ次を付ける。

```text
relation_surface:dimension_shift
relation_surface:coexisting_contrast
relation_surface:burden_or_constraint_with_progress
relation_surface:provisional_evaluation_to_counterevidence
relation_surface:comparison_to_counterevidence
relation_surface:intention_evidenced_by_action
```

このatomはbody-freeであり、case IDや入力本文を含まない。

### 8.4.6 recovery

全recovery stageで次を維持する。

- required nucleus coverage
- required relation coverage
- selected follow role
- follow delivery責務
- duplicate anchor禁止
- complete clause安全性

`minimal_grounded`で行数を減らす際も、followを同じanchorの別行へ再分割しない。

---

## 8.5 relation surface role

### 8.5.1 relation typeとsurface roleを分ける理由

`preserves_despite`は意味関係として正しくても、表面文法は一種類ではない。

```text
負荷がありつつ進めた
暫定的に失敗と見たが、別の特徴を発見した
他者比較では低く感じるが、自分の具体的改善がある
```

これらを同じ「Xと捉えかけても、Yが見えたという反転」にすると、不自然さと述語重複が発生する。

### 8.5.2 role判定

relation type、endpoint kind、modality、semantic role、time scopeを使う。

#### `provisional_evaluation_to_counterevidence`

```text
from:
  provisional evaluation / failure interpretation

to:
  explicit discovery / counterevidence / retained value
```

#### `burden_or_constraint_with_progress`

```text
from:
  burden / constraint / blocked state

to:
  concrete progress / partial action / entry created
```

#### `comparison_to_counterevidence`

```text
from:
  comparison-based self evaluation

to:
  concrete self-referenced improvement evidence
```

#### `coexisting_comparison_and_evidence`

比較評価と具体的改善が対照として共存するが、強い反転や発見を断定しない場合。

### 8.5.3 endpoint surface form

各endpointを次に分類する。

```text
nominal_anchor
complete_clause
quotative_clause
dependent_clause_group
```

`complete_clause`へ、既に含まれる述語をgenericに再付加しない。

禁止例の構造:

```text
[right endpoint already ends with 見えた]
+ generic renderer adds が見えた
```

### 8.5.4 `_render_relation()`

`relation.type`だけのif分岐から、次の二段階へ変更する。

```text
relation.type + endpoint semantic roles
  → relation_surface_role

relation_surface_role + endpoint surface forms
  → compositional surface
```

完成文bankではなく、connectorとendpoint formの組み合わせを使う。

### 8.5.5 fallback

roleが十分に確定できない場合:

- 原因や反転を発明しない。
- source order以上を断定しない。
- `coexisting_contrast`またはbounded observationへ落とす。
- required relation directionは失わない。

---

## 8.6 `_render_human_follow()`

### 8.6.1 role別責務

| role | 受け取るもの | 禁止 |
|---|---|---|
| `retained_intention` | 本人が残したい、続けたい、次に見たい向き | 「変化」と呼ぶ、実行済み扱い |
| `valued_change` | 本人が明示した変化・価値評価 | 意図や願いへの適用 |
| `concrete_effort` | 実際の行動・試行 | 成功・成長保証 |
| `burden_expression` | 今置かれた負荷・苦しさ | 人格・原因断定 |
| `protective_counterdirection` | 自己否定だけで閉じない保護方向 | 単なる負荷扱い |
| `help_seeking_preserved` | 相談先・面談等の具体的支援接続 | 安全保証 |
| `integrated_current_state` | 今の状態を入力として置いたこと | 同じquoteの再掲 |

### 8.6.2 intention surface

`retained_intention`では、targetを次として扱う。

```text
現在の確定変化ではなく、本人が残した向き・基準・次の意図
```

したがって、genericな「この変化を大切な手がかりとして」は使わない。

### 8.6.3 integrated時

`human_follow_delivery:integrated`の場合、独立した`_render_human_follow()` lineを作らない。既存observation bindingに`human_follow:<role>`を付け、coverage上はhuman follow済みとする。

### 8.6.4 no overclaim

全roleで次を禁止する。

- 「あなたは強い」等の人格保証
- 「必ず良くなる」等の未来保証
- 行動指示
- sourceにない感情・原因
- input外の期間傾向

---

## 8.7 Bのdependent clause組立て

### 8.7.1 対象owner

RED testで原因が確認された場合のみ、次を修正する。

```text
_quotes_for_nuclei()
_surface_fragment_for_nucleus()
```

### 8.7.2 ephemeral clause unit

public schemaやPlan fieldを増やさず、Surface内部だけで次の一時構造を使う。

```python
SurfaceClauseUnit(
    source_span_ids,
    dependency_role,
    surface_text,
    surface_form,
    terminal_predicate_kind,
)
```

候補`dependency_role`:

```text
standalone
interrogative_quotative
connector_attached
predicate_continuation
```

### 8.7.3 組立て原則

- punctuationを先に削ってから単純連結しない。
- 疑問fragmentとquotative continuationを一つのunitとして扱う。
- relation markerだけをquoteとして出さない。
- source span IDを落とさない。
- 完全文か名詞anchorかをrendererへ渡す。

### 8.7.4 test境界

Bのexact完成文をassertしない。

検査するのは:

- dependency role
- complete clause status
- source span coverage
- 無効なfragment concatenationがないこと
- deterministic output

---

## 9. Gate 0判定契約 v2

### 9.1 目的

`affected_suites_green=True`という一つの手渡しbooleanで、full collectやfull backendを代替できないようにする。

### 9.2 validation evidence object

`build_gate0_local_decision()`へ個別booleanを大量に直渡しするより、body-freeな検証証拠を一つの型として渡す。

候補:

```python
@dataclass(frozen=True)
class Gate0ValidationEvidence:
    schema_version: str
    source_snapshot_fingerprint: str
    targeted_suites_green: bool
    targeted_result_ref: str
    safety_public_contract_green: bool
    safety_public_result_ref: str
    rn_contract_green: bool
    rn_result_ref: str
    full_collect_success: bool
    collected_test_count: int
    collection_error_refs: tuple[str, ...]
    full_backend_green: bool
    full_backend_result_ref: str
    unclassified_failure_refs: tuple[str, ...]
```

### 9.3 JSON schema案

実ファイル化する場合の短い候補名:

```text
gate0_validation_20260711.json
```

```json
{
  "schema_version": "cocolon.emlis.gate0.validation.bodyfree.v2",
  "source_snapshot_fingerprint": "64hex",
  "steps": {
    "targeted": {
      "passed": true,
      "command_ref": "gate0_targeted_v2",
      "return_code": 0,
      "test_count": 0,
      "subtest_count": 0,
      "output_sha256": "64hex"
    },
    "safety_public_contract": {
      "passed": true,
      "command_ref": "gate0_safety_public_v2",
      "return_code": 0,
      "test_count": 0,
      "output_sha256": "64hex"
    },
    "rn_contract": {
      "passed": true,
      "command_ref": "npm_run_test_rn_screens",
      "return_code": 0,
      "test_count": 0,
      "output_sha256": "64hex"
    },
    "full_collect": {
      "passed": true,
      "return_code": 0,
      "collected_test_count": 0,
      "collection_error_count": 0,
      "collection_error_refs": [],
      "output_sha256": "64hex"
    },
    "full_backend": {
      "passed": true,
      "return_code": 0,
      "test_count": 0,
      "failure_refs": [],
      "output_sha256": "64hex"
    }
  },
  "unclassified_failure_refs": [],
  "raw_input_included": false,
  "returned_surface_included": false,
  "comment_text_included": false
}
```

### 9.4 証拠生成

validation evidenceは手書きbooleanにしない。

各step runnerが次を記録する。

```text
command ref
working directory
return code
test / subtest / collect count
failure refs
output SHA-256
source snapshot fingerprint
```

log本文はlocal-onlyに保持し、body-free receiptにはhashとreason refだけを入れる。

### 9.5 `build_gate0_local_decision()` signature

候補:

```python
def build_gate0_local_decision(
    *,
    local_assessments: Sequence[I7LocalReadFeelAssessment],
    actual_local_reviews: Sequence[I7KarenLocalReview],
    validation_evidence: Gate0ValidationEvidence,
    expected_source_snapshot_fingerprint: str,
) -> dict[str, Any]:
    ...
```

旧引数:

```text
affected_suites_green
unclassified_failure_count
```

は削除する。default値を付けず、全callerの移行を強制する。

### 9.6 pass条件

```python
validation_pass = all((
    targeted_suites_green,
    safety_public_contract_green,
    rn_contract_green,
    full_collect_success,
    collection_error_count == 0,
    full_backend_green,
    unclassified_failure_count == 0,
    validation_snapshot == review_snapshot == expected_snapshot,
))
```

`full_collect_success`は単独booleanとして信用せず、次と整合しなければvalidation evidence自体をinvalidにする。

```text
return_code == 0
collection_error_count == 0
collection_error_refs == []
collected_test_count > 0
```

### 9.7 decision code precedence

| local review | validation | decision |
|---|---|---|
| 16 / 16 pass | all pass | `GATE0_LOCAL_PASS_DEVICE_PACKET_READY_STOPPED` |
| 16 / 16 pass | blocked | `GATE0_TEST_OR_CONTRACT_BLOCKED_STOPPED` |
| repair / fatalあり | all pass | `GATE0_REPAIR_RETURN_STOPPED` |
| repair / fatalあり | blocked | `GATE0_REPAIR_RETURN_STOPPED`。ただしvalidation blockerも省略せず記録 |

文章不良とtest契約不良を一つのreasonへ潰さない。

### 9.8 decision schema案

```json
{
  "schema_version": "cocolon.emlis.gate0.local_decision.bodyfree.v2",
  "source_snapshot_fingerprint": "64hex",
  "review_snapshot_fingerprint": "64hex",
  "validation_evidence_sha256": "64hex",
  "decision_code": "GATE0_REPAIR_RETURN_STOPPED",
  "gate0_local_pass": false,
  "automated_candidate_pass": true,
  "actual_local_review_count": 16,
  "local_human_pass_count": 7,
  "repair_required_count": 9,
  "hard_fatal_count": 0,
  "validation": {
    "targeted_suites_green": true,
    "safety_public_contract_green": true,
    "rn_contract_green": true,
    "full_collect_success": false,
    "collection_error_count": 2,
    "full_backend_green": false,
    "unclassified_failure_count": 0
  },
  "blocker_refs": [
    "collection_error:obsolete_private_import:bounded_repair_step7",
    "collection_error:obsolete_private_import:recomposition_p8"
  ],
  "exact8_packet_generation_allowed": false,
  "p5_formal_24_start_allowed": false,
  "p6_start_allowed": false,
  "p8_start_allowed": false,
  "raw_input_included": false,
  "returned_surface_included": false,
  "comment_text_included": false
}
```

### 9.9 artifact generator修正

`generate_emlis_ai_gate0_r8_r9_artifacts.py`から次を削除する。

```python
affected_suites_green=True
unclassified_failure_count=0
```

新しいgeneratorは、明示されたvalidation evidenceを読み、fingerprint一致を検査する。

```text
validation evidenceがない
→ decisionを生成しない

fingerprintが不一致
→ decisionを生成しない

full collect未実施
→ pass decisionを生成しない

full backend未実施
→ pass decisionを生成しない
```

review body-full比較の生成とR9 decision生成を分離してもよい。実装時に分離した方が責務が明確なら、短い二つのrunnerへ分ける。

### 9.10 exact 8 builder強化

`build_exact8_device_packet()`は、v2 decisionで次を再確認する。

```text
- decision code pass
- gate0_local_pass true
- exact8 allowed true
- full collect true
- collection error 0
- full backend true
- source / review / validation fingerprint一致
- local comment hash 8件存在
- frozen case 8件存在
```

decision mappingの3値だけを信用しない。

---

## 10. 旧test importのcanonical整合

## 10.1 原則

```text
testをgreenにするためにproductionへmissing private helperを戻さない。
legacy substantive routeを復活させない。
旧testの歴史名は、参照がある場合は無理にrenameしない。
中身の責務を現行canonical ownerへ更新する。
```

## 10.2 `test_emlis_ai_bounded_repair_reroute_step7.py`

### 現行問題

このtest fileの大半は`emlis_ai_bounded_repair_reroute`自身のbody-free decisionを検査しており、残してよい。しかし一件だけ、削除済みreply service private helperをimportしている。

### 修正

削除:

```python
from emlis_ai_reply_service import _regeneration_reasons_for_retry
```

旧test:

```text
test_step7_limited_composer_consumes_only_surface_rerender_reason_for_retry
```

を、現行canonical recovery ownerに対する境界testへ置き換える。

現行owner:

```text
emlis_ai_grounded_sentence_surface.build_plan_preserving_recovery_sequence
emlis_ai_reply_service.render_emlis_ai_reply
```

検査:

- recovery sequenceは同一Grounded Planから作られる。
- limited composer clientの有無でsubstantive body routeが変わらない。
- old retry reasonがpublic body生成を選ばない。
- canonical generation pathとcomposer sourceが維持される。
- body textをmetaへ入れない。

bounded repair module自身のunit testは、現行public関数の責務として残す。

## 10.3 `test_emlis_ai_complete_initial_surface_recomposition_existing_gate_chain_p8.py`

### 現行問題

ファイルは、削除済みのcandidate recomposition adoption summaryをreply serviceからimportしている。現行reply serviceはそのrouteを持たず、Grounded Plan / Sentence Surface / Grounded Gateがcanonical ownerである。

### 修正

削除:

```python
from emlis_ai_reply_service import _reply_service_recomposition_existing_gate_chain_summary
```

現行ownerへ置換:

```text
emlis_ai_grounded_sentence_surface.build_grounded_sentence_plan
emlis_ai_grounded_sentence_surface.realize_grounded_sentence_plan
emlis_ai_grounded_observation_gate.evaluate_grounded_observation_gate
emlis_ai_reply_service.render_emlis_ai_reply
```

新しい責務:

```text
- canonical Grounded artifactだけがpublic candidateになる。
- Grounded Gateがfailしたartifactはadoptされない。
- old recomposition candidate / adoption summary keyは存在しない。
- gateをrelaxしない。
- raw input / comment bodyをmetaへ入れない。
```

ファイル名を残す場合、docstringへ次を明示する。

```text
historical file name retained for lineage;
current assertion owner is canonical Grounded Plan / Surface / Gate;
this is not a resurrection of the former recomposition route.
```

### 10.4 production確認

`emlis_ai_reply_service.py`の`__all__`とsource scanで次を確認する。

```text
_regeneration_reasons_for_retry absent
_reply_service_recomposition_existing_gate_chain_summary absent
legacy candidate adoption body route absent
```

### 10.5 I0 inventory

production修復とtest移管が完了した後にだけ、I0 source fingerprintとowner graphを更新する。

- missing private helperをexpected ownerへ登録しない。
- current canonical ownerを登録する。
- legacy substantive production reachabilityは0を維持する。
- collection errorが消えた事実を、full collectで確認してからinventoryを閉じる。

---

## 11. 検証設計

### 11.1 共通ルール

- 各validation step開始時と終了時にsource snapshot fingerprintを照合する。
- step間でsourceが変わった場合、それ以前の結果を無効にする。
- failureをskip / xfail / expectation削除で消さない。
- test countは記録するが、過去の固定件数だけをpass条件にしない。
- return code 0とfailure 0を必須にする。
- body-full logはlocal-only、decision evidenceはbody-freeにする。

### 11.2 Step V1: compile / targeted

順序:

```text
1. modified Python files compile
2. RR1 new structural tests
3. Grounded plan I1
4. Sentence surface I2 / I4
5. Gate semantic subchecks R5
6. I6 known + unseen corpus
7. I7 deterministic local candidate
8. Gate0 R8 / R10 boundary
9. old import移管後の2 test files
10. I0 inventory
```

主な対象:

```text
test_emlis_ai_grounded_observation_plan_i1.py
test_emlis_ai_grounded_observation_i2_i4.py
test_emlis_ai_grounded_observation_i6.py
test_emlis_ai_grounded_observation_i7.py
test_emlis_ai_gate0_r5_semantic_subchecks.py
test_emlis_ai_gate0_r8_r10_boundary.py
test_emlis_ai_bounded_repair_reroute_step7.py
test_emlis_ai_complete_initial_surface_recomposition_existing_gate_chain_p8.py
test_emlis_ai_grounded_observation_i0_inventory.py
```

V1合格:

- return code 0
- collection error 0
- new structural tests全件green
- existing required nucleus / relation / lexical testsに回帰なし

### 11.3 Step V2: safety / public contract

最低限、次のfamilyを実行する。

```text
safety triage / safety boundary
self-denial response contract
response contract
observation reply contract
public feedback meta
public source lineage
public display contract
visible surface acceptance
current observation display contract
```

合格:

- emergency / safety owner維持
- self-denial fact boundary維持
- canonical meta維持
- raw input / returned body leak 0
- public comment visibility contract維持
- API top-level response key差分0

### 11.4 Step V3: RN contract

Cocolon RN treeで実行する。

```bash
npm run test:rn-screens
```

現在のRN production sourceは修正対象ではないが、backend meta / display contractの後退がないことを確認する。

合格:

- return code 0
- screen contract全件pass
- Emlis modal eligibility / visibility contractに差分なし
- test期待値をbackend bad bodyへ合わせて変更していない

### 11.5 Step V4: full collect

```bash
python -m pytest --collect-only -q
```

合格:

```text
return code 0
collected_test_count > 0
collection_error_count = 0
collection_error_refs = []
```

「以前からある2件だから」という理由でpassにしない。本修復の明示対象として0にする。

### 11.6 Step V5: full backend

```bash
python -m pytest -q
```

合格:

```text
return code 0
failed = 0
errors = 0
new unclassified failure = 0
```

full backendが環境上完了しない場合、split matrixを自動代替にしない。`GATE0_TEST_OR_CONTRACT_BLOCKED_STOPPED`で停止し、環境または実行方法を別途閉じる。

### 11.7 validation順序を変えない理由

- targetedで局所原因を早く特定する。
- safety / publicで商品境界の破壊を先に止める。
- RNでvisible contractを確認する。
- full collectで全test import可能性を確認する。
- full backendで局所greenの外側を確認する。

full collect前にfull backendへ進んでも、collection blockerで実行集合が欠ける。したがって順序を固定する。

---

## 12. 同じ16件の再生成と華恋実読

### 12.1 case set

```text
Known:
  A
  B
  C
  D

Short:
  I6-S01
  I6-S02
  I6-S03

Long:
  I6-L01
  I6-L02
  I6-L03

Comparative:
  I6-C01
  I6-C02
  I6-C03

Self-denial:
  I6-D01
  I6-D02
  I6-D03
```

case sourceは現行helperを正本とする。入力を手修正しない。

### 12.2 生成条件

```text
subscription tier: free
history: none
context: none
canonical generation path
same source snapshot fingerprint
same case input hashes
first / second deterministic rerun
```

### 12.3 automated candidateとactual readを分ける

#### automated

- empty / overlong
- too many lines
- question substitution
- internal taxonomy leak
- unresolved evidence
- duplicate exact line
- canonical path / composer
- semantic Gate

#### 華恋actual read

各16件を実際に読み、次を記録する。

```text
required_nucleus_retained
required_relation_direction
lexical_fidelity
whole_input_balance
human_follow_fit
natural_japanese
non_template_readfeel
safety_boundary
wants_more_input_candidate
fatal_reason_refs
verdict
```

### 12.4 9件の必須確認

| case | 必須確認 |
|---|---|
| A | 同一anchorの無目的再掲なし。同型opening反復なし |
| B | 疑問・引用・従属節が自然な一単位として読める |
| C | intentionを変化として処理していない |
| I6-L01 | 負荷と前進を、暫定失敗評価の反転文法へ押し込んでいない。intention role一致 |
| I6-L02 | follow対象が本人の次意図へ接続している |
| I6-L03 | 述語重複なし。暫定評価と発見の反転が自然。intention role一致 |
| I6-C01 | 比較自己評価と具体的改善の関係が自然。intention role一致 |
| I6-C02 | contrastを壊さず、intention role一致 |
| I6-C03 | 比較自己評価と具体的改善の関係が自然。intention role一致 |

### 12.5 既存7件の回帰確認

現在passしている次も必ず読み直す。

```text
D
I6-S01
I6-S02
I6-S03
I6-D01
I6-D02
I6-D03
```

9件だけを見て、既存7件のfollow / safety / lexical qualityを壊していないかを確認する。

### 12.6 receipt

新しいreceiptは過去R8を上書きしない。

短い候補名:

```text
gate0_rr8_review_20260711.json
```

body-freeで、source fingerprint、case input hash、body hash、axis判定、reason refだけを入れる。本文はlocal-only比較へ置く。

### 12.7 合格条件

```text
actual review count = 16
local human pass = 16
repair required = 0
hard fatal = 0
deterministic = 16 / 16
validation fingerprint一致
```

一件でも不合格なら、該当ownerへ戻る。codeを変更した場合、V1からV5のvalidation evidenceをすべて再生成する。

---

## 13. exact 8 packet

### 13.1 生成条件

次をすべて満たした場合だけ生成する。

```text
Gate0 decision schema v2
GATE0_LOCAL_PASS_DEVICE_PACKET_READY_STOPPED
16 / 16 local human pass
validation all pass
full collect true
collection error 0
full backend true
source / review / validation fingerprint一致
```

### 13.2 exact 8

```text
A
B
C
D
I6-S03
I6-L03
I6-C01
I6-D02
```

### 13.3 packet schema案

```json
{
  "schema_version": "cocolon.emlis.gate0.exact8_device_packet.v2",
  "source_snapshot_fingerprint": "64hex",
  "gate0_decision_sha256": "64hex",
  "review_receipt_sha256": "64hex",
  "validation_evidence_sha256": "64hex",
  "packet_status": "ready_waiting_for_device_evidence",
  "case_order": [
    "A", "B", "C", "D", "I6-S03", "I6-L03", "I6-C01", "I6-D02"
  ],
  "required_meta_fields": [
    "generation_path",
    "composer_source",
    "semantic_quality_gate",
    "public_reply_path_connected"
  ],
  "arbitrary_input_allowed": false,
  "screenshot_local_only": true,
  "cases": [
    {
      "case_id": "A",
      "exact_current_input": {},
      "current_input_sha256": "64hex",
      "local_comment_sha256": "64hex"
    }
  ],
  "p5_formal_24_started_here": false,
  "p6_started_here": false,
  "p8_started_here": false
}
```

### 13.4 停止

packet生成後は次で停止する。

```text
GATE0_LOCAL_PASS_DEVICE_PACKET_READY_STOPPED
```

この時点で初めてMash様へ、exact 8の実機入力と最小証拠を依頼する。

任意入力をMash様へ考えていただかない。exact 8合格前にP5、P6、P8へ進まない。

---

## 14. 実装順

既存R0〜R10と混同しないよう、本修復周期は`RR0`〜`RR10`と呼ぶ。

## RR0: current freeze

**変更**

- production変更なし
- source / case / reason / blockerをfreeze

**成果**

- body-free freeze
- local-only body baseline

**完了**

- current 9、16 input hash、2 collection blocker固定

**停止**

- 受領zipと展開treeが一致しない
- current receiptと実生成hashが一致しない

---

## RR1: structural RED

**変更**

- testのみ

**追加・強化**

- intention role
- follow target
- relation surface role
- duplicate anchor / repeated opening
- dependent clause unit
- Gate0 validation contract

**完了**

- 現行コードで狙ったRED
- exact body assert 0

---

## RR2: Plan側follow role / target修復

**主owner**

```text
emlis_ai_grounded_observation_plan.py
  classify_grounded_human_follow_role
  _build_response_and_policies
```

**変更**

- 共通role classifier
- role-first candidate selection
- normal / self-denial priority分離
- semantic version更新

**完了**

- C / L01 / L02 / L03 / C01 / C02 / C03 role / target test green
- D / D01〜D03回帰なし

**停止**

- persistent schema field追加が必要
- case固有scoreが必要

---

## RR3: SentencePlan line構造修復

**主owner**

```text
emlis_ai_grounded_sentence_surface.py
  expected_human_follow_role
  _build_regular_lines
```

**変更**

- shared classifier利用
- follow delivery mode
- homogeneous state grouping
- duplicate anchor prevention
- relation surface role atom

**完了**

- A structural test green
- short-state / self-denial回帰なし

**停止**

- required nucleusを削らないと行数を保てない

---

## RR4: relation grammar修復

**主owner**

```text
emlis_ai_grounded_sentence_surface.py
  _render_relation
```

**変更**

- relation surface role判定
- endpoint surface form
- complete clause predicate safety
- fallback bounded contrast

**完了**

- L01 / L03 / C01 / C03 relation test green
- L03 predicate duplication test green
- relation endpoint / direction回帰なし

**停止**

- completed sentence bankが必要
- relation type自体をcase専用で書き換えようとしている

---

## RR5: human follow / clause surface修復

**主owner**

```text
emlis_ai_grounded_sentence_surface.py
  _render_human_follow

必要性がREDで確認された場合のみ:
  _quotes_for_nuclei
  _surface_fragment_for_nucleus
  _render_observation
```

**変更**

- intentionをchangeと呼ばない
- integrated followは別行を出さない
- Bのdependent clause unit

**完了**

- C / L01 / L03 / C01 / C02 / C03 follow surface test green
- B clause test green
- A body structure test green

---

## RR6: Gate 0 decision contract v2

**主owner**

```text
emlis_ai_gate0_r9_r10_boundary.py
generate_emlis_ai_gate0_r8_r9_artifacts.py
```

**変更**

- Gate0ValidationEvidence
- full collect / collection errors / full backend明示入力
- hard-coded green削除
- source fingerprint照合
- v2 decision
- exact8 builder v2 check

**完了**

- old signature caller 0
- validationなしでpass生成不可
- collect errorありでpass生成不可
- full backend未実施でpass生成不可

---

## RR7: obsolete test import移管

**主owner**

```text
test_emlis_ai_bounded_repair_reroute_step7.py
test_emlis_ai_complete_initial_surface_recomposition_existing_gate_chain_p8.py
I0 inventory
```

**変更**

- missing private imports削除
- current canonical ownerへassert移管
- production private helper復活なし
- final fingerprint更新

**完了**

- 対象2 test collect成功
- legacy substantive reachability 0

---

## RR8: validation V1 → V5

**順序**

```text
targeted
→ safety / public contract
→ RN
→ full collect
→ full backend
```

**成果**

- body-free validation evidence v2

**完了**

- 全step green
- collection error 0
- full backend green
- fingerprint一致

**停止**

- どれか一つでも不合格
- source変更

---

## RR9: same 16 regeneration / Karen actual read

**変更**

- production変更なし
- 16件を再生成・実読

**成果**

- local-only body comparison
- body-free review receipt

**完了**

- 16 / 16 local human pass
- repair 0
- fatal 0

**停止**

- 1件でも不合格

不合格でcode修正へ戻った場合、RR8 evidenceは無効となり、再度RR8から実行する。

---

## RR10: Gate 0 decision / exact 8

**変更**

- v2 R9 decision生成
- pass時だけexact 8 packet生成

**完了**

```text
GATE0_LOCAL_PASS_DEVICE_PACKET_READY_STOPPED
```

**停止**

- packetを生成してMash様の実機証拠待ち
- P5 / P6 / P8へ進まない

---

## 15. 実装依存関係

```text
RR0
 ↓
RR1
 ↓
RR2 ── follow role / target
 ↓
RR3 ── line structure / delivery
 ↓
RR4 ── relation grammar
 ↓
RR5 ── follow surface / clause unit
 ↓
RR6 ── Gate decision contract
 ↓
RR7 ── old test imports / inventory
 ↓
RR8 ── all validation
 ↓
RR9 ── same 16 actual read
 ↓
RR10 ─ exact 8 / stop
```

RR2〜RR5の途中でproductionを変更するたび、RR1 targeted testを実行する。ただし正式なvalidation evidenceはproduction変更が終わったRR8でのみ生成する。

---

## 16. 変更影響マトリクス

| ファイル | 必要な変更 | 変更しないもの |
|---|---|---|
| `emlis_ai_grounded_observation_plan.py` | common follow classifier、role-first target、semantic version | plan schema shape、question policy、Safety owner |
| `emlis_ai_grounded_sentence_surface.py` | role priority、delivery mode、relation role、predicate-safe grammar、dependent clause | completed body bank、random paraphrase、public response key |
| `emlis_ai_grounded_observation_gate.py` | 原則変更なし。role compatibilityの明白な穴だけ最小候補 | human readの自動判定 |
| `emlis_ai_reply_service.py` | 原則変更なし | 旧private helper、旧substantive route |
| `emlis_ai_gate0_r9_r10_boundary.py` | validation evidence v2、decision v2、exact8 guard | P5 / P6 / P8許可 |
| `generate_emlis_ai_gate0_r8_r9_artifacts.py` | hard-coded green削除、evidence入力 | 手書きpass |
| old 2 tests | current canonical ownerへ移管 | production helper復活 |
| I0 inventory | final source hash / owner graph | legacy route owner化 |
| RN source | 変更なし | modal / screen contract |
| DB / API | 変更なし | schema / endpoint |

---

## 17. rollback単位

```text
C0  RR0 freeze + RR1 tests
C1  Plan follow classifier / target
C2  SentencePlan delivery / grouping
C3  Relation grammar / endpoint form
C4  Human follow / dependent clause
C5  Gate0 validation contract / generator
C6  Old test import alignment / I0
C7  Evidence artifacts only
```

rollback条件:

- required nucleus / relation / lexical fidelity後退
- canonical path変更
- deterministic loss
- safety boundary後退
- public meta leak
- API / DB / RN production差分
- case固有branch
- exact body bank
- legacy substantive route復活

rollbackは同じGrounded経路内の直前commitへ戻す。旧routeをfeature flagで復活させない。

---

## 18. Gate 0 decision table

| automated | Karen 16 / 16 | collect 0 error | full backend | decision | exact 8 |
|---|---:|---:|---:|---|---:|
| pass | no | no | no | `GATE0_REPAIR_RETURN_STOPPED` + validation blockers | no |
| pass | no | yes | yes | `GATE0_REPAIR_RETURN_STOPPED` | no |
| pass | yes | no | no | `GATE0_TEST_OR_CONTRACT_BLOCKED_STOPPED` | no |
| pass | yes | yes | no | `GATE0_TEST_OR_CONTRACT_BLOCKED_STOPPED` | no |
| pass | yes | yes | yes | `GATE0_LOCAL_PASS_DEVICE_PACKET_READY_STOPPED` | yes |

部分合格を作らない。

---

## 19. 8項目とのtraceability

| 指定項目 | 本書 | 実装step | 完了証拠 |
|---|---|---|---|
| 1. 現行9件とfingerprint freeze | Section 6 | RR0 | body-free freeze、hash一致 |
| 2. 構造testを先行 | Section 7 | RR1 | intention / target / reversal / duplicate anchor RED→GREEN |
| 3. 一般semantic grammar修復 | Section 8 | RR2〜RR5 | role / line / relation / follow tests |
| 4. Gate 0判定契約閉包 | Section 9 | RR6 | full collect / error / full backend明示入力 |
| 5. 旧test import整合 | Section 10 | RR7 | 2 test collect成功、prod helper復活0 |
| 6. 検証順 | Section 11 | RR8 | validation evidence v2 |
| 7. 同じ16件を再生成・全件実読 | Section 12 | RR9 | 16 / 16 local human pass |
| 8. pass時だけexact 8 | Section 13 | RR10 | exact8 packet v2、停止 |

---

## 20. 実装前チェックリスト

### freeze

- [ ] mashos-api archive hash再確認
- [ ] owner hashes再計算
- [ ] source snapshot fingerprint生成
- [ ] 16 input hashes固定
- [ ] 9 reason refs固定
- [ ] 2 collection blockers固定
- [ ] old R8 / R9を上書きしない

### tests

- [ ] intention role RED
- [ ] L02 target RED
- [ ] relation surface role RED
- [ ] L03 complete-clause predicate RED
- [ ] A duplicate anchor RED
- [ ] A repeated opening RED
- [ ] B dependent clause RED
- [ ] Gate contract missing collect evidence RED
- [ ] old two test collection RED
- [ ] exact body assert 0

### production

- [ ] common classifier owner一つ
- [ ] intention before valued change
- [ ] normal / self-denial priority分離
- [ ] follow delivery integrated / separate
- [ ] relation surface role atom
- [ ] complete clause predicate-safe
- [ ] no case cue
- [ ] no body bank
- [ ] no random paraphrase
- [ ] semantic version更新

### Gate contract

- [ ] hard-coded green削除
- [ ] full collect explicit
- [ ] collection errors explicit
- [ ] full backend explicit
- [ ] snapshot equality explicit
- [ ] v2 decision
- [ ] exact8 v2 guard

### validation

- [ ] targeted
- [ ] safety / public
- [ ] RN
- [ ] full collect
- [ ] full backend
- [ ] unclassified failure 0

### actual read

- [ ] same 16
- [ ] deterministic 16 / 16
- [ ] existing 7 regressionなし
- [ ] repair 9解消
- [ ] local human pass 16 / 16

### exit

- [ ] exact 8 helper-generated
- [ ] arbitrary input false
- [ ] P5 false
- [ ] P6 false
- [ ] P8 false
- [ ] device evidence待ちで停止

---

## 21. 本設計時点で未確認のもの

- 修復後の最終日本語
- 修復後のtest件数
- 修復後full collectの収集件数
- 修復後full backendの実行時間と件数
- 16件の最終human verdict
- 実機deployment一致
- 実機modalの見切れ・圧迫・改行

これらを設計時点でpass扱いしない。

---

## 22. 本設計だけでは行わないこと

- production code変更
- test変更
- JSON artifact生成
- schema constant変更
- source fingerprint更新
- R8 / R9再生成
- exact 8生成
- Mash様への実機依頼
- P5 / P6 / P8開始

実装指示を受けた場合、RR0から開始する。最初のproduction変更はRR1のRED確認後とする。

---

## 23. 最終判定

```text
DESIGN_STATUS = READY
IMPLEMENTATION_STATUS = NOT_STARTED
CURRENT_GATE0 = GATE0_REPAIR_RETURN_STOPPED
CURRENT_P8 = NO_GO
FIRST_IMPLEMENTATION_STEP = RR0_CURRENT_FREEZE
FIRST_CODE_STEP = RR1_STRUCTURAL_RED_THEN_RR2_PLAN_REPAIR
USER_DEVICE_ACTION_NOW = NONE
DEVICE_REQUEST_POINT = RR10_EXACT8_PACKET_READY
```

本設計の終了地点は、問いシステムの実装開始ではない。

```text
16 / 16 local human pass
+ validation all pass
+ exact 8 packet generated
+ stop
```

ここまで到達した時点でのみ、Mash様へ実機確認を依頼する。
