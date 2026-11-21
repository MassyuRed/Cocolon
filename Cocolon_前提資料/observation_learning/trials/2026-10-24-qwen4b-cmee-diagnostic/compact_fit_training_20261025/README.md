# 外側source_id・minified指示での4B形式学習1回

新prompt・既存2targetを使い、固定baseから新しいLoRAを1回作った。旧adapterへ追加epochしたrunではない。初回と保存prior付き訂正後のFITだけを前後比較し、実初回の問いから続く動的一往復や商品受入れとは区別する。

| 項目 | 実結果 |
|---|---|
| source / API | Cocolon `cd3fbf4505ccf0cfe9fbbade41bafd95472ef073` / API `a6838fc17cc657f9f80da28bb93b422d0f94a2dd` |
| run | `20261025-025406-cc300de8`、A4500 20GB、444.269722秒 |
| 学習 | 同2target・1epoch・2update、既存LoRA r8/alpha16/q-v16module、AdamW1e-4、seed20261024 |
| 生成 | BF16/SDPA、greedy、context8192/max_new2048、前後FIT各2＝4生成、proxy生成0 |
| 最大入力+生成枠 | 6114+2048=8162/8192、source/prior/target/EOS切捨て0 |
| 加重教師NLL | 0.216488964→0.210640858 |
| 初回の前後 | 各1740token・stop、schema_version重複によりINVALID_FORMAT |
| 訂正後の前後 | 各2048token・length、JSON途中終了によりTOKEN_LIMIT |
| 実CMEE意味/本文 | 前0/2、後0/2、missing FIT0・範囲外0、messages/identityは各2/2一致 |
| raw変化 | 前後とも各case完全同一、変更0/2 |
| peak allocated / reserved | 14.975895 / 17.587891 GiB |

外側source_id `FT-CHAIR-O`は学習前baseから正しくなったが、406..460 /489..567等のsource envelopeのUTF-8位置、対象外emotion field、kind混同、pretty JSON、自然な受け取りでない「喜び」だけのreceptionが残った。ID改善は新promptでの学習前の変化であり、この2updateの成果にしない。初回は重複キーで最初に拒否されるため、根拠や意味の検査まで通過したとは扱わない。訂正後は本文断片だけで成功扱いにしない。

NLL低下と32tensor/新重みを確認しており「学習効果ゼロ」や「4Bの能力限界」とは断定しない。一方、今回のgreedy出力と採用は改善しなかった。2updateが十分な学習量という根拠もない。同条件の反復や追加epochを自動実行せず、次はモデルへ見せる欄内座標とnative証明metadataの重複を含む入力投影、および既存targetを用いる形式学習方法を点検する。本人原文・根拠資格の保持、CMEE採用条件不変、原rawの無補修を前提にする。新しい観測会はこの形式問題には不要。Piece/Analysis完成教師0と全般品質の不足は別に残る。

学習前後raw、NLL、training、run、固定APIの実consumerを本directoryに保存した。consumer検証は同API commitの専用clean worktreeで実施し、通常checkoutの既存未追跡物は変更しなかった。APIの変更・新推論・DB操作は追加していない。消費側のJSONを緩めたり、rawをminify/補修/target置換してはいない。

## 重み・回収

新adapter_model SHA256：`06ca6381828841edd2b9c8237c3f7dc61f8242cba42eb8f9047d651fd5dc5749`。

最終archive SHA256：`d46ae21ffef258221f15d360260e9ace8d778ddd7a6970e410e10600307ac3a0`。全25memberのsize/hash、adapter3fileと32tensor有限性、保存/非学習reload後不変をPod外で照合して保管済み。旧0bdac5e9…adapterも全3hash不変をGPU上で照合した。[integrity.json](integrity.json)／[previous_adapter_integrity.json](previous_adapter_integrity.json)／[comparison.json](comparison.json)。本archiveはLoRA・設定・教材・生出力を含み、元base全重み・optimizer/RNGの厳密な途中再開状態は含まない。

[実execution_plan.json](execution_plan.json)は固定sourceで公開したtyped_fit計画と同一SHA256 `69814337cbfec05e753008c87aee2bf2c241bf4e24176b91642a12eecc345cc4`。fetchの既定非実行templateをこの新directoryでだけ退避し、固定計画を明示適用してから実prepare/runした。実preflightのplan/hashとFIT選択2を照合した。packの現行typed_fit計画は完了済みに閉じ、旧sourceの一回を再実行させない。

表示$0.26/h×444.269722秒のprocess按分は約$0.03209。準備/回収/継続保持/税を含む請求額ではない。実行は1800秒/計画$1内で完走。停止/再起動/削除/新Pod/チャージ0、GPUはMashの明示指示まで稼働保持する。正式0/3・全体54.50％は据置。
