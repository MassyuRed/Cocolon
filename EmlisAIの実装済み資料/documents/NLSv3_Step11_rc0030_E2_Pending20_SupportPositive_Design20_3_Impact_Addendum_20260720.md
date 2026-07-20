# NLS v3 Step 11 rc0030 — E2 Pending20 / Support-positive 設計20.3影響範囲補遺

作成日: 2026-07-20 JST  
対象: `Step 11 / Cycle 001 / rc0030 / E2 evidence closure`  
文書状態: `IMPACT_SCOPE_PROPOSAL / AUTHORITY_NOT_YET_GRANTED`

## 0. 結論

delimiter-safe Parser修復により0063 full chainとE2 integration 12はGREENになった。
次はmanifest successorではなく、pending 20 attackのexact実行台帳とsupport-positive rc0030
full chainを閉じるread-only REDである。

本補遺はまだ実装authorityではない。Mashが今回のexact 2をGitHubへ反映したcommitを
predecessorとして固定し、本補遺を明示承認するまでtest変更を開始してはならない。

## 1. 確認した事実

1. retained rc0029 mandatory attackはfresh runで33 / 33 GREENになった。
2. pending 20 IDはfrozen fixtureに存在するが、exact IDごとのexecutor / result ledgerがない。
3. 現E2 testには複数の重複guardがあるが、20 / 20 closureを証明しない。
4. representative 8はsupport-positive 0件である。
5. frozen unit authority
   `ai/tests/fixtures/grounded_human_reception_exact8_v2_20260712.json`には
   support-positive case `D` / `I6-D02`がある。
6. そのauthorityをrc0030 Parser / Matcher / Gate full chainへ接続した証拠はない。
7. rc0030 exact 18はrun全体のclosed maximum allowlistであり、新pathは追加できない。

## 2. proposed Phase A authority

### 2.1 predecessor

今回のdelimiter-safe Parser exact 2をGitHub mainへ反映したcommit SHAをformal predecessorにする。
local bytesだけをpredecessorにしない。

### 2.2 write exact 1

`ai/tests/test_emlis_nls_v3_s11_rc0030_e2_integration.py`

許可するのはRED / evidence codeだけである。

- frozen pending 20 IDをexact順序で読み、各IDにexact 1 executorとclosed resultを対応させる
- overlapping guardだけで実行済み扱いにせず、attack material、consumer、期待closed codeを固定する
- existing frozen support-positive fixtureをread-onlyで読み、rc0030 generic pathへの接続可否を判定する
- support omissionをsupport-positive body / witnessに対して実行する
- body-free attack ledger materialを作り、raw body / owner / support textを含めない

### 2.3 read-only authority

- `ai/tests/fixtures/emlis_nls_v3/cycle_001/rc0030_representative8_body_free.json`
- `ai/tests/fixtures/grounded_human_reception_exact8_v2_20260712.json`
- `ai/tests/fixtures/emlis_nls_v3/generated/batch_001.jsonl`
- rc0030 current production owner / catalog / runtime / Gate / manifest
- retained rc0029 attack executor

### 2.4 変更禁止

- representative8 fixture、support-positive frozen fixture、P1 fixture / test
- Parser / Matcher / Surface / catalog / lexical / Gate / runtime
- resource上限、exact18 allowlist、manifest phase
- Step 9、E1b、rc0027〜rc0029、shared/public route
- case ID / review / corpus / failure-family production branch
- skip / xfail / mock-only GREEN

## 3. Phase A acceptance

1. pending 20 IDとexecutor resultがexact 20 / 20で一致する。
2. 各攻撃がreal consumerでfail-closeし、期待closed codeを持つ。
3. support-positive caseがrc0030 Parser / Matcher / Gateまでbody-onlyで到達する。
4. support omissionがsupport-positive materialに対してfail-closeする。
5. support text、owner text、body bytesをreceiptへ出さない。
6. representative 8、control 7、retained 33が非回帰である。
7. new path 0、production変更0、fixture変更0である。

## 4. STOP条件

次のいずれかが必要ならPhase A REDで停止し、実装前に別の影響範囲を提示する。

1. support-positive sourceをrc0030へ接続するproduction owner変更
2. fixture変更またはnew fixture / tool / runtime / manifest path
3. exact18外new path
4. Parser / Matcher / Surface / catalog / lexical / Gate / runtime変更
5. resource拡張
6. case / corpus固有production branch
7. secure materialまたはMash側入力

## 5. Phase A後の順序

1. Phase A全GREENなら、body-free exact20 ledgerをfreezeする。
2. production ownerが必要なら、別補遺承認後に最小ownerだけを修復する。
3. pending20 / support-positive closure後だけE2 manifest successorへ進む。
4. manifest successor GREEN後だけE3代表8件へ進む。
5. E3 Product Read通過後だけE4 frozen 100へ進む。

## 6. 華恋の意見

今回のParser修復とpending20 closureは責任が異なる。前者はdelimiter ambiguityの共通文法、
後者は攻撃denominatorとsupport-positive証拠の完結である。同じcommitで混ぜず、今回の
exact 2をpredecessorとしてfreezeしてからread-only REDへ進む方が、失敗原因とauthorityを
追跡できる。

## 7. 次の承認文

> rc0030 E2 delimiter-safe Parser GREEN / evidence-closure STOPを承認する。Mashがexact 2を反映したGitHub commitをpredecessorとして、設計20.3 Pending20 / Support-positive補遺のPhase A read-only REDを開始する。write exact 1はE2 integration testだけとし、frozen fixture、Parser / Matcher / Surface / catalog / lexical / Gate / runtime、resource、exact18、manifest、Step 9、E1b、rc0027〜rc0029、shared/publicを不変にする。pending 20 exact ledgerまたはsupport-positive full chainにproduction owner変更が必要なら、実装前に停止して影響範囲を提示する。
