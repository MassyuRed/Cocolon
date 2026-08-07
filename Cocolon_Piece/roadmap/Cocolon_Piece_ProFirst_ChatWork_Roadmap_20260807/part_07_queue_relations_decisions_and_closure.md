# 9. Work Ultra queue policy

## 9.1 PieceがWorkを使う予定のexact gate

```text
PCE-U1:
  independent cross-repository integration audit

PCE-U2:
  final independent release acceptance
```

## 9.2 PieceでWorkを使わない予定の主作業

```text
PCE-0〜PCE-8
PCE-9A〜PCE-9F
PCE-10 bounded corrections
PCE-11のcode分析・修正
PCE-12 release closure
```

## 9.3 Work再配分条件

PieceがU1/U2へ到達していても、次の順で扱う。

```text
1. EmlisAIにcurrent Work-required next actionがあるか確認。
2. ある場合、EmlisAIを実行する。
3. EmlisAIが外部条件待ち、またはcurrent Work lane完了ならPiece U1/U2を候補にする。
4. Mashの明示承認後にだけPiece Work authorityを開始する。
```

## 9.4 追加課金

本ロードマップは追加クレジット購入を前提にしない。

Work利用可能枠がなければU1/U2をpendingに保持する。

---

# 10. Pro作業が尽きた時の次の扱い

Piece PCE-0〜PCE-8を完了し、PCE-9 implementation authorityがまだ承認されていない、またはPCE-U1待ちになった場合、停止を避けるためだけにPiece周辺資料を増やさない。

次の独立作業候補を使う。

```text
Analysis / わたしマップのactual output inventory
Analysis発売前quality closure roadmap
Analysisのevidence / route / time-change / tier / history設計
```

ただし、AnalysisロードマップはPieceのPCE-2 cross-core handoff boundaryを参照する。

これにより、Emlis / Piece / Analysisのsource roleを三重に別定義することを避ける。

---

# 11. relation to EmlisAI

## 11.1 EmlisAIを止めない

Work利用可能になった時は、EmlisAI current checkpointから再開する。

Piece Pro作業を進めたことを理由に、EmlisAIのWork順序を後ろへずらさない。

## 11.2 PieceがEmlisAIへ要求しないこと

- PieceのためにEmlis visible bodyを変更する
- Piece formatをEmlis ASTへ追加する
- Piece safetyをEmlis safetyへ吸収する
- Piece visibilityをEmlis metaへ持たせる
- Piece quotaをEmlis plan guardへ混ぜる

## 11.3 Pieceが待つ必要のあるもの

PCE-9C exact adapter bindingには、少なくとも次のcurrent ownerが必要である。

- saved input identity
- Emlis observation stage identity
- original / supplemental source separation
- observation result terminal state
- Piece CTA eligibility

これらが未確定でも、PCE-2 abstract contract、PCE-3〜8の設計は進められる。

---

# 12. relation to Analysis

## 12.1 independence

```text
AnalysisはPiece完了に依存しない。
PieceはAnalysis完了に依存しない。
```

両者はsaved inputを起点にし、上位flowで接続する。

## 12.2 forbidden mixing

- Piece textをAnalysis observed factにしない
- Analysis inferenceをPiece sourceへしない
- simulated routeをPieceのoriginal inputとして扱わない
- Analysis updateをPiece save成功条件にしない

## 12.3 shared contract

Piece PCE-2で次を共通化する。

- source input identity
- source roles
- cross-core event ordering
- privacy boundary
- body-free lineage
- no-mixing negative codes

Analysis roadmapはこの共通境界を再利用する。

---

# 13. release blockers

次はPiece release blockerである。

```text
private Pieceが他者へ見える
public Pieceがaccess policy外へ見える
preview / record / export本文が一致しない
raw input / Emlis body / hidden metaが漏れる
existing Q&A recordが読めない
quotaがplan contractと一致しない
public/private toggle後のfeedが不整合
owner deleteが成立しない
re-exportが同一recordを再現できない
画像が重大に崩れる
feature flagで止められない
rollback不能
monitoringなし
```

次はrelease blockerではなく、発売後へ回せる。

```text
4形式目以降
多数のtheme
font customization拡張
追加ratio
branding位置選択
Piece Seed / Tone
advanced export
simulation Piece
```

---

# 14. decision ledger

PCE-1〜PCE-7で最低限次を決める。

| ID | decision | current provisional answer | final owner phase |
|---|---|---|---|
| D001 | Q&Aを残すか | 現役formatとして残す | PCE-1 |
| D002 | version field | 持つ | PCE-1 |
| D003 | existing record migration | 一括しない | PCE-1 / PCE-6 |
| D004 | Nexus rendering | version / format aware | PCE-1 / PCE-6 |
| D005 | old route removal | 発売前に削除しない | PCE-1 |
| D006 | source owner | saved input identity | PCE-2 |
| D007 | Emlis body reuse | 禁止 | PCE-2 / PCE-4 |
| D008 | refined answer | supplemental role | PCE-2 |
| D009 | visibility default | 未決定 | PCE-3 |
| D010 | quota count point | first saved record | PCE-3 |
| D011 | Free format | 未決定 | PCE-4 |
| D012 | initial formats | 2〜3候補 | PCE-4 |
| D013 | visual themes | 2候補 | PCE-5 |
| D014 | export owner | RN-first候補 | PCE-5 / device |
| D015 | storage strategy | existing additive第一候補 | PCE-6 |
| D016 | visibility API | 未決定 | PCE-6 |
| D017 | metrics | body-free events | PCE-7 |
| D018 | Work U1 exact4 | proposed | PCE-8 / Mash approval |
| D019 | final Ultra acceptance | proposed | PCE-8 / Mash approval |

---

# 15. immediate next action

本ロードマップが採用された後の最初のbounded作業単位は次である。

```text
実行環境判定:
  CHAT_5_6_PRO_OK

対象:
  PCE-0 Current Contract Pin

作業:
  current Piece write/read/storage/access/quota/testのactual inventoryを作る。

変更:
  read-only

GitHub write:
  なし

完了:
  PCE-1のidentity / compatibility判断に必要なactual factsが揃う。
```

PCE-0完了後、PCE-1でMashと華恋がPiece identityの5点を正式決定する。

---

# 16. closure statement

```text
PIECE_ROADMAP_CREATED
PRO_FIRST_RUNWAY_DEFINED
WORK_ULTRA_TEMPORARILY_RESERVED_FOR_EMLIS_AI
PIECE_ULTRA_USE_NOT_PERMANENTLY_FORBIDDEN
PIECE_ULTRA_GATE_DEFERRED_TO_INDEPENDENT_AUDIT_AND_FINAL_ACCEPTANCE
CURRENT_QNA_ASSETS_PRESERVED
ADDITIVE_REDESIGN_REQUIRED
IMPLEMENTATION_NOT_STARTED
GITHUB_NOT_REFLECTED
AUTOMATIC_PROGRESSION_FALSE
NEXT_PIECE_ACTION_PCE0_CHAT_5_6_PRO_OK
```
