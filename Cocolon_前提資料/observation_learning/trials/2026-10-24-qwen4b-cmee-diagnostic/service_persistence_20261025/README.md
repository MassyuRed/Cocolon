# 既存実4B出力のEngine保存・別process再開と、service期限の切り分け

**Engineのcold file再開：初回・訂正の全outcome/本文/問い2/2同一、訂正3更新、最終END。** 通常service・SQL保存・本人履歴の成立とは扱わない。

## 実行と範囲

Cocolon前提 ` db0ce12408e9c6c066fb650cabb941b1ba83099f `、API `7a4dc32c07f8c8a30609e8345207c6a9c831de23` のclean source。scriptは既存packの`persistence_check/check_saved_roundtrip.py`、SHA256 `e193e4d6a149313059f33549c82cd413b47e6e52e53349e5564b429c34a1883f`。Codex Work/GPT-6、root華恋が実行・統合・GitHub反映owner、別文脈agentは読み取りreviewのみで別モデルPro/Ultra審査へ換算しない。全機能00全文・work rules/必読incident・全体設計/全file地図・current maps・最新weekly§33・観測学習の目的/用途を確認した。System Context最新索引未完成のためfresh原本を直接参照。

既知架空chairの`model_roundtrip_20261025`の初回/訂正rawをそのまま再消費した。新しいモデル呼出し・追加学習・未知評価ではない。正式sft原本の`scenario_persons_fictitious=true`2件に閉じ、本人DB/Private diary/credentialは使用/送信しない。

1. 原manifestのbytes/SHA256、固定API/base/adapter identityと原raw不変を確認。
2. 実初回の意味snapshotと実questionが元の訂正scenarioに一致した場合だけ、そのsnapshotを訂正native caseのpriorへ使う。raw内IDや文面を補修しない。
3. 両段階の意味snapshot・checkpoint・native requestをJSONへ保存。
4. 別のPython processで原source束縛を再検査し、`restore_model_snapshot`→`MeaningExperienceEngine.generate(RESUME_ADOPTED)`を実行。`FRESH_CANDIDATE`、`receive_candidate`、`ModelCandidateSource.__call__`は呼ぶと失敗する条件で確認する。
5. 全outcome（artifact/意味/問いを含む）とsnapshot/checkpointが保存前と一致すること、訂正のpriorが実初回の全payloadと一致することを確認。

| 項目 | 実結果 |
|---|---|
| CPU実行時間 | 30.241580957秒 |
| 別process再開 | 初回/訂正2/2、親と子は別PID |
| 初回 | QUESTION_PENDING / PRE_QUESTION、実ASKと本文維持 |
| 訂正 | GENERATED / REFINED、3更新、question=null、END |
| 原raw/fixture/API | 不変 |
| 新候補取得/新モデル/学習 | 0/0/0 |
| SQL/RPC/service/HTTP/Auth/RN/端末 | 未実行 |

初回は椅子の修理・再使用と、当初述べた独力の喜びを保持する。訂正後は友人の手順・共同修理と、捨てずに再使用できる喜びへ更新し、独力理由を復活させない。全本文はresult.jsonのstagesに保持。意味/本文が同じであることと、自然さ・一般観測力の合格は別である。

## serviceで見つかった具体的停止点（source照合）

`emlis_thread_service.py:31`の`ATTEMPT_SECONDS=30`を`_begin`が全profile共通で使う。`_semantic_candidate`はSTARTEDを保存してからsourceを呼び、返却後のRECEIVED保存にも`finishing_attempt`を付ける。`supabase/migrations/20260911020509_emlis_input_threads_q2.sql:115–117`は期限後のattemptを`40001/emlis_attempt_stale`で拒否する。

前回実rawの`seconds`は初回57.42545689176768、訂正95.99499596003443。いずれも30秒を超える。これらは前回モデル生成の実測で、今回service接続の実測失敗ではない。今回実SQL runtimeはチェックした領域にPGlite本体がなく、Python側もhttpx未導入のためSQL/service試験を開始していない。skipをPASSに数えず、DB辞書置換で実SQL成功を代用しない。

また、新serviceはUUID/request/source/questionを生成する。意味IDはrequest/source/controlを含むため、旧raw内の`source_id`/`prior_snapshot_ref`を新thread用へ置換して既知成功を流用しない。次の本検証はservice自身が組んだ入力で新規model2callが必要。

## 次の具体案と判断点

[既存共有設計の限定案](../../../../designs/cmee/v1/01_shared_kernel_and_runtime_contracts.md#cmee-offline-model-service-deadline-proposal)。実serviceの30秒失効境界を変えるため、rootはRule18 §11.3のruntime/STOP境界変更として限定判断を求める。providerの上限時間を具体化できる既承認条項はある一方、既存Q2正本は「各attemptは30秒」であり、現実装はMODEL_PROFILEにも同値を適用するため、API期限を変更したとはまだ扱わない。これは今回のread/replay実行を未承認へ戻すものではない。

案は明示offline MODEL_PROFILE専用の180秒、source待機上限150秒、残30秒を保存用に確保。通常Q2/Q3/APPLICATION・旧profileは30秒。SQL/CAS/期限失効拒否、同key再送、STARTEDだけの中断後の候補再取得禁止を維持。heartbeat/新service/新依存/新Pod/通常有効化/DB migrationなし。採否が否なら今回の原本と実結果を保持する。

## 開始・完了記録

`product_destination`: 実4Bで得た意味/訂正を中断後も同じ内容で返す条件へ接続。`current_gate_or_subgate`: weekly§33の保存再開未確認。`exact_work`: 既知raw2段階のEngine cold file再開とservice境界source照合。`scope_classification`: 既存offline設計内のLEVEL_2相当。`approval_or_delegation_basis`: Mashの今回の継続指示、既承認CM-01/T1の保存再開範囲。`execution_owner`: root華恋。`success_credit`: 限定TECHNICAL_CREDIT、商品0。`completion_condition`: 実snapshot/prior/本文/問い/更新の別process2/2一致と原本不変。`stop_condition`: 不一致/timeout/候補新取得要求時停止、実SQL未実行を成功へ換算しない。`prohibited_scope`: raw補修/教材追加/推論学習/期限変更/通常有効化/DB/Render/停止。`next_product_read_or_mash_decision_point`: 期限変更の限定案、その後に通常service/未知品質と本人端末は別確認。`current_source_test_receipt`: 上記fixed source・元raw/manifest、result.jsonが本単位の記録。`current_docs_and_heads`: Cocolon db0ce12408e9c6c066fb650cabb941b1ba83099f/API 7a4dc32c07f8c8a30609e8345207c6a9c831de23。`affected_current_structure_maps`: current01/04、商品構造差分なし。

一回限りCPU process120秒/各child30秒、実行完了・再実行不可。費用/新しいMash操作0（既存GPUの継続課金は別）。新しいchecker/台帳/常設基盤は作らず、取得済みrawと既存Engineを一回確認した。STRUCTURE_MAP_DELTA_NONE、正式0/3・54.50％据置。GPU停止/再起動/削除、新Pod/charge、Render/Supabase/merge/deploy操作0。
