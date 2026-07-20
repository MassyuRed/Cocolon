# NLSv3 Step 11 rc0025 Phase B 実装引継ぎ

- 作成日: 2026-07-18 (JST)
- 対象: `MassyuRed/mashos-api`
- ローカル基準HEAD: `fa34bcf9ba8fb63c97c4ef1f909633fce40dd007`
- 実装境界: rc0025 Phase B
- 結論: **Phase Bは完了。次はPhase Cの全再実行。ただし本資料・ZIPにはPhase C正式成果物を含めない。**

## 1. 確認した事実

### 1.1 rc0024 immediate parent

rc0025は、GitHub反映後のcleanなrc0024を直接の親としている。

| 項目 | rc0024固定値 |
|---|---|
| source file count | 148 |
| manifest artifact SHA-256 | `bbe785c144ac0e721aa8887b0f49848b104f65e6c2820a2f62b7f7d4ed3ac811` |
| source closure SHA-256 | `fa52aa55627dbeada60c5fe2187a7551cd4ab0c72fde289157a82945c0c6467d` |
| final summary SHA-256 | `de09a19ef35b1fbbab78ae6417b0e23f7b0e3701b71fbf58d07bed79aa449534` |
| private verification SHA-256 | `355c412df6e1e21c07ffad37aef077db7fd80bd096b3905e64e1fde9ca4c58e8` |

### 1.2 Phase Aで確定した共通原因

- 最初の停止caseは `NLS2-F03-D03`。
- v1経路では、同一`memo`内にある独立したevent nucleus 2件が別々の単独行になった。
- 両行が同じfallback surface roleと同じ終端stemを持ったため、既存Gateが `relation_surface_stem_repetition_without_new_role` で正しく拒否した。
- runnerは空になったv1 `comment_text`に対してcaseを識別できない汎用例外を出していた。
- 同じv1構造は `NLS2-F10-D03` と `NLS2-F12-D03` にも存在した。したがってF03だけの問題ではなかった。
- Development42の入力は変更されていない。分類はApp-Reachable 24 / expected non-applicable 18のまま。

### 1.3 Phase Bで実装した修復

1. v1共通Surface ownerで、次の全条件を満たす隣接groupだけを一つの中立な観測単位へ統合した。
   - event-only
   - 同一source field
   - source order上で隣接
   - group内部を結ぶrequired relationが存在しない
2. 複数event nucleus用の中立role `coexisting_event_arc` を追加した。
3. 因果・評価・時間順を捏造しない中立文面として「同じ入力に置かれた出来事として並んでいます」を追加した。
4. runnerのv1本文取得失敗を `step11_v1_body_invalid:case_ref=<case_ref>` とし、本文を公開せず停止caseだけを識別可能にした。
5. current candidate、runtime/catalog、lineage、finalizer、batch/regression/dependency tool境界をrc0025へ更新した。
6. rc0024のschema、manifest、summary、private verification、V6 lineageをhistoricalとして保持し、rc0025 V7 lineageをappend-onlyで追加した。
7. finalizerはrc0024 private verificationを必須親入力とし、Phase Cのsummary・各regression receipt・review結果にdefaultや仮値を持たせていない。
8. artifact-dependent acceptance test 3件を、未成立rc0024成果物ではなく、Phase Cで生成予定のrc0025成果物名へ事前配線した。

### 1.4 変更の根拠と必要性

| 変更 | 根拠 | 必要性 |
|---|---|---|
| source-local event group統合 | F03/F10/F12に共通する構造で再現 | case専用分岐を作らずv1本文を成立させるため |
| 中立role / renderer | event間のrequired relationがない | 因果関係や一つの流れを捏造せず、同stem重複を解消するため |
| Gateを変更しない | 拒否理由はGateの誤りではなく上流Surface grouping | fail-close境界を弱めないため |
| case_ref付きbody-free診断 | 従来例外では停止caseを特定できなかった | 次回停止時に入力本文を露出せず責任境界を切り分けるため |
| rc0025 version/lineage | rc0024 freeze後のtext-affecting change | rc0024正式証拠を上書き・継承しないため |
| exact rc0024 parent検証 | GitHub反映漏れの再発リスクが確認された | clean parent以外からrc0025を成立させないため |
| rc0025 acceptance test事前配線 | rc0024 Known28/Development42/invalid16 receiptは不成立 | Phase C後にtest修正してclosure driftを起こさないため |

### 1.5 rc0025 dependency manifest

| 項目 | rc0025確定値 |
|---|---|
| candidate | `nls_v3_rc_0025` |
| immediate parent | `nls_v3_rc_0024` |
| source file count | 151 |
| changed source paths | 22 |
| added source paths | 3 |
| removed source paths | 0 |
| source closure SHA-256 | `983a85aab08b217fd3b09e965c52f789d332f72cac2c03bdb06c9452983e728d` |
| manifest artifact SHA-256 | `222007643aeb46337ebe31e4a46c6a88b96c75134e6ddf881944f52b6723cb47` |
| manifest file-bytes SHA-256 | `2d182bf7ba27df1acd88819c3e740d46d706935b8c4fe8bc78bbbfed0993f260` |

検証結果:

- current manifest validator: issues `()`
- 151件のdeclared hash対live file: mismatch 0
- manifest changed paths対実ソース差分: 完全一致
- package対象repo差分: 19修正 + 4新規（3 tests + manifest）= 23 files

### 1.6 RED / GREENと境界検証

REDはrc0024未修正bytesに対して確認し、その後にproduction修復を入れた。

- production `NLS2-F03-D03` v1本文
- 汎用的な同一source内 independent event x2
- runnerのcase_ref付きbody-free診断

rc0024でも既存Gate負例とF09/F14 controlはGREENのままだった。

修復後の確認:

- 新規rc0025 Surface / lineage / finalizer tests: 13 PASS
- Development42 exact v1: 42 / 42 non-empty、42 / 42 input unchanged
- Development42分類: 24 App-Reachable / 18 expected non-applicable、不変
- Surface / Development42関連group: 121 PASS
- append-only / finalizer関連group: 40 PASS
- Hard Gate security regression: 101 PASS
- 最終artifact参照修正・manifest再freeze後: 18 PASS / Phase C依存3件をdeselect
- 変更Python 22ファイル: compile成功
- `git diff --check`: PASS
- production Surfaceのcase ID / fixture /本文固有分岐scan: 0

上記groupには重複があるため、PASS数は合算しない。

ローカルの隔離test環境にはfull repository conftestが要求するFastAPI依存がなかったため、対象testはproject pathを明示した`--noconftest`経路でも実行した。Phase Cでは正式な完全環境でsecurity全件とStep 0〜9を改めて実行する。

### 1.7 意図的に未実行・未生成のもの

rc0025で生成済みの正式fixtureはdependency manifestだけである。次は存在しない。

- rc0025 formal 100 summary
- rc0025 private verification
- rc0025 Known28 receipt / private packet
- rc0025 Development42 receipt / private packet
- rc0025 invalid16 receipt / private packet
- Product Read結果
- finalizer / cumulative / acceptance artifacts

artifact-dependent test 3件は、これらの正式成果物がないためPhase Bではdeselectした。偽fixture、skip、仮hashは追加していない。

## 2. 推測

- 今回の修復はF03固有ではなく、同一source field内のrelation-free event群という構造へ作用するため、Phase Aで同根と確認したF10/F12にも同じ責任ownerで効くと判断できる。
- ただし、正式100件・Known28・Development42・invalid16・Product Readをまだrc0025 lineageで実行していないため、Cycle 001全体がACCEPTEDになるという結論までは出せない。
- rc0024の100件結果がcleanでも、text-affecting change後のrc0025正式証拠として流用はできない。

## 3. 華恋の意見

Phase Bの完了条件は満たした。修復場所はv1共通Surface ownerで正しく、Gate・Matcher・Applicabilityを緩めず、rc0024を履歴として守ったままrc0025を新しい候補にできている。

次は設計どおりPhase Cへ進むべき。ただし、Phase Cは正式証拠を作る境界なので、このZIP適用とmanifest再検証の後、secure commitment key / private materialの可用性を最初に確認し、次の順序を崩さない方がよい。

1. 新規RED/GREEN再確認
2. security全件
3. Step 0〜9 freeze regression
4. Step 11 non-artifact-dependent regression
5. rc0025 manifest validation
6. 正式100件を新run IDで0001から実行
7. body-free summary / private verification
8. Known28
9. Development42
10. invalid16
11. 100件Product Read 12軸
12. BLOCKER / MAJORが0件の場合だけfinalizer / cumulative / acceptance生成

現時点でMash側の追加ソース作業は不要。Phase C開始時にcommitment key / private materialがローカル実行環境へ安全に供給されていなければ、その供給だけはMashへ依頼する必要がある。

## 4. ZIP内のrepo差分

### 修正 19ファイル

- `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py`
- `ai/services/ai_inference/emlis_ai_step11_cycle_evidence_v3.py`
- `ai/services/ai_inference/emlis_ai_step11_hard_gate_v3.py`
- `ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py`
- `ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py`
- `ai/services/ai_inference/emlis_ai_step11_planning_frontier_v3.py`
- `ai/services/ai_inference/emlis_ai_step11_runtime_adapter_v3.py`
- `ai/services/ai_inference/emlis_ai_step11_semantic_overlay_v3.py`
- `ai/services/ai_inference/emlis_ai_step11_surface_catalog_v3.py`
- `ai/tests/test_emlis_nls_v3_s11_cycle001.py`
- `ai/tests/test_emlis_nls_v3_s11_rc0019_grouped_surface_red.py`
- `ai/tests/test_emlis_nls_v3_s11_rc0021_compound_balanced_surface.py`
- `ai/tests/test_emlis_nls_v3_s11_rc0022_grammatical_chunk_surface.py`
- `ai/tests/test_emlis_nls_v3_s11_rc0024_append_only_lineage.py`
- `ai/tests/test_emlis_nls_v3_s11_rc0024_cycle_finalize.py`
- `ai/tools/emlis_nls_v3_step11_batch_run.py`
- `ai/tools/emlis_nls_v3_step11_cycle_finalize.py`
- `ai/tools/emlis_nls_v3_step11_dependency_manifest.py`
- `ai/tools/emlis_nls_v3_step11_regression.py`

### 新規 4ファイル

- `ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_dependency_manifest_rc0025.json`
- `ai/tests/test_emlis_ai_nls_v3_rc0025_v1_surface_regression.py`
- `ai/tests/test_emlis_nls_v3_s11_rc0025_append_only_lineage.py`
- `ai/tests/test_emlis_nls_v3_s11_rc0025_cycle_finalize.py`

GitHubへのcommit / pushは行っていない。
