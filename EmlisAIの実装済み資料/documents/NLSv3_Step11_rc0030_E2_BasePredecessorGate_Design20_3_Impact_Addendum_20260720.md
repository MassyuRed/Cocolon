# NLS v3 Step 11 rc0030 — E2 Base-predecessor Gate 設計20.3影響範囲補遺

作成日: 2026-07-20 JST  
対象: `Step 11 / Cycle 001 / rc0030 / E2 evidence closure`  
proposed repair predecessor: `a18ceaf9f2d858c59244a12aaca3d798acc36cdd`  
文書状態: `IMPACT_SCOPE_PROPOSAL / AUTHORITY_NOT_YET_GRANTED`

## 0. 結論

Support-positive Phase Bのread-only診断により、Matcher rc0030 suffixとE2 testのexact 2だけでは
`D`と`I6-D02`をselectedへ到達させられないことが確定した。

次に必要なownerは、rc0030 Hard Gate内のbase-predecessor policyである。shared MatcherやStep 9
Gateを変更するのではなく、rc0030 final candidate専用のGate suffixで、base full hard-passと
origin-bound限定projectionの責任を分離する必要がある。

本補遺はまだ実装authorityではない。Mashが§8を明示承認するまでrepository fileを変更しない。

## 1. 確認した事実

1. formal predecessorはGitHub commit
   `a18ceaf9f2d858c59244a12aaca3d798acc36cdd`である。
2. frozen support-positive authorityのbase candidateは`D=2`、`I6-D02=4`である。
3. 全6候補のsource / witness / ledger / content / discourse commitmentは一致する。
4. 全6候補のshared base bindingはglobal `verified=False`である。
5. Matcher限定projectionのbody-free診断ではbase inverse prepassが6 / 6通る。
6. その後、Hard Gateがbase candidateを独立再評価し、全6候補をexact 9 Gate codeでrejectする。
7. rc0030 Hard Gateは全候補へ`STEP11_RC0030_BASE_GATE_REJECTED`を追加する。
8. Matcher suffixは、このHard Gate ownerの判定を変更できない。
9. `D`は2件、`I6-D02`は2件のexperiment candidateがGateまで到達できるため、Natural Surface
   変更は現時点の必須条件ではない。
10. 現predecessorのrepository worktreeはcleanで、Phase B production変更は0である。

## 2. owner責任の分離

| owner | 今回必要な責任 | 維持する境界 |
|---|---|---|
| rc0030 Matcher suffix | baseから局所的に再検証できるowner / exact reuse / Reception projectionだけを認定 | global `verified=False`をmeaning coverageへ昇格しない |
| rc0030 Hard Gate suffix | origin-bound base contextとfinal full-source joinを検証し、base Gate failureを診断として保持 | shared Gate 20 ownerとshared candidate判定を変更しない |
| E2 integration test | exact denominator、full-chain、support omission、negative attackを固定 | fixtureやproduction metadataをoracleにしない |

## 3. proposed successor authority

### 3.1 write exact 3

1. `ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py`
2. `ai/services/ai_inference/emlis_ai_step11_hard_gate_v3.py`
3. `ai/tests/test_emlis_nls_v3_s11_rc0030_e2_integration.py`

new repository pathは0とする。

### 3.2 Matcherで許可する変更

rc0030-specific suffixだけで次を行う。

1. base bindingのwitness / ledger / content / discourse commitmentをexact再検証する。
2. shared bindingのglobal `verified`をrc0030 coverage authorityとして使わない。
3. grounded phrase keyとsource owner aliasが一意なphraseだけをowner registryへ入れる。
4. source ID・family・endpoint・direction・dimensionまで独立一致するrelation / unknownだけへexact
   reuse creditを与える。
5. 未解決semantic rowへreuse creditを与えない。
6. Reception target / support / act / scopeをsource authorityから再構成する。
7. base integrated Reception IDを無条件にcoverage authorityとして使わない。
8. resource上限とbody scan回数を維持する。

### 3.3 Hard Gateで許可する変更

`evaluate_step11_rc0030_experiment_candidate()`と、そのrc0030-local material validator / helperだけを
対象にする。

1. shared base Gate評価自体は実行し、exact failure codesをbody-free診断へ保持する。
2. base shared Gate hard-passを、そのままrc0030 final candidateの意味充足条件として流用しない。
3. 次が全て成立した場合だけ、base predecessorのglobal failureをfinal candidate rejectionへ直結
   させない。
   - origin-bound base inverse contextがexactに再検証済み
   - base bytes / candidate ID / source commitmentsが一致
   - base reuseはIndependent Matcherが認定したexact subsetだけ
   - forward candidateのsource commitmentとbody commitmentが一致
   - final Body-only Parser / Independent Matcherがhard verified
   - semantic source denominatorがparsed + exact reuseのXORで全件一致
   - Reception source ID / act / target / support / line / move / association basisがforward / inverseで一致
   - main meaning dominance、resource、replan、private runtime境界が全てPASS
4. 上記のどれかが欠ければfail-closeする。
5. base Gate failure codesを消去せず、`base_gate_failure_codes`として保持する。

### 3.4 E2 testで許可する変更

1. support executionへ専用source denominatorを渡し、representative8 lookupへ誤接続しない。
2. `D`: semantic 2 / Reception total 2 / support-bearing 1を固定する。
3. `I6-D02`: semantic 2 / Reception total 3 / support-bearing 1を固定する。
4. source / forward / parsed / verifiedの各段でdenominator一致を検証する。
5. support-bearing rowがexact 1であることを検証する。
6. 実bodyからsupport expressionだけを除いたmaterialがParserを通り、Independent Matcherの
   exact `STEP11_RC0030_RECEPTION_BINDING_MISMATCH`で閉じることを検証する。
7. no-support controlをsupport-positiveへ誤昇格しないことを検証する。
8. forged base context、stale commitment、surplus reuse、forward metadata oracle化をfail-closeする。

## 4. 変更禁止

- shared `match_step11_natural_surface()`の意味
- shared `evaluate_step11_natural_surface_candidate()`とStep 9 frozen 20 owner
- Natural Surface / forward planning / rendering
- Body-only Parser、catalog、Grounded Lexicalization、runtime、selector、manifest
- fixture、resource上限、exact18 allowlist
- Step 9、E1b、rc0027〜rc0029、shared/public route
- case ID、corpus、review label、failure code固有production branch
- `verified=False`の無条件PASS、base Gateの無条件bypass
- forward metadataをIndependent Matcher authorityにする処理
- skip、xfail、mock-only GREEN

## 5. Phase B acceptance

1. `D`と`I6-D02`が両方selectedになる。
2. 両caseがbase Parser / base Matcher / forward / final Parser / Independent Matcher / rc0030
   Hard Gate / selectorの実chainを通る。
3. semantic denominatorは両caseで2件一致する。
4. Reception denominatorは`D=2`、`I6-D02=3`で一致する。
5. support-bearing Receptionは両caseでexact 1件一致する。
6. support omissionは実body再parse後、exact Matcher codeでfail-closeする。
7. base Gate failureはbody-free diagnosticsへ保持されるが、final candidateのsemantic coverageとして
   再利用されない。
8. no-support controlをsupport-positiveへ誤昇格しない。
9. representative 8、control 7、retained 33、既存E2が非回帰である。
10. production change exact 2、test change exact 1、new path 0、fixture change 0である。

## 6. 再STOP条件

次のいずれかが必要なら該当変更前に停止し、別の影響範囲を提示する。

1. Natural Surface、Parser、runtime、selector、catalog、lexical ownerの変更
2. shared Matcherまたはshared Step 9 Gateの変更
3. fixtureまたはnew path
4. resource、exact18、manifest phaseの変更
5. case / corpus / family / failure code固有production branch
6. secure materialまたはMash側の追加入力
7. `I6-D02`の残存candidateだけではacceptanceに到達せず、forward owner変更が必須になる

## 7. 後続順序

1. 本補遺承認
2. exact 3 Phase B RED固定
3. Matcher限定projection修復
4. rc0030 Hard Gate base-predecessor policy修復
5. E2 support-positive全GREEN
6. Pending20 exact execution closure
7. E2全GREEN後だけmanifest successor
8. E3代表8件machine + Product Read
9. E3通過後だけE4 frozen 100
10. Cycle 001 acceptance evidence finalization

## 8. 次の明示承認文

> rc0030 E2 Support-positive Phase B pre-implementation STOPを承認する。GitHub commit a18ceaf9f2d858c59244a12aaca3d798acc36cddをrepair predecessorとして、設計20.3 Base-predecessor Gate補遺のexact 3 Phase B repairを開始する。変更対象は`emlis_ai_step11_natural_surface_matcher_v3.py`のrc0030-specific suffix、`emlis_ai_step11_hard_gate_v3.py`のrc0030-specific base-predecessor / final-candidate suffix、`test_emlis_nls_v3_s11_rc0030_e2_integration.py`だけとする。shared Matcher、shared Step 9全20 owner、Natural Surface、Parser、catalog、Grounded Lexicalization、runtime、selector、manifest、fixture、resource、exact18、rc0027〜rc0029、E1b、shared/publicを不変にする。DとI6-D02のfull chain、exact source denominator、support omissionをGREENにし、既存authority外が必要なら変更前にSTOPして影響範囲を提示する。

## 9. 華恋の意見

これはGateを弱める提案ではない。base全体の旧candidate判定と、rc0030がfinal bodyで再構成して証明する
意味充足を区別し、後者へより強いexact join条件を課す提案である。

shared Gateの判定を変えず、rc0030 suffixだけで責任差を表現できなければ、その時点で再STOPする。

