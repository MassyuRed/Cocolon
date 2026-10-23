# 現CMEEの4場面・実行結果と、モデル選定前の接続準備

2026-10-23 JST。API `3084c99e5a08d6e475d8a177e62ebf1548e8a0f9`／Cocolon `4450b15ff7d5cb21121b723b9d30d97c8e8cad7c` を照合。原入力は[比較fixture](../../model_selection/2026-10-22-three-core/task_inputs.jsonl)の既存4ID。架空入力のみ、実user本文なし。

MashはQwen3.5-9Bの従量APIと現CMEEを三中核の4場面で比べる作業へ「進めて」と指示した。現CMEE側を先に実行した。9B側はAPIキーが実行環境に未設定、ブラウザ未ログインを確認し、安全な認証フォームの依頼は中断された。認証後の状態は未確認。**9B推論・課金・チャージ0、両条件の比較は未完了。** ユーザーは続いて、モデル選定前にCMEE側の導入準備を先行できるか尋ねた。本記録はその具体的な準備先も示す。

## 1. C0の実結果

| 場面 | 正規offline入口での結果 | 確認できたこと |
|---|---|---|
| E02-0 | `GENERATED`、約8.004秒、本文あり、問いなし、`no_bound_personal_meaning_target` | 初回本文は得られた。入力の引用・反復が中心で、商品品質合格ではない |
| E02-B | `N_A_NO_ACTUAL_PENDING_QUESTION`、本文生成0 | 初回に実pendingがないため、架空の問いやcheckpointを作って回答更新を実行しない |
| P01-N | `UNAVAILABLE`、約0.006秒、`PIECE_CONTENT_UNAVAILABLE`／`saved_emotion_meaning_not_yet_supported` | 現source／意味対応の範囲で本文を作れない。元入力を書き換えて通さない |
| A02-P1 | `UNAVAILABLE`、約0.030秒、`analysis_observed_route_not_established` | 期間sourceは束縛できたが、現方式ではこの観測ルートを成立できない |

Emlis初回の実本文：

> 今は、「うれしかったけど、どこがうれしかったかはまだ曖昧」という感覚や状態が前に出ています。  
> 今の入力には、「打合せで後輩に説明を任せて、最後まで聞いた」という行動があります。

> うれしかったけど、どこがうれしかったかはまだ曖昧という気持ちを見過ごさず、受け止めています。打合せで後輩に説明を任せて、最後まで聞いたことを大切に思っています。

全outcome、意味graph／checkpoint、status／reason、時間、84source blobのidentityは[current_four_results.json](current_four_results.json)。有限な4fixtureであり、速度のp95や一般的な性能値ではない。C0の本文生成試行は3、補足はN/A。meaning checkpointの回答準備も未実行。DB・Auth service・本番APIを通さず、public runtimeや本人実機の成功とは扱わない。

準備時にsource manifestのlist/object差と、ローカル転記で加わったJSONL末尾空行の2つを修正した。いずれも本試験生成前。実行直前のfixture git blobは元の `6aaa369c9c31388325d0e1203627b355ebb87d61` と一致。実行後の自動再試行なし。

## 2. 選定を待たずに進められるCMEE側の準備

**モデル選定前に準備できる。選定・外部認証を理由に全ての接続準備を停止する必要はない。** 既存の意味・source・問い更新・三core資産を使い、以下を先行する。ここで新しい第二Engineや、モデル自身の採点で候補を採用する仕組みは作らない。

| 準備するもの | 再利用する現在の資産 | 具体的な未完了 |
|---|---|---|
| モデルへ渡す材料 | `source_kernel.freeze_text_source`、`emlis_thread_source.admit_emlis_thread`、PieceSourceSnapshot、Analysis `freeze_analysis_sources` | 原入力・別sourceの補足・適格履歴・期間・根拠locatorを、core別の許可範囲でモデル入力へ投影する。生成文を本人sourceへ逆流させない |
| モデルを差し替える薄い呼出し部分 | `MeaningExperienceEngine.generate`の既存三core入口 | 生成依頼→未採用候補・usage・終了理由・失敗を返す内部境界。モデル名／providerごとの通信詳細を意味処理や保存へ漏らさない |
| **意味候補をCMEEへ取り込む接続** | GroundedMeaningGraph、EmlisInterpretationCandidate、PieceSourceMeaning、Analysis ObservedGraph | 根拠、主体、時点、肯否、関係、不明を既存意味へどう写し、どこを採用／保留／未対応にするか。型へ入れただけで採用済みにしない |
| 本人回答による更新 | `prepare_emlis_update`→`prepare_emlis_meaning`→EmlisMeaningCheckpoint | 実pendingへの束縛と独立補足を保ち、追加／訂正／撤回のモデル候補を既存更新へ接続する。意味更新と本文生成・保存を分ける |
| 三中核への出力と失敗時の扱い | Piece plan／realizerと意味保持検査、Analysis文章／graphとsafe projection、Emlis本文 | 既存artifactへ渡す対応範囲と、空出力／上限到達／未対応時の結果を用意した候補でoffline確認する。記録保存を外部AI成功へ従属させない |

### 重要な現コードの制約

現在のEngine／GenerationRequestには、任意の外部モデル候補を受けて採用する共通引数はない。`engine.py::generate`はnative requestの三分岐、Emlisは現sourceから有限な意味planを組み立てる経路である。

`emlis_stage1_response.py::_validate_canonical_semantic_inputs`は凍結sourceから現planを再導出し、`validate_interpretation_candidate_pool`は現候補poolとの完全一致を要求する。`emlis_v1a.py::validate_positive_realization_trace`も現意味／planとの整合を扱う。**LLMのJSONを既存dataclassへ詰めるだけでは導入にならない。** 既存検査を丸ごと外すのでもなく、原入力／根拠の事実照合と、有限parserだけに依存している採用条件の責任を分けて設計する必要がある。

Pieceは`piece_v1c.generate_piece_artifact`のsource→meaning→plan→realizer、Analysisは`observed_route_realizer`のfreeze→`compile_observed_graph`→artifactが直結している。任意LLM文を既存の意味保持検査が一般的に検証できる、とは確認していない。ここがモデル選定と並行して具体化すべき接続箇所である。

### 順序と、モデル確定後に残すもの

まず可視sourceの投影、未採用候補の受取形式、意味型との対応／未対応表、問い更新と三coreへの渡し方を具体化する。固定の候補を注入したoffline試験で状態と入出力を確認し、その同じ差し込み口へ実モデルを接続する。用意した候補の試験成功は、モデルの意味理解や商品合格ではない。

モデル確定後に調整するのは、providerのAPIパラメータ、tokenizer／context、非thinking指定、生成上限・実速度・実原価など。モデル非依存の接続仕様と並行できる。実候補を読んで必要な意味が変わる場合は対応表を改め、先に作った形式へ無理に意味を押し込まない。

Piece refined未対応、Analysis補足2件以上拒否、IF／Savedのruntime未実装は別残件。モデルを選ぶだけで消えない。今回の本試験や準備を理由に、これらを接続済みへ昇格しない。

## 3. 保存物と再現範囲

- [run_current_four.py](run_current_four.py)：単一ownerの上限付きoffline実行。既存結果がある場合は自動で再実行しない。
- [emlis_binding.py](emlis_binding.py)：原入力とQ3_FREEの正規初回request。回答更新の枝は今回は未実行で、実pendingがある場合だけ使う。
- [piece_analysis_binding.py](piece_analysis_binding.py)：未変更の7fieldをPiece／Analysisの正規requestへ束縛。
- [Emlis依存一覧](emlis_source_manifest.json)・[Piece/Analysis依存一覧](piece_analysis_source_manifest.json)：API固定SHAの84file、取得blobを照合。
- [結果原本](current_four_results.json)：架空4場面の全結果。privateというfield名を含むが、実本人情報ではなくfixtureのoffline出力。

再現時は本directoryを作業コピーへ取得し、上記API固定commitの `ai/services/ai_inference/` を `api/ai/services/ai_inference/` へ配置する。元fixtureを隣接 `task_inputs.jsonl` へ同一bytesでコピーし、専用出力directoryで `python3 run_current_four.py` を実行する。生成済み結果を上書きして再現実行したように扱わない。今回のPythonは結果JSONの実版を参照し、固定環境の正式CI／System Context生成成功とはしない。

## 4. 状態

C0のfixture束縛・実行・結果取得まで完了。M1未実行、AI意味候補admission adapter／provider hookは未実装。上の接続準備は現物に基づく先行作業案で、production contract変更や既存検査の緩和を実施したものではない。

本番／DB／公開API／アプリ／課金・価格／quota／モデル重みの変更0。STRUCTURE_MAP_DELTA_NONE。限定TECHNICAL_CREDITはoffline束縛・C0基準出力取得、product_credit=0、両条件比較未完了、automatic_progression=false。
