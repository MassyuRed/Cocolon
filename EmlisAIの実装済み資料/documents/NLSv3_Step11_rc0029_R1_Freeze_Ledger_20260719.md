# NLS v3 Step 11 rc0029 R1 Freeze Ledger

作成日: 2026-07-19 JST  
対象: `Step 11 / Cycle 001 / rc0029 common Surface repair`  
状態: `R1 RED FROZEN / R2 AUTHORIZED`

## 1. 固定した事実

- GitHub predecessor: `e069ffd782e4d2b960b2c1e770d9018ab78a8b1d`
- immutable predecessor: `rc0028 E3 Product Read STOP`
- clean predecessorでrc0028 downstream dependency closure: `3 / 3 PASS`
- 既存回帰のうちdependency closure以外: `76 PASS`
- R1 test SHA-256: `560ceced908ddf77090440258a2222013c843773d288b3fc66e07d7a7c7848bd`
- R1 denominator: `4 failure family / 13 retained attack`
- R1実行: `1 denominator PASS / 5 intended RED`
- collection error、skip、xfail: `0`
- R1確定前のproduction source変更: `0`

## 2. RED failure family

1. schema exposition
2. opaque ordinal referent
3. depth compaction failure
4. reception binding failure

schema expositionは、machine taxonomy markerとrecord-per-visible-lineを別々に固定したため、closed RED codeは合計5件である。

## 3. 不変境界

- Step 9全20 owner、E1b successor、rc0027 default、rc0028 experiment behaviorを変更しない。
- exact 4 existing ownerは、既存bytesをprefixとして保持したappend-only rc0029 APIだけを許可する。
- rc0029はexperiment-only / runtime-disconnectedとし、shared runtimeまたはpublic routeへ接続しない。
- candidate `<= 12`、replan `<= 1`、visible source anchor `<= 1`、既存depthを拡張しない。
- body-only ParserとIndependent Matcherを維持し、candidate metadataまたはforward owner IDによる自己認証を許可しない。

## 4. 次のgate

R2〜R4で共通Surface、Body-only Parser / Matcher、Hard Gate、disconnected runtimeを追加する。R1のfailure意味、denominator、fixture、baseline severityは変更せず、同じtestをGREENにする。

このledgerはE3、E4、formal candidate、Cycle 001 acceptanceを主張しない。
