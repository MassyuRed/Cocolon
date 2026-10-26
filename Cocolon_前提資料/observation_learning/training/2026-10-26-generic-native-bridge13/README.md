# 4B：既存generic1行とnative9行の形式差を埋める一候補

2026-10-26 JST。Jupyter実CPU準備・原本回収照合まで完了。新GPU実行は未承認・未実行。旧共通指示4callは閉鎖済み、不採用を維持する。

## 確認した原因候補

原本Cocolon `6ed2f7b67f24acc9c5c8ace5cddeb677ff493a56`、API `4002b4577838d1ed6671278a19585b61e7ccd10e`。全体00、恒久incident、作業規則、全体設計01／全file地図01A、三core入口／CMEE map、最新weekly§49〜51、観測学習目的を確認した。System Contextは既知索引timeoutのためfresh原本を直接読む。root華恋／Codex Work／GPT-6が統合・実行・GitHub反映owner。別文脈agentの読取レビューは正式Pro／Ultra／human受入れではない。

generic FT-UDONとnative daily3では、memo／memo_action／カテゴリ／感情・強さ、お手本の観測文と受け取り文が同じ。一方、system・user envelope・ID／日時・出力wireが異なる。genericはsource_bundleから6欄を返し、nativeは意味候補・引用／参照・関係と本文案を返す。最新joint12の9教師にはgeneric形式が含まれない。前回pair4旧版のsystem/userは原generic教師のsystem/userに完全一致する。

したがって、学習／評価のinterface差は直接確認できた改善対象である。ただし、これが説明調や補完の唯一の原因と証明されたわけではない。前回の指示改善を反復せず、同じ本人sourceと既存targetを、使っていなかったgeneric形式でも一度学ぶ候補にする。

- [元教師と出所](generic_teacher_provenance.json)：華恋編集、架空の本人source。Mashの完成応答・商品承認goldへ格上げしない。
- [差の実比較](source_comparison.json)／[原本hashと所在](source_manifest.json)。旧9教師・評価・raw・重み・製品sourceを変更しない。
- [学習10行](bridge_train_messages.jsonl)：native9を無変更で複製し、generic FT-UDON1行を原messages／targetのまま加える。言語題材は椅子とうどんの2題のまま。
- [評価11入力](bridge_eval_inputs.jsonl)：native9＋generic UDON＋既読EFREE-E05。E05は学習しない。E01／E03／A03・失敗raw・撤回読書会も教師にしない。

今回の基本欠陥への対処には新観測会不要。自然な受け取り・修正実演・Piece／Analysis完成教師・独立した未知評価の不足は残る。

<a id="bridge13-proposal"></a>
## 新しい一回案：13更新→保存・再読込→最大11生成

[plan](bridge13.plan.json)／[runner](run_bridge13.py)。GPU実行flagはfalse。

1. 現保存45779と固定Qwen3.5-4B revision851bf6e8から新optimizerで開始。途中optimizer再開とはしない。既存32LoRAだけ、LR5e-5／seed20261024／clip1／batch1。
2. native9各1回＋generic1行4回＝13更新。順序はgeneric→chair3→generic→chair3→generic→daily3→genericで固定。generic／chairは全文assistant＋EOS、native dailyは既存jointの0.5全文＋0.5観測・受け取り25tokenを維持。4回やこの配分が最適とは未実証。探索しない。
3. 別directoryへ保存し、全32tensor有限・非学習で再読込。元adapter全3fileと新保存adapterの生成前後不変を確認する。
4. native9を各1回、generic UDON／E05を各1回、最大11生成。旧版45779のgeneric前値は前pair4の実rawを再利用し、before生成は0。旧rawは新生成へ加算しない。モデル入力は各system/userのみで、assistant教師は推論へ渡さない。新版共通指示は不採用のまま、全genericは原指示を使う。
5. native9だけを既存consume_quote_fit_raw.py／固定APIへ通し、意味・本文9/9、chair初回ASK／訂正3更新／daily ENDを確認。generic6欄をnative schemaへ変換したり採用検査を緩めたりしない。実service／SQL0。
6. 華恋が全11rawを本文として読み、UDONの食べ物・程度・本人向け受け取り・身体状態や目的の創作、E05の出たい意向・取消の迷い・昨日今日の時点を旧rawと比較する。JSON成功／target完全一致／NLLを内容成功へ換算しない。UDONの改善は既知FIT、native9も言語2題の保持で、未知一般化・商品採用ではない。
7. 期限・OOM・非有限・source／重み不一致・非EOSで停止。raw補修・再call・追加更新・LR探索・reader緩和・次候補への自動進行をしない。結果と重みを回収・保全して一回を閉じる。

**最大30分・処理按分$0.13**（記録$0.26/h）。準備・回収・継続保持・保存・税等は別で、請求総額の上限ではない。context8192／最大出力2560／1生成180秒。既存GPUを稼働保持し、管理console／GPU一覧／Runpod管理API／Stop／再起動／削除／新Pod／chargeは操作しない。

1800秒はtokenizer再照合・モデル読込・更新・保存再読込・生成の処理上限で、finallyの最終hash／archive・回収を含むOS process全体の厳密な強制終了保証ではない。既存evaluateがgeneric rawへ付けるsemantic_profileはhelperの固定metadataであり、genericの意味採用資格を与えない。

## Jupyter CPU実結果と回収

配置source `c0b14d700237d01b0b955ec66c1c46cc5604cf26`。既存PodのJupyterへ直接接続し、固定8sourceを取得、CUDA_VISIBLE_DEVICES空／offline cacheの実tokenizerで10教師／11評価入力を一回確認した。CPU child exit0、stderr空。追加依存・モデル重み読込・forward・更新・生成・SQL0。

| 項目 | 実結果 |
|---|---|
| native9最大 | prompt5045／assistant＋EOS2339／全文7378、context8192内、切捨て0 |
| generic UDON | prompt428／assistant＋EOS67／全文495。前pair4旧版prompt428と同じ |
| 全教師 | promptはloss対象外、assistant全文＋EOS保持。native daily3は既存連続surface各25tokenも保持 |
| 評価 | native9＋generic2の11入力。system/userのみ、教師混入なし、最大出力2560の枠を全件確保 |
| 出所・固定 | 旧generic target・native9messages無変更、現45779全3file identity確認、依存4pinと旧helper／joint helper hash一致 |
| 有限CPU拒否確認 | update数・call数・LR・初期重み・期限の変更、および未承認executeを6条件で拒否。モデル処理0 |
| GPUの読取 | A4500／20,470MiB／使用1MiB、稼働保持。管理API／一覧／console／lifecycle操作0 |

[CPU原本](bridge13_cpu_preflight.json) SHA256 `2774f535aa6106716bd2c0d5ddf9940235dd5a2f6b1c3b010a5d618091326c99`、[起動記録](cpu_launch.json)、[回収manifest](cpu_recovery_manifest.json)、[Pod外照合](cpu_recovery_verification.json)。archive72,210bytes／SHA256 `8c7f4e7cd0ffb6b291e912787c47785a073b5eb87437136bc94ce94a754ae564`、10payload＋manifestの全11memberを照合し、source8fileは配置commitの全bytesと一致した。archive内READMEはCPU前の配置原本であり、現在の追補後READMEと同一hashとは扱わない。download一回、CPU実行一回、再学習／旧plan再起動0。

読取reviewで旧新adapterの不変確認がstatusへ反映されない点を修正してからrunnerを固定し、実CPUを行った。旧新hash不一致・確認不能はSTOPへ変える。13更新の効きは未測定で、CPU成功をモデル品質へ加算しない。次は上記新しい一回案へのMash判断だけ。

## 作業開始・終了条件

current未完了は、native既知2題の採用成立後もgeneric入力が第三者向け解説・補完へ崩れる点。既存sourceとtargetのinterface差を最小修正する準備であり、新管理systemや品質Gateを増やさない。可逆な新pack・CPU準備・GitHub保存はMashの続行指示とRule18§11.3の既存delegation内。新GPU13更新／11生成は個別判断前で、旧4call承認を再利用しない。

準備完了条件は、原source／target無変更・評価混入0・実tokenizerで切捨て0・元重み不変を確認し、CPU原本とsourceをGitHub読み戻しすること。新GPU実行判断が次の一点。商品Product Readには到達しない。STRUCTURE_MAP_DELTA_NONE：製品責務・型・契約・source採用・作者・reader・API／DB／RN接続不変。商品0／正式受入れ0/3／全体管理54.50％を維持する。Render／Supabase／本人DB・通常application・merge／deploy変更0。
