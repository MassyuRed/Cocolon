# q/update参照名だけの可逆短縮 — 2026-10-28

status: SOURCE_PREPARED_CPU_PENDING

Mashの新しい「4B学習＋CMEE接続を続けて」に基づく一作業。元15教材を不変保持し、BOOK/SHOP回答後の派生2教師だけ、引用名をq0…、更新名をu0…へ短縮する。strict named decoderが構文名から索引へ消去する場所だけを変え、cid/rid/unknown/source/prior・原引用・意味・関係・全更新・本人本文・順序は保持する。段階maskは長いteacher-forced sequenceを短くせず、旧helperの連続label条件にも抵触するため今回は採用しない。

CPUで実decoderのnative/evidence完全一致・逆復元、実token削減、全15prompt/他13行bytes不変、original/compact各raw自身のreceipt再導出・実意味/本文採用・cold再読を確認する。合成教師であり実4B生成・商品受入れではない。rawに結び付くreceiptの差は保持し、それ以外のsemantic snapshot全field・意味hash/proposalhashを完全比較する。

比較基準はJSON全体完結2/2だったFull CE9（初期284f）とし、旧d431対照や新1aefの再開ではない。短縮教師以外のprompt/API7b9/全文assistant＋EOS CE/LR5e-5/seed/fresh optimizer/9順/原284f/BOOK3712・SHOP3584tokenは維持する。CPU結果を読んだ後だけ、一回の9更新→別保存→112F32 no-grad reload→各1生成→実CMEE受領・本文読解・回収の実行可否を判断する。GPU枠は既存600秒/$0.047処理按分、各生成180秒、timeout590秒＋kill10秒。準備/CPU/回収/保持等は別。

実Codex Work/GPT-6、root単独writer/executor、read-only helperは正式Pro/Ultra/human受入れの代替ではない。API/decoder/意味/本文reader/通常app/公開API/DTO/DB/RN/Render/Supabase/merge/deploy変更0、GPU lifecycle操作0、retry/reader緩和/上限延長/次run自動開始なし。原284f/d431/全旧候補は保持。商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false、STRUCTURE_MAP_DELTA_NONE。今回の基本欠陥に追加観測会は不要。
