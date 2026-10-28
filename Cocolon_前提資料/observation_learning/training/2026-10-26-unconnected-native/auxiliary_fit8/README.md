# 既存補助4教材を2周する8更新 — 2026-10-29

Mashの新しい「4B学習＋CMEE接続を続けて」に基づく新単位。開始PR30=5184f7a/API=7b9ee073。前回の補助診断は閉鎖済みで、旧run/lock/残枠は再利用しない。目的は保存2dfdに残るquote/claim/relation/時点証拠/update単位の混同を、既存の出所付き4教師で改善し、元全文2件の実CMEE採否まで確認すること。新観測会は現2件に不要。

保存2dfd開始、A-BOOK/B-BOOK/A-SHOP/B-SHOPの不変4行を同順で2周＝8更新。元helperの全文assistant＋EOS CE、LR5e-5/clip1/seed20261024/fresh AdamW/112対象を維持。アンカー/元全文教師の追加学習は今回は行わず、その影響と旧9回帰未検証を残す。旧15/eval/補助4行/指示/CMEE採用条件を変更しない。別保存し、112F32を非学習で再読込して補助4入力＋元全文BOOK/SHOP2入力を計6生成。補助A2816/B1024・全文3712/3584、8192context・greedy・各180秒。literal教師一致を全文生成の新Gateにしない。生成可能時間内の固定6callで、partial補助はCMEE採用へ提出せず、全文2件だけ未変更receiver/意味/本文/条件付き別process coldへ渡す。

最大1500秒・処理按分$0.117（表示A5000$0.28/h、準備/CPU/回収/保持/保存/通信/税等別）、parent1490秒+kill grace10秒。前回の実測から約807秒/$0.0628を目安とするが、6call完了を保証しない。期限/OOM/非有限/identity不一致で停止、再試行/追加生成/reader緩和/次run自動開始0。GPUは保持、通常app/API/DTO/DB/RN/Render/Supabase/merge/deploy変更0。旧重みは全保持、新重みを通常有効化しない。

## sourceと実行境界

- run_fit8.py：新8更新/別保存/no-grad reload/固定6生成。
- prepare_fit8.py：実tokenizer/全labels/EOS/8順、現行CMEE実module、元全文prompt同一、正解教師2件と保存raw2件のCPU対照。
- consume_fit8.py：新runのcounterを正しく検査し、全文2件だけを旧consume_named9と同じ未変更receive/prepare/generate/coldへ渡す。
- fit8.plan.json：無効の準備原本。実CPU確認後の今回実行条件は別保存する。
- static_cpu_check.json：静的確認/実行拒否。model/forward/生成0。
- cmee_restore_payload.json：130原本の実SHAは不変。復元目録の古いAPI版/17容量欠落・不整合を実bytesで補正した、新しい復元用目録。

元archiveのAPI実ファイル5件は既に現7b9と同一だった。古かったのは目録のsource_api_refと容量情報であり、readerの古さ・過去出力の不正を意味しない。省略されていたlegacy/frozen等12原本は同じGit blob/SHAから復元。新Podで130原本＋最新API5hash/module実位置を照合してから、CPU教師2件と保存2dfd原出力2件を確認する。原目録・旧runは変更しない。

実行担当はCodex Work/GPT-6 root一人。独立補助は正式Pro/Ultra/human受入れではない。STRUCTURE_MAP_DELTA_NONE（実験順/保存物だけで商品責任・wire・reader不変）。商品0/正式0/3/54.50％・candidate_ready=false/automatic_progression=false。


## 実CPU確認と開始

新Podの実CPU確認は12.855981432秒/model0/forward0/生成0/SQL0。8順48,642token、4行の全target/EOS/prompt mask、全文2prompt同一を確認。現行API7b9実module位置/5hash/130原本を照合し、正解教師2件は意味/本文2/2。保存2dfdの元全文raw2を同APIへ再読して意味/本文0/2（BOOK model_evidence_collection_invalid、SHOP semantic_receipt_not_validated）を確認。教師対照とモデル結果を混ぜない。実CPU原本はcpu_check.json、cpu_preparation.log/.exit、今回条件はruntime_authorized_plan.json。fit8.plan.jsonは無効の準備原本のまま。source a6198b6dbf34a810264fd42e42d69626e75709f7から一回の8更新/保存/再読込/6生成を開始。
