# Emlis 4B学習・保存再loadの限定pack

> **最新：承認一回の実4B診断は完了し、重み回収・試験Pod停止/削除まで終了。** [実結果と次の最小候補](../../trials/2026-10-24-qwen4b-cmee-diagnostic/README.md)。2update/前後16生成は完走しましたが、実rawのCMEE採用は前後0/2で商品品質未合格です。以下の一回案/CPU準備は当時の記録。配布用execution_plan.jsonは非実行templateを維持し、終了した一回の承認を新GPU/再実行へ継承しません。

対象は`Qwen/Qwen3.5-4B`、固定revision `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a`、private profile `emlis_model_proposal.v1`です。旧9B pack・教師9件・旧eval・受領重みは変更しません。

このpackはCPU実装後、承認された一回の実GPU診断を完了しました。4B重みの読込・LoRA2update・保存adapter非学習reload・24GBでの前後生成と回収を確認。16GB適合・意味採用・商品品質は未成立です。`contract_examples.json`は当時の非学習説明例で、正式2教師/実rawと区別します。

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

前回はstdlib/stubtokenizerの8検査を実施。今回のtail-loss修復後は同じ8件＋新3件の11検査が成功し、実4B tokenizer/indexもoffline cacheから再測定しました。prefix／final assistant mask／EOS／no truncationと固定indexの16moduleを保持しています。初回はprompt2986＋completion1094＝4080、訂正後は5979＋1877＝7856 tokens。最大prompt5979＋返答上限2048＝8027で8192以内です。後続の実GPUでmodule/勾配/保存後reload/24GB診断を確認しましたが、意味採用0/2・商品品質未合格です。本番/本人端末/16GBは未確認です。

## 今回保存したCPU結果と次の実行境界

`cpu_connection_results.json`は合成候補による実Engineの原source・packet・snapshot・本文・問い、`cpu_raw_consumer_results.json`は同target rawのconsumer結合結果要約、`cpu_tokenization_results.json`は重みを読み込まない実tokenizer／固定indexの結果です。モデルrawや学習結果には数えません。API固定sourceは`02c0b943c96b67cb32354e1d3352a00dcb768e64`です。保存rawの検証には、このAPI commitの別checkoutを`--api-root`へ明示します。

今回の一回は学習/回収/削除まで終了しました。追加の観測会や旧7教師の無理な変換をせず、次は実rawの座標/形式拒否から既存OUTPUT_SPECと同じ2教師をCPUで揃える最小修復候補です。具体の残差と未実装の範囲は実結果READMEに保持し、新GPU/追加epoch/通常有効化へ自動進行しません。


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
