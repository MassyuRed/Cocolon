# NLS v3 Step 11 rc0030 — E2 Owner-ready Deferral 実装STOP Handoff

作成日: 2026-07-20 JST  
対象: `Step 11 / Cycle 001 / rc0030 / E2`  
repair predecessor: `c5c02940a80a7f1238b8983b4657289af19e5790`  
状態: `OWNER_READY_DEFERRAL_IMPLEMENTED / BODY_ONLY_PARSER_STOP`

## 0. 結論

承認されたexact 3 repository path内で、max2 packを維持する
earliest-ready deterministic deferralを実装した。

0063 candidate 2のforward scheduleは、ready `3 / 1 / 2`から
assigned `2 / 2 / 2`へ修復できた。candidate 1はresource不足のまま
fail-closeする。resource peakは既存上限`4 / 2 / 4 / 2`を維持した。

しかし、candidate 2のgroup 3にあるdirected relationは、owner referent内部に
catalogのsource-particle separatorを含む。rendererが追加するendpoint separatorと
合わせて同一separatorが2箇所になり、凍結中のBody-only Parserが
`STEP11_RC0030_OWNER_EXPRESSION_AMBIGUOUS`でそのpackを構文解析できない。

Parserはgroup 3全体をsemantic tailなしとして扱うため、10 atom中7 atomだけが
parsed witnessへ入り、Independent Matcherは最終的に
`STEP11_RC0030_BASE_PREFIX_COMMITMENT_MISMATCH`で閉じる。

これは承認済み補遺の再STOP条件「Parser変更が必要」に該当する。
したがって、manifest successor、E3、E4は開始していない。

- owner-ready scheduling: `GREEN`
- 0063 full chain: `RED / PARSER BOUNDARY`
- representative control 7: `GREEN`
- E2: `NOT ALL GREEN`
- manifest successor: `NOT CREATED`
- E3 / E4: `NOT STARTED`
- Cycle 001: `NOT ACCEPTED`
- secure material: `NOT REQUIRED`

## 1. 確認した事実

### 1.1 predecessorと変更範囲

GitHub commit
`c5c02940a80a7f1238b8983b4657289af19e5790`をrepair predecessorとして使用した。

変更したrepository pathは承認どおりexact 3である。

1. `ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py`
2. `ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py`
3. `ai/tests/test_emlis_nls_v3_s11_rc0030_e2_integration.py`

manifest、catalog、Gate、runtime、fixture、Step 9、E1b、rc0027〜rc0029、
shared/public pathは変更していない。case ID / family固有production branchも追加していない。

### 1.2 Natural Surface

Natural Surfaceは、現行stable orderとmax2 packingを維持したまま、各packについて
`ready_group .. last_group`を昇順走査する。

各候補destinationで次を副作用なしに試算し、全条件を満たす最初の位置だけへcommitする。

- group unit count
- tail chunk / new chunk
- visible clause count
- grammatical complexity load
- repeated joiner count

全ownerが導入される前への配置は行わず、どこにも配置できなければ既存density codeで
fail-closeする。

### 1.3 Independent Matcher

Independent Matcherはforward plan、candidate AST、span map、covered IDsを受け取らず、
base-body witness、verified base binding、source authorityだけから同じscheduleを再導出する。

Matcher側でもmax2、stable order、owner readiness、resource上限を独立検査する。

### 1.4 0063 schedule証拠

| item | result |
|---|---:|
| source semantic atoms | 10 |
| structure-only packs | 6 |
| maximum atoms / pack | 2 |
| ready packs | `3 / 1 / 2` |
| assigned packs | `2 / 2 / 2` |
| strict deferred pack | 1 |
| candidate 1 | density fail-close |
| candidate 2 | forward candidate produced |
| peak group units | 4 |
| peak chunk clauses | 2 |
| peak complexity | 4 |
| peak repeated joiners | 2 |

全bindingで
`assigned_group >= max(owner_sentence_group_ordinals)`が成立する。

### 1.5 Parser STOP証拠

candidate 2のbody-only parse結果は次である。

| group | planned atoms | parsed atoms |
|---|---:|---:|
| 1 | 4 | 4 |
| 2 | 3 | 3 |
| 3 | 3 | 0 |
| total | 10 | 7 |

group 3の最終directed relationは`source_to_target`である。

- source referent内のsource-particle separator: 0
- target referent内のsource-particle separator: 1
- rendererがendpoint間へ追加するseparator: 1
- parse対象prefix内の同一separator位置: 2

`_step11_rc0030_parse_owner_expression()`はdirected relationのseparator分解が
exact 1でなければfail-closeする。そのためpack内のrelation itemは
`STEP11_RC0030_OWNER_EXPRESSION_AMBIGUOUS`になる。

このitem bytesはgroup、chunk、pack順序に依存しない。したがって、今回許可された
schedulerまたはsemantic-placement validatorだけでは回避できない。

### 1.6 test結果

```text
representative control 7:
1 passed in 212.33s

P2 deterministic forward-plan/render control 4:
4 passed in 123.78s

P3 parser-signature / forward-import rejection:
13 passed in 0.28s

P5 cardinality / control non-regression:
3 passed in 40.28s

0063 density/full-chain node:
1 failed in 62.53s
STEP11_RC0030_E2_BODY_ONLY_OWNER_EXPRESSION_NOT_SYNCHRONIZED
```

0063 runtime closed result:

`STEP11_RC0030_BASE_PREFIX_COMMITMENT_MISMATCH`

補足として、P3のcurrent-byte hash nodeはP3時点のMatcher全bytesを固定しているため、
承認済みMatcher successorを適用すると設計上REDになる。このhistorical stage-lock testは
上書きしていない。P2のpost-P4 runtime-absence testも同様にphase-local evidenceである。

### 1.7 evidence closureの残件

Density GREENへ到達していないため、補遺の順序どおり53 attack ledgerへは進んでいない。

- retained 33: exact executable nodeは存在するが、fresh runとresult ledgerは未完
- pending 20: 複数は既存P2/P3/P5/index 10で構成可能
- `reception-support-omission`: representative 8がsupport-positive 0件のため構成不能
- support-positive full chain: 新しいdenominator authorityが必要

## 2. 推測

resourceを拡張せずに修復する最小候補は、Body-only Parserがowner-expressionの
separator分解候補を既存stored bound内で保持し、Independent Matcherがsource authorityと
visible owner registryからexact 1候補だけを選ぶbounded ambiguity handoffである。

ただし、現parsed witness schemaは単一`owner_expressions`だけを保持する。
候補集合の表現、commitment、origin validation、Matcherのunique-resolutionを変更するため、
これは現承認のsemantic-placement責任には含まれない。

catalog escapeまたはupstream lexical referent naturalizationも技術的候補だが、
catalog / lexical ownerを広げるため、まずParser-local bounded successorの可否を
REDで判定する方が影響範囲は小さい。

## 3. 華恋の意見

今回のdeferralを破棄する必要はない。SurfaceとMatcherは独立に同じbounded scheduleを
導出できており、旧density原因は解消している。

一方で、parsed 7/10を10/10として扱う、prefix checkを緩める、relationをdropする、
0063だけ別表現にする、またはmanifestを先に作るべきではない。

正確な次工程は、本ZIPのexact 3をmashos-apiへ反映してcommit SHAを固定し、同梱する
delimiter-safe owner-expression補遺を明示承認してから、Body-only Parserのbounded REDへ
進むことである。

## 4. Mash側に必要な作業

本ZIPの`mashos-api/`以下にあるexact 3 repository pathを同じ相対pathへ反映し、
commit・push後のSHAを教えてほしい。

そのcommitをParser successorのpredecessorとして固定する。

manifest pathは本ZIPに含めていない。
