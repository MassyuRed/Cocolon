# adaptive30一回の最終結果 — 新しい重みは不採用

状態：**RUN_CLOSED_REJECTED_CANDIDATE**。Mashが[固定47e2075の具体案](https://github.com/MassyuRed/Cocolon/blob/47e2075ca87c036f316ff63051b1894730937588/Cocolon_前提資料/observation_learning/training/2026-10-26-unconnected-native/adaptive30_preparation/README.md)へ「進めていいよ。」と明示承認した一回を終了しました。**30更新→保存→非学習再読込→15件確認**を完了しましたが、意味11/15・本文9/15、新6件の本文0/6で前回localized30と同じです。新しい重み`d431a07c`は通常採用しません。

[機械可読の閉鎖結果](summary.json)と[全15件の読解記録](reading_reviews/root.json)が最終判断です。[run.json](run.json)は生成終了時の`RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW`表示を含む原本のまま保管し、後から書き換えていません。実行時の`AUTHORIZED_ONCE_BOUND` planも消費済みの証拠として凍結し、再試行の権限にしません。

## 実行と費用

Jupyterへ直接接続し、source `5c2fe64e89e2d5f87c24a85692ee19c5af1dc567`、固定API `a4b91b4788b2fb29483a4c77869c91b36402ae9f`で実行しました。承認記録はplanのstatus/gpu_run_authorized/approval_basisだけを変更し、他の条件は具体案のままです。

| 項目 | 実測 |
|---|---|
| 初期重み | Qwen3.5-4B固定revision851bf6e、保存109c。前回不採用の9372への継続ではない |
| 更新 | 同15教師・固定順序各2回、30/30。LR1e-5・seed20261024・clip1.0・fresh optimizer |
| loss | 旧9は既存helperの全文CE、新6は全targetへ`w=1+15*(1-exp(-stopgrad(CE)))^2`、`sum(w*CE)/sum(w)`。追加forwardなし |
| 保存・再読込 | 112F32、3,833,856parameter。新model objectへ非学習reloadし、全key/shape/値一致。全112tensorが初期値から変化 |
| 自由生成 | 空assistantから各一回、15/15・EOS15・strict JSON14。before0、再試行/追加生成0 |
| 処理 | **1511.033445464秒（25分11秒）・$0.117524824按分**、上限2700秒/$0.21以内 |
| 単価・除外 | A5000 $0.28/h。準備・CPU・回収・保持・保存・通信・税等は別。総請求額ではない |
| CPU採否 | 102.679954449秒。追加モデル/学習/SQL0 |

モデル読込2回は、学習用と保存後の新objectへの再読込です。二回の試行ではありません。全15の元入力/教師/target/EOSと固定source・初期109cは不変。実行順序は[plan](adaptive30.plan.json)と[30行のtraining原本](training.jsonl)へ固定されています。optimizer/RNG状態は保存しておらず、厳密なoptimizer再開には対応しません。

## CMEE採否と実本文

rawを補修せず固定CMEEへ通しました。旧9件は意味・本文とも9/9、全raw_textが前回と同一、全packetが教師と一致しました。椅子初回の喜びと問い、訂正の友人指導/共同修理・再利用の喜び・3更新、dailyの温かい食事と少し落ち着く表現を維持しています。旧9はchair二段階×3IDとdaily×3IDで、独立9題材や新たな自然さの改善とは数えません。

| 新6件 | strict JSON | 実際の意味判定 | 本文 | 実rawを読んだ残差 |
|---|---|---|---|---|
| BOOK初回 | 可 | HOLD / `model_v3_unknown_not_source_bound` | なし | 日本語unknown IDはASCIIへ変化したがclaim IDと衝突。未報告の安心感・会話の記憶を追加 |
| BOOK回答後 | 可 | REJECT / `semantic_receipt_not_validated`、receipt INVALID_EVIDENCE | なし | duplicate keyは解消。引用/根拠/更新参照の範囲外、1更新対教師7。未記載とするupdate_noteが実説明を逆転 |
| SHOP初回 | 可 | 意味採用 | UNAVAILABLE / `model_surface_not_validated` | missing_reasonは合法別名で意味誤りではない。本文に問いを混ぜ、原文を近く反復 |
| SHOP回答後 | 不可 | REJECT / `semantic_receipt_not_validated`、receipt INVALID_FORMAT | なし | candidate.schema_version重複。静的に読める4更新も全てtarget_kind/target_ref欠落、必要8更新未達。引用/否定の共通作用域・本人知覚/bindingに残差 |
| REPOT | 可 | 意味採用 | UNAVAILABLE / `model_surface_not_validated` | 教師と意味/引用は一致するが、本文は「叔父に…説明し…聞かせてください」と主客・過去/依頼を反転 |
| KNIT | 可 | UNSUPPORTED / `model_evidence_out_of_scope` | なし | 句点込み引用は原欄に存在する。実採否はscope未対応。observation/reception同文、未報告のEmlisの安心と「そのままでいい」を追加 |

新6件は4題材の6stageです。BOOK初回のID、BOOK回答後の重複、SHOP回答後の文面などに変化はありましたが、意味と必要な全更新、根拠、本人向けの本文が同時に成立しませんでした。SHOP回答後の静的読解に通常JSON parserを使っても、重複キーを修復したpacketをCMEEへ渡した事実はありません。見かけの更新数を有効な更新数として加算しません。

全15の本文・問い・全更新は[rootの全件読解](reading_reviews/root.json)、[BOOK/SHOPの比較](reading_reviews/book_shop.json)、[REPOT/KNITの比較](reading_reviews/repot_knit.json)へ残しました。実consumer判定と静的所見を区別しています。rootが実行/書込を担当し、補助2agentは読み取りだけを分担しました。正式な別Pro/Ultraモデルや人手の商品受入れではありません。

## 保存再読と原本保全

採用snapshot11件の別process cold-file再読は**全outcome11/11一致、失敗0**です。そのうちSHOP初回とREPOTは本文なしのUNAVAILABLEで、11本文成功ではありません。保存済み完成結果の非生成読出し、snapshot/checkpoint不変、追加候補/採用0を外部でも確認しました。[診断metadata](diagnosis/summary.json)と15件の`diagnosis/cases/`は全診断を値不変で分割し、再組立て一致を確認しています。完全な診断原本UTF-8も下記ZIPに含めています。

[保存重み・全実行原本](https://chatgpt.com/library?file_id=libfile_3e5553b6d2488191a753b8baee0f077f&account_id=personal)は、**76payload＋manifest / 77member、14,841,180bytes**です。CRC・全bytes/hashをPod外で照合しました。SHA256は`39ac2ff058fe65a961b70f8477c2561306ca2daa1029a1bf3bb33f620c0df342`。新adapterは`d431a07ce227c05e81eca5afb9461d91cf8101d50af0d27ec1a81844ce8ac684`、112F32/3,833,856parameter全有限です。

[archive identity](archive_identity.json)・[全member manifest](runtime_archive_manifest.json)・[外部照合結果](external_verification.json)・[再照合用code](verify_archive.py)を保存しました。ZIPはrun/diagnosisと4実行launch/log原本を含み、後から書いたroot/補助レビューや資料・画面証跡はGitHub側へ分離しています。base全重み、optimizer、RNGは同梱しません。凍結source5・入力/教師/CPU準備は固定承認commitの[preparation owner](../adaptive30_preparation/README.md)とZIPを参照してください。

GPU/consumer PID222461/231168は終了しました。run内の解放直後allocated17,039,360bytesと、worker終了後のnvidia-smi1MiBを区別します。GPUは稼働保持、Stop/restart/delete・管理API操作0です。

## 残件

同15は既知FITで、回答後priorは凍結教師由来です。実初回出力からの動的thread、通常service/SQL保存再読、本人端末、Piece/Analysis、未知一般化、商品品質は未成立です。意味型/wire/reader/通常API/DB/RN/Render/Supabaseは変更していません。STRUCTURE_MAP_DELTA_NONE、商品credit0、正式Product Read0/3、54.50％据置、PRODUCT_NOT_CLEAR、candidate_ready=false、automatic_progression=falseです。

次の直接課題は、既知教師で残る長い根拠参照・全更新・本文役割を実rawと教師の対応からCPUで切り分けることです。現時点で教材不足とは判断せず、新観測会は不要です。同じ回数/LRだけの有料反復や閉鎖runの再起動を自動開始しません。全体00・観測入口・学習owner・CMEE/全ファイル地図・[weekly§78](../../../../weekly_reviews/Cocolon_Weekly_Review_20261024.md#20261027-native15-adaptive30-result)へ同じ結果を反映しました。
