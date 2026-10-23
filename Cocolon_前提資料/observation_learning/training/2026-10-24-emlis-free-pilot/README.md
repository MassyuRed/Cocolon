# Emlis Free：初回・一回答後の完成応答案による小規模学習準備

2026-10-24 JST／華恋／Codex Work Mode。状態：**教師案9件・比較入力6件を準備。モデル実行・学習は未実施。実行手順とtoken／VRAM・費用の確認は未完。**

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
| experiment.json | 対象範囲・件数・固定モデル・学習方法案・未確認・比較条件・実行状態 |

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

## 5. 学習方法案と、実行前に残る作業

同じ `Qwen/Qwen3.5-9B@c202236235762e1c871ad0ccb60c8ee5ba337b9a` へのLoRAを候補とする。固定configのrootは `Qwen3_5ForConditionalGeneration`。テキストのみのrequestを使い、vision・埋め込み・lm_headを凍結し、実際のtext language_model内の対象moduleを確認してadapterだけを学習する案。genericなQwen3 causal classへ置き換えない。r8／alpha16／batch1／checkpointing／最大1epochは今回の提案で、実検証済みの実行設定ではない。

最終assistantだけにlossを掛け、system・user・過去の問い・paddingを対象から外す。固定tokenizerとchat templateで全9件・評価6件のtoken数、prompt/fullのprefix一致、label範囲をCPU上で確認する。長い例を無断で切らない。

次に華恋が行う作業は、そのCPU確認、依存version・実moduleとkernelの固定、同条件の学習前後比較手順、GPU利用の上限時間／金額と停止担当を具体化すること。**現時点では実行手順を検証できておらず、GPUを起動する段階ではない。** A40 48GBのVRAM・実時間・現在の料金は未測定／未照会。以前の画面単価$0.59/hを現在価格や完走費用の保証へ流用しない。追加学習の効果は未確認で、9件・1回で不可能／実用を断定しない。

公式原典：
- [Qwen3.5モデルクラス・テキスト利用・kernel注意](https://huggingface.co/docs/transformers/en/model_doc/qwen3_5)
- [固定checkpointのconfig](https://huggingface.co/Qwen/Qwen3.5-9B/blob/c202236235762e1c871ad0ccb60c8ee5ba337b9a/config.json)
- [PEFT LoRA](https://huggingface.co/docs/peft/en/package_reference/lora)
- [SFTとcompletionの学習範囲](https://huggingface.co/docs/trl/en/sft_trainer)
- [固定chat template](https://huggingface.co/Qwen/Qwen3.5-9B/blob/c202236235762e1c871ad0ccb60c8ee5ba337b9a/chat_template.jinja)

GPU起動・追加推論・実学習・課金・DB・Render・API/RN・merge/deployは0。実モデルはまだ一応答も取得していない。STRUCTURE_MAP_DELTA_NONE：教材資料のみでruntime owner・型・接続・商品契約の変更なし。
