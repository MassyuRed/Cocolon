# NLS v3 Step 11 rc0030 — P4 Activation Supplement

作成日: 2026-07-19 JST  
対象: `Step 11 / Cycle 001 / rc0030`  
authority state: `APPROVED / P4 ONLY`

## 1. 目的

本補足は、設計20.3 §6.2の`NEW rc0030 exact 18 path`と、
§6.4のP4 dependency manifest GREEN条件をphase単位で両立させる。
既存の意味authority、owner、resource、production接続を拡張しない。

`exact 18`はrc0030全工程のclosed maximum allowlistであり、
P4時点で全18 pathが存在することを要求しない。

## 2. predecessorの分離

| role | commitment |
|---|---|
| historical rc0030 experiment baseline | `e1e2ec5c17fa165f9972373304899802832ecd5b` |
| immutable rc0029 parent closure | `cd46925c6db478ac07e501acb64c45cae3a122ab0c1d834d06a83f1190cfb082` |
| P4 phase predecessor | `afcd089a872d71b07930592b068bdc3d480b8e3b` |

historical baselineとP4 phase predecessorを同じfieldへ上書きしない。
P4 manifestは両者を別commitmentとして保持する。

## 3. P4 active path

P4では設計20.3 §6.2の次のindexだけをactiveとする。

1. dependency manifest service
2. disconnected runtime adapter
3. versioned Surface catalog
4. dependency manifest tool
6. generated phase manifest
7. representative 8 body-free fixture
8. P1 RED freeze test
9. P2 mutation test
11. P3 forward/inverse independence test
12. P4 runtime-disconnect test
18. P4 dependency-closure test

上記11 pathのうち、generated manifest自身であるindex 6は
自身の`file_hashes`と`new_file_hashes`から除外する。
したがってP4のnew hashed pathは10件である。

## 4. P4 reserved-and-required-absent path

P4では次の7 pathが存在した場合にfail-closeする。

5. bounded experiment tool
10. E2 integration test
13. predecessor immutability test
14. predecessor behavior regression test
15. control non-regression test
16. E3 representative 8 test
17. E4 frozen 100 read-only test

reserved pathを空file、placeholder、skip、xfailとして先行作成しない。

## 5. monotonic activation

後続activationは次の順だけを許可する。

| phase | newly active index |
|---|---|
| P5 Regression | 13, 14, 15 |
| E2 Integrated Synchronization | 10 |
| E3 Machine / Product Read | 5, 16 |
| E4 Frozen 100 | 17 |

各phaseは直前phaseのGitHub commitを新しいphase predecessorとして固定し、
active hash集合を単調に増加させる。reserved pathの早期activation、
filesystem discoveryによる追加、phase飛越しを禁止する。

## 6. P4 manifest contract

P4 manifestは少なくとも次を固定する。

- exact 18 maximum allowlist
- P4 active 11 / hashed 10
- reserved-and-required-absent 7
- later-phase activation map
- exact 4 frozen prefix byte length / SHA-256
- exact 4 current full-file SHA-256
- immutable rc0029 parent file / artifact / closure / source count
- historical baselineとP4 phase predecessorの分離
- static / dynamic project import edges
- unexpected / unbound / forbidden reverse / reserved-present `0`
- `experimental_only=true`
- `runtime_connected=false`
- `eligible_for_formal=false`
- `eligible_for_production=false`
- rc0027 / rc0028 / rc0029 behavior-equivalence commitment
- path ascending deterministic rebuild

generated manifest自身のfile SHA-256とartifact SHA-256は、
外側のbody-free receiptでbindする。

## 7. 不変条件

- Step 9全20 ownerを変更しない。
- P2 / P3 frozen prefixと既存symbolを変更しない。
- rc0027 / rc0028 / rc0029-prefixed behaviorを変更しない。
- shared runtime / public route / reply / DB / RN / Safety / question ownerへ接続しない。
- case / control / corpus / review / failure-family固有branchを作らない。
- final bytesのBody-only Parser / Independent Matcher検証を迂回しない。
- candidate `<= 12`、replan `<= 1`、owner `<= 24`、body `<= 1 MB`を維持する。
- P4完了をP1、P5、E2、E3、E4、Cycle 001完了と表記しない。

## 8. 承認された実行境界

P4で実装してよい範囲は、additive Hard Gate / selector、
disconnected runtime、P4 phase manifest / tool / fixture / closure testである。
P5以降は開始しない。

既存P3 authorityの変更、reserved pathのactivation、resource拡張、
またはIndependent Matcherの迂回が必要になった場合、実装を停止して
新しい設計20.3影響範囲補遺を提示する。
