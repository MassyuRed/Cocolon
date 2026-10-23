# 価格上限980円／1,980円に合わせた小型モデルの再選定

2026-10-23 JST／華恋。Runpod A40のM1は4件取得・全本文診断済み。今回の出力には重大不足、P6統合・追加学習・価格／商品quota変更は未実施。[実結果](../../trials/2026-10-23-qwen9b-m1/README.md)。

## 1. Mashの決定と、前案の訂正

Mashの明示条件は、**Plus月980円／Premium月1,980円が上限、これでも高い、27Bは候補外**。この制約を採用する。上限額で販売することや現在のDB表示値を変更する承認ではない。

華恋はモデル／実行方式を価格上限へ合わせるべきところで、1,980円／3,980円へ売価を上げる案を推奨した。この推奨と27B再試験案は撤回する。旧試算の算術・参照資料は履歴として残すが、currentな価格・次の実行条件に使わない。

## 2. 出す候補と推奨順

**10/23 Mashの希望を受領：次のQwen3.5-9B試験はRunpodを優先する。** Mashは27B／120B試験で利用したRunpodに残高があるため、同じ提供元での試験を希望。公開重みをGPU Pod上で動かす方式にできる。旧DeepInfra標準従量API案は比較用の選択肢として保持し、試験先の第一候補から外す。自己管理・追加学習用のQwen3.5-4B別候補と、27B除外・価格上限は維持。後続のMash画面操作でA40 48GB・GPU表示$0.59/h・起動前残高$5.15、Volume50GB /workspaceを確認し、M1を実行した。現残高・実総消費・GPU停止完了は未確認。

| 候補 | 確認できた現実の選択肢 | 採否に必要な確認 |
|---|---|---|
| **Qwen3.5-9B** | 公開重み・Apache2.0、262,144 context、非thinking設定あり。DeepInfraでBF16の既製モデルAPIを提供 | Emlis初回／補足更新、Pieceの本人の声、期間分析の根拠とgraphを実出力で評価。Cocolon品質・速度は未測定 |
| **Qwen3.5-4B** | 公開重み・Apache2.0、追加学習後GGUF/vLLM exportの手段あり。Unslothのbf16 LoRA目安10GB | 以前の素の4Bは観測／更新品質未達。軽さだけで採用しない。学習後の改善と推論の総費用を別評価 |

Gemma4 E4B ITも比較可能だが、effective4.5B／embedding込み8Bのモデルであり、名称だけでQwen4Bと同じメモリとは扱わない。今回の第一試験へモデルを増やさず、Qwen9Bから始める案とする。一般ベンチマーク・多言語数はCocolonの商品合格ではない。

DeepInfraの4Bは旧紹介記事に価格があったが、現在のモデルURLは404で現行価格を確認できなかった。安い4B APIが今も使える前提で見積もらない。

## 3. 公開APIの原価

2026-10-23 JST公式確認。以下は既製APIを使う場合の比較資料で、Runpod自己hostのGPU試験費・本番原価ではない。標準tier、割引／cache／batchの効果を見込まない。

| 提供元 | 正確な既製モデルID | 入力100万token | 出力100万token | 備考 |
|---|---|---:|---:|---|
| **DeepInfra** | `Qwen/Qwen3.5-9B` | **$0.10** | **$0.15** | BF16、公開API、Zero retention表示 |
| Together | `Qwen/Qwen3.5-9B` | $0.17 | $0.25 | FP8、代替提供元。保存設定の確認が必要 |

160円/$の仮定なら、DeepInfraで全機能合計の入力300万＋出力50万tokenは推論費**60円/月**。GPU月額、load／idle秒を別に上乗せしない。課金対象は本文だけでなく指示・渡した履歴・意味候補・graph・再入力・生成された推論過程も含む実usageで確認する。

通常の同期推論について、DeepInfraは本文をdisk保存せず、完了後memoryから削除、学習利用なし、請求等のmetadataは保持と記載する。これはデータ送信先が増えない意味ではなく、Cocolonの実ユーザー本文を既に送ったという意味でもない。今回の比較対象は保存済みの架空fixtureのみ。独自モデルのuploadやユーザーデータ送信の実行はしていない。

## 4. 三中核の利用量を含めた月原価

**次の回数は料金成立性を見る使用量シナリオで、商品quotaの新決定ではない。** 27B前提で提案したFree3セッション等を維持条件にしない。Emlisの「1セッション」は初回＋任意回答更新まで。Free／Plusは最大2生成、Premiumは最大4生成として積算する。

| 月の使用量シナリオ | Free | Plus | Premium |
|---|---:|---:|---:|
| Emlisセッション | 30 | 100 | 150 |
| Emlis本文生成（全回答した場合） | 60 | 200 | 600 |
| Piece新規本文 | 5 | 30 | 60 |
| 期間map／比較／説明文の新規生成単位 | 1 | 8 | 12 |
| 将来IF候補生成の原価予約 | 0 | 0 | 4 |

1回あたりの仮token量：

| 処理 | 入力token | 出力token |
|---|---:|---:|
| Free Emlis | 2,000 | 512 |
| Plus Emlis（履歴含む） | 4,000 | 768 |
| Premium Emlis（履歴／frame含む） | 8,000 | 1,024 |
| Piece | 4,000 | 1,000 |
| 分析1単位（原記録／既存map等） | 64,000 | 4,000 |
| IF | 16,000 | 3,000 |

各処理のtokenは未測定であり、日本語の文字数換算値ではない。長期分析をEmlis同量へ縮めていない。100件/期と前期、意味候補の別pass、分割集約を含む総tokenがこの仮定を超えるなら再計算する。今期map／前期map／比較文を新規生成する時はそれぞれを数える。こころ天気の数値集計、保存済みmapの再読、同じPiece画像のexportは毎回モデル生成へしない。

`推論費 = (月入力token * $0.10 + 月出力token * $0.15) / 1,000,000 * 160円`

`変動原価予算 = 推論費 * 1.2（再試行予備） * 1.1（税／決済変動予備）`

| 全量利用時 | Free | Plus | Premium |
|---|---:|---:|---:|
| 月入力token | 204,000 | 1,432,000 | 5,872,000 |
| 月出力token | 39,720 | 215,600 | 734,400 |
| 予備込みの月変動原価 | **5.57円** | **37.07円** | **147.28円** |
| 全工程の総tokenが2倍の感度 | 11.13円 | 74.15円 | 294.56円 |

2倍は必須2passで総tokenが2倍に収まる場合等の感度で、常にこの倍率で収まる保証ではない。thinkingは既定ONのモデルなので、providerでの非thinking指定と実出力・usageを確認する。thinking分を除外して安く見せない。

## 5. 無料者・基盤・ストア費込みの確認

980円／1,980円を売価の比較基準にする。日本向け税込価格仮定、採算額は前試算と同じ `売価/1.1 - 手数料率*売価`（実振込・確定納税額ではない）。基盤予算は保守的に前案の**11,000円/月**を据え置く。公開API案でモデルvolume560円は必須ではなく共通予備へ振り替えた。GPU固定費は0。基盤増設・超過は規模に応じて別途増える。

全量利用、有料構成Plus80%／Premium20%、MAU1,000の算術感度：

| 条件 | 無料者を含む変動費/月 | 手数料15%での月残額 | 手数料26%での月残額 |
|---|---:|---:|---:|
| 有料5%（Free950／Plus40／Premium10） | 8,244円 | **+25,542円** | **+19,052円** |
| 有料10% | 10,922円 | +67,651円 | +54,671円 |
| 有料5%・総token2倍 | 16,489円 | +17,298円 | +10,808円 |

無料950人の原価5,288円も含む。人件費・広告・追加学習費・返金損失・所得／法人税は未控除。MAU100・有料5%では26%手数料で約-7,995円/月となり、少人数の基盤費までなくなったとはしない。同条件の算術損益分岐は約MAU367／有料19人。有料が全員PlusでもMAU1,000・転換5%・26%手数料で約+13,663円。

為替180円/$では同条件で約+18,022円、Together公表単価では約+13,338円。総token5倍ならDeepInfraでも約-13,925円。原価の余地はあるが、長文／多段処理を無制限にはしない。実token・品質・速度から生成枠を具体化する。[再計算スクリプト](small_model_cost.py)で仮定ごとに再計算可能。

## 6. 観測技術の追加学習を消さない

**上の数円〜百数十円は既製9B APIの費用で、Cocolonの観測技術を重みに追加学習した独自版の費用ではない。** CMEEとの接続方針も観測技術を育成する方針も維持する。初回比較は、モデルの意味理解／候補生成に既存CMEEの方針を添える未接続proxyであり、単なる文章の言い換えだけへ用途を縮めない。

Qwen4Bを追加学習用に残す理由は、公開重み、商用・改変可能なライセンス、bf16 LoRA約10GBという公式手段である。9Bの同目安は約22GB。学習用VRAMはsequence/batch等で変わり、4bit推論とbf16 LoRAを混同しない。UnslothはQwen3.5の4bit QLoRAを量子化差のため非推奨としている。過去4Bの素の品質未達を、追加学習で必ず直るとは言わない。

DeepInfraのCustom LLMはGPU時間課金で、LoRAはbase対応・単価の確認が別に必要。4B／9BのCocolon独自LoRAを上の共用API単価で運用できると確認した事実はない。学習費、学習後の自己host／custom endpointのscale-to-zero費用を別の小規模上限で評価する。未確認の独自版を販売構成として確定しない。

## 7. 最初のM1実行結果と次の範囲

27B除外を維持。既存4場面E02-0／E02-B／P01-N／A02-P1のM1 Qwen3.5-9B未接続proxyをRunpodで各1回実行し、4件の原本・本文を[結果記録](../../trials/2026-10-23-qwen9b-m1/README.md)へ保存した。全HTTP200／stop／JSON構文有効、要求90.607秒、入力2373／出力2432token。根拠外補完・行動欠落・未明示因果・unknown欠落により、この出力のまま採用しない。固定原入力は変更0。C0は保存原本を再利用、再実行0。E02-Bは実thread回答でなく固定補足probe。

Runpodでの初回候補はQwen3.5-9B。公開重みの版・形式・量子化、実GPU/VRAM、実行backend/version、context／非thinking／出力上限・JSON設定を固定し、入力／出力token・全本文・実時間・GPU稼働時間を記録する。前回27BはA40とllama.cpp b11784だったが、現在のPod・9B対応backendの再利用可否は未確認。既存4場面と評価条件を維持し、JSON成功を意味採用や商品合格にしない。

**旧最大4リクエスト／利用消費50円はDeepInfra API向けの既承認枠。RunpodのGPU起動予算へそのまま移さない。** RunpodはGPU稼働と保存領域を残高から消費し、準備／model load／待機も稼働時間に含まれる。後続のMash操作でPod起動・モデルdownload・M1推論を実施した。起動設定／環境と要求時間は結果原本に記録されているが、準備・読込・待機込みのGPU総時間／実総消費・停止完了は未確認。追加チャージ・残り16場面・再試行は0。次は保存候補をCMEEの現admission／意味型へ照合するP6/M2 offline評価で、今回未着手。重み／backend版／sampling等の記録と、APIだけで独立確認できない範囲を結果記録で区別する。

費用面では980円／1,980円内を比較できる具体候補が得られた。**品質面の採用は、同じ三中核の実出力で決める。** 安いAPIを見つけたことを商品完成・需要の証明にしない。

## 8. 原典・状態

- [Qwen9B公式モデルカード](https://huggingface.co/Qwen/Qwen3.5-9B)、[Qwen4B公式](https://huggingface.co/Qwen/Qwen3.5-4B)。
- [DeepInfra9Bの現価格／提供仕様](https://deepinfra.com/Qwen/Qwen3.5-9B)、[API](https://deepinfra.com/Qwen/Qwen3.5-9B/api)、[data privacy](https://docs.deepinfra.com/account/data-privacy)。
- [Togetherの同モデル](https://www.together.ai/models/qwen3-5-9b)、[価格](https://www.together.ai/pricing)、[ZDR](https://docs.together.ai/docs/zero-data-retention)。
- [UnslothのQwen3.5追加学習](https://unsloth.ai/docs/models/qwen3.5/fine-tune)、[Gemma4公式](https://ai.google.dev/gemma/docs/core/model_card_4)。
- 商品資料照合点：Cocolon PR30 `54d34985ba180e54b521549100fc1f9fcc72f309`、API PR3 `3084c99e5a08d6e475d8a177e62ebf1548e8a0f9`。System Context最新cache未生成・既存timeoutの状態は変更せず、fresh原本を直接読んだ。

STRUCTURE_MAP_DELTA_NONE（source／runtime接続／契約変更なし）。価格上限・27B除外・Runpod残高利用希望はMash決定。9B未接続M1の実取得は限定TECHNICAL_CREDIT、商品品質合格は0。4B育成候補・利用量は華恋案。product_credit=0、automatic_progression=false。

Runpod優先への変更根拠：2026-10-23 Mashの「残高まだあるからrunpodがいい」。公式[残高・計算資源・保存の課金](https://docs.runpod.io/accounts-billing/billing)、[Pod料金と停止中保存費](https://docs.runpod.io/pods/pricing)、[Qwen3.5-9B公開重み・対応backend](https://huggingface.co/Qwen/Qwen3.5-9B)を確認。単価・機材構成は次の現物確認へ残す。試験場所の希望で、本番hostやモデル採用の決定ではない。
