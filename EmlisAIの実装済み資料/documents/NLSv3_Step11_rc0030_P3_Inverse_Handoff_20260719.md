# NLS v3 Step 11 rc0030 — P3 Inverse Handoff

作成日: 2026-07-19 JST  
対象: `Step 11 / Cycle 001`  
handoff state: `P3_INVERSE_COMPLETE / STOP_BEFORE_P4`

## 1. 結論

GitHub `MassyuRed/mashos-api` main commit
`b94bf539da1339dfc8cc1204a88f9656b67fcea7`を正式predecessorとして再確認し、
同commitのP2 exact 4 fileがP2 freeze receiptのbyte count / SHA-256と一致することを確認してから、P3だけを実装した。

P3の最終結果は次のとおりである。

- P3 Body-only Parser / Independent Matcher: `54 / 54 PASS`
- P2 forward freeze: `17 / 17 PASS`
- rc0029 / rc0028 / rc0027 predecessor regression: `11 / 11 PASS`
- P1 freeze: `1 PASS + 同一5 intentional RED`
- P4 Hard Gate / selector / disconnected runtime / manifest: `NOT_STARTED`
- Cycle 001: `NOT_ACCEPTED`

したがって、P3はfreeze候補として完了したが、P1、P4、P5、E2、E3、E4、Cycle 001全体を完了扱いにはしない。

## 2. GitHub predecessor

- repository: `MassyuRed/mashos-api`
- branch: `main`
- commit: `b94bf539da1339dfc8cc1204a88f9656b67fcea7`
- commit URL: <https://github.com/MassyuRed/mashos-api/commit/b94bf539da1339dfc8cc1204a88f9656b67fcea7>

同commitで照合したP2 exact 4は次のとおりである。

| path | bytes | SHA-256 |
|---|---:|---|
| `ai/services/ai_inference/emlis_ai_step11_grounded_lexicalization_v3.py` | 129,615 | `592f3ab7c90831c3191f51e9e7dd9a1f8c3fe4add1fd31bba9fdc65dccaecc28` |
| `ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py` | 357,476 | `8f8ea6f197bac02edc8ee3594165625e1e8f06e5a6a7bb44e41445d880ae9c37` |
| `ai/services/ai_inference/emlis_ai_step11_rc0030_experiment_surface_catalog_v3.py` | 15,593 | `d51b8df3a7914aaa095a8b5249dd799f3dab2d8c706b07cea93e71a5b01ceb86` |
| `ai/tests/test_emlis_nls_v3_s11_rc0030_surface_planning_mutation.py` | 39,563 | `b04e8a6c6038ebc0dfde8b15d520ec9454f290977f611b295c7765299035925e` |

## 3. 変更file、根拠、必要性

### MODIFY — append-only

`ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py`

- 根拠: 設計20.3 §6.1は、final bytesだけを読むrc0030 Parser / Independent Matcherの既存ownerをこのfileに置いている。
- 必要性: P2 forward plan、candidate AST、span map、candidate自己申告coverageに依存せず、本文から意味atom、配置、Reception、base-body exact reuseを独立検証するため。
- 変更境界: 先頭589,793 bytesを不変にし、rc0030-prefixed suffix 107,119 bytesだけを追加した。
- frozen prefix SHA-256: `9bdae4b5c3d99e99dd01b622b9b191afbfa0e601789fba082a03c069b70028b5`
- P3 suffix SHA-256: `16da3059e90655b4048e7ff300aa68fa06bc9fe51397a963824c435daef07e34`
- final file SHA-256: `629305364ac50530265d7d87a6ca28678eb3e1be6ac7289ae770b3b5f871d8c9`

### NEW

`ai/tests/test_emlis_nls_v3_s11_rc0030_forward_inverse_independence.py`

- 根拠: P2のforward sourceを変更せず、P3固有の独立性、改変拒否、resource、privacyを直接固定するtest ownerが必要である。
- 必要性: forward metadata拒否、parser-issued witness、配置／順序／Reception、exact reuse、source authority swap、resource counter、body-free materialを回帰可能にするため。
- bytes: 34,643
- SHA-256: `e910ba05b8a272784b3a9704604eec510eb153993b1ab094476d5b19631ba30e`

ZIPへ入れるrepository fileは上記2 fileだけである。P2 file、P1 fixture / test、Hard Gateは変更していないため再同梱しない。

## 4. P3で固定した責任境界

### 4.1 Body-only Parser

- final parserの入力は`body: bytes`だけ。
- base reuse prepass parserの入力は`base_body: bytes`だけ。
- 1,000,000 bytesを超える本文、不正UTF-8、曖昧またはresource外の分解はclosed codeで拒否する。
- final witnessとbase witnessはparserが発行したrequest-local provenanceを持ち、`dataclasses.replace`等で再構成した見かけ上整合するwitnessも拒否する。

### 4.2 Independent Matcher

- 入力authorityはparser-issued final witness、parser-issued base witness、validated successor snapshot、inventory、content plan、discourse plan、current input projection、およびinverse-issued exact reuse rowに限定した。
- P2 forward module、realization plan、candidate AST、span map、candidate owner / covered metadata、Hard Gate、runtimeをimportまたは入力にしない。
- source ownerとbase grounded phraseから期待文group / chunkを再構成し、later owner group、tail chunk、deterministic pack、item order、cross-group bridge placementを本文側の解析結果とexact比較する。
- Reception opportunity、target / support owner、act、line / move scheduleをinverse側で再構成し、visible bodyの全bindingとexact比較する。
- base reuseはfamily-specific exact basisをsource authorityから再導出する。callerが自己hashしたlexical-only、partial、covered、fake ID、duplicate re-exposition + reuse creditを拒否する。
- `hard_verified=True`でも`semantic_coverage_authorized=False`を維持し、P3自身がformal semantic coverageを認証しない。

### 4.3 resource / privacy

| resource | upper bound |
|---|---:|
| body bytes | 1,000,000 |
| decomposition loci | 38 |
| evaluated decompositions | 76 |
| peak stored decompositions | `< 2` |
| body scan passes | 2 |
| combined owners | 24 |
| owner comparisons | 576 |
| Reception moves | 3 |
| Reception moves / line | 2 |

- permutation / backtracking / runtime learning / networkを追加していない。
- errorは`STEP11_RC0030_*` closed codeだけを公開し、本文、owner expression、source IDをtraceback causeへ流さない。
- parsed / verified materialは本文をexportせず、必要なexpressionはSHA-256 commitmentへ変換する。

## 5. 検証結果

### P3 final suite

```text
54 passed
0 failed
0 errors
0 skipped
0 xfailed
139.23 seconds
```

同一54 nodeの独立実行も`54 passed / 136.26 seconds`だった。後者では既存warningを1件観測したが、`--disable-warnings`実行のためcategory / messageはreceiptへ採取していない。

主な検証範囲:

- P2 exact 4、Matcher prefix、Hard Gate、P1 fixture / testのbyte freeze
- suffix import / symbol uniqueness / input signature
- 0001 / 0009 / 0035 / 0100のdeterministic body-only parse + match
- 0001 explicit unknown exact base reuse
- P2 planを入力にしないgroup / chunk / pack / bridge配置一致
- parser-issued final / base witness provenance
- semantic / Reception bindingの改変、順序、drop、duplicate、visible delimiter / line schedule変更
- validだが別inputのsuccessor差替え拒否
- resource counter、1 MB、UTF-8、body-free material

### representative direct 4 counts-only receipt

本文は保存・出力していない。

| case | semantic atoms | Reception | loci | evaluated | stored peak | scans | owner comparisons | result |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| 0001 | 1 | 1 | 5 | 7 | 1 | 2 | 4 | hard verified / unique 1 |
| 0009 | 1 | 1 | 4 | 6 | 1 | 2 | 10 | hard verified / unique 1 |
| 0035 | 7 | 1 | 19 | 32 | 1 | 2 | 28 | hard verified / unique 1 |
| 0100 | 8 | 2 | 23 | 41 | 1 | 2 | 52 | hard verified / unique 1 |

全件で`issue_codes=()`、`semantic_coverage_authorized=False`だった。

### frozen regressions

```text
P2 forward: 17 passed / 144.72 seconds
predecessor selected suite: 11 passed / 33.32 seconds
P1 freeze: 1 passed + 5 intentionally failed / 112.03 seconds
```

P1のintentional RED codeは次の5件で不変だった。

1. `STEP11_RC0030_MAIN_MEANING_APPENDIX_DOMINANCE`
2. `STEP11_RC0030_SCHEMA_EXPOSITION`
3. `STEP11_RC0030_SURFACE_DISTRIBUTION_OVERCONCENTRATED`
4. `STEP11_RC0030_GROUNDED_RECEPTION_PREFIX_LIST`
5. `STEP11_RC0030_CONTROL_NON_REGRESSION`

P1をGREENにする責任は、P4後のP5に残る。

## 6. 確認した事実・推測・華恋の意見

### 確認した事実

- GitHub main commit `b94bf539...fcea7`のP2 exact 4は、P2 freeze receiptとbyte単位で一致した。
- P3 final suiteは54 / 54 PASSし、独立監査でもcorrectness blockerは見つからなかった。
- Matcherの先頭589,793 bytes、Hard Gate、P1 fixture / test、P2 exact 4は不変である。
- P2とpredecessor regressionは全PASS、P1は同じ5 REDのままである。
- P4、P5、E2、E3、E4は開始していない。
- shared runtime / public route / reply / DB / RN / Safety / question ownerは変更していない。

### 推測

- P3は、P4がcandidateをHard Gateへ接続するために必要なbody-only verification材料を提供できる状態になった。
- ただし、P4 selector / runtime / manifestをまだ実装していないため、0063を含む代表8件のintegrated selection可否やP1 GREENを現時点では推測から事実へ昇格できない。

### 華恋の意見

P3はここでfreezeするのが正確である。P3へHard Gate、selector、runtime、manifestの責任を混ぜず、次のGitHub commit SHAを新しいpredecessorとしてからP4へ進むべきである。

Cycle 001完了へはまだ距離がある。順序は`P4 -> P5 -> E2 -> E3 machine -> E3 Product Read -> E4 frozen 100`を維持し、E4通過後にのみformal candidate化の別authorityへ進む。

## 7. 次の境界

次の正確な指示は次である。

> `rc0030 P3 inverse freezeを承認する。P3 ZIPをGitHub mainへ反映したcommit SHAを正式predecessorとして、P2 / P3 frozen bytes、P1 resource denominator、Step 9、E1b、rc0027 / rc0028 / rc0029 behavior、shared runtime / public routeを不変にし、P4 Hard Gate / selector / disconnected runtime / manifestを開始する。P4 GREEN後だけP5へ進み、既存authority外owner、§6.2 allowlist外path、resource拡張、case / family固有branchが必要なら実装前に停止して影響範囲を提示する。`

Mash側で必要な作業は、このZIPのrepository配下2 fileを同じ相対pathへ反映し、commit / push後のcommit SHAを知らせることだけである。secure materialは現時点では不要である。
