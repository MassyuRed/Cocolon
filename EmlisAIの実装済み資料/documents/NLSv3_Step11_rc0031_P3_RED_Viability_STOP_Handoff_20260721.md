# NLS v3 Step 11 rc0031 P3 RED Viability STOP Handoff

作成日: 2026-07-21 JST  
対象: `Step 11 / Cycle 001 / rc0031 / P3 Body-only Parser + Independent Matcher`  
immutable predecessor: `9f8a816a66e75cedb6fcc09ddec00e4bf78bbb4d`  
設計正本SHA-256: `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc`  
状態: `P3_RED_EXACT2_FROZEN / STOP_BEFORE_PRODUCTION_IMPLEMENTATION`

## 0. 結論

承認されたP3 RED先行作業を実行し、production sourceを編集する前にSTOP条件を検出した。

0001のfreeze済みbase本文には、既存のBody-only base parserとIndependent base matcherで
一意にexact bindingできる`explicit_unknown`が1件ある。同じsource意味をrc0031 P2候補が
追加命題として再提示し、P2側のexact reuseは0件である。

これは、同じ意味をbase bodyとadded clauseへ重複させず、exact reuseは独立検証後だけ
creditするという設計境界と両立しない。現行P2のpublic/private composition seamは
non-empty reuseを`STEP11_RC0031_P3_EXACT_REUSE_NOT_AVAILABLE`で拒否するため、
Matcherへのrc0031 suffix追加だけでは本文中の重複を消せない。

したがって、P3 production implementation、P4、runtime、manifest、E2以降は開始していない。

## 1. 今回の実施境界

### 実施したこと

- GitHub mainのcommit `9f8a816a66e75cedb6fcc09ddec00e4bf78bbb4d`をP2 freeze predecessorとして確認
- Revised Cycle詳細設計正本とrc0031影響範囲補遺を再照合
- matcher、Natural Surface、catalog、P1/P2 test、rc0030 inverseの役割を全体監査
- production source不変でP3 viability RED exact 2を新規作成
- P1、P2、rc0030 P3、rc0030 predecessor behaviorを回帰確認

### 実施していないこと

- rc0031 Parser / Matcher production code
- Natural Surface、catalog、fixture、P1、P2、Gate、runtime、manifestの変更
- P4 / P5 / E2 / E3 / E4
- shared/public route、reply、DB、RN、Safety、question ownerへの接続
- skip、xfail、mock-only GREEN、resource拡張

## 2. 確認した事実

### 2.1 predecessorとauthority

- GitHub predecessorは`9f8a816a66e75cedb6fcc09ddec00e4bf78bbb4d`である。
- rc0031 P2の4ファイルはfreeze時のfull SHA-256を維持した。
- matcherの既存722,658 bytesはSHA-256
  `648a3a6690f8df860053c811a5416fcfc9983524e5ff880a0e6921a122a52e30`
  のままである。
- 新規repository fileは予約済みexact18 index 11のP3 test 1件だけである。
- production source changeは0件である。

### 2.2 P3 RED exact 2

新規test:

`ai/tests/test_emlis_nls_v3_s11_rc0031_forward_inverse_independence.py`

test SHA-256:

`a69856605fcbfd633255ff56649985d808dec1442672c9bd9fa1298f8633a680`

collection / execution:

```text
2 collected
1 PASS
1 intentional RED
```

RED closed code:

```text
STEP11_RC0031_P3_DUPLICATE_BASE_REEXPOSITION_NOT_RESOLVED
```

node 1はP2 freeze、P3 exact path、body-free fixture、既存resource boundaryを確認する。
matcherについては将来の正規appendを拒否しないよう、full-fileではなく722,658-byte prefixを固定する。

node 2はmissing symbol、unconditional fail、mockを使わない。0001のbase bytesだけを既存の
body-only base parserへ渡し、parser-issued witnessとimmutable source authorityだけで
independent base matchを行う。その結果と、validated P2 candidateがcanonical renderする
source atomをtest内でdifferential比較する。

### 2.3 0001で機械確認した分母

body-free countだけを記録する。

| 項目 | 実測 |
|---|---:|
| rc0031 P2 candidate | 1 |
| P2 added semantic atom | 1 |
| added family | `explicit_unknown` |
| independent base exact reuse | 1 |
| base reuse family | `explicit_unknown` |
| source意味のintersection | 1 |
| P2 declared exact reuse | 0 |

同じsource ID・dimension・targetへexactに対応しており、単なる語彙類似ではない。

```text
immutable base bytes
  -> frozen body-only base parser
  -> independent exact reuse 1
                              \
                               same source meaning -> duplicate 1 -> STOP
                              /
rc0031 P2 forward candidate
  -> added explicit_unknown 1 / declared reuse 0
```

### 2.4 grammar全体の静的監査

rc0031 catalog自体については次を確認した。

- construction suffix 13種に相互suffix collision 0
- relation / semantic-link template 38種にfull duplicate 0
- relation templateはsource / targetを各1回持つ
- compact compositionのterminal候補は既存stored bound内に収められる見込み
- 0063のS=10 / R=1 / exact reuse=0、resource実測4 / 2 / 4 / 1はP2回帰で維持

したがって、0063 grammarだけが直ちに不成立なのではない。STOP理由は、0001のbase reuseと
forward re-expositionを接続するauthorityがP2 freeze境界に存在しないことである。

### 2.5 回帰結果

| suite | 結果 | 解釈 |
|---|---:|---|
| rc0031 P3 viability | 1 PASS / 1 intentional RED | 今回のSTOP証拠 |
| rc0031 P1 exact 7 | 1 PASS / 6 intentional RED | 同じ分母を維持 |
| rc0031 P2 exact 24 | 23 PASS / 1 historical stage-lock RED | P3 test path追加だけを検知 |
| rc0030 P3 + predecessor behavior | 57 PASS / 1 historical stage-lock RED | rc0030 P3の過去P2 bytes lockだけが後続bytesを検知 |
| rc0030 predecessor behavior | 4 PASS | 既存挙動非回帰 |

rc0031 P2 historical stage-lock code:

`STEP11_RC0031_P2_PATH_SCOPE_INVALID`

P3 pathが存在しないP2時点を固定した過去phase sentinelであり、残り23 semantic / mutation nodeは
PASSした。このtestを見かけ上GREENにするためのfreeze変更はしていない。

rc0030 historical stage-lock code:

`STEP11_RC0030_P3_P2_PREDECESSOR_DRIFT`

rc0030 P3時点の過去P2 full bytesと、承認済み後続suffixを区別するsentinelである。

## 3. 推測

0001を含むP3 full-chainを正しくGREENにするには、base bodyを独立に検証したreuse bindingを
forward planningより前へ渡し、そのsource atomをadded propositionから除外するcomposition境界が
必要と考える。

現行P2 sourceには将来用のprivate composition seamがあるが、P2ではauthority不足を理由に
non-empty値を意図的に拒否している。したがって、P3 matcherのappendだけでなく、P2 freeze後の
Natural Surface composition responsibilityを再定義する必要がある可能性が高い。

これはまだ次の設計補遺でexact owner / path / phase順を確定すべき推測であり、今回production codeへ
反映していない。

## 4. 華恋の意見

このREDは保持すべきであり、P3 matcherがbase側を無視する、added側だけへbindingする、または
重複をexact coverageとして数える実装へ進むべきではない。それらはtestをGREENに見せても、
「final bytesから意味を一意に再構成する」というP3の役割を壊す。

また、P2 frozen testを先にphase-awareへ書き換えても、0001本文の重複自体は解消しない。
path-scope sentinelとsemantic blockerを分離し、先にverified reuse compositionのauthorityを
設計し直すのが妥当である。

## 5. 変更scope

### repository NEW exact 1

- `ai/tests/test_emlis_nls_v3_s11_rc0031_forward_inverse_independence.py`

### repository MODIFY

- なし

### production source change

- なし

### 維持したもの

- P2 freeze commitと4ファイル
- P1、fixture、closed code、control、attack
- candidate 12、replan 1、owner 24、referent 32
- parser body 1,000,000、loci 38、evaluated 76、stored < 2、scan 2、comparison 576
- resource上限4 / 2 / 4 / 2と0063実測4 / 2 / 4 / 1
- privacy、runtime disconnect、predecessor behavior

## 6. STOP境界

次のauthorityを得るまで開始しない。

- matcher production suffix
- P2 Natural Surfaceのverified-reuse consumer変更
- P2 historical test変更
- P4 / runtime / manifest / E2以降

次を行ってはならない。

- 0001をP3 denominatorから外す
- base意味を無視する
- duplicateをexact coverageとして認める
- P2 caller metadataをverified reuseとして信用する
- resourceを増やす
- bodyやunsalted body digestをshareable artifactへ出す

## 7. Mashにお願いする作業

### 7.1 repository反映

ZIP内の`repository/`以下exact 1をmashos-apiへ反映し、commit・push後のSHAを教えてほしい。
これはP3 production完成物ではなく、P3 viability STOPを固定するRED evidenceである。

### 7.2 次の設計作業を許可する場合の明示承認案

> P3 production実装は開始せず、P2 freeze commit `9f8a816a66e75cedb6fcc09ddec00e4bf78bbb4d`をimmutable predecessorとして保持する。0001のindependently verified base reuse 1件をforward planning前に消費し、同じexplicit_unknownのadded proposition再提示を抑止するP2/P3 composition改訂について、exact owner / path / phase順を確定する設計20.3補遺の作成と、production source不変のRED先行検証を承認する。P2 frozen test、P1、fixture、closed code、control、attack、resource、denominatorを無断変更せず、Natural Surface、Matcher、既存P2/P3 test以外のownerまたはresource拡張が必要なら実装前にSTOPして提示する。P4、runtime、manifest、E2以降は開始しない。

この承認は設計補遺とRED検証だけを許可し、P2/P3 production source editをまだ許可しない。
