# NLSv3 Step11 rc0031 P2 Forward — Local Verification Handoff

- 作成日: 2026-07-20 JST
- 作成者: 華恋
- 対象: Cocolon / EmlisAI / NLS v3 / Step11 / Cycle001 / rc0031 / P2
- 証拠境界: BODY-FREE
- local predecessor: `MassyuRed/mashos-api` commit `f63269fde48eed7aa9d8dfe4e818a011894b6f8e`
- current decision: `P2_FORWARD_IMPLEMENTATION_LOCALLY_VERIFIED`
- freeze: `NOT_FROZEN`
- P3: `NOT_STARTED`

## 0. 結論

承認された共通Surface composition改訂は、意味ownerを付け替えずに機械的に成立した。RED先行後にP2 productionを実装し、`0063`は `S=10 / R=1 / exact reuse=0` のままpublic candidateを1件生成した。実測resource peakは `4 / 2 / 4 / 1` で、上限 `4 / 2 / 4 / 2` は変更していない。

修正後のP2 exact24は `24 passed`、P1 exact7は同じ `1 PASS / 6 intentional RED`、rc0030 predecessor behaviorは `4 passed`である。

この成果物はGitHub commitではない。Mashがrepository exact 4ファイルを反映し、commit / push後のSHAを共有するまでP2をfreezeしない。P2 freezeとP3開始も別の明示承認を必要とする。

## 1. 確認した事実

### 1.1 RED先行と数理成立性

1. production実装前の0063 nodeは、exact code `STEP11_RC0031_NO_VALID_FORWARD_CANDIDATE`でintentional REDになった。
2. `0063`のsemantic atomはconstruction 6件 + relation 4件の計10件、required Receptionは1件である。
3. construction ownerの一つに2 atomがあり、そのownerに接続するrelation headは1件しかない。したがって、owner一致とhead endpoint内のmodifier target一意性を守る限り、4 composition unitへの圧縮は成立しない。
4. 意味保存する最小witnessは5 unitである。group別atom sizeは `2,2 / 2 / 3,1`、追加unit数は `2 / 1 / 2`、既存込みunit数は `4 / 3 / 4`となる。
5. この5-unit witnessは全10 atomをexactly onceでrealizeし、owner graph、relation endpoint、direction、semantic keyを保持する。

### 1.2 repository変更

| operation | path | 根拠と必要性 |
|---|---|---|
| MODIFY append-only | `ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py` | P2-owned typed composition、owner-ready配置、canonical plan/AST/render再導出、fail-closed validationに必要 |
| NEW | `ai/services/ai_inference/emlis_ai_step11_rc0031_experiment_surface_catalog_v3.py` | schema語を露出せず、closedな単一predicate authorityでcompact/standalone文法を実現するために必要 |
| MODIFY path-scope only | `ai/tests/test_emlis_nls_v3_s11_rc0031_proposition_surface_red.py` | adapter不在でもP1/P2/P3それぞれのexact active path状態を認識し、P1 semantic REDを変えず再freezeするために必要 |
| NEW | `ai/tests/test_emlis_nls_v3_s11_rc0031_proposition_surface_mutation.py` | P2 exact24、0063 witness、false composition/resource、canonical revalidation、boundary failureを独立検証するために必要 |

### 1.3 composition契約

- modeは `construction_modified_head` と `independent_clauses` の2つだけ。
- construction modifierのtargetは、source construction atomの唯一ownerと一致し、non-construction headのendpoint内にある。
- 同一head内のmodifier targetはdistinct。
- compactは最大3 atom / visible clause 1、independentは最大2 atom / visible clause最大2。
- unit内atomはowner-connectedでなければならない。
- `owner_ready_group_ordinal`はunit内ownerの導入group最大値。配置はそこから後方のresourceを満たす最初のgroupへ決定的に遅延する。
- complexityは `max(atom数, distinct owner数, visible clause数)`。
- candidate/plan/AST/renderのcaller自己申告はauthorityにせず、canonical inputから再導出する。
- case ID、family、control、review resultによるproduction分岐はない。

### 1.4 reuse境界

最終監査で、非公開seamに未証明reuseを受理できる経路が一度見つかったため、freeze前に削除した。現在はpublic/privateともnon-empty reuseを認めない。

- shape-valid non-empty: `STEP11_RC0031_P3_EXACT_REUSE_NOT_AVAILABLE`
- malformed private envelope: `STEP11_RC0031_VERIFIED_REUSE_COMPOSITION_INVALID`
- Body-only Parser: 未実装
- Independent Matcher: 未実装
- P3 reuse authority: 未実装

### 1.5 検証結果

| verification | result |
|---|---:|
| P2 exact24 collection | 24 |
| P2 exact24 execution | 24 PASS / 0 FAIL |
| P1 exact7 re-freeze | 1 PASS / 6 intentional RED |
| rc0030 predecessor behavior | 4 PASS / 0 FAIL |
| Python compile | PASS |
| `git diff --check` | PASS |
| frozen exact4 prefix | 4 / 4 MATCH |
| P1 fixture SHA-256 | MATCH |
| catalog key set / construction layout vs frozen predecessor | MATCH |

P1 intentional RED codeは次の6件で変わっていない。

1. `STEP11_RC0031_SOURCE_ROOT_DOMINANCE_NOT_PROVED`
2. `STEP11_RC0031_SCHEMA_FREE_PROPOSITION_NOT_PROVED`
3. `STEP11_RC0031_RELATION_PROPOSITION_NOT_PROVED`
4. `STEP11_RC0031_DISTRIBUTION_DEPTH_NOT_PROVED`
5. `STEP11_RC0031_GROUNDED_RECEPTION_PREDICATION_NOT_PROVED`
6. `STEP11_RC0031_CONTROL_RETAINED_NON_REGRESSION_NOT_PROVED`

実行時に、変更範囲外の既存`@root_validator`に対するPydantic deprecation warningが1種類出る。test failureではなく、今回の変更によるものでもない。

### 1.6 変更していないもの

- P1 fixture
- P1の6 closed code
- control、attack
- resource上限 `4 / 2 / 4 / 2`
- catalog denominator `13 / 13 / 9 / 28 / 10 / 4 / 8 / 12 / 3`
- semantic key当たりalternative数1
- frozen predecessor prefix
- matcher、gate、runtime adapter
- production runtime接続
- P3 Parser / Independent Matcher
- P4以降、E2、E3、E4、Cycle002

## 2. 推測

0063を塞いでいた主因はsemantic atom不足ではなく、従来packerがほぼ `1 atom = 1 visible clause`として配置していたことだと考えられる。ownerを共有するconstructionをrelation headのendpoint名詞句へ従属させることで、意味を落とさずresource内に置けた事実がこの見方を支持する。

ただし、これはP2 forward Surfaceの成立を示すだけである。final bytesからBody-only Parser / Independent Matcherが同じtyped意味を独立再構成できるかは、未開始のP3で別に証明する必要がある。

## 3. 華恋の意見

owner 12の2つ目のconstructionを別ownerへ付け替えて4 unitに見せる案は採用しなかった。短いunit数より、source atomの意味ownerを守る方が優先される。5 unitでもresource内に収まるため、根拠のないfusionやreuseへ逃げる必要はない。

P2のコードはlocal verificationを完了したが、GitHub上のimmutable predecessorがまだ存在しない。未commitの状態をfreezeと呼ばず、Mashの反映commitを確認してからP2 freeze判断を行うのが正確だと考える。

## 4. ZIP内容

```text
repository/
  ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py
  ai/services/ai_inference/emlis_ai_step11_rc0031_experiment_surface_catalog_v3.py
  ai/tests/test_emlis_nls_v3_s11_rc0031_proposition_surface_red.py
  ai/tests/test_emlis_nls_v3_s11_rc0031_proposition_surface_mutation.py
documents/
  NLSv3_Step11_rc0031_P2_0063_SurfaceComposition_Addendum_20260720.md
  NLSv3_Step11_rc0031_P1_ReFreeze_Receipt_20260720.json
  NLSv3_Step11_rc0031_P2_Forward_Receipt_20260720.json
  NLSv3_Step11_rc0031_P2_Forward_Handoff_20260720.md
SHA256SUMS.txt
```

`repository/`以下だけを`mashos-api` repository rootへ同じ相対pathで反映する。`documents/`はhandoff証拠であり、今回のrepository exact 4には含めない。

## 5. Mashに必要な次作業

1. ZIPの`repository/`以下4ファイルを`mashos-api`へ反映する。
2. `SHA256SUMS.txt`で4ファイルを照合する。
3. commit / pushし、そのcommit SHAを華恋へ共有する。
4. そのSHAをimmutable predecessorとして確認した後、P2 freezeを承認するか判断する。
5. P3を開始する場合は、P2 freezeとは別にP3開始を明示承認する。

commit SHAの共有前にP2 freezeを主張せず、P3へ進まない。
