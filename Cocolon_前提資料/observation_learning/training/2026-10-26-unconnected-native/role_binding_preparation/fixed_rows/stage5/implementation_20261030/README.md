# 承認済み5区間・一回実装

2026-10-30、Mashはproposal 249a92952457e88c960a028a3e0b44fe2bb5858dに対し「進めていいよ。」と承認。CPU先行、区間10＋旧9の19更新、初期11446641、保存・非学習reload、BOOK/SHOP各最大5call、実出力だけを次段へ渡し全13位置を機械結合、派生providerで既存CMEE/cold、両題成功時のみ旧9実生成。最大45分/$0.21 GPU処理按分（準備・回収・保持等別）。一回のみ、再試行・補修・採用緩和・追加更新なし。

このcommitは実行前source固定。CPU/GPU未実行、効果未確認。中間は未採用候補。CPUで原教師2件の完全復元・実snapshot receipt来歴保持・cold完全一致・旧9保存rawの不変を先に確認する。CMEE snapshotは5段の連鎖自体を検証しないため、外部の全stage raw/messages/hashと派生packetを合わせて検証する。prior_snapshotの歴史receiptは保存し、現snapshot直下のreceiptを照合する。

| ファイル | 責務 |
| --- | --- |
| plan.json | 今回の明示承認、19順序、初期/教材identity、固定上限、3source SHA |
| consume_stage5.py | 5段/13位置の無損失分割・structural拒否・実前段prompt連鎖・派生packet・receipt全体照合 |
| prepare_stage5.py | CPUのみtokenizer/19教材/EOS/context/8来歴負例/教師CMEE-cold/旧9保存raw検査。model load/forward0 |
| run_stage5_once.py | 一回親timeout2690+kill10、19 full CE更新、保存/112F32非学習reload、各段live context、実raw生成/既存CMEE/cold/条件付き旧9、部分重み保存 |

元material/prior/request/spec/完成教師値を削らない。ordered_field_namesは既存13位置名だけの補助。CPU学習例の前段goldと、評価の前段actual model rawを区別する。新API/receiver/DB/RN/Render/Supabase/依存変更なし。STRUCTURE_MAP_DELTA_NONE、商品0/正式0/3/54.50％据置。現2題に追加観測会不要。GPUは停止・再起動・削除しない。
