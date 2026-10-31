# 4B：接続制約診断と、一般入力2題の非学習評価結果

日付：2026-10-26 JST。状態：**一回終了・2生成完了。追加学習0、観測品質は未達、CMEE／商品未採用。**

基準：Cocolon PR30 `bc39981585e2b12a364b2fadf64ac2f86a7bfad7`／API PR3 `4002b4577838d1ed6671278a19585b61e7ccd10e`。両Draft/open。前回joint12は意味・本文9/9、同family日常の実保存再読2/2で一回閉鎖済み。選択重みは`45779ad97111dd2d91c1f7f1a4b0ca697ef0586c5190cd56b1b7675fe540dab6`で、商品／本番へ採用していない。

## 今回、実際に確認したこと

Jupyterへ直接接続した。管理console／GPU一覧／Runpod管理APIは開いていない。前回runの終了・保存重みhash・固定API sourceの実bytesを照合した。

| CPU確認 | 実結果 | 意味すること |
|---|---|---|
| 既存native9行のsource資格 | 9/9で既存roleを導出 | 旧chair6／daily3の有限範囲を確認。意味・本文の新モデル生成ではない |
| E01-0（机の整理）／E03-0（昨日と今日の依頼） | 2/2が`UNSUPPORTED/model_repair_reuse_source_out_of_scope` | 現接続はこの2題を採用できない。モデルを呼んでいないため4Bの能力失敗へ数えない |
| 上記2題への現model prompt | 2/2でchair専用`Initial4: repair/result/joy/object ... Other grammars unsupported` | 無関係な入力にも修理・独力の喜びを要求する。現promptのままでは能力評価として不適切 |
| 原汎用prompt2件の実tokenizer | E01=487、E03=505。各2560生成枠を含め8192内、切捨て0 | 新しいraw-only試験の入力は収まる。モデル重みload／forward／生成／学習は0 |

[接続診断source](diagnose_general_boundary_cpu.py)／[実結果全文](general_boundary_cpu_result.json)。実結果22,911bytes、SHA256 `3af9a4faef1d5f147771bef96e20d912b7913181680136e6811cc9e4cd218aae`、成功診断1.875942秒。source SHA256 `9a188c160b0f5192a50a634f1c52a14d8f12b70d7bf8b311f97fcb6ae3debcf1`。

実APIの`emlis_semantic_admission.py` `_model_source_roles`／`_model_packet`は修理／再使用と食事／平穏の全文構文、role数、意味軸、関係を限定する。`emlis_ai_grounded_observation_gate.py`の独立本文検査も同familyで、`emlis_question.py`の問いはPERSONAL_JOY_SIGNIFICANCEへ限定される。引用位置を正しく出すことや同じ教材の学習回数を増やすことだけでは、この接続制約は変わらない。

診断初回はrawの`EmlisThreadInputV1`を正規化後の内部threadとして渡す誤りで中断した。実`admit_emlis_thread`を通すよう診断だけを修正し、上の11確認を得た。評価準備初回は古いhelper配置のhash不一致で、tokenizer／model効果前に停止した。GitHubと一致する既存`cocolon_4b_service_binding_legacy_reference_20261025/run_pilot.py`（SHA256 `2f659078c05bee6d7b32f50aae8b9eebc03c767d4a3be084bc17e9e3ccc4c10d`）へ合わせ、再確認した。さらに別文脈reviewで、厳密JSONを求めていない原promptへ旧helperのparse gateを課す不整合と、時間停止がlengthへ記録される点を検出した。GPU効果前に、JSON解析失敗をmetadataだけとして扱い、時間停止を別reportへ記録するよう修正し、CPU原本を再確認した。製品code／旧helper／教材／旧結果は変更していない。Download event待機は返らなかったが実file到着とbytes/hashを確認し、再downloadはしていない。

## 判断：大きな汎用実装より、まず現在の重みの実文章2件を見る

一般接続へ進むには題材固定を外す必要がある。しかし現時点でreaderを外し、引用や参照の整合だけで一般日本語の意味まで検証済みと扱うことはできない。一般候補を「意味未検証」のまま暫定保存する新profileも検討したが、候補を作る側の品質が不明なまま採用条件と複数ownerを変えるため、今回は実装しない。

**推奨は、既存の汎用試験経路を使い、保存済み45779が別題材をどう観測するかを2件だけ直接確認すること。** その実文章から、次に必要なのが教材・追加学習か、接続の一般化か、両方かを判断する。机／依頼専用regexを追加する案、現chair指示のまま2題を採点する案、さらに局所maskを反復する案は採らない。

別文脈agentのread-only意見も、汎用private版の実装より原prompt2件を先に確認する方が小さく、次の未知を直接測れるという判断だった。root華恋が実sourceを再確認して採用した。正式Pro／Ultra／human Product Readを実施したという意味ではない。

<a id="generalization-eval2-proposal"></a>
## 承認・実行済みの一回案：原汎用prompt2題、追加学習なし、最大10分

履歴のplan状態：`AUTHORIZED_ONCE`、`gpu_run_authorized=true`。一回は終了済みで再起動しない。最終状態は[実run](run/run.json)に記録。原案は[proposed plan](generalization_eval2.proposed.json)へ保全。[固定plan](generalization_eval2.plan.json)／[実行source](run_generalization_eval2.py)／[入力2件](generalization_eval2_cases.jsonl)／[CPU実tokenizer原本](generalization_eval2_cpu_preflight.json)。

1. `model_selection/2026-10-22-three-core/task_inputs.jsonl`の**E01-0／E03-0の元system＋user messagesを無変更で使用**する。chair native指示・JSON-only追加文・教師・採点guide・未来の回答は送らない。独立2familyは学習対象へ移さない。
2. 既存Qwen3.5-4B固定revision `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a`へ45779を非学習load。`is_trainable=false`、全parameterのrequires_grad=false、32adapter tensorの有限性を既存helperで確認する。新重み・optimizer・訓練stepは作らない。
3. 既存`run_pilot.evaluate`を使い、E01→E03の順で各一回、**最大2生成**。原messagesをそのままchat templateへ渡し、enable_thinking=false／do_sample=false／num_beams=1、context8192／max_new2560。actual messagesとtoken IDsを保存し、CPU原本と一致しなければ生成前に停止する。
4. tokenizer確認・モデルload・推論のGPU処理単位は**合計600秒（10分）**。最終原本保存・回収等のCPU処理は別とする。各生成にも180秒と全体残時間による停止を付ける。期限・OOM・例外・EOS未到達では終了し、追加生成／補修／別prompt／別adapter／自動retryはしない。原promptは厳密JSONを要求していないため、JSON解析失敗だけで2件目を止めず、文章も内容診断の対象とする。旧helperの非EOS="length"は維持し、別reportに時間停止の発動有無と実停止理由を残す。
5. 原raw、token列、EOS／finish reason／実停止理由、所要、base／adapter identity、入力source／runner／plan hashを回収する。既存helperがrawへ書くsemantic_profileは訓練profileのmetadataであり、現CMEEの採用を意味しない。別reportで`STANDALONE_RAW_TWO_INPUT_QUALITY_DIAGNOSIS`／`cmee_adoption=false`を固定する。
6. 華恋が2件の本文を原入力と照合し、出来事・主体・時点・否定・昨日と今日の差、不明と補完、問いの必要性、受け取りの自然さ／復唱を読む。正式Product Read、4B全般の能力上限、一般化成功、実service保存再読の成功には数えない。モデルへ使った後はE01／E03を「評価使用済み」と記録する。

**処理按分上限：$0.043334（表示約$0.0434）、記録単価$0.26/h×600秒。** 準備／回収／段間保持／保存／税等は別で、請求総額の上限ではない。GPUは稼働保持のまま、新Pod・Stop／再起動／削除・charge・管理API・依存追加・別service・本番／本人DB・Render／Supabase・公開API／DTO／RN・価格／quota・merge／deploy変更0。

この試験は**CMEEの採用経路を通さないモデル文章の診断**であり、CMEE接続完了の次の成功件数へ足さない。一般化の実装は、この結果を根拠に別途必要範囲を絞る。新しい意味採用・reader緩和を本案で承認したことにはしない。元の観測教材と現在の重みを保持する。新観測会は今回不要であり、三core全体の完成教師不足が解消したとは扱わない。

承認後は、planのstatusとgpu_run_authorizedだけを同じ案へ更新して実行し、元のproposed planを保全する。実行source／case／重み／上限を変更した案へ承認を継承しない。`source_cocolon_commit`は原材料を照合したpreimageで、新runnerが当該旧commitに存在したという意味ではない。実行時の配置commitも実行記録へ固定する。

## 開始時の記録（承認前のcheckpoint）

| 開始項目 | 今回の固定値 |
|---|---|
| product_destination | 追加学習を一般の観測品質へ結び付け、本人の話を別物にせず返す |
| current_gate_or_subgate | joint12閉鎖後の、有限教師を越える観測品質の確認 |
| exact_work | 現接続制約のCPU診断と、原汎用2題の一回評価の具体化 |
| scope_classification | 診断・可逆準備・記録は既存指示／Rule18の範囲。新有料2生成はLEVEL3・未承認 |
| approval_or_delegation_basis | 今回の続行／Jupyter直接／必要な前提差分更新指示。閉鎖joint12承認は再利用しない |
| execution_owner | root華恋のみ。Codex Work／system表示GPT-6。別agentは読取補助 |
| success_credit | 今回はBLOCKER_NARROWED。商品0、正式0/3、54.50％据置 |
| completion_condition | source制約をactualで確認し、原prompt2件・実tokenizer・非学習runner／false plan・実結果をGitHub保全 |
| stop_condition | API／重み／原材料不一致、scope拡張、未承認GPU処理、反映不明で停止 |
| prohibited_scope | 製品意味・reader・契約の変更、追加学習、閉鎖plan再起動、本番／本人row／GPU lifecycle |
| next_product_read_or_mash_decision_point | 本節の新2生成・600秒／$0.043334一回への判断。Product Readには未到達 |
| current_source_test_receipt | API4002bのmodel source／semantic admission／body gate／question、joint12原本、原task inputs、今回CPU原本 |
| current_docs_and_heads | 全体00全文・規則／恒久incident・全体01／地図01A/B/C・current00/01/04・観測目的・最新weekly§49・System Context入口。索引timeoutは保持し再生成なし |
| affected_current_structure_maps | Emlis01／CMEE04。STRUCTURE_MAP_DELTA_NONE（製品責務・接続・型・契約変更0） |

GPUモデルload／forward／生成／更新0、SQL0、通常application変更0。今回のread-only CPU結果と実行準備を、観測品質の改善完了へ換算しない。


## 10/26：Mash承認の受領、実行前checkpoint

Mashは上の一回（追加学習なし・現重み45779・別題材2件・最大600秒／処理按分約$0.0434、保持等別）に「進めていいよ。」と明示承認した。原proposed bytesを保全し、planのstatusとgpu_run_authorizedだけを変更。runner／原2messages／旧helper／adapter／上限／停止は不変。この実行前記録の時点ではモデルload／forward／生成／追加学習／SQL0、実行はroot華恋がJupyter直接で一回のみ。段階ごとの再承認を求めず、原本回収・内容診断・GitHub反映まで進める。GPU lifecycle操作は0。閉鎖joint12等の承認は流用していない。


<a id="generalization-eval2-final-result"></a>
## 最終結果：一回終了、2生成完了・観測品質は未達

承認済みsource `4f62ca363062ce95b881aa2e6a09a82549d1dc3a`からJupyter直接で一回だけ起動（PID653527）。原E01／E03のsystem＋user、token列、runner93f26cd5、旧helper2f659、base revision／45779を変更せず使用。追加学習0、非学習load後の全parameter非学習と32adapter tensor有限を確認した。

| 項目 | 実結果 |
|---|---|
| 処理 | model call開始2／完了2。各EOS、時間停止0、追加生成・retry0 |
| token | E01 input487／output102、E03 input505／output117。原messages／token IDsはCPU原本と完全一致 |
| 時間・費用 | GPU処理19.496808秒、最終記録込み19.501644秒。記録$0.26/hの処理按分約$0.00140845。準備／回収／保持／保存／税等別。600秒／$0.043334内であり請求総額ではない |
| 形式 | 両方とも指定欄付きの通常文章。helperのstrict JSON解析は2件とも失敗したが、原promptは厳密JSONを要求していないため形式失敗・能力失敗へ換算しない |
| 重み／接続 | 保存adapter全3fileは前後不変。CMEE意味／本文採用0、実service／SQL0、通常application／本番変更0 |

[実run](run/run.json)／[E01 raw全文](run/case1_raw.jsonl)／[E03 raw全文](run/case2_raw.jsonl)／[actual入力とtoken列](run/actual_inputs_and_token_ids.json)／[loaded tensor](run/loaded_adapter_finite_tensors.json)／[run manifest](run/file_manifest.json)／[起動記録](generalization_eval2_launch.json)／[原log](generalization_eval2_launch.log)／[内容診断](content_diagnosis.json)。rawは変更・補修していない。

### 本文を読んだ判断

- **E01・机の整理：** 郵便物の整理／不要な紙の処分と「机の端」が使える範囲は保った。机や部屋全体への拡大、心理原因の創作はない。同一記録の整理と使用可能の結び付きは妥当な読みとして扱う。一方、観測は「本人のメモ…の記録。」、受け取りは「利用可能になったと捉える。」で、本人に返す自然な応答より記録の報告・第三者の解説に近い。短い日常入力へ深読みや発見を必須にする指摘ではない。
- **E03・昨日と今日の依頼：** 昨日は引受け、今日は断り、安堵した差は残ったが、「断れず」「同じ頼まれごと」の具体性が落ちた。受け取りの「心理的負担が軽減され平穏を回復」は未記載の説明を加えている。負担軽減はあり得る解釈でも根拠は未確認であり、特に「回復」は以前の平穏・その喪失という未記録の状態を補う。「解釈できる」という留保だけで出典が成立するわけではない。
- 両件の問いなしは妥当。単に理由が書かれていないことを質問必須や「本人にも不明」へ変えない。

root華恋と別文脈のread-only照合で、基本出来事の一部保持、薄い／説明調の受け取り、E03の未記載説明という所見が一致した。これは正式Pro／Ultra／human Product Readではない。**2件とも商品品質の事前screenは未達**であり、本人へ合否判断を戻さない。2件から4B全般の限界・一般化成功を確定しない。

### 保全・評価区分・次の一作業

回収archive15,402bytes、SHA256 `be06bf6b6d4b807930c9beb873fdc4c923380ebb968e01f997d247d1a1c36592`。13payload＋recovery_manifestの全14memberをPod外で検証し、全payloadのbytes／SHA・source／planの差分exact2・raw本文hash・token数・32tensor有限性・前後重みを照合した。[recovery manifest](recovery_manifest.json)の`run/*`は同名directory、`source/*`は本trial rootの同名fileに対応する。既存のsource／case／authorized plan／proposed／CPU原本は重複改変しない。

E01／E03は**評価使用済み・学習転用なし**として既存split manifestを更新する。A03-SPARSEもE01と同familyのため、独立した未使用familyとは数えない。rawの説明を正解教師にしない。

今回の一回は閉鎖。再起動・追加更新・別prompt／別adapter試行は0。次の最小作業は、E01／E03を除く既存の確認済み教材と現在の汎用指示を照合し、**本人へ直接返す受け取り、時点／断れなさ等の意味保持、未記載の原因・心理的回復を補わないことを一緒に改善する共通指示／学習target案**を具体化すること。新しい有料実行の自動承認ではない。題材別regexや、引用一致だけを根拠とした一般意味の採用は行わない。

新観測会は今回の診断には不要。一般入力のCMEE採用、動的chair訂正、Piece／Analysis完成教師・品質、Windows／Mac・量子化・本人端末・本番・正式受入れは残る。今回はBLOCKER_NARROWED、商品0／正式0/3／54.50％、STRUCTURE_MAP_DELTA_NONE。GPUは稼働を保持し、管理console／GPU一覧／Runpod管理API／Stop／再起動／削除／新Pod／charge／依存追加／Render／Supabase／本人DB／公開API／DTO／RN／merge／deploy変更0。
