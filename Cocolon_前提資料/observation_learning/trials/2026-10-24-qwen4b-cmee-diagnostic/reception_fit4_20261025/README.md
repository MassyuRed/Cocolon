# 受け取り部分へlossを絞る4更新の一回候補

完了・本文改善なしにつき不採用。局所分岐の実測は[branch_check](../branch_check_20261025/README.md)。教師「ようになって」がrank2/p23.73％、actual「ようになった」がrank1/p50.24％、gap0.75だった。全体平均lossの改善だけでは未解消だった局所誤りへ、同じ教師のreceptionだけを学ぶ最小candidateを一回行う。形式tokenの比重が原因という説明は仮説で、有効性は未確認。

Mashの今回の継続指示の範囲で、root華恋が単一実行/編集/反映owner、補助agentは読取review。Codex Work/GPT-6、別model Pro/Ultraの実行とは称さない。OBSERVED_BLOCKER_MINIMAL_FIX、Rule18 LEVEL2内の学習実装technique。商品目的・method family/意味契約・教師・採用条件・既存private注入routeは変更しない。既存LoRAのloss対象だけ変える。全体現在地・必読incident・work rules・全体設計01/全file地図01A・最新weekly§31/観測学習意図・原raw/実codeを確認。System Contextの最新cache未生成は保持しfresh原本から進める。

既存公開済み架空chair2教師だけ、a8baf0…保存重みから新optimizer。元messages1995/5018token、全teacher/EOS/原文/prior/座標を入力に保持し、reception token以外のloss labelsだけ-100へする。因果shiftはfirst_target-1からのlogits tail、mask対象数・token境界・完全teacher-prefixを照合。既存r.teacher_lossは連続assistant全体専用なので流用しない。CPUでfull input/EOS保持・mask対象・因果前位置・境界跨ぎ拒否を確認し、独立read-only agentもshift/保存/reload/4stepをreviewした。新しいtest基盤は作らない。

2教師×2周=4update（順0/1/0/1）、AdamW1e-5・weight_decay0・clip1・seed20261024、既存q/v16module/32 LoRA tensors、BF16/SDPA、context8192/greedy/max_new2048。元adapterを保持し新pathへ保存→非学習reload→同FIT2だけ各1生成、無補修rawを同API7a4dc32の実consumerへ渡す。初回意味/本文/実問いと訂正意味/3更新/未変更repair-result-joyを保持し、本文2/2へ進むかを判断。loss低下や教師との文章一致だけを採用成功にしない。退行/失敗/1800秒で打切り、追加update・再試行0。旧planを再開しない。

同A4500だけ、process1800秒/表示$0.26/h按分上限$0.13（Pod保持/準備/回収/税を含むhard capではない）。元/new adapterの3hash/32tensor有限性、全raw/source/actual planを回収して持出し可能に保管する。元4B全重み/optimizer/RNGは非同梱。Stop/再起動/削除/新Pod/charge/新依存/本人DB/Render/Supabase/通常有効化/merge/deploy0。教材追加・観測会は今回不要。STRUCTURE_MAP_DELTA_NONE、商品credit0/正式0/3/54.50％を維持する。

## 実結果と判断

source bc9cd9977d6906da5a2049bb9dcea8693925a76d、API7a4dc32、250.99854906834662秒。4step/同2target、before rawは保存原本を再利用、新after2生成のみ。初回1995→1095token/56.30565456300974秒、訂正5018→1876token/99.61830811109394秒、JSON/stop2/2。reception25/24tokenの平均NLLは初回0.05817059427499771→0.04138212278485298、訂正0.09130503982305527→0.07363682240247726。しかしraw_textとparsed packetは**両方の入力で前後完全同一**。損失低下を生成品質改善へ数えない。

既存verify_cmee.consume_rawを固定7a4dc32のcleanなCMEE sourceへ接続し、前後各2件を無補修で消費。前後とも意味2/2・本文1/2、初回QUESTION_PENDING/同一問い、訂正MEANING_UPDATED_BODY_UNAVAILABLE/model_surface_not_validated。初回全意味/本文/問い・訂正3更新は同じparsed packetに保たれるが、受け取り第2文も同じ「またその椅子に座れるようになったのですね。」で不通過。before/after_cmee.jsonが実checkpoint/全意味/全本文/採否を所有する。これらは独立した4個の成功や動的model一往復/実DB保存へ加算しない。APIソースはsparse checkoutでinferenceだけ取得し、tracked dirtyなし、新依存/secret/本人DB取得0。

新adapter e3743d6ba5dd715868a5e41d568a1bddb57b307f79a87fdd385eb90d03837d02は不採用、選択済み旧adapter a8baf0d310283fd0500e86887e64723e4734693ac48b7f2ddfad7cc07e6a3ea6を維持。元3file hash不変、新adapterは保存→非学習reload後も3hash不変。全32F32tensor有限性・全24memberのsize/hashをPod外で照合。peak allocated 12.606467247009277/reserved 13.697265625GiB。元base4B全重み/optimizer/RNGは含まず、厳密途中再開ではない。

重みarchive SHA256 86ac452ac9d50f223d313b4e98409ece317e56c7617f6144bfc3a3c7f52f9344、3,499,146bytes、永続保管ID libfile_cbe77bb15ad081918e252f6427c8a8c8。取得後の受領hashをPod上でprogram比較True。原生成/学習/CPU consumeの再実行0。実planはactual_plan.jsonへ保持し、pack planは終了済み/再実行不可へ閉じる。表示$0.26/hによる本process按分$0.018127672988269478は準備/保持/回収/税を含む請求総額ではない。局所診断13.145秒と、全作業の保持時間を分ける。

### 残件と次の最初の一手

次は保存済み不採用e3743d…の同じ分岐prefixを非学習1forwardだけ測り、旧a8baf0のgap0.75と比較して、4更新で局所順位がどう変わったかを確認する。追加学習・新prompt・教師増量・reader緩和・raw補修・新生成を自動で行わない。

今回の結果は局所誤りの特定と一つのloss候補の不採用。最小反応教材の不足、一般的な学習不能、4B全般の不適性は、この2例から断定しない。今回の形式/受け取り問題について観測会は不要。既存2teacherと18候補/旧9teacher/evalは不変。Piece/Analysisの完成教師0・三中核一般品質/通常application接続/実model動的往復/本人保存再読/量子化移行/本番可用性は別の未完了。

BLOCKER_NARROWED、product_credit0・正式0/3・54.50％。GPU停止/再起動/削除/新Pod/charge/新依存/Render/Supabase/通常有効化/merge/deploy0。GPUは指示まで稼働保持。全機能00・観測目的/pack・weekly§32・file地図01A・current01/04を同じ結果変更単位で同期。全体設計01は責務/公開contractの差がなく更新不要、STRUCTURE_MAP_DELTA_NONE。
