# 受け取り部分へlossを絞る4更新の一回候補

実行前。局所分岐の実測は[branch_check](../branch_check_20261025/README.md)。教師「ようになって」がrank2/p23.73％、actual「ようになった」がrank1/p50.24％、gap0.75だった。全体平均lossの改善だけでは未解消だった局所誤りへ、同じ教師のreceptionだけを学ぶ最小candidateを一回行う。形式tokenの比重が原因という説明は仮説で、有効性は未確認。

Mashの今回の継続指示の範囲で、root華恋が単一実行/編集/反映owner、補助agentは読取review。Codex Work/GPT-6、別model Pro/Ultraの実行とは称さない。OBSERVED_BLOCKER_MINIMAL_FIX、Rule18 LEVEL2内の学習実装technique。商品目的・method family/意味契約・教師・採用条件・既存private注入routeは変更しない。既存LoRAのloss対象だけ変える。全体現在地・必読incident・work rules・全体設計01/全file地図01A・最新weekly§31/観測学習意図・原raw/実codeを確認。System Contextの最新cache未生成は保持しfresh原本から進める。

既存公開済み架空chair2教師だけ、a8baf0…保存重みから新optimizer。元messages1995/5018token、全teacher/EOS/原文/prior/座標を入力に保持し、reception token以外のloss labelsだけ-100へする。因果shiftはfirst_target-1からのlogits tail、mask対象数・token境界・完全teacher-prefixを照合。既存r.teacher_lossは連続assistant全体専用なので流用しない。CPUでfull input/EOS保持・mask対象・因果前位置・境界跨ぎ拒否を確認し、独立read-only agentもshift/保存/reload/4stepをreviewした。新しいtest基盤は作らない。

2教師×2周=4update（順0/1/0/1）、AdamW1e-5・weight_decay0・clip1・seed20261024、既存q/v16module/32 LoRA tensors、BF16/SDPA、context8192/greedy/max_new2048。元adapterを保持し新pathへ保存→非学習reload→同FIT2だけ各1生成、無補修rawを同API7a4dc32の実consumerへ渡す。初回意味/本文/実問いと訂正意味/3更新/未変更repair-result-joyを保持し、本文2/2へ進むかを判断。loss低下や教師との文章一致だけを採用成功にしない。退行/失敗/1800秒で打切り、追加update・再試行0。旧planを再開しない。

同A4500だけ、process1800秒/表示$0.26/h按分上限$0.13（Pod保持/準備/回収/税を含むhard capではない）。元/new adapterの3hash/32tensor有限性、全raw/source/actual planを回収して持出し可能に保管する。元4B全重み/optimizer/RNGは非同梱。Stop/再起動/削除/新Pod/charge/新依存/本人DB/Render/Supabase/通常有効化/merge/deploy0。教材追加・観測会は今回不要。STRUCTURE_MAP_DELTA_NONE、商品credit0/正式0/3/54.50％を維持する。
