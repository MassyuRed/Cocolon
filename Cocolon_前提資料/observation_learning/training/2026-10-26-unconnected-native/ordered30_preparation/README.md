# 引用・意味・更新を本文より先に生成する30更新候補

状態：**承認済みの一回は完了・閉鎖、新候補は不採用**。最終の全15採否/比較/読解/回収は[ordered30_result](../ordered30_result/README.md)。このplan/承認/outputの再起動は不可です。以下は提案・準備・実行途中の履歴です。旧continuation30は閉鎖済みで、旧承認・出力・残枠を再利用しません。

目的は、4Bが本人の言葉・主体・時点・否定・不明・回答後の変更を保ち、自然な観測と受け取りを作り、既存CMEEが採用・保存再読できるようにすることです。現在の不足は、既知15件のうち新6件の本文が0/6である点です。三中核全体の用途・Runpod育成・Windows/Mac未選定は[学習目的](../../../README.md#observation-learning-intent-and-assumptions)を保持します。

## 今回変えることと根拠

前の全文CE・混在順・損失配分・低LRの各一回では、新6本文0/6を解消できませんでした。回数やLRだけを再調整する案にはしません。

元教師はJSON keyを辞書順に並べ、candidate内のsurface_proposalがunknowns/updatesより先、根拠の引用表evidence_quotesがcandidateの後です。continuation30のBOOK回答後・SHOP回答後・KNITは本文の反復で打ち切られ、更新・引用表・不明などの後続部へ届いていません。原本は[前回全結果](../continuation30_result/README.md)と同reading_reviews/new6.jsonです。

今回は、**教師のJSON値を一つも変えず、生成する順だけを「引用→意味・不明・更新→問い案→本文」に変えます**。自己回帰生成で、自然文を書く時点に根拠と変更内容が既にある形を教える仮説です。反復・主客反転の唯一の原因が順序だと証明されたわけではなく、改善保証もありません。二段生成・token上限拡大・reader緩和・名詞特例は導入しません。

最上位はschema_version→evidence_quotes→candidate、candidateはschema_version→core→claims→relations→unknowns→conflicts→updates→question_proposal→surface_proposalです。全key・全値・配列順・nested object・原文・runtime request・priorを保ちます。元train_messages.jsonlは不変とし、encode時だけ別serializeを導出し、実行時にはordered_targets.jsonlも保存します。system/user・評価入力は変更しません。token列の学習順が変わるので旧9の退行リスクもあります。短縮策ではありません。

## 実Jupyter CPU確認

[actual_cpu_check.json](actual_cpu_check.json)：**13.005556795978919秒**、20951bytes、SHA256 **beee99df0594b00109ce482a6880797b5b6d44210bbbe647fb851687e1a8d1d7**。同PodのUIから一回ダウンロードし、待機timeout後に到着した原本を再要求せず回収。Pod印字・bytes/hash・候補4sourceのbytes/hashを照合しました。

- 実tokenizer15件、切捨て0、prompt除外・assistant/EOS学習、最大7935/8192。BOOK回答後3178、SHOP回答後3561 assistant/EOS token。旧cap内。
- 全15のparsed target値・配列順不変、system/user token・実CMEE入力/prior一致。
- 固定APIの実receipt→意味採用→RESUME_ADOPTED本文を元/並替の各15、計30回CPU比較。全15で意味・checkpoint・本文・問いを含むoutcomeが一致しました。ただし原文を保持するreceipt.raw_outputだけはserialize順が異なるため、同fieldだけを除いてsnapshotを正規化し比較しています。全IDやreceipt全体を比較から落としていません。
- 初期1d218763の3file hashと32F32有限性、凍結payload/API6blob・旧helper不変。承認pendingのexecuteはoutput作成前に拒否し、GPU用新outputは不存在。
- **4B model load/forward/学習/生成は0**。LoRAのCPU読取と合成教師のCPU採用を、モデル出力の成功や商品品質へ数えません。SQL0。
- 最初のCPU確認はAPIを差分6fileのfolderへ向けてしまい、MeaningExperienceEngine importで停止しました。実tokenizer/承認前拒否までは実施、CMEE採用0。既存の完全API copyへ検証コードの参照だけを直し、別logで上記を確認。製品source/reader/教材変更・依存導入0。失敗v1は同packに保持しています。
- 配置時のfilechooser待機timeoutと、初回の未実行heredoc入力を区別します。前者は実Upload UIから配置、後者は別の新terminalで一行commandへ訂正し、モデル処理0です。これらをGPU失敗や再学習へ変換しません。

## 提案するGPU一回

| 項目 | 固定範囲 |
|---|---|
| 実行owner | root華恋のみ。補助agentはread-only。正式Pro/Ultra/human受入れとは区別 |
| 環境 | 既存Pod bkj4qvnhwtdqc2／NVIDIA RTX A5000、Jupyter直接 |
| 元モデル | Qwen/Qwen3.5-4B @851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a |
| 初期重み | 保存1d218763964ce0e1f0e587c754731c5476d70cdd16548020abf330912c518c1b。前回不採用dd1188e8は使わない |
| 差分 | assistant JSONのobject-key順だけ。parsed値・配列順・system/user・eval・prior・採用readerは不変 |
| 更新 | 同15件×同2pass／固定30順序、LR1e-5、元の全文assistant/EOS平均CE、32LoRA、fresh AdamW |
| 保存 | 別adapter保存→model参照解放→非学習reload→同15生成 |
| 時間/call | 読込・学習・保存reload・生成で最大2700秒、各生成180秒、最大15call、新before0 |
| token | context8192、旧9 max2560／新6 max3712を維持 |
| 処理按分 | 表示$0.28/h×最大45分＝**$0.21**。準備・回収・保持・保存・通信・税等は別 |
| 比較 | 初期1dと直前dd1188e8の保存済み同15原本に対応付け、意味・全更新・本文を比較。新baseline生成0 |
| 停止 | OOM/期限/非有限/identity不一致/例外で停止。再試行・追加更新・欠測再生成・自動縮小なし |
| 終了後 | 無補修rawを固定CMEEで採否→採用snapshotだけ別process cold-file再読→全本文読解→重み/全原本回収・GitHub読戻し |

全15が時間内に完走する保証、OS強制停止保証、未知一般化、動的prior、実service/SQL/Auth/RN、本人端末、正式商品受入れはありません。after回答priorは凍結教師由来です。rawの非EOSはそのまま不成立として記録し、残りも元の時間/call上限内だけで確認します。

目標は固定FITの意味/本文15/15と明白な本文不足の解消です。未達や旧9退行はそのまま記録し、不採用を保持します。CPUでの同一性確認は学習後の品質を証明しません。通常有効化は行いません。

## 実ファイルと再開手順

| file | 役割 |
|---|---|
| run_native15_ordered30.py | 不変の元教材から順序だけ導出し、既存全文CE/別保存reload/15callを実行 |
| gpu30_ordered.plan.json | 新一回の条件・費用・pending。gpu_run_authorized=false |
| consume_ordered30.py | 派生targetのidentity/parsed値と実30logを束縛し、既存無補修CMEE/cold-fileを使う |
| verify_ordered30_cpu.py | 実tokenizer・全15入力/意味/本文/問い・初期tensor・pending拒否のCPU確認 |
| actual_cpu_check.json | 実CPU結果と候補4sourceのbytes/hash |

packは /workspace/cocolon_native15_ordered30_pack_20261027、新GPU outputは /workspace/cocolon_native15_ordered30_run_20261027（未作成）。consumerの完全API copyは /workspace/cocolon_afteronly_api_20261027 を指定し、runnerの6blob照合元 /workspace/cocolon_sixrow_api_20261026 と区別します。

承認後は、本案のstatus/gpu_run_authorized/approval_basisだけを新一回へ束縛してGitHub反映・読戻しし、そのcommitをsource-commitに指定します。閉鎖済みplanを起動せず、同output再利用・別Pod自動移行・GPU管理/lifecycle操作は行いません。

**新GPUのmodel load/forward/学習/生成は別の一回承認が必要**です。前回承認の残枠は持ち越しません。新観測会は現在の基本不成立を直す前提ではありません。

開始Cocolon19e51d794bd6f371e44ce4d66ec79ead6c49896b／API PR3 6b043880504912481a6b10d93c9128ec4995b70b。全機能原本を全文、作業規則/恒久incident/Karen-Diary・全体設計/全file地図01/01A/01B/01C・fresh両tree・三中核/CMEE map・学習目的・weekly§66・実教材/runner/raw所見を確認。全blobの意味読了やlive/本人端末再検証とは扱いません。System Contextはtimeout履歴を保ちfresh原本を直接確認し、索引再試行0。

今回の許可範囲はMashの続行指示とRule18 §11.3内の可逆的候補実装/CPU確認/GitHub反映。rootが単一writer/実行owner、補助3agentはscope/原因/地図/sourceのread-only確認です。実model名をPro/Ultraと偽らず、Codex Work/GPT-6系で確認できる環境事実を記録します。CPU候補・実確認のprimaryはTECHNICAL_CREDIT、**商品0／正式0/3／54.50％／candidate_ready=false／automatic_progression=false**。

製品の責務/型/wire/採用reader/API/DTO/DB/RN/Render/Supabase/本人DB/通常app/価格/merge/deploy/新依存変更0。STRUCTURE_MAP_DELTA_NONE（学習serialize候補だけで商品構造・接続責務差分なし）。GPUは稼働保持しています。

## 2026-10-27 新一回の承認

Mashは固定案e94971f9b7552989fdd1fe3710a683b9e68662daの30更新→保存/非学習reload→15件確認、最大2700秒/$0.21処理按分（準備/回収/保持等別）へ「進めていいよ。」と明示承認しました。planのstatus/gpu_run_authorized/approval_basisだけを新一回へ束縛し、runner/consumer/元教材/派生serialize/初期/LR/loss/順序/cap/readerは不変です。新outputでrootが一回だけ起動し、旧閉鎖runの承認や残枠を再利用しません。以下のpending説明は準備時の履歴で、この新承認を取り消すものではありません。
 
## 一回実行中のcheckpoint

source5b115939e2f05e47b0c3d8fef8ce54e9cf11068c/PID96980を一回起動。最新事実・再開先は[ordered30_result/README.md](../ordered30_result/README.md)。同output/同planを再起動しません。保存重みreloadは同OS process内の新model object、cold-file再読は別processです。先の会話の別process reload表現を訂正し、実装・承認範囲は変更していません。


## 2026-10-27 一回の閉鎖

**現在の直接作業（10/27：ordered30一回完了、意味3/本文3へ退行・新候補不採用）：** 承認source5b115939/PID96980で初期1d・同30順序/全文CE/LR1e-5・教師JSONの生成順だけを変更し、30更新→保存/同process内の非学習reload→15生成を1482.907733秒/$0.115337処理按分で完了。EOS13/strict JSON8、意味/本文3/15（旧9各3・新6各0）で初期11/9から退行。固定CMEE無補修採否と別process cold3/3、CPU33.761113秒/追加モデル・SQL0。全61payload＋manifest/32F32有限/早期最終重み一致をPod外照合しversion2保全。新483d74b7は通常不採用、一回閉鎖/再起動不可。追加学習/再生成/新有料試行なし。新観測会は今は不要、原本ordered30_result/README・weekly§69、商品0/正式0/3/54.50％、GPU稼働保持。

planのAUTHORIZED_ONCE_BOUND/trueは当時の一回承認原本として保持します。追加更新/生成/旧plan再起動/欠測再生成・自動retryはしません。処理1482.9077327260748秒/$0.11533726810091693（準備/回収/保持等別）、全15完了、固定CMEE意味3/本文3・cold3/3、旧9退行のため483d74b7を通常採用しません。早期原本とversion0は保存し、全原本/最終重みをversion2へ保全。新観測会は今は不要です。
