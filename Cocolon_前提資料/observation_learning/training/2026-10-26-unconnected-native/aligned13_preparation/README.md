# 現入力一致＋保存d431からの13更新 — 新しい限定継続学習

2026-10-28 JST。Mashの今回の「4B学習＋CMEE接続を続けて」に基づく新しい一回。前回の消費済み非学習probeは再利用しない。現在のquote形式・意味/本文reader・凍結教師・loss/LRを維持し、学習入力を実際のAPI64へ揃える。実行前のCPU/入力/source原本をここで固定し、実結果は別のaligned13_resultへ保存する。商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false。

## 今回変えるものと根拠

保存d431が実学習したのはAPIa4b91b4のquote形式。現在のAPI64は回答後5件でprior内のstart/end計12項目ずつをモデル向けコピーから除いた。quote形式自体が未学習なのではなく、この入力差が未学習である。native15/localized30/adaptive30のassistant全文15件は同一。localized30とadaptive30は109cからの別runで、9372はd431の祖先ではない。今回は初めてd431の学習結果を初期重みにして次の学習を行う。optimizer/RNG/stepの厳密な途中再開ではない。

直近の更新義務を列挙した指示候補は使わず、不採用を維持。比較beforeは同じAPI64＋d431のprior_quote_probe2_resultの無補修raw2件/意味・本文0/2で、update_obligations_probe2_resultと混ぜない。入力一致とd431からの累積継続を同時に変えるため、改善してもどちらか単独の寄与とは断定しない。新しい名前参照/短縮schemaは別contractが必要なため今回は採らない。

## 範囲

- 旧chair/daily9教師を各1回、BOOK/SHOP回答後を各2回、計13更新/11既知ケース。新初回4件は学習しない。教師本文・意味・EOS・改行は全15で不変。
- 固定4B revision851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a、d431の112 F32/3,833,856parameter。既存AdamW LR1e-5/weight_decay0/clip1/seed20261024、旧9元CE・対象2既存adaptive extra15/gamma2を保つ。
- 別候補へsave→112tensor非学習reload→BOOK/SHOP回答後各1自由生成。before新生成0、after最大2、3712cap/context8192。原d431は変更しない。raw補修やreaderの採用基準変更0。
- Pod94a06hhxu51uy4/A5000/$0.28時、全体600秒（外590＋kill10）・各生成180秒、処理按分上限$0.047。準備/CPU/回収/保持/保存/通信/税等別。失敗は部分重み保全を試み、retry/次GPU試行0。GPU保持/Stop等0。

以前の30更新は全1511.033秒−15生成1094.395秒＝非生成416.638秒。今回13行は68,092系列token/28,899target tokenで旧30の系列token比51.81％・長さ二乗比61.02％。過去2生成処理235.327秒との感度計算は約451〜490秒だが、比例保証や600秒内完走保証は置かない。

## Jupyter実CPU確認

actual_cpu_check.jsonは17.505427077994682秒。実build_model_messages15件が現在のAPI64と一致、d431実学習入力との差は回答後5件の座標除去のみ。全teacher target IDs/EOS/終端改行不変、最大生成枠込み8077/8192、全15教師の意味・本文が未変更CMEEで成立。これは合成教師のCPU接続確認であり、実4B生成や商品品質の成功ではない。旧raw2件の同CMEE再生は0/2、未authorize executeはoutput/modelより前に拒否した。新model/forward/学習/生成/SQL/pytest0、CUDA未初期化。

reviewで既存check_adapter_cpu.pyのimport版照合1行を補い、初CPU原本をhistory_cpu_v1へ保持して最終CPUを再実行した。helper SHA e5ad2054c5d8b4abc5e1487c370e7eba355dbd432e1e0d086ea0d445c2063953をimport前照合する。mask/EOS/optimizer不具合を直したのではなく、既存実装の版固定である。

CPU原本ZIPは88,626bytes/20payload＋manifestの21member、SHA256 45ce238afbf5647a37a0822035fa657d36c81ccf73fc927695761627507827e8。CRC/全bytes/hash/sourceをPod外照合済み。ZIP内のplanは実行許可の固定前で、現在のaligned13.plan.jsonと区別する。実行planは今回の継続指示をbasisに新たに固定し、消費済みの前試行から許可を継承しない。

この準備の必要性はDIRECT_PRODUCT_OR_ACCEPTANCE_WORK、実行はroot Codex Work/GPT-6の単一owner、補助は既存source/lossと条件のread-only review。正式な別Pro/Ultraまたは人手受入れと報告しない。完了は一回の実学習・保存再読込・最大2raw・同CMEE/本文/全更新/採用時cold確認・原本回収と記録。通常API/DTO/DB/RN/Render/Supabase/merge/deploy変更0、STRUCTURE_MAP_DELTA_NONE。

既知after2だけの評価で、旧9への学習投入を旧9自由生成の回帰成功へ換算しない。新初回4・全15・動的一往復・未知一般化・Piece/Analysis/本人端末は未確認。既存教師に必要内容があり、現不具合に新観測会は不要。
