# 10/26 — 未接続の既存6教材とCMEE受理範囲／一括接続案

状態：**10/27：学習先行の後継runner/未束縛planとlocal CPU55確認を準備。GPUレンタル確定は自動審査拒否で本人引継ぎ待ち、今回GPU/学習0。前回native15のbefore2/学習0は下段の閉鎖履歴として保持。**

<a id="native15-afteronly-prepared"></a>
## 2026-10-27 — 学習を先にする後継候補を準備、レンタル確定は本人引継ぎ待ち

Mashの「4Bを動かすための最安レンタルGPUをrunpodでレンタルし、4B学習＋CMEE接続の作業を進めて」という今回の明示指示で、前回の事前比較timeoutを学習開始へ持ち込まない最小差分を準備した。旧一回のrun/plan/raw/重み45779は不変。これは旧閉鎖planの再起動ではない。

**最新GPU確認（2026-10-27 JST）：** Runpodのログイン済み構成画面でSecure/Communityを比較。今回方式の既実測reserved約19.059GiBを踏まえ20GB以上を対象とした。Communityは通信速度の下限も外して確認。確保前に在庫が変動し、審査拒否時の選択ではA4500 20GB（GPU $0.25/h）が在庫切れ、A5000 24GB（GPU $0.27/h）が利用可能で、公式PyTorch 2.8.0/CUDA12.8.1・50GB container・volume追加なしの合計表示は$0.28/h。これは確認時点の構成で、将来の在庫・料金の保証ではない。Deploy確定操作は自動承認審査が金融取引として拒否し、本人への引継ぎが必須とされたため、今回の新Pod確保/起動/課金/モデル処理は0。既存PodのStop/再起動/削除、別経路による同確定操作の再試行も0。既存45779追加重みはPod外の正本から復元準備済み。その後の引継ぎ準備でA4500 20GBの空きが戻ったため、同じ公式image/50GB container/追加volumeなし・表示$0.26/hへ選択を戻した。引継ぎ画面名はcocolon-4b-native15-a4500-20261027。レンタルは確定しておらず、在庫/料金は本人確定時に再確認する。

### 後継候補の範囲と実確認

- [run_native15_afteronly.py](native15_preparation/run_native15_afteronly.py) と [gpu15_afteronly.plan.json](native15_preparation/gpu15_afteronly.plan.json) を別に追加。新before生成0、同じ15行/順序/seed/LR5e-5/全文assistant+EOS損失/32tensorで15更新し、別adapter保存→非学習reload→同after15を実施する候補。学習/保存/reload/after本体は旧sourceと同一。
- 最大2700秒、1生成180秒、最大15call、再試行なし。非EOS/時間切れ/OOM/非有限/identity不一致を従来どおり停止とし、無補修rawを現在のCMEEへ通す。15×180秒だけで全体2700秒となるため、学習・読込込みで全15件が収まる保証はしない。終了後のhash/退避/回収は別途時間を要し、OS強制停止保証ではない。
- 前回のBOOK初回/回答後2件だけを失敗baseline原本として参照。未測定のbefore4件を補完せず、同条件6件の前後比較完成とは報告しない。
- 未束縛planのstatusはPREPARED_ENVIRONMENT_UNBOUND。実GPU名/Pod ID/正確な費用が未確認なので --execute はoutput作成・重み読込より前に拒否する。今回のMash指示の受領と、実行環境が揃っていない状態を分ける。追加の承認段階を新設しない。
- [CPU確認結果](native15_preparation/cpu_candidate_validation.json) は55/55成功。未束縛実行拒否/出力0、旧payload変異拒否、before/期限/call/予算/identity変異拒否、全15学習評価の対応、学習〜保存reloadの旧bytes維持、未束縛authorizationが旧Trueを継承しないことを確認。別文脈read-only確認で見つかったmerged authorization表示を修正し再確認した。
- localに固定Torch/Transformers/PEFT環境がないため、実tokenizerの新規再実行・モデル読込・forward・学習・生成・CMEE採否・SQL・本人端末は今回0。55確認をGPU成功や観測品質へ換算しない。正式Pro/Ultra/human受入れではない。

### GPU確保後の直接再開

1. レンタル確定は、今回の自動承認審査が要求した本人操作へ引き継ぐ。同じ拒否をCLI/API/別browserで迂回しない。在庫/料金が変わった場合は再確認し、画面の将来価格を固定事実にしない。
2. 公式image runpod/pytorch:1.4.1-cu1281-torch280-ubuntu2404、固定依存 transformers5.19.0 / peft0.21.2 / accelerate1.15.0 / safetensors0.8.0 を復元。元 Qwen/Qwen3.5-4B @851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a は公開公式sourceから取得する。旧archiveにbase全重みがあるとは扱わない。
3. 初期adapterはjoint12最終recoveryの libfile_8485cd7181e481918b470bfb44735bf5 version1 を正本にし、45779ad97111dd2d91c1f7f1a4b0ca697ef0586c5190cd56b1b7675fe540dab6 を照合。固定helper2f659078/c5dd1679、API6b043880の6blob、旧15payloadのhashを保持する。旧/workspaceはcontainer diskで、停止後残存を仮定しない。
4. 新planへ今回のMash指示をapproval_basisに記録し、実GPU名/Pod ID/実単価/最大処理額だけを束縛する。画面表示$0.28/hの構成なら2700秒按分$0.21（保持/準備/保存/通信/税等別）が目安。旧$0.195を別単価へ黙って流用しない。
5. 固定環境のdefault CPUモードで全15の実tokenizer/EOS/切捨て0/出典/旧重み/依存を確認し、rootが新outputで一回だけ実行。保存された実rawの全件読解と現在CMEEへのCPU採否、成立分だけ同snapshotのcold-file再読、重み・原本回収・GitHub読戻しまで同単位で行う。新依存/教材/guard変更・追加学習・再生成・自動再試行へ進まない。

今回の保存対象は後継runner/未束縛plan/CPU結果と既存ownerの関連差分のみ。製品code/API/DTO/DB/RN/CMEE判定/価格設定/通常app/Render/Supabase/本人DB/merge/deploy変更0。STRUCTURE_MAP_DELTA_NONE（学習runnerの実行順だけ、製品構造変更なし）。限定TECHNICAL_CREDITは後継runnerとlocal CPU確認のみ、商品0/正式0/3/54.50％/candidate_ready=false/automatic_progression=false。GPUレンタル未成立・今回学習0を維持する。


<a id="native15-gpu-result"></a>
## 2026-10-26 — 承認済みnative15の一回実行：事前比較で停止、学習未達

Mashの「進めていいよ。」により、承認対象5ba8c370の15更新→別重み保存/再読込→15件確認（事前6を含め最大21生成、最大2700秒/$0.195処理按分、保持等別）を実装した。実行sourceはCocolon `179acbd2b3c3d13de3a3adc1fa8bbc1d9799d384`、APIは `6b043880504912481a6b10d93c9128ec4995b70b`。同じ既存Jupyter/Pod上で2026-10-26 17:44:58 JSTに一回だけ起動し、PID693855の終了まで確認した。再起動/二回目の--execute/追加生成/更新は0。

| 項目 | 実結果 |
|---|---|
| 最終状態 | STOPPED_NO_RETRY、stage=before、reason=per_call_or_global_deadline_no_retry |
| 実モデル処理 | base読込1、事前比較2/6、optimizer更新0/15、保存/非学習reload0、after0/15 |
| 時間・按分 | 252.04623138252646秒、$0.018203338933182465（$0.26/h）。準備/CPU診断/回収/継続保持/保存/通信/税等別 |
| BOOK初回 | 2159入力/1261出力token、63.865898秒、EOS/JSON完了、実receipt=INVALID_EVIDENCE |
| BOOK回答後 | 4212入力/3625出力token、180.020644秒、timeout_triggered=true、EOSなし/JSON未完了、実finish_reason=length、receipt=TOKEN_LIMIT |
| CMEEの実採否 | 保存raw2件/同一messages/実metadataを現APIへCPU投入し、意味0/2・本文0/2。両REJECT/semantic_receipt_not_validated |
| 未実行 | SHOP初回/回答後・REPOT・KNITのbefore4件、全after15件、学習・新重み・reload・cold-file再開 |

1件目の意味不採用自体は計画どおり次へ進み、2件目の180秒到達で全体停止した。45分全体期限や3712token上限への到達ではなく、1callの時間上限が停止の直接原因。OOM/非有限/重み破損は今回の停止理由ではない。実finish_reasonをtimeoutやstopへ補修せず、rawのlengthとrunner側timeoutフラグを併記した。GPU logには既存環境のcausal_conv1d/flash-linear-attention未導入によるreference実装fallback警告があるが、それだけを生成反復の原因とは断定せず、依存変更0。

初回は原文にない「その場は済んだけど」をevidence_quotes/本文に足し、memo_actionへ存在しない結合引用を作った。claim_id欠落、時点/参照shapeの不整合もあり、Reception案は「気がかりのことはまだ私の方で持ち続けています」と本人からAI側へ主語を移していた。回答後はsurface bindings内のupdate_refsを反復し、未閉鎖JSONのまま止まった。華恋が全rawを読解したが、これらは未採用のモデル提案であり本人向け成立本文ではない。教師で穴埋め/修復/後処理成功化しない。

CPU診断は9.210401946678758秒、追加model call/学習/SQL0。before回答後のpriorは凍結教師由来を維持し、実初回の失敗rawから作り直していない。意味採用snapshotが0のため、別processのsnapshot復元・完成結果NoGeneration読出しも0件/該当なし。実service/SQL一往復・動的thread・保存再表示の成功は今回0。旧quote9のbeforeも未測定で、旧numeric9成功との回帰比較はしない。

### 原本・保存と未作成物

[native15_result/run.json](native15_result/run.json) が実run、[diagnosis.json](native15_result/diagnosis.json) が実CMEE受理/採否、[recovery.json](native15_result/recovery.json) が回収照合。raw2件・実行log・launch記録・CPU consumer/log・元GPU archive manifestを同directoryへ保存した。元GPU archive70,698bytes/SHA256 `33a5750890d2aed8bc7246abc5a8fd4af479da37321539c9260f639a0397d20e` の全10memberをhash/bytes照合。診断を含む最終archive76,922bytes/SHA256 `e1418d4f481800fe0581942481213afa30479c4ecdbf0bf7184ccd5e97e4b451` の全6member、内包GPU archiveとの全byte、実consumer sourceとの全byteを確認してPod外へ回収・永続保全した。

学習前に停止したため `training.jsonl`、`adapter/`、`partial_adapter/`、`reloaded_tensors.json`、`after_*.jsonl` は作られていない。新重みを回収したとは報告しない。旧45779の全3file・固定runner/helper/payload/API6blobの前後identityは維持。既存15教材/教師/評価入力/旧rawの変更0。

### 到達点と次の直接課題

今回のprimary outcomeはBLOCKER_NARROWED（商品品質credit 0）。承認済み一回の実装・起動・失敗回収/採否記録は完了したが、目的の15更新→保存/reload→15件確認は未達。未学習の事前比較の180秒到達を全体停止へ結びつけた実行順/停止条件が学習開始を阻んだ。これは華恋が設計した停止条件の結果で、Mashの承認や教材不足へ責任を移さない。既存15教材は揃っているため、この原因の解消に新観測会は不要。次は事前比較の停止扱い/学習順の最小見直しを具体化する。今runの条件を書き換えて再開、追加GPU一回、LR/mask/epoch/依存探索は開始しない。最長7935の実学習VRAMも依然未実証。

root華恋/Codex Work/GPT-6が単一writer/実行者、read-only2agentがscopeと実raw/APIを補助確認。正式Pro/Ultra/human受入れではない。STRUCTURE_MAP_DELTA_NONE（製品責務/型/採用条件/保存/API/DB/RN不変）。商品0/正式0/3/54.50％/candidate_ready=false/automatic_progression=false据置。全体00・観測入口・weekly§57・全file地図01Aへ同期し、01/01B/01C/CMEE current mapsは製品構造差分0のため更新不要。GPU管理console/一覧/管理API/Stop/再起動/削除/新Pod/charge・Render/Supabase/本人DB/通常app/merge/deploy0。Pod保持指示と継続保持料金は維持する。

<a id="native15-gpu-proposal"></a>
## 2026-10-26 — 15教材の実CPU確認と、一回GPU案（起案時の履歴）

開始Cocolon PR30 `74ca014a1062f22014b5d174443f0cc084c54a62`／API PR3 `6b043880504912481a6b10d93c9128ec4995b70b`。引継ぎ、全機能00全文、作業姿勢/規則18・恒久incident/Karen-Diary、全体01のflowと全file地図01A/B/Cの役割・関連差分、CMEE current map、観測学習の目的/用途、最新weekly§49〜56、実教材・実helper・6製品/test blobを確認した。System Context索引timeoutは継承しfresh原本を直接参照、新index0。全blob意味監査や全suiteとはしない。root華恋/Codex Work/GPT-6が単一writer、別文脈1agentはread-only reviewで、正式Pro/Ultra/human受入れではない。

### 今回増えた事実

直接Jupyterの既存Pod `y0eb0w0qn6nks0` に接続し、添付と同じterminal hostname／既存作業directoryを確認。新GPU管理画面・管理APIを開いていない。既存Python3.12/private依存と、固定Qwen3.5-4B revision `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a` の実tokenizerだけをCPU使用した。

旧interface-reviewのquote9原本148,257bytesと新native6原本200,917bytesを行・provenance・messages・完成targetごと無変更で連結した。15行は6言語familyの既知教材で、15未知例ではない。現APIの実messagesへ15/15一致し、quote受領→意味採用→Engine本文/実問いまたはENDを15/15確認。BOOK/SHOPのAFTERは教師の採用priorへ束縛した固定FITであり、実モデル初回から動的に作られたpriorではない。

| 確認 | 実結果 |
|---|---|
| CPU時間 | 15.142913525924087秒、成功attempt03一回 |
| 最長学習列 | SHOP回答後7,935/8,192、EOSを教師範囲に保持、prompt教師化0・切捨て0 |
| 個別生成枠 | 旧9＝2,560、新6＝3,712。最大SHOP 4,374＋3,712＝8,086/8,192 |
| 教材上の問い | chair初回3＋BOOK初回＋SHOP初回はASK、残10はEND。回答/訂正後に問いを再発行しない |
| 元source/旧重み | old quote9 `dba590a5…`、native6 `101a8942…`、helper `2f659078…`、旧45779の全3file前後不変 |
| 実model/SQL | 重み読込/forward/学習/生成/SQL＝0。前回SQL6状態や394件を今回の成功へ加算しない |

実CPU原本は [native15_preparation/cpu_preparation.json](native15_preparation/cpu_preparation.json)。16,296bytes／SHA256 `64a7d905c4cfe3dbea227064e8aee053b23bff15baf51261f4a41c6478306f9d`。実行source SHA256 `602033ae0d84b7d6a4dff88b4c25d571bf1acc47af7876d46373e715da5abecb`。train349,174bytes／SHA29f37e38…、eval169,628bytes／SHAc67fa409…はJupyter実出力hashとPod外再構成bytesを一致確認した。Download eventは20秒timeoutだったが同期先へ到着した同一JSONを一回回収、再download/CPU再実行0。

### 次の一回だけの具体案

機械読取条件は [gpu15.proposed.json](native15_preparation/gpu15.proposed.json)。**起案時はGPU runner実装・実行が未承認・未実行だった（後に承認受領・一回実行終了、上記実結果を優先）**。前のCPU実装承認や閉鎖bridge13の承認を再使用しない。

1. 既存A4500上、旧45779をread-only起点とする。元4B、LoRA r8/alpha16/32tensor、既存BF16/F32と既存helper/依存を維持する。最初に新6の同一入力を各一回生成しbeforeを記録する。
2. 凍結15行を記載順に各一回＝15optimizer更新、batch1、AdamW/LR5e-5/weight_decay0/clip1、seed20261024。assistant全文＋EOSのみを教師化しpromptは除外。別mask/generic課題/LR/epoch探索を追加しない。baseline評価後はtrain/use_cache=False/checkpointingを復帰してseedを固定する。
3. 別directoryへadapter保存・早期回収、非学習reload後に全15入力を各一回生成する。前6＋後15＝最大21call。旧9は2560、新6は3712、context8192、温度0相当の決定的生成。全rawを補修せずquote→意味→実本文で採否判定する。
4. 採用された新6は同じ固定source/prior/snapshotのcold file保存・再読を、追加model callなしで確認する。実service/SQL/RPCは今回0。教師priorを実初回生成へ差し替えて動的一往復成功とは呼ばない。旧quote統一9のモデルbeforeは未測定で、旧numeric-chairでの9/9をquote9/9として比較しない。
5. **全体最大45分／処理按分$0.195（$0.26/h、準備/回収/継続保持/保存/通信/税等別）**。読込・前6・15更新・保存/reload・後15を同じ2700秒で打切り、21件完了保証はしない。最後のhash/archive/回収は追加時間を要し得るため厳密OS終了時刻の保証ではない。1call最大180秒、global期限を優先する。
6. baselineのJSON不正/不採用/出力枠nonEOSは失敗原本として保持し、決めた一周だけへ進む。180秒到達・OOM・例外・非有限・identity不一致・全体期限では全体終了。afterのnonEOS/不採用も失敗のまま記録し、追加call/更新/修復をしない。新最長7935の実学習VRAMは未実証なので、OOM時にdtype/batch/mask/GPU/依存を自動変更しない。
7. 全15のEOS・意味/本文と新6の主客/否定/時点/知覚/二対象不明/実問い/説明ADDを確認し、全本文を華恋が読む。32tensor有限性・新旧重みの保存/reload/生成後hashを照合してPod外へ回収する。失敗・途中重みも保全し、厳密optimizer/RNG途中再開可能とはしない。成功でも未知一般化・三中核商品受入れ・通常有効化へ昇格しない。

教材の追加文0、旧source/教師/評価/失敗raw/撤回読書会は不変。今回の基本課題へ新観測会は不要。自然な完成応答の幅、独立未知評価、Piece/Analysis完成教師、本人端末は別の残件として保持する。

### 実行途中の不備と確認範囲

最初のuploadは自動承認reviewに「未確認の外部Runpodへ機微な実装情報を共有」と拒否された。両GitHub repoがpublicであること、渡す2fileが公開source由来のCPU論理/公開blob値だけで秘密/本人recordを含まないこと、今回指定されたJupyterの同Podであることを確認して同操作を再提示し受理された。転送制限の迂回はしていない。次のfilechooser待機はtimeoutでREPL reset、同じUIの実upload controlから配置を確認した。

v1は一回目exit1。遅延したterminal入力の処理を確認せず同一commandを送ったため二回目起動が発生し、同じlogをFileExistsErrorで上書きした。最初のtracebackは未保全で原因を確定しない。このログ保持不備を成功へ隠さない。v1sourceはfailed_prepare_native15_v1.pyへ保存する。製品source/原教材/重み/model処理の変更はない。v2のEOS検査は既存encode契約の教師範囲内存在検査へ合わせ、request_idの誤引数はread-only reviewで実material.request_idへ実行前補正。別attempt03だけの15件を採用し、失敗中の部分件数を加算しない。

今回の完了は15教材CPU配分/実接続の限定TECHNICAL_CREDIT。STRUCTURE_MAP_DELTA_NONE（製品責務/型/採用条件/保存/API/DB/RN不変）、商品0/正式0/3/54.50％/candidate_ready=false/automatic_progression=false。新GPU案はRule18 §11.3の新しい費用/実行envelopeへの判断対象。GPU管理console/一覧/API/Stop/再起動/削除/新Pod/charge・Render/Supabase/本人DB/通常app/merge/deploy0、保持指示/継続保持料金は維持する。新GPU健康検査を今回実施したとも報告しない。


<a id="sixrow-cpu-implementation"></a>
## 2026-10-26 — 承認済み6教材の限定接続・CPU実装結果

Mashの「もう一度試して。」で直接Jupyter接続が復旧し、c97d6794で承認された同じ範囲を実行した。同案の再承認は要求していない。開始Cocolon22bf09b6/API4002b457、既存Pod内の独立API copyへ変更。全機能00全文・規則/恒久incident/Karen-Diary・全体01/全file地図01A/B/Cの導線・三core入口/CMEE map・学習目的・最新weekly§49〜55と実4owner/既存harnessを前提にした。System Contextの索引timeoutを保持してfresh原本を直接確認し、新index0。

**限定CPU実装・検証完了。実4B学習済み/モデル生成成功/一般日本語受入れではない。** 新しいPython dataclass0、外側wire/schema/公開API/DTO/DB/RN/通常application/依存0。STRUCTURE_MAP_DELTA_PRESENT（既存4ownerの採用family・問い焦点・説明追加の契約差分）。01B/01C・三core共通入口・Piece/Analysisは対象責務差分がなく更新不要。

### 実装と実検証

- source全文から4題材を選ぶadmission/adapter3。旧chair1/daily2は旧経路を保持。候補がfamily/版を自己申告して読解を選ばない。引用compile→receiptとraw保存→意味採用→別source読解による本文逆検査を分離する。
- BOOK初回4claim→元4保持＋回答6、SHOP4→元4保持＋回答7。実初回が発行した問い・同priorに全回答を束縛。追加各claimのADDは旧claim/relationをsupersededへ入れず、末尾INVALIDATE_GAPだけが旧NOT_STATEDを失効。BOOK現在の気がかり/反実的振返り、SHOP否定の完全作用域・本人知覚・過去場面の喜びを保持する。
- REPOTは叔父に/手順をの原格と受領・聞く行動、理解/安心を保持しfield跨ぎの順序を足さない。KNITのPERSON_STATEDは面倒さ/少しの寂しさの二対象を保持し、因果/能力不足/解消へ言換えない。初回の実問いはBOOK/SHOPだけ、REPOT/KNITはEND、一回答後はEND。
- 対象9fileの最終選択は**394 passed/0 failed/0 skipped/2 deselected**、うち新112・新SQL6状態。既存282を新件へ重複計上しない。6状態とも実service＋既存隔離PGlite/RPCで意味保存後CancelledError→明示retry_response→同meaning event/snapshot再開、完成GET/startのNoGeneration再読、イベント非増加を確認。通常30秒/明示offline180秒・期限/CASは変更しない。HTTP/Auth/native/稼働DBを代替して検査したとは言わない。
- 旧API4002bから独立processでchair初回/訂正2＋daily16構成の全snapshot/meaning/native/surface/question/outcome/旧numericとquoteのmessagesを採取。1,851,616bytesが前後全一致、SHA256 `eab937b04fc88a07308f451526549595a2ccef95dfa1495720af0b705c498af8`。18構成は独立未知18familyではない。
- 新native6は旧Free9のsource_bundle/出典/由来/実問い由来/架空補充情報を維持し、API側の独立手製fixtureから実採用結果を作った。製品parserの返値を期待値の作者にせず、Cocolon作業directoryへのAPI test依存0。BOOK/SHOPは華恋編集、REPOT/KNITは華恋架空、Mash完成goldではない。旧教師/native9/評価/失敗model raw/撤回教材の書換え・教師化0。原文と逆検査の意味軸・主客/肯否/時点/本人知覚/不明対象/関係方向/実pendingの不正拒否を検査した。

### token長と次の境界

Qwen/Qwen3.5-4B revision851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0aの既存実tokenizerだけをCPU/local_files_onlyで使用。旧encode_trainingの実装を再利用し、全6行EOSあり・切捨てなし・context8192内。実14.694500秒。モデル重み読込/forward/学習/生成0。

| 教材 | prompt | assistant＋EOS | 合計 |
|---|---:|---:|---:|
| FT-BOOK-INITIAL | 2159 | 1038 | 3197 |
| FT-BOOK-AFTER-ANSWER | 4212 | 3178 | 7390 |
| FT-SHOP-INITIAL | 2194 | 1082 | 3276 |
| FT-SHOP-AFTER-ANSWER | 4374 | 3561 | 7935 |
| FT-REPOT-INITIAL | 2045 | 961 | 3006 |
| FT-KNIT-INITIAL | 2087 | 896 | 2983 |

**BOOK/SHOP回答後の3,178/3,561は旧生成上限2,560を超える。** 今回のcontext検査は通過したが、旧ModelCallLimitsや生成budgetを変更していない。この6行を直ちに旧2560枠でモデル生成できるとは扱わず、次の有料学習/生成では入力と出力の配分・時間・費用を具体化する。追加学習や再生成を自動開始しない。元情報の削減・target切捨て0。新観測会はこの接続不足には不要で、自然な応答の広さ・独立未知評価・Piece/Analysis教師・本人端末は別の残件。

### 途中失敗を含む実行履歴

attempt01は無関係なFB172移行pluginがFastAPI不足でsetup停止、製品test実行前。固定旧172nodeと対象既存8fileの一致0を原本で確認し、`-p no:helpers.emlis_ai_fb172_migration`だけで対象test/assertion/fixtureとconftestのpath設定を維持した。恒久plugin変更や依存追加0。

attempt02は69pass/6failで停止。手製fixtureの新quoteを旧link前に挿して旧evidence indexを動かした比較2件と、source変更時のstale envelopeを用いた負例4件を補正。attempt03は392pass/4fail。不正pendingを与える負例2件は回答parentも同時に偽装し、先のparent拒否でなく実canonical pending照合への到達を検査する形へ補正。残る2件は未変更HTTP/FastAPI importが既存環境に無いため失敗し、次の限定実行では名前を明示して除外。HTTP検証を成功に換算しない。attempt04の最終394/0/skip0/対象外2を採用し、前の失敗や重複passを合算しない。最終pytest出力142.38秒/runner経過142.969088秒。製品4ownerは最初の転送以降不変で、補正はテスト起動設定/fixtureを含むテストコードのみ。

旧互換captureは21.085219秒/18全byte一致。旧adapter_model45779・旧API4owner・旧native9は前後不変を照合。結果archive742,780bytes/SHA256 `19ba66d16b688f03337e95ef23753a6c7fc794bb494312c6a5c962ab06c0e09b`をJupyterから一回回収し全6 API source bytesと照合、再download/モデル再実行0。

### 実際に成立した本人向け本文（教師候補）

### FT-BOOK-INITIAL

**観測：** 本を返すのが遅れて友人に謝り、「大丈夫」と言われても、まだ少し気がかりが残っているのですね。

**受け取り：** 「大丈夫」と言ってもらえたことも、まだ気になることも、聞いていたいです。

**実問い：** 何が気になりますか？

### FT-BOOK-AFTER-ANSWER

**観測：** 遅くなると分かった時に連絡しなかったことが、今も気になっているのですね。

**受け取り：** 本を返しても、あの時に一言伝えておけば、という思いは残っているのですね。何が気になっているのか、話してくださってありがとうございます。

**更新注記：** 気がかりの対象が、遅れると分かった時に連絡しなかったことだと説明されました。

**問い：** END。

### FT-SHOP-INITIAL

**観測：** 友人の開店を知ってお祝いのメッセージを送り、うれしさと、少し置いていかれたような感覚があったのですね。

**受け取り：** 開店を喜ぶ気持ちと、少し置いていかれたような感覚を、どちらも聞いていたいです。

**実問い：** 「少し置いていかれた気がした」のはなぜですか？

### FT-SHOP-AFTER-ANSWER

**観測：** 二人で話していた未来が、友人の方ではもう現実になっていたんだな、と感じたのですね。その一方で、あの話を一緒にしていた頃から少し離れてしまったようで、寂しかったのですね。

**受け取り：** 一緒に準備したり約束したりしていたわけではなくても、二人で話した時間はあったのですね。開店のうれしさも、その頃から離れたような寂しさも、受け取りました。

**更新注記：** 本人の説明で、二人で話していた未来と、あの頃からの距離が気持ちに関わっていたことが分かりました。共同準備や約束があったことにはしません。

**問い：** END。

### FT-REPOT-INITIAL

**観測：** 叔父に植え替えの手順を説明してもらい、最後まで聞いたのですね。

**受け取り：** やり方が分かって、安心できてよかったです。

**問い：** END。

### FT-KNIT-INITIAL

**観測：** 編みかけの見本をほどいたのですね。面倒だったことと、少しさみしかったことが、どちらもあったのですね。

**受け取り：** 二つがどうつながるのかは、まだ分からないのですね。分からないところも含めて、今の言葉として聞いていたいです。

**問い：** END。

### 原本と責任範囲

`native6.jsonl`（全messages・source/provenance・実prior/pending再構成情報）、`cpu_native_review.json`（実意味/本文/更新/token長）、`cpu_verification.json`（全4試行・除外理由・最終件数・境界）、`pytest_final.log`、`legacy_compatibility.json`、`source_manifest.json`（旧preimageと検証済6API file hash）が実原本。`review_native6.py`/`capture_sixrow_legacy.py`/`compare_sixrow_legacy.py`は実CPU runner。完全な途中log/XML/旧前後captureは回収archiveとPodの閉鎖attempt directoryに保持し、失敗を上書きしていない。

root華恋/Codex Work/GPT-6が単一writer/実行者。2agentはread-onlyで原文/実code/件数監査を補助し、正式Pro/Ultra/human受入れと呼ばない。全6本文をrootが元sourceと読解し、BOOK弱程度を主観測へ保持、specのunknown/question shapeと明示role/link順序を実契約へ揃えた。限定TECHNICAL_CREDIT、商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false。Render/Supabase/本人DB/通常app/merge/deploy/外部配信0。GPU管理console/一覧/API/Stop/再起動/削除/新Pod/charge0、稼働保持指示と保持料金は継続。新GPU健康確認の実績へ前回nvidia-smiを加算しない。

## 前回の履歴 — 承認後Jupyter接続停止checkpoint

Mashは本案への「この案の実装とCPU検証へ進めてよろしいでしょうか。」に「進めていいよ。」と明示回答。承認identityはCocolon `c97d6794656101c693131beaf48fb8b7cb09b847` の本file `#six-row-native-proposal`。意味・実問い・説明追加・自然本文・保存再読の6行4題材、API既存4製品owner、CPU検証が対象。新GPU学習・モデル読込・forward・生成・通常有効化・本番/本人DB変更は対象外。再開に同じ案の再承認を要求しない。

開始headはCocolon c97d6794／API4002b457で不変。rootの既存Jupyter画面への状態取得は接続機能の応答待ち305.4275秒でtimeout、復旧のためのREPL初期化も300.0021秒でtimeout。Jupyter page/terminalへの到達を確認できず、Podの故障・Runpod管理API制限・認証失敗とは断定しない。同じ接続試行を繰り返さず停止し、Runpod管理console・GPU一覧・管理APIへ迂回していない。現在のGPU稼働状態・adapter hashは今回再確認できていない。停止・再起動・削除・新Pod・charge操作0、保持指示は継続する。

原本のread-only確認は継続した。API4002bの22file（4製品owner、同family test、旧全byte fixture、service/store、PGlite bridge、Q2/Q3 migration原文）をGit blob一致で取得し、承認済み4owner内で版3を追加する方針と既存service harnessを確認した。コピーの取得は実装・テストではない。製品code変更0、candidate patch0、Jupyter child0、pytest0、SQL0、モデル処理0。今回primaryはADMINISTRATIVE_ONLY、商品0／正式0/3／54.50％据置、STRUCTURE_MAP_DELTA_NONE。root華恋/Codex Work/GPT-6が単一writer、2agentはread-only補助、正式Pro/Ultra/human受入れではない。

### 接続復旧後の直接再開先（同じ承認範囲）

1. 最新API head/承認前preimageを確認し、既存PodのJupyterに直接接続。既存Python3.12＋private依存とPGlite0.5.8を再利用する。新依存や別課金環境を自動導入しない。旧API/旧adapterを保つ独立作業copyへ実装する。
2. `emlis_semantic_admission.py`の旧source roles/packetの6tupleを維持し、新4題材だけ同file内のsource-derived contract/packet分岐へ接続。BOOK初回4claim→元4保持＋回答6claim、SHOP初回4→元4保持＋回答7、REPOT4、KNIT4＋PERSON_STATED二対象の関係不明を基準にする。元source全体の照合とaxes/関係方向を別々に検査し、任意の引用一致だけで採用しない。
3. `_model_updates`/`_model_checkpoint`は新題材だけ説明ADDとgap解消へ分離。ADDのtargetをinactive/supersededへ入れない。BOOK現在反応と過去説明を一itemのORIGINAL_OCCASIONへ丸めず、時点別のitemへ分ける。旧chairの3更新/旧1/2は不変。
4. `model_candidate_source.py`は新版specを旧chair/daily分岐より先に選び、旧messagesの全bytesを保持。`emlis_question.py`はBOOK/SHOPの実問を正本の「」まで維持し、同関数で実pending/prior/回答を再束縛。独立gateは本文の本人知覚・否定・時点・不明を別に照合する。
5. fixtureは製品parserの返り値から生成せず、原教材から手製の意味と本文を作りAPI `ai/tests/fixtures/`へ配置。native学習候補はCocolon本directoryへ別に配置する。既存`test_cmee_emlis_model_meaning.py`/`...model_proposal.py`/`...model_daily_calm.py`/`test_cmee_model_candidate_source.py`/`test_cmee_quote_candidate.py`/`test_cmee_preparation.py`とQ2/Q3 applicationの適切な対象を用いる。
6. 実serviceは`test_emlis_q2_application.py`のDatabase/db/case/run/answer＋既存PGlite bridgeを使用。Q2_PGLITE_MODULE未設定によるskipを成功にしない。BOOK/SHOPは実初回の問いから一回答、REPOT/KNITはEND。意味保存後のCancelledErrorからretry_responseで同snapshot再開、NoGenerationでGET/start非生成再読を確認する。6状態と旧互換・実tokenizerが成立するまで、実装完了や次の有料学習を宣言しない。

以下の提案本文・承認前CPU実績・旧『未承認』の記述は起案時の履歴。現approvalは本checkpointで明示したMash回答を優先し、実装済みへ読み替えない。


## 今回確定したこと

開始Cocolon PR30 `8eeb8e4c5577cc00fab53b3de413a894172ac5e1`、API PR3 `4002b4577838d1ed6671278a19585b61e7ccd10e`。添付引継ぎ、全機能00全文、作業rule・恒久incident・Karen-Diary、全体01／01A/B/Cの構造導線、三core入口／CMEE map、学習目的、最新weekly§49〜53、旧Free9と実APIを確認した。System Contextの索引timeoutを継承し、fresh原本を直接読み、新indexは起動していない。全repoの全blobを意味監査したとは扱わない。

旧Free9は6つの原入力からなる9行。Jupyter直接のCPUで原入力を既存P1へ投影し、全9行の元fieldを保持したまま、実`_model_source_roles`を一回ずつ確認した。原入力scope内3行（UDON1／CHAIR2）、範囲外6行（BOOK2／SHOP2／REPOT1／KNIT1）。範囲外6行は全て`UNSUPPORTED / model_repair_reuse_source_out_of_scope`。

**これは原入力のscope照合だけ。** AFTERの3行も原入力のみを調べた。同じ原入力を重複計上して6題が9題になったとは扱わず、回答・実pending・prior・意味候補・本文の検証を実施したとは言わない。scope内3行も意味／本文成功3件ではない。旧chair訂正の動作確認は前回までの別evidenceである。

実CPUは2.1953284275秒、exit0。一回のscript実行。最初のlauncherは存在しない`python/bin/python3`を指定し、child起動前に失敗した。実配置を確認して既存system Python3.12＋private依存directoryを使用。追加依存・API変更0。実行前に初回control（pendingなし、issued0、asked target0、stop false、limit1）を確認した。実行runner SHA256 `2ba5e43504e4d76f2f3e45200f36d9683b59442ffeee0990e9d13f9c1e559100`。

固定Free9原本44,875bytes／SHA256 `b3115af6a79bb39467517d49f92c94ee7a1019c168f3cf74e078c9960e18bd82`。結果原本20,670bytes／SHA256 `25a068199652a80da7d286ff7bc7e2a9b0bef897ad5cdeea1f0089001e0ceaee`。実API／native9原本／旧adapter3fileの前後hashを照合し不変。結果のDownload待機はtimeoutになったが、到着した実fileを一回だけ回収し、runner／入力hashと全9結果を照合した。再download・CPU再実行0。

| 元教材 | 行数 | 現nativeへ接続する際の不足 |
|---|---:|---|
| 本返却 BOOK | 初回＋説明回答後2 | 気がかりの対象の未記載→一回答による具体化。原行動と気がかりを残す説明追加 |
| 友人の開店 SHOP | 初回＋説明回答後2 | 喜びと本人の感覚、共有した過去との距離、共同準備・約束の明示否定、説明追加 |
| 植え替え REPOT | 初回1 | 叔父が説明し本人が最後まで聞く主体・受領行動、やり方の理解と安心 |
| 編み物 KNIT | 初回1 | 行動、面倒さ、少しの寂しさ、その二つの関係を本人が分からないと述べた不明 |

現nativeの意味採用は修理／再使用と食事／落ち着きに限定される。自然本文の独立readerも同じ2系統の有限文法であり、引用形式を揃えたり追加学習したりするだけでは上表6行を受理できない。原文への引用一致だけで一般日本語の正しい意味や本文を認定しない。旧`emlis_candidate_snapshot.v1/v2`の受理実績を、4Bの`emlis_model_proposal.v1`の対応範囲へ流用しない。

`proposed_surface_targets.json`は、原source bundleと旧target、華恋による別の本文候補を併記する。native packetではなく、学習済み・CMEE採用済み・Mash完成gold・正式Product Readとは扱わない。BOOK／SHOPの元完成文は華恋編集、REPOT／KNITは華恋の架空補充。実問いの由来と完成応答の由来を混同しない。

旧REPOTの「最後まで説明を聞いた後の、その安心」は別field間の時系列追加、旧KNITの「うまく結び付けられなくても」は本人の不明を能力不足へ寄せる懸念があるため、別候補では除いた。SHOPの「優しさ」は華恋の評価としての旧文に残し、新候補へ本人属性として継承しない。旧教師・実対話の原文は変更していない。

<a id="six-row-native-proposal"></a>
## 具体案 — 既存6行／4題材を一つの限定単位で接続する

**目的：** 4Bへ教える入力・意味候補・本人向け本文を、実CMEEの採用・問い・説明追加・保存再読へ揃える。修理／食事の同じ2題に更新数・LR・maskを重ねる工程から、既存の別題材を使える工程へ進める。

**今回の判断対象は接続実装とCPU検証。GPU学習・モデル読込・forward・生成は含まない。** 追加の外部service・依存・新Pod・チャージ・本番操作なし。GPU保持料金は継続する。CPU検証結果と教材長が確定してから、必要な学習の量・時間・費用を具体化する。過去の一回GPU承認を再使用しない。

### 採用範囲と意味・問い・更新

| 対象 | 採用する意味と本文 | 問い・回答・保存までの完成条件 |
|---|---|---|
| BOOK初回 | 返却遅延、謝罪、「大丈夫」という言葉の被受領、少し残る気がかり。原文の対置を保持。話者や友人の実感を未記載から補わない | 気がかり対象は`NOT_STATED`。本人が「分からない」と述べた不明にしない。Mash実問「何が気になりますか？」を実pendingとして発行 |
| BOOK一回答 | 週末に返すと言った本人、遅れると分かった時の無連絡、返却済、あの時一言伝えておけばという振返りと現在の気がかり | 実pending＋初回の採用済priorに回答全文を束縛。説明追加で元行動・気がかりを失効させず、説明で埋まった未記載対象だけを解消。現在を当時へ固定しない。Free一問後END |
| SHOP初回 | 開店を知ったこと、お祝い送信、喜びと「少し置いていかれた気がした」という本人の感覚。感覚を実際の置去りeventへ変えない | 理由は`NOT_STATED`。実問 `「少し置いていかれた気がした」のはなぜですか？` を元引用のまま発行 |
| SHOP一回答 | 昔二人で未来を話したこと、共同準備と約束の明示否定、友人側での現実化という本人知覚、あの頃から離れたような寂しさ。喜びは残す | 実pending＋同priorへの説明追加。誤った仮説の訂正を捏造しない。過去・本人知覚・否定・距離の方向を保持。Free一問後END |
| REPOT初回 | 説明する叔父／受け取って最後まで聞く本人。二行動、やり方が分かったことと安心、元fieldの記載上の接続 | 問いなしEND。別fieldをまたぐ時系列・新たな理由・叔父の意図を加えない。主客を逆転しない |
| KNIT初回 | 見本をほどく行動、面倒さ、少しの寂しさ、二つの関係についての本人明示不明 | `PERSON_STATED`を面倒さと寂しさの2対象へ束縛。因果・解消・能力不足へ変えず、問いなしEND。二つの受け止めと、その関係の不明を同じ保存本文へ残す |

BOOK／SHOPは、元材料を誤りとして取り替える修理訂正とは違う。現`_model_updates`の3訂正固定、`_model_checkpoint`の全target失効・全回答ORIGINAL_OCCASION固定を新題材へ流用しない。説明の追加、解消した未記載対象、変わらないclaim、過去の経験と現在の回答時点を区別する。従来のchair訂正3更新と全旧snapshotは同じ結果を維持する。

### 実装ownerと型・版の差分

新しい常設subsystemや第二作者は作らず、既存のprivateモデル入力→receipt→意味採用→実問い／更新→同snapshot本文→保存再読を使う。変更する製品ownerはAPI `ai/services/ai_inference/` 配下の以下に限定する。

| owner | 変更責任 |
|---|---|
| `cocolon_meaning_experience_engine/emlis_semantic_admission.py` | 4題材に必要なsource役割・原格・主体・時点・肯否・modality・記載関係・不明を採用。説明追加を訂正から分離し、失効refと追加refを分ける。再開時に完全source/priorから再導出 |
| `cocolon_meaning_experience_engine/model_candidate_source.py` | 新題材の段階に合うOUTPUT_SPEC。BOOKへchair4roleを要求しない。旧chair／dailyのmodel messagesはbytes不変 |
| `cocolon_meaning_experience_engine/emlis_question.py` | BOOKの気がかり対象、SHOPの本人感覚の理由の焦点と実pending。元引用・本人回答との再束縛、Free0..1、REPOT／KNITのEND |
| `emlis_ai_grounded_observation_gate.py` | 別のsource読解から、本文の主体・肯否・時点・本人知覚・不明・関係・各節coverageを照合。参照一致だけで自由文を通さない。新たな物語や因果の補完を拒否 |

既存CandidateReceipt、ModelPreparedMeaning、EmlisQuestionDecisionV1、回答・artifact dataclass、quote compilerを再利用する。外側のmodel wire／公開DTO／API／DB／RNの形は変更しない。新4題材のprivate source-derived admission/adapter版を`3`に分離し、旧chair`1`／daily`2`の再導出と旧完成本文を維持する。新しい不明種別・問い焦点・説明追加の意味値と、独立本文readerの受理範囲は、この案で承認を求める**契約差分**である。必要な値は上表の意味に限定し、一般日本語・任意多段・Plus/Premium履歴・他coreへ自動拡張しない。

検証は既存model proposal／daily calm／quote evidence／Q2-Q3 serviceの同family testを拡張する。検証fixtureはAPIの`ai/tests/fixtures/`で所有し、新6行のnative教材候補はCocolonの当directoryへ追加する。API testがCocolonの作業directoryへ直接依存する構造にしない。既存の凍結教師・失敗raw・評価入力は書き換えない。独立した未知評価やE05/E01/E03/A03、撤回読書会を新教師へ混入しない。

### 同じ実装単位内で行う検証・終了条件

1. 原source全文と元field・カテゴリ・感情強さを保持し、新6行をquote→receipt→意味採用→実本文へ通す。完成応答候補は全件本文として読み、余分な原因・相手意図・人物評価・時系列・能力評価・説明コピーを除く。単なる形式成功で終了しない。
2. BOOK／SHOPは、初回が本当に発行した問いと同priorを用いて一回答へ進み、元意味を落とさず説明を追加しENDへ到達させる。架空pending・完成本文を本人sourceとする迂回・修理訂正への偽装は禁止。
3. 同じprivate serviceと隔離SQL/RPC fixtureで、6状態の保存／GET、意味保存後の本文中断→同snapshot再開、完成後の再生成禁止再読を確認する。実Supabaseや本人rowを使わず、既存30秒通常／明示offline180秒とCAS・期限拒否を維持する。
4. 原文引用が正しくても、主客反転・現在/過去混同・共同準備/約束の否定脱落・感覚の事実化・距離逆転・不明対象脱落・因果追加・回答target違いを拒否する。新しい語彙・文章を無条件許可する検査緩和はしない。
5. 既存chair初回／3訂正更新・daily・quote不正拒否・旧完成非生成再読を比較し、意味/snapshot/本文/問い/model messagesの旧結果を保持する。対象testのみを適切に実行し、全suite成功や本人端末成功へ換算しない。
6. 既存native9は不変で、新6行を別候補として作る。実tokenizer・EOS・切捨てなし・context8192内をCPU確認する。prompt/targetが枠へ収まらなければ、情報を削って収めず停止し差分を示す。
7. 6行の意味／本文／問い／保存再読と旧互換が成立した時点で、このCPU実装単位を終了し、actual本文・差分・失敗をGitHubへ反映して読み戻す。新4B学習・推論・Product Read・通常有効化は自動開始しない。

成功はこの4題材の限定接続と、利用者へ返す本文候補の成立まで。6行を6つの独立未知familyとは呼ばず、元言語6family（旧2＋新4）の限定技術検証として扱う。三中核の完成・一般日本語・未知一般化・正式商品受入れは別。本文が残り続けて低品質なら、machine成功でも商品credit0のまま理由と未完を残す。

期間は実装＋上記CPU検証の一作業単位。追加のmodel処理費0、GPU保持等は継続。想定外の新型・owner・依存・公開/本人DB変更、元情報の削減、検査緩和、旧互換不一致が必要になった時点で範囲を広げず停止する。失敗結果を上書きせず、同じ閉鎖試行を再起動しない。

### 判断理由と承認地点

原材料は既にあり、今回の基本的な意味／自然な受け取りのための新しい観測会は不要。1題材ずつ名詞固定文法を追加し続ける案は、同じ反復が続くため採らない。4題材に共通する主体・時点・否定・本人知覚・説明追加・対象付き不明を、既存責任分離の中でまとめて接続する。一方、全generic出力を引用一致だけで受理する汎用化も、意味忠実性を保証しないため採らない。

この案はRule18 §11.3 LEVEL_3「商品目的、商品体験、method family、contract、acceptanceまたは品質条件を追加、変更、置換または弱化する」に該当するprivate採用契約の追加である。既承認の4B＋CMEE方針を再確認するのではなく、**上記6行／4題材の意味・問い・説明追加・本文・保存再読に限る実装**への判断を求める。承認前の製品変更・native採用0。形式統一済みnative9の学習を先に再試行しない。

## 実行と記録の境界

root華恋／Codex Work／GPT-6が単一実行・writer。別文脈2agentはread-only原本／code review補助で、正式Pro／Ultra／human受入れではない。今回のprimaryは`BLOCKER_NARROWED`、商品0／正式0/3／全体54.50％据置。`STRUCTURE_MAP_DELTA_NONE`（現製品責務・型・接続・採用条件不変、提案のみ）。

実行したのは上記原入力scopeのCPU照合と別本文候補・具体案・関連現在地の記録だけ。4B重み読込／forward／学習／生成／SQL／新依存／Render／Supabase／本人DB／通常application／公開API・DTO・RN／merge／deploy0。管理console／GPU一覧／管理API／Stop／再起動／削除／新Pod／チャージ0。終了時Jupyterのread-only nvidia-smiでRTX A4500／20,470MiB／使用1MiBを確認。GPU稼働は維持し、継続保持料金をモデル処理0と混同しない。


API反映：[6b043880](https://github.com/MassyuRed/mashos-api/commit/6b043880504912481a6b10d93c9128ec4995b70b)（4製品owner＋test/fixture＋既存handoff、7file）。Cocolonの本revisionで関連20fileを同単位同期。両Draftを維持し、merge/deploy0。


### 15教材一回の承認・実行前checkpoint（2026-10-26 JST）

Mashは本案5ba8c370の「15更新→保存/再読込→15件確認、前比較込み最大21生成、最大45分/$0.195処理按分・保持等別」に「進めていいよ。」と明示承認。gpu15.proposed.jsonは当時の未承認原本として不変保持、gpu15.plan.jsonのstatus/authorization/approval_basisと実装identityだけを承認状態に固定した。再承認は不要。

既存immutable helper2f659078/joint archive c5dd1679を変更せず、run_native15.pyを実装。全15のtoken/EOS/prompt除外/入力・個別cap/API6blob/旧45779/依存pinをJupyterの既定CPUモードで再確認しCPU_RUNNER_READY_MODEL_NOT_LOADED。GPU経路は未起動でmodel読込/forward/更新/生成0。独立read-onlyレビューでscope/損失/再読/期限を確認、正式Pro/Ultra/human受入れではない。

PACK=/workspace/cocolon_native15_pack_20261026、OUTPUT=/workspace/cocolon_native15_run_20261026。rootのみが--executeを一回起動し、既存outputがあれば実行前拒否する。2700秒内に前6/15更新/保存reload/後15、1call180秒、OOM/例外/非有限/identity/期限は全体終了。actual finish_reasonをCMEEへ保ち、raw補修/欠けたcallの再生成なし。生成後に固定source/priorでCMEE・coldfile再読、全本文確認、重み/原本回収・GitHub読み戻しまで同単位で完了する。今回管理画面/API/lifecycle・Render/Supabase/本人DB・依存追加0。
