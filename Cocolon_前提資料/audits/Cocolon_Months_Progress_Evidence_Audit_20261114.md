# Cocolon／CMEE：数か月で何が変わったかの証拠監査

監査日：2026-11-14  
対象期間：2026-07-01〜2026-11-14。旧アプリは7月末、CMEEは8月の実コードを比較起点とし、9〜11月の接続・実出力・通常反映を追う。  
依頼：作業量の説明ではなく、アプリの完成へ結び付いた変化と、結び付かなかった作業を証拠で示す。

## 1. 結論

**変化はある。CMEEは8月のEmlis単入力・アプリ未接続の実装から、本人回答による意味更新、モデル候補の採用、保存後の再開、Pieceの本文、Analysisのgraphと本文へ接続する実コードへ増えている。Pieceの本人画像保存、Analysisの本人表示と裏更新も、日付付きの実利用記録がある。**

**ただし、数か月を使って商品中核の一般品質を完成させたとは証明できない。** 7〜8月の商品不合格は原記録に残り、11月の原出力にも復唱、感情の欠落、未根拠な関係づけ、コピー中心のPiece、日本語の不自然さが残る。補助経路の活用全体、一般的な本人訂正、長履歴の意味理解、IF／Saved、最新同版の端末確認、課金・配布のリリース確認も閉じていない。

したがって、「何もコードが増えていない」は実物と一致しないが、**「時間と費用を使っただけの商品完成を返せていない」という問題は否定できない。** 意図、作業数、文書量、検査件数ではこの不足を相殺しない。

## 2. 旧版から現在へ、何が変わったか

| 対象 | 数か月前の実体 | 11/14までに変わった結果 | 証拠と完成の限界 |
|---|---|---|---|
| CMEEの入口 | 8月はEmlis単入力・offline限定。通常API／DB／RNへ未接続 | 9月thread／本人回答更新、10月実4B候補採用と保存再開、現在はPiece・Analysis専用dispatchと通常Emlisのpackage利用 | 旧／現sourceと過去実rawを照合。全naturalが同じgenerateを通るわけではなく、全一般入力の意味保証もない |
| Emlisの問いと回答 | 単発観測から、9月に問い・一回答・skip等のthreadへ | 意味checkpoint、回答後本文、複数回の上限、問いを受け取る設定、本人の二入力訂正履歴を追加 | 実コード・通常DB反映を確認。全ての一般回答／訂正を正しく理解できる完成ではない |
| Emlisの履歴・本人フレーム | 保存はあっても当回・履歴・本人解釈の出所の扱いが不足 | plan別の材料、本人補足、本人の確認／訂正対象、依存失効を接続 | 材料がモデルへ渡ることと、本文が正しく利用することは別。11/13原HTTPに欠落・不当な一般化が残る |
| Emlisのモデル接続 | 8月の固定的候補。10月前半でも実モデル・通常利用は別段階 | 4B自然応答の受領→保存→同本文再読へ。6701本人確認の当時記録あり | 10/31実raw・隔離SQLは原物再読。11/1本人確認は当時の議事録の引用・DB転記で、今回の端末再確認ではない |
| Pieceの商品結果 | 8月初めのコードは問い＋答えのQ&A画像 | 本人の考えを文章化する定義、CMEE本文、二欄の別source、本人履歴／削除、同版画像へ | 定義変更だけを実装成功へ数えない。9月開発候補→10月通常配置→11月本人保存を分ける |
| Pieceの本人画像保存 | 開発PNGや保存経路の検証が中心 | 11/1、7001で画像生成→一覧→iPhone写真保存の本人確認記録。7101以降Emlis表記等 | この成果を最新11/14の本人一巡、全形式／全色／Share／Androidへ広げない |
| Pieceの最新回答 | 原入力だけ、または限定的な補足 | 原入力＋明示した最新一回答を別sourceで利用。明示REVISE／WITHDRAWも通常DB／APIへ反映 | 一回答の実4B原本と、後続第2／3回答の合成保存を分ける。一般訂正・多段更新は未完 |
| Pieceの文章品質 | 有限の原文保持・常体化 | 限定入力で役割への置換、本人反復の省略、時制回復あり | 直近試行には本文全bytes同一・編集改善0もある。4B通常selectorは運用記録でOFF。一般編集品質完成ではない |
| Analysisの中枢 | 8月旧mapは役割ラベル等から固定結果文。10/3基準engineにAnalysis dispatchなし | 本人保存source→Analysis専用CMEE→根拠付きnode／edgeと同一graph由来の本文→保存／再読 | 旧経路はlegacyとして残る。専用経路の実接続はあるが、一般的な役割・条件差・記録間関係の品質は未完 |
| Analysisの蓄積 | 期間ID集合と件数制限のある旧経路 | 本人全保存sourceのsnapshot、immutable保存、月次当時版・plan別閲覧 | 全件取得は、巨大履歴を4Bが意味を落とさず理解した証明ではない |
| Analysisの本人表示 | 新CMEE経路の端末未接続 | 11/8、7701の図・本文・node詳細の本人確認記録、通常保存artifactと根拠HTTPの結果JSON | 本人6画像本体は今回再取得していない。内容品質の正式受入れや全edge確認はない |
| Analysisの更新 | 画面から重い生成待ちが発生 | 入力保存→worker裏更新→保存版読取。7801でjob doneと本人表示記録 | 466msは保存版取得の値。通知式を採用済みで、生成時間そのものを未解決blockerへ戻さない。完了通知の本人配送確認は残る |
| 本人訂正の下流利用 | 訂正を保存してもAnalysisのsource snapshotから欠落する箇所があった | 11/14、本人訂正OPERATIONと対象AI locator、限定的な有効節・置換節をAnalysisへ接続。Pieceにも明示更新を接続 | map項目／線を指定する二入力訂正UI、一般自由説明の解釈、全下流伝播、natural新Analysis意味artifactは未完 |
| アプリ共通 | 入力・認証・下書き・3テーマ・IAP／復元・Nexus等の多くは7月末に既存 | Material、元色復帰、設定統合、通知遷移、購入復元の失敗伝播・競合／owner隔離等の個別差分 | 既存機能一式をこの数か月の新規成果へ再計上しない。実ストア購入等のリリース受入れは未証明 |
| 通常配置 | ソースや隔離検証だけで止まっていた時期がある | 今回独立読取でAPI cb6301ed Live、worker 75e526d1 Live、Supabaseの該当migration／RPCの存在を確認 | 配置は実ユーザーの最新全機能一巡や商品品質完成の証明ではない |

各行の固定commit／path／実行原本へのリンクと、詳しい前後差は後続の領域別章に置く。

## 3. 本文そのものが変わった証拠

### 3.1 本人回答により、行為者と喜びの対象が更新された実例

10/25の架空の椅子題材では、初回本文は「全部一人で直せたことが、うれしかったのですね。」だった。本人の訂正を渡した後、実4B→CMEEの本文は「友人に手順を教わり、一緒に椅子を直したのですね。」「捨てずにまた使えるようになったことが、うれしかったのですね。」へ変化した。

原入力を機械的に再掲し続けたのではなく、単独／共同という行為者と、何が嬉しかったかという本人評価の対象を更新している。実rawと採用されたCMEE結果が一致することも今回再読した。

ただし、既知の架空題材に対するoffline実モデルの限定成功である。一般入力・通常本人利用・自然な応答品質の完成ではない。

原本：[実raw](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/observation_learning/trials/2026-10-24-qwen4b-cmee-diagnostic/model_roundtrip_20261025/initial_raw.jsonl)、[CMEE採用結果](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/observation_learning/trials/2026-10-24-qwen4b-cmee-diagnostic/model_roundtrip_20261025/initial_cmee.json)、[初回／訂正後の保存結果](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/observation_learning/trials/2026-10-24-qwen4b-cmee-diagnostic/service_persistence_20261025/result.json)。

### 3.2 本人の訂正・撤回が、Pieceの確定本文へ効く実例

11/14の架空入力は「褒められたのに、嬉しくなかった。私は仕事を続けたい。」、行動欄は「私は資料を調べた。」。

本人が「『私は仕事を続けたい』ではなく『私は家族を守りたい』です」と訂正した実4B出力と保存本文は、元の対比と行動を残し、旧希望を除いて「私は家族を守りたい。」を採った。

同じ希望を「取り消します」と撤回した別実出力では、残る二文だけになり、旧希望も撤回命令も逆の意図も作品へ追加していない。

これは旧ADD限定では扱えなかった入力が作品に正しく効いた限定的な変化である。**一方、文章は原文に近く、文章構成・表現力が一般的に改善した証拠にはならない。** この新訂正／撤回のnative画像・本人端末は未確認。別の旧ADD2／3で取得したPNGをこの成功へ流用しない。

原本：[11/14実rawと保存本文のZIP・版2](https://chatgpt.com/library?file_id=libfile_fde3_f-6af69c8803fc8191bf7c35bf7718f6cc_2f7470f963808191aaebf050935e72de&account_id=personal)。今回選択memberのraw・hash・field順本文・保存本文を直接再読した。詳細はPiece章。

### 3.3 改善しなかった実例も隠さない

- Pieceの過去「好きでした」を現在「好きだ」に変えた候補は不採用。その後「好きだった」へ戻した。これは観測された退行の回復であり、以前から正しかった旧版に対する純増とは区別する。
- 11/14のPiece編集試行には、旧新の実出力が全bytes同一だったものがある。新しい試行回数を増やしても、その試行の編集改善は0。
- 11/13の本人フレーム材料を使ったEmlis実出力には、今回の悲しみの欠落、別出来事の未根拠な結合、自責傾向の追加が残り、新候補は不採用。材料の改善を本文品質の改善へ換算しない。
- Analysisの訂正後実結果には、同じ記録の別欄を別記録と呼ぶ、希望を現在の本人基準へ広げる、記録間を未証明に結ぶ等の不足が残る。

「意味を保存できた」「同じ本文で画像を作れた」と「その意味・文章が商品として十分」は別の結果である。

## 4. 数か月の商品完成が伸びなかった理由

証拠に照らした華恋の評価は次のとおり。

1. **7〜8月は、商品本文へ届かない補助・統制に偏り、実際の商品判定が不合格だった。** 8/13の100件はPASS0、8/16のCMEE exact8も本人set-level FAIL。機械検査の成功を商品改善の説明へ使えない。これは当時の原記録が認めている失敗である。
2. **9〜11月には接続・状態・保存・画像・表示の実増分があるが、完成を決める一般的な意味理解と文章品質が閉じていない。** 同じ「動く」の報告を積み重ねても、読んで納得できる本文・図が安定しなければ中核商品の完成へ換算できない。
3. **限定試験の成功が通常利用へ届いていない部分がある。** Piece研究4Bは運用記録で通常selector OFF、一般入力は未対応、最新訂正の端末一巡も未確認。研究成果、通常DB／API反映、本人の最新端末、正式受入れを混ぜると見かけの進捗だけが膨らむ。
4. **既存機能や退行の回復を新規完成として数えてはならない。** 入力・認証・下書き・IAPの存在は7月末からのものがあり、時制回復は既に正しかった版を戻す作業も含む。
5. **アプリ全体では未完成の商品単位が残る。** IF／Saved、一般的な訂正の全体反映、長履歴品質、Androidの通常Piece、実課金／退会cleanup／配布等の受入れは別々に残る。CMEEの構造が増えたことだけではこれらは閉じない。

この評価は「一工程で止めて報告した」一件の問題だけではない。**品質不合格の核心を長期間残し、補助・接続の成果を、利用者が受け取る完成した商品へ十分に変えられていないことが問題**である。

過去の54.50%／61.625%等の管理上の完成率は、同条件で測った商品能力の実測値ではない。本監査では、それを数か月の成果やリリース準備の証明へ採用せず、新たな主観％も出さない。

## 5. 今回の確認範囲と限界

今回freshに固定した商品原本：

- Cocolon PR30：`560908840b6a60368553645edf4b725a34fd3f90`
- mashos-api PR3：`cb6301ed9a0b77fa7342e71c078d64a9075dad7a`

全体現在地、作業姿勢とルール、恒久インシデント、最新と過去の週次、三中核とCMEEの構造地図、補助経路詳細設計、両repoの再帰treeを起点に、全機能を照合した。関連する旧／現source、実出力raw、保存結果、CI原本、通常配置・DB metadataを確認し、以下の章へ根拠を残した。

ただし、**全期間の全commit diff、両repo全ファイルの全行、非公開100件の全本文、全実機画像を今回再読した全数監査ではない。** 資料にそう書いてあること、今回開いた実コード・実raw、今回独立照会した稼働状態、当時の本人確認記録を分ける。未閲覧を「全て確認済み」へ変換しない。

今回の新しい生成・学習・GPU利用・DB書込み・配置・build／TestFlight・端末操作は0。過去の実出力を再取得して照合する監査であり、新しい商品品質改善を行った報告ではない。レポート保存も商品完成率へ加点しない。

11/14のMash決定どおり、build／TestFlight／本人実機の保留と、通常DB／APIまでの作業完了は分ける。実機保留を補助経路全体の待機理由にしない。リリース日は未定、12/6「提出可能候補」という予定を、この監査で達成可能と証明した扱いにもしない。

**全体現在地・構造地図の状態変更はなし。今回の差分は、過去と現在の証拠を比較した本監査報告の新規作成だけ。STRUCTURE_MAP_DELTA_NONE：製品実装とcurrent routeを変更していない。**

以下、各領域の旧版→現版、実結果、未完了、固定URLを収録する。



## 6. CMEE本体と7〜11月の変化

監査目的：数か月でCMEEが何を実装し、どこまで実際につながったかを、旧source・現source・保存された実行原本で区分する。製品進捗への新規加点は行わない。今回の新GPU実行・DB操作・配置・生成・製品書込みは0。

### 固定した現物と、証拠の読み方

- fresh Cocolon PR30：`560908840b6a60368553645edf4b725a34fd3f90`。
- fresh API PR3：`cb6301ed9a0b77fa7342e71c078d64a9075dad7a`。
- 現物sourceは上記exact commitから直接取得。旧8月・9月sourceはそれぞれの履歴commitから直接取得した。
- 保存された実行原本は当時の実行記録として再読した。今回再実行したという意味ではなく、当時のモデル稼働・保存が現在も同じ状態にある保証でもない。
- 当時の広域監査の引用、一次body-free receiptの直接再読、実rawとCMEE採用物の照合、現sourceの実callsiteは別の証拠である。hash・test件数・ファイル存在だけを意味理解や本人品質の証明にしない。
- Emlisの機能全体、Piece UI／画像全体、分析内容全体の監査は各担当の証拠と併せる。本資料はCMEE共有本体と接続責務を主に扱う。

### 結論

**CMEEは実装として出来上がってきている。8月の「Emlis単入力だけのoffline callable」から、現在は原入力と本人回答の出所、更新意味checkpoint、モデル候補の受領・採否・保存再開、Pieceの意味／本文、分析の図と本文を扱う実コードとアプリ接点へ増えている。**

ただし「汎用意味理解・文章生成・全補助資産継承が完成した」「三中核すべてが同じ単一generateを通り、一般品質が合格した」とは証明できない。通常Emlis naturalは同packageの別分岐を通る。旧exact8と100件の機械結果は本人品質不合格であり、その事実を新しい構造の増分で消さない。

### 1. 7〜8月に既にあった資産と、不合格だった商品

広域の7/1〜8/13は既存の[安全装置全履歴監査](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_安全装置全履歴_20260701_20260813.md#L1736)を参照した。32系列・横断機構は存在するが、今回その全期間の全commit diffと全実本文を再監査したとはしない。

直接再読した[8/13 exact100一次receipt](https://github.com/MassyuRed/Cocolon/blob/da85f49459216f7e6ca2f8a46949def5a28db181/EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4BToG10_Exact100Closure_BodyFree_Receipt_20260813.json#L88)は、selected45／no_valid2／fail_close53、商品評定PASS0／MINOR2／MAJOR40／BLOCKER58、COMPLETE_REJECT。これは当時の結果の確認であり、今回private100本文を再評価した証明ではない。

旧CMEEの[8/16 engine L19–38](https://github.com/MassyuRed/mashos-api/blob/8accf28f39d29632fa830b88d56d01d0a05d78a3/ai/services/ai_inference/cocolon_meaning_experience_engine/engine.py#L19)は、EmlisのOBSERVE_AND_CLARIFYとOFFLINE_CANDIDATEだけを許可する。L40以降はsourceをfreezeしgraph／plan／artifactを作る実処理を持つ。**8月に何もなかったのではなく、通常API・保存・三商品へ接続していない縦接続だった。**

[旧emlis_v1a source L14–38](https://github.com/MassyuRed/mashos-api/blob/8accf28f39d29632fa830b88d56d01d0a05d78a3/ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_v1a.py#L14)に旧grounded reception／planと共有text coreの実importがある。全旧資産が未使用だったとも、全回収済みだったとも扱わない。

### 2. 構造8/8が本人品質の成功ではなかったこと

[旧runner L180–209](https://github.com/MassyuRed/mashos-api/blob/8accf28f39d29632fa830b88d56d01d0a05d78a3/ai/tools/cmee_v1a_i1sx_candidate_run.py#L180)はartifact／traceを保存するが、human acceptedは未判定のまま。[L212–255](https://github.com/MassyuRed/mashos-api/blob/8accf28f39d29632fa830b88d56d01d0a05d78a3/ai/tools/cmee_v1a_i1sx_candidate_run.py#L212)は構造数8/8で生成成功のterminalを決め、candidate_ready／product_read_evaluated／productionはfalse／0を保つ。exit0を品質PASSへ換算できない。

同じ評価head8acc・runner blobを指す[本人Product Read一次body-free receipt L8–44](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/docs/CMEE_V1A_I1SX_PrivateHumanProductRead_BodyFree_Receipt_20260816.json#L8)はreviewed8、set-level FAIL、exact8_acceptance_complete=false、product_credit0。個別severityはUNASSIGNEDのため、8件全部BLOCKERなどとは変換しない。

### 3. 9月 — 単入力から、回答と意味checkpointを持つ共有threadへ

| 旧→新の具体差 | 直接sourceの証拠 | 証明限界 |
|---|---|---|
| 8月は単入力のみ→9月はadmitted threadがあればthread engineへdispatch | [9/11 engine L39–41](https://github.com/MassyuRed/mashos-api/blob/23049fc00042b24682bb04d3f420d98ea16f77d5/ai/services/ai_inference/cocolon_meaning_experience_engine/engine.py#L39) | sourceの到達分岐。これだけで当時のlive有効化や端末成功ではない |
| offlineだけ→EMLIS_APPLICATION＋threadを許可、本文前に意味checkpointを作る入口 | [同L128–152](https://github.com/MassyuRed/mashos-api/blob/23049fc00042b24682bb04d3f420d98ea16f77d5/ai/services/ai_inference/cocolon_meaning_experience_engine/engine.py#L128) | 単独入力全体を無条件通常有効化する変更ではない |
| 原入力→初回本文＋別の問い→本人回答による更新、失敗時の意味保持 | [9月thread_engine L15–92](https://github.com/MassyuRed/mashos-api/blob/23049fc00042b24682bb04d3f420d98ea16f77d5/ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_engine.py#L15) | 一般自由文の品質・任意の回答理解まで完成した証拠ではない |

これは関数数やtest数ではなく、実際の入力型・mode・呼出し・返すcheckpointと状態が増えたsource差分である。

### 4. 10月 — 外部モデルとの受渡しを、採用・本文・再開へ接続

#### 4.1 準備だけだった段階を、実model成功へ混ぜない

10/23の[preparation_results.json L1–8](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/observation_learning/trials/2026-10-23-current-four/preparation_results.json#L1)を直接取得した。external inference0、DB／public API0、semantic adoption0、generated artifact0。固定stubを受領する準備である。

現在も[preparation.py L37–70](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/cocolon_meaning_experience_engine/preparation.py#L37)はimmutable requestとraw receiptを別に持ち、receipt.adoption_stateはNOT_ADOPTED。[同L241–247](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/cocolon_meaning_experience_engine/preparation.py#L241)も「raw受領は意味採用ではなく、providerをここで呼ばない」と実装している。

10/23の[Piece意味snapshot一次結果](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/observation_learning/trials/2026-10-23-current-four/piece_semantic_snapshot_results.json#L956)は同snapshot／artifactのactual_replay_identical=true。API4fd8db4fで原7field／意味・plan・本文の保存再読へ進んだ一方、[effectsとlimitations L1091以降](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/observation_learning/trials/2026-10-23-current-four/piece_semantic_snapshot_results.json#L1091)はmodel0・通常B8有効化0・一般言換え未完成を明記。原段落保持の限定実装である。

10/24最初の[4B診断run_summary](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/observation_learning/trials/2026-10-24-qwen4b-cmee-diagnostic/run_summary.json)は前後各8正常stopでも、FITの意味採用・本文が前後とも0/2。NLL低下や生成完走をCMEE接続成功へすり替えない。

#### 4.2 同じ実rawがCMEE採用物へ入ったことを照合した段階

10/25の[実初回raw](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/observation_learning/trials/2026-10-24-qwen4b-cmee-diagnostic/model_roundtrip_20261025/initial_raw.jsonl)と[実初回CMEE結果](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/observation_learning/trials/2026-10-24-qwen4b-cmee-diagnostic/model_roundtrip_20261025/initial_cmee.json)を両方直接取得し、JSONを読み、初回CMEEに保存されたraw_recordが元rawと全値同一であることを今回確認した。

- capture provider=local_transformers、model=Qwen/Qwen3.5-4B、finish_reason=stop。
- capture時のreceiptはNOT_ADOPTED、CMEE処理後はidentity_matches=true／messages_match=true、adoption=ADOPTED_PROVISIONAL、status=MEANING_AND_BODY_AVAILABLE、bodyとquestionが存在する。
- [run.json L342–384](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/observation_learning/trials/2026-10-24-qwen4b-cmee-diagnostic/model_roundtrip_20261025/run.json#L342)は実model2call、actual初回snapshotを訂正へ使用、意味／本文2、訂正更新3、最後は問なしEND、raw置換false／teacher送信falseを記録。

証明できるのは既知の架空椅子1題材でのoffline一往復である。モデル出力を採用して本人更新を適用できる中枢が動いた証拠だが、未知日本語・全core・通常Auth／API／端末品質の証明ではない。

保存原本の実本文では、初回の受け取りは「全部一人で直せたことが、うれしかったのですね。」だった。本人訂正後の保存本文は「友人に手順を教わり、一緒に椅子を直したのですね。」「捨てずにまた使えるようになったことが、うれしかったのですね。」へ変わり、読み直し注記も共同修理と喜びの対象への訂正を記録した。これは初回の単独修理という意味を保持し続けたのではなく、本人回答に従って行為の参加者と喜びの対象を更新した実例である。全文は上記CMEE結果と[初回／訂正後の保存結果](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/observation_learning/trials/2026-10-24-qwen4b-cmee-diagnostic/service_persistence_20261025/result.json)にある。ただし既知の教示familyの成功であり、別入力での意味品質を代表しない。

#### 4.3 意味を保存した後に本文処理が中断しても、モデル再取得なしで再開

まず[engine-only cold file result](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/observation_learning/trials/2026-10-24-qwen4b-cmee-diagnostic/service_persistence_20261025/result.json)は別processの初回／訂正後結果full_outcome_equal2/2、保存snapshot／checkpoint不変、新candidate call0を記録。ただしservice_saved_roundtrip=false／SQL=false。ファイル再開をDB保存へ換算しない。

後続の[identity02実service run](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/observation_learning/trials/2026-10-25-service-binding/identity_eval02/run.json#L438)は意味保存後中断→明示再開1回→同意味eventで本文保存、model再取得0。model実call2・隔離RPC30・保存本文2・最終ENDを記録し、normal_application_enabled=false／product_accepted=falseを保持する。

今回、summaryだけでなく[再読前snapshot](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/observation_learning/trials/2026-10-25-service-binding/identity_eval02/final_before_reads_snapshot.json)、[再読後snapshot](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/observation_learning/trials/2026-10-25-service-binding/identity_eval02/final_after_reads_snapshot.json)、[GET／start／同key回答結果](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/observation_learning/trials/2026-10-25-service-binding/identity_eval02/final_non_generating_reads.json)を直接取得した。比較すると変更top keyはnowだけ、thread・events・originalは全値同一。三つの再読結果はCOMPLETED／REFINED。非生成再読で保存状態を書換えないことの保存原本上の証拠である。今回SQLを再実行したわけではなく、過去実行の真偽を独立GPU・DBで再現した保証でもない。

### 5. 現在の三中核との実source接続

| current call chain | direct source | 8月から増えた責務と限界 |
|---|---|---|
| 共通Engineの型別dispatch | [engine.py L31–79](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/cocolon_meaning_experience_engine/engine.py#L31) | Analysis semantic map／quoted units／fields等、Piece semantic、各core request、Emlis threadへ実dispatch。8月のEmlis単入力のみとは異なる。各型が存在するだけで一般品質完成とはしない |
| 通常Emlis factory→service→natural分岐 | [factory L15–33](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/emlis_thread_factory.py#L15)、[service L940–1047](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/emlis_thread_service.py#L940)、[分岐L1050–1055](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/emlis_thread_service.py#L1050) | CMEE packageのprepare_natural_reply→source/Safety→既存問いcheckpoint→provider→validate→private意味比較→保存artifact。全naturalがMeaningExperienceEngine.generate本体を通るという図は誤り。receipt受領済みなら再callしない。比較失敗はUNASSESSED/full coverage falseで一般意味合格へ昇格しない |
| 通常Piece preview→configured model任意取得→CMEE→B8保持検査 | [preview L305–354](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/piece_v2_preview_service.py#L305)、[generation L267–344](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/piece_v2_generation.py#L267) | B8がCMEE結果のsource／planと実モデルbodyを再拘束し、保存済み原入力と別作品の差替えを拒否する。model候補の場合はraw blocksをcanonical本文として保持。通常モデルselectorは[factory L628–634](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/piece_model_source.py#L628)がoff／空ならNone。『通常Pieceすべて4B済み』とは言わない |
| 通常累積分析→configured model→CMEE map admission/compiler/realizer | [cumulative L638–646](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/analysis_cumulative_service.py#L638)、[同L726–749](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/analysis_cumulative_service.py#L726)、[map L40–47](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/analysis_semantic_map.py#L40)、[admission L2422–2461](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py#L2422) | modelのrequest／messages／raw hashを束縛し、CMEE compilerがgraphを作り唯一realizerへ渡す実接続。設定development・semantic source等の分岐条件があり、全分析を同一modeへ切替済みとはしない |

**共有しているのは、sourceの出所・保存前後identity・意味／本文の責務と各coreへの受口である。四番目の商品を増やしたのではなく、三商品へ異なる責任のまま接続する中枢になっている。** Emlis本文・Piece文・分析推定を本人sourceへ逆流させない境界は保持する。

### 6. 11月の補助資産回収で増えたものと、未証明の範囲

現sourceのnatural_replyは旧意味更新と原文anchorを[実importして利用 L260–323](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/cocolon_meaning_experience_engine/natural_reply.py#L260)、frame導出を[L416以降](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/cocolon_meaning_experience_engine/natural_reply.py#L416)で使い、旧共有部品を単に保管しているだけではない。一方で研究意味補助は[prepare L475以降](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/cocolon_meaning_experience_engine/natural_reply.py#L475)で既定false。補助が持つ意味を自由文が正しく利用したかは別の実結果で評価する必要がある。

最新詳細設計[§9.55](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/designs/cmee/Cocolon_CMEE_AuxiliaryAsset_Reuse_ImplementationDesign_20261108.md#auxiliary-normal-db-api-rollout-20261114)は、問い設定・二入力訂正履歴・frame対象／依存失効・最新ADD Piece等の既存9migrationと指定API99dbdaabの通常適用、稼働8関数の本文一致を記録する。これは今回のlive再照会ではなく実配置原記録の確認。新研究hint／新重み／Piece selector一括採用は0である。

[§9.61](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/designs/cmee/Cocolon_CMEE_AuxiliaryAsset_Reuse_ImplementationDesign_20261108.md#piece-latest-later-answer-update-20261114)までに第2／第3回答後の明示訂正・撤回のPiece通常DB／API適用へ進んだ記録がある。配布用build／TestFlight／本人実機を後回しにするMash決定を、DB／API単位の未完や全補助作業の待機へ戻さない。同版通常本人利用が未確認であることは別に保持する。

次のことは未証明として残る。

- 旧32系列・D01〜D51の全能力が、現三中核へ全て移管・常時適用されたこと。D51は51moduleではなく46責務／資産＋5判断／不足で、単純なfile数回収率は出せない。
- natural自由文の全節に対する独立意味coverage。現serviceは失敗時UNASSESSEDにし、natural artifactのanalysis_stateもNOT_GENERATED。作られていない分析材料を完成済みとしない。
- 役割・否定・時点・留保・訂正の全一般化、意味ある履歴利用、自然な本文。模型的な採用・保存・hash一致では品質を証明できない。
- 各coreの最新modeが実ユーザー通常経路で同時に機能し、本文・図・画像の品質を本人が承認したこと。個々の実接続・本人表示済み成果は各coreの原記録へ戻る。
- 長履歴全量、全下流の訂正／撤回伝播、IF／Saved等の完了。sourceの規模・commit数・test件数から完成率へ変換しない。

### 7. 再利用可能な確認結果

今回の証拠からは、CMEEが「資料だけ」「同じ単入力実装のまま」ではないことは示せる。単入力offline→thread意味checkpoint→実モデル候補採用→モデル再取得なしの意味／本文再開→Pieceと分析の現アプリ接点、という実装と実結果の増分がある。

同時に、当時のmachine GREEN・現在のcallgraph・通常DB／API適用のいずれも、一般文章の理解・生成品質や全補助資産継承完了を保証しない。正しい報告は、**中枢として動く部分と商品の接続は増えた。その中枢が全入力で正しく自然に理解・文章化できる完成状態にはまだ至っていない**、である。

履歴の一次receiptと旧sourceへの固定リンクは本章に記載した。今回の監査用複製は商品成果・新規商品進捗には数えない。


## 7. EmlisAIの旧版・現版・実出力

監査対象は「数か月で何が実際に変わったか」です。コード、取得済みの実モデル原出力、当時の本人確認記録、通常環境の反映を別々に扱います。検査件数・文書量・完了報告だけでは商品品質の実績に数えません。新規モデル呼出し、GPU、DB変更、配置、製品source変更は行っていません。

現在の照合基準は API PR3 **cb6301ed9a0b77fa7342e71c078d64a9075dad7a**（本監査末尾でもfresh再取得）、Cocolon PR30 **560908840b6a60368553645edf4b725a34fd3f90**。API最新でもEmlis serviceのblobは **7f8fff7284b49cff6bbef60e270fa3e9cd4524b0**で、朝の99dbdaabからEmlis本文作者が新たに改善されたわけではありません。最新cb6301edの主差分はPiece側の第2／3回答更新です。

**判断：8月のオフライン限定CMEEから、9月の問い・回答・保存・履歴機構、10月の本人端末への本文到達、11月の実4B初回応答と保存再読、問い・訂正・frameの通常DB／API適用までは進んでいます。一方、利用者が受け取る返答の一般品質と本人の最新判断を優先する理解は未達です。** 「何も実装していない」も「EmlisAI完成」も事実と合いません。実績として確実に言える中心は体験経路の実用化と限定機構の接続であり、数か月分の一般品質向上を証明する本人受入れ結果は今回の監査では得られていません。

証拠の区分：

- **直接コード**：固定commitの実ファイルを読取。実行・配置・商品品質の成功までは意味しません。
- **実出力原本**：Libraryから原ZIPを取得しSHA256を照合、実HTTP本文／source／保存DTOを直接再読。合成source・隔離SQL等の条件を明記します。
- **本人確認の当時記録**：本人の回答／画面確認が記された同時期の記録。今回、元の会話メッセージ・元の端末画像そのものまで再取得したとは扱いません。
- **通常DB／API**：通常構造・配置の成立。新しい本人認証での入力一巡や新RN配布、本文品質の合格とは区別します。

### 時系列の旧→新と、実際に成立したこと

| 時点 | 旧→新 | 日付／commit／実ファイルと直接source URL | 実結果・証拠の強さ | 今も越えていない範囲 |
|---|---|---|---|---|
| 8/15 起点 | CMEE上位設計→本人原文から限定artifactを作るオフラインcallable | API **d2b2ea5f74478396a3bf27895b0ecc8d0f805dc5**（8/15 15:44:51Z）。[engine.py](https://github.com/MassyuRed/mashos-api/blob/d2b2ea5f74478396a3bf27895b0ecc8d0f805dc5/ai/services/ai_inference/cocolon_meaning_experience_engine/engine.py#L19)、[emlis_v1a.py](https://github.com/MassyuRed/mashos-api/blob/d2b2ea5f74478396a3bf27895b0ecc8d0f805dc5/ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_v1a.py#L1047) | 実コードはEmlisのOFFLINE_CANDIDATEのみ許可し、source freeze→意味graph／plan→artifactを返します。API／productionからdisconnected、LIMITED、automatic_progression=falseを直接確認しました。設計だけではなく限定的な実装は既にありました。 | 通常アプリ入力・DB保存・本人への応答経路は未接続です。8月起点を「CMEEの実装そのものがゼロ」としません。**4e8d3978は9/1 commitなので8月の証拠にしません。** |
| 8/16 初回商品評価 | structural 8/8→本人による集合評価FAIL | 評価対象 **8accf28f39d29632fa830b88d56d01d0a05d78a3**。[当時のbody-free本人評価receipt](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/docs/CMEE_V1A_I1SX_PrivateHumanProductRead_BodyFree_Receipt_20260816.json)、[拘束記録](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_ProductNeglect_and_CMEE_ProductReadFailure_20260816.md) | receipt原JSONはHUMAN_PRODUCT_READ、reviewed8、set_level_verdict=FAIL、candidate_ready=false、product_credit=0。axis個別採点は未作成で、8件を勝手に8BLOCKERへ換算しません。入力言換え・少数文型・定型Receptionが中心だったという当時判断です。 | 技術的完全性と商品品質が別だという失敗が起点です。machine8/8を成果として再加算しません。今回raw私的8本文の全再読はしていません。 |
| 9/10 UTC〜9/11 JST Q1 | 初回一回の生成→一つの問い、本人回答を独立sourceとし意味checkpointから本文を更新 | API **973bade6f041745fc5661fc8b312288eba031313**（9/10 22:58:42Z）。[emlis_thread_engine.py](https://github.com/MassyuRed/mashos-api/blob/973bade6f041745fc5661fc8b312288eba031313/ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_engine.py#L15) | 実sourceで初回、QUESTION_PENDING、回答source、checkpoint要求、UNRESOLVED、NO_MATERIAL_UPDATE、REFINED／PARTIALLY_REFINEDを確認しました。更新本文に失敗した時もcheckpointを残し、古い本文を最新理解として返さない構造です。 | module先頭にprocess-local／no databaseと明記。これを通常DB適用・本人端末確認済みにしません。問いが発行されないことと十分理解を同一視できません。 |
| 9/11 Q2／Q3 | process-local Q1→認証application orchestration、保存・再送・適格履歴・Premium複数roundとframe判断 | API **75151a538478dbb450c2fb94f1c56ff89538fd77**（9/11 05:19:41Z）。[service](https://github.com/MassyuRed/mashos-api/blob/75151a538478dbb450c2fb94f1c56ff89538fd77/ai/services/ai_inference/emlis_thread_service.py#L221)、[Q3 SQL](https://github.com/MassyuRed/mashos-api/blob/75151a538478dbb450c2fb94f1c56ff89538fd77/supabase/migrations/20260911041749_emlis_q3_plan_rounds.sql)、[development gate](https://github.com/MassyuRed/mashos-api/blob/75151a538478dbb450c2fb94f1c56ff89538fd77/ai/services/ai_inference/emlis_thread_config.py) | 保存commitを使うstart／answer、GET非生成、同key replay、本人continue、CONFIRMED／REVISED／REJECTED frame、context/source guardsを直接確認。**当時の上限はFree／Plus1・Premium3**でした。機構の増分は実在します。 | development条件が必要な実装段階。当時のtest成功報告を実機／通常稼働と読み替えません。[9/12議事録](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20260912.md)自体も未質問感情の回答後欠落・累積理解不足を残しています。 |
| 10/10 本人端末到達 | アプリで無応答→6301で本文の描画まで到達。ただし品質FAIL | 対象生成API **7626e1f6e6cc7b2d8a71b9ea1032b840bbc9799b**。[当時service](https://github.com/MassyuRed/mashos-api/blob/7626e1f6e6cc7b2d8a71b9ea1032b840bbc9799b/ai/services/ai_inference/emlis_thread_service.py#L267)、[10/10当時記録](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/current_structure/01_emlis_ai_current_structure.md#2026-10-10--本人実機の本文表示を確認内容品質は不合格) | 任意memo NULLを生成viewだけ空文字化した版の稼働と、17:52 JSTの本人表示報告・添付画面の本文描画確認が当時記録にあります。実コードもQ3 service→CMEE→保存へ接続しています。**本人端末到達の記録**です。 | 10/14監査は明示評価・感情／対象の落ち、別欄行動への偏り、復唱・定型受容を確認。同じ私的入力の旧生成版と開発版で本文同一。[監査§3.5](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261010.md#35-emlisaiの実機応答監査と具体的な残件--2026-10-14追加)。元本人画像／会話の今回再取得は未了。現在もCMEE未接続だから復唱と説明するのは誤りです。 |
| 10/31 4B自然文・隔離保存 | 有限文法作者による表示→実4Bが任意長の自然文を返し、既存受領・保存・非生成再読へ通ることを実原本で確認 | [private原ZIP](https://chatgpt.com/library?file_id=libfile_6c7af4d2a68881919b3bd4fe8b63e561&account_id=personal)、v1、7,335,671byte、SHA256 **432fb4c1fd2fdcedb80285a9145f04e9ba22c8177be72e6280d87b1b77f57f20**。内部 `natural-examples-followup/gpu-results/all_results.json`、`integration_results.json`。11/1通常側の実装[factory744336c0](https://github.com/MassyuRed/mashos-api/blob/744336c0de999e271a755b441394f382548829ab/ai/services/ai_inference/emlis_thread_factory.py)、[natural_reply.py](https://github.com/MassyuRed/mashos-api/blob/744336c0de999e271a755b441394f382548829ab/ai/services/ai_inference/cocolon_meaning_experience_engine/natural_reply.py) | 原ZIPをmaterializeしてhash一致、実10本文を含むJSONと2件のHTTPS→SQL DTOを直接読取。NR11/12は別app instanceのGET全4回＋既存start全2回が同じevent／本文。NR12は父の将来の手伝いを既遂へせず、本人が当日一人で片付けたことを残しました。**限定した経路成立と内容保持**です。 | 原JSONはproduction=false／real_supabase_auth=false／native_device=false。Auth・factory・入力rowはfixture、隔離SQLです。実例3追加の研究候補は不採用。NR03は「約束はしていない」から「昔の約束」を追加し、NR02は未記載の心の軽さ、NR08は「楽しみだった」期待を「楽しんでいた」経験へ変えました。全文自然文を取得できても一般品質達成ではありません。 |
| 11/1 6701 本人初回一巡 | 隔離で通るだけ→実Auth経由の初回返答と保存、本人が履歴から同じ返事を再読 | RN **b8a43e5a**／iOS run [41260929560](https://github.com/MassyuRed/Cocolon/actions/runs/41260929560)、API **744336c0de999e271a755b441394f382548829ab**。[当時の本人確認記録§37](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261031.md#testflight6701-device-initial-save-20261101) | Mashが6701を開き、感情入力→返事→閉じる→同じ記録から開き直し、**「同じ返事が表示された」**と回答した記録があります。通常DBのFINAL／CALL_STARTEDが0→1、再読後も1／1、active0、recipient_reply.v1という同時期集計もあります。初回の実用経路が成立した本人確認の当時記録です。 | 本人の原メッセージ、iPhone操作録画、当時の生DB responseを今回は再取得していません。強度は原チャット直読より下げます。品質合格・全プラン・問い全round／訂正／Premium frameまでの本人一巡成功には広げません。 |
| 11/12〜14 natural問答・二入力訂正・frame | naturalの初回返事中心→問い受取ON／OFFと最大3、独立したAI引用＋本人説明の訂正履歴、本人が判断した正確なframe対象と依存失効 | 現API[service](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/emlis_thread_service.py#L39)（question_limit39、start445、correct_interpretation567、frame_feedback639）、[natural材料](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/cocolon_meaning_experience_engine/natural_reply.py#L408)、[通常反映§9.55](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/designs/cmee/Cocolon_CMEE_AuxiliaryAsset_Reuse_ImplementationDesign_20261108.md#auxiliary-normal-db-api-rollout-20261114) | 現コードはnatural Q3にplan共通上限3、設定受領、exact event／版／一意な引用へ訂正を束縛し、target_ai_interpretationと本人explanationを別に保持します。frameの除外／修正と、対象記録の変更時の旧本文失効は実装済みです。11/14の既存9migration・8関数照合とAPI99db通常Liveが記録され、本監査の共通領域でも最新API／worker／DB履歴をread-only独立確認しています。 | **DB／API通常反映単位は閉じています。** 新しい本人認証での問答全round・二欄訂正・別記録frameの一巡、統合RN再配布／本人端末は未確認です。Mash決定でbuild／TestFlight／実機は後回し。これらを「コード未実装」「通常DB未反映」へ戻しません。 |
| 11/13 最新frame実出力 | 正確な本人判断対象が作者材料へ届かない→対象は届く。しかし返答への意味反映はFAIL | [実原ZIP v2](https://chatgpt.com/library?file_id=libfile_fde3_f-f0b5317f85b48191a9dd3909b126606c_2f7470f963808191aaebf050935e72de&account_id=personal)、14,087,563byte、SHA256 **69b9725c16dc0ebd9240021bc67bdfef7557cf701f70110e74023899f5824ada**。`actual/raw/results.private.json`・4candidate生response、`prepared/actual_saved_new/*.private.json`。[§9.42](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/designs/cmee/Cocolon_CMEE_AuxiliaryAsset_Reuse_ImplementationDesign_20261108.md#emlis-cross-record-frame-target-actual-20261113) | 原ZIPを実取得・hash照合、候補4HTTP raw bytesのhashも原記録と一致。旧UNRESOLVED→新BOUNDで、最新REVISED／REJECTEDと正確な以前対象が送信材料にあります。実new2の保存DTOと別service再読本文が一致、追加model call0も直接確認しました。frameは再修正1件／不使用0件を保持します。 | **新2本文は不採用。** 架空の「前の記録とは別の出来事で、褒められて悲しかった」に対し、新再修正応答は今回の悲しみを落とし過去と「重なっている」と結合。不使用応答は過去との連続を足し、未記載の「自分自身を責める…傾向」を付加。保存機構の成功と理解品質の失敗が同居しています。旧／新とも研究比較であり正式human Product Readではありません。 |
| 11/14 下流接続 | Emlisの本人訂正がAnalysisから脱落／PieceはADDのみ→限定された有効訂正・撤回を下流へ保持 | [Analysis欠落修復§9.56](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/designs/cmee/Cocolon_CMEE_AuxiliaryAsset_Reuse_ImplementationDesign_20261108.md#analysis-person-correction-source-handoff-20261114)、[Piece最新更新§9.61](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/designs/cmee/Cocolon_CMEE_AuxiliaryAsset_Reuse_ImplementationDesign_20261108.md#piece-latest-later-answer-update-20261114)。API **f73b034f／75e526d1／cb6301ed**。詳細の実source監査はAnalysis／Piece担当へ接続 | 「本人の説明を別sourceへ渡す」「原入力の一節を完全引用する明示REVISE／WITHDRAWの有効範囲を保持する」限定修復と通常反映があります。最後のsource→下流接続は今朝だけの進捗なので、これで8月〜10月全体の成果を説明しません。 | 一般説明、先行補足を訂正する多段更新、複数依存、全有効回答集合の共同理解を一括で完了していません。Pieceは原入力＋選択された最新一回答という既存仕様です。全回答を本文へ連結することが既決完成条件という意味にはしません。 |

### 品質の変化と、まだ残っている核心

1. **「書けない／見えない」から「通常の初回返事を保存して開き直せる」への変化はあります。** 8月offline限定、9月保存機構、10月画面到達、11月本人の同本文再読という段階の差はコードと当時確認で追えます。11/1の一巡は今回の監査で確認できる本人到達の具体実績です。
2. **形式の選択肢は広がりましたが、一般的な意味・日本語品質の向上を証明する受入れは未成立です。** 有限作者以外の実4B自然文が動く一方、10/31 rawには否定・期待／経験の変質が残り、11/13 rawには別出来事の結合、本人の最新判断の不反映、未記載の自責傾向が残ります。4Bへの変更だけを品質達成とは呼べません。
3. **問い・訂正・frameの「情報を失わず運ぶ」部分は進み、「それを理解して良い返事にする」部分が残っています。** 直近の原本では、対象BOUND・最新status・本人修正文が到達していること自体を確認できます。未達を単純な未接続だけへ戻せず、作者の有効意味／時点・場面の扱いを含む商品本文の問題として扱います。
4. **全round、長い思考・行動二欄、訂正、過去と今回の別出来事の境界を横断した一般品質は未達です。** 今回rawで直接FAILが分かるのは別出来事／frame判断の場面です。未実行の長文・全roundを同じ実FAIL件数へ加算せず、必要能力が現物で成立した証拠の不足として残します。

### 現在の主要な未完と、再実装へ戻さないもの

- **AR01／02／03：本人の有効な説明・修正・不使用を優先した返答。** 一般自由文説明と複数更新の対象／時点／依存を保ち、無関係な元の気持ちや経験を落とさずに返答へ反映することです。原本の新2FAILを治すため、既に閉じた対象保存・通常migrationの再周回だけへ戻さないでください。
- **AR06：Emlisが得た根拠付き意味材料をAnalysisへ渡す接点。** 現 `emlis_thread_service.py` 1033行のnatural artifactは依然 **analysis_state=NOT_GENERATED**です。本人説明のsource容器が届くことと、Emlisの根拠付き理解がAnalysis用材料として生成されることは別です。[現source](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/emlis_thread_service.py#L1033)。
- **有限な独立意味比較は接続済みです。** 同service1013行で `compare_reply_meaning` を実呼出しし結果を保存しています。「本文意味検査が未接続」は訂正が必要です。ただし全自由文を覆わず、例外時UNASSESSED／CHECKER_ERROR／full_coverage=false。比較結果を保存前の全面採否gateとして使う実装でもありません。
- **研究を通常へ採用する条件と、完了済み機構の通常反映を分けます。** 新10b563重み、history-plan／meaning-support研究候補、Piece model selectorの不採用／OFFを維持します。11/14の問い・訂正・frame等のDB／API単位は閉鎖済みです。一般品質の全完成待ちへ戻しません。
- **統合RN配布／本人一巡は未確認の別枠。** 現最新内部配布8001。Mashがbuild・TestFlight・実機を後回しと決定済みなので、補助活用を止める待機条件へしません。一般品質が未達の候補をそのまま本人へ再評価依頼もしません。
- **安全経路を新しい工程へ拡大しません。** source admission・本人権利・保存整合を保つ既存の拒否は現実装です。今回新しいsafety owner handoffの不足を通常応答全体の追加公開条件として認定していません。
- **非同期の分析生成時間は未解決課題へ戻しません。** 裏更新→完了通知という既決方針を維持し、通知実配送と内容品質はそれぞれの実証範囲で扱います。



## 8. Pieceの旧版・現版・実本文・画像

確認基準：Cocolon PR30 `560908840b6a60368553645edf4b725a34fd3f90`、mashos-api PR3 `cb6301ed9a0b77fa7342e71c078d64a9075dad7a`（2026-11-14）。読取専用の監査で、モデル生成・テスト再実行・DB変更・デプロイ・端末操作は行っていません。

参照：現行の全体前提資料、CURRENT_RULES、Piece current structure、補助経路詳細設計、既存の実行原本記録と、旧／現行の実ソース。全repositoryの全ファイル意味読了や、全仕様の受入完了を認定する報告ではありません。

### 確認できた結論

8月の旧実装は「問いと答えを確認して公開する」Q&Aの構造でした。現在は、保存原入力／明示した本人回答を出典に、CMEEのPiece専用consumerが確定本文・画像設定を作り、同じ版のpreview→保存→本人詳細→画像出力へ渡す構造へ変わっています。これは設計図だけの変更ではなく、9月の本文・開発PNG、10月の実DB／通常API接続、11月1日のMash様の画像生成・一覧・iPhone Photos成功まで段階的に到達した記録があります。

一方、一般的な長い文章の自然な再構成、広い人名／役割変換、全ての更新・依存、4B候補の通常採用、Androidの通常画像経路、新公開経路は完成していません。11月14日の直近2本文は旧2本文と全byte同一で、最後の省略候補追加による編集改善は0です。それ以前の限定的な改善も消しません。

### 旧→新の証拠

| 日時・対象 | 以前 | 変わったもの／利用者に関係する差 | 直接根拠・実証段階 | 限界 |
|---|---|---|---|---|
| 8/1〜8/7：旧Q&A | APIは `PieceCoreQuestionAnswerPlan(question, answer)`、`question / raw_answer / answer_display_text` を返し、RNは「問い」「答え」を表示。`_piece_answer_from_semantic_flags`には固定文の組立もある | 8/7にPieceを「本人の考え・価値観を他者に伝わる文章へ整形し画像化する機能」と再定義。Q&AをPieceそのものとしない判断を固定 | [旧API実ソース 315813c7](https://github.com/MassyuRed/mashos-api/blob/315813c7bd3372462de926ddad74df567254a6b5/ai/services/ai_inference/emotion_piece_generation_service.py#L49)、[旧RN実ソース 66ca6d3f](https://github.com/MassyuRed/Cocolon/blob/66ca6d3f3b8b81bfee808670d0e96b5a16d48ea3/components/EmotionPiecePreviewModal.js#L49)、[8/7歴史manifest](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_Piece/manifest_v2_historical_snapshot_20260807.json)。旧API commit日時は8/1 00:47:02Z | 8/7は商品定義・設計の変更。新画像機能の本人成功ではない。旧Q&Aと現版を同一入力で動かした新A/Bは今回行っていない |
| 9/21：CMEE本文への本接続 | 9/21初期B8は明示一人称の焦点文／末尾意向等の限定作者。Emlisの共有meaning block利用だけではCMEE Piece専用consumer未接続 | `MeaningExperienceEngine.generate(PieceGenerationRequest)` →原文SourceEnvelope／graph→Piece intent／ArtifactPlan→canonical本文→既存B9へ接続。原文に明記した人名／役割だけを限定抽象化。単独・冒頭・途中の意向と後続留保を同時保持 | [実装commit a07cdc11：9/21 06:07:36Z](https://github.com/MassyuRed/mashos-api/commit/a07cdc11e30fd48f9a8d4495c868f17f7addc5fe)、[当時のB8ソース](https://github.com/MassyuRed/mashos-api/blob/a07cdc11e30fd48f9a8d4495c868f17f7addc5fe/ai/services/ai_inference/piece_v2_generation.py#L50)、[当時の実PNG生成コード・14合成入力](https://github.com/MassyuRed/mashos-api/blob/a07cdc11e30fd48f9a8d4495c868f17f7addc5fe/scripts/piece_v2_preview_probe.py)、current map §14には14本文→28PNG、旧8入力16画像の親版一致・新6入力実読を記録 | disabled候補・Linux開発PNG。汎用の述語／因果／照応理解、保存入力認証、RN／実機、共有安全性全体は未完だった。PNG原物を今回再閲覧したとはしない |
| 9/26：保存原入力の両欄 | CMEEの単一 `original_text` 呼出しだけでは、保存済みの考え・行動を区別して取得できなかった | 本人限定保存read→原七項目snapshot→memo／memo_action別出典→CMEE→再取得・版照合。考え→行動の欄順を守り、欄間の因果や時系列を創作しない | [dc6e9900](https://github.com/MassyuRed/mashos-api/commit/dc6e9900f5fb8a7002eb88322c8e776bbed7647a)、current map §16：既存SQLでread→CMEE→再照合、固定した実4候補→8開発PNG | 当時は開発stage指定、remote認証は合成、DBは隔離WASM。選択感情・terminal・refined・通常RN／保存はその時点で未完。9月に普通の端末で使えたとはしない |
| 10/6〜10/10：保存・履歴・本人操作と実DB | 本文候補だけでは再読・枠消費・同一キー・削除が成立しない | preview→同一本文／recipeの保存、本人履歴／詳細、版付き公開範囲変更・削除、結果不明時の同一キー確認を接続。10/10に旧read bridge・foundation・RLS／staging・atomic関数の4migrationを実DBへ適用 | [DB実適用原記録](https://github.com/MassyuRed/mashos-api/pull/3#issuecomment-6092348061)、current map §21〜26／§33。最終catalog／ACL照合10/10 10:46:43.976675 JST、8table・2view・6signature。現在の[保存store](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/piece_v2_store.py)にも保存／再読／削除の責務がある | 隔離SQLの成功と通常本人の一巡は別。migration適用だけで利用可能とはしていない。9月に通常保存まで完成したというまとめは誤り |
| 10/8→10/23：通常アプリ／APIへの接続 | 10/8はsource-ref routerとRN hostがあってもproduction未登録、InputScreen未接続。専用factoryへbaseを変えるだけでは通常入力保存が成立しなかった | 同じ共有APIで入力保存・bootstrap・saved source-ref・preview・save・本人read/deleteを結線。10/23に明示private構成を実APIへ配置。10月後半に画像を「検査した同じbitmapを表示／保存する方式」へ接続 | [10/8 RN df88a0e0](https://github.com/MassyuRed/Cocolon/blob/df88a0e0f46cdbfc005039177983dbec740efb3f/screens/input/InputPieceActionArea.js)、[10/8 API 0312a0fc](https://github.com/MassyuRed/mashos-api/blob/0312a0fc3b07f8e46344d5746cafd7760458badd/ai/services/ai_inference/api_piece_v2.py)、current map §65.47〜65.62。10/23 API3577d7fd／dep-dbd8hjoae00c73firbt0、07:07:33 JST Live、private4true/public-write-read-visibility-export4false、未認証history401 | 10/23のhealth／bootstrap／401は実測記録だが本人保存の証明ではない。旧自然Text参照のV4占有不一致は未解決で、同bitmap方式の成功と区別する |
| 11/1：本人に届いた画像と保存 | source接続・描画／保存はCIや合成Authの範囲だった | Mash様が7001でPiece画像生成→一覧表示→iPhoneの写真フォルダ保存の成功を確認。次いで「記録時には…」という選択感情の追加文を画像本文から除去。7101で新PieceのEmlis表記等を本人確認 | [current map 画像生成・本人Photos・本文要件の原記録](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/current_structure/02_piece_current_structure.md#piece-user-text-only-20261101)、[7101配布 run41283646380](https://github.com/MassyuRed/Cocolon/actions/runs/41283646380)、RN7464f858／API3407402。v1=Cocolon、v2=Emlisを保存renderer版で分ける | Photos成功の日時は10月ではなく11/1。これは7001／7101での本人確認を記した当時記録で、最新本文・全形式・全色・Share・Android・正式商品受入れへ広げない |
| 11/4〜11/7：実際の設定／回復／権利 | 適格形式選択、再入場、削除／保存結果不明、配色等の操作が不足 | Premiumの適格形式、期限切れ時の同じsourceから明示再作成、保存結果不明の同じkey確認、本人履歴／削除復帰、export receipt、配色の権利を実装。Free2色／Plus・Premium12色、両比率・ロゴ有無を11/7実DB／APIと7501へ反映 | [11/7配布 run42328190568](https://github.com/MassyuRed/Cocolon/actions/runs/42328190568)、RN e0ec6d6a／API5065730e／dep-dbn8h2jl550s73efmcng 11:12:02 JST Live。current map 11/7、11/7週次§12〜14にMash様の大ボタン・Piece修正確認 | 全色×全プラン×全形式×Photos／Shareの全面本人受入れではない。Android bridgeの試作が通常作成可能になった証明でもない |
| 11/9〜11/13：4B候補を本文と保存へ | 通常の有限作者は4Bを呼ばず、4B出力はCMEE未評価／氏名・役割・能受動・本人反復・時制等に不足 | shared4B候補を既存CMEE／独立S7／同じ保存経路へ接続。欄別slot、明示役割、人称・否定受動、同本人評価の継続、時制等を限定改善。悪化したa1dfを採用せず、344aで過去好みの変異を回復 | [trial：a1dfの時制退行](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-a1df-remaining49-actual-20261111)、[実本文を保持したpublic fixture](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/tests/fixtures/piece-ar04-344a-multiblock.json)。下記に本文差を記載 | 研究候補・限定入力・通常selector OFF。生成が出たこと、保存されたことを一般編集品質改善へ換算しない。4Bは現source上short_essay限定 |
| 11/12〜11/14：同じ実本文を保存・画像へ | 一部の実rawは保存資格を後付けしないと再読できず、複数段落DTOやModal閉完了→本人詳細遷移に抜け | 生成前の資格／checkpointを固定→同じ無修補raw→CMEE／S7→保存→別service非生成再読→同版native preview／saved／exportを接続。native dismiss ACK後に遷移する修正を通常Draftへ回収 | [11/12 run43146249187](https://github.com/MassyuRed/Cocolon/actions/runs/43146249187)、[11/13 run43350232403](https://github.com/MassyuRed/Cocolon/actions/runs/43350232403)、[11/14 run43518729580](https://github.com/MassyuRed/Cocolon/actions/runs/43518729580)。研究36335452／24f7ba8b／e098efda。本文・8項目artifact・3hash、作品ごとpreview／saved／export PNG bytes・actual view-shot一致の記録 | 合成Auth／閉local transport／隔離PGlite／研究iOSでの実証。通常本人API／DB／実端末Photos／Shareではない。自然Text参照全体のRGBA一致は未成立。最後の2件は同artifactなので新native run0、旧画像を再加算しない |
| 11/13〜11/14：最新本人回答と訂正／撤回 | UIで選べるnatural COMPLETED／REFINED一回答を旧finite専用API／SQLが拒否。後続2／3回答もADD限定 | 原入力＋明示した最新一回答を別sourceで渡す。REVISEは対象の旧希望を除き新希望だけへ、WITHDRAWは旧希望を除く。先行ADDは資格確認だけで本文へ混ぜない。11/14に通常DB／APIへ反映 | [最新commit cb6301ed：11/14 07:48:34Z](https://github.com/MassyuRed/mashos-api/commit/cb6301ed9a0b77fa7342e71c078d64a9075dad7a)、[有効範囲のsource adapter](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/piece_v2_source_adapter.py#L920)、[migration](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/supabase/migrations/20261114074058_piece_natural_latest_answer_update.sql)、[実保存test](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/tests/piece_v2/test_b05_piece_answer_update_saved_pipeline.py#L30)。補助設計§9.55／9.58／9.60／9.61 | 一回答の実3件と、round2／3の合成provider保存12件を区別。一般自由文訂正、先行REVISE／WITHDRAW、補足自体の訂正、多段／複数対象は未対応。新本人端末・新RN／build0 |

### 本文そのものの差：改善・失敗を同じ基準で残す

#### 過去を現在に変えていた失敗と、その回復

11/11の原本比較表と現public fixtureの対応：

- 原入力の好みは「僕は農作業が好きでした。」という過去です。
- 旧f6daeの出力：**僕は農作業が好きだった。**
- a1dfの出力：**僕は農作業が好きだ。** — 過去を現在へ変えており、不採用。
- 344aの出力：**僕は農作業が好きだった。** — 過去を回復。
- 同じ作品の別欄「僕は隣人から収穫祭の準備を頼まれなかった。」は維持。そこが正しくても別欄の時制変異を合格にしなかった。

[原本比較の記録](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-a1df-remaining49-actual-20261111)では旧／新rawとrequestの対応を保持しています。現fixtureの `preview.piece_text` と `detail.piece_text` は、二段落とも同一の保存本文です。fixtureは全件架空と明記されています。

これは1件の観測済み時制回復であって、全日本語の理解、広い編集品質、通常採用を証明しません。また、a1df前の旧f6daeは既に正しかったため、8月から初めて過去が扱えるようになった、という説明もしません。

#### 二欄／補足で以前に出た限定的な編集は、最後の改善0で消さない

11/13の344a実3件では、段落は常体化だけでしたが、二欄では**氏名→原文に明記された役割、同本人主語の反復省略、評価語順の整理**、refinedでは**各source内の同本人反復省略**が出ています。2/3は常体化を越える編集です。後に資格を生成前に固定した同source実3→3保存・非生成再読→9native frameへ接続しています。ただし同じ既知本文の再取得・保存成功を新たな編集効果へ足していません。

一方、11/13のbase旧新6応答は3組すべてraw同一・コピー中心で不採用。11/14の省略候補追加後の実新2も旧2と全byte同一で、段落の「私は」は5文全て、二欄の「おれは」「僕は」はそれぞれ2回のままです。**直近試行の編集改善0、以前の2件の限定改善あり、一般的な文章構成は未達**という3つを併記します。

根拠：[11/13限定改善原記録](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-selected-author-editorial-actual3-20261113)、[最新2件・全文同一の原記録](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/designs/cmee/Cocolon_CMEE_AuxiliaryAsset_Reuse_ImplementationDesign_20261108.md#piece-topic-editorial2-actual-unchanged-20261114)。

#### 訂正・撤回が作品に効く変化

11/14実3件（base alias `cocolon-qwen35-4b-base-851bf6e`、loaded revision／usageは未提供）：

| 操作 | 作品で確認された結果 |
|---|---|
| REVISE | 元の対比と資料を調べた過去を保ち、旧「私は仕事を続けたい」を除き、新「私は家族を守りたい」だけを使う |
| WITHDRAW | 元の対比と行動を保持し、撤回した希望も「取り消す」という命令も作品へ載せない |
| ADD対照 | 元memoの希望と行動を保持し、本人の「今は、私は嬉しい。」を別回答段落へ加える |

原本は3POST／2health GET、13.3073557秒、全stop。通常factoryのPOST bodyが固定wireと一致した場合だけ同じrawを戻し、Premiumのios.v1／v2の各隔離forkでsave／同key再送／別service非生成detail、quota1・source不変を確認しています。JS描画入力まで一致しましたが、**この新3作品のnative PNG／OS出力／本人表示は0**です。

[補助設計§9.60](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/designs/cmee/Cocolon_CMEE_AuxiliaryAsset_Reuse_ImplementationDesign_20261108.md#piece-answer-update-actual3-saved-20261114)と[保存原本ZIP](https://chatgpt.com/library?file_id=libfile_fde3_f-6af69c8803fc8191bf7c35bf7718f6cc_2f7470f963808191aaebf050935e72de&account_id=personal)。後続の原物再確認では同ZIPの該当raw／全文／保存確認を直接読み、下記の限定3例を照合しました。全member再監査とはしません。

### 通常DB／APIの最新反映：完成した単位と未確認を分ける

1. §9.55：既存9migrationで問いの権利／最大3回、本人訂正履歴、frame判断対象・依存失効、最新ADD1〜3等を通常DBへ反映。API99dbdaabは11:52 JST Live。8関数の全文／ACL／RLSの確認記録あり。
2. §9.58：一回答REVISE／WITHDRAWの有効範囲・保存checkpointをAPI75e526d1と既存3writerへ反映。通常DB／API／workerの限定反映単位はCLOSED。
3. §9.61：先行が全て独立ADDで、最新第2／3回答だけが原入力の正確な一節を訂正／撤回する範囲をAPIcb6301edへ追加。migration実履歴version `20261114074859`、3関数の分岐／先行ADD条件・ACLを読戻し。Render `dep-dbs16gafngtc73bek5a0` は**07:53:56Z＝16:53:56 JST Live**、health／bootstrap200、private5ON／public3OFF。
4. 上記は、通常本人Authで最新回答を使った端末一巡ではありません。build／TestFlight／本人実機はMash様の方針で保留、今回新RN0。APIcbのCI2本は正本記録時点で実行中なので成功へ繰り上げません。

[最新通常反映正本§9.61](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/designs/cmee/Cocolon_CMEE_AuxiliaryAsset_Reuse_ImplementationDesign_20261108.md#piece-latest-later-answer-update-20261114)。

### 現sourceと運用記録から確認できる未達

- **4B通常採用なしという運用記録。** [piece_model_source.py](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/piece_model_source.py#L628)が直接証明するのは、 `PIECE_MODEL_SOURCE` が空／offならNoneとなり、明示selector `shared_4b.v1`を支持する分岐です。実際のOFFと研究344a等の重み未採用は現在の運用原記録によるもので、sourceだけからfresh環境変数の値を確定した主張ではありません。実モデル比較の成果を全通常ユーザーへ届いた成果へ移しません。
- **モデル形式はshort_essayだけ。** [piece_semantic_admission.py L79](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/cocolon_meaning_experience_engine/piece_semantic_admission.py#L79)はNone／short_essay以外を拒否。既存有限作者にはshort_essay／quote／declarationの適格選択があります。三形式すべてを4Bで使えたとはしません。
- **一般的な文章編集未達。** 長段落・二欄の本人反復、コピー／常体化中心、一般構成・広い役割変換の残件があります。短い完成文の原文保持自体は失敗と決めませんが、長い文章の再構成品質を短文成功で代替しません。
- **source制限あり。** 原入力＋最新の明示回答一つがPieceの材料。先行ADDは資格確認だけ。共有意味が解決していても、一般訂正、多段／先行更新、補足自体の更新、複数対象等を全受付しません。Emlis／Analysisの生成本文を本人sourceへ昇格させません。
- **Android通常画像作成未接続。** [pieceRenderer.js L17](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/features/piece/pieceRenderer.js#L17)は通常bitmap作成をios限定で判定し、[L133](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/features/piece/pieceRenderer.js#L133)にAndroid bridgeはlocal harness専用と明記。試作／compile／PNG検査があっても通常作成・保存・Photos成功にはしません。
- **新公開／共有全面受入れ未達。** 稼働public3OFF。本人Photosの成功と、Nexus新公開・旧Q&Aのclean cutover・全Share先・Androidを分けます。
- **最新版の本人一巡未確認。** 7001 Photos、7101 Emlisロゴ、7501指定UIの本人確認を記した当時記録は残しつつ、11/14新source／本文・通常DB／API・compiled renderer・同一端末を全てそろえた確認は未実施です。端末確認保留は他の補助経路全体を止める条件にしません。

### 証拠の読み方

この報告は「文書や検査が増えた」ことを商品進捗の主根拠にしていません。旧／現実ソース、対応する実本文の前後差、同じ実本文の保存・画像、実DB／配置の観測、当時記録に引用されたMash様の報告を別々に列挙しました。

今回直接再取得したものは、旧API／旧RN、9月B8・PNGスクリプト、10月API／RN、最新API source／store／model／admission／migration／保存test、最新RN renderer／実本文fixture、全体前提・ルール・current map・補助設計・trial原記録です。加えて、次節に示した11/14原ZIP2点の選択member・raw・PNGを直接再確認しました。private ZIP全member、実DB catalog／Render live／本人画面の新規操作・全面再監査ではありません。過去実行記録を現在のlive全体や一般品質へ移すこともしていません。

### 追補：11/14のraw・本文・PNG原物を直接再確認した限定3例

本監査で取得・hash照合した原ZIP2点を、そのまま読取りました。新たな生成・SQL実行・native runは0です。以下は全て既存の架空入力で、利用者の私的記録や認証情報は転記していません。

#### 例1：本人が希望を訂正した場合

元memo：**褒められたのに、嬉しくなかった。私は仕事を続けたい。**  
元action：**私は資料を調べた。**  
本人回答：**「私は仕事を続けたい」ではなく「私は家族を守りたい」です。**

実rawから得た本文：

> 褒められたのに、嬉しくなかった。
>
> 私は資料を調べた。
>
> 私は家族を守りたい。

旧ADD限定では受付できなかった訂正が、元の対比・過去行動を残し、旧希望を除いて新希望へ置換される変化です。資料調査の目的を家族に結び付ける原因文は作っていません。REVISE新節の句点以外は原文に近く、作品の一般的な編集品質が上がった証拠とはしません。

確認した原物：`actual-healthz-completed/obtained-healthz/obtained/revise.response.raw.json`（SHA256 `8e6a5328043bbd0010ae7e10e3316b06988d3a56b62a8eacefa8e81c84ff713c`）と`verified/bodies-full.private.json`。rawをJSONとして読み、field番号順に連結した本文と保存本文が完全一致しました。native PNGはこの作品では未取得です。

#### 例2：同じ希望を撤回した場合

元memo／actionは例1と同じ、本人回答は**「私は仕事を続けたい」は取り消します。**です。

実rawから得た本文：

> 褒められたのに、嬉しくなかった。
>
> 私は資料を調べた。

旧希望、「取り消します」という操作命令、例1だけの新希望は入っていません。撤回から逆の希望や退職意図も作っていません。こちらも残存原文の保持で、自然な再構成の新改善ではありません。

確認した原物：`actual-healthz-completed/obtained-healthz/obtained/withdraw.response.raw.json`（SHA256 `eec42008005bc15b8f4e104dea98567cdcaca2bf500c660977a79d509e017318`）。rawのhash、field番号順本文、保存された二段落本文の一致を再確認しました。例1・2・ADD対照の保存rawをすり替えず、各response hash別に確認しています。

原ZIP：[Cocolon_CMEE_Piece_AnswerUpdate_NormalDB_API_20261114.zip](https://chatgpt.com/library?file_id=libfile_fde3_f-6af69c8803fc8191bf7c35bf7718f6cc_2f7470f963808191aaebf050935e72de&account_id=personal)、版2、SHA256 `d0078f7339854739ce03fc00ef86bcbd7c23e3eed1749adca2ff7b7f709f69bc`。この実応答はAPI75e526d1用の一回答であり、後のcb6301edの第2／3回答12合成保存へ同じ実生成成果を重ねません。

#### 例3：第3回答の最新ADDを、同じ本文の画像へ渡した場合

元memo：**褒められたのに、嬉しくなかった。誘われたのに、悲しかった。頼まれたのに、寂しかった。**  
明示選択した最新回答：**今は、私は寂しい。**

実rawは上のmemoと最新回答をそのまま別slotへ出力し、native画像は元memoの3文＋空行＋最新回答です。選択JSONの不安を本文へ追加せず、過去の「寂しかった」と現在の「寂しい」を分けています。ここで増えた価値は、最新本人回答を取り違えず**同じ確定本文のまま保存・詳細・出力へ通せたこと**で、コピー中心の本文自体の編集改善は0です。

原物`actual/raw/results.private.json`の`latest-3`のrequest field literal／responseと、`native/result/evidence/normal-host-results.json`のpreview／saved／exportの3recordを直接読取りました。3recordの本文／段落とnative_textsが対応し、3PNGのbytesは完全一致、SHA256は全て`39b9559c072edd4be73dc93f20daef158d9753d0853649d392bb1d088f3d4e8d`でした。LATEST-ADD-2も同様に3PNGのbytesが一致し、SHA256 `2d9744f7f9c34f074b4ea1f7f8ba3a2efd5249b845ecb920b0e16f598d18f571`。2代表PNGを今回直接目視し、記載本文、Emlis表記、可視の欠落・重なりがない範囲を確認しました。

実native画像は上記原ZIPの `native/result/evidence/normal_host_preview_LATEST-ADD-3.png` に存在し、今回再閲覧した。

原ZIP：[Cocolon_CMEE_AR04_LatestAnswer_Piece_Actual_20261114.zip](https://chatgpt.com/library?file_id=libfile_fde3_f-b1e9007b37fc8191b9be577a53a22038_2f7470f963808191aaebf050935e72de&account_id=personal)、版2、SHA256 `2678ac145e38dfdc830095637d28bf77b1a13f0d1e338ba2f477c76c3401efb8`。native証拠は研究938ac9ac／run43488462958の既存ADD2／3だけです。合成Auth・閉local transport・隔離DB・研究iOSの制限を保ち、例1／2のREVISE／WITHDRAWにPNGがある証拠へ流用しません。本人の最新端末・Photos成功でもありません。



## 9. Analysisの旧版・現版・図と本文

監査日：2026-11-14。生成・学習・GPU・端末操作・DB接続／変更は行わず、GitHubの旧版／fresh版source、保存済み結果JSON、当時の議事録・詳細設計を読む監査です。

### 結論

**「固定ラベルと定型ルートの旧map／CMEE未接続」から、「本人の保存source→Analysis専用CMEE→根拠付きの同一graphと本文→immutable保存→実アプリ表示」まで、実装と通常利用経路は具体的に進んでいます。** 全蓄積・月次当時版・プラン別閲覧、入力保存後の裏更新と保存版読取、限定的な本人訂正／撤回のsource接続も新たに存在します。

ただし、これは**本人の役割・判断基準・条件差・記録間関係を、一般的な日本語で正確に読み取り、自然な説明として返す品質の完成**とは別です。11/8の本人確認は図・本文・node詳細の表示までで、意味品質の受入れはありません。11/14の実4Bの訂正後出力にも未証明の関係づけ・日本語の誤りが記録されています。IF／SavedRouteIntent、mapの項目・関係線を対象にする二入力訂正、naturalの新しい根拠付きAnalysis意味artifactは未完です。

### 監査の固定点と証拠の扱い

| 対象 | 今回freshに解決したref |
|---|---|
| Cocolon PR30 | `560908840b6a60368553645edf4b725a34fd3f90` |
| mashos-api PR3 | `cb6301ed9a0b77fa7342e71c078d64a9075dad7a` |
| 8月比較点 | API `06ce311b3ea728b06f83439d268a34bed917c01c`、commit日時2026-08-16 02:46:59 UTC |
| CMEE未接続の比較点 | API `7a03d6785799d4bde07d62bd30d103ff113c1dbe`、10/3議事録の採用基準 |

証拠を以下のように分けています。

- **実コードを今回再読した証拠**：旧／現engine、旧fixed map、現source adapter・admission・compiler・realizer・累積service／SQL・RN表示。
- **保存された実結果の証拠**：11/8 connection outcome JSONのHTTP・wire・coverage・同一artifact非生成再読・端末buildの観測値。これは本文なしの結果receiptで、本人入力／生成全文を含みません。
- **当時の本人確認の記録**：11/8に本人の6枚の画像を確認したとする当時記録。本監査では画像本体の再取得・再閲覧は未了です。画像の現在の再検証と同じ強さには扱いません。
- **11/14の実4B／隔離SQL／配置の当時記録**：補助設計§9.56/57とCI原本metadata。private ZIPの実raw／checkpointは本監査では直接展開していないため、sourceやCIとは証明段階を分けています。
- **今回行っていないこと**：新しいprobe、generation、DB、GPU、通常アカウントのsource読取、端末操作。件数や助手の「完了」宣言だけで意味品質を証明していません。

### 1. 旧mapの具体的な限界を、旧sourceで確認

[2026-08-16の旧watashi_map_service.py](https://github.com/MassyuRed/mashos-api/blob/06ce311b3ea728b06f83439d268a34bed917c01c/ai/services/ai_inference/watashi_map_service.py#L567) の `build_route_patterns` は、switch上位4件からルートを作り、行動／役割ラベルに「聞」「支」「受」「距離」「守」「確」があるかで、結果を数種類の固定文へ分けています。

例えば結果は「その場を整えようとする流れ」「相手の状態を先に受け止めようとする流れ」「一度距離を置いてから考えようとする流れ」等から選ばれます。stepsも「場面→役割スイッチ→選びやすい行動→起こりやすい結果」の定型です。原文中で結果や順序が証明されたから、その内容を個別に採った処理ではありません。

旧 `builders.py` も、pattern score、役割／世界／gap等を旧mapへ組み立てます。この存在自体は旧機構の実装ですが、新しいsource-grounded Analysis routeの実現ではありません。

**注意：このlegacy watashi_map_service.pyはfresh headでも同じblob `b5836d69da2d01a5e66873bdbce4d56d96ecd8a0` で残っています。** 「同じ旧コードが残るから進んでいない」とは判断できません。新経路の増分は別ownerとdispatchで確認する必要があります。

### 2. 10/3の未接続から、Analysis専用CMEEへ

[10/3基準の旧engine.py](https://github.com/MassyuRed/mashos-api/blob/7a03d6785799d4bde07d62bd30d103ff113c1dbe/ai/services/ai_inference/cocolon_meaning_experience_engine/engine.py#L28) は、Piece分岐の後、GenerationRequestのcoreがEMLIS_AI以外なら拒否します。AnalysisObservedMapRequestのdispatchはありません。

[10/3議事録](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_%E5%89%8D%E6%8F%90%E8%B3%87%E6%96%99/weekly_reviews/Cocolon_Weekly_Review_20261003.md) も、当時の増分について「根拠付きCMEE本ルートの実装完了を報告できるものはない」と区別しています。既存の収集・旧report／UIを、この新接続の完成へ数えていません。

対して [fresh engine.py](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/cocolon_meaning_experience_engine/engine.py#L30) は以下を実装しています。

1. `AnalysisObservedMapRequest` 専用dispatch。
2. semantic map入力なら `generate_analysis_semantic_map`、model fields等は各admission、通常observedは `generate_observed_map` へ。
3. [application adapter](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/analysis_semantic_map.py) は材料をprepareし、`MeaningExperienceEngine().generate` のartifactを受け取ります。application側で第二のmapを作文していません。
4. source adapterがowner・保存版・原欄・本人補足・exact scalar／UTF8 evidenceを束縛し、compiler／realizerが同一graphから本文・公開projection・private根拠を作ります。

10/3～4の初期到達は、[current structure §4.5～4.7](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_%E5%89%8D%E6%8F%90%E8%B3%87%E6%96%99/current_structure/03_analysis_current_structure.md#45-observed-self-structure-map-v1d) の履歴と、`20261003134440_analysis_observed_artifacts.sql`／`analysis_observed_service.py`に対応します。最初は期間限定・有限grammar・未配置であり、後の累積／semantic v3完成を当時へ遡って主張しません。

**具体差**：固定結果文の選択から、原sourceの命題・否定・希望・未実行・不明を保持するnode／relationと、その根拠を持つartifactへ、設計が実コードに接続されています。これはcontent一般品質の合格とは別の実装成果です。

### 3. 11/1：全蓄積・月次当時版・プラン別閲覧

[API commit36713940](https://github.com/MassyuRed/mashos-api/commit/36713940ea82e217fab8a7c0a738a33f21df1c4d) は、累積service、既存API／worker／月次entry、累積SQLを追加・接続しています。最新sourceでもこの仕組みを確認できます。

| 旧期間版の制限 | 現在コードで成立している増分 | 品質上の未証明 |
|---|---|---|
| 期間ID集合を取得し、101件目で100超を拒否 | 累積snapshotは本人の全保存原入力を時刻順に集約。直近N／100件切捨てを使わない | 本人の長い全履歴を実4Bが漏れなく、記録間意味まで理解した証明ではない |
| 10/4に既存となったimmutable artifact・同一identity保存 | 11/1はその保存を再利用し、月次参照を分離。graph／本文／根拠は同artifactへ | 既存の保存機構を11/1の新規成果へ再計上しない。保存成立は内容正確性を保証しない |
| 旧light／deep等のmode差 | current mapは共通、月次閲覧Free最新2、Plus12、Premium全期間 | 全planの本人端末受入れではない |
| 当月を後から再分析する危険 | JST月の最初の成功captureを月参照に固定、同月上書きなし、未保存過去月を捏造しない | 昔と今の「違い」を一般日本語で解釈する品質は別 |
| プラン変更による履歴喪失の危険 | 閲覧可能な月のrankを先に選び、その後pagination。plan変更でartifact／月参照を削除しない | 課金全体のリリース確認は別領域 |

実owner：[累積service](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/analysis_cumulative_service.py#L698)、[累積SQL](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/supabase/migrations/20261101080144_cumulative_watashi_map.sql#L38)。

source snapshot→CMEE→graph／本文／private evidence→guard付きcommit→保存版再読という順序を確認しました。変更・削除・退会の扱いと月次当時版の保持を区別します。原入力を編集しても当時artifactの本文を新しい意味へ再生成しません。

**全蓄積を取得することと、巨大履歴を分割・統合して意味を落とさず生成できることは別です。** 現semantic prepareは適格fieldを一つのmaterialへ集めます。今回、長履歴・context上限・跨るrelationの実生成成功は新たに確認していません。旧期間loaderの100件拒否を現累積の未実装へ戻すのも、snapshot全件取得だけで長履歴品質完了とするのも誤りです。

### 4. 11/7～8：通常4B→CMEE→保存→本人の図・本文・詳細

[11/8の保存結果JSON](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_%E5%89%8D%E6%8F%90%E8%B3%87%E6%96%99/observation_learning/trials/2026-11-01-analysis-model-fields/semantic_map_connection_outcome_20261107.json) の `device_review_activation.device_validation_20261108` は、単なるtest通過件数ではなく次の観測を保存しています。

| 観測 | 実際に示すこと | 示さないこと |
|---|---|---|
| 11/8 07:38:42 JST、7701、通常 `/self-structure/latest?ensure=true`、force=false、HTTP200 | 通常要求が保存済みsemantic v3へ到達 | 全入力・全plan・全期間の成功 |
| `watashi.map.v3`／private evidence v1、node3／edge2／本文1271字 | 新しい関係map形式と本文が実artifactとして返った | node／edgeの意味がすべて正しい |
| source87、processed35、mapped33、unparsed2、text-empty除外52 | 全件を「解析済み」と偽っていない | 87件の自由文を全て理解した |
| 同じ保存artifactの非生成DB再読=true | 見るたびに別の文章を作文していない | DB保存だけで品質合格 |
| node n2の根拠HTTP200（07:39:13 JST） | source根拠読取が通常経路で応答 | 全node／全edgeの根拠を本人が確認した |
| 当時本人の6画像：overview・graph・node詳細 | 図・本文・node詳細の表示を本人確認した記録 | edge詳細の本人確認、意味品質の受入れ |

結果のstatus自体は `ORDINARY_7701_V3_SAVED_AND_MAP_DISPLAY_CONFIRMED_NOT_QUALITY_ACCEPTED`、`meaning_quality_accepted=false`、`edge_detail_appearance_user_confirmed=false`です。この限定を維持します。

現RN [SemanticWatashiMap.js](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/components/selfStructure/SemanticWatashiMap.js) では、overview→node／edgeの選択、説明・unknown、両端nodeの根拠、線形listを実装しています。graph／text／detailの入口が「今後作るだけ」の状態ではありません。

### 5. 11/8：入力後の裏更新と、保存版をすぐ読む方式

同JSONの `background_refresh_20261108` は、入力保存のbackground処理→既存myprofile refresh job予約→worker生成→保存→端末の保存版取得を記録しています。20秒debounce、同ownerの集約、実行中のdirty追跡、retry保持、状態pollとversion変更後の非生成読取が現ownerへ実装されました。

実観測は7801の入力後jobがdone、new generated_atあり、その後のsaved readがHTTP200／466ms、本人から表示報告ありです。これは**生成が466msになったという記録ではありません**。生成は引き続き時間を使っていますが、Mashは通知式を採用し、生成所要時間が長いこと自体を残blockerにしないと明示しています。

残る通知評価は「完了通知を受け取れる設定で、正しいversionの完成を本人が受信し、開いて同じ保存版を読めるか」です。11/8の通知不達にはglobal OFFによる送信前除外が記録されており、通知を無条件に未実装と呼ぶのも、配送成功済みとするのも不正確です。JSON内の古い「候補・未配置」通知節は後続の配置記録に優先しません。

### 6. 11/12～14：本人回答・訂正・撤回がAnalysisへ届く増分

「全AR06未実装」は現在の実物に合いません。一方「本人map訂正完成」とも呼べません。以下を分けます。

| 接点 | 今回確認できた具体的な変更 | 到達・限界 |
|---|---|---|
| 保存source取得 | `20261114032520_analysis_interpretation_correction_sources.sql` は、QUESTION／ANSWERに加え、INTERPRETATION_CORRECTIONの本人OPERATIONと、同threadの正確な対象OBSをsnapshot／evidenceへ返す | 旧snapshotで訂正が消えguardも同じだった欠落を修復。対象AI本文はcontrolで、本人の事実sourceにはしない |
| source化 | source_adapterの独立 `interpretation_corrections` tuple。元入力identityを再導出し、本人説明だけUSER_INTERPRETATION_CORRECTION envelopeへ | 別owner／原入力版の移植を拒否。一般的な自由説明の正確な意味解決は未完 |
| 有効意味 | 既存の完全引用による明示REVISE／WITHDRAWだけ、旧節の失効と差替え節を既存_active_sourcesへ | 曖昧対象・一般説明はpending。未訂正版を現在mapへ復活させない |
| 4B材料 | [bd602c35](https://github.com/MassyuRed/mashos-api/commit/bd602c3529d03547a2c0fa2cc7fbf3ab24d1018d)で `allow_source_updates=True`。原欄の残る連続範囲を別field、差替え本人節を本人説明のexact範囲として渡す | 旧節／AI引用／離れた範囲の連結を根拠にしない。通常v1／明示v2両材料に接続 |
| 保存後の利用 | 同source guardで保存・現在版再読・月次当時版・node根拠へ | 訂正source保存だけで意味artifactをGENERATEDにしない |

[補助設計§9.56/57](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_%E5%89%8D%E6%8F%90%E8%B3%87%E6%96%99/designs/cmee/Cocolon_CMEE_AuxiliaryAsset_Reuse_ImplementationDesign_20261108.md#analysis-active-update-semantic-material-20261114) には、架空2記録・実4B差替え1／撤回1を明示v2で取得し、同じ無修補raw／生成前checkpointから隔離SQL保存→現在版2回・月次版1回・全node根拠読取に成功した記録があります。差替えは新本人節と残る5節、撤回は残る5節だけを根拠にし、旧希望を復活させていません。

**この実結果は隔離SQL＋実4Bの技術到達です。通常認証・通常DB・実4B・本人端末をそろえた一巡ではありません。** 通常v1の新しい実生成も未実施です。private ZIPの元rawは本監査で今回直接再読していないため、その点は当時記録の強さに限定しています。

GitHubの [run43555588970](https://github.com/MassyuRed/mashos-api/actions/runs/43555588970) 原本metadataはhead=bd602c35、completed／successでfresh確認済みです。これは実source／testの検証証拠であり、実4B文章品質の合格証拠ではありません。

当時の実2本文には「同じ原記録の別欄を別記録と呼ぶ」「自宅と費用記録を未証明に結ぶ」「希望を現在の本人基準へ広げる」「もう方／节点等の不自然な日本語」が残っています。接続・保存の進歩を、この品質改善へ加点しません。

### 7. 11/14時点で残る商品単位

| 未完の商品結果 | 既存成果を残したまま必要な工事 | 確認可能な終了条件 |
|---|---|---|
| 役割・本人基準・条件差・記録間意味の一般品質 | 現semantic admission／compiler／唯一realizerで、生成時の意味責務・内容選択・独立逆読取・共通原因を一組として扱う | 異なる題材・条件・既成功を含む本人sourceから、図／本文／根拠が意味・方向・時点まで一致し、未証明の因果・基準・別記録化を増やさない |
| 長履歴の意味保持 | 全件snapshotを保ち、必要な分割・跨る関係の統合と未評価範囲を現ownerで扱う | 過去の重要記録・補足／撤回が直近量に埋もれず、境界を跨ぐ関係と月次当時版を確認できる |
| 一般の本人訂正→有効意味 | 完全引用以外の本人説明から対象・変更内容を明確にし、解けない箇所を本人へ確かめる | 旧節だけ失効し、無関係な意味・本人source・月次当時版を保ち、後続分析に同じ訂正が反映される |
| map項目／関係線の二入力訂正 | 現map UIには入口がない。対象と「どう違うか」を別入力にし、根拠・対象版・本人説明を保存利用する | node／edgeを指定→説明→再解析→現在map／本文／根拠へ反映。対象不明をAIで補わない |
| naturalの根拠付きAnalysis意味artifact | source容器・比較reportと、新しい意味材料の生成／採用を分ける | `analysis_state=NOT_GENERATED`を、適格sourceに根拠付きのGENERATEDとして実際に置き換え、保存後も同版を読める |
| IF／SavedRouteIntent | 既存observed mapを基礎に、仮想分岐／意図／制約／不明と本人の選択意向を分けた縦接続 | 1～3の非順位候補、観測との分離、条件変更、本人選択の保存・再読。意向を実行結果へ昇格しない。代表1件で全体完了にしない |
| 通知の本人配送確認 | 既存裏更新・通知実装を使う | 受信可能設定で完了通知→正しい保存versionの表示を本人が確認する。生成速度短縮を条件に足さない |

### 8. 今回の証明で言える範囲

数か月の成果を「未完」の一語で相殺するのは不正確です。固定ルートからsourceを持つnode／edge、CMEE接続、全蓄積・月次保存、通常4Bと本人表示、裏更新、限定訂正の有効範囲接続まで、旧sourceに存在しない具体的な経路と観測が増えています。

同時に、内部の接続完成を、本人が安心して読める一般品質の完成へ置き換えることもできません。現在の残作業は土台をもう一度作ることではなく、**既に到達した通常経路の上で、自然文の意味・関係・訂正を正確に保った商品結果を完成させ、IF／Savedまで接続すること**です。



## 10. 全機能・共通UI・課金・配布・通常稼働

本章は全機能・共通基盤の横断調査です。ソース、GitHub Actions、Render／Supabaseの読み取り専用メタデータを確認しました。新規生成、GPU／学習、build／配布、deploy、アプリ行の読取、DB書込、設定／env値の取得・変更はしていません。

### 比較基準と実証段階

- 8月以前：Cocolon main の **b13271e75c0dc7bedb2b84927c1dbe1018a0255c（2026-07-31 23:54:36 JST）**。[commit原本](https://github.com/MassyuRed/Cocolon/commit/b13271e75c0dc7bedb2b84927c1dbe1018a0255c)。
- 旧ソースを取得した8/22 e3aed2d9版と、上記7月末の23主要pathのblobを照合し、存在pathは全て同一でした。Android release workflowは双方にありません。従って以下の旧機能は7月末から存在したと確認できます。
- 今回source：PR30 **560908840b6a60368553645edf4b725a34fd3f90**、API PR3 **cb6301ed9a0b77fa7342e71c078d64a9075dad7a**。いずれもDraft/Openの作業branch。mainへのmergeを実施済みとはしません。
- **source差分**＝実装が変わった証拠。**Actions成功**＝そのSHAのbuild／upload工程成功。**Live metadata**＝Renderのactive deploy／DB migration・schema確認。**本人端末**＝当時の本人確認記録。これらを相互代替しません。
- 本人端末の過去の確認は下記既存文書から継承するもので、この調査で元会話／画像を独立再読したものではありません。元画像等の再閲覧が成立したものは、その範囲を明記します。

### 機能全域の旧→新 coverage

| 領域 | 7月末に既にあったもの | 8月以降、今回原ソースで確認した変化 | 実証段階／限界 |
|---|---|---|---|
| 起動・登録・ログイン・メール確認・パスワード復旧 | AuthContextとRootNavigatorの既存auth、認証リンク処理 | 11/1・11/7：getSessionの遅い結果で新authを戻さない、owner世代・profile abort、ownerごとMainTabs再mount。準備完了まで共通起動画面 | source。auth機能一式を新作と数えない。native cold／warmリンク、再認証の本人一巡は未証明 |
| 本人境界・バックグラウンド復帰 | user別API／local storageの既存構造 | 11/7：useOwnerRequestScopeによるexpectedUserId・AbortSignal・owner世代／foreground境界をNexus、通知、設定等へ接続 | sourceで実質的修復を確認。実際の別アカウント操作一巡と全経路完了は別 |
| 感情入力全体 | 喜び／悲しみ／怒り／不安／平穏／自己理解、weak／medium／strong、9カテゴリ、思考／行動欄、秘密、送信選択、下書き、履歴等 | 11/6：文字拡大に応じた感情選択配置。11/7 owner固定。11/12：本人別Emlis質問受取選択をpayloadへcapture。保存入力IDから新Pieceへ接続する入口 | 主要入力仕様を今期全新規と計上不可。inputOptionsの差は配置コメントのみ。11/12質問選択は8001以後sourceで、本人端末済みではない |
| 下書き保存・復元 | inputDraftStorageと本人別保存・復元 | hook側に起動時bootstrap完了条件等。保存本体 **lib/inputDraftStorage.jsは現headまでblob不変** | 下書き機能の新規完成という主張不可。起動順改善と区別 |
| ホーム・今日の問い | current／answers／history／PATCH／settingsの独立APIとUI | API wrapperへoptionsを通す差分、Material画面・owner処理 | 今日の問いはEmlisからの最大3質問とは別商品。質問機能全体の新規計上不可。2cron成功は本人受信証明ではない |
| 入力・問い・報告履歴 | 7月末に既存画面と日週月／各履歴 | 11/6 typography・safe area等、API options／owner確認、新Emlis応答／Piece保存IDの接続 | 通常履歴一式の新規実装とはしない。本文品質・訂正・分析の新差分は各中核担当の証拠と接合 |
| 分析入口・旧MyModel | 7月末のAnalysisTopScreenとAnalysisReportHistory、SelfStructureReport等 | 今回の主な新価値は累積わたしマップ、こころグラフへの変更。個別生成／本人訂正等は分析担当報告 | **AnalysisTopScreenは7月末から現headまでblob不変**。古い大規模inventoryのMyModel画面名は現行ファイル名ではない。旧MyModel全機能を今期新作としない |
| 日・週・月報／こころグラフ | 7月末に日週月報と履歴の入口が存在 | 11/8：本人の原入力から秘密・自己理解を除いて直接加重集計するJST今日／月曜週／暦月の通常グラフへ接続。円＋4時間帯／日別100％棒、欠測・未来・履歴範囲の区別、保存report適格判定を実sourceで確認（末尾追補） | sourceと通常入口は独立照合。8001本人表示／新入力・削除反映の全確認は継承文書でも残件。旧日週月報全体の新規実装には数えない |
| Nexusの投稿・共鳴・おすすめ・共鳴履歴 | 7月末NexusScreen／nexusApiに各読取・詳細・削除／共鳴等の機能が存在 | 10/11 owner履歴への通常header接続。11/6 Material。11/7 owner別request、履歴選択scope、古い応答の遮断 | 原sourceで具体的な改善あり。SNS全機能を新規完成扱いしない。新Piece familyの公開／moderation成立とは別 |
| 感情通知／感情ログ | 投稿の感情・強さ・時刻、feed／未読・既読、個人別受信設定 | Material・owner処理／遅い読取結果の隔離 | メモ本文の公開ではない。実通知配送の新成功はこの調査では未証明 |
| アカウント・Friend相当／フォロー・申請 | AccountScreen／useAccountFollowStateにfollow、requested状態、follow一覧、code等が既存 | 11/6〜7：safe area、keyboard避け、入力欄／ボタン、Material | 現行はアカウント／フォロー。旧Friendという名前を新機能へ再計上しない。フォロー申請・非公開全状態の実機一巡は別 |
| ID検索・公開設定／共有プロフィール | 7月末にID検索hook、公開設定、共有codeリンクとprofile導線 | 検索表示・公開設定UIの調整 | **useAccountIdSearch.jsとnavigation/linkingRuntime.jsは現headまでblob不変**。検索／リンク自体を新成果としない。新Piece公開検索とは別 |
| Ranking | 7月末にRanking tabと各画面 | 11/1の起動変更で通常MainTabsからRanking入口を除去しInput／Analysis／Piece／Settingsの4tabへ | 方針による入口撤去。ranking画面ファイルの存在を現在入口や新完成の証拠にしない |
| ガイド・チュートリアル・お知らせ | 7月末に画面、教程context、notice modal／履歴／actionが既存 | 11/6：Material、typography、safe area、残画面とmodal方向対応。現在内容は各現行機能のguideへ | 見た目／導線改修。全教材の内容監修完了や未読配送の実証は別 |
| 共通UI・文字拡大・横向き | 既存バーガンディ／アイボリー、White＆Gold、Black＆Navyの3テーマ | 9/14 light／dark見出しcontrast。11/6 Material面・文字token・tab高さ／感情配置・modal方向。紫系への一時変更後、11/6に元ブランド色復帰。11/7大きなcapsule button、11/8設定のpreview配置復帰 | 実sourceと7401／7501／8001 Actionsを確認。全OS／全画面の最大文字／横向き受入れを証明したものではない |
| 設定 | アプリ設定／購読／その他の3遷移、theme／notification／restore／logout／deleteが既存 | 11/8：現在plan＋アプリ設定＋購読操作＋その他＋footerを一画面へ合成。theme preview、notification行のwrap等 | 実画面コード差分。8001 upload成功は独立確認、当該設定の本人確認は既存文書でも残件 |
| 追加有料アプリテーマ | 7月末から3テーマが存在 | ThemeContextの現行もdefault／light／darkのみ。追加palette／有料entitlement gateはここでは確認できない | 追加有料テーマの実装済み証拠なし。Pieceの12配色と混同不可 |
| 購入・復元・保留・finish・entitlement | 7月末にIAP、native購入identity、復元、購読tier更新、管理画面導線が存在 | 9/14復元取得失敗を購入なし扱いしない。10/31〜11/7 owner:key単位の共通Promise、backend更新後finish、finish両方式失敗の伝播・retry可能化、owner世代別tier状態、旧auth応答遮断 | 実ソース差分。購入・復元全機構を今期新作とは数えない。両Store実購入、pending→確定、restore、失効／解約／account切替の実成功は未確認 |
| 料金表示 | 7月末fallbackはPlus300円／Premium980円 | 10/31決定を受け現行fallback680円／1480円、選択画面／account helper等へ同期。実DB料金更新と11/1bootstrap200は当時記録 | fallback差分は原本で確認。今回は料金DB行／公開bootstrap未再取得。Store請求価格・商品有効状態の証明にしない |
| ログアウト・退会／派生データ | logout・削除API、下書き／map既読／報告cacheの本人別cleanupは既存 | 11/7：delete要求とsignOutへexpectedUserId。11/12質問受取preferenceのlocal cleanup追加 | source修復。新Piece familyの退会削除をaccount_delete_serviceで担保する接続は確認できない。live catalogの選定triggerにもpiece_records参照なし。実削除事故を観測した主張ではない |
| 通知設定／未読・tap・cold／warm | push token登録、global／個人設定、既読、today-question等へのtapが既存 | 11/7 token登録owner固定。11/8 watashi_map_updatedにuser／version必須、本人一致でAnalysisへ、owner切替時pending target廃棄・banner更新 | sourceと2cron実行成功を確認。token登録・queue／cron成功から本人到着／tap成功へ格上げ不可。通知OFF方針も勝手変更不可 |
| iOS | 7月末から既存iOS／RNアプリとbuild系統 | 下記6701→7401→7501→8001のbuild／archive／IPA／upload実行成功を原本で確認 | 最新本人内部配布8001という当時記録を継承。11/12〜14の現sourceが端末へ配布済みではない。新buildは開始していない |
| Android | 既存Android project／manifest・signing構成 | 10/31手動signed AAB workflow、versionCode検証・bundleRelease／artifact化。描画candidate／PNG検証コードは存在 | **通常作成supportsPieceBitmapCreationは現在もiOS以外false**。AAB workflow存在は実成功／Play配布証拠ではない。Android通常生成・保存／写真／共有の本人一巡は未成立 |
| 配置／常時運転／費用 | 既存API、worker、2通知cron | 下記fresh Live metadataとDB適用を独立確認 | Liveは配置状態で、全体end-to-endの成功／GPU継続性／月次原価の証明ではない。推論単発秒数やGPU単価で月額1万円以内を断定不可 |
| privacy／Store提出・運用資料 | 利用規約／privacy／サブスク案内や設定診断の既存コード | 設定footerはruntime URLがある行を表示、purchase画面に既存legal fallback、support fallback空、構成warning／未設定案内あり | URL存在・warning実装だけで最新privacy内容／到達性／Store readiness完了とはしない。管理診断のtoken未設定時returnというsourceも残る。effective token設定／無認証露出を本調査で実測していない |

### 新差分を直接追える原本

- [旧AuthContext](https://github.com/MassyuRed/Cocolon/blob/b13271e75c0dc7bedb2b84927c1dbe1018a0255c/AuthContext.js) → [現AuthContext](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/AuthContext.js)／[11/7 owner修復commit](https://github.com/MassyuRed/Cocolon/commit/56e65b1a97a63f707abd4e043bcfadd82e051573)。
- [旧IAP](https://github.com/MassyuRed/Cocolon/blob/b13271e75c0dc7bedb2b84927c1dbe1018a0255c/lib/iap/iapService.js) → [現IAP](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/lib/iap/iapService.js)／[9/14復元エラー区別](https://github.com/MassyuRed/Cocolon/commit/99dab296e94af1f9a5f124f2254c0b60febf6713)／[10/31競合・Android準備](https://github.com/MassyuRed/Cocolon/commit/5f91cacedc72acc3c1ee182869605afad8a16b1c)。
- [旧3テーマ](https://github.com/MassyuRed/Cocolon/blob/b13271e75c0dc7bedb2b84927c1dbe1018a0255c/theme/ThemeContext.js) → [現3テーマ／Material色](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/theme/ThemeContext.js)／[11/6元配色復帰](https://github.com/MassyuRed/Cocolon/commit/b64cfa7692d464fbcf047263f1113c6feec96690)。
- [11/6文字拡大](https://github.com/MassyuRed/Cocolon/commit/e4439d4a86f3ab9f4b92715b7d5151c6ff4470b4)／[11/7capsule button](https://github.com/MassyuRed/Cocolon/commit/e0ec6d6a9330f9e493308be85debbb1b062d80f6)／[11/8設定画面・pending応答](https://github.com/MassyuRed/Cocolon/commit/219904a7121ff69c78a43bbfcc980a7c3106d220)。
- [旧今日の問いAPI](https://github.com/MassyuRed/Cocolon/blob/b13271e75c0dc7bedb2b84927c1dbe1018a0255c/lib/api/home/todayQuestionApi.js) → [現API](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/lib/api/home/todayQuestionApi.js)。
- [11/8わたしマップ通知owner遷移](https://github.com/MassyuRed/Cocolon/commit/e2d7a7a15d42a098c8df24544f032ffe095d7f09)／[11/12本人別問い受取](https://github.com/MassyuRed/Cocolon/commit/e6aabd332970b3cf159d5e8a495ecb67aed92f5f)。
- [現Android作成停止とcandidate描画](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/features/piece/pieceRenderer.js#L17)／[AAB workflow](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/.github/workflows/android-release.yml)。
- [現account_delete_service](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/account_delete_service.py)／[管理token判定](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/subscription_release_config.py#L110)。

### 現Liveの独立再確認（read-only）

| 稼働対象 | 実メタデータ | 証明できること／できないこと |
|---|---|---|
| API | **cb6301ed9a0b77fa7342e71c078d64a9075dad7a**、dep-dbs16gafngtc73bek5a0、2026-11-14 07:53:56 UTC finished、status live | 現APIがNov14最新sourceへ配置済み。サービス設定のstartCommandではprivate5のrequested／readyが全true。実HTTPのeffective flag応答・生成成功を新規測定したものではない |
| worker | **75e526d1a90b969643211b3512b59826e78adbfd**、dep-dbrvgv3l550s73f17hpg、11/14 05:59:04 UTC、live | APIと同一SHAではない。workerの最新処理成功、GPU永続提供、全featureの同版をここから断定しない |
| 今日の問いpush cron | **497f7008fec8935885d09d2e430499892189b5bb**、dep-dbo129k9v7es73e0ql60、11/8live。lastSuccessfulRunAt **11/14 08:31:12 UTC** | cron成功の独立metadata。本人端末への通知到着・tap成功ではない |
| 報告配布push cron | **497f7008fec8935885d09d2e430499892189b5bb**、dep-dbo12qu417fc73f0aglg、11/8live。lastSuccessfulRunAt **11/14 08:31:15 UTC** | 同上 |
| Supabase | cocolon-project、ACTIVE_HEALTHY。**migration29件、そのうちNov14が12件**。最新 **20261114074859 piece_natural_latest_answer_update** | 「Nov14 SQL未反映」「Liveは全て11/8版だけ」は現在の記述として誤り。migration登録は実際の全操作成功や商品品質受入れの代替ではない |
| schema／RPC | emotions.receive_emlis_questions、emlis_input_threads.started_question_limit、analysis_cumulative_months、piece_records、piece_save_v2新signature／export_receipt等のpg_proc metadata | 本文・個人行を取らず実DBの列／関数存在を確認。関数実行・DB書込はなし。definition_md5を保存したがrepo本文との全byte一致は本調査では未再計算 |
| 退会trigger選定範囲 | auth.usersのuser triggerはINSERT時handle_new_user。profilesのDELETE関連はanalysis失効。選定triggerのfunction bodyにpiece_records参照なし | account service側の未接続と合わせて要確認の根拠。これだけで全ての可能なcleanup経路不存在／実データ残存事故とは断定しない |

Renderの直接確認先：
[API](https://dashboard.render.com/web/srv-d4ppfpm3jp1c73952bj0)／[worker](https://dashboard.render.com/worker/srv-d6copljh46gs73cmeic0)／[今日の問いcron](https://dashboard.render.com/cron/crn-d71rdk7gi27c73fmbgg0)／[報告cron](https://dashboard.render.com/cron/crn-d71re415pdvs7384ocvg)。

### iOSの原本と本人端末証拠の区分

| 版／日 | GitHub Actions原本で独立確認 | 既存記録から継承する本人／Apple情報 |
|---|---|---|
| 6701／11/1 | [run41260929560](https://github.com/MassyuRed/Cocolon/actions/runs/41260929560)、b8a43e5a、completed success | 本人起動、実Auth→4B→DB初回保存／同本文再読の既存記録。実課金成功ではない |
| 7401／11/6 | [run42176982238](https://github.com/MassyuRed/Cocolon/actions/runs/42176982238)、b64cfa76、completed success | 配色／Material修正を含む。全画面の本人受入れを自動認定しない |
| 7501／11/7 | [run42328190568](https://github.com/MassyuRed/Cocolon/actions/runs/42328190568)、e0ec6d6a、completed success | 第10回に大ボタン・Piece関係修正の本人確認記録あり。原画像を本担当で再読していない |
| 8001／11/8 | [run42452923002](https://github.com/MassyuRed/Cocolon/actions/runs/42452923002)、6fdea583。archive／export IPA／Upload to TestFlightの各step success | 既存内部group Testingは文書の記録。今回Apple画面を再取得したものではない。本人の通知到着／tap・設定配置・新Emlis応答確認は既存文書でも未実施 |

7001の画像生成・一覧・スマホ写真保存、7901のこころ天気がおおむね指示どおりという本人確認も既存前提資料・週次記録にあります。ただし本監査で本人の元画像・会話を独立再取得した証拠にはせず、元画像・会話そのものを読んだ証明にはしません。

本人確認の継承元：
[現況前提資料](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/00_cocolon_current_product_and_state.md)、
[10/31週次](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261031.md)、
[11/7週次](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261107.md)。

### 追補：こころグラフの実コード照合（新実行なし）

先の表の「分析担当が実集計を証明」という委譲記述を、ここで実sourceの確認に置換します。対象はAPI cb6301ed…／RN56090884…で、本文・個人行取得、API実行、生成、test、配置は追加していません。

| 照合点 | 実コードで成立する内容 | 原本 |
|---|---|---|
| 通常入口 | 非tutorialの分析・感情tabは、保存済みreport viewerではなくKokoroWeatherTimelineをmount。今日／週／月を既存daily／weekly／monthly選択状態へ対応づける | [AnalysisContentFirstScreen L415](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/screens/AnalysisContentFirstScreen.js#L415) |
| 取得元 | RNは専用GET /analysis/kokoro-weather。APIは本人を認証しtierの閲覧期間を取得、private no-storeでbuild_liveへ。emotionsからid/user/日時/感情/強さ/秘密だけを本人・期間でreadし、日時＋IDのcursorで読み切る。保存reportやAI生成の結果から現在値を作らない | [RN hook L30](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/screens/analysis/useKokoroWeather.js#L30)／[API route L494](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/api_analysis_reads.py#L494)／[DB読取 L582](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/kokoro_weather_service.py#L582) |
| JSTの期間 | 日付anchorはJSTで解釈。今日＝その日0時〜翌日0時、週＝月曜開始7日、月＝暦月1日〜翌月1日。未来anchorを拒否。現在月の表示は今日まで、週は将来分を含む7日slotを保つ。読取対象は現在時刻まで | [期間 L477](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/kokoro_weather_service.py#L477)／[範囲・slot L519](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/kokoro_weather_service.py#L519) |
| 集計・秘密・自己理解 | 喜び／悲しみ／怒り／不安／平穏だけを弱1・中2・強3で加重。自己理解token・未知感情は加算せず、感情合計0の行はlive集計から除く。秘密はDB条件でも行再検証でもis_secretがfalseのものだけ。割合は最大剰余法で合計100％。感情detailsがない既存行はemotions配列＋mediumをfallbackにする | [感情正規化 L178](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/kokoro_weather_service.py#L178)／[加重・100％ L499](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/kokoro_weather_service.py#L499)／[秘密等再検証 L528](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/kokoro_weather_service.py#L528) |
| 欠測・履歴境界・エラー | 記録なし／未来／閲覧範囲外を別statusにし、閲覧途中日はpartial_history。今日の深夜0–6／朝6–12／昼12–18／夜18–24の4slotも無入力のまま返す。欠けた日や時間を感情や天気で補間しない。API取得失敗は503、RNは古い成功値を消してerror表示・明示retry。不正payloadも表示に採用しない | [状態と4時間帯 L541](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/kokoro_weather_service.py#L541)／[RN状態検査 L11](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/screens/analysis/useKokoroWeather.js#L11)／[失敗時切替 L45](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/screens/analysis/useKokoroWeather.js#L45) |
| 表示 | 今日＝感情構成の円＋4時間帯・記録時刻／強さ。週／月＝日ごとの100％積み上げ棒＋選択日の内訳。空slotは記録なし等として表示。通常Timelineは天気分類・温度を表示しない。本人境界／focus／再読／JST日替わりで取得し直すコードがある | [Timeline L86](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/screens/analysisReport/KokoroWeatherTimeline.js#L86)／[日替わり・owner L30](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/screens/analysis/useKokoroWeather.js#L30) |
| 保存reportとの境界 | 保存report用build_report_kokoro_weatherは別関数でcontent_json.kokoroWeatherへ付加するkokoro.weather.v1。旧日週月reportの本文／publish policy／DB名／内部keyを変更しない。liveはkokoro.weather.live.v1で別API・別shape。保存履歴はv1 payload／投影versionの適格検査を行い、古い感情分析reportをこころグラフへ無条件流用しない | [保存report L934](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/kokoro_weather_service.py#L934)／[API保存row適格判定 L690](https://github.com/MassyuRed/mashos-api/blob/cb6301ed9a0b77fa7342e71c078d64a9075dad7a/ai/services/ai_inference/api_analysis_reports.py#L690)／[RN保存row判定 L62](https://github.com/MassyuRed/Cocolon/blob/560908840b6a60368553645edf4b725a34fd3f90/screens/analysisReport/kokoroWeatherFormatters.js#L62) |

新旧差分の日付は[11/8直接集計接続commit66cf4aa3](https://github.com/MassyuRed/mashos-api/commit/66cf4aa3e70e145359d9d7864f6f2b6b278394af)と[11/8こころグラフ改名・既読修復a305b333](https://github.com/MassyuRed/mashos-api/commit/a305b33346b4a90b68f8d92893a7099b31c4d92a)のGitHub原本で確認しました。7月末treeには新Timeline／useKokoroWeatherの両pathがなく、日週月report／履歴の入口は既存です。したがって成果は**既存の日週月報全体の新規実装**ではなく、**原入力直接集計の通常こころグラフを追加・接続し、保存reportとの表示境界を整えたこと**です。

この追補で確定したのはsourceと通常入口の接続です。既存API liveメタデータはこのコードの配置根拠ですが、この調査で本人の新入力／削除による実集計、最大文字／全OSの描画、本人端末での同版一巡を新たに実証したものではありません。


