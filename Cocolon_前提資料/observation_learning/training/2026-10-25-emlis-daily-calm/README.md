# 日常の食事と落ち着き — 次の意味対応・学習候補

状態：**Mash承認済み／API実装・CPU確認済み／GPU学習前**。2026-10-25 JST。

## 今回確定した障害

既知chairの実service保存再読成功（weekly§36）は保持する。次の別場面へ進む際、現在の `emlis_model_proposal.v1` は修理・再使用の構文familyしか採用しないことを現sourceと一回のCPU呼出しで確認した。

- `emlis_semantic_admission.py::_model_source_roles` がrepair/result/solo/joyを全文照合する。
- `model_candidate_source.py::OUTPUT_SPEC.meaning` も同じ4/6claim構成を指定し、`Other grammars unsupported` と明記する。
- `emlis_ai_grounded_observation_gate.py::evaluate_emlis_model_surface_inverse` はrepair/usable_again等の専用roleと文章を読む。
- 元4Bpackの `dataset_manifest.json.unsupported_old_teachers` でも、うどん等の旧7教師は範囲外である。

したがって、学習回数だけを増やしたり旧9教師を再投入しても、現在の採用境界のまま日常場面がCMEEへ通るとは見込めない。今回の問題は教材がないこととは別である。

`probe_current_profile.py` をAPI **95d00b907f6d9c42944666269acc457c9af34f37** に対して一回実行。原対話のscalar引用一致、既存教師不変、draftの根拠8行とsource3fileの前後hash一致を確認した。実 `prepare_model_snapshot` は **UNSUPPORTED / model_repair_reuse_source_out_of_scope**。model呼出し・学習・GPU・SQL・製品source変更は各0。候補全体の将来の採用妥当性を、この先頭scope拒否だけで検証済みとは扱わない。原結果は `current_profile_diagnostic.json`。

## 対象の原教材と本文

既存 `FT-UDON-INITIAL`、出典 `OBS-20261022-002 / D04`。架空人物の比較用入力で、教師は **KAREN_EDIT_OF_EXISTING_RECORD**。Mashの完成応答・品質承認済み正解ではない。旧teacherを上書きせず、新しいnative対応案へ出典を付ける。原文・offset・packetは `source_mapping_candidate.json` に保存する。

同JSONの `original.created_at=2026-10-25T10:00:00Z` と `is_secret=false` はAPI入力を作るために足した**診断fixture用metadata**であり、原対話D04の日時・本人設定を確認した事実ではない。本文/感情/カテゴリは既存教師の原情報で、出典の逐語引用とfixture補助値を区別する。

| 欄 | 原文／既存教師 |
|---|---|
| 思考内容 | あったかいもの食べたら、ちょっと落ち着いた。 |
| 行動内容 | 帰ってから、うどんを作って食べた。 |
| 選択 | 平穏medium・喜びweak、生活 |
| 観測の教師 | 帰ってから、うどんを作って食べたのですね。 |
| 受け取りの教師 | あったかいものを食べて、少し落ち着けてよかったです。 |
| 問い／更新 | null／null |

短い日常記録をその密度で受け取る最小縦断であり、深い構造理解・一般自由文・三中核の商品完成を証明する試験ではない。今回のための新しい観測会は不要。

## 意味・根拠の具体案

Unicodeの半開区間。各claimはOMITTED主体・ASSERTED_AS_WRITTEN・記載された過去の未特定機会。現在や絶対日時へ変換しない。

| role | kind | field・範囲 | 原文 |
|---|---|---|---|
| return | EVENT | memo_action[0:3] | 帰って |
| cook | EVENT | memo_action[6:13] | うどんを作って |
| eat | EVENT | memo_action[13:16] | 食べた |
| warm_food_eat | EVENT | memo[0:10] | あったかいもの食べた |
| slight_calm | STATE | memo[12:21] | ちょっと落ち着いた |

関係は次の4本。KARA/TARAは**新しいprivate値の提案**で、既存対応済みのenumへ偽装しない。公開request/responseの追加ではない。

| 向き | proposed type | 根拠・作用域 |
|---|---|---|
| return→cook | SOURCE_WRITTEN_TEMPORAL_KARA_LINK | action[0:16]。「帰ってから」が調理へ係る |
| return→eat | SOURCE_WRITTEN_TEMPORAL_KARA_LINK | 同じaction[0:16]。食事にも係る。evidence行を重複しない |
| cook→eat | SOURCE_WRITTEN_TE_LINK | action[10:16]「作って食べた」。teの接続を保存 |
| warm_food_eat→slight_calm | SOURCE_WRITTEN_TARA_LINK | memo[0:21]の連結全節。書かれた結び付きだけを保持 |

「ちょっと」をclaim/predicateの原文に残し、本文の「少し」と対応させる。TARAを一般的な原因・目的・医学的効果・将来条件へ強めない。二つの欄の食事を勝手に同一claimへまとめず、温かいもの＝うどんのidentity edgeを作らない。空腹・美味しさ・温まった・落ち着きたかった・人格は補わない。平穏/喜びの選択と強さは元metadataのまま保持し、喜びの本文claimを新作しない。

observationのbindingはreturn/cook/eatと行動関係3本。receptionはwarm_food_eat/slight_calmとTARA。「よかった」はEmlisの反応とし、本人の新しい評価や理由にしない。unknowns/conflicts/updatesは空、question_proposal/update_noteはnull。理由を聞くためのgapは作らず、既存null→ENDを利用する。

## 承認済みの最小実装

既存offline profileの採用範囲を、修理familyに加えてこの**初回・食事＋少し落ち着いた**familyへ広げる。Free・当回・回答0・履歴0に限定する。一般unknown、訂正/撤回、Plus/Premium、Piece/Analysisへ同時展開しない。修理物の名詞差だけを別の言語familyと呼ばない。

今回認める構文は、行動欄の「帰ってから、(うどん|雑炊)を作って食べた。」、思考欄の「(あったかいもの|温かいもの)(を)?食べたら、(ちょっと|少し)落ち着いた。」の全欄一致だけ。括弧は選択肢、?は助詞0/1の案で、原文に挿入する文字ではない。明示主体・否定・余分な節・別の原因/目的が加われば対象外。これは候補2名詞を含む有限familyで、一般的な食事文法や未知言語全体へ合格を広げない。heldoutの雑炊文をこの承認範囲へ先に含めるが、学習のmessages/targetには入れない。

| API内のpath | 変更案 |
|---|---|
| ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_semantic_admission.py | 既存修理branchを保ち、新familyの全文scope/5claim/4関係/全原文/選択を照合。新familyだけinternal admission/adapter版を区別し、保存・復元を再導出する |
| ai/services/ai_inference/emlis_ai_grounded_observation_gate.py | 上記意味を独立に読み、元の2section・程度・帰宅の作用域・自然な反応とbindingを照合。参照IDだけで本文を合格させない |
| ai/services/ai_inference/cocolon_meaning_experience_engine/model_candidate_source.py | 修理専用の4/6claim指示を新familyに対応させる。原情報は全保持。新schemaや正解本文を推論promptへ与えない |
| ai/tests/test_cmee_emlis_model_daily_calm.py（新規） | 正常・誤方向/省略/程度/主体/時点/追加原因の拒否、旧修理のsnapshot/hash/本文/問い/3更新の互換、実service/隔離SQL保存再読 |
| ai/tests/fixtures/cmee_emlis_model_daily_calm_v1.json（新規） | 出典付き合成候補と検査変異。model出力やhuman acceptanceへ昇格しない |

旧修理の意味・native field集合・admission/adapter版・snapshot_ref・完成本文を変えない。新familyだけをsourceから決定し、呼出し側が任意のfamilyラベルを指定して採用範囲を切り替える抜け道は作らない。旧保存のfresh再導出を新意味へ移し替えない。新familyのsnapshot内部版を独立させても外側のsemantic_profile・公開DTO・DBは維持する。この5path内で成立しない実装が必要なら、その追加pathと責務を具体化して実行前に止める。

dailyの内部版はsourceの独立再認識から導出し、保存値の自己申告で切り替えない。dailyにanswer/prior、question/update_note、updatesがあれば拒否し、chair用訂正処理へ流さない。旧chairの版1/1・snapshot全体一致を回帰条件とする。

新学習/実行sourceはこのfolderの `generate_candidates.py`、`run_daily_calm_fit.py`、`run_daily_calm_holdout.py`、`consume_fit_raw.py` と、対応plan/教師/messages/manifest/tokenization/fixture/result。既存有限runnerの同方式を再利用し、既に終了した旧planを編集・再実行しない。generate_candidates/run_daily_calm_fit/consume_fit_rawと9行の教師・messages・manifest・plan・CPU結果を作成済み。holdout runnerは学習後の採否を確認してから同じ承認範囲内で用意する。GPU学習はまだ実行していない。

## 有限な学習・接続確認案

1. 元うどん1題を実service識別子3組へnative束縛し、合成候補で意味→本文→END→隔離SQL保存再読を確認する。chair6凍結教師はそのまま保持する。凍結する9行は独立言語9題ではなく、**2family・chair6行＋daily3行**である。
2. 固定tokenizerと正規chat templateで9行を実測し、context8192/prompt5632/completion2560に収まることを確認する。超過・意味欠落・旧互換不一致なら学習前STOP。本文/根拠を短くして通さない。
3. 開始adapter **76309b86c6a76ed61cf3600f4beb1f45c658fac3bb3e3add4284ef54259276c5**、固定base Qwen3.5-4B@851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a、既存LoRA32tensor、新AdamW/LR5e-5、全assistant JSON＋EOSを対象として9行×2pass＝**18更新を一回**。厳密なoptimizer途中再開ではない。保存/非学習reload/FIT9生成まで含め1800秒・記録単価$0.26/h按分$0.13上限。before新生成は0で、新dailyの前後改善率は算出しない。旧chair6の保存rawは旧結果保持との比較だけへ用いる。
4. 学習に入れないfresh service identity2組で初回各1call、実service→隔離SQL保存→GET/start非生成再読を一回確認する。一つは原うどん文の新ID、もう一つは華恋が作る架空の語彙変形「温かいものを食べたら、少し落ち着いた。／帰ってから、雑炊を作って食べた。」。後者を学習へ混ぜず、正解本文を推論へ送らない。語彙/表現のfamily内評価であり、さらに新しい第三familyの評価とは数えない。計最大2call・15分/$0.065上限。
5. 旧/新FITとheldoutを別集計。原raw無補修で意味/本文を消費し、全本文を華恋が読む。追加重みarchiveの全memberをPod外回収/32tensor/hash照合して保持する。元4B全重み/optimizer/RNGは含まない。成功でも商品合格・通常アプリ完成・全体％加算はしない。

上記GPU process計45分・記録単価按分$0.195以内は、実請求総額ではない。準備/回収/待機/継続保持/税等は別。開始時に現単価・source/重み・対象planを再確認する。新Pod/チャージ/追加依存/再起動は含めない。GPUはMashの指示までSTOPしない。

前回reserved peak18.779〜19.109GiBは20GBに近い。OOM/期限超過はprocessを終了して記録し、対象短縮・dtype変更・再試行をせず、Pod自体は稼働を保持する。

offline attempt180秒/source150秒、通常30秒、SQL期限/CAS、保存済み非生成、既存Safety/privacyは維持する。失敗時のmodel同要求再call、追加更新、LR探索、評価からの教師化、raw/reader修復、別core進行は自動で行わない。失敗/超過/未知のscopeは結果を保存して終了する。

## 承認境界・今回の保存範囲

Rule18 §11.3 LEVEL_3の「contract、acceptanceまたは品質条件を追加、変更」に該当する**解釈**である。根拠座標の誤り直しではなく、これまで対象外だった意味とprivate関係を受理する差分のため、この一案を提示し、Mashから「いいよ、進めて」の明示承認を受領済み。前のoffline180秒承認をこの意味拡張の承認へ流用しない。今回の診断/具体案・既存資料の差分保存は現行継続指示の範囲で行い、実装承認とは区別する。

実環境はCodex Work/GPT-6、統合/実行/反映ownerはroot華恋。別文脈agentのread-only意見を原sourceへ照合し、独立Pro/Ultraまたはhuman受入れと偽らない。System Context最新索引は未完成なのでfresh原本を直接読んだ。全体設計01・01A/B/Cのrouting、全機能00、current maps、最新weekly§36、学習目的/用途、ルール/恒久incident/Diaryを参照した。全blobを意味読了したという主張ではない。

前回の診断のprimary outcomeはBLOCKER_NARROWEDとして保持する。承認後の今回途中結果は下段へ分離し、GPU生成/学習/商品合格はまだ加算しない。実行済み旧§36のcreditは保持する。

Renderのread-only最新照会は3577d7fd/dep-dbd8hjoae00c73firbt0がLive、自動配置OFF。API開発95d00bは未配置。Supabase cocolon-projectはACTIVE_HEALTHYのmetadataのみ確認し、本人row/SQL取得0。今回のGPU操作/STOP/再起動/削除/Render変更/Supabase変更/merge/deployは各0。GPUの現在稼働への新規照会はしておらず、前回稼働確認から停止操作をしていないことと区別する。

| file | 今回の役割 |
|---|---|
| README.md | 実障害・原教材・具体的意味/実装/有限実行案・承認境界 |
| source_mapping_candidate.json | 未採用draft全packet・原source・出典・選択・禁止推論 |
| current_profile_diagnostic.json | 実scope拒否・source hash・8根拠検査・実行効果0の結果 |
| probe_current_profile.py | 実行した一回CPU診断のsource。再利用可能な新checker systemではない |


## 承認後の実装・CPU結果（GPU実行前checkpoint）

API **bd356566d37370911e14dab2819ab25a619c6353**、承認済み3製品owner＋新test/fixture2pathを反映し全5fileをGitHub全文読戻し照合。新dailyだけadmission/adapter2/2、旧chair1/1/native形/hash/意味/実本文/ASK/訂正3更新/model messagesは未変更API95d00bの実行captureと全文一致した。新familyの回答・prior・問い・gap・更新は不採用。通常app/API/DTO/DB/RN/本番配置は変更0。

限定4testfile **174 passed /0failed/0skip、20.89秒、既存warning1**。新daily60件、既存114件。最初の新SQL2件は保存値でなく毎回変わるSQLnowまで比較したテストの誤りで失敗、persisted snapshot/eventsの比較へ修正後に全4fileを再実行して成功。製品codeの緩和やSQL時計変更は0。新dailyは16表現・5claim/4関係/8根拠・選択・意味と本文の拒否・保存内部版改変・実SQL2初回/非生成再読を確認した。scope数を独立言語16題へ換算しない。

CPUの新教師束縛は元うどん3identity・合成candidate3・隔離SQL30RPCで、初回FINAL/END/保存GET/start非生成再読を確認。旧chair6行は原sft全bytes同一で先頭へ保持し、合わせて9行/2familyを凍結。raw/readerの修復はない。新model/GPU学習0、CPUの成功を4Bの成功へ転用しない。

新planは76309b86から18update・FIT9のみ、holdoutは別script最大2callでFIT成功後だけ。固定plan/data/helper hash/9行/旧6行bytesのCPU検査は成功。固定本物tokenizerによる事前確認はGPU側の既存cacheで次に実行する。超過/不一致/OOMなら学習開始せず、原文/target/上限を縮めて通さない。

GPUはRunpod既存A4500/20470MiB/使用1MiB/単価$0.26hを今回再確認。現在adapter76309b86のhash一致。STOP/再起動/削除/新Pod/charge0。

STRUCTURE_MAP_DELTA_PRESENT（新private daily意味/表面/内部版の採用範囲だけ）。全機能00/01A/current01・04/共有設計01/schema05/最新weekly§38を同じ作業内で更新。正式0/3・54.50％/商品credit0。
