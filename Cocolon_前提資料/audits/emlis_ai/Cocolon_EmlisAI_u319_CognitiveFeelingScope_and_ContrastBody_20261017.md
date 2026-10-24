# u319：予測と外側感情の作用域、原文対比本文、旧checkpointの修復（2026-10-17）

## 結果と範囲

Mashの継続指示に従い、最新weekly20261017とu318を起点に残件を実装した。開始時API `9d62ab217a95e414c0ada8e410b3871d38ab1d26`、Cocolon `e9c3d62829cd3707cd5e7da711786801ee25bde6`、PR3/PR30はDraft/open/unmerged。全体設計01・全file地図01A/B/C・current01/04・永久保存事故記録・CURRENT_RULES・rule18・既存callerを照合した。18,609行の地図全行や4,146file監査の再実施とは記録しない。

**元10例の初回本文は9→10。原03が安堵と現在の寂しさを保持して生成・保存・再表示へ到達した。固定100例は71本文/29未提供のまま、全100結果recordが基準版と一致。** 本文提供は商品合格ではない。原03の受容は長い原文再掲と汎用述語が残り、E04は未完。PRODUCT_NOT_CLEAR・初回一体単位未完了・正式0/3・candidate_ready=false・automatic_progression=false・未配置を維持する。

## 修復した責務

| 既存owner | 変更と保持した境界 |
|---|---|
| grounded observation plan | 格項＋完了述語と任意の一つの連用節から、経験を対象とする過去の外側感情を証明。原文全体を一つの感情対象として保持し、実行action/因果edgeを新設しない。既存nominal familyの証明は維持 |
| 同sourceの認知・感情範囲 | 既存有限認知の後ろの「と＋現在感情」を合成。内側可能性/cognition/接続/外側感情を原文座標で保持し、内側否定や推量を外側modalityへ漏らさない。未知を削るのでなく、そもそも別の意味だったhostを正す |
| 同relation authority | 完全な両感情の証明があるwish/constraint誤ラベルも、既存conflict→contrast復元経路で唯一の同欄実markerへ照合。近接・source順序だけで対比を作らない |
| grounded sentence surface | 異なるsource時点のこの両感情は既存の中立な「左の一方で右とあります」へ。「同時」を付け足さない。既存Reception作者・Move/aggregateは変更しない |
| grounded observation gate | 両端全文・時制・内側可能性/否定/条件・実contrast・選択済み両primary/LEFT/RIGHT/qualifierを独立に読み、既存両端保持appraisalの完全な文法を受理。本文縮約・左右逆転・因果化・同時性追加等は拒否。作者再演を証明に使わない |
| emlis_question / emlis_answer_update | private legacy scope flagで旧source解釈を完全再導出し、既存checkpoint照合を通す。旧IDを新意味へ差し替えない。過去のlegacy source modeにも伝播 |

新しい意味型・qualification・unknown契約・問い上限・公開API/DTO/DB/RN・依存の変更はない。独立した「何が不安なのか、私にもまだわからない」を足したLIMITEDは、そのrequired unknownを保持したまま本文が出る。条件を因果と解釈しない。

他者topic/報告・引用・過去/否定/不確実な外側感情、仮定/願望/見せかけ/譲歩条件の経験は新しい証明の対象外。最終reviewで`友人によれば`等の報告元とfocus主題7例の誤認を見つけ、新wrapperに限定して閉じた。旧current cognition parserの資格を一括変更していない。

## 検証と途中の失敗

共有回帰 **2,372 passed・failed/skip 0**（appraisal1,530、Q2/Q3 application54、既存contrast135、今回source/body/legacy135、Analysis484、Piece34）。固有nodeを791/791/790へ分割し、全process exit0。Pydanticの既存非推奨warning2件。これは0062/0066修正後、最終の報告元/focus拒否とThread resolver入口防御を加える前の版で実行した。

その最終差分は、新wrapperだけの追加拒否8例、既存nominal保持2例を含む **最終対象145 passed・failed/skip 0** で確認。作者に依存しない44本文変異も同集合に含む。現行owner identity検査は最終版で別途 **1 passed / 194 deselected**。2,372と145は重複するため合計成功数にしない。途中版の検査を最終全source再実行と記載しない。

途中版では、追加の先行主体条件が既存nominal familyまで掛かり、固定0062/0066の安堵が受容から落ちた。本文比較で発見し、既存証明には従来の条件を維持、新しい一般化語形にだけ追加条件を適用した。最終比較は全100結果record一致。2例の意味・受容保持を追加回帰へ残した。途中版の71件という件数を成功証拠に使わない。

最終版の元10例＋07回答後全文、自然な別表現6例、実Q2/Q3 migration/RPC＋PGlite＋EmlisThreadServiceの20ケース/24 DTOを確認。保存済み完成07は作者禁止GET/start/同回答再送で不変、旧pending07への回答も維持。RN hook/modalで24実DTOの現在全文・原入力・質問・全履歴・close/reopen・retry可否表示を確認。native部品はstub、実機・実ネットワークAPIではない。RN retryボタン押下の新規検証とは数えない。

旧03通常失敗は`body_not_validated`でretry不可（409 `retry_not_available`）。旧03 checkpoint後のworker_interruptedだけは許可されたretryを実行し、旧checkpoint全payload・意味イベント・operationを保持、新attemptで旧意味のまま`body_not_validated`の未提供となった。新規03成功と旧失敗復旧を混ぜない。frozen 9d62 checkpointとnuclei/relations SHA-256一致、foreign ID拒否を検査した。

rootは元10＋07更新、今回自然表現6の実保存本文を読解し、固定100は前回全読済みの基準と全record一致を確認、途中変更0062/0066は前後全文を読んで修正した。同Workの読取補助レビューを正式別model Pro/Ultra評価へ換算しない。本人実機・本番DB適用・deploy・mergeは今回0。

[未加工本文・入力・検証fingerprint](Cocolon_EmlisAI_u319_CognitiveFeelingScope_and_ContrastBody_20261017_ActualBodies.md)

## 残件と次の一体単位

1. **E04**：原03は意味対象を回復したが、受容は二節の再掲＋「違いをどちらの側も残したまま、感じています」。原01/04/09等の汎用受容も未解消。既存の両感情・source時点・可能性を維持したまま、入力固有の受け取りを本文へ返す。未知の内面や目的を足して自然に見せない。
2. **E01/E03の別残差**：原09の過去/現在の変化、原10の他者報告と本人感情、固定0029/0053/0076/0079/0097の願い・未決定・予定を実行行動にする誤認などは不変。今回の限定文型修復を全日本語理解へ一般化しない。
3. **E05/E06**：問う/終える判断、質問候補2種の範囲、u317同欄REVISE4/WITHDRAW6の受容欠落は未解消。原03のENDと07の一回答更新だけで訂正・撤回・質問能力完成とはしない。同sourceから意味→本文→適切な問い/更新→保存までを一体で扱う。
4. **旧失敗・広い回帰・本人確認**：旧保存の新意味への移行は未実施。旧周辺4/共有17/Q3既存16失敗の集合対応、本人端末の任意入力→保存再表示、正式Product Readは残る。

10/20方式判断、10/31管理線、12/18公開目標、Piece/Analysis主枠、管理評価53.25%は変更しない。

## 構造・記録

`STRUCTURE_MAP_DELTA_NONE`：既存owner内の認識・表面・独立検査・歴史的再導出の修復で、新production file/owner/経路・公開契約はない。01Aへ既存test責務を追記し、current01/04の最新参照と正本06/API handoff/07/weeklyを同期する。01B/Cの無関係な責務は変更しない。既存Draft PR3/30へ保存する。
