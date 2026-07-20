# NLS v3 Step 11 rc0028 — downstream E0b〜E3 STOP handoff

## 1. 結論

`E0b`と`E2`はGREEN、`E3 machine`は代表8件すべてselectedまで到達した。

ただし、設計18.4に基づく独立Product Read 2系統は、同じ8件を`PASS 1 / MINOR 1 / MAJOR 6 / BLOCKER 0`と判定した。旧MAJOR 5件の改善、control非悪化、新規MAJOR/BLOCKER 0の全条件を満たさないため、D0補遺のSTOP条件に従って`E4`は開始していない。

この時点で`Cycle 001 ACCEPTED`、formal candidate、正式100件完了のいずれも主張しない。

## 2. 確認した事実

### 2.1 predecessor / scope

- Mash指定baseline: `31d3cf183589b27481338277574f90500f3c5b11`
- GitHub上で適用済みだったE1b successor commit: `1453389dbfb693216c3b45605a4a3366506c397e`
- 既存MODIFY owner: D0で許可されたexact 4のみ
- 4 ownerの変更: append-only
- NEW path: D0 exact allowlist内のみ
- Step 9全20 owner: byte-immutable
- rc0027 shared runtime / public route: unchanged / disconnected
- formal / production接続: なし

### 2.2 E0b / E2

- D1 rc0027 frozen baseline: `selected 56 / no_valid_candidate 2 / fail_close 42`
- E0b predecessor RED: `53 failed / 4 passed`
- E0b GREEN: `57 passed`
- E0b + E2 + rc0027 default behavior regression: `72 passed / 1 warning`
- downstream closure / E4 prerequisite contract: `9 passed / 1 warning`
- rc0027 runtime adapter SHA-256: `012d09ab82ff526a9d854c845a7930eb8836e1dbd41c67428644c2c3a02bfbc7`
- rc0027 surface catalog SHA-256: `63cfd9b1677062dcfe10368b2b75aeaeba4a990f6ec1993c0b3fa9ae04a210db`

E1b frozen predecessorはclean commit `1453389dbfb693216c3b45605a4a3366506c397e`で`35 passed / 1 warning`を再確認した。

downstream worktreeから同じfrozen rebuildを直接行うと、exact 4 parent ownerがappend-only変更済みであるため、`34 passed / 1 RC0028_PARENT_SOURCE_DRIFT`となる。これは隠していない。変更後の正しいauthorityは、frozen E1b manifestをparentにし、exact 4 ownerとD0 NEW pathを別ledgerで拘束するdownstream manifestである。そのvalidator / rebuild testはGREENである。

### 2.3 final downstream closure

- source file count: `192`
- parent file count: `177`
- downstream NEW file count: `15`（generated manifest self-hashを除く）
- modified owner count: `4`
- authorized dynamic successor edge: `4`
- unbound / forbidden reverse import: `0`
- source dependency closure: `08a83e30954055facdb711e1253a81145101e565afde4327567f239169f2d942`
- generated manifest SHA-256: `ffe0ff52e7d875e430d0878dced96c7b8994b05e6366ed9b4ff70055e8f2e8d0`

### 2.4 E3 machine

- representative: controls `0001 / 0002 / 0009`
- representative: former MAJOR `0019 / 0035 / 0043 / 0063 / 0100`
- disposition: `selected 8 / no_valid_candidate 0 / fail_close 0`
- body-free receipt SHA-256: `1a473850fc0e13bcb9288713cbe547635a065ec63f28aab0ff407ba9c7565de4`
- private output directory: `0700`
- private artifacts: `0600`
- body-full private artifact / Product Read本文note: repo・ZIPから除外

### 2.5 E3 Product Read

独立した2 reviewerが、入力とselected本文をlocal read-onlyで確認した。両者のseverityは8件すべて一致した。

| case | role | baseline | current | result |
|---|---|---:|---:|---|
| `0001` | control | PASS | MINOR | worse |
| `0002` | control | PASS | PASS | not worse |
| `0009` | control | MINOR | MAJOR | worse |
| `0019` | improvement target | MAJOR | MAJOR | not improved |
| `0035` | improvement target | MAJOR | MAJOR | not improved |
| `0043` | improvement target | MAJOR | MAJOR | not improved |
| `0063` | improvement target | MAJOR | MAJOR | not improved |
| `0100` | improvement target | MAJOR | MAJOR | not improved |

Gate結果:

- machine 8 / 8 selected: PASS
- former MAJOR 5件を全てPASS/MINORへ: FAIL (`0 / 5`)
- controls非悪化: FAIL (`1 / 3`)
- 新規MAJOR/BLOCKER 0: FAIL（`0009`に新規MAJOR）
- E4 entry: STOP

body-free case別reason codeは同梱の`NLSv3_Step11_rc0028_E3_ProductRead_STOP_Receipt_20260719.json`に固定した。

## 3. 推測

1. upstream successorの構造情報量そのものは、machine上ではforward / Parser / Independent Matcher / Hard Gateへlosslessに渡せている。
2. Product Read failureの主因は情報欠落だけではなく、machine bindingを証明するためのconstruction detailとowner ordinalが公開本文へそのまま見え、読み手には内部schemaの説明として現れる点にある。
3. 現在の方式のまま語彙だけを言い換えても、構造数が多い入力では説明行が増え、depth overshootとreception under-bindingが残る可能性が高い。
4. したがって、次の修復はcase語句やcase IDのpatchではなく、body-only recoverabilityを維持したまま、referentと構造を自然な観測へ圧縮する共通表現設計が必要である。

これらはProduct Readと実装構造からの推測であり、新しいformal authorityではない。

## 4. 華恋の意見

E4へ進めない判断が正しい。

machine 8 / 8だけを理由にE4を開始すると、設計18.4の「読まれた形」とD0のProduct Read gateを実質的に無効化する。特に、controlの悪化と旧MAJOR 5件が1件も改善していない点は、局所的な語感ではなくSurface表現方式の問題である。

次は、実装を増やす前に、`schema exposition / opaque ordinal referent / depth compaction / reception binding`の4点を対象にした設計20.3影響範囲補遺を作るのがよい。exact 4 additive owner、existing experiment catalog / runtime、Step 9・E1b・rc0027 default不変を維持し、追加ownerが必要と判明した時点で実装せずSTOPする。

推奨する次の指示は次のとおり。

> 「rc0028 E3 Product Read STOPを承認する。E4を開始せず、Step 9、E1b successor、rc0027 defaultを不変にして、schema exposition / opaque ordinal referent / depth compaction / reception bindingを対象とする設計20.3影響範囲補遺を作成する。case / family固有branchを禁止し、body-only recoverabilityとIndependent Matcherを維持した共通Surface修復の可否を判定する。既存D0 authority外のownerが必要なら、実装前に停止して影響範囲を提示する。」

## 5. 変更の根拠と必要性

| owner / artifact | 根拠 | 必要性 |
|---|---|---|
| lexicalization additive API | E1b successor facet / relation / unknownをclosed lexical specへ変換する | downstreamがupstream typed authorityをraw再解析せず消費するため |
| Surface additive API / catalog | rc0027 catalogにはsuccessor construction codeがない | experiment-only forward本文を決定論的に生成するため |
| Body-only Parser / Independent Matcher | forward metadataによる自己認証を禁止する | final bytesから構造とowner bindingを独立再構築するため |
| additive Hard Gate | endpoint、direction、overlap、unknownの偽造を拒否する | machine selectedをsource authorityへ拘束するため |
| disconnected runtime | E0b〜E4をpublic routeへ接続せず評価する | rc0027 defaultとproduction behaviorを守るため |
| downstream dependency manifest | frozen E1b parentとdownstream exact changesを分離する | expected parent driftを隠さず、変更closureを再現可能にするため |
| representative / bounded tool | E3 machineとProduct Readの境界を固定する | body-full private materialをrepo / ZIPへ出さず評価するため |

## 6. E4 / formal / Cycle 001 state

- E4 frozen 100 machine: `NOT_STARTED`
- E4 changed/new selected Product Read: `NOT_STARTED`
- formal candidate authority: `NOT_STARTED`
- security / Step 0〜9 / Known28 / Development42 / invalid16 rerun: `NOT_STARTED`
- Cycle 001: `NOT ACCEPTED`

Mash側のsecure material作業、GitHub secret、formal run ID発行は現時点では不要である。

## 7. package boundary

同梱:

- exact 4 modified source
- D0 allowlist内のNEW service / tool / fixture / test
- generated downstream manifest
- D0 impact addendum
- D1 freeze ledger
- body-free E3 Product Read STOP receipt
- 本handoff

除外:

- `__pycache__` / `.pyc`
- private E3 body-full artifact
- private Product Read note
- raw input / outputの複製
- formal / security artifact

本packageは、GitHubへexperiment-only checkpointとして反映できる。ただし、`Cycle 001 complete`、`E4 viable`、`formal accepted`のどれとしても扱わない。
