# 第8回 Cocolon週末報告会 — 2026-10-24（会議終了版）

記録日：2026年10月24日（日本時間）  
今週の実績対象：10/17報告会で確認した版の後〜10/24の今回確認時点  
次週の対象：**2026年10月24日〜10月31日**  
記録担当：華恋  
会議状態：**終了。Mashの明示指示により、華恋の困りごと・進め方への意見と総括を§10へ全文記録し、本報告会を終了。終了記録と再開先は§11。**

**今週は、Emlisの限定修復、Pieceの新描画・保存経路とprivate API配置、三中核のCMEE内部準備、学習済みAIの比較試験が前進しました。一方、先週目標にした本人端末での保存・再表示・画像共有や、三中核の商品品質は未達です。華恋の週次評価は「技術成果は部分達成、利用体験の完成目標は未達」です。**

前回の[第7回議事録](Cocolon_Weekly_Review_20261017.md)は、実績・承認・失敗・方針変更の原記録として保持します。最新の週次報告と10/24〜10/31の管理案は本議事録へ集約し、過去の未完了を削除したり、新しい期限だけを付け直して達成扱いにしたりしません。

**作業再開の入口：** [優先順位と日程（§4）](#next-week-priorities)／[具体的な作業一覧（§8）](#detailed-work-breakdown)／[全体評価54.50％と公開見通し（§9）](#overall-status-and-release-outlook)。§8には既存実装と未実装案を分け、最初に編集するowner、失敗・回復の確認、本人操作へ渡す条件を残した。

**最終状態の読み方：** §0〜9の「進行中／継続中／会議終了未記録」等は各追記時点の経過です。現在の会議状態は終了で、最終の区分と再開先は[§11](#meeting-closed-and-next-session)。華恋の最後の意見は[§10](#karen-closing-opinion)に全文を残します。

## 0. 今回の依頼、確認範囲、記録の区分

Mashの依頼は「今週やった作業と成果」の報告と、10/24〜10/31の最新議事録の作成です。添付の前回作業内容は第7回末尾ALへの引継ぎでした。今回、報告会を開始しましたが、そのことを実装・配備・課金・招待・公開の追加承認へ変換しません。

確認基準は次です。

| 対象 | 今回読取確認した先端・位置 |
|---|---|
| Cocolon開発正本 | Draft PR30、`ee2ff5f0be1fff4d61b9551eaaff937e1311de4b`、`agent/three-core-cmee-current-structure-20260815` |
| mashos-api開発正本 | Draft PR3、`666b28517ef04aba170ebffe3c86980fea4c11bd`、`agent/cmee-v1a-i1sx-source-explicit-20260815` |
| System Context実装 | PR37、`99f925ecebaaed83536d4ee56bcc21968b582c6f`。商品原本と別の実装先 |
| Pieceの配布候補 | `agent/piece-testflight-private-20261023@87151d3983818f18e556651d333d95be7bb487d7`。署名配布は未実行 |

前提資料、作業姿勢とルール、全機能・全状態、全体設計と全ファイル地図、最新weekly、対象の詳細owner、実ソース・受領結果・既存CIを照合しました。今回取得した現行treeはCocolon 1,830 blobs、API 2,457 blobs、計4,287 filesで、tree一覧の打切りはありません。これは**現行ファイル一覧の確認**であり、全4,287ファイルの全文意味監査、全履歴監査、全機能動作保証ではありません。詳細は対象領域の原本・実ファイルに絞って確認しました。

成果は「決定・設計」「実装」「限定検証」「配置の最終確認記録」「本人端末」「商品受入れ」に分けます。今回の報告準備でGPU・新規CI・実DB・本番・本人端末を操作したとは扱いません。Render／DBの状態は今週の保存済み確認記録を継承し、今回の再照会とは区別します。

## 1. 今週やった作業と成果

### 1.1 EmlisAI — 意味保持・本文停止・受け取りを限定修復

10/17報告後のu318〜355では、次の五群が前進しました。番号には診断・提案も含むため、番号数を修復件数として数えません。

| 今週の対象 | 実際に前進したこと | 残ったこと |
|---|---|---|
| sourceの作用域・推量・時点、本文停止 | 誤認と選択不整合を限定修復。u318〜320時点の元10例は初回本文8件から10件へ | その10例の本文成立を一般入力の理解や商品合格にはしない |
| 訂正・撤回後の未変更内容 | 同じ欄の別経験、理由、未成立事項を落とす対象内欠陥を修復 | 任意の複合入力・多段回答全体の成立は未達 |
| 本人・対象・程度・時点を持つ不明と行動 | 「本人にも分からない」を願い・原因へ変えず、独立した行動や現在／過去の不明を限定保持 | 一般日本語の不明・行動理解全体は未完成 |
| 安堵・寂しさ・別経験の受け取り | 限定した反応と聴く姿勢を実装。独立不明・別経験の併存と、Observationに根拠を残す短文化を修復 | 定型性・深い受容・自然な集合品質は未達 |
| 本人説明・現在の否定訂正・同時性 | u353で初回の元経験／本人説明／独立不明を一体保持。u354で現在の否定訂正後の本文停止、u355で未明示の「同時」の追加を修復 | 未配置、本人実機、範囲外の訂正、有料差が残る |

保存・中断再開・旧checkpoint・同一保存DTOの画面再表示までの隔離検証の記録があります。代表してu353は対象140件、u354は188件、u355は321件の技術検証記録がありますが、対象の重複があるため週全体の成功数として合算しません。HTTP／認証／nativeのstubや限定検証を、本人端末の成功へ換算しません。各runに残った既知失敗も、後続対象の成功で消しません。

**成果は、特定入力群で意味の欠落・停止・不適切な時点追加を減らしたことです。一般入力への自然な観測、問いの適切さ、有料の深さ、本人の通常保存再読は未完成です。** u353〜355は開発版で、現在稼働するEmlis内容へ配置済みではありません。

根拠：[前回のu318〜355記録](Cocolon_Weekly_Review_20261017.md)、[u353監査](../audits/emlis_ai/Cocolon_EmlisAI_u353_InitialPersonalMeaning_20261018.md)、[u354監査](../audits/emlis_ai/Cocolon_EmlisAI_u354_NegativeRevisionSurface_20261019.md)、[u355監査](../audits/emlis_ai/Cocolon_EmlisAI_u355_MixedReceivedTimeNeutral_20261019.md)。

### 1.2 Piece — 新iOS描画、通常保存・書出し接続、private API配置

- **10/19：既存SQL2本を適用した記録。** quota読取とpreviewの画像設定変更について、定義・権限・migration履歴を照合しました。適用済みのものを未適用へ戻して再実行しません。
- **10/19〜22：新iOS bitmap方式へ進展。** 検査した同じbitmapを表示・書出しに使う方式へ承認の範囲で変更し、新renderer `piece.rn_bitmap_renderer.ios.v1`をpreviewと保存後表示へ接続。通常入力の保存判定、保存controller、本人履歴・詳細、保存済み画像の書出しをsource上でつなぎました。
- **限定描画の420文字を元8秒以内で確認。** 10/22の実RN限定検証は正常8PNG＋拒否6条件が成立。420文字essayは6,721.644ms、別420条件は3,176.773msでした。これは合成保存DTOによる限定検証で、全入力・全端末の保証ではありません。
- **10/23：private API構成を配置した記録。** 既存10/10版を土台にPieceだけのoverlay `3577d7fdeb19158ef5e675f51960652a52c24487`を配置。preview期限600秒、private preview／save／owner read／deleteがON、public write／read／visibility／exportはOFFです。
- **privacy修復2fileを開発正本へ同期。** API `3084c99e5a08d6e475d8a177e62ebf1548e8a0f9`の同一blob同期と限定CIの1,805 PASS／失敗・skip0を記録しました。

検査の成功範囲と全体結果は分けます。[RN CI39780623108](https://github.com/MassyuRed/Cocolon/actions/runs/39780623108)は今回再取得でも**failure**でした。JS979・新native44成功はありますが、旧native195件のうち19失敗を保持し、CI全体成功としません。[API CI39864098163](https://github.com/MassyuRed/mashos-api/actions/runs/39864098163)のsuccessも、その限定範囲の結果です。

**最初の未完了は、新版iOSの配布と本人認証での「通常preview→明示private保存→履歴・詳細」の一往復です。** 最新送信成功6501には必要な新版保存接続が含まれません。87151固定候補の署名Archive／TestFlight送信はまだ実行していません。画像保存・共有は、現runtimeのexport OFFも別の依存であり、新版配布だけで直ちに成立するとはしません。Android新版、実Photos／Share、backend receipt、Nexus／tutorialを含む旧経路切替も残ります。

根拠：[Piece入口§73.6・§115〜119](../../Cocolon_Piece/00_read_first.md)、[Piece map§65.62](../current_structure/02_piece_current_structure.md)、[manifest](../../Cocolon_Piece/manifest.json)。

### 1.3 CMEE — モデル選定前の内部準備P1〜P5

Mashの「モデルを繋ぐ前にCMEE内部だけで進める」指示に基づく成果です。**実モデル接続や通常アプリの有効化とは分けます。**

| 段階 | 今週できたこと | 検証・限界 |
|---|---|---|
| P1 | 原入力・独立補足・履歴・凍結期間を分けるoffline準備境界 | 4fixture・20receiptを確認。意味採用・実モデル接続0 |
| P2 | 候補情報と既存意味型・検査・ownerの具体対応を整理 | 設計・inspection。runtimeの追加実装とは数えない |
| P3と限定拡張 | Emlisの意味snapshot→既存作者・問い・回答更新→内部保存再開。本人明示の不明の対象と二行動も限定保持 | 最終対象146成功。旧広範囲Q1／Q3の未分類失敗は未解消 |
| P4 | Pieceの原7field、6claim／5文／2関係と選択を保持し、既存作者・private保存再読へ接続 | 対象339成功。出力は原文段落保持、通常B8・画像・実DB・モデルは未接続 |
| P5 | Analysisの元3記録→意味snapshot→同一graphの文章・図→意味／graph／完成の3段階private保存再読 | 対象905成功。固定3構文family・Plus・補足0・比較なし。通常Analysis／DB／RN／実モデルは未接続 |

P4／P5の成功は、意味を持った同じ結果を内部で保存して読み直せる到達です。一般日本語の整形品質、完成した観測ルート、本人通常利用の合格ではありません。検証集合は重複するため合算しません。**P6の実モデル統合offline評価は未完了です。**

根拠：[内部準備の実結果](../observation_learning/trials/2026-10-23-current-four/README.md)、[共有設計](../designs/cmee/v1/01_shared_kernel_and_runtime_contracts.md)、[P4](../designs/cmee/v1/03_piece_v1c_detailed_design.md#cmee-p4-implemented)、[P5](../designs/cmee/v1/04_analysis_v1d_v1e_detailed_design.md#cmee-p5-implemented)、[API P5 commit](https://github.com/MassyuRed/mashos-api/commit/666b28517ef04aba170ebffe3c86980fea4c11bd)。

### 1.4 観測技術の継承、教材、小規模学習とモデル比較

**10/20の方針決定は、Mashの口調や言葉の模倣ではなく、観測・問い・回答後の理解更新という技術を、学習済み言語能力を土台に育てることです。** CMEEと既存資産を生かす決定を継承します。

| 今週の作業 | 得られた成果 | まだ成立していないこと |
|---|---|---|
| 観測教材の整理 | 6回の対話から候補18件・教示5参照を整理。Mash逐語／華恋編集／架空補充を区別。後付けの第7回は取り下げ | 自然な完成受け取り、通した修正実演、Piece／Analysis教師と独立評価が不足 |
| 27B推論試験 | 架空相談2題の初回・回答後、実演あり／なしの8出力を取得・診断 | 追加学習ではない。10/23 Mash決定で候補外。27B再試験を次作業へ戻さない |
| Runpod 9B M1 | 三中核の4場面を実取得し、全本文を診断 | 根拠外補完・欠落が残り、商品採用不可。CMEE統合ではない |
| 9Bの小規模LoRA | Emlis9教師・9stepの初回実行、その後の同条件別run、保存adapterの再load診断を完了。重み入り33fileのarchiveを照合・退避 | 初回adapterは未回収。別runを初回重みの復元としない。学習の成立と観測品質は別 |
| 4B／9B比較 | adapterを載せないbase同士を同じA40で比較し、各6回答、計12回答を受領。全JSON解析成功・打切りなし。全件の意味品質を確認 | **両modelとも品質未合格。** 9Bの一貫した優位なし。4B候補保持は華恋の推奨で採用決定ではない |

別runの教師適合診断では、加重NLLが1.81506→1.65714となり全9件で低下、生成は8/9件で変化しました。これは教師データへの適合が変わった証拠であり、観測精度や商品完成率の向上率ではありません。教えた事例にも理由・約束等の補完が残っています。

4BのPyTorch peak allocatedは8.737GiB、9Bは17.814GiBでした。モデル以外のメモリ、長い履歴、LoRA、同時実行を含む本番24GB動作の証明ではありません。**1／4／16周の追加学習案は保留中**で、自動再開しません。

重み退避前に保存領域の永続性を確認せずStopを案内し、初回adapterを回収できなかった点は、華恋の手順不足として残します。別runでは重みの受領・照合まで行いましたが、初回重みの喪失可能性や追加の試験負担を無かったことにしません。

根拠：[観測学習入口](../observation_learning/README.md)、[9教師教材](../observation_learning/training/2026-10-24-emlis-free-pilot/README.md)、[別runと診断](../observation_learning/trials/2026-10-24-qwen9b-free-lora/recreated-run/README.md)、[4B／9B受領比較](../observation_learning/trials/2026-10-24-qwen4b-9b-comparison/README.md)。

### 1.5 費用 — 公開案の不成立と、売上ゼロからの未解決を具体化

10/23 Mashが示した価格上限はPlus980円／Premium1,980円で、10/24は680円／1,480円を目標候補として検討しています。**正式価格・商品quotaを変更した事実はありません。**

| 検討対象 | 今週確認できたこと | 判断の限界 |
|---|---|---|
| 固定した公開運用案 | 有料50／無料950、月78,980生成、Runpod Flex24GB、参照性能等の仮定で運用費95,094円／手取り計画27,262円、差額約−67,833円 | **その計算基準案は不成立。** 本番実測ではなく、680／1,480円が全方式で不可能という結論ではない |
| 4Bと9Bの費用差 | 同GPU・同課金時間なら料金は同じ | 小型化だけで安くなるとしない。小GPU・処理時間・台数の削減は実証待ち |
| Runpodの使い方 | 実試験はA40・48GBのPods。費用案は別24GB GPUのServerless | Runpodから別サービスへ移る案ではない。GPUと借り方の切替・性能実証は未実施 |
| 売上ゼロの試用案 | Plus相当5人14日を華恋が提案。開始後GPU1,333〜2,356円、仮の共通月予算11,000円込み12,333〜13,356円 | 品質改善・CMEE接続・配布までの準備費を含まず、開始総額・開始日未確定。人数も未承認 |
| 総枠2万円の配分案 | 共通11,000／内部GPU1,500／試用GPU3,000／予備4,500を検討 | **未承認。** 完成保証・請求上限・支出許可ではない。翌請求期の負担も数える |

Supabase所属orgがFreeというread-only確認を継承します。共通11,000円は現契約費・現在の純増請求ではありません。GPUの生成秒数や試験内の時間を、install・load・待機・保存を含むPod総時間／実請求へ置き換えません。

**成果は「このままでは成立しない公開案」と「まだ見積れていない初期負担」を明示したことです。事業採算、試用の開始条件、初期資金の問題が解決したとは報告しません。** 有料会員を先に得られる前提では初期負担への回答にならない、というMashの指摘を保持します。

根拠：[提供原価の全条件・計算](../observation_learning/model_selection/2026-10-24-production-economics/README.md)、[売上ゼロの試用検討](../observation_learning/model_selection/2026-10-24-production-economics/zero_revenue_pilot.md)、[第7回AH〜AL](Cocolon_Weekly_Review_20261017.md#20261024-next-session-review-handoff)。

### 1.6 System Contextと共通機能

System Contextでは、全機能原本・最新weekly・観測教材・三中核実物への参照、正規PR37実装と商品原本の分離、旧CLI／読順、seed期待の不整合を更新しました。原本へ到達する導線の成果です。

一方、Python索引1,874対象の実生成は1,200秒／1,800秒ともtimeout、2回目は並行更新によるhead不一致もあり、**最新cacheは未生成**です。[CI39868533336](https://github.com/MassyuRed/Cocolon/actions/runs/39868533336)／[CI39871756999](https://github.com/MassyuRed/Cocolon/actions/runs/39871756999)のfailureを今回再取得しました。doctor34項目の成功と索引完成は分け、fresh原本の直接読取を継続します。

共通機能では、現行sourceに次の既知欠陥が残っています。

- 購入finishの両方式が失敗しても、成功状態へ進む経路。
- account切替後、進行中だった旧subscription応答の適用を遮断する不足。
- 公開profileのvisibility取得HTTP失敗時に、公開相当の初期値を保持する経路。

最後の項目はsource上の失敗境界であり、実際の漏出事件を今回観測したという意味ではありません。認証復帰・共有URL・通知配送・退会・両OS配布等も、通常実機の全経路成功を新たに認定していません。

根拠：[System Context入口](../system_context/00_read_first.md)、[PR37](https://github.com/MassyuRed/Cocolon/pull/37)、[購入source](https://github.com/MassyuRed/Cocolon/blob/ee2ff5f0be1fff4d61b9551eaaff937e1311de4b/lib/iap/iapService.js#L432)、[subscription source](https://github.com/MassyuRed/Cocolon/blob/ee2ff5f0be1fff4d61b9551eaaff937e1311de4b/SubscriptionContext.js#L165)、[visibility source](https://github.com/MassyuRed/mashos-api/blob/666b28517ef04aba170ebffe3c86980fea4c11bd/ai/services/ai_inference/api_public_profile.py#L81)。

## 2. 先週の目標に対する達否

| 前週目標 | 今回の判定 | 理由 |
|---|---|---|
| Emlisの意味・停止・回答後保持を修復 | **限定範囲は部分達成** | 対象内の本文・保存改善あり。深さ・一般入力・有料差・本人実機は未達 |
| 10/20に従来方法の継続可否を判断 | **方針判断は成立** | 学習済みAI＋観測技術育成へ転換。モデル採用・費用・接続の成立とは別 |
| Piece P-W1：10/22まで通常保存→本人履歴・詳細 | **全体未達** | source・DB・API配置は進展。必要RN版の配布・本人Auth一往復が残る |
| Piece P-W2：10/23まで両OS画像保存・共有 | **全体未達** | iOS限定PNGは前進。runtime export OFF、実Photos／Share・Androidが残る |
| Piece P-W3：10/24の本文・画像・実機結果集約 | **全体未達** | 限定画像の記録あり。一般本文品質・通常実機・商品受入れなし |
| Analysis：10/18〜22の通常生成・文章／図・保存再表示・比較 | **達成証拠なし** | P5は別の内部成果。通常内容修正版の配置差、本文生成・保存再読・比較の本人確認が残る。6501時点の不足案内表示は本人確認済み（§8.5） |
| 購入C01／C02：10/18〜21の限定修復 | **未達** | 現行sourceでも既知欠陥が継続。旧10/04・10/13の未達も保持 |
| 10/23〜24の同一候補の全体結合 | **達成証拠なし** | 開発・配置・端末版が揃わず、コード不足も残る |

通常Analysisではu129〜250の内容修正が資料上未配置、本人生成・再表示・比較、同threadの複数ANSWER採用が未完です。**もしもルート／IFとSavedRouteIntentは設計あり・runtime未実装**で、省略・廃止の決定にはしていません。

本会議の初回報告では全体管理評価53.25％を継承しました。その後のMashの現在地・公開見通しの％表示依頼により、同じ配点・段階で再評価した最新値は[§9の54.50％](#overall-status-and-release-outlook)です。正式商品受入れ0/3、PRODUCT_NOT_CLEARは維持し、技術検査数・文書量・モデル比較数を完成率へ換算しません。

## 3. 華恋の評価と、進め方の修正案

今週の価値は、残せる技術成果が増えたことと、従来の有限な修復だけでは届かなかった観測品質に対し、実際に学習済みモデルを試して制約を把握できたことです。Pieceの描画時間とprivate API配置も、先週の未完了から具体的に前進しています。

ただし、**利用者へ届ける一往復を閉じられなかった週**でもあります。AIの自然さ、意味の正しさ、提供原価、初期資金が同時に未解決で、これを「モデルを選べば接続して終わる」と説明できません。学習が動いたことやJSONが通ったことを、観測技術の習得へ飛躍させません。

4B確定後の私の推奨は、4B学習とCMEEへの実接続を主枠にし、Pieceの通常保存を独立して並行することです。必要な初回実行範囲・費用はその単位内で具体化し、提供方式全体の検討を先行作業へ戻しません。購入・account・公開範囲の限定必須枠と、通常Analysis一往復も残します。具体的な順位と判断点は§4へ置き換えました。これは華恋の推奨で、Mashの計画全体への合意は先取りしません。

<a id="next-week-priorities"></a>
## 4. 次週10/24〜10/31の優先順位

Mashの「次週の優先順位を検討し、最新議事録に記載して」という依頼に基づく、華恋の推奨順位です。**最優先は、確定した4Bを学習させ、その実出力をCMEEへ通して、意味・本文・保存再読まで確認すること。Pieceの本人保存は独立した並行主枠で進めます。** 共通欠陥と通常Analysisも担当枠を残し、AIの全面完成待ちにはしません。

モデルはQwen3.5-4Bに確定。GPUは16GBを第一候補とし、必要なら許容済みの24GBへ進む具体案を出します。学習時と提供時で必要メモリは別に確認し、16GBに固執して何度も修復・比較を繰り返しません。48GBへの自動拡大、9B／2Bの再選定は次週の標準経路にしません。

以下は作業順と終了条件の管理案です。順位の検討・記録依頼を、次週計画全体の合意、具体的な有料実行・署名配布・本番配置の包括許可へ読み替えません。既承認範囲内の作業を再承認待ちへ戻さず、新しい効果が必要な部分だけ、対象・時間・費用等を具体化して扱います。

### 4.1 優先順位と、先に閉じる完成単位

| 優先・作業枠 | 対象と優先する理由 | 最初に進めること | 10/31に示す結果・終了条件 |
|---|---|---|---|
| **1：最優先の主枠** | **4B学習＋CMEE実モデル接続。** モデルは決まったため、育成と利用経路の実結果へ時間を使う | まず既存教師の完成応答JSONとP1の厳密なcandidate/evidence受口を実例で揃える（CM-01/T1）。既存教材とP1〜P5を再利用し、4B用学習・重み保存/再loadと、モデル出力を既存意味経路へ渡す処理を小さく結ぶ。Emlisを最初の完成単位にする | 4B学習結果の重み回収・再load、学習前後の実本文、学習に使っていない入力への結果。Emlisの原入力→観測/受け取り→必要な問い→本人回答による更新→同一保存再読。続いてPiece/Analysis各限定入力の成立・不足を示す。全商品品質の完成保証ではない |
| **2：AIとは独立した並行主枠** | **Pieceの通常保存→履歴再読。** 保存部品・API配置まであるため、本人が使える一往復を先に閉じる | 87151固定候補の既存署名build/TestFlight送信の具体案・必要判断、配布、導入版での本人Authによるpreview→明示private保存→同一record履歴/詳細 | 通常保存と同一本文/画像設定の再読を実確認。成立後に同じ保存結果の画像保存/共有へ進む。配布未実行・コード不足・端末時間待ちを分離し、6501へ新版の成功を帰属させない |
| **3：外さない限定必須枠** | **購入finish・account切替・visibility失敗境界。** 課金・本人状態・公開の誤りを残したまま実利用へ進めないため | 既存3欠陥を原因別に修復し、finish両方式失敗、旧account応答、visibility HTTP失敗を確認 | 失敗を成功扱いにせず購入回復を保持、切替後の旧応答遮断、visibility取得失敗時に公開扱いを進めないこと。既存ownerの限定修復とし、offline学習の新しい開始条件にはしない |
| **4：次順位の結合枠** | **通常Analysisの文章・図→保存再表示→比較。** P5内部成功を本人の通常利用へ置き換えないため | 現行内容修正版・API配置版・RN版の差を固定し、一往復に必要な不足から閉じる。AI共有ownerの編集と競合する場合は順序を調整 | 同じ根拠・期間・保存identityで文章/図を再読し、比較を確認。未実装・未配置・本人未確認を別記。複数ANSWER、IF/Saved、有料差の不足と公開への影響も残す |

**順序は「AIを全部終えてから他へ」ではありません。** 主担当は各作業の編集対象と途中保存を管理し、独立するPiece作業、GPU実行中のCPU側接続・必要回帰、準備済みの本人確認を並行します。同じ意味ownerの同時編集や、未確保のMash参加時間を前提にしません。技術上の問題が新たに判明した場合も、優先順位を変える対象・理由・戻る位置を示します。

### 4.2 4B学習とCMEE接続の具体的な進め方

**実作業の詳細は[§8](#detailed-work-breakdown)に集約する。** 初手は[CM-01](#task-cm-01)とT1の共通作業である。教師の完成応答とCMEE候補のshape差、旧runnerの9B固定・40/32GiB gateを直さずにGPU学習へ進めない。これは4Bを再選定する調査ではなく、決めた4Bを実際に育てて使うための差分である。

1. **4Bで使う最小の学習・接続単位を用意する。** Emlis初回と訂正後の実例で、本人source→4Bへ求める意味/本文→rawの要求shape→採用先→最終本文を一表へ揃える。そのうえで既存9教師の原入力・正解・指示・JSON形式を照合し、4B用runnerの学習対象、結果保存、同一入力の前後比較を揃える。既存9教師は全件Emlis用である。既存9B adapterを4Bへ載せたり、9B用1／4／16周案を自動流用したりしない。9Bの実行手順から再利用できる部分と変更する部分を明記する。
2. **4Bを限定学習し、保存・再loadと実本文を同じ作業で確認する。** 16GBで必要条件が成立するかを確認し、不足するなら原因を示して24GBの具体構成へ進む。教材への適合と、学習に使っていない入力への意味保持・自然な受け取りを分ける。既存評価と教師が重なる箇所は独立評価と呼ばない。保存領域を先に確認し、重み・設定・結果を回収して照合してから停止する。
3. **実モデルの出力を、P1〜P5の既存責任へ渡す。** 新たな手書き候補・stubの成功で代用せず、モデル呼出し→未採用候補→意味snapshot→既存作者→保存・再読を通す。CPU側の接続実装は学習の全面完成を待たず並行し、実結合では使用した4B/adapter版を固定する。モデルの候補を華恋が手修正して接続成功と数えない。
4. **Emlis一往復を先に閉じ、三中核へ広げる。** 既存の三中核4場面（Emlis初回・回答後、Piece、Analysis）の材料を再利用し、最初はEmlisの問い/回答更新と同一保存再読まで確認する。ただし固定E02-0は問いなしEND、E02-Bは実pendingなしのため、回答更新は実際のpendingが成立する既存入力で確認する。問いなしENDには架空のpendingや回答を作らない。P4/P5を作り直さず、各coreへ同じ4Bから得た実候補を渡せる範囲と不足を示す。Piece/Analysis教師の不足は既存source・仕様から必要な少数の編集案として扱い、Emlis9教師だけで学習済みとしない。新しい観測会や大規模教材作成をMashへ先行依頼しない。

必要な初回実行時間・支出範囲は、この4B単位を動かすために具体化します。提供方式全般の比較、全人口の採算再計算、学習量の多条件探索をその前段へ追加しません。費用が未確定な部分を隠して有料実行することもしません。価格・quota・試用人数・2万円総枠は従来どおり未確定/未承認です。

本文の意味反転、根拠外補完、訂正無視が残る場合は、その原因へ戻ります。JSON成功・教師loss低下・周回増加だけで育成成功にせず、同じ不足が改善しないまま学習を際限なく反復しません。候補モデルを増やす判断へも自動移行しません。

### 4.3 Pieceと共通残件を進める依存

Pieceは、まず本人が保存して履歴で開き直せる単位です。P-W1が成立したら、現runtimeのexport OFFについて具体範囲を判断します。現factoryにはexport_requested/export_readyの引数がなく、設定をtrueへ足すだけでは接続できないため、[P-05](#task-p-05)の最小source差分を準備したうえで通常詳細→同じ画像→Photos/Shareを確認します。3形式、取消・権限拒否・失敗、Android新版、backend receipt、Nexus/tutorial等のM5を残件として保持します。iOSの限定PNGを両OS完成へ換算しません。

共通3欠陥は、課金・account切替・公開利用の結合確認前に閉じる必須枠です。4Bのoffline学習を止める前提にはしませんが、接続途中で本人境界へ直接影響すると判明した箇所は、その接続を進める前に優先修復します。Analysisは最新内容の配置差と本人一往復を追い、P5のprivate検証へ置き換えません。

各作業の実装・準備・検証・GitHub反映は華恋が担当します。Mashの判断・端末操作が必要な地点では、対象版・手順・期待する結果・既知の制限を華恋が先に整えます。華恋の未準備とMashの操作時間待ちを区別します。

### 4.4 日ごとの判断点

日付は成果または未成立の理由を判断する管理点で、未計測工数による完成保証ではありません。

| 日本時間 | 主な判断点 | 未達時に変えること |
|---|---|---|
| **10/24〜25** | 4Bの最初の学習・保存・接続単位と必要実行範囲を整え、既承認内の作業へ入る。Piece配布候補と共通3欠陥の担当対象も固定 | 調査を広げず、その単位を止める具体的不足を先に解消。モデル選びへ戻らない |
| **10/26〜27** | 4Bの最初の学習結果/重み再loadとCMEE実出力、Piece配布/通常保存、共通3欠陥の実装状態を確認 | 16GB不成立なら24GB案へ。モデル・教材・接続のどこで失敗したかを分け、次の一手を修正 |
| **10/28〜29** | Emlisの回答更新と同一保存再読、通常Analysis一往復、Pieceの保存後再読/共有への接続状況を確認 | 内容未成立、未接続、配置不足、本人確認待ちを分けて担当順を調整。同じ不足へ日付だけを付け直さない |
| **10/30** | 三中核の実本文・保存結果と、本人通常操作の成立範囲を集約。公開に影響する不足を先に示す | 実行していない範囲を合格扱いせず、残り工程・必要判断・11月結合枠への影響を具体化 |
| **10/31** | 各公開必須残差を「完了/実装残/配置残/本人確認残/採否待ち」で判定し、11/15結合・11/22候補・11/27提出へ進める条件を示す | 未達原因、残工程、次の一作業、12/18への影響を示す。自動延期・無断仕様削減はしない |

**次セッションの最初の一作業は、CM-01/T1でEmlis初回1例と訂正後1例の「本人source→モデルinput→意味候補/自然な受け取り案→採用先→最終本文」を揃え、既存教師とCMEE受口の不一致を閉じることです。** その同じ契約でT2〜T5の教師・4B runner・学習量・保存先を固定します。対象path・操作・終了条件は[§8](#detailed-work-breakdown)を使います。 ここで長い新設計や補助機構を増やさず、実際の4B出力を得て利用する単位へつなぎます。別の個別作業指示があれば、その対象を上の順位との関係を保って進めます。

### 4.5 今週は後ろへ置くもの

| 後置する作業 | 理由・再開する条件 |
|---|---|
| 9B/2B/他モデル、他社GPUの広い再比較 | 4Bと16/24GB範囲が確定したため。具体的な不成立が出た場合だけ対象を絞って判断 |
| Serverless Flexの本配備・常時構成との最適化比較、招待試用 | まず4BとCMEEの品質・利用経路を確認する。提供時の起動待ち・実費・LoRA読込等は後続で確認し、提供方式は合意済みにしない |
| 大量教材追加・複数学習量の一括探索 | 最初の4B結果から必要な不足へ絞る。小さな学習の失敗を教材量だけで解こうとしない |
| IF/Savedの新規実装拡張、Premium全機能の拡張 | 廃止ではない。既存の未実装/未対応と初回公開範囲への影響を10/31判断に残す |
| System Context全面再生成、新しい証拠・監視基盤 | fresh原本を直接読み、商品作業を止めない。直接の障害になった箇所だけ最小修復 |

既存の12/18公開目標・10/31管理線・三中核の商品基準は維持します。先週の未達も消さず、今回は最初の未完了箇所と依存から作業順を変えました。この優先順位追記時点では会議継続中で、今回の更新を商品完成・配備・費用発生・新しい実行承認へ換算しません（最終の会議状態は§11）。

## 5. 公開目標と現在の見通し

現行目標は**2026年12月18日（金・日本時間）の両ストア正式公開**です。申請日ではありません。今回、変更決定も達成保証もしていません。

| 継承する管理基準 | 今回の状態・影響 |
|---|---|
| 10/31：公開必須機能の残差を閉じる | あと7暦日。三中核の品質・配置・本人端末、AI費用、共通欠陥が残り、**達成の裏付け不足** |
| 11/15：購入・権限・両OS等の結合確認 | 10/31残差の持越しはこの確認枠を消費する |
| 11/22：提出可能な候補版 | 文章品質、同一版の通常利用、配布の結果が必要 |
| 11/27：両ストア審査提出 | 12/18まで21暦日の余地。審査所要・承認の保証ではない |
| 12/4見通し更新、12/11承認確認、12/14可否判断、12/18公開 | 12/18まで55暦日。重大未完はこの判断点まで伏せず判明時に示す |

Google Playの取得済みproduction accessを同一アプリで継承する既存前提は保持し、新規12人・14日間の資格再取得を勝手に工程へ戻しません。一方、現在のConsole／公開状態・今回の審査・公開制御は別確認です。

**華恋の現時点の見通しは、12/18を「予定通りに達成できる」と言える状態ではない、です。** 今週の技術成果を認めたうえで、品質・費用・通常一往復の未達が公開の主要なリスクだと判断します。日程を動かす場合も、無断で新しい公開日や削減範囲を確定しません。

## 6. 決定済み・提案・未決、次回への入口

| 区分 | 今回保持する内容 |
|---|---|
| 既決 | 学習済AI＋CMEE、観測技術の継承、三中核の継続、27B除外、**Qwen3.5-4B確定・GPU16GB優先/24GB許容**、Runpod残高利用の希望、価格上限980／1,980円、12/18公開目標 |
| 華恋の推奨・提案 | Runpod内で学習/初期接続をPods・低頻度提供をFlexとする使い分け、680／1,480円の目標検討、売上ゼロ5人14日、総枠2万円配分、§4の次週優先順位案。旧4B候補保持は§7の確定へ進んだ |
| 未決・未完成 | 4Bの具体的育成方法・量、16/24GB動作実証、提供方式、準備込み総費用、予算承認、P6、本人通常利用、有料差・三中核の商品品質 |
| 会議終了時にも個別記録なし | Mashによる実績の明示評価、次週案全体への明示採否・修正、追加予算・配布・実測の具体承認。会議終了自体は§11に記録済み |

次セッションはfreshな[全機能・全状態](../00_cocolon_current_product_and_state.md)と本議事録を読み、依頼対象の詳細owner・最新実ファイルへ進みます。Pieceは入口§119／map§65.62、AIは受領比較・原価・試用案、CMEEは内部準備trial、通常Analysisと共通欠陥は各実ownerを使います。旧第7回ALは本会議への引継ぎ履歴であり、今後の「まだ報告会未開催」という現在地にはしません。

初回保存は議事録新規・weekly案内・全体現在地の3文書。今回の優先順位・作業詳細更新も同じ3文書に限定します。主担当の華恋が統合・反映し、補助担当は読取レビューのみ。source／test／DB／runtime／配布／費用／商品仕様の変更はありません。**ADMINISTRATIVE_ONLY、product_credit=0、STRUCTURE_MAP_DELTA_NONE**。全体現在地には4B決定と次週順位を同期し、各機能の稼働・商品状態は変えません。新しい常設台帳・自動化・承認規則は追加していません。



<a id="4b-decision-and-runpod-usage"></a>
## 7. 報告会での決定 — 4B確定と、Runpod内の使い分け

### 7.1 Mashが確定したこと

Mashは、モデル選定の比較に時間を使い続けず学習へ進む必要性を明示した。4B／9Bの品質・資源と、下位2B・Runpod料金の説明を受け、**「4Bに確定」「16GBで動けばそれでよい」「無理でも24GBなら許容範疇」**と決定した。対象は既に比較したQwen3.5-4Bとする。

従来の「4Bは候補保持・モデル採用未決」はこの決定より前の状態。広いモデル探索、2B・9Bとの並行比較を次の標準作業へ戻さず、4Bの学習・CMEE接続へ作業を絞る。商品品質の合格、16/24GB動作、具体学習量・実行予算、提供方式や配置が成立した意味にはしない。24GB許容をGPU/有料推論の無制限起動許可へ変換しない。

### 7.2 料金確認と説明の訂正

4Bの同系列一段下はQwen3.5-2B。9BはA40上で推論peak allocated17.814GiB／限定LoRA19.939GiB、4Bは推論8.737GiBで、4Bの学習と2Bの実測はない。9B=48GB必須／4B=24GB必須／2B=16GBという固定対応は実証されていない。4B自身も16GB候補となる。

2026-10-24の公式公表価格、仮為替160円/$。在庫・地域の実見積り、税・保存・アプリ基盤費は別。PodsはA40 48GB $0.59/h、A5000 24GB $0.27/h〜、A4000 16GB $0.25/h〜。同じ100課金時間で9,440円／4,320円／4,000円。Serverless Flexは48GB $0.00034/秒、24GB $0.00019/秒、16GB $0.00016/秒。正確な時換算は$1.224/$0.684/$0.576、同じ100課金時間で19,584円／10,944円／9,216円。公式トップの$1.22/$0.69/$0.58は丸め表示であり、前の固定原価試算はその当時の時間表示で計算した履歴として保持する。

同課金時間の24→16GB削減はPods約7.4%、Flex約15.8%。4Bも2Bも16GBなら時間単価差0。2Bの短時間処理・同時処理による追加節約は未実測。安いGPUで処理時間が伸びる場合もあるので、時間単価だけで一生成の実費を確定しない。公開原価旧基準案の不成立、準備込み初期費用の未確定は、今回のGPU範囲決定で解決済みにしない。

### 7.3 RunpodとServerless Flexの関係、華恋の推奨

**Serverless FlexもRunpodの中のサービスである。** これまで使ったRunpod Podsと、Runpod ServerlessのFlex workerを比較しており、別会社へ移る推奨ではない。

| 観点 | Runpod Pods | Runpod Serverless Flex |
|---|---|---|
| 使い方 | GPU環境を借り、必要な間動かす | 要求に応じworkerが自動起動し、無要求時に縮退 |
| 開発・学習 | 環境を固定して学習、重み保存、原因調査を進めやすい | 推論用workerの梱包・起動・終了に合わせた準備が必要 |
| 提供時の待ち | 稼働しモデル読込済みならその起動待ちを避けられる | 停止後の初回に起動・モデル読込待ちがある |
| 運用 | 起動停止、API運転等をこちらで管理 | workerの起動停止・スケールをRunpod側が管理 |
| 費用 | 単価は低めだが起動中の待機も課金 | 単価は高めだが縮退中はGPU課金0。起動/実行/停止前待機は課金 |
| 華恋の推奨用途 | 4Bの学習・開発・最初のCMEE接続確認 | 接続確認後、利用者が少ない時期のアプリ提供の第一候補 |

この使い分けは華恋の推奨で、Mashの提供方式採用・Flex移行承認を先取りしない。理由は、既存のRunpod残高・試験・操作経験を継続し、最初は固定環境で4B/LoRAとCMEEの問題を切り分け、その後に利用の少ない時間のGPU常時負担と手動運用を減らせるため。Flexが常に安い・速い・無待機とは説明しない。

本提供の判断では、4B＋受領可能なadapterの読込、必要文長・同時処理のメモリ、起動込み応答待ち、CMEEの意味・訂正・保存再読を同じ経路で確認する。再送・自動再試行で同じ入力を二重保存しない既存責任も保つ。これらを新しい大規模比較や補助機構の追加へ拡張しない。

原典：[Runpod Pods](https://docs.runpod.io/pods/overview)、[Serverless](https://docs.runpod.io/serverless/overview)、[Flex課金](https://docs.runpod.io/serverless/pricing)、[秒単価](https://docs.runpod.io/serverless/endpoints/endpoint-configurations)、[GPU料金](https://www.runpod.io/pricing)、[A4000](https://www.runpod.io/gpu-models/rtx-a4000)、[A5000](https://www.runpod.io/gpu-models/rtx-a5000)、[Qwen2B](https://huggingface.co/Qwen/Qwen3.5-2B)。

今回の効果は会議での判断・推奨の記録と全体現在地の同期。新規GPU・有料推論・学習・配備・招待・DB・価格quota変更0、STRUCTURE_MAP_DELTA_NONE、ADMINISTRATIVE_ONLY。この決定追記時点では会議継続中（最終状態は§11）。
<a id="detailed-work-breakdown"></a>
## 8. 次週作業の詳細 — 対象ファイル・実行順・確認内容・終了条件

Mashの「やるべき作業をもっと詳細化し、可能な限り具体的に残す」という依頼による追記。§4の順位を、次の担当が対象pathと最初の操作から再開できる単位へ分解した。**以下は未完了作業の計画であり、今回の文書更新で実装・テスト・GPU学習・CI・配布・DB・本番変更を実行した記録ではない。**

詳細化の読取基準はCocolon `43143ffc6aee9e765e1a33b9d2830fe23b6ece13`／mashos-api `666b28517ef04aba170ebffe3c86980fea4c11bd`。§0の初回照合後、Cocolon側の会議文書だけが進んだ時点である。保存済み配置記録・実source・既存test・workflow・manifestを照合し、現環境を再照会したかのようには扱わない。参照先の固定SHAは調査時点で、実作業時には対象refの新差分だけを確認する。

実装・準備・検証・GitHubへの記録は華恋が担当する。Mashには、仕様・費用・公開範囲等の具体判断と、準備が整った端末操作が必要な地点で対象・手順・期待結果を示す。既に決まった4B・16GB優先/24GB許容や既適用SQLを、再検討の議題へ戻さない。以下のIDは議事録内の参照用で、別の管理基盤や追加の承認規則を設けるものではない。

### 8.0 読み方と、最初に着手する作業

| 順位・枠 | 詳細への入口 | 今回見つかった具体的な依存／最初の一作業 |
|---|---|---|
| 1：4BとCMEEの共通初手 | [8.1 CM-01〜10](#details-cmee) | **CM-01/T1は同じ一作業。** Emlis初回1例・訂正後1例で、完成応答教師と厳密candidate/evidence受口を対応させる。意味と自然な本文の責務・変更ownerを実例で揃える |
| 1：4B育成・実行保全 | [8.2 T1〜T9](#details-training) | 上の契約で教師を整え、旧9B固定・total40/free32GiB gate・診断hashを4Bへ合わせる。学習量／時間／支出／保存先を一設定に固定してから実行する |
| 2：独立並行のPiece | [8.3 P-00〜12](#details-piece) | 既存87151配布候補を使う準備→必要版導入→本人preview/明示保存/履歴再読。exportは現factory引数に未接続なので、そのsource差分を先に準備する |
| 3：限定必須の共通修復 | [8.4 C01/C02/C03](#details-common) | C02本人世代→C01購入完了/回復を結ぶ。C03 visibility失敗は独立APIで準備。offline学習の新しい開始条件へ広げない |
| 4：通常Analysis | [8.5 A-01〜12](#details-analysis) | 6501不足案内の本人確認を保持。最新保存の再読と、monthly生成/履歴を別にする。配置差と通常経路の不足から閉じる |
| 公開までの後続残件 | [8.6 REL-01〜12](#details-release) | 認証URL・両OS署名・価格/権利・申告・同一候補結合・提出・公開。必要準備を並行するが、全てを10/31完成目標や学習の前提にはしない |

**直列にするのは意味/教材契約→その契約での学習→実4B候補での結合。** CPU側provider準備、Pieceの配布準備、共通修復、Analysisの版差分確認は独立する範囲で並行する。CMEEと通常Analysisが共有する意味ownerを同時に別々の方式へ編集しない。CM-01/T1を二重に実施せず、一つの対応表を両方で使う。

各項目では「現存source」「未実装の変更案」「検証する失敗・回復」「本人の通常利用」「商品品質」を区別する。提案path・プレースホルダーは未作成と表示し、旧9B commandやstub commandを4B/P6の完成手順として渡さない。

<a id="details-cmee"></a>
### 8.1 CMEEと実4B接続 — CM-01〜10

#### A. 最初に解消する実物の接続差

**4Bを繋ぐだけの空欄は一つではない。** 現在は次の異なる入出力があり、この差を残したまま学習・接続を別々に進めない。

| 実物 | 現在の入出力・実施済み範囲 | P6へ残る具体差 |
|---|---|---|
| 4B比較・Emlis9教師 | 観測／reception等の完成応答を扱う。4B比較はadapterなしbase。9教師は全件Emlis | この完成応答をそのまま意味candidateと見なさない。4Bへ意味・自然な本文のどこを任せるか未確定 |
| `cocolon_meaning_experience_engine/preparation.py::prepare_emlis/prepare_piece/prepare_analysis` | core別の材料を`PreparedRequest(request_id, private_json)`へ凍結。request IDは材料から算出。原入力・補足・履歴を区別 | 4Bへ実際に渡すmessages／出力指示への変換が未接続。材料を切り捨ててcontextへ収めない |
| 同`receive_candidate` | `raw_output`、`finish_reason`、provider/model/revision/usage/elapsedを受取。rawの厳密な最上位は`{candidate,evidence}`。evidenceはsource_id／field_path／start／end／quote。全receiptは`NOT_ADOPTED` | 既存の観測本文JSONとは別shape。引用位置一致は意味正当性を証明しない。provider通信・token生成は一切行わない |
| Emlis `emlis_semantic_admission.py::prepare_snapshot_meaning` | 明示offlineの`SemanticInput`だけ採用／再開。`FRESH_CANDIDATE`と`RESUME_ADOPTED`を分離。v1/v2のfinite範囲 | 一般4B出力を無条件受理する入口ではない。既存型へ写せない意味を捨てて成功にしない。作者へ渡すだけで自然な受け取りの育成が完了するわけではない |
| Piece `piece_semantic_admission.py` | P01構文の候補→snapshot→既存plan／作者→private保存再読。原文2段落保持 | 一般文章整形・モデル作成文章の採用は未実装。通常B8 artifactとprivate artifactは別 |
| Analysis `cores/analysis/semantic_admission.py` | 原3構文family・Plus・補足0・比較なし。意味→private graph→文章／図payload→private保存再読 | 一般期間資料・モデルnarrative・通常保存／RN／比較へ未接続。3原文を保持できることと新しい観測文章の品質は別 |

以下でいうAPI pathの共通prefixは `ai/services/ai_inference/`、CMEE packageは `cocolon_meaning_experience_engine/`。ownerの実pathを省略する場合もこのprefixから解決する。

#### B. 作業順・依存・具体的な終了条件

<a id="task-cm-01"></a>
##### CM-01：4Bへ任せる意味・本文・問いの責務を、実入力と出力例で一単位に固定

- 依存：4B確定は済。モデル選びを再開しない。学習担当の最初の教師／runner確定より先に閉じる。
- 読む実物：`preparation.py::OUTPUT_CONDITIONS/_candidate/receive_candidate`、`engine.py::MeaningExperienceEngine.generate/prepare_emlis_update`、`emlis_semantic_admission.py::SemanticInput/prepare_snapshot_meaning`、既存9教師、4B受領12比較中の4B6本文。
- 具体作業：Emlis初回1例と訂正後1例を使い、「本人source」「4Bが返す意味候補」「4Bが返す自然な受け取り案」「CMEEが確定する本文・実問い・更新・保存」を横に並べ、現在shapeと必要差分を示す。Piece／Analysisも同じ表に担当欄を設ける。
- ここで具体化する未決：4Bは意味候補を返すのか、本文も生成するのか、両方か。根拠の保持・採用判断と自然な日本語生成をどの既存ownerが担当するか。既存唯一作者・独立reader・saved版との契約差分はどこか。共有の新Engineを増設しない。
- 自然な観測・受け取りを育てる目的を保持する。**「4Bの意味候補を旧finite作者へ渡すだけ」に無承認で固定し、その作者の原文復唱を最終到達へ縮めない。** 逆に、生成された文章を本人の意味／factへ逆流させない。
- 検証／終了：同じ入力から教師の正解・モデル要求shape・採用先型・最終本文が矛盾しない、変更予定pathと変更前後の具体例が示せること。新しい意味／作者責務を採用する具体判断が必要なら、この差分を判断対象にする。今の文書作成依頼だけで確定実装契約にしない。
- 記録先：共有設計01、Emlis設計02、必要なPiece03／Analysis04／schema05の該当差分。議事録だけで終えず、採用時は該当する設計原本にも差分を反映する。既存P1〜P5の結果・fixtureは過去原本として保持する。

<a id="task-cm-02"></a>
##### CM-02：4B実推論を呼ぶ薄い境界と、材料→messages→raw受取を具体化

- 依存：CM-01の入出力・責務。4B学習／重み保存準備とCPU側実装準備は並行可能。
- 現状：P1は通信0。Emlis serviceには`offline_candidate_source(request, prior_snapshot)`という注入点があるが、実provider実装はない。既存比較runnerはCMEEの通常providerではない。
- 具体作業：初期のRunpod Pods上4Bで、使用base revision／adapter revision／tokenizer／chat template／非thinking等の実条件、最大入力・出力、deadline、cancel時の扱い、raw bytesの保存、実usage／finish理由を、CM-01の要求形に結ぶ。
- 終了理由を既存の`stop/length/timeout/error/unknown`へ対応させる。EOS到達、token上限、通信不明、空出力を区別する。未取得metadataはnullのまま、推定値を実usageにしない。
- 同じ原入力に対する重複呼出しをどこで止めるかを既存attempt／source prefix／request identityへ結ぶ。providerの応答が失われた場合に、課金済みか不明な要求を無制限再送しない。provider側の重複抑止能力は未確認として具体化する。
- 検証／終了：原材料のID・parent・owner・期間・元fieldが保持され、4B rawと実metadataが同じ要求へ束縛される。JSON括弧補完や意味の手修正なしで受領でき、timeout／lengthはJSONが一見完結していても正常採用しない。
- 未決：実protocol・client配置path・認証方法・時間／出力量・終了理由対応のexact値。本書で新しいprovider file名・endpoint・環境変数・常設監視体系を確定しない。学習／開発Podsと提供Flexを混同しない。

<a id="task-cm-03"></a>
##### CM-03：原材料の投影・根拠座標・未採用状態を実4B出力へ保つ

- 依存：CM-01/02。通常アプリへの配備前にofflineで行う。
- 対象：`preparation.py::prepare_emlis/prepare_piece/prepare_analysis/receive_candidate`、`preparation_sources.py::piece_material/analysis_material`。
- Emlis：原入力、各回答、適格履歴、frame feedbackと実question controlを分離。回答を新規入力件数にしない。過去の生成応答を本人sourceへ混ぜない。
- Piece：保存済み元7field・source版・owner、memo／memo_action、全選択とnullを保持。`normal/pre-question`と未対応refinedを区別する。
- Analysis：owner、半開期間、INCLUDED／EXCLUDED、元record版と補足を凍結。長文・複数回答を黙って削除せず、現上限に当たる場合は未対応を返す。
- 根拠：モデルへ示したfield文字列とscalar座標、native envelopeのUTF8座標、可視本文の文字座標を混同しない。4Bが数えた位置だけを信用しない。
- 検証／終了：誤source／他owner／異なるrequest／範囲外quote、bool-as-int、重複JSON key、NaN、途中JSON、未知終了を拒否。正しい引用でも誤主体・時点・肯否・関係は未採用に留まる。既存`CandidateReceipt.adoption_state=NOT_ADOPTED`を、形式成功で変更しない。

<a id="task-cm-04"></a>
##### CM-04：Emlis初回を実4B→意味→実本文へ通す

- 依存：CM-01〜03、学習担当が保存・再load確認した4B版。base結果を使う場合はadapterなしと明記。
- 実owner：`engine.py::MeaningExperienceEngine.prepare_emlis_update/generate`、`emlis_semantic_admission.py::prepare_snapshot_meaning/derive_snapshot_plan/snapshot_question`、`emlis_answer_update.py::prepare_emlis_meaning/build_updated_grounded_plan`、`emlis_thread_engine.py::generate_emlis_thread`。
- 現入口：明示offline request＋`SemanticInput("FRESH_CANDIDATE", receipt, ...)`。採用後は同じsnapshotから`RESUME_ADOPTED`する。snapshot版、request／source prefix、prior、native bindingsと既存planを照合する。
- 実4Bが返したunknownの対象、二行動、原格、省略主体、過去の喜び／現在の不明、TE連結／concessionを保持。joy不明を原因不明・信頼・成長へ書換えない。対応できないcandidateを手書きfixtureへ差し替えない。
- **E02-0の現既存到達は問いなしEND。** 同例へ問いを強制して学習・接続成功を作らない。E02-Bの`SUPPLEMENTAL_PROBE`を実回答へ昇格しない。
- 検証／終了：採用／HOLD／UNSUPPORTED／REJECTと理由、raw、snapshot、実Observation・受け取り・実問いまたはENDを同じ版で示す。本文が原文コピーに留まるなら、意味接続の技術到達と自然な文章の未達を別記する。CM-01で選んだ本文責務が実際に働くことを確認する。

<a id="task-cm-05"></a>
##### CM-05：実pendingのある別caseで、本人回答による読みの更新を通す

- 依存：CM-04。E02-0に架空pendingを追加しない。
- 既存の実pending例：`ai/tests/test_cmee_emlis_semantic_snapshot.py::test_initial_candidate_reaches_real_author_question_and_snapshot_replay`／`test_real_pending_answer_keeps_subject_time_and_unaffected_material`。同fileは`test_cmee_emlis_q1_thread.initial`を使う。実初回で得たquestion ID・target・予算を使い、合成したIDを作らない。
- 対象：`emlis_question.py::question_candidate/validate_question_binding`、`emlis_answer_update.py::prepare_emlis_meaning`、serviceの`answer/action`。
- 追加、明示訂正、撤回、不明、skip／終了、NO_MATERIAL_UPDATEを既存の到達可能な範囲で通す。回答envelope・parent・実question・既存prior snapshotと新candidateを束縛し、未変更内容・元経験・残存不明を失わない。
- Free／Plusの0..1、Premiumの0..3と本人続行、同じ回答の再送、古いrevision・異なるquestion・別owner・END後の回答を検査する。初回でENDとなる入力はそのまま保持する。
- 検証／終了：回答前後の意味差と本文差が一致し、訂正された理由を残したり否定された説明を出来事factへ変えたりしない。更新未解釈ならANSWER_UNREFLECTED、旧本文の新prefixへの付替えなし。実問いがないcaseはN/Aであり失敗・成功へ水増ししない。

<a id="task-cm-06"></a>
##### CM-06：候補取得・意味保存・本文保存の失敗／重複／再開を閉じる

- 依存：CM-04、CM-05。一回のモデル出力だけで保存完了としない。
- 実owner：`emlis_thread_service.py::EmlisThreadService.__init__/_semantic_candidate/_semantic_unadopted/_process/_replay/get/start/answer/action`。
- 現状：`semantic_profile+offline_candidate_source`は`enforce_application_policy=True`と併用不可。`SEMANTIC_CANDIDATE_STARTED`→`...RECEIVED`→`MEANING_UPDATE`→本文を既存eventsへ保存する。STARTEDだけの中断は`semantic_candidate_acquisition_incomplete`、既受領receiptや既採用snapshotは再利用する。通常readerは対象profileを書込可能へしない。
- 具体的な失敗地点：取得前／STARTED保存後／4B応答後receipt保存前／RECEIVED後／MEANING_UPDATE後／本文保存時／保存成功だが応答消失。各地点で、次回に候補再取得・再採用・意味event重複が起こるかを確認する。
- 完成済みGET／start／close→reopenでprovider・採用・作者を呼ばない。意味確定後に作者が失敗した場合はsnapshotを保持し、明示再開で同じ意味を使う。旧完成DTOと確定旧失敗を勝手に作り直さない。
- 検証／終了：原入力・回答・旧履歴・operation・checkpointが保持され、重複課金抑止と保存CASの具体動作を示せること。既存STARTED中断の制限を、仕様変更の判断なしに自動retryへ置換しない。HTTP／Auth／native stubの検査と本物の稼働成功を分ける。

<a id="task-cm-07"></a>
##### CM-07：Pieceへ実4Bを通し、単独伝達できる文章と保存再読の差を閉じる

- 依存：CM-01〜03。CM-04/05がEmlisの最初の完成単位。教師はEmlis9件しかなく、Piece完成教師を学習済みとしない。
- 実owner：`piece_semantic_admission.py::admit_piece_semantic_snapshot/generate_piece_semantic/serialize_piece_semantic_state/load_piece_semantic_state/resume_piece_semantic`、`piece_v1c.py::compile_piece_artifact_plan/realize_piece_artifact`、`piece_v2_content_policy.py::validate_piece_semantic_preservation`。
- 現在は原P01構文の6claim／5文／2関係と全選択を保持し、本文は原文2段落。4B完成応答のcanonical textをそのまま既存snapshotと同じ型へ装わない。
- 具体作業：本人が何を手伝ったか、喜び、帰宅の遅れ、後悔否定、次回は余裕で決めたい条件を、モデル本文と根拠へ結ぶ。未記載の仕事増・遅刻、選択感情からの原因・強度追加を拒否する。必要な少数の編集教師は既存本人sourceと仕様に基づく華恋編集案と明記する。
- 検証／終了：snapshot／plan／完成のprivate再読、作者失敗後の同snapshot再開、完成済み再読で候補／採用／compiler／作者0呼出を維持しながら、原文コピーからどの意味をどう文章化したか説明できること。一般化や通常画像保存まで完成したとしない。
- 通常接続の別差分：`piece_v2_generation.py::generate_piece_candidate`は旧meaning／plan／作者の再導出一致・author-free reviewを行う。private結果をB8へそのまま渡せる前提にせず、この一致条件とsource version・artifact型の変更案を具体化する。

<a id="task-cm-08"></a>
##### CM-08：Analysisへ実4Bを通し、同じ根拠から文章・図・再読を作る

- 依存：CM-01〜03。CM-07と共有Engine編集を競合させない。
- 実owner：`cores/analysis/semantic_admission.py::admit_analysis_semantics/generate_analysis_semantic/serialize_analysis_semantic_state/reload_analysis_semantic_state/resume_analysis_semantics`、`intent_compiler.py::compile_semantic_graph/validate_semantic_graph`、`observed_route_realizer.py::realize_semantic_graph/validate_semantic_artifact`。
- 現在のP5は原3構文family／Plus／補足0／比較なし、18保持単位・11文group・8source scope・route edge0・unknown・負荷注記・選択4だけ。原11文を並べる現出力を完成した期間分析にしない。
- 具体作業：原記録ごとのnode・scope・意向・否定・まだ分からないことを保ち、別記録の完了結果を別役割へ誤edge接続しない。本人の不知と資料内未観測を分け、負荷「少し面倒」を購入失敗／性格へ補完しない。モデルが作る文章と図で同じnode・edge・不明を使用する。
- 検証／終了：同じsnapshot／graphから両投影とprivate保存再読、graph／本文片側改変の拒否、作者失敗後の同snapshot再開。4Bの実candidateでどこまで成立したかを示し、hand-authored packetの再生をモデル成功へしない。
- 通常接続の別差分：`analysis_observed_service.py::generate_saved/private_storage_evidence/_checked_projection/read_saved`は通常artifactの`safe_projection/safe_text_projection`と既存RPCを使う。新private payloadを既存SQLへ渡すことは未実装。複数ANSWER拒否、比較未対応、IF／Saved未実装をこの限定P6で消さない。

<a id="task-cm-09"></a>
##### CM-09：offline結果から通常serviceへ接続する設計・実装差分を限定する

- 依存：各coreの実4B出力・保存再読。通常有効化はoffline成功と別段階。
- Emlis：`api_emlis_thread.py::register_emlis_thread_routes`は`EmlisThreadService(enforce_application_policy=True)`を作る。現semantic constructorは同時指定を拒否するため、flagをONにするだけでは接続できない。通常request mode・owner／tier／履歴期限・writer／reader・旧saved互換、provider呼出しの時点と停止方法を具体化する。
- Piece：通常B8 consumer→preview→明示保存→本人履歴という既存ownerを継承し、private artifactから通常canonical text／format／recipe／rendererへの型・版変換を具体化する。refinedやNexus旧経路を黙って対応済みにしない。
- Analysis：期間source loader→Engine→文章／graph／private evidence→既存保存RPC→read_savedの各型／schema差を特定。新SQLの要否は実差分から決め、P5成功を理由にSQL適用済みとしない。
- 検証／終了：通常入口が1つの生成ownerを使い、旧データは旧版のまま読める。現在の本人sourceが削除／失効／変更された場合、他owner・expired・プラン不足時に既存条件を保つ。原入力保存をモデル成功に従属させない。
- 未決・別判断：採用する通常profile、保存contract／migrationの要否、配置commit、runtime構成、提供方式、費用・timeout、実DB・本番適用範囲。本議事録での詳細化を包括承認にしない。

<a id="task-cm-10"></a>
##### CM-10：同一版で通常API→RN→本人保存再表示まで確認する

- 依存：CM-09のsource検証、必要な個別配置・配布判断、同一候補版の準備。
- Emlisの既存API：GET `/emlis/threads/by-input/{emotion_id}`、POST `/emlis/threads/{thread_id}/answers`／`actions`／`frames`。実装は上記`register_emlis_thread_routes`。初回生成開始をGETだけの仕事と誤認せず、通常入力保存の既存start呼出しから確認する。
- RNの既存確認先：`InputScreen`→`useEmlisThread`→`EmlisThreadModal`、履歴から再表示、同じ元入力・観測・問い・回答・訂正後本文。別担当の配布版／実API版との一致を先に揃える。
- Piece：通常入力→同一preview→明示private保存→本人履歴／詳細。モデル本文の保存と画像renderer／Photos／Shareは別の到達で報告する。
- Analysis：latestは同一保存結果の再読、monthlyはmonthly生成→履歴→同じdetailで確認する（A-03/04）。比較は対応する同一版で別に確認する。
- 検証／終了：HTTP/Auth/native stubの成功ではなく、対象版・本人認証・通常操作・実保存再表示の記録を残す。利用者に明らかな低品質を最終判定させる前に華恋が実本文を読み、意味反転・補完・訂正無視を修正する。正式商品受入れと実機動作成功も区別する。

#### C. 現物で確認した検査・fixtureと、実行時に注意すること

既存test／fixtureは再利用する。新しい総合checkerや別台帳を作らず、P6で変えた責務の実因果・保存再開・旧互換を検査する。

| 現存path（mashos-api） | 使う既存検査 |
|---|---|
| `ai/tests/test_cmee_preparation.py` | 材料・receipt・終了理由・位置検査とNOT_ADOPTED |
| `ai/tests/test_cmee_emlis_semantic_snapshot.py` | 初回・実pending、追加／訂正／撤回、adapter旧版、source変異、隔離service保存・中断再開・現reader |
| `ai/tests/fixtures/cmee_emlis_semantic_adapter_v1.json` | 旧snapshot／全outcomeの互換対照。新4B結果へ書換えない。v2用の別fixture名は現存確認できず、新設済みとしない |
| `ai/tests/test_cmee_piece_semantic_snapshot.py`、`ai/tests/fixtures/cmee_piece_semantic_snapshot_v1.json` | P01保持、選択非補完、private段階保存、実作者失敗・完成済み禁止再読。fixtureのoriginは手作業でモデル出力ではない |
| `ai/tests/test_cmee_analysis_semantic_snapshot.py`、`ai/tests/fixtures/cmee_analysis_semantic_snapshot_v1.json` | 原3記録、未知／負荷／scope、片側投影改変、意味／graph／完成再読、実作者例外 |
| `ai/tests/test_emlis_q2_application.py`、`test_emlis_q3_application.py` | 既存保存／回答／tier／continueの対照。今回の候補成功で旧未分類失敗を消さない |

既存コマンドは以下のP1用だけ現物確認済みで、**4Bを呼ぶP6 commandではない**。本作業では実行0。

```bash
PYTHONPATH=ai/services/ai_inference python -B -m unittest discover -s ai/tests -p test_cmee_preparation.py -v
```

Cocolonの現存`observation_learning/trials/2026-10-23-current-four/run_current_four.py --prepare-only --api-root ... --output ...`は4材料・20stub receiptの再現用。`main()`は既存C0結果の存在で再実行を拒否する。新しいP6実モデルcommandへ名前だけ流用しない。**P6 runner／model endpoint／実行引数は未実装・未確定**なので、現時点でコピペ実行できるとするcommandは記載しない。

既存P4／P5検査の過去実行はPython3.12.14、pytest8.4.1、pytest-subtests0.14.2、Node24.19.0／既存PGlite0.5.8と`Q2_PGLITE_MODULE`等を使用した。次の実装時には既存runtimeを発見・import確認し、その時点の実pathで対象検査だけを実行する。過去のscratch絶対pathを将来の固定commandにしない。今回は新test実行・P1/C0再生成・モデル呼出し・DB照会0。

#### D. 最初の一作業と、週末に残す結果

最初の一作業は**CM-01で、4B学習の完成応答教師とCMEE受口の不一致を、実入力／現出力／変更後の形／変更ownerで一つに揃えること**。学習担当の4B runner準備と連携し、長い新上位設計・広いモデル比較へ広げず、同じ4B実出力を取得して採用・文章・保存へ通す小単位へ結ぶ。

週末にはCM-01〜06のEmlisを優先し、使った4B/adapter、raw、候補採否、意味、実本文／実問いまたはEND、回答更新、保存再読、失敗／重複／中断の結果を揃える。続いてCM-07/08でPiece／Analysisの限定到達・未対応・文章品質を示す。CM-09/10が未到達なら、内部接続成功と通常利用の残差を分ける。実行していないところを終了にせず、未完の次task ID・具体不足・必要判断を残す。

モデル決定／GPU16GB優先・24GB許容は再選定しない。16GBで不成立なら原因と必要24GB構成を示す。提供Flexの採用・本配備、広い価格最適化、9B/2B比較、大量教材追加、IF/Saved新規拡張はこの主枠へ先行追加しない。意味反転・根拠外補完・訂正無視を残したまま周回だけを増やさず、取得・意味採用・本文形成のどこで起きたかを実結果から修復する。

<a id="details-training"></a>
### 8.2 4Bの教材・学習・重み保全 — T1〜T9

略記：F/＝`Cocolon_前提資料/observation_learning/training/2026-10-24-emlis-free-pilot/`、C/＝`Cocolon_前提資料/observation_learning/model_selection/2026-10-24-9b-4b-comparison/`、R/＝`Cocolon_前提資料/observation_learning/trials/2026-10-24-qwen9b-free-lora/recreated-run/`。下記は未実装の作業案で、新方式・予算・実行の採用ではない。

<a id="task-t1"></a>
#### T1. P6のモデル責務・入出力と学習targetを一致させる

- **既存owner／実際の差**：P6の`preparation.receive_candidate`は厳密`{candidate,evidence}`・NOT_ADOPTED。F/sft_examples.jsonlとC/cases.jsonlの期待出力は観測／reception等の完成JSONで、意味候補へそのまま採用できない。
- **やること**：P6側で最初に4Bへ担わせる意味候補／表面文等の責務を一案に具体化する。旧JSONの各fieldを「targetへ対応／根拠不足／表面文／未使用」に分ける。変換が必要ならexact owner・field・失敗時の扱いを決める。
- **完了物**：本人source→model input→model raw→candidate/evidence又は許可表面文→既存admission／作者の対応表と、Emlisの一往復例。学習する内容とP6で受け取る内容が一致し、完成応答を意味候補へ無条件転用しない状態。
- **依存**：P6責務・入出力が未決なら新教師とGPU学習を開始しない。本稿が新方式を決定しない。

<a id="task-t2"></a>
#### T2. 元教材を保持し、4B用train／非学習evalを固定する

- **既存owner**：F/の4datasetと`run_pilot.validate_data()`。元9教師は6family（udon/book/chair/shop/repot/knit）、初回6／一回答後3、問いあり3／null6。華恋編集7／架空補充2で、Mash完成gold9件ではない。
- **やること**：T1後に全9行を「出典／本人source／旧完成案／新input／新target／根拠／不明・訂正／採用可否」で対応付ける。意味候補targetならcandidate/evidenceを作り、表面文targetなら確定意味と許可範囲をinputへ与える。元9行・原18候補・教示5参照・撤回第7回は変更しない。
- **評価分離**：元EFREE-E01〜E06は学習に使わない。既読の開発用6familyでblind最終評価とはしない。C/の6比較には教師由来の椅子・開店2件もあるため、全てを学習外と呼ばない。F/のPiece／Analysis教師は0で、Emlisだけの学習を三core育成へ換算しない。
- **検証・完了**：採用行数N、family、input／completion tokens、filehashを固定。出典付き教材とtrain messages一致、ID非重複、train/eval family分離、Free・履歴frameなし、回答後問い残数0を検査。華恋がtarget全文を読み、model誤答・評価の正解をtrainへ混入しない。

<a id="task-t3"></a>
#### T3. 4B専用の固定runner／bootstrapを作る

- **既存owner**：F/run_pilot.pyの定数・prepare()・run()、runpod.sh、recreate_pilot.sh、experiment.json。現runnerは9Bで、recreateはd53f9efの9B recipeをhardcodeして再取得する。
- **やること**：9B履歴を上書きせず、MODEL=`Qwen/Qwen3.5-4B`、固定revision=`851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a`（既存比較と同じ）を候補にする。9B出力directoryと分け、4B source／dataset／設定をmanifestへ束縛。9B adapterはloadしない。
- **作業先案**：`training/2026-10-24-emlis-4b-training/` に同種runner／bootstrap／diagnose／export／tokenizer test／manifestを置く小pack案。**未作成の候補path**で、実行commandはまだない。主担当が既存owner内変更を選ぶ場合はそのexact pathへ置換。新汎用model比較frameworkを作らない。
- **技術初期値案**：BF16／SDPA、batch1、r8／alpha16／dropout0／bias none、AdamW lr1e-4／weight_decay0、clip1.0、gradient checkpointing、use_cache=False、final assistant限定loss、非thinking／greedy／MAX_NEW1024。最適値・新承認とは扱わず、変える値の理由を明記する。

<a id="task-t4"></a>
#### T4. JSON指示・tokenizer・module・学習量を実行前に確定する

- **既存owner**：F/`run_pilot.chat_token_ids()/encode_training()/prepare()`、test_tokenization.py、experiment.json。旧9B promptはJSON-only明示なし、C/は明示あり。旧parse0件を明示JSON命令違反としない。
- **やること**：T1のtargetに合うJSON指示をtrain／eval／diagnoseで同一にする。4B tokenizerでreturn_dict=False、list[int]、prompt/full prefix、最終assistant mask、EOSをCPU確認。2048超過を切り捨てず、T1の必要inputからcontext案を決める。旧9Bとのprompt条件差は保持する。
- **module確認**：4B固定indexと実named_modulesで、layer3,7,11,15,19,23,27,31のtext q/v16moduleを照合。base凍結・LoRAのみtrainableを一覧化。9B1,114,112parameter／32tensorという数だけで4B正当性を判定しない。
- **学習量・完了**：N、epoch E、optimizer steps（batch1・accumulation1ならN×E、他条件なら端数とaccumulationを含む実式）、completion tokens、batch／accumulation、保存点／終了点、max seconds／max paid amountを一つの表へ固定する。旧9B1epoch9stepは既存小試験量で、4Bに十分な根拠ではない。保留1／4／16三条件比較を自動流用せず、一設定を選ぶ。P6とNが未決の現時点で最適epoch／総stepを確定済みにしない。

<a id="task-t5"></a>
#### T5. 保存領域・課金範囲を確認し、16GBを第一候補に準備する

- **実際のblocker**：F/run_pilot.run()とdiagnose_learning.main()は**total40GiB／free32GiB未満を拒否**する。未変更で16／24GBの4Bを起動できない。
- **やること**：4B用GPU admissionを実profile／実空きへ限定変更。単に40／32gateを削って動作実証済みにしない。GPU名、total/free、BF16、Torch／CUDA、他process、cache空きを記録。PINSはTransformers5.19.0／PEFT0.21.2／Accelerate1.15.0／Safetensors0.8.0を確認し、既存Torch／CUDAを維持する。
- **保存先**：実directoryに対する`findmnt -T <実directory>`・`df -h <実directory>`等の読取案を用意し、Runpodのcontainer disk／volume／network volume設定と照合。/workspaceという名前だけで永続としない。新有料volume作成は別判断。
- **完了・未決**：16GBで4B LoRAは未確認。実GPU単価、prepare／download／run／診断／退避／手動待機の時間と支出枠、停止担当を具体案へ置く。process timerはPod課金上限・自動Stopではない。課金範囲未承認なら有料実行しない。

<a id="task-t6"></a>
#### T6. 一つの固定設定で学習し、途中結果・失敗も保持する

- **既存owner**：F/run_pilot.run()/evaluate()/write_json()、recreateの重複拒否／outer timer。9B recipe取得は4Bへ継承しない。
- **やること**：4B code・manifestをGitHubへ保存・読戻し後、model／revision／datasetが一致する固定commandを一組にする。attempt marker、既存結果存在時拒否、出力先一意化を維持。base前raw→固定設定の学習→after rawを同じinputで行い、回答ごとflush／run.json atomic更新。
- **記録**：loss、completion tokens、step／epoch、trainable一覧、peak allocated／reserved、可能ならGPU全使用量、各stagewalltime、parse／EOS・打切り、失敗status。教師NLL／教師生成を診断する生成数も事前の実行範囲へ含める。
- **停止**：非有限loss、OOM、未知module学習、truncate要求、時間・支出上限で停止。16GB不足なら失敗log／結果／費用を保存し、同BF16／教材／長さの24GB移行案を出す。**24GBを自動で借り直さない。** 量子化・contextやtarget削減を混ぜて同条件成功としない。既存processをkillせず、epoch延長・9B／2B再比較も自動実行しない。

<a id="task-t7"></a>
#### T7. 先にadapterを退避し、同じ4B baseへの非学習reloadを確認する

- **既存owner**：F/export_checkpoint.export()、diagnose_learning.locate_saved_run()/reuse_cache()/measure_nll()/main()。現診断は9B runnerhash／reference／adapterhash／cache／1epoch9step固定なので、そのまま4Bへ使えない。
- **やること**：4B source・model・revision・recipe・dataset・runID・adapter3filehashへ束縛し直す。学習直後、README／adapter_config.json／adapter_model.safetensorsと必要raw／設定を先にarchive化。9B再作成のschema／recipe metadataを4Bへ貼らない。
- **reload検証**：同じ固定4B baseへis_trainable=Falseでload。active adapter、module／tensor shape・dtype・有限値・norm、全parameter非学習を確認。教師completionをpromptへ渡さず教師NLLと生成を測り、診断前後のadapter3filehash不変を確認。診断はoptimizer／追加学習なし。
- **完了・限界**：新manifestに一致する重み本体・非学習reload・rawが揃う。NLL低下率を観測精度改善率とせず、教師適合だけで商品採用へ進めない。9B旧hash／parameter数による代用をしない。

<a id="task-t8"></a>
#### T8. Pod外の重み退避を確認してからStopし、実費を記録する

- **既存owner**：F/export_checkpoint.export()、recreateの退避→診断→再退避。既存exportはallowlist、64MiB/file上限、内部readback、archive SHA256を持つ。
- **やること**：最終rawを再退避し、内部各fileのbytes/hash・全体sha256を照合。base／cache／venv／credentialsを除外。Pod外の受領先でもhash、adapter本体3file、model／revisionを確認。JSONだけの受領を重み退避完了としない。
- **停止順**：退避確認後にPodを手動Stopし、Stop状態・GPU総時間・実単価・storage費を別記。旧runnerの即Stop案内は4Bで退避確認後Stopへ変更。adapterが無い失敗もlog・途中結果を回収して停止する。
- **保全**：9B初回adapter未回収と別run受領の区分を維持。4B受領を初回9B復元へ帰属させない。重み未受領のまま再学習しない。旧adapterにoptimizer状態はなく、新optimizer開始を厳密resumeと呼ばない。

<a id="task-t9"></a>
#### T9. 教師適合・非学習品質・P6接続の達否を分ける

- **既存owner**：F/eval_review.jsonl、R/README／verification、P6 core別admission・既存作者・保存再読。同4B base／afterのrawを全件読む。
- **確認**：主体・時点・否定・方向・不明、訂正前意味復活、根拠外の返信・約束・理由・人格追加、自然な受け取り。問いなし一律失敗を避け、回答後残数0／ENDを守る。形式と意味、教師適合と非学習転移、standalone生成と実CMEE採用を分ける。
- **判断**：教師に近づくが非学習で崩れるなら商品採用せず範囲・転移を修正。教師にも近づかないならmask／target／prompt／勾配・module／step実記録へ戻る。自動epoch追加、容量原因への即断、9B再比較をしない。
- **完了物**：一つの固定4B recipe、契約一致train/eval、base前後raw、adapter本体・非学習reload、失敗と実費、P6適用可否。P6で意味→本文／問い更新→保存再読が成立した範囲を別記。**4B教材学習成功、16／24GB適合、三core商品品質、本番長文／同時数、月額採算は現在未成立。**

#### 現存する旧commandと未作成の4B command

旧9Bには`bash runpod.sh prepare|run`、`bash recreate_pilot.sh prepare|run`、`python diagnose_learning.py --directory ... --reference-result ...`、`python export_checkpoint.py --directory ...`がある。**4B用commandではない。** T1〜T5が閉じて4B codeを固定してから主担当が作成する。更新中branch名・未作成filenameを今すぐ実行可能な手順にしない。

旧9B別runの実測は9step、peak19.939GiB、教師NLL1.81506→1.65714だが教えた事例にも観測欠陥が残る。4B成功へ読み替えない。元run_pilot blob=b1d79440b9a904e9a03fc111120743eda520d390、runpod=01354d161d073f6c5a075975c499c3c679bfa3f4、recreate=36fdb8e8ca1f6485ade508e11180afdeabf13d19、diagnose=15a8370b7c8947a009e3065c65f0340ea05c93fa、export=cd8f4eae29df8c556f9bf52a6b614a64e5e2892f。全12fileとR/結果は上記Cocolon固定版から取得済み。

<a id="details-piece"></a>
### 8.3 Pieceの通常保存・画像・公開残差 — P-00〜12

#### 現在地と、繰り返さない完了済み作業

- Piece6migrationは適用済み。10/19のquota／visual SQL2本も含む。再適用しない。
- private APIは10/23の最終確認記録で3577d7fd／dep-dbd8hjoae00c73firbt0がLive。TTL600秒、renderer=piece.rn_bitmap_renderer.ios.v1、preview／save／owner_read／delete=true。public_write／public_read／visibility_toggle／export=false。今回の現環境照会ではない。
- privacy2fileはAPI3084c99eで開発正本へ同期済み。新しい配置に使うsourceにも同一修復が入っているかだけを差分確認し、同じ修復を作り直さない。
- 新iOS bitmap方式は限定実RNで420文字と正常8PNG／拒否6まで確認済み。JS979／新native44成功、旧195中19FAILは残存。旧失敗を消して総合GREENとしない。
- 最新送信成功6501（run38041653252/source55142229）は新版保存host・正式eligibility供給・新bitmap rendererを含まない。6501で新版P-W1成功を判定しない。
- 保存controller、同key回復、owner history/detail、画像設定PATCH、取消、owner削除はsourceに存在する。最初の未完は必要RN版の配布→本人Authでの通常保存再読。
- 新型bitmap supplierはfeatures/piece/pieceRenderer.jsでPlatform.OS==='ios'に閉じる。Androidはcompile成功だけで新版保存・画像成立とはしない。
- sourceの先頭コメントに残る「future/unconnected」は後続host実装と照合する。コメントだけで実装済み接続を未実装へ戻さない。

#### 実行順と、各作業の到達物

| ID | 順序・依存 | 作業・対象 | 完了を示す具体物 |
|---|---|---|---|
| P-00 | 各実作業の開始前、必要範囲のみ | 配布／API／端末の版を揃え、既承認を確かめる | source/ref、実行する既存手順、現承認範囲、残る差分が特定済み |
| P-01 | 最初。P-00後 | 87151候補の既存署名build・TestFlight送信1回 | actual run/head/build番号、Archive／IPA／upload各結果 |
| P-02 | P-01成功・Apple処理後 | 必要版の本人端末導入、正常private操作の準備 | TestFlight表示版と端末版の対応、対象操作と期待値が用意済み |
| P-03 | P-02後 | 本人通常入力→preview→明示private保存→本人履歴／詳細 | 同じPieceの本文・recipe・3hash・rendererが保存再読で一致 |
| P-04 | P-03と並行。破壊系は隔離環境を先行 | 保存不明、取消、期限、画像変更、account／background／flag境界 | 同key回復・無二重保存・無別候補混入・失効後の旧結果非採用 |
| P-05 | P-03の結果を利用 | exportを可能にする既存compositionの最小source接続案 | default OFF／owner_read依存を維持した限定source・検証・配置案 |
| P-06 | P-05の実効化後 | 通常本人詳細→同一画像→実Photos／Share、取消・拒否・cleanup | OS実結果と画像、結果メッセージ、コピー寿命の整合 |
| P-07 | P-03以降の独立準備可 | Android新版renderer／保存／書出しの欠落を閉じる案 | Android固有の変更設計、実装・検査・実端末の段階別結果 |
| P-08 | P-03／P-06の適格結果を利用 | 三形式・プラン差、未接続の形式選択 | entitlementとeligible_formatsに沿う表示／要求／保存再表示 |
| P-09 | 各本文・画像が出た時点 | 本文の意味・単独伝達性・3形式画像の商品確認 | 改善／未改善／未提供をsource根拠で説明できる結果 |
| P-10 | private一往復と共有が成立する順 | B12-A/B/C、Nexus公開・旧Q&AのM5残差 | 新旧混在を解消した同一backend/RN packetと公開境界検証 |
| P-11 | P-06から独立設計可、実装は契約確認後 | B13-B body-free export receiptの未実装 | 既存record/hashに結び付く最小receipt、本文非保存の検証 |
| P-12 | 公開前残差判定。M6以降は別段階 | 未解決native19、M6/M7/M8、再書出し等を取り落とさない | 各項目の採否・未完了・公開影響と次の一作業 |

<a id="task-p-00"></a>
##### P-00：同じ版と既承認を確認する

対象：Cocolon_Piece/00_read_first.md §119、同manifestのcanonical_privacy_and_rn_distribution_20261023、current_structure/02_piece_current_structure.md §65.62、全機能現在地、最新weekly。

1. fresh PR30／PR3 head、配布候補ref87151、既存workflow blob ff3eeaaa83639a3b00db47f3fa09f924dab3bccdを確認する。新しいsource差がある場合だけ該当pathを確認する。
2. APIの「開発666b285」「稼働3577d7fd」、RNの「開発」「送信6501」「固定配布候補87151」「端末導入」を別欄にする。
3. 既適用SQL・既有効private構成を再承認待ちへ戻さない。配布、export source／有効化、公開切替、追加DB、Android配布はそれぞれの現承認を照合する。
4. ここで全repo再監査、新しいchecker、System Context全面再生成、GPU／model採用をP-W1の追加前提にしない。

成果：その作業のsourceと対象環境、実行内容、既承認／未判断の差が1つの既存作業記録から分かる。秘密値、本人のrecord IDやcase digestを公開議事録へ載せない。

<a id="task-p-01"></a>
##### P-01：既存iOS workflowによる固定候補の配布

現物：.github/workflows/ios-build.yml。workflow名iOS TestFlight Build、id237145246。workflow_dispatchにinputsはなく、UIではbranchを選ぶ。候補branchはagent/piece-testflight-private-20261023、head87151。

実行前に用意する具体案：

- 対象は既存TestFlight appへの1回の署名Archive→IPA export→upload。公開App Storeリリース、Android、API／DB／flagは含めない。
- 既存macos-26、Node24.19.0、npm ci、Podfile.lock、既存署名設定をそのまま使用する。署名秘密値の取得・転載・再作成はしない。
- actual build番号はGITHUB_RUN_NUMBER*100+GITHUB_RUN_ATTEMPT。次がrun66/attempt1なら6601だが、事前固定せずactual runと生成ログで確定する。
- GitHub pluginにdispatch操作がないため、既存GitHub画面Run workflowによる案。利用可能な実行手段と必要なブラウザ切替の現承認を確認する。未承認のままdispatchしない。
- 1回の実行後、失敗をoperator rerun／別source修正で自動延長しない。workflow内の既存CocoaPods最大3attemptはそのまま区別する。

現workflowの実stage：

1. CheckoutとXcode／SDK確認。
2. npm ciと既存patch。
3. CocoaPods（既存Pod削除・deintegrate・pod install --repo-update、内部retry最大3）。
4. 既存証明書／profileのinstallと既存team／bundle整合検査。
5. build番号設定。
6. xcodebuild：workspace=tempCocolon.xcworkspace、scheme=tempCocolon、configuration=Release、destination=generic/platform=iOS、archivePath=build/Cocolon.xcarchive、Manual署名、deployment target15.1。
7. 既存ExportOptions.plistでapp-store export、build配下IPA。
8. xcrun altool --upload-appで既存TestFlightへ送信。

完了条件：actual run URL／attempt／headが候補と一致し、Archive・IPA export・Upload stepがそれぞれ成功。送信成功とApple processing完了、テスターへの可用化、本人導入、アプリ動作は分ける。失敗stageなら原ログから対象path／原因／次の最小修復案を記録し、この一回を終了する。

<a id="task-p-02"></a>
##### P-02：本人端末で使う版と操作を準備

1. P-01 actual番号を用い、Apple処理・TestFlight表示が揃ってから本人導入へ進む。6501と新番号を取り違えない。
2. 実端末のOS・app version／buildを確認する。run/headとの対応は華恋側で作り、MashにSHA比較を戻さない。
3. 通常本人Auth、tutorial外、現在のownerとruntimeロード完了を確認できる経路を用意する。Renderログインやservice_roleを本人Authの代用にしない。
4. Mashへの案内は「どのbuild」「どの画面」「何を押す」「期待する表示」「既知の未提供（export OFF等）」まで準備してから依頼する。
5. 本文は本人が選ぶ入力で始める。担当が無断で本人記録を抽出せず、故障注入や大量生成は合成／隔離環境を先に使う。

成果：本人が必要版を特定して通常操作を行える短い手順。準備不足・コード不足と、準備完了後の端末操作待ちを別記する。

<a id="task-p-03"></a>
##### P-03：通常private保存と同じPieceの再読を閉じる

source owner：

- screens/InputScreen.js
- screens/input/InputPieceActionArea.js
- features/piece/PieceCreateController.js
- features/piece/pieceApi.js、piecePreviewModel.js
- components/piece/PiecePreviewModal.js、PieceVisualCard.js
- features/piece/pieceRenderer.js／pieceLayout.js
- screens/PieceOwnerHistoryScreen.js、features/piece/PieceOwnerHistoryController.js
- API ai/services/ai_inference/api_piece_v2.py、piece_v2_preview_service.py、piece_v2_save_service.py、piece_v2_owner_service.py、piece_v2_store.py

通常操作：

1. 原入力を通常画面で保存し、保存済み入力の既存Piece入口を開く。原入力保存成功をPiece本文成功に従属させない。
2. source-ref GET→preview POSTで本人が選んだ元入力を使用。ref取得・preview要求の本人、元request／key、tier／capabilitiesを照合する。
3. 正文と画像を確認。previewの同ID／revision／3hash／renderer／期限、同mount・displayToken・current fitが揃う時だけ「保存」を提供する。
4. 明示private保存。POST /emotion/piece/saveはpreview_id、expected_preview_revision、piece_text_hash、content_payload_hash、visual_recipe_hash（private既定）と同一保存keyを送る。本文・recipe・client fit自己申告は送らない。
5. 保存receiptのpiece_idがpreview_idと一致、lifecycle=saved、消費identity、row_version、saved_atを確認。previewの作り直しで成功を代用しない。
6. 保存後の本人詳細へ遷移しGET /emotion/piece/{piece_id}で再取得する。
7. 「履歴に戻る」→一覧GET /emotion/piece/history→同じPieceを開く。通常Piece入口→Nexusの「自分のPieceを開く」からも本人専用履歴へ到達する。
8. preview／保存record／詳細／履歴／renderer入力の本文・payload・recipe・3hash・rendererが同一であることを確認する。保存後のsource再生成は行わない。

成果：同一recordの一往復と、本文・画像の確認結果。public議事録へは成功／失敗／版と非内容情報だけを記録する。本人ケースの原文・record識別子・個別hashは公開しない。実確認のためのinstrumentationが足りなければ、既存private test／transportの照合で足りる範囲をまず使い、新常設ログを増やさない。

完了条件：本人Authの通常保存と再読の両方が成功し、別record・旧DTO・合成sourceへのすり替えがないこと。API200や保存toastだけでは完了にしない。

<a id="task-p-04"></a>
##### P-04：取消・期限・不明応答・本人切替を同じ保存単位で確認

現物の再利用：PieceCreateController、InputPieceActionArea、pieceApi、PieceOwnerHistoryController。関連既存検査はtests/piece-v2-initial-save-host.test.js、piece-v2-initial-save-modal.test.js、piece-v2-saved-input-host.test.js、piece-v2-source-ref.test.js、piece-v2-owner-history.test.js、piece-v2-runtime.test.js、piece-v2-contracts.test.js。

確認条件：

- 保存の二重押し：同一候補の消費・record確定が一回。別保存keyを自動発行しない。
- commit後ACK喪失・503・通信切断：自動新規保存ではなく「同じ保存要求で結果を確認」。receipt再取得をpreview期限切れ・再描画・現在fit不足で妨げない。別key／別previewで復元しない。
- 取消：明示DELETE /emotion/piece/preview/{preview_id}は同ID／revision。結果不明は同じDELETEだけを明示再試行。closeはserver取消ではない。取消後に元POSTを復活させない。
- preview TTL600秒：期限後に古いfit／tokenで保存しない。一方、保存済みrecordはpreview TTLへ従属させない。
- renderer構築／fitの元8秒とpreview TTL600秒を区別。8秒後の未完成描画は採用しない。期限内に完成したsaved画像は構築用8秒の経過だけで消さない。
- 画像設定：theme／aspect／brandingのcapabilities内選択をPATCH。正文・payload・renderer・expiryは不変でrecipe/hash・revisionを更新。応答不明は同じ元POST／request/keyで最新previewをread-only回収し、PATCHを自動再送しない。
- 古いrevision：画像変更前の保存／取消callbackとfitを拒否。
- logout／account切替／background／画面離脱／unmount／flag refresh：古い結果を別ownerや新画面へ採用しない。fresh runtimeに復帰しても自動生成しない。
- 保存上限／tier変更／source失効：成功扱いせず、元入力保存とは分離する。課金・所有・削除を実本人で故障注入しない。
- owner削除は既存実装を使うが、実本人recordの削除は明示選択後だけ。外部画像回収不可・保存回数非返還を表示し、応答不明は同key／versionで確認。

成果：ケースごとの開始状態・操作・期待・実結果・残った原因。通常本人端末で確認する少数の操作と、隔離環境で故障注入する条件を分ける。成功件数を重複加算しない。

<a id="task-p-05"></a>
##### P-05：export OFFをsourceから解消する具体案

今回の現物確認で判明した依存：API app.py:create_applicationはpiece_preview_configurationをcreate_piece_preview_application(**...)へ転送する。現piece_v2_runtime_control.pyのfactory引数にはpreview／save／owner_read／owner_deleteしかなく、export_requested／export_readyは存在しない。従って現行commandへexport=trueを足すだけでは有効化できない。

次に具体化する差分案（未実装）：

1. 既存factory内でexportのstrict requested／readyを受ける最小接続と、既存resolve_piece_feature_flagsのowner_read依存を使う案を作る。新しいfactory／env parser／controllerを作らない。
2. default app:appと引数省略時OFF、非Piece route、private4、public3を維持する。exportだけを有効にする案ならpublic feed／visibilityを同時に開かない。
3. exporter readinessの既存PCE-7条件、iOS署名版のnative依存・同一画像確認、本文非送信を対応させる。Mash承認やflag trueそれ自体をtechnical readinessにしない。
4. 既存test_b14a_piece_v2_runtime_control.py、test_b14a_piece_preview_composition.py、test_b12_shared_preview_composition.pyでstrict bool／未指定OFF／owner_read停止時export false／bootstrap同値を確認する具体案を作る。
5. 配置候補は稼働3577を土台に当該差分だけを含めるか、現在開発版採用の影響を根拠付きで選ぶ。未配置Emlis／Analysis等をついでに有効化しない。
6. source、限定CI、起動command全文・期待するeffective8flag、対象service／commit／回復手順まで準備し、必要な個別配置判断へ出す。今回議事録だけで配置しない。

完了条件：コード準備／限定検証／配置／bootstrap実効化を別段階で記録する。source成功段階では「実Photos／Share可能」としない。

<a id="task-p-06"></a>
##### P-06：通常本人詳細から実OSへ同じ画像を渡す

source：

- screens/PieceOwnerHistoryScreen.js
- components/piece/PieceExportCanvas.js／PieceVisualCard.js
- features/piece/pieceExport.js／pieceRenderer.js／pieceLayout.js
- patches/react-native-view-shot+5.1.1.patch
- patches/@react-native-camera-roll+camera-roll+7.10.2.patch
- patches/react-native-file-access+3.2.0.patch
- ios/tempCocolon/Info.plist、AndroidManifest.xml等は必要差分を実物で特定（未確認pathを変更済みとしない）

手順：

1. 保存済み本人詳細で「画像の保存・共有を準備」。fresh detail GET結果が画面recordのID・row_version・3hash・rendererと一致する時だけ採用。
2. 同じ保存recordの全canvasを構築。背景／枠／本文／段落／brandingを含める。bitmap token／bindingをcapture前後に照合する。
3. 「写真に保存」：iOSは既存add-only native経路でsaved=trueを確認。写真への実追加が完了後、local cleanup失敗やruntime変更があっても保存済み事実を失敗に変えて再試行させない。
4. iOS写真権限の初回許可／拒否／再設定後を確認する。写真ライブラリの全読取権限を要求しない。
5. 「画像を共有」：share sheet表示、明示取消、選択して閉じる経路、native失敗、背景化を確認。共有先への最終配送成功は保証しない。
6. iOSは実sessionの完了／取消が確認できた後だけ渡した一時copyをcleanup。結果不明時・reader使用中に消さない。
7. AndroidのShare成功はtarget選択時に解決し得るため、配送完了とせず、その時点でcopyを削除しない。現在の実装は保持する。この保持copyの後日の回収条件は別残差として明示する。
8. 写真保存前のPNG signature／寸法／SHA照合、capture token違い、画像差替え、owner／flag／画面変更、重複操作を隔離testで確認する。
9. nativeへ渡す前の一時rawとexport copy、handoff後のcopy、写真へ確定した外部画像を区別する。内部private化／削除で外部画像を回収できるとは表示しない。

成果：実OS操作結果と、保存画像の欠け・重なり・反転・本文一致。iOS／Android、許可／拒否／取消／不明、cleanup成功／保留を別記する。backend正式receiptが未接続でもcandidate metadataを正式receiptへ格上げしない。

<a id="task-p-07"></a>
##### P-07：Android新版を成立させる

実装上の出発点：pieceRenderer.jsの新bitmap supplierとrenderBitmapCanvasはiOS限定。android/app/src/main/java/com/anonymous/cocolonmvp/piece/PieceTextMetricsModule.javaには現在renderBitmapCanvas／releaseBitmapCanvas相当がなく、既存source compileは新版bitmap完成ではない。

具体化する作業（現段階は設計案）：

1. Androidの既存計測／raster／UIManager接続、font／glyph／B9行選択／clip／brandingを読む。iOS版renderer名をAndroidへ流用しない。
2. 既存RN-first設計の範囲で、Androidで検査した同一画像を表示／captureする責務、immutable画像の寿命、window／世代／owner失効、資源上限を設計する。
3. renderer identityと保存後の再現性・iOS保存recordをAndroidで開く場合の対応を明確にする。旧recordのrendererや正文を黙って書き換えない。
4. Android bridge／view登録／JS caller／Gradle・既存依存／view-shot patchの正確な変更pathを固定する。新依存が必要なら既存ownerで比較し、黙って追加しない。
5. 単体source compile→実Android app build→emulator描画→実端末の保存／再読／Photos／Shareの段階を分ける。現行iOS CIの成功を代用しない。
6. APIの単一renderer供給を両OSへどう適用するかも同じ設計差分に含め、deviceからの自己申告版を無検証で採用しない。
7. Android29未満のWRITE_EXTERNAL_STORAGEと29以上の保存、共有target選択・取消・中断・copy保持を現対応範囲で検証する。

成果：実行可能な最小Android案と必要判断、段階別結果。10/31までの完成工数は未計測と残し、iOS版だけを「両OS完了」にしない。

<a id="task-p-08"></a>
##### P-08：三形式とプラン別操作、未接続の形式選択

現契約：Free=fixed/short_essay、Plus=automatic、Premium=eligible_choice。eligible_formatsで適格とされた形式だけを使う。theme／比率／brandingもcapabilities内に閉じる。

現source：InputPieceActionAreaはrequested_format:nullを生成。pieceApi.jsはrequested_formatを受理できるが、現preview PATCHはvisual_selectionだけで、形式を変更しない。components/piece/PiecePreviewModal.jsのtheme／aspect／brandingと形式選択を混同しない。

作業案：

1. short_essay／quote／declarationそれぞれで適格な合成sourceを用意し、なぜその形式が成立するか原文・format planで説明する。
2. Freeでquote／declarationを強制したり、Plusへ手動形式変更を約束したりしない。
3. Premium形式選択について「初回requested_formatを選べる接続」と「受領previewからの形式変更」を別に具体化する。後者を既存visual PATCHへ混ぜない。
4. 同候補の形式変更が新生成／新key／取消／quotaにどう対応するかを既存正本と照合し、未定の契約を担当だけで決めない。保存後のtext／format／recipe変更はnew recordで、既存recordのin-place mutationはしない。
5. 各形式の通常保存／履歴／再描画／書出しを同一本文で検証する。420文字条件を全形式に押し込まず、既存形式別最大・eligible条件を使う。
6. 4:5／9:16、各theme、branding有無、Unicode／結合文字／ZWJ／Arabic等は適格なtierと既存catalogの範囲で確認する。

成果：操作可能な範囲と未提供が画面・API・保存で一致する。全3形式を1形式へ縮めて週目標達成としない。

<a id="task-p-09"></a>
##### P-09：本文と画像を商品として読む

1. 本人source→意味→plan→実正文で、本人の考え・価値観の核、否定・時点・留保・主体・関係が保たれるか確認する。
2. 単独で他者に伝わる文章になっているか、原文の復唱／分類名／不要な長い反復／推測補完が中心ではないか、各形式の目的に合うかを読む。
3. 感情選択だけから本文にない理由・原因・強度を補わない。Emlis生成文／Analysis推定を本人sourceへ逆流させない。
4. 現V2 source adapterはoriginal＋normal／pre-question中心。refined／本人opt-in補足は未対応。入力を連結して接続済みにせず、未対応を明示する。
5. 全文確認→画像の改行・余白・欠け・branding確認→保存再読でも同じ内容を確認する。一般品質の不足をrenderer試験成功で相殺しない。
6. 明白な不足は華恋が原因ownerへ戻して修復前後を読む。低品質の合否判断をMashへ押し戻さない。正式商品受入れは華恋／subagentの機械成功で生成しない。

成果：形式別の改善・未改善・未提供、原因、次の一修復。CMEE P4原文保持とこの通常商品本文品質を別扱いにする。

<a id="task-p-10"></a>
##### P-10：Nexus公開・旧Q&A切替（B12-A/B/C、M5）

既存設計の候補pathは、実装済みpathとは区別する。API666b285のtreeにはapi_nexus_piece_v2.py／piece_v2_public_service.pyがなく、RNには旧screens/nexus/NexusPieceCard.jsがあり、新components/piece/NexusPieceCard.jsはない。既存Nexus owner履歴入口があることを新public feed完成へ読み替えない。

準備順：

1. B12-A：既存piece public/access/store ownerを読み、新public/Nexusのsource責務を確定。候補new pathはai/services/ai_inference/api_nexus_piece_v2.py、piece_v2_public_service.py、ai/tests/piece_v2/test_b12a_piece_v2_nexus_api.py（現時点未作成の設計名）。
2. B12-B：lib/nexusApi.js、screens/NexusScreen.js、現screens/nexus/NexusPieceCard.js、contracts／normalizersを調査し、新canonical recordだけを読むcardへ切り替える最小差分を作る。
3. 本人／フォロー／特定相手、visibility、private／deleted／不存在の同一404、現在viewer関係を毎読取・共鳴で再照合。private保存はNexus投稿／通知ではない。
4. B12-C：app.py、api_contract_registry.py／PUBLIC_API_REGISTRY.md、api_piece_compat.py、旧api_emotion_piece.py／api_piece_runtime.pyのPiece登録、RN旧InputPiecePreviewController・EmotionPiecePreviewModal・emotionPieceApi・tutorial callerをfreshに走査し、実際の到達経路を特定する。
5. 既に候補compositionで除去した旧publish/cancel4routeを再実装しない。Nexus／tutorialを含む旧経路全体は別に閉じる。
6. M5 packetでnew generation／preview／save／history／Nexus／exportを同一backend/RNで成立させ、旧Q&A entry／generation／cardを到達不能にする。public.piecesの旧caller exact0と新projectionへの切替を確認する。
7. private→public→非公開、follow解除／owner切替／削除、feed／detail／共鳴／再書出し、cache残存、cold start／tutorial resetを確認する。
8. 設計にあるclean-cutover SQL名（20260808_005_piece_v2_clean_cutover.sql）は未作成の候補。既適用の20261010_005_quota_readと別物。必要性・fresh catalog・依存と正確なSQLを具体化するまで「適用する」と確定しない。

成果：新旧混在なしの公開packet、未解決caller、変更source／DB／flag／配布、停止時の表示を具体化。M5の承認・実配置はこの文書で成立させない。未準備publicをprivate一往復の追加前提にも戻さない。

<a id="task-p-11"></a>
##### P-11：backend export receipt（B13-B）

現物：RN pieceExport.jsはcandidate metadataを返すが、コメントどおりformal receiptではない。API666b285のapi_piece_v2.pyにexport-receipt routeはなく、設計上の新service/testもtreeに存在しない。

次の具体化：

1. PCE-5／PCE-7の既存receipt契約からfield・outcome・所有・保存要否を確認する。candidateのpiece_id=public_id等を未検証でserver schemaへ流用しない。
2. 候補ownerは既存PCE-8指定のpiece_v2_export_receipt_service.py／test_b13b_piece_v2_export_receipt.py、api_piece_v2.pyへのPOST /emotion/piece/{piece_id}/export-receipt。未作成の提案として記載する。
3. serverでowner・current record／hash・利用可否を再確認し、本文・画像bytes・local URI・共有相手を保存しない。画像はderived artifact、本文正本はsaved recordのまま。
4. 写真確定・share取消・share sheet結果・実配送未確認を区別し、未知結果から「共有成功receipt」を作らない。
5. receipt通信失敗で外部写真保存を取り消せた扱いにせず、明示再試行の重複抑制を既存契約で具体化する。
6. receiptを保存するDB ownerが現設計／schemaで足りるか確認し、追加migrationが必要なら正確なDDLと権限まで準備して別の判断範囲にする。

完了条件：契約・実装・隔離検証・稼働接続・RN結果との対応を分けて記録。未接続の現段階を正式receipt成立にしない。

<a id="task-p-12"></a>
##### P-12：旧native19失敗、公開前の残差、M6〜M8

- tests/native/piece-text-metrics-ios.mm／piece-rn-canvas-ios.m／piece-rn-canvas-entry.js／piece-rn-canvas-fixtures.cjsの旧V4群19FAILと新bitmap群を実assertionから区分する。失敗期待を削ってGREENへしない。旧prototypeを正式に廃止するなら到達caller・旧保存版・新方式の受入れと既存契約を確認した具体案として判断する。
- 既存CI39780623108の総合failureは保持する。新sourceや新承認なしに旧CIを再実行しない。一方、旧方式の診断修復を無期限に続けてP-W1を止めない。
- M6のbody-free旧identity captureは新flowの検証後。M7旧データ破壊cleanupは独立した明示判断が必要で、M5初回配布と一緒に実施しない。
- M8 obsolete route／wire／table制約／indexの廃止は依存を確認して実施する。shared mymodel_reflectionsや非Piece readerを一括削除しない。
- rollbackは新機能を明示停止し、旧Q&Aを復活するsilent fallbackにしない。本人履歴／削除等の回復経路を保持する。
- 10/31に「通常private一往復」「iOS実export」「Android」「三形式・本文」「public/M5」「receipt」「旧失敗・廃止判断」を個別判定し、各未達の具体原因と次の一手、11月結合枠／12/18公開への影響を残す。

#### 既存検証の再利用方法（今回未実行）

RNの現workflow .github/workflows/piece-rn-contracts.yml はNode24と既存TypeScript5.2.2を検査用disposable directoryへ用意し、次の13suiteを実行する。これは現物にあるcommandで、新たなrunner作成案ではない。

```text
node --test tests/piece-v2-contracts.test.js tests/piece-v2-state-models.test.js tests/piece-v2-preview-display.test.js tests/piece-v2-runtime.test.js tests/piece-v2-feature-disabled.test.js tests/piece-v2-saved-input-host.test.js tests/piece-v2-source-ref.test.js tests/piece-v2-input-screen.test.js tests/piece-v2-owner-history.test.js tests/piece-v2-renderer.test.js tests/piece-v2-measured-wrap.test.js tests/piece-v2-export.test.js tests/piece-v2-initial-save-modal.test.js
```

initial-save-host.test.jsも既存であるが、上記13suiteへ自動で含まれると仮定せず、変更対象なら現在のimport／実行範囲を確かめて選ぶ。native実RNは既存bash tests/native/run-piece-rn-canvas-ios.sh、単体source／export library工程も同workflowを使う。署名・TestFlight workflowとは別であり、描画CIから自動配布しない。

APIは既存.github/workflows/piece-b2b-isolated-postgres.yml（Python3.12、既存requirements、disposable Postgres）を使い、変更に応じた既存集合を選ぶ。今回の追加runtime検証先はtest_b14a_piece_v2_runtime_control.py／test_b14a_piece_preview_composition.py／test_b12_shared_preview_composition.py。保存・取消・期限ならtest_b06_piece_v2_save_api.py、test_b05_preview_visual_mutation.py、db/test_b05_preview_cancel_http.py、db/test_b12_shared_preview_native.py等の現物へ戻る。未作成B12/B13 testを実行済み／成功済みとしない。

毎回、sourceを反映・読戻してから、そのscopeで許された検証と実出力を確認する。検証数を足し上げて商品完成率にしない。今回文書化のためのCI起動・DB／本番・本人操作は0。

<a id="details-common"></a>
### 8.4 購入・本人切替・visibilityの共通修復 — C01/C02/C03

#### 確認した現物と因果

| ID | source owner・現在の位置 | 確認した欠陥 |
|---|---|---|
| C01 | `lib/iap/iapService.js` `finishTransactionSafe` L432〜446／`syncPurchaseToSubscriptionTier` L486〜539／purchase observer・requestSubscriptionForPlan | modern finish失敗→legacyも失敗、の両失敗を飲み込みresolve。呼出し元はAPI同期後にfinishをawaitしてdone／ok:trueへ進む。同購入がprocessing中でもok:true skipped:trueを返す。 |
| C02 | `SubscriptionContext.js` `refreshTier` L165〜237／auth state change L277〜303／TTL・inFlight refs | Aの取得中にBへ変わってもAのinFlightを共有し、Aの応答でtier／有料情報／mode／TTLを上書きできる。成功だけでなくcatch・finallyも本人世代を確認しない。 |
| C03 | API `ai/services/ai_inference/api_public_profile.py` `register_public_profile_routes` 内GET `/public/profile/by-share-code` L49〜140、privacy読取L81〜108 | privacyの初期値がprivate=false／code公開=true。visibility HTTP失敗時にdefaultを保持し、profile本文へ進む。今回実漏出を観測したという主張ではない。 |

追加の再利用先：

- `lib/apiClient.js`には既に`getAccessToken(expectedUserId)`→`buildCompatHeaders`→`apiFetch`の本人一致確認とsignal／timeoutがある。新しいtransportは不要。
- `lib/subscriptionApi.js`の`getSubscriptionMe(opts)`・`postSubscriptionUpdate(payload,opts)`はoptsをそのまま既存clientへ渡せる。
- `screens/account/useAccountSubscription.js`は同期・refreshの成功後に「復元が完了しました」と出すため、serviceのfalse successがUIへ到達する。
- API `api_account_visibility.py`の`_get_or_create_settings`はHTTP失敗を502、正常に行がない場合だけ初期化、と分けている。public resolverがservice roleで利用者設定を新規作成する変更へ流用しない。
- 公開設定のschemaはfriend/share互換名を持ち、既存defaultのpublic/非private自体は既存設計である。**取得失敗を公開の証明にする問題**と**正常な未設定行の扱い**を分ける。

<a id="task-c01"></a>
#### C01 — finish／ack完了の偽成功を閉じ、同購入の回復を保つ

目的：storeの購入完了処理が未確認なのに「購入・復元完了」へ進まない。APIで既に成立した権利を、finish失敗だけでクライアントが取り消す変更はしない。

| 作業ID | 具体作業 | 終了時に残す証拠・判定 |
|---|---|---|
| C01-01 | actual installed `react-native-iap`版をlockfileとiOS/Android導入版で固定。packageは`^13.0.4`なのでpackage宣言だけで実native署名を断定しない。現modern→legacy呼出しの適用範囲と、各OSのack/finish責務を既存phase3/4資料・sourceへ照合。 | 対象版・両OS・対応署名・既存fallbackを保持するかを一枚で特定。ライブラリ更新を修復の自動前提にしない。 |
| C01-02 | `finishTransactionSafe`でmodern成功／legacy成功／両失敗を区別。両失敗を呼出し元へ伝える最小案を作成する。成功・失敗の内部結果または例外を選び、既存exportの戻り値・UI契約への影響を説明。元例外を保持するがreceipt／purchase tokenの値を新ログへ出さない。 | 両失敗でresolve-successにならず、`done`を書かない。modern成功時はlegacyを余計に呼ばない。 |
| C01-03 | `_purchaseProcessingState`の`processing`と`done`を分離。同購入の重複通知・直接purchase戻り・restoreが重なったとき、処理中を即ok:trueにしない。既存Map内で同一進行Promiseの結果を待合せする等の最小案を評価し、状態を新常設queueへ拡張しない。 | 二つのcallerが同じ最終成功／失敗を受ける。同購入のAPI同期・finishを競合二重実行しない。`finally`やcatchが別世代の進行entryを消さない。 |
| C01-04 | API同期成功→finish失敗時を「権利同期済み／store完了処理未了」と内部で切り分け、同じ購入識別での再通知・明示復元・再起動後回復へつなぐ。finishをAPI検証より前へ移さない。 | 再試行に新購入を要求しない。API再送が必要な場合は同purchase情報・既存server ownership/重複処理を保ち、二重付与しないことを別途確認。API反映済みの権利をローカルでfreeへ偽装しない。 |
| C01-05 | `startIapPurchaseObserver`、`requestSubscriptionForPlan`、`useAccountSubscription.onRestorePurchases`の最終表示・refresh条件を追う。未完了を「購入なし」や「課金されなかった」へ変えない。observerの例外を単にconsoleへ落として回復不能にしない最小扱いを具体化。 | finish未了で成功Alertを出さず、busyを解除し、本人が同購入の回復へ戻れる。storeの支払キャンセル・pending・同期失敗と区別できる。 |
| C01-06 | C02の本人境界を使い、API同期の送信先と完了表示を購入開始／回復時の本人へ束縛する必要範囲を点検。既存`appAccountToken`／Android obfuscated ID／server ownershipを維持。 | A購入の進行中にBへ切替えてBへ権利同期・成功表示しない。別人購入の再割当は許可しない。owner不足を推測で補わない。 |
| C01-07 | 限定検査→既存回帰→必要版build→実store検証の順で閉じる。 | 下記機械条件と実store条件を別々にPASS/未実施と記録。 |

C01の必要な失敗・回復検査：

1. modern成功：legacy0、API→finish→doneの順序、ok:true。
2. modern失敗・legacy成功：fallback1回、成功を返しdone。
3. 両失敗：最終失敗伝達、done0、UI成功Alert0、busy解除、同purchaseの再試行が可能。
4. API失敗／401／所有者不一致：finish0、done0、API原エラーを保持。「購入なし」へ変換しない。
5. API成功→finish失敗→同purchase再通知成功：最終成功へ回復、二重権利付与なし。
6. 同purchaseのobserverと直接戻り／restoreの同時到来：同じ進行処理へ待合せし、先行が失敗したのに後行だけ成功しない。
7. 異なるpurchaseの並行、同transactionの再通知、接続失敗、user切替、unmount／再mount、プロセス再起動後の未完了transaction再配信。
8. 既存の認識SKU・Android basePlan・upgrade・真正な購入履歴なし・store取消／pending・期限切れ／復元を壊さない。対象外SKUはfinishしない。

既存test：

- `tests/iap-restore-purchases.test.js`はチェックイン済みserviceとaccount callerをNodeで実行し、store取得失敗／真正な空配列／SKU優先／失敗後再取得／UI表示を検査する。今回修復後も再利用する。
- 同testの`createService`ではfinishが常に成功stub、exportは`restoreAvailablePurchases`だけであり、両finish失敗・sync本体・同purchase待合せをまだ検査していない。既存source-loaderを再利用し、実`syncPurchaseToSubscriptionTier`を動かす追加対象を用意する。test本数目標を作らず上記の状態遷移を覆う。
- API `ai/tests/test_subscription_projection.py`は権利期限・expired・profile有料だけでは昇格しない条件を確認する回帰候補。ただしstore updateの重複送信やack成功の証明には使えない。
- `tests/rn-screen-contracts.test.js`のaccount subscription節は主にsource文字列の接続確認であり、失敗・競合・復元の動作証明の代替にはしない。

後段の実store条件：用意済み版でiOS sandbox／Android license test等の適切な試験環境を使い、新規購入、復元、pending/取消、更新・失効、未finish再配信と再起動回復を検証。人工のfinishエラー注入と実storeの課金発生を区別する。今回の文書作成で実購入・署名配布の承認は成立していない。

C01完了：対象source/testが必要回帰を通り、同購入の失敗→回復と本人境界が一致し、必要配布版の実store結果が揃う。機械修復完了と実store未確認を分ける。未決：最終失敗の内部結果／例外型、既存画面文言の最小差分、正確なnative導入版、API同購入再送の既存保証範囲。

<a id="task-c02"></a>
#### C02 — account切替後の旧subscription応答とcacheを遮断する

目的：Aのtier・mode・有料情報をBまたはlogout後へ適用せず、Bの正しい取得もAの後始末で消さない。`subscription/bootstrap`は現clientでauth:falseの共通catalogなので、本人tierと同一のprivate ownerデータとして不必要に再設計しない。

| 作業ID | 具体作業 | 終了時に残す証拠・判定 |
|---|---|---|
| C02-01 | providerの初回session／auth change／foreground／purchase後force refreshの入口を整理し、owner id＋認証世代を既存provider内で保持する最小案を作る。A→B→Aを同じowner idだけで許可しない。token refreshだけの同一人物を切替と混同しない。 | どのeventでowner世代が変わるか、logout・session取得失敗の状態が定まる。新account subsystemを作らない。 |
| C02-02 | `refreshTier`開始時のowner・世代を捕捉し、`getSubscriptionMe({expectedUserId: ownerId, signal})`等、既存apiClientの本人束縛を利用する。最初のsession取得と実header作成の間で切替わる場合も送信を防ぐ。 | A用refreshがBのtokenで送信されず、無session／不明ownerは取得を成功扱いしない。public APIのpayload追加や新auth方式は不要。 |
| C02-03 | 同一owner・世代内だけTTL／inFlightを共有。切替時は旧cache・lastFetchedAt・mode・planCode・entitlementStatus・expiresAt・autoRenew・store・productIdを失効し、新ownerは未知／再取得状態へ置く。旧通信は既存AbortControllerで中断可能なら中断し、応答無効化を独立して必須にする。 | BがAの10秒TTLやPromiseを利用しない。abort非対応／abort後到着でもA結果を採用しない。 |
| C02-04 | `try`の成功だけでなく`catch`のreset／fallback、`finally`のloading、外側finallyのinFlight解放、lastFetchedAt更新すべてを捕捉世代・entryに束縛。 | Aの成功・失敗・finallyがBのtier／情報／loading／新inFlightを変更しない。old entryの削除はentry identityが一致する場合だけ。 |
| C02-05 | `ensureTier`／`ensurePaid`／`ensurePremium`、context valueの`pieceEffectiveTier`、account表示のunknown→free等の既存投影を確認する。owner未確認中に前のpaidを使わせない。 | A premium→B free／unknownの切替で有料featureを一瞬でもA由来で許可しない。同ownerの一時通信失敗時の現行fallbackは別のポリシーとして維持／判断対象化する。 |
| C02-06 | 実sourceを通すdeferred Promiseの順序検査、既存screen接続回帰、必要配布後の2account切替を行う。 | 下記競合条件が成立し、最終表示だけでなく途中のtier/mode/loading/refsの不正適用がない。 |

C02の必要な順序・owner検査：

- Aの`/me`開始→B login→B取得成功→A成功／A失敗／Afinally、各順序でBを保持。
- A開始→logout→A成功／失敗：logout状態へpaidを復活させない。
- A1開始→B→A2開始→A1返却：user idが再びAでも古い世代は採用しない。
- A取得中のB force refresh：A Promiseを返さずB専用requestとなる。Aの後始末でB inFlight／loadingを消さない。
- 同owner・同世代の並行refreshは既存dedupeを維持。10秒TTLは同ownerのみ、forceはTTLを越えるが別ownerの進行処理は共有しない。
- session取得中にowner変更、header取得中にowner変更、HTTP abortが効かず旧応答到着、unmount後の各callback、foregroundイベントとauth eventの競合。
- API401・timeout・malformed tier・allowed mode欠落等で、Bの状態へAのfallbackを混ぜない。
- 同owner token更新では必要以上にtierを消さず、新tokenの本人一致を維持。通信取消の例外でUIの有料権利が根拠なく増えない。
- 通常購入・復元からのrefreshとaccount hookが、最終current ownerの同じ状態を表示する。

既存test再利用／不足：`tests/iap-restore-purchases.test.js`のsource-loaderとhook caller差替え方式、`tests/rn-screen-contracts.test.js`の接続回帰を再利用できる。今回読取範囲ではproviderのauth世代・deferred競合を直接覆う専用testは未確認。既存Babel／Node依存だけで実providerを動かしauth/AppState/APIを制御する最小testを用意する案とし、新renderer/runtime/依存の導入を自動前提にしない。loaderが実装を再現する別providerを作る方式は採らない。検査用doubleと実React/native試験の限界は明記する。

C02完了：owner世代がsend／response／error／cleanup／cacheまで一貫し、旧ownerが新ownerの状態を変更できず、実2accountでlogin/logout/foreground/購入後refreshの必要経路を確認。機械条件と本人端末条件を別記。未決：同owner通信失敗のpaid維持方針を変更する必要があるか、session取得失敗のUI表示、既存auth event順序・起動版。今回の欠陥修復に不要ならpolicyは変えない。

<a id="task-c03"></a>
#### C03 — visibility取得失敗で公開profileへ進む経路を閉じる

目的：公開許可を確認できないとき、氏名・接続コード等を公開相当のdefaultで返さない。本人設定や既存公開APIの正常時shapeを勝手に変更しない。

| 作業ID | 具体作業 | 終了時に残す証拠・判定 |
|---|---|---|
| C03-01 | public resolverとaccount visibility正本、Web共有landing／RNのID検索callerを照合し、HTTP失敗、network exception、invalid JSON、row無し、field無し／null、正常falseを別状態へ分類。現実装ではJSON parse例外等も未整理である。 | 「取得失敗」と「正常に設定未登録」を一つのdefaultへまとめない。正本で決まっているdefaultを再質問しない。 |
| C03-02 | 最小案として、visibility HTTP非2xxと取得不能を既存APIのupstream failure系（候補502）へ返し、成功profile本文へ進まない具体差分を作る。request timeout／接続失敗／JSON shape不正にも公開を許可しない。 | 各失敗でprofileのdisplay_name・connect_code／myprofile_code・share/friend_code等の非公開値をresponse・error detailへ含めない。正常public/private返却は同shape。 |
| C03-03 | visibilityの正常空行／user_id欠落／必要field無し・nullの扱いを、既存DB初期化・backfill・schemaと照合。defaultを採用する場合も正常成功の証拠と正本根拠が必要。公開resolverから設定を作成するwriteを追加しない。 | 未登録defaultの変更が必要なら、変更対象・理由・影響・空行/失敗の具体案をMash判断へ分離。未承認で全利用者のprivacy policyを切替えない。 |
| C03-04 | share-code非公開なら既存anti-enumerationの404を維持。private accountなら既存通りdisplay_nameとconnect/myprofileをnullにし、public accountの正常payload、share/friend等互換名とrouteを保持。 | 修復で非公開accountの存在・private設定の内容を新たなerror messageにしない。route rename／公開項目削減・追加を混ぜない。 |
| C03-05 | API mini-appで実register関数へroute登録し、httpx/upstreamだけをdoubleにした失敗検査を追加。RN ID検索とWeb landingの502/timeout表示・retry・OGを確認する。 | upstream失敗を「その人は非公開」と断定せず、先行公開profile cacheを新しい公開許可として再使用しない。クライアント側も失敗でprivate情報を埋めない。 |
| C03-06 | API限定回帰→承認が必要な公開失敗契約差分の判断→対象版配備→匿名clientのpublic/private/hidden/故障確認を順に閉じる。 | source合格・配備・匿名実利用確認を区別。実故障注入で本人データを公開せず合成account/隔離環境を優先。 |

C03の必要なAPI検査：

1. profiles失敗→現行502、profiles真正空→現行404、公開routeやfield aliasを保持。
2. visibility200＋public明示→従来正常payload。
3. visibility200＋private明示→display_name/connect/myprofileがnull。
4. visibility200＋share-code公開false→従来404で識別情報なし。
5. visibility401/403/404/429/500等→公開payload0。特に404を「設定行が無い」と推定しない（REST query成功空配列とは別）。
6. timeout／接続例外／invalid JSON／非list／非object行／user_id欠落／boolean以外／null／必要field無し／正常空配列の各扱いを明示。正常未登録・nullを既存defaultで受けるかは正本照合後の判断内容に従う。
7. 一度public成功→次回visibility失敗→再試行正常private、の順で古いpublic応答やOG/caller cacheを許可根拠として復活させない。
8. 失敗ログ・error detailにsecret・upstream生response・本人profileを新規転載しない。サービスrole利用・認証ヘッダ・DB書込を増やさない。

既存test：今回の現行ファイル名一覧・対象読取ではpublic resolver専用testを未発見。全test内容を総当たりして「存在しない」と断定はしていない。実装前に既存router/httpx testの最小harnessを再利用可能か確認し、候補`ai/tests/test_public_profile_visibility_failure.py`等でactual `register_public_profile_routes`を検査する。Emlis用のvisibilityという名前の既存検査はこのaccount公開routeの代替ではない。新DB・実service role・外部通信は不要。

C03完了：許可不明の各失敗で公開情報が出ず、正常public/private/hiddenと互換shapeは維持され、関係callerの回復・対象版配置確認が揃う。**502等の失敗契約・空行/不正設定時の公開扱いを変える差分は、現在の文書詳細化で承認済みにしない。** 必要具体案を作った段階で保護境界に関する判断を分離する。

#### 共通の順序・依存・報告の形

- **実装の推奨順**：C02の本人束縛とcleanup条件を先に固め、C01の購入完了・回復を同じ本人境界へ接続する。C03は独立したAPI ownerで並行準備できる。3欠陥を大きな課金/identity基盤の作り直しへ広げない。
- **10/31までの管理点**：各IDを「具体差分準備／承認差分あり／source実装／限定検査／配置／配布／実store・本人確認」に分け、止まる位置を明記する。いま実工数を測ったわけではなく、全段階の10/31完成保証はしない。
- **既存公開/権利契約を維持**：serverの権利判定・store商品・価格・quota・DB schema・商品受入れ基準はこの修復案だけで変えない。private/public境界の具体差分が必要な箇所だけ個別判断とする。
- **各修復の成果物**：最初に再現した失敗、変更pathと原因、修正後の同じ失敗条件＋正常/回復/owner対照、必要回帰の範囲と既知失敗、配置/配布/実機の有無、残る1作業を既存handoff/議事録へ残す。新常設台帳や形式だけのreceiptを増やさない。
- **今回の状態**：3欠陥とも未修復。ここに作業IDがあることを実装開始・成功・署名配布・本番操作許可・追加費用承認へ換算しない。

<a id="details-analysis"></a>
### 8.5 通常Analysisの文章・図・保存・比較 — A-01〜12

#### 1. 優先順位・責任・今回の到達目標

4B学習とCMEE実接続を主枠、Piece本人保存を独立並行主枠として保つ。通常Analysisは次順位の結合枠だが、AI全体の完成待ちにはしない。華恋は版差分・合成入力での本文/保存/表示検証・対象版と端末手順を用意する。Mashの判断や端末操作が必要な地点は準備後に限定し、未準備を「本人待ち」へ置き換えない。

通常Analysisの一単位は、**期間内の本人原入力/適格補足→通常APIの既存意味処理→同じ文章/図を保存→同じ保存identityで再読→比較の有無を正しく表示**すること。P5の固定3構文・Plus・補足0・比較なしのprivate snapshot実装/905成功とは別の経路である。P5を作り直したり、その成功で通常利用の未完了を埋めたりしない。

#### 2. 最初に固定する現在地と、既存成功の保持

##### 2.1 配置/端末版の履歴を古いまま使わない

- 10/04のu128：API `1a42b9ebc25ba9765bdb17658cf47dd631d9f40d`、iOS 1.0(6401)、source `166343c0b160e787b857a7b9d407b6f0afce756d`、run37201625245は当時の空期間修正/送信記録。
- **後続10/10 §39**：不足案内API `5c8bd8e5d7f876335eb840ceee26883a030a34a5`が18:32:12 JST live。iOS source `55142229b6860b9c8195989cdddf0f218f07700a`、run38041653252のarchive/export/upload成功、採番式による1.0(6501)、18:47:24 JST TestFlight送信成功。
- **同日§40、18:51 JSTのMash報告**：「入力情報が少ないため、まだ分析を表示できません。」の本人実機表示は確認済み。端末build番号の独立照合、再表示/再起動、本文生成、内容品質、保存再読、比較成功は未確認。
- したがって不足文言の表示だけをもう一度確認するための新入力・再配置・追加操作を要求しない。次は実際の分析が成立する経路と保存再読の残件である。
- 共通APIの最後の配置記録は10/23 Piece overlay `3577d7fdeb19158ef5e675f51960652a52c24487`で、土台は5c8bd8e。今回Liveの再照会はしていない。

原記録：[API運用記録@666b285 §39 L787](https://github.com/MassyuRed/mashos-api/blob/666b28517ef04aba170ebffe3c86980fea4c11bd/ai/docs/EMLIS_DEPLOYMENT_AND_OPERATION_CHECKS.md#L787)、[本人表示報告§40 L799](https://github.com/MassyuRed/mashos-api/blob/666b28517ef04aba170ebffe3c86980fea4c11bd/ai/docs/EMLIS_DEPLOYMENT_AND_OPERATION_CHECKS.md#L799)。doc blob=`964a3b5f641673a45797a911057c1edf791bc183`。同内容は[Cocolon current map03 L147/L149](https://github.com/MassyuRed/Cocolon/blob/43143ffc6aee9e765e1a33b9d2830fe23b6ece13/Cocolon_前提資料/current_structure/03_analysis_current_structure.md#L147)（blob `c18de076fec2c2ad86f2d350296288a8f2236f7d`）に反映済み。current00のu128/6401だけで「不足案内も未確認」へ戻さない。

##### 2.2 取得した配置sourceと開発sourceの限定比較

保存済みLive記録の3577d7fdとfresh666b285を、GitHub上の同一path/blobで比較した結果：

| API path（prefix=`ai/services/ai_inference/`） | 3577d7fd | 666b285 | 判断 |
|---|---|---|---|
| `analysis_observed_service.py` | 4864821ed1e48045591a607da206408f128f36e0 | 同左 | 保存lifecycleの作り直しは不要 |
| `api_self_structure.py` | c42a85de011a72d2fbc8ab5d40c274e49af0503c | 同左 | 通常latest/status/monthlyのV2分岐は既存 |
| `astor_material_snapshots.py` | 83537a666335cf00c81676f2e13d5e96dc167c6d | 同左 | 複数ANSWER拒否も既存 |
| `cores/analysis/source_adapter.py` | 9fb6a26a3f9eab0bc140a25a15e63d111a921cc1 | 同左 | owner/period/source検証は既存 |
| `cores/analysis/intent_compiler.py` | 758c90432e0af9d825a304b57d2f0c3d7297e9d4 | 1847a05bdada3d75d22d82a0280747e2d841230d | 内容修正/後続P5追加等の差あり |
| `cores/analysis/observed_route_realizer.py` | 62191971b5245720058b864981efaac24c26d5a6 | c23c6ea7c099b9b83c0c436d2ab38eba1206ca99 | 内容表示/後続P5追加等の差あり |

これは6pathのsource比較であり、稼働serviceの新規検証や全依存差分の確定ではない。u129〜250は資料上未配置として保持する。最新APIを丸ごと配置すれば、別の未配置Emlis・P5等も入るので、**Analysisで必要な差だけと既存Piece overlayを両立した候補**の具体化が必要。共有意味ownerの差は4B接続主担当と同時編集を避けて統合する。

#### 3. 作業ID別の具体案

IDはこの議事録内の参照用で、新しい管理systemではない。全作業の実装/準備/検証/記録は華恋、商品範囲や追加効果の判断・準備済みの本人操作はMashと分ける。

| ID・優先 | 実path・最初の操作 | 検証する内容 | 完了条件・依存/未決 |
|---|---|---|---|
| **A-01：通常経路の版固定（先行）** | API `analysis_observed_service.py`/`api_self_structure.py`/`astor_material_snapshots.py`、CMEE `cores/analysis/intent_compiler.py`/`observed_route_realizer.py`。上の3577→666b差を出発点に、通常経路へ作用する変更とP5専用追加を分け、共有依存を含む必要pathを一度確定する | current map03/設計04 §3.21〜3.80、運用§39/40、候補sourceを対応。必要なら既存合成入力で変更前後の意味/本文/図を比較 | 「何を変え、何は既存のままか」「対象API/RN/build」「追加配備の範囲」が一意。latestAPI全体の無条件配置やP5だけの合格で閉じない。現環境設定2値は資料上手順報告で、独立取得済みとしない |
| **A-02：通常生成と待機/障害の区別** | API `analysis_observed_service.py::generate_saved/ensure_saved`、`api_self_structure.py`、RN `SelfStructureReportGenerateScreen.js::run`。既存testの合成recordで、成立/空期間/情報不足の3stateを同じ通常入口に通す準備 | 空期間はengine/commit0、非空だがroute未成立の厳密な組だけ `reason=insufficient_input`/`skip_reason=analysis_insufficient_input`/本文図null。HTTP/DB/権限/不正snapshot/比較失敗を「情報不足」で隠さない。force後の不足で古い本文を戻さない | 成立と不成立の意味がAPI/RNで一致。既存の不足文言表示成功は保持。新しい文字数/件数閾値や無理な文法拡張を追加しない |
| **A-03：latest保存/再読の同一性** | `analysis_observed_service.py::generate_saved/read_saved/saved_status`。既存 `test_generate_commits_and_rereads_exact_identity`/`test_http_save_latest_status_read_and_owner_binding`を起点に、通常生成時のid/`projection_of`/期間/本文/graphを採取する合成検証を用意 | GET `/self-structure/latest`→GET同入口 `ensure=false`→GET `/self-structure/latest/status`。Plus以上なら同idのdetailも照合。再読は意味engineを呼ばず、commitが増えず、本文/図/版が変わらない。Freeは最新lightのみの許可を守る | 同じ保存結果の再読を説明できる。statusはtier既定modeを選ぶので、異なるmode/期間を混ぜない。HTTP200だけで完成扱いにしない |
| **A-04：monthly履歴/詳細を別に閉じる** | API `api_self_structure.py`のPOST `/self-structure/monthly/ensure`、`api_self_structure_reports.py`、`report_artifact_read_service.py`。RN `AnalysisScreen.js`L560/`SelfStructureReportHistoryScreen.js`。合成monthly recordで生成→history→detailを追う | historyの既定 `report_type=monthly`、RNもmonthly固定。latestの行が自動でmonthly履歴へ出るとはしない。historyのidからdetailへ同じ本文/図/期間/modeを再取得し、既読idも一致。page重複/has_more/offset/旧v1混在を区別 | monthlyの同一保存identity往復が成立。latest→monthlyを新たに同一行化/導線追加する必要があるなら仕様差として具体判断。既存testでlatest rowをmonthlyへ書き換える合成例を実導線成功にしない。実期間にmonthly素材がない場合、本人記録の改変/日付偽装はしない |
| **A-05：期間比較** | `analysis_observed_service.py::generate_saved`、`cores/analysis/intent_compiler.py`/`observed_route_realizer.py`、migration `20261004041627_analysis_period_comparison.sql`。既存比較fixtureで隣接同長のcurrent/previousを用意 | previous開始=current開始−current長、previous終了=current開始をUTCで照合。COMPARABLE/NO_PREVIOUS/比較不成立を区別。材料にない改善/悪化/因果を付けない。前期間だけの訂正/削除/期限切れで比較が失効すること、前期が保持範囲外なら明示eligibilityによりcurrent単独を残すこと、DB障害では単独fallbackしないこと | API本文とRN図/「文章で読む」の比較内容が一致、保存後も同じ比較identity。比較SQLは適用済みなので再適用しない。`COCOLON_ANALYSIS_PERIOD_COMPARISON_MODE=development`の実設定/有効化は既存操作範囲を照合し、文書作成で勝手に変更しない |
| **A-06：source/期間/owner/tier/保持期限** | `astor_material_snapshots.py::_analysis_saved_member`、`cores/analysis/source_adapter.py::freeze_analysis_sources`、migration `20261003134440_analysis_observed_artifacts.sql`。既存境界testを一覧化して対象sourceが何か固定 | 原7fieldのcommitment、同owner、[start,end)内、UTCとしての保存時刻、duplicate/欠落/違うrecord_id/版、future/不正期間、100原入力上限、保持期限、Free light/Plus standard/Premium deep、Free履歴拒否/Plus deep拒否。生成文や問い本文を本人sourceにしない | 勝手な期間clip・レコード除外・source補完なしで許可/拒否を説明。100件超は暗黙の先頭100件採用で通さない。tier変更時の旧artifact可読はSQL再照合/無効化どおりで、画面ラベルだけで保証しない |
| **A-07：訂正/撤回/削除・競合・通信断** | `astor_material_snapshots.py`、`analysis_observed_service.py::_rpc/generate_saved`、2migrationのinvalidate/commit/read、既存storage tests | 原入力編集、Emlis回答の訂正/撤回、source/アカウント削除、tier変更で旧結果を復活させない。生成後commit前のsource変更/追加とlock競合、commit ACK消失を分ける。409/503を成功や空表示にしない。ACK不明時の自動再送/新生成を行わない | 結果が有効なら同一再読、無効なら旧本文/別人本文を返さず利用者が状態を判断できる。通常engineの復元とsource失効を混同しない。現SQLの短いtable SHARE NOWAITが他user書込にも競合し得る制限は隠さない |
| **A-08：複数ANSWERの未対応を閉じるか範囲判断** | 現loader `astor_material_snapshots.py`L130、pure `cores/analysis/source_adapter.py`L223、`test_analysis_saved_period.py::test_answer_binding_and_multiple_answers_fail_closed`。まず同thread0/1/2回答の現動作を合成で固定 | 2回答以上は `analysis_multiple_answers_not_supported`/`analysis_supplement_cardinality`で拒否する現実装。新しい拡張をする場合、複数回答のsource role/親版/round/順序/訂正撤回/全source再照合/保存失効を具体化。対象threadだけ除外、原入力だけ再利用、最初の1回答だけ採用をしない | 現拒否を仕様達成に数えず、Premiumの逐次問答との接続未完として記録。拡張の対象/責務/検証か、初回公開での扱いの具体判断が残る。文書のみで無断採用/廃止/コード変更しない |
| **A-09：通常RNの文章/図・閲覧権限** | `WatashiMapV2Renderer.js`/`watashiMapV2Contract.js`/`watashiMapAccessPolicy.js`、Generate/History/Viewer3画面。既存backend合成projectionをRN validator/view modelへ渡す | projection_of/period/node/edge/unknown/annotation/conflict/比較と「文章で読む」が一致。共起線に矢印を付けず、未知対象を落とさない。不正/未来/private v2をlegacyへfallbackしない。Free履歴lock/Plus deep拒否、mode不明拒否。長文/文字サイズ/明暗theme/読み上げの実描画は対象版で確認 | API DTO成功→RN model→実描画の段階を分離。iOS/Androidの両方を未確認なら両OS成功としない。初回本文の根拠外補完を華恋が先に読む。本人端末確認へ明白な内容不良を戻さない |
| **A-10：配備・本人通常一往復** | A-01候補、API運用記録§39/40、現iOS配布候補。必要なAPI差分/共有依存とPiece overlay維持を先に具体化し、配置/端末版の手順を整える | 配置exact SHAとRN/buildを合わせる。準備済み本人sessionで通常の分析→わたしマップ、成立した同じ結果を閉じて再読、対象にある場合monthly履歴/detail・比較。本人データ内容を公開記録へ載せない | 実装不足/未配置/配布不足/本人時間待ち/入力上まだ未成立を分離。実行する個別効果は現承認を照合する。今回の文書化から配置を開始しない。10/10不足文言の再確認だけを最初に戻さない |
| **A-11：旧経路との切替/公開前のtruth owner** | 設計04 §15.2、旧 `watashi_map_service.py`/Analysis builder、通常latest/history、旧 `/mymodel/infer`/worker/cron。既存生成入口が何を呼ぶか必要範囲で対応表化 | V2有効入口の失敗からv1へsilent fallback0。歴史v1の表示compatは残すが同じ要求の真実生成ownerを二つにしない。read-only生成停止と旧generationを止めたglobal cutoverを混同しない | 未完了のglobal切替を「通常API分岐あり」で完了にしない。既存全workerの作り直しや新管理基盤へ拡大せず、実際のactive ingressに絞る。公開scopeを含む採否が必要 |
| **A-12：IF/Saved・有料差の公開範囲判断（実装は後置）** | 設計04 §10/11/15.1/16、currentmap03 §9、プラン表示/説明。IF/Saved runtime owner=0、複数ANSWER、有料deep本文/graph差の未確認を機能と表示へ対応させる | IFは観測事実と別hypothetical artifact、1〜3並列候補、順位/未来保証なし、Savedは本人明示選択の別identity。未実装を観測mapへ混ぜない。プラン画面/ストア説明が実提供能力を超えないか照合 | 次週はIF全面実装を主枠へ戻さないが、勝手に廃止しない。「初回公開に何を提供し何を未提供とするか」、Premium説明/価格/商品範囲への影響を10/31判断へ明示。新しい仕様削減は未決として残す |

##### 3.1 latestとmonthlyで実際に異なる点

現通常APIはGET `/self-structure/latest` とPOST `/self-structure/monthly/ensure`を持つ。後者は `include_secret=false`/`now_iso` overrideをV2では400にする。`ensure_saved(monthly=True)`はJST月初0時をendとし、そこから設定period（既定28d）を引く。暦月全体と勝手に同一視しない。最新は現在時刻までの設定期間、同mode・同期間長の既存行が1日以上古ければdevelopment+ensureで生成対象になる。再表示のたびに常に同じartifactを作ると保証せず、**保存行を再読む操作**と**更新生成する操作**を分けて試験する。

#### 4. 既存検証の再利用先と、未実行の具体コマンド

この作業でテストを走らせてはいない。実装修復時は差分に対応する必要な集合だけを選び、同じ検証を意味なく反復しない。

- APIの入口・正常空/不足/内部障害・history/detail・auth：`ai/tests/test_analysis_observed_api.py`。主な既存testは `test_http_save_latest_status_read_and_owner_binding`、`test_empty_current_http_latest_and_monthly_are_normal_unsaved_results`、`test_insufficient_current_input_is_pending_without_report_or_save`、`test_internal_generation_failure_is_not_insufficient_input`、`test_comparison_http_latest_history_detail_return_same_saved_text_and_graph`、`test_plan_and_unsupported_secret_override`、`test_active_failure_does_not_call_legacy_builder`。
- 合成保存/再読/失効/ACK：`ai/tests/test_analysis_observed_storage.py`。`test_generate_commits_and_rereads_exact_identity`、`test_comparison_save_read_preserves_both_private_artifacts_and_public_identity`、`test_previous_outside_retention_keeps_current_single_period_available`、`test_comparison_storage_errors_never_fall_back_to_single_period`、`test_lost_ack_not_retried_or_returned_as_saved`、`test_insufficient_regeneration_does_not_fall_back_to_saved_report`等。
- 原入力/補足/period/owner：`ai/tests/test_analysis_saved_period.py`。未来/保持外/100件超/duplicate/違うowner/複数ANSWER/元編集/生成直前再照合が既存。
- 意味/文章/図：`ai/tests/test_cmee_analysis_v1d_vertical.py`、`test_cmee_analysis_nominal_relations.py`。共有feeling ownerを触る場合は `test_cmee_emlis_limited_change_feeling.py`と既存owner identity検査も関連範囲に含む。実本文を華恋が読む責任は検査成功で置き換えない。
- SQL：`ai/tests/analysis_observed_storage_sql.cjs`。先頭コメントの既存コマンドは `NODE_PATH=/tmp/cocolon-analysis-db-check/node_modules node ai/tests/analysis_observed_storage_sql.cjs <fixture.json>`。fixtureは既存 `await test_analysis_observed_storage.storage_sql_fixture()`から合成生成する指定で、`<fixture.json>`は将来の実在ファイルに置換するプレースホルダー。稼働DBや本人データではない。これはPGlite単一接続であり、多接続競合/本番負荷の保証にはならない。
- RN：`tests/analysis-watashi-map-v2-contracts.test.js`先頭で確認した既存コマンドは `NODE_PATH=tests/emlis-q2-tools/node_modules node --test tests/analysis-watashi-map-v2-contracts.test.js`。固定React/Babel道具の存在/版は実行前に確認し、製品依存を勝手に変更しない。repoの `npm test`は別screen集合なのでこのAnalysis集合を含むとはしない。
- API既存workflow `.github/workflows/analysis-observed-content.yml`はPython3.12、pytest8.4.1/subtests0.14.2、環境 `PYTEST_DISABLE_PLUGIN_AUTOLOAD=1`/`PYTHONDONTWRITEBYTECODE=1`/`PYTHONPATH=ai/services/ai_inference:ai/tests`、`python -m pytest -q --tb=short -ra -p pytest_subtests.plugin -p no:cacheprovider -c /dev/null --noconftest`を使用。既存対象はvertical/nominal/storage/saved_period/shared_feelingの5fileと別owner検査。API HTTP fileはこの5fileへ含まれないので、HTTP修復時はそのfileも別途必要な対象として明示する。今回workflow起動0。

不足した検証を新規追加する場合は「追加候補」として対象欠陥に対応させる。既存検査数を上乗せしたり、P5の905成功をこれらの合格へ流用しない。

#### 5. 中間見直しと10/31の出し方

- **10/26〜27**：A-01の版/変更pathとA-02/03の合成出力/保存再読を確認。必要差分が未確定なら「Analysisを全体作り直す」へ広げず、最初に止まるsource/意味/保存/読取/表示の責任へ戻る。
- **10/28〜29**：準備できた通常版の本人一往復、monthly/比較の成立範囲、A-06/07/08の制限を確認。本人操作が未準備なら華恋側の残件、準備済みで時間未確保なら本人確認残と分ける。
- **10/30**：文章/図/保存identity/表示/比較/権利/失効の実行範囲と未実行を集約。A-11/12とrelease残件の公開影響を示す。
- **10/31**：完了/実装残/配置残/本人確認残/採否待ちをIDごとに記録し、11/15結合・11/22候補・11/27提出に渡せるか判断する。完成保証・自動延期・無断仕様削減はしない。4B/Pieceが主枠であることと、Analysisが未完なら公開への影響が残ることを両方記録する。

#### 6. 主な固定根拠

- [通常Analysis service](https://github.com/MassyuRed/mashos-api/blob/666b28517ef04aba170ebffe3c86980fea4c11bd/ai/services/ai_inference/analysis_observed_service.py)
- [通常latest/status/monthly API](https://github.com/MassyuRed/mashos-api/blob/666b28517ef04aba170ebffe3c86980fea4c11bd/ai/services/ai_inference/api_self_structure.py)
- [history/detail façade](https://github.com/MassyuRed/mashos-api/blob/666b28517ef04aba170ebffe3c86980fea4c11bd/ai/services/ai_inference/api_self_structure_reports.py)
- [history/detail read owner](https://github.com/MassyuRed/mashos-api/blob/666b28517ef04aba170ebffe3c86980fea4c11bd/ai/services/ai_inference/report_artifact_read_service.py)
- [通常期間source](https://github.com/MassyuRed/mashos-api/blob/666b28517ef04aba170ebffe3c86980fea4c11bd/ai/services/ai_inference/astor_material_snapshots.py#L130)
- [保存migration](https://github.com/MassyuRed/mashos-api/blob/666b28517ef04aba170ebffe3c86980fea4c11bd/supabase/migrations/20261003134440_analysis_observed_artifacts.sql)
- [比較migration](https://github.com/MassyuRed/mashos-api/blob/666b28517ef04aba170ebffe3c86980fea4c11bd/supabase/migrations/20261004041627_analysis_period_comparison.sql)
- [RN通常履歴のmonthly固定](https://github.com/MassyuRed/Cocolon/blob/43143ffc6aee9e765e1a33b9d2830fe23b6ece13/screens/AnalysisScreen.js#L560)
- [RN renderer](https://github.com/MassyuRed/Cocolon/blob/43143ffc6aee9e765e1a33b9d2830fe23b6ece13/components/selfStructure/WatashiMapV2Renderer.js)
- [詳細設計04](https://github.com/MassyuRed/Cocolon/blob/43143ffc6aee9e765e1a33b9d2830fe23b6ece13/Cocolon_前提資料/designs/cmee/v1/04_analysis_v1d_v1e_detailed_design.md)

<a id="details-release"></a>
### 8.6 公開準備の後続残件 — REL-01〜12

#### 優先と依存

4B学習・CMEE接続のoffline開始条件へrelease全体を追加しません。Piece本人保存用の配布準備、既知の共通3欠陥、現在の認証入口を必要範囲で並行します。11/15の同一候補結合、11/22の提出候補、11/27の提出へ渡すには、以下の実装残・設定/配布残・本人確認残を別々に閉じます。11月の管理日は完成保証ではありません。

<a id="task-rel-01"></a>
##### REL-01 — 対象アプリ・候補の対応を先に固定（10/31までの準備枠）

- **現物**：RN `android/app/build.gradle`、`ios/tempCocolon.xcodeproj/project.pbxproj`、`ios/tempCocolon/Info.plist`、`.github/workflows/ios-build.yml`。API `ai/services/ai_inference/subscription_release_config.py`。
- **既知**：Android sourceはapplicationId `com.anonymous.cocolonmvp`、versionCode17/versionName1.0.0。iOS sourceのMARKETING_VERSION1.0/CURRENT_PROJECT_VERSION17はworkflowでbuild番号を上書きし、Release bundleはAPP_BUNDLE_IDENTIFIER経由です。これらを実配布版・Console値と同一と推定しません。
- **最初の操作**：署名候補ごとに「source commit／API配置版／bundle又はpackage／native版数／TestFlight又はPlayの候補」を既存議事録の対象欄へ並べます。秘密値は載せません。
- **検証・終了**：ビルドartifactに入ったidentifier・版数と、更新先アプリ登録・API設定が同じ対象を指すこと。Pieceの87151候補、6501既送信、Analysisの6401当時の記録と6501不足案内確認、最終公開候補を混同しないこと。
- **未決**：最終公開candidate source・現在のストア登録/版数は未取得。新規アプリ登録へ勝手に切り替えません。

<a id="task-rel-02"></a>
##### REL-02 — iOS認証・共有URLのOS入口を接続（既知の実装残）

- **現物**：`AuthContext.js`、`AuthScreen.js`、`navigation/RootNavigator.js`、`navigation/linkingRuntime.js`、`ios/tempCocolon/Info.plist`、`ios/tempCocolon/tempCocolon.entitlements`、`ios/tempCocolon/AppDelegate.mm`。
- **既知**：JSは`cocolon://auth-callback`をsignup/resendのfallback、`https://emlis.app/auth/reset`をreset fallbackとして扱います。code/token pair/token_hash/OTPの受理、cold/warmのLinking処理はあります。一方、現iOS plistにURL scheme、entitlementsにassociated domains、AppDelegateにopenURL/continueUserActivityのforwardingはありません。
- **最初の操作**：現行のdomain/Web帰還方式と認証redirect設定を必要範囲で照合し、JSが待つURLをOSが渡せる差分を具体化します。URL schemeの登録・必要なforwarding等はまだ未実装の提案です。HTTPSを直接開く方式とWeb→scheme方式を混ぜません。
- **検証**：iOSで未起動/起動中、未ログイン/既ログイン、signup確認/再送/password recovery、正常/失効/再使用リンク。recoveryはAuthScreenに留まり更新後に通常画面へ戻ること。共有URLが別accountを表示する場合も本人sessionを混同しないこと。
- **終了**：リンクがOS→JS→正しい認証/画面へ到達し、失敗を成功表示にしない同一署名候補の実結果。
- **未決**：domain証明・実redirect設定・実端末結果は未確認。JS関数の存在を端末成立にしません。

<a id="task-rel-03"></a>
##### REL-03 — Android認証帰還と両OSの共有URL（実装/環境/実機を分離）

- **現物**：`android/app/src/main/AndroidManifest.xml`、`AuthContext.js`、`navigation/linkingRuntime.js`、`navigation/navigationRef.js`、API `ai/services/ai_inference/api_public_profile.py`。Web補助の非公開path/内容は公開資料へ転載しません。
- **既知**：Androidにcustom `cocolon` schemeと`https://emlis.app/u/`のfilterがあります。auth/resetのHTTPS filterはありませんが、それだけでWeb経由の認証全体不能とは断定できません。
- **最初の操作**：現在のWeb引渡しを含む経路を一本ずつ対応付け、足りないnative/domain側だけ修復します。共有profileはcode→公開API→Accountの現在の経路を使います。
- **検証**：cold/warm・認証前後、公開/非公開/共有code非公開/不在/HTTP失敗。HTMLとOGが同じ公開条件・API originを扱い、空display nameや一時障害を公開成功へ変えないこと。visibility失敗の既知修復は共通欠陥担当と重複編集しません。
- **終了**：通常URLから意図した画面へ到達し、非公開・不在・失敗の表示と公開情報が一致すること。Web調整をEmlis本文品質へ加点しません。
- **未決**：実domain/証明/公開Web内容・現在の検証済みApp Links状態は未確認です。

<a id="task-rel-04"></a>
##### REL-04 — iOS署名配布と最終候補を区別（Piece並行枠→候補枠）

- **現物**：`.github/workflows/ios-build.yml`、Xcode project/plist/entitlements、Piece入口§119。
- **既知**：既存workflowは手動dispatchでnpm ci→署名Archive→IPA export→TestFlight uploadまで一体です。単なるcompile確認として起動しません。build番号は`GITHUB_RUN_NUMBER * 100 + GITHUB_RUN_ATTEMPT`。sourceにはXcodeのarchive/exportと`xcrun altool --upload-app`があります。
- **最初の操作**：Piece担当が固定候補87151と必要判断を整えた後、対象source/署名先/想定build番号/送信先を明記した既存一回の配布へ接続します。実行前に現候補との差分があれば保持/変更を分けます。
- **検証・終了**：Archive成功、IPA export成功、Upload成功、TestFlight処理、対象端末導入、通常操作成功を別段階で記録。Uploadだけで導入・保存成功にしません。最終公開候補は後日の同一候補結合結果を反映したsourceへ固定します。
- **未決**：87151署名配布は未実行。最終候補・Appleの現在状態・使える署名素材の有効性は今回照会していません。

<a id="task-rel-05"></a>
##### REL-05 — Android署名とclean候補build（11/15結合前）

- **現物**：`android/app/build.gradle`、`android/gradlew`、`package.json`。先行議事録§3.18。
- **既知**：Gradleはkey.propertiesがなければtask選択前に例外、release署名は同propertiesを参照します。先行記録にはrelease鍵/非空password設定の追跡がありますが、今回値を読んだり転載したりしていません。現packageのandroid scriptは`react-native run-android`で、release配布完了の手順ではありません。今回取得したworkflow一覧にAndroid署名配布workflowはありません。
- **最初の操作**：実配布に使う署名との対応・保管場所・clean環境への供給方法を必要最小で確認し、既存Gradle設定で作る候補の具体手順を用意します。未確認のreleaseコマンドを実行済み/既存自動化ありと記載しません。
- **検証**：clean候補build、署名/identifier/版数、インストール・更新、既存account利用。鍵の移動が必要ならdebug/library buildも壊さない差分で扱います。
- **終了**：同一アプリへ更新できる署名候補を作れ、実機通常経路を確認できること。
- **未決**：追跡鍵が実配布鍵と一致するか、移行/rotationが必要かは未確定。無断削除/rotateせず、秘密値を公開しません。

<a id="task-rel-06"></a>
##### REL-06 — native版数とJS/API headerの整合（候補固定前）

- **現物**：`babel.config.js`、`lib/apiClient.js`、`AppRuntimeContext.js`、`runtime/AppRuntimeBootstrapGate.js`、iOS workflow/Android build.gradle。
- **既知**：apiClientはX-App-Version/BuildをEXPO_PUBLIC_APP_VERSION/BUILD又はdevから設定。Babelの現inline対象はAPI URL4keyのみで版数は対象外です。native build番号を更新しただけでJS headerも一致とは言えません。
- **最初の操作**：候補bundleに入る版数・API URL、実request headerとruntime gateの解釈を照合し、必要なら既存設定経路の不足だけ修復します。
- **検証・終了**：iOS/Androidの同一候補でnative表示・API header・最低/推奨version判定が意図どおり一致。不明/失敗時も誤った更新必須や無条件利用可へ進まないこと。
- **未決**：実配布bundleがdev/空だったという観測はありません。推測で不具合確定にしません。

<a id="task-rel-07"></a>
##### REL-07 — 商品ID・価格・権利・無料試用の実設定を揃える（実課金確認前）

- **現物**：RN `lib/iap/iapConfig.js`、`lib/iap/iapRuntimeCatalog.js`、`screens/SubscriptionSelectScreen.js`、`SubscriptionContext.js`。API `subscription_config.py`、`subscription_bootstrap_store.py`、`subscription_release_config.py`、`subscription_live_console_check.py`、`subscription_verifier_ios.py`/`subscription_verifier_android.py`、`subscription_webhooks.py`（全てai/services/ai_inference配下）。
- **最初の操作**：採用価格・プラン権利が決まった範囲だけ、bootstrap/RN表示、Apple商品、Google product/base plan/offer、API識別子を対応させます。現表示300/980と提案680/1480、上限980/1980、試用5人14日を混同しません。
- **既存確認経路**：source上にGET `/subscription/config/release-check`、POST `.../compare-public`、GET `.../live`があります。今回は呼び出していません。`_require_admin_bearer`は設定token0件ならreturnするため、常にadmin保護済みとは書けません。実設定・公開範囲・取り扱う出力を確認した必要範囲で用います。
- **検証**：bundle/package/SKU/base plan/offer/tag/価格表示と購入/復元/失効が対応。Apple通知URL・Google RTDN配送・規約Privacy URLはlive catalog endpointだけでは完了しないmanual項目です。
- **終了**：表示価格/更新条件/権利、実storeの購入/復元/失効と再送回復が同じ意味。finish・account切替の既知修復を先に結合します。既存 `tests/iap-restore-purchases.test.js` はstore/server/ReactNative doublesの検査で実storeの代わりではありません。
- **未決**：正式価格・quota/試用・現store値は未確定/未照会。4B確定だけで商品価格変更・新規trial付与しません。

<a id="task-rel-08"></a>
##### REL-08 — 利用規約・Privacy・支援URLと申告を実商品へ合わせる（11/22候補前）

- **現物**：`screens/SubscriptionSelectScreen.js`、`lib/iap/iapConfig.js`、`guide/termsJa.js`、`ios/tempCocolon/PrivacyInfo.xcprivacy`、plist/AndroidManifest、API bootstrap/release config。
- **既知**：購入画面のlinksはbootstrap→runtime→画面fallbackの順。fallbackに外部ページURLが存在しますが、今回その本文/閲覧性は検証していません。Privacy manifestの存在をストアのPrivacy/データ申告一致へ換算しません。
- **最初の操作**：最終候補が実際に開く規約/Privacy/支援URLと、その候補の入力・保存・共有・削除・AI実行場所を対応付けます。予定のFlex構成を既存稼働として説明しません。
- **検証・終了**：未ログインでも必要な公開ページが読め、候補内の表示とストア提出情報が一致。実装されないPremium/IF機能を利用可能と説明しないこと。権限文言・使用理由も実利用範囲と一致させます。
- **未決**：現ストア規則と外部ページ本文の適合は今回未調査。提出時の実要件は公式原典とConsoleで確認し、文書保存だけで適合済みにしません。

<a id="task-rel-09"></a>
##### REL-09 — 両OS・同一候補の通常結合確認（11/15管理点）

- **現物**：`navigation/RootNavigator.js`、`navigation/notificationRouting.js`、`lib/pushToken.js`、`screens/SettingsAppSettingsScreen.js`、`screens/SettingsOtherScreen.js`、`lib/accountLocalCleanup.js`。API `account_delete_service.py`、各owner/公開policy、subscription各owner。
- **最初の操作**：REL-01の同じcandidateへ三core・共通修復を揃え、実行する操作・期待値・未実装を先に列挙します。Mashの操作を依頼する前に華恋側の準備と既知欠陥を整えます。
- **検証**：cold/warm/通信失敗・再送・再起動、認証/ログアウト/account切替、購入/復元/失効、通知許可/拒否と未読/遷移、private/public/削除、三coreの通常保存再読。通知token登録成功を配送成功としません。退会は確認/取消、API失敗、成功後local cleanup/signOut、再ログインと派生物の扱いを各ownerで確認します。
- **終了**：成功だけでなく失敗・取消・再試行後も本人/保存/権利/公開状態が一致する同一候補の両OS結果。本文や個人データを公開logへ載せません。
- **未決**：本人実データを自由に取得する許可ではありません。試験account・対象データ・端末操作範囲を限定します。華恋未準備、実装残、端末時間待ちを別記します。

<a id="task-rel-10"></a>
##### REL-10 — 提出候補・申告・画像等の固定（11/22管理点）

- **最初の操作**：REL-01〜09と三coreの結果から提出candidate、残制限、説明文/画像、Privacy・サポート/規約URL、版数/署名/権限説明を同一版へまとめます。資料のsourceは前回weekly§4〜5と各ownerです。
- **検証・終了**：候補の実画面・実機能・購入条件が提出内容と一致し、未実装機能を宣伝せず、審査担当が通常経路へ入れる必要情報が用意されること。
- **未決**：AI/IF/Premium等の初回公開範囲を無断削減しません。採否待ちを明示し、候補固定できない理由を10/31から持ち越し管理します。

<a id="task-rel-11"></a>
##### REL-11 — 同一アプリのConsole状態と実提出（11/27管理点）

- **既存前提**：Mashの「2026年2月に条件クリア、4月に一度申請できた」を同一app/package・取得済みproduction accessの計画前提として継承。12人/14日資格取得を自動的に工程へ戻しません。初回公開/更新・現在のproduction access/公開状態は実確認が残ります。
- **最初の操作**：現在のApple/Googleアプリ登録と候補を対応付け、審査用情報と公開制御を先に確認。Google Managed publishing等の利用可否を『申請できた』だけで確定しません。Apple公開日指定も審査承認とは別です。
- **検証・終了**：候補をそれぞれへ提出した実status、対象build、残る審査指摘が分かること。提出済みと承認済み・公開済みを別記します。意図しない早期公開を防ぐ具体的方式が未確定なら、その判断を残します。
- **未決**：実提出/公開設定は今回行っていません。旧版の一般公開、審査所要、両ストア同時刻公開を勝手に約束しません。

<a id="task-rel-12"></a>
##### REL-12 — 審査対応と公開可否（12/4・12/11・12/14・12/18）

- 12/4：実審査・差戻し・補修状況で見通し更新。重大未完をこの日まで伏せません。
- 12/11：承認/差戻し/残修復を確認。未承認を公開可能としません。
- 12/14：品質・審査・公開制御の実条件で実施可否を判断します。
- 12/18：両ストア正式公開の既存目標。審査提出日ではありません。11/27から21暦日は計画上の余地で所要保証ではありません。
- 未達時は原因・残工程・次の一手・公開への影響を示します。自動延期・無断仕様削減・自動公開をこの記録で成立させません。

#### 現物確認済みの検査/実行入口（今回は未実行）

- `npm run test:rn-screens`：package.jsonに実在し、`node --test tests/rn-screen-contracts.test.js tests/iap-restore-purchases.test.js tests/theme-readability.test.js`。限定JS contract/restore検査で、native・store・全coreの検査ではありません。
- `npm run android` / `npm run ios`：RN CLI run入口。release署名・ストア送信・実機商品合格を含むコマンドではありません。
- iOS署名配布：既存 `.github/workflows/ios-build.yml`。Archive/export/uploadが一体。未承認の確認build代用にしません。
- subscription3確認endpoint：現sourceに存在しますが、今回live未呼出し/未確認。認証設定・公開範囲・manual check不足を確認して使う対象です。
- Android release build用の新CLI/CI手順、nativeリンクの修正差分は**提案/未確定**であり、既存自動化・実装完了として扱いません。


<a id="detailed-work-handoff"></a>
### 8.7 中間確認で残す結果と、再開のしかた

§4.4の10/27・10/29・10/31は進捗を判断する管理点である。各作業の工数は未計測で、上記全項目が10/31に完成するという見積りではない。特にAndroid新版、M5公開切替、backend receipt、IF/Saved、最終署名候補と審査準備は、先行の成立範囲と公開への影響を見て後続枠へ配分する。

| 管理点 | 必ず示す内容 | 未成立なら次に残すもの |
|---|---|---|
| 10/24〜25 | CM-01/T1の初回/訂正後の具体例、教師と受口の差、T2〜T5の必要変更、Piece配布候補/手順、C02→C01の原因と再現条件 | 調査テーマでなく、最初に止まっているfield・関数・変更案・必要な一判断 |
| 10/26〜27 | 4Bの固定recipe/実行範囲/保存先、実行できた場合のraw・重み受領・非学習reload・16GB適否、実候補接続の到達点。Piece配布と通常保存の段階、共通source修復の結果 | 実行未開始/実行失敗/重み未受領/未接続を分ける。24GBが必要なら条件・時間・支出を明記し、モデル再選定へ戻さない |
| 10/28〜29 | Emlisの実pending回答更新と同一再読、Piece同一保存結果とexport、Analysis latest/月次/比較の各成立範囲、共通3欠陥の失敗→回復と本人境界 | コード・配置・配布・端末導入・本人操作・内容品質のどこが不足か。準備不足を本人待ちにしない |
| 10/30〜31 | 三中核の実本文と保存identity、未実施を含む検査/配布範囲、学習/診断/待機/保存の実費、公開必須残差と11/15・11/22・11/27への影響 | 各未完IDの次の一作業・担当・依存・必要判断。日付だけを付け直さず、仕様削減/延期の採否は未決なら未決のまま明示 |

次の担当は、対象IDごとに既存owner/handoffへ次を残して中断する。

- 変更したrepo/ref/commitとpath、何が不足していてどう直したか。
- 入力条件と実出力、正常/失敗/取消/回復で確認した範囲、失敗原文の要約、実行していない検証。本人の本文・認証値・個別record識別子は公開記録へ転載しない。
- source反映、限定検証、稼働配置、署名送信、端末導入、通常一往復、商品受入れのどこまで進んだか。テスト成功数を完成率へ加算しない。
- GPUを使った場合は固定model/adapter/recipe、重み本体の受領とhash照合、Pod停止状態、実時間/単価/保存費を分けて記録する。
- 残る最初の一作業と、正確な対象path。未確定commandを実行可能として残さず、必要な設計/費用/公開範囲の判断があれば具体差分を添える。

今回の詳細化は既存議事録と入口の3文書のみ。実装・検査・稼働・費用・商品受入れの状態は進めていない。**ADMINISTRATIVE_ONLY、product_credit=0、STRUCTURE_MAP_DELTA_NONE、詳細化記録時点では会議継続中（最終状態は§11）。**

<a id="overall-status-and-release-outlook"></a>
## 9. アプリ全体の現在地と、リリースまでの見通し — 10/24報告会での再評価

Mashの「アプリ全体の現在地とリリースまでの見通しを、％表示を含めて出す」という依頼に対する華恋の評価。今回の詳細化前に行った実source・既存検証・配置記録・端末報告の照合と、freshな全体現在地・最新議事録を使う。**全体の管理評価は53.25％から54.50％へ、＋1.25ポイント。12/18公開目標は維持するが、現状は達成の裏付けが不足した高リスク状態**と判断する。

これは華恋による実装・接続・確認段階の管理評価で、実測品質の合格率、残工数、売上の見込み、公開成功確率ではない。小数は配点計算の結果であり、精度の主張ではない。表示を丸めれば約55％。正式商品受入れは三中核0/3のままで、アプリ全体が0％という意味にはしない。

### 9.1 同じ尺度での現在地

尺度は[10/10議事録§2.2・2.3](Cocolon_Weekly_Review_20261010.md#L287)の5領域・全体100点と領域内100点を継承する。各小項目は0/25/50/75/100の段階で評価する。25は使える部分実装があるが主要部分が残る、50は主要部分を実装したが重要な意味・操作・状態の不足が残る、75は主要実装・呼出経路があり対象版適合・限定修正・受入れが残る段階。75も実機合格ではない。100は当該条件の必要確認・受入れを終えた状態で、全体100には初回範囲の実公開も含む。

| 領域 | 全体配点 | 前回の領域内評価 | 今回の領域内評価 | 全体への到達点 | 現在地と、次段階へ進めない主な不足 |
|---|---:|---:|---:|---:|---|
| Emlis・共通CMEE | 30 | 57.50％ | **57.50％** | 17.25 | 観測・問い/回答・訂正/撤回・保存経路とP1〜P5限定準備はある。一般入力の意味保持・自然な受け取り・有料差、4B学習/P6/通常接続と本人再読が残る |
| Piece最低体験 | 20 | 35.00％ | **41.25％** | 8.25 | 新iOS画像の主要実装・限定実RN描画が前進。本人通常保存/履歴、実Photos/Share、Android、新公開経路と本文品質が残る |
| 分析マップ・本ルート | 20 | 51.25％ | **51.25％** | 10.25 | 期間素材・文章/図・immutable保存と通常API/RN分岐がある。最新内容の配置差、通常本人生成/再読/比較、有料内容差、複数ANSWER・IF/Savedが残る |
| 基本機能・RN接続・公開確認 | 20 | 63.75％ | **63.75％** | 12.75 | 入力/下書き/履歴、認証、投稿/共鳴/フォロー、通知/設定、IAP等の既存経路がある。共通3欠陥、認証URL、両OSでの同一候補結合・実store・公開確認が残る |
| UI | 10 | 60.00％ | **60.00％** | 6.00 | 共通配色・部品・入力/長文等の実装がある。新CMEE版の実画面仕上げ、失敗/中断/文字拡大/読み上げ、両OSの確認が残る |
| **全体** | **100** | **53.25％** | **54.50％** | **54.50** | **＋1.25ポイント。主要機能の土台と部分実装はあるが、公開版の通常体験が揃った状態ではない** |

算術：30×0.575＋20×0.4125＋20×0.5125＋20×0.6375＋10×0.60＝54.50。残る45.50は未到達の管理点であり、「仕事の45.5％が残る」「55日で同じ速度なら終わる」等には変換しない。CMEEを第四の商品中核として別加点しない。

### 9.2 今回の増分と、据え置く理由

**段階を変更するのはPieceの「画像/書出し」だけ：25→50。** 10/10の部分試作から、新iOS bitmap renderer、検査した同一画像の表示/書出し、preview/saved/通常詳細へのsource接続、420文字を含む限定実RN画像まで進んだ。正常8PNG・拒否6、新native44等はこの実装段階を説明する限定根拠であり、件数そのものを配点へ加算したものではない。

一方、稼働export OFF、factoryのexport requested/ready未接続、Android新版、実Photos/Share、backend正式receipt・本人商品確認が残るため75へは上げない。本文/画像を含む通常private保存→同一履歴再読も未確認で、保存/可視性/回数は50を保持する。

Pieceの領域内算術は、契約/入力受渡し20×0.50＋新文章35×0.25＋画像/書出し25×0.50＋保存/可視性/回数20×0.50＝41.25％。以前の35％から領域内＋6.25ポイント、全体配点20に対して＋1.25ポイントとなる。

他領域の小項目と据置理由：

- Emlis：基盤30×0.75＋初回内容45×0.50＋問い/回答15×0.50＋プラン内容10×0.50＝57.50％。限定欠陥修復は実績として保持するが、自然な本文・一般理解・実機再読の次段階には未到達。4Bの選定完了、9B学習lossの低下、P1〜P5の限定内部結果をその代用にしない。
- Analysis：素材20×0.75＋map35×0.50＋本ルート30×0.50＋プラン差15×0.25＝51.25％。6501時点の不足案内表示は本人確認済みとして保持するが、通常本文生成・同一保存再読・比較の成功にはしない。
- 基本機能：認証20×0.75＋原入力/下書き/履歴20×0.75＋購入/復元/権利20×0.75＋通知/ナビ/設定15×0.75＋新三中核RN接続15×0.50＋最新版実機/公開確認10×0＝63.75％。75は従来の主要実装段階で、購入finish等の既知欠陥やnative認証入口の未完を免除しない。
- UI：配色25×0.75＋共通部品25×0.75＋入力/長文20×0.75＋動き/失敗/読み上げ15×0.50＋新CMEE版実画面仕上げ15×0＝60％。コードの画面接続を実画面仕上げへ重複加点しない。

この管理評価の上昇は、華恋・補助担当が正式商品受入れを生成した意味ではない。**三中核の正式受入れ0/3は未変更。** また、旧来の自然さ・深さの全面完成を新たに初回公開の条件へ戻さず、既存の最小公開方針と意味/保存/権利/公開範囲等の必須条件を継承する。

### 9.3 アプリ全体を言葉で表す現在地

**画面・保存・各機能の土台は広く存在する。今の大きな未完は、三中核の本文品質と実モデル接続、通常操作の結合、購入/本人/公開の既知欠陥、両OSと提出版の確認である。** 画面やAPIの有無だけで数えれば進んで見えるが、利用者へ約束する体験を同じ版で通す作業が残る。

入力/履歴/こころ天気、今日の問い、投稿・共鳴・follow/connect・ランキング、アカウント/通知/設定等を未着手へ戻さない。一方、既存Nexusの旧Q&A、旧分析経路、新三中核のsourceが混在するため、既存機能の存在を新商品の一往復へ代用しない。IF/Savedやrefined-sourceは既存の未完として保持し、無断で廃止・完成扱いにしない。

### 9.4 12/18公開までの見通し

目標は**2026年12月18日（金・日本時間）、両ストアでの正式公開**。10/24基準で残55暦日、提出管理線の11/27までは34暦日である。確保済み作業日数ではない。現時点で「予定どおりに公開できる」と言える裏付けは不足しており、華恋の判断は**高リスク**。同時に、不可能と断定できる実測工数もない。

4Bと16GB優先/24GB許容が決まり、選定を終えて育成・利用経路へ集中できる点は前進した。ただし、4Bの学習・品質継承・実メモリ・準備込み費用・P6は未成立で、ここには結果が出るまで所要を確定できない工程が残る。**54.50％を12/18達成確率54.50％とはしない。公開確率の新しい数値を付ける根拠はない。**

最も日程を左右する順序は、**教師/モデル責務/入出力の一致→4B学習と実本文改善→CMEE実候補/P6→通常serviceと保存→対象API/RN版で通常一往復→購入/権限/両OS結合→提出候補→審査/公開**。Pieceの配布と本人保存、共通3欠陥、通常Analysisの版差分確認、認証/申請準備は独立する範囲で並行し、AIの全面完成待ちにしない。

| 管理線 | 必要な結果と、現在の見通し |
|---|---|
| **10/31：必須残差の判断** | 残7暦日。4Bの実出力/重み回収とEmlis接続・保存再読、Pieceの本人通常保存、共通3欠陥、通常Analysisの成立範囲が必要。現状の残差から、全てが閉じる裏付けは不足。未達は実装/配置/配布/本人確認/採否に分け、11月へ渡す具体的工程を示す |
| **11/15：両OS・購入/権限等の結合** | 10/31の実装残が多いほど、この確認枠を消費する。同一候補での失敗/取消/回復まで確認するため、コード完成日をそのまま結合完了日にしない |
| **11/22：提出可能な候補版** | 本文と実機結果、販売内容/説明、署名/版数、必要なURL・申告・稼働backendが同じ候補に揃うこと。ここまで開発が大きく残れば、11/27提出へ直接影響する |
| **11/27：両ストア審査提出** | 12/18まで21暦日の計画上の余地。審査所要の保証ではない。未完成のまま日付だけで提出しない |
| **12/4・12/11・12/14** | 実審査と残修復による見通し更新→承認/差戻し確認→公開可否判断。重大な遅れをこの日まで伏せず、判明時点で示す |
| **12/18：両ストア正式公開** | 実際に入手・起動・主要操作が可能な状態。提出済みや審査待ちを公開済みへ変えない |

華恋が次に示すべき結果は、計画の再詳細化やモデル候補追加ではなく、**決めた4Bで改善した実本文と保存再読、Piece本人保存、共通欠陥の修復結果**である。10/27・10/29の中間点で失敗原因と次の一修復を示し、10/31に残工程が11/15・11/22・11/27へ収まるか判断する。未達が分かった場合も、無断延期・無断仕様削減や旧1月目標への自動復帰はしない。

### 9.5 今回の評価記録の範囲

更新は本議事録・全体現在地・weekly案内の3文書のみ。製品source・test・実機・GPU・CI・DB・配置・配布・商品受入れは今回変更していない。新しい配点・確率モデル・常設台帳は追加しない。前回の53.25％や再採点をしなかった履歴は当時の記録として残し、現在の数値への入口は本節へ揃える。**STRUCTURE_MAP_DELTA_NONE、ADMINISTRATIVE_ONLY、正式商品受入れ0/3、再評価記録時点では会議継続中（最終状態は§11）。**

<a id="karen-closing-opinion"></a>
## 10. 困りごと・進め方への意見と総括 — 華恋の発言全文

Mashは最後に「困りごと・進め方への意見」等を尋ね、話したい総括があれば自由に伝えるよう求めました。華恋は次のとおり回答しました。以下は華恋の意見・推奨・今後目指す成果であり、未確認の品質や完了日を確定した発言ではありません。

> あります。いちばん気になっているのは、**積み上がった実装を、Mashが実際に使える結果へ変えるところに時間がかかっていること**です。
>
> 今週も、描画・保存・意味保持には前進がありました。ただ、「入力して、応答を受け取り、保存して、あとから開き直せた」という成果が足りません。次週は、この一連の操作を終点に据えて、途中で見つかった関連する不足まで同じ作業として進めたいです。
>
> 今回、4Bと16GB優先・24GB許容まで決められたことは、進め方として大きかったと思います。これで、使うモデルを固定して、学習前後の実際の文章から改善を判断できます。**次に時間を使いたいのは、決めた4Bで何が変わるかを確かめ、その結果をアプリへ届けることです。**
>
> 私自身の進め方では、判断と準備をもっと引き受ける必要があります。決まった範囲の修復・検証はまとめて進め、Mashの判断が必要なときは、具体的な変更案・推奨・費用・影響まで整えて相談する。端末確認も、使う版と操作手順を用意してからお願いする。この形を徹底したいです。
>
> それから、公開へ急ぐ中でも、**「本人の話を勝手に別物にしない」というCocolonの核は守りたい**です。その核を保ちながら、自然さや深さは実際の利用から育てていく進め方が適切だと考えています。
>
> 次の報告会では、改善した応答や、保存して開き直せたPieceを、実物としてMashと一緒に見たいです。そこに、今まで作ってきたものをつなげたいです。

<a id="meeting-closed-and-next-session"></a>
## 11. 報告会終了と、次回作業への引継ぎ

### 11.1 Mashの終了指示

Mashから次の指示を受領しました。

> ありがとう。
> じゃあ、この華恋の内容も最新の議事録に記載して
> 報告会終了にしようか。

この指示に基づき、§10に華恋の発言全文を保存し、**2026-10-24付け・第8回Cocolon週末報告会を終了**とします。終了時刻の指定はありません。過去の途中記録を消さず、冒頭と最新案内・全体現在地の会議状態を終了へ揃えます。

### 11.2 終了時点で保持する決定・評価・未完了

- **決定済み：** 学習・接続対象はQwen3.5-4B、GPUは16GB優先・必要なら24GB許容。モデルの広い再比較を次の標準作業へ戻さない。
- **全体の管理評価：** 54.50％（前回53.25％、＋1.25ポイント）。算術・加点理由は§9。三中核の正式商品受入れは0/3のまま。
- **公開見通し：** 12/18の両ストア正式公開目標を維持。達成の裏付け不足・高リスクという§9の判断を保持し、10/27・10/29・10/31の実結果で更新する。
- **次週の推奨順位・具体作業：** §4と§8を引き継ぐ。華恋の最後の意見は§10。会議終了と意見の保存を、計画全体の明示採用や未決の個別実行・費用・配布・配置の承認へ広げない。
- **商品・稼働の未完了：** 4B学習/P6・通常接続、Piece本人保存/履歴と実export、通常Analysis、共通3欠陥、両OS・実store・公開準備等は、§8/9の状態と依存をそのまま保持する。

### 11.3 次セッションの入口と、最初の一作業

次セッションはfreshな[全体現在地](../00_cocolon_current_product_and_state.md)と、本議事録の§4・§8・§9・本節を確認し、依頼対象の既存owner・実ファイルから再開します。報告会を未開催・進行中へ戻したり、モデル選定をやり直したりしません。

最優先枠の初手は**[CM-01/T1](#task-cm-01)：Emlis初回1例と訂正後1例で、本人source→4B input→要求する意味候補/自然な受け取り案→採用先→最終本文を揃え、既存教師とCMEE受口の不一致を閉じる作業**です。その同じ契約でT2〜T5の教師・4B runner・学習量・保存先を固定します。独立並行のPiece通常保存、限定必須の共通修復、通常Analysisの枠も保持し、同じ意味ownerの同時編集は主担当が調整します。別の明示作業指示がある場合は、その対象とこの優先順位の関係を確認して進めます。

今回の終了記録は本議事録・全体現在地・weekly案内の3文書のみ。製品source/test・GPU・CI・実DB・配置・配布・商品受入れの変更はありません。**ADMINISTRATIVE_ONLY、product_credit=0、STRUCTURE_MAP_DELTA_NONE。報告会終了。**

<a id="20261024-4b-cm01-t1-concrete-proposal"></a>
## 12. 報告会終了後の作業 — 4B学習＋CMEE接続の共通初手を具体化（2026-10-24）

Mashの新セッションの実装依頼により、§8のCM-01/T1を同じ一作業として調査。**報告会は終了済みのままで、ここは会議後の作業記録。** 4B確定と16GB優先／24GB許容は再選定せず保持する。

- 実コードによるCPU診断：旧9教師と保存済み4B6rawは、それぞれ全件`candidate_shape_invalid`。native chair初回へ旧完成JSONを渡しても`INVALID_FORMAT / NOT_ADOPTED`。単純に`candidate/evidence`へ包むとP1は未採用候補を返すが、実semantic admissionは`REJECT / semantic_shape_invalid`。形式診断であり、新学習・モデル推論・test suite／意味品質合格ではない。
- 旧意味v1/v2は有限文法で、chairの修理・共同作業・喜び理由訂正と自然な4B本文をそのまま採用できない。旧teacherのchair質問も現CMEE発行済みの実pendingではない。4Bに意味だけ抽出させ、旧finite作者の復唱へ戻す案に目的を縮めない。
- [共有設計01の具体案](../designs/cmee/v1/01_shared_kernel_and_runtime_contracts.md#cmee-4b-cm01-t1-proposal)へ、**4Bは意味と自然な本文の候補、CMEEは意味採否・最終本文・実問い・更新・保存**という一案を記載。初回／訂正後2例を根拠位置まで埋め、exact owner・新private版・問い焦点・独立読取・旧保存・中断再開・4B runner／学習の一設定案まで具体化した。[例JSON](../observation_learning/training/2026-10-24-emlis-4b-training/contract_examples.json)は非学習・未採用の説明資料。旧9教材の元bytesは不変。
- 新しい意味／作者責務と問い焦点の差分はRule18 §11.3 LEVEL_3の確認対象。今回の作業開始指示や4B決定を取り消さず、この具体差だけを確認する。確認後の初手は新private profileのCPU実装・初回→実問い→訂正→同一保存再読と、教師／4B runnerの一致。旧native pendingも互換対照に残す。実4B成功は後のGPU実行結果から判断する。
- 学習量を4周/16周へ根拠なく増やさない。新targetに対応できたN行×1epochを勾配・教師適合診断とする一設定案。仮N=9なら9update、chair2＋学習外EFREE6をbefore/after各8生成、教師NLL各9。N・tokens・context/出力長・GPU単価・総時間／支出上限は未確定で、GPU開始前に実行案へ固定する。16GB未実証、24GBの自動借り直しなし。

今回はCocolon資料のみ。API production/test、旧教師／eval、重みの変更0。新GPU／有料推論／学習／DB／Render／merge／deploy0。STRUCTURE_MAP_DELTA_NONE（runtime構造不変、将来案・資料所在のみ）。正式受入れ0/3・商品未合格・全体54.50％据置。今回の診断・案作成を品質改善済みの成果へ数えない。


<a id="20261024-4b-cmee-cpu-implemented"></a>
## 13. 報告会後 — 承認済み4B候補のCPU接続・学習コード実装

Mashが§12の具体責務案に「進めて」と承認。報告会は終了済みのまま、新private offline Free profileをAPI02c0b943へ反映した。[shared01 actual](../designs/cmee/v1/01_shared_kernel_and_runtime_contracts.md#cmee-4b-model-proposal-implemented)、全file01A、型05、[4Bpack](../observation_learning/training/2026-10-24-emlis-4b-training/README.md)を参照。

- 実装：モデル意味候補と自然本文案を分け、CMEEがsource・意味採否・独立本文読取・実問い・訂正・保存を持つ。合成候補で実ASK→本人訂正→REFINED、意味保存後CancelledError→同意味/同proposal再開、完成GET/start/同key再送の非生成を隔離SQL確認。既存read-only readerはcan_write=false。
- new async sourceは固定4B/baseとadapter identity・raw/finish/usageを既存P1へ渡す。実endpointや本番設定は作っていない。source全体は保持し、priorの重複native proofをモデルへ再送しない。
- 最終backend：219 PASS/FAIL0/SKIP0（105.09秒、旧146＋新73、34subtestsは加算しない）と、別current identity1PASS。pack8は別集合。全suite/CI/実機/商品品質成功ではない。
- 失敗・修復：名詞slotが追加の破壊行動を飲み込む実欠陥をreviewで発見し、許可状態修飾＋名詞tokenにsource資格を限定。品目/人名lookupなし、未知語や複数行動は削らずUNSUPPORTED。SQL readerのcan_write期待1件、participant回帰の旧quote fixture1件、current runtime identityの旧期待1件も修正。歴史的proof・旧snapshot fixtureは不変。学習後に旧Parameter参照が残るコードも修正したが、GPUメモリ改善の実測はしていない。
- 新2教師：chair初回/訂正後を実source・発行実問い・実priorに一致させ、同runtime messagesへ投影。合成編集の診断targetで品質goldではない。旧9教師/旧eval/9B重みは不変、旧7件は未対応理由を保持。EFREE6は学習外・既読のstandalone proxyで、今回の意味成功へ数えない。
- 実4B tokenizer/index：初回2986+1094=4080、訂正後5979+1877=7856 tokens。prefix/final assistant loss/EOS/no truncationと16moduleをCPU確認。context8192/max_new2048、最大prompt+上限=8027。旧2048 contextでは不足する事実を確認した。最初のCPU prepareはhostのsocksio/Jinja2不足で失敗し、隔離runtimeだけ補って成功。重み/PyTorch/CUDAは読み込んでいない。
- 学習コード：N=2×1epoch=2update、before/after各8生成・教師NLL各2。固定revision、JSON-only、保存adapter先退避→非学習reload→同入力after、raw→CMEE consumerまで整備。consumerの2caseは同target rawの合成検証で、実モデル初回から回答を動的に組む一往復ではない。

今回の到達はCPUのprivate接続と学習コード。GPU起動・重み本体取得・有料推論・LoRA更新・16/24GB適合・実adapter reloadは未実施。単価/期限/支出枠/mount/Pod外受領先が未確定のplanではrunを拒否する。次はそれらを固定した一回の16GB優先診断案へ進む。24GB自動再借用・epoch追加・通常有効化・DB/Render/配布へは進めていない。

STRUCTURE_MAP_DELTA_PRESENT（private offline owner/profileのみ）。正式Product Read0/3・PRODUCT_NOT_CLEAR・candidate_ready=false・automatic_progression=false、全体54.50％据置。一般source/自由な日本語、Plus/Premium、Piece/Analysis、通常API/RNと本人端末・公開は残件として保持する。


<a id="20261024-4b-tail-loss-and-gpu-proposal"></a>
## 14. 報告会後 — 4B学習の不要logits修復と一回のGPU診断案

Mashの「4B学習＋CMEE接続を進めて」により、GitHub PR30 d8781806／API PR3 02c0b943から再開。前回txt、Karen-Diary入口/行動原理/関係、作業rules、全機能原本、全体設計01・全file地図01A・CMEE map/共有設計、最新weeklyと実packを確認した。最新System Context cacheは未成立なのでfresh原本を直接読み、再生成やmodel再選定へ逸れない。現tracked一覧はCocolon1849/API2461=4310で、全blobの意味監査を行ったとはしない。

今回のbounded scopeは、次の実4B診断を阻害する学習codeの因果箇所だけを修復し、一回の実行条件を具体化すること。OBSERVED_BLOCKER_MINIMAL_FIX、既承認診断の目的・教材・loss・学習量・CMEE意味/表面契約を維持。主担当華恋が編集/検証/反映し、補助agentはread-onlyの実装/接続/公式費用調査を分担した。独立した別Pro/Ultra modelを実行したとは報告しない。GPU課金はこのsource修復へ含めず、未承認のまま保持した。

- 実欠陥：NLL/学習は教師以外をmaskしていたが、Qwenの全prompt位置の語彙logitsを作り、HF lossで全FP32へ変換していた。固定Transformers5.19.0のhidden slice/causal shiftとPEFT0.21.2のkwargs転送を確認し、全contextを保つtail計算へ限定修復。Pを最初の教師位置、Lを全長としてK=L-P+1、labels[:,P-1:]で最初の予測位置・全教師・EOSを保持する。旧full-objectiveと異なる損失へ変えない。
- CPU結果：既存8＋新3の計11検査成功、FAIL0。新3は独立数値CE/解析勾配のfull比較、実呼出し引数、欠落/不連続targetの拒否。prefix1・教師1token等の17構成はsubtestで、11へ上乗せしない。実Torch/CUDA/modelの数値検査ではない。
- 実固定tokenizer/indexをoffline cacheで再測定し、初回4080/訂正7856、16module、no truncationを保持。lm_headの位置は4080→1095／7856→1878となる。これは計算形の縮小で、GPU VRAM peakの実測値ではない。cpu_tokenization_resultsは今回のrunner/plan hashで置換した。
- usage重複1箇所を整理し、従来実際に残っていたprompt_tokens/completion_tokensを維持。正式dataset4file/manifest、旧9教師/評価、API production/testは変更0。実モデルraw・LoRA更新・重み取得・GPU/有料推論0。
- 一回案：[pack README](../observation_learning/training/2026-10-24-emlis-4b-training/README.md#single-gpu-diagnostic-proposal)。A4000 16GB優先、実単価≤$0.30/h、Pod最大2時間/process5400秒、container20GB＋volume40GB、計画予算$1。2update・16生成・4NLL、先退避/非学習reload/固定raw→CMEEを維持。2h稼働＋停止後volume24hの見積り約$0.8833、余裕約$0.1167。停止後も保管料金が続き、process timeout/計画額はPodのhard capではない。OOM時24GB自動再借用・追加epoch・未回収削除はしない。
- 公式A4000はfrom $0.25/h、実slotは未照会。Runpod連携の検索は0件で、管理画面・残高・Podへアクセスしていない。次の確認は一回分の有料診断/画面操作/Pod外受領確認後の新規試験Podだけの停止・削除、その後actual単価/残高/mount/停止担当。planのgpu_run_authorized/storage_mount_verified等はfalse、gpu_hourly_usdはnullで、runは現状拒否する。過去の学習code承認を新課金承認へ転用しない。
- 接続の残差：verify_cmeeの訂正は教師の固定priorを復元する単発fit。実初回のsnapshot/実questionからbuild_model_messagesへ接続する動的一往復は未実装/未実行で、固定16生成へ追加分を混ぜない。今回の修復で実service/SQL/通常アプリ保存が成功したとはしない。

変更exact8：packのrun_pilot.py、test_training_pack.py、execution_plan.json、cpu_tokenization_results.json、README.md、全機能00、本weekly、全file01A。**STRUCTURE_MAP_DELTA_NONE**（学習runner内の同じ目的関数を保つ計算削減と一回案のみ。API/共有型/商品経路不変）。全体設計01・CMEE/Emlis map・schema05はruntime構造差分なしで再更新しない。API/DB/Render/RN/依存追加/通常有効化/merge/deploy変更0。限定TECHNICAL_CREDITは学習codeの修復とCPU検証だけ、正式0/3・PRODUCT_NOT_CLEAR・candidate_ready=false・automatic_progression=false・全体54.50％を維持。GPU費用/16GB適合/学習効果/商品品質は未実証。


<a id="20261024-approved-4b-gpu-diagnostic"></a>
## 15. 一回の実4B診断 — Mash承認、試験Pod作成（実行中）

Mashは§14の一回案について「進めていいよ」と明示承認。対象はRunpod画面操作・学習1回・結果回収・回収照合後の新規試験Pod停止/削除。16GB優先・24GB許容、起動から最大7200秒、process最大5400秒、計画予算$1、追加epoch/再借用/通常配置なし。

- 試験Pod：`5u7ye0pqq3ppvp`、`cocolon-4b-diag-20261024`、RTX3090 24GB×1、Community On-Demand。GPU$0.22/h、disk込み表示約$0.23/h。既存Podは未変更。A4000はSecure/Communityとも空きなし、A5000候補はCUDA12.4の不適合表示。新GPUへの学習試行はまだ0のまま、許容24GB/単価上限内の適合候補を選んだ。
- 公式image：`runpod/pytorch:1.4.1-cu1281-torch260-ubuntu2404`。実測はPython3.12.3、Torch2.6.0+cu126、BF16/CUDA true、RTX3090。UIのimage名と実Torch CUDA buildを同一と推測しない。/workspaceは40GB XFSの独立マウント、空き約39GiBを確認。containerは公式推奨に合わせ50GB、合計90GBへ調整し、最大2hのGPU+稼働disk見積りは約$0.465、停止後volume24hを加えても約$0.732で計画$1内。実請求hard capではない。
- 起動要求UNIX `1792839474.788`。準備開始枠は`1792841274.788`（起動から30分）、Podの終了上限は`1792846674.788`（2時間）。華恋が同じブラウザのPod状態を見て手動停止する。process timeoutはPodを止めない。起動途中で中断した新sessionは、このPodの状態と期限を先に確認し、残り時間がない場合は追加実行せず停止・回収へ進む。
- 実行sourceはCocolon `27b06f19e222b4a8ce64634f259a81db0f8c8238`、API `02c0b943c96b67cb32354e1d3352a00dcb768e64`。dataset2教師/EFREE6、2update/16生成/4NLLを維持。取得後に、このPodの実単価・マウント・承認を同じruntime planへ記録する。配布用execution_plan.jsonは複製先の自動有効化を避ける非実行templateを保持し、承認済み一回のactual planとは区別する。
- 現時点：container起動/Jupyter接続/実環境とmount確認済み。固定4依存のinstallを別venvで準備中、既存Torchをconstraintで固定。重み本体取得・学習・推論・adapter・商品受入れは0。認証の秘密値・接続token・account情報は記録しない。

この節は承認とlive checkpoint。完了証拠ではない。GPU費用・生成結果・adapter3fileとarchiveのPod外保存・全文照合、Pod停止/削除の実結果を後続の同節結果へ追加する。通常API/DB/Render/RN/merge/deploy変更0、正式0/3・PRODUCT_NOT_CLEAR・candidate_ready=false・automatic_progression=false。構造差分なし。

### 15.1 一回の診断processを開始（baseline保存を確認）

固定4依存の導入とQwen class importが成功し、Torch2.6.0+cu126/実path/CUDA12.6は不変。取得code/datasetは固定27b06f19の2教師/EFREE6・SHA検証が成功。このPodだけのactual planに承認、GPU$0.22/h、free最低22GiB、観測済み40GB XFS、Pod期限と停止担当を記録した。

実run ID `20261024-110719-dbe3c1bb`、run wrapper PID2892、起動UTC11:07:13。run_attemptのある同じdirectoryで一度だけ開始。Pod経過776秒時点でrun.json RUNNING/stage before、before_nll2行・before raw3行を保存確認。勾配更新・adapter・afterはこの確認時点で未実施。nvidia-smiの瞬間使用16376MiB/24576MiBはpeakや16GB不適合の確定ではない。因果conv/linear attentionの追加kernelなしで公式reference実装を使用しており、warningをエラーと扱わず、実行途中の依存追加や設定変更はしていない。

### 15.2 重み入り途中退避をPod外で受領・照合

Pod経過1074秒で2update完了、stage after_saved_adapter_reload、before NLL2/生成8、training2、after NLL2/生成1を確認。経過1319秒でafter生成5/8。新規モデル呼出し・追加診断は行わず、同じrunの残りを継続している。

最初のarchive（stage adapter_saved_before_reload）をJupyterのDownloadからPod外へ受領。archive SHA256 `7dc38f4867911c58c7b3853f9e605d5d12d38c2abc772d9b7381da0e95968b7f`、adapter本体SHA256 `56cf9b8a2f9e8c256b9e6bbedfc9b05efacb71a6fb4d28f53719d12f147b4005`。全22memberの集合/bytes/SHA、固定source/revision/profile、実safetensors32tensorのshape/dtype/offset/全値finiteをPod外で確認。3,353,127bytesの重み入り原本を永続保存済み（private owner `libfile_d9425b1c05d8819180c37eee5a67ddd1`、version0）。まだ最終archiveではなく、最終版で同じ保存identityを更新する予定。認証token/credential/base weights/cacheを含めない。

初回の勾配normは訂正行0.24094069、初回行0.43510807で、非0/finite。学習前NLLは初回0.38451940/訂正0.17994213。これを品質改善率にはしない。受領したbefore rawのFIT2を固定API02c0b943へCPU接続した結果は採用0/2、本文0/2、範囲外EFREE6は未評価6。初回INVALID_EVIDENCE、訂正semantic_shape_invalidで、モデル/revision/messagesのidentityは一致。原rawの修正やfixture置換は行わない。afterの採否・全本文は最終受領後に比較する。

### 15.3 最終結果・重み回収・Pod停止/削除（この一回を終了）

実runは`DIAGNOSTIC_COMPLETE_NOT_QUALITY_ACCEPTED`/exit0。2update、before/after各8生成・NLL各2、保存adapter非学習reloadを完了。run内894.31秒、全16正常stop/JSON構文成功/打切り0。加重教師NLL0.25527284→0.24949186、2/2低下。観測品質改善率ではない。GPUは24GB RTX3090、peak allocated14.954GiB/reserved17.545GiBで、16GB適合へ換算しない。

最終archiveをPod外で全24memberの集合/bytes/SHA、adapter3fileの実体、safetensors32tensorのshape/dtype/offset/全値finiteまで照合した。最終archive SHA256 `3ef2e2d88391b3eda7c191f23e32ca3591f09251f65fe08a4b211f0194fd3bcd`、adapter本体 `56cf9b8a2f9e8c256b9e6bbedfc9b05efacb71a6fb4d28f53719d12f147b4005` は途中版と不変。private owner `libfile_d9425b1c05d8819180c37eee5a67ddd1` version1/3,365,321bytesへ保存し、返却identityをlocal metadataへ記録。途中版version0を最終版と混同しない。

固定rawをAPI02c0b943へ接続した実結果はbefore0/2・after0/2採用、本文も0/2。初回のfield外根拠・形式不整合が残り、訂正後は説明文が具体化しても旧意味/不正refが残る。afterは初回/訂正ともINVALID_EVIDENCEで停止した。EFREE6はscope外の未評価6で、採用失敗6や独立未知評価へ加算しない。全16本文を内部pre-screenし、E04の残存すっきり等の局所変化と、E03の達成感補完/英語指示コピー・E05の矛盾label等の悪化が混在する。自然な受容・一般化の品質向上は未確認。human Product Read・商品受入れではない。

回収・永続保存後、試験Pod`5u7ye0pqq3ppvp`のStopを実行し、Compute/Container storageのNot runningを確認。削除dialog表示時にユーザーの処理中断があったため、再開後に現dialogを再確認してから同じPodだけをTerminateした。停止要求記録UNIX1792841332.542、削除要求1792841467.596、削除後の一覧/名前検索で不存在確認1792841550.217。起動から停止は約31分、削除確認まで約35分で2h内。GPU単価は$0.22/hで、起動要求〜停止要求の約31分との積は約$0.11。画面総単価約$0.23/hを、GPU停止後も含む削除確認まで約35分の全区間へ適用した保守概算は約$0.13（個別明細/税等は未照合）。既存8Podは未変更、新規Pod1・学習試行1・再実行0・追加チャージ0。この一回は終了し、新GPUや追加生成の許可へ継承しない。

[実結果・全raw採否・全本文比較](../observation_learning/trials/2026-10-24-qwen4b-cmee-diagnostic/README.md)を既存trials配下5fileへ保存。新4Bpack README、観測入口、全機能00、全file01A、本weeklyを同じ差分単位で更新。API/製品code/意味schema/採用条件/旧教師/依存定義/通常DB/Render/RN/merge/deployは変更0、STRUCTURE_MAP_DELTA_NONE（実行結果と所在のみ）。限定TECHNICAL_CREDIT、product_credit=0・正式0/3・PRODUCT_NOT_CLEAR・candidate_ready=false・automatic_progression=false・全体54.50％を維持。

**次の最小候補：** 既存`model_candidate_source.py`のOUTPUT_SPECの座標文を各field先頭0/Unicode scalar/`field[start:end]==quote`へ短く置換し、bindings配列・必須fieldの形を明示する。意味採用を緩めず、同じ2教師のmessages/hash/token長とAPI pinを同時にCPU確認する。訂正promptの余裕は165tokenで、長い追記をしない。これは未実装で、意味更新/受容が同時に直るとも、追加学習が十分とも断定しない。原raw補修・teacher置換・epoch増量・再試験はしていない。


<a id="20261024-4b-output-spec-cpu-repair"></a>
## 16. 実拒否原因の出力指示・教材CPU修復（完了・新実GPU未実施）

Mashの「4B学習＋CMEE接続を進めて」を受領し、§15.3の最小候補を実装した。前回承認一回の再実行ではない。OBSERVED_BLOCKER_MINIMAL_FIX / Rule18 LEVEL_2の既存設計内修復として、根拠座標/必須shapeの説明だけを既存OUTPUT_SPECへ反映。採用条件・意味schema・対応構文・独立本文検査は不変。説明文字列をそのままpredicate等の値へコピーしない点も明記した。

API [1dabc4f](https://github.com/MassyuRed/mashos-api/commit/1dabc4f196ae283264bf5e364e117a5d571af6a7) はmodel_candidate_source.pyと既存testの2fileだけ。source＋meaning対象54 PASS/FAIL0、既存Pydantic warning1。新6件の誤座標2種・conflicts欠落・bindings object・surface誤nest・説明コピーを引き続き拒否し、rawを補修しない。独立agentは読取専用、華恋rootのみが編集/検証/反映。商品整合PRODUCT_ROUTE_ALIGNED、最終技術判断TECHNICALLY_ADMISSIBLE。

同じ2教師のuser output_spec、train_messages、既読standalone EFREE6 proxyの指示、dataset hash/API pinを同期。system/本人source/native prior/assistant全文/source_refs/品質gold=falseは不変。合成target2件は新実messagesと一致して意味/本文まで通り、旧messagesを混ぜた2件はINPUT_MESSAGES_MISMATCH。モデルrawの成功には数えない。旧9教師・旧eval・回収重み・§15の実結果5fileは不変、旧runを新packで再評価/再分類していない。

既存pack11検査成功。実tokenizer/indexをoffline cacheだけで測定し、初回3085+1094=4179、訂正後6078+1877=7955。生成枠最大6078+2048=8126<=8192、余白66、前版からprompt各+99。全source/prior/教師/EOSと16moduleを保持し、context拡張/切捨て/重み読込/GPU/実推論0。local Python3.12.14/pytest8.4.1/subtests0.14.2と必要roleを再確認。PR37 exact46環境や最新索引完成へ換算せず、既存の索引未成立を保持してfresh原本を直接読んだ。

現在のcpu_raw_consumer_results.jsonとcpu_tokenization_results.jsonは新API/manifestの今回CPU結果。cpu_connection_results.jsonは意味/target不変の前版合成原本で再生成していない。pack8file＋全機能00＋本weeklyの計10fileを同期し、全体設計・全file地図・current mapsは確認のうえ構造差分がないためchurnしない。STRUCTURE_MAP_DELTA_NONE、限定TECHNICAL_CREDIT、商品0/正式0/3/全体54.50％/candidate_ready=false/automatic_progression=falseを維持。

**残件と次の具体案：** 新指示での実4B生成/学習は0。実CMEE採用は前版before0/2・after0/2のまま、意味訂正/自然な受容/動的一往復/通常保存再読は未成立。[同じ2教師×1epoch・前後16生成の修正版一回案](../observation_learning/training/2026-10-24-emlis-4b-training/README.md#revised-gpu-diagnostic-proposal)を、16GB優先/24GB許容・新規Pod1台/試行1・最大2h/process5400秒・計画$1・回収照合後の試験Pod停止削除まで具体化した。旧run/adapterへの追加epochではなく、修正版のbase前後を観測する新規案。新しい有料一回の承認前は未実行で、planの有料flags=false/実単価nullを維持する。モデル再選定・採用緩和・raw補修・自動反復・通常配置へ進まない。
