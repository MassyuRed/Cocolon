# continuation30一回の最終結果 — 新候補不採用・閉鎖

**現在の直接作業（10/27：continuation30一回完了、意味11/本文9・新6本文0で不採用）：** 承認source e1ed9750/PID67437で初期1d218763・全文CE/LR1e-5・同15/同30順序→別保存/非学習reload→15生成を1578.951346秒/$0.122807処理按分で完了。EOS/JSON12/15、意味11/本文9、旧9は意味/本文9/9で教師packet全文一致、新6は意味2/6・本文0/6。直前228の7/6から旧9を復旧したが、初期1dの11/9から進まず、新6EOS/JSONは6→3へ退行。BOOK/SHOP回答とKNITが3712token反復打切り、BOOK初回unknown束縛/安心補完、SHOP本文の問い混入、REPOT二重主客反転が残り新dd1188e8は通常不採用。cold11/11には本文なしSHOP/REPOT2を含み、本文11完成ではない。全84payload+manifest/32F32有限/早期最終重み一致をPod外照合しversion1保全済み。追加更新/再生成/再起動/retryなし。同じ回数・LR調整の連続試行を自動追加せず、長い更新packetと自然本文の学習設計を既存原本から見直す。新観測会は今は不要。原本continuation30_result/README・weekly§66、商品0/正式0/3/54.50％、GPU稼働保持。

## 実行と比較

Mashが固定案b6ab7edcc9498d0ba2b5973f0e5efcd33a651516へ「進めていいよ。」と承認。planのstatus/authorization/basisだけをe1ed975034ffaf6eb1c1b8a662d8cf8e16c4d3aaへ束縛し、Jupyter直接でPID67437を一回起動しました。初期1d218763から同quote15を固定30順序/2pass、全文assistant＋EOS CE、LR1e-5、seed/32F32 LoRA・context8192・旧9cap2560/新6cap3712は固定です。fresh optimizerであり厳密なoptimizer/RNG途中再開ではありません。

30更新→別adapter保存→非学習reload→15callを **1578.951346秒（26分18.951秒）・処理按分$0.122807** で完了。2700秒/$0.21内、準備/回収/保持/保存/通信/税等は別です。per-call timeout/OOM/追加更新/再生成/retryは0。3件のlengthは3712token上限で、180秒timeoutではありません。

| 指標 | 初期1d218763 | 直前228edccf | 今回dd1188e8 |
|---|---:|---:|---:|
| EOS | 15/15 | 13/15 | 12/15 |
| JSON構文 | 15/15 | 11/15 | 12/15 |
| CMEE意味採用 | 11/15 | 7/15 | 11/15 |
| CMEE本文成立 | 9/15 | 6/15 | 9/15 |
| 旧9本文 | 9/9 | 6/9 | 9/9 |
| 新6本文 | 0/6 | 0/6 | 0/6 |

直前からの旧9復旧は事実ですが、初期1dと同じ本文9件であり、今回の30更新で新たな本文成立を増やせたとは評価しません。新6は3/6EOS/JSONへ退行しました。初期/損失/LRを同時に変えた一回なので、退行の原因を一つの要素だけへ断定しません。

## 全15件

| case_id | EOS | 意味 | 本文 | 理由 |
|---|---|---|---|---|
| TRAIN-SERVICE-CHAIR-01-INITIAL | ○ | 採用 | 成立 | model_question_candidate_ready |
| TRAIN-SERVICE-CHAIR-01-CORRECTION | ○ | 採用 | 成立 | free_round_complete |
| TRAIN-SERVICE-CHAIR-02-INITIAL | ○ | 採用 | 成立 | model_question_candidate_ready |
| TRAIN-SERVICE-CHAIR-02-CORRECTION | ○ | 採用 | 成立 | free_round_complete |
| TRAIN-SERVICE-CHAIR-03-INITIAL | ○ | 採用 | 成立 | model_question_candidate_ready |
| TRAIN-SERVICE-CHAIR-03-CORRECTION | ○ | 採用 | 成立 | free_round_complete |
| TRAIN-DAILY-CALM-01-INITIAL | ○ | 採用 | 成立 | model_question_not_proposed |
| TRAIN-DAILY-CALM-02-INITIAL | ○ | 採用 | 成立 | model_question_not_proposed |
| TRAIN-DAILY-CALM-03-INITIAL | ○ | 採用 | 成立 | model_question_not_proposed |
| FT-BOOK-INITIAL | ○ | 不採用 | なし | model_v3_unknown_not_source_bound |
| FT-BOOK-AFTER-ANSWER | length | 不採用 | なし | semantic_receipt_not_validated |
| FT-SHOP-INITIAL | ○ | 採用 | なし | model_surface_not_validated |
| FT-SHOP-AFTER-ANSWER | length | 不採用 | なし | semantic_receipt_not_validated |
| FT-REPOT-INITIAL | ○ | 採用 | なし | model_surface_not_validated |
| FT-KNIT-INITIAL | length | 不採用 | なし | semantic_receipt_not_validated |

固定API6b043880のCPU consumerは **101.201544秒**。新モデル処理/更新/SQL0、採用snapshotの別process cold-file一致 **11/11・失敗0**。SHOP初回とREPOTは本文なしoutcomeのまま一致しており、完成本文11件ではありません。after回答priorは凍結教師由来です。実モデルの動的一往復、実service/SQL/Auth/RN/本人端末、未知一般化、商品受入れは未確認です。

## 本文を読んだ結果

- 旧9は全packetが教師/初期1dと一致。前228で崩れた椅子訂正3の外側版・12引用・参照・3更新が戻りました。実CMEE本文9も保持しますが、喜び語の反復や硬い訂正記録文は初期/教師のままです。旧9は2言語familyのidentity反復です。
- BOOK初回は意味4claim/2relation/引用6を戻しましたが、unknown IDの束縛が不成立。本文には未記載の安心補完と話者の揺れが残ります。BOOK回答は非連絡事実と反実振返りを混同し、観測内で「気になられていて、また、」237回。更新/引用/受け取りへ未到達です。
- SHOP初回は喜びを本文へ戻す局所差がある一方、既述の感覚を観測内で問い直し、復唱と「开店」が残ります。回答後は両否定/本人知覚/距離の字面に部分改善があるもののJSON不正と観測97反復で全8更新へ届きません。
- REPOTの意味/引用は採用されますが、「説明し、最後まで聞かせた」で説明者/受領者を二重反転します。raw_textは初期1dと同一で、前228の「聞いた」への局所差も失いました。
- KNITは原文にない「距離を置いて、過去から離れて」と話者混線を加え、「私の方で、」734回でReceptionを閉じられません。前回の長い指示文が今回rawに現れないことを、途中打切りを無視して漏出解消の成功へ換算しません。

全原文/教師/rawをrootとread-only補助agentで読み、採否と本文読解を分離しました。根拠付き記録はreading_reviews/old9.json・new6.json。正式Pro/Ultra/human受入れではありません。raw補修/教師置換/reader緩和は0です。

## 保存と再開境界

新追加重みSHA256は `dd1188e8d715cf2d7bb1479c5c2158a0ecc98a9355d80f3d94510736bddc317b`。初期1dと固定sourceは不変、生成前後/早期最終の新重みは一致。32個のF32 tensorは全て有限です。

[重み・全原本version1](https://chatgpt.com/library?file_id=libfile_ce620ca836208191a9a9649daca3a90f&account_id=personal) は **3955270bytes / SHA256 75fa00ca490e07bf963cc849db02506fb3e8f9e80a274f537c138b944249c78c**、全84payload＋manifest/85memberをPod外で照合済みです。元4B全重み/optimizer/RNGは非同梱。早期version0は399.670965秒/30更新/生成0の15payload＋manifestで、early_run/early_recoveryは不変に保持します。最終保全情報はfinal_recovery.json、全archive payloadの所在/hashはrecovery_manifest.jsonです。

run.jsonはモデル処理終了時のpending表記の原本を変更せず、最終採否はresult_summary.jsonと本READMEで確定します。実行source/plan/consumerは既存continuation30_preparation、凍結教師/評価はnative15_preparationの正本を参照し、同じ教材をGitHubへ重複保存しません。

**この一回は閉鎖済みで再起動しません。** 通常候補へは採用しません。同じ回数/LRだけを調整する有料試行を連続追加せず、長い更新packet・原文役割と自然本文を教える学習設計を既存原本から見直す段階です。この基本欠陥の修正前に新観測会を求める根拠はありません。別の学習/生成/接続契約変更へ自動進行しません。

primary=BLOCKER_NARROWED、商品credit0/正式0/3/全体管理54.50％/candidate_ready=false/automatic_progression=false。製品責務/型/wire/API/DTO/DB/RN/Render/Supabase/本人DB/価格/通常有効化/merge/deploy/GPU管理・lifecycle変更0、STRUCTURE_MAP_DELTA_NONE。GPUは稼働保持です。
