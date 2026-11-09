# AR-04 — 既存の役割読取をPieceの完成文へ回収

2026-11-09 JST。補助経路活用の詳細設計§7.1／§9に従い、AR-01の全一般品質完成を待たず、独立して進められるAR-04へ着手した。**自己理解で保存した、明示本人による「頼んだ／頼まれた」の過去記録を、原文の意味を保ったPiece本文へ接続した。** API作業source [e8b7e46c](https://github.com/MassyuRed/mashos-api/commit/e8b7e46c70269a40317fe2ec6ee8362c4086e619)。配置・実機・画像生成の完了ではない。

## 実不足と改修

元source c6555fd5では、本人・相手・対象が書かれた完成文でも、自己理解モードのcomplete-account資格がなくexpression_meaning_not_admittedになっていた。通常の感情選択で既に生成できる場合とは区別する。

既存CMEEのnatural_reply_meaningにある有限節・活用・格・人物読取を、Pieceのpiece_source._finite_self_request_accountへ回収した。Piece固有の疑問・条件・伝聞・不確実修飾ガードも通し、piece_v1cの保存原入力complete-account判定へ接続する。新しい作者や本文文型は作らず、既存KEEP_COMPLETE_SOURCE_CONTEXT→唯一作者→独立した原文保持検査を使う。

今回の新資格は、全文を読めた単一節、明示SELF、頼むの肯定／否定過去、能動／受動、書かれた相手1と「を」対象1、句点付きに限定。能動の相手は「に」、受動は「に／から」。相手は既存人役語彙で確認できる範囲とし、正規化後のSELF6表記・指示代名詞、疑問人物、未証明の人名は新資格へ入れない。省略人物、非過去、未知述語、引用／条件／伝聞、句点なし／感嘆符をこの枝で新たに許可しない。

語尾だけを許可したり、役割を推測したり、依頼から承諾や意図を足したりしない。原文・肯否・受動態・語調・二欄・段落・留保をKEEPし、宣言形式へ昇格させない。旧wish／既存短い留保の資格も変更していない。

## 同一入力の前後

実装用の同僚／司書／配達員とは別の人役・対象で、独立担当が新規架空8recordを作成した。本人6表記、能動／受動、肯定／否定、丁寧体、二欄と留保、拒否controlを含む。コードを見た開発用作例であり、blind評価や一般言語の成功率ではない。

| 対象 | 前→後 | 全文確認の結果 |
|---|---|---|
| 独立01 | 生成不可→生成 | 本人から先生への依頼、肯定・過去を保持 |
| 独立02 | 生成→同一 | 不安と看護師からの依頼を両欄順で保持。既存成功の保持であり新規増分ではない |
| 独立03 | 生成不可→生成 | 先輩へ頼まなかった否定・過去を保持 |
| 独立04 | 生成不可→生成 | 店長から頼まれなかった受動・否定を保持 |
| 独立05 | 生成不可→生成 | 未決定の留保と大工への否定過去を、別欄の順序どおり保持 |
| 独立06 | 生成不可→生成 | 後輩からの依頼の受動・丁寧否定過去を保持 |
| 独立07／08 | 生成不可→生成不可 | 本人省略／人物疑問の拒否を維持 |
| 既存control4 | 生成→同一 | 従来の行動・価値・literal希望を保持 |

独立8は1→6生成、新規availabilityは5。既存control4を含む全12では5→10生成、拒否2維持。旧成功5はmeaning／plan／artifact／candidate／visual recipe／serialized hashまで同一。全12の原本を変えていない。

rootと独立担当が全12原入力・前後全文・plan／完成候補を読んだ。追加5本文は全て原文KEEPで、役割反転・否定脱落・承諾や感情の創作はない。原本JSON／envelope hash／全文範囲／field内scalar・global UTF8根拠／本文hashの整合も確認した。原文KEEPの対応範囲改善であり、一般的な文章再構成や新しい観測価値を獲得したとはしない。

## 既存経路での確認

- 最終の同一sourceで、新test＋Piece近傍6suiteは **3218 PASS／23.95秒、既存warning1、skip0**。9つの既存test／helper／ledgerはGit原本bytesへ合わせた。反復を合格件数へ加算しない。新SQL2case、主体／否定／受動／欠落／追加のrehashed改変拒否、作者／compiler禁止下の独立保持検査を含む。
- 既存隔離PGlite・emlis_thread_read→PieceSavedSourceAdapterへ全12を通し、10candidateがpure結果と一致、拒否2維持、原入力不変。SQL用のUUID投影と日時の既存表現を別に保ち、評価recordのidentityを実DBの本人recordと混同しない。Piece保存・quota更新・Emlis thread/event書込・実DB要求0。
- serialized private成果物10を別processで開き、保存plan／本文／recipeの対応を再確認。compiler／作者／Engine／modelを禁止したまま独立保持検査を通した。source資格は保存原本から再導出する。これはprivate artifact再読であり、通常Piece record保存・画像再表示の成功ではない。
- 画像recipeの本文形式／hash対応は確認したが、実native renderer・bitmap・写真保存・共有・本人端末は今回未実行。旧7001／7101等の本人確認済み資産は保持する。

APIの変更集合は既存source2＋新test1のみ。公開route／request／response／DB schema／権利／quota／RNは変更しない。新owner・controller・別作者・raw修補なし。STRUCTURE_MAP_DELTA_PRESENTは、既存Piece ownerの有限資格と共通reader再利用依存の追記という限定。

GitHub既存の[Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/42543151704)と[Analysis共有回帰CI](https://github.com/MassyuRed/mashos-api/actions/runs/42543151792)は同じe8b7e46cでcompleted／success。Analysisは全19step成功を確認した。配置／実DB／実機の成功へ換算しない。

## AR-01と全体の残件

AR-01の意味材料→本文での役割反転は未解決、既存候補は通常不採用のまま。今回、同一messagesからの固定候補集合比較を検討したが、既存サーバーはtemperature0以外を拒否しdo_sample=False固定と実sourceで確認した。同一greedy生成を繰り返す試行は実行せず、model call・学習・新load・再起動0。候補比較能力を廃止せず、現提供条件と区別する。

AR-04は今回の限定文法だけ実装・局所確認済み。一般本文の再構成、別sourceとしてのrefined、通常保存・同版画像・実機・正式受入れは未完了。AR-01〜08と必要全資産活用は継続中。primary TECHNICAL_CREDIT、正式商品品質credit0。次はこの限定対応を通常の保存・同一採用画像まで確認し、AR-01の未解決と並行して残る作品能力を回収する。

[本文なし集計](piece_request_account_reuse_summary.json)。全private原入力・前後成果物・読解・SQL・再読・実行source identityはCocolon_CMEE_AR04_RequestAccountReuse_20261109.zipへ保全済み（15member／42242bytes）。Git反映済みsourceの重複backupは含めない。
