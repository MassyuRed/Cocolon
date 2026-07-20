# NLS v3 Step 11 rc0030 — E2 Phase-manifest Successor Handoff

作成日: 2026-07-20 JST  
対象: `Step 11 / Cycle 001 / rc0030 / E2 integrated synchronization`  
formal predecessor: `45b178cfc0e7d94ab8385682ab3c7bbf0ab9aa25`  
状態: `E2_PHASE_MANIFEST_SUCCESSOR_GREEN / STOP_BEFORE_E3_GITHUB_PREDECESSOR`

## 0. 結論

承認済み設計20.3 E2 Phase-manifest補遺のexact 4内で、P5 historical manifestから
E2 integrated synchronization manifestへのphase successorを完了した。

- E2 phase schema: `v3`
- exact18 closed maximum: `18`
- active / hash-bound / reserved: `15 / 14 / 3`
- newly active: index 10 E2 integration testだけ
- source file count: `223`
- current E2 dependency closure: `5 / 5 PASS`
- manifest deterministic rebuild / tool check: `PASS`
- semantic production logic change: `0`
- new repository path: `0`
- E3 / E4: `NOT STARTED`
- Cycle 001: `NOT ACCEPTED`

E2機能acceptanceとE2 current dependency closureはGREENである。ただし、設計Step 11 Cycle 001の
完了条件はbatch 001 `ACCEPTED`であり、E3代表8件、E4 frozen 100、その後の別authorityによる
正式100件・Known28・Development42・invalid16・全100件Product Read・evidence finalizationが
未完了である。したがって、Cycle 001完了とは扱わない。

## 1. 確認した事実

### 1.1 GitHub predecessor

| role | commitment |
|---|---|
| repository | `MassyuRed/mashos-api` |
| E2 exact3 predecessor | `45b178cfc0e7d94ab8385682ab3c7bbf0ab9aa25` |
| predecessor parent | `a18ceaf9f2d858c59244a12aaca3d798acc36cdd` |
| predecessor commit date | `2026-07-20T13:46:57+09:00` |
| historical rc0030 baseline | `e1e2ec5c17fa165f9972373304899802832ecd5b` |

GitHub compareで、`45b178...`はparent `a18ceaf...`に対しPhase B exact 3だけを変更していた。

1. Natural Surface Matcher: `648a3a6690f8df860053c811a5416fcfc9983524e5ff880a0e6921a122a52e30`
2. Hard Gate: `88514bb2a179e8d726f36e1666d2618330d95979107403ededc93aa35655943b`
3. E2 integration test: `789008643a4d7ba388a26f35fbf2276eea5f1c3702f94ea6089377ce372d5eaa`

### 1.2 historical predecessorの分離

P5 artifact originと今回のE2 predecessorは別commitmentとして固定した。

| role | commitment |
|---|---|
| P5 manifest artifact origin | `924bd458255f226db54c17d84dd4aafc5db2b1e2` |
| P5 phase predecessor | `3897331a5f605762e09f9953e47801d45d3c5da2` |
| P5 schema / phase | `v2 / P5_CARDINALITY_REGRESSION` |
| P5 manifest file SHA-256 | `4ceb33aa6bb6f15d6ad9b7212bbdcee901edb352707f3f19a90e91ff6d91f62c` |
| P5 artifact SHA-256 | `265418796ec720112ea046014b7dd3c612d392382647a64db5fe7396b4a976b7` |
| P5 source closure | `7c905f06c88ed4a19f8ece102cafbb1333dcce1b3e840081952682703ec038e5` |
| P5 file-list artifact | `75663d3799c8da7e196d4a30fcc29b1358ab4fc3a56b2461f7eb3b9ec2ecbf70` |
| P5 source count | `222` |

P5 historical evidenceを`45b178...`へ書き換えず、outer E2 predecessorだけを`45b178...`へ進めた。

### 1.3 exact 4変更

#### Manifest service — MODIFY

`ai/services/ai_inference/emlis_ai_rc0030_surface_planning_experiment_dependency_manifest_v3.py`

- 根拠: P5 phaseのmanifestではE2 index 10とPhase B exact 3 current hashを閉じられない。
- 必要性: P5をimmutable predecessorとして保持しつつ、E2のactive setとcurrent owner lineageを
  deterministicに固定するため。
- 実装: schema `v3`、phase `E2_INTEGRATED_SYNCHRONIZATION`、outer predecessor
  `45b178...`、P4 / P5 / E2 owner hash lineage、E2 test predecessor hash pin、active / reserved
  partitionをfail-closeで検証する。
- SHA-256: `589b528fd90b4554ba0e14d722ea38b45bd927d4b62c7f6d5b9865c29405e79d`

#### Manifest tool — MODIFY

`ai/tools/emlis_nls_v3_rc0030_surface_planning_dependency_manifest.py`

- 根拠: phase-qualified builder / checkerの表示責任をcurrent E2 successorへ同期する必要がある。
- 必要性: 同一builderによるcanonical生成と`--check`をP5名のまま誤認しないため。
- semantic generation logicの変更はなく、E2 serviceを唯一のbuilder authorityとして利用する。
- SHA-256: `b8174c4ade010bc45eba7f2bea3aaf4a524a725520f78f16aa7a1ff560af21ce`

#### Generated manifest — MODIFY

`ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_dependency_manifest_rc0030_surface_planning_experiment.json`

- 根拠: E2 current source closureをbody-free artifactとして固定する必要がある。
- 必要性: exact18、activation、owner lineage、import closure、unexpected path 0を次phaseへ渡すため。
- file SHA-256: `754e79dc0f871b9b6c650b174f067f16cef35a9f141bf91205d42c308b1041f7`
- artifact SHA-256: `fe468b51e3b9f37558f30b010aad205500759806dfb939f859b0b9699466e097`
- source closure: `a49e9bc2b8ce1443c955c9fd010fd07454e2e8a17c70a845db180e97b7023832`

generated manifest自身は自身の`file_hashes`から除外し、file / artifact hashはこの外側receiptでbindする。

#### Dependency closure test — MODIFY

`ai/tests/test_emlis_nls_v3_s11_rc0030_dependency_closure.py`

- 根拠: P5 testではE2 activation、P5/E2 provenance分離、current owner bindingを証明できない。
- 必要性: predecessor混同、owner hash偽造、activation改変、index 10 driftを再発可能なnegativeで拒否するため。
- SHA-256: `0722415f895f84acfcbaeb750d315d8d5a240d66bc23b3fb95581f03b30d2136`

### 1.4 activation / closure

| item | E2 result |
|---|---:|
| exact maximum allowlist | 18 |
| active paths | 15 |
| hash-bound active paths | 14 |
| newly active | 1 — index 10 |
| reserved-and-required-absent | 3 — index 5, 16, 17 |
| source files | 223 |
| static / dynamic project import edges | 61 / 18 |
| unexpected / unbound / reverse / reserved-present | 0 / 0 / 0 / 0 |

reserved pathは次の3件で、実ファイルも存在しない。

1. index 5 bounded experiment tool
2. index 16 E3 representative 8 test
3. index 17 E4 frozen 100 read-only test

### 1.5 acceptance verification

```text
E2 dependency closure              5 passed in 18.65s
manifest tool --check              PASS
E2 integration                    13 passed in 444.07s
control + runtime                 16 passed in 246.88s
retained rc0029 mandatory attack  33 passed, 12 deselected in 362.52s
git diff --check                   PASS
authorized tracked delta           exact 4 only
```

toolが返したcurrent source closureは
`a49e9bc2b8ce1443c955c9fd010fd07454e2e8a17c70a845db180e97b7023832`である。

### 1.6 historical closure診断

rc0028 downstream、rc0028 successor、rc0029、current rc0030 E2 closureを同時にread-only実行した。

```text
14 passed / 7 historical failures in 31.20s
current rc0030 E2: 5 / 5 PASS
```

7件は旧rc0028 / rc0029 manifestが固定するshared ownerの過去full-file hashと、承認済み後続
rc0030 suffix bytesとの差を検出したhistorical lockである。今回のexact 4に起因する新規failureは0。
旧manifestをcurrent bytesへ書き換えて見かけ上GREENにしていない。

## 2. 推測

P5 artifact、P5 phase predecessor、E2 exact3 predecessorを別commitmentへ分けたことで、今後E3で
manifestを進めても「過去phaseの証拠」と「現在phaseのsource closure」を混同せずに済むと考える。

旧rc0028 / rc0029 stage-lockはcurrent E2の意味回帰を示すものではなく、後続appendを過去hashへ
逆適用しないための境界証拠と考える。これらのformal evidence再編は、既定どおりE4後の別authority
で行うべきであり、E2 exact 4で旧証拠を上書きすべきではない。

## 3. 華恋の意見

今回のE2 phase successorは保持すべきである。特にindex 10をGitHub exact3 SHAへ明示pinしたため、
manifest生成時にE2 testが無断変更されてもcurrent値として取り込まずfail-closeできる。

次はCycle 002でもE4でもない。まずMashがexact 4をGitHubへ反映し、そのcommit SHAをE3 phase
predecessorとして固定する必要がある。その確認後、既承認のmonotonic activation順にE3 index 5 / 16
だけを追加し、代表8件machineを通過した場合だけ華恋が全8件をProduct Readするのが正確である。

## 4. Mash側に必要な作業

1. ZIPの`mashos-api/`以下exact 4だけをrepositoryの同じ相対pathへ反映する。
2. commit・pushする。
3. commit SHAを華恋へ伝える。
4. `documents/`は証拠用でありrepositoryへ反映しない。

そのcommitを確認するまではE3を開始しない。E3のproposed exact scopeと承認文は同梱の
`NLSv3_Step11_rc0030_E3_Activation_Proposal_20260720.md`に記載した。
