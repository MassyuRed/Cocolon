# 保存済みexpanded30重みの評価結果 — 再読込成立、品質は改善せず

状態：**RUN_CLOSED_REJECTED_CANDIDATE**。この一回・承認・outputは閉鎖し、再使用しません。保存109c重みは通常不採用です。

Mashが具体案d02655837be135f02022e16346fc95488de52bd4の「追加学習0→保存済み重みの非学習再読込→15件確認、最大45分・処理按分$0.21（準備・回収・保持等別）」へ「進めていいよ。」と明示承認。承認3fieldだけを反映・読戻したsource **d014e45c9a94f1ebc1e193ea7d6d1513280e8dc2**、既存A5000/Pod bkj4qvnhwtdqc2のJupyter直接でroot華恋がGPU PID **142245** を一回起動しました。

## 実行と到達点

元[expanded30](../expanded30_result/README.md)のbd5d/30更新/保存後STOPはbytes不変で保持します。今回の更新は **0**。新しいOS processで保存adapterを非学習reloadし、全112F32/3,833,856parameterの全key・shape・値一致と全parameter no-gradを確認後、凍結15件を各一回生成しました。前回のtarget名照合の不整合は解消しました。

GPU処理は **1285.8977515849983秒（21分25.898秒）×$0.28/3600＝$0.1000142695677221**。最大2700秒/$0.21内です。準備/CPU診断/回収/保持/保存/通信/税等は別。before0、追加更新0、15call開始/完了、再生成/retry/追加GPU試行0。BOOK回答後・SHOP回答後・KNITは各3712tokenで未完結、per-call timeout/OOM0です。

[run.json](run.json)の実行statusはRAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEWのまま保持し、最終判断を[result_summary.json](result_summary.json)/[runtime_checkpoint.json](runtime_checkpoint.json)へ分けました。元30更新run/log/plan/runnerの4hashは[training_origin](training_origin/)へ保存し、新runの0更新と混ぜません。新承認planのAUTHORIZED_ONCE_BOUNDは当時の原本で、新しい実行許可ではありません。

## 同15件の比較

| checkpoint | EOS | strict JSON | 意味採用 | 本文成立 | 新6本文 |
|---|---:|---:|---:|---:|---:|
| 初期1d218763 | 15 | 15 | 11 | 9 | 0 |
| continuation30 dd1188e8 | 12 | 12 | 11 | 9 | 0 |
| ordered30 483d74b7 | 13 | 8 | 3 | 3 | 0 |
| expanded30 109c／今回の非学習評価 | 12 | 12 | 11 | 9 | 0 |

旧9はEOS/JSON/意味/本文とも9、新6はEOS/JSON3・意味2・本文0です。旧9とREPOTの **raw_text** は初期1d/ddに全bytes一致し、旧9のparsed packetは教師全値一致、実本文・問いも教師の該当自然文と一致しました。raw record file全体はadapter metadata等が異なるため同一fileとは言いません。[case_comparison.json](case_comparison.json)に全15のraw/基準原本のidentityと比較を保持します。

ordered30の退行から復旧した範囲はありますが、初期1dの11/9を越えず、新6本文の不足は解消していません。対象16→56moduleへの拡張とこの30更新が、この固定15件の品質改善へ結び付いたとは確認できません。容量不足の原因確定、MLP学習一般の否定、4B能力の上限確定にはしません。

旧9は椅子初回/訂正を各3IDとうどん3IDにした2言語family・3段階パターン、新6は4言語familyです。全15は既知教師FITで、15独立未知事例や一般化成功ではありません。

## 固定CMEE・保存再読

CPU consumer PID **149533**、固定API6b043880/完全copyを使用して **101.05638900503982秒**。全raw15を無補修で受け取り、意味11・本文9、採用snapshot11の別process cold-file再読は **11/11一致、失敗0** でした。この11件には **本文なしのSHOP初回/REPOT2件** を含み、本文11完成とは数えません。追加model/更新/SQL0、service_saved_roundtrip=false、dynamic_prior=falseです。

| 新6件 | 実CMEE採否 | 本文 |
|---|---|---|
| BOOK初回 | model_v3_unknown_not_source_bound | なし |
| BOOK回答後 | semantic_receipt_not_validated | なし |
| SHOP初回 | 意味採用／model_surface_not_validated | なし |
| SHOP回答後 | semantic_receipt_not_validated | なし |
| REPOT | 意味採用／model_surface_not_validated | なし |
| KNIT | semantic_receipt_not_validated | なし |

[診断summary](diagnosis/summary.json)/[case全15](diagnosis/cases/)とsaved/completed/cold各11原本に採否・本文・問い・同一再読を保持します。大きな完全diagnosisはGitHubでmetadata＋caseへ値不変で分割し、再組立て一致を確認しました。元の完全diagnosis.json **2,929,933bytes/SHA256 e8a915474c979eddbec43aabf066494e959b7d269c711c107f03a955a5f4daf9** はarchiveへbytes不変で保全しています。

回答後priorは凍結教師由来です。実生成初回からの動的thread、実service/SQL/Auth/RN/本人端末の保存再読、未知一般化、正式商品受入れは今回未確認です。

## 全件読解と残る不足

[旧9読解](reading_reviews/old9.json)/[新6読解](reading_reviews/new6.json)にrootとread-only補助の読解・実採否overlayを保存しました。補助を正式Pro/Ultra/human受入れへ換算しません。

- 旧9：意味/更新/本文を維持しましたが、椅子は近い言い換えと喜び・再利用の反復が中心です。訂正は指導/共同修理/再利用の喜びと全3更新を保持する一方、更新文は処理説明として硬いまま。日常うどんは余分な背景補完がなく穏当ですが、新しい深さの証明ではありません。
- BOOK初回：不明の束縛不正、未記載の安心感と本文内質問が残ります。Receptionの二重質問は一方消えましたが、状態を聞いたという報告です。
- BOOK回答後：読解用の完全candidate prefixだけでは10claim/7relationがあるものの、役割・時点が混同し、教師7更新に対しADD1、GAP解消なし。3本文が同じ一人称復唱となり、未記載の直接発話を補完し、引用表の反復で打切り。prefix抽出をraw補修/採用には使っていません。
- SHOP初回：喜びと置いていかれた感覚の表面保持はありますが、本文内質問・近い復唱・开店表記が残ります。意味採用と本文成立は分離します。
- SHOP回答後：読解用prefixは11claim/5relation/ADD1（教師6relation/8更新）。関係・根拠・全更新が崩れ、回答済みの話を再質問し、一人称と呼びかけが混線。禁止start座標44回と引用表反復で切断しました。
- REPOT：意味packetは復旧しましたが、本文案の説明する側/聞く側が二重に反転したままです。raw_textは初期1d/ddと一致し、新しい改善ではありません。
- KNIT：本人明示の不明と対象の断片はありますが、Receptionへsystem指示が逐語露出し、unknown_idが2899桁の数字反復となって引用/更新/末尾へ未到達。orderedで見られなかった指示露出が再発しました。

次は既存教師で長い意味・全更新・自然な本人向け本文を同時に保持する学習設計を見直す段階です。同じ回数/LRだけの連続有料試行、reader緩和、gold prefix、教師置換や未完結JSON補完へ自動進行しません。**今は新観測会を必要条件にしません。** 既存の既知教材自体で未成立が残り、教材不足を今回の原因と確定していないためです。

## 重み・原本の保全と閉鎖

weights **109c3dda16b19d2f110d6f8e2ded07f47e981b9690970ca95b9046780bffb85a** は元の学習後保存値と完全一致、112F32全要素有限をPod外でも確認。全15raw、全診断/cold原本、source/承認plan、元30logと新0更新record、早期snapshot2、読解と外部照合を保全しました。

最終archive **14,759,092bytes / SHA256 b040a720ce676f4ffec74ef332e43dc48371092e2a38035a10c615ffd423730e**、全86payload＋manifest/87memberを照合し、[保存重み・全原本version0](https://chatgpt.com/library?file_id=libfile_cff4b34dfaa4819193affe63157e47cf&account_id=personal)へ保全済みです。[final_recovery.json](final_recovery.json)/[全manifest](final_manifest.json)に転送archive79payloadとの別identityも記録。元base全重み/optimizer/RNGは非同梱、strict optimizer resumeではありません。

worker142245/149533は終了、GPUはA5000/1MiB/24564MiBで稼働保持。GPU Stop/restart/delete0。通常API/意味型/wire/reader/DTO/DB/RN/Render/Supabase/本人DB/価格/依存/モデル選定/merge/deploy変更0、STRUCTURE_MAP_DELTA_NONE。primary=BLOCKER_NARROWED、非学習reload/cold-fileまでの限定TECHNICAL_CREDIT、**商品0/正式0/3/54.50％/candidate_ready=false/automatic_progression=false**です。
