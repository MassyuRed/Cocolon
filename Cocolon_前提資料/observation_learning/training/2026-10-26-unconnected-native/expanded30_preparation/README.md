# 同じ8層の注意・MLPへ学習対象を広げる30更新候補

状態：**実CPU確認済み／新GPU一回は未承認・未起動**。旧ordered30は閉鎖・新483d74b7不採用のまま保持し、旧承認/出力/残枠は再利用しません。

**現在の直接作業（10/27：学習対象を同8層の注意・MLPへ広げるexpanded30候補、実CPU確認済み・新GPU一回は判断前）：** ordered30の意味3/本文3への退行を受け、初期1dの旧32tensorを完全保持し、同8層のk/oとMLP gate/up/downへ40moduleを追加する56module/112F32/3,833,856parameter候補を実装。新40Bをzeroにした初期化をJupyter CPU6.591629秒で作成し、旧32一致・実tokenizer15/切捨て0/max7935・固定API入力/prior15一致・pending executeのoutput前拒否を確認。小CPU層の勾配有限確認だけ3.424515秒で追補。全13payload＋manifestと112F32有限/新40BzeroをPod外照合・保全。元sorted教師/全文CE/LR1e-5/同30順序/評価/readerは維持し、実4B読込/forward/更新/生成0。新一回は30更新→保存/同process非学習reload→同15確認、最大2700秒/各180秒/15call/$0.21処理按分（準備/回収/保持等別）の個別判断前。旧runは閉鎖・新観測会は今は不要、原本expanded30_preparation/README・weekly§70。商品0/正式0/3/54.50％、GPU稼働保持。

## 改善する不足と選んだ変更

目的は、4Bが本人の言葉・主体・時点・否定・不明と回答後の全変更を保ち、自然な観測/受け取りを生成し、既存CMEEで採用・保存再読できることです。三中核全体の用途とRunpod育成・Windows/Mac未選定は[学習目的](../../../README.md#observation-learning-intent-and-assumptions)を維持します。

初期1d218763は同15で意味11/本文9、新6本文0です。その後、全文CEの低LR継続は11/9のまま、生成順だけ変えたordered30は3/3へ退行しました。[ordered30全結果](../ordered30_result/README.md)と[continuation30全結果](../continuation30_result/README.md)を基準にします。単に回数/LR/文字列の順を再調整する案を追加しません。

これまでのLoRAは32層中8層（3,7,11,15,19,23,27,31）のfull-attention q/vだけ、16module/32tensor/917,504parameterでした。今回、同8層に限ってk/oとMLP gate/up/downを追加します。計56module/112tensor/3,833,856parameter、追加2,916,352parameterです。MLPの表現変換も直接学習対象にする仮説で、容量不足が失敗の原因と確定したものでも、品質改善の保証でもありません。

| 案 | 判断 |
|---|---|
| 今回：同8層のq/k/v/o＋MLP | 旧q/vを保持したまま40moduleを追加。触る層を増やさない最小の推奨 |
| text-only all-linear | 248module/496tensor/16,232,448parameterで範囲が大きい。visionも含み得る無限定all-linearは使わない |
| 正解prefixを分けて学習 | 通常teacher forcingも既に正解の過去tokenを見ており、同重みなら同CEの再分割。新しい条件付けによる解決とは説明できない |
| 推論へ正解prefixを渡す／部分JSONを補う | 固定評価の変更・教師漏洩になるため本候補に含めない |

## 初期値と不変条件

元の1d218763 adapter3fileをhash固定し、旧32tensorの値/shape/F32を完全保持します。新40moduleは固定seed20261027のKaiming Aと全zeroのBで別adapterへ保存しました。r8/alpha16/dropout0/bias none、同じbaseを維持します。有限値のLoRA式では追加差分は0ですが、**実4B forwardで開始時の出力同一性を測ったわけではありません**。小CPU層での同一性と勾配を実測した範囲を区別します。

- 元初期weights：1d218763964ce0e1f0e587c754731c5476d70cdd16548020abf330912c518c1b。
- 拡張した非学習初期weights：349034fc96acf191c3d919ed6a69ac4de14526c8c129b5f536eaa2baa1c6fc7a。**追加学習済み候補ではありません。**
- [warmstart_report.json](warmstart_report.json)に全56module・旧32一致・新40Bzero・初期3fileのhashを保持。
- 元sorted train_messages.jsonl、全15system/user、評価入力/凍結教師prior、全文assistant/EOS平均CE、LR1e-5、同30更新順、元cap/seed/clip/optimizerを維持。ordered serializeは継承しません。
- 保存済みinitial1d/continuation30/ordered30の同15rawと比較し、新baseline生成0。未知評価を行ったことにはしません。

固定Qwen revisionのcached config/全対象weight headerと、[Transformers v5.19.0の実装](https://github.com/huggingface/transformers/blob/v5.19.0/src/transformers/models/qwen3_5/modeling_qwen3_5.py)、[PEFT v0.21.2の初期化](https://github.com/huggingface/peft/blob/v0.21.2/src/peft/tuners/lora/layer.py)を照合しました。qは8192×2560、k/vは1024×2560、oは2560×4096、gate/upは9216×2560、downは2560×9216です。

追加F32parameter/gradient/AdamW m/vは計算上44.5MiBですが、activation/workspaceを含む実peakの保証ではありません。A5000での実4B112tensor読込・学習・保存reloadは未実測で、OOM時は縮小/再試行しません。

## Jupyterでの実CPU確認

[actual_cpu_check.json](actual_cpu_check.json)：最初の一式 **6.591629405040294秒**。同PodのJupyterへ直接接続し、CUDA_VISIBLE_DEVICES=''・offlineで実行しました。

- 固定baseのheader56対象、旧adapter3hash、旧32tensor完全一致、112tensor全F32/有限、新40Bzero、3,833,856parameterを確認。base weight tensorや4B本体は読み込みません。
- 実tokenizer全15、切捨て0、最大7935/8192、prompt除外・全文assistant/EOS学習、旧9 max2560/新6 max3712内。
- 凍結eval messages＝元system/user、実CMEEのnative request/priorから再構成した入力が全15一致。評価へ正解assistant/prefixを追加しません。
- 小CPU線形層で旧adapterの出力一致、追加Bzeroの出力一致、新Bへ非zero勾配を確認。
- pending executeは新GPU output作成前に拒否。新GPU output不存在、依存追加0、実4B読込/forward/更新/生成・新raw採用・SQL0。
- read-only補助の指摘で、勾配自体の有限性が明示assertされていない検査漏れを補いました。**小CPU層の確認だけ3.424515425111167秒で追補**し有限性を確認。warmstart再作成・tokenizer/CMEE再実行0。最初の原本は[actual_cpu_check_initial.json](actual_cpu_check_initial.json)、補正のsource hash/lineageは現reportに残します。

CPU成功は、実4Bの読込成立・学習効果・15件生成・CMEE採用・商品品質の証拠ではありません。model_reload_4b_tested=falseです。

## 提案する新GPU一回

| 項目 | 固定範囲 |
|---|---|
| owner/環境 | root華恋のみ／既存bkj4qvnhwtdqc2・A5000、Jupyter直接 |
| 元モデル | Qwen/Qwen3.5-4B @851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a、BF16 base固定 |
| 初期 | 上記拡張CPU初期値。旧1d32を保持・新40Bzero。失敗483d/ddは使わない |
| 差分 | 同8層のLoRA対象16→56だけ。r8/alpha16/dropout0、112F32だけ学習 |
| 更新 | 同15×2pass/同30順序、全文assistant/EOS平均CE、LR1e-5、fresh AdamW |
| 保存 | 別adapter保存→学習model参照解放→同OS processの新model objectへ非学習reload→同15生成 |
| 時間/call | 読込・学習・保存reload・生成で最大2700秒／各生成180秒／15call、新before0 |
| token | context8192、旧9 max2560／新6 max3712を維持 |
| 処理按分 | 前回確認表示$0.28/h×最大45分＝**$0.21**。準備/CPU確認/回収/保持/保存/通信/税等別 |
| 結果 | 全rawを無補修で固定CMEEへ、採用snapshotのみ別process cold-file、全本文/全更新を読解・保存重み/全原本回収 |
| 停止 | OOM/非有限/期限/identity/例外で停止、追加更新/欠測再生成/自動retry/自動縮小/別Pod移行なし |

実modelの生成は、凍結messagesだけを渡した空assistant開始から全packetを一回生成します。正解prefix付きcompletion、教師置換、JSON修復、reader緩和を成功へ数えません。after回答priorは凍結教師で、動的thread/実service/SQL/Auth/RN/本人端末はこの一回に含めません。

目標は既知FIT意味/本文15/15と旧9の保持・新6本文の明白な不足解消です。未達/退行は不採用として記録し、通常有効化へ進みません。全15完走・OS強制停止・未知一般化・正式商品受入れを保証しません。GPUは指示まで稼働保持し、Stop/restart/deleteは行いません。

## 実ファイル・再開先

| file | 責任 |
|---|---|
| run_native15_expanded30.py | CPU初期値の作成/検証、全112tensorの完全読込・trainable限定、同30更新/保存/非学習reload/15call |
| gpu30_expanded.plan.json | 条件・初期3hash・予算。PREPARED_AWAITING_MASH_APPROVAL / gpu_run_authorized=false |
| consume_expanded30.py | 拡張初期値/実30log/sourceを束縛し、従来の無補修採否・cold-file。API/reader変更0 |
| verify_expanded30_cpu.py | 実tokenizer/入力・小CPU層・pending拒否の確認。実4B処理0 |
| actual_cpu_check*.json / warmstart_report.json | 実結果、初回と有限性追補のlineage、非学習初期値のidentity |
| preparation_recovery.json | 初期値/候補/CPU原本archiveの全member照合と回収先 |

pack=/workspace/cocolon_native15_expanded30_pack_20261027、GPU output=/workspace/cocolon_native15_expanded30_run_20261027（不存在）、consumer API=/workspace/cocolon_afteronly_api_20261027。初期値はpack/expanded_initial_adapter。payload/helperは既存凍結ownerからbytes不変でコピーし、教材/codeの別正本を作りません。

archive **8,369,444bytes/SHA256 93d102c267f7ddea5ec84eda1e587f21131480d32ac112f6ae73159d163bbf6a**、全13payload＋manifest/14memberをPod外照合し、[非学習初期値・候補・CPU原本](https://chatgpt.com/library?file_id=libfile_11851e44ef708191bc8d65ff1ef04302&account_id=personal)へ保全済み。Pod外でも全112F32有限と新40Bzeroを照合。旧32の元1dとの完全一致はJupyter CPUで元3hashを束縛して確認した範囲です。base4B/optimizer/RNGは非同梱で厳密な途中resumeではありません。

開始Cocolon8b356c017bc9b45978eb9ef77eb357c9c1abbfc4/API6b043880。全機能原本を全文、恒久incident/規則/Karen-Diary・全体設計/01/01A/01B/01C/全tree（3429/2525、両truncated=false）・対象CMEE map・学習目的・最新weekly§69・実source/全15失敗を確認。全blob意味読了/live再検証ではなく、System Contextの索引timeoutはfresh原本直接読取で扱い、索引再試行0です。

今回の可逆候補/CPU/GitHub反映はMashの続行指示とRule18§11.3のLEVEL2内。rootが単一writer/実行owner、補助はread-only。環境は確認できるCodex Work/GPT-6系として記録し、Pro/Ultraという実model名や正式受入れを偽りません。**実4Bの新load/forward/更新/生成は、費用を伴う新しい別一回の承認後だけ**です。

製品責務/意味型/wire/採用reader/API/DTO/DB/RN/Render/Supabase/本人DB/通常app/価格/merge/deploy/依存/モデル選定を変更しません。STRUCTURE_MAP_DELTA_NONE（学習対象だけの変更）。01Aは不足していたordered30群と本候補のfile地図だけ最小同期。CPU/sourceのprimary=TECHNICAL_CREDIT、**商品0/正式0/3/54.50％/candidate_ready=false/automatic_progression=false**。現段階の新観測会は不要です。
