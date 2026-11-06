# Material寄りのCocolon UI設計

決定日：2026-11-06 JST / 決定者：Mash / 設計担当：華恋。

状態：方向性はMash採用済み。以下の寸法・色・実装順は、その方向を具体化した設計値。比較プレビューの承認と、製品実装・ビルド・本人端末での表示確認は区別する。

**対象範囲は確定：全画面を今回のMaterialデザインへ統一する。例外は設けない。** 主タブだけでなく、起動・認証、履歴・詳細、本人／他者、条件付きの互換表示、モーダル、チュートリアル、読込・失敗・結果不明も含む。Mashが相談したのは実装の作業量と区切り方であり、全画面統一の採否ではない。

実装は共通部品から始め、関連する画面群ごとに確認・GitHub保存を行う。区切るのは作業と保存の単位で、対応範囲ではない。全画面分を同じ設計に載せ、全体の確認までを一つのUI改装として扱う。具体的な全画面対応表は§14、進め方は§15、今回の確認範囲は§16に置く。

## 1. 採用した方針と理由

**「優しく、迷わず使えて、言葉は丁寧に読める」Material寄りのCocolon。**

| 決定 | 実装へ落とす内容 |
|---|---|
| 見出し・ボタンはMaterial案の明快さを残す | 目的別の面、明確な見出し、選択状態、主操作と補助操作の強弱。丸み・やわらかい色面を残す |
| 長い本文は軽い太さとゆとりのある行間 | 標準書体400、本文16・行間27を基本。文の途中で省略しない。見出しや選択肢へ本文書体の変更を一律適用しない |
| ロゴとPiece内の文字は操作部分と分ける | 操作はOS標準の日本語サンセリフ。Emlisロゴは既存CormorantGaramond。Piece作品は保存されたrecipeとrendererを使用 |
| 今のポップさを基準に必要な所だけ調整 | 強い影、太い装飾枠、太字の連続を減らし、面の色と余白で区切る。無彩色中心の静かな案へ戻さない |

Mashの比較理由：Day One案は情報の区切りが弱く、視線が動きやすい。How We Feel案は世界観に魅力がある一方、配置に違和感。Material案は全画面を通して最もわかりやすく、優しさと万人への使いやすさがある。文字は変更可能と確認し、上の3区分で合意した。

参照は[比較プレビュー](previews/three-directions-four-screens.html)の「Material寄り・明快なかたち」。公式Materialコンポーネントの完全再現や、新しいUIライブラリの導入を意味しない。React Nativeの既存部品で表現する。

## 2. 保存した画面と、製品での扱い

| 画面 | プレビューで確認できるもの | 製品へ反映する時の補正 |
|---|---|---|
| ホーム | 入力欄、感情、強さ、カテゴリ、通知、保存、Emlis応答への流れ | 思考・行動の二欄、自己理解の排他選択、既存の入力・保存・応答状態を保持。今日の問い・履歴・お知らせ・アカウントも残す |
| 分析 | こころ天気／わたしマップ、日週月、感情構成、根拠・月次比較 | 実際の天気・温度・中心感情・揺れ・観測メモも必要。架空ドーナツ・件数・構造で実データを置き換えない |
| Piece | 作品を先に見せ、設定・保存へ進む構成 | 主に作成プレビューの参考。Pieceタブは現行Nexus feedが入口であり、履歴・投稿・通知等を削除しない |
| 設定 | 見た目・通知・契約・アカウントのまとまり | 現行の3ルートを生かし、まず目的が読める一覧へ。各設定や購入状態の処理をデモのローカルstateへ置き換えない |

## 3. 共通レイアウト

| 項目 | 設計値・規則 |
|---|---|
| 画面左右余白 | 標準20、狭い画面16。safe areaは別に確保 |
| 間隔 | 4 / 8 / 12 / 16 / 20 / 24 / 32。見出しと説明8、同群の操作12、別の群24 |
| 面 | 背景→通常surface→tonal surfaceの3段。カードを何重にも重ねない |
| 角丸 | 入力16、カード24、主ボタン24を基本。丸みは残す |
| 主ボタン | 最低高さ52、上下14・左右20。文言は折り返し可。画面内で最も目立つ操作を1つにする |
| 補助操作 | 通常surface＋薄い境界。テキストだけの操作も最小44のタップ領域を確保 |
| 影 | 操作の浮き上がりが必要な所だけ、小さく。静的な全カードへ強い影を付けない |
| 上部 | ロゴと画面見出しの役割を分離。常時表示の英語tagline・画面全体の太い囲み枠を外す |
| 下部ナビ | ホーム／分析／ピース／設定の4つ。アイコン＋日本語ラベル。選択時はtonalの面と文字の強さ、未読は別の印 |
| スクロール | 長文を全文読める。下部操作とキーボードが本文・入力欄へ重ならない。固定高さで本文を切らない |

## 4. 文字の役割

数値はReact Nativeの論理サイズ。OS文字拡大を有効にする。長文を細く見せるために300以下へ落とさず、400と行間で調整する。

| 役割 | サイズ / 行間 / 太さ | 用途 |
|---|---|---|
| 画面見出し | 26 / 34 / 600 | ホーム、分析、設定等 |
| セクション見出し | 18 / 26 / 600 | 入力の区切り、設定のまとまり |
| 操作・選択肢 | 15–16 / 22–24 / 600 | ボタン、タブ、選択済みラベル |
| 本文 | 16 / 27 / 400 | Emlis応答、分析説明、本人の文章 |
| 補足説明 | 14 / 22 / 400 | 設定説明、条件、案内 |
| 日付・補助値 | 12–13 / 18–20 / 400 | 時刻・期間。必要条件・エラー本文をこのサイズへ落とさない |
| Emlisロゴ | 既存ブランド書体 / 24 | 操作書体へ統一しない |
| Piece作品 | 保存recipe・rendererの指定 | 操作tokensを継承させず、保存画像を変更しない |

実物の補正：現在のHomeは`applyTypographyTokens`で小さい説明を最低14へ引き上げる。わたしマップ本文も既に16/25。全画面が10px・全本文が太字という前提では変更しない。

## 5. 色

採用プレビューの淡いラベンダー＋プラムをdefaultへ対応する。設定の保存IDは`default / light / dark`、表示名は「デフォルト／ホワイト＆ゴールド／ブラック＆ネイビー」を維持。既存のlight/darkの色相は維持し、同じ面・余白・文字階層を適用する。

| 役割 | default | ホワイト＆ゴールド | ブラック＆ネイビー |
|---|---|---|---|
| 背景 | #F7F1F8 | #FFFFFF | #000000 |
| 通常面 | #FFFAFF | #FFFFFF | #000000 |
| tonal面 | #EADDF0 | #F5EACD | #15233F |
| 本文 | #312436 | #111827 | #F9FAFB |
| 補助文字 | #6B5D6E | #606774 | #9CA3AF |
| 区切り | #E5D7E7 | #E5E7EB | #1F2937 |
| 主操作 | #694775 | #87630D | #0B1120 |
| 主操作上 | #FFFFFF | #FFFFFF | #FFFFFF |
| tonal面の操作文字 | #583864 | #76570B | #B3C6F4 |

通常の本文・ボタン文字は背景とのコントラスト4.5:1以上を検査する。金色のボタンは白文字が読める濃さへ補正する。色だけで感情・選択・エラーを区別せず、日本語ラベルや印を併記。Piece画像配色はこの表と別の契約。

実装時の可読性確認で、比較プレビューの補助色#7A6B7Dはtonal面上3.81:1だったため、defaultとlightの補助色を上表へ補正した。作品画像と比較原本の配色は変更しない。

## 6. ホームとEmlis応答

表示順：画面見出し・今日の問い等の入口→思考欄→行動欄→感情／強さ→カテゴリ→感情通知の選択→「この内容でOK」。入力欄は通常面、感情やカテゴリは選択状態がわかるtonalのチップ。情報を詰めるために2欄を統合しない。

5感情＋自己理解、強さ、複数カテゴリ、送信選択の意味・入力DTOは現在の実装どおり。自己理解と通常感情は排他、自己理解では強さ操作を出さない。カテゴリ最低1件の条件、原入力の保存、保存後の応答取得を保持する。チュートリアルのrefと操作停止も維持。

応答は「Emlisからの応答」「応答内容」の現行文言。本文は16/27/400。質問・回答・訂正等は本文と操作の群を余白で区切る。通常footerの「ピースの作成」「閉じる」、状態に応じた回答・skip・続行・終了・再試行を保持。過去に削除した説明や保存状態の常設表示を復活させない。

## 7. 分析

第一階層「こころ天気／わたしマップ」は同じtonal面の中の選択タブ。選択中の面・文字で区別し、下線だけへ頼らない。こころ天気の日／週／月は第二階層として軽い選択にする。現在の今の天気カードも残す。

天気・温度・中心感情・揺れ・観測メモ・期間・履歴を役割ごとに区切る。比率の図がある場合は全感情の名前・値も残す。プランで利用できない説明と、データ不足・読み込み・取得失敗を区別する。

わたしマップは「観測されたもの／つながり／未確定／本文／根拠」を読み分ける。意味上同じ群を淡い面でまとめ、見えていない役割や因果を装飾で足さない。順序・因果・共起の違い、unknown・conflict、原記録・本人補足、全文の表示を残す。現在mapは全蓄積、月次は保存当時版と現在の比較。プレビューの例を固定性格や健康スコアにしない。

## 8. Piece

プレビューは状態案内→作品画像→本文全文→形式・配色・比率・ブランド表記→利用条件／残枠→保存等の操作。作品を確認する前に大量の設定を読ませない。保存前に重要条件を確認できる順序にする。

形式と設定は`plan_capabilities`／`eligible_formats`、色は既存palette、ブランドは既存modeから表示。プレビュー4色や単純ON/OFFを製品へ持ち込まない。選択済みを日本語で示す。アプリの外枠・ボタンと、作品画像内の書体・配色を分離する。

候補identity・visualToken・revision・hash・保存可否・残枠の判定と、回復／再取得／期限切れ再作成／形式に戻る／取消／閉じる等の全操作を保持。画面をきれいにするために失敗を成功へ変えたり、自動通信を増やしたりしない。旧保存画像のロゴ・改行・色・rendererを描き直さない。

自分のPieceの一覧・詳細は作品主体、本文は読める太さ、写真保存・共有・削除・公開状態等は既存資格に従う。PieceタブのNexus feed、感情通知、おすすめ、共鳴、本人絞込み等も同じ操作デザインへ段階適用する。

## 9. 設定

入口は「アプリ設定／サブスク加入状況／その他」を、見出し・一行説明・矢印を持つグループ行へ。説明に「画面です」を重ねず、何を設定できるかを書く。既存の3ルートは維持する。

アプリ設定はテーマ3択と通知群。全通知OFF時の子通知停止、通信中の停止、失敗時の復元を保持。テーマはOS連動を新設せず既存保存値を使う。サブスクは実プラン・価格・契約状態・購入／復元／管理／規約・privacy・supportを既存データから表示。デモPlus680円を全員へ固定しない。

その他はチュートリアル再体験、ログアウト、アカウント削除。削除は末尾で危険操作として区別し、feature flag・二段階確認・処理中の停止を維持する。新しいプライバシー設定や未実装通知を見た目だけで作らない。

## 10. 操作状態と文字拡大

| 状態 | 表示 |
|---|---|
| 未選択／選択 | ラベル＋面・太さ。色だけで区別しない |
| 保存中・取得中・購入中 | 対象の操作名と処理中表示。二重操作を無効化 |
| 失敗 | 失敗した処理を具体的に表示し、既存の再試行操作を残す |
| 結果不明 | 成功／失敗を推定せず、既存の同一要求確認を表示 |
| データなし／不足 | 空の理由と次にできる操作。架空の分析や例文を本人結果として表示しない |
| 権限・プラン不足 | 不足理由。購入誘導だけで入力・既存成果物の再読を隠さない |
| 非公開・公開・削除 | 既存状態と確認を明示。UI変更を公開設定変更にしない |

幅320–430、OS文字拡大1.0/1.3/1.6で、ラベル折返し・タブ・下部ナビ・モーダル・キーボード・safe areaを確認する。ボタンを1行固定で切り詰めず、本文は選択・再読できる。VoiceOver/TalkBackへ選択・無効・処理中を伝える。動きは短い押下フィードバックを基本とし、情報の理解に必須にしない。

## 11. 初回実装の現物対応

現物照合：Cocolon PR30 `5284ebf625ee3d69241d31c426171a1e26c5ce51`。API/DB/GPU作業はUI実装の前提にしない。新規依存・新規フォント不要。

この表は初回反映時の対応表。全画面の作業範囲と現在の実装順は、後続の§14・15で具体化した。

| 順 | owner | 変更する表示 |
|---|---|---|
| 1 | `theme/ThemeContext.js`、`ui/uiTokens.js` | 意味別surfaceと文字tokens、既存3themeの互換 |
| 1 | `components/CocolonButton.js` | 読めるボタン、控えめな影、折返し、状態のアクセシビリティ |
| 1 | `components/GlobalFrameLayout.js`、`navigation/MainTabs.js` | 太枠・常時taglineの整理、選択面、4tab維持 |
| 2 | `screens/InputScreen.js`、`screens/input/EmlisThreadModal.js` | 入力の区切り、本文と操作の文字階層 |
| 2 | `screens/AnalysisMenuCommon.js`、`screens/PieceMenuCommon.js` | メニュー・周辺画面の共通カードと説明 |
| 2 | `screens/AnalysisContentFirstScreen.js`、`screens/analysisReport/KokoroWeatherCurrentCard.js`、`components/selfStructure/WatashiMapV2Renderer.js` | 分析の階層、本文・根拠・未確定のまとまり |
| 2 | `components/piece/PiecePreviewModal.js` | 作品優先の順序とテーマ対応の操作枠 |
| 2 | `screens/SettingsScreen.js` | 目的が読める設定一覧 |
| 3 | `screens/SettingsAppSettingsScreen.js`、`screens/SettingsOtherScreen.js`、`screens/SubscriptionSelectScreen.js` | 各設定・契約画面の仕上げ |
| 3 | `screens/PieceOwnerHistoryScreen.js`、`screens/NexusScreen.js`、各履歴・アカウント・ガイド | 一覧・詳細・周辺画面まで一貫させる |

共通styleの変更だけで全画面を完成扱いしない。保存controller・通信・購入・削除・未読・tutorial lifecycleを変更せず、表示の変更として進める。Piece rendererと保存画像は対象外。構造owner・公開DTO・DB・AIの仕様はこの設計で変更しない。

## 12. 実装・確認の現在地

比較プレビューと本設計を先に保存した区切りは[4604310](https://github.com/MassyuRed/Cocolon/commit/46043100b08746a6db0d0deac4857eddab015391)。その後、同じ依頼の範囲で製品UIの初回反映を進めた。全画面の仕上げ完了・実端末確認済みとは扱わない。

| 範囲 | 初回反映f35213fの実装 |
|---|---|
| 共通 | defaultをラベンダー／プラムへ。3テーマの保存値とラベル維持。tonal面・文字役割追加、重い影・外周枠・常時taglineを整理。ロゴはブランド書体のまま |
| ボタン・ナビ | 600の文字、複数行、主操作色、disabled/busyの読み上げ。4tabの選択面。下部safe areaと文字拡大に応じた高さを確保。未読・遷移・回復処理は維持 |
| ホーム・応答 | 思考／行動欄、感情・強さ・カテゴリの区切りと選択面、タップ領域、本文16/27/400。Emlis応答も本文と操作の文字階層を分離 |
| 分析 | 第一階層のtonalタブ、天気カードの面、マップのカード・未確定面・根拠リンクと本文。天気の各情報・全node/edge/unknown/conflict・根拠は既存表示を保持 |
| Piece作成 | 画像／全文を設定より前へ。操作ボタンと外枠をテーマ対応。全条件操作とidentity/tokenの引渡しを保持。作品renderer・recipe・保存画像は変更0 |
| 設定・周辺 | 設定入口を目的が読める3行へ。テーマ選択面、共通メニュー、契約カード・説明・CTA、Nexusタブと自分のPiece入口を調整 |

**現在の実装：** §17〜22の全6群へsourceを反映し、§23でタップ領域と短い横画面のtutorial、§24で文字拡大時の感情入力・下部ナビ・接続案内を補修。全画面対応表のsource実装を一巡した状態であり、ビルド・配布・実端末での表示合格は未確認。次は全群をまとめたビルドで、3テーマ、文字拡大1.0/1.3/1.6、狭い幅、短い横画面、safe area、キーボード、長文・回復操作、全19tutorial stepを確認し、実際の欠けを直す。sourceの統一と実機での仕上げ完了を分けて管理する。

初回反映時の確認：Nodeの既存5入口（画面contract・IAP復元・テーマ可読性・Piece初回保存modal・preview/display）で400 PASS／FAIL0／SKIP0。React/native・Auth/HTTPは各既存testの代替を含む。テーマ検査は旧バーガンディ色・太枠・taglineの固定期待を採用設計へ更新し、3テーマの本文／補助／tonal／操作色の4.5:1を検査した。Piece testの新テーマhookと共有Buttonへのimport適応のみを行い、保存・回復の検査は維持。最初の実行は取得不足の依存fileと旧表示期待で失敗し、依存原本の取得と意図した期待更新後に上記最終実行を通過した。製品の資格判定を緩めていない。今回の全画面設計更新で、これらを再実行したとは扱わない。

変更したJS/JSXはローカル既存Babel parserで構文確認し、diffの空白エラーも0。これはRNビルド・描画検証ではない。今回のブラウザ描画の自動検査、nativeビルド、TestFlight配布、本人端末表示確認、Render／Supabase／GPU操作は未実施。比較プレビューはユーザーが閲覧・採用済みだが、その採用を製品画面の実機確認へ置き換えない。

## 13. 全画面へ適用する共通設計

### 13.1 画面の構成と共通部品

同じデザインに統一し、機能に必要な配置の違いは保つ。入力フォーム、読む画面、一覧、設定の全てを同じカードで埋めない。

| 共通の型 | 配置・寸法 | 使う場所 |
|---|---|---|
| 主画面 | ブランド＋画面見出し、必要なガイド／補助操作、主内容、4タブ | ホーム・分析・Piece・設定 |
| 子画面 | 44以上の戻る領域＋画面名、説明、主内容。本文側に同じ見出しを重ねない | 全履歴・詳細・フォロー・アカウント・設定下層 |
| 一覧 | 目的／期間→既存の検索・条件→日付とタイトルの行→追加取得。初回読込・0件・失敗・追加取得失敗を分ける | 入力・問い・レポート・マップ・Piece・共鳴・お知らせ・ユーザー |
| 本文・詳細 | 対象／日時→本文→関連情報→必要な操作。長文16/27/400を全文表示 | Emlis、記録、分析、Piece、ガイド、お知らせ |
| 入力フォーム | 明示ラベル→入力→制約／エラー→主操作。文字16以上、キーボード回避とスクロール | 認証、入力、問い、名前、共鳴メモ |
| 設定行 | 項目名＋短い説明、右側に選択／switch／矢印。長い名前は上下へ折返す | 設定・公開範囲・通知・表示対象 |
| 説明・入力モーダル | 同じsurface、角丸24、内側20。タイトル22/30/600、本文16/27。safe area内で本文スクロールと操作への到達を確保 | 応答、今日の問い、名前編集、公開設定、根拠、用語、選択、案内 |
| 状態表示 | 読込／空／不足／失敗／結果不明ごとに理由と現在できる操作。独立した装飾カードを増やさない | 全画面・全モーダル |

本文の横幅は広い端末・iOS横向きでも概ね640以内、フォーム・主操作は既存の最大幅520を基本に中央へ。外側の余白は狭い幅で16、通常20。幅が足りない行は折返し、文字を縮小して押し込まない。月次の当時／現在比較は縦並びを基本とし、十分な横幅がある時だけ並列を検討する。

共通ownerは`theme/ThemeContext.js`、`ui/uiTokens.js`、`ui/applyTypographyTokens.js`、`components/GlobalFrameLayout.js`、`CocolonButton.js`、`CocolonPressable.js`、`CocolonBackButton.js`、`CocolonSwitch.js`、`screens/AnalysisMenuCommon.js`、`PieceMenuCommon.js`、`MenuActionCardCommon.js`。新しいUIフレームワークは追加せず、既存部品を完成させる。

親の共通ボタンだけ変えても、子Text・icon・spinner・画面固有styleの白固定／800・900太字／強い影が残れば未完了。`CocolonPressable`は呼出し元の選択・無効状態を読み上げへ渡す設計にし、戻る／×／更新等の小さいアイコンにも44以上の領域を確保する。

### 13.2 選択・無効・感情の色

| 役割 | 表示規則 |
|---|---|
| 主操作 | `GOLD_BUTTON`上へ`ACCENT_TEXT`。子のicon・spinnerも同じ組合せ |
| 選択済み | `SURFACE_TONAL`上へ`ON_SURFACE_TONAL`。文字・iconを同じ前景にし、チェックや「選択中」を併記 |
| 未選択 | 通常面＋本文／補助文字。押せる範囲・選択肢の区切りを余白で示す |
| 無効 | 通常面＋読める補助文字、無効理由を隣接。白文字を明るい無効背景へ残さず、行全体の透明度だけへ頼らない |
| 処理中 | 実際の処理名・spinner・重複操作停止。進捗率や完了時刻を作らない |
| エラー／危険操作 | 操作色と別の意味色＋説明。削除・解除・取消の意味を区別する。分析上の未確定はエラー色にしない |
| リンク | 本文中は下線＋操作色。外部リンク、アプリ内の移動、選択操作を同じ文言にしない |

エラー・危険操作の設計色は明るいテーマで文字#B3261E／淡い面#F9DEDC、darkで文字#F2B8B5／面#601410。説明を省略する根拠には使わず、同じ意味の操作には同じ色を使う。成功や不明を同じ赤へまとめない。

感情の識別色は現在の分析グラフと感情ログの対応が一致していることを照合した。色相を再割当てせず、操作の紫／金／紺とは別の意味色として統一する。

| 感情 | 識別色 | 入力アイコン |
|---|---|---|
| 喜び | #10B981 | happy-outline |
| 悲しみ | #6366F1 | sad-outline |
| 怒り | #EF4444 | flash-outline |
| 不安 | #38BDF8 | alert-circle-outline |
| 平穏 | #EAB308 | leaf-outline |
| 自己理解 | 感情分布へ混ぜず、通常の選択面 | bulb-outline |

識別色は図のmark・小さい色見本へ使い、名称・値・本文は各テーマの読める前景色で示す。感情チップの淡い面はテーマの背景と合成し、darkでも濃色文字を固定しない。入力で選択を示す面と感情固有の意味色を混同しない。根拠は`analysisReportConstants.js`、`EmotionLogScreen.js::emotionTint`、`InputEmotionSection.js`。

### 13.3 閉じ方・状態・プラットフォーム

モーダルの外観は共通化し、閉じ方の条件は各処理を保持する。下書き復元のように選択が必要なもの、背景押下で閉じられるもの、処理中に閉じられないものを、一律のdismissへ変えない。回復操作が多い状態では、その群を本文のスクロール内へ置き、固定footerは現在の主操作と閉じるを軸にする。操作を消して高さだけを縮めない。

OSが描く権限・共有・購入・契約管理・既存Alertは、そのOS部品を使用する。アプリ側の説明・表示前後・操作名・状態を同じUIへ揃える。これはアプリ画面の適用除外ではなく、OS所有の外観を独自の偽画面へ置き換えないという実装境界。

現在iOSは縦・左右横向き、Androidは縦固定。対応する向きを改装の都合で縮めない。status barとAndroid navigation barも周囲の面に合う明暗へ。OS文字拡大1.0／1.3／1.6、最小幅320、短い横画面、キーボード、VoiceOver／TalkBack、動きを減らす設定を全画面の確認へ含める。

## 14. 全画面の具体設計

確認ref：Cocolon PR30 `f35213fb57b68796f969d60595609fceef3e378f`。下表は画面と表示状態の対応表であり、行数を独立した画面数や実機確認件数とは呼ばない。全行が今回のMaterial統一対象。既に初回反映した部分も最終の全体確認へ含める。

### 14.1 起動・認証・全体状態

| ID・対象 | 実装・入口 | 配置と必要な操作／状態 |
|---|---|---|
| G01 ネイティブ起動 | iOS `LaunchScreen.storyboard`、Android SplashScreen theme | defaultの背景とEmlisブランド色をRN起動へ連続させる。旧生成り・バーガンディ・英語taglineを残さない。起動時にまだ読めない値を進捗率へしない |
| G02 RN読込・起動overlay | `runtime/AppStartupLoadingView.js`、Root／MainTabs／runtime gate | 中央の進行表示と14/22の案内。契約・認証・tutorial・Home準備を待つ役割と、背面操作／読み上げ遮断を保持 |
| G03 接続案内banner | `runtime/AppRuntimeBootstrapGate.js` | 短い説明＋再確認をtonalの一群へ。折返し・safe areaを確保。子画面の位置を維持し、未保存入力を再mountしない |
| G04 更新必須 | `runtime/AppRuntimeBlockingScreen.js` | 共通の見出し→理由・必要version→再確認。確認中を区別。現状にないストア導線を接続済みにしない |
| G05 メンテナンス・推奨更新・マップ更新案内 | runtimeのOS Alert、`MainTabs.js`の更新banner | 現行の通知条件と一度だけの表示を保持。アプリ所有bannerの文字・面・操作を統一し、メンテナンスを新しい全画面ロックへ変えない |
| AU01 ログイン | root `AuthScreen.js` signin | ロゴ→見出し→メール・パスワード→案内／エラー→ログイン→再設定・登録・条件付きメール再送。3テーマ、スクロール、キーボード対応 |
| AU02 新規登録 | 同 signup | メール・パスワード・確認・公開ユーザー名15字→作成→ログインへ。公開案内を名前入力に隣接し、不一致・不足・作成中・確認メール待ちを区別 |
| AU03 再設定リンク送信 | 同 forgot | メール一欄→送信→送信完了／失敗→ログイン・登録へ戻る。同じフォーム部品を使う |
| AU04 パスワード復旧 | 同 reset、Root recoveryMode | 新パスワード2欄→6字以上・不一致の案内→設定／取消。復旧modeの表示固定と処理中条件を保持 |

ネイティブ入口はiOS `Info.plist`の`UILaunchStoryboardName=LaunchScreen`、Android `AndroidManifest.xml`の`Theme.App.SplashScreen`→`styles.xml`、`MainActivity.kt`の`installSplashScreen()`。Androidは`values/colors.xml`の背景、`drawable/splashscreen_logo.xml`と同名PNGのmdpi／hdpi／xhdpi／xxhdpi／xxxhdpiを同じ変更単位で確認する。XMLだけ変更して完了にしない。`values-night/colors.xml`は現状空で、夜間上書きはない。PNGの画素外観と端末で選ばれる資産の実測は今回未確認。

### 14.2 ホーム・入力・Emlis・今日の問い

| ID・対象 | 実装 | 配置と必要な操作／状態 |
|---|---|---|
| H01 ホーム・感情入力 | `InputScreen.js`、`InputMemoSection.js`、`InputEmotionSection.js`、`InputCategorySection.js`、`InputActionArea.js` | 見出し・ガイド・アカウント・お知らせ→問い／履歴入口→思考・行動の二欄→感情／強さ→カテゴリ→通知→保存。感情は実幅と文字倍率に応じた1〜3列で折返す。通常5感情の複数選択、自己理解の単独選択、カテゴリ最低1件を保持 |
| H02 保存・読取の案内 | `InputToastOverlay.js`等 | 該当情報群の失敗＋再読、保存成功toast。キーボード・下部ナビと重ねない。原入力の保存成功をEmlis生成成功と同じ表示にしない |
| H03 感情入力履歴・行内全文 | `AnalysisHistoryScreen.js` | 戻る→検索→Secret区分／新旧順→条件・保持期間→記録カード。日付・感情・思考全文・行動全文・カテゴリ・応答・削除を区分。追加取得、hit強調、refresh、削除確認を維持 |
| H04 Emlis応答 | `screens/input/EmlisThreadModal.js` | 見出し→応答本文→任意の質問／本人回答→現在できる操作。本文400。末尾「ピースの作成」「閉じる」、質問・skip・続行・終了・再試行／同一要求確認を保持。横画面＋keyboard時の操作到達を優先し、末尾2操作も同じ本文ScrollView内へ置く |
| H05 仮の理解・回答編集 | 同modal内のframe／回答部分 | 質問と本人入力を別の面へ。仮の理解は根拠日時／trigger・本文・確認／訂正／不採用。busy・read-only・結果不明・回答上限・2000文字の条件を保持 |
| H06 旧観測応答popup | `InputFeedbackReplyModal.js` | 同じ長文dialogへ。太枠・強い影・本文600を整理。通常でもthread readerが開けずpassed本文があるfallbackに現れるため必須対象 |
| H07 今日の問い・ホーム内 | `components/TodayQuestionCard.js` | 問い→選択式／自由回答→回答欄→送信→履歴。配信前、回答済み、任意一言、送信中、question ID/version変更時のresetを保持 |
| H08 今日の問いmodal | `components/TodayQuestionModal.js` | H07を共通の長文／入力modalへ。safe area、本文スクロール、キーボード回避、閉じる／回答操作に到達できる高さを確保 |
| H09 今日の問い履歴 | `TodayQuestionHistoryScreen.js` | 戻る→閲覧／編集条件・保持期間→日付・問い・回答→さらに表示。全員閲覧／Plus以上編集、60件単位、停止・初回読込・0件・失敗を区別 |
| H10 同・展開詳細／編集 | 同screen内展開 | 回答・編集日時／元入力anchor／全文→許可時のみ方式・選択肢・自由回答・任意一言・更新。別の詳細routeを新設せず、一覧内展開を維持 |
| H11 下書き復元 | `InputStartupModals.js` | 一枚のdialogに端末の送信前入力の説明・保存日時・48時間→復元／新しく入力。現状の選択必須と本人別の下書きを保持 |
| H12 tutorialの旧Pieceプレビュー | `InputPiecePreviewController.js`→`EmotionPiecePreviewModal.js` | 模擬体験の問い／答え・枠数・生成を同じ文字・面・操作へ。`isTutorialMode`と`hideCancelButton`等を保持。新Pieceが通常経路であることを変えない |

本人の入力履歴はH03で、Pieceの`EmotionLog`とは別。現在H03は別detail routeを持たず行内に全文を出す。省略するなら全文への導線を必ず残す。隠れているSecret変更ボタン（`display:none`）を復活させず、表示中の検索filterを揃える。

### 14.3 分析・レポート・月次・根拠

| ID・対象 | 実装 | 配置と必要な操作／状態 |
|---|---|---|
| A01 分析ホーム | `AnalysisContentFirstScreen.js` | 今の天気→こころ天気／わたしマップ→日週月→内容→履歴。二段の選択、更新日、未読、guideを統一。埋込み結果の重複headerを出さない |
| A02 今のこころ天気 | `KokoroWeatherCurrentCard.js` | 天気・温度・中心感情を主情報、揺れ・観測メモを補足へ。観測なしと前回への操作を残し、0点に見せない |
| A03 日／週／月レポート | `AnalysisReportViewerScreen.js`、`AnalysisReportCharts.js` | 天気一覧→図・グラフ→権利内の分析群→本文。埋込みと全画面で内容部品を共有。時間推移、時間帯、Deepのメモテーマ・遷移・回復等、月前後半を勝手に省略しない |
| A04 天気の日付一覧 | `KokoroWeatherForecastStrip.js` | 日本語の日付・天気・温度・観測メモを共通書体へ。期間の横スクロールは残せるが、固定116幅・1行省略・900太字を見直す |
| A05 天気詳細sheet | `KokoroWeatherDetailModal.js` | 天気→温度／中心感情→メモ→時間帯→閉じる。縦スクロールとsafe area。黄色固定面・茶色文字を意味別の共通色へ |
| A06 天気履歴 | `AnalysisReportHistoryScreen.js` | 戻る→配布予定→閲覧範囲→日週月の履歴行→追加取得。既読は印・ラベルで示し、行全体のopacity0.6だけにしない |
| A07 現在の累積マップ | `SelfStructureReportGenerateScreen.js` default→`CumulativeWatashiMapView.js` | 全蓄積の説明→日時・対象／反映／未解析→観測→関係→未確定→文章→根拠。3プラン共通。埋込み時のスクロールownerを整理 |
| A08 マップ月次履歴 | `SelfStructureReportHistoryScreen.js` | 月を主情報、保存日時・既読を補助へ。月とartifactの対応、2回／12回／全期間、追加取得・refresh・現在map／プラン導線を保持 |
| A09 当時版・現在比較 | `SelfStructureReportViewerScreen.js` cumulative分岐→`CumulativeWatashiMapView.js` | 「当時：月」「現在」を順に同じ階層で表示。分析日時と月次保存日時を区別。現在比較の失敗でも取得済み当時版を残し、過去を再描画しない |
| A10 根拠の記録modal | `CumulativeWatashiMapView.js`内Modal | 読込→日付・原入力二欄・本人補足→編集後の注意→閉じる。原文と注意、unknownと取得エラーを区別 |
| A11 V2・旧保存mapの描画 | `WatashiMapV2Renderer.js`、旧viewer、`WatashiMapRenderer.js`と構成部品 | 観測、edge、守る対象／負荷、unknown／conflict、全文を同じ面と文字へ。旧版の保存形式・mode・権利を保持し、新cumulativeへ置換しない |
| A12 条件付き補助メニュー3種 | `AnalysisEmotionScreen.js`、`AnalysisSelfStructureScreen.js`、`AnalysisInputHistoryMenuScreen.js` | 共通メニュー行・展開・未読へ。天気の最新／履歴×日週月、現在／月次map、感情／問い履歴の必要導線を保つ。戻る先として表示されるため必須対象 |
| A13 分析からの入力／問い履歴 | `AnalysisHistoryScreen.js`、`TodayQuestionHistoryScreen.js` | H03・H09と同じ部品・文字・条件にする。分析から開いた戻り先を維持 |
| A14 利用条件・プラン案内 | `AnalysisReportUpgradeCard.js`、各履歴・mapのlock表示 | 閲覧できる情報を保ち、制限対象の近くに理由＋プランへの操作。判定中を不足と誤表示しない。tutorial中の操作停止も保持 |

`AnalysisScreen`はStack登録以外に内部routeで画面を切り替える。外部から開いた履歴等の戻り先は`emotionAnalysis / selfStructure / inputHistory`になるため、A12を旧配置という理由で外さない。旧保存mapのoverview／役割／ルート／分かれ道／未観測の全構成も対象。viewerで非表示のCrossLinkとcomment-outのPDFを刷新の理由で復活させない。IF／SavedRouteIntentは設計済み未実装であり、画面を追加する時も本UIに従う。

### 14.4 Piece・投稿・感情通知・共鳴

| ID・対象 | 実装 | 配置と必要な操作／状態 |
|---|---|---|
| P01 Piece通常入口・投稿feed | `PieceEntryScreen.js`→`NexusScreen.js` | 見出し・guide・フォロー／更新→自分のPiece→全体感情→4タブ→表示対象／新旧順→投稿カード。全体感情TOP3を小さい独立群へ |
| P02 旧Q&A投稿カード | `screens/nexus/NexusPieceCard.js` | 投稿者・日時・未読→問いを補助見出し→答え16/27/400→共鳴数／操作。本人削除を独立。新画像Pieceへ仕様置換しない |
| P03 Nexus感情通知 | `NexusEmotionLogSection.js` | 名前・時刻→感情名＋強さ。意味色と文字を併記し、メモ本文を公開表示へ足さない |
| P04 おすすめユーザー | `NexusRecommendSection.js` | 見出し→表示名・共有コード・矢印の行。候補なし・読込・失敗、既存Account遷移を保持 |
| P05 Nexus共鳴タブ | `NexusHistorySection.js` | 新旧順→P02と同じ投稿カード。投稿feedとの違いをタブで示し、共鳴済み・処理中・取得状態を保つ |
| P06 表示ユーザーmodal | `NexusOwnerPickerModal.js` | 全体／自分／特定ユーザーの選択→閉じる。tonal＋チェック、名前折返し、行44以上、スクロール |
| P07 感情通知ログ | `EmotionLogScreen.js`、Pieceの`EmotionLog` | 戻る／更新／フォロー→名前・時刻・感情＋強さ。二重の画面名を整理。未読・0件・失敗・tutorial模擬通知を保持。本人入力履歴と混同しない |
| P08 ピース作成画面 | `PieceCreateScreen.js` | 戻る・見出し→元入力／準備の状態→作成／回復。保存ID・本人・元要求キーの束縛を保つ |
| P09 作成前・modal閉後の中間状態 | `InputPieceActionArea.js` | 元入力取得中／失敗→作成、元入力再確認、同じ保存／取消要求の確認、期限切れ再作成、保存済み確認を共通状態カード・ボタンへ。現在のnative Buttonも置換対象 |
| P10 新Pieceプレビュー | `PiecePreviewModal.js` | 状態→画像→全文→形式・配色・比率・ブランド→残枠／条件。回復群は本文内、主操作と閉じるへ必ず到達可能に。全資格・token・revision・要求を保持 |
| P11 自分のPiece一覧 | `PieceOwnerHistoryScreen.js` history | 見出し→状態→保存日・公開範囲・本文の一覧→追加取得。初回・0件・追加失敗・再試行・戻るを統一。新しい画像取得／生成を自動追加しない |
| P12 自分のPiece詳細 | 同 detail、`PieceOwnerCard.js` | 画像→本文全文→保存日・形式・公開範囲→画像操作→公開／削除。白／黒固定とnative Buttonを置換。themeは外側の関数screenからclassへ渡し、controller寿命を変えない |
| P13 画像準備・写真保存・共有 | 同詳細、`PieceVisualCard.js`の作品外案内 | 準備→写真保存／共有→処理中／完了／結果不明／同Piece再読。作品外の説明も共通色へ。OS操作前後の資格と外部画像を回収できない説明を維持 |
| P14 履歴メニュー | `PieceHistoryMenuScreen.js` | 戻る→説明→共鳴履歴／条件付き自分のPieceの行。owner-readフラグとtutorial条件を保持 |
| P15 共鳴履歴一覧 | `ResonanceHistoryListScreen.js` | 戻る→保持期間→新旧順→問い・投稿者・共鳴日時→追加取得。refresh・空・失敗・選択を一覧共通へ |
| P16 共鳴詳細への中継 | `ResonanceHistoryDetailScreen.js` | PieceLibraryへの既存replace中を共通読込表示へ。失敗・戻るの文言を利用者向けにし、新しい詳細画面を増築しない |
| P17 linkPayload時のPiece入口 | `PieceEntryScreen.js`→`PieceScreen.js` | 全体活動→閲覧・感情通知・探す・履歴を同じカード／行へ。通常Nexusと同じ外観。別の旧デザインを残さない |
| P18 おすすめmodal | `screens/piece/PieceRecommendModal.js` | 見出し・更新・閉じる→ユーザー行。P04と同じ階層で候補なし・取得失敗を表示 |
| P19 旧Q&A詳細 | `PieceLibraryScreen.js` | 戻る→対象ユーザー→表示するPiece→問い／答え全文→共鳴数／操作。保存作品画像とは区別し、読むUIの面・文字は統一 |
| P20 同・対象／問い選択modal | 同screen内Modal | 対象は自分・フォロー中・使用中の印。問いは新着／人気・New・共鳴数の行。選択後の全文、通信・空・失敗、tutorial指定／refを保持 |
| P21 同・共鳴modal | 同screen内Modal | 強度→任意メモ→保存／保存済み→解除。キーボードとスクロール、自己共鳴拒否・フォロー条件・通信中・解除確認を保持 |
| P22 tutorialのPiece表示 | `EmotionPiecePreviewModal.js`、`PieceTutorialCreateModal.js` | 同じUIで模擬表示を明示。前者は現役tutorial条件。後者は現在停止中の資産で、同じ設計対象に残すが刷新で有効化しない |

作品canvasのfont・色・計測・renderer版・recipe・保存hashと、アプリの操作枠は別。全画面統一で調整するのは外側UIであり、保存済み作品の世界観や旧画像を描き直さない。通常feedの旧Q&Aと、新保存canonical画像の機能差も保持する。

### 14.5 本人／他者アカウント・フォロー

| ID・対象 | 実装 | 配置と必要な操作／状態 |
|---|---|---|
| C01 本人アカウント | `AccountScreen.js`、`screens/account/` | プロフィール→ID検索→活動6指標。名前を主情報、IDを補助へ。名前編集、ID共有、プロフィールURL共有、公開設定、フォロー一覧を同じ操作体系へ |
| C02 他者アカウント | 同screenの他者分岐 | 同じ部品に公開条件・関係操作を適用。非公開／ID非表示／フォロー／申請中の状態を保持し、本人用操作を足さない |
| C03 名前編集modal | `AccountNameEditModal.js` | 公開案内→名前→確認・エラー→保存／取消。固定top140を避け、safe area・キーボード・文字拡大へ。処理中の閉じる条件を維持 |
| C04 公開設定modal | `AccountVisibilitySection.js`等 | 説明→アカウント公開／非公開→ID公開／非公開。選択はtonal＋文字／check。固定top120を避ける。非公開で推薦OFFになる連動は保持 |
| C05 本人のフォロー一覧 | `FollowListScreen.js` | フォロー中／フォロワー／申請中／承認待ち→名前＋行操作。狭い幅は2列2段、操作は次行へ。通知ON/OFF、解除、承認／拒否／取消、未読と各処理中を維持 |
| C06 他者のフォロー一覧 | 同screen他者分岐 | 前2タブと閲覧・更新を同じ一覧へ。本人用の通知・関係変更・申請タブを表示しない |

IDのコピー形アイコンは現在`Share.share`を呼ぶため、文言はID共有とする。現Accountの契約hookは表示へ使われていないので契約カードを追加しない。bio／cover編集・独立した推薦／ランキング設定も新設しない。フォロー関係の解除は現状の直接操作を保持し、見た目の作業で確認段階を追加しない。二段階確認を保持する対象は既存のアカウント削除等に限定する。

### 14.6 設定・契約・案内・チュートリアル

| ID・対象 | 実装 | 配置と必要な操作／状態 |
|---|---|---|
| S01 設定入口 | `SettingsScreen.js` | 見出し→短い説明→アプリ設定／加入状況／その他の3行。行は文字量で伸ばす |
| S02 アプリ設定 | `SettingsAppSettingsScreen.js` | 見た目→テーマ3択の色見本・名称・現在印、通知→全体と3子switch。全体OFFの説明、取得／更新中・部分保存失敗・復元を読み分ける。配信時刻の編集UIを新設しない |
| S03 その他・ログアウト・削除 | `SettingsOtherScreen.js` | tutorial再体験→別群のログアウト→末尾の危険操作。flag・認証・二段階確認・処理中停止を保持 |
| S04 加入状況・購入・復元 | `SubscriptionSelectScreen.js` | 現契約・更新／有効期限→販売状態→プラン比較→自動更新等の重要説明→復元・管理・規約・privacy・support。現在／購入中／復元中／保留／失効／停止を区別。復元を販売停止で一律に隠さない |
| I01 お知らせmodal／welcome | `NoticeModal.js`、`NoticeRichText.js` | 題名・配信日→長文・リンク→動的CTA→履歴／閉じる。welcomeも同じ面・本文へ。複数CTAでも本文と閉じるへ到達可能に |
| I02 お知らせ履歴・展開詳細 | `NoticeHistoryScreen.js` | 日付・題名・New／未読→展開本文・配信／既読日時・カテゴリ・CTA→追加取得。初回／追加読込・空・失敗を分ける |
| I03 各画面ガイド | `CocolonGuideScreen.js`、`GuideRichText.js` | 対象画面名→要約→説明section→関連用語。本文16/27、用語リンクは下線。screenId別／準備中も同じ設計 |
| I04 用語説明modal | `GuideTermModal.js` | 語名・読み→定義→説明・例→関連語→閉じる。×44以上、本文スクロール、関連語へ移っても閉じるを維持 |
| I05 初回tutorial開始案内 | `TutorialStartModal.js` | 一つの面に保存されない説明→開始→今回のみ／今後表示しない。三重の囲み枠を整理し、閉じ方を保持 |
| I06 tutorial導入・まとめ・完了 | `TutorialFlowScreen.js` | 導入、4体験、その他、完了を同じ見出し・本文・操作へ。模擬と本人記録を区別し、完了処理の二重操作停止を維持 |
| I07 各画面のtutorial overlay | `components/TutorialOverlay.js`、旧root `TutorialOverlay.js`、`tutorialScenarioData.js` | 説明カード・本文・次へを共通tokensへ。spotlight、対象ref、測定、代理押下、背景停止、上下配置は保持。全19stepの対象位置を改装後に確認 |

ガイド／tutorialの文言も現在仕様に揃える。残っている「Pieceは問いと答えに整えて投稿」「詳しい現在マップはPlus以上」、旧28日や旧plan差を現在の仕様説明として再使用しない。今日の問い履歴の「編集するとマップに反映」等は、分析sourceの現ownerと照合して文言を確定する。画面の説明を直すためにAIや権利の仕様を変更しない。

### 14.7 経路の取り落としを防ぐ対応

現在の起点は`index.js → AppRegistry(App) → AppRuntimeBootstrapGate → RootNavigator`。RootからAuthかMainTabsへ分岐する。主タブはInput／Analysis／Piece／Settingsの4つ。

| Stack | 登録されている個別route | 共有route |
|---|---|---|
| Input | Input、TutorialIntro、InputHistory、TodayQuestionHistory、NoticeHistory | Account、CocolonGuide、SubscriptionSelect、FollowListScreen |
| Analysis | Analysis | 同上 |
| Piece | Piece、PieceLibrary、TutorialFlow、PieceHistory、PieceOwnerHistory、PieceCreate、ResonanceHistoryList、ResonanceHistoryDetail、EmotionLog | 同上 |
| Settings | Settings、SettingsAppSettings、SettingsOther | 同上 |

34登録・重複除外22route名だが、これはユーザー画面の総数ではない。同じ実装の複数入口は同じデザインを使い、戻り先・params・通知からの入口を保持する。`TutorialIntro`と`TutorialFlow`は同じ`TutorialFlowScreen`、`InputHistory`は`AnalysisHistoryScreen`、`EmotionLog`は感情通知の`EmotionLogScreen`。`PieceLibraryScreen`という互換aliasを、新しい登録route名として増やさない。

分析には内部route `home / history / reportHistory / reportView / emotionAnalysis / selfStructure / inputHistory / selfReportHistory / selfReportView / selfReportGenerate / todayQuestionHistory`がある。Stack登録だけを見て完了判定しない。Piece入口のNexus／linkPayload時のPieceScreenの両分岐も含む。

休眠の`AnalysisTopScreen.js`、`ProfileCreateScreen.js`、RankingTopと5種ranking screen、および未接続の旧描画部品も、旧外観を流用しない対象として管理する。現在の導線へ表示されていない事実と、デザイン適用除外を混同しない。スタイルを共通化しても、廃止されたRankingや停止中機能を再接続しない。Expoの`app/_layout.tsx`／`app/+not-found.tsx`は現起動経路外の旧scaffoldで、通常画面数へ加算しない。

| 現在表示しない資産 | 現物にある表示と共通化先 |
|---|---|
| `AnalysisTopScreen.js` | 感情分析／わたしマップの2カード・更新日・未読・表示操作を共通メニューへ。現在のContentFirst入口は維持 |
| `ProfileCreateScreen.js` | 5問・回答数・折畳み／展開入力・各secret・保存をフォーム／設定行へ。can_edit・部分保存・keyboardを保持。説明内の公開範囲の矛盾を新仕様として採用しない |
| `RankingTopScreen.js` | 4指標カード・上位5行・全表示・JST注記を共通の指標／一覧型へ。入口は復活させない |
| `EmotionRankingScreen.js` | 今日／7日／30日／全体、感情名・件数・更新を共通の期間選択／集計行へ |
| `InputCountRankingScreen.js`／`InputLengthRankingScreen.js` | 同じ4期間、順位・名前・非公開印・入力数／総文字数・Account遷移を共通一覧へ |
| `PieceResonanceRankingScreen.js` | 同じ一覧型で共鳴数の意味を維持。人物理解の点数へ装飾しない |
| `LoginStreakRankingScreen.js` | 順位・名前・連続日数・更新。期間1択は選択controlへせず表示。未接続の旧Ranking戻り先を現行導線と扱わない |
| 未接続の旧描画・模擬UI | `SelfStructureDeepRenderer`の本文／役割／行動／gap、`NexusEmotionRankingCard`、停止中PieceTutorial、`AnalysisCrossLinkSection`、旧root `TutorialOverlay`も同じtokensへ。データ形式・表示停止は保持 |

8つの休眠screenもrender／styleを追加読取して上表へ含めた。現在の`index.js → AppRegistry(App)`へ接続していないことは、デザインを旧外観のまま使う許可ではない。

## 15. 実装の進め方と完了条件

### 15.1 一度に全ファイルを変えず、全画面分を完成させる

**範囲は全画面、実装・検査・保存は画面群ごと。** 共通部分と各画面の固有表示が併存するため、一括で大量変更すると、見た目の欠けや操作不具合の原因を追いにくい。途中のGitHub保存は処理停止後の再開点にする。主要4画面だけを完成版にせず、同じUI改装の残件として全表を進める。

| 作業単位 | 含める範囲 | その区切りで確認して保存するもの |
|---|---|---|
| 1 共通・起動・認証 | tokens、ボタン／選択／戻る／switch、主frame、nav、native起動、runtime、Auth | 子Text／icon／無効状態まで含めた色と書体。3テーマ、起動の連続、認証フォームとキーボード。下記の既知の色不整合を先に修正 |
| 2 入力・応答・問い・履歴 | H01–12、入力／問い履歴からの応答再読 | 入力二欄・全選択、本人別draft、保存と応答の区別、全modalの長文・dismiss・回復、一覧からの全文 |
| 3 分析全体 | A01–14、旧保存結果、戻り先メニュー | 日週月、埋込み／全面表示、月次・現在比較・根拠、未確定、全履歴・条件付き表示。表示内容とプラン境界を保つ |
| 4 Piece・感情通知・共鳴 | P01–22、Nexusと条件付き旧Q&A | 作成前→preview→保存→履歴→詳細→画像操作、全回復、4タブ・対象選択、旧Q&A・共鳴。保存画像はそのまま |
| 5 アカウント・設定・契約 | C01–06、S01–04、各Stackからの共有入口 | 本人／他者、公開条件、フォロー全状態、通知の親子、購入／復元／管理・無効CTA、削除の既存確認 |
| 6 お知らせ・ガイド・tutorial・全体仕上げ | I01–07、休眠資産のstyle、全画面の横断確認 | 全19stepの対象位置、本文リンク・説明、全入口／戻る／通知・長文・文字拡大。全画面の対応漏れを閉じる |

共通部品に新しい不具合が見つかった時は、その部品と影響画面を同じ区切りで直す。固定順序のために誤りを次群へ先送りしない。上表の区切りは新しい承認待ちや恒久checkerを増やすものではない。既存の設計資料とGitHub履歴に、済んだ表示・残る表示・確認結果を置換記録すればよい。

通常のビルド・テスト配布は全画面のsource反映をまとめてから行い、Mashに画面群ごとの反復導入を求めない。nativeやキーボード等、途中でビルドしないと判断できない問題が実際に生じた場合は、その確認に必要な中間ビルドだけを行う。作業を分けることと、旧新混在を完成扱いして配布することは別。

### 15.2 今回見つかった優先修正

| 現物で確認した点 | 次の実装に必要な修正 |
|---|---|
| Input選択面はtonal、感情iconは白`ACCENT_TEXT`のまま | `InputEmotionSection`の選択iconを`ON_SURFACE_TONAL`へ。ラベルだけでなくiconも確認 |
| 契約の`planCtaTextDisabled`が未定義 | 明るい無効面上に白文字を残さない。disabled前景を明示し、spinner／子iconも各面に対応 |
| Authはindigo・白card固定、一部文字だけtheme対応 | 外枠・入力・本文・操作を一括して3テーマへ。スクロールとキーボード回避を追加 |
| InputPieceActionArea／OwnerHistory／OwnerCard等がnative Button・白黒固定 | 全中間状態・一覧・詳細・作品外案内へ共通UIを適用。classの処理寿命を表示変更から分離 |
| 入力履歴の白固定・斜体、分析履歴の既読opacity、旧viewerの独立色 | 全文を通常書体へ、既読は印へ。保存版の意味は維持して外側を統一 |
| 今日の問いmodalに本文スクロール・safe area・キーボード回避が不足 | 共用の長文入力modalへ。問い・回答・閉じる・送信の全てへ到達可能に |
| TutorialOverlayの生成り・茶枠・黒文字、native起動の旧色が固定 | 全部のテーマ／起動資産を共通色へ。模擬画面も例外にしない |
| 共通部品を子の独自styleが上書き、Pressableで状態propsが渡らない | `MenuActionCard`等の子Text／icon／影も移行し、選択・無効のアクセシビリティ情報を渡す |
| 感情通知の淡色面と濃色文字が固定 | 感情色相は保ち、全テーマで面と文字の組合せを確認 |

これらは全画面設計時点の優先事項。§17で感情選択icon、契約の無効CTA、Auth、共通部品、native起動を修正した。残りの各画面は同じ改装の残件として進める。前回400 PASSや今回401 PASSを全画面の視覚的完成の証明にしない。

### 15.3 全体の完了条件

1. §14の全表示へ同じ色・文字・面・余白・操作を適用し、初回反映済みも含めて一巡する。起動・認証・条件分岐・戻り先・モーダルを残さない。
2. default／ホワイト＆ゴールド／ブラック＆ネイビー全てへ実装を対応させる。各レイアウト型で3テーマ・文字拡大・狭い幅を確認し、長文・複数回復操作・比較・認証は個別にも確認する。
3. 各画面を標準条件で確認し、共通の型だけで個別画面の表示確認を代用しない。短いiOS横画面、キーボード、safe area、実際のタップ領域と読み上げも対象にする。
4. 全機能の既存操作・権限・本人境界・回復・未読・tutorialを保持する。UI検査は既存の合成状態／fixtureを使い、実際の課金・削除・公開を見た目確認のためだけに行わない。
5. source反映・自動検査・native build／Upload・本人端末での見え方を別々に記録する。標準一覧と、空／読込／失敗／結果不明の状態も、適切な型・高リスク箇所で確認する。
6. 旧新混在を今回の改装完了としない。Mashへ最終確認を依頼する前に華恋が全体を確認し、既知の欠け・読めない操作・切れた本文を直す。

今あるプレビューは方向性を共有した4画面の参考。全画面実装の証拠として使い回さず、残る画面を単にその4画面の外側へ色だけ当てて完了にしない。

## 16. 確認範囲・根拠・今回の変更

今回確認したものは、固定refの全体現在地、現在の起動／全Stackの登録、分析内部routeと戻り先、Piece入口の分岐、および§14の各表示の実ファイル・render・style・関連状態。認証は`screens/`外、起動はnative資産も含めて照合した。画面群を分担したread-only reviewと、経路の独立照合を統合し、文書のwriterは華恋一人。

`screens/*Screen.js`は40fileあり、現在のStack／分析内部／Piece入口から参照される32fileには画面切替containerも含む。8fileが現在未接続。これらの数字をユーザー画面数・全状態数・実機確認数へ換算しない。

| 範囲 | 直接確認した主な実ファイル |
|---|---|
| 全経路 | `index.js`、`App.js`、`AuthContext.js`、`navigation/RootNavigator.js`、`MainTabs.js`、Input／Analysis／Piece／Settings／Ranking各Stack、navigation constants／ref／linking／notification、analysis route model／state、`PieceEntryScreen.js` |
| 入力・履歴・問い | `InputScreen.js`、`AnalysisHistoryScreen.js`、`TodayQuestionHistoryScreen.js`、`screens/input/`のMemo／Emotion／Category／Action／Startup／Toast／FeedbackReply／PiecePreview／PieceActionArea／EmlisThreadModalと関連state、`TodayQuestionCard.js`／`TodayQuestionModal.js` |
| 分析 | `AnalysisScreen.js`、ContentFirst／Emotion／SelfStructure／InputHistoryMenu／Top、ReportHistory／Viewer、SelfStructureReportGenerate／History／Viewer、`screens/analysisReport/`のCharts／Upgrade／CurrentWeather／ForecastStrip／DetailModal／Constants、`components/selfStructure/`のCumulative／V2／旧Rendererと構成部品 |
| Piece・social | PieceCreate／OwnerHistory／HistoryMenu／Library／PieceScreen、ResonanceHistoryList／Detail、Nexus／EmotionLog、`components/piece/`のPreviewModal／OwnerCard／VisualCard、`screens/nexus/`のHeader／TabBar／Feed／PieceCard／EmotionLog／History／Recommend／OwnerPicker／Summary、`screens/piece/`のHomeActions／Recommend／TutorialCreateと関連条件 |
| アカウント・お知らせ | `AccountScreen.js`、`FollowListScreen.js`、`screens/account/`の表示部品／hooks、`NoticeHistoryScreen.js`、`NoticeModal.js`／`NoticeRichText.js` |
| 設定・説明・起動 | Settings／AppSettings／Other／SubscriptionSelect、GuideScreen／RichText／TermModal、TutorialStartModal／Overlay／FlowScreen／Context／scenario、guide本文・用語、runtime3file、共通操作部品、iOS LaunchScreen／Info.plist、Android Manifest／MainActivity／colors／styles／drawable |

確認は実装と経路の照合。**全画面の端末描画を閲覧した、全操作を実行した、全画像資産の画素を確認したという意味ではない。** 実機・native描画・3テーマ横断の最終確認は未実施として残す。

今回の変更は既存UI設計・入口・全体現在地・議事録の更新のみ。製品JS／native／API／DB／画像／購入／削除／公開、ビルド・配布、GPU・Render・Supabaseの変更は0。プレビュー原本も変更0。全画面統一の確定と、画面群ごとの実装・保存という推奨手順を具体化した。STRUCTURE_MAP_DELTA_NONE：商品route・component責務・意味／保存契約は変更していない。



## 17. 11/6 実装区切り1 — 共通・起動・認証

Mashが全画面実装の開始と、全画面source完成後にビルドをまとめる方針を明示。通常pushでPiece検査workflowのnative compileが走るため、途中のUI commitは `[skip ci]` とし、既存Node検査と構文・XML検査をlocalで実施する。workflow・依存・配布設定は変更しない。全UI実装完了後に必要なnative検証と配布buildをまとめる。途中で実機が必要な具体的問題が出た場合のみ、その必要性を説明する。

| 実装対象 | この区切りの変更 |
|---|---|
| 共通tokens | modal22/30、入力16/27、meta12/18の役割追加。既存サイズ推定を保持しつつ明示roleで太さ・行間を適用可能に。3themeへエラー前景／面を追加 |
| 共通操作 | Pressableが選択・無効・hint/valueを受け渡す。戻る44角、switchのtheme track。MenuActionCardの子文字・icon・丸み・強い影まで統一し、長い見出しを既定で省略しない |
| Auth4mode | ログイン／登録／再設定メール／新password設定を同じ面へ。入力ごとの可視ラベル、本文色、16文字、ScrollViewとkeyboard回避、共通主button。submit／recovery／再送／入力条件は保持 |
| 起動・通信状態 | RNのブランド＋読込、最低version停止画面の本文scroll・共通再試行、通信bannerをtonal化。再試行時のchildren位置・draft寿命を保持 |
| native launch | iOSの旧taglineと静的pulseを整理しplum＋lavenderへ。既存logoとloadingの制約を維持。Androidの既存pulse形状を独立vector名で表示し同色・mask内余白へ。同名PNGの密度別選択へ依存しない |
| 先行して見つかった不整合 | Input選択iconをtonal文字色へ。契約disabled CTAの前景を定義し、処理中spinnerもdisabled面に対応。購入条件と状態分岐は保持 |

製品17file、既存test1file、現在地・本設計・weekly3fileを同じ区切りで反映する。新製品fileは既存Android splash用vector1点のみ。新route・JS component・依存・API/DB/AI・作品renderer変更なし。構造mapの論理owner変更はなく、native資産の参照変更を本節に固定する。

検証：既存5入口のNode検査 **401 PASS／FAIL0／SKIP0**。3themeの本文・補助・選択・エラー・主操作の色の可読性、role適用と未指定style／ブランド保持、再試行callbackとloading/disabledの共通部品結線を確認。変更JS14fileのBabel parse、XML4fileのparse、storyboardの全constraint参照、diffの空白検査を通過。read-only reviewで契約spinnerが無効面に白で残る点を修正した。検査はReact/native・Auth/HTTPの代替を含み、端末描画・全操作実行の結果ではない。

**未実施：** app/native build、CI native compile、Upload、TestFlight、本人端末表示。共通・起動・認証も最終実機確認は残す。UI全画面の完成宣言ではない。次は§15.1の入力・応答・問い・履歴を続ける。


## 18. 11/6 実装区切り2 — 入力・応答・問い・履歴

区切り1を[683c7f6](https://github.com/MassyuRed/Cocolon/commit/683c7f60d88c48bde037d695cab9ff89bf78e2bc)へ保存し、全21blob本文・親・変更path集合・branch headをGitHubから照合した後、同じ全画面改装の入力群を進めた。

| 対象 | 実装内容・保持した条件 |
|---|---|
| Home・入力 | 問い／履歴の入口を44以上・折返し可へ。説明・meta・通知設定・案内の文字役割、カード・影を統一。カテゴリの選択読み上げ、入力欄ラベル、共通switchの色を適用。本人別draft、入力IME／defaultValue、選択規則、保存・timeout・通知・tutorial refsは保持 |
| 入力履歴 | 白固定・斜体を外し、日付→感情→思考／行動全文→カテゴリ→応答の記録カードへ。検索／filter／sort／条件も同じFlatListのscroll対象とし、短い横画面で本文が押し出されない構造へ。検索hitは可読なtonal面。追加取得・refresh・削除確認、非表示Secret変更を保持 |
| Emlis応答・仮の理解 | 最大幅520・角丸24・safe area、応答／質問／履歴／仮の理解を区分。裸の説明文字にも本文／補助役割。質問と入力を別の面へ。横画面＋keyboardでfixed footerの最低高さが収まらないため、既存末尾2操作も本文scroll内へ移した。onDismiss後のPiece引渡し、閉じる、再読上限、回答上限、同一要求再送・本人／資格条件は不変 |
| 今日の問い | 問い本文16/27/400、方式と選択肢はtonal＋check印・選択読み上げ、自由回答の可視ラベル・16文字。textarea上限を画面の一部へ抑え、modalをsafe area＋keyboard回避＋scrollへ。modal見出しの読込spinnerを維持。配信前・回答済み・optional一言・payload・ID/version resetは保持 |
| 問い履歴・編集 | 最大幅640、カード24、本文／入力／補助を役割別に、選択／展開状態を読み上げへ。keyboard回避。取得失敗を0件と分け、表示中の回答とpageを保ち同じoffsetから再試行。Plus編集・60件・ID重複除去・iOS入力・anchorを保持。V2への採用を保証しないため「マップに反映されます」を「回答を更新しました」「過去の回答を確認・編集できます」へ |
| 下書き・旧fallback・tutorial旧Piece | 見出し・説明を本文と一緒にscroll可能にし、固定620／最低380等を撤去。外側一枚・控えめな面と影・本文400。復元／破棄の二択必須、passed本文の無加工表示、模擬表示のhideCancelButton／処理中条件を保持 |
| 共通button補修 | disabledを透明度で薄くする表示からFIELD_BG＋TEXT_SUBTLEへ。処理中spinnerも同じ前景。押下・loading／busy・callback・caller優先順は保持 |

製品変更15file：`CocolonButton`、`EmotionPiecePreviewModal`、`TodayQuestionCard/Modal`、`AnalysisHistoryScreen`、`InputScreen`、`TodayQuestionHistoryScreen`、Input内`EmlisThreadModal/InputActionArea/InputCategorySection/InputFeedbackReplyModal/InputMemoSection/InputStartupModals`の13fileに加え、共通buttonの無効面の影響を受ける`PieceTutorialCreateModal`と`PieceLibraryScreen`の既存子文字・iconも同時補修。後者2fileの画面全体の仕上げを終えたとはしない。既存test2fileと新しい失敗回復test1file、文書3fileを同じ区切りで反映。新route・製品JS owner・依存定義・API・DB・AI／作品renderer変更なし。

検証：既存6入口＋問い履歴回復の実screen検査2件で **447 PASS／FAIL0／SKIP0**。初回失敗→0件と区別→再取得、続きの取得失敗→既存回答保持→同じoffset再試行→重複除去を実componentのcallback経由で確認。既存Piece入力44件は保存・本人／timeout等の結線を確認する代替環境。変更JS18fileのBabel parseとdiff空白検査も成功。最初の検査では既存TypeScript未配置と旧マップ反映文言の期待に失敗し、既存pinned5.2.2を一時環境へ用意・意図したcopy期待を更新した。リポジトリの依存定義は変更しない。

read-only reviewで、問いmodalのhideHeaderによるspinner非表示、Emlis fixed footerの短画面overflow、共通frameと履歴の上下safe area重複を修正。共通buttonの変更が任意React childの文字へ届かないため、上のPiece2callerの白文字／iconも明示補修し、処理中は共通loadingへ渡した。検査はReact・native・Auth/HTTPの代替を含み、実機での見え方・タップ・読み上げの確認ではない。

**次のsource作業：** §15.1の分析全体→Piece・social→アカウント・設定・契約→案内・tutorial・休眠資産と全体仕上げ。H01〜H12も最終実機検査まで完了扱いしない。app/native build・CI native compile・Upload・配布・実機確認は未実施。途中commitは引き続き`[skip ci]`、全UI source完成後にまとめてbuildする。

<a id="ui-analysis-material-20261106"></a>
## 19. 11/6 実装区切り3 — 分析全体

入力群の保存済みhead `2ff59e188be86f392ffd67480cb6447e5daa9b4a` を起点に、A01〜A14の実表示を揃えた。関係48source／資料のlocal bytesを同headのGit blobと照合し、前提・最新weekly・設計と現物から継続。全UI統一と、全source完了後にまとめてbuildするMashの方針は不変。

| 範囲 | 今回の表示変更と保持した条件 |
|---|---|
| 分析入口・補助メニュー | 見出し・説明・更新日時・二段tab・未読・履歴操作を同じ文字階層とtonal選択へ。選択／展開を読み上げへ渡し、長いラベルを折返す。共通scrollの左右safe areaと最大幅を確保。今の天気→二段選択→内容→履歴、tutorial ref・操作停止、内部routeと戻り先は維持 |
| 今の天気・日週月 | 静的cardの強い影、白固定・黄色／茶文字、900太字を整理。主情報と観測メモを分け、本文16/27/400。日付一覧は168幅・内容に応じた高さとし、ラベル・メモを切らない。前回参照、no_observation、温度・中心感情・揺れ・memo.visibleを保持 |
| 天気詳細・図 | 独立SafeAreaProvider内で、長いメモ・時間帯を縦scroll、期間／時間帯の横scrollと44の×を維持。背景tap／Android戻るも同じcloseへ。週月グラフは固定列が狭幅で溢れない横scrollへ。感情識別色・数値・集計は不変。時間帯リングの補助数値は5感情すべてを0%込みで表示し、全0は従来の不足表示を維持。埋込みhideHeaderは見出しだけを抑制し、期間は残す |
| 天気履歴・月次マップ履歴 | 配布予定・閲覧範囲・説明・エラーを同じFlatListのheaderへ。初回読込／0件も一覧内に置き、短画面で本文が押し出されない構造に。記録カード・44操作、既読は薄くせず既読trueだけ印へ。月次は月を主情報に、保存日時は別meta。cumulative.v1を一律未読扱いしない。天気の追加取得失敗は元の行とoffsetを保ち再試行を表示 |
| 現在・当時・比較 | Cumulativeのembeddedは自然高View、全面はScrollViewとし、親との縦scroll二重化を解除。現在・当時を同じsection階層、分析日時と月次保存日時は別metaに。全蓄積／coverage／未解析／編集前補足の説明、3plan共通の現在map、月次2／12／全期間、当時版不変と比較失敗時の保持、owner／seq／保存identityを維持 |
| 根拠・V2 | 根拠modalは最大幅640・角丸24・内側20・本文scroll＋閉じる。思考／行動／本人補足、分析後編集の注意と通信失敗を区分し、原文を無加工表示。V2 nodeの読み上げgroup化を外し、子の根拠buttonへ到達可能に。edgeの無方向／明記順序と原因でない説明、unknown／conflictを保持 |
| 旧保存map・旧描画 | WatashiMapRenderer／Deepへ実uiと明示roleを渡し、5構成部品の本文・役割・ルート・分かれ道・未観測を同じ型へ。固定118幅の説明列と3列比較は縦へ。役割matrixの横scroll・score／dotは維持。Legacy Generate／Viewerのmode・tier・version分岐・アンカー移動、非表示mode／PDF／CrossLinkを保持し、保存内容を新累積へ置換しない |
| 休眠資産 | AnalysisTop等の共通メニュー資産と、AnalysisScreen内の未接続helperのstyleも統一。呼出・routeを復活させず、ブランド書体と図の点記号は操作文字から分離 |

製品16file：`components/selfStructure/{CumulativeWatashiMapView,SelfStructureDeepRenderer,WatashiMapRenderer,WatashiMapV2Renderer}.js`、`screens/{AnalysisContentFirstScreen,AnalysisMenuCommon,AnalysisReportHistoryScreen,AnalysisReportViewerScreen,AnalysisScreen,SelfStructureReportGenerateScreen,SelfStructureReportHistoryScreen,SelfStructureReportViewerScreen}.js`、`screens/analysisReport/{AnalysisReportUpgradeCard,KokoroWeatherCurrentCard,KokoroWeatherDetailModal,KokoroWeatherForecastStrip}.js`。既存分析test2fileは共通button・実tokens・safe areaへのharness適応と、埋込みscroll／根拠操作の回帰assertを追加。新製品file・依存定義・route・公開API／DB／AI／意味型・保存本文・作品画像変更なし。構造ownerは既存のまま。

検証：前回の7入口＋累積／旧V2の既存2入口を同時実行し、**478 PASS／FAIL0／SKIP0**。追加31件はowner・tier変更、遅延応答、月次・比較失敗、保存同一性、根拠closeと本文／artifact一致等の実React検査。既存assertへ、embeddedの縦ScrollViewゼロと根拠button到達・同じnode_refの引渡しを追加。13style ownerの615 role×theme組合せでサイズ・行間・太さを実関数から照合。変更JS18fileのBabel parseとdiff空白検査成功。React Native・Auth／HTTPは代替を含み、実端末の描画・ジェスチャー・読み上げ成功の証明ではない。

補助reviewで、残っていたDeep棒の固定色、戻る左右幅の非対称、空表示のrole漏れを修正。検証依存の通常取得はtransitive packageの404となり、既存の同version React／renderer／Babel coreと、正本に固定されたpreset／pluginを一時環境で組み合わせて実行。製品／test-toolsの依存定義は変更しない。

**次の作業：Piece・socialの全表示。** その後アカウント・設定・契約、案内・tutorial・残る休眠資産、全体横断を続ける。全画面source完成までbuildを保留し、途中commitは`[skip ci]`。今回のapp/native build・CI native compile・Upload・配布・本人端末確認・Render／Supabase／GPU操作は0。TECHNICAL_CREDITはsourceと限定検証に限り、全UI完成・実機合格・分析品質向上へ換算しない。

<a id="ui-piece-material-20261106"></a>
## 20. 11/6 実装区切り4 — Piece・投稿・感情通知・共鳴

前回の分析群を保存した `be6f4162afd602a017f4232f91d8aa2f5b5994b4` を固定起点に、P01〜P22の描画と既存状態を確認して反映。保存済み作品の世界観と、アプリの操作文字を分ける。全画面統一・例外なしと、全source完成後にまとめてbuildするMashの方針を保持する。

| 範囲 | 今回の表示変更・保持した条件 |
|---|---|
| Nexus・4タブ | 投稿／感情通知／おすすめ／共鳴の4タブを狭幅でも区分できる折返し配置へ。表示対象・新旧順をtonalと選択読み上げで示し、長い名前を省略しない。投稿は投稿者・日時／未読→問い→答え16/27/400→共鳴、本人削除は本文を覆わない独立操作へ。API・対象絞込み・自己共鳴とフォロー条件・削除確認は保持 |
| 感情通知・おすすめ | 通知は名前・時刻・感情／強さだけを表示し、メモ本文は追加しない。感情5種の既存hue背景を残し、文字をテーマのinkへ。感情ログの重複見出しを整理、戻る・guideと更新／フォローを分け、全体をscroll対象へ。mock通知・未読・完了条件は保持。おすすめは名前・共有コード・矢印、読込／失敗／0件を区別 |
| 作成前・回復 | PieceCreateとInputPieceActionAreaを同じ面・本文・共通Buttonへ。保存入力取得、作成停止、結果不明、同一保存／取消要求、期限切れ、元入力再確認、保存済みへの入口は既存条件のまま。親から色・文字を渡し、classのstamp・controller寿命・保存ID／本人／要求キー・一度だけ消費するnavigation要求を変更しない |
| 新プレビュー | 画像→全文→形式／配色／比率／ブランド→保存枠／条件。選択中の操作はtonal、実配色見本の内側はrecipe色を維持。長い説明・回復操作を本文scrollへ、初回保存と閉じるは固定して到達可能に。独立SafeAreaProviderと全辺を維持。資格・token・revision・元要求・期限・保存条件は不変 |
| 本人履歴・詳細・画像操作 | 最大幅680（左右20を含む）、カード24／内側20、本文16/27/400。一覧は全文と保存情報、詳細は画像→本文→保存情報→画像操作→公開／削除。共通Button・テーマ色へ。続き／詳細／削除再確認、同じPieceの再読、OS開始後の結果不明、外部画像は回収できない説明を保持。自動thumbnail取得・画像準備は足さない |
| 共鳴履歴・中継 | 保持期間・新旧順・失敗を同じFlatListのheaderへ。取得中もheaderを表示し、0件の中央寄せがheaderを縮めない。投稿者・日時を全文へ。追加取得・50件・refresh・保持期間と既存詳細replaceを維持。中継失敗は利用者向けの戻り案内にし、長文scrollへ |
| 条件付き旧Q&A・modal | linkPayload時の旧Piece入口とLibraryも同じ文字・面へ。問い／答え・共鳴数を保持し、新画像Pieceと混同しない。おすすめ・対象・問い・共鳴・停止中tutorial modalへ全辺safe area、全面scrim、可変高scroll。強度／メモの既存keyboard追従を保持、停止中tutorial資産へkeyboard回避を追加。通常の共鳴は既存のmedium・memoなし直接送信を維持し、未使用modalを接続し直さない。tutorialSurfaceEnabled=falseを保持 |

製品26file：`components/piece/{PieceOwnerCard,PiecePreviewModal,PieceVisualCard}.js`、`screens/{EmotionLogScreen,InputScreen,NexusScreen,PieceCreateScreen,PieceHistoryMenuScreen,PieceLibraryScreen,PieceMenuCommon,PieceOwnerHistoryScreen,PieceScreen,ResonanceHistoryDetailScreen,ResonanceHistoryListScreen}.js`、`screens/input/InputPieceActionArea.js`、`screens/nexus/{NexusEmotionLogSection,NexusEmotionRankingCard,NexusHistorySection,NexusOwnerPickerModal,NexusPieceCard,NexusPieceFeedSection,NexusRecommendSection,NexusTabBar,NexusTodayEmotionSummary}.js`、`screens/piece/{PieceRecommendModal,PieceTutorialCreateModal}.js`。未接続NexusEmotionRankingCardは描画資産のみを整え、有効化しない。InputScreenはappearance propsの受渡しだけ。

既存test5fileは、共通Buttonのalias・実UI tokens・追加appearance props・safe areaへのharness／静的期待の適応のみ。新製品file・新route・依存定義・公開API／DB／AI・Piece本文／recipe／hash／保存版の変更なし。通常経路・component責務は既存のままで、STRUCTURE_MAP_DELTA_NONE。

検証：既存7入口（画面contract、theme可読性、Piece owner-history、preview-display、initial-save-modal〔hostも内包〕、input-screen、renderer）で **814 PASS／FAIL0／SKIP0**。初回6失敗は空のUI tokensを返す旧harnessと、appearance props追加前の静的期待によるもの。実tokensの読込と必要な期待へ適応し、保存・回復・本人／focus／runtime失効条件を緩めていない。変更JS31fileのparse、diff空白検査、8style ownerの471 role×themeでサイズ・行間・太さを照合。OwnerHistory／InputActionArea／VisualCardのrender以外のclassメンバーと、`piece-logical-canvas` subtreeは変更前とAST一致。renderer検査は合成の計測・native callback代替で、実描画の再確認ではない。

補助reviewで、無効／選択文字、狭幅見出し、長い対象名、0件と失敗の混同、safe area帯だけ暗転しない表示、回復群の高さ、履歴headerの中央寄せと読込中非表示を補修。writerは華恋一人、補助はread-only review。

**次のsource作業：アカウント・設定・契約。** その後、案内・tutorial・残る休眠資産と全体横断を仕上げる。全画面source完成までbuild保留、途中commitは`[skip ci]`。app/native build・CI native compile・Upload・配布・実機表示・Render／Supabase／GPU操作0。全UI完成・実機合格・一般Piece文章品質の改善とは扱わない。

<a id="ui-account-settings-material-20261106"></a>
## 21. 11/6 実装区切り5 — アカウント・設定・契約

前回のPiece群を保存した `642069b255984ea70a11f8ae37f2d9b262391fd7` を固定起点に、C01〜C06・S01〜S04の本人／他者・各操作状態と実装を確認。全画面統一、全source完成後にまとめてbuildするMashの方針を継続する。

| 範囲 | 今回の表示変更と保持した条件 |
|---|---|
| アカウント | プロフィール・ID検索・活動6指標を角丸24の面と文字階層へ。名前は22/30/600の主情報、ID・人数・指標は別の補助／本文へ。長名を省略せず、指標のラベルと値を縦にし、検索入力は16/27・52以上へ。左右safe area、外幅680／内側20、keyboard回避とscroll。共有は既存Share.shareのまま、IDのiconも共有へ合わせる。本人だけの編集／公開設定、他者のフォロー／申請中、非公開・ID公開条件、未使用契約hookは維持 |
| 名前・公開設定modal | 固定top140／120・左右位置を外し、独立SafeAreaProviderと全辺safe area内の可変高scrollへ。名前編集はkeyboard回避、公開案内を入力前に常設、保存／取消を共通Buttonへ。保存・重複確認中の閉じる拒否と15文字・名前検査は保持。公開設定は説明→公開／非公開の選択へtonal＋check＋読み上げを付け、保存中の操作停止と閉じる条件を維持。非公開と推薦OFFの連動、ID公開の独立PATCHは不変 |
| フォロー一覧 | 本人4タブ・他者2タブを同じ2列配置へ。戻る／更新は44、画面名・タブ・errorもFlatListのscroll対象、取得中も条件を読める。名前／非公開印・申請日・通知状態と、関係操作を別段／別tapへ。正常0件と取得・操作失敗を分離し、通知ON/OFF・承認／拒否／取消・解除をtonal／danger／無効面で区別。対象requestだけbusy、全申請操作disabledの既存条件は維持。300件取得・本人条件・未読・楽観更新／rollback・直接解除は不変。新しい確認やbusy制御は足さない |
| 設定入口・テーマ | S01の3入口は既に共通のAnalysisMenuScroll／MediumCardへ接続済みで、その配置を確認。S02は3テーマの実paletteから背景／操作色の見本、現在印・tonal文字へ。保存ID・名称・順序・setThemeNameは維持。通知の親子4行は無効時も薄めず補助文字、switchは親行の読み上げ対象を一つにし、指操作のcallbackは保持 |
| 通知の状態 | 既存の読込・保存フラグで進行を表示。4取得経路のcatchへ、現在の本人に結び付けた表示専用の失敗情報を追加し、失敗した項目名を案内する。旧ownerの遅い失敗はcancelled guardで捨て、現在本人と一致するものだけ表示。従来のtrue fallback・値・保存可否・通信・時刻／timezone・保存handlerは変えない。親OFF→子3件、親失敗→4値復元、子だけの部分失敗→OFF維持＋既存Alert、親ONで子を自動ONにしない動作を保持 |
| その他・危険操作 | 再体験→別群のログアウト→末尾の削除を余白で区分。既存共通カードへ既定falseのdisabled／destructive表示を追加し、isBusyを実表示と読み上げへ。削除はERROR_BG／ERROR、無効は通常面／TEXT_SUBTLE。feature OFF時の説明Alert、入口と実行での本人確認、二段確認、削除→local cleanup→signOut、再体験／未読／遷移は不変 |
| 契約・購入・復元 | 現プラン・更新／期限→販売状態→プラン→重要説明→復元／管理／規約等を同じ文字・面へ。長い見出し・プラン名／おすすめ・リンク／CTAは折返し、本文16/27、購入52・補助操作44以上。CTAの利用中／手続き中／受付停止と復元不可を明示。販売停止で復元を隠さず、既存のrestore_enabled条件を維持。管理・URL・support条件、購入判定・価格・features・note・owner処理は不変。商品情報取得失敗で利用者にBundle ID等の開発者設定確認を求める文言だけを改めた |

製品11file：`screens/{AccountScreen,AnalysisMenuCommon,FollowListScreen,SettingsAppSettingsScreen,SettingsOtherScreen,SubscriptionSelectScreen}.js`、`screens/account/{AccountIdSearchSection,AccountNameEditModal,AccountProfileSection,AccountStatusSection,AccountVisibilitySection}.js`。S01本体は共通部品への既存委譲を確認し、不要な編集を足していない。新製品file・route・依存・API／DB・課金価格・公開／削除契約・AI／分析／作品画像の変更なし。既存の表示責務内の任意props追加と表示専用エラー情報で、STRUCTURE_MAP_DELTA_NONE。

検証：既存4入口（rn-screen-contracts、theme-readability、iap-restore-purchases、subscription-owner-race）は **95 PASS／FAIL0／SKIP0**。追加の一時検証で、実SettingsAppSettingsScreenをReact／renderer18.3.1・Babel core7.25.2の代替native/API環境で実行し **8 PASS／FAIL0／SKIP0**。4種類の取得失敗表示と既存fallback、本人変更後の遅延失敗破棄、親OFFの親1＋子3payload、親保存失敗の4値復元／子write0、子部分失敗時のOFF維持／Alertを確認。新しい常設test framework・依存・test fileは追加しない。実API／通知配送／ストア／削除の成功検証ではない。

変更JS11fileのparse・diff空白検査、4style ownerの216 role×themeのサイズ／行間／太さ一致を確認。read-only reviewでAccountの5hook・本人条件／callback、FollowListのrender前statementと全10onPress、購入／復元／管理・価格／policy等15式、通知の表示用setter以外の取得effect／依存配列と保存／削除／再体験handlerのAST一致を確認。カード上辺・長名・選択check・対象busy・非公開読み上げ・無効前景を補修。writerは華恋一人。

**次のsource作業：案内・お知らせ・ガイド・tutorial・残る休眠資産と全体横断。** 各Stackからの入口、3テーマ・文字拡大・狭幅／短い横画面・safe area・keyboard・長文・失敗回復を最後に横断する。全screen source完成までbuild保留、途中commitは`[skip ci]`。今回のapp/native build・CI native compile・Upload・配布・実機表示・Render／Supabase／GPU操作0。全UI完成・端末での見え方／読み上げ・実ストアや削除の受入れは未確認。


<a id="ui-final-material-20261106"></a>
## 22. 11/6 実装区切り6 — 案内・チュートリアル・休眠画面・全体横断

前回のアカウント群 `c1c6bf638da3a7906ca7e078600051dedf15ce26` をfresh確認し、前提全文・最新weekly・全画面設計と固定sourceから継続。全画面を例外なく同じMaterialへ揃える作業の最後のsource群。途中のnative build・CI compile・Uploadは実行しない。

| 範囲 | 今回の表示設計・保持条件 |
|---|---|
| お知らせpopup | 通常／welcomeを同じ一面・幅640以内・角丸24・内側20へ。見出し22/30/600、本文16/27/400。全面scrimと独立Provider／全辺safe area、×44をheader内へ。題名・日時・本文・全CTA・履歴・welcome主操作を一つの可変高scrollへ入れ、本文だけ260／300高の旧構成を解除。×／背景／AndroidはonClose、welcome主操作はonPrimaryCloseを維持。本文リンク・action key正規化・表示条件は不変 |
| お知らせ履歴 | header・未読・一覧を同じFlatListへ。題名を省略せず、展開を読み上げに渡す。初回失敗を正常0件から区別して再試行を表示。追加失敗は既存rows／hasMore／nextOffset／unreadを保ち、同じoffsetから再試行。focus再読失敗も前回内容と更新失敗を併記。50件・重複除去・指定通知の一度だけの展開・楽観既読・CTA前の既読処理を維持 |
| ガイド・用語 | 画面名も本文scroll内へ、最大外幅680／左右20。長い対象名を省略せず、説明16/27・見出し18/26、本文内リンクはサイズを継承して600＋下線。用語modalは全辺safe area・幅640／角丸24、本文scrollと44の×／共通閉じるを分離。関連語の切替で本文scrollをreset。term regex／screenId正規化／関連語／戻り先を維持。ProfileCreateを通常利用できる説明から旧機能へ、感情通知には感情・強さ・時刻のみと明記 |
| tutorial開始・まとめ | 開始案内の三重枠を一面＋tonal説明へ。説明と開始／今回のみ／今後表示しないを同scrollへ入れ、閉じる条件を維持。Flowの導入・4体験・まとめ・完了を同じ文字／面へ。headerのtop safe areaを重ねず、非表示tabbar分のbottomを確保。step1／17／18／19、完了中停止、endTutorialとhome resetは不変 |
| spotlight overlay | 通常componentと未接続root資産の双方を3テーマ・本文16/27へ。説明とprimaryを同scrollへ入れ、無効面と文字を薄めず分離。左右safe insetを含むmarginと640最大幅を、描画とonMetricsChangeのcardRectで同じ式にする。既存の測定・hole・上下配置・proxy target・背景停止・callbackは保持。root資産の相対theme importも修正し、接続は復活させない |
| tutorialの現仕様説明 | Pieceは保存した入力本文から画像へ整えること、投稿欄の旧Q&Aとは別と説明。現在マップは全プラン共通、月次2／12／全期間へ。捕捉済みgenerated fixtureは改変・再生成せず、表示adapterでmap本体とreportの期間ラベルを「練習用の表示例」にする。旧rendererへ既定trueのshowPlanNoticeを追加し、tutorial呼出だけfalse。旧保存mapの通常表示・visibility／locked sections・tier／mode・日時／証拠は不変 |
| 休眠7screen | RankingTop＋感情／入力数／文字数／共鳴／連続ログインの計6screenとProfileCreateを同じカード・本文・フォームへ。期間4択はtonal＋check＋選択読み上げ、1択は表示へ。順位・名前・単位・private印・API／期間キー／戻り先を保持。Profileの5問・折畳み・input ref／keyboard／can_edit／secret／部分保存は維持。secret説明は既存metadata文へ揃え、保存無効時の子Text／iconも補助色にする。routeは再接続しない |
| 横断補修 | Input必須案内をERRORへ、感情／カテゴリ・更新中・tutorial対象選択の無効opacityを補助前景へ、未読NEWはERROR_BG／ERROR・12/18/600、dotもERRORへ。下部tabの7.5文字overrideを撤去し、NEWとiconの縦領域を分ける（icon面min48＋文字拡大分、bar80＋bottom inset＋拡大分）。保存toastの3行制限を解除。未接続AnalysisCrossLinkの白固定・2行切詰め・800を同じsurface／roleへ。作品canvas／recipe／画像、図の記号と感情hueは保持 |

製品29file：root `TutorialOverlay.js`、`components/{GuideRichText,GuideTermModal,NoticeModal,TutorialOverlay,TutorialStartModal,UnreadBadge}.js`、`components/selfStructure/WatashiMapRenderer.js`、`guide/{guidesJa,termsJa}.js`、`navigation/MainTabs.js`、`screens/{AnalysisContentFirstScreen,AnalysisCrossLinkSection,CocolonGuideScreen,EmotionLogScreen,EmotionRankingScreen,InputCountRankingScreen,InputLengthRankingScreen,InputScreen,LoginStreakRankingScreen,NoticeHistoryScreen,PieceLibraryScreen,PieceResonanceRankingScreen,ProfileCreateScreen,RankingTopScreen,TutorialFlowScreen}.js`、`screens/input/{InputEmotionSection,InputToastOverlay}.js`。既存test2fileは起動harnessの新しい既存native hook代替と、tutorial表示抑止が通常のplan案内・非表示sectionを緩めない回帰assert。新製品file・route・依存・API／DB／課金価格・本人／公開契約・AI／分析内容・作品画像の変更なし。STRUCTURE_MAP_DELTA_NONE。writerは華恋一人。

検証：既存9入口（rn-screen-contracts、theme-readability、analysis-watashi-map-v2-contracts、analysis-cumulative-map、iap-restore-purchases、subscription-owner-race、app-startup、piece-v2-input-screen、today-question-history-recovery）で **175 PASS／FAIL0／SKIP0**。旧起動harnessにsafe area／window dimensionsの代替がなかった1失敗をharnessだけ補い、全assertを保持して再実行した。最初のReact依存パス未指定による実行失敗も、その後既存の一時runtime指定で解消。製品・test-toolsの依存は変更しない。

一時検査では実NoticeHistory／RichTextで7 PASS（初回・追加・focus失敗、同offset再試行、重複除去、auto-open、既読・CTA等）、実NoticeModalは3テーマ×通常／welcomeの6case PASS（loading／空本文も確認）。実Guide3部品＋dataで3テーマとunknownを含む18case PASS。両Overlayは幅320／1024×3テーマ×primary有効／無効の24case PASS、cardRectと実style幅／左右gap／proxy callbackを照合。Startの3callback／Android戻る・scroll、Flow完了中の二重操作停止／home resetも確認。既存helper22関数とFlow主要6式、休眠7screenの処理部分とProfile入力／keyboard等21propsがAST一致。16style ownerの157明示role×3palette＝471組、文字サイズ／行間／太さ1,413値が実関数で完全一致。native・safe area・API・遷移・storeは代替を含むため、実描画・実配送・課金成功・全19stepのタップ成功を証明しない。

**次は全群をまとめたビルドと、実機での全画面仕上げ。** source実装は§14の全体を一巡済み。残る受入確認は、全登録／内部routeと条件分岐、3テーマ、幅320〜430・短いiOS横画面、OS文字拡大1.0／1.3／1.6、safe area、keyboard、長文・複数回復、未読、全19tutorial stepの実測。実機で見つかった欠けは同じ改装の残件として修正する。今回のapp/native build・CI native compile・Upload・配布・実機表示・Render／Supabase／GPU操作は0、commitは[skip ci]。全UIの視覚的合格・配布完了とは宣言しない。


<a id="ui-layout-finish-20261106"></a>
## 23. 11/6 全画面一巡後の仕上げ — タップ領域と短い横画面のtutorial

前回の全6群source反映 `46d7e694eb0bf8ec7ed8bc8e53cad96697d66e80` をfresh確認し、寸法と実際の操作範囲を追加確認した。前回の175 PASS／全体一巡を、実描画・実機合格へ換算しない。今回は確実に残っていた2系列の表示不具合だけを修正する。

| 対象 | 確認した問題 | 修正 |
|---|---|---|
| お知らせの「さらに表示」 | 640幅の親に対して見えるボタンはmax520だが、styleのない外側Pressableは全幅へstretch。空白も押せ、読み上げfocus矩形も表示より広くなる | CocolonPressableへ任意containerStyleを追加。幅100%／max520／中央配置／上余白を外側へ、背景・内余白・文字・押下scaleは従来の子へ。余白を二重にしない |
| 今日の問い・今の天気・旧Ranking | 問いの準備中／回答済みの「履歴を見る」、天気の「前回を見る」、休眠Rankingの「全表示」にも、子だけの左右寄せと外側全幅の不一致 | 左／右寄せと上余白・最大幅を外側のcontainerへ移す。4file・実5呼出箇所の同じcallback／disabled／読み上げ条件を保持。CocolonButtonと他callerは幅が一致しているため変更しない |
| 大きい対象を示すtutorial | header後のroot高335、step3対象下限392／15・16下限339では、旧式はcard maxHeight1〜12になり、padding／border42だけで本文と次へを圧迫。文字拡大で悪化する | infoだけ、上下に最低説明領域を取れない場合は全利用可能高へfallback。対象の一部へ重なっても本文scrollと次へを優先する。action7の生成ボタン／proxyは同じ領域・callbackを保つ |
| 自動スクロールと同値通知 | 同じ大きい対象の上端と下端を交互に追い、旧式はy36→−99→36等の往復。座標が同じでも新objectでmetrics→再測定が繰り返される | target高＋上下paddingがviewportを超える時は先頭へ一度だけ合わせ、下端を追わない。holeのmemoはx／y／幅／高さの値へ結び付け、同値objectで再通知しない |
| safe areaと最大高 | GlobalFrameが消費した上部safe areaを再加算、既定bottomMargin−16はhome indicator側へ侵入。spotlightなし／初回fallbackの高も利用可能高で制限されていなかった | 既存overlayWindowRectとwindow寸法からoverlay内の4辺insetへ換算し、描画とmetricsで共有。未計測は保守的global値。bottom既定0・負の余白でもsafe内、cardとfallbackをmin(fullHeight,softCap)へ |

全19stepのsource照合：3／4／5／6／14／15／16／18はspotlight付きinfo、7だけが対象ボタンを押すaction。1／2／8〜13／17はspotlightなし、19は既存の完了ボタンでOverlayなし。今回の共通info修正は8場面へ届き、step遷移・模擬入力・保存・未読・完了処理を変えない。旧root Overlayはsource不変。短画面で対象全体の同時表示が物理的に不可能な時、説明を潰して全体を囲む配置へ戻さない。

製品6file：`components/{CocolonPressable,TodayQuestionCard,TutorialOverlay}.js`、`screens/{NoticeHistoryScreen,RankingTopScreen}.js`、`screens/analysisReport/KokoroWeatherCurrentCard.js`。既存`tests/app-startup.test.js`へ再現3件を追加。新製品file・新test framework・依存・route・API／DB／AI・本人／公開契約・本文／作品画像変更0。任意表示propと既存UI寸法計算の範囲で、STRUCTURE_MAP_DELTA_NONE。

検証：前回と同じ既存9入口で **178 PASS／FAIL0／SKIP0**。新3件は実Overlay＋測定代替で339／392／503高の対象が説明領域を保つこと、同値座標の反復通知が止まること、公開syncの4反復で上下往復しないこと、公開fallbackが両inset内へ収まることを検査。最初の1失敗はtestがnative Viewでなくcompositeを選んだためで、selectorを修正し製品の条件を緩めず再実行した。変更JS7fileのparse／diff空白検査も成功。

一時の前後検査は3theme×前後6caseで外側配置・子余白非重複、callback／disabled／selected／busy／hint／value／hitSlop、translate→rotate→scale順序と押下／解除／無効化のscale復元を保持。実styleと5呼出箇所の式も一致。tutorialの寸法模擬ではroot335のstep3／15／16がmax247へ回復し、5巡のmetrics／scroll更新で安定、同じ座標の新object3回でも追加metrics0。root200・未計測・top47／bottom34でもcard／fallbackは利用可能高115へ一致。action7 proxy／hitSlop12を保持。測定関連17関数、再測定effect、proxy関連bindingはAST同一。これらはnative実寸・実hit-test・描画・読み上げ・全19step実タップの代替ではない。

**残る確認は統合ビルドと実機での全画面仕上げ。** 全6群へ採用デザインを適用した状態を継承し、今回の不具合を補修した。3theme、文字拡大1.0／1.3／1.6、幅320〜430・短いiOS横画面、safe area／keyboard、長文・回復、全19stepを実機で確認する。今回もapp/native build・CI native compile・Upload・配布・本人端末・Render／Supabase／GPU操作0、commitは[skip ci]。source修正と限定検証を、視覚的受入れや商品文章品質の改善へ換算しない。


<a id="ui-font-scale-finish-20261106"></a>
## 24. 11/6 文字拡大の仕上げ — 感情入力・下部ナビ・接続案内

fresh `350f2f9b7be51b3eade3234787d57303d45d3537` を起点に、文字拡大と狭幅の表示を確認。全6群と§23の修正を継承し、今回確認できた3箇所だけを補修する。

### 感情入力は実幅と文字サイズで1〜3列

旧emotionBlockは30%の3列固定で、カード内240幅では1列72。左右padding28＋border2＋icon16＋間隔4の後に文字の幅が22しか残らず、1.6倍の感情名が列を越える。実buttonsのonLayout幅とOS fontScaleから列数を決め、同じ順の6選択肢を折返す配置へ変更。初回未計測はwindowから保守的な幅を使う。

最小列幅は、実chipの左右padding／border＋（最長ラベル4字×実button文字15＋icon16＋間隔4）×文字倍率。gap12、最大3列で、列幅は利用可能幅からgapを引いて等分する。iconの拡大も見込む保守的な算定とし、TextのflexShrink／minWidth0と外側／内側の幅100%も併用する。感情名と強度の操作文字は15/22/600へ明示適用。本文や作品書体は変更しない。

| buttons実幅 | 倍率1.0 | 倍率1.3 | 倍率1.6 |
|---|---:|---:|---:|
| 240 | 2列 | 1列 | 1列 |
| 350 | 2列 | 2列 | 2列 |
| 354 | 3列 | 2列 | 2列 |
| 640 | 3列 | 3列 | 3列 |

選択順は喜び→悲しみ→怒り→不安→平穏→自己理解のまま。通常感情の複数選択、自己理解の排他、強度weak／medium／strongのpayload、強度rowのref、既存の保存条件は保持。幅／倍率変更で選択をresetせず、0幅と0.5未満の計測揺れは無視する。3列2段という旧commentだけを「順序」に訂正し、データ定義自体は不変。

### 下部ナビはライブラリの占有枠と実表示を一致させる

実ビルドの`package-lock.json`（blob `e83c6a45b5758dcf7116c76988f780587d2209bd`）は`@react-navigation/bottom-tabs 7.14.0`。宣言は`^7.4.7`であり、下限版を固定版と扱わない。公開された7.14.0 tarballのSHA512をlockのintegrityと照合し、実BottomTabItem／TabBarIcon／BottomTabBarを読んだ。依存fileは変更しない。

旧sourceはcustom icon面64×min48に対し、libraryのlayout枠は通常31×28／横画面compact23×20。中央に置かれる子が上下へ溢れ、下のラベルと重なる。tabBarIconStyleへ同じ64×実icon領域高を渡し、tabBarLabelPositionをbelow-iconへ固定。横画面でも同じ縦構成と通常iconを保つ。variant・4route・遷移・未読・色は維持する。

文字は12/18、ラベルのfont paddingを外す。icon領域は48＋(倍率−1)×18、barのbottom insetを除く予約高はceil(top8＋item上下padding10＋icon領域＋18×倍率)。文字倍率は1未満でも最低1の領域を確保する。

| 文字倍率 | icon領域高 | icon＋文字＋余白の実占有 | bar予約高（bottom inset別） |
|---|---:|---:|---:|
| 1.0 | 48 | 84 | 84 |
| 1.3 | 53.4 | 94.8 | 95 |
| 1.6 | 58.8 | 105.6 | 106 |

### 接続確認中も読める無効表示

AppRuntimeBootstrapGateの再確認ボタンはloading時に全体opacity0.65を掛けていたため、通常の可読前景まで薄くなる。opacityを外し、loading時の文字をTEXT_SUBTLE、通常時をON_SURFACE_TONALへ。既存disabled／busy、再確認callback、bannerと子の位置を保持し、通信中に画面や未保存入力を再mountしない。

製品5file：`navigation/MainTabs.js`、`runtime/AppRuntimeBootstrapGate.js`、`screens/InputScreen.js`、`screens/input/{InputEmotionSection,inputOptions}.js`。既存test2fileはrowの折返し構成へのcontract期待適応と、起動の実MainTabs検査へ幅320／390×文字1／1.3／1.6の占有整合を追加。新製品file・新framework・依存・route・API／DB／AI・入力保存／本人／公開契約・作品画像の変更0。表示用幅stateのみ、STRUCTURE_MAP_DELTA_NONE。

検証：既存9入口 **178 PASS／FAIL0／SKIP0**。実InputEmotionSection＋CocolonPressable＋実style/roleを3theme×4幅×3倍率＝36caseで描画代替し、列幅・順序／toggle・強度3payload／ref・排他／disabled／selected、15/22/600とText shrinkを確認。同じmounted instanceの幅240→354→微小差→倍率1.6→640でも選択を維持。MainTabsの実optionsとlock固定7.14.0の実部品による4route×3倍率×幅320／横667の24renderで、占有枠・予約高・通常icon／縦配置・未読と押下を確認。7.4.7での予備照合は固定版の根拠に数えず、7.14.0で再実行した。実Gateの前後3theme×loading／error＝6caseで、文字色・無効／busy／callbackと、banner切替時の子mount数・下書き保持を確認。MainTabsの意図した寸法・文字style以外のASTはbeforeと同一。7JS parse／diff空白検査成功。

native host・計測・APIは代替であり、実字体の幅・実hit-test・読み上げ・OS文字拡大の実機合格ではない。**次の受入確認は全群をまとめたビルドと実機の全画面。** 今回もapp/native build・CI native compile・Upload・配布・本人端末・Render／Supabase／GPU操作0、commitは[skip ci]。全画面統一の範囲と、前回までの保存／回復／tutorial条件を保持する。
