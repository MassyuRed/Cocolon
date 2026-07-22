# NLS v3 Step 11 Cycle 001 Canonical Prerequisite / Initial Process Nonconformance Recovery Route Decision Read-Only Handoff

作成日: 2026-07-23 JST  
承認authority: `NLS_V3_STEP11_CYCLE001_CANONICAL_PREREQUISITE_AND_INITIAL_PROCESS_NONCONFORMANCE_RECOVERY_ROUTE_DECISION_READ_ONLY`  
開始点: Cocolon `c5d5fdc76f9e18e1c09d296a72b29260ead903a8` / mashos-api `c9739a0e2de5632d08607636656ada2f712c62b9`  
本文境界: `BODY-FREE / SHAREABLE`  
状態: `R5 SELECTED / PARENT-DESIGN ADDENDUM REQUIRED / AUTHORITY STOP`

## 1. 確認済み

- predecessor auditはG1 `NOT_PROVED`、G2 `FAILED`で確定している。
- historical rc0010のformal lock、initial full read、first correction順序は現在から補えない。
- batch001 provenanceはvalidだが、同じbatchを未実行のnew initialへ再ラベルできない。
- current rc0031/B6をcanonical corrective laneとして継続するentry条件は成立していない。
- Detailed Design §22.5のmethod STOP条件が成立した証拠はない。
- Detailed Designと現planは、このspecific process nonconformanceのrecovery epoch semanticsを定めていない。

## 2. 採用route

`R5_FRESH_CANONICAL_RECOVERY_EPOCH_BY_PARENT_DESIGN_ADDENDUM`を採用した。

- 現行attempt、batch001、RC、Product Read、change lineageはnonconforming development historyとして保持する。
- 現行attemptへcanonical initial sequenceのacceptance creditを付けない。
- 別identityのfresh exact100と、pre-run Step 0–10 receipt chainを必要とする。
- `formal initial lock -> same exact100 case-level 12-axis full read -> first correction`をfuture-onlyでappend-only証明する。
- その定義をaccepted parent-design addendumで固定するまで、何も実行しない。

## 3. 不採用route

- historical receipt / review backfill。
- current rc0031/B6のcanonical継続。
- current batch001/current RCのnew initial読み替え。
- current planのままのsilent batch replacement。
- 根拠のないNLS v3 method STOP。

## 4. 未決定事項

次の内容は本authorityで設計していない。

- recovery epochの正式identityとstate transition。
- fresh batchの正式ID/schema/denominatorとold batchのregression扱い。
- Step 0–10 current receiptの再取得・再実行境界。
- run/review/sequence ledger schema。
- gateごとの実行authority、STOP、handoff。

これらは次のparent-design addendum authorityでのみ設計する。

## 5. 華恋の意見

失敗した履歴を消さず、新しい100件に正しい順序で向き直るrouteが最も誠実である。現行実装を捨てる判断でも、現行実装を無条件に正当化する判断でもない。再利用できるものは将来のreceiptで証明し、証明できないものは継承しない。

## 6. repository boundary

- mashos-api変更: exact0
- source/test/fixture/sample/manifest変更: exact0
- test/exact100/Product Read/private body生成: 0
- Detailed Design変更: 0
- B6、formal closure、Cycle acceptance: 未承認
- Cycle 001: `NOT_ACCEPTED`

## 7. 次authority候補

```text
NLS_V3_STEP11_CYCLE001_PROCESS_NONCONFORMANCE_CANONICAL_RECOVERY_EPOCH_PARENT_DESIGN_ADDENDUM_READ_ONLY
```

この候補はrecovery epochのparent-design addendum作成だけを扱う。batch作成、test、run、review、correction、B6へ自動進行しない。

STOP. Separate approval required.
