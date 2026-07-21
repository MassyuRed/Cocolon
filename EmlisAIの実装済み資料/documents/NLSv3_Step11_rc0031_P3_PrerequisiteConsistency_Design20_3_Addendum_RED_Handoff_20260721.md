# NLS v3 Step 11 rc0031 P3 Prerequisite Consistency Design 20.3 Addendum RED Handoff

作成日: 2026-07-21 JST  
対象: `Step 11 / Cycle 001 / rc0031 / P3 prerequisite consistency`  
mashos-api開始点: `b8e6fb59710a8b7ea15c6e5f016da275d4d3c54b`  
Cocolon開始点: `541fab094c1bf32c83403cb8ed73f1f66d7fff58`  
mashos-api結果commit: `a904ba192b05ca1445e32006b64fc87e7cda48bf`  
P2 immutable predecessor: `9f8a816a66e75cedb6fcc09ddec00e4bf78bbb4d`  
privacy: `BODY-FREE`  
状態: `PRE-FREEZE RED / PREREQUISITE CONSISTENCY CLOSED / PRODUCT GRAMMAR UNRESOLVED / PRODUCTION STOP`

## 0. 結論

P3 Surface実装へは進んでいない。指定された2 commit、Cocolon前提資料、EmlisAI実装済み資料、Revised Cycle正本を再確認し、先に前提不整合をtest-onlyで閉じた。

確認結果は次のとおりである。

1. mashos-api `main`とCocolon `main`は、作業開始時に指定commitと一致していた。
2. Cocolon前提資料の不変条件は引き続き拘束する。一方、同資料に記載された2026-07-20時点のsource pin / current statusは今回の開始点より古いため、履歴断面として扱う。
3. 現P3 testはCatalog全体とNatural Surfaceの旧suffixをfreezeしており、前回補遺のEOF append案と両立していなかった。
4. P2 path-scope REDは、P3 test pathが後から存在するために起きるhistorical phase-lockであり、P2 semantic behaviorの回帰ではない。
5. current P2 grammarの非単射という歴史事実と、P3 successor不在という将来REDが同じtestに混在し、append後に意図しないprobe-driftへ遷移する状態だった。
6. 875 codewordのtest-local固定4-slot prefixは機械的に一意でも、38新規atomへ反復され得る。これは自然さ、非template性、schema-free Product Surfaceを満たす証拠ではない。

このため、既存P3 testだけを修正し、P3 exact24を`15 PASS / 9 intentional RED`として確認した。production Catalog / Surface / Parser / Matcherは変更していない。

intentional RED:

```text
1 × STEP11_RC0031_P3_DIMENSION_SURFACE_NOT_AVAILABLE
1 × STEP11_RC0031_P3_FIXED_SLOT_PREFIX_PRODUCT_CONTRACT_NOT_SATISFIED
7 × STEP11_RC0031_P3_FINAL_INVERSE_NOT_AVAILABLE
```

## 1. 前提資料との整合

### 1.1 維持する不変条件

- Step 9 / E1b / rc0027--rc0030の既存境界
- current input / content / discourse / reception / shared / publicの分離
- additive-only API、DB / RN / Safety / question / corpus境界
- case / family / topic固有runtime branch禁止
- raw body、candidate metadata、candidate-selected planによる逆算禁止
- Product Readをmachine injectivityで置換しない
- P1 / P2 test、fixture、Matcher predecessor、resource、denominatorを無断変更しない

### 1.2 status pinの扱い

`Cocolon_前提資料/05_cocolon_rule_file_index.md`等のfrontmatterにあるsource pinは2026-07-20時点の履歴断面である。今回のcurrent authorityはユーザー指定の次の2点である。

```text
MassyuRed/mashos-api main@b8e6fb59710a8b7ea15c6e5f016da275d4d3c54b
MassyuRed/Cocolon    main@541fab094c1bf32c83403cb8ed73f1f66d7fff58
```

旧pinを現在値として黙って使わず、不変条件とstatus記述を分けて読んだ。

## 2. 確認した不整合と補正

### 2.1 P1 / P2履歴境界

- P1 original freezeは`f63269fde48eed7aa9d8dfe4e818a011894b6f8e`である。
- P2 commit `9f8a816...`で、P1 testはphase-aware path-scope補正だけを受けた。
- したがってP1 testの現immutable境界は9f8時点の`24,327 bytes / SHA-256 14e90025a18f1fcab8b2d4d8571e7d2be31b271ec2d4ca8e3a22fa56f14f193c`である。
- P1 / P2 testは今回変更していない。今後も追加補正を許可しない。

### 2.2 P2 path-scope

P2 testは9f8時点のactive exact18=4 pathを固定する。current b8には予約済みP3 testが1 path増えているため、P2単体は`STEP11_RC0031_P2_PATH_SCOPE_INVALID`を1件出す。

P3側へphase projection testを追加し、次を独立に固定した。

```text
current active set = historical P2 active set + current P3 test path
```

P2 test自体は変更していない。

### 2.3 Catalog / Surface freezeとEOF append

旧P3 testのNatural Surface internal mutable slotは閉じた。b8のfull sourceをimmutable predecessorとし、その末尾だけに将来のbounded seamを置く。

| owner | immutable predecessor | append上限 | exact first-line marker |
|---|---|---:|---|
| rc0031 Catalog | `19,951 bytes / a4e8bc9753a1398571d511d5d0c1219a886c498661b3a4f702d3b20b5672c6cc` | 16,384 bytes | `# rc0031 experiment-only body-dimension grammar (append-only P3 owner)` |
| Natural Surface | `485,490 bytes / ee2f4bc0ab260e8cf1ce2b87acf499e84712ed6b3e639a6a1a6a0141bd3ea520` | 65,536 bytes | `# rc0031 experiment-only dimension-bearing Surface successor (append-only P3 owner)` |
| Matcher | `722,658 bytes / 648a3a6690f8df860053c811a5416fcfc9983524e5ff880a0e6921a122a52e30` | 131,072 bytes | 既存P3 markerを維持 |

EOF seamは既存symbolのshadow / 再代入、module-load side effect、walrus、dynamic global access、再帰、import拡張をfail-closeする。Catalog appendはimportを許可せず、Surface appendはrc0031 Catalogの限定importだけを許可する。Surface appendに非ASCII完成文を置かず、自然語所有はCatalog側へ閉じる。

Catalogをrepository-wide immutable materialから除外し、残るmaterialを次に再固定した。

```text
Python files = 1,531
SHA-256 = 014ba3d399ca182265f67728c4b13c45aac6ea33dbae4874521585b79c066bd2
```

### 2.4 historical collisionとsuccessor REDの分離

current P2 grammarのcollision probeは、P2の歴史事実を確認するPASSへ変更した。将来Catalogへcontractが追加されても、このprobeはsuccessor availabilityを要求しない。

別testで次の不在を1件のclosed REDにした。

- append marker付きCatalog contract
- unique Catalog validator export
- unique dimension-bearing Surface builder export
- unique Surface validator export
- body-derived recovery contract

### 2.5 Product Surface境界

representative 10 contextの新規atom数は次である。

```text
0 / 0 / 1 / 3 / 3 / 7 / 3 / 3 / 10 / 8 = 38
verified base reuse = 1
```

7 candidateは複数atomを持ち、最大10 atomである。固定4-slot bundleを全atomへ付ける方式は、machine injectivityが成立してもProduct Surfaceとして承認しない。

REDは将来遷移可能な形にし、実builderが存在した場合のactual final bytesを読み、完全な固定4-slot codewordが1 candidateに2回以上反復されればfailする。source atom数そのものを減らす不可能な条件にはしていない。

## 3. 次のSurface contract候補

今回testが要求する最小contractは次である。これは実装承認ではなく、次工程が満たすべきRED境界である。

```text
schema = cocolon.emlis.nls_v3.step11.rc0031_body_dimension_recovery.v1
catalog-derived = observation_stage / source_role
body-recovered = polarity / modality / temporal_scope /
                 topic_fingerprint_sha256 / referent_scope
candidate metadata required = false
fixed complete slot prefix max per candidate = 1
schema-free natural-language Product Surface required = true
```

unique append-only API候補:

```text
STEP11_RC0031_EXPERIMENT_BODY_DIMENSION_RECOVERY_CONTRACT
validate_step11_rc0031_experiment_body_dimension_recovery_contract
build_step11_rc0031_dimension_bearing_experiment_surface_candidate
validate_step11_rc0031_dimension_bearing_experiment_surface_candidate
```

実builderが将来存在する場合だけ、final candidate contextはsuccessor出力を使う。builder / validatorの例外や不正結果はbody-free closed codeへ畳む。

## 4. RED結果

### 4.1 P3 exact24

```text
24 collected
15 PASS
9 intentional RED
elapsed 401.16s
```

今回の2つの新規Product/Surface REDと、既存final inverse exact7だけが残った。旧`STEP11_RC0031_P3_BODY_DIMENSION_RECOVERY_NOT_INJECTIVE`は、P2 historical collision PASSとP3 successor不在REDへ分離した。

### 4.2 retained regression

```text
P1 exact7  = 1 PASS / 6 intentional RED
P2 exact24 = 23 PASS / 1 historical path-scope RED
```

P2の唯一の想定REDはhistorical path-scopeである。

### 4.3 test authority

```text
path = ai/tests/test_emlis_nls_v3_s11_rc0031_forward_inverse_independence.py
bytes = 161,191
SHA-256 = 045ca06eabbff7c6d902174ecf84db75d67b21e27ce9956726467f7d19c36860
```

## 5. production境界

今回変更したmashos-api fileはP3 test 1件だけである。

```text
MODIFY ai/tests/test_emlis_nls_v3_s11_rc0031_forward_inverse_independence.py
```

次は変更していない。

- rc0031 Catalog source
- Natural Surface source
- Matcher source
- Parser / Matcher export
- P1 / P2 test
- fixture
- Grounded Lexicalization / Gate
- runtime / manifest / API / DB / RN
- P4 / E2以降

「production unchanged」は今回の開始点b8からの差分がtest-onlyであることを指す。P2 commit 9f8からb8までsource bytesが完全不変という意味ではない。履歴上は`f7caf169...`でNatural Surfaceのprivate verified-reuse validatorが変更されているが、public/shared runtimeへは未接続のままである。

## 6. 確認済み事実と推測

確認済み:

- current P2 grammarにはbody-dimension collisionがある。
- test-local 875 codewordは機械的にinjective / prefix-freeである。
- その固定bundleをそのまま採用すると最大10回/candidateの反復対象になる。
- Catalog / Surface append案は旧freeze条件と矛盾していた。
- bounded EOF seamへ補正するとcurrent predecessorはPASSする。
- production ownerは今回未変更である。

未確認・推測:

- family別の自然な文法屈折で、5 body-recovered dimensionをtemplate感なく一意にできるか。
- Product ReadでEmlisの声として受け入れられるか。
- representativeを越えた大量sampleでtopic projectionが一意か。

これらをmachine REDの成立だけでGREEN扱いしない。

## 7. STOP境界と次の承認候補

今回、次を開始・freezeしていない。

- P3 Product Surface grammar wording / placement
- Catalog / Surface production append
- final bytes変更
- production Parser / Matcher
- Matcher append
- P4
- runtime / manifest
- E2以降

次に進む場合も、直ちにP3 Surface実装を承認しない。まず次のdesign-only作業を推奨する。

> 38新規atomの意味次元を、固定4-slot bundleの反復ではなく、family / grammatical role / existing predicate morphologyへ自然に屈折させるProduct Surface grammarを設計する。schema-free、非template、main meaning保持、内部schema非露出、candidate metadata不要を満たし、Product Read用のbody-full private reviewを別境界で行う。contractと読感が成立した後にのみ、Catalog / Surface appendの実装承認を別途求める。Parser / Matcher、P4、runtime、manifest、E2以降は引き続き開始しない。

## 8. Mashにお願いする作業

現時点でMashのPC操作は不要である。GitHub反映に成功した場合、ZIPは作成しない。
