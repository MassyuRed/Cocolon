# 10/27 — 同15教材・同30順序の損失配分修正版

**RUN_CLOSED_REJECTED_CANDIDATE。承認済み一回は完了。意味7/15・本文6/15、新6本文0/6のため新候補は通常不採用。**

最終状態と全原本は [balanced30_result/README.md](../balanced30_result/README.md)。planのAUTHORIZED_ONCE_BOUNDは当時の承認記録であり、再起動/追加学習/再生成の許可ではない。以下は承認・準備時の記録として保持する。

今回planの変更はstatus/gpu_run_authorized/approval_basisのみ。runner d989bcf5・focus f0adc2b0・consumer692d3251・教材/reader/API/旧45779は不変。source_bindings.jsonとactual_cpu_check.jsonは承認前候補の不変記録であり、そこにあるpending plan hash/statusを今回の実承認へ遡及書換えしない。承認反映commitを実行sourceとして保持する。再承認は不要。

前回の混在30更新は意味11/15・本文9/15まで改善したが、新6件の本文は0/6だった。新候補1d218763は通常不採用のまま保全する。この候補は閉鎖済みrunの再起動ではなく、新outputを使う別の一回である。

## 今回直す点と、選んだ方法

BOOK/SHOP回答後は教師の7/8更新がrawではADD1件へ減り、参照も不整合。REPOTの正解教師は「説明してもらい、最後まで聞いた」だが、rawは「説明し、聞かせた」へ反転した。KNITではsystem指示文がReceptionへ露出した。正解教材の不足より、既存の正解を出力へ保てていないことが今回の直接課題であり、今は新観測会を先に求めない。

同じquote15・旧45779起点・混在30順序・seed・LR5e-5・32LoRA・prompt/eval/cap/API6b043880/採用readerを保ち、損失だけを変更する。

`L = 0.5 × 全assistant/EOSの平均CE + 0.5 × 存在するS/F/U各群平均CEの等平均`

| 群 | 不変assistant JSONから重み付けする範囲 |
|---|---|
| S | claims、relations、unknowns、conflicts、question_proposal、evidence_quotes、surface bindings |
| F | observation、reception、update_noteの非null自然文値。key/参照表を含めない |
| U | 非空updates配列。空配列を独立して過大加重しない |

既存のfull＋重点CE方式を使う一つの係数仮説であり、最適性・品質向上は未確認。全体形式/EOSを学ぶ係数を半分残し、残り半分を群単位で配分する。single-forwardの同tail logitsから未平均CEを集計し、forward回数は増やさない。自然文だけを強めて意味/根拠/更新を失わせないためS/Uも対象にする。

原文は再serializeせずJSON値の文字区間と実tokenizer offsetを照合する。群を跨ぐtokenは拒否し、同群内は重複除外。promptは除外、EOS/末尾改行はfull成分のみ。全targetに正の係数を残し、合計1。新lossを以前の全文平均NLLの改善量として比較しない。

## Jupyterでの実CPU確認

[actual_cpu_check.json](actual_cpu_check.json)が実原本。固定依存/tokenizer15・全入力一致・EOS・切捨て0・max7935/8192を確認。区間の16 unit test、固定Transformers5.19.0のfloat/causal shift、FP32/BF16小logitsの旧一様loss/gradientと独立群平均の一致を確認した。差最大2.3841858e-7、単forward。承認pendingのexecuteはoutput作成・重み読込より前に拒否。

| 新6 | F token / 全target | 旧係数配分 | 新係数配分 |
|---|---:|---:|---:|
| BOOK初回 | 43 / 1038 | 4.14% | 27.07% |
| BOOK回答後 | 69 / 3178 | 2.17% | 17.75% |
| SHOP初回 | 46 / 1082 | 4.25% | 27.13% |
| SHOP回答後 | 110 / 3561 | 3.09% | 18.21% |
| REPOT | 27 / 961 | 2.81% | 26.40% |
| KNIT | 53 / 896 | 5.92% | 27.96% |

これは**損失係数の配分**で、実loss寄与・勾配量・学習効果の割合ではない。4.350443秒でexit0。実4B重み読込/forward/学習/生成/CMEE採否/SQLは0、小logitsの合成呼出しだけ6回。診断値のfloat変換warning1は合成metric由来。actual_cpu_check.jsonは35768bytes、SHA256 `33ce6313b7762ebce8ccafdb44751e1f6221a5ef5b942bc707459f010596b713`。Pod原本と回収bytesを照合する。

コード・原本の独立確認は[independent_review.json](independent_review.json)。root華恋が単一統合/実行/GitHub writer、補助agentによる原因/コード読解・候補module草案を原典と全文で確認した。正式Pro/Ultra/human受入れではない。

## この別の一回の実行範囲

- 同15教材各2回・固定混在30更新→別adapter保存→非学習reload→同after15生成。新before0/追加教師0。
- 同A5000 Pod bkj4qvnhwtdqc2、表示$0.28/h。最大2700秒・1生成180秒・最大15call、処理按分上限$0.21。準備/回収/保持/保存/通信/税等は別。全15call完了の保証・OS強制停止保証ではない。
- 重み/原本を回収し、無補修rawを既存CMEEへ通し、全15の意味・自然本文・更新を読む。採用snapshotだけ別process cold-fileで再読する。実service/SQL/動的prior/未知評価/RN本人端末/商品受入れへ数えない。
- OOM/非有限/期限/identity不一致は停止、追加更新/生成/自動retry/条件縮小なし。閉鎖済み旧一回と旧重み/教師/readerは不変。
- 完了は全結果・失敗・重み/原本保全・GitHub読戻しまで。新6不成立/旧9悪化なら通常不採用。全15成功しても既知FITであり、未知一般化・商品品質合格にはしない。

実行前は[gpu30_balanced.plan.json](gpu30_balanced.plan.json)のstatus/gpu_run_authorized/approval_basisだけを今回の明示承認へ束縛する。旧承認を流用しない。新runner/module/consumer/教材に差分があれば黙って同じ承認へ含めない。

Jupyter上の候補packは `/workspace/cocolon_native15_balanced30_pack_20261027`、新outputは `/workspace/cocolon_native15_balanced30_run_20261027`（未作成）。旧frozen payloadはnative15_preparation、旧helper/joint/初期重みは既存固定pathを参照する。Pod外から復元する場合は[source_bindings.json](source_bindings.json)の固定owner/hashへ戻り、Pod残存を仮定しない。

承認後の単一実行は `HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1 python -u run_native15_balanced30.py --pack /workspace/cocolon_native15_balanced30_pack_20261027 --execute --source-commit <承認束縛を反映したGitHub commit>`。`CUDA_VISIBLE_DEVICES`を空にするのはCPU検証だけで、学習起動時には使わない。

今回は製品API/DTO/DB/RN/Render/Supabase/本人DB/merge/deploy/GPU管理/lifecycle変更0。System Contextの既知停止を再試行せずfresh原本を直接確認。STRUCTURE_MAP_DELTA_NONE、primary=BLOCKER_NARROWED、商品0/正式0/3/54.50%据置、candidate_ready=false/automatic_progression=false。GPU稼働保持は継続課金を伴う。
