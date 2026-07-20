# NLS v3 Step 11 rc0031 P2/P3 Verified Base Reuse Composition RED Handoff

作成日: 2026-07-21 JST  
対象: `Step 11 / Cycle 001 / rc0031 / P2-P3 composition revision`  
immutable predecessor: `9f8a816a66e75cedb6fcc09ddec00e4bf78bbb4d`  
確認時GitHub head: `9d4e4496144fec24569c913d9ad710aeb653390c`  
設計正本SHA-256: `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc`  
状態: `DESIGN_FROZEN / RED_EXACT10 / STOP_BEFORE_PRODUCTION_IMPLEMENTATION`

## 0. 結論

承認された範囲どおり、P3 productionを開始せず、P2/P3 verified base reuse compositionの設計補遺とproduction不変REDを作成した。

compositionは数学的・機械的に成立する。`0001`のindependently verified base reuse 1件をplanning前に除外すれば、同じ`explicit_unknown`をadded clauseへ再提示せず、次を満たせる。

```text
0001: S=0 / R=1 / reuse=1 / peak=1 / 1 / 1 / 0
reuse ∩ rendered=0
reuse ∪ rendered=source exact1
```

現行の唯一のblockerは、正当なnon-empty proofもprivate validatorが一律拒否することである。production sourceは変更していない。

ただし、proof projectionのhash列だけでは「Matcherがこの呼び出しで発行した」ことを認証できない。P3だけでは安全なpublic coordinatorを所有できないため、public APIは閉じたままにする。今回のREDはtest-local trusted orchestratorで成立性を検証し、production reachabilityは別承認のP4 disconnected adapterまで認めない。

## 1. 確認した事実

### 1.1 GitHub / predecessor

- `9f8a816a...`から`9d4e449...`までは1 commit、追加1 pathだけだった。
- 追加pathは今回修正したP3 testである。
- 受領時test SHA-256は`a69856605fcbfd633255ff56649985d808dec1442672c9bd9fa1298f8633a680`だった。
- P2 freeze commitは履歴上immutableのままである。

### 1.2 repository変更

MODIFY exact 1:

- `ai/tests/test_emlis_nls_v3_s11_rc0031_forward_inverse_independence.py`

final SHA-256:

`5ef1c4bc38f8b0f4c641da33c3d2e20a5a42d76d656bf4a1961a7530055d1654`

production source、fixture、P1、P2、catalog、Gate、runtime、manifestの変更は0件である。

### 1.3 representative8分母

- case 8
- forward前のpredecessor base candidate 13
- P2 emitted candidate 10
- 現行S合計39
- verified base reuse 1
- duplicate / re-exposition 1
- reuseは`0001`の`explicit_unknown`だけ
- 他のbase candidateはreuse 0
- composition後はadded S=38 + reuse=1で全39をexact cover

`0063`は`S=10 / R=1 / reuse=0 / peak=4 / 2 / 4 / 1`のままである。

### 1.4 resource

representative8の全13 base candidateについて、parser / matcher各13回、scan 26、base bytes 6,249、scan込みbyte inspection 12,498だった。

単一invocationのcandidate最大12件でpreplanning passとfinal passを行っても、既存上限のparser / matcher各24回、48,000,000 byte inspection内に収まる。resource拡張は不要である。

### 1.5 変更候補slot

将来別承認が得られた場合の最小production change候補は、Natural Surfaceの次のprivate validator 1関数だけである。

`_step11_rc0031_validate_verified_reuse_composition`

この関数外はprefix 404,481 bytesとsuffix 75,831 bytesでexact固定した。slotは同じsignatureのFunctionDef exact 1、8,192 bytes以下に限定し、Call allowlistとdunder拒否を適用した。import、class、nested function、lambda、global / nonlocal、dynamic import / eval / exec、output・file・process・network sink、shadow definitionを禁止した。service Python path inventory exact 546に加え、Surface / test以外のrepository Python exact 1,533のpath・size・content aggregateを固定し、別helper追加・既存helper改変へ実装を逃がせない。

valid compositionと全attack callはstdout / stderrをcaptureして空を要求し、capture内容をfailure outputへ残さない。

今回のcomposition REDではMatcher全722,658 bytesを固定し、suffixも許可していない。

## 2. RED exact 10

collection:

```text
10 collected
5 PASS
5 intentional RED
skip 0 / xfail 0 / collection error 0
```

PASS exact 5:

1. predecessor / path / patch slot / resource / privacy freeze
2. representative8全13 baseのreuse denominator
3. public reuse拒否 / private seam非export
4. malformed envelope / 65-row bound fail-close
5. fresh proofのbody-free / scan bound

intentional RED exact 5:

1. `STEP11_RC0031_P3_VERIFIED_REUSE_PREPLAN_CONSUMPTION_MISSING`
2. `STEP11_RC0031_P3_VERIFIED_REUSE_XOR_INVALID`
3. `STEP11_RC0031_P3_DUPLICATE_BASE_REEXPOSITION_NOT_RESOLVED`
4. `STEP11_RC0031_P3_VERIFIED_REUSE_CANONICAL_MISMATCH`
5. `STEP11_RC0031_P3_VERIFIED_REUSE_ATTACK_NOT_CLOSED`

全REDの直接原因は現行validatorのclosed code:

`STEP11_RC0031_P3_EXACT_REUSE_NOT_AVAILABLE`

missing symbol、unconditional fail、mock、skip、xfailではない。

attack nodeは、digest再計算済みfield transplant、base/source authority/source ID/family/basis/hash mutation、duplicate、別base / successor contextへのtransplantを将来`STEP11_RC0031_VERIFIED_REUSE_COMPOSITION_INVALID`へ閉じる。

## 3. 回帰結果

| suite | 結果 | 解釈 |
|---|---:|---|
| rc0031 composition exact10 | 5 PASS / 5 intentional RED | 今回の先行契約 |
| rc0031 P1 exact7 | 1 PASS / 6 intentional RED | 分母・closed code不変 |
| rc0031 P2 exact24 | 23 PASS / 1 historical stage-lock | P3 pathを検知する既存sentinelだけ |
| rc0030 P3 + predecessor | 57 PASS / 1 historical stage-lock | rc0030 P2 historical bytes sentinelだけ |
| rc0030 predecessor behavior exact4 | 4 PASS | 既存挙動非回帰 |

historical stage-lock code:

- `STEP11_RC0031_P2_PATH_SCOPE_INVALID`
- `STEP11_RC0030_P3_P2_PREDECESSOR_DRIFT`

過去phaseを固定するtestであり、見かけ上GREENにするため変更していない。新規退行は0件である。

## 4. 推測

1. existing private planner / renderer / candidate validatorは、reuseをplanning前に消費するcomposition downstreamとして十分である。
2. strict private validator 1関数を開けば、composition exact10は同じtest bytesでGREENにできる可能性が高い。
3. ただしprivate field validationは発行元認証ではない。same-call Matcher originとfinal independent rederivationを別に維持する必要がある。
4. P3 final Parser / Matcherはcomposition GREEN後に別RED scopeを作り、Matcher full freezeを明示的にappend-prefixへ変更してから実装すべきである。

## 5. 華恋の意見

このREDは保持するべきである。0001を分母から外す、base意味を無視する、duplicateをcoverageへ数える方法は採用しない。

また、proof hashを署名のように扱ってprivate seamをpublic化してはいけない。SurfaceからMatcherをimportする方法、MatcherからSurface / plan / ASTを読む方法も独立性を壊す。

compositionだけを最小のprivate slotで閉じ、P3 final inverseとP4 coordinatorを別の承認境界に残すのが妥当である。

## 6. 維持した境界

- P2 freeze commit
- P1 fixture、closed code、control、attack
- P2共通Surface composition
- candidate 12、replan 1、owner 24、referent 32
- parser body 1,000,000、loci 38、evaluated 76、stored <2、scan 2、comparison 576
- resource max 4 / 2 / 4 / 2
- privacy / body-free
- public reuse拒否
- runtime disconnect
- P4、E2以降未開始

## 7. STOP境界

今回開始していないもの:

- Natural Surface production edit
- rc0031 final Parser / Independent Matcher
- Gate、selector、runtime、manifest
- P4、P5、E2、E3、E4

次が必要になれば実装せずSTOPする。

- reserved validator slot外のNatural Surface変更
- Matcher変更
- public reuse APIの開放
- caller metadataをproofとして信用
- fixture / P1 / P2 / catalog / Gate変更
- resource / denominator拡張
- P4 ownerを前倒し

## 8. Mashにお願いする作業

ZIP内`repository/`以下のMODIFY exact 1を`mashos-api`へ反映し、commit・push後のSHAを教えてほしい。

その後、composition production implementationへ進める場合は、次の明示承認が必要である。

> P2/P3 verified base reuse composition RED exact10を反映commit `<SHA>`でfreezeする。immutable predecessor `9f8a816a66e75cedb6fcc09ddec00e4bf78bbb4d`を履歴上保持し、Natural Surfaceの`_step11_rc0031_validate_verified_reuse_composition` 1関数slotだけをproduction変更して、同じexact10を全GREENにする作業を開始してよい。public non-empty reuse拒否、Matcher全bytes、fixture、P1、P2、catalog、Gate、resource、denominatorを変更しない。P3 final Parser / Matcher、P4、runtime、manifest、E2以降は開始しない。slot外変更またはpublic coordinatorが必要なら実装前にSTOPする。

この承認を得るまでproduction implementationは開始しない。
