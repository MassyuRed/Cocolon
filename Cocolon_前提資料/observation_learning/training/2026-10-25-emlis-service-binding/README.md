# 既存chairのservice識別子学習とCMEE保存再読

対象は、既存の架空の椅子修理 **1題・初回／訂正の2段階** です。独立したservice UUID・日時・実問い・採用済みpriorを持つ3組へ結び直し、学習候補を6行作ります。独立した言語事例が6件に増えた意味ではありません。

目的は、実serviceの訂正で観測されたJSON閉鎖、原入力と回答のsource区別、引用座標、文字列参照、3更新の崩れを、同じ教示内容で修復する準備です。UUIDだけが失敗原因と確定したわけではありません。新しい観測会や別の意味・文章の教示を追加しません。

`generate_candidates.py`は既存の`model_packet`／`natural_packet`をお手本として使います。実serviceの`_request`から初回候補を作り、CMEEが採用した初回snapshot・実ASKに対する訂正文から次の候補を作ります。既存の実model出力を正解へ昇格せず、失敗rawの括弧・ID・根拠を補修して使いません。元9教師、元4Bの2教師、既存評価、既存重み、API sourceは変更しません。

| file | 内容 |
|---|---|
| `sft_examples.jsonl` | 6行の候補。実service由来のnative_case、system/user、既存教示から作ったassistant target、出典・段階・確認結果 |
| `train_messages.jsonl` | 同じ6行のmessages。新たな文章や独立事例を含まない |
| `training_identities.json` | 学習候補3組だけの識別子。評価用の未学習identityは別管理 |
| `cpu_connection_results.json` | ModelCandidateSource→既存Engine／独立reader→隔離SQL・保存再読の実結果。合成候補であり実modelの成功ではない |
| `cpu_tokenization_results.json` | 固定Qwen3.5-4B tokenizerによる全文・assistant/EOS・生成枠の確認。重みとGPUは使わない |
| `dataset_manifest.json` | 各fileのhash・行数・元データ不変hash・API sourceの確認範囲。学習実行の承認とは別 |

検証は既存のisolated PGlite `Database`／Q2 migrationと実RPCを使います。Supabaseの稼働DB・本人rowには接続しません。初回と訂正の本文・問いを保存し、作者を禁止したGET/startと、同じ回答keyの再送で再生成がないことを確認します。

生成器にはtokenizer未準備時の明示的な試験用counterもありますが、その経路はtoken数を検証したとは扱いません。今回の正規候補は固定版の本物のtokenizerで確認し、`tokenization_verified=true`／`token_counter_is_stub=false`をmanifestで確かめます。

実測では初回assistant＋EOSが1,374／1,374／1,364token、訂正が2,330／2,333／2,339tokenです。訂正3行は既存2,048生成枠を超えます。元の測定表は`generation_budget=2048`のまま保持し、後追いの`post_check`で超過を明記しました。本文・意味・IDを短くせず、新しい有限計画の2,560生成枠／prompt上限5,632／context8,192に全6行が収まることを別に確認しています。新計画の採用と学習実行はrootの記録を参照します。

6候補の生成・Engine／reader／隔離SQL検証を実行したsourceは`provenance/generate_candidates_executed.py`です。結果内の`generator_sha256`はこの実行時sourceに対応します。現在の`generate_candidates.py`には、旧2教師との意味・本文の一致検査とcompletion上限のpostcheckを追加しました。全6候補を作り直さず、`--postcheck-existing`だけで既存行を照合し、`post_check_generator_sha256`へ後追いsourceのhashを別記しています。provenanceは学習データmanifestの`files`へ追加せず、実行sourceの所在として保持します。

候補6行のCPU成功は、4B追加学習の完了、実modelの訂正成功、未知言語品質、通常application/Auth/HTTP/RN/本人端末、商品受入れを意味しません。本文は既存の教示を維持しており、観測としての自然さ・深さの改善実績にも数えません。学習計画と未学習identityの評価はroot担当の別fileへ分離します。

## 今回の有限学習と実service評価

`plan.json`は今回のMashの継続指示へ結び付けた新しい一回計画。開始9b845adapter、新AdamW/LR5e-5、全文assistant JSON＋EOS、6行×2pass＝12更新、保存/非学習reload/FIT6生成。30分/process按分$0.13以内。`run_service_binding_fit.py`はtrain_messages6行だけを学習し、評価fixtureを読みません。optimizer/RNG未保存であり、厳密な途中再開ではありません。

`consume_fit_raw.py`は新rawを無補修で既存CMEEへ渡します。訂正FITは教材の実初回priorを使う固定入力の診断で、動的service一往復と分けます。

`eval_fixture.json`は学習に入れないuser/input identity・日時と既知本人入力/訂正文だけ。gold/priorなし。`run_service_identity_holdout.py`は実serviceが作るthread/answer ID、実初回ASKと採用済みpriorで最大2callを一度行い、訂正意味の保存直後に中断して明示再開、保存本文の非生成再読を確認します。新学習重みhashをrootが固定するまで`eval_plan.json`は実行を拒否します。15分/process按分$0.065以内、offline attempt180秒/source150秒。合成smokeは候補2・RPC30で成功済みですが、実modelの成功ではありません。

全体文脈8192、今回だけ生成2560/prompt5632、raw補修・追加更新/LR探索・自動model再call0。GPU停止/再起動/削除0、保持課金はprocess予算と別です。通常application/稼働DB/Render/DTO/RN/merge/deploy変更なし。STRUCTURE_MAP_DELTA_NONE。実結果は最新weekly§36と追記するtrialへ戻します。
