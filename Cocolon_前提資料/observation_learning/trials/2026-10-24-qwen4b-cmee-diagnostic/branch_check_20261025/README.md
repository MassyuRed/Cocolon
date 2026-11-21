# 訂正後の受け取りの最初のtoken分岐（完了・重み変更なし）

Mashの今回の「4B学習＋CMEE接続を進めて」に従い、前回指定された固定prompt・保存a8baf0…で局所診断する。Codex Work/GPT-6、root華恋が単一実行/編集/反映owner、補助agentは読取reviewのみ。別modelのPro/Ultra実行と偽らない。

OBSERVED_BLOCKER_MINIMAL_FIX。現在のexact1未完了は、既知訂正例の受け取り第2文が既存readerを通らず本文1/2に留まること。保存された生成の実token prefixでteacher/actualのrank・確率を測り、平均lossの低下だけでは未確認だった分岐を絞る。新しい管理systemは作らず、一回3forwardだけ。固定入力・同じ重み・元rawのままなので、promptの再変更や追加epochより小さい。900秒/表示$0.26/h按分上限$0.065、保持/準備/回収/税を含む請求hard capではない。新しいMash操作は不要。完了は原source/raw/adapter照合、分岐と条件付きscoreの回収、重み不変。失敗/期限超過は再実行せず記録する。

全体現在地全文、work rules入口/CURRENT_RULES/18/incident、全体設計01・全file地図01A・三中核入口・最新weekly§31・観測学習目的を確認した。System Context最新cache未生成は既知のまま、fresh原本の直接読取を使い、長時間refreshを反復しない。対象は既存公開済み架空chair2入力だけ。Karen-Diaryは判断用参照に留め、GPU/公開GitHubへ送らない。教材・本人DB・private資料の追加取得送信0。

コードは既存pack/branch_check/diagnostic.py、有限scopeは同plan.json。学習時directoryのrunnerとmessages、after rawをSHA256固定し、保存output_token_idsとteacher chat completion idsの最初の差を特定する。分岐直前の全prompt+実prefixを使う。次に原rawのreception spanだけをteacherへ置換した反事実と原文をそれぞれcanonical token化してteacher forcingで採点。receptionと分岐suffixのtoken数・sum/mean NLL・境界跨ぎ・原生成tokenとの一致を記録する。EOS/newlineは採点外。BF16 full-prefixと元cache生成の数値差、異なる長さ/token化の制限を保持し、scoreを生成成功・本文採用・商品品質に数えない。

prompt/教材/teacher/意味/reader/採用条件/重み変更0、generate/optimizer/update0、既存A4500のみ。Stop/再起動/削除/新Pod/チャージ/新依存/Render/Supabase/本人DB/通常有効化/merge/deploy0。旧runとplanは閉じたまま。観測会は今回不要。意味2/2・本文1/2/正式0/3/54.50％を維持。STRUCTURE_MAP_DELTA_NONE（有限診断と結果所在だけ、製品責務と公開contract不変）。

## 実結果

13.145198253914714秒、3forward完了/3attempt、生成0/optimizer0/update0。最初の生成token差は0始まり1116、token共通prefix4220文字（本文文字差4225）。actual token198697「ようになった」p=0.5024427175521851/rank1、teacher token207727「ようになって」p=0.237337127327919/rank2、logit差0.75。full-prefix再計算のargmaxは記録生成と一致。teacher reception全24tokenのNLL平均0.09130503982305527、分岐tokenは1.4382736682891846。長さの違う二文の平均/合計を採用優劣へ使わない。原文reception22tokenとteacher24tokenの分岐suffix、全token NLLはresult.jsonに記録。

原prompt5018token、保存adapter3hash・baseline raw不変。32tensor finite、trainable0、peak allocated9.875100135803223GiB。原rawはreception終端までcanonical tokenと実生成idsが一致するが、全文末尾はspecial/EOSの差で不一致。EOSと末尾改行を採点へ混ぜていない。BF16/full-prefixと元cache生成の数値差の制限を保持する。

result.json SHA256 f87981941a0836f44c942e96091dad37cef1d2075f54692e01e56c34a7b774e3、22,503bytes。回収後、Pod上で受領hashとのprogram比較Trueを確認。ダウンロード待機はツールtimeoutになったがファイル自体は回収済み、再download/再forward0。画面hashの初回転記誤り08→09でlocal照合が失敗し、原JSONとPodのprogram比較で08を正として修復。診断失敗ではない。

全体loss0.0026という平均値だけでは、この局所分岐のteacher rank2を確認できなかった。形式tokenへのloss配分が局所誤りを隠したという説明は仮説で、勾配の原因確定ではない。次は同teacherのreceptionにlossを限定する4update一回candidateを具体化し、prompt/教師/readerを変えずに同2生成・実CMEE採否で判断する。追加epochの無目的反復、token強制/出力後補修、採用緩和は行わない。現結果自体はBLOCKER_NARROWED、商品credit0、意味2/2・本文1/2/正式0/3/54.50％のまま。表示単価による本process按分$0.000949375429449396は請求総額ではない。
