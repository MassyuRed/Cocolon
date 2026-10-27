# 同15教材・重点位置を毎更新で再計算する30更新案

状態：**CPU_PREPARED_AWAITING_MASH_APPROVAL**。学習・新規生成は未実施。前回localized30の一回と承認枠は閉鎖したままです。新しい有料実行を自動開始しません。

## 今回変える一点と目的

前回は保存109cで誤った198位置を固定し、新6件のその位置だけを相対16倍で学習しました。30更新後に全15が完結しましたが、意味11/15・本文9/15、新6本文0/6で、不明ID・引用/参照・回答後の7/8更新・主客・自然な受け取りが同時成立しませんでした。新937233a0は通常不採用です。

今回は同じ109cから、**新6件の全target位置について、その学習forwardで正解を出しにくいほど重くする**方式を一回だけ検討します。旧9件は既存helperの全文CEをそのまま呼びます。固定198位置を引き継ぐ方式ではなく、重点は各forwardで移ります。教師、原情報、prompt、reader、更新の必要条件は変えません。

`adaptive_loss.py` の新6件の損失は、各targetの交差エントロピーを `c` として、

```text
w = 1 + 15 * (1 - exp(-stopgrad(c)))^2
loss = sum(w * c) / sum(w)
```

です。重みは1〜16、全targetが正の係数を持ちます。unknown・問い・JSON・全更新・本文・EOS・既存chat終端の改行を含め、targetを落としません。重みの微分を止める再配分であり、標準focal lossと呼びません。追加model forwardはありません。

これは**原因仮説に基づく候補**です。既存109c診断での配分計算では、旧203誤位置へ割く係数の合計は各caseとも固定198方式より下がります。例えばREPOTは3.2291％→2.9956％です。一方、本文/受け取り等の、top1一致でも確率が低い位置や以前除外した位置も対象にできます。改善・最適性を実証したものではなく、誤prefixからの回復を直接学習する方法でもありません。診断時は旧promptであり、新promptの実forward測定ではありません。

## Jupyterで確認したこと

既存Pod `bkj4qvnhwtdqc2` / RTX A5000へ直接接続し、source `0107e020c259e2947b8cadc34e217355a55e9721` の5sourceをGitHubの固定bytesと照合してCPUで実行しました。

- [actual_cpu_check.json](actual_cpu_check.json)：**4.995651372秒**。15教師・26,137target、新6は10,716target。既存prompt/全target IDs/全教師UTF-8/EOS/終端改行/8192 context・従来capを保持。保存済み109cの15token診断からfield別のuniform/固定198/新配分を計算しました。これは旧診断値のCPU再計算で、新しい4B測定ではありません。
- 小logitsによるcausal shift、prompt除外、最終targetの勾配、有限・正・detachedな重み、極端な確信度、旧9の既存helper直呼び、追加forwardなしを確認しました。実モデルではありません。
- [pending_execution_check.json](pending_execution_check.json)：未承認executeは**output作成とモデル処理より前に拒否**。新GPU outputは不存在です。
- [consumer_cpu_check.json](consumer_cpu_check.json)：**27.004795804秒**。実sourceから同15promptを再構成し、前回の保存済み椅子訂正・SHOP初回・REPOTを別processで3/3完全再読。前回の保存済みsnapshotを使ったCPU接続確認で、新モデル3件成功・新しいservice保存成功ではありません。

実4B読込/forward/学習/新規生成/SQLは全て0。pytestは使わず直接CPUで確認しました。rootが唯一のwriter/実行owner、補助はread-onlyレビューであり、正式Pro/Ultra/human商品受入れではありません。

最初のターミナル入力とCPU起動コマンドに形式不備がありましたが、前者はshell解析、後者はPython全体compileで拒否され、モデル/学習効果0。CPU sourceの変更や実モデル再試行はありません。訂正後のCPU実行は一回です。静的レビューではEOSを最終targetとする誤仮定とconsumer接続不足を実行前に修正し、元の改行と採用readerを保持しました。

## 承認をお願いする一回の範囲

| 項目 | 固定条件 |
|---|---|
| 開始重み | Qwen3.5-4B/revision851bf6e、保存109cの112F32/3,833,856parameter。前回と同じ初期重みで、新937233a0への継続ではない |
| 学習 | 同15教師・同prompt・同順序各2回、30更新。旧9は既存CE、新6だけ上記の動的配分。LR1e-5、seed20261024、clip1.0、AdamW weight_decay0、fresh optimizer |
| 保存と確認 | 新directoryへ保存→新model objectへ非学習reload→全112key/shape/値一致/no-grad→空assistantから同15件を各一回自由生成 |
| 採否・読解 | 固定APIa4b91b4の既存CMEEへrawを無補修で渡す。本文/問い/全更新を全件読む。採用snapshotのみ別process cold-file再読 |
| 上限 | **2700秒（45分）・処理按分$0.21**。外側2690秒＋kill10秒、内側2700秒、各生成180秒/最大15。準備・CPU・回収・保持・保存・通信・税等は別。総請求額ではない |
| 異常 | 部分原本・可能ならpartial adapterを保全して終了。再試行0、次の追加学習/生成へ自動進行0。全15完了を保証しない |

GPUの保持料金は既存稼働のまま継続しています。今回Stop/restart/delete・管理console/API操作は0。新規Pod・追加依存・本人DB・通常API・DTO・RN・Render・Supabase・価格・モデル選定・merge/deployを変更しません。

成功は、旧9を保ち、新6の意味・根拠・全7/8更新・自然な本文が自由生成で同時成立するかで確認します。loss低下や既知教師の選択率だけで合格にしません。合法IDの別名を意味誤りに数えません。同15は既知FITで、独立15題材や未知一般化ではありません。回答後priorは凍結教師由来で、実初回出力からの動的thread成功ではありません。通常service保存再読・本人端末・Piece/Analysis品質・商品受入れは別の未完了です。

今回の変更は学習準備・CPU検証のみの限定TECHNICAL_CREDIT。商品0/正式0/3/54.50％、PRODUCT_NOT_CLEAR、candidate_ready=false、automatic_progression=false。新観測会は現時点では不要です。STRUCTURE_MAP_DELTA_NONE（商品責務・型・wire・reader・通常接続不変）。

## 再開先と保全

次の有料処理は、[adaptive30.plan.json](adaptive30.plan.json)のpending3項目をMashの今回の明示判断へ結ぶまで禁止です。Rule18 §11.3のstanding delegationは新しい費用・期間の効果を含まないため、前回の個別承認を使い回しません。可逆source/CPU/GitHub反映は今回の続行指示の範囲です。

準備源は既存`/workspace/cocolon_localized30_pack_20261027`、元109cは既存expanded30 run、APIは同localized30 APIです。いずれもread-only参照で、旧実行authorityを再使用しません。新packは`/workspace/cocolon_adaptive30_pack_20261027`、新outputは`/workspace/cocolon_adaptive30_run_20261027`です。

承認後だけ、固定sourceを読戻し、pending3項目以外の条件不変を確認して次を一回起動します。

```bash
HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1 timeout --signal=TERM --kill-after=10s 2690s python -B /workspace/cocolon_adaptive30_pack_20261027/run_adaptive30.py --pack /workspace/cocolon_adaptive30_pack_20261027 --execute --source-commit <今回の承認を記録した固定commit>
```

CPU原本は355,720bytes/SHA256 `19a355b1697d4defb848b7e90e23363153ee501d8661a73c9d3fe62bbbfaf0a3`、17payload＋manifest/18memberをPod外でCRC/全bytes/hash照合。原本の各memberを値不変で保存し、[runtime_archive_manifest.json](runtime_archive_manifest.json)に対応を残しました。学習重みは今回不変で、新archiveに同梱しません。GPUはA5000/1MiB/24564MiBで稼働保持を確認しています。
