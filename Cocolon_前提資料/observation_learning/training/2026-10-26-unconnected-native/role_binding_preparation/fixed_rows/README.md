# 固定列配列による全文候補 — 指示修正後も0/2、一回終了

**現在（weekly§107）：** 指示のroot/subject表示2点を揃えたCPU確認後、Mash承認のf493非学習1load/0更新/2生成を一回完了。両cap未完・TOKEN_LIMITで意味/本人本文0/2、327.665962秒/$0.025485130397按分。元重み不変・新重み0、全205member原本を回収/照合/保管し不採用で閉鎖。[実結果](prompt_shape2/result_20261029/README.md)。retry/追加有料試行なし、GPU保持。以下§104〜106は各時点の履歴。

2026-10-29 JST。root華恋が唯一のwriter/executor、独立補助はread-only。実環境はGPT-6 Codex Workであり、正式Pro/Ultra又はhuman受入れとは称しない。

## 今回の直接対象と到達点

EmlisAIのBOOK/SHOP回答後全文はsuffix2でも意味・本人本文0/2、旧9は7→4/9へ退行した。新45a1は不採用、旧runは閉鎖したまま。同じloss重み調整を反復せず、モデルが同じ意味・更新・本人本文を最後まで明示できるよう、反復する固定JSON項目名だけを配列の列順へ移す一回限りの表記比較を行った。前回の汎用column-record約3％短縮案は不採用のまま。

**§104の比較時点で完了したのはCPU比較だけ。4Bのload/forward/update/生成、新CMEE受領形式の実装・有効化は0。** 新formatを実際のmodel rawとして受け取れることも、言語能力改善も未証明。primary=TECHNICAL_CREDIT（可逆表記・token比較のみ）、product_credit=0、正式0/3、54.50％、candidate_ready=false、automatic_progression=false。

## 比較した形式と不変の意味責任

format=`cocolon.cmee.fixed_rows_comparison.v1`。rootは `[format,v,a,q,c]`、各objectは固定列順の配列。q/c/claim/time/mode/polarity/pred/subject/relation/update/prose/bindの列定義はsourceのFIELDS。alias表aは `[[alias_name,actual_identity],...]` とし、モデルが名前と実IDの両方を出す。bindはurなしの3列／urありの4列を区別する。

復元するのは固定key・階層だけ。全scalar、空配列、null、引用とsource/field、時点・否定・主体、claim/relation/updateの名前、更新の対象・根拠・順序・件数、bind、observation/reception/update_noteを省略・推定・自動導出しない。textとpred.surfaceも別々に残す。既存named-wireのvとc.schemaの文字列も出力に残す。priorのaliasは局所、自出力a/qへの宣言が必要、updates.priorはsnapshot aliasでsource aliasではない。全文を一回で出す比較であり、gold prefixや意味の補助入力を追加しない。

compact9の参照短名化と違い、q/cid/rid/$id/ev/ur等の名前は変えない。staged_pair9と違い、意味と更新への分割・gold A条件付きB・二段生成を使わない。

## Jupyter実CPU結果（最終v2）

固定base `Qwen/Qwen3.5-4B@851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a` のcache tokenizerと既存helper/CMEEを使用。依存導入・network取得なし。実13.009847909秒。

| 対象 | 実chat prompt | assistant＋EOS | 入力＋全文＋EOS | 新prompt＋元生成cap |
|---|---:|---:|---:|---:|
| BOOK回答後 | 4387→4292 | 2913→2148（26.26％減） | 7300→6440（11.78％減） | 8004 ≤ 8192 |
| SHOP回答後 | 4539→4444 | 3238→2424（25.14％減） | 7777→6868（11.69％減） | 8028 ≤ 8192 |

前回汎用案のEOSなし単独output2911/3236とは計数条件を分ける。元capはBOOK3712/SHOP3584、旧9は各2560を変更せず比較した。古い説明を残して新schemaを単純追記したのではなく、systemのroot記述とoutput_specのnotation/shape/output_typesの構文説明を置換。他の意味要件、原material、prior、role/axis/引用/更新/本文要件は同値保持した。各caseでtrain.messages[:-1]とeval.messagesが厳密一致する。

元19行から選んだ全文2＋旧9の11件の比較用subsetであり、19件全体の再学習・評価ではない。旧9のmessages/teacher文字列・token列・loss maskは全9同一、元19行／元eval fileは不変。

全2教師のnamed JSONへbyte/order完全復元し、元教師と復元教師を既存の未変更CMEEへ渡した全outcomeが2/2同値、意味・本文2/2。**これは正解教師の対照であって、4B自由生成2/2ではない。** claimセル欠落、update余分セル、alias重複、quote型不正、format違いの各5変異を各題で拒否確認。文字列"null"はnullへ修復せず、欠落claimも追加しない。これらは全意味schema・全不正入力の包括検証ではなく、意味判定は既存CMEEが担当する。

## 初回v1の扱い

初回CPUは12.683820641秒で形・値復元と計数を完了したが、独立確認でoutput_types置換時にprior a/qの局所性・snapshot aliasの説明が一部落ちると判明した。model/GPU effect前にその候補を退け、説明と明示assertを戻したv2で再計数した。初回source/入力/結果/logはsuperseded_v1へ保持し、最新学習入力へ使わない。26％短縮という出力値は同じでも、最終promptはv2の4292/4444であり、初回4211/4363を使わない。

## 原本と保存

final_v2のsource SHA256は `df650fd82663ac1c72954cc640ace9c53de71a3e9fd46155279670253de7dde3`。train_messages/eval_inputs、全2rows/roundtrip、実CPU log/exit、summaryを配置。完全cpu_check.jsonは各1MiB超のため、GitHubは同folderのcpu_check_summary.jsonを索引とし、encoded全token/mask・完全teacher outcomeを下記ZIP内の同folder/cpu_check.jsonへ保持する。summaryのcomplete_originalにbytes/SHAを記録した。元reportは編集していない。

最終ZIP `cocolon-fixedrows-cpu-20261029.zip`、292,780bytes／20payload＋manifest、SHA256 `8c41d07c821437ebc37320cd95b4d23c2e5d0215abb66a9da0116615f0f059a5`。全CRC/size/hash/source一致をPod外照合し、Library `libfile_380690ad8eec8191ad327c7d2669e35a`へ保存。base/tokenizer本体や追加重みは今回新規作成していない。既存新旧重みの保存ownerはsuffix2最終ZIPのまま。

## 提案時の履歴 — §104時点では未承認・未実装・未実行

詳細条件は[fixed_rows5.plan.json](fixed_rows5.plan.json)。以下は提案当時の記録で、当時の承認後履歴は末尾execution節、最新の結果は冒頭weekly§107を優先する。当時の「続けて」は既に固定されたCPU比較を進める指示として使用し、新しい受領形式・GPU試行まで承認済みとは記録しない。

### 新形式の受領範囲

mashos-apiの `ai/services/ai_inference/cocolon_meaning_experience_engine/` で、新 `fixed_rows_reference_wire.py` を追加し、既存 `preparation.py` と `emlis_semantic_admission.py` だけを拡張する案。新 `ai/tests/test_cmee_fixed_rows_reference_wire.py` で限定検査し、現行owner identity fixtureが必要な場合だけ実sourceに一致させる。歴史fixture・受入分母・既存判定を緩めない。

明示した新candidate_formatだけでrows→同じnamed decoder→同じquote/意味検査へ通す。実rows rawとformat・finish・model/base/adapter・usageをreceiptに保持し、再検査と保存再読でも同じraw/formatを使う。復元named textをモデルのrawと偽って置き換えない。private/Free/ANSWER＋BOOK/SHOP AFTER_EXPLANATION制限を受領と意味採用の両入口で保持する。新形式未選択時の自動検出・旧形式fallbackを追加しない。既存ModelCandidateSourceは新形式に未対応のまま、専用offline harnessと固定v2 messagesでの受領に限定する。通常/async sourceの有効化は含めない。format識別子を変更する場合はprompt/token/contextを再確定する。

GPU前に実新形式の受領・receipt replay・教師2件・cold全outcome、旧形式receipt byte保持、欠落/不正/名前異常とfinish優先、source/hash/全EOS mask/contextをCPUで確認する。failならGPUは0のまま終了する。

### 条件付き最大5更新・13生成

起点は保存f493（新45a1は不使用）。同じ新promptでBOOK/SHOPを各1回生成し、新形式の実受領・意味・本人本文・保存cold/receipt replayを読む。2/2成立なら学習をせず0更新/1load/2生成で終了する。商品受入れにはしない。

未達の場合だけ、BOOK→CHAIR01訂正→SHOP→CHAIR02初回→CHAIR03初回の5更新。全文assistant＋EOSへの通常CE、LR5e-5/weight_decay0/clip1/seed20261024。新全文2と既存quote anchor3であり、suffixや誤り重みの再掃引ではない。別保存・112F32非学習reload後、全文2＋旧9を各1回生成し同じCMEE/成立snapshotのcoldへ通す。最大合計5更新/2load/13生成。全文2のbefore/afterは同じ新promptで比較し、旧9は保存f493の7成功をcase IDごとに保持したか判定する。総数7/9だけでは退行なしとしない。

同Pod A5000を保持し、GPU親processはCPU子process待機も含め最大2400秒（timeout2390＋kill10）／処理按分$0.19上限、各生成180秒、context8192、元capのまま、greedy、retryなし。前回同Pod表示$0.28/hを根拠とし、live単価再照会なし。準備/回収/親process外CPU/保持/保存/通信/税等は別。上限内完走保証なし、runtime/identity/timeout/OOM不成立なら停止・原本回収、次run自動開始なし。実装時の同scope内の機械的補正は記録するが、意味要件・費用上限・対象・停止境界を広げない。

今回追加GPUなし。現在の2題には正しい教師があるため、この修正用の新観測会は不要。未知独立評価・Piece/Analysisの完成教師は別の未完了。通常app/API公開契約/DTO/DB/RN/Render/Supabase/merge/deploy/lifecycle effect0、GPU保持。STRUCTURE_MAP_DELTA_NONE（今回はoffline比較source/教材派生・記録だけ）。


<a id="fixedrows5-execution-20261029"></a>
## 2026-10-29 承認後の実装・CPU・一回GPU実結果

**現在の直接作業（10/29・固定列形式の一回試行終了／新重み不採用）：** Mashがbadea42e案へ「進めていいよ」と承認した一回をJupyterへ直接接続して完了。限定offline/Free BOOK・SHOP回答後の明示受領をAPI c920f81aへ実装し、CPU教師2の意味/本人本文/cold全outcome/replayと旧9の変更前receipt/fulloutcome完全一致を確認。f493比較起点からbefore2は両方TOKEN_LIMIT・意味/本文0/2だったため、承認どおり5更新・別保存・非学習reload・after11を実施した。BOOK/SHOPはEOSへ到達したが両方INVALID_FORMAT、意味/本文0/2。旧9は6/9、旧成功7のうちTRAIN-SERVICE-CHAIR-01-CORRECTIONを喪失（model_update_coverage_invalid）。成立6件は別process cold全outcome/replay一致、rootが全13raw/成立6本人本文を読了。処理1265.872235秒/$0.098456729416按分で40分/$0.19以内、準備/回収/保持等別。新adapter f811314bは不採用、f493も比較起点で通常商品採用を意味しない。全重み/原本359memberを回収しCRC/bytes/SHAを検証・保管済み。API後続7acff074は現identity fixtureだけの同期、CI成功（1634＋別1、12020subtestは別加算しない）。通常ModelCandidateSource未有効化、retry/自動次runなし、商品0/正式0/3/54.50％・candidate_ready=false。現2題の追加観測会不要、GPU保持。 [実装・実結果](execution/results/20261029/README.md)。

実行範囲・上限は [承認後plan](execution/runtime_authorized_plan.json)、sourceは [runner](execution/run_fixed_rows5.py)／[consumer](execution/consume_fixed_rows5.py)、APIの全4file identityは [manifest](execution/current_api_source_manifest.json)。起案planと初回CPU比較結果は履歴として改変しない。今回の技術owner構造差分は新受領moduleと明示分岐のみ、native意味型/公開API/DTO/DB/RN/Render/Supabase/通常有効化/merge/deployは変更0。STRUCTURE_MAP_DELTA_PRESENT、商品0/正式0/3/54.50％・candidate_ready=false・automatic_progression=false。


全13生成raw・5更新log・実run・112tensor manifest・各case判定は [実結果](execution/results/20261029/README.md)、[summary](execution/results/20261029/summary.json)、[回収ZIPのidentity](execution/results/20261029/archive_receipt.json)。raw run.jsonのpending表示は当時の原本として保持し、回収後のclosureはsummaryのCLOSED_NOT_ADOPTED_NO_RETRYで区別する。
