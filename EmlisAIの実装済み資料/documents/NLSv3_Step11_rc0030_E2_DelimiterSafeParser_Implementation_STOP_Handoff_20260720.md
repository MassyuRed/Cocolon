# NLS v3 Step 11 rc0030 — E2 Delimiter-safe Parser 実装STOP Handoff

作成日: 2026-07-20 JST  
対象: `Step 11 / Cycle 001 / rc0030 / E2`  
predecessor: `1997d860cf02cd9b10ff502f0d5099c014d4eb1c`  
状態: `DELIMITER_SAFE_PARSER_GREEN / E2_EVIDENCE_CLOSURE_STOP`

## 0. 結論

承認されたexact 2 repository path内で、delimiter-safe owner expressionの
bounded Parser修復を実装した。

0063はBody-only Parserでsemantic atomを`10 / 10`復元し、Independent Matcherが
source-authorized候補をexact 1へ閉じ、Parser / Matcher / Gate / selectorのfull chainで
selectedになった。owner-ready deferral、`S=10 / reuse=0 / R=1`、resource上限は維持した。

ただし、E2の正式なevidence closureには未実行のpending 20 attackと、support-positive
authorityを使ったrc0030 full-chain証拠が残る。したがってmanifest successor、E3、E4は
開始していない。

- bounded Parser repair: `GREEN`
- E2 integration 12: `GREEN`
- retained rc0029 attack 33: `GREEN`
- pending rc0030 attack 20: `NOT EXECUTED AS EXACT LEDGER`
- support-positive rc0030 full chain: `AUTHORITY REQUIRED`
- E2 formal closure: `STOP`
- Cycle 001: `NOT ACCEPTED`

## 1. 確認した事実

### 1.1 predecessor

GitHub mainの`1997d860cf02cd9b10ff502f0d5099c014d4eb1c`は、直前の
`c5c02940a80a7f1238b8983b4657289af19e5790`に対する1 commitであり、承認済み
owner-ready deferral exact 3だけを変更していた。ローカル成果物とGitHub bytesのhashも
一致したため、このcommitを今回の正式predecessorとした。

### 1.2 変更範囲

変更したrepository pathはexact 2である。

1. `ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py`
2. `ai/tests/test_emlis_nls_v3_s11_rc0030_e2_integration.py`

Natural Surface、catalog、Grounded Lexicalization、Gate、runtime、manifest、fixture、
Step 9、E1b、rc0027〜rc0029、shared/public routeは変更していない。

### 1.3 Parser / Matcher修復

1. construction / explicit unknownの既存exact owner表現はそのまま維持した。
2. relation / semantic linkでdelimiter候補がexact 1なら既存raw exact-owner経路を維持した。
3. delimiter候補がexact 2の場合だけ、raw候補をwitnessへ残さず、domain-separated hash
   commitmentとowner-prefix hashを保持する。
4. 3候補目はappend前にfail-closeし、atom-local候補保持数を常にmax 2以内にした。
5. Independent Matcherはforward planを参照せず、source-authorized endpoint commitmentと
   prefix commitmentを独立生成し、0解または複数解を拒否してexact 1だけを採用する。
6. candidate比較は既存`comparison 576`へ全件課金する。
7. parsed witness schemaはV1を明示的に残し、current aliasをV2へ固定した。
8. raw candidate、raw body、owner expressionはshareable materialへ出さない。

### 1.4 resource / role boundary

- Parser public signature: body only
- body scan pass: `2`
- owner candidate stored max: `2`
- evaluated decomposition max: `76`
- owner comparison max: `576`
- body max: `1 MB`
- case / family / corpus固有production branch: `0`
- forward metadata参照: `0`

既存`peak_stored_decomposition_count`はouter-tail decomposition専用の意味を維持し、
owner候補boundへ転用していない。owner候補はatom-local tupleで直接max 2を検査する。

### 1.5 追加した攻撃証拠

- delimiter candidate exact 1 resolution
- source-authorized 0解 / 2解拒否
- candidate順序のfirst-wins拒否
- delimiter drop / collapse拒否
- endpoint swap / direction swap拒否
- 3 delimiter境界のstored bound超過拒否
- parser-issued prefix mutationの0解拒否
- raw候補とbody bytesのbody-free確認

### 1.6 test結果

```text
E2 integration full:
12 passed in 309.75s

P3 Parser boundary + P5 control:
16 passed in 43.76s

P2 deterministic forward/render:
4 passed in 126.25s

E2 selected control 7:
1 passed in 219.19s

retained rc0029 mandatory attacks:
33 passed in 358.43s
```

`git diff --check`とPython compileもPASSした。skip / xfail / mock-only GREENは使用していない。

### 1.7 残件

1. `rc0030_representative8_body_free.json`はpending attack IDを20件固定するが、
   `pending_attacks_count_as_executed_at_p1`はfalseのままである。
2. exact 20 IDはfixtureとP1 freeze確認にしか存在せず、ID単位のexecutor / result ledgerがない。
3. representative 8の`reception_supports`は全件0である。
4. frozen unit authorityにはsupport-positiveの`D` / `I6-D02`があるが、rc0030の
   Parser / Matcher / Gate full chainへ接続した証拠はない。

## 2. 推測

pending 20の多くは既存E2 guardで部分的に拒否されている。しかし、攻撃IDと実行結果の
exact mappingがないため、20 / 20 closureとは主張できない。

support-positiveについては既存productionがgenericに通る可能性がある。ただし、現在の
representative 8だけではその可否を判定できない。まずexisting frozen unit authorityを
read-onlyで接続するREDが必要である。

## 3. 華恋の意見

今回のParser修復は保持すべきである。delimiter衝突をcase branchやcatalog escapeへ逃がさず、
Body-only ParserとIndependent Matcherの責任分離を保ったまま既存resource内で閉じた。

一方、integration 12がGREENでも、明示されたpending 20とsupport-positive denominatorを
未実行のままE2全GREENまたはmanifest successorと扱うべきではない。次は同梱する
設計20.3補遺を承認し、read-only REDで必要ownerを判定するのが正確である。

## 4. Mash側に必要な作業

ZIPの`mashos-api/`以下にあるexact 2 repository pathを同じ相対pathへ反映し、
commit・push後のSHAを教えてほしい。そのSHAを次のattack-closure predecessorとして固定する。

manifest pathは本ZIPに含めていない。
