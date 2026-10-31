# 承認済みoffline180秒実装と、実4B→サービス→隔離SQLの実結果

**初回の意味・本文・実問いの保存／非生成再読は成立。訂正は不採用で、一往復全体は未成立。** 通常アプリ・本人DB・Auth/HTTP/RN/端末・一般品質の成功へは数えない。

## 実装・CPU確認

Mashが[1ba8449の具体案](../../../../designs/cmee/v1/01_shared_kernel_and_runtime_contracts.md#cmee-offline-model-service-deadline-proposal)へ「いいよ、進めて」と明示承認。[API95d00b](https://github.com/MassyuRed/mashos-api/commit/95d00b907f6d9c42944666269acc457c9af34f37)のsource1/test1をremote全文/blob/変更path集合まで確認した。

serviceの`offline_model_attempt_seconds`は未指定30秒、boolを除く整数31..180とMODEL_PROFILE/明示source/private条件だけを受ける。実thread自身のprofile/modeを照合し、通常Q2/Q3/APPLICATION・旧profileは30秒を維持する。source待機は最大150秒で残時間から保存用30秒を予約。SQL期限/CAS/owner/sourceとSTARTEDだけの再取得禁止は変更しない。

初回CPU113 PASS/1 FAILで、STARTED保存後の古いrevisionを使うtimeout HOLD競合を検出した。同じservice内でfresh read→active attempt一致→HOLD保存へ最小修復。最終対象3fileは**114 PASS/FAIL0/SKIP0、63.65秒**（既存warning3）。モデルfile単独46 PASSや初回結果を合算しない。実PGlite SQL/RPCを使ったがproviderは合成。専用runnerのexercise合成smokeも候補2/実RPC30/3更新/意味保存後中断/明示再開/初回・最終非生成get/start/同key再送を一度確認。実GPU成功へ換算しない。詳細はcpu_validation.json、cpu_runtime_versions.json。

## 実モデル・実サービスの結果

source Cocolon031e1a9692500d75596f7f34742235bc4b4af220、script SHA256ea58009d635f44605177c37479cf2d1135620f21e5fa4d4acedfa04b36c44841、API95d00b、固定Qwen3.5-4B/revision851bf6e…/保存adapter9b845eced…。既存A4500/同Podで非学習reload、trainable0/optimizer0/update0、8192context/2048new/greedy/BF16/SDPA。最大900秒/新規model最大2callで終了、追加推論0。

| 段階 | 実model | 実service/隔離SQL |
|---|---|---|
| 初回 | 2070in/1347out、67.859530051秒、stop/EOS/JSON成功 | 意味/本文/実ASKを保存、AWAITING_ANSWER/PRE_QUESTION。別service readerのGET/startは作者・候補sourceを呼ばず、同DTO（can_write=false）を返す。前後thread/events不変 |
| 訂正 | 5005in/1306out、66.391389068秒、stop/EOSだがJSON不正 | receipt INVALID_FORMAT、訂正文ANSWER1件は保存、意味は初回1件だけ、現本文None/旧timeline is_current=false、ANSWER_UNREFLECTED/meaning_updated=false/can_retry=false |

全体155.760673612秒、実model started2/completed2、candidate source2、receipt2、隔離RPC18。service自身のUUID/request/初回実question/actual priorで通した。訂正priorは実初回MEANING_UPDATEのsnapshot全文と同じで、rawは各receipt.raw_outputと一致。旧固定raw・教師を代用せず、ID/prior差替え0、原raw無補修。重み3fileとAPI/source前後hashは不変。

初回本文は「ぐらついていた椅子を直し、また座れるようになったのですね。」と、独力の喜び・再使用への受け取りで、実ASKは「『全部一人で直せたこと』がなぜ嬉しかったのですか？」に対応する既存question ownerのもの。本文/全dictはinitial_dto.jsonと原snapshotへ戻る。華恋が全文を再読したが、今回の既知1題2段階を一般観測品質や正式Product Readへ昇格しない。

**訂正後は意味採用まで到達しなかったため、計画した意味保存後CancelledError・実モデル由来の明示再開・完成済み最終DTO非生成再読は未検証。** CPU合成で成立した結果と区別し、run.service_saved_roundtrip=falseを保持する。

## 訂正の不採用原因

strict JSONはEOF char4022で閉じ括弧が不足。1306/2048tokenでEOS終了しており、時間切れ・token上限打切りではない。診断のためメモリ上で末尾1括弧を補うと解析できるが、補修rawを保存・採用には使わない。

その診断でもevidenceがcandidate内へ誤配置、updates/unknowns欠落、string ID参照であるべきsurface bindingsが整数、共同修理/手順の意味型欠落が残る。根拠6件中slice一致1、2件はstart>end。原入力の修理/結果/喜びまで補足ANSWERのUUIDへ誤束縛した。本人の訂正を正しく意味保持したとは言えない。表面の喜び理由が一部沿うことを成功へ換算せず、既存readerを緩めない。correction_diagnosis.jsonに無補修raw hashと範囲を記録。

学習時と実serviceはsystem/output_specと本人source全文が一致し、control/source ID/日時/request/priorが変わる。training_service_input_comparison.jsonを保存したが、UUIDだけが原因とは未証明。

## 起動前の失敗・回収

実行前、既存sparse API checkoutにtest/helper/SQLが未取得でimport確認が1回失敗。正本の該当3pathだけ追加し、隔離SQLselect1を確認した。その事前importが86個の未追跡pycを生成したため、最初のrunner processは0.037180736秒/candidate0/model0でsource-clean検査に停止した。

失敗attempt/run/archiveを保持し、git statusで全差分が未追跡__pycache__/*.pycだけと確認して別一時領域へ退避した。tracked .pyや検査条件は変更しない。**process起動2回、初回は推論前失敗、実推論は後の1processで2callのみ**。同script/source/2call予算で続行し、意味・モデル出力の再試行は0。監視用表示commandの引用符ミス1回も推論processへの影響0。runtime_provenanceに失敗run/attemptとlaunch/実ログを保存する。

main archive SHA256941f5911367bfabbca0665008e613e4d4bbe4a7133dbfd7f8f63ff83239c5d13 /53,260bytes/全22member（manifest21target+自身）、aux archive 34971c7b6bb20fd285837fa08206a3d1e1311d11a177d33d2d0be6f3a6e2c83f /10,612bytes/全9memberをPod外で照合した。全raw/messages/request/prior/receipt/DTO/snapshot/runと実行条件をGitHubに保存。実行sourceは上の公開scriptとbyte一致。重みbinaryは既存保管を継承し、今回は変更しない。画像result.jpgで実結果とGPU稼働を確認できる。

## 現在地・次の一手

Mash承認のAPI95d00bで明示offline MODEL_PROFILEだけattempt最大180秒/source待機150秒を実装し、通常Q2/Q3/APPLICATION30秒とSQL期限/CASを維持。timeout HOLD保存の旧revision不整合も同service内で最小修復し、CPU対象3file114 PASS/FAIL0/SKIP0。実4B→ModelCandidateSource→既存service→隔離SQLの新規2callを155.760674秒で実行。初回67.859530秒は意味/本文/実問いの保存とGET/start非生成再読が成立。訂正66.391389秒は1306token/EOS終了だがJSON閉鎖/shape/根拠/更新構造が崩れINVALID_FORMATで不採用。本人役の訂正文は保存、意味未更新、旧本文current解除、ANSWER_UNREFLECTED/can_retry=false。訂正後の意味保存・中断再開には未到達で、実service一往復全体は未成立。原raw/teacher/prompt/reader/重みは変更せず、追加生成/追加学習0で今回planを終了。次は学習時と実serviceの入力差分を使い、既存chair教師を正規service ID/日時/actual priorへ再束縛するCPU候補と、閉形・source区別・3更新の検証を整える。UUID単独が原因とは未実証。新しい観測会はこの問題には不要。GPUは稼働保持/停止操作0、商品credit0/正式0/3/54.50％を維持。

次の最小単位は、既存chairの意味/本文を変えず、正規service ID/日時/実priorを使う教師候補をCPUで作り、原入力と補足の区別・引用座標・文字列参照・訂正3更新・candidate/evidence閉形を既存CMEEで検証すること。新しい観測内容をMashへ求めない。未検証のepoch増量・prompt反復・raw補修・reader緩和・GPU追加呼出しへ進めず、新しい有限学習計画を具体化してから扱う。

全機能00/最新weekly§35/current01/04/01A/観測入口へ同じ差分を同期。Codex Work/GPT-6、root華恋が単一統合/実行/反映owner、別文脈agentはread-only reviewで別モデルPro/Ultraやhuman Product Readを装わない。必要性はOBSERVED_BLOCKER_MINIMAL_FIX、今回の個別承認に基づくLEVEL_3実装/有限実行。完了条件は期限限定実装と実model保存/再読/再開の実状態を固定すること、stopは不採用/期限/例外/上限2call。訂正不採用で実行を閉じ、未成立を成功へ変換しない。

STRUCTURE_MAP_DELTA_PRESENT（既存serviceの明示offline期限とtimeout中断処理。owner/SQL/DTO/RN/他core責務は不変）。限定TECHNICAL_CREDIT、商品credit0/正式0/3/54.50％据置。稼働Supabase/Render/通常application/本人row/merge/deploy0、今回のSQLは隔離架空fixtureだけ。GPUは終了後もRTX A4500/20,470MiB/使用1MiBを確認、停止/再起動/削除0。process按分約$0.01124938は継続保持/準備回収/税等を含む請求総額ではない。
