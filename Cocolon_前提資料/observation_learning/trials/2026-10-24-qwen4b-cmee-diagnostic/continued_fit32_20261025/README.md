# 保存済み4Bからの32更新・固定2例の適合試験

32update/既存2target×16周を574.555秒で完走。保存済み06ca6381…から新optimizerで継続し、新adapterを保存/非学習reload、32tensor有限/旧3hash不変を確認。教師加重NLL0.221367054→0.054428520。同messagesの実CMEE採用は前0/2→後0/2。beforeは既存raw再利用、after2生成のみ。

source `dc209feba46d55325eafb2b57f15c9d99c5cc967` / API `32dc3b3137ddc0a4401d2d1d045123f7da17683a`、run `20261025-034400-79baf136`。新adapter SHA256 `ce644a5ba57dfcb9c8df047000cf45ba9ab32c1d09321d8a8da0f5a73fd6b0f4`、archive SHA256 `59692c68a9fb1291120b987cb482a80365d24f3a6fccde089fc5d7f0e6887ec0`。全24memberのbytes/hashとadapter32tensor有限性をPod外で確認。base全重み/optimizer/RNGの厳密途中再開状態は含まない。

以下のbefore/afterは同2教師familyのFITで、未知評価や実初回の問いから動的に作った訂正入力ではない。実rawをminify/補修/正解置換せず、既存CMEE32dc3b3のconsumerへ渡した。messages/identityを照合し、元raw・NLL・全32step・実plan/sourceと採否を本directoryへ保存。通常application/DB/Render/Supabase/RN/本番配置は変更0。

学習量の仮説を明示した新しい一回で、完了済みepoch1の再実行ではない。SIGALRM/SIGTERMによる期限時の記録/退避を独立reviewで修復してから開始した。process1800秒/計画$1内、表示$0.26/hのprocess按分は約$0.04150で、準備/回収/継続保持/税を含む請求額ではない。GPU停止/再起動/削除/新Pod/チャージ0。current planは終了済みに閉じ、同runの自動再試行/追加増量0。

形式・意味の機械採用と自然さ・一般入力・三中核・通常保存再読・本人端末・商品受入れは区別する。商品credit0/正式0/3/54.50％は据置。新観測会は今回の形式/適合問題には不要。Piece/Analysis完成教師0・独立未知評価の不足は残る。具体的な本文診断と次作業は同weekly§30の最終記録に置く。

## 全2本文の確認と、残る共通原因

学習後はminified JSON・重複なし・stopが2/2へ改善した。CMEEは両方INVALID_EVIDENCEで、意味採用/本文は0/2。採用条件を緩めたり、数字を正解へ付け替えたりしていない。

初回は6根拠中5件で指定sliceとquoteが一致しない。修理0..13は正0..14、結果14..22は15..26、喜び11..19は12..18、「を」10..14は9..10、「が」10..19は10..11。訂正は元入力の最初6根拠だけが正しく、補足4根拠はすべて誤座標：友人0..13は25..38、一緒14..24は39..47、再使用26..39は72..91、否定19..47は59..71。本人の訂正文全体ではなく、切り出した節の先頭を0として数えたような出力が残る（推定で、内部計算過程の実測ではない）。

初回はjoyとobjectのkindが逆で、reception.claim_refsへunknown IDを混入。reception本文は同じ質問を2回反復し、人への受け取りになっていない。訂正は独力の旧claimを外し、共同修理/再使用の6claimと3updatesまで出せたが、friend/joint/reuseの根拠index4/5/6が実evidence6/7/8とずれる。update_noteのupdate_refsもない。本文は原文調の復唱であり、自然な受け取りは未達。独立read-only reviewもこれらと整合した。低品質本文の確認をMashへ戻さない。

次の直接作業は同2sourceのまま、欄内位置を数えさせず原文上で参照できる入力提示、およびevidence/claim/unknown/updateの参照とsection役割の取り違えをCPUで具体化する最小修復。原文/資格/採用条件/原rawは保持する。今回の32updateは終了し、追加epoch・同run再実行・次GPU診断を自動で増やさない。別の意味/出力契約が必要なら具体差を先に示す。観測会はこの形式・根拠問題の解決に不要で、未教示のPiece/Analysis/一般入力の完成を保証するものではない。

重み入りarchiveはPod外で回収照合後に保管済み。保存ID `libfile_416a445cb4b08191b1357b5cc769f6d5`。モデル全重みではなくLoRA/設定/条件/教材/実出力で、元baseの固定revisionを併せて使う。本文の復唱・問い混入を残しているため、今回のprimaryは限定TECHNICAL_CREDIT（形式学習の効果と回収の確認）、product_credit=0。通常アプリへの接続成功とは報告しない。
