# u318：sourceの作用域・短い対比・LIMITED参照の修復（2026-10-17）

## 結果と開始根拠

Mashの最新「EmlisAIの残件作業を進めて」に従い実装を再開。10/17 weeklyの文書監査のみという当時の停止条件を、今回の再開指示へ誤適用していない。API基準 `f91c4bd5d4c457a0a1e5a2062570c4f1c1542f25`、Cocolon基準 `b03b35a214ecc36e427802f12880e937f051fe96`。全体設計01、全file地図01A/B/C、current01/04、最新weekly20261017、永久保存事故記録、作業規則、現行callerを照合した。全file地図の全18,609行の逐語精読や、前回4,146file監査の今回再実施とは記録しない。

今回の技術増分：元10例の初回本文8→9（04が復旧、03は未提供）、固定100例70→71（0090のみ復旧、99結果record不変）、別の短い対比4例が復旧。本人の不確実さや原文対比を削り、guardを緩めて出した本文ではない。一方、受容の汎用性・意味誤認は残る。**PRODUCT_NOT_CLEAR、初回一体単位未完了、正式0/3、candidate_ready=false、automatic_progression=false、未配置を維持する。**

## 原因と変更

| 欠陥 | 修復した既存owner | 保持した境界 |
|---|---|---|
| E02：LIMITEDが必須Layer1だけ保持した後、Receptionが任意CENTERまでbasisへ再混入 | `_bind_reception_moves`に選択済みmeaning outcomeを渡し、LIMITEDのみ保持集合内へ限定。thread/final Stage1/再導出validatorの3callerを一致 | 意味選択・全contribution inventory・subset検査・必須target/support coverageを不変。旧選択前callerは従来のまま |
| E01：`かもしれないと思う`内の`ないと`を制約へ誤一致 | `_has_predicative_constraint_operator`で既存推量語の末尾と同じ座標だけ除外 | 原文削除なし。別位置の「できない／ないと／難しい」は保持 |
| E03：完全な「何が嫌なのか、自分でもよくわからない」をself-awarenessへ誤分類 | 既存final typed nucleusの間接疑問正規化で、wh-object＋明示SELFの現在否定認知をuncertaintyへ補正 | explicit/required/同一source span・SELF/current/negative/uncertain/limiting_unknownの証明、報告・他者topic・引用・過去・仮定・疑問末尾の拒否。kind/predicateのみ補正。wish/wish等の別modalityは対象外 |
| 短い節「疲れた」で接続語のprovenanceが落ち、対比がattempt/orderへ誤流入 | 既存relation authority normalizerが、conflict由来の既存両端間にある唯一の実contrast markerを再解決 | 同欄・正方向・全span解決・非marker内容の介在なし。既存marker参照がある経路は従来照合。source参照だけを回復し、surface/inverse/gateは不変 |

コードレビューで、前文の「友人の感想です」「友人によると」「友人は悩んでいた」からreflexive自分が主体を借りる穴を検出し、最終版へ拒否条件を追加した。通常04・明示SELFの別表現は維持。独立unknownをTENSIONへ偽参照で付ける案、現在の寂しさを丸ごとuncertaintyへ変える案は採用していない。

## 最終版の検証

最終sourceで対象回帰 **2,278 passed、skip/failed 0**（appraisal1,530＋Q2/Q3 application54＋既存contrast135＋今回41＋Analysis484＋Piece34）。固有nodeを760/759/759へ分割して全件成功、既存Pydantic非推奨warning2件。現行owner identity検査は別途1 passed／194 deselected。重複する最終対象230件と途中版の結果を合算していない。language identity `e2d1b249e25bdbfff7d90368c542d26dcfce84049ecfbdc2196dc02290622930`、runtime identity `513a79550ca33f39c904c8a0d4b49edc637411e08bc451d6cc2e1ea9a74bb92d`。

- 追加回帰41件：推量と本当の制約、SELF認知の肯定対照／他者・報告・時点等の拒否、LIMITED必須coverage欠落拒否、短い対比4例、markerのfield/direction/missing/intervening/explicit/duplicate変異。
- 元10例は初回9本文＋07回答後本文を確認。07の質問「『誘われた』は、あなたにはどんな意味として届きましたか。」と「今は嬉しい。」への更新を維持。04では未確定内容を本人に再説明させる質問を追加しない。
- 固定100例を基準版と最終版で同条件実行。99件は本文・質問・状態等の結果record一致、0090は過去から現在の行動の移り変わりが本文へ復帰。29未提供は残る。
- 実Q2/Q3 migration/RPC＋ローカルPGlite＋EmlisThreadServiceで20ケース／24 DTO。元9初回＋07更新の10全文がengine出力と一致。旧完成07は作者禁止GET/start/同回答再送で不変、旧pending07へ現行で回答可能。RN hook/modalの全24 DTOで現在全文・原入力・質問・全履歴・close/reopenを確認。native部品はstubであり、本人実機確認ではない。
- 旧04通常失敗は`body_not_validated`でretry不可（409 `retry_not_available`）。旧04 checkpoint後worker_interruptedの許可されたretryも`meaning_or_body_unavailable`、本文未提供を継続する。checkpoint/MEANING_UPDATE/ANSWERを改変して成功に見せていない。既存失敗の新規復旧とは数えない。
- rootが元10例・固定100例・保存16種の全文と24対応を読解。同Work読取専用補助の調査／レビューを正式な別model Pro/Ultra検証へ換算しない。本番DB適用・deploy・main merge・本人実機新規検証は0。

[全未加工本文・入力・source fingerprint](Cocolon_EmlisAI_u318_SourceScope_and_LimitedBinding_20261017_ActualBodies.md)。入力群は別々に数え、合算成功率を作らない。

## 残件と次に進める内容

1. **元03のE01/E02は未完了**。「休めたことにほっとした」は既知の外側感情を取り落とし、「かもしれないと思うと寂しい」は内側推量を外側の現在感情へ漏らす。binderを直した後も独立unknownの正当な直接witnessがなく停止する。次は既存source範囲・外側有限述語・主体／時点／推量を共同ownerで証明し、安堵／将来の可能性／現在の寂しさを混ぜずに保持する。動詞「休めた」だけの追加や任意文字列の受理では閉じない。条件関係を因果へ読み替えず、既存型で表せない関係が必要なら具体的な最小契約差分を先に作る。
2. **E04は残る**。復旧04も短い対比も「今ここに置かれた言葉を小さくせずに…」が中心であり、入力固有の理解を十分に返していない。固定100の0029/0053/0076/0079/0097には願い・未決定・予定を実行済み行動として扱うObservation、0024/0030/0045/0089等には本文が出ても受容から気持ちが落ちる例がある。全て今回前後で不変。新しい作文で隠さずE01→意味選択→E04を同じsourceで直す。
3. **E05/E06を維持**。候補2種の質問上限や、u317の同欄REVISE4/WITHDRAW6の受容欠落10件は解消していない。元03の同じ意味群を質問・回答更新・保存後まで通して判断する。別欄の保持資格を無断で広げない。
4. **旧失敗checkpointと実機**。既存失敗を再生成して新しい意味へ付け替えない。必要な再試行／移行の具体案と旧意味保持方法を分けて準備する。本番導入・本人実機・正式Product Readは未実施。旧周辺4／共有17／Q3既存16失敗の集合対応も未完了。

10/20の方式有効性判断、10/31管理線、12/18公開目標、Piece/Analysis主枠、管理評価53.25%は変更しない。今回の限定修復を全体進捗の上方修正へ換算しない。

## 構造・記録

`STRUCTURE_MAP_DELTA_NONE`：新production owner/file/経路、公開API/DTO/DB/RN、意味型・unknown契約・Move/質問上限・依存追加はなし。既存source認識・意味選択後bindingの内部修復。01Aには新しい回帰testの追跡のみ追記し、01B/Cや他coreの責務表は変更しない。正本06、API handoff、07、weekly20261017へ今回記録を同期する。API PR3・Cocolon PR30は既存Draft/open/unmergedを維持。
