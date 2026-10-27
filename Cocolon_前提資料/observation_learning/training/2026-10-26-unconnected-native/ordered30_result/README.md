# ordered30 一回実行原本

状態：**30更新/保存/reload完了・生成確認中／最終品質未判定**。再起動禁止、同じPIDの進行へ戻ります。

**現在の直接作業（10/27：ordered30の30更新/保存/reload完了、生成確認中・早期重み保全済み）：** 承認source5b115939/PID96980をJupyter直接で一回実行中。初期1d・同30順序/全文CE/LR1e-5・生成順だけの変更で30更新と別adapter保存/同process内の非学習reloadまで完了。399.800996秒/生成0の早期archive3,481,783bytes/SHA6b3ff9beは全16payload＋manifest/32F32有限をPod外照合しversion0へ保全済み。新483d74b7の最終15件採否/本文/比較は未確定。最大2700秒/各180秒/15call/$0.21処理按分（準備/回収/保持等別）、追加起動/更新/再生成/自動retryなし。原本ordered30_result/README・weekly§68、商品0/正式0/3/54.50％、GPU稼働保持。

- 固定承認案：e94971f9b7552989fdd1fe3710a683b9e68662da
- 承認source：5b115939e2f05e47b0c3d8fef8ce54e9cf11068c
- Pod：bkj4qvnhwtdqc2／NVIDIA RTX A5000。Jupyter直接、管理console/API操作0。
- 起動PID：96980、started_unix1793071169.6400921。
- run.json：/workspace/cocolon_native15_ordered30_run_20261027/run.json
- log：/workspace/cocolon_ordered30_gpu_20261027.log
- launch：/workspace/cocolon_ordered30_launch_20261027.json
- archive：同run folderのcheckpoint.tar.gz（保存後に生成、原子置換）。初期保存/最終を別identityで回収。

以下は起動直後50.264秒時点の履歴（早期保存前）です：STARTED_ONCE/training/更新4/生成0。30更新、保存adapter、reload、15生成、CMEE採否、cold-file、全本文読解、最終回収は未完了。early archiveも未回収。追加call/再試行/自動進行なし。総2700秒/1call180秒/最大15生成/$0.21処理按分（準備/回収/保持等別）。

重みは同OS process内で学習model参照を解放し、別のmodel objectに非学習reloadする。別processは後続のcold-file再読だけである。会話の「別processで重みreload」は訂正済み。

API6b043880/reader/元教師/評価/prior/初期1d不変。原案の生成順だけの変更を保ち、新しい品質/未知一般化/動的thread/実service/SQL/Auth/RN/商品受入れへ拡張しない。商品0/正式0/3/54.50％/candidate_ready=false/automatic_progression=false、STRUCTURE_MAP_DELTA_NONE。rootのみ実行/writer、補助はread-only。

## 早期重み・原本の回収

[early_run.json](early_run.json)は399.800995906秒/30更新/生成0/saved_before_reloadの当時原本、最終へ書き換えません。[early_recovery.json](early_recovery.json)は全16payload＋manifest/32F32有限のPod外照合結果。archive3481783bytes/SHA256 6b3ff9bebf268bdde437b49aa8e48bd0d81bbd713fd3b96957ee36d738e83f3dを[重み/原本version0](https://chatgpt.com/library?file_id=libfile_00da515f0f7c8191a0886e28af4f923e&account_id=personal)へ保全済み。新483d74b7は保存のみで商品採用ではありません。base4B/optimizer/RNG非同梱、strict resumeではありません。最終確認・回収まで同じPID/承認範囲で継続します。
