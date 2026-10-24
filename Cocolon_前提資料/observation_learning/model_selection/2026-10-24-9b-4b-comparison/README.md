# 680円／1,480円を目標にした4B・9Bの選定比較

2026-10-24 JST。**実行用pack準備・CPU検証済み、実GPU未実行。追加学習はしない。**

Mashの「どうするの？」に対し、教材追加や9Bの1／4／16周を先行せず、同じ6入力を各base modelへ一度ずつ渡す最大12生成に絞った。価格は検討目標で、売価・商品quotaの変更やモデル採用ではない。元の学習結果・adapter・9教師・6評価・20fixtureを変更しない。

## 実行と持ち出し

既存のRunpod **A40 1枚・PyTorch template** のPodを一つ起動し、Jupyter LabのTerminalで実行する。以前のvLLM serverを別窓で立てる必要はない。空きVRAMが不足する場合は、他processを勝手に停止せず終了する。

`<PACK_COMMIT>`は、このpackを置いた固定commitへ置換する。更新中branch名を渡さない。

```bash
export COCOLON_SELECTION_COMMIT=<PACK_COMMIT>
curl -fL --retry 1 --connect-timeout 30 --max-time 120 \
  "https://raw.githubusercontent.com/MassyuRed/Cocolon/${COCOLON_SELECTION_COMMIT}/Cocolon_%E5%89%8D%E6%8F%90%E8%B3%87%E6%96%99/observation_learning/model_selection/2026-10-24-9b-4b-comparison/runpod.sh" \
  -o /workspace/cocolon_selection.sh &&
bash /workspace/cocolon_selection.sh all
```

取得・別venvへのinstall・prepare・4B→9Bの生成に合計30分で終了要求、30秒後に強制終了する。最初のwrapper取得とPod開始前後の待機・手動操作はこのtimer外。**Pod自動Stopではなく、全課金の上限でもない。** 既存Torch／CUDAと既知HF cacheを維持する。未cache重みは両model計約28.63GBで、さらに4GiBの空きを要求する。全容量表示ではなく実cacheの空き容量を調べる。

終了・エラー・時間切れのいずれでも、Jupyterから次の一つをダウンロードし、**PodをStopしてから華恋へ渡す**。

`/workspace/cocolon_selection_20261024/latest_selection.json`

隣にSHA256も保存する。モデルごとのatomic JSONを回答ごとに保存し、外側timeout後にも回収する。通常の時間切れ・強制終了で保存済み回答を保持するが、Pod／disk障害時の保証はしない。setup失敗時も失敗JSONを作り、詳細logは同folderのselection.logへ残す。今回は新しい学習重みは作らない。同folderでの2回目実行を拒否し、自動再試行・延長・チャージをしない。

## 同条件と由来

| model | 固定revision |
|---|---|
| Qwen/Qwen3.5-4B | 851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a |
| Qwen/Qwen3.5-9B | c202236235762e1c871ad0ccb60c8ee5ba337b9a |

Transformers 5.19.0／Accelerate 1.15.0／Safetensors 0.8.0、BF16・SDPA・量子化なし・非thinking・greedy・seed20261024・同一GPU・同時数1。modelごとに別processへ読み、LoRAを載せない。warmup追加生成なし。raw全文・parse成否・token IDs・生成秒・load秒・peak VRAM・環境を保存する。初回生成はwarm扱いせず印を付ける。load時間にweight downloadが入り得ることも区別する。

| 入力 | 対応範囲 | 入力token／出力上限 |
|---|---|---|
| E02-0 | Emlis初回、二行動と喜びの理由の不明 | 515／1024 |
| E02-B | 同じ原入力に本人補足、読みの更新 | 590／1024 |
| P01-N | Piece、喜び・負荷・後悔の否定・次回条件 | 537／1024 |
| A02-P1 | Analysis、3記録の文章と図候補 | 827／3072 |
| FT-CHAIR-AFTER-CORRECTION | 椅子、本人訂正後の主体と喜びの理由 | 582／1024 |
| FT-SHOP-AFTER-ANSWER | 開店、本人回答後の受け取り | 637／1024 |

前4件は[受領M1](../../trials/2026-10-23-qwen9b-m1/README.md)の実requestにあるmessagesとcase別出力枠、後2件は[Free教師案](../../training/2026-10-24-emlis-free-pilot/sft_examples.jsonl)の教師completionを除いたmessagesを再利用した。本人user messageは原本と全6件同一。共通のsystem末尾に「指定された出力欄を持つJSON objectだけを返す。Markdownや前後説明を付けない」を両model同じ形で明示した。別の採点情報や正解本文は渡さない。

cases.jsonl SHA256: `e5600b8b8ddb2d6d44ef22e2e03a254c0e447eb9d745bbf4d9098ee947a0a40f`。

元M1結果SHA256は`c7830eedcb46f1a2b0b2365d1bb19c8241d6fd123e1001e18be23fcf5a9c7765`、参照教師fileは`b3115af6a79bb39467517d49f92c94ee7a1019c168f3cf74e078c9960e18bd82`。原本を変更した意味ではない。元M1のvLLM／JSON制約付きdecodeから今回はbackendとJSON指示が変わるため、新9Bも同条件で一度取得する。旧M1を新4Bとの同条件の速度比較へ使わない。

入力は既知の開発確認で、独立未知評価ではない。E02-Bも実アプリのpendingを発行して完走した証拠ではなく、固定補足snapshot。全体8192tokenを超えたら切り捨てず中止する。Analysisだけ原M1と同じ3072の出力枠を保つ。

## 結果を受けたら何を決めるか

華恋が12本文を読み、根拠のない感情理由・返信／約束／人格の追加、主体・時点・否定・行動の欠落、本人訂正の不反映をcase別に記録する。JSON成功だけで合格にせず、問いなしを一律失敗にしない。全三中核の文章・意味と訂正後2件の挙動を比較し、正式Product Readや採用とは分ける。

- 4Bが意味保持で9Bと同程度なら、小GPUへ収められる可能性と処理時間を次に確認し、4Bを育成候補にする。
- 9Bに明確な品質差がある場合は、その差と価格内で成立し得る提供方式を併せて判断する。9Bという大きさだけで採用しない。
- 両方が同種の重大逸脱を繰り返す場合、この条件で反復学習を増やさず、prompt・教材の狙い・別model候補を見直す。

この12件は、無量の育成に入る前の小さな比較。単独生成秒数から月額の黒字、同時処理能力、p95、Serverless cold start込みの費用は確定できない。候補が残った場合だけ、実際の提供方式でlong history・同時処理・cold start／idleとLoRA搭載後の負荷を上限付きで測る。Plus履歴・Premium frame／最大3問・期間Analysis最大材料・IFまで今回測ったことにしない。

## 価格から逆算した費用枠

[budget.py](budget.py)と[全16条件](budget_scenarios.json)は標準Pythonのみで再計算できる。**仮定付きの予算枠で、本番原価の実測・利益予測・実際のストア入金ではない。**

仮定：Plus680／Premium1480円、構成80%／20%、保守的な旧計算式`価格/1.1 - 手数料率×価格`、共通基盤11,000円/月、売上手取りの20%を運営余力として残す案、為替160円/$。手数料15%／26%の二条件と余力0%／20%を区別する。余力率はMash確定の利益率ではない。

| 有料人数 | 26%手数料・20%余力の案で、AI・保存等へ残る月額 |
|---|---:|
| 10 | -6,638円 |
| 50 | 10,809円 |
| 100 | 32,619円 |
| 500 | 207,095円 |

残額にはFreeも含む推論・storage・その他が入る。人件費・広告・返金・教材／学習開発費等はさらに別。無料者の生成費を自己host GPU費と別のAPI token billとして二重加算しない。

Runpod公式pricingを2026-10-24確認：A40 $0.59/h、A5000 $0.27/h、Flex48GB $1.22/h、24GB $0.69/h、16GB $0.58/h。実際の空き・cache・model適合・同時処理は未確認。A40常時720hはGPUだけ67,968円/月で、この有料50／100人の費用枠を超える。9Bの必須配置という意味ではない。

例として有料50／無料950人、有料化5%、月間名目生成をFree66／Plus238／Premium676回と仮置きすると78,980回。26%手数料・20%余力の残額でFlex48に使えるのはstorage前で55.376 GPU時間、全名目生成平均2.524課金GPU秒分。cold start・idleもこの中に入る。これらの回数は商品quotaの確定ではなく、batch時の按分も未測定。4Bでも同じGPUを同時間保持すれば固定費は同じで、小型化だけで黒字にはならない。

公式原典：[Runpod pricing](https://www.runpod.io/pricing)、[Serverless課金](https://docs.runpod.io/serverless/pricing)。store入金の26%を現行契約の確定値として使わない。

## 検証済み／未確認

- 実固定tokenizerをCPUで両modelへ適用し、表の6件すべて同じtoken長を確認。入力＋出力最大3899で8192以内。公開config／weight indexを両固定revisionから取得し、Qwen3_5ForConditionalGenerationを確認。weight本体はCPU検証では取得・loadしていない。
- Python／bash構文確認、CPU unittest **6件成功**。固定入力改変拒否、12回答未完了の昇格拒否、完了／途中結果の保持、二重実行拒否、予算算術、実outer timeoutの短縮強制KILL後に6+2回答回収とchecksum一致を確認。
- read-only別担当も元入力との一致とwrapperの回収処理を確認。正式Product Readではない。
- 新packのGPU完走・品質・実提供原価は未確認。華恋によるGPU起動・有料生成・学習は0。STRUCTURE_MAP_DELTA_NONE（offline選定scriptのみ、商品owner／型／接続／公開契約変更なし）。

## fileの責務

| file | 内容 |
|---|---|
| runpod.sh | 固定commit取得・別venv・既存cache再利用・30分制限・途中結果回収・重複拒否 |
| compare.py | 固定6入力とtoken／容量検査、4B→9Bの最大12生成、raw／時間／環境保存 |
| cases.jsonl | 原本からの6入力、同一JSON指示、出典とcase別出力枠。教師正解なし |
| budget.py／budget_scenarios.json | 680／1480の仮定付き費用枠16条件と再計算 |
| test_compare.py | 途中保存・失敗・重複・強制KILL・費用算術のCPU検査 |
| README.md | 実行・持ち出し、判断、限界と原典 |
