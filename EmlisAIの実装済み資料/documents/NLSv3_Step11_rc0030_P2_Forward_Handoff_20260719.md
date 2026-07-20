# NLS v3 Step 11 rc0030 — P2 Forward Handoff

作成日: 2026-07-19 JST  
対象: `Step 11 / Cycle 001`  
handoff state: `P2_FORWARD_COMPLETE / STOP_BEFORE_P3`

## 1. 結論

P1 freezeを保持したまま、P2の次の3責任を実装・検証した。

1. rc0027 grounded phraseとE1b typed authorityからのclause-ready lexical projection
2. owner-connected Surface realization plan
3. schema-free rendererとgrounded Reception predication

最終P2 suiteは`17 / 17 PASS`である。P2はここでfreeze候補にできる。ただし、P3、P4、P5、E2、E3、E4は未開始であり、Cycle 001は`NOT_ACCEPTED`のままである。

正確な次の境界は、`P2 freeze承認 → P3 Body-only Parser / Independent Matcher開始`である。

## 2. GitHub predecessor

GitHub `MassyuRed/mashos-api`のmainを再確認し、最新commitは次で不変だった。

`8d337a2aeaeac338d012be3c558d05265404e201`

このcommitにあるP1 fixture / RED testをimmutable predecessorとして扱った。

- P1 fixture SHA-256: `9cfbdafaf43a3caed8b5dc00e68b56cd2b24003a002f0a7cbd1c3ec06d598fa5`
- P1 test SHA-256: `56bc3603392df982ae748c9c4ae635fc7eca7867213f77bab1de051f35f38191`

## 3. 変更fileと根拠・必要性

### MODIFY — append-only

1. `ai/services/ai_inference/emlis_ai_step11_grounded_lexicalization_v3.py`

   - 根拠: clause-ready referentのauthorityは、immutable rc0027 grounded phraseとE1b ownerである。
   - 必要性: rc0029 generic semantic-head collisionへ依存せず、ownerをbase nucleus / obligation / groupへ一意に接続するため。
   - 不変: 先頭103,805 bytesのSHA-256は`43e99c60...bff4`で一致。

2. `ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py`

   - 根拠:既存Surface plan / AST / rendererの責任ownerである。
   - 必要性: typed atomをowner-connected chunkへexactly onceで割り当て、planの文法chunkと実際の句読点を一致させ、Receptionのtarget / support / actを一つのpredicationへ統合するため。
   - 不変: 先頭290,131 bytesのSHA-256は`2f797d7a...7a2`で一致。

### NEW

3. `ai/services/ai_inference/emlis_ai_step11_rc0030_experiment_surface_catalog_v3.py`

   - 根拠: schema-free realizationには、case cueを持たないversioned declarative authorityが必要である。
   - 必要性: 13 construction、28 relation type/direction、10 semantic link、4 unknown等を、各key exactly 1 alternativeで閉じるため。

4. `ai/tests/test_emlis_nls_v3_s11_rc0030_surface_planning_mutation.py`

   - 根拠: P1の期待値を変更せず、P2だけを直接検証する境界testが必要である。
   - 必要性: determinism、resource、owner connection、chunk/render一致、Reception association、偽exact reuse、cross-family basis misuseをfail-closeで固定するため。

ZIPへ入れるrepository fileは、この4 fileだけである。P1 fixture / testは変更していないため再同梱しない。

## 4. 実装上の重要点

- rc0030 lexical projectionはrc0029 handle builderへ委譲しない。
- referentはrc0027 grounded phraseそのものを使用し、opaque ordinal、schema label、raw quote、completed sentence bankを作らない。
- typed atomは`semantic chunk XOR P3 verified exact reuse`へexactly onceで入る。
- semantic itemは最大2件を一つのnominal packにし、finite predicateはpackごとに1個だけ置く。
- plannerはgroupのtail chunk以後だけへ追加し、rendererは同一chunkを`、`、chunk遷移を`。`で描画する。
- exact reuseのmatch basisはsemantic familyと1対1で照合する。
- 0100のmulti-group ownerは、immutable obligation overlapが一意最大のowner-connected groupで解決する。
- Receptionはsource opportunity IDを全件accountし、base exact associationとunmapped required opportunityのbounded scheduleを区別する。
- forwardはParser、Matcher、Hard Gate、runtime adapterをimportせず、semantic coverageを自己認証しない。

## 5. 検証結果

### P2

```text
17 passed
0 failed
0 errors
0 skipped
0 xfailed
1 unrelated Pydantic deprecation warning
143.20 seconds
```

主な検証範囲:

- exact4 frozen prefix / P1 bytes
- closed catalog denominator / one alternative per key
- 0001 / 0009 / 0035 / 0100のdirect lexical・plan・render
- 0035 high-density nominal packing
- plan chunkとrendered句読点の一致
- 0100 multi-group ownerとexact + bounded-scheduled Reception
- malformed exact reuse 6種
- cross-semantic-family match basis流用

### P1 freeze

P1 fixture / testはbyte不変で、最終source状態でも次を維持した。

```text
1 passed
5 intentionally failed
0 errors / skips / xfails
111.29 seconds
```

5 closed codeも不変である。

1. `STEP11_RC0030_MAIN_MEANING_APPENDIX_DOMINANCE`
2. `STEP11_RC0030_SCHEMA_EXPOSITION`
3. `STEP11_RC0030_SURFACE_DISTRIBUTION_OVERCONCENTRATED`
4. `STEP11_RC0030_GROUNDED_RECEPTION_PREFIX_LIST`
5. `STEP11_RC0030_CONTROL_NON_REGRESSION`

P2だけではP1をGREENにしない。P1 GREENはP3 / P4後のP5責任である。

### predecessor

rc0029 predecessor immutability、rc0027 default behavior、rc0028 experiment behavior、rc0029 runtime disconnectの選択11 testは`11 / 11 PASS`だった。

## 6. 代表8件のP2 read-only smoke

これはE3 machineでもProduct Readでもない。本文はexportしていない。

- P3 exact reuseなしでforward候補あり: 0001、0002、0009、0019、0035、0043、0100
- 0063: 2 base candidateとも`STEP11_RC0030_SURFACE_PLAN_DENSITY_UNSATISFIABLE`

0063では、P3がまだ無いため全typed atomを追加扱いにしている。required atomをdropしたりresource上限を広げたりせず、fail-closeを維持した。

## 7. 事実・推測・華恋の意見

### 確認した事実

- GitHub mainはcommit `8d337a2a...e201`のままである。
- P2 final suiteは17 / 17 PASSした。
- P1は同一5 REDのままfreezeされている。
- Matcher / Hard Gateのfull hash、exact4 prefix、P1 fixture / test hashは不変である。
- P3以降とruntime / manifest / toolは開始していない。
- 0063はP3 exact-reuse commitmentなしでは既存resource内に候補を作れない。

### 推測

- 0063はbase本文にすでに表現されたatomをP3がbody-onlyにexact証明できれば、追加unit数を減らして既存resource内へ入る可能性がある。
- ただし、これはP3実行前の推測であり、現時点ではsemantic coverageもProduct Read acceptanceも証明していない。

### 華恋の意見

P2はここでfreezeするのが正確である。0063をP2だけで通すために上限を拡張したりatomを落としたりするのは、今回の設計意図に反する。

次はP3で、base final bytesとrc0030 final bytesをbody-onlyに読むParser、およびvalidated source authorityだけを相手にするIndependent Matcherを実装すべきである。P4 Hard Gate / runtime / manifestへはまだ進まない。

## 8. 次の指示

> `rc0030 P2 forward freezeを承認する。GitHubへ反映したP2 file hashをpredecessorとして、exact4 frozen prefix、P1 fixture / test、resource denominatorを不変にし、P3 Body-only Parser / Independent Matcherを開始する。Parser / Matcherはfinal bytesとversioned catalog以外のforward plan、candidate AST、span map、candidate-declared owner / coverageを読まず、base-body exact reuseをfamily-specific exact basisで一意bindingする。既存authority外またはresource拡張が必要なら停止して影響範囲を提示する。`

Mash側の追加作業やsecure materialは、現時点では不要である。
