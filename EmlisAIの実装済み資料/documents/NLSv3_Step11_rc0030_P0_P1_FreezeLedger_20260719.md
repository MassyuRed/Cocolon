# NLS v3 Step 11 rc0030 — P0 / P1 Freeze Ledger

作成日: 2026-07-19 JST  
作成者: 華恋  
対象工程: `Step 11 / Cycle 001 / rc0030 P0-P1`  
文書状態: `P1 FIVE-CONCERN SEMANTIC RED FROZEN`

## 0. 結論

- GitHub predecessor: `MassyuRed/mashos-api@e1e2ec5c17fa165f9972373304899802832ecd5b`
- GitHub `main`との比較: `identical / ahead 0 / behind 0`
- rc0029: `FROZEN_AS_E3_PRODUCT_READ_STOP_EVIDENCE`
- P0 predecessor freeze: `COMPLETE`
- P1 collection: `6 / 6 COLLECTED`
- P1 execution: `1 PASS / 5 INTENTIONAL SEMANTIC RED`
- collection error / error / skip / xfail: `0 / 0 / 0 / 0`
- production source change in P1: `0`
- rc0030 implementation: `NOT_STARTED`
- P2: `NOT_STARTED`
- E2 / E3 / E4: `NOT_STARTED / NOT_STARTED / NOT_STARTED`
- Cycle 001: `NOT_ACCEPTED`

P1のREDは、rc0030 moduleの未存在、collection error、常時fail mock、`skip`、`xfail`ではない。現行rc0029 private experimentを実行し、selected final bytes、immutable base bytes、body-free source authorityおよび独立証明の有無から5つの共通Surface課題を再現した。

## 1. 確認した事実

### 1.1 GitHub / predecessor

1. GitHub連携で`e1e2ec5c17fa165f9972373304899802832ecd5b`と`main`を比較し、`identical`を確認した。
2. rc0029 manifest closureは`cd46925c6db478ac07e501acb64c45cae3a122ab0c1d834d06a83f1190cfb082`である。
3. P1開始前後でexact 4のcurrent SHA-256は変化していない。

| existing owner | frozen/current SHA-256 |
|---|---|
| `emlis_ai_step11_grounded_lexicalization_v3.py` | `43e99c6077e93db61908e11672d08122cb5928fe63fe64ae0ca565659b43bff4` |
| `emlis_ai_step11_natural_surface_v3.py` | `2f797d7aad7f16b234b8a8dad57204b5788e4ae23e43306ac8ca5da790eba7a2` |
| `emlis_ai_step11_natural_surface_matcher_v3.py` | `9bdae4b5c3d99e99dd01b622b9b191afbfa0e601789fba082a03c069b70028b5` |
| `emlis_ai_step11_hard_gate_v3.py` | `6911291682508bcd6df66d39acb7a6b29b1cfc411434d1ff13160125c9af6c9a` |

### 1.2 P1 repository delta

新規2 pathのみである。

| path | SHA-256 | bytes / lines | 役割・必要性 |
|---|---|---:|---|
| `ai/tests/fixtures/emlis_nls_v3/cycle_001/rc0030_representative8_body_free.json` | `9cfbdafaf43a3caed8b5dc00e68b56cd2b24003a002f0a7cbd1c3ec06d598fa5` | 22,751 / 383 | predecessor、代表8件、control、resource、attack分母をbody-free固定する |
| `ai/tests/test_emlis_nls_v3_s11_rc0030_surface_planning_red.py` | `56bc3603392df982ae748c9c4ae635fc7eca7867213f77bab1de051f35f38191` | 24,620 / 655 | 現行behaviorを実行し、5懸念のsemantic REDを閉じたcodeで固定する |

service、tool、manifest、catalog、runtime、exact 4への追加は行っていない。

### 1.3 P1 five-concern RED

| concern | case / contract | closed RED code | 現行rc0029で確認した意味的失敗 |
|---|---|---|---|
| main meaning dominance | `0009` | `STEP11_RC0030_MAIN_MEANING_APPENDIX_DOMINANCE` | base-leading Observationへ構造tailが連続追記され、body-only prominence証明がない |
| schema-free realization | `0035` | `STEP11_RC0030_SCHEMA_EXPOSITION` | 専用structural wrapperと複数handleを持つschema postscript |
| semantic chunk distribution | `0035` | `STEP11_RC0030_SURFACE_DISTRIBUTION_OVERCONCENTRATED` | typed atomがowner-connected chunkへ配分された独立witnessがなく、末尾へ集中 |
| grounded reception naturalization | `0035` | `STEP11_RC0030_GROUNDED_RECEPTION_PREFIX_LIST` | target handle列をunchanged base Receptionへprefixする形式 |
| control non-regression | `0001 / 0002 / 0009` | `STEP11_RC0030_CONTROL_NON_REGRESSION` | common proxy未達。特に0001のexactly-once unknown reuse未証明、0009のtail / prominence未達 |

実行結果:

```text
6 tests collected
1 passed, 5 failed, 1 warning in 111.24s
errors 0 / skipped 0 / xfailed 0
```

warning 1件は既存`api_emotion_submit.py`のPydantic V1 `root_validator` deprecationであり、本P1差分によるfailureではない。

### 1.4 control authority

| case | rc0027 baseline | rc0029 Product Read | rc0030 acceptance |
|---|---|---|---|
| `0001` | PASS | MINOR | PASS |
| `0002` | PASS | PASS | PASS |
| `0009` | MINOR | MAJOR | PASS / MINOR |

control ID、role、severityはfixture / testだけが読む。service generation branchへ渡さない。

### 1.5 existing-body exact reuse

`0001`では次のbody-free chainが固定済みである。

```text
successor source unknown
  unknown_6d52df90cd0b05c2fd0a
    -> actual semantic_unknown:u2fddc7083cf9a9f771ab8c08
    -> base integrated unknown s11unk_2c413bd3188bcc89
    -> base parsed atom nls3s11atom_9b08974106c89751
    -> obligation obl_95d35127c3f9d6d0
    -> independent match_basis unknown_id_dimension_exact_target
```

このchainは語彙一致やforward `covered`ではなく、base final bytesのparseとIndependent Matcherに基づくexact reuse候補である。rc0029は同じrequired cause unknownを追加説明しており、Product Readの`DUPLICATIVE_UNKNOWN`とも整合する。P2以降ではexactly onceを維持し、dropとduplicateを両方拒否する。

## 2. retained attack / resource freeze

### 2.1 attack denominator

- rc0029で実行済みのretained mutation: `33`
- P1で固定したrc0030固有pending attack contract: `20`
- pending 20をP1の実行済み件数には数えていない。
- rc0030実装後は、pending attackを実行可能なmutationにし、placeholderやcallable-presenceを件数へ含めない。

retained 33は、relation endpoint / direction / type、construction、semantic link、explicit unknown、natural handle、Reception、semantic coverage自己申告、stale hash、catalog、resource、candidate 12、replan 1等を含む。

pending 20は、base-body false reuse / duplicate、chunk wrong-owner / reorder / duplicate、bridge endpoint / direction、catalog false parse、Reception target / support / act / scope、sole-line fallback、control fixture / severity改変、symbol duplicate / shadowを含む。

### 2.2 global resource contract

| bound | frozen value |
|---|---:|
| total candidates | `<= 12` |
| variants per base candidate | `<= 1` |
| replan | `<= 1` |
| owner | `<= 24` |
| natural handle scalar | `<= 32` |
| parser body bytes | `<= 1,000,000` |
| visible source anchor | `<= 1` |
| realization units / discourse group | `<= 4` |
| visible clauses / grammatical sentence | `<= 2` |
| complexity load | `<= 4` |
| repeated joiners / group | `<= 2` |

### 2.3 parser / decomposition contract

| bound | frozen value |
|---|---:|
| successful parse witness | exactly `1` |
| stored decompositions / locus | `<= 2`; 2はambiguous fail-close |
| decomposition loci / candidate | `<= 38` |
| evaluated decompositions / candidate | `<= 76` |
| handle binding comparisons | `<= 576` |
| body scan passes / invocation | `<= 2` |
| Parser invocations / candidate | `<= 2` |
| Matcher invocations / candidate | `<= 2` |
| Parser invocations at candidate ceiling | `<= 24` |
| body-byte inspections at candidate ceiling | `<= 48,000,000` |
| permutation / backtracking | forbidden |

rc0029はdecomposition / iteration counterを持たない。したがって、上表は観測値ではなくrc0030 implementation contractであり、P2以降でcounter fieldと超過fail-closeを実装する。上限を拡張してGREENにしてはならない。

### 2.4 Reception support denominator

代表8件のrequired Receptionはすべてsupport endpoint `0`であり、代表8件だけでは`reception-support-omission`を実行できない。この0を隠さずfixtureへ固定した。

既存のimmutable Grounded Human Reception unit authorityにはsupport-positive case `D`と`I6-D02`がある。fixture hash `cb601019dc2c7e4e46281133d3965addf04adf4f6af8defaf715f91f522e3efb`を参照し、P3/P4 mutationでsource-authorized positive denominatorとして使う。serviceのcase branchは許可しない。この既存authorityから実行可能なrc0030 testを構成できない場合、supportデータを捏造せずSTOPする。

## 3. 推測

1. 5件が同じrenderer topologyから再現したため、残課題は単一caseの語句ではなく、Surface realization planの共通責任にある可能性が高い。
2. rc0029のParser / Matcher / Gateは情報閉包を通しているため、required意味を増減せず、base planとtyped authorityの割当て方を変えることで修復できる見込みがある。
3. ただし、main meaningの最終判定とcontrol severityはmachine proxyでは完結しない。E3 Product Readを最終authorityとして残す必要がある。

## 4. 華恋の意見

P1は正しくREDで止められた。production sourceを触る前に、失敗の意味、分母、resource、control baselineを固定できている。

次はP1 test / fixtureを変更せず、P2でrc0030 forward lexical projection、Surface realization plan、schema-free rendererを実装するのが正しい。rc0029 final bytesへの追記や、語彙差し替えだけで5件を回避してはいけない。

P2実装時は、main meaning witness、owner-connected chunk binding、exact base reuse commitment、bounded parser counterを最初からdata contractへ含めるべきである。後付けするとforward自己認証やresource分母変更になりやすい。

## 5. 現在の境界

許可する表記:

- `rc0030 P1 semantic RED frozen`
- `P0 / P1 complete`
- `production source unchanged in P1`
- `P2 ready for explicit start`

許可しない表記:

- `rc0030 implementation started / GREEN`
- `P2 / P3 / P4 / P5 complete`
- `E2 / E3 / E4 started or passed`
- `Cycle 001 accepted / completed`
- `Step 11 completed`

正確な次指示案:

> 「rc0030 P1 five-concern semantic RED freezeを承認する。P1 test、body-free fixture、5 closed RED code、control baseline、resource denominator、retained 33 attackとpending 20 attackを不変にし、exact 4 frozen prefixの末尾へrc0030-prefixed APIだけをappendするP2 forward lexical projection / Surface realization plan / schema-free rendererを開始する。rc0029 final bytesを修復入力にせず、immutable rc0027 base AST / realization planとE1b typed authorityから別versionを構成する。既存authority外owner、resource拡張、case / review / corpus / failure-family / control branchが必要なら停止して影響範囲を提示する。」
