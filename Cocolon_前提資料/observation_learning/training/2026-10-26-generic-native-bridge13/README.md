# 4B：既存generic1行とnative9行の形式差を埋める一候補

2026-10-26 JST。承認済み一回を13更新・保存非学習reload・11生成・全原本回収まで完了。native意味／本文8/9、genericの受け取り品質未達により新候補は不採用・閉鎖。旧45779を保持する。

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
## 承認・実行済み一回案：13更新→保存・再読込→最大11生成

[plan](bridge13.plan.json)／[runner](run_bridge13.py)。原falseは[proposed](bridge13.proposed.json)へ保全し、承認済みplanで一回実行を完了した。現在は[runtime checkpoint](runtime_checkpoint.json)のCLOSEDで、同planを再起動しない。

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


## 10/26：Mash承認・実行前checkpoint

Mashは0e105dd3の具体案「13更新→保存・再読込→11件確認、最大30分／処理按分$0.13（保持等別）」へ「進めていいよ。」と明示承認した。原planをbridge13.proposed.jsonへ無変更で保存し、現planはstatus／gpu_run_authorized／approval_basisの3fieldだけ承認状態へ更新。runner f54645b2、45779、原10教師／11入力、旧helper2種、更新順／LR／loss／上限／停止は不変。root華恋一人がJupyter直接で一回起動し、原本回収・native9の既存CPU consumer・全11本文診断・重み保全・GitHub反映と読戻しまで完了する。段階ごとの再承認は不要。新model／学習／生成／SQLはこのcheckpoint時点0、旧試行承認再使用0。上段の未承認は準備時点の履歴で、現authorityは本節と現plan。


## 実行中checkpoint：13更新・保存再読込完了、11生成は進行中

承認source f9d248eeからPID677527を一回起動。456.221秒の実読取時点で13更新完了、非学習reload済み、native3生成完了／4開始。全11採否は未判定。新c39bbc27追加重みの先行archive3,401,608bytes／SHA50dbc67cfd2ccc7f33c83969715194e8b83c02c0fb87f4748a37013808b1f75cは全6member／5payloadと32F32有限をPod外照合し保全済み。先行原本は生成0で、最終結果とは分ける。[重み照合](early_weights_verification.json)／[同process再開先](runtime_checkpoint.json)。旧45779／原教材／helper／API／reader不変。次は同PIDの残りを読み、全11原本を回収してnative9 CPU採否・全本文診断を完了する。再起動・追加試行・段階ごとの再承認なし。


<a id="bridge13-final-result"></a>
## 最終結果：一回完了、新候補不採用・閉鎖

承認source f9d248ee／PID677527を一回起動。13更新・保存・非学習reload・native9＋generic2の全11生成を999.271011秒（16分39秒）で完了。全11EOS、追加生成／再試行0。旧45779全3file、新保存adapter全3file、runner／payload／helperの前後不変を確認した。新重みc39bbc27は保存候補として保全し、採用しない。

| 項目 | 実結果 |
|---|---|
| 処理按分 | 記録$0.26/hで約$0.07216957（約$0.07217）。準備／回収／継続保持／保存／税等別。1800秒／$0.13内、請求総額ではない |
| メモリ | peak allocated16.171696／reserved19.085938GiB。終了後A4500／20,470MiB／使用1MiB、稼働保持 |
| native形式 | 全9strict JSON／EOS正常、candidate objectは全9教師一致。packet全文は8/9一致、既存CMEE意味／本文8/9。chair初回3件はASK、訂正2件は各3更新＋問いなし、日常3件は問いなし。残る訂正1件は根拠段階で拒否 |
| generic形式 | UDON／E05各1生成、原指示／原sourceのまま。両方欄付き文章。原指示はstrict JSON必須ではないので解析失敗は内容失敗へ加算しない |
| CPU採否 | 固定API4002b clean／既存consumer4ce53119／既存Python3.12＋pydantic2.11.7で10.497444秒（child10.650576秒）。新model／DB／SQL0、raw不変 |

### nativeの退行：本文案だけでは採用できない

TRAIN-SERVICE-CHAIR-03-CORRECTION（case6）は、claims／relations／本文案／訂正3更新が教師と一致する一方、根拠表が12→9行に減った。訂正宣言・「一人でできたからではなく」・理由全文の3行が欠落し、友人の手順quoteは25:74（正25:38）、共同修理quoteは39:88（正39:47）となった。残存candidateの9／10／11参照は9行配列外で、静的には8箇所。既存receiptはINVALID_EVIDENCEで拒否し、意味採用・本文生成へ未到達。これを微小な表示差や本文reader失敗とは呼ばない。残8packetは凍結教師と全文一致。前45779のnative9/9から今回8/9へ退行した。

### genericの前後本文

| 入力 | 旧45779の実baselineから変わった点 | 未達・判断 |
|---|---|---|
| UDON | 本人が述べたという説明と余計な「その後に」を除き、短くなった | 新Receptionは「帰ってから自分でうどんを作り、食べたことによる平穏と微かな喜びの体験。」という説明のまま。自然な本人向け受け取りに未到達。温かいもの／うどんの同一化や因果への寄せも残る。おにぎり／身体状態創作は今回はないが、比較元旧baselineにもなく、bridgeによる解消とは数えない |
| E05 | 現在の「出たい気持ち」を保持した局所改善 | 「申し込めてうれしかった」を「大会への参加を喜び」へ変え、取消を迷う対象も落ちた。Reception「本人の心情と、今日改めて日程を確認したという事実のみが可視。」は処理報告。「昨日の大会」の修飾は曖昧だが、昨日開催／参加済みと確定断言した、とまでは記録しない |

両genericの問いなしは妥当。前値は前pair4の旧版case1／case2原本を再利用し、新before生成0。新指示版との比較を混ぜない。全11本文はroot華恋が読解し、別文脈read-only reviewerも原本で独立確認した。正式Pro／Ultra／human Product Readではない。

### 原本・保存・終了

[実run](run/run.json)／[13更新](run/training.jsonl)／run/case1_raw.jsonl〜case11_raw.jsonl／[native9原raw](run/after_native_fit.jsonl)／[loaded32tensor](run/reloaded_tensors.json)／[run manifest](run/file_manifest.json)／[起動記録](runtime/bridge13_launch.json)・原log／[CPU起動](runtime/consumer_launch.json)。[consumer index](run/consumer.index.json)と24partsは原1,500,491bytesを区切りなし順連結で完全復元する。generic2件はconsumerへ渡していない。[全本文・差分・判断](content_diagnosis.json)にraw全文を保つ。

完了archive3,631,419bytes／SHA256 654e2737ee90bd9a4f1bdf3d6514ef06705a353aca3f96142d76ee46e0eea320。37payload＋manifestの全38memberをPod外でbytes/hash照合し、全11rawの本文hash／token数／EOS、native結合raw、CPU consumer原本、全source、保存旧新3fileを検証。新重みは生成前の早期保全archiveと全3file一致、32F32有限も維持。[回収manifest](recovery_manifest.json)／[回収照合](recovery_verification.json)／[早期重み照合](early_weights_verification.json)。manifestのrun/*は同名runへ、source/*は当時Pod上sourceへ対応する。現READMEは追補済みで当時source/READMEとは別、旧CPU manifestが指すfalse planはbridge13.proposed.jsonへ対応する。重みsafetensorsは早期保全先に保持し、GitHubのrun manifestから同hashへ戻る。

起動・学習・11生成・consumerは各一回、早期／完了archive downloadも各一回。事前の非必須FastAPI照会は未導入だったが、実consumerに不要であり、実モジュールimportとconsumerは既存runtimeで成功。依存追加0。読取用ファイル名照会／local文書組立ての構文不備はモデル効果なしで補正し、新学習や生成の再実行へ転用していない。

**新候補不採用で、この一回を閉鎖する。** 旧45779と既存CMEE採用条件を保持する。形式差が唯一の原因だったとも、すべてのmixed学習が不可能とも結論しない。generic1行4回＋native9保持というこの配分では、自然な受け取りの学習とnative根拠保持を両立できなかった。次は有料試行を追加せず、既存の出所付き完成受け取り／教示と両interfaceの対応、言語2題だけという範囲をCPUで再検討する。局所mask／LR／更新数探索、同要求再call、raw補修、reader緩和へ自動進行しない。

今回の基本欠陥に新観測会は不要。自然な完成応答・修正実演、Piece／Analysis完成教師、独立した未知評価と本人端末の不足は残る。primary BLOCKER_NARROWED、商品0／正式0/3／54.50％、STRUCTURE_MAP_DELTA_NONE。新service／SQL／通常application／公開API／DTO／DB／RN／Render／Supabase／本人DB／merge／deploy変更0。GPU稼働保持、管理console／GPU一覧／管理API／Stop／再起動／削除／新Pod／charge0。
