# Cocolon / EmlisAI Natural Language Surface V3

## Step 11 Cycle 001 — rc0024 引継ぎ資料

- 作成日: 2026-07-18（Asia/Tokyo）
- 対象リポジトリ: `MassyuRed/mashos-api`
- 対象設計: `Cocolon_EmlisAI_ModelFreeNaturalLanguageSurfaceV3_DetailedDesign_ImplementationOrder_20260714_Revised_Cycle.md`
- 対象工程: Step 11「100件単位の累積評価ループ」Cycle 001（new 100 / cumulative 100）
- 現在の停止境界: rc0024の正式100件実行後、全regressionのDevelopment42実行中にfail-closeして停止
- 次候補: rc0025（まだ作成・実装・freezeしていない）

---

## 1. 最初に読む結論

rc0024は、正式100件のmachine runでは100件すべてを正常選択し、Hard Gate・App-Reachable・分布評価も通過した。ただし、続くKnown28 / Development42 / invalid16の一括regressionがDevelopment42のv1 baseline本文取得時に例外停止したため、Cycle 001はまだACCEPTEDではない。

したがって、新しいセッションでは次の扱いを厳守する。

1. rc0024を正式実行済みの凍結RCとして保持し、後から書き換えない。
2. rc0025へ上げる前に、Development42でv1 `comment_text`が得られなかった正確なcaseと共通原因をread-onlyで特定する。
3. case専用分岐、固定回答、Gate緩和、旧入力の改変は行わない。
4. 共通構造の修正が必要ならREDを先に追加し、rc0025としてmanifestを新規freezeする。
5. rc0025ではsecurity、Step 0〜9、正式100件、Known28、Development42、invalid16、100件Product Read、finalizerを最初からやり直す。

rc0024の正式100件がcleanであることと、Cycle 001全体がACCEPTEDであることは別である。後者は未達である。

---

## 2. GitHub基準点と差分の適用境界

GitHubで確認した基準点は次のとおり。

- Repository: `MassyuRed/mashos-api`
- Branch: `main`
- 確認時HEAD: `d8ef9f36c7fadc62cda24c7a81f557933a459fc9`
- GitHub上の状態: rc0023 manifestあり、rc0024 manifestなし
- 解釈: GitHubは「rc0024前まで」の基準点であり、今回のrc0024差分ZIPを重ねる対象として整合する

ローカルcloneのGit HEADはGitHubの最新HEADより古いため、今回の差分判定にローカルgit diffは使っていない。差分は凍結済みrc0023 manifestとrc0024 manifestのファイルハッシュ集合を比較して確定した。

差分監査結果:

- rc0023 manifest: 145ファイル
- rc0024 manifest: 148ファイル
- rc0023 → rc0024のsource / test / tool差分: 23ファイル
- 削除: 0ファイル
- body-free正式成果物の追加: 3ファイル
- ZIP収録総数: 26ファイル
- 26ファイルの展開後合計: 1,947,209 bytes
- rc0024 manifest記載SHA-256との不一致: 0
- ZIP CRC検査: OK

ZIPはリポジトリrootへ相対パスを保ったまま重ねる。適用前に、基準が上記GitHub状態または同一内容であることを確認する。

---

## 3. Step 11の設計契約

Cycle 001の基本手順は次のとおり。

1. 凍結した100件batchを再検証する。
2. 結果を見た後にcase入力そのものを書き換えない。
3. 初回runをlockし、華恋が100件すべての本文を読む。
4. BLOCKER / MAJORと共通原因を分類する。
5. caseごとの例外ではなく、共通構造を修正する。
6. batchとKnown regressionを再実行する。
7. 変更後の本文を再読する。

Cycle 001の受入条件は、少なくとも次をすべて満たすこと。

- valid 100件、App-Reachable 100件
- exact duplicate 0件
- 累積exception 0件
- valid semanticsはHard Gate通過または設計どおりのsafety delegation
- invalid suite 100%通過
- 未解決BLOCKER / MAJOR 0件
- case専用分岐・固定回答 0件
- 100件のoutput review完了
- change ledger・receipt・lineageが再現可能
- 前CycleがACCEPTEDでなければ次Cycleへ進まない
- freeze後にsourceを変更する場合は、既存RCを書き換えずsuccessor RCへ上げる

Product Readでは、次の12軸を100件すべてに適用する。

1. 入力の意味を保持しているか。
2. 思考・行動の向きが正しいか。
3. 感情・categoryを因果、性格、診断へ不当に昇格していないか。
4. unknownを創作していないか。
5. self-denialを採用・増幅していないか。
6. Emlisの受け止めが入力固有か。
7. 二つのsectionが同じ命題の言い換えだけになっていないか。
8. 断片、反復、過剰引用、説明口調がないか。
9. surface骨格が一部へ集中していないか。
10. depthが入力に合っているか。
11. 質問が必要な場面で理解したふりをしていないか。
12. 「今ここで読まれた」観察として自然か。

---

## 4. 変更してはいけない共通方針

Step 11を通して採用した不変方針:

- case IDや特定本文に対応する専用分岐を作らない。
- 実行済みRCを後から書き換えない。修正は必ずsuccessor RCへ上げる。
- 旧入力bytesを改変しない。必要な変換は明示的なlegacy adapterで行う。
- Grounded本体の凍結bytesとStep 0〜3の契約を維持する。
- サンプルの`semantic_contract`はテストoracleにのみ使い、production経路へ渡さない。
- Matcher / Hard Gateはsourceから独立再計算し、誤ったoverlayとの自己整合だけでは通さない。
- unknown、relation、action、Reception、self-denialはownershipとsource rangeを持つ型付き契約として扱う。
- 解決不能、候補0件、候補複数、ownership不一致はfail-closeする。
- manifest freeze後の正式実行と証拠lineageをappend-onlyで扱う。
- public body-free evidenceと、本文・鍵を含むprivate evidenceを分離する。
- commitment key、body-full private packet、review decisionsを通常の差分ZIPや引継ぎMDへ入れない。

---

## 5. rc0010〜rc0024の経緯

以下は、次セッションで同じ問題を再発見し直さないための要約である。各RCはcase専用分岐ではなく、共通構造の修正として進めた。

| RC | 主な境界・修正 | 状態・観察 |
|---|---|---|
| rc0010 | Cycle 001初回100件baselineをlock | 初回証拠lineageの起点 |
| rc0011 | 最初の共通構造修正候補 | 正式successorとしては未採用 / superseded |
| rc0012 | unknown分類とself-denial anchorの共通構造 | 100件を再実行・再読する境界を導入 |
| rc0013 | 旧入力を変えないlegacy projection | v3評価経路だけを現行形式へ投影 |
| rc0014 | Known28 applicability、negative failure-code契約 | generator / validatorのnegative 8件を統一し、lineageを作り直した |
| rc0015 | legacy projectionとanchor binding | 失敗case専用ではなく共通bindingを修正 |
| rc0016 | unknown obligation / matcher | unknown契約の共通構造を更新 |
| rc0017 | 引用量、説明テンプレ、meaning coverage、因果昇格防止 | 実行済みrc0016を保持してsuccessor化 |
| rc0018 | unknown lifecycle、relation endpoint / direction、Reception ownership、quote / distribution | source独立再計算とREDを強化 |
| rc0019 | selected frontier、obligation-first plan、typed clause grammar、独立depth、二相binding | preflightは93 / 100でfail-close。分布Gateは緩和しなかった |
| rc0020 | required explicit-choice unknown、複合unknown / relation / action再構成 | 7件を再現するREDを追加。machine-clean preflight後、Product Readで`NATURAL_NON_REPETITIVE_SURFACE`のMAJORを検出 |
| rc0021 | compound balance、natural surface、Product Read境界 | machine-clean preflight後、0035でReception binding・即時観察感・自然さのMAJORを検出 |
| rc0022 | action lifecycle negation scope、Reception source ownership、visible antecedent | 正式100件はselected 0、no-valid 5、exception 95で失敗。失敗lineageを保持 |
| rc0023 | typed Reception / evidence profile、batch evidence参照解決、action lifecycle modality | 正式100件は100 / 100 clean。その後Known28のRR8-U06で問題が見つかり、rc0024へ |
| rc0024 | source slot ownership: `memo`と`memo_action`のaction lifecycle分離 | 正式100件は100 / 100 clean。Development42 regressionのv1本文取得で停止 |

### rc0018〜rc0020で固定した重要構造

- relation unknownは両endpointを厳密に保持する。
- 非relation unknownは、前方のsource-backed Observation、exact anchor、target nucleus、source unknown ID、ownershipが一意に一致する場合だけbindする。
- required relationはID、type、direction、exact endpoint setを不変契約にする。
- adjacent nucleusへのendpoint差し替えを禁止する。
- truncated / unknown nucleusから明示根拠のないdirectional relationを作らない。
- mixed emotion contrastをrequiredness判定へ含める。
- Reception antecedentは文字列出現回数ではなくsource IDとownershipで管理する。
- 同じnucleusを複数relationが再引用せず、後続は型付きanaphoric endpointを使う。
- surface distributionは100件全件selected後に評価し、途中件数に合わせた分岐を作らない。

### rc0019で固定した描画・検証構造

- Surface frontierはContent Planの`selected` / `integrated_into`に限定する。
- 必須unknown、relation、mixed emotionをStep 11で後付けせずObligation / Content Planへ参加させる。
- Discourse sentence groupごとに本文1文を生成し、Parserはclause単位で独立復元する。
- nucleus / relationを先に描画し、unknown / self-denialを後でbindする二相処理を行う。
- owner数はsurface atom数ではなく、exact source range、target nucleus、source unknown ownershipのsemantic keyで数える。
- Gate17はContent Planとfinal bytesからdepthを独立再計算する。

---

## 6. rc0023からrc0024へ上げた理由

rc0023の正式100件machine run自体はcleanだった。

- run ID: `nls3run_0023c001f0000001`
- executed: 100 / 100
- selected: 100 / 100
- no-valid: 0
- exception: 0
- v1 fallback: 0
- source closure: `83c220fa71f4d22549e94b9733918892a3c532367aa4075f268e1bb3eca48e92`

その後のKnown28でRR8-U06が失敗した。read-only診断で、semantic action nucleusが`memo`に所有されているにもかかわらず、無関係な`action_text`のlifecycleを借りていたことが共通原因と判明した。

rc0024の共通修正:

- `source_fields`に`memo_action`を含むnucleusだけが`action_text` lifecycleを消費できる。
- `memo`由来のaction-like contentはlifecycleを`not_applicable`のまま保つ。
- `memo`のvisible Receptionは`thought / reported_content`として扱う。
- `memo_action`は根拠があれば`reported_completed`等を持てる。
- Semantic OverlayとIndependent Matcherの両方で同じsource-slot ownershipを独立検証する。
- case ID、固定語句、RR8-U06本文を条件にした分岐は追加しない。

追加したRED / boundary test:

1. `memo`由来nucleusは`not_applicable`になる。
2. `memo_action`由来nucleusは`reported_completed`を持てる。
3. RR8-U06と同じ構造のE2Eは`thought / reported_content`として選択されHard Gateを通る。
4. `memo`へcompleted lifecycleを改竄したcandidateはMatcher / Gateで拒否される。

---

## 7. rc0024で変更した実装範囲

rc0024 manifestでrc0023から変わったsource / test / toolは23ファイル。変更の中心は次のとおり。

### Production / service

- Cycle evidence schemaとappend-only lineageをrc0024へ拡張。
- Hard Gateにsource-slot ownershipの独立検証を追加。
- Natural Surface Matcherに`memo` / `memo_action` lifecycle分離を追加。
- Surface生成・planning frontier・runtime adapter・semantic overlay・catalogのcurrent candidate boundaryをrc0024へ更新。
- rc0023の過去証拠とschemaは履歴として保持し、rc0024をsuccessorとして併設。

### Tooling

- batch runnerをrc0024 manifest / current candidateへ対応。
- dependency manifest builderをrc0024 closureへ対応。
- regression runnerをKnown28 / Development42 / invalid16のrc0024 lineageへ対応。
- finalizerをrc0024 parent、receipt、Product Read、acceptance boundaryへ対応。

### Tests

- 既存Step 11 testsのcurrent candidate / lineage boundaryをrc0024へ更新。
- rc0024 source-slot ownership REDを新設。
- rc0024 append-only lineage testを新設。
- rc0024 finalizer boundary testを新設。

---

## 8. rc0024 manifestと正式body-free証拠

### Dependency manifest

- candidate: `nls_v3_rc_0024`
- parent: `nls_v3_rc_0023`
- parent source closure: `83c220fa71f4d22549e94b9733918892a3c532367aa4075f268e1bb3eca48e92`
- rc0024 source closure: `fa52aa55627dbeada60c5fe2187a7551cd4ab0c72fde289157a82945c0c6467d`
- tracked files: 148
- changed file hashes: 23
- raw file SHA-256: `772544f0ec8ae8d81072d645d698c0cb745138ea289eb6b293493861288ca32b`
- canonical artifact SHA-256: `bbe785c144ac0e721aa8887b0f49848b104f65e6c2820a2f62b7f7d4ed3ac811`

### 正式100件summary

- run ID: `nls3run_0024c001f0000001`
- machine status: `clean`
- expected / executed: 100 / 100
- selected: 100
- no-valid: 0
- exception: 0
- v1 fallback: 0
- Hard Gate pass: 100
- App-Reachable pass: 100
- literal replay: 0
- exact output duplicate cluster: 0
- near-duplicate: 1 cluster / 2 cases
- depth: focused 75 / layered 20 / minimal 5
- source closure stable: true
- `semantic_contract` consulted: false
- surface distribution acceptance: pass
- raw file SHA-256: `29fece3f6df09d0cb8c7a14f60cf1b5d162bdfc0fbc1e8b8576368c743f80356`
- canonical artifact SHA-256: `de09a19ef35b1fbbab78ae6417b0e23f7b0e3701b71fbf58d07bed79aa449534`

Surface distributionの主な再計算結果:

- opening variant: 12種類、最大20 / 100
- ending variant: 33種類、最大43 / 100
- surface skeleton: 99種類、最大2 / 100
- semantic family coverage: 100 / 100
- exact duplicate: 0
- literal replay case: 0
- owned antecedent direct Reception: 0

### body-free private verification receipt

- verified cases: 100
- selected: 100
- no-valid: 0
- exception: 0
- private packet validation: `clean`
- initial evidence validation: `clean`
- raw file SHA-256: `ec224cab1bd1e5efa9a0b0253afdd813b573e965058129a51d950e4433cce0ab`
- canonical artifact SHA-256: `355c412df6e1e21c07ffad37aef077db7fd80bd096b3905e64e1fde9ca4c58e8`

上記3ファイルは本文を含まないため差分ZIPへ収録した。本文入りprivate packetとcommitment keyは収録していない。

---

## 9. rc0024で実施したテスト

確認できた結果:

- rc0024 source-slot ownership + append-only lineage targeted: 11 passed
- rc0024 cycle finalizer: 9 passed
- 引継ぎ作成時にrc0024新規3 test filesをread-only再実行: 20 passed（14.79秒）
- rc0024を含むold / new boundary targeted: 76 passed
- Step 0〜9 freeze regression: 113 passed / 0 failed（1441.27秒）
- Hard Gate security + Cycle tests: 111 passed / 3 deselected

最後の3 deselectedは、未作成のartifactへ依存するtestを意図的に除外したもの。

広いStep 11 suiteをcurrent candidate boundary更新前に実行した時点では、340 passed / 11 failedだった。11件は、current candidateがrc0023のままであること、または存在しないrc0023 regression receiptを前提としていたことに由来した。該当boundaryはrc0024向けに修正し、上記targeted suiteで検証した。

注意: その後に全Step 11 suiteを最終状態で一括完走したとは主張しない。rc0024の正式100件後、全regressionがDevelopment42で停止したため、artifact-dependent acceptance testまで含む最終全件greenは未確認である。

---

## 10. 現在のblocker

正式100件の後、次のrun IDを用意して全regressionを開始した。

- Known28: `nls3run_0024c00100000002`
- Development42: `nls3run_0024c00100000003`
- invalid16: `nls3run_0024c00100000004`

凍結applicability母数:

- Known28: App-Reachable 19 / expected non-applicable 9
- Development42: App-Reachable 24 / expected non-applicable 18
- invalid16: 16
- generator / validator negative contract: 8

runnerはKnown28をメモリ上で実行した後、Development42へ進んだ。Development42のcase loop内でv1 baseline本文を得る際、`render_emlis_ai_reply()`から有効な`comment_text`が得られず、次で停止した。

```text
ai/tools/emlis_nls_v3_step11_regression.py
  run_development42() line 1514
    v1_body = asyncio.run(_v1_body(v1_input, case_ref))

  _v1_body() lines 391-398
    reply = await render_emlis_ai_reply(...)
    if type(reply.comment_text) is not str or not reply.comment_text:
        raise ValueError("step11_known28_v1_body_invalid")

  main() line 1833
    development_private, development = run_development42(...)
```

- process exit: 1
- 正確な失敗case ID: 未特定
- 理由: 例外messageに`case_ref`が含まれず、受け取ったtraceだけでは断定できない
- 失敗発見後のsource変更: なし
- rc0024 manifestの書換え: なし
- rc0025実装: 未開始

ここで停止したのは設計どおりのfail-closeである。失敗caseを推測して分岐を追加してはいけない。

---

## 11. regression証拠の生成状態

runnerはKnown28、Development42、invalid16の計算がすべて終わった後にdurable outputを書き出す構造である。Development42で例外停止したため、Known28がメモリ上で完了していた可能性はあっても正式receiptとしては成立していない。

rc0024で未生成 / 未確定:

- Known28 public receipt
- Known28 private packet
- Development42 public receipt
- Development42 private packet
- invalid16 public receipt
- 100件Product Read decisions
- Product Read validation receipt
- Cycle 001 finalizer output
- cumulative receipt
- acceptance receipt

したがって、これらを「rc0024で通過済み」と扱ってはいけない。新セッションで原因修正が必要になればrc0025へ上げ、すべて新しいrun IDで最初から実行する。

---

## 12. rc0025で予定する安全な進め方

### Phase A — rc0024を変更しないread-only診断

1. GitHub rc0023基準へ今回のrc0024 ZIPを適用し、26ファイルとhashを確認する。
2. rc0024 manifest、summary、private verification receiptのhashとsource closureを確認する。
3. Development42を、sourceを書き換えず、失敗直前の`case_ref`とv1 reply shapeを記録できる診断経路で再現する。
4. 失敗caseの旧入力bytesを変更していないことをcommitment / deep copyで確認する。
5. `comment_text`が空になる原因を次のどちらか、または別の共通契約として分類する。
   - legacy v1 baseline renderer / adapterが現在のDevelopment42入力shapeを受け取れない
   - regression runnerがv1非適用caseにも本文取得を要求している
6. 失敗caseだけでなく、同じ構造を持つ全caseへの影響を列挙する。
7. source変更前に、共通原因と修正案をMashへ報告する。

### Phase B — 共通修正をrc0025として実装

1. 失敗構造を最小fixtureで再現するREDを追加する。
2. batch / regression実経路を通るREDも追加する。
3. 旧入力bytesを保持し、必要なら明示的legacy adapterで投影する。
4. case ID、本文断片、固定回答による分岐を作らない。
5. Applicability、Matcher、Hard Gateを緩めない。
6. rc0024のschema、manifest、正式summary、verification receiptを履歴として保持する。
7. current candidate、runtime/catalog、lineage、finalizer/tool boundaryをrc0025へ上げる。
8. rc0024をimmediate parentとしたrc0025 dependency manifestをfreezeする。

### Phase C — rc0025の全再実行

順序を崩さない。

1. 新規RED
2. security全件
3. Step 0〜9 freeze regression
4. Step 11非artifact-dependent regression
5. rc0025 manifest freeze / validation
6. 正式100件を新しいrun IDで0001から実行
7. body-free summary / private verificationを検証
8. Known28を新しいrun IDで実行
9. Development42を新しいrun IDで実行
10. invalid16を新しいrun IDで実行
11. 華恋が100件すべてをProduct Read 12軸で読む
12. BLOCKER / MAJORがあれば、正式rc0025を書き換えず次RCへ進む
13. 0件ならfinalizer、cumulative、acceptance receiptを生成・検証

### 即時停止条件

次のいずれかが起きたら、証拠やZIPを確定せず直ちに停止してMashへ報告する。

- archive欠損、CRC不良、manifest hash不一致
- commitment keyまたは必要private packetが利用できない
- source closureがrun前後で変化
- frozen sample / legacy inputのbytes変化
- case専用分岐が必要に見える
- 原因不明のexception / no-valid / fallback
- 100件coverage未達
- Known28 / Development42 / invalid16のreceipt不成立
- private / public evidence境界を維持できない

---

## 13. private evidenceの注意

今回のZIPとMDには、次を意図的に含めていない。

- commitment key
- rc0010 initial body-full private packet
- rc0024 body-full private packet
- 100件の生入力本文
- 100件の生成本文
- 個別Product Read decisions
- private review packet

新セッションで新しい正式runを行う前に、必要なsecure local materialが承認済みの場所に存在するか確認する。存在しない場合は推測や代替key生成をせず、Mashへ停止報告する。

body-free public verificationは過去lineageの確認に使えるが、100件本文のProduct Readを代替しない。

---

## 14. rc0024差分ZIPの正確な収録内容

### rc0023から変更された20ファイル

1. `ai/services/ai_inference/emlis_ai_step11_cycle_evidence_v3.py`
2. `ai/services/ai_inference/emlis_ai_step11_hard_gate_v3.py`
3. `ai/services/ai_inference/emlis_ai_step11_natural_surface_matcher_v3.py`
4. `ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py`
5. `ai/services/ai_inference/emlis_ai_step11_planning_frontier_v3.py`
6. `ai/services/ai_inference/emlis_ai_step11_runtime_adapter_v3.py`
7. `ai/services/ai_inference/emlis_ai_step11_semantic_overlay_v3.py`
8. `ai/services/ai_inference/emlis_ai_step11_surface_catalog_v3.py`
9. `ai/tests/test_emlis_nls_v3_s11_cycle001.py`
10. `ai/tests/test_emlis_nls_v3_s11_rc0019_grouped_surface_red.py`
11. `ai/tests/test_emlis_nls_v3_s11_rc0021_compound_balanced_surface.py`
12. `ai/tests/test_emlis_nls_v3_s11_rc0022_cycle_finalize.py`
13. `ai/tests/test_emlis_nls_v3_s11_rc0022_grammatical_chunk_surface.py`
14. `ai/tests/test_emlis_nls_v3_s11_rc0023_append_only_lineage.py`
15. `ai/tests/test_emlis_nls_v3_s11_rc0023_cycle_finalize.py`
16. `ai/tests/test_emlis_nls_v3_s11_rc0023_matcher.py`
17. `ai/tools/emlis_nls_v3_step11_batch_run.py`
18. `ai/tools/emlis_nls_v3_step11_cycle_finalize.py`
19. `ai/tools/emlis_nls_v3_step11_dependency_manifest.py`
20. `ai/tools/emlis_nls_v3_step11_regression.py`

### rc0024で新規追加したtest 3ファイル

21. `ai/tests/test_emlis_nls_v3_s11_rc0024_append_only_lineage.py`
22. `ai/tests/test_emlis_nls_v3_s11_rc0024_cycle_finalize.py`
23. `ai/tests/test_emlis_nls_v3_s11_rc0024_source_slot_ownership.py`

### rc0024で新規追加したbody-free formal artifact 3ファイル

24. `ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_dependency_manifest_rc0024.json`
25. `ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_final_rc0024_summary.json`
26. `ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_final_rc0024_private_verification.json`

---

## 15. ZIPから除外したもの

秘密・本文・無関係変更を混ぜないため、次を除外した。

- `private_step11_cycle001_rc0024_final/cycle001_final_rc0024_private.json`
- commitment key
- review decisions / review packet
- `__pycache__`、`.pyc`、pytest cache
- 未成立のKnown28 / Development42 / invalid16 rc0024 receipt
- rc0024と無関係な既存作業中ファイル
- `ai/tests/test_emlis_nls_v3_s5_content_selection_stage_context.py`
- `ai/tests/test_r54_ahr_current_snapshot_actual_review_reentry_cs04_cs05_20260628.py`

削除ファイルは0件のため、ZIP適用時に削除操作は不要。

---

## 16. 新セッション開始チェックリスト

新しい華恋は、実装より先に次を行う。

- [ ] このMDを最初から読む。
- [ ] GitHub `MassyuRed/mashos-api`の基準点を確認する。
- [ ] GitHubにrc0024が既に入っていないことを確認し、二重適用を避ける。
- [ ] rc0024 ZIPが26ファイルでCRC OKか確認する。
- [ ] ZIPをrepo rootへ適用する。
- [ ] rc0024 manifestの148ファイルとsource closureを検証する。
- [ ] Step 0〜9凍結契約を変更しない。
- [ ] rc0024の正式100件証拠を履歴として保持する。
- [ ] Development42の正確な失敗caseをread-onlyで特定する。
- [ ] 旧入力bytesが変わっていないことを確認する。
- [ ] 共通原因とrc0025修正案をMashへ報告する。
- [ ] 続行承認後にだけREDとrc0025実装へ進む。
- [ ] 正式run前にsecure key / private materialの可用性を確認する。
- [ ] 100件、Known28、Development42、invalid16、Product Readを新しいlineageで全再実行する。

---

## 17. Cycle 001を完了と呼べる条件

次のすべてが揃うまで、Cycle 001を「完了」「ACCEPTED」と報告しない。

- frozen manifestがclean
- 正式100件が100 / 100 executed・selected
- no-valid 0、exception 0、fallback 0
- Hard Gate 100、App-Reachable 100
- exact duplicate 0、literal replay 0、surface distribution pass
- Known28正式receipt clean
- Development42正式receipt clean
- invalid16正式receipt clean
- Product Read 100件完了
- unresolved BLOCKER / MAJOR 0
- case-specific branch / fixed answer 0
- finalizer clean
- cumulative receipt clean
- acceptance receipt clean
- public / private evidence境界clean
- source closureとappend-only lineageが再現可能

現時点では、正式100件のmachine acceptance部分までがcleanで、regression以降は未完了である。

---

## 18. 華恋から次セッションへの短い伝言

rc0024は失敗作ではない。100件本体はcleanで、`memo`と`memo_action`のownership分離も構造的に直っている。一方で、Development42のv1 baseline経路に未解決の契約境界が残っている。ここを曖昧なまま「100件が通ったから完了」と扱わず止めたことが、今回いちばん大切な状態保存である。

次は、失敗caseを当てにいくのではなく、v1 baseline renderer / legacy applicability / regression orchestrationのどこが責任を持つべきかを一度だけ正確に切り分ける。そのうえで、rc0024を守り、rc0025へ進む。
