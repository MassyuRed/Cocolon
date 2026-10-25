# 訂正後の受け取りの最初のtoken分岐（実行前）

Mashの今回の「4B学習＋CMEE接続を進めて」に従い、前回指定された固定prompt・保存a8baf0…で局所診断する。Codex Work/GPT-6、root華恋が単一実行/編集/反映owner、補助agentは読取reviewのみ。別modelのPro/Ultra実行と偽らない。

OBSERVED_BLOCKER_MINIMAL_FIX。現在のexact1未完了は、既知訂正例の受け取り第2文が既存readerを通らず本文1/2に留まること。保存された生成の実token prefixでteacher/actualのrank・確率を測り、平均lossの低下だけでは未確認だった分岐を絞る。新しい管理systemは作らず、一回3forwardだけ。固定入力・同じ重み・元rawのままなので、promptの再変更や追加epochより小さい。900秒/表示$0.26/h按分上限$0.065、保持/準備/回収/税を含む請求hard capではない。新しいMash操作は不要。完了は原source/raw/adapter照合、分岐と条件付きscoreの回収、重み不変。失敗/期限超過は再実行せず記録する。

全体現在地全文、work rules入口/CURRENT_RULES/18/incident、全体設計01・全file地図01A・三中核入口・最新weekly§31・観測学習目的を確認した。System Context最新cache未生成は既知のまま、fresh原本の直接読取を使い、長時間refreshを反復しない。対象は既存公開済み架空chair2入力だけ。Karen-Diaryは判断用参照に留め、GPU/公開GitHubへ送らない。教材・本人DB・private資料の追加取得送信0。

コードは既存pack/branch_check/diagnostic.py、有限scopeは同plan.json。学習時directoryのrunnerとmessages、after rawをSHA256固定し、保存output_token_idsとteacher chat completion idsの最初の差を特定する。分岐直前の全prompt+実prefixを使う。次に原rawのreception spanだけをteacherへ置換した反事実と原文をそれぞれcanonical token化してteacher forcingで採点。receptionと分岐suffixのtoken数・sum/mean NLL・境界跨ぎ・原生成tokenとの一致を記録する。EOS/newlineは採点外。BF16 full-prefixと元cache生成の数値差、異なる長さ/token化の制限を保持し、scoreを生成成功・本文採用・商品品質に数えない。

prompt/教材/teacher/意味/reader/採用条件/重み変更0、generate/optimizer/update0、既存A4500のみ。Stop/再起動/削除/新Pod/チャージ/新依存/Render/Supabase/本人DB/通常有効化/merge/deploy0。旧runとplanは閉じたまま。観測会は今回不要。意味2/2・本文1/2/正式0/3/54.50％を維持。STRUCTURE_MAP_DELTA_NONE（有限診断と結果所在だけ、製品責務と公開contract不変）。
