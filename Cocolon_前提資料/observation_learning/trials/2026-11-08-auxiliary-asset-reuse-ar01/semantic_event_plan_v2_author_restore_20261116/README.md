# 既存v2作者の意味条件を復元した候補とA10/B10（未承認・未送付・未実行）

新しい継続指示に基づくsource修復。API b14960e1e546643942be7786ed4e487274e4422eで、既存semantic_admission.pyのv2 instruction定数だけを3436→3632byteへ変更した。確認済みをunknownへ戻さず不明がなければ[]、版・主体・状態・時点と前後確認を別eventにし、同じ意味の分類別反復を避け、edgeの全e／r.event_refsを両端nodeの根拠和集合内に限定する説明を復元・明確化した。schema／compiler／guard／native／モデル・重み／入力／公開型／DB／RN／保存ownerは不変。旧失敗rawは修補・再束縛しない。

初回pytestは存在しないplugin指定により収集前終了。その後169成功・SQL設定不足1skip、既存PGlite設定後その1件も成功し、既存170件を確認した。runnerの既存22件／28subtestも成功。新test・helper family・dependency・model／Pod操作0。長い中間案は分割が6→12になり不採用。最終案は同12記録・同6分割を維持し最大leaf16376byte、全5件のuser message／guard／request_refは同じ、SYSTEMとmessages hashだけが変わる。実4B効果は未確認。技術検証や引用一致を意味適合へ換算しない。

## 具体的な個別承認対象

同Pod f1lle4xwq3wjlnで、送付済み3file（controls.json／input_cases.json／full12.input.json）を新payloadへbyte不変copyし、新6file合計3,039,091byteを送る。全準備9file3,138,846byte、scope SHAf68618f074eb5ce176491e4a45926b5bfa4e6ebbcbbd8c9d9dcda812d29d0d86。新送付はevent_plan_execution.py／current_api_sources.zip／source_manifest.json／diagnostic_preparation.json／full12_pre_acquisition.plan.json／execution_scope.json。

- A10：同じ架空5件＋前後4対照、最大9応答・停止復元込み30分、一回。
- 全5件の原入力／新raw／図／本文をroot＋独立全文照合して適切な場合だけ、4KB以下の判定hash1fileを追加し、B10：全12記録の同6LEAF＋MERGE＋前後4対照、最大11応答・停止復元込み17分、一回。
- 学習／retry／結果再利用／raw修補／SQL保存／通常採用0。失敗時はその一回を閉じ、追加修正・自動retryなし。既存鍵と全envは同Pod内認証・元提供復元だけに使用。

新payload=/workspace/semantic-event-plan-v2-payload-a10-20261116、A10 root=/workspace/semantic-event-plan-v2-diagnostic-a10-20261116-once、B10 root=/workspace/semantic-event-plan-v2-full12-b10-20261116-once。driverは既存の検証済み動作からROOTSだけを変更し、unitキーA9/B9を入口名として維持する。閉鎖済みrepair1のscope／root／raw／承認は流用しない。

元提供は直近復元記録PID139472／start237826333。実行直前に既存preflightで現proc／argv／env／cwd・native／両adapterとその重みを再照合し、不一致なら提供停止前に終了する。新source ZIPの247全module／asset bytesをAPI b14960eのremote blobへ照合済み。ZIPは同source_manifestの完全moduleを既存build_source_package.pyと同じ決定的ZIP形式（時刻1980-01-01、path順、DEFLATE9、mode100644）で再現できる。バイナリZIPはAPI sourceへ重ねて保存しない。

適切な新全12実結果から、同raw一回SQL保存→別process非生成再読→通常native／exact API-worker・map alias2の整合反映までは元の未完単位。通常24bc228d・DB20261115011424は前回fresh確認記録であり、今回は変更・fresh再確認していない。build／TestFlight／本人実機保留。今回candidateは個別承認前で、GPU実行許可ではない。
