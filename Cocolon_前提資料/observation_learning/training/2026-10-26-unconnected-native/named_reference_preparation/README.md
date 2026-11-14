# 10/28 — 名前付き参照形式の未接続CPU確認と、一回の接続・学習案

状態：**MASH_APPROVED_ONCE_COMPLETED_NOT_ADOPTED**。最新actualは [最終結果](../named_reference_result/README.md)。[execution/README.md](execution/README.md) はGPU実行前の固定点の履歴。以下の未承認記述とnamed13.plan.jsonは起案時の凍結記録で、新planはexecution/へ分離した。

起案時状態：**PREPARED_AWAITING_MASH_CONTRACT_APPROVAL**。新形式は未採用、API未変更、GPU追加学習・生成0。今回の継続依頼で、既存資料・全体設計/全file地図・最新weekly§85・現物raw/教師/学習codeを確認し、Jupyterへ直接接続して可逆な候補とCPU確認を作成した。実装・CPU・条件付き一回のGPUを一つの判断範囲として提案する。承認後に範囲内の実装詳細やhash固定だけで再承認を求めない。

## なぜこの案か

直前のaligned13はBOOK/SHOP回答後の意味・本文0/2。BOOKは引用object反復で3712token打切り、SHOPはJSON成立後も根拠範囲外で、必要7/8更新に対し各1しか生成しなかった。原rawの拒否は妥当。学習codeのprompt mask・assistant/EOS・shift・入力一致を静的照合し、明白なloss計算bugは見つからなかった。対象のlossはなお高く、これだけで4Bの能力限界とは結論しない。

長いpacket内の配列番号による根拠・更新参照を、モデル自身が出す名前への参照に置き換える。元source/priorの長いidentityは出力内の明示表へ一度出し、参照側はその表の名前を使う。正しい根拠・意味・問い・本人への本文・全ADD/GAPを作る責任は4Bに残す。数値位置の暗記負担を減らす仮説であり、成功は未実証。同じ失敗条件の13更新や時間延長だけを再試行する案ではない。現不具合の解消に新観測会は不要。未知の題材・一般理解・三中核の教材と商品品質は別途残る。

## 今回実際に行ったCPU確認

固定sourceはCocolon `ec8454553dca56e7a95771fa9b044eb89396f802`、API `64c6cb1a41620fd2d7690e0b6f1af30ae0e624a4`。実helperのgitblob `16ed4678dd3b2d3067ff2e86043308399c45248b`一致を確認。Pod94a06hhxu51uy4のJupyter/terminalでCPUだけを使用した。既存source/凍結15教師/重みは不変、CUDA未初期化、model load/forward/追加学習/生成/SQLは各0。

- 最終v3はexit0、CPU15.120060921秒。15教材を投影・復元し、**元のteacher raw文字列への完全一致15/15**、その復元rawを未変更CMEEへ渡した意味snapshot・本文を含む結果の一致15/15。ほか13教材のprompt/targetは不変。これは教師の可逆性確認であり、named実rawの正式受領・新metadata/receipt再導出・保存再開・新4B品質の成功ではない。
- 未定義/重複quote名、数値/boolean参照、quote欠欄、未定義/重複/欠落update名、未知key、未定義/未使用identity alias、重複JSON key、途中JSON、非有限値の14クラスを拒否。GAP更新とその本文参照を削ると自動補完せず、従来readerは `HOLD/model_v3_explanation_updates_not_bound`。
- v1の検査失敗は復元rawへ末尾LFを余分に足し、receipt identityまで比較した検査側の誤り。元文字列を正確に戻して修正。v2は冗長な候補教示でcontext超過。v3でidentity表と重複教示削減を試し、教師の入力＋正解系列は8192内。失敗code/log/exitもarchiveに保持し、失敗を合格へ書き換えない。

| 回答後教材 | 旧→新prompt | 旧→新target | 新全系列 | 元3712出力枠 | 提案出力上限 |
|---|---:|---:|---:|---|---:|
| BOOK（17引用/7更新） | 4201→4421 | 3178→2913 | 7334 | 8133で収まる | 3712 |
| SHOP（18引用/8更新） | 4365→4585 | 3561→3238 | 7823 | 8297で超過 | 3584 |

targetは265/323token（約8.34/9.07％）短縮するが、promptは各220増えるため全系列の短縮は45/103tokenだけ。速度向上や600秒内完走の証明ではない。SHOPは4585＋3584＝8169で余裕23token。最終実装messagesを実tokenizerで再確認し、超過時は切捨てや黙った上限変更をせずGPU前に終了する。

## 新private wireの具体案と既存契約への差分

形式は `cocolon.cmee.named_reference_candidate.v1`、root exact `v,a,q,c`。完全なkey対応は [wire_spec.json](wire_spec.json)、完全な投影例と候補messagesは [candidate_targets.json](candidate_targets.json)、未接続のstrict encoder/decoderは [named_reference_candidate.py](named_reference_candidate.py)。canonical teacherは置換しない。

- `a` はモデルが実source/prior identity文字列を明示する表。`q` は元と同順の完全引用、各要素に一意な `id` とsource alias `s`・欄 `f`・引用 `t` を出す。実identity/原文はdecoderが外部から供給しない。未知/未使用aliasを拒否する。
- `c` は元candidateの可逆なkey略記。`ev` はモデルが出したq.idの配列、各updateの `$id` は一意、本文の `ur` はモデルが出したupdate名の配列。claim/relation/unknownの実ID・意味値・順・操作・問い・本文はモデル出力のまま。decoderは実配列からnative数値索引を導出するだけで、欠けたclaim/ADD/GAP/根拠/本文を作らない。
- これは既存quote契約の「candidate本体・evidence_indexes・更新を変えない」という**wireでの表現の範囲を変更する案**。native意味・順・bindingは同値を要求する。旧承認を流用しない。新実rawを修正して旧receiverへ渡すsidecar実装にはしない。
- 新形式は明示の `candidate_format` 選択だけ。自動検出・旧形式へのfallbackなし。Emlisの明示offline/free answer後、既存source由来V3判定でBOOK/SHOP説明回答の契約が成立する範囲だけとする。rawの自己申告family/stageは資格の証拠にしない。初回4件・旧9・通常application・Piece/Analysisへ広げない。

## 承認後の最小変更pathと責務

API基点は上記API64。新外部service/依存/endpoint/汎用frameworkは追加しない。

| API `ai/services/ai_inference/cocolon_meaning_experience_engine/` 以下 | 変更責務 |
|---|---|
| `named_reference_wire.py`（新規） | 今回のstrict構文変換をprivate業務部品へ移す。正しい意味を推定・補完しない |
| `preparation.py` | `receive_candidate`の明示新format分岐。actualrawのstrict parse→名前解決→既存quote位置compile→既存native検証。新metadataだけにformatを束縛。旧引数/旧receipt bytesは維持 |
| `model_candidate_source.py` | offline明示formatと矛盾しない教示/shape。新形式期待時の別形式rawは保持して拒否し、再call/自動fallbackなし。原文・metadata/control/prior・意味義務は保持 |
| `emlis_semantic_admission.py` | 既存source由来V3契約がBOOK/SHOP説明回答であることを新formatにだけ要求。`_receipt`は新format metadataを用い同じ保存actualrawから同じnative/receiptを再導出。意味reader/本文readerの採否条件は不変 |

preparationはPreparedRequestを扱うため、意味ownerのsource-derived family判定をimportしない。semantic owner→preparationの向きは維持し、循環importを作らない。raw familyラベルに頼る実装にも置き換えない。`CandidateReceipt.raw_output`は実際のnamed rawそのもの。`candidate_json`だけnativeへ変換し、初期statusはCANDIDATE_UNREVIEWED。新形式metadataを欠かした/改ざんした再導出を拒否し、finish reasonのtimeout/length/provider error優先を維持、decoderの不正はINVALID_FORMATへ閉じる。

検証pathは既存 `ai/tests/test_cmee_preparation.py`、`ai/tests/test_cmee_model_candidate_source.py`、`ai/tests/test_cmee_quote_candidate.py`、新 `ai/tests/test_cmee_named_reference_candidate.py` と専用fixtureだけ。旧肯定/否定assertや凍結fixtureは変えない。Cocolon側は本準備dirの `prepare_named13.py`・`run_named13.py`・`consume_named13.py`、新plan/source manifestと実結果dir `../named_reference_result/` を追加予定。既存helper/loss/閉鎖runnerは変更・再起動しない。関連正本・map・最新weeklyを同じcheckpointで差分更新する。

## GPU前に完了させるCPU検証

旧prompt/receipt/snapshotのbytesと意味/本文/問い/更新の回帰、新actualrawのstrict受領・同actualrawからのreceipt再導出・全native binding、raw/native/format偽造拒否を確認する。上記14拒否、quote不一致/重複/overlap/source/field不一致、scalar/絵文字/結合文字/改行、unknown finish/timeout優先、新形式の旧default/別core/初回/非適格sourceへの混入を含む。source family/stage資格は実sourceから検証し、raw自己申告では通さない。

合成15教師の意味・本文・問い・全7/8更新は元と同値、新形式の実rawから保存snapshotへ進み同形式で非生成再読/意味保存後中断から同snapshot再開できることを、既存の隔離されたCPU保存検証で確認する。旧新wire間はraw/metadata/receipt identityが異なるので全snapshot bytesの同一性を装わず、native意味/binding/本文/問い/更新で比較する。それぞれの同一actualrawの再導出は完全一致を要求する。実service/本人DB/SQL・ネットワーク保存へは進まない。

凍結15教師のbytes不変、BOOK/SHOP回答後2件だけの新投影、ほか13prompt/target不変、実tokenizer/context/EOSとprompt mask、最終source/初期d431/112F32一致を確認。失敗ならGPU前で終了し、実装を合格と呼ばない。

## 同じ一回の判断範囲に含めるGPU試験

[named13.plan.json](named13.plan.json) は**未承認の上限案**。GPU実行可能な承認済みplanではなく、`gpu_run_authorized=false`。上記CPUが成立し、Mashが本scopeを明示承認した場合だけ、API実装commit/最終messages/runner等のhashを固定して一回実行する。

- 同Pod94a06hhxu51uy4/A5000。開始重みは原d431a07c/112F32。前回失敗候補c7baから継続しない。固定base/tokenizer/LoRA設定を維持し、optimizer途中再開ではなく新AdamW/LR1e-5/decay0/clip1/seed20261024。旧9は元CE、新2は既存adaptive loss extra15/gamma2、全assistant＋EOS、prompt除外。
- 旧9各1＋named BOOK/SHOP回答後各2＝13更新、別pathへ保存、112tensor完全一致/no-grad reload後BOOK/SHOP各1生成だけ。before0、after最大2call、各180秒、context8192、BOOK3712/SHOP3584。温度0の既存方式、decode後補修・追加生成・再試行なし。
- 学習・保存・再読込・2生成の総計600秒以内（timeout590＋kill10）。記録単価$0.28/hで処理按分最大$0.047。準備/CPU/回収/継続保持/保存/通信/税等は別で、請求総額ではない。完走保証なし。上限延長だけの追加試行なし。
- actualrawをそのまま新receiverへ通し、意味と本人向け本文、全ADD/GAP・参照/関係・留保・主客/時点を2件全文確認。採用snapshotがあれば新形式の同じrawから隔離cold-file再読一致を確認する。採用0ならcold対象なしとして記録。原d431・新重み・失敗raw/logを保存してPod外へ回収照合する。
- CPU不一致、source/hash/context超過、OOM/非有限、期限/長さ/意味/本文不採用で終了。旧reader緩和、意味補完、LR/回数探索、failure再callなし。GPUはStop/restart/deleteせず稼働保持、管理API0。

成功条件はこの既知2件で、無補修の実モデル出力が全意味・本人向け本文・7/8更新を保持してCMEEへ受理され、保存再読が一致すること。失敗しても結果/重みを保全し通常不採用、次試験へ自動進行しない。旧9の学習は旧9回帰検証ではない。新初回4件/全15の新GPU評価、実初回出力からの動的thread、未知一般化、実service/SQL/本人端末、他core・商品受入れは本試験の成功へ合算しない。

## 判断と保全

Rule18§11.3 LEVEL_3の「contract…追加、変更…」に該当するため、この新形式の接続実装と新GPU一回はMash判断前に実行しない。行わない場合は本未接続CPU候補で止まり、追加学習済み接続の成功には進めない。root華恋が調査/実行/書込みowner、別文脈agent2枠はread-only照合。独立Pro/Ultra・人手商品受入れとは呼ばない。未採用案について技術的な致命的不整合は見つからず、本人への意味・本文を変えずに参照生成の負担を減らす限定試験として推奨する。通常app/API/DTO/DB/RN/Render/Supabase/公開/merge/deploy変更はscope外。

今回の原本 `cpu_runtime_originals.zip` は111,139bytes、SHA256 `76b33aa960c9f485a498daee48edb928286d6f3125495aaf03713d1f78096f46`、4payload＋manifest/5member。中の `cpu_feasibility_originals.zip` は115,489bytes、SHA256 `f5afdbad83539b30abbb98dbe9788f6d5ed1fa38c2417eb9adc3d71ba64921ac`、13payload＋manifest/14member。全CRC・全member hash/size、source同一性、hostとPodの最終2code bytes、exit0をPod外照合。最終log/exit/GPU状態とv1/v2失敗履歴を含む。CPU-only終了時GPUはA5000/1MiB、GPU lifecycle操作0。

現在のモデル品質は直前の意味/本文0/2のまま。新形式未採用、product_credit=0、candidate_ready=false、automatic_progression=false、正式0/3・全体54.50％据置。STRUCTURE_MAP_DELTA_NONE（本段階は候補code/資料のみ、製品構造/受信契約は未変更）。
