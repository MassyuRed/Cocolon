---
doc_id: cocolon_weekly_review_20261128
title: "Cocolon 第13回報告会 — 11/28〜12/5"
meeting_date: "2026-11-28 JST"
reporting_period: "2026-11-21の前回報告会後〜2026-11-28の確認時点"
planning_period: "2026-11-28〜2026-12-05"
meeting_status: "IN_PROGRESS"
record_state: "議題1を報告。次週の優先案と確認条件を記載"
decision_owner: "Mash"
recorder: "華恋"
---

# Cocolon 第13回報告会（11/28〜12/5）

Mashの指示で報告会を開始し、11/21の前回報告会後から11/28の確認時点までの作業と成果を記録する。日付と時刻はJST。

<a id="agenda-1-weekly-report-20261128"></a>
## 1. 今週やった作業と成果

**CMEEの四機能をQwen3.5-9Bの通常提供へ切り替えた。** EmlisAIは回答の保持と原文の取り違えを限定ケースで修正し、DeepInsightはテーマ出題・回答の保存とマップ連携を本番に入れた。Pieceの新しい画像編集と共鳴、わたしマップのプラン別表示を本番側とiOSへ進め、最新のiOS 9201をTestFlightへ送信した。週末に残った主な作業は、EmlisAIの初回本文と有料プランの待機、わたしマップの新規分析の内容、各機能の最新版での実機確認である。

### 1.1 共通基盤と9Bへの移行

11/22に、EmlisAI・Piece・わたしマップ・DeepInsightを同じCMEEの作業単位として扱い、本人の原文・回答・訂正の受け渡しから保存・再読まで並行して確認する方針を記録した。11/23の本番確認では、訂正後の非公開Pieceを新規保存して同じID・版を再読し、マップも別々の原文への訂正を保持した。EmlisAIの引用の変形や、DeepInsightの記録由来の出題見送りはその試行に残った。 [第12回 §11.24](Cocolon_Weekly_Review_20261121.md#cmee-four-feature-work-decision-20261122) · [§11.47](Cocolon_Weekly_Review_20261121.md#cmee-6c409f4-direct-correction-live-20261123)

11/24、同じRTX A5000で比較した後、Mashの決定に従って通常の四機能をQwen3.5-9B単独提供へ切り替えた。RenderのAPI・ワーカーは14:48ごろに移行版 `259b8b1a` がLive。同じ12要求で9Bは隔離保存・同版再読が12件、文章の品質判定で通過したのは2件だった。11/21にはワーカーの512 MiBのメモリ上限超過を受けてStandard 2 GBへ増強し、11/22には別途、一時領域が2 GBを超えてワーカーが再起動した。 [第12回 §11.81](Cocolon_Weekly_Review_20261121.md#cmee-qwen35-9b-normal-provider-migration-20261124) · [移行コミット](https://github.com/MassyuRed/mashos-api/commit/259b8b1a) · [Renderワーカー](https://dashboard.render.com/worker/srv-d6copljh46gs73cmeic0)

### 1.2 EmlisAI — 問いの前後と初回の応答

初回・問いの前・回答後・スキップ後を同じ入力で比べ、後続の問いを見送っても先の回答を保持する変更、本人が明記した肯否を反転させない変更、単一の補足回答を本人が答えた場面に絞る変更を11/25に順次本番へ反映した。11/26には、Free初回の過去の好みの強さと、本人が書いた行為・気持ちを保つ限定修正、Plusで最初の問いを見送ったときに書かれた気持ちを短く受け止める修正を反映した。問いを一つの確認点へ絞り、プラン変更後も閲覧権利のある過去の応答を履歴から読めるようにした。11/27には話し手の一人称「Emlis」と、利用者に呼びかける場合の表示名＋「さん」をそろえ、合成入力と隔離DBで確認した。 [第12回 §11.97](Cocolon_Weekly_Review_20261121.md#cmee-emlis-adopt-working-differences-20261125) · [§11.105](Cocolon_Weekly_Review_20261121.md#cmee-answer-scope-map-stable-id-20261125) · [§11.109](Cocolon_Weekly_Review_20261121.md#cmee-map-reread-and-listener-20261126) · [11/27の反映記録](https://github.com/MassyuRed/Cocolon/commit/917fae14cf22114ec5af1447c4367f96815bbfd8)

11/25の実9B v31では架空18件を同じ版で再読した。見本と重なっていない17件のうち全文判定を通過したのは1件。広い候補の採用を見送り、上記の再現できた修正を個別に採用した。初回に本人の言葉を繰り返すだけの返事や、本人が書いていない事情を足す返事、履歴付きPlusで気持ちと理由を保ちながら応じることに課題が残る。Freeは当回、Plusは関連履歴、Premiumは利用できるわたしマップまでを参照する方針に沿って、話者・時点・理由・感情の強さを保ち、本人に向けた言葉として読めるかを見る。 [第12回 §11.88](Cocolon_Weekly_Review_20261121.md#cmee-grounded-examples-piece-unicode-map-comparison-20261125) · [観測・構造分析の理論](../designs/cmee/Cocolon_Karen_Observation_and_Structural_Analysis.md)

11/26の本番ログでは初回応答の保存までFreeの1件は4.8秒、Premiumの1件は84.4秒。モデルへの要求から受領まではそれぞれ3.1秒と79.1秒。Premiumの処理とわたしマップのGPU要求は時間帯が重なった。ホームの集計再取得を待たずに応答画面を開く変更と、Plus・Premiumの待機案内を9001以降に収録した。Emlisとマップで新規訂正を始める画面は一時非表示。9BでのPlusの同条件実測、GPU上の待ちと生成の内訳、最新版の実機所要時間は未確認。 [第12回 §11.114–115](Cocolon_Weekly_Review_20261121.md#emlis-wait-map-failure-and-editor-20261126) · [iOS 9001](https://github.com/MassyuRed/Cocolon/actions/runs/45752236694)

前週議事録には、後方互換の整理で、カテゴリなし・思考または行動ありの旧形式575件を本番から削除し、対象を参照する保存成果物が0件だったと記録されている。この件数は当時の作業記録による。 [第12回 §11.111](Cocolon_Weekly_Review_20261121.md#emlis-question-history-and-legacy-inputs-20261126)

### 1.3 わたしを知る問い（DeepInsight）

「今日の問い」を置き換え、テーマ、Premiumの記録からのふりかえり、問いと回答の同一ID、分析への連携を通常環境へ反映した。テーマは全プランで初回から使え、次の新規出題までFreeは7日、Plus・Premiumは24時間。記録からのふりかえりはPremium向け。アプリではテーマを先に表示し、通知から該当する問いを開く経路を実装した。旧通知ジョブの停止はRenderで再確認した。 [第12回 §11.6](Cocolon_Weekly_Review_20261121.md#deep-insight-normal-rollout-20261121) · [§11.8の採用条件](Cocolon_Weekly_Review_20261121.md#deep-insight-release-candidate-interruption-20261121) · [旧通知ジョブ](https://dashboard.render.com/cron/crn-d71rdk7gi27c73fmbgg0)

固定250件の4B検証は統合候補で全件が自動検査を通過し、本文の読み合わせでは軽微な文面課題84件を記録した。Premiumの発行・回答・マップへの連携は本番の限定試験と隔離環境で到達点を確認した。週内に作成された本番DBの現存行は、テーマ3件と記録由来1件で、4件すべてに回答があった。11/26の記録評価ジョブは完了したが、その後の新規出題や通知開始は現存行で確認できなかった。本番9Bでの全テーマの品質、本人の記録から新しい問いが届き、実機で開いて答えられることは残る。 [第12回 §11.21](Cocolon_Weekly_Review_20261121.md#deep-insight-theme-question-quality-20261121) · [§11.66](Cocolon_Weekly_Review_20261121.md#cmee-a5000-cap-and-product-checks-20261124)

### 1.4 Piece — 編集・保存・投稿

フォロー公開範囲に従う新形式の投稿を通常DB/APIへ反映した。画像編集は単色のパレット、Plus・Premiumの配置・文字サイズ、Premiumの書体・文字色・背景・装飾を順に追加した。プレビュー・保存詳細・PNGの同版をiOSシミュレーターで照合し、先行検証版で長文と実験用Unicodeを含む8描画試験とPiece CIの全6ジョブが通過。統合版8901へ収録した。 [Piece先行CI](https://github.com/MassyuRed/Cocolon/actions/runs/45535750554) · [第12回 §11.110](Cocolon_Weekly_Review_20261121.md#cmee-four-features-integrated-ios-20261126)

通常操作の計測ではプレビュー生成POSTが72.276秒の1件、見た目変更8回の中央値が5.365秒。見た目変更ではDBへの往復が計測時間の84.7％を占めた。サーバーで同じ要求内の出典読取を再利用し、隔離試験で初回5→3回、設定変更4→2回に減らした。アプリは変更を端末で先に描画して連続操作をまとめ、同じ位置のプレビューで結果を確認できる編集UIを9001以降に収録した。保存はサーバーで確定した版と描画結果を照合する。修正後の認証付き本番所要時間と、最新版の端末での描画・写真保存・共有は未確認。 [第12回 §11.112–113](Cocolon_Weekly_Review_20261121.md#emlis-context-notice-and-piece-latency-20261126) · [§11.115](Cocolon_Weekly_Review_20261121.md#emlis-opening-piece-editor-map-recovery-20261126)

11/26には新形式の共鳴の追加・取消・履歴を、DB移行 `20261126071113` とRender APIへ反映した。9101に投稿カードと共鳴を、9201に投稿・感情通知・共鳴の取得済み一覧を画面移動後に再利用する修正を収録した。公開範囲はフォロー関係・本人操作・再取得条件に従って見直す。本人とフォロワーでの新形式投稿、共鳴、取り下げまでの最新実機確認は残る。 [共鳴の反映](https://github.com/MassyuRed/Cocolon/commit/430af7353bd59cbf7e4dd086638f60246b51b92e) · [一覧の再利用](https://github.com/MassyuRed/Cocolon/commit/122b8f320592bd755490cc93b30fe52ce971b40d)

### 1.5 分析 — わたしマップ、こころグラフ、もしもルート

わたしマップは結論を先に最大3つ示し、Freeは短い結論と簡素な図、Plusは選び方が変わる条件と構造ごとの図、Premiumは本人が根拠を示した優先・両立や構造間の関係まで表示する。保存IDをプラン共通とし、現在版・詳細・月次版の扱いを修正した。合成経路に加え、実9Bの限定題材を隔離DBから読み戻して、本文と小図を照合した。対応のDB/APIを11/26に本番へ、アプリを8801以降へ入れた。 [第12回 §11.107–109](Cocolon_Weekly_Review_20261121.md#cmee-map-first-free-plus-20261126) · [プラン別仕様](../designs/cmee/Cocolon_Karen_Observation_and_Structural_Analysis.md#watashi-map-plan-graphs-20261125)

11/26は長い履歴の最終関係線の生成指示が49,152バイトの上限を超過。範囲を分割して統合する既存経路に切り替え、13:38に24件を処理して保存版を作り、現在・詳細・月次で同じ版を確認した。FCM送信1件は成功。Mashの端末（8901）には日付付き記録の抜粋が重複して表示され、結論と図が出ず、更新日も `--` だった。主要構造の採用は0件で、保存と通知を送る条件に問題があった。記録件数だけで分析が成立しなかった原因は判定できていない。 [第12回 §11.116–117](Cocolon_Weekly_Review_20261121.md#watashi-map-production-capacity-recovery-20261126)

11/27には、採用できる主要構造がない場合の新規保存と完了通知を停止し、閲覧できる保存版があれば残す修正を、DB移行 `20261127011654` とAPI・ワーカー `3556036d` へ反映した。問題の保存版1件は、DBの行を保持したまま現在・履歴・詳細・当月の表示対象から外れたことを本番読取で確認した。参照を失った履歴を開くたびに生成を繰り返す経路も修正。閲覧できる版がないとき「分析に必要な情報が足りていません。」を表示するアプリと更新日の修正は9101以降。最新本番での新規9B分析の本文・図、修正後の本人端末での表示と通知の着信・タップは残る。 [11/27の反映記録](https://github.com/MassyuRed/Cocolon/commit/917fae14cf22114ec5af1447c4367f96815bbfd8) · [API配備](https://dashboard.render.com/web/srv-d4ppfpm3jp1c73952bj0/deploys/dep-dc4dj517lnhs73852gtg) · [ワーカー配備](https://dashboard.render.com/worker/srv-d6copljh46gs73cmeic0/deploys/dep-dc4dj5ff3r2c73b22rr0)

こころグラフは文章レポートとその配布通知を11/21に停止し、日・週・月を全プランで見られる方針に沿って、週の日別表示、月のカレンダー、感情通知と共通の色を9201へ収録した。もしもルート／保存した意向はPremiumの既存通常実装を継承。今週、9Bの通常認証と実機で生成・選択・保存・再読・削除まで通した証拠は確認できなかった。 [従来の方針](Cocolon_Weekly_Review_20261121.md#kokoro-graph-and-premium-20261121) · [旧レポート配布ジョブ](https://dashboard.render.com/cron/crn-d71re415pdvs7384ocvg) · [こころグラフの実装](https://github.com/MassyuRed/Cocolon/commit/d50e4fc49b303d4485e91e05a0ed2aa050d59c12)

### 1.6 アプリ・ガイドとTestFlight

ホーム・設定・分析・Pieceのタイトルや入口を整理し、ガイドを感情入力・分析・ピース・フォロー機能の4章に統合した。同じ本人と閲覧条件で直近の表示を再利用する修正を、ホーム・分析・入力履歴・フォローなどへ入れた。認証・権利・データ更新で必要な取得を行う。操作式チュートリアルでは、感情入力、問いに答えて応答を読む、Pieceの配色と保存・投稿、かれんの投稿・感情通知、分析の順に画面を操作する。練習データは通常の記録・投稿・通知へ送らない。 [画面の再表示](Cocolon_Weekly_Review_20261121.md#screen-return-reuse-20261126) · [チュートリアル](https://github.com/MassyuRed/Cocolon/commit/ebbe01b3a72f96cdcd95128b860c714a20178719)

| iOS | 確認した到達点 | 根拠 |
| --- | --- | --- |
| 8201・8301・8401 | 11/21の内部配布を議事録で確認。8201の実機確認をMashが報告。8401は新しい問いの画面への切替を確認し、記録由来の出題は確認できなかった | [第12回 §11.3–7](Cocolon_Weekly_Review_20261121.md#deep-insight-normal-rollout-20261121) |
| 8501・8601 | 8501の送信工程はスキップ、IPAの書き出しで終了。次の8601は11/22に送信成功 | [8501](https://github.com/MassyuRed/Cocolon/actions/runs/44975309675) · [8601](https://github.com/MassyuRed/Cocolon/actions/runs/44977352430) |
| 8801・8901 | 8801はマップの変更を先行して送信。8901は四機能を統合し11/26に送信、Mashが内部配布完了を報告。8901の実機でマップの表示不良を確認 | [8801](https://github.com/MassyuRed/Cocolon/actions/runs/45724619161) · [8901](https://github.com/MassyuRed/Cocolon/actions/runs/45730743149) · [第12回 §11.110–111](Cocolon_Weekly_Review_20261121.md#cmee-four-features-integrated-ios-20261126) |
| 9001・9101 | 11/26に両方を送信。9001に応答待機案内と固定プレビューの編集、9101に不足表示と更新日、共鳴、画面を開き直したときの再取得抑制、ガイド、テーマの区切りを収録 | [9001](https://github.com/MassyuRed/Cocolon/actions/runs/45752236694) · [9101](https://github.com/MassyuRed/Cocolon/actions/runs/45772833678) · [差分](https://github.com/MassyuRed/Cocolon/compare/7f632b186...d92027d8) |
| **9201** | 最新の送信確認。11/27 11:38に署名・IPA出力・TestFlight送信が成功。操作式チュートリアル、Pieceの3タブの再表示、こころグラフの週・月を追加。Apple処理・内部配布・本人端末の結果は今回確認できていない | [9201](https://github.com/MassyuRed/Cocolon/actions/runs/45927552303) · [差分](https://github.com/MassyuRed/Cocolon/compare/d92027d8...d50e4fc4) |

### 1.7 日別の主な到達点

| 日付 | 作業と結果 |
| --- | --- |
| 11/21 | こころグラフの文章レポート停止、主要画面・設定の整備、DeepInsight本番反映と8401内部配布。ワーカーを2 GBへ増強 |
| 11/22 | DeepInsightの固定250件の出題検証、追加移行と通常反映、8601送信。CMEE四機能を一体で進める方針を決定 |
| 11/23 | 本番で訂正後のPiece非公開保存とマップの再読を確認。Emlisの初版条件と観測・構造分析の理論を記録 |
| 11/24 | A5000で比較し、四機能を通常9Bへ切り替え。Emlis本文・Piece編集・マップ主要構造の検証を並行 |
| 11/25 | Emlisの回答保持・肯否・補足範囲を本番修正。PieceのPremium編集をサーバー先行反映。マップのプラン別照合 |
| 11/26 | マップのプラン別本文・図を本番へ反映。24件の更新で内容不足と表示不良が判明。8901内部配布申告、9001・9101送信。Piece共鳴を本番に、待機表示・画面再利用をアプリに反映 |
| 11/27 | 未受理マップを表示から外し、主要構造0件時の保存・通知を停止。操作式チュートリアル、こころグラフ週・月、Pieceの3タブ再表示を9201に収録し送信 |
| 11/28 | GitHubの実装・Actions、Renderの配備・ヘルス、Supabaseの移行・ジョブを読み取り照合し、第13回報告会を開始 |

<a id="status-and-baseline-20261128"></a>
## 2. 前回計画の達否と11/28の確認点

| 11/21の確認項目 | 11/28時点の結果 |
| --- | --- |
| 通常モデル・四機能の接続 | 9Bへの通常接続に移行済み。11/28のRenderはAPI・ワーカーとも `3556036d` でLive、公開ヘルス200、ワーカーのDBポーリングを確認。Runpodの現在の稼働・停止、停止後の9B復元一巡、四機能を同じ本人条件で通す最新の通常生成は未確認 |
| EmlisAIの本文と本人更新 | 限定ケースの本番修正と保存・再読を確認。Free・Plusの初回本文の自然さ、履歴付き回答と待ち時間、Premiumの参照差が残る |
| Pieceの文章・画像・共有 | 本番側の新編集・投稿・共鳴と、iOSへの収録が進んだ。9Bでの新規本文、修正後の待ち時間、端末での同版PNG・フォロワーとの閲覧範囲確認が残る |
| マップともしもルート | 3プラン表示と不足時の扱いが進んだ。マップの新規実本文・図・通知の一巡、もしもルートのPremium実機一巡が残る |
| 両OS・課金・共通機能 | iOS 9201送信まで確認。Android署名版の通常Piece、両ストアの購入・復元・失効、退会時の新Piece消去・管理認証、継続提供の実費と提出資料について、今週の完了証拠は確認できていない |
| 公開候補の版 | 確認時の `main` はアプリ `e3aed2d`、API `375f86a`。iOS 9201の署名元 `d50e4fc` とRender稼働版 `3556036d` は各作業ブランチの成果。公開候補を固定する際、採用差分と対応版を照合して両リポジトリを揃える |

Supabase本番は11/28の照会時に稼働正常。移行台帳65件のうち版番号が対象週のものは27件で、最新は `20261127011654`。週内に作成された標準マップ生成ジョブは完了6件・失敗8件で、失敗8件の保存エラーに503を確認した。§1.5の11/26 13:38の生成は別の現在版更新ジョブであり、DBで生成・FCM送信処理の時刻を照合した。11/27の変更後に新規の本人向け分析が完成した証拠は今回取得できなかった。

前回の全体管理評価63.375％・補助経路活用の参考値62.5％は11/21時点。今回は議題1を報告し、再採点は行っていない。正式商品受入れを新たに判定した実績はない。 [前回の評価](Cocolon_Weekly_Review_20261121.md#app-overall-rescore-20261121) · [前回の計画](Cocolon_Weekly_Review_20261121.md#next-week-priorities-20261121)

<a id="next-week-priorities-20261128"></a>
## 3. 11/28〜12/5の優先案

華恋の提案。初版の応答は既決のFree・Plusを優先し、Premiumの提供範囲は本文・実機結果と日程を見て判断する。四機能の責任を同じCMEE作業として持ち、共有GPUを使う実生成は順序をそろえる。アプリ・DB・課金・提出資料の確認は並行する。以下の期限は報告会で協議する作業上の目安。

| 確認目安 | 作業と担当 | 確認したい結果 |
| --- | --- | --- |
| 11/28〜12/1 | 華恋：EmlisAIの通常初回を優先し、問い前・回答後・スキップ後まで回帰確認。既存の実出力を照合し、GPUを使う前に再開版と復元材料を確認 | Freeの当回とPlusの履歴付きの違いが本文に出る。主体・理由・時点・強さを保持し、原文の繰り返しや書かれていない理由を避ける。通常保存と同版再読を確認し、待機・生成・保存・表示を実測する |
| 11/28〜12/3 | 華恋：Pieceと分析・DeepInsightを並行して確認。最新アプリで検証可能な範囲を整理し、確認できる端末に対応版をそろえる | Pieceは編集から非公開保存、PNG、フォロワーとの投稿・共鳴まで。マップは有効な主要構造の本文・小図・現在／月次と、0件時の表示・保存・通知。DeepInsightはテーマと記録由来の発行・回答・通知からの復帰 |
| 11/28〜12/4 | 華恋：両OSの候補、購入・復元・失効、退会・管理認証、提供費用・復元、ストア資料を並行して照合 | iOSの配布状況と主要操作、Androidの署名候補とPieceの通常操作、ストアとAPIの権利の一致、資料の不一致と修復箇所を特定 |
| 12/5 | 華恋：候補版・残る不足・判断材料をそろえる。Mash：初版範囲と残る商品判断を協議 | 翌12/6の候補成立判定に必要なアプリ・API・DBの対応、実機と課金の結果を確認。未達の項目は観測結果、残差、日程への影響を示す |

既存の管理目標は12/6の両OS提出可能候補。現時点では最新版の実機、Android・課金・継続提供の結果が揃っておらず、達成見通しは厳しい。前週議事録が扱う実提出日と正式公開日は未確定。議題1を報告済みとし、次週案の採否・日程判断・会議終了は後続の協議で記録する。本会議で製品の状態を変更する操作は発生していない。 [前回の候補条件と版の扱い](Cocolon_Weekly_Review_20261121.md#release-outlook-20261121)

## 4. 比較に使った原本

- [第12回議事録](Cocolon_Weekly_Review_20261121.md)は作業ログが§11.118まである `7d2fc92` の版を使用。11/27の成果は、同議事録の短い版を持つ後続アプリブランチの実装・運用記録とActionsを照合した。
- [Cocolonの前提資料と全体の現在地](../00_cocolon_current_product_and_state.md)・[作業姿勢とルール](../work_attitude_rules_for_karen/00_read_first.txt)・[補助経路の詳細設計](../designs/cmee/Cocolon_CMEE_AuxiliaryAsset_Reuse_ImplementationDesign_20261108.md)・[観測・構造分析の理論](../designs/cmee/Cocolon_Karen_Observation_and_Structural_Analysis.md)を参照。11/28にGitHubのコミット・Actions、Renderの本番配備・公開ヘルス・ワーカー、Supabaseの本番移行台帳と非内容の集計を再取得した。
