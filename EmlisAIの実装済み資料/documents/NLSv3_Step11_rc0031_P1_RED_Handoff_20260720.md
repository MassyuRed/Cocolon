# NLS v3 Step 11 rc0031 — P1 RED Handoff

作成日: 2026-07-20 JST  
対象: `Step 11 / Cycle 001`  
handoff state: `P1_RED_FROZEN / STOP_BEFORE_P2`  
privacy: `BODY-FREE`

## 1. 現在地

- GitHub predecessor: `MassyuRed/mashos-api@25b98ec8b59eaff717d1dc3261ff21156ccce7ed`
- Revised Cycle詳細設計: SHA-256 `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc`一致
- rc0030: E3 machine GREEN / Product Read STOPとして凍結
- rc0031 P0: 完了
- rc0031 P1: exact7を`1 PASS / 6 intentional RED`でfreeze
- production source: 変更0
- P2: 未開始
- E4: 未開始。今回の§14承認に含まれない
- Cycle 001: `NOT_ACCEPTED`

## 2. 今回追加したrepository file

1. `ai/tests/fixtures/emlis_nls_v3/cycle_001/rc0031_representative8_body_free.json`
2. `ai/tests/test_emlis_nls_v3_s11_rc0031_proposition_surface_red.py`

既存repository fileの修正は0である。ZIPには上記2 fileをrepository相対pathで収録し、unchanged fileは入れない。

| path | SHA-256 |
|---|---|
| fixture | `15e8047cd95b453fba4a7a677b428955ea2819e6738e4e1fc1488d24952b78a8` |
| RED test | `18f4f28a5e326369c6ed9d1041c7a6e4a9f9490b66798ba199ebcafd84bb0454` |

## 3. 添付するbody-free evidence

| document | SHA-256 |
|---|---|
| `NLSv3_Step11_rc0031_P0_P1_FreezeLedger_20260720.md` | `620939798f9e5a3d0ae64695d723e6c79a2f0cf894abafe25e024c1223035b20` |
| `NLSv3_Step11_rc0031_P1_RED_Receipt_20260720.json` | `5576c18fa6f28ad6c9f6c87f66a0a94631c6eb39a3249a4ffe2744799141e1d7` |

private input / output本文、引用、parsed span、binding detail、unsalted body digest、secure materialはZIPへ含めていない。

## 4. P1再実行

collection:

```bash
PYTHONDONTWRITEBYTECODE=1 \
PYTHONPATH=ai/services/ai_inference \
python -m pytest --collect-only -q \
  ai/tests/test_emlis_nls_v3_s11_rc0031_proposition_surface_red.py
```

期待結果:

```text
7 tests collected
collection errors 0
```

semantic RED:

```bash
PYTHONDONTWRITEBYTECODE=1 \
PYTHONPATH=ai/services/ai_inference \
python -m pytest -q \
  ai/tests/test_emlis_nls_v3_s11_rc0031_proposition_surface_red.py
```

期待結果:

```text
1 passed
6 intentionally failed
errors 0
skipped 0
xfailed 0
```

期待するfailure codeは次の6つだけである。

1. `STEP11_RC0031_SOURCE_ROOT_DOMINANCE_NOT_PROVED`
2. `STEP11_RC0031_SCHEMA_FREE_PROPOSITION_NOT_PROVED`
3. `STEP11_RC0031_RELATION_PROPOSITION_NOT_PROVED`
4. `STEP11_RC0031_DISTRIBUTION_DEPTH_NOT_PROVED`
5. `STEP11_RC0031_GROUNDED_RECEPTION_PREDICATION_NOT_PROVED`
6. `STEP11_RC0031_CONTROL_RETAINED_NON_REGRESSION_NOT_PROVED`

## 5. P1で固定した境界

- P1 test / fixture bytesとSHA-256
- exact7の意味とclosed code
- control baseline / acceptance
- retained improvement contract
- existing named attack `53`
- new pending attack `24`と各consumer / expected code
- combined named denominator minimum `77`
- candidate `12` / replan `1`
- owner `24` / referent `32`
- parser body `1,000,000 bytes`
- Parser / Matcher invocationとdecomposition上限
- exact4 frozen prefix
- new exact18 maximum allowlistとP1 active exact2
- rc0027 / rc0028 / rc0029 / rc0030 existing behavior
- runtime disconnect / public route不変

P5までfixture/test/denominator/baseline/RED意味を変更してGREENにしてはならない。

## 6. 次phaseで守ること

P2を別途承認した場合だけ、次を行う。

1. immutable rc0027 base AST / planとE1b / rc0028 typed authorityから新しいrc0031 Proposition Surfaceを作る。
2. rc0030 final bytesを文字列修復入力にしない。
3. source-grounded root propositionを完成した先頭命題として保持する。
4. relationをendpoint-awareなnatural connective / dependent clauseへする。
5. semantic atomをowner-connected groupへ分散する。
6. Reception target / support / act / scopeを一つの自然なpredicationへ統合する。
7. exact4はcurrent EOFへのunique rc0031-prefixed append-onlyだけにする。
8. Grounded Lexicalizationは既存projectionで不足すると証明された場合だけ使う。

## 7. STOP条件

次のいずれかが必要ならP2を実装せず、影響範囲を提示してSTOPする。

1. existing base orderingからroot / predicate-ready roleを一意導出できない
2. Content Selection / Discourse / Planning Frontier / E1b / Grounded Reception authority変更が必要
3. required meaning、relation、unknown、self-denialのdrop / generic化が必要
4. candidate、replan、owner、referent、parser、depth、clause等のresource拡張が必要
5. Parser / Matcherがforward plan、AST、metadata、hidden marker、self-claimを読む必要
6. case / family / topic / input word / review / control branchが必要
7. exact4 / new exact18外path、別planner、shared/public runtime接続が必要
8. Gate downgrade、assertion弱化、skip / xfail、mock-only GREENが必要

## 8. 次に必要なauthority

P2へ進む前に、今回の2 repository fileを`mashos-api`へ反映したcommit SHAを新しいimmutable predecessorとして確認し、P1 freezeとP2開始を明示承認する必要がある。

正確な次指示案:

> `rc0031 P1 exact7 semantic RED freezeを承認する。P1 test / fixture / closed code / control / attack / resource denominatorを不変にし、反映commitをimmutable predecessorとして、P2 source-grounded Proposition Surface forward / plan / rendererを開始する。既存authority外owner、resource拡張、case / family / control branch、exact4 / 18外pathが必要なら実装前にSTOPする。`

この承認にP3以降、E4、formal candidate、production接続、Cycle 001 ACCEPTEDは含まれない。
