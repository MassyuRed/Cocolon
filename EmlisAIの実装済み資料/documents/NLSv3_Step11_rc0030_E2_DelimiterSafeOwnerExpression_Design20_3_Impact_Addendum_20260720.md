# NLS v3 Step 11 rc0030 — E2 Delimiter-safe Owner Expression 設計20.3影響範囲補遺

作成日: 2026-07-20 JST  
対象: `Step 11 / Cycle 001 / rc0030 / E2`  
文書状態: `IMPACT_SCOPE_PROPOSAL / AUTHORITY_NOT_YET_GRANTED`

## 0. 結論

owner-ready deterministic deferralにより0063 candidate 2のforward densityは修復できた。
しかし、group 3のdirected owner expressionに同一separatorが2箇所あり、Body-only Parserが
10 atom中7 atomしか復元できない。

現補遺はParser entry / body scan contractを凍結しているため、実装を停止した。
次はcatalogやupstream lexical ownerへ直ちに広げず、existing Matcher file内のrc0030
Body-only Parser grammarとIndependent Matcher unique resolutionだけで、bounded ambiguityを
閉じられるかをRED先行で判定するsuccessor authorityが必要である。

本補遺はまだ承認されていない。実装変更、manifest、E3、E4を開始してはならない。

## 1. 確認した事実

1. 0063 candidate 2のscheduleは`2 / 2 / 2`でresource内に収まる。
2. Parserはgroup 1の4 atom、group 2の3 atomを復元する。
3. group 3のdirected relationは、target referent内部にsource-particle separatorを1個含む。
4. rendererがendpoint delimiterを1個追加するため、prefix内の候補境界は2箇所になる。
5. 現Parserは候補境界がexact 1でなければ
   `STEP11_RC0030_OWNER_EXPRESSION_AMBIGUOUS`で閉じる。
6. pack順序、pack相手、chunk、groupを変えてもrelation item bytesは変わらない。
7. candidate 1はresource内で構成不能である。
8. Parserがgroup 3をsemantic tailなしと扱うため、Matcherは
   `STEP11_RC0030_BASE_PREFIX_COMMITMENT_MISMATCH`で閉じる。

## 2. 修復候補

### 2.1 第一候補: bounded ambiguity handoff

1. Body-only Parserは、directed / bidirectional owner expressionのdelimiter候補を
   bodyだけから列挙する。
2. 候補数は既存`_STEP11_RC0030_STORED_DECOMPOSITION_MAX = 2`以内とする。
3. 0候補またはbound超過はfail-closeする。
4. parsed witnessは候補のraw textを公開せず、body-local candidate commitmentsを保持する。
5. Independent Matcherはforward planを読まず、source authorityとvisible owner registryから
   candidateを照合する。
6. exact 1 solutionだけを採用し、0または2以上はfail-closeする。
7. selected verified bindingは現在と同じexact owner order / endpoint / directionを持つ。

この方法ならcatalog token、surface bytes、lexical referentを変更せず、existing
evaluation / owner-comparison bound内で閉じる可能性がある。

### 2.2 fallback候補

Parser-local候補がbody-only recoverabilityまたは既存bound内で成立しない場合だけ、
次を別authorityとして検討する。

- catalogにdelimiter escape / unescape grammarを追加
- Grounded Lexicalizationでdelimiter-safe referentを生成
- Natural SurfaceとIndependent Matcherで同じreferent naturalization commitmentを固定

これらはcatalog / lexical / source closureを広げるため、本補遺には含めない。

## 3. proposed authority

### 3.1 production exact 1

`ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py`

許可候補:

- rc0030 suffixのowner-expression decomposition
- parsed semantic atom / witnessのbounded candidate commitment
- parsed witness material / origin validation
- Independent Matcherのsource-authorized exact-one resolution
- 必要なら同suffix内だけのgeneric helper

維持:

- public Parser signatureは`parse_step11_rc0030_experiment_surface(body)`のみ
- Matcherへforward plan / candidate AST / span mapを渡さない
- body scan pass `2`
- stored decomposition max `2`
- evaluated decomposition max `76`
- owner comparison max `576`
- body max `1MB`

### 3.2 test exact 1

`ai/tests/test_emlis_nls_v3_s11_rc0030_e2_integration.py`

追加すべきRED / GREEN:

- 0063 delimiter collisionをbody-onlyで復元し、S=10をexact確認
- separator境界のunique source-authorized resolution
- 0 solution / 2 solution / candidate order swapをfail-close
- referent内separatorのdrop、collapse、endpoint swap、direction swapをfail-close
- owner-expression候補またはraw bodyをshareable resultへ出さない
- Surface plan / candidate metadataなしで同じbindingへ到達
- control 7非回帰

### 3.3 変更禁止

- Natural Surfaceの今回実装済みscheduler
- catalog、Grounded Lexicalization、Gate、runtime
- manifest exact 4
- P1〜P5 historical fixture / receipt / test
- resource上限
- Step 9、E1b、rc0027〜rc0029、shared/public route
- case / family / corpus固有branch
- semantic atom / endpoint / directionのdrop

### 3.4 predecessor

本ZIPのexact 3をGitHub mainへ反映したcommit SHAを、次successorのformal predecessorにする。
local worktreeだけをpredecessorにしてはならない。

## 4. acceptance

1. 0063 candidate 2がParser / Matcher / Gate / selectorまでselectedになる。
2. S=10、reuse=0、R=1が全ownerで一致する。
3. ready `3 / 1 / 2`、assigned `2 / 2 / 2`、strict deferral exact 1を維持する。
4. pack<=2、peak `4 / 2 / 4 / 2`を維持する。
5. ambiguous owner-expressionがsource authorityによりexact 1へ閉じる。
6. forged 0 / multiple solutionはfail-closeする。
7. Parser / Matcherのforward independenceとbody-only contractを維持する。
8. control 7とphase-behavior testsが非回帰である。
9. skip / xfail / mock-only GREENが0である。

このacceptanceはdensity GREENの残りを閉じるものであり、E2全GREENと同義ではない。
その後にretained 33 / pending 20 ledgerとsupport-positive authorityを閉じる必要がある。

## 5. 再STOP条件

次のいずれかが必要なら実装前または判明時点で停止し、別の影響範囲を提示する。

1. catalog / lexical / Natural Surfaceの追加変更
2. stored / evaluated / comparison / body resourceの拡張
3. Parser public signature変更またはforward metadata参照
4. parsed witnessからbody / raw owner expressionをshareable化
5. case / family固有branch
6. exact18外new path
7. manifest、E3、E4の先行開始

## 6. 華恋の意見

outer delimiterとreferent内部delimiterの衝突は、0063固有の例外ではなく、schema-freeな
自然表現では一般に起こり得る。exact 1 separatorを暗黙の前提にし続けるより、Parserが
bounded candidatesを保持し、意味authorityを持つMatcherがunique solutionだけを採用する方が、
Body-only / Independent Matcherの役割分担に合う。

ただし、その可否をまだ実装で証明していない。まず本補遺の明示承認後にREDを固定し、
existing bound内で閉じられることを確認するべきである。

## 7. 次の承認文

> rc0030 E2 owner-ready deferral implementation STOPを承認する。Mashがexact 3を反映したGitHub commitをpredecessorとして、delimiter-safe owner expression補遺のproduction exact 1とtest exact 1だけで、Body-only Parserのbounded candidate commitmentとIndependent Matcherのsource-authorized exact-one resolutionをRED先行実装する。Parser public signature、forward independence、stored2 / evaluated76 / comparison576 / body1MB、Natural Surface scheduler、catalog、lexical、Gate、runtime、manifest、Step 9、E1b、rc0027〜rc0029、shared/publicを不変にする。既存boundまたはexact 2 path内で閉じない場合は停止する。0063 full-chain GREEN後も、retained33 / pending20 / support-positive closureを終えるまでmanifestへ進まない。

