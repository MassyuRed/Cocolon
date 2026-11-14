# prior座標除去の非学習2件診断 — 形式は改善、意味・本文は0/2

状態：**RUN_CLOSED_NO_MEANING_OR_BODY_GAIN**。Mashが[固定f8fa5224の具体案](https://github.com/MassyuRed/Cocolon/blob/f8fa522440671b75250be55d9f839921f2694333/Cocolon_%E5%89%8D%E6%8F%90%E8%B3%87%E6%96%99/observation_learning/training/2026-10-26-unconnected-native/prior_quote_preparation/README.md)へ「進めていいよ。」と明示承認した一回を終了しました。**追加学習0→保存d431重みの非学習読込→BOOK・SHOP回答後各1件**を完了しました。

両方EOS・strict JSONを満たし、SHOPの重複キーと数値座標は消えました。一方、同じCMEEの**意味採用0/2・本文0/2**で、前回の同2件から成立件数は増えませんでした。重みは不変で、通常採用・配置・追加試行へ進めていません。

[最終summary](summary.json)が閉鎖結果です。[生成終了run原本](run/run.json)の`RAW_COMPLETE_PENDING_UNCHANGED_CMEE_AND_BODY_REVIEW`表示と、[承認済みplan原本](source/probe2.plan.json)は凍結保存し、結果へ書き換えていません。今回の承認枠は消費済みで、再利用できません。

## 実行条件と実測

Jupyterへ直接接続し、承認記録source `2ab02db37484ea9898990ef2d4a6ebc6b3451bb7`で一回だけ実行しました。planのstatus/gpu_run_authorized/approval_basisの3項目以外は固定具体案と同じです。

| 項目 | 実結果 |
|---|---|
| 重み | 保存d431a07c、112F32/3,833,856parameterを1回非学習load。既存loaderが全key/shape/値・有限性を照合し、eval/no-gradで使用 |
| 学習・保存 | 更新0、新しい重み保存0、optimizer作成0。adapter SHA256不変 |
| 自由生成 | BOOK2724token、SHOP2637token。各1回/計2、EOS2、strict JSON2、timeout/retry0 |
| 入力 | モデル向けpriorのstart/end除去だけ。今回選択2件は計24座標項目、準備時全15の5回答後では60項目。元情報・凍結prior・教師・出力条件不変 |
| 条件 | 3712出力cap、context8192、既存helperの生成条件。BOOK入力4201/枠込み7913、SHOP4365/8077 |
| 処理 | **235.326689023秒（3分55秒）・$0.018303187按分**。上限600秒/$0.047以内 |
| 別費用 | 準備・CPU・回収・保持・保存・通信・税等は別。総請求額ではない |
| CPU採否 | 1.993279065秒、追加モデル/学習/production SQL0 |

モデル向け入力版はAPI`64c6cb1a41620fd2d7690e0b6f1af30ae0e624a4`、採否readerは未変更の`a4b91b4788b2fb29483a4c77869c91b36402ae9f`です。実入力版とreader版を区別して[診断原本](diagnosis/diagnosis.json)へ保存しています。前回の30更新executeは呼ばず、既存の依存/loader/評価をread-only再利用しました。

## 実際のCMEE判定と本文比較

| 対象 | 前回adaptive30 | 今回の実判定 | 原文・教師・実rawの比較 |
|---|---|---|---|
| BOOK回答後 | strict可、receipt INVALID_EVIDENCE、意味/本文0。13引用中1件原欄不在、1更新/必要7 | strict可、receipt **INVALID_EVIDENCE**、**REJECT / semantic_receipt_not_validated**、意味/本文0 | 15引用中12..14の3件が原欄不在で、生成surfaceの末尾句点を除いた文と一致。回答後のown-quote索引・no_contact役割・時点が崩れる。依然ADD1、gap解消なし。本文は一人称回答の再掲と後悔反復 |
| SHOP回答後 | candidate.schema_version重複、18引用に座標、receipt INVALID_FORMAT。4本の記述上updateも全てtarget_kind/ref欠落、意味/本文0 | strict可・座標0、14引用全て原欄で一意。receipt **CANDIDATE_UNREVIEWED**だが、**UNSUPPORTED / model_evidence_out_of_scope**、意味/本文0 | target_kind/refは復帰してもADD1だけで必要8未達。realization/distance/喜び/寂しさが別の引用を参照し、relation14は0..13外。共通二否定と時点の根拠scopeも不足。本文の「と感じた」留保が落ち、未記載の想起可能性を追加 |

BOOKは元4claim/2relationを保持しますが、回答後5claimの根拠対応が不一致です。relation15/16、update15/16/17は証拠配列外、surface.update_refs[1,2]も実update1本の外です。SHOPも元4claim/2relationを保持しますが、perceived_realization→旧action4、felt_distance→旧memo5、answer_joy→realization9、answer_sadness→joy10というずれを残し、update_refs[1]も範囲外です。単なるquoteの実在確認だけでは意味の採用に届きません。

全本文・問い・更新と根拠は[root読解](reading_reviews/root.json)、[BOOK比較](reading_reviews/book.json)、[SHOP比較](reading_reviews/shop.json)へ保存しました。両方question_proposal=null、実rawは無補修です。BOOKはquote受領、SHOPは意味admissionで止まっており、以下の本文上の静的所見を実拒否理由に置き換えません。本人へ向けた受け取り、主観の留保、全更新の不足は、root/補助が実本文として確認した残件です。正式な別Pro/Ultraモデルまたは人手の商品受入れではありません。

採用snapshotは0件です。cold-file保存再読は**対象0・該当なし**で、成功0件/失敗0件という実行済み検査へ換算しません。通常service保存・動的初回→回答・本人端末も未実施です。

## 原本と重みの保全

[実行原本ZIP](runtime_originals.zip)は**15payload＋manifest/16member、56,444bytes**、SHA256 `147d2b426019c43026326cdb648f2612d1da333bebb9598112632daa4f8cd812`です。Pod外でCRC/全bytes/hashを照合し、ZIPと各memberをbytes不変で保存しました。[manifest](runtime_archive_manifest.json)・[identity](archive_identity.json)・[外部照合](external_verification.json)に根拠を残しています。

ZIPはrun/入力source/診断/4起動log原本です。後続の本文比較・summary・資料・画面証跡はGitHub側の追加記録です。新しい重みはなく、元d431のSHA256 `d431a07ce227c05e81eca5afb9461d91cf8101d50af0d27ec1a81844ce8ac684`は実行前後不変。今回loadした112tensorの検査metadataは前回保存後再読込と全値一致しました。元4B全重みは今回ZIPに含まず、追加重みを含む以前の全原本は[adaptive30保全先](../adaptive30_result/README.md)へ戻ります。

GPU wrapper PID246433、consumer PID246735はEXITED。終了後A5000/1MiB/24564MiB、稼働保持を確認しました。Stop/restart/delete・管理console/API操作は0です。

## 残件と報告範囲

確認できた前進は、SHOPのquote形式が成立し、数値座標・重複キー・改変引用が今回2件の出力から消えたことです。**今回の入力修正だけでは、意味・全更新・自然な本人向け本文は成立しませんでした。** 再び同じ有料反復へ進めず、残る根拠対応、必要7/8更新を1本にまとめる挙動、本文の役割を既存教師と実出力から見直すのが次の直接課題です。新観測会は今は不要です。

今回評価したのは既知回答後2件だけです。旧9の新prompt回帰、新初回4件、全15新評価、未知一般化、通常保存/端末、Piece/Analysis品質を確認したことにはしません。前回全15の11/9は履歴のまま保持し、今回2件へ合算しません。商品0/正式0/3/54.50％、candidate_ready=false、automatic_progression=false。STRUCTURE_MAP_DELTA_NONE（入力projection修復後の限定診断で、責務/型/wire/reader/通常API/DB/RN/Render/Supabase不変）。全体00・観測入口・学習owner・全ファイル/CMEE地図・weekly§80へ同じ結果を反映します。
