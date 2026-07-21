# NLS v3 Step 11 rc0031 P2/P3 Verified Base Reuse Composition GREEN Handoff

作成日: 2026-07-21 JST  
対象: `Step 11 / Cycle 001 / rc0031 / P2-P3 private composition`  
immutable P2 predecessor: `9f8a816a66e75cedb6fcc09ddec00e4bf78bbb4d`  
composition RED freeze: `0560875de7776aa752b5824ce8573c191feaaf34`  
composition GREEN commit: `f7caf169c36d6097a63ca389706a75eb98783116`  
設計正本SHA-256: `6aa3fb799919ac30b0eb84571ac4009d62a2bd799c84322272a59bba533f13bc`  
状態: `PRIVATE COMPOSITION GREEN / PUBLIC REUSE CLOSED / STOP BEFORE P3 FINAL INVERSE`

## 0. 結論

承認されたprivate validator 1関数だけを変更し、同じcomposition exact10を`10 PASS / 0 FAIL`にした。

`0001`のindependently verified base reuseはforward planning前に消費され、重複再提示をせず、次の契約を満たす。

```text
S=0 / R=1 / exact reuse=1
reuse ∩ rendered=0
reuse ∪ rendered=source exact1
resource peak=1 / 1 / 1 / 0
```

ただし、これはpublic reuse APIの開放でも、hashによる発行元認証でもない。public non-empty reuseは従来どおり拒否し、same-call Parser / Matcher originとfinal independent revalidationは後続の別境界として残している。

## 1. 確認した事実

### 1.1 GitHub authority

- repository: `MassyuRed/mashos-api`
- parent: `0560875de7776aa752b5824ce8573c191feaaf34`
- GREEN commit: `f7caf169c36d6097a63ca389706a75eb98783116`
- parentから`ahead 1 / behind 0`
- changed pathは次のMODIFY exact 1だけ

`ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py`

GitHub上のfinal blobは`24c3748069fe1a164934d977fc0f6c6c2e2130c4`で、検証に使用したlocal final bytesと全内容が一致した。

### 1.2 production変更範囲

変更したsymbolは次のprivate function exact 1だけである。

`_step11_rc0031_validate_verified_reuse_composition`

| material | bytes | SHA-256 / Git blob |
|---|---:|---|
| Natural Surface final | 485,490 | `ee2f4bc0ab260e8cf1ce2b87acf499e84712ed6b3e639a6a1a6a0141bd3ea520` |
| Natural Surface final Git blob | — | `24c3748069fe1a164934d977fc0f6c6c2e2130c4` |
| frozen prefix | 404,481 | `50cd281d79619f785d8065f411eaa020cb3ed8c335025983e5068ea29672e7ed` |
| private validator slot | 5,178 | `3356cecd99d65009c34e512966ae154857c4f167afe714c6907744d68a33ddea` |
| frozen suffix | 75,831 | `f2f8e3f0201efddf6c197618a8a5f31e8dd823d352ca6241bd331a88e1962985` |
| Matcher full file | 722,658 | `648a3a6690f8df860053c811a5416fcfc9983524e5ff880a0e6921a122a52e30` |

slotは上限8,192 bytes内である。prefix、suffix、Matcher全bytesは不変だった。

production diffは`110 additions / 39 deletions`で、変更先は上記1関数内だけである。

### 1.3 validatorが確認するもの

non-empty private bindingについて、次をfail-closeで確認する。

1. tuple envelope、上限64、exact binding type
2. source IDの重複なし
3. source IDがcurrent recordに存在すること
4. semantic familyがcurrent recordと一致すること
5. family別match basisが一致すること
6. parsed atom ID、obligation ID、3 SHA列の形式
7. base SHAをcurrent baseのfinal bytesから再計算して一致させること
8. source authority SHAがcurrent successor authorityと一致すること
9. frozen body-free materialからindependent binding SHAを再計算して一致させること

通常の不一致、別base / 別authorityへの移植、duplicateは次へ閉じる。

`STEP11_RC0031_VERIFIED_REUSE_COMPOSITION_INVALID`

一方、shape-valid non-empty bindingでもsource recordsがexact emptyなら、旧P2契約を維持して次へ閉じる。

`STEP11_RC0031_P3_EXACT_REUSE_NOT_AVAILABLE`

empty binding tupleは従来どおり受理する。

### 1.4 public boundary

- public non-empty reuse: 拒否のまま
- public closed code: `STEP11_RC0031_P3_EXACT_REUSE_NOT_AVAILABLE`
- private seam: `__all__`非exportのまま
- hash: 整合性commitmentであり署名ではない
- same-call Parser / Matcher origin: 引き続き必要
- final independent revalidation: 引き続き必要
- runtime: disconnectedのまま

### 1.5 machine verification

| suite | final result | 解釈 |
|---|---:|---|
| composition exact10 | `10 PASS / 0 FAIL` | 承認されたGREEN条件成立 |
| rc0031 P1 exact7 | `1 PASS / 6 intentional RED` | 6 closed code不変 |
| rc0031 P2 exact24 | `23 PASS / 1 historical RED` | `P2_PATH_SCOPE_INVALID`のみ |
| rc0030 P3 + predecessor | `57 PASS / 1 historical RED` | `P3_P2_PREDECESSOR_DRIFT`のみ |
| rc0030 predecessor behavior exact4 | `4 PASS` | 既存挙動非回帰 |
| static private patch-hole | `1 PASS` | prefix / suffix / Matcher / path scope維持 |

composition exact10のRED baselineは`5 PASS / 5 intentional RED`で、5 REDの直接原因は全て`STEP11_RC0031_P3_EXACT_REUSE_NOT_AVAILABLE`だった。同じtest bytesを変更せず、finalで10件全てPASSした。

stdout / stderr、body、rendered text、parsed span、source payload、unsalted body digestの漏えいは検出されていない。

### 1.6 検証中に検出し、未反映のまま修正したこと

最初の実装候補はexact10を通したが、P2回帰が`STEP11_RC0031_P2_PRIVATE_UNGROUNDED_REUSE_ACCEPTED`を検出した。この候補はGitHubへ反映していない。

旧P2閉鎖を戻した次候補では、別baseへ移植したproofが`INVALID`ではなく旧`EXACT_REUSE_NOT_AVAILABLE`へ閉じる分類誤りをexact10 attackが検出した。この候補も反映していない。

finalでは、current base / authorityとの不一致を先に`INVALID`へ閉じ、その後にsource records exact emptyの旧P2閉鎖を適用する。これによりP2とattack exact10を同時に満たした。

## 2. 推測

1. exact10が同じtest bytesで全GREENになったことから、既存private planner / renderer / candidate validatorは、承認されたcomposition範囲では追加変更なしに役割を果たしていると考えられる。
2. ただしprivate field validationだけでは、bindingがこの呼び出しのMatcherから発行されたことを認証できない。
3. したがって、今回のGREENをpublic coordinatorやP3 final inverseの完成と解釈すると、確認範囲を越える。

## 3. 華恋の意見

今回の実装はfreeze候補にしてよい。途中候補でP2とattackの両方向から問題を拾い、finalは両方を閉じている。変更も予約されたprivate slot内だけである。

一方、public reuse APIは閉じたままにするべきで、hashを署名と呼ぶべきではない。hashは「同じ材料から同じ値を再計算できる」ことを確かめるものであり、「誰が発行したか」を証明しない。

次は、このGREENを基点として固定した後、P3 final Body-only Parser / Independent Matcherの設計補遺とproduction不変REDを先に作るのが妥当である。Matcher変更やpublic coordinatorへ一度に進めるべきではない。

## 4. 根拠と必要性

### 根拠

- RED baselineの5件が同じclosed validatorを直接原因としていた。
- production変更は、そのvalidator 1関数slot内だけである。
- same exact10が10 / 10 PASSになった。
- P1、P2、rc0030回帰は既知のintentional / historical RED以外を追加していない。
- GitHub commitはRED freezeから1 commit、1 changed pathである。

### 必要性

- current source record、base、authority、binding materialを照合しなければ、shape-valid metadataだけでreuseを受け入れてしまう。
- P2 exact-empty recordsの旧閉鎖を保持しなければ、未grounded private reuseを開いてしまう。
- 別base / authorityの不一致を先に判定しなければ、移植攻撃を正しいattack codeへ閉じられない。
- public APIとfinal inverseを別境界に残さなければ、整合性hashを発行元認証と誤認する危険がある。

## 5. 維持したもの

- immutable P2 predecessor
- composition RED exact10 bytes
- P1 fixture、closed code、control、attack
- P2 source / test
- Matcher full bytes
- catalog、Gate
- representative denominator
- resource max `4 / 2 / 4 / 2`
- 0063 `S=10 / R=1 / reuse=0 / peak=4 / 2 / 4 / 1`
- body-free / privacy
- public reuse拒否
- runtime disconnect

## 6. STOP境界

今回開始していないもの:

- P3 final Body-only Parser
- P3 final Independent Matcher
- public reuse coordinator
- P4
- runtime / manifest
- E2以降

次が必要なら、新しい承認前にSTOPする。

- Natural Surfaceの予約slot外変更
- Matcher変更
- public reuse API開放
- hashを署名または発行元proofとして扱うこと
- fixture / P1 / P2 / catalog / Gate変更
- resource / denominator拡張
- P4 ownerの前倒し

## 7. 次の明示承認

次へ進む場合は、Mashによる次の明示承認が必要である。

> P2/P3 verified base reuse composition GREEN commit `f7caf169c36d6097a63ca389706a75eb98783116`をfreezeする。Matcher full file `722,658 bytes / SHA-256 648a3a6690f8df860053c811a5416fcfc9983524e5ff880a0e6921a122a52e30`をimmutable predecessorとして保持し、P3 final Body-only Parser / Independent Matcherの設計補遺作成と、production source不変のRED先行検証を開始してよい。public reuse API、P1、P2、fixture、catalog、Gate、resource、denominator、runtime、manifestは変更しない。P4、E2以降は開始しない。

この承認までは、後続production実装を開始しない。
