# 現CMEEの4場面・実行結果と、モデル選定前の接続準備

最新追記：[承認済み限定Emlis snapshotの実装/実行P3](#p3)。C0/P1/P2原結果は過去時点のまま保持する。

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

<a id="p1"></a>

## 5. P1内部準備 — 実装・4場面20receipt・境界検証

2026-10-23 JST。Mashの今回の内部準備指示を実施した。開始原本はAPI PR3 `3084c99e5a08d6e475d8a177e62ebf1548e8a0f9`／Cocolon PR30 `482a32a2c5c76631249f02a5abd11840d913ca58`。本変更を含むcommitが最終実装版であり、旧C0固定版とは分ける。

- API packageの`preparation.py`は共通凍結request・Emlis材料・未採用receipt、`preparation_sources.py`はPiece/Analysis材料。現Engine／guard／public DTO／serviceへ接続せず、意味生成を材料の前提にしない。
- [preparation_results.json](preparation_results.json)に全4材料と各5状態、計20receipt、既存84＋新2source blobを保存。新候補はすべてNOT_ADOPTED、正常も意味の主張がない固定標本。モデルの意味候補生成／admission成功ではない。
- 原7fieldはそのまま、memoとmemo_actionを分離。E02-BはSUPPLEMENTAL_PROBE（実回答更新N/A）。Pieceはmemo→空行→memo_actionのview、Analysisは3記録と凍結期間を保持。
- C0のcurrent_four_results.json、元fixture・messages・既存84source blobは変更なし。C0再生成0。既存runnerはdefault C0を保持し、明示prepare-onlyを追加した。

| fixture | source数 | 5状態すべてで保持すること |
|---|---:|---|
| E02-0 | 1 | 原入力／実control。初回へ未来補足を混ぜない |
| E02-B | 2 | 本人補足を別probeとして保持、架空pendingを作らない |
| P01-N | 1 | 現意味未対応でも元7fieldを保持、本人の声の採用は未実装 |
| A02-P1 | 3 | 凍結期間・3記録のID/版/根拠。graph採用は未実装 |

各fixtureは CANDIDATE_UNREVIEWED／EMPTY／INVALID_FORMAT／TIMEOUT／TOKEN_LIMIT の5結果。終了理由を候補parseより優先する。request ID／引用位置が一致しても意味・自然さ・Safetyを保証しない。未提供のmodel/revision/usage/時間はnull。固定timeout応答を実時間・実API障害の検証へ換算しない。

独立担当21件・最終補正後に主担当が確認したstdlib unittest **22件成功／失敗0／skip0**（Python 3.12.14／Clang 22.1.3）。18件成功後に不足していたnative回答source／履歴の陽性を追加し、21件へ拡張した。18／21／22と重複加算しない。最終レビューで終了済みcontrolの残数を0とする補正と回帰testを追加し、22件の最終runを主担当が確認した。初読レビューでtask欠落と指数overflowを検出し最終run前に修復。深い凍結、他request参照拒否、quote/範囲/source混入、native実質問からの補足、Plus/Premium履歴、Free拒否、Piece元source、Analysis半開期間と複数補足拒否を確認。実Auth資格・回答後意味更新・本文品質・正式全suiteの合格ではない。

実際のtestコマンド（cwd=mashos-api）：

```bash
PYTHONPATH=ai/services/ai_inference python -B -m unittest discover -s ai/tests -p test_cmee_preparation.py -v
```

同環境のPython実版を実行記録と照合済み。

再現コマンド（repositoryを同じ親directoryへ取得した場合）：

```bash
python Cocolon/Cocolon_前提資料/observation_learning/trials/2026-10-23-current-four/run_current_four.py --prepare-only --api-root mashos-api --output /tmp/cmee-p1-replay.json
```

結果pathが既存なら上書きせず停止する。今回実行は同じ引数でoutputをこのdirectoryの`preparation_results.json`とした。再現は必要な場合だけ明示して行い、保存結果の再読を新規実行へ数えない。

採用責任の案とP2の残りは[共有設計01](../../../designs/cmee/v1/01_shared_kernel_and_runtime_contracts.md)末尾。P1は完了、次はclaim／既存意味型と有限parser一致検査の具体差分表。意味admission／既存Engine hook／実モデル接続／推論／DB／配置／課金0。STRUCTURE_MAP_DELTA_PRESENTは未接続内部準備のみ、限定TECHNICAL_CREDIT、product_credit=0、automatic_progression=false。

P1最終補正：stop済みの実controlは残質問枠0とし、回帰testを追加。21件の独立検証後、主担当の最終22件は全成功（0.116秒）。source変更後の明示stub再実行は別pathで一度行い、全4材料と20receiptが初回と同一であることを照合して最終source blobへ更新した。実stub runは計2、重複除外した最終scenarioは20。初回結果digest・source blob・実行履歴をpreparation_results.jsonへ保持。C0再実行は0。

API実装commit：[b7eb534](https://github.com/MassyuRed/mashos-api/commit/b7eb534d44658549896baf449e7c319d49d14396)。新規2module＋testの3pathだけを変更。Cocolonの記録はこの節を含むrevisionから解決する。

<a id="p2"></a>

## 6. P2：候補要素・既存意味型・検査の対応

2026-10-23 JST。MashのP2継続指示で実施。**設計対応表は完了、実意味admissionは未実装。** 既存設計[01](../../../designs/cmee/v1/01_shared_kernel_and_runtime_contracts.md#cmee-p2)／[02](../../../designs/cmee/v1/02_emlis_v1a_detailed_design.md#cmee-p2-emlis)／[03](../../../designs/cmee/v1/03_piece_v1c_detailed_design.md#cmee-p2-piece)／[04](../../../designs/cmee/v1/04_analysis_v1d_v1e_detailed_design.md#cmee-p2-analysis)／[05](../../../designs/cmee/v1/05_json_schema_and_versioning.md#cmee-p2-schema)へ反映した。新しい生成Engine・admission checkerは作っていない。

[semantic_mapping_inspection.json](semantic_mapping_inspection.json)には手作業設計4例、28claim、60個の原文quote、実P1 receipt4件、26native dataclassの全field一覧、9関数のAST位置とsource blobを保存。proposalの根拠index・関係端点・quote範囲を照合した。全receiptはCANDIDATE_UNREVIEWED／NOT_ADOPTED。これは候補意味やP2 schemaのruntime合格、native graph構築、実更新、本文生成ではない。P1材料・C0・M1 fixture/messagesは不変。

| 例 | 設計上の扱いと具体的な差 |
|---|---|
| E02-0 | HOLD。元の2行動・嬉しさ・対象不明を分ける。nucleus/component/qualifierまでの対応が必要 |
| E02-B | 実pending無しの更新はUNSUPPORTED/N_A。理由否定を感情否定にせず、否定された理由内の内容をfactへ昇格しない。元行動／不明を保持 |
| P01-N | 現Piece meaning profileではUNSUPPORTED。一般主体／報告／否定scope／未来条件と既存選択感情の被覆を、有限再導出・原文replayへ詰めるだけでは通らない |
| A02-P1 | 型fieldの部分対応はあるがHOLD。UnknownGapの対象／根拠、行動に付く軽い負荷、safe label再導出・保存validatorが未対応 |

これらは手作業の設計分類で、新runtimeの判定結果ではない。predicate argumentsは代表的な原格に根拠を付けたもので、全節の日本語解析を完成した例ではない。省略主体・絶対時点を補完せず、現nativeで表せないscopeを自由な文字列で通さない。

原文range・型field・実関数名を分担照合し、主担当が統合。独立レビューで、①E02主節と従属節の主体混同、②E02の委任行動／元不明欠落、③理由否定の二重scope、④P01の所有者→主語の誤変換、⑤A02希望の未実現断定、⑥購入結果と負荷の留保欠落、⑦非行動内容と時制の混同、を修正した。sourceの引用が正しくても意味候補が誤り得る具体例として扱い、quote検査の万能性を主張しない。

API/P1code・guard・protected testの変更0。今回pytest／unittest追加・再実行0（P1最終22件は過去の成立結果として保持）。実行したのはP1受取と参照／型field／関数所在の一時的なinspection（例の作成・修正に3回実行、最終snapshotだけを保存）で、C0生成／外部推論／重み／DB／RN／配置／課金0。inspection結果の最終snapshotのみをdistinct evidenceとして数え、作成途中の例・照合を成功数に加算しない。

現在の具体的blockerは、source境界ではなく、新しい意味を現finite再導出へ依存せず採用・plan・問い・本文／graph・保存へ通す版付き責任が未実装であること。次は設計01末尾の限定実admission変更案。P2で旧guardを無効化しない。STRUCTURE_MAP_DELTA_NONE、primary=BLOCKER_NARROWED、product_credit=0、automatic_progression=false。

<a id="p3"></a>
## 7. 承認済み限定Emlis snapshotの内部実装・実行

Mashが限定実装へ「進めていいよ」と明示承認。API原本b7eb534／Cocolon原本fcdfe2から、既存Engine・更新・thread作者・serviceへ新規Emlisの明示offline profileを接続した。[実装01](../../../designs/cmee/v1/01_shared_kernel_and_runtime_contracts.md#cmee-p3-implemented)／[実型05](../../../designs/cmee/v1/05_json_schema_and_versioning.md#cmee-p3-actual-schema)を参照。P1/P2/C0原結果は変更せず、[semantic_snapshot_results.json](semantic_snapshot_results.json)へ今回の実出力・source blob・検証結果を保存した。手作業候補であり、モデル出力ではない。

| 今回の実検査 | 結果・限界 |
|---|---|
| 初回/実pending ADD/REVISE/非focus WITHDRAW | 既存作者で本文と問いを生成、主体/時点/肯否/未変更素材・撤回を確認。原sourceを旧parserで再解釈させない |
| 新25test＋既存P1 22test | 47 passed、fail/skip0、21.63秒。34 subTestは上乗せしない |
| 旧Q2/Q3 application同54test | 未変更HEAD 54 passed 79.13秒／変更後54 passed 80.70秒。fail/skip0、既存warnings2。保存/RPCは隔離PGliteで実行 |
| 新25に含む保存/再開 | RECEIVED保存後・MEANING_UPDATE保存後・本文保存時の中断から再取得せず復旧。STARTEDのみ中断は明示retryでHOLD確定、attemptを残さない。Premium実continue三回答と第三回答わからないも確認 |
| 旧Q1/Q3広範囲 | 多くの失敗で打切り。先頭Q1のreception期待113行だけ旧b7eb534でも再現、残りは未分類/未解消。全suite合格ではない |
| P2 E02-0既存receipt一度 | UNSUPPORTED: semantic_unknown_or_conflict_not_projectable。unknown/actionsを落として採用しない。本文生成なし |
| E02-B / P01-N / A02-P1 | E02-Bは実pendingなしN/A、Piece/Analysisは範囲外で今回admission未実行。成功数に含めない |

最終対象は重複除外101成功で、合成本文採取や反復実行を加点しない。途中レビューで主体/unused evidence/累積ABOUT/無更新base ref/無更新再開検証に加え、時制の不一致、通常service mutation、重複claim、取得未完了retryを修復した。通常readerのcan_write=falseを反映する前の新testはDTO比較1件失敗し、明示offline再開設定を検査へ正しく与えて最終成功。protected旧期待値は変更0。Python/depsは既存CI版をscratchへ用意し実import READY後に対象試験、製品依存変更0。実SQLは既存Q2/Q3 migrations/RPC、実Supabaseではない。

本文は意味軸の限定到達に留まる。REVISEの「その時はあの時も本当は嬉しかった」、WITHDRAW後の「その時にその時は寂しかった」のような時点語重複が実出力に残る。自然な受容や一般理解、正式Product Readに合格したとは扱わない。程度/「帰宅しても」等は原文slice保持で、一般条件の構造化理解ではない。新profile履歴消費も未対応。次は残る意味要素のnative対応を具体化し、E02-0の不明/行動と本文品質、Piece/Analysisの既存未対応へ戻る。モデル接続や通常有効化を自動開始しない。

実モデル/推論/重み/追加学習/課金/実DB/Render/公開API/DTO/RN/merge/deploy、C0再実行は0。STRUCTURE_MAP_DELTA_PRESENT、限定TECHNICAL_CREDIT、product_credit=0／PRODUCT_NOT_CLEAR／正式0/3／candidate_ready=false／automatic_progression=false。

## 8. adapter2の時点範囲修復と具体的な次案

時点反復には新adapterの時点込みlexical範囲が直接寄与していた。同じ既存作者の旧parserは分離しており、「作者だけの残件」という説明を訂正。FRESHだけadapter2、保存1/2は全original/prior/current plan/問い/再開を各版で再現。裸時点語/はだけを分離し、も/程度/本当は/否定/全raw claimを保持した。

| 実例 | 修正前Receptionの一部 | 修正後 |
|---|---|---|
| ADD 今は嬉しい | 回答した時点では今は嬉しいのですね。 | 回答した時点では嬉しいのですね。 |
| WITHDRAW併存 その時は寂しかった | その時にその時は寂しかったことを小さくせずに… | その時の寂しさを小さくせずに… |
| REVISE あの時も本当は嬉しかった | その時はあの時も本当は嬉しかったのですね。 | もを削らず同範囲を維持。反復残件 |

全原文/前後Observation・Reception/新版snapshot・artifact/source blobはsemantic_snapshot_results.jsonのadapter_v2_correction。未変更e5ca453から修正前に実採取した3系列の旧snapshot/全outcomeはAPIの新fixture cmee_emlis_semantic_adapter_v1.json。旧全outcome再現3、新出力3、旧pending混在1、別時点/否定/程度/今も3を元25へ加え、最終35 passed/FAIL0/SKIP0、21.49秒。隔離SQL保存/中断/Premium三回答も同対象内。反復実行/採取を加点しない。P1/旧application/旧広範囲は再実行0で、既存失敗は未解消のまま。

E02-0は依然UNSUPPORTED。本人不明のstatement/joy対象/二時点、同span二actionの一意対応、原格/省略主体/te節とconcession、listenの句点によるfield/native範囲差を[具体的追加案](../../../designs/cmee/v1/01_shared_kernel_and_runtime_contracts.md#cmee-targeted-unknown-action-proposal)へ保存。未実装であり、E02-Bの架空pendingやJOY_ASPECT新問は含めない。次案の静的照合を試験成功へ換算しない。

source修復はemlis_semantic_admission.pyだけ。作者/共有型/通常service/公開API/DTO/RN/実DB/Render/モデル/課金/merge/deploy0、新runner/checkerなし。STRUCTURE_MAP_DELTA_NONE、限定TECHNICAL_CREDIT、商品0/正式0/3/candidate_ready=false/automatic_progression=false。
