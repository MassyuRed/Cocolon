# Emlis Free：初回・一回答後の完成応答案による小規模学習準備

2026-10-24 JST／華恋／Codex Work Mode。状態：**MashのA40で学習前6回答→9教材1epoch／9step→学習後6回答まで完了し、受領原本を照合。十分な品質改善は確認できず、商品採用・P6統合は未成立。結果は[実行記録と全件診断](../../trials/2026-10-24-qwen9b-free-lora/README.md)。**

Mashの「で？どないすんの、これ。」を受け、既承認の教材整形・不足の補充として作成した。次の観測会をMashへ依頼する代わりに、今回の入力への観測・人間的な受け取り・任意一問・一回答後の更新が揃う応答案を華恋が作る。原18候補・教示5参照・原対話は変更しない。取り下げた読書会の題材は使わない。

## 1. 学ばせる範囲を先に固定する

[全体現在地](../../../00_cocolon_current_product_and_state.md)と[Emlis詳細設計Q3](../../../designs/cmee/v1/02_emlis_v1a_detailed_design.md)のFree仕様に対応する。

| 軸 | この試験で扱うもの |
|---|---|
| 機能・plan | EmlisAI／Free |
| 今回の入力 | 思考memo・行動memo_action・感情選択と強さ・カテゴリ |
| 許可する本人source | 今回の原入力と、同じthreadで実際に問われた一点への回答 |
| 履歴・frame | 使用しない |
| 問い | 初回は0〜1。今回の一問へ回答した後は残数0で問いなし |
| 本文 | 観測とEmlisからの受け取りを区別し、入力固有の感情・関係を自然に返す |
| 更新 | 本人の補足・訂正が変える対象だけを変え、残る行動・感情・不明を保つ |

三中核を育てる既決方針のうち、最初の試験対象をこの範囲へ絞ったもの。Plusの履歴・Premiumのframe、Pieceの独立文章、Analysisの期間理解・図・比較、IF/Savedは、この試験の成功から完成扱いしない。

## 2. 成果物

| file | 内容と用途 |
|---|---|
| sft_examples.jsonl | 出典・由来・制限付きの教師案9行。今回の華恋編集7、華恋の架空補充2。全て未学習・未承認 |
| train_messages.jsonl | 同じ9行のmessagesだけを抽出した学習入力候補。原18件を一緒に連結しない |
| eval_inputs.jsonl | 学習に使わない6題材の入力。モデルへ渡すのは各行のmessagesだけ |
| eval_review.jsonl | 6入力の意味・自然さの確認点。モデルprompt・学習データへ含めない。唯一の模範文は置かない |
| experiment.json | 対象範囲・件数・固定モデル・実装した学習設定・未確認・比較条件・実行状態 |
| runpod.sh | 固定commitの教材取得、既存Torchを維持する別venv、prepare／runの入口、run処理の時間制限 |
| run_pilot.py | 教材照合・CPU token／label確認、学習前6回答・9教材1epoch・学習後6回答、adapterとraw保存 |
| test_tokenization.py | 実Transformersと固定tokenizerによるCPU回帰検証。旧型不整合の再現、9教材のloss範囲と終端、6評価のcontext確認。重み取得なし |
| diagnose_learning.py | 保存した初回adapterを非学習で読み、9教師へのNLLと同9promptの生成をbaseと対比較する一回の診断。学習・元adapter変更なし |

出力は[既存モデル比較](../../model_selection/2026-10-22-three-core/task_inputs.jsonl)のEmlis用6欄（observation／reception／question／update_note／grounded_points／unknowns）を使う。これは比較試験のtask cardへの投影であり、公開API／DTO／実CMEEの新schema・意味採用・保存成功ではない。本文をアプリへ配置していない。

## 3. 9件の構成と由来

| 教師案 | 可視範囲 | 問い |
|---|---|---|
| うどん・初回 | 第3回D04だけ | なし |
| 本返却・初回 | 第4回D00だけ | Mash D01の一問を組み込む |
| 本返却・一回答後 | 第4回D00／D01／D02だけ | 残数0 |
| 椅子・初回 | 第6回D00だけ | Mash D01の一問を組み込む |
| 椅子・訂正回答後 | 第6回D00／D01／D02だけ | 残数0 |
| 開店・初回 | 第5回D00だけ | Mash D01の一問を組み込む |
| 開店・一回答後 | 第5回D00／D01／D02だけ | 残数0 |
| 植え替え・初回 | 既存の華恋補充をもとに今回設定した4入力field | なし |
| 編み物・初回 | 同上。面倒さとさみしさの関係は不明のまま | なし |

初回6件の内訳は問いあり3・なし3。一回答後3件は全て問いなし。六つの教材familyであり、同じ場面の初回と回答後を独立題材へ加算しない。7編集のsourceは原文Git blob／D番号／scalar引用へ戻れる。今回作った観測・受け取り・6欄への編集を、Mashの完成した実演へ昇格しない。

本返却・開店は二問目以降の情報を使わない。椅子の初回はその時点の本人説明を受け取り、後の訂正を先読みしない。訂正後だけ共同修理と再使用できる喜びへ変える。初回・回答後を一組の教師例として構成したことと、その完成文をMashが実際に返したことは別である。

二つの基本補充では、選択感情・強さ・カテゴリを今回の作者が設定した。その追加fieldを明示し、過去の実ユーザー入力やMashの選択へ遡及しない。

原18候補は問い等の部分課題を含む参照素材で、本pack9件は同じ原典を使う別の編集。独立27教材とは数えない。品質承認・データ量の十分性は未成立。

## 4. 比較すること

学習に使わない六つの新しい題材を固定した。発表後の喜びの有無の不明、散歩を引き返した理由の否定、本人が先生へ説明した主体、写真削除の数量訂正、今回入力内の二時点と迷い、付け足すことのない日常記録を扱う。

作者は入力と確認点を読んでいる。盲検の最終評価や統計的な一般化の証明ではない。既存20評価fixture・M1原出力・既存の未使用候補は変更しない。M1とは入力が異なり、その4応答との直接勝敗にはしない。

同じ固定モデル・同じ6入力・同じ非thinking／温度0等で学習前後を比較し、rawを別保存する。JSON形だけで合格にせず、理由の創作・主体反転・否定／不明／時点の欠落・訂正の復活が減ったか、受け取りが自然かを全本文で読む。学習した9件の再現だけ、定型句の増加だけでは成功にしない。

## 5. 実装した限定学習設定

同じ `Qwen/Qwen3.5-9B@c202236235762e1c871ad0ccb60c8ee5ba337b9a` を、`Qwen3_5ForConditionalGeneration` で読み込む。BF16、テキストのself_attn q_proj／v_proj計16moduleだけへのPEFT LoRA（r8／alpha16／dropout0／biasなし）。vision・embedding・lm_head・MTPとその他のbase重みは凍結する。batch1、学習率1e-4、weight decay0、checkpointing、cacheなし、1epoch＝9step。保存はadapterだけ。未検証のGPU設定を、既に完走した設定とは扱わない。

最終assistantだけにlossを掛ける。promptとfullのtoken prefixが一致することを確認し、system・user・過去の問いは-100とする。paddingは使用しない。2048tokenを超える教材や、評価prompt＋1024出力枠が2048を超える場合は切り捨てず中止する。学習前後ともTransformersの同じgreedy生成経路・固定template・非thinking・最大1024tokenを使う。vLLMとの生成経路差を学習効果へ混ぜない。

直接依存はtransformers 5.19.0／peft 0.21.2／accelerate 1.15.0／safetensors 0.8.0。前回の `/workspace/cocolon9b/.venv` があれば、そのTorch／CUDA環境を再利用し、今回の別venvへ上記4packageを入れる。親venvのsite-packagesを明示して既存Torchの差し替えを防ぎ、解決済みpackage一覧を保存する。既存HF cacheを検索し、固定checkpointの重複ダウンロードを避ける。Qwen3.5の任意高速kernelを新たに導入する手順にはしていないため、fallbackの速度・VRAMは実GPUで未確認。

## 6. Runpodでの2段階の実行

以下は再現用の手順記録。今回の実行は完了済みで、新たにprepare／runを行う指示ではない。

A40 48GBのPodのJupyterLab Terminalで実行する想定。まずこのfolderの `runpod.sh` を固定commitのraw URLから `/workspace/cocolon_pilot.sh` へ取得し、同じcommitを環境変数 `COCOLON_SOURCE_COMMIT` に指定して `bash /workspace/cocolon_pilot.sh prepare` を実行する。会話で渡すコマンドには実commit SHAを埋める。branch追従のlatest取得にはしない。

prepareは4教材fileのSHA256／件数／Freeの可視範囲・問い残数／評価family分離、固定config・重みindexの16対象、importと4package版、固定tokenizerでのprefix・loss範囲・token数を確認する。モデル重みのダウンロード・modelのGPU配置・推論・学習は行わない。CPU確認でもPodが起動していれば通常の課金は続く。

`準備確認OK（モデル重み・GPU学習はまだ読み込んでいません）` が出た後、次の1行で進める。

```bash
bash /workspace/cocolon_pilot.sh run
```

runは同じprepare確認を繰り返し、CUDA／BF16・全40GiB以上かつ空き32GiB以上を確認してから、**学習前6回答 → 9教材を1epoch → 学習後6回答**を実行する。既存vLLM等を勝手に終了せず、VRAM不足やmodule差異・非有限lossで中止する。自動再試行・予算拡張はしない。

run処理はmodel取得も含め3600秒で終了要求、さらに30秒で強制終了する。この制限にはprepareのinstall時間・Pod全体の稼働時間を含まない。**Podは自動Stopされないため、完了・失敗・時間切れのいずれでもMashがRunpod管理画面でStopする。** A40実VRAM・所要時間・現在単価・合計費用は未測定／未照会。以前の$0.59/hを現在価格や完走費用の保証へ流用しない。

作業先は `/workspace/cocolon_emlis_free_20261024`。prepare結果は `preflight.json`、package一覧は `resolved-packages.txt`。各runは固有の `results/<UTC日時>-<ID>/` へ `run.json`・`before.jsonl`・`after.jsonl`・`training.jsonl`・`adapter/` を保存する。成功時に入力・学習前後raw・学習log・実行metadataをまとめた `pilot_results.json` と、取得しやすい `/workspace/cocolon_emlis_free_20261024/latest_results.json` を作る。JSON解析失敗を自動修正せず、そのまま残す。失敗時は途中までの個別rawとrun.jsonを確認する。実行完了は品質合格を意味しない。

## 7. 今回実際に検証した範囲

ローカルではPython構文・bash構文、実教材のhash／9件・6件、loss maskの境界・prefix不一致・空target・超過・教材改変時の停止、JSON未修正、16module限定を確認した。別venvから親venvを参照できることと、子venvのpackageが優先することを小さな実venvで確認した。

Mashから受領したTerminal全文では、直接4packageのinstallとTorch 2.8.0+cu128維持は成功し、config／index・tokenizer読込後の最初の教材で `ValueError: prompt/fullのtoken prefix不一致` となった。原因はTransformers 5.19.0の `apply_chat_template` が標準でBatchEncodingを返すのに、華恋のrunnerがtoken列と取り違えたこと。前回の別窓のvLLM終了とは無関係。HF_TOKEN未設定のwarningを停止原因にしない。受領log SHA256は `ede6ced95f6a35519d5e0e0081f692010577f733c6c111eba7878b0481ca7b72`。この失敗までに推論・学習は開始していない。

修正では4呼出しを `chat_token_ids` へ統一し、`return_dict=False`／`return_tensors=None`／`truncation=False`／非thinkingを明示。一次元の空でないint列を確認する。prefix検査、teacher／eval全行、chat templateと学習条件は変更しない。

ローカルの隔離venvへ実Transformers 5.19.0／tokenizers 0.23.3を導入し、固定revisionの実tokenizerで3回帰testが成功（7.291秒）。旧既定のBatchEncodingで誤比較を再現し、input_idsそのもののprefixは一致することを確認した。修正後は9件全てprompt側label=-100、教師側が最終JSON＋im_end／改行だけ、全長495〜785token／loss67〜172token。6評価promptは421〜540tokenで、出力1024を足しても最大1564、2048枠以内。詳細のID別token数はexperiment.jsonに保存。

今回のローカル検証にTorch／PEFTやmodel重みは不要。モデルクラスのローカル実import・GPU読込・学習・完走は未検証で、Runpodの修正版prepareもまだ再実行していない。この修正時点の状態は **TOKENIZATION_FIXED_CPU_VALIDATED_RUNPOD_RETRY_PENDING** だった。後続の完了は下記§8に区別する。9件・1回で追加学習全体の可否やCocolonの商品品質を断定しない。

修正時点では、同じ `/workspace/cocolon_pilot.sh` に修正commitをCOCOLON_SOURCE_COMMITで渡し、prepare後にrunする再開手順を案内した。その後の完了は下記§8に記録する。前回のAIサーバーの再起動は不要だった。

公式原典：
- [Transformers 5.19.0 apply_chat_templateの既定return_dict=True](https://github.com/huggingface/transformers/blob/v5.19.0/src/transformers/tokenization_utils_base.py)
- [Qwen3.5モデルクラス・テキスト利用・kernel注意](https://huggingface.co/docs/transformers/en/model_doc/qwen3_5)
- [固定checkpointのconfig](https://huggingface.co/Qwen/Qwen3.5-9B/blob/c202236235762e1c871ad0ccb60c8ee5ba337b9a/config.json)
- [固定checkpointの重みindex](https://huggingface.co/Qwen/Qwen3.5-9B/blob/c202236235762e1c871ad0ccb60c8ee5ba337b9a/model.safetensors.index.json)
- [PEFT LoRA](https://huggingface.co/docs/peft/en/package_reference/lora)
- [固定chat template](https://huggingface.co/Qwen/Qwen3.5-9B/blob/c202236235762e1c871ad0ccb60c8ee5ba337b9a/chat_template.jinja)
- [Transformers 5.19.0](https://pypi.org/project/transformers/5.19.0/)・[PEFT 0.21.2](https://pypi.org/project/peft/0.21.2/)・[Accelerate 1.15.0](https://pypi.org/project/accelerate/1.15.0/)・[Safetensors 0.8.0](https://pypi.org/project/safetensors/0.8.0/)

華恋環境からのGPU起動・追加推論・実学習・DB・Render・API/RN・merge/deployは0。MashのPodでは上記prepare試行があり、稼働分の課金総額は未確認。実モデルの新規応答はまだ取得していない。STRUCTURE_MAP_DELTA_NONE：offline比較用の実験scriptのみでruntime owner・型・接続・商品契約の変更なし。

## 8. 今回の実行結果（2026-10-24）

MashのRunpod A40で修正版prepare後、6回答→9step→同6回答が完了。[受領原本・全本文診断](../../trials/2026-10-24-qwen9b-free-lora/README.md)へ保存。runner／4dataset hashとeval_requests完全一致、9教材各1回・loss全有限・前後6ID／token長一致・全12EOSで上限到達0。run記録上72.533秒、PyTorch peak allocated19.939GiBであり、Pod全稼働・総課金・全VRAMの測定ではない。

E06の乾燥完了補完は解消、E05の現在の出たい気持ちは明瞭になった。一方E01の承認断定・根拠のない二択、E02の順序／理由誤りと不安の追加、E03の未記載の交流への問いなどが残る／悪化。E04の主要訂正は学習前から保持されていた。今回の限定条件で十分な品質改善は確認できない。

全12rawはJSON解析失敗だが、task_instructionもJSONのみを明示せず欄名だけを指定していた。モデルの明示JSON命令違反とは評価しない。試験側の指示／検査不整合として次の具体案に残す。教師・評価・template・runnerを結果受領時に変更していない。

状態EXECUTION_COMPLETE_NOT_QUALITY_ACCEPTED、fine_tuning_performed=true。adapter本体は受領しておらず、保存hashの報告のみ。保管・独立再loadと今回のPod Stop完了、総費用は未確認。追加推論・追加学習を自動で行わない。前節の未実施記載は当該準備・修正時点の履歴であり、現在の未実施へ戻さない。CMEE通常接続・P6統合・他core・商品受入れは未成立。

## 9. 次の一手：既存9教師への適合を、保存adapterで確認する

Mashの「次は？」を受け、教師を増やす／epoch等を変える前に、初回adapterが既存教師へどう効いたかを確認する。初回は学習外6場面の前後だけを生成しており、教えた9件への生成・同一教師の前後NLLは未計測だった。9stepのlossは題材も途中の重みも違うため、その代用にはならない。

`diagnose_learning.py` は初回runnerのSHA256、原結果SHA256、同じrun内のadapter3fileのSHA256と4datasetを照合する。別adapterや単に最新のfolderを使わず、一致する保存本体がなければ再学習せず中止する。既存cacheのみ・追加packageなしで、初回の固定モデル／package／prompt／非thinking・greedy・出力1024を維持する。

比較は以下に固定する。

- 同じ9教師・同じ最終assistantだけのmaskでbase／adapterのNLLを各9回、計18forward。例別と教師token数による加重平均を保存する。
- 同じ9promptでbase／adapterの回答を各9件、計18回答。生成へ教師completionを渡さない。文面完全一致ではなく、主体・理由・不明・残す事実・失効した内容・問い／END・自然な受け取りを読む。
- base測定後に同じbaseへ保存adapterをis_trainable=Falseで読み、active adapter／対象16module／32有限tensor／全parameter凍結を確認する。終了後も元adapterのhashが不変か確認する。

既存9件への適合と再現の診断であり、学習外への一般化・商品品質・観測技術獲得の証明ではない。NLLが下がっただけで意味理解が良くなったとは判断しない。応答まで改善するが学習外6件では崩れる場合、次は教材の範囲と転移を検討する。NLL／応答がほぼ変わらない場合も、まずadapterの適用・有効化と条件を確認し、直ちに学習量不足／学習失敗へ断定しない。結果を見ず自動で教師追加・再学習へ進まない。

JSON明示指示はこの診断へ混ぜない。初回と同じpromptで比べ、必要なら後にbase／adapterの両側へ同じ明示を加える別比較にする。学習外6件を教材化する場合、未使用評価と再称しない。

Runpodでは固定commitの本scriptを `/workspace/cocolon_emlis_free_20261024/diagnose_learning.py` へ取得し、既存 `venv/bin/python` で実行する。会話のコマンドに実commitを埋める。外側のtimeoutは900秒＋kill猶予30秒。これはPod全稼働時間／課金上限や自動Stopではなく、完了・失敗・時間切れ後にMashがPodをStopする。モデルcacheがなければdownloadせず止まる。

結果は固有の `diagnostics/<UTC日時>-<ID>/` と `/workspace/cocolon_emlis_free_20261024/latest_diagnosis.json`。初回latest_results.json／元adapter／教師・評価は上書きしない。

準備時に実施した検証：構文、生成9promptに教師回答が入らないこと、NLL加重式と異常値停止、保存run選択・adapter欠損／改変時停止、実固定tokenizerで9prompt＋1024が最大1637で2048以内。PEFT0.21.2公式from_pretrainedのis_trainable=Falseを参照。Torch／PEFT／GPUでのこの診断scriptの実動作・完走は未検証。状態DIAGNOSTIC_PREPARED_NOT_RUN。追加学習・追加GPU実行はこの準備作業で行っていない。
