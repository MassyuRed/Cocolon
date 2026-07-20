# NLS v3 Step 11 Cycle 001 — rc0027 Tier 1 checkpoint

## 1. 結論

Cycle 001は、まだ`ACCEPTED`ではない。

rc0027 Tier 1では、入力固有性を偽って通さないための共通Surface修復と、独立Matcher / Hard Gateの同期まで実装した。代表8件はmachine上すべてselectedになったが、Product Readでは未解決MAJORが残った。さらに、最新sourceでfrozen 100件をread-only実行すると、厳密なspecificity契約により44件がselectedへ到達しなかった。

したがって、Gateを弱めたり汎用語句を増やしたりしてCycle 001を完了扱いにはしない。次は、現在のStep 11境界より上流へ、入力固有のreferent / lexical roleをbody-safeな型付き情報として追加するかどうかのauthority判断が必要である。

## 2. 基準点

- GitHub基準HEAD: `fa34bcf9ba8fb63c97c4ef1f909633fce40dd007`
- current candidate: `nls_v3_rc_0027`
- surface catalog SHA-256: `1beec18839ed77abd1e52b0a06eb60c5867223fd54183c251a8f0efbc37ccc08`
- catalog validation: clean
- grounded lexical profiles: 42
- visible source anchor: 一候補1件以下を維持
- design file: 未変更

## 3. rc0027 Tier 1で行った共通修復

### 3.1 Grounded lexicalization owner

新しいowner `emlis_ai_step11_grounded_lexicalization_v3.py`を追加し、次を型付き契約にした。

- source nucleusから短いsemantic-feature phraseを構成する。
- phrase profile、visible feature fingerprint、owner nucleus / obligationを分離して保持する。
- action lifecycleを`reported_completed` / `reported_ongoing` / `intended`としてsourceから投影する。
- anchor bindingを`reported_profile` / `action_lifecycle` / `relation_shift`の3 familyに分離する。
- feature phraseの衝突は、追加visible axisで一意化できなければfail-closeする。

必要性は、metadata上のowner一致だけで本文の入力固有性まで通る欠陥を止めるためである。

### 3.2 Source anchor境界

従来の長いrunから助詞・接続断片を境界として短いsubstringを切り出す経路を除去した。visible anchorとして認めるのは、長さ上限内のtrusted fragment全体、または句読点で完結したrun全体だけである。

必要性は、文字数だけを満たした不完全断片が「入力固有の意味」として扱われることを防ぐためである。

### 3.3 Specificity fail-close

required ownerがkind-only generic profileのままで、唯一のanchor ownerにもなれない場合は候補生成をfail-closeする。relation / unknown owner、未捕捉の高signal semantic code、action lifecycleを候補全体のanchor owner優先度へ反映した。

必要性は、`状態`、`出来事`、`考え`、`行動`のようなgeneric headだけでrequired meaningを満たしたことにしないという設計11.2を守るためである。

## 4. 検証結果

### 4.1 Tier 1 focused contract

- pytest: `80 passed`
- warning: 既存Pydantic APIのdeprecation 1件
- production owner py_compile: clean
- git diff check: clean
- 42 profile bare roundtrip: clean
- collision 4軸full-product injectivity: clean
- singleton-to-multi owner mutation: fail-close
- long unpunctuated internal subrange: forward / inverse / Gateすべて拒否
- punctuation-delimited complete run: 受理
- representative 8 machine selection: `8 / 8`

この80件はTier 1の新しい構造契約が自己矛盾していないことを示す。Cycle全体の受入を示すものではない。

### 4.2 Representative Product Read

本文と入力を独立に再読した集計は次のとおり。

- PASS: 2
- MINOR: 1
- MAJOR: 5
- BLOCKER: 0

未解決MAJORの共通像は、複数のreferent、変化の順序、thoughtとactionの具体的関係が、genericな状態・出来事・望みへ圧縮されることである。個別caseの完成文を固定する問題ではない。

設計18.5により、MAJORが1件でもbatch acceptance不可である。

### 4.3 Frozen 100 read-only run

formal evidenceやprivate packetを生成せず、最新sourceの到達性だけを100件で確認した。

- selected: 56
- v3 no-valid-candidate: 2
- fail-closed pipeline exception: 42
- selected出力のexact duplicate: 0
- selected 56件のsole anchor: 56 / 56
- selected anchor family: `reported_profile 42` / `action_lifecycle 14`
- selected anchor authority: punctuation-complete-run 39 / trusted-entire-fragment 17
- wall time: 401.3秒
- latency: p50 3.07秒 / p95 15.69秒 / max 21.45秒

fail-closeの内訳:

- required generic specificity unresolved: 26
- input-specific anchor unresolved: 10
- grounded phrase ambiguous: 3
- multi-edge relation local anaphora ambiguous: 3

Gate到達候補85件のうち81件はpass、4件はhard-failだった。主因はGateではなく、required meaningを入力固有に表せない候補生成境界である。

### 4.4 Broader historical regression

Tier 1 focused contractとは別に、historical security / rc0019 / rc0021 / rc0022 / rc0025 / rc0026の選択suiteを実行した。

- passed: 103
- failed: 45
- errors: 19

legacy reference surface、旧AST schema、旧完成形を固定したtestと、新specificity fail-closeでfixture setup自体が停止するtestが混在する。少なくとも現時点で、rc0027をformal candidateまたはacceptance candidateとしてfreezeできる状態ではない。

read-only triageで確認できた範囲では、旧契約期待7件、新specificity fail-close 2件、独立したsecurity defect 0件だった。全体概算は旧契約期待15〜25 failures、新fail-close 20〜30 failuresと大半または全部の19 errorsである。ただしsecurity suite全体がgreenではない以上、security regressionがないことの証明にはなっていない。

## 5. 確認した事実・推測・華恋の意見

### 確認した事実

1. machine PASSとProduct Read PASSは一致しない。
2. 代表8件はmachine上8 / 8 selectedだが、Product ReadにMAJORが5件残る。
3. 全100件では44件がselectedへ到達しない。
4. selected subsetはsole anchor、一意性、duplicate 0を満たす。
5. 現在の`GroundedSourceSnapshot`はkind、operator、temporal scope、relation、unknown、lifecycle等を持つが、複数の入力固有referentを短いSurface phraseへ再構成するための十分なlexical roleを持たない。
6. 設計11.2はgeneric referentだけのrequired coverageを禁じ、設計18.5は未解決MAJOR時のacceptanceを禁じる。
7. 設計20.3は`emlis_ai_grounded_observation_plan.py`等を初期v3で変更しない方針としつつ、必要と判明した場合は影響範囲を別提示し、Surfaceだけの変更として黙って進めないことを要求する。

### 推測

現在の1 anchor制約と既存snapshot属性だけで全100件を通そうとすると、次のどちらかになる可能性が高い。

- generic phraseで意味を潰しながらmachine coverageを通す。
- 入力固有性を守ってfail-closeする。

Tier 1は後者を選んだ。その結果、隠れていたupstream information sufficiency不足が可視化されたと考える。

### 華恋の意見

推奨は、設計11.2の一候補1anchorを維持したまま、上流snapshotへcase-independentなstructured lexical role / referent facetを追加することである。これはGate弱化でもphrase bank追加でもなく、Surfaceが必要な意味を受け取れるようowner境界を正す修復である。

まず小さい代表構造でこの方式を試し、Product Readが改善しない場合は、設計25.1に従ってmodel-free方式そのものを再判断するべきである。

## 6. Mashのauthorityが必要な次作業

### A. 推奨: upstream lexical role拡張

許可が必要な内容:

- Step 4の`GroundedSourceSnapshot`境界、必要ならそのsourceである`GroundedSemanticNucleus`へ、body-safeなtyped lexical role / referent facetを追加する。
- forward rendererとIndependent Matcherは別実装で同じsource authorityを再計算する。
- Step 0〜9 freeze regressionを全件再実行し、既存契約を壊した場合は採用しない。
- rc0027を書き換えず、successor RCとして実装する。

設計書本文11.2の改訂は不要である。ただし、設計20.3の例外境界を発動するため、変更owner、非変更範囲、rollback条件を記録した設計補遺／authority receiptは必要になる。

### B. 非推奨: anchor上限を増やす

複数の独立referentごとに短いanchorを許可する案である。実装は比較的近いが、設計11.2の改訂が必要で、引用列化・入力再掲・自然さ低下の危険が高い。

### C. model-free方式を再判断する

Aのbounded experimentでも商品自然さへ届かない場合の次境界である。現時点では、Aを一度も試さず直ちにCへ進むより、Aの情報十分性を小さく検証する価値がある。

## 7. 現在の停止境界

- Cycle 001: NOT ACCEPTED
- rc0027: Tier 1 checkpoint。formal freeze前
- secure key / private material: 現段階では不要
- Mashに必要な作業: A / B / Cのauthority判断
- 推奨する次の指示: `Aを承認。設計20.3の影響範囲補遺を作り、successor RCでupstream lexical roleのbounded experimentを開始する`
