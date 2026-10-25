# Cocolon 最新情報 — 全機能・全状態

更新日：2026-10-25 JST（最新差分：承認済みdaily食事familyをAPIbd356566へ実装、CPU174/合成3service保存再読成功。9行/18更新の学習前checkpoint）。全Cocolon作業の必読原本。

> **最新報告会：[第8回・2026-10-24](weekly_reviews/Cocolon_Weekly_Review_20261024.md)。** 今週実績・前週目標の達否と10/24〜10/31の管理案を記録。**Mashの指示により報告会終了。** 華恋の意見全文は[§10](weekly_reviews/Cocolon_Weekly_Review_20261024.md#karen-closing-opinion)、終了時の区分と再開先は[§11](weekly_reviews/Cocolon_Weekly_Review_20261024.md#meeting-closed-and-next-session)。10/24の4B確定・GPU16GB優先/24GB許容は当時の決定で、4B確定は10/25に撤回済み。最新の開発基準選定は[§23](weekly_reviews/Cocolon_Weekly_Review_20261024.md#20261025-three-core-model-and-serving-decision)。華恋が今回の判断責任として選んだもので、旧4B確定・常時24GB契約の自動復活ではない。起動済み3070の実確認は[§22](weekly_reviews/Cocolon_Weekly_Review_20261024.md#20261025-3070-running-cuda-uvm-io-error)。A5000未確保は§20の履歴。Vast実見積りは§19の履歴。次週の推奨順位は[§4](weekly_reviews/Cocolon_Weekly_Review_20261024.md#next-week-priorities)、対象path・具体手順・失敗/回復検査・終了条件は[§8](weekly_reviews/Cocolon_Weekly_Review_20261024.md#detailed-work-breakdown)を参照。全体管理評価・公開見通しは[§9](weekly_reviews/Cocolon_Weekly_Review_20261024.md#overall-status-and-release-outlook)：54.50％、正式商品受入れ0/3、12/18達成の裏付け不足。会議途中の「進行中」は当時の記録。次週案全体への明示採否・個別実行の未決は§11に区別して保持する。モデル選定の決定と、以下の品質・配置・端末・費用の未完了を区別する。

**最初のA4500学習実績（§24・履歴）：** [A4500で修正版4B追加学習を完走、重み回収、CMEE採用は未達（§24）](weekly_reviews/Cocolon_Weekly_Review_20261024.md#20261025-a4500-training-and-portable-weights)。[全実結果](observation_learning/trials/2026-10-24-qwen4b-cmee-diagnostic/repaired_a4500_20261025/README.md)。Mashは4B採用とリリースまでRunpodでの追加学習を明示し、将来は手持ちPCへ移す可能性が高い。RTX A4500 20GB／Secure・EU-RO-1・Pod y0eb0w0qn6nks0を今回の最安の容量候補として確保。GPU$0.25/h・50GB container込み表示$0.26/h。CUDA/BF16正常、修正版2教師/1epoch/2update・adapter保存/非学習reload・前後16生成が20分23.76秒で完走し、20GBで現方式が動くことを確認した。peak allocated14.970/reserved17.588GiB。最終archive全24memberのhashと32tensor有限性/前後重み不変をPod外照合し永続保管済み。NLL0.251117→0.245189、raw6/8変化だが、CMEE意味/本文は前後0/2。初回の根拠座標は通るようになったが必須shape/自然文surface不正、訂正後rawは不変、proxy2件が2048tokenで打切りとなり品質未達。その時点の残件は必須shapeと自然文surfaceで、後続の現在作業は下段へ更新する。この§24のrunはGPUを停止せず終了した。旧3070は今回開始時既に停止表示、華恋のStop操作0。

**現在の直接作業：** [承認後の実装と9行の学習準備§38](weekly_reviews/Cocolon_Weekly_Review_20261024.md#20261025-daily-calm-approved-implementation)。Mashが§37の日常食事family追加・18更新・保存再読の限定検証を明示承認。APIbd356566の3製品owner＋新test/fixtureを実装し、限定4file174成功（新60＋既存114）。旧chairの実行captureと意味/snapshot/本文/問い/3更新/model入力は全文一致。dailyだけ5claim/4関係/内部版2/2・初回/問いなしへ対応し、合成3service identity/SQL30RPCで保存非生成再読を確認。旧chair6行をbytes不変で保持した9行/2familyと18update/FIT9の新有限planを凍結。本物tokenizer事前確認とGPU学習・実model保存再読は未実行。GPUのA4500稼働/76309b86を再確認しSTOP0。新観測会不要、通常app/本番配置/DB変更0、正式0/3・54.50％据置。 [原本](observation_learning/training/2026-10-25-emlis-daily-calm/README.md)。

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
| EmlisAI | 今回の入力を読んだ観測、人間的な受け取り、必要な一点への任意問い、本人回答に基づく読みの更新 | 原入力と補足を保存・再読する。生成した応答本文そのものを他coreの本人sourceにしない |
| Piece | 本人の考え・価値観の核が、他者へ単独で伝わる文章と画像 | 許可された本人source→preview→明示保存→本人履歴・公開投稿・画像共有。Q&Aは旧仕様 |
| Analysis | 蓄積記録から感情状態、場面・役割・選択・行動の構造、期間による記録上の違いを文章と図で返す | こころ天気、観測されたわたしマップ、期間比較、別枠のもしもルート／保存した意向 |

CMEEは三中核を支える共有生成中枢。独立した第四の商品中核ではない。共通の意味理解・日本語生成を使っても、coreごとのsource採用、何を言うか、声、保存・公開・受入れ責任を分ける。Pieceの本文やAnalysisの推定を本人の発言・事実へ逆流させない。

**学習済AIをCMEEへ接続し、既存資産を生かす方針は決定済み。** Mashは今回4B採用を確認し、リリースまでRunpodで追加学習することを明示した。Qwen3.5-4Bを共通基盤にcore別教示で育て、LoRA→学習済重みの統合/4bit変換→既存CMEEへ接続する。比較4Bまで・追加月額上限1万円・安定してアプリから使えることを保持。最終的な手持ちPC運用は可能性が高い方針だが、Windows／Macとも候補でOS・機種・購入は未確定。M4 16GBは候補情報の一つ。採用するPC/実行方式での量子化品質・速度・同時数・常時運用は未確認。移行には固定base全重み/config/tokenizer/chat template＋LoRAと設定を保持する。厳密な途中再開にはoptimizer/RNG等も必要で、現診断runnerはそれらを保存しない。学習済adapterを別環境で読む/次の学習を始めることと、同じ途中状態への再開を区別する。[今回の確保・学習・保持条件](weekly_reviews/Cocolon_Weekly_Review_20261024.md#20261025-a4500-training-and-portable-weights)。

**10/23 Mash承認：CMEE側の接続仕様・offline準備を先行する。** Mashの追加範囲への「進めていいよ」を受領し、本人明示のJOY_ASPECT不明と二行動を、新規・明示offlineの`emlis_candidate_snapshot.v2`へ限定実装した。原E02-0は四claim／unknown statement→joy対象／過去の喜びと記述present／原格4つ／OMITTED主体／te連結とconcessionを、既存作者の実本文・private保存再開まで保持する。E02-0自身は問いなしENDで、架空pendingを作らない。 最終対象146 passed／FAIL0／SKIP0、106.30秒、既存警告2。内訳はsnapshot同family70（旧35＋新35）、P1旧22、Q2/Q3 application旧54。34 subtests・反復実行・本文採取を件数へ加算しない。旧adapter1/2の全outcome fixtureは変更0。旧広範囲Q1/Q3の未分類失敗は未解消で、全suite成功とはしない。 実モデル/通常有効化は未実施。最新は[weekly L](weekly_reviews/Cocolon_Weekly_Review_20261017.md#20261023-cmee-targeted-unknown-action-v2)と[trial §9](observation_learning/trials/2026-10-23-current-four/README.md#targeted-unknown-action-v2)。旧v1のE02未対応はその版の履歴。 前回CIは共有owner identity fixtureの同期漏れで失敗。fixture1pathをAPI302d122で同期し、既存失敗検査1件は成功（広範囲CIの再実行0）。Mash承認により、[Piece P4](designs/cmee/v1/03_piece_v1c_detailed_design.md#cmee-p4-implemented)を限定実装した。原7field・6claim／5文・2関係・全選択を保持し、本文にない感情／原因／強度を補わない。既存plan／唯一作者／author-free検査とprivate serialized保存再読まで到達。対象7file339 passed／失敗・skip0（34 subtestsは上乗せしない）。出力は原文段落保持で、一般文章整形・商品品質の合格ではない。通常B8／実DB／画像／モデルは未接続。[Analysis P5](designs/cmee/v1/04_analysis_v1d_v1e_detailed_design.md#cmee-p5-implemented)も具体承認後に限定実装。原3記録の意味snapshot→同一private graphの文章・図→3段階保存再読まで到達。対象9file905成功。通常Analysis／DB／RN／実モデルは未接続で、一般文章品質の合格ではない。

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
| Emlis初回 | 観測と「Emlisから」の受け取り。Layer1は根拠を外さず、Layer2が人間的な受け取りを担う。比率1:9〜4:6は内容に応じた方針で、文字数割当ではない | 生成・保存・API・RN接続あり。有限表現、主体・時点の誤認、原文反復、薄い／定型的受け取りが残る。商品`PRODUCT_NOT_CLEAR`、正式Product Read未成立、`candidate_ready=false` |
| Emlis任意問い・回答更新 | 問いは実装済み。Free／Plusはthread全体0..1、Premiumは本人続行により逐次0..3。skip・終了・訂正・撤回・再読あり。原入力と補足を別sourceとして束縛 | 問いを出さないENDだけで十分理解したとは判断しない。回答は新規感情入力件数や国家eventへ加算しない。一般入力・回答後本文・本人実機一往復の品質が残る |
| Emlis有料拡張 | Plusの適格本人履歴、Premiumの逐次問い・本人が修正／否定できる根拠付きframe、条件付きLayer3を実装 | 履歴が使えるコードと、本人固有の深さ・有料差の体感を分ける。有料商品品質は未受入れ |
| 配置と本人確認 | 共通APIは10/23にPiece限定overlay3577d7fdでLive、Emlis内容は土台10/10版5c8bd8eを継承。u353〜355は未配置 | Piece作業でservice identityのみ確認。Emlisの本人実機/品質は今回再検証なし。10/10の本人表示1件はMash評価で不合格。同じ保存本文の履歴再表示まで確認済みにしない |
| 27B旧試験（選定除外） | 10/23 Mash決定で27Bを候補から除外。`Qwen3.8-27B-Q4_K_M.gguf`の試験は履歴として保持。10/21、架空相談2題×実演あり／なし×初回／回答後＝8出力の推論試験 | 追加情報の取込みは見られたが、未確認な意味の補完、近い問いの再提示、更新記録の欠落が残る。実演ありの一貫した優位未確認。重みの追加学習0、27BのCMEE統合0、他core適性未検証、製品採用未確定。Pod停止はMash報告受領済み |
| 観測教材 | 6回の対話から[候補18件・教示5参照](observation_learning/training/2026-10-23-pilot-prep/README.md)を整形。Mash逐語10（問い9＋訂正後観測1）／華恋編集4／架空補充4を区別。第7回は利用場面後付けの不備を認め取り下げ、学習・再開先から除外。自然な完成受け取り・通した修正実演・Piece／Analysis教師と独立評価は不足 | [Free9教師・比較6入力](observation_learning/training/2026-10-24-emlis-free-pilot/README.md)でMashのA40にて初回9step完了。初回adapterは未回収だが、同設定の別runと保存adapter再load／9教師適合診断は完了し、重み入りarchive全33fileとchecksumを照合。加重NLL1.81506→1.65714、全9件低下・生成8/9変化。ただし教えた事例にも未返信・約束・訂正後の喜びの理由の補完が残り観測品質は未合格。初回重みの復元とは扱わない。[受領結果](observation_learning/trials/2026-10-24-qwen9b-free-lora/recreated-run/README.md)。JSON-onlyのない旧promptと解析失敗は試験側の不整合も区別。最新結果は[4B・9B受領比較](observation_learning/trials/2026-10-24-qwen4b-9b-comparison/README.md)。MashのA40で4B／9B各6回答、計12回答が完走し受領原本と固定sourceを照合済み。JSON全件成功・打切りなしだが意味品質は両方未合格。9Bの品質優位は見られず、比較時点では4B候補保持を華恋が推奨。その後、本報告会でMashが4Bに確定した。4Bは不明保持・補足／椅子訂正で相対的に忠実だが、開店の距離方向を反転し、Piece根拠・Analysis結果を創作する。9Bにも感情理由補完・別記録への誤edgeが残る。PyTorch peak allocatedは4B8.737／9B17.814GiB、単独速度は出力量依存。本番提供原価・680／1,480円での採算は未測定。既存9教師は全件Emlisで、開店方向と自然な受け取りを既に教える一方、Piece／Analysis完成例は0。[固定提供案の原価試算](observation_learning/model_selection/2026-10-24-production-economics/README.md)は完了。基準案95,094円/月は予算外で不採用推奨、最適化構成や本番原価の実証は未成立。10/24の4B確定は10/25に撤回済み。[CM-01/T1 actual](designs/cmee/v1/01_shared_kernel_and_runtime_contracts.md#cmee-4b-model-proposal-implemented)はMash承認後にAPI02c0b943へ実装。新private意味／自然本文／実問い／保存再開とasync注入境界はCPU検証済み。新4Bpackは実native2診断教師・旧7件未対応、学習外EFREE6 proxy、runner／診断／退避／raw consumerを実装。初版の実tokenizer最大7856 tokens、CPU指示修復版は最大7955/生成枠8126、context8192/max_new2048を維持。旧完成JSONの単純wrapは採用不可で、旧9教材は不変。実4Bの一回診断は承認後に完了。2教師/1周/2update・保存adapter非学習reload・前後16生成・24GB完走を確認し、最終重みを回収照合して試験Podを削除した。16GBは未試験。実rawのCMEE採用/本文は前後とも0/2で、NLL低下を品質成功へ換算しない。旧9Bの1／4／16周は再開せず、追加試行・商品価格／quota変更0。 10/25の最新新入力32更新では意味2/2・本文1/2へ進展。指示追加候補は意味1/2・本文0/2で退け、学習時入力へ戻した。局所診断後のLR1e-5候補は不採用だが、LRだけ5e-5へ変えた4更新で既知FIT意味/本文2/2へ到達し、実モデル2callのoffline一往復も成立。現在の詳細は冒頭とweekly§36を優先し、§33は履歴。新しい観測会をMashへ依頼せず、全文比較と記録は華恋が担う。原18候補・教示5参照・9教師・旧評価・受領重みを増量／改変しない |

詳細owner：[Emlis map](current_structure/01_emlis_ai_current_structure.md)、[CMEE map](current_structure/04_cmee_current_structure.md)、[Emlis詳細設計](designs/cmee/v1/02_emlis_v1a_detailed_design.md)、[観測教材](observation_learning/README.md)。古いmap本文の「問い未実装」は後続Q3／Q4・実sourceと矛盾する旧状態であり、現在へ戻さない。

## 5. Analysis — 蓄積を本人の情報へ返す

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

| 機能 | 現在の実装・境界 | 確認・残件 |
|---|---|---|
| 本文・visual recipe | 保存済み本人source→単独で伝わるcanonical text＋画像。現V2 source adapter／pure coreはoriginal＋normal／pre-questionのみ。refinedは別sourceのopt-in補足を使う設計だが、現コードは`source_role_or_stage_not_yet_supported`で未対応 | 旧Q&Aの存在を新商品の定義にしない。Emlis生成本文・Analysis推定の原文流用は禁止。補足をoriginalへ連結してrefined接続済みにしない |
| preview・保存 | 本文・画像設定・取消・保存・回復のsource接続あり。iOS renderer供給とsame-mount/token current fitを接続。owner／runtime／quotaを別に確認 | 実Authの通常入力→preview→明示private保存は未確認。preview＝保存record＝card＝renderer入力＝export本文を保つ。保存後の本文・format・recipe変更は新record |
| V2有効化・旧経路 | 既存APIの明示factory構成は10/23に3577d7fdでLive、private4true/public4false。default app:appはsource上legacy/OFFを維持。RN通常入力のV2 sourceあり、tutorial/Nexus旧経路は残る | 稼働設定成立と本人端末の通常保存は別。M5の全公開経路廃止は未完 |
| 本人履歴・詳細・公開範囲 | owner一覧・詳細・公開切替・削除、通常導線・保存後再取得を接続。privateはownerのみ、publicも既存access policy内 | 同一ownerの実Auth保存→履歴／詳細往復は未完。アプリ内公開と外部画像共有を分ける |
| export | 本人詳細→fresh GET→表示recordのID・row version・3hash・renderer一致→全canvas→明示Photos／Shareをsource接続 | 実OS写真保存・Share、Android新版export、backend receipt、本人端末商品受入れは未完。外部へ出た画像コピーは内部非公開／削除で回収できない |
| 新renderer | iOS `piece.rn_bitmap_renderer.ios.v1`。検査した同一bitmapを表示/書出し。preview fit・構築の元8秒、完成saved画像は8秒後も保持 | API供給はTTL600秒/同rendererでLive。本人通常描画・保存・再読と商品採用は未確認。最新送信6501は新版を含まず、87151固定候補のTestFlight送信は未実行。Android新版成立へ拡張しない |
| 最新限定検証 | 新export正常8PNG＋native拒否6。JS979・新native44成功。旧195は176PASS／19FAILを保持 | CI39780623108 attempt1 completed／failure、head`d2e1244…`、10/22 JST21:42:54〜22:07:18。CI全体合格ではない。限定TECHNICAL_CREDITの記録あり、product_credit=0 |
| live・次の未完 | 10/23 Live3577d7fd/dep-dbd8hjoae00c73firbt0・承認command/autoOffは監視readで不変。privacy2pathはPR3@3084c99eへ同一blobで同期済み、唯一CI39864098163は1805 PASS/FAIL0/SKIP0 | 現在ownerは入口§119/map65.62/weekly5.6.42/manifest v159。本人保存にはRN新版が必要。候補branchを87151へ固定、既存署名build/TestFlight送信1回の個別判断前。本人保存/再読・実OS/端末/商品受入れ未完 |

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
| 生成基盤・開発運用 | APIのCMEE EngineにEmlis thread／Piece／Analysis consumer分岐あり。既存共有text core・生成guard・contract・tests、RN build／CIは支援基盤 | 固定snapshot／旧禁止条項はその時点の範囲。学習済AIはprivate注入境界・保存rawのconsumerを実装済み。受け取りloss4更新/LR比較後の既知FITは意味/本文2/2。実モデル2callのoffline一往復（actual prior、問い1、訂正3更新、END）まで成立。Engineのcold file再開2/2、承認済みoffline180秒/通常30秒を実装。実4Bのfresh ID02で初回/訂正後service・隔離SQL保存、意味保存後中断/明示再開、保存済み非生成再読まで成立。本人端末/一般言語品質は未成立。稼働設定・秘密値・DB実値・端末は原本sourceから推測しない |
| System Context | 実装正本はPR37、商品原本はPR30/API PR3の別checkout。旧CLI/追跡読順を正規routeへ同期し、全機能原本・最新weekly・観測教材・三core現物を選択対象へ追加、seed期待の不一致を修復 | 最新cacheは未生成。固定環境doctor34項目/関連CIは成功したが、API Python索引1874対象が1200秒/1800秒ともtimeout。2回目は処理中のPR30費用案更新により終了時head確認も不一致。失敗・原本との差を[PR37](https://github.com/MassyuRed/Cocolon/pull/37)へ記録し、同じ時間延長だけの再試行を停止。tracked currentは8月snapshotで使用不可。fresh原本の直接読取を使い、最新索引完成とは扱わない |

共通状態として、未入力／不足、保存中／保存失敗、本文生成失敗、回答待ち／skip／終了／訂正／撤回、履歴なし／期限切れ／source失効、未認証／owner不一致／プラン不足、非公開／公開／削除、未読／既読、課金保留／有効／失効／復元を区別する。具体的挙動は該当contract・実ownerで確認し、この列挙を全状態遷移の実機合格証にしない。

## 8. プランと、次作業を選ぶときの現在地

| プラン | 仕様・表示上の体験 | 成立状況の限界 |
|---|---|---|
| Free | 当回Emlisと任意1問、軽いmap概要、Piece月5、入力等の履歴は当月＋前月。わたしマップは最新概要のみで履歴不可 | code・表示と、自然な本人理解の品質は別 |
| Plus | 適格本人履歴を用いたEmlis、こころ天気の文章／理由、標準map・直近1年履歴、Piece月30 | 履歴参照と有料差の体感は同義ではない |
| Premium | 修正できるframeと本人続行の最大3問、長期weather・深いmap、無制限履歴／Piece、設計上のIF・Saved | IF／Saved未実装。同一期間V2 light／standard／deepの本文・graph差は未成立／未確認で、表示上の権利を能力の完成へ換算しない |

10/23のプラン設定read-only照会ではPlus表示は月300円、Premium月980円（RN/API fallbackも同額）。実ストア価格・税込区分は未確認。Pieceの5/30/無制限は保存数で、新AI生成数の上限ではない。Emlisの1/3問もthread単位であり、月間生成費を制限しない。

**10/23 Mash決定：Plus980円／Premium1,980円が価格の上限（これでも高い）、27Bは候補外。10/24は680円／1,480円を価格候補として検討する。980／1,980は9Bの損益分岐価格ではなく、独自LoRA版の本番原価は未測定。** 旧1,980/3,980円の推奨と27B再試験案を撤回。[小型AI再選定・全core原価](observation_learning/model_selection/2026-10-22-three-core/2026-10-23-small-model-reselection.md)では、Mashの残高利用希望により、Qwen3.5-9BのM1をMashがRunpod A40で実行し、4件の受領原本と全本文を照合済み。画面上のGPU単価は$0.59/h、起動前残高$5.15。受領原本のvLLM0.32.0／BF16／非thinking／context8192／温度0で、要求90.607秒・4805token。インストール・読込・待機を含むGPU総時間・総消費は未確認。Stop完了はMash報告を受領済みで、管理画面の独立確認はしていない。DeepInfra既製APIは比較資料へ残し、Qwen3.5-4Bは当時の別候補から、10/24のMash決定で一度確定した後、10/25に撤回された。10/23の旧比較では980/1,980円を基準とし、Free30/Plus100/Premium150セッション等の利用量でも、以前のDeepInfra既製APIを仮定した月原価は約5.57/37.07/147.28円で、Runpod自己hostの原価ではない。無料者・固定基盤・税相当留保・ストア費を含めて計算した。これらは利用量感度で、商品quota変更・採用・品質合格ではない。独自追加学習版の配備に公開API単価を流用せず、育成費・学習後のhost費用は別確認。旧費用資料は履歴として参照する。

次週の旧推奨順位は第8回§4の履歴。4B/Runpod育成・Windows/Mac未選定を保持。Mashが§37の日常食事family追加・18更新・保存再読の限定検証を明示承認。APIbd356566の3製品owner＋新test/fixtureを実装し、限定4file174成功（新60＋既存114）。旧chairの実行captureと意味/snapshot/本文/問い/3更新/model入力は全文一致。dailyだけ5claim/4関係/内部版2/2・初回/問いなしへ対応し、合成3service identity/SQL30RPCで保存非生成再読を確認。旧chair6行をbytes不変で保持した9行/2familyと18update/FIT9の新有限planを凍結。本物tokenizer事前確認とGPU学習・実model保存再読は未実行。GPUのA4500稼働/76309b86を再確認しSTOP0。新観測会不要、通常app/本番配置/DB変更0、正式0/3・54.50％据置。

| 作業領域 | 次に解消すべき具体的未完了 |
|---|---|
| 学習済みAI・現在の作業 | Mashが§37の日常食事family追加・18更新・保存再読の限定検証を明示承認。APIbd356566の3製品owner＋新test/fixtureを実装し、限定4file174成功（新60＋既存114）。旧chairの実行captureと意味/snapshot/本文/問い/3更新/model入力は全文一致。dailyだけ5claim/4関係/内部版2/2・初回/問いなしへ対応し、合成3service identity/SQL30RPCで保存非生成再読を確認。旧chair6行をbytes不変で保持した9行/2familyと18update/FIT9の新有限planを凍結。本物tokenizer事前確認とGPU学習・実model保存再読は未実行。GPUのA4500稼働/76309b86を再確認しSTOP0。新観測会不要、通常app/本番配置/DB変更0、正式0/3・54.50％据置。 詳細は最新weekly§38。 |
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
| 最新判断・配置記録 | [第8回・10/24〜10/31](weekly_reviews/Cocolon_Weekly_Review_20261024.md)。方針・承認・配置の原記録は`weekly_reviews/Cocolon_Weekly_Review_20261017.md`（10/20観測学習、最新AL等）とAPI `ai/docs/EMLIS_DEPLOYMENT_AND_OPERATION_CHECKS.md`へ戻る。会議記録は仕様・実装事実の代用ではない |
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
