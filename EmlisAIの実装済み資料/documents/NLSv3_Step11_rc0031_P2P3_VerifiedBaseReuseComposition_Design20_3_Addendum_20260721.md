# NLS v3 Step 11 rc0031 P2/P3 Verified Base Reuse Composition 設計20.3補遺

作成日: 2026-07-21 JST  
作成者: 華恋  
対象: `Step 11 / Cycle 001 / rc0031 / P2-P3 composition revision`  
privacy: `BODY-FREE`  
状態: `DESIGN_FROZEN / RED_EXACT10 / STOP_BEFORE_PRODUCTION_IMPLEMENTATION`

## 0. 結論

`0001`のbase本文には、既存のBody-only base parserとIndependent base matcherが一意に検証できる`explicit_unknown`が1件ある。現行P2は同じsource atomをadded propositionとして再提示し、exact reuseを0件としている。

compositionの数学部分は既存private seamで成立する。独立検証済みreuse 1件をforward planningより前に除外すると、`0001`は次になる。

```text
S=0 / R=1 / exact reuse=1
rendered added atom=0
reuse ∩ rendered=0
reuse ∪ rendered=source atom exact1
resource peak=1 / 1 / 1 / 0
```

現行の唯一の機械的blockerは、private validatorが正当なnon-empty reuseも一律に`STEP11_RC0031_P3_EXACT_REUSE_NOT_AVAILABLE`で拒否することである。

ただし、P3単体には安全なpublic activation ownerがない。proofのhash列は署名ではなく、callerが同じ値を作れる。したがって、P3ではpublic P2 APIを閉じたまま、同一呼び出し鎖でBody-only ParserからIndependent Matcherを通ったproofだけをprivate compositionへ渡し、final Matcherが最終bytesからreuseを再導出する。productionでこの一回限りの調停を所有するのは、別承認のP4 disconnected adapterである。

今回は設計補遺とproduction不変のREDだけを作成した。Natural Surface、Matcher、Gate、catalog、fixture、P1、P2、runtime、manifestは変更していない。

## 1. 今回の承認scope

### 実施したこと

- P2 freeze commitをimmutable predecessorとして再確認
- GitHubへ反映されたP3 viability RED fileを取得し、反映差分を確認
- representative8全体のbase reuse分母をbody-freeで再計算
- proof owner、forward owner、inverse owner、将来adapter ownerの責任分離を確定
- production source不変でcomposition RED exact 10を作成
- 既存回帰を別suiteとして確認

### 実施していないこと

- Natural Surfaceのvalidator変更
- rc0031 final-body Parser / Independent Matcher
- P4 Gate / selector / runtime adapter / manifest
- E2、E3、E4
- public/shared route、reply、DB、RN、Safety、question owner接続
- resource、fixture、control、attack、denominatorの拡張

## 2. 確認した事実

### 2.1 predecessorとGitHub反映

1. immutable P2 freeze predecessorは`9f8a816a66e75cedb6fcc09ddec00e4bf78bbb4d`である。
2. GitHub mainの確認時headは`9d4e4496144fec24569c913d9ad710aeb653390c`である。
3. `9f8a816a...`から`9d4e449...`までは1 commit、追加1 pathだけである。
4. 追加pathは`ai/tests/test_emlis_nls_v3_s11_rc0031_forward_inverse_independence.py`である。
5. GitHub blobと受領fileは一致した。受領時SHA-256は`a69856605fcbfd633255ff56649985d808dec1442672c9bd9fa1298f8633a680`である。
6. 詳細設計正本SHA-256は`6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc`である。

`9f8a816a...`は履歴として変更しない。将来の承認済み変更は、そのcommitを上書きするのではなく、descendant commitで行う。

### 2.2 authorityとの整合

Revised Cycle §12は次を要求する。

- Body-only Parserはfinal bytesとfrozen grammarだけを読む。
- Independent Matcherはsource authorityからbindingを独立再計算する。
- Matcherはcandidate AST、forward plan、span map、candidate-declared bindingを読まない。

rc0031既存補遺§6.5は、base bodyとadded clauseへ同じ意味を重複させず、exact reuseをBody-only Parser＋Independent Matcherのexact binding時だけcreditすることを要求する。§10.2はParser / Matcherがforward module、plan、AST、candidate metadataを読まないことを要求する。

### 2.3 現行sourceの責任

Natural Surfaceには既に次のprivate seamがある。

1. `_step11_rc0031_validate_verified_reuse_composition`
2. `_step11_rc0031_build_plan_from_verified_reuse_composition`
3. `_step11_rc0031_render_from_verified_reuse_composition`
4. `_step11_rc0031_build_candidate_from_verified_reuse_composition`
5. `_step11_rc0031_validate_candidate_from_verified_reuse_composition`

plannerはvalidatorを通ったreuse IDを`pending`へ入れる前に除外する。その後、次を検査する。

- reused IDの一意性
- realized IDとreused IDのintersection 0
- realized + reusedが全source recordsをexact cover
- plan / AST / canonical renderの再生成一致

public `build_step11_rc0031_*`はnon-empty reuseを全て拒否し、private seamは`__all__`へexportされていない。

### 2.4 representative8分母

全8 caseについて、forward採否より前のpredecessor base candidate全13件を既存base parser / matcherで検査した。その後、P2 emitted candidate全10件とのintersectionを照合した。

| case | emitted candidate | 現行S |
|---|---:|---:|
| 0001 | 1 | 1 |
| 0002 | 1 | 0 |
| 0009 | 1 | 1 |
| 0019 | 2 | 3 / 3 |
| 0035 | 1 | 7 |
| 0043 | 2 | 3 / 3 |
| 0063 | 1 | 10 |
| 0100 | 1 | 8 |

集計は次のとおりである。

| 項目 | 実測 |
|---|---:|
| input case | 8 |
| predecessor base candidate | 13 |
| emitted P2 candidate | 10 |
| 現行semantic atom S | 39 |
| construction | 22 |
| relation | 13 |
| semantic link | 1 |
| explicit unknown | 3 |
| independently verified base reuse | 1 |
| duplicate / re-exposition intersection | 1 |

reuse 1件は`0001`だけであり、familyは`explicit_unknown`、match basisは`unknown_id_dimension_exact_target`である。他9候補はreuse 0、intersection 0である。

composition後のaggregateは、added `S=38`とexact reuse `1`で全39 source atomをexact coverする。意味をdropして38にする設計ではない。

### 2.5 0063不変

`0063`は次を維持する。

```text
S=10 / R=1 / exact reuse=0
resource peak=4 / 2 / 4 / 1
resource max=4 / 2 / 4 / 2
```

P2共通Surface composition、catalog、resource、denominatorを変更する必要はない。

### 2.6 0001の成立性

fileを変更せず、process-local診断で一律拒否validatorだけを厳密なacceptance validatorへ置き換え、既存private downstreamを実行した。本文は出力していない。

| 項目 | 結果 |
|---|---:|
| proof | 1 |
| plan exact reuse | 1 |
| rendered added atom | 0 |
| reuse / rendered intersection | 0 |
| proposition clause | 0 |
| required Reception | 1 |
| replan | 0 |
| resource peak | `1 / 1 / 1 / 0` |
| private candidate validation | `()` |
| semantic coverage authorized | `False` |
| runtime connected | `False` |

したがって、composition algorithmの作り直しは不要である。不足はvalidatorのtrust判定だけである。

## 3. 推測

1. verified reuseの8 field projectionは、同一呼び出し鎖で発行元が保証され、final Matcherが再導出する場合のidentity commitmentとして十分である。
2. 同じ8 fieldをserialized dict、caller dataclass、candidate metadataから受け取るだけではproof authorityにならない。
3. P3 internal compositionの数学的成立は証明できるが、production reachableなone-shot coordinatorはP4 adapterまで安全に所有できない。
4. append-onlyでNatural Surface末尾へ同名validatorを追加する方法は、shadow definitionまたは大規模なplan/render複製になる。既存private seamの1関数をin-placeで変更する方が狭い。

これらは今回のproduction codeへ反映していない。

## 4. 華恋の意見

public bridgeがないことを欠陥として隠さず、意図したsecurity boundaryとしてfreezeするべきだと考える。

次の方法でREDをGREENにしてはいけない。

- private consumerをpublic exportする
- SurfaceからMatcherをimportする
- MatcherからSurface、plan、ASTをimportする
- `independent_binding_sha256`を署名として扱う
- caller作成tuple、dict、candidate metadataをverified proofとして信用する
- 0001をdenominatorから外す
- base意味を無視する
- duplicateをexact coverageとして数える
- P2 historical sentinelを見かけ上GREENにするため書き換える

P3ではprivateで成立性とfinal inverseの独立性を証明し、production接続はP4の別承認まで閉じるのが正確である。

## 5. proofとcontextの二層契約

### 5.1 Matcher-issued material

Matcherが発行するbody-free materialは次である。

```text
schema_version
source_atom_id
semantic_family
base_parsed_atom_id
base_obligation_id
match_basis
base_surface_sha256
source_authority_sha256
independent_binding_sha256
body_free=True
```

Surfaceへ投影するのは中央8 fieldだけである。`schema_version`と`body_free=True`は投影前にMatcher側material validatorで確認する。

### 5.2 Forward composition context

Forward側は次をcallerから信用せず、その場で再導出する。

```text
source_base_candidate_id
source_base_realization_plan_id
successor_snapshot_sha256
SHA256(base_candidate.final_utf8_bytes)
successor.relation_construction_authority.authority_sha256
current source record ID / family / exact match basis
```

hash field単体はauthorityではない。authority chainは次の全体である。

```text
fresh base bytes
  -> parser-origin witness
  -> matcherによるbase binding再検証
  -> matcherによるsource authority再検証
  -> body-free proof発行
  -> same-call private projection
  -> records - reuse before planning
  -> canonical render
  -> final bytesを別のrc0031 Parser / Matcherが再検証
```

## 6. phase順とowner

### D0: 今回の設計

- 本補遺でowner、proof、context、順序、STOPを固定
- production source変更0

### D1: 今回のRED

- test-local orchestrationだけがfresh base proofを作る
- public P2 routeは閉じたまま
- private consumerの期待契約をintentional REDにする
- production source変更0
- exact 10を`5 PASS / 5 intentional RED`でfreeze

### 将来P2/P3 composition implementation: 別承認必須

- Natural Surfaceの予約済みprivate validator 1関数だけをin-placeで厳密化
- public P2 buildersのnon-empty拒否は維持
- exact 10を同じtest bytesで全GREEN
- production runtimeへ接続しない

### 将来P3 final inverse: 別承認必須

- Matcherの現行722,658-byte predecessor prefixを維持し、rc0031 final-body Parser / Matcherをappend
- Matcherはforward plan / AST / metadataを読まない
- final parsed atomとindependently rederived base reuseでsource全体のXOR coverageを検査
- Hard Gate / runtimeへ接続しない

### P4: 今回未承認

- disconnected adapterが一回限りのcoordinatorを所有
- base proofをforwardより前に導出し、private Surfaceを呼び、final inverseへ渡す
- Gate / selector / runtime / manifestの開始には別承認が必要

## 7. 将来private validatorのexact contract

将来の実装が承認された場合、private validatorは次をboundedに検査する。

1. containerはexact tuple、件数`<=64`。
2. row typeはexact `Step11Rc0031BaseBodyExactReuseBinding`。
3. source IDは一意で、duplicate rowを拒否する。
4. source IDがcurrent recordsにexact 1件存在する。
5. row familyがcurrent record familyと一致する。
6. match basisがfamily別frozen exact basisと一致する。
7. parsed atom ID、obligation ID、3 SHA-256がformat-validである。
8. base SHAがcurrent base final bytesのSHA-256と一致する。
9. source authority SHAがcurrent successor authorityと一致する。
10. independent binding SHAがfrozen schema、全proof material、`body_free=True`から再計算した値と一致する。
11. 不一致は`STEP11_RC0031_VERIFIED_REUSE_COMPOSITION_INVALID`でfail-closeする。
12. empty tupleは従来どおり受け入れる。
13. validatorのvalid / attack実行はstdout / stderrを一切出さず、file、process、network、logging side effectを持たない。

このvalidatorだけでproof発行元を認証したとは主張しない。same-call Matcher originとfinal independent revalidationが必須である。

## 8. planning / render / inverse contract

1. fresh base proofをforward atom planningより前に取得する。
2. validated reuse IDsをcurrent source recordsから除く。
3. remaining recordsだけを既存compositionへ渡す。
4. reused IDとrendered IDのintersectionを0にする。
5. reused IDとrendered IDのunionを全source IDと一致させる。
6. reuseはsemantic coverage authorizationを与えない。
7. canonical candidate validationは同じproofを使って再生成一致を確認する。
8. final rc0031 Matcherはforward planのreuse列を信用せず、base bodyとfinal added bytesから独立に同じpartitionを再導出する。

## 9. RED exact 10

### PASS exact 5

1. predecessor、single patch hole、path、resource、body-free freeze
2. representative8全10候補のreuse denominator
3. public reuse拒否とprivate seam非export
4. malformed envelope / bound fail-closeと現行0001 forward分母
5. fresh proof materialのbody-free / scan bound、およびcomposition実行のstdout / stderr 0

### intentional RED exact 5

1. fresh verified reuseをplanning前に消費
2. reuseとrendered atomのexact XOR
3. 0001 duplicate re-exposition 0
4. deterministic canonical candidate、private validation、resource exact
5. shape-valid wrong-authority attackをgeneric unavailableと区別してinvalidへ閉じる

現在の5 REDは全て、実在するprivate builderをfresh proof付きで実行した結果、同じclosed validatorが`STEP11_RC0031_P3_EXACT_REUSE_NOT_AVAILABLE`を返すことで発生する。missing symbol、collection error、unconditional fail、mock、skip、xfailではない。

## 10. attack contract

次を全て`STEP11_RC0031_VERIFIED_REUSE_COMPOSITION_INVALID`で拒否する。

- base SHA transplant
- source authority SHA transplant
- source atom ID swap
- semantic family swap
- exact match basis swap
- independent binding hash mutation
- digest再計算済みfield transplant
- 0001 proofの別base / 別successor contextへのtransplant
- duplicate source row
- non-tuple envelope
- wrong row type
- 65-row bound excess

public APIへの正当proof投入も、P3/P4接続前は従来コード`STEP11_RC0031_P3_EXACT_REUSE_NOT_AVAILABLE`で拒否する。

## 11. resource

### 実測

| 項目 | 値 |
|---|---:|
| predecessor base candidate | 13 |
| emitted candidate | 10 |
| preplanning parser | 13 |
| preplanning matcher | 13 |
| parser scan | 26 |
| inspected base bytes | 6,249 |
| scan込みbyte inspection | 12,498 |

### closed maximum

candidate最大12件について、preplanning base proofはparser / matcher各12回、scan込み最大24,000,000 byte inspectionである。final bodyを検証する2回目を含めても、既存上限のparser / matcher各24回、48,000,000 byte inspection内に収まる。

resource上限は変更しない。

## 12. exact path / patch boundary

### 今回のrepository MODIFY exact 1

- `ai/tests/test_emlis_nls_v3_s11_rc0031_forward_inverse_independence.py`

### 今回のproduction source change

- 0 path

### 将来変更候補として予約するNatural Surfaceの1 slot

current Natural Surface:

```text
bytes 482,504
SHA-256 e19eae9a62068ec3095785fc20aafda6c277df96470a7b1e48ca51ca3142d7d4
```

mutable slotは次の2 marker間だけである。

```text
start: def _step11_rc0031_validate_verified_reuse_composition(
end:   def _step11_rc0031_composition_units(
```

| region | bytes | SHA-256 |
|---|---:|---|
| immutable prefix | 404,481 | `50cd281d79619f785d8065f411eaa020cb3ed8c335025983e5068ea29672e7ed` |
| current closed slot | 2,192 | `217eb68048f9a420214088e81f708e9747b6cf327781d6e24885bb9abc966c32` |
| immutable suffix | 75,831 | `f2f8e3f0201efddf6c197618a8a5f31e8dd823d352ca6241bd331a88e1962985` |

将来承認後もprefix / suffixをexact保持し、slotは8,192 bytes以下とする。slotのtop-level ASTは同じ名前・同じ引数のFunctionDef exact 1だけとし、import、class、nested function、lambda、global / nonlocalを置かない。`__import__`、`eval`、`exec`、`globals`等のdynamic escapeと、print / logging / file / process / network sinkを禁止する。valid compositionと全attack callのstdout / stderrをcaptureし、空であることを検査する。

`ai/services/ai_inference`配下のPython path inventoryはexact 546、sorted path-list SHA-256`46db0d14852dde6ebb6012596234cbb935243b27ed227465d9e94876ce4f5d56`で固定する。さらに、変更対象SurfaceとこのRED testを除くrepository全Python exact 1,533について、path・size・content SHAのaggregate SHA-256を`ff684888cb4ca3b92494ba5128fdd3ca16ea9bc08a9d263ee2ea0c9f35c47573`で固定する。slot内Callは明示allowlistだけを認め、Subscript callとdunder name / attributeを拒否する。service外helper追加と既存helper改変の双方へ実装を逃がせない。shadow definition、同名再定義、plan / renderer複製、別source追加を禁止する。

今回のcomposition exact 10ではMatcher全722,658 bytes、SHA-256`648a3a6690f8df860053c811a5416fcfc9983524e5ff880a0e6921a122a52e30`を固定し、suffixも許可しない。将来のP3 final inverseは別の明示承認とRED scope改訂を得た後だけ、既存全bytesをprefixとしてappendできる。

## 13. acceptanceとSTOP

### composition implementation entry

次を全て得るまでproduction editを開始しない。

1. 本ZIPのrepository exact 1がGitHubへ反映される。
2. 反映commit SHAが提示される。
3. exact 10 RED freezeの承認が得られる。
4. Natural Surface private validator 1 slotのproduction変更が明示承認される。

### composition GREEN条件

- 同じtest bytesでexact 10が全PASS
- public non-empty reuseは引き続き拒否
- 0001 `S=0 / R=1 / reuse=1 / peak 1/1/1/0`
- representative aggregate `added S=38 + reuse=1`
- 0063 `S=10 / R=1 / reuse=0 / peak 4/2/4/1`
- attack、privacy、resource、predecessor regression維持
- production runtime disconnected

### 即時STOP

- public reuse APIを開く必要がある
- caller metadataをproofとして信用する必要がある
- Surface / Matcher間のforbidden importが必要になる
- Natural Surfaceの予約slot外を変更する必要がある
- Matcher既存prefixを変更する必要がある
- fixture、P1、P2、catalog、Gate、runtime、manifestを変更する必要がある
- resourceまたはdenominatorを広げる必要がある
- P4、E2以降を開始する必要がある

その場合は実装せず、追加ownerと必要性をMashへ提示する。
