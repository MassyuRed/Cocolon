# NLS v3 Step 11 rc0030 — E3 Machine GREEN / Product Read STOP Handoff

作成日: 2026-07-20 JST  
現在地: `Step 11 / Cycle 001 / rc0030 / E3`  
phase predecessor: `38ca7fa779065998a363ce9bb581338d98b8f79d`  
結論: `MACHINE GREEN / PRODUCT READ STOP / E4 NOT AUTHORIZED`

## 1. 確認した事実

### GitHub / authority

- GitHub mainのcommit `38ca7fa779065998a363ce9bb581338d98b8f79d`は、直前のE2 Phase-manifest exact 4だけを含むため、E3 predecessorとして固定した。
- E3 repository deltaはapproved exact 6だけである。
- production semantic logic、shared Matcher、Step 9全20 owner、rc0027 default、rc0028 / rc0029 behavior、catalog、runtime、selector、resource boundはbyte不変である。
- E4 index 17はreserved-and-required-absentのままで、作成も実行もしていない。

### exact 6

| state | index | repository path | SHA-256 | 根拠と必要性 |
|---|---:|---|---|---|
| MODIFY | 1 | `ai/services/ai_inference/emlis_ai_rc0030_surface_planning_experiment_dependency_manifest_v3.py` | `4f473c9ccea9088c4372afacd903b1fa0130983acbacdf526bba57488883f5ff` | E3 phase、outer/nested predecessor、active/hash/reserved閉包を検証するため |
| MODIFY | 4 | `ai/tools/emlis_nls_v3_rc0030_surface_planning_dependency_manifest.py` | `5b7440780761106d6972bbfd7f9a62f79b9608f84ca1b01ba04bd20cce73665f` | schema v4のmanifest再生成とcheckを可能にするため |
| NEW | 5 | `ai/tools/emlis_nls_v3_rc0030_surface_planning_bounded_experiment.py` | `e0ca3d39aa43c1fbe1dce493177583200b488241fa1a91ab5954b97a1c6863e5` | 代表8件を外部private領域で実行し、body-free machine receiptだけを共有可能にするため |
| MODIFY | 6 | `ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_dependency_manifest_rc0030_surface_planning_experiment.json` | `06327f7e0e6d63923bbdf836aa5d25744a83eeb8f8a704aa23c89a3ca057857b` | final exact 6のsource/hash/provenanceを固定するため |
| NEW | 16 | `ai/tests/test_emlis_nls_v3_s11_rc0030_e3_representative8.py` | `30b2b3043c566631d1329e4d516c9d932a103a70f61609f3237e6a45a9538c2e` | machine 8/8、privacy、resource、mutation fail-closeをE3 gate化するため |
| MODIFY | 18 | `ai/tests/test_emlis_nls_v3_s11_rc0030_dependency_closure.py` | `926b0e4bd0ebf5604fc08761d8660d8c62efd3d8a7ee255b84d739ad654b8582` | E3 phase closureとE2 immutable evidenceを同期検証するため |

### manifest / privacy

- schema / phase: `v4 / E3_MACHINE_AND_PRODUCT_READ`
- source count: `225`
- active / hash-bound / reserved: `17 / 16 / 1`
- source closure: `be45dc1c8a34a231c0726fe1570c24e873f55e93b338e614b912112f1c201fbb`
- manifest artifact: `4b59a83b26830504247cd2078611b3aee19a7699e04927633bb4bf549b9ca8f6`
- file-list artifact: `08bb90db3a20b5ecf1f79b4dbad3dcd46e13a151a4e68c263f38467ab020f80c`
- private artifact SHA-256: `137a541486d42b907c77727cb50f05d305e9d3666a19f1914f0f717eac8a9033`
- body-free machine receipt SHA-256: `56fad0a7f96f2af46e94a8b3fe1ca7e6f7500a9605bf8cc7aed8b4a95fd86f7c`
- private directoryは`0700`、private / receipt filesは`0600`。private本文はZIPへ含めていない。

### machine / regression

| suite | result |
|---|---:|
| E3 representative8 | `13 / 13 PASS` |
| E2 integration | `13 / 13 PASS` |
| control non-regression | `3 / 3 PASS` |
| runtime disconnect | `13 / 13 PASS` |
| rc0029 retained mandatory attack | `33 / 33 PASS` |
| current dependency closure | `5 / 5 PASS` |
| active required total | `80 / 80 PASS` |

machine dispositionは`selected / no_valid_candidate / fail_close = 8 / 0 / 0`。Parser、Independent Matcher、Hard Gate、resource accounting、body-free receipt、disconnected runtimeは全件GREENだった。

初回回帰ではindex 5のfunction-local static importが既存eager-import gateに検出された。approved index 5内でliteral lazy importへ修正し、manifestとmachine証拠を再生成した後、上記全suiteを再実行してGREENを確認した。shared/public runtime接続は追加していない。

### Product Read

Product Readは2 reviewerが独立に行い、caseごとのseverityは全件一致した。private本文はreceiptへ転記していない。

| case | role | severity | closed summary |
|---|---|---:|---|
| `0001` | control | MINOR | generic Reception / 局所的な不自然さ |
| `0002` | control | PASS | acceptanceを満たす |
| `0009` | control | MAJOR | main meaning、relation、readability、schema exposition |
| `0019` | former MAJOR | MAJOR | main meaning、relation、Reception binding、schema exposition |
| `0035` | former MAJOR | MAJOR | relation misread、depth / distribution、Reception binding |
| `0043` | former MAJOR | MAJOR | concrete sequence obscured、relation、Reception binding |
| `0063` | former MAJOR | MAJOR | main meaning、unknown partial、depth / distribution |
| `0100` | former MAJOR | MAJOR | required meaning partial、depth / distribution、Reception binding |

aggregateは`PASS 1 / MINOR 1 / MAJOR 6 / BLOCKER 0`。former MAJORのPASS/MINOR化は`0 / 5`、control非悪化は`1 / 3`、new MAJORは1件である。self-denialの非事実化は保持したが、relation、unknown、required meaningの非回帰条件は満たさなかった。

## 2. 既知diagnosticの扱い

追加のhistorical P2-only testは`STEP11_RC0030_P2_RUNTIME_ADAPTER_EARLY`で失敗する。これはP2時点で後続runtime adapterが存在しないことを要求するphase lockであり、対象testとruntime adapterはpredecessor `38ca7fa...`からbyte差分0である。E3 active acceptanceへ混ぜず、historical stage lockとして記録する。今回のexact 6による新規回帰ではない。

## 3. 推測

- E3 failureはmachine coverage不足ではなく、生成本文で抽象schemaが主意味より強く出ること、relation説明の向きと可読性、chunk配分、Receptionの入力固有bindingが連動したSurface品質問題である可能性が高い。
- case / family固有branchでは代表外に同型failureを移すだけになる可能性が高い。
- 必要ownerはまだ確定していないため、次のcode変更前にread-only owner mappingを行う必要がある。

## 4. 華恋の意見

exact 6とmachine GREEN証拠は保持する。ただしrc0030は`E3 Product Read STOP`として凍結し、E4もCycle 002も開始しない。Cycle 001はまだ`NOT ACCEPTED`である。

Mash側では、このZIPの`mashos-api/`以下exact 6だけを反映してcommit / pushし、そのSHAを知らせてほしい。そのcommitをE3 STOP evidence predecessorとして固定した後、同梱の次境界提案に従い、rc0031の設計20.3影響範囲補遺を先に作るのが正確である。

