# AR-01 — 本人宛表現7差分の実学習と全34比較

2026-11-09 JST。Mashが前回確認した実行コードと架空教材7件の差分を、同じ既存Pod f1lle4xwq3wjlnへ送信することと学習・比較の続行を明示承認。準備済みと同一SHAのZIPを送信し、一候補を実行した。**学習・比較・原本回収・保存再読は実施済み、候補は通常不採用。人物・語り手・意味保持の全体修復は未完了。**

## 今回実行したもの

旧36架空教師の原source・metadata・SYSTEM/user・参照は不変、本人宛を明示するtarget7件だけの表現変更。既存db3242初期adapterから36件各1回・LR1e-5・fresh optimizerのassistant-only SFTを行った。V8は今回学習から除外。実tokenizer CPU preflightで全36教師・比較34のmessages／参照一致、原文切り詰めなし・教師最大720tokensを確認した。旧before34は原bytesを再利用し、新生成へ数えない。

| 実測 | 結果 |
|---|---|
| 更新／学習compute | 36更新／34.935889秒、学習上限90秒内 |
| 全trial | 105.476390秒、上限300秒内。upload・保持・元提供復元等は別 |
| 新生成 | 診断8＋既使用development評価26＝34、全stop、生成43.406543秒、再生成／retry0 |
| 保存後の重み | 112有限F32／3,833,856params、全112変更。保存後fresh base＋非学習reloadで全値一致。Pod外でも112tensorの型・要素数・有限性を実確認 |
| 候補identity | weight 6b3df8c9efdda1e97987b3479fd2b5d25f1520cec84883f228f285f087f7a794、config 65bade7bf109ff316ee92fbce4a8e60487c958f23751fde8011abea69e7b50ae |
| model load／peak | 2load。allocated9,623,211,520／reserved9,814,671,360bytes。元提供を止めた有界trialの値で、同時学習の容量証明でない |
| 通常提供への復元 | 旧PID24179→26784、元argv／env／cwd・server source・Analysis重みを保持、health200。候補を通常設定へ入れていない |

実GPUはRTX4000 Ada Generation／20475MiB。新レンタル・プラン変更なし。保持課金・請求額・現単価の再照会は今回行わず、105秒だけを総費用としない。厳密optimizer再開やfresh36だけのモデルとは扱わない。

## 全34本文を原sourceと読んだ結果

rootと独立担当が全34の原二欄・旧before・新afterを読んだ。19本文不変／15変化。旧beforeも今回source/messageと全件一致するが、未知・未使用評価ではない。旧44との比較にはV8除外もあり、7表現だけの因果効果は特定していない。学習平均NLL0.458350→0.367495を意味品質へ換算しない。

| 範囲 | 実本文で確認したこと |
|---|---|
| 限定的な前進 | NEXT8 EVAL06で原文にない気づき表現を現在の思いへ戻す、EVAL07でgeneric挨拶除去、TIME01で事前認識と今の後悔を併せて受け取る |
| 継続する問題 | ROLE02の不適切な二人称、TRANSFER06の頼む人／頼まれる人の反転、V05の文法不成立が残る |
| 新たな退行 | TRANSFER05で書き手の行為がEmlisの一人称へ戻る。TRANSFER02で本人の判断意向が助言へ変わる。TRANSFER03で喜びの対象が役立てたことから貸したことへずれる |
| 正しい短文／省略 | V02は旧反転断定を除き最小の受け取りへ短くなるが、全役割の修復証明にはならない。短いこと・全事実を再掲しないことだけで失敗にしない。否定・不明・再参加意向・短い受け取り等の既成立も保持 |

生成34に新しい二人称語は出なかった。二人称必須という新仕様にはせず、今回の7表現仮説が人物・語り手の修復へ届かなかった事実として保持する。通常不採用、Mashへ失敗本文のProduct Readを依頼しない。華恋の開発上の読解をMashの正式受入れへ昇格しない。

## 同26rawの現保存経路

新しいprovider接続や再生成を行わず、捕捉した評価26だけ実SelfHostedNaturalReplySource＋現c655 service＋隔離PGlite0.5.8へ一回渡した。診断8は対象外。

全26 FINAL保存・同／新service GET一致。本文は既存providerの外側空白strip後にhash一致し、語句書換えは0。全USER sourceとGET時thread／events不変、各受領でprovider／mockHTTP各1、GET時provider／reader／Engine0、retry0。captureとSQL projectionのsource参照は18一致／user_id投影差8で、両参照を保存し各再計算した。

保存readerは25未判定／1範囲内非衝突、33節中parsed／checked1・未照合32、全文coverage=false。保存できたことや機械非衝突を意味品質へ換算しない。

回収source snapshotのcode／SQL1722fileは現c655 treeの1719一致、差3はnatural_reply.py／natural_reply_meaning.py／未使用application test。元snapshotを保ち、別local copyのnatural3fileだけ現c655へoverlayして通常prepareの実messages一致を全26で確認した。現行test tree全体を実行したとはしない。pytest suiteは追加実行せず、既存utilityとSQL再生で今回の経路を直接確認した。

## 回収と現在地

Pod出力ZIPは40,215,710bytes／SHA256 030d356ac3f953ca0ffea4922be0115ed5581e9fa0c928a7ed48e88c5d73a5b9。CRCと1790memberの原bytes／hashをPod外で照合。privateに実teacher／messages／beforeとafter／全34読解／重み／SQL実結果を保全し、GitHubへ私的原文は出さない。[本文なし実測](addressee36_execution_summary.json)。[準備時点の記録](addressee36_preparation_review.md)は履歴として保持し、送信承認待ちは今回解消した。

今回API商品source・Render配置・実Supabase・RN／build・通常model設定変更0。**STRUCTURE_MAP_DELTA_NONE**：研究用候補の実行だけで、新作者・型・wire・保存責務なし。

次はAR-01を続け、今回残った受け手反転と語り手／感情対象のずれを、既存教師の一要素対照・旧meaning obligations／body inverseの人物対応から切り分け、現naturalの単一修復へつなぐ。評価source／失敗rawを教師化せず、今回36や旧16／44の単純周回、同prompt周回、readerだけの完成、新しい統制ownerの追加へ戻さない。AR-01全体・AR-02〜08・全資産活用・通常意味品質・本人端末／正式受入れは未完了。
