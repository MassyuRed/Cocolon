# ordered30 一回実行原本

状態：**RUNNING／完了・品質未判定**。再起動禁止、同じPIDの進行へ戻ります。

**現在の直接作業（10/27：承認済みordered30を一回実行中）：** Mashが固定案e94971f9へ「進めていいよ。」と承認し、承認source5b115939/PID96980をJupyter直接で一回起動。初期1d218763・同15/同30順序・全文assistant/EOS CE・LR1e-5を保持し、生成順だけを引用/意味/更新→本文へ変更。実読取50.264秒時点は学習4/30・生成0/15で、完了/品質は未判定。最大2700秒/各生成180秒/15call/$0.21処理按分（準備/回収/保持等別）内で継続し、追加起動/更新/再生成/自動retryはしない。保存後は同OSプロセス内の別model objectで非学習reloadし、後続cold-fileだけ別process。原本ordered30_result/README・weekly§68、商品0/正式0/3/54.50％、GPU稼働保持。

- 固定承認案：e94971f9b7552989fdd1fe3710a683b9e68662da
- 承認source：5b115939e2f05e47b0c3d8fef8ce54e9cf11068c
- Pod：bkj4qvnhwtdqc2／NVIDIA RTX A5000。Jupyter直接、管理console/API操作0。
- 起動PID：96980、started_unix1793071169.6400921。
- run.json：/workspace/cocolon_native15_ordered30_run_20261027/run.json
- log：/workspace/cocolon_ordered30_gpu_20261027.log
- launch：/workspace/cocolon_ordered30_launch_20261027.json
- archive：同run folderのcheckpoint.tar.gz（保存後に生成、原子置換）。初期保存/最終を別identityで回収。

実read50.264秒時点はSTARTED_ONCE/training/更新4/生成0。30更新、保存adapter、reload、15生成、CMEE採否、cold-file、全本文読解、最終回収は未完了。early archiveも未回収。追加call/再試行/自動進行なし。総2700秒/1call180秒/最大15生成/$0.21処理按分（準備/回収/保持等別）。

重みは同OS process内で学習model参照を解放し、別のmodel objectに非学習reloadする。別processは後続のcold-file再読だけである。会話の「別processで重みreload」は訂正済み。

API6b043880/reader/元教師/評価/prior/初期1d不変。原案の生成順だけの変更を保ち、新しい品質/未知一般化/動的thread/実service/SQL/Auth/RN/商品受入れへ拡張しない。商品0/正式0/3/54.50％/candidate_ready=false/automatic_progression=false、STRUCTURE_MAP_DELTA_NONE。rootのみ実行/writer、補助はread-only。
