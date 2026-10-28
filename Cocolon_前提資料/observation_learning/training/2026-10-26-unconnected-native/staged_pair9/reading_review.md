# 二段階の補助課題：教師・実生成・本人向け本文の読解

2026-10-28。source76d264dfde4a940cfc00518add649574da2f935d、API7b9ee073de03940ba71587297d8600b2b6094dd1。実Codex Work/GPT-6、root単独writer/executor。read-only helperの所見は正式Pro/Ultra/human Product Readではない。

## 何を変え、何を残したか

前回§95は教師のq/u名だけを短縮しても実生成が短縮名を使わず、意味/本文0/2だった。今回は表記変更ではなく、実際に学ぶ出力を二つへ分ける。Aは元v/a/qと意味の全6部分木、Bはquestion/updates/proseの全3部分木で、再結合すると元の全文bytesへ戻る。q/u/cid/rid/native名や原引用、否定・時点・様態・知覚・関係方向・全更新・本文・全bindの値は変えない。

全補助promptで元material全体とprior_adopted_interpretation、request_ref、semantic_profileを保持し、system/出力format/specを部分課題として明示する。Bは前段の正解Aをgiven_meaningとして受けるが、最終question/updates/proseは入力にしない。実際の本人向け3本文文字列がB入力内にないこともPod外で確認。通常full CEでも後半はgold前半を条件に学ぶが、今回はAがuser側に移るという差がある。誤ったAから続ける能力・補助形式の混入・全文への転移は実モデルで未確認のまま開始する。

原15教材行bytes、最終eval全bytesは不変。原284f開始、chair初回/訂正とdailyの元3行を更新1/4/7に保持。更新2/3はBOOK/SHOP A、5/6はBOOK/SHOP B、8/9は元BOOK/SHOP全文。通常assistant全文＋EOS CE/LR5e-5/seed/fresh optimizer/112対象、9更新・9forwardを使う。4短段階を両例へ与える13forward案より実行と形式を小さくした。従来の全文露出は各3回から各1回へ減り、学習内容/順序が変わるため、単独のq/u名変更と同じ一因子対照とは呼ばない。

## 実CPU

6.918286030秒、model load/forward/update/generation0、CUDA未初期化、SQL0。19教材中元15行を先頭にそのまま保持し、補助4行を別追加。全系列が切捨て0、prompt mask/全target/EOSを保持。分割元の2教師は再結合bytes/未変更decoderのnative candidate/evidenceが完全一致。

| 補助課題 | prompt | target＋EOS | 全系列 | 元全文 |
|---|---:|---:|---:|---:|
| BOOK A | 3633 | 2312 | 5945 | 7300 |
| BOOK B | 5207 | 607 | 5814 | 7300 |
| SHOP A | 3785 | 2527 | 6312 | 7777 |
| SHOP B | 5533 | 717 | 6250 | 7777 |

補助系列は約18.6〜20.4％短い。Bのprompt自体は元4387/4539より長く、全入力が短いとは報告しない。9順の合計tokenは57730→51897（10.10％減）、長二乗和398780542→319286549（19.93％減）。これを実速度/商品品質改善の測定値へ換算しない。

同API353成功、元教師の実CMEE/本文/別PID cold2件は、byte-identicalな元教師とsource/payload hashを照合して再利用。今回新たな意味採用/本文生成/cold再読が2成功したとは数えず、CPU追加admission/coldは0。91,746bytes/13payload+manifest/14member、SHA256 166155061c961ee318393623e7596d2a35bc8e1925f4b658e5af1e4879246a3d。Pod外CRC/hash/size/実source5/元15行/eval/再構成とB入力の非漏洩を照合した。

## 実モデル結果

元の完全promptで自由生成2件を、補助課題/gold A/修復なしで一回完了。9更新/112変更/別保存/112F32・3,833,856parameter同名同形状no-grad reload/2生成。509.436694379秒/$0.039622854処理按分、上限600秒/$0.047内。準備/CPU/回収/保持/保存/通信/税等は別。deadline/OOM/非有限/実行失敗なし、モデル再試行0。新2dfd7dbdは通常不採用。

| 条件 | 全体JSON完結 | 意味/本人本文 |
|---|---|---|
| §93 元284f・全文CE9 | 2/2 | 0/2・0/2 |
| §95 元284f・q/u名短縮 | 1/2 | 0/2・0/2 |
| 今回 元284f・補助A/B→元全文 | 1/2 | 0/2・0/2 |

### BOOK：同一根拠と意味／関係の混同

3322token/147.922450903秒、EOS/完全JSON、未変更named decoder PASS。receiver CANDIDATE_UNREVIEWEDの後、実CMEE REJECT/model_evidence_collection_invalid。13引用名は一意で全位置が原欄に実在するが、self_statement/statement_concession、returned/returned_concession、continuing_concern/answer_explains_targetの3組が同一source/field/quote。actual意味検査の同一evidence行拒否条件へ当たる。

本来10claimに対し13claimとなり、relation名3つをSTATEにする。本来7relationに対し9本でreturned_concession/answer_explains_targetのridが重複し、説明辺の起点もremaining_concernを失っている。非連絡の内容は前回の時点句より原回答に近づくが、self_statementは説明全体、no_contactは時点込みの全句へ過大化。time.exprはnullのまま、counterfactualも教師ANSWER_TIMEでなく過去にする。旧action_link/memo_linkの根拠ずれが残る。

6ADD+GAPの7件はあるが、ADD全6件のreplaceは各claimだけで附属relationを含まず順序も教師と異なる。update_note.binds.rrへrelation IDでなくupdate ID7件を指定。処理台帳文は消える一方、Observationは元行為と安心の言葉の再掲で気がかりを落とし、Reception/update_noteは本人の一人称発言を繰返す。人への自然な受け取りは未成立。これら静的所見を実CMEEが最初に返した拒否理由へ合算しない。

### SHOP：原欄対応は回復、役割誤配と旧意味の再ADDで打切り

3584token/163.095296611秒、EOSなし、11番目のupdate冒頭で停止。実receiver TOKEN_LIMIT→実CMEE REJECT/semantic_receipt_not_validated。完成した部分配列を読んだだけで、完全JSONへ補修/再採用していない。

quote18/18が指定source/fieldに実在し、前回compactの0/14から原欄対応は回復。time.exprの文字列"null"も0。ただし一意なsource/field/textは13で、知覚2・距離3・寂しさ3のquote重複がある。shared_talkは過去の会話でなく元入力の開店認知と祝う行為へ割当。16claim/一意12で、知覚2・距離2・寂しさ3へ増殖し、answer_concessionもclaim化する。否定の共通作用域、本人知覚のmodality、時点の分離が未成立。

6relationは旧action_linkを落とし新de_linkを重ねる。memo_linkのevは原memoの逆接でなく回答の知覚、answer_concessionも知覚を根拠にし、距離と寂しさの全scopeも保持しない。完成ADDは10件で、11件目は未完断片。opening_known/celebration_sent/joy/felt_left_behindという旧4意味をADDし、past_referenceという関係を別ADDする。必要な新roleの附属更新とGAP解消へ到達しない。proseキー自体がなく、SHOP本人本文を読了/合格とは報告しない。静的役割欠陥を未到達の実意味検査理由へ置換しない。

### 結果と次の判断点

実意味/本人本文0/2、採用snapshot0で実modelのcold再読は対象なし。§95より原欄対応は改善したが、意味IDの混同と全更新/自然本文は成立しない。学習系列の短縮とteacher再構成を、モデルの短課題習得や全文への転移成功へ読み替えない。rootが両raw全文を読み、read-only helperが両件を独立確認。正式human Product Readは依頼せず、商品0/正式0/3/54.50％据置。

全原本16,150,601bytes/152payload+manifest/153member、SHA256 25251908388caf414868f30867862c5288ff2c2606fdfbe0c2ee959f3c35b7bf。Pod外で全CRC/hash/size、CPU原本/実source5/API全source/先行BOOK/112F32有限・初期-reload同名同形状/9順と有限gradientを照合。Library libfile_cf473b4d4d708191821345dd2db43674 version0へ保全。これは追加adapterと原本であり、base4B全重みを含む単独モデルではない。原284f/d431と全旧候補を保持する。

実行前reviewでlauncherに残った旧compact_teacher.pyのAST対象をlaunch_once.pyへ修正してからsource公開/CPU/実行した。失敗したlauncher試行は0。最初のBOOK先行回収はcompleted0を見て読まず、完成後だけ回収した。raw報告のRAW_COMPLETE_PENDING/実行planを凍結保持し、result_summaryを最終閉鎖ownerとする。

primary=BLOCKER_NARROWED。追加学習を重ねる前の次候補は、保存2dfdを使い、今回すでに固定した補助A/B4入力を非学習で生成比較して、短課題自体の未習得か全文への転移不足かを切り分けること。入力/教師は今回保存済みだが、その追加model call・実行枠は未実行で自動開始しない。回数/LRを変える新学習、reader緩和、根拠重複除去、raw補修、上限延長、次runは0。今回2件には完成教師があり、新観測会は現欠陥の正解不足を補う目的には不要。未知一般化/Piece/Analysis教材は別。GPU保持、Stop/restart/delete/管理API0、SQL/通常app/公開API/DTO/DB/RN/Render/Supabase/merge/deploy変更0、STRUCTURE_MAP_DELTA_NONE。
