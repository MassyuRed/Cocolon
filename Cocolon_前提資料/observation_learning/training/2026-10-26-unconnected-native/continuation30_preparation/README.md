# 同15教材・成立済み重みからの低学習率30更新候補

状態：**承認済みの一回を完了・新候補不採用・閉鎖**。最終原本は [continuation30_result/README.md](../continuation30_result/README.md)。旧一回/承認/未消費枠/outputは再利用しません。

目的は、4Bが本人の主体・時点・否定・不明・回答による変更を保った自然な観測と受け取りを作り、既存CMEEが採用・保存再読できるようにすることです。今回の未完了は、既知quote15のうち新4題材6段階で本文が成立しない点です。三中核全体の用途・Windows/Mac未選定・4B育成方針は[観測学習入口](../../../README.md#observation-learning-intent-and-assumptions)を保持します。

## 既存原本から分かったことと今回の選択

- [interleaved30](../interleaved30_result/README.md)の保存1d218763は全15EOS/JSON、意味11/15・本文9/15。旧9のpacketは教師全文一致で、新6のうちSHOP初回/REPOTは意味採用まで成立しています。商品採用済みの重みではありません。
- [balanced30](../balanced30_result/README.md)は旧45779からfull .5＋S/F/U .5をかけ、意味7/15・本文6/15へ低下。群外の外側key/終了token係数は元全文平均の半分となり、椅子訂正3件で外側版・引用・JSON閉鎖が退行しました。新6の12更新は全てclip前norm>1（1.8591〜9.2156）。これらは確認事実で、係数半減やLRが唯一の原因だと確定したものではありません。
- 今回は**成立した構造を持つ1d218763から、全文assistant＋EOSの平均CE、LR1e-5で同じ30更新を継続**する案を選びます。既存の不変 `run_pilot.teacher_loss` を使用し、新しい損失helper・二段生成・JSON修復・読取条件の緩和は導入しません。
- 初期を旧45779へ戻してLRだけ下げる案は、まだ成立していないquote-chairと新題材を同時に弱く学ぶことになります。初期だけ1dへ変えbalanced配分を維持する案も検討しましたが、今回退行した外側を弱める配分を残さず、構造保持を優先して元の全文方式を使います。更新回数/token capだけを増やす案や、モデル処理を伴う別の事前診断は足しません。
- 初期重み・損失方式・LRを組合せて変えるため、**単一因子の原因実験ではありません**。改善は未検証で、低LRで新6を十分学べない可能性も残ります。成功を予告せず、この一回の実本文で判断します。

## 実行した一回の固定条件（以下は準備時の記録）

| 項目 | 候補 |
|---|---|
| 実行owner | root華恋が一回だけ起動。補助agentはread-only |
| 環境 | 既存Runpod Pod bkj4qvnhwtdqc2 / NVIDIA RTX A5000。Jupyter直接 |
| 元モデル | Qwen/Qwen3.5-4B @851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a |
| 初期追加重み | interleaved30 source e107b095 / adapter 1d218763964ce0e1f0e587c754731c5476d70cdd16548020abf330912c518c1b |
| 初期3file | planにREADME/config/safetensorsの全SHA256を固定。旧45779/不採用228edccfは使わず保持 |
| 教材・入力 | native15_preparationの凍結15行をbytes不変。旧9は2言語family、新6は4題材。after回答priorは凍結教師由来 |
| 更新 | 同じ固定30順序、各行2回/2pass。AdamW LR1e-5、weight_decay0、clip1、seed/32F32 LoRAは従来どおり |
| 損失 | promptを除く全文assistant＋EOS平均CE。既存single-forward/tail logits方式 |
| 保存・再読込 | 別adapter保存、学習model参照解放、保存adapterを非学習reloadして15生成 |
| 比較 | 初期1d218763の同quote15原本と最新228edccfの同15へ、意味・引用/参照・全更新・実本文を対応付けて比較。新before0 |
| 時間・生成 | 最大2700秒、1生成180秒、最大15call。旧9 max2560/新6 max3712、context8192を維持 |
| 処理按分上限 | 表示$0.28/h ×45分＝**$0.21**。準備・回収・保持・保存・通信・税等は別 |
| 停止 | timeout/OOM/例外/非有限/identity不一致で終了、再試行・追加更新・欠測再生成なし |
| 非EOS | rawのlength/EOSをそのまま不成立として記録。残りも元の総時間/call上限内だけで確認し、失敗rawを修復しない |
| 終了後 | 無補修rawを固定CMEEで採否、成立snapshotだけ別process cold-file再読、全本文読解、重み・原本回収とGitHub読戻し |
| authorization | PREPARED_AWAITING_MASH_APPROVAL / gpu_run_authorized=false。新一回の承認前はoutput作成・重み読込前に拒否 |

これはfresh optimizerからの新しい継続学習であり、optimizer/RNGを含む厳密な途中再開ではありません。保存済みbaseline比較は結果整理で実施し、consumer単独が前回との品質差を自動判定するとは扱いません。45分には読込・更新・保存reload・15生成を含み、全15が収まる保証やOS強制停止保証ではありません。回収は時間枠の後にも必要です。

意味/本文15/15と全本文の明白な不足解消をこの固定FITの目標とし、旧9の退行や新6の不成立が残ればそのまま記録します。cold一致には本文なしoutcomeも含まれ得るので、意味採用・本文成立・cold件数を分離します。一般化、動的thread、実service/SQL/Auth/RN、本人端末、正式商品受入れはこの一回では成立しません。通常有効化は行いません。

## 実JupyterでのCPU確認

[actual_cpu_check.json](actual_cpu_check.json) は **6.027493秒**、11002bytes / SHA256 `1361c362bdbcc85f0d072984ffc4ee0921053eb27f2d223cb787b98410adf78a`。Jupyterの原本を回収し、各candidate fileのbytes/hashと照合しました。

- 実tokenizer15件、assistant/EOS・prompt除外・切捨て0・max7935/8192、既存capと全入力/prior15一致。
- 初期1dの3file hash一致、追加重み32F32有限をCPUで読み取り、確認後も初期/凍結payload不変。
- effective planは初期1d/LR1e-5/全文損失/epochs2、新authorization false。pending executeは新outputの作成前に拒否。
- 元packの補助fileコピー不足で最初の配置確認が停止しました。全frozen payload名を元planからコピーして補い、コード/教材変更やモデル処理をせず解消した履歴を原本へ記録しています。
- base4B読込/forward/更新/生成/CMEE採否/SQL/新依存は全て0。LoRA32tensorのCPU読取を4B実行とは数えません。既存全文lossは不変のため、新しい合成loss試験や広範囲suiteは増やしていません。

read-only補助reviewで、effective初期/LR/lossの実使用、承認前拒否、新output、consumerの新初期/LR/loss/runner束縛、教材/cap/API保持を確認しました。補助agentの別案も上で理由を示して統合しています。rootが最終sourceを再確認し、正式Pro/Ultra/human商品受入れとは区別します。

## 実ファイルと再開先

| file | 役割 |
|---|---|
| run_native15_continuation30.py | 新初期/hash/LRを実使用し、既存全文CE/保存reload/15call/期限を保持 |
| gpu30_continuation.plan.json | 新一回の固定範囲・費用・初期hash・承認pending |
| consume_continuation30.py | 新初期/LR/loss/runnerと実30logを束縛し、既存無補修CMEE/cold-fileを使用 |
| actual_cpu_check.json | 実CPU入力/重み/hash/authorization確認と配置不足履歴 |

packは `/workspace/cocolon_native15_continuation30_pack_20261027`、新outputは `/workspace/cocolon_native15_continuation30_run_20261027`。実行時は承認された本revisionへ新planのstatus/authorization/approval_basisだけを束縛し、その反映commitをsource-commitに指定します。run例を承認前に実行しません。再起動・同output再利用・別Podへの自動移行は禁止です。

今回の作業はMashの続行指示とRule18 §11.3内の可逆的候補実装/CPU確認まで。**新GPUのmodel load/forward/学習/生成は別の一回承認が必要**で、前回の承認残枠を持ち越しません。新しい観測会はこの基本不成立を直す前提ではありません。

製品責務/型/wire/採用reader/API/DTO/DB/RN/Render/Supabase/本人DB/通常app/価格/merge/deploy/GPU管理・lifecycle変更0。STRUCTURE_MAP_DELTA_NONE。primary=TECHNICAL_CREDITは新候補sourceとCPU確認に限定し、商品0/正式0/3/54.50％/candidate_ready=false/automatic_progression=falseを維持します。


## 2026-10-27 一回承認の記録

Mashは固定案b6ab7edcc9498d0ba2b5973f0e5efcd33a651516の30更新→保存/非学習reload→15件確認、最大2700秒/$0.21処理按分（準備/回収/保持等別）へ「進めていいよ。」と明示承認しました。今回のplanはstatus/authorization/approval_basisだけを束縛し、runner/consumer/教材/初期/LR/loss/順序/cap/readerは変更しません。旧一回の承認を継承せず、新outputでrootが一回だけ実行します。


## 2026-10-27 一回の最終状態

**現在の直接作業（10/27：continuation30一回完了、意味11/本文9・新6本文0で不採用）：** 承認source e1ed9750/PID67437で初期1d218763・全文CE/LR1e-5・同15/同30順序→別保存/非学習reload→15生成を1578.951346秒/$0.122807処理按分で完了。EOS/JSON12/15、意味11/本文9、旧9は意味/本文9/9で教師packet全文一致、新6は意味2/6・本文0/6。直前228の7/6から旧9を復旧したが、初期1dの11/9から進まず、新6EOS/JSONは6→3へ退行。BOOK/SHOP回答とKNITが3712token反復打切り、BOOK初回unknown束縛/安心補完、SHOP本文の問い混入、REPOT二重主客反転が残り新dd1188e8は通常不採用。cold11/11には本文なしSHOP/REPOT2を含み、本文11完成ではない。全84payload+manifest/32F32有限/早期最終重み一致をPod外照合しversion1保全済み。追加更新/再生成/再起動/retryなし。同じ回数・LR調整の連続試行を自動追加せず、長い更新packetと自然本文の学習設計を既存原本から見直す。新観測会は今は不要。原本continuation30_result/README・weekly§66、商品0/正式0/3/54.50％、GPU稼働保持。

最終原本は[continuation30_result/README.md](../continuation30_result/README.md)。本planのAUTHORIZED_ONCE_BOUNDはこの閉鎖runを開始した当時の記録で、次の実行許可ではありません。新outputの既存存在と閉鎖状態を保ち、--executeを再起動しません。
