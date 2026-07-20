# NLS v3 Step 11 rc0031 — P0 / P1 Freeze Ledger

作成日: 2026-07-20 JST  
作成者: 華恋  
対象工程: `Step 11 / Cycle 001 / rc0031 P0-P1`  
文書状態: `P1 EXACT7 SEMANTIC RED FROZEN / BODY-FREE`

## 0. 結論

- predecessor: `MassyuRed/mashos-api@25b98ec8b59eaff717d1dc3261ff21156ccce7ed`
- Revised Cycle詳細設計: SHA-256 `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc`一致
- P0 predecessor / evidence / exact4 freeze: `COMPLETE`
- P1 collection: `7 / 7 COLLECTED`
- P1 execution: `1 PASS / 6 INTENTIONAL SEMANTIC RED`
- collection error / error / skip / xfail: `0 / 0 / 0 / 0`
- production source change: `0`
- repository delta: 新規`2 path`のみ
- P2: `NOT_STARTED / REQUIRES EXPLICIT NEXT AUTHORITY`
- E4: `NOT_STARTED / §14承認の対象外`
- Cycle 001: `NOT_ACCEPTED`

今回の§14承認で安全に実行できる初回範囲は、P0確認後にP1 exact7 REDとnew pending attack exact24を固定するところまでである。P2のproduction sourceへは進んでいない。

## 1. 確認した事実

### 1.1 predecessorと正本

1. ローカルcheckoutはGitHub predecessor `25b98ec8b59eaff717d1dc3261ff21156ccce7ed`と一致した。
2. 今回添付されたRevised Cycle詳細設計は、指定SHA-256 `6aa3fb79...3bc`と完全一致した。
3. rc0030 source dependency closureは`be45dc1c8a34a231c0726fe1570c24e873f55e93b338e614b912112f1c201fbb`である。
4. rc0030 E3 machine receiptは`56fad0a7...6f7c`、Product Read STOP receiptは`608a1c73...7f95`である。
5. rc0030はmachine `8 / 8 selected`だが、Product Readは`PASS 1 / MINOR 1 / MAJOR 6 / BLOCKER 0`のSTOP evidenceである。

### 1.2 exact4 prefix

P1開始前後で、次のprefixは`4 / 4`一致した。

| owner | frozen bytes | frozen SHA-256 |
|---|---:|---|
| `emlis_ai_step11_grounded_lexicalization_v3.py` | 129,615 | `592f3ab7...cc28` |
| `emlis_ai_step11_natural_surface_v3.py` | 360,675 | `5f548499...8eaf` |
| `emlis_ai_step11_natural_surface_matcher_v3.py` | 722,658 | `648a3a66...2e30` |
| `emlis_ai_step11_hard_gate_v3.py` | 208,041 | `88514bb2...43b` |

既存行の編集、挿入、削除、rename、shadow definitionは0である。

### 1.3 repository delta

新規2 pathだけである。

| path | SHA-256 | bytes / lines | 根拠・必要性 |
|---|---|---:|---|
| `ai/tests/fixtures/emlis_nls_v3/cycle_001/rc0031_representative8_body_free.json` | `15e8047c...78a8` | 19,889 / 279 | predecessor、代表8、control、resource、既存53＋new24攻撃を本文なしで固定する |
| `ai/tests/test_emlis_nls_v3_s11_rc0031_proposition_surface_red.py` | `18f4f28a...0454` | 24,000 / 623 | 現行rc0030 selected bytesを実行し、6 concernを閉じたcodeで再現する |

production service、catalog、runtime、manifest、tool、exact4への追記は行っていない。後続phase用16 pathも作成していない。

### 1.4 P1 exact7

| index | concern | result | closed code |
|---:|---|---|---|
| 1 | predecessor / source / evidence / path / attack / resource freeze | PASS | — |
| 2 | source-root / main meaning dominance | intentional RED | `STEP11_RC0031_SOURCE_ROOT_DOMINANCE_NOT_PROVED` |
| 3 | schema-free proposition realization | intentional RED | `STEP11_RC0031_SCHEMA_FREE_PROPOSITION_NOT_PROVED` |
| 4 | relation endpoint / direction / legibility | intentional RED | `STEP11_RC0031_RELATION_PROPOSITION_NOT_PROVED` |
| 5 | semantic chunk distribution / depth | intentional RED | `STEP11_RC0031_DISTRIBUTION_DEPTH_NOT_PROVED` |
| 6 | grounded Reception target / support / act predication | intentional RED | `STEP11_RC0031_GROUNDED_RECEPTION_PREDICATION_NOT_PROVED` |
| 7 | control / retained improvement non-regression | intentional RED | `STEP11_RC0031_CONTROL_RETAINED_NON_REGRESSION_NOT_PROVED` |

実行結果:

```text
7 tests collected
1 passed, 6 intentionally failed, 1 warning in 88.41s
errors 0 / skipped 0 / xfailed 0
```

REDはrc0031 moduleの未存在、import error、常時fail mock、`skip`、`xfail`、fixture severity変更によるものではない。rc0030 private experimentを実行し、selected final bytesとbody-free独立証拠から再現した。

warning 1件は既存`api_emotion_submit.py`のPydantic V1 `root_validator` deprecationであり、P1差分によるものではない。

### 1.5 attack freeze

- immutable rc0030 fixtureで継承したnamed attack: `33 + 20 = 53`
- rc0031 new pending attack: `6 family × 4 = 24`
- 合計named denominator minimum: `77`
- new24のP1実行済み件数: `0`
- new24のexecutor phase: `P5`
- 既存attackの置換・減算: 禁止

new24は各attackについて、`attack_id / family / consumer_layer / expected_closed_code / executor_phase / executed=false`まで固定した。単なる名前や件数だけではない。

| family | exact4 |
|---|---|
| root | drop / displacement / duplicate / structure-only substitution |
| schema | taxonomy noun / role label / ordinal-record marker / generic-pack predicate |
| relation | endpoint swap / direction reverse / type mutation / taxonomy nominalization |
| distribution | wrong group / tail concentration / reorder-or-duplicate / budget bypass-or-drop |
| Reception | target swap / support omission / act-or-scope swap / generic unbound |
| boundary | case-family-control branch / control fixture-severity mutation / P3 metadata-hidden-marker bypass / resource expansion |

### 1.6 control / retained improvement

| case | baseline | current rc0030 | rc0031 acceptance |
|---|---|---|---|
| `0001` | PASS | MINOR | PASS |
| `0002` | PASS | PASS | PASS |
| `0009` | MINOR | MAJOR | PASS / MINOR |

さらに、0001 unknown exactly-once、0063 self-denial non-promotion、opaque ordinal / repetitive exposition 0、0035・0043・0100の解消済みunknown drop / partial再発0をretained contractへ固定した。

canonical Product Read evidence上の`EMLIS_RECEPTION_UNBOUND`は、`0019 / 0035 / 0043 / 0063 / 0100`の5件である。

### 1.7 P0 regressionの扱い

current-valid contractを対象にしたfocused実行は、`12 passed / 1 historical stage-lock deselected`だった。

全13件をfilterなしで実行すると、後続phase追記前のP4 full-file bytesを固定するhistorical testが1件失敗する。この事実は隠していない。現行manifest、current prefix、current behaviorのdriftではなく、後続の承認済みappend後に古いphase全体hashを要求する履歴lockである。current-valid suiteはGREENである。

## 2. 推測

1. 6件のREDが同じ現行Surfaceから再現したため、問題は単独caseの言い換えではなく、root proposition、taxonomy nominalization、tail pack、Reception再構成にまたがる共通realization topologyにある可能性が高い。
2. 既存authorityにはleading Observation、relation endpoint / direction / type、Reception target / support / actがあるため、P2はconditional exact4 maximum内で成立する見込みがある。
3. ただし、これはP2実装完了やProduct Read改善を意味しない。自然な主意味dominanceはE3 Product Readまで確定できない。

## 3. 華恋の意見

P1は正しくREDで止められた。production sourceを触る前に、失敗の意味、既存53＋new24の攻撃分母、control baseline、resource、path scopeを固定できている。

次に進む場合は、このfixtureとtestをbyte-for-byte不変にして正式predecessorへ反映した後、P2だけを別途承認するのが正しい。P2ではrc0030 final bytesを文字列修復せず、immutable rc0027 base authorityとE1b / rc0028 typed authorityからrc0031 Proposition Surfaceを構成する必要がある。

既存authority外owner、exact4 / exact18外path、resource拡張、case / family / control branch、P3迂回が必要なら、GREENを作るのではなくSTOPして影響範囲を提示する。

## 4. 根拠と必要性

| action | 根拠 | 必要性 |
|---|---|---|
| predecessorと詳細設計hash固定 | §14の開始条件 | 別版・別commitでの誤実装を防ぐ |
| P1でproduction source変更0 | 補遺§8 / §14 | 実装に合わせてREDを作る逆転を防ぐ |
| exact7を1 PASS / 6 REDで固定 | rc0030 E3 Product Read MAJOR6 | 修復対象を意味単位で閉じる |
| new24にconsumer/codeを付与 | rc0030 pending attackの証拠債務 | P5で実攻撃へ一意接続する |
| current-validとhistorical lockを分離 | 後続phaseのappend-only履歴 | 古い全体hashと現行closureを混同しない |
| P2前STOP | §14の初回authority境界 | phase順序とimmutable predecessorを守る |

## 5. 現在の境界

許可する表記:

- `rc0031 P0 complete`
- `rc0031 P1 exact7 semantic RED frozen`
- `production source unchanged in P1`
- `STOP_BEFORE_P2`

許可しない表記:

- `rc0031 implementation GREEN / accepted`
- `P2以降 started / complete`
- `E3 / E4 passed`
- `Cycle 001 accepted / completed`
- `Step 11 completed`
- `production ready`
