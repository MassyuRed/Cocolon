# Cocolon 最新情報 — 全機能・全状態

**11/2・分析の最新（第9回§71）：** 反復不明58教材/64更新/40新生成を完了。UQ2教師同値と近接別題材の不明root・内容親対応、理由/否定に局所改善。一方旧AT4同値4/4→2/4、非逐語/分類/key/親/理由scopeの不足で通常未採用。全278原本/112重みを元SHA照合・保存済み。次は同99916/58target/64順/seed/objectiveでLRだけ1e-5へ下げた既見16比較（600秒一回、GPU未実行）。[結果/原本/再開点](observation_learning/trials/2026-11-01-analysis-model-fields/README.md#analysis-unknown58-result-20261102)。通常map/DB/RN/稼働/正式0/3・54.50％据置。

**11/1・分析4B接続のCPU最小準備を完了（[第9回§45](weekly_reviews/Cocolon_Weekly_Review_20261031.md#three-core-quality-priority-20261101)）：** Mashが7201の依頼修正を確認。架空の日常8例を現分析へCPU処理すると個別/一括ともmapなし（mapped0/未解析8）、既知対照追加では対照1件だけ2node。Pieceの同8例は原文保持の本文生成まで成立（新画像/本番検査ではない）。分析はCMEE接続済みだが4Bを呼ばない有限文法、Emlisのnatural本文から分析材料も未生成。次は分析を4Bへ接続して品質を育てる。後続§46でCPU最小受口/通常graph・保存再読を実装し、対象785件成功。完全fieldの分類候補で全件未解析を維持し、一般理解品質は未成立。次は実4Bの最大4生成・追加学習なしの確認でGPUが必要。詳細は[実行準備](observation_learning/trials/2026-11-01-analysis-model-fields/README.md)。Emlis/Pieceの残件と平日配分案・暫定完成度は§45、旧管理54.50％の確定改定ではない。§45の調査時点は製品/稼働/GPU変更0。§46で明示offline製品sourceを追加、通常稼働/GPU変更0。

**11/1・累積Analysis（[第9回§44](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-cumulative-plans-20261101)）：** 全保存期間の感情原入力＋適格本人補足、現在map共通、月次当時保存と現在比較、Free2回/Plus12回/Premium全期間、根拠参照と削除寿命を実装。RNb187b790/API36713940をGitHub反映、新DB migration適用、APIはdep-dbjg0l8ae00c73e4cr20で09:04:51 UTC Live。health/bootstrap200、認証なしlatest/history401、private5ON/public3OFF。local API624/RN1287と対象64、遠隔Analysis/Piece SQL CI成功。iOS #72/run41291615693は全工程success、Apple処理/暗号化情報保存後、1.0（7201）が既存内部グループでテスト中。Mashが7201の依頼修正を確認。一般分析の内容品質は未確認。月次は各JST月の初回成功取得を固定し、過去未保存月のbackfillなし。GPU再起動0。

**11/1・7101本人確認済み（第9回§43）：** RN7464f858のiOS #71/run41283646380/job124780456306は署名Archive・写真目的文検査・IPA・TestFlight Uploadの全工程success。Mashが7101を反映し、今回依頼した修正の完了を確認した。起動待ち、Home全体行動削除、Ranking撤去、設定以外のガイド同期、新PieceのEmlisロゴを含む。こころ天気は今/日週月/履歴/未読/通知/tutorialを従来どおり維持。API3407402/dep-dbjebcflk1mc7390mnr0は07:11:03 UTC Live、health/bootstrap200・private5ON/public3OFF。API製品同一blobのd43cabcd native PostgreSQL CI41283815884は全step成功。RNの旧V4 metrics19失敗とlegacy canvas13reportは残る。依頼UIの本人確認を、全製品の品質/正式商品受入れへ広げない。GPU再起動0。

**11/1 UI修正（[第9回§38](weekly_reviews/Cocolon_Weekly_Review_20261031.md#response-modal-piece-entry-20261101)）：** Mash指定で共用応答popupを「Emlisからの応答」/「応答内容」へ変更し、通常説明・履歴展開・保存状況確認を削除。通常footerは「ピースの作成」「閉じる」の2つ。入力/履歴で表示中の保存ID→PieceCreate→既存source-ref/preview/明示保存へ接続し、応答本文を本人原文へ使わない。API1296eaeaのoriginal-only handoff/保存cohort補正を実DBへ適用し、dep-dbjafelg1s2s73f6mah0は02:46:53 UTC Live、health/bootstrap200・保存値read_onlyを確認。RN209/API実SQL175が対象PASS。RNef9f7bfc/iOS #68/run41266287100は全工程success、6801はApple処理通過・暗号化情報保存後、既存内部グループでテスト中。Mashが6801の応答popupを指示通りと確認。Pieceはsource-ref取得200後preview422で未作成、見出しが時計へ重なる実機不具合を受領。既存modal内Provider/安全領域と誤案内文を修復、対象231 PASS。RNedf77289/6901は署名Archive/IPA/Upload成功・Apple処理通過・内部テスト中。Mashが6901の表示修復を確認し問題なしと回答。第9回§40の修復版7001で、Mashが画像生成・一覧・スマホ写真保存成功を確認。§41の最新指示により画像本文への選択感情説明を廃止し、ユーザー本文だけを必要に応じて整形するAPI修正を実施。対象579成功、APIba0de502は14:16:37 JST Live/health・bootstrap200、native PostgreSQL CI成功。新規buildなし、7001継続。§41へ。GPUはMashから停止報告、華恋の再起動0。

**11/1の稼働・配布：[第9回§37](weekly_reviews/Cocolon_Weekly_Review_20261031.md#testflight6701-device-initial-save-20261101)。** 6601はApple90683で配布不可。写真Usage/Add両目的文とArchive実物検査を修正したRNb8a43e5a/6701は、iOS #67/run41260929560が全工程success、Apple処理通過・暗号化情報保存後、既存内部グループで「テスト中」を確認。Mashは6701の起動と、感情入力→Emlis返事→同じ記録から同じ返事の再表示を確認した。実DB集計はnatural FINAL1/CALL_STARTED1/active0で再読後も増加なし。実Auth→固定4B→DB保存→本人再読の初回配線は完了。モデル提供は初回1477秒＋再開184秒以内で停止し、品質採用には換算しない。この初回確認時のAPI744336c0はdep-dbj9pqvb9u1s73de4160/保存値read_onlyでLive、保存readerとPiece private5ON/public3OFFを維持。iOS metrics19失敗・累積/月次snapshot・Piece実機・Android実配布・実ストア料金/購入/復元・本番原価/申請Consoleは未完。

**11/1の実装/DB：[第9回§32](weekly_reviews/Cocolon_Weekly_Review_20261031.md#release-implementation-20261101)・[§33](weekly_reviews/Cocolon_Weekly_Review_20261031.md#release-source-db-20261101)。** account owner世代分離、購入finish失敗伝播と同一購入結果共有、visibility失敗502、Piece export独立許可/OS直前artifact照合、iOS URL復帰、Android署名AAB手順、ガイド同期を実装。API7bbb4661で関連履歴検索・本人原入力/最大3回答/訂正の別材料化・失効natural本文のtimeline抑止・Analysis複数補足と矛盾照合・adapter SHA対指定を追加し、Supabase migrationを適用。RN151/API284、natural系63、Analysis関係177、RN screen36が局所PASS。API7bbb4661のAnalysis CI41253745568も1634 PASS＋12020 subtests、owner1 PASS・194 deselected、合成保存再読成功。実装/DB/配置/Uploadを実機成功・8タスク全完了へ換算しない。

更新日：2026-11-01 JST（最新差分：Mashの説明に基づき工程を訂正。11/1はリリース機構・配布・運用・初回接続、11/2〜11/6は華恋がGPU/サーバー側で品質改善。実機は初回と最終確認に絞り、品質試行ごとのRNビルドは行わない。品質以外を先に整え、公開日まで育てた品質を反映できる状態を目指す）。全Cocolon作業の必読原本。

> **最新報告会：[第9回・2026-10-31、10/31〜11/7](weekly_reviews/Cocolon_Weekly_Review_20261031.md)。開催中。** [§3のMashの方針・既決仕様](weekly_reviews/Cocolon_Weekly_Review_20261031.md#confirmed-directions)、[§4の華恋の商品案](weekly_reviews/Cocolon_Weekly_Review_20261031.md#release-product-proposal)、[§11の合意最低線と週間基準計画](weekly_reviews/Cocolon_Weekly_Review_20261031.md#weekly-tasks-20261031)、[§7の未決・会議進行](weekly_reviews/Cocolon_Weekly_Review_20261031.md#meeting-agenda-and-open-items)を区別する。Emlisは人間的応答のみの表示へ変更し、意図的短文化・1〜2文固定はしない。観測ラインは分析へ活かす。Free当回入力のみ／Plus過去本人入力も照合は既決仕様の再確認で、通常4Bでの意味ある履歴応答は未完成。わたしマップは全蓄積の構造・ルートと月ごとの当時snapshot、現在との見比べが構想。28日・最新100だけ・最新1枚は華恋の判断・撤回案で、Mashの構想ではない。下表の期間実装と新目標を混同しない。

**初版Emlisの最低線は合意済み：** Mashは§10の例に「俺が求めるのもこのライン」と明示し、その水準を目指した改善案と1週間のタスク記載を指示した。[第9回§11](weekly_reviews/Cocolon_Weekly_Review_20261031.md#weekly-tasks-20261031)が現在の基準計画。意味・主体・否定・時点を保ち、不明やない事情を確定せず、自然な返事を返す。短い受け取り・一度の言い換えも認め、高度観測の深さ・毎回の新発見・助言・質問を初版必須にしない。本人宛応答と分析材料を分け、通常実機接続・保存再読・Plusの具体的履歴応答を主成果とする。例文を固定テンプレ・凍結テストへ採用せず、文数固定もしない。最低線の合意と、実4Bの合格・実機成功・商品受入れは別。Plusの既決差とAnalysisの累積／月次構想は保持する。

**商品案の採否：** Pieceを初期の有料価値の中心にする方向を記録。**Plus月680円／Premium月1,480円はMashの最新の実装指示で採用済み。** [第9回§15](weekly_reviews/Cocolon_Weekly_Review_20261031.md#subscription-prices-20261031)に確認と反映を記録。RNの3file／APIの1fileの料金fallbackと、実DBの対象2行の料金・自動更新案内を更新した。初回公開API取得はtimeoutだったが11/1に200/料金を確認。公開bootstrapの680/1480円を確認。6601のApple90683を修正した6701は内部配布/本人起動済み。実ストア請求額・料金の本人端末表示は未確認。12配色・生成枠・iOS先行・SNS後置・Premium等の延期は華恋案で、採用済みではない。Pieceへの4B利用は質問と回答の段階。描画には不要、意味再構成では候補という見解を仕様変更の合意にしない。既決の12/18両ストア公開目標は変更していない。54.50％は前回管理評価を継承し、今回再採点なし、正式商品受入れ0/3。通常AI・累積マップ・Piece本人実機一巡の未達から、期限内完成は保証できない。

**最新の公開見通し：** [第9回§13](weekly_reviews/Cocolon_Weekly_Review_20261031.md#release-outlook-20261031)。12/18両ストア公開目標は維持するが、常時提供・累積マップ・課金・両OS・原価の未成立から達成の裏付け不足・高リスク。10/31→11/27の提出基準まで27日、その後12/18まで21日を審査・差戻し枠とする管理計画で、所要保証ではない。11/1のPC枠で初回接続・リリース準備、11/2〜11/6は華恋単独の品質改善、11/7は実績・Android差分・販売範囲と原価材料を報告する。11/15結合、11/22候補、11/27両ストア提出の管理線を保持し、品質試行ごとの実機確認・ビルドは要求しない。高度観測を初版へ戻さず、Plus履歴・累積／月次マップ・Piece保存出力・課金権限は残す。iOS先行やSNS後置等の未採用案を工程削減済みにしない。[§14](weekly_reviews/Cocolon_Weekly_Review_20261031.md#karen-opinion-20261031)は華恋の進め方・商品価値への意見。§13の見通し報告時点は実装/稼働変更0。後続11/1の実配置/配布/本人初回確認は冒頭と§37を参照する。

**現在の直接作業（11/1）：** [第9回§31](weekly_reviews/Cocolon_Weekly_Review_20261031.md#mechanism-first-20261101)を訂正。11/1はPCを使うリリース準備と初回接続を先行し、11/2〜11/6は華恋がGPU/Jupyter・サーバー側で応答品質を改善する。API/保存/表示契約を保てば重み・指示・生成設定の更新にRN再ビルドは不要。初回に実機から実4Bまで接続・保存再読を確認し、各品質試行は端末操作なしで進め、最終候補反映後に最後の接続確認を行う。最終確認日は未指定。8タスクと料金/Android/原価/申請残件は保持。現在の初回source・隔離HTTPS保存だけを本人端末成功へ数えず、本人補足/訂正の材料化・権利内関連検索・共通3欠陥のsource/DB実装と、実モデル/実機・新観測材料生成・配布/運用の未完を分けて進める。前版の『アプリ上で品質改善』『機構全完了まで品質を一律保留』は華恋の誤解で撤回。過去の不採用・正式0/3・54.50％は変更しない。

前回の[第8回・10/24](weekly_reviews/Cocolon_Weekly_Review_20261024.md)は終了版と、その後の学習・接続実行履歴§12〜136として保持する。各承認の消費・候補の不採用を新会議でリセットしない。旧focus29は下段の10/30学習履歴を参照する。最新の通常返答学習は第9回§30の527d参照/初期値による新2組4更新（候補6e1c不採用）。§28のd691参照/初期値28更新527d不採用も履歴保持。§27のaf44参照/初期値55e9不採用を履歴保持。§25の18教師36更新d691不採用・§21の12教師24更新・§24のT04一更新不採用も保持する。

**最初のA4500学習実績（§24・履歴）：** [A4500で修正版4B追加学習を完走、重み回収、CMEE採用は未達（§24）](weekly_reviews/Cocolon_Weekly_Review_20261024.md#20261025-a4500-training-and-portable-weights)。[全実結果](observation_learning/trials/2026-10-24-qwen4b-cmee-diagnostic/repaired_a4500_20261025/README.md)。Mashは4B採用とリリースまでRunpodでの追加学習を明示し、将来は手持ちPCへ移す可能性が高い。RTX A4500 20GB／Secure・EU-RO-1・Pod y0eb0w0qn6nks0を今回の最安の容量候補として確保。GPU$0.25/h・50GB container込み表示$0.26/h。CUDA/BF16正常、修正版2教師/1epoch/2update・adapter保存/非学習reload・前後16生成が20分23.76秒で完走し、20GBで現方式が動くことを確認した。peak allocated14.970/reserved17.588GiB。最終archive全24memberのhashと32tensor有限性/前後重み不変をPod外照合し永続保管済み。NLL0.251117→0.245189、raw6/8変化だが、CMEE意味/本文は前後0/2。初回の根拠座標は通るようになったが必須shape/自然文surface不正、訂正後rawは不変、proxy2件が2048tokenで打切りとなり品質未達。その時点の残件は必須shapeと自然文surfaceで、後続の現在作業は下段へ更新する。この§24のrunはGPUを停止せず終了した。旧3070は今回開始時既に停止表示、華恋のStop操作0。

**GPUの現在状態（11/1・本人初回接続確認後）：** Mash提供Pod6i2aa1nj683s8y/RTX3090×1/$0.51/h。承認済み8888,8000保存/reset後に固定base2shardと隔離venv/提供tool SHAを復元照合。専用キーなしPOST401、synthetic1callの契約成功後、6701の本人入力から実DB FINAL1/CALL_STARTED1を確認。先行1477秒＋再開切上げ184秒で合計1661秒、承認1800秒以内。所有するmodel HTTP processは停止しGPU1MiB/0％。学習0/品質採用0。初回接続後にMashからPod停止報告を受領。華恋の再起動/Stop/新規作成/削除/追加チャージ0、管理画面の再照会0。本文/認証token/keyは公開記録しない。

**10/30の学習履歴（focus29一回完了／不採用閉鎖）：** Mash承認の保存ad8b隔離初期値・現10行各2回＋旧9各1回＝29更新を同Jupyterで一回実行し、29 training forward/optimizer・保存非学習再読・同19行NLL・新2件×5段の10生成/全EOSまで完了。全19教師/messages/encoded/元終端/mask/完全CE/指示/受信/合否は不変。新ed298856は112有限F32/3,833,856params、実runは全112変更を記録した。

両件S5はprose rowが必要4cellに対しBOOK2/SHOP1cellでprose_typeとなり、結合・新CMEE受信前で停止。意味/本人本文0/2・saved/cold0、新CMEE0、旧9は条件不成立によるNOT_RUN。BOOK S2〜4は教師JSON値一致だがS1引用scopeが誤り、SHOPは未宣言引用/更新割当も残る。S5にはBOOKの謝罪主体逆転・問い化/反復、SHOPの本人一人称再掲がある。平均NLL改善を品質成功へ換算しない。[全実結果・全66file地図](observation_learning/training/2026-10-26-unconnected-native/role_binding_preparation/fixed_rows/stage5/focus29/execution_20261030/README.md)。

処理786.372730217秒/前回$0.28/h按分$0.06116232346（約$0.0612）、親787.706529139秒/exit1。45分/$0.21内、準備/回収/保持/保存/通信/税等別・現在単価未再照会。途中のブラウザ確認拒否は同じrunの実行を再試行せず、Mashの明示的な同Jupyter再接続・状態確認・終了後回収の許可で解消。全原本55member/14665160bytes/SHA117dab42のCRC/全元bytes/SHA/実承認・source/29順/19NLL/全10chainをPod外照合。追加重み4member/14208416bytes/SHA159ee107を完全保管、他54元memberをGitHubへ原bytes保存。298frozen/ad8b/config不変、A5000 1MiB/0％で稼働保持。

今回承認は消費済み・不採用閉鎖。再試行/再生成/次run/新ed298856の製品・初期値自動採用0。既存の正しい教師があり追加観測会不要。通常source/受口/意味型/三core/API/DB/RN/Render/Supabase/依存/merge/deploy差分0、STRUCTURE_MAP_DELTA_NONE。商品0・正式0/3・54.50％・candidate_ready/automatic_progression=false。最新weekly§136。

**現在の観測会（10/27）：** Mashが、基本相談式／短い実入力式は華恋が基本案・判断に迷う例はMash／分析向けも時々交える、まずEmlisAIを優先する方針を明示決定した。[観測会方針](observation_learning/README.md#observation-session-policy-20261027)と[OBS-20261027-001](observation_learning/sessions/2026/OBS-20261027-001/01_dialogue.md#d00)へ記録。社内勉強会の引き継ぎを題材に、質問前の本人役設定を保持し、D11まで採録。D05のMash観測文とD06の相談者役の確認を保持し、D10で本人の「分かりやすかった」という感想の撤回か、保持したままの気掛かりかを見極める問いだったと教示を受けた。D11は華恋の理解で、具体的な次の問いの分岐は未説明。観測会終了は未指示。形式別の4B学習効果は未比較。材料収集と学習投入を分け、凍結15教材・評価・重みへの変更／追加GPU処理0。直近の意味・本文0/2という学習実結果と商品0／正式0/3／54.50％は変えない。

**4B関連作業の開始前：** 全体現在地を全文読んだ後、[観測学習の目的・用途・前提](observation_learning/README.md#observation-learning-intent-and-assumptions)を毎回読み、最新weeklyの決定/実結果と今回の作業を結び付ける。学習・教材作成・評価・CMEE接続・環境移行で共通。ローカル＝Macと決め付けず、学習の成功と観測品質の成立を分ける。

## 1. この資料の役割と更新方法

これは全製品の現在地を一度で確認する正本である。毎回全文を読み、対象機能の詳細正本と実ファイルへ進む。過去の読了、会話の要約、検索断片だけで代用しない。repository rootの`AGENTS.md`、`00_karen_read_first.md`、work rulesの入口からここへ入り、System Contextの生成物に含まれない場合もfreshな作業ownerから直接読む。

10/24週次確認基準はCocolon Draft PR [#30](https://github.com/MassyuRed/Cocolon/pull/30) `ee2ff5f0be1fff4d61b9551eaaff937e1311de4b`、mashos-api Draft PR [#3](https://github.com/MassyuRed/mashos-api/pull/3) `666b28517ef04aba170ebffe3c86980fea4c11bd`。両方open／draft。これは議事録作成前の照合点であり、次回の最新headを固定する指示ではない。本資料の配置commitは、この変更を含むGitHub revisionから解決する。

**作業ごとに差分を確認し、変化した機能・決定・状態・残件・根拠だけを、当該作業と同じ変更単位で置換更新する。** 日付だけを全行で更新しない。無関係な機能の再監査や全資料の再生成はしない。関連差分なしは既存の作業記録／PR説明に「全体現在地差分なし」と理由を一行残す。詳細mapに構造差分があれば、そのmapも同時に更新する。

根拠は各節のownerと§9に置く。新機能・新しい状態も対応する表へ加え、古い現在地を末尾へ積み上げない。履歴はGit history、経緯は既存議事録・`07_latest_snapshot_diff.md`。`08_cycle001_current_state.md`はCycle001専用の進行ownerであり、全製品の現在地ではない。

情報が食い違う場合、Mashの最新の明示決定を優先し、仕様は各商品正本、実装は実ファイル、稼働は環境の確認事実へ戻る。矛盾と未確認を該当行へ残して解消する。旧資料・固定snapshotの`NO_EXTERNAL_GENERATIVE_AI`等を、後日の学習済AI接続方針を取り消す指示へ変換しない。未実装という理由で決定済みを未決へ戻さない。

## 2. 商品全体と、取り落としてはいけない決定

Cocolonは、本人と他者の人間情報を観測できる形として外側へ出し、自己理解・他者理解・発信を支えるサービスである。一回のEmlis応答だけで、アプリ全体の需要・商品価値を完結して評価しない。

| 中核 | 本人に返すもの | 他機能との接続 |
|---|---|---|
| EmlisAI | 人間的応答のみを表示する方針へ変更（意図的短文化・文数固定なし）。必要な一点への任意問いと本人回答による更新。観測ラインは分析へ活かす。Freeは当回入力のみ、Plusは過去本人入力も照合 | 原入力と補足を保存・再読する。生成した応答本文そのものを他coreの本人sourceにしない |
| Piece | 本人の考え・価値観の核が、他者へ単独で伝わる文章と画像 | 許可された本人source→preview→明示保存→本人履歴・公開投稿・画像共有。Q&Aは旧仕様 |
| Analysis | こころ天気の集計と、これまでの入力からの累積構造・ルートを区別。わたしマップは当時の分析を月ごとにsnapshot保存し、過去の月と現在を見比べる構想 | こころ天気、観測されたわたしマップ、期間比較、別枠のもしもルート／保存した意向 |

CMEEは三中核を支える共有生成中枢。独立した第四の商品中核ではない。共通の意味理解・日本語生成を使っても、coreごとのsource採用、何を言うか、声、保存・公開・受入れ責任を分ける。Pieceの本文やAnalysisの推定を本人の発言・事実へ逆流させない。

**学習済AIをCMEEへ接続し、既存資産を生かす方針は決定済み。** Mashは今回4B採用を確認し、リリースまでRunpodで追加学習することを明示した。Qwen3.5-4Bを共通基盤にcore別教示で育て、LoRA→学習済重みの統合/4bit変換→既存CMEEへ接続する。比較4Bまで・追加月額上限1万円・安定してアプリから使えることを保持。最終的な手持ちPC運用は可能性が高い方針だが、Windows／Macとも候補でOS・機種・購入は未確定。M4 16GBは候補情報の一つ。採用するPC/実行方式での量子化品質・速度・同時数・常時運用は未確認。移行には固定base全重み/config/tokenizer/chat template＋LoRAと設定を保持する。厳密な途中再開にはoptimizer/RNG等も必要で、現診断runnerはそれらを保存しない。学習済adapterを別環境で読む/次の学習を始めることと、同じ途中状態への再開を区別する。[今回の確保・学習・保持条件](weekly_reviews/Cocolon_Weekly_Review_20261024.md#20261025-a4500-training-and-portable-weights)。

**10/23 Mash承認：CMEE側の接続仕様・offline準備を先行する。** Mashの追加範囲への「進めていいよ」を受領し、本人明示のJOY_ASPECT不明と二行動を、新規・明示offlineの`emlis_candidate_snapshot.v2`へ限定実装した。原E02-0は四claim／unknown statement→joy対象／過去の喜びと記述present／原格4つ／OMITTED主体／te連結とconcessionを、既存作者の実本文・private保存再開まで保持する。E02-0自身は問いなしENDで、架空pendingを作らない。 最終対象146 passed／FAIL0／SKIP0、106.30秒、既存警告2。内訳はsnapshot同family70（旧35＋新35）、P1旧22、Q2/Q3 application旧54。34 subtests・反復実行・本文採取を件数へ加算しない。旧adapter1/2の全outcome fixtureは変更0。旧広範囲Q1/Q3の未分類失敗は未解消で、全suite成功とはしない。 実モデル/通常有効化は未実施。最新は[weekly L](weekly_reviews/Cocolon_Weekly_Review_20261017.md#20261023-cmee-targeted-unknown-action-v2)と[trial §9](observation_learning/trials/2026-10-23-current-four/README.md#targeted-unknown-action-v2)。旧v1のE02未対応はその版の履歴。 前回CIは共有owner identity fixtureの同期漏れで失敗。fixture1pathをAPI302d122で同期し、既存失敗検査1件は成功（広範囲CIの再実行0）。Mash承認により、[Piece P4](designs/cmee/v1/03_piece_v1c_detailed_design.md#cmee-p4-implemented)を限定実装した。原7field・6claim／5文・2関係・全選択を保持し、本文にない感情／原因／強度を補わない。既存plan／唯一作者／author-free検査とprivate serialized保存再読まで到達。対象7file339 passed／失敗・skip0（34 subtestsは上乗せしない）。出力は原文段落保持で、一般文章整形・商品品質の合格ではない。通常B8／実DB／画像／モデルは未接続。[Analysis P5](designs/cmee/v1/04_analysis_v1d_v1e_detailed_design.md#cmee-p5-implemented)も具体承認後に限定実装。原3記録の意味snapshot→同一private graphの文章・図→3段階保存再読まで到達。対象9file905成功。通常Analysis／DB／RN／実モデルは未接続で、一般文章品質の合格ではない。

**10/31構想の訂正：** わたしマップの直近28日は華恋の実装・判断で、Mashの構想ではない。全蓄積・ルート・月次当時履歴・現在との見比べを初版の完成案に戻す。100件は現コードの固定判定で性能限界の実証ではなく、Mashの許容はスペック上妥当であることが条件。11/1に現在map共通・Free月次2回/Plus12回/Premium全期間の閲覧と、プラン変更時の保存維持を採用。実装は全保存期間を一つのsource集合として再導出し、各JST月の最初の正常取得を当月版へ固定する。日次・月末exactの実行保証は未成立。保存されていない過去月を現在再分析して「当時の分析」としない。詳細は第9回§3.3。

わたしマップは性格分類ではない。場面→役割→注意・思考→行動・非行動→結果・その後を、成立する範囲で示す。守る意向、負荷、不明、不一致を添え、人格を固定しない。もしもルート／IFとSavedRouteIntentは既存の設計・残件であり、省略・廃止された構想ではない。

短い日常入力にも本人の基準が現れ得る。事実を事実として捉えることも観測であり、毎回の深読み・新発見・追加質問は必須ではない。短文を無価値とせず、相談形式だけを実際の入力分布と見なさない。単発の自然な受け取り、蓄積からの自己理解、Pieceを介した伝達、他者情報に触れる体験の繋がりで価値を検討する。実際の需要・継続価値は未実証。

## 3. 状態の読み方

| 状態軸 | この資料で区別すること |
|---|---|
| 決定・設計 | 決定済み／具体化未決／設計あり未実装／旧仕様・履歴。実装未完了は決定の取り消しではない |
| コード | 通常経路接続／条件付き接続／部分実装／旧経路／未実装。コード存在だけでは通常入口接続を意味しない |
| 検証 | 限定テスト・合成入力・CI・source照合の範囲と失敗を記載。機械成功を商品品質へ換算しない |
| 稼働 | 開発branch・配置済み版・DB適用・設定を分け、最終確認日を示す。今回未照会のliveは「最終確認記録」とする |
| 本人端末・商品 | ビルド／送信／端末導入／通常入力からの一往復／正式受入れを分ける。未確認は未確認のまま残す |

全機能表の「接続あり」は2026-10-22のsource照合であり、実端末・live・ストア・配送の今回確認を意味しない。公開APIの200／401、migration成功、test成功、TestFlight送信から商品完成へ飛躍しない。

**10/24報告会の全体管理評価：54.50％（前回53.25％、＋1.25ポイント）。** 同じ尺度でEmlis/CMEE57.50％・Piece41.25％・Analysis51.25％・基本機能/RN/公開63.75％・UI60％。増分はPiece画像/書出し25→50のみ。正式商品受入れ0/3は未変更。残45.50は管理点で、残工数や12/18達成確率ではない。公開は目標維持・高リスクとし、[第8回§9](weekly_reviews/Cocolon_Weekly_Review_20261024.md#overall-status-and-release-outlook)に算術・根拠・判断点を記録した。

## 4. 入力・Emlis・学習済AI

| 機能 | 現在の仕様・コード | 稼働・確認・残件 |
|---|---|---|
| 通常感情入力 | 思考・解釈`memo`と、出来事・行動・結果`memo_action`を分けて保存。RNはどちらかの本文＋感情選択＋カテゴリ1件以上が送信条件。APIの旧空memo受理とは別 | 原入力保存成功とEmlis本文成功を分ける。保存・履歴・通知・集計への既存接続あり。通常経路の全端末・全失敗復旧は未確認 |
| 感情・強さ | 喜び／悲しみ／怒り／不安／平穏と弱中強。自己理解は排他的な特別タグで、強さUIなし・wireはmedium | 自己理解を通常感情の分布・感情通知へ混ぜない。時刻・カテゴリ・所有者とともに扱う |
| 入力draft・履歴 | 本人別local draftと期限、検索・秘匿・削除、保存済み入力への再入場のコードあり | 回答draft・全中断復帰まで一括保証しない。削除・所有者切替・期限切れ後の派生物利用を別条件として扱う |
| Emlis初回 | 旧保存profileの二段を維持。新private natural_reply.v1は本人宛応答/通常入力/SQL保存/DTO/RNへsource接続。文数固定なし・分析NOT_GENERATED・旧意味/問い保持 | §21の実HTTPS→隔離Q3保存2件・GET4回/start2回を保持。最新§30は新2組4更新/保存freshreload/34EOS完了、否定反転再発・因果補完等で6e1c不採用。§30時点の否定対照診断4生成案は未実行。最新配分は11/1機構準備、11/2〜11/6サーバー側品質改善（§31）。API744336c0配置/RN6701内部配布済み。実Auth→固定4B→実DB FINAL保存1件→本人同本文再読を§37で確認。本人回答/訂正の材料化sourceは接続済みだが新観測材料生成そのものは未完。PRODUCT_NOT_CLEAR/正式0/3/candidate_ready=false |
| Emlis任意問い・回答更新 | 問いは実装済み。Free／Plusはthread全体0..1、Premiumは本人続行により逐次0..3。skip・終了・訂正・撤回・再読あり。原入力と補足を別sourceとして束縛 | 問いを出さないENDだけで十分理解したとは判断しない。回答は新規感情入力件数や国家eventへ加算しない。一般入力・回答後本文・本人実機一往復の品質が残る |
| Emlis有料拡張 | Free当回のみ。新naturalは全閲覧権利内の本人原入力/回答/訂正からn-gram関連候補をPlus3/Premium6選択し保存guardを固定。新RPCは実DB適用済み。Plus365日権利は維持 | 合成provider/実SQLで検索・保存・失効境界を確認。実4Bの意味ある履歴応答と本人端末は未完。Premium等の販売延期は未採用案 |
| 配置と本人確認 | 最新APIba0de502/dep-dbjckv5g1s2s73fc6uegは14:16:37 JST Live、read_only設定変更なし。main/autoDeploy OFF維持。最新RN3a8660ba/7001はApple処理通過・内部配布済み | Emlis初回の実Auth→固定4B→DB保存→本人同本文再読は6701/§37で確認、応答popupは6801で本人確認済み。6901の余白位置はMashが問題なしと確認。Piece preview422/生成未完成と§39の表示修復を区別。常時提供/一般品質/追加応答/正式受入れは残る |
| 27B旧試験（選定除外） | 10/23 Mash決定で27Bを候補から除外。`Qwen3.8-27B-Q4_K_M.gguf`の試験は履歴として保持。10/21、架空相談2題×実演あり／なし×初回／回答後＝8出力の推論試験 | 追加情報の取込みは見られたが、未確認な意味の補完、近い問いの再提示、更新記録の欠落が残る。実演ありの一貫した優位未確認。重みの追加学習0、27BのCMEE統合0、他core適性未検証、製品採用未確定。Pod停止はMash報告受領済み |
| 観測教材 | 6回の対話から[候補18件・教示5参照](observation_learning/training/2026-10-23-pilot-prep/README.md)を整形。Mash逐語10（問い9＋訂正後観測1）／華恋編集4／架空補充4を区別。第7回は利用場面後付けの不備を認め取り下げ、学習・再開先から除外。自然な完成受け取り・通した修正実演・Piece／Analysis教師と独立評価は不足。10/27に基本相談式・短い実入力式の難しい例はMash・分析向けも時々という収集分担を決定し、[OBS-20261027-001のD00](observation_learning/sessions/2026/OBS-20261027-001/01_dialogue.md#d00)と質問前設定を保持し、D11まで採録。Mash観測文と、本人の感想の撤回／保持の見極めについての教示を保存。観測会終了は未指示。学習／評価への投入は未実施 | [Free9教師・比較6入力](observation_learning/training/2026-10-24-emlis-free-pilot/README.md)でMashのA40にて初回9step完了。初回adapterは未回収だが、同設定の別runと保存adapter再load／9教師適合診断は完了し、重み入りarchive全33fileとchecksumを照合。加重NLL1.81506→1.65714、全9件低下・生成8/9変化。ただし教えた事例にも未返信・約束・訂正後の喜びの理由の補完が残り観測品質は未合格。初回重みの復元とは扱わない。[受領結果](observation_learning/trials/2026-10-24-qwen9b-free-lora/recreated-run/README.md)。JSON-onlyのない旧promptと解析失敗は試験側の不整合も区別。最新結果は[4B・9B受領比較](observation_learning/trials/2026-10-24-qwen4b-9b-comparison/README.md)。MashのA40で4B／9B各6回答、計12回答が完走し受領原本と固定sourceを照合済み。JSON全件成功・打切りなしだが意味品質は両方未合格。9Bの品質優位は見られず、比較時点では4B候補保持を華恋が推奨。その後、本報告会でMashが4Bに確定した。4Bは不明保持・補足／椅子訂正で相対的に忠実だが、開店の距離方向を反転し、Piece根拠・Analysis結果を創作する。9Bにも感情理由補完・別記録への誤edgeが残る。PyTorch peak allocatedは4B8.737／9B17.814GiB、単独速度は出力量依存。本番提供原価・680／1,480円での採算は未測定。既存9教師は全件Emlisで、開店方向と自然な受け取りを既に教える一方、Piece／Analysis完成例は0。[固定提供案の原価試算](observation_learning/model_selection/2026-10-24-production-economics/README.md)は完了。基準案95,094円/月は予算外で不採用推奨、最適化構成や本番原価の実証は未成立。10/24の4B確定は10/25に撤回済み。[CM-01/T1 actual](designs/cmee/v1/01_shared_kernel_and_runtime_contracts.md#cmee-4b-model-proposal-implemented)はMash承認後にAPI02c0b943へ実装。新private意味／自然本文／実問い／保存再開とasync注入境界はCPU検証済み。新4Bpackは実native2診断教師・旧7件未対応、学習外EFREE6 proxy、runner／診断／退避／raw consumerを実装。初版の実tokenizer最大7856 tokens、CPU指示修復版は最大7955/生成枠8126、context8192/max_new2048を維持。旧完成JSONの単純wrapは採用不可で、旧9教材は不変。実4Bの一回診断は承認後に完了。2教師/1周/2update・保存adapter非学習reload・前後16生成・24GB完走を確認し、最終重みを回収照合して試験Podを削除した。16GBは未試験。実rawのCMEE採用/本文は前後とも0/2で、NLL低下を品質成功へ換算しない。旧9Bの1／4／16周は再開せず、追加試行・商品価格／quota変更0。 10/25の最新新入力32更新では意味2/2・本文1/2へ進展。指示追加候補は意味1/2・本文0/2で退け、学習時入力へ戻した。局所診断後のLR1e-5候補は不採用だが、LRだけ5e-5へ変えた4更新で既知FIT意味/本文2/2へ到達し、実モデル2callのoffline一往復も成立。現在の詳細は冒頭とweekly§37を優先し、§33は履歴。新しい観測会をMashへ依頼せず、全文比較と記録は華恋が担う。原18候補・教示5参照・9教師・旧評価・受領重みを増量／改変しない |

**10/31・旧CMEE学習方式の現物確認（第9回§9の履歴）：** 旧19行はBOOK／SHOP各5段の10行＋椅子6／食事3で、19種類の自然な相談ではない。題材別意味条件と5段構造・観測／受け取り／更新説明の3本文を要求する。BOOK教師にも同じ気掛かりを3欄で近く言い換える重複がある。ただし両回答後のquestion正解はnull・追加問い禁止で、本文の疑問・主体反転・長い反復は教師どおりではない。学習時は正しい前段、実生成時は誤りを含む前段を渡す。反復の単一原因は未確定。最新2件の5段生成合計は約102秒／110秒で通常30秒と差がある。本人宛応答と分析構造の生成責務を分け、通常接続内で小さく比較するのは華恋の未実装提案。既存根拠・本人境界・保存整合を保持する。詳細は第9回§9。

詳細owner：[Emlis map](current_structure/01_emlis_ai_current_structure.md)、[CMEE map](current_structure/04_cmee_current_structure.md)、[Emlis詳細設計](designs/cmee/v1/02_emlis_v1a_detailed_design.md)、[観測教材](observation_learning/README.md)。古いmap本文の「問い未実装」は後続Q3／Q4・実sourceと矛盾する旧状態であり、現在へ戻さない。

## 5. Analysis — 蓄積を本人の情報へ返す

**11/1採用・API/DB反映／7201内部配布済み（第9回§44）：** 対象は感情原入力の全保存期間と適格な本人補足。現在mapは全plan共通、月次はFree2回/Plus12回/Premium全期間を閲覧。旧28日/100件拒否/期間版を新累積と呼ばない。新source/immutable artifact/月参照/現在guard照合、選択月と現在の並列表示、根拠原入力・補足参照を実装し、local/遠隔CIを通過。月次は当月最初の成功取得を固定、過去未保存月の再分析backfillなし。一般日本語の理解は未完成、4B接続は行わない。API配置済み、iOS #72/7201はApple処理を通過し既存内部グループでテスト中。Mashが7201の依頼修正を確認。一般分析の内容品質は未確認。§44へ。

| 機能・構想 | 現在の実装・境界 | 稼働・本人確認・残件 |
|---|---|---|
| こころ天気 | 感情選択・強さ・時刻から当日／日／週／月の比率・揺らぎ・切替りを返すAPI／RNあり。日＝前日、週＝7日、月＝28日 | 既存稼働経路。原因・未来を断定しない。短いmemoでも感情記録の集計価値は別に成立し得る。今回、本人データ・実端末の再検証なし |
| 従来わたしマップ | 役割スイッチ／ルート／分かれ道／未観測領域を表示。旧builder・保存・latest／history／detail・renderer経路あり | 固定4step・汎用結果文を含む旧経路。完成目標の根拠付き観測グラフと同一視しない。V2へのglobal cutover未完了 |
| V2観測ルート | 期間内の原入力と適格補足から五種node、明示順序・無方向共起、訂正・撤回を限定対応。source adapter／compiler／realizer、immutable保存、既存API分岐、RN表示あり | 一般日本語・全段階の理解は未完成。V1-D基盤とu102〜118は指定開発配置済み。最新内容修正をAPI744336c0で配置。一般入力の内容品質・保存identity独立照合・商品受入れは残る。最新の累積/月次機構と7201確認は§44/45 |
| P5 offline意味snapshot | 原3構文familyの元7field／18保持単位から同一private graph・文章・図・3段階保存再読。API666b285、新private型6／例外2 | 対象9file905成功。Plus・補足0・比較なしに限定。通常V2／SQL／DB／RNへ未接続。原文保持とprivate図payloadであり、一般文章品質・商品受入れは別 |
| 守るもの・負荷・不明・不一致 | V2で本人明示の守る意向／現在負荷、対象付きunknown／conflictを文章・図へ接続 | 限定対応。一般的な保護・負荷理解や解釈仮説は未完成。旧v1の未実装表をV2の全未実装へ転用しない |
| 期間比較 | 隣接等長期間のルート・注記・不明範囲・不一致を比較し保存・表示。前期間なし／比較不能も区別 | 比較SQL適用済み。設定手順はMash報告で、稼働値の独立取得なし。本人の比較成功・正式受入れ未成立。改善・悪化・原因を自動判定しない |
| もしもルート／IF | 詳細設計あり、runtime未実装。現在の観測ルート＋本人が選ぶ分岐点・意向・制約→条件・負荷・未知を伴う1〜3候補を並列提示 | SELF_ONLY。health／medical、および他人の意図・反応・関係の結末を対象とするIFは対象外。最適解の順位・成功確率を付けない。生成・保存・API・RN・実機・受入れが残る |
| SavedRouteIntent | 本人がIF候補から明示保存した関心方向を残す設計あり。runtime未実装 | 観測事実、仮想候補、本人の選択を分離。選択を実行済み・達成・失敗・性格へ昇格しない |
| 最新・履歴・詳細 | 保存成果物、文章と図、期間を同じidentityで再読。認証・tier・期限・source変更を再検査するV2コードあり | 専用table適用済み。6201実機OK・6401送信は過去記録。後続10/10にAPI5c8bd8eを配置し、6501を送信し、「入力情報が少ないため、まだ分析を表示できません。」は本人表示確認済み。端末build独立照合、本文生成・保存再読・比較は未確認。latest再読とmonthly履歴は別経路 |
| Emlis補足との接続制限 | 11/1 API7bbb4661で最大3本人ANSWERをowner/ID/round束縛で受け渡すよう修正し、744336c0で配置。原入力・補足・訂正を分離しAI生成文を本人sourceにしない | 複数ANSWERの旧全体拒否は解消。合成DB/providerの局所177件とCIは成功。通常実機の全導線・一般理解は未確認。累積/月次の実装・API/DB反映と7201依頼修正の本人確認は§44/45 |

詳細owner：[Analysis map](current_structure/03_analysis_current_structure.md)、[Analysis詳細設計](designs/cmee/v1/04_analysis_v1d_v1e_detailed_design.md) §7〜11・15〜16、schema §7・9.6。10/10の不足案内API5c8bd8e/6501と本人表示は過去記録として保持。現APIは36713940/dep-dbjg0l8ae00c73e4cr20、RN製品b187b790/7201内部配布・依頼修正本人確認済み。一般入力のAnalysis内容品質は未確認。累積/月次機構・7201依頼修正の本人確認は§44/45。詳細手順は[第8回§8.5](weekly_reviews/Cocolon_Weekly_Review_20261024.md#details-analysis)。

## 6. Piece — 本人の意味を他者へ伝える

**10/31の質問と見解：** 通常Pieceは4Bを呼ばず、sourceに結び付いた有限編集。背景・文字色・配置・改行計測・画像出力に4Bは不要。核の選択・否定や留保の保持・単独文章への再構成は言語理解が必要で、4Bは候補だが必須の特定モデルではない。観測意味を共有できればPiece専用の追加推論が常に必要とは限らない。専用4B接続を一律の発売条件にしないという華恋の推奨で、Mashの質問を仕様変更の合意にしない。初期の有料価値を背景・文字色等へ置く方向と、12配色等の未採用案は分ける。

| 機能 | 現在の実装・境界 | 確認・残件 |
|---|---|---|
| 本文・visual recipe | 保存済み本人source→単独で伝わるcanonical text＋画像。現V2 source adapter／pure coreはoriginal＋normal／pre-questionのみ。refinedは別sourceのopt-in補足を使う設計だが、現コードは`source_role_or_stage_not_yet_supported`で未対応 | 旧Q&Aの存在を新商品の定義にしない。Emlis生成本文・Analysis推定の原文流用は禁止。補足をoriginalへ連結してrefined接続済みにしない |
| 一般入力への生成 | 既存CMEEの有限作者を使用。最新指示はユーザーが書いた本文だけを必要に応じて整形し、選択感情の説明文は追加しない。短い完成文も水増しせず扱う | §41でprivate selection contextを可視graphから分離、対象579成功。一般日本語全体の品質は未完成、API配置結果は§41へ |
| preview・保存 | 既存の作成/取消/明示private保存/回復。同一本文・recipe・hashとowner/枠を保持 | Mashが7001で画像生成・一覧での確認・スマホ写真フォルダへの保存成功を報告。既存保存recordは今回の文章方針修正で書換せず、新規作成へ反映 |
| V2有効化・旧経路 | 11/1 API744336c0の明示factoryでpreview/save/owner-read/export/owner-delete各strict pair ON、public-write/public-read/visibility-toggle OFFをLive確認。default app:appはlegacy/OFF | 稼働設定と本人端末の通常保存は別。tutorial/Nexus旧経路とM5の全公開経路廃止は未完 |
| 本人履歴・詳細・公開範囲 | owner一覧・詳細・公開切替・削除の既存経路。privateはownerのみ | 7001の生成済み画像と一覧は本人確認済み。同一record/hashの独立DB照合・Share送信・公開切替・削除の本人確認へ拡張しない |
| export | 本人詳細→独立export許可GET→表示artifact照合→全canvas→Photos/Share直前再確認 | 7001の実Photos保存を本人確認済み。Share送信/Android新版export/backend receipt/一般品質は未確認。端末へ出た画像は内部削除で回収できない |
| 新renderer | iOS piece.rn_bitmap_renderer.ios.v1。同一bitmap表示/書出し、構築/初回採用8秒。新sourceでは完成previewも同画像をsource期限内で保持し、読んでから保存できる。saved保持は維持 | APIはTTL600秒/同rendererでLive。6601のApple90683をAdd/Usage両keyとArchive実物検査で修正。6701はArchive/Apple処理/内部配布/本人起動済み。Pieceの本人描画・保存・再読は未完。Android成立へ拡張しない |
| 画像内ブランド | 次候補でios.v2=Emlisを実装。旧ios.v1=Cocolonは保存版どおり保持。新compiled bridgeのみ明示headerでv2を要求し、旧/欠落はv1 | §43の新build指示を受領。recipe内部ID/DB schema不変、owner/保存/bitmap保持/exportの版束縛を維持。7101をMashが反映し依頼修正完了を確認。新規v2画像はEmlis、旧v1保存画像はCocolonを保持 |
| 最新限定検証 | 新export正常8PNG＋native拒否6。JS979・新native44成功。旧195は176PASS／19FAILを保持 | CI39780623108 attempt1 completed／failure、head`d2e1244…`、10/22 JST21:42:54〜22:07:18。CI全体合格ではない。限定TECHNICAL_CREDITの記録あり、product_credit=0 |
| live・次の未完 | APIba0de502は14:16:37 JST Live/health・bootstrap200。7001で画像生成・一覧・Photos保存を本人確認。ユーザー本文限定修正はAPIのみ、新規buildなし。§41へ | 既知V4 19失敗と今回legacy canvas13reportの失敗/原因未確定を保持。Share/Android/一般日本語品質・正式商品受入れは未完 |

詳細owner：[Piece map](current_structure/02_piece_current_structure.md)、[Piece入口](../Cocolon_Piece/00_read_first.md)、[manifest](../Cocolon_Piece/manifest.json)。RN6675b4ed/6601はApple90683で配布不可だった。目的2keyとArchive検査を含むb8a43e5a/6701はApple処理を通過し、既存内部グループでテスト中・本人起動済み。7001の画像生成/一覧/OS写真保存は本人確認済み。最新は第9回§41へ。

## 7. その他の全機能・共通基盤

以下は2026-10-22に入口・RN／API sourceを照合した機能一覧。接続ありはcodeの状態。今回、live・本人端末・通知配送・実課金・実削除の成功確認はしていない。

| 機能 | 目的・現在の接続 | 未確認・境界 |
|---|---|---|
| 起動・認証 | 登録／ログイン／メール確認再送／再設定／復旧。`App.js`→`RootNavigator`→`MainTabs`→Input／Analysis／Piece／Settingsの4 Stack（次候補でRanking入口を撤去） | native認証リンク・cold／warm復帰の実成立は別確認。旧巨大App／MyModel画面名から現在を復元しない |
| 今日の問い・回答履歴 | current／answers／history／PATCH／settingsを接続。日常メモと別に考えを記録し、修正・再読 | Emlis任意問いと別機能。旧自己構造素材との接続を、V2全source採用済みへ拡張しない |
| 投稿・他者のPiece | 通常`PieceEntryScreen`→`NexusScreen`。本人／フォロー中／特定相手、並替・更新・本人投稿削除。linkPayload時のみ`PieceScreen` | 公開条件と新Piece保存成立は別。旧Q&A投稿と新canonical recordを混同しない |
| 共鳴・履歴 | submit／delete／historyと一覧・詳細あり | 自己共鳴・フォロー外制御あり。共鳴数を人間理解の正しさへ換算しない |
| 感情通知・感情ログ | feed／unread／既読、個人別受信設定、送信選択。Nexusの投稿／感情通知／おすすめ／共鳴履歴の一部 | 感情・強さ・時刻であり、メモ本文の公開ではない。実配送・通知許諾・全起動先は未確認 |
| フォロー・申請・推薦 | 作成／解除／フォロワー削除／承認／拒否／取消／おすすめを接続 | 非公開account・推薦除外・公開範囲を保持。見つけることと閲覧許可は別 |
| アカウント・ID検索 | 自他profile・活動情報・表示名・共有コード、非公開設定、推薦／ランキング可視性 | 共有ID公開、推薦、ランキング、非公開を別設定とする。公開profile APIと認証本人APIを分ける |
| 共有URL・native／Web入口 | 共有profile URL→公開API→Accountに加え、11/1にiOS cocolon scheme/URL転送とvisibility HTTP失敗時502を実装 | API配置/RN Upload済み。本人認証復帰、HTTPS universal linkのdomain entitlement/Web補助は残件。実漏出を観測したという意味ではない |
| ランキング・感情集計 | §43の次RN候補でRankingタブ/stack入口/表示設定/guideを撤去。保存データ・APIは削除しない。Pieceの全体感情集計は別経路として維持 | 7101で依頼UI修正完了を本人確認。全体感情TOP3はアプリ内集計で、社会全体の代表値ではない |
| 通知・未読 | push token同期、未読状態、問い・report・感情更新から対応画面へ戻るrouting | token登録と配送成功を分ける。ログアウト／account切替時の本人境界、全cold／warm動作は別確認 |
| アプリ設定・購読 | theme、全体／個別通知、プラン購入・復元・管理、entitlement。11/1にfinish両失敗の伝播/同一購入の結果共有とowner世代ごとの旧応答遮断を修正 | RN6701内部配布・本人起動済み。実storeのfinish／失効／account切替／復元・release判定は残る。料金表示だけで有料品質成立としない |
| ガイド・tutorial・お知らせ | ガイド、再体験、tutorial flow、notice current／history／read | mock体験は通常実経路の成功証拠ではない。tutorialを全体価値・入力の悩みの唯一の解決としない |
| ログアウト・退会 | feature flag・二段確認・`/account/delete`後local cleanup／signOutのコードあり | 実データ全削除完了は未確認。元情報と派生物、内部保存と外部画像の境界を分ける |
| ProfileCreate旧資産 | `ProfileCreateScreen.js`・`api_profile_create.py`は現存 | fresh Root＋5 Stackに通常route／importを確認できず。通常入口接続済みへ昇格しない |
| 国家システム・非同期処理 | 原入力保存・event dispatch、分析素材／queue、通知・集計・保持期限、API／DB／認証・公開governanceが各ownerを持つ | 原入力の保存を生成成功に従属させない。Emlis補足・続行を入力件数／課金eventへ再加算しない。queue・job・retryの存在をlive稼働／全処理成功へ換算しない |
| 生成基盤・開発運用 | APIのCMEE EngineにEmlis thread／Piece／Analysis consumer分岐あり。既存共有text core・生成guard・contract・tests、RN build／CIは支援基盤 | 固定snapshot／旧禁止条項はその時点の範囲。学習済AIはprivate注入境界・保存rawのconsumerを実装済み。受け取りloss4更新/LR比較後の既知FITは意味/本文2/2。実モデル2callのoffline一往復（actual prior、問い1、訂正3更新、END）まで成立。Engineのcold file再開2/2、承認済みoffline180秒/通常30秒を実装。実4Bのfresh ID02で初回/訂正後service・隔離SQL保存、意味保存後中断/明示再開、保存済み非生成再読まで成立。さらに4題材6教材の合成nativeをprivate版3へ接続し、隔離SQL6状態の同snapshot再開/保存非生成再読までCPU確認。当該CPU確認での実4B生成は0。本人端末/一般言語品質は未成立。稼働設定・秘密値・DB実値・端末は原本sourceから推測しない |
| System Context | 実装正本はPR37、商品原本はPR30/API PR3の別checkout。旧CLI/追跡読順を正規routeへ同期し、全機能原本・最新weekly・観測教材・三core現物を選択対象へ追加、seed期待の不一致を修復 | 最新cacheは未生成。固定環境doctor34項目/関連CIは成功したが、API Python索引1874対象が1200秒/1800秒ともtimeout。2回目は処理中のPR30費用案更新により終了時head確認も不一致。失敗・原本との差を[PR37](https://github.com/MassyuRed/Cocolon/pull/37)へ記録し、同じ時間延長だけの再試行を停止。tracked currentは8月snapshotで使用不可。fresh原本の直接読取を使い、最新索引完成とは扱わない |

共通状態として、未入力／不足、保存中／保存失敗、本文生成失敗、回答待ち／skip／終了／訂正／撤回、履歴なし／期限切れ／source失効、未認証／owner不一致／プラン不足、非公開／公開／削除、未読／既読、課金保留／有効／失効／復元を区別する。具体的挙動は該当contract・実ownerで確認し、この列挙を全状態遷移の実機合格証にしない。

## 8. プランと、次作業を選ぶときの現在地

**以下の表は既存表示・権利・コードの状態で、10/31の構想を上書きする確定新プランではない。** Free当回のみ／Plus過去本人入力も照合は維持。旧表のFreeマップ履歴不可・Plus1年等を、新しい累積／月次構想へ無検討で適用しない。11/1採用：現在mapの内容と対象は全plan共通。月次閲覧はFree2回／Plus12回／Premium全期間、プラン変更だけで保存済みmapは削除しない。料金は最新指示でPlus680円／Premium1,480円に確定し、表示設定とfallbackへ反映（§15、実ストアは未確認）。Free／Plus販売2区分、AI月30／100、Piece新規生成5／30、配色12等は華恋案で未採用・未変更。入力保存・既存成果物再読をAI枠へ従属させず、累積構造を枠で切り捨てない。

| プラン | 仕様・表示上の体験 | 成立状況の限界 |
|---|---|---|
| Free | 当回Emlisと任意1問、全期間を対象にした共通の現在map、月次map直近2回閲覧、Piece月5、入力等の一般履歴は当月＋前月 | code・表示と、自然な本人理解の品質は別 |
| Plus | 適格本人履歴を用いたEmlis、こころ天気の文章／理由、共通の現在map・月次map直近12回閲覧、Piece月30 | 履歴参照と有料差の体感は同義ではない |
| Premium | 修正できるframeと本人続行の最大3問、長期weather・共通の現在mapと月次map全期間、一般履歴／Piece無制限、設計上のIF・Saved | IF／Saved未実装。旧period版のlight／standard／deepと、新累積map共通の採用方針を混同しない |

10/31最新：Mashの明示指示でPlus月680円／Premium月1,480円へ変更。RNのcatalog・選択画面・account料金helperとAPI fallbackを同期し、Supabase `subscription_plan_catalog`の`price_label`／`note_lines_json`を対象2行だけ更新・独立再読した。料金・案内と`updated_at`以外のDB列は不変。既存APIはPlus／Premiumの`note_lines`を公開時に空にするため、DB案内の更新を画面表示成功とは扱わない。実ストア請求額・税込区分、本人端末表示は未確認。11/1に公開`/subscription/bootstrap`200で680/1480円を直接確認し、RN6601をUploadしたがApple90683となり、修正後の6701で内部配布/本人起動を確認した。10/23時点の月300円／980円は変更前の記録。Pieceの5/30/無制限は保存数で、新AI生成数の上限ではない。Emlisの1/3問もthread単位であり、月間生成費を制限しない。

**10/23 Mash決定：Plus980円／Premium1,980円が価格の上限（これでも高い）、27Bは候補外。10/24は680円／1,480円を価格候補として検討する。980／1,980は9Bの損益分岐価格ではなく、独自LoRA版の本番原価は未測定。** 旧1,980/3,980円の推奨と27B再試験案を撤回。[小型AI再選定・全core原価](observation_learning/model_selection/2026-10-22-three-core/2026-10-23-small-model-reselection.md)では、Mashの残高利用希望により、Qwen3.5-9BのM1をMashがRunpod A40で実行し、4件の受領原本と全本文を照合済み。画面上のGPU単価は$0.59/h、起動前残高$5.15。受領原本のvLLM0.32.0／BF16／非thinking／context8192／温度0で、要求90.607秒・4805token。インストール・読込・待機を含むGPU総時間・総消費は未確認。Stop完了はMash報告を受領済みで、管理画面の独立確認はしていない。DeepInfra既製APIは比較資料へ残し、Qwen3.5-4Bは当時の別候補から、10/24のMash決定で一度確定した後、10/25に撤回された。10/23の旧比較では980/1,980円を基準とし、Free30/Plus100/Premium150セッション等の利用量でも、以前のDeepInfra既製APIを仮定した月原価は約5.57/37.07/147.28円で、Runpod自己hostの原価ではない。無料者・固定基盤・税相当留保・ストア費を含めて計算した。これらは利用量感度で、商品quota変更・採用・品質合格ではない。独自追加学習版の配備に公開API単価を流用せず、育成費・学習後のhost費用は別確認。旧費用資料は履歴として参照する。

今週10/31〜11/7の実行配分は第9回§11.4/§31の11/1訂正版。**11/1（日）はリリース機構・配置/配布・運用・初回の実機接続。11/2（月）〜11/6（金）は華恋がGPU/サーバー側で品質改善し、MashのPC操作・RNビルド・各候補の端末確認を前提にしない。** 初回接続→端末操作なしの品質反復→最終候補反映後の最終接続に分ける。品質以外を先に整え、公開日まで育てた品質を出せる候補を維持する。11/7は実績/残件と品質結果・候補・費用を報告し、最終接続日へ勝手に固定しない。全8タスクとPiece/Analysis/共通3欠陥・両OS・原価の残件を引き継ぐ。旧11/3/5/6の平日実機日程と前版の一律品質停止は適用しない。過去の閉鎖run・不採用は保持し、同じ比較を予定日を理由に再実行しない。

| 作業領域 | 次に解消すべき具体的未完了 |
|---|---|
| 本人宛応答の通常接続 | RN6701内部配布/本人起動後、実Auth→専用Bearer付き固定4B→実DB FINAL1→本人同本文再読を確認。CALL_STARTEDは再読後も1、active0。modelは停止し、保存readerを維持。初回配線完了を品質合格へ換算しない。11/2〜11/6はサーバー側品質改善、候補ごとのRN build不要。§37へ |
| 学習済みAI・CMEE接続 | §30は4更新/保存reload/34生成後も6e1c不採用、旧重み保全を保持。11/1は機構準備、11/2〜11/6は華恋がGPU/サーバー側で品質比較・必要な学習・自由生成・候補保存を行う。前版の無期限保留は撤回し、§30末尾の新4生成は未実行の診断案として保持、閉鎖runを再開しない。提供toolは未指定時fit38固定、明示adapter SHA対指定に対応。最大18要求1800秒probeで、選んだ候補のサーバー側反映と本番提供は準備対象。API/保存/表示契約を保つ更新はRN再ビルド不要。最終候補だけ通常提供へ反映し最後に接続確認する。最新の次着手は§45の分析4B接続準備で、GPUは最小CPU準備後の実出力確認時に用意する |
| 10/24までの費用・4B選定履歴（当時の構成） | Flex24GBの旧月78,980生成・未測定の速度/起動仮定による運用費95,094円・赤字67,833円の試算は当時の構成の記録で、最新構成の原価ではない。[全仮定・再計算](observation_learning/model_selection/2026-10-24-production-economics/README.md)。旧4B実診断では24GBでLoRA保存・reload・16生成・回収を確認したが、FITは前後0/2。CPU指示修復API1dabc4fは54対象/pack11・合成2/2で、修正版は後続10/25にA4500 20GBで完走・回収済み、最新結果は§24。旧学習peak allocated14.954GiBを本番推論の必要VRAMへ流用しない。4bit/M4を第一候補とした§23は当時の華恋案で、現在の移行先はWindows／Mac未選定。公開API単価を独自育成版の原価へ流用しない。 |
| Emlis | 一般入力と回答後の意味・自然な本文・有料差、本人実機の保存再読まで。API744336c0配置と通常本人確認を分ける |
| Analysis | API744336c0に内容修正/最大3ANSWER対応を配置。§44で全期間累積・月次当時保存・寿命・月選択/現在比較・2/12/全閲覧を実装、API36713940/DB反映・CI成功。RNb187b790のiOS #72/7201を内部配布済み。一般理解の品質、IF/Savedは別残件。7201の依頼修正は本人確認済み。旧6501の不足案内表示は本人確認済みとして保持 |
| Piece | API private5ON/public3OFFはLive。6601のApple90683は6701で解消、内部配布/本人起動済み。7001の画像生成・一覧・Photosは本人確認済み。Share/Android/backend receipt/公開/実課金と一般文章品質は残る。§41/43/45へ |
| 全体・release | 自他所有／公開／削除、認証復帰、finish失敗の成功扱い・account切替後旧応答・公開visibility取得失敗時default、共有URL入口、通知配送等の通常実機経路と未受入れ品質 |

この表は新しい作業の自動開始・GPU再起動・merge／deploy／公開の指示ではない。Mashの現行タスクを進め、対象の詳細ownerから具体的な一手を選ぶ。文書更新は商品品質の改善creditに数えない。

## 9. 根拠・確認範囲

2026-10-22：全体・入力／Emlis／CMEE・Analysis・Piece・RN周辺機能・必読導線を分担照合し、この資料へ統合した。全repositoryの全blob再監査、live／DB／端末／storeの新規検証は行っていない。根拠を以下へ戻せる状態にしておく。

| 範囲 | 詳細原本・現物 |
|---|---|
| 全体構想・設計 | `cocolon_thought_material_for_karen.md`、`01_cocolon_overall_structure.md`と分冊01A／01B／01C、`02_cocolon_national_system.md`、`current_structure/00_three_core_and_cmee_read_first.md`と01〜04 |
| 最新判断・配置記録 | [第9回・10/31〜11/7](weekly_reviews/Cocolon_Weekly_Review_20261031.md)が最新の方針整理・開催中の報告会。[第8回・10/24〜10/31](weekly_reviews/Cocolon_Weekly_Review_20261024.md)は終了記録・実行履歴。方針・承認・配置の原記録は`weekly_reviews/Cocolon_Weekly_Review_20261017.md`（10/20観測学習、最新AL等）とAPI `ai/docs/EMLIS_DEPLOYMENT_AND_OPERATION_CHECKS.md`へ戻る。会議記録は仕様・実装事実の代用ではない |
| Emlis・CMEE実物 | API `cocolon_meaning_experience_engine/engine.py`、`emlis_thread_service.py`とthread source／question／answer_update／surface、RN `InputScreen`・`useEmlisThread`・`EmlisThreadModal`。API path prefixは`ai/services/ai_inference/` |
| AI試験 | `observation_learning/trials/2026-10-21-qwen27-demo/README.md`と8出力JSON。`fine_tuning_performed=false`、`cmee_integration_performed=false` |
| Analysis実物 | API `astor_material_snapshots.py`、`analysis_observed_service.py`、`watashi_map_service.py`、`kokoro_weather_service.py`、RN `WatashiMapV2Renderer`・access policy。設計04 §10 IF／§11 Saved、schema05 §7・9.6 |
| Piece実物 | PieceOwnerHistoryScreen、pieceExport、PieceExportCanvas、pieceRenderer、InputPieceActionArea。詳細入口/manifestと第9回§32〜34、Live dep-dbj853ou01pc73enjrt0/API744336c0、RN6675b4ed/run41254631100 |
| 周辺機能実物 | RootNavigator・MainTabsと5 Stack、Input／AnalysisHistory／TodayQuestionHistory／Nexus／Account／Ranking／Settings各screen、`lib/nexusApi`・home/account API transport、対応APIとaccess policy。`lib/iap/iapService.js` L432〜445・527〜531、`SubscriptionContext.js` L165〜234、API `api_public_profile.py` L81〜108、`navigation/linkingRuntime.js` |
| 作業導線 | repository root `AGENTS.md`、観測学習README、work rules00／CURRENT_RULES R2／09／99・manifest、System Context00・task_profiles。元の必読incident・品質規則は継続 |

比較案作成時の追加照合点はCocolon `5d14a293…`／API `a536e50…`。Piece sourceのrefined未対応とAnalysis pureの補足上限を実物で再確認し、上記の設計／実装区分を明確化した。その他の機能を新規再検証した意味ではない。

次回はfresh headと変更pathを比較し、関係する根拠だけを再確認する。確認していない機能の検証日を更新せず、この一枚を「毎回全体を読む」入口として保つ。

10/23今回Piece差分は、正本APIの同一2blob同期/原CI39864098163、既存Render稼働不変、最新TestFlight成功run/source/Upload stepと現RNの配布差、固定candidate refを照合したもの。API source2path/正本の限定CI1/配布候補branch1、今回Render/DB/本人row/署名build/TestFlight送信0。別集計として候補branch既存phase6自動検査1成功、最初のdocs反映4571の既存自動検査5件は3成功/2失敗。System Context2件は変更していないseed期待[8,5]と現profile[1,8,5]の不一致、各225 PASS/1 FAILで当時未修復（本System Context更新でseed期待を修復）。原log・区別は入口§119.5/manifestに記録し、再試行0/最終docs補正は[skip ci]。他機能の品質・本人端末を再検証した意味ではない。

10/23 System Context更新：全tracked pathと全体設計・全file地図・current maps・最新weekly・全機能原本・対象sourceを照合。旧inventoryとの差はCocolon追加168/API追加328、削除各0（照合head bef22ae…/3084c99e…）。全blobの意味読了ではない。正規実装はPR37の固定環境・material分離・cache方式であり、商品側入口を同期した。学習済AI方針・問い実装・Analysis IF/Saved・Piece API/RNの区別は既存正本どおり保持。今回の差分はSystem Contextのみ、他機能の稼働/本人端末/商品品質再検証は行っていない。実再生成は固定環境doctor34項目を通過したが、Python1874対象が20分/30分ともtimeoutで最新cache未生成。2回目は処理中の費用案更新で商品headも進み、終了時head確認が失敗した。資料・参照・読取導線の更新と索引の未完了を区別し、同じ時間延長だけの追加試行は停止。fresh原本を直接読み、診断・次の再開条件はPR37から解決する。STRUCTURE_MAP_DELTA_NONE（商品source/接続変更なし）。

10/23費用差分：上記固定headのsourceと27B原本、現行プラン表示設定、公式GPU・基盤・ストア手数料を照合。全体原価を仮定付き172条件で計算し、料金・生成枠と4場面の実行予算を提案した。今回DBはプラン設定のread-onlyのみ、本人入力取得／変更0、GPU／有料推論／チャージ／price/quota変更0。STRUCTURE_MAP_DELTA_NONE（接続実装・商品contract差分なし）、product_credit=0。

10/23 M1実行前の再選定差分：Mashの価格上限・27B除外を受領し、高価格案を撤回。Qwen9B公開API単価・公開重み・非thinking・データ方針と4B追加学習手段を公式原典から確認し、全三中核の仮tokenで再計算した。既製API原価と独自育成版を分離。価格/商品quota/モデル採用/本統合/有料実行の実変更0。STRUCTURE_MAP_DELTA_NONE、ADMINISTRATIVE_ONLY、product_credit=0。

10/23 M1実行前の接続準備差分：固定4fixture・source84blobのC0実結果を再利用し、Mash承認の先行offline準備と並行9B比較について、作業順・変更owner・成果・完了条件・予算・新セッションの最初の1作業を最新議事録へ具体化した。今回の変更は既存5文書のみ。後続のMashの指摘を受け、先行準備はCMEE内部の仕様・材料整理と固定仮データ確認で、実モデル接続を含まないと明確化した。P1実装・stub実行・新規C0・外部9B推論・費用・本人DB・production実装／契約／稼働変更0。STRUCTURE_MAP_DELTA_NONE（作業計画・再開導線のみ）。先の限定TECHNICAL_CREDITはoffline束縛／C0出力だけ、今回ADMINISTRATIVE_ONLY、product_credit=0、実モデル比較未完了。

10/23内部準備の最新差分：Mashの追加範囲への「進めていいよ」を受領し、本人明示のJOY_ASPECT不明と二行動を、新規・明示offlineの`emlis_candidate_snapshot.v2`へ限定実装した。原E02-0は四claim／unknown statement→joy対象／過去の喜びと記述present／原格4つ／OMITTED主体／te連結とconcessionを、既存作者の実本文・private保存再開まで保持する。E02-0自身は問いなしENDで、架空pendingを作らない。 今回は既存production10（作者/共有型/独立readerを含む）、新fixture1、同family test拡張。全pathは01A、型は設計05、全実出力/失敗/制限はtrial JSON.targeted_unknown_action_v2。原E02の有限文法と既受理event/feelingの併存に閉じる。一般unknown/ACTION、新要素自身の変更・解消・依存削除はHOLD/UNSUPPORTED。旧Q2 cap4では混在更新の5 contributionを提供できず意味保存後BODY_UNAVAILABLEとなる制限を残し、capを緩めない。現在のQ3実serviceでの隔離SQL/RPC保存・中断再開成功と区別する。実モデル／有料推論／重み／学習／本人DB／Render／通常application有効化／公開API・DTO・RN変更／merge／deployは0。限定TECHNICAL_CREDIT、STRUCTURE_MAP_DELTA_PRESENT、product_credit=0／PRODUCT_NOT_CLEAR／正式Product Read0/3／candidate_ready=false／automatic_progression=false。


10/23 P5内部準備の最新差分：Mashがbe37f40dの具体案へ承認後、[API666b285](https://github.com/MassyuRed/mashos-api/commit/666b28517ef04aba170ebffe3c86980fea4c11bd)の新Analysis admission／Engine／既存compiler・唯一realizer＋新test／fixtureの6fileへ実装。原18保持単位（16node＋従属scope1＋負荷注記1）／11文group／8source scope／route edge0／材料unknown1／選択4を保持する。同じsnapshot／graphから原文11文＋限定unknown表示とprivate図payloadを作り、意味／graph／完成の隔離file再読、実作者例外からの同snapshot再開、完成済み取得・再採用・compiler・作者禁止再読を確認。対象9file905成功／FAIL0／SKIP0、110.62秒、12058subtestsは加算しない、既存warning1。新private型6／例外2、旧logical registry不変。全実state／文章／図／source blob・途中失敗はtrialの新analysis_semantic_snapshot_results.json、actual仕様04／型05、最新weekly P／trial§13。原3構文family・Plus・補足0・比較なしだけで、一般日本語／商品文章／RN描画／実Auth／自動durabilityは未合格。API全6fileの全文／blob／変更集合／head読戻し済み。STRUCTURE_MAP_DELTA_PRESENT、限定TECHNICAL_CREDIT、商品0／正式0/3／PRODUCT_NOT_CLEAR／candidate_ready=false／automatic_progression=false。実モデル／課金／実DB／Render／通常application／公開API／DTO／RN／merge／deploy変更0。



10/25 全体選定差分：Mashの全体判断指示を受け、全機能原本・全体設計/全file地図の既確認導線・最新weekly・実4B raw/教師・関連会話検索と公式MLX/量子化資料を照合。会話検索を全セッション全文読了とは扱わない。選定責任は華恋、旧4BのMash確定を復活させたという記録にはしない。文書4fileのみ、商品source/API/DB/Render/Supabase/教材/重み不変、STRUCTURE_MAP_DELTA_NONE、ADMINISTRATIVE_ONLY、product_credit=0。正式0/3・54.50％据置。






