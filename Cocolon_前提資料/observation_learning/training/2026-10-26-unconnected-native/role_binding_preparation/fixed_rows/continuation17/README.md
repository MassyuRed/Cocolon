# continuation17 — 未承認の一回案

2026-10-30 JST。**PROPOSED_NOT_APPROVED。GPU未実行**。閉鎖済みrehearsal13／prior_rows2／syntax2bの再開ではありません。

## 目的・根拠・限界

BOOK／SHOPの本人回答後、4Bが意味・更新・本人向け本文を自分で完成し、既存CMEEが採用・保存再読する未完了へ戻ります。現2題には原材料と正解教師があり、追加観測会を求めません。

保存11446641を作った原training.jsonlでは、BOOKの更新直前CEはstep1=0.2678050399→step6=0.1722135693、SHOPはstep3=0.2665741742→step9=0.1973555088。旧9は約0.0010〜0.0063です。新2題はこの13更新で各2回、旧9は各1回。これは新2題への適合が相対的に弱かったという仮説の根拠です。**最後の保存重みのNLLではなく、重要なfield位置の誤りを局所化した値でもありません。追加各4回は予算内の有限量で、最適量・改善保証ではありません。** 既存語句汚染・5群の表記差を新しい原因と呼びません。

今回のCPU合成kernel比較6条件では一括chunk／逐次recurrentの出力差はFP32最大2.2351741791e-8、BF16は0、全有限でした。CPU fallbackだけの結果で、実4B全体のcache／convolution／GPU kernelの正常性や、追加学習の必要性の証拠には使いません。

## 一回の具体範囲

- 同Pod／A5000。保存114466411f36f0eef7a2dceaec7f5190544ac8545eb6b2f6a3d0446b70f90b66を開始点に、原rehearsal13の全11messages／evalをそのまま使います。
- BOOK／SHOP各4更新＋旧9各1更新＝**17更新**。全assistant＋EOS CE、112tensor、AdamW LR5e-5、clip1、seed20261024を保持。新prompt／prior表記／教師／形式／grammar／loss重み／cap変更はありません。
- 保存→別の非学習load→新2生成。**新2が既存CMEEの意味・本人本文・別process保存再読2/2に達した場合だけ旧9を各1生成**します。新2不成立なら旧9の9callを実行しません。
- 成功条件は新2の2/2、現在の旧9成功**全9/9**保持、全採用snapshotのcold full outcomeとreceipt replay一致、rootによる全raw／成立本人本文の確認。旧7/9へ分母を下げません。
- GPU最大2load・17更新・11生成、各生成180秒、親2690秒＋kill10秒、全2700秒（45分）。同じrunのretry／追加更新／fallback／raw修復は0。
- 処理按分最大**$0.21**（履歴$0.28/h×2700秒、live単価再照会なし）。同process内のCMEE/coldは時間に含みます。準備・回収・保持・保存・通信・税等は別です。新GPU契約／Stop/restart/deleteはありません。
- 失敗時も途中／最終adapter・原ログ・raw/token IDs・snapshot/coldを回収します。失敗または成功確認で一回を閉じ、次のGPU試行を自動開始しません。

## 実装とCPU確認

`run_continuation17.py`は既存rehearsal13 runnerの限定派生です。既存consumerのread_raw／save_coldをそのまま使い、新しいreceiverや検査基盤を作りません。通常サービス／API／DB／RN／Render／Supabase／依存／merge／deployは変更0。

`prepare_cpu.py`は既存保存encodingと全11messages一致、17順序、既存frozen、保存11446641・112有限CPU tensor、runner構文を照合し、別CPU作業directoryへ同一messagesとencodingを保存します。教師のCMEE成功は既存CPU証拠を再利用するだけで、今回モデル成果へ数えません。

CPU実行結果はまだ未記録です。plan.statusはPROPOSED_NOT_APPROVEDで、実行guardによりGPUを開始できません。CPU成功後、準備結果のhashと未実行状態をこの案へ反映します。

## 判断と保護

現在環境はCodex Work。root華恋が単一writer／executor／judge、補助はread-only。正式Pro／Ultra／human受入れを実施したとは扱いません。新しい学習配分と有料一回は既存閉鎖planの承認から引き継がず、Mashの個別判断を必要とします。

商品0／正式0/3／54.50％、candidate_ready=false、automatic_progression=false。STRUCTURE_MAP_DELTA_NONE（通常経路・共有意味契約に差分なし）。
