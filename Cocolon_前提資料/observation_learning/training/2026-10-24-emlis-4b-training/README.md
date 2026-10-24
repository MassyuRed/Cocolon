# Emlis 4B学習・保存再loadの限定pack

対象は`Qwen/Qwen3.5-4B`、固定revision `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a`、private profile `emlis_model_proposal.v1`です。旧9B pack・教師9件・旧eval・受領重みは変更しません。

このpackはCPU側の接続・学習コードを実装済みです。固定4Bの実tokenizerとcheckpoint indexはCPU検証済み、重み／CUDA／学習／16・24GB適合／商品品質は未検証です。`contract_examples.json`は説明用原本で、symbolic priorと未実装native projectionを含むため学習できません。

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

## GPU開始前の未確定項目

`execution_plan.json`はCPU実測に基づきcontext=8192／max_new=2048へ設定済みです。max_seconds、実GPU単価、総支出枠、minimum_free_gib、mount確認、Pod外受領先、Pod総課金範囲は未確定です。現状態でrunは拒否します。GPU起動・課金はこのCPU実装の承認範囲に含みません。

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

後日、GPU計画を具体化して確認した同じsourceで以下のmodeを使います。**現時点でGPU実行可能な手順ではありません。**

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

今回、stdlib/stubtokenizerの8検査に加え、実4B tokenizerでprefix／final assistant mask／EOS／no truncationと固定indexの16moduleを確認しました。初回はprompt2986＋completion1094＝4080、訂正後は5979＋1877＝7856 tokens。最大prompt5979＋返答上限2048＝8027で8192以内です。実GPUのmodule／勾配／保存後reload／VRAM／学習効果、本番・本人端末・商品受入れは未確認です。

## 今回保存したCPU結果と次の実行境界

`cpu_connection_results.json`は合成候補による実Engineの原source・packet・snapshot・本文・問い、`cpu_raw_consumer_results.json`は同target rawのconsumer結合結果要約、`cpu_tokenization_results.json`は重みを読み込まない実tokenizer／固定indexの結果です。モデルrawや学習結果には数えません。API固定sourceは`02c0b943c96b67cb32354e1d3352a00dcb768e64`です。保存rawの検証には、このAPI commitの別checkoutを`--api-root`へ明示します。

追加の観測会や旧7教師の無理な変換をせず、次はGPU実単価・上限時間／費用・実保存mount・Pod外受領先を具体化し、16GB優先の一回の診断実行を判断する段階です。今回の実装承認にGPU起動・有料推論・学習実行・24GB自動再借用・通常有効化は含めていません。
