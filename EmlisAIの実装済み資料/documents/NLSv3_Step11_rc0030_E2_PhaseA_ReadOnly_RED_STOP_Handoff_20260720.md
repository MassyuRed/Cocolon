# NLS v3 Step 11 rc0030 — E2 Phase A Read-only RED / STOP Handoff

作成日: 2026-07-20 JST  
対象: `Step 11 / Cycle 001 / rc0030 / E2 evidence closure`  
predecessor: `2c789d3fa9f5a7a910c9a9392f2ebfd1bc009ea7`  
状態: `PHASE_A_RED_REPRODUCED / STOP_BEFORE_MATCHER_SUCCESSOR_AUTHORITY`

## 0. 結論

承認されたPending20 / Support-positive Phase A read-only REDを実行した。

Support-positiveの`D`と`I6-D02`は、frozen inputからbase candidateとBody-only base Parserへ
到達する。しかし全6候補がbase-binding再検証で閉じ、rc0030 experiment candidate以降は
0件となる。

最初に必要なproduction ownerはIndependent Matcher fileのrc0030-specific base contextであり、
現Phase Aでは変更禁止である。このためproductionを変更せずSTOPした。

- Phase A RED reproduction: `PASS`
- production change: `0`
- fixture change: `0`
- manifest successor: `NOT CREATED`
- E3 / E4: `NOT STARTED`
- Cycle 001: `NOT ACCEPTED`
- secure material: `NOT REQUIRED`

## 1. 確認した事実

### 1.1 GitHub照合

- commit: `2c789d3fa9f5a7a910c9a9392f2ebfd1bc009ea7`
- parent: `1997d860cf02cd9b10ff502f0d5099c014d4eb1c`
- diff: exact 2 path
- GitHub matcher blob: `b9b010425ad717bd6af690fba14698bd8e9c804d`
- GitHub E2 test blob: `9f51b7db0aa3f555aa779119c4d641869b9eee69`

前回ZIPのbytesとGitHub mainのbytesは一致した。このcommitをclean worktreeへ取得し、Phase Aの
formal predecessorにした。

### 1.2 今回のrepository変更

変更は承認されたwrite exact 1だけである。

`ai/tests/test_emlis_nls_v3_s11_rc0030_e2_integration.py`

追加内容:

1. frozen support fixtureのpath / SHA / case ID確認
2. cohort-independentな機械projection
3. support-bearing base candidateの実在確認
4. base Parser / Matcher実行数とclosed resultのbody-free固定
5. GREEN後に実bodyからsupport部分を除いた再parse / rematch確認

raw body、owner text、support textはreceiptへ含めない。

### 1.3 RED実行結果

| case | base candidate | support-bearing | base Parser / Matcher | experiment | final Parser / Matcher / Gate |
|---|---:|---:|---:|---:|---:|
| D | 2 | 2 | 2 / 2 | 0 | 0 / 0 / 0 |
| I6-D02 | 4 | 4 | 4 / 4 | 0 | 0 / 0 / 0 |

全6候補:

`STEP11_RC0030_BASE_BINDING_REVALIDATION_FAILED`

Phase A test:

```text
1 failed in 70.65s
STEP11_RC0030_E2_SUPPORT_POSITIVE_FULL_CHAIN_UNREACHABLE
```

補助確認:

```text
frozen authority: 1 passed in 0.39s
collect: 13 tests collected
git diff --check: PASS
Python compile: PASS
```

### 1.4 Pending20

frozen exact 20 IDと順序は維持されている。代表8だけではsupport-bearing caseを構成できず、
`reception-support-omission`を含むsupport依存のclosureには外部frozen authorityのfull chainが
必要である。

今回そのfull chainがproduction owner境界で停止したため、Pending20を20 / 20実行済みとは
扱っていない。既存の部分的guardもexact ID ledgerへ読み替えていない。

## 2. 推測

rc0030-specific base contextで、base candidate全体のglobal verifiedと、source-authorized exact
reuse / Reception scheduleの責任を分離できれば、shared Matcherを変更せずにsupport-positive
caseをfinal chainへ送れる可能性がある。

Natural Surface、final Parser、final Matcher、Hard Gateは未到達であり、現時点では変更必要と
推測しない。Matcher修復後に別ownerが必要と判明した場合は再STOPする。

## 3. 華恋の意見

Phase Aは目的どおり完了したが、結果はGREENではなくRED / STOPである。ここでmanifestへ
進むと、support-positive denominatorとPending20の未完了を隠すことになる。

次は同梱した設計20.3補遺を承認し、原因が確定したMatcher rc0030 suffixとE2 testだけで
Phase Bへ進むのが正確である。

## 4. Mash側に必要な作業

ZIPの`mashos-api/`以下にある次のexact 1を、同じrepository pathへ反映してcommit・pushし、
commit SHAを教えてほしい。

`ai/tests/test_emlis_nls_v3_s11_rc0030_e2_integration.py`

そのSHAをrepair predecessorとして固定し、同梱した影響範囲補遺§9を明示承認してもらった後、
Phase Bへ進む。

manifest pathは今回のZIPに含めていない。
