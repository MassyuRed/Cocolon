# NLS v3 Step 11 rc0030 — E2 RED / STOP Handoff

作成日: 2026-07-20 JST  
対象: `Step 11 / Cycle 001 / rc0030 / E2`  
predecessor: `924bd458255f226db54c17d84dd4aafc5db2b1e2`  
handoff state: `E2_RED_FROZEN / STOP_BEFORE_NATURAL_SURFACE_REPAIR_AUTHORITY`

## 1. 結論

GitHub上のP5反映をexact照合した後、exact18 index 10のE2 integration testを
追加して実行した。

結果は`1 failed / 7 passed`である。唯一のREDは凍結代表0063の
forward density synchronizationであり、想定外failureは0である。

- P5: GREEN / immutable GitHub predecessor
- E2: RED / NOT GREEN
- E2 manifest successor: NOT CREATED
- E3 / E4: NOT STARTED
- Cycle 001: NOT ACCEPTED
- secure material: NOT REQUIRED

Natural Surface変更は今回のindex10-only authority外であるため、実装せず停止した。

## 2. 確認した事実

### 2.1 GitHub

E2 predecessorは
`924bd458255f226db54c17d84dd4aafc5db2b1e2`である。

P5 predecessorとの差分は承認済みexact 9 pathだけであり、GitHub blobは
P5 deliverableとbyte一致した。P5 manifest commitmentsも一致した。

### 2.2 今回のrepository change

新規1 pathだけである。

`ai/tests/test_emlis_nls_v3_s11_rc0030_e2_integration.py`

- SHA-256: `4edc9845e231e3ba8737c2f8bdd6e2bbe05d504c0e47a8b2343cb7b717518ee9`
- size: 25,860 bytes
- test node: 8
- skip / xfail: 0
- production owner change: 0

### 2.3 E2実測

実行:

```bash
PYTHONDONTWRITEBYTECODE=1 \
PYTHONPATH=/tmp/cocolon-p5-pytest:ai/services/ai_inference:ai/tests \
python -m pytest -q --noconftest \
  ai/tests/test_emlis_nls_v3_s11_rc0030_e2_integration.py
```

結果:

```text
1 failed, 7 passed in 288.07s
```

sole RED:

```text
STEP11_RC0030_E2_FORWARD_DENSITY_NOT_SYNCHRONIZED
```

underlying runtime code:

```text
STEP11_RC0030_SURFACE_PLAN_DENSITY_UNSATISFIABLE
```

sole RED nodeだけの独立再実行も、次のexact resultで再現した。

```text
1 failed in 56.31s
```

### 2.4 GREENになった範囲

7 GREEN nodeは次を確認する。

1. frozen authority、resource、retained 33 + pending 20 denominator
2. 0063以外のrepresentative 7でforward / Parser / Matcher / Gate / selector同期
3. Body-only Parser、Independent Matcher、selector order independence
4. generic body、coverage self-claim、stale source、replan攻撃のfail-close
5. relation、unknown、semantic link、Reception attack sentinelのfail-close
6. join cardinality、base exact reuse、zero-semantic Reception-onlyのfail-close
7. resource accountingとbody-free receipt

core denominatorは次を固定した。

| case | S | exact reuse | R | current result |
|---|---:|---:|---:|---|
| 0001 | 1 | 1 | 1 | selected |
| 0002 | 0 | 0 | 1 | selected |
| 0019 | 3 | 0 | 1 | selected |
| 0063 | 10 | 0 | 1 | forward RED |

### 2.5 sole RED accounting

0063は次の状態である。

- base candidate: 2
- base inverse prepass: 2
- base inverse reject: 0
- forward reject: 2
- experiment candidate: 0
- final Parser / Matcher / Gate: 0 / 0 / 0
- disposition: `no_valid_candidate`

現在のpackerは最大2 atom / structure-only unitであり、existing base clauseへ
融合せずgroup clauseへ加算する。0063は最良候補でもfirst groupが5 clauseとなり、
固定上限4を超える。

## 3. 推測

原因は0063固有branchの不足ではなく、high-density groupでsemantic packを
existing base clauseとは別clauseとして加算する共通planning modelにあると推測する。

既存grammatical chunkへsource-authorized semantic predicationを融合できれば、
resource拡張やatom dropなしで修復できる可能性がある。ただしParser / Matcherの
exact復元を維持できるかは実装前提ではなく、次のRED先行検証事項である。

## 4. 華恋の意見

E2をGREEN扱いしてmanifest successorやE3へ進むべきではない。

次は添付の設計20.3影響範囲補遺を承認し、index 10 REDをGitHubへ反映したcommitを
repair predecessorとして固定した後、Natural Surfaceのrc0030 suffixだけで
共通chunk fusionの可否を検証するのが正確である。

support-positive full-chain denominatorと、53 attackのactual proof mappingには
未完のevidence gapがある。density修復後もこれらを閉じるまでE2 GREENを主張しない。

## 5. 変更していないもの

- P5 exact two-predicate cardinality repair
- grounded lexicalization
- Natural Surface / Parser / Matcher / Hard Gate / runtime / catalog
- P1〜P5 frozen fixture / test
- Step 9全20 owner、E1b、rc0027〜rc0029 behavior
- shared runtime / public route
- resource bounds
- exact18 maximum
- P5 generated manifest / phase successor evidence

## 6. Mash側の必要作業

1. ZIPの`repository/`以下にあるexact 1 pathをmashos-apiへ反映する。
2. commit / pushする。
3. commit SHAを華恋へ伝える。
4. 設計20.3 impact addendumの修復境界を明示承認する。

その後の正確な指示案:

> rc0030 E2 RED / STOPと設計20.3 density synchronization影響範囲補遺を承認する。index 10 REDを反映したGitHub commit `<E2_RED_COMMIT_SHA>`をrepair predecessorとして、Natural Surfaceのrc0030 suffixとindex 10だけで、existing grammatical chunkへのowner-connected semantic predication fusionをRED先行で検証する。resource、Parser、Matcher、Gate、runtime、catalog、Step 9、E1b、rc0027〜rc0029、shared/publicを不変にする。E2全GREEN後だけmanifest successorを作り、既存authority外が必要なら再停止する。

