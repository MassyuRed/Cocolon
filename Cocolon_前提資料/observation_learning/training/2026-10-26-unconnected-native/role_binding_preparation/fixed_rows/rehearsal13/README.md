# 修正済み固定列2教師＋旧9教材の13更新案 — CPU完了、GPU未承認・未実行

前回[shape2の一回](../prompt_shape2/result_20261029/README.md)は元f493から0更新・2生成で、両cap未完・意味/本人本文0/2、不採用で閉鎖した。今回、そのrunや不採用f811を再起動しない。**修正済みshape2を実際に学習することと、旧成功の全教材を同時に保持すること**を一つの有限試行として具体化した。root華恋のみが編集・実行・判断、補助はread-only。実際の環境はGPT-6 Codex Workで、正式Pro/Ultra/human受入れを称しない。

## 変えるものと、判断の限界

| 比較 | 全文BOOK/SHOP | 旧9教材 |
|---|---|---|
| fixedrows5（終了・不採用） | 修正前指示を各1更新 | 椅子01訂正・02初回・03初回の3件だけ |
| shape2（終了・不採用） | 指示2点修正後、追加学習0 | 追加学習0／旧9再生成0 |
| 今回提案 | **同じshape2教師を各2更新** | **凍結旧9を各1更新** |

合計13更新、独立教材は11行である。同じ題材の繰返しを新しい独立事例へ数えない。system/material/prior/output_spec/教師意味/全更新/bind/本人本文/EOSはshape2または旧9の元bytesのまま。新しい表記修正、loss重み・suffix調整、receiver/decoder拡張はしない。既存比較の再命名ではなく、修正済shape2の初回学習と全旧9のrehearsalを合わせた新配分である。

前回anchor3では、旧成功7件中4件がそのrunの再学習対象に入っていなかった。ただし実際に失った椅子01訂正は再学習済みだった。**anchor不足だけが原因、13更新で解決、4B能力不足、教材不足とは断定しない。** この一回は更新回数と旧教材配分の個別効果を分離する試験でもない。目的は、意味を省かず新全文2件がCMEEで成立し、元の成功7件も失わない候補が得られるかを見ること。

## Jupyter CPUの実結果

[prepare_rehearsal13.py](prepare_rehearsal13.py)を同PodのJupyter端末から一回実行。**29.907477136秒、model load/forward/更新/生成0、exit0。** 新依存なし。固定tokenizerと既存112F32のf493をCPUで確認した。

- 全11件のtrain/eval prefix一致、入力部分mask=-100、全assistant＋EOS監督、EOSちょうど1個を確認。
- 新2のmessages/教師/実token列はshape2と完全同一、旧9は凍結原本と全値・bytes・実token計数が同一。最大学習系列6871、prompt＋既存生成capの最大8031≤8192。
- 新2教師を既存receiverへ渡し、意味/本人本文2/2、元rows/metadataによるreceipt replay、別process coldの全outcomeを確認。前回shape2 CPU教師の全resultと一致。rootが両本人本文を全文読了した。教師対照を実4B成功に数えない。
- 全176frozenと既存依存transformers5.19.0/peft0.21.2/accelerate1.15.0/safetensors0.8.0を照合。f493 hash/112F32全finite不変。

[cpu_summary.json](cpu_summary.json)は全件計数と順序、`prepared_cpu.json.gz`は全encoded/labels/frozen/教師outcomeの完全原本。[train_messages11.jsonl](train_messages11.jsonl)・[eval_inputs11.json](eval_inputs11.json)と`teacher_cmee/`の2saved/2coldを保持する。圧縮reportは104552bytes、SHA256 `ddf81a26f67e98fff901cc78e405f06919ab9cbe4ad6cbc49908a6b8cf616165`。

回収用ZIPは235752bytes、SHA256 `178917a6f0d8013de961e8944e6d4c507afb428ed0f7b16a6608fde1c9abd9b5`、11payload＋manifest＝12member。全CRC/size/SHA、manifest集合、source同一性をPod外で照合し、全payloadを本directoryへ保存した。[archive_manifest.json](archive_manifest.json)／[external_verification.json](external_verification.json)。Download APIは失敗を返したが実fileは到着し、追加download0で照合した。base/adapterをこのCPU回収物へ重複収録していない。元重みは既存の回収済みrole18原本を保持する。

## 次の一回 — 未承認・未実行

[plan.json](plan.json)と[run_rehearsal13.py](run_rehearsal13.py)へ具体条件を固定した。planは`PROPOSED_NOT_APPROVED_NOT_EXECUTED`であり、runnerはモデル処理前に拒否する。Work補助のAST構文検査と、この未承認拒否を確認済み。read-only reviewで見つけたcall内adapter identity欠落は実行前に補い、既存consumerの`--phase after`との参照を揃えた。これらをGPU検証成功とは扱わない。

1. 同Pod vgkm402msgroiu/RTX A5000、Qwen3.5-4B revision851bf6e、**元f493**をtrainableで1load。拒否済みf811/45a1は使わない。既存112parameter tensorのみ、全assistant＋EOSの通常CE、LR5e-5/weight decay0/clip1/seed20261024。順序はplanのexact13。
2. 13更新後は別directoryへ保存、GPUを解放し、同じ新重みを非学習で再load。BOOK→SHOP→旧9の**11自由生成だけ**を行う。context8192、cap3712/3584/旧9各2560、各180秒、既存greedy/非thinking。意味prefix・文法拘束・raw補完0。前回のf493 before2=0/2・旧9=7/9は歴史原本を比較に用い、同じbeforeを再生成しない。
3. 全GPU processはtimeout2690秒＋kill10秒＝**最大45分**。前回同Pod表示$0.28/hによる**処理按分最大$0.21**、live単価再照会なし。準備/親外CMEE CPU/回収/保持/保存/通信/税等は別。完走・改善の保証はしない。
4. GPU解放後、既存`consume_fixed_rows5.py --phase after`で11rawをそのまま受領。CPU親外150秒、各採用snapshotのcold60秒上限。全raw/token IDs/finish/model/base/adapter metadata、112loaded/reloaded表、教師とsourceを保存する。
5. 成功条件は**新2意味/本人本文2/2＋元成功7件をIDごとに全維持＋全成立snapshotのcold全outcome/receipt replay一致＋rootが全11raw/全本人本文を読了**。総数7/9だけでは維持と認めない。未知一般化、動的service成功、商品受入れ、本番採用へ換算しない。
6. 不成立/timeout/形式不正/旧成功喪失でその一回を不採用として閉じる。retry、追加更新、raw修復、旧形式fallback、検査緩和、次run、自動採用0。partial/final重みも回収・照合し、元f493は変更しない。GPUはMashの指示まで保持する。

承認後の起動は、新sourceと承認status、CPU report/全frozen/依存を再確認し、同directoryにrunnerと承認済みplanを配置した後の一回だけ。OUT=`/workspace/cocolon_rehearsal13_run_20261029`の排他作成を使い、既存OUTは削除・再利用しない。前回の0更新一回承認を13更新の許可へ延長しない。費用・新学習配分はRule18 §11.3の個別判断対象であり、今回のCPU準備からGPUを自動開始しない。

## 今回の位置付け

新しい観測会は現2題の欠陥解消には今は不要。既存の教師がCMEEで成立するため、まず学習済み表記と新表記の同時保持を検証する。三coreの商品目的は維持し、今回はEmlis回答後のprivate offline候補だけ。通常ModelCandidateSource/共有意味型/公開API/DTO/DB/RN/Render/Supabase・依存・merge/deployの変更0。`STRUCTURE_MAP_DELTA_NONE`。primary outcomeはBLOCKER_NARROWED、商品0/正式0/3/54.50％、candidate_ready=false、automatic_progression=false。
