# NLS v3 Step 11 rc0028 — E1b successor A0〜A6 handoff

- 作成日: 2026-07-19
- baseline commit: `31d3cf183589b27481338277574f90500f3c5b11`
- baseline tree: `c826c3ed5587356f313a90a5b67611e3972abd42`
- checkpoint: `E1B_SUCCESSOR_A0_A6_GREEN_RUNTIME_DISCONNECTED`
- E1b: `GREEN`
- D0 downstream impact scope: `DEFINED / EXPLICIT ACCEPTANCE REQUIRED`
- E0b / E2 / formal candidate: `NOT_AUTHORIZED / NOT_STARTED`
- Cycle 001: `NOT_ACCEPTED`

## 結論

rc0028 E1b successorは、既存Step 9 frozen ownerとv1 checkpointを変更せず、experiment-onlyかつruntime非接続の範囲でA0〜A6を完了した。E1bの5攻撃軸はGREENとなり、frozen 100の情報十分性もfailure 0で閉じた。

これはE0b、E2、Product Read、formal candidateまたはCycle 001 ACCEPTEDを意味しない。次へ進むには、E0b downstream REDの別authorityが必要である。

## 1. 確認した事実

### 1.1 A0〜A6の実行結果

補遺§10の番号をそのまま用いる。

| Step | 結果 | 実施内容 |
|---|---|---|
| A0 | completed | baseline、frozen owner、E1b predecessor、rc0027 source predecessor、exact change ledgerを固定 |
| A1 | completed | successor schema、resource bound、origin、mutation、privacy、dependency、runtime-disconnectをtestで固定 |
| A2 | completed | experiment-only relation / nested-construction authority successorをGREEN化 |
| A3 | completed | lexical witness successorへendpoint、link、explicit unknown、facet-presence-onlyをlossless projection |
| A4 | completed | unchanged base snapshotとsuccessor commitmentをruntime非接続で結合 |
| A5 | completed | E1bだけをsuccessor authorityへ限定retargetし、5件をすべてGREEN化 |
| A6 | completed | independent manifest、reverse import、whole100、body-free、mutation、privacy、performanceを監査 |

### 1.2 統合test

- `84 passed / 0 failed`
- 実行時間: `25.21 s`
- warning: `1`。既存環境由来のnon-blocking warningであり、test failureではない。
- Step 9 dependency validation: `PASS / issue 0`

### 1.3 frozen 100 read-only情報十分性監査

| 対象 | required | accounted | failure |
|---|---:|---:|---:|
| cross-span relation | 68 | 68 | 0 |
| source-explicit unknown | 27 | 27 | 0 |
| semantic unit | 10 | 10 | 0 |
| semantic link | 5 | 5 | 0 |
| overlap owner | 1 | 1 | 0 |

- total failure: `0`
- shareable projection body leak: `0`
- 実行時間: `18.431 s`

### 1.4 experiment dependency closure

- source closure SHA-256: `404d0338dd02e573aee0029be68ca72b1fb544d62bf0e34d655b73ce78227e1e`
- exact file count: `177`
- exact added / changed path count: `16`
- one-way local import edge count: `74`
- production / runtime reverse import count: `0`
- generated manifest file SHA-256: `ceb524a3d665f4b210005433a0040012fa050acd4f8c6e01bb151b94f94240b3`
- generated manifest artifact SHA-256: `e6a9b369afcc982f3413333bf91b3278cf64299462d25c037da19dc0013cd312`
- generated manifest自身は`file_hashes`から除外し、self-hash循環を作っていない。

### 1.5 byte不変checkpoint

- v1 lexical witness: `1523690453647bee2a6e61fb91d7b14823baee4e383c006bc2814006a4beb94b`
- v1 experiment snapshot: `4671aa22c4e432f907780f0becf900fead57044c53ea3bbc1bf501eb5abc1a27`
- 両者ともbaseline hashから不変。
- Step 9 owner、Step 10 owner、shared Step 11 ownerは今回変更していない。
- Surface、Parser、Independent Matcher、Hard Gate、runtime adapter、public API、DB、RN productionは今回変更していない。

### 1.6 exact 13 deliverables

| change | repo-relative path | live SHA-256 |
|---|---|---|
| NEW | `ai/services/ai_inference/emlis_ai_grounded_relation_construction_authority_successor_v3.py` | `e89c2fb8018fcfebc759603102f92abb1ee6d0465ceb4af08501c433f137ee70` |
| NEW | `ai/services/ai_inference/emlis_ai_grounded_lexical_role_witness_successor_v3.py` | `e8a1e59967405ba5d33b1b9afcba0ea841eeadfd1c992145fceccfea9b60bdb4` |
| NEW | `ai/services/ai_inference/emlis_ai_grounded_lexical_role_experiment_snapshot_successor_v3.py` | `c20b3b476a13639d0571d90ad04bc59c67124df01017287878aa2c646679e518` |
| NEW | `ai/services/ai_inference/emlis_ai_rc0028_experiment_dependency_manifest_v3.py` | `284dcf838851fc8a9596a2e8e86702e97f901f9c2c2872d218334db987b1e093` |
| NEW | `ai/tools/emlis_nls_v3_rc0028_experiment_dependency_manifest.py` | `0130e0276ee261d3a2ef9129761a2a65332ea1f4be459ae8bd467fd0ce0eac9d` |
| MODIFY | `ai/tests/test_emlis_nls_v3_s11_rc0028_e1b_information_sufficiency_red.py` | `b60d4fae601f1e133d8c5abd9b981f6823eee93aad0fbb74b37cccee563b00fa` |
| NEW | `ai/tests/test_emlis_nls_v3_s11_rc0028_successor_authority.py` | `71560fc5e7cb722ee3d9f8779ce2ff13a9d979cc7af2f85ab67b009169b33315` |
| NEW | `ai/tests/test_emlis_nls_v3_s11_rc0028_successor_lexical_role.py` | `47ab5bb593cd807dfede06144636f84558f7cfe15f3459f4432871b8f81f3e2e` |
| NEW | `ai/tests/test_emlis_nls_v3_s11_rc0028_successor_snapshot.py` | `b2a18ca43a638b5c973d9b0adc579868e617e84aeea1ab6180879f559f518d4d` |
| NEW | `ai/tests/test_emlis_nls_v3_s11_rc0028_successor_dependency_closure.py` | `a11628e24d55a0a0e538f97221af4ff7411ddf3cd2eccd7ed0b474c849f74412` |
| NEW | `ai/tests/test_emlis_nls_v3_s11_rc0028_successor_runtime_disconnect.py` | `28d0133fe06eb2ee58e97e5a993081c7de9b4df0462a7cf488ad4c039c197072` |
| NEW | `ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_dependency_manifest_rc0027.json` | `ab87802b6a9019fccedd5bad3bd31e97dcc77f471a35a1136a8c717c308df69b` |
| NEW | `ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_dependency_manifest_rc0028_experiment.json` | `ceb524a3d665f4b210005433a0040012fa050acd4f8c6e01bb151b94f94240b3` |

### 1.7 変更の根拠と必要性

| 変更 | 根拠 | 必要性 |
|---|---|---|
| relation / construction authority successor | frozen Planだけではcross-span coexistence、overlap construction、exact endpointを同時に閉じられなかった | Step 9 ownerを書き換えず、source authorityをlosslessかつfail-closeで保持するため |
| lexical witness successor | v1はoverlapを未解決として止める正しいhistorical contractを持つ | v1を破壊せずendpoint、direction、explicit unknown、coverage否定を表現するため |
| experiment snapshot successor | active `GroundedSourceSnapshot`変更はE2 / runtime authorityに踏み込む | unchanged baseとsuccessor commitmentをruntime非接続で検証するため |
| independent dependency manifest / tool | shared Step 11やStep 9 / Step 10 manifest更新は今回のauthority外 | experiment closureだけをexact allowlist、one-way import、reverse-import 0で閉じるため |
| E1b限定retarget | baseline E1bは不足authorityを意図どおり検出した | 5攻撃軸を保持したまま、参照先だけを承認済みsuccessorへ移すため |

### 1.8 別問題として残る既知Step 10 drift

次の2件は今回より前から存在し、今回のclosureでは修復も正当化もしていない。

- `STEP10_DEPENDENCY_SOURCE_BYTES_DRIFT`
- `STEP10_SOURCE_CLOSURE_DRIFT`

formalへ進む前に、別のversioned Step 10 reconciliation authorityが必要である。

## 2. 推測

1. E1bの情報不足は、既存Surface文言ではなく、frozen upstreamとlexical constructionの間のtyped authority不足だった可能性が高い。今回、SurfaceやGateを変えずE1bとwhole100がGREENになった事実がこの見立てを支持する。
2. successorはruntime非接続なので、downstreamで同じ情報が正しく消費されるかは未判定である。E0b REDを置くと、E2で必要な最小同期範囲を切り分けられる。
3. Step 10 driftは今回のsuccessor closureと独立して扱う方が、GREENの原因とformal lineageを混同しない。

## 3. 華恋の意見

今はE1b GREENで止めるのが正しい。A0〜A6は完了したが、これはupstream情報十分性のcheckpointであり、商品出力やCycle acceptanceの証明ではない。

次はE0b downstream REDを別authorityで開始し、Surface / Parser / Independent Matcher / Hard Gateのどこで情報が失われるかを、production sourceを変更せず観測するべき。E0bのRED結果を見ずE2へ進むと、必要以上のownerを変更する危険がある。

## 4. authority境界と次の正確な指示

現時点のstatus:

- E1b: `GREEN`
- E0b: `NOT_AUTHORIZED / NOT_STARTED`
- E2: `NOT_AUTHORIZED / NOT_STARTED`
- formal candidate: `NOT_AUTHORIZED / NOT_STARTED`
- Cycle 001: `NOT_ACCEPTED`

同梱の`NLSv3_Step11_rc0028_Downstream_E0b_E4_Impact_Addendum_20260719.md`は、exact 4 additive owner、new experiment runtime / manifest / tool / fixture / test、E0b〜E4のgateを`IMPACT_SCOPE_DEFINED`として閉じた。実装へ進むための次の正確な実行指示は次になる。

> 「D0 downstream影響範囲補遺を承認する。GitHub commit `31d3cf183589b27481338277574f90500f3c5b11`とE1b successor final receiptをpredecessorとして、exact 4 additive owner、new experiment runtime / manifest / tool / fixture / testだけでE0b REDを開始する。E0b GREEN後だけE2、E2 GREEN後だけE3、E3 Product Read通過後だけE4へ進む。Step 9全20 owner、rc0027 default behavior、shared runtime / public routeを不変にし、既存authority外が必要なら停止して影響範囲を提示する。」

この境界ではMash側のsecure material追加作業は不要。security key、private corpus、formal run materialが必要になるのは、後段のformal rerunを別authorityで開始する時点である。

## 5. privacy

Final Receiptと本handoffはbody-freeである。shareable成果物にはcase単位のsource content、exact range record、private corpus、security keyを含めていない。
