# Emlis 4B学習・保存再loadの限定pack

> **最新（2026-10-25）：Mashが4B採用とリリースまでのRunpod追加学習を明示し、今日の最安空きGPUを確保して学習するよう指示しました。** RTX A4500 20GB／Secure・Pod y0eb0w0qn6nks0を起動、合計表示$0.26/h。CUDA実計算/BF16正常・free19.36GiB・container free49.98GiBを確認。固定e703befa/API1dabc4fで本修正版2教師run 20261025-011309-9f0c8622を開始し、4B読込済み、完了/CMEE採否/回収は未確定です。process上限5400秒/計画$1と、今日のGPU保持課金は別です。自動Stop/削除は行いません。旧3070は今回すでに停止表示で、華恋の停止操作0。旧一回承認の再利用ではなく今回の新指示に基づきます。[weekly §24](../../../weekly_reviews/Cocolon_Weekly_Review_20261024.md#20261025-a4500-training-and-portable-weights)。下段は当時の案・実結果の履歴です。移行には固定base＋LoRA＋tokenizer/configを保持し、M4候補では統合/変換/量子化後に品質と速度を確認します。本診断runnerはoptimizer等を保存しないため、厳密な途中再開checkpointとは区別します。

対象は`Qwen/Qwen3.5-4B`、固定revision `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a`、private profile `emlis_model_proposal.v1`です。旧9B pack・教師9件・旧eval・受領重みは変更しません。

前版packは承認された一回の実GPU診断で、4B重み読込・LoRA2update・保存adapter非学習reload・24GBでの前後生成と回収を確認しました。本CPU修復版の実GPU適合・意味採用・品質改善は未確認で、16GBは前版も未試験です。`contract_examples.json`は当時の非学習説明例で、正式2教師/実rawと区別します。

<a id="cpu-instruction-repair"></a>
## 2026-10-24 実拒否原因の最小修復（CPU完了・実モデル未検証）

前回のINVALID_EVIDENCE、conflicts欠落、bindingsのobject化、claims内surface、説明文字列の出力を受け、既存OUTPUT_SPECだけを修復しました。根拠は各source_idの`text_fields[field_path]`内の先頭0/Unicode scalar/半開区間で、`field[start:end]==quote`です。UTF-8 byte・prompt全体位置を使いません。全必須field、candidate直下のsurface、bindings配列とsection、conflicts配列、説明文字列を実source/ID/整数参照へ置き換えることを明記しました。採用側・意味schema・対応構文・本文検査・source資格は変更していません。

正式2教師のsystem、本人source、native_case/prior、assistantの全文、target_check、source_refsは不変です。変更したのは実`build_model_messages()`に一致するuserのoutput_specだけです。EFREE6も説明だけを同期し、standalone・新profile範囲外の学習外proxyを保持しました。旧9教師・旧eval・既受領重み・実試行の5結果fileは変更していません。

| 検証 | 今回の結果 |
|---|---|
| API対象2file | 54 PASS、FAIL0、既存Pydantic warning1。うち新6件は誤座標2種/必須欠落/配列誤り/誤nest/説明コピーの拒否で、raw補修0 |
| 学習pack既存検査 | 11成功。stub tokenizer・数値CE/勾配等であり、実4B推論ではない |
| 実consumerへの合成target接続 | 2/2でmessages一致・意味/本文あり。旧messagesを混ぜた2/2はINPUT_MESSAGES_MISMATCH。実モデル採用数へ加算しない |
| 実tokenizer/index（cacheのみ・重みなし） | 初回3085+1094=4179、訂正後6078+1877=7955。前版よりprompt各+99、教師/EOS不変、q/v16module不変 |
| 生成上限 | 最大6078+2048=8126<=8192、残66token。source/prior/targetの切捨て0、context拡大0 |
| 実4B品質 | 新生成/学習0。前版FIT前後0/2の結果を変更せず、自然な受容・意味訂正・動的一往復・通常保存再読は未成立 |

実行環境はCodex Work/GPT-6、必要な既存CPU runtimeはPython3.12.14、pytest8.4.1/subtests0.14.2、固定4依存を再確認しました。PR37のexact46 portable runtime/最新System Context cache完成を主張しません。最新索引未成立の既存判断に従い、fresh原本を直接読みました。独立agentは読取専用、最終判断・編集・テスト・GitHub反映は華恋rootだけです。

本単位はOBSERVED_BLOCKER_MINIMAL_FIX / Rule18 LEVEL_2の既存delegation。目的は4B→既存CMEEへの実接続を妨げる既観測の説明不足を直すこと、完了条件は既存採用条件不変・同messages/固定pin/hash・無切捨てのCPU照合とremote全文読戻しです。採用条件/target変更や8192超過、追加依存/費用/実推論が必要なら拡大しません。独立の商品整合reviewはPRODUCT_ROUTE_ALIGNED、技術判断はTECHNICALLY_ADMISSIBLEです。

変更APIは既存`model_candidate_source.py`と`test_cmee_model_candidate_source.py`だけ。本packはsft/train_messages/eval_inputs・manifest・tokenization/raw_consumer結果・plan・本READMEの8file、Cocolonの他差分は全機能00/最新weeklyだけです。既存owner内の指示修復で、STRUCTURE_MAP_DELTA_NONE。限定TECHNICAL_CREDIT、商品0・正式0/3・54.50％据置、candidate_ready=false/automatic_progression=false。全体設計・全file地図・current mapsは確認し、新owner/構造/型変更がないため再追記しません。

<a id="revised-gpu-diagnostic-proposal"></a>
### 修正版の実4B診断1回（10/24案の履歴、最新の開発基準・Pod状態は冒頭とweekly §23）

CPUで正しいtargetが通ることだけではモデルが新指示に従うか分からないため、次はこの修復版を含む公開済み固定Cocolon commit＋API`1dabc4f…`で、既存`runpod.sh fetch/validate/prepare/run/verify/export`を使う新規一回案です。旧run/旧adapterへの追加epoch・旧directoryの再試行ではありません。新しい学習前生成で指示変更後のbaseを観測し、同じ2教師×1epochの新LoRA後と比較します。採用0や同じ根拠/意味不正が残れば、その原rawを回収して終了し、自動増量しません。

| 項目 | 次回一回だけの範囲 |
|---|---|
| GPU | 16GB優先。空き/適合条件がなければ実行前に許容24GBを選択。単価$0.30/h以下、新規試験Pod1台・run試行1回。開始後の再借用/再実行0 |
| 内容 | baseでNLL2/生成8→2教師×1epoch/2update→adapter3file先退避→同baseへ非学習reload→NLL2/生成8→FIT2 rawをCMEEへ。EFREE6は範囲外proxyのまま。追加diagnose/動的生成0 |
| 上限 | Pod起動〜停止で最大2時間。準備30分を超えたら学習開始せず終了。回収/照合/停止に15分を確保し、actual planのprocess上限は5400秒とPod残時間−900秒の小さい方。計画予算$1、税/実quoteを含むhard capではない |
| 構成・回収 | 前回の公式image、container50GB/volume40GBを候補とし、Torch/CUDAと独立mount/空きを実確認。24GBならfree22GiBを目安にactual planへ記録。最終raw/重みarchiveをPod外受領・全member/adapter照合後、この試験Podだけを停止/削除 |
| 支出の前提 | 既存料金仮定でGPU上限2h=$0.60、90GB稼働2h約$0.025、停止後40GB最大24h約$0.2667、合計約$0.8917。実見積りが$1内に収まらなければ開始しない。追加チャージ0 |
| 禁止 | 旧承認の再利用、追加epoch/周回探索、raw手修正、採用条件緩和、モデル再選定、通常有効化/DB/Render/merge/deploy |

Mashは固定ab987f2の本案に「進めていいよ」と明示承認しました。実行sourceはab987f2、APIは1dabc4fへ固定します。現在は空き未確保で、actual mount/期限も未成立のため配布planの有料flags=false/単価nullを維持します。このfalseをMash承認不足と混同しません。10/24時点では容量確認から再開する予定でしたが、10/25の4B確定撤回で一度停止しました。その後のMash明示指示でA5000／Community On-demandの対象だけ再開し、現在は同GPUの容量待ちです。当時の案では、空き待ちの自動起動予約や上限超過GPUは使いません。前回archive/adapter/実結果はその旧message・旧API版に固定して保持します。この案は通常接続・実端末・商品受入れの完成保証ではありません。

## 教材の受口

`dataset_manifest.json`に実fileとSHA256が必要です。chair初回／訂正後の2行を、実native関数・実source・発行済み実問い・実priorに一致させて用意しました。説明例・旧9教師の単純包み替えは学習しません。未対応の旧7行は理由をmanifestに保持します。Nを9に固定せず、学習行数から1epochの実step数を算出します。

各examples行は`id/family/stage/messages/source_refs/status`を持ち、statusは`READY_FOR_BOUNDED_TRAINING_DIAGNOSTIC`です。この状態は華恋の限定試験用教材としての準備状態であり、Mashによる文章品質goldや商品受入れを意味しません。`fit_generation=true`を付けた行だけ教師適合生成にも使用します。train_messagesのmessagesはexamplesと同一である必要があります。

evalは`case_id/family/messages/training_use=false`、reviewは同じcase_id順です。旧EFREE6を学習外・既読の開発確認として新出力指示へ投影し、assistant targetは作りません。chairのfit2件を学習外とは数えません。trainとevalのfamily重複を拒否します。

train/eval/保存後診断のsystemには`run_pilot.JSON_INSTRUCTION`を同じbytesで含めます。assistantの最上位は`{candidate,evidence}`、候補版は`cocolon.cmee.semantic_and_surface_proposal.v1`です。runnerの形・出典・hash検査は意味採用検査ではありません。根拠の正当性・native case/時点/更新・本文の独立検査はCMEEの実ownerで別途確認します。

## CPUでできる操作

pack内で以下を実行できます。validateはstdlibのみ、prepareは固定依存とネットワークまたは既存metadata/tokenizer cacheが必要です。prepareは重み・CUDAを読み込みません。

```bash
python run_pilot.py validate --directory .
python run_pilot.py prepare --directory .
python -m unittest -v test_training_pack.py
bash -n runpod.sh
```

正式datasetが未完成ならvalidate/prepareは明瞭に拒否します。prepareは固定configとindexのtext q/v16module、tokenizerのflat list／prompt prefix／final assistant限定loss／EOS、全train prompt/completion長、全generation input長を記録します。truncationはしません。context/max_newがnullでも長さの測定はできます。値を埋めた後は全例の長さを再検証します。

固定依存はTransformers5.19.0、PEFT0.21.2、Accelerate1.15.0、Safetensors0.8.0です。bootstrapは依存を自動installせず、既存Torch/CUDAを置換しません。必要な環境構築は既存Torch/CUDAの版を記録・維持して別途用意します。

## 配布用templateと、この一回の終了状態

`execution_plan.json`はcontext8192/max_new2048の非実行templateです。今回の承認はPod1台・診断1回に適用し、Pod上の実単価/確認済みmount/期限を記録したactual planは回収archiveへ保存しました。一回は終了しており、templateのfalseを変更して新しい実行を始める許可はありません。作成時の一回案と、実行/回収/削除の事実は実結果とweekly §15へ戻ります。

16GBを第一候補、24GBまで許容します。runnerは実GPU名／total/free／BF16／Torch/CUDAを記録し、16/24GB classと計画した空きを確認します。旧40/32GiB gateは使いません。この確認も実際の学習peakを証明しません。index上のcheckpoint bytesにはactivation、LoRA optimizer、KV cache、CUDA runtime等が含まれず、GPU適合には実測が必要です。

`max_seconds × gpu_hourly_usd ÷ 3600 > max_total_usd`となる矛盾した計画は拒否します。これは計画値同士の整合確認で、実請求監視ではありません。Pythonのsignal alarmはCPU prepare後のrun内だけ、shellのouter timeoutはprepareを含む呼出しprocessだけを対象にします。どちらもPod総時間・請求上限ではなく、Podを自動Stopしません。`max_total_usd`もPod総課金を自動停止する設定ではありません。install/download/待機/退避を含む総時間・支出枠と停止担当を具体化してから実行します。OOM・非有限loss／勾配・未知module・長さ超過では停止し、記録を退避します。24GBの自動再借用・量子化・教材削減・追加epochは行いません。

## 1回の実行内容

BF16/SDPA、r8/alpha16/dropout0/bias none、AdamW lr1e-4/weight_decay0、batch1/accumulation1、clip1.0、gradient checkpointing、seed20261024、非thinking・greedyです。実indexに加え実modelのtext q/v16moduleを検査し、baseを凍結してLoRAだけ学習します。

1. 同じ固定4Bで全教師NLLとfit＋学習外evalを生成してrawを保存します。
2. 正式N行を1epoch、Nupdateだけ学習します。loss・clip前gradient norm・trainable一覧を記録します。
3. adapter3fileを保存し、**追加生成前に重み入りarchiveを作成**します。
4. 学習modelを解放し、同4B baseへ保存adapterを`is_trainable=False`で再loadします。tensor shape/dtype/finite/normと学習parameter0を確認します。
5. 保存reload版で同じ教師NLLと生成をafterとして測定します。adapter3hash不変を確認し、最終結果を再退避します。

現在の正式な限定診断用2行とfit2＋EFREE6で、N=2・2update、before/after各8生成・NLL各2です。旧議事録のN=9・9updateは仮定で、このpackへ固定しません。1epochは新targetの更新・適合を切り分ける診断量で、品質十分性の根拠ではありません。NLL低下を観測品質改善率へ換算しません。

rawにはmodel/revision・finish・tokens・経過時間を保存します。JSONを補修せず、意味採用済みとは扱いません。`length`はJSONが見かけ上完成していても正常候補へ昇格しません。

### 保存rawからCMEEへの接続

`verify_cmee.py`はbefore/after.jsonlのrawを置換せず、FIT-chair2件だけをP1→FRESH意味採用→同checkpointからのRESUME生成へ通すoffline consumerです。各rowの`native_case`から元source・control・回答・既存priorを復元し、実`build_model_messages()`が学習時messagesと全文一致することを確認します。モデルID/revision/実adapter hashが異なるrawは原文を記録したまま採用しません。EFREE6は今回の意味profile範囲外として未評価を記録し、成功へ加算しません。

CLIは明示`--api-root`とmanifestの固定`cmee_api_commit`／実Git HEAD一致・対象sourceの未変更を要求します。API sourceを取得・編集する機能はありません。

```bash
python verify_cmee.py --directory . --run-directory results/実runID --api-root 固定APIcheckout
```

結果は`before_cmee.json`／`after_cmee.json`へraw・receipt・採否・意味・本文・問いを保存し、次のexportへ含まれます。**これは保存した固定入力・既存priorに対する単発fit診断です。** 実モデル初回出力の実問いから訂正入力を動的に作り直す一往復ではありません。CPU serviceの実問い→訂正→保存再読検査、固定raw診断、実GPUを使う動的一往復、本人端末の商品受入れを区別します。モデル呼出し／本人DB取得／自動retry／意味の手修正は行いません。

## 固定sourceの取得と実行

`runpod.sh fetch`は40文字の固定`COCOLON_SOURCE_COMMIT`からallowlistのfileとmanifestのdatasetを新directoryに取得し、hash検証します。動くbranch名から取得せず、既存directoryへ上書きしません。未完成datasetではfetch完了にもなりません。

以下はmodeの使用方法です。終了した一回を再実行する指示ではなく、template単体では有料runを拒否します。新しい有料実行は別の具体的判断が必要です。

```bash
bash runpod.sh fetch
bash runpod.sh validate
bash runpod.sh prepare
bash runpod.sh run
```

`COCOLON_4B_DIRECTORY`で実作業先、`COCOLON_4B_PYTHON`で固定依存を持つPythonを指定します。runにはexclusiveなattempt markerがあり、失敗後の自動再実行を拒否します。SOURCE_COMMIT・dataset・runner・planのhashとrun IDを結果へ保存します。

通常runが保存reload後のafterまで含むため、別の`diagnose_learning.py`は通常不要です。追加診断が具体的に必要で許可された場合だけ`additional_diagnostic_authorized=true`で同runの非学習reload／教師NLLを確認できます。optimizer・追加学習・追加生成は行いません。

## 退避と停止

exportは対象run、コード、dataset、manifest/plan、adapter3fileだけをallowlistでarchive化し、内部全文readbackと全体SHA256を作ります。base/cache/venv/credentialは含めません。symlink・作業先外・64MiB超/fileは拒否します。

**archive作成だけではPod外退避完了ではありません。** Pod外でarchiveとchecksumを受領し、内部manifestとadapter本体を確認後にPodを手動Stopします。失敗時は`--allow-missing-adapter`でlogのみ退避できますが、重み退避成功にはなりません。Pod Stop状態・GPU総時間・実単価・storage費は別途記録します。

前版のtail-loss修復時は8件＋新3件の11検査が成功し、tokenizer実測は初回2986+1094=4080、訂正後5979+1877=7856、生成枠8027/8192でした。その旧message版で実GPUの24GB完走を確認しましたが、意味採用0/2・商品品質未合格です。本CPU修復版の実測は上段の4179/7955・生成枠8126/8192で、旧実GPU結果を本版へ付け替えません。

## 今回保存したCPU結果と次の実行境界

`cpu_connection_results.json`は前版API02c0b943で得た合成targetの原source・packet・snapshot・本文・問いを保持する未変更原本です。意味/targetが不変のため再生成しません。現在の`cpu_raw_consumer_results.json`は同targetを新messages/新APIへ接続した今回の合成結果、`cpu_tokenization_results.json`は今回の実tokenizer/index測定です。新manifestのAPI pinは`1dabc4f196ae283264bf5e364e117a5d571af6a7`。新packの検証には同commitのclean checkoutを明示します。旧実rawは回収archive内の旧pack＋API02c0b943へ固定し、新packとのmessages一致を装いません。

前回の有料一回は学習/回収/削除まで終了し、その拒否原因へのCPU最小修復は本版で完了しました。修正版一回は新しく承認済みですが、空き未確保で実行前に停止しています。Pod/学習/新課金0、承認は未消費です。追加の観測会、旧7教師の無理な変換、通常有効化へ自動進行しません。


<a id="single-gpu-diagnostic-proposal"></a>
## 一回案 — 16GB優先、計画予算$1、Pod最大2時間（作成時点の記録、現在の承認/実行状態はweekly §15）

目的は、現在の2教師×1epochで実4Bの勾配更新・保存adapterの非学習reload・前後raw・固定rawのCMEE採否を得ることです。モデル選定、周回探索、通常配置には広げません。

| 項目 | 一回案と、開始前に確認する実物 |
|---|---|
| GPU | RTX A4000 16GBを優先。実slotのGPU単価が$0.30/h以下の場合だけ。16GB適合は未実証。24GBは別判断とし、失敗後の自動再借用はしない |
| 時間 | Podの起動から停止まで7200秒以内を計画。run processはprepare込み5400秒、残り1800秒は環境準備・取得・退避・停止。時間内完走を保証せず、準備が30分を超えたら学習を始めない |
| 支出 | 計画予算$1。GPU最大$0.60、60GBの稼働disk2時間約$0.0167、停止後40GBを最大24時間保持した場合約$0.2667。合計約$0.8833、差額約$0.1167を税・見積差の余裕とする。720h/月換算の見積りで、実quoteや請求hard capではない |
| 保存 | container20GB＋volume40GBを候補。学習directory・HF cache・adapter・archiveはvolume上。実mountを`findmnt -T /workspace`と`df -h /workspace`で確認するまでstorage_mount_verifiedはfalse |
| 環境 | 既存のRunpod PyTorch/CUDA環境を用い、実Torch/CUDA/BF16と空き14GiB以上を記録。固定Transformers/PEFT等が不一致ならrunしない。今回、環境install・image選択・秘密値取得は未実施 |
| 診断量 | 2update、before/after各8生成、NLL各2。保存adapterを先にarchive化し、非学習reload後のafterまで実行。rawの補修やteacherへの置換はしない |
| CMEE | 固定API02c0b943を明示し、before/afterのFIT2 rawをverify_cmeeへ渡す。EFREE6は意味profile範囲外のまま。固定priorでのfit診断と、実初回からの動的一往復を分ける |
| Pod外受領 | archive＋sha256をMashのPCへ取得し、添付後に華恋が内部manifest・adapter3fileの実体を確認。archive作成だけをPod外受領済みにしない |
| 停止 | 成功・OOM・非有限値・長さ超過・期限到達で記録を退避し、PodをStop。process timeoutにPod停止機能はない。停止担当と実際の操作経路を開始前に確定 |
| 保管終了 | Stop後もvolumeの料金が続く。今回求める範囲に、Pod外受領確認後のこの新規試験PodだけのTerminateを含める。既存Pod・未回収重みは削除しない。この範囲が承認されない場合は開始せず、24時間超の保管へ自動移行しない |

2026-10-24の公式確認では[A4000 16GBはfrom $0.25/h](https://www.runpod.io/gpu-models/rtx-a4000)。実単価と空きはdeploy画面で確認します。[Pods課金](https://docs.runpod.io/pods/pricing)では稼働container/volume各$0.10/GB月、停止volume$0.20/GB月。[保存仕様](https://docs.runpod.io/pods/storage/types)ではvolumeは通常/workspace、Stop後は保持・Terminate時に消えます。Serverlessの価格をPodsへ使っていません。

Runpod連携の検索結果は今回0件で、GPU管理画面・残高・稼働Podへはアクセスしていません。実行に進む場合は**この一回分の有料診断・Runpod画面操作・退避後の新規試験Podの停止/削除**を確認し、画面上のactualを華恋が引き取って条件を埋めます。GPU単価・mount・権限を推測でtrueへ変更しません。既存の[Rule18 §11.3](../../../work_attitude_rules_for_karen/18_chat_work_environment_selection_rule_2026_08_06.txt)の「明確な費用・期間増加」と、本READMEのGPU実行前条件に対応する確認です。

### 今回直した学習メモリの不要計算

固定Transformers5.19.0のQwen forwardは`logits_to_keep`でhidden stateを切り出してからlm_headを計算し、causal lossはlabelsを右へpadして1位置shiftします。従来はmask済みprompt全位置にもlogitsを作り、loss内でFP32へ変換していました。これは実装上の不要計算で、実OOMを観測したという意味ではありません。

先頭教師位置P・全長Lに対し、全input_ids/attention_maskを保持したまま`logits_to_keep=L-P+1`と`labels[:,P-1:]`を共通teacher_lossへ渡します。最初の教師tokenの予測位置と末尾のignored logitを残し、教師集合・mean loss・勾配・EOS・順序・学習量は変えません。NLL／学習／保存後診断へ同じ修復が適用されます。

| 例 | 全入力 | 教師対象 | lm_headの位置：修復前→後 |
|---|---:|---:|---:|
| 初回 | 4080 | 1094 | 4080→1095 |
| 訂正後 | 7856 | 1877 | 7856→1878 |

11検査のうち新3件は、独立した数値CE/解析勾配の旧full比較、全contextを保つ実呼出し引数、target欠落・不連続の拒否です。固定QwenとPEFTの実装をread-only reviewしました。Torch/CUDAはこのCPU環境にないため、実モデルの数値一致・VRAM peak・16GB合格を主張しません。dataset/teacher/eval/API/CMEE契約は不変。重複usageキーの前者を削除し、以前から実際に保存されていたprompt_tokens/completion_tokensを維持しました。

実モデルの動的一往復は未実装・未実行です。既存build_model_messagesは実初回のsnapshot/questionから訂正入力を作れますが、現在のverify_cmeeは固定priorを復元します。今回の有料一回案は従来の16生成を維持し、動的追加生成・通常service/DBの保存成功へ拡張しません。保存rawの結果を得た後、その不足を具体的に判定します。
