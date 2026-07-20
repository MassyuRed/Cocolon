# Cocolon / EmlisAI P7 Gate A
# Post-FB172 current-input基盤閉包 詳細設計書・実装順

- 作成日: 2026-07-11 JST
- 文書種別: 詳細設計書 / 実装順 / 検証・停止契約
- 設計状態: **DESIGN READY / IMPLEMENTATION NOT STARTED**
- 対象: P7内のGate A current-input基盤閉包
- 非対象: P8問いシステム実装、P5、P6、実機入力、API / DB / RN production変更
- 親判断書: `Cocolon_EmlisAI_P7_to_P8_QuestionSystem_EntryConditions_20260711.md`
- 現在のP8判定: **NO_GO**
- 現行runtime Gate名: `Gate 0`
- 本書での`Gate A`: P7→P8判断上、既存Gate 0 local closureを包む段階名
- コード変更: なし
- JSON / schema実ファイル作成: なし
- Mash様へ現時点でお願いする実機作業: なし

> 受領物内には`2026-07-12`を含む履歴ラベルがある。本書では、それらを受領ファイル内の識別子として参照し、2026-07-11時点で未来の実施事実を新たに断定する根拠にはしない。

---

## 0. 結論

次のローカル実装はP8ではなく、**Gate Aのcurrent-input基盤を閉じる一つの実装単位**として行う。

```text
GA0  current snapshot / 169 failure set / read-only読感弱さをfreeze
GA1  一般修復を証明するstructural REDを追加
GA2  B / C / long / D系のPlan・SentencePlan・Surface・Gateを一般修復
GA3  targeted / semantic / safety / public contract / RN確認
GA4  full collect 0 error確認
GA5  full backendのbaseline 169件と新規failureをcurrent owner別に全閉包
GA6  最終fingerprintでsame16をofficial再生成し、16 / 16 deterministic確認
GA7  華恋が同じ16件を全件実読
GA8  16 / 16 local human pass時だけexact8 packetを生成
GA9  停止し、Mash様へ最小の実機確認を依頼
```

本書は、既存の次の3設計を無効化する別系統ではない。

- `Cocolon_EmlisAI_P7_Gate0_CurrentInput_SemanticRetention_ReadfeelRepair_DetailedDesign_ImplementationOrder_20260711.md`
- `Cocolon_EmlisAI_P7_Gate0_ReadfeelRepair_GateContractClosure_DetailedDesign_ImplementationOrder_20260711.md`
- `Cocolon_EmlisAI_P7_Gate0_FB172_FailureClosure_Design_20260711.md`

これらの履歴・contract・既存artifactを保持したまま、**FB172閉包後の現在地から実際に進める単一の実装順**へ統合する実行設計である。

本書の出口はP8開始ではない。既存decision schemaを増やさず、出口は次のいずれかだけとする。Safety / public contract影響やbaseline failure set不一致は、`GATE0_TEST_OR_CONTRACT_BLOCKED_STOPPED`のblocker refとして表す。

```text
GATE0_LOCAL_PASS_DEVICE_PACKET_READY_STOPPED
GATE0_REPAIR_RETURN_STOPPED
GATE0_TEST_OR_CONTRACT_BLOCKED_STOPPED
```

---

## 1. 最終目的・今回得る情報・完了条件・停止条件

### 1.1 Cocolon完成への接続

Cocolonの完成には、ユーザーが書いた現在入力を、問い・履歴・別機能で補う前に、EmlisAIが入力内の核、関係、反転、不明領域、意図、行動、安全境界を雑に潰さず観測できることが必要である。

今回のGate A閉包は、次を証明するために行う。

```text
既に入力内にある意味を、EmlisAI本体が読み落とさず、
不自然な反復や汎用tailで処理済みにせず、
安全境界とpublic contractを壊さず、
同じcurrent-input canonical pathから商品本文として返せる。
```

この基盤が成立しない状態でP8問いシステムへ進むと、Emlis本体の不足をユーザーへの追加質問で埋める構造になるため、P8実装は行わない。

### 1.2 今回新たに確定する情報

実装・検証により、少なくとも次を確定する。

1. 現行受領snapshotと、実装前169 failure node集合の同一性。
2. B / C / long / D系の読感弱さが、case専用条件ではなく一般的な意味構造修復で閉じるか。
3. required nucleus、required relation、human followが同じ意味を無目的に重複表示せず、別々の役割を持てるか。
4. `同じ記録にあります`等のsurface stemやgeneric tailが、入力固有の意味差を潰していないか。
5. self-denialで、事実境界、反対方向、help-seekingを重複せず安全に残せるか。
6. short-stateを過剰に膨らませず、語義保持と商品読感を両立できるか。
7. targeted / semantic / safety / public / RN / collect / full backendが同一最終fingerprintで成立するか。
8. same16を華恋が全件読み、16 / 16を実機へ渡せるか。
9. 実機でしか取得できない情報へ到達した正確な停止時点。

### 1.3 Gate A完了条件

次をすべて満たした場合だけ、Gate A local passとする。

```text
[経路]
- canonical generation pathは一系統。
- composer_sourceはgrounded_plan_realizer。
- legacy substantive routeからpublic本文を供給しない。
- question_policy.allowedはfalse。
- case専用mode / cue / surface / completed sentence bankは0。

[意味・読感]
- same16 automated candidate 16 / 16。
- same16 first / second run deterministic 16 / 16。
- 華恋actual local review 16 / 16 pass。
- repair_required 0。
- hard_fatal 0。
- required nucleus欠落0。
- required relation方向誤り0。
- lexical fidelity failure 0。
- human follow target / role / contribution不一致0。
- 無目的な意味重複0。
- 機械的surface stem反復による商品読感不良0。
- generic tailの役割不一致・過剰反復0。

[テスト・契約]
- targeted / semantic green。
- Safety / public contract green。
- RN screen contract green。
- full collect return code 0 / collection error 0。
- full backend return code 0 / failed 0 / errors 0。
- unclassified failure 0。
- new skip / xfail 0。
- final source / validation / review fingerprint一致。

[境界]
- API top-level response key差分0。
- DB physical name / schema / write path差分0。
- RN production source差分0。
- raw input / returned body / comment textのpublic meta混入0。
- Safety owner後退0。
- P5 / P6 / P8開始false。
```

既存skipがある場合は、baselineでrefを固定し、Gate A関連ownerではないこと、新規追加されていないこと、同じref集合または減少であることを証明する。skip件数だけでgreen扱いしない。

### 1.4 停止条件

次のいずれかが発生したら、その時点で止める。

- 実装前のofficial 169 failure集合を同一環境で再現できず、差分理由を説明できない。
- 読感修復にcase ID、fixture語彙、exact本文、入力例専用branchが必要になる。
- required意味を落として本文を短くしようとしている。
- relation方向が不明なのに因果・変化を断定しようとしている。
- Safety owner、public response、DB、RN production変更が必要になる。
- old private helperまたはretired substantive routeを復活させる必要があるように見える。
- failureを削除、skip、xfail、期待値緩和だけで閉じようとしている。
- source変更後にtargeted / collect / full backend証拠を再生成していない。
- 16件のうち1件でもrepair_requiredまたはhard_fatalが残る。
- exact8以降、実機でしか得られないvisible body / modal layout情報が次工程の前提になった。

停止時は、周辺資料・別Gate・P8設計を追加して進捗に見せない。止まったowner、欠けた証拠、次に必要な一作業だけを明示する。

### 1.5 Mash様の作業境界

Gate A local passまでは、Mash様へ任意入力、ログ、スクリーンショット、ケース選定をお願いしない。

`GATE0_LOCAL_PASS_DEVICE_PACKET_READY_STOPPED`になった後だけ、helperが生成したexact8をそのまま実機へ入力し、visible Emlis本文とmodal screenshotを返していただく。generation metaやserver側証拠は、華恋側で取得可能なものを先に取得し、同じ情報をMash様へ重複要求しない。

---

## 2. 参照正本と優先順位

### 2.1 華恋の行動判断

- GitHub `MassyuRed/Karen-Diary`
  - `00_READ_FIRST.md`
  - `memory/karen_operating_principles.md`
  - `memory/mash_and_karen.md`
  - 必要箇所として`diary/2026-07.md`

Karen-DiaryはCocolon仕様正本ではない。最終目的、必要情報、完了条件、停止条件、実機確認の必要時点、事実・推測・意見の分離を失わないために参照した。

### 2.2 Cocolon作業正本

- `Cocolon_前提資料/00_karen_read_first.md`
- `work_attitude_rules_for_karen/00_read_first.txt`
- `03_forbidden_insufficient_premise_and_actual_file_check.txt`
- `04_forbidden_mixing_design_and_implementation.txt`
- `05_forbidden_unrequested_completion_and_structure_addition.txt`
- `07_forbidden_shifting_burden_to_user.txt`
- `08_artifact_delivery_rules.txt`
- `09_work_start_checklist.txt`
- `10_stop_judgment_and_unwritten_rules.txt`
- `11_cocolon_area_specific_do_not_break.txt`
- `13_forbidden_reasking_existing_design_and_design_term_escape.txt`
- `14_cocolon_joint_development_and_karen_thought_boundary.txt`
- `15_trust_based_joint_development_boundary_2026_06_05.txt`

### 2.3 Phase・設計正本

- 最新長期ロードマップ
- `Cocolon_EmlisAI_P7_to_P8_QuestionSystem_EntryConditions_20260711.md`
- 前述のGate 0 current-input / readfeel / FB172設計3件
- EmlisAI correction policy、state answer / human follow、Grounded core repair、P7 Product QA再接続資料

### 2.4 現在実装の正本

- `mashos-api(213).zip`
- `Cocolon(291).zip`
- 現行backend source / tests / fixtures / helpers
- 現行RN screen contract
- 現行same16 read-only生成結果
- Cocolon前提資料の最新manifest

### 2.5 優先順位

```text
Phase境界・開始許可:
  承認済みロードマップと最新判断書。

現在何が動くか:
  最新受領実ファイルと同一snapshotの実行結果。

本文が商品として成立するか:
  自動Gateだけでなく華恋のactual local read。

Karen-Diary:
  華恋の行動・停止判断に使い、Cocolon仕様を直接上書きしない。
```

---

## 3. 確認済み・未確認・書かれていない・推測・華恋の意見

### 3.1 確認済みの事実

1. FB172のhistorical frozen 172 nodeは、受領物内で`172 passed`として閉じている。
2. その後のfull backendは、前提資料上`12543 passed / 169 failed / 2 skipped`であり、full backend greenではない。
3. full collectは`12714 collected / 0 errors`である。
4. 現在の停止codeは`GATE0_TEST_OR_CONTRACT_BLOCKED_STOPPED`である。
5. post-FB172 same16 official regeneration、華恋actual read、exact8、実機、P5、P6、P8は未開始である。
6. historical 172件のowner ledgerはunclassified 0 / current owner missing 0で閉じている。現在の169件は、その172件から3件だけ残ったものではなく、full suite全体に別に残るfailure集合である。
7. 現行canonical ownerは、Evidence Ledger → GroundedObservationPlan → GroundedSentencePlan / Surface → Grounded Observation Gate → ReplyEnvelopeである。
8. 現行semantic versionは`cocolon.emlis.grounded_semantics.i2.v2`である。
9. 現行validation / decision contractはbody-free v2であり、exact8 builderはGate 0 pass、全validation green、source / review / validation fingerprint一致を要求する。
10. 今回のread-only same16では、B / C / long群に機械的な`同じ記録にあります`反復とgeneric retained-intention tail、D / I6-D01等に反対方向の同義重複が見える。
11. short-state 3件は語義を保持しているが、商品として十分な厚みかはactual human review前である。
12. 現行`_apply_integrated_human_follow()`はroleに応じた固定suffixを加え、`_build_self_denial_lines()`はlimited oppositionの後に同じtargetのhuman followを別lineで追加し得る。
13. 現行Gateにはhuman follow role / target mismatchと一部semantic repetition検出があるが、同じsurface stemや、relation lineですでに届けた意味をgeneric tailが再度繰り返す商品読感まで完全には止めていない。

### 3.2 未確認

- 現行169件のexact node ID全件と現在owner分布。
- 169件を同一環境・同一fingerprintで再現できるか。
- 一般修復後に残るfailure件数。
- 修復後same16のofficial本文。
- 華恋actual read 16件の最終評価。
- exact8のdeployment path一致と実機modal読感。

これらは本設計時点で合格済みと扱わない。

### 3.3 書かれていないこと

- B / C / long / Dの承認済みexact完成本文は存在しない。
- 169件を、historical FB172 ledgerの期待値だけを書き換えて閉じてよいとは書かれていない。
- current-input読感修復のためにAPI / DB / RN productionを変更してよいとは書かれていない。
- Gate A未合格でP8へ進む例外条件は書かれていない。
- short-stateを必ず複数文へ膨らませる仕様は書かれていない。

### 3.4 根拠付き推測

- B / C / longの不自然さは、意味抽出そのものだけでなく、relation lineを一対ずつ機械的に実現し、最後に一律suffixを足すSentencePlan / Surface責務分割の影響が大きい可能性が高い。
- D系の重複は、limited oppositionがすでにprotective counterdirectionを届けているのに、human followが同一nucleusへ別lineとして残ることが主因である可能性が高い。
- 現行169件の一部はhistorical expectationやtest owner移管不足である可能性がある。ただし全件を実行・分類する前に件数や比率を断定しない。

### 3.5 華恋の意見

今回の修復は、表現をランダムに言い換える作業ではない。

必要なのは、**一つの意味をどのlineが商品上の責任を持って届けるかを決め、relation、human follow、fact boundaryの役割重複をなくすこと**である。入力固有の関係を一つの自然なまとまりへ統合できれば、固定phrase bankを増やさずに機械的反復を減らせる。

また、short-stateは長文化を目的にしない。短くても入力語義を正確に受け取れているなら、それを守り、actual human reviewで不足が確認された場合だけ一般修復へ戻すべきである。

---

## 4. 現在地とbaseline候補

### 4.1 受領物

| artifact | SHA-256 |
|---|---|
| `Cocolon_前提資料(324).zip` | `12492919324a17eb7ee966866d9e926ba37dcd1adf7003f8a5575d7bca9c8d0a` |
| `EmlisAIの実装済み資料(123).zip` | `f0cc7d8e1eee6a1b126ea587e4568d600a4146ff3b010f926d952c9bfa8b17b2` |
| `Cocolon_EmlisAI_longterm_roadmap_20260608_P7P8_question_system_update_20260706(21).zip` | `30fc82e8c322a2026c80762dfd905115339926440a8cf4767d6c2b8da8441909` |
| `Cocolon(291).zip` | `67d4856323015dc73269403c773406072b14e7c48a50881f0a413fe494bc1f90` |
| `mashos-api(213).zip` | `5223cbcfc4c55ca885d13d025b3eb743b5e14e6428bfeeb43db7f4b7e1ccdce2` |

### 4.2 現行source snapshot候補

既存RR0 helperと同じalgorithmでread-only算出した候補値:

```text
source_snapshot_fingerprint:
394b5da7a9546d5f893e00fe27417e2e10231dcc267a2d728e6f11025d2aa0c3

source_snapshot_file_count:
1359

algorithm:
sha256(relative_path_utf8 + NUL + lowercase_file_sha256_ascii), path_sorted
```

この値は設計時の確認値であり、実装開始時にhelperから再生成して一致を確認する。一致しない場合、expected valueを現物へ合わせて書き換えず、差分を調べて停止する。

### 4.3 current same16 read-only診断候補

```text
case order:
A, B, C, D,
I6-S01, I6-S02, I6-S03,
I6-L01, I6-L02, I6-L03,
I6-C01, I6-C02, I6-C03,
I6-D01, I6-D02, I6-D03

body-free signature SHA-256:
33b2431216abb243c0fcee43dbe8dfe6bf81546c1df6e37b453d04ce449e475b
```

このread-only診断はofficial local reviewではない。GA0で現状弱さを再現するためのbaseline候補として扱う。

### 4.4 canonical contract

```text
Grounded Plan schema:
cocolon.emlis.grounded_observation_plan.v1

Grounded semantic version:
cocolon.emlis.grounded_semantics.i2.v2

Grounded Plan generation path:
grounded_observation_plan_canonical_v1

SentencePlan schema:
cocolon.emlis.grounded_sentence_plan.i3.v1

Surface schema:
cocolon.emlis.grounded_surface.i4.v1

Surface generation path:
grounded_sentence_surface_canonical_v1

public combined generation path:
grounded_observation_plan_sentence_surface_canonical_v1

composer_source:
grounded_plan_realizer

Grounded Gate schema:
cocolon.emlis.grounded_observation_gate.i5.v1

Gate validation:
cocolon.emlis.gate0.validation.bodyfree.v2

Gate local decision:
cocolon.emlis.gate0.local_decision.bodyfree.v2

exact8 packet:
cocolon.emlis.gate0.exact8_device_packet.v2
```

---

## 5. 対象範囲・非対象範囲・不変条件

### 5.1 production変更候補

優先度順:

1. `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py`
2. `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py`
3. `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py`
4. `ai/services/ai_inference/emlis_ai_reply_service.py`
   - 原則確認のみ。
   - canonical wiringまたはbody-free meta接続に実害が確認された場合だけ最小変更候補。

### 5.2 test / helper変更候補

- `ai/tests/test_emlis_ai_gate0_rr1_structural_red.py`
- `ai/tests/test_emlis_ai_gate0_rr3_rr5_surface_contract.py`
- `ai/tests/test_emlis_ai_gate0_r1_semantic_retention.py`
- `ai/tests/test_emlis_ai_gate0_r5_semantic_subchecks.py`
- `ai/tests/test_emlis_ai_gate0_r8_r10_boundary.py`
- `ai/tests/test_emlis_ai_gate0_rr6_decision_contract_v2.py`
- `ai/tests/helpers/emlis_ai_grounded_observation_i6_cases.py`
- `ai/tests/helpers/emlis_ai_grounded_observation_i7_readfeel.py`
- `ai/tests/helpers/emlis_ai_gate0_r9_r10_boundary.py`
- freeze / validation artifact generator
- residual failure owner ledgerとその整合test

新規test fileを作るか既存testへ追記するかは実装時の責務分離で判断する。既存ownerが明確なら既存testへ追加し、異なるartifact contractを混ぜる場合だけ新規file候補とする。

### 5.3 原則変更しないもの

```text
DB schema / migration / physical name / write path
API top-level response schema / response key
RN production source / navigation / modal仕様
subscription / entitlement / account / access policy
P5 / P6 visible runtime connection
P8 question runtime / persistence / UI
retired substantive route
```

### 5.4 不変条件

- case IDや入力例語彙をproduction分岐に使わない。
- fixture bodyを完成文正解にしない。
- exact本文assertを追加しない。外部固定key、schema version、reason code等のcontract文字列は別扱い。
- deterministicであること。random phrase rotationを追加しない。
- raw input、surface本文、comment textをpublic metaへ入れない。
- self-denial safe state answerとemergency Safety ownerを混同しない。
- Gate failureを無反応にしない既存縮退境界を壊さない。
- historical FB172 artifactを上書きしない。
- P8開始許可へ自動昇格しない。

---

## 6. 証拠連鎖と失効規則

### 6.1 証拠連鎖

```text
GA0 baseline freeze
  ↓ same source fingerprint
GA1 structural RED
  ↓
GA2 production repair
  ↓
GA3 targeted / safety / public / RN
  ↓
GA4 full collect
  ↓
GA5 full backend owner closure + final all-green evidence
  ↓ same final fingerprint
GA6 official same16 deterministic generation
  ↓ same final fingerprint
GA7 Karen actual local review
  ↓ same final fingerprint
GA8 Gate decision + exact8
  ↓
GA9 device handoff stop
```

### 6.2 証拠失効

次のいずれかを変更した時点で、変更前のGA3以降の証拠は失効する。

- production `.py`
- Gate A判定に使うtest / helper `.py`
- test実行に使うfixture `.json`
- pytest / dependency設定

変更後は、少なくとも次を再実行する。

```text
GA3 → GA4 → GA5 final validation → GA6 → GA7 → GA8
```

actual local review後にsourceを1 byteでも変更した場合、同じ16件を再生成・再読する。本文が変わらないように見えても、fingerprint不一致のままexact8を作らない。

### 6.3 Gate AとGate 0の関係

Gate Aはroadmap段階名であり、新しいruntime Gateを追加しない。実装上の判定ownerは既存Gate 0 helper / validation / local decisionを維持する。

Gate Aに必要なresidual failure closure linkが既存v2へ入らない場合は、既存v2を破壊的に変更せず、body-free link artifactを別に持たせる案を優先する。

---

## 7. GA0 — current source / readfeel weakness / failure set freeze

### 7.1 目的

修復前の現物を後から都合よく再定義できないようにし、次を一つのbaseline IDへ結びつける。

- archive hash
- source tree fingerprint
- canonical versions
- same16 case order / body-free signature
- read-only読感弱さ
- full collect count
- full backend failed node集合
- historical FB172 ledger参照
- environment / pytest / import mode

### 7.2 実装開始前の実行順

```text
GA0-1  受領zip SHA-256再確認
GA0-2  既存RR0 algorithmでsource fingerprint再計算
GA0-3  canonical version / generation path / composerを取得
GA0-4  same16をread-onlyで一回生成し、body-fullはlocal-onlyに保持
GA0-5  body-free case signatureとdiagnostic reason refsを生成
GA0-6  full collectを実行し12714 / 0との一致を確認
GA0-7  full backendを一回実行し、169 failed node refsを完全取得
GA0-8  node refの重複・欠落・順序を検査しfailure_set_idを確定
GA0-9  historical FB172 ledger hashとnode集合を参照登録
GA0-10 source変更前にfreezeをread-only testで固定
```

### 7.3 fingerprint対象

既存RR0と同じ対象を使う。

```text
include:
- ai/**/*.py
- ai/**/*.json
- requirements*.txt
- pytest.ini / pyproject.toml / setup.cfg / tox.iniの存在するもの

exclude:
- __pycache__
- .pytest_cache
- *.pyc
- ai/tests/local_only/**
- R8 / R9 / R10 / RR generated evidence artifacts
```

新しいfingerprint algorithmを作らない。対象追加が必要な場合は、なぜGate判定へ影響するかを示し、algorithm versionを上げる。単に現在値を一致させるため対象を増減しない。

#### 7.3.1 生成evidenceとの自己参照を作らない

source fingerprintは、実行結果そのものではなく、実行に使ったsource / test inputを識別する。

freeze、validation receipt、local review receipt、final linkのような**生成evidence**を、そこに記録された同じsource fingerprintの計算対象へ入れると自己参照になる。そのため、次を固定する。

- body-full比較artifactは既存どおり`ai/tests/local_only/**`等のfingerprint除外領域に置く。
- body-free生成evidenceも、source fingerprint対象外の既存evidence channelへ置き、artifact自体のSHA-256をfinal linkで別に固定する。
- 現行algorithmで除外されない`gatea_*.json`を、判断なく`ai/tests/fixtures/`へ作らない。
- owner ledgerをtest inputとしてfingerprint内へ置く場合、そのledger自身へ同じfinal fingerprintを埋め込まない。最終的には`final source fingerprint + ledger SHA-256`の組で識別する。
- evidence pathを新たに除外する必要がある場合は、expected hashを合わせるためにsilent変更せず、algorithm version、対象範囲、bootstrap順を設計してから変更する。

実ファイル名と配置は実装時に既存generator / testとの整合を見て決める。

### 7.4 読感弱さのfreeze

body-free reason refs候補:

```text
mechanical_relation_surface_stem_repetition
relation_line_pairwise_fragmentation
human_follow_repeats_already_delivered_target
generic_retained_intention_tail_overused
generic_tail_role_or_scope_mismatch
self_denial_counterdirection_duplicate
dependent_clause_or_quote_join_readability
short_state_depth_requires_actual_human_review
```

これらはcase IDとbody hashへ紐づけるが、public artifactへraw input / bodyを出さない。本文を読むためのlocal-only比較artifactは、実装時に必要と判断した場合だけ生成する。

### 7.5 169 failure setのfreeze

`169`をファイル名やschema名へ固定しない。修復で件数が変わっても同じlineageを維持できるよう、node ref集合hashからIDを作る。

```text
failure_set_id =
post_fb172_residual_<node_refs_sha256[0:12]>
```

baselineで169件を再現できなかった場合:

1. collect count、Python / pytest、plugin、worker、import mode、cwdを比較する。
2. missing / extra node refsをbody-freeで差分化する。
3. expected countを新しい値へ即変更しない。
4. 理由がcurrent受領snapshot差分として説明・固定できなければ停止する。

### 7.6 GA0完了条件

```text
archive hashes match
source fingerprint match
source file count match
same16 case order 16
body-free diagnostic receipt generated
full collect return code 0
collection error 0
full backend baseline node refs complete
baseline failed count 169 または差分理由が証拠化済み
node ref duplicate 0
historical FB172 ledger untouched
source diff 0
```

---

## 8. GA1 — 一般修復を証明するstructural RED

### 8.1 原則

REDはexact本文を期待しない。未来の未知入力にも成立する構造不変条件を書く。

### 8.2 必須RED family

#### R1. semantic contribution ownership

同じnucleus / relationを複数lineが持つ場合、各lineに異なるproduct functionが必要である。

不合格例:

```text
relation line: protective counterdirectionを届ける
human follow line: 同じtargetを別表現で再度届ける
```

合格条件:

```text
同じtargetを再利用するlineは、fact boundary、relation、human follow等の
異なる役割と、新しいfunctional atomを持つ。
単なる言い換え再提示は不可。
```

#### R2. follow contribution test

human follow targetがrelation lineで十分に届けられた場合、次のどちらかにする。

- relation lineへfollow atomをintegrateし、別lineを作らない。
- 別lineにするなら、relationでは届けていない別の役割を持つ。

#### R3. self-denial de-duplication

```text
fact boundary + protective counterdirection + same counterdirection follow
```

の3重構造を不合格にする。

help-seekingが別targetである場合は、protective counterdirectionとは別の価値として残してよい。

#### R4. relation surface stem budget

一つの出力内で、同じsurface stemが複数回現れる場合、各出現が別relation roleを明示できなければ不合格にする。

固定文列挙ではなく、SentencePlan binding / functional atom / normalized surface signatureを用いる。

#### R5. generic tail compatibility

generic tailは、対象role、modality、scope boundaryが必要な場合だけ許可する。

- actionがintentionを既に具体化しているlineへ、一律に「確定した変化ではなく」を付けない。
- valued change、retained intention、burdenを同じclosureへ潰さない。
- 同一outputで同じgeneric suffixを複数回付けない。

#### R6. clause integrity

引用されるnucleusが従属節・疑問断片・接続だけで終わらず、単独で読める意味単位か、relation line内で自然に統合されること。

#### R7. short-state regression control

short-state single required nucleusは、原則1 lineを維持し、別human follow lineで同じanchorを繰り返さない。長文化をREDの成功条件にしない。

#### R8. metamorphic control

入力語やcase順を変えても、次が保たれること。

- case IDに依存しない。
- exact語彙cueに依存しない。
- 同じsemantic shapeなら同じ構造判断。
- 異なるsemantic roleなら同じgeneric tailへ強制しない。

### 8.3 GA1完了条件

- 修復前snapshotで、狙ったstructural REDがfailureになる。
- existing safety / public / short-state controlは意図せず赤くしない。
- exact本文assert 0。
- case専用branch 0。
- REDがどのproduct defectを防ぐか説明できる。

---

## 9. GA2 — B / C / long / D系の一般修復

### 9.1 修復方針

修復順は、後段surfaceだけを言い換えるのではなく、責務の上流から行う。

```text
GA2-A Plan: target / role / contribution owner
GA2-B SentencePlan: line grouping / delivery mode / duplicate prevention
GA2-C Surface: role別relation grammar / closure / clause composition
GA2-D Gate: body-free semantic duplication / compatibility subchecks
GA2-E recovery / short / safety regression
```

### 9.2 GA2-A — GroundedObservationPlan

対象owner:

- `_build_response_and_policies()`
- `classify_grounded_human_follow_role()`
- 必要なbody-free helper

#### 9.2.1 follow target選択

現行はrole priorityとretention等から一つのtargetを選ぶ。修復後は、選択時に次を追加で判定する。

```text
1. targetはrequired / shouldのexplicit evidenceか。
2. targetのsemantic roleは何か。
3. required relationのendpointとして、すでにどのproduct functionで届けられるか。
4. human followが追加する独自の価値はあるか。
5. fact boundary / safety ownerと役割が重複しないか。
```

`human_follow_required=true`は「必ず別lineを一つ追加する」という意味にしない。SentencePlan内でfollow roleが一度、適切なlineへ実現されればよい。

#### 9.2.2 contribution mode案

実装時に既存schemaで表現できるかを先に確認する。必要なら内部enum候補:

```text
human_follow_delivery:
- integrated_into_relation
- integrated_into_observation
- separate_distinct_contribution
- not_required
```

この値をpublic metaへ出さない。既存functional atomで表現可能ならschemaを増やさない。

#### 9.2.3 self-denial

優先順位:

```text
help_seeking_preserved
protective_counterdirection
concrete_effort
retained_intention
burden_expression
```

ただし、limited opposition relationがprotective counterdirectionをすでに所有する場合、同じtargetをseparate followへ再選択しない。

help-seeking targetが別にある場合は、protective lineとhelp-seeking followを分けてよい。

### 9.3 GA2-B — GroundedSentencePlan

対象owner:

- `_build_regular_lines()`
- `_build_self_denial_lines()`
- relation / follow binding生成

#### 9.3.1 line ownership

各required semantic obligationへ、primary delivery lineを一つ定める。

```text
nucleus / relation obligation
  → primary delivery line
  → optional integrated follow atom
  → duplicate line禁止
```

同じnucleusがfact boundaryとrelationで必要な場合は例外として許可するが、二つのlineは異なるclaim scopeを持つ。

#### 9.3.2 B / C / longのgrouping

一つの入力内で複数のpair relationを一対ずつ列挙しない。次の単位でまとまりを作る。

- before / after / change arc
- comparison / counterevidence
- burden / progress
- provisional evaluation / counterevidence / limiting unknown
- retained intention / concrete action

line数を減らすこと自体を目的にしない。required意味を落とさず、同じarcに属する意味を一つのlineへまとめる。

#### 9.3.3 D系

基本構造候補:

```text
line 1: fact boundary
line 2: protective counterdirection relation
line 3: 別targetのhelp-seeking / concrete actionがある場合のみ
```

line 2とline 3が同じtarget・同じ意味ならline 3を作らない。

#### 9.3.4 short-state

single required nucleus / `short_state_sufficient`は1 lineを守る。follow roleはそのlineへintegrateする。情報がないのに一般的な励ましや質問を足さない。

### 9.4 GA2-C — Surface grammar

対象owner:

- `_render_relation()`
- `_render_limited_opposition()`
- `_render_human_follow()`
- `_apply_integrated_human_follow()`
- clause composition helper

#### 9.4.1 relation roleとsurface stem

relation typeだけで固定stemへ落とさず、body-free surface roleを使う。

候補:

```text
provisional_evaluation_to_counterevidence
comparison_to_counterevidence
burden_with_progress
retained_intention_with_action
unknown_preserved_with_next_trial
self_evaluation_to_protective_counterdirection
```

既存roleで表現できる場合は新しいenumを増やさない。目的はphrase数を増やすことではなく、異なる意味役割を同じ`同じ記録にあります`へ潰さないことである。

#### 9.4.2 stem repetition

同一outputで同じstemを繰り返す場合、二つ目以降は別のrelation functionがあるときだけ許可する。

禁止する解決:

- phrase randomization
- 同義語bankのrotation
- case別完成文

許可する解決:

- relation arcを一文へ統合
- relation roleに応じた文法選択
- already-delivered targetの省略
- evidence順を保った自然な接続

#### 9.4.3 generic tail

`_INTEGRATED_RETAINED_INTENTION_SUFFIX`等を無条件terminalにしない。

適用条件:

```text
- follow roleが本当にそのlineで未実現。
- scope boundaryを明示しないとoverclaimになる。
- line本文に同じ限定がすでにない。
- 同じoutputで同じclosureを重複しない。
```

actionが明示されている場合は、actionそのものがintentionのgroundingである。必要なら「行動も記されている」までで閉じ、一律のgeneric cautionを追加しない。

#### 9.4.4 dependent clause

nucleus sourceが従属節でも、引用fragmentをそのまま名詞化して不自然に並べない。

- source predicateは捏造しない。
- lexical anchorは保持する。
- clauseがrelation endpointとしてのみ成立する場合、relation line内へ統合する。
- 単独quoteへするために意味を補完しない。

### 9.5 GA2-D — Grounded Observation Gate

追加・強化するbody-free subcheck候補:

```text
human_follow_no_distinct_contribution
human_follow_repeats_relation_target
self_denial_counterdirection_duplicated
relation_surface_stem_repetition_without_new_role
generic_follow_suffix_role_mismatch
generic_follow_suffix_repeated
required_arc_fragmented_without_reason
```

Gateは本文を「美しい日本語」と自動判定するものではない。構造的に防げる重複・役割不一致だけを落とし、自然さの最終判定は華恋actual readへ残す。

### 9.6 GA2-E — regression boundary

必須回帰:

- Aの短い負荷を過読しない。
- S01〜S03のlexical fidelityを落とさない。
- D02 / D03のhelp-seekingを消さない。
- emergency Safety surfaceをGrounded通常観測へ戻さない。
- public meta body-freeを維持する。
- question policy falseを維持する。
- recovery stageでrequired意味を落とさない。

### 9.7 version / schema判断

本修復でsemantic選択・delivery責務が変わる場合、semantic version bump候補を検討する。

```text
candidate:
cocolon.emlis.grounded_semantics.i2.v3
```

ただし、実装diffを見ずに確定しない。

- dataclass fieldやserialized shapeが変わらなければPlan / SentencePlan / Surface schemaは維持する。
- functional atom追加だけで既存validatorが許容するならschemaを増やさない。
- public contractは変更しない。
- version bumpは「テストを通すため」ではなく、意味判断が変わったことを識別するために行う。

### 9.8 GA2完了条件

- GA1 structural REDがgreen。
- B / C / long / Dのdiagnostic reason refsが解消。
- short / safety / public regression 0。
- exact本文assert 0。
- case-specific branch 0。
- canonical path一系統。

---

## 10. GA3 — targeted / semantic / safety / public contract / RN確認

### 10.1 実行順

```text
V1  compile + targeted current Grounded tests
V2  semantic / readfeel structural tests
V3  Safety / public contract / emotion-submit E2E
V4  RN screen contract
```

この段階はfull backend greenの代替ではない。GA2修復の局所妥当性を確認し、full collectへ進んでよいか判断する。

### 10.2 V1 — compile / targeted

最低対象:

```text
ai/tests/test_emlis_ai_gate0_rr1_structural_red.py
ai/tests/test_emlis_ai_gate0_rr3_rr5_surface_contract.py
ai/tests/test_emlis_ai_gate0_r1_semantic_retention.py
ai/tests/test_emlis_ai_gate0_r5_semantic_subchecks.py
ai/tests/test_emlis_ai_grounded_observation_plan_i1.py
I6 / I7 helper contract tests
Gate0 decision / exact8 fail-closed tests
```

合格:

- return code 0
- collection error 0
- GA1 RED green
- canonical generation path / composer維持

### 10.3 V2 — semantic

確認軸:

- required nucleus retained
- required relation direction
- lexical anchor
- limiting unknown preserved
- human follow role / target / contribution
- duplicate semantic delivery
- short-state single-line boundary
- deterministic first / second generation

### 10.4 V3 — Safety / public

最低対象:

```text
test_emlis_ai_safety_boundary_service.py
test_emlis_ai_safety_triage_response_contract.py
test_emlis_ai_public_feedback_meta.py
test_emotion_submit_public_feedback_meta_boundary.py
test_emotion_submit_phase19_public_feedback_boundary_e2e.py
test_emotion_submit_phase19_real_device_abcd_public_feedback_e2e.py
test_emotion_submit_two_stage_reception_e2e.py
```

合格:

- self-denial fact boundary維持
- help-seeking保持
- emergency safety owner維持
- failed candidate非表示契約維持
- public meta body-free
- API response key差分0

### 10.5 V4 — RN screen contract

Cocolon app rootで:

```bash
npm run test:rn-screens
```

合格:

- return code 0
- 既存RN screen contract全件pass
- RN production source差分0

### 10.6 GA3停止条件

- targetedのためだけにpublic / Safety contractを緩める必要がある。
- RN production変更が必要になる。
- current path以外のowner復活が必要になる。
- exact body expectationを追加しないとgreenにならない。

---

## 11. GA4 — full collect

### 11.1 目的

局所test追加やhistorical migrationで、full suiteのimport / collection graphを壊していないことを確認する。

### 11.2 実行

```bash
python -m pytest --collect-only -q
```

### 11.3 合格条件

```text
return code = 0
collection error = 0
collected test count > 0
node ID duplicate = 0
baseline skip / xfail ref増加 = 0
```

12714件から増減した場合、追加・削除されたtest file / node refの理由を記録する。単に件数が違うだけで失敗とはしないが、理由不明の減少は停止する。

### 11.4 GA4後の扱い

GA4合格後にsourceを変えた場合、GA3から再実行する。collectだけを再実行してGA3を省略しない。

---

## 12. GA5 — full backend 169 failuresのcurrent owner別閉包

### 12.1 基本判断

- historical FB172 ledgerは閉じた履歴として不変。
- baseline 169件は新しいresidual failure setとして扱う。
- 同じhistorical nodeが再びfailした場合も、旧ledgerを書き換えず、今回のledgerへ`regressed_after_fb172`として記録する。
- 169件を3件減らす等の件数目標ではなく、全nodeの保護義務とcurrent ownerを証明して閉じる。

### 12.2 ledgerのprimary classification

既存FB172分類を原則再利用する。

```text
ENVIRONMENT_OR_ORDER_VARIANCE
STALE_OWNER_EXPECTATION
EXACT_SURFACE_EXPECTATION
CURRENT_CONTRACT_REGRESSION
UNRESOLVED_STOP
```

追加情報はprimary classificationを増やさず、次のdimensionで持つ。

```text
owner_family:
- current_grounded_plan
- current_sentence_surface
- grounded_semantic_gate
- safety_owner
- public_feedback_contract
- emotion_submit_e2e
- rn_contract
- historical_test_migration
- inventory_negative_reachability
- environment_collection
- other_current_owner
```

### 12.3 current owner認定証拠

各failure recordに最低2種類の証拠を要求する。

1. **reachability / call path evidence**
   - 現在runtimeから呼ばれるmodule / function。
   - retired ownerが呼ばれない証拠。
2. **contract / test evidence**
   - 現在守るべきproduct obligation。
   - current test、public contract、Safety contract、RN contract等。

さらに次を記録する。

- historical assertionのどこが今も有効か。
- どこがretired implementation detailか。
- 修復種別がproduction repairかtest migrationかenvironment isolationか。
- protected obligationを弱めていないか。

### 12.4 closure batch順

failure分布を見ずに件数を決め打ちしない。依存順だけ固定する。

#### O0. environment / collection

- import order
- shared app state
- plugin / worker差
- cwd / PYTHONPATH
- clean subprocessが必要なcontract

production contractを変えず、実行環境差を分離する。

#### O1. stale owner / retired private symbol

- old private helper import
- removed module owner
- old nested meta container

retired ownerをproductionへ戻さず、test obligationをcurrent ownerへ移管する。

#### O2. exact surface / old semantic ID

- exact本文
- fixed prefix / suffix
- retired semantic material ID

protected obligationをrequired nucleus、relation、functional atom、public fixed contractへ移す。新しいexact本文を作らない。

#### O3. hold / Safety / public / RN

- P5 / P6 hold truth
- P8 false
- public feedback inclusion / omission
- Safety separate owner
- RN visible contract

外部contractを変更せずcurrent truthへ整合する。

#### O4. true current production regression

O0〜O3で説明できないfailureだけをproduction regression候補にする。

production変更前に次を証明する。

```text
- failing obligationはcurrent productに必要。
- current ownerが実際にその義務を持つ。
- test expectationはstale / exact bodyではない。
- 最小production diffで閉じられる。
- GA2の意味・読感を後退させない。
```

#### O5. inventory / negative reachability

- old substantive route非到達
- retired symbol不存在
- current owner inventory
- public / body-free source scan

source-global文字列scanだけを根拠にせず、import / call / runtime reachabilityを確認する。

### 12.5 batchごとの検証

各batch後:

```text
1. changed file compile
2. batch selected node refs
3. current-owner targeted tests
4. GA2 readfeel structural tests
5. Safety / public contract（影響する場合）
```

full backendを小変更ごとに無制限に回さない。baseline full run、主要repair後のresidual run、final candidate full runを基本とし、新failureが残った場合だけ追加する。

### 12.6 new failureの扱い

修復後にbaseline外nodeがfailした場合:

```text
origin = introduced_after_batch
introduced_after_batch = O1 / O2 / ...
```

として同じledgerへ追記する。別の未管理リストを作らない。

### 12.7 final candidate freeze

全ledger recordがclosedになった後、final candidate fingerprintを固定する。

そのfingerprintで次を順に再実行する。

```text
GA3 V1〜V4
GA4 full collect
GA5 full backend
```

V1〜full backend間でsource変更を禁止する。

### 12.8 full backend合格条件

```text
return code = 0
failed = 0
errors = 0
unclassified failure = 0
current owner missing = 0
unresolved stop = 0
new skip / xfail = 0
baseline skip refs unchanged or reduced
warnings recorded
source fingerprint unchanged through validation
```

### 12.9 GA5停止条件

- current ownerを証明できないnodeが1件以上。
- protected obligationを言えない。
- test deletion / skip / xfailでしか閉じない。
- old substantive routeを復活させようとしている。
- API / DB / RN production変更が必要。
- full backendでfailureまたはerrorが1件以上残る。

この場合、same16へ進まない。

---

## 13. GA6 — same16 official再生成

### 13.1 開始条件

- GA3〜GA5が同一final fingerprintでall green。
- full backend failed 0 / errors 0。
- residual ledger unclassified 0 / unresolved 0。
- final fingerprint以降source変更0。

### 13.2 case set

既存helperの16件と順序を変更しない。

```text
A, B, C, D,
I6-S01, I6-S02, I6-S03,
I6-L01, I6-L02, I6-L03,
I6-C01, I6-C02, I6-C03,
I6-D01, I6-D02, I6-D03
```

### 13.3 生成手順

```text
GA6-1 final fingerprint確認
GA6-2 first run生成
GA6-3 second run生成
GA6-4 caseごとにnormalized input hash / body hash / plan / sentence / surface signature比較
GA6-5 automated I7 candidate check
GA6-6 body-full比較はlocal-only保持
GA6-7 body-free official receipt生成
```

### 13.4 automated合格条件

```text
case count = 16
case order exact match
first / second body hash match = 16 / 16
canonical generation path = 16 / 16
composer_source = 16 / 16
semantic quality gate pass = 16 / 16
question substitution = 0
internal taxonomy leak = 0
dependent fragment fatal = 0
duplicate sentence fatal = 0
overlong / too many lines fatal = 0
```

automated candidate passは華恋actual readの代わりではない。

---

## 14. GA7 — 華恋actual local read 16件

### 14.1 評価軸

既存I7軸を維持する。

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

### 14.2 軸別判定

| axis | pass | fail時の主なowner |
|---|---|---|
| required nucleus | 中心核・反転・不明領域・意図・行動が落ちない | Plan / retention / grouping |
| relation direction | before/after、比較/反証、評価/反転の向きが正しい | Plan relation / SentencePlan |
| lexical fidelity | 入力固有の状態語・述語を別概念へ置換しない | Surface lexical policy |
| whole input balance | 一部だけを過剰前景化せず、主要arcが見える | Plan / line grouping |
| human follow fit | ユーザーが残した意図・行動・反対方向を適切に受け取る | follow target / role / surface |
| natural Japanese | quote接続・係り受け・文末が自然 | Surface / clause composition |
| non-template | 同じstemやtailで異なる入力を処理済みにしない | SentencePlan / Surface / Gate |
| safety boundary | 自己評価を事実化せず、help-seekingとemergencyを正しく分ける | Safety / fact boundary |
| wants more input | 次回も入力したい観測候補になっている | human product judgment |

### 14.3 必須case確認

- A: 短い負荷を過読・一般化しない。
- B: 長い変化arc、人から物への疑問対象移動、行動、進歩を断片列挙にしない。
- C: 他者比較と昨日の自分、小さな変化、継続意図を正しい方向で保持する。
- D: 自己評価を事実化せず、本人の反対方向を重複させない。
- S01〜S03: 状態語の語義を保ち、無理に厚くしない。
- L01〜L03: burden / progress、境界意図、暫定評価 / counterevidence / unknown / next actionを保持する。
- C01〜C03: 他者比較と自己基準の証拠を混同しない。
- D01〜D03: protective counterdirectionとhelp-seekingを重複・消失させない。

### 14.4 verdict

```text
local_human_pass
repair_required
hard_fatal
```

合格:

```text
review count = 16
local_human_pass = 16
repair_required = 0
hard_fatal = 0
snapshot fingerprint = final validation fingerprint
```

一件でも不合格なら、case専用修正をせず、failure axisからcurrent ownerへ戻る。source変更後はGA3からやり直す。

---

## 15. GA8 — Gate decisionとexact8 packet

### 15.1 decision

既存`cocolon.emlis.gate0.local_decision.bodyfree.v2`を原則再利用する。

pass条件:

- orchestration層でresidual closure linkのhash整合を確認済み
- automated same16 16 / 16
- actual local review 16 / 16
- targeted / Safety / public / RN / collect / full backend all green
- unclassified failure 0
- source / review / validation fingerprint一致
- residual failure closure link一致

### 15.2 residual closure link

既存v2へ破壊的field追加を避けるため、別のbody-free link artifact候補を使う。generator / orchestrationはこのlinkを検査してから既存`build_gate0_local_decision()`と`build_exact8_device_packet()`を呼ぶ。既存decision JSONへ不要なfieldを追加しない。

```json
{
  "schema_version": "cocolon.emlis.gatea.final_link.bodyfree.v1",
  "baseline_freeze_sha256": "64hex",
  "historical_fb172_ledger_sha256": "64hex",
  "residual_failure_set_id": "post_fb172_residual_<12hex>",
  "residual_owner_ledger_sha256": "64hex",
  "final_source_snapshot_fingerprint": "64hex",
  "validation_evidence_sha256": "64hex",
  "local_review_receipt_sha256": "64hex",
  "baseline_failure_count": 169,
  "baseline_failure_closed_count": 169,
  "introduced_failure_count": 0,
  "introduced_failure_closed_count": 0,
  "total_open_failure_count": 0,
  "unclassified_failure_count": 0,
  "unresolved_stop_count": 0,
  "raw_input_included": false,
  "returned_surface_included": false,
  "comment_text_included": false
}
```

`introduced_failure_count`が0でなくても、`introduced_failure_closed_count`が一致し、`total_open_failure_count=0`なら閉包可能である。上記は例であり、実装時に実際の必要fieldを最小化する。

### 15.3 exact8生成条件

既存fail-closed builderを維持する。

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

必須条件:

- decision codeが`GATE0_LOCAL_PASS_DEVICE_PACKET_READY_STOPPED`
- `gate0_local_pass=true`
- `exact8_packet_generation_allowed=true`
- validation全項目true
- source / review / validation fingerprint一致
- local comment hash 8件あり
- fixed case setがhelperに存在

### 15.4 arbitrary input

`arbitrary_input_allowed=false`を維持する。任意入力はexact8 8 / 8実機一致後の探索枠であり、Gate Bの代替にしない。

---

## 16. GA9 — 停止とMash様への実機依頼

### 16.1 停止状態

exact8 packetを生成した時点で、次を明示して停止する。

```text
GATE0_LOCAL_PASS_DEVICE_PACKET_READY_STOPPED
P5 = NOT_STARTED
P6 = NOT_STARTED
P8 = NOT_STARTED
DEVICE_EVIDENCE = WAITING
```

### 16.2 Mash様へお願いする最小作業

各8件について:

1. packetの`exact_current_input`を編集せず入力。
2. 表示されたEmlis本文を取得。
3. modal screenshotを1枚取得。
4. 見切れ、圧迫、改行崩れ、表示欠落の有無を記録。

Mash様へ内部schema名、Gate名、owner分類の判断は求めない。

### 16.3 華恋側で行うこと

- local body hashとvisible bodyを比較。
- required meta fieldsをbackend側証拠から取得。
- generation path / composer / semantic gate / public reply path一致を確認。
- screenshotでlayoutを確認。
- exact8 8 / 8一致後にGate B判定へ進む。

---

## 17. JSON / schema案

この節は設計案であり、今回実ファイルを作成しない。既存artifactで十分なら新設しない。

### 17.1 Gate A freeze body-free案

```json
{
  "schema_version": "cocolon.emlis.gatea.freeze.bodyfree.v1",
  "cycle_id": "p7_gatea_post_fb172_current_input_closure_20260711",
  "source_archive_ref": "mashos-api(213).zip",
  "source_archive_sha256": "5223cbcfc4c55ca885d13d025b3eb743b5e14e6428bfeeb43db7f4b7e1ccdce2",
  "source_snapshot_fingerprint": "394b5da7a9546d5f893e00fe27417e2e10231dcc267a2d728e6f11025d2aa0c3",
  "source_snapshot_file_count": 1359,
  "source_snapshot_algorithm": "sha256(relative_path_utf8 + NUL + lowercase_file_sha256_ascii), path_sorted",
  "canonical_versions": {
    "semantic": "cocolon.emlis.grounded_semantics.i2.v2",
    "plan_schema": "cocolon.emlis.grounded_observation_plan.v1",
    "sentence_plan_schema": "cocolon.emlis.grounded_sentence_plan.i3.v1",
    "surface_schema": "cocolon.emlis.grounded_surface.i4.v1",
    "gate_schema": "cocolon.emlis.grounded_observation_gate.i5.v1"
  },
  "same16": {
    "case_order": ["A", "B", "C", "D", "I6-S01", "I6-S02", "I6-S03", "I6-L01", "I6-L02", "I6-L03", "I6-C01", "I6-C02", "I6-C03", "I6-D01", "I6-D02", "I6-D03"],
    "body_free_signature_sha256": "33b2431216abb243c0fcee43dbe8dfe6bf81546c1df6e37b453d04ce449e475b"
  },
  "full_collect": {
    "collected_test_count": 12714,
    "collection_error_count": 0
  },
  "full_backend": {
    "passed_count": 12543,
    "failed_count": 169,
    "skipped_count": 2,
    "failure_refs_sha256": "<64-hex generated at implementation>"
  },
  "raw_input_included": false,
  "returned_surface_included": false,
  "comment_text_included": false
}
```

### 17.2 readfeel diagnostic receipt案

```json
{
  "schema_version": "cocolon.emlis.gatea.readfeel_diagnostic.bodyfree.v1",
  "source_snapshot_fingerprint": "64hex",
  "review_claim": "read_only_diagnostic_not_official_human_pass",
  "cases": [
    {
      "case_id": "B",
      "body_sha256": "64hex",
      "character_count": 334,
      "line_count": 3,
      "reason_refs": [
        "mechanical_relation_surface_stem_repetition",
        "generic_retained_intention_tail_overused"
      ]
    }
  ],
  "official_local_review_started": false,
  "raw_input_included": false,
  "returned_surface_included": false,
  "comment_text_included": false
}
```

### 17.3 residual owner ledger案

```json
{
  "schema_version": "cocolon.emlis.gatea.residual_owner_ledger.bodyfree.v1",
  "failure_set_id": "post_fb172_residual_<12hex>",
  "baseline_source_snapshot_fingerprint": "64hex",
  "baseline_failure_ref_count": 169,
  "baseline_failure_refs_sha256": "64hex",
  "historical_fb172_ledger_sha256": "64hex",
  "records": [
    {
      "node_ref": "test_path.py::test_name[param]",
      "node_ref_sha256": "64hex",
      "origin": "baseline_post_fb172_residual",
      "owner_family": "grounded_semantic_gate",
      "primary_classification": "CURRENT_CONTRACT_REGRESSION",
      "historical_owner_refs": ["body-free-ref"],
      "current_owner_refs": ["module.function", "current-contract-test"],
      "protected_obligation_refs": ["required_relation_direction"],
      "stale_implementation_detail_refs": [],
      "planned_closure": "production_repair",
      "closure_batch": "O4",
      "attempts": [],
      "closure_status": "open"
    }
  ],
  "unclassified_count": 0,
  "current_owner_missing_count": 0,
  "unresolved_stop_count": 0,
  "raw_input_included": false,
  "returned_surface_included": false,
  "comment_text_included": false
}
```

### 17.4 attempt record案

```json
{
  "attempt_id": "O4-003",
  "source_snapshot_before": "64hex",
  "changed_file_refs": ["relative/path.py"],
  "change_kind": "production_repair",
  "reason_refs": ["human_follow_repeats_relation_target"],
  "selected_result_ref": "body-free-command-ref",
  "current_owner_targeted_green": true,
  "safety_public_recheck_required": true,
  "introduced_failure_refs": [],
  "source_snapshot_after": "64hex"
}
```

### 17.5 artifact配置とhash境界

- source / test inputのfingerprintと、生成evidenceのSHA-256を別に持つ。
- final linkはfingerprint対象外の生成evidenceとして扱う。
- residual ledgerをfingerprint対象外に置く場合、ledger SHA-256をfinal linkの必須値にする。
- residual ledgerをfingerprint対象内に置く場合、ledger自身へfinal source fingerprintを埋め込まない。
- body-full artifactは常にlocal-onlyで、commit / public meta / handoff zipへ混ぜない。

### 17.6 schema制約

- `node_ref`はledger内でunique。
- baseline nodeは全件ちょうど1 record。
- introduced nodeも検出時点で即record。
- `CURRENT_CONTRACT_REGRESSION`でないproduction変更は禁止。
- `closure_status=closed`には結果refとclosure source refが必要。
- final source fingerprintは、ledger自身へ自己参照で埋めず、final linkからledger SHA-256と併せて固定する。
- raw bodyはledgerへ入れない。
- historical FB172 ledgerは参照のみで上書きしない。

---

## 18. 詳細実装順

### GA0 — freeze

**変更:** 原則test/helper/artifactのみ。production変更0。  
**出口:** baseline source / same16 diagnostic / failure set確定。  
**停止:** 169集合不一致を説明できない。

### GA1 — structural RED

**変更:** current owner test。  
**出口:** product defectを再現する一般RED。  
**停止:** exact本文・case cueが必要。

### GA2-A — Plan修復

**変更:** target / role / contribution判断。  
**出口:** follow ownerが一意、self-denial重複候補解消。  
**停止:** public schema変更が必要。

### GA2-B — SentencePlan修復

**変更:** line grouping / integrated vs separate。  
**出口:** relationとfollowのdelivery重複0。  
**停止:** required意味を落とさないとline数を満たせない。

### GA2-C — Surface修復

**変更:** relation role grammar / closure / clause。  
**出口:** mechanical stem / generic tail不良解消。  
**停止:** phrase bank / randomizationが必要。

### GA2-D — Gate修復

**変更:** body-free structural subchecks。  
**出口:**同じ欠陥を未知入力でもreject。  
**停止:** human naturalnessをexact phraseで自動判定しようとしている。

### GA2-E — regression

**変更:** 必要なtestのみ。  
**出口:** short / safety / public / recovery維持。

### GA3 — targeted / contract

**変更:** 原則なし。failure時はownerへ戻る。  
**出口:** V1〜V4 green。

### GA4 — collect

**変更:** なし。  
**出口:** collection error 0、node graph整合。

### GA5-A — residual inventory

**変更:** ledger / test migration候補。  
**出口:** baseline全node classified、owner missing 0。

### GA5-B〜F — O0〜O5 closure

**変更:** classificationに応じた最小差分。  
**出口:**全record closed。

### GA5-G — final candidate validation

**変更:** なし。  
**出口:** final fingerprintでGA3 / GA4 / full backend all green。

### GA6 — same16 official generation

**変更:** evidence artifact候補のみ。  
**出口:** automated / deterministic 16 / 16。

### GA7 — Karen actual local read

**変更:** body-free receipt候補のみ。  
**出口:** local human pass 16 / 16。

### GA8 — decision / exact8

**変更:** existing helperで生成。helper不足が証明された場合だけ最小変更。  
**出口:** exact8 ready。

### GA9 — stop

**変更:** なし。  
**出口:** Mash様のdevice evidence待ち。

---

## 19. validation command順候補

実装時の実ファイル・環境に合わせてcommand refを確定する。順序は変えない。

```bash
# backend root
python -m compileall -q ai/services/ai_inference ai/tests/helpers

python -m pytest -q \
  ai/tests/test_emlis_ai_gate0_rr1_structural_red.py \
  ai/tests/test_emlis_ai_gate0_rr3_rr5_surface_contract.py \
  ai/tests/test_emlis_ai_gate0_r1_semantic_retention.py \
  ai/tests/test_emlis_ai_gate0_r5_semantic_subchecks.py \
  ai/tests/test_emlis_ai_gate0_r8_r10_boundary.py \
  ai/tests/test_emlis_ai_gate0_rr6_decision_contract_v2.py

python -m pytest -q \
  ai/tests/test_emlis_ai_safety_boundary_service.py \
  ai/tests/test_emlis_ai_safety_triage_response_contract.py \
  ai/tests/test_emlis_ai_public_feedback_meta.py \
  ai/tests/test_emotion_submit_public_feedback_meta_boundary.py \
  ai/tests/test_emotion_submit_phase19_public_feedback_boundary_e2e.py \
  ai/tests/test_emotion_submit_phase19_real_device_abcd_public_feedback_e2e.py \
  ai/tests/test_emotion_submit_two_stage_reception_e2e.py

# Cocolon RN root
npm run test:rn-screens

# backend root
python -m pytest --collect-only -q
python -m pytest -q
```

`full backend`をgreenにした後、sourceを変更せずsame16 generator / review / decision / exact8を実行する。

---

## 20. rollback単位

```text
C0  freeze / environment / baseline evidence
C1  structural RED
C2  Plan target / role / contribution
C3  SentencePlan grouping / delivery
C4  Surface grammar / closure
C5  Gate subchecks
C6  stale owner / exact surface test migration
C7  Safety / public / RN current-owner closure
C8  true production regression closure
C9  inventory / negative reachability
C10 final evidence artifacts
```

rollback条件:

- canonical path変更
- public key差分
- DB / RN production差分
- Safety boundary後退
- required meaning後退
- deterministic loss
- case-specific branch
- exact body bank
- skip / xfailによるclosure
- source / review / validation fingerprint不一致

rollbackは同じcurrent architecture内の直前単位へ戻す。old routeをfeature flagで復活させない。

---

## 21. traceability

| Mash様指定 | 本書 | 実装phase | 完了証拠 |
|---|---|---|---|
| 1. source / body-free弱さfreeze | Sections 4, 7 | GA0 | archive hash、source fingerprint、diagnostic receipt、failure set |
| 2. B/C/long/D一般修復 | Sections 8, 9 | GA1〜GA2 | structural RED、Plan/Sentence/Surface/Gate targeted green |
| 3. targeted/semantic/safety/public/RN | Section 10 | GA3 | V1〜V4 result refs |
| 4. full collect | Section 11 | GA4 | return 0、collection error 0 |
| 5. 169 owner closure | Section 12 | GA5 | owner ledger all closed、full backend failed 0 |
| 6. same16 official再生成 | Section 13 | GA6 | first/second deterministic 16/16 |
| 7. 華恋16件実読 | Section 14 | GA7 | local human pass 16/16 |
| 8. exact8生成 | Section 15 | GA8 | exact8 packet v2 |
| 9. 停止・実機依頼 | Section 16 | GA9 | stop code、device handoff |

---

## 22. 実装前チェックリスト

### freeze

- [ ] 受領zip SHA-256一致
- [ ] source fingerprint algorithm再利用
- [ ] source fingerprint / file count一致
- [ ] same16 case order固定
- [ ] body-fullはlocal-only
- [ ] 169 node refs完全取得
- [ ] historical FB172 artifact不変

### repair design

- [ ] case ID / exact語彙cueなし
- [ ] exact本文assertなし
- [ ] follow contribution owner定義
- [ ] self-denial duplicate防止
- [ ] generic tail compatibility定義
- [ ] short-state過剰拡張なし
- [ ] Safety owner維持

### validation

- [ ] targeted green
- [ ] semantic green
- [ ] Safety / public green
- [ ] RN green / production diff 0
- [ ] collect error 0
- [ ] full backend failed 0 / errors 0
- [ ] unclassified 0 / owner missing 0
- [ ] new skip / xfail 0

### actual read / exit

- [ ] final fingerprint固定
- [ ] same16 deterministic 16/16
- [ ] Karen actual read 16/16
- [ ] repair 0 / fatal 0
- [ ] exact8 helper-generated
- [ ] P5 false
- [ ] P6 false
- [ ] P8 false
- [ ] device evidence待ちで停止

---

## 23. 本設計だけでは行わないこと

- production codeの編集
- test / fixtureの編集
- JSON / schema artifactの実ファイル化
- full backendのofficial再実行・結果採用
- same16 official receipt生成
- 華恋actual local passの宣言
- exact8 packet生成
- Mash様への実機入力依頼
- P5 / P6 / P8開始
- 前提資料更新

---

## 24. 最終判定

```text
DESIGN_READY = true
IMPLEMENTATION_STARTED = false
GATE_A_CURRENT_STATUS = FAIL
P8_IMPLEMENTATION = NO_GO
MASH_DEVICE_WORK_NOW = NOT_REQUIRED
NEXT_LOCAL_WORK = GA0_BASELINE_FREEZE
```

次の実装では、まずGA0で現行snapshotと169 failure node集合を固定する。そこからGA1〜GA5を順に閉じ、同一final fingerprintで全backend greenを確認した後だけ、same16 official再生成と華恋actual readへ進む。

16 / 16 pass時だけexact8を生成し、その時点で停止してMash様へ実機確認を依頼する。実機情報が次工程の前提になった後は、別の内部作業を発明して進めない。
