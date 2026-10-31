# Boundary12 — 意味9/9・本文8/9、条件未達で終了（2026-10-26 JST）

承認source1d5b971ffbf01b4594c1860c1f4b0bf25bf3b989/API4002b457、初期138bから固定12更新→保存/非学習reload→9生成を1032.1661844076589秒（17分12秒）で完了。無補修rawを既存consumerへ一回渡し、意味9/9・本文8/9。全9JSON解析/EOS正常、打切り0。全件成功条件に届かず、条件付き2実service保存再読はmodel/SQL0、eval plan未作成、新041f4161は保存・未採用で終了した。

| 対象 | 実結果 |
|---|---|
| chair6 | 全件parsed教師一致、意味/本文6/6、初回ASK3、訂正各3更新・問いなし/REFINEDを保持 |
| daily01 | 前回`","`→spaceだった区切りは正常になり、意味/本文成功、FINAL |
| daily02 | 意味は採用。観測「帰ってから、うどんを作って食べた。」、受け取り「あったかいものを食べて、少し落ち着けてよ。」となり本文不採用。1557token/EOS/stop、上限打切りではない |
| daily03 | parsed教師一致、意味/本文成功、FINAL |

9件中8件はparsed教師一致。daily02以外の意味・問い・更新は同一で、daily02もsurfaceの2文字列以外は教師一致。rootが全9raw/本文/実問い/更新/採否を確認し、別文脈agentも読取確認。正式Pro/Ultra/human Product Readではない。前回の意味8/9・本文8/9から意味は1件増えたが、全9本文保持は未成立。reader緩和・原raw補修・追加更新・失敗モデル再call・LR探索0。

実学習はchair6全文JSON+EOS各1とdaily3受け取り11＋区切りID2129の1token各2、固定交互12。reception+boundary NLL平均0.2559782167→0.0065368361、chair全文0.0009440483→0.0012243148。対象の異なるNLLを合算せず、低下を品質成功へ換算しない。peak allocated16.1715/reserved19.0176GiB。

重み041f4161fe7bac82b437ecff2711b769ca4c8cfe093ddd04b30b4d728e42d217を早期18対象/32F32有限で回収保存し、完了版の21対象・全9raw211240bytesを照合。同一重みを非学習reload後も保持。完成recovery bundle3,629,750bytes/SHA28cb273fea7bf3dabcb6f40409fba42b814a9c669c72805a3222253a123ccf1cの4対象にtraining archive/consumer/launchを保存し、同一保管identityのversion1へ更新（早期版version0も保持）。元4B全重み・optimizer/RNGは含まない。`consumer.index.json`と28partはconsumer.json全1,670,459bytes/SHA1de5b14af2c3fef0e5ee474c5936f7331ee8d03421622576412275777720a1ecを順連結で完全復元する。

処理按分1032.1661844秒×記録$0.26/h=約$0.07454534。1800秒/$0.13内、条件付き900秒/$0.065未使用。準備・回収・保持・保存・税等別、請求総額ではない。継続GPU料金の停止を意味しない。途中の口頭時間16分46秒は原本確定後17分12秒へ訂正した。

今回の残差へ新観測会は不要。完全な既存教師があり、残る未完文と観測文末の保持を次に照合する。新しい有料試行・loss変更・reader変更は未承認、終了した本planを再起動しない。独立言語2話・一般化未確認・Piece/Analysis完成教師0は残る。

管理console/GPU一覧/Runpod管理API/Stop/再起動/削除/新Pod/charge/依存追加/Supabase/Render/本人DB/RN/通常配置/merge/deploy0。Jupyter直接で実行。JSON単体download待機はtimeoutとなり、既存tarfileでtraining archive/consumer/launchを束ねた回収に切替えた。モデル再実行はない。STRUCTURE_MAP_DELTA_NONE、商品0/正式0/3/54.50％、automatic_progression=false。
