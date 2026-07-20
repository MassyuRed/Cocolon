# NLS v3 Step 11 rc0030 — P1 RED Handoff

作成日: 2026-07-19 JST  
対象: `Step 11 / Cycle 001`  
handoff state: `P1_RED_FROZEN / STOP_BEFORE_P2`

## 1. 現在地

現在は`Cocolon_EmlisAI_ModelFreeNaturalLanguageSurfaceV3_DetailedDesign_ImplementationOrder_20260714_Revised_Cycle.md`の`Step 11 / Cycle 001`途中である。

- rc0029: E3 machine GREEN / Product Read STOPとして凍結
- E4: 未開始
- Cycle 001: `NOT_ACCEPTED`
- rc0030 P0: 完了
- rc0030 P1: 5 concern semantic REDを再現・freeze
- rc0030 production implementation: 未開始

## 2. 今回追加したrepository file

1. `ai/tests/fixtures/emlis_nls_v3/cycle_001/rc0030_representative8_body_free.json`
2. `ai/tests/test_emlis_nls_v3_s11_rc0030_surface_planning_red.py`

既存fileの修正は0である。ZIPには上記2 fileをrepository相対pathで収録する。

## 3. P1再実行

```bash
PYTHONPATH=/tmp/nlsv3_phasec_pydeps \
  /tmp/nlsv3_phasec_pydeps/bin/pytest -q \
  ai/tests/test_emlis_nls_v3_s11_rc0030_surface_planning_red.py
```

期待結果:

```text
1 passed
5 intentionally failed
errors 0
skipped 0
xfailed 0
```

期待するfailure codeは次の5つだけである。

1. `STEP11_RC0030_MAIN_MEANING_APPENDIX_DOMINANCE`
2. `STEP11_RC0030_SCHEMA_EXPOSITION`
3. `STEP11_RC0030_SURFACE_DISTRIBUTION_OVERCONCENTRATED`
4. `STEP11_RC0030_GROUNDED_RECEPTION_PREFIX_LIST`
5. `STEP11_RC0030_CONTROL_NON_REGRESSION`

collectionだけを確認する場合:

```bash
PYTHONPATH=/tmp/nlsv3_phasec_pydeps \
  /tmp/nlsv3_phasec_pydeps/bin/pytest --collect-only -q \
  ai/tests/test_emlis_nls_v3_s11_rc0030_surface_planning_red.py
```

## 4. P2で変更してはいけないもの

- P1 test bytes / hash
- P1 fixture bytes / hash
- 5 closed RED code
- control baseline / acceptance
- resource / parser denominator
- retained 33 attack ID / count
- pending 20 attack ID / count
- exact 4 frozen prefix
- rc0027 / rc0028 / rc0029-prefixed既存symbol / behavior
- Step 9 / E1b / Content Selection / Discourse Planner / Grounded Human Reception
- shared runtime / public route

P1 testの期待値を緩める、fixture severityを書き換える、skip / xfailへ変える、resource上限を広げることでGREENにしてはならない。

## 5. P2実装責任

P2で許可されるのは、承認済みexact 4 owner末尾へのrc0030-prefixed append-only APIと、承認済みnew exact path内のforward側fileだけである。

必要な共通責任:

- rc0027 base-leading observationからのprominence witness
- E1b typed atomのowner-connected sentence group / grammatical chunk割当て
- schema-free clause realization
- base final bytesのBody-only parse + Independent Matcherに基づくexact reuse commitment
- target / support / act / scopeを一つの自然なReception predicationへ統合する準備
- candidate 12 / replan 1 / parser decomposition等の固定上限
- case / review / corpus / failure-family / control branch 0

## 6. STOP条件

次のいずれかが必要ならP2実装を停止する。

1. base orderingからleading meaningを一意に導出できない
2. Content Selection / Discourse Plannerに新priorityを追加する必要
3. required meaningを保持するため既存resourceを拡張する必要
4. Parser / Matcherがforward plan、AST、span map、candidate coverageを読む必要
5. base-body reuseがlexical / partial matchまたはforward self-claimに依存する
6. Reception support-positive unitを既存frozen authorityから構成できない
7. rc0029 final bytesへの追加修復が必要
8. case / control / review / corpus / failure family branchが必要
9. 承認済みowner / path外の変更が必要

## 7. 次の指示

次の境界はP2である。P1 freeze承認後、次の指示で進む。

> `rc0030 P1 five-concern semantic RED freezeを承認し、同一test / fixture / denominatorを不変にしたままP2 forward lexical projection / Surface realization plan / schema-free rendererを開始する。`

P2だけではGREEN、E2、E3、E4、Cycle 001完了を主張しない。
