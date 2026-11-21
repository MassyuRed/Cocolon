# q/u参照名短縮：実生成・教師・本人向け本文の読解

2026-10-28。実Codex Work/GPT-6、root単独writer/executor。read-only helperの照合は正式Pro/Ultra/human Product Readを代替しない。source664ce89431d31090e26869b3ef66dd687713275d、API7b9ee073de03940ba71587297d8600b2b6094dd1。

## 今回の一因子と実CPU

比較基準は§93の原284f開始FullCE9。直前§94の元d431開始対照や、失敗候補1aefから継続しない。全15prompt、他13教材の行bytes、元helper全文assistant＋EOS CE、9順、LR5e-5、seed、fresh AdamW、112対象、生成枠を維持し、BOOK/SHOPの教師だけq.id/ev名をq0…、update$id/ur名をu0…へ短縮する。cid/rid/uid、native role名、原引用、literal、関係、全更新、本人向け本文は変えない。原15教材は不変、別の派生教材を保存する。

同じ長い教師のloss maskだけを分割する案は、実contextを短くせず、元helperの連続全文labels条件とも異なるため選ばなかった。新しい損失係数・回数・LRを同時変更せず、既存named decoderで意味を一字も落とさない最小の表記短縮を選んだ。短い名前がモデル品質を改善することは実測前に断定しない。

Jupyter実CPU51.926155245秒、model load/forward/update/generation0、CUDA未初期化、SQL0。BOOK教師2913→2724token、SHOP3238→3013token。全文contextは7111/7552、promptは4387/4539で不変。実9順の系列合計56488token、長二乗和380262430。同API353成功は原本hash照合による再利用で再実行ではない。

元/短縮の両件を実receiver→意味準備→既存本文生成へ渡し、4件GENERATED。decode後candidate/evidenceと逆変換packetはexact、全snapshot項目はreceipt以外exact、snapshot_ref/proposal_ref・意味・全更新・本文・問いの値はexact。rawが変わるため各自のreceipt.raw_outputとそれを含むsnapshot文字列は異なり、full outcomeの跨variant完全一致はfalse。receipt以外を曖昧に除外する比較は行っていない。各自保存の別PID cold full outcomeは4/4完全一致。同rawからのreceipt再導出も一致した。これは完成教師の保存確認であり、実4Bの意味/本文4成功ではない。

BOOK教師は、遅くなると分かった時に連絡しなかったことが気がかりだという説明と、返却後も残る後悔を保持する。SHOP教師は、二人で話した未来が友人側で現実になった知覚、当時からの距離と寂しさを保持し、共同準備・約束の存在へ変えない。どちらも元教師の本人向け本文をそのまま残した。

## 実モデル結果

実9更新・112変更・新重み別保存・112F32/3,833,856parameter同形状no-grad reload・自由生成2件を一回完了。518.695366979秒、処理按分$0.040342973（準備/CPU/回収/保持/保存/通信/税等は別）。期限/OOM/非有限なし、実試行1、再試行0。新3a43df7fは通常不採用。

| 条件 | BOOK | SHOP | 全体JSON完結 | 実意味/本文 |
|---|---|---|---|---|
| §93 原284f/元教師/全文CE9 | 2710token/EOS、named未定義参照 | 3489token/EOS、named重複参照 | 2/2 | 0/2・0/2 |
| 今回 原284f/q・u名短縮教師/全文CE9 | 2731token/EOS、named decode成立 | 3584token/EOSなし、本文途中で打切り | 1/2 | 0/2・0/2 |

比較基準に対し全体JSON完結は2/2→1/2、処理時間も518.477→518.695秒で短縮しない。教師tokenは短くなったが、両実生成はq0…/u0…を一つも使わず、短縮表現を習得した証拠はない。元d431対照のJSON0/2との比較だけで今回を改善と呼ばない。

### BOOK：名前形式を通っても同じ根拠の重複と役割の誤りが残る

2731token/126.017713273秒、EOS・strict JSON全体完結。未変更named decoderはPASS、receiverはCANDIDATE_UNREVIEWEDだが意味採用ではない。実CMEEはREJECT/model_evidence_collection_invalid。actual APIの_v3_packetはevidenceの同一行重複を拒否する。11引用名は一意かつ指定欄に全て実在する一方、no_contact/late_awareness/answer_explains_targetの3名は同じsource/field/「遅くなると分かった時点」を引用し、decode後同一evidence3行となる。

no_contactのtext/pred/evは「連絡しなかった」でなく時点句のままで、その時点をNEGATED EVENTにしている。late_awarenessも同じ時点を重複する。self_statementは「週末に返す」と言ったことと連絡しなかった説明全体を一命題にする。counterfactualの内容と返却・継続する気がかりの短句は旧d431対照より正しくなり、説明辺もremaining_concern→no_contactへ戻るが、counterfactual時制は教師ANSWER_TIMEと異なる。これは参考の静的相対所見で、原284fの一因子対照の成功creditではない。

旧action_linkは原memo_actionでなく回答self_statementをevに使い、memo_linkも逆接全句でなくremaining_concern短句だけを使う。6ADD+GAPの7件はあるが、ADDのreplaceはclaim単独で必要な附属relationを含まない。proseのcrへrelation ID answer_explains_targetを混入する。Observationは「本人の原入力として保持します」、Reception/update_noteは「追加され、説明が追加されました」「本人の訂正で…更新され」という内部処理の説明になり、回答が訂正だったとも原文は述べていない。原回答の復唱から本人向けの自然な受け取りへ進んでいない。これら後段の静的所見を、実CMEEが返した最初の拒否理由へ合算しない。

### SHOP：fieldを役割名に置換し、本文列挙の途中で停止

3584token/161.859242249秒、EOSなし、Observation文字列途中で打切り。実receiver TOKEN_LIMIT、実CMEE REJECT/semantic_receipt_not_validated。部分配列を読解しただけで完全packetへ修復・再採用していない。

14引用は名前一意でも、fがshared_talk/answer_joy等の役割名・関係名になり、memo_action/memo/answer_text_privateという原欄に0/14一致。shared_talk/perceived_realizationは回答由来なのに元入力@s0にも誤配する。14claim/一意12でfelt_left_behind/felt_distanceが重複、answer_explains_targetをclaimにも増殖し、11のtime.exprがJSON nullでなく文字列"null"。2claimでは関係種別をmodalityへ混入する。

記述上は7ADD+GAPの8更新へ到達しているが、原役割と引用/時制/scopeが誤対応し、replaceには各claimしかなく必要な関係を伴わない。GAPの根拠は説明scopeでなく時点句。6relationも全接続表現でなく部分引用へ割り当てる。bindsのcrに重複と非claimのmemo_linkが入り、Observationは知覚を二度反復し、「と理解し／と共有し／と受け取り」という列挙の途中で止まる。Receptionとupdate_noteの本文値は生成されていない。明確な内部prompt/schemaの漏洩は確認せず、原回答の再掲と処理説明的な語りとして記録する。

### 採否、保存、次の一作業

実意味/本人本文0/2、採用snapshot0、実modelのcold再読は対象なし。新重み通常不採用、商品0/正式Product Read0/3/54.50％据置。rootが両raw全文を読み、read-only helperがBOOK/SHOPを独立確認。正式human Product Readは依頼していない。

全原本16,641,896bytes、161payload+manifest/162member、SHA256 43b53b96cda2516c6fbedf7cd7c9ef73fdb655830a3e234b3d2d6b6870e66919。Pod外の全CRC/hash/size、CPU原本一致、実source6/API全source、先行BOOK同一、112F32全有限/初期とreloadの同名同形状を照合。Library libfile_8c15de9185888191a1356804725b85ba version0へ保存。これは追加adapterと原本であり、元4B全重みを含む単独モデルではない。

今回のCPU/launcher/GPUに失敗・再実行なし。JSON表示のlocator待機1件はno_matchesとなり、通常の最新AX表示で進行確認しただけでrun/rawへの影響0。Pod外の追加照合でpost_release_allocated_bytes=0を不必要に仮定したassertが一度停止。実rawの17,039,360bytesを保持し、その条件だけを除去した。GPU processのexit0/重み/原本は不変、実model再試行は0。原runのRAW_COMPLETE_PENDINGと実行planは凍結保持し、result_summaryを最終閉鎖ownerとする。

primary=BLOCKER_NARROWED。無損失の表記短縮だけでは、この固定9更新で根拠対応・全更新・本人文を成立させられなかった。次は既存教師の原欄→引用→役割→附属更新→本人向け本文を小さい単位で教え、最後に元の全文packetへ戻す手順のCPU候補を具体化する。未準備・未実行で、追加GPU/同条件反復/別係数/上限延長/reader緩和/自動次runは行わない。現在の二件には完成教師があり、新観測会は現欠陥解消に不要。未知一般化やPiece/Analysisの教材残件へ拡張しない。GPU保持、Stop/restart/delete/管理API0、SQL0、通常app/公開API/DTO/DB/RN/Render/Supabase/merge/deploy変更0。全体mapは実験fileの追加のみ、CMEE責務のSTRUCTURE_MAP_DELTA_NONE。
