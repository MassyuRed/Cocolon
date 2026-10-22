# Cocolon 最新情報 — 全機能・全状態

更新日：2026-10-23 JST（今回の差分はPieceのみ）。全Cocolon作業の必読原本。仕様相談、観測会、AI選定、実装、監査、文書更新も対象。

## 1. この資料の役割と更新方法

これは全製品の現在地を一度で確認する正本である。毎回全文を読み、対象機能の詳細正本と実ファイルへ進む。過去の読了、会話の要約、検索断片だけで代用しない。repository rootの`AGENTS.md`、`00_karen_read_first.md`、work rulesの入口からここへ入り、System Contextの生成物に含まれない場合もfreshな作業ownerから直接読む。

現時点の確認基準はCocolon Draft PR [#30](https://github.com/MassyuRed/Cocolon/pull/30) `818d428d2f5905db7a365ee678cdb232f3c14720`、mashos-api Draft PR [#3](https://github.com/MassyuRed/mashos-api/pull/3) `a536e50ee284785f585ac73329ef2947dca8bba9`。両方open／draft。これは今回の照合点であり、次回の最新headを固定する指示ではない。本資料の配置commitは、この変更を含むGitHub revisionから解決する。

**作業ごとに差分を確認し、変化した機能・決定・状態・残件・根拠だけを、当該作業と同じ変更単位で置換更新する。** 日付だけを全行で更新しない。無関係な機能の再監査や全資料の再生成はしない。関連差分なしは既存の作業記録／PR説明に「全体現在地差分なし」と理由を一行残す。詳細mapに構造差分があれば、そのmapも同時に更新する。

根拠は各節のownerと§9に置く。新機能・新しい状態も対応する表へ加え、古い現在地を末尾へ積み上げない。履歴はGit history、経緯は既存議事録・`07_latest_snapshot_diff.md`。`08_cycle001_current_state.md`はCycle001専用の進行ownerであり、全製品の現在地ではない。

情報が食い違う場合、Mashの最新の明示決定を優先し、仕様は各商品正本、実装は実ファイル、稼働は環境の確認事実へ戻る。矛盾と未確認を該当行へ残して解消する。旧資料・固定snapshotの`NO_EXTERNAL_GENERATIVE_AI`等を、後日の学習済AI接続方針を取り消す指示へ変換しない。未実装という理由で決定済みを未決へ戻さない。

## 2. 商品全体と、取り落としてはいけない決定

Cocolonは、本人と他者の人間情報を観測できる形として外側へ出し、自己理解・他者理解・発信を支えるサービスである。一回のEmlis応答だけで、アプリ全体の需要・商品価値を完結して評価しない。

| 中核 | 本人に返すもの | 他機能との接続 |
|---|---|---|
| EmlisAI | 今回の入力を読んだ観測、人間的な受け取り、必要な一点への任意問い、本人回答に基づく読みの更新 | 原入力と補足を保存・再読する。生成した応答本文そのものを他coreの本人sourceにしない |
| Piece | 本人の考え・価値観の核が、他者へ単独で伝わる文章と画像 | 許可された本人source→preview→明示保存→本人履歴・公開投稿・画像共有。Q&Aは旧仕様 |
| Analysis | 蓄積記録から感情状態、場面・役割・選択・行動の構造、期間による記録上の違いを文章と図で返す | こころ天気、観測されたわたしマップ、期間比較、別枠のもしもルート／保存した意向 |

CMEEは三中核を支える共有生成中枢。独立した第四の商品中核ではない。共通の意味理解・日本語生成を使っても、coreごとのsource採用、何を言うか、声、保存・公開・受入れ責任を分ける。Pieceの本文やAnalysisの推定を本人の発言・事実へ逆流させない。

**学習済AIをCMEEへ接続し、既存資産を生かす方針は決定済み。** 学習済みの言語能力を土台に、Mashの観測・問い・回答後の修正を教材として観測技術を育てる。適用・評価対象はEmlisだけでなくPiece・Analysisを含む全体。採用モデル、各coreでモデルへ担わせる具体的責務・入出力、学習方法、配置・費用・速度は未決で、接続実装は未実施である。

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

## 4. 入力・Emlis・学習済AI

| 機能 | 現在の仕様・コード | 稼働・確認・残件 |
|---|---|---|
| 通常感情入力 | 思考・解釈`memo`と、出来事・行動・結果`memo_action`を分けて保存。RNはどちらかの本文＋感情選択＋カテゴリ1件以上が送信条件。APIの旧空memo受理とは別 | 原入力保存成功とEmlis本文成功を分ける。保存・履歴・通知・集計への既存接続あり。通常経路の全端末・全失敗復旧は未確認 |
| 感情・強さ | 喜び／悲しみ／怒り／不安／平穏と弱中強。自己理解は排他的な特別タグで、強さUIなし・wireはmedium | 自己理解を通常感情の分布・感情通知へ混ぜない。時刻・カテゴリ・所有者とともに扱う |
| 入力draft・履歴 | 本人別local draftと期限、検索・秘匿・削除、保存済み入力への再入場のコードあり | 回答draft・全中断復帰まで一括保証しない。削除・所有者切替・期限切れ後の派生物利用を別条件として扱う |
| Emlis初回 | 観測と「Emlisから」の受け取り。Layer1は根拠を外さず、Layer2が人間的な受け取りを担う。比率1:9〜4:6は内容に応じた方針で、文字数割当ではない | 生成・保存・API・RN接続あり。有限表現、主体・時点の誤認、原文反復、薄い／定型的受け取りが残る。商品`PRODUCT_NOT_CLEAR`、正式Product Read未成立、`candidate_ready=false` |
| Emlis任意問い・回答更新 | 問いは実装済み。Free／Plusはthread全体0..1、Premiumは本人続行により逐次0..3。skip・終了・訂正・撤回・再読あり。原入力と補足を別sourceとして束縛 | 問いを出さないENDだけで十分理解したとは判断しない。回答は新規感情入力件数や国家eventへ加算しない。一般入力・回答後本文・本人実機一往復の品質が残る |
| Emlis有料拡張 | Plusの適格本人履歴、Premiumの逐次問い・本人が修正／否定できる根拠付きframe、条件付きLayer3を実装 | 履歴が使えるコードと、本人固有の深さ・有料差の体感を分ける。有料商品品質は未受入れ |
| 配置と本人確認 | 最終稼働確認記録は10/20議事録にある10/10版`5c8bd8e…`。u353〜355は未配置と記録 | 今回Renderへ直接再照会していない。10/10の本人実機表示1件は確認記録あり、内容はMash評価で不合格。同じ保存本文の履歴再表示まで確認済みにしない |
| 27B候補試験 | `Qwen3.8-27B-Q4_K_M.gguf`を候補保持。10/21、架空相談2題×実演あり／なし×初回／回答後＝8出力の推論試験 | 追加情報の取込みは見られたが、未確認な意味の補完、近い問いの再提示、更新記録の欠落が残る。実演ありの一貫した優位未確認。重みの追加学習0、27BのCMEE統合0、他core適性未検証、製品採用未確定。Pod停止はMash報告受領済み |
| 観測教材 | 観測・一点への問い・本人回答で何を修正するかを記録。相談教材と、感情選択＋その時点で見える実体寄り入力を区別 | 教材蓄積は学習実施ではない。[三中核の分担・比較案](observation_learning/model_selection/2026-10-22-three-core/README.md)を作成。20比較場面（新規評価候補15・既知派生4・境界1、独立した新規候補5family）、最初の4場面、可視入力と採点条件を分離して保存した。モデル試験・本統合・追加学習は未実行。自然な入力分布・一般化・学習効果は未実証。最新教材は`observation_learning/README.md`から辿る |

詳細owner：[Emlis map](current_structure/01_emlis_ai_current_structure.md)、[CMEE map](current_structure/04_cmee_current_structure.md)、[Emlis詳細設計](designs/cmee/v1/02_emlis_v1a_detailed_design.md)、[観測教材](observation_learning/README.md)。古いmap本文の「問い未実装」は後続Q3／Q4・実sourceと矛盾する旧状態であり、現在へ戻さない。

## 5. Analysis — 蓄積を本人の情報へ返す

| 機能・構想 | 現在の実装・境界 | 稼働・本人確認・残件 |
|---|---|---|
| こころ天気 | 感情選択・強さ・時刻から当日／日／週／月の比率・揺らぎ・切替りを返すAPI／RNあり。日＝前日、週＝7日、月＝28日 | 既存稼働経路。原因・未来を断定しない。短いmemoでも感情記録の集計価値は別に成立し得る。今回、本人データ・実端末の再検証なし |
| 従来わたしマップ | 役割スイッチ／ルート／分かれ道／未観測領域を表示。旧builder・保存・latest／history／detail・renderer経路あり | 固定4step・汎用結果文を含む旧経路。完成目標の根拠付き観測グラフと同一視しない。V2へのglobal cutover未完了 |
| V2観測ルート | 期間内の原入力と適格補足から五種node、明示順序・無方向共起、訂正・撤回を限定対応。source adapter／compiler／realizer、immutable保存、既存API分岐、RN表示あり | 一般日本語・全段階の理解は未完成。V1-D基盤とu102〜118は指定開発配置済み。u129〜250の内容修正は資料上未配置。通常本人生成→保存→再表示、保存identity独立照合、商品受入れは残る |
| 守るもの・負荷・不明・不一致 | V2で本人明示の守る意向／現在負荷、対象付きunknown／conflictを文章・図へ接続 | 限定対応。一般的な保護・負荷理解や解釈仮説は未完成。旧v1の未実装表をV2の全未実装へ転用しない |
| 期間比較 | 隣接等長期間のルート・注記・不明範囲・不一致を比較し保存・表示。前期間なし／比較不能も区別 | 比較SQL適用済み。設定手順はMash報告で、稼働値の独立取得なし。本人の比較成功・正式受入れ未成立。改善・悪化・原因を自動判定しない |
| もしもルート／IF | 詳細設計あり、runtime未実装。現在の観測ルート＋本人が選ぶ分岐点・意向・制約→条件・負荷・未知を伴う1〜3候補を並列提示 | SELF_ONLY。health／medical、および他人の意図・反応・関係の結末を対象とするIFは対象外。最適解の順位・成功確率を付けない。生成・保存・API・RN・実機・受入れが残る |
| SavedRouteIntent | 本人がIF候補から明示保存した関心方向を残す設計あり。runtime未実装 | 観測事実、仮想候補、本人の選択を分離。選択を実行済み・達成・失敗・性格へ昇格しない |
| 最新・履歴・詳細 | 保存成果物、文章と図、期間を同じidentityで再読。認証・tier・期限・source変更を再検査するV2コードあり | 専用table適用済み。6201実機OKは過去のMash報告。6401 TestFlight送信済みと、端末導入・正常空表示・本人生成成功を分ける。6401実機確認は残る |
| Emlis補足との接続制限 | 原入力と適格補足を一つの記録機会に束縛。生成された問いや応答は本人sourceにしない | 現行期間source loaderは同一threadにANSWER2件以上で`analysis_multiple_answers_not_supported`。pure source adapterも補足2件以上を`analysis_supplement_cardinality`で拒否する。Premium複数回答全体の採用未対応。対象threadを除外したり原入力だけへ戻したりせず、その期間sourceの読取／生成を拒否する。「原入力＋2回答が期間Analysisへ接続済み」としない |

詳細owner：[Analysis map](current_structure/03_analysis_current_structure.md)、[Analysis詳細設計](designs/cmee/v1/04_analysis_v1d_v1e_detailed_design.md) §7〜11・15〜16、schema §7・9.6。最後の配置記録はu128 API `1a42…`とnative6401。その後のコードと配置を分ける。

## 6. Piece — 本人の意味を他者へ伝える

| 機能 | 現在の実装・境界 | 確認・残件 |
|---|---|---|
| 本文・visual recipe | 保存済み本人source→単独で伝わるcanonical text＋画像。現V2 source adapter／pure coreはoriginal＋normal／pre-questionのみ。refinedは別sourceのopt-in補足を使う設計だが、現コードは`source_role_or_stage_not_yet_supported`で未対応 | 旧Q&Aの存在を新商品の定義にしない。Emlis生成本文・Analysis推定の原文流用は禁止。補足をoriginalへ連結してrefined接続済みにしない |
| preview・保存 | 本文・画像設定・取消・保存・回復のsource接続あり。iOS renderer供給とsame-mount/token current fitを接続。owner／runtime／quotaを別に確認 | 実Authの通常入力→preview→明示private保存は未確認。preview＝保存record＝card＝renderer入力＝export本文を保つ。保存後の本文・format・recipe変更は新record |
| V2有効化・旧経路 | API登録は明示preview／shared候補に限定。default applicationはlegacy、各flag既定OFF。RN通常入力のV2接続sourceあり、tutorial／Nexus旧経路は残る | 配置済み状態は今回再確認なし。source接続をlive化へ換算しない |
| 本人履歴・詳細・公開範囲 | owner一覧・詳細・公開切替・削除、通常導線・保存後再取得を接続。privateはownerのみ、publicも既存access policy内 | 同一ownerの実Auth保存→履歴／詳細往復は未完。アプリ内公開と外部画像共有を分ける |
| export | 本人詳細→fresh GET→表示recordのID・row version・3hash・renderer一致→全canvas→明示Photos／Shareをsource接続 | 実OS写真保存・Share、Android新版export、backend receipt、本人端末商品受入れは未完。外部へ出た画像コピーは内部非公開／削除で回収できない |
| 新renderer | iOS `piece.rn_bitmap_renderer.ios.v1`。検査した同一bitmapを表示／書出し。preview fit・構築は元8秒、完成saved画像は8秒後も保持 | live供給採用・商品採用は未完。Android新版の成立へ拡張しない |
| 最新限定検証 | 新export正常8PNG＋native拒否6。JS979・新native44成功。旧195は176PASS／19FAILを保持 | CI39780623108 attempt1 completed／failure、head`d2e1244…`、10/22 JST21:42:54〜22:07:18。CI全体合格ではない。限定TECHNICAL_CREDITの記録あり、product_credit=0 |
| live・次の未完 | 10/23のRender照会でliveは10/10の`5c8bd8e5…`、起動`app:app`、autoDeploy off。明示candidateのsave/quota/delete接続も同版には未配置。SupabaseのPiece8tableはRLS enabled、8RPC signatureのEXECUTEはpostgres/service_roleのみ。業務RPC・本人row操作0。最新ownerは入口§116、map§65.59、manifest v156 | [Piece限定API候補PR4](https://github.com/MassyuRed/mashos-api/pull/4)をlive基点に準備。既承認製品5＋test4同blob、既存workflow1。候補`08875643…`のCI39803099295は1793 PASS/FAIL0/SKIP0（合成Auth・隔離SQL）。配置・稼働採用・実Auth通常保存→同owner履歴/詳細は未実施 |

詳細owner：[Piece map](current_structure/02_piece_current_structure.md)、[Piece入口](../Cocolon_Piece/00_read_first.md)、[manifest](../Cocolon_Piece/manifest.json)。10/23の同変更単位で、manifestのcurrent_entry/current_premise/current_structure pinを更新後の現物hash・bytesへ同期し、旧pin不一致を解消する。候補設定はpreview TTL600秒（新提案）と明示iOS版、private preview/save/owner read/delete、public/export OFF。既存resolverはapp単位のため同APIの全認証sessionへ及ぶ。技術的ready不足をCIや承認で免除せず、採用・配置・本人操作は別途の具体的承認対象。

## 7. その他の全機能・共通基盤

以下は2026-10-22に入口・RN／API sourceを照合した機能一覧。接続ありはcodeの状態。今回、live・本人端末・通知配送・実課金・実削除の成功確認はしていない。

| 機能 | 目的・現在の接続 | 未確認・境界 |
|---|---|---|
| 起動・認証 | 登録／ログイン／メール確認再送／再設定／復旧。`App.js`→`RootNavigator`→`MainTabs`→Input／Analysis／Piece／Ranking／Settingsの5 Stack | native認証リンク・cold／warm復帰の実成立は別確認。旧巨大App／MyModel画面名から現在を復元しない |
| 今日の問い・回答履歴 | current／answers／history／PATCH／settingsを接続。日常メモと別に考えを記録し、修正・再読 | Emlis任意問いと別機能。旧自己構造素材との接続を、V2全source採用済みへ拡張しない |
| 投稿・他者のPiece | 通常`PieceEntryScreen`→`NexusScreen`。本人／フォロー中／特定相手、並替・更新・本人投稿削除。linkPayload時のみ`PieceScreen` | 公開条件と新Piece保存成立は別。旧Q&A投稿と新canonical recordを混同しない |
| 共鳴・履歴 | submit／delete／historyと一覧・詳細あり | 自己共鳴・フォロー外制御あり。共鳴数を人間理解の正しさへ換算しない |
| 感情通知・感情ログ | feed／unread／既読、個人別受信設定、送信選択。Nexusの投稿／感情通知／おすすめ／共鳴履歴の一部 | 感情・強さ・時刻であり、メモ本文の公開ではない。実配送・通知許諾・全起動先は未確認 |
| フォロー・申請・推薦 | 作成／解除／フォロワー削除／承認／拒否／取消／おすすめを接続 | 非公開account・推薦除外・公開範囲を保持。見つけることと閲覧許可は別 |
| アカウント・ID検索 | 自他profile・活動情報・表示名・共有コード、非公開設定、推薦／ランキング可視性 | 共有ID公開、推薦、ランキング、非公開を別設定とする。公開profile APIと認証本人APIを分ける |
| 共有URL・native／Web入口 | 共有profile URL→公開API→Accountの接続codeあり | iOSのnative入口とWeb補助は残件。APIはvisibility取得HTTP失敗時に公開defaultを保持する未解決経路あり。実漏出を観測したという意味ではない |
| ランキング・感情集計 | 連続ログイン／入力件数／文字数／共鳴数、感情集計の別route、可視性設定 | 活動量であり記録の価値・人の評価ではない。全体感情TOP3はアプリ内集計で、社会全体の代表値ではない |
| 通知・未読 | push token同期、未読状態、問い・report・感情更新から対応画面へ戻るrouting | token登録と配送成功を分ける。ログアウト／account切替時の本人境界、全cold／warm動作は別確認 |
| アプリ設定・購読 | theme、全体／個別通知、プラン購入・復元・管理、entitlementのコードあり | finish両方式失敗後もdone／ok:trueへ進む経路、進行中取得のaccount切替後の旧応答適用防止がsource上未解決。実storeのfinish／失効／account切替／復元・release判定も残る。料金表示だけで有料品質成立としない |
| ガイド・tutorial・お知らせ | ガイド、再体験、tutorial flow、notice current／history／read | mock体験は通常実経路の成功証拠ではない。tutorialを全体価値・入力の悩みの唯一の解決としない |
| ログアウト・退会 | feature flag・二段確認・`/account/delete`後local cleanup／signOutのコードあり | 実データ全削除完了は未確認。元情報と派生物、内部保存と外部画像の境界を分ける |
| ProfileCreate旧資産 | `ProfileCreateScreen.js`・`api_profile_create.py`は現存 | fresh Root＋5 Stackに通常route／importを確認できず。通常入口接続済みへ昇格しない |
| 国家システム・非同期処理 | 原入力保存・event dispatch、分析素材／queue、通知・集計・保持期限、API／DB／認証・公開governanceが各ownerを持つ | 原入力の保存を生成成功に従属させない。Emlis補足・続行を入力件数／課金eventへ再加算しない。queue・job・retryの存在をlive稼働／全処理成功へ換算しない |
| 生成基盤・開発運用 | APIのCMEE EngineにEmlis thread／Piece／Analysis consumer分岐あり。既存共有text core・生成guard・contract・tests、RN build／CI、System Contextは支援基盤 | 固定snapshot／旧禁止条項はその時点の範囲。学習済AI接続は未実装だが方針は既決。稼働設定・秘密値・DB実値・端末は原本sourceから推測しない |

共通状態として、未入力／不足、保存中／保存失敗、本文生成失敗、回答待ち／skip／終了／訂正／撤回、履歴なし／期限切れ／source失効、未認証／owner不一致／プラン不足、非公開／公開／削除、未読／既読、課金保留／有効／失効／復元を区別する。具体的挙動は該当contract・実ownerで確認し、この列挙を全状態遷移の実機合格証にしない。

## 8. プランと、次作業を選ぶときの現在地

| プラン | 仕様・表示上の体験 | 成立状況の限界 |
|---|---|---|
| Free | 当回Emlisと任意1問、軽いmap概要、Piece月5、入力等の履歴は当月＋前月。わたしマップは最新概要のみで履歴不可 | code・表示と、自然な本人理解の品質は別 |
| Plus | 適格本人履歴を用いたEmlis、こころ天気の文章／理由、標準map・直近1年履歴、Piece月30 | 履歴参照と有料差の体感は同義ではない |
| Premium | 修正できるframeと本人続行の最大3問、長期weather・深いmap、無制限履歴／Piece、設計上のIF・Saved | IF／Saved未実装。同一期間V2 light／standard／deepの本文・graph差は未成立／未確認で、表示上の権利を能力の完成へ換算しない |

| 作業領域 | 次に解消すべき具体的未完了 |
|---|---|
| AI選定・観測教材 | 三core分担と20場面の比較案は準備済み。次は[比較案](observation_learning/model_selection/2026-10-22-three-core/README.md)の最初の4場面について、固定モデル／正規fixture束縛・環境・実行費用上限を具体化し、現方式と未接続proxyの実出力を得る。27B採用・本統合・追加学習は未確定／未実行 |
| Emlis | 一般入力と回答後の意味・自然な本文・有料差、本人実機の保存再読まで。u353〜355のコードと配置差を保持 |
| Analysis | 最新内容修正版の配置差、6401本人生成・再表示・比較、複数ANSWER採用、一般理解、有料差、IF／Savedの未実装 |
| Piece | live基点のPiece限定候補PR4/CIは準備済み。次は起動構成・TTL600秒案・全認証sessionへ及ぶprivate機能の採用判断と、技術的ready照合後の配置・実Auth保存→本人履歴／詳細。実Photos／Share、Android、backend receipt、商品受入れは残る |
| 全体・release | 自他所有／公開／削除、認証復帰、finish失敗の成功扱い・account切替後旧応答・公開visibility取得失敗時default、共有URL入口、通知配送等の通常実機経路と未受入れ品質 |

この表は新しい作業の自動開始・GPU再起動・merge／deploy／公開の指示ではない。Mashの現行タスクを進め、対象の詳細ownerから具体的な一手を選ぶ。文書更新は商品品質の改善creditに数えない。

## 9. 根拠・確認範囲

2026-10-22：全体・入力／Emlis／CMEE・Analysis・Piece・RN周辺機能・必読導線を分担照合し、この資料へ統合した。全repositoryの全blob再監査、live／DB／端末／storeの新規検証は行っていない。根拠を以下へ戻せる状態にしておく。

| 範囲 | 詳細原本・現物 |
|---|---|
| 全体構想・設計 | `cocolon_thought_material_for_karen.md`、`01_cocolon_overall_structure.md`と分冊01A／01B／01C、`02_cocolon_national_system.md`、`current_structure/00_three_core_and_cmee_read_first.md`と01〜04 |
| 最新判断・配置記録 | `weekly_reviews/Cocolon_Weekly_Review_20261017.md`、とくに10/20議事録§相当L1525〜1609。API `ai/docs/EMLIS_DEPLOYMENT_AND_OPERATION_CHECKS.md`。会議記録は仕様・実装事実の代用ではない |
| Emlis・CMEE実物 | API `cocolon_meaning_experience_engine/engine.py`、`emlis_thread_service.py`とthread source／question／answer_update／surface、RN `InputScreen`・`useEmlisThread`・`EmlisThreadModal`。API path prefixは`ai/services/ai_inference/` |
| AI試験 | `observation_learning/trials/2026-10-21-qwen27-demo/README.md`と8出力JSON。`fine_tuning_performed=false`、`cmee_integration_performed=false` |
| Analysis実物 | API `astor_material_snapshots.py`、`analysis_observed_service.py`、`watashi_map_service.py`、`kokoro_weather_service.py`、RN `WatashiMapV2Renderer`・access policy。設計04 §10 IF／§11 Saved、schema05 §7・9.6 |
| Piece実物 | `PieceOwnerHistoryScreen`、`pieceExport`、`PieceExportCanvas`、`pieceRenderer`、`InputPieceActionArea`。入口§116／map§65.59／manifest v156、CI39780623108とAPI候補CI39803099295 |
| 周辺機能実物 | RootNavigator・MainTabsと5 Stack、Input／AnalysisHistory／TodayQuestionHistory／Nexus／Account／Ranking／Settings各screen、`lib/nexusApi`・home/account API transport、対応APIとaccess policy。`lib/iap/iapService.js` L432〜445・527〜531、`SubscriptionContext.js` L165〜234、API `api_public_profile.py` L81〜108、`navigation/linkingRuntime.js` |
| 作業導線 | repository root `AGENTS.md`、観測学習README、work rules00／CURRENT_RULES R2／09／99・manifest、System Context00・task_profiles。元の必読incident・品質規則は継続 |

比較案作成時の追加照合点はCocolon `5d14a293…`／API `a536e50…`。Piece sourceのrefined未対応とAnalysis pureの補足上限を実物で再確認し、上記の設計／実装区分を明確化した。その他の機能を新規再検証した意味ではない。

次回はfresh headと変更pathを比較し、関係する根拠だけを再確認する。確認していない機能の検証日を更新せず、この一枚を「毎回全体を読む」入口として保つ。

10/23 Piece差分は、既承認Render workspaceのread-only service/deploy照会、Supabase pg_catalog定義/RLS/ACL、liveとPR3のPiece5source差分、live基点のPR4候補全10path、CI39803099295原23summary・合成merge/candidate同treeを照合したもの。Emlis・Analysis・他機能の実装/配置/端末状態を今回新規再検証した意味ではない。
