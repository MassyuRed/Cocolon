# Cocolon 最新情報 — 全機能・全状態

更新日：2026-10-31 JST（最新差分：実4B18生成と実本文2件の隔離SQL保存再読を確認。主体/一人称の品質未達で製品採用せず、新配置/配布・本人端末は未実施。Plus680円/Premium1,480円の先行反映を保持）。全Cocolon作業の必読原本。

> **最新報告会：[第9回・2026-10-31、10/31〜11/7](weekly_reviews/Cocolon_Weekly_Review_20261031.md)。開催中。** [§3のMashの方針・既決仕様](weekly_reviews/Cocolon_Weekly_Review_20261031.md#confirmed-directions)、[§4の華恋の商品案](weekly_reviews/Cocolon_Weekly_Review_20261031.md#release-product-proposal)、[§11の合意最低線と週間基準計画](weekly_reviews/Cocolon_Weekly_Review_20261031.md#weekly-tasks-20261031)、[§7の未決・会議進行](weekly_reviews/Cocolon_Weekly_Review_20261031.md#meeting-agenda-and-open-items)を区別する。Emlisは人間的応答のみの表示へ変更し、意図的短文化・1〜2文固定はしない。観測ラインは分析へ活かす。Free当回入力のみ／Plus過去本人入力も照合は既決仕様の再確認で、通常4Bでの意味ある履歴応答は未完成。わたしマップは全蓄積の構造・ルートと月ごとの当時snapshot、現在との見比べが構想。28日・最新100だけ・最新1枚は華恋の判断・撤回案で、Mashの構想ではない。下表の期間実装と新目標を混同しない。

**初版Emlisの最低線は合意済み：** Mashは§10の例に「俺が求めるのもこのライン」と明示し、その水準を目指した改善案と1週間のタスク記載を指示した。[第9回§11](weekly_reviews/Cocolon_Weekly_Review_20261031.md#weekly-tasks-20261031)が現在の基準計画。意味・主体・否定・時点を保ち、不明やない事情を確定せず、自然な返事を返す。短い受け取り・一度の言い換えも認め、高度観測の深さ・毎回の新発見・助言・質問を初版必須にしない。本人宛応答と分析材料を分け、通常実機接続・保存再読・Plusの具体的履歴応答を主成果とする。例文を固定テンプレ・凍結テストへ採用せず、文数固定もしない。最低線の合意と、実4Bの合格・実機成功・商品受入れは別。Plusの既決差とAnalysisの累積／月次構想は保持する。

**商品案の採否：** Pieceを初期の有料価値の中心にする方向を記録。**Plus月680円／Premium月1,480円はMashの最新の実装指示で採用済み。** [第9回§15](weekly_reviews/Cocolon_Weekly_Review_20261031.md#subscription-prices-20261031)に確認と反映を記録。RNの3file／APIの1fileの料金fallbackと、実DBの対象2行の料金・自動更新案内を更新した。公開APIの直接取得はtimeout、実ストア請求額の設定・確認と新ビルド配布は未実施。12配色・生成枠・iOS先行・SNS後置・Premium等の延期は華恋案で、採用済みではない。Pieceへの4B利用は質問と回答の段階。描画には不要、意味再構成では候補という見解を仕様変更の合意にしない。既決の12/18両ストア公開目標は変更していない。54.50％は前回管理評価を継承し、今回再採点なし、正式商品受入れ0/3。通常AI・累積マップ・Piece本人実機一巡の未達から、期限内完成は保証できない。

**最新の公開見通し：** [第9回§13](weekly_reviews/Cocolon_Weekly_Review_20261031.md#release-outlook-20261031)。12/18両ストア公開目標は維持するが、通常接続・累積マップ・課金・両OS・原価の未成立から達成の裏付け不足・高リスク。10/31→11/27の提出基準まで27日、その後12/18まで21日を審査・差戻し枠とする管理計画で、所要保証ではない。11/3通常一巡、11/7実績・Android差分・販売範囲と原価材料、11/15結合、11/22候補、11/27両ストア提出の確認点を置く。高度観測を初版へ戻さず、Plus履歴・累積／月次マップ・Piece保存出力・課金権限は残す。iOS先行やSNS後置等の未採用案を工程削減済みにしない。[§14](weekly_reviews/Cocolon_Weekly_Review_20261031.md#karen-opinion-20261031)は華恋の進め方・商品価値への意見。今回の報告で新しい製品実装・稼働成功は生じていない。

**現在の直接作業（10/31）：** 本人宛初回本文→通常API→既存Q3 SQL保存→RN非生成再読のsource候補（[第9回§16](weekly_reviews/Cocolon_Weekly_Review_20261031.md#natural-reply-connection-20261031)）を保持。後続の新Pod/Jupyter実測（[§17](weekly_reviews/Cocolon_Weekly_Review_20261031.md#natural-reply-actual-20261031)）でbase/fit38の8入力×2と指示修正2＝18生成、全EOS・約0.825〜3.427秒を確認したが、主体/感情の所有・一人称の誤りが残り両候補とも全体最低線未達。修正指示は製品不採用・source復帰。元の妥当な実本文2件を材料一致後に隔離Q3 SQLへ手動受渡しし、別service instance GET4回/既存start2回で同一本文/eventを確認。実GPU HTTP・API/DB process再起動・新配置/配布・本人端末の証拠ではない。追加学習0・本番変更0、正式0/3/54.50％据置。次は学習前4Bへの最小修正案を具体化し、閉鎖した18回を再利用しない。分析NOT_GENERATED、新profileの問い/補足・Plus全蓄積関連検索の未完成と既存API/RN検証・同5失敗も保持する。

前回の[第8回・10/24](weekly_reviews/Cocolon_Weekly_Review_20261024.md)は終了版と、その後の学習・接続実行履歴§12〜136として保持する。各承認の消費・候補の不採用を新会議でリセットしない。最新focus29は下段の実行結果を参照する。

**最初のA4500学習実績（§24・履歴）：** [A4500で修正版4B追加学習を完走、重み回収、CMEE採用は未達（§24）](weekly_reviews/Cocolon_Weekly_Review_20261024.md#20261025-a4500-training-and-portable-weights)。[全実結果](observation_learning/trials/2026-10-24-qwen4b-cmee-diagnostic/repaired_a4500_20261025/README.md)。Mashは4B採用とリリースまでRunpodでの追加学習を明示し、将来は手持ちPCへ移す可能性が高い。RTX A4500 20GB／Secure・EU-RO-1・Pod y0eb0w0qn6nks0を今回の最安の容量候補として確保。GPU$0.25/h・50GB container込み表示$0.26/h。CUDA/BF16正常、修正版2教師/1epoch/2update・adapter保存/非学習reload・前後16生成が20分23.76秒で完走し、20GBで現方式が動くことを確認した。peak allocated14.970/reserved17.588GiB。最終archive全24memberのhashと32tensor有限性/前後重み不変をPod外照合し永続保管済み。NLL0.251117→0.245189、raw6/8変化だが、CMEE意味/本文は前後0/2。初回の根拠座標は通るようになったが必須shape/自然文surface不正、訂正後rawは不変、proxy2件が2048tokenで打切りとなり品質未達。その時点の残件は必須shapeと自然文surfaceで、後続の現在作業は下段へ更新する。この§24のrunはGPUを停止せず終了した。旧3070は今回開始時既に停止表示、華恋のStop操作0。

**GPUの現在状態（10/31後続実測）：** Mashが新Podを用意し、Googleログインからの作業継続を指示。対象10o4zhfktg9nc1/RTX PRO4000 Blackwell24GB・表示$0.58/hへ直接Jupyter接続し、固定4B/fit38を復元して追加学習なし18生成を完了。終了確認でprobe processなし、GPU2MiB/0％、ad8b/config不変。Stop/restart/deleteは0で稼働保持。setup前から終了確認まで1142.077秒/当該窓按分約$0.1840で、レンタル全体/認証/終了後保持等の総費用は未測定。前段のGPU停止というMash報告と10/30旧Pod記録は履歴として区別する。

**直近の学習実行（10/30・focus29一回完了／不採用閉鎖）：** Mash承認の保存ad8b隔離初期値・現10行各2回＋旧9各1回＝29更新を同Jupyterで一回実行し、29 training forward/optimizer・保存非学習再読・同19行NLL・新2件×5段の10生成/全EOSまで完了。全19教師/messages/encoded/元終端/mask/完全CE/指示/受信/合否は不変。新ed298856は112有限F32/3,833,856params、実runは全112変更を記録した。

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

**10/31構想の訂正：** わたしマップの直近28日は華恋の実装・判断で、Mashの構想ではない。全蓄積・ルート・月次当時履歴・現在との見比べを初版の完成案に戻す。100件は現コードの固定判定で性能限界の実証ではなく、Mashの許容はスペック上妥当であることが条件。100件分割・日次更新・月末保存・プラン別マップ履歴期間は未決。保存されていない過去月を現在再分析して「当時の分析」としない。詳細は第9回§3.3。

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
| Emlis初回 | 旧保存profileは観測＋「Emlisから」の二段を維持。10/31指示の本人宛応答のみを新private natural_reply.v1で通常入力/SQL保存/DTO/RNへsource接続。意図的短文化・文数固定なし。意味checkpoint/5段packetは新初回本文の条件にせず、分析材料はNOT_GENERATED | 合成providerを含む実Q3 SQL/RPC・GET非生成・ACK回収/重複防止を限定検証。実4B品質・提供口GPU起動・API配置・新RN配布・本人端末は未実施。新profile任意問い/補足と分析材料生成は未接続。PRODUCT_NOT_CLEAR/正式0/3/candidate_ready=false |
| Emlis任意問い・回答更新 | 問いは実装済み。Free／Plusはthread全体0..1、Premiumは本人続行により逐次0..3。skip・終了・訂正・撤回・再読あり。原入力と補足を別sourceとして束縛 | 問いを出さないENDだけで十分理解したとは判断しない。回答は新規感情入力件数や国家eventへ加算しない。一般入力・回答後本文・本人実機一往復の品質が残る |
| Emlis有料拡張 | 既決：Freeは当回入力のみ、Plusは関連する過去本人入力も照合。旧Q3は365日内直近3件・同文一致中心、旧semantic 4B受口はFree相当/履歴あり拒否。新natural source候補は既存本人履歴3/6件の原文受渡し/Free除外/過去Safety除外を保持 | 新profileの3tier原文境界を合成provider/実SQLで確認したが、全蓄積からの関連選択、本人補足の混在、実4Bの意味ある履歴応答は未完成。過去の具体内容と今回との関係が実本文へ現れることが完成対象。Premium等の販売延期は未採用案 |
| 配置と本人確認 | 共通APIは10/23にPiece限定overlay3577d7fdでLive、Emlis内容は土台10/10版5c8bd8eを継承。u353〜355は未配置 | Piece作業でservice identityのみ確認。Emlisの本人実機/品質は今回再検証なし。10/10の本人表示1件はMash評価で不合格。同じ保存本文の履歴再表示まで確認済みにしない |
| 27B旧試験（選定除外） | 10/23 Mash決定で27Bを候補から除外。`Qwen3.8-27B-Q4_K_M.gguf`の試験は履歴として保持。10/21、架空相談2題×実演あり／なし×初回／回答後＝8出力の推論試験 | 追加情報の取込みは見られたが、未確認な意味の補完、近い問いの再提示、更新記録の欠落が残る。実演ありの一貫した優位未確認。重みの追加学習0、27BのCMEE統合0、他core適性未検証、製品採用未確定。Pod停止はMash報告受領済み |
| 観測教材 | 6回の対話から[候補18件・教示5参照](observation_learning/training/2026-10-23-pilot-prep/README.md)を整形。Mash逐語10（問い9＋訂正後観測1）／華恋編集4／架空補充4を区別。第7回は利用場面後付けの不備を認め取り下げ、学習・再開先から除外。自然な完成受け取り・通した修正実演・Piece／Analysis教師と独立評価は不足。10/27に基本相談式・短い実入力式の難しい例はMash・分析向けも時々という収集分担を決定し、[OBS-20261027-001のD00](observation_learning/sessions/2026/OBS-20261027-001/01_dialogue.md#d00)と質問前設定を保持し、D11まで採録。Mash観測文と、本人の感想の撤回／保持の見極めについての教示を保存。観測会終了は未指示。学習／評価への投入は未実施 | [Free9教師・比較6入力](observation_learning/training/2026-10-24-emlis-free-pilot/README.md)でMashのA40にて初回9step完了。初回adapterは未回収だが、同設定の別runと保存adapter再load／9教師適合診断は完了し、重み入りarchive全33fileとchecksumを照合。加重NLL1.81506→1.65714、全9件低下・生成8/9変化。ただし教えた事例にも未返信・約束・訂正後の喜びの理由の補完が残り観測品質は未合格。初回重みの復元とは扱わない。[受領結果](observation_learning/trials/2026-10-24-qwen9b-free-lora/recreated-run/README.md)。JSON-onlyのない旧promptと解析失敗は試験側の不整合も区別。最新結果は[4B・9B受領比較](observation_learning/trials/2026-10-24-qwen4b-9b-comparison/README.md)。MashのA40で4B／9B各6回答、計12回答が完走し受領原本と固定sourceを照合済み。JSON全件成功・打切りなしだが意味品質は両方未合格。9Bの品質優位は見られず、比較時点では4B候補保持を華恋が推奨。その後、本報告会でMashが4Bに確定した。4Bは不明保持・補足／椅子訂正で相対的に忠実だが、開店の距離方向を反転し、Piece根拠・Analysis結果を創作する。9Bにも感情理由補完・別記録への誤edgeが残る。PyTorch peak allocatedは4B8.737／9B17.814GiB、単独速度は出力量依存。本番提供原価・680／1,480円での採算は未測定。既存9教師は全件Emlisで、開店方向と自然な受け取りを既に教える一方、Piece／Analysis完成例は0。[固定提供案の原価試算](observation_learning/model_selection/2026-10-24-production-economics/README.md)は完了。基準案95,094円/月は予算外で不採用推奨、最適化構成や本番原価の実証は未成立。10/24の4B確定は10/25に撤回済み。[CM-01/T1 actual](designs/cmee/v1/01_shared_kernel_and_runtime_contracts.md#cmee-4b-model-proposal-implemented)はMash承認後にAPI02c0b943へ実装。新private意味／自然本文／実問い／保存再開とasync注入境界はCPU検証済み。新4Bpackは実native2診断教師・旧7件未対応、学習外EFREE6 proxy、runner／診断／退避／raw consumerを実装。初版の実tokenizer最大7856 tokens、CPU指示修復版は最大7955/生成枠8126、context8192/max_new2048を維持。旧完成JSONの単純wrapは採用不可で、旧9教材は不変。実4Bの一回診断は承認後に完了。2教師/1周/2update・保存adapter非学習reload・前後16生成・24GB完走を確認し、最終重みを回収照合して試験Podを削除した。16GBは未試験。実rawのCMEE採用/本文は前後とも0/2で、NLL低下を品質成功へ換算しない。旧9Bの1／4／16周は再開せず、追加試行・商品価格／quota変更0。 10/25の最新新入力32更新では意味2/2・本文1/2へ進展。指示追加候補は意味1/2・本文0/2で退け、学習時入力へ戻した。局所診断後のLR1e-5候補は不採用だが、LRだけ5e-5へ変えた4更新で既知FIT意味/本文2/2へ到達し、実モデル2callのoffline一往復も成立。現在の詳細は冒頭とweekly§36を優先し、§33は履歴。新しい観測会をMashへ依頼せず、全文比較と記録は華恋が担う。原18候補・教示5参照・9教師・旧評価・受領重みを増量／改変しない |

**10/31・学習方式の現物確認：** 最新19行はBOOK／SHOP各5段の10行＋椅子6／食事3で、19種類の自然な相談ではない。題材別意味条件と5段構造・観測／受け取り／更新説明の3本文を要求する。BOOK教師にも同じ気掛かりを3欄で近く言い換える重複がある。ただし両回答後のquestion正解はnull・追加問い禁止で、本文の疑問・主体反転・長い反復は教師どおりではない。学習時は正しい前段、実生成時は誤りを含む前段を渡す。反復の単一原因は未確定。最新2件の5段生成合計は約102秒／110秒で通常30秒と差がある。本人宛応答と分析構造の生成責務を分け、通常接続内で小さく比較するのは華恋の未実装提案。既存根拠・本人境界・保存整合を保持する。詳細は第9回§9。

詳細owner：[Emlis map](current_structure/01_emlis_ai_current_structure.md)、[CMEE map](current_structure/04_cmee_current_structure.md)、[Emlis詳細設計](designs/cmee/v1/02_emlis_v1a_detailed_design.md)、[観測教材](observation_learning/README.md)。古いmap本文の「問い未実装」は後続Q3／Q4・実sourceと矛盾する旧状態であり、現在へ戻さない。

## 5. Analysis — 蓄積を本人の情報へ返す

**目標と実装の差：** 第9回§3.3の累積マップ・月次当時snapshotがMashの構想。下表のV2期間方式、既定28日、100件超拒否、隣接期間比較を、その完成と同一視しない。現在の隣接期間比較は今の方式で二期間を作るもので、当時の保存結果を選ぶ履歴比較とは別。通常生成は有限文法が中心、4B未接続。累積更新・月次保存・月選択・現在との比較・元記録tapが残件。

| 機能・構想 | 現在の実装・境界 | 稼働・本人確認・残件 |
|---|---|---|
| こころ天気 | 感情選択・強さ・時刻から当日／日／週／月の比率・揺らぎ・切替りを返すAPI／RNあり。日＝前日、週＝7日、月＝28日 | 既存稼働経路。原因・未来を断定しない。短いmemoでも感情記録の集計価値は別に成立し得る。今回、本人データ・実端末の再検証なし |
| 従来わたしマップ | 役割スイッチ／ルート／分かれ道／未観測領域を表示。旧builder・保存・latest／history／detail・renderer経路あり | 固定4step・汎用結果文を含む旧経路。完成目標の根拠付き観測グラフと同一視しない。V2へのglobal cutover未完了 |
| V2観測ルート | 期間内の原入力と適格補足から五種node、明示順序・無方向共起、訂正・撤回を限定対応。source adapter／compiler／realizer、immutable保存、既存API分岐、RN表示あり | 一般日本語・全段階の理解は未完成。V1-D基盤とu102〜118は指定開発配置済み。u129〜250の内容修正は資料上未配置。通常本人生成→保存→再表示、保存identity独立照合、商品受入れは残る |
| P5 offline意味snapshot | 原3構文familyの元7field／18保持単位から同一private graph・文章・図・3段階保存再読。API666b285、新private型6／例外2 | 対象9file905成功。Plus・補足0・比較なしに限定。通常V2／SQL／DB／RNへ未接続。原文保持とprivate図payloadであり、一般文章品質・商品受入れは別 |
| 守るもの・負荷・不明・不一致 | V2で本人明示の守る意向／現在負荷、対象付きunknown／conflictを文章・図へ接続 | 限定対応。一般的な保護・負荷理解や解釈仮説は未完成。旧v1の未実装表をV2の全未実装へ転用しない |
| 期間比較 | 隣接等長期間のルート・注記・不明範囲・不一致を比較し保存・表示。前期間なし／比較不能も区別 | 比較SQL適用済み。設定手順はMash報告で、稼働値の独立取得なし。本人の比較成功・正式受入れ未成立。改善・悪化・原因を自動判定しない |
| もしもルート／IF | 詳細設計あり、runtime未実装。現在の観測ルート＋本人が選ぶ分岐点・意向・制約→条件・負荷・未知を伴う1〜3候補を並列提示 | SELF_ONLY。health／medical、および他人の意図・反応・関係の結末を対象とするIFは対象外。最適解の順位・成功確率を付けない。生成・保存・API・RN・実機・受入れが残る |
| SavedRouteIntent | 本人がIF候補から明示保存した関心方向を残す設計あり。runtime未実装 | 観測事実、仮想候補、本人の選択を分離。選択を実行済み・達成・失敗・性格へ昇格しない |
| 最新・履歴・詳細 | 保存成果物、文章と図、期間を同じidentityで再読。認証・tier・期限・source変更を再検査するV2コードあり | 専用table適用済み。6201実機OK・6401送信は過去記録。後続10/10にAPI5c8bd8eを配置し、6501を送信し、「入力情報が少ないため、まだ分析を表示できません。」は本人表示確認済み。端末build独立照合、本文生成・保存再読・比較は未確認。latest再読とmonthly履歴は別経路 |
| Emlis補足との接続制限 | 原入力と適格補足を一つの記録機会に束縛。生成された問いや応答は本人sourceにしない | 現行期間source loaderは同一threadにANSWER2件以上で`analysis_multiple_answers_not_supported`。pure source adapterも補足2件以上を`analysis_supplement_cardinality`で拒否する。Premium複数回答全体の採用未対応。対象threadを除外したり原入力だけへ戻したりせず、その期間sourceの読取／生成を拒否する。「原入力＋2回答が期間Analysisへ接続済み」としない |

詳細owner：[Analysis map](current_structure/03_analysis_current_structure.md)、[Analysis詳細設計](designs/cmee/v1/04_analysis_v1d_v1e_detailed_design.md) §7〜11・15〜16、schema §7・9.6。10/10の不足案内API `5c8bd8e5…`と6501送信、本人の不足文言表示確認はAPI運用記録§39/40にある。最後の共通API配置記録は10/23 Piece overlay `3577d7fd…`（5c8bd8e土台）で、今回Live再照会ではない。後続内容修正版の未配置と本文生成・保存再読・比較の未確認を分ける。詳細手順は[第8回§8.5](weekly_reviews/Cocolon_Weekly_Review_20261024.md#details-analysis)。

## 6. Piece — 本人の意味を他者へ伝える

**10/31の質問と見解：** 通常Pieceは4Bを呼ばず、sourceに結び付いた有限編集。背景・文字色・配置・改行計測・画像出力に4Bは不要。核の選択・否定や留保の保持・単独文章への再構成は言語理解が必要で、4Bは候補だが必須の特定モデルではない。観測意味を共有できればPiece専用の追加推論が常に必要とは限らない。専用4B接続を一律の発売条件にしないという華恋の推奨で、Mashの質問を仕様変更の合意にしない。初期の有料価値を背景・文字色等へ置く方向と、12配色等の未採用案は分ける。

| 機能 | 現在の実装・境界 | 確認・残件 |
|---|---|---|
| 本文・visual recipe | 保存済み本人source→単独で伝わるcanonical text＋画像。現V2 source adapter／pure coreはoriginal＋normal／pre-questionのみ。refinedは別sourceのopt-in補足を使う設計だが、現コードは`source_role_or_stage_not_yet_supported`で未対応 | 旧Q&Aの存在を新商品の定義にしない。Emlis生成本文・Analysis推定の原文流用は禁止。補足をoriginalへ連結してrefined接続済みにしない |
| preview・保存 | 本文・画像設定・取消・保存・回復のsource接続あり。iOS renderer供給とsame-mount/token current fitを接続。owner／runtime／quotaを別に確認 | 実Authの通常入力→preview→明示private保存は未確認。preview＝保存record＝card＝renderer入力＝export本文を保つ。保存後の本文・format・recipe変更は新record |
| V2有効化・旧経路 | 既存APIの明示factory構成は10/23に3577d7fdでLive、private4true/public4false。default app:appはsource上legacy/OFFを維持。RN通常入力のV2 sourceあり、tutorial/Nexus旧経路は残る | 稼働設定成立と本人端末の通常保存は別。M5の全公開経路廃止は未完 |
| 本人履歴・詳細・公開範囲 | owner一覧・詳細・公開切替・削除、通常導線・保存後再取得を接続。privateはownerのみ、publicも既存access policy内 | 同一ownerの実Auth保存→履歴／詳細往復は未完。アプリ内公開と外部画像共有を分ける |
| export | 本人詳細→fresh GET→表示recordのID・row version・3hash・renderer一致→全canvas→明示Photos／Shareをsource接続 | 実OS写真保存・Share、Android新版export、backend receipt、本人端末商品受入れは未完。外部へ出た画像コピーは内部非公開／削除で回収できない |
| 新renderer | iOS `piece.rn_bitmap_renderer.ios.v1`。検査した同一bitmapを表示/書出し。preview fit・構築の元8秒、完成saved画像は8秒後も保持 | API供給はTTL600秒/同rendererでLive。本人通常描画・保存・再読と商品採用は未確認。最新送信6501は新版を含まず、87151固定候補のTestFlight送信は未実行。Android新版成立へ拡張しない |
| 最新限定検証 | 新export正常8PNG＋native拒否6。JS979・新native44成功。旧195は176PASS／19FAILを保持 | CI39780623108 attempt1 completed／failure、head`d2e1244…`、10/22 JST21:42:54〜22:07:18。CI全体合格ではない。限定TECHNICAL_CREDITの記録あり、product_credit=0 |
| live・次の未完 | 10/23 Live3577d7fd/dep-dbd8hjoae00c73firbt0・承認command/autoOffは監視readで不変。privacy2pathはPR3@3084c99eへ同一blobで同期済み、唯一CI39864098163は1805 PASS/FAIL0/SKIP0 | 現在ownerは入口§119/map65.62/weekly5.6.42/manifest v159。本人保存にはRN新版が必要。候補branchを87151へ固定、既存署名build/TestFlight送信1回の一回をMash承認受領、実行前checkpoint。本人保存/再読・実OS/端末/商品受入れ未完 |

詳細owner：[Piece map](current_structure/02_piece_current_structure.md)、[Piece入口](../Cocolon_Piece/00_read_first.md)、[manifest](../Cocolon_Piece/manifest.json)。配置済みのAPIを本人保存成功へ昇格しない。最新iOS送信成功38041653252/source55142229（番号式6501）には正式eligibility供給と保存host接続がなく、current87151の既存製品差29pathを含む版が必要。固定候補の署名build/IPA/TestFlight送信は未実行。本人端末への導入有無も未確認。

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
| 生成基盤・開発運用 | APIのCMEE EngineにEmlis thread／Piece／Analysis consumer分岐あり。既存共有text core・生成guard・contract・tests、RN build／CIは支援基盤 | 固定snapshot／旧禁止条項はその時点の範囲。学習済AIはprivate注入境界・保存rawのconsumerを実装済み。受け取りloss4更新/LR比較後の既知FITは意味/本文2/2。実モデル2callのoffline一往復（actual prior、問い1、訂正3更新、END）まで成立。Engineのcold file再開2/2、承認済みoffline180秒/通常30秒を実装。実4Bのfresh ID02で初回/訂正後service・隔離SQL保存、意味保存後中断/明示再開、保存済み非生成再読まで成立。さらに4題材6教材の合成nativeをprivate版3へ接続し、隔離SQL6状態の同snapshot再開/保存非生成再読までCPU確認。当該CPU確認での実4B生成は0。本人端末/一般言語品質は未成立。稼働設定・秘密値・DB実値・端末は原本sourceから推測しない |
| System Context | 実装正本はPR37、商品原本はPR30/API PR3の別checkout。旧CLI/追跡読順を正規routeへ同期し、全機能原本・最新weekly・観測教材・三core現物を選択対象へ追加、seed期待の不一致を修復 | 最新cacheは未生成。固定環境doctor34項目/関連CIは成功したが、API Python索引1874対象が1200秒/1800秒ともtimeout。2回目は処理中のPR30費用案更新により終了時head確認も不一致。失敗・原本との差を[PR37](https://github.com/MassyuRed/Cocolon/pull/37)へ記録し、同じ時間延長だけの再試行を停止。tracked currentは8月snapshotで使用不可。fresh原本の直接読取を使い、最新索引完成とは扱わない |

共通状態として、未入力／不足、保存中／保存失敗、本文生成失敗、回答待ち／skip／終了／訂正／撤回、履歴なし／期限切れ／source失効、未認証／owner不一致／プラン不足、非公開／公開／削除、未読／既読、課金保留／有効／失効／復元を区別する。具体的挙動は該当contract・実ownerで確認し、この列挙を全状態遷移の実機合格証にしない。

## 8. プランと、次作業を選ぶときの現在地

**以下の表は既存表示・権利・コードの状態で、10/31の構想を上書きする確定新プランではない。** Free当回のみ／Plus過去本人入力も照合は維持。旧表のFreeマップ履歴不可・Plus1年等を、新しい累積／月次構想へ無検討で適用しない。マップ履歴のプラン期間は未決。料金は最新指示でPlus680円／Premium1,480円に確定し、表示設定とfallbackへ反映（§15、実ストアは未確認）。Free／Plus販売2区分、AI月30／100、Piece新規生成5／30、配色12等は華恋案で未採用・未変更。入力保存・既存成果物再読をAI枠へ従属させず、累積構造を枠で切り捨てない。

| プラン | 仕様・表示上の体験 | 成立状況の限界 |
|---|---|---|
| Free | 当回Emlisと任意1問、軽いmap概要、Piece月5、入力等の履歴は当月＋前月。わたしマップは最新概要のみで履歴不可 | code・表示と、自然な本人理解の品質は別 |
| Plus | 適格本人履歴を用いたEmlis、こころ天気の文章／理由、標準map・直近1年履歴、Piece月30 | 履歴参照と有料差の体感は同義ではない |
| Premium | 修正できるframeと本人続行の最大3問、長期weather・深いmap、無制限履歴／Piece、設計上のIF・Saved | IF／Saved未実装。同一期間V2 light／standard／deepの本文・graph差は未成立／未確認で、表示上の権利を能力の完成へ換算しない |

10/31最新：Mashの明示指示でPlus月680円／Premium月1,480円へ変更。RNのcatalog・選択画面・account料金helperとAPI fallbackを同期し、Supabase `subscription_plan_catalog`の`price_label`／`note_lines_json`を対象2行だけ更新・独立再読した。料金・案内と`updated_at`以外のDB列は不変。既存APIはPlus／Premiumの`note_lines`を公開時に空にするため、DB案内の更新を画面表示成功とは扱わない。実ストア請求額・税込区分、新ビルド／端末表示は未確認。公開`/subscription/bootstrap`直接取得はtimeout。10/23時点の月300円／980円は変更前の記録。Pieceの5/30/無制限は保存数で、新AI生成数の上限ではない。Emlisの1/3問もthread単位であり、月間生成費を制限しない。

**10/23 Mash決定：Plus980円／Premium1,980円が価格の上限（これでも高い）、27Bは候補外。10/24は680円／1,480円を価格候補として検討する。980／1,980は9Bの損益分岐価格ではなく、独自LoRA版の本番原価は未測定。** 旧1,980/3,980円の推奨と27B再試験案を撤回。[小型AI再選定・全core原価](observation_learning/model_selection/2026-10-22-three-core/2026-10-23-small-model-reselection.md)では、Mashの残高利用希望により、Qwen3.5-9BのM1をMashがRunpod A40で実行し、4件の受領原本と全本文を照合済み。画面上のGPU単価は$0.59/h、起動前残高$5.15。受領原本のvLLM0.32.0／BF16／非thinking／context8192／温度0で、要求90.607秒・4805token。インストール・読込・待機を含むGPU総時間・総消費は未確認。Stop完了はMash報告を受領済みで、管理画面の独立確認はしていない。DeepInfra既製APIは比較資料へ残し、Qwen3.5-4Bは当時の別候補から、10/24のMash決定で一度確定した後、10/25に撤回された。10/23の旧比較では980/1,980円を基準とし、Free30/Plus100/Premium150セッション等の利用量でも、以前のDeepInfra既製APIを仮定した月原価は約5.57/37.07/147.28円で、Runpod自己hostの原価ではない。無料者・固定基盤・税相当留保・ストア費を含めて計算した。これらは利用量感度で、商品quota変更・採用・品質合格ではない。独自追加学習版の配備に公開API単価を流用せず、育成費・学習後のhost費用は別確認。旧費用資料は履歴として参照する。

次週10/31〜11/7の基準計画は第9回§11。10/31〜11/1に本人宛出力・分析材料・保存責務と通常接続source、11/2に同一4Bのbase／保存adapter一つを最大8入力×2の小規模比較、11/3にFree実機一往復、11/4〜5にPlusの関連履歴と実機確認、11/5〜6にPiece1デザインの保存・画像出力、11/4からAnalysis材料受取に着手し11/6〜7に累積snapshot保存の最小範囲を進める。共通3欠陥は11/1〜6のGPU不要枠、11/7に実物・未達・費用を報告する。単独writer・実測前の管理日程で全完成保証ではない。追加学習を既定の初手にせず、GPU／配置／配布が必要な操作はsource準備と有効許可を確認して具体化する。§5・§9は検討履歴として保持。次週の旧推奨順位は第8回§4の履歴。4B/Runpod育成・Windows/Mac未選定を保持。quote18、受け取り6、balanced12、boundary12、surface12は各終了原本の履歴で、閉鎖planを起動し直さない。最新joint12は固定9の意味/本文9/9、その成功後だけ同family日常2件の実service保存再読2/2まで完了・閉鎖（§49最終）。新重みは限定検証の保存候補で、一般観測品質や本番/商品採用とは分ける。

| 作業領域 | 次に解消すべき具体的未完了 |
|---|---|
| 本人宛応答の通常接続 | source実装/実4B18生成/実本文2件の隔離Q3 SQL保存・別service instance再読まで。主体/感情所有・一人称の品質は未達、指示修正2件も不採用。実GPU HTTP/API適用/RN配布/本人端末保存再読は未実施。新profileの問い/補足・分析材料・Plus全蓄積検索も未接続。第9回§17/API自然応答開発資料へ戻る |
| 学習済みAI・CMEE接続 | §136：focus29の29更新/2load/19NLL/新2×5段10生成を完了。全EOSでも両S5の本文型不正・意味/本人本文0/2、新CMEE/保存/cold0、旧9NOT_RUN。BOOKの引用scope/謝罪主体逆転、SHOPの未宣言引用/更新割当/本人一人称再掲が残る。処理786.373秒/約$0.0612按分（準備等別）。全55原本/112有限F32追加重みを回収照合・保管、298frozen/ad8b不変。不採用閉鎖・再試行/自動次run0。[全実結果](observation_learning/training/2026-10-26-unconnected-native/role_binding_preparation/fixed_rows/stage5/focus29/execution_20261030/README.md)。追加観測会不要。 |
| 10/24までの費用・4B選定履歴（当時の構成） | Flex24GBの旧月78,980生成・未測定の速度/起動仮定による運用費95,094円・赤字67,833円の試算は当時の構成の記録で、最新構成の原価ではない。[全仮定・再計算](observation_learning/model_selection/2026-10-24-production-economics/README.md)。旧4B実診断では24GBでLoRA保存・reload・16生成・回収を確認したが、FITは前後0/2。CPU指示修復API1dabc4fは54対象/pack11・合成2/2で、修正版は後続10/25にA4500 20GBで完走・回収済み、最新結果は§24。旧学習peak allocated14.954GiBを本番推論の必要VRAMへ流用しない。4bit/M4を第一候補とした§23は当時の華恋案で、現在の移行先はWindows／Mac未選定。公開API単価を独自育成版の原価へ流用しない。 |
| Emlis | 一般入力と回答後の意味・自然な本文・有料差、本人実機の保存再読まで。u353〜355のコードと配置差を保持 |
| Analysis | 最新内容修正版の配置差、通常本文生成・同一保存再読・monthly履歴/比較の本人確認、複数ANSWER採用、一般理解、有料差、IF／Savedの未実装。6501時点の不足案内表示は本人確認済みとして保持 |
| Piece | API private構成はLive。正本privacy差は3084c99eで解消。本人保存に必要なRN sourceはbranch agent/piece-testflight-private-20261023@87151へ固定、既存iOS workflowによる署名Archive/TestFlight送信1回は個別判断前・未実行。本人保存→同owner履歴/詳細、実Photos/Share、Android/backend receipt、商品受入れは残る |
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
| Piece実物 | `PieceOwnerHistoryScreen`、`pieceExport`、`PieceExportCanvas`、`pieceRenderer`、`InputPieceActionArea`。入口§119／map§65.62／manifest v159、CI39780623108とAPI39864098163、Live dep-dbd8hjoae00c73firbt0 |
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



