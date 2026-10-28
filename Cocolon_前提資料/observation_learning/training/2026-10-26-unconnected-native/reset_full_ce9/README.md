# d431開始値だけの全文CE9対照 — 一回終了・新候補不採用

最終状態：CLOSED_NOT_ADOPTED。原本run.jsonのRAW_COMPLETE_PENDINGは凍結記録、[result_summary.json](result_summary.json)が最終閉鎖ownerです。

Mashの2026-10-28新継続指示に基づく新unit。旧Full CE9の再開・再試行ではありません。全15入力/教師、API7b9、元helper全文assistant＋EOS CE、同9順/LR5e-5を保ち、開始値だけ元d431へ戻しました。

9更新→別保存→112F32 no-grad reload→BOOK/SHOP各1生成を523.411685秒、処理按分$0.0407098で完了（準備/CPU/回収/保持等別）。BOOK2801token/EOSありでもroot閉じ漏れ、SHOP3584token/EOSなしの参照反復打切り。実receiver INVALID_FORMAT/TOKEN_LIMIT、実CMEEは両REJECT/semantic_receipt_not_validated、意味/本人本文0/2、snapshot0、cold対象なし。新1aef046eは通常不採用です。

[全raw・教師・本文の読解と比較](reading_review.md)。前回284fの全体JSON完結2/2に対し今回は0/2で、開始値変更だけでは根拠・役割・全更新・本人向け本文を成立させられません。旧named13だけが原因とは確認できません。4B一般の限界・未知品質も断定しません。

新CPU6.749000秒/model0、同15token/bytes・9順・LoRA設定同意味・112F32同key/shape/有限性を確認。同API353成功証拠を再利用、再実行0。manifest転記誤り1回、launcher構文誤り1回はいずれもmodel前停止、失敗source/logを保全。修正後のGPU試行は一回です。途中表示の誤読と空ファイル回収準備の失敗も読解記録に区別しました。

全原本/追加重み16,114,991bytes、149payload+manifest、SHA256 4467162042edf848fc34415c4f01d1c63c48dab33b3e96f4055891fbe807d111。Pod外全CRC/hash/size/source5/API/112F32有限・同形状を照合。Library libfile_b74941080fec8191b174c5583e26683f version0へ保全。元4B全重みを含まない追加adapter/archiveです。原d431/284f/全旧候補を保持します。

primary=BLOCKER_NARROWED。次は既存教師の意味・全更新・本人文を保つ段階的教材表現案のCPU具体化（未準備・未実行）。追加GPU/再試行/reader緩和/上限延長/次run自動開始なし。今回の基本欠陥に追加観測会不要。商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false、STRUCTURE_MAP_DELTA_NONE。GPU保持/Stop等0、通常app/公開API/DTO/DB/RN/Render/Supabase/merge/deploy変更0。
