# 同じ9教材の別run再作成と教師適合診断

2026-10-24 JST／MashのA40実行・華恋の受領照合。**再作成・再load・診断と重み退避は確認済み。観測品質は未合格。** 初回の重みは未回収のまま、この結果は別runとして扱う。

## 原本と受領確認

- pilot_results.json：受領latest_results(1).jsonの48,751 bytesをそのまま保存。SHA256 24e4f0dc7e9e2ed03115bf0dd960849fd96ce6432c850f2adad03b01c49620b5。初回JSONは親folderに不変で保持。
- diagnosis_results.json：archive内latest_diagnosis.jsonと同一の83,973 bytes。SHA256 907ebb138e34cb7f958fa0249e3449cfcf6b75a15c33e4aaa0b6c49f35f17edf。
- 重み入り受領archive：cocolon_recreated_checkpoint.tar.gz、4,217,463 bytes、SHA256 6a7b4fe0dbcc29cfcb858d9dd68f6fd5a65e1ebc5e8911bc63c2920f39a89b3d。添付sha256と一致、manifest対象33fileのhash／bytesが全一致。archive内は重複・特殊fileなし34通常file。重み本体の受領原本はこのarchive。
- adapter_model.safetensorsは4,461,168 bytes。32個のF32 LoRA tensor／1,114,112値が全て有限で、各tensorに非zero値があり、保存対象16moduleと診断時の読込normが一致。adapter3fileのhashはrunと診断に一致し、診断後も不変。既存baseへの再loadはMashのGPU出力から確認、華恋環境のGPU再loadは行っていない。
- 元レシピd53f9ef、再作成helper182d1a1、runner c049113…と4教材hashは固定。archive内runner／3helper／4datasetのGit blobをGitHub固定headと全8件照合。生成9promptは教師completionを除いた元messagesと完全一致。

状態はEXECUTION_COMPLETE_NOT_QUALITY_ACCEPTED／DIAGNOSTIC_COMPLETE_NOT_QUALITY_ACCEPTED。学習前6回答→9step→学習後6回答を完了。run記録73.800秒、診断105.657秒。prepare・download・待機・Pod全稼働／総課金の時間ではない。Pod識別は受領archiveに記録。今回のStop完了・総課金はまだ未確認で、MashへStop可能と案内した。

## 9教師への適合と、実際の回答

同一9教師／教師token合計1,089の加重NLLは **1.8150625453 → 1.6571437200（8.7005%低下）**。全9件で低下し、教師promptの生成は9件中8件で文面が変わった。これは教師回答の系列が出やすい方向の変化であり、観測精度8.7%改善、意味理解獲得、一般化や商品合格を意味しない。学習中の異なる9lossを収束曲線として扱わず、この診断は固定したbase／保存adapterで測る。

入力・教師・前後18本文を全件読み、次を確認した。華恋の内部判断で、Mashの正式Product Readではない。

| 教師ID | 学習後の状態と前後の違い |
|---|---|
| FT-UDON-INITIAL | 不要な他要因の不明は消えたが、身体的な安らぎの補完と説明調の受け取りが残る。 |
| FT-BOOK-INITIAL | 本人の気がかりを尋ねず、友人の気遣いか本物の許しかという真意の二択へ逸れる。 |
| FT-BOOK-AFTER-ANSWER | 連絡しなかった本人説明は保持するが、updateは連絡の遅れへ縮め、表情・トーン・今後の感情へ不明を広げる。 |
| FT-CHAIR-INITIAL | 独力の喜びは保持するが、また使える結果が落ちる。教師の問いは出ないが、指示上は任意なので問いなしだけを命令違反としない。 |
| FT-CHAIR-AFTER-CORRECTION | 独力の訂正は保持するが、本人が理由とした再使用に加えて協働・達成感を喜びの原因へ追加。 |
| FT-SHOP-INITIAL | 入力にない返信が来ない出来事を前後とも追加。学習後は意図的無視などへ拡張。 |
| FT-SHOP-AFTER-ANSWER | 具体的な約束なしという説明に対し未来の約束を立て、参加できない、招待忘れ／排除まで補完。 |
| FT-REPOT-INITIAL | 未記載の不安解消が消え、説明を聞いて理解し安心した本人情報へ近づく。 |
| FT-KNIT-INITIAL | 前後完全一致。面倒さと寂しさの関係が不明なことを保持し問いを強制しない。学習による新獲得ではない。 |

教えた事例でも根拠外の出来事や理由を補い、本人の明示訂正・否定を十分に保てていない。『学習が全く反映されていない』とはしない一方、『観測技術を身に付けた』とも判断できない。

学習外6場面の前後12本文も確認した。E06の乾燥完了補完が消え、E05の現在の参加意欲は明瞭になるが、E01の承認断定／評価か礼儀かの二択、E02の引返しと取り込みの因果逆転、E03の未記載の交流／温かみへの拡張が残る。E04の主要訂正保持はbaseで既に成立し、afterでは残す写真の明示が落ちる。初回とのraw一致はbase6/6、after2/6で、同一recipeでも初回と同一重み／同一出力を保証しない。十分な全体品質改善は示していない。

教師生成も前後JSON解析0/9。既知のJSON-only明示と生成拘束がないprompt／JSON検査の不整合を保持し、明示JSON命令違反と評価しない。本文の意味欠陥は形式問題と分ける。

## 次の判断

教材を増やす前に、同じ9教材で学習量だけを変える小比較を具体化する案がある。ただし、今回だけで原因を学習量不足へ確定しない。教師・module・JSON指示を同時に変えず、既存事例への適合と学習外の意味品質を分けて読む。増量・追加GPU実行・モデル採用・本統合は自動で行わない。既存4datasetと原18候補・教示5参照・撤回第7回・商品runtimeは不変。STRUCTURE_MAP_DELTA_NONE（offline受領結果の保存・内部診断のみ）。
