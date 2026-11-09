# AR-04 — 依頼・相談・伝達の原文保持と保存再読

2026-11-09 JST。詳細設計§7.1／§9に従い、[前回e8b7](https://github.com/MassyuRed/mashos-api/commit/e8b7e46c70269a40317fe2ec6ee8362c4086e619)の有限依頼5本文を継承し、現候補[f3b5e93e](https://github.com/MassyuRed/mashos-api/commit/f3b5e93e837a01c726ea9d0ca1caa4c39f396add)で相談・伝達にも既存の役割読取を回収した。**新8入力は生成不可→原文を保持した本文となり、新旧18作品を既存サービスと隔離SQLで保存・非生成再読した。** 配置・本人端末・native画像の完了ではない。

## 改修と意味の境界

piece_source._finite_self_person_action_account（旧名_finite_self_request_account）は、既存natural_reply_meaningの有限節／活用／格／人役読取を使う。今回の正の差分は許可述語を「頼む／相談する／伝える」へ限定拡張したことだけ。共通reader自体、意味型、作者、公開DTO・DB・RN・権利・quotaを変更しない。piece_v1cの既存KEEP_COMPLETE_SOURCE_CONTEXTへ接続し、原文の時点・主体・相手・能受動・否定・語調・二欄と留保を維持する。相談から助言・承諾・解決、伝達から理解や受領を創作しない。

全文を読めた単一節、明示SELF、肯否過去のfact、既存人役の相手1と「を」対象1、句点という前回条件を維持。能動は「に」、受動は既存readerで一意に読める格だけ。特に「伝えられた」の「に」受動は可能表現との曖昧さを既存readerが拒否し、迂回しない。省略人物・代名詞・人物疑問・未証明人名・非過去・引用／条件／伝聞・未知文法へ広げず、宣言適格を足さない。

## 同一20入力の前後と全文読解

独立担当が相談／伝達の能受動×肯否、SELF6表記、書かれた時点、丁寧語、二欄留保を含む架空8recordを作成。前回12recordは全7fieldをそのまま再利用した。新8は全て不可→生成、旧10成功はmeaning／plan／artifact／candidate／recipe／serialized hashまで同一、旧2拒否も同reason。合計10→18生成で、18を新規改善とは数えない。新作例は開発用でありblind一般化評価ではない。

root／独立担当が全20原入力と前後全文を読んだ。相談の送り手・受け手、伝達の方向、未実行、過去、昨日／今朝／先日、二欄の未決定は全て書かれたまま。新8の本文は原文KEEPであり、一般的な本文再構成の完成とはしない。83実行sourceの変更は当該2pathだけ。

## 実サービスから保存済み作品まで

既存Q3Database（PGlite0.5.8）にQ2／Q3／related-contextとPiece M1～M4・visual-change／quota-read／natural-context／paletteの原本SQLを適用した。実行SQL11と既存helper／test3はfresh e8b7のblob bytesに全一致。legacy表・roles・認証は架空。先行Emlisは合成providerを既存serviceへ渡して成功completionを保存し、本文をPiece素材へ流用しない。

全20を実PieceSavedSourceAdapter→PiecePreviewService.issue_original→実review_prepared_original→piece_issue_preview_v2→PieceSaveService→piece_save_v2→PieceOwnerService.detailへ通した。Free比較で18保存／2拒否、最終process2.221914秒。本文／payloadはFreeのpure結果と一致。SQL用UUID・日時表現は別投影として保全し、pureとのsource identity同一を主張しない。

18全件でpreview→保存行→detailの本文／body_blocks、3hash、format、recipe、rendererと4contract版の計12fieldを照合。初回後は生成入口・CMEE Engine／作者／compiler・reviewを禁止し、fresh serviceのpreview再読、save同key再送、detail再読を実行した。各作品の保存消費は1、明示再送は同じconsumption、拒否2はPiece／quota件数差0。原入力とPiece開始後のEmlis thread／eventsは不変。候補生成入口の1callを、内部の既存binding再実現まで含む作者処理1回と表現しない。

Auth・先行Emlis provider・PostgREST envelopeは合成／SQL callback、service-roleはBYPASSRLSのテスト構成。実Auth／実PostgREST／ASGI・本番DB・native並行lock／RLSの新実証ではない。同じrenderer文字列と描画材料の受渡しを、実bitmap・fit・文字欠け・同一PNG・写真保存／共有へ換算しない。

## 検証、修正した測定、反映

最終sourceで既存test拡張＋新保存一巡test＋Piece近傍6suiteは**3351 PASS／27.94秒、既存warning1、FAIL／SKIP0**。9caseで依頼／相談／伝達×3planの保存一巡を確認。初期のtest期待は曖昧な「伝える＋に」受動も通ると誤っていたため、既存拒否を維持して「から」の正例と「に」の拒否例へ訂正した。製品readerを緩めて成功化していない。最初の未存在Engine symbol指定、比較scriptのcandidate hashキー不存在とtierによる適格format差の誤比較は検査側を訂正し、failure logを保持した。途中成功や反復を最終件数へ加算しない。

APIは既存source2／既存test1／新test1のexact4pathのみ。全remote bytes・差分集合・親／tree・headを読戻し確認。既存CIは[Piece42545974787](https://github.com/MassyuRed/mashos-api/actions/runs/42545974787)／[Analysis42545974764](https://github.com/MassyuRed/mashos-api/actions/runs/42545974764)、同じf3b5e93eでPieceはcompleted／success、Analysisは実行中。新workflow／手動rerunは追加しない。

## 継承と次作業

前回の依頼新規5本文・旧成功5不変・3218局所PASS・両CI成功はe8b7の完了履歴として保持。今回の8本文増分と18保存を重複計上しない。AR-01の役割反転／対象状態・現作者の問題は未解決、研究候補通常不採用を維持。新model call／学習／load／server変更・再起動／配置／実DB／RN／build0。

AR-04の一般本文再構成・別sourceのrefined、対応候補の通常稼働とnative同版画像・実機・正式受入れは未完了。次はこの保存可能な本文能力を維持し、既存Piece正本に沿ってrefinedの原入力／本人補足を別sourceとして扱う不足へ進む。適格補足をoriginalへ連結する短絡はしない。AR-01〜08・全必要資産活用は継続中、正式商品品質credit0。

[本文なし集計](piece_request_account_reuse_summary.json)。全private原入力・前後本文・保存行／再読・root／独立読解・失敗log・source identityはCocolon_CMEE_AR04_PersonActionSavedReuse_20261109.zipへ保全済み（19member／80956bytes、全CRC・member hash一致）。Git反映済み製品source／testの重複backupは含めない。
