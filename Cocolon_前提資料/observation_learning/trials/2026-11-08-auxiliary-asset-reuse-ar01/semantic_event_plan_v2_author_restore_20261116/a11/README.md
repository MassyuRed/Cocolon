# 既存v2作者の完成正例復元とA11/B11（個別承認前）

API [7bb605b](https://github.com/MassyuRed/mashos-api/commit/7bb605b25138e9b9fc70ad8abca10dcfb46cd60b)で、既存v2指示定数へ入力／完成出力の正例を復元した。過去の返信待ち、翌日の受付完了、別人の残る未確認を分け、全event／readingを項目と本文へ接続する。定数以外の製品ASTはb14960eと同じ。schema／compiler／native／二欄／本人訂正／重みは不変。詳細は補助設計§9.103。

最終33件成功。中間260件は最終版の件数へ流用しない。raw3472／JSON文字列3650byteで、全12記録24欄・固定時点・guardと同じ6組を保持し、最大LEAF16379byte。247完全sourceはremote blobと一致。既存driverのscope／展開／5件・6組読込、既存finalizerとSQL4原本への非生成束縛を確認した。実4B改善／実保存再読／通常反映は未確認。両CI結果は同候補ci_verification.jsonを参照。

## 個別承認対象

同Pod `f1lle4xwq3wjln`内のA10 payloadから、input_cases.json／full12.input.json／controls.jsonを新payloadへbyte不変コピーし、新6ファイル・3,039,282byteを送る。全9ファイル・3,139,037byte、scope SHA `6c2c2a5119ddfc07b3570cc9317c25175e8a2d8533010eab8de9188ae657d7bb`。

- A11：5件＋前後4対照、最大9応答・復元込み30分、一回。
- 全5件の新原文／raw／図／本文がroot＋独立全文照合で適切な場合だけB11：全12記録の6分割＋統合＋前後4対照、最大11応答・復元込み17分、一回。
- 学習／retry／raw修補／応答再利用0。失敗時閉鎖。既存鍵と全envは同Pod内認証・元提供復元だけ。個別承認前の送付／実行0。A10消費済み／B10条件不成立は転用しない。

新payload=`/workspace/semantic-event-plan-v2-payload-a11-20261116`。既存driverのunitキーA9/B9は維持し、ROOTSだけA11/B11へ変更する。モデルrevisionは元の851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0aを保持し、API source commit7bb605bとは別に束縛する。直近復元記録PID141466/start238372709はfresh確認と混同せず、実行前の既存preflightで全identityが一致しなければ停止前に終了する。

新source ZIPは親folderの既存build_source_package.pyを再利用し、前回同様analysis_if_model_source.pyを明示entrypointへ追加して再現する。247member／12,593,643byte、ZIP2,584,459byte・SHA ed2b21e6fd92c1c2739cb15a31b4992a403b6e995fb21bbada311f9cc51dffb0。固定1980時刻・path順・DEFLATE9・mode100644。ZIP本体はgitの製品sourceへ重ねて保存しない。

準備初回の独自stateラベルは既存finalizerで拒否されたため、新未承認diagnosticのみ既存契約ラベルへ戻した。独立原出力／SQL原本／finalizerは不変、経過はimplementation_verificationとfinalizer_readinessへ区別して保存した。旧A10rawは変更しない。

適切な新全12結果から同raw一回SQL保存→別process非生成再読→互換native／exact API-worker・map alias2通常反映までが同じ未完単位。元SQL4原本は`/workspace/scratch/8262f97b141c/preparation/full12_sql_worked_lesson_preacquisition_20261116`に存在し全SHA一致。通常API／worker24bc228d Live・autoDeployOFF、DB38migration／20261115011424と現deploy既存起動logのworker900をfresh再確認、今回は変更0。IF120u／natural・Piece既定、月次当時版／full_source_semantic_coverage=false、build／TestFlight／本人実機保留を維持する。
