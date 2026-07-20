# NLS v3 Step 11 rc0030 — E2 Support-positive Base-binding 設計20.3影響範囲補遺

作成日: 2026-07-20 JST  
対象: `Step 11 / Cycle 001 / rc0030 / E2 evidence closure`  
監査predecessor: `2c789d3fa9f5a7a910c9a9392f2ebfd1bc009ea7`  
文書状態: `IMPACT_SCOPE_PROPOSAL / AUTHORITY_NOT_YET_GRANTED`

## 0. 結論

Pending20 / Support-positive Phase A read-only REDにより、frozen support-positive
authorityの`D`と`I6-D02`は、genericなApp-Reachable入力としてbase candidateと
Body-only base Parserまでは到達することを確認した。

しかし全6 base candidateがrc0030 base-binding再検証で閉じ、experiment candidate、
final Parser、Independent Matcher、Hard Gateへ到達しない。最初に変更が必要と判明した
production ownerは次のexisting pathである。

`ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py`

このpathは承認済みPhase Aの変更禁止範囲である。したがってproduction実装、manifest、
E3、E4を開始せずSTOPした。本補遺の明示承認と、今回のPhase A testを反映したGitHub
commitの固定後にだけ、successor repairへ進める。

## 1. 確認した事実

### 1.1 GitHub predecessor

GitHub mainの`2c789d3fa9f5a7a910c9a9392f2ebfd1bc009ea7`は、直前の
`1997d860cf02cd9b10ff502f0d5099c014d4eb1c`に対する1 commitである。
変更は次のexact 2で、前回ZIPのbytesと一致した。

1. `ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py`
2. `ai/tests/test_emlis_nls_v3_s11_rc0030_e2_integration.py`

このcommitをPhase A監査predecessorとした。

### 1.2 frozen authority

- representative 8のsupport-positive count: `0`
- frozen support fixture:
  `ai/tests/fixtures/grounded_human_reception_exact8_v2_20260712.json`
- fixture SHA-256:
  `cb601019dc2c7e4e46281133d3965addf04adf4f6af8defaf715f91f522e3efb`
- exact case IDs: `D`, `I6-D02`
- service case branch authority: `false`

入力は既存のcohort-independent legacy field projectionと同じ機械規則でApp-Reachable
shapeへ変換でき、projection validation issueは0である。case固有変換は追加していない。

### 1.3 read-only実行結果

| case | base candidate | support-bearing base candidate | base Parser | base Matcher | experiment candidate | final Parser / Matcher / Gate |
|---|---:|---:|---:|---:|---:|---:|
| D | 2 | 2 | 2 | 2 | 0 | 0 / 0 / 0 |
| I6-D02 | 4 | 4 | 4 | 4 | 0 | 0 / 0 / 0 |

全6候補のclosed codeは次のexact 1である。

`STEP11_RC0030_BASE_BINDING_REVALIDATION_FAILED`

Phase A test自体は次で意図どおりREDになった。

```text
1 failed in 70.65s
STEP11_RC0030_E2_SUPPORT_POSITIVE_FULL_CHAIN_UNREACHABLE
```

frozen authority確認は`1 passed in 0.39s`。`git diff --check`、collect 13、Python
compileもPASSした。

### 1.4 owner境界

閉じる箇所はrc0030-specific base reuse pathの次の再検証である。

- `_step11_rc0030_revalidated_base_binding()`
- `match_step11_rc0030_base_body_exact_reuse()`

base Parserはbodyを復元できている。runtimeはこの再検証結果を受け取るconsumerであり、
最初の原因ownerではない。Natural Surface、final Parser、final Matcher、Hard Gateは未到達の
ため、現時点で変更必要とは判定できない。

## 2. 推測

shared Matcherはbase candidate全体のglobal verifiedを要求する。一方rc0030は、base bodyを
意味充足済みと自己申告せず、source-authorizedなexact reuseだけを独立に認定し、残りを
rc0030 Surfaceで再実現する責任を持つ。

その責任差をrc0030-specific base context内で分離できれば、shared Matcherを変更せず、
support-positive sourceをfinal chainへ送れる可能性がある。ただしこれは未実装の仮説であり、
Phase B RED / GREENで確認する。

## 3. proposed successor authority

### 3.1 repair predecessor

今回のZIPに含むPhase A test exact 1をMashがGitHub mainへ反映したcommit SHAを、repairの
formal predecessorとする。local bytesだけをpredecessorにしない。

### 3.2 write exact 2

1. `ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py`
2. `ai/tests/test_emlis_nls_v3_s11_rc0030_e2_integration.py`

new repository pathは0とする。

### 3.3 許可する変更

1. rc0030-specific base-body reuse/context経路だけを対象にする。
2. shared Matcherのglobal verifiedをrc0030 candidate全体の意味充足として流用しない。
3. base bodyから独立に再確認できたsource ownerとexact reuseだけを認定する。
4. exactに認定できないsemantic atomはreuse creditを与えず、rc0030側の再実現対象にする。
5. support-bearing Receptionのtarget / support / act / scopeをsource authorityから再構成し、
   final Body-only Parser / Independent Matcher / Hard Gateでexactに照合する。
6. Phase A testのGREEN pathで、実bodyからsupport部分を落とした場合にfail-closeする。
7. raw body、owner expression、support expressionをshareable receiptへ出さない。

### 3.4 禁止する変更

- shared `match_step11_natural_surface()`の既存意味またはStep 9 frozen owner
- Natural Surface、catalog、Grounded Lexicalization、Hard Gate、runtime、manifest
- fixture、resource上限、exact18 allowlist
- rc0027 default、rc0028、rc0029、E1b successor、shared/public route
- case ID、corpus、review label、support-positive family固有production branch
- global `verified=False`を無条件PASSにする処理
- forward metadataをIndependent Matcherのauthorityにする処理
- skip、xfail、mock-only GREEN

## 4. Phase B acceptance

1. `D`と`I6-D02`が両方selectedになる。
2. 両caseがbase Parser / base Matcher / forward / final Parser / Independent Matcher /
   Hard Gate / selectorの実chainを通る。
3. support-bearing Reception countがsource / forward / parsed / verifiedで一致する。
4. support omissionが実body再parse後のIndependent Matcherでfail-closeする。
5. no-support caseをsupport-positiveへ誤昇格しない。
6. representative 8、control 7、retained 33、既存E2 12が非回帰である。
7. pending 20をexact ID / executor / resultで閉じる作業を再開できる。
8. production change exact 1、test change exact 1、new path 0、fixture change 0である。

## 5. 再STOP条件

次のいずれかが必要なら、該当変更前に停止して別の影響範囲を提示する。

1. Natural Surface、Hard Gate、runtime、catalog、Parserの変更
2. fixtureまたはnew path
3. resource、exact18、manifest phaseの変更
4. shared MatcherまたはStep 9 frozen ownerの変更
5. case / corpus / family固有production branch
6. secure materialまたはMash側の追加入力

## 6. 後続順序

1. 本補遺承認
2. Phase B RED固定
3. Matcher rc0030-specific base contextの最小修復
4. support-positive Phase A test GREEN
5. Pending20 exact execution closure
6. E2全GREEN後だけmanifest successor
7. E3代表8件machine + Product Read
8. E4 frozen 100 read-only
9. 別authorityで正式100件以降のevidence finalization

## 7. 華恋の意見

今回のdelimiter-safe Parser修復は保持するべきである。新しいREDはその修復の失敗ではなく、
これまでrepresentative 8に存在しなかったsupport-positive denominatorを接続したことで見えた
base contextの責任差である。

同時に、未到達のSurfaceやGateまで先回りして変更対象へ加えるべきではない。最初に原因が
確定したMatcher rc0030 suffixとE2 testのexact 2だけを承認し、次のownerが必要になった時点で
再STOPするのが最小かつ追跡可能である。

## 8. acceptance非主張

本補遺は次を主張しない。

- E2 GREEN
- pending 20 closure
- manifest successor完成
- E3 / E4開始
- Cycle 001 ACCEPTED

## 9. 次の明示承認文

> rc0030 E2 Pending20 / Support-positive Phase A read-only RED / STOPを承認する。今回のPhase A test exact 1を反映したGitHub commitをrepair predecessorとして、設計20.3 Support-positive Base-binding補遺のPhase Bを開始する。write exact 2は`emlis_ai_step11_natural_surface_matcher_v3.py`のrc0030-specific base reuse/context suffixと`test_emlis_nls_v3_s11_rc0030_e2_integration.py`だけとする。shared Matcher、Step 9、Natural Surface、Parser、catalog、Grounded Lexicalization、Hard Gate、runtime、manifest、fixture、resource、exact18、rc0027〜rc0029、E1b、shared/publicを不変にする。DとI6-D02のfull chainおよびsupport omissionをGREENにし、既存owner外が必要なら変更前にSTOPして影響範囲を提示する。
