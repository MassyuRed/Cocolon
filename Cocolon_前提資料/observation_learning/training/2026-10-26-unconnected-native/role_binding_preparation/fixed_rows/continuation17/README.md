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

**Jupyter CPU一回は成功済み。** source29130e554d24754641dca830992a3589ad8258d3、内1.698078459秒／外2.110028306秒・exit0。元11messages／evalはbyte不変、全encoded labelsを確認、保存11446641の112F32 tensorは全有限、CUDA初期化なし。追加学習／pretrained model load／forward／生成／新CMEEは全0です。prepared SHAはd3b3d5e3a0b41407388d0d6ee38c2d9995a079911c7d39a4cdbd42fa19ff19e1。plan.statusはPROPOSED_NOT_APPROVEDを維持し、有料実行guardは未解除です。

原本originals.zipは152969bytes、SHA8eed392015d9aad7b774f751061d1002ac07d6f07e98dd741cb72c11130fc2ce、12member／11payload。全CRC／member／bytes／SHA、source2本とGitHub29130／root bytesを回収照合しました。ZIP内planはCPU実行時の未承認原本で、現在のplanはCPU成功hashだけを追記した未承認版です。

| file | 責務 |
|---|---|
| run_continuation17.py | 未承認17更新／save/reload／新2成功時のみ旧9生成・既存CMEE/coldの限定runner |
| prepare_cpu.py | モデル処理なしの原11messages・encoding・112CPU tensor・順序照合 |
| plan.json | 提案範囲／費用／停止／CPU成功hash。PROPOSED_NOT_APPROVED |
| cpu_summary.json、cpu_execution.json、cpu.log、cpu.exit | 同Jupyterの一回CPU実結果と原時間／exit |
| kernel_cpu.json | installed5.19.0の既存torch_chunk_gated_delta_rule／torch_recurrent_gated_delta_ruleを、seed20261030+n、H2/K128/V128、n31/64/129＋逐次3、FP32/BF16で比較した原結果。3.481980063秒、4Bモデル処理0 |
| manifest.json、originals.zip、verification.json | 全11payloadの原本／照合範囲、source・画面hash |
| proof.jpg | CPU成功／承認待ち／GPU保持の実画面 |
| README.md | 起案根拠、限界、全file責務、再開範囲 |

Jupyter入力時に改行が潰れた未実行heredocは終了delimiterで閉じ、bash構文エラーだけで終了しました。モデル処理・ファイル変更は0。CPU比較とprepare本体はそれぞれ一回のみで、retryではありません。

## 判断と保護

現在環境はCodex Work。root華恋が単一writer／executor／judge、補助はread-only。正式Pro／Ultra／human受入れを実施したとは扱いません。新しい学習配分と有料一回は既存閉鎖planの承認から引き継がず、Mashの個別判断を必要とします。

商品0／正式0/3／54.50％、candidate_ready=false、automatic_progression=false。STRUCTURE_MAP_DELTA_NONE（通常経路・共有意味契約に差分なし）。
